/* Map engine for Indica Atlas Shorts: one camera in Web Mercator over stacked image levels, drawn on a canvas.
   const M = ATLAS.create("map", [["assets/atlas/in6.jpg", [x0, y0, x1, y1]], ...]);   bounds in Mercator world units (0..1)
   M.cam(lon, lat, widthKm) sets the view; M.draw() paints the levels; M.P([lon, lat]) -> [x, y] on the 1080 x 1920 frame.
   ATLAS.keys(KEYS, t) eases between camera keys [time, lon, lat, widthKm]; in a big zoom the centre moves in step with
   the width, so a dive stays on its target. ATLAS.hav(a, b) is the great-circle distance in km; ATLAS.dest(p, bearing,
   km) the point that far away; ATLAS.circle(p, km) a ring of such points. Points are [lon, lat]. */
window.ATLAS = (function () {
  const rad = Math.PI / 180, R = 6371.0088, C = HF.clamp01, L = HF.lerp, Z = HF.ease;
  const MX = (lon) => (lon + 180) / 360, MY = (lat) => 0.5 - Math.log(Math.tan(Math.PI / 4 + lat * rad / 2)) / (2 * Math.PI);
  const hav = (a, b) => 2 * R * Math.asin(Math.sqrt(Math.sin((b[1] - a[1]) * rad / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin((b[0] - a[0]) * rad / 2) ** 2));
  function dest(p, brg, km) {
    const d = km / R, la = p[1] * rad, lo = p[0] * rad, b = brg * rad;
    const la2 = Math.asin(Math.sin(la) * Math.cos(d) + Math.cos(la) * Math.sin(d) * Math.cos(b));
    const lo2 = lo + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(la), Math.cos(d) - Math.sin(la) * Math.sin(la2));
    return [lo2 / rad, la2 / rad];
  }
  const circle = (p, km, n = 180) => Array.from({ length: n + 1 }, (_, i) => dest(p, i * 360 / n, km));
  function keys(KEYS, t) {
    let i = 0; while (i < KEYS.length - 2 && t >= KEYS[i + 1][0]) i++;
    const a = KEYS[i], b = KEYS[i + 1], u = C((t - a[0]) / (b[0] - a[0]));
    const big = Math.abs(Math.log(a[3] / b[3])) > 0.5, e = big ? Z.io3(u) : Z.io2(u);
    const w = Math.exp(L(Math.log(a[3]), Math.log(b[3]), e)), f = big ? (w - b[3]) / (a[3] - b[3]) : 1 - e;
    return [L(b[1], a[1], f), L(b[2], a[2], f), w];
  }
  function create(canvasId, layers) {
    const cv = document.getElementById(canvasId), g = cv.getContext("2d"); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
    const IMG = layers.map(([src]) => { const im = new Image(); im.src = src; return im; });
    let k = 1, cx = 0, cy = 0, wkm = 1;
    return {
      ready: Promise.all(IMG.map((im) => im.decode())),
      cam(lon, lat, widthKm) { cx = MX(lon); cy = MY(lat); wkm = widthKm; k = 1080 / (widthKm / (40075.017 * Math.cos(lat * rad))); },
      P: (ll) => [540 + (MX(ll[0]) - cx) * k, 960 + (MY(ll[1]) - cy) * k],
      pxPerKm: () => 1080 / wkm,
      draw(bg = "#07101c") {
        g.globalAlpha = 1; g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
        layers.forEach(([, b], i) => {      // only the part of each level that is on screen
          const im = IMG[i], X0 = 540 + (b[0] - cx) * k, Y0 = 960 + (b[1] - cy) * k, X1 = 540 + (b[2] - cx) * k, Y1 = 960 + (b[3] - cy) * k;
          const sx = (X1 - X0) / im.naturalWidth, o = i === 0 ? 1 : C((sx - 0.1) / 0.16);
          const vx0 = Math.max(0, X0), vy0 = Math.max(0, Y0), vx1 = Math.min(1080, X1), vy1 = Math.min(1920, Y1);
          if (o <= 0 || vx1 <= vx0 || vy1 <= vy0) return;
          g.globalAlpha = o;
          g.drawImage(im, (vx0 - X0) / sx, (vy0 - Y0) / sx, (vx1 - vx0) / sx, (vy1 - vy0) / sx, vx0, vy0, vx1 - vx0, vy1 - vy0);
        });
        g.globalAlpha = 1;
      },
    };
  }
  return { MX, MY, hav, dest, circle, keys, create };
})();
