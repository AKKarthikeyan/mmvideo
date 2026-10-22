// Katha metaphor scenes: threads (22 Oct 2026; art director's fix round 1, 22 Oct 2026). Worn garments cast off for new
// ones (2.22), all strung on Me like pearls on a thread (7.7, and the thread revealed), the offering of a leaf, a flower,
// a fruit, water (9.26), the sword of knowledge cutting the tangle of doubt (4.42). Lamplight look: near-black shapes
// rimmed with warm light, light the only colour. Soft light, glow, haze and smoke are radial / linear gradients only (no
// blur or turbulence filters). One flame model (fire.tsx), Indian flora (flora.tsx) and architecture (arch.tsx), one
// light per shot, words only through stage.tsx's Label in Frame's overlay; nothing solid ever fades to a ghost (it burns
// away, breaks into flakes, or changes inside a flash of light).
// Props: every scene reads s.mood ("dusk" | "dawn" | "night" | "gold") and s.variant, and renders from {type, kind} alone.
//   garments: no extra props. pearls: s.variant "thread" dims the pearls and lights the thread running through them.
//   offering: s.at (four 0-1 fractions: when the leaf, flower, fruit and water arrive); s.labels (optional, up to four
//   words, e.g. पत्रं पुष्पं फलं तोयं: one Label line, each word lit as its offering arrives). sword: s.variant "knot"
//   makes the tangle a knot of black thread instead of thorny vines; s.at (optional 0-1 fraction: when the blade sweeps).
import React, {useId} from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {K, W, H, softStops} from "../look";
import {SceneP, Frame, push, Label} from "../stage";
import {Sky, Dust, Mood, LightFlash} from "../sky";
import {smooth, ribbon, rnd, lerp, clamp01, nrmAt, polyD, band, Pt} from "../geom";
import {Rimmed} from "../sil";
import {coconut, palmyra, reeds, SIL_FAR} from "../flora";
import {niche, pillar, ledge} from "../arch";
import {Diya, diyaWick} from "../fire";

type V2 = [number, number];
// ---------- small helpers ----------
const uid = () => "th" + useId().replace(/[^a-zA-Z0-9]/g, "");
const sstep = (v: number) => { const t = clamp01(v); return t * t * (3 - 2 * t); };
const ease = (f: number, a: number, d: number) => interpolate(f, [a, a + Math.max(0.001, d)], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
const wob = (t: number, s = 0) => Math.sin(t + s * 1.7) * 0.5 + Math.sin(t * 2.31 + s * 3.1) * 0.3 + Math.sin(t * 4.07 + s * 5.3) * 0.2;
const MOODS: Mood[] = ["dusk", "dawn", "night", "gold"];
const moodOf = (s: any, d: Mood): Mood => (MOODS.includes(s?.mood) ? s.mood : d);
const isDeva = (t: string) => /[ऀ-ॿ]/.test(t);
const n1 = (v: number) => v.toFixed(1);
const lineD = (pts: number[][]) => "M " + pts.map((p) => `${n1(p[0])} ${n1(p[1])}`).join(" L ");
const hx = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => { const A = hx(a), B = hx(b), k = clamp01(t); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, "0")).join(""); };
// Open Catmull-Rom polyline through control points, k samples per segment.
const dense = (pts: number[][], k = 10): V2[] => {
  const n = pts.length, out: V2[] = [], P = (i: number) => pts[Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < n - 1; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    for (let j = 0; j < k; j++) {
      const t = j / k, t2 = t * t, t3 = t2 * t;
      const c = (q: number) => 0.5 * (2 * p1[q] + (-p0[q] + p2[q]) * t + (2 * p0[q] - 5 * p1[q] + 4 * p2[q] - p3[q]) * t2 + (-p0[q] + 3 * p1[q] - 3 * p2[q] + p3[q]) * t3);
      out.push([c(0), c(1)]);
    }
  }
  out.push([pts[n - 1][0], pts[n - 1][1]]);
  return out;
};
const cumLen = (pts: number[][]) => { const c = [0]; for (let i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return c; };
const atLen = (pts: number[][], cum: number[], s: number): V2 => {
  if (s <= 0) return [pts[0][0], pts[0][1]];
  const L = cum[cum.length - 1]; if (s >= L) return [pts[pts.length - 1][0], pts[pts.length - 1][1]];
  let lo = 0, hi = cum.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] < s) lo = m; else hi = m; }
  const u = (s - cum[lo]) / Math.max(1e-6, cum[hi] - cum[lo]);
  return [lerp(pts[lo][0], pts[hi][0], u), lerp(pts[lo][1], pts[hi][1], u)];
};
// A soft light: an ellipse filled with a shared radial gradient.
const Glow: React.FC<{x: number; y: number; rx: number; ry?: number; g?: string; o?: number; tr?: string}> = ({x, y, rx, ry, g = "th-warm", o = 1, tr}) =>
  o <= 0.002 || rx <= 0 ? null : <ellipse cx={x} cy={y} rx={rx} ry={ry ?? rx} fill={`url(#${g})`} opacity={Math.min(1, o)} transform={tr}/>;
// Shared gradients for every scene in this family.
const ThreadDefs: React.FC = () => (
  <defs>
    <radialGradient id="th-warm"><stop offset="0" stopColor="#FFEFC4" stopOpacity={0.8}/><stop offset="0.2" stopColor="#FFC877" stopOpacity={0.4}/><stop offset="0.5" stopColor="#F0904A" stopOpacity={0.12}/><stop offset="1" stopColor="#C2553A" stopOpacity={0}/></radialGradient>
    <radialGradient id="th-soft"><stop offset="0" stopColor="#FFC877" stopOpacity={0.5}/><stop offset="0.5" stopColor="#E8904A" stopOpacity={0.18}/><stop offset="1" stopColor="#C2553A" stopOpacity={0}/></radialGradient>
    <radialGradient id="th-hot"><stop offset="0" stopColor="#FFFDF2"/><stop offset="0.3" stopColor="#FFE9B8" stopOpacity={0.75}/><stop offset="1" stopColor="#FFC877" stopOpacity={0}/></radialGradient>
    <radialGradient id="th-mote"><stop offset="0" stopColor="#FFF4D6"/><stop offset="0.25" stopColor="#FFE2A8" stopOpacity={0.55}/><stop offset="1" stopColor="#FFD38A" stopOpacity={0}/></radialGradient>
    <radialGradient id="th-shade"><stop offset="0" stopColor="#030108" stopOpacity={0.85}/><stop offset="0.5" stopColor="#030108" stopOpacity={0.45}/><stop offset="1" stopColor="#030108" stopOpacity={0}/></radialGradient>
    <radialGradient id="th-blue"><stop offset="0" stopColor="#6F8CFF" stopOpacity={0.85}/><stop offset="1" stopColor="#3D5BD0" stopOpacity={0}/></radialGradient>
    <linearGradient id="th-down" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#030108" stopOpacity={0.6}/><stop offset="1" stopColor="#030108" stopOpacity={0}/></linearGradient>
  </defs>
);

// =====================================================================================================================
// 2.22 GARMENTS: on a line between two bamboo poles at the river, a threadbare robe slips from one peg and burns away
// from the hem, a charred edge with an ember rim creeping up it and ash flakes lifting on the warm wind, until only the
// peg is left. Out of the light above, a new saffron cloth comes down folded, is taken up by three pegs and falls open
// fold by fold; the low sun shines through its weave and the wind lifts its hem. The camera pushes in to centre it.
// =====================================================================================================================
type ClothFn = (u: number, v: number) => V2;
type ClothLook = {dark: string; mid: string; lit: string; edge: string; edgeOp: number;
  trans?: {c: string; o: number; cx: number; cy: number; r: number};    // the sun's light coming through the cloth
  disc?: {x: number; y: number; r: number; o: number};                   // the sun's disc seen through it
  border?: {c: string; o: number; v0: number; v1: number; line?: string};
  weave?: number};                                                      // the threads, dark against the light behind
// The outline of a cloth through its grid (corners kept sharp), and one strip of it.
const clothOutline = (fn: ClothFn, nu: number, nv: number): string => {
  const p: Pt[] = [];
  for (let i = 0; i <= nu; i++) { const q = fn(i / nu, 0); p.push(i === 0 || i === nu ? [q[0], q[1], "c"] : q); }
  for (let j = 1; j < nv; j++) p.push(fn(1, j / nv));
  for (let i = nu; i >= 0; i--) { const q = fn(i / nu, 1); p.push(i === 0 || i === nu ? [q[0], q[1], "c"] : q); }
  for (let j = nv - 1; j >= 1; j--) p.push(fn(0, j / nv));
  return smooth(p);
};
const clothStrip = (fn: ClothFn, u0: number, u1: number, nv: number): string => {
  const p: Pt[] = [];
  for (let j = 0; j <= nv; j++) { const q = fn(u0, j / nv); p.push(j === 0 || j === nv ? [q[0], q[1], "c"] : q); }
  for (let j = nv; j >= 0; j--) { const q = fn(u1, j / nv); p.push(j === 0 || j === nv ? [q[0], q[1], "c"] : q); }
  return smooth(p);
};
// A band across the cloth between v0 and v1 (a woven border).
const clothBand = (fn: ClothFn, v0: number, v1: number, k = 28): string => {
  const a: number[][] = [], b: number[][] = [];
  for (let i = 0; i <= k; i++) { a.push(fn(i / k, v0)); b.push(fn(i / k, v1)); }
  return lineD([...a, ...b.reverse()]) + " Z";
};
const isoV = (fn: ClothFn, v: number, k = 28) => lineD(Array.from({length: k + 1}, (_, i) => fn(i / k, v)));
// A hanging cloth: strips that follow its drape (shade[i] in -1..1 at u = i / nu: the fold's slope), the sun's light
// through it, a woven border, the weave, a thin lit edge. out: a custom outline (a burnt edge); holes: cut by a mask.
const Cloth: React.FC<{fn: ClothFn; nu?: number; nv?: number; shade: number[]; look: ClothLook; out?: string; holes?: string[]; children?: React.ReactNode}> =
  ({fn, nu = 16, nv = 12, shade, look, out: outIn, holes, children}) => {
  const id = uid();
  const out = outIn ?? clothOutline(fn, nu, nv), jm = Math.round(nv * 0.55);
  const col = (sv: number) => (sv >= 0 ? mix(look.mid, look.lit, sv) : mix(look.mid, look.dark, -sv));
  const B = look.border, Tr = look.trans, D = look.disc;
  return (
    <g mask={holes && holes.length ? `url(#${id}m)` : undefined}>
      <defs>
        <clipPath id={`${id}k`}><path d={out}/></clipPath>
        {Array.from({length: nu}, (_, i) => { const a = fn(i / nu, jm / nv), b = fn((i + 1) / nu, jm / nv);
          return <linearGradient key={i} id={`${id}g${i}`} gradientUnits="userSpaceOnUse" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}><stop offset="0" stopColor={col(shade[i])}/><stop offset="1" stopColor={col(shade[i + 1])}/></linearGradient>; })}
        {Tr ? <radialGradient id={`${id}t`} gradientUnits="userSpaceOnUse" cx={Tr.cx} cy={Tr.cy} r={Tr.r}>{softStops(Tr.c, Tr.o, "#FFB060", 1.5)}</radialGradient> : null}
        {D ? <radialGradient id={`${id}d`} gradientUnits="userSpaceOnUse" cx={D.x} cy={D.y} r={D.r}>{softStops("#FFFCEC", 1, "#FFE3A0", 3.4)}</radialGradient> : null}
        {look.weave ? <pattern id={`${id}w`} width={2.6} height={2.6} patternUnits="userSpaceOnUse" patternTransform="rotate(-3)"><rect width={2.6} height={0.8} fill={look.dark}/><rect width={0.7} height={2.6} fill={look.dark} opacity={0.6}/></pattern> : null}
        {look.weave && Tr ? <radialGradient id={`${id}wg`} gradientUnits="userSpaceOnUse" cx={Tr.cx} cy={Tr.cy} r={Tr.r * 0.7}>{softStops("#ffffff", 1, undefined, 1.2)}</radialGradient> : null}
        {look.weave && Tr ? <mask id={`${id}wm`} maskUnits="userSpaceOnUse" x={Tr.cx - Tr.r} y={Tr.cy - Tr.r} width={Tr.r * 2} height={Tr.r * 2}><circle cx={Tr.cx} cy={Tr.cy} r={Tr.r * 0.7} fill={`url(#${id}wg)`}/></mask> : null}
        {holes && holes.length ? <mask id={`${id}m`} maskUnits="userSpaceOnUse" x={-400} y={-400} width={W + 800} height={H + 800}>
          <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#fff"/>{holes.map((d, i) => <path key={i} d={d} fill="#000"/>)}</mask> : null}
      </defs>
      <path d={out} fill={look.mid}/>
      <g clipPath={`url(#${id}k)`}>
        {Array.from({length: nu}, (_, i) => <path key={i} d={clothStrip(fn, i / nu, (i + 1) / nu, nv)} fill={`url(#${id}g${i})`} stroke={`url(#${id}g${i})`} strokeWidth={1.5}/>)}
        {B ? <>
          <path d={clothBand(fn, B.v0, B.v1)} fill={B.c} opacity={B.o}/>
          <path d={isoV(fn, B.v0 - 0.022)} fill="none" stroke={B.c} strokeWidth={1.3} opacity={B.o * 0.8}/>
          {B.line ? <path d={isoV(fn, B.v1 + 0.016)} fill="none" stroke={B.line} strokeWidth={2.2} opacity={B.o * 0.8}/> : null}
        </> : null}
        {Tr ? <path d={out} fill={`url(#${id}t)`}/> : null}
        {D ? <circle cx={D.x} cy={D.y} r={D.r} fill={`url(#${id}d)`} opacity={D.o}/> : null}
        {look.weave ? <path d={out} fill={`url(#${id}w)`} opacity={look.weave} mask={Tr ? `url(#${id}wm)` : undefined}/> : null}
        {children}
      </g>
      <path d={out} fill="none" stroke={look.edge} strokeWidth={1.5} opacity={look.edgeOp}/>
    </g>
  );
};
// Piecewise-linear value noise: an irregular profile with sharp corners (a burnt edge, not a row of scallops).
const vn = (x: number, seed: number) => { const i = Math.floor(x), t = x - i; return lerp(rnd(i, seed), rnd(i + 1, seed), t) * 2 - 1; };
const jag = (s: number, seed: number) => 0.07 * vn(s * 6, seed) + 0.042 * vn(s * 15, seed + 1) + 0.024 * vn(s * 37, seed + 2) + 0.012 * vn(s * 83, seed + 3);
// A cloth pegged to the line: x0..x1 on the line, pegs at fractions of the width (corners included), length L. Between
// two pegs the top edge sags in a swag; the cloth's strips crowd towards each peg (k), so its folds radiate from them.
type Hang = {x0: number; x1: number; pegs: number[]; L: number; swag: number; k: number};
const pegSeg = (pegs: number[], s: number) => {
  let j = 0; while (j < pegs.length - 2 && s > pegs[j + 1]) j++;
  const a = pegs[j], b = pegs[j + 1]; return {j, a, b, w: clamp01((s - a) / (b - a))};
};
const hangTop = (h: Hang, s: number, lineY: (x: number) => number, swagK = 1) => {
  const {a, b, w} = pegSeg(h.pegs, s);
  const sc = a + (b - a) * (w - (h.k * swagK * Math.sin(2 * Math.PI * w)) / (2 * Math.PI));
  const x = lerp(h.x0, h.x1, sc), xu = lerp(h.x0, h.x1, s);
  const sw = swagK * h.swag * (b - a) * (h.x1 - h.x0) * Math.pow(Math.sin(Math.PI * w), 1.25);
  return {x, xu, y: lineY(x) + 3 + sw, sw};
};
const shadeOf = (fn: (u: number) => number, nu: number, k: number, bias = 0) => Array.from({length: nu + 1}, (_, i) => { const u = i / nu, e = 0.004; return Math.max(-1, Math.min(1, -(fn(u + e) - fn(u - e)) / (2 * e) / k + bias)); });
// A wooden clothes peg on the line (drawn at the origin, the line through y = 0).
const PEG = smooth([[-5.6, -17, "c"], [5.6, -17, "c"], [6.2, -3], [4.4, 4], [5.2, 31, "c"], [-5.2, 31, "c"], [-4.4, 4], [-6.2, -3]]);
const pegItem = (x: number, y: number, a = 0): {d: string; t: string; c: [number, number]} => ({d: PEG, t: `translate(${n1(x)} ${n1(y)}) rotate(${n1(a)})`, c: [x, y + 6]});
// Ash: small irregular flakes (unit size).
const FLAKE = [
  "M -1 -0.3 L -0.25 -0.95 L 0.8 -0.55 L 1 0.35 L 0.15 0.85 L -0.75 0.6 Z",
  "M -0.9 -0.6 L 0.5 -0.9 L 1 0.1 L 0.4 0.9 L -0.3 0.5 L -1 0.4 Z",
  "M -1 0 L -0.4 -0.8 L 0.3 -0.5 L 0.9 -0.9 L 0.8 0.3 L -0.1 0.9 Z",
  "M -0.8 -0.8 L 0.9 -0.4 L 0.6 0.4 L 1 0.9 L -0.5 0.7 L -0.9 0.1 Z",
];
// A bamboo pole between base b and top t: tapered, with nodes.
const bamboo = (b: V2, t: V2, w: number): string[] => {
  const mid: V2 = [lerp(b[0], t[0], 0.5) + 4, lerp(b[1], t[1], 0.5)];
  const d = [ribbon(dense([b, mid, t], 8), w, w * 0.8)];
  for (let k = 1; k < 7; k++) {
    const u = k / 7, p: V2 = [lerp(b[0], t[0], u) + Math.sin(u * Math.PI) * 4, lerp(b[1], t[1], u)], ww = lerp(w, w * 0.8, u) * 1.22;
    d.push(ribbon([[p[0], p[1] - 3], [p[0], p[1] + 3]], ww, ww));
  }
  d.push(smooth([[t[0] - w * 0.42, t[1] + 4], [t[0] - w * 0.42, t[1] - 4, "c"], [t[0] + w * 0.44, t[1] - 14, "c"], [t[0] + w * 0.42, t[1] + 4]]));
  return d;
};
// Grass blades along a ground line, bending in the wind.
const blades = (x0: number, x1: number, yAt: (x: number) => number, f: number, k: number, hMin: number, hMax: number, seed: number, wind = 1): string => {
  let d = "";
  for (let i = 0; i < k; i++) {
    const x = lerp(x0, x1, rnd(i, seed)), y = yAt(x) + 6, h = lerp(hMin, hMax, Math.pow(rnd(i, seed + 1), 1.6)), w = 2.4 + rnd(i, seed + 2) * 3.4;
    const lean = (rnd(i, seed + 3) - 0.35) * 0.7 + wind * (0.18 + 0.1 * Math.sin(f / 26 + x / 140 + i));
    const tip: V2 = [x + Math.sin(lean) * h, y - Math.cos(lean) * h];
    const mid: V2 = [x + Math.sin(lean * 0.45) * h * 0.55, y - Math.cos(lean * 0.45) * h * 0.55];
    d += " " + ribbon(dense([[x, y], mid, tip], 4), w, 0.4);
  }
  return d;
};
// A spindle along a line: thin at both ends, widest a little before the middle (a soft fold of cloth).
const spindle = (pts: V2[], wMax: number, skew = 0.9): string => {
  const L: Pt[] = [], Rr: Pt[] = [];
  pts.forEach((p, i) => { const t = i / (pts.length - 1), w = (wMax * Math.pow(Math.sin(Math.PI * Math.pow(t, skew)), 0.6)) / 2, nn = nrmAt(pts as number[][], i); L.push([p[0] + nn[0] * w, p[1] + nn[1] * w]); Rr.push([p[0] - nn[0] * w, p[1] - nn[1] * w]); });
  return smooth([...L, ...Rr.reverse()]);
};
// Soft folds: a shade made of three nested spindles (a soft edge with no blur), and a lit line along one side.
const SoftFold: React.FC<{pts: V2[]; w: number; o?: number; lit?: number; skew?: number; c?: string}> = ({pts, w, o = 0.11, lit = 0.22, skew = 0.9, c = "#4A1206"}) => (
  <g>
    {[1, 0.62, 0.3].map((m, l) => <path key={l} d={spindle(pts, w * m, skew)} fill={c} opacity={o}/>)}
    {lit > 0 ? <path d={lineD(pts.slice(1, Math.max(3, pts.length - 3)).map((p, i) => { const nn = nrmAt(pts as number[][], i + 1); return [p[0] - nn[0] * w * 0.42, p[1] - nn[1] * w * 0.42]; }))} fill="none" stroke="#FFE2A8" strokeWidth={1.2} opacity={lit}/> : null}
  </g>
);
// The drape folds that radiate from each peg down into the cloth, dying out lower down.
const drapeFolds = (fn: ClothFn, pegs: number[], vMax: number, amp: number, seed: number): React.ReactNode[] => {
  const out: React.ReactNode[] = [];
  pegs.forEach((up, pi) => {
    const dirs = pi === 0 ? [0.1, 0.24] : pi === pegs.length - 1 ? [-0.1, -0.24] : [-0.3, -0.13, 0.11, 0.28];
    dirs.forEach((sp, j) => {
      const r = rnd(pi * 11 + j, seed), len = Math.min(vMax - 0.02, (0.4 + 0.42 * r) * (1 - Math.abs(sp) * 0.9));
      if (len < 0.05) return;
      const pts = Array.from({length: 14}, (_, i) => { const t = i / 13; return fn(up + Math.sign(sp) * 0.025 + sp * Math.pow(t, 0.62) * (0.85 + 0.3 * r), 0.03 + t * len); });
      out.push(<SoftFold key={`${pi}-${j}`} pts={pts} w={(34 + 30 * rnd(pi * 11 + j, seed + 1)) * amp} o={0.05 * amp} lit={0.12 * amp} skew={0.8}/>);
    });
  });
  return out;
};
const Garments: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), id = uid();
  const mood = moodOf(s, "dusk");
  const T = (k: number) => k * n;
  const sun: V2 = [1150, 572];
  const HZ = 742;
  const toSun = (x: number, y: number): V2 => [sun[0] - x, sun[1] - y];
  // the line between two bamboo poles, sagging a little and breathing in the wind
  const LX0 = 236, LY0 = 262, LX1 = 1694, LY1 = 256, sag = 70 + 2.5 * Math.sin(f / 47);
  const lineY = (x: number) => { const u = (x - LX0) / (LX1 - LX0); return lerp(LY0, LY1, u) + sag * 4 * u * (1 - u); };
  // ================= the old robe: threadbare; its left peg lets go, then it burns away from the hem =================
  const OH: Hang = {x0: 372, x1: 772, pegs: [0, 1], L: 372, swag: 0.06, k: 0.55};
  const slipOf = (t: number) => sstep((t - T(0.08)) / T(0.12));
  const oz = (u: number, v: number) => 0.6 * Math.sin(u * Math.PI * 1.8 + 0.5 + v * 0.9) + 0.2 * Math.sin(u * Math.PI * 3.9 + 1.3 - v * 0.7);
  const oldAt = (u: number, v: number, t: number): V2 => {
    const sl = slipOf(t), top = hangTop(OH, u, lineY);
    const g = sstep(v / 0.6), z = oz(u, v) * (0.35 + 0.65 * v) * (1 + sl * 0.5);
    let x = lerp(top.x, top.xu, g) + z * 7 + Math.sin(t / 41 + u * 2.3) * 4 * Math.pow(v, 1.5);
    let y = top.y + v * OH.L - top.sw * 0.4 * v + z * 10 * v * v;
    if (sl > 0) {
      // hanging from the right peg alone, the free side swings down
      const px = OH.x1, py = lineY(OH.x1) + 3, al = -sl * 0.6 * Math.pow(1 - u, 0.6), c = Math.cos(al), sn = Math.sin(al), dx = x - px, dy = y - py;
      x = px + dx * c - dy * sn; y = py + dx * sn + dy * c;
    }
    return [x, y];
  };
  const oldFn: ClothFn = (u, v) => oldAt(u, v, f);
  // the burn front, in the cloth's own coordinates: everything below v = front(u) is gone
  const qOf = (t: number) => clamp01((t - T(0.19)) / T(0.38));
  const frontOf = (u: number, t: number) => 1.12 + 0.32 * u - 1.8 * qOf(t) + jag(u, 7) + 0.02 * vn(u * 9 + t / 20, 19);
  const KS = 110, vmax = (u: number) => Math.max(0.004, Math.min(1, frontOf(u, f)));
  // what is left: from u0 (the first u from which the cloth is unbroken to the right peg) to the right edge
  let u0 = 1;
  for (let i = KS; i >= 0; i--) { if (frontOf(i / KS, f) <= 0.012) break; u0 = i / KS; }
  const burnt = qOf(f) >= 1 || u0 > 0.985;
  const oldOut = (() => {
    const p: Pt[] = [], nT = Math.max(2, Math.round(24 * (1 - u0))), nB = Math.max(2, Math.round(KS * (1 - u0)));
    for (let i = 0; i <= nT; i++) { const q = oldFn(lerp(u0, 1, i / nT), 0); p.push(i === 0 || i === nT ? [q[0], q[1], "c"] : q); }
    for (let j = 1; j < 8; j++) p.push(oldFn(1, (vmax(1) * j) / 8));
    for (let i = nB; i >= 0; i--) { const u = lerp(u0, 1, i / nB), q = oldFn(u, vmax(u)); p.push([q[0], q[1], "c"]); }
    if (u0 <= 0) for (let j = 7; j >= 1; j--) p.push(oldFn(0, (vmax(0) * j) / 8));
    return smooth(p);
  })();
  // holes burning through ahead of the front, and two old worn holes the light already shows through
  const HO: number[][] = [[0.26, 0.6, 0.085], [0.6, 0.44, 0.07], [0.42, 0.27, 0.06], [0.8, 0.66, 0.065], [0.14, 0.36, 0.05], [0.7, 0.2, 0.05]];
  const holePoly = (cu: number, cv: number, r: number, seed: number): V2[] => Array.from({length: 15}, (_, i) => {
    const a = (i / 15) * Math.PI * 2 + 0.3 * (rnd(i, seed) - 0.5), k = 0.45 + 0.8 * rnd(i, seed + 1);
    return oldFn(cu + Math.cos(a) * r * k * 0.93, cv + Math.sin(a) * r * k);
  });
  const holes: V2[][] = [];
  HO.forEach(([cu, cv, R], i) => { const r = R * sstep((0.24 - (frontOf(cu, f) - cv)) / 0.18); if (r > 0.004 && frontOf(cu, f) > cv - R) holes.push(holePoly(cu, cv, r, 40 + i * 7)); });
  const worn = [[0.34, 0.5, 0.026], [0.66, 0.76, 0.03]].filter(([cu, cv]) => frontOf(cu, f) > cv + 0.03).map(([cu, cv, r], i) => holePoly(cu, cv, r, 90 + i * 5));
  // the edge where it burns: runs of the front between 0 and 1, and the rims of the burning holes
  const runs: V2[][] = [];
  let run: V2[] = [];
  for (let i = 0; i <= KS; i++) { const u = i / KS, fr = frontOf(u, f); if (u >= u0 && fr > 0.004 && fr < 0.995) run.push(oldFn(u, fr)); else { if (run.length > 1) runs.push(run); run = []; } }
  if (run.length > 1) runs.push(run);
  holes.forEach((hp) => runs.push([...hp, hp[0]]));
  const charD = runs.map((r) => lineD(r)).join(" ");
  const embers: React.ReactNode[] = [];
  runs.forEach((r, ri) => {
    for (let c = 0; c < r.length - 1; c += 5) {
      const seg = r.slice(c, Math.min(r.length, c + 6)), fl = 0.55 + 0.45 * Math.sin(f / 3.1 + c * 0.9 + ri * 2.3) * Math.sin(f / 5.3 + c * 0.37);
      embers.push(<g key={`${ri}-${c}`}>
        <path d={lineD(seg)} fill="none" stroke={mix("#E0400E", "#FFA040", fl)} strokeWidth={3} strokeLinecap="round" opacity={0.9}/>
        <path d={lineD(seg)} fill="none" stroke="#FFE6A8" strokeWidth={1.1} strokeLinecap="round" opacity={0.35 + 0.6 * fl}/>
      </g>);
    }
  });
  // ash flakes and sparks let go by the front, lifting and drifting right on the warm wind, cooling, crumbling away
  const flakes: React.ReactNode[] = [];
  for (let i = 0; i < 150; i++) {
    const tb = T(0.19) + rnd(i, 501) * T(0.4), age = f - tb, life = 80 + rnd(i, 502) * 100;
    if (age < 0 || age > life) continue;
    const u = rnd(i, 503), fr = frontOf(u, tb);
    if (fr <= 0.004 || fr >= 0.995) continue;
    const b = oldAt(u, fr, tb), sp = 0.7 + rnd(i, 504);
    const x = b[0] + age * 1.15 * sp + Math.sin(age / 13 + i) * 9 * Math.min(1, age / 30);
    const y = b[1] - age * (0.42 + 0.6 * rnd(i, 505)) - age * age * 0.0016;
    const spark = i % 5 === 0, cool = clamp01(age / ((spark ? 40 : 18) + 22 * rnd(i, 506)));
    const k = 1 - sstep((age - life * 0.62) / (life * 0.38));
    if (spark) { flakes.push(<g key={i}><circle cx={x} cy={y} r={7 * k} fill="url(#th-mote)" opacity={0.9 * (1 - cool)}/><circle cx={x} cy={y} r={1.3 * k} fill={mix("#FFF0C0", "#E0602A", cool)}/></g>); continue; }
    const sz = (2.4 + 5.2 * rnd(i, 507)) * k, rot = rnd(i, 508) * 360 + age * (2 + 5 * rnd(i, 509)) * (i % 2 ? 1 : -1), tum = 0.25 + 0.75 * Math.abs(Math.cos(age / (7 + 6 * rnd(i, 510)) + i));
    if (sz < 0.3) continue;
    const fill = mix(mix("#FFB050", "#9A3216", Math.min(1, cool * 1.6)), "#3C3036", sstep((cool - 0.35) / 0.65));
    flakes.push(<g key={i} transform={`translate(${n1(x)} ${n1(y)}) rotate(${n1(rot)}) scale(${sz.toFixed(2)} ${(sz * tum).toFixed(2)})`}>
      {cool < 0.6 ? <circle r={2.4} fill="url(#th-mote)" opacity={0.7 * (1 - cool / 0.6)}/> : null}
      <path d={FLAKE[i % 4]} fill={fill}/>
      {cool < 0.9 ? <path d={FLAKE[i % 4]} fill="none" stroke="#FF8A3A" strokeWidth={0.22} opacity={1 - cool}/> : null}
    </g>);
  }
  // a frayed hem while it lasts
  const fray = Array.from({length: 26}, (_, i) => {
    const u = (i + rnd(i, 71) * 0.8) / 26; if (frontOf(u, f) < 1.02) return "";
    const p = oldFn(u, 1), L = 8 + rnd(i, 72) * 22, sw = Math.sin(f / 23 + i) * 4;
    return `M ${n1(p[0])} ${n1(p[1] - 2)} Q ${n1(p[0] + sw * 0.5 + 2)} ${n1(p[1] + L * 0.5)} ${n1(p[0] + sw + (rnd(i, 73) - 0.5) * 6)} ${n1(p[1] + L)}`;
  }).join(" ");
  const oldShade = shadeOf((u) => oz(u, 0.6), 22, 7, -0.1).map((q) => q * 0.45);
  const oldLook: ClothLook = {dark: "#200C0C", mid: "#5A2C18", lit: "#94522A", edge: "#E8B078", edgeOp: 0,
    trans: {c: "#F0A060", o: 0.32, cx: sun[0] - 300, cy: sun[1] - 60, r: 460}, border: {c: "#8A5A2A", o: 0.35, v0: 0.86, v1: 0.88}, weave: 0.3};
  // ================= the new cloth: comes down folded out of the light, is pegged, falls open fold by fold =================
  const NH: Hang = {x0: 905, x1: 1395, pegs: [0, 0.5, 1], L: 456, swag: 0.1, k: 0.72};
  const arr = sstep((f - T(0.22)) / T(0.16)), land = sstep((f - T(0.365)) / T(0.05));
  const th1 = Math.PI * sstep((f - T(0.4)) / T(0.075)), th2 = Math.PI * sstep((f - T(0.475)) / T(0.075));
  const c1 = Math.max(0, -Math.cos(th1)), c2 = Math.max(0, -Math.cos(th2));
  const open = sstep((f - T(0.5)) / T(0.14)), wind = sstep((f - T(0.52)) / T(0.3)), ph = f * 0.045;
  const P3 = NH.L / 3;
  const dOf = (v: number) => (v <= 1 / 3 ? v * NH.L : v <= 2 / 3 ? P3 + (v - 1 / 3) * NH.L * c1 : P3 + P3 * c1 + (v - 2 / 3) * NH.L * c2);
  const nz = (u: number, v: number) => 0.5 * Math.sin(2 * Math.PI * 1.35 * u + 0.5 * Math.sin(ph * 0.7) + v * 0.9) + 0.16 * Math.sin(2 * Math.PI * 2.8 * u + 1.1 - ph * 0.8 + v * 1.8) + wind * 0.4 * Math.sin(Math.PI * 1.4 * u - ph * 1.5 + v * 2.4);
  const settle = 0.3 + 0.7 * open;
  const dropY = -(1 - arr) * 760, dropX = -(1 - arr) * 120, dropA = (1 - arr) * 0.12 * Math.sin(f / 13);
  const newAt = (u: number, v: number): V2 => {
    const top = hangTop(NH, u, lineY, land);
    const d = dOf(v), vv = d / NH.L, g = sstep(vv / 0.6);
    const z = nz(u, vv) * (0.3 + 0.7 * vv) * settle;
    let x = lerp(top.x, top.xu, g) + z * 8;
    let y = top.y + d - top.sw * 0.4 * Math.min(1, vv * 2) + z * 12 * vv * vv;
    // the warm wind fills it: the lower cloth billows downwind and the hem lifts in a curve
    x += wind * (76 * Math.pow(vv, 1.6) * (0.78 + 0.22 * Math.sin(ph + u * 1.4)) + 13 * vv * Math.sin(vv * 5 - ph * 1.7 + u * 2.4));
    y -= wind * 40 * vv * vv * (0.55 + 0.45 * Math.sin(ph * 1.1 + 1 + u * 2.2));
    x += (1 - wind) * Math.sin(f / 45 + u * 2) * 3 * vv;
    // while it is still in the air it is a soft bundle: its ends droop, its middle bows up a little
    y += (1 - land) * (34 * Math.pow(Math.abs(u - 0.5) * 2, 2.2) - 10 * Math.sin(Math.PI * u) + 9 * Math.sin(u * 8 - f / 6) * (0.4 + vv));
    x += (1 - land) * 14 * vv * Math.sin(u * 5 - f / 8);
    if (arr < 1) {
      // still coming down: turning a little about the middle of its top edge
      const px = 1150, py = lineY(1150), c = Math.cos(dropA), sn = Math.sin(dropA), dx = x - px, dy = y - py;
      x = px + dx * c - dy * sn + dropX; y = py + dx * sn + dy * c + dropY;
    }
    return [x, y];
  };
  const sub = (v0: number, v1: number): ClothFn => (u, v) => newAt(u, lerp(v0, v1, v));
  const newShade = shadeOf((u) => nz(u, 0.6), 30, 9).map((q) => q * 0.55 * settle);
  const lookN = (k: number): ClothLook => ({dark: "#5A160A", mid: mix("#B44A16", "#5A1A0C", k), lit: mix("#E88434", "#A04A1E", k), edge: "#FFE3A3", edgeOp: 0.5 * (1 - k * 0.6),
    trans: {c: "#FFF2CC", o: 0.95 * (1 - k * 0.7), cx: sun[0], cy: sun[1], r: 430}, disc: {x: sun[0], y: sun[1], r: 92, o: 0.8 * (1 - k)}, weave: 0.24});
  const full = th2 >= Math.PI - 1e-3;
  const borderFull = {c: "#E8B04E", o: 0.7, v0: 0.902, v1: 0.914, line: "#7A1E10"};
  // the cowl folds that hang in each swag between two pegs
  const swagFolds = land > 0.05 ? [0.035, 0.1, 0.19].map((v0, k) => {
    if (v0 + 0.15 > (full ? 1 : th1 >= Math.PI / 2 ? 2 / 3 : 1 / 3) + 0.1) return null;
    const segs = [[0, 0.5], [0.5, 1]].map(([a, b]) => Array.from({length: 15}, (_, i) => { const w = i / 14, u = lerp(a, b, w); return newAt(u, v0 + (0.05 + 0.045 * k) * Math.sin(Math.PI * w) * land); }));
    return <g key={k} opacity={land}>{segs.map((sg, j) => <SoftFold key={j} pts={sg} w={24 - 5 * k} o={0.08} lit={0.16} skew={1}/>)}</g>;
  }) : null;
  const vVis = full ? 1 : th1 >= Math.PI / 2 ? (th2 >= Math.PI / 2 ? 1 : 2 / 3) : 1 / 3;
  const drape = land > 0.05 ? <g opacity={land}>
    {drapeFolds(newAt, NH.pegs, Math.min(vVis, 0.95), 0.6 + 0.4 * open, 29)}
    <path d={isoV(newAt, 0.012, 40)} fill="none" stroke="#3A0C04" strokeWidth={3} opacity={0.35}/>
  </g> : null;
  // the fresh creases where it was folded, slowly shaken out by the wind
  const creases = full ? [1 / 3, 2 / 3].map((v, k) => <g key={k} opacity={0.8 * (1 - 0.6 * wind)}>
    <SoftFold pts={Array.from({length: 17}, (_, i) => newAt(0.02 + 0.96 * (i / 16), v))} w={9} o={0.07} lit={0.16} skew={1}/>
  </g>) : null;
  const newCloth = full
    ? <Cloth fn={newAt} nu={30} nv={14} shade={newShade} look={{...lookN(0), border: borderFull}}>{drape}{swagFolds}{creases}</Cloth>
    : <>
      {th1 < Math.PI / 2 ? [2, 1].map((k) => <path key={k} d={clothOutline(sub(0, 1 / 3), 30, 5)} transform={`translate(${n1(k * 1.5)} ${n1(k * 4.5)})`} fill={k === 2 ? "#5A1A0C" : "#8A2E12"} stroke="#FFD08A" strokeWidth={1} strokeOpacity={0.45}/>) : null}
      {th1 >= Math.PI / 2 && th2 < Math.PI / 2 ? <path d={clothOutline(sub(1 / 3, 2 / 3), 30, 5)} transform="translate(1.5 4.5)" fill="#6A2010" stroke="#FFD08A" strokeWidth={1} strokeOpacity={0.4}/> : null}
      <Cloth fn={sub(0, 1 / 3)} nu={30} nv={5} shade={newShade} look={lookN(0)}>{drape}{swagFolds}
        {th1 < Math.PI / 2 ? <>
          {[[0.14, 0.32], [0.46, 0.6], [0.7, 0.9]].map(([a, b], i) => <SoftFold key={i} pts={Array.from({length: 9}, (_, j) => sub(0, 1 / 3)(lerp(a, b, j / 8), 0.12 + 0.8 * (j / 8)))} w={26} o={0.055} lit={0.12}/>)}
          <path d={clothOutline(sub(0, 1 / 3), 30, 5)} fill={`url(#${id}bl)`}/>
        </> : null}
        {th1 < Math.PI / 2 ? <path d={isoV(sub(0, 1 / 3), 0.985)} fill="none" stroke="#FFD890" strokeWidth={3.5} opacity={0.55}/> : null}</Cloth>
      {th1 >= Math.PI / 2 ? <Cloth fn={sub(1 / 3, 2 / 3)} nu={30} nv={5} shade={newShade} look={lookN(0.75 * (1 - c1))}>
        {th2 < Math.PI / 2 ? <path d={isoV(sub(1 / 3, 2 / 3), 0.985)} fill="none" stroke="#FFD890" strokeWidth={3.5} opacity={0.5 * c1}/> : null}</Cloth> : null}
      {th2 >= Math.PI / 2 ? <Cloth fn={sub(2 / 3, 1)} nu={30} nv={5} shade={newShade} look={{...lookN(0.75 * (1 - c2)), border: {...borderFull, v0: (borderFull.v0 - 2 / 3) * 3, v1: (borderFull.v1 - 2 / 3) * 3}}}/> : null}
    </>;
  // ================= pegs =================
  const pegsNew = [0, 0.5, 1].map((u) => { const x = lerp(NH.x0, NH.x1, u); return pegItem(x, lineY(x), (u - 0.5) * 6); });
  const pegsOld = [pegItem(OH.x1, lineY(OH.x1), 3)];
  const tf = f - T(0.08);
  const pegFall = tf > 0 ? (() => { const y = lineY(OH.x0) + 0.5 * 0.7 * tf * tf, x = OH.x0 - tf * 0.8; return y < 1200 ? [pegItem(x, y, -tf * 7)] : []; })() : [pegItem(OH.x0, lineY(OH.x0), -3)];
  // ================= the world around: far bank with palms, river, near bank, poles =================
  const bank: Pt[] = [];
  for (let i = 0; i <= 90; i++) { const x = -80 + i * 25, crown = Math.max(0, Math.sin(x / 70 + rnd(Math.floor(i / 5), 83) * 3)); bank.push([x, HZ - 4 - rnd(i, 82) * 6 - crown * (8 + 14 * rnd(Math.floor(i / 4), 81))]); }
  const bankD = `${smooth(bank, false)} L ${W + 160} ${HZ + 4} L -80 ${HZ + 4} Z`;
  const nearY = (x: number) => 812 + 16 * Math.sin(x / 260 + 0.6) + 8 * Math.sin(x / 97);
  const nearPts: Pt[] = Array.from({length: 45}, (_, i) => { const x = -80 + i * 50; return [x, nearY(x)]; });
  const nearD = `${smooth(nearPts, false)} L ${W + 160} ${H + 60} L -80 ${H + 60} Z`;
  // the push: zoom about a point right of the frame, so the new cloth slides from right of centre to the centre
  const cam = sstep((f - T(0.04)) / T(0.96)), zoom = 1 + 0.18 * cam;
  return (
    <Frame f={f} zoom={zoom} cx={2094} cy={520}>
      <ThreadDefs/>
      <defs>
        <linearGradient id={`${id}r`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8925A"/><stop offset="0.25" stopColor="#8E3D52"/><stop offset="1" stopColor="#2A1838"/></linearGradient>
        <linearGradient id={`${id}h`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F0A04B" stopOpacity={0}/><stop offset="0.6" stopColor="#F0A04B" stopOpacity={0.3}/><stop offset="1" stopColor="#FFD27A" stopOpacity={0.55}/></linearGradient>
        <linearGradient id={`${id}bl`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2A0A10" stopOpacity={0.35}/><stop offset="0.6" stopColor="#FFB060" stopOpacity={0}/><stop offset="1" stopColor="#FFC878" stopOpacity={0.45}/></linearGradient>
        <radialGradient id={`${id}s`} cx={sun[0]} cy={HZ + 20} r={420} gradientUnits="userSpaceOnUse" gradientTransform={`translate(${sun[0]} ${HZ}) scale(0.5 1) translate(${-sun[0]} ${-HZ})`}><stop offset="0" stopColor="#FFE3A3" stopOpacity={0.75}/><stop offset="0.4" stopColor="#F0A04B" stopOpacity={0.25}/><stop offset="1" stopColor="#F0A04B" stopOpacity={0}/></radialGradient>
      </defs>
      <Sky mood={mood} sun={sun} sunR={70} f={f} rays={0.35} id={`${id}k`}/>
      {/* far bank: a low line of trees, coconut and palmyra palms, hazed by the low sun */}
      <Rimmed paths={[bankD, ...coconut({x: 150, y: HZ - 6, h: 128, seed: 3, wind: 0.2, t: f, lean: 0.14, detail: 0.8}), ...palmyra({x: 1772, y: HZ - 6, h: 118, seed: 5, wind: 0.2, t: f, detail: 0.8}),
        ...coconut({x: 1860, y: HZ - 4, h: 96, seed: 8, wind: 0.2, t: f, lean: -0.16, detail: 0.7})]} light={toSun(960, HZ - 60)} fill={SIL_FAR} rim="#E8A060" w={1.4}/>
      <rect x={-80} y={HZ - 80} width={W + 240} height={86} fill={`url(#${id}h)`}/>
      {/* the river: the sky mirrored, the sun's path glittering */}
      <rect x={-80} y={HZ} width={W + 240} height={90} fill={`url(#${id}r)`}/>
      <rect x={-80} y={HZ} width={W + 240} height={90} fill={`url(#${id}s)`}/>
      {Array.from({length: 30}, (_, i) => {
        const y = HZ + 4 + Math.pow(rnd(i, 91), 1.3) * 70, w = 10 + rnd(i, 92) * 46 * (1 - (y - HZ) / 120), x = sun[0] + (rnd(i, 93) - 0.5) * (60 + (y - HZ) * 2.2) + Math.sin(f / 20 + i) * 6;
        return <rect key={i} x={x - w / 2} y={y} width={w} height={1.6} fill="#FFE9B8" opacity={(0.3 + 0.5 * rnd(i, 94)) * (0.5 + 0.5 * Math.sin(f / 7 + i * 2.1))}/>;
      })}
      {/* near bank */}
      <path d={nearD} fill="#120A16"/>
      <path d={smooth(nearPts, false)} fill="none" stroke="#FFC877" strokeWidth={1.6} opacity={0.35}/>
      <rect x={-80} y={850} width={W + 240} height={260} fill="url(#th-down)" opacity={0.5}/>
      {/* the poles and the line */}
      <Rimmed paths={bamboo([226, 990], [232, 232], 17)} light={toSun(230, 600)} fill="#130A18" w={2.6}/>
      <Rimmed paths={bamboo([1704, 1000], [1698, 226], 17)} light={toSun(1700, 600)} fill="#130A18" w={2.6}/>
      <path d={lineD(Array.from({length: 49}, (_, i) => { const x = lerp(LX0, LX1, i / 48); return [x, lineY(x)]; }))} fill="none" stroke="#1A0E1E" strokeWidth={3.2}/>
      <path d={lineD(Array.from({length: 49}, (_, i) => { const x = lerp(LX0, LX1, i / 48); return [x, lineY(x) + 1]; }))} fill="none" stroke="#FFD38A" strokeWidth={1} opacity={0.55}/>
      {/* the old robe: threadbare, charring at its burning edge, the ember rim and its glow over it */}
      {!burnt ? <Cloth fn={oldFn} nu={22} nv={12} shade={oldShade} look={oldLook} out={oldOut} holes={[...holes, ...worn].map((p) => polyD(p, true))}>
        {[[0.42, 0.3, 46], [0.72, 0.5, 38], [0.24, 0.62, 30]].map(([u, v, r], i) => { const c = oldFn(u, v); return <Glow key={i} x={c[0]} y={c[1]} rx={r} ry={r * 1.3} g="th-soft" o={0.3}/>; })}
        {drapeFolds(oldFn, OH.pegs, 0.9, 0.8, 13)}
        {[0.04, 0.12].map((v0, k) => <SoftFold key={k} pts={Array.from({length: 15}, (_, i) => oldFn(i / 14, v0 + (0.05 + 0.04 * k) * Math.sin((Math.PI * i) / 14) * (1 - slipOf(f))))} w={20 - 5 * k} o={0.09} lit={0.1} skew={1}/>)}
        <path d={charD} fill="none" stroke="#3A1A0C" strokeWidth={30} strokeLinejoin="round" opacity={0.45}/>
        <path d={charD} fill="none" stroke="#120604" strokeWidth={11} strokeLinejoin="round" opacity={0.92}/>
      </Cloth> : null}
      {!burnt && fray ? <path d={fray} fill="none" stroke="#5A4048" strokeWidth={1.2} opacity={0.85}/> : null}
      {!burnt ? worn.map((hp, i) => <path key={i} d={polyD(hp, true)} fill="none" stroke="#E8B878" strokeWidth={1.6} opacity={0.5}/>) : null}
      {charD ? <path d={charD} fill="none" stroke="#FF7A2A" strokeWidth={16} strokeLinejoin="round" opacity={0.1}/> : null}
      {embers}
      <Rimmed paths={[...pegsOld, ...pegFall]} light={toSun(700, 300)} fill="#1C1016" rim="#F0B070" w={1.8}/>
      {flakes}
      {/* the new cloth, and its pegs */}
      <Glow x={sun[0]} y={sun[1] - 30} rx={440} ry={380} g="th-soft" o={0.2 + 0.3 * open}/>
      {newCloth}
      <Rimmed paths={pegsNew} light={[0, 1]} fill="#1C1016" rim="#F0B070" w={1.8}/>
      {/* the warm wind: dust in the light, grass and kans grass bending */}
      <Dust f={f} sun={sun} n={110} y0={200} y1={900}/>
      <Rimmed paths={[blades(-60, 620, nearY, f, 64, 20, 70, 3, 0.4 + wind * 0.6), blades(1260, 2000, nearY, f, 70, 20, 80, 5, 0.4 + wind * 0.6)]} light={toSun(960, 800)} fill="#0B0610" rim="#E8A868" w={1.6}/>
      <Rimmed paths={[...reeds({x: 90, y: 1010, h: 330, seed: 5, wind: 0.3 + 0.3 * wind, t: f, plumes: 5}), ...reeds({x: 1880, y: 1016, h: 360, seed: 9, wind: 0.3 + 0.3 * wind, t: f, plumes: 6})]}
        light={toSun(960, 860)} fill="#07040A" rim="#C89262" w={1.8}/>
    </Frame>
  );
};

// The worlds glowing in the pearls' depths (unit coordinates).
const WORLD_BG: [number, string][][] = [
  [[0, "#2A2050"], [0.42, "#8E3D52"], [0.58, "#F0A04B"], [0.63, "#FFE3A3"], [0.66, "#5A2A3A"], [1, "#24142A"]],   // dawn
  [[0, "#0B1029"], [0.45, "#24305E"], [0.52, "#4A6A9A"], [0.6, "#1E3058"], [1, "#0A1430"]],                      // sea
  [[0, "#0B0820"], [0.5, "#2E2350"], [1, "#100A24"]],                                                           // star
  [[0, "#1A1A40"], [0.55, "#8E3D52"], [0.85, "#F0A04B"], [1, "#FFD27A"]],                                       // peaks
  [[0, "#0E1A30"], [0.6, "#2F3D6E"], [0.82, "#7D6A92"], [1, "#C9A0A0"]],                                        // forest
  [[0, "#6B3A55"], [0.45, "#E2904E"], [0.75, "#FFD98E"], [1, "#FFF0C8"]],                                       // dunes
  [[0, "#07050F"], [0.5, "#1C1438"], [1, "#07050F"]],                                                           // galaxy
  [[0, "#120E2A"], [0.55, "#2A2050"], [0.6, "#3A2A50"], [1, "#0A0816"]],                                        // lamps on a ghat
];
// A tiny world inside a pearl, in unit coordinates (the pearl is the unit circle); dx: a slow parallax drift.
const World: React.FC<{k: number; f: number; seed: number; dx: number}> = ({k, f, seed, dx}) => {
  const tw = (i: number) => 0.6 + 0.4 * Math.sin(f / 9 + seed * 3 + i * 2.1);
  switch (k) {
    case 0: return <g transform={`translate(${dx} 0)`}>
      <circle cx={0.08} cy={0.24} r={0.62} fill="url(#pe-moon)" opacity={0.55}/>
      <circle cx={0.08} cy={0.24} r={0.2} fill="#FFF4D8"/>
      <path d="M -1.2 0.26 C -0.7 0.12 -0.4 0.2 -0.1 0.24 C 0.3 0.28 0.6 0.16 1.2 0.24 L 1.2 1.2 L -1.2 1.2 Z" fill="#2A1428"/>
      {[0.4, 0.55, 0.7].map((y, i) => <rect key={i} x={-0.12 + i * 0.04} y={y} width={0.36 - i * 0.08} height={0.03} fill="#FFD9A0" opacity={0.7 * tw(i)}/>)}
    </g>;
    case 1: return <g transform={`translate(${dx} 0)`}>
      <circle cx={0.36} cy={-0.42} r={0.4} fill="url(#pe-moon)" opacity={0.6}/>
      <circle cx={0.36} cy={-0.42} r={0.13} fill="#F4F1E6"/>
      {[0.12, 0.34, 0.58].map((y, i) => <path key={i} d={`M -1.2 ${y} q 0.2 -0.08 0.4 0 t 0.4 0 t 0.4 0 t 0.4 0 t 0.4 0 t 0.4 0`} fill="none" stroke="#9AB0E0" strokeWidth={0.035} opacity={0.6 - i * 0.12} transform={`translate(${Math.sin(f / 40 + i) * 0.1} 0)`}/>)}
      {[0.2, 0.3, 0.42, 0.52].map((y, i) => <rect key={i} x={0.3 - 0.05 * i} y={y} width={0.14 + i * 0.03} height={0.025} fill="#FFF3D6" opacity={0.75 * tw(i)}/>)}
    </g>;
    case 2: return <g transform={`translate(${dx} 0)`}>
      <circle cx={-0.05} cy={-0.05} r={0.55} fill="url(#pe-moon)" opacity={0.4}/>
      <path d="M -0.05 -0.42 L -0.03 -0.07 L 0.32 -0.05 L -0.03 -0.03 L -0.05 0.32 L -0.07 -0.03 L -0.42 -0.05 L -0.07 -0.07 Z" fill="#FFF8E4" opacity={0.55 + 0.25 * tw(9)}/>
      <circle cx={-0.05} cy={-0.05} r={0.07} fill="#FFFFFF"/>
      {Array.from({length: 14}, (_, i) => <circle key={i} cx={(rnd(i, seed + 11) - 0.5) * 1.8} cy={(rnd(i, seed + 12) - 0.5) * 1.8} r={0.018 + 0.02 * rnd(i, seed + 13)} fill="#FFF3D6" opacity={tw(i)}/>)}
    </g>;
    case 3: return <g transform={`translate(${dx} 0)`}>
      <circle cx={-0.3} cy={-0.5} r={0.08} fill="#FFF3D6" opacity={0.9}/>
      <path d="M -1.2 0.6 L -0.6 -0.1 L -0.4 0.1 L -0.05 -0.4 L 0.35 0.15 L 0.55 0 L 1.2 0.6 L 1.2 1.2 L -1.2 1.2 Z" fill="#1A0E22"/>
      <path d="M -0.05 -0.4 L 0.1 -0.2 L 0.02 -0.18 L -0.08 -0.24 L -0.16 -0.18 L -0.22 -0.2 Z M -0.6 -0.1 L -0.52 0.0 L -0.62 -0.02 L -0.68 0.0 Z" fill="#F0C890" opacity={0.85}/>
      <path d="M -0.6 -0.1 L -0.4 0.1 L -0.05 -0.4 L 0.35 0.15 L 0.55 0 L 1.2 0.6" fill="none" stroke="#FFC877" strokeWidth={0.03} opacity={0.7}/>
    </g>;
    case 4: return <g transform={`translate(${dx} 0)`}>
      <path d={Array.from({length: 9}, (_, i) => { const x = -1.1 + i * 0.28, h = 0.5 + rnd(i, seed + 3) * 0.4; return `M ${x - 0.13} 0.75 L ${x} ${0.75 - h} L ${x + 0.13} 0.75 Z`; }).join(" ") + " M -1.2 0.7 L 1.2 0.7 L 1.2 1.2 L -1.2 1.2 Z"} fill="#0A0E1E"/>
      {Array.from({length: 6}, (_, i) => <circle key={i} cx={-0.6 + rnd(i, seed + 5) * 1.2 + Math.sin(f / 30 + i) * 0.05} cy={0.1 + rnd(i, seed + 6) * 0.5} r={0.035} fill="#FFE08A" opacity={tw(i)}/>)}
    </g>;
    case 5: return <g transform={`translate(${dx} 0)`}>
      <circle cx={-0.3} cy={-0.35} r={0.5} fill="url(#pe-moon)" opacity={0.7}/>
      <circle cx={-0.3} cy={-0.35} r={0.16} fill="#FFFBEA"/>
      <path d="M -1.2 0.3 C -0.6 0.05 -0.2 0.12 0.2 0.3 C 0.6 0.48 0.9 0.3 1.2 0.2 L 1.2 1.2 L -1.2 1.2 Z" fill="#B0602E"/>
      <path d="M -1.2 0.62 C -0.5 0.4 0.1 0.5 0.5 0.62 C 0.8 0.7 1 0.6 1.2 0.55 L 1.2 1.2 L -1.2 1.2 Z" fill="#6A2E22"/>
      <path d="M -1.2 0.3 C -0.6 0.05 -0.2 0.12 0.2 0.3" fill="none" stroke="#FFE3A3" strokeWidth={0.035} opacity={0.8}/>
    </g>;
    case 6: return <g transform={`translate(${dx} 0) rotate(${f * 0.15 + seed * 40})`}>
      <circle r={0.75} fill="url(#pe-moon)" opacity={0.18}/>
      {[0, 180].map((a) => <path key={a} d={ribbon(Array.from({length: 14}, (_, i) => { const t = i / 13, r = 0.1 + t * 0.75, an = (a * Math.PI) / 180 + t * 3.6; return [Math.cos(an) * r, Math.sin(an) * r * 0.62]; }), 0.14, 0.02)} fill="#D8DDF2" opacity={0.55}/>)}
      <circle r={0.14} fill="#FFF6E0"/>
      {Array.from({length: 8}, (_, i) => <circle key={i} cx={Math.cos(i * 2.4) * (0.3 + rnd(i, seed) * 0.5)} cy={Math.sin(i * 2.4) * (0.3 + rnd(i, seed) * 0.5) * 0.62} r={0.03} fill="#FFF3D6" opacity={tw(i)}/>)}
    </g>;
    default: return <g transform={`translate(${dx} 0)`}>
      <path d="M -1.2 -0.05 L -0.7 -0.05 L -0.7 -0.15 L -0.3 -0.15 L -0.3 -0.32 L -0.2 -0.42 L -0.1 -0.32 L -0.1 -0.15 L 0.4 -0.15 L 0.4 -0.05 L 1.2 -0.05 L 1.2 0.12 L -1.2 0.12 Z" fill="#0E0A1A"/>
      {Array.from({length: 9}, (_, i) => { const x = -0.9 + i * 0.22; return <g key={i}><circle cx={x} cy={0.06} r={0.035} fill="#FFD27A" opacity={tw(i)}/><rect x={x - 0.015} y={0.16} width={0.03} height={0.22 + 0.1 * Math.sin(f / 13 + i)} fill="#FFC877" opacity={0.45 * tw(i)}/></g>; })}
    </g>;
  }
};

// =====================================================================================================================
// 7.7 PEARLS: one strand of pearls runs diagonally out of the deep, from a warm light far up on the left to the lower
// right, where the nearest pearl looms large and soft out of focus; the camera drifts slowly along the thread. Each pearl
// is opaque nacre with a soft iridescent lustre, a world glowing faintly in its depths. Variant "thread": the pearls dim
// (still nacre, never glass) and the thread itself lights, pulses of light running down it through every pearl.
// =====================================================================================================================
type V3 = [number, number, number];
const NACRE: string[][] = [
  ["#FFF9F0", "#F0E3D3", "#D0BBB2", "#8C7287", "#3A2944"],   // cream, a rose overtone
  ["#FCFAF6", "#E6E0DE", "#C0B7C4", "#787096", "#2E284C"],   // silver
  ["#FFF5E2", "#F2DAB6", "#CEAA8A", "#88645A", "#3E263A"],   // golden
];
const PearlDefs: React.FC = () => (
  <defs>
    <clipPath id="pe-unit"><circle r={1}/></clipPath>
    {WORLD_BG.map((st, k) => <linearGradient key={k} id={`pe-w${k}`} x1="0" y1="0" x2="0" y2="1">{st.map(([o, c], i) => <stop key={i} offset={o} stopColor={c}/>)}</linearGradient>)}
    {/* the nacre: lit from +x (each pearl turns it to face the light), deepening to plum on the far side */}
    {NACRE.map((c, k) => <radialGradient key={k} id={`pe-n${k}`} cx="0.64" cy="0.5" fx="0.8" fy="0.48" r="0.74">
      <stop offset="0" stopColor={c[0]}/><stop offset="0.3" stopColor={c[1]}/><stop offset="0.62" stopColor={c[2]}/><stop offset="0.88" stopColor={c[3]}/><stop offset="1" stopColor={c[4]}/></radialGradient>)}
    {/* the same, out of focus: its edge melts away */}
    {NACRE.map((c, k) => <radialGradient key={k} id={`pe-s${k}`} cx="0.58" cy="0.5" fx="0.68" fy="0.5" r="0.62">
      <stop offset="0" stopColor={c[0]}/><stop offset="0.35" stopColor={c[1]}/><stop offset="0.68" stopColor={c[2]}/><stop offset="0.84" stopColor={c[3]} stopOpacity={0.92}/><stop offset="0.93" stopColor={c[4]} stopOpacity={0.45}/><stop offset="1" stopColor={c[4]} stopOpacity={0}/></radialGradient>)}
    {/* orient: the iridescent overtone in a ring on the shadowed side (rose, then green, then blue) */}
    <radialGradient id="pe-orient" cx="0.42" cy="0.5" r="0.6"><stop offset="0.6" stopColor="#F4B8C8" stopOpacity={0}/><stop offset="0.76" stopColor="#F4B8C8" stopOpacity={0.24}/><stop offset="0.87" stopColor="#B6E2CE" stopOpacity={0.17}/><stop offset="0.95" stopColor="#B4C4F6" stopOpacity={0.22}/><stop offset="1" stopColor="#B4C4F6" stopOpacity={0}/></radialGradient>
    <radialGradient id="pe-lus">{softStops("#FFFDF6", 0.6, "#FFEEDA", 2.0)}</radialGradient>
    <radialGradient id="pe-spec"><stop offset="0" stopColor="#FFFFFF"/><stop offset="0.4" stopColor="#FFF8EA" stopOpacity={0.6}/><stop offset="1" stopColor="#FFF4E0" stopOpacity={0}/></radialGradient>
    <radialGradient id="pe-fadeg"><stop offset="0" stopColor="#fff"/><stop offset="0.45" stopColor="#fff" stopOpacity={0.85}/><stop offset="0.8" stopColor="#fff" stopOpacity={0.25}/><stop offset="1" stopColor="#fff" stopOpacity={0}/></radialGradient>
    <mask id="pe-fade" maskUnits="userSpaceOnUse" x={-1.1} y={-1.1} width={2.2} height={2.2}><circle r={1} fill="url(#pe-fadeg)"/></mask>
    <radialGradient id="pe-moon"><stop offset="0" stopColor="#FFFBEA"/><stop offset="0.5" stopColor="#FFF0C8" stopOpacity={0.9}/><stop offset="1" stopColor="#FFE3A3" stopOpacity={0}/></radialGradient>
    <radialGradient id="pe-glow">{softStops("#FFE6B0", 0.75, "#F0A04B", 2.0)}</radialGradient>
    <radialGradient id="pe-inner">{softStops("#FFF2D0", 0.95, "#FFB860", 1.8)}</radialGradient>
  </defs>
);
// The rim of light on the lit side of a unit pearl (turned with it).
const RIM_ARC = (() => { const p: number[][] = []; for (let i = 0; i <= 14; i++) { const a = -0.85 + (1.7 * i) / 14; p.push([Math.cos(a) * 0.99, Math.sin(a) * 0.99]); } return lineD(p); })();
// One pearl at (x, y), radius r. a: the direction to the light (degrees). soft: out of focus (0..1). haze: lost in the
// far light (0..1). world: which world glows in its depths (-1: none), wo its strength. dim: the thread variant's
// dimming (it darkens the body and the world, never the lustre: the pearl stays nacre). glow: lit from within.
const Nacre: React.FC<{x: number; y: number; r: number; a: number; k: number; world: number; wo: number; f: number; seed: number; soft: number; haze: number; hazeC: string; dim: number; glow: number}> =
  ({x, y, r, a, k, world, wo, f, seed, soft, haze, hazeC, dim, glow}) => {
  const ra = `rotate(${a.toFixed(1)})`, sharp = soft < 0.35;
  return (
    <g transform={`translate(${n1(x)} ${n1(y)}) scale(${r.toFixed(2)})`}>
      {glow > 0.01 ? <circle r={2.8} fill="url(#pe-glow)" opacity={Math.min(1, glow)}/> : null}
      <g transform={ra}><circle r={soft > 0.01 ? 1 + 0.14 * soft : 1} fill={`url(#pe-${soft > 0.01 ? "s" : "n"}${k})`}/></g>
      <g clipPath={sharp ? "url(#pe-unit)" : undefined}>
        {sharp && world >= 0 && wo > 0.01 && r > 14 ? <g mask="url(#pe-fade)" opacity={wo}><g transform="translate(-0.06 0.02) scale(0.72 0.66)">
          <circle r={1.3} fill={`url(#pe-w${world})`}/><World k={world} f={f} seed={seed} dx={0.08 * Math.sin(f / 70 + seed)}/></g></g> : null}
        {dim > 0.01 ? <circle r={sharp ? 1 : 1 + 0.14 * soft} fill="#33182A" opacity={dim}/> : null}
        <g transform={ra}>
          <circle r={1} fill="url(#pe-orient)" opacity={1 - 0.6 * soft}/>
          <ellipse cx={0.28 + 0.06 * soft} cy={-0.04} rx={0.6 + 0.12 * soft} ry={0.78 + 0.1 * soft} fill="url(#pe-lus)" opacity={0.46 + 0.3 * soft - 0.1 * dim}/>
          {soft > 0.01 ? <ellipse cx={0.62} cy={0} rx={0.42} ry={0.9} fill="url(#pe-glow)" opacity={0.5 * soft}/> : null}
        </g>
        {glow > 0.01 ? <circle r={0.92} fill="url(#pe-inner)" opacity={Math.min(1, glow * 0.75)}/> : null}
        <g transform={ra}>
          <ellipse cx={0.52 - 0.08 * soft} cy={-0.2} rx={0.2 + 0.2 * soft} ry={0.12 + 0.12 * soft} transform="rotate(-20 0.54 -0.2)" fill="url(#pe-spec)" opacity={(0.95 - 0.2 * soft) * (1 - 0.25 * dim)}/>
          <ellipse cx={-0.5} cy={0.42} rx={0.32} ry={0.1} transform="rotate(-38 -0.5 0.42)" fill="url(#pe-spec)" opacity={0.18 * (1 - soft)}/>
        </g>
      </g>
      {haze > 0.01 ? <circle r={1.03} fill={hazeC} opacity={haze}/> : null}
    </g>
  );
};
const Pearls: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), id = uid();
  const thread = s.variant === "thread";
  const tv = thread ? 0.55 + 0.45 * sstep(f / (n * 0.3)) : 0;
  const mood = moodOf(s, "night");
  const tint = {night: "#2A1840", dusk: "#3A1A3E", dawn: "#22284A", gold: "#3A2232"}[mood];
  // the strand in 3D (camera at the origin, looking down +z): it comes down out of the light above the frame on the
  // left, hangs in a long curve and sweeps forward past the lens at the lower right (a quadratic curve, by arc length)
  const F = 1000, CX = 960 - 30 * sstep(f / n), CY = 540;
  const S3 = (sx: number, sy: number, z: number): V3 => [((sx - 960) * z) / F, ((sy - 540) * z) / F, z];
  const A = S3(640, -160, 3400), Cc = S3(720, 1010, 1900), Bn = S3(2080, 1070, 680);
  const NB = 240, tab: V3[] = [], cum: number[] = [0];
  for (let i = 0; i <= NB; i++) {
    const u = i / NB, v = 1 - u, sw = 4 * u * v;
    tab.push([v * v * Bn[0] + 2 * v * u * Cc[0] + u * u * A[0] + 60 * Math.sin(f / 80 + u * 2.4) * sw, v * v * Bn[1] + 2 * v * u * Cc[1] + u * u * A[1] + 24 * Math.sin(f / 64 + u * 3) * sw, v * v * Bn[2] + 2 * v * u * Cc[2] + u * u * A[2]]);
    if (i) cum.push(cum[i - 1] + Math.hypot(tab[i][0] - tab[i - 1][0], tab[i][1] - tab[i - 1][1], tab[i][2] - tab[i - 1][2]));
  }
  const LT = cum[NB];
  const at3 = (sL: number): V3 => {
    const s1 = Math.max(0, Math.min(LT, sL)); let lo = 0, hi = NB;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] < s1) lo = m; else hi = m; }
    const t = (s1 - cum[lo]) / Math.max(1e-6, cum[hi] - cum[lo]), p = tab[lo], q = tab[hi];
    return [lerp(p[0], q[0], t), lerp(p[1], q[1], t), lerp(p[2], q[2], t)];
  };
  const proj = (P: V3): [number, number, number] => [CX + (F * P[0]) / P[2], CY + (F * P[1]) / P[2], F / P[2]];
  const Lt: V2 = [700, -40];                                // the light the thread comes down from (just above the frame)
  // pearls along it, drifting down the thread towards the lens as the camera travels along it
  const R = 88, SP = R * 3.2, speed = 0.9, travel = f * speed, k0 = Math.floor(travel / SP), off = travel - k0 * SP;
  type B = {sL: number; P: V3; q: [number, number, number]; kid: number};
  const beads: B[] = [];
  for (let k = 0; k * SP - off < LT; k++) { const sL = k * SP - off; if (sL < 0) continue; const P = at3(sL); beads.push({sL, P, q: proj(P), kid: k + k0}); }
  beads.sort((a, b) => b.P[2] - a.P[2]);                    // far first
  // pulses of light running down the thread from the light (thread variant): always two or three on screen
  const PSP = LT * 0.34, PV = 15;
  const pulses = thread ? Array.from({length: 4}, (_, j) => LT + PSP * 0.2 - ((f * PV + j * PSP) % (PSP * 4))).filter((p) => p > -40 && p < LT + 40) : [];
  const nearP = (sL: number) => pulses.reduce((m, p) => Math.max(m, Math.exp(-Math.pow((sL - p) / (SP * 0.75), 2))), 0);
  // the thread between two arc positions, projected; its width follows the depth
  const tpts = (s0: number, s1: number, k = 8) => Array.from({length: k + 1}, (_, i) => proj(at3(lerp(s0, s1, i / k))));
  const strokeSeg = (s0: number, s1: number, key: string) => {
    const pts = tpts(s0, s1), sc = pts[Math.floor(pts.length / 2)][2], d = lineD(pts), pk = nearP((s0 + s1) / 2);
    return <g key={key}>
      {tv > 0 ? <>
        <path d={d} fill="none" stroke="#FFC877" strokeWidth={16 * sc + 4} opacity={0.1 * tv} strokeLinecap="round"/>
        <path d={d} fill="none" stroke="#FFE2A8" strokeWidth={5 * sc + 1.6} opacity={0.3 * tv} strokeLinecap="round"/>
      </> : null}
      <path d={d} fill="none" stroke={tv > 0 ? "#FFF4D8" : "#C89A58"} strokeWidth={(tv > 0 ? 2.6 : 2.2) * sc + 0.4} opacity={tv > 0 ? 0.6 + 0.4 * tv : 0.75} strokeLinecap="round"/>
      {pk > 0.02 ? <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={4.5 * sc + 1.6} opacity={0.95 * pk} strokeLinecap="round"/> : null}
    </g>;
  };
  const nodes: React.ReactNode[] = [];
  const top = beads.length ? beads[0].sL : 0;
  nodes.push(strokeSeg(LT, top, "t-top"));
  beads.forEach((b, i) => {
    const [x, y, sc] = b.q, r = R * sc;
    const nb = beads[i + 1], toS = nb ? nb.sL : 0;
    const vis = !(x < -r - 60 || x > W + r + 60 || y < -r - 60 || y > H + r + 60);
    if (vis) {
      const soft = clamp01((1060 - b.P[2]) / 320), haze = clamp01((b.P[2] - 2300) / 2600) * 0.5;
      const a = (Math.atan2(Lt[1] - y, Lt[0] - x) * 180) / Math.PI, pn = nearP(b.sL);
      nodes.push(<Nacre key={`p${b.kid}`} x={x} y={y} r={r} a={a} k={soft > 0.2 ? 0 : ((b.kid % 3) + 3) % 3} world={((b.kid % 8) + 8) % 8} wo={thread ? 0.16 + 0.6 * pn : 0.34} f={f} seed={b.kid}
        soft={soft} haze={haze} hazeC={mix(tint, "#E8A870", 0.5)} dim={thread ? tv * 0.4 * (1 - pn) : 0} glow={thread ? pn * 0.95 : 0.1 * (1 - soft)}/>);
      if (soft < 0.4) { const h = proj(at3(b.sL - R * 0.97)); nodes.push(<circle key={`h${b.kid}`} cx={h[0]} cy={h[1]} r={Math.max(0.8, 3 * sc)} fill="#2A1820" opacity={0.8}/>); }
    }
    // the thread on to the next pearl (its far end hidden inside it), and the silk knot halfway
    nodes.push(strokeSeg(b.sL - R * 0.97, toS, `t${b.kid}`));
    if (nb) {
      const kq = proj(at3((b.sL + toS) / 2)), kr = Math.max(1.4, 7 * kq[2]), pk = nearP((b.sL + toS) / 2);
      nodes.push(<g key={`k${b.kid}`}><ellipse cx={kq[0]} cy={kq[1]} rx={kr} ry={kr * 0.8} fill={thread ? mix("#7A5428", "#FFF0C8", 0.5 * tv + 0.5 * pk) : "#5A3A22"}/><circle cx={kq[0] - kr * 0.3} cy={kq[1] - kr * 0.3} r={kr * 0.35} fill="#FFE2A8" opacity={0.6}/></g>);
    }
  });
  // the pulses themselves: a bead of light on the thread, and its glow
  const pulseNodes = pulses.map((p, j) => {
    const q = proj(at3(p)); if (q[0] < -300 || q[0] > W + 300 || q[1] < -300 || q[1] > H + 300) return null;
    return <g key={`pl${j}`}><circle cx={q[0]} cy={q[1]} r={260 * q[2] + 40} fill="url(#pe-glow)" opacity={0.85}/></g>;
  });
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.03)} cx={960} cy={540}>
      <ThreadDefs/>
      <PearlDefs/>
      <defs>
        <radialGradient id={`${id}bg`} gradientUnits="userSpaceOnUse" cx={Lt[0]} cy={Lt[1]} r={2000}>
          <stop offset="0" stopColor="#E8A870"/><stop offset="0.07" stopColor="#B06A58"/><stop offset="0.2" stopColor={mix(tint, "#7A3A50", 0.55)}/><stop offset="0.42" stopColor={tint}/><stop offset="0.72" stopColor="#100A20"/><stop offset="1" stopColor="#06040C"/>
        </radialGradient>
      </defs>
      <rect x={-100} y={-100} width={W + 200} height={H + 200} fill={`url(#${id}bg)`}/>
      <circle cx={Lt[0]} cy={Lt[1]} r={700} fill="url(#pe-glow)" opacity={0.5 + 0.2 * tv}/>
      <Dust f={f} sun={[Lt[0], Lt[1] + 200]} n={60} y0={60} y1={900}/>
      {nodes}
      {pulseNodes}
    </Frame>
  );
};

// =====================================================================================================================
// 9.26 OFFERING: a brass thali on a dark stone floor before a temple wall: a carved niche in soft shadow above it, a
// pillar's lotus base at the side, a faint kolam border in rice flour. A clay diya burns on the plate. A leaf, a
// marigold, a mango arrive one by one, each in a breath of light; then a copper lota tilts in from the top right and
// pours a thread of water into the small bowl. No hands. The words, one line, each lit as its gift arrives.
// =====================================================================================================================
// A heart-shaped peepal leaf, base at the origin, its long drip tip along +x, length L (local; the caller lays it flat).
const PEEPAL: Pt[] = [[0, 0, "c"], [-0.05, -0.08], [-0.075, -0.2], [-0.03, -0.32], [0.07, -0.41], [0.2, -0.44], [0.33, -0.41], [0.45, -0.33], [0.55, -0.23], [0.64, -0.14], [0.72, -0.075], [0.8, -0.036], [0.9, -0.012], [1.0, 0, "c"], [0.9, 0.012], [0.8, 0.036], [0.72, 0.075], [0.64, 0.14], [0.55, 0.23], [0.45, 0.33], [0.33, 0.41], [0.2, 0.44], [0.07, 0.41], [-0.03, 0.32], [-0.075, 0.2], [-0.05, 0.08]];
const PeepalLeaf: React.FC<{L: number}> = ({L}) => {
  const id = uid();
  const out = smooth(PEEPAL.map((p) => [p[0] * L, p[1] * L, p[2]] as Pt));
  const veins: string[] = [];
  for (let k = 0; k < 7; k++) {
    const x0 = (0.02 + k * 0.085) * L, reach = (0.4 - k * 0.045) * L;
    [-1, 1].forEach((sd) => veins.push(`M ${n1(x0)} 0 Q ${n1(x0 + 0.05 * L)} ${n1(sd * reach * 0.55)} ${n1(x0 + 0.2 * L)} ${n1(sd * reach * 0.9)}`));
  }
  return (
    <g>
      <defs>
        <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1={0} y1={-0.45 * L} x2={0.1 * L} y2={0.45 * L}><stop offset="0" stopColor="#A09A44"/><stop offset="0.35" stopColor="#5A6224"/><stop offset="0.75" stopColor="#262E0E"/><stop offset="1" stopColor="#141A06"/></linearGradient>
      </defs>
      <path d={ribbon([[0.02 * L, 0], [-0.12 * L, 0.02 * L], [-0.26 * L, 0.08 * L]], 0.03 * L, 0.018 * L)} fill="#4A3E18"/>
      <path d={out} fill={`url(#${id}g)`}/>
      <path d={smooth([[0.1 * L, -0.36 * L], [0.3 * L, -0.34 * L], [0.5 * L, -0.2 * L], [0.36 * L, -0.12 * L], [0.16 * L, -0.16 * L]])} fill="#FFE9B0" opacity={0.14}/>
      <path d={`M 0 0 Q ${0.5 * L} ${-0.015 * L} ${0.97 * L} 0`} fill="none" stroke="#E8D08A" strokeWidth={2.2} opacity={0.55}/>
      <path d={veins.join(" ")} fill="none" stroke="#D8C07A" strokeWidth={1.1} opacity={0.32}/>
      <path d={out} fill="none" stroke="#FFD38A" strokeWidth={1.6} opacity={0.5}/>
    </g>
  );
};
// A marigold petal: a fan whose outer edge is crinkled into small teeth (local: base at 0, pointing +x, length ~10).
const MPETAL: string[] = Array.from({length: 5}, (_, k) => {
  const pts: Pt[] = [[0, 0, "c"], [4.6, -2.9 - 0.4 * rnd(k, 341)]];
  const nT = 9, spread = 0.5 + 0.14 * rnd(k, 342);
  for (let i = 0; i <= nT; i++) {
    const a = -spread + (2 * spread * i) / nT, tooth = i % 2 === 0, rr = 10 * (tooth ? 1 + 0.06 * rnd(i + k * 20, 343) : 0.84 + 0.08 * rnd(i + k * 20, 344));
    const p: [number, number] = [Math.cos(a) * rr * 0.92, Math.sin(a) * rr * 0.78];
    pts.push(tooth ? [p[0], p[1], "c"] : p);
  }
  pts.push([4.6, 2.9 + 0.4 * rnd(k, 345)]);
  return smooth(pts);
});
const MCREASE = "M 1.5 0.2 Q 5 0.9 8.8 0.3 M 2.4 -0.6 Q 5.4 -2 8.2 -3.4 M 2.4 0.9 Q 5.6 2.3 8 3.6";
// A marigold head (Tagetes erecta): a dense dome of ruffled petal layers, deep red-orange in the core, bright orange
// at the frilly edges, each petal darker at its base and lit at its crinkled rim; lit from the light direction lx.
const Marigold: React.FC<{R: number; seed: number; lx: number}> = ({R, seed, lx}) => {
  const sinE = 0.6, cosE = 0.8, Ln = [0.62 * lx, 0.62, 0.22], ll = Math.hypot(Ln[0], Ln[1], Ln[2]);
  const items: {depth: number; node: React.ReactNode}[] = [];
  const N = 380;
  for (let i = 0; i < N; i++) {
    const t = (i + 0.5) / N, rr = clamp01(Math.sqrt(t) * 1.02 + (rnd(i, 330) - 0.5) * 0.05), ang = i * 2.39996 + seed + (rnd(i, 331) - 0.5) * 0.5;
    const X = Math.cos(ang) * rr, Z = Math.sin(ang) * rr, Y = Math.sqrt(Math.max(0, 1 - rr * rr)) * 0.74 + 0.07 * (rnd(i, 332) - 0.5);
    const sx = X * R * (1 + 0.05 * (rnd(i, 337) - 0.5)), sy = (Z * sinE - Y * cosE) * R, depth = Z * cosE + Y * sinE;
    const nl = Math.hypot(X, Y / 0.6, Z) || 1, lam = Math.max(0, (X * Ln[0] + (Y / 0.6) * Ln[1] + Z * Ln[2]) / nl / ll);
    const dirA = (Math.atan2(Math.sin(ang) * sinE + (rr < 0.4 ? -0.7 : -0.2), Math.cos(ang)) * 180) / Math.PI + (rnd(i, 333) - 0.5) * 80;
    const size = (R * (0.1 + 0.12 * rr) * (0.8 + 0.45 * rnd(i, 334))) / 10, kx = rr > 0.72 ? 0.62 + 0.38 * Math.abs(Math.cos(ang)) : 0.82 + 0.18 * rnd(i, 335);
    const core = clamp01((0.36 - rr) / 0.3);
    const base = mix(mix("#FF9C1C", "#F27A0E", rnd(i, 336) * 0.7), "#C8420A", core * 0.8);
    const c = mix(base, "#8E2606", (1 - lam) * 0.5), hi = mix(c, "#FFD872", 0.25 + 0.45 * lam);
    items.push({depth, node: <g key={i} transform={`translate(${n1(sx)} ${n1(sy)}) rotate(${n1(dirA)}) scale(${(size * kx).toFixed(3)} ${size.toFixed(3)})`}>
      <path d={MPETAL[i % 5]} fill={mix(c, "#5A1404", 0.5)} transform="translate(-0.5 0.5)"/>
      <path d={MPETAL[i % 5]} fill={c}/>
      <path d={MPETAL[(i + 2) % 5]} fill={hi} transform="translate(3.8 0) scale(0.6 0.84)"/>
    </g>});
  }
  items.sort((a, b) => a.depth - b.depth);
  return (
    <g>
      <ellipse cx={R * 0.3} cy={R * 0.3} rx={R * 1.25} ry={R * 0.44} fill="url(#th-shade)" opacity={0.9}/>
      {/* two serrated leaves under the head */}
      {[-1, 1].map((sd) => <path key={sd} d={smooth([[sd * R * 0.3, R * 0.1, "c"], [sd * R * 0.7, R * 0.16], [sd * R * 0.98, R * 0.24], [sd * R * 1.06, R * 0.2], [sd * R * 1.18, R * 0.24], [sd * R * 1.34, R * 0.14, "c"], [sd * R * 1.14, R * 0.08], [sd * R * 1.08, R * 0.02], [sd * R * 0.8, R * 0.0], [sd * R * 0.55, R * 0.0]])} fill="#26360E" stroke="#C8C070" strokeWidth={1} strokeOpacity={0.35}/>)}
      <ellipse cx={0} cy={-R * 0.16} rx={R * 0.9} ry={R * 0.72} fill="#9A3008"/>
      {items.map((it) => it.node)}
      <ellipse cx={-R * 0.3 * lx} cy={-R * 0.56} rx={R * 0.5} ry={R * 0.24} fill="url(#th-warm)" opacity={0.3}/>
    </g>
  );
};
// A ripe mango lying on its side: kidney-shaped, broad at the stem end (right) with a stem nub, the apex (left) turned
// down with its little beak; green at the shoulder, yellow, a red blush; lit from the upper left.
const MANGO = smooth([[90, -26], [62, -44], [24, -51], [-16, -48], [-52, -38], [-78, -22], [-92, -4], [-93, 9], [-88, 19], [-83, 28, "c"], [-78, 24], [-70, 27], [-56, 35], [-24, 45], [14, 49], [50, 43], [78, 28], [94, 8], [97, -10]]);
const Mango: React.FC<{s: number}> = ({s}) => {
  const id = uid();
  return (
    <g transform={`scale(${s})`}>
      <defs>
        <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1={96} y1={-30} x2={-94} y2={20}><stop offset="0" stopColor="#6E8A26"/><stop offset="0.16" stopColor="#A8A834"/><stop offset="0.38" stopColor="#ECC246"/><stop offset="0.7" stopColor="#F4A63A"/><stop offset="1" stopColor="#E88C2E"/></linearGradient>
        <radialGradient id={`${id}r`}><stop offset="0" stopColor="#C8302A" stopOpacity={0.8}/><stop offset="0.5" stopColor="#D04A2A" stopOpacity={0.4}/><stop offset="1" stopColor="#D85A2A" stopOpacity={0}/></radialGradient>
        <radialGradient id={`${id}d`} gradientUnits="userSpaceOnUse" cx={34} cy={44} r={110}><stop offset="0" stopColor="#2A0C06" stopOpacity={0.7}/><stop offset="0.6" stopColor="#2A0C06" stopOpacity={0.25}/><stop offset="1" stopColor="#2A0C06" stopOpacity={0}/></radialGradient>
        <clipPath id={`${id}c`}><path d={MANGO}/></clipPath>
      </defs>
      <ellipse cx={26} cy={42} rx={100} ry={18} fill="url(#th-shade)" opacity={0.9}/>
      <path d={MANGO} fill={`url(#${id}g)`}/>
      <g clipPath={`url(#${id}c)`}>
        <ellipse cx={34} cy={-30} rx={62} ry={32} fill={`url(#${id}r)`}/>
        <ellipse cx={-10} cy={-40} rx={30} ry={16} fill={`url(#${id}r)`} opacity={0.6}/>
        <path d={MANGO} fill={`url(#${id}d)`}/>
        {/* the faint ridge from the stem to the beak, and the pale lenticels */}
        <path d="M 88 -18 C 40 -2 -30 10 -82 24" fill="none" stroke="#FFF0B0" strokeWidth={1.2} opacity={0.18}/>
        {Array.from({length: 34}, (_, i) => <circle key={i} cx={-80 + rnd(i, 361) * 166} cy={-44 + rnd(i, 362) * 86} r={0.7 + 0.6 * rnd(i, 363)} fill="#FFF2C4" opacity={0.3}/>)}
        <ellipse cx={-34} cy={-28} rx={26} ry={9} transform="rotate(-14 -34 -28)" fill="url(#th-hot)" opacity={0.8}/>
      </g>
      <path d="M -88 -6 C -74 -30 -40 -46 4 -50" fill="none" stroke="#FFF0C0" strokeWidth={1.8} opacity={0.6}/>
      {/* the stem end: a little cavity and the cut stalk */}
      <ellipse cx={86} cy={-28} rx={9} ry={5} fill="#4A4012" opacity={0.7}/>
      <path d={band([[86, -28], [90, -36], [97, -42]], 6.5, 5, 1, "round")} fill="#3E2C12"/>
      <ellipse cx={97} cy={-42} rx={3} ry={2.2} fill="#8A7040"/>
    </g>
  );
};
// A copper lota with a spout, upright: base at (0, 0), mouth at y = -186; the spout leaves the shoulder on the left.
const LOTA = smooth([[-46, 0, "c"], [-50, -5], [-44, -10], [-70, -22], [-92, -44], [-102, -72], [-98, -104], [-82, -128], [-60, -144], [-44, -152], [-40, -162], [-48, -172], [-62, -180], [-64, -186, "c"], [64, -186, "c"], [62, -180], [48, -172], [40, -162], [44, -152], [60, -144], [82, -128], [98, -104], [102, -72], [92, -44], [70, -22], [44, -10], [50, -5], [46, 0, "c"]]);
const SPOUT = band([[-74, -116], [-98, -138], [-118, -160], [-131, -176]], 17, 8, 1, "round");
const SPOUT_TIP: V2 = [-133, -179];
// The rice-flour kolam border: two lines weaving round a row of dots, little loops at the crossings, edged by two
// straight lines; drawn flat on the floor (y squashed by the view).
const kolam = (x0: number, x1: number, yc: number, a: number, P: number, sq: number): string => {
  const m: string[] = [];
  for (const sd of [-1, 1]) m.push(lineD(Array.from({length: Math.ceil((x1 - x0) / 4) + 1}, (_, i) => { const x = Math.min(x1, x0 + i * 4); return [x, yc + sd * a * sq * Math.sin((Math.PI * (x - x0)) / P)]; })));
  for (const sd of [-1, 1]) m.push(`M ${n1(x0)} ${n1(yc + sd * (a + 12) * sq)} L ${n1(x1)} ${n1(yc + sd * (a + 12) * sq)}`);
  for (let x = x0, k = 0; x <= x1 + 0.1; x += P, k++) {
    const sd = k % 2 ? 1 : -1, y = yc + sd * (a + 12) * sq, ry = 10 * sq;
    m.push(`M ${n1(x - 5)} ${n1(y)} C ${n1(x - 7)} ${n1(y + sd * ry * 1.6)} ${n1(x + 7)} ${n1(y + sd * ry * 1.6)} ${n1(x + 5)} ${n1(y)}`);
  }
  return m.join(" ");
};
const kolamDots = (x0: number, x1: number, yc: number, P: number, r: number): string => {
  let d = "";
  for (let x = x0 + P / 2; x < x1; x += P) d += `M ${n1(x - r)} ${n1(yc)} a ${r} ${r * 0.6} 0 1 0 ${n1(2 * r)} 0 a ${r} ${r * 0.6} 0 1 0 ${n1(-2 * r)} 0 `;
  return d;
};
const Offering: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), id = uid();
  const mood = moodOf(s, "night");
  const amb = {night: "#2E2350", dusk: "#4A2B5C", dawn: "#2F3D6E", gold: "#5A3048"}[mood];
  const atIn: number[] = Array.isArray(s.at) ? s.at.map(Number) : [];
  const at = [0.13, 0.26, 0.39, 0.53].map((d, i) => (Number.isFinite(atIn[i]) ? clamp01(atIn[i]) : d));
  const labels: string[] = Array.isArray(s.labels) ? s.labels.slice(0, 4).map(String) : [];
  // each gift arrives inside a breath of light: the flash swells, the gift is there at its height, it settles
  const AT = at.map((a) => a * n);
  const flashP = AT.map((a) => clamp01((f - (a - 12)) / 26));
  const here = AT.map((a) => f >= a);
  const settle = AT.map((a) => (1 - sstep((f - a) / 16)) * -16);
  const glowAfter = AT.map((a) => { const t = (f - a) / 40; return t < 0 || t > 1 ? 0 : Math.sin(Math.PI * Math.min(1, t * 2)) * (1 - t); });
  // the plate, the lamp on it
  const PX = 960, PY = 716, PR = 560, PQ = 0.34;
  const DX = 604, DY = 654, DS = 1.5, wick = diyaWick(DX, DY, DS);
  const light: V2 = [wick[0], wick[1] - 26];
  const WALL = 330;
  // the water: a lota comes in from the top right, tilts, pours from its spout into the bowl, tilts back and leaves
  const BX = 1278, BY = 694;
  const wT = AT[3], wD = Math.max(42, n * 0.15);
  const inL = sstep((f - (wT - 38)) / 36), outL = sstep((f - (wT + wD + 6)) / 40);
  const tilt = -60 * inL * (1 - outL) - 6 * outL;
  const lp: V2 = [lerp(1790, 1528, inL) + outL * 260, lerp(-280, 300, inL) - outL * 640];
  const rot = (p: V2, deg: number): V2 => { const a = (deg * Math.PI) / 180, c = Math.cos(a), sn = Math.sin(a); return [p[0] * c - p[1] * sn, p[0] * sn + p[1] * c]; };
  const tipRel = rot([SPOUT_TIP[0], SPOUT_TIP[1] + 100], tilt), dirRel = rot([-0.6, -0.8], tilt);
  const S0: V2 = [lp[0] + tipRel[0], lp[1] + tipRel[1]];
  const pour = f >= wT && f <= wT + wD + 10 ? 1 : 0;
  const head = sstep((f - wT) / 9), tail = sstep((f - wT - wD) / 9);
  const level = sstep((f - wT - 6) / (wD + 10));
  const surfY = BY + lerp(14, 4, level);
  const B: V2 = [BX - 6, surfY];
  const C: V2 = [S0[0] + dirRel[0] * 110, S0[1] + dirRel[1] * 110 + 30];
  const bez = (u: number): V2 => { const v = 1 - u; return [v * v * S0[0] + 2 * v * u * C[0] + u * u * B[0], v * v * S0[1] + 2 * v * u * C[1] + u * u * B[1]]; };
  const NS = 26, sPts: V2[] = Array.from({length: NS + 1}, (_, i) => { const u = lerp(tail, head, i / NS), p = bez(u); return [p[0] + Math.sin(f / 4 + u * 9) * 1.2 * u, p[1]]; });
  const sW = (i: number) => lerp(11, 6.5, i / NS) * (1 + 0.12 * Math.sin(i * 1.3 - f * 0.8));
  const sideOf = (sd: number) => sPts.map((p, i) => { const nn = nrmAt(sPts, i); return [p[0] + (nn[0] * sd * sW(i)) / 2, p[1] + (nn[1] * sd * sW(i)) / 2]; });
  const z = push(f, n, 1.12, 1.16);
  const shadowTo = (x: number, y: number, len: number): V2 => { const dx = x - light[0], dy = (y - light[1]) * 2.2, l = Math.hypot(dx, dy) || 1; return [(dx / l) * len, (dy / l) * len * 0.4]; };
  // the stone behind: the wall with its niche (its back faintly lit), the plinth, a pillar's lotus base
  const wallNiche = niche({x: 960, y: 278, w: 150, h: 128, wall: [-140, -200, W + 140, WALL - 52], courses: false});
  const plinth = ledge({x0: -140, x1: W + 140, y: WALL - 52, h: 52, seed: 3, wall: 0});
  const col = pillar({x: 1655, y: WALL + 64, h: 1180});
  const sa = labels.filter((t) => /[ऀ-ॿ]/.test(t)).join(" "), en = labels.filter((t) => !/[ऀ-ॿ]/.test(t)).join(" ");
  const cur = here.lastIndexOf(true);
  return (
    <Frame f={f} zoom={z} cx={960} cy={700} overlay={labels.length ? <Label sa={sa} en={en} hl={cur >= 0 && labels[cur] && /[ऀ-ॿ]/.test(labels[cur]) ? labels[cur] : undefined} f={f} at={AT[0] - 4} until={n + 30}/> : null}>
      <ThreadDefs/>
      <defs>
        <radialGradient id={`${id}fl`} cx={light[0]} cy={light[1] + 80} r={1150} gradientUnits="userSpaceOnUse" gradientTransform={`translate(${light[0]} ${light[1] + 80}) scale(1 0.55) translate(${-light[0]} ${-(light[1] + 80)})`}>
          <stop offset="0" stopColor="#FFB868" stopOpacity={0.62}/><stop offset="0.12" stopColor="#E8904A" stopOpacity={0.38}/><stop offset="0.32" stopColor="#A0503A" stopOpacity={0.16}/><stop offset="0.62" stopColor="#4A2B5C" stopOpacity={0.05}/><stop offset="1" stopColor="#2E2350" stopOpacity={0}/>
        </radialGradient>
        <radialGradient id={`${id}wl`} cx={light[0]} cy={WALL} r={1000} gradientUnits="userSpaceOnUse" gradientTransform={`translate(${light[0]} ${WALL}) scale(1 0.7) translate(${-light[0]} ${-WALL})`}>
          <stop offset="0" stopColor="#C8743A" stopOpacity={0.42}/><stop offset="0.3" stopColor="#7A3A2A" stopOpacity={0.2}/><stop offset="1" stopColor="#2E1A30" stopOpacity={0}/>
        </radialGradient>
        <radialGradient id={`${id}amb`} cx={W / 2} cy={-200} r={1300} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor={amb} stopOpacity={0.3}/><stop offset="1" stopColor={amb} stopOpacity={0}/></radialGradient>
        <radialGradient id={`${id}dk`} cx={PX - 60} cy={PY - 60} r={1250} gradientUnits="userSpaceOnUse" gradientTransform={`translate(${PX - 60} ${PY - 60}) scale(1 0.78) translate(${-(PX - 60)} ${-(PY - 60)})`}><stop offset="0.34" stopColor="#030108" stopOpacity={0}/><stop offset="0.68" stopColor="#030108" stopOpacity={0.55}/><stop offset="1" stopColor="#030108" stopOpacity={0.92}/></radialGradient>
        <radialGradient id={`${id}kl`} cx={light[0]} cy={light[1]} r={1100} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FFF0D0" stopOpacity={0.55}/><stop offset="0.45" stopColor="#F2E2C8" stopOpacity={0.2}/><stop offset="1" stopColor="#E8DCC8" stopOpacity={0.06}/></radialGradient>
        <radialGradient id={`${id}st`}><stop offset="0" stopColor="#24161E" stopOpacity={0.55}/><stop offset="1" stopColor="#24161E" stopOpacity={0}/></radialGradient>
        <radialGradient id={`${id}nb`} cx={960} cy={200} r={120} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#B8703C" stopOpacity={0.5}/><stop offset="0.6" stopColor="#5A2A26" stopOpacity={0.35}/><stop offset="1" stopColor="#1A0E18" stopOpacity={0.2}/></radialGradient>
        <linearGradient id={`${id}rim`} gradientUnits="userSpaceOnUse" x1={PX - PR * 0.8} y1={PY - PR * PQ} x2={PX + PR * 0.8} y2={PY + PR * PQ}><stop offset="0" stopColor="#FFEDB8"/><stop offset="0.18" stopColor="#E0A44C"/><stop offset="0.5" stopColor="#8A5620"/><stop offset="0.8" stopColor="#3A220C"/><stop offset="1" stopColor="#1E1006"/></linearGradient>
        <linearGradient id={`${id}side`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#C08A3C"/><stop offset="0.35" stopColor="#6A4218"/><stop offset="1" stopColor="#1A0C06"/></linearGradient>
        <linearGradient id={`${id}slope`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8B060"/><stop offset="1" stopColor="#6A4218"/></linearGradient>
        <radialGradient id={`${id}well`} gradientUnits="userSpaceOnUse" cx={PX - 200} cy={PY - 40} r={620} gradientTransform={`translate(${PX - 200} ${PY - 40}) scale(1 0.42) translate(${-(PX - 200)} ${-(PY - 40)})`}><stop offset="0" stopColor="#FFD488"/><stop offset="0.22" stopColor="#C48A3A"/><stop offset="0.6" stopColor="#5A3814"/><stop offset="1" stopColor="#24140A"/></radialGradient>
        <radialGradient id={`${id}bw`} gradientUnits="userSpaceOnUse" cx={BX - 30} cy={BY - 6} r={90}><stop offset="0" stopColor="#E8B060"/><stop offset="0.5" stopColor="#8A5A24"/><stop offset="1" stopColor="#2A160A"/></radialGradient>
        <linearGradient id={`${id}lota`} gradientUnits="userSpaceOnUse" x1={-104} y1={0} x2={104} y2={0}><stop offset="0" stopColor="#E89A60"/><stop offset="0.08" stopColor="#FFD3A0"/><stop offset="0.2" stopColor="#D07A44"/><stop offset="0.42" stopColor="#8A3A1C"/><stop offset="0.75" stopColor="#3A140A"/><stop offset="1" stopColor="#6A2E16"/></linearGradient>
        <linearGradient id={`${id}st2`} gradientUnits="userSpaceOnUse" x1={S0[0]} y1={S0[1]} x2={B[0]} y2={B[1]}><stop offset="0" stopColor="#FFF6E0" stopOpacity={0.7}/><stop offset="1" stopColor="#FFE6B8" stopOpacity={0.5}/></linearGradient>
        <radialGradient id={`${id}water`} cx="0.36" cy="0.4" r="0.7"><stop offset="0" stopColor="#9A7050"/><stop offset="0.5" stopColor="#3A2228"/><stop offset="1" stopColor="#140A12"/></radialGradient>
      </defs>
      {/* the stone floor: one dark slab of stone, warm in the lamp's pool, mottled, cool and dark beyond */}
      <rect x={-140} y={-200} width={W + 280} height={H + 400} fill="#0E0810"/>
      {Array.from({length: 9}, (_, i) => <ellipse key={i} cx={-60 + rnd(i, 371) * (W + 120)} cy={WALL + 60 + rnd(i, 372) * 700} rx={180 + rnd(i, 373) * 260} ry={50 + rnd(i, 374) * 90} fill={`url(#${id}st)`} opacity={0.8}/>)}
      <rect x={-140} y={-200} width={W + 280} height={H + 400} fill={`url(#${id}amb)`}/>
      <rect x={-140} y={WALL - 60} width={W + 280} height={H} fill={`url(#${id}fl)`}/>
      {/* the kolam: a border before the wall and one at our feet, in rice flour, brightest near the flame */}
      <path d={kolam(-120, W + 120, WALL + 58, 13, 44, 0.42)} fill="none" stroke={`url(#${id}kl)`} strokeWidth={2} strokeLinecap="round"/>
      <path d={kolamDots(-120, W + 120, WALL + 58, 44, 2.6)} fill="#F2E4CC" opacity={0.3}/>
      <path d={kolam(-140, W + 140, 1010, 22, 72, 0.5)} fill="none" stroke={`url(#${id}kl)`} strokeWidth={2.8} strokeLinecap="round"/>
      <path d={kolamDots(-140, W + 140, 1010, 72, 3.6)} fill="#F2E4CC" opacity={0.25}/>
      {/* the wall: the niche's back faintly lit, the wall and the niche's frame in shadow, the plinth, the pillar */}
      <rect x={880} y={110} width={160} height={180} fill={`url(#${id}nb)`}/>
      <Rimmed paths={wallNiche} point={light} light={[-1, 1]} fill="#130A18" rim="#C88A50" w={2.2}/>
      <rect x={-140} y={-200} width={W + 280} height={WALL + 200} fill={`url(#${id}wl)`}/>
      <Rimmed paths={plinth} point={light} light={[-1, 1]} fill="#150C1A" rim="#9A6440" w={1.4}/>
      <Rimmed paths={col} point={light} light={[-1, 1]} fill="#160C1A" rim="#D89A5C" w={2.8}/>
      <rect x={-140} y={WALL} width={W + 280} height={40} fill="url(#th-down)" opacity={0.6}/>
      {/* loose petals on the floor */}
      {[[1600, 880, 20], [1650, 905, -40], [300, 860, 60], [380, 952, 10], [1500, 960, 80]].map(([x, y, a], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${a}) scale(1.6 0.9)`}><path d={MPETAL[i % 5]} fill={i % 2 ? "#C8501C" : "#E8862E"} opacity={0.85}/></g>)}
      {/* the plate: shadow, the side of the rim, the rim, the inner slope, the well with its engraved rings */}
      <ellipse cx={PX + 70} cy={PY + 34} rx={PR * 1.08} ry={PR * PQ * 1.2} fill="url(#th-shade)" opacity={0.95}/>
      <path d={`M ${PX - PR} ${PY} A ${PR} ${PR * PQ} 0 0 0 ${PX + PR} ${PY} L ${PX + PR - 4} ${PY + 16} A ${PR - 4} ${(PR - 4) * PQ} 0 0 1 ${PX - PR + 4} ${PY + 16} Z`} fill={`url(#${id}side)`}/>
      <ellipse cx={PX} cy={PY} rx={PR} ry={PR * PQ} fill={`url(#${id}rim)`}/>
      <ellipse cx={PX} cy={PY + 2} rx={PR - 26} ry={(PR - 26) * PQ} fill={`url(#${id}slope)`} opacity={0.9}/>
      <ellipse cx={PX} cy={PY + 8} rx={PR - 40} ry={(PR - 40) * PQ} fill={`url(#${id}well)`}/>
      {[0.2, 0.42, 0.66, 0.88].map((k, i) => <g key={i}>
        <ellipse cx={PX} cy={PY + 8} rx={(PR - 40) * k} ry={(PR - 40) * k * PQ} fill="none" stroke="#2A1606" strokeWidth={1.2} opacity={0.4}/>
        <ellipse cx={PX} cy={PY + 9.5} rx={(PR - 40) * k} ry={(PR - 40) * k * PQ} fill="none" stroke="#FFD890" strokeWidth={0.8} opacity={0.16}/>
      </g>)}
      {Array.from({length: 48}, (_, i) => { const a = (i / 48) * Math.PI * 2; return <circle key={i} cx={PX + Math.cos(a) * (PR - 13)} cy={PY + Math.sin(a) * (PR - 13) * PQ} r={2} fill="#2A1606" opacity={0.45}/>; })}
      <path d={`M ${PX - PR + 4} ${PY - 2} A ${PR - 4} ${(PR - 4) * PQ} 0 0 1 ${PX - 60} ${PY - (PR - 4) * PQ + 1}`} fill="none" stroke="#FFF4D0" strokeWidth={2.8} opacity={0.8}/>
      {/* the brass mirrors the flame */}
      <Glow x={light[0] + 4} y={DY + 40} rx={26} ry={70} g="th-soft" o={0.7}/>
      {/* grains of rice, a few petals on the plate */}
      {Array.from({length: 30}, (_, i) => { const a = rnd(i, 311) * 6.28, rr = Math.sqrt(rnd(i, 312)) * 52, x = 880 + Math.cos(a) * rr * 1.7, y = 742 + Math.sin(a) * rr * 0.5; return <ellipse key={i} cx={x} cy={y} rx={3.4} ry={1.5} transform={`rotate(${n1(rnd(i, 313) * 180)} ${n1(x)} ${n1(y)})`} fill="#F4E6C8" opacity={0.8}/>; })}
      {/* the diya on the plate: its flame is the scene's one light */}
      <Diya x={DX} y={DY} s={DS} f={f} seed={4} calm={0.9}/>
      {/* the leaf */}
      {here[0] ? <g transform={`translate(0 ${n1(settle[0])})`}>
        <g transform={`translate(${n1(shadowTo(760, 790, 22)[0])} ${n1(shadowTo(760, 790, 22)[1] + 8)})`} opacity={0.6}><g transform="translate(640 800) scale(1 0.44) rotate(-10)"><path d={smooth(PEEPAL.map((p) => [p[0] * 236, p[1] * 236, p[2]] as Pt))} fill="#120806"/></g></g>
        <g transform="translate(640 800) scale(1 0.44) rotate(-10)"><PeepalLeaf L={236}/></g>
      </g> : null}
      {/* the bowl for water */}
      <g>
        <ellipse cx={BX + 30} cy={BY + 34} rx={100} ry={24} fill="url(#th-shade)" opacity={0.85}/>
        <path d={`M ${BX - 76} ${BY} C ${BX - 76} ${BY + 34} ${BX - 36} ${BY + 50} ${BX} ${BY + 50} C ${BX + 36} ${BY + 50} ${BX + 76} ${BY + 34} ${BX + 76} ${BY} Z`} fill={`url(#${id}side)`}/>
        <ellipse cx={BX} cy={BY} rx={76} ry={26} fill="#1A0E08"/>
        <ellipse cx={BX} cy={BY - 2} rx={70} ry={22} fill={`url(#${id}bw)`} opacity={0.55}/>
        {level > 0.01 ? <g>
          <ellipse cx={BX} cy={surfY} rx={lerp(50, 66, level)} ry={lerp(15, 21, level)} fill={`url(#${id}water)`}/>
          <ellipse cx={BX - 22} cy={surfY - 4} rx={12} ry={3.4} fill="url(#th-hot)" opacity={0.8 * level}/>
          {/* the splash ring: ripples spreading from where the water strikes */}
          {[0, 1, 2, 3].map((k) => { const ag = ((((f - wT + k * 11) % 44) + 44) % 44) / 44; const live = f > wT ? Math.max(pour * head, 1 - sstep((f - wT - wD) / 40)) : 0;
            return live > 0.01 ? <ellipse key={k} cx={B[0]} cy={surfY} rx={6 + ag * 54} ry={2 + ag * 18} fill="none" stroke="#FFE6B0" strokeWidth={1.2} opacity={(1 - ag) * 0.65 * live}/> : null; })}
        </g> : null}
        <ellipse cx={BX} cy={BY} rx={76} ry={26} fill="none" stroke="#FFD890" strokeWidth={2} opacity={0.65}/>
        <path d={`M ${BX - 74} ${BY - 4} A 76 26 0 0 1 ${BX - 8} ${BY - 26}`} fill="none" stroke="#FFF4D0" strokeWidth={2.2} opacity={0.75}/>
      </g>
      {/* the flower */}
      {here[1] ? <g transform={`translate(920 ${n1(652 + settle[1])})`}><Marigold R={78} seed={0.7} lx={-1}/></g> : null}
      {/* the fruit */}
      {here[2] ? <g transform={`translate(1060 ${n1(806 + settle[2])}) rotate(-5)`}><Mango s={1.08}/></g> : null}
      {/* the stream: from the spout in an arc, catching the lamp on its near side, striking the bowl */}
      {pour && head > tail + 0.01 ? <g>
        <path d={lineD([...sideOf(-1), ...sideOf(1).reverse()]) + " Z"} fill={`url(#${id}st2)`} opacity={0.42}/>
        <path d={ribbon(sideOf(-0.7), 2, 1.4)} fill="#FFF8E4" opacity={0.9}/>
        <path d={ribbon(sideOf(0.8), 1.1, 0.8)} fill="#FFD8A0" opacity={0.45}/>
        {Array.from({length: 9}, (_, k) => { const u = (f * 0.05 + k / 9) % 1; if (u < tail || u > head) return null; const p = bez(u); return <ellipse key={k} cx={p[0] - 2} cy={p[1]} rx={1.6} ry={5 + 5 * u} fill="#FFFFFF" opacity={0.75 * Math.sin(Math.PI * u)}/>; })}
        {head > 0.98 && tail < 0.02 ? Array.from({length: 7}, (_, k) => { const ph2 = (f * 0.08 + k / 7) % 1, a = (k / 7) * Math.PI * 2 + 0.4; return <circle key={k} cx={B[0] + Math.cos(a) * 22 * ph2} cy={surfY - 22 * Math.sin(Math.PI * ph2) + Math.sin(a) * 6 * ph2} r={1.8} fill="#FFF2D0" opacity={0.85 * (1 - ph2)}/>; }) : null}
        {head > 0.98 ? <Glow x={B[0]} y={surfY} rx={40} ry={13} g="th-hot" o={0.6}/> : null}
      </g> : null}
      {/* the lota: copper, the lamp on its lower side */}
      {inL > 0 && outL < 1 ? <g transform={`translate(${n1(lp[0])} ${n1(lp[1])}) rotate(${n1(tilt)}) translate(0 100)`}>
        <path d={SPOUT} fill={`url(#${id}lota)`}/>
        <path d={LOTA} fill={`url(#${id}lota)`}/>
        {[-148, -60].map((y, i) => <g key={i}><path d={`M ${i ? -100 : -64} ${y} Q 0 ${y + 14} ${i ? 100 : 64} ${y}`} fill="none" stroke="#2A0E06" strokeWidth={1.8} opacity={0.6}/><path d={`M ${i ? -100 : -64} ${y + 2} Q 0 ${y + 16} ${i ? 100 : 64} ${y + 2}`} fill="none" stroke="#FFC890" strokeWidth={0.9} opacity={0.35}/></g>)}
        <ellipse cx={-70} cy={-84} rx={11} ry={46} fill="url(#th-hot)" opacity={0.55}/>
        <ellipse cx={0} cy={-186} rx={64} ry={14} fill="#B0603A"/>
        <ellipse cx={0} cy={-185} rx={52} ry={10} fill="#140604"/>
        <path d="M -64 -186 A 64 14 0 0 0 16 -173" fill="none" stroke="#FFD8B0" strokeWidth={1.8} opacity={0.6}/>
        <path d={LOTA} fill="none" stroke="#FFC890" strokeWidth={1.1} opacity={0.3}/>
        <circle cx={SPOUT_TIP[0]} cy={SPOUT_TIP[1]} r={4.5} fill="#2A0E06"/>
      </g> : null}
      {/* light accepting each gift */}
      {[0, 1, 2].map((i) => { const pos: V2[] = [[700, 790], [920, 640], [1060, 800]]; return <g key={i}>
        <LightFlash p={flashP[i]} x={pos[i][0]} y={pos[i][1]} r={150}/>
        <Glow x={pos[i][0]} y={pos[i][1]} rx={200} ry={90} g="th-warm" o={glowAfter[i] * 0.7}/>
      </g>; })}
      <Glow x={BX} y={BY} rx={170} ry={70} g="th-warm" o={glowAfter[3] * 0.7}/>
      <Glow x={960} y={200} rx={120} ry={150} g="th-soft" o={0.25 + 0.5 * Math.max(...glowAfter)}/>
      {/* darkness closing in */}
      <rect x={-140} y={-200} width={W + 280} height={H + 400} fill={`url(#${id}dk)`}/>
    </Frame>
  );
};

// =====================================================================================================================
// 4.42 SWORD: a dark tangle of thorny briar (variant "knot": a knot of black thread) across the light; a blade of pure
// light sweeps through it, the strands fall away, and the light pours through.
// =====================================================================================================================
type Vine = {pts: V2[]; w0: number; w1: number; thorns: boolean; layer: number; parent?: number; base?: number};
const wrapA = (a: number) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
// A cane grown as a smooth random walk: its heading turns by a slow sum of sines, now and then it curls into a loop,
// and a weak pull keeps it near the middle of the frame (strong for the knot, which must stay a ball).
const walk = (P0: V2, a0: number, seed: number, o: {step: number; c: number; maxSteps: number; minSteps: number; loopP: number; R: number; pull: number; cx?: number; cy?: number}): V2[] => {
  const pts: V2[] = [P0], cx = o.cx ?? 960, cy = o.cy ?? 540;
  let x = P0[0], y = P0[1], a = a0, loopLeft = 0, loopDir = 1, loopRate = 0.2;
  for (let k = 0; k < o.maxSteps; k++) {
    let curv = o.c * (Math.sin(k * 0.085 + rnd(seed, 1) * 6.28) + 0.6 * Math.sin(k * 0.21 + rnd(seed, 2) * 6.28));
    if (loopLeft > 0) { curv = loopDir * loopRate; loopLeft--; }
    else if (k > 6 && rnd(seed * 13 + k, 3) < o.loopP) { loopRate = 0.1 + rnd(seed + k, 5) * 0.1; loopLeft = Math.round((3.4 + rnd(seed + k, 6) * 2.4) / loopRate); loopDir = rnd(seed + k, 4) < 0.5 ? 1 : -1; }
    const dx = cx - x, dy = cy - y, d = Math.hypot(dx, dy * 1.5);
    a += curv + wrapA(Math.atan2(dy, dx) - a) * o.pull * sstep((d - o.R) / 260);
    x += Math.cos(a) * o.step; y += Math.sin(a) * o.step;
    pts.push([x, y]);
    if (k > o.minSteps && (x < -170 || x > W + 170 || y < -170 || y > H + 170)) break;
  }
  return pts;
};
const genBriar = (): Vine[] => {
  const out: Vine[] = [];
  const main = (i: number, layer: number) => {
    const r = (k: number) => rnd(i, k + 600 + layer * 40);
    const P0 = edgePt(layer === 2 ? [0.15, 1.6, 2.4, 3.55][i - 40] : r(1) * 4), aim = Math.atan2(540 - P0[1], 960 - P0[0]) + (layer === 2 ? [1, -1, 1, -1][i - 40] * 1.05 : (r(2) - 0.5) * 1.1);
    const pts = walk(P0, aim, i * 7 + 3 + layer * 101, {step: 14, c: layer === 2 ? 0.03 : 0.045, maxSteps: 260, minSteps: 40, loopP: layer === 0 ? 0.0016 : 0.001, R: layer === 2 ? 700 : 340, pull: 0.02});
    out.push({pts, w0: layer === 1 ? 5 + r(3) * 5 : layer === 2 ? 30 + r(3) * 12 : 11 + r(3) * 9, w1: layer === 1 ? 2 + r(4) * 2 : layer === 2 ? 12 : 3 + r(4) * 3, thorns: true, layer});
    if (layer) return;
    // side shoots
    const pi = out.length - 1, ns = 2 + Math.floor(r(5) * 3);
    for (let k = 0; k < ns; k++) {
      const b = Math.floor(pts.length * (0.15 + 0.7 * r(10 + k))), p = pts[b], q = pts[Math.min(pts.length - 1, b + 1)];
      const a = Math.atan2(q[1] - p[1], q[0] - p[0]) + (r(20 + k) < 0.5 ? -1 : 1) * (0.5 + r(30 + k) * 0.5), steps = 10 + Math.floor(r(40 + k) * 22);
      const sp = walk(p, a, i * 31 + k * 5 + 9, {step: 10, c: 0.07, maxSteps: steps, minSteps: steps, loopP: 0.01, R: 9999, pull: 0});
      const wb = lerp(out[pi].w0, out[pi].w1, b / (pts.length - 1));
      out.push({pts: sp, w0: wb * 0.6, w1: 1.2, thorns: true, layer: 0, parent: pi, base: b});
    }
  };
  for (let i = 0; i < 16; i++) main(i, 1);     // a dim far layer first
  for (let i = 0; i < 24; i++) main(i, 0);
  for (let i = 0; i < 4; i++) main(i + 40, 2); // and a few thick out-of-focus canes nearest the eye
  return out;
};
const genKnot = (): Vine[] => {
  const out: Vine[] = [];
  for (let i = 0; i < 26; i++) {
    const a = rnd(i, 801) * 6.28, rr = rnd(i, 802) * 170, P0: V2 = [960 + Math.cos(a) * rr * 1.3, 540 + Math.sin(a) * rr];
    out.push({pts: walk(P0, rnd(i, 803) * 6.28, i * 11 + 5, {step: 9, c: 0.12, maxSteps: 230, minSteps: 230, loopP: 0.012, R: 240, pull: 0.12}), w0: 3.8 + rnd(i, 804) * 1.8, w1: 3 + rnd(i, 805), thorns: false, layer: 0});
  }
  // loose ends trailing out of the knot to the edges of the frame
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * 6.28 + rnd(i, 811), P0: V2 = [960 + Math.cos(a) * 150, 540 + Math.sin(a) * 110];
    out.push({pts: walk(P0, a + (rnd(i, 812) - 0.5) * 0.6, i * 17 + 2, {step: 12, c: 0.035, maxSteps: 200, minSteps: 20, loopP: 0, R: 9999, pull: 0}), w0: 4, w1: 2.6, thorns: false, layer: 0});
  }
  return out;
};
const edgePt = (a: number): V2 => {
  const e = Math.floor(a) % 4, t = a - Math.floor(a);
  return e === 0 ? [lerp(-60, W + 60, t), -60] : e === 1 ? [W + 60, lerp(-60, H + 60, t)] : e === 2 ? [lerp(W + 60, -60, t), H + 60] : [-60, lerp(H + 60, -60, t)];
};
// The cut: a gentle arc rising across the frame from lower left to upper right.
const C0: V2 = [60, 980], CM: V2 = [860, 500], C1: V2 = [1880, 110];
const cutAt = (c: number): V2 => { const u = 1 - c; return [u * u * C0[0] + 2 * u * c * CM[0] + c * c * C1[0], u * u * C0[1] + 2 * u * c * CM[1] + c * c * C1[1]]; };
const CUT: V2[] = Array.from({length: 81}, (_, i) => cutAt(i / 80));
type Piece = {v: number; i0: number; i1: number; c0: number; c1: number; side: number};
const segX = (a: V2, b: V2, c: V2, d: V2): [number, number] | null => {
  const r1 = [b[0] - a[0], b[1] - a[1]], r2 = [d[0] - c[0], d[1] - c[1]], den = r1[0] * r2[1] - r1[1] * r2[0];
  if (Math.abs(den) < 1e-9) return null;
  const t = ((c[0] - a[0]) * r2[1] - (c[1] - a[1]) * r2[0]) / den, u = ((c[0] - a[0]) * r1[1] - (c[1] - a[1]) * r1[0]) / den;
  return t >= 0 && t < 1 && u >= 0 && u < 1 ? [t, u] : null;
};
const sideOf = (p: V2) => {
  let best = 1e9, sgn = 1;
  for (let k = 0; k < CUT.length - 1; k++) { const a = CUT[k], b = CUT[k + 1], d = Math.hypot(p[0] - (a[0] + b[0]) / 2, p[1] - (a[1] + b[1]) / 2); if (d < best) { best = d; sgn = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) < 0 ? 1 : -1; } }
  return sgn;
};
// Each vine split where it crosses the cut; c0 / c1: where along the cut its two ends were cut (-1: not a cut end).
const piecesOf = (vines: Vine[]): Piece[][] => vines.map((vn, v) => {
  const cuts: {i: number; t: number; c: number}[] = [];
  for (let i = 0; i < vn.pts.length - 1; i++) for (let k = 0; k < CUT.length - 1; k++) { const x = segX(vn.pts[i], vn.pts[i + 1], CUT[k], CUT[k + 1]); if (x) cuts.push({i, t: x[0], c: (k + x[1]) / (CUT.length - 1)}); }
  cuts.sort((a, b) => a.i + a.t - (b.i + b.t));
  const out: Piece[] = [];
  let i0 = 0, c0 = -1;
  [...cuts, {i: vn.pts.length - 1, t: 0, c: -1}].forEach((ct) => {
    const i1 = Math.min(vn.pts.length - 1, Math.max(i0 + 1, Math.round(ct.i + ct.t)));
    if (i1 > i0) out.push({v, i0, i1, c0, c1: ct.c, side: sideOf(vn.pts[Math.round((i0 + i1) / 2)])});
    i0 = i1; c0 = ct.c;
  });
  return out;
});
let BRIAR: {vines: Vine[]; pieces: Piece[][]} | null = null, KNOTS: {vines: Vine[]; pieces: Piece[][]} | null = null;
const tangle = (knot: boolean) => {
  if (knot) { if (!KNOTS) { const v = genKnot(); KNOTS = {vines: v, pieces: piecesOf(v)}; } return KNOTS; }
  if (!BRIAR) { const v = genBriar(); BRIAR = {vines: v, pieces: piecesOf(v)}; }
  return BRIAR;
};
// A cane (or thread) as one path: a tapered band plus hooked thorns, sparse and irregular.
const vinePath = (pts: V2[], w0: number, w1: number, thorns: boolean, seed: number): string => {
  if (pts.length < 2) return "";
  let d = ribbon(pts, w0, w1);
  if (thorns) {
    const cum = cumLen(pts), L = cum[cum.length - 1];
    for (let s = 10 + rnd(seed, 1) * 30, k = 0; s < L - 10; s += 34 + rnd(seed + k, 2) * 40, k++) {
      const p = atLen(pts, cum, s), q = atLen(pts, cum, s + 3), tx = q[0] - p[0], ty = q[1] - p[1], tl = Math.hypot(tx, ty) || 1;
      const t: V2 = [tx / tl, ty / tl], nn: V2 = [-t[1], t[0]], sd = rnd(seed + k, 4) < 0.5 ? 1 : -1, w = lerp(w0, w1, s / L) / 2;
      const len = (6 + rnd(seed + k, 3) * 7) * (0.6 + w / 9), bw = Math.max(2.5, w * 0.9);
      const b1: V2 = [p[0] - t[0] * bw + nn[0] * sd * w * 0.7, p[1] - t[1] * bw + nn[1] * sd * w * 0.7], b2: V2 = [p[0] + t[0] * bw + nn[0] * sd * w * 0.7, p[1] + t[1] * bw + nn[1] * sd * w * 0.7];
      const tip: V2 = [p[0] + nn[0] * sd * (w + len) + t[0] * len * 0.7, p[1] + nn[1] * sd * (w + len) + t[1] * len * 0.7];
      const ctl: V2 = [p[0] + nn[0] * sd * (w + len * 0.6) - t[0] * len * 0.15, p[1] + nn[1] * sd * (w + len * 0.6) - t[1] * len * 0.15];
      d += ` M ${n1(b1[0])} ${n1(b1[1])} Q ${n1(ctl[0])} ${n1(ctl[1])} ${n1(tip[0])} ${n1(tip[1])} Q ${n1((ctl[0] + b2[0]) / 2 + t[0] * 2)} ${n1((ctl[1] + b2[1]) / 2 + t[1] * 2)} ${n1(b2[0])} ${n1(b2[1])} Z`;
    }
  }
  return d;
};
const Sword: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), id = uid();
  const knot = s.variant === "knot";
  const mood = moodOf(s, "gold");
  const {vines, pieces} = tangle(knot);
  const sun: V2 = [960, 540];
  const atS = Number(s.at);
  const Tc = (s.at !== undefined && Number.isFinite(atS) ? clamp01(atS) : 0.36) * n, Dc = Math.max(18, n * 0.1);
  const fps = 30, g = 760 * Math.pow(Math.min(1.5, Math.max(0.8, 300 / n)), 2);
  const blade = (f - Tc) / Dc;
  const cutFrame = (c: number) => Tc + Dc * c;
  const pour = sstep((f - Tc - Dc * 0.5) / (n * 0.28));
  const tension = 1 - sstep((f - Tc) / (Dc * 2));
  // release time of a piece: when the last of its cut ends was cut; uncut pieces let go just after the cut, shoots with
  // the part of the cane they grow from
  const relMemo = new Map<string, number>();
  const releaseOf = (v: number, k: number): number => {
    const key = `${v}:${k}`;
    if (relMemo.has(key)) return relMemo.get(key)!;
    const pc = pieces[v][k], cs = [pc.c0, pc.c1].filter((c) => c >= 0), vn = vines[v];
    let r: number;
    const p0 = vn.pts[0];
    const pN = vn.pts[vn.pts.length - 1], lastI = vn.pts.length - 1;
    const off = (q: V2) => q[0] < -40 || q[0] > W + 40 || q[1] > H + 40;
    const rootedA = pc.i0 === 0 && pc.c1 >= 0 && p0[1] > 560 && off(p0), rootedB = pc.i1 === lastI && pc.c0 >= 0 && pN[1] > 560 && off(pN);
    if (vn.thorns && vn.parent === undefined && vn.layer !== 1 && (rootedA || rootedB) && pc.i1 - pc.i0 < 60) r = 1e9;  // stubs rooted at the lower edges stay
    else if (cs.length) r = Math.max(...cs.map(cutFrame)) + 2;
    else if (vn.parent !== undefined) { const pk = pieces[vn.parent].findIndex((q) => vn.base! >= q.i0 && vn.base! <= q.i1); r = pk >= 0 ? releaseOf(vn.parent, pk) : Tc + Dc + 10; }
    else { const m = vn.pts[Math.round((pc.i0 + pc.i1) / 2)]; let bi = 0, bd = 1e9; CUT.forEach((q, qi) => { const d = Math.hypot(q[0] - m[0], q[1] - m[1]); if (d < bd) { bd = d; bi = qi; } }); r = cutFrame(bi / (CUT.length - 1)) + 6 + Math.min(30, bd / 40) + rnd(v * 7 + k, 401) * 14; }
    relMemo.set(key, r);
    return r;
  };
  const sway = (v: number, i: number, p: V2): V2 => [p[0] + Math.sin(f / 47 + v * 1.3 + i * 0.05) * 3.5 * tension, p[1] + Math.cos(f / 59 + v * 0.7 + i * 0.04) * 3.5 * tension];
  const back: React.ReactNode[] = [], front: React.ReactNode[] = [], fore: React.ReactNode[] = [], embers: React.ReactNode[] = [];
  const nrm = [-(C1[1] - C0[1]), C1[0] - C0[0]], nl = Math.hypot(nrm[0], nrm[1]);
  pieces.forEach((pl, v) => {
    const vn = vines[v], N = vn.pts.length;
    pl.forEach((pc, k) => {
      const rel = releaseOf(v, k), tau = Math.max(0, f - rel) / fps;
      const o = 1 - sstep((tau - 1.0) / 0.9);
      if (o <= 0.01) return;
      let pts = vn.pts.slice(pc.i0, pc.i1 + 1).map((p, i) => sway(v, pc.i0 + i, p));
      if (pts.length < 2) return;
      // falling: they spring apart across the cut, then gravity takes them, turning slowly
      if (tau > 0) {
        const cen = pts[Math.floor(pts.length / 2)], apart = 30 * (1 - Math.exp(-tau * 4)) * pc.side;
        const dx = (-nrm[0] / nl) * apart + (rnd(v * 7 + k, 402) - 0.5) * 50 * tau, dy = (-nrm[1] / nl) * apart + 0.5 * g * tau * tau;
        const a = ((rnd(v * 7 + k, 403) - 0.5) * 34 * tau * tau * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a);
        pts = pts.map(([x, y]) => { const ox = x - cen[0], oy = y - cen[1]; return [cen[0] + ox * ca - oy * sa + dx, cen[1] + ox * sa + oy * ca + dy] as V2; });
      }
      const w0 = lerp(vn.w0, vn.w1, pc.i0 / (N - 1)), w1 = lerp(vn.w0, vn.w1, pc.i1 / (N - 1));
      const d = vinePath(pts, w0, w1, vn.thorns, v * 31 + k);
      if (vn.layer === 1) { back.push(<path key={`${v}-${k}`} d={d} fill="#2A1A34" opacity={o * 0.75}/>); return; }
      if (vn.layer === 2) { fore.push(<path key={`${v}-${k}`} d={d} fill="#05020A" opacity={o}/>); return; }
      const lc = pts[Math.floor(pts.length / 2)], near = clamp01(1 - Math.hypot(lc[0] - sun[0], (lc[1] - sun[1]) * 1.4) / 900);
      front.push(<g key={`${v}-${k}`} opacity={o}><Rimmed paths={[d]} light={[sun[0] - lc[0], sun[1] - lc[1]]} fill={knot ? "#0C0710" : "#100812"} rim={mix("#7A5238", "#FFD38A", near * 0.8 + pour * 0.5)} w={knot ? 1.3 : 1.7}/></g>);
    });
    // the cut ends glow for a moment
    pl.forEach((pc, k) => {
      if (pc.c1 < 0 || vn.layer !== 0) return;
      const age = (f - cutFrame(pc.c1)) / fps;
      if (age < 0 || age > 1.1) return;
      const p = vn.pts[pc.i1], yy = p[1] + 0.5 * g * age * age * 0.5;
      embers.push(<g key={`${v}-${k}e`} opacity={1 - age / 1.1}><circle cx={p[0]} cy={yy} r={26} fill="url(#th-mote)" opacity={0.8}/><circle cx={p[0]} cy={yy} r={2.6} fill="#FFFBEA"/></g>);
    });
  });
  // the blade: a long, slightly curved crescent of pure light running along the cut
  const bladeNode = (() => {
    if (blade < 0 || blade > 1.5) return null;
    const head = clamp01(blade) * 1.22, Lb = 0.3, tail = head - Lb;
    const pts: V2[] = [];
    for (let k = 0; k <= 36; k++) pts.push(cutAt(lerp(tail, head, k / 36)));
    const prof = (u: number) => Math.pow(Math.sin(Math.PI * Math.pow(u, 1.9)), 0.75);
    const band = (wmax: number, lift = 0) => {
      const L: number[][] = [], R: number[][] = [];
      pts.forEach((p, i) => { const u = i / (pts.length - 1), nn = nrmAt(pts, i), w = (wmax * prof(u)) / 2; L.push([p[0] + nn[0] * (w + lift), p[1] + nn[1] * (w + lift)]); R.push([p[0] - nn[0] * (w - lift), p[1] - nn[1] * (w - lift)]); });
      return lineD([...L, ...R.reverse()]) + " Z";
    };
    const fade = 1 - sstep((blade - 1.0) / 0.4), tip = cutAt(Math.min(1.08, head - 0.02));
    return <g opacity={fade}>
      <path d={band(150)} fill="#FFB860" opacity={0.08}/>
      <path d={band(70)} fill="#FFD9A0" opacity={0.2}/>
      <path d={band(30)} fill="#FFF0C8" opacity={0.6}/>
      <path d={band(11)} fill="#FFFFFF"/>
      <Glow x={tip[0]} y={tip[1]} rx={160} g="th-hot" o={0.75}/>
      <Glow x={tip[0]} y={tip[1]} rx={420} ry={260} g="th-warm" o={0.5}/>
    </g>;
  })();
  // the seam the blade leaves: a line of light that widens as the light pours through it
  const seamO = blade > 0 ? 1 - sstep((f - Tc - Dc * 0.8) / (n * 0.09)) : 0;
  const seamEnd = clamp01(blade * 1.22 - 0.25), widen = sstep((f - Tc - Dc * 0.6) / (n * 0.12));
  const seam = seamO > 0.01 && seamEnd > 0.01 ? lineD(Array.from({length: 41}, (_, k) => cutAt((k / 40) * seamEnd))) : "";
  return (
    <Frame f={f} zoom={push(f, n, 1.02, 1.08)} cx={sun[0]} cy={sun[1]}>
      <ThreadDefs/>
      <defs>
        <radialGradient id={`${id}d`} cx={sun[0]} cy={sun[1]} r={1100} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#140E2C" stopOpacity={0.2}/><stop offset="0.3" stopColor="#140E2C" stopOpacity={0.62}/><stop offset="0.7" stopColor="#0B0820" stopOpacity={0.9}/><stop offset="1" stopColor="#06040F" stopOpacity={0.97}/></radialGradient>
      </defs>
      <Sky mood={mood} sun={sun} sunR={64} f={f} rays={0.12 + 0.8 * pour} clouds={0.8} id={`${id}k`}/>
      <Glow x={sun[0]} y={sun[1]} rx={380 + 700 * pour} ry={300 + 500 * pour} g="th-warm" o={0.45 + 0.4 * pour}/>
      {/* until the cut, the tangle keeps the light down: a deep indigo night around a hidden warm core */}
      <rect x={-100} y={-100} width={W + 200} height={H + 200} fill={`url(#${id}d)`} opacity={1 - pour * 0.94}/>
      {back}
      {seam ? <g opacity={seamO}>
        <path d={seam} fill="none" stroke="#FFC877" strokeWidth={40 + 120 * widen} opacity={0.1 * (1 - 0.5 * widen)} strokeLinecap="round"/>
        <path d={seam} fill="none" stroke="#FFE9B8" strokeWidth={10 + 24 * widen} opacity={0.3 * (1 - 0.5 * widen)} strokeLinecap="round"/>
        <path d={seam} fill="none" stroke="#FFFDF2" strokeWidth={3} opacity={0.9 * (1 - widen)} strokeLinecap="round"/>
      </g> : null}
      {front}
      {fore}
      {embers}
      {bladeNode}
      <Dust f={f} sun={sun} n={Math.round(50 + 130 * pour)} y0={120} y1={1000}/>
    </Frame>
  );
};

export const SCENES: Record<string, React.FC<SceneP>> = {garments: Garments, pearls: Pearls, offering: Offering, sword: Sword};
