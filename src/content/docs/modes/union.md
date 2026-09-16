---
title: 生化盟战
description: 阵营对决——人类军团与尸潮阵营的全面战争。
sidebar:
  order: 5
---

**生化盟战** 不再是逃与追的猫鼠游戏，而是人类与僵尸**两大阵营的正面团战**。

## 规则

- 玩家被分为**人类军团**与**尸潮阵营**两方
- 通过击杀敌方、占领据点为阵营累积胜利点数
- 率先达到目标点数（或点数领先至计时结束）的阵营获胜

## 核心机制

### 据点占领

地图中分布多个战略据点，占领后可持续为阵营产出点数与增益效果。

### 阵营成长

阵营通过战斗累积资源，解锁阵营级强化——人类的重火力支援，僵尸的高阶变异体。

### AI 尸潮协同

尸潮阵营辅以 AI 控制的僵尸单位，即使人数不足也能保证战线强度。

## 策略要点

- 据点比人头更重要，切忌无脑恋战
- 分兵牵制与集中推进的节奏切换，是盟战进阶的关键

## 配置项

```jsonc
// addons/swiftlys2/configs/plugins/ZombieCs/config.jsonc
{
  "union": {
    "enabled": true,
    "targetScore": 500,          // 胜利所需点数
    "captureInterval": 5,        // 据点结算间隔（秒）
    "pointsPerCapture": 3,
    "aiZombieCount": 4,          // 每方补充的 AI 僵尸数量
    "mapConfigs": {              // 各地图独立点位，也可放入 resources/maps/
      "de_dust2": { "capturePoints": ["A", "B", "MID"] }
    }
  }
}
```

:::tip[地图点位]
据点位置建议放在插件目录的 `resources/maps/<地图名>.json` 中，方便按图维护，不会因升级覆盖配置。
:::
