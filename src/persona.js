import { ARCHETYPES, CHROME } from './data.js';

const NAMES = {
  sailor: ['Margit Halvorsen', 'Ingrid Solberg', 'Torvald Eide', 'Liv Bjørnstad', 'Henrik Moen'],
  'gamer-dev': ['Dario Fontana', 'Tiago Ribeiro', 'Inês Carvalho', 'Rui Machado', 'Beatriz Lopes'],
  gardener: ['Walter Ndlovu', 'Helen Ashworth', 'Colin Pritchard', 'Fatima Okafor', 'Graham Tate'],
  traveler: ['Priya Venkataraman', 'Maya Tremblay', 'Jordan Okonkwo-Reid', 'Sofia Lindqvist', 'Daniel Park'],
  'logistics-br': ['Rafael Mendes', 'Camila Duarte', 'Thiago Barbosa', 'Juliana Ribeiro', 'Bruno Cardoso'],
  'designer-mx': ['Lucía Guzmán', 'Diego Hernández', 'Valeria Ortega', 'Mateo Salazar', 'Ximena Rojas'],
  'engineer-tr': ['Emre Çelik', 'Elif Yılmaz', 'Mert Aydın', 'Zeynep Kaya', 'Burak Demir'],
  'tester-in': ['Ananya Sharma', 'Rohan Deshmukh', 'Priyanka Iyer', 'Arjun Nair', 'Kavya Reddy'],
  'fintech-ng': ['Tunde Adeyemi', 'Chioma Okafor', 'Emeka Nwosu', 'Folake Bello', 'Seun Ogunleye'],
  'teamlead-ph': ['Maria Santos', 'Jose Reyes', 'Angelica Cruz', 'Miguel Villanueva', 'Carla Mendoza']
};

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildPersona(seed = (Math.random() * 2 ** 32) >>> 0, avoidId = null, ai = null) {
  const r = rng(seed);
  const pool = ARCHETYPES.filter(a => a.id !== avoidId);
  const base = pool[Math.floor(r() * pool.length)];
  const d = base.device;
  const ua = `Mozilla/5.0 (${d.uaOS}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROME} Safari/537.36`;
  const major = CHROME.split('.')[0];
  return {
    seed, id: base.id, name: NAMES[base.id][Math.floor(r() * NAMES[base.id].length)], age: base.age + Math.round((r() - 0.5) * 12), occupation: base.occupation, income: base.income,
    city: base.city, tz: base.tz,
    // where they live and what that is worth (used by the Polyphemus price model)
    cc: base.cc, country: base.country, tier: base.tier, areaAvg: base.areaAvg,
    incomeLow: base.incomeUSD[0], incomeHigh: base.incomeUSD[1],
    // jitter the coordinates slightly so the "home" is city-level, not a single point
    lat: base.lat + (r() - 0.5) * 0.04, lon: base.lon + (r() - 0.5) * 0.04,
    lang: base.lang, langs: base.langs,
    acceptLanguage: base.langs.map((l, i) => (i ? `${l};q=${(1 - i * 0.1).toFixed(1)}` : l)).join(','),
    ua, platform: d.platform, os: d.os, major,
    brands: [
      { brand: 'Chromium', version: major },
      { brand: 'Google Chrome', version: major },
      { brand: 'Not?A_Brand', version: '99' }
    ],
    cores: d.cores, mem: d.mem, screen: { w: d.w, h: d.h, dpr: d.dpr }, gpu: d.gpu,
    interests: base.interests,
    noiseSeed: (r() * 2 ** 32) >>> 0,
    source: 'builtin',
    ...(ai ? ai : {})
  };
}

const clean = (v, n = 80) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n) : '');
const ddg = q => `https://duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
const wikiSearch = q => `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(q)}`;

// Validate a /generate-persona response; returns null if unusable.
// Gemini supplies name/age/interests/plan. Location, timezone, language, device and income stay
// with a built-in archetype so the spoofed identity remains internally consistent.
export function personaOverridesFromApi(res) {
  if (!res || typeof res !== 'object') return null;
  const name = clean(res.name, 60);
  const topics = (Array.isArray(res.interests) ? res.interests : []).map(i => clean(i)).filter(Boolean).slice(0, 8);
  if (!name || topics.length < 2) return null;
  const plan = (Array.isArray(res.browsingPlan) ? res.browsingPlan : []).map(i => clean(i, 120)).filter(Boolean);
  const words = t => new Set(t.toLowerCase().split(/\W+/).filter(w => w.length > 3));
  const extra = topics.map(() => []);
  plan.forEach((step, k) => {
    const sw = words(step);
    let best = k % topics.length, score = 0;
    topics.forEach((t, i) => { const o = [...words(t)].filter(w => sw.has(w)).length; if (o > score) { score = o; best = i; } });
    extra[best].push(step);
  });
  const age = Number.isFinite(+res.age) ? Math.min(99, Math.max(13, Math.round(+res.age))) : undefined;
  return {
    name, ...(age ? { age } : {}), source: 'gemini',
    description: clean(res.description, 200), browsingPlan: plan,
    interests: topics.map((t, i) => ({
      topic: t, category: 'AI-generated',
      searches: [t, `best ${t} for beginners`, `${t} news`, `how to get started with ${t}`, ...extra[i]],
      sites: [wikiSearch(t), ddg(`${t} guide`)]
    }))
  };
}
