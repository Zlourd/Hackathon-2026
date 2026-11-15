// Content script that runs ONLY on the local Polyphemus page (localhost:5172).
// It forwards the decoy persona and decoy-browsing events to the page via postMessage.
// Never sent: real browsing history, the per-site list, or anything about the real user.
(() => {
  // file:// pages have the opaque origin "null", which is not a valid postMessage target.
  const target = location.origin === 'null' ? '*' : location.origin;
  const nonceOf = () => document.documentElement.dataset.odysseusNonce || '';
  const SEARCH_HOSTS = { 'duckduckgo.com': 1, 'bing.com': 1 };

  async function snapshot() {
    const st = await chrome.runtime.sendMessage({ type: 'state' });
    if (!st) return null;
    const log = st.log || [];
    const topics = {};
    log.forEach(e => { topics[e.topic] = (topics[e.topic] || 0) + 1; });
    return {
      enabled: !!st.enabled,
      persona: st.persona && {
        seed: st.persona.seed, noiseSeed: st.persona.noiseSeed, name: st.persona.name, age: st.persona.age,
        occupation: st.persona.occupation, income: st.persona.income, city: st.persona.city, tz: st.persona.tz,
        lang: st.persona.lang, os: st.persona.os, source: st.persona.source || 'builtin', description: st.persona.description || '',
        interests: st.persona.interests.map(i => ({ topic: i.topic, category: i.category }))
      },
      total: log.length, topics,
      recent: log.slice(-20).reverse().map(e => ({ t: e.t, kind: e.kind, query: e.query, host: e.host, topic: e.topic, engine: SEARCH_HOSTS[e.host] ? e.host : null }))
    };
  }

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
