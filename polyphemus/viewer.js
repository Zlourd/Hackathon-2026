// Hosts Polyphemus (a sandboxed page, since it uses inline handlers) inside the extension and feeds it
// the decoy persona + decoy events. No server, no file-access permission, works offline.
const frame = document.getElementById('app');
let timer = null;

function push() {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    const data = await chrome.runtime.sendMessage({ type: 'snapshot' });
    if (data && frame.contentWindow) frame.contentWindow.postMessage({ source: 'odysseus', type: 'state', data }, '*');
  }, 150);
}

chrome.storage.onChanged.addListener(push);
const fade = document.getElementById('fade');
const reveal = () => fade.classList.add('gone');
frame.addEventListener('load', () => { push(); setTimeout(reveal, 250); });
setTimeout(reveal, 3000); // safety net if the load event is slow (e.g. offline fonts)
window.addEventListener('message', ev => {
  if (ev.source !== frame.contentWindow || !ev.data || ev.data.source !== 'polyphemus') return;
  if (ev.data.type === 'hello') push();
  if (ev.data.type === 'goOdysseus') leaveTo('tracker/profile.html#from-polyphemus');
  if (ev.data.type === 'clearProfiles') chrome.runtime.sendMessage({ type: 'clearProfiles' }).then(push);
});

// Fade to black, then switch to another extension page in this tab (the opposite of the arrival fade).
function leaveTo(path) {
  if (document.getElementById('leave')) return;
  const o = document.createElement('div');
  o.id = 'leave';
  document.body.appendChild(o);
  requestAnimationFrame(() => o.classList.add('on'));
  setTimeout(() => { location.href = chrome.runtime.getURL(path); }, 700);
}
