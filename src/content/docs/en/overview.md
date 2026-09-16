---
title: Introduction
description: ZombieCs is a CS2 community server plugin built on the SwiftlyS2 framework, faithfully recreating the classic Zombie modes from CSOL.
sidebar:
  order: 1
---

**ZombieCs** is a game plugin for Counter-Strike 2 community servers, written in C# on top of the [SwiftlyS2](https://swiftlys2.net/) framework. It aims to faithfully recreate the classic Zombie modes from Tencent's CSOL — including **Zombie Mode 1, Zombie Mode 2, Zombie Mode 3, Zombie Mode Z**, and **Zombie Union War**.

:::tip[Landing page]
Visit the [landing page](/) for a visual overview of all five modes.
:::

## Tech Stack

| Item | Detail |
| ---- | ------ |
| Framework | SwiftlyS2 (C++ core + C# managed layer) |
| Language | C# / .NET |
| Target game | Counter-Strike 2 community servers |
| Platforms | Windows / Linux |
| License | GPLv3-friendly, consistent with the SwiftlyS2 ecosystem |

## Modes at a Glance

| Mode | Core mechanic |
| ---- | ------------- |
| Zombie Mode Ⅰ | Random mother zombie, instant infection on kill, classic holdout |
| Zombie Mode Ⅱ | Multi-stage zombie evolution, human supply drops |
| Zombie Mode Ⅲ | Hero awakening system, zombie rage burst |
| Zombie Mode Z | In-round leveling + random mutation ability combinations |
| Zombie Union War | Large-scale two-faction team battle, humans vs the horde |

## Why SwiftlyS2

- **Modern C# development**: async/await, dependency injection, the full .NET ecosystem
- **Native engine access**: calls straight into Source 2 internals with virtually no overhead
- **Hot reload**: swap the plugin and it takes effect immediately, with state preserved across reloads
- **Memory safety**: the managed abstraction layer avoids the leaks and crashes common in native plugins
- **Complete API**: commands, cvars, entities, event hooks, Protobuf net messages, databases, menus, and sounds

## Features

- **Native CS2 experience**: low latency, high frame rates, fully modernized visuals
- **Five classic modes**: everything a veteran CSOL player remembers, in one plugin
- **Continuous updates**: maps, weapons, zombie models, and balance are iterated on regularly
- **Fair play**: no pay-to-win, all strength comes down to aim and strategy

## Next Steps

- [Installation](/guides/installation/): deploy ZombieCs on your SwiftlyS2 server
- [Zombie Mode Ⅰ](/modes/mode-1/): start with the classic infection mode
