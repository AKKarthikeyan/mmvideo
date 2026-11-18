// Indica Atlas week 2: barmer. Script lines: scripts/geo/week2.py; sources: docs/geo/week2/drafts/barmer.md.
// Map care: Pakistan is never filled or highlighted; its one label sits well inside Sindh, away from the border.
// The rift/lake shape is schematic (labelled on screen) and stays at least 0.5° east of the border.
// Geology only: no depth numbers, no company names on screen, no share prices or money figures.
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const BARMER: P = [71.39, 25.75];
const MANGALA: P = [71.2, 25.95];         // approximate, labelled so
// Barmer Basin as a NNW-SSE rift, schematic outline only
const RIFT: P[] = [[71.0, 26.85], [71.4, 26.9], [71.75, 25.9], [71.95, 25.0], [71.7, 24.75], [71.45, 24.85], [71.15, 25.6], [70.95, 26.3]];
const ALGAE: P[] = [[71.1, 26.6], [71.5, 26.5], [71.3, 26.0], [71.6, 25.7], [71.4, 25.3], [71.75, 25.0]];
const ALGAE2: P[] = [[71.3, 26.75], [71.15, 26.2], [71.5, 25.95], [71.3, 25.55], [71.65, 25.2]];
const TO_FIELD: P[][] = [[[71.6, 26.6], MANGALA], [[71.65, 25.4], MANGALA], [[71.0, 26.45], MANGALA]];
const LAKE = "#2F80ED";

export const barmer: Spec = {
  id: "barmer", theme: "premium", globe: {lon: -95.37, lat: 29.76}, handoff: {lon: 71.4, lat: 25.75, span: 3}, hi: true,
  cams: [
    {in: "b1", dt: 1.8, dur: 1.6, cam: {lon: 71.3, lat: 25.85, span: 2.4}},
    {in: "b2", dur: 1.2, cam: {lon: 71.3, lat: 26.3, span: 6.5}},
    {in: "b3", dur: 1.1, cam: {lon: 71.45, lat: 25.8, span: 3.2}},
    {in: "b4", dur: 2.0, cam: {lon: 71.45, lat: 25.85, span: 3.0}},
    {in: "b5", dur: 2.0, cam: {lon: 71.4, lat: 25.9, span: 2.8}},
    {in: "b6", dur: 2.4, cam: {lon: 71.4, lat: 25.9, span: 2.5}},
    {in: "b7", dur: 1.2, cam: {lon: 71.3, lat: 25.95, span: 2.0}},
    {in: "b8", dur: 2.4, cam: {lon: 71.35, lat: 25.9, span: 2.4}},
    {in: "b9", dur: 1.4, cam: {lon: 71.4, lat: 25.75, span: 3}},
  ],
  layers: [
    // b1 hook: 2004 from frame 0, then the field
    {in: "b1", out: "b1", kind: "bigtext", text: "2004", sub: "India's biggest onshore oil find in 20+ years", size: 220, y: 230, stamp: true},
    {in: "b1", dt: 1.8, out: "b1", kind: "pin", at: MANGALA, text: "Mangala field (approx.)", color: C.amber, size: 46, dy: 62},
    {in: "b1", dt: 2.1, out: "b1", kind: "particles", pts: [[71.2, 25.93], [71.2, 26.35]], count: 7, color: "#111", size: 10, speed: 0.45},
    // b2 where: Barmer, Rajasthan, Thar Desert (Pakistan labelled only, never filled)
    {in: "b2", dt: 0.2, out: "b2", kind: "pin", at: BARMER, text: "BARMER", color: C.amber},
    {in: "b2", dt: 0.6, out: "b2", kind: "label", at: [73.1, 26.75], text: "RAJASTHAN", size: 50},
    {in: "b2", dt: 0.9, out: "b2", kind: "label", at: [72.0, 27.5], text: "THAR DESERT", color: C.amber, size: 56},
    {in: "b2", dt: 1.2, out: "b2", kind: "label", at: [69.3, 25.3], text: "PAKISTAN", size: 40, color: "rgba(255,255,255,0.85)"},
    // b3 the crust stretched, a valley sank
    {in: "b3", dt: 0.2, out: "b3", kind: "line", pts: [[71.05, 26.25], [70.7, 26.25]], color: C.white, width: 9, draw: 0.5, arrow: true},
    {in: "b3", dt: 0.2, out: "b3", kind: "line", pts: [[71.85, 25.4], [72.25, 25.4]], color: C.white, width: 9, draw: 0.5, arrow: true},
    {in: "b3", dt: 0.9, out: "b3", kind: "fill", poly: RIFT, color: C.amber, alpha: 0.18, dashed: true},
    {in: "b3", dt: 1.1, out: "b3", kind: "label", at: [71.42, 26.05], text: "RIFT VALLEY", sub: "schematic", color: C.amber, size: 52},
    // b4 a lake fills it, about 60 million years ago
    {in: "b4", out: "b5", kind: "fill", poly: RIFT, color: LAKE, alpha: 0.5},
    {in: "b4", dt: 0.1, out: "b4", kind: "counter", from: 0, to: 60, prefix: "~", label: "million years ago", y: 250, size: 190, dur: 1.2},
    {in: "b4", dt: 0.4, out: "b4", kind: "label", at: [71.42, 26.05], text: "ANCIENT RIFT LAKE", sub: "schematic", color: C.white, size: 50},
    // b5 algae and bacteria settle into the mud
    {in: "b5", out: "b5", kind: "particles", pts: ALGAE, count: 16, color: "#8CFF6A", size: 7, speed: 0.07},
    {in: "b5", dt: 0.2, out: "b5", kind: "particles", pts: ALGAE2, count: 12, color: "#8CFF6A", size: 6, speed: 0.09},
    {in: "b5", dt: 1.0, out: "b5", kind: "fill", poly: RIFT, color: "#5C4A1E", alpha: 0.6},
    {in: "b5", dt: 0.3, out: "b5", kind: "label", at: [71.3, 27.05], text: "algae + bacteria", sub: "settle in the lake mud", color: "#8CFF6A", size: 46},
    // b6 buried kilometres deep, the mud cooks into oil (no depth number)
    {in: "b6", out: "b6", kind: "fill", poly: RIFT, color: C.orange, alpha: 0.5},
    {in: "b6", dt: 0.1, out: "b6", kind: "bigtext", text: "BURIED KILOMETRES DEEP", sub: "heat + time → oil", size: 92, y: 250},
    {in: "b6", dt: 0.6, out: "b6", kind: "particles", pts: ALGAE, count: 14, color: "#111", size: 9, speed: 0.08},
    // b7 most of it in the Fatehgarh sandstone
    {in: "b7", out: "b8", kind: "fill", poly: RIFT, color: "#F5D76E", alpha: 0.3},
    {in: "b7", dt: 0.1, out: "b7", kind: "bigtext", text: "FATEHGARH SANDSTONE", sub: "holds most of the oil", size: 100, y: 250},
    {in: "b7", dt: 0.3, out: "b8", kind: "pin", at: MANGALA, text: "Mangala field (approx.)", color: C.amber, size: 44, dy: 62},
    ...TO_FIELD.map((pts, i) => ({in: "b7", dt: 0.4 + i * 0.15, out: "b8", kind: "particles" as const, pts, count: 4, color: "#111", size: 9, speed: 0.35})),
    {in: "b7", dt: 0.5, out: "b7", kind: "label", at: [71.55, 26.75], text: "sandstone layer (schematic)", size: 40},
    // b8 7.3 billion barrels in place
    {in: "b8", dt: 0.1, out: "b8", kind: "bigtext", text: "7.3 BN BARRELS", sub: "“in place”: not all can be recovered", size: 150, y: 240, stamp: true},
    // b9 waxy oil: the fingerprint of the old lake
    {in: "b9", kind: "fill", poly: RIFT, color: LAKE, alpha: 0.3, dashed: true},
    {in: "b9", dt: 0.3, kind: "label", at: [71.5, 26.55], text: "ANCIENT RIFT LAKE", sub: "schematic", size: 48},
    {in: "b9", dt: 0.6, kind: "pin", at: MANGALA, color: C.amber},
    {in: "b9", dt: 0.8, kind: "bigtext", text: "WAXY OIL", sub: "the old lake's fingerprint", size: 140, y: 250},
  ],
  question: "Did you know Rajasthan had oil? 👇", credit: "Sources: Cairn, CGWB, AAPG",
};
void C; type _P = P;

// premium motion (AK 26 Oct 2026): one animated icon per beat, lower-left slot
barmer.layers.push(
  {in: "b1", dt: 0.35, kind: "icon", name: "rig", label: "2004"},
  {in: "b2", dt: 0.35, kind: "icon", name: "mountain", label: "Thar"},
  {in: "b3", dt: 0.35, kind: "icon", name: "mountain", label: "rift"},
  {in: "b4", dt: 0.35, kind: "icon", name: "waves", label: "lake"},
  {in: "b5", dt: 0.35, kind: "icon", name: "drop", label: "algae"},
  {in: "b6", dt: 0.35, kind: "icon", name: "clock", label: "heat + time"},
  {in: "b7", dt: 0.35, kind: "icon", name: "rig", label: "Fatehgarh"},
  {in: "b8", dt: 0.35, kind: "icon", name: "drop", label: "7.3 bn bbl"},
);
