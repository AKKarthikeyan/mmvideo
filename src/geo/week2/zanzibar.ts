// Indica Atlas week 2: zanzibar. Script lines: scripts/geo/week2.py; sources: docs/geo/week2/drafts/zanzibar.md.
// Map care: Zanzibar stays inside Tanzania (no country fill). Routes and merchant arrows are schematic and say so on screen.
// No door shapes are drawn: the "Indian = rounded, Omani = square" claim was cut (no primary source).
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const STONE: P = [39.19, -6.16];          // Stone Town, west side of Unguja island
const GUJ: P = [69.35, 22.83];            // Gujarat coast near Mandvi, Kutch
const MUSCAT: P = [58.45, 23.62];
// Out of Stone Town, north round Unguja, between Unguja and Pemba, then up the Swahili/Somali coast (all at sea).
const OUT: P[] = [STONE, [39.25, -5.65], [39.9, -5.6], [40.5, -5.0], [42.5, -3.0], [46, 0.5], [51, 5.5]];
const TO_GUJ: P[] = [...OUT, [57, 11.5], [62, 16], [66, 20], [68.6, 22.35], GUJ];             // schematic dhow route
const TO_OMAN: P[] = [...OUT, [55.5, 13.5], [58.5, 18.2], [60.3, 21.0], [60.2, 22.8], MUSCAT]; // schematic, round Ras al Hadd
const FROM_GUJ: P[] = [...TO_GUJ].reverse();
// Late-1800s style spread: curving arrows into Stone Town (schematic)
const CURVE_IND: P[] = [[68.4, 21.6], [64, 14], [58, 6], [51, 0], [45, -3.6], [41.5, -5.2], [39.6, -6.0]];
const CURVE_OMN: P[] = [[59.6, 21.2], [56.5, 13], [52.5, 5], [48, -0.5], [43.5, -3.8], [40.6, -5.5], [39.5, -6.05]];

const WIDE = {lon: 54.5, lat: 4, span: 36};
const TOWN = {lon: 39.19, lat: -6.16, span: 1.6};

export const zanzibar: Spec = {
  id: "zanzibar", theme: "premium", globe: {lon: 72.88, lat: 19.08}, handoff: {lon: 39.19, lat: -6.16, span: 1.6}, hi: true,
  cams: [
    {in: "b1", dt: 2.0, dur: 1.6, cam: {lon: 39.24, lat: -6.12, span: 1.9}},
    {in: "b2", cam: {lon: 39.3, lat: -6.05, span: 2.2}},
    {in: "b3", dur: 1.3, cam: WIDE},
    {in: "b4", cam: {lon: 40.5, lat: -5.0, span: 9}},
    {in: "b5", dur: 0.8, cam: {lon: 64, lat: 18, span: 20}}, {in: "b5", dt: 1.0, dur: 1.4, cam: WIDE},
    {in: "b6", cam: TOWN},
    {in: "b7", dur: 3.0, cam: {lon: 39.2, lat: -6.15, span: 1.45}},
    {in: "b8", dur: 1.2, cam: WIDE},
    {in: "b9", dur: 1.3, cam: TOWN},
  ],
  layers: [
    // b1 hook: the count from frame 0, then the town
    {in: "b1", out: "b1", kind: "counter", from: 0, to: 500, suffix: "+", label: "carved doors", y: 250, size: 190, dur: 1.4},
    {in: "b1", dt: 1.8, out: "b2", kind: "pin", at: STONE, text: "STONE TOWN", color: C.amber},
    // b2 where
    {in: "b2", dt: 0.3, out: "b2", kind: "label", at: [39.5, -6.42], text: "UNGUJA ISLAND", sub: "Zanzibar", size: 50},
    {in: "b2", dt: 0.7, out: "b2", kind: "label", at: [38.8, -6.6], text: "TANZANIA", sub: "mainland", size: 50},
    // b3 trade boom: schematic dhow routes to India's west coast and Oman
    {in: "b3", dt: 0.3, out: "b3", kind: "line", pts: TO_GUJ, color: C.amber, width: 7, draw: 1.6},
    {in: "b3", dt: 0.5, out: "b3", kind: "line", pts: TO_OMAN, color: C.cyan, width: 6, draw: 1.6},
    {in: "b3", dt: 1.2, out: "b3", kind: "particles", pts: TO_GUJ, count: 4, color: "#fff", size: 12, speed: 0.1},
    {in: "b3", dt: 1.2, out: "b3", kind: "particles", pts: TO_OMAN, count: 3, color: C.cyan, size: 11, speed: 0.1},
    {in: "b3", dt: 0.2, out: "b3", kind: "pin", at: STONE, color: C.amber},
    {in: "b3", dt: 0.3, out: "b3", kind: "label", at: [44.0, -5.6], text: "ZANZIBAR", color: C.amber, size: 46},
    {in: "b3", dt: 1.4, out: "b3", kind: "pin", at: GUJ, color: C.amber},
    {in: "b3", dt: 1.5, out: "b3", kind: "label", at: [65.5, 20.5], text: "GUJARAT", color: C.amber, size: 50},
    {in: "b3", dt: 1.6, out: "b3", kind: "pin", at: MUSCAT, color: C.cyan},
    {in: "b3", dt: 1.7, out: "b3", kind: "label", at: [55.0, 20.0], text: "OMAN", color: C.cyan, size: 50},
    {in: "b3", dt: 0.6, out: "b3", kind: "label", at: [57, 1], text: "dhow routes (schematic)", size: 40},
    // b4 four groups of merchants converge on the town (illustrative directions)
    {in: "b4", out: "b4", kind: "pin", at: STONE, color: C.amber},
    {in: "b4", dt: 0.2, out: "b4", kind: "line", pts: [[43.3, -3.2], [41.2, -4.9], [39.35, -6.05]], color: C.amber, width: 7, draw: 0.6, arrow: true},
    {in: "b4", dt: 0.2, out: "b4", kind: "label", at: [43.3, -3.2], text: "INDIAN", color: C.amber, size: 52, dy: -50},
    {in: "b4", dt: 0.6, out: "b4", kind: "line", pts: [[38.0, -3.6], [38.6, -4.9], [39.12, -6.0]], color: C.green, width: 7, draw: 0.6, arrow: true},
    {in: "b4", dt: 0.6, out: "b4", kind: "label", at: [38.0, -3.6], text: "SWAHILI", color: C.green, size: 52, dy: -50},
    {in: "b4", dt: 1.0, out: "b4", kind: "line", pts: [[42.2, -1.6], [40.6, -3.6], [39.3, -5.98]], color: C.cyan, width: 7, draw: 0.6, arrow: true},
    {in: "b4", dt: 1.0, out: "b4", kind: "label", at: [42.2, -1.6], text: "ARAB", color: C.cyan, size: 52, dy: -50},
    {in: "b4", dt: 1.4, out: "b4", kind: "line", pts: [[37.3, -6.9], [38.3, -6.5], [39.05, -6.22]], color: C.pink, width: 7, draw: 0.6, arrow: true},
    {in: "b4", dt: 1.4, out: "b4", kind: "label", at: [37.3, -6.9], text: "AFRICAN", sub: "from the interior", color: C.pink, size: 52, dy: -60},
    {in: "b4", dt: 1.8, out: "b4", kind: "label", at: [41.6, -7.4], text: "merchants (illustrative)", size: 40},
    // b5 Gujarat to Zanzibar: houses like Gujarati havelis
    {in: "b5", out: "b5", kind: "fill", state: ["Gujarat"], color: C.amber, alpha: 0.3},
    {in: "b5", dt: 0.2, out: "b5", kind: "pin", at: GUJ, color: C.amber},
    {in: "b5", dt: 0.3, out: "b5", kind: "label", at: [66.3, 20.2], text: "GUJARAT", sub: "havelis", color: C.amber, size: 54},
    {in: "b5", dt: 0.6, out: "b5", kind: "line", pts: FROM_GUJ, color: C.amber, width: 7, draw: 1.8, arrow: true},
    {in: "b5", dt: 2.0, out: "b5", kind: "pin", at: STONE, color: C.amber},
    {in: "b5", dt: 2.1, out: "b5", kind: "label", at: [44.0, -5.6], text: "STONE TOWN", color: C.amber, size: 46},
    {in: "b5", dt: 2.2, out: "b5", kind: "label", at: [57, 1], text: "route schematic", size: 40},
    // b6 32 per cent
    {in: "b6", out: "b7", kind: "pin", at: STONE, text: "STONE TOWN", color: C.amber},
    {in: "b6", out: "b6", kind: "counter", from: 0, to: 32, suffix: "%", label: "Indian-style shopfronts", y: 250, size: 210, dur: 1.3},
    // b7 wealth and doors (no door drawing)
    {in: "b7", dt: 0.1, out: "b7", kind: "bigtext", text: "RICHER OWNER", color: C.white, y: 260, size: 110},
    {in: "b7", dt: 1.2, out: "b7", kind: "bigtext", text: "GRANDER DOOR", color: C.amber, y: 420, size: 150, stamp: true},
    // b8 late-1800s styles from India and Oman (schematic arrows, no door shapes)
    {in: "b8", dt: 0.1, out: "b8", kind: "bigtext", text: "LATE 1800s", size: 130, y: 240},
    {in: "b8", dt: 0.4, out: "b8", kind: "line", pts: CURVE_IND, color: C.amber, width: 8, draw: 1.4, arrow: true},
    {in: "b8", dt: 0.7, out: "b8", kind: "line", pts: CURVE_OMN, color: C.cyan, width: 8, draw: 1.4, arrow: true},
    {in: "b8", dt: 0.5, out: "b8", kind: "label", at: [66.5, 12], text: "INDIAN", sub: "style", color: C.amber, size: 52},
    {in: "b8", dt: 0.8, out: "b8", kind: "label", at: [53.5, 19.5], text: "OMANI", sub: "(Arabian) style", color: C.cyan, size: 52},
    {in: "b8", dt: 1.6, out: "b8", kind: "pin", at: STONE, color: C.amber},
    {in: "b8", dt: 1.7, out: "b8", kind: "label", at: [44.0, -5.6], text: "ZANZIBAR", color: C.amber, size: 46},
    {in: "b8", dt: 1.0, out: "b8", kind: "label", at: [57, 1], text: "schematic", size: 40},
    // b9 loop back to the town and the count
    {in: "b9", kind: "particles", pts: TO_GUJ.slice(0, 5).reverse(), count: 4, color: C.amber, size: 11, speed: 0.15},
    {in: "b9", dt: 0.9, kind: "pin", at: STONE, text: "STONE TOWN", color: C.amber},
    {in: "b9", dt: 0.4, kind: "counter", from: 0, to: 500, suffix: "+", label: "carved doors", y: 250, size: 190, dur: 1.4},
  ],
  question: "Have you seen a door like this in Gujarat? 👇", credit: "Sources: ICOMOS, Purdy",
};
void C; type _P = P;

// premium motion (AK 26 Oct 2026): one animated icon per beat, lower-left slot
zanzibar.layers.push(
  {in: "b1", dt: 0.35, kind: "icon", name: "door", label: "500+ doors"},
  {in: "b2", dt: 0.35, kind: "icon", name: "island", label: "Zanzibar"},
  {in: "b3", dt: 0.35, kind: "icon", name: "dhow", label: "trade"},
  {in: "b4", dt: 0.35, kind: "icon", name: "people", label: "merchants"},
  {in: "b5", dt: 0.35, kind: "icon", name: "house", label: "havelis"},
  {in: "b6", dt: 0.35, kind: "icon", name: "house", label: "shopfronts"},
  {in: "b7", dt: 0.35, kind: "icon", name: "coin", label: "wealth"},
  {in: "b8", dt: 0.35, kind: "icon", name: "door", label: "styles"},
);
