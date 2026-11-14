# Mirage — leave a false trace

Incognito leaves no trace, and trackers can still piece you together. **Mirage works the opposite way: obfuscation, not silence.** It gives every site a coherent *decoy persona* — fake identity signals, fake interests, decoy browsing — so the profile trackers build is detailed, confident, and useless.

## Install (Chrome / Edge / Brave, MV3)
1. `chrome://extensions` → enable **Developer mode**
2. **Load unpacked** → select this folder

## 30-second demo
1. Click the Mirage icon → **Open tracker's view**: "Become nobody." with the decoy persona, and an empty list of sites.
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
- The "tracker's view" is a **local simulation** built only from the signals Mirage emits; it demonstrates the concept, it is not a live feed from a real ad network.
- Decoy traffic is real HTTP requests to public sites. Toggle off any time; cadence is low outside the initial burst.
- Not a Tor replacement: IP address is unchanged (pair with a VPN), and some fingerprint vectors (fonts, audio, `Date#toString`) are not covered.
- Layout: `src/` (background, persona engine, page injector), `popup/`, `tracker/`.

## Optional local backend (Gemini personas)
If the Cyclops Python backend is running at `http://127.0.0.1:8000`, **New fake profile** asks `POST /generate-persona` for a name, age and interests (no data is sent). Location, timezone, device and income still come from a built-in archetype so the spoofed identity stays consistent. If the backend is down or returns something unusable, the built-in personas are used. Override the URL by setting `apiBase` in extension storage. A `analyze` message (`POST /analyze-website`) is also available to the extension backend; no UI uses it yet.
