---
title: Zombie Mode Ⅱ
description: Evolution frenzy — multi-stage zombie evolution and human supply drops.
sidebar:
  order: 2
---

**Zombie Mode Ⅱ** builds on classic infection by introducing an **evolution system**. The horde grows stronger the longer it fights.

## New Mechanics

### Zombie Evolution

Zombies accumulate evolution points by infecting humans and can mutate through multiple stages:

- **Higher health**: each stage raises the health ceiling
- **Skill unlocks**: evolved zombies gain special abilities (sprint dashes, ranged projectiles, and more)
- **Model changes**: the appearance changes per stage for maximum pressure

### Supply Drops

During a round, **supply crates** are periodically dropped across the map. Humans who pick them up get:

- Reinforced weapons (grenade launchers, dual SMGs, etc.)
- Ammo resupply and hazmat suits
- One-time special items

## Strategy

- Humans: group up and hold early, contest supplies mid-round, and use reinforced weapons to suppress evolved zombies
- Zombies: spread the infection early and snowball into evolution through sheer numbers

## Configuration

```jsonc
// addons/swiftlys2/configs/plugins/ZombieCs/config.jsonc
{
  "mode2": {
    "enabled": true,
    "maxEvolutionStage": 3,      // maximum evolution stage
    "evolutionExpPerInfect": 25,
    "supplyDropInterval": 45,    // supply drop interval in seconds
    "supplyWeapons": ["weapon_m249", "weapon_xm1014", "weapon_negev"]
  }
}
```

:::note[Evolution stages]
Higher stages mean more health and more knockback resistance, and stage three unlocks an exclusive skill. Each stage's stat curve is tunable.
:::
