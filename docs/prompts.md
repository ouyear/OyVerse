# 接入提示词

把下面任意一段整段复制给你的 AI 编码助手（Claude、Cursor、Copilot……），把 `【】` 里的内容换成你的情况。每段都要求它先读 [AGENTS.md](../AGENTS.md)，所以不必再解释仓库结构。

## 1. 把我的 Agent 系统接到 OyVerse

```text
先读 OyVerse 仓库的 AGENTS.md 和 docs/protocol.md。

我的 Agent 系统是【LangGraph / CrewAI / OpenAI Agents SDK / 自研】，后端用【Node / Python】，事件通过【SSE / WebSocket / 轮询某个接口】推给前端。
它会产生这些记录：【贴几条真实的事件或日志样例】。

请写一个适配层：
1. 把我的 Agent 列表映射成 protocol.md 里的 Agent（为每个 Agent 选 character 和 0–7 的 color，协调者用 boss / -1）。
2. 把我的工具或资源映射成 capabilities（key、label、hint）。
3. 把每条记录翻译成 delegate / use / report / ask / error / state 之一，调用 stream.emit()。翻译不了的记录丢掉，不要编造事件。
4. 按 protocol.md 的“接入示例”挂上 window.HallDemo，让现有 scenes/*.html 直接显示我的数据。
不要修改 characters/ 和 scenes/ 里的文件。给我一个可以直接打开的 HTML，并说明每类记录映射成了什么。
```

## 2. 在我的 React / Vue 页面里放一个会动的 Agent 角色

```text
先读 OyVerse 的 AGENTS.md 和 docs/characters.md。

我的项目是【React 18 + TypeScript / Vue 3】。我想在【聊天头像 / 任务卡片 / 侧边栏】里显示 Agent 角色，状态跟着【我的 store 里的某个字段】变化。
请写一个组件：挂载时调用 OyCharacter.create()，props 变化时调用 setState()，卸载时 destroy()。
characters/oy-character.js 原样引入（作为静态脚本或复制进项目），不要改写引擎；支持 prefers-reduced-motion。
```

## 3. 新增一个场景

```text
先读 OyVerse 的 AGENTS.md、docs/protocol.md 和 docs/scenes.md，并打开 scenes/neural-flow.html 看结构。

请在 scenes/ 新建【场景名】.html，创意是：【一句话描述，比如“像地铁线路图：每个 Agent 一条线路，能力是换乘站”】。
要求：角色只用 OyCharacter；所有动画只由 OyDemo.on() 收到的事件驱动；顶栏 + 舞台 + 右侧对话面板（对话不能挡住舞台）；
支持 ?theme=dark、390px 宽度和 prefers-reduced-motion；不加载任何外部资源。
完成后在 registry.js 的 scenes 里加一项，用无头浏览器截 1440×900 日 / 夜两张图放进 scenes/shots/，再运行 npm run record -- --only=<id> 生成 GIF。
截图后自己看一遍，修掉遮挡、裁切和文字压线的问题再交付。
```

## 4. 新增一个角色外形

```text
先读 OyVerse 的 AGENTS.md 和 docs/characters.md。

请新增一个角色外形：【名字、外形描述、饰物描述】。
在 characters/oy-character.js 的角色部分注册身体轮廓、在 MODELS 和 ACC 里各加一项，不要改 Grok Ball 引擎本身和顶部的许可声明。
在 registry.js 的 characters 里加一项，然后打开 characters/index.html，确认新角色在全部状态和 8 种身份色下都正常，眼睛不被饰物挡住，最后运行 npm run record -- --only=<id>,lineup。
```

## 5. 只用角色，不要场景

```text
先读 OyVerse 的 docs/characters.md。
我只需要一个能表达状态的 AI 角色，放在【位置】。请给我最小的接入代码：引入 characters/oy-character.js，
用 OyCharacter.create() 渲染，并演示 working → thinking → waiting → done 的切换。
```
