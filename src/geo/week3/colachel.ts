// Indica Atlas W3-11: Colachel 1741 (F1 Myth Flip, ⚑ historical claims differ). Script + claims: scripts/geo/w3_colachel.py, docs/geo/research/W3-11-colachel/script_v1.json.
// Map care: official India outline (house base). NO old Travancore border and NO modern state fill (open_questions risk 8).
// Pins are present-day places for placement only (Colachel ~77.26E 8.17N, C011). No single day on screen (C010); C009 dates never shown.
import {Spec, C} from "../engine/GeoShort";

const COLACHEL: [number, number] = [77.26, 8.17];
const COCHIN: [number, number] = [76.27, 9.97];
const NEAR = {lon: 77.3, lat: 8.35, span: 4};

export const colachel: Spec = {
  id: "w3colachel", theme: "premium", globe: {lon: 77.3, lat: 10}, handoff: {lon: 77.5, lat: 10, span: 14}, hi: false,
  cams: [{in: "b1", dt: 0.1, dur: 1.2, cam: {lon: 77.3, lat: 8.4, span: 5}}, {in: "b2", dur: 1.2, cam: NEAR},
    {in: "b3", dur: 1.4, cam: {lon: 76.8, lat: 9.0, span: 6}}, {in: "b4", dur: 1.0, cam: NEAR},
    {in: "b5", dur: 1.2, cam: {lon: 77.28, lat: 8.3, span: 4}}, {in: "b6", dur: 1.0, cam: {lon: 77.3, lat: 8.4, span: 4.6}},
    {in: "b7", dur: 1.2, cam: {lon: 77.2, lat: 8.5, span: 5}}, {in: "b8", dur: 1.1, cam: NEAR}],
  layers: [
    // b1 hook: the captive who changed sides, from frame 0
    {in: "b1", out: "b1", kind: "bigtext", text: "CAPTURED HERE", sub: "a Dutch officer · later led his captors' army", color: C.white, size: 110, y: 250},
    {in: "b1", dt: 0.4, out: "b2", kind: "pin", at: COLACHEL, color: C.amber},
    {in: "b1", dt: 0.6, out: "b2", kind: "label", at: [77.3, 7.6], text: "COLACHEL", sub: "near India's southern tip", color: C.amber, size: 46},
    // b2 the Dutch occupation
    {in: "b2", dt: 0.1, out: "b2", kind: "bigtext", text: "1741", sub: "Dutch East India Company occupies Colachel", color: C.white, size: 170, y: 250},
    // b3 the tiny Dutch force (Dutch letters)
    {in: "b3", dt: 0.1, out: "b3", kind: "bigtext", text: "DUTCH LETTERS", sub: "their whole Malabar field force", color: C.white, size: 100, y: 250},
    {in: "b3", dt: 0.3, out: "b3", kind: "panel", name: "tiles", props: {words: ["350 Europeans", "490 Malays"]}},
    {in: "b3", dt: 0.5, out: "b3", kind: "pin", at: COCHIN, color: C.cyan},
    {in: "b3", dt: 0.7, out: "b3", kind: "label", at: [76.75, 10.25], text: "COCHIN", sub: "Dutch base", color: C.cyan, size: 42},
    {in: "b3", dt: 0.5, out: "b3", kind: "pin", at: COLACHEL, color: C.amber},
    // b4 Travancore attacks
    {in: "b4", dt: 0.1, out: "b4", kind: "bigtext", text: "TRAVANCORE", sub: "the kingdom's forces attack · 1741", color: C.amber, size: 120, y: 250},
    {in: "b4", dt: 0.3, out: "b6", kind: "pin", at: COLACHEL, color: C.amber},
    {in: "b4", dt: 0.5, out: "b6", kind: "label", at: [77.3, 7.95], text: "DUTCH POST", sub: "Colachel", color: C.white, size: 44},
    // b5 the Dutch account
    {in: "b5", dt: 0.1, out: "b5", kind: "bigtext", text: "SURRENDER", sub: "Dutch letters: a red-hot ball fired the gunpowder", color: C.white, size: 130, y: 250},
    // b6 Travancore's account
    {in: "b6", dt: 0.1, out: "b6", kind: "panel", name: "tiles", props: {words: ["Dutch letters: surrender", "Travancore: a battle won"]}},
    // b7 De Lannoy
    {in: "b7", dt: 0.1, out: "b7", kind: "bigtext", text: "37 YEARS", sub: "De Lannoy's tomb: about 37 years in the king's service", color: C.white, size: 150, y: 250},
    {in: "b7", dt: 0.4, out: "b7", kind: "pin", at: COLACHEL, color: C.amber},
    {in: "b7", dt: 0.6, out: "b7", kind: "label", at: [77.2, 7.85], text: "DE LANNOY", sub: "captured Dutch officer", color: C.amber, size: 44},
    // b8 the loop
    {in: "b8", dt: 0.1, kind: "bigtext", text: "CAPTURED HERE", sub: "peace treaty: years later · the captive led the army", color: C.amber, size: 110, y: 250},
    {in: "b8", dt: 0.4, kind: "pin", at: COLACHEL, color: C.amber},
    {in: "b8", dt: 0.6, kind: "label", at: [77.3, 7.95], text: "COLACHEL", sub: "old Travancore coast", color: C.amber, size: 46},
  ],
  question: "Which other battle story should we check against both sides' records? 👇",
  credit: "Sources: Dutch letters (Galletti 1911) · Travancore State Manual",
};

colachel.layers.push(
  {in: "b2", dt: 0.4, kind: "icon", name: "ship", label: "VOC"},
  {in: "b3", dt: 0.6, kind: "icon", name: "envelope", label: "letters"},
  {in: "b4", dt: 0.3, kind: "icon", name: "crown", label: "kingdom"},
  {in: "b5", dt: 0.4, kind: "icon", name: "fort", label: "stockade"},
  {in: "b6", dt: 0.5, kind: "icon", name: "scroll", label: "histories"},
  {in: "b7", dt: 0.3, kind: "icon", name: "shield", label: "his army"},
);
