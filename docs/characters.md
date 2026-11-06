# 角色

[`characters/oy-character.js`](../characters/oy-character.js) 一个文件，包含三层：

1. **Grok Ball 引擎**（MIT，tycoding）：圆球、眼环形变、眨眼、注视、32 种表情。
2. **OyVerse 角色外形**：每个角色一个身体轮廓和一件饰物，身体用身份色。
3. **状态 API**：把 Agent 状态映射成表情。

图鉴：[`characters/index.html`](../characters/index.html)。

## API

```js
const c = OyCharacter.create(host, {
  character: 'claude',   // claude gpt gemini deepseek grok boss
  color: 0,              // 身份色 0–7，boss 用 -1
  state: 'working',      // 见下表
  size: 64,              // px
  name: '小方',          // 无障碍标签
});
c.setState('done');      // 切换状态
c.setEmotion('13');      // 直接用 Grok Ball 的 32 种表情之一
c.lookAt(0.8, 0.5);      // 注视方向，-1..1
c.destroy();
```

| 角色 | `character` | 外形 |
|---|---|---|
| 小方 | `claude` | 圆角方块，两侧小手臂 |
| 小花 | `gpt` | 六瓣花形 |
| 星星 | `gemini` | 四角星，旁边有闪光 |
| 小鲸 | `deepseek` | 圆身体，头顶喷水、身后尾巴 |
| 团子 | `grok` | 圆团 |
| 管家 | `boss` | 圆角方块 + 王冠，用于协调者 |

| 状态 | 表情 | 什么时候用 |
|---|---|---|
| `working` | 处理中 | 正在执行 |
| `waiting` | 等待输入 | 需要人回答或确认 |
| `error` | 出错 | 失败、没有响应 |
| `idle` | 待机 | 空闲 |
| `paused` | 睡眠 | 被暂停 |
| `thinking` | 思考中 | 在推理、规划 |
| `happy` | 开心 | 收到好结果 |
| `done` | 任务完成 | 刚做完一件事 |
| `busy` | 忙碌 | 流式输出中 |

`OyCharacter.STATES`、`OyCharacter.CHARACTERS`、`OyCharacter.COLORS` 可直接读取。

## 新增一个角色外形

在 `oy-character.js` 的角色部分里：`registerShapes()` 注册身体轮廓（极坐标函数生成 240 个点），`MODELS` 加一项（名称、`shape`、默认色、腮红色），`ACC` 加它的饰物（SVG 片段，随身体姿态变换）。然后在图鉴里检查 9 种状态。
