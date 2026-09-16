/**
 * 确保 satteri 的 WASM 后备绑定已安装。
 *
 * 背景：`satteri` 是 Astro / Starlight 用于 Markdown 处理的原生绑定（NAPI-RS）。
 * 它的 `browser.js` 会无条件 re-export `@bruits/satteri-wasm32-wasi`，而该包在
 * package.json 中声明了 `cpu: ["wasm32"]`，因此在常规 x64 / arm64 机器上会被
 * npm 当作平台不匹配而跳过安装。
 *
 * 平时 `astro build`（纯静态输出）不走这条分支，不会暴露问题；但一旦启用
 * `@astrojs/cloudflare` 适配器，页面代码会被打包成 worker，Vite 按 browser
 * 条件解析依赖，就会命中缺失的 WASM 模块并报错：
 *
 *   [vite]: Rolldown failed to resolve import "@bruits/satteri-wasm32-wasi"
 *   from "node_modules/satteri/browser.js"
 *
 * 该包是纯 WASM（跨平台通用），在任意平台安装都安全。这里在 postinstall 阶段
 * 检测并按需补装，保证 CI / 全新克隆也能正常构建。
 *
 * ── 实现方式 ────────────────────────────────────────────────────────────────
 * 关键：**不能**用 `npm install <pkg> --cpu=wasm32` 来装。
 *
 * `--cpu=wasm32` 会覆盖该次 npm 进程的全局 CPU 判定，而 CI 机器是 x64。于是
 * npm 会把整棵依赖树里所有「平台不匹配」的原生绑定当作冗余清除掉 —— 实测在
 * Cloudflare Workers Builds 上会连带删除 16 个包（含
 * `@rolldown/binding-linux-x64-gnu`），导致随后的 `astro build` 报：
 *
 *   Error: Cannot find native binding.
 *   Cannot find module '@rolldown/binding-wasm32-wasi'
 *   Cannot find module './rolldown-binding.wasi.cjs'
 *
 * 因此改为：直接解析 npm registry 上的 tarball 地址 → 下载 → 解压到
 * `node_modules/<pkg>/`。全程只写这一个目录，不触碰其他任何依赖，幂等且与
 * 平台无关。
 *
 * 另外两个已知坑（保留备查）：
 *  1. 仅写进 package.json 的 optionalDependencies 不够 —— npm 会认为「版本已满足」
 *     而直接跳过，不落盘。
 *  2. 只给 npm install 加 `--force` 也不够，仍需 `--cpu=wasm32` 才能绕过 cpu 校验；
 *     而正是这个 flag 带来了上面的连坐删除问题 —— 所以彻底弃用该方案。
 *
 * 脚本始终以退出码 0 结束：缺失该包只影响 Cloudflare 构建，不应阻断普通安装。
 */
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const PKG_NAME = '@bruits/satteri-wasm32-wasi';
const PKG_DIR = join(projectRoot, 'node_modules', ...PKG_NAME.split('/'));
const SATTERI_DIR = join(projectRoot, 'node_modules', 'satteri');
const LOG = '[ensure-satteri-wasm]';

/** 读取 satteri 声明的 WASM 后备版本，默认回落到 package.json 中锁定的版本。 */
function resolveWantedVersion() {
	try {
		const satteriPkg = JSON.parse(readFileSync(join(SATTERI_DIR, 'package.json'), 'utf8'));
		const fromSatteri = satteriPkg.optionalDependencies?.[PKG_NAME];
		if (fromSatteri) return fromSatteri;
	} catch {
		// satteri 尚未安装（例如首次 install 的早期阶段），继续走本地声明
	}

	try {
		const ownPkg = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
		return ownPkg.optionalDependencies?.[PKG_NAME] ?? null;
	} catch {
		return null;
	}
}

/** 向 registry 查询该版本的 tarball 下载地址。 */
async function resolveTarballUrl(version) {
	const registry = process.env.npm_config_registry || 'https://registry.npmjs.org';
	const url = `${registry.replace(/\/+$/, '')}/${PKG_NAME.replace('/', '%2f')}`;
	const res = await fetch(url, { headers: { accept: 'application/json' } });
	if (!res.ok) throw new Error(`查询 registry 失败：HTTP ${res.status}`);

	const meta = await res.json();
	// 优先用带版本号的确切 key，避免被 dist-tags 干扰
	const pick = meta.versions?.[version] ?? meta.versions?.[meta['dist-tags']?.latest];
	const tarball = pick?.dist?.tarball;
	if (!tarball) throw new Error(`registry 未返回 ${PKG_NAME}@${version} 的 tarball 地址`);
	return tarball;
}

/** 下载 tarball 并解包到目标目录（npm 包的 tarball 顶层固定是 package/）。 */
async function downloadAndExtract(tarballUrl, version) {
	const res = await fetch(tarballUrl);
	if (!res.ok) throw new Error(`下载 tarball 失败：HTTP ${res.status}`);

	const buf = Buffer.from(await res.arrayBuffer());
	const tmpFile = join(projectRoot, '.satteri-wasm-download.tgz');
	writeFileSync(tmpFile, buf);

	try {
		// 清掉半成品，保证幂等
		rmSync(PKG_DIR, { recursive: true, force: true });
		mkdirSync(PKG_DIR, { recursive: true });

		// 用 npm 自带的 tar 能力解包，避免依赖系统 tar
		const require = createRequire(import.meta.url);
		let tar;
		try {
			tar = require('tar');
		} catch {
			tar = null;
		}

		if (tar) {
			await tar.x({
				file: tmpFile,
				cwd: PKG_DIR,
				strip: 1, // 去掉顶层 package/
			});
		} else {
			// 退路：调用系统 tar（CI 上 Linux 一般都有）
			execFileSync('tar', ['-xzf', tmpFile, '-C', PKG_DIR, '--strip-components=1'], {
				stdio: 'inherit',
			});
		}

		console.log(`${LOG} 完成：${PKG_NAME}@${version}`);
	} finally {
		rmSync(tmpFile, { force: true });
	}
}

async function main() {
	// 仅在 satteri 存在时才需要补这个后备绑定
	if (!existsSync(SATTERI_DIR)) return;

	// 已落盘就跳过（幂等）
	if (existsSync(join(PKG_DIR, 'package.json'))) return;

	const version = resolveWantedVersion();
	if (!version) {
		console.warn(`${LOG} 无法确定 ${PKG_NAME} 的版本，跳过。`);
		return;
	}

	console.log(`${LOG} 正在补装 ${PKG_NAME}@${version} …`);
	const tarballUrl = await resolveTarballUrl(version);
	await downloadAndExtract(tarballUrl, version);
}

try {
	await main();
} catch (error) {
	console.warn(
		`${LOG} 补装失败（不影响静态构建，仅 Cloudflare 构建会受影响）：${
			error?.message ?? error
		}`,
	);
}

// 该脚本为辅助性质，任何失败都不应阻断 npm install
process.exit(0);
