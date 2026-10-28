// Indica Atlas cyclone Short CY01: how Odisha cut cyclone deaths. Script + claim IDs: docs/geo/research/CY01-odisha-deaths/script_v1.json.
// Map care: official India outline only (house dataset). Storm positions are IMD points (claim C049); the 1999 pin is the midpoint of
// IMD's two track points either side of landfall and is labelled "near Paradip". Shelter dots, the surge arrow and the evacuation dots are
// ARTISTIC (illustrative, labelled so); they never imply a shelter count or a place for a specific storm. No names of the dead.
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const P1999: P = [86.35, 20.2];       // IMD track: 19.9N 86.7E (03 UTC, sea) to 20.5N 86.0E (06 UTC, inland): midpoint, "near Paradip"
const PHAILIN: P = [84.9, 19.2];      // IMD landfall point, C049 (near Gopalpur)
// Schematic coastline for the illustrative shelter dots (ARTISTIC)
const COAST: P[] = [[87.0, 21.5], [86.9, 21.0], [86.75, 20.6], [86.6, 20.3], [86.2, 19.95], [85.8, 19.75], [85.4, 19.55], [85.0, 19.3], [84.8, 19.1]];
// Illustrative evacuation flow: coast to inland (ARTISTIC)
const MOVE_A: P[] = [[86.7, 20.5], [86.3, 20.7], [85.9, 20.9]];
const MOVE_B: P[] = [[85.2, 19.45], [84.9, 19.7], [84.6, 19.95]];
const SURGE: P[] = [[87.15, 20.1], [86.75, 20.2], [86.35, 20.3]];   // the sea running inland (ARTISTIC)

const WIDE = {lon: 85.7, lat: 20.3, span: 6.5};
export const odisha: Spec = {
  id: "cy01odisha", theme: "premium", globe: {lon: 30, lat: 25}, handoff: {lon: 85.7, lat: 20.3, span: 9}, hi: true,
  cams: [{in: "b1", dt: 0.1, dur: 1.0, cam: WIDE}, {in: "b2", dur: 1.0, cam: {lon: 86.3, lat: 20.3, span: 3.2}},
    {in: "b3", dur: 0.9, cam: WIDE}, {in: "b4", dur: 1.2, cam: {lon: 85.8, lat: 20.3, span: 5.0}},
    {in: "b5", dur: 1.0, cam: {lon: 85.5, lat: 19.9, span: 4.0}}, {in: "b6", dur: 1.0, cam: {lon: 85.5, lat: 20.0, span: 4.2}},
    {in: "b7", dur: 0.8, cam: {lon: 85.3, lat: 19.6, span: 3.4}}, {in: "b8", dur: 1.2, cam: WIDE},
    {in: "b9", dur: 1.0, cam: {lon: 85.7, lat: 20.3, span: 7.5}}],
  layers: [
    {in: "b1", kind: "fill", state: ["Odisha"], color: C.amber, alpha: 0.28},
    // b1 hook: the count from frame 0, then the pin lands
    {in: "b1", kind: "counter", from: 0, to: 9887, dur: 1.6, label: "dead · Odisha, 1999", size: 200},
    {in: "b1", dt: 1.9, out: "b1", kind: "pin", at: P1999, text: "near Paradip", color: C.amber, dy: -95},
    {in: "b2", kind: "pin", at: P1999, color: C.amber},
    // b2 the sea did the killing
    {in: "b2", dt: 0.2, out: "b2", kind: "line", pts: SURGE, color: C.cyan, width: 12, draw: 1.2, arrow: true},
    {in: "b2", dt: 0.5, out: "b2", kind: "label", at: [87.1, 20.62], text: "SEA SURGE", sub: "most deaths · path illustrative", color: C.cyan, size: 50},
    {in: "b2", dt: 0.2, kind: "bigtext", text: "MOST DROWNED", sub: "the sea, not the wind", color: C.white, size: 120, y: 260},
    // b3 two months later
    {in: "b3", kind: "panel", name: "timeline", props: {items: [{y: "29 Oct 1999", t: "super cyclone"}, {y: "28 Dec 1999", t: "disaster authority set up"}]}},
    // b4 shelters
    {in: "b4", dt: 0.2, out: "b4", kind: "particles", pts: COAST, count: 22, color: C.cyan, size: 12, speed: 0.02},
    {in: "b4", dt: 0.3, out: "b4", kind: "label", at: [86.9, 19.45], text: "HUNDREDS OF SHELTERS", sub: "positions illustrative", color: C.cyan, size: 48},
    // b5 Phailin 2013
    {in: "b5", dt: 0.2, out: "b7", kind: "pin", at: P1999, text: "1999", color: C.amber, dy: -75},
    {in: "b5", dt: 0.5, out: "b7", kind: "pin", at: PHAILIN, text: "PHAILIN · 2013", color: C.white, dy: 70},
    {in: "b5", dt: 0.6, out: "b5", kind: "label", at: [86.4, 19.05], text: "STRONGEST SINCE 1999", color: C.white, size: 42},
    // b6 the order, then the people moved
    {in: "b6", dt: 0.1, out: "b6", outAt: -2.8, kind: "bigtext", text: "ZERO CASUALTY", sub: "the order", color: C.amber, size: 110, y: 250},
    {in: "b6", dt: 1.7, kind: "bigtext", text: "9.84 LAKH", sub: "moved out of its way", color: C.white, size: 150, y: 250},
    {in: "b6", dt: 1.5, out: "b6", kind: "particles", pts: MOVE_B, count: 14, color: C.green, size: 11, speed: 0.07},
    {in: "b6", dt: 1.6, out: "b6", kind: "particles", pts: MOVE_A, count: 10, color: C.green, size: 11, speed: 0.07},
    // b7 the turn: hold on the 21
    {in: "b7", kind: "counter", from: 0, to: 21, dur: 0.9, label: "died in the storm", color: C.white, size: 300},
    // b8 the drop, then the floods
    {in: "b8", dt: 0.1, out: "b8", kind: "bars", unit: "deaths", y: 430, items: [{label: "1999 super cyclone", value: 9887, color: C.amber}, {label: "2013 Phailin", value: 21, color: C.cyan}]},
    {in: "b8", dt: 2.6, kind: "bigtext", text: "FLOODS KILLED MORE", sub: "than the storm itself", color: C.red, stamp: true, size: 92, y: 215},
    // b9 the loop: both storms, one open question
    {in: "b9", kind: "label", at: [85.0, 21.55], text: "OUTRAN THE SEA", color: C.cyan, size: 52},
    {in: "b9", dt: 0.4, kind: "bigtext", text: "THE FLOODS?", sub: "the next test", color: C.red, size: 150, y: 260},
  ],
  question: "Which coast should learn from this? 👇",
  credit: "Sources: IMD · Govt of Odisha · OSDMA",
};

odisha.layers.push(
  {in: "b2", dt: 0.4, kind: "icon", name: "waves", label: "sea surge"},
  {in: "b3", dt: 0.3, kind: "icon", name: "shield", label: "authority"},
  {in: "b4", dt: 0.4, kind: "icon", name: "house", label: "shelters"},
  {in: "b6", dt: 0.4, kind: "icon", name: "people", label: "moved"},
  {in: "b9", dt: 0.4, kind: "icon", name: "drop", label: "floods"},
);
