/* The paper desk look (look A in docs/PREMIUM_LOOKS_AND_TRENDS.md): torn paper on a cutting mat, moved like stop motion.
   Markup for one piece of paper:
     <div class="pp" id="x"><div class="fib"></div><div class="face"> ...content... </div></div>
   PAPER.piece("x", {t: 12, b: 16}, seed)  tears the named sides (px of raggedness); sides left out stay scissor-straight.
                                           .fib is the white torn fibre that shows around the coloured .face.
   PAPER.grain()                           makes the paper-grain tile and sets --paper-grain on #root (call once).
   PAPER.boil(t)                           moves the grain six times a second, so still paper looks hand-shot.
   PAPER.twos(t)                           time stepped to 12 frames a second: use it for anything a hand would move.
   PAPER.wob(seed, t)                      -1..1, a new value four times a second: the small shake of a re-laid piece.
   PAPER.draw(pathEl, u)                   draws an SVG stroke from 0 to 1 (marker lines; keep these smooth, not stepped).
   Everything is seeded, so every render of a frame is identical. */
window.PAPER = (function () {
  const rng = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  function torn(w, h, amp, seed, inset) {
    const R = rng(seed * 7919), pts = [];
    const edge = (len, a) => {
      const n = Math.max(2, Math.round(len / 15)), out = []; let wv = 0;
      for (let i = 0; i <= n; i++) { wv = wv * 0.62 + (R() - 0.5); out.push([len * i / n, a ? inset + a * (0.5 + 0.5 * Math.max(-1, Math.min(1, wv * 1.5))) + (R() - 0.5) * a * 0.3 : 0]); }
      return out;
    };
    edge(w, amp.t || 0).forEach(([x, d]) => pts.push([x, d]));
    edge(h, amp.r || 0).forEach(([y, d]) => pts.push([w - d, y]));
    edge(w, amp.b || 0).forEach(([x, d]) => pts.push([w - x, h - d]));
    edge(h, amp.l || 0).forEach(([y, d]) => pts.push([d, h - y]));
    return "polygon(" + pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(",") + ")";
  }
  function piece(id, amp = {}, seed = 1) {
    const el = document.getElementById(id), w = el.offsetWidth, h = el.offsetHeight;
    const fib = el.querySelector(":scope > .fib"), face = el.querySelector(":scope > .face");
    if (fib) fib.style.clipPath = torn(w, h, amp, seed, 0);
    face.style.clipPath = torn(w, h, amp, seed + 3, fib ? 5 : 0);
  }
  function grain(seed = 11, size = 256) {
    const c = document.createElement("canvas"); c.width = c.height = size;
    const g = c.getContext("2d"), im = g.createImageData(size, size), R = rng(seed);
    for (let i = 0; i < size * size; i++) {
      const v = R() < 0.01 ? 150 + R() * 40 : 212 + R() * 43;          // mostly light, a few dark fibres
      im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255;
    }
    g.putImageData(im, 0, 0);
    document.getElementById("root").style.setProperty("--paper-grain", `url(${c.toDataURL("image/png")})`);
  }
  const boil = (t) => { const k = Math.floor(t * 6), r = document.getElementById("root"); r.style.setProperty("--gx", ((k * 53) % 256) + "px"); r.style.setProperty("--gy", ((k * 97) % 256) + "px"); };
  const twos = (t, fps = 12) => Math.floor(t * fps + 1e-6) / fps;
  const wob = (seed, t, hz = 4) => { const x = Math.sin((Math.floor(t * hz + 1e-6) + seed * 131.7) * 12.9898) * 43758.5453; return (x - Math.floor(x)) * 2 - 1; };
  const LEN = new WeakMap();
  function draw(el, u) {
    if (!LEN.has(el)) { const n = el.getTotalLength(); LEN.set(el, n); el.style.strokeDasharray = n; }
    const n = LEN.get(el); u = Math.min(1, Math.max(0, u)); el.style.strokeDashoffset = n * (1 - u); el.style.visibility = u > 0.001 ? "visible" : "hidden";
  }
  return { rng, torn, piece, grain, boil, twos, wob, draw };
})();
