// Indica Atlas week 2: thumba. Script lines: scripts/geo/week2.py; sources: docs/geo/week2/drafts/thumba.md.
// Map care: the magnetic equator drifts, so it is an approximate dashed curve labelled "approx." that passes near
// Thumba (just south of it here), not through it. The geographic equator (0°) is drawn far to the south, kept apart.
// Church shown as a plain pin (no symbols, no photos). Launch direction over the Arabian Sea is illustrative.
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const THUMBA: P = [76.87, 8.53];
// Approximate dip (magnetic) equator, illustrative: about 0.9° south of Thumba at 77°E
const MAGEQ: P[] = [[60, 5.0], [66, 5.8], [72, 6.9], [77, 7.6], [82, 8.2], [88, 8.8], [95, 9.3]];
const EQ: P[] = [[60, 0], [95, 0]];
const LAUNCH: P[] = [[76.87, 8.53], [76.76, 8.50], [76.64, 8.45], [76.52, 8.37]];

const WIDE = {lon: 77.5, lat: 4.0, span: 22};
const CLOSE = {lon: 76.87, lat: 8.5, span: 0.8};
export const thumba: Spec = {
  id: "thumba", theme: "premium", globe: {lon: -95, lat: 29.6}, handoff: {lon: 77.0, lat: 9.0, span: 8}, hi: true,
  cams: [{in: "b1", dt: 1.65, dur: 1.2, cam: {lon: 76.9, lat: 8.7, span: 3}}, {in: "b2", dt: 0.2, cam: CLOSE},
    {in: "b3", dt: 0.1, dur: 1.4, cam: WIDE}, {in: "b4", dt: 0.2, dur: 2.5, cam: {lon: 77.2, lat: 4.5, span: 20}},
    {in: "b5", dur: 2.5, cam: {lon: 77.0, lat: 7.5, span: 10}}, {in: "b6", cam: CLOSE},
    {in: "b7", dur: 2.5, cam: {lon: 76.87, lat: 8.5, span: 0.65}}, {in: "b8", cam: {lon: 76.75, lat: 8.5, span: 1.0}},
    {in: "b9", dur: 2.0, cam: {lon: 76.85, lat: 8.5, span: 0.85}}],
  layers: [
    // b1 hook, on screen from frame 0
    {in: "b1", kind: "bigtext", text: "INDIA'S FIRST ROCKETS", sub: "assembled inside a church", size: 112},
    {in: "b1", dt: 1.7, out: "b2", kind: "pin", at: THUMBA, text: "THUMBA", color: C.amber},
    // b2 Thumba, near Thiruvananthapuram
    {in: "b2", dt: 0.9, out: "b2", kind: "pin", at: [76.94, 8.52], text: "Thiruvananthapuram", color: C.white, size: 42, dy: 62},
    {in: "b2", dt: 1.1, out: "b2", kind: "label", at: [76.62, 8.68], text: "ARABIAN SEA", color: C.cyan, size: 46},
    // b3 electrojet above the magnetic equator
    {in: "b3", dt: 0.6, out: "b5", kind: "line", pts: MAGEQ, color: C.amber, width: 7, dash: true},
    {in: "b3", dt: 0.9, out: "b4", kind: "label", at: [73.5, 5.4], text: "magnetic equator, 1960s (approx.)", color: C.amber, size: 44},
    {in: "b3", dt: 1.2, out: "b3", kind: "particles", pts: MAGEQ, count: 16, color: C.cyan, size: 9, speed: 0.08},
    {in: "b3", dt: 1.4, out: "b3", kind: "label", at: [80, 11.5], text: "electrojet: west → east", color: C.cyan, size: 44},
    {in: "b3", dt: 0.4, out: "b4", kind: "pin", at: THUMBA, text: "Thumba", color: C.amber, size: 44, dy: -52},
    // b4 field lies flat; geographic equator kept apart
    {in: "b4", dt: 0.2, kind: "bigtext", text: "FIELD LIES FLAT", sub: "along the magnetic equator", size: 130},
    {in: "b4", dt: 1.0, out: "b4", kind: "line", pts: EQ, color: C.white, width: 5, draw: 1.0},
    {in: "b4", dt: 1.4, out: "b4", kind: "label", at: [70.5, 0], text: "equator (0°)", size: 40, dy: -36},
    // b5 balloons / satellites / rockets
    {in: "b5", dt: 0.1, kind: "bigtext", text: "BALLOONS ✗", sub: "can't reach it", color: C.red, size: 110, y: 250, stamp: true},
    {in: "b5", dt: 0.9, kind: "bigtext", text: "SATELLITES ✗", sub: "fly too high", color: C.red, size: 110, y: 520, stamp: true},
    {in: "b5", dt: 1.8, kind: "bigtext", text: "ROCKETS ✓", sub: "can", color: C.green, size: 120, y: 790, stamp: true},
    // b6 the church
    {in: "b6", dt: 0.6, out: "b7", kind: "pin", at: THUMBA, text: "St Mary Magdalene Church", color: C.amber, size: 52},
    {in: "b6", dt: 0.8, out: "b6", kind: "label", at: [76.62, 8.68], text: "ARABIAN SEA", color: C.cyan, size: 46},
    // b7 given to science
    {in: "b7", dt: 0.2, kind: "bigtext", text: "GIVEN TO SCIENCE", sub: "and the parish got a new church", size: 120},
    // b8 first launch
    {in: "b8", out: "b8", kind: "pin", at: THUMBA, text: "Thumba", color: C.amber, size: 46},
    {in: "b8", dt: 0.5, out: "b8", kind: "line", pts: LAUNCH, color: C.amber, width: 10, arrow: true, draw: 1.2},
    {in: "b8", dt: 1.0, out: "b8", kind: "label", at: [76.6, 8.30], text: "launch direction: illustrative", size: 38},
    {in: "b8", dt: 0.1, kind: "bigtext", text: "21 NOV 1963", sub: "first launch from Thumba", stamp: true, size: 150},
    // b9 museum
    {in: "b9", dt: 0.3, kind: "pin", at: THUMBA, text: "VSSC SPACE MUSEUM", color: C.amber, size: 50},
    {in: "b9", dt: 0.1, kind: "bigtext", text: "SPACE MUSEUM", sub: "the old church, since 1985", size: 140},
  ],
  question: "Been to this space museum? 👇", credit: "Sources: VSSC · ISRO · Kalam 2005",
};

// premium motion (AK 26 Oct 2026): one animated icon per beat, lower-left slot
thumba.layers.push(
  {in: "b1", dt: 0.35, kind: "icon", name: "rocket", label: "1st rockets"},
  {in: "b2", dt: 0.35, kind: "icon", name: "palm", label: "Thumba"},
  {in: "b3", dt: 0.35, kind: "icon", name: "globe", label: "electrojet"},
  {in: "b4", dt: 0.35, kind: "icon", name: "compass", label: "magnetic"},
  {in: "b5", dt: 0.35, kind: "icon", name: "rocket", label: "rockets ✓"},
  {in: "b6", dt: 0.35, kind: "icon", name: "house", label: "the church"},
  {in: "b7", dt: 0.35, kind: "icon", name: "people", label: "the parish"},
  {in: "b8", dt: 0.35, kind: "icon", name: "rocket", label: "21 Nov 1963"},
);
