// WINDMAP geometry for look B: focus boxes, label anchors and hand-placed routes in lon/lat. The coastline comes only from
// public/datayt/long/upsc/basemap_b.json (Natural Earth 10 m, India's official view; scripts/upsc/windmap_basemap_b.py), whose boxes keep India whole.
// Positions here are places on that map, not data: no figure is typed.
import {BOXES_B, proj, type Box} from "../map";

export type Focus = "ocean" | "india" | "asia";
export type Pt = {x: number; y: number};
export type LL = [number, number];
export const FBOX = BOXES_B as Record<Focus, Box>;
export const projector = (b: Box) => { const p = proj(b); return (lon: number, lat: number): Pt => ({x: p.x(lon), y: p.y(lat)}); };

// Tag anchors (lon, lat): the centre of a text tag, over open sea or empty land.
// Part 2 places: real positions (lon, lat), shared by every focus.
const PLACES2: Record<string, LL> = {
  andaman: [92.7, 11.7], kerala: [76.3, 10.3], mumbai: [72.88, 19.05], delhi: [77.2, 28.6], konkan: [73.3, 17.0], wrajasthan: [71.3, 26.6],
  cherrapunji: [91.72, 25.3], tncoast: [79.85, 11.2], bay: [87.5, 16.5],
};
/** Pin cards (Part 2): where the pin sits when it differs from the tag anchor, and where its card goes (side of the pin and offset in px). */
export const PIN: Record<string, {at?: LL; side: "l" | "r"; dx: number; dy: number}> = {
  andaman: {side: "r", dx: 110, dy: -85}, kerala: {side: "l", dx: -50, dy: -100}, mumbai: {side: "l", dx: -95, dy: 0}, delhi: {side: "l", dx: -120, dy: -70},
  konkan: {side: "l", dx: -60, dy: 10}, wrajasthan: {side: "l", dx: -50, dy: -20}, cherrapunji: {side: "r", dx: 120, dy: 30},
  tncoast: {side: "r", dx: 95, dy: 118}, central: {at: [79, 21.5], side: "r", dx: 130, dy: 130},
};
export const ANCHORS: Record<Focus, Record<string, LL>> = {
  ocean: {arabian: [62, 17], india: [80, 21], nw: [64, 31], south: [78, -3], central: [80, 17], top: [78, 30], ganges: [84, 25], mascarene: [68, -26.5],
    somali: [29, 8], westcoast: [62, 3.5], tibet: [92, 36], "chennai-lat": [66, 15], ...PLACES2},
  india: {arabian: [58, 13], india: [82, 21.5], nw: [62, 34], south: [58, 3], central: [80, 13], top: [92, 36], ganges: [86, 30], mascarene: [50, -2], somali: [50, 4],
    westcoast: [65, 15.5], tibet: [92, 34], "chennai-lat": [66, 15], ...PLACES2},
  asia: {arabian: [58, 16], india: [80, 20], nw: [62, 33], south: [80, 2], central: [80, 18], top: [80, 41], ganges: [86, 27.8], mascarene: [55, -5], somali: [50, 4],
    westcoast: [62, 6], tibet: [93, 41], "chennai-lat": [57, 18.8], ...PLACES2},
};

/** Catmull-Rom through points, as a cubic Bezier path string */
export const smooth = (p: Pt[]): string => {
  if (p.length < 2) return "";
  let d = `M${p[0].x.toFixed(1)},${p[0].y.toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[Math.max(0, i - 1)], b = p[i], c = p[i + 1], e = p[Math.min(p.length - 1, i + 2)];
    d += ` C${(b.x + (c.x - a.x) / 6).toFixed(1)},${(b.y + (c.y - a.y) / 6).toFixed(1)} ${(c.x - (e.x - b.x) / 6).toFixed(1)},${(c.y - (e.y - b.y) / 6).toFixed(1)} ${c.x.toFixed(1)},${c.y.toFixed(1)}`;
  }
  return d;
};
export const closed = (p: Pt[]): string => {
  const n = p.length; let d = `M${p[0].x.toFixed(1)},${p[0].y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const a = p[(i + n - 1) % n], b = p[i], c = p[(i + 1) % n], e = p[(i + 2) % n];
    d += ` C${(b.x + (c.x - a.x) / 6).toFixed(1)},${(b.y + (c.y - a.y) / 6).toFixed(1)} ${(c.x - (e.x - b.x) / 6).toFixed(1)},${(c.y - (e.y - b.y) / 6).toFixed(1)} ${c.x.toFixed(1)},${c.y.toFixed(1)}`;
  }
  return d + "Z";
};

// ---- routes and shapes (lon, lat)
export const G = {
  giant: [[67, 6], [69, 11.2], [71.8, 16.2], [75, 21.5], [77.5, 25.5]] as LL[],
  swArrows: [
    [[46, 0], [54, 5], [61, 9.5], [67.5, 13.5]],
    [[52, -6.5], [61, -1.5], [68.5, 3.5], [74, 8]],
    [[55, -13.5], [64, -8.5], [71, -4], [76, 0]],
  ] as LL[][],
  trades: [
    {trade: [[67, -17], [57.5, -8.5], [48.5, 0]] as LL[], bend: [[48.5, 0], [49.5, 3], [53, 5.8], [58, 8.2], [63, 9.8], [67.5, 11]] as LL[]},
    {trade: [[73, -17], [63.7, -8.5], [54.5, 0]] as LL[], bend: [[54.5, 0], [55.3, 2.6], [58.5, 4.8], [63, 6.6], [67.5, 8], [72, 9.2]] as LL[]},
    {trade: [[79, -17], [69.5, -8.5], [60, 0]] as LL[], bend: [[60, 0], [60.8, 2], [64, 3.4], [68, 4.8], [72.5, 6.2], [75.5, 6.8]] as LL[]},
  ],
  somali: [[55, -26], [53.5, -17.5], [50.5, -9], [46, -2.5], [48, 3.5], [51.5, 8.5], [55.5, 12.5], [62, 14.5], [68, 16], [72.3, 17]] as LL[],
  mascarene: [50, -30] as LL,
  hotNW: [71.5, 27] as LL,
  troughSouth: [[70.5, 27], [75.5, 25.2], [81, 23.2], [86, 22.2], [89, 22]] as LL[],
  troughNorth: [[71, 30.5], [77, 30.3], [83, 28.8], [88, 27.5], [91.5, 26.8]] as LL[],
  // Tibetan Plateau, approximate outline (an illustration drawn under India, so India's own outline is never altered)
  tibet: [[74.5, 36], [80, 36.8], [87, 36.2], [94, 37.6], [99, 37.2], [103, 35.6], [103.5, 32.5], [101, 29.8], [98.5, 28.2], [94, 28.6], [89, 27.6], [84, 28.4], [80.5, 30.2], [77, 32.4], [75, 34.4]] as LL[],
  tej: [[108.5, 13.8], [98, 14.8], [88, 13.6], [78, 14.4], [68, 13.4], [58, 14.5], [48, 13.2], [39, 14.2], [30, 13.4], [22, 13.8]] as LL[],
  chennai: [80.27, 13.08] as LL,
};
