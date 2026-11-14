// Indica Atlas W3-10: Kerala, only about 1 hectare in 18 lies idle. Script + claims: scripts/geo/w3_kerala.py, docs/geo/research/W3-10-kerala-land.
// Map care: official India outline (house file); state fills from the house geo.json. Land shares = MoA&FW LUS 2023-24 (provisional);
// people/villages = Census 2011; the two bases are never combined on screen. Numbers on screen: C01, C03-C05, C07, C10 only.
import {Spec, C} from "../engine/GeoShort";

const KL = {lon: 76.2, lat: 10.2, span: 6};
const INDIA = {lon: 80, lat: 21, span: 30};
const NORTH = {lon: 81, lat: 22, span: 30};

export const kerala: Spec = {
  id: "w3kerala", theme: "premium", globe: {lon: 76, lat: 14}, handoff: {lon: 76.2, lat: 10.4, span: 9}, hi: false,
  cams: [{in: "b1", dt: 0.1, dur: 1.2, cam: KL}, {in: "b2", dur: 1.0, cam: INDIA},
    {in: "b3", dur: 1.0, cam: {lon: 76.2, lat: 10.0, span: 5.5}}, {in: "b4", dur: 1.0, cam: {lon: 76.4, lat: 10.4, span: 6.5}},
    {in: "b5", dur: 1.0, cam: {lon: 76.2, lat: 10.0, span: 5.5}}, {in: "b6", dur: 1.0, cam: {lon: 76.4, lat: 10.4, span: 6.5}},
    {in: "b7", dur: 1.2, cam: NORTH}, {in: "b8", dur: 1.2, cam: KL}],
  layers: [
    {in: "b1", out: "b8", kind: "fill", state: ["Kerala"], color: C.amber, alpha: 0.32},
    // b1 hook from frame 0
    {in: "b1", out: "b1", kind: "bigtext", text: "1 IN 18", sub: "of Kerala's hectares lies idle · 2023-24 (p)", color: C.white, size: 160, y: 240},
    {in: "b1", dt: 1.0, out: "b1", kind: "label", at: [74.6, 11.2], text: "KERALA", sub: "south-west India", color: C.amber, size: 46},
    // b2 India
    {in: "b2", out: "b2", kind: "fill", iso: ["IND"], color: C.white, alpha: 0.1},
    {in: "b2", dt: 0.1, out: "b2", kind: "panel", name: "timeline", props: {items: [{y: "5.6%", t: "Kerala: idle land"}, {y: "21.0%", t: "All India: idle land"}, {y: "2023-24", t: "provisional · barren, pasture, waste, fallow"}]}},
    // b3 density, Census 2011
    {in: "b3", out: "b3", kind: "counter", from: 0, to: 860, dur: 1.4, suffix: " / km²", label: "people · Census 2011", size: 140, y: 250},
    // b4 one uninhabited village
    {in: "b4", dt: 0.1, out: "b4", kind: "bigtext", text: "1 VILLAGE", sub: "with nobody living in it · Census 2011", color: C.white, size: 140, y: 240},
    // b5 non-agricultural uses
    {in: "b5", dt: 0.1, out: "b5", kind: "panel", name: "timeline", props: {items: [{y: "526", t: "2014-15 · thousand ha, non-agricultural uses"}, {y: "610", t: "2023-24 (p) · +16%"}]}},
    // b6 forest, a legal class
    {in: "b6", dt: 0.1, out: "b6", kind: "bigtext", text: "27.8%", sub: "classed as forest · a legal class, wooded or not", color: C.green, size: 160, y: 240},
    // b7 Punjab and West Bengal are lower
    {in: "b7", dt: 0.2, out: "b7", kind: "fill", state: ["Punjab", "West Bengal"], color: C.cyan, alpha: 0.35},
    {in: "b7", dt: 0.4, out: "b7", kind: "label", at: [75.4, 33.2], text: "PUNJAB", sub: "3.0% idle", color: C.cyan, size: 44},
    {in: "b7", dt: 0.7, out: "b7", kind: "label", at: [86.5, 27.0], text: "WEST BENGAL", sub: "3.5% idle", color: C.cyan, size: 44},
    {in: "b7", dt: 1.0, out: "b7", kind: "label", at: [71.0, 12.0], text: "KERALA", sub: "5.6% idle", color: C.amber, size: 44},
    // b8 the loop
    {in: "b8", dt: 0.2, kind: "bigtext", text: "1 IN 18", sub: "idle in Kerala · about 1 in 5 across India", color: C.amber, size: 160, y: 240},
    {in: "b8", dt: 0.6, kind: "label", at: [74.6, 11.2], text: "KERALA", sub: "2023-24 (p)", color: C.amber, size: 46},
  ],
  question: "Which state should we map next? 👇",
  credit: "Sources: MoA&FW Land Use Statistics 2023-24 (p) · Census 2011",
};

kerala.layers.push(
  {in: "b1", dt: 0.5, kind: "icon", name: "palm", label: "idle: 5.6%"},
  {in: "b3", dt: 0.4, kind: "icon", name: "people", label: "860 per km²"},
  {in: "b4", dt: 0.4, kind: "icon", name: "house", label: "census 2011"},
  {in: "b5", dt: 0.4, kind: "icon", name: "factory", label: "+16%"},
  {in: "b6", dt: 0.4, kind: "icon", name: "scroll", label: "legal class"},
);
