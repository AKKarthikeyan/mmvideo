// Indian architecture as silhouettes for Rimmed (22 Oct 2026): one vocabulary for the whole film, the North Indian
// (Nagara) temple and its parts. Each function returns path items with anchors: `const t = temple({...})` is an Item[]
// (draw it with <Rimmed paths={t} light={...}/>) that also carries `t.at` (named points: the door, the sill, the top of
// the flag ...). Solid parts are wound clockwise and openings counter-clockwise, so doorways, bays and niches are real
// holes: whatever is drawn behind (a lamp's glow, the sky) shows through them. `relief` items carry a slightly lighter
// tint of the silhouette for carved detail (courses, ribs, mouldings), so the shapes read as stone without leaving the
// near-black.
//
//   temple       Nagara temple in elevation: jagati and steps, moulded base (adhishthana), wall (jangha) with a door,
//                cornice, the curvilinear shikhara ribbed into storeys (bhumi) with knobbed corners, half-spires
//                (urushringa) on its flanks, the neck, the ribbed amalaka, the kalasha and a flag on its staff; optional
//                porch (mandapa) with open pillared bays and a stepped pyramidal roof crowned by a bell (ghanta)
//   shrine       a small one-cell shrine: plinth, cell with a doorway, a little shikhara, amalaka, kalasha
//   cuspedArch   a gateway (torana): two carved pillars carrying a multifoil (cusped) arch under a lintel
//   pillar       a carved pillar: lotus base, square-to-octagonal shaft, pot-and-foliage, cushion, bracket capital
//   niche        a devakoshta: a wall niche framed by pilasters under a miniature shikhara, in a plain wall
//   ghat         stone ghat steps, many shallow steps with chipped edges, in side profile or seen from the front
//   ledge        a moulded stone ledge (cornice, cyma, torus, fillet) with chipped edges
// Proportions follow the Nagara canon loosely: wall : tower : crown ~ 2 : 4 : 1 (Odisha's bada, gandi, mastaka); the
// tower curves in over its upper half to about 0.55 of its base; the amalaka overhangs the neck.
import type {Item} from "./sil";
import {rnd, smooth, polyD, Pt, Wind} from "./geom";

export type Piece = Item[] & {at: Record<string, [number, number]>};
export const RELIEF = "#24162E", RELIEF_LT = "#2C1C38";
const piece = (items: Item[], at: Record<string, [number, number]>): Piece => Object.assign(items, {at});
// a symmetric outline from its right half (bottom to top, x measured from cx), mirrored: wound as asked
const sym = (cx: number, half: Pt[], wind: Wind = "cw"): string => {
  const R = half.map((p) => [cx + p[0], p[1], p[2]] as Pt), Lh = half.slice().reverse().map((p) => [cx - p[0], p[1], p[2]] as Pt);
  return smooth([...R, ...Lh].map((p) => (p[2] ? p : [p[0], p[1]]) as Pt), {wind});
};
const box = (x0: number, y0: number, x1: number, y1: number, wind: Wind = "cw") => polyD([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], true, wind);
const C = (x: number, y: number): Pt => [x, y, "c"];

// ---------- shared parts ----------
// The kalasha: a pot on a ring, a narrow neck and lip, the pointed citron finial (bijapuraka). s: its height.
export const kalasha = (cx: number, y: number, s: number): string => sym(cx, ([C(0.2, 0), C(0.24, -0.05), [0.4, -0.2], [0.44, -0.36], [0.34, -0.5], C(0.16, -0.58), C(0.27, -0.62), C(0.27, -0.68), C(0.12, -0.7), [0.12, -0.8], [0.07, -0.92], C(0, -1.0)] as Pt[]).map((p) => [p[0] * s, y + p[1] * s, p[2]] as Pt));
// The amalaka: a ribbed cushion, hw its half-width, hh its height, standing on y; plus its ribs as relief.
export const amalaka = (cx: number, y: number, hw: number, hh: number): [string, string] => {
  const body = sym(cx, [C(hw * 0.62, y), [hw * 0.92, y - hh * 0.18], [hw, y - hh * 0.5], [hw * 0.92, y - hh * 0.82], C(hw * 0.62, y - hh)]);
  let ribs = "";
  for (let i = -3; i <= 3; i++) { const u = i / 3.6, x = cx + Math.sin(u * 1.3) * hw * 0.95, w = Math.max(0.6, hw * 0.035 * Math.cos(u * 1.3)); ribs += ` ${box(x - w, y - hh * 0.1, x + w, y - hh * 0.9)}`; }
  return [body, ribs];
};
// A curvilinear spire (rekha shikhara): base half-width hw at y, height ht; it rises almost straight and curves in ever
// faster towards the top (to `top` of hw), its corners beaded at each storey (bhumi) with a small ribbed disc, the
// bhumi-amalaka. Returns [outline, relief (the central offset and the storey courses)].
export const spire = (cx: number, y: number, hw: number, ht: number, bhumis = 5, top = 0.5, knob = 1): [string, string] => {
  const prof = (u: number) => hw * (1 - (1 - top) * Math.pow(u, 2.1));
  const half: Pt[] = [C(hw, y)], kn = hw * 0.05 * knob;
  for (let k = 0; k < bhumis; k++) {
    const u0 = k / bhumis, u1 = (k + 1) / bhumis, kh = 0.2 / bhumis, ua = u1 - kh;
    half.push([prof((u0 + ua) / 2), y - ht * (u0 + ua) / 2]);
    half.push(C(prof(ua), y - ht * ua));
    // the corner amalaka: a rounded bead standing out of the curve
    half.push([prof(ua) + kn * 0.75, y - ht * (ua + kh * 0.18)]);
    half.push([prof(ua + kh / 2) + kn, y - ht * (ua + kh * 0.5)]);
    half.push([prof(u1) + kn * 0.75, y - ht * (u1 - kh * 0.18)]);
    half.push(C(prof(u1), y - ht * u1));
  }
  const out = sym(cx, half);
  // relief: the central offset (the latina's spine), the two flanking offsets (rathas), and the storey courses
  const spine: Pt[] = [C(hw * 0.3, y)];
  for (let k = 1; k < 8; k++) { const u = k / 8; spine.push([prof(u) * 0.3, y - ht * u]); }
  spine.push(C(prof(1) * 0.3, y - ht));
  let rel = sym(cx, spine);
  for (const v of [-0.62, 0.62]) for (let k = 0; k < 8; k++) { const u = k / 8, u2 = (k + 1) / 8, xa = cx + v * prof(u), xb = cx + v * prof(u2); rel += ` ${polyD([[xa - 0.6, y - ht * u], [xa + 0.6, y - ht * u], [xb + 0.6, y - ht * u2], [xb - 0.6, y - ht * u2]], true, "cw")}`; }
  for (let k = 1; k < bhumis; k++) { const u = k / bhumis - 0.1 / bhumis, w = prof(u) * 0.98; rel += ` ${box(cx - w, y - ht * u - 1, cx + w, y - ht * u + 1)}`; }
  return [out, rel];
};

// ---------- the temple ----------
export type TempleP = {x: number; y: number; w: number; porch?: -1 | 0 | 1; spires?: 0 | 1 | 2; flag?: boolean; t?: number; wind?: number; door?: boolean; seed?: number};
// x: the centre of the sanctum, y: the ground, w: the sanctum's wall width. Total height ~3.3 w to the finial, ~3.9 w to
// the flag. porch: 1 = a mandapa on the right, -1 on the left, 0 = none (the door is then in the sanctum wall).
export const temple = ({x, y, w: B, porch = 1, spires = 1, flag = true, t = 0, wind = 0, door = true}: TempleP): Piece => {
  const S: string[] = [], R: string[] = [], at: Record<string, [number, number]> = {};
  const Y = (v: number) => y + v * B, X = (v: number) => x + v * B, s = porch || 1;
  const pxMax = porch ? 1.78 : 0;           // how far the porch reaches (in B, on side s)
  // the jagati (platform) in three steps, running under the porch
  for (let k = 0; k < 3; k++) {
    const a = -1.0 + k * 0.06, b = 1.0 - k * 0.06;
    const lo = porch ? (s > 0 ? a : -(pxMax + 0.2 - k * 0.06)) : a, hi = porch ? (s > 0 ? pxMax + 0.2 - k * 0.06 : b) : b;
    S.push(box(X(lo), Y(-k * 0.045), X(hi), Y(-(k + 1) * 0.045 - 0.002)));
  }
  // the moulded base (adhishthana): plinth, recess, the rounded kumbha, recess, the kapota
  const base: Pt[] = [C(0.64, -0.135), C(0.64, -0.17), C(0.58, -0.17), C(0.58, -0.19), [0.62, -0.215], [0.62, -0.235], C(0.58, -0.26), C(0.56, -0.26), C(0.56, -0.275), C(0.61, -0.275), C(0.61, -0.305), C(0.5, -0.305)];
  S.push(sym(x, base.map((p) => [p[0] * B, Y(p[1]), p[2]] as Pt)));
  // the wall (jangha) with a middle band; the cornice (varandika)
  S.push(box(X(-0.5), Y(-0.3), X(0.5), Y(-0.84)));
  S.push(box(X(-0.52), Y(-0.55), X(0.52), Y(-0.58)));
  S.push(sym(x, [C(0.5 * B, Y(-0.84)), C(0.55 * B, Y(-0.85)), C(0.55 * B, Y(-0.875)), C(0.585 * B, Y(-0.88)), C(0.585 * B, Y(-0.91)), C(0.47 * B, Y(-0.915))]));
  R.push(box(X(-0.5), Y(-0.43), X(0.5), Y(-0.44)), box(X(-0.5), Y(-0.7), X(0.5), Y(-0.71)));
  for (const v of [-0.34, 0.34]) R.push(box(X(v - 0.004), Y(-0.31), X(v + 0.004), Y(-0.84)));
  if (!porch && door) {
    // the doorway, a real opening, under a lintel
    S.push(box(X(-0.13), Y(-0.305), X(0.13), Y(-0.69), "ccw"));
    S.push(box(X(-0.17), Y(-0.69), X(0.17), Y(-0.72)));
    at.door = [x, Y(-0.305)]; at.doorTop = [x, Y(-0.69)];
  }
  // the shikhara: the main spire, the sukanasa over the porch, the half-spires on its flanks
  const ht = 1.62, [sp, spr] = spire(x, Y(-0.91), 0.47 * B, ht * B, 5, 0.52);
  S.push(sp); R.push(spr);
  if (porch) S.push(polyD([[X(s * 0.3), Y(-0.92)], [X(s * 0.74), Y(-0.92)], [X(s * 0.74), Y(-1.08)], [X(s * 0.6), Y(-1.5)], [X(s * 0.3), Y(-1.62)]], true, "cw"));
  if (spires >= 1) for (const v of [-1, 1]) { const [u, ur] = spire(X(v * 0.37), Y(-0.91), 0.2 * B, 0.94 * B, 3, 0.6); S.push(u); R.push(ur); const [a1, a1r] = amalaka(X(v * 0.37), Y(-0.91 - 0.94), 0.14 * B, 0.06 * B); S.push(a1); R.push(a1r); S.push(kalasha(X(v * 0.37), Y(-0.91 - 1.0), 0.1 * B)); }
  if (spires >= 2) for (const v of [-1, 1]) { const [u] = spire(X(v * 0.53), Y(-0.91), 0.1 * B, 0.42 * B, 2, 0.62); S.push(u); const [a1] = amalaka(X(v * 0.53), Y(-0.91 - 0.42), 0.075 * B, 0.035 * B); S.push(a1); }
  // the crown (mastaka): neck, amalaka, its little cap, the kalasha
  const yt = -0.91 - ht;
  S.push(box(X(-0.17), Y(yt + 0.01), X(0.17), Y(yt - 0.05)));
  const [am, amr] = amalaka(x, Y(yt - 0.05), 0.33 * B, 0.15 * B); S.push(am); R.push(amr);
  S.push(sym(x, [C(0.2 * B, Y(yt - 0.2)), C(0.22 * B, Y(yt - 0.215)), C(0.12 * B, Y(yt - 0.235))]));
  S.push(sym(x, [C(0.13 * B, Y(yt - 0.235)), [0.15 * B, Y(yt - 0.26)], C(0.12 * B, Y(yt - 0.285))]));
  const kh = 0.3; S.push(kalasha(x, Y(yt - 0.285), kh * B));
  at.top = [x, Y(yt - 0.285 - kh)];
  // the flag on its staff, streaming downwind
  if (flag) {
    const px = X(0.012), p0 = Y(yt - 0.285 - kh * 0.6), p1 = p0 - 0.62 * B, dir = wind >= 0 ? 1 : -1;
    S.push(box(px - 0.008 * B, p0, px + 0.008 * B, p1));
    S.push(`M ${(px + 0.03 * B).toFixed(1)} ${(p1 - 0.03 * B).toFixed(1)} A ${(0.03 * B).toFixed(1)} ${(0.03 * B).toFixed(1)} 0 1 1 ${(px - 0.03 * B).toFixed(1)} ${(p1 - 0.03 * B).toFixed(1)} A ${(0.03 * B).toFixed(1)} ${(0.03 * B).toFixed(1)} 0 1 1 ${(px + 0.03 * B).toFixed(1)} ${(p1 - 0.03 * B).toFixed(1)} Z`);
    const L = 0.46 * B, wv = (k: number) => Math.sin(t * 0.13 + k * 2.2) * 0.035 * B * (0.5 + k);
    const fl: Pt[] = [C(px, p1 + 0.01 * B), [px + dir * L * 0.35, p1 + 0.03 * B + wv(0.35)], [px + dir * L * 0.7, p1 + 0.07 * B + wv(0.7)], C(px + dir * L, p1 + 0.12 * B + wv(1)), [px + dir * L * 0.66, p1 + 0.16 * B + wv(0.66)], [px + dir * L * 0.3, p1 + 0.19 * B + wv(0.3)], C(px, p1 + 0.21 * B)];
    S.push(smooth(fl, {wind: "cw"}));
    at.flag = [px + dir * L, p1 + 0.12 * B];
  }
  // the porch (mandapa): moulded base, a seat-back parapet, pillars with open bays, an eave, a stepped pyramidal roof
  if (porch) {
    const a = 0.46, b = pxMax, lo = Math.min(X(s * a), X(s * b)), hi = Math.max(X(s * a), X(s * b));
    S.push(box(lo, Y(-0.135), hi, Y(-0.3)));
    S.push(box(lo - 0.02 * B, Y(-0.27), hi + 0.02 * B, Y(-0.305)));
    S.push(box(lo, Y(-0.3), hi, Y(-0.82)));
    // the parapet's lean, outside
    S.push(polyD([[s > 0 ? hi : lo, Y(-0.3)], [(s > 0 ? hi : lo) + s * 0.04 * B, Y(-0.46)], [s > 0 ? hi : lo, Y(-0.47)]], true, "cw"));
    // three open bays between four pillars, a bracket in each upper corner
    const cols = [0.58, 0.98, 1.38, 1.7].map((v) => X(s * v)).sort((p, q) => p - q), pw = 0.035 * B;
    for (let k = 0; k < 3; k++) {
      const x0 = cols[k] + pw, x1 = cols[k + 1] - pw;
      S.push(box(x0, Y(-0.47), x1, Y(-0.77), "ccw"));
      for (const [xx, sd] of [[x0, 1], [x1, -1]] as [number, number][]) S.push(polyD([[xx, Y(-0.77)], [xx + sd * 0.07 * B, Y(-0.77)], [xx + sd * 0.02 * B, Y(-0.735)], [xx, Y(-0.725)]], true, "cw"));
    }
    at.door = [(lo + hi) / 2, Y(-0.47)]; at.bay = [(cols[1] + cols[2]) / 2, Y(-0.62)];
    // the eave (chhajja), sloping out
    S.push(polyD([[lo - 0.1 * B, Y(-0.79)], [hi + 0.1 * B, Y(-0.79)], [hi + 0.04 * B, Y(-0.86)], [lo - 0.04 * B, Y(-0.86)]], true, "cw"));
    // the phamsana roof: five receding tiers, each a slab with a sloped top
    const pc = (lo + hi) / 2, half0 = (hi - lo) / 2 + 0.02 * B;
    for (let k = 0; k < 5; k++) {
      const yb = Y(-0.86 - k * 0.11), hw = half0 * (1 - k * 0.16), hw2 = half0 * (1 - (k + 1) * 0.16) + 0.04 * B;
      S.push(polyD([[pc - hw, yb], [pc + hw, yb], [pc + hw, yb - 0.035 * B], [pc + hw2, yb - 0.11 * B], [pc - hw2, yb - 0.11 * B], [pc - hw, yb - 0.035 * B]], true, "cw"));
      R.push(box(pc - hw, yb - 0.035 * B - 0.8, pc + hw, yb - 0.035 * B + 0.8));
    }
    const yr = Y(-0.86 - 0.55);
    // the bell (ghanta), a small amalaka, a kalasha
    S.push(sym(pc, [C(0.2 * B, yr + 0.005 * B), [0.19 * B, yr - 0.06 * B], [0.12 * B, yr - 0.15 * B], C(0.07 * B, yr - 0.19 * B)]));
    const [a2] = amalaka(pc, yr - 0.19 * B, 0.1 * B, 0.05 * B); S.push(a2);
    S.push(kalasha(pc, yr - 0.24 * B, 0.13 * B));
    // steps up to the porch
    const jx = X(s * (pxMax + 0.2));
    for (let k = 0; k < 3; k++) { const xa = jx - s * 0.02 * B, xb = jx + s * (3 - k) * 0.075 * B; S.push(box(Math.min(xa, xb), Y(-(k + 1) * 0.045), Math.max(xa, xb), Y(0), "cw")); }
  }
  at.base = [x, y];
  return piece([{d: S.join(" ")}, {d: R.join(" "), fill: RELIEF, rim: false}], at);
};

// ---------- a small shrine ----------
// x: centre, y: ground, h: height to the finial (the flag rises above it).
export const shrine = ({x, y, h, flag = false, t = 0, wind = 0}: {x: number; y: number; h: number; flag?: boolean; t?: number; wind?: number}): Piece => {
  const S: string[] = [], R: string[] = [], Y = (v: number) => y - v * h, X = (v: number) => x + v * h;
  S.push(box(X(-0.36), Y(0), X(0.36), Y(0.05)), box(X(-0.31), Y(0.05), X(0.31), Y(0.1)));
  S.push(box(X(-0.23), Y(0.1), X(0.23), Y(0.43)));
  S.push(box(X(-0.075), Y(0.1), X(0.075), Y(0.33), "ccw"));
  S.push(box(X(-0.11), Y(0.33), X(0.11), Y(0.355)));
  S.push(sym(x, [C(0.23 * h, Y(0.43)), C(0.27 * h, Y(0.44)), C(0.27 * h, Y(0.47)), C(0.21 * h, Y(0.475))]));
  R.push(box(X(-0.23), Y(0.2), X(0.23), Y(0.205)));
  const [sp, spr] = spire(x, Y(0.475), 0.21 * h, 0.36 * h, 3, 0.58); S.push(sp); R.push(spr);
  S.push(box(X(-0.08), Y(0.83), X(0.08), Y(0.85)));
  const [am, amr] = amalaka(x, Y(0.85), 0.15 * h, 0.06 * h); S.push(am); R.push(amr);
  S.push(kalasha(x, Y(0.91), 0.09 * h));
  if (flag) {
    const p0 = Y(0.95), p1 = Y(1.2), dir = wind >= 0 ? 1 : -1, L = 0.2 * h, wv = (k: number) => Math.sin(t * 0.13 + k * 2.2) * 0.016 * h * (0.5 + k);
    S.push(box(x - 0.005 * h, p0, x + 0.005 * h, p1));
    S.push(smooth([C(x, p1), [x + dir * L * 0.5, p1 + 0.02 * h + wv(0.5)], C(x + dir * L, p1 + 0.05 * h + wv(1)), [x + dir * L * 0.5, p1 + 0.075 * h + wv(0.5)], C(x, p1 + 0.09 * h)], {wind: "cw"}));
  }
  return piece([{d: S.join(" ")}, {d: R.join(" "), fill: RELIEF, rim: false}], {door: [x, Y(0.1)], lamp: [x, Y(0.16)], top: [x, Y(1)]});
};

// ---------- the carved pillar ----------
// x: centre, y: floor, h: height to the top of the bracket; w: the shaft's width (default 0.13 h).
export const pillarHalf = (h: number, w: number): Pt[] => {
  const H = (v: number) => -v * h, Wd = (v: number) => v * w;
  return [
    C(Wd(0.78), H(0)), C(Wd(0.78), H(0.045)), C(Wd(0.7), H(0.05)),
    // the lotus base: petal tips curling out over a bell
    [Wd(0.76), H(0.062)], C(Wd(0.72), H(0.07)), [Wd(0.66), H(0.088)], C(Wd(0.68), H(0.094)), [Wd(0.6), H(0.115)], C(Wd(0.52), H(0.135)),
    C(Wd(0.56), H(0.14)), C(Wd(0.56), H(0.152)), C(Wd(0.5), H(0.156)),
    // the square shaft, a fillet, the octagonal shaft
    C(Wd(0.5), H(0.42)), C(Wd(0.56), H(0.425)), C(Wd(0.56), H(0.44)), C(Wd(0.46), H(0.445)), C(Wd(0.46), H(0.6)),
    // pot and foliage (ghatapallava): the pot swells, leaves droop over its shoulders
    [Wd(0.56), H(0.63)], [Wd(0.6), H(0.67)], C(Wd(0.66), H(0.69)), [Wd(0.62), H(0.71)], C(Wd(0.64), H(0.725)), C(Wd(0.4), H(0.74)),
    // neck, cushion (the round kumbha capital), abacus
    C(Wd(0.4), H(0.765)), [Wd(0.56), H(0.79)], [Wd(0.6), H(0.82)], C(Wd(0.5), H(0.85)), C(Wd(0.72), H(0.855)), C(Wd(0.72), H(0.885)), C(Wd(0.52), H(0.885)),
    // the bracket (potika): rolled corbels stepping out, a lotus bud hanging at the tip
    [Wd(0.7), H(0.9)], C(Wd(0.85), H(0.895)), [Wd(1.0), H(0.915)], C(Wd(1.15), H(0.91)), [Wd(1.3), H(0.93)], C(Wd(1.45), H(0.925)),
    [Wd(1.52), H(0.905)], C(Wd(1.56), H(0.89)), [Wd(1.62), H(0.905)], C(Wd(1.66), H(0.94)),
    C(Wd(1.68), H(0.975)), C(Wd(1.7), H(1.0)), C(Wd(0), H(1.0)),
  ];
};
export const pillar = ({x, y, h, w}: {x: number; y: number; h: number; w?: number}): Piece => {
  const ww = w ?? h * 0.13, half = pillarHalf(h, ww).map((p) => [p[0], y + p[1], p[2]] as Pt);
  half.pop();
  const R: string[] = [];
  for (const v of [0.152, 0.42, 0.44, 0.6, 0.74, 0.85]) R.push(box(x - ww * 0.5, y - v * h - 0.8, x + ww * 0.5, y - v * h + 0.8));
  R.push(box(x - ww * 0.06, y - 0.16 * h, x + ww * 0.06, y - 0.41 * h));
  for (const v of [-0.3, 0.3]) R.push(box(x + v * ww - 0.6, y - 0.45 * h, x + v * ww + 0.6, y - 0.6 * h));
  return piece([{d: sym(x, half)}, {d: R.join(" "), fill: RELIEF, rim: false}], {top: [x, y - h], base: [x, y]});
};

// ---------- the cusped arch ----------
// A gateway: x centre, y floor, w overall width, h height to the top of the lintel; lobes: the foils of the arch.
export const cuspedArch = ({x, y, w, h, lobes = 7}: {x: number; y: number; w: number; h: number; lobes?: number}): Piece => {
  const S: string[] = [], R: string[] = [];
  const pw = w * 0.13, ph = h * 0.82;
  for (const v of [-1, 1]) { const p = pillar({x: x + v * (w / 2 - pw * 0.8), y, h: ph, w: pw}); S.push((p[0] as any).d); R.push((p[1] as any).d); }
  // the lintel, its cornice, a crest of small finials
  S.push(box(x - w / 2 - w * 0.03, y - ph, x + w / 2 + w * 0.03, y - h * 0.92));
  S.push(box(x - w / 2 - w * 0.05, y - h * 0.92, x + w / 2 + w * 0.05, y - h * 0.95));
  S.push(box(x - w / 2 - w * 0.02, y - h * 0.95, x + w / 2 + w * 0.02, y - h));
  for (let k = 0; k <= 6; k++) { const xx = x - w / 2 + (w * k) / 6; S.push(kalasha(xx, y - h, h * (k % 3 === 0 ? 0.08 : 0.05))); }
  R.push(box(x - w / 2, y - h * 0.86, x + w / 2, y - h * 0.865));
  // the arch: the solid spandrel between the pillars, its lower edge a chain of foils with sharp cusps between
  const xl = x - w / 2 + pw * 1.55, xr = x + w / 2 - pw * 1.55, ys = y - ph * 0.62, top = y - ph;
  const rx = (xr - xl) / 2, ry = Math.min(rx * 1.1, (ys - top) * 0.92), cx = (xl + xr) / 2;
  const P: number[][] = [];
  for (let i = 0; i <= lobes; i++) { const a = Math.PI + (i / lobes) * Math.PI; P.push([cx + Math.cos(a) * rx, ys + Math.sin(a) * ry]); }
  const edge: Pt[] = [C(xl, top), C(xr, top), C(xr, ys)];
  for (let i = lobes; i > 0; i--) {
    const a = P[i], b = P[i - 1], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, ch = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let nx = mx - cx, ny = my - ys; const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
    for (let k = 1; k < 6; k++) { const u = k / 6, bulge = Math.sin(u * Math.PI) * ch * 0.42; edge.push([a[0] + (b[0] - a[0]) * u + nx * bulge, a[1] + (b[1] - a[1]) * u + ny * bulge]); }
    edge.push(C(b[0], b[1]));
  }
  S.push(smooth(edge, {wind: "cw"}));
  return piece([{d: S.join(" ")}, {d: R.join(" "), fill: RELIEF, rim: false}], {sill: [x, y], top: [x, y - h], apex: [cx, ys - ry]});
};

// ---------- the devakoshta (wall niche) ----------
// x: centre, y: the niche's sill, w, h: the opening. wall: [x0, y0, x1, y1] a plain ashlar wall around it; the opening is
// then a real hole in the wall (draw the lit back of the niche, or a lamp's glow, behind the Rimmed) and the frame is a
// lighter tint of stone set on the wall. Without a wall the frame itself is the silhouette.
export const niche = ({x, y, w, h, wall, courses = true, seed = 0}: {x: number; y: number; w: number; h: number; wall?: [number, number, number, number]; courses?: boolean; seed?: number}): Piece => {
  const S: string[] = [], F: string[] = [], R: string[] = [];
  const pw = w * 0.16, fx0 = x - w / 2 - pw, fx1 = x + w / 2 + pw;
  // the frame's footprint, kept clear of the wall's joints
  const fb = [fx0 - pw * 0.7, y - h * 1.98, fx1 + pw * 0.7, y + h * 0.12];
  if (wall) {
    S.push(box(wall[0], wall[1], wall[2], wall[3]));
    // the opening, cut through the wall (counter-clockwise): up to the lintel; the cusped top is part of the frame
    S.push(box(x - w / 2, y, x + w / 2, y - h * 1.02, "ccw"));
    if (courses) {
      // ashlar courses: joints as relief lines, staggered, stopping at the frame
      const ch = h * 0.2, seg = (xa: number, xb: number, yy: number) => { if (xb - xa > 1) R.push(box(xa, yy - 0.7, xb, yy + 0.7)); };
      for (let yy = wall[3] - ch, r = 0; yy > wall[1] + 2; yy -= ch, r++) {
        if (yy > fb[1] && yy < fb[3]) { seg(wall[0], fb[0], yy); seg(fb[2], wall[2], yy); } else seg(wall[0], wall[2], yy);
        for (let xx = wall[0] + (r % 2 ? ch * 1.1 : 0) + ch * 2.2 * rnd(r, seed); xx < wall[2]; xx += ch * (1.8 + 0.8 * rnd(r * 13 + xx, seed + 1))) {
          if (xx > fb[0] && xx < fb[2] && yy - ch < fb[3] && yy > fb[1]) continue;
          R.push(box(xx - 0.7, yy - ch, xx + 0.7, yy));
        }
      }
    }
  }
  // the sill moulding, the pilasters with their bases and bracket capitals, the lintel and cornice
  F.push(box(fx0 - pw * 0.4, y, fx1 + pw * 0.4, y + h * 0.07), box(fx0 - pw * 0.6, y + h * 0.07, fx1 + pw * 0.6, y + h * 0.11));
  for (const v of [-1, 1]) {
    const px = x + v * (w / 2 + pw / 2), half = pillarHalf(h * 1.02, pw).map((p) => [p[0], y + p[1], p[2]] as Pt);
    half.pop(); F.push(sym(px, half));
  }
  // the cusped top of the opening: a tympanum whose lower edge is a chain of foils with sharp cusps between them
  const ys = y - h * 0.84, lobes = 5, arch = (u: number) => ys - Math.sin(Math.PI * u) * h * 0.12;
  const tp: Pt[] = [C(x - w / 2 - 0.5, y - h * 1.03), C(x + w / 2 + 0.5, y - h * 1.03), C(x + w / 2 + 0.5, ys)];
  for (let i = 0; i < lobes; i++) {
    const a0 = i / lobes, a1 = (i + 1) / lobes;
    for (let k = 1; k < 4; k++) { const u = a0 + (a1 - a0) * (k / 4); tp.push([x + w / 2 - w * u, arch(u) - Math.sin((k / 4) * Math.PI) * w * 0.075]); }
    tp.push(C(x + w / 2 - w * a1, arch(a1)));
  }
  tp[tp.length - 1] = C(x - w / 2 - 0.5, ys);
  F.push(smooth(tp, {wind: "cw"}));
  F.push(box(fx0 - pw * 0.3, y - h * 1.02, fx1 + pw * 0.3, y - h * 1.1));
  F.push(box(fx0 - pw * 0.55, y - h * 1.1, fx1 + pw * 0.55, y - h * 1.15));
  // the pediment: a miniature shikhara with its amalaka and kalasha (the niche as a little temple)
  const [sp, spr] = spire(x, y - h * 1.15, w / 2 + pw * 0.6, h * 0.62, 3, 0.52); F.push(sp); R.push(spr);
  const [am, amr] = amalaka(x, y - h * 1.77, w * 0.3, h * 0.07); F.push(am); R.push(amr);
  F.push(kalasha(x, y - h * 1.84, h * 0.12));
  const at = {sill: [x, y], lamp: [x, y - h * 0.3], top: [x, y - h * 1.96], inner: [x - w / 2, y - h * 0.96]} as Record<string, [number, number]>;
  if (!wall) return piece([{d: F.join(" ")}, {d: R.join(" "), fill: RELIEF, rim: false}], at);
  return piece([{d: S.join(" ")}, {d: F.join(" "), fill: RELIEF, rim: false}, {d: R.join(" "), fill: RELIEF_LT, rim: false}], at);
};

// ---------- ghat steps ----------
// side: the flight in profile from (x0, y0) at the top down to (x1, y1) at the water: n shallow steps with a landing
// every `landing` steps, the treads not quite level, the nosings chipped and here and there broken back; the mass closes
// down to `bottom`. front: the flight seen from the river: a broad block whose sides step out as they descend, the
// treads a lighter tint than the risers (they face the sky), their lips chipped, the landings deeper.
export const ghat = ({x0, y0, x1, y1, n = 14, seed = 0, view = "side", bottom, landing = 5}: {x0: number; y0: number; x1: number; y1: number; n?: number; seed?: number; view?: "side" | "front"; bottom?: number; landing?: number}): Piece => {
  const isLand = (i: number) => landing > 0 && i > 0 && i % landing === 0;
  if (view === "side") {
    const dir = x1 >= x0 ? 1 : -1, yb = bottom ?? y1 + Math.abs(y1 - y0) / n * 3;
    const wts = Array.from({length: n}, (_, i) => (isLand(i) ? 2.6 : 1) * (0.92 + 0.16 * rnd(i, seed + 9))), tot = wts.reduce((a, b) => a + b, 0);
    const rise = (y1 - y0) / n, ar = Math.abs(rise);
    const P: Pt[] = [C(x0 - dir * Math.abs(x1 - x0) * 0.08, y0)];
    let xs = x0;
    for (let i = 0; i < n; i++) {
      const run = ((x1 - x0) * wts[i]) / tot, ys = y0 + rise * i + (rnd(i, seed + 1) - 0.5) * ar * 0.12, ch = rnd(i, seed);
      // the tread (a hollow worn in its middle on the long ones), the nosing chipped or broken back, the riser
      if (wts[i] > 2) P.push([xs + run * 0.5, ys + ar * 0.06]);
      if (ch < 0.4) { const cw = 0.18 + 0.2 * rnd(i, seed + 2); P.push(C(xs + run * (1 - cw), ys), C(xs + run * (1 - cw * 0.5), ys + ar * (0.2 + 0.3 * ch)), C(xs + run, ys + ar * (0.45 + 0.3 * ch))); }
      else if (ch < 0.55) P.push(C(xs + run * 0.96, ys), C(xs + run, ys + ar * 0.15));
      else P.push(C(xs + run, ys));
      P.push(C(xs + run + dir * ar * 0.04, ys + rise));
      xs += run;
    }
    P.push(C(x1 + dir * Math.abs(x1 - x0) * 0.08, y1), C(x1 + dir * Math.abs(x1 - x0) * 0.08, yb), C(x0 - dir * Math.abs(x1 - x0) * 0.08, yb));
    return piece([{d: smooth(P, {wind: "cw"})}], {top: [x0, y0], water: [x1, y1]});
  }
  // the front view
  const body: Pt[] = [], treads: string[] = [], dk: string[] = [], step = (y1 - y0) / n, flare = Math.abs(x1 - x0) * 0.004;
  const right: Pt[] = [], left: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const yt = y0 + step * i, xl = x0 - flare * i, xr = x1 + flare * i;
    right.push(C(xr, yt), C(xr, yt + step));
    left.push(C(xl, yt + step), C(xl, yt));
    // the tread: a lighter band along the step's top, its lip chipped (notches) and here and there a broken corner
    const th = step * (isLand(i) ? 0.62 : 0.36), ns = 22, lip: Pt[] = [C(xl + 1.5, yt + th)];
    for (let j = 0; j <= ns; j++) {
      const xx = xl + 1.5 + ((xr - xl - 3) * j) / ns, chip = rnd(i * 31 + j, seed + 5) < 0.09 ? th * (0.35 + 0.35 * rnd(j, seed + i)) : 0;
      lip.push(C(xx, yt + 1.2 + chip));
    }
    lip.push(C(xr - 1.5, yt + th));
    treads.push(smooth(lip, {wind: "cw"}));
    // a dark crack or two down the riser
    if (rnd(i, seed + 7) < 0.35) { const cx = xl + (xr - xl) * rnd(i, seed + 8); dk.push(polyD([[cx, yt + th], [cx + step * 0.12, yt + th + step * 0.3], [cx + step * 0.05, yt + step], [cx - 0.8, yt + step], [cx + step * 0.06, yt + th + step * 0.3], [cx - 0.8, yt + th]], true, "cw")); }
  }
  body.push(...right, ...left.reverse());
  return piece([{d: polyD(body as number[][], true, "cw")}, {d: treads.join(" "), fill: RELIEF_LT, rim: false}, {d: dk.join(" "), fill: "#0E0714", rim: false}],
    {top: [(x0 + x1) / 2, y0], water: [(x0 + x1) / 2, y1]});
};

// ---------- a moulded ledge ----------
// x0..x1 along y (the top of the ledge), h deep: the cornice slab with its curved drip (kapota), a recessed fillet, the
// round torus (kumuda), a fillet and the plinth face; chipped along its top edge; the ends show the profile. wall: the
// depth of plain wall below the moulding (default 0: the moulding alone, a shelf or the lip of a platform).
export const ledge = ({x0, x1, y, h, seed = 0, chips = true, wall = 0}: {x0: number; x1: number; y: number; h: number; seed?: number; chips?: boolean; wall?: number}): Piece => {
  const S: string[] = [], R: string[] = [];
  // the profile at the right end: [out, down] in units of h (out > 0 projects past the wall face at x1)
  const prof: [number, number][] = [[0.16, 0], [0.18, 0.03], [0.18, 0.13], [0.15, 0.22], [0.09, 0.3], [0.03, 0.33], [0.0, 0.36], [0.0, 0.43], [0.05, 0.47], [0.09, 0.55], [0.1, 0.62], [0.08, 0.7], [0.03, 0.76], [0.04, 0.8], [0.04, 0.86], [0.0, 0.88], [0.0, 1 + wall / h]];
  const top: Pt[] = [];
  const ns = Math.max(4, Math.round((x1 - x0) / (h * 0.45)));
  for (let j = 0; j <= ns; j++) { const xx = x0 - 0.16 * h + ((x1 - x0 + 0.32 * h) * j) / ns, chip = chips && j > 0 && j < ns && rnd(j, seed + 3) < 0.2 ? h * 0.07 * (0.5 + rnd(j, seed + 4)) : 0; top.push(C(xx, y + chip)); }
  const right: Pt[] = prof.slice(1).map(([dx, dy]) => [x1 + dx * h, y + dy * h] as Pt), left: Pt[] = prof.slice(1).reverse().map(([dx, dy]) => [x0 - dx * h, y + dy * h] as Pt);
  [right[right.length - 1], left[0]] = [C(right[right.length - 1][0], right[right.length - 1][1]), C(left[0][0], left[0][1])];
  S.push(smooth([...top, ...right, ...left], {wind: "cw"}));
  // the faces as relief: the slab's lit upper face, the shadow under the drip, the torus's lit crown
  R.push(box(x0 - 0.16 * h, y + h * 0.035, x1 + 0.16 * h, y + h * 0.06));
  R.push(box(x0 - 0.06 * h, y + h * 0.5, x1 + 0.06 * h, y + h * 0.56));
  R.push(box(x0, y + h * 0.82, x1, y + h * 0.84));
  return piece([{d: S.join(" ")}, {d: R.join(" "), fill: RELIEF_LT, rim: false}], {left: [x0, y], right: [x1, y]});
};
export const ARCH = {temple, shrine, cuspedArch, pillar, niche, ghat, ledge};
