# Odysseus — leave a false trace

Incognito leaves no trace, and trackers can still piece you together. **Odysseus works the opposite way: obfuscation, not silence.** It gives every site a coherent *decoy persona* — fake identity signals, fake interests, decoy browsing — so the profile trackers build is detailed, confident, and useless.

## Install (Chrome / Edge / Brave, MV3)
1. `chrome://extensions` → enable **Developer mode**
2. **Load unpacked** → select this folder

## 30-second demo
1. Click the Odysseus icon → **Open tracker's view**: "Become nobody." with the decoy persona, and an empty list of sites.
2. Hit **Turn decoy on**. The decoy starts browsing in the background (a fast burst of ~24 visits, then a natural, irregular cadence).
3. Watch the profile fill with the decoy's interests, location, age band and occupation, and the **decoy data leaks** counter climb. None of it is the real you.

## What it does
| Layer | Mechanism |
|---|---|
| **Decoy persona** | One of ten internally consistent archetypes in ten countries (name, age, job, city, timezone, language, device, interest cluster, plus the economics the Polyphemus price model uses). *New persona* re-rolls. |
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
`polyphemus/` is a mock data-broker platform that is always dark. Click the coin logo in the Odysseus page (the page fades to black, then Polyphemus fades in; the coin there fades back; Back also works): it opens inside the extension (`polyphemus/viewer.html`) with no server, no internet and no file-access permission needed. The extension feeds it the decoy persona and decoy browsing events (never real browsing).

- **What You Could Have Lost** is a short educational guide (about a 5-minute read): how tech companies collect your data, how profiles are built, why it matters, how to protect yourself, where Odysseus fits (and what it cannot do), your legal rights and common myths. It is static text with jump links, and a button that opens the Live Data Auction tab.
- **Live Data Auction** lists the same profiles as a simulated stock-style market. One symbol per profile (`TRIB.PT` = **T**iago **RIB**eiro, Portugal) with a flag next to the name, the country's development tier, annual income, a live price, change, sparkline, a selected-profile panel (chart, bid/ask book, *sell 1 lot at bid*), a **Why this price** breakdown, a time-and-sales tape and a feed of the signals moving the market. Every new decoy search or visit from Odysseus raises that profile's certainty, so its price steps up. The board has exactly as many rows as there are stored profiles (stored in extension storage, newest 100); click a column header to sort, or use **Clear past profiles** in the board header to keep only the live one. Price history lives in the page, so reloading Polyphemus restarts the trading session.

### How a profile's data is priced
`fair value = $5.00 × income × development × area × interest × activity` (CPM, simulated; the live price wanders around it)

| Factor | Rule |
|---|---|
| Annual income | `(income ÷ $50k) ^ 0.40`, capped ×0.30 – ×1.80 |
| Country development | Tier 1 (highly developed) ×1.00, Tier 2 (emerging) ×0.70, Tier 3 (developing) ×0.50, from the World Bank income group of the persona's country |
| Area average income | `(city average ÷ $40k) ^ 0.25`, capped ×0.50 – ×1.40. The city averages in `src/data.js` are rough placeholders, not official statistics |
| Interest demand | ×1.30 for travel, shopping, technology, photography and automotive interests, else ×1.00 |
| Signal activity | `0.90 + 0.30 × certainty`, so the price creeps up while the decoy is browsing |

Constants live in `PRICE_MODEL` in `polyphemus/index.html`; each archetype's `cc`, `tier`, `areaAvg` and `incomeUSD` live in `src/data.js`.

Light/dark mode is toggled on the Odysseus page (light by default); the extension popup follows it. Polyphemus does not.

Styling is a prebuilt `polyphemus/tailwind.css`. After changing classes in `polyphemus/index.html`, rebuild it:
```bash
cd polyphemus && npx tailwindcss@3 -c tailwind.config.js -i <(echo '@tailwind base;@tailwind components;@tailwind utilities;') -o tailwind.css --minify
```

Optional: `polyphemus/index.html` can also be served from the repo root (`python3 -m http.server 5172 --bind 127.0.0.1`, then open <http://127.0.0.1:5172/polyphemus/>) or opened from disk (turn on *Allow access to file URLs* for the extension); the extension's bridge script feeds it there too. It loads the shared flag art from `assets/flags.js`, so serve the repo root, not just `polyphemus/`.

## Intro animation
The loading-bar animation (`animations/loadingbar.html`) plays full-screen as the intro: the first time the tracker's view is opened in a browser session, and again whenever that page is reloaded. A dark-blue night scene with a moon turns into a sand-coloured day with a sun as the bar fills (about 5 seconds), then the overlay fades out. Coming back from Polyphemus through the coin skips it and fades in from black instead. `animations/animation.html` and `finalanimation.html` are not used by the extension.

The animation is a sandboxed extension page (it uses inline scripts), so it is listed under `sandbox.pages` in `manifest.json` and embedded by `tracker/intro.js`. It tells the page when the bar is full; if it ever does not, `intro.js` fades it out after a timeout.
