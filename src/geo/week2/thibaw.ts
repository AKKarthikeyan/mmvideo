// Indica Atlas week 2: thibaw. Script lines: scripts/geo/week2.py; sources: docs/geo/week2/drafts/thibaw.md.
// Today's map with historical place names as labels only. Myanmar is not filled (its border stays a thin neutral line).
// Rangoon → Madras is the sea leg named in the 1885 telegram; Madras → Ratnagiri was not read at a source, so it is a plain dotted arc.
import {Spec, C} from "../engine/GeoShort";

type P = [number, number];
const MANDALAY: P = [96.08, 21.97], RANGOON: P = [96.16, 16.84], MADRAS: P = [80.27, 13.08], RATNAGIRI: P = [73.31, 16.99];
// Irrawaddy, Prome → Mandalay (schematic trace for the steamers)
const UP: P[] = [[95.22, 18.82], [95.18, 19.32], [94.97, 19.97], [94.93, 20.15], [94.82, 20.9], [94.86, 21.17], [95.09, 21.33], [95.39, 21.46], [95.98, 21.88], MANDALAY];
const DOWN: P[] = [...UP].reverse().concat([[95.46, 17.64], [95.9, 17.05], RANGOON] as P[]);
const SEA: P[] = [RANGOON, [96.3, 16.3], [95.4, 15.6], [94.2, 15.5], [92.8, 15.2], [88, 14.0], [83, 13.4], MADRAS];
const ARC: P[] = [MADRAS, [78, 14.6], [76, 15.9], [74.5, 16.6], RATNAGIRI];
const WIDE = {lon: 87, lat: 17.5, span: 38};
const NEAR_R = {lon: 73.31, lat: 16.99, span: 5};

export const thibaw: Spec = {
  id: "thibaw", globe: {lon: 96.08, lat: 21.97}, handoff: {lon: 87, lat: 17.5, span: 38}, hi: true,
  cams: [
    {in: "b2", cam: {lon: 95.6, lat: 20.2, span: 8}, dur: 1.2},
    {in: "b3", cam: {lon: 96.08, lat: 21.9, span: 6}},
    {in: "b4", cam: {lon: 95.6, lat: 19.1, span: 10}},
    {in: "b5", cam: {lon: 93.5, lat: 19, span: 16}, dur: 2.0},
    {in: "b6", cam: WIDE},
    {in: "b7", cam: {lon: 86.5, lat: 17.5, span: 39}},
    {in: "b8", cam: NEAR_R, dur: 1.3},
    {in: "b9", dt: 0.2, cam: WIDE, dur: 1.4},
  ],
  layers: [
    // b1 hook: Burma's last king, Mandalay → a "?" on India's Konkan coast
    {in: "b1", kind: "bigtext", text: "BURMA'S LAST KING", sub: "died in exile in India", size: 110},
    {in: "b1", dt: 1.7, out: "b2", kind: "pin", at: MANDALAY, text: "Mandalay", color: C.amber, dy: 60},
    {in: "b1", dt: 1.9, out: "b1", kind: "label", at: [96.3, 24.5], text: "BURMA", sub: "today's Myanmar", color: C.cyan, size: 54},
    {in: "b1", dt: 2.0, out: "b1", kind: "line", pts: [MANDALAY, RATNAGIRI], color: C.white, width: 6, arrow: true, draw: 0.9},
    {in: "b1", dt: 2.1, out: "b1", kind: "label", at: [84.7, 20.6], text: "schematic", size: 36},
    {in: "b1", dt: 2.8, out: "b1", kind: "pin", at: RATNAGIRI, text: "?", color: C.red, size: 70},
    // b2 British river steamers come up to Mandalay
    {in: "b2", out: "b3", kind: "line", pts: UP, color: C.cyan, width: 6, draw: 1.4},
    {in: "b2", dt: 0.3, out: "b2", kind: "particles", pts: UP, count: 3, color: "#fff", size: 11, speed: 0.12},
    {in: "b2", dt: 0.6, out: "b2", kind: "label", at: [94.3, 19.4], text: "river route, schematic", size: 36},
    {in: "b2", dt: 0.2, kind: "bigtext", text: "NOV 1885", sub: "British steamers reach Mandalay", size: 130},
    // b3 surrender
    {in: "b3", out: "b4", kind: "pin", at: MANDALAY, text: "Mandalay", color: C.amber, dy: 60},
    {in: "b3", dt: 0.1, kind: "bigtext", text: "SURRENDERED", sub: "29 Nov 1885", color: C.white, size: 130, stamp: true},
    // b4 one steamer, 68 people, down the river to Rangoon
    {in: "b4", out: "b5", kind: "line", pts: DOWN, color: C.amber, width: 6, arrow: true, draw: 1.6},
    {in: "b4", dt: 0.2, out: "b4", kind: "particles", pts: DOWN, count: 1, color: C.amber, size: 15, speed: 0.12},
    {in: "b4", dt: 0.9, out: "b5", kind: "pin", at: RANGOON, text: "Rangoon", color: C.white},
    {in: "b4", dt: 0.6, out: "b4", kind: "label", at: [94.2, 18.4], text: "route, schematic", size: 36},
    {in: "b4", dt: 0.1, kind: "counter", from: 0, to: 68, dur: 1.8, label: "people on one steamer", size: 200},
    // b5 the Viceroy's stated reason (a quote, not our judgement)
    {in: "b5", out: "b5", kind: "pin", at: MANDALAY, text: "Mandalay", color: C.amber, dy: 60},
    {in: "b5", dt: 0.1, kind: "bigtext", text: "“REMOVES ALL OPPOSITION”", sub: "Viceroy's telegram, 9 Dec 1885", size: 80, y: 300, stamp: true},
    // b6 Rangoon → Madras by sea, then a plain dotted arc on to Ratnagiri
    {in: "b6", out: "b7", kind: "line", pts: SEA, color: C.cyan, width: 6, arrow: true, draw: 1.4},
    {in: "b6", dt: 1.5, out: "b7", kind: "line", pts: ARC, color: C.white, width: 5, dash: true},
    {in: "b6", out: "b6", kind: "pin", at: RANGOON, text: "Rangoon", color: C.white},
    {in: "b6", dt: 1.2, out: "b7", kind: "pin", at: MADRAS, text: "Madras (Chennai)", color: C.cyan, size: 44},
    {in: "b6", dt: 1.8, out: "b9", kind: "pin", at: RATNAGIRI, text: "Ratnagiri", color: C.amber, size: 46},
    {in: "b6", dt: 0.4, out: "b7", kind: "label", at: [87, 11.8], text: "route, schematic", size: 36},
    // b7 the distance: ~2,400 km ruler, ≈ London–Moscow
    {in: "b7", dt: 0.1, kind: "ruler", a: MANDALAY, b: RATNAGIRI, text: "~2,400 km", dy: -60},
    {in: "b7", dt: 0.1, kind: "pin", at: MANDALAY, text: "Mandalay", color: C.amber},
    {in: "b7", dt: 0.6, kind: "bigtext", text: "≈ LONDON–MOSCOW", sub: "straight-line distance", size: 110},
    // b8 a police officer just for him: close on Ratnagiri
    {in: "b8", dt: 0.6, kind: "label", at: [72.4, 16.3], text: "ARABIAN SEA", size: 44},
    {in: "b8", dt: 0.2, kind: "bigtext", text: "A POLICE OFFICER", sub: "posted just to guard him", size: 120},
    // b9 died there in 1916; pull back to Mandalay → Ratnagiri (loops to the hook)
    {in: "b9", dt: 0.8, kind: "line", pts: [MANDALAY, RATNAGIRI], color: C.white, width: 6, arrow: true, draw: 1.0},
    {in: "b9", dt: 0.8, kind: "pin", at: MANDALAY, text: "Mandalay", color: C.amber, dy: 60},
    {in: "b9", dt: 0.9, kind: "label", at: [84.7, 20.6], text: "schematic", size: 36},
    {in: "b9", dt: 1.4, kind: "pin", at: RATNAGIRI, text: "Ratnagiri", color: C.amber, size: 46},
    {in: "b9", dt: 0.2, kind: "bigtext", text: "1916", sub: "died in Ratnagiri, still in exile", size: 170, stamp: true},
  ],
  question: "Seen Thibaw Palace in Ratnagiri? 👇",
  credit: "Sources: Blue Book 1886 · Imperial Gazetteer",
};
