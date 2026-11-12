/* Three paperscape scenes. Each builder bakes its layers once and returns render(ctx, t) for t in [0, SCENE_D].
   Order is back to front; z is parallax depth (0 far, 1 near). */
window.SCENES = (function () {
  const { glow, additive, embers, radial, W, H, N, N2, cord, sstep, spiral, mix, hex, circle, blob, band, ribbon, layer, puff, draw, cloud, drawCloud, rng } = PS;
  const D = 8;                     // seconds per scene
  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  const easeO = (x) => 1 - Math.pow(1 - clamp01(x), 3);
  const easeIO = (x) => { x = clamp01(x); return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
  const back = (x) => { x = clamp01(x) - 1; return 1 + 2.2 * x * x * x + 1.2 * x * x; };

  // camera: slow push-in with depth parallax; intro: each layer is laid down in order
  function stage(ctx, t, C) {
    const u = easeIO(t / D);
    return (z, order, extra = {}) => {
      const Z = 1 + C.zoom * u * (0.3 + 0.7 * z);
      const px = C.px * u * (z - 0.4), py = C.py * u * (z - 0.4);
      const fx = W * 0.5, fy = H * (C.fy || 0.55);
      ctx.setTransform(Z, 0, 0, Z, fx - fx * Z + px, fy - fy * Z + py);
      const p = clamp01((t - 0.1 - order * (C.stagger || 0.07)) / 0.75);
      return Object.assign({ alpha: easeO(p * 1.6), y: (1 - back(p)) * (C.drop || 60) * (0.4 + z) }, extra);
    };
  }
  const add = (a, b) => Object.assign({}, a, b, { x: (a.x || 0) + (b.x || 0), y: (a.y || 0) + (b.y || 0) });

  /* ---------------- 1 · Valley at dusk: coiled-cord paper quilling ---------------- */
  function valley() {
    const sky = layer({
      poly: [[-160, -160], [W + 160, -160], [W + 160, H + 160], [-160, H + 160]], shadow: false,
      h: (X, Y) => cord((Y + 16 * N.fbm(X * 0.004, Y * 0.005, 3) + 3.2 * Math.sin(X * 0.05 + Y * 0.013)) / 6.2) * 1.5,
      col: (X, Y) => mix(hex("#3a4049"), hex("#262b33"), Y / H), bump: 1.1, ao: 0.12, amb: 0.5,
    });
    // far ridges, light grey, contour cords following the ridge line
    const ridgeH = (X, Y, d) => sstep(0, 14, d) * 7 + cord((d + 9 * N.fbm(X * 0.006, Y * 0.006)) / 6.5) * 1.8;
    const ridgeL = layer({
      poly: band(-160, 700, (x) => 770 + Math.pow(clamp01((x - 120) / 520), 1.25) * 420 + 14 * Math.sin(x * 0.02)),
      h: ridgeH, col: (X, Y, d) => mix(hex("#c9c6bd"), hex("#9e9b93"), clamp01(d / 260)), bump: 1, ao: 0.1,
      shadow: { dx: 8, dy: 14, blur: 16, a: 0.5 },
    });
    const ridgeR = layer({
      poly: band(430, W + 160, (x) => 1150 - Math.pow(clamp01((x - 430) / 800), 0.8) * 360 + 18 * Math.sin(x * 0.017 + 1)),
      h: ridgeH, col: (X, Y, d) => mix(hex("#c4c1b8"), hex("#96938b"), clamp01(d / 240)), bump: 1, ao: 0.1,
      shadow: { dx: -6, dy: 14, blur: 16, a: 0.5 },
    });
    // the sun: a coiled spiral that keeps winding (relit every frame)
    const SX = 600, SY = 975, SR = 150;
    const sun = layer({
      poly: circle(SX, SY, SR, 160), live: true,
      h: (X, Y, d, a, t) => {
        const dx = X - SX, dy = Y - SY;
        return sstep(0, 10, d) * 6 + cord(Math.hypot(dx, dy) / 7.2 - (Math.atan2(dy, dx) + t * 0.9) / 6.2832) * 2.6 * Math.min(1, d / 3);
      },
      col: (X, Y) => mix(hex("#f29a34"), hex("#e07a22"), clamp01((Y - SY + SR) / (2 * SR))), bump: 1, ao: 0.1, amb: 0.5,
      shadow: { dx: 6, dy: 10, blur: 14, a: 0.55 },
    });
    // river: cords run with the banks, ripples travel downstream
    const rv = ribbon([[560, 1100, 26], [610, 1240, 70], [520, 1400, 130], [575, 1570, 180], [470, 1740, 250], [430, 1930, 330], [410, 2100, 380]], 26, 0.2, 5);
    const river = layer({
      poly: rv.poly, live: true, pre: (X, Y) => N2.fbm(X * 0.008, Y * 0.008),
      h: (X, Y, d, a, t) => cord((d + 3.2 * Math.sin(Y * 0.03 - t * 2.6 + a * 7) + a * 10) / 4.6) * 1.4,
      col: (X, Y) => mix(hex("#efe4c0"), hex("#d9c99b"), clamp01((Y - 1100) / 900) * 0.6), bump: 1, ao: 0.1, amb: 0.55,
      shadow: false,
    });
    // banks: dark navy, contour cords, clumps along the top
    // near the edge the cords follow the outline; further in they sweep diagonally, so no distance-field creases show
    const bankH = (X, Y, d) => {
      const wv = sstep(50, 130, d), wob = 26 * N.fbm(X * 0.004, Y * 0.004);
      const a = cord((d + 10 * N.fbm(X * 0.006, Y * 0.006)) / 7), b = cord((Y * 0.86 - X * 0.5 + wob) / 7);
      return sstep(0, 18, d) * 9 + (a * (1 - wv) + b * wv) * 2.3 + N2.fbm(X * 0.02, Y * 0.02) * 3;
    };
    const navy = (a, b) => (X, Y, d) => mix(hex(a), hex(b), clamp01(d / 300));
    const edgeL = (y) => { let best = null; for (const p of rv.line) if (!best || Math.abs(p[1] - y) < Math.abs(best[1] - y)) best = p; return best[0] - best[2] / 2; };
    const edgeR = (y) => { let best = null; for (const p of rv.line) if (!best || Math.abs(p[1] - y) < Math.abs(best[1] - y)) best = p; return best[0] + best[2] / 2; };
    const leftPoly = [[-160, 760], [40, 800], [200, 880], [330, 990], [440, 1110], [540, 1170]];
    for (let y = 1180; y <= 2100; y += 20) leftPoly.push([edgeL(y) + 10 * Math.sin(y * 0.03), y]);
    leftPoly.push([-160, 2100]);
    const bankL = layer({ poly: leftPoly, h: bankH, col: navy("#3c4652", "#252c35"), bump: 1, ao: 0.1, shadow: { dx: 10, dy: 16, blur: 20, a: 0.6 } });
    const rightPoly = [];
    for (let y = 2100; y >= 1210; y -= 20) rightPoly.push([edgeR(y) - 8 * Math.sin(y * 0.028), y]);
    rightPoly.push([700, 1190], [860, 1230], [1000, 1250], [W + 160, 1240], [W + 160, 2100]);
    const bankR = layer({ poly: rightPoly, h: bankH, col: navy("#3a4450", "#232a33"), bump: 1, ao: 0.1, shadow: { dx: -8, dy: 16, blur: 20, a: 0.6 } });
    const lowL = [[-160, 1420], [120, 1440], [300, 1560], [380, 1660]];
    for (let y = 1680; y <= 2100; y += 20) lowL.push([edgeL(y) - 30 + 14 * Math.sin(y * 0.04), y]);
    lowL.push([-160, 2100]);
    const bankL2 = layer({ poly: lowL, h: bankH, col: navy("#36404b", "#20262e"), bump: 1, ao: 0.1, shadow: { dx: 10, dy: 18, blur: 22, a: 0.62 } });
    const lowR = [];
    for (let y = 2100; y >= 1540; y -= 20) lowR.push([edgeR(y) + 20 - 12 * Math.sin(y * 0.05), y]);
    lowR.push([760, 1510], [900, 1560], [W + 160, 1540], [W + 160, 2100]);
    const bankR2 = layer({ poly: lowR, h: bankH, col: navy("#36404b", "#20262e"), bump: 1, ao: 0.1, shadow: { dx: -10, dy: 18, blur: 22, a: 0.62 } });
    // clumps on the left mass
    const r1 = rng(41), clumps = [];
    for (let i = 0; i < 16; i++) { const u = i / 15, x = -60 + u * 560, y = 790 + Math.pow(u, 1.3) * 380 + 40 + r1() * 40; clumps.push({ spr: puff(28 + r1() * 26, ["#3b4551", "#262d36"], { sp: 4.2 }), x, y, ph: r1() * 6, dir: 1 }); }
    // clouds
    const G = ["#a7a298", "#6f6b64"], G2 = ["#9a958b", "#64605a"];
    const cUL = cloud(130, 560, 500, 260, G, 3, { tail: [1, 300] }), cUR = cloud(950, 370, 280, 130, G2, 4, { rows: 2, tail: [-1, 260] });
    const cMR = cloud(990, 740, 220, 100, G2, 5, { rows: 2, tail: [-1, 220] }), cBig = cloud(980, 1110, 320, 240, G, 6, { rows: 4 });
    const cML = cloud(20, 1160, 200, 120, G2, 7, { rows: 2, tail: [1, 160] }), cLow = cloud(300, 1420, 260, 120, G2, 8, { rows: 2, tail: [1, 160] });
    const cLR = cloud(940, 1610, 300, 140, G, 9, { rows: 3 }), cBot = cloud(540, 1930, 1300, 300, G, 10, { rows: 3, big: 120 });

    // paper birds
    const birds = [[220, 300, 0], [300, 250, 1.3], [360, 330, 2.1]];
    function bird(ctx, x, y, s, flap) {
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      const wy = -14 * flap;
      ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 6; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 6;
      ctx.fillStyle = "#c9c5bb";
      ctx.beginPath(); ctx.moveTo(-26, wy); ctx.quadraticCurveTo(-10, -2, 0, 4); ctx.quadraticCurveTo(10, -2, 26, wy); ctx.quadraticCurveTo(10, 4, 0, 9); ctx.quadraticCurveTo(-10, 4, -26, wy); ctx.fill();
      ctx.restore();
    }

    return (ctx, t) => {
      const S = stage(ctx, t, { zoom: 0.07, px: -40, py: -30, fy: 0.5 });
      const drift = (v) => v * easeIO(t / D) + Math.sin(t * 0.3) * 4;
      draw(ctx, sky, S(0, 0));
      drawCloud(ctx, cUR, t, add(S(0.12, 1), { dx: drift(-26) }));
     
      draw(ctx, ridgeL, S(0.2, 2));
      const rise = 90 * (1 - easeO(t / (D * 0.85)));
      sun.relight(t); draw(ctx, sun, add(S(0.18, 3), { y: rise }));
      draw(ctx, ridgeR, S(0.22, 4));
      drawCloud(ctx, cMR, t, add(S(0.3, 5), { dx: drift(-30) }));
      drawCloud(ctx, cUL, t, add(S(0.32, 5), { dx: drift(34) }));
      river.relight(t); draw(ctx, river, S(0.5, 6));
      draw(ctx, bankR, S(0.52, 7));
      draw(ctx, bankL, S(0.5, 7));
      for (const c of clumps) draw(ctx, c.spr, add(S(0.5, 7), { x: c.x, y: c.y, rot: 0.15 * Math.sin(t * 0.5 + c.ph) }));
      drawCloud(ctx, cBig, t, add(S(0.55, 8), { dx: drift(-22) }));
      drawCloud(ctx, cML, t, add(S(0.55, 8), { dx: drift(26) }));
      for (const [bx, by, ph] of birds) {
        const tr = S(0.4, 9), k = t + ph;
        ctx.globalAlpha = tr.alpha; bird(ctx, bx + t * 38 + Math.sin(k) * 6, by - t * 9 + Math.sin(k * 1.7) * 8 + tr.y, 0.9, Math.sin(k * 7));
        ctx.globalAlpha = 1;
      }
      draw(ctx, bankR2, S(0.75, 10)); draw(ctx, bankL2, S(0.75, 10));
      drawCloud(ctx, cLow, t, add(S(0.7, 11), { dx: drift(30) }));
      drawCloud(ctx, cLR, t, add(S(0.8, 11), { dx: drift(-34) }));
      drawCloud(ctx, cBot, t, add(S(1, 12), { dx: drift(-40) }));
    };
  }


  // shared helpers for the volcano scenes
  const nearest = (line, y) => { let b = line[0]; for (const p of line) if (Math.abs(p[1] - y) < Math.abs(b[1] - y)) b = p; return b; };
  const fullRect = [[-160, -160], [W + 160, -160], [W + 160, H + 160], [-160, H + 160]];
  const terrace = (v, step) => { const q = v / step, f = q - Math.floor(q); return Math.floor(q) + sstep(0.78, 1, f); };
  // a cone with concave flanks: crater lip from (cx-lip) to (cx+lip) at y=cy, feet at (lx,ly) and (rx,ry)
  function cone(cx, cy, lip, lx, ly, rx, ry) {
    const p = [];
    for (let s = 0; s <= 1.0001; s += 0.02) p.push([cx - lip - s * (cx - lip - lx), cy + (ly - cy) * Math.pow(Math.max(0, s), 0.72) + 6 * Math.sin(s * 40)]);
    p.push([lx - 200, ly + 40], [lx - 200, H + 200], [rx + 200, H + 200], [rx + 200, ry + 40]);
    for (let s = 1; s >= -0.0001; s -= 0.02) p.push([cx + lip + s * (rx - cx - lip), cy + (ry - cy) * Math.pow(Math.max(0, s), 0.72) + 6 * Math.sin(s * 37)]);
    for (let i = 1; i < 8; i++) p.push([cx + lip - (i / 8) * 2 * lip, cy + 8 * Math.sin((i / 8) * Math.PI)]);  // crater dip
    return p;
  }
  function lavaStreak(ctrl, seed) {
    const rb = ribbon(ctrl, 18, 0.35, seed);
    return layer({
      poly: rb.poly, live: true, pre: (X, Y) => N.fbm(X * 0.04, Y * 0.04),
      h: (X, Y, d, a, t) => sstep(0, 4, d) * 3 + cord(Y * 0.05 - t * 1.6 + a * 2.5) * 2,
      col: (X, Y, d) => mix(hex("#ffb23c"), hex("#f0561a"), clamp01(1 - d / 7)), bump: 1, ao: 0.08, emit: 0.55,
      shadow: { dx: 3, dy: 5, blur: 5, a: 0.5 },
    });
  }
  function lavaRiver(ctrl, seed) {
    const rb = ribbon(ctrl, 26, 0.25, seed);
    const L0 = layer({
      poly: rb.poly, live: true, pre: (X, Y) => N2.fbm(X * 0.006, Y * 0.006),
      h: (X, Y, d, a, t) => sstep(0, 10, d) * 4 + cord((d + 5 * Math.sin(Y * 0.022 - t * 2.4 + a * 8) + a * 14) / 6) * 2.4 + N.fbm(X * 0.03, Y * 0.03 - t * 0.12) * 3,
      col: (X, Y, d) => mix(hex("#ffae35"), hex("#e2471a"), clamp01(1 - d / 60) * 0.8), bump: 1, ao: 0.1, emit: 0.5, shadow: false,
    });
    L0.line = rb.line; L0.glow = glow(L0, "rgba(255,110,30,1)", 26);
    return L0;
  }
  // banks either side of a river line: side -1 = left, +1 = right; top = list of points leading in from the far edge
  function bank(line, side, yFrom, top, seed, inset = 0) {
    const p = top.slice();
    const ys = []; for (let y = yFrom; y <= H + 180; y += 18) ys.push(y);
    const edge = ys.map((y) => { const b = nearest(line, y); return [b[0] + side * (b[2] / 2 + inset) + 10 * Math.sin(y * 0.035 + seed), y]; });
    if (side < 0) { p.push(...edge, [-160, H + 200]); }
    else { p.push([W + 160, H + 200], ...edge.reverse()); }
    return p;
  }
  function sway(t, ph, amt = 0.012) { return amt * Math.sin(t * 1.15 + ph) + amt * 0.4 * Math.sin(t * 2.3 + ph * 2); }

  /* ---------------- 2 · Ember volcano: rough plaster, rosette trees, lava river ---------------- */
  function ember() {
    const sky = layer({
      poly: fullRect, shadow: false,
      h: (X, Y) => N.fbm(X * 0.006, Y * 0.006, 5) * 22 + N2.fbm(X * 0.035, Y * 0.035, 3) * 4,
      col: (X, Y) => mix(hex("#34353a"), hex("#25262a"), Y / H), bump: 0.7, ao: 0.08, amb: 0.5,
    });
    const SX = 420, SY = 600, SR = 360;
    const sun = layer({
      poly: circle(SX, SY, SR, 240),
      h: (X, Y, d) => sstep(0, 18, d) * 10 + (1 - Math.abs(2 * N.fbm(X * 0.007, Y * 0.007, 4) - 1)) * 12 + N2.fbm(X * 0.04, Y * 0.04) * 3,
      col: (X, Y) => mix(hex("#f8a43a"), hex("#e8521c"), clamp01((Y - SY + SR) / (2 * SR)) ** 1.3), bump: 0.9, ao: 0.1, amb: 0.5,
      shadow: { dx: 8, dy: 14, blur: 22, a: 0.6 },
    });
    const sunGlow = glow(sun, "rgba(255,120,40,1)", 60);
    const dark = ["#64656a", "#3c3d41"], cream = ["#e6decb", "#b9ae98"];
    const cTL = cloud(60, 330, 360, 170, dark, 31, { kind: "rose", sp: 5, rows: 2, tail: [1, 220] });
    const cTL2 = cloud(-20, 560, 300, 140, dark, 32, { kind: "rose", sp: 5, rows: 2, tail: [1, 160] });
    const cTR = cloud(950, 340, 300, 170, cream, 33, { kind: "rose", sp: 4.4, rows: 3 });
    const CX = 880, CY = 540;
    const volc = layer({
      poly: cone(CX, CY, 62, 160, 1190, W + 200, 930),
      h: (X, Y, d) => sstep(0, 14, d) * 8 + cord(Math.atan2(X - CX, Y - CY + 60) * 58 + 2.4 * N.fbm(X * 0.01, Y * 0.01)) * 2.4 + N2.fbm(X * 0.03, Y * 0.03) * 2.5,
      col: (X, Y) => mix(hex("#a9a8a3"), hex("#6c6b68"), clamp01((X - 600) / 600)), bump: 1, ao: 0.1, shadow: { dx: 10, dy: 16, blur: 22, a: 0.6 },
    });
    const streaks = [
      [[858, 548, 30], [832, 620, 26], [800, 720, 20], [772, 830, 13], [748, 940, 5]],
      [[898, 548, 26], [910, 640, 22], [932, 740, 15], [968, 840, 5]],
      [[878, 548, 22], [874, 650, 16], [884, 770, 5]],
      [[922, 552, 20], [968, 620, 15], [1020, 700, 5]],
    ].map((c, i) => lavaStreak(c, 50 + i));
    const cML = cloud(90, 930, 460, 150, cream, 34, { kind: "rose", sp: 4.4, rows: 3 });
    const cMR = cloud(1010, 960, 300, 130, cream, 35, { kind: "rose", sp: 4.4, rows: 2, tail: [-1, 140] });
    const smoke = puff(70, cream, { kind: "rose", sp: 4.4, seed: 2 });
    const hill = (yfn, a, b, seed, dx = 8) => layer({
      poly: band(-160, W + 160, yfn), h: (X, Y, d) => sstep(0, 14, d) * 8 + N.fbm(X * 0.008, Y * 0.012, 4) * 14 + cord((Y * 0.9 + X * 0.3 + 20 * N2.fbm(X * 0.004, Y * 0.004)) / 9) * 1.2,
      col: (X, Y, d) => mix(hex(a), hex(b), clamp01(d / 280)), bump: 0.8, ao: 0.08, shadow: { dx, dy: 14, blur: 20, a: 0.6 },
    });
    const h1 = hill((x) => 1130 - 150 * Math.exp(-(((x - 330) / 260) ** 2)) + 20 * Math.sin(x * 0.012), "#8b9097", "#5f646a", 1);
    const h2 = hill((x) => 1230 - 90 * Math.exp(-(((x - 160) / 240) ** 2)) - 70 * Math.exp(-(((x - 900) / 300) ** 2)) + 14 * Math.sin(x * 0.02), "#62666c", "#44474c", 2);
    const h3 = hill((x) => 1330 - 60 * Math.sin(x * 0.006 + 1) + 10 * Math.sin(x * 0.03), "#4a4d52", "#323438", 3);
    // conifers
    const pine = (cx, base, hgt, wd, seed) => {
      const r = rng(seed), p = [[cx, base - hgt]];
      const tiers = 9;
      for (let i = 1; i <= tiers; i++) { const u = i / tiers, y = base - hgt + u * hgt; p.push([cx + wd * u * (1 + 0.25 * r()), y], [cx + wd * u * 0.55, y + 4]); }
      p.push([cx + 5, base + 30], [cx - 5, base + 30]);
      for (let i = tiers; i >= 1; i--) { const u = i / tiers, y = base - hgt + u * hgt; p.push([cx - wd * u * 0.55, y + 4], [cx - wd * u * (1 + 0.25 * r()), y]); }
      return { L: layer({ poly: p, h: (X, Y, d) => sstep(0, 5, d) * 4 + cord((Y - base) / 5.5 + Math.abs(X - cx) * 0.18) * 2.2, col: (X, Y) => mix(hex("#5a3224"), hex("#3a1f17"), clamp01((Y - base + hgt) / hgt)), bump: 1, ao: 0.1, shadow: { dx: 5, dy: 8, blur: 8, a: 0.55 } }), px: cx, py: base, ph: r() * 6 };
    };
    const r2 = rng(77), pines = [];
    for (let i = 0; i < 7; i++) pines.push(pine(40 + i * 62 + r2() * 20, 1440 + r2() * 50, 190 + r2() * 90, 34 + r2() * 10, 100 + i));
    for (let i = 0; i < 4; i++) pines.push(pine(830 + i * 70 + r2() * 20, 1430 + r2() * 40, 180 + r2() * 80, 32 + r2() * 10, 120 + i));
    pines.sort((a, b) => a.py - b.py);
    const river = lavaRiver([[655, 1335, 3], [640, 1370, 22], [600, 1430, 60], [700, 1530, 110], [560, 1650, 170], [380, 1770, 260], [300, 1910, 420], [220, 2100, 700]], 61);
    const gH = (X, Y, d) => sstep(0, 16, d) * 9 + cord((Y * 0.7 - X * 0.6 + 30 * N.fbm(X * 0.004, Y * 0.004)) / 8) * 1.6 + N2.fbm(X * 0.01, Y * 0.012, 4) * 10;
    const gL = layer({ poly: bank(river.line, -1, 1400, [[-160, 1440], [200, 1460], [420, 1400], [560, 1380]], 1, -2), h: gH, col: (X, Y, d) => mix(hex("#45474b"), hex("#2a2b2e"), clamp01(d / 240)), bump: 0.9, ao: 0.08, shadow: { dx: 10, dy: 14, blur: 18, a: 0.6 } });
    const gR = layer({ poly: bank(river.line, 1, 1400, [[W + 160, 1400], [900, 1420], [760, 1380]].reverse(), 2, -2), h: gH, col: (X, Y, d) => mix(hex("#45474b"), hex("#2a2b2e"), clamp01(d / 240)), bump: 0.9, ao: 0.08, shadow: { dx: -10, dy: 14, blur: 18, a: 0.6 } });
    // rosette trees
    const orange = ["#ec5d22", "#a8330f"];
    const trunk = (x0, y0, x1, y1, w, seed) => layer({ poly: ribbon([[x0, y0, w], [(x0 + x1) / 2 + 8, (y0 + y1) / 2, w * 0.75], [x1, y1, w * 0.5]], 12, 0.2, seed).poly, h: (X, Y, d) => sstep(0, 5, d) * 4 + cord(X * 0.2 + N.fbm(X * 0.05, Y * 0.01) * 3) * 1.6, col: hex("#5b3324"), bump: 1, ao: 0.1, shadow: { dx: 5, dy: 8, blur: 8, a: 0.5 } });
    const trees = [
      { tr: trunk(70, 1900, 90, 1520, 34, 1), cl: cloud(80, 1440, 300, 230, orange, 41, { kind: "rose", sp: 3.8, rows: 3 }), px: 90, py: 1520 },
      { tr: trunk(780, 1650, 790, 1480, 20, 2), cl: cloud(790, 1430, 170, 130, orange, 42, { kind: "rose", sp: 3.6, rows: 2 }), px: 790, py: 1480 },
      { tr: trunk(900, 1700, 905, 1520, 22, 3), cl: cloud(905, 1460, 190, 140, orange, 43, { kind: "rose", sp: 3.6, rows: 2 }), px: 905, py: 1520 },
      { tr: trunk(1020, 1960, 1010, 1650, 30, 4), cl: cloud(1020, 1580, 300, 240, orange, 44, { kind: "rose", sp: 3.8, rows: 3 }), px: 1010, py: 1650 },
    ];
    const fg = layer({ poly: band(-160, W + 160, (x) => 1880 + 60 * Math.sin(x * 0.01) + 40 * Math.exp(-(((x - 500) / 200) ** 2)), H + 200), h: gH, col: (X, Y, d) => mix(hex("#3e4044"), hex("#242528"), clamp01(d / 120)), bump: 0.9, ao: 0.08, shadow: { dx: 0, dy: -10, blur: 18, a: 0.5 } });

    return (ctx, t) => {
      const S = stage(ctx, t, { zoom: 0.07, px: 30, py: -40, fy: 0.45 });
      const drift = (v) => v * easeIO(t / D) + Math.sin(t * 0.3) * 4;
      draw(ctx, sky, S(0, 0));
      const sink = 50 * easeIO(t / D), pulse = 0.5 + 0.5 * Math.sin(t * 1.4);
      additive(ctx, sunGlow, 0.25 + 0.12 * pulse, add(S(0.1, 1), { y: sink }));
      draw(ctx, sun, add(S(0.1, 1), { y: sink }));
      drawCloud(ctx, cTL2, t, add(S(0.18, 2), { dx: drift(30) }));
      drawCloud(ctx, cTL, t, add(S(0.2, 2), { dx: drift(40) }));
      // smoke column: puffs born in the crater keep rising and swelling
      const crater = S(0.3, 3);
      for (let i = 0; i < 16; i++) {
        const age = ((t + i * 0.5) % 8), a = sstep(0, 0.6, age) * (1 - sstep(5.5, 8, age));
        draw(ctx, smoke, { x: CX + age * 22 + Math.sin(age * 1.3 + i) * 14, y: CY - 20 - age * 52 + crater.y, sc: 0.35 + age * 0.17, rot: Math.sin(age * 0.7 + i) * 0.3, alpha: a * crater.alpha });
      }
      drawCloud(ctx, cTR, t, add(S(0.3, 3), { dx: drift(-26) }));
      draw(ctx, volc, S(0.32, 4));
      for (const L0 of streaks) { L0.relight(t); draw(ctx, L0, S(0.32, 4)); }
      radial(ctx, CX, CY + 10, 150, "rgba(255,150,50,0.9)", (0.35 + 0.25 * pulse) * S(0.32, 4).alpha);
      draw(ctx, h1, S(0.4, 5));
      drawCloud(ctx, cMR, t, add(S(0.42, 5), { dx: drift(-30) }));
      drawCloud(ctx, cML, t, add(S(0.44, 5), { dx: drift(34) }));
      draw(ctx, h2, S(0.5, 6));
      draw(ctx, h3, S(0.58, 7));
      for (const p of pines) draw(ctx, p.L, add(S(0.62, 8), { pivot: [p.px, p.py], rot: sway(t, p.ph, 0.02) }));
      river.relight(t);
      const rv = S(0.7, 9);
      additive(ctx, river.glow, (0.35 + 0.15 * pulse) * rv.alpha, rv);
      draw(ctx, river, rv);
      draw(ctx, gL, S(0.72, 10)); draw(ctx, gR, S(0.72, 10));
      for (const [i, tr] of trees.entries()) {
        const z = i === 0 || i === 3 ? 0.95 : 0.78, st = S(z, 11 + (i % 2));
        draw(ctx, tr.tr, st);
        const sw = sway(t, i * 1.7, 0.03);
        drawCloud(ctx, tr.cl, t, add(st, { dx: sw * 160, dy: Math.abs(sw) * 20, spin: 0.1, bob: 1.5 }));
      }
      embers(ctx, t, 36, [200, 1450, 600, 450], 5);
      embers(ctx, t, 14, [820, 520, 120, 40], 6);
      draw(ctx, fg, S(1, 13));
    };
  }

  /* ---------------- 3 · Moon over the jungle: terraced paper, smoke plume ---------------- */
  function jungle() {
    const sky = layer({
      poly: fullRect, shadow: false,
      h: (X, Y) => N.fbm(X * 0.012, Y * 0.012, 5) * 12 + N2.fbm(X * 0.06, Y * 0.06, 2) * 3,
      col: (X, Y) => mix(hex("#66534a"), hex("#4a3c35"), Y / 1200), bump: 0.8, ao: 0.1, amb: 0.5,
    });
    const MX = 470, MY = 480, MR = 270;
    const moonPatch = (X, Y) => sstep(0.5, 0.535, N.fbm(X * 0.0055 + 3, Y * 0.0055 + 1, 4));
    const moon = layer({
      poly: circle(MX, MY, MR, 200),
      h: (X, Y, d) => sstep(0, 14, d) * 8 + moonPatch(X, Y) * 5 + N2.fbm(X * 0.035, Y * 0.035) * 3.5,
      col: (X, Y) => mix(hex("#f7b544"), hex("#e7922c"), moonPatch(X, Y) * 0.8), bump: 1, ao: 0.1, amb: 0.5, shadow: { dx: 8, dy: 12, blur: 18, a: 0.55 },
    });
    const moonGlow = glow(moon, "rgba(255,170,60,1)", 50);
    const terr = (stepPx, amp) => (X, Y, d) => sstep(0, 10, d) * 5 + terrace(d + 22 * N.fbm(X * 0.006, Y * 0.006) + 50 * N2.fbm(X * 0.0025 + 4, Y * 0.0025), stepPx) * amp + N2.fbm(X * 0.04, Y * 0.04) * 2;
    const frame = layer({
      poly: band(-160, W + 160, (x) => 150 + 50 * Math.sin(x * 0.009 + 1) + 40 * N.fbm(x * 0.01, 3), -160),
      h: terr(18, 3), col: (X, Y, d) => mix(hex("#6e7075"), hex("#3e4045"), clamp01(d / 220)), bump: 1, ao: 0.1, shadow: { dx: 8, dy: 14, blur: 18, a: 0.6 },
    });
    const side = layer({ poly: blob(-70, 560, 190, 560, 0.22, 97, 3), h: terr(18, 3), col: (X, Y, d) => mix(hex("#686a70"), hex("#3a3c41"), clamp01(d / 160)), bump: 1, ao: 0.1, shadow: { dx: 10, dy: 14, blur: 18, a: 0.6 } });
    const CX = 600, CY = 790;
    const volc = layer({
      poly: cone(CX, CY, 46, 120, 1200, W + 160, 1080),
      h: (X, Y, d) => sstep(0, 14, d) * 8 + cord(Math.atan2(X - CX, Y - CY + 50) * 64 + 2 * N.fbm(X * 0.01, Y * 0.01)) * 2.4 + N2.fbm(X * 0.03, Y * 0.03) * 2,
      col: (X, Y) => mix(hex("#666970"), hex("#43464c"), clamp01((X - 400) / 600)), bump: 1, ao: 0.1, shadow: { dx: 10, dy: 16, blur: 22, a: 0.6 },
    });
    const streaks = [
      [[588, 796, 22], [570, 860, 18], [548, 950, 12], [530, 1030, 4]],
      [[612, 796, 20], [628, 870, 16], [652, 950, 10], [690, 1030, 4]],
      [[600, 796, 16], [604, 880, 10], [610, 960, 4]],
    ].map((c, i) => lavaStreak(c, 70 + i));
    const plumeL = (cx, cy, rx, ry, a, b, seed) => layer({ poly: blob(cx, cy, rx, ry, 0.16, seed, 3), h: terr(14, 2.6), col: (X, Y, d) => mix(hex(a), hex(b), clamp01(1 - d / 120) * 0.5), bump: 1, ao: 0.1, shadow: { dx: 8, dy: 12, blur: 16, a: 0.55 } });
    const plume = [
      plumeL(900, 600, 300, 250, "#8f8b85", "#6c6863", 81),
      plumeL(980, 480, 250, 210, "#bdb6a8", "#9a9385", 82),
      plumeL(820, 700, 200, 150, "#d8cfbc", "#b4aa95", 83),
      plumeL(1000, 760, 220, 130, "#e3dac7", "#bcb19c", 84),
      plumeL(680, 760, 110, 80, "#cfc6b3", "#a89e8a", 85),
      plumeL(900, 860, 200, 70, "#ece4d2", "#c4b9a3", 86),
    ];
    const cream = ["#e8dfcc", "#bfb49e"];
    const smoke = puff(56, cream, { kind: "rose", sp: 4.2, seed: 5 });
    const bandC = [plumeL(220, 1060, 330, 70, "#d9d0bd", "#aea38e", 87), plumeL(760, 1100, 420, 80, "#e2d9c6", "#b6ab96", 88), plumeL(60, 1160, 200, 60, "#cfc6b2", "#a59a85", 89)];
    const canopy = (cx, cy, rx, ry, seed) => layer({ poly: blob(cx, cy, rx, ry, 0.14, seed, 5), h: (X, Y, d) => sstep(0, 10, d) * 6 + N.fbm(X * 0.045, Y * 0.07, 4) * 12 + N2.fbm(X * 0.16, Y * 0.16) * 3, col: (X, Y, d) => mix(hex("#4a4c52"), hex("#2c2e32"), clamp01((Y - cy + ry) / (2 * ry))), bump: 0.9, ao: 0.12, shadow: { dx: 8, dy: 12, blur: 14, a: 0.6 } });
    const limb = (pts, seed) => layer({ poly: ribbon(pts, 14, 0.15, seed).poly, h: (X, Y, d) => sstep(0, 5, d) * 4 + cord(X * 0.16 + Y * 0.03 + N.fbm(X * 0.04, Y * 0.01) * 3) * 1.4, col: hex("#3b3d42"), bump: 1, ao: 0.1, shadow: { dx: 5, dy: 8, blur: 8, a: 0.5 } });
    const trees = [
      { limbs: [limb([[300, 1500, 46], [290, 1200, 32], [250, 960, 18], [200, 870, 8]], 1), limb([[285, 1180, 22], [380, 1000, 14], [440, 880, 6]], 2), limb([[260, 1060, 16], [120, 960, 10], [60, 900, 5]], 3)],
        can: [canopy(250, 860, 290, 70, 91), canopy(80, 940, 160, 55, 92), canopy(450, 900, 150, 50, 93)], px: 290, py: 1300, ph: 0, z: 0.7 },
      { limbs: [limb([[900, 1560, 34], [890, 1330, 22], [860, 1220, 8]], 4), limb([[890, 1330, 14], [980, 1240, 6]], 5)], can: [canopy(900, 1200, 220, 55, 94), canopy(1040, 1250, 120, 40, 95)], px: 890, py: 1400, ph: 2, z: 0.66 },
      { limbs: [limb([[560, 1420, 18], [555, 1300, 10], [540, 1260, 4]], 6)], can: [canopy(550, 1260, 120, 36, 96)], px: 555, py: 1350, ph: 4, z: 0.6 },
    ];
    const stripP = [];
    for (let x = -160; x <= W + 160; x += 8) stripP.push([x, 1195 + 30 * Math.sin(x * 0.011) + 40 * N.fbm(x * 0.02, 9)]);
    for (let x = W + 160; x >= -160; x -= 8) stripP.push([x, 1500 + 25 * Math.sin(x * 0.02)]);
    const strip = layer({ poly: stripP, h: (X, Y, d) => sstep(0, 10, d) * 6 + N.fbm(X * 0.04, Y * 0.05, 4) * 12 + N2.fbm(X * 0.14, Y * 0.14) * 3, col: (X, Y, d) => mix(hex("#4b4d53"), hex("#303236"), clamp01(d / 120)), bump: 0.9, ao: 0.12, shadow: { dx: 8, dy: -6, blur: 16, a: 0.55 } });
    const r3 = rng(64), small = [];
    for (let i = 0; i < 6; i++) { const x = 80 + i * 175 + r3() * 60, y = 1180 + r3() * 40, w = 50 + r3() * 40; small.push({ limb: limb([[x, y + 70, 9], [x + 2, y + 30, 6], [x - 4, y + 4, 3]], 200 + i), can: canopy(x, y, w, 16 + r3() * 8, 300 + i), px: x, py: y + 40, ph: r3() * 6 }); }
    const river = lavaRiver([[628, 1430, 3], [650, 1465, 24], [700, 1530, 70], [600, 1630, 140], [420, 1750, 230], [260, 1890, 380], [150, 2100, 600]], 62);
    const gH = (X, Y, d) => sstep(0, 12, d) * 7 + N.fbm(X * 0.03, Y * 0.04, 4) * 12 + N2.fbm(X * 0.12, Y * 0.12) * 3;
    const gC = (X, Y, d) => mix(hex("#3d3f44"), hex("#232427"), clamp01(d / 200));
    const gL = layer({ poly: bank(river.line, -1, 1460, [[-160, 1400], [200, 1440], [480, 1420], [600, 1440]], 3, -4), h: gH, col: gC, bump: 0.9, ao: 0.12, shadow: { dx: 10, dy: 14, blur: 18, a: 0.6 } });
    const gR = layer({ poly: bank(river.line, 1, 1460, [[W + 160, 1380], [900, 1420], [700, 1440]].reverse(), 4, -4), h: gH, col: gC, bump: 0.9, ao: 0.12, shadow: { dx: -10, dy: 14, blur: 18, a: 0.6 } });
    const bush = ["#3e4046", "#24262a"], bushes = [cloud(80, 1800, 380, 220, bush, 51, { kind: "lump", rows: 3 }), cloud(1000, 1760, 340, 220, bush, 52, { kind: "lump", rows: 3 }), cloud(560, 2000, 600, 160, bush, 53, { kind: "lump", rows: 2 })];

    return (ctx, t) => {
      const S = stage(ctx, t, { zoom: 0.08, px: -30, py: -50, fy: 0.42 });
      const drift = (v) => v * easeIO(t / D);
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.3);
      draw(ctx, sky, S(0, 0));
      const m = S(0.08, 1), rise = -40 * easeIO(t / D);
      additive(ctx, moonGlow, 0.22 + 0.1 * pulse, add(m, { y: rise }));
      draw(ctx, moon, add(m, { y: rise }));
      draw(ctx, frame, add(S(0.15, 2), { y: Math.sin(t * 0.5) * 6 }));
      draw(ctx, side, add(S(0.16, 2), { x: Math.sin(t * 0.45 + 1) * 6 }));
      const cr = S(0.3, 3);
      for (let i = 0; i < 14; i++) {
        const age = ((t + i * 0.55) % 7.7), a = sstep(0, 0.6, age) * (1 - sstep(5, 7.7, age));
        draw(ctx, smoke, { x: CX + age * 40 + Math.sin(age + i) * 16, y: CY - 30 - age * 48 + cr.y, sc: 0.3 + age * 0.22, rot: Math.sin(age * 0.6 + i) * 0.3, alpha: a * cr.alpha });
      }
      plume.forEach((P, i) => {
        const b = 1 + 0.025 * Math.sin(t * 0.8 + i * 1.1) + 0.04 * easeIO(t / D);
        draw(ctx, P, add(S(0.28 + i * 0.01, 3 + i * 0.3), { pivot: [CX, CY], sc: b, rot: 0.01 * Math.sin(t * 0.6 + i), x: drift(10 + i * 4), y: -drift(16 + i * 3) }));
      });
      draw(ctx, volc, S(0.35, 5));
      for (const L0 of streaks) { L0.relight(t); draw(ctx, L0, S(0.35, 5)); }
      radial(ctx, CX, CY + 10, 110, "rgba(255,150,50,0.9)", (0.35 + 0.25 * pulse) * S(0.35, 5).alpha);
      bandC.forEach((B, i) => draw(ctx, B, add(S(0.45, 6), { x: drift(i % 2 ? -24 : 24) })));
      draw(ctx, strip, S(0.55, 7.5));
      for (const sm of small) { const st = S(0.56, 7.5); draw(ctx, sm.limb, st); draw(ctx, sm.can, add(st, { pivot: [sm.px, sm.py], rot: sway(t, sm.ph, 0.02) })); }
      for (const tr of trees) {
        const st = S(tr.z, 7 + tr.z * 3);
        for (const L0 of tr.limbs) draw(ctx, L0, st);
        for (const c of tr.can) draw(ctx, c, add(st, { pivot: [tr.px, tr.py], rot: sway(t, tr.ph, 0.012) }));
      }
      river.relight(t);
      const rv = S(0.75, 10);
      additive(ctx, river.glow, (0.35 + 0.15 * pulse) * rv.alpha, rv);
      draw(ctx, river, rv);
      draw(ctx, gL, S(0.8, 11)); draw(ctx, gR, S(0.8, 11));
      embers(ctx, t, 30, [150, 1500, 600, 400], 9);
      bushes.forEach((b, i) => drawCloud(ctx, b, t, add(S(1, 12), { dx: Math.sin(t * 0.9 + i) * 5, spin: 0.05, bob: 2 })));
    };
  }

  return { D, list: [valley, ember, jungle] };
})();
