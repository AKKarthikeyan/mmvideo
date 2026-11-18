// Indica Atlas W3-06: Kumbh Mela, "every four years" vs the real gaps (G2 / F1 Myth Flip, ⚑ religion).
// Script + claims: scripts/geo/w3_kumbh.py, docs/geo/research/W3-06-kumbh/script_v1.json (G6 PASS).
// Beliefs are attributed (UNESCO's description; Indian government pages' rule). No deities, crowds or bathing imagery; legend left out.
// Pins: Natural Earth city points (four_sites_output.txt): Prayagraj 81.84E 25.46N, Ujjain 75.79E 23.19N, Nashik 73.78E 20.00N.
// Haridwar is not in Natural Earth: pin on the NE Ganges centreline where it reaches Haridwar (78.16E 29.95N), not the district centroid.
// Nashik shown as 2015–16 (official page), Haridwar as the year only (dates disputed, conflicts K5). Numbers on screen: C002, C007, C015.
import {Spec, C} from "../engine/GeoShort";

const PRAY: [number, number] = [81.84, 25.46];
const HARI: [number, number] = [78.16, 29.95];
const UJJ: [number, number] = [75.79, 23.19];
const NASH: [number, number] = [73.78, 20.0];
const ALL = {lon: 77.8, lat: 24.5, span: 18};

const pins = (inn: string, out: string, dt = 0) => [
  {in: inn, dt, out, kind: "pin" as const, at: HARI, text: "HARIDWAR", color: C.amber, size: 40},
  {in: inn, dt: dt + 0.2, out, kind: "pin" as const, at: PRAY, color: C.amber, size: 40},
  {in: inn, dt: dt + 0.25, out, kind: "label" as const, at: [81.4, 24.4] as [number, number], text: "PRAYAGRAJ", sub: "Allahabad until 2018", color: C.white, size: 38},
  {in: inn, dt: dt + 0.4, out, kind: "pin" as const, at: UJJ, text: "UJJAIN", color: C.amber, size: 40},
  {in: inn, dt: dt + 0.6, out, kind: "pin" as const, at: NASH, text: "NASHIK", color: C.amber, size: 40},
];

export const kumbh: Spec = {
  id: "w3kumbh", theme: "premium", globe: {lon: 78, lat: 22}, handoff: {lon: 77.8, lat: 24.5, span: 22}, hi: false,
  cams: [{in: "b1", dt: 0.1, dur: 1.2, cam: ALL}, {in: "b2", dur: 3.0, cam: {lon: 77.8, lat: 24.0, span: 20}},
    {in: "b3", dur: 1.2, cam: {lon: 77.8, lat: 24.5, span: 17}}, {in: "b4", dur: 1.2, cam: {lon: 78.4, lat: 29.0, span: 6}},
    {in: "b5", dur: 1.3, cam: {lon: 74.8, lat: 21.6, span: 8}}, {in: "b6", dur: 1.3, cam: {lon: 77.8, lat: 24.5, span: 19}},
    {in: "b7", dur: 3.5, cam: {lon: 77.8, lat: 24.5, span: 20}}, {in: "b8", dur: 1.2, cam: {lon: 77.8, lat: 23.0, span: 22}}],
  layers: [
    {in: "b1", out: "b8", kind: "fill", iso: ["IND"], color: C.white, alpha: 0.08},
    {in: "b1", dt: 0.3, out: "b8", kind: "river", names: ["Ganges"], color: C.cyan, width: 6},
    // b1 hook: the claim, from frame 0, then the four cities pop
    {in: "b1", out: "b1", kind: "bigtext", text: "EVERY 4 YEARS?", sub: "UNESCO's description", color: C.white, size: 130, y: 230},
    ...pins("b1", "b1", 0.5),
    // b2 the real run of years
    {in: "b2", dt: 0.1, out: "b2", kind: "panel", name: "timeline", props: {items: [
      {y: "2013", t: "Prayagraj"}, {y: "2015–16", t: "Nashik-Trimbakeshwar"}, {y: "2016", t: "Ujjain"},
      {y: "2021", t: "Haridwar"}, {y: "2025", t: "Prayagraj"}]}},
    // b3 the rule, as the government pages give it
    ...pins("b3", "b3", 0.1),
    {in: "b3", dt: 0.2, out: "b3", kind: "bigtext", text: "JUPITER'S SIGN", sub: "with the Sun's · govt pages", color: C.amber, size: 130, y: 230},
    // b4 Haridwar
    {in: "b4", dt: 0.1, out: "b4", kind: "pin", at: HARI, color: C.amber, size: 46},
    {in: "b4", dt: 0.3, out: "b4", kind: "label", at: [78.16, 29.2], text: "HARIDWAR", sub: "on the Ganga · Uttarakhand", color: C.white, size: 50},
    {in: "b4", dt: 0.4, out: "b4", kind: "bigtext", text: "AQUARIUS", sub: "Jupiter, for Haridwar · govt rule", color: C.cyan, size: 140, y: 230},
    // b5 Nashik and Ujjain share Leo
    {in: "b5", dt: 0.1, out: "b5", kind: "pin", at: UJJ, color: C.amber, size: 46},
    {in: "b5", dt: 0.3, out: "b5", kind: "pin", at: NASH, color: C.amber, size: 46},
    {in: "b5", dt: 0.2, out: "b5", kind: "label", at: [75.79, 22.6], text: "UJJAIN", sub: "Madhya Pradesh", color: C.white, size: 48},
    {in: "b5", dt: 0.4, out: "b5", kind: "label", at: [74.1, 19.4], text: "NASHIK", sub: "Maharashtra", color: C.white, size: 48},
    {in: "b5", dt: 0.6, out: "b5", kind: "line", pts: [UJJ, NASH], color: C.amber, width: 5, dash: true, draw: 1.0},
    {in: "b5", dt: 0.5, out: "b5", kind: "bigtext", text: "LEO", sub: "Simha → Simhastha, at both cities", color: C.amber, size: 150, y: 230},
    // b6 four cities, three Jupiter signs (our count with NASA JPL Horizons, Lahiri sidereal)
    {in: "b6", dt: 0.1, out: "b6", kind: "panel", name: "tiles", props: {words: [
      "Prayagraj · Taurus", "Nashik · Leo", "Ujjain · Leo", "Haridwar · Aquarius"]}},
    // b7 the twelve-year lap
    ...pins("b7", "b7", 0.1),
    {in: "b7", dt: 0.2, out: "b7", kind: "counter", from: 0, to: 12, dur: 1.6, prefix: "~", suffix: " YEARS", label: "Jupiter's lap · each city's wait", size: 150, y: 240},
    // b8 the loop
    ...pins("b8", "b8", 0.1),
    {in: "b8", dt: 0.3, kind: "bigtext", text: "EVERY 4 YEARS?", sub: "each city keeps Jupiter's clock", color: C.amber, size: 130, y: 230},
  ],
  question: "Which festival's calendar should we map next? 👇",
  credit: "Sources: UNESCO · kumbh.gov.in · Nashik & Haridwar dists · NASA JPL",
};

kumbh.layers.push(
  {in: "b3", dt: 0.5, kind: "icon", name: "telescope", x: 170, label: "the rule"},
  {in: "b6", dt: 0.5, kind: "icon", name: "globe", x: 170, label: "3 signs"},
  {in: "b7", dt: 0.5, kind: "icon", name: "clock", x: 170, label: "11.9 years"},
);
