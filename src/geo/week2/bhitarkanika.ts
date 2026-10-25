// Indica Atlas week 2: bhitarkanika. Script lines: scripts/geo/week2.py; sources: docs/geo/week2/drafts/bhitarkanika.md.
// Map care: rivers are drawn schematically (labelled "simplified"); the Dhamra mouth is left unlabelled. Park and
// mangrove outlines are approximate and labelled so. Crocodiles are plain dots, no photos. Gahirmatha is not shown.
// The 1975 project is text only (no UN emblem or flag). Current count shown as 1,800+ (not 1,880).
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const PARK: P = [86.9, 20.7];
const CREEK1: P[] = [[86.74, 20.60], [86.80, 20.64], [86.84, 20.68], [86.88, 20.70], [86.92, 20.74], [86.96, 20.77]];
const CREEK2: P[] = [[86.78, 20.71], [86.84, 20.73], [86.89, 20.67], [86.94, 20.64]];
// Schematic courses into the Bay of Bengal
const BAITARANI: P[] = [[85.4, 20.97], [85.9, 20.95], [86.2, 20.92], [86.45, 20.86], [86.62, 20.81], [86.74, 20.78], [86.88, 20.79], [86.98, 20.80]];
const BRAHMANI: P[] = [[85.4, 20.42], [85.9, 20.45], [86.15, 20.48], [86.4, 20.52], [86.6, 20.57], [86.75, 20.61], [86.88, 20.64], [86.96, 20.66]];
const MANG: P[] = [[86.70, 20.52], [86.86, 20.50], [86.96, 20.60], [86.99, 20.72], [86.96, 20.82], [86.84, 20.84], [86.72, 20.74]];
const NP: P[] = [[86.76, 20.60], [86.86, 20.58], [86.95, 20.64], [86.98, 20.72], [86.95, 20.79], [86.86, 20.80], [86.78, 20.74]];

const CLOSE = {lon: 86.82, lat: 20.62, span: 1.2};
export const bhitarkanika: Spec = {
  id: "bhitarkanika", globe: {lon: 86.9, lat: 20.7}, handoff: {lon: 86.85, lat: 20.65, span: 4}, hi: true,
  cams: [{in: "b1", dt: 1.65, dur: 1.4, cam: CLOSE}, {in: "b3", dur: 1.8, cam: {lon: 86.87, lat: 20.66, span: 0.85}},
    {in: "b4", dur: 1.4, cam: {lon: 86.6, lat: 20.68, span: 2.6}}, {in: "b5", cam: CLOSE},
    {in: "b6", dur: 3.0, cam: {lon: 86.84, lat: 20.64, span: 1.0}}, {in: "b8", dur: 1.6, cam: {lon: 86.86, lat: 20.66, span: 0.95}},
    {in: "b9", dur: 1.6, cam: {lon: 86.82, lat: 20.64, span: 1.4}}],
  layers: [
    // b1 hook: counter from frame 0
    {in: "b1", kind: "counter", from: 0, to: 10, dur: 1.4, label: "crocodiles seen · 1973", size: 220},
    {in: "b1", dt: 1.8, out: "b2", kind: "pin", at: PARK, text: "BHITARKANIKA", color: C.amber, dy: -105},
    {in: "b1", dt: 2.0, out: "b1", kind: "line", pts: CREEK1, color: C.white, width: 7, draw: 1.4},
    {in: "b1", dt: 2.2, out: "b1", kind: "label", at: [86.70, 20.52], text: "creek route: illustrative", size: 38},
    // b2 today 1,800+
    {in: "b2", kind: "counter", from: 10, to: 1800, dur: 1.2, suffix: "+", label: "live here today", size: 220},
    {in: "b2", dt: 0.2, out: "b4", kind: "particles", pts: CREEK1, count: 12, color: C.green, size: 10, speed: 0.05},
    {in: "b2", dt: 0.4, out: "b4", kind: "particles", pts: CREEK2, count: 8, color: C.green, size: 10, speed: 0.06},
    // b3 biggest crocodiles alive
    {in: "b3", dt: 0.1, kind: "bigtext", text: "UP TO 6–7 m", sub: "reported · the biggest crocodiles alive", size: 150},
    // b4 mangroves, two rivers, the sea
    {in: "b4", dt: 0.6, out: "b4", kind: "fill", poly: MANG, color: C.green, alpha: 0.35, dashed: true},
    {in: "b4", dt: 0.8, out: "b4", kind: "line", pts: BAITARANI, color: C.cyan, width: 9, draw: 1.4},
    {in: "b4", dt: 1.0, out: "b4", kind: "line", pts: BRAHMANI, color: C.cyan, width: 9, draw: 1.4},
    {in: "b4", dt: 1.6, out: "b4", kind: "label", at: [86.15, 21.03], text: "BAITARANI", color: C.cyan, size: 50},
    {in: "b4", dt: 1.8, out: "b4", kind: "label", at: [86.15, 20.39], text: "BRAHMANI", color: C.cyan, size: 50},
    {in: "b4", dt: 2.0, out: "b4", kind: "label", at: [87.4, 21.25], text: "BAY OF BENGAL", size: 44},
    {in: "b4", dt: 2.2, out: "b4", kind: "label", at: [86.88, 20.45], text: "mangroves (approx.)", color: C.green, size: 42},
    {in: "b4", dt: 2.2, out: "b4", kind: "label", at: [86.2, 20.22], text: "rivers: simplified", size: 38},
    // b5 poached nearly to nothing
    {in: "b5", out: "b5", outAt: -1.0, kind: "particles", pts: CREEK1, count: 3, color: C.green, size: 10, speed: 0.05},
    {in: "b5", dt: 0.1, kind: "bigtext", text: "HUNTED FOR SKINS", sub: "nearly wiped out", color: C.red, stamp: true, size: 130},
    // b6-b7 rescue timeline
    {in: "b6", out: "b7", kind: "panel", name: "timeline", props: {items: [{y: "1973", t: "only 10 seen"}, {y: "1975", t: "India + UN project"},
      {y: "1977–2009", t: "2,300+ released"}]}},
    // b8 twelve years to grow up; protected park
    {in: "b8", dt: 0.3, out: "b8", kind: "fill", poly: NP, color: C.green, alpha: 0.3, dashed: true},
    {in: "b8", dt: 0.6, out: "b8", kind: "label", at: [86.87, 20.52], text: "BHITARKANIKA NATIONAL PARK", sub: "protected · outline approx.", color: C.green, size: 46},
    {in: "b8", dt: 0.1, kind: "bigtext", text: "12+ YEARS", sub: "for a female to grow up", size: 160},
    // b9 from ten to giants
    {in: "b9", dt: 0.2, kind: "particles", pts: CREEK1, count: 14, color: C.green, size: 10, speed: 0.05},
    {in: "b9", dt: 0.3, kind: "particles", pts: CREEK2, count: 9, color: C.green, size: 10, speed: 0.06},
    {in: "b9", dt: 0.1, kind: "bigtext", text: "OVER 5 m", sub: "measured in 2005 · from 10 seen", stamp: true, size: 170},
  ],
  question: "Would you take a boat through these creeks? 👇", credit: "Sources: Govt of Odisha · IUCN CSG · JBNHS 1973",
};
