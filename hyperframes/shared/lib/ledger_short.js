/* India Ledger look for vertical Reveal Loop Shorts (1080 x 1920): ruled paper, red margin, ink, one green accent,
   gold only for the metal, red only for the audit stamp. Same palette as the gold episode (videos/il-gold-act*).
   LS.init() injects the styles; the page keeps its own scenes. Helpers:
     LS.on(el, o, x, y, s, r)   opacity + transform          LS.inr(n)   Indian digit grouping (5,52,261)
     LS.geo(b, box)             equirectangular projection fitted to a box, with cos(mid-lat) correction
     LS.india(g, P, opt)        India: land, states, outline; opt.hi = {state: colour}
     LS.world(g, P, opt)        Natural Earth 110m land
     LS.arc(g, a, b, u, col)    a curved flight / shipping arc, drawn to u (0..1)
     LS.pin(g, p, t, col)       a pulsing pin
     LS.ICON[name]              inline SVG strings, ink-on-paper line drawings (our own) */
window.LS = (function () {
  const C = { bg: "#f3efe6", ink: "#14161a", muted: "#4f555e", acc: "#0e7c66", gold: "#b8860b", red: "#c8431f", card: "#fbf8f0",
    land: "#e4dccb", land2: "#d6cbb4", sea: "#f3efe6" };
  const CSS = `
  #root.ledger { --bg: ${C.bg}; --fg: ${C.ink}; --muted: ${C.muted}; --acc: ${C.acc}; --acc2: ${C.red}; --gold: ${C.gold}; --card: ${C.card}; --ink: ${C.ink}; background: var(--bg); color: var(--fg); }
  .ledger #grain { opacity: 0.1; mix-blend-mode: multiply; }
  .ledger #vig { --vig: 0.08; }
  .ledger #rules { position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 34px, rgba(200,67,31,.55) 34px, rgba(200,67,31,.55) 36px, transparent 36px, transparent 42px, rgba(200,67,31,.55) 42px, rgba(200,67,31,.55) 44px, transparent 44px),
      repeating-linear-gradient(180deg, transparent 0 53px, rgba(14,124,102,.16) 53px 54px); }
  .ledger .kicker { color: var(--acc); left: 64px; top: 120px; }
  .ledger .src { color: var(--muted); left: 64px; top: 1500px; width: 880px; font-size: 26px; line-height: 1.3; }
  .ledger .src div { position: absolute; left: 0; top: 0; width: 880px; opacity: 0; }
  .ledger #capband { top: 1290px; }
  .ledger #capband .c { color: var(--fg); -webkit-text-stroke: 12px ${C.bg}; text-shadow: none; }
  .ledger #capband .c em { color: var(--acc); }
  .ledger .big { color: var(--fg); -webkit-text-stroke: 0; }
  .ledger .big.acc { color: var(--acc); } .ledger .big.gold { color: #8a6508; } .ledger .big.red { color: var(--red); }
  .ledger .lab { color: var(--fg); -webkit-text-stroke: 0; }
  .ledger .lab.acc { color: var(--acc); }
  .ledger .lab.mut { color: var(--muted); font: 400 30px/1.25 Plex, monospace; letter-spacing: 0; }
  .ledger .chip { color: ${C.card}; background: var(--fg); font-size: 42px; }
  .ledger .chip.acc { background: var(--acc); } .ledger .chip.red { background: var(--red); } .ledger .chip.gold { background: var(--gold); }
  .ledger .card { position: absolute; background: var(--card); border: 3px solid var(--fg); box-shadow: 10px 10px 0 rgba(20,22,26,.12); }
  .ledger .stamp { position: absolute; font: 700 92px/1 Oswald, sans-serif; letter-spacing: .04em; color: var(--acc2); border: 9px solid var(--acc2);
    padding: 8px 26px 14px; background: rgba(243,239,230,.85); white-space: nowrap; opacity: 0; }
  .ledger .strike { position: absolute; height: 10px; background: var(--acc2); transform-origin: 0 50%; }
  .ledger .ill { position: absolute; font: 400 24px/1 Plex, monospace; color: var(--muted); letter-spacing: .04em; }
  .ledger svg.ic { position: absolute; overflow: visible; }
  `;
  function init() {
    const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    document.getElementById("root").classList.add("ledger");
  }
  const on = (el, o, x = 0, y = 0, s = 1, r = 0) => {
    el.style.opacity = o;
    if (o > 0) el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${s.toFixed(4)}) rotate(${r}deg)`;
  };
  const inr = (n) => {
    n = Math.round(n); const s = String(Math.abs(n)); if (s.length <= 3) return (n < 0 ? "-" : "") + s;
    const last = s.slice(-3), rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return (n < 0 ? "-" : "") + rest + "," + last;
  };
  // ---- maps
  function geo(b, box) {
    const k = Math.cos(((b.lat0 + b.lat1) / 2) * Math.PI / 180);
    const sc = Math.min(box.w / ((b.lon1 - b.lon0) * k), box.h / (b.lat1 - b.lat0));
    const cx = box.x + box.w / 2, cy = box.y + box.h / 2, lc = (b.lon0 + b.lon1) / 2, la = (b.lat0 + b.lat1) / 2;
    return (lon, lat) => [cx + (lon - lc) * k * sc, cy - (lat - la) * sc];
  }
  const lerpB = (a, b, u) => ({ lon0: a.lon0 + (b.lon0 - a.lon0) * u, lon1: a.lon1 + (b.lon1 - a.lon1) * u, lat0: a.lat0 + (b.lat0 - a.lat0) * u, lat1: a.lat1 + (b.lat1 - a.lat1) * u });
  function india(g, P, opt = {}) {
    const I = window.INDIA; if (!I) return;
    const hi = opt.hi || {};
    for (const d of I.districts) {
      g.beginPath();
      for (const r of d.rings) { for (let i = 0; i < r.length; i += 2) { const [x, y] = P(r[i], r[i + 1]); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.closePath(); }
      g.fillStyle = hi[d.s] || opt.land || C.land; g.fill();
    }
    const segs = (arr) => { g.beginPath(); for (let i = 0; i < arr.length; i += 4) { const [a, b] = P(arr[i], arr[i + 1]), [c, e] = P(arr[i + 2], arr[i + 3]); g.moveTo(a, b); g.lineTo(c, e); } };
    segs(I.states); g.strokeStyle = "rgba(20,22,26,.28)"; g.lineWidth = 1.6; g.stroke();
    segs(I.outline); g.strokeStyle = C.ink; g.lineWidth = 3; g.stroke();
  }
  function world(g, P, opt = {}) {
    g.beginPath();
    for (const r of window.LAND || []) { r.forEach(([lon, lat], i) => { const [x, y] = P(lon, lat); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); }
    g.fillStyle = opt.land || C.land; g.fill(); g.strokeStyle = "rgba(20,22,26,.55)"; g.lineWidth = 2; g.stroke();
  }
  function arc(g, a, b, u, col = C.acc, w = 7, lift = 0.28) {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    const cx = mx, cy = my - L * lift;
    const q = (s) => [(1 - s) * (1 - s) * a[0] + 2 * (1 - s) * s * cx + s * s * b[0], (1 - s) * (1 - s) * a[1] + 2 * (1 - s) * s * cy + s * s * b[1]];
    g.beginPath(); const n = 60; for (let i = 0; i <= n * u; i++) { const p = q(i / n); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }
    g.strokeStyle = col; g.lineWidth = w; g.lineCap = "round"; g.stroke();
    return q(Math.max(0, Math.min(1, u)));
  }
  function pin(g, p, t, col = C.acc, r0 = 13) {
    const pulse = ((t * 0.9) % 1 + 1) % 1;
    g.beginPath(); g.arc(p[0], p[1], r0 + 40 * pulse, 0, 7); g.strokeStyle = col; g.globalAlpha = 1 - pulse; g.lineWidth = 5; g.stroke(); g.globalAlpha = 1;
    g.beginPath(); g.arc(p[0], p[1], r0 + 6, 0, 7); g.fillStyle = C.bg; g.fill();
    g.beginPath(); g.arc(p[0], p[1], r0, 0, 7); g.fillStyle = col; g.fill();
  }
  // ---- icons (viewBox units; size set by the page)
  const ICON = {
    phone: `<svg class="ic" viewBox="0 0 200 400"><rect x="6" y="6" width="188" height="388" rx="30" fill="${C.ink}"/><rect x="18" y="40" width="164" height="320" rx="8" fill="${C.acc}"/>
      <rect x="18" y="40" width="164" height="320" rx="8" fill="url(#gl)"/><defs><linearGradient id="gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
      <rect x="78" y="18" width="44" height="8" rx="4" fill="#444"/><circle cx="100" cy="376" r="9" fill="#333"/>
      <text x="100" y="215" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="64" fill="${C.card}">₹</text></svg>`,
    pocket: `<svg class="ic" viewBox="0 0 600 520"><path d="M20 20 H580 V330 Q580 500 300 510 Q20 500 20 330 Z" fill="#3b5b84" stroke="${C.ink}" stroke-width="8"/>
      <path d="M20 20 H580" stroke="#2a4466" stroke-width="26"/><path d="M60 60 H540 V320 Q540 460 300 470 Q60 460 60 320 Z" fill="none" stroke="#e7c27a" stroke-width="5" stroke-dasharray="16 12"/></svg>`,
    tower: `<svg class="ic" viewBox="0 0 200 300"><path d="M100 60 L40 290 M100 60 L160 290 M60 210 H140 M75 150 H125 M50 250 L150 250" stroke="${C.ink}" stroke-width="10" fill="none" stroke-linecap="round"/>
      <circle cx="100" cy="50" r="14" fill="${C.acc}"/><path d="M60 20 Q100 -10 140 20 M40 0 Q100 -40 160 0" stroke="${C.acc}" stroke-width="8" fill="none" stroke-linecap="round"/></svg>`,
    ship: `<svg class="ic" viewBox="0 0 400 220"><path d="M20 120 H380 L340 200 H60 Z" fill="${C.ink}"/><rect x="70" y="70" width="60" height="50" fill="${C.red}"/><rect x="135" y="70" width="60" height="50" fill="${C.acc}"/>
      <rect x="200" y="70" width="60" height="50" fill="${C.gold}"/><rect x="265" y="40" width="60" height="80" fill="${C.muted}"/><rect x="100" y="20" width="60" height="50" fill="${C.acc}"/>
      <path d="M0 210 Q50 195 100 210 T200 210 T300 210 T400 210" stroke="${C.acc}" stroke-width="6" fill="none"/></svg>`,
    plane: `<svg class="ic" viewBox="0 0 200 200"><path d="M100 10 C110 10 112 30 112 50 L112 80 L190 120 L190 138 L112 115 L112 160 L135 178 L135 190 L100 180 L65 190 L65 178 L88 160 L88 115 L10 138 L10 120 L88 80 L88 50 C88 30 90 10 100 10 Z" fill="${C.ink}"/></svg>`,
    bottle: `<svg class="ic" viewBox="0 0 160 440"><path d="M58 10 H102 V70 Q102 100 130 140 Q150 170 150 210 V400 Q150 430 120 430 H40 Q10 430 10 400 V210 Q10 170 30 140 Q58 100 58 70 Z" fill="CLR" stroke="${C.ink}" stroke-width="7"/>
      <rect x="54" y="0" width="52" height="26" rx="4" fill="${C.ink}"/><rect x="10" y="230" width="140" height="110" fill="${C.card}" stroke="${C.ink}" stroke-width="5"/>
      <text x="80" y="305" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="58" fill="${C.ink}">LBL</text></svg>`,
    bangle: `<svg class="ic" viewBox="0 0 300 300"><circle cx="150" cy="150" r="120" fill="none" stroke="${C.gold}" stroke-width="34"/><circle cx="150" cy="150" r="120" fill="none" stroke="#e8c45a" stroke-width="8" stroke-dasharray="4 18"/>
      <circle cx="150" cy="150" r="138" fill="none" stroke="${C.ink}" stroke-width="3"/><circle cx="150" cy="150" r="102" fill="none" stroke="${C.ink}" stroke-width="3"/></svg>`,
    bar: `<svg class="ic" viewBox="0 0 300 140"><path d="M40 20 H260 L295 125 H5 Z" fill="${C.gold}" stroke="${C.ink}" stroke-width="6"/><path d="M60 35 H240" stroke="#f1d27a" stroke-width="8"/>
      <text x="150" y="100" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="40" fill="${C.ink}">999.9</text></svg>`,
    cert: `<svg class="ic" viewBox="0 0 520 360"><rect x="6" y="6" width="508" height="348" fill="${C.card}" stroke="${C.ink}" stroke-width="6"/><rect x="24" y="24" width="472" height="312" fill="none" stroke="${C.gold}" stroke-width="4" stroke-dasharray="10 6"/>
      <text x="260" y="88" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="40" fill="${C.ink}">SOVEREIGN GOLD BOND</text>
      <text x="260" y="130" text-anchor="middle" font-family="Plex" font-size="22" fill="${C.muted}">GOVERNMENT OF INDIA · 2015</text>
      <path d="M70 180 H450 M70 215 H450 M70 250 H330" stroke="${C.muted}" stroke-width="4"/><circle cx="420" cy="275" r="44" fill="none" stroke="${C.gold}" stroke-width="6"/>
      <text x="420" y="287" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="34" fill="${C.gold}">1 g</text></svg>`,
    locker: `<svg class="ic" viewBox="0 0 360 420"><rect x="10" y="10" width="340" height="400" rx="14" fill="#5d646d" stroke="${C.ink}" stroke-width="8"/><rect x="40" y="40" width="280" height="300" rx="8" fill="#7b838c" stroke="${C.ink}" stroke-width="5"/>
      <circle cx="180" cy="190" r="56" fill="#9aa1a8" stroke="${C.ink}" stroke-width="6"/><path d="M180 140 V240 M130 190 H230" stroke="${C.ink}" stroke-width="7"/><rect x="120" y="365" width="120" height="14" rx="6" fill="${C.ink}"/></svg>`,
    flame: `<svg class="ic" viewBox="0 0 200 260"><path d="M100 10 C130 70 180 100 170 170 C162 225 130 250 100 250 C70 250 38 225 30 170 C22 110 70 90 100 10 Z" fill="${C.red}"/>
      <path d="M100 100 C115 140 140 160 135 195 C130 225 115 235 100 235 C85 235 70 225 65 195 C60 160 88 140 100 100 Z" fill="${C.gold}"/></svg>`,
    drum: `<svg class="ic" viewBox="0 0 300 200"><path d="M40 150 C0 120 20 40 90 40 C150 40 190 80 220 110 L270 130 C292 120 300 150 280 160 C295 175 270 195 255 175 L210 160 C170 175 90 190 40 150 Z" fill="#d9a35b" stroke="${C.ink}" stroke-width="7"/></svg>`,
    box: `<svg class="ic" viewBox="0 0 420 260"><rect x="10" y="40" width="400" height="210" fill="${C.acc}" stroke="${C.ink}" stroke-width="7"/>
      ${[1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${10 + i * 50} 52 V238" stroke="#0a5e4d" stroke-width="8"/>`).join("")}<rect x="10" y="10" width="400" height="36" fill="#0a5e4d" stroke="${C.ink}" stroke-width="7"/>
      <text x="210" y="160" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="56" fill="${C.card}">BUFFALO MEAT</text></svg>`,
  };
  return { init, on, inr, geo, lerpB, india, world, arc, pin, ICON, C };
})();
