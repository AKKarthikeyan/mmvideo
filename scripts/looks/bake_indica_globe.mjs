// One-off bake of the Indica Atlas globe mark into this repo (src/looks/brands/indicaatlas-globe.json), so the Data Kadai
// repo never imports from /Volumes/DarwinSSD/MMVideo at build or render time. The drawing is the one in
// MMVideo/src/brand/Brand.tsx (Mark): an orthographic globe rotated to [-79, -17], India in cream, the south-west monsoon arrow
// and rain over the Western Ghats and the north-east. Coastlines: Natural Earth 10m (India point of view, public domain),
// MMVideo/public/brand/world.json. Paths are projected once at 800 px and rounded to 1 px.
// usage (needs d3-geo, which only MMVideo has):
//   NODE_PATH=/Volumes/DarwinSSD/MMVideo/node_modules node scripts/looks/bake_indica_globe.mjs /Volumes/DarwinSSD/MMVideo/public/brand/world.json
import fs from "node:fs";
import {createRequire} from "node:module";
const require = createRequire(import.meta.url);
const {geoArea, geoGraticule10, geoOrthographic, geoPath} = require("d3-geo");

const fc = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
for (const f of fc.features) for (const poly of f.geometry.coordinates)
  if (geoArea({type: "Polygon", coordinates: poly}) > 2 * Math.PI) poly[0].reverse();
const S = 800, R = S * 0.39, cx = S / 2, cy = S / 2;
const proj = geoOrthographic().rotate([-79, -17]).scale(R).translate([cx, cy]).clipAngle(90);
// simplified (Douglas-Peucker, 0.7 px at 800 px; the mark is never drawn larger than 800 px), rounded to 1 px, repeated points
// dropped, rings under 3 points dropped
const rdp = (pts, eps) => {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  let idx = -1, dmax = 0;
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-9;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs((b[0] - a[0]) * (a[1] - pts[i][1]) - (a[0] - pts[i][0]) * (b[1] - a[1])) / L;
    if (d > dmax) { dmax = d; idx = i; }
  }
  return dmax > eps ? [...rdp(pts.slice(0, idx + 1), eps).slice(0, -1), ...rdp(pts.slice(idx), eps)] : [a, b];
};
const round = (d) => (d ?? "").split(/(?=M)/).map((ring) => {
  const raw = [...ring.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map((m) => [+m[1], +m[2]]);
  const pts = rdp(raw, 0.7).map((q) => [Math.round(q[0]), Math.round(q[1])]);
  const keep = pts.filter((q, i) => i === 0 || q[0] !== pts[i - 1][0] || q[1] !== pts[i - 1][1]);
  return keep.length < 3 ? "" : "M" + keep.map((q) => q.join(",")).join("L") + (ring.includes("Z") ? "Z" : "");
}).join("");
const path = geoPath(proj);
const P = (lon, lat) => proj([lon, lat]).map((v) => Math.round(v * 10) / 10);
const land = fc.features.map((f) => ({d: round(path(f)), india: f.properties.iso === "IND"})).filter((x) => x.d);
const out = {
  note: "Baked from MMVideo/src/brand/Brand.tsx (Indica Atlas mark) by scripts/looks/bake_indica_globe.mjs. Natural Earth 10m coastlines (India point of view, public domain).",
  S, R, cx, cy, graticule: round(path(geoGraticule10())), land,
  wind: [P(47, -13), P(56, -8), P(63, -0.5), P(66.6, 8.5), P(67.6, 15.2)],
  rain: [[74.4, 18.5], [75.3, 15.2], [76.3, 12.3], [77.2, 9.6], [91.5, 26.4], [93.6, 26.9]].map(([lo, la]) => P(lo, la)),
};
fs.writeFileSync("src/looks/brands/indicaatlas-globe.json", JSON.stringify(out));
console.log(`globe: ${land.length} land paths, ${(JSON.stringify(out).length / 1024).toFixed(0)} KB`);
