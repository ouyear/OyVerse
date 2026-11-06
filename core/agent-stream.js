/*
 * OyVerse agent stream: the one contract between your agents and any scene. Zero dependencies, no build step.
 * A scene only reads `agents`, `capabilities`, `conversation` and the event stream; it never knows where they come from.
 * Protocol reference: docs/protocol.md.
 *
 *   const stream = OyAgents.create({ agents, capabilities, conversation });
 *   stream.on(event => { ... });            // every event: { id, at, kind, agent, cap?, text }
 *   stream.emit({ kind: 'use', agent: 4, cap: 'pages', text: '认出搜索页' });
 */
(function () {
  const KINDS = ['delegate', 'use', 'report', 'ask', 'error', 'state'];
  const STATES = ['working', 'waiting', 'idle', 'error', 'paused'];

  function create({ agents = [], capabilities = [], conversation = [] } = {}) {
    const listeners = new Set();
    const byId = id => agents.find(agent => agent.id === id);
    function emit(input) {
      if (!KINDS.includes(input.kind)) throw new Error(`OyAgents: unknown event kind "${input.kind}"`);
      const agentId = input.agent ?? input.bot;
      const agent = byId(agentId);
      // Events move state the way a real agent would: a delegation starts work, an error stops it, a question waits on you.
      if (agent) {
        if (input.kind === 'delegate') agent.state = 'working';
        if (input.kind === 'ask') agent.state = 'waiting';
        if (input.kind === 'error') agent.state = 'error';
        if (input.kind === 'state' && STATES.includes(input.state)) agent.state = input.state;
        if (input.kind !== 'report' && input.text) agent.step = input.text;
      }
      // `bot` is kept as an alias of `agent` for scenes written against the first prototype.
      const event = { ...input, agent: agentId, bot: agentId, id: input.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: input.at ?? new Date().toTimeString().slice(0, 5) };
      listeners.forEach(fn => fn(event));
      return event;
    }
    return {
      agents, capabilities, conversation,
      agent: byId,
      cap: key => capabilities.find(item => item.key === key),
      on: fn => { listeners.add(fn); return () => listeners.delete(fn); },
      emit,
      // Replays [delayMs, event] pairs in a loop: the demo, or a recorded session.
      replay(script, { loop = true } = {}) {
        let timer = 0, index = 0;
        const next = () => {
          if (!loop && index >= script.length) return;
          const [delay, event] = script[index % script.length];
          timer = setTimeout(() => { emit(event); index += 1; next(); }, delay);
        };
        next();
        return () => clearTimeout(timer);
      },
      STATES, KINDS,
    };
  }

  window.OyAgents = { create, KINDS, STATES };
})();
