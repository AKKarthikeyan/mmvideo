// Indica Atlas W3-13: if India's states were countries. Script + claims: docs/geo/research/W3-13-states-countries/script_v1.json.
// Map care: India-view base only; state fills from Natural Earth admin-1 for the 12 top-50 states (none border-sensitive; no J&K/Ladakh drawn).
// Mexico (states_geo.ts) and Germany (shapes.ts) are MOVED onto Bihar / Rajasthan at true size and labelled "same scale".
// Japan, Mexico, Germany are shown by name in panels. Numbers on screen: C001, C004-C006, C008 only. No GDP. UP not featured (W3-01).
import {Spec, C} from "../engine/GeoShort";
import {DEU_ON_RJ} from "./shapes";
import {MEX_ON_BR} from "./states_geo";

const INDIA = {lon: 80, lat: 22.5, span: 34};
const BR = {lon: 85.6, lat: 25.8, span: 12};
const MH = {lon: 76.2, lat: 19.2, span: 14};
const RJ = {lon: 73.8, lat: 26.6, span: 13};
const TOP12 = ["Uttar Pradesh", "Bihar", "Maharashtra", "West Bengal", "Madhya Pradesh", "Rajasthan", "Tamil Nadu", "Gujarat",
  "Karnataka", "Andhra Pradesh", "Odisha", "Jharkhand"];
const twelve = (b: string, out: string) => TOP12.map((s, i) => ({in: b, dt: 0.05 + 0.12 * i, out, kind: "fill" as const, state: [s], color: C.amber, alpha: 0.4}));

export const states: Spec = {
  id: "w3states", theme: "premium", globe: {lon: 78, lat: 22}, handoff: {lon: 80, lat: 22.5, span: 40}, hi: false,
  cams: [{in: "b1", dt: 0.1, dur: 1.2, cam: INDIA}, {in: "b2", dur: 1.1, cam: BR},
    {in: "b3", dur: 1.3, cam: {lon: 86, lat: 25, span: 40}}, {in: "b4", dur: 1.2, cam: MH},
    {in: "b5", dur: 1.0, cam: {lon: 76.2, lat: 19.6, span: 16}}, {in: "b6", dur: 1.1, cam: RJ},
    {in: "b7", dur: 0.8, cam: {lon: 73.8, lat: 26.6, span: 14}}, {in: "b8", dur: 1.2, cam: INDIA}],
  layers: [
    // b1 hook from frame 0: the twelve states light up one by one
    {in: "b1", out: "b1", kind: "bigtext", text: "12 OF 50", sub: "biggest crowds: Indian states", color: C.white, size: 160, y: 240},
    ...twelve("b1", "b1"),
    // b2 Bihar about as many people as Mexico
    {in: "b2", out: "b3", kind: "fill", state: ["Bihar"], color: C.amber, alpha: 0.45},
    {in: "b2", dt: 0.3, out: "b2", kind: "label", at: [85.6, 25.6], text: "BIHAR", sub: "eastern India", color: C.amber, size: 50},
    {in: "b2", dt: 0.2, out: "b2", kind: "panel", name: "timeline", props: {items: [{y: "132.9 M", t: "BIHAR · 2026, projected"}, {y: "133.0 M", t: "MEXICO · UN, 2026"}]}},
    // b3 Mexico's land, moved onto Bihar at true size
    ...MEX_ON_BR.map((r) => ({in: "b3", dt: 0.3, out: "b3", kind: "fill" as const, poly: r, color: C.cyan, alpha: 0.34})),
    {in: "b3", dt: 0.6, out: "b3", kind: "label", at: [86, 20.6], text: "MEXICO", sub: "moved here · same scale", color: C.cyan, size: 46},
    {in: "b3", dt: 0.2, out: "b3", kind: "bigtext", text: "~20×", sub: "Mexico's land vs Bihar's", color: C.white, size: 150, y: 240},
    // b4 Maharashtra outnumbers Japan
    {in: "b4", out: "b5", kind: "fill", state: ["Maharashtra"], color: C.amber, alpha: 0.45},
    {in: "b4", dt: 0.3, out: "b5", kind: "label", at: [76.4, 19.4], text: "MAHARASHTRA", sub: "western India", color: C.amber, size: 48},
    {in: "b4", dt: 0.2, out: "b4", kind: "panel", name: "timeline", props: {items: [{y: "129.6 M", t: "MAHARASHTRA · 2026, projected"}, {y: "122.4 M", t: "JAPAN · UN, 2026"}]}},
    // b5 the other way round in 2011
    {in: "b5", dt: 0.1, out: "b5", kind: "panel", name: "timeline", props: {items: [{y: "2011", t: "Maharashtra 11.9% behind Japan"}, {y: "2026", t: "Maharashtra 5.8% ahead (projected)"}]}},
    // b6 Rajasthan about as many people as Germany
    {in: "b6", out: "b7", kind: "fill", state: ["Rajasthan"], color: C.amber, alpha: 0.4},
    {in: "b6", dt: 0.3, out: "b6", kind: "label", at: [73.8, 26.4], text: "RAJASTHAN", sub: "north-west India", color: C.amber, size: 48},
    {in: "b6", dt: 0.2, out: "b6", kind: "panel", name: "timeline", props: {items: [{y: "83.9 M", t: "RAJASTHAN · 2026, projected"}, {y: "83.6 M", t: "GERMANY · UN, 2026"}]}},
    // b7 and almost the same land: Germany moved onto Rajasthan at true size
    ...DEU_ON_RJ.map((r) => ({in: "b7", dt: 0.1, out: "b7", kind: "fill" as const, poly: r, color: C.cyan, alpha: 0.3})),
    {in: "b7", dt: 0.3, out: "b7", kind: "label", at: [73.8, 25.8], text: "GERMANY", sub: "moved here · same scale", color: C.cyan, size: 46},
    {in: "b7", dt: 0.2, out: "b7", kind: "bigtext", text: "TWINS", sub: "people and land, almost", color: C.white, size: 150, y: 240},
    // b8 the loop
    ...twelve("b8", "b8"),
    {in: "b8", dt: 0.3, kind: "bigtext", text: "12 OF 50", sub: "biggest crowds · one country", color: C.amber, size: 160, y: 240},
  ],
  question: "Which state would match your country? 👇",
  credit: "Sources: NCP population projections · UN WPP 2024 · Natural Earth",
};

states.layers.push(
  {in: "b2", dt: 0.5, kind: "icon", name: "people", label: "as many"},
  {in: "b5", dt: 0.4, kind: "icon", name: "clock", label: "2011 → 2026"},
  {in: "b7", dt: 0.5, kind: "icon", name: "globe", label: "scale"},
);
