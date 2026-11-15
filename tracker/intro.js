// Plays the loading-bar animation (animations/loadingbar.html) full-screen as the intro:
//  - the first time the tracker view opens in a browser session, and
//  - every time the page is reloaded.
// Arriving from Polyphemus via the coin is a seamless switch instead: no intro (see theme.js and profile.css).
// The animation is a sandboxed extension page (it uses inline scripts) embedded in #intro. It reports when its bar is
// full; a timer covers the case where it never does.
const intro = document.getElementById('intro');
const frame = document.getElementById('introFrame');
const KEY = 'introPlayed';
const SRC = '../animations/loadingbar.html';
const BEAT_MS = 450;      // hold on the full bar before fading out
const FALLBACK_MS = 6000; // the bar takes 5 s; if it never reports, fade out this long after the animation loaded

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
function play() {
  let finished = false;
  const finish = delay => {
    if (finished) return;
    finished = true;
    removeEventListener('message', onMessage);
    setTimeout(hide, delay);
  };
  const onMessage = e => {
    if (e.source === frame.contentWindow && e.data?.source === 'loadingbar' && e.data.type === 'done') finish(BEAT_MS);
  };
  addEventListener('message', onMessage);
  frame.addEventListener('load', () => setTimeout(() => finish(0), FALLBACK_MS), { once: true });
  frame.src = SRC; // loaded only when it is going to play
}

const cameFromPolyphemus = document.documentElement.classList.contains('arriving'); // set by theme.js
const reloaded = performance.getEntriesByType('navigation')[0]?.type === 'reload';

if (cameFromPolyphemus) {
  intro.remove();
} else if (reloaded || !(await alreadyPlayed())) {
  await markPlayed();
  play();
} else {
  intro.remove();
}
