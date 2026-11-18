// Indica Atlas W3-05: Rajasthan bigger than all but six European countries. Script + claims: scripts/geo/week3.py, docs/geo/research/W3-05-rajasthan.
// Map care: official India outline (house file); Rajasthan's west edge is the international boundary (C017). Germany and Finland are MOVED
// onto Rajasthan at true size (scripts/geo/week3_shapes.py), labelled "same scale". Areas on screen are the statistical offices' (C001, C004, C006-C009).
import {Spec, C} from "../engine/GeoShort";
import {DEU_ON_RJ, FIN_ON_RJ} from "./shapes";

const RJ = {lon: 73.8, lat: 26.6, span: 13};

export const rajasthan: Spec = {
  id: "w3rajasthan", theme: "premium", globe: {lon: 15, lat: 52}, handoff: {lon: 73.8, lat: 26.6, span: 16}, hi: false,
  cams: [{in: "b1", dt: 0.1, dur: 1.0, cam: RJ}, {in: "b2", dur: 1.0, cam: {lon: 73.8, lat: 26.0, span: 12}},
    {in: "b3", dur: 1.0, cam: {lon: 73.8, lat: 26.6, span: 14}}, {in: "b4", dur: 1.0, cam: {lon: 73.8, lat: 26.6, span: 13.5}},
    {in: "b5", dur: 1.0, cam: {lon: 73.8, lat: 26.0, span: 15}}, {in: "b6", dur: 1.0, cam: {lon: 73.8, lat: 26.6, span: 14}}, {in: "b7", dur: 1.0, cam: RJ}],
  layers: [
    {in: "b1", out: "b7", kind: "fill", state: ["Rajasthan"], color: C.amber, alpha: 0.32},
    // b1 hook from frame 0
    {in: "b1", out: "b1", kind: "bigtext", text: "ALL BUT 6", sub: "Europe's countries are smaller (UN list)", color: C.white, size: 150, y: 230},
    // b2 the area
    {in: "b2", kind: "counter", from: 0, to: 342239, dur: 1.4, suffix: " km²", label: "Rajasthan · Census 2011", size: 130, y: 240},
    // b3 the six bigger ones
    {in: "b3", dt: 0.1, kind: "panel", name: "tiles", props: {words: ["Russia", "Ukraine", "France", "Spain", "Sweden", "Germany"]}},
    // b4 Germany, then Finland, laid on Rajasthan at true size
    {in: "b4", dt: 0.1, out: "b4", outAt: -1.3, kind: "fill", poly: DEU_ON_RJ[0], color: C.cyan, alpha: 0.28},
    {in: "b4", dt: 0.3, out: "b4", outAt: -1.3, kind: "label", at: [73.8, 32.4], text: "GERMANY +4.5%", sub: "moved here · same scale", color: C.cyan, size: 46},
    {in: "b4", dt: 1.7, out: "b4", kind: "fill", poly: FIN_ON_RJ[0], color: C.green, alpha: 0.28},
    {in: "b4", dt: 1.9, out: "b4", kind: "label", at: [73.8, 33.7], text: "FINLAND −1.1%", sub: "moved here · same scale", color: C.green, size: 46},
    // b5 the gap
    {in: "b5", dt: 0.1, out: "b5", kind: "panel", name: "timeline", props: {items: [{y: "357,683", t: "Germany (km²)"}, {y: "342,239", t: "RAJASTHAN"}, {y: "338,493", t: "Finland"}]}},
    // b6 Norway
    {in: "b6", dt: 0.1, kind: "panel", name: "timeline", props: {items: [{y: "323,805", t: "Norway, mainland: smaller"}, {y: "342,239", t: "Rajasthan"}, {y: "384,486", t: "with Svalbard & Jan Mayen: bigger"}]}},
    // b7 the loop
    {in: "b7", dt: 0.2, kind: "bigtext", text: "ALL BUT 6", sub: "total area · one basis · UN list of Europe", color: C.amber, size: 150, y: 230},
  ],
  question: "Which country is your state bigger than? 👇",
  credit: "Sources: Census 2011 · UNSD · Destatis · Statistics Finland · SSB",
};

rajasthan.layers.push(
  {in: "b2", dt: 0.4, kind: "icon", name: "mountain", label: "342,239 km²"},
  {in: "b5", dt: 0.4, kind: "icon", name: "compass", label: "the gap"},
);
