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
 * 注意两个坑：
 *  1. 仅写进 package.json 的 optionalDependencies 不够 —— npm 会认为「版本已满足」
 *     而直接跳过，不落盘。必须显式 install。
 *  2. 只加 `--force` 也不够，仍需 `--cpu=wasm32` 才能绕过 cpu 平台校验真正安装。
 *
 * 脚本始终以退出码 0 结束：缺失该包只影响 Cloudflare 构建，不应阻断普通安装。
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const PKG_NAME = '@bruits/satteri-wasm32-wasi';
const PKG_DIR = join(projectRoot, 'node_modules', ...PKG_NAME.split('/'));

/** 读取 satteri 声明的 WASM 后备版本，默认回落到 package.json 中锁定的版本。 */
function resolveWantedVersion() {
	try {
		const satteriPkg = JSON.parse(
			readFileSync(join(projectRoot, 'node_modules', 'satteri', 'package.json'), 'utf8'),
		);
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

function main() {
	// 仅在 satteri 存在时才需要补这个后备绑定
	if (!existsSync(join(projectRoot, 'node_modules', 'satteri'))) return;

	if (existsSync(PKG_DIR)) return;

	const version = resolveWantedVersion();
	if (!version) {
		console.warn(`[ensure-satteri-wasm] 无法确定 ${PKG_NAME} 的版本，跳过。`);
		return;
	}

	console.log(`[ensure-satteri-wasm] 正在补装 ${PKG_NAME}@${version} …`);
	try {
		execSync(
			`npm install ${PKG_NAME}@${version} --no-save --force --ignore-scripts --cpu=wasm32 --no-audit --no-fund`,
			{ cwd: projectRoot, stdio: 'inherit' },
		);

		if (existsSync(PKG_DIR)) {
			console.log(`[ensure-satteri-wasm] 完成：${PKG_NAME}@${version}`);
		} else {
			console.warn(
				`[ensure-satteri-wasm] 安装命令已执行但 ${PKG_NAME} 仍未落盘，Cloudflare 构建可能失败。`,
			);
		}
	} catch (error) {
		console.warn(
			`[ensure-satteri-wasm] 补装失败（不影响静态构建，仅 Cloudflare 构建会受影响）：${
				error?.message ?? error
			}`,
		);
	}
}

try {
	main();
} catch (error) {
	console.warn(`[ensure-satteri-wasm] 跳过：${error?.message ?? error}`);
}

// 该脚本为辅助性质，任何失败都不应阻断 npm install
process.exit(0);
