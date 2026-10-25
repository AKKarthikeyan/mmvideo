// Indica Atlas week 2: austria. Script lines: scripts/geo/week2.py; sources: docs/geo/week2/drafts/austria.md.
// Coordinates are for placement only. The sea route is SCHEMATIC (round Africa; the Suez Canal did not exist in 1778) and labelled so.
// The glow in b1/b9 is modern, landlocked Austria; in b6 the port pin is labelled "Trieste (Habsburg port)" and no country is shaded.
// Note: the map is equirectangular around 8°N, so Europe looks wider than on a globe.
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const VIENNA: P = [16.37, 48.21], TRIESTE: P = [13.77, 45.65], MADRAS: P = [80.27, 13.08], PEGU: P = [96.48, 17.34];
const NICOBARS: P = [93.5, 8.05];
// schematic sea route Trieste -> Mediterranean -> round Africa -> Nicobars
const ROUTE: P[] = [TRIESTE, [15.2, 43.6], [18.6, 40.3], [17.0, 37.6], [12.0, 37.2], [3.0, 37.6], [-5.6, 36.0], [-14, 27], [-20, 14], [-13, 2], [0, -14],
  [10, -30], [18.5, -36.5], [30, -36.5], [44, -31], [58, -18], [73, -4], [86, 3.5], [91.8, 6.6], NICOBARS];
const MED: P[] = ROUTE.slice(0, 7);
const ISLES: P[] = [[92.77, 9.2], [93.11, 8.27], [93.61, 8.5], [93.5, 8.11], [93.55, 7.98], [93.38, 7.94], [93.67, 7.35], [93.81, 7.0]];
const CLAIM: P[] = [[92.4, 9.55], [94.15, 9.55], [94.15, 6.6], [92.4, 6.6]];
const EUROPE = {lon: 15.5, lat: 46.5, span: 14};

export const austria: Spec = {
  id: "austria", globe: {lon: 16.37, lat: 48.21}, handoff: {lon: 93.3, lat: 8.2, span: 6}, hi: true,
  cams: [{in: "b1", dt: 0.1, dur: 1.2, cam: {lon: 85.5, lat: 13, span: 24}}, {in: "b2", dur: 1.0, cam: {lon: 93.25, lat: 8.3, span: 3.6}},
    {in: "b4", dt: 0.6, dur: 1.4, cam: {lon: 91.2, lat: 8.6, span: 7}},
    {in: "b5", dur: 1.4, cam: EUROPE}, {in: "b6", dur: 1.0, cam: {lon: 14.2, lat: 41.5, span: 14}},
    {in: "b7", dur: 1.4, cam: {lon: 88.4, lat: 12.5, span: 20}}, {in: "b9", dur: 1.4, cam: {lon: 12, lat: 40.8, span: 20}}],
  layers: [
    // b1 hook: text from frame 0 while the globe flies Vienna -> Nicobars; then the schematic route arrives from the south-west
    {in: "b1", kind: "bigtext", text: "LANDLOCKED AUSTRIA", sub: "reached India's islands in 1778", size: 110},
    {in: "b1", dt: 1.6, out: "b1", kind: "line", pts: ROUTE, color: C.amber, width: 8, draw: 1.8},
    {in: "b1", dt: 2.4, out: "b1", kind: "label", at: [80.5, -1.5], text: "route schematic", sub: "round Africa", color: C.amber, size: 42},
    {in: "b1", dt: 3.4, out: "b2", kind: "pin", at: NICOBARS, color: C.amber},
    {in: "b1", dt: 3.4, out: "b1", kind: "label", at: [90.8, 8.6], text: "1778", color: C.amber, size: 64},
    // b2 Nicobar Islands, Bay of Bengal
    ...ISLES.map((p, i) => ({in: "b2", dt: 0.2 + i * 0.1, out: "b4", kind: "pin" as const, at: p, color: C.amber})),
    {in: "b2", dt: 0.3, out: "b2", kind: "label", at: [93.2, 10.1], text: "NICOBAR ISLANDS", sub: "India · home of the Nicobarese", color: C.amber, size: 60},
    {in: "b2", dt: 0.6, out: "b2", kind: "label", at: [92.2, 8.0], text: "Bay of Bengal", color: C.cyan, size: 48},
    // b3 1756: Denmark claims them
    {in: "b3", out: "b4", outAt: -2.0, kind: "fill", poly: CLAIM, color: C.red, alpha: 0.12, dashed: true},
    {in: "b3", dt: 0.3, out: "b3", kind: "label", at: [93.25, 9.6], text: "Danish claim (area approx.)", color: C.red, size: 40},
    {in: "b3", kind: "bigtext", text: "1756", stamp: true, sub: "Denmark claims the islands", size: 170, color: C.red},
    // b4 1773: the Danish company leaves
    {in: "b4", dt: 0.4, out: "b4", kind: "line", pts: [[92.3, 8.4], [91.0, 8.6], [89.3, 8.9]], color: C.white, width: 9, arrow: true, draw: 1.4},
    {in: "b4", dt: 0.5, out: "b4", kind: "particles", pts: [[92.3, 8.4], [91.0, 8.6], [89.3, 8.9]], count: 1, color: C.white, size: 14, speed: 0.35},
    {in: "b4", dt: 1.2, out: "b4", kind: "label", at: [90.2, 9.6], text: "Danish company leaves", color: C.white, size: 46},
    {in: "b4", kind: "bigtext", text: "1773", stamp: true, sub: "settlements failed", size: 170},
    // b5 William Bolts, backed by Empress Maria Theresa (Vienna)
    {in: "b5", dt: 1.0, kind: "pin", at: VIENNA, text: "Vienna", color: C.amber},
    {in: "b5", dt: 1.3, kind: "label", at: [15.0, 51.4], text: "👑 Empress Maria Theresa", color: C.amber, size: 56},
    {in: "b5", dt: 1.8, kind: "label", at: [13.2, 43.3], text: "👤 William Bolts", sub: "trader", color: C.white, size: 56},
    // b6 India & China goods straight to an Austrian port
    {in: "b6", dt: 0.3, kind: "pin", at: TRIESTE, text: "Trieste (Habsburg port)", color: C.amber},
    {in: "b6", dt: 0.4, kind: "line", pts: [...MED].reverse(), color: C.amber, width: 7, draw: 1.0},
    {in: "b6", dt: 0.8, kind: "particles", pts: [...MED].reverse(), count: 6, color: "#fff", size: 11, speed: 0.12},
    {in: "b6", dt: 0.9, kind: "label", at: [12.0, 39.4], text: "← from India & China", sub: "route schematic", color: C.white, size: 46},
    {in: "b6", dt: 1.4, kind: "bigtext", text: "NO MIDDLEMEN", stamp: true, size: 140},
    // b7 a fort on the Nicobars, boats to Madras and Pegu
    {in: "b7", dt: 0.6, out: "b8", kind: "pin", at: NICOBARS, color: C.amber},
    {in: "b7", dt: 0.8, out: "b7", kind: "label", at: [90.3, 7.0], text: "🏰 trading post + fort", color: C.amber, size: 50},
    {in: "b7", dt: 1.0, out: "b7", kind: "line", pts: [MADRAS, [86, 10.6], NICOBARS], color: C.white, width: 6, dash: true},
    {in: "b7", dt: 1.1, out: "b7", kind: "line", pts: [NICOBARS, [95.0, 12.5], [96.2, 16.4], PEGU], color: C.white, width: 6, dash: true},
    {in: "b7", dt: 1.3, out: "b7", kind: "particles", pts: [MADRAS, [86, 10.6], NICOBARS, [86, 10.6], MADRAS], count: 2, color: C.amber, size: 13, speed: 0.12},
    {in: "b7", dt: 1.3, out: "b7", kind: "particles", pts: [NICOBARS, [95.0, 12.5], [96.2, 16.4], PEGU, [96.2, 16.4], [95.0, 12.5], NICOBARS], count: 2, color: C.amber, size: 13, speed: 0.12},
    {in: "b7", dt: 1.0, out: "b7", kind: "pin", at: MADRAS, color: C.white},
    {in: "b7", dt: 1.0, out: "b7", kind: "label", at: [81.6, 14.3], text: "Madras", sub: "Chennai today", color: C.white, size: 50},
    {in: "b7", dt: 1.1, out: "b7", kind: "pin", at: PEGU, color: C.white},
    {in: "b7", dt: 1.1, out: "b7", kind: "label", at: [93.9, 18.6], text: "Pegu", sub: "Bago, Myanmar today", color: C.white, size: 50},
    {in: "b7", dt: 1.4, out: "b7", kind: "label", at: [85.5, 15.2], text: "routes schematic", size: 38},
    // b8 failed after three years; broke in 1785
    {in: "b8", dt: 0.1, kind: "panel", name: "timeline", props: {items: [{y: "1756", t: "Denmark claims"}, {y: "1773", t: "Danish company leaves"},
      {y: "1778", t: "Austrian ship arrives"}, {y: "1785", t: "Bolts's company broke"}]}},
    // b9 back to landlocked Austria (loops to b1)
    {in: "b9", dt: 0.3, kind: "fill", iso: ["AUT"], color: C.amber, alpha: 0.45},
    {in: "b9", dt: 0.6, kind: "label", at: [14.6, 48.9], text: "AUSTRIA", sub: "landlocked today", color: C.amber, size: 60},
    {in: "b9", dt: 0.5, kind: "line", pts: ROUTE, color: C.amber, width: 7, draw: 9},
    {in: "b9", dt: 1.0, kind: "label", at: [6.5, 38.9], text: "← to the Nicobars", sub: "route schematic, round Africa", color: C.amber, size: 46},
  ],
  question: "Which other surprise colony should we map next? 👇",
  credit: "Sources: Imperial Gazetteer · Novara · Haensel",
};
