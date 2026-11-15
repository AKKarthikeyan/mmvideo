// Shared kit for the "slope" and "multiples" scenes (a helper file of kind "slope"): survey labels, line colours, point reading from
// fig(), value-chip placement that keeps chips off the lines, the dots and each other, and the chunky direction arrow.
// Nothing here prints a figure: the scenes print fig(...).text only from the narrator's reveal frame.
import React from "react";
import {AbsoluteFill} from "remotion";
import {C} from "../../palette";
import {ROUND} from "../../ui";
import {fig, hasFig} from "../figs";

// ---- surveys and names ---------------------------------------------------------------------------------------------------
export const SURVEY_ORDER = ["nfhs3", "nfhs4", "nfhs5", "nfhs6"];
export const SURVEYS: Record<string, {label: string; sub: string}> = {
  nfhs3: {label: "NFHS-3", sub: "2005-06"}, nfhs4: {label: "NFHS-4", sub: "2015-16"},
  nfhs5: {label: "NFHS-5", sub: "2019-21"}, nfhs6: {label: "NFHS-6", sub: "2023-24"},
};
export const DEFAULT_SURVEYS = ["nfhs4", "nfhs5", "nfhs6"];
export const surveyLabel = (s: string) => SURVEYS[s] ?? {label: s.toUpperCase(), sub: ""};
export const sortSurveys = (xs: string[]) => Array.from(new Set(xs)).sort((a, b) => {
  const ia = SURVEY_ORDER.indexOf(a), ib = SURVEY_ORDER.indexOf(b);
  return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || (a < b ? -1 : 1);
});

const SHORT: Record<string, string> = {"Andaman and Nicobar Islands": "Andaman & Nicobar", "Jammu and Kashmir": "Jammu & Kashmir", "NCT of Delhi": "Delhi"};
export const niceName = (s: string) => SHORT[s] ?? s;

// One colour per line: flat fill + a darker tone for its numbers. Red is left for the "fall" highlight.
export const LINES = [
  {c: C.blue, d: C.blueDark}, {c: C.orange, d: C.orangeDark}, {c: C.green, d: C.greenDark},
  {c: "#8E5BD9", d: "#5E36A8"}, {c: "#16A3A8", d: "#0B6B70"}, {c: "#E0569B", d: "#A8286A"},
];

// ---- reading points from the figures (the only source of a number) -----------------------------------------------------------
export type Pt = {s: string; col: number; ri: number; v: number; text: string};   // ri: index among the surveys the storyboard asked for

// The figures of one state for the surveys asked, in survey order. A survey with no figure is skipped, never guessed; a state with no
// figure at all throws (so a typo in the storyboard fails the render).
export const readPoints = (t: string, state: string, surveys: string[], cols: string[], dec: number): Pt[] => {
  const out: Pt[] = [];
  sortSurveys(surveys).forEach((s, ri) => {
    const r = {t, state, s};
    if (!hasFig(r)) return;
    const g = fig(r, dec);
    out.push({s, col: cols.indexOf(s), ri, v: g.value, text: g.text});
  });
  if (!out.length) throw new Error(`figure missing: no figure for ${JSON.stringify({t, state})} in surveys ${surveys.join(", ")}`);
  return out;
};

// A change between two points, in whole units of the last printed decimal (no float noise: 1.9 - 1.6 is 0.29999...).
export const tenths = (p: Pt, dec: number) => Math.round(p.v * 10 ** dec);

// ---- text and geometry ----------------------------------------------------------------------------------------------------
export const tw = (s: string, size: number) => s.split("").reduce((a, ch) => a + size * (ch === "." ? 0.3 : /\d/.test(ch) ? 0.6 : 0.66), 0);
export type Box = {x: number; y: number; w: number; h: number}; // centre x, y
export type Seg = {x1: number; y1: number; x2: number; y2: number};
export const chipBox = (text: string, size: number): {w: number; h: number} => ({w: Math.ceil(tw(text, size)) + 40, h: size + 28});

const segHitsBox = (s: Seg, b: Box, pad: number) => {
  const L = b.x - b.w / 2 - pad, R = b.x + b.w / 2 + pad, T = b.y - b.h / 2 - pad, B = b.y + b.h / 2 + pad;
  const dx = s.x2 - s.x1, dy = s.y2 - s.y1, p = [-dx, dx, -dy, dy], q = [s.x1 - L, R - s.x1, s.y1 - T, B - s.y1];
  let t0 = 0, t1 = 1;
  for (let i = 0; i < 4; i++) {
    if (p[i] === 0) { if (q[i] < 0) return false; continue; }
    const r = q[i] / p[i];
    if (p[i] < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; }
  }
  return true;
};
const boxesOverlap = (a: Box, b: Box, pad: number) => Math.abs(a.x - b.x) < (a.w + b.w) / 2 + pad && Math.abs(a.y - b.y) < (a.h + b.h) / 2 + pad;
const circleHitsBox = (cx: number, cy: number, r: number, b: Box) => {
  const dx = Math.max(Math.abs(cx - b.x) - b.w / 2, 0), dy = Math.max(Math.abs(cy - b.y) - b.h / 2, 0);
  return dx * dx + dy * dy < r * r;
};

export type Place = {id: string; x: number; y: number; w: number; h: number; r: number}; // a dot at (x, y) of radius r that wants a chip w x h
export type Bounds = {x0: number; x1: number; y0: number; y1: number};

// Puts each chip next to its dot where it touches no line, no dot, no other chip and stays inside the bounds. Candidates are a few rings of
// positions round the dot (above and below first); a greedy pass seeds the layout and then each chip is moved to its cheapest spot given the
// others, until nothing improves. Deterministic, so a chip never jumps between frames.
export const placeChips = (items: Place[], segs: Seg[], dots: {x: number; y: number; r: number}[], taken: Box[], bounds: Bounds): Record<string, Box> => {
  const ANG = [270, 90, 180, 0, 225, 315, 135, 45, 250, 290, 110, 70, 200, 340, 160, 20];
  const cands = (it: Place): Box[] => {
    const out: Box[] = [];
    for (const k of [1, 1.4, 1.9]) for (const a of ANG) {
      const rad = (a * Math.PI) / 180, dx = it.w / 2 + it.r + 8, dy = it.h / 2 + it.r + 8;
      out.push({x: it.x + Math.cos(rad) * dx * k, y: it.y + Math.sin(rad) * dy * k, w: it.w, h: it.h});
    }
    return out;
  };
  const cost = (b: Box, ci: number, others: Box[]) => {
    let p = 0.03 * ci;                                   // earlier candidates (above, below, beside; nearer rings) win ties
    if (b.x - b.w / 2 < bounds.x0 || b.x + b.w / 2 > bounds.x1 || b.y - b.h / 2 < bounds.y0 || b.y + b.h / 2 > bounds.y1) p += 60;
    for (const s of segs) if (segHitsBox(s, b, 18)) p += 7;
    for (const d of dots) if (circleHitsBox(d.x, d.y, d.r + 6, b)) p += 70;
    for (const o of others) if (boxesOverlap(b, o, 6)) p += 40;
    return p;
  };
  const C = items.map(cands), cur: number[] = items.map(() => 0);
  const boxOf = (i: number) => C[i][cur[i]];
  const othersOf = (i: number) => [...taken, ...items.map((_, j) => j).filter((j) => j !== i && cur[j] >= 0).map(boxOf)];
  items.forEach((_, i) => {                              // greedy seed: only the chips placed so far count as obstacles
    cur[i] = -1;
    let best = 0, bp = Infinity;
    C[i].forEach((b, ci) => { const p = cost(b, ci, othersOf(i)); if (p < bp) { bp = p; best = ci; } });
    cur[i] = best;
  });
  for (let round = 0; round < 8; round++) {
    let moved = false;
    items.forEach((_, i) => {
      const oth = othersOf(i);
      let best = cur[i], bp = cost(boxOf(i), cur[i], oth);
      C[i].forEach((b, ci) => { const p = cost(b, ci, oth); if (p < bp - 1e-9) { bp = p; best = ci; } });
      if (best !== cur[i]) { cur[i] = best; moved = true; }
    });
    if (!moved) break;
  }
  const out: Record<string, Box> = {};
  items.forEach((it, i) => { out[it.id] = boxOf(i); });
  return out;
};

// Centres of labels in one column, pushed apart so none is closer than `gap`, kept inside [lo, hi]. Input and output are in the same order.
export const spreadY = (ys: number[], gap: number, lo: number, hi: number): number[] => {
  const idx = ys.map((_, i) => i).sort((a, b) => ys[a] - ys[b]), v = idx.map((i) => ys[i]);
  for (let it = 0; it < 80; it++) {
    let moved = false;
    for (let i = 1; i < v.length; i++) { const d = v[i] - v[i - 1]; if (d < gap - 0.01) { const m = (gap - d) / 2; v[i - 1] -= m; v[i] += m; moved = true; } }
    for (let i = 0; i < v.length; i++) v[i] = Math.min(hi, Math.max(lo, v[i]));
    if (!moved) break;
  }
  const out = ys.slice();
  idx.forEach((orig, k) => { out[orig] = v[k]; });
  return out;
};

// ---- drawing pieces -----------------------------------------------------------------------------------------------------------
// A white value chip with a hard offset shadow, as the pilot's badges.
export const ValChip: React.FC<{box: Box; text: string; color: string; size: number; t: number; rot?: number}> = ({box, text, color, size, t, rot = 0}) => t <= 0.001 ? null :
  <div style={{position: "absolute", left: box.x - box.w / 2, top: box.y - box.h / 2, width: box.w, height: box.h, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center",
    background: C.white, border: `6px solid ${C.ink}`, borderRadius: 24, boxShadow: `0 6px 0 ${C.ink}`, fontFamily: ROUND, fontWeight: 800, fontSize: size, lineHeight: 1, color, letterSpacing: -1,
    fontFeatureSettings: "'lnum' 1", whiteSpace: "nowrap", transform: `scale(${t}) rotate(${rot}deg)`}}>{text}</div>;

// Chunky cartoon arrow (the pilot's red arrow), pointing down or up, with a small shine.
export const DirArrow: React.FC<{dir: "up" | "down"; size: number; color: string; wob?: number}> = ({dir, size, color, wob = 0}) =>
  <svg width={size * 0.98} height={size} viewBox="-56 -14 202 198" style={{overflow: "visible", transform: `rotate(${wob}deg)`, display: "block"}}>
    <g transform={dir === "up" ? "rotate(180 45 85)" : undefined}>
      <path d="M 0 0 L 90 0 L 90 90 L 130 90 L 45 170 L -40 90 L 0 90 Z" fill={color} stroke={C.ink} strokeWidth={10} strokeLinejoin="round"/>
      <rect x={14} y={16} width={15} height={62} rx={7} fill="#FFFFFF" opacity={0.4}/>
    </g>
  </svg>;

// Sky background with a few soft shapes (so the margin around the card is never flat).
export const Sky: React.FC<{f: number}> = ({f}) => <AbsoluteFill style={{background: C.sky}}>
  <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
    <circle cx={120 + Math.sin(f / 80) * 16} cy={960} r={230} fill={C.white} opacity={0.4}/>
    <circle cx={1840} cy={150} r={250} fill={C.white} opacity={0.32}/>
    <circle cx={1010 + Math.cos(f / 100) * 20} cy={1060} r={150} fill={C.white} opacity={0.3}/>
    <circle cx={60} cy={110} r={90} fill={C.white} opacity={0.35}/>
  </svg>
</AbsoluteFill>;

export const camScale = (f: number, dur: number, amt = 0.02) => 1 + amt * Math.min(1, f / Math.max(1, dur));
