// Indian trees and plants as silhouettes for Rimmed (22 Oct 2026). Each generator returns path items (Item[]) standing
// on the ground at (x, y), `h` tall, so a scene draws a tree with <Rimmed paths={peepal({x, y, h, seed, wind, t: f})}
// light={...}/>. Every subpath is wound clockwise, so the hundreds of leaves and limbs joined into one item union cleanly.
// Deterministic: the same arguments always draw the same tree; `t` (the frame) and `wind` (-1..1, + blows to the right)
// give a gentle sway.
//
// How a broadleaf crown is built (peepal, banyan, neem, khejri): leaf clumps are scattered through the species' crown
// envelope on a jittered hex grid, a few are dropped to open holes of sky, and a branch skeleton grows from the fork to
// every clump (limbs split by direction, widths by the pipe model, so the branches thin as they divide and show through
// the holes). Each clump is a dense heart plus the species' own leaves round its edge, large enough to read at small size.
// The clumps behind the tree's middle are a lighter tint (SIL_BACK) for depth; leaf items carry rw (a finer rim).
//
//   peepal    Ficus religiosa: fluted, buttressed trunk, broad open dome, heart leaves with long drip tips on long stalks
//   banyan    Ficus benghalensis: crown far wider than tall on level limbs, pillar roots and curtains of aerial roots
//   neem      Azadirachta indica: short straight trunk, dense rounded crown of drooping pinnate leaves
//   palmyra   Borassus flabellifer: tall straight trunk, a globe of stiff fan leaves on long stalks, dead fans hanging
//   coconut   Cocos nucifera: slender curving trunk, arching fronds with leaflets hanging in a V, a cluster of nuts
//   khejri    Prosopis cineraria: crooked low trunk, open irregular crown of fine feathery leaves, hanging pods (sangri)
//   deodar    Cedrus deodara: a broad cone of level tiers, the sprays drooping at their tips, the leader nodding
//   reeds     kans grass (Saccharum spontaneum): arching blades and silky plumes
//   rice      a hill of ripe rice: upright blades and panicles bowing over; paddy: rows of hills
//   lotusLeaf, lotusBud, lotusFlower: Nelumbo, raised on stalks above the water (y = the water line)
import type {Item} from "./sil";
import {rnd, smooth, band, polyD, fmt, clamp01, crPoints, Pt} from "./geom";

export type TreeP = {
  x: number; y: number;    // the foot of the trunk on the ground
  h: number;               // height in px (the banyan's crown is about 2.2 h wide)
  seed?: number;
  wind?: number;           // -1..1, a steady lean downwind (+ = to the right)
  t?: number;              // the frame, for the sway
  detail?: number;         // 0.5..1.5: fewer or more leaves (default 1)
  fill?: string;           // the main silhouette colour (default: Rimmed's fill, K.sil)
  back?: string;           // the colour of the clumps behind (default SIL_BACK, a lighter tint of K.sil)
};
export const SIL_BACK = "#1E1127", SIL_FAR = "#2C1A36";
const TAU = Math.PI * 2;
type V = number[];
const ad = (to: number, a: number) => Math.atan2(Math.sin(to - a), Math.cos(to - a));
const f1 = (v: number) => v.toFixed(1);
const quadPts = (a: V, c: V, b: V, n: number): number[][] => Array.from({length: n + 1}, (_, i) => {
  const u = i / n, v = 1 - u;
  return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]];
});
// leaves and fine parts get a finer rim than the wood (see Rimmed's rw)
const LEAF_RW = 0.55;

// ---------- leaf primitives (all clockwise) ----------
// A cubic template [p0, c1, c2, p1, c1, c2, p2, ...] in leaf units (petiole at the origin, the tip at (1, 0)), placed.
const tmpl = (T: number[][], x: number, y: number, a: number, L: number, wk = 1): string => {
  const c = Math.cos(a), s = Math.sin(a), P = T.map(([u, v]) => [x + (u * c - v * wk * s) * L, y + (u * s + v * wk * c) * L]);
  let d = `M ${fmt(P[0])}`;
  for (let i = 1; i + 2 < P.length; i += 3) d += ` C ${fmt(P[i])} ${fmt(P[i + 1])} ${fmt(P[i + 2])}`;
  return d + " Z";
};
// peepal: a broad heart whose shoulders run into a long drip tip (about a third of the leaf); clockwise on screen
const T_PEEPAL = [[0.02, 0], [-0.05, -0.16], [0.06, -0.36], [0.26, -0.35], [0.44, -0.34], [0.58, -0.16], [0.68, -0.07], [0.78, -0.022], [0.9, -0.006], [1, 0],
  [0.9, 0.006], [0.78, 0.022], [0.68, 0.07], [0.58, 0.16], [0.44, 0.34], [0.26, 0.35], [0.06, 0.36], [-0.05, 0.16], [0.02, 0]];
// banyan: a thick elliptic leaf, blunt at the tip
const T_OVAL = [[0, 0], [0.04, -0.2], [0.22, -0.32], [0.46, -0.32], [0.72, -0.32], [0.97, -0.18], [1, 0], [0.97, 0.18], [0.72, 0.32], [0.46, 0.32], [0.22, 0.32], [0.04, 0.2], [0, 0]];
// a slim curved leaf or leaflet from p0 to p1, bowed by `bow` (fraction of length): two quadratics, clockwise
const blade = (x0: number, y0: number, x1: number, y1: number, wd: number, bow = 0): string => {
  const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, mx = (x0 + x1) / 2 + nx * bow * l, my = (y0 + y1) / 2 + ny * bow * l;
  return `M ${f1(x0)} ${f1(y0)} Q ${f1(mx - nx * wd)} ${f1(my - ny * wd)} ${f1(x1)} ${f1(y1)} Q ${f1(mx + nx * wd)} ${f1(my + ny * wd)} ${f1(x0)} ${f1(y0)} Z`;
};
const bladeA = (x: number, y: number, a: number, L: number, wd: number, bow = 0) => blade(x, y, x + Math.cos(a) * L, y + Math.sin(a) * L, wd, bow);
// an irregular round blob (the dense heart of a clump), clockwise
const blob = (cx: number, cy: number, rx: number, ry: number, seed: number, n = 9, j = 0.3): string =>
  smooth(Array.from({length: n}, (_, i) => { const a = (i / n) * TAU, r = 1 - j / 2 + j * rnd(i, seed); return [cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r] as Pt; }), {wind: "cw"});

// A mass of fine foliage: an irregular body ringed by many small sickle leaflets that point outward and bend down by
// `droop`, at uneven angles and lengths, so the edge reads as fine leaves and not as a toothed ball. Fine-leaved crowns
// (neem, khejri) are built of these, so they read as one feathery mass. Returns the body and the leaflets.
const fringe = (cx: number, cy: number, r: number, n: number, tip: number, droop: number, seed: number, out: string[]) => {
  out.push(blob(cx, cy, r * 0.86, r * 0.76, seed, 11, 0.32));
  for (let k = 0; k < n; k++) {
    const a = (k / n) * TAU + (rnd(k, seed + 3) - 0.5) * 0.5, rb = r * (0.6 + 0.25 * rnd(k, seed + 1));
    const px = cx + Math.cos(a) * rb, py = cy + Math.sin(a) * rb * 0.86;
    const la = a + ad(Math.PI / 2, a) * droop * (0.5 + 0.5 * rnd(k, seed + 4)) + (rnd(k, seed + 5) - 0.5) * 0.5, L = tip * (0.7 + 0.8 * rnd(k, seed + 2));
    out.push(bladeA(px, py, la, L, L * 0.16, (k % 2 ? 1 : -1) * 0.12));
  }
};

// ---------- the crown machinery ----------
type Clump = {x: number; y: number; r: number; back: boolean; i: number; e: number};
type Env = {cx: number; cy: number; rx: number; ryT: number; ryB: number; lobes?: number};
// where (px, py) sits in the envelope: < 1 inside, the edge broken into lobes so no crown is a clean ellipse
const envAt = (E: Env, px: number, py: number, seed: number) => {
  const nx = (px - E.cx) / E.rx, ny = (py - E.cy) / (py < E.cy ? E.ryT : E.ryB), th = Math.atan2(ny, nx);
  const lim = 1 + (E.lobes ?? 0.14) * (0.6 * Math.sin(3 * th + seed) + 0.4 * Math.sin(5 * th + seed * 2.1));
  return Math.hypot(nx, ny) / lim;
};
// clump centres on a jittered hex grid inside the envelope; `holes` of the inner ones are dropped to let the sky through
// patch: also clear whole patches where a slow wave runs high (larger, irregular holes; 0 = none, 0.5 = many)
const clumpsIn = (E: Env, R: number, gap: number, holes: number, seed: number, backFrac: number, patch = 0): Clump[] => {
  const s = R * gap, dy = s * 0.866, out: Clump[] = [];
  let i = 0;
  for (let row = 0, y = E.cy - E.ryT * 1.15; y <= E.cy + E.ryB * 1.15; y += dy, row++) {
    for (let x = E.cx - E.rx * 1.2 + ((row % 2) * s) / 2; x <= E.cx + E.rx * 1.2; x += s, i++) {
      const px = x + (rnd(i, seed + 71) - 0.5) * s * 0.55, py = y + (rnd(i, seed + 72) - 0.5) * dy * 0.55;
      const e = envAt(E, px, py, seed);
      if (e > 1) continue;
      if (e < 0.8 && rnd(i, seed + 73) < holes) continue;
      if (patch > 0 && e < 0.82 && 0.55 * Math.sin(px / s * 0.95 + seed) + 0.45 * Math.sin(py / s * 1.2 + px / s * 0.45 + seed * 2.3) > 1 - patch) continue;
      if (e > 0.84 && rnd(i, seed + 74) < 0.16) continue;
      out.push({x: px, y: py, r: R * (0.82 + 0.36 * rnd(i, seed + 75)) * (1 - 0.12 * e), back: e < 0.9 && rnd(i, seed + 76) < backFrac, i, e});
    }
  }
  return out;
};
// the crown sways from the fork: higher clumps move more; wind leans it, t breathes
const swayClumps = (cl: Clump[], fy: number, h: number, seed: number, wind: number, t: number, k = 1) => cl.forEach((c) => {
  const up = Math.max(0, fy - c.y) / h, s = k * up * h * (wind * 0.03 + 0.006 * Math.sin(t * 0.045 + c.i * 0.37 + seed) + 0.003 * Math.sin(t * 0.11 + c.i * 1.3));
  c.x += s; c.y += Math.abs(s) * 0.12;
});
type Reach = {rise: number; seed: number; wMin: number; limbs: number; frac?: number};
// grow a branch from S towards the clumps `cl`: a limb towards their centre, then split by direction and recurse, until
// each clump has its own twig. w: the width at S (the pipe model thins each child by sqrt of its share).
const reach = (S: V, cl: Clump[], w: number, depth: number, P: Reach, wood: string[]) => {
  if (!cl.length) return;
  if (cl.length === 1) {
    const c = cl[0], d = Math.hypot(c.x - S[0], c.y - S[1]);
    if (d < c.r * 0.35) return;
    const M = [(S[0] + c.x) / 2 + (rnd(c.i, P.seed + 81) - 0.5) * d * 0.3, (S[1] + c.y) / 2 - d * P.rise * 0.5];
    wood.push(band(quadPts(S, M, [c.x, c.y], 5), w, Math.max(P.wMin, w * 0.5), 1, "round"));
    return;
  }
  const G = [cl.reduce((a, c) => a + c.x, 0) / cl.length, cl.reduce((a, c) => a + c.y, 0) / cl.length];
  const d = Math.hypot(G[0] - S[0], G[1] - S[1]) || 1;
  const C1 = [S[0] + (G[0] - S[0]) * 0.45 + (rnd(depth * 31 + cl[0].i, P.seed + 82) - 0.5) * d * 0.16, S[1] + (G[1] - S[1]) * 0.45 - d * P.rise];
  // a long limb for a big group, a short fork for a small one (de Casteljau: the sub-curve up to u = fr)
  const fr = P.frac ?? (depth === 0 ? 0.5 : cl.length > 5 ? 0.5 : 0.38);
  const E = [((1 - fr) ** 2) * S[0] + 2 * (1 - fr) * fr * C1[0] + fr * fr * G[0], ((1 - fr) ** 2) * S[1] + 2 * (1 - fr) * fr * C1[1] + fr * fr * G[1]];
  const Cs = [S[0] + (C1[0] - S[0]) * fr, S[1] + (C1[1] - S[1]) * fr];
  const wE = w * 0.8;
  if (depth > 0) wood.push(band(quadPts(S, Cs, E, 6), w, wE, 1, "round"));
  const from = depth > 0 ? E : S;
  // split by direction around the end of the limb
  const dx = G[0] - from[0], dy = G[1] - from[1];
  const sorted = cl.map((c) => ({c, a: Math.atan2((c.x - from[0]) * -dy + (c.y - from[1]) * dx, (c.x - from[0]) * dx + (c.y - from[1]) * dy)})).sort((p, q) => p.a - q.a);
  const k = depth === 0 ? Math.min(P.limbs, cl.length) : cl.length > 9 ? 3 : 2;
  for (let j = 0; j < k; j++) {
    const grp = sorted.slice(Math.round((j * sorted.length) / k), Math.round(((j + 1) * sorted.length) / k)).map((o) => o.c);
    if (!grp.length) continue;
    const share = Math.sqrt(grp.length / cl.length);
    const S2 = depth === 0 ? [from[0] + (j - (k - 1) / 2) * w * 0.32, from[1]] : from;
    reach(S2, grp, Math.max(P.wMin, (depth === 0 ? w * 0.62 : wE) * share * (depth === 0 ? 1.25 : 1)), depth + 1, P, wood);
  }
};
// A trunk with a flared, fluted foot: `stems` fused stems from the ground to (tx, ty), and a buttressed root flare.
const trunk = (x: number, y: number, tx: number, ty: number, w0: number, w1: number, flare: number, seed: number, stems = 2): string[] => {
  const out: string[] = [];
  for (let k = 0; k < stems; k++) {
    const o = (k - (stems - 1) / 2) * w0 * 0.3, b = (rnd(k, seed + 3) - 0.5) * w0 * 0.25;
    out.push(band([[x + o, y + 2], [x + o * 0.85 + b + (tx - x) * 0.3, y + (ty - y) * 0.3], [x + o * 0.5 + (tx - x) * 0.7, y + (ty - y) * 0.7], [tx + o * 0.3, ty]], w0 * (1.12 - stems * 0.1), w1 * (1.12 - stems * 0.1), 1, "round"));
  }
  const fw = w0 * flare, pts: Pt[] = [[x - fw, y + 2, "c"], [x - w0 * 0.85, y - w0 * 0.2], [x - w0 * 0.52, y - w0 * 0.85], [x + w0 * 0.52, y - w0 * 0.85], [x + w0 * 0.88, y - w0 * 0.18], [x + fw * 1.05, y + 2, "c"]];
  out.push(smooth(pts, {wind: "cw"}));
  return out;
};
// Leaves round one clump: a dense heart, then n leaves from about half the radius out, pointing outward and drooping.
type LeafFn = (x: number, y: number, a: number, L: number, i: number, out: string[]) => void;
const dressClump = (c: Clump, n: number, L: number, core: number, droop: number, leaf: LeafFn, seed: number, t: number, wind: number, flutter: number, out: string[], r0 = 0.42) => {
  if (core > 0) out.push(blob(c.x, c.y, c.r * core, c.r * core * 0.82, c.i + seed * 7));
  for (let i = 0; i < n; i++) {
    const g = i * 2.39996 + rnd(c.i, seed + 41) * TAU, rr = c.r * (r0 + (1 - r0) * Math.sqrt(rnd(c.i * 31 + i, seed + 42)));
    const px = c.x + Math.cos(g) * rr, py = c.y + Math.sin(g) * rr * 0.85;
    const fl = flutter * Math.sin(t * 0.16 + i * 2.3 + c.i + seed) + wind * 0.35;
    leaf(px, py, g + ad(Math.PI / 2, g) * droop + fl, L * (0.8 + 0.4 * rnd(c.i * 31 + i, seed + 43)), i, out);
  }
};
type CrownSpec = {env: Env; fork: V; R: number; gap: number; holes: number; backFrac: number; limbs: number; wLimb: number; rise: number; n: number; L: number; core: number; droop: number; leaf: LeafFn; flutter: number; r0?: number; rw?: number; dress?: (c: Clump, out: string[]) => void; patch?: number};
// one broadleaf tree: [back clumps, wood, front clumps] (+ extra wood such as roots passed in)
const broadleaf = (S: CrownSpec, p: Required<Pick<TreeP, "x" | "y" | "h" | "seed" | "wind" | "t" | "detail">> & {fill?: string; back: string}, woodPre: string[]): {items: Item[]; clumps: Clump[]} => {
  const {h, seed, wind, t, detail} = p;
  const cl = clumpsIn(S.env, S.R, S.gap, S.holes, seed, S.backFrac, S.patch);
  swayClumps(cl, S.fork[1], h, seed, wind, t);
  const wood = [...woodPre];
  reach(S.fork, cl, S.wLimb, 0, {rise: S.rise, seed, wMin: Math.max(0.7, h * 0.0035), limbs: S.limbs}, wood);
  const backL: string[] = [], frontL: string[] = [];
  const n = Math.max(4, Math.round(S.n * detail));
  cl.forEach((c) => S.dress ? S.dress(c, c.back ? backL : frontL) : dressClump(c, n, S.L, S.core, S.droop, S.leaf, seed, t, wind, S.flutter, c.back ? backL : frontL, S.r0));
  return {items: [{d: backL.join(" "), fill: p.back, rw: S.rw ?? LEAF_RW}, {d: wood.join(" "), fill: p.fill}, {d: frontL.join(" "), fill: p.fill, rw: S.rw ?? LEAF_RW}], clumps: cl};
};
const norm = (p: TreeP, seed: number) => ({x: p.x, y: p.y, h: p.h, seed: p.seed ?? seed, wind: p.wind ?? 0, t: p.t ?? 0, detail: p.detail ?? 1, fill: p.fill, back: p.back ?? SIL_BACK});

// ---------- peepal ----------
export const peepal = (p0: TreeP): Item[] => {
  const p = norm(p0, 1), {x, y, h, seed} = p;
  const fx = x + (rnd(1, seed) - 0.5) * h * 0.04, fy = y - h * 0.3;
  const wood = trunk(x, y, fx, fy, h * 0.1, h * 0.07, 1.9, seed, 3);
  // long-stalked hearts that hang and flutter (the peepal's leaves tremble in the faintest air)
  const leaf: LeafFn = (lx, ly, a, L, i, out) => {
    const sx = lx + Math.cos(a) * L * 0.34, sy = ly + Math.sin(a) * L * 0.34;
    out.push(blade(lx, ly, sx, sy, Math.max(0.35, L * 0.035)));
    out.push(tmpl(T_PEEPAL, sx, sy, a, L));
  };
  return broadleaf({env: {cx: x, cy: y - h * 0.63, rx: h * 0.48, ryT: h * 0.36, ryB: h * 0.19, lobes: 0.17}, fork: [fx, fy], R: h * 0.066, gap: 1.6, holes: 0.12, backFrac: 0.3, patch: 0.3,
    limbs: 3, wLimb: h * 0.08, rise: 0.12, n: 16, L: h * 0.046, core: 0.5, droop: 0.6, leaf, flutter: 0.3}, p, wood).items;
};

// ---------- banyan ----------
export const banyan = (p0: TreeP): Item[] => {
  const p = norm(p0, 2), {x, y, h, seed, wind, t, detail} = p;
  const fy = y - h * 0.4, wood: string[] = [], roots: string[] = [];
  wood.push(...trunk(x, y, x, fy, h * 0.2, h * 0.15, 1.45, seed, 3));
  // level limbs: out of the trunk's head, rising a little, then running out almost flat to both sides, drooping at the ends
  const L6: [number, number, number][] = [[-1, 0.95, 0.6], [-1, 0.68, 0.7], [-1, 0.4, 0.76], [1, 0.42, 0.75], [1, 0.72, 0.68], [1, 0.98, 0.59]];
  const limbs: number[][][] = L6.map(([s, l, top], k) => {
    const x0 = x + s * h * 0.03, y0 = fy - h * 0.02 * (k % 3), len = h * l, yl = y - h * top, j = (q: number) => (rnd(k * 7 + q, seed + 3) - 0.5) * h * 0.05;
    const pts = crPoints([[x0, y0], [x0 + s * len * 0.22, yl - h * 0.03 + j(1)], [x0 + s * len * 0.5, yl + j(2)], [x0 + s * len * 0.78, yl + h * 0.01 + j(3)], [x0 + s * len, yl + h * 0.05 + j(4)]], 3);
    wood.push(band(pts, h * 0.07, h * 0.022, 1, "round"));
    return pts;
  });
  // the canopy: a broad, flat-bottomed dome of clumps carried by short twigs rising from the limbs
  const E: Env = {cx: x, cy: y - h * 0.74, rx: h * 1.1, ryT: h * 0.3, ryB: h * 0.17, lobes: 0.1};
  const cl = clumpsIn(E, h * 0.105, 1.5, 0.1, seed, 0.3);
  limbs.forEach((L, k) => { for (let q = Math.round(L.length * 0.35); q < L.length; q += 2) cl.push({x: L[q][0], y: L[q][1] + h * 0.02, r: h * 0.085 * (0.85 + 0.3 * rnd(q, seed + k)), back: false, i: 900 + k * 40 + q, e: 0.9}); });
  swayClumps(cl, fy, h, seed, wind, t, 0.5);
  cl.forEach((c) => {
    // the limb point nearest below the clump
    let best: number[] | null = null, bd = 1e9;
    for (const L of limbs) for (const q of L) { const d = Math.abs(q[0] - c.x) * 1.6 + Math.max(0, c.y - q[1]) * 3 + Math.max(0, q[1] - c.y) * 0.4; if (d < bd) { bd = d; best = q; } }
    if (!best) return;
    const M = [(best[0] + c.x) / 2 + (rnd(c.i, seed + 5) - 0.5) * h * 0.03, (best[1] + c.y) / 2];
    wood.push(band(quadPts(best, M, [c.x, c.y], 4), h * 0.018, h * 0.006, 1, "round"));
  });
  const backL: string[] = [], frontL: string[] = [];
  const leaf: LeafFn = (lx, ly, a, L, i, out) => out.push(tmpl(T_OVAL, lx, ly, a, L, 1.05));
  const n = Math.max(4, Math.round(14 * detail));
  cl.forEach((c) => dressClump(c, n, h * 0.055, 0.6, 0.35, leaf, seed, t, wind, 0.12, c.back ? backL : frontL));
  // aerial roots: fine strands hanging from the limbs and the canopy's underside; some reach the ground as pillar roots
  const canopyY = (xx: number) => { const nx = (xx - E.cx) / E.rx; return Math.abs(nx) > 0.97 ? 1e9 : E.cy + E.ryB * Math.sqrt(1 - nx * nx) * 0.8; };
  const nStr = Math.round(46 * detail);
  for (let j = 0; j < nStr; j++) {
    const u = (j + rnd(j, seed + 60)) / nStr, rx0 = x + (u * 2 - 1) * E.rx * 0.92;
    if (Math.abs(rx0 - x) < h * 0.13) continue;
    // hang from the lower of the canopy's underside and the limb above this x
    let ry0 = canopyY(rx0);
    for (const L of limbs) for (let q = 1; q < L.length; q++) if ((L[q - 1][0] - rx0) * (L[q][0] - rx0) <= 0) ry0 = Math.max(Math.min(ry0, 1e8), L[q][1]);
    if (ry0 > 1e8) continue;
    const len = (y - ry0) * (0.25 + 0.7 * Math.pow(rnd(j, seed + 61), 1.4));
    const swing = (wind * 0.06 + 0.02 * Math.sin(t * 0.05 + j)) * len;
    const pts = Array.from({length: 6}, (_, i) => { const v = i / 5; return [rx0 + swing * v * v + Math.sin(v * 5 + j) * h * 0.003, ry0 + len * v]; });
    roots.push(band(pts, h * 0.0065, h * 0.002, 1, "point"));
  }
  const pillars = [-0.88, -0.64, -0.38, 0.36, 0.6, 0.86].filter((_, k) => rnd(k, seed + 62) < 0.85);
  pillars.forEach((v, k) => {
    const px = x + v * h * (0.95 + 0.1 * rnd(k, seed + 63));
    let top = canopyY(px);
    for (const L of limbs) for (let q = 1; q < L.length; q++) if ((L[q - 1][0] - px) * (L[q][0] - px) <= 0) top = Math.max(Math.min(top, 1e8), L[q][1]);
    if (top > 1e8) return;
    const wp = h * (0.026 + 0.014 * rnd(k, seed + 64));
    roots.push(band([[px, y + 2], [px + h * 0.004, y - (y - top) * 0.5], [px + h * 0.002, top]], wp, wp * 0.55, 1, "round"));
    roots.push(smooth([[px - wp * 1.6, y + 2, "c"], [px - wp * 0.6, y - wp * 1.2], [px + wp * 0.6, y - wp * 1.2], [px + wp * 1.7, y + 2, "c"]], {wind: "cw"}));
    // a few strands beside the pillar, braiding into it
    for (let q = 0; q < 2; q++) roots.push(band([[px + (q ? 1 : -1) * wp * 0.9, top], [px + (q ? 1 : -1) * wp * 0.7, y - (y - top) * 0.4], [px + (q ? 1 : -1) * wp * 0.5, y]], h * 0.006, h * 0.004, 1, "round"));
  });
  return [{d: backL.join(" "), fill: p.back, rw: LEAF_RW}, {d: wood.join(" ") + " " + roots.join(" "), fill: p.fill}, {d: frontL.join(" "), fill: p.fill, rw: LEAF_RW}];
};

// ---------- neem ----------
// A pinnate leaf: a rachis bending down towards its tip, sickle leaflets in pairs and one at the end.
const pinnate = (x: number, y: number, a: number, len: number, pairs: number, lfL: number, droop: number, seed: number, t: number, out: string[], sickle = 0.12) => {
  const pts: number[][] = [[x, y]], dirs: number[] = [];
  let px = x, py = y, aa = a;
  const seg = Math.max(3, pairs);
  for (let k = 1; k <= seg; k++) { aa += (ad(Math.PI / 2, aa) * droop) / seg; px += (Math.cos(aa) * len) / seg; py += (Math.sin(aa) * len) / seg; pts.push([px, py]); dirs.push(aa); }
  out.push(band(pts, Math.max(0.6, lfL * 0.1), Math.max(0.4, lfL * 0.05), 1, "point"));
  for (let k = 1; k <= pairs; k++) {
    const q = pts[Math.min(pts.length - 1, k)], d = dirs[Math.min(dirs.length - 1, k - 1)], u = k / pairs, l = lfL * (1 - 0.25 * u);
    for (const s of [-1, 1]) { const la = d + s * (0.95 + 0.1 * Math.sin(t * 0.1 + k + seed)) * (1 - 0.25 * u); out.push(bladeA(q[0], q[1], la + ad(Math.PI / 2, la) * 0.25, l, l * 0.17, sickle * s)); }
  }
  const e = pts[pts.length - 1], de = dirs[dirs.length - 1];
  out.push(bladeA(e[0], e[1], de, lfL * 0.9, lfL * 0.16, 0.06));
};
export const neem = (p0: TreeP): Item[] => {
  const p = norm(p0, 3), {x, y, h, seed, t, wind} = p;
  const fx = x + (rnd(2, seed) - 0.5) * h * 0.03, fy = y - h * 0.3;
  const wood = trunk(x, y, fx, fy, h * 0.07, h * 0.055, 1.6, seed, 2);
  const E: Env = {cx: x, cy: y - h * 0.62, rx: h * 0.38, ryT: h * 0.35, ryB: h * 0.21, lobes: 0.12};
  // each clump is a feathery mass (the leaves crowd at the twig ends); round the crown's edge, pinnate leaves with sickle
  // leaflets stand out from it and droop, so the neem's compound leaf shows against the sky
  const dress = (c: Clump, out: string[]) => {
    const R = c.r;
    fringe(c.x, c.y, R * 0.98, 34, R * 0.42, 0.55, c.i + seed, out);
    if (c.e < 0.66) return;
    const ox = c.x - E.cx, oy = (c.y - E.cy) * 0.8, a0 = Math.atan2(oy, ox);
    for (let j = 0; j < 4; j++) {
      const a = a0 + (j - 1.5) * 0.45 + (rnd(c.i * 5 + j, seed + 50) - 0.5) * 0.3 + wind * 0.2 + 0.03 * Math.sin(t * 0.07 + j + c.i);
      pinnate(c.x + Math.cos(a) * R * 0.55, c.y + Math.sin(a) * R * 0.5, a + ad(Math.PI / 2, a) * 0.25, R * (0.95 + 0.3 * rnd(c.i * 5 + j, seed + 51)), 5, R * 0.3, 0.55, seed + c.i + j, t, out);
    }
  };
  return broadleaf({env: E, fork: [fx, fy], R: h * 0.058, gap: 1.25, holes: 0.06, backFrac: 0.2, patch: 0.3,
    limbs: 3, wLimb: h * 0.055, rise: 0.25, n: 0, L: 0, core: 0, droop: 0, leaf: () => {}, flutter: 0, rw: 0.5, dress}, p, wood).items;
};

// ---------- khejri ----------
export const khejri = (p0: TreeP): Item[] => {
  const p = norm(p0, 6), {x, y, h, seed, wind, t} = p;
  // a short crooked trunk, leaning, forking low; the bark dark and furrowed
  const lean = (rnd(3, seed) - 0.5) * 0.3, fx = x + lean * h * 0.25, fy = y - h * 0.38;
  const wood = [band([[x, y + 2], [x + lean * h * 0.05 + h * 0.025, y - h * 0.12], [x + lean * h * 0.18 - h * 0.02, y - h * 0.26], [fx, fy]], h * 0.075, h * 0.05, 1, "round"),
    smooth([[x - h * 0.08, y + 2, "c"], [x - h * 0.035, y - h * 0.035], [x + h * 0.035, y - h * 0.035], [x + h * 0.085, y + 2, "c"]], {wind: "cw"})];
  const E: Env = {cx: fx + lean * h * 0.1, cy: y - h * 0.66, rx: h * 0.42, ryT: h * 0.3, ryB: h * 0.2, lobes: 0.22};
  // loose masses of fine grey-green foliage, weeping a little at their edges; round the outside, fine bipinnate sprays
  // hang from the twigs, and pods (sangri) in twos and threes
  const dress = (c: Clump, out: string[]) => {
    const R = c.r;
    fringe(c.x, c.y, R * 0.9, 40, R * 0.36, 0.9, c.i + seed, out);
    if (c.e < 0.6) return;
    const ox = c.x - E.cx, oy = (c.y - E.cy) * 0.8, a0 = Math.atan2(oy, ox);
    for (let j = 0; j < 5; j++) {
      const a = a0 + (j - 2) * 0.5 + (rnd(c.i * 5 + j, seed + 50) - 0.5) * 0.4 + wind * 0.25 + 0.03 * Math.sin(t * 0.07 + j + c.i);
      const lx = c.x + Math.cos(a) * R * 0.5, ly = c.y + Math.sin(a) * R * 0.45, L = R * (0.9 + 0.4 * rnd(c.i * 5 + j, seed + 51));
      pinnate(lx, ly, a + ad(Math.PI / 2, a) * 0.45, L, 8, R * 0.17, 1.2, seed + c.i + j, t, out, 0);
      if ((c.i + j) % 6 === 2) { const pl = R * 0.9, sx = wind * pl * 0.3; out.push(band([[lx, ly], [lx + sx * 0.3 + pl * 0.04, ly + pl * 0.45], [lx + sx, ly + pl]], Math.max(0.8, R * 0.05), Math.max(0.5, R * 0.025), 1, "point")); }
    }
  };
  return broadleaf({env: E, fork: [fx, fy], R: h * 0.05, gap: 1.25, holes: 0.08, backFrac: 0.2, patch: 0.24,
    limbs: 3, wLimb: h * 0.05, rise: 0.1, n: 0, L: 0, core: 0, droop: 0, leaf: () => {}, flutter: 0, rw: 0.45, dress}, p, wood).items;
};

// ---------- palmyra ----------
// A stiff palmate fan seen at an angle: radiating pointed segments split about a third of the way in, the outer ones
// sagging. (cx, cy): where the stalk meets the blade; dir: the way the stalk points; face: 1 = seen face-on, 0 = edge-on.
const fan = (cx: number, cy: number, dir: number, R: number, face: number, seed: number, out: string[], nSeg = 15, split = 0.7) => {
  const open = 1.7 + 1.3 * face, P: number[][] = [[0, 0]];
  for (let i = 0; i <= nSeg; i++) {
    const u = i / nSeg, side = u - 0.5, a = side * open, sag = Math.sign(side) * Math.pow(Math.abs(side) * 2, 2.2) * 0.22;
    const tr = R * (0.9 + 0.14 * rnd(i, seed)) * (1 - 0.18 * Math.pow(Math.abs(side) * 2, 2));
    P.push([Math.cos(a + sag) * tr, Math.sin(a + sag) * tr]);
    if (i < nSeg) { const av = ((i + 0.5) / nSeg - 0.5) * open, vr = R * split * (0.92 + 0.16 * rnd(i, seed + 3)); P.push([Math.cos(av) * vr, Math.sin(av) * vr]); }
  }
  const c = Math.cos(dir), s = Math.sin(dir), k = 0.25 + 0.75 * face;
  // gravity: the far part of the blade sags a little
  const Q = P.map(([u, v]) => { const X = u * c - v * k * s, Y = u * s + v * k * c; return [cx + X, cy + Y + Math.pow(Math.hypot(u, v) / R, 2) * R * 0.1]; });
  out.push(polyD(Q, true, "cw"));
};
export const palmyra = (p0: TreeP): Item[] => {
  const p = norm(p0, 4), {x, y, h, seed, wind, t} = p, out: string[] = [];
  const lean = (rnd(1, seed) - 0.5) * 0.05 + wind * 0.01;
  const top: [number, number] = [x + lean * h, y - h * 0.76];
  // the trunk: straight and dark, swelling a little high up, a flared foot
  const tp: number[][] = Array.from({length: 11}, (_, i) => { const u = i / 10; return [x + lean * h * u + Math.sin(u * 3 + seed) * h * 0.003, y + 2 - h * 0.76 * u]; });
  const L: Pt[] = [], Rr: Pt[] = [];
  tp.forEach(([px, py], i) => { const u = i / 10, w = h * (0.021 - 0.004 * u + 0.005 * Math.exp(-Math.pow((u - 0.72) / 0.16, 2)) + (u < 0.06 ? 0.012 * (1 - u / 0.06) : 0)); L.push([px - w, py]); Rr.push([px + w, py]); });
  out.push(smooth([...L, ...Rr.reverse()], {wind: "cw"}));
  const C: [number, number] = [top[0], top[1] - h * 0.015], fans: string[] = [];
  // the head, where the leaf bases crowd, and a skirt of old leaf bases below it
  out.push(blob(C[0], C[1] - h * 0.012, h * 0.066, h * 0.06, seed, 11, 0.2));
  for (let i = 0; i < 8; i++) { const s = i % 2 ? 1 : -1, yy = C[1] + h * (0.03 + i * 0.006); out.push(bladeA(C[0] + s * h * 0.012, yy, Math.PI / 2 + s * (0.35 + 0.05 * i), h * 0.028, h * 0.008, 0.08 * s)); }
  // the crown: big stiff fans on straight stalks round the head, most seen near edge-on, gaps of sky between them
  const nF = 13;
  for (let i = 0; i < nF; i++) {
    const u = (i + 0.5) / nF, base = -Math.PI - 0.6 + u * (Math.PI + 1.2) + (rnd(i, seed + 7) - 0.5) * 0.2;
    const dir = base + (wind * 0.1 + 0.02 * Math.sin(t * 0.05 + i)) * (0.4 + 0.6 * Math.abs(Math.cos(base)));
    const pl = h * 0.045 * (0.6 + 0.9 * rnd(i, seed + 8)), ex = C[0] + Math.cos(dir) * pl, ey = C[1] + Math.sin(dir) * pl;
    out.push(band([[C[0], C[1]], [C[0] + Math.cos(dir) * pl * 0.5, C[1] + Math.sin(dir) * pl * 0.5], [ex, ey]], h * 0.007, h * 0.0045, 1, "round"));
    fan(ex, ey, dir, h * 0.095 * (0.8 + 0.4 * rnd(i, seed + 9)), 0.25 + 0.55 * rnd(i, seed + 11), seed + i, fans);
  }
  // dead fans hanging below the crown, shrivelled, pointing down
  for (let i = 0; i < 5; i++) {
    const dir = Math.PI / 2 + (i - 2) * 0.3 + 0.03 * Math.sin(t * 0.04 + i), pl = h * (0.05 + 0.02 * rnd(i, seed + 41));
    const ex = C[0] + Math.cos(dir) * pl, ey = C[1] + h * 0.03 + Math.sin(dir) * pl;
    out.push(band([[C[0] + Math.cos(dir) * h * 0.03, C[1] + h * 0.03], [ex, ey]], h * 0.007, h * 0.005, 1, "round"));
    fan(ex, ey, dir, h * 0.06, 0.08, seed + 40 + i, fans, 9, 0.6);
  }
  return [{d: out.join(" "), fill: p.fill}, {d: fans.join(" "), fill: p.fill, rw: 0.6}];
};

// ---------- coconut ----------
export const coconut = (p0: TreeP & {lean?: number}): Item[] => {
  const p = norm(p0, 5), {x, y, h, seed, wind, t, detail} = p, out: string[] = [], leaves: string[] = [], backF: string[] = [];
  const lean = p0.lean ?? (rnd(1, seed) > 0.5 ? 1 : -1) * (0.12 + 0.1 * rnd(2, seed)) + wind * 0.02;
  // a slender trunk in a long S-curve, leaning, ringed
  const tp: number[][] = Array.from({length: 13}, (_, i) => { const u = i / 12; return [x + lean * h * (u * u * 0.9 + Math.sin(u * 2.6) * 0.15), y + 2 - h * 0.78 * u]; });
  const L: Pt[] = [], Rr: Pt[] = [];
  tp.forEach(([px, py], i) => { const u = i / 12, w = h * (0.02 - 0.007 * u + (u < 0.07 ? 0.012 * (1 - u / 0.07) : 0)) * (1 + 0.07 * (i % 2)); L.push([px - w, py]); Rr.push([px + w, py]); });
  out.push(smooth([...L, ...Rr.reverse()], {wind: "cw"}));
  const C = tp[tp.length - 1];
  for (let i = 0; i < 7; i++) { const a = (i / 7) * TAU, r = h * 0.014; out.push(blob(C[0] + Math.cos(a) * h * 0.018, C[1] + h * 0.022 + Math.sin(a) * h * 0.008, r, r * 1.1, seed + i, 7, 0.1)); }
  // the fronds: a rachis arching out and drooping, leaflets hanging from both sides
  const nF = Math.round(16 * Math.min(1.3, detail));
  for (let i = 0; i < nF; i++) {
    const u = i / (nF - 1), th = -Math.PI - 0.5 + u * (Math.PI + 1.0) + (rnd(i, seed + 7) - 0.5) * 0.3;
    const side = Math.cos(th) >= 0 ? 1 : -1, len = h * (0.3 + 0.08 * rnd(i, seed + 8)) * (1 - 0.25 * Math.abs(Math.sin(th)) * (Math.sin(th) > 0 ? 1 : 0));
    const droop = 0.9 + 0.9 * (1 - Math.abs(Math.sin(th))) + wind * side * 0.3 + 0.06 * Math.sin(t * 0.05 + i);
    const pts: number[][] = [[C[0], C[1]]], dirs: number[] = [];
    let px = C[0], py = C[1], aa = th + wind * 0.15;
    for (let k = 1; k <= 14; k++) { const q = k / 14; aa = th + wind * 0.15 + side * droop * Math.pow(q, 1.7); px += (Math.cos(aa) * len) / 14; py += (Math.sin(aa) * len) / 14; pts.push([px, py]); dirs.push(aa); }
    const isBack = rnd(i, seed + 20) < 0.3;
    (isBack ? backF : out).push(band(pts, h * 0.008, h * 0.002, 1, "point"));
    const nl = Math.round(22 * detail);
    for (let k = 0; k < nl; k++) {
      const q = 0.12 + 0.86 * (k / (nl - 1)), idx = Math.min(13, Math.floor(q * 14)), pp = pts[idx + 1], d = dirs[idx];
      const env = Math.pow(Math.sin(Math.PI * Math.min(1, (q - 0.08) / 0.95)), 0.6), ll = h * 0.075 * env;
      for (const s of [-1, 1]) {
        let la = d + s * 0.9; la += ad(Math.PI / 2, la) * 0.62 + 0.05 * Math.sin(t * 0.09 + k + i);
        (isBack ? backF : leaves).push(bladeA(pp[0], pp[1], la, ll, h * 0.0035, 0.06 * s));
      }
    }
  }
  // leaflets are thinner than any rim offset, so they are drawn flat (a rim would turn each blade gold); the trunk and
  // the frond spines carry the rim
  return [{d: backF.join(" "), fill: p.back, rim: false}, {d: out.join(" "), fill: p.fill}, {d: leaves.join(" "), fill: p.fill, rim: false}];
};

// ---------- deodar ----------
// A spray pad: a flat-topped cloud of foliage along a level branch, its underside fringed with hanging tufts, the outer
// end drooping. From (x0, y0) out to `len` on side s (+1 right, -1 left); th: the pad's depth.
const sprayPad = (x0: number, y0: number, s: number, len: number, th: number, drop: number, seed: number, out: string[]) => {
  const N = Math.max(7, Math.round(len / (th * 0.55))), top: Pt[] = [], bot: Pt[] = [];
  for (let i = 0; i <= N; i++) {
    const q = i / N, bx = x0 + s * len * q, by = y0 + drop * Math.pow(q, 2.4);
    const thick = th * (1 - 0.5 * q) * (0.8 + 0.4 * rnd(i, seed));
    top.push([bx, by - thick * (0.5 + 0.25 * Math.sin(q * Math.PI)) - (rnd(i, seed + 1) < 0.3 ? thick * 0.18 : 0)]);
    // the fringe: points hanging down between shallow notches
    bot.push([bx, by + thick * (i % 2 ? 0.42 + 0.3 * rnd(i, seed + 2) : 0.16 + 0.08 * rnd(i, seed + 4)), "c"]);
  }
  const tipP: Pt = [x0 + s * len * 1.03, y0 + drop * 1.08 + th * 0.15, "c"];
  out.push(smooth([[x0, y0 - th * 0.3, "c"], ...top, tipP, ...bot.reverse(), [x0, y0 + th * 0.2, "c"]], {wind: "cw"}));
};
export const deodar = (p0: TreeP): Item[] => {
  const p = norm(p0, 7), {x, y, h, seed, wind, t} = p, out: string[] = [], backP: string[] = [];
  const nod = rnd(1, seed) > 0.5 ? 1 : -1, sway = wind * 0.012 + 0.004 * Math.sin(t * 0.04 + seed);
  const stemX = (u: number) => x + sway * h * u * u + (u > 0.9 ? nod * Math.pow((u - 0.9) / 0.1, 2) * h * 0.03 : 0);
  out.push(band(Array.from({length: 12}, (_, i) => { const u = i / 11; return [stemX(u), y + 2 - h * u]; }), h * 0.042, h * 0.004, 1, "point"));
  // tiers: whorls of level branches, longest low down, shorter towards the top; left and right at different heights
  const nT = 10;
  for (let k = 0; k < nT; k++) {
    for (const s of [-1, 1]) {
      const u = 0.14 + ((k + (s > 0 ? 0.45 : 0)) / nT) * 0.8 + (rnd(k * 2 + (s > 0 ? 1 : 0), seed + 9) - 0.5) * 0.03;
      if (u > 0.95) continue;
      const yy = y - h * u, cx = stemX(u), env = Math.pow(1 - (u - 0.14) / 0.86, 0.95);
      const len = h * (0.04 + 0.36 * env) * (0.78 + 0.44 * rnd(k * 2 + (s > 0 ? 1 : 0), seed + 4));
      const th = h * (0.024 + 0.03 * env), drop = len * (0.26 + 0.14 * rnd(k, seed + 5)) - sway * h * s * 3;
      const dst = rnd(k * 2 + (s > 0 ? 1 : 0), seed + 6) < 0.22 ? backP : out;
      // the branch, then two or three overlapping pads along it, the outer one drooping furthest
      dst.push(band([[cx, yy], [cx + s * len * 0.5, yy + drop * 0.15], [cx + s * len * 0.95, yy + drop * 0.8]], h * 0.008, h * 0.003, 1, "round"));
      const nP = len > h * 0.15 ? 3 : len > h * 0.07 ? 2 : 1;
      for (let j = 0; j < nP; j++) {
        const a = j / nP, b = (j + 1) / nP + 0.12;
        sprayPad(cx + s * len * a, yy + drop * Math.pow(a, 2.4) - th * 0.1, s, len * Math.min(1.03 - a, b - a), th * (1 - 0.25 * a), drop * (Math.pow(Math.min(1, b), 2.4) - Math.pow(a, 2.4)), seed + k * 13 + j + (s > 0 ? 7 : 0), dst);
      }
    }
  }
  // the crown: a small nodding leader of short sprays
  const tx = stemX(1), ty = y - h;
  for (let j = 0; j < 4; j++) sprayPad(stemX(0.93 + j * 0.015), y - h * (0.93 + j * 0.015), nod * (j % 2 ? 1 : -1), h * (0.035 - j * 0.005), h * 0.016, h * 0.012, seed + 90 + j, out);
  out.push(bladeA(tx, ty, Math.PI / 2 + nod * 1.1, h * 0.04, h * 0.006, 0.1 * nod));
  return [{d: backP.join(" "), fill: p.back}, {d: out.join(" "), fill: p.fill}];
};

// ---------- grasses ----------
// kans grass: arching blades and tall stems with silky plumes leaning with the wind
export const reeds = (p0: TreeP & {plumes?: number}): Item[] => {
  const p = norm(p0, 8), {x, y, h, seed, wind, t, detail} = p, out: string[] = [], fine: string[] = [];
  const nb = Math.round(16 * detail), np = Math.max(2, Math.round((p0.plumes ?? 6) * detail));
  for (let i = 0; i < nb; i++) {
    const bx = x + (rnd(i, seed) - 0.5) * h * 0.18, side = rnd(i, seed + 1) > 0.5 ? 1 : -1, len = h * (0.42 + 0.35 * rnd(i, seed + 2));
    const bend = side * (0.4 + 0.8 * rnd(i, seed + 3)) + wind * 0.5 + 0.06 * Math.sin(t * 0.07 + i);
    const pts = Array.from({length: 7}, (_, k) => { const u = k / 6, a = -Math.PI / 2 + bend * u * u; return [bx + Math.cos(a) * len * u * 0.8 + bend * len * 0.12 * u * u, y + 2 + Math.sin(a) * len * u]; });
    out.push(band(pts, h * 0.016, h * 0.002, 1, "point"));
  }
  for (let i = 0; i < np; i++) {
    const bx = x + (rnd(i, seed + 10) - 0.5) * h * 0.14, len = h * (0.78 + 0.22 * rnd(i, seed + 11));
    const lean = wind * 0.25 + (rnd(i, seed + 12) - 0.5) * 0.25 + 0.04 * Math.sin(t * 0.06 + i * 1.3);
    const pts = Array.from({length: 8}, (_, k) => { const u = k / 7; return [bx + lean * len * u * u, y + 2 - len * u]; });
    out.push(band(pts, h * 0.008, h * 0.004, 1, "round"));
    const tip = pts[7], prev = pts[6], a0 = Math.atan2(tip[1] - prev[1], tip[0] - prev[0]), pl = h * 0.24;
    const axis: number[][] = Array.from({length: 7}, (_, k) => { const u = k / 6, a = a0 + (wind * 0.8 + lean) * u * 1.2; return [tip[0] + Math.cos(a) * pl * u, tip[1] + Math.sin(a) * pl * u]; });
    fine.push(band(axis, h * 0.005, h * 0.001, 1, "point"));
    for (let k = 0; k < 16; k++) {
      const u = 0.08 + 0.9 * (k / 15), q = axis[Math.min(6, Math.round(u * 6))], s = k % 2 ? 1 : -1, env = Math.sin(Math.PI * Math.min(1, u * 1.1));
      const a = a0 + (wind * 0.8 + lean) * u * 1.2 + s * 0.5 + wind * 0.3;
      fine.push(bladeA(q[0], q[1], a, h * 0.07 * env + h * 0.015, h * 0.006, 0.08 * s));
    }
  }
  return [{d: out.join(" "), fill: p.fill}, {d: fine.join(" "), fill: p.fill, rw: LEAF_RW}];
};
// a hill of ripe rice: upright blades fanning a little, stems that bow over under drooping panicles of grain
export const rice = (p0: TreeP): Item[] => {
  const p = norm(p0, 9), {x, y, h, seed, wind, t, detail} = p, out: string[] = [], fine: string[] = [];
  const nb = Math.round(11 * detail), np = Math.max(2, Math.round(5 * detail));
  for (let i = 0; i < nb; i++) {
    const bx = x + (rnd(i, seed) - 0.5) * h * 0.1, side = (i / Math.max(1, nb - 1) - 0.5) * 2, len = h * (0.6 + 0.3 * rnd(i, seed + 2));
    const bend = side * (0.35 + 0.35 * rnd(i, seed + 3)) + wind * 0.3 + 0.04 * Math.sin(t * 0.07 + i);
    const pts = Array.from({length: 7}, (_, k) => { const u = k / 6, a = -Math.PI / 2 + side * 0.22 + bend * u * u * 1.2; return [bx + Math.cos(a) * len * u, y + 2 + Math.sin(a) * len * u]; });
    out.push(band(pts, h * 0.02, h * 0.002, 1, "point"));
  }
  for (let i = 0; i < np; i++) {
    const bx = x + (rnd(i, seed + 10) - 0.5) * h * 0.08, side = rnd(i, seed + 13) > 0.5 ? 1 : -1, len = h * (0.78 + 0.18 * rnd(i, seed + 11));
    const lean = side * (0.06 + 0.1 * rnd(i, seed + 12)) + wind * 0.15 + 0.03 * Math.sin(t * 0.06 + i);
    const st = Array.from({length: 8}, (_, k) => { const u = k / 7; return [bx + lean * len * u * u, y + 2 - len * u]; });
    out.push(band(st, h * 0.01, h * 0.006, 1, "round"));
    // the panicle bows over from the top of the stem and hangs, its branchlets strung with grains
    const top = st[7], dir = lean >= 0 ? 1 : -1, pl = h * 0.32;
    const ax: number[][] = Array.from({length: 9}, (_, k) => { const u = k / 8, a = -Math.PI / 2 + dir * (0.5 + 2.1 * u) + wind * 0.2 * u; return [top[0] + Math.cos(a) * pl * u * 0.5 + dir * pl * u * 0.22, top[1] + Math.sin(a) * pl * u * 0.45 + pl * u * u * 0.5]; });
    fine.push(band(ax, h * 0.006, h * 0.002, 1, "point"));
    for (let k = 1; k < 9; k++) {
      const q = ax[k], u = k / 8, a0 = Math.atan2(ax[Math.min(8, k + 1)][1] - ax[k - 1][1], ax[Math.min(8, k + 1)][0] - ax[k - 1][0]);
      for (const s of [-1, 1]) {
        const ba = a0 + s * 0.45 + ad(Math.PI / 2, a0 + s * 0.45) * 0.55, bl = h * 0.065 * (1 - 0.5 * u);
        const ex = q[0] + Math.cos(ba) * bl, ey = q[1] + Math.sin(ba) * bl;
        fine.push(blade(q[0], q[1], ex, ey, h * 0.002));
        for (let g = 1; g <= 3; g++) { const r = g / 3.4, gx = q[0] + (ex - q[0]) * r, gy = q[1] + (ey - q[1]) * r; fine.push(bladeA(gx, gy, ba + 0.45 * s, h * 0.022, h * 0.0075)); }
      }
      fine.push(bladeA(q[0], q[1], a0 + 0.3, h * 0.022, h * 0.0075));
    }
  }
  return [{d: out.join(" "), fill: p.fill}, {d: fine.join(" "), fill: p.fill, rw: LEAF_RW}];
};
// rows of rice hills between x0 and x1 on the line y: a paddy in silhouette
export const paddy = ({x0, x1, y, h, seed = 10, wind = 0, t = 0, gap, fill}: {x0: number; x1: number; y: number; h: number; seed?: number; wind?: number; t?: number; gap?: number; fill?: string}): Item[] => {
  const g = gap ?? h * 0.42, coarse: string[] = [], fine: string[] = [];
  for (let x = x0, i = 0; x <= x1; x += g * (0.85 + 0.3 * rnd(i, seed)), i++) {
    const it = rice({x, y: y + (rnd(i, seed + 1) - 0.5) * h * 0.04, h: h * (0.85 + 0.3 * rnd(i, seed + 2)), seed: seed + i, wind, t, detail: 0.7}) as {d: string}[];
    coarse.push(it[0].d); fine.push(it[1].d);
  }
  return [{d: coarse.join(" "), fill}, {d: fine.join(" "), fill, rw: LEAF_RW}];
};

// ---------- the lotus ----------
// A lotus leaf raised on its stalk above the water (y = the water line), seen from the side: a shallow upturned bowl
// with a wavy rim, the stalk meeting its middle from below. raised = false: a pad floating on the water, almost edge-on.
export const lotusLeaf = ({x, y, r, seed = 11, t = 0, wind = 0, raised = true, tilt = 0}: {x: number; y: number; r: number; seed?: number; t?: number; wind?: number; raised?: boolean; tilt?: number}): Item[] => {
  const out: string[] = [], sw = (wind * 0.06 + 0.03 * Math.sin(t * 0.05 + seed)) * r;
  const ly = raised ? y - r * (1.3 + 0.9 * rnd(1, seed)) : y - r * 0.02, lx = x + (raised ? sw : 0), tl = tilt + (rnd(2, seed) - 0.5) * (raised ? 0.6 : 0.06);
  if (raised) out.push(band([[x, y + 2], [x + sw * 0.3 + r * 0.06, (y + ly) / 2], [lx, ly]], r * 0.07, r * 0.055, 1, "round"));
  const N = 18, P: Pt[] = [];
  const depth = raised ? r * 0.42 : r * 0.05, lip = raised ? r * 0.14 : r * 0.04;
  // the far rim (seen just above the near one), left to right, wavy and a little ragged
  for (let i = 0; i <= N; i++) { const u = i / N, xx = (u * 2 - 1) * r * (1 + 0.04 * Math.sin(i * 1.9 + seed)); P.push([xx, -depth - lip * Math.sin(Math.PI * u) - r * (raised ? 0.05 : 0.02) * Math.sin(i * 2.9 + seed) - (raised ? r * 0.06 * Math.pow(Math.abs(u * 2 - 1), 3) : 0)]); }
  // the underside, right to left, a shallow cone down to the stalk
  for (let i = N - 1; i >= 1; i--) { const u = i / N, xx = (u * 2 - 1) * r; P.push([xx, -depth * Math.pow(Math.abs(u * 2 - 1), 1.25) + r * 0.012 * Math.sin(i * 1.7 + seed)]); }
  const c = Math.cos(tl), s = Math.sin(tl);
  out.push(smooth(P.map((q) => [lx + q[0] * c - q[1] * s, ly + q[0] * s + q[1] * c] as Pt), {wind: "cw"}));
  return [{d: out.join(" ")}];
};
// A lotus bud on its stalk: a pointed ovoid, the outer petals parting a little at the tip. h: from the water to the tip.
export const lotusBud = ({x, y, h, seed = 12, t = 0, wind = 0, open = 0}: {x: number; y: number; h: number; seed?: number; t?: number; wind?: number; open?: number}): Item[] => {
  const out: string[] = [], sw = (wind * 0.05 + 0.02 * Math.sin(t * 0.05 + seed)) * h, bh = h * 0.24, bw = bh * 0.42;
  const bx = x + sw, by = y - h + bh;
  out.push(band([[x, y + 2], [x + sw * 0.4 + h * 0.02, y - h * 0.4], [bx, by]], h * 0.024, h * 0.018, 1, "round"));
  out.push(smooth([[bx, by + bh * 0.06], [bx + bw, by - bh * 0.3], [bx + bw * 0.7, by - bh * 0.72], [bx, by - bh, "c"], [bx - bw * 0.7, by - bh * 0.72], [bx - bw, by - bh * 0.3]], {wind: "cw"}));
  const o = clamp01(open);
  for (const s of [-1, 1]) out.push(smooth([[bx + s * bw * 0.4, by - bh * 0.05], [bx + s * bw * (1.05 + 0.4 * o), by - bh * 0.4], [bx + s * bw * (0.7 + 0.7 * o), by - bh * (0.85 - 0.15 * o), "c"], [bx + s * bw * 0.5, by - bh * 0.45]], {wind: "cw"}));
  return [{d: out.join(" ")}];
};
// An open lotus on its stalk: a cup of broad pointed petals in two rings. h: from the water to the top of the petals.
export const lotusFlower = ({x, y, h, seed = 13, t = 0, wind = 0}: {x: number; y: number; h: number; seed?: number; t?: number; wind?: number}): Item[] => {
  const out: string[] = [], sw = (wind * 0.05 + 0.02 * Math.sin(t * 0.05 + seed)) * h, fh = h * 0.26, fx = x + sw, fy = y - h + fh;
  out.push(band([[x, y + 2], [x + sw * 0.4 - h * 0.02, y - h * 0.4], [fx, fy]], h * 0.024, h * 0.02, 1, "round"));
  const petal = (a: number, len: number, wd: number) => { const c = Math.cos(a), s = Math.sin(a), P: Pt[] = [[0, 0], [wd * 0.9, -len * 0.35], [wd * 0.55, -len * 0.82], [0, -len, "c"], [-wd * 0.55, -len * 0.82], [-wd * 0.9, -len * 0.35]]; out.push(smooth(P.map((q) => [fx + q[0] * c - q[1] * s, fy + q[0] * s + q[1] * c, q[2]] as Pt), {wind: "cw"})); };
  [-1.25, -0.75, 0.75, 1.25].forEach((a) => petal(a, fh * 0.95, fh * 0.36));
  [-0.42, 0, 0.42].forEach((a) => petal(a, fh * 1.05, fh * 0.4));
  out.push(blob(fx, fy - fh * 0.05, fh * 0.42, fh * 0.2, seed, 8, 0.1));
  return [{d: out.join(" ")}];
};
export const FLORA = {peepal, banyan, neem, palmyra, coconut, khejri, deodar, reeds, rice};
