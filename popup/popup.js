const $ = id => document.getElementById(id);
const send = m => chrome.runtime.sendMessage(m);
function render(st) {
  $('toggle').checked = st.enabled; $('mask').checked = st.mask;
  $('stateText').textContent = st.enabled ? 'Decoy ON — browsing as someone else' : 'Decoy off';
  const p = st.persona;
  $('persona').innerHTML = p ? `<b>${p.name}</b>, ${p.age}<br><small>${p.occupation} · ${p.city}</small><br>` +
    p.interests.map(i => `<span class="tag">${i.topic}</span>`).join('') : '';
}
send({ type: 'state' }).then(render);
$('toggle').onchange = e => send({ type: 'toggle', value: e.target.checked }).then(render);
$('mask').onchange = e => send({ type: 'mask', value: e.target.checked }).then(render);
$('reroll').onclick = () => send({ type: 'reroll' }).then(render);
$('open').onclick = () => chrome.tabs.create({ url: chrome.runtime.getURL('tracker/profile.html') });
