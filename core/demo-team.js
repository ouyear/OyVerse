/*
 * The demo team every scene ships with: 6 agents, 8 capabilities, a short conversation and an event script that loops.
 * Swap it for your own data: build the same shapes and call OyAgents.create() (docs/protocol.md). Needs agent-stream.js.
 *
 * Exposes `window.OyDemo` (and `window.HallDemo`, the name the scenes were first written against):
 *   bots / agents, capabilities, conversation, script, bot(id), cap(key), on(fn), start(), stop(), emit(event),
 *   STATE_LABEL, STATE_EMOTION.
 */
(function () {
  const bots = [
    { id: 1, name: '小蓝', model: 'deepseek', color: 3, state: 'working', account: '香薰号 1 · 1 号机', step: '发布笔记《卧室香薰怎么选》', budget: [125, 200] },
    { id: 2, name: '小橙', model: 'claude', color: 6, state: 'working', account: '香薰号 2 · 2 号机', step: '回复了 8 条评论', budget: [50, 200] },
    { id: 3, name: '小绿', model: 'gpt', color: 0, state: 'waiting', account: '香薰号 3 · 3 号机', step: '等你确认「删除过期草稿」', budget: [75, 200] },
    { id: 4, name: '小金', model: 'grok', color: 4, state: 'idle', account: '香薰号 4 · 4 号机', step: '把 3 篇竞品笔记存进素材库', budget: [100, 200] },
    { id: 5, name: '小紫', model: 'gemini', color: 2, state: 'error', account: '香薰号 5 · 未绑定手机', step: '手机 5 号机没有心跳', budget: [20, 200] },
    { id: 6, name: '小青', model: 'claude', color: 5, state: 'paused', account: '香薰号 6 · 6 号机', step: '已暂停', budget: [0, 200] },
  ];
  const capabilities = [
    { key: 'pages', label: '页面库', hint: '认页面、找按钮' },
    { key: 'materials', label: '素材与创作', hint: '存素材、写稿' },
    { key: 'workflows', label: '工作流', hint: '运行、自建流程' },
    { key: 'phone', label: '手机', hint: '点、输入、截图' },
    { key: 'dispatch', label: '调度', hint: '排期、定时' },
    { key: 'judge', label: '判断', hint: '快速判断' },
    { key: 'data', label: '数据', hint: '查运行与数据表' },
    { key: 'memory', label: '记忆手册', hint: '记下经验' },
  ];
  const conversation = [
    { from: 'you', text: '让小蓝把今天的两篇香薰笔记发出去，小橙盯一下评论区。', time: '09:30' },
    { from: 'butler', text: '好的。已经交给小蓝发布，小橙负责回评论。第一篇已发布，第二篇排在 14:00。', time: '09:31' },
    { from: 'bot', bot: 2, text: '评论区目前 23 条新评论，8 条需要回复，我先按热度处理。', time: '10:05' },
    { from: 'butler', text: '小绿想删除 4 篇过期草稿，需要你确认。', time: '09:58', confirm: '删除过期草稿' },
  ];
  // [delay ms, event]. kinds: delegate (butler→bot), use (bot→capability), report (bot→butler→you), ask (bot→you), error.
  const script = [
    [800, { kind: 'delegate', bot: 4, text: '让小金去采集 5 篇竞品爆文' }],
    [1600, { kind: 'use', bot: 4, cap: 'pages', text: '认出搜索页：小红书 / 搜索' }],
    [1500, { kind: 'use', bot: 4, cap: 'phone', text: '搜索「卧室香薰」' }],
    [1400, { kind: 'use', bot: 1, cap: 'workflows', text: '执行「小红书笔记批量发布」' }],
    [1500, { kind: 'use', bot: 4, cap: 'judge', text: '判断：这篇算不算爆文' }],
    [1300, { kind: 'use', bot: 2, cap: 'phone', text: '回复评论「哪里买？」' }],
    [1500, { kind: 'use', bot: 4, cap: 'materials', text: '把 3 篇竞品笔记存进素材库' }],
    [1400, { kind: 'use', bot: 1, cap: 'pages', text: '提交新页面：小红书 / 草稿箱' }],
    [1600, { kind: 'report', bot: 4, text: '采集完成：5 篇爆文已存进素材库，其中 2 篇适合仿写。' }],
    [1500, { kind: 'use', bot: 2, cap: 'memory', text: '记下：这个账号晚上 9 点后互动最高' }],
    [1500, { kind: 'ask', bot: 3, text: '删除 4 篇过期草稿吗？' }],
    [1600, { kind: 'use', bot: 1, cap: 'dispatch', text: '把第二篇排到 14:00' }],
    [1500, { kind: 'error', bot: 5, text: '手机 5 号机没有心跳' }],
    [2200, { kind: 'use', bot: 2, cap: 'data', text: '查询昨天的互动数据' }],
  ];
  // Protocol field names alongside the original ones: `character` is the character shape, `color` the identity slot.
  bots.forEach(bot => { bot.character = bot.model; });
  const stream = OyAgents.create({ agents: bots, capabilities, conversation });
  let stopReplay = null;
  const demo = {
    bots, agents: bots, capabilities, conversation, script,
    bot: stream.agent, agent: stream.agent, cap: stream.cap,
    on: stream.on, emit: stream.emit,
    start: () => { if (!stopReplay) stopReplay = stream.replay(script); },
    stop: () => { if (stopReplay) stopReplay(); stopReplay = null; },
    STATE_LABEL: { working: '工作中', waiting: '等你处理', idle: '空闲', error: '没有响应', paused: '暂停' },
    STATE_EMOTION: { working: 'working', waiting: 'waiting', idle: 'idle', error: 'error', paused: 'paused' },
  };
  window.OyDemo = demo;
  window.HallDemo = demo;
})();
