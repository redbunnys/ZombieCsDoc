---
title: Zombie Mode Z
description: Infinite evolution — in-round leveling combined with random mutation abilities for a fresh experience every round.
sidebar:
  order: 4
---

**Zombie Mode Z** has the deepest gameplay: leveling plus a random ability pool means every round plays out differently.

## Core Mechanics

### In-Round Leveling

Humans and zombies earn experience through kills, infections, and damage dealt, raising their in-round level.

### Random Mutations

On each level-up you pick from randomly offered abilities. The pool contains dozens of effects:

- **Super Jump**: leap onto almost any position with ease
- **Speed**: a major movement speed boost
- **Steel Body**: reduced bullet damage
- **Ammo Frenzy**: unlimited ammunition
- …and more abilities are added over time

### Free Combinations

Abilities stack and combine, letting you build your own ultimate setup — whether that is an unstoppable steel zombie king or a mobile turret with endless firepower.

:::note
Ability offers are somewhat random. Adapting your picks to the current situation is the smart play.
:::

## Controls

| Action | Description |
| ------ | ----------- |
| `!zm menu` | Open your ability panel and review acquired abilities |
| Follow the prompt on level-up | Choose one of three randomly offered abilities |
| Type the ability number in chat | Quick select |

## Configuration

```jsonc
// addons/swiftlys2/configs/plugins/ZombieCs/config.jsonc
{
  "modeZ": {
    "enabled": true,
    "maxLevel": 30,
    "choicesPerLevelUp": 3,
    "abilityPool": ["superjump", "speed", "steelbody", "infiniteammo"],
    "humanExpPerKill": 20,
    "zombieExpPerInfect": 30
  }
}
```

:::tip[Extending the ability pool]
Abilities are modular. Adding a new one only requires appending it to `abilityPool` and providing its parameters in `resources/` — no changes to the plugin core needed.
:::
