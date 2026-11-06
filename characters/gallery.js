// Character × state grid for characters/index.html.
(function () {
  const NAMES = { claude: '小方', gpt: '小花', gemini: '星星', deepseek: '小鲸', grok: '团子', boss: '管家' };
  const STATE_LABEL = { working: '工作中', waiting: '等你处理', idle: '空闲', error: '出错', paused: '暂停', thinking: '思考', happy: '开心', done: '完成', busy: '忙碌' };
  const states = OyCharacter.STATES;
  const root = document.documentElement;
  let color = 3, dark = matchMedia('(prefers-color-scheme: dark)').matches || new URLSearchParams(location.search).get('theme') === 'dark';
  let live = [];

  function render() {
    live.forEach(item => item.destroy());
    live = [];
    root.dataset.theme = dark ? 'dark' : 'light';
    document.getElementById('theme').textContent = dark ? '切换日间' : '切换夜间';
    document.getElementById('colors').innerHTML = OyCharacter.COLORS.map((hex, i) => `<button type="button" aria-pressed="${i === color}" data-color="${i}" style="border-color:${hex}">身份色 ${i}</button>`).join('');
    document.getElementById('head').innerHTML = `<tr><th></th>${states.map(s => `<th>${STATE_LABEL[s] || s}<small>${s}</small></th>`).join('')}</tr>`;
    const body = document.getElementById('body');
    body.innerHTML = OyCharacter.CHARACTERS.map(c => `<tr><td class="name">${NAMES[c] || c}<small>${c}</small></td>${states.map(s => `<td><span class="cell" data-c="${c}" data-s="${s}"></span></td>`).join('')}</tr>`).join('');
    body.querySelectorAll('.cell').forEach(cell => {
      const character = cell.dataset.c;
      live.push(OyCharacter.create(cell, { character, color: character === 'boss' ? -1 : color, state: cell.dataset.s, size: 72, name: NAMES[character] }));
    });
  }
  document.getElementById('colors').addEventListener('click', event => {
    const button = event.target.closest('[data-color]');
    if (button) { color = Number(button.dataset.color); render(); }
  });
  document.getElementById('theme').addEventListener('click', () => { dark = !dark; render(); });
  render();
})();
