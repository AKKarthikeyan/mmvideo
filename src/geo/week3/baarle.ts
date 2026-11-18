// Indica Atlas W3-03: Baarle, the treaty that writes "the limit is interrupted" (global slot · G5 The Line · F4 Cold Case).
// Script + claims: scripts/geo/w3_baarle.py, docs/geo/research/W3-03-baarle/script_v1.json (C001-C003, C005, C007, C008, C014, C016, C017).
// Map care: the enclaves are a few hundred metres across, far below the satellite texture, so they are drawn as a labelled SCHEMATIC:
// official Kadaster (PDOK) and Digitaal Vlaanderen polygons, ENLARGED at uniform scale into an inset card above the real spot
// (scripts/geo/w3_baarle_geo.py → baarle_geo.ts). No border dispute exists here; no side taken. No cafes, no houses (unverified).
import {Spec, C, Layer} from "../engine/GeoShort";
import {BAARLE_A, BAARLE_C, BAARLE_CARD, BAARLE_REAL} from "./baarle_geo";

const LOC = {lon: 5.6, lat: 51.44, span: 10};          // Netherlands + Belgium, Baarle at x≈468
const SCH = {lon: 4.93, lat: 51.878, span: 4};          // must equal CAM_* in scripts/geo/w3_baarle_geo.py
const COS0 = Math.cos(51.44 * Math.PI / 180);
type P = [number, number];
const sc = (x: number, y: number): P => [SCH.lon + (x - 540) * SCH.span / 1080, SCH.lat - (y - 960) * SCH.span * COS0 / 1080];   // screen → map at SCH

const NL = C.orange, BE = C.cyan, INK = "#0B0F17";
type V = typeof BAARLE_A;
const view = (v: V, inn: string, out: string, dt: number): Layer[] => [
  {in: inn, dt, out, kind: "fill", poly: v.body, color: NL, alpha: 0.5},
  ...v.be.map((r) => ({in: inn, dt: dt + 0.3, out, kind: "fill" as const, poly: r, color: BE, alpha: 0.8})),
  ...v.nl.map((r, i) => ({in: inn, dt: dt + 0.6 + i * 0.08, out, kind: "fill" as const, poly: r, color: NL, alpha: 0.9})),
];

export const baarle: Spec = {
  id: "w3baarle", theme: "premium", globe: {lon: 15, lat: 40}, handoff: LOC, hi: false,
  cams: [{in: "b1", dt: 0.1, dur: 1.0, cam: {lon: 5.4, lat: 51.44, span: 9}}, {in: "b2", dur: 1.2, cam: {lon: 5.6, lat: 51.3, span: 10}},
    {in: "b3", dur: 1.0, cam: SCH}],
  layers: [
    // b1 hook: the treaty line stops at one town
    {in: "b1", out: "b1", kind: "bigtext", text: "INTERRUPTED", sub: "1843 border treaty, at one town", color: C.white, size: 130, y: 225},
    {in: "b1", dt: 0.6, out: "b2", kind: "pin", at: [4.93, 51.44], text: "BAARLE", color: C.amber},
    // b2 where: the Netherlands and Belgium
    {in: "b2", dt: 0.1, out: "b2", kind: "fill", iso: ["NLD"], color: NL, alpha: 0.28},
    {in: "b2", dt: 0.4, out: "b2", kind: "fill", iso: ["BEL"], color: BE, alpha: 0.28},
    {in: "b2", dt: 0.3, out: "b2", kind: "label", at: [6.0, 52.6], text: "NETHERLANDS", color: NL, size: 46},
    {in: "b2", dt: 0.6, out: "b2", kind: "label", at: [4.6, 50.3], text: "BELGIUM", color: BE, size: 46},
    {in: "b2", dt: 0.2, out: "b2", kind: "bigtext", text: "1843", sub: "Netherlands–Belgium boundary treaty", color: C.white, size: 140, y: 225},
    // b3-b8 the inset card (schematic) above the real spot
    {in: "b3", dt: 0.5, out: "b8", kind: "fill", poly: BAARLE_CARD, color: INK, alpha: 1},
    {in: "b3", dt: 0.5, out: "b8", kind: "fill", poly: BAARLE_CARD, color: INK, alpha: 1},
    {in: "b3", dt: 0.7, out: "b8", kind: "label", at: sc(490, 548), text: "SCHEMATIC", sub: "enlarged · Kadaster + Flemish official maps", color: C.white, size: 34},
    {in: "b3", dt: 0.6, out: "b7", kind: "line", pts: [[BAARLE_REAL[0], 51.47], sc(540, 1080)], color: C.white, width: 4, dash: true},
    {in: "b3", dt: 0.4, out: "b7", kind: "pin", at: BAARLE_REAL, color: C.amber},
    {in: "b3", dt: 1.2, out: "b7", kind: "label", at: sc(250, 1140), text: "DUTCH", color: NL, size: 40},
    {in: "b3", dt: 1.4, out: "b7", kind: "label", at: sc(830, 1140), text: "BELGIAN", color: BE, size: 40},
    ...view(BAARLE_A, "b3", "b5", 0.8),
    {in: "b3", dt: 0.3, out: "b3", kind: "bigtext", text: "STATUS QUO", sub: "1842 treaty, Article 14", color: C.white, size: 110, y: 225},
    // b4 thirty enclaves
    {in: "b4", dt: 0.1, out: "b4", kind: "counter", from: 0, to: 30, dur: 1.4, suffix: " ENCLAVES", label: "today, official maps", size: 110, y: 225},
    // b5 22 Belgian pieces inside Dutch land: the PDOK holes light up
    ...BAARLE_A.holes.map((r, i) => ({in: "b5", dt: 0.2 + i * 0.05, out: "b5", kind: "fill" as const, poly: r, color: C.white, alpha: 0.85})),
    {in: "b5", dt: 0.1, out: "b5", kind: "bigtext", text: "22 BELGIAN", sub: "enclaves inside Dutch land", color: BE, size: 110, y: 225},
    // b6 close-up of the largest Belgian enclave: six Dutch pieces inside
    ...view(BAARLE_C, "b6", "b6", 0.1),
    {in: "b6", dt: 0.2, out: "b6", kind: "bigtext", text: "6 DUTCH", sub: "pieces inside the largest Belgian enclave", color: NL, size: 110, y: 225},
    // b7 the 1892 swap that lapsed
    ...view(BAARLE_A, "b7", "b8", 0.1),
    {in: "b7", dt: 0.3, out: "b7", kind: "bigtext", text: "LAPSED", sub: "1892 swap deal · Belgian bill, 1894", color: C.red, size: 120, y: 225, stamp: true},
    // b8 loop back to the hook
    {in: "b8", dt: 0.2, out: "b8", kind: "bigtext", text: "INTERRUPTED", sub: "“the limit is interrupted” · 1843", color: C.white, size: 120, y: 225},
  ],
  question: "Which odd border should we map next? 👇",
  credit: "Sources: 1843 treaty · Kadaster · Digitaal Vlaanderen · Belgian Chamber",
};

baarle.layers.push(
  {in: "b1", dt: 0.9, kind: "icon", name: "scroll", x: 110, y: 1230, label: "1843 treaty"},
  {in: "b4", dt: 0.5, kind: "icon", name: "globe", x: 110, y: 1250, label: "30 enclaves"},
  {in: "b7", dt: 0.6, kind: "icon", name: "clock", x: 110, y: 1250, label: "lapsed 1894"},
);
