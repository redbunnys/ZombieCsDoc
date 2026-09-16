---
title: Zombie Mode Ⅰ
description: Classic infection — random mother zombie, instant infection on kill.
sidebar:
  order: 1
---

**Zombie Mode Ⅰ** is where it all began — the purest form of zombie infection gameplay.

## Rules

- When a round starts, a number of players are randomly turned into **mother zombies**
- Humans killed by zombies **turn into zombies immediately** and join the horde
- If any humans survive until the round ends, the humans win; if everyone is infected, the zombies win

## Core Mechanics

### Mother Zombie Awakening

Mother zombies have higher health and movement speed. They are the source of the outbreak.

### Knockback and Headshots

Bullets landing on zombies apply **knockback**, and headshots deal bonus damage. Using terrain and concentrated fire to hold a position is the key to survival.

### Classic Holdout

Ammo is limited, escape routes are limited. Pick a position that is easy to defend and hard to assault, form crossfire with your teammates, and hold out until the round ends.

## Related Commands

| Command | Description | Permission |
| ------- | ----------- | ---------- |
| `!zm mode 1` | Switch to this mode | Admin |
| `!zm start` | Start a round immediately | Admin |
| `!zm status` | Show round and infected counts | Everyone |

## Configuration

```jsonc
// addons/swiftlys2/configs/plugins/ZombieCs/config.jsonc
{
  "mode1": {
    "enabled": true,
    "motherZombieRatio": 0.1,   // mother zombies as a share of online players
    "roundTime": 180,           // round duration in seconds
    "knockbackMultiplier": 1.0, // knockback multiplier
    "headshotMultiplier": 3.0   // headshot damage multiplier
  }
}
```

:::caution[Note]
Run `!zm reload` after editing the config for changes to take effect. The current round is unaffected.
:::
