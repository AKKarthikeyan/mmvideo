// Indica Atlas cyclone Short CY04: why the Bay of Bengal breeds cyclones (3 Nov 2026). Script + claim IDs: docs/geo/research/CY04-bay-why/script_v1.json.
// Map care: official coastlines (house dataset, India point of view). Murasu positions are IMD's forecast table, bulletin No. 17 (claim C002).
// Dot picture: 1 dot ~ 12 storms, 4 vs 10 dots for 51 vs 120 (claim C001, "about"). The lid is a SCHEMATIC (claim C004, post-monsoon north Bay; labelled so).
// Width rulers are measured on the map (claim C007); the funnel is an ANALOGY and is labelled so. The sea arrow at the head of the Bay is illustrative.
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const W16: [P, P] = [[81.156, 16.0], [94.224, 16.0]];
const W215: [P, P] = [[87.101, 21.5], [91.861, 21.5]];
const MURASU: P[] = [[80.6, 14.9], [80.3, 15.1], [80.0, 15.6], [79.8, 15.9]];   // IMD forecast positions 2030, 2330, 0530, 1130 IST (NB 17)
const SURGE: P[] = [[89.6, 20.2], [89.2, 21.0], [88.9, 21.7]];                // the sea piling up at the head (ARTISTIC)

const BAY = {lon: 87.5, lat: 15.5, span: 22};
export const baywhy: Spec = {
  id: "cy04baywhy", theme: "premium", globe: {lon: 30, lat: 25}, handoff: {lon: 87.5, lat: 15.5, span: 26}, hi: true,
  cams: [{in: "b1", dt: 0.1, dur: 1.0, cam: BAY}, {in: "b2", dur: 1.2, cam: {lon: 81.0, lat: 15.5, span: 9}},
    {in: "b3", dur: 1.2, cam: {lon: 77.5, lat: 15.0, span: 40}}, {in: "b4", dur: 1.0, cam: {lon: 88.5, lat: 18.5, span: 14}},
    {in: "b5", dur: 1.2, cam: {lon: 87.8, lat: 18.5, span: 15}}, {in: "b6", dur: 1.2, cam: {lon: 89.0, lat: 20.6, span: 8}},
    {in: "b7", dur: 1.2, cam: BAY}],
  layers: [
    // b1 hook: 120 vs 51 from frame 0
    {in: "b1", dt: 0.1, out: "b1", kind: "panel", name: "dotgrid", props: {title: "Cyclones, 1982–2024", note: "120 vs 51 · IMD · one dot ≈ 12 storms", gap: 78, r: 30,
      groups: [{label: "Arabian Sea", color: C.amber, total: 4, lit: 4, cols: 4, tag: "51"}, {label: "Bay of Bengal", color: C.cyan, total: 10, lit: 10, cols: 5, tag: "120"}]}},
    // b2 Murasu, IMD forecast track
    {in: "b2", dt: 0.2, out: "b2", kind: "line", pts: MURASU, color: C.white, width: 8, dash: true, draw: 1.2, arrow: true},
    {in: "b2", kind: "pin", at: MURASU[0], text: "MURASU", color: C.amber, dy: -80},
    {in: "b2", dt: 0.8, out: "b2", kind: "label", at: [82.6, 14.7], text: "NOV 2026", sub: "IMD forecast track", color: C.white, size: 44},
    // b3 warmth: the Arabian Sea is cooler
    {in: "b3", dt: 0.2, out: "b3", kind: "label", at: [66.0, 15.5], text: "ARABIAN SEA", sub: "cooler", color: C.cyan, size: 52},
    {in: "b3", dt: 0.5, out: "b3", kind: "label", at: [88.0, 12.5], text: "BAY OF BENGAL", sub: "warmer", color: C.orange, size: 52},
    {in: "b3", dt: 0.3, kind: "bigtext", text: "COOLER SEA, FEWER STORMS", sub: "IMD: the cooler Arabian Sea holds storms back", color: C.white, size: 100, y: 250},
    // b4 the lid (schematic card)
    {in: "b4", dt: 0.1, out: "b4", kind: "panel", name: "lid"},
    // b5 the shape: measured widths on the map, funnel analogy
    {in: "b5", dt: 0.2, out: "b5", kind: "ruler", a: W16[0], b: W16[1], text: "1,400 km", color: C.cyan, size: 50, dy: -50},
    {in: "b5", dt: 1.0, out: "b5", kind: "ruler", a: W215[0], b: W215[1], text: "under 500 km", color: C.amber, size: 50, dy: -50},
    {in: "b5", dt: 1.4, out: "b5", kind: "line", pts: [W16[0], W215[0]], color: C.white, width: 6, dash: true, draw: 1.0},
    {in: "b5", dt: 1.4, out: "b5", kind: "line", pts: [W16[1], W215[1]], color: C.white, width: 6, dash: true, draw: 1.0},
    {in: "b5", dt: 2.2, out: "b5", kind: "label", at: [88.4, 18.6], text: "FUNNEL", sub: "an analogy · shallow water", color: C.white, size: 54},
    // b6 the surge
    {in: "b6", dt: 0.1, out: "b6", kind: "line", pts: SURGE, color: C.cyan, width: 12, draw: 1.2, arrow: true},
    {in: "b6", dt: 0.4, out: "b6", kind: "label", at: [90.6, 20.5], text: "SEA PILES UP", sub: "path illustrative", color: C.cyan, size: 46},
    {in: "b6", dt: 0.2, kind: "bigtext", text: "THE SURGE", sub: "by far the greatest killer · IMD", color: C.white, size: 130, y: 250},
    // b7 the loop
    {in: "b7", kind: "bigtext", text: "WARM WATER BREEDS THEM", sub: "the funnel makes them deadly", color: C.white, size: 90, y: 250},
  ],
  question: "Which coast worries you most? 👇",
  credit: "Sources: IMD · Sengupta et al. 2008",
};

baywhy.layers.push(
  {in: "b2", dt: 0.5, kind: "icon", name: "compass", label: "Murasu"},
  {in: "b3", dt: 0.4, kind: "icon", name: "waves", label: "warm sea"},
  {in: "b4", dt: 0.4, kind: "icon", name: "drop", label: "river water"},
  {in: "b6", dt: 0.5, kind: "icon", name: "waves", label: "the surge"},
);
