// Dark/light mode for the tracker view (light by default). Loaded in <head> so the saved theme applies before first paint.
const KEY = 'odysseusTheme';
const read = () => { try { return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light'; } catch { return 'light'; } };
const write = t => {
  try { localStorage.setItem(KEY, t); } catch { /* storage unavailable: theme just won't persist */ }
  // Mirror to extension storage so the popup follows this toggle (Polyphemus always stays dark).
  try { chrome.storage.local.set({ theme: t }); } catch { /* not in an extension context */ }
};

function apply(theme) {
  document.documentElement.dataset.theme = theme;
  const btn = document.getElementById('theme');
  if (btn) btn.textContent = theme === 'light' ? '☾ Dark mode' : '☀ Light mode';
}

apply(read());
try { chrome.storage.local.set({ theme: read() }); } catch { /* not in an extension context */ }
// Coming from Polyphemus via the coin (not a reload): start black, fade in when ready (see profile.css / profile.js).
{
  const reloaded = performance.getEntriesByType('navigation')[0]?.type === 'reload';
  if (location.hash === '#from-polyphemus' && !reloaded) {
    document.documentElement.classList.add('arriving');
    setTimeout(() => document.documentElement.classList.add('ready'), 2500); // safety net
  }
}
document.addEventListener('DOMContentLoaded', () => {
  apply(read());
  document.getElementById('theme').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    write(next);
    apply(next);
  });
});
