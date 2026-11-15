// WINDMAP geometry (UPSC monsoon film): the three focus boxes, projection, label anchors, curve sampling and the hand-placed
// layer geometry in lon/lat. The coastline comes from public/datayt/long/upsc/basemap.json (Natural Earth 10 m, India's point of view,
// built by scripts/upsc/windmap_basemap.py). Positions below are places on that map, not data: no figure is typed here.
import basemap from "../../../../../public/datayt/long/upsc/basemap.json";

export type Focus = "ocean" | "india" | "asia";
export type Box = {lon0: number; lon1: number; lat0: number; lat1: number; k: number; land: string; india: string};
export type Pt = {x: number; y: number};
export type LL = [number, number];

export const BOXES = (basemap as unknown as {boxes: Record<Focus, Box>}).boxes;
export const projector = (b: Box) => (lon: number, lat: number): Pt => ({x: (lon - b.lon0) * b.k, y: (b.lat1 - lat) * b.k});

// Label anchors (lon, lat) per focus box. Placed over open sea or empty land so a label never hides the story.
export const ANCHORS: Record<Focus, Record<string, LL>> = {
  ocean: {arabian: [44, 21.5], india: [84, 19], nw: [66, 24], south: [78, -2], central: [80, 19], top: [78, 24], ganges: [84, 24], mascarene: [66, -24.8], somali: [28, 8],
    westcoast: [66.5, 7], tibet: [92, 40], "chennai-lat": [66, 15]},
  india: {arabian: [60, 14], india: [84, 21], nw: [62, 33.5], south: [64, 5], central: [79, 11.5], top: [88, 35], ganges: [84, 29], mascarene: [50, -2], somali: [50, 4],
    westcoast: [64, 10], tibet: [88, 33], "chennai-lat": [66, 15]},
  asia: {arabian: [60, 16], india: [80, 20], nw: [66, 32], south: [80, 2], central: [80, 18], top: [80, 40], ganges: [91, 31.8], mascarene: [55, -5], somali: [50, 4],
    westcoast: [64, 8], tibet: [92, 41], "chennai-lat": [57, 18.8]},
};

// Centre-line sampling: Catmull-Rom through the given points, returned as a dense polyline with running length.
export type Curve = {pts: Pt[]; len: number[]; total: number};
export const curve = (ctrl: Pt[], per = 14): Curve => {
  const p = [ctrl[0], ...ctrl, ctrl[ctrl.length - 1]];
  const out: Pt[] = [];
  for (let i = 1; i < p.length - 2; i++) {
    for (let j = 0; j < per; j++) {
      const t = j / per, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push({x: f(p[i - 1].x, p[i].x, p[i + 1].x, p[i + 2].x), y: f(p[i - 1].y, p[i].y, p[i + 1].y, p[i + 2].y)});
    }
  }
  out.push(ctrl[ctrl.length - 1]);
  const len = [0];
  for (let i = 1; i < out.length; i++) len.push(len[i - 1] + Math.hypot(out[i].x - out[i - 1].x, out[i].y - out[i - 1].y));
  return {pts: out, len, total: len[len.length - 1]};
};
export const pointAt = (c: Curve, s: number): {x: number; y: number; a: number} => {
  s = Math.max(0, Math.min(c.total, s));
  let i = 1; while (i < c.len.length - 1 && c.len[i] < s) i++;
  const a = c.pts[i - 1], b = c.pts[i], seg = c.len[i] - c.len[i - 1] || 1, u = (s - c.len[i - 1]) / seg;
  return {x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, a: Math.atan2(b.y - a.y, b.x - a.x)};
};
export const slice = (c: Curve, s: number): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < c.pts.length && c.len[i] <= s; i++) out.push(c.pts[i]);
  const e = pointAt(c, s); out.push({x: e.x, y: e.y});
  return out;
};

// ---- hand-placed geometry (lon, lat). All sea routes were checked against the coastline in stills.
export const G = {
  // sea-breeze giant: from the Arabian Sea onto north-west/central India (textbook picture)
  giant: [[67, 6], [69, 11.2], [71.8, 16.2], [75, 21.5], [77.5, 25.5]] as LL[],
  // south-westerly monsoon arrows onto the west coast
  swArrows: [
    [[46, 0], [54, 5], [61, 9.5], [67.5, 13.5]],
    [[52, -6.5], [61, -1.5], [68.5, 3.5], [74, 8]],
    [[55, -13.5], [64, -8.5], [71, -4], [76, 0]],
  ] as LL[][],
  // south-east trades crossing the equator between 40 and 60 E, then bending to the right (becoming the SW monsoon)
  trades: [
    {cross: 48.5, trade: [[67, -17], [57.5, -8.5], [48.5, 0]] as LL[], bend: [[48.5, 0], [49.5, 3], [53, 5.8], [58, 8.2], [63, 9.8], [67.5, 11]] as LL[]},
    {cross: 54.5, trade: [[73, -17], [63.7, -8.5], [54.5, 0]] as LL[], bend: [[54.5, 0], [55.3, 2.6], [58.5, 4.8], [63, 6.6], [67.5, 8], [72, 9.2]] as LL[]},
    {cross: 60, trade: [[79, -17], [69.5, -8.5], [60, 0]] as LL[], bend: [[60, 0], [60.8, 2], [64, 3.4], [68, 4.8], [72.5, 6.2], [75.5, 6.8]] as LL[]},
  ],
  somali: [[55, -26], [53.5, -17.5], [50.5, -9], [46, -2.5], [48, 3.5], [51.5, 8.5], [55.5, 12.5], [62, 14.5], [68, 16], [72.3, 17]] as LL[],
  mascarene: [50, -30] as LL,
  hotNW: [71.5, 27] as LL,
  // trough: heat low in the north-west to the head of the Bay of Bengal; "south" = active, "north" = break (Himalayan foothills)
  troughSouth: [[70.5, 27], [75.5, 25.2], [81, 23.2], [86, 22.2], [89, 22]] as LL[],
  troughNorth: [[71, 30.5], [77, 30.3], [83, 28.8], [88, 27.5], [91.5, 26.8]] as LL[],
  // Tibetan Plateau, approximate outline (an illustration: India is drawn on top of it, so India's own outline is never altered)
  tibet: [[74.5, 36], [80, 36.8], [87, 36.2], [94, 37.6], [99, 37.2], [103, 35.6], [103.5, 32.5], [101, 29.8], [98.5, 28.2], [94, 28.6], [89, 27.6], [84, 28.4], [80.5, 30.2], [77, 32.4], [75, 34.4]] as LL[],
  // Tropical Easterly Jet: Vietnam to west Africa, near the latitude of Chennai (13 N)
  tej: [[108.5, 13.8], [98, 14.8], [88, 13.6], [78, 14.4], [68, 13.4], [58, 14.5], [48, 13.2], [39, 14.2], [30, 13.4], [22, 13.8]] as LL[],
  chennai: [80.27, 13.08] as LL,
  itcz: [[62, 22], [70, 24], [78, 25.4], [86, 24.8], [93, 23.2], [99, 22]] as LL[],
};
