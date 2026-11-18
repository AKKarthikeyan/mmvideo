// Indica Atlas cyclone Short CY05: the Krishna-Godavari delta (3 Nov 2026). Script + claim IDs: docs/geo/research/CY05-kg-delta/script_v1.json.
// Map care: official India outline and state fill (house dataset). River lines are Natural Earth 1:10m centrelines (simplified). The risk-zone arc follows the
// house coastline from Bapatla (80.49E 15.84N) to Kakinada (82.29E 17.00N), the limits IMD names (claim C101). Murasu points are IMD's forecast table (NB 17).
// "Divi Seema" pin is approximate (labelled). No names of the dead.
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const KRISHNA: P[] = [[79.97, 16.65], [80.15, 16.65], [80.39, 16.57], [80.6, 16.51], [80.78, 16.31], [80.88, 16.01]];
const GODAVARI: P[] = [[81.3, 17.49], [81.58, 17.42], [81.67, 17.31], [81.7, 17.1], [81.76, 16.96]];
const GODAVARI_E: P[] = [[81.76, 16.96], [81.85, 16.77], [82.03, 16.7], [82.34, 16.7]];
const GODAVARI_W: P[] = [[81.76, 16.96], [81.79, 16.72], [81.85, 16.5], [81.72, 16.44], [81.71, 16.31]];
const ZONE: P[] = [[80.49, 15.84], [80.66, 15.9], [80.92, 15.97], [81.16, 16.06], [81.25, 16.32], [81.47, 16.36], [81.78, 16.34], [82.02, 16.44], [82.26, 16.57], [82.29, 17.0]];
const MURASU: P[] = [[80.6, 14.9], [80.3, 15.1], [80.0, 15.6], [79.8, 15.9]];   // IMD forecast 2030, 2330, 0530, 1130 IST
const BAPATLA: P = [80.47, 15.9], DIVI: P = [80.95, 15.97];

const DELTA = {lon: 81.2, lat: 16.3, span: 5.2};
export const kgdelta: Spec = {
  id: "cy05kgdelta", theme: "premium", globe: {lon: 30, lat: 25}, handoff: {lon: 81.2, lat: 16.3, span: 9}, hi: true,
  cams: [{in: "b1", dt: 0.1, dur: 1.0, cam: DELTA}, {in: "b2", dur: 1.0, cam: {lon: 81.4, lat: 16.4, span: 4.4}},
    {in: "b3", dur: 1.2, cam: {lon: 80.6, lat: 15.7, span: 4.2}}, {in: "b4", dur: 1.2, cam: {lon: 81.0, lat: 16.2, span: 3.2}},
    {in: "b5", dur: 1.2, cam: {lon: 80.9, lat: 16.0, span: 3.0}}, {in: "b6", dur: 1.2, cam: {lon: 81.0, lat: 16.2, span: 5.5}}],
  layers: [
    {in: "b1", kind: "fill", state: ["Andhra Pradesh"], color: C.amber, alpha: 0.2},
    // rivers stay for the whole Short
    {in: "b1", dt: 0.2, out: "end", kind: "line", pts: KRISHNA, color: C.cyan, width: 7, draw: 1.2},
    {in: "b1", dt: 0.2, out: "end", kind: "line", pts: GODAVARI, color: C.cyan, width: 7, draw: 1.2},
    {in: "b1", dt: 1.0, out: "end", kind: "line", pts: GODAVARI_E, color: C.cyan, width: 6, draw: 0.8},
    {in: "b1", dt: 1.0, out: "end", kind: "line", pts: GODAVARI_W, color: C.cyan, width: 6, draw: 0.8},
    // b1 hook: the number from frame 0
    {in: "b1", kind: "bigtext", text: "5–7 m", sub: "surge possible · IMD zone figure", color: C.white, size: 200, y: 250},
    {in: "b1", dt: 1.6, out: "b1", kind: "label", at: [80.4, 16.9], text: "KRISHNA", color: C.cyan, size: 42},
    {in: "b1", dt: 1.8, out: "b1", kind: "label", at: [81.9, 17.5], text: "GODAVARI", color: C.cyan, size: 42},
    // b2 the very high risk zone
    {in: "b2", dt: 0.1, out: "end", kind: "line", pts: ZONE, color: C.red, width: 16, draw: 1.4},
    {in: "b2", dt: 0.3, out: "b2", kind: "pin", at: ZONE[0], text: "BAPATLA", color: C.white, dy: 75},
    {in: "b2", dt: 0.9, out: "b2", kind: "pin", at: ZONE[ZONE.length - 1], text: "KAKINADA", color: C.white, dy: -75},
    {in: "b2", dt: 1.1, kind: "bigtext", text: "VERY HIGH RISK", sub: "IMD's storm-surge zone", color: C.red, stamp: true, size: 96, y: 250},
    // b3 Murasu's forecast surge
    {in: "b3", dt: 0.1, out: "b3", kind: "line", pts: MURASU, color: C.white, width: 8, dash: true, draw: 1.0, arrow: true},
    {in: "b3", kind: "pin", at: MURASU[0], text: "MURASU", color: C.amber, dy: 70},
    {in: "b3", dt: 0.6, out: "b3", kind: "pin", at: BAPATLA, text: "BAPATLA", color: C.white, dy: -75},
    {in: "b3", dt: 0.3, kind: "bigtext", text: "1–1.5 m", sub: "Murasu's forecast peak surge · IMD", color: C.cyan, size: 180, y: 250},
    // b4 1990: standing water
    {in: "b4", dt: 0.2, kind: "counter", from: 0, to: 11, dur: 1.4, label: "days: water still standing · Krishna delta, May 1990", color: C.cyan, size: 260, y: 250},
    // b5 1977 Divi Seema
    {in: "b5", dt: 0.1, out: "b5", kind: "pin", at: DIVI, text: "DIVI SEEMA · 1977", color: C.amber, dy: -80},
    {in: "b5", dt: 0.5, out: "b5", kind: "label", at: [81.35, 15.55], text: "position approximate", color: "#C8CCD2", size: 34},
    {in: "b5", dt: 0.3, kind: "counter", from: 0, to: 10000, dur: 1.8, prefix: "≈ ", label: "died · 1977 · surge blamed", color: C.amber, size: 190, y: 250},
    // b6 the loop
    {in: "b6", kind: "bigtext", text: "1.5 m → 5–7 m", sub: "forecast now · possible on this coast", color: C.white, size: 120, y: 250},
  ],
  question: "Is your coast ready? 👇",
  credit: "Sources: IMD · NDMA",
};

kgdelta.layers.push(
  {in: "b1", dt: 0.4, kind: "icon", name: "waves", label: "surge"},
  {in: "b2", dt: 0.4, kind: "icon", name: "shield", label: "risk zone"},
  {in: "b4", dt: 0.4, kind: "icon", name: "drop", label: "1990"},
  {in: "b5", dt: 0.4, kind: "icon", name: "people", label: "1977"},
);
