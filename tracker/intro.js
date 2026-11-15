// Plays the Odyssey animation full-screen:
//  - the first time the tracker view opens in a browser session, and
//  - every time the page is reloaded.
// Arriving from Polyphemus via the coin is a seamless switch instead: no animation, just a fade in from black.
// The animation is a sandboxed extension page (it uses inline scripts), embedded in #intro.
const intro = document.getElementById('intro');
const DURATION_MS = 15500; // one full 15 s cycle of the animation, plus a beat
const KEY = 'introPlayed';

async function alreadyPlayed() {
  try { return !!(await chrome.storage.session.get(KEY))[KEY]; } catch { return sessionStorage.getItem(KEY) === '1'; }
}
async function markPlayed() {
  try { await chrome.storage.session.set({ [KEY]: true }); } catch { sessionStorage.setItem(KEY, '1'); }
}
function hide() {
  intro.classList.add('done');
  setTimeout(() => intro.remove(), 900);
}
const navType = performance.getEntriesByType('navigation')[0]?.type;
const reloaded = navType === 'reload';
const fromPolyphemus = location.hash === '#from-polyphemus' && !reloaded;
history.replaceState(null, '', location.pathname); // drop the marker so a later reload plays the intro

if (fromPolyphemus) {
  intro.remove(); // the fade-in from black is pure CSS (html.arriving), so there is no flash
} else if (reloaded || !(await alreadyPlayed())) {
  await markPlayed();
  setTimeout(hide, DURATION_MS);
} else {
  intro.remove();
}
