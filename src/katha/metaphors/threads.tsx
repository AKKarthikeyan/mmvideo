// Katha metaphor scenes: threads (22 Oct 2026). Worn garments cast off for new ones (2.22), all strung on Me like pearls
// on a thread (7.7, and the thread revealed), the offering of a leaf, a flower, a fruit, water (9.26), the sword of
// knowledge cutting the tangle of doubt (4.42). Lamplight look: near-black shapes rimmed with warm light, light the only
// colour. Soft light, glow, haze and smoke are radial / linear gradients only (no blur or turbulence filters).
// Props: every scene reads s.mood ("dusk" | "dawn" | "night" | "gold") and s.variant, and renders from {type, kind} alone.
//   garments: no extra props. pearls: s.variant "thread" dims the pearls and lights the thread running through them.
//   offering: s.at (four 0-1 fractions: when the leaf, flower, fruit and water appear); s.labels (optional, up to four
//   words, e.g. patraṁ puṣhpaṁ phalaṁ toyaṁ, each lit with its offering). sword: s.variant "knot" makes the tangle a knot
//   of black thread instead of thorny vines; s.at (optional 0-1 fraction: when the blade sweeps).
import React, {useId} from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {K, W, H, SA, EN} from "../look";
import {SceneP, Frame, push} from "../stage";
import {Sky, Dust, Mood} from "../sky";
import {smooth, ribbon, rnd, lerp, clamp01, nrmAt, Pt} from "../geom";
import {Rimmed} from "../sil";

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
// 2.22 GARMENTS: an old, frayed cloth slips from the line and dissolves into dust of light; a new cloth unfurls and
// billows in a warm wind, the low sun shining through it.
// =====================================================================================================================
type ClothFn = (u: number, v: number) => V2;
type ClothLook = {dark: string; mid: string; lit: string; edge: string; edgeOp: number; op: number;
  trans?: {c: string; o: number; cx: number; cy: number; r: number}; border?: {c: string; o: number; v0: number; v1: number; dots?: string; side?: number}};
// The outline of a cloth through its grid (corners kept sharp), and one vertical strip of it.
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
const clothBand = (fn: ClothFn, v0: number, v1: number, k = 24): string => {
  const a: number[][] = [], b: number[][] = [];
  for (let i = 0; i <= k; i++) { a.push(fn(i / k, v0)); b.push(fn(i / k, v1)); }
  return lineD([...a, ...b.reverse()]) + " Z";
};
// A band down the cloth between u0 and u1 (a woven border along the selvedge).
const clothBandU = (fn: ClothFn, u0: number, u1: number, k = 16): string => {
  const a: number[][] = [], b: number[][] = [];
  for (let j = 0; j <= k; j++) { a.push(fn(u0, j / k)); b.push(fn(u1, j / k)); }
  return lineD([...a, ...b.reverse()]) + " Z";
};
// A hanging cloth: vertical strips shaded by their fold (shade[i] in -1..1 at u = i / nu), a transmitted-light glow, a
// woven border, a lit edge. Translucent as a whole (look.op). holes: paths cut out of it through a mask.
const Cloth: React.FC<{fn: ClothFn; nu?: number; nv?: number; shade: number[]; look: ClothLook; holes?: string[]; children?: React.ReactNode; after?: React.ReactNode}> =
  ({fn, nu = 16, nv = 12, shade, look, holes, children, after}) => {
  const id = uid();
  const out = clothOutline(fn, nu, nv), jm = Math.round(nv * 0.55);
  const col = (sv: number) => (sv >= 0 ? mix(look.mid, look.lit, sv) : mix(look.mid, look.dark, -sv));
  const B = look.border;
  return (
    <g opacity={look.op} mask={holes && holes.length ? `url(#${id}m)` : undefined}>
      <defs>
        <clipPath id={`${id}k`}><path d={out}/></clipPath>
        {Array.from({length: nu}, (_, i) => { const a = fn(i / nu, jm / nv), b = fn((i + 1) / nu, jm / nv);
          return <linearGradient key={i} id={`${id}g${i}`} gradientUnits="userSpaceOnUse" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}><stop offset="0" stopColor={col(shade[i])}/><stop offset="1" stopColor={col(shade[i + 1])}/></linearGradient>; })}
        {look.trans ? <radialGradient id={`${id}t`} gradientUnits="userSpaceOnUse" cx={look.trans.cx} cy={look.trans.cy} r={look.trans.r}>
          <stop offset="0" stopColor={look.trans.c} stopOpacity={look.trans.o}/><stop offset="0.4" stopColor={look.trans.c} stopOpacity={look.trans.o * 0.45}/><stop offset="1" stopColor={look.trans.c} stopOpacity={0}/></radialGradient> : null}
        {holes && holes.length ? <mask id={`${id}m`} maskUnits="userSpaceOnUse" x={-400} y={-400} width={W + 800} height={H + 800}>
          <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#fff"/>{holes.map((d, i) => <path key={i} d={d} fill="#000"/>)}</mask> : null}
      </defs>
      <path d={out} fill={look.mid}/>
      <g clipPath={`url(#${id}k)`}>
        {Array.from({length: nu}, (_, i) => <path key={i} d={clothStrip(fn, i / nu, (i + 1) / nu, nv)} fill={`url(#${id}g${i})`} stroke={`url(#${id}g${i})`} strokeWidth={1.5}/>)}
        {B ? <>
          <path d={clothBand(fn, B.v0, B.v1)} fill={B.c} opacity={B.o}/>
          {B.side !== undefined ? <path d={clothBandU(fn, B.side, B.side + 0.03)} fill={B.c} opacity={B.o * 0.8}/> : null}
          <path d={lineD(Array.from({length: 25}, (_, i) => fn(i / 24, B.v0 - 0.012)))} fill="none" stroke={B.c} strokeWidth={1.4} opacity={B.o * 0.9}/>
          <path d={lineD(Array.from({length: 25}, (_, i) => fn(i / 24, B.v1 + 0.012)))} fill="none" stroke={B.c} strokeWidth={1} opacity={B.o * 0.7}/>
          {B.dots ? Array.from({length: 22}, (_, i) => { const p = fn((i + 0.5) / 22, (B.v0 + B.v1) / 2); return <path key={i} d={`M ${n1(p[0])} ${n1(p[1] - 4)} l 3.2 4 l -3.2 4 l -3.2 -4 Z`} fill={B.dots} opacity={B.o}/>; }) : null}
        </> : null}
        {look.trans ? <path d={out} fill={`url(#${id}t)`}/> : null}
        {children}
      </g>
      <path d={out} fill="none" stroke={look.edge} strokeWidth={1.6} opacity={look.edgeOp}/>
      {after}
    </g>
  );
};
// A ragged round hole (a worn patch giving way) at c, radius r.
const holePath = (c: V2, r: number, seed: number): string => {
  const p: Pt[] = [];
  for (let k = 0; k < 9; k++) { const a = (k / 9) * Math.PI * 2 + rnd(seed, k) * 0.4, rr = r * (0.7 + 0.5 * rnd(seed, k + 20)); p.push([c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr * 1.1]); }
  return smooth(p);
};
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
// Grass and reed blades along a ground line, bending in the wind.
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

// A palm on the far bank: a leaning trunk and a crown of drooping fronds (one path list for Rimmed).
const palm = (x: number, y: number, h: number, lean: number, f: number, seed: number): string[] => {
  const top: V2 = [x + lean * h, y - h];
  const d = [ribbon(dense([[x, y], [x + lean * h * 0.35, y - h * 0.5], top], 6), h * 0.07, h * 0.04)];
  const fr = [-2.75, -2.3, -1.85, -1.35, -0.95, -0.45, -0.1, 0.25, 3.35];
  fr.forEach((a0, k) => {
    const a = a0 + Math.sin(f / 40 + k + seed) * 0.03, L = h * (0.5 + 0.16 * rnd(k, seed)), side = Math.cos(a) >= 0 ? 1 : -1;
    const mid: number[][] = [];
    for (let q = 0; q <= 8; q++) { const u = q / 8; mid.push([top[0] + Math.cos(a) * L * u, top[1] + Math.sin(a) * L * u + u * u * L * (0.45 + 0.3 * Math.abs(Math.cos(a)))]); }
    // the frond: a narrow blade along the rib, and leaflets hanging from it
    let fd = ribbon(mid, h * 0.035, 0.8);
    for (let q = 1; q < 8; q++) {
      const p = mid[q], ll = h * 0.12 * Math.sin((q / 8) * Math.PI);
      [-1, 1].forEach((sd) => { fd += " " + ribbon([[p[0], p[1]], [p[0] + side * ll * 0.3 + sd * ll * 0.35, p[1] + ll * 0.6], [p[0] + side * ll * 0.4 + sd * ll * 0.45, p[1] + ll]], h * 0.022, 0.5); });
    }
    d.push(fd);
  });
  return d;
};
const Garments: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), id = uid();
  const mood = moodOf(s, "dusk");
  const T = (k: number) => k * n;
  const sun: V2 = [1262, 600];
  const HZ = 742;
  // the line between two bamboo poles, sagging a little and breathing in the wind
  const LX0 = 316, LY0 = 268, LX1 = 1642, LY1 = 262, sag = 66 + 2.5 * Math.sin(f / 47);
  const lineY = (x: number) => { const u = (x - LX0) / (LX1 - LX0); return lerp(LY0, LY1, u) + sag * 4 * u * (1 - u); };
  // ---- the old cloth: limp and heavy, frayed; its left corner slips off, then it falls and comes apart into light ----
  const slip = (t: number) => sstep((t - T(0.17)) / T(0.17));
  const fallOf = (t: number) => { const q = clamp01((t - T(0.3)) / T(0.34)); return q * q; };
  const OX0 = 432, OX1 = 872, OL = 410;
  const hem = (u: number) => 1 - 0.03 * rnd(Math.floor(u * 30), 41) - (u > 0.82 ? Math.pow((u - 0.82) / 0.18, 1.3) * 0.17 : 0);
  const oFold = (u: number, v: number) => 0.7 * Math.sin(u * Math.PI * 4.2 + 0.4 + v * 0.8) + 0.25 * Math.sin(u * Math.PI * 8.4 + 1.3 - v * 0.6);
  const oldAt = (u: number, v: number, t: number): V2 => {
    const sl = slip(t), fa = fallOf(t);
    let tx = lerp(OX0, OX1, u), ty = lineY(tx);
    const k = Math.max(0, 1 - u / 0.72);
    tx += sl * k * 80; ty += sl * Math.pow(k, 1.35) * 230;
    const vv = v * hem(u), z = oFold(u, vv) * (0.3 + 0.7 * vv) * (1 + sl * k * 1.2 + fa * 1.5);
    let x = tx + z * 7 + Math.sin(t / 41 + u * 2.3) * 5 * Math.pow(vv, 1.5);
    let y = ty + vv * OL * (1 - 0.25 * fa) + z * 12 * vv * vv;
    // falling: it crumples toward its middle, turns, drifts with the wind and ripples
    if (fa > 0) {
      const cx = lerp(OX0, OX1, 0.55) + sl * 40, cy = lineY(cx) + OL * 0.45, a = fa * 0.7;
      x = lerp(x, cx, 0.3 * fa); y = lerp(y, cy, 0.18 * fa);
      const ox = x - cx, oy = y - cy;
      x = cx + ox * Math.cos(a) - oy * Math.sin(a) + 170 * fa + Math.sin(vv * 6 + t / 7 + u * 3) * 24 * fa;
      y = cy + ox * Math.sin(a) + oy * Math.cos(a) + 560 * fa + Math.sin(u * 5 + t / 9) * 16 * fa;
    }
    return [x, y];
  };
  const oldFn: ClothFn = (u, v) => oldAt(u, v, f);
  // the dissolving: ragged holes open from the hem upward, each rimmed with light and shedding motes
  const NH = 64;
  const holes = Array.from({length: NH}, (_, i) => {
    const hemHole = i < 16, u = hemHole ? (i + rnd(i, 51)) / 16 : 0.04 + rnd(i, 52) * 0.92, v = hemHole ? 0.97 + rnd(i, 53) * 0.06 : 0.08 + rnd(i, 54) * 0.86;
    const t0 = T(0.25) + (1 - v) * T(0.24) + rnd(i, 55) * T(0.07), R = (hemHole ? 46 : 34) + rnd(i, 56) * 60;
    return {u, v, t0, R};
  });
  const oldOp = 1 - sstep((f - T(0.56)) / T(0.1));
  const holeD: string[] = [], rings: React.ReactNode[] = [];
  // old worn holes, there from the start: the light shows through them
  const worn: [number, number, number][] = [[0.3, 0.42, 9], [0.62, 0.66, 13], [0.18, 0.8, 7], [0.78, 0.3, 6]];
  worn.forEach(([u, v, r], i) => { const c = oldFn(u, v); holeD.push(holePath(c, r, 90 + i)); rings.push(<path key={`w${i}`} d={holePath(c, r + 1.5, 90 + i)} fill="none" stroke="#E8B878" strokeWidth={2} opacity={0.55}/>); });
  holes.forEach((h, i) => {
    const r = h.R * sstep((f - h.t0) / T(0.1));
    if (r < 0.5) return;
    const c = oldFn(h.u, h.v), d = holePath(c, r, i);
    holeD.push(d);
    const glow = 1 - sstep((f - h.t0 - T(0.08)) / T(0.12));
    if (glow > 0.01) rings.push(<g key={i} opacity={glow}><path d={holePath(c, r + 2, i)} fill="none" stroke="#FFB45A" strokeWidth={9} opacity={0.22}/><path d={holePath(c, r + 1, i)} fill="none" stroke="#FFE9B8" strokeWidth={2.4} opacity={0.9}/></g>);
  });
  // motes of light let go by the holes, drifting up and on toward the new cloth on the warm wind
  const motes: React.ReactNode[] = [];
  holes.forEach((h, i) => {
    for (let j = 0; j < 3; j++) {
      const tb = h.t0 + j * 5 + rnd(i * 3 + j, 61) * 10, age = f - tb, life = 120 + rnd(i * 3 + j, 62) * 100;
      if (age < 0 || age > life) continue;
      const a = (j / 3) * Math.PI * 2 + rnd(i, 63) * 6, rr = h.R * 0.5;
      const b = oldAt(h.u, h.v, tb);
      const x = b[0] + Math.cos(a) * rr + age * (1.0 + rnd(i * 3 + j, 64) * 1.1) + Math.sin(age / 17 + i) * 8;
      const y = b[1] + Math.sin(a) * rr - age * (0.5 + rnd(i * 3 + j, 65) * 0.7) - age * age * 0.001;
      const o = Math.min(1, age / 8) * Math.pow(1 - age / life, 1.3) * (0.65 + 0.35 * Math.sin(f / 5 + i + j));
      const r = 1.1 + rnd(i * 3 + j, 66) * 2.2;
      motes.push(<g key={`${i}-${j}`}><circle cx={x} cy={y} r={r * 5} fill="url(#th-mote)" opacity={o * 0.6}/><circle cx={x} cy={y} r={r} fill="#FFF1CC" opacity={o}/></g>);
    }
  });
  // fraying threads along the hem
  const fray = Array.from({length: 30}, (_, i) => {
    const u = (i + rnd(i, 71) * 0.8) / 30, p = oldFn(u, 1), L = 8 + rnd(i, 72) * 24, sw = Math.sin(f / 23 + i) * 4;
    return `M ${n1(p[0])} ${n1(p[1] - 2)} Q ${n1(p[0] + sw * 0.5 + 2)} ${n1(p[1] + L * 0.5)} ${n1(p[0] + sw + (rnd(i, 73) - 0.5) * 6)} ${n1(p[1] + L)}`;
  }).join(" ");
  const shadeOf = (fn: (u: number) => number, nu: number, k: number, bias = 0) => Array.from({length: nu + 1}, (_, i) => { const u = i / nu, e = 0.004; return Math.max(-1, Math.min(1, -(fn(u + e) - fn(u - e)) / (2 * e) / k + bias)); });
  const oldShade = shadeOf((u) => oFold(u, 0.6), 22, 12, -0.1).map((q) => q * 0.8);
  // ---- the new cloth: rolled on the line, it unrolls, then the warm wind fills it ----
  const uf = sstep((f - T(0.3)) / T(0.3)), wind = sstep((f - T(0.42)) / T(0.32));
  const NX0 = 1012, NX1 = 1504, NLmax = 446, NL = lerp(56, NLmax, uf);
  const ph = f * 0.045;
  const nz = (u: number, v: number) => 0.6 * Math.sin(u * Math.PI * 2.7 + 0.9 * Math.sin(ph * 0.7) + v * 1.1) + 0.14 * Math.sin(u * Math.PI * 6.3 - ph * 0.9 + v * 2.0) + wind * 0.6 * Math.sin(u * Math.PI * 1.5 - ph * 1.6 + v * 2.6);
  const newFn: ClothFn = (u, v) => {
    const tx = lerp(NX0, NX1, u), ty = lineY(tx), z = nz(u, v) * (0.25 + 0.75 * v) * (0.4 + 0.6 * uf);
    let x = tx + z * 9;
    x += wind * (84 * Math.pow(v, 1.5) * (0.74 + 0.26 * Math.sin(ph + u * 1.4)) + 15 * v * Math.sin(v * 5 - ph * 1.7 + u * 2.4));
    x += (1 - wind) * Math.sin(f / 45 + u * 2) * 3 * v;
    const y = ty + v * NL + z * 18 * v * v - wind * 36 * v * v * (0.6 + 0.4 * Math.sin(ph * 1.1 + 1 + u * 1.2));
    return [x, y];
  };
  const newShade = shadeOf((u) => nz(u, 0.6), 28, 6.5).map((q) => q * 0.85 * (0.5 + 0.5 * uf));
  const flapV = Math.min(1, 50 / NL);
  const flapFn: ClothFn = (u, v) => { const p = newFn(u, v * flapV); return [p[0] + 1.5, p[1] + 2]; };
  const flapShade = newShade.map((q) => q * 0.6 - 0.25);
  const newLook: ClothLook = {dark: "#5A1C1C", mid: "#C25A2A", lit: "#FFC06A", edge: "#FFE3A3", edgeOp: 0.6, op: 0.9,
    trans: {c: "#FFF0C8", o: 0.85, cx: sun[0], cy: sun[1], r: 330}, border: {c: "#FFD27A", o: 0.75, v0: 0.86, v1: 0.93, dots: "#7A2418", side: 0.94}};
  const flapLook: ClothLook = {dark: "#4A1818", mid: "#A0442A", lit: "#F09A50", edge: "#FFD38A", edgeOp: 0.6, op: 0.88,
    trans: {c: "#FFE0A0", o: 0.45, cx: sun[0], cy: sun[1], r: 300}, border: {c: "#FFD27A", o: 0.7, v0: 0.7, v1: 0.82}};
  const oldLook: ClothLook = {dark: "#140E16", mid: "#33262E", lit: "#5E4A4E", edge: "#B89070", edgeOp: 0.4, op: 0.95 * oldOp,
    trans: {c: "#E8B888", o: 0.2, cx: sun[0] - 320, cy: sun[1] - 40, r: 560}, border: {c: "#8A6A4A", o: 0.3, v0: 0.84, v1: 0.9}};
  // the roll still to unroll, along the bottom of the new cloth: a cylinder with its spiral ends showing
  const rollW = (1 - uf) * 30;
  const rollPts = Array.from({length: 29}, (_, i) => { const p = newFn(i / 28, 1); return [p[0], p[1] + rollW * 0.3] as V2; });
  // ---- the world around: far bank with palms, river, near bank, poles ----
  const bank: Pt[] = [];
  for (let i = 0; i <= 84; i++) { const x = -60 + i * 25, crown = Math.max(0, Math.sin(x / 70 + rnd(Math.floor(i / 5), 83) * 3)); bank.push([x, HZ - 4 - rnd(i, 82) * 6 - crown * (8 + 14 * rnd(Math.floor(i / 4), 81))]); }
  const bankD = `${smooth(bank, false)} L ${W + 60} ${HZ + 4} L -60 ${HZ + 4} Z`;
  const nearY = (x: number) => 812 + 16 * Math.sin(x / 260 + 0.6) + 8 * Math.sin(x / 97);
  const nearPts: Pt[] = Array.from({length: 41}, (_, i) => { const x = -60 + i * 51; return [x, nearY(x)]; });
  const nearD = `${smooth(nearPts, false)} L ${W + 60} ${H + 60} L -60 ${H + 60} Z`;
  const toSun = (x: number, y: number): V2 => [sun[0] - x, sun[1] - y];
  const cam = sstep(f / n);
  return (
    <Frame f={f} zoom={1 + 0.08 * cam} cx={lerp(1000, 1200, cam)} cy={520}>
      <ThreadDefs/>
      <defs>
        <linearGradient id={`${id}r`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8925A"/><stop offset="0.25" stopColor="#8E3D52"/><stop offset="1" stopColor="#2A1838"/></linearGradient>
        <linearGradient id={`${id}h`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F0A04B" stopOpacity={0}/><stop offset="0.6" stopColor="#F0A04B" stopOpacity={0.3}/><stop offset="1" stopColor="#FFD27A" stopOpacity={0.55}/></linearGradient>
        <radialGradient id={`${id}s`} cx={sun[0]} cy={HZ + 20} r={420} gradientUnits="userSpaceOnUse" gradientTransform={`translate(${sun[0]} ${HZ}) scale(0.5 1) translate(${-sun[0]} ${-HZ})`}><stop offset="0" stopColor="#FFE3A3" stopOpacity={0.75}/><stop offset="0.4" stopColor="#F0A04B" stopOpacity={0.25}/><stop offset="1" stopColor="#F0A04B" stopOpacity={0}/></radialGradient>
        <linearGradient id={`${id}roll`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFD08A"/><stop offset="0.3" stopColor="#E07A3A"/><stop offset="0.7" stopColor="#8E3022"/><stop offset="1" stopColor="#3A1216"/></linearGradient>
      </defs>
      <Sky mood={mood} sun={sun} sunR={72} f={f} rays={0.35} id={`${id}k`}/>
      {/* far bank: a low line of trees and two palms, hazed by the low sun */}
      <Rimmed paths={[bankD, ...palm(150, HZ - 6, 120, 0.12, f, 1), ...palm(1790, HZ - 6, 104, -0.15, f, 2), ...palm(1850, HZ - 4, 78, 0.1, f, 3)]} light={[0.2, -1]} fill="#2A1830" rim="#E8A060" w={1.4}/>
      <rect x={-60} y={HZ - 80} width={W + 120} height={86} fill={`url(#${id}h)`}/>
      {/* the river: the sky mirrored, the sun's path glittering */}
      <rect x={-60} y={HZ} width={W + 120} height={90} fill={`url(#${id}r)`}/>
      <rect x={-60} y={HZ} width={W + 120} height={90} fill={`url(#${id}s)`}/>
      {Array.from({length: 30}, (_, i) => {
        const y = HZ + 4 + Math.pow(rnd(i, 91), 1.3) * 70, w = 10 + rnd(i, 92) * 46 * (1 - (y - HZ) / 120), x = sun[0] + (rnd(i, 93) - 0.5) * (60 + (y - HZ) * 2.2) + Math.sin(f / 20 + i) * 6;
        return <rect key={i} x={x - w / 2} y={y} width={w} height={1.6} fill="#FFE9B8" opacity={(0.3 + 0.5 * rnd(i, 94)) * (0.5 + 0.5 * Math.sin(f / 7 + i * 2.1))}/>;
      })}
      {/* near bank */}
      <path d={nearD} fill="#120A16"/>
      <path d={smooth(nearPts, false)} fill="none" stroke="#FFC877" strokeWidth={1.6} opacity={0.35}/>
      <rect x={-60} y={850} width={W + 120} height={260} fill="url(#th-down)" opacity={0.5}/>
      {/* the poles and the line */}
      <Rimmed paths={bamboo([300, 990], [306, 232], 17)} light={toSun(300, 600)} fill="#130A18" w={2.6}/>
      <Rimmed paths={bamboo([1662, 1000], [1656, 226], 17)} light={toSun(1660, 600)} fill="#130A18" w={2.6}/>
      <path d={lineD(Array.from({length: 41}, (_, i) => { const x = lerp(LX0, LX1, i / 40); return [x, lineY(x)]; }))} fill="none" stroke="#1A0E1E" strokeWidth={3.2}/>
      <path d={lineD(Array.from({length: 41}, (_, i) => { const x = lerp(LX0, LX1, i / 40); return [x, lineY(x) + 1]; }))} fill="none" stroke="#FFD38A" strokeWidth={1} opacity={0.55}/>
      {/* the old cloth */}
      {oldOp > 0.01 ? <Cloth fn={oldFn} nu={22} shade={oldShade} look={oldLook} holes={holeD} after={<path d={fray} fill="none" stroke="#5A4048" strokeWidth={1.2} opacity={0.85}/>}>
        {/* threadbare patches the light comes through */}
        {[[0.42, 0.3, 46], [0.72, 0.5, 38], [0.24, 0.62, 30]].map(([u, v, r], i) => { const c = oldFn(u, v); return <Glow key={i} x={c[0]} y={c[1]} rx={r} ry={r * 1.3} g="th-soft" o={0.3}/>; })}
        {rings}
      </Cloth> : null}
      {motes}
      {/* the new cloth, the doubled flap over the line, and the roll */}
      <Glow x={sun[0]} y={sun[1] - 40} rx={420} ry={360} g="th-soft" o={0.25 + 0.3 * uf}/>
      <Cloth fn={newFn} nu={28} nv={14} shade={newShade} look={newLook}/>
      <Cloth fn={flapFn} nu={28} nv={4} shade={flapShade} look={flapLook}/>
      {rollW > 0.8 ? <g>
        <path d={ribbon(rollPts, rollW, rollW)} fill={`url(#${id}roll)`}/>
        <path d={lineD(rollPts.map(([x, y]) => [x, y - rollW * 0.32]))} fill="none" stroke="#FFE3A3" strokeWidth={1.4} opacity={0.6}/>
        {[0, 28].map((i) => { const p = rollPts[i]; return <g key={i}>
          <ellipse cx={p[0]} cy={p[1]} rx={rollW * 0.3} ry={rollW * 0.5} fill="#5A1C1C" stroke="#FFD38A" strokeWidth={1} strokeOpacity={0.6}/>
          <path d={`M ${n1(p[0])} ${n1(p[1] - rollW * 0.32)} A ${n1(rollW * 0.18)} ${n1(rollW * 0.3)} 0 1 1 ${n1(p[0] - 0.1)} ${n1(p[1] + rollW * 0.12)}`} fill="none" stroke="#E08A44" strokeWidth={1} opacity={0.6}/>
        </g>; })}
      </g> : null}
      {/* the warm wind: dust in the light, grass and reeds bending */}
      <Dust f={f} sun={sun} n={120} y0={200} y1={900}/>
      <Rimmed paths={[blades(-40, 620, nearY, f, 60, 20, 70, 3, 0.4 + wind * 0.6), blades(1300, 1960, nearY, f, 60, 20, 80, 5, 0.4 + wind * 0.6)]} light={[0.4, -1]} fill="#0B0610" rim="#E8A868" w={1.6}/>
      <Rimmed paths={[blades(-60, 260, (x) => nearY(x) + 120, f, 18, 120, 260, 7, 0.5 + wind * 0.5), blades(1720, 1980, (x) => nearY(x) + 120, f, 16, 120, 280, 9, 0.5 + wind * 0.5)]} light={[-0.3, -1]} fill="#07040A" rim="#B88A62" w={1.8}/>
    </Frame>
  );
};

// =====================================================================================================================
// 7.7 PEARLS: a long string of luminous pearls in darkness, each holding a glint of a world; variant "thread": the
// pearls dim and the thread itself lights, one line of light running through them all.
// =====================================================================================================================
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
const PearlDefs: React.FC = () => (
  <defs>
    <clipPath id="pe-unit"><circle r={1}/></clipPath>
    {WORLD_BG.map((st, k) => <linearGradient key={k} id={`pe-w${k}`} x1="0" y1="0" x2="0" y2="1">{st.map(([o, c], i) => <stop key={i} offset={o} stopColor={c}/>)}</linearGradient>)}
    <radialGradient id="pe-milk" cx="0.42" cy="0.38" r="0.62"><stop offset="0" stopColor="#FFF6E6" stopOpacity={0.05}/><stop offset="0.62" stopColor="#FFF0DA" stopOpacity={0.12}/><stop offset="0.86" stopColor="#FFE9CC" stopOpacity={0.45}/><stop offset="1" stopColor="#FFF4E2" stopOpacity={0.75}/></radialGradient>
    <radialGradient id="pe-shd" cx="0.3" cy="0.25" r="0.95"><stop offset="0.5" stopColor="#07050F" stopOpacity={0}/><stop offset="1" stopColor="#07050F" stopOpacity={0.6}/></radialGradient>
    <radialGradient id="pe-veil" cx="0.44" cy="0.4" r="0.62"><stop offset="0" stopColor="#FFF6EC" stopOpacity={0.12}/><stop offset="0.4" stopColor="#FFF0E0" stopOpacity={0.22}/><stop offset="0.7" stopColor="#F6E6D8" stopOpacity={0.66}/><stop offset="0.9" stopColor="#EAD6CC" stopOpacity={0.92}/><stop offset="1" stopColor="#D2B8C0" stopOpacity={0.97}/></radialGradient>
    <radialGradient id="pe-iri" cx="0.58" cy="0.62" r="0.62"><stop offset="0.74" stopColor="#F2B6C6" stopOpacity={0}/><stop offset="0.86" stopColor="#F2B6C6" stopOpacity={0.3}/><stop offset="0.95" stopColor="#A9C2F2" stopOpacity={0.28}/><stop offset="1" stopColor="#A9C2F2" stopOpacity={0}/></radialGradient>
    <radialGradient id="pe-spec" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFFFFF" stopOpacity={0.95}/><stop offset="0.5" stopColor="#FFF6E0" stopOpacity={0.4}/><stop offset="1" stopColor="#FFF6E0" stopOpacity={0}/></radialGradient>
    <radialGradient id="pe-halo"><stop offset="0" stopColor="#FFE9C0" stopOpacity={0.5}/><stop offset="0.3" stopColor="#F0C080" stopOpacity={0.16}/><stop offset="1" stopColor="#E8A060" stopOpacity={0}/></radialGradient>
    <radialGradient id="pe-pearl" cx="0.38" cy="0.34" r="0.75"><stop offset="0" stopColor="#FFF8EC"/><stop offset="0.45" stopColor="#E8D6C4"/><stop offset="0.8" stopColor="#9A8090"/><stop offset="1" stopColor="#5A4660"/></radialGradient>
    <radialGradient id="pe-glass" cx="0.4" cy="0.36" r="0.7"><stop offset="0" stopColor="#2A2040" stopOpacity={0.55}/><stop offset="0.8" stopColor="#120C22" stopOpacity={0.8}/><stop offset="1" stopColor="#0B0712" stopOpacity={0.9}/></radialGradient>
    <radialGradient id="pe-moon"><stop offset="0" stopColor="#FFFBEA"/><stop offset="0.5" stopColor="#FFF0C8" stopOpacity={0.9}/><stop offset="1" stopColor="#FFE3A3" stopOpacity={0}/></radialGradient>
    <radialGradient id="pe-bokeh"><stop offset="0" stopColor="#FFD9A0" stopOpacity={0.22}/><stop offset="0.7" stopColor="#E8A060" stopOpacity={0.1}/><stop offset="1" stopColor="#E8A060" stopOpacity={0}/></radialGradient>
    <radialGradient id="pe-bokeh2"><stop offset="0" stopColor="#9AA4D8" stopOpacity={0.16}/><stop offset="0.7" stopColor="#6B78A8" stopOpacity={0.07}/><stop offset="1" stopColor="#6B78A8" stopOpacity={0}/></radialGradient>
  </defs>
);
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
// One pearl at (x, y), radius r: halo, the world inside, the milky skin, a shadow, a highlight, a rim of light.
// b: brightness (1 lit, 0 dark glass); w: whether to show a world (small far pearls are plain).
// Far pearls (no world) are drawn plainly: a lit nacre disc, a highlight, a little halo; few elements for many beads.
const PlainPearl: React.FC<{x: number; y: number; r: number; b: number; glass: number}> = ({x, y, r, b, glass}) => (
  <g transform={`translate(${n1(x)} ${n1(y)}) scale(${r.toFixed(2)})`}>
    {b > 0.02 && r > 9 ? <circle r={2.4} fill="url(#pe-halo)" opacity={0.6 * b}/> : null}
    <circle r={1} fill="url(#pe-pearl)"/>
    <circle r={1} fill="url(#pe-iri)"/>
    {glass > 0.01 ? <circle r={1} fill="url(#pe-glass)" opacity={glass}/> : null}
    <ellipse cx={-0.34} cy={-0.42} rx={0.3} ry={0.17} transform="rotate(-38 -0.34 -0.42)" fill="url(#pe-spec)" opacity={0.5 + 0.5 * b}/>
  </g>
);
const Pearl: React.FC<{x: number; y: number; r: number; k: number; f: number; b: number; seed: number; world: boolean; glass?: number}> = ({x, y, r, k, f, b, seed, world, glass = 0}) => !world ? <PlainPearl x={x} y={y} r={r} b={b} glass={glass}/> : (
  <g transform={`translate(${n1(x)} ${n1(y)})`}>
    {b > 0.02 ? <circle r={r * 3} fill="url(#pe-halo)" opacity={0.75 * b}/> : null}
    <g transform={`scale(${r.toFixed(2)})`}>
      <g clipPath="url(#pe-unit)">
        {world ? <>
          <circle r={1} fill={`url(#pe-w${k})`}/>
          <World k={k} f={f} seed={seed} dx={0.08 * Math.sin(f / 70 + seed)}/>
          <circle r={1} fill="url(#pe-veil)" opacity={Math.min(1, 0.75 + 6 / r)}/>
        </> : <circle r={1} fill="url(#pe-pearl)"/>}
        <circle r={1} fill="url(#pe-iri)"/>
        <circle r={1} fill="url(#pe-milk)" opacity={0.6}/>
        <circle r={1} fill="url(#pe-shd)"/>
        {glass > 0.01 ? <circle r={1} fill="url(#pe-glass)" opacity={glass}/> : null}
      </g>
      <ellipse cx={-0.34} cy={-0.42} rx={0.3} ry={0.17} transform="rotate(-38 -0.34 -0.42)" fill="url(#pe-spec)" opacity={0.5 + 0.5 * b}/>
      <ellipse cx={0.28} cy={0.58} rx={0.3} ry={0.12} transform="rotate(-30 0.28 0.58)" fill="url(#pe-spec)" opacity={0.22 * b}/>
      <circle r={0.985} fill="none" stroke="#FFF0DA" strokeWidth={0.04} opacity={0.12 + 0.2 * b}/>
    </g>
  </g>
);
type Strand = {ctl: V2[]; rMin: number; rMax: number; peak: number; spread: number; gap: number; op: number; world: boolean; amp: number; ph: number};
// The strand hangs through its control points and swings slowly, most at its low middle.
const strandPts = (st: Strand, f: number): V2[] => {
  const base = dense(st.ctl, 24), N = base.length - 1, sw = st.amp * Math.sin(f / 95 + st.ph);
  return base.map(([x, y], i) => { const bell = Math.sin((Math.PI * i) / N); return [x + sw * bell, y - Math.abs(sw) * 0.1 * bell] as V2; });
};
const Pearls: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), id = uid();
  const thread = s.variant === "thread";
  const tv = thread ? sstep((f - n * 0.12) / (n * 0.45)) : 0;
  const mood = moodOf(s, "night");
  const amb = {night: "#1A1236", dusk: "#2A1430", dawn: "#18203E", gold: "#2A1A2E"}[mood];
  const strands: Strand[] = [
    {ctl: [[-80, 110], [420, 300], [1000, 380], [1500, 300], [2000, 110]], rMin: 5, rMax: 9, peak: 0.5, spread: 0.3, gap: 3, op: 0.36, world: false, amp: 20, ph: 2.1},
    {ctl: [[-100, 250], [480, 540], [1120, 600], [1620, 470], [2060, 230]], rMin: 8, rMax: 15, peak: 0.52, spread: 0.28, gap: 4, op: 0.58, world: false, amp: 26, ph: 1.0},
    {ctl: [[-170, 40], [260, 420], [800, 740], [1340, 650], [1800, 330], [2110, 30]], rMin: 13, rMax: 50, peak: 0.44, spread: 0.2, gap: 5, op: 1, world: true, amp: 30, ph: 0},
  ];
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.06)} cx={960} cy={560}>
      <ThreadDefs/>
      <PearlDefs/>
      <defs>
        <radialGradient id={`${id}bg`} cx="0.5" cy="0.55" r="0.75"><stop offset="0" stopColor={amb}/><stop offset="0.6" stopColor="#0B0818"/><stop offset="1" stopColor="#040208"/></radialGradient>
      </defs>
      <rect x={-100} y={-100} width={W + 200} height={H + 200} fill={`url(#${id}bg)`}/>
      {/* far out-of-focus lights */}
      {Array.from({length: 16}, (_, i) => {
        const x = rnd(i, 201) * W + Math.sin(f / 200 + i) * 20, y = 140 + rnd(i, 202) * 760, r = 60 + rnd(i, 203) * 120;
        return <circle key={i} cx={x} cy={y} r={r} fill={`url(#${i % 3 ? "pe-bokeh" : "pe-bokeh2"})`} opacity={0.5 + 0.5 * Math.sin(f / 60 + i)}/>;
      })}
      <Glow x={960} y={620} rx={900} ry={420} g="th-soft" o={0.18 + 0.18 * tv}/>
      {strands.map((st, si) => {
        const pts = strandPts(st, f), cum = cumLen(pts), L = cum[cum.length - 1];
        // pearls graduated: largest at the low middle of the strand
        const beads: {p: V2; r: number; k: number}[] = [];
        let pos = 0, i = 0;
        while (pos < L) { const q = clamp01(pos / L), r = lerp(st.rMin, st.rMax, Math.exp(-Math.pow((q - st.peak) / st.spread, 2))); pos += r; beads.push({p: atLen(pts, cum, pos), r, k: (i * 3 + si) % 8}); pos += r + st.gap * (0.6 + r / 40); i++; }
        const td = lineD(pts);
        // the thread: faint between the pearls; in the "thread" variant it becomes a line of light, a pulse running along it
        const pulse = (f * 9 + si * 400) % (L + 600) - 300;
        const pb = 1 - 0.82 * tv;
        return (
          <g key={si} opacity={st.op}>
            <path d={td} fill="none" stroke="#C9A55A" strokeWidth={si === 2 ? 1.4 : 0.9} opacity={0.45}/>
            {beads.map((bd, j) => bd.p[0] > -60 && bd.p[0] < W + 60 && bd.p[1] < H + 60 ? <Pearl key={j} x={bd.p[0]} y={bd.p[1]} r={bd.r} k={bd.k} f={f} b={pb * (0.85 + 0.15 * Math.sin(f / 37 + j * 0.7))} seed={j + si * 50} world={st.world} glass={0.75 * tv}/> : null)}
            {tv > 0.01 ? <g opacity={tv}>
              <path d={td} fill="none" stroke="#FFC877" strokeWidth={34} opacity={0.06}/>
              <path d={td} fill="none" stroke="#FFD9A0" strokeWidth={12} opacity={0.18}/>
              <path d={td} fill="none" stroke="#FFF6D8" strokeWidth={si === 2 ? 3.2 : 2} opacity={0.95}/>
              <path d={td} fill="none" stroke="#FFFFFF" strokeWidth={si === 2 ? 6 : 4} strokeDasharray={`160 ${L + 900}`} strokeDashoffset={-pulse} strokeLinecap="round" opacity={0.8}/>
              <path d={td} fill="none" stroke="#FFE3A3" strokeWidth={22} strokeDasharray={`240 ${L + 900}`} strokeDashoffset={-pulse + 40} strokeLinecap="round" opacity={0.18}/>
            </g> : null}
          </g>
        );
      })}
      <Dust f={f} sun={[960, 600]} n={90} y0={120} y1={980}/>
    </Frame>
  );
};

// =====================================================================================================================
// 9.26 OFFERING: a brass plate and a water pot on a stone floor in lamplight; a leaf, a flower, a fruit appear one by
// one, and water is poured into a small bowl. No hands.
// =====================================================================================================================
// The clay lamp's flame (as in the flame family): halo, fringes, gold body, white core, blue root.
const flameOutline = (x: number, y: number, h: number, w: number, sway: number, t: number): string => {
  const N = 12, L: Pt[] = [], R: Pt[] = [];
  let tip: Pt = [x, y - h, "c"];
  for (let i = 1; i <= N; i++) {
    const u = i / N, hw = u < 0.24 ? w * Math.sqrt(Math.max(0, 1 - Math.pow((0.24 - u) / 0.24, 2))) : w * Math.pow((1 - u) / 0.76, 1.15);
    const cx = x + sway * h * Math.pow(u, 1.6) * Math.sin(t - u * 3.2), cy = y - h * u;
    if (i === N) { tip = [cx, cy, "c"]; continue; }
    L.push([cx - hw, cy]); R.push([cx + hw, cy]);
  }
  return smooth([[x, y + w * 0.08], ...R, tip, ...L.reverse()] as Pt[]);
};
const Flame: React.FC<{x: number; y: number; h: number; f: number}> = ({x, y, h, f}) => {
  const id = uid(), w = h * 0.2, sway = 0.02 + 0.01 * Math.sin(f / 17), t = f / 4;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1={x} y1={y + 2} x2={x} y2={y - h}><stop offset="0" stopColor="#FF8A3A" stopOpacity={0.2}/><stop offset="0.12" stopColor="#FFB45A" stopOpacity={0.95}/><stop offset="0.4" stopColor="#FFD889"/><stop offset="0.75" stopColor="#FFB451"/><stop offset="1" stopColor="#F07A35" stopOpacity={0.8}/></linearGradient>
        <radialGradient id={`${id}c`} gradientUnits="userSpaceOnUse" cx={x} cy={y - h * 0.2} r={h * 0.5}><stop offset="0" stopColor="#FFFFF6"/><stop offset="0.55" stopColor="#FFF4D0" stopOpacity={0.9}/><stop offset="1" stopColor="#FFE2A0" stopOpacity={0}/></radialGradient>
      </defs>
      <Glow x={x} y={y - h * 0.45} rx={h * 5} o={0.9}/>
      <Glow x={x} y={y - h * 0.42} rx={h * 1.1} ry={h * 1.25} g="th-soft" o={0.9}/>
      <path d={flameOutline(x, y + h * 0.05, h * 1.16, w * 2, sway, t)} fill="#F59A45" opacity={0.12}/>
      <path d={flameOutline(x, y + h * 0.03, h * 1.07, w * 1.42, sway, t)} fill="#FFB45A" opacity={0.24}/>
      <path d={flameOutline(x, y, h, w, sway, t)} fill={`url(#${id}g)`}/>
      <path d={flameOutline(x, y - h * 0.03, h * 0.64, w * 0.6, sway * 0.7, t)} fill={`url(#${id}c)`}/>
      <ellipse cx={x} cy={y - h * 0.05} rx={w * 0.7} ry={h * 0.11} fill="url(#th-blue)" opacity={0.55}/>
    </g>
  );
};
const DIYA_BODY = smooth([[-78, -2], [-76, 10], [-66, 26], [-48, 40], [-26, 48], [-18, 56, "c"], [18, 56, "c"], [26, 48], [48, 40], [66, 26], [76, 10], [78, -2], [70, -12], [40, -19], [0, -21], [-40, -19], [-70, -12]]);
const DIYA_OPEN = smooth([[-66, -2], [-50, -12], [0, -16], [50, -12], [66, -2], [48, 8], [14, 12], [0, 20], [-14, 12], [-48, 8]]);
const DIYA_LIP = smooth([[-70, -1], [-48, 11], [-16, 15], [-6, 22], [0, 27, "c"], [6, 22], [16, 15], [48, 11], [70, -1], [72, 6], [50, 18], [18, 22], [8, 30], [0, 34, "c"], [-8, 30], [-18, 22], [-50, 18], [-72, 6]]);
const Diya: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => {
  const id = uid();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4A2418"/><stop offset="0.35" stopColor="#26120F"/><stop offset="1" stopColor="#0C070B"/></linearGradient>
        <radialGradient id={`${id}o`} cx="0.5" cy="0.75" r="0.6"><stop offset="0" stopColor="#FFD68A" stopOpacity={0.9}/><stop offset="0.4" stopColor="#9A5A22" stopOpacity={0.85}/><stop offset="1" stopColor="#1A0E0C"/></radialGradient>
      </defs>
      <ellipse cx={14} cy={56} rx={118} ry={16} fill="url(#th-shade)" opacity={0.85}/>
      <path d={DIYA_BODY} fill={`url(#${id}b)`}/>
      <path d="M -70 20 Q 0 44 70 20" fill="none" stroke={K.rim} strokeWidth={1} opacity={0.24}/>
      <path d={DIYA_BODY} fill="none" stroke={K.rim} strokeWidth={1.4} opacity={0.3}/>
      <path d={DIYA_OPEN} fill={`url(#${id}o)`}/>
      <ellipse cx={0} cy={2} rx={24} ry={4} fill="url(#th-hot)" opacity={0.6}/>
      <path d={DIYA_LIP} fill="#6A3020"/>
      <path d={DIYA_LIP} fill="none" stroke={K.rim} strokeWidth={1.5} opacity={0.85}/>
      <path d={ribbon([[0, -2], [1, 6], [-1, 12], [0, 18]], 5, 3.5)} fill="#2A1A14"/>
      <circle cx={0} cy={17} r={2.6} fill="#FF7A2A"/>
    </g>
  );
};
// ---- the offerings ----
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
// A marigold: a dome of ruffled petals laid out on the golden angle, seen from above at a slant, lit from the back left.
const PETAL: Pt[] = [[0, -0.18], [0.45, -0.42], [0.78, -0.44], [0.9, -0.32], [1.0, -0.17], [0.93, -0.05], [1.04, 0.06], [0.95, 0.2], [0.86, 0.36], [0.5, 0.42], [0, 0.18]];
const PETAL_D = smooth(PETAL.map((p) => [p[0] * 10, p[1] * 10] as Pt));
const Marigold: React.FC<{R: number; seed: number}> = ({R, seed}) => {
  const el = 0.62, ce = 0.78, Ln = [-0.5, 0.66, -0.56], ll = Math.hypot(Ln[0], Ln[1], Ln[2]);
  const items: {depth: number; node: React.ReactNode}[] = [];
  const N = 230;
  for (let i = 0; i < N; i++) {
    const t = (i + 0.5) / N, rr = Math.sqrt(t) * 1.02, ang = i * 2.39996 + seed;
    const X = Math.cos(ang) * rr, Z = Math.sin(ang) * rr, Y = Math.sqrt(Math.max(0, 1 - rr * rr)) * 0.82;
    const sx = X * R, sy = (Z * el - Y * ce) * R, depth = Z * ce + Y * el;
    const nl = Math.hypot(X, Y, Z) || 1, lam = Math.max(0, (X * Ln[0] + Y * Ln[1] + Z * Ln[2]) / nl / ll);
    const dirA = (Math.atan2(sy + 0.82 * ce * R, sx) * 180) / Math.PI + (rnd(i, 331) - 0.5) * 30, size = R * (0.17 + 0.18 * rr) / 10;
    const base = mix(mix("#FFB238", "#C24A1A", Math.pow(rr, 1.4)), "#FF9A2A", (rnd(i, 332) - 0.3) * 0.5);
    const c = mix(mix(base, "#FFE38A", lam * 0.7), "#4A1206", (1 - lam) * 0.45 * rr);
    const sz = size * (0.85 + 0.3 * rnd(i, 333));
    items.push({depth, node: <g key={i} transform={`translate(${n1(sx)} ${n1(sy)}) rotate(${n1(dirA)}) scale(${sz.toFixed(3)} ${(sz * (0.75 + 0.35 * (1 - rr))).toFixed(3)})`}>
      <path d={PETAL_D} fill={c}/>
      <path d={PETAL_D} fill="#3A0C04" opacity={0.17} transform="translate(-1 0) scale(0.55 0.8)"/>
      <path d="M 8 -3 Q 9.6 0 8 3" fill="none" stroke="#FFE9B0" strokeWidth={0.7} opacity={0.35 * lam}/>
    </g>});
  }
  items.sort((a, b) => a.depth - b.depth);
  return (
    <g>
      <ellipse cx={R * 0.25} cy={R * 0.32} rx={R * 1.2} ry={R * 0.45} fill="url(#th-shade)" opacity={0.85}/>
      {[-1, 1].map((sd) => <path key={sd} d={smooth([[sd * R * 0.2, R * 0.1, "c"], [sd * R * 0.6, R * 0.26], [sd * R * 1.05, R * 0.3], [sd * R * 1.32, R * 0.2, "c"], [sd * R * 0.95, R * 0.08], [sd * R * 0.5, R * 0.04]])} fill="#2A3010" stroke="#C9B060" strokeWidth={1} strokeOpacity={0.35}/>)}
      {items.map((it) => it.node)}
      <ellipse cx={-R * 0.3} cy={-R * 0.62} rx={R * 0.45} ry={R * 0.22} fill="url(#th-warm)" opacity={0.45}/>
    </g>
  );
};
// A ripe mango lying on its side, the stem end up and right, lit from the back left.
const MANGO = smooth([[-80, 18, "c"], [-78, 2], [-66, -20], [-42, -38], [-8, -47], [28, -45], [56, -34], [74, -16], [78, 6], [68, 26], [44, 40], [10, 46], [-26, 42], [-56, 32]]);
const Mango: React.FC<{s: number}> = ({s}) => {
  const id = uid();
  return (
    <g transform={`scale(${s})`}>
      <defs>
        <radialGradient id={`${id}g`} cx="0.36" cy="0.28" r="0.85"><stop offset="0" stopColor="#FFF0A8"/><stop offset="0.25" stopColor="#F8C24A"/><stop offset="0.55" stopColor="#E8862E"/><stop offset="0.82" stopColor="#A63C1C"/><stop offset="1" stopColor="#4A160E"/></radialGradient>
        <radialGradient id={`${id}b`}><stop offset="0" stopColor="#8A9A30" stopOpacity={0.6}/><stop offset="1" stopColor="#8A9A30" stopOpacity={0}/></radialGradient>
        <radialGradient id={`${id}r`}><stop offset="0" stopColor="#D8402A" stopOpacity={0.45}/><stop offset="1" stopColor="#D8402A" stopOpacity={0}/></radialGradient>
      </defs>
      <ellipse cx={22} cy={40} rx={92} ry={18} fill="url(#th-shade)" opacity={0.9}/>
      <path d={MANGO} fill={`url(#${id}g)`}/>
      <ellipse cx={30} cy={-8} rx={48} ry={30} fill={`url(#${id}r)`}/>
      <ellipse cx={54} cy={-26} rx={34} ry={20} fill={`url(#${id}b)`}/>
      <ellipse cx={-26} cy={-28} rx={22} ry={8} transform="rotate(-16 -26 -28)" fill="url(#th-hot)" opacity={0.75}/>
      <path d="M -70 -14 Q -40 -42 0 -46" fill="none" stroke="#FFF0C0" strokeWidth={1.6} opacity={0.55}/>
      <path d={ribbon([[58, -32], [64, -40], [72, -43]], 5, 3)} fill="#3A2410"/>
    </g>
  );
};
// A brass water pot (lota): squat round belly, short neck, flared lip; lit from the left.
const LOTA = smooth([[-46, 0, "c"], [-50, -5], [-44, -10], [-70, -22], [-92, -44], [-102, -72], [-98, -104], [-82, -128], [-60, -144], [-44, -152], [-40, -162], [-48, -172], [-62, -180], [-64, -186, "c"], [64, -186, "c"], [62, -180], [48, -172], [40, -162], [44, -152], [60, -144], [82, -128], [98, -104], [102, -72], [92, -44], [70, -22], [44, -10], [50, -5], [46, 0, "c"]]);
const Offering: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), id = uid();
  const mood = moodOf(s, "night");
  const amb = {night: "#2E2350", dusk: "#4A2B5C", dawn: "#2F3D6E", gold: "#5A3048"}[mood];
  const atIn: number[] = Array.isArray(s.at) ? s.at.map(Number) : [];
  const at = [0.1, 0.3, 0.5, 0.68].map((d, i) => (Number.isFinite(atIn[i]) ? clamp01(atIn[i]) : d));
  const labels: string[] = Array.isArray(s.labels) ? s.labels.slice(0, 4).map(String) : [];
  const app = at.map((a) => ease(f, a * n, Math.max(18, n * 0.08)));
  const bloom = at.map((a) => { const t = (f - a * n) / Math.max(24, n * 0.12); return t < 0 || t > 1 ? 0 : Math.sin(Math.PI * t); });
  // the plate, the lamp, the pot
  const PX = 980, PY = 676, PR = 360, PQ = 0.355;
  const LX = 600, LY = 540, DS = 1.0, FL: V2 = [LX, LY + 17 * DS];
  const fh = 78 * (1 + 0.015 * Math.sin(f / 31));
  const light: V2 = [FL[0], FL[1] - fh * 0.5];
  // floor slabs in perspective
  const VPX = 960, VPY = -900, YB = 1180;
  const rowY = [1, 1.18, 1.4, 1.68, 2.05, 2.6, 3.4].map((zz) => VPY + (YB - VPY) / zz);
  const xAt = (xb: number, y: number) => VPX + ((xb - VPX) * (y - VPY)) / (YB - VPY);
  const slabs: React.ReactNode[] = [], joints: string[] = [];
  for (let r = 0; r < rowY.length - 1; r++) {
    const y0 = rowY[r], y1 = rowY[r + 1], off = (r % 2) * 300;
    for (let j = -5; j <= 5; j++) {
      const xb0 = VPX + j * 600 - 300 + off, xb1 = xb0 + 600;
      const p = [[xAt(xb0, y0), y0], [xAt(xb1, y0), y0], [xAt(xb1, y1), y1], [xAt(xb0, y1), y1]];
      slabs.push(<path key={`${r}-${j}`} d={lineD(p) + " Z"} fill="#1A1016" opacity={0.75 + 0.25 * rnd(r * 13 + j, 301)}/>);
      joints.push(`M ${n1(p[0][0])} ${n1(y0)} L ${n1(p[3][0])} ${n1(y1)}`);
    }
    joints.push(`M -100 ${n1(y1)} L ${W + 100} ${n1(y1)}`);
  }
  // water: a thin stream poured from the dark above into the bowl, the level rising
  const BX = 1190, BY = 650;
  const wT = at[3] * n, wD = Math.max(40, n * 0.16);
  const pour = sstep((f - wT) / 10) * (1 - sstep((f - wT - wD) / 14));
  const level = sstep((f - wT - 6) / (wD + 10));
  const surfY = BY + lerp(16, 5, level);
  const TOP = 190;
  const streamPts: number[][] = Array.from({length: 25}, (_, i) => { const u = i / 24; return [BX - 4 + Math.sin(f / 7 + u * 5) * 1.4 * (1 - u) + Math.sin(f / 13 + u * 9) * 0.7 + u * 4, lerp(TOP, surfY, u)]; });
  const sideLine = (sd: number, w0: number, w1: number) => streamPts.map(([x, y], i) => { const u = i / 24, w = lerp(w0, w1, Math.sqrt(u)) * (1 + 0.14 * Math.sin(y / 11 - f * 0.9)); return [x + (sd * w) / 2, y]; });
  const sCum = cumLen(streamPts), sL = sCum[sCum.length - 1];
  const z = push(f, n, 1.12, 1.18), ZX = PX - 60, ZY = PY - 70;
  const lblY = ZY + (895 - ZY) / z;
  const shadowTo = (x: number, y: number, len: number): [number, number] => { const dx = x - light[0], dy = (y - light[1]) * 2.2, l = Math.hypot(dx, dy) || 1; return [(dx / l) * len, (dy / l) * len * 0.4]; };
  const settle = (i: number) => `translate(0 ${n1((1 - app[i]) * -14)})`;
  return (
    <Frame f={f} zoom={z} cx={ZX} cy={ZY}>
      <ThreadDefs/>
      <defs>
        <radialGradient id={`${id}fl`} cx={light[0]} cy={light[1] + 60} r={1000} gradientUnits="userSpaceOnUse" gradientTransform={`translate(${light[0]} ${light[1] + 60}) scale(1 0.5) translate(${-light[0]} ${-(light[1] + 60)})`}>
          <stop offset="0" stopColor="#FFB868" stopOpacity={0.7}/><stop offset="0.12" stopColor="#E8904A" stopOpacity={0.42}/><stop offset="0.32" stopColor="#A0503A" stopOpacity={0.18}/><stop offset="0.62" stopColor="#4A2B5C" stopOpacity={0.05}/><stop offset="1" stopColor="#2E2350" stopOpacity={0}/>
        </radialGradient>
        <linearGradient id={`${id}wl`} gradientUnits="userSpaceOnUse" x1={-100} y1={0} x2={W + 100} y2={0}><stop offset="0" stopColor="#FFC877" stopOpacity={0.05}/><stop offset="0.3" stopColor="#FFC877" stopOpacity={0.35}/><stop offset="0.7" stopColor="#FFC877" stopOpacity={0.08}/><stop offset="1" stopColor="#FFC877" stopOpacity={0.02}/></linearGradient>
        <radialGradient id={`${id}amb`} cx={W / 2} cy={-200} r={1300} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor={amb} stopOpacity={0.3}/><stop offset="1" stopColor={amb} stopOpacity={0}/></radialGradient>
        <radialGradient id={`${id}dk`} cx={PX - 120} cy={PY - 40} r={1150} gradientUnits="userSpaceOnUse" gradientTransform={`translate(${PX - 120} ${PY - 40}) scale(1 0.8) translate(${-(PX - 120)} ${-(PY - 40)})`}><stop offset="0.28" stopColor="#030108" stopOpacity={0}/><stop offset="0.6" stopColor="#030108" stopOpacity={0.6}/><stop offset="1" stopColor="#030108" stopOpacity={0.95}/></radialGradient>
        <linearGradient id={`${id}rim`} gradientUnits="userSpaceOnUse" x1={PX - PR * 0.8} y1={PY - PR * PQ} x2={PX + PR * 0.8} y2={PY + PR * PQ}><stop offset="0" stopColor="#FFEDB8"/><stop offset="0.18" stopColor="#E0A44C"/><stop offset="0.5" stopColor="#8A5620"/><stop offset="0.8" stopColor="#3A220C"/><stop offset="1" stopColor="#1E1006"/></linearGradient>
        <linearGradient id={`${id}side`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#C08A3C"/><stop offset="0.35" stopColor="#6A4218"/><stop offset="1" stopColor="#1A0C06"/></linearGradient>
        <linearGradient id={`${id}slope`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E8B060"/><stop offset="1" stopColor="#6A4218"/></linearGradient>
        <radialGradient id={`${id}well`} gradientUnits="userSpaceOnUse" cx={PX - 150} cy={PY - 30} r={480} gradientTransform={`translate(${PX - 150} ${PY - 30}) scale(1 0.42) translate(${-(PX - 150)} ${-(PY - 30)})`}><stop offset="0" stopColor="#FFD488"/><stop offset="0.22" stopColor="#C48A3A"/><stop offset="0.6" stopColor="#5A3814"/><stop offset="1" stopColor="#24140A"/></radialGradient>
        <linearGradient id={`${id}lota`} gradientUnits="userSpaceOnUse" x1={-104} y1={0} x2={104} y2={0}><stop offset="0" stopColor="#B07A34"/><stop offset="0.07" stopColor="#FFE6A8"/><stop offset="0.16" stopColor="#F2C46A"/><stop offset="0.3" stopColor="#A0682A"/><stop offset="0.55" stopColor="#4A2C12"/><stop offset="0.85" stopColor="#1A0E06"/><stop offset="1" stopColor="#5A3616"/></linearGradient>
        <linearGradient id={`${id}st`} gradientUnits="userSpaceOnUse" x1={0} y1={TOP} x2={0} y2={surfY}><stop offset="0" stopColor="#FFF2D0" stopOpacity={0}/><stop offset="0.25" stopColor="#FFF2D0" stopOpacity={0.6}/><stop offset="1" stopColor="#FFE6B0"/></linearGradient>
        <linearGradient id={`${id}sfg`} gradientUnits="userSpaceOnUse" x1={0} y1={TOP} x2={0} y2={TOP + 160}><stop offset="0" stopColor="#000"/><stop offset="1" stopColor="#fff"/></linearGradient>
        <mask id={`${id}sf`} maskUnits="userSpaceOnUse" x={BX - 200} y={TOP - 10} width={400} height={surfY - TOP + 80}><rect x={BX - 200} y={TOP - 10} width={400} height={surfY - TOP + 80} fill={`url(#${id}sfg)`}/></mask>
        <radialGradient id={`${id}water`} cx="0.36" cy="0.4" r="0.7"><stop offset="0" stopColor="#8A6248"/><stop offset="0.5" stopColor="#3A2228"/><stop offset="1" stopColor="#140A12"/></radialGradient>
      </defs>
      {/* the stone floor: warm in the lamp's pool, cool and dark beyond */}
      <rect x={-100} y={-100} width={W + 200} height={H + 200} fill="#0A0710"/>
      {slabs}
      <path d={joints.join(" ")} stroke="#040208" strokeWidth={3} fill="none" opacity={0.85}/>
      <rect x={-100} y={-100} width={W + 200} height={H + 200} fill={`url(#${id}amb)`}/>
      <rect x={-100} y={-100} width={W + 200} height={H + 200} fill={`url(#${id}fl)`}/>
      <path d={joints.join(" ")} stroke="#FFC877" strokeWidth={1} fill="none" opacity={0.06} transform="translate(0 2)"/>
      {/* the polished stone mirrors the flame */}
      <Glow x={FL[0]} y={FL[1] + 130} rx={22} ry={100} g="th-soft" o={0.55}/>
      {/* a few loose petals and grains of rice on the floor */}
      {[[1372, 760, 20], [1414, 790, -30], [560, 770, 60], [742, 852, 10]].map(([x, y, a], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${a}) scale(1.5 0.9)`}><path d={PETAL_D} fill={i % 2 ? "#C8501C" : "#E8862E"} opacity={0.8}/></g>)}
      {/* the foot of the shrine wall at the back, its plinth catching a little of the lamp */}
      <rect x={-100} y={-100} width={W + 200} height={300} fill="#0C0812"/>
      <rect x={-100} y={150} width={W + 200} height={50} fill="#150D16"/>
      <rect x={-100} y={196} width={W + 200} height={8} fill="#1C1218"/>
      <rect x={-100} y={150} width={W + 200} height={2} fill={`url(#${id}wl)`}/>
      <rect x={-100} y={196} width={W + 200} height={1.6} fill={`url(#${id}wl)`}/>
      <rect x={-100} y={204} width={W + 200} height={40} fill="url(#th-down)" opacity={0.7}/>
      {/* the lamp, just behind the plate */}
      <Diya x={LX} y={LY} s={DS}/>
      {/* the plate: shadow, the side of the rim, the rim, the inner slope, the well with its engraved rings */}
      <ellipse cx={PX + 60} cy={PY + 30} rx={PR * 1.08} ry={PR * PQ * 1.2} fill="url(#th-shade)" opacity={0.95}/>
      <path d={`M ${PX - PR} ${PY} A ${PR} ${PR * PQ} 0 0 0 ${PX + PR} ${PY} L ${PX + PR - 4} ${PY + 14} A ${PR - 4} ${(PR - 4) * PQ} 0 0 1 ${PX - PR + 4} ${PY + 14} Z`} fill={`url(#${id}side)`}/>
      <ellipse cx={PX} cy={PY} rx={PR} ry={PR * PQ} fill={`url(#${id}rim)`}/>
      <ellipse cx={PX} cy={PY + 2} rx={PR - 22} ry={(PR - 22) * PQ} fill={`url(#${id}slope)`} opacity={0.9}/>
      <ellipse cx={PX} cy={PY + 7} rx={PR - 34} ry={(PR - 34) * PQ} fill={`url(#${id}well)`}/>
      {[0.2, 0.42, 0.66, 0.88].map((k, i) => <g key={i}>
        <ellipse cx={PX} cy={PY + 7} rx={(PR - 34) * k} ry={(PR - 34) * k * PQ} fill="none" stroke="#2A1606" strokeWidth={1.2} opacity={0.4}/>
        <ellipse cx={PX} cy={PY + 8.5} rx={(PR - 34) * k} ry={(PR - 34) * k * PQ} fill="none" stroke="#FFD890" strokeWidth={0.8} opacity={0.16}/>
      </g>)}
      {Array.from({length: 40}, (_, i) => { const a = (i / 40) * Math.PI * 2; return <circle key={i} cx={PX + Math.cos(a) * (PR - 11)} cy={PY + Math.sin(a) * (PR - 11) * PQ} r={1.8} fill="#2A1606" opacity={0.45}/>; })}
      <path d={`M ${PX - PR + 4} ${PY - 2} A ${PR - 4} ${(PR - 4) * PQ} 0 0 1 ${PX - 40} ${PY - (PR - 4) * PQ + 1}`} fill="none" stroke="#FFF4D0" strokeWidth={2.6} opacity={0.8}/>
      <Glow x={PX - 170} y={PY - 30} rx={130} ry={36} g="th-hot" o={0.4}/>
      {/* grains of rice */}
      {Array.from({length: 26}, (_, i) => { const a = rnd(i, 311) * 6.28, rr = Math.sqrt(rnd(i, 312)) * 46; return <ellipse key={i} cx={870 + Math.cos(a) * rr * 1.6} cy={738 + Math.sin(a) * rr * 0.5} rx={3.2} ry={1.4} transform={`rotate(${n1(rnd(i, 313) * 180)} ${n1(870 + Math.cos(a) * rr * 1.6)} ${n1(738 + Math.sin(a) * rr * 0.5)})`} fill="#F4E6C8" opacity={0.8}/>; })}
      {/* the leaf */}
      <g opacity={app[0]} transform={settle(0)}>
        <Glow x={790} y={660} rx={180} ry={70} g="th-warm" o={bloom[0] * 0.7}/>
        <g transform={`translate(${shadowTo(780, 670, 20)[0]} ${shadowTo(780, 670, 20)[1] + 8})`} opacity={0.6}><g transform="translate(690 668) scale(1 0.44) rotate(-12)"><path d={smooth(PEEPAL.map((p) => [p[0] * 210, p[1] * 210, p[2]] as Pt))} fill="#120806"/></g></g>
        <g transform="translate(690 668) scale(1 0.44) rotate(-12)"><PeepalLeaf L={210}/></g>
      </g>
      {/* the flower */}
      <g opacity={app[1]} transform={settle(1)}>
        <Glow x={950} y={600} rx={160} ry={90} g="th-warm" o={bloom[1] * 0.7}/>
        <g transform="translate(950 640)"><Marigold R={66} seed={0.7}/></g>
      </g>
      {/* the bowl for water */}
      <g>
        <ellipse cx={BX + 26} cy={BY + 30} rx={90} ry={22} fill="url(#th-shade)" opacity={0.85}/>
        <path d={`M ${BX - 66} ${BY} C ${BX - 66} ${BY + 30} ${BX - 32} ${BY + 44} ${BX} ${BY + 44} C ${BX + 32} ${BY + 44} ${BX + 66} ${BY + 30} ${BX + 66} ${BY} Z`} fill={`url(#${id}side)`}/>
        <ellipse cx={BX} cy={BY} rx={66} ry={23} fill="#1A0E08"/>
        <ellipse cx={BX} cy={BY - 2} rx={60} ry={19} fill={`url(#${id}well)`} opacity={0.45}/>
        {level > 0.01 ? <g>
          <ellipse cx={BX} cy={surfY} rx={lerp(44, 58, level)} ry={lerp(13, 18, level)} fill={`url(#${id}water)`}/>
          <ellipse cx={BX - 18} cy={surfY - 3} rx={10} ry={3} fill="url(#th-hot)" opacity={0.75 * level}/>
          {[0, 1, 2].map((k) => { const ag = (((f - wT + k * 14) % 42) + 42) % 42 / 42; return f > wT ? <ellipse key={k} cx={BX} cy={surfY} rx={6 + ag * 44} ry={2 + ag * 14} fill="none" stroke="#FFE6B0" strokeWidth={1} opacity={(1 - ag) * 0.6 * Math.max(pour, 1 - sstep((f - wT - wD) / 40))}/> : null; })}
        </g> : null}
        <ellipse cx={BX} cy={BY} rx={66} ry={23} fill="none" stroke="#FFD890" strokeWidth={2} opacity={0.65}/>
        <path d={`M ${BX - 64} ${BY - 4} A 66 23 0 0 1 ${BX - 6} ${BY - 23}`} fill="none" stroke="#FFF4D0" strokeWidth={2} opacity={0.7}/>
      </g>
      {pour > 0.01 ? <g opacity={pour} mask={`url(#${id}sf)`}>
        <path d={lineD([...sideLine(-1, 16, 8), ...sideLine(1, 16, 8).reverse()]) + " Z"} fill={`url(#${id}st)`} opacity={0.3}/>
        <path d={ribbon(sideLine(-1, 16, 8), 2, 1.5)} fill="#FFF8E0" opacity={0.85}/>
        <path d={ribbon(sideLine(1, 16, 8), 1.2, 1)} fill="#FFD8A0" opacity={0.5}/>
        <path d={ribbon(sideLine(-0.3, 16, 8), 0.9, 0.7)} fill="#FFFFFF" opacity={0.3}/>
        {Array.from({length: 8}, (_, k) => { const u = (f * 0.045 + k / 8) % 1, p = atLen(streamPts, sCum, Math.pow(u, 0.75) * sL); return <ellipse key={k} cx={p[0] - 1.5} cy={p[1]} rx={1.4} ry={5 + 4 * u} fill="#FFFFFF" opacity={0.7 * Math.sin(Math.PI * u)}/>; })}
        {Array.from({length: 6}, (_, k) => { const ph2 = ((f * 0.07 + k / 6) % 1), a = (k / 6) * Math.PI * 2 + 0.4; return <circle key={k} cx={BX + Math.cos(a) * 16 * ph2} cy={surfY - 14 * Math.sin(Math.PI * ph2) + Math.sin(a) * 4 * ph2} r={1.6} fill="#FFF2D0" opacity={0.8 * (1 - ph2)}/>; })}
        <Glow x={BX} y={surfY} rx={34} ry={11} g="th-hot" o={0.55}/>
      </g> : null}
      {/* the fruit */}
      <g opacity={app[2]} transform={settle(2)}>
        <Glow x={1060} y={716} rx={160} ry={70} g="th-warm" o={bloom[2] * 0.7}/>
        <g transform="translate(1064 724) rotate(-6)"><Mango s={1.0}/></g>
      </g>
      <Glow x={BX} y={BY} rx={150} ry={64} g="th-warm" o={bloom[3] * 0.6}/>
      {/* the water pot */}
      <g transform="translate(1520 664)">
        <ellipse cx={50} cy={4} rx={140} ry={24} fill="url(#th-shade)" opacity={0.9}/>
        <path d={LOTA} fill={`url(#${id}lota)`}/>
        {[-148, -60].map((y, i) => <g key={i}><path d={`M ${i ? -100 : -64} ${y} Q 0 ${y + 14} ${i ? 100 : 64} ${y}`} fill="none" stroke="#1E1006" strokeWidth={1.6} opacity={0.6}/><path d={`M ${i ? -100 : -64} ${y + 2} Q 0 ${y + 16} ${i ? 100 : 64} ${y + 2}`} fill="none" stroke="#FFE0A0" strokeWidth={0.9} opacity={0.3}/></g>)}
        <ellipse cx={-62} cy={-86} rx={10} ry={44} fill="url(#th-hot)" opacity={0.55}/>
        <ellipse cx={0} cy={-186} rx={64} ry={14} fill="#B07A34"/>
        <ellipse cx={0} cy={-185} rx={52} ry={10} fill="#100604"/>
        <path d="M -64 -186 A 64 14 0 0 1 16 -199" fill="none" stroke="#FFF0C8" strokeWidth={1.8} opacity={0.75}/>
        <path d={LOTA} fill="none" stroke="#FFD38A" strokeWidth={1} opacity={0.25}/>
      </g>
      {/* darkness closing in */}
      <rect x={-100} y={-100} width={W + 200} height={H + 200} fill={`url(#${id}dk)`}/>
      {/* the flame over everything: its light is the scene's */}
      <Flame x={FL[0]} y={FL[1]} h={fh} f={f}/>
      {/* the words, each lit with its offering */}
      {labels.map((t, i) => {
        const xs = W / 2 + (i - (labels.length - 1) / 2) * 250, x = ZX + (xs - ZX) / z, o = app[i] * (0.75 + 0.25 * bloom[i]);
        return <text key={i} x={x} y={lblY} textAnchor="middle" fontFamily={isDeva(t) ? SA : EN} fontStyle={isDeva(t) ? "normal" : "italic"} fontSize={(isDeva(t) ? 44 : 40) / z} fill="#F2C46A" opacity={o}>{t}</text>;
      })}
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
