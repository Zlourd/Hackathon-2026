const $ = id => document.getElementById(id);
const send = m => chrome.runtime.sendMessage(m);
const K = 4;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const device = ua => /Windows/.test(ua) ? 'Windows PC' : /Mac/.test(ua) ? 'Mac' : 'Linux desktop';
const ago = t => { const s = Math.max(1, Math.round((Date.now() - t) / 1000)); return s < 60 ? s + 's ago' : Math.round(s / 60) + 'm ago'; };

function renderPersona(p) {
  if (!p) { $('persona').innerHTML = ''; return; }
  const flag = odyFlagSvg(odyCountryCode(p));
  $('persona').innerHTML = `
    <div class="flag" title="${esc(p.country || p.city)}">${flag || '🌐'}</div>
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
  $('stats').innerHTML = `<div><b>${log.length}</b>decoy data leaks</div>`;
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
// Clicking the coin fades this page to black, then opens Polyphemus (which fades in) in the same tab.
$('coin').onclick = () => {
  if (document.getElementById('fade')) return;
  const fade = document.createElement('div');
  fade.id = 'fade';
  document.body.appendChild(fade);
  requestAnimationFrame(() => fade.classList.add('on'));
  setTimeout(() => { location.href = chrome.runtime.getURL('polyphemus/viewer.html'); }, 700);
};
$('reroll').onclick = () => send({ type: 'reroll' }).then(render);
refresh().finally(() => document.documentElement.classList.add('ready'));
