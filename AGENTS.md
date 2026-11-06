# OyVerse · 给 AI 编码助手的说明

> 你（AI 助手）在这个仓库里工作时先读这一页。人类使用者请看 [README](README.md)。

## 这个仓库是什么

让 AI Agent 在可视化场景里有形象、有状态、能看出协作关系。三层，彼此只通过下面的接口相连：

| 层 | 文件 | 对外接口 |
|---|---|---|
| 角色 | `characters/oy-character.js` | `window.OyCharacter`：`create(host, { character, color, state, size, name })` → `{ setState, setEmotion, lookAt, destroy }`；`STATES` `CHARACTERS` `COLORS` |
| 协议 | `core/agent-stream.js` | `window.OyAgents.create({ agents, capabilities, conversation })` → `{ on, emit, replay, agent, cap, … }` |
| 示例 | `core/demo-team.js` | `window.OyDemo`（同名别名 `window.HallDemo`）：示例团队 + `start()` 循环播放事件 |
| 场景 | `scenes/*.html` | 只读上面三者 |

协议细节：[docs/protocol.md](docs/protocol.md)。角色：[docs/characters.md](docs/characters.md)。场景：[docs/scenes.md](docs/scenes.md)。

## 硬规则

1. **零依赖、零构建。** 不引入 npm 包、CDN、Web 字体或外部图片。每个 HTML 双击即可离线打开。
2. **角色只用 `OyCharacter` 画。** 不要用 emoji、放大的图标或图片代替角色。状态变化调用 `setState`。
3. **动画只来自事件。** 场景里的光点、连线、表情变化都必须对应 `on(event)` 收到的一个真实事件。没有事件时保持安静，不放随机的“看起来很忙”的动画。
4. **场景不碰数据来源。** 场景只读 `agents` / `capabilities` / `conversation` / 事件流；示例数据只在 `core/demo-team.js`。
5. **改协议要兼容。** 新字段只能加，不能改名或删除；现有场景依赖 `bot` 作为 `agent` 的别名、依赖 `window.HallDemo`。
6. **不要改 Grok Ball 引擎的许可声明**（`oy-character.js` 顶部）。修改引擎时在 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) 记一笔。
7. 界面文字默认中文；支持日 / 夜、手机宽度与 `prefers-reduced-motion`。

## 常见任务

- **接入一个真实的 Agent 系统**：写一个适配层，把对方的“任务分派 / 工具调用 / 完成 / 需要人工 / 失败”映射成 `delegate` / `use` / `report` / `ask` / `error`，再 `stream.emit()`。不改场景。
- **新增场景**：在 `scenes/` 新建一个 HTML，结构照现有场景；在 `scenes/index.html` 的 `OPTIONS` 加一行；在 `scenes/shots/` 放 `<name>.png` 与 `<name>-dark.png`（1440×900）。
- **新增角色外形**：见 [docs/characters.md](docs/characters.md) 的“新增一个角色外形”，然后在 `characters/index.html` 里检查全部状态。

## 自检

改完后用无头浏览器打开改动过的页面（日 / 夜各一次，再加 390px 宽度），确认控制台没有报错，并看一眼截图：角色有没有被裁切或遮挡，文字有没有压在连线上。

可直接复制的任务提示词：[docs/prompts.md](docs/prompts.md)。
