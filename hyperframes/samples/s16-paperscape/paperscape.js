/* Paperscape engine: layered paper / clay relief scenes drawn entirely in code.
   Every layer is a polygon. Its pixels get a height field (edge dome + a pattern such as coiled cords, spirals,
   streaks or rough plaster), lit per pixel from the top left, darkened in the crevices and dropped on a soft shadow.
   Static layers are baked once into sprites; "live" layers (sun, rivers, lava) are relit every frame so their
   texture can flow. Everything is seeded, so every frame is repeatable. */
window.PS = (function () {
  const W = 1080, H = 1920;
  const LX = -0.48, LY = -0.62, LZ = 0.62, LN = Math.hypot(LX, LY, LZ);
  const L = [LX / LN, LY / LN, LZ / LN];

  // ---------- randomness and noise ----------
  function rng(seed) { let s = (seed % 2147483646) + 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
  function noise(seed) {
    const r = rng(seed), P = new Uint16Array(512), G = new Float32Array(256);
    for (let i = 0; i < 256; i++) { P[i] = i; G[i] = r(); }
    for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [P[i], P[j]] = [P[j], P[i]]; }
    for (let i = 0; i < 256; i++) P[i + 256] = P[i];
    const n2 = (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
      const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
      const a = P[xi & 255], b = P[(xi + 1) & 255];
      const g00 = G[P[a + (yi & 255)]], g10 = G[P[b + (yi & 255)]], g01 = G[P[a + ((yi + 1) & 255)]], g11 = G[P[b + ((yi + 1) & 255)]];
      return g00 + (g10 - g00) * u + (g01 - g00) * v + (g00 - g10 - g01 + g11) * u * v;
    };
    const fbm = (x, y, o = 4) => { let s = 0, a = 0.5, f = 1, t = 0; for (let i = 0; i < o; i++) { s += a * n2(x * f + i * 17.3, y * f - i * 9.1); t += a; f *= 2.03; a *= 0.5; } return s / t; };
    return { n2, fbm };
  }
  const N = noise(11), N2 = noise(29);

  // ---------- pattern helpers (all return 0..1 heights) ----------
  const fract = (x) => x - Math.floor(x);
  const cord = (u) => { const q = 2 * fract(u) - 1; return Math.sqrt(Math.max(0, 1 - q * q)); };      // round cord profile
  const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const spiral = (X, Y, cx, cy, sp) => { const dx = X - cx, dy = Y - cy; return cord(Math.hypot(dx, dy) / sp + Math.atan2(dy, dx) / 6.2832); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

  // ---------- geometry helpers ----------
  const circle = (cx, cy, r, n = 0) => { n = n || Math.max(24, Math.round(r * 0.9)); const p = []; for (let i = 0; i < n; i++) { const a = (i / n) * 6.2832; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return p; };
  function blob(cx, cy, rx, ry, amp = 0.12, seed = 1, freq = 3) {
    const nz = noise(seed), n = Math.max(48, Math.round((rx + ry) * 0.6)), p = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * 6.2832, k = 1 + amp * (nz.fbm(Math.cos(a) * freq + 5, Math.sin(a) * freq + 5, 3) * 2 - 1); p.push([cx + rx * k * Math.cos(a), cy + ry * k * Math.sin(a)]); }
    return p;
  }
  // a band whose top edge is yfn(x), closed far below the frame
  function band(x0, x1, yfn, bottom = H + 200, step = 6) { const p = []; for (let x = x0; x <= x1; x += step) p.push([x, yfn(x)]); p.push([x1, bottom], [x0, bottom]); return p; }
  // a ribbon (river, lava streak) along a centre line given as [x,y,width] control points
  function ribbon(ctrl, steps = 24, wob = 0, seed = 3) {
    const nz = noise(seed), c = [];
    for (let i = 0; i < ctrl.length - 1; i++) {
      const p0 = ctrl[Math.max(0, i - 1)], p1 = ctrl[i], p2 = ctrl[i + 1], p3 = ctrl[Math.min(ctrl.length - 1, i + 2)];
      for (let s = 0; s < steps; s++) {
        const t = s / steps, t2 = t * t, t3 = t2 * t;
        const f = (k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3);
        c.push([f(0), f(1), f(2)]);
      }
    }
    c.push(ctrl[ctrl.length - 1]);
    const L1 = [], R1 = [];
    for (let i = 0; i < c.length; i++) {
      const a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)];
      let tx = b[0] - a[0], ty = b[1] - a[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      const w = c[i][2] / 2;
      const wl = w * (1 + wob * (nz.n2(i * 0.15, 1) - 0.5)), wr = w * (1 + wob * (nz.n2(i * 0.15, 7) - 0.5));
      L1.push([c[i][0] - ty * wl, c[i][1] + tx * wl]); R1.push([c[i][0] + ty * wr, c[i][1] - tx * wr]);
    }
    return { poly: L1.concat(R1.reverse()), line: c };
  }

  // ---------- exact Euclidean distance transform (Felzenszwalb) ----------
  function edt(inside, w, h) {
    const INF = 1e20, n = Math.max(w, h), f = new Float64Array(n), d = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1);
    const g = new Float64Array(w * h);
    for (let i = 0; i < w * h; i++) g[i] = inside[i] ? INF : 0;
    const pass = (len) => {
      let k = 0; v[0] = 0; z[0] = -INF; z[1] = INF;
      for (let q = 1; q < len; q++) {
        let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
        while (s <= z[k]) { k--; s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]); }
        k++; v[k] = q; z[k] = s; z[k + 1] = INF;
      }
      k = 0;
      for (let q = 0; q < len; q++) { while (z[k + 1] < q) k++; d[q] = (q - v[k]) * (q - v[k]) + f[v[k]]; }
    };
    for (let x = 0; x < w; x++) { for (let y = 0; y < h; y++) f[y] = g[y * w + x]; pass(h); for (let y = 0; y < h; y++) g[y * w + x] = d[y]; }
    for (let y = 0; y < h; y++) { for (let x = 0; x < w; x++) f[x] = g[y * w + x]; pass(w); for (let x = 0; x < w; x++) g[y * w + x] = d[x]; }
    const out = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) out[i] = Math.sqrt(g[i]);
    return out;
  }
  function boxBlur(src, w, h, r) {
    const tmp = new Float32Array(w * h), out = new Float32Array(w * h), k = 1 / (2 * r + 1);
    for (let y = 0; y < h; y++) { let s = 0; const o = y * w; for (let x = -r; x <= r; x++) s += src[o + Math.min(w - 1, Math.max(0, x))]; for (let x = 0; x < w; x++) { tmp[o + x] = s * k; s += src[o + Math.min(w - 1, x + r + 1)] - src[o + Math.max(0, x - r)]; } }
    for (let x = 0; x < w; x++) { let s = 0; for (let y = -r; y <= r; y++) s += tmp[Math.min(h - 1, Math.max(0, y)) * w + x]; for (let y = 0; y < h; y++) { out[y * w + x] = s * k; s += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x]; } }
    return out;
  }
  const canvas = (w, h) => { const c = document.createElement("canvas"); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  function tracePoly(g, poly) { g.beginPath(); g.moveTo(poly[0][0], poly[0][1]); for (let i = 1; i < poly.length; i++) g.lineTo(poly[i][0], poly[i][1]); g.closePath(); }

  /* ---------- a paper layer ----------
     spec: poly, h(X,Y,d,aux,t) height in px, col(X,Y,d,aux) -> [r,g,b] or a fixed [r,g,b],
           pre(X,Y,d) -> aux (cached per pixel), bump (normal strength), ao (crevice darkening),
           amb (ambient), emit (0..1 glow, ignores shading), shadow {dx,dy,blur,a}, live (relit every frame), clip (rect) */
  function layer(spec) {
    const poly = spec.poly;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const [x, y] of poly) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    const c = spec.clip || [-160, -160, W + 160, H + 160];
    x0 = Math.floor(Math.max(x0, c[0])) - 3; y0 = Math.floor(Math.max(y0, c[1])) - 3; x1 = Math.ceil(Math.min(x1, c[2])) + 3; y1 = Math.ceil(Math.min(y1, c[3])) + 3;
    const w = x1 - x0, h = y1 - y0;
    if (!(w > 0 && h > 0)) throw new Error("bad layer bbox " + JSON.stringify(poly.slice(0, 4)) + " n=" + poly.length);
    const mc = canvas(w, h), mg = mc.getContext("2d");
    mg.translate(-x0, -y0); mg.fillStyle = "#fff"; tracePoly(mg, poly); mg.fill();
    const md = mg.getImageData(0, 0, w, h).data, A = new Uint8Array(w * h), inside = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) { A[i] = md[i * 4 + 3]; inside[i] = A[i] > 127 ? 1 : 0; }
    const D = edt(inside, w, h);
    const idx = [];
    for (let i = 0; i < w * h; i++) if (A[i]) idx.push(i);
    const I = Int32Array.from(idx), n = I.length;
    const aux = spec.pre ? new Float32Array(n) : null, CR = new Float32Array(n * 3);
    for (let k = 0; k < n; k++) {
      const i = I[k], X = x0 + (i % w) + 0.5, Y = y0 + ((i / w) | 0) + 0.5, d = D[i] + (A[i] / 255 - 0.5);
      if (aux) aux[k] = spec.pre(X, Y, d);
      const cc = typeof spec.col === "function" ? spec.col(X, Y, d, aux ? aux[k] : 0) : spec.col;
      CR[k * 3] = cc[0]; CR[k * 3 + 1] = cc[1]; CR[k * 3 + 2] = cc[2];
    }
    const lit = canvas(w, h), lg = lit.getContext("2d"), img = lg.createImageData(w, h), Hf = new Float32Array(w * h);
    const bump = spec.bump ?? 1, ao = spec.ao ?? 0.05, amb = spec.amb ?? 0.42, emit = spec.emit ?? 0, aoR = spec.aoR ?? 3;
    function relight(t) {
      Hf.fill(0);
      for (let k = 0; k < n; k++) {
        const i = I[k], X = x0 + (i % w) + 0.5, Y = y0 + ((i / w) | 0) + 0.5;
        Hf[i] = spec.h(X, Y, D[i], aux ? aux[k] : 0, t);
      }
      const Bl = ao ? boxBlur(Hf, w, h, aoR) : null, px = img.data;
      for (let k = 0; k < n; k++) {
        const i = I[k], x = i % w, y = (i / w) | 0;
        const hx = (Hf[y * w + Math.min(w - 1, x + 1)] - Hf[y * w + Math.max(0, x - 1)]) * 0.5 * bump;
        const hy = (Hf[Math.min(h - 1, y + 1) * w + x] - Hf[Math.max(0, y - 1) * w + x]) * 0.5 * bump;
        const nl = Math.hypot(hx, hy, 1), dif = Math.max(0, (-hx * L[0] - hy * L[1] + L[2]) / nl);
        let s = amb + (1 - amb) * dif / L[2];
        // half-vector specular for a slight sheen on the ridges
        const hz = (-hx * 0.0 - hy * -0.25 + 1) / nl; s += 0.06 * Math.pow(Math.max(0, hz), 24);
        if (Bl) s *= Math.min(1.08, Math.max(0.45, 1 + ao * (Hf[i] - Bl[i])));
        s = s * (1 - emit) + emit * (0.92 + 0.12 * dif / L[2]);
        px[i * 4] = Math.min(255, CR[k * 3] * s); px[i * 4 + 1] = Math.min(255, CR[k * 3 + 1] * s); px[i * 4 + 2] = Math.min(255, CR[k * 3 + 2] * s);
        px[i * 4 + 3] = A[i];
      }
      lg.putImageData(img, 0, 0);
    }
    relight(0);
    // soft drop shadow, baked once
    const sh = spec.shadow === false ? null : Object.assign({ dx: 6, dy: 10, blur: 12, a: 0.55 }, spec.shadow || {});
    let shadow = null, sx = 0, sy = 0;
    if (sh) {
      const p = Math.ceil(sh.blur * 2 + Math.max(Math.abs(sh.dx), Math.abs(sh.dy)));
      shadow = canvas(w + 2 * p, h + 2 * p); sx = x0 - p; sy = y0 - p;
      const sg = shadow.getContext("2d"), tint = canvas(w, h), tg = tint.getContext("2d");
      tg.drawImage(mc, 0, 0); tg.globalCompositeOperation = "source-in"; tg.fillStyle = `rgba(0,0,0,${sh.a})`; tg.fillRect(0, 0, w, h);
      sg.filter = `blur(${sh.blur}px)`; sg.drawImage(tint, p + sh.dx, p + sh.dy); sg.filter = "none";
    }
    const L0 = { lit, x0, y0, w, h, shadow, sx, sy, live: !!spec.live, relight, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
    // static layers: merge shadow and lit into one sprite (one draw per frame)
    if (!spec.live && shadow) {
      const m = canvas(shadow.width, shadow.height), g = m.getContext("2d");
      g.drawImage(shadow, 0, 0); g.drawImage(lit, x0 - sx, y0 - sy);
      L0.lit = m; L0.x0 = sx; L0.y0 = sy; L0.shadow = null;
    }
    return L0;
  }

  // ---------- spiral puffs (cloud lobes, rosette trees) ----------
  const puffCache = new Map();
  function puff(r, pal, opt = {}) {
    r = Math.max(4, Math.round(r));
    const key = [Math.round(r), pal.join(","), opt.sp || 0, opt.kind || "s", opt.seed || 0].join("|");
    if (puffCache.has(key)) return puffCache.get(key);
    const sp = opt.sp || Math.max(3.6, r / 9), kind = opt.kind || "s", seed = opt.seed || 0;
    const base = hex(pal[0]), deep = hex(pal[1] || pal[0]);
    const nz = noise(7 + seed);
    const L0 = layer({
      poly: kind !== "s" ? blob(0, 0, r, r, 0.08, 3 + seed, 2.5) : circle(0, 0, r),
      h: (X, Y, d) => {
        const dome = Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, 1 - d / r), 2))) * r * 0.42;
        let p;
        if (kind === "lump") return dome * 0.8 + nz.fbm(X * 0.09, Y * 0.09, 3) * (opt.depth || 7) * Math.min(1, d / 4);
        if (kind === "rose") p = cord(Math.hypot(X, Y) / sp + Math.atan2(Y, X) / 6.2832 * 2 + nz.n2(X * 0.05, Y * 0.05) * 1.4);
        else p = spiral(X, Y, 0, 0, sp);
        return dome + p * (opt.depth || 2.6) * Math.min(1, d / 2.5);
      },
      col: (X, Y, d) => mix(base, deep, Math.min(1, Math.hypot(X, Y) / r) ** 2 * 0.6),
      bump: 1, ao: 0.09, amb: 0.36,
      shadow: { dx: opt.sdx ?? r * 0.06 + 2, dy: opt.sdy ?? r * 0.1 + 3, blur: Math.max(4, r * 0.14), a: opt.sa ?? 0.55 },
    });
    puffCache.set(key, L0);
    return L0;
  }

  // ---------- drawing ----------
  // ctx: main canvas; spr: a layer or puff; tr = {x,y,rot,sc,alpha}: placement offset in world px
  function draw(ctx, spr, tr = {}) {
    const a = tr.alpha ?? 1; if (a <= 0.003) return;
    ctx.save(); ctx.globalAlpha = a;
    const ox = tr.x || 0, oy = tr.y || 0, sc = tr.sc ?? 1, rot = tr.rot || 0;
    if (tr.pivot) {
      ctx.translate(tr.pivot[0] + ox, tr.pivot[1] + oy); ctx.rotate(rot); ctx.scale(sc, tr.scy ?? sc); ctx.translate(-tr.pivot[0], -tr.pivot[1]);
      if (spr.shadow) ctx.drawImage(spr.shadow, spr.sx, spr.sy);
      ctx.drawImage(spr.lit, spr.x0, spr.y0);
    } else if (rot || sc !== 1) {
      // puffs are built around (0,0): shadow stays put, the lobe turns
      ctx.translate(ox, oy); ctx.scale(sc, sc);
      if (spr.shadow) ctx.drawImage(spr.shadow, spr.sx, spr.sy);
      ctx.rotate(rot); ctx.drawImage(spr.lit, spr.x0, spr.y0);
    } else {
      if (spr.shadow) ctx.drawImage(spr.shadow, spr.sx + ox, spr.sy + oy);
      ctx.drawImage(spr.lit, spr.x0 + ox, spr.y0 + oy);
    }
    ctx.restore();
  }

  // a cloud: overlapping lobes laid along an arc (big ones behind, small ones in front, flat-ish base),
  // with an optional tail of shrinking curls: opt.tail = [dirX, length]
  function cloud(cx, cy, w, hgt, pal, seed = 1, opt = {}) {
    const r = rng(seed), lobes = [];
    const rows = opt.rows || 3, big = opt.big || hgt * 0.42;
    for (let row = 0; row < rows; row++) {
      const k = row / Math.max(1, rows - 1);                  // 0 = back/top row, 1 = front/bottom
      const rr = big * (1 - 0.38 * k), span = w * (0.62 + 0.38 * k);
      const count = Math.max(2, Math.round(span / (rr * 0.95)) + 1);
      for (let i = 0; i < count; i++) {
        const u = i / (count - 1);
        const x = cx + (u - 0.5) * span + (r() - 0.5) * rr * 0.35;
        const arch = Math.sin(u * Math.PI) * hgt * 0.38 * (1 - k);
        const y = cy - arch + k * hgt * 0.34 + (r() - 0.5) * rr * 0.2;
        const rad = rr * (0.78 + 0.4 * r()) * (0.72 + 0.28 * Math.sin(u * Math.PI));
        lobes.push({ spr: puff(rad, pal, { sp: opt.sp, kind: opt.kind, seed: opt.seed }), x, y, ph: r() * 6.28, dir: r() < 0.5 ? -1 : 1 });
      }
    }
    if (opt.tail) {
      const [dir, len] = opt.tail, n = Math.max(3, Math.round(len / (big * 0.32)));
      let x = cx + dir * w * 0.42, y = cy + hgt * 0.3;
      for (let i = 0; i < n; i++) {
        const u = i / (n - 1), rad = big * (0.42 - 0.28 * u);
        x += dir * rad * 1.15; y += Math.sin(i * 1.3 + seed) * rad * 0.18 - rad * 0.05;
        lobes.push({ spr: puff(rad, pal, { sp: opt.sp }), x, y, ph: r() * 6.28, dir: i % 2 ? 1 : -1 });
      }
    }
    return lobes;
  }
  function drawCloud(ctx, lobes, t, o = {}) {
    for (const l of lobes) {
      const bob = Math.sin(t * (o.bobF || 0.9) + l.ph) * (o.bob ?? 3);
      const breathe = 1 + Math.sin(t * 0.7 + l.ph * 1.3) * (o.breathe ?? 0.02);
      draw(ctx, l.spr, { x: l.x + (o.dx || 0) + (o.x || 0), y: l.y + bob + (o.dy || 0) + (o.y || 0), rot: l.dir * (o.spin ?? 0.22) * Math.sin(t * 0.45 + l.ph), sc: breathe * (o.sc || 1), alpha: o.alpha });
    }
  }

  // a blurred, tinted copy of a layer, drawn additively to make it glow
  function glow(L0, color, blur = 24) {
    const p = blur * 2, c = canvas(L0.lit.width + 2 * p, L0.lit.height + 2 * p), g = c.getContext("2d");
    g.filter = `blur(${blur}px)`; g.drawImage(L0.lit, p, p); g.filter = "none";
    g.globalCompositeOperation = "source-in"; g.fillStyle = color; g.fillRect(0, 0, c.width, c.height);
    return { lit: c, x0: L0.x0 - p, y0: L0.y0 - p, shadow: null };
  }
  function additive(ctx, spr, alpha, tr = {}) { ctx.save(); ctx.globalCompositeOperation = "lighter"; draw(ctx, spr, Object.assign({}, tr, { alpha })); ctx.restore(); }
  // embers: seeded sparks rising from a source box, flickering
  function embers(ctx, t, n, box, seed, col = [255, 170, 60]) {
    const r = rng(seed);
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < n; i++) {
      const x0 = box[0] + r() * box[2], y0 = box[1] + r() * box[3], v = 40 + r() * 90, ph = r() * 20, life = 2.5 + r() * 2.5, sz = 1.5 + r() * 2.8;
      const a = ((t + ph) % life) / life, x = x0 + Math.sin((t + ph) * 1.7) * 14 + a * 30, y = y0 - a * v * life;
      const al = Math.sin(a * Math.PI) * (0.55 + 0.45 * Math.sin(t * 13 + ph * 7));
      if (al <= 0.02) continue;
      const g = ctx.createRadialGradient(x, y, 0, x, y, sz * 4);
      g.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${al})`); g.addColorStop(1, `rgba(${col[0]},${col[1] * 0.5 | 0},0,0)`);
      ctx.fillStyle = g; ctx.fillRect(x - sz * 4, y - sz * 4, sz * 8, sz * 8);
    }
    ctx.restore();
  }
  function radial(ctx, x, y, r, rgba, alpha) {
    ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = alpha;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  }

  return { glow, additive, embers, radial, W, H, rng, noise, N, N2, cord, fract, sstep, spiral, mix, hex, circle, blob, band, ribbon, layer, puff, draw, cloud, drawCloud, canvas, tracePoly };
})();
