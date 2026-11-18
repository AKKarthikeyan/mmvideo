// Indica Atlas W3-08: Kochi's 1341 "new deposit" (F1 Myth Flip). Script + claims: scripts/geo/w3_kochi.py, docs/geo/research/W3-08-kochi/script_v1.json.
// Map care: official India outline (house file). NO 1341 coastline and NO flood path is drawn (no source gives one; verify.md).
// Pins are present-day places for placement only. The channel line is labelled "schematic". Numbers on screen: C001-C008 only.
import {Spec, C} from "../engine/GeoShort";

const VYPIN = {lon: 76.25, lat: 10.05, span: 4};
const MOUTH = {lon: 76.25, lat: 9.97, span: 4};
const KOCHI_MOUTH: [number, number] = [76.24, 9.97];
const KODU_MOUTH: [number, number] = [76.165, 10.19];
const VYPIN_PT: [number, number] = [76.21, 10.07];
const CHANNEL: [number, number][] = [[75.92, 9.955], [76.1, 9.962], [76.235, 9.969]];

export const kochi: Spec = {
  id: "w3kochi", theme: "premium", globe: {lon: 76.25, lat: 12}, handoff: {lon: 77, lat: 12, span: 14}, hi: false,
  cams: [{in: "b1", dt: 0.1, dur: 1.2, cam: {lon: 76.4, lat: 10.0, span: 6}}, {in: "b2", dur: 1.1, cam: VYPIN},
    {in: "b3", dur: 1.4, cam: {lon: 76.22, lat: 10.08, span: 4.4}}, {in: "b4", dur: 1.1, cam: {lon: 76.4, lat: 10.1, span: 8}},
    {in: "b5", dur: 1.0, cam: {lon: 76.35, lat: 10.0, span: 7}}, {in: "b6", dur: 1.1, cam: MOUTH},
    {in: "b7", dur: 1.4, cam: {lon: 76.2, lat: 9.97, span: 4}}, {in: "b8", dur: 1.1, cam: VYPIN}],
  layers: [
    {in: "b1", out: "b8", kind: "fill", state: ["Kerala"], color: C.amber, alpha: 0.32},
    // b1 hook: the deed era, from frame 0
    {in: "b1", out: "b1", kind: "bigtext", text: "1341", sub: "old Kochi deeds count from a 'new deposit'", color: C.white, size: 170, y: 250},
    {in: "b1", dt: 0.5, out: "b5", kind: "pin", at: [76.25, 9.96], color: C.amber},
    {in: "b1", dt: 0.7, out: "b1", kind: "label", at: [77.05, 9.85], text: "KOCHI", sub: "Kerala, south-west India", color: C.amber, size: 46},
    // b2 the era's name, the island
    {in: "b2", out: "b2", kind: "bigtext", text: "PUTHUVAIPPU", sub: "'new deposit' era · from AD 1341", color: C.white, size: 110, y: 250},
    {in: "b2", dt: 0.6, out: "b3", kind: "pin", at: VYPIN_PT, color: C.cyan},
    {in: "b2", dt: 0.8, out: "b3", kind: "label", at: [75.68, 10.08], text: "VYPIN", sub: "island of river silt", color: C.cyan, size: 48},
    {in: "b2", dt: 1.4, out: "b3", kind: "pin", at: KODU_MOUTH, color: C.white},
    {in: "b2", dt: 1.5, out: "b3", kind: "label", at: [76.8, 10.24], text: "KODUNGALLUR", sub: "bar-mouth", color: C.white, size: 40},
    {in: "b2", dt: 1.8, out: "b3", kind: "label", at: [76.8, 9.9], text: "KOCHI", sub: "bar-mouth", color: C.amber, size: 40},
    // b3 the records hedge
    {in: "b3", dt: 0.2, out: "b3", kind: "panel", name: "tiles", props: {words: ["rose from the sea?", "or first settled?"]}},
    // b4 the port's belief, hedged
    {in: "b4", dt: 0.1, out: "b4", kind: "bigtext", text: "IT IS BELIEVED", sub: "Cochin Port: Periyar floods, AD 1341", color: C.white, size: 92, y: 250},
    {in: "b4", dt: 0.5, out: "b4", kind: "label", at: [76.95, 9.75], text: "COCHIN PORT", sub: "its own history page", color: C.amber, size: 42},
    // b5 the old records we read
    {in: "b5", dt: 0.1, out: "b5", kind: "panel", name: "timeline", props: {items: [{y: "1723", t: "Visscher: no flood"}, {y: "1887", t: "Logan: no flood"}, {y: "1911", t: "State Manual: no flood"}]}},
    // b6 Bristow and the channel
    {in: "b6", dt: 0.1, out: "b6", kind: "bigtext", text: "1920", sub: "Robert Bristow arrives · credited with the channel", color: C.white, size: 160, y: 250},
    {in: "b6", dt: 0.4, out: "b7", kind: "pin", at: KOCHI_MOUTH, color: C.amber},
    {in: "b6", dt: 0.7, out: "b7", kind: "line", pts: CHANNEL, color: C.cyan, width: 8, draw: 1.6},
    {in: "b6", dt: 1.0, out: "b7", kind: "label", at: [76.05, 9.84], text: "CHANNEL", sub: "schematic", color: C.cyan, size: 42},
    // b7 the first ship through the cut
    {in: "b7", dt: 0.1, out: "b7", kind: "bigtext", text: "26 MAY 1928", sub: "SS Padma: first ship through the cut", color: C.white, size: 120, y: 250},
    {in: "b7", dt: 0.4, out: "b7", kind: "line", pts: CHANNEL, color: C.white, width: 5, draw: 1.8, arrow: true, flow: true},
    // b8 the loop
    {in: "b8", dt: 0.1, kind: "bigtext", text: "1341", sub: "a date in old deeds", color: C.amber, size: 170, y: 250},
    {in: "b8", dt: 0.4, kind: "pin", at: VYPIN_PT, color: C.cyan},
    {in: "b8", dt: 0.6, kind: "label", at: [75.68, 10.08], text: "VYPIN", sub: "the 'new deposit'", color: C.cyan, size: 48},
  ],
  question: "Which Indian port's origin story should we test next? 👇",
  credit: "Sources: Cochin Port Authority · Visscher 1723 · Cochin State Manual",
};

kochi.layers.push(
  {in: "b1", dt: 0.4, kind: "icon", name: "scroll", label: "old deeds"},
  {in: "b3", dt: 0.4, kind: "icon", name: "waves", label: "the sea"},
  {in: "b4", dt: 0.4, kind: "icon", name: "anchor", label: "port story"},
  {in: "b6", dt: 0.4, kind: "icon", name: "compass", label: "engineer"},
  {in: "b7", dt: 0.3, kind: "icon", name: "ship", label: "SS Padma"},
);
