// Indica Atlas week 2: kuttanad. Script lines: scripts/geo/week2.py; sources: docs/geo/week2/drafts/kuttanad.md.
// Map care: Kuttanad has no single official outline, so it is drawn as a dashed "approx." region south and east of
// Vembanad Lake. Bunds and rivers are schematic and labelled so. The Netherlands is a bigtext only (no map of Europe).
import {Spec, Layer, C} from "../engine/GeoShort";

type P = [number, number];
const MUD = "#C8894A";
// Kuttanad, approximate soft region (Alappuzha / Kottayam / Pathanamthitta lowlands south and east of the lake)
const KUT: P[] = [[76.33, 9.55], [76.40, 9.61], [76.48, 9.62], [76.56, 9.55], [76.61, 9.43], [76.59, 9.30], [76.51, 9.22],
  [76.41, 9.22], [76.35, 9.29], [76.33, 9.42]];
// Southern Vembanad Lake (approximate water outline for highlighting)
const LAKE: P[] = [[76.36, 9.82], [76.41, 9.81], [76.44, 9.71], [76.45, 9.60], [76.43, 9.53], [76.39, 9.52], [76.36, 9.58], [76.37, 9.70]];
// Bunded patches (schematic): slightly uneven loops
const loop = ([x, y]: P, k: number): P[] => {
  const a = 0.045, b = 0.035, j = (k % 3 - 1) * 0.006;
  return [[x - a, y - b + j], [x + a - j, y - b], [x + a, y + b - j], [x - a + j, y + b], [x - a, y - b + j]];
};
const PATCH: P[] = [[76.40, 9.49], [76.50, 9.50], [76.45, 9.40], [76.55, 9.40], [76.40, 9.31], [76.50, 9.30], [76.58, 9.32]];
const BUNDS = PATCH.map(loop);
// Five rivers into the basin from the Western Ghats side (schematic directions only)
const RIVERS: P[][] = [[[76.86, 9.86], [76.64, 9.80], [76.46, 9.76]], [[76.86, 9.66], [76.66, 9.63], [76.50, 9.60]],
  [[76.86, 9.49], [76.70, 9.46], [76.60, 9.45]], [[76.86, 9.34], [76.72, 9.33], [76.61, 9.35]], [[76.86, 9.18], [76.70, 9.21], [76.60, 9.26]]];

const CLOSE = {lon: 76.45, lat: 9.47, span: 0.9};
export const kuttanad: Spec = {
  id: "kuttanad", globe: {lon: 4.9, lat: 52.37}, handoff: {lon: 76.5, lat: 9.6, span: 5}, hi: true,
  cams: [{in: "b1", dt: 1.65, dur: 1.2, cam: {lon: 76.45, lat: 9.5, span: 3}}, {in: "b2", cam: CLOSE},
    {in: "b4", dt: 0.1, dur: 2.4, cam: {lon: 76.44, lat: 9.52, span: 0.85}}, {in: "b5", cam: CLOSE},
    {in: "b7", dur: 1.6, cam: {lon: 76.46, lat: 9.44, span: 1.05}}, {in: "b8", cam: {lon: 76.5, lat: 9.47, span: 1.0}},
    {in: "b9", dt: 0.2, dur: 1.6, cam: {lon: 76.45, lat: 9.5, span: 3.2}}],
  layers: [
    // b1 hook: on screen from frame 0
    {in: "b1", kind: "bigtext", text: "2 m BELOW", sub: "sea level · and rice grows here", stamp: true, size: 170},
    // b2 where
    {in: "b2", dt: 0.7, out: "b2", kind: "pin", at: [76.45, 9.40], text: "KUTTANAD", color: C.amber},
    {in: "b2", dt: 0.9, out: "b4", kind: "label", at: [76.15, 9.75], text: "ARABIAN SEA", size: 44, color: C.cyan},
    // b3 about half below sea level
    {in: "b3", out: "b3", kind: "fill", poly: KUT, color: C.amber, alpha: 0.3, dashed: true},
    {in: "b3", dt: 0.3, out: "b3", kind: "label", at: [76.47, 9.42], text: "KUTTANAD", sub: "approx.", color: C.amber, size: 54},
    {in: "b3", dt: 0.2, kind: "bigtext", text: "~HALF", sub: "of the land lies below sea level", size: 170},
    // b4 old lake floor
    {in: "b4", out: "b8", kind: "fill", poly: LAKE, color: C.cyan, alpha: 0.3},
    {in: "b4", dt: 0.2, out: "b4", kind: "label", at: [76.40, 9.70], text: "VEMBANAD LAKE", color: C.cyan, size: 50},
    {in: "b4", dt: 0.3, out: "b4", outAt: -1.3, kind: "fill", poly: KUT, color: C.cyan, alpha: 0.45, dashed: true},
    {in: "b4", dt: 0.4, out: "b4", outAt: -1.3, kind: "label", at: [76.47, 9.40], text: "LAKE FLOOR", sub: "once (illustrative)", color: C.cyan, size: 54},
    {in: "b4", dt: 1.5, out: "b4", kind: "fill", poly: KUT, color: C.green, alpha: 0.45, dashed: true},
    {in: "b4", dt: 1.6, out: "b4", kind: "label", at: [76.47, 9.40], text: "RICE FIELDS", sub: "now", color: C.green, size: 54},
    // b5 bunds draw on, one by one
    {in: "b5", dt: 0.1, kind: "bigtext", text: "1800s", sub: "mud walls (bunds) in the lake", size: 160},
    ...BUNDS.map((pts, i): Layer => ({in: "b5", dt: 0.4 + i * 0.45, out: "b8", kind: "line", pts, color: MUD, width: 9, draw: 0.6})),
    {in: "b5", dt: 0.6, out: "b7", kind: "label", at: [76.22, 9.30], text: "bunds: schematic", size: 40},
    // b6 pump out, plant rice
    ...BUNDS.map((pts, i): Layer => ({in: "b6", dt: i * 0.05, out: "b6", outAt: -1.5, kind: "fill", poly: pts, color: C.cyan, alpha: 0.55})),
    ...BUNDS.map((pts, i): Layer => ({in: "b6", dt: 1.2 + i * 0.12, out: "b8", kind: "fill", poly: pts, color: C.green, alpha: 0.6})),
    {in: "b6", dt: 0.1, kind: "bigtext", text: "PUMP OUT", sub: "then plant rice", size: 150},
    // b7 Dutch polders: bigtext only
    {in: "b7", dt: 0.1, kind: "bigtext", text: "LIKE DUTCH POLDERS", sub: "the Netherlands: the same idea", size: 112},
    // b8 five rivers test the walls
    ...RIVERS.map((pts, i): Layer => ({in: "b8", dt: 0.2 + i * 0.25, out: "b8", kind: "line", pts, color: C.cyan, width: 10, arrow: true, draw: 0.7})),
    {in: "b8", dt: 0.4, out: "b8", kind: "label", at: [76.22, 9.25], text: "rivers: schematic", size: 40, color: C.cyan},
    {in: "b8", dt: 0.1, kind: "bigtext", text: "5 RIVERS", sub: "every monsoon", stamp: true, size: 160},
    ...BUNDS.map((pts, i): Layer => ({in: "b8", dt: 1.4 + i * 0.08, out: "b8", kind: "line", pts, color: C.red, width: 9, draw: 0.4})),
    // b9 heritage, pull back
    {in: "b9", dt: 0.4, kind: "fill", poly: KUT, color: C.green, alpha: 0.4, dashed: true},
    {in: "b9", dt: 1.2, kind: "label", at: [76.47, 9.13], text: "KUTTANAD", sub: "approx.", color: C.green, size: 50},
    {in: "b9", dt: 0.1, kind: "bigtext", text: "WORLD FARMING HERITAGE", sub: "UN FAO · since 2013", size: 76},
  ],
  question: "Would you farm two metres below the sea? 👇", credit: "Sources: FAO GIAHS · Ramakumar 2023 · Kerala Tourism",
};
