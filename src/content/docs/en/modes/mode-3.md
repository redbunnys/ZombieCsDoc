---
title: Zombie Mode Ⅲ
description: Hero descent — survivors awaken as hero units for a final showdown against the horde.
sidebar:
  order: 3
---

**Zombie Mode Ⅲ** introduces the signature **hero system**, making late-round comebacks possible.

## New Mechanics

### Hero Awakening

When the surviving human count drops below a threshold, eligible players can awaken as a **hero**:

- Gains an exclusive hero weapon (hero knives, hero wrath, and more)
- Higher movement speed and melee capability
- A killed hero **does not** turn into a zombie

### Zombie Rage

Zombies accumulate **rage** when taking damage and infecting. When rage is full they can burst:

- Sharply increased movement speed and knockback resistance for a short time
- The key tool for breaking through human firing lines

## The Final Showdown

Late rounds usually turn into a head-on **hero vs. horde** battle — the hero trying to save what's left, the horde trying to tear apart the last hope. It is a spectacle.

## Configuration

```jsonc
// addons/swiftlys2/configs/plugins/ZombieCs/config.jsonc
{
  "mode3": {
    "enabled": true,
    "heroThreshold": 3,          // survivors below this count may awaken a hero
    "heroChance": 0.25,          // hero awakening chance per round
    "heroWeapons": ["weapon_knife_karambit", "weapon_m4a1"],
    "zombieRageMultiplier": 1.5  // stat multiplier during rage burst
  }
}
```

:::caution[Balance advice]
Setting `heroThreshold` too high makes heroes appear far too often and breaks the pacing. Keep it around 10%–15% of online players.
:::
