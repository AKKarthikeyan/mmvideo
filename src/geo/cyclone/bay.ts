// Indica Atlas cyclone Short CY02: Bay of Bengal, "stronger"? Script + claim IDs: docs/geo/research/CY02-bay-of-bengal/script_v1.json.
// Map care: coastlines and borders from the house dataset (India point of view). Width lines use the measured endpoints in
// research method/bay_width_output.txt (claim C034): 16N 81.156E to 94.224E (1,397 km), 21.5N 87.101E to 91.861E (492 km).
// "Funnel" is an ANALOGY and is labelled so. No country ranking, no coping comparison; the 1970 toll is WMO's estimate, attributed on screen.
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const W16: [P, P] = [[81.156, 16.0], [94.224, 16.0]];
const W215: [P, P] = [[87.101, 21.5], [91.861, 21.5]];
const HEAD: P[] = [[86.2, 20.3], [92.4, 20.3], [92.4, 22.6], [86.2, 22.6]];   // head of the Bay (ARTISTIC outline, labelled approximate)

const BAY = {lon: 87.5, lat: 15.5, span: 22};
export const bay: Spec = {
  id: "cy02bay", theme: "premium", globe: {lon: 30, lat: 25}, handoff: {lon: 87.5, lat: 15.5, span: 26}, hi: true,
  cams: [{in: "b1", dt: 0.1, dur: 1.0, cam: BAY}, {in: "b2", dur: 1.2, cam: {lon: 77.5, lat: 15.0, span: 38}},
    {in: "b3", dur: 1.2, cam: {lon: 86.5, lat: 16.0, span: 25}}, {in: "b4", dur: 1.2, cam: {lon: 89.5, lat: 20.0, span: 10}},
    {in: "b5", dur: 1.2, cam: {lon: 87.8, lat: 18.5, span: 15}}, {in: "b6", dur: 1.0, cam: {lon: 89.0, lat: 20.5, span: 9}},
    {in: "b7", dur: 1.2, cam: BAY}],
  layers: [
    // b1 hook: the question on screen from frame 0
    {in: "b1", kind: "bigtext", text: "STRONGER?", sub: "no sign, storm for storm", color: C.white, size: 170, y: 250},
    {in: "b1", dt: 1.2, out: "b1", kind: "label", at: [87.5, 14.2], text: "BAY OF BENGAL", color: C.cyan, size: 56},
    // b2 the count: 62% vs 62%
    {in: "b2", dt: 0.4, out: "b2", kind: "bars", unit: "% severe", y: 430, items: [{label: "Arabian Sea", value: 62, color: C.amber}, {label: "Bay of Bengal", value: 62, color: C.cyan}]},
    // b3 but: about twice as many, and the deadliest on record
    {in: "b3", kind: "bigtext", text: "≈ 2×", sub: "as many cyclones as the Arabian Sea", color: C.white, size: 200, y: 250},
    {in: "b3", dt: 2.4, kind: "label", at: [90.4, 19.2], text: "DEADLIEST ON RECORD", color: C.amber, size: 48},
    // b4 1970: what is now Bangladesh
    {in: "b4", kind: "fill", iso: ["BGD"], color: "#C8CCD2", alpha: 0.22},
    {in: "b4", dt: 0.1, kind: "counter", from: 0, to: 300000, dur: 1.6, suffix: "+", label: "died · 1970 · WMO estimate", size: 150, y: 250},
    {in: "b4", dt: 0.6, out: "b4", kind: "label", at: [90.3, 23.9], text: "what is now Bangladesh", color: "#C8CCD2", size: 42},
    // b5 the turn: the funnel
    {in: "b5", dt: 0.2, out: "b5", kind: "ruler", a: W16[0], b: W16[1], text: "1,400 km", color: C.cyan, size: 50, dy: -50},
    {in: "b5", dt: 1.2, out: "b6", kind: "ruler", a: W215[0], b: W215[1], text: "under 500 km", color: C.amber, size: 50, dy: -50},
    {in: "b5", dt: 1.6, out: "b5", kind: "line", pts: [W16[0], W215[0]], color: C.white, width: 6, dash: true, draw: 1.0},
    {in: "b5", dt: 1.6, out: "b5", kind: "line", pts: [W16[1], W215[1]], color: C.white, width: 6, dash: true, draw: 1.0},
    {in: "b5", dt: 2.6, out: "b5", kind: "label", at: [88.4, 18.5], text: "FUNNEL", sub: "an analogy", color: C.white, size: 56},
    // b6 where they land
    {in: "b6", dt: 0.1, kind: "fill", poly: HEAD, color: C.amber, alpha: 0.22, dashed: true},
    {in: "b6", dt: 0.3, out: "b6", kind: "label", at: [89.3, 23.1], text: "HEAD OF THE BAY", sub: "outline approximate", color: C.amber, size: 46},
    {in: "b6", dt: 0.1, kind: "bigtext", text: "WHERE THEY LAND", sub: "not how strong", color: C.white, size: 120, y: 250},
    // b7 the loop
    {in: "b7", kind: "bigtext", text: "STRONGER? NO", sub: "deadliest on record? yes", color: C.white, size: 120, y: 250},
  ],
  question: "Thought Bay storms were stronger? 👇",
  credit: "Sources: IMD · WMO · IBTrACS (NOAA)",
};

bay.layers.push(
  {in: "b3", dt: 0.4, kind: "icon", name: "compass", label: "2× more"},
  {in: "b4", dt: 0.3, kind: "icon", name: "people", label: "1970"},
  {in: "b5", dt: 0.5, kind: "icon", name: "waves", label: "the surge"},
);
