# 事件协议

所有场景只认这一份契约：一组 **Agent**、一组 **能力**、一段 **对话**，加上一条 **事件流**。你的后端（任何 Agent 框架）只要把自己的东西翻译成这几种形状，五个场景就都能直接显示。实现在 [`core/agent-stream.js`](../core/agent-stream.js)，零依赖。

## Agent

```js
{ id: 1, name: '小蓝', character: 'deepseek', color: 3, state: 'working', step: '发布笔记《卧室香薰怎么选》',
  account: '香薰号 1 · 1 号机', budget: [125, 200] }
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `id` | 是 | 唯一 ID，数字或字符串 |
| `name` | 是 | 显示名 |
| `character` | 是 | 角色外形：`claude` `gpt` `gemini` `deepseek` `grok`；协调者（管家）用 `boss` |
| `color` | 是 | 身份色槽位 `0–7`；协调者用 `-1`（墨色） |
| `state` | 是 | `working` 工作中 · `waiting` 等你处理 · `idle` 空闲 · `error` 没有响应 · `paused` 暂停 |
| `step` | 否 | 它现在在做的一句话；事件会自动更新它 |
| `account` `budget` | 否 | 场景可选展示：所用账号 / 设备，`[已用, 上限]` |

## 能力

Agent 在工作中会用到的东西，场景把它们画成节点、站点、家具或标签。

```js
{ key: 'pages', label: '页面库', hint: '认页面、找按钮' }
```

`key` 自定义即可。示例数据用了 8 个：`pages` 页面库、`materials` 素材与创作、`workflows` 工作流、`phone` 手机、`dispatch` 调度、`judge` 判断、`data` 数据、`memory` 记忆手册。

## 对话

```js
{ from: 'you' | 'butler' | 'bot', bot: 2, text: '…', time: '09:30', confirm: '删除过期草稿' }
```

`from: 'bot'` 时用 `bot` 指明是哪个 Agent；带 `confirm` 的消息会被场景画成确认卡。

## 事件

```js
stream.emit({ kind: 'use', agent: 4, cap: 'pages', text: '认出搜索页：小红书 / 搜索' });
```

| `kind` | 含义 | 场景里通常的样子 | 自动的状态变化 |
|---|---|---|---|
| `delegate` | 协调者把事交给某个 Agent | 协调者 → Agent 的光点 / 分叉 | → `working` |
| `use` | Agent 用了某个能力（需要 `cap`） | Agent → 能力 的光点，连线变粗 | — |
| `report` | Agent 做完了，汇报回来 | Agent → 协调者 → 对话 | — |
| `ask` | Agent 需要人回答或确认 | 琥珀色，回到对话里 | → `waiting` |
| `error` | 出错 / 没有响应 | 红色 | → `error` |
| `state` | 只改状态（需要 `state`） | 角色表情与光晕切换 | → 指定状态 |

除 `report` 外，带 `text` 的事件会成为该 Agent 的 `step`。`emit` 会补上 `id` 和 `at`（`HH:MM`）。

**原则：场景里的每一次移动都必须来自一个真实事件。** 不要为了“看起来在动”伪造事件，空闲就让它安静。

## 接入示例

```html
<script src="characters/oy-character.js"></script>
<script src="core/agent-stream.js"></script>
<script>
  const stream = OyAgents.create({ agents, capabilities, conversation });
  window.HallDemo = window.OyDemo = { ...stream, bots: stream.agents, bot: stream.agent, start() {}, stop() {},
    STATE_LABEL: { working: '工作中', waiting: '等你处理', idle: '空闲', error: '没有响应', paused: '暂停' },
    STATE_EMOTION: { working: 'working', waiting: 'waiting', idle: 'idle', error: 'error', paused: 'paused' } };
  // 你的后端：SSE / WebSocket / 轮询，把每条记录翻译成一个事件
  new EventSource('/agent-events').onmessage = e => stream.emit(JSON.parse(e.data));
</script>
<!-- 然后加载任意一个场景的页面脚本 -->
```

现有场景读的是 `window.HallDemo`（第一版的名字），所以接入时按上面那样挂上同名对象即可；新场景请直接用 `OyAgents.create()` 返回的 `stream`。
