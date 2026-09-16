---
title: Installation
description: Complete steps to install and configure the ZombieCs plugin on a CS2 community server running the SwiftlyS2 framework.
---

ZombieCs runs on top of [SwiftlyS2](https://swiftlys2.net/) — a modern .NET-based scripting framework for CS2 servers with plugin support in C#.

## Prerequisites

- A working Counter-Strike 2 community server (Windows or Linux)
- **SwiftlyS2 v1.4.x** or newer installed
- Read/write access to your server files

:::note[About the framework]
ZombieCs is a SwiftlyS2 plugin. It is **not compatible** with CounterStrikeSharp or SourceMod plugins — do not mix them into the same directories.
:::

## Step 1: Install SwiftlyS2

If the framework is not installed yet, complete this step first.

1. Download the archive for your OS from the [SwiftlyS2 releases page](https://github.com/swiftly-solution/swiftlys2/releases). **For a first-time install, pick the build with `with-runtimes` in the filename** — it bundles the required .NET runtime.

2. Extract the archive. You will get an `addons/` directory — copy it into your server's `game/csgo`.

3. Open `game/csgo/gameinfo.gi` and find this line:

   ```
   Game_LowViolence csgo_lv
   ```

   Add the following line **below** it:

   ```
   Game csgo/addons/swiftlys2
   ```

4. Save the file and restart your server. Run the following command in the server console to verify the framework loaded:

   ```
   sw
   ```

   If you also use MetaMod:Source, place `Game csgo/addons/swiftlys2` **after** the metamod entry.

## Step 2: Install ZombieCs

1. **Download the plugin**

   Grab `ZombieCs.zip` from the releases page and extract the `ZombieCs/` folder (containing the same-named `.dll` and a `resources/` directory).

2. **Copy the files**

   Place the entire `ZombieCs/` folder into the SwiftlyS2 plugins directory:

   ```
   game/csgo/addons/swiftlys2/plugins/ZombieCs/
   ```

   :::caution[Do not skip the resources folder]
   The plugin directory must contain both `ZombieCs.dll` and a sibling `resources/` directory (map configs, translations, gamedata). Shipping only the DLL will result in missing resources.
   :::

3. **Generate the config file**

   Restart the server or change the map once; the plugin will automatically create its config at:

   ```
   game/csgo/addons/swiftlys2/configs/plugins/ZombieCs/config.jsonc
   ```

   Use it to set the default mode, round duration, zombie stat multipliers, economy values, and more. After editing, hot-reload the config with the command below — no server restart needed.

4. **Restart the server**

   Restart the server or change the map to finish loading.

## Verifying the Install

Once on the server, type the following in chat or console:

```
!zombiecs
```

The plugin responds with the current mode, round state, and version — that means it loaded successfully.

## Admin Commands

| Command | Description | Permission |
| ------- | ----------- | ---------- |
| `!zm mode <mode>` | Switch game mode | Admin |
| `!zm reload` | Reload the config file | Admin |
| `!zm start` / `!zm stop` | Manually start / end the current round | Admin |
| `!zm status` | Show current status | Everyone |
| `!zm menu` | Open the player menu (ability selection, etc.) | Everyone |

### Mode Arguments

| Argument | Mode |
| -------- | ---- |
| `mode 1` / `mode 2` / `mode 3` | Zombie Mode Ⅰ / Ⅱ / Ⅲ |
| `mode z` | Zombie Mode Z |
| `mode union` | Zombie Union War |

For example, to switch to Zombie Mode Z:

```
!zm mode z
```

:::tip[Hot reload]
SwiftlyS2 supports plugin hot reload. During development you can replace the plugin directory and trigger a reload with the framework's command — state is reported through `Load(bool hotReload)` so the plugin can restore itself.
:::

## Directory Layout Reference

```
game/csgo/
└── addons/
    └── swiftlys2/
        ├── plugins/
        │   └── ZombieCs/
        │       ├── ZombieCs.dll
        │       └── resources/
        │           ├── gamedata/       # offsets and signatures
        │           ├── maps/           # per-map point configs
        │           └── translations/   # localized strings
        ├── configs/
        │   └── plugins/
        │       └── ZombieCs/
        │           └── config.jsonc
        └── gamedata/
            └── cs2/core/*.jsonc
```
