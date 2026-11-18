// Indica Atlas W3-14: guess the state from its shape (India slot, G3 quiz). Script + claims: docs/geo/research/W3-14-shape-quiz/script_v1.json.
// Map care: India-view base only; outlines are geo.json "states" keys Madhya Pradesh, Tamil Nadu, Goa (one ring each, none touches a
// foreign border, C008). Tamil Nadu drawn alone (Puducherry is a separate key, not drawn). Kanyakumari NOT highlighted (no official
// district boundary, open_questions 2). Goa has its own zoom (span 4, labelled "zoomed in"). Numbers on screen: C001, C002, C006, C007 only.
import {Spec, C} from "../engine/GeoShort";

const INDIA = {lon: 79, lat: 21, span: 30};
const MP = {lon: 78.4, lat: 24.5, span: 14};
const TN = {lon: 78.3, lat: 11.3, span: 11};
const GOA = {lon: 74.0, lat: 15.47, span: 4};
const END = {lon: 78.5, lat: 18, span: 22};

export const shapequiz: Spec = {
  id: "w3shapes", theme: "premium", globe: {lon: 78, lat: 22}, handoff: {lon: 79, lat: 21, span: 34}, hi: false,
  cams: [{in: "b1", dt: 0.1, dur: 1.2, cam: INDIA}, {in: "b2", dur: 1.0, cam: MP},
    {in: "b3", dur: 1.2, cam: {lon: 78.4, lat: 24.3, span: 13}}, {in: "b4", dur: 1.1, cam: TN},
    {in: "b5", dur: 1.2, cam: {lon: 78.3, lat: 11.1, span: 10.4}}, {in: "b6", dur: 1.0, cam: GOA},
    {in: "b7", dur: 1.0, cam: {lon: 74.0, lat: 15.4, span: 4.4}}, {in: "b8", dur: 1.2, cam: END}],
  layers: [
    // b1 hook from frame 0
    {in: "b1", out: "b1", kind: "bigtext", text: "83×", sub: "3 shapes · no names", color: C.white, size: 170, y: 240},
    // b2 shape 1 (question), b3 reveal
    {in: "b2", dt: 0.2, out: "b3", kind: "fill", state: ["Madhya Pradesh"], color: C.amber, alpha: 0.45},
    {in: "b2", dt: 0.1, out: "b2", kind: "bigtext", text: "SHAPE 1", sub: "2nd largest · Census 2011", color: C.white, size: 140, y: 240},
    {in: "b3", out: "b3", kind: "fill", state: ["Madhya Pradesh"], color: C.green, alpha: 0.4},
    {in: "b3", dt: 0.1, out: "b3", kind: "label", at: [78.4, 23.6], text: "MADHYA PRADESH", sub: "central India", color: C.white, size: 50},
    {in: "b3", dt: 0.2, out: "b3", kind: "panel", name: "timeline", props: {items: [{y: "308,252", t: "MADHYA PRADESH, km²"}, {y: "307,713", t: "Maharashtra, km²"}, {y: "539", t: "the gap, km² · Census 2011"}]}},
    // b4 shape 2 (question), b5 reveal
    {in: "b4", dt: 0.2, out: "b5", kind: "fill", state: ["Tamil Nadu"], color: C.amber, alpha: 0.45},
    {in: "b4", dt: 0.1, out: "b4", kind: "bigtext", text: "SHAPE 2", sub: "1956: four taluks moved in", color: C.white, size: 140, y: 240},
    {in: "b5", out: "b5", kind: "fill", state: ["Tamil Nadu"], color: C.green, alpha: 0.4},
    {in: "b5", dt: 0.1, out: "b5", kind: "label", at: [78.3, 11.0], text: "TAMIL NADU", sub: "then called Madras", color: C.white, size: 50},
    {in: "b5", dt: 0.2, out: "b5", kind: "panel", name: "timeline", props: {items: [{y: "1956", t: "4 taluks of Travancore-Cochin → Madras"}, {y: "1,684 km²", t: "Kanyakumari district · Census 2011"}]}},
    // b6 shape 3 (question, own zoom), b7 reveal
    {in: "b6", dt: 0.2, out: "b7", kind: "fill", state: ["Goa"], color: C.amber, alpha: 0.5},
    {in: "b6", dt: 0.1, out: "b6", kind: "bigtext", text: "SHAPE 3", sub: "zoomed in · own scale", color: C.white, size: 140, y: 240},
    {in: "b7", out: "b7", kind: "fill", state: ["Goa"], color: C.green, alpha: 0.45},
    {in: "b7", dt: 0.1, out: "b7", kind: "label", at: [74.0, 15.98], text: "GOA", sub: "smallest by area", color: C.white, size: 54},
    {in: "b7", dt: 0.2, out: "b7", kind: "panel", name: "timeline", props: {items: [{y: "3,702 km²", t: "GOA · smallest state, 2011"}, {y: "7,096 km²", t: "Sikkim · next smallest"}]}},
    // b8 the loop: shape 1 and shape 3 at one scale
    {in: "b8", dt: 0.1, kind: "fill", state: ["Madhya Pradesh"], color: C.amber, alpha: 0.45},
    {in: "b8", dt: 0.4, kind: "fill", state: ["Goa"], color: C.cyan, alpha: 0.6},
    {in: "b8", dt: 0.3, kind: "label", at: [78.4, 24.0], text: "MADHYA PRADESH", color: C.amber, size: 46},
    {in: "b8", dt: 0.5, kind: "pin", at: [74.0, 15.33], color: C.cyan},
    {in: "b8", dt: 0.6, kind: "label", at: [71.4, 15.33], text: "GOA", color: C.cyan, size: 46},
    {in: "b8", dt: 0.2, kind: "bigtext", text: "83×", sub: "shape 1 vs shape 3 · area", color: C.amber, size: 170, y: 240},
  ],
  question: "How many did you get? Comment your score 👇",
  credit: "Sources: Census 2011 (Table A-01) · States Reorganisation Act, 1956",
};

shapequiz.layers.push(
  {in: "b2", dt: 0.5, kind: "icon", name: "compass", label: "which state?"},
  {in: "b4", dt: 0.5, kind: "icon", name: "scroll", label: "1956 Act"},
  {in: "b6", dt: 0.4, kind: "icon", name: "telescope", label: "zoomed in"},
);
