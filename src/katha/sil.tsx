// Silhouettes with a rim of light (21 Oct 2026). A shape is drawn three times: as a clip, in the rim colour, and in the
// dark colour nudged away from the light inside the clip, which leaves a thin crescent of light on the side facing it.
// Horses are traced from the CC0 horse by Quaternius (scripts/katha/trace_glb.py: gallop, played as slow motion, and the
// standing idle); birds are drawn in code (scripts/katha/birds.py). Sources and licences: sil/LICENSES.md. Every sil/*.json
// names its source in "credit", and scripts/katha/build_film.py refuses to clear a film if any of them is non-commercial.
import React, {useId} from "react";
import {K} from "./look";
import horseJ from "./sil/horse.json";
import flamingoJ from "./sil/flamingo.json";
import storkJ from "./sil/stork.json";
import parrotJ from "./sil/parrot.json";
import standJ from "./sil/horse_stand.json";
import {krishnaTeach, krishnaDrive, arjuna, ratha, wheel, gandiva} from "./figures";

type Cycle = {frames: string[]; anchors?: Record<string, [number, number]>[]; cycle_sec: number};
export const CYCLES: Record<string, Cycle> = {horse: horseJ as any, stand: standJ as any, flamingo: flamingoJ as any, stork: storkJ as any, parrot: parrotJ as any};
export const frameOf = (c: Cycle, f: number, speed = 1, phase = 0) => {
  const n = c.frames.length, i = Math.floor(((f / 30) * speed / c.cycle_sec + phase) * n);
  return ((i % n) + n) % n;
};
// Paths in one local frame, drawn as one rim-lit silhouette. light: the direction the light comes FROM (unit-ish vector).
// How it works: the items are drawn in the rim colour, then again in their dark fill nudged w away from the light, which
// leaves a crescent of light only on the side facing the light (the shape grows by w on its shadow side, unseen).
// 22 Oct 2026: no clip by default. The old clip (the union of the items) made Chrome drop parts of the dark pass on
// complex silhouettes (trees with hundreds of leaves rendered half gold); clip={true} restores it for simple shapes
// whose exact outline matters.
// Rules and caveats (22 Oct 2026):
// - ONE light per scene. Every Rimmed in a shot takes its light from the same source; never rim both sides of a shape.
// - `light` (and `w`) are in the Rimmed's own coordinates, i.e. inside `transform`. A flipped transform (scale(-1 1))
//   flips the light too: pass [-lx, ly] when you mirror a shape. Item transforms (`t`) do not rotate the light.
// - `point`: the light as a POINT in the same coordinates (a lamp in the middle of a hall). Each item then turns its
//   rim towards it (its centre is `c` if given, else estimated from its path). Overrides `light`.
// - Winding: inside ONE item (one path string with several subpaths) overlapping subpaths of opposite winding cancel
//   under the nonzero rule and cut holes. Build joined shapes with smooth(pts, {wind: "cw"}), ribbon(..., "cw"), band()
//   or polyD(pts, true, "cw"); cut a deliberate hole with the opposite winding ("ccw"). Separate items always union.
// - glow: a soft bloom of the rim colour on the lit side only, made of a few wider, faint, offset copies (no filter).
// - Per item: `rim: false` draws the item flat (no rim of its own: carved relief, courses, a lighter tint inside the
//   shape, which would otherwise show a gold line wherever it pokes past the body); `rw` scales the rim width for that
//   item (0.5 for fine leaves and leaflets that would otherwise turn all gold).
export type Item = string | {d: string; t?: string; fill?: string; c?: [number, number]; rim?: boolean; rw?: number};
type It = {d: string; t?: string; fill?: string; c?: [number, number]; rim?: boolean; rw?: number};
// Rough centre of a path (bounding box of its end points; absolute and relative commands), after a simple
// "translate(a b) scale(s [s2])" item transform. Used only for point lights.
const pathCentre = (d: string, t?: string): [number, number] => {
  const tok = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  let x = 0, y = 0, sx = 0, sy = 0, cmd = "M", i = 0, x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  const num = () => +tok[i++];
  const see = () => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
  const ARGS: Record<string, number> = {M: 2, L: 2, T: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, A: 7, Z: 0};
  while (i < tok.length) {
    if (/[a-zA-Z]/.test(tok[i])) { cmd = tok[i++]; if (cmd === "z" || cmd === "Z") { x = sx; y = sy; continue; } }
    const U = cmd.toUpperCase(), rel = cmd !== U, k = ARGS[U] ?? 2;
    if (k === 0 || i + k > tok.length) { i++; continue; }
    const v = Array.from({length: k}, num), bx = rel ? x : 0, by = rel ? y : 0;
    if (U === "H") x = bx + v[0]; else if (U === "V") y = by + v[0]; else { x = bx + v[k - 2]; y = by + v[k - 1]; }
    if (U === "M") { sx = x; sy = y; cmd = rel ? "l" : "L"; }
    see();
  }
  let c: [number, number] = x0 > x1 ? [0, 0] : [(x0 + x1) / 2, (y0 + y1) / 2];
  if (t) {
    const tr = t.match(/translate\(\s*(-?[\d.]+)[ ,]+(-?[\d.]+)\s*\)/), sc = t.match(/scale\(\s*(-?[\d.]+)(?:[ ,]+(-?[\d.]+))?\s*\)/);
    const s1 = sc ? +sc[1] : 1, s2 = sc ? +(sc[2] ?? sc[1]) : 1;
    c = [c[0] * s1 + (tr ? +tr[1] : 0), c[1] * s2 + (tr ? +tr[2] : 0)];
  }
  return c;
};
export const Rimmed: React.FC<{paths: Item[]; transform?: string; fill?: string; rim?: string; light: [number, number]; w?: number; evenodd?: boolean; glow?: number; point?: [number, number]; clip?: boolean}> =
  ({paths, transform, fill = K.sil, rim = K.rim, light, w = 4, evenodd = false, glow = 0, point, clip = false}) => {
  const id = "rm" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const fr = evenodd ? "evenodd" : "nonzero";
  const items = paths.map((p) => (typeof p === "string" ? {d: p} : p)) as It[];
  // the unit direction towards the light, per item
  const unit = (v: [number, number]): [number, number] => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
  const L0 = unit(light);
  const dirs: [number, number][] = items.map((it) => {
    if (!point) return L0;
    const c = it.c ?? pathCentre(it.d, it.t);
    return unit([point[0] - c[0], point[1] - c[1]]);
  });
  const one = (it: It, col: string | null, key: string, extra?: React.SVGProps<SVGPathElement>) =>
    <path key={key} d={it.d} transform={it.t} fill={col ?? it.fill ?? fill} fillRule={fr} clipRule={fr} {...extra}/>;
  const lit = (it: It) => it.rim !== false;
  // one pass: the items (those `use` keeps), each moved k rim-widths along its light direction (+ towards the light,
  // - away from it); neighbours that move alike share one group, so a plain silhouette stays one <g>
  const pass = (col: string | null, key: string, k: number, use: (it: It) => boolean, extra?: React.SVGProps<SVGPathElement>) => {
    const groups: {tr: string; kids: React.ReactElement[]}[] = [];
    items.forEach((it, i) => {
      if (!use(it)) return;
      const s = w * k * (it.rw ?? 1), tr = `translate(${(dirs[i][0] * s).toFixed(2)} ${(dirs[i][1] * s).toFixed(2)})`;
      const g = groups[groups.length - 1];
      if (g && g.tr === tr) g.kids.push(one(it, col, key + i, extra)); else groups.push({tr, kids: [one(it, col, key + i, extra)]});
    });
    return groups.map((g, j) => <g key={key + "g" + j} transform={k === 0 ? undefined : g.tr}>{g.kids}</g>);
  };
  // the bloom: three faint copies, each a little wider and pushed further towards the light; the push is always more
  // than half the stroke, so nothing shows on the shadow side
  const bloom = glow > 0 ? ([[1.4, 0.2], [2.6, 0.11], [4.2, 0.055]] as [number, number][]).map(([k, o], j) =>
    <g key={"gl" + j} opacity={Math.min(1, o * glow)}>{pass(rim, "g" + j, k * 0.62, lit, {stroke: rim, strokeWidth: w * k * 0.9, strokeLinejoin: "round"})}</g>) : null;
  return (
    <g transform={transform}>
      {clip ? <defs><clipPath id={id}>{items.filter(lit).map((it, i) => one(it, "#000", "c" + i))}</clipPath></defs> : null}
      {bloom}
      {pass(rim, "r", 0, lit)}
      <g clipPath={clip ? `url(#${id})` : undefined}>{pass(null, "f", -1, () => true)}</g>
    </g>
  );
};
// A galloping horse (facing right) as a path item; x, y = the ground point under the barrel; scale 1 = ~210 px tall.
export const horseItem = (x: number, y: number, scale: number, f: number, speed = 1, phase = 0, fill?: string, stand = false): Item => {
  const c = stand ? CYCLES.stand : CYCLES.horse;
  return {d: c.frames[frameOf(c, f, speed, phase)], t: `translate(${x} ${y}) scale(${scale})`, fill};
};
export const Horse: React.FC<{x: number; y: number; scale: number; f: number; speed?: number; phase?: number; light: [number, number]; fill?: string}> =
  ({x, y, scale, f, speed = 1, phase = 0, light, fill = K.silHorse}) => <Rimmed paths={[horseItem(x, y, scale, f, speed, phase)]} fill={fill} light={light} w={4}/>;
export const horseAnchor = (f: number, speed = 1, phase = 0, key = "mouth", stand = false) => { const c = stand ? CYCLES.stand : CYCLES.horse, i = frameOf(c, f, speed, phase); return c.anchors ? c.anchors[i][key] : [0, 0]; };
// A bird in flight (facing right unless flip).
export const Bird: React.FC<{kind?: "flamingo" | "stork" | "parrot"; x: number; y: number; scale: number; f: number; speed?: number; phase?: number; light?: [number, number]; fill?: string; flip?: boolean}> =
  ({kind = "stork", x, y, scale, f, speed = 1, phase = 0, light, fill = K.sil, flip = false}) => {
  const c = CYCLES[kind], i = frameOf(c, f, speed, phase), tr = `translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`;
  return light ? <Rimmed paths={[c.frames[i]]} transform={tr} fill={fill} light={[flip ? -light[0] : light[0], light[1]]} w={2.5 / scale}/> : <path d={c.frames[i]} transform={tr} fill={fill}/>;
};
export {krishnaTeach, krishnaDrive, arjuna, ratha, wheel, gandiva};
