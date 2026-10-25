// Indica Atlas week 2: minicoy. Script lines: scripts/geo/week2.py; sources: docs/geo/week2/drafts/minicoy.md.
// Coordinates are for placement only. Distances are measured from Minicoy island itself.
// Sea boundary: 1976 India-Maldives agreement, Article I points 8-18 (US State Dept, Limits in the Seas No. 78), drawn dashed and labelled approximate.
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const MINICOY: P = [73.05, 8.28], KOCHI: P = [76.27, 9.97], KALPENI: P = [73.65, 10.08];
const MDV_N: P = [72.9, 7.1];   // Thuraakunu, northernmost Maldives island (approx.)
const GREY = "#C8CCD2";
// Lakshadweep islands, north to south, ending on Minicoy
const CHAIN: P[] = [[72.71, 11.69], [72.19, 11.6], [73.0, 11.48], [72.78, 11.22], [72.73, 11.12], [72.19, 10.86], [73.68, 10.82], [72.64, 10.56], [73.65, 10.08]];
// 1976 treaty, Article I points 8..18 (decimal degrees, lon/lat)
const SEA_LINE: P[] = [[75.202, 7.4], [75.188, 7.422], [74.936, 7.858], [74.496, 7.808], [73.643, 7.697], [73.327, 7.651], [73.056, 7.681],
  [72.825, 7.705], [72.707, 7.715], [72.063, 7.818], [70.252, 8.094]];
const WIDE = {lon: 74.4, lat: 8.5, span: 5.4};

export const minicoy: Spec = {
  id: "minicoy", globe: {lon: -0.13, lat: 51.5}, handoff: {lon: 74.6, lat: 9.5, span: 9}, hi: true,
  cams: [{in: "b1", dt: 0.1, dur: 1.0, cam: WIDE}, {in: "b2", dur: 0.9, cam: {lon: 75.4, lat: 10.6, span: 8}},
    {in: "b3", dur: 0.8, cam: WIDE}, {in: "b4", dur: 1.2, cam: {lon: 74.1, lat: 8.3, span: 5.0}},
    {in: "b5", dur: 0.9, cam: {lon: 73.6, lat: 9.8, span: 6.5}}, {in: "b6", dur: 1.0, cam: {lon: 73.4, lat: 9.3, span: 5.4}},
    {in: "b7", dur: 1.0, cam: {lon: 73.4, lat: 9.3, span: 7}}, {in: "b8", dur: 3.0, cam: {lon: 73.0, lat: 8.5, span: 5.6}},
    {in: "b9", dur: 0.9, cam: {lon: 74.4, lat: 8.2, span: 5.4}}],
  layers: [
    // b1 hook: on screen from frame 0, rulers grow once the map lands
    {in: "b1", kind: "bigtext", text: "3× CLOSER", sub: "to the Maldives than to Kerala", size: 150},
    {in: "b1", dt: 1.7, out: "b1", kind: "pin", at: MINICOY, color: C.amber},
    {in: "b1", dt: 1.8, out: "b1", kind: "label", at: [72.4, 8.32], text: "Minicoy", color: C.amber, size: 50},
    {in: "b1", dt: 1.9, out: "b1", kind: "ruler", a: MINICOY, b: KOCHI, text: "398 km", color: C.white, dy: -50},
    {in: "b1", dt: 1.9, out: "b1", kind: "pin", at: KOCHI, text: "Kochi", color: C.white},
    {in: "b1", dt: 1.9, out: "b1", kind: "ruler", a: MINICOY, b: MDV_N, text: " ", color: C.amber},
    {in: "b1", dt: 2.3, out: "b1", kind: "label", at: [72.45, 7.62], text: "~130 km", color: C.amber, size: 52},
    // b2 pull back: Lakshadweep off the Kerala coast
    {in: "b2", kind: "fill", state: ["Kerala"], color: C.white, alpha: 0.12},
    {in: "b2", kind: "fill", state: ["Lakshadweep"], color: C.amber, alpha: 0.6},
    {in: "b2", dt: 0.3, kind: "label", at: [72.6, 12.25], text: "LAKSHADWEEP", sub: "coral atolls", color: C.amber, size: 52},
    {in: "b2", dt: 0.5, kind: "label", at: [76.75, 11.0], text: "KERALA", size: 50},
    {in: "b2", dt: 0.6, kind: "pin", at: MINICOY, text: "MINICOY", color: C.amber},
    // b3 Kochi 398 km
    {in: "b3", dt: 0.5, out: "b4", kind: "ruler", a: MINICOY, b: KOCHI, text: "398 km", color: C.white, dy: -50},
    {in: "b3", dt: 0.3, out: "b4", kind: "pin", at: KOCHI, text: "Kochi", color: C.white},
    {in: "b3", dt: 0.1, out: "b4", kind: "pin", at: MINICOY, color: C.amber},
    {in: "b3", dt: 0.2, out: "b4", kind: "label", at: [72.4, 8.32], text: "Minicoy", color: C.amber, size: 50},
    {in: "b3", kind: "counter", from: 0, to: 398, suffix: " km", label: "Minicoy → Kochi, Kerala", size: 190},
    // b4 Maldives ~130 km
    {in: "b4", kind: "fill", iso: ["MDV"], color: GREY, alpha: 0.6},
    {in: "b4", dt: 0.5, kind: "ruler", a: MINICOY, b: MDV_N, text: " ", color: C.amber},
    {in: "b4", dt: 0.9, kind: "label", at: [72.45, 7.62], text: "~130 km", color: C.amber, size: 52},
    {in: "b4", dt: 0.8, kind: "label", at: [73.75, 6.95], text: "MALDIVES", color: GREY, size: 54},
    {in: "b4", kind: "counter", from: 0, to: 130, prefix: "~", suffix: " km", label: "Minicoy → the Maldives", size: 190},
    // b5 the chain lights up north to south, ending on Minicoy
    ...CHAIN.map((p, i) => ({in: "b5", dt: 0.2 + i * 0.16, out: "b7", kind: "pin" as const, at: p, color: C.cyan})),
    {in: "b5", dt: 1.8, out: "b8", kind: "pin", at: MINICOY, text: "MINICOY", color: C.amber},
    {in: "b5", dt: 2.0, out: "b5", kind: "label", at: MINICOY, dy: 62, text: "the last island", color: C.amber, size: 46},
    {in: "b5", dt: 0.4, out: "b5", kind: "label", at: [74.75, 11.3], text: "LAKSHADWEEP", color: C.cyan, size: 48},
    // b6 Nine Degree Channel between Kalpeni and Minicoy
    {in: "b6", out: "b6", kind: "fill", poly: [[71.2, 8.75], [75.6, 8.75], [75.6, 9.62], [71.2, 9.62]], color: C.cyan, alpha: 0.3},
    {in: "b6", dt: 0.2, out: "b6", kind: "particles", pts: [[70.6, 9.05], [76.2, 9.2]], count: 4, color: "#fff", size: 11, speed: 0.12},
    {in: "b6", dt: 0.3, out: "b6", kind: "label", at: [73.4, 9.19], text: "NINE DEGREE CHANNEL", sub: "approx. position", color: C.white, size: 46},
    {in: "b6", dt: 0.1, out: "b6", kind: "pin", at: KALPENI, text: "Kalpeni", color: C.cyan},
    // b7 languages
    {in: "b7", dt: 0.2, kind: "label", at: [73.6, 11.95], text: "💬 Malayalam", sub: "the other islands", color: C.cyan, size: 54},
    {in: "b7", dt: 1.4, kind: "label", at: [74.3, 8.75], text: "💬 Mahl", sub: "Minicoy", color: C.amber, size: 54},
    {in: "b7", dt: 2.2, kind: "fill", iso: ["MDV"], color: GREY, alpha: 0.6},
    {in: "b7", dt: 2.2, kind: "label", at: [74.2, 7.15], text: "💬 Mahl", sub: "Maldives", color: GREY, size: 54},
    // b8 1976 sea boundary (treaty points, dashed, approximate)
    {in: "b8", out: "b8", kind: "fill", iso: ["MDV"], color: GREY, alpha: 0.6},
    {in: "b8", dt: 0.2, out: "b8", kind: "line", pts: SEA_LINE, color: C.white, width: 7, dash: true},
    {in: "b8", dt: 0.6, out: "b8", kind: "label", at: [71.55, 7.35], text: "1976 sea boundary", sub: "approximate", color: C.white, size: 46},
    {in: "b8", dt: 1.2, out: "b8", kind: "label", at: [73.95, 8.95], text: "INDIA'S SIDE", color: C.amber, size: 50},
    {in: "b8", dt: 1.6, out: "b8", kind: "label", at: [74.1, 7.05], text: "MALDIVES", color: GREY, size: 50},
    // b9 both rulers return (loops to b1)
    {in: "b9", kind: "pin", at: MINICOY, color: C.amber},
    {in: "b9", dt: 0.1, kind: "label", at: [72.4, 8.32], text: "Minicoy", color: C.amber, size: 50},
    {in: "b9", dt: 0.3, kind: "ruler", a: MINICOY, b: KOCHI, text: "398 km", color: C.white, dy: -50},
    {in: "b9", dt: 0.3, kind: "pin", at: KOCHI, text: "Kochi", color: C.white},
    {in: "b9", dt: 0.3, kind: "ruler", a: MINICOY, b: MDV_N, text: " ", color: C.amber},
    {in: "b9", dt: 0.7, kind: "label", at: [72.45, 7.62], text: "~130 km", color: C.amber, size: 52},
    {in: "b9", dt: 0.2, kind: "bigtext", text: "INDIAN", sub: "yet 3× closer to the Maldives", size: 130},
  ],
  question: "Did you know an Indian island speaks the Maldives' language? 👇",
  credit: "Sources: Lakshadweep Admin · 1976 treaty",
};
