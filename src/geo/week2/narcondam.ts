// Indica Atlas week 2: narcondam. Script lines: scripts/geo/week2.py; sources: docs/geo/week2/drafts/narcondam.md.
// Narcondam: N13°27'53" E94°16'41" (UNESCO tentative list 5914). It is not in geo.json, so its outline is a simplified ellipse of 6.8 km².
// The hornbill is drawn in code (simple silhouette, not traced from any photo). Range bubbles, arrows and the branching line are illustrative.
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const N: P = [94.278, 13.465];
const KX = 1 / 108.26, KY = 1 / 110.6;   // degrees per km at 13.5°N (lon, lat)
const at = (dxKm: number, dyKm: number): P => [N[0] + dxKm * KX, N[1] + dyKm * KY];
const ell = (aKm: number, bKm: number, cx = 0, cy = 0, n = 48): P[] =>
  Array.from({length: n}).map((_, i) => at(cx + aKm * Math.cos((i / n) * 2 * Math.PI), cy + bKm * Math.sin((i / n) * 2 * Math.PI)));
const rect = (x0: number, y0: number, w: number, h: number): P[] => [at(x0, y0), at(x0 + w, y0), at(x0 + w, y0 + h), at(x0, y0 + h)];
const ISLAND = ell(1.65, 1.31);   // π·1.65·1.31 ≈ 6.8 km², outline simplified
const loop = (p: P[]): P[] => [...p, p[0]];   // closed outline drawn as a line (finer coordinates than a fill edge at close zoom)
const PARK_W = 4.0, PARK_H = 3.41 / 4.0;   // Central Park, 843 acres ≈ 3.41 km², as a 4.0 km strip

// hornbill silhouette, facing left, in bird units (1 unit = u degrees); feet at (0,-1)
const BODY: P[] = [[-2.2, 1.4], [-1, 1.55], [0.5, 1.25], [2, 0.85], [2.4, 0.7], [2.3, -0.2], [1, -0.9], [-0.5, -1.0], [-1.6, -0.6], [-2.2, 0], [-2.5, 0.45], [-2.6, 1.0]];
const TAIL: P[] = [[2.4, 0.7], [5.0, 0.25], [5.0, -0.3], [2.3, -0.2]];
const BILL: P[] = [[-2.6, 1.05], [-2.9, 1.42], [-3.7, 1.36], [-3.9, 1.05], [-4.6, 0.62], [-5.2, 0.05], [-4.4, 0.3], [-3.4, 0.45], [-2.5, 0.45]];
const EYE: P[] = Array.from({length: 10}).map((_, i) => [-2.05 + 0.13 * Math.cos(i * 0.628), 1.05 + 0.13 * Math.sin(i * 0.628)] as P);
const place = (shape: P[], u: number, foot: P, k = 1): P[] => shape.map(([x, y]) => [foot[0] + x * u * k, foot[1] + (y * k + 1) * u * 1.0] as P);
const bird = (w: {in: string; dt?: number; out?: string}, u: number, foot: P) => [
  {...w, kind: "fill" as const, poly: place(BODY, u, foot, 1.12).map(([x, y]) => [x, y - 0.12 * u] as P), color: "#FFFFFF", alpha: 0.9},   // white halo
  {...w, kind: "fill" as const, poly: place(BODY, u, foot), color: "#141414", alpha: 1},
  {...w, kind: "fill" as const, poly: place(TAIL, u, foot), color: "#F4F1E6", alpha: 1},
  {...w, kind: "fill" as const, poly: place(BILL, u, foot), color: "#F2D58A", alpha: 1},
  {...w, kind: "fill" as const, poly: place(EYE, u, foot), color: C.red, alpha: 1},
];
const PERCH: P = [N[0], N[1] + 0.03];
const N_AND: P = [93.06, 13.4];   // east coast of North Andaman
const WIDE = {lon: 93.75, lat: 13.25, span: 3.4};

export const narcondam: Spec = {
  id: "narcondam", theme: "premium", globe: {lon: -73.97, lat: 40.78}, handoff: {lon: 93.6, lat: 13.2, span: 3.5}, hi: true,
  cams: [{in: "b1", dt: 0.1, dur: 1.4, cam: {lon: 94.1, lat: 13.25, span: 3.0}}, {in: "b2", dur: 1.3, cam: {lon: N[0] + 0.015, lat: N[1] - 0.01, span: 0.18}},
    {in: "b3", dur: 1.4, cam: WIDE}, {in: "b4", dur: 1.0, cam: {lon: N[0], lat: N[1] - 0.005, span: 0.15}},
    {in: "b5", dur: 0.9, cam: {lon: 93.75, lat: 13.3, span: 3.2}}, {in: "b6", dur: 1.0, cam: {lon: 94.2, lat: 13.9, span: 3.4}},
    {in: "b7", dur: 1.0, cam: {lon: 94.15, lat: 13.25, span: 3.6}}, {in: "b8", dur: 1.0, cam: {lon: N[0], lat: N[1] - 0.005, span: 0.15}},
    {in: "b9", dur: 1.0, cam: {lon: 94.1, lat: 13.25, span: 3.0}}],
  layers: [
    // b1 hook: text from frame 0; a flight line lands on one dot in a wide sea, the bird perches there
    {in: "b1", kind: "bigtext", text: "1 ISLAND", sub: "nowhere else on Earth", size: 160},
    {in: "b1", dt: 1.6, out: "b1", kind: "line", pts: [[92.9, 14.6], [93.5, 14.2], [94.0, 13.75], [N[0], N[1] + 0.05]], color: C.white, width: 6, dash: true},
    {in: "b1", dt: 1.7, out: "b2", kind: "pin", at: N, color: C.amber},
    ...bird({in: "b1", dt: 2.1, out: "b1"}, 0.085, PERCH),
    // b2 6.8 km² vs two Central Parks, same scale
    {in: "b2", dt: 0.9, out: "b2", kind: "fill", poly: ISLAND, color: "rgba(255,176,32,0.35)", alpha: 1},
    {in: "b2", dt: 0.9, out: "b2", kind: "line", pts: loop(ISLAND), color: C.amber, width: 5, draw: 0.6},
    {in: "b2", dt: 1.2, out: "b2", kind: "label", at: [N[0], N[1] + 2.4 * KY], text: "Narcondam", sub: "6.8 km² · outline simplified", color: C.amber, size: 54},
    {in: "b2", dt: 1.6, out: "b2", kind: "fill", poly: rect(2.6, 0.25, PARK_W, PARK_H), color: C.green, alpha: 0.55},
    {in: "b2", dt: 1.9, out: "b2", kind: "fill", poly: rect(2.6, -0.25 - PARK_H, PARK_W, PARK_H), color: C.green, alpha: 0.55},
    {in: "b2", dt: 2.1, out: "b2", kind: "label", at: at(4.6, -2.3), text: "2 × Central Park", sub: "same scale", color: C.green, size: 50},
    // b3 alone in the Andaman Sea
    {in: "b3", kind: "pin", at: N, text: "NARCONDAM", color: C.amber},
    {in: "b3", dt: 1.2, kind: "ruler", a: N_AND, b: N, text: "100+ km", color: C.white, dy: 60},
    {in: "b3", dt: 1.0, kind: "label", at: [92.92, 12.95], text: "North Andaman", sub: "India", color: C.white, size: 44},
    {in: "b3", dt: 1.6, kind: "label", at: [94.6, 12.3], text: "ANDAMAN SEA", color: C.cyan, size: 50},
    // b4 old volcano, 710 m (schematic contours rising)
    ...[1, 0.72, 0.46, 0.22].map((k, i) => ({in: "b4", dt: 0.3 + i * 0.22, out: "b4", kind: "fill" as const, poly: ell(1.65 * k, 1.31 * k), color: i === 3 ? "rgba(255,59,48,0.55)" : "rgba(255,176,32,0.22)", alpha: 1})),
    ...[1, 0.72, 0.46, 0.22].map((k, i) => ({in: "b4", dt: 0.3 + i * 0.22, out: "b4", kind: "line" as const, pts: loop(ell(1.65 * k, 1.31 * k)), color: i === 3 ? C.red : C.amber, width: 4, draw: 0.4})),
    {in: "b4", dt: 1.2, out: "b4", kind: "label", at: [N[0], N[1] - 1.85 * KY], text: "contours schematic", size: 38},
    {in: "b4", kind: "counter", from: 0, to: 710, suffix: " m", label: "old volcano, peak height", size: 190, dur: 1.4},
    // b5 cut off by open sea
    {in: "b5", kind: "fill", poly: ell(95, 95, 0, 0, 64), color: "#02060f", alpha: 0.45},
    {in: "b5", out: "b5", kind: "pin", at: N, color: C.amber},
    {in: "b5", dt: 0.15, out: "b5", kind: "line", pts: [[93.12, 13.62], [93.45, 13.62]], color: C.white, width: 8, arrow: true, draw: 0.5},
    {in: "b5", dt: 0.3, out: "b5", kind: "line", pts: [[93.12, 13.3], [93.45, 13.36]], color: C.white, width: 8, arrow: true, draw: 0.5},
    {in: "b5", dt: 0.45, out: "b5", kind: "line", pts: [[93.12, 12.98], [93.45, 13.1]], color: C.white, width: 8, arrow: true, draw: 0.5},
    {in: "b5", dt: 0.5, out: "b5", kind: "label", at: [94.3, 12.45], text: "OPEN SEA", sub: "arrows illustrative", color: C.cyan, size: 54},
    // b6 evolved in isolation: a branching line (illustrative), one branch curls onto the island
    {in: "b6", out: "b6", kind: "line", pts: [[95.45, 15.3], [95.1, 14.5]], color: C.white, width: 9, draw: 0.6},
    {in: "b6", dt: 0.55, out: "b6", kind: "line", pts: [[95.1, 14.5], [95.35, 13.9], [95.5, 13.2]], color: C.white, width: 9, draw: 0.6},
    {in: "b6", dt: 0.55, out: "b6", kind: "line", pts: [[95.1, 14.5], [94.7, 14.2], [94.4, 13.95], [94.27, 13.65], [N[0], N[1] + 0.06]], color: C.amber, width: 9, draw: 1.0},
    {in: "b6", dt: 0.4, kind: "pin", at: N, color: C.amber},
    ...bird({in: "b6", dt: 1.6, out: "b6"}, 0.085, PERCH),
    {in: "b6", dt: 1.8, out: "b6", kind: "label", at: [94.28, 13.1], text: "Narcondam hornbill", sub: "its own species", color: C.amber, size: 52},
    {in: "b6", dt: 0.6, out: "b6", kind: "label", at: [94.75, 15.5], text: "illustrative", size: 38},
    // b7 smallest range: a range bubble shrinks to a dot (illustrative)
    ...[150, 95, 55, 25].map((r, i) => ({in: "b7", dt: i * 0.4, out: "b7", outAt: -(2.0 - i * 0.4), kind: "fill" as const, poly: ell(r, r, 0, 0, 64), color: C.cyan, alpha: 0.22})),
    {in: "b7", dt: 0.1, kind: "bigtext", text: "SMALLEST RANGE", sub: "of 31 Asian hornbills", size: 120},
    {in: "b7", dt: 1.3, kind: "pin", at: N, text: "this island only", color: C.amber},
    {in: "b7", dt: 0.2, kind: "label", at: [94.15, 12.45], text: "range bubbles illustrative", size: 38},
    // b8 ~1,000 birds circling the island's forest
    {in: "b8", kind: "fill", poly: ISLAND, color: "rgba(46,204,113,0.3)", alpha: 1},
    {in: "b8", kind: "line", pts: loop(ISLAND), color: C.green, width: 5, draw: 0.6},
    {in: "b8", dt: 0.3, kind: "particles", pts: [...ell(1.2, 0.95, 0, 0, 24), ell(1.2, 0.95, 0, 0, 24)[0]], count: 12, color: "#141414", size: 13, speed: 0.06},
    {in: "b8", dt: 0.3, kind: "particles", pts: [...ell(0.65, 0.5, 0, 0, 16), ell(0.65, 0.5, 0, 0, 16)[0]].reverse(), count: 6, color: "#F2D58A", size: 11, speed: 0.08},
    {in: "b8", kind: "counter", from: 0, to: 1000, prefix: "~", label: "birds (750–1,400)", size: 200, dur: 1.6},
    {in: "b8", dt: 1.2, kind: "label", at: [N[0], N[1] - 2.0 * KY], text: "IUCN: Vulnerable", color: C.amber, size: 52},
    // b9 back to the lonely dot, bird perched (loops to b1)
    {in: "b9", kind: "pin", at: N, color: C.amber},
    ...bird({in: "b9", dt: 0.5}, 0.085, PERCH),
    {in: "b9", dt: 0.2, kind: "bigtext", text: "1 VOLCANO · 1 BIRD", sub: "nowhere else", size: 120},
  ],
  question: "Which island animal found nowhere else should we map next? 👇",
  credit: "Sources: UNESCO · BirdLife · IUCN Hornbill SG",
};

// premium motion (AK 26 Oct 2026): one animated icon per beat, lower-left slot
narcondam.layers.push(
  {in: "b1", dt: 0.35, kind: "icon", name: "bird", label: "1 island"},
  {in: "b2", dt: 0.35, kind: "icon", name: "island", label: "6.8 km²"},
  {in: "b3", dt: 0.35, kind: "icon", name: "waves", label: "open sea"},
  {in: "b4", dt: 0.35, kind: "icon", name: "volcano", label: "710 m"},
  {in: "b5", dt: 0.35, kind: "icon", name: "waves", label: "cut off"},
  {in: "b6", dt: 0.35, kind: "icon", name: "bird", label: "own species"},
  {in: "b7", dt: 0.35, kind: "icon", name: "compass", label: "smallest range"},
  {in: "b8", dt: 0.35, kind: "icon", name: "bird", label: "~1,000"},
);
