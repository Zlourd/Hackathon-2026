// Injected into every page (MAIN world) at document start with the decoy persona.
// MUST be fully self-contained: it is serialised and run in the page.
export function injectedSpoof(P) {
  if (window.__odysseus) return;
  Object.defineProperty(window, '__odysseus', { value: true });

  const def = (obj, prop, value) => {
    try { Object.defineProperty(obj, prop, { get: () => value, configurable: true, enumerable: true }); } catch (e) {}
  };

  // ---- Navigator ----
  const nav = Navigator.prototype;
  def(nav, 'userAgent', P.ua);
  def(nav, 'appVersion', P.ua.replace('Mozilla/', ''));
  def(nav, 'platform', P.platform);
  def(nav, 'language', P.lang);
  def(nav, 'languages', Object.freeze([...P.langs]));
  def(nav, 'hardwareConcurrency', P.cores);
  def(nav, 'deviceMemory', P.mem);
  def(nav, 'doNotTrack', null);
  def(nav, 'globalPrivacyControl', true);
  def(nav, 'maxTouchPoints', 0);
  def(nav, 'webdriver', false);
  if ('userAgentData' in navigator) {
    const uad = {
      brands: P.brands, mobile: false, platform: P.os,
      getHighEntropyValues: async hints => {
        const all = { architecture: 'x86', bitness: '64', model: '', platformVersion: '10.0.0', uaFullVersion: P.major + '.0.0.0',
          fullVersionList: P.brands.map(b => ({ brand: b.brand, version: b.version + '.0.0.0' })), wow64: false };
        const out = { brands: P.brands, mobile: false, platform: P.os };
        (hints || []).forEach(h => { if (h in all) out[h] = all[h]; });
        return out;
      },
      toJSON() { return { brands: P.brands, mobile: false, platform: P.os }; }
    };
    def(nav, 'userAgentData', uad);
  }

  // ---- Screen ----
  const { w, h, dpr } = P.screen;
  const sc = Screen.prototype;
  def(sc, 'width', w); def(sc, 'height', h);
  def(sc, 'availWidth', w); def(sc, 'availHeight', h - 40);
  def(sc, 'colorDepth', 24); def(sc, 'pixelDepth', 24);
  def(window, 'devicePixelRatio', dpr);

  // ---- Timezone ----
  const RealDTF = Intl.DateTimeFormat;
  const origResolved = RealDTF.prototype.resolvedOptions;
  RealDTF.prototype.resolvedOptions = function () {
    const o = origResolved.call(this);
    o.timeZone = P.tz;
    return o;
  };
  Date.prototype.getTimezoneOffset = function () {
    const t = this.getTime();
    if (isNaN(t)) return NaN;
    const parts = new RealDTF('en-US', { timeZone: P.tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric' }).formatToParts(this);
    const g = k => +parts.find(p => p.type === k).value;
    const asUTC = Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'), g('second'));
    return Math.round(((t - (t % 1000)) - asUTC) / 60000);
  };

  // ---- Geolocation: report the decoy's city ----
  const fakePos = () => ({
    coords: { latitude: P.lat, longitude: P.lon, accuracy: 40 + Math.random() * 60, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
    timestamp: Date.now()
  });
  if (navigator.geolocation) {
    const geo = Geolocation.prototype;
    geo.getCurrentPosition = function (ok) { setTimeout(() => ok && ok(fakePos()), 80 + Math.random() * 120); };
    geo.watchPosition = function (ok) { setTimeout(() => ok && ok(fakePos()), 100); return 1; };
    geo.clearWatch = function () {};
  }

  // ---- Canvas fingerprint: deterministic per-persona noise ----
  let s = P.noiseSeed;
  const rnd = () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const noisify = img => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) if (rnd() < 0.02) d[i] = (d[i] + 1) & 255;
    return img;
  };
  const origGet = CanvasRenderingContext2D.prototype.getImageData;
  CanvasRenderingContext2D.prototype.getImageData = function (...a) { return noisify(origGet.apply(this, a)); };
  const shadow = canvas => {
    try {
      const c = document.createElement('canvas'); c.width = canvas.width; c.height = canvas.height;
      const cx = c.getContext('2d'); cx.drawImage(canvas, 0, 0);
      const img = origGet.call(cx, 0, 0, c.width, c.height); noisify(img); cx.putImageData(img, 0, 0);
      return c;
    } catch (e) { return canvas; }
  };
  const origURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function (...a) { return origURL.apply(this.width && this.height ? shadow(this) : this, a); };
  const origBlob = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (...a) { return origBlob.apply(this.width && this.height ? shadow(this) : this, a); };

  // ---- WebGL vendor / renderer ----
  const patchGL = proto => {
    if (!proto) return;
    const orig = proto.getParameter;
    proto.getParameter = function (p) {
      if (p === 37445) return P.gpu[0];
      if (p === 37446) return P.gpu[1];
      return orig.call(this, p);
    };
  };
  patchGL(window.WebGLRenderingContext && WebGLRenderingContext.prototype);
  patchGL(window.WebGL2RenderingContext && WebGL2RenderingContext.prototype);

  // ---- Referrer: never leak the real previous page ----
  try { def(Document.prototype, 'referrer', ''); } catch (e) {}
}
