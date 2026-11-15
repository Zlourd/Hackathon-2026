// Forces the Odyssey animation to play the first time the tracker view is opened in a browser session.
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

if (await alreadyPlayed()) {
  intro.remove();
} else {
  await markPlayed();
  setTimeout(hide, DURATION_MS);
}
