import { ARCHETYPES, CHROME } from './data.js';

const NAMES = {
  sailor: ['Margit Halvorsen', 'Ingrid Solberg', 'Torvald Eide', 'Liv Bjørnstad', 'Henrik Moen'],
  'gamer-dev': ['Dario Fontana', 'Tiago Ribeiro', 'Inês Carvalho', 'Rui Machado', 'Beatriz Lopes'],
  gardener: ['Walter Ndlovu', 'Helen Ashworth', 'Colin Pritchard', 'Fatima Okafor', 'Graham Tate'],
  traveler: ['Priya Venkataraman', 'Maya Tremblay', 'Jordan Okonkwo-Reid', 'Sofia Lindqvist', 'Daniel Park']
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

export function buildPersona(seed = (Math.random() * 2 ** 32) >>> 0, avoidId = null) {
  const r = rng(seed);
  const pool = ARCHETYPES.filter(a => a.id !== avoidId);
  const base = pool[Math.floor(r() * pool.length)];
  const d = base.device;
  const ua = `Mozilla/5.0 (${d.uaOS}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROME} Safari/537.36`;
  const major = CHROME.split('.')[0];
  return {
    seed, id: base.id, name: NAMES[base.id][Math.floor(r() * NAMES[base.id].length)], age: base.age + Math.round((r() - 0.5) * 12), occupation: base.occupation, income: base.income,
    city: base.city, tz: base.tz,
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
    noiseSeed: (r() * 2 ** 32) >>> 0
  };
}
