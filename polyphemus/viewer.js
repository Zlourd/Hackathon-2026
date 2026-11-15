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
frame.addEventListener('load', push);
window.addEventListener('message', ev => {
  if (ev.source === frame.contentWindow && ev.data && ev.data.source === 'polyphemus' && ev.data.type === 'hello') push();
});
