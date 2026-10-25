// Indica Atlas week 2: sikhpolice. Script lines: scripts/geo/week2.py; sources: docs/geo/week2/drafts/sikhpolice.md.
// City pins and schematic sea routes only. No partition line drawn; Lahore labelled "(now Pakistan)".
// Shanghai's International Settlement is one small district: highlighted as an approximate area, not the whole city.
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const LAHORE: P = [74.34, 31.55], HK: P = [114.17, 22.3], SHANGHAI: P = [121.47, 31.23], BOMBAY: P = [72.88, 19.08];
// Punjab → Calcutta overland, then by sea via the Strait of Malacca (schematic)
const TO_HK: P[] = [LAHORE, [80.5, 26.5], [88.36, 22.57], [88.7, 20.0], [91.0, 10.2], [94.0, 10.0], [97.6, 6.0], [98.0, 5.6], [100.5, 3.2], [102.5, 1.8], [103.8, 1.2],
  [106, 4.5], [109, 9], HK];
const TO_SH: P[] = [...TO_HK, [117.0, 22.9], [119.5, 24.8], [121.0, 27.0], [122.6, 29.8], [121.9, 31.0], SHANGHAI];
const BOM_HK: P[] = [BOMBAY, [73.5, 15], [75.6, 8.5], [77.5, 7.0], [80.5, 5.4], [88, 5.8], [94.5, 6.2], [98.0, 5.6], [100.5, 3.2], [102.5, 1.8], [103.8, 1.2],
  [106, 4.5], [109, 9], HK];
const SETTLEMENT: P[] = [[121.44, 31.228], [121.49, 31.228], [121.5, 31.245], [121.48, 31.256], [121.44, 31.247]];   // approximate area
const WIDE = {lon: 96.9, lat: 22.5, span: 60};
const RING: P[] = Array.from({length: 37}, (_, i) => [121.47 + 0.11 * Math.cos(i * Math.PI / 18) / 0.857, 31.24 + 0.11 * Math.sin(i * Math.PI / 18)] as P);   // highlight ring
const NEAR_HK = {lon: 116.5, lat: 23.0, span: 9};
const NEAR_SH = {lon: 121.1, lat: 30.65, span: 3.5};
const SCHEM = {kind: "label" as const, at: [88, 12] as P, text: "routes schematic", size: 38};

export const sikhpolice: Spec = {
  id: "sikhpolice", globe: {lon: 74.3, lat: 31.55}, handoff: {lon: 118, lat: 27, span: 22}, hi: true,
  cams: [
    {in: "b1", dt: 0, dur: 1.6, cam: NEAR_SH},
    {in: "b2", cam: WIDE, dur: 1.1},
    {in: "b3", cam: NEAR_HK, dur: 1.1},
    {in: "b4", cam: WIDE},
    {in: "b5", cam: {lon: 96.9, lat: 22.5, span: 57}, dur: 2.0},
    {in: "b6", cam: {lon: 116, lat: 22.8, span: 7}, dur: 2.5},
    {in: "b7", cam: NEAR_SH, dur: 1.3},
    {in: "b8", cam: {lon: 77.7, lat: 26, span: 30}, dur: 1.2},
    {in: "b9", cam: {lon: 121.1, lat: 30.75, span: 3.2}, dur: 1.2},
  ],
  layers: [
    // b1 hook: 558 from frame 0, then the Shanghai pin
    {in: "b1", kind: "counter", from: 0, to: 558, dur: 2.4, label: "Sikh officers · Shanghai police, 1936", size: 210},
    {in: "b1", dt: 1.7, out: "b1", kind: "pin", at: SHANGHAI, text: "Shanghai", color: C.amber},
    // b2 Punjab → China? one long schematic route
    {in: "b2", dt: 0.2, out: "b2", kind: "line", pts: TO_SH, color: C.amber, width: 7, arrow: true, draw: 1.6},
    {in: "b2", dt: 0.1, out: "b5", kind: "pin", at: LAHORE, text: "PUNJAB", color: C.amber, size: 46, dy: 58},
    {in: "b2", dt: 1.4, out: "b2", kind: "pin", at: SHANGHAI, color: C.amber},
    {in: "b2", dt: 1.5, out: "b2", kind: "label", at: [115.5, 33.8], text: "Shanghai", color: C.amber, size: 46},
    {in: "b2", dt: 0.3, out: "b2", ...SCHEM},
    {in: "b2", dt: 0.1, kind: "bigtext", text: "PUNJAB → CHINA?", size: 120},
    // b3 Hong Kong, a British colony, did it first
    {in: "b3", dt: 0.3, out: "b3", kind: "pin", at: HK, color: C.cyan},
    {in: "b3", dt: 0.5, out: "b3", kind: "label", at: HK, dy: -80, text: "Hong Kong", sub: "British colony", color: C.cyan, size: 60},
    {in: "b3", dt: 0.2, kind: "bigtext", text: "HONG KONG FIRST", sub: "Indian police from 1861", size: 120},
    // b4 1862: Bombay recruits disappoint (dotted sea route Bombay → Hong Kong)
    {in: "b4", out: "b4", kind: "line", pts: BOM_HK, color: C.red, width: 6, flow: true},
    {in: "b4", dt: 0.2, out: "b4", kind: "pin", at: BOMBAY, color: C.red},
    {in: "b4", dt: 0.4, out: "b4", kind: "label", at: [79.0, 17.3], text: "Bombay", sub: "today's Mumbai", color: C.red, size: 46},
    {in: "b4", out: "b6", kind: "pin", at: HK, text: "Hong Kong", color: C.cyan, size: 46},
    {in: "b4", out: "b5", ...SCHEM},
    {in: "b4", dt: 0.3, kind: "bigtext", text: "1862", sub: "Bombay recruits disappoint", color: C.red, size: 160, stamp: true},
    // b5 straight from Punjab, and they did better
    {in: "b5", kind: "line", pts: TO_HK, color: C.green, width: 8, arrow: true, draw: 1.6},
    {in: "b5", dt: 0.2, kind: "bigtext", text: "STRAIGHT FROM PUNJAB", sub: "and they did better", color: C.green, size: 110},
    // b6 turbans, not caps: "big heads"
    {in: "b6", dt: 0.1, kind: "bigtext", text: "TURBANS, NOT CAPS", size: 120},
    {in: "b6", dt: 1.1, kind: "bigtext", text: "“BIG HEADS”", sub: "their nickname", color: C.white, y: 520, size: 140, stamp: true},
    // b7 1884: Shanghai's International Settlement hires 16
    {in: "b7", dt: 0.5, out: "b9", kind: "fill", poly: SETTLEMENT, color: C.amber, alpha: 0.55},
    {in: "b7", dt: 0.3, out: "b9", kind: "line", pts: RING, color: C.amber, width: 5, draw: 0.8},
    {in: "b7", dt: 0.7, out: "b7", kind: "label", at: [121.4, 30.9], text: "International Settlement", sub: "approx. area", color: C.amber, size: 48},
    {in: "b7", dt: 0.1, kind: "counter", from: 0, to: 16, dur: 1.8, label: "Sikh constables hired, 1884", size: 210},
    // b8 1885: 50 men, some recruited from Lahore
    {in: "b8", dt: 0.3, kind: "line", pts: TO_SH, color: C.amber, width: 7, draw: 2.4},
    {in: "b8", dt: 0.2, kind: "pin", at: LAHORE, color: C.amber},
    {in: "b8", dt: 0.4, kind: "label", at: [70.4, 31.55], text: "Lahore", sub: "(now Pakistan)", color: C.amber, size: 64},
    {in: "b8", dt: 1.2, kind: "label", at: [80.5, 28.6], text: "to Shanghai · schematic", size: 40},
    {in: "b8", dt: 0.1, kind: "counter", from: 16, to: 50, dur: 1.6, label: "Sikh section, end of 1885", size: 210},
    // b9 16 became 558 (loops to the hook)
    {in: "b9", dt: 0.5, kind: "label", at: [121.4, 30.9], text: "Shanghai", sub: "International Settlement (approx.)", color: C.amber, size: 56},
    {in: "b9", dt: 0.1, kind: "counter", from: 16, to: 558, dur: 2.2, label: "Sikh officers, 1884 → 1936", size: 220},
  ],
  question: "Did anyone in your family serve overseas? 👇",
  credit: "Sources: Shanghai Municipal Council · HK Police",
};
