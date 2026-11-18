// Indica Atlas week 2: berenike. Script lines: scripts/geo/week2.py; sources: docs/geo/week2/drafts/berenike.md.
// Map care: the Halaib Triangle stays out of every close shot. Close cameras sit north of 24°N and keep the frame's south
// edge at 23.15°N or above, so neither the 22°N line nor the geo.json EGY ring's spur along the old administrative line
// (35.2-35.6°E, 22.8-23.14°N) is in frame. Borders there only show, tiny, in the wide route shots (b4, b6 end, b9).
// Routes, winds and the caravan track are schematic and say so on screen. Only the pepper is called Indian, not the jar.
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const BER: P = [35.47, 23.91];            // Berenike, just south of Ras Banas
const MALABAR: P = [76.2, 10.15];         // Muziris area, Malabar coast (Kerala); ancient name not shown
const COPTOS: P = [32.81, 26.0];          // Coptos / Qift on the Nile
const ROME: P = [12.5, 41.9];
// Malabar -> Arabian Sea -> north of Socotra -> Gulf of Aden -> Bab-el-Mandeb -> Red Sea -> Berenike (all at sea, schematic)
const ROUTE: P[] = [MALABAR, [74.5, 10.6], [65, 12], [60, 12.8], [53, 13.3], [48, 12.4], [44.5, 12.4], [43.3, 12.55],
  [41.9, 14.6], [39.5, 18.5], [37.9, 21.6], [36.9, 22.5], [36.0, 23.5], [35.6, 23.8], BER];
const LAST_LEG: P[] = ROUTE.slice(-4);
const CARAVAN: P[] = [BER, [34.6, 24.6], [33.6, 25.4], COPTOS];   // Eastern Desert track, schematic
const TO_ROME: P[] = [[30.4, 31.6], [25, 33.6], [19, 35.6], [15.9, 37.6], [15.62, 38.25], [15.0, 39.5], [12.9, 41.0], [12.35, 41.7]];
const WINDS: P[][] = [[[70, 14.5], [60, 13.8]], [[68.5, 9], [58.5, 9.5]], [[66, 18.5], [59.5, 17]], [[64, 4.5], [54, 6]]];

const CLOSE = {lon: 35.42, lat: 24.29, span: 1.4};    // south edge 23.15°N
const CLOSER = {lon: 35.42, lat: 24.21, span: 1.3};   // south edge 23.15°N
const PORT = {lon: 35.35, lat: 24.28, span: 1.4};     // south edge 23.15°N
const WIDE = {lon: 59.6, lat: 16, span: 56};

export const berenike: Spec = {
  id: "berenike", theme: "premium", globe: {lon: 12.5, lat: 41.9}, handoff: {lon: 35.3, lat: 25.1, span: 2.4}, hi: true,
  cams: [
    {in: "b1", dt: 1.8, dur: 1.4, cam: CLOSE},
    {in: "b2", dur: 2.6, cam: CLOSER},
    {in: "b3", cam: PORT},
    {in: "b4", dur: 1.1, cam: WIDE},
    {in: "b5", dur: 1.3, cam: {lon: 35.55, lat: 24.28, span: 1.4}},
    {in: "b6", dt: 0.2, dur: 1.0, cam: {lon: 33.4, lat: 25.7, span: 2.2}}, {in: "b6", dt: 1.6, dur: 1.1, cam: {lon: 24.5, lat: 32.5, span: 34}},
    {in: "b7", dur: 1.1, cam: CLOSE},
    {in: "b8", dur: 3.0, cam: CLOSER},
    {in: "b9", dur: 1.3, cam: WIDE},
  ],
  layers: [
    // b1 hook: 7.5 kg from frame 0, then pepper pouring into the buried jar's spot
    {in: "b1", out: "b1", kind: "bigtext", text: "7.5+ KG", sub: "of Indian pepper in one buried jar", size: 180, y: 240, stamp: true},
    {in: "b1", dt: 2.0, out: "b2", kind: "pin", at: BER, color: C.amber},
    {in: "b1", dt: 2.1, out: "b2", kind: "label", at: [35.1, 23.95], text: "buried here", color: C.amber, size: 46},
    {in: "b1", dt: 2.2, out: "b2", kind: "particles", pts: [[35.47, 24.65], [35.47, 23.93]], count: 9, color: "#2a2018", size: 9, speed: 0.5},
    // b2 value
    {in: "b2", dt: 0.1, out: "b2", kind: "bigtext", text: "≈ 2 YEARS", sub: "of wheat for one Roman", size: 170, y: 240, stamp: true},
    // b3 the port
    {in: "b3", dt: 0.2, out: "b3", kind: "pin", at: BER, text: "BERENIKE", color: C.amber, size: 60},
    {in: "b3", dt: 0.6, out: "b3", kind: "label", at: [35.8, 24.95], text: "RED SEA", color: C.cyan, size: 56},
    {in: "b3", dt: 0.9, out: "b3", kind: "label", at: [34.95, 24.6], text: "EGYPT", sub: "Roman province", size: 56},
    // b4 monsoon route from Malabar
    {in: "b4", dt: 0.2, out: "b4", kind: "fill", state: ["Kerala"], color: C.green, alpha: 0.4},
    {in: "b4", dt: 0.2, out: "b4", kind: "pin", at: MALABAR, color: C.green},
    {in: "b4", dt: 0.3, out: "b4", kind: "label", at: [70.5, 16.5], text: "MALABAR COAST", sub: "Kerala", color: C.green, size: 46},
    ...WINDS.map((w) => ({in: "b4", dt: 0.3, out: "b4", kind: "line" as const, pts: w, color: "rgba(255,255,255,0.8)", width: 5, flow: true})),
    {in: "b4", dt: 0.5, out: "b4", kind: "line", pts: ROUTE, color: C.amber, width: 7, draw: 2.2, arrow: true},
    {in: "b4", dt: 2.4, out: "b4", kind: "pin", at: BER, color: C.amber},
    {in: "b4", dt: 2.4, out: "b4", kind: "label", at: [42, 27], text: "BERENIKE", color: C.amber, size: 46},
    {in: "b4", dt: 0.6, out: "b4", kind: "label", at: [56, 5], text: "monsoon winds · route schematic", size: 38},
    // b5 why so far south: strong north winds in the northern Red Sea
    // winds blow in from the north edge of the frame (the northern Red Sea) and stop short of the port
    {in: "b5", dt: 0.6, out: "b5", kind: "line", pts: [[35.1, 25.5], [35.3, 24.7]], color: C.red, width: 10, draw: 0.6, arrow: true},
    {in: "b5", dt: 0.8, out: "b5", kind: "line", pts: [[35.7, 25.5], [35.85, 24.6]], color: C.red, width: 10, draw: 0.6, arrow: true},
    {in: "b5", dt: 0.9, out: "b5", kind: "label", at: [35.5, 25.05], text: "strong north winds", sub: "schematic", color: C.red, size: 50},
    {in: "b5", dt: 0.2, out: "b5", kind: "line", pts: LAST_LEG, color: C.amber, width: 8, draw: 1.0, arrow: true},
    {in: "b5", dt: 1.2, out: "b5", kind: "pin", at: BER, text: "BERENIKE", color: C.amber},
    // b6 caravan to the Nile, then on to Rome
    {in: "b6", out: "b6", kind: "line", pts: CARAVAN, color: C.amber, width: 7, draw: 1.0},
    {in: "b6", dt: 0.8, out: "b6", kind: "particles", pts: CARAVAN, count: 4, color: "#fff", size: 10, speed: 0.25},
    {in: "b6", dt: 0.6, out: "b6", kind: "pin", at: COPTOS, color: C.cyan},
    {in: "b6", dt: 0.7, out: "b6", outAt: -1.3, kind: "label", at: [33.45, 26.1], text: "NILE (Coptos)", color: C.cyan, size: 46},
    {in: "b6", dt: 0.6, out: "b6", outAt: -1.3, kind: "label", at: [33.8, 25.25], text: "desert caravans", sub: "schematic", size: 42},
    {in: "b6", dt: 1.7, out: "b6", kind: "river", names: ["Nile"], color: C.cyan, width: 8, clip: [29, 34, 25.5, 31.7], draw: 1.0},
    {in: "b6", dt: 1.9, out: "b6", kind: "line", pts: TO_ROME, color: C.amber, width: 7, draw: 0.9, arrow: true},
    {in: "b6", dt: 2.5, out: "b6", kind: "pin", at: ROME, text: "ROME", color: C.amber},
    // b7 Indians lived here
    {in: "b7", out: "b7", kind: "pin", at: BER, text: "BERENIKE", color: C.amber, size: 54},
    {in: "b7", out: "b7", kind: "line", pts: LAST_LEG, color: C.amber, width: 7, flow: true},
    {in: "b7", dt: 0.3, out: "b7", kind: "bigtext", text: "INDIANS LIVED HERE", sub: "at least for a while", size: 104, y: 260},
    // b8 the Korran sherd (no letters drawn)
    {in: "b8", out: "b8", kind: "pin", at: BER, text: "BERENIKE", color: C.amber, size: 54},
    {in: "b8", dt: 0.3, out: "b8", kind: "bigtext", text: "“KORRAN, THE CHIEFTAIN”", sub: "Tamil-Brahmi letters on a broken jar", size: 104, y: 250, stamp: true},
    // b9 pull back to the whole route; pepper flows to Egypt
    {in: "b9", kind: "fill", state: ["Kerala"], color: C.green, alpha: 0.4},
    {in: "b9", kind: "line", pts: ROUTE, color: C.amber, width: 7, draw: 0.3},
    {in: "b9", dt: 0.4, kind: "particles", pts: ROUTE, count: 10, color: "#fff", size: 10, speed: 0.12},
    {in: "b9", dt: 0.2, kind: "pin", at: MALABAR, color: C.green},
    {in: "b9", dt: 0.3, kind: "label", at: [70.5, 16.5], text: "MALABAR COAST", sub: "Kerala", color: C.green, size: 46},
    {in: "b9", dt: 0.4, kind: "pin", at: BER, color: C.amber},
    {in: "b9", dt: 0.5, kind: "label", at: [42, 27], text: "BERENIKE", sub: "Egypt", color: C.amber, size: 46},
    {in: "b9", dt: 0.6, kind: "label", at: [63, 19.5], text: "route schematic", size: 38},
  ],
  question: "Which Indian spice would you have shipped to Rome? 👇", credit: "Sources: Cappers, DAI",
};
void C; type _P = P;

// premium motion sample (AK 25 Oct 2026): animated icons, one per idea
berenike.layers.push(
  {in: "b1", dt: 0.8, kind: "icon", name: "pepper", label: "7.5+ kg"},
  {in: "b2", dt: 0.3, kind: "icon", name: "coin", label: "value"},
  {in: "b3", dt: 0.3, kind: "icon", name: "anchor", label: "port"},
  {in: "b4", dt: 0.6, kind: "icon", name: "dhow", label: "monsoon"},
  {in: "b5", dt: 0.3, kind: "icon", name: "waves", label: "north winds"},
  {in: "b7", dt: 0.3, kind: "icon", name: "house", label: "lived here"},
  {in: "b8", dt: 0.4, kind: "icon", name: "scroll", label: "Tamil-Brahmi"},
);
