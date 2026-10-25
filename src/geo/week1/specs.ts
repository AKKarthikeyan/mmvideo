// GeoTales week 1 visual specs (20 Oct 2026). Script lines: scripts/geo/week1.py; sources: docs/geo/week1_scripts.md.
// Place coordinates are for map placement only. Anything not drawn from real data is labelled "illustrative" / "schematic" on screen.
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const NE = ["Assam", "Arunachal Pradesh", "Meghalaya", "Nagaland", "Manipur", "Mizoram", "Tripura", "Sikkim"];

// ---------------- Chenab ----------------
const RAIL: P[] = [[74.86, 32.73], [75.14, 32.93], [74.93, 32.99], [74.88, 33.15], [75.06, 33.25], [75.19, 33.43], [75.16, 33.59], [75.15, 33.73], [74.8, 34.08], [74.34, 34.2]];
const chenab: Spec = {
  id: "chenab", globe: {lon: 2.35, lat: 48.86}, handoff: {lon: 75.0, lat: 33.3, span: 12}, hi: true,
  cams: [{in: "b2", cam: {lon: 74.9, lat: 33.15, span: 1.4}}, {in: "b6", cam: {lon: 75.0, lat: 33.3, span: 2.6}},
    {in: "b7", cam: {lon: 74.85, lat: 33.45, span: 2.4}}, {in: "b9", cam: {lon: 74.9, lat: 33.45, span: 2.0}}],
  layers: [
    {in: "b1", dt: 0.2, kind: "bars", unit: "m", items: [{label: "Eiffel Tower", value: 330, color: C.white}, {label: "Chenab Bridge", value: 359, color: C.amber}]},
    {in: "b2", dt: 0.6, out: "b2", kind: "pin", at: [74.88, 33.15], text: "CHENAB BRIDGE", color: C.amber},
    {in: "b3", out: "b4", kind: "panel", name: "chenabArch"},
    {in: "b5", kind: "bigtext", text: "266 km/h", sub: "design wind speed · quakes · blasts", size: 170},
    {in: "b6", out: "b6", kind: "river", names: ["Chenab"], color: C.cyan, clip: [73.5, 76.5, 32.4, 34.2]},
    {in: "b6", dt: 0.6, kind: "label", at: [74.55, 33.05], text: "CHENAB RIVER", color: C.cyan, size: 52},
    {in: "b7", out: "b9", kind: "line", pts: RAIL, color: C.amber, width: 9, draw: 1.6},
    {in: "b7", dt: 1.4, out: "b7", kind: "label", at: [74.4, 34.35], text: "KASHMIR VALLEY", size: 56},
    {in: "b7", dt: 0.2, out: "b7", kind: "label", at: [75.4, 32.8], text: "rail route (schematic)", size: 40},
    {in: "b8", out: "b9", kind: "particles", pts: RAIL, count: 3, color: "#fff", size: 14, speed: 0.12},
    {in: "b8", kind: "bigtext", text: "6 JUNE 2025", sub: "first Vande Bharat trains", size: 130},
    {in: "b9", kind: "pin", at: [74.93, 32.99], text: "Katra", color: C.amber},
    {in: "b9", kind: "pin", at: [74.8, 34.08], text: "Srinagar", color: C.amber},
    {in: "b9", dt: 0.5, kind: "bigtext", text: "≈ 3 HOURS", size: 150},
  ],
  question: "Would you ride across it? 👇", credit: "Bridge figures: Wikipedia, PIB",
};

// ---------------- India's one time zone ----------------
const indiatime: Spec = {
  id: "indiatime", globe: {lon: 0, lat: 51.48}, handoff: {lon: 82.5, lat: 23.5, span: 14}, hi: true,
  cams: [{in: "b1", dt: 0.3, dur: 1.2, cam: {lon: 82.5, lat: 22.5, span: 34}}, {in: "b4", cam: {lon: 82.55, lat: 25.1, span: 1.2}, dur: 1.4},
    {in: "b5", cam: {lon: 80.5, lat: 21.5, span: 30}}, {in: "b7", cam: {lon: 92.5, lat: 26.2, span: 12}}, {in: "b9", cam: {lon: 90, lat: 25.5, span: 16}}],
  layers: [
    {in: "b1", dt: 0.9, out: "b2", kind: "ruler", a: [68.2, 23.6], b: [97.4, 28.2], text: "~3,000 km", dy: -70},
    {in: "b1", dt: 0.2, kind: "clock", time: "06:00", label: "one clock", y: 400},
    {in: "b2", kind: "night", lonFrom: 98, lonTo: 66},
    {in: "b2", dt: 0.3, kind: "pin", at: [96.5, 28.0], text: "Arunachal", color: C.amber},
    {in: "b2", dt: 1.6, kind: "pin", at: [69.5, 22.5], text: "Gujarat", color: C.amber},
    {in: "b2", dt: 0.4, kind: "bigtext", text: "~2 HOURS", sub: "sunrise gap", size: 150},
    {in: "b3", kind: "bigtext", text: "UTC + 5:30", sub: "Indian Standard Time", size: 160},
    {in: "b4", out: "b4", kind: "line", pts: [[82.5, 24.0], [82.5, 26.2]], color: C.amber, width: 7, draw: 1.2},
    {in: "b4", dt: 0.8, kind: "pin", at: [82.57, 25.15], text: "Mirzapur clock tower", color: C.amber},
    {in: "b4", dt: 1.2, kind: "label", at: [82.5, 25.9], text: "82.5°E", color: C.amber, size: 56},
    {in: "b5", dt: 0.3, out: "b6", kind: "pin", at: [72.88, 19.08], text: "Bombay", color: C.cyan},
    {in: "b5", dt: 0.6, out: "b6", kind: "pin", at: [88.36, 22.57], text: "Calcutta", color: C.cyan},
    {in: "b5", dt: 0.4, kind: "clock", time: "11:21", label: "Bombay Time", x: 290, y: 420, r: 115, color: C.cyan},
    {in: "b5", dt: 0.7, kind: "clock", time: "12:23", label: "Calcutta Time", x: 790, y: 420, r: 115, color: C.cyan},
    {in: "b5", dt: 0.9, kind: "label", at: [80.5, 13.0], text: "when IST is 12:00", size: 44},
    {in: "b6", kind: "panel", name: "timeline", props: {items: [{y: "1906", t: "IST begins"}, {y: "1948", t: "Calcutta Time ends"}, {y: "1955", t: "Bombay Time ends"}]}},
    {in: "b7", kind: "fill", state: ["Assam"], color: C.green, alpha: 0.35},
    {in: "b7", dt: 0.3, kind: "clock", time: "06:00", label: "IST", x: 290, y: 420, r: 115, color: C.white},
    {in: "b7", dt: 0.9, kind: "clock", time: "07:00", label: "bagan time", x: 790, y: 420, r: 115, color: C.green},
    {in: "b8", out: "b9", kind: "fill", state: NE, color: C.amber, alpha: 0.33},
    {in: "b8", dt: 1.2, kind: "bigtext", text: "NOT YET", stamp: true, color: C.red, size: 180},
    {in: "b9", kind: "label", at: [93.5, 25.2], text: "NORTHEAST", color: C.amber, size: 64},
  ],
  question: "Should India have two time zones? 👇",
};

// ---------------- Brahmaputra ----------------
const brahmaputra: Spec = {
  id: "brahmaputra", globe: {lon: 78, lat: 30}, handoff: {lon: 88, lat: 28.5, span: 14}, hi: true,
  cams: [{in: "b1", dt: 0.2, cam: {lon: 89, lat: 27.5, span: 24}}, {in: "b2", cam: {lon: 82.5, lat: 30.4, span: 7}},
    {in: "b3", cam: {lon: 88, lat: 29.6, span: 13}}, {in: "b4", cam: {lon: 95, lat: 29.4, span: 3.6}}, {in: "b5", cam: {lon: 95.2, lat: 28.2, span: 4.5}},
    {in: "b6", cam: {lon: 92.5, lat: 26.6, span: 8}}, {in: "b7", cam: {lon: 89.9, lat: 24.6, span: 7}}, {in: "b8", cam: {lon: 90, lat: 23.3, span: 9}},
    {in: "b9", cam: {lon: 89, lat: 27, span: 24}}],
  layers: [
    {in: "b1", out: "b1", kind: "river", names: ["Yarlung", "Brahmaputra"], color: C.cyan, width: 10},
    {in: "b1", dt: 0.3, kind: "bigtext", text: "1 RIVER · 4 NAMES", size: 120},
    {in: "b2", dt: 0.3, out: "b2", kind: "pin", at: [81.31, 31.07], text: "Mt Kailash", color: C.white},
    {in: "b2", dt: 0.8, out: "b3", kind: "label", at: [83.6, 29.7], text: "YARLUNG TSANGPO", color: C.cyan, size: 62},
    {in: "b2", out: "b3", kind: "river", names: ["Yarlung"], color: C.cyan, width: 10, draw: 3.0},
    {in: "b4", out: "b5", kind: "river", names: ["Yarlung", "Brahmaputra"], color: C.cyan, width: 10, draw: 0.3},
    {in: "b4", dt: 0.4, out: "b4", kind: "pin", at: [95.06, 29.63], text: "Namcha Barwa", color: C.white},
    {in: "b4", dt: 0.6, out: "b4", kind: "label", at: [95.1, 28.9], text: "THE GREAT BEND", color: C.amber, size: 66},
    {in: "b5", kind: "fill", state: ["Arunachal Pradesh"], color: C.cyan, alpha: 0.12},
    {in: "b5", dt: 0.3, kind: "label", at: [95.6, 28.3], text: "SIANG", color: C.cyan, size: 80},
    {in: "b6", out: "b9", kind: "river", names: ["Brahmaputra"], color: C.cyan, width: 10, draw: 0.3},
    {in: "b6", kind: "fill", state: ["Assam"], color: C.amber, alpha: 0.18},
    {in: "b6", dt: 0.4, kind: "label", at: [92.3, 26.95], text: "BRAHMAPUTRA", sub: "'son of Brahma'", color: C.amber, size: 70},
    {in: "b7", kind: "fill", iso: ["BGD"], color: C.green, alpha: 0.18},
    {in: "b7", dt: 0.3, kind: "label", at: [90.6, 24.9], text: "JAMUNA", sub: "not Delhi's Yamuna", color: C.green, size: 80},
    {in: "b8", kind: "river", names: ["Ganges"], color: C.cyan, width: 9, clip: [86.5, 91.5, 21.5, 25.5]},
    {in: "b8", dt: 0.8, kind: "label", at: [89.8, 21.0], text: "BAY OF BENGAL", size: 60},
    {in: "b9", kind: "river", names: ["Yarlung", "Brahmaputra"], color: C.cyan, width: 10, draw: 0.3},
    {in: "b9", dt: 0.2, kind: "label", at: [86.5, 29.6], text: "Yarlung Tsangpo", size: 44, color: C.cyan},
    {in: "b9", dt: 0.4, kind: "label", at: [95.8, 28.6], text: "Siang", size: 44, color: C.cyan},
    {in: "b9", dt: 0.6, kind: "label", at: [92.5, 26.4], text: "Brahmaputra", size: 44, color: C.amber},
    {in: "b9", dt: 0.8, kind: "label", at: [89.9, 24.6], text: "Jamuna", size: 44, color: C.green},
  ],
  question: "What do you call it where you live? 👇", credit: "Rivers: Natural Earth",
};

// ---------------- Princely states ----------------
const CAPS: [string, P][] = [["Hyderabad", [78.47, 17.36]], ["Mysore", [76.64, 12.3]], ["Travancore", [76.95, 8.52]], ["Kashmir", [74.8, 34.08]],
  ["Baroda", [73.18, 22.31]], ["Gwalior", [78.18, 26.22]], ["Jaipur", [75.79, 26.91]], ["Jodhpur", [73.02, 26.24]], ["Bikaner", [73.31, 28.02]],
  ["Udaipur", [73.71, 24.58]], ["Bhopal", [77.41, 23.26]], ["Indore", [75.86, 22.72]], ["Patiala", [76.39, 30.34]], ["Junagadh", [70.46, 21.52]],
  ["Cooch Behar", [89.45, 26.32]], ["Manipur", [93.94, 24.82]], ["Tripura", [91.28, 23.83]], ["Kolhapur", [74.24, 16.7]], ["Cochin", [76.27, 9.93]], ["Rewa", [81.3, 24.53]]];
const princely: Spec = {
  id: "princely", globe: {lon: 78, lat: 20}, handoff: {lon: 79, lat: 22, span: 14},
  cams: [{in: "b1", dt: 0.2, cam: {lon: 81, lat: 22, span: 32}}, {in: "b7", cam: {lon: 75.5, lat: 24, span: 26}}, {in: "b9", cam: {lon: 81, lat: 22, span: 32}}],
  layers: [
    ...CAPS.map(([, p], i) => ({in: "b1", dt: 0.4 + i * 0.12, out: "b6", kind: "pin" as const, at: p, color: C.amber})),
    {in: "b1", kind: "counter", from: 0, to: 500, suffix: "+", label: "kingdoms in 1947", size: 190},
    {in: "b2", kind: "label", at: [81, 6.5], text: "some major princely states (capitals)", size: 40},
    ...CAPS.slice(0, 8).map(([n, p], i) => ({in: "b2", dt: 0.2 + i * 0.15, kind: "label" as const, at: [p[0], p[1] - 0.9] as P, text: n, size: 38})),
    {in: "b3", kind: "bigtext", text: "INDIA? PAKISTAN? NEITHER?", size: 96},
    {in: "b4", kind: "bigtext", text: "PATEL + V. P. MENON", sub: "States Department, 1947", size: 110},
    {in: "b5", kind: "bigtext", text: "INSTRUMENT OF ACCESSION", sub: "defence · foreign affairs · communications", size: 92},
    {in: "b6", kind: "fill", iso: ["IND"], color: C.green, alpha: 0.25},
    {in: "b6", dt: 0.4, kind: "bigtext", text: "BY 15 AUG 1947", sub: "almost every ruler signed", size: 120},
    {in: "b7", out: "b8", kind: "pin", at: [70.46, 21.52], text: "Junagadh", color: C.red},
    {in: "b7", dt: 0.4, out: "b8", kind: "pin", at: [74.8, 34.08], text: "Kashmir", color: C.red},
    {in: "b7", dt: 0.8, out: "b8", kind: "pin", at: [78.47, 17.36], text: "Hyderabad", color: C.red},
    {in: "b8", kind: "panel", name: "timeline", props: {items: [{y: "Oct 1947", t: "Kashmir accedes"}, {y: "Feb 1948", t: "Junagadh vote"}, {y: "Sep 1948", t: "Hyderabad: army operation"}]}},
    {in: "b9", kind: "fill", iso: ["IND"], color: C.amber, alpha: 0.3},
    {in: "b9", dt: 0.3, kind: "bigtext", text: "ONE COUNTRY", size: 150},
  ],
  question: "Which princely state was your town part of? 👇", credit: "Pins: state capitals, illustrative selection",
};

// ---------------- Andaman ----------------
const RIDGE: P[] = [[94.6, 19.5], [93.9, 17.0], [93.2, 14.5], [92.8, 12.0], [92.9, 9.5], [93.5, 7.5], [94.6, 6.2], [96.0, 5.0], [97.5, 3.5]];
const andaman: Spec = {
  id: "andaman", globe: {lon: 80, lat: 15}, handoff: {lon: 90, lat: 13, span: 14}, hi: true,
  cams: [{in: "b1", dt: 0.2, cam: {lon: 88.5, lat: 15, span: 22}}, {in: "b3", cam: {lon: 93.2, lat: 13.9, span: 2.2}, dur: 1.3},
    {in: "b4", cam: {lon: 93, lat: 12.5, span: 12}}, {in: "b5", cam: {lon: 93.8, lat: 15, span: 16}}, {in: "b6", cam: {lon: 94.5, lat: 8.5, span: 16}},
    {in: "b7", cam: {lon: 94.4, lat: 6.4, span: 6}}, {in: "b8", cam: {lon: 92.5, lat: 7.5, span: 20}}, {in: "b9", cam: {lon: 89, lat: 14, span: 22}}],
  layers: [
    {in: "b1", out: "b2", kind: "fill", state: ["Andaman and Nicobar"], color: C.amber, alpha: 0.4},
    {in: "b1", dt: 0.6, out: "b1", kind: "fill", iso: ["MMR"], color: C.cyan, alpha: 0.2},
    {in: "b1", dt: 0.6, out: "b1", kind: "label", at: [95.5, 19.5], text: "MYANMAR", color: C.cyan, size: 56},
    {in: "b2", kind: "ruler", a: [80.27, 13.08], b: [92.73, 11.62], text: "~1,190 km", dy: -60},
    {in: "b2", dt: 0.2, kind: "pin", at: [80.27, 13.08], text: "Chennai", color: C.white, dy: 60},
    {in: "b2", dt: 0.6, kind: "pin", at: [92.73, 11.62], text: "Port Blair", color: C.amber, dy: 60},
    {in: "b3", dt: 1.2, kind: "ruler", a: [93.03, 13.66], b: [93.33, 14.1], text: "~20 km", dy: -40},
    {in: "b3", dt: 1.0, kind: "label", at: [93.55, 14.25], text: "MYANMAR", sub: "Coco Islands", color: C.cyan, size: 50},
    {in: "b3", dt: 1.0, kind: "label", at: [92.75, 13.45], text: "INDIA", sub: "Landfall Island", color: C.amber, size: 50},
    {in: "b4", out: "b7", kind: "line", pts: RIDGE.slice(0, 6), color: C.violet, width: 10, dash: false, draw: 1.6},
    {in: "b4", dt: 1.2, out: "b4", kind: "label", at: [90.3, 12], text: "underwater ridge", sub: "schematic", color: C.violet, size: 54},
    {in: "b5", dt: 0.3, kind: "label", at: [95.6, 19.3], text: "ARAKAN YOMA", sub: "Myanmar", color: C.violet, size: 54},
    {in: "b6", out: "b7", kind: "line", pts: RIDGE.slice(5), color: C.violet, width: 10, draw: 1.2},
    {in: "b6", kind: "fill", iso: ["IDN"], color: C.green, alpha: 0.2},
    {in: "b6", dt: 0.5, kind: "label", at: [97.5, 2.5], text: "INDONESIA", color: C.green, size: 56},
    {in: "b7", kind: "pin", at: [93.84, 6.75], text: "Indira Point", color: C.amber},
    {in: "b7", dt: 0.8, kind: "ruler", a: [93.84, 6.75], b: [95.32, 5.55], text: "Sumatra", color: C.green, dy: 60},
    {in: "b8", kind: "particles", pts: [[80, 5.9], [88, 6.1], [93.0, 6.2], [95.8, 6.1], [98, 4.6]], count: 10, color: "#fff", size: 9, speed: 0.15},
    {in: "b8", dt: 0.4, kind: "label", at: [97.5, 7.5], text: "→ MALACCA STRAIT", color: C.amber, size: 52},
    {in: "b9", kind: "fill", state: ["Andaman and Nicobar"], color: C.amber, alpha: 0.4},
    {in: "b9", kind: "fill", iso: ["MMR"], color: C.cyan, alpha: 0.2},
  ],
  question: "Have you been to the Andamans? 👇", credit: "Distances: Britannica, Wikipedia",
};

// ---------------- Himalaya ----------------
const EV: P = [86.925, 27.988];
const himalaya: Spec = {
  id: "himalaya", globe: {lon: 78, lat: 18}, handoff: {lon: 86.9, lat: 28, span: 12}, hi: true,
  cams: [{in: "b1", dt: 0.1, cam: {lon: EV[0], lat: EV[1], span: 1.6}, dur: 1.2}, {in: "b5", cam: {lon: 82, lat: 24, span: 30}},
    {in: "b6", cam: {lon: EV[0], lat: EV[1], span: 1.8}}, {in: "b8", cam: {lon: 84, lat: 29, span: 22}}, {in: "b9", cam: {lon: EV[0], lat: EV[1], span: 1.6}}],
  layers: [
    {in: "b1", dt: 0.5, out: "b2", kind: "pin", at: EV, text: "MT EVEREST", color: C.amber},
    {in: "b2", kind: "bigtext", text: "400+ MILLION YEARS", sub: "sea-creature fossils in the summit rock", size: 96},
    {in: "b3", kind: "panel", name: "plates", props: {stage: 0}},
    {in: "b4", kind: "panel", name: "plates", props: {stage: 1}},
    {in: "b5", kind: "line", pts: [[78.5, 14], [79.5, 22.5]], color: C.red, width: 16, arrow: true, draw: 1.0},
    {in: "b5", dt: 0.6, kind: "label", at: [74.5, 18.5], text: "INDIA ↑", sub: "a few cm a year", color: C.red, size: 70},
    {in: "b6", dt: 0.2, kind: "pin", at: EV, text: "Everest", color: C.amber},
    {in: "b6", dt: 0.4, kind: "bigtext", text: "~2 mm / YEAR", sub: "rock uplift (GPS)", size: 130},
    {in: "b7", kind: "bigtext", text: "UP TO +50 m", sub: "river capture, 2024 study (debated)", size: 130},
    {in: "b8", kind: "line", pts: [[73.5, 34.5], [77, 32], [80.5, 29.8], [84, 28.0], [87.5, 27.1], [91.5, 27.3], [95, 28.3]], color: C.red, width: 9, dash: true, draw: 1.2},
    {in: "b8", dt: 0.8, kind: "label", at: [83, 26.4], text: "collision zone (approx.)", color: C.red, size: 48},
    {in: "b9", kind: "pin", at: EV, text: "MT EVEREST", color: C.amber},
  ],
  question: "Did you know Everest was once under the sea? 👇", credit: "Geology: Montana State Univ., Nature Geoscience 2024",
};

// ---------------- Malacca ----------------
const LANE: P[] = [[80, 5.8], [90, 6.0], [96.5, 5.6], [99.5, 3.6], [101.5, 2.3], [103.3, 1.25], [104.3, 1.25], [105.5, 2.5], [110, 6], [114, 10]];
const malacca: Spec = {
  id: "malacca", globe: {lon: 78, lat: 15}, handoff: {lon: 101, lat: 3, span: 14}, hi: true,
  cams: [{in: "b2", cam: {lon: 101.5, lat: 2.8, span: 9}}, {in: "b3", cam: {lon: 102, lat: 8, span: 34}}, {in: "b4", cam: {lon: 101, lat: 3, span: 9}},
    {in: "b5", cam: {lon: 103.75, lat: 1.18, span: 0.9}, dur: 1.4}, {in: "b6", cam: {lon: 101.5, lat: 2.8, span: 9}}, {in: "b7", cam: {lon: 108, lat: 16, span: 40}},
    {in: "b8", cam: {lon: 96, lat: 7, span: 18}}, {in: "b9", cam: {lon: 102, lat: 0, span: 28}}],
  layers: [
    {in: "b1", dt: 0.1, out: "b2", kind: "particles", pts: LANE, count: 24, color: "#fff", size: 8, speed: 0.04},
    {in: "b1", dt: 0.2, kind: "bigtext", text: "~29%", sub: "of seaborne oil (1H 2025)*", size: 200},
    {in: "b2", kind: "fill", iso: ["MYS"], color: C.cyan, alpha: 0.2},
    {in: "b2", kind: "fill", iso: ["IDN"], color: C.green, alpha: 0.2},
    {in: "b2", dt: 0.3, kind: "label", at: [102.3, 4.6], text: "MALAYSIA", color: C.cyan, size: 56},
    {in: "b2", dt: 0.5, kind: "label", at: [99.6, 0.8], text: "SUMATRA", sub: "Indonesia", color: C.green, size: 56},
    {in: "b2", dt: 0.7, kind: "label", at: [100.6, 3.0], text: "STRAIT OF MALACCA", color: C.amber, size: 46},
    {in: "b3", kind: "line", pts: [[78, 4], [92, 5.8], [99.5, 3.6], [103.6, 1.2], [109, 5], [118, 13]], color: C.amber, width: 12, arrow: true, draw: 1.6},
    {in: "b3", dt: 0.4, kind: "label", at: [84, 1.0], text: "INDIAN OCEAN", size: 56},
    {in: "b3", dt: 1.0, kind: "label", at: [118, 17], text: "→ PACIFIC", size: 56},
    {in: "b4", kind: "ruler", a: [97.6, 5.4], b: [103.6, 1.3], text: "~800 km", dy: -50},
    {in: "b5", dt: 1.2, kind: "ruler", a: [103.74, 1.205], b: [103.755, 1.18], text: "~2.8 km", dy: -70},
    {in: "b5", dt: 1.0, kind: "label", at: [103.75, 1.03], text: "narrowest channel (approx. location)", size: 40},
    {in: "b6", kind: "particles", pts: LANE.slice(2, 8), count: 46, color: "#fff", size: 7, speed: 0.08},
    {in: "b6", kind: "counter", from: 0, to: 100000, suffix: "+", label: "ships in 2025", size: 160},
    {in: "b7", kind: "line", pts: [[103.6, 1.3], [109, 6], [116, 18], [121.5, 31]], color: C.red, width: 12, arrow: true, draw: 1.2},
    {in: "b7", kind: "fill", iso: ["CHN"], color: C.red, alpha: 0.16},
    {in: "b7", dt: 0.3, kind: "bigtext", text: "~48%", sub: "of China's crude imports (1H 2025)*", size: 190},
    {in: "b8", kind: "fill", state: ["Andaman and Nicobar"], color: C.amber, alpha: 0.45},
    {in: "b8", dt: 0.4, kind: "label", at: [90.6, 10.5], text: "INDIA", sub: "Andaman & Nicobar", color: C.amber, size: 64},
    {in: "b8", kind: "particles", pts: LANE.slice(0, 4), count: 10, color: "#fff", size: 8, speed: 0.1},
    {in: "b9", kind: "line", pts: [[95, 4], [101, -4], [105.8, -6.1], [108, -5.5]], color: C.amber, width: 9, dash: true, draw: 1.2},
    {in: "b9", dt: 0.8, kind: "label", at: [99.5, -5.5], text: "longer detour (Sunda Strait)", color: C.amber, size: 46},
  ],
  question: "Which chokepoint should we cover next? 👇", credit: "*EIA, 1H 2025 · ships: Malaysia Marine Dept",
};

// ---------------- China's one time zone ----------------
const BANDS: [number, number, string, string][] = [[67.5, 82.5, C.cyan, "+5"], [82.5, 97.5, C.green, "+6"], [97.5, 112.5, C.amber, "+7"], [112.5, 127.5, C.red, "+8"], [127.5, 135, C.violet, "+9"]];
const band = (l0: number, l1: number): P[] => [[l0, 18], [l1, 18], [l1, 53.5], [l0, 53.5]];
const chinatime: Spec = {
  id: "chinatime", globe: {lon: 116.4, lat: 39.9}, handoff: {lon: 104, lat: 35, span: 14}, hi: true,
  cams: [{in: "b1", dt: 0.1, cam: {lon: 102, lat: 35, span: 50}}, {in: "b5", cam: {lon: 76, lat: 39.4, span: 4.2}},
    {in: "b7", cam: {lon: 95, lat: 28, span: 46}}, {in: "b8", cam: {lon: 74.2, lat: 37.1, span: 4}}, {in: "b9", cam: {lon: 102, lat: 35, span: 50}}],
  layers: [
    ...BANDS.map(([a, b, col], i) => ({in: "b1", dt: 0.2 + i * 0.2, out: "b1", kind: "fill" as const, poly: band(a, b), color: col, alpha: 0.2})),
    {in: "b1", dt: 0.6, out: "b1", kind: "label", at: [101, 15.5], text: "5 geographic time zones", size: 56},
    {in: "b2", out: "b2", kind: "fill", iso: ["CHN"], color: C.red, alpha: 0.28},
    {in: "b2", dt: 0.2, kind: "clock", time: "12:00", label: "Kashgar", x: 230, y: 400, r: 100, color: C.red},
    {in: "b2", dt: 0.4, kind: "clock", time: "12:00", label: "Lhasa", x: 540, y: 400, r: 100, color: C.red},
    {in: "b2", dt: 0.6, kind: "clock", time: "12:00", label: "Shanghai", x: 850, y: 400, r: 100, color: C.red},
    ...BANDS.map(([a, b, col], i) => ({in: "b3", at: i * 0.12, out: "b3", kind: "fill" as const, poly: band(a, b), color: col, alpha: 0.2})),
    {in: "b3", kind: "bigtext", text: "ONCE PLANNED: 5 ZONES", size: 96},
    {in: "b4", kind: "fill", iso: ["CHN"], color: C.red, alpha: 0.3},
    {in: "b4", kind: "bigtext", text: "AFTER 1949: ONE CLOCK", size: 100},
    {in: "b5", kind: "pin", at: [75.99, 39.47], text: "Kashgar", color: C.amber},
    {in: "b5", dt: 0.6, kind: "clock", time: "15:10", label: "sun at its highest", y: 420, color: C.amber},
    {in: "b6", dt: 0.2, kind: "clock", time: "15:10", label: "Beijing Time", x: 290, y: 420, r: 115, color: C.red},
    {in: "b6", dt: 0.7, kind: "clock", time: "13:10", label: "Xinjiang Time", x: 790, y: 420, r: 115, color: C.amber},
    {in: "b6", kind: "pin", at: [75.99, 39.47], text: "Kashgar", color: C.amber},
    {in: "b7", kind: "bars", unit: "h", items: [{label: "India", value: 2, color: C.amber}, {label: "China", value: 4, color: C.red}], y: 300},
    {in: "b8", kind: "fill", iso: ["AFG"], color: C.green, alpha: 0.25},
    {in: "b8", kind: "fill", iso: ["CHN"], color: C.red, alpha: 0.2},
    {in: "b8", dt: 0.4, kind: "clock", time: "12:00", label: "China", x: 290, y: 420, r: 115, color: C.red},
    {in: "b8", dt: 0.9, kind: "clock", time: "08:30", label: "Afghanistan", x: 790, y: 420, r: 115, color: C.green},
    {in: "b8", dt: 0.6, kind: "label", at: [73.0, 36.8], text: "AFGHANISTAN", color: C.green, size: 48},
    {in: "b8", dt: 0.6, kind: "label", at: [75.6, 37.7], text: "CHINA", color: C.red, size: 48},
    {in: "b9", kind: "fill", iso: ["CHN"], color: C.red, alpha: 0.25},
  ],
  question: "One time zone or many: which is better? 👇", credit: "Times: timeanddate.com",
};

// ---------------- Languages ----------------
const SCRIPTS = ["हिन्दी", "বাংলা", "தமிழ்", "తెలుగు", "मराठी", "ગુજરાતી", "ಕನ್ನಡ", "മലയാളം", "ਪੰਜਾਬੀ", "ଓଡ଼ିଆ", "অসমীয়া", "اردو",
  "संस्कृतम्", "कोंकणी", "नेपाली", "মৈতৈলোন্", "सिन्धी", "کٲشُر", "बड़ो", "डोगरी", "मैथिली", "Santali"];
const languages: Spec = {
  id: "languages", globe: {lon: 80, lat: 22}, handoff: {lon: 80, lat: 22, span: 14},
  cams: [{in: "b1", dt: 0.2, cam: {lon: 82, lat: 22, span: 32}}],
  layers: [
    {in: "b1", dt: 0.2, kind: "panel", name: "tiles", props: {words: SCRIPTS}},
    {in: "b2", kind: "bigtext", text: "EIGHTH SCHEDULE", sub: "Constitution of India", size: 120},
    {in: "b3", kind: "counter", from: 0, to: 14, label: "1950", size: 260},
    {in: "b4", kind: "counter", from: 14, to: 15, dur: 0.6, label: "1967: + Sindhi", size: 260},
    {in: "b5", kind: "counter", from: 15, to: 18, dur: 1.4, label: "1992: + Konkani, Manipuri, Nepali", size: 260},
    {in: "b6", kind: "counter", from: 18, to: 22, dur: 2.0, label: "2003: + Bodo, Dogri, Maithili, Santali", size: 260},
    {in: "b7", kind: "bigtext", text: "HINDI + ENGLISH", sub: "official languages of the Union", size: 120},
    {in: "b8", kind: "bigtext", text: "DOZENS MORE", sub: "asking to join the list", size: 120},
    {in: "b9", dt: 0.1, kind: "panel", name: "tiles", props: {words: SCRIPTS}},
  ],
  question: "How many of the 22 can you speak? 👇", credit: "Source: Constitution of India, PIB",
};

// ---------------- Enclaves ----------------
const DOTS: [P, string][] = Array.from({length: 26}).map((_, i) => {
  const lon = 88.75 + ((i * 37) % 100) / 100 * 1.0, lat = 25.98 + ((i * 53) % 100) / 100 * 0.45;
  return [[lon, lat], i % 3 === 0 ? C.green : C.orange];
});
const enclaves: Spec = {
  id: "enclaves", globe: {lon: 85, lat: 24}, handoff: {lon: 89.2, lat: 26.2, span: 10}, hi: true,
  cams: [{in: "b1", dt: 0.1, cam: {lon: 89.2, lat: 26.2, span: 1.6}, dur: 1.4}, {in: "b9", cam: {lon: 89.2, lat: 26.2, span: 2.2}}],
  layers: [
    ...DOTS.map(([p, col], i) => ({in: "b1", dt: 1.0 + i * 0.06, out: "b7", kind: "pin" as const, at: p, color: col, size: 30})),
    {in: "b1", dt: 1.2, out: "b2", kind: "label", at: [89.25, 25.88], text: "enclave positions illustrative", size: 40},
    {in: "b1", dt: 1.0, out: "b2", kind: "label", at: [89.6, 26.62], text: "INDIA", color: C.orange, size: 60},
    {in: "b1", dt: 1.0, out: "b2", kind: "label", at: [89.0, 25.8], text: "BANGLADESH", color: C.green, size: 60},
    {in: "b2", kind: "bigtext", text: "111 + 51", sub: "Indian · Bangladeshi enclaves", size: 180},
    {in: "b3", out: "b4", kind: "panel", name: "rings"},
    {in: "b5", kind: "counter", from: 0, to: 50000, prefix: "~", label: "people", size: 190},
    {in: "b6", kind: "clock", time: ["23:58", "00:00"], label: "31 July 2015", y: 420, color: C.amber},
    {in: "b7", kind: "line", pts: [[88.95, 26.32], [89.3, 26.08]], color: C.white, width: 10, arrow: true, draw: 0.8},
    {in: "b7", dt: 0.6, kind: "line", pts: [[89.45, 26.12], [89.12, 26.38]], color: C.white, width: 10, arrow: true, draw: 0.8},
    {in: "b7", dt: 0.3, kind: "bigtext", text: "STAY OR MOVE", sub: "their choice", size: 130},
    {in: "b8", kind: "counter", from: 162, to: 0, dur: 2.2, label: "enclaves left", size: 230},
    {in: "b9", kind: "label", at: [89.2, 26.62], text: "ONE CLEAN BORDER", color: C.amber, size: 64},
  ],
  question: "Had you heard of this? 👇", credit: "Figures: 2010 joint census, Wikipedia",
};

// ---------------- Monsoon ----------------
const SW: P[][] = [[[56, 4], [66, 11], [72, 18]], [[60, -2], [70, 6], [75.5, 11]], [[72, -6], [82, 4], [88, 16]], [[80, -4], [88, 6], [92, 20]]];
const monsoon: Spec = {
  id: "monsoon", globe: {lon: 72, lat: 2}, handoff: {lon: 78, lat: 18, span: 14},
  cams: [{in: "b1", dt: 0.1, cam: {lon: 78, lat: 15, span: 36}}],
  layers: [
    {in: "b1", dt: 0.2, kind: "bigtext", text: "JUNE", stamp: true, size: 230},
    {in: "b2", kind: "fill", iso: ["IND"], color: C.red, alpha: 0.3},
    {in: "b2", dt: 0.4, kind: "label", at: [79, 23], text: "LAND: HOT", color: C.red, size: 64},
    {in: "b2", dt: 0.8, kind: "label", at: [68, 8], text: "SEA: COOLER", color: C.cyan, size: 64},
    {in: "b3", dt: 0.2, kind: "label", at: [73, 27.5], text: "LOW PRESSURE", color: C.red, size: 58},
    ...SW.map((p, i) => ({in: "b3", dt: 0.3 + i * 0.15, out: "b6", kind: "line" as const, pts: p, color: C.cyan, width: 12, arrow: true, draw: 0.8})),
    {in: "b4", kind: "pin", at: [76.27, 9.93], text: "Kerala · ~1 June", color: C.amber},
    {in: "b5", kind: "line", pts: [[73.4, 21], [73.8, 17], [74.6, 14], [76.0, 11], [77.2, 8.6]], color: C.green, width: 14, draw: 0.8},
    {in: "b5", dt: 0.4, kind: "label", at: [70.6, 15.5], text: "WESTERN GHATS", color: C.green, size: 50},
    {in: "b5", dt: 1.2, kind: "line", pts: [[74, 34.5], [78, 31.5], [81, 29.8], [85, 27.9], [88.5, 27.3], [92, 27.6], [95.5, 28.4]], color: C.white, width: 14, draw: 0.8},
    {in: "b5", dt: 1.5, kind: "label", at: [86, 30.2], text: "HIMALAYAS", size: 52},
    {in: "b6", kind: "fill", state: ["Rajasthan"], color: C.cyan, alpha: 0.3},
    {in: "b6", dt: 0.4, kind: "label", at: [72.5, 27], text: "~8 JULY", sub: "far north-west", color: C.cyan, size: 64},
    {in: "b7", kind: "counter", from: 0, to: 87, suffix: " cm", label: "normal June–Sept rainfall", size: 220},
    {in: "b8", kind: "line", pts: [[88, 26], [80, 17], [72, 9]], color: C.amber, width: 12, arrow: true, draw: 1.0},
    {in: "b8", dt: 0.4, kind: "bigtext", text: "17 SEP → 15 OCT", sub: "the monsoon withdraws", size: 110},
    ...SW.map((p, i) => ({in: "b9", dt: 0.4 + i * 0.12, kind: "line" as const, pts: p, color: C.cyan, width: 8, arrow: true, draw: 0.8})),
  ],
  question: "When did the monsoon reach your city this year? 👇", credit: "Dates and averages: IMD · wind arrows schematic",
};

// ---------------- Hyderabad ----------------
const HYD: P[] = [[74.4, 20.4], [76.5, 21.0], [78.5, 19.9], [80.0, 19.5], [81.3, 17.8], [80.5, 16.7], [79.5, 16.1], [77.9, 15.9], [76.6, 15.4], [75.9, 16.4], [76.2, 17.3], [75.0, 18.0], [74.2, 19.2]];
const hyderabad: Spec = {
  id: "hyderabad", globe: {lon: 78.5, lat: 17.4}, handoff: {lon: 78.5, lat: 18, span: 12},
  cams: [{in: "b1", dt: 0.1, cam: {lon: 79, lat: 20, span: 28}}, {in: "b2", cam: {lon: 78, lat: 18, span: 12}}, {in: "b9", cam: {lon: 78, lat: 18, span: 14}}],
  layers: [
    {in: "b1", dt: 0.3, out: "b5", kind: "fill", poly: HYD, color: C.amber, alpha: 0.3, dashed: true},
    {in: "b1", dt: 0.8, out: "b2", kind: "label", at: [77.8, 14.8], text: "HYDERABAD STATE", sub: "approx. extent", color: C.amber, size: 56},
    {in: "b2", out: "b8", kind: "pin", at: [78.47, 17.36], text: "Hyderabad", color: C.amber},
    {in: "b2", dt: 0.3, kind: "bigtext", text: "TIME MAGAZINE, 1937", sub: "\"richest man in the world\"", size: 92},
    {in: "b4", kind: "bigtext", text: "INDEPENDENT?", size: 150},
    {in: "b5", kind: "bigtext", text: "STANDSTILL", sub: "Nov 1947 · for one year", size: 130},
    {in: "b6", out: "b7", kind: "fill", poly: HYD, color: C.red, alpha: 0.3, dashed: true},
    {in: "b7", kind: "line", pts: [[75.2, 17.7], [77.3, 17.5]], color: C.white, width: 12, arrow: true, draw: 0.8},
    {in: "b7", dt: 0.3, kind: "line", pts: [[80.9, 16.5], [79.3, 17.2]], color: C.white, width: 12, arrow: true, draw: 0.8},
    {in: "b7", dt: 0.6, kind: "line", pts: [[79.0, 21.4], [78.6, 19.0]], color: C.white, width: 12, arrow: true, draw: 0.8},
    {in: "b7", dt: 0.5, kind: "bigtext", text: "OPERATION POLO", sub: "13 Sep 1948 · arrows schematic", size: 120},
    {in: "b8", kind: "counter", from: 1, to: 5, dur: 2.0, label: "days", size: 230},
    {in: "b8", dt: 0.6, kind: "fill", poly: HYD, color: C.green, alpha: 0.3},
    {in: "b9", kind: "fill", state: ["Telangana", "Maharashtra", "Karnataka"], color: C.white, alpha: 0.08},
    {in: "b9", dt: 0.3, kind: "label", at: [78.6, 17.9], text: "TELANGANA", size: 46},
    {in: "b9", dt: 0.5, kind: "label", at: [75.6, 19.6], text: "MAHARASHTRA", size: 46},
    {in: "b9", dt: 0.7, kind: "label", at: [75.4, 16.4], text: "KARNATAKA", size: 46},
  ],
  question: "Should we tell the story of the Nizam's diamond paperweight next? 👇", credit: "Outline approximate · sources: Wikipedia",
};

// ---------------- Islamabad ----------------
const islamabad: Spec = {
  id: "islamabad", globe: {lon: 67, lat: 24.9}, handoff: {lon: 69.5, lat: 29, span: 14}, hi: true,
  cams: [{in: "b2", cam: {lon: 67.0, lat: 24.9, span: 5}}, {in: "b4", cam: {lon: 70, lat: 29.5, span: 15}},
    {in: "b5", cam: {lon: 73.05, lat: 33.66, span: 0.7}, dur: 1.2}, {in: "b8", cam: {lon: 81, lat: 28, span: 32}}, {in: "b9", cam: {lon: 67.0, lat: 24.9, span: 5}}],
  layers: [
    {in: "b1", dt: 0.2, kind: "panel", name: "grid"},
    {in: "b2", out: "b3", kind: "pin", at: [67.0, 24.86], text: "KARACHI", color: C.amber},
    {in: "b3", kind: "bigtext", text: "HOT · CROWDED · NO ROOM", size: 92},
    {in: "b4", kind: "line", pts: [[67.0, 24.86], [73.05, 33.7]], color: C.amber, width: 12, arrow: true, draw: 1.2},
    {in: "b4", dt: 1.0, kind: "pin", at: [73.05, 33.7], text: "new site", color: C.amber},
    {in: "b5", dt: 0.6, kind: "pin", at: [73.05, 33.6], text: "Rawalpindi", color: C.cyan, dy: 60},
    {in: "b5", dt: 0.9, kind: "pin", at: [73.05, 33.72], text: "Islamabad", color: C.amber},
    {in: "b6", kind: "panel", name: "grid"},
    {in: "b7", kind: "panel", name: "timeline", props: {items: [{y: "1959", t: "commission picks the site"}, {y: "1960", t: "named Islamabad"}, {y: "1967", t: "official capital"}]}},
    {in: "b8", kind: "line", pts: [[90.41, 23.81], [73.05, 33.7]], color: C.green, width: 10, dash: true, draw: 1.0},
    {in: "b8", kind: "fill", iso: ["BGD"], color: C.green, alpha: 0.3},
    {in: "b8", dt: 0.5, kind: "label", at: [90.4, 21.6], text: "EAST PAKISTAN", sub: "now Bangladesh", color: C.green, size: 54},
    {in: "b9", kind: "pin", at: [67.0, 24.86], text: "KARACHI", color: C.amber},
    {in: "b9", dt: 0.4, kind: "bigtext", text: "BIGGEST CITY", sub: "not the capital", size: 140},
  ],
  question: "Next: Chandigarh or Naypyidaw? 👇", credit: "Sources: Dawn, The Friday Times",
};

export const SPECS: Record<string, Spec> = {chenab, indiatime, brahmaputra, princely, andaman, himalaya, malacca, chinatime, languages, enclaves, monsoon, hyderabad, islamabad};
