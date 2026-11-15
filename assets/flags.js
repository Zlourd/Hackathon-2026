// Shared flag art for the Odysseus page and the Polyphemus page.
// Drawn in code because flag emoji do not render on Windows. Classic script (no modules) so both an
// extension page and a sandboxed page can load it with a plain <script src>.
//
//   odyFlagSvg('PT')            -> '<svg viewBox="0 0 22 16">…</svg>' (size it with CSS)
//   odyFlagSvg('PT', 22)        -> same with width/height attributes (height keeps the 22:16 ratio)
//   odyCountryCode(persona)     -> 'PT' (uses persona.cc, else looks the country name up)
(function () {
  var FLAGS = {
    NO: '<rect width="22" height="16" fill="#ba0c2f"/><rect x="6" width="4" height="16" fill="#fff"/><rect y="6" width="22" height="4" fill="#fff"/><rect x="7" width="2" height="16" fill="#00205b"/><rect y="7" width="22" height="2" fill="#00205b"/>',
    PT: '<rect width="22" height="16" fill="#ff0000"/><rect width="9" height="16" fill="#006600"/><circle cx="9" cy="8" r="3" fill="#ffcc00"/><circle cx="9" cy="8" r="1.6" fill="#ff0000"/>',
    GB: '<rect width="22" height="16" fill="#012169"/><path d="M0 0l22 16M22 0L0 16" stroke="#fff" stroke-width="3"/><path d="M0 0l22 16M22 0L0 16" stroke="#c8102e" stroke-width="1.2"/><path d="M11 0v16M0 8h22" stroke="#fff" stroke-width="5"/><path d="M11 0v16M0 8h22" stroke="#c8102e" stroke-width="3"/>',
    CA: '<rect width="22" height="16" fill="#fff"/><rect width="5.5" height="16" fill="#d52b1e"/><rect x="16.5" width="5.5" height="16" fill="#d52b1e"/><polygon points="11,3 12,5.5 13.6,5 13,8 14.5,7.4 14,9.2 11.6,10.6 11.6,13 10.4,13 10.4,10.6 8,9.2 7.5,7.4 9,8 8.4,5 10,5.5" fill="#d52b1e"/>',
    BR: '<rect width="22" height="16" fill="#009c3b"/><polygon points="11,2 20,8 11,14 2,8" fill="#ffdf00"/><circle cx="11" cy="8" r="3.2" fill="#002776"/><path d="M8 7.3Q11 6.3 14 8.5" stroke="#fff" stroke-width=".7" fill="none"/>',
    MX: '<rect width="22" height="16" fill="#fff"/><rect width="7.34" height="16" fill="#006847"/><rect x="14.66" width="7.34" height="16" fill="#ce1126"/><circle cx="11" cy="8" r="2" fill="#8a6a2f"/>',
    TR: '<rect width="22" height="16" fill="#e30a17"/><circle cx="8.3" cy="8" r="3.7" fill="#fff"/><circle cx="9.4" cy="8" r="3" fill="#e30a17"/><polygon points="13.40,6.30 13.81,7.43 15.02,7.47 14.07,8.22 14.40,9.38 13.40,8.70 12.40,9.38 12.73,8.22 11.78,7.47 12.99,7.43" fill="#fff"/>',
    IN: '<rect width="22" height="5.34" fill="#ff9933"/><rect y="5.34" width="22" height="5.33" fill="#fff"/><rect y="10.67" width="22" height="5.33" fill="#138808"/><circle cx="11" cy="8" r="1.9" fill="none" stroke="#000080" stroke-width=".55"/><circle cx="11" cy="8" r=".45" fill="#000080"/>',
    NG: '<rect width="22" height="16" fill="#fff"/><rect width="7.34" height="16" fill="#008751"/><rect x="14.66" width="7.34" height="16" fill="#008751"/>',
    PH: '<rect width="22" height="8" fill="#0038a8"/><rect y="8" width="22" height="8" fill="#ce1126"/><polygon points="0,0 11.5,8 0,16" fill="#fff"/><circle cx="3.7" cy="8" r="1.5" fill="#fcd116"/>'
  };

  // Country name (as it appears after the comma in persona.city) -> code. Fallback for older stored personas.
  var NAME_TO_CC = {
    'Norway': 'NO', 'Portugal': 'PT', 'United Kingdom': 'GB', 'Canada': 'CA', 'Brazil': 'BR', 'Mexico': 'MX',
    'Türkiye': 'TR', 'Turkey': 'TR', 'India': 'IN', 'Nigeria': 'NG', 'Philippines': 'PH'
  };

  window.ODY_FLAGS = FLAGS;

  window.odyCountryCode = function (p) {
    if (!p) return '';
    if (p.cc && FLAGS[p.cc]) return p.cc;
    var name = p.country || String(p.city || '').split(',').pop().trim();
    return NAME_TO_CC[name] || '';
  };

  window.odyFlagSvg = function (cc, width) {
    var inner = FLAGS[cc];
    if (!inner) return '';
    var size = width ? ' width="' + width + '" height="' + Math.round(width * 16 / 22) + '"' : '';
    return '<svg viewBox="0 0 22 16"' + size + ' aria-hidden="true">' + inner + '</svg>';
  };
})();
