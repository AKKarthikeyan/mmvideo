// Indica Atlas W3-04: My Son, Shiva temples in central Vietnam. Script + claims: docs/geo/research/W3-04-myson/script_v1.json, scripts/geo/w3_myson.py.
// Map care: house Natural Earth India-view base. My Son pin at UNESCO's point (C002). The Andaman point is the nearest India vertex (C030).
// The distance line is labelled "straight line" (not a route or voyage). The sea east of Vietnam is NOT labelled (open_questions 5). Vietnam is not filled.
// Numbers on screen: C030 (~1,500 km), C036 (4th-13th c.), C011/C012 source years, C003 (1999), C027 (3 groups, 2017-2022) only.
import {Spec, C} from "../engine/GeoShort";

const MYSON: [number, number] = [108.109, 15.774];
const ANDAMAN: [number, number] = [94.29, 13.42];
const WIDE = {lon: 101.2, lat: 12, span: 24};
const SITE = {lon: 108.1, lat: 15.8, span: 6};

export const myson: Spec = {
  id: "w3myson", theme: "premium", globe: {lon: 100, lat: 14}, handoff: {lon: 101.2, lat: 14, span: 24}, hi: false,
  cams: [{in: "b1", dt: 0.1, dur: 1.0, cam: WIDE}, {in: "b2", dur: 1.2, cam: SITE}, {in: "b3", dur: 1.0, cam: {lon: 108.1, lat: 15.6, span: 5}},
    {in: "b4", dur: 1.0, cam: {lon: 108.2, lat: 15.8, span: 5.5}}, {in: "b6", dur: 1.4, cam: {lon: 98, lat: 15, span: 40}},
    {in: "b8", dur: 1.2, cam: WIDE}],
  layers: [
    // b1 hook: Shiva temples in Vietnam, ~1,500 km from India's Andamans
    {in: "b1", out: "b1", kind: "bigtext", text: "SHIVA TEMPLES", sub: "in Vietnam · My Son", color: C.white, size: 120, y: 230},
    {in: "b1", out: "b5", kind: "pin", at: MYSON, color: C.amber},
    {in: "b1", dt: 0.3, out: "b1", kind: "label", at: [108.1, 17.6], text: "MY SON", sub: "Vietnam", color: C.amber, size: 46},
    {in: "b1", dt: 0.5, out: "b1", kind: "fill", iso: ["IND"], color: C.cyan, alpha: 0.25},
    {in: "b1", dt: 0.6, out: "b1", kind: "ruler", a: ANDAMAN, b: MYSON, text: "≈ 1,500 KM · STRAIGHT LINE", color: C.cyan, size: 40},
    {in: "b1", dt: 0.9, out: "b1", kind: "label", at: [96, 9.5], text: "ANDAMANS", sub: "India", color: C.cyan, size: 42},
    // b2 UNESCO dates
    {in: "b2", dt: 0.2, out: "b2", kind: "bigtext", text: "4TH–13TH", sub: "century CE · UNESCO", color: C.amber, size: 150, y: 230},
    {in: "b2", dt: 0.6, out: "b2", kind: "label", at: [108.1, 16.9], text: "MY SON", sub: "Cham temples", color: C.amber, size: 46},
    // b3 among the oldest inscriptions
    {in: "b3", dt: 0.1, out: "b3", kind: "bigtext", text: "A KING'S STONE", sub: "among the oldest known · Finot 1904, Majumdar 1927", color: C.white, size: 110, y: 230},
    {in: "b3", dt: 0.4, out: "b3", kind: "icon", name: "scroll", label: "inscription"},
    // b4 probably wooden, burned, rebuilt
    {in: "b4", dt: 0.1, out: "b4", kind: "bigtext", text: "PROBABLY WOODEN", sub: "burned, then rebuilt · Finot's reading", color: C.amber, size: 100, y: 230},
    {in: "b4", dt: 0.5, out: "b4", kind: "icon", name: "crown", label: "a later king"},
    // b5 the new name
    {in: "b5", dt: 0.1, out: "b5", kind: "panel", name: "tiles", props: {words: ["Bhadresvara", "renamed:", "Cambhubhadresvara", "names from kings?", "Majumdar's reading"]}},
    // b6 the date is not known
    {in: "b6", dt: 0.2, out: "b6", kind: "bigtext", text: "DATE NOT KNOWN", sub: "when Shiva worship arrived · ICOMOS", color: C.white, size: 110, y: 230},
    {in: "b6", dt: 0.3, out: "b6", kind: "pin", at: MYSON, color: C.amber},
    {in: "b6", dt: 0.5, out: "b6", kind: "icon", name: "clock", label: "date unknown"},
    // b7 the wording changed
    {in: "b7", dt: 0.1, out: "b7", kind: "panel", name: "timeline", props: {items: [{y: "ICOMOS", t: "recommended “introduction”"}, {y: "UNESCO", t: "Committee, 1999: “an indigenous society adapting”"}]}},
    // b8 loop: India's ASI restored three groups of these Shiva temples
    {in: "b8", dt: 0.2, kind: "fill", iso: ["IND"], color: C.cyan, alpha: 0.25},
    {in: "b8", dt: 0.3, kind: "pin", at: MYSON, color: C.amber},
    {in: "b8", dt: 0.5, kind: "ruler", a: ANDAMAN, b: MYSON, text: "≈ 1,500 KM · STRAIGHT LINE", color: C.cyan, size: 40},
    {in: "b8", dt: 0.4, kind: "label", at: [108.1, 17.6], text: "MY SON", sub: "Shiva temples", color: C.amber, size: 46},
    {in: "b8", dt: 0.6, kind: "bigtext", text: "3 GROUPS", sub: "ASI restoration · 2017–2022", color: C.amber, size: 150, y: 230},
  ],
  question: "Which faraway link to India should we map next? 👇",
  credit: "Sources: UNESCO · ICOMOS 1999 · Finot 1904 · Majumdar 1927 · ASI",
};
