// Indica Atlas W3-12: why so few people live in the western Thar (Jaisalmer). Script + claims: scripts/geo/w3_thar.py, docs/geo/research/W3-12-thar-west.
// Map care: no district geodata in the repo (no Natural Earth admin-2), so Jaisalmer is a hand-drawn APPROXIMATE shape inside 69.5-72.7°E, 26.0-28.0°N,
// labelled "approx.", west edge = India outline moved 0.15° inside (never crosses or traces the international boundary). No border line is drawn or highlighted and no Rajasthan state fill (its west edge is the boundary).
// Density dots are illustrative. Numbers on screen: C001-C006 only, all 2011 census except rain (C005) and groundwater (C006).
import {Spec, C} from "../engine/GeoShort";
import {JSM_APPROX} from "./thar_geo";

type P = [number, number];
const JSM: P[] = JSM_APPROX;   // generated: scripts/geo/w3_thar_geo.py
// zigzag paths so moving dots read as scattered density, not an outline (illustrative)
const zig = (x0: number, x1: number, y0: number, y1: number, rows: number): P[] => Array.from({length: rows}).flatMap((_, i) => { const y = y0 + (y1 - y0) * i / (rows - 1); return (i % 2 ? [[x1, y], [x0, y]] : [[x0, y], [x1, y]]) as P[]; });
const RJ = {lon: 73.6, lat: 26.8, span: 11};
const CLOSE = {lon: 71.3, lat: 27.0, span: 5.5};

export const thar: Spec = {
  id: "w3thar", theme: "premium", globe: {lon: 74, lat: 24}, handoff: {lon: 73.6, lat: 26.8, span: 14}, hi: false,
  cams: [{in: "b1", dt: 0.1, dur: 1.0, cam: RJ}, {in: "b2", dur: 1.1, cam: CLOSE},
    {in: "b3", dur: 1.0, cam: RJ}, {in: "b4", dur: 1.0, cam: {lon: 73.6, lat: 26.4, span: 12}},
    {in: "b5", dur: 1.0, cam: {lon: 71.3, lat: 26.8, span: 6}}, {in: "b6", dur: 1.0, cam: {lon: 71.3, lat: 27.1, span: 5}},
    {in: "b7", dur: 1.0, cam: {lon: 71.3, lat: 26.9, span: 4.5}}, {in: "b8", dur: 1.1, cam: RJ}],
  layers: [
    // Jaisalmer (approx.) stays on throughout
    {in: "b1", dt: 0.5, out: "b8", kind: "fill", poly: JSM, color: C.orange, alpha: 0.32},
    // b1 hook from frame 0
    {in: "b1", out: "b1", kind: "bigtext", text: "11% OF THE LAND", sub: "under 1% of the people · 2011 census", color: C.white, size: 120, y: 230},
    {in: "b1", dt: 1.8, out: "b1", kind: "label", at: [75.6, 26.2], text: "RAJASTHAN", color: C.white, size: 46},
    // b2 where it is
    {in: "b2", dt: 0.6, out: "b2", kind: "label", at: [71.3, 28.45], text: "JAISALMER DISTRICT", sub: "approx. area · Thar Desert", color: C.orange, size: 48},
    {in: "b2", dt: 0.9, out: "b2", kind: "icon", name: "mountain", label: "Thar Desert"},
    // b3 density: 17 vs 200 (2011 census); dots illustrative
    {in: "b3", kind: "counter", from: 0, to: 17, dur: 1.2, suffix: " PER KM²", label: "Jaisalmer · 2011 census", size: 130, y: 240},
    {in: "b3", dt: 0.6, out: "b4", kind: "particles", pts: zig(70.8, 72.1, 26.6, 27.6, 3), count: 4, size: 9, color: C.white, speed: 0.05},
    {in: "b3", dt: 0.9, out: "b4", kind: "particles", pts: zig(74.8, 76.9, 25.3, 27.4, 7), count: 46, size: 9, color: C.amber, speed: 0.05},
    {in: "b3", dt: 0.7, out: "b3", kind: "label", at: [71.4, 25.6], text: "17 / km²", sub: "Jaisalmer", color: C.orange, size: 44},
    {in: "b3", dt: 1.1, out: "b3", kind: "label", at: [75.9, 24.6], text: "200 / km²", sub: "state average · dots illustrative", color: C.amber, size: 44},
    // b4 the rank (2011 boundaries)
    {in: "b4", dt: 0.1, kind: "bigtext", text: "33RD OF 33", sub: "least dense district · 2011 census", color: C.amber, size: 140, y: 230},
    // b5 sparse, not empty
    {in: "b5", kind: "counter", from: 0, to: 669919, dur: 1.4, label: "sparse, not empty · 2011 census", size: 130, y: 240},
    {in: "b5", dt: 0.5, out: "b5", kind: "icon", name: "people", at: [71.3, 27.0], color: C.white, label: "669,919"},
    // b6 the main limit: rain
    {in: "b6", kind: "counter", from: 0, to: 185, dur: 1.2, prefix: "≈", suffix: " MM", label: "rain a year · Jaisalmer normal", size: 130, y: 240, color: C.cyan},
    {in: "b6", dt: 0.4, out: "b6", kind: "icon", name: "drop", at: [71.3, 27.1], color: C.cyan, label: "the main limit: water"},
    // b7 groundwater, deep and salty
    {in: "b7", kind: "counter", from: 0, to: 124, dur: 1.3, suffix: " M DOWN", label: "groundwater, at its deepest · CGWB", size: 120, y: 240, color: C.cyan},
    {in: "b7", dt: 0.3, out: "b7", kind: "line", pts: [[71.3, 27.9], [71.3, 26.2]], color: C.cyan, width: 8, draw: 1.2, arrow: true},
    {in: "b7", dt: 1.4, out: "b7", kind: "label", at: [71.3, 25.75], text: "SALTIER DEEPER", sub: "schematic · CGWB", color: C.cyan, size: 44},
    // b8 the loop
    {in: "b8", dt: 0.2, kind: "bigtext", text: "UNDER 1%", sub: "of the people · 11% of the land", color: C.orange, size: 150, y: 230},
    {in: "b8", dt: 0.6, kind: "icon", name: "drop", color: C.cyan, label: "mainly, water"},
  ],
  question: "Could you live on 185 mm of rain a year? 👇",
  credit: "Sources: Census 2011 (DCHB Jaisalmer; A-02 Rajasthan) · CGWB",
};
