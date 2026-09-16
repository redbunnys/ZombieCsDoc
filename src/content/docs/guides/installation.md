---
title: 安装指南
description: 基于 SwiftlyS2 框架，在 CS2 社区服务器上安装和配置 ZombieCs 插件的完整步骤。
---

ZombieCs 运行在 [SwiftlyS2](https://swiftlys2.net/) 框架之上——这是一个基于 .NET 的现代 CS2 服务端脚本框架，使用 C# 开发插件。

## 前置要求

- 一台可正常运行的 CS2 社区服务器（Windows 或 Linux）
- 已安装 **SwiftlyS2 v1.4.x** 或更高版本
- 服务器文件的读写权限

:::note[关于框架]
ZombieCs 是 SwiftlyS2 插件，与 CounterStrikeSharp / SourceMod 插件**不兼容**，请勿混装到对应目录。
:::

## 第一步：安装 SwiftlyS2

如果你尚未安装框架，请先完成这一步。

1. 从 [SwiftlyS2 发布页](https://github.com/swiftly-solution/swiftlys2/releases) 下载对应系统的压缩包。**首次安装请选择文件名带 `with-runtimes` 的版本**，其中已包含所需的 .NET 运行时。

2. 解压后得到 `addons/` 目录，将其复制到服务器的 `game/csgo` 下。

3. 打开 `game/csgo/gameinfo.gi`，找到这一行：

   ```
   Game_LowViolence csgo_lv
   ```

   在它**下方**新增一行：

   ```
   Game csgo/addons/swiftlys2
   ```

4. 保存并重启服务器。在服务端控制台输入以下命令验证框架是否加载：

   ```
   sw
   ```

   如已使用 MetaMod:Source，请把 `Game csgo/addons/swiftlys2` 放在 metamod 那行的**后面**。

## 第二步：安装 ZombieCs

1. **下载插件**

   从发布页获取 `ZombieCs.zip`，解压得到 `ZombieCs/` 文件夹（内含同名 `.dll` 与 `resources/` 资源目录）。

2. **放置文件**

   将整个 `ZombieCs/` 文件夹放入 SwiftlyS2 的插件目录：

   ```
   game/csgo/addons/swiftlys2/plugins/ZombieCs/
   ```

   :::caution[不要遗漏 resources 目录]
   插件目录中必须同时存在 `ZombieCs.dll` 与其同级的 `resources/`（包含地图配置、翻译、gamedata）。只放 dll 会导致资源缺失。
   :::

3. **生成配置文件**

   重启服务器或更换一次地图，插件会自动在以下位置生成配置：

   ```
   game/csgo/addons/swiftlys2/configs/plugins/ZombieCs/config.jsonc
   ```

   可在此设置默认模式、回合时长、僵尸数值倍率、经济参数等。修改后使用下方指令热重载配置，无需重启服务器。

4. **重启服务器**

   重启服务器或切换地图即可完成加载。

## 验证安装

进入服务器后，在聊天框或控制台输入：

```
!zombiecs
```

插件会返回当前模式、回合状态与版本信息，即表示加载成功。

## 管理员指令

| 指令 | 说明 | 权限 |
| ---- | ---- | ---- |
| `!zm mode <模式>` | 切换游戏模式 | 管理员 |
| `!zm reload` | 重载配置文件 | 管理员 |
| `!zm start` / `!zm stop` | 手动开始 / 结束当前回合 | 管理员 |
| `!zm status` | 查看当前运行状态 | 所有人 |
| `!zm menu` | 打开玩家个人菜单（能力选择等） | 所有人 |

### 模式参数

| 参数 | 模式 |
| ---- | ---- |
| `mode 1` / `mode 2` / `mode 3` | 生化模式 Ⅰ / Ⅱ / Ⅲ |
| `mode z` | 生化模式 Z |
| `mode union` | 生化盟战 |

例如切换至生化模式 Z：

```
!zm mode z
```

:::tip[热重载]
SwiftlyS2 支持插件热重载。开发调试阶段可将插件目录替换后使用框架的 reload 指令生效，状态会在 `Load(bool hotReload)` 中收到通知以便自行恢复。
:::

## 目录结构参考

```
game/csgo/
└── addons/
    └── swiftlys2/
        ├── plugins/
        │   └── ZombieCs/
        │       ├── ZombieCs.dll
        │       └── resources/
        │           ├── gamedata/       # 偏移与签名
        │           ├── maps/           # 各地图点位配置
        │           └── translations/   # 多语言文本
        ├── configs/
        │   └── plugins/
        │       └── ZombieCs/
        │           └── config.jsonc
        └── gamedata/
            └── cs2/core/*.jsonc
```
