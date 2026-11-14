// Indica Atlas W3-07: Konkan Railway, the line India couldn't afford "at present" in 1969. Script + claims: scripts/geo/w3_konkan.py,
// docs/geo/research/W3-07-konkan/script_v1.json. Map care: official India outline (house file); the line runs inside India only
// (Roha, Maharashtra -> Goa -> Thokur near Mangaluru, Karnataka). ROUTE IS SIMPLIFIED: approximate station points along KRCL's
// system map, labelled "route simplified" on screen. Numbers on screen: C01-C06 only (738.941 km per C06; never 760).
import {Spec, C} from "../engine/GeoShort";

const K = {lon: 73.9, lat: 15.2, span: 9};
const GOA = {lon: 74.0, lat: 15.35, span: 5};
const ROHA: [number, number] = [73.12, 18.44];
const THOKUR: [number, number] = [74.83, 12.98];
const PANAJI: [number, number] = [73.818, 15.492];   // Natural Earth point (research method output)
// first stage, Apta -> Roha (simplified)
const APTA_ROHA: [number, number][] = [[73.2, 18.86], [73.1, 18.74], [73.13, 18.54], ROHA];
// main line, Roha -> Thokur (simplified: approximate station points)
const ROUTE: [number, number][] = [ROHA, [73.27, 18.23], [73.4, 17.72], [73.52, 17.53], [73.55, 17.19], [73.37, 16.96], [73.58, 16.63],
  [73.71, 16.26], [73.69, 16.01], [73.8, 15.9], [73.8, 15.72], [73.86, 15.62], [73.95, 15.49], [73.98, 15.27], [74.05, 15.01],
  [74.15, 14.83], [74.3, 14.66], [74.42, 14.43], [74.45, 14.28], [74.57, 13.98], [74.62, 13.86], [74.69, 13.63], [74.76, 13.34],
  [74.8, 13.09], THOKUR];

export const konkan: Spec = {
  id: "w3konkan", theme: "premium", globe: {lon: 74, lat: 16}, handoff: {lon: 73.9, lat: 15.2, span: 12}, hi: false,
  cams: [{in: "b1", dt: 0.1, dur: 1.0, cam: K}, {in: "b2", dur: 1.0, cam: {lon: 73.9, lat: 15.4, span: 8.5}},
    {in: "b3", dur: 1.0, cam: {lon: 73.6, lat: 16.0, span: 7}}, {in: "b4", dur: 1.0, cam: {lon: 73.8, lat: 16.2, span: 7.5}},
    {in: "b5", dur: 1.0, cam: K}, {in: "b6", dur: 1.1, cam: GOA}, {in: "b7", dur: 1.1, cam: K}, {in: "b8", dur: 1.2, cam: {lon: 73.9, lat: 15.3, span: 9.5}}],
  layers: [
    {in: "b1", out: "b8", kind: "fill", state: ["Goa"], color: C.amber, alpha: 0.25},
    // b1 hook from frame 0: the 1969 answer
    {in: "b1", out: "b1", kind: "bigtext", text: "NOT AT PRESENT", sub: "Govt to Parliament · Aug 1969 · money", color: C.white, size: 120, y: 240},
    {in: "b1", dt: 0.6, out: "b2", kind: "label", at: [72.2, 16.6], text: "KONKAN COAST", sub: "western India", color: C.cyan, size: 44},
    // b2 the cost
    {in: "b2", dt: 0.1, out: "b2", kind: "counter", from: 0, to: 60, dur: 1.2, prefix: "Rs ", suffix: " CRORE", label: "1969 estimate · Apta–Goa line", size: 130, y: 240},
    {in: "b2", dt: 0.5, out: "b3", kind: "pin", at: PANAJI, text: "GOA", color: C.amber, dy: -70},
    // b3 the first 62 km
    {in: "b3", dt: 0.1, out: "b4", kind: "line", pts: APTA_ROHA, color: C.amber, width: 12, draw: 1.0},
    {in: "b3", dt: 0.2, out: "b3", kind: "counter", from: 0, to: 62, dur: 1.0, suffix: " KM", label: "first stretch · open 1986", size: 140, y: 240},
    {in: "b3", dt: 0.8, out: "b3", kind: "label", at: [72.0, 18.3], text: "APTA–ROHA", sub: "route simplified", color: C.amber, size: 40},
    // b4 the company
    {in: "b4", dt: 0.1, out: "b4", kind: "bigtext", text: "1990", sub: "Sida: to raise the money", color: C.amber, size: 160, y: 240},
    {in: "b4", dt: 0.5, out: "b4", kind: "pin", at: ROHA, text: "ROHA · stone laid 15 Sep 1990", color: C.white, dy: 70},
    // b5 the deadline: the planned line, dashed
    {in: "b5", dt: 0.1, out: "b6", kind: "line", pts: ROUTE, color: C.white, width: 8, dash: true, draw: 1.6},
    {in: "b5", dt: 0.2, out: "b5", kind: "bigtext", text: "4.5 YEARS", sub: "KRCL: 'by no means realistic'", color: C.white, size: 140, y: 240},
    // b6 soft soil in Goa
    {in: "b6", dt: 0.4, out: "b6", kind: "label", at: [72.9, 16.25], text: "SOFT-SOIL TUNNELS", sub: "mainly in Goa · Sida", color: C.amber, size: 46},
    {in: "b6", dt: 0.2, out: "b6", kind: "pin", at: PANAJI, color: C.amber},
    // b7 the whole line opens
    {in: "b7", dt: 0.1, out: "b8", kind: "line", pts: ROUTE, color: C.amber, width: 12, draw: 1.6, flow: true},
    {in: "b7", dt: 0.3, out: "b8", kind: "pin", at: ROHA, color: C.amber},
    {in: "b7", dt: 1.4, out: "b8", kind: "pin", at: THOKUR, color: C.amber},
    {in: "b7", dt: 0.4, out: "b8", kind: "label", at: [72.0, 18.6], text: "ROHA", sub: "Maharashtra", color: C.white, size: 44},
    {in: "b7", dt: 1.5, out: "b8", kind: "label", at: [76.0, 12.98], text: "THOKUR", sub: "near Mangaluru", color: C.white, size: 44},
    {in: "b7", dt: 1.0, out: "b8", kind: "label", at: [72.1, 14.2], text: "738.941 km", sub: "KRCL · route simplified", color: C.amber, size: 44},
    {in: "b7", dt: 0.2, out: "b7", kind: "bigtext", text: "26 JAN 1998", sub: "Republic Day · Roha–Thokur open", color: C.amber, size: 130, y: 240},
    // b8 the loop
    {in: "b8", dt: 0.1, out: "b8", kind: "panel", name: "timeline", props: {items: [{y: "1969", t: "'not at present'"}, {y: "1998", t: "open end to end"}]}},
  ],
  question: "Which Indian railway should we map next? 👇",
  credit: "Sources: Rajya Sabha (1969, 1980) · KRCL · Sida Evaluation 97/25",
};

konkan.layers.push(
  {in: "b1", dt: 0.8, kind: "icon", name: "scroll", label: "1969"},
  {in: "b4", dt: 0.8, kind: "icon", name: "coin", label: "funding"},
  {in: "b5", dt: 0.6, kind: "icon", name: "clock", label: "4.5 years"},
  {in: "b6", dt: 0.6, kind: "icon", name: "mountain", label: "soft soil"},
  {in: "b7", dt: 0.6, kind: "icon", name: "train", label: "Republic Day"},
);
