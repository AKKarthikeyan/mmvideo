// Indica Atlas CY03: Galwan and the LAC, "what India says is settled, and what isn't". Script + claim IDs: docs/geo/research/CY03-galwan-lac/script_v1.json.
// ⚑ SENSITIVE (live border dispute). MAP RULES: official India outline from the house dataset only; NO LAC line, no dotted "approximate LAC", no
// colouring of "Indian" or "Chinese" areas at Galwan, no soldiers/flags/red zones. Pins and labels only, "placement only" (research C080-C084:
// Galwan-Shyok about 34.76N, 78.16-78.19E +-0.05 deg; Depsang Plains label centre 35.27N 78.00E; Demchok 32.675N 79.49E; Gogra 34.365N 78.905E;
// Kongka La 34.33N 79.14E; Pangong Tso 33.825N 78.60E). Every contested statement is on screen as "India:" or "China:". Hot Spring is NOT pinned (C083).
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const GALWAN: P = [78.175, 34.76], DEPSANG: P = [78.0, 35.27], DEMCHOK: P = [79.49, 32.675];
const GOGRA: P = [78.905, 34.365], KONGKA: P = [79.14, 34.33], PANGONG: P = [78.6, 33.825];
const GREY = "#9AA3AF";

const WIDE = {lon: 78.7, lat: 34.0, span: 5.4};
export const galwan: Spec = {
  id: "cy03lac", theme: "premium", globe: {lon: 30, lat: 25}, handoff: {lon: 78.7, lat: 34.0, span: 14}, hi: true,
  cams: [{in: "b1", dt: 0.1, dur: 1.2, cam: WIDE}, {in: "b2", dur: 1.2, cam: {lon: 78.2, lat: 35.35, span: 3.0}},
    {in: "b3", dur: 1.2, cam: {lon: 78.7, lat: 34.0, span: 5.0}}, {in: "b4", dur: 1.2, cam: {lon: 78.8, lat: 34.0, span: 4.4}},
    {in: "b5", dur: 1.2, cam: WIDE}, {in: "b6", dur: 1.2, cam: {lon: 78.7, lat: 34.0, span: 6.5}}],
  layers: [
    // b1: the 1996 promise, word for word; LAC explained for a global viewer
    {in: "b1", dt: 0.05, out: "b1", kind: "panel", name: "quoteCard", props: {compact: true, head: "1996 · India–China Agreement, Art. X(1)",
      quote: "exchange maps indicating their respective perceptions of the entire alignment of the line of actual control as soon as possible",
      cite: "the two sides agreed", note: "LAC: the line each side observes pending a boundary settlement (1993)"}},
    // b2: Galwan; the two records at equal size, India left, China right
    {in: "b2", dt: 0.2, out: "b2", kind: "pin", at: GALWAN, text: "GALWAN VALLEY · LADAKH", color: C.white, dy: -75},
    {in: "b2", dt: 0.2, out: "b2", kind: "panel", name: "sideBySide", props: {compact: true, left: {who: "INDIA SAYS", text: "20 personnel died", color: C.amber},
      right: {who: "CHINA SAYS", text: "casualties on both sides", color: C.cyan}, foot: "15 June 2020 · each government's own statement"}},
    // b3: India says disengagement complete; patrols restored at two named places
    {in: "b3", dt: 0.3, out: "b6", kind: "pin", at: DEPSANG, text: "DEPSANG", color: C.green},
    {in: "b3", dt: 0.6, out: "b6", kind: "pin", at: DEMCHOK, text: "DEMCHOK", color: C.green},
    {in: "b3", dt: 0.4, out: "b3", kind: "bigtext", text: "INDIA SAYS: COMPLETE", sub: "patrols restored at two places", color: C.white, size: 110, y: 250},
    // b4: the but: elsewhere "temporary and limited"; troop cuts only to be discussed (2025)
    {in: "b4", dt: 0.1, out: "b5", kind: "pin", at: GALWAN, color: GREY},
    {in: "b4", dt: 0.1, out: "b5", kind: "pin", at: PANGONG, color: GREY},
    {in: "b4", dt: 0.1, out: "b5", kind: "pin", at: GOGRA, color: GREY},
    {in: "b4", dt: 0.1, out: "b5", kind: "pin", at: KONGKA, color: GREY},
    {in: "b4", dt: 0.2, out: "b4", kind: "bigtext", text: "“TEMPORARY AND LIMITED”", sub: "India, on steps elsewhere", color: C.amber, size: 96, y: 250},
    {in: "b4", dt: 2.2, out: "b4", kind: "label", at: [78.8, 33.45], text: "troop cuts: to be discussed (2025)", color: C.white, size: 42},
    {in: "b4", dt: 0.4, out: "b4", kind: "label", at: [79.75, 34.6], text: "other 2020 friction areas", color: GREY, size: 38},
    // b5: the turn: no line is drawn; India's words
    {in: "b5", dt: 0.2, out: "b5", kind: "bigtext", text: "NO COMMON UNDERSTANDING", sub: "in some areas · India, Dec 2024", color: C.white, size: 100, y: 250},
    {in: "b5", dt: 1.8, out: "b5", kind: "label", at: [77.95, 33.55], text: "India's official map outline", sub: "the LAC is not drawn · positions are placement only", color: C.white, size: 40},
    // b6: the loop: 1996 to 2026
    {in: "b6", dt: 0.1, out: "b6", kind: "panel", name: "timeline", props: {items: [{y: "1996", t: "promise: exchange LAC maps"}, {y: "Dec 2024", t: "India: no common understanding in some areas"}, {y: "Aug 2026", t: "talks: ways to improve understanding"}]}},
  ],
  question: "What would a shared map change? 👇",
  credit: "Sources: MEA · MoD · Lok Sabha · 1996 Agreement",
};

galwan.layers.push(
  {in: "b1", dt: 0.4, kind: "icon", name: "scroll", label: "1996"},
  {in: "b3", dt: 0.4, kind: "icon", name: "people", label: "patrols"},
  {in: "b6", dt: 0.6, kind: "icon", name: "clock", label: "30 years"},
);
