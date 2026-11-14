const $ = id => document.getElementById(id);
const send = m => chrome.runtime.sendMessage(m);
const K = 4;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const FLAGS = {
  Norway: '<svg viewBox="0 0 22 16"><rect width="22" height="16" fill="#ba0c2f"/><rect x="6" width="4" height="16" fill="#fff"/><rect y="6" width="22" height="4" fill="#fff"/><rect x="7" width="2" height="16" fill="#00205b"/><rect y="7" width="22" height="2" fill="#00205b"/></svg>',
  Portugal: '<svg viewBox="0 0 22 16"><rect width="22" height="16" fill="#ff0000"/><rect width="9" height="16" fill="#006600"/><circle cx="9" cy="8" r="3" fill="#ffcc00"/><circle cx="9" cy="8" r="1.6" fill="#ff0000"/></svg>',
  'United Kingdom': '<svg viewBox="0 0 22 16"><rect width="22" height="16" fill="#012169"/><path d="M0 0l22 16M22 0L0 16" stroke="#fff" stroke-width="3"/><path d="M0 0l22 16M22 0L0 16" stroke="#c8102e" stroke-width="1.2"/><path d="M11 0v16M0 8h22" stroke="#fff" stroke-width="5"/><path d="M11 0v16M0 8h22" stroke="#c8102e" stroke-width="3"/></svg>',
  Canada: '<svg viewBox="0 0 22 16"><rect width="22" height="16" fill="#fff"/><rect width="5.5" height="16" fill="#d52b1e"/><rect x="16.5" width="5.5" height="16" fill="#d52b1e"/><polygon points="11,3 12,5.5 13.6,5 13,8 14.5,7.4 14,9.2 11.6,10.6 11.6,13 10.4,13 10.4,10.6 8,9.2 7.5,7.4 9,8 8.4,5 10,5.5" fill="#d52b1e"/></svg>'
};
const country = city => (city.split(',').pop() || '').trim();
const device = ua => /Windows/.test(ua) ? 'Windows PC' : /Mac/.test(ua) ? 'Mac' : 'Linux desktop';
const ago = t => { const s = Math.max(1, Math.round((Date.now() - t) / 1000)); return s < 60 ? s + 's ago' : Math.round(s / 60) + 'm ago'; };

function renderPersona(p) {
  if (!p) { $('persona').innerHTML = ''; return; }
  const c = country(p.city);
  $('persona').innerHTML = `
    <div class="flag" title="${esc(c)}">${FLAGS[c] || '🌐'}</div>
    <div><div class="loc">${esc(p.name)}</div></div>
    <div class="facts">
      <div class="fact"><small>Location</small><b>${esc(p.city)}</b></div>
      <div class="fact"><small>Age</small><b>${p.age}</b></div>
      <div class="fact"><small>Occupation</small><b>${esc(p.occupation)}</b></div>
      <div class="fact"><small>Income</small><b>${esc(p.income)}</b></div>
    </div>
    <div class="tags">${p.interests.map(i => `<span class="tag">${esc(i.topic)}</span>`).join('')}</div>`;
}

function renderSites(sites) {
  const rows = Object.entries(sites).sort((a, b) => b[1].last - a[1].last);
  $('siteCount').textContent = rows.length || '';
  if (!rows.length) { $('sites').innerHTML = '<div class="noSites">No website has asked for your data yet.<br>Turn the decoy on or browse normally.</div>'; return; }
  const label = { decoy: 'decoy visit', page: 'page you opened', embed: 'embedded tracker' };
  $('sites').innerHTML = rows.map(([host, o]) => {
    const g = o.gave;
    const badges = Object.entries(o.kinds).map(([k, n]) => `<span class="badge ${k}">${label[k]} ×${n}</span>`).join('');
    const chips = [['📍', `${g.city} (${g.lat}, ${g.lon})`], ['💻', `${g.os} · ${g.screen}`], ['🌐', g.lang], ['🕒', g.tz], ['🎮', g.gpu]]
      .map(([i, v]) => `<span class="chip"><i>${i}</i>${esc(v)}</span>`).join('') +
      o.topics.map(t => `<span class="chip"><i>🎯</i>${esc(t)}</span>`).join('');
    return `<div class="site"><div><div class="h">${esc(host)}</div><div class="m">${o.n} request${o.n > 1 ? 's' : ''} · ${ago(o.last)}</div>${badges}</div>
      <div class="gave"><div class="arrow">Was given →</div>${chips}</div></div>`;
  }).join('');
}

function render(st) {
  $('status').textContent = st.enabled ? 'Decoy active' : 'Decoy off';
  $('status').className = 'pill ' + (st.enabled ? 'on' : 'off');
  $('toggle').textContent = st.enabled ? 'Turn decoy off' : 'Turn decoy on';
  renderPersona(st.persona);
  $('intTitle').textContent = st.persona ? `${st.persona.name.split(' ')[0]}'s interests` : 'Interests';
  renderSites(st.sites || {});
  const log = st.log;
  $('empty').hidden = log.length > 0; $('profile').hidden = !log.length;
  $('stats').innerHTML = `<div><b>${log.length}</b>decoy signals</div><div><b>0</b>real signals</div>`;
  if (!log.length) return;
  const by = {};
  log.forEach(e => { by[e.topic] = by[e.topic] || { n: 0, cat: e.category }; by[e.topic].n++; });
  const rows = Object.entries(by).map(([t, o]) => ({ t, ...o, c: 1 - Math.exp(-o.n / K) })).sort((a, b) => b.c - a.c);
  const conf = Math.min(0.99, 1 - Math.exp(-log.length / 14));
  $('confTxt').textContent = Math.round(conf * 100) + '%'; $('confBar').style.width = conf * 100 + '%';
  $('interests').innerHTML = rows.map(r => `<div class="int"><div>${esc(r.t)}<em>${esc(r.cat)}</em></div><div class="b"><i style="width:${r.c * 100}%"></i></div><span class="p">${Math.round(r.c * 100)}%</span></div>`).join('');
}

const refresh = () => send({ type: 'state' }).then(render);
chrome.storage.onChanged.addListener(refresh);
$('toggle').onclick = () => send({ type: 'toggle' }).then(render);
$('reroll').onclick = () => send({ type: 'reroll' }).then(render);
$('reset').onclick = () => send({ type: 'reset' }).then(render);
refresh();
