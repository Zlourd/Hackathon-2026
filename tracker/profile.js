const $ = id => document.getElementById(id);
const send = m => chrome.runtime.sendMessage(m);
const K = 4; // evidence needed for ~63% confidence in an interest

const hash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7).toString(16);

function render(st) {
  $('status').textContent = st.enabled ? 'Decoy active' : 'Decoy off';
  $('status').className = 'pill ' + (st.enabled ? 'on' : 'off');
  $('toggle').textContent = st.enabled ? 'Turn decoy off' : 'Turn decoy on';
  const log = st.log;
  $('empty').hidden = log.length > 0; $('profile').hidden = !log.length;
  $('stats').innerHTML = `<div><b>${log.length}</b>decoy signals</div><div><b>0</b>real signals</div>`;
  if (!log.length) { $('vid').textContent = ''; return; }

  const last = log[log.length - 1].seen;
  $('vid').textContent = 'vid_' + hash(last.ua + last.tz);
  const byTopic = {};
  log.forEach(e => { (byTopic[e.topic] ||= { n: 0, cat: e.category, q: [], last: 0 }); const o = byTopic[e.topic]; o.n++; o.last = e.t; if (e.query) o.q.push(e.query); });
  const rows = Object.entries(byTopic).map(([t, o]) => ({ t, ...o, c: 1 - Math.exp(-o.n / K) })).sort((a, b) => b.c - a.c);
  const conf = Math.min(0.99, 1 - Math.exp(-log.length / 14));
  $('confTxt').textContent = Math.round(conf * 100) + '%'; $('confBar').style.width = conf * 100 + '%';

  const p = st.persona;
  const ready = conf > 0.35;
  const cells = [
    ['Location', last.city], ['Language', last.lang], ['Timezone', last.tz],
    ['Device', /Windows/.test(last.ua) ? 'Windows PC' : /Mac/.test(last.ua) ? 'Mac' : 'Linux desktop'],
    ['Age band', ready ? `${Math.floor(p.age / 10) * 10}s` : 'analyzing…'], ['Occupation', ready ? p.occupation : 'analyzing…'],
    ['Income est.', ready ? p.income : 'analyzing…'], ['Segments', rows.length]
  ];
  $('demo').innerHTML = cells.map(([k, v]) => `<div class="cell"><small>${k}</small>${v}</div>`).join('');
  $('interests').innerHTML = rows.map(r => `<div class="int"><div>${r.t}<em>${r.cat}</em></div><div class="b"><i style="width:${r.c * 100}%"></i></div><span class="p">${Math.round(r.c * 100)}%</span></div>`).join('');
  $('timeline').innerHTML = log.slice(-25).reverse().map(e =>
    `<li>${new Date(e.t).toLocaleTimeString()} · ${e.kind === 'search' ? 'searched <b>“' + e.query + '”</b>' : 'visited <b>' + e.host + '</b>'} <small>(${e.topic})</small></li>`).join('');
}

const refresh = () => send({ type: 'state' }).then(render);
chrome.storage.onChanged.addListener(refresh);
$('toggle').onclick = () => send({ type: 'toggle' }).then(render);
$('reset').onclick = () => send({ type: 'reset' }).then(render);
refresh();
