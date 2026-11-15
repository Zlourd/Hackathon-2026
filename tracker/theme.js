// Dark/light mode for the Odysseus tracker view. Loaded in <head> so the saved theme applies before first paint.
const KEY = 'odysseusTheme';
const read = () => { try { return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark'; } catch { return 'dark'; } };
const write = t => { try { localStorage.setItem(KEY, t); } catch { /* storage unavailable: theme just won't persist */ } };

function apply(theme) {
  document.documentElement.dataset.theme = theme;
  const btn = document.getElementById('theme');
  if (btn) btn.textContent = theme === 'light' ? '☾ Dark mode' : '☀ Light mode';
}

apply(read());
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
