// Indica Atlas extra Short: hormuz (5 Nov 2026). Script: scripts/geo/extra.py; research + claim IDs: docs/geo/research/X2-hormuz/.
// Map care (sensitive, war context): Natural Earth outlines only (India point of view); no border is the subject; only the strait
// and country names from EIA ("between Oman and Iran") are labelled; no sea name is printed. The route to Asia is ILLUSTRATIVE.
// Every figure is dated 2024 (EIA, 16 Jun 2025). Nothing on screen says who closed the strait or why.
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const STRAIT: P = [56.45, 26.5];
const ROUTE: P[] = [[56.45, 26.5], [60.5, 24.6], [66, 20.5], [72, 14.5], [77, 7.4], [81, 5.4], [90, 5.2], [98, 5.6], [103.6, 1.9], [106.5, 7], [112, 14], [118.5, 21], [123, 28], [127, 32.5]];

const CLOSE = {lon: 56.5, lat: 26.4, span: 4.6};
const GULF = {lon: 56.5, lat: 25.3, span: 11};
const ASIA = {lon: 90, lat: 22, span: 62};
export const hormuz: Spec = {
  id: "hormuz", theme: "premium", globe: {lon: 20, lat: 30}, handoff: {lon: 57, lat: 26, span: 12}, hi: true,
  cams: [{in: "b1", dt: 1.7, dur: 1.2, cam: CLOSE}, {in: "b2", dt: 0.1, dur: 1.3, cam: GULF}, {in: "b3", dt: 0.1, dur: 1.6, cam: ASIA},
    {in: "b4", cam: ASIA}, {in: "b5", dt: 0.1, dur: 1.4, cam: {lon: 66, lat: 23, span: 34}}, {in: "b6", dt: 0.1, dur: 1.4, cam: ASIA},
    {in: "b7", dt: 0.1, dur: 1.6, cam: {lon: 66, lat: 22, span: 38}}],
  layers: [
    // b1 hook, on screen from frame 0
    {in: "b1", kind: "bigtext", text: "~1 IN 5", sub: "barrels of the world's oil, 2024", size: 230},
    {in: "b1", dt: 1.8, out: "b2", kind: "pin", at: STRAIT, text: "STRAIT OF HORMUZ", color: C.amber, size: 46},
    // b2 where: Oman and Iran
    {in: "b2", out: "b2", kind: "fill", iso: ["OMN"], color: C.white, alpha: 0.14},
    {in: "b2", out: "b2", kind: "fill", iso: ["IRN"], color: C.white, alpha: 0.14},
    {in: "b2", dt: 0.5, out: "b2", kind: "label", at: [57.6, 22.6], text: "OMAN", color: C.white, size: 44},
    {in: "b2", dt: 0.5, out: "b2", kind: "label", at: [53.6, 27.9], text: "IRAN", color: C.white, size: 44},
    {in: "b2", dt: 0.2, kind: "bigtext", text: "OMAN | IRAN", sub: "the Strait of Hormuz", size: 120, y: 330},
    // b3 where it goes: 84% to Asia
    {in: "b3", dt: 0.1, kind: "bigtext", text: "84%", sub: "of its crude goes to Asia (2024)", size: 230, y: 930},
    {in: "b3", dt: 0.3, out: "b7", kind: "line", pts: ROUTE, color: C.amber, width: 9, arrow: true, draw: 3.0, flow: true},
    {in: "b3", dt: 3.1, out: "b3", kind: "label", at: [96, 11.5], text: "route: illustrative", color: C.white, size: 36},
    {in: "b3", out: "b7", kind: "pin", at: STRAIT, text: "HORMUZ", color: C.amber, size: 40},
    // b4 the four top buyers
    {in: "b4", dt: 0.1, kind: "bigtext", text: "TOP DESTINATIONS", sub: "China · India · Japan · South Korea", size: 100, y: 930},
    {in: "b4", out: "b6", kind: "fill", iso: ["CHN"], color: C.cyan, alpha: 0.6},
    {in: "b4", dt: 0.3, out: "b6", kind: "fill", iso: ["IND"], color: C.cyan, alpha: 0.6},
    {in: "b4", dt: 0.6, out: "b6", kind: "fill", iso: ["JPN"], color: C.cyan, alpha: 0.6},
    {in: "b4", dt: 0.9, out: "b6", kind: "fill", iso: ["KOR"], color: C.cyan, alpha: 0.6},
    // b5 the United States: a number, not a map
    {in: "b5", dt: 0.1, kind: "bigtext", text: "~2%", sub: "of US petroleum use arrives via Hormuz (2024)", color: C.green, size: 230, y: 930, stamp: true},
    // b6 EIA's judgement
    {in: "b6", dt: 0.1, kind: "bigtext", text: "ASIA, LIKELY HARDEST HIT", sub: "EIA: \"would likely be most affected\"", color: C.amber, size: 84, y: 930, stamp: true},
    // b7 echo
    {in: "b7", dt: 0.1, kind: "bigtext", text: "~1 IN 5", sub: "barrels · most of the crude bound for Asia", size: 230, y: 820},
    {in: "b7", out: "b7", kind: "fill", iso: ["CHN"], color: C.cyan, alpha: 0.45},
    {in: "b7", out: "b7", kind: "fill", iso: ["IND"], color: C.cyan, alpha: 0.45},
    {in: "b7", out: "b7", kind: "fill", iso: ["JPN"], color: C.cyan, alpha: 0.45},
    {in: "b7", out: "b7", kind: "fill", iso: ["KOR"], color: C.cyan, alpha: 0.45},
  ],
  question: "Does your city's fuel arrive by sea? 👇", credit: "Source: US EIA, 16 Jun 2025 (2024 data)",
};

// premium motion (AK 26 Oct 2026): one animated icon per beat, lower-left slot
hormuz.layers.push(
  {in: "b1", dt: 0.35, kind: "icon", name: "rig", label: "~1 in 5"},
  {in: "b2", dt: 0.35, kind: "icon", name: "anchor", label: "the strait"},
  {in: "b3", dt: 0.35, kind: "icon", name: "ship", label: "to Asia", y: 1290},
  {in: "b4", dt: 0.35, kind: "icon", name: "factory", label: "top destinations", y: 1290},
  {in: "b5", dt: 0.35, kind: "icon", name: "drop", label: "US: ~2%", y: 1290},
  {in: "b6", dt: 0.35, kind: "icon", name: "people", label: "Asia", y: 1290},
  {in: "b7", dt: 0.35, kind: "icon", name: "ship", label: "~1 in 5"},
);
