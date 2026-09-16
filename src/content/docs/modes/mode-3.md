---
title: 生化模式 Ⅲ
description: 英雄降临——残局觉醒英雄单位，与尸潮展开终局对决。
sidebar:
  order: 3
---

**生化模式 Ⅲ** 加入了标志性的**英雄系统**，让残局充满逆转的可能。

## 新增机制

### 英雄觉醒

当幸存人类数量低于阈值时，满足条件的玩家可觉醒为**英雄**：

- 获得专属英雄武器（如英雄双刺、英雄之怒）
- 更高的移动速度与近战能力
- 英雄被击杀后**不会**转化为僵尸

### 僵尸怒气

僵尸在受击与感染时累积**怒气值**，怒气满时可主动爆发：

- 短时间大幅提升移动速度与抗击退能力
- 是突破人类火力阵地的关键手段

## 终局对决

回合后期通常演变为**英雄 vs 尸群**的正面决战——英雄想完成救世，尸群要撕碎最后的希望，观赏性拉满。

## 配置项

```jsonc
// addons/swiftlys2/configs/plugins/ZombieCs/config.jsonc
{
  "mode3": {
    "enabled": true,
    "heroThreshold": 3,          // 幸存人类低于该数量时允许觉醒英雄
    "heroChance": 0.25,          // 每回合英雄觉醒概率
    "heroWeapons": ["weapon_knife_karambit", "weapon_m4a1"],
    "zombieRageMultiplier": 1.5  // 怒气爆发期间的属性倍率
  }
}
```

:::caution[平衡建议]
`heroThreshold` 设置过高会让英雄出现得太频繁，破坏对局节奏；建议保持在在线人数的 10%–15%。
:::
