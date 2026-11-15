// Content script that runs ONLY on the local Polyphemus page (localhost:5172).
// It forwards the decoy persona and decoy-browsing events to the page via postMessage.
// Never sent: real browsing history, the per-site list, or anything about the real user.
(() => {
  // file:// pages have the opaque origin "null", which is not a valid postMessage target.
  const target = location.origin === 'null' ? '*' : location.origin;
  const nonceOf = () => document.documentElement.dataset.odysseusNonce || '';
  const snapshot = () => chrome.runtime.sendMessage({ type: 'snapshot' });

  let pending = null;
  function push() {
    clearTimeout(pending);
    pending = setTimeout(async () => {
      const data = await snapshot();
      if (data) window.postMessage({ source: 'odysseus', nonce: nonceOf(), type: 'state', data }, target);
    }, 150);
  }

  chrome.storage.onChanged.addListener(push);
  // The page can ask for the current state (covers load-order races).
  window.addEventListener('message', ev => {
    if (ev.source === window && ev.data && ev.data.source === 'polyphemus' && ev.data.type === 'hello') push();
  });
  push();
})();
