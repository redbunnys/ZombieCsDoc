---
title: Zombie Union War
description: Faction warfare — an all-out war between the human legion and the zombie horde.
sidebar:
  order: 5
---

**Zombie Union War** is no longer a cat-and-mouse chase. It is a **head-on team battle between two factions**: humans and zombies.

## Rules

- Players are split into the **human legion** and the **horde faction**
- Both sides accumulate victory points by killing enemies and capturing strongholds
- The first faction to reach the target score (or the one leading when time expires) wins

## Core Mechanics

### Stronghold Capture

Multiple strategic strongholds are placed across the map. Holding one continuously generates points and buffs for your faction.

### Faction Growth

Factions accumulate resources through combat and unlock faction-wide upgrades — heavy fire support for humans, higher-tier mutations for zombies.

### AI Horde Support

The horde faction is reinforced by AI-controlled zombie units, keeping the frontline strong even when outnumbered.

## Strategy

- Strongholds matter more than kills — do not tunnel-vision on frags
- Alternating between diversionary splits and concentrated pushes is the key to advancing in Union War

## Configuration

```jsonc
// addons/swiftlys2/configs/plugins/ZombieCs/config.jsonc
{
  "union": {
    "enabled": true,
    "targetScore": 500,          // points required to win
    "captureInterval": 5,        // stronghold scoring interval in seconds
    "pointsPerCapture": 3,
    "aiZombieCount": 4,          // AI zombies added per side
    "mapConfigs": {              // per-map points; can also live in resources/maps/
      "de_dust2": { "capturePoints": ["A", "B", "MID"] }
    }
  }
}
```

:::tip[Map points]
Storing stronghold positions in `resources/maps/<mapname>.json` inside the plugin directory is recommended — it keeps them per-map and prevents your config from being overwritten on upgrade.
:::
