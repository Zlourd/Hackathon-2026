# Odysseus — leave a false trace

Incognito leaves no trace, and trackers can still piece you together. **Odysseus works the opposite way: obfuscation, not silence.** It gives every site a coherent *decoy persona* — fake identity signals, fake interests, decoy browsing — so the profile trackers build is detailed, confident, and useless.

## Install (Chrome / Edge / Brave, MV3)
1. `chrome://extensions` → enable **Developer mode**
2. **Load unpacked** → select this folder

## 30-second demo
1. Click the Odysseus icon → **Open tracker's view**: "Become nobody." with the decoy persona, and an empty list of sites.
2. Hit **Turn decoy on**. The decoy starts browsing in the background (a fast burst of ~24 visits, then a natural, irregular cadence).
3. Watch the profile fill with the decoy's interests, location, age band and occupation — while **Your real profile** stays blank.

## What it does
| Layer | Mechanism |
|---|---|
| **Decoy persona** | One of several internally consistent archetypes (name, age, job, city, timezone, language, device, interest cluster). *New persona* re-rolls. |
| **Decoy browsing** | Background searches (DuckDuckGo/Bing) and site visits matching the persona's interests, sent with cookies and the decoy's headers, at irregular intervals. |
| **Header identity** | `declarativeNetRequest` rewrites `User-Agent`, `Accept-Language`, `Sec-CH-UA*`, adds `Sec-GPC`. |
| **JS fingerprint** | Injected at document start: navigator (UA, platform, languages, cores, memory, userAgentData), screen, timezone, geolocation (decoy city), canvas noise, WebGL vendor/renderer, referrer. |

## Notes & limits
- The "tracker's view" is a **local simulation** built only from the signals Odysseus emits; it demonstrates the concept, it is not a live feed from a real ad network.
- Decoy traffic is real HTTP requests to public sites. Toggle off any time; cadence is low outside the initial burst.
- Not a Tor replacement: IP address is unchanged (pair with a VPN), and some fingerprint vectors (fonts, audio, `Date#toString`) are not covered.
- Layout: `src/` (background, persona engine, page injector), `popup/`, `tracker/`.

## Optional local backend (Gemini personas)
If the Cyclops Python backend is running at `http://127.0.0.1:8000`, **New fake profile** asks `POST /generate-persona` for a name, age and interests (no data is sent). Location, timezone, device and income still come from a built-in archetype so the spoofed identity stays consistent. If the backend is down or returns something unusable, the built-in personas are used. Override the URL by setting `apiBase` in extension storage. A `analyze` message (`POST /analyze-website`) is also available to the extension backend; no UI uses it yet.

## Polyphemus (decoy data-broker demo)
`polyphemus/` is a mock data-management platform. Click **Open Polyphemus** in the tracker view: it opens inside the extension (`polyphemus/viewer.html`) with no server, no internet and no file-access permission needed. The extension feeds it the decoy persona and decoy browsing events (never real browsing). Polyphemus builds a profile in the **Odysseus Profile** tab and lists the decoy as **Lot #05** in *Buy My Sheep*, where fictional bidders compete for it. No real data is sold.

Styling is a prebuilt `polyphemus/tailwind.css`. After changing classes in `polyphemus/index.html`, rebuild it:
```bash
cd polyphemus && npx tailwindcss@3 -c tailwind.config.js -i <(echo '@tailwind base;@tailwind components;@tailwind utilities;') -o tailwind.css --minify
```

Optional: `polyphemus/index.html` can also be served (`python3 -m http.server 5172 --bind 127.0.0.1 --directory polyphemus`) or opened from disk (turn on *Allow access to file URLs* for the extension); the extension's bridge script feeds it there too.

## Intro animation
The first time the tracker's view is opened in a browser session, `animations/animation.html` plays full-screen for one 15 s cycle, then fades into the view. It is declared as a manifest *sandbox page* (it uses inline scripts) and embedded from `tracker/intro.js`. It plays again after the browser is restarted.
