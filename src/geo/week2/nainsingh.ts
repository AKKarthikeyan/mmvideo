// Indica Atlas week 2: nainsingh. Script lines: scripts/geo/week2.py; sources: docs/geo/week2/drafts/nainsingh.md.
// A 19th-century survey story on the map of the time: no fills of Tibet, no boundary callouts, route drawn as a labelled schematic.
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const KTM: P = [85.32, 27.71], TADUM: P = [84.2, 29.55], SHIGATSE: P = [88.88, 29.27], LHASA: P = [91.13, 29.65], MANAS: P = [81.45, 30.68];
const ROUTE: P[] = [KTM, TADUM, SHIGATSE, LHASA];                         // Kathmandu → Tadum area → Shigatse → Lhasa (schematic)
const WEST: P[] = [TADUM, [82.8, 30.2], MANAS];                            // the great road west towards Manasarovar (schematic)
const WIDE = {lon: 88, lat: 28.8, span: 12};
const SCHEM_WIDE = {kind: "label" as const, at: [87.4, 29.85] as P, text: "route, schematic", size: 38};
const SCHEM_NEAR = {kind: "label" as const, at: [89.6, 28.95] as P, text: "route, schematic", size: 38};

export const nainsingh: Spec = {
  id: "nainsingh", theme: "premium", globe: {lon: -0.17, lat: 51.5}, handoff: {lon: 85.5, lat: 29, span: 14}, hi: false,
  cams: [
    {in: "b1", dt: 0, dur: 1.2, cam: WIDE},
    {in: "b2", cam: {lon: 85, lat: 28.8, span: 10}},
    {in: "b3", cam: {lon: 91.0, lat: 29.7, span: 6}, dur: 1.1},
    {in: "b4", cam: WIDE},
    {in: "b5", cam: {lon: 88, lat: 29.1, span: 9}},
    {in: "b6", cam: {lon: 88.5, lat: 29.3, span: 10}, dur: 2.0},
    {in: "b7", cam: {lon: 86.5, lat: 29.3, span: 8}, dur: 1.4},
    {in: "b8", cam: {lon: 86.6, lat: 28.3, span: 14}},
    {in: "b9", cam: {lon: 91.13, lat: 29.65, span: 6}, dur: 1.2},
  ],
  layers: [
    // b1 hook: the year from frame 0, then the footpath creeps from Kathmandu into Lhasa
    {in: "b1", kind: "bigtext", text: "1866", sub: "every step counted", size: 170},
    {in: "b1", dt: 1.7, out: "b8", kind: "line", pts: ROUTE, color: C.amber, width: 7, draw: 2.2},
    {in: "b1", dt: 1.8, out: "b2", kind: "particles", pts: ROUTE, count: 12, color: "#fff", size: 7, speed: 0.05},
    {in: "b1", dt: 1.7, out: "b2", kind: "pin", at: KTM, text: "Kathmandu", color: C.white, size: 44, dy: 60},
    {in: "b1", dt: 3.0, out: "b2", kind: "pin", at: LHASA, text: "Lhasa", color: C.amber, size: 50},
    {in: "b1", dt: 1.8, out: "b2", ...SCHEM_WIDE},
    // b2 who he was
    {in: "b2", dt: 0.1, kind: "bigtext", text: "NAIN SINGH", sub: "Great Trigonometrical Survey · British India's map survey", size: 130, stamp: true},
    {in: "b2", dt: 0.6, kind: "label", at: [83.3, 28.4], text: "HIMALAYAS", size: 50},
    // b3 Lhasa's position was a guess: question marks pop around it (illustrative)
    {in: "b3", dt: 0.2, kind: "label", at: LHASA, text: "LHASA?", color: C.amber, size: 90},
    {in: "b3", dt: 0.3, kind: "pin", at: [90.3, 30.3], text: "?", color: C.red, size: 70},
    {in: "b3", dt: 0.5, kind: "pin", at: [91.8, 30.1], text: "?", color: C.red, size: 70},
    {in: "b3", dt: 0.7, kind: "pin", at: [92.0, 29.1], text: "?", color: C.red, size: 70, dy: 55},
    {in: "b3", dt: 0.8, kind: "label", at: [91.0, 28.55], text: "guesses illustrative", size: 38},
    {in: "b3", ...SCHEM_NEAR},
    // b4 a European stood out; travellers keep walking
    {in: "b4", out: "b4", kind: "particles", pts: ROUTE, count: 10, color: "#fff", size: 9, speed: 0.05},
    {in: "b4", dt: 0.3, kind: "bigtext", text: "A EUROPEAN STOOD OUT", sub: "even if disguised", color: C.red, size: 100, stamp: true},
    {in: "b4", out: "b8", kind: "pin", at: LHASA, text: "Lhasa", color: C.amber, size: 50},
    {in: "b4", out: "b8", kind: "pin", at: KTM, text: "Kathmandu", color: C.white, size: 44, dy: 60},
    {in: "b4", out: "b8", ...SCHEM_WIDE},
    // b5-b6 one traveller in disguise walks the road
    {in: "b5", out: "b6", kind: "particles", pts: ROUTE, count: 1, color: C.amber, size: 16, speed: 0.04},
    {in: "b5", dt: 0.2, kind: "bigtext", text: "DISGUISED", sub: "as a Buddhist traveller", size: 150},
    {in: "b6", dt: 0.1, kind: "bigtext", text: "USUAL ROSARY: 108", color: C.white, size: 90},
    {in: "b6", dt: 0.9, kind: "counter", from: 108, to: 100, dur: 1.4, label: "beads on his rosary", y: 470, size: 200},
    // b7 beads slide along the route: every tenth bead is bigger; two counters stay in step (1 bead = 100 paces)
    {in: "b7", out: "b9", kind: "particles", pts: ROUTE, count: 30, color: C.amber, size: 6, speed: 0.02},
    {in: "b7", out: "b9", kind: "particles", pts: ROUTE, count: 3, color: C.amber, size: 14, speed: 0.02},
    {in: "b7", dt: 0.2, kind: "counter", from: 0, to: 10, dur: 3.0, label: "beads (1 bead = 100 paces)", size: 160},
    {in: "b7", dt: 0.2, kind: "counter", from: 0, to: 1000, dur: 3.0, suffix: " paces", label: "= 1 big bead", y: 560, size: 150},
    // b8 the whole survey: the road west towards Manasarovar draws on, miles counter
    {in: "b8", dt: 0.3, kind: "line", pts: WEST, color: C.amber, width: 7, arrow: true, draw: 1.2},
    {in: "b8", dt: 1.2, kind: "pin", at: MANAS, color: C.cyan},
    {in: "b8", dt: 1.3, kind: "label", at: [82.6, 31.25], text: "towards Manasarovar", color: C.cyan, size: 44},
    {in: "b8", dt: 0.1, kind: "counter", from: 0, to: 1200, dur: 2.0, suffix: "+ miles", label: "2,000 paces = 1 mile", size: 170},
    // b9 the guess becomes a fixed point: latitude line through a solid Lhasa pin
    {in: "b9", kind: "line", pts: ROUTE.slice(2), color: C.amber, width: 7, draw: 0.3},
    {in: "b9", dt: 0.4, kind: "line", pts: [[88.6, 29.65], [93.0, 29.65]], color: C.green, width: 5, draw: 1.0},
    {in: "b9", dt: 0.8, kind: "pin", at: LHASA, text: "LHASA", color: C.green, size: 64},
    {in: "b9", dt: 1.0, kind: "label", at: [89.4, 29.9], text: "29°39′N", color: C.green, size: 50},
    {in: "b9", dt: 0.3, kind: "bigtext", text: "FIXED POINT", sub: "Lhasa · 29°39′N", color: C.green, size: 140, stamp: true},
    {in: "b9", ...SCHEM_NEAR},
  ],
  question: "Could you count every step for a year? 👇",
  credit: "Sources: Montgomerie, JRGS 1868 · RGS",
};

// premium motion (AK 26 Oct 2026): one animated icon per beat, lower-left slot
nainsingh.layers.push(
  {in: "b1", dt: 0.35, kind: "icon", name: "beads", label: "every step"},
  {in: "b2", dt: 0.35, kind: "icon", name: "telescope", label: "survey"},
  {in: "b3", dt: 0.35, kind: "icon", name: "compass", label: "a guess"},
  {in: "b4", dt: 0.35, kind: "icon", name: "people", label: "stood out"},
  {in: "b5", dt: 0.35, kind: "icon", name: "boot", label: "disguised"},
  {in: "b6", dt: 0.35, kind: "icon", name: "beads", label: "100 beads"},
  {in: "b7", dt: 0.35, kind: "icon", name: "boot", label: "100 paces"},
  {in: "b8", dt: 0.35, kind: "icon", name: "mountain", label: "1,200+ mi"},
);
