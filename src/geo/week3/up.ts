// Indica Atlas W3-01: Uttar Pradesh, UK-sized land, sixth-biggest crowd. Script + claims: scripts/geo/week3.py, docs/geo/research/W3-01-up.
// Map care: official India outline (house file). The UK outline is MOVED onto UP at true size (scripts/geo/week3_shapes.py) and labelled
// "same scale"; it is not a place on the map. Numbers on screen: C004, C006, C008, C009, C012-C014 only.
import {Spec, C} from "../engine/GeoShort";
import {UK_ON_UP} from "./shapes";

const UP = {lon: 80.6, lat: 26.9, span: 10};
const WORLD = {lon: 52, lat: 22, span: 100};
const ukOutline = (inn: string, out: string, dt = 0) => UK_ON_UP.map((r) => ({in: inn, dt, out, kind: "fill" as const, poly: r, color: C.cyan, alpha: 0.24}));

export const up: Spec = {
  id: "w3up", theme: "premium", globe: {lon: 0, lat: 48}, handoff: {lon: 80.6, lat: 26.9, span: 14}, hi: false,
  cams: [{in: "b1", dt: 0.1, dur: 1.0, cam: UP}, {in: "b2", dur: 1.0, cam: {lon: 80.6, lat: 26.0, span: 12}},
    {in: "b3", dur: 1.0, cam: {lon: 80.6, lat: 26.9, span: 11}}, {in: "b4", dur: 1.4, cam: WORLD}, {in: "b5", dur: 1.0, cam: {lon: 42, lat: 22, span: 100}},
    {in: "b6", dur: 1.3, cam: {lon: 80.5, lat: 22.5, span: 32}}, {in: "b7", dur: 1.2, cam: UP}],
  layers: [
    {in: "b1", out: "b7", kind: "fill", state: ["Uttar Pradesh"], color: C.amber, alpha: 0.32},
    // b1 hook: UP = UK, from frame 0, then the UK outline lands on UP
    {in: "b1", out: "b1", kind: "bigtext", text: "UK-SIZED", sub: "Uttar Pradesh, by area", color: C.white, size: 150, y: 230},
    ...ukOutline("b1", "b2", 0.6),
    {in: "b1", dt: 0.9, out: "b2", kind: "label", at: [80.6, 30.5], text: "UNITED KINGDOM", sub: "moved here · same scale", color: C.cyan, size: 46},
    {in: "b1", dt: 0.9, out: "b3", kind: "label", at: [80.6, 22.6], text: "UTTAR PRADESH", sub: "240,928 km²", color: C.amber, size: 46},
    // b2 3.5x the people
    {in: "b2", dt: 0.2, out: "b2", kind: "bars", unit: "M", y: 380, items: [{label: "UK", value: 70, color: C.cyan}, {label: "UP", value: 243, color: C.amber}]},
    // b3 the projection
    {in: "b3", kind: "counter", from: 0, to: 243, dur: 1.4, suffix: " MILLION", label: "UP, 2026 · a projection", size: 150, y: 240},
    // b4 the ranking
    {in: "b4", dt: 0.2, kind: "panel", name: "tiles", props: {words: ["China", "India (rest of it)", "United States", "Indonesia", "Pakistan", "UTTAR PRADESH"]}},
    // b5 neighbours in the list
    {in: "b5", dt: 0.1, out: "b5", kind: "fill", iso: ["PAK"], color: C.cyan, alpha: 0.3},
    {in: "b5", dt: 0.6, out: "b5", kind: "fill", iso: ["NGA"], color: C.green, alpha: 0.35},
    {in: "b5", dt: 0.3, out: "b5", kind: "label", at: [64, 40], text: "PAKISTAN · 259 M", sub: "just above", color: C.cyan, size: 44},
    {in: "b5", dt: 0.8, out: "b5", kind: "label", at: [16, 17], text: "NIGERIA · 242 M", sub: "about level", color: C.green, size: 44},
    // b6 one in six Indians
    {in: "b6", out: "b6", kind: "fill", iso: ["IND"], color: C.white, alpha: 0.1},
    {in: "b6", dt: 0.2, kind: "bigtext", text: "1 IN 6", sub: "Indians lived in UP · 2011 census", color: C.amber, size: 170, y: 230},
    // b7 the loop
    ...ukOutline("b7", "b7", 0.2),
    {in: "b7", dt: 0.3, kind: "label", at: [80.6, 30.3], text: "UK-SIZED LAND", color: C.cyan, size: 50},
    {in: "b7", dt: 0.6, kind: "bigtext", text: "6TH", sub: "biggest crowd, as a country", color: C.amber, size: 170, y: 230},
  ],
  question: "Which state should we put on the scale next? 👇",
  credit: "Sources: UN WPP 2024 · NCP projections · Census 2011 · World Bank",
};

up.layers.push(
  {in: "b2", dt: 0.4, kind: "icon", name: "people", label: "3.5× the people"},
  {in: "b4", dt: 0.4, kind: "icon", name: "globe", label: "as a country"},
  {in: "b6", dt: 0.4, kind: "icon", name: "scroll", label: "census 2011"},
);
