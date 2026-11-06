/*
 * The one list of characters and scenes. The selection pages, the gallery and `npm run record` (GIF previews) all read
 * it, so a new character or scene needs one entry here and nothing else to show up everywhere.
 * A plain <script>: sets window.OyRegistry (tools/record.mjs evaluates the same file).
 */
(function (root) {
  const registry = {
    characters: [
      { id: 'claude', name: '小方', look: '圆角方块，两侧小手臂', color: 6 },
      { id: 'gpt', name: '小花', look: '六瓣花形', color: 0 },
      { id: 'gemini', name: '星星', look: '四角星，旁边有闪光', color: 2 },
      { id: 'deepseek', name: '小鲸', look: '圆身体，头顶喷水、身后尾巴', color: 3 },
      { id: 'grok', name: '团子', look: '圆团', color: 4 },
      { id: 'boss', name: '管家', look: '圆角方块 + 王冠，用于协调者', color: -1 },
    ],
    // States shown in previews, in the order a task usually goes. The lineup GIF plays them all; a single character
    // plays the short list so its GIF stays small.
    showcaseStates: ['idle', 'thinking', 'working', 'waiting', 'done', 'happy', 'error', 'paused'],
    previewStates: ['thinking', 'working', 'waiting', 'done', 'error'],
    // Scene `seconds` / `colors` (optional) trim its GIF when it grows past ~2 MB; defaults 8 s and 96 colours.
    scenes: [
      { id: 'constellation', file: 'constellation.html', seconds: 7, colors: 72, name: '星系', tag: '最有冲击力', text: '协调者是中心发光的核，Agent 沿各自身份色的轨道运行，能力是外圈的站点。派活、用工具、汇报都是彗星划过，用得越多的连接会留下越亮的光丝。' },
      { id: 'mission-control', file: 'mission-control.html', name: '指挥中心', tag: '信息最全', text: '像 F1 遥测或发射控制台：每个 Agent 一块监控屏（角色、手机画面、正在用的能力），上方是信号路由，下方是每个 Agent 的事件时间线。' },
      { id: 'isometric-office', file: 'isometric-office.html', name: '等距办公室', tag: '最有温度', text: '一层 2.5D 的办公室：每个 Agent 一张亮着屏幕的桌子，页面库是书架、素材库是作品墙、工作流是流水线。事件是沿着地板光路跑的光包。' },
      { id: 'neural-flow', file: 'neural-flow.html', name: '神经流', tag: '最像神经网络', text: '你 → 协调者 → Agent → 能力，四层对齐。连接是按真实使用量变宽的丝带，活跃时有粒子流动，节点被触发时像神经元一样亮一下。' },
      { id: 'conversation-river', file: 'conversation-river.html', name: '对话河流', tag: '最好懂', text: '对话是主干，工作从你说的话分叉出去：每个 Agent 一条泳道，步骤是带能力图标的珠子，结果再流回对话里。一眼看清“我说的话 → 发生了什么”。' },
    ],
  };
  root.OyRegistry = registry;
})(typeof window !== 'undefined' ? window : globalThis);
