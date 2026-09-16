# ZombieCs 文档站

ZombieCs 是一个 **Counter-Strike 2** 社区服务器插件，复刻 CSOL 的经典生化玩法：
**生化模式 1 / 2 / 3**、**生化模式 Z**、**生化盟战**。
本仓库是该插件的**宣传落地页 + 使用文档站**，基于 [Astro](https://astro.build) 与
[Starlight](https://starlight.astro.build) 构建，采用
[starlight-theme-flexoki](https://delucis.github.io/starlight-theme-flexoki/) 主题，
部署目标为 **Cloudflare Workers**。

## 站点结构

| 路径 | 内容 |
| :-- | :-- |
| `/` | 中文宣传落地页（暗色生化风格，占据站点根路由） |
| `/en/` | 英文宣传落地页 |
| `/zombiecs` | 中文落地页的别名入口 |
| `/overview` | 文档首页 · 插件介绍 |
| `/guides/installation` | 安装指南（SwiftlyS2 + ZombieCs） |
| `/modes/mode-1` `mode-2` `mode-3` `mode-z` `union` | 五个游戏模式详解 |
| `/en/...` | 以上文档的英文版本 |
| `/404` · `/en/404` | 中英双语 404 页 |

**国际化**：中文为默认语言（根路径无前缀），英文位于 `/en/`。
落地页与文档页均带 `hreflang` alternate 链接，页面内提供语言切换入口。

## 环境要求

- Node.js **>= 22.12.0**
- npm（仓库内 `package-lock.json` 已锁定版本，CI 请用 `npm ci`）

## 本地开发

```sh
npm install          # 安装依赖
npm run dev          # 开发服务器 http://localhost:4321
npm run build        # 产物输出到 dist/
npm run preview      # 本地预览构建结果
```

> 首次 `npm install` 会自动执行 `scripts/ensure-satteri-wasm.mjs`。
> 该脚本用于补装 satteri 的 WASM 后备绑定，**Cloudflare 构建必需**，详见下方「已知问题」。

## 部署到 Cloudflare

项目已接入 `@astrojs/cloudflare` 适配器，配置见根目录 `wrangler.jsonc`
（Worker 名 `zombiecsdoc`，静态资源目录 `./dist/client`）。

### 首次部署

```sh
npm run cf:login          # 浏览器登录 Cloudflare 账号
npm run deploy            # = npm run build && wrangler deploy
```

### 常用命令

| 命令 | 说明 |
| :-- | :-- |
| `npm run deploy` | 构建并部署到 Cloudflare |
| `npm run deploy:dry-run` | 只构建 + 打包演练，不实际上传（用于验证配置） |
| `npm run cf:preview` | 用 `wrangler dev` 在本地模拟 Worker 运行 |
| `npm run cf:whoami` | 查看当前 Cloudflare 登录身份 |
| `npm run generate-types` | 生成 `worker-configuration.d.ts` 环境类型 |

### 通过 Workers Builds（Git 集成）自动部署

在 Cloudflare Dashboard → Workers & Pages → 创建 Worker → 关联本仓库，配置：

- **Build command**：`npm run build`
- **Deploy command**：`npx wrangler deploy`
- **环境变量**：无需额外变量；构建时请确保使用 Node 22+

### 绑定（Bindings）

`@astrojs/cloudflare` 会自动声明以下绑定，无需手动配置：

| 绑定 | 类型 | 用途 |
| :-- | :-- | :-- |
| `ASSETS` | 静态资源 | 托管 `dist/client` 内的页面与资源 |
| `SESSION` | KV Namespace | 会话存储 |
| `IMAGES` | Images | 图片处理 |

> 站点为纯静态输出，运行时不需要 Worker 逻辑；`SESSION` / `IMAGES` 由适配器预留。

## 已知问题

### `Rolldown failed to resolve import "@bruits/satteri-wasm32-wasi"`

启用 Cloudflare 适配器后构建可能报此错。原因：

1. `satteri`（Astro / Starlight 用于 Markdown 处理的 NAPI 原生绑定）的
   `browser.js` **无条件** re-export `@bruits/satteri-wasm32-wasi`；
2. 该包声明了 `cpu: ["wasm32"]`，在常规 x64 / arm64 机器上会被 npm 判定为
   平台不匹配而**跳过安装**；
3. 纯静态构建不走 browser 解析分支，所以此前不会暴露；Cloudflare 适配器会把页面
   打包成 worker，Vite 按 browser 条件解析，于是命中缺失模块。

**解法**：仓库已在 `postinstall` 中自动补装（`scripts/ensure-satteri-wasm.mjs`），
脚本会从 npm registry 解析 tarball 地址、下载并解压到
`node_modules/@bruits/satteri-wasm32-wasi/`，全程只写这一个目录。

该包为纯 WASM，跨平台通用，在任意平台安装均安全。

#### ⚠️ 不要用 `npm install --cpu=wasm32`

早期实现使用 `npm install <pkg> --cpu=wasm32`，**已在云构建环境上翻车，请勿改回**。

`--cpu=wasm32` 会覆盖该次 npm 进程的**全局** CPU 判定，而构建机是 x64。npm 因此把所有
「平台不匹配」的原生绑定当作冗余清除 —— 实测在 Cloudflare Workers Builds 上连带删除
16 个包（含 `@rolldown/binding-linux-x64-gnu`），随后 `astro build` 直接失败：

```text
Error: Cannot find native binding.
Cannot find module '@rolldown/binding-wasm32-wasi'
Cannot find module './rolldown-binding.wasi.cjs'
```

下载 tarball 直解的方式不经过 npm 的依赖树求解，因此不存在这个连坐问题。

> 另注：仅写进 `package.json` 的 `optionalDependencies` 也**不够** —— npm 会认为
> 版本已满足而直接跳过，不落盘。

## 项目结构

```text
├── public/                       静态资源（favicon 等）
├── scripts/
│   └── ensure-satteri-wasm.mjs   postinstall 补装 satteri WASM 绑定（下载 tarball 直解）
├── src/
│   ├── components/               覆盖的 Starlight 组件
│   │   ├── PageFrame.astro       顶部「正在开发中」提示条（固定在最顶端）
│   │   ├── SiteTitle.astro       站点标题 → 当前语言的文档首页
│   │   └── SocialIcons.astro     顶栏「返回首页」+ 社交入口
│   ├── content/
│   │   ├── docs/                 中文文档（根路径）
│   │   │   ├── en/               英文文档（/en/）
│   │   │   ├── guides/
│   │   │   └── modes/
│   │   └── i18n/en.yml           Starlight 内置 UI 文案的英文覆盖
│   ├── pages/
│   │   ├── zombiecs.astro        双语宣传页组件（接收 lang prop）
│   │   ├── index.astro           `/` → <ZombieCsPage lang="zh" />
│   │   └── en/index.astro        `/en/` → <ZombieCsPage lang="en" />
│   └── content.config.ts         docs + i18n 内容集合
├── astro.config.mjs              Starlight / i18n / Cloudflare 适配器配置
├── wrangler.jsonc                Cloudflare Worker 配置
└── package.json
```

## 技术栈

- **Astro 7** + **Starlight**（文档框架）+ **starlight-theme-flexoki**（主题）
- **SwiftlyS2** —— 插件本体所基于的 CS2 服务端框架（C# / .NET）
- **Cloudflare Workers** —— 部署目标

## 说明

本仓库内容为玩家社区宣传与文档用途。项目仍在开发中，插件功能与文档持续更新。
