// Indica Atlas extra Short: tnmonsoon (4 Nov 2026). Script: scripts/geo/extra.py; research + claim IDs: docs/geo/research/X1-tn-nemonsoon/.
// Map care: only Natural Earth outlines (India point of view). Wind and storm arrows are ILLUSTRATIVE and labelled so; IMD gives
// the direction of the reversal (south-westerly to north-easterly low-level winds) and that Bay of Bengal systems move west or
// north-west, not exact paths. No mountain range is drawn: IMD names no cause for the rain shadow in the sources we hold.
// IMD's "Tamil Nadu" is the subdivision Tamil Nadu + Puducherry + Karaikal; the fill is the state outline (caption says "IMD").
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const SUMMER: P[] = [[74.6, 8.0], [76.4, 9.4], [77.8, 10.6]];     // south-westerly flow, illustrative
const WINTER: P[] = [[84.2, 14.2], [81.9, 12.6], [79.6, 11.2]];    // north-easterly flow, illustrative
const BAYSYS: P[] = [[88.0, 12.0], [85.0, 12.1], [82.0, 12.3], [80.3, 12.4]];   // west-moving systems, illustrative

const TN = {lon: 78.4, lat: 10.9, span: 6.2};
const SOUTH = {lon: 80.4, lat: 11.7, span: 14};
const INDIA = {lon: 80, lat: 21, span: 33};
export const tnmonsoon: Spec = {
  id: "tnmonsoon", theme: "premium", globe: {lon: 25, lat: 24}, handoff: {lon: 79, lat: 14, span: 14}, hi: true,
  cams: [{in: "b1", dt: 1.7, dur: 1.2, cam: TN}, {in: "b2", dt: 0.1, dur: 1.4, cam: INDIA}, {in: "b3", dt: 0.1, dur: 1.4, cam: TN},
    {in: "b4", dt: 0.1, dur: 1.2, cam: SOUTH}, {in: "b5", cam: SOUTH}, {in: "b6", dt: 0.1, dur: 1.4, cam: {lon: 83.2, lat: 12.4, span: 13}},
    {in: "b7", dt: 0.1, dur: 1.3, cam: TN}, {in: "b8", dt: 0.1, dur: 1.6, cam: {lon: 79.0, lat: 8.8, span: 9.5}}],
  layers: [
    // b1 hook, on screen from frame 0
    {in: "b1", kind: "bigtext", text: "48%", sub: "of Tamil Nadu's yearly rain", size: 230},
    {in: "b1", dt: 1.8, out: "b2", kind: "fill", state: ["Tamil Nadu"], color: C.cyan, alpha: 0.5},
    {in: "b1", dt: 2.0, out: "b1", kind: "label", at: [78.4, 10.9], text: "TAMIL NADU (IMD)", color: C.white, size: 44},
    // b2 India: the summer monsoon share
    {in: "b2", kind: "bigtext", text: "~75%", sub: "of India's rain: June to September", size: 210, y: 1020},
    {in: "b2", dt: 0.4, out: "b3", kind: "fill", iso: ["IND"], color: C.cyan, alpha: 0.2},
    // b3 the paradox: rain shadow in the summer months
    {in: "b3", dt: 0.2, kind: "bigtext", text: "RAIN SHADOW", sub: "Tamil Nadu, June to September (IMD)", color: C.orange, size: 120, stamp: true},
    {in: "b3", out: "b4", kind: "fill", state: ["Tamil Nadu"], color: C.orange, alpha: 0.45},
    // b4 October
    {in: "b4", dt: 0.2, kind: "bigtext", text: "OCTOBER", sub: "the summer monsoon withdraws", size: 150},
    {in: "b4", out: "b4", kind: "fill", state: ["Tamil Nadu"], color: C.white, alpha: 0.15},
    // b5 winds reverse (illustrative arrows)
    {in: "b5", dt: 0.1, kind: "bigtext", text: "WINDS REVERSE", sub: "south-westerly → north-easterly", size: 112, y: 330},
    {in: "b5", dt: 0.3, out: "b5", kind: "line", pts: SUMMER, color: C.cyan, width: 9, dash: true, arrow: true, draw: 1.0},
    {in: "b5", dt: 1.7, out: "b5", kind: "line", pts: WINTER, color: C.amber, width: 11, arrow: true, draw: 1.1},
    {in: "b5", dt: 0.5, out: "b5", kind: "label", at: [75.4, 7.1], text: "summer flow", color: C.cyan, size: 40},
    {in: "b5", dt: 1.9, out: "b5", kind: "label", at: [82.6, 15.2], text: "winter flow: illustrative", color: C.amber, size: 36},
    {in: "b5", out: "b5", kind: "fill", state: ["Tamil Nadu"], color: C.white, alpha: 0.12},
    // b6 Bay of Bengal systems
    {in: "b6", dt: 0.2, out: "b6", kind: "label", at: [85.8, 10.0], text: "BAY OF BENGAL", color: C.cyan, size: 48},
    {in: "b6", dt: 0.6, out: "b6", kind: "line", pts: BAYSYS, color: C.amber, width: 12, arrow: true, draw: 1.3},
    {in: "b6", dt: 1.4, out: "b6", kind: "label", at: [84.2, 13.6], text: "low-pressure systems: path illustrative", color: C.white, size: 32},
    {in: "b6", dt: 0.1, kind: "bigtext", text: "+ RAIN", sub: "from the east", color: C.green, size: 130, y: 330, stamp: true},
    {in: "b6", out: "b6", kind: "fill", state: ["Tamil Nadu"], color: C.green, alpha: 0.3},
    // b7 chief rainy season
    {in: "b7", dt: 0.2, kind: "bigtext", text: "CHIEF RAINY SEASON", sub: "north-east monsoon · October to December", color: C.green, size: 100, stamp: true},
    {in: "b7", out: "b8", kind: "fill", state: ["Tamil Nadu"], color: C.green, alpha: 0.5},
    // b8 echo: the 48% again
    {in: "b8", dt: 0.1, kind: "bigtext", text: "48%", sub: "after the summer monsoon ends", size: 230},
    {in: "b8", kind: "fill", state: ["Tamil Nadu"], color: C.cyan, alpha: 0.5},
  ],
  question: "Which month does your town's rain arrive? 👇", credit: "Source: IMD Chennai · IMD NEMSOF-2026",
};

// premium motion (AK 26 Oct 2026): one animated icon per beat, lower-left slot
tnmonsoon.layers.push(
  {in: "b1", dt: 0.35, kind: "icon", name: "drop", label: "48%"},
  {in: "b2", dt: 0.35, kind: "icon", name: "globe", label: "India"},
  {in: "b3", dt: 0.35, kind: "icon", name: "drop", label: "rain shadow"},
  {in: "b4", dt: 0.35, kind: "icon", name: "clock", label: "October"},
  {in: "b5", dt: 0.35, kind: "icon", name: "compass", label: "winds reverse"},
  {in: "b6", dt: 0.35, kind: "icon", name: "waves", label: "Bay of Bengal"},
  {in: "b7", dt: 0.35, kind: "icon", name: "rice", label: "chief season"},
  {in: "b8", dt: 0.35, kind: "icon", name: "drop", label: "48%"},
);
