// Indica Atlas W3-09: Sanjay Gandhi National Park, a forest kept to guard water. Script + claims: scripts/geo/w3_mumbai.py,
// docs/geo/research/W3-09-mumbai-np/script_v1.json. Map care: park ring = the 12 gazette boundary points (S.O. 229(E) draft) joined
// in order, labelled schematic; the x8 copy is MOVED into the sea at true shape and labelled. Numbers on screen: C001-C005, C007 only.
import {Spec, C} from "../engine/GeoShort";
import {PARK, PARK_C, PARK_X8, INSET_C, TULSI_X8, VIHAR_X8} from "./mumbai_geo";

const NEAR = {lon: 72.9, lat: 19.2, span: 4};
const INSET = {lon: 72.3, lat: 19.1, span: 4};

export const mumbai: Spec = {
  id: "w3mumbai", theme: "premium", globe: {lon: 76, lat: 20}, handoff: {lon: 72.9, lat: 19.4, span: 12}, hi: false,
  cams: [{in: "b1", dt: 0.1, dur: 1.4, cam: {lon: 72.9, lat: 19.2, span: 6}}, {in: "b2", dur: 1.2, cam: NEAR},
    {in: "b3", dur: 1.2, cam: INSET}, {in: "b4", dur: 1.0, cam: {lon: 72.25, lat: 18.95, span: 4}},
    {in: "b5", dur: 1.0, cam: INSET}, {in: "b6", dur: 1.2, cam: {lon: 72.35, lat: 19.15, span: 4.4}},
    {in: "b7", dur: 1.2, cam: NEAR}, {in: "b8", dur: 1.2, cam: {lon: 72.9, lat: 19.25, span: 5}}],
  layers: [
    // the real park (schematic ring), whole video
    {in: "b1", out: "b8", kind: "fill", poly: PARK, color: C.amber, alpha: 0.6},
    // b1 hook
    {in: "b1", out: "b1", kind: "bigtext", text: "54+", sub: "adult leopards, 2024", color: C.amber, size: 200, y: 300},
    {in: "b1", dt: 0.6, out: "b1", kind: "pin", at: PARK_C, text: "THE PARK", color: C.amber},
    // b2 metropolis, two districts
    {in: "b2", dt: 0.2, out: "b2", kind: "bigtext", text: "IN THE METROPOLIS", sub: "draft notification", color: C.white, size: 90, y: 300},
    {in: "b2", dt: 0.5, out: "b2", kind: "label", at: [72.85, 18.88], text: "MUMBAI", color: C.white, size: 44},
    {in: "b2", dt: 0.8, out: "b2", kind: "label", at: [73.4, 19.48], text: "THANE", color: C.white, size: 44},
    // b3 the area, enlarged schematic
    {in: "b3", dt: 0.2, out: "b8", kind: "line", pts: [PARK_C, [72.16, 19.28]], color: C.white, width: 3, dash: true, draw: 0.6},
    {in: "b3", dt: 0.4, out: "b7", kind: "fill", poly: PARK_X8, color: C.amber, alpha: 0.35},
    {in: "b3", dt: 0.6, out: "b7", kind: "label", at: [INSET_C[0], 20.15], text: "PARK ×8", sub: "schematic · 12 gazette points", color: C.amber, size: 46},
    {in: "b3", dt: 0.3, out: "b3", kind: "counter", from: 0, to: 104, dur: 1.4, prefix: "≈", suffix: " KM²", label: "as administered (103.84)", size: 140, y: 300},
    // b4 the lakes
    {in: "b4", dt: 0.3, out: "b6", kind: "pin", at: TULSI_X8, color: C.cyan},
    {in: "b4", dt: 0.6, out: "b6", kind: "pin", at: VIHAR_X8, color: C.cyan},
    {in: "b4", dt: 0.4, out: "b6", kind: "label", at: [72.48, 18.73], text: "TULSI LAKE", color: C.cyan, size: 42},
    {in: "b4", dt: 0.7, out: "b6", kind: "label", at: [72.48, 18.37], text: "VIHAR LAKE", color: C.cyan, size: 42},
    {in: "b4", dt: 0.2, out: "b4", kind: "bigtext", text: "BUILT FOR WATER", sub: "park timeline: 1870", color: C.cyan, size: 100, y: 300},
    // b5 catchments acquired
    {in: "b5", dt: 0.2, out: "b6", kind: "fill", poly: PARK_X8, color: C.green, alpha: 0.4},
    {in: "b5", dt: 0.3, out: "b5", kind: "bigtext", text: "ACQUIRED", sub: "the lake catchments", color: C.green, size: 130, y: 300},
    // b6 a forest kept to guard water
    {in: "b6", dt: 0.2, out: "b6", kind: "bigtext", text: "KEPT FOR WATER", sub: "the park's own history", color: C.white, size: 100, y: 300},
    // b7 the 1981 name
    {in: "b7", dt: 0.2, out: "b7", kind: "bigtext", text: "1981", sub: "renamed", color: C.amber, size: 190, y: 300},
    {in: "b7", dt: 0.8, out: "b8", kind: "label", at: [72.91, 19.62], text: "SANJAY GANDHI NP", color: C.amber, size: 42},
    // b8 the loop
    {in: "b8", dt: 0.2, kind: "bigtext", text: "54+", sub: "a forest kept for water", color: C.amber, size: 200, y: 300},
    {in: "b8", dt: 0.5, kind: "pin", at: PARK_C, color: C.amber},
  ],
  question: "Which city forest should we map next? 👇",
  credit: "Sources: MoEFCC draft S.O. 229(E) · SGNP Forest Dept · WCS-India",
};

mumbai.layers.push(
  {in: "b4", dt: 0.5, kind: "icon", name: "drop", label: "water"},
  {in: "b5", dt: 0.5, kind: "icon", name: "shield", label: "protected"},
  {in: "b7", dt: 0.5, kind: "icon", name: "scroll", label: "1981"},
);
