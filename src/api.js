// Client for the local Cyclops backend (Python + Gemini). Mirrors the documented contract:
//   POST /generate-persona   POST /start-session   GET /session/{id}   POST /analyze-website
// Nothing here ever sends real user data; /generate-persona sends no body at all.
// Keep every path in ENDPOINTS so a later move to /api/v1/ is a one-line change.
export const DEFAULT_API_BASE = 'http://127.0.0.1:8000';
const ENDPOINTS = {
  persona: '/generate-persona',
  startSession: '/start-session',
  session: id => `/session/${encodeURIComponent(id)}`,
  analyze: '/analyze-website'
};

export async function getApiBase() {
  const { apiBase } = await chrome.storage.local.get('apiBase');
  return (apiBase || DEFAULT_API_BASE).replace(/\/$/, '');
}

async function request(path, { timeout = 8000, ...options } = {}) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeout);
  try {
    const res = await fetch(`${await getApiBase()}${path}`, {
      ...options, signal: ctl.signal, credentials: 'omit', headers: { 'Content-Type': 'application/json', ...options.headers }
    });
    if (!res.ok) {
      let msg = `Request failed (${res.status})`;
      try { const e = await res.json(); if (e.detail) msg = typeof e.detail === 'string' ? e.detail : JSON.stringify(e.detail); } catch {}
      throw new Error(msg);
    }
    return await res.json();
  } finally { clearTimeout(timer); }
}

export const cyclopsApi = {
  generatePersona: () => request(ENDPOINTS.persona, { method: 'POST' }),
  startBrowsing: interests => request(ENDPOINTS.startSession, { method: 'POST', body: JSON.stringify({ interests }) }),
  getSession: id => request(ENDPOINTS.session(id)),
  analyzeWebsite: url => request(ENDPOINTS.analyze, { method: 'POST', body: JSON.stringify({ url }) })
};
