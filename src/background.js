import { buildPersona } from './persona.js';
import { SEARCH_ENGINES } from './data.js';
import { injectedSpoof } from './inject.js';

const LOG_CAP = 600;
const BURST = 24; // fast "demo" visits when the decoy is first switched on
const DEFAULTS = { enabled: false, mask: true, persona: null, log: [], sites: {}, burstLeft: 0, since: null };
const SITE_CAP = 150;

const get = async () => ({ ...DEFAULTS, ...(await chrome.storage.local.get(null)) });
const set = patch => chrome.storage.local.set(patch);
const rand = (a, b) => a + Math.random() * (b - a);

// Per-site record of what each website was told. Only hostnames are kept, locally.
function noteSite(sites, host, kind, p, topic) {
  const o = sites[host] || { n: 0, kinds: {}, topics: [] };
  o.n++; o.last = Date.now(); o.kinds[kind] = (o.kinds[kind] || 0) + 1;
  if (topic && !o.topics.includes(topic)) o.topics.push(topic);
  o.gave = { city: p.city, lat: +p.lat.toFixed(3), lon: +p.lon.toFixed(3), tz: p.tz, lang: p.lang, os: p.os, ua: p.ua,
    screen: `${p.screen.w}×${p.screen.h}`, gpu: p.gpu[1].split(',')[1]?.trim() || p.gpu[0] };
  sites[host] = o;
  const keys = Object.keys(sites);
  if (keys.length > SITE_CAP) keys.sort((a, b) => sites[a].last - sites[b].last).slice(0, keys.length - SITE_CAP).forEach(k => delete sites[k]);
  return sites;
}

// ---------- Header-level identity (User-Agent, Accept-Language, client hints) ----------
async function syncRules() {
  const { enabled, mask, persona } = await get();
  const remove = (await chrome.declarativeNetRequest.getDynamicRules()).map(r => r.id);
  const add = [];
  if (enabled && persona) {
    const condition = { resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest', 'script', 'image', 'stylesheet', 'font', 'media', 'ping', 'other'] };
    if (!mask) condition.initiatorDomains = [chrome.runtime.id]; // decoy traffic only
    add.push({
      id: 1, priority: 1, condition,
      action: {
        type: 'modifyHeaders',
        requestHeaders: [
          { header: 'User-Agent', operation: 'set', value: persona.ua },
          { header: 'Accept-Language', operation: 'set', value: persona.acceptLanguage },
          { header: 'Sec-GPC', operation: 'set', value: '1' },
          { header: 'Sec-CH-UA', operation: 'set', value: persona.brands.map(b => `"${b.brand}";v="${b.version}"`).join(', ') },
          { header: 'Sec-CH-UA-Platform', operation: 'set', value: `"${persona.os}"` },
          { header: 'Sec-CH-UA-Mobile', operation: 'set', value: '?0' }
        ]
      }
    });
  }
  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: remove, addRules: add });
}

// ---------- Fingerprint spoofing, injected at document start ----------
chrome.webNavigation.onCommitted.addListener(async d => {
  if (!/^https?:/.test(d.url)) return;
  const { enabled, mask, persona } = await get();
  if (!enabled || !mask || !persona) return;
  try {
    const host = new URL(d.url).hostname.replace(/^www\./, '');
    const cur = await get();
    await set({ sites: noteSite({ ...cur.sites }, host, d.frameId === 0 ? 'page' : 'embed', persona) });
    await chrome.scripting.executeScript({
      target: { tabId: d.tabId, frameIds: [d.frameId] }, world: 'MAIN', injectImmediately: true,
      func: injectedSpoof, args: [persona]
    });
  } catch (e) { console.debug("Mirage: could not inject", e.message); }
});

// ---------- Decoy browsing ----------
async function decoyVisit() {
  const st = await get();
  if (!st.enabled || !st.persona) return;
  const p = st.persona;
  // earlier interests are the persona's "core" — weight them more heavily so a clear profile emerges
  const weights = p.interests.map((_, i) => 1 / (i + 1.2));
  let x = Math.random() * weights.reduce((a, b) => a + b, 0), idx = 0;
  while ((x -= weights[idx]) > 0 && idx < weights.length - 1) idx++;
  const interest = p.interests[idx];

  const isSearch = Math.random() < 0.55;
  let url, kind, query = null;
  if (isSearch) {
    query = interest.searches[Math.floor(Math.random() * interest.searches.length)];
    url = SEARCH_ENGINES[Math.floor(Math.random() * SEARCH_ENGINES.length)](query);
    kind = 'search';
  } else {
    url = interest.sites[Math.floor(Math.random() * interest.sites.length)];
    kind = 'visit';
  }

  let status = 0;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 7000);
  try {
    const res = await fetch(url, { mode: 'no-cors', credentials: 'include', cache: 'no-store', referrerPolicy: 'no-referrer', signal: ctl.signal });
    status = res.status || 200;
  } catch (e) { status = -1; }
  clearTimeout(timer);

  const cur = await get(); // may have changed while fetching
  const entry = {
    t: Date.now(), kind, query, url, host: new URL(url).hostname.replace(/^www\./, ''),
    topic: interest.topic, category: interest.category, status,
    seen: { id: p.id, ua: p.ua, city: p.city, tz: p.tz, lang: p.lang }
  };
  const log = [...cur.log, entry].slice(-LOG_CAP);
  await set({ log, sites: noteSite({ ...cur.sites }, entry.host, 'decoy', p, interest.topic), burstLeft: Math.max(0, cur.burstLeft - 1) });
}

async function scheduleNext() {
  const { enabled, burstLeft } = await get();
  await chrome.alarms.clear('decoy');
  if (!enabled) return;
  if (burstLeft > 0) { setTimeout(tick, rand(1200, 2200)); return; }
  chrome.alarms.create('decoy', { delayInMinutes: rand(0.5, 1.5) }); // natural, irregular cadence
}
async function tick() {
  const { enabled } = await get();
  if (!enabled) return;
  await decoyVisit();
  await scheduleNext();
}
chrome.alarms.onAlarm.addListener(a => { if (a.name === 'decoy') tick(); });

// ---------- Control surface (popup + tracker view) ----------
async function handle(msg) {
  const st = await get();
  switch (msg.type) {
    case 'state': return st;
    case 'toggle': {
      const enabled = msg.value ?? !st.enabled;
      const persona = st.persona || buildPersona();
      await set({ enabled, persona, since: enabled ? Date.now() : null, burstLeft: enabled ? BURST : 0 });
      await syncRules();
      if (enabled) tick(); else await chrome.alarms.clear('decoy');
      return get();
    }
    case 'mask': await set({ mask: !!msg.value }); await syncRules(); return get();
    case 'reroll': {
      const persona = buildPersona(undefined, st.persona?.id);
      await set({ persona, log: [], sites: {}, burstLeft: st.enabled ? BURST : 0 });
      await syncRules();
      if (st.enabled) tick();
      return get();
    }
    case 'reset': await set({ log: [], sites: {}, burstLeft: st.enabled ? BURST : 0 }); if (st.enabled) tick(); return get();
    case 'burst': await set({ burstLeft: BURST }); if (st.enabled) tick(); return get();
  }
}
chrome.runtime.onMessage.addListener((msg, _s, send) => { handle(msg).then(send); return true; });

async function boot() {
  const st = await get();
  if (!st.persona) await set({ persona: buildPersona() });
  await syncRules();
  if (st.enabled) scheduleNext();
}
chrome.runtime.onInstalled.addListener(boot);
chrome.runtime.onStartup.addListener(boot);
