# 场景

每个场景是 `scenes/` 下一个独立 HTML：加载角色、事件流和示例团队，然后只根据事件流画画。打开 [`scenes/index.html`](../scenes/index.html) 可以并排比较。

| 场景 | 文件 | 适合 |
|---|---|---|
| 星系 | `constellation.html` | 展示面、大屏。协调者是中心的核，Agent 沿各自轨道运行，能力在外圈；事件是彗星，常用的连接留下光丝 |
| 指挥中心 | `mission-control.html` | 运维视角。每个 Agent 一块监控屏（角色、手机画面、正在用的能力、预算），上方信号路由，下方事件时间线 |
| 等距办公室 | `isometric-office.html` | 有温度的产品首页。2.5D 办公室，能力是家具（书架、作品墙、流水线……），事件沿地板光路走 |
| 神经流 | `neural-flow.html` | 正式产品。你 → 协调者 → Agent → 能力四层，丝带宽度 = 真实使用次数，激活时像神经元一样亮 |
| 对话河流 | `conversation-river.html` | 讲清因果。对话是主干，工作从消息分叉进每个 Agent 的泳道，结果再流回对话 |

所有场景都支持：日 / 夜（右上角切换、`?theme=dark`、跟随系统）、手机宽度、`prefers-reduced-motion`，以及在输入框里说一句话触发一次派活。

## 场景必须遵守

- 只从事件流读数据：`agents`、`capabilities`、`conversation` 和 `on(event => …)`。
- 每一次动画都对应一个真实事件；没有事件就安静，不放装饰性的随机动画。
- 角色一律用 `OyCharacter` 画，状态变化用 `setState`。
- 不加载外部资源（字体、CDN、图片），保证双击即开、离线可用。

## 新增一个场景

复制最接近的场景，或者从空白 HTML 开始：引入 `../characters/oy-character.js`、`../core/agent-stream.js`、`../core/demo-team.js`，订阅 `OyDemo.on(...)`，调用 `OyDemo.start()`。在 `scenes/index.html` 的 `OPTIONS` 里加一行，在 `scenes/shots/` 放日 / 夜截图。现成的提示词见 [prompts.md](prompts.md)。
