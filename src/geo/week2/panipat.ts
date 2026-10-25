// Indica Atlas week 2: panipat. Script lines: scripts/geo/week2.py; sources: docs/geo/week2/drafts/panipat.md.
// Map care: the US is outside the map texture, so the import line starts at the map's left edge with a "from the USA"
// label and is marked "schematic route". Export arrows in b9 end in open sea and are marked "illustrative" (no
// destination is claimed). Beat 3 shows only Panipat and Delhi pins with a 90 km ruler. No brands, photos or judgement.
import {Spec, Layer, C} from "../engine/GeoShort";

type P = [number, number];
const PANIPAT: P = [76.97, 29.39], DELHI: P = [77.21, 28.61];
const FROM_US: P[] = [[0.3, 33.5], [12, 34], [26, 32], [40, 27], [54, 21.5], [63, 21], [69.5, 22.4]];
const OUT: P[][] = [[PANIPAT, [71, 26], [63, 22]], [PANIPAT, [72.5, 21], [67, 15]], [PANIPAT, [82, 23], [88, 16]]];

const WORLD = {lon: 44, lat: 27, span: 58};   // keeps the frame inside the map texture (no black edge)
const CITY = {lon: 77.06, lat: 28.9, span: 2.4};
export const panipat: Spec = {
  id: "panipat", globe: {lon: -74, lat: 40.7}, handoff: {lon: 78, lat: 22, span: 30}, hi: true,
  cams: [{in: "b1", dt: 1.65, dur: 2.6, cam: {lon: 78, lat: 23, span: 25}}, {in: "b2", dur: 1.0, cam: WORLD},
    {in: "b3", dur: 1.4, cam: CITY}, {in: "b4", dur: 1.6, cam: {lon: 76.97, lat: 29.2, span: 2.0}},
    {in: "b5", dur: 2.5, cam: {lon: 76.97, lat: 29.25, span: 1.8}}, {in: "b6", dur: 3.0, cam: {lon: 77.0, lat: 29.1, span: 2.2}},
    {in: "b8", dur: 1.6, cam: {lon: 77.5, lat: 26.5, span: 12}}, {in: "b9", dur: 1.4, cam: {lon: 77, lat: 16, span: 36}}],
  layers: [
    // b1 hook: counter from frame 0
    {in: "b1", kind: "counter", from: 0, to: 160000, dur: 1.8, prefix: "~", suffix: " t", label: "used clothes into India · 2024", size: 170},
    {in: "b1", dt: 1.8, out: "b1", kind: "label", at: [79, 22.5], text: "INDIA", size: 70},
    // b2 58% from the USA (schematic route from the left edge of the map)
    {in: "b2", kind: "counter", from: 0, to: 58, dur: 1.0, suffix: "%", label: "from the USA", size: 200},
    {in: "b2", dt: 0.3, out: "b2", kind: "line", pts: FROM_US, color: C.amber, width: 14, arrow: true, draw: 1.0},
    {in: "b2", dt: 0.3, out: "b2", kind: "label", at: [28, 37], text: "← from the USA", color: C.amber, size: 50},
    {in: "b2", dt: 0.6, out: "b2", kind: "label", at: [40, 21], text: "schematic route", size: 38},
    // b3 Panipat, 90 km from Delhi
    {in: "b3", dt: 0.9, out: "b8", kind: "pin", at: PANIPAT, text: "PANIPAT", color: C.amber},
    {in: "b3", dt: 1.1, out: "b3", kind: "pin", at: DELHI, text: "Delhi", color: C.white, dy: 62},
    {in: "b3", dt: 1.3, out: "b3", kind: "ruler", a: DELHI, b: PANIPAT, text: ""},
    {in: "b3", dt: 1.7, out: "b3", kind: "label", at: [77.3, 29.0], text: "90 km", color: C.amber, size: 64},
    // b4 nickname
    {in: "b4", dt: 0.1, kind: "bigtext", text: "\"CAST-OFF CAPITAL\"", stamp: true, size: 120},
    // b5 City of Weavers
    {in: "b5", dt: 0.1, kind: "bigtext", text: "CITY OF WEAVERS", sub: "already full of mills", size: 130},
    // b6 cut at customs
    {in: "b6", dt: 0.1, kind: "bigtext", text: "CUT UP AT CUSTOMS", sub: "so no one can wear them again", color: C.red, stamp: true, size: 120},
    // b7 sort, shred, spin
    {in: "b7", kind: "panel", name: "tiles", props: {words: ["SORT by colour →", "SHRED into fibre →", "SPIN into yarn"]}},
    // b8 shoddy
    {in: "b8", dt: 0.1, kind: "bigtext", text: "\"SHODDY\"", sub: "an English method · early 1800s", size: 150},
    // b9 back out as blankets
    {in: "b9", dt: 0.4, kind: "pin", at: PANIPAT, text: "PANIPAT", color: C.amber},
    ...OUT.map((pts, i): Layer => ({in: "b9", dt: 0.6 + i * 0.25, kind: "line", pts, color: C.green, width: 10, arrow: true, draw: 0.9})),
    {in: "b9", dt: 1.2, kind: "label", at: [80, 12.5], text: "routes illustrative", size: 38},
    {in: "b9", dt: 0.1, kind: "bigtext", text: "OLD CLOTHES → BLANKETS", sub: "many for refugee camps", size: 80},
  ],
  question: "Where do your old clothes go? 👇", credit: "Sources: UN Comtrade · Panipat district · CESTAT",
};
