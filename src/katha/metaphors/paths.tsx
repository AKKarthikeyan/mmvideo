// Katha metaphor scenes: paths (22 Oct 2026). The two roads at dusk, one climbing between lamps to the light, one sinking
// into cold mist through three weathered gateways (16.1-24, 16.21); the three gunas as three lamps on three different
// posts over dark water (14; "released" 14.20, "faith" 17); the ashvattha, the eternal tree with roots above and branches
// below (15.1-3; "cut"); the wheel of sacrifice set turning: sacrifice, rain, grain, food (3.14-16).
// Lamplight: near-black silhouettes, a thin warm rim on the side facing the light, light the only colour. Every glow, haze
// and smoke is a radial or linear gradient (no blur or turbulence filters: long software renders dropped tiles under them).
// 22 Oct 2026, art director's fix round 1: the shared kit everywhere (peepal and the flora, the torana from arch.tsx, the
// one flame model and the diya from fire.tsx, LightFlash for changes of state, Label for words in the overlay); one light
// per shot; no solid object fades to a ghost (the cut tree breaks apart and falls behind the land); every beat lands on an
// image; a seeker at the fork of the two roads stands a fifth of the frame tall.
// Props: s.mood (optional), s.variant (optional), s.labels (optional words, shown only through Label, never hard-coded),
// s.light (two-roads only: a word for the light on the crest).
import React, {useId} from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {K, W, H, CAPS, SoftGlow} from "../look";
import {SceneP, Frame, push, Label} from "../stage";
import {Sky, Dust, Mood, LightFlash, mistCover} from "../sky";
import {smooth, ribbon, band, rnd, lerp, clamp01, nrmAt, sampleCubics, crPoints, cumLen, atLen, wob, polyD, Pt} from "../geom";
import {Rimmed, Bird, Item} from "../sil";
import {arjuna} from "../figures";
import {peepal, khejri, palmyra, SIL_BACK} from "../flora";
import {cuspedArch, temple, shrine, ledge, RELIEF, RELIEF_LT} from "../arch";
import {Flame, Diya, diyaWick} from "../fire";

type V2 = [number, number];
// ---------- small helpers ----------
const ease = (f: number, a: number, d: number) => interpolate(f, [a, a + Math.max(0.001, d)], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
const sstep = (v: number) => { const t = clamp01(v); return t * t * (3 - 2 * t); };
const bump = (v: number, c: number, w: number) => Math.exp(-Math.pow((v - c) / w, 2));
const useUid = () => "pa" + useId().replace(/[^a-zA-Z0-9]/g, "");
const MOODS: Mood[] = ["dusk", "dawn", "night", "gold"];
const moodOf = (s: any, d: Mood): Mood => (MOODS.includes(s?.mood) ? s.mood : d);
const labelsOf = (s: any): any[] => (Array.isArray(s?.labels) ? s.labels : []);
// A label word as Label's {sa, en}: an object passes through; a string goes to sa if it has Devanagari, else to en.
const words = (v: any): {sa?: string; en?: string} => {
  if (v && typeof v === "object") return {sa: v.sa ? String(v.sa) : undefined, en: v.en ? String(v.en) : undefined};
  const t = v == null ? "" : String(v);
  return /[ऀ-ॿ]/.test(t) ? {sa: t} : {en: t};
};
const n1 = (v: number) => v.toFixed(1);
const ridge = (pts: Pt[], yb = H + 80): string => `${smooth(pts, false)} L ${pts[pts.length - 1][0]} ${yb} L ${pts[0][0]} ${yb} Z`;
const circ = (x: number, y: number, r: number) => `M ${n1(x - r)} ${n1(y)} a ${n1(r)} ${n1(r)} 0 1 0 ${n1(2 * r)} 0 a ${n1(r)} ${n1(r)} 0 1 0 ${n1(-2 * r)} 0 Z`;
const hex = (c: string): number[] => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => { const A = hex(a), B = hex(b), u = clamp01(t); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, "0")).join(""); };
const polar = (cx: number, cy: number, r: number, degFromTop: number): V2 => { const a = (degFromTop * Math.PI) / 180; return [cx + Math.sin(a) * r, cy - Math.cos(a) * r]; };
const C = (x: number, y: number): Pt => [x, y, "c"];
// a symmetric outline about cx from its right half (x offsets, absolute y; bottom to top), wound clockwise
const symD = (cx: number, half: Pt[]): string => {
  const R = half.map((p) => [cx + p[0], p[1], p[2]] as Pt), L = half.slice().reverse().map((p) => [cx - p[0], p[1], p[2]] as Pt);
  return smooth([...R, ...L].map((p) => (p[2] ? p : [p[0], p[1]]) as Pt), {wind: "cw"});
};
// the height of a polyline's y at x (piecewise linear)
const yAt = (P: number[][], x: number) => { for (let i = 0; i < P.length - 1; i++) { const a = P[i], b = P[i + 1]; if ((x >= a[0] && x <= b[0]) || (x <= a[0] && x >= b[0])) return lerp(a[1], b[1], (x - a[0]) / ((b[0] - a[0]) || 1)); } return x < P[0][0] ? P[0][1] : P[P.length - 1][1]; };
const idxAt = (cum: number[], s: number) => { let i = 0; while (i < cum.length - 2 && cum[i + 1] < s) i++; return i; };
// screen position of a scene point under Frame's push about (cx, cy)
const onScreen = (x: number, y: number, z: number, cx: number, cy: number): V2 => [cx + (x - cx) * z, cy + (y - cy) * z];
// a thin jagged crack from (x0, y0) running along angle a for length L: a closed sliver (wound as asked)
const crackD = (x0: number, y0: number, a: number, L: number, wd: number, seed: number, wind: "cw" | "ccw" = "ccw"): string => {
  const n = 6, Lp: number[][] = [], Rp: number[][] = [];
  let x = x0, y = y0;
  for (let i = 0; i <= n; i++) {
    const u = i / n, aa = a + (rnd(i, seed) - 0.5) * 1.1, w = wd * (1 - u * 0.85);
    if (i) { x += Math.cos(aa) * L / n; y += Math.sin(aa) * L / n; }
    Lp.push([x - Math.sin(aa) * w, y + Math.cos(aa) * w]); Rp.push([x + Math.sin(aa) * w, y - Math.cos(aa) * w]);
  }
  return polyD([...Lp, ...Rp.reverse()], true, wind);
};

// ---------- shared soft lights (the wheel uses these; the other scenes take theirs from the kit) ----------
const PaDefs: React.FC = () => (
  <defs>
    <radialGradient id="pa-warm"><stop offset="0" stopColor="#FFEFC4" stopOpacity={0.8}/><stop offset="0.18" stopColor="#FFC877" stopOpacity={0.42}/><stop offset="0.48" stopColor="#F0904A" stopOpacity={0.13}/><stop offset="1" stopColor="#C2553A" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-soft"><stop offset="0" stopColor="#FFC877" stopOpacity={0.5}/><stop offset="0.5" stopColor="#E8904A" stopOpacity={0.18}/><stop offset="1" stopColor="#C2553A" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-pool"><stop offset="0" stopColor="#F5A85A" stopOpacity={0.6}/><stop offset="0.4" stopColor="#D0703A" stopOpacity={0.24}/><stop offset="1" stopColor="#8E3D52" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-shade"><stop offset="0" stopColor="#030108" stopOpacity={0.85}/><stop offset="0.55" stopColor="#030108" stopOpacity={0.4}/><stop offset="1" stopColor="#030108" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-mist"><stop offset="0" stopColor="#5A4878" stopOpacity={0.45}/><stop offset="0.6" stopColor="#3A2C58" stopOpacity={0.18}/><stop offset="1" stopColor="#3A2C58" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-cold"><stop offset="0" stopColor="#8C90B4" stopOpacity={0.62}/><stop offset="0.45" stopColor="#6A6C96" stopOpacity={0.36}/><stop offset="0.8" stopColor="#4C4C78" stopOpacity={0.1}/><stop offset="1" stopColor="#4C4C78" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-smoke-d"><stop offset="0" stopColor="#06050B" stopOpacity={0.96}/><stop offset="0.5" stopColor="#07060D" stopOpacity={0.8}/><stop offset="0.8" stopColor="#0A0812" stopOpacity={0.3}/><stop offset="1" stopColor="#0A0812" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-smoke-t"><stop offset="0" stopColor="#1A1424" stopOpacity={0.9}/><stop offset="0.55" stopColor="#120E1C" stopOpacity={0.6}/><stop offset="1" stopColor="#120E1C" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-smoke-r"><stop offset="0" stopColor="#B8624A" stopOpacity={0.5}/><stop offset="0.5" stopColor="#8A4044" stopOpacity={0.24}/><stop offset="1" stopColor="#5A2A3A" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-clear"><stop offset="0" stopColor="#FFFFFF" stopOpacity={0.95}/><stop offset="0.08" stopColor="#FFF6DE" stopOpacity={0.7}/><stop offset="0.3" stopColor="#FFE2A8" stopOpacity={0.25}/><stop offset="1" stopColor="#F2C47A" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-spark"><stop offset="0" stopColor="#FFF6DC" stopOpacity={1}/><stop offset="0.35" stopColor="#FFD58A" stopOpacity={0.55}/><stop offset="1" stopColor="#F0A04B" stopOpacity={0}/></radialGradient>
  </defs>
);
// The outline of a flame for the wheel's small line emblem (a drawn emblem, not a light in the world).
const flameD = (x: number, y: number, h: number, w: number, lean = 0, sway = 0, t = 0): string => {
  const N = 12, L: Pt[] = [], R: Pt[] = [];
  let tip: Pt = [x, y - h, "c"];
  for (let i = 1; i <= N; i++) {
    const u = i / N;
    const hw = u < 0.24 ? w * Math.sqrt(Math.max(0, 1 - Math.pow((0.24 - u) / 0.24, 2))) : w * Math.pow((1 - u) / 0.76, 1.15);
    const cx = x + lean * h * u * u + sway * h * Math.pow(u, 1.6) * Math.sin(t - u * 3.2), cy = y - h * u;
    if (i === N) { tip = [cx, cy, "c"]; continue; }
    L.push([cx - hw, cy]); R.push([cx + hw, cy]);
  }
  return smooth([[x, y + w * 0.08], ...R, tip, ...L.reverse()] as Pt[]);
};
// Grass blades along a base line as one path (dark foreground, out of the light).
const grassD = (x0: number, x1: number, yb: number, count: number, h0: number, h1: number, seed: number, f: number): string => {
  let d = "";
  for (let i = 0; i < count; i++) {
    const x = x0 + rnd(i, seed) * (x1 - x0), h = h0 + rnd(i, seed + 1) * (h1 - h0);
    const lean = (rnd(i, seed + 2) - 0.5) * 0.9 + Math.sin(f / 40 + i * 0.7) * 0.05;
    const pts = sampleCubics([[x, yb + 8], [x + lean * h * 0.1, yb - h * 0.4], [x + lean * h * 0.5, yb - h * 0.8], [x + lean * h, yb - h]], 6);
    d += ribbon(pts, 4 + rnd(i, seed + 4) * 4, 0.6, 1, "cw") + " ";
  }
  return d;
};
// Sparks flung up from a restless flame (light, so they may fade).
const Sparks: React.FC<{x: number; y: number; f: number; b: number; n?: number}> = ({x, y, f, b, n = 16}) => (
  <g>{Array.from({length: n}, (_, k) => {
    const P = 34 + (k % 5) * 6, a = ((f + k * 7.3) % P) / P, vx = (rnd(k, 81) - 0.5) * 70, sx = x + vx * a + Math.sin(f / 5 + k) * 6 * a, sy = y - a * (90 + rnd(k, 82) * 90);
    return <circle key={k} cx={sx} cy={sy} r={1 + rnd(k, 83) * 1.6} fill="#FFC27A" opacity={b * (1 - a) * 0.9}/>;
  })}</g>
);

// =====================================================================================================================
// TWO ROADS (16; 5.2): a fork at dusk, and a seeker standing at it. The left road climbs the hill between small diyas to the
// light on its crest, by a peepal; the right road runs down the falling ground into a cold mist, through three weathered
// stone toranas, one behind and below another (16.21: desire, anger, greed), each deeper in the mist.
// s.labels: up to three words, one for each gate, each written in by Label on cue at its lintel; s.light: a word over the
// light. Without them no word is shown.
// =====================================================================================================================
const TR_SUN: V2 = [612, 534];
const TR_LAND: Pt[] = [[-60, 746], [80, 718], [220, 668], [360, 616], [470, 582], [550, 564], [612, 559], [680, 568], [760, 602], [840, 650], [920, 694], [1000, 720], [1080, 746], [1170, 776], [1270, 808], [1390, 840], [1530, 868], [1700, 890], [1990, 904]];
const TR_LEFT = crPoints([[930, 870], [864, 846], [796, 816], [750, 780], [740, 742], [714, 702], [680, 664], [650, 628], [629, 596], [618, 574], [612, 563]], 6);
const TR_RIGHT = crPoints([[930, 870], [1040, 874], [1160, 886], [1280, 902], [1400, 918], [1520, 932], [1640, 944], [1760, 954], [1880, 962], [2010, 968]], 6);
const TR_TRUNK = sampleCubics([[680, 1170], [760, 1040], [880, 950], [930, 870]], 14);
const TR_LW: [number, number, number] = [150, 6, 0.62], TR_RW: [number, number, number] = [150, 42, 0.8];
// the three gates: x on the low road, height, width, tilt (deg), rim colour (each colder, deeper in the mist)
const TR_GATES: [number, number, number, number, string][] = [[1150, 296, 226, 0, "#D8955E"], [1432, 204, 156, -2.2, "#9E7470"], [1694, 138, 108, 3.5, "#74647E"]];
// A weathered torana from the kit's cusped arch: chips knocked out of the lintel, a finial lost and its corner broken,
// cracks through the stone (light shows through them), uneven courses, a carved panel on the lintel, fallen blocks.
const torana = (x: number, y: number, w: number, h: number, seed: number): Item[] => {
  const p = cuspedArch({x, y, w, h, lobes: 7});
  const body0 = typeof p[0] === "string" ? p[0] : p[0].d, rel = typeof p[1] === "string" ? p[1] : p[1].d;
  const ph = h * 0.82, top = y - h, pw = w * 0.13;
  const cut: string[] = [], add: string[] = [], rl: string[] = [];
  const lost = rnd(1, seed) < 0.5 ? -1 : 1, ex = x + lost * (w / 2 + w * 0.02);
  // the end finial is lost: drop its subpath (a finial starts on the crest band at the end of the lintel)
  const body = body0.split(/(?=M )/).filter((sp) => { const m = sp.match(/^M (-?[\d.]+) (-?[\d.]+)/); if (!m) return true; const sx = +m[1], sy = +m[2]; return !(Math.abs(sy - top) < 1.5 && Math.abs(sx - (x + lost * w / 2)) < h * 0.05); }).join("");
  // chips out of the top of the lintel, between the finials (ccw: they cut the stone)
  for (let j = 0; j < 6; j++) {
    if (rnd(j, seed) < 0.35) continue;
    const cx = x - w / 2 + (w * (j + 0.5)) / 6 + (rnd(j, seed + 1) - 0.5) * w * 0.05, cw = w * (0.015 + 0.025 * rnd(j, seed + 2)), cd = h * (0.008 + 0.018 * rnd(j, seed + 3));
    cut.push(polyD([[cx - cw, top - 0.3], [cx + cw, top - 0.3], [cx + cw * 0.3, top + cd], [cx - cw * 0.6, top + cd * 0.6]], true, "ccw"));
  }
  // the corner of the crest band broken off where the finial stood
  cut.push(polyD([[ex + lost * 0.4, top - 0.4], [ex - lost * w * 0.07, top - 0.4], [ex - lost * w * 0.05, top + h * 0.012], [ex - lost * w * 0.02, top + h * 0.022], [ex + lost * 0.4, top + h * 0.03]], true, "ccw"));
  add.push(polyD([[x + lost * (w / 2 - w * 0.075), top + 0.2], [x + lost * (w / 2 - w * 0.06), top - h * 0.018], [x + lost * (w / 2 - w * 0.048), top - h * 0.01], [x + lost * (w / 2 - w * 0.04), top + 0.2]], true, "cw"));
  // cracks through the lintel and down a pillar shaft (thin holes)
  cut.push(crackD(x + (rnd(2, seed) - 0.5) * w * 0.5, top + h * 0.06, Math.PI / 2 + 0.3, h * 0.07, Math.max(0.7, h * 0.004), seed + 5));
  const ps = rnd(3, seed) < 0.5 ? -1 : 1, px = x + ps * (w / 2 - pw * 0.8);
  cut.push(crackD(px + pw * 0.08, y - ph * 0.4, Math.PI / 2 + 0.15, ph * 0.22, Math.max(0.6, h * 0.0035), seed + 7));
  // uneven courses on the lintel (vertical joints) and the pillar shafts (bed joints at irregular heights)
  for (let j = 0; j < 5; j++) { const jx = x - w / 2 + w * (0.12 + 0.19 * j + 0.06 * rnd(j, seed + 9)); rl.push(polyD([[jx - 0.5, y - h * 0.92], [jx + 0.5, y - h * 0.92], [jx + 0.9, y - ph], [jx - 0.1, y - ph]], true, "cw")); }
  for (const sd of [-1, 1]) {
    const cx = x + sd * (w / 2 - pw * 0.8);
    for (let j = 0; j < 4; j++) { const jy = y - ph * (0.18 + 0.065 * j + 0.03 * rnd(j, seed + sd + 11)), tl = (rnd(j, seed + 13) - 0.5) * 1.6; rl.push(polyD([[cx - pw * 0.48, jy - 0.5 + tl], [cx + pw * 0.48, jy - 0.5 - tl], [cx + pw * 0.48, jy + 0.6 - tl], [cx - pw * 0.48, jy + 0.6 + tl]], true, "cw")); }
  }
  // the carved panel on the lintel's face, where a name could be cut; weathered blocks fallen at one foot
  const panel = polyD([[x - w * 0.27, y - h * 0.905], [x + w * 0.27, y - h * 0.905], [x + w * 0.27, y - h * 0.84], [x - w * 0.27, y - h * 0.84]], true, "cw");
  const bx = x - ps * (w / 2 + w * 0.02);
  add.push(polyD([[bx - w * 0.05, y + 1], [bx - w * 0.045, y - h * 0.035], [bx + w * 0.02, y - h * 0.04], [bx + w * 0.035, y + 1]], true, "cw"));
  add.push(polyD([[bx + w * 0.04, y + 1], [bx + w * 0.05, y - h * 0.02], [bx + w * 0.085, y - h * 0.018], [bx + w * 0.09, y + 1]], true, "cw"));
  return [{d: [body, ...add, ...cut].join(" ")}, {d: [rel, ...rl].join(" "), fill: RELIEF, rim: false}, {d: panel, fill: "#1E1224", rim: false}];
};
// Fine grass along the crest of the hill, dark against the light behind it.
const crestGrass = (x0: number, x1: number, count: number, f: number): string => {
  let d = "";
  for (let i = 0; i < count; i++) {
    const x = x0 + rnd(i, 201) * (x1 - x0), yb = yAt(TR_LAND as number[][], x) + 3, h = 6 + rnd(i, 202) * 16 * (1 - Math.abs(x - 610) / 700), lean = (rnd(i, 203) - 0.5) * 0.8 + Math.sin(f / 35 + i * 0.4) * 0.08;
    d += ribbon(sampleCubics([[x, yb], [x + lean * h * 0.2, yb - h * 0.45], [x + lean * h * 0.6, yb - h * 0.85], [x + lean * h, yb - h]], 4), 2.2, 0.4, 1, "cw") + " ";
  }
  return d;
};
const TwoRoads: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const mood = moodOf(s, "dusk"), S = TR_SUN;
  const labels = labelsOf(s), light = s?.light;
  const z = push(f, n, 1, 1.05), CX = 900, CY = 760;
  // the diyas on both sides of the climbing road; a wave of brightness walks up it towards the light
  const lc = cumLen(TR_LEFT), lL = lc[lc.length - 1], NL = 12, N = TR_LEFT.length;
  const lamps: {x: number; y: number; s: number; lit: number; k: number; flip: boolean}[] = [];
  for (let k = 0; k < NL; k++) {
    const t = 0.1 + 0.9 * Math.pow((k + 0.5) / NL, 1.12), i = idxAt(lc, t * lL), [nx, ny] = nrmAt(TR_LEFT, i);
    const w = (TR_LW[0] + (TR_LW[1] - TR_LW[0]) * Math.pow(i / (N - 1), TR_LW[2])) / 2, sc = lerp(0.46, 0.085, Math.pow(t, 0.8));
    const lit = clamp01(0.8 + 0.2 * Math.sin(t * 9 - f / 11));
    [-1, 1].forEach((side) => lamps.push({x: TR_LEFT[i][0] + nx * side * (w + 12 * sc), y: TR_LEFT[i][1] + ny * side * (w + 12 * sc) + 2 * sc, s: sc, lit, k: k * 2 + (side > 0 ? 1 : 0), flip: side < 0}));
  }
  lamps.sort((a, b) => a.y - b.y);
  const roadY = (x: number) => yAt(TR_RIGHT, x);
  const gates = TR_GATES.map(([x, h, w, tilt, rim], i) => ({x, y: roadY(x) + 2, h, w, tilt, rim, i}));
  // the seeker at the fork, turned towards the light
  const FX = 896, FY = 892, FS = 0.56;
  const grass = grassD(-40, 430, 1080, 60, 40, 120, 3, f) + grassD(1560, 1960, 1080, 56, 40, 120, 9, f);
  const mistRight = (y0: number, y1: number, x0 = 900) => <rect x={x0} y={y0} width={W + 40 - x0} height={y1 - y0} fill={x0 > 1000 ? "url(#tr-coldband2)" : "url(#tr-coldband)"}/>;
  return (
    <Frame f={f} zoom={z} cx={CX} cy={CY} overlay={<>
      {light ? (() => { const [lx, ly] = onScreen(S[0], S[1] - 110, z, CX, CY); return <Label {...words(light)} f={f} at={Math.round(n * 0.12)} x={lx} y={ly} anchor="middle" size={34}/>; })() : null}
      {gates.map((g) => labels[g.i] ? (() => { const [lx, ly] = onScreen(g.x, g.y - g.h * 1.08, z, CX, CY); return <Label key={g.i} {...words(labels[g.i])} f={f} at={Math.round(n * (0.3 + 0.16 * g.i))} x={lx} y={ly} anchor="middle" size={Math.round(34 - g.i * 4)}/>; })() : null)}
    </>}>
      <PaDefs/>
      <defs>
        <linearGradient id="tr-dark" x1="0" y1="0" x2="1" y2="0"><stop offset="0.5" stopColor="#07040E" stopOpacity={0}/><stop offset="0.85" stopColor="#07040E" stopOpacity={0.3}/><stop offset="1" stopColor="#07040E" stopOpacity={0.45}/></linearGradient>
        <linearGradient id="tr-land" gradientUnits="userSpaceOnUse" x1="0" y1="560" x2="0" y2="1080"><stop offset="0" stopColor="#2E1A36"/><stop offset="0.3" stopColor="#1C1024"/><stop offset="1" stopColor="#0C0712"/></linearGradient>
        <radialGradient id="tr-rim" gradientUnits="userSpaceOnUse" cx={S[0]} cy={S[1]} r={430}><stop offset="0" stopColor="#FFE6A8" stopOpacity={1}/><stop offset="0.5" stopColor="#FFC877" stopOpacity={0.5}/><stop offset="1" stopColor="#FFC877" stopOpacity={0}/></radialGradient>
        <linearGradient id="tr-road" gradientUnits="userSpaceOnUse" x1="0" y1="1080" x2="0" y2="800"><stop offset="0" stopColor="#1A1018"/><stop offset="0.5" stopColor="#2C1C2A"/><stop offset="1" stopColor="#3E2A3C"/></linearGradient>
        <linearGradient id="tr-rl" gradientUnits="userSpaceOnUse" x1="930" y1="870" x2="612" y2="563"><stop offset="0" stopColor="#E8A868" stopOpacity={0}/><stop offset="0.12" stopColor="#E8A868" stopOpacity={0.2}/><stop offset="0.4" stopColor="#E0A064" stopOpacity={0.42}/><stop offset="1" stopColor="#FFD890" stopOpacity={0.95}/></linearGradient>
        {/* the low road: a cool dusty surface with paler verges, going grey and cold as it sinks */}
        <linearGradient id="tr-rc" gradientUnits="userSpaceOnUse" x1="930" y1="870" x2="1990" y2="968"><stop offset="0" stopColor="#3C3850" stopOpacity={0}/><stop offset="0.14" stopColor="#3C3850" stopOpacity={0.6}/><stop offset="0.45" stopColor="#424460"/><stop offset="0.8" stopColor="#4E5270"/><stop offset="1" stopColor="#5A5E7E"/></linearGradient>
        <linearGradient id="tr-rv" gradientUnits="userSpaceOnUse" x1="930" y1="870" x2="1990" y2="968"><stop offset="0" stopColor="#62627E" stopOpacity={0}/><stop offset="0.16" stopColor="#62627E" stopOpacity={0.8}/><stop offset="0.5" stopColor="#6A6C88"/><stop offset="1" stopColor="#8288A8"/></linearGradient>
        <linearGradient id="tr-rut" gradientUnits="userSpaceOnUse" x1="1000" y1="0" x2="1990" y2="0"><stop offset="0" stopColor="#1E1626" stopOpacity={0}/><stop offset="0.2" stopColor="#1E1626" stopOpacity={0.7}/><stop offset="1" stopColor="#2A2638" stopOpacity={0.4}/></linearGradient>
        <linearGradient id="tr-coldband" gradientUnits="userSpaceOnUse" x1="900" y1="0" x2="1920" y2="0"><stop offset="0" stopColor="#6A6C94" stopOpacity={0}/><stop offset="0.3" stopColor="#6A6C94" stopOpacity={0.28}/><stop offset="0.7" stopColor="#7A7EA4" stopOpacity={0.62}/><stop offset="1" stopColor="#8288AC" stopOpacity={0.8}/></linearGradient>
        <linearGradient id="tr-coldband2" gradientUnits="userSpaceOnUse" x1="1150" y1="0" x2="1920" y2="0"><stop offset="0" stopColor="#6A6C94" stopOpacity={0}/><stop offset="0.4" stopColor="#6A6C94" stopOpacity={0.35}/><stop offset="1" stopColor="#8288AC" stopOpacity={0.85}/></linearGradient>
        <linearGradient id="tr-vfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity={0}/><stop offset="0.35" stopColor="#fff" stopOpacity={1}/><stop offset="0.7" stopColor="#fff" stopOpacity={1}/><stop offset="1" stopColor="#fff" stopOpacity={0}/></linearGradient>
        <mask id="tr-mband" maskContentUnits="objectBoundingBox"><rect x={0} y={0} width={1} height={1} fill="url(#tr-vfade)"/></mask>
      </defs>
      <Sky mood={mood} sun={S} sunR={42} f={f} rays={0.45} id="tr" horizon={724}/>
      {/* the right half of the sky lies under heavier cloud */}
      <rect x={-40} y={-40} width={W + 80} height={760} fill="url(#tr-dark)"/>
      {Array.from({length: 6}, (_, i) => <ellipse key={i} cx={1240 + i * 130 + Math.sin(f / 90 + i) * 12} cy={210 + rnd(i, 41) * 240} rx={240 + rnd(i, 42) * 150} ry={50 + rnd(i, 43) * 36} fill="url(#pa-smoke-t)" opacity={0.32}/>)}
      {/* far hills under the horizon band on the right; the cold mist lying in the hollow below them */}
      <path d={ridge([[860, 716], [980, 702], [1100, 708], [1240, 696], [1380, 706], [1520, 692], [1660, 702], [1800, 694], [1990, 700]])} fill="#2C2040" opacity={0.92}/>
      <g mask="url(#tr-mband)">{mistRight(722, 980)}</g>
      {[[1230, 760, 420, 70], [1560, 800, 520, 110], [1840, 840, 420, 130], [1420, 870, 560, 90]].map(([x, y, rx, ry], i) => <ellipse key={i} cx={x + Math.sin(f / 70 + i) * 14} cy={y} rx={rx} ry={ry} fill="url(#pa-cold)" opacity={0.75}/>)}
      {/* the land: the hill with the crest, the near ground falling away to the right */}
      <path d={ridge(TR_LAND)} fill="url(#tr-land)"/>
      <path d={smooth(TR_LAND.slice(1, 12), false)} fill="none" stroke="url(#tr-rim)" strokeWidth={2.4}/>
      <path d={crestGrass(330, 900, 150, f)} fill="#1A0E20"/>
      <Rimmed paths={peepal({x: 296, y: yAt(TR_LAND as number[][], 296) + 8, h: 330, seed: 7, t: f, wind: 0.1})} light={[S[0] - 296, S[1] - 470]} w={2.6} rim="#F2B872"/>
      {/* warm light on the slope from the lamps and the crest */}
      <SoftGlow x={720} y={720} r={430} ry={230} c0="#F5A85A" c1="#8E3D52" peak={0.32} k={1.8}/>
      {/* the roads: one dusty surface; the climb laid with warmth, the descent cold, with pale verges and ruts */}
      <path d={ribbon(TR_RIGHT, TR_RW[0] + 12, TR_RW[1] + 6, TR_RW[2], "cw")} fill="url(#tr-rv)"/>
      <path d={[ribbon(TR_TRUNK, 430, 150, 1.4, "cw"), ribbon(TR_LEFT, TR_LW[0], TR_LW[1], TR_LW[2], "cw"), ribbon(TR_RIGHT, TR_RW[0], TR_RW[1], TR_RW[2], "cw")].join(" ")} fill="url(#tr-road)"/>
      <path d={ribbon(TR_RIGHT, TR_RW[0], TR_RW[1], TR_RW[2], "cw")} fill="url(#tr-rc)"/>
      <path d={ribbon(TR_RIGHT.slice(8).map((p, i, A) => [p[0], p[1] - lerp(27, 9, Math.pow(i / (A.length - 1), 0.8))]), 3, 1, 1, "cw") + " " + ribbon(TR_RIGHT.slice(8).map((p, i, A) => [p[0], p[1] + lerp(25, 8, Math.pow(i / (A.length - 1), 0.8))]), 3.4, 1, 1, "cw")} fill="url(#tr-rut)"/>
      <path d={ribbon(TR_LEFT, TR_LW[0], TR_LW[1], TR_LW[2], "cw")} fill="url(#tr-rl)"/>
      {/* the gates, far to near; the mist thickens over each one further down */}
      {gates.slice().reverse().map((g) => {
        const L: V2 = [S[0] - g.x, S[1] - (g.y - g.h * 0.6)];
        return <g key={g.i}>
          <ellipse cx={g.x + g.w * 0.25} cy={g.y + 3} rx={g.w * 0.7} ry={g.h * 0.045} fill="url(#pa-shade)" opacity={0.7}/>
          <Rimmed paths={torana(g.x, g.y, g.w, g.h, 31 + g.i * 17)} transform={g.tilt ? `rotate(${g.tilt} ${g.x} ${g.y})` : undefined} light={L} w={[2.3, 1.9, 1.6][g.i]} rim={g.rim} fill={["#150B17", "#181020", "#1C1628"][g.i]}/>
          {g.i > 0 ? <g opacity={[0, 0.85, 1][g.i]}>
            <SoftGlow x={g.x + 20} y={g.y - g.h * 0.12} r={g.w * 1.5} ry={g.h * 0.42} c0="#8E92B6" c1="#5A5C86" peak={[0, 0.42, 0.58][g.i]} k={1.4}/>
            <ellipse cx={g.x + Math.sin(f / 60 + g.i) * 16} cy={g.y - 4} rx={g.w * 1.6} ry={g.h * 0.2} fill="url(#pa-cold)" opacity={0.9}/>
          </g> : null}
        </g>;
      })}
      {/* low cold mist creeping over the descent, thickest where the road vanishes */}
      <g mask="url(#tr-mband)">{mistRight(880, 1010, 1150)}</g>
      {Array.from({length: 5}, (_, i) => { const x = 1380 + i * 160 + ((f * (0.3 + 0.1 * i)) % 120) - 60; return <ellipse key={i} cx={x} cy={930 + rnd(i, 51) * 40} rx={260 + rnd(i, 52) * 120} ry={34 + rnd(i, 53) * 16} fill="url(#pa-cold)" opacity={0.25 + 0.14 * i}/>; })}
      {/* lamps along the climb */}
      {lamps.map((l) => <g key={l.k}>
        <ellipse cx={l.x} cy={l.y} rx={120 * l.s} ry={30 * l.s} fill="url(#pa-pool)" opacity={0.75 * l.lit}/>
        <Diya x={l.x} y={l.y} s={l.s} f={f} seed={l.k} lit={l.lit} calm={0.9} flip={l.flip} shadow={0.6}/>
      </g>)}
      {/* the seeker at the fork: his long shadow falls towards us; he faces the climb */}
      <ellipse cx={FX + 90} cy={FY + 10} rx={130} ry={12} fill="url(#pa-shade)" opacity={0.7} transform={`rotate(14 ${FX} ${FY})`}/>
      <Rimmed paths={arjuna("listen", 0.15, f)} transform={`translate(${FX} ${FY}) scale(${-FS} ${FS})`} light={[-(S[0] - FX), S[1] - (FY - 140)]} w={2.6 / FS} rim="#FFD38A" fill="#120A18"/>
      {/* a few birds flying home towards the light */}
      {[0, 1, 2].map((i) => <Bird key={i} kind="stork" x={1300 + i * 70 - f * 0.9 + (i === 1 ? 40 : 0)} y={300 + i * 26 + Math.sin(f / 40 + i) * 6} scale={0.22 - i * 0.02} f={f} speed={0.8 + i * 0.07} phase={i * 0.3} light={[S[0] - 1100, S[1] - 340]} fill="#24162E" flip/>)}
      <Dust f={f} sun={S} n={110} y0={380} y1={980}/>
      {/* dark foreground: mounds and grass at the corners */}
      <path d={`M -40 1010 C 120 978 300 990 440 1040 L 440 1120 L -40 1120 Z M 1560 1050 C 1700 1000 1830 990 1960 1004 L 1960 1120 L 1560 1120 Z`} fill="#07040A"/>
      <path d={grass} fill="#07040A"/>
    </Frame>
  );
};

// =====================================================================================================================
// GUNAS (14): three lamps on three different stone posts standing in dark water at night, staggered in depth. Sattva: a
// slender shaft opening into a lotus, a clear, steady flame. Rajas: an ornate, angular post with horned brackets, a
// restless flame throwing sparks. Tamas: a squat, cracked post, sunk and leaning, its wick a dull red ember under heavy
// dark smoke that blots out the stars. Each has its turn: sattva and rajas brighten; in tamas's the dark spreads.
// variant "released" (14.20): the three flames lift from their lamps along curving paths, keeping their shape, and meet
// in a flash; one clear star stands over the horizon behind the posts, rims them all and lays its column on the water.
// variant "faith" (17): three bowls of food on a carved stone ledge by the water, a small diya before each.
// s.labels: up to three words (one for each light), written in by Label on cue; none by default.
// =====================================================================================================================
const G_WATER = 622;
type GPost = {x: number; base: number; seat: number; tilt: number; ds: number; rim: string};
const GPOSTS: GPost[] = [
  {x: 600, base: 744, seat: 524, tilt: 0, ds: 0.6, rim: "#FFEFC8"},       // sattva: further back, slender and tall
  {x: 990, base: 850, seat: 598, tilt: 0, ds: 0.78, rim: "#FF9452"},      // rajas: nearest, ornate
  {x: 1392, base: 790, seat: 664, tilt: 6, ds: 0.7, rim: "#8A4A44"},      // tamas: squat, sunk and leaning
];
// sattva: a small stepped plinth, a slender shaft with two rings, an open lotus cup holding the lamp
const postSattva = (x: number, base: number, seat: number): Item[] => {
  const mid = lerp(base, seat, 0.5);
  const half: Pt[] = [C(30, base + 8), C(30, base - 6), C(22, base - 10), C(22, base - 18), C(12, base - 22),
    [11, mid], C(9.5, seat + 66), C(14, seat + 62), C(14, seat + 56), C(9, seat + 53), C(9, seat + 47), C(13, seat + 45), C(13, seat + 40), C(8, seat + 37),
    [12, seat + 30], [22, seat + 20], [33, seat + 8], C(42, seat - 7), [33, seat - 1], C(27, seat + 4), [25, seat - 8], C(21, seat - 16), [16, seat - 7], C(12, seat - 2), [9, seat - 10], C(5, seat - 18), [3, seat - 9], C(1.5, seat - 7)];
  const rel: string[] = [];
  for (const k of [-1, 1]) {
    rel.push(band([[x + k * 4, seat + 34], [x + k * 14, seat + 18], [x + k * 26, seat + 4], [x + k * 38, seat - 4]], 1.6, 0.5, 1));
    rel.push(band([[x + k * 2, seat + 30], [x + k * 8, seat + 10], [x + k * 19, seat - 12]], 1.4, 0.4, 1));
    rel.push(polyD([[x + k * 3 - 0.6, base - 24], [x + k * 3 + 0.6, base - 24], [x + k * 2.6 + 0.6, seat + 68], [x + k * 2.6 - 0.6, seat + 68]], true, "cw"));
  }
  return [{d: symD(x, half)}, {d: rel.join(" "), fill: RELIEF_LT, rim: false}];
};
// rajas: a stepped plinth, a faceted shaft with sharp diamond bands, a collar, a capital of horned brackets thrusting out
const postRajas = (x: number, base: number, seat: number): Item[] => {
  const mid = lerp(base, seat, 0.52);
  const half: Pt[] = [C(46, base + 8), C(46, base - 8), C(38, base - 8), C(38, base - 20), C(29, base - 20), C(29, base - 30), C(19, base - 34),
    C(19, mid + 30), C(27, mid + 23), C(19, mid + 16), C(19, mid - 6), C(27, mid - 13), C(19, mid - 20),
    C(19, seat + 96), C(26, seat + 90), C(26, seat + 82), C(18, seat + 78), C(18, seat + 66), C(25, seat + 60), C(38, seat + 52), C(58, seat + 28), C(46, seat + 34), C(34, seat + 34),
    C(34, seat + 24), C(50, seat + 14), C(66, seat - 8), C(50, seat + 2), C(38, seat + 6), C(38, seat), C(24, seat)];
  const rel: string[] = [];
  for (const k of [-1, 1]) {
    rel.push(polyD([[x + k * 7 - 0.7, base - 34], [x + k * 7 + 0.7, base - 34], [x + k * 7 + 0.7, seat + 96], [x + k * 7 - 0.7, seat + 96]], true, "cw"));
    rel.push(polyD([[x + k * 30, base - 14], [x + k * 30, base - 15.4], [x - k * 30, base - 15.4], [x - k * 30, base - 14]], true, "cw"));
    rel.push(polyD([[x + k * 12, seat + 40], [x + k * 30, seat + 26], [x + k * 31, seat + 28], [x + k * 13, seat + 42]], true, "cw"));
  }
  for (const yy of [mid + 23, mid - 13]) rel.push(polyD([[x, yy - 6], [x + 9, yy], [x, yy + 6], [x - 9, yy]], true, "cw"));
  return [{d: symD(x, half)}, {d: rel.join(" "), fill: "#2C1820", rim: false}];
};
// tamas: a squat, heavy post sunk in the water, its cap broken at one corner, cracked through
const postTamas = (x: number, base: number, seat: number): Item[] => {
  const mid = lerp(base, seat, 0.5);
  const out: Pt[] = [C(x + 48, base + 10), C(x + 48, base - 2), [x + 45, mid], C(x + 43, seat + 34),
    C(x + 52, seat + 30), C(x + 54, seat + 22), C(x + 47, seat + 18), C(x + 50, seat + 12), C(x + 41, seat + 9), C(x + 36, seat + 4), C(x + 30, seat),
    C(x - 30, seat), C(x - 38, seat + 5), C(x - 53, seat + 9), C(x - 55, seat + 18), C(x - 55, seat + 30), C(x - 44, seat + 34), [x - 46, mid], C(x - 49, base - 2), C(x - 49, base + 10)];
  const cracks = [crackD(x + 14, seat + 8, Math.PI / 2 + 0.25, (base - seat) * 0.55, 1.4, 61, "cw"), crackD(x - 20, seat + 36, Math.PI / 2 - 0.35, (base - seat) * 0.3, 1.2, 67, "cw"), crackD(x + 30, mid, Math.PI * 0.75, 26, 1.1, 71, "cw")];
  const rel = [polyD([[x - 44, seat + 34], [x + 43, seat + 34], [x + 43, seat + 36], [x - 44, seat + 36]], true, "cw"), polyD([[x - 46, mid + 8], [x + 45, mid + 6], [x + 45, mid + 7.6], [x - 46, mid + 9.6]], true, "cw")];
  return [{d: smooth(out, {wind: "cw"})}, {d: rel.join(" "), fill: "#1E1420", rim: false}, {d: cracks.join(" "), fill: "#2E1A22", rim: false}];
};
const postItems = (i: number, p: GPost) => (i === 0 ? postSattva : i === 1 ? postRajas : postTamas)(p.x, p.base, p.seat);
// the seat of the lamp on each post (the diya's foot) and its wick, in scene coordinates (tamas's post leans)
const lean = (p: GPost, x: number, y: number): V2 => { const a = (p.tilt * Math.PI) / 180, dx = x - p.x, dy = y - p.base; return [p.x + dx * Math.cos(a) - dy * Math.sin(a), p.base + dx * Math.sin(a) + dy * Math.cos(a)]; };
const wickOf = (p: GPost): V2 => { const [wx, wy] = diyaWick(p.x, p.seat + (p === GPOSTS[0] ? 2 : 0), p.ds); return lean(p, wx, wy); };
// Night water: gradient, slow ripple lines of varied lengths, the far shore, drifting mist.
const NightWater: React.FC<{f: number; mood: Mood}> = ({f, mood}) => {
  const id = useUid();
  const top = mood === "night" ? "#2A2448" : mood === "dawn" ? "#3A3C64" : "#2E1E42";
  const lines: string[] = ["", "", ""];
  for (let k = 0; k < 110; k++) {
    const v = Math.pow((k + 0.5) / 110, 1.7), y = G_WATER + 6 + v * (H - G_WATER) + (rnd(k, 64) - 0.5) * 6, L = (14 + 300 * v) * (0.2 + rnd(k, 61) * 1.1);
    const x = ((rnd(k, 62) * (W + 400) + f * (0.15 + 0.3 * rnd(k, 63))) % (W + 400)) - 200, th = 0.8 + v * 1.4 * rnd(k, 65);
    lines[k % 3] += `M ${n1(x - L / 2)} ${n1(y)} Q ${n1(x)} ${n1(y - th)} ${n1(x + L / 2)} ${n1(y)} Q ${n1(x)} ${n1(y + th * 0.4)} ${n1(x - L / 2)} ${n1(y)} Z `;
  }
  return (
    <g>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top}/><stop offset="0.12" stopColor="#161836"/><stop offset="0.5" stopColor="#0B0C20"/><stop offset="1" stopColor="#05050C"/></linearGradient>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7A6A98" stopOpacity={0}/><stop offset="0.5" stopColor="#7A6A98" stopOpacity={0.16}/><stop offset="1" stopColor="#7A6A98" stopOpacity={0}/></linearGradient>
      </defs>
      <rect x={-40} y={G_WATER} width={W + 80} height={H - G_WATER + 40} fill={`url(#${id}w)`}/>
      <path d={ridge([[-60, 614], [180, 602], [400, 608], [660, 592], [900, 604], [1160, 596], [1420, 606], [1700, 592], [1990, 604]], G_WATER + 2)} fill="#0C0B20"/>
      {lines.map((d, i) => <path key={i} d={d} fill="#9A9AD0" opacity={[0.06, 0.1, 0.15][i]}/>)}
      <rect x={-40} y={G_WATER - 46} width={W + 80} height={92} fill={`url(#${id}m)`}/>
      {Array.from({length: 6}, (_, i) => { const x = ((rnd(i, 66) * (W + 800) + f * (0.25 + 0.15 * rnd(i, 67))) % (W + 800)) - 400; return <ellipse key={i} cx={x} cy={G_WATER + 14 + rnd(i, 68) * 70} rx={260 + rnd(i, 69) * 200} ry={14 + rnd(i, 70) * 12} fill="url(#pa-mist)" opacity={0.5}/>; })}
    </g>
  );
};
// The broken column of light a flame lays on the water: glints of varied length in uneven rows, bent by slow ripples,
// flickering on and off; a soft glow under them. y0: the waterline under the light; spread: the column's half-width.
const Reflection: React.FC<{x: number; y0: number; b: number; col: string; glow?: [string, string]; rough: number; f: number; i: number; spread?: number}> = ({x, y0, b, col, glow, rough, f, i, spread = 1}) => {
  if (b <= 0.01) return null;
  const N = 46, d: string[] = ["", ""];
  for (let k = 0; k < N; k++) {
    const v = k / (N - 1), y = y0 + 4 + Math.pow(v, 1.2) * (H + 20 - y0);
    const segs = 1 + Math.floor(rnd(k, 90 + i) * 2.6);
    for (let j = 0; j < segs; j++) {
      const on = Math.sin(f / (5 + 3 * rnd(k * 3 + j, 91 + i)) + k * 1.7 + j * 2.3 + i);
      if (on < -0.35) continue;
      const ripple = rough * ((3 + 12 * v) * Math.sin(y * 0.05 - f * 0.09 + i * 1.3) + (2 + 7 * v) * Math.sin(y * 0.14 + f * 0.13 + i * 2.1) + (1 + 4 * v) * wob(f / 9 + k * 0.6, i + j));
      const off = (rnd(k * 5 + j, 92 + i) - 0.5) * (18 + 70 * v) * spread, len = (4 + 40 * Math.pow(rnd(k * 7 + j, 93 + i), 1.6)) * (0.5 + 1.1 * v) * spread * (0.6 + 0.5 * b);
      const th = 0.9 + 2.6 * v * rnd(k * 11 + j, 94 + i), cx = x + off + ripple;
      d[(k + j) % 2] += `M ${n1(cx - len)} ${n1(y)} Q ${n1(cx)} ${n1(y - th)} ${n1(cx + len)} ${n1(y)} Q ${n1(cx)} ${n1(y + th * 0.6)} ${n1(cx - len)} ${n1(y)} Z `;
    }
  }
  const env = b * (0.75 + 0.25 * Math.sin(f / 9 + i));
  return <g>
    {glow ? <SoftGlow x={x} y={y0 + (H - y0) * 0.42} r={70 * spread + 30 * b} ry={(H - y0) * 0.62} c0={glow[0]} c1={glow[1]} peak={0.5} k={1.6} o={0.9 * b}/> : null}
    <path d={d[0]} fill={col} opacity={Math.min(1, 0.75 * env)}/>
    <path d={d[1]} fill={col} opacity={Math.min(1, 0.45 * env)}/>
  </g>;
};
// Heavy smoke. "t": tamas, thick and dark, rolling up and spreading under the sky into a pall that hides the stars;
// "r": rajas, thin reddish smoke twisting fast; "s": sattva, a fine thread rising almost straight, wavering at its foot.
const Smoke: React.FC<{x: number; y: number; f: number; kind: "t" | "r" | "s"; b?: number; height?: number; spread?: number}> = ({x, y, f, kind, b = 1, height = 300, spread = 1}) => {
  const id = useUid();
  if (b <= 0.01) return null;
  if (kind === "s") {
    const thread = (ph: number, amp: number) => { const pts: number[][] = []; for (let k = 0; k <= 30; k++) { const v = k / 30; pts.push([x + Math.sin(v * 6 - f / 30 + ph) * amp * Math.pow(v, 1.3) + Math.sin(v * 13 - f / 17 + ph) * 4 * v + Math.sin(f / 11 + v * 22 + ph) * 3.2 * Math.exp(-v * 9), y - v * height]); } return pts; };
    return <g opacity={Math.min(1, b)}>
      <defs><linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={y} x2={0} y2={y - height}><stop offset="0" stopColor="#F2E6C8" stopOpacity={0.2}/><stop offset="0.2" stopColor="#F2E6C8" stopOpacity={0.5}/><stop offset="0.65" stopColor="#E8D8B8" stopOpacity={0.2}/><stop offset="1" stopColor="#E8D8B8" stopOpacity={0}/></linearGradient></defs>
      <path d={ribbon(thread(0, 26), 8, 70, 1.4)} fill={`url(#${id})`} opacity={0.28}/>
      <path d={ribbon(thread(0.8, 22), 4, 30, 1.3)} fill={`url(#${id})`} opacity={0.45}/>
      <path d={ribbon(thread(1.7, 18), 1.6, 9, 1.2)} fill={`url(#${id})`} opacity={0.8}/>
    </g>;
  }
  if (kind === "t") {
    const N = 28, P = 260;
    const col = band([[x, y + 4], [x + 2 * Math.sin(f / 13), y - 30], [x + 6 * Math.sin(f / 17), y - 70], [x + 12 * Math.sin(f / 19) + 10, y - 120]], 6, 40 * spread, 1, "round");
    return <g>
      <defs><linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={y} x2={0} y2={y - 120}><stop offset="0" stopColor="#0A0810" stopOpacity={0.5}/><stop offset="0.4" stopColor="#08060E" stopOpacity={0.85}/><stop offset="1" stopColor="#08060E" stopOpacity={0.6}/></linearGradient></defs>
      <path d={col} fill={`url(#${id})`} opacity={Math.min(1, b)}/>
      {[0, 1, 2, 3, 4].map((k) => <ellipse key={"p" + k} cx={x - 120 + k * 90 + Math.sin(f / 70 + k) * 20 + 40 * spread} cy={y - height * (0.86 + 0.08 * Math.sin(k * 2.1))} rx={(200 + 40 * (k % 3)) * spread} ry={(80 + 20 * (k % 2)) * spread} fill="url(#pa-smoke-d)" opacity={Math.min(1, 0.75 * b)}/>)}
      {Array.from({length: N}, (_, k) => {
      const a = ((f + (k * P) / N) % P) / P, rise = 1 - Math.pow(1 - a, 1.8);
      const yy = y - rise * height, xx = x + (Math.sin(a * 3.4 + k * 2.1) * 30 + (k % 2 ? 1 : -0.7) * 120 * a * a) * spread, r = (14 + 120 * Math.pow(a, 0.8)) * spread;
      const o = b * Math.min(1, a * 10) * (1 - Math.pow(a, 3));
      return <ellipse key={k} cx={xx} cy={yy} rx={r * 1.5} ry={r * 0.95} fill={k % 4 === 0 ? "url(#pa-smoke-t)" : "url(#pa-smoke-d)"} opacity={Math.min(1, o)}/>;
    })}</g>;
  }
  const N = 18, P = 120;
  return <g>{Array.from({length: N}, (_, k) => {
    const a = ((f + (k * P) / N) % P) / P, yy = y - a * height, xx = x + Math.sin(a * 7 + f / 8 + k * 0.4) * 44 * a, r = 14 + a * 60;
    return <ellipse key={k} cx={xx} cy={yy} rx={r * 1.15} ry={r} fill="url(#pa-smoke-r)" opacity={Math.min(1, 0.55 * b * Math.min(1, a * 5) * Math.pow(1 - a, 0.9))}/>;
  })}</g>;
};
// A post with its lamp: the post rim-lit (from its own flame above, or from the star once released), the diya on top.
const PostLamp: React.FC<{i: number; p: GPost; f: number; lit: number; light: V2 | null; rimK: number; rim?: string; fill?: string}> = ({i, p, f, lit, light, rimK, rim, fill = "#0E0A16"}) => {
  const items = postItems(i, p), seatY = p.seat + (i === 0 ? 2 : 0);
  const rc = mix("#1A1020", rim ?? p.rim, clamp01(rimK));
  return <g transform={p.tilt ? `rotate(${p.tilt} ${p.x} ${p.base})` : undefined}>
    {light ? <Rimmed paths={items} point={light} light={[0, -1]} w={3} rim={rc} fill={fill} glow={0.8}/> : <Rimmed paths={items} light={[0, -1]} w={2.4} rim={rc} fill={fill}/>}
    <Diya x={p.x} y={seatY} s={p.ds} f={f} seed={i * 3} lit={lit} flame={false} shadow={0}/>
  </g>;
};
// The light of each guna on its lamp. b: brightness; bb: how much it is in its turn (0..1).
const GunaLight: React.FC<{i: number; at: V2; f: number; b: number; bb: number; k?: number}> = ({i, at, f, b, bb, k = 1}) => {
  const [x, y] = at;
  if (i === 0) return <Flame x={x} y={y} h={60 * k * (1 + 0.12 * bb)} f={f} seed={2} calm={1} b={b} halo={1}/>;
  if (i === 1) {
    const h = (56 + 9 * bb + 6 * wob(f / 2.3, 1)) * k;
    return <g><Flame x={x} y={y} h={h} f={f} seed={5} calm={0} wind={0.55 * wob(f / 13, 2)} b={b} halo={0.6} licks={4}/><Sparks x={x} y={y - h * 0.8} f={f} b={b * (0.6 + 0.4 * bb)}/></g>;
  }
  // tamas: the flame all but out; the wick a dull red ember that swells in its turn
  const gutter = clamp01(0.5 + 0.5 * wob(f / 17, 9));
  return <g>
    <SoftGlow x={x} y={y - 4} r={(70 + 40 * bb) * k} ry={(56 + 30 * bb) * k} c0="#C8482A" c1="#3A1020" peak={0.7} k={2.4} o={0.6 + 0.4 * bb}/>
    <SoftGlow x={x} y={y} r={14 * k} c0="#FF8050" c1="#B02A18" peak={0.95} k={2} o={0.75 + 0.25 * bb}/>
    <circle cx={x} cy={y} r={3.2 * k} fill="#F07040" opacity={0.75 + 0.25 * bb}/>
    <Flame x={x} y={y} h={11 + 3 * gutter} f={f} seed={8} calm={0.35} b={b * (0.14 + 0.16 * gutter)} halo={0} blue={0.3}/>
  </g>;
};
const GunasScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const variant = String(s?.variant || "");
  if (variant === "faith") return <FaithScene s={s} n={n}/>;
  const mood = moodOf(s, "night"), u = f / Math.max(1, n), labels = labelsOf(s);
  const released = variant === "released";
  const z = push(f, n, 1, 1.05), CX = 960, CY = 600;
  const turn = [0, 1, 2].map((i) => bump(u, released ? 0.05 + i * 0.05 : 0.17 + i * 0.33, released ? 0.07 : 0.15));
  // released: each flame lifts along a curving path to one point over the horizon, where they meet in a flash
  const M: V2 = [960, 446];
  const lift = [0, 1, 2].map((i) => (released ? sstep((u - 0.17 - i * 0.035) / 0.37) : 0));
  const flashP = released ? (u - 0.5) / 0.22 : -1, cover = released ? mistCover(flashP) : 0;
  const after = released && flashP >= 0.5;                         // past the peak of the flash: the star is there
  const merged = after ? 0.35 + 0.65 * sstep((u - 0.61) / 0.16) : 0;
  const wicks = GPOSTS.map(wickOf);
  const path = (i: number) => { const [x0, y0] = wicks[i], side = [-1, 0, 1][i]; return sampleCubics([[x0, y0], [x0 + side * 30, y0 - 170 - i * 20], [M[0] + side * 260, M[1] + 40 - i * 30], M], 24); };
  const tamasB = released ? 1 - lift[2] : 1;
  return (
    <Frame f={f} zoom={z} cx={CX} cy={CY} overlay={<>
      {labels.slice(0, 3).map((w, i) => { if (!w) return null; const [x, y] = onScreen(GPOSTS[i].x, GPOSTS[i].seat - 150, z, CX, CY); return <Label key={i} {...words(w)} f={f} at={Math.round(n * (released ? 0.04 + 0.05 * i : 0.1 + 0.33 * i))} until={released ? Math.round(n * 0.3) : undefined} x={x} y={y} anchor="middle" size={32}/>; })}
    </>}>
      <PaDefs/>
      <Sky mood={mood} sun={null} f={f} rays={0} clouds={0.5} id="gu" horizon={G_WATER}/>
      {/* released: the star over the horizon, with its glow on the far shore and its rays (behind the posts) */}
      {after ? <g>
        <SoftGlow x={M[0]} y={G_WATER - 10} r={900} ry={150} c0="#FFE2A8" c1="#C2703A" peak={0.55 * merged} k={1.6}/>
        <SoftGlow x={M[0]} y={M[1]} r={520} c0="#FFF2D6" c1="#E8B65A" peak={0.5 * merged} k={1.8}/>
        <defs><radialGradient id="gu-ray" gradientUnits="userSpaceOnUse" cx={M[0]} cy={M[1]} r={1300}><stop offset="0" stopColor="#FFF0C8" stopOpacity={1}/><stop offset="0.4" stopColor="#FFE2A8" stopOpacity={0.35}/><stop offset="1" stopColor="#FFE2A8" stopOpacity={0}/></radialGradient></defs>
        {Array.from({length: 14}, (_, k) => {
          const a = (-172 + k * 12.3 + rnd(k, 91) * 6 + Math.sin(f / 90 + k) * 1.5) * Math.PI / 180, w = (1.2 + rnd(k, 92) * 2.2) * Math.PI / 180, L = 1300 * merged;
          return <g key={k}>{[1, 0.6, 0.28].map((q, j) => <path key={j} d={`M ${M[0]} ${M[1]} L ${n1(M[0] + Math.cos(a - w * q) * L)} ${n1(M[1] + Math.sin(a - w * q) * L)} L ${n1(M[0] + Math.cos(a + w * q) * L)} ${n1(M[1] + Math.sin(a + w * q) * L)} Z`} fill="url(#gu-ray)" opacity={0.06 * merged * (0.7 + 0.3 * Math.sin(f / 40 + k))}/>)}</g>;
        })}
      </g> : null}
      <NightWater f={f} mood={mood}/>
      {after ? <>
        <SoftGlow x={M[0]} y={G_WATER - 4} r={760} ry={60} c0="#FFE6B0" c1="#D07A40" peak={0.75 * merged} k={1.8}/>
        <circle cx={M[0]} cy={M[1]} r={150 * (0.6 + 0.4 * merged)} fill="url(#pa-clear)" opacity={0.95}/>
        <circle cx={M[0]} cy={M[1]} r={7} fill="#FFFFFF"/>
        <Reflection x={M[0]} y0={G_WATER} b={merged} col="#FFF0C8" glow={["#FFE6B0", "#C2703A"]} rough={0.7} f={f} i={9} spread={3.6}/>
        <SoftGlow x={M[0]} y={(G_WATER + H) / 2 + 40} r={260} ry={(H - G_WATER) * 0.62} c0="#FFE6B0" c1="#B8603A" peak={0.3 * merged} k={1.4}/>
      </> : null}
      {/* each light washes the air with its own colour, most in its turn; tamas's turn is a spreading dark */}
      {[0, 1].map((i) => { const [x, y] = wicks[i]; return <SoftGlow key={i} x={x} y={y - 30} r={i ? 470 : 430} ry={i ? 380 : 360} c0={i ? "#FF8A50" : "#FFF0D0"} c1={i ? "#9A2A2A" : "#C8A060"} peak={0.5} k={1.6} o={(0.45 + 0.55 * turn[i]) * (1 - lift[i])}/>; })}
      <SoftGlow x={wicks[2][0] + 20} y={wicks[2][1] - 170} r={440 + 160 * turn[2]} ry={400 + 120 * turn[2]} c0="#020106" c1="#020106" peak={0.85} k={1.3} o={(0.35 + 0.55 * turn[2]) * tamasB}/>
      {/* the posts' dark reflections, broken by the ripples, and the rings where they stand in the water */}
      {GPOSTS.map((p, i) => <g key={i}>
        <path d={(postItems(i, p)[0] as any).d} fill="#04040A" opacity={0.38} transform={`translate(0 ${2 * p.base}) scale(1 -1) ${p.tilt ? `rotate(${p.tilt} ${p.x} ${p.base})` : ""}`}/>
        <ellipse cx={p.x} cy={p.base + 4} rx={62 + 4 * Math.sin(f / 30 + i)} ry={6} fill="none" stroke="#8A8AC0" strokeWidth={1.1} opacity={0.2}/>
        <ellipse cx={p.x} cy={p.base + 6} rx={96 + 6 * Math.sin(f / 30 + i + 1)} ry={9} fill="none" stroke="#8A8AC0" strokeWidth={0.9} opacity={0.09}/>
      </g>)}
      {/* the lights on the water */}
      {[0, 1].map((i) => <Reflection key={i} x={GPOSTS[i].x} y0={GPOSTS[i].base + 4} b={0.85 * (0.55 + 0.45 * turn[i]) * (1 - lift[i])} col={["#FFE9B8", "#FF8A4A"][i]} glow={i ? ["#FF8A50", "#8A2A2A"] : ["#FFF0D0", "#B8905A"]} rough={[0.5, 1.6][i]} f={f} i={i} spread={[1, 1.25][i]}/>)}
      <Reflection x={GPOSTS[2].x + 10} y0={GPOSTS[2].base + 4} b={0.35 * (0.6 + 0.4 * turn[2]) * tamasB} col="#B04A30" rough={1} f={f} i={2} spread={0.45}/>
      {/* tamas's smoke: heavy, rolling up into a pall that hides the stars (it thins away when released) */}
      <Smoke x={wicks[2][0]} y={wicks[2][1] - 14} f={f} kind="t" b={(0.8 + 0.3 * turn[2]) * tamasB} height={520 + 80 * turn[2]} spread={1 + 0.35 * turn[2]}/>
      {/* the posts and their lamps */}
      {GPOSTS.map((p, i) => <PostLamp key={i} i={i} p={p} f={f} lit={released ? (1 - lift[i]) * (i === 2 ? 0.3 : 0.9) : i === 2 ? 0.3 : 0.6 + 0.4 * turn[i]}
        light={after ? M : null} rimK={after ? 0.55 + 0.45 * merged : released ? (0.5 + 0.5 * turn[i]) * (1 - lift[i] * 0.8) : i === 2 ? 0.75 + 0.25 * turn[i] : 0.55 + 0.45 * turn[i]} rim={after ? "#FFE6B0" : undefined}
        fill={i === 2 && !after ? mix("#0E0A16", "#040308", turn[2] * tamasB) : undefined}/>)}
      {/* the three flames (they lift away in "released") */}
      {GPOSTS.map((p, i) => {
        const e = lift[i], at = wicks[i];
        if (e <= 0.001) return <GunaLight key={i} i={i} at={at} f={f} b={i === 2 ? 1 : 0.55 + 0.6 * turn[i]} bb={turn[i]}/>;
        if (after) return null;
        // the flame keeps its teardrop as it rises along its curve, leaning back from its motion, a soft trail behind
        const P = path(i), cum = cumLen(P), Lt = cum[cum.length - 1], [px, py] = atLen(P, e * Lt, cum), [qx] = atLen(P, Math.max(0, e - 0.03) * Lt, cum);
        const fh = [52, 48, 36][i] * (1 - 0.3 * e), lean = clamp01(Math.abs(px - qx) / 20) * Math.sign(qx - px) * 0.3;
        return <g key={i}>
          {(() => {
            // the trail: the curve it has come along, a soft band that narrows and fades behind it
            const e0 = Math.max(0, e - 0.3), pts = Array.from({length: 14}, (_, j) => { const [tx, ty] = atLen(P, lerp(e0, e, j / 13) * Lt, cum); return [tx, ty - fh * 0.3]; });
            const [ax, ay] = pts[0], [bx, by] = pts[13], gid = `gt${i}`, c = ["#FFF0D0", "#FFB07A", "#C8A8D0"][i];
            return <g>
              <defs><linearGradient id={gid} gradientUnits="userSpaceOnUse" x1={ax} y1={ay} x2={bx} y2={by}><stop offset="0" stopColor={c} stopOpacity={0}/><stop offset="0.7" stopColor={c} stopOpacity={0.22}/><stop offset="1" stopColor={c} stopOpacity={0.5}/></linearGradient></defs>
              <path d={band(pts, 1, 22 * (1 - 0.3 * e), 1.4, "round")} fill={`url(#${gid})`} opacity={0.6}/>
              <path d={band(pts, 0.5, 8 * (1 - 0.3 * e), 1.6, "round")} fill={`url(#${gid})`}/>
            </g>;
          })()}
          <SoftGlow x={px} y={py - fh * 0.4} r={fh * 3.2} c0={["#FFF4DA", "#FFB07A", "#C8A0B8"][i]} c1={["#E8C27A", "#C0402A", "#4A3060"][i]} peak={0.32} k={2.2}/>
          <Flame x={px} y={py} h={fh} f={f} seed={i * 4 + 1} calm={i === 1 ? 0.5 : 0.9} lean={lean} b={i === 2 ? 0.6 + 0.4 * e : 1} halo={0} blue={0.5}/>
        </g>;
      })}
      {released ? <LightFlash p={flashP} x={M[0]} y={M[1]} r={520}/> : null}
      <Dust f={f} sun={after ? M : [960, 520]} n={80} y0={260} y1={900} color="#E8DDC0"/>
    </Frame>
  );
};
// Faith (17.1-4): three offerings on a carved stone ledge above the night water, a small diya before each, its light on
// the food and on the stone. Sattva: a polished brass bowl, a neat mound of white rice with a tulsi sprig, a calm flame, a
// thread of incense wavering at its foot. Rajas: a copper bowl with a scalloped lip, a tall heap of glossy sweets, a
// restless flame and twisting red smoke. Tamas: a dull, chipped clay bowl of stale dark food, lumpy and spilling, a lamp
// gone to a dull red ember under heavy smoke.
const F_LEDGE = 808, F_TREAD = 772, F_FOOT = 790;
const FX = [560, 960, 1360];
// A bowl on a low foot, seen a little from above; (x, y) is the foot on the stone. The near lip sags below the far one.
const bowlD = (x: number, y: number, chip = false): string => smooth([C(x - 30, y), C(x - 24, y - 9), [x - 34, y - 13], [x - 62, y - 26], [x - 84, y - 44], C(x - 92, y - 58), [x - 60, y - 51], [x, y - 49], [x + 60, y - 51],
  ...(chip ? [C(x + 70, y - 53), C(x + 76, y - 47), C(x + 84, y - 50)] : []), C(x + 92, y - 58), [x + 84, y - 44], [x + 62, y - 26], [x + 34, y - 13], C(x + 24, y - 9), C(x + 30, y)], {wind: "cw"});
const MATS = [
  {dark: "#2A1608", mid: "#7A4E1C", lit: "#E8B060", spec: "#FFF2C8"},     // brass
  {dark: "#2C0E06", mid: "#8A3816", lit: "#F2904C", spec: "#FFD8B0"},     // copper
  {dark: "#120A0C", mid: "#241816", lit: "#4A2E26", spec: ""},           // dull clay
];
const Offering: React.FC<{i: number; x: number; y: number; lamp: V2; f: number; b: number}> = ({i, x, y, lamp, f, b}) => {
  const id = useUid(), m = MATS[i], body = bowlD(x, y, i === 2), lip = y - 58;
  const food: React.ReactNode[] = [];
  if (i === 0) {
    const mound = smooth([C(x - 80, lip + 4), [x - 60, lip - 18], [x - 32, lip - 36], [x, lip - 42], [x + 32, lip - 36], [x + 60, lip - 18], C(x + 80, lip + 4)], {wind: "cw"});
    let grains = "";
    for (let k = 0; k < 46; k++) { const gx = x + (rnd(k, 301) - 0.5) * 140, top = lip - 42 * (1 - Math.pow((gx - x) / 80, 2)), gy = lerp(top + 4, lip, rnd(k, 302)); grains += `M ${n1(gx - 2.4)} ${n1(gy)} Q ${n1(gx)} ${n1(gy - 1.6)} ${n1(gx + 2.4)} ${n1(gy)} Q ${n1(gx)} ${n1(gy + 1.6)} ${n1(gx - 2.4)} ${n1(gy)} Z `; }
    const leaf = (a: number, L: number) => { const ax = x + 6, ay = lip - 40; return smooth([C(ax, ay), [ax + Math.cos(a - 0.3) * L * 0.5, ay + Math.sin(a - 0.3) * L * 0.5], C(ax + Math.cos(a) * L, ay + Math.sin(a) * L), [ax + Math.cos(a + 0.3) * L * 0.5, ay + Math.sin(a + 0.3) * L * 0.5]], {wind: "cw"}); };
    food.push(<path key="m" d={mound} fill={`url(#${id}r)`}/>, <path key="g" d={grains} fill="#FFF8EA" opacity={0.5}/>,
      <path key="t" d={[leaf(-1.2, 26), leaf(-0.6, 22), leaf(-1.8, 20), band([[x + 6, lip - 40], [x + 9, lip - 54], [x + 8, lip - 64]], 2, 1, 1, "round")].join(" ")} fill="#18200E"/>);
  } else if (i === 1) {
    const balls: number[][] = [[-50, -14], [-17, -16], [17, -16], [50, -14], [-34, -42], [0, -44], [34, -42], [-17, -70], [17, -70], [0, -96]];
    food.push(...balls.map(([dx, dy], k) => <g key={k}><circle cx={x + dx} cy={lip + dy} r={17} fill={`url(#${id}s)`}/><circle cx={x + dx + 5} cy={lip + dy - 6} r={2.6} fill="#FFE8C0" opacity={0.55 * b}/></g>));
  } else {
    // stale and lumpy: a slumped dark heap, crusted lumps, a few fallen over the chipped lip
    const heap = smooth([C(x - 82, lip + 4), [x - 70, lip - 8], [x - 50, lip - 14], [x - 34, lip - 10], [x - 18, lip - 20], [x + 2, lip - 16], [x + 20, lip - 24], [x + 40, lip - 14], [x + 62, lip - 10], C(x + 82, lip + 4)], {wind: "cw"});
    const lumps = [[-58, -12, 11], [-36, -16, 9], [-8, -20, 12], [22, -24, 10], [46, -16, 9], [64, -8, 7], [-20, -8, 8]].map(([dx, dy, r], k) => smooth(Array.from({length: 7}, (_, j) => { const a = (j / 7) * Math.PI * 2, rr = r * (0.75 + 0.5 * rnd(j + k * 7, 311)); return [x + dx + Math.cos(a) * rr, lip + dy + Math.sin(a) * rr * 0.75] as Pt; }), {wind: "cw"})).join(" ");
    const spill = [circ(x + 96, y - 40, 6), circ(x + 104, y - 6, 5), circ(x + 112, y - 3, 3.5)].join(" ");
    food.push(<path key="h" d={heap} fill="#221A18"/>, <path key="l" d={lumps} fill="#2C221E"/>, <path key="s" d={spill} fill="#1E1614"/>);
  }
  return (
    <g>
      <defs>
        <linearGradient id={`${id}b`} gradientUnits="userSpaceOnUse" x1={x - 92} y1={0} x2={x + 92} y2={0}><stop offset="0" stopColor={m.dark}/><stop offset="0.5" stopColor={m.mid}/><stop offset="0.85" stopColor={m.dark}/><stop offset="1" stopColor={m.dark}/></linearGradient>
        <radialGradient id={`${id}l`} gradientUnits="userSpaceOnUse" cx={lamp[0]} cy={lamp[1]} r={190}><stop offset="0" stopColor={m.lit} stopOpacity={0.95 * b}/><stop offset="0.45" stopColor={m.lit} stopOpacity={0.4 * b}/><stop offset="1" stopColor={m.lit} stopOpacity={0}/></radialGradient>
        <radialGradient id={`${id}r`} gradientUnits="userSpaceOnUse" cx={lamp[0]} cy={lamp[1]} r={220}><stop offset="0" stopColor="#FFF6E4"/><stop offset="0.5" stopColor="#D8CCB0"/><stop offset="1" stopColor="#6A5E50"/></radialGradient>
        <radialGradient id={`${id}s`} cx="0.36" cy="0.32" r="0.75"><stop offset="0" stopColor="#FFC878"/><stop offset="0.45" stopColor="#D8701E"/><stop offset="1" stopColor="#4A1A08"/></radialGradient>
        <clipPath id={`${id}c`}><path d={body}/></clipPath>
      </defs>
      {/* the far inside of the bowl, under the food */}
      <ellipse cx={x} cy={lip - 1} rx={90} ry={11} fill={i === 2 ? "#0C0608" : "#160A06"}/>
      {food}
      <path d={body} fill={`url(#${id}b)`}/>
      <path d={body} fill={`url(#${id}l)`}/>
      <g clipPath={`url(#${id}c)`}>
        {m.spec ? <ellipse cx={lamp[0] - 38} cy={y - 32} rx={5} ry={20} fill={m.spec} opacity={0.5 * b} transform={`rotate(-18 ${lamp[0] - 38} ${y - 32})`}/> : null}
        {i === 1 ? [y - 38, y - 30].map((yy, k) => <path key={k} d={`M ${x - 100} ${yy} Q ${x} ${yy + 12} ${x + 100} ${yy}`} fill="none" stroke="#2A0C04" strokeWidth={1.4} opacity={0.7}/>) : null}
        {i === 2 ? <path d={crackD(x - 30, y - 50, Math.PI / 2 - 0.3, 34, 1.3, 81, "cw")} fill="#07040A"/> : null}
      </g>
      {/* the near lip catching the lamp (a highlight on the metal, none on dull clay) */}
      {i < 2 ? <path d={`M ${x - 92} ${lip} Q ${x} ${lip + 18} ${x + 92} ${lip}`} fill="none" stroke={m.lit} strokeWidth={2} opacity={0.75 * b}/> : <path d={`M ${x - 92} ${lip} Q ${x} ${lip + 18} ${x + 66} ${lip + 6}`} fill="none" stroke="#5A3A30" strokeWidth={1.4} opacity={0.6}/>}
      {i === 1 ? Array.from({length: 9}, (_, k) => <circle key={k} cx={x - 80 + k * 20} cy={lip + 9 - 6 * Math.sin((k / 8) * Math.PI)} r={2.4} fill={m.lit} opacity={0.5 * b}/>) : null}
    </g>
  );
};
const FaithScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const mood = moodOf(s, "night"), u = f / Math.max(1, n), labels = labelsOf(s);
  const z = push(f, n, 1, 1.04), CX = 960, CY = 640;
  const turn = [0, 1, 2].map((i) => bump(u, 0.17 + i * 0.33, 0.15));
  const DS = 0.92, diyaX = FX.map((x) => x + 84), wick = diyaX.map((x) => diyaWick(x, F_LEDGE - 3, DS, true));
  const ld = ledge({x0: -90, x1: 2010, y: F_LEDGE, h: 78, wall: 260, seed: 5, chips: false});
  const POOL = [["#FFF0D0", "#B89060"], ["#FFA060", "#8A2A20"], ["#C0502C", "#3A1018"]];
  // the frieze on the wall under the moulding: plain pilasters between recessed panels, a lotus rosette in each panel
  let frieze = "", rosettes = "";
  const FY0 = F_LEDGE + 92, FY1 = F_LEDGE + 168;
  for (let k = -1; k < 14; k++) {
    const x0 = 40 + k * 150;
    frieze += polyD([[x0, FY0], [x0 + 22, FY0], [x0 + 22, FY1], [x0, FY1]], true, "cw") + " ";
    frieze += polyD([[x0 + 30, FY0 + 6], [x0 + 142, FY0 + 6], [x0 + 142, FY0 + 9], [x0 + 30, FY0 + 9]], true, "cw") + " " + polyD([[x0 + 30, FY1 - 9], [x0 + 142, FY1 - 9], [x0 + 142, FY1 - 6], [x0 + 30, FY1 - 6]], true, "cw") + " ";
    const cx = x0 + 86, cy = (FY0 + FY1) / 2;
    for (let j = 0; j < 8; j++) { const a = (j / 8) * Math.PI * 2; rosettes += smooth([C(cx, cy), [cx + Math.cos(a - 0.3) * 12, cy + Math.sin(a - 0.3) * 12], C(cx + Math.cos(a) * 22, cy + Math.sin(a) * 22), [cx + Math.cos(a + 0.3) * 12, cy + Math.sin(a + 0.3) * 12]], {wind: "cw"}) + " "; }
    rosettes += circ(cx, cy, 5) + " ";
  }
  let joints = "";
  for (let k = 0; k < 9; k++) { const jx = 120 + k * 215 + rnd(k, 331) * 60; joints += polyD([[jx - 0.6 + (jx - 960) * 0.04, F_TREAD], [jx + 0.6 + (jx - 960) * 0.04, F_TREAD], [jx + 0.8, F_LEDGE], [jx - 0.8, F_LEDGE]], true, "cw") + " "; }
  return (
    <Frame f={f} zoom={z} cx={CX} cy={CY} overlay={<>
      {labels.slice(0, 3).map((w, i) => { if (!w) return null; const [x, y] = onScreen(FX[i], F_LEDGE + 58, z, CX, CY); return <Label key={i} {...words(w)} f={f} at={Math.round(n * (0.1 + 0.33 * i))} x={x} y={y} anchor="middle" size={30}/>; })}
    </>}>
      <PaDefs/>
      <defs>
        <linearGradient id="fa-tread" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1E1828"/><stop offset="1" stopColor="#33283A"/></linearGradient>
      </defs>
      <Sky mood={mood} sun={null} f={f} rays={0} clouds={0.5} id="fa" horizon={G_WATER}/>
      <NightWater f={f} mood={mood}/>
      {/* each light's colour in the air behind its offering; tamas's dark rises with its smoke */}
      {[0, 1].map((i) => <SoftGlow key={i} x={FX[i] + 30} y={640} r={420} ry={340} c0={i ? "#FF8A50" : "#FFF0D0"} c1={i ? "#9A2A2A" : "#C8A060"} peak={0.32} k={1.6} o={0.4 + 0.5 * turn[i]}/>)}
      <SoftGlow x={FX[2]} y={560} r={460 + 120 * turn[2]} ry={420} c0="#020106" c1="#020106" peak={0.8} k={1.3} o={0.45 + 0.45 * turn[2]}/>
      {/* the smoke rising from each offering */}
      <Smoke x={FX[0] + 4} y={F_FOOT - 104} f={f} kind="s" b={0.8 + 0.4 * turn[0]} height={470}/>
      <Smoke x={FX[1]} y={F_FOOT - 150} f={f} kind="r" b={1.1 + 0.5 * turn[1]} height={420}/>
      <Smoke x={FX[1] + 10} y={F_FOOT - 140} f={f + 55} kind="r" b={0.8 + 0.4 * turn[1]} height={380}/>
      <Smoke x={wick[2][0]} y={wick[2][1] - 10} f={f} kind="t" b={0.9 + 0.3 * turn[2]} height={600} spread={0.9 + 0.3 * turn[2]}/>
      {/* the top of the ledge, worn stone, and the lamps' light pooled on it */}
      <path d={polyD([[-90, F_TREAD], [2010, F_TREAD], [2010, F_LEDGE + 12], [-90, F_LEDGE + 12]], true, "cw")} fill="url(#fa-tread)"/>
      <path d={joints} fill="#120C18" opacity={0.8}/>
      {[0, 1, 2].map((i) => <SoftGlow key={i} x={wick[i][0] - 20} y={F_LEDGE - 12} r={i === 2 ? 170 : 320} ry={i === 2 ? 24 : 36} c0={POOL[i][0]} c1={POOL[i][1]} peak={i === 2 ? 0.4 : 0.75} k={1.6} o={0.75 + 0.25 * turn[i]}/>)}
      {/* the carved ledge: kapota, torus and fillets, chipped, lit from the lamps above */}
      <Rimmed paths={ld} light={[0, -1]} w={1.6} rim="#9A7458" fill="#140D1A"/>
      <Rimmed paths={[{d: frieze, fill: RELIEF_LT, rim: false}, {d: rosettes, fill: "#3A2840", rim: false}]} light={[0, -1]} w={1} fill="#140D1A"/>
      {[0, 1, 2].map((i) => <SoftGlow key={i} x={wick[i][0] - 20} y={F_LEDGE + 70} r={i === 2 ? 150 : 340} ry={i === 2 ? 70 : 130} c0={POOL[i][0]} c1={POOL[i][1]} peak={i === 2 ? 0.25 : 0.5} k={1.4} o={0.7 + 0.3 * turn[i]}/>)}
      {/* the offerings and the lamps before them */}
      {FX.map((x, i) => <g key={i}>
        <ellipse cx={x} cy={F_FOOT + 1} rx={96} ry={7} fill="url(#pa-shade)" opacity={0.9}/>
        <Offering i={i} x={x} y={F_FOOT} lamp={wick[i]} f={f} b={i === 2 ? 0.35 : 0.65 + 0.35 * turn[i]}/>
        <Diya x={diyaX[i]} y={F_LEDGE - 3} s={DS} f={f} seed={i * 5 + 1} lit={i === 2 ? 0.28 : 0.85 + 0.15 * turn[i]} flame={false} flip shadow={0.8}/>
        <GunaLight i={i} at={wick[i]} f={f} b={i === 2 ? 1 : 0.7 + 0.45 * turn[i]} bb={turn[i]} k={1.05}/>
      </g>)}
      <Dust f={f} sun={[960, 640]} n={70} y0={200} y1={780} color="#E8DDC0"/>
    </Frame>
  );
};

// =====================================================================================================================
// ASHVATTHA (15.1-3): the eternal peepal hanging from a band of radiant light: thick, gnarled roots with fine root hairs
// rise from a flared collar and plunge into the light, rays streaming down from it; the fluted trunk hangs; below, an open
// crown of drooping limbs and trembling heart leaves, the sky showing through, hangs heaviest in the middle over a world
// of rivers, temples and trees. variant "cut": a blade of light strikes through the trunk with a flash and sparks; the
// lower tree breaks apart (leaves tear away and crumble into motes, limbs snap) and falls behind the land; the stump and
// its roots draw up into the light, which comes down to fill the sky over the world.
// =====================================================================================================================
const AS_TC: V2 = [960, 302];                                       // the root collar (top of the trunk)
const AS_TB: V2 = [960, 506];                                       // where the trunk divides into limbs
const AS_HZ = 902;                                                  // the horizon of the world below
type AsSeg = {pts: number[][]; w0: number; w1: number; d: number; k: number};
type AsLeaf = {x: number; y: number; th: number; L: number; ph: number; layer: number};
type AsClump = {x: number; y: number; k: number; leaves: AsLeaf[]};
// A gnarled, tapering band along pts: knots swell it here and there, each edge wavers on its own.
const gnarl = (pts: number[][], w0: number, w1: number, seed: number, knots = 3): string => {
  const n = pts.length, L: Pt[] = [], R: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1), [nx, ny] = nrmAt(pts, i), base = w0 + (w1 - w0) * Math.pow(u, 0.75);
    const knot = 1 + 0.26 * Math.pow(Math.max(0, Math.sin(u * knots * Math.PI * 2 + seed)), 3);
    const wl = base * knot * (0.5 + 0.07 * Math.sin(u * 17 + seed)), wr = base * knot * (0.5 + 0.07 * Math.sin(u * 13 + seed * 2.3));
    L.push([pts[i][0] + nx * wl, pts[i][1] + ny * wl]); R.push([pts[i][0] - nx * wr, pts[i][1] - ny * wr]);
  }
  L[0] = [L[0][0], L[0][1], "c"]; R[0] = [R[0][0], R[0][1], "c"];
  const e = pts[n - 1], d = pts[n - 2], l = Math.hypot(e[0] - d[0], e[1] - d[1]) || 1;
  return smooth([...L, [e[0] + ((e[0] - d[0]) / l) * w1, e[1] + ((e[1] - d[1]) / l) * w1, "c"], ...R.reverse()], {wind: "cw"});
};
const quad = (a: number[], c: number[], b: number[], n: number): number[][] => Array.from({length: n + 1}, (_, i) => { const u = i / n, v = 1 - u; return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]]; });
const growAsh = () => {
  const segs: AsSeg[] = [], clumps: AsClump[] = [], roots: string[] = [], hairs: string[] = [];
  // the crown's envelope: an inverted dome hanging from the fork, deepest in the middle, its edges lobed; leaf clumps on
  // a jittered grid inside it, some dropped (and whole patches cleared) so the sky shows through
  type Cl = {x: number; y: number; r: number; k: number; low: boolean};
  const top = (nx: number) => 592 - 70 * nx * nx, bot = (nx: number) => 876 - 200 * nx * nx;
  const cl: Cl[] = [], SX = 60, SY = 50;
  for (let row = 0, y = 530, i = 0; y <= 900; y += SY, row++) for (let x = 330 + ((row % 2) * SX) / 2; x <= 1590; x += SX, i++) {
    const px = x + (rnd(i, 71) - 0.5) * SX * 0.55, py = y + (rnd(i, 72) - 0.5) * SY * 0.5, nx = (px - 960) / 615;
    if (Math.abs(nx) > 1) continue;
    const t0 = top(nx) + 16 * Math.sin(nx * 9 + 1), b0 = bot(nx) + 22 * Math.sin(nx * 7 + 2);
    if (py < t0 || py > b0) continue;
    const inner = py > t0 + 36 && py < b0 - 36 && Math.abs(nx) < 0.86;
    if (inner && rnd(i, 73) < 0.16) continue;
    if (inner && 0.55 * Math.sin((px / SX) * 0.95 + 1.3) + 0.45 * Math.sin((py / SY) * 1.2 + (px / SX) * 0.45 + 2.1) > 0.72) continue;
    cl.push({x: px, y: py, r: 34 + 9 * rnd(i, 75), k: cl.length, low: py > b0 - 50});
  }
  // the limbs: from the fork a branch grows towards each group of clumps, splits by direction, and so on until every
  // clump has its twig; widths thin by the pipe model; each branch sags a little under its weight
  const reach = (S: number[], grp: Cl[], w: number, depth: number) => {
    if (!grp.length) return;
    if (grp.length === 1) {
      const c = grp[0], d = Math.hypot(c.x - S[0], c.y - S[1]);
      if (d < c.r * 0.3) return;
      const M = [(S[0] + c.x) / 2 + (rnd(c.k, 81) - 0.5) * d * 0.3, (S[1] + c.y) / 2 + d * 0.16];
      segs.push({pts: quad(S, M, [c.x, c.y], 6), w0: w, w1: Math.max(1.4, w * 0.5), d: depth + 1, k: segs.length});
      return;
    }
    const G = [grp.reduce((a, c) => a + c.x, 0) / grp.length, grp.reduce((a, c) => a + c.y, 0) / grp.length], d = Math.hypot(G[0] - S[0], G[1] - S[1]) || 1;
    const C1 = [S[0] + (G[0] - S[0]) * 0.4 + (rnd(depth * 31 + grp[0].k, 82) - 0.5) * d * 0.22, S[1] + (G[1] - S[1]) * 0.45 + d * (depth === 1 ? -0.05 : 0.14)];
    const fr = grp.length > 5 ? 0.5 : 0.38, E = [((1 - fr) ** 2) * S[0] + 2 * (1 - fr) * fr * C1[0] + fr * fr * G[0], ((1 - fr) ** 2) * S[1] + 2 * (1 - fr) * fr * C1[1] + fr * fr * G[1]];
    const Cs = [S[0] + (C1[0] - S[0]) * fr, S[1] + (C1[1] - S[1]) * fr];
    if (depth > 0) segs.push({pts: quad(S, Cs, E, 7), w0: w, w1: w * 0.8, d: depth, k: segs.length});
    const from = depth > 0 ? E : S, dx = G[0] - from[0], dy = G[1] - from[1];
    const sorted = grp.map((c) => ({c, a: Math.atan2((c.x - from[0]) * -dy + (c.y - from[1]) * dx, (c.x - from[0]) * dx + (c.y - from[1]) * dy)})).sort((p, q) => p.a - q.a);
    const k = depth === 0 ? 5 : grp.length > 9 ? 3 : 2;
    for (let j = 0; j < k; j++) {
      const sub = sorted.slice(Math.round((j * sorted.length) / k), Math.round(((j + 1) * sorted.length) / k)).map((o) => o.c);
      if (!sub.length) continue;
      const share = Math.sqrt(sub.length / grp.length), S2 = depth === 0 ? [from[0] + (j - (k - 1) / 2) * 16, from[1]] : from;
      reach(S2, sub, Math.max(1.4, (depth === 0 ? w * 0.62 * 1.3 : w * 0.8) * share), depth + 1);
    }
  };
  reach([AS_TB[0], AS_TB[1] - 4], cl, 84, 0);
  cl.forEach((c) => {
    const leaves: AsLeaf[] = [], n = 19;
    for (let j = 0; j < n; j++) {
      const a = j * 2.39996 + rnd(c.k, 21) * 6.28, rr = c.r * (0.25 + 0.85 * Math.sqrt(rnd(c.k * 31 + j, 22)));
      const x = c.x + Math.cos(a) * rr, y = c.y + Math.sin(a) * rr * 0.8 + c.r * 0.12, q = rnd(c.k * 37 + j, 27);
      const glow = y > c.y + c.r * 0.1 && q < (c.low ? 0.5 : 0.14);
      leaves.push({x, y, th: (rnd(c.k * 23 + j, 24) - 0.5) * 1.3 - ((x - c.x) / c.r) * 0.25, L: 24 + rnd(c.k * 29 + j, 25) * 12, ph: rnd(c.k * 31 + j, 26) * 6.28, layer: glow ? 2 : q < 0.36 ? 0 : 1});
    }
    clumps.push({x: c.x, y: c.y, k: c.k, leaves});
  });
  // roots: nine thick, gnarled roots flare from the collar and climb, bending upright, into the light; side roots and
  // fine hairs towards their ends
  const rootLine = (x: number, y: number, a: number, len: number, id: number, up = 0.75) => {
    const K = 14, pts: number[][] = [[x, y]];
    let px = x, py = y;
    for (let k = 1; k <= K; k++) { const u = k / K, h = a * (1 - up * u) + 0.3 * Math.sin(u * 7.5 + id) * (0.35 + u); px += (Math.sin(h) * len) / K; py -= (Math.cos(h) * len) / K; pts.push([px, py]); }
    return pts;
  };
  const hair = (x: number, y: number, a: number, L: number, id: number) => {
    const pts: number[][] = [[x, y]];
    for (let k = 1; k <= 5; k++) { const u = k / 5, h = a * (1 - 0.3 * u) + 0.22 * Math.sin(u * 3 + id); pts.push([x + Math.sin(h) * L * u, y - Math.cos(h) * L * u]); }
    hairs.push(band(pts, 1.3, 0.3, 1, "point"));
  };
  [-1.42, -1.1, -0.76, -0.4, -0.06, 0.3, 0.66, 1.02, 1.38].forEach((a, i) => {
    const x0 = AS_TC[0] + Math.sin(a) * 64, y0 = AS_TC[1] + 8 - Math.abs(a) * 10, len = 330 + rnd(i, 59) * 80, w0 = 46 - Math.abs(a) * 9;
    const P = rootLine(x0, y0, a, len, 100 + i);
    roots.push(gnarl(P, w0, 3, i * 1.7, 3));
    [0.36, 0.62].forEach((uu, j) => {
      const k = Math.round(uu * (P.length - 1)), h = a * (1 - 0.75 * uu), sa = h + (j ? -0.75 : 0.7) * (a >= 0 ? 1 : -1), sl = len * (0.42 - 0.12 * j);
      const S = rootLine(P[k][0], P[k][1], sa, sl, 200 + i * 3 + j, 0.6);
      roots.push(gnarl(S, w0 * (0.42 - 0.12 * j), 1.6, i + j * 3, 2));
      for (let q = 0; q < 6; q++) { const kk = Math.round((0.45 + 0.5 * rnd(q, i * 7 + j)) * (S.length - 1)); hair(S[kk][0], S[kk][1], sa + (q % 2 ? 0.9 : -0.9) * (0.6 + 0.4 * rnd(q, i + 40)), 14 + 26 * rnd(q, i + 41), q + i * 9 + j); }
    });
    for (let q = 0; q < 16; q++) { const kk = Math.round((0.4 + 0.58 * rnd(q, i + 50)) * (P.length - 1)), h = a * (1 - 0.75 * kk / (P.length - 1)); hair(P[kk][0], P[kk][1], h + (q % 2 ? 1 : -1) * (0.5 + 0.6 * rnd(q, i + 51)), 16 + 34 * rnd(q, i + 52), q + i * 11); }
  });
  return {segs, clumps, roots: roots.join(" "), hairs: hairs.join(" ")};
};
let ASH: ReturnType<typeof growAsh> | null = null;
const ash = () => (ASH ??= growAsh());
// The trunk: massive and fluted, flaring at the collar into the roots and at the fork into the limbs.
const AS_TRUNK = smooth([C(852, 296), [892, 304], [912, 328], [918, 368], [914, 410], [920, 450], [910, 478], [888, 500], [866, 514], [900, 518], [960, 524], [1022, 518], [1056, 512], [1032, 498], [1010, 476], [1000, 446], [1004, 406], [1002, 364], [1010, 328], [1030, 304], C(1068, 294), [1010, 284], [960, 280], [908, 284]], {wind: "cw"});
const AS_FLUTES = [[[934, 300], [930, 380], [936, 450], [922, 500]], [[960, 296], [963, 380], [956, 440], [962, 506]], [[986, 300], [990, 370], [984, 450], [998, 500]]].map((c) => band(sampleCubics(c, 10), 3, 1.4, 1, "point")).join(" ");
// A peepal leaf (a broad heart with a long drip tip) hanging from (x, y), turned by th (0 = straight down), length L.
const leafD = (x: number, y: number, th: number, L: number): string => {
  const c = Math.cos(th) * L, s = Math.sin(th) * L;
  const T = (lx: number, ly: number) => `${n1(x + lx * c - ly * s)} ${n1(y + lx * s + ly * c)}`;
  return `M${T(0, 0.05)}C${T(-0.07, -0.01)} ${T(-0.25, -0.01)} ${T(-0.31, 0.12)}C${T(-0.36, 0.24)} ${T(-0.27, 0.37)} ${T(-0.15, 0.46)}C${T(-0.08, 0.52)} ${T(-0.035, 0.6)} ${T(-0.018, 0.7)}C${T(-0.008, 0.8)} ${T(-0.004, 0.9)} ${T(0, 1)}C${T(0.004, 0.9)} ${T(0.008, 0.8)} ${T(0.018, 0.7)}C${T(0.035, 0.6)} ${T(0.08, 0.52)} ${T(0.15, 0.46)}C${T(0.27, 0.37)} ${T(0.36, 0.24)} ${T(0.31, 0.12)}C${T(0.25, -0.01)} ${T(0.07, -0.01)} ${T(0, 0.05)}Z`;
};
// a clump's leaves at frame f, by layer (0 behind, 1 in front and rimmed, 2 lit through from behind), with their stalks
const clumpLeaves = (c: AsClump, f: number): [string, string, string] => {
  const out: [string, string, string] = ["", "", ""];
  for (const l of c.leaves) {
    const th = l.th + 0.15 * Math.sin(f * 0.31 + l.ph) + 0.05 * Math.sin(f * 0.83 + l.ph * 2.3);
    out[l.layer] += leafD(l.x, l.y, th, l.L);
    if (l.layer === 1) out[1] += " " + band([[c.x, c.y], [lerp(c.x, l.x, 0.5), lerp(c.y, l.y, 0.5) - 2], [l.x, l.y]], 1.4, 0.8, 1, "round");
  }
  return out;
};
// The world below: the land on the horizon, a river winding out of the light, a temple, a shrine, trees.
const AS_WORLD = (() => {
  const y = AS_HZ;
  return {
    land: ridge([[-60, y + 8], [200, y], [460, y + 6], [700, y - 2], [960, y + 4], [1220, y - 4], [1500, y + 4], [1760, y - 2], [1990, y + 4]]),
    river: band(crPoints([[984, y + 1], [1000, y + 14], [968, y + 32], [1010, y + 62], [940, y + 110], [830, y + 168], [760, y + 240]], 8), 4, 230, 1.5, "round"),
    glints: Array.from({length: 26}, (_, k) => { const v = Math.pow((k + 0.5) / 26, 1.3), yy = y + 6 + v * 170, cx = yAt([[y + 1, 984], [y + 14, 1000], [y + 32, 968], [y + 62, 1010], [y + 110, 940], [y + 168, 830], [y + 240, 760]], yy), L = (6 + 60 * v) * (0.4 + 0.6 * rnd(k, 91)); return `M ${n1(cx - L)} ${n1(yy)} L ${n1(cx + L)} ${n1(yy - 0.8)} L ${n1(cx + L)} ${n1(yy + 0.6)} Z`; }).join(" "),
    pieces: [temple({x: 1450, y: y + 4, w: 40, porch: -1}), shrine({x: 560, y: y + 4, h: 70, flag: true}), peepal({x: 300, y: y + 8, h: 176, seed: 3}), khejri({x: 140, y: y + 8, h: 112, seed: 5}), palmyra({x: 1700, y: y + 8, h: 196, seed: 2}), palmyra({x: 1762, y: y + 8, h: 156, seed: 6})] as Item[][],
  };
})();
const AshvatthaScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const mood = moodOf(s, "dusk"), cut = String(s?.variant || "") === "cut";
  const T = ash();
  const z = push(f, n, 1, 1.04), CX = 960, CY = 480;
  // the cut: a blade of light strikes at tc; the line of the cut runs a little aslant through the trunk
  const tc = Math.round(n * 0.3), YC = 404, SL = -0.16, cutY = (x: number) => YC + (x - 960) * SL;
  const t = cut ? f - tc : -1;
  const g = 0.085, fallAt = (tt: number) => (tt > 0 ? 0.5 * g * tt * tt : 0);
  const bodyY = fallAt(t), bodyR = t > 0 ? Math.min(9, 0.0007 * t * t) : 0;
  const rise = cut ? 470 * sstep((f - tc - 24) / Math.max(60, n * 0.42)) : 0;
  const bandH = 340 + (cut ? 540 * sstep((f - tc - 14) / Math.max(60, n * 0.5)) : 0);
  const BT = `translate(0 ${n1(bodyY)}) rotate(${n1(bodyR)} 960 ${YC})`;
  // which pieces have broken away from the falling tree, and where they are
  const detT = (k: number, salt: number, a: number, b: number) => a + rnd(k, salt) * b;
  const leafL: [string, string, string] = ["", "", ""], wood: string[] = [];
  const freeLeaves: {d: [string, string, string]; tr: string}[] = [], freeWood: {d: string; t: string}[] = [], motes: string[] = ["", ""];
  for (const c of T.clumps) {
    const td = detT(c.k, 41, 6, 60);
    const L = clumpLeaves(c, f);
    if (!cut || t <= td) { for (let j = 0; j < 3; j++) leafL[j] += L[j]; continue; }
    const tt = t - td, sc = 1 - sstep(tt / (36 + 30 * rnd(c.k, 42)));
    if (sc <= 0.02) continue;
    const vb = g * td, dx = (rnd(c.k, 43) - 0.5) * 2.4 * tt + 10 * Math.sin(tt / 9 + c.k), dy = fallAt(td) + vb * tt * 0.5 + 0.5 * g * 0.4 * tt * tt;
    const rot = (rnd(c.k, 44) - 0.5) * 2.2 * tt;
    freeLeaves.push({d: L, tr: `translate(${n1(dx)} ${n1(dy)}) rotate(${n1(rot)} ${n1(c.x)} ${n1(c.y)}) translate(${n1(c.x)} ${n1(c.y)}) scale(${sc.toFixed(3)}) translate(${n1(-c.x)} ${n1(-c.y)})`});
    // the crumbling clump sheds glowing motes
    for (let j = 0; j < 4; j++) { const a2 = clamp01((tt - j * 6) / 60); if (a2 <= 0 || a2 >= 1) continue; motes[a2 < 0.5 ? 0 : 1] += circ(c.x + dx + (rnd(c.k * 4 + j, 45) - 0.5) * 60 * a2, c.y + dy + a2 * 50 + (rnd(c.k * 4 + j, 46) - 0.5) * 30, 1.2 + 1.4 * rnd(c.k + j, 47)) + " "; }
  }
  for (const sg of T.segs) {
    const d = band(sg.pts, sg.w0, sg.w1, 1, "round");
    const td = sg.d >= 2 ? detT(sg.k, 51, 18, 56) : 1e9;
    if (!cut || t <= td) { wood.push(d); continue; }
    const tt = t - td, vb = g * td, dy = fallAt(td) + vb * tt + 0.5 * g * 1.1 * tt * tt, dx = (rnd(sg.k, 52) - 0.5) * 1.6 * tt, rot = (rnd(sg.k, 53) - 0.5) * 1.6 * tt;
    freeWood.push({d, t: `translate(${n1(dx)} ${n1(dy)}) rotate(${n1(rot)} ${n1(sg.pts[0][0])} ${n1(sg.pts[0][1])})`});
  }
  const crownItems: Item[] = [{d: leafL[0], fill: "#2C1834", rim: false}, {d: wood.join(" ")}, {d: leafL[1], rw: 0.5}];
  const RIM = "#F8D08A", W2 = 2;
  // sparks from the strike: a burst along the cut that falls away
  const sparks: React.ReactNode[] = [];
  if (cut && t > 0 && t < 70) for (let k = 0; k < 34; k++) {
    const life = 26 + rnd(k, 61) * 34, tt = t - rnd(k, 62) * 6; if (tt <= 0 || tt > life) continue;
    const x0 = 912 + rnd(k, 63) * 96, vx = (rnd(k, 64) - 0.5) * 20, vy = -2 - rnd(k, 65) * 7, x = x0 + vx * tt, y = cutY(x0) + vy * tt + 0.2 * tt * tt;
    sparks.push(<circle key={k} cx={x} cy={y} r={2 + 3 * (1 - tt / life)} fill="url(#pa-spark)" opacity={1 - tt / life}/>, <circle key={"c" + k} cx={x} cy={y} r={1} fill="#FFFFFF" opacity={1 - tt / life}/>);
  }
  const strike = cut ? (f - (tc - 9)) / 12 : -1;                      // the blade crosses the trunk at tc
  const up = `translate(0 ${n1(-rise)})`;
  return (
    <Frame f={f} zoom={z} cx={CX} cy={CY} vig={0.3}>
      <PaDefs/>
      <defs>
        <linearGradient id="as-band" gradientUnits="userSpaceOnUse" x1="0" y1="-40" x2="0" y2={bandH}><stop offset="0" stopColor="#FFFFFF"/><stop offset="0.24" stopColor="#FFFAEA"/><stop offset="0.46" stopColor="#FFE9B0" stopOpacity={0.92}/><stop offset="0.72" stopColor="#FFC877" stopOpacity={0.4}/><stop offset="1" stopColor="#F2A860" stopOpacity={0}/></linearGradient>
        <linearGradient id="as-ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF4D8" stopOpacity={0.6}/><stop offset="0.5" stopColor="#FFE2A8" stopOpacity={0.22}/><stop offset="1" stopColor="#FFD08A" stopOpacity={0}/></linearGradient>
        <linearGradient id="as-earth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#24122A"/><stop offset="1" stopColor="#0A0610"/></linearGradient>
        <linearGradient id="as-river" gradientUnits="userSpaceOnUse" x1="0" y1={AS_HZ} x2="0" y2={H}><stop offset="0" stopColor="#FFF0C8" stopOpacity={0.95}/><stop offset="0.4" stopColor="#F2B070" stopOpacity={0.6}/><stop offset="1" stopColor="#9A5040" stopOpacity={0.35}/></linearGradient>
        <linearGradient id="as-vig" x1="0" y1="0" x2="0" y2="1"><stop offset="0.6" stopColor="#05030A" stopOpacity={0}/><stop offset="1" stopColor="#05030A" stopOpacity={0.55}/></linearGradient>
        <clipPath id="as-up"><path d={`M -400 -900 L 2400 -900 L 2400 ${n1(cutY(2400))} L -400 ${n1(cutY(-400))} Z`}/></clipPath>
        <clipPath id="as-dn"><path d={`M -400 ${n1(cutY(-400))} L 2400 ${n1(cutY(2400))} L 2400 2400 L -400 2400 Z`}/></clipPath>
      </defs>
      <Sky mood={mood} sun={[960, AS_HZ + 140]} sunR={70} f={f} rays={0} clouds={0.45} id="as" horizon={AS_HZ}/>
      {/* rays of light streaming down from the band (stronger once the tree is cut) */}
      {Array.from({length: 9}, (_, k) => { const x = 180 + k * 195 + Math.sin(f / 80 + k) * 12, w0 = 40 + rnd(k, 5) * 40, w1 = 150 + rnd(k, 6) * 120, dx = (x - 960) * 0.35;
        return <path key={k} d={`M ${n1(x - w0)} -40 L ${n1(x + w0)} -40 L ${n1(x + dx + w1)} ${AS_HZ} L ${n1(x + dx - w1)} ${AS_HZ} Z`} fill="url(#as-ray)" opacity={(0.16 + (cut ? 0.2 * sstep((f - tc) / 60) : 0)) * (0.7 + 0.3 * Math.sin(f / 50 + k))}/>; })}
      {/* the lower tree: limbs, leaves and the trunk below the cut (it falls and breaks apart in "cut") */}
      <g transform={cut ? BT : undefined}>
        {cut && t > 0 ? <g clipPath="url(#as-dn)"><Rimmed paths={[AS_TRUNK]} light={[0, -1]} w={W2} rim={RIM} clip/><path d={AS_FLUTES} fill="#E8B070" opacity={0.12}/></g> : null}
        <Rimmed paths={crownItems} light={[0, -1]} w={W2} rim={RIM}/>
        <path d={leafL[2]} fill="#8E3E2A" opacity={0.9}/>
      </g>
      {/* pieces broken away: limbs snapping and falling, clumps of leaves tearing off and crumbling */}
      {freeWood.length ? <Rimmed paths={freeWood} light={[0, -1]} w={W2} rim={RIM}/> : null}
      {freeLeaves.map((p, i) => <g key={i} transform={p.tr}><Rimmed paths={[{d: p.d[0], fill: "#2C1834", rim: false}, {d: p.d[1], rw: 0.5}]} light={[0, -1]} w={W2} rim={RIM}/><path d={p.d[2]} fill="#8E3E2A" opacity={0.9}/></g>)}
      {/* the roots and the trunk above the cut (in "cut" they draw up into the light) */}
      <g transform={cut ? up : undefined}>
        <path d={T.hairs} fill="#24122A"/>
        {cut && t > 0 ? <g clipPath="url(#as-up)"><Rimmed paths={[T.roots, AS_TRUNK]} light={[0, -1]} w={W2} rim="#FFDC98"/><path d={AS_FLUTES} fill="#E8B070" opacity={0.12}/></g>
          : <><Rimmed paths={[T.roots, AS_TRUNK]} light={[0, -1]} w={W2} rim="#FFDC98"/><path d={AS_FLUTES} fill="#E8B070" opacity={0.12}/></>}
        {cut && t > 0 ? <path d={`M 904 ${n1(cutY(904) - 1.5)} L 1016 ${n1(cutY(1016) - 1.5)} L 1016 ${n1(cutY(1016) + 1.5)} L 904 ${n1(cutY(904) + 1.5)} Z`} fill="#FFF6DC" opacity={1 - clamp01(t / 70)}/> : null}
      </g>
      {/* the band of light the roots plunge into: radiant white-gold (it comes down to fill the sky after the cut) */}
      <rect x={-60} y={-60} width={W + 120} height={bandH + 60} fill="url(#as-band)"/>
      <SoftGlow x={960} y={-20} r={1300} ry={bandH * 0.9} c0="#FFFFFF" c1="#FFE2A8" peak={0.55} k={1.4}/>
      <path d={T.hairs} fill="#6A4A4A" opacity={0.32} transform={cut ? up : undefined}/>
      {/* the world below, in front of the falling tree */}
      <SoftGlow x={990} y={AS_HZ} r={700} ry={120} c0="#FFF0C8" c1="#F0A050" peak={0.35 + (cut ? 0.35 * sstep((f - tc - 30) / Math.max(60, n * 0.4)) : 0)} k={1.6}/>
      <path d={AS_WORLD.land} fill="url(#as-earth)"/>
      <path d={AS_WORLD.river} fill="url(#as-river)"/>
      <path d={AS_WORLD.glints} fill="#FFF4D8" opacity={0.35 + 0.15 * Math.sin(f / 13)}/>
      {AS_WORLD.pieces.map((p, i) => <Rimmed key={i} paths={p} light={[0, -1]} w={1.8} rim="#FFD38A"/>)}
      {/* the blade of light, the strike flash, sparks and motes */}
      {strike > 0 && strike < 1.3 ? (() => {
        const tip = lerp(520, 1460, Math.min(1, strike)), tail = tip - 640, op = strike < 1 ? 1 : 1 - (strike - 1) / 0.3;
        const P = (x: number, o: number): string => `${n1(x)} ${n1(cutY(x) + o)}`;
        return <g opacity={op}>
          <path d={`M ${P(tail, 0)} Q ${P(tip - 120, -14)} ${P(tip, 0)} Q ${P(tip - 120, 14)} ${P(tail, 0)} Z`} fill="#FFE6B0" opacity={0.28}/>
          <path d={`M ${P(tail, 0)} Q ${P(tip - 80, -4.5)} ${P(tip, 0)} Q ${P(tip - 80, 4.5)} ${P(tail, 0)} Z`} fill="#FFFFFF"/>
          <SoftGlow x={tip - 60} y={cutY(tip - 60)} r={120} ry={40} c0="#FFFFFF" c1="#FFD58A" peak={0.7} k={2}/>
        </g>;
      })() : null}
      {cut ? <LightFlash p={(f - (tc - 6)) / 22} x={960} y={YC} r={420}/> : null}
      {sparks}
      {motes.map((d, i) => d ? <path key={i} d={d} fill="#FFE2A8" opacity={[0.9, 0.5][i]}/> : null)}
      {cut ? [0, 1, 2, 3, 4].map((i) => { const f0 = tc + 50 + i * 7, p = (f - f0) / Math.max(1, n - f0), x = -140 + p * (1180 - i * 70); return f > f0 ? <Bird key={i} kind="stork" x={x} y={420 + Math.sin(i * 1.9) * 40 + i * 16 + Math.sin(f / 40 + i) * 6} scale={0.3 - (i % 3) * 0.03} f={f} speed={0.8 + 0.06 * i} phase={i * 0.27} light={[0, -1]} fill="#2A1A30"/> : null; }) : null}
      <Dust f={f} sun={[960, 120]} n={100} y0={120} y1={900}/>
      <rect x={-40} y={0} width={W + 80} height={H + 40} fill="url(#as-vig)"/>
    </Frame>
  );
};
// =====================================================================================================================
// WHEEL (3.14-16): "from food come beings, from rain food, from sacrifice rain": a great wheel drawn in fine gold line on
// deep indigo, turning slowly; four emblems on its rim (sacrificial fire under the sun, cloud and rain, sprouting grain,
// a bowl of food) each light as they come to the top. Seasons of colour flow round it. s.labels: four words (optional),
// one beside each emblem while it is lit.
// =====================================================================================================================
const SEASON = ["#F0A04B", "#D97A9A", "#C8C060", "#5A86D8"];      // at emblem angles 0 (fire), 90 (food), 180 (grain), 270 (rain)
const seasonAt = (deg: number) => { const d = ((deg % 360) + 360) % 360, i = Math.floor(d / 90), t = (d - i * 90) / 90; return mix(SEASON[i], SEASON[(i + 1) % 4], sstep(t)); };
const GOLD = "#E8B65A";
// The ring of twelve petals round each emblem's medallion.
const MED_PETALS = Array.from({length: 12}, (_, i) => { const a = (i / 12) * 360, p = (r: number, d: number) => polar(0, 0, r, a + d).map(n1).join(" "); return `M ${p(50, -13)} Q ${p(58, -10)} ${p(64, 0)} Q ${p(58, 10)} ${p(50, 13)}`; }).join(" ");
// The emblems, drawn in local units (about +-30) upright, in fine line. lit 0..1.
const Emblem: React.FC<{k: number; lit: number; f: number}> = ({k, lit, f}) => {
  const col = mix("#C9A060", "#FFF4D6", lit), sw = 1.6 + 0.8 * lit, fillO = 0.15 + 0.75 * lit;
  const common = {fill: "none", stroke: col, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const};
  if (k === 0) {   // sun and the sacrificial fire
    const rays: string[] = []; for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, r0 = 19, r1 = i % 2 ? 25 : 29; rays.push(`M ${n1(Math.cos(a) * r0)} ${n1(Math.sin(a) * r0)} L ${n1(Math.cos(a) * r1)} ${n1(Math.sin(a) * r1)}`); }
    const fl = flameD(0, 9, 22 + 2 * Math.sin(f / 6), 6, 0.04 * Math.sin(f / 9), 0.05, f / 5);
    return <g><circle r={15} {...common}/><path d={rays.join(" ")} {...common}/><path d={fl} fill={col} fillOpacity={fillO} stroke={col} strokeWidth={sw * 0.7}/><path d="M -9 11 L 9 11" {...common}/></g>;
  }
  if (k === 1) {   // cloud and rain
    const cloud = smooth([[-26, -4], [-24, -12], [-15, -15], [-10, -24], [0, -27], [9, -23], [13, -17], [22, -18], [27, -10], [25, -3], [12, 0, "c"], [-12, 0, "c"]]);
    const rain = [-16, -7, 2, 11, 20].map((x, i) => { const o = ((f / 3 + i * 5) % 12); return `M ${x} ${6 + o * 0.6} L ${x - 4} ${14 + o * 0.6}`; }).join(" ");
    return <g><path d={cloud} {...common} fill={col} fillOpacity={fillO * 0.6}/><path d={rain} {...common}/></g>;
  }
  if (k === 2) {   // sprouting grain: three stalks from the earth, the middle ear bowing heavy with grain
    const grains = Array.from({length: 8}, (_, i) => { const t = i / 7, x = 2 + t * 15 + t * t * 3, y = -24 + t * t * 20, ang = 10 + t * 70; return <ellipse key={i} cx={n1(x + (i % 2 ? 2.6 : -2.6) * Math.cos((ang * Math.PI) / 180))} cy={n1(y - (i % 2 ? 2.6 : -2.6) * Math.sin((ang * Math.PI) / 180) * 0.4)} rx={3.6} ry={1.9} transform={`rotate(${n1(ang + (i % 2 ? -25 : 25))} ${n1(x)} ${n1(y)})`} fill={col} fillOpacity={0.3 + 0.7 * lit} stroke={col} strokeWidth={sw * 0.45}/>; });
    return <g><path d="M -24 24 Q 0 19 24 24" {...common}/>
      <path d="M 0 24 C 0 8 -1 -10 2 -24 C 10 -26 16 -18 20 -4" {...common}/>
      <path d="M -6 24 C -8 12 -14 2 -18 -10 M 6 24 C 9 14 13 8 18 2" {...common} strokeWidth={sw * 0.8}/>
      <path d="M -1 16 C -10 12 -18 10 -24 2 C -16 4 -8 8 -1 12 Z M 1 8 C 8 4 13 -2 15 -10 C 9 -4 5 0 1 4 Z" fill={col} fillOpacity={fillO * 0.7} stroke={col} strokeWidth={sw * 0.6}/>
      {grains}
      {[-18, 18].map((x, i) => <ellipse key={i} cx={x} cy={i ? 0 : -12} rx={1.8} ry={3.4} transform={`rotate(${i ? 30 : -25} ${x} ${i ? 0 : -12})`} fill={col} fillOpacity={0.3 + 0.7 * lit} stroke="none"/>)}
    </g>;
  }
  // a bowl of food, a little steam
  const steam = [-8, 0, 8].map((x, i) => { const p = Math.sin(f / 12 + i) * 2; return `M ${x} -14 C ${x - 4 + p} -18 ${x + 4 + p} -22 ${x + p} -28`; }).join(" ");
  return <g><path d="M -26 2 C -24 16 -12 22 0 22 C 12 22 24 16 26 2 Z" {...common} fill={col} fillOpacity={fillO * 0.5}/><path d="M -8 22 L -10 27 L 10 27 L 8 22" {...common}/>
    <path d="M -20 2 C -16 -10 -6 -14 0 -14 C 6 -14 16 -10 20 2" {...common} fill={col} fillOpacity={fillO}/><path d={steam} {...common} strokeWidth={sw * 0.8} opacity={0.4 + 0.6 * lit}/></g>;
};
const WheelScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const labels = labelsOf(s), mood = moodOf(s, "night");
  const BG: Record<Mood, [string, string, string]> = {night: ["#241A48", K.indigo, K.night], dusk: ["#3A2048", "#24143A", "#0C0614"], dawn: ["#2A2E5A", "#1A1C40", "#0A0A1C"], gold: ["#3E2638", "#2A1828", "#0E080E"]};
  const C: V2 = [960, 524], R = 350;
  const z = push(f, n, 1, 1.04);
  // clockwise, every emblem passing the top once per beat; the wheel slows a little as each comes to the top
  const r0 = -30 + f * (330 / Math.max(90, n)), rot = r0 - ((90 * 0.45) / (2 * Math.PI)) * Math.sin((2 * Math.PI * r0) / 90);
  const EMB = [0, 270, 180, 90];                                   // fire, rain, grain, food: each comes to the top in that order
  const lit = EMB.map((a) => { let d = (((a + rot) % 360) + 360) % 360; if (d > 180) d -= 360; return bump(d, 0, 30); });
  const topCol = seasonAt(-rot);
  // the wheel's ornament, in wheel coordinates
  const beads: string[] = [], petals: string[] = [], cusps: string[] = [], studs: string[] = [];
  for (let i = 0; i < 72; i++) { const [x, y] = polar(0, 0, R - 15, (i / 72) * 360); beads.push(circ(x, y, 2.6)); }
  for (let i = 0; i < 48; i++) { const a0 = (i / 48) * 360, a1 = ((i + 1) / 48) * 360, [x0, y0] = polar(0, 0, R - 30, a0), [x1, y1] = polar(0, 0, R - 30, a1), [xm, ym] = polar(0, 0, R - 46, (a0 + a1) / 2); petals.push(`M ${n1(x0)} ${n1(y0)} Q ${n1(xm)} ${n1(ym)} ${n1(x1)} ${n1(y1)}`); }
  for (let i = 0; i < 16; i++) {
    const a0 = (i / 16) * 360 + 3, a1 = ((i + 1) / 16) * 360 - 3, am = (a0 + a1) / 2, r0 = R - 46;
    const p = (r: number, a: number) => polar(0, 0, r, a).map(n1).join(" ");
    cusps.push(`M ${p(r0, a0)} C ${p(r0 - 18, a0)} ${p(r0 - 24, am - 3)} ${p(r0 - 36, am)} C ${p(r0 - 24, am + 3)} ${p(r0 - 18, a1)} ${p(r0, a1)}`);
  }
  for (let i = 0; i < 16; i++) { const [x, y] = polar(0, 0, 84, (i / 16) * 360 + 11.25); studs.push(circ(x, y, 2.4)); }
  const hubPetals: string[] = [];
  for (let i = 0; i < 16; i++) { const a = (i / 16) * 360, p = (r: number, d: number) => polar(0, 0, r, a + d).map(n1).join(" "); hubPetals.push(`M ${p(54, -9)} Q ${p(68, -8)} ${p(76, 0)} Q ${p(68, 8)} ${p(54, 9)}`); }
  // spokes: eight broad ones with a carved medallion halfway, eight fine ones with a bead
  const R0 = 92, R1 = R - 46, RM = (R0 + R1) / 2;
  const spoke = (a: number, wA: number, wB: number, gap: number) => {
    const P = (r: number, w: number) => { const [x, y] = polar(0, 0, r, a), q = ((a + 90) * Math.PI) / 180; return [x + Math.sin(q) * w, y - Math.cos(q) * w]; };
    const seg = (ra: number, rb: number) => [-1, 1].map((sd) => { const pa = P(ra, sd * lerp(wA, wB, (ra - R0) / (R1 - R0)) / 2), pb = P(rb, sd * lerp(wA, wB, (rb - R0) / (R1 - R0)) / 2); return `M ${n1(pa[0])} ${n1(pa[1])} L ${n1(pb[0])} ${n1(pb[1])}`; }).join(" ");
    return gap > 0 ? seg(R0, RM - gap) + " " + seg(RM + gap, R1) : seg(R0, R1);
  };
  const major: string[] = [], minor: string[] = [], meds: React.ReactNode[] = [];
  for (let i = 0; i < 8; i++) {
    const a = i * 45; major.push(spoke(a, 30, 20, 30));
    const [mx, my] = polar(0, 0, RM, a);
    meds.push(<g key={i} transform={`translate(${n1(mx)} ${n1(my)}) rotate(${a})`}>
      <circle r={30}/><circle r={24} strokeWidth={0.9} opacity={0.7}/>
      {Array.from({length: 8}, (_, j) => <path key={j} d="M 0 -4 C 5 -9 4 -17 0 -21 C -4 -17 -5 -9 0 -4 Z" transform={`rotate(${j * 45})`} strokeWidth={1}/>)}
      <circle r={3.2} fill={GOLD} stroke="none"/>
    </g>);
    // cross bands along the broad spoke
    [R0 + 26, R1 - 22].forEach((r, j) => { const w = lerp(30, 20, (r - R0) / (R1 - R0)) / 2, q = ((a + 90) * Math.PI) / 180, [x, y] = polar(0, 0, r, a); major.push(`M ${n1(x - Math.sin(q) * w)} ${n1(y + Math.cos(q) * w)} L ${n1(x + Math.sin(q) * w)} ${n1(y - Math.cos(q) * w)}`); });
    minor.push(spoke(a + 22.5, 8, 6, 9));
    const [bx, by] = polar(0, 0, RM + 20, a + 22.5); minor.push(circ(bx, by, 8));
  }
  // seasons: a ring of soft colour round the rim, each patch the colour of its season
  const ringN = 24;
  return (
    <Frame f={f} zoom={z} cx={C[0]} cy={C[1]}>
      <PaDefs/>
      <defs>
        <radialGradient id="wh-bg" cx="0.5" cy="0.48" r="0.75"><stop offset="0" stopColor={BG[mood][0]}/><stop offset="0.5" stopColor={BG[mood][1]}/><stop offset="1" stopColor={BG[mood][2]}/></radialGradient>
        <radialGradient id="wh-tint"><stop offset="0" stopColor={topCol} stopOpacity={0.42}/><stop offset="0.6" stopColor={topCol} stopOpacity={0.08}/><stop offset="1" stopColor={topCol} stopOpacity={0}/></radialGradient>
        {Array.from({length: ringN}, (_, i) => { const c = seasonAt((i / ringN) * 360); return <radialGradient key={i} id={`wh-s${i}`}><stop offset="0" stopColor={c} stopOpacity={0.55}/><stop offset="0.5" stopColor={c} stopOpacity={0.18}/><stop offset="1" stopColor={c} stopOpacity={0}/></radialGradient>; })}
        <radialGradient id="wh-lit"><stop offset="0" stopColor="#C88A3A" stopOpacity={0.95}/><stop offset="0.55" stopColor="#7A4A2A" stopOpacity={0.8}/><stop offset="1" stopColor="#3A2230" stopOpacity={0.5}/></radialGradient>
        <radialGradient id="wh-beam"><stop offset="0" stopColor="#FFE9B8" stopOpacity={0.2}/><stop offset="0.5" stopColor="#FFE9B8" stopOpacity={0.08}/><stop offset="1" stopColor="#FFE9B8" stopOpacity={0}/></radialGradient>
      </defs>
      <rect x={-40} y={-40} width={W + 80} height={H + 80} fill="url(#wh-bg)"/>
      <ellipse cx={C[0]} cy={C[1]} rx={900} ry={620} fill="url(#wh-tint)"/>
      {/* faint outer rings of the yantra, still */}
      <g fill="none" stroke={GOLD} opacity={0.16}>
        <circle cx={C[0]} cy={C[1]} r={R + 62} strokeWidth={1}/><circle cx={C[0]} cy={C[1]} r={R + 70} strokeWidth={0.8}/>
        <circle cx={C[0]} cy={C[1]} r={R + 96} strokeWidth={1} strokeDasharray="1 10"/>
      </g>
      {/* the light from above that kindles each emblem as it comes to the top */}
      <ellipse cx={C[0]} cy={40} rx={110} ry={C[1] - R + 60} fill="url(#wh-beam)" opacity={0.6 + 0.4 * Math.max(...lit)}/>
      <circle cx={C[0]} cy={C[1] - R + 14} r={150} fill="url(#pa-warm)" opacity={0.25 + 0.45 * Math.max(...lit)}/>
      <g transform={`translate(${C[0]} ${C[1]}) rotate(${n1(rot)})`}>
        {Array.from({length: ringN}, (_, i) => { const [x, y] = polar(0, 0, R + 8, (i / ringN) * 360); return <circle key={i} cx={x} cy={y} r={120} fill={`url(#wh-s${i})`} opacity={0.85}/>; })}
        <circle r={R - 50} fill="url(#pa-soft)" opacity={0.25}/>
        <g fill="none" stroke={GOLD} strokeLinecap="round">
          <circle r={R + 16} strokeWidth={1} strokeDasharray="2 9" opacity={0.6}/>
          <circle r={R} strokeWidth={2.2}/><circle r={R - 30} strokeWidth={1.5}/><circle r={R - 46} strokeWidth={1.1} opacity={0.8}/>
          <path d={petals.join(" ")} strokeWidth={1} opacity={0.75}/>
          <path d={cusps.join(" ")} strokeWidth={1.1} opacity={0.85}/>
          <path d={major.join(" ")} strokeWidth={1.6}/>
          <path d={minor.join(" ")} strokeWidth={1.1} opacity={0.85}/>
          {meds}
          <circle r={R0} strokeWidth={1.8}/><circle r={76} strokeWidth={1.1}/><circle r={54} strokeWidth={1.3}/><circle r={30} strokeWidth={1.6}/>
          <path d={hubPetals.join(" ")} strokeWidth={1.1}/>
          {Array.from({length: 8}, (_, i) => { const [x, y] = polar(0, 0, 28, i * 45); return <path key={i} d={`M 0 0 L ${n1(x)} ${n1(y)}`} strokeWidth={1} opacity={0.7}/>; })}
        </g>
        <path d={beads.join(" ")} fill={GOLD} opacity={0.85}/>
        <path d={studs.join(" ")} fill={GOLD} opacity={0.8}/>
        <circle r={9} fill="#FFE9B8"/>
        <circle r={40} fill="url(#pa-warm)" opacity={0.6}/>
        {/* the four emblems on the rim */}
        {EMB.map((a, k) => {
          const [x, y] = polar(0, 0, R - 15, a), L = lit[k];
          return <g key={k} transform={`translate(${n1(x)} ${n1(y)}) rotate(${a})`}>
            <circle r={190} fill="url(#pa-warm)" opacity={L}/>
            <circle r={90} fill="url(#pa-clear)" opacity={0.35 * L}/>
            <circle r={60} fill="#120C26"/>
            <path d={MED_PETALS} fill="none" stroke={mix(GOLD, "#FFF0C8", L)} strokeWidth={1} opacity={0.75 + 0.25 * L}/>
            <circle r={50} fill="#120C26"/>
            <circle r={50} fill="url(#wh-lit)" opacity={L}/>
            <circle r={50} fill="none" stroke={mix(GOLD, "#FFF0C8", L)} strokeWidth={1.8 + L}/>
            <circle r={44} fill="none" stroke={GOLD} strokeWidth={0.8} strokeDasharray="1.5 4" opacity={0.8}/>
            <g transform="scale(1.12)"><Emblem k={k} lit={L} f={f}/></g>
          </g>;
        })}
      </g>
      {/* a light runs round the rim ahead of the turning, trailing the colour of each season it passes */}
      <circle cx={polar(C[0], C[1], R + 16, f * (720 / Math.max(90, n)))[0]} cy={polar(C[0], C[1], R + 16, f * (720 / Math.max(90, n)))[1]} r={40} fill="url(#pa-warm)" opacity={0.7}/>
      {Array.from({length: 44}, (_, j) => { const a = (f * (720 / Math.max(90, n)) - j * 0.75) % 360, [x, y] = polar(C[0], C[1], R + 16, a); return <circle key={j} cx={x} cy={y} r={3.4 - j * 0.065} fill={mix("#FFF4D6", seasonAt(a - rot), j / 30)} opacity={0.8 * Math.pow(1 - j / 44, 1.5)}/>; })}
      {labels.slice(0, 4).map((w, k) => w && lit[k] > 0.05 ? <text key={k} x={C[0] + 74} y={C[1] - R - 8} fontFamily={CAPS} fontSize={22} letterSpacing={6} fill={K.goldLt} opacity={lit[k]}>{w}</text> : null)}
      <Dust f={f} sun={[C[0], C[1] - R]} n={110} y0={120} y1={980}/>
    </Frame>
  );
};

export const SCENES: Record<string, React.FC<SceneP>> = {"two-roads": TwoRoads, gunas: GunasScene, ashvattha: AshvatthaScene, wheel: WheelScene};
