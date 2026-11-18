// Indica Atlas W3-02: a million Indians overseas in WW1, mostly not to France. Script + claims: scripts/geo/week3.py, docs/geo/research/W3-02-ww1.
// ⚑ colonial history: every count is named for who counted (C003-C007, C026, C028). Routes are SCHEMATIC (labelled); no claim about ports.
// Map care: official India outline (house file); Iraq shown as "Mesopotamia (now Iraq)", France by its modern outline (illustrative of the theatre).
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const FROM: P = [73.0, 19.5];   // western India (schematic start, not a named port)
const TO_MESO: P[] = [FROM, [64, 21.5], [57.5, 25.2], [52.5, 27.6], [49.2, 29.4], [47.6, 30.6], [45.5, 32.0], [44.4, 33.3]];
const TO_FRANCE: P[] = [FROM, [60, 15.5], [50, 12.6], [43.4, 12.4], [38.5, 19.5], [33.8, 28.8], [32.4, 31.4], [26, 33.6], [14, 37.0], [8.5, 40.5], [5.4, 43.2], [3.2, 46.0]];
const MESO: P = [44.4, 33.3], FRANCE: P = [3.2, 46.0];
const WIDE = {lon: 36, lat: 27, span: 80};

export const ww1: Spec = {
  id: "w3ww1", theme: "premium", globe: {lon: 30, lat: 40}, handoff: {lon: 78, lat: 22, span: 34}, hi: false,
  cams: [{in: "b1", dt: 0.1, dur: 1.0, cam: {lon: 78, lat: 22, span: 30}}, {in: "b3", dur: 1.4, cam: WIDE},
    {in: "b4", dur: 1.2, cam: {lon: 34, lat: 29, span: 72}}, {in: "b5", dur: 1.0, cam: {lon: 36, lat: 27, span: 80}},
    {in: "b6", dur: 1.2, cam: {lon: 34, lat: 29, span: 72}}],
  layers: [
    {in: "b1", out: "b6", kind: "fill", iso: ["IND"], color: C.amber, alpha: 0.24},
    // b1 hook: the count from frame 0
    {in: "b1", kind: "counter", from: 0, to: 1096013, dur: 1.8, label: "Indians sent overseas · Govt of India", size: 150, y: 230},
    // b2 not all soldiers
    {in: "b2", dt: 0.1, kind: "panel", name: "timeline", props: {items: [{y: "621,224", t: "combatants"}, {y: "474,789", t: "labour & followers (43%)"}]}},
    // b3 where they went
    {in: "b3", dt: 0.6, out: "b6", kind: "fill", iso: ["IRQ"], color: C.amber, alpha: 0.35},
    {in: "b3", dt: 1.0, out: "b6", kind: "fill", iso: ["FRA"], color: C.cyan, alpha: 0.3},
    {in: "b3", dt: 0.4, out: "b4", kind: "line", pts: TO_MESO, color: C.amber, width: 16, draw: 1.2, arrow: true, flow: true},
    {in: "b3", dt: 1.2, out: "b4", kind: "line", pts: TO_FRANCE, color: C.cyan, width: 5, draw: 1.6, arrow: true, flow: true},
    {in: "b3", dt: 1.0, out: "b3", kind: "label", at: [46, 37.4], text: "MESOPOTAMIA 61.6%", sub: "now Iraq", color: C.amber, size: 48},
    {in: "b3", dt: 2.2, out: "b3", kind: "label", at: [16, 49.5], text: "FRANCE 12.6%", color: C.cyan, size: 48},
    {in: "b3", dt: 1.4, out: "b4", kind: "label", at: [56, 9.5], text: "routes schematic", color: C.white, size: 30},
    // b4 where they died (Govt of India table)
    {in: "b4", dt: 0.2, out: "b4", kind: "label", at: [46, 37.4], text: "54.8% OF THE DEAD", sub: "Mesopotamia", color: C.amber, size: 48},
    {in: "b4", dt: 0.6, out: "b4", kind: "label", at: [16, 49.5], text: "14.6%", sub: "France", color: C.cyan, size: 48},
    {in: "b4", dt: 0.2, kind: "bigtext", text: "MORE THAN HALF", sub: "of the dead: Mesopotamia · Govt of India table", color: C.white, size: 110, y: 230},
    // b5 who counted
    {in: "b5", dt: 0.1, kind: "panel", name: "timeline", props: {items: [{y: "61,041", t: "Govt of India, 1923"}, {y: "62,056", t: "War Office, 1922"}, {y: "≈ 74,000", t: "CWGC"}]}},
    // b6 the loop
    {in: "b6", dt: 0.2, kind: "bigtext", text: "1,096,013 WENT", sub: "the counts of their dead still differ", color: C.amber, size: 110, y: 230},
    {in: "b6", dt: 0.3, kind: "pin", at: MESO, color: C.amber},
    {in: "b6", dt: 0.5, kind: "pin", at: FRANCE, color: C.cyan},
  ],
  question: "Where did you think most of them went? 👇",
  credit: "Sources: Govt of India 1923 · War Office 1922 · CWGC",
};

ww1.layers.push(
  {in: "b2", dt: 0.4, kind: "icon", name: "people", label: "not all soldiers"},
  {in: "b3", dt: 0.4, kind: "icon", name: "ship", label: "sent overseas"},
  {in: "b5", dt: 0.4, kind: "icon", name: "scroll", label: "who counted"},
);
