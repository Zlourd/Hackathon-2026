import { buildPersona, personaOverridesFromApi } from './persona.js';
import { cyclopsApi } from './api.js';
import { SEARCH_ENGINES, ARCHETYPES } from './data.js';
import { injectedSpoof } from './inject.js';

const LOG_CAP = 600;
const BURST = 24; // fast "demo" visits when the decoy is first switched on
const DEFAULTS = { enabled: false, mask: true, persona: null, log: [], profiles: [], sites: {}, burstLeft: 0, since: null };
const SITE_CAP = 150;
const PROFILE_CAP = 100; // stored decoy profiles (newest kept)

// Country / economics fields for a persona or archived profile (used by the Polyphemus price model).
// Profiles stored before these fields existed are filled in from their city: every built-in archetype has one.
function geoFor(x) {
  if (x.cc && x.tier && x.areaAvg && x.incomeLow) {
    return { cc: x.cc, country: x.country, tier: x.tier, areaAvg: x.areaAvg, incomeLow: x.incomeLow, incomeHigh: x.incomeHigh || x.incomeLow };
  }
  const a = ARCHETYPES.find(a => a.city === x.city);
  if (a) return { cc: a.cc, country: a.country, tier: a.tier, areaAvg: a.areaAvg, incomeLow: a.incomeUSD[0], incomeHigh: a.incomeUSD[1] };
  const m = /\$(\d+)\s*[–-]\s*(\d+)k/.exec(x.income || '');
  return { cc: '', country: String(x.city || '').split(',').pop().trim(), tier: 1, areaAvg: 30000,
    incomeLow: m ? +m[1] * 1000 : 40000, incomeHigh: m ? +m[2] * 1000 : 60000 };
}

// Archive of every decoy persona ever generated, with its accumulated decoy activity.
// Contains fake data only; real browsing never enters it.
const newArchived = p => ({
  seed: p.seed, noiseSeed: p.noiseSeed, name: p.name, age: p.age, occupation: p.occupation, income: p.income, city: p.city, tz: p.tz,
  ...geoFor(p), lang: p.lang, os: p.os, source: p.source || 'builtin', description: p.description || '',
  interests: p.interests.map(i => ({ topic: i.topic, category: i.category })),
  created: Date.now(), updated: Date.now(), topics: {}, total: 0, recent: []
});
function withArchived(profiles, persona) {
  const list = [...(profiles || [])];
  if (persona && !list.some(x => x.seed === persona.seed)) list.push(newArchived(persona));
  return list.slice(-PROFILE_CAP);
}

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
  } catch (e) { console.debug("Odysseus: could not inject", e.message); }
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
  const profiles = withArchived(cur.profiles, p);
  const arch = profiles.find(x => x.seed === p.seed);
  if (arch) {
    arch.topics[entry.topic] = (arch.topics[entry.topic] || 0) + 1; arch.total++; arch.updated = entry.t;
    arch.recent = [{ t: entry.t, kind, query, host: entry.host, topic: entry.topic,
      engine: entry.host === 'duckduckgo.com' || entry.host === 'bing.com' ? entry.host : null }, ...arch.recent].slice(0, 20);
  }
  await set({ log, profiles, sites: noteSite({ ...cur.sites }, entry.host, 'decoy', p, interest.topic), burstLeft: Math.max(0, cur.burstLeft - 1) });
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
      await set({ enabled, persona, profiles: withArchived(st.profiles, persona), since: enabled ? Date.now() : null, burstLeft: enabled ? BURST : 0 });
      await syncRules();
      if (enabled) tick(); else await chrome.alarms.clear('decoy');
      return get();
    }
    case 'snapshot': {
      const pe = st.persona;
      const shape = x => ({ seed: x.seed, noiseSeed: x.noiseSeed, name: x.name, age: x.age, occupation: x.occupation, income: x.income,
        ...geoFor(x), city: x.city, tz: x.tz, lang: x.lang, os: x.os, source: x.source || 'builtin', description: x.description || '',
        interests: x.interests.map(i => ({ topic: i.topic, category: i.category })) });
      const profiles = withArchived(st.profiles, pe);
      const cur = pe && profiles.find(x => x.seed === pe.seed);
      return {
        enabled: !!st.enabled,
        // the live persona (decoy events only: never the real-browsing site list)
        persona: pe && shape(pe), total: cur ? cur.total : 0, topics: cur ? cur.topics : {}, recent: cur ? cur.recent : [],
        // every decoy profile ever generated, newest first
        profiles: [...profiles].reverse().map(x => ({ persona: shape(x), topics: x.topics, total: x.total, recent: x.recent.slice(0, 10),
          created: x.created, updated: x.updated, live: x.seed === pe?.seed }))
      };
    }
    case 'mask': await set({ mask: !!msg.value }); await syncRules(); return get();
    case 'reroll': {
      // Try the local Gemini backend first; fall back to the built-in archetypes silently.
      let ai = null;
      try { ai = personaOverridesFromApi(await cyclopsApi.generatePersona()); } catch (e) { console.debug('Odysseus: backend persona unavailable', e.message); }
      const persona = buildPersona(undefined, st.persona?.id, ai);
      await set({ persona, profiles: withArchived(st.profiles, persona), log: [], sites: {}, burstLeft: st.enabled ? BURST : 0 });
      await syncRules();
      if (st.enabled) tick();
      return get();
    }
    case 'reset': {
      const profiles = (st.profiles || []).map(x => x.seed === st.persona?.seed ? { ...x, topics: {}, total: 0, recent: [], updated: Date.now() } : x);
      await set({ log: [], profiles, sites: {}, burstLeft: st.enabled ? BURST : 0 }); if (st.enabled) tick(); return get();
    }
    case 'clearProfiles': // keep only the live persona
      await set({ profiles: withArchived((st.profiles || []).filter(x => x.seed === st.persona?.seed), st.persona) }); return get();
    case 'analyze': {
      try { return { ok: true, result: await cyclopsApi.analyzeWebsite(String(msg.url || '')) }; }
      catch (e) { return { ok: false, error: e.message }; }
    }
    case 'burst': await set({ burstLeft: BURST }); if (st.enabled) tick(); return get();
  }
}
// Always reply, even when a handler throws, so a page waiting on sendMessage never hangs.
chrome.runtime.onMessage.addListener((msg, _s, send) => {
  handle(msg).then(send, e => { console.debug('Odysseus: message failed', msg && msg.type, e); send({ error: String((e && e.message) || e) }); });
  return true;
});

async function boot() {
  const st = await get();
  const persona = st.persona || buildPersona();
  await set({ persona, profiles: withArchived(st.profiles, persona) });
  await syncRules();
  if (st.enabled) scheduleNext();
}
chrome.runtime.onInstalled.addListener(boot);
chrome.runtime.onStartup.addListener(boot);
