// Katha metaphor scenes: water (21 Oct 2026). The ocean that stays unmoved though rivers pour into it (2.70) and, as a
// variant, the rivers and moths rushing into fire (11.28-29); the lotus leaf that water never wets (5.10); the tortoise
// drawing in its limbs (2.58). Lamplight look: near-black silhouettes, a thin warm rim on the side facing the light,
// light the only colour. Soft light, mist and glow are gradients, never blur filters.
// 22 Oct 2026 (art director's pass): Indian flora and architecture from the shared kit (palmyra, coconut, banyan, kans
// grass, a Nagara temple); every flame is the kit's Flame; rivers are broad sheened ribbons with deltas and foam; headlands
// carry strata, lit spurs and a scrub fringe; the sea is broad soft swells with sparkle only in the light's path; the fire
// is one blaze with a white-hot heart and rolling crowns, fed by eight converging streams of backlit moths; the lotus
// has veined, translucent petals and its drops fall from a young leaf's tip; the tortoise has a beaked wedge head, domed
// scutes and far legs in shadow.
// Props: s.mood "gold" | "dusk" | "dawn" | "night" (defaults: ocean gold, lotus-leaf dawn, tortoise dusk); s.variant "fire" on
// ocean turns the sea into a blaze at the horizon that moths stream into. Every scene renders from {type, kind} alone.
import React, {useId, useMemo} from "react";
import {useCurrentFrame} from "remotion";
import {K, W, H, SoftGlow, mixHex} from "../look";
import {SceneP, Frame, push, Flock} from "../stage";
import {Clouds, Dust} from "../sky";
import {smooth, ribbon, rnd, lerp, clamp01, nrmAt, wob, Pt} from "../geom";
import {Rimmed} from "../sil";
import type {Item} from "../sil";
import {Flame} from "../fire";
import {palmyra, coconut, banyan, reeds as kans} from "../flora";
import {temple} from "../arch";

// ---------- helpers ----------
const ss = (v: number) => { const t = clamp01(v); return t * t * (3 - 2 * t); };
const span = (f: number, a: number, b: number) => ss((f - a) / Math.max(1, b - a));
const useUid = (p: string) => p + useId().replace(/[^a-zA-Z0-9]/g, "");
const n1 = (v: number) => v.toFixed(1);
const lineD = (pts: number[][], close = false) => "M " + pts.map((p) => `${n1(p[0])} ${n1(p[1])}`).join(" L ") + (close ? " Z" : "");
// Dense open Catmull-Rom polyline through control points (k samples per segment).
const dense = (pts: number[][], k = 10): number[][] => {
  const n = pts.length, out: number[][] = [], P = (i: number) => pts[Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < n - 1; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    for (let j = 0; j < k; j++) {
      const t = j / k, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3)));
    }
  }
  out.push([pts[n - 1][0], pts[n - 1][1]]);
  return out;
};
const cumLen = (pts: number[][]) => { const c = [0]; for (let i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return c; };
const atLen = (pts: number[][], cum: number[], s: number): number[] => {
  if (s <= 0) return pts[0];
  const L = cum[cum.length - 1]; if (s >= L) return pts[pts.length - 1];
  let lo = 0, hi = cum.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] < s) lo = m; else hi = m; }
  const u = (s - cum[lo]) / Math.max(1e-6, cum[hi] - cum[lo]);
  return [lerp(pts[lo][0], pts[hi][0], u), lerp(pts[lo][1], pts[hi][1], u)];
};
const subLen = (pts: number[][], cum: number[], s0: number, s1: number, k = 6) => Array.from({length: k + 1}, (_, i) => atLen(pts, cum, s0 + ((s1 - s0) * i) / k));
// A band whose width follows wf(u) along a polyline: leaves, fronds, foam, trails.
const band = (pts: number[][], wf: (u: number) => number): string => {
  const L: number[][] = [], R: number[][] = [], n = pts.length;
  for (let i = 0; i < n; i++) { const nn = nrmAt(pts, i), w = wf(i / (n - 1)) / 2; L.push([pts[i][0] + nn[0] * w, pts[i][1] + nn[1] * w]); R.push([pts[i][0] - nn[0] * w, pts[i][1] - nn[1] * w]); }
  return lineD([...L, ...R.reverse()], true);
};
// The joined outline of kit items (for a flat, far silhouette or one rimmed item).
const itemsD = (its: Item[]) => its.map((it) => (typeof it === "string" ? it : it.d)).join(" ");
// Kit items drawn in one far tint: their own fills (e.g. the darker clumps behind) are dropped.
const flat = (its: Item[]): Item[] => its.map((it) => (typeof it === "string" ? it : {...it, fill: undefined}));
const toward = (from: number[], to: number[]): [number, number] => { const dx = to[0] - from[0], dy = to[1] - from[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };

// ---------- palettes (sky above the horizon only; the sea mirrors it) ----------
type Mood = "gold" | "dusk" | "dawn" | "night";
const moodOf = (m: any, d: Mood): Mood => (m === "gold" || m === "dusk" || m === "dawn" || m === "night" ? m : d);
const SKY: Record<string, [number, string][]> = {
  gold: [[0, "#22163A"], [0.3, "#47294F"], [0.55, "#8C4650"], [0.74, "#D8824C"], [0.88, "#F8BE72"], [1, "#FFE4B0"]],
  dusk: [[0, "#100D26"], [0.35, "#2A2050"], [0.6, "#632E55"], [0.78, "#B9523E"], [0.9, "#EE9C4C"], [1, "#FFD07A"]],
  dawn: [[0, "#141B37"], [0.35, "#2D3B6B"], [0.6, "#776690"], [0.78, "#D9927E"], [0.9, "#F4C390"], [1, "#FFE5BA"]],
  // the film's night: indigo high up, plum low, a banked amber glow at the horizon (the kit's warm night)
  night: [[0, "#06050F"], [0.37, "#0E0C27"], [0.65, "#1D1842"], [0.83, "#34244F"], [0.93, "#56304F"], [1, "#8A4A44"]],
  fire: [[0, "#06030A"], [0.4, "#170A1C"], [0.66, "#3A1224"], [0.86, "#6E2026"], [1, "#A63A2C"]],
};
const SEA: Record<string, [number, string][]> = {
  gold: [[0, "#E9A464"], [0.04, "#B9694C"], [0.16, "#723A50"], [0.42, "#331E3E"], [1, "#0F0A1A"]],
  dusk: [[0, "#E39352"], [0.04, "#A55444"], [0.16, "#55294B"], [0.42, "#251940"], [1, "#0B0816"]],
  dawn: [[0, "#F2D2A6"], [0.05, "#CF9C8C"], [0.18, "#7A6890"], [0.45, "#34406C"], [1, "#11162F"]],
  night: [[0, "#7A4A48"], [0.06, "#3A2848"], [0.3, "#161230"], [1, "#05040C"]],
  // only the horizon is hot; the sea in front is deep crimson-plum
  fire: [[0, "#F08A48"], [0.02, "#A8402E"], [0.07, "#5E1A2C"], [0.22, "#341028"], [0.5, "#1E0B20"], [1, "#0C0610"]],
};
const SUNC: Record<string, [string, string, string]> = {
  gold: ["#FFFBEA", "#FFE08A", "#F5A945"], dusk: ["#FFF6D8", "#FFC86A", "#F59A45"], dawn: ["#FFF8E4", "#FFD9A0", "#F2A47A"],
  night: ["#FFF2D6", "#F2D49C", "#B9825A"], fire: ["#FFF3D0", "#FFB45A", "#E0602E"],
};
const GLINT: Record<string, string> = {gold: "#FFF0C8", dusk: "#FFE6B0", dawn: "#FFF4DC", night: "#FFE8C8", fire: "#FFD08A"};

// The sky down to the horizon: gradient, a few stars, the sun's glow and disc.
const SkyW: React.FC<{mood: string; hor: number; sun: [number, number]; sunR: number; f: number; id: string; stars?: number; disc?: boolean; glow?: number}> =
  ({mood, hor, sun, sunR, f, id, stars = 0.3, disc = true, glow = 1}) => {
  const st = SKY[mood] || SKY.gold, [c0, c1, c2] = SUNC[mood] || SUNC.gold;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={0} y2={hor}>{st.map(([o, c], i) => <stop key={i} offset={o} stopColor={c}/>)}</linearGradient>
        <radialGradient id={`${id}-sun`}><stop offset="0" stopColor={c0}/><stop offset="0.06" stopColor={c1}/><stop offset="0.16" stopColor={c1} stopOpacity={0.62}/><stop offset="0.42" stopColor={c2} stopOpacity={0.24}/><stop offset="1" stopColor={c2} stopOpacity={0}/></radialGradient>
        <radialGradient id={`${id}-core`}><stop offset="0.78" stopColor={c0}/><stop offset="0.9" stopColor={c0} stopOpacity={0.85}/><stop offset="1" stopColor={c0} stopOpacity={0}/></radialGradient>
        <radialGradient id={`${id}-band`}><stop offset="0" stopColor={c1} stopOpacity={0.55}/><stop offset="0.5" stopColor={c2} stopOpacity={0.18}/><stop offset="1" stopColor={c2} stopOpacity={0}/></radialGradient>
      </defs>
      <rect x={-80} y={-80} width={W + 160} height={hor + 100} fill={`url(#${id}-sky)`}/>
      {stars > 0 ? Array.from({length: Math.round(150 * stars)}, (_, i) => {
        const x = rnd(i, 7) * W, y = rnd(i, 8) * hor * 0.55, r = 0.6 + rnd(i, 9) * 1.3, tw = 0.6 + 0.4 * Math.sin(f / (9 + rnd(i, 11) * 14) + i);
        return <circle key={i} cx={x} cy={y} r={r} fill="#FFF3D6" opacity={(1 - y / (hor * 0.55)) * (0.25 + 0.55 * rnd(i, 10)) * tw}/>;
      }) : null}
      <ellipse cx={sun[0]} cy={hor} rx={1100} ry={150} fill={`url(#${id}-band)`} opacity={glow}/>
      {sunR > 0 ? <circle cx={sun[0]} cy={sun[1]} r={sunR * 7.5} fill={`url(#${id}-sun)`} opacity={glow}/> : null}
      {disc && sunR > 0 ? <circle cx={sun[0]} cy={sun[1]} r={sunR * 1.1} fill={`url(#${id}-core)`}/> : null}
    </g>
  );
};
// The sea's body: a gradient that mirrors the sky, and the broad sheen under the sun.
const SeaBase: React.FC<{mood: string; hor: number; sun: [number, number]; id: string; spread?: number; sheen?: number}> = ({mood, hor, sun, id, spread = 260, sheen = 1}) => {
  const st = SEA[mood] || SEA.gold, [, c1, c2] = SUNC[mood] || SUNC.gold;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sea`} gradientUnits="userSpaceOnUse" x1={0} y1={hor} x2={0} y2={H}>{st.map(([o, c], i) => <stop key={i} offset={o} stopColor={c}/>)}</linearGradient>
        <radialGradient id={`${id}-sheen`} cx={sun[0]} cy={hor} r={1} gradientUnits="userSpaceOnUse" gradientTransform={`translate(${sun[0]} ${hor}) scale(${spread * 1.5} ${H - hor + 80}) translate(${-sun[0]} ${-hor})`}>
          <stop offset="0" stopColor={c1} stopOpacity={0.75}/><stop offset="0.3" stopColor={c2} stopOpacity={0.28}/><stop offset="1" stopColor={c2} stopOpacity={0}/></radialGradient>
        <clipPath id={`${id}-clip`}><rect x={-80} y={hor} width={W + 160} height={H - hor + 100}/></clipPath>
      </defs>
      <rect x={-80} y={hor} width={W + 160} height={H - hor + 100} fill={`url(#${id}-sea)`}/>
      <rect x={-80} y={hor} width={W + 160} height={H - hor + 100} fill={`url(#${id}-sheen)`} opacity={sheen} clipPath={`url(#${id}-clip)`}/>
    </g>
  );
};
// The surface: rows of broken light streaks that roll slowly towards us on an even swell, brightest in the sun's
// path, and the glitter of the path itself. side = 0 keeps the streaks to the sun's path only; troughs = false drops the
// dark line under each row (the ocean draws broad Swells instead).
const SeaSurface: React.FC<{mood: string; hor: number; sun: [number, number]; f: number; id: string; spread?: number; glints?: number; rows?: number; amp?: number; period?: number; side?: number; troughs?: boolean; streak?: number}> =
  ({mood, hor, sun, f, id, spread = 260, glints = 340, rows = 30, amp = 1, period = 300, side = 0.22, troughs = true, streak}) => {
  const [, c1] = SUNC[mood] || SUNC.gold, gc = GLINT[mood] || GLINT.gold, depth = H + 40 - hor;
  const sx = sun[0] / W;
  const out: React.ReactNode[] = [];
  for (let k = 0; k < rows; k++) {
    const u = ((((k + f / period) % rows) + rows) % rows) / rows, d = Math.pow(u, 2.05), y = hor + 2 + depth * d;
    const a = (0.4 + 6 * d) * amp, lam = 160 + 700 * d, ph = k * 1.7 + f * 0.01, fade = Math.min(1, u * 8) * Math.min(1, (1 - u) * 6);
    const Y = (x: number) => y + a * Math.sin((x / lam) * 6.283 + ph);
    if (troughs) {   // a soft dark trough under each crest gives the swell its body
      const tr: number[][] = []; for (let x = -80; x <= W + 80; x += lam / 8) tr.push([x, Y(x) + 4 + 12 * d]);
      out.push(<path key={`t${k}`} d={lineD(tr)} fill="none" stroke="#07040E" strokeWidth={3 + 16 * d} opacity={0.13 * fade}/>);
    }
    let x = -80 + rnd(k, 31) * 120, j = 0;
    while (x < W + 80 && j < 60) {
      const len = (16 + 300 * d) * (0.35 + rnd(k * 61 + j, 32)), gap = (8 + 140 * d) * (0.3 + 1.3 * rnd(k * 61 + j, 33));
      const xm = x + len / 2, near = Math.exp(-Math.pow((xm - sun[0]) / ((streak ?? spread) * (0.5 + 1.6 * d) + 40), 2));
      const op = fade * (side * (0.4 + 0.6 * rnd(k * 61 + j, 34)) + 0.75 * near);
      if (op > 0.03) {
        const pts: number[][] = []; for (let i = 0; i <= 4; i++) { const xx = x + (len * i) / 4; pts.push([xx, Y(xx)]); }
        out.push(<path key={`s${k}-${j}`} d={lineD(pts)} fill="none" stroke={`url(#${id}-sw)`} strokeWidth={0.6 + 2.2 * d} strokeLinecap="round" opacity={Math.min(1, op)}/>);
      }
      x += len + gap; j++;
    }
  }
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sw`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={W} y2={0}>
          <stop offset="0" stopColor="#A47CA8"/><stop offset={Math.max(0.05, sx - 0.2)} stopColor="#D49A8C"/>
          <stop offset={sx} stopColor={c1}/><stop offset={Math.min(0.95, sx + 0.2)} stopColor="#D49A8C"/><stop offset="1" stopColor="#A47CA8"/>
        </linearGradient>
      </defs>
      {out}
      {Array.from({length: glints}, (_, i) => {
        const d = Math.pow(rnd(i, 21), 1.7), y = hor + 2 + (H - hor) * d;
        const g = (rnd(i, 22) + rnd(i, 23) + rnd(i, 24) - 1.5) / 1.5, half = spread * (0.1 + 0.9 * d);
        const x = sun[0] + g * half + Math.sin(f / 40 + i) * (2 + 6 * d);
        const w = (3 + 40 * d) * (0.35 + rnd(i, 26)), h = 0.6 + 2.6 * d;
        const tw = 0.5 + 0.5 * Math.sin(f * (0.06 + 0.12 * rnd(i, 27)) + 6.283 * rnd(i, 28));
        const fall = Math.pow(Math.max(0, 1 - Math.abs(g)), 1.3);
        return <ellipse key={i} cx={x} cy={y} rx={w / 2} ry={h / 2} fill={gc} opacity={fall * tw * tw * (0.45 + 0.5 * rnd(i, 29))}/>;
      })}
    </g>
  );
};
// Broad soft swells: long lens-shaped bands of lit water, each with a darker trough in its lee, rolling slowly in from
// the horizon and widening with perspective. Every band fades out at its top and bottom edge (a vertical gradient), so
// they read as soft swells, not lines; they warm only where they cross the light's path.
const Swells: React.FC<{hor: number; sun: [number, number]; f: number; id: string; lit: string; side: string; rows?: number; period?: number; op?: number}> =
  ({hor, sun, f, id, lit, side, rows = 10, period = 620, op = 1}) => {
  const depth = H + 40 - hor, sx = clamp01(sun[0] / W), lit0: React.ReactNode[] = [], warm: React.ReactNode[] = [], dark: React.ReactNode[] = [];
  for (let k = 0; k < rows; k++) {
    const u = ((((k + f / period) % rows) + rows) % rows) / rows, d = Math.pow(u, 2), y = hor + 5 + depth * d;
    const fade = Math.min(1, u * 6) * Math.min(1, (1 - u) * 5) * op;
    const th = 2 + 48 * d, lam = 340 + 1100 * d, a = 1 + 9 * d, ph = k * 2.3 + f * 0.006;
    let x = -160 + rnd(k, 51) * 320, j = 0;
    while (x < W + 160 && j < 12) {
      const len = (320 + 1200 * d) * (0.55 + 0.9 * rnd(k * 31 + j, 52)), r = rnd(k * 31 + j, 53);
      const lens = (sh: number, tk: number) => {
        const top: number[][] = [], bot: number[][] = [];
        for (let i = 0; i <= 18; i++) { const s = i / 18, xx = x + len * s, env = Math.pow(Math.sin(Math.PI * s), 0.75), yy = y + sh + a * Math.sin((xx / lam) * 6.283 + ph); top.push([xx, yy - tk * 0.5 * env]); bot.push([xx, yy + tk * 0.5 * env]); }
        return lineD([...top, ...bot.reverse()], true);
      };
      dark.push(<path key={`d${k}-${j}`} d={lens(th * 0.85, th * 1.15)} fill={`url(#${id}-dv)`} opacity={fade}/>);
      lit0.push(<path key={`a${k}-${j}`} d={lens(0, th)} fill={`url(#${id}-sv)`} opacity={fade * (0.6 + 0.4 * r)}/>);
      if (Math.abs(x + len / 2 - sun[0]) < len / 2 + 260) warm.push(<path key={`b${k}-${j}`} d={lens(-th * 0.05, th * 0.55)} fill={`url(#${id}-swl)`} opacity={fade * (0.6 + 0.4 * r)}/>);
      x += len + (90 + 380 * d) * (0.4 + rnd(k * 31 + j, 54)); j++;
    }
  }
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sv`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={side} stopOpacity={0}/><stop offset="0.42" stopColor={side} stopOpacity={0.22}/><stop offset="0.62" stopColor={side} stopOpacity={0.12}/><stop offset="1" stopColor={side} stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}-dv`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#07040D" stopOpacity={0}/><stop offset="0.5" stopColor="#07040D" stopOpacity={0.24}/><stop offset="1" stopColor="#07040D" stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}-swl`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={W} y2={0}>
          <stop offset="0" stopColor={lit} stopOpacity={0}/><stop offset={Math.max(0.02, sx - 0.16)} stopColor={lit} stopOpacity={0}/>
          <stop offset={sx} stopColor={lit} stopOpacity={0.3}/><stop offset={Math.min(0.98, sx + 0.16)} stopColor={lit} stopOpacity={0}/><stop offset="1" stopColor={lit} stopOpacity={0}/>
        </linearGradient>
      </defs>
      {dark}{lit0}{warm}
    </g>
  );
};

// ---------- land ----------
const vnoise = (x: number, seed: number) => { const i = Math.floor(x), u = x - i, s = u * u * (3 - 2 * u); return lerp(rnd(i, seed), rnd(i + 1, seed), s) * 2 - 1; };
const fbm = (x: number, seed: number, oct = 4) => { let a = 1, fr = 1, sum = 0, nn = 0; for (let o = 0; o < oct; o++) { sum += a * vnoise(x * fr, seed + o * 13); nn += a; a *= 0.5; fr *= 2.07; } return sum / nn; };
// A ridge crest through key points, roughened by noise; fringe (px) grows a fringe of low scrub along its gentler stretches.
const crestPts = (keys: number[][], rough: number, scale: number, seed: number, fringe = 0): number[][] => {
  const d = dense(keys, 24), cum = cumLen(d), L = cum[cum.length - 1], N = Math.max(8, Math.round(L / 2.5));
  const pts = Array.from({length: N + 1}, (_, i) => { const p = atLen(d, cum, (L * i) / N), e = Math.min(1, i / 6, (N - i) / 6); return [p[0], p[1] + e * rough * fbm((L * i) / N / scale, seed)]; });
  if (fringe > 0) {
    const base = pts.map((p) => p[1]);
    for (let i = 0; i <= N; i++) {
      const a = pts[Math.max(0, i - 4)], b = pts[Math.min(N, i + 4)], x = pts[i][0];
      const slope = Math.abs((b[1] - a[1]) / Math.max(1, Math.abs(b[0] - a[0])));
      const on = clamp01((0.95 - slope) / 0.5) * clamp01((vnoise(x / 70, seed + 96) + 0.5) * 1.6) * Math.min(1, i / 10, (N - i) / 10);
      const bush = Math.pow(Math.abs(Math.sin(x / 3.4 + 2.5 * vnoise(x / 19, seed + 97))), 0.55);
      pts[i][1] = base[i] - fringe * on * (0.3 + 0.7 * bush) * (0.55 + 0.45 * (vnoise(x / 13, seed + 98) + 1) / 2);
    }
  }
  return pts;
};
type Ridge = {keys: number[][]; shore: number[][]; rough: number; scale: number; seed: number; fringe?: number};
type Geo = {crest: number[][]; shore: number[][]; d: string};
const ridgeGeo = (r: Ridge): Geo => { const c = crestPts(r.keys, r.rough, r.scale, r.seed, r.fringe || 0); const sh = dense(r.shore, 8).map(([x, y]) => [x, y + 1.5 * fbm(x / 30, r.seed + 7)]); return {crest: c, shore: sh, d: lineD([...c, ...sh], true)}; };
const crestY = (crest: number[][], x: number): number => {
  for (let i = 0; i < crest.length - 1; i++) { const a = crest[i], b = crest[i + 1]; if ((a[0] - x) * (b[0] - x) <= 0) return lerp(a[1], b[1], (x - a[0]) / ((b[0] - a[0]) || 1)); }
  return crest[0][1];
};
// The face of a headland: spurs running down from the skyline, each with a lit face towards the light and a shadowed face
// away from it, and broken ledges of rock strata that catch the light most on the side that faces it. Clipped to the land.
type Spur = [number, number, number];   // the crest x where a spur leaves the skyline, how far its foot shifts in x, its face width
type Deco = {spurs: Spur[]; foot: number; strata?: [number, number, number, number]};   // strata: y at x = 0, slope, spacing, count
const RockFace: React.FC<{geo: Geo; deco: Deco; side: 1 | -1; id: string; lit: string; op?: number}> = ({geo, deco, side, id, lit, op = 1}) => {
  const xs = geo.crest.map((p) => p[0]), x0 = Math.min(...xs), x1 = Math.max(...xs);
  const g = useMemo(() => {
    const faces: string[] = [], shades: string[] = [], ridges: string[] = [], ledges: string[] = [], under: string[] = [];
    deco.spurs.forEach(([cx, shift, w], k) => {
      const ty = crestY(geo.crest, cx) + 3;
      const pts = Array.from({length: 10}, (_, i) => { const u = i / 9; return [cx + shift * u * u + 14 * fbm(u * 2.2 + k * 3, 300 + k) * Math.min(1, u * 4), lerp(ty, deco.foot + 10, u)]; });
      const lt = pts.map(([x, y], i) => { const u = i / 9; return [x + side * w * (0.3 + 0.7 * u), y + 6 * u]; });
      const dk = pts.map(([x, y], i) => { const u = i / 9; return [x - side * w * (0.25 + 0.5 * u), y + 4 * u]; });
      faces.push(lineD([...pts, ...lt.reverse()], true));
      shades.push(lineD([...pts, ...dk.reverse()], true));
      ridges.push(ribbon(pts, 2.2, 0.4, 1, "cw"));
    });
    if (deco.strata) {
      const [y0, sl, sp, n] = deco.strata;
      for (let k = 0; k < n; k++) {
        let seg: number[][] = [];
        const flush = () => {
          if (seg.length > 3) {
            const m = seg.length - 1, t = (i: number) => Math.sin((Math.PI * i) / m);
            ledges.push(lineD([...seg.map(([x, y], i) => [x, y - 0.6 * t(i)]), ...seg.map(([x, y], i) => [x, y + 0.6 + 1.8 * t(i)]).reverse()], true));
            under.push(lineD([...seg.map(([x, y], i) => [x, y + 1.5 * t(i)]), ...seg.map(([x, y], i) => [x, y + 2 + 5 * t(i)]).reverse()], true));
          }
          seg = [];
        };
        for (let x = x0; x <= x1; x += 6) {
          const y = y0 + sl * x + k * sp + 5 * fbm(x / 90, 400 + k);
          if (vnoise(x / 70, 420 + k * 7) > -0.3) seg.push([x, y]); else flush();
        }
        flush();
      }
    }
    return {faces, shades, ridges: ridges.join(" "), ledges: ledges.join(" "), under: under.join(" ")};
  }, [geo, deco, side]);
  return (
    <g opacity={op}>
      <defs>
        <clipPath id={`${id}-c`}><path d={geo.d}/></clipPath>
        <linearGradient id={`${id}-fa`} x1={side > 0 ? 0 : 1} y1={0} x2={side > 0 ? 1 : 0} y2={0.25}>
          <stop offset="0" stopColor={lit} stopOpacity={0.18}/><stop offset="0.45" stopColor={lit} stopOpacity={0.08}/><stop offset="1" stopColor={lit} stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}-sd`} x1={side > 0 ? 1 : 0} y1={0} x2={side > 0 ? 0 : 1} y2={0}>
          <stop offset="0" stopColor="#06030A" stopOpacity={0.26}/><stop offset="0.6" stopColor="#06030A" stopOpacity={0.1}/><stop offset="1" stopColor="#06030A" stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}-le`} gradientUnits="userSpaceOnUse" x1={side > 0 ? x1 : x0} y1={0} x2={side > 0 ? x0 : x1} y2={0}>
          <stop offset="0" stopColor={lit} stopOpacity={0.62}/><stop offset="0.4" stopColor={lit} stopOpacity={0.18}/><stop offset="0.75" stopColor={lit} stopOpacity={0.03}/><stop offset="1" stopColor={lit} stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}-un`} gradientUnits="userSpaceOnUse" x1={side > 0 ? x1 : x0} y1={0} x2={side > 0 ? x0 : x1} y2={0}>
          <stop offset="0" stopColor="#06030A" stopOpacity={0.4}/><stop offset="0.5" stopColor="#06030A" stopOpacity={0.12}/><stop offset="1" stopColor="#06030A" stopOpacity={0}/></linearGradient>
      </defs>
      <g clipPath={`url(#${id}-c)`}>
        {g.shades.map((d, i) => <path key={`s${i}`} d={d} fill={`url(#${id}-sd)`}/>)}
        {g.faces.map((d, i) => <path key={`f${i}`} d={d} fill={`url(#${id}-fa)`}/>)}
        <path d={g.under} fill={`url(#${id}-un)`}/>
        <path d={g.ledges} fill={`url(#${id}-le)`} opacity={0.6}/>
        <path d={g.ridges} fill={`url(#${id}-le)`} opacity={0.5}/>
      </g>
    </g>
  );
};

// ---------- rivers ----------
type RiverDef = {pts: number[][]; w0: number; w1: number; seed: number; mouth?: number; fan?: number};
// A river of light: a broad tapering ribbon, dim lilac-silver where it reflects the high sky and gold where it meets the
// light, its brightness breaking up along its length the way water catches the sky, softened by a faint halo, with
// flecks running downstream. At the mouth (mouth = the direction of the sea) it splits into a braided fan of channels
// over wet, shining sand and spreads a plume and foam into the sea.
const River: React.FC<{r: RiverDef; f: number; id: string; fire?: boolean}> = ({r, f, id, fire = false}) => {
  const g = useMemo(() => {
    const p0 = dense(r.pts, 12), c0 = cumLen(p0), L0 = c0[c0.length - 1];
    const fan = r.mouth != null ? r.fan ?? 1 : 0, dl = fan ? Math.min(L0 * 0.3, r.w1 * 3.6) : 0, L = L0 - dl * 0.85;
    const pts = subLen(p0, c0, 0, L, Math.max(12, Math.round(L / 3))), cum = cumLen(pts);
    const wf = (u: number) => lerp(r.w0, r.w1, Math.pow(u, 1.1));
    // the braided fan: channels from the head of the delta out to the shore, the middle ones widest
    const threads: string[] = [];
    let wet: number[] = [];
    if (fan) {
      const A = atLen(p0, c0, L0 - dl), e = p0[p0.length - 1], md = r.mouth as number, nx = -Math.sin(md), ny = Math.cos(md), n = 3;
      for (let k = 0; k < n; k++) {
        const sp = (k / (n - 1) - 0.5) * 2, E = [e[0] + nx * sp * r.w1 * 1.2 * fan, e[1] + ny * sp * r.w1 * 0.6 * fan];
        const M = [lerp(A[0], E[0], 0.5) + nx * sp * r.w1 * 0.3 + (rnd(k, r.seed + 20) - 0.5) * r.w1 * 0.4, lerp(A[1], E[1], 0.5) + ny * sp * r.w1 * 0.2];
        threads.push(band(dense([A, M, E], 6), (u) => lerp(r.w1 * (0.62 - 0.2 * Math.abs(sp)), 0.8 + r.w1 * 0.08, Math.pow(u, 0.8))));
      }
      wet = [lerp(A[0], e[0], 0.6), lerp(A[1], e[1], 0.6)];
    }
    // the body narrows a little where it opens into the fan, so it runs into the channels instead of ending square
    const wb = (u: number) => wf(u) * (fan ? 1 - 0.45 * ss((u - 0.86) / 0.14) : 1);
    return {pts, cum, L, wf, fan, body: band(pts, wb), halo: band(pts, (u) => wb(u) * 1.9 + 2 * (1 - (fan ? ss((u - 0.9) / 0.1) : 0))), threads: threads.join(" "), wet, end: fan ? p0[p0.length - 1] : pts[pts.length - 1]};
  }, [r]);
  const {pts, cum, L, wf} = g, s0 = pts[0], e = g.end;
  const col = fire ? ["#6A1E22", "#C8502A", "#FFB866", "#FFF0C8"] : ["#6A5C92", "#B8A4C8", "#FFD9A2", "#FFF6E4"];
  // brightness breaking up along the river: the body's opacity rises and falls with a slow noise
  const stops = Array.from({length: 11}, (_, i) => { const u = i / 10; return [u, 0.62 + 0.3 * (vnoise(u * 5 + r.seed * 3, 900 + r.seed) + 1) / 2 + 0.08 * u] as [number, number]; });
  const colAt = (u: number) => (u < 0.55 ? mixHex(col[0], col[1], u / 0.55) : mixHex(col[1], col[2], (u - 0.55) / 0.45));
  const step = fire ? 10 : 12, cnt = Math.floor(L / step), sp = fire ? 3.4 : 1.7;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-rv`} gradientUnits="userSpaceOnUse" x1={s0[0]} y1={s0[1]} x2={e[0]} y2={e[1]}>
          <stop offset="0" stopColor={col[0]}/><stop offset="0.55" stopColor={col[1]}/><stop offset="1" stopColor={col[2]}/></linearGradient>
        <linearGradient id={`${id}-ro`} gradientUnits="userSpaceOnUse" x1={s0[0]} y1={s0[1]} x2={e[0]} y2={e[1]}>
          {stops.map(([u, o], i) => <stop key={i} offset={u} stopColor={colAt(u)} stopOpacity={o}/>)}</linearGradient>
      </defs>
      {g.fan ? <SoftGlow x={g.wet[0]} y={g.wet[1]} r={r.w1 * 4.6} ry={r.w1 * 2} c0={fire ? "#FFB060" : "#F8D6A0"} c1={fire ? "#C04A2A" : "#B07A6A"} peak={0.62} k={1.7}/> : null}
      <path d={g.halo} fill={`url(#${id}-rv)`} opacity={0.16}/>
      <path d={g.body} fill={`url(#${id}-rv)`} opacity={0.35}/>
      <path d={g.body} fill={`url(#${id}-ro)`}/>
      {g.fan ? <path d={g.threads} fill={colAt(0.8)} opacity={0.6}/> : null}
      {Array.from({length: cnt}, (_, k) => {
        const s = ((k * step + f * sp * (0.8 + 0.4 * rnd(k, r.seed)) + rnd(k, r.seed + 1) * step) % L + L) % L;
        const wl = wf(s / L), len = (fire ? 12 : 8) + wl * (0.8 + rnd(k, r.seed + 2)), s1 = Math.min(L, s + len);
        const p0 = atLen(pts, cum, s), p1 = atLen(pts, cum, s1), lx = -(p1[1] - p0[1]), ly = p1[0] - p0[0], ll = Math.hypot(lx, ly) || 1, o = (rnd(k, r.seed + 3) - 0.5) * 0.5 * wl;
        const fade = Math.min(1, (L - s) / 20) * Math.min(1, s / 16);
        return <path key={k} d={ribbon([p0, atLen(pts, cum, (s + s1) / 2), p1].map(([x, y]) => [x + (lx / ll) * o, y + (ly / ll) * o]), Math.min(2.5, wl * 0.1), Math.min(4.5, wl * 0.32))} fill={col[3]} opacity={(fire ? 0.9 : 0.8) * fade}/>;
      })}
      {r.mouth != null ? <Foam x={e[0]} y={e[1]} dir={r.mouth} w={r.w1 * (0.6 + 0.5 * g.fan)} f={f} fire={fire} seed={r.seed}/> : null}
    </g>
  );
};
// Where fresh water meets the sea: a soft plume of lighter water and crescents of foam spreading out and fading.
const Foam: React.FC<{x: number; y: number; dir: number; w: number; f: number; fire?: boolean; seed?: number}> = ({x, y, dir, w, f, fire = false, seed = 0}) => {
  const c = fire ? "#FFD08A" : "#FFF4DE";
  return (
    <g>
      <SoftGlow x={x + Math.cos(dir) * w * 2.6} y={y + Math.sin(dir) * w * 0.9 + 3} r={w * 6.5} ry={w * 1.7} c0={fire ? "#FFC070" : "#F8D8A8"} c1={fire ? "#E0602E" : "#C88A6A"} peak={0.55} k={1.8}/>
      {Array.from({length: 4}, (_, k) => {
        const u = ((((f / 84) + k / 4 + rnd(seed, 9)) % 1) + 1) % 1, R = w * (1.1 + 7 * u), pts: number[][] = [];
        for (let i = 0; i <= 16; i++) { const a = lerp(dir - 1.2, dir + 1.2, i / 16); pts.push([x + Math.cos(a) * R, y + 2 + Math.sin(a) * R * 0.34]); }
        const th = 0.7 + 2.6 * (1 - u);
        return <path key={k} d={band(pts, (v) => th * Math.pow(Math.sin(Math.PI * v), 0.7))} fill={c} opacity={0.78 * Math.pow(1 - u, 1.3) * Math.min(1, u * 6)}/>;
      })}
    </g>
  );
};
// A waterfall from a cliff lip to the sea: falling streaks of light and a breath of mist at its foot.
const Fall: React.FC<{x0: number; y0: number; x1: number; y1: number; w: number; f: number; id: string; fire?: boolean}> = ({x0, y0, x1, y1, w, f, id, fire = false}) => {
  const hgt = y1 - y0;
  const P = (u: number, o: number) => [lerp(x0, x1, u * u) + o * w * (1 + u * 0.7), y0 + hgt * u];
  const bandD = (o0: number, o1: number) => { const L: number[][] = [], R: number[][] = []; for (let i = 0; i <= 10; i++) { L.push(P(i / 10, o0)); R.push(P(i / 10, o1)); } return lineD([...L, ...R.reverse()], true); };
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-fl`} gradientUnits="userSpaceOnUse" x1={0} y1={y0} x2={0} y2={y1}><stop offset="0" stopColor={fire ? "#F08A48" : "#DCD4EC"} stopOpacity={0.95}/><stop offset="1" stopColor={fire ? "#FFD58E" : "#FFF1D6"} stopOpacity={0.85}/></linearGradient>
        <radialGradient id={`${id}-mist`}><stop offset="0" stopColor={fire ? "#FFC070" : "#FFF4E0"} stopOpacity={0.55}/><stop offset="0.45" stopColor={fire ? "#F08A48" : "#E6D4DC"} stopOpacity={0.18}/><stop offset="1" stopColor="#E6D4DC" stopOpacity={0}/></radialGradient>
      </defs>
      <path d={bandD(-0.9, 0.9)} fill="#06030A" opacity={0.4}/>
      <path d={bandD(-0.55, 0.55)} fill={`url(#${id}-fl)`}/>
      {Array.from({length: 14}, (_, k) => {
        const u0 = ((k / 14 + f * (fire ? 0.03 : 0.012) * (0.8 + 0.4 * rnd(k, 3))) % 1), u1 = Math.min(1, u0 + 0.1 + rnd(k, 4) * 0.1), xo = (rnd(k, 5) - 0.5) * 0.7;
        return <path key={k} d={ribbon([P(u0, xo), P((u0 + u1) / 2, xo), P(u1, xo)], 0.6, 2.4)} fill="#FFFFFF" opacity={0.55 * Math.min(1, (1 - u0) * 4)}/>;
      })}
      <ellipse cx={x1} cy={y1 - 3} rx={w * 6 * (1 + 0.06 * Math.sin(f / 23))} ry={w * 2} fill={`url(#${id}-mist)`}/>
    </g>
  );
};

// ---------- the blaze (11.28-29) ----------
// One great fire on the horizon, built of the kit's Flame: a tall heart flame and a mound of others round it, leaning in
// towards the middle so the whole reads as one converging blaze; a white-hot heart at its foot; billows of fire-light
// rolling up off its crown; the sky lit far around it.
const Blaze: React.FC<{x: number; y: number; w: number; h: number; f: number; k?: number}> = ({x, y, w, h, f, k = 1}) => {
  const id = useUid("bz");
  const fl = useMemo(() => Array.from({length: 22}, (_, i) => {
    const g = i === 0 ? 0 : (rnd(i, 601) + rnd(i, 602) + rnd(i, 603) - 1.5) / 1.35;
    const env = Math.exp(-Math.pow(g / 0.55, 2));
    return {g, hh: i === 0 ? 1 : (0.2 + 0.68 * env) * (0.8 + 0.35 * rnd(i, 604)), s: i};
  }).sort((a, b) => b.hh - a.hh), []);
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-bl`} cx="0.5" cy="0.62" fx="0.5" fy="0.85" r="0.55"><stop offset="0" stopColor="#FFC27A" stopOpacity={0.55}/><stop offset="0.45" stopColor="#E0703A" stopOpacity={0.28}/><stop offset="1" stopColor="#8E2A3A" stopOpacity={0}/></radialGradient>
      </defs>
      <SoftGlow x={x} y={y - h * 0.4} r={w * 3.1} ry={h * 1.55} c0="#FFB866" c1="#9A3030" peak={0.62} k={1.4}/>
      <SoftGlow x={x} y={y - h * 0.3} r={w * 1.5} ry={h * 0.95} c0="#FFE2A8" c1="#F08A48" peak={0.55} k={1.9}/>
      {Array.from({length: 13}, (_, i) => {
        const p = (((f / 170 + rnd(i, 611)) % 1) + 1) % 1, sw = Math.sin(p * 3.2 + i * 1.7);
        const bx = x + (rnd(i, 612) - 0.5) * w * 1.1 * (1 - 0.35 * p) + sw * 34, by = y - h * (0.62 + 0.72 * p) * k, r = h * (0.13 + 0.2 * p);
        return <ellipse key={i} cx={bx} cy={by} rx={r * 1.25} ry={r} fill={`url(#${id}-bl)`} opacity={Math.pow(Math.sin(Math.PI * p), 1.2) * 0.9}/>;
      })}
      {fl.map((q) => (
        <Flame key={q.s} x={x + q.g * w} y={y + 4} h={h * q.hh * k * (0.96 + 0.04 * wob(f / 18, q.s))} w={h * q.hh * k * (0.24 + 0.07 * rnd(q.s, 605))} f={f}
          seed={q.s * 7 + 3} calm={0.15} lean={-q.g * 0.24 + 0.04 * Math.sin(f / 40 + q.s)} halo={0} licks={q.s === 0 ? 4 : 2} blue={0.3}/>
      ))}
      <SoftGlow x={x} y={y - h * 0.12} r={w * 1.35} ry={h * 0.3} c0="#FFFFF6" c1="#FFE6A8" peak={0.95} k={2}/>
      <SoftGlow x={x} y={y + 2} r={w * 2.1} ry={24} c0="#FFF6DA" c1="#FFB060" peak={0.95} k={1.6}/>
    </g>
  );
};
// Moths streaming into the fire along eight curving flight lines that all wheel the same way and meet in the blaze: pale,
// translucent wings lit through by the fire and glowing at their edges, a dark body; they speed up and shrink with
// distance as they near it, and each one flares into sparks where it meets the light. A river of sparks runs along each
// stream with them, so the eight streams read clearly.
const MT: [number, number] = [960, 452];
const M_STARTS: number[][] = [[-180, 110], [-200, 640], [130, 1250], [800, 1260], [1420, 1250], [2020, 1130], [2120, 560], [2060, 60]];
const M_STREAMS = M_STARTS.map((S) => {
  const v = [S[0] - MT[0], S[1] - MT[1]], a = 0.62, c = Math.cos(a), s = Math.sin(a);
  return [S, [MT[0] + (v[0] * c - v[1] * s) * 0.56, MT[1] + (v[0] * s + v[1] * c) * 0.56], MT];
});
const bez = (S: number[], C: number[], T: number[], t: number) => { const u = 1 - t; return [u * u * S[0] + 2 * u * t * C[0] + t * t * T[0], u * u * S[1] + 2 * u * t * C[1] + t * t * T[1]]; };
const Moths: React.FC<{f: number; id: string; per?: number}> = ({f, id, per = 14}) => {
  const motes: React.ReactNode[] = [], moths: {sz: number; el: React.ReactNode}[] = [], sparks: React.ReactNode[] = [];
  M_STREAMS.forEach(([S, C, T], si) => {
    // the river of sparks: motes drifting along the stream, quickening towards the fire
    for (let j = 0; j < 44; j++) {
      const i = si * 53 + j, p = (((f * 0.0052 * (0.8 + 0.4 * rnd(i, 76)) + rnd(i, 77)) % 1) + 1) % 1, q = Math.pow(p, 1.5);
      const P0 = bez(S, C, T, q), Pb = bez(S, C, T, Math.max(0, q - 0.01)), ang = Math.atan2(P0[1] - Pb[1], P0[0] - Pb[0]);
      const lat = (rnd(i, 78) - 0.5) * 36 * (1 - q), x = P0[0] - Math.sin(ang) * lat, y = P0[1] + Math.cos(ang) * lat, r = (0.9 + 1.8 * rnd(i, 79)) * (1.5 - q);
      motes.push(<circle key={`p${i}`} cx={x} cy={y} r={r} fill="#FFDCA6" opacity={(0.45 + 0.5 * q) * Math.min(1, p * 8) * Math.min(1, (1 - p) * 20)}/>);
    }
    for (let j = 0; j < per; j++) {
      const i = si * 31 + j, v = 0.0034 * (0.9 + 0.25 * rnd(si, 70));
      const p = (((f * v + j / per + rnd(i, 71) * 0.05) % 1) + 1) % 1, q = Math.pow(p, 1.7);
      const P0 = bez(S, C, T, q), Pb = bez(S, C, T, Math.max(0, q - 0.01));
      const ang = Math.atan2(P0[1] - Pb[1], P0[0] - Pb[0]), nx = -Math.sin(ang), ny = Math.cos(ang);
      const lat = ((rnd(i, 72) - 0.5) * 26 + Math.sin(f / 9 + i) * 6) * (1 - q);
      if (q > 0.965) {   // the flare: a flash and a burst of sparks where it meets the fire
        const u = (q - 0.965) / 0.035, cx = T[0] + nx * lat, cy = T[1] + ny * lat;
        sparks.push(<circle key={`x${i}`} cx={cx} cy={cy} r={5 + 26 * u} fill={`url(#${id}-fl)`} opacity={1 - u}/>);
        for (let k = 0; k < 6; k++) { const a = rnd(i * 6 + k, 74) * 6.283, d = (5 + 54 * u) * (0.6 + 0.7 * rnd(i * 6 + k, 75)); sparks.push(<circle key={`y${i}-${k}`} cx={cx + Math.cos(a) * d} cy={cy + Math.sin(a) * d - 16 * u} r={0.5 + 1.6 * (1 - u)} fill="#FFF0C8" opacity={0.95 * (1 - u)}/>); }
        continue;
      }
      const P = [P0[0] + nx * lat, P0[1] + ny * lat + Math.sin(f / 5 + i * 2) * 3 * (1 - q)];
      const sz = lerp(48, 3, Math.pow(q, 0.7)) * (0.6 + 0.8 * rnd(i, 73));
      const ca = Math.cos(ang), sa = Math.sin(ang), fl = 0.55 + 0.45 * Math.abs(Math.sin(f * (0.5 + 0.45 * q) + i * 1.7));
      const Q = (u: number, w: number, k: number): Pt => [P[0] + (ca * u - sa * w) * sz * k, P[1] + (sa * u + ca * w) * sz * k];
      const wings = (k: number) => [1, -1].map((g) =>
        smooth([Q(0.2, 0.04 * g, k), Q(0.3, 0.42 * g * fl, k), [...Q(0.16, 1.08 * g * fl, k), "c"] as Pt, Q(-0.16, 0.86 * g * fl, k), Q(-0.12, 0.34 * g * fl, k), Q(-0.06, 0.05 * g, k)]) + " " +
        smooth([Q(-0.04, 0.05 * g, k), Q(-0.14, 0.54 * g * fl, k), Q(-0.34, 0.5 * g * fl, k), Q(-0.44, 0.18 * g * fl, k), Q(-0.28, 0.04 * g, k)])).join(" ");
      const bx = P[0] - ca * sz * 0.08, by = P[1] - sa * sz * 0.08;
      moths.push({sz, el: <g key={`m${i}`}>
        <circle cx={P[0]} cy={P[1]} r={sz * 1.9} fill={`url(#${id}-gl)`} opacity={0.35 + 0.5 * q}/>
        <path d={wings(1)} fill="#FFE9C8" opacity={0.5 + 0.35 * q} stroke="#FFF6E2" strokeWidth={Math.max(0.5, sz * 0.03)} strokeOpacity={0.7}/>
        <path d={wings(0.5)} fill="#5A2E2C" opacity={0.6 - 0.25 * q}/>
        <ellipse cx={bx} cy={by} rx={sz * 0.4} ry={sz * 0.1} transform={`rotate(${(ang * 180) / Math.PI} ${bx} ${by})`} fill="#2A141A"/>
        {sz > 9 ? <path d={[1, -1].map((g) => { const a = Q(0.3, 0.03 * g, 1), c = Q(0.46, 0.1 * g, 1), b = Q(0.56, 0.24 * g, 1); return `M ${n1(a[0])} ${n1(a[1])} Q ${n1(c[0])} ${n1(c[1])} ${n1(b[0])} ${n1(b[1])}`; }).join(" ")} fill="none" stroke="#3A2024" strokeWidth={Math.max(0.6, sz * 0.03)} strokeLinecap="round"/> : null}
      </g>});
    }
  });
  moths.sort((a, b) => a.sz - b.sz);
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-gl`}><stop offset="0" stopColor="#FFE2B0" stopOpacity={0.6}/><stop offset="0.45" stopColor="#FFB060" stopOpacity={0.18}/><stop offset="1" stopColor="#F08A48" stopOpacity={0}/></radialGradient>
        <radialGradient id={`${id}-fl`}><stop offset="0" stopColor="#FFFBEA" stopOpacity={0.95}/><stop offset="0.3" stopColor="#FFD08A" stopOpacity={0.45}/><stop offset="1" stopColor="#F08A48" stopOpacity={0}/></radialGradient>
      </defs>
      {motes}{moths.map((m) => m.el)}{sparks}
    </g>
  );
};
// Embers lifting off the blaze.
const Embers: React.FC<{f: number; hor: number; n?: number}> = ({f, hor, n = 80}) => (
  <g>{Array.from({length: n}, (_, i) => {
    const per = 120 + rnd(i, 81) * 140, p = (((f + rnd(i, 82) * per) / per) % 1 + 1) % 1;
    const x = lerp(640, 1280, rnd(i, 83)) + Math.sin(f / 30 + i) * 14 + p * (rnd(i, 84) - 0.5) * 160, y = hor - 60 - p * (260 + rnd(i, 85) * 320);
    return <circle key={i} cx={x} cy={y} r={0.8 + rnd(i, 86) * 1.8} fill="#FFD58E" opacity={Math.sin(Math.PI * p) * (0.4 + 0.5 * rnd(i, 87))}/>;
  })}</g>
);

// ---------- 1. the ocean (2.70) ----------
const OH = 572;   // horizon
const O_FAR_L: Ridge = {keys: [[-80, 440], [120, 424], [300, 446], [520, 484], [720, 528], [880, 558], [1000, 571]], shore: [[1000, OH + 1], [-80, OH + 1]], rough: 5, scale: 40, seed: 11};
const O_FAR_R: Ridge = {keys: [[2000, 466], [1820, 456], [1640, 482], [1480, 524], [1360, 556], [1250, 571]], shore: [[1250, OH + 1], [2000, OH + 1]], rough: 5, scale: 40, seed: 12};
const O_L0: Ridge = {keys: [[-80, 330], [40, 282], [150, 250], [230, 270], [300, 298], [380, 318], [460, 362], [540, 420], [620, 486], [690, 552], [740, 596], [790, 612]], shore: [[790, 614], [400, 614], [-80, 614]], rough: 10, scale: 56, seed: 13, fringe: 3.5};
const O_PLAIN: Ridge = {keys: [[-80, 598], [200, 592], [420, 596], [620, 604], [740, 616], [792, 628]], shore: [[792, 630], [500, 634], [-80, 640]], rough: 1.5, scale: 30, seed: 19, fringe: 4};
const O_L2: Ridge = {keys: [[-80, 548], [40, 536], [140, 548], [240, 590], [316, 640], [372, 676], [404, 694]], shore: [[404, 696], [260, 704], [80, 716], [-80, 730]], rough: 7, scale: 34, seed: 15, fringe: 6};
const O_R0: Ridge = {keys: [[2000, 326], [1880, 292], [1780, 270], [1700, 300], [1620, 340], [1540, 400], [1470, 460], [1410, 520], [1370, 568], [1346, 594]], shore: [[1346, 596], [2000, 596]], rough: 10, scale: 56, seed: 16, fringe: 3.5};
const O_R1: Ridge = {keys: [[2000, 430], [1880, 420], [1760, 440], [1660, 462], [1600, 478], [1566, 494], [1548, 500], [1538, 540], [1534, 590], [1522, 640]], shore: [[1522, 642], [2000, 642]], rough: 6, scale: 30, seed: 17, fringe: 4};
const O_R2: Ridge = {keys: [[2000, 604], [1900, 588], [1800, 604], [1720, 644], [1662, 688], [1640, 702]], shore: [[1640, 704], [1820, 716], [2000, 730]], rough: 7, scale: 34, seed: 18, fringe: 6};
const O_DECO: Record<string, Deco> = {
  L0: {spurs: [[196, 24, 120], [420, 56, 120], [600, 44, 80]], foot: 614, strata: [262, 0.2, 38, 10]},
  R0: {spurs: [[1752, -24, 120], [1566, -56, 110], [1442, -36, 70]], foot: 596, strata: [692, -0.2, 38, 9]},
  R1: {spurs: [], foot: 642, strata: [470, 0, 22, 8]},
  L2: {spurs: [[60, 26, 100], [262, 22, 70]], foot: 728, strata: [530, 0.24, 30, 7]},
  R2: {spurs: [[1860, -26, 100]], foot: 728, strata: [1090, -0.24, 30, 7]},
};
const O_RIVERS: Record<string, RiverDef[]> = {
  L0: [{pts: [[306, 306], [314, 336], [310, 366], [322, 400], [338, 434], [342, 470], [358, 508], [374, 546], [392, 576], [412, 602]], w0: 3, w1: 8, seed: 1}],
  PLAIN: [{pts: [[412, 601], [452, 606], [500, 604], [552, 608], [606, 612], [660, 616], [708, 621], [748, 627]], w0: 6, w1: 10, seed: 2, mouth: 0.3, fan: 0.5}],
  L2: [{pts: [[98, 552], [110, 584], [104, 616], [124, 648], [156, 680], [190, 709]], w0: 4, w1: 15, seed: 3, mouth: 1.25, fan: 1}],
  R0: [{pts: [[1702, 302], [1698, 332], [1706, 364], [1698, 398], [1688, 430], [1678, 468]], w0: 3, w1: 7, seed: 4}],
  R1: [{pts: [[1858, 430], [1820, 444], [1806, 458], [1760, 468], [1706, 478], [1646, 488], [1578, 498]], w0: 3, w1: 9, seed: 5}],
  R2: [{pts: [[1846, 606], [1836, 632], [1848, 660], [1814, 688], [1772, 703], [1724, 710]], w0: 4, w1: 15, seed: 6, mouth: Math.PI - 0.5, fan: 1}],
};
// palmyras on the lands: [land, x, height, seed]
const O_PALMS: [string, number, number, number][] = [
  ["PL", 30, 150, 1], ["PL", 72, 116, 2], ["PL", 236, 170, 3], ["PL", 276, 134, 4], ["PL", 560, 104, 5], ["PL", 594, 84, 6],
  ["L2", 236, 104, 7],
  ["R1", 1722, 64, 8], ["R1", 1752, 52, 9], ["R1", 1884, 70, 10],
  ["R2", 1906, 150, 11], ["R2", 1944, 118, 12], ["R2", 1806, 96, 13],
];
const ROCKS: number[][] = [[430, 700, 14], [466, 694, 7], [372, 712, 9], [1610, 708, 12], [1580, 700, 6], [1500, 648, 8], [1474, 644, 5]];
const rock = (x: number, y: number, r: number, i: number) => smooth(Array.from({length: 7}, (_, k) => { const a = Math.PI + (k / 6) * Math.PI; return [x + Math.cos(a) * r * (0.9 + 0.3 * rnd(i * 7 + k, 41)), y + Math.sin(a) * r * (0.55 + 0.35 * rnd(i * 7 + k, 42)) + 1] as Pt; }).concat([[x + r, y + 2, "c"], [x - r, y + 2, "c"]] as Pt[]));
const reflectD = (crest: number[][], y0: number) => lineD([...crest.map(([x, y]) => [x, 2 * y0 - y]), [crest[crest.length - 1][0], y0], [crest[0][0], y0]], true);
const Ocean: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), id = useUid("oc");
  const fire = s.variant === "fire", mood = fire ? "fire" : moodOf(s.mood, "gold");
  // the one light of the shot: the low sun, or the heart of the blaze
  const sun: [number, number] = fire ? [960, 440] : [960, 512];
  const geo = useMemo(() => ({FL: ridgeGeo(O_FAR_L), FR: ridgeGeo(O_FAR_R), L0: ridgeGeo(O_L0), PL: ridgeGeo(O_PLAIN), L2: ridgeGeo(O_L2), R0: ridgeGeo(O_R0), R1: ridgeGeo(O_R1), R2: ridgeGeo(O_R2)}), []);
  const lightL: [number, number] = [1, -0.5], lightR: [number, number] = [-1, -0.5];
  const k = fire ? 0.86 + 0.14 * span(f, 0, n * 0.4) : 1;
  const far = fire ? ["#3A1A26", "#6A2A2C"] : mood === "dawn" ? ["#5A4C78", "#9A88A8"] : mood === "night" ? ["#1C2448", "#3A2E50"] : ["#5A3352", "#A0585A"];
  const mid = fire ? "#22101A" : mood === "dawn" ? "#2E2846" : mood === "night" ? "#141530" : "#2A1834";
  const rim = `url(#${id}-rimg)`, lit = fire ? "#FF9450" : mood === "dawn" ? "#FFD2A8" : "#FFC888";
  const layer = (g: {d: string}, fill: string, light: [number, number], w = 3, rimC = rim) => <Rimmed paths={[g.d]} fill={fill} light={light} w={w} rim={rimC}/>;
  const rivers = (key: string, _land?: string) => O_RIVERS[key].map((r, i) => <River key={key + i} r={r} f={f} id={`${id}${key}${i}`} fire={fire}/>);
  const face = (key: string, side: 1 | -1) => <RockFace geo={(geo as any)[key]} deco={O_DECO[key]} side={side} id={`${id}rf${key}`} lit={lit}/>;
  const palms = (land: string, fill: string) => {
    const g = (geo as any)[land] as Geo, P = O_PALMS.filter((p) => p[0] === land);
    return <Rimmed paths={P.flatMap(([, x, h, sd]) => palmyra({x, y: crestY(g.crest, x) + 3, h, seed: sd, t: f, wind: x < sun[0] ? 0.15 : -0.15}))} fill={fill} point={[sun[0], sun[1] - 120]} light={[0, -1]} w={1.6} rim={rim}/>;
  };
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.05)} cy={OH} vig={fire ? 0.85 : 1}>
      <SkyW mood={mood} hor={OH} sun={sun} sunR={fire ? 0 : 50} f={f} id={id} stars={fire ? 0.15 : mood === "night" ? 1 : 0.35} disc={!fire} glow={fire ? 0.5 : 1}/>
      {!fire ? <Clouds f={f} mood={mood as Mood} op={0.55}/> : null}
      {fire ? <Blaze x={960} y={OH} w={330} h={430} f={f} k={k}/> : null}
      <SeaBase mood={mood} hor={OH} sun={sun} id={id} spread={fire ? 170 : 220} sheen={fire ? 0.75 : 1}/>
      <defs>
        <linearGradient id={`${id}-rf`} gradientUnits="userSpaceOnUse" x1={0} y1={600} x2={0} y2={800}><stop offset="0" stopColor="#0A0612" stopOpacity={0.55}/><stop offset="1" stopColor="#0A0612" stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}-hz`} gradientUnits="userSpaceOnUse" x1={0} y1={400} x2={0} y2={OH}><stop offset="0" stopColor={far[0]}/><stop offset="1" stopColor={far[1]}/></linearGradient>
        <radialGradient id={`${id}-rimg`} gradientUnits="userSpaceOnUse" cx={sun[0]} cy={sun[1]} r={1150}>
          <stop offset="0" stopColor={fire ? "#FFF0C8" : "#FFF0CC"}/><stop offset="0.3" stopColor={fire ? "#FFB868" : K.rim}/><stop offset="0.62" stopColor={fire ? "#D8703E" : "#D99A66"} stopOpacity={0.8}/><stop offset="1" stopColor={fire ? "#8E3A30" : "#7A4A58"} stopOpacity={0.55}/></radialGradient>
        <linearGradient id={`${id}-fL`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={800} y2={0}><stop offset="0" stopColor={fire ? "#FF9A50" : "#F2B070"} stopOpacity={0}/><stop offset="0.55" stopColor={fire ? "#FF9A50" : "#F2B070"} stopOpacity={0.04}/><stop offset="1" stopColor={fire ? "#FFB868" : "#FFD08A"} stopOpacity={fire ? 0.3 : 0.2}/></linearGradient>
        <linearGradient id={`${id}-fR`} gradientUnits="userSpaceOnUse" x1={W} y1={0} x2={1300} y2={0}><stop offset="0" stopColor={fire ? "#FF9A50" : "#F2B070"} stopOpacity={0}/><stop offset="0.5" stopColor={fire ? "#FF9A50" : "#F2B070"} stopOpacity={0.04}/><stop offset="1" stopColor={fire ? "#FFB868" : "#FFD08A"} stopOpacity={fire ? 0.3 : 0.2}/></linearGradient>
        <linearGradient id={`${id}-h0`} gradientUnits="userSpaceOnUse" x1={0} y1={280} x2={0} y2={600}><stop offset="0" stopColor={mid}/><stop offset="1" stopColor={fire ? "#3A1620" : mood === "dawn" ? "#4A3C5E" : mood === "night" ? "#2A2240" : "#3E2238"}/></linearGradient>
      </defs>
      {/* the headlands mirrored in the still water, fading fast */}
      <path d={reflectD(geo.PL.crest, 632)} fill={`url(#${id}-rf)`}/>
      <path d={reflectD(geo.L2.crest, 706)} fill={`url(#${id}-rf)`}/>
      <path d={reflectD(geo.R1.crest, 641)} fill={`url(#${id}-rf)`}/>
      <path d={reflectD(geo.R2.crest, 712)} fill={`url(#${id}-rf)`}/>
      {/* broad soft swells; the sparkle stays in the light's path */}
      <Swells hor={OH} sun={sun} f={f} id={`${id}sw`} lit={fire ? "#E0703A" : "#FFC888"} side={fire ? "#6A2238" : mood === "dawn" ? "#A898C0" : "#A87898"} op={fire ? 0.8 : 1}/>
      <SeaSurface mood={mood} hor={OH} sun={sun} f={f} id={id} spread={fire ? 150 : 200} glints={fire ? 200 : 300} side={0} troughs={false} streak={fire ? 70 : 90}/>
      {layer(geo.FL, `url(#${id}-hz)`, lightL, 2, fire ? "#FFB060" : "#F6CB92")}
      {layer(geo.FR, `url(#${id}-hz)`, lightR, 2, fire ? "#FFB060" : "#F6CB92")}
      {layer(geo.L0, `url(#${id}-h0)`, lightL, 2.5)}<path d={geo.L0.d} fill={`url(#${id}-fL)`}/>{face("L0", 1)}{rivers("L0", mid)}
      {layer(geo.R0, `url(#${id}-h0)`, lightR, 2.5)}<path d={geo.R0.d} fill={`url(#${id}-fR)`}/>{face("R0", -1)}{rivers("R0", mid)}
      {layer(geo.PL, mid, lightL, 2)}{palms("PL", mid)}{rivers("PLAIN", mid)}
      {layer(geo.R1, mid, lightR, 3)}<path d={geo.R1.d} fill={`url(#${id}-fR)`} opacity={0.6}/>{face("R1", -1)}{palms("R1", mid)}{rivers("R1", mid)}
      <Fall x0={1572} y0={500} x1={1550} y1={642} w={11} f={f} id={`${id}wf`} fire={fire}/>
      <Foam x={1550} y={642} dir={1.9} w={8} f={f} fire={fire} seed={9}/>
      {layer(geo.L2, K.sil, lightL, 3)}{face("L2", 1)}{palms("L2", K.sil)}{rivers("L2", K.sil)}
      {layer(geo.R2, K.sil, lightR, 3)}{face("R2", -1)}{palms("R2", K.sil)}{rivers("R2", K.sil)}
      <Rimmed paths={ROCKS.map(([x, y, r], i) => ({d: rock(x, y, r, i), c: [x, y] as [number, number]}))} fill={K.sil} point={[sun[0], sun[1] - 120]} light={[0, -1]} w={1.5} rim={rim}/>
      {fire ? <><Embers f={f} hor={OH}/><Moths f={f} id={`${id}m`}/></> : <Dust f={f} sun={sun} n={40} y0={180} y1={880}/>}
    </Frame>
  );
};


// ---------- 2. the lotus leaf (5.10) ----------
// The far shore of a temple tank: a low bank with reed beds of kans grass (memoized: it does not sway at that distance).
const reedBank = (x0: number, x1: number, y: number, h: number, seed: number, step = 64): string => {
  const top: number[][] = [], out: string[] = [];
  for (let x = x0; x <= x1; x += 2.5) {
    const blades = Math.pow(Math.abs(Math.sin(x / 1.9 + 3 * vnoise(x / 9, seed + 5))), 3) * (0.6 + 0.4 * (vnoise(x / 30, seed + 6) + 1) / 2);
    top.push([x, y - h * (0.35 + 0.3 * (vnoise(x / 120, seed) + 1) / 2 + 0.7 * blades) * Math.min(1, (x - x0) / 80, (x1 - x) / 80)]);
  }
  out.push(lineD([...top, [x1, y + 8], [x0, y + 8]], true));
  for (let x = x0 + 20, i = 0; x < x1 - 20 && i < 110; i++) {
    const g = crestY(top, x), hr = h * (1.3 + 1.2 * rnd(i, seed + 1));
    out.push(itemsD(kans({x, y: g + 3, h: hr, seed: seed + i, detail: 0.4, plumes: 2, wind: 0.2})));
    x += step * (0.6 + 0.8 * rnd(i, seed + 2));
  }
  return out.join(" ");
};
// A point on a raised lotus leaf seen a little from above: th around the rim, rho from the navel (0) to the rim (1). The
// rim is gently waved, the leaf is a shallow bowl, and its right-front edge droops: that is where the water runs off.
const leafPt = (C: number[], rx: number, ry: number, th: number, rho: number, droop = 30): number[] => {
  const wav = 1 + 0.028 * Math.sin(th * 7 + 0.6) + 0.016 * Math.sin(th * 13 + 2.1);
  const x = C[0] + Math.cos(th) * rx * rho * wav;
  const t = ((th % 6.283) + 6.283) % 6.283, dr = Math.exp(-Math.pow((t - 0.3) / 0.5, 2)) + Math.exp(-Math.pow((t - 6.583) / 0.5, 2));
  const ruff = Math.pow(rho, 4) * ry * (0.07 * Math.sin(th * 9 + 1.2) + 0.04 * Math.sin(th * 15 + 0.4));
  const y = C[1] + Math.sin(th) * ry * rho * wav + (1 - rho * rho) * ry * 0.16 + Math.pow(rho, 5) * dr * droop + ruff;
  return [x, y];
};
const LotusLeaf: React.FC<{C: number[]; rx: number; ry: number; light: [number, number]; id: string; veins?: number; droop?: number; fill?: string}> = ({C, rx, ry, light, id, veins = 23, droop = 30, fill = "#1A1226"}) => {
  const K2 = 120;
  const top = Array.from({length: K2}, (_, i) => leafPt(C, rx, ry, (i / K2) * 6.283, 1, droop));
  const under = top.map(([x, y], i) => { const th = (i / K2) * 6.283; return [x, y + ry * 0.07 + ry * 0.16 * Math.max(0, Math.sin(th))]; });
  const topD = lineD(top, true), N = leafPt(C, rx, ry, 0, 0, droop);
  const P2 = (th: number, r: number) => { const p = leafPt(C, rx, ry, th, r, droop); return `${n1(p[0])} ${n1(p[1])}`; };
  const dt = 6.283 / veins;
  const vd = Array.from({length: veins}, (_, k) => { const th = k * dt + 0.13;
    return `M ${n1(N[0])} ${n1(N[1])} Q ${P2(th + 0.04, 0.4)} ${P2(th, 0.7)} M ${P2(th, 0.7)} Q ${P2(th - dt * 0.12, 0.84)} ${P2(th - dt * 0.24, 0.97)} M ${P2(th, 0.7)} Q ${P2(th + dt * 0.12, 0.84)} ${P2(th + dt * 0.24, 0.97)}`; }).join(" ");
  const nearEdge = top.filter((_, i) => { const th = (i / K2) * 6.283; return th > 0.15 && th < 3.0; });
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sh`} gradientUnits="userSpaceOnUse" x1={0} y1={C[1] - ry} x2={0} y2={C[1] + ry}><stop offset="0" stopColor="#D7BFD0" stopOpacity={0.5}/><stop offset="0.35" stopColor="#7A6690" stopOpacity={0.2}/><stop offset="0.8" stopColor="#2A2038" stopOpacity={0.04}/><stop offset="1" stopColor="#2A2038" stopOpacity={0}/></linearGradient>
        <radialGradient id={`${id}-sp`}><stop offset="0" stopColor="#FFF0D0" stopOpacity={0.4}/><stop offset="0.5" stopColor="#FFD9A0" stopOpacity={0.12}/><stop offset="1" stopColor="#FFD9A0" stopOpacity={0}/></radialGradient>
        <clipPath id={`${id}-cl`}><path d={topD}/></clipPath>
      </defs>
      <Rimmed paths={[lineD(under, true), topD]} fill={fill} light={light} w={3}/>
      <g clipPath={`url(#${id}-cl)`}>
        <path d={topD} fill={`url(#${id}-sh)`} transform={`translate(${C[0]} ${C[1]}) scale(0.985) translate(${-C[0]} ${-C[1]})`}/>
        <ellipse cx={C[0] + rx * 0.38} cy={C[1] - ry * 0.42} rx={rx * 0.5} ry={ry * 0.32} fill={`url(#${id}-sp)`}/>
        <ellipse cx={C[0]} cy={C[1] + ry * 0.95} rx={rx * 0.95} ry={ry * 0.5} fill="#0A0612" opacity={0.35}/>
        <path d={vd} fill="none" stroke="#FFE3B0" strokeWidth={Math.max(0.8, rx / 300)} opacity={0.14}/>
        <circle cx={N[0]} cy={N[1]} r={ry * 0.09} fill="#FFE3B0" opacity={0.2}/>
      </g>
      <path d={lineD(nearEdge)} fill="none" stroke="#FFE3B0" strokeWidth={1.1} opacity={0.22}/>
    </g>
  );
};
// A water bead: a dark lens with the sky in its top, a sun spark and a caustic glow underneath.
const Bead: React.FC<{x: number; y: number; r: number; id: string; op?: number}> = ({x, y, r, id, op = 1}) => (
  <g opacity={op}>
    <circle cx={x} cy={y} r={r * 3.2} fill={`url(#${id}-bh)`}/>
    <ellipse cx={x + r * 0.25} cy={y + r * 0.55} rx={r * 1.05} ry={r * 0.42} fill="#07040C" opacity={0.45}/>
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.84} fill={`url(#${id}-bd)`}/>
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.84} fill="none" stroke="#FFF0D0" strokeWidth={Math.max(0.6, r * 0.12)} opacity={0.55}/>
    <ellipse cx={x - r * 0.05} cy={y + r * 0.42} rx={r * 0.55} ry={r * 0.22} fill="#FFE3A3" opacity={0.75}/>
    <circle cx={x + r * 0.32} cy={y - r * 0.38} r={Math.max(0.8, r * 0.24)} fill="#FFFFFF"/>
  </g>
);
const BeadDefs: React.FC<{id: string}> = ({id}) => (
  <defs>
    <radialGradient id={`${id}-bh`}><stop offset="0" stopColor="#FFF0D0" stopOpacity={0.55}/><stop offset="0.35" stopColor="#FFE3A3" stopOpacity={0.18}/><stop offset="1" stopColor="#FFE3A3" stopOpacity={0}/></radialGradient>
    <radialGradient id={`${id}-bd`} cx="0.5" cy="0.3" r="0.7"><stop offset="0" stopColor="#E6DAF0" stopOpacity={0.85}/><stop offset="0.45" stopColor="#6A5A88" stopOpacity={0.7}/><stop offset="1" stopColor="#2A1E40" stopOpacity={0.9}/></radialGradient>
  </defs>
);
// Ripple rings on the pond, foreshortened.
const Ripples: React.FC<{x: number; y: number; t: number; k?: number; scale?: number}> = ({x, y, t, k = 3, scale = 1}) => (
  <g>{Array.from({length: k}, (_, i) => { const u = t - i * 0.16; if (u <= 0 || u >= 1) return null; const rx = (6 + 110 * Math.pow(u, 0.7)) * scale;
    return <ellipse key={i} cx={x} cy={y} rx={rx} ry={rx * 0.17} fill="none" stroke="#FFE9C0" strokeWidth={1.6 * (1 - u) + 0.4} opacity={0.6 * Math.pow(1 - u, 1.4)}/>; })}</g>
);
// The young leaf that drips: a rolled lotus leaf rising from the water behind the hero leaf, arching over it, its tip
// pointing down. Dew gathers at the tip and falls onto the leaf below.
const DRIP: number[][] = [[468, 780], [470, 660], [474, 590], [482, 540], [496, 506], [518, 484], [546, 474], [572, 478], [592, 492], [604, 512]];
const dripLeaf = (f: number) => {
  const sw = Math.sin(f / 70) * 2.2;
  const pts = dense(DRIP.map(([x, y], i) => { const u = Math.pow(i / (DRIP.length - 1), 2); return [x + sw * u, y + sw * 0.3 * u]; }), 6);
  const d = band(pts, (u) => { const v = clamp01((u - 0.4) / 0.6); return u < 0.4 ? 8.5 : (8 + 18 * Math.pow(Math.max(0, Math.sin(Math.PI * Math.min(1, v * 1.08))), 0.6)) * (1 - Math.pow(v, 4)) + 1.2; });
  // the seam of the roll, a little in from the lit edge of the furled blade
  const seam = pts.filter((_, i) => i / (pts.length - 1) > 0.5 && i / (pts.length - 1) < 0.93).map((p, i, a) => { const nn = nrmAt(a, i); return [p[0] - nn[0] * 3, p[1] - nn[1] * 3]; });
  return {d, tip: pts[pts.length - 1], seam};
};
// The drops: each gathers at the young leaf's tip, falls onto the leaf, beads, runs to its lowest edge and drops off into
// the pond, leaving the leaf dry.
const Drops: React.FC<{f: number; n: number; C: number[]; rx: number; ry: number; waterY: number; id: string; droop?: number; src: number[]}> = ({f, n, C, rx, ry, waterY, id, droop = 30, src}) => {
  const P = 72, out: React.ReactNode[] = [], rip: React.ReactNode[] = [];
  const pos = (u: number, v: number) => leafPt(C, rx, ry, Math.atan2(v, u), Math.hypot(u, v), droop);
  for (let j = -3; j <= Math.ceil(n / P) + 1; j++) {
    const t0 = j * P + 4, tau = f - t0;
    if (tau < -20 || tau > 200) continue;
    const u0 = (src[0] - C[0]) / rx + (rnd(j + 50, 1) - 0.5) * 0.02, v0 = -0.22 + (rnd(j + 50, 2) - 0.5) * 0.06;
    const te = 0.05 + rnd(j + 50, 3) * 0.5, ue = Math.cos(te), ve = Math.sin(te), r = 10 + rnd(j + 50, 4) * 5;
    const L = pos(u0, v0), E = pos(ue, ve);
    if (tau < 0) {   // gathering at the tip
      const g = clamp01((tau + 20) / 20), rr = 3.5 + 3 * g;
      out.push(<Bead key={`g${j}`} x={src[0]} y={src[1] + rr * 0.9} r={rr} id={id}/>);
      continue;
    }
    if (tau < 15) {   // falling from the tip, a thin streak of light behind it
      const k = tau / 15, y = lerp(src[1] + 6, L[1] - r * 0.5, k * k), x = lerp(src[0], L[0], k);
      out.push(<g key={`f${j}`}><path d={`M ${n1(x)} ${n1(y - 8 - 30 * k)} L ${n1(x)} ${n1(y)}`} stroke="#FFF0D0" strokeWidth={1.5} opacity={0.45 * k} strokeLinecap="round"/><ellipse cx={x} cy={y} rx={3.2} ry={4.6} fill="#FFF6E0"/></g>);
      continue;
    }
    if (tau < 84) {
      const k = tau < 38 ? 0 : Math.pow((tau - 38) / 46, 1.7), u = lerp(u0, ue, k), v = lerp(v0, ve, k), p = pos(u, v);
      const grow = Math.min(1, (tau - 15) / 5), sq = tau < 25 ? 1 + 0.25 * Math.sin((tau - 15) * 0.9) * (1 - (tau - 15) / 10) : 1;
      if (tau < 27) { const s2 = (tau - 15) / 12; out.push(<ellipse key={`s${j}`} cx={L[0]} cy={L[1]} rx={4 + 26 * s2} ry={(4 + 26 * s2) * (ry / rx)} fill="none" stroke="#FFE9C0" strokeWidth={1} opacity={0.5 * (1 - s2)}/>); }
      out.push(<Bead key={`b${j}`} x={p[0]} y={p[1] - r * 0.5} r={r * grow * sq} id={id}/>);
      continue;
    }
    if (tau < 102) {   // off the edge and down
      const k = (tau - 84) / 18, x = E[0] + 10 * k, y = E[1] - r * 0.5 + (waterY - E[1]) * k * k;
      out.push(<g key={`o${j}`}><path d={`M ${x - 1} ${y - 10 - 26 * k} L ${x} ${y}`} stroke="#FFF0D0" strokeWidth={1.2} opacity={0.35 * k} strokeLinecap="round"/><Bead x={x} y={y} r={r * (1 - 0.25 * k)} id={id}/></g>);
      continue;
    }
    rip.push(<Ripples key={`r${j}`} x={E[0] + 10} y={waterY} t={(tau - 102) / 98}/>);
  }
  return <g><BeadDefs id={id}/>{rip}{out}</g>;
};
// One lotus petal from base B, leaning ang (radians from upright), length len, half-width wid, curving by bend.
const petalAxis = (B: number[], ang: number, len: number, wid: number, bend: number) => {
  const d = [Math.sin(ang), -Math.cos(ang)], nn = [Math.cos(ang), Math.sin(ang)];
  const at = (u: number) => [B[0] + d[0] * len * u + nn[0] * bend * len * u * u, B[1] + d[1] * len * u + nn[1] * bend * len * u * u];
  const hw = (u: number) => wid * (0.28 * (1 - u) + 0.82 * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.8)), 0.9));
  return {at, hw, nn};
};
const petalD = (B: number[], ang: number, len: number, wid: number, bend: number): string => {
  const {at, hw, nn} = petalAxis(B, ang, len, wid, bend), L: Pt[] = [], R: Pt[] = [], N = 9;
  for (let i = 1; i < N; i++) { const u = i / N, a = at(u), w = hw(u); L.push([a[0] - nn[0] * w, a[1] - nn[1] * w]); R.push([a[0] + nn[0] * w, a[1] + nn[1] * w]); }
  const t = at(1), tip: Pt = [t[0], t[1], "c"];
  return smooth([[B[0] - nn[0] * wid * 0.22, B[1] - nn[1] * wid * 0.22], ...L, tip, ...R.reverse(), [B[0] + nn[0] * wid * 0.22, B[1] + nn[1] * wid * 0.22]] as Pt[]);
};
// The veins of a petal: fine lines fanning from its base towards the tip, inside the petal.
const petalVeins = (B: number[], ang: number, len: number, wid: number, bend: number): string => {
  const {at, hw, nn} = petalAxis(B, ang, len, wid, bend);
  return [-0.62, -0.32, 0, 0.32, 0.62].map((v) => {
    const pts: number[][] = [];
    for (let i = 1; i <= 10; i++) { const u = 0.05 + (i / 10) * (Math.abs(v) > 0.5 ? 0.74 : 0.86), a = at(u), w = hw(u) * v * 0.82 * (1 - 0.35 * u * u); pts.push([a[0] + nn[0] * w, a[1] + nn[1] * w]); }
    return lineD(pts);
  }).join(" ");
};
// The lotus, from a closed bud (open = 0) to a full flower (open = 1), backlit: each petal is translucent at its edges,
// veined, and glows most on the side that faces the light.
const LotusFlower: React.FC<{x: number; y: number; open: number; f: number; id: string; sc?: number; lightX?: number}> = ({x, y, open, f, id, sc = 1, lightX = 1}) => {
  const whorls = [
    {n: 6, az0: 15, len: 150, wid: 40, a0: 0.13, a1: 1.15},
    {n: 6, az0: 45, len: 134, wid: 36, a0: 0.07, a1: 0.72},
    {n: 5, az0: 5, len: 108, wid: 30, a0: 0.03, a1: 0.36},
  ];
  const P: {z: number; d: string; inner: string; core: string; veins: string; face: number}[] = [];
  whorls.forEach((w, wi) => {
    for (let k = 0; k < w.n; k++) {
      const az = ((w.az0 + (k * 360) / w.n) * Math.PI) / 180, a = lerp(w.a0, w.a1, open) + 0.015 * Math.sin(f / 40 + k + wi);
      const tx = Math.sin(a) * Math.cos(az), ty = Math.cos(a) - 0.3 * Math.sin(a) * Math.sin(az), tz = Math.sin(a) * Math.sin(az);
      const ang = Math.atan2(tx, ty), pl = Math.hypot(tx, ty), wf = 0.5 + 0.5 * Math.abs(Math.sin(az));
      const B = [x + Math.cos(az) * (8 - wi * 3) * sc * open, y + Math.sin(az) * 3 * sc];
      const len = w.len * sc * Math.max(0.55, pl), wid = w.wid * sc * wf, bend = (tz < 0 ? -0.06 : 0.06) * Math.sign(tx || 1);
      P.push({z: tz + wi * 0.01, d: petalD(B, ang, len, wid, bend), inner: petalD(B, ang, len * 0.93, wid * 0.82, bend), core: petalD(B, ang, len * 0.84, wid * 0.62, bend), veins: petalVeins(B, ang, len, wid, bend),
        face: clamp01(0.3 + 0.95 * Math.sin(ang) * lightX + 0.12 * wi)});
    }
  });
  P.sort((a, b) => a.z - b.z);
  const back = P.filter((p) => p.z < 0), front = P.filter((p) => p.z >= 0);
  const podY = y - 34 * sc, pod = open > 0.3 ? clamp01((open - 0.3) / 0.4) : 0;
  const draw = (p: (typeof P)[number], i: number) => <g key={i}>
    <path d={p.d} fill={`url(#${id}-tl)`} opacity={(p.z < 0 ? 0.75 : 0.9) * (0.55 + 0.45 * p.face)}/>
    <path d={p.inner} fill={`url(#${id}-pt)`} opacity={0.42}/>
    <path d={p.core} fill={`url(#${id}-pt)`} opacity={p.z < 0 ? 0.62 : 0.72}/>
    <path d={p.d} fill={`url(#${id}-lit)`} opacity={(0.15 + 0.8 * p.face) * (0.55 + 0.45 * open)}/>
    <path d={p.veins} fill="none" stroke="#FFDCC6" strokeWidth={0.65 * sc} strokeLinecap="round" opacity={0.08 + 0.26 * p.face}/>
    <path d={p.d} fill="none" stroke={`url(#${id}-rim)`} strokeWidth={1.2 * sc}/>
  </g>;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-pt`} gradientUnits="userSpaceOnUse" x1={0} y1={y} x2={0} y2={y - 150 * sc}><stop offset="0" stopColor="#1E0E20"/><stop offset="0.45" stopColor="#4A2240"/><stop offset="0.85" stopColor="#8A4A60"/><stop offset="1" stopColor="#B87078"/></linearGradient>
        <linearGradient id={`${id}-tl`} gradientUnits="userSpaceOnUse" x1={0} y1={y} x2={0} y2={y - 150 * sc}><stop offset="0" stopColor="#5A2A44"/><stop offset="0.5" stopColor="#D88A90"/><stop offset="1" stopColor="#FFD8C0"/></linearGradient>
        <radialGradient id={`${id}-lit`} gradientUnits="userSpaceOnUse" cx={x + 90 * sc * lightX} cy={y - 120 * sc} r={200 * sc}><stop offset="0" stopColor="#FFEBCC" stopOpacity={0.95}/><stop offset="0.5" stopColor="#F4AE92" stopOpacity={0.38}/><stop offset="1" stopColor="#F2A88E" stopOpacity={0}/></radialGradient>
        <linearGradient id={`${id}-rim`} gradientUnits="userSpaceOnUse" x1={x - 40 * sc * lightX} y1={0} x2={x + 140 * sc * lightX} y2={0}><stop offset="0" stopColor="#FFE3B0" stopOpacity={0}/><stop offset="0.5" stopColor="#FFE3B0" stopOpacity={0.25}/><stop offset="1" stopColor="#FFF0D0" stopOpacity={0.95}/></linearGradient>
        <linearGradient id={`${id}-pod`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE9A8"/><stop offset="1" stopColor="#B8862F"/></linearGradient>
      </defs>
      <circle cx={x} cy={y - 70 * sc} r={(140 + 180 * open) * sc} fill="url(#k-halo)" opacity={0.5 + 0.5 * open}/>
      <SoftGlow x={x + 70 * sc * lightX} y={y - 100 * sc} r={190 * sc} ry={150 * sc} c0="#FFE6C8" c1="#F2A88E" peak={0.4 + 0.25 * open} k={2}/>
      {back.map(draw)}
      {pod > 0 ? <g opacity={pod}>
        {Array.from({length: 26}, (_, i) => { const a = -Math.PI + (i / 25) * Math.PI, L = (22 + 8 * rnd(i, 5)) * sc, x0 = x + Math.cos(a) * 12 * sc, y0 = podY + 8 * sc, x1 = x + Math.cos(a) * (12 * sc + L * 0.9), y1 = podY + 6 * sc - Math.sin(-a) * L * 0.75 - L * 0.2;
          return <g key={i}><path d={`M ${n1(x0)} ${n1(y0)} Q ${n1((x0 + x1) / 2)} ${n1(y1 + 6 * sc)} ${n1(x1)} ${n1(y1)}`} fill="none" stroke="#FFD27A" strokeWidth={1.1 * sc} opacity={0.8}/><circle cx={x1} cy={y1} r={1.8 * sc} fill="#FFE9A8"/></g>; })}
        <path d={`M ${x - 13 * sc} ${podY + 16 * sc} L ${x - 19 * sc} ${podY} L ${x + 19 * sc} ${podY} L ${x + 13 * sc} ${podY + 16 * sc} Z`} fill={`url(#${id}-pod)`}/>
        <ellipse cx={x} cy={podY} rx={19 * sc} ry={5.5 * sc} fill="#FFE9A8"/>
        {Array.from({length: 7}, (_, i) => <circle key={i} cx={x + (i - 3) * 4.6 * sc} cy={podY + ((i % 2) - 0.5) * 2 * sc} r={1.4 * sc} fill="#B8862F"/>)}
      </g> : null}
      {front.map(draw)}
    </g>
  );
};
const LotusLeafScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), id = useUid("lt");
  const mood = moodOf(s.mood, "dawn"), HOR = 530, night = mood === "night";
  const sun: [number, number] = night ? [1440, 290] : [1440, 446];
  const open = span(f, n * 0.06, n * 0.92);
  const C = [700, 690], RX = 410, RY = 84, WY = 892;
  const flower = [1262, 548], fw = 868;
  const lightL: [number, number] = [0.85, -0.55];
  const bankFar = night ? ["#2A2450", "#4A3A62"] : ["#5E5280", "#B49CB0"], bankNear = night ? "#1A1636" : "#33284C";
  const floating: number[][] = [[262, 584, 66], [540, 572, 38], [1040, 588, 52], [1520, 598, 80], [1800, 624, 112], [96, 668, 140]];
  const mist = Array.from({length: 9}, (_, i) => [((rnd(i, 140) * 2400 + f * (0.25 + 0.2 * rnd(i, 141))) % 2400) - 240, 540 + rnd(i, 142) * 150, 300 + rnd(i, 143) * 300]);
  // the far shore: reed beds the whole way along; far right, palmyra and coconut palms and a small Nagara temple
  const farShore = useMemo(() => reedBank(-60, 1980, HOR + 2, 12, 31, 52), []);
  const farTrees = useMemo(() => [
    ...palmyra({x: 1652, y: HOR + 3, h: 118, seed: 41}), ...coconut({x: 1716, y: HOR + 3, h: 128, seed: 42, lean: -0.16, detail: 0.6}),
    ...coconut({x: 1772, y: HOR + 3, h: 100, seed: 43, lean: 0.12, detail: 0.6}), ...palmyra({x: 940, y: HOR + 3, h: 84, seed: 44}),
  ], []);
  const shrine = useMemo(() => temple({x: 1030, y: HOR + 4, w: 19, porch: 1, flag: true}).filter((it) => typeof it === "string" || it.rim !== false), []);
  // the near-left bank: a banyan's broad mass, coconut palms with drooping fronds, kans grass along the water
  const nearBank = useMemo(() => [reedBank(-60, 620, HOR + 12, 14, 37, 46), ...[
    ...banyan({x: 140, y: HOR + 12, h: 150, seed: 51, detail: 0.5, back: "#3E3258"}),
    ...coconut({x: 336, y: HOR + 12, h: 236, seed: 52, lean: 0.14, detail: 0.7, back: "#3E3258"}),
    ...coconut({x: 392, y: HOR + 12, h: 190, seed: 53, lean: -0.18, detail: 0.7, back: "#3E3258"}),
  ]], []);
  const drip = dripLeaf(f);
  const sunPt: [number, number] = [sun[0], sun[1] - 100];
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.06)} cx={C[0] + 160} cy={C[1] - 60}>
      <SkyW mood={mood} hor={HOR} sun={sun} sunR={night ? 30 : 44} f={f} id={id} stars={night ? 1 : 0.15}/>
      <Clouds f={f} mood={mood as Mood} op={0.45}/>
      <defs>
        <linearGradient id={`${id}-bf`} gradientUnits="userSpaceOnUse" x1={0} y1={HOR - 130} x2={0} y2={HOR}><stop offset="0" stopColor={bankFar[0]}/><stop offset="1" stopColor={bankFar[1]}/></linearGradient>
        <linearGradient id={`${id}-mb`} gradientUnits="userSpaceOnUse" x1={0} y1={HOR - 60} x2={0} y2={HOR + 50}><stop offset="0" stopColor="#F4D9C0" stopOpacity={0}/><stop offset="0.6" stopColor={night ? "#9A8AB0" : "#F4D9C0"} stopOpacity={0.55}/><stop offset="1" stopColor="#F4D9C0" stopOpacity={0}/></linearGradient>
        <radialGradient id={`${id}-mist`}><stop offset="0" stopColor={night ? "#A89AC0" : "#F8E6D8"} stopOpacity={0.42}/><stop offset="0.6" stopColor={night ? "#A89AC0" : "#F6E2D2"} stopOpacity={0.14}/><stop offset="1" stopColor="#F6E2D2" stopOpacity={0}/></radialGradient>
        <linearGradient id={`${id}-rf`} gradientUnits="userSpaceOnUse" x1={0} y1={WY} x2={0} y2={WY + 190}><stop offset="0" stopColor="#0A0612" stopOpacity={0.55}/><stop offset="1" stopColor="#0A0612" stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}-fs`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C8B0C8" stopOpacity={0.45}/><stop offset="0.5" stopColor="#5A4870" stopOpacity={0.12}/><stop offset="1" stopColor="#2A2038" stopOpacity={0}/></linearGradient>
      </defs>
      <path d={farShore} fill={`url(#${id}-bf)`}/>
      <Rimmed paths={[...flat(farTrees), itemsD(shrine)]} fill={`url(#${id}-bf)`} point={sunPt} light={[1, 0]} w={1.2} rim="#F8D8B0"/>
      <Rimmed paths={nearBank} fill={bankNear} point={sunPt} light={[1, 0]} w={2} rim="#F2C99A"/>
      <rect x={-60} y={HOR - 60} width={W + 120} height={110} fill={`url(#${id}-mb)`}/>
      <SeaBase mood={mood} hor={HOR + 6} sun={sun} id={id} spread={170}/>
      <SeaSurface mood={mood} hor={HOR + 6} sun={sun} f={f} id={id} spread={170} glints={170} rows={26} amp={0.45} period={420} side={0.1}/>
      {/* reflections of the hero leaf, the flower stem and the right leaf */}
      <path d={lineD(Array.from({length: 60}, (_, i) => { const p = leafPt(C, RX, RY, (i / 60) * 6.283, 1); return [p[0], 2 * WY - p[1] - 30]; }), true)} fill={`url(#${id}-rf)`}/>
      <path d={ribbon([[C[0] - 22, WY], [C[0] - 14, WY + 90]], 14, 12)} fill="#0A0612" opacity={0.4}/>
      {/* floating leaves, far to near: dark discs with a skin of sky light */}
      {floating.map(([x, y, r], i) => {
        const d = (y - HOR) / (H - HOR), ry = r * (0.07 + 0.18 * d);
        const pts = Array.from({length: 60}, (_, k) => { const th = (k / 60) * 6.283, w = 1 + 0.035 * Math.sin(th * 7 + i) + 0.02 * Math.sin(th * 13 + i * 2); return [x + Math.cos(th) * r * w, y + Math.sin(th) * ry * w - Math.max(0, -Math.sin(th)) * ry * 0.15 * Math.sin(th * 9 + i)] as Pt; });
        const dd = smooth(pts);
        return <g key={i}><Rimmed paths={[dd]} fill="#1A1226" light={[0.3, -1]} w={1.2 + 1.5 * d} rim="#F6D2A8"/><path d={dd} fill={`url(#${id}-fs)`} transform={`translate(${x} ${y}) scale(0.97) translate(${-x} ${-y})`}/></g>;
      })}
      {/* a small bud far left */}
      <Rimmed paths={[ribbon([[300, 650], [296, 590], [290, 530], [284, 494]], 3.5, 2.5), petalD([284, 496], 0.08, 44, 12, 0)]} fill="#24142C" light={lightL} w={2}/>
      {/* the young rolled leaf arching over the hero leaf: the drops fall from its tip */}
      <Rimmed paths={[drip.d]} fill="#1C1228" light={lightL} w={2.4}/>
      <path d={lineD(drip.seam)} fill="none" stroke="#F6D2A8" strokeWidth={1} opacity={0.32}/>
      {/* the opening lotus on its stem */}
      <Rimmed paths={[ribbon(dense([[flower[0] + 34, fw], [flower[0] + 30, 780], [flower[0] + 12, 660], [flower[0], flower[1] + 6]], 6), 11, 8)]} fill={K.sil} light={lightL} w={2.5}/>
      <Rimmed paths={[petalD([flower[0] - 4, flower[1] + 8], -0.95, 32, 9, 0.1), petalD([flower[0] + 4, flower[1] + 8], 1.0, 32, 9, -0.1)]} fill="#24142C" light={lightL} w={1.5}/>
      <LotusFlower x={flower[0]} y={flower[1]} open={open} f={f} id={`${id}fl`} sc={1.08}/>
      {/* the second raised leaf on the right */}
      <Rimmed paths={[ribbon(dense([[1600, 902], [1594, 830], [1582, 772]], 6), 9, 8)]} fill={K.sil} light={lightL} w={2}/>
      <LotusLeaf C={[1584, 752]} rx={196} ry={42} light={[-0.2, -1]} id={`${id}l2`} veins={19} droop={12}/>
      {/* the hero leaf */}
      <Rimmed paths={[ribbon(dense([[C[0] - 22, WY], [C[0] - 14, 820], [C[0], C[1] + 50]], 6), 20, 16)]} fill={K.sil} light={lightL} w={2}/>
      <LotusLeaf C={C} rx={RX} ry={RY} light={lightL} id={`${id}l1`} droop={26}/>
      <BeadDefs id={`${id}d`}/>
      <Bead x={C[0] + 8} y={C[1] + RY * 0.1} r={22} id={`${id}d`}/>
      {[[-0.52, -0.28, 10], [-0.22, 0.4, 8], [0.3, -0.5, 9], [-0.7, 0.18, 6.5], [0.55, 0.1, 7]].map(([u, v, r], i) => { const p = leafPt(C, RX, RY, Math.atan2(v, u), Math.hypot(u, v)); return <Bead key={i} x={p[0]} y={p[1] - r * 0.4} r={r} id={`${id}d`} op={0.85 + 0.15 * Math.sin(f / 20 + i)}/>; })}
      <Drops f={f} n={n} C={C} rx={RX} ry={RY} waterY={WY + 8} id={`${id}d`} droop={26} src={drip.tip}/>
      {mist.map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.16} fill={`url(#${id}-mist)`}/>)}
      {/* kans grass at the edges, close to us */}
      <Rimmed paths={[...kans({x: 20, y: 1100, h: 500, seed: 61, wind: 0.3, t: f, detail: 0.8, plumes: 3}), ...kans({x: 120, y: 1100, h: 330, seed: 62, wind: 0.35, t: f, detail: 0.6, plumes: 2}),
        ...kans({x: 1880, y: 1100, h: 440, seed: 63, wind: -0.25, t: f, detail: 0.8, plumes: 3}), ...kans({x: 1800, y: 1100, h: 260, seed: 64, wind: -0.3, t: f, detail: 0.6, plumes: 2})]}
        fill="#0C0712" point={sunPt} light={[1, 0]} w={1.6} rim="#F2C99A"/>
      <Dust f={f} sun={sun} n={50} y0={380} y1={860} color="#FFF0D6"/>
    </Frame>
  );
};

// ---------- 3. the tortoise (2.58) ----------
// The carapace is a loft seen from the side and a little from above: s runs tail (-1) to head (+1), t runs from the near
// rim (0) over the top (pi/2). Scutes, growth rings and the serrated marginals all follow that surface, so the dome reads
// as a dome even in silhouette. Local frame: head towards +x, ground at y = 0.
const TA = 250, TB = 172, TC = 214, TE = 0.21, CE = Math.cos(TE), SE = Math.sin(TE);
const tHc = (s: number) => TC * Math.pow(Math.max(0, 1 - s * s), 0.55) * (1 - 0.1 * s);
const tBw = (s: number) => TB * Math.sqrt(Math.max(0, 1 - s * s)) * (1 - 0.04 * s);
const tRimY = (s: number) => 16 * Math.pow(Math.max(0, s), 2.5) + 7 * Math.pow(Math.max(0, -s), 3);
const shellAt = (s: number, t: number, oy: number): number[] => {
  const Y = tRimY(s) + tHc(s) * Math.sin(t), Z = tBw(s) * Math.cos(t);
  return [TA * s, oy - Y * CE + Z * SE];
};
const margIdx = (s: number) => ((s + 1) / 2) * 11.6 - 0.3;
const shellOutline = (oy: number): number[][] => {
  const top: number[][] = [], rim: number[][] = [];
  for (let i = 0; i <= 90; i++) { const s = -1 + (2 * i) / 90; top.push([TA * s, oy - tRimY(s) * CE - Math.hypot(tHc(s) * CE, tBw(s) * SE)]); }
  for (let i = 0; i <= 160; i++) {
    const s = 1 - (2 * i) / 160, m = margIdx(s), amp = 2.2 + 6 * Math.max(0, (-s - 0.45) / 0.55) + 2.5 * Math.max(0, (s - 0.72) / 0.28);
    const flare = 6 * Math.pow(Math.max(0, -s - 0.6) / 0.4, 2);
    rim.push([TA * s - flare * 0.6, oy - tRimY(s) * CE + tBw(s) * SE + amp * Math.pow(Math.abs(Math.sin(Math.PI * m)), 0.55) + flare]);
  }
  return [...top, ...rim];
};
// The scutes as domes: marginals in a narrow band at the rim; four costals of unequal size (the middle two largest)
// whose seams converge towards the spine; five vertebrals along the top meeting the costals in a zigzag. Each scute is
// an inset outline (the seams show as the dark between them) that takes a dome of warm light on the side facing the
// sun; the growth rings are faint.
const T1 = 0.2, T2 = 1.12, TT = Math.PI / 2 + 0.45;
const COST_B = [-0.56, -0.1, 0.4], COST_T = [-0.47, -0.08, 0.35], VERT = [-0.68, -0.27, 0.12, 0.52];
const shellScutes = (oy: number): {domes: {d: string; s: number; t: number; k: number}[]; rings: string} => {
  const P = (s: number, t: number) => shellAt(s, t, oy);
  const domes: {d: string; s: number; t: number; k: number}[] = [];
  const scute = (poly: number[][], inset: number, k: number) => {
    const pts: number[][] = [];
    poly.forEach((a, j) => { const b = poly[(j + 1) % poly.length], m = Math.max(2, Math.round(Math.hypot(b[0] - a[0], (b[1] - a[1]) * 1.6) * 14)); for (let i = 0; i < m; i++) { const u = i / m; pts.push(P(lerp(a[0], b[0], u), lerp(a[1], b[1], u))); } });
    const cx = pts.reduce((v, p) => v + p[0], 0) / pts.length, cy = pts.reduce((v, p) => v + p[1], 0) / pts.length;
    const cs = poly.reduce((v, p) => v + p[0], 0) / poly.length, ct = poly.reduce((v, p) => v + p[1], 0) / poly.length;
    domes.push({d: smooth(pts.map(([x, y]) => [cx + (x - cx) * inset, cy + (y - cy) * inset] as Pt)), s: cs, t: ct, k});
  };
  const sm = (m: number) => ((m + 0.3) / 11.6) * 2 - 1;
  for (let m = 0; m < 11; m++) scute([[sm(m), 0.03], [sm(m + 1), 0.03], [sm(m + 1), T1], [sm(m), T1]], 0.74, 0.3);
  const cb = [-0.93, ...COST_B, 0.86], ct = [-0.8, ...COST_T, 0.72];
  for (let j = 0; j < 4; j++) scute([[cb[j], T1], [cb[j + 1], T1], [ct[j + 1], T2 - 0.05], [VERT[j], T2 + 0.07], [ct[j], T2 - 0.05]], 0.9, 1);
  const vx = [-0.9, ...VERT, 0.9];
  for (let j = 0; j < 5; j++) scute([[vx[j], T2 + 0.07], [j > 0 && j < 4 ? COST_T[j - 1] : (vx[j] + vx[j + 1]) / 2, T2 - 0.05], [vx[j + 1], T2 + 0.07], [vx[j + 1] * 0.96, TT], [vx[j] * 0.96, TT]], 0.88, 0.9);
  // faint growth rings: two inset copies in each costal, one in each vertebral, centred high (the areola)
  const rings: string[] = [];
  let ri = 0;
  const ringsOf = (poly: number[][], c: number[], ks: number[]) => ks.forEach((q) => {
    const pts: Pt[] = [];
    poly.forEach((a, j) => { const b2 = poly[(j + 1) % poly.length]; [0, 0.5].forEach((u) => { const es = lerp(a[0], b2[0], u), et = lerp(a[1], b2[1], u); pts.push(P(c[0] + (es - c[0]) * q + (rnd(ri++, 202) - 0.5) * 0.02, c[1] + (et - c[1]) * q + (rnd(ri++, 203) - 0.5) * 0.03) as Pt); }); });
    rings.push(smooth(pts));
  });
  for (let j = 0; j < 4; j++) ringsOf([[cb[j], T1], [cb[j + 1], T1], [ct[j + 1], T2 - 0.05], [VERT[j], T2 + 0.07], [ct[j], T2 - 0.05]], [(cb[j] + cb[j + 1] + VERT[j] * 2) / 4, lerp(T1, T2, 0.64)], [0.66, 0.36]);
  for (let j = 0; j < 5; j++) ringsOf([[vx[j], T2 + 0.07], [j > 0 && j < 4 ? COST_T[j - 1] : (vx[j] + vx[j + 1]) / 2, T2 - 0.05], [vx[j + 1], T2 + 0.07], [vx[j + 1] * 0.96, TT], [vx[j] * 0.96, TT]], [(vx[j] + vx[j + 1]) / 2, T2 + 0.32], [0.55]);
  return {domes, rings: rings.join(" ")};
};
const tw = (a: (number | string)[][], b: (number | string)[][], k: number): Pt[] => a.map((p, i) => { const q = b[i]; const r: any[] = [lerp(+p[0], +q[0], k), lerp(+p[1], +q[1], k)]; if (p[2] === "c") r.push("c"); return r as Pt; });
// Limbs, extended (body raised 58) and withdrawn (resting on the plastron); the same points tween between them.
const FORE_OUT = [[126, -116], [140, -88], [146, -64], [150, -42], [152, -22], [150, -8], [160, 0, "c"], [206, 1], [238, -2, "c"], [246, -14], [240, -30], [238, -52], [234, -74], [222, -96], [204, -116]];
const FORE_IN = [[118, -64], [132, -56], [150, -46], [166, -34], [176, -20], [178, -8], [188, 0, "c"], [222, -1], [252, -6, "c"], [264, -18], [266, -34], [260, -50], [246, -62], [222, -70], [196, -74]];
const HIND_OUT = [[-128, -112], [-136, -84], [-140, -58], [-144, -32], [-142, -12], [-134, 0, "c"], [-170, 2], [-210, 0, "c"], [-220, -12], [-224, -34], [-226, -58], [-222, -84], [-206, -110]];
const HIND_IN = [[-140, -62], [-150, -50], [-162, -36], [-172, -22], [-176, -10], [-182, 0, "c"], [-206, -1], [-232, -4, "c"], [-252, -12], [-262, -26], [-260, -42], [-250, -54], [-224, -64]];
const claw = (bx: number, by: number, tx: number, ty: number, w: number): string => {
  const mx = (bx + tx) / 2, my = (by + ty) / 2, dx = tx - bx, dy = ty - by, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
  return smooth([[bx + nx * w, by + ny * w], [mx + nx * w * 0.6 - dy * 0.12, my + ny * w * 0.6 + dx * 0.12], [tx, ty, "c"], [mx - nx * w * 0.5 - dy * 0.12, my - ny * w * 0.5 + dx * 0.12], [bx - nx * w, by - ny * w]] as Pt[]);
};
// The head in its own frame (base at the origin, beak towards +x): a tapered wedge, the crown highest just behind the
// eye line, the brow sloping down to a short beaked snout with a slight hook, the jaw running back to the throat.
const HEAD: Pt[] = [[-8, -19], [6, -23], [24, -23], [42, -19], [57, -12], [69, -5], [78, 1, "c"], [76, 7], [69, 9, "c"], [55, 12], [37, 16], [18, 19], [0, 20], [-8, 19]];
// The neck: thick at the shell, tapering to the head, its loose skin hanging in folds under the throat.
const neckD = (pts: number[][], hk: number): string => {
  const top: number[][] = [], bot: number[][] = [], n = pts.length;
  pts.forEach(([x, y], i) => {
    const u = i / (n - 1), nn = nrmAt(pts, i), w = ((62 - 24 * u) * (1 - 0.35 * hk)) / 2;
    const wr = Math.abs(Math.sin(u * Math.PI * (4.5 + 5 * hk)));
    const sag = (6 * Math.sin(Math.PI * Math.min(1, u * 1.1)) + 3.4 * wr) * (1 - 0.6 * hk), crest = 1.2 * wr * (1 - hk);
    bot.push([x + nn[0] * (w + sag), y + nn[1] * (w + sag)]); top.push([x - nn[0] * (w + crest), y - nn[1] * (w + crest)]);
  });
  return lineD([...top, ...bot.reverse()], true);
};
type TortoisePose = {head: number; fore: number; hind: number; look: number; f: number};
const tortoiseParts = (p: TortoisePose) => {
  const legK = (p.fore + p.hind) / 2, lift = 58 * (1 - ss(legK)), oy = -lift - 62;
  const shell = shellOutline(oy);
  // plastron and the skin of the openings between carapace and plastron
  const rimAt = (s: number) => [TA * s, oy - tRimY(s) * CE + tBw(s) * SE];
  const plastron = smooth([rimAt(0.86) as Pt, [TA * 0.84, -lift - 16], [TA * 0.78, -lift - 2], [TA * 0.3, -lift], [-TA * 0.5, -lift], [-TA * 0.78, -lift - 3], [-TA * 0.86, -lift - 18], rimAt(-0.88) as Pt, rimAt(0) as Pt]);
  // neck and head: positions relative to the body, so they ride down with it
  const hk = ss(p.head), by = -lift;
  const nc = tw([[150, -30], [206, -32], [252, -42], [290, -56]], [[110, -40], [128, -40], [144, -41], [156, -42]], hk).map(([x, y]) => [x, y + by]);
  const neckPts = dense(nc, 8).map(([x, y], i, arr) => { const u = i / (arr.length - 1); return [x, y + 6 * Math.sin(Math.PI * u) * (1 - hk)]; });
  const neck = neckD(neckPts, hk);
  const hb = neckPts[neckPts.length - 1], ang = lerp(0.17 + 0.05 * Math.sin(p.f / 32) * (1 - hk) + p.look, 0.05, hk);
  const ca = Math.cos(ang), sa = Math.sin(ang), hs = lerp(1.12, 0.85, hk);
  const head = smooth(HEAD.map(([x, y, c]) => { const q: any[] = [hb[0] - 4 + (x * ca - y * sa) * hs, hb[1] + (x * sa + y * ca) * hs]; if (c) q.push(c); return q as Pt; }));
  const fk = ss(p.fore), kk = ss(p.hind);
  const fore = smooth(tw(FORE_OUT, FORE_IN, fk)), hind = smooth(tw(HIND_OUT, HIND_IN, kk));
  // the far legs, set back towards the middle of the body and higher (further from us), mostly behind the near ones
  const foreFar = smooth(tw(FORE_OUT, FORE_IN, fk).map(([x, y, c]) => (c ? [x - 46, y - 10, c] : [x - 46, y - 10]) as Pt));
  const hindFar = smooth(tw(HIND_OUT, HIND_IN, kk).map(([x, y, c]) => (c ? [x + 44, y - 10, c] : [x + 44, y - 10]) as Pt));
  const claws: string[] = [];
  for (let i = 0; i < 4; i++) {   // fore claws at the toes, pointing forward and down; tucked away as the limb folds
    const cl = 1 - 0.6 * fk, b0 = [lerp(230, 252, fk) + i * 3, lerp(-12, -14, fk) + i * 3], t0 = [b0[0] + (20 - i * 1.5) * cl, b0[1] + (7 - i * 0.6) * cl + 2];
    if (i < 4 - Math.round(fk * 2)) claws.push(claw(b0[0], b0[1], t0[0], Math.min(1, t0[1]), 3.2 * (1 - 0.3 * fk)));
  }
  for (let i = 0; i < 4; i++) {   // hind claws, short and blunt
    const b0 = [lerp(-146, -186, kk) + i * 2, -7 + i * 2], t0 = [lerp(-132, -176, kk) + i * 2.5, -2 + i * 0.9];
    claws.push(claw(b0[0], b0[1], t0[0], Math.min(1, t0[1]), 2.8));
  }
  const tail = smooth(tw([[-226, -16], [-262, -2], [-238, 0]], [[-220, 6], [-236, 10], [-224, 14]], kk).map(([x, y]) => [x, y + by] as Pt));
  // details: neck folds (creases across the loose skin, curving towards the head), scales on the forelimb, skin creases
  // on the hind leg
  const folds: string[] = [];
  for (let k = 1; k <= 6; k++) {
    const u = 0.1 + (k / 7) * 0.82 + (rnd(k, 230) - 0.5) * 0.05, i = Math.round(u * (neckPts.length - 1)), c = neckPts[i], nn = nrmAt(neckPts, i), w = ((62 - 24 * u) * (1 - 0.35 * hk)) / 2;
    const a0 = k % 2 ? -0.85 : -0.45, a1 = k % 2 ? 0.75 : 1.05, bow = 6 + 3 * (k % 3);
    const A = [c[0] + nn[0] * w * a0, c[1] + nn[1] * w * a0], B2 = [c[0] + nn[0] * w * a1, c[1] + nn[1] * w * a1], M = [(A[0] + B2[0]) / 2 + bow, (A[1] + B2[1]) / 2];
    folds.push(`M ${n1(A[0])} ${n1(A[1])} Q ${n1(M[0])} ${n1(M[1])} ${n1(B2[0])} ${n1(B2[1])}`);
  }
  const fo = tw(FORE_OUT, FORE_IN, fk);
  const scales: string[] = [];
  for (let k = 0; k < 4; k++) { const a = fo[12], b = fo[9], u = (k + 0.5) / 4, x = lerp(+a[0], +b[0], u) - 12, y = lerp(+a[1], +b[1], u), r = 10;
    scales.push(`M ${n1(x - r * 0.3)} ${n1(y - r)} Q ${n1(x + r * 0.9)} ${n1(y)} ${n1(x - r * 0.3)} ${n1(y + r)}`); }
  const ho = tw(HIND_OUT, HIND_IN, kk);
  for (let k = 0; k < 4; k++) { const u = 0.25 + k * 0.18, x = lerp(+ho[2][0], +ho[10][0], 0.5), y = lerp(+ho[1][1], +ho[4][1], u);
    scales.push(`M ${n1(x - 20)} ${n1(y)} Q ${n1(x)} ${n1(y + 4)} ${n1(x + 18)} ${n1(y - 1)}`); }
  return {lift, oy, shellD: lineD(shell, true), plastron, neck, head, fore, hind, foreFar, hindFar, claws, tail, folds: folds.join(" "), scales: scales.join(" ")};
};
const Tortoise: React.FC<{x: number; y: number; sc: number; pose: TortoisePose; light: [number, number]; id: string; glow?: number}> = ({x, y, sc, pose, light, id, glow = 1}) => {
  const T = tortoiseParts(pose);
  const det = useMemo(() => shellScutes(T.oy), [Math.round(T.oy * 4)]);
  const top = T.oy - TC - 30;
  // the scutes nearer the light (the head side, +s) and higher on the dome catch more of it
  const lightOf = (d: {s: number; t: number; k: number}) => d.k * (0.18 + 0.82 * Math.pow(clamp01((d.s + 1.05) / 2), 1.4)) * (0.55 + 0.45 * clamp01(d.t / 1.4));
  return (
    <g transform={`translate(${x} ${y}) scale(${-sc} ${sc})`}>
      <defs>
        <clipPath id={`${id}-sh`}><path d={T.shellD}/></clipPath>
        <clipPath id={`${id}-out`}><path d={`M -600 -600 L 600 -600 L 600 200 L -600 200 Z ${T.shellD}`} clipRule="evenodd"/></clipPath>
        <linearGradient id={`${id}-dl`} gradientUnits="userSpaceOnUse" x1={TA} y1={top} x2={-TA * 0.6} y2={0}><stop offset="0" stopColor="#FFE2A8" stopOpacity={0.75}/><stop offset="0.5" stopColor="#E9B57A" stopOpacity={0.32}/><stop offset="1" stopColor="#B8862F" stopOpacity={0.1}/></linearGradient>
        <radialGradient id={`${id}-sn`} gradientUnits="userSpaceOnUse" cx={TA * 0.55} cy={top + 40} r={260}><stop offset="0" stopColor="#FFD9A0" stopOpacity={0.22}/><stop offset="0.5" stopColor="#E9A070" stopOpacity={0.06}/><stop offset="1" stopColor="#E9A070" stopOpacity={0}/></radialGradient>
        {/* a dome of light on each scute, on its upper side towards the sun (local +x is screen left, where the sun is) */}
        <radialGradient id={`${id}-dm`} cx="0.66" cy="0.3" r="0.78" fx="0.72" fy="0.22">
          <stop offset="0" stopColor="#FFCE96" stopOpacity={0.72}/><stop offset="0.28" stopColor="#E09A6A" stopOpacity={0.36}/><stop offset="0.65" stopColor="#7A3E4A" stopOpacity={0.1}/><stop offset="1" stopColor="#2A1428" stopOpacity={0}/>
        </radialGradient>
      </defs>
      {/* the far legs: in the body's shadow, darker than the near ones and mostly hidden behind them */}
      <path d={`${T.foreFar} ${T.hindFar}`} fill="#0A0510"/>
      <Rimmed paths={[T.plastron, T.tail, T.hind, T.neck, T.head, T.fore, ...T.claws, T.shellD]} fill={K.sil} light={light} w={3.2}/>
      <g clipPath={`url(#${id}-sh)`}>
        <path d={T.shellD} fill={`url(#${id}-sn)`} opacity={glow}/>
        {det.domes.map((d, i) => <path key={i} d={d.d} fill={`url(#${id}-dm)`} opacity={lightOf(d) * glow}/>)}
        <path d={det.rings} fill="none" stroke={`url(#${id}-dl)`} strokeWidth={0.8} opacity={0.16}/>
      </g>
      <g clipPath={`url(#${id}-out)`} fill="none" stroke={`url(#${id}-dl)`} strokeLinecap="round">
        <path d={T.folds} strokeWidth={1.2} opacity={0.6 * Math.pow(1 - ss(pose.head), 1.5)}/>
        <path d={T.scales} strokeWidth={1.1} opacity={0.6}/>
      </g>
    </g>
  );
};
const TortoiseScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), id = useUid("tt");
  const mood = moodOf(s.mood, "dusk"), HOR = 600, night = mood === "night";
  const sun: [number, number] = [700, (night ? 330 : 536) + 22 * (f / Math.max(1, n))];
  const pose: TortoisePose = {head: span(f, n * 0.12, n * 0.46), fore: span(f, n * 0.3, n * 0.62), hind: span(f, n * 0.36, n * 0.68), look: Math.sin(Math.min(1, f / (n * 0.12)) * Math.PI) * -0.06, f};
  const TX = 1070, TY = 858;
  const bank = night ? ["#221E44", "#3A2A50"] : ["#3E2448", "#7A4258"];
  const pebbles = Array.from({length: 16}, (_, i) => [lerp(-20, 1940, rnd(i, 160)), 830 + Math.pow(rnd(i, 161), 1.2) * 220, 4 + rnd(i, 162) * 8]).filter(([x, y]) => Math.abs(x - TX) > 300 || y > 900);
  // the far bank: reed beds along the water; palmyras and a banyan to the right, coconut palms to the left
  const farShore = useMemo(() => reedBank(-60, 1980, HOR + 2, 10, 51, 50), []);
  const farTrees = useMemo(() => [
    ...palmyra({x: 1384, y: HOR + 3, h: 150, seed: 71}), ...palmyra({x: 1436, y: HOR + 3, h: 124, seed: 72}),
    ...banyan({x: 1640, y: HOR + 3, h: 84, seed: 73, detail: 0.5}),
    ...coconut({x: 236, y: HOR + 3, h: 140, seed: 74, lean: 0.14, detail: 0.6}), ...coconut({x: 196, y: HOR + 3, h: 108, seed: 75, lean: -0.12, detail: 0.6}),
    ...banyan({x: 60, y: HOR + 3, h: 66, seed: 76, detail: 0.5}),
  ], []);
  const sunPt: [number, number] = [sun[0], sun[1] - 80];
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.07)} cx={TX - 80} cy={TY - 120}>
      <SkyW mood={mood} hor={HOR} sun={sun} sunR={night ? 30 : 52} f={f} id={id} stars={night ? 1 : 0.45}/>
      <Clouds f={f} mood={mood as Mood} op={0.55}/>
      <Flock f={f} light={[0, -1]} kind="stork" count={3} y={250} scale={0.26} seed={2}/>
      <defs>
        <linearGradient id={`${id}-bk`} gradientUnits="userSpaceOnUse" x1={0} y1={HOR - 150} x2={0} y2={HOR}><stop offset="0" stopColor={bank[0]}/><stop offset="1" stopColor={bank[1]}/></linearGradient>
        <linearGradient id={`${id}-sand`} gradientUnits="userSpaceOnUse" x1={0} y1={780} x2={0} y2={H}><stop offset="0" stopColor="#4A2A3C"/><stop offset="0.25" stopColor="#2A1828"/><stop offset="1" stopColor="#0E0812"/></linearGradient>
        <radialGradient id={`${id}-sg`} gradientUnits="userSpaceOnUse" cx={sun[0]} cy={800} r={1} gradientTransform={`translate(${sun[0]} 800) scale(760 150) translate(${-sun[0]} -800)`}><stop offset="0" stopColor="#F2A860" stopOpacity={0.4}/><stop offset="0.5" stopColor="#C2553A" stopOpacity={0.12}/><stop offset="1" stopColor="#C2553A" stopOpacity={0}/></radialGradient>
        <radialGradient id={`${id}-shadow`}><stop offset="0" stopColor="#05030A" stopOpacity={0.7}/><stop offset="1" stopColor="#05030A" stopOpacity={0}/></radialGradient>
        <linearGradient id={`${id}-hz`} gradientUnits="userSpaceOnUse" x1={0} y1={HOR - 50} x2={0} y2={HOR + 30}><stop offset="0" stopColor="#F0A06A" stopOpacity={0}/><stop offset="0.65" stopColor="#F0A06A" stopOpacity={0.4}/><stop offset="1" stopColor="#F0A06A" stopOpacity={0}/></linearGradient>
      </defs>
      {/* the far bank */}
      <path d={farShore} fill={`url(#${id}-bk)`}/>
      <Rimmed paths={flat(farTrees)} fill={`url(#${id}-bk)`} point={sunPt} light={[-1, 0]} w={1.3} rim="#F6BC86"/>
      <rect x={-60} y={HOR - 50} width={W + 120} height={80} fill={`url(#${id}-hz)`}/>
      {/* the river */}
      <SeaBase mood={mood} hor={HOR + 4} sun={sun} id={id} spread={150}/>
      <SeaSurface mood={mood} hor={HOR + 4} sun={sun} f={f} id={id} spread={150} glints={220} rows={22} amp={0.5} period={380} side={0.14}/>
      {/* the sandbank */}
      <Rimmed paths={[smooth([[-80, 812], [200, 798], [520, 786], [860, 778], [1180, 782], [1500, 794], [1760, 790], [2000, 798], [2000, 1120, "c"], [-80, 1120, "c"]])]} fill={`url(#${id}-sand)`} light={[0, -1]} w={2.5} rim="#F6C88E"/>
      <rect x={-80} y={770} width={W + 160} height={300} fill={`url(#${id}-sg)`}/>
      {Array.from({length: 9}, (_, i) => { const y = 830 + i * i * 3.2 + i * 14, x0 = lerp(-40, 200, rnd(i, 170)), x1 = lerp(1500, 1980, rnd(i, 171));
        return <path key={i} d={`M ${x0} ${y} Q ${(x0 + x1) / 2} ${y - 10 - i} ${x1} ${y + 4}`} fill="none" stroke="#FFD9A0" strokeWidth={1} opacity={0.07 + 0.02 * (8 - i) / 8}/>; })}
      <ellipse cx={TX - 10} cy={TY + 4} rx={330} ry={26} fill={`url(#${id}-shadow)`}/>
      {pebbles.map(([x, y, r], i) => <g key={i}>
        <path d={smooth(Array.from({length: 8}, (_, k) => { const a = (k / 8) * 6.283; return [x + Math.cos(a) * r * (1 + 0.15 * rnd(i * 8 + k, 163)), y + Math.sin(a) * r * (a > 3.14 ? 0.7 : 0.3) * (1 + 0.15 * rnd(i * 8 + k, 164))] as Pt; }))} fill="#120A16"/>
        <path d={`M ${n1(x - r * 0.8)} ${n1(y - r * 0.3)} Q ${n1(x - r * 0.2)} ${n1(y - r * 0.85)} ${n1(x + r * 0.5)} ${n1(y - r * 0.55)}`} fill="none" stroke="#F6C88E" strokeWidth={1} opacity={0.45}/>
      </g>)}
      {/* driftwood and kans grass at the edges */}
      <Rimmed paths={[band(dense([[1560, 930], [1660, 912], [1780, 906], [1900, 914], [1990, 908]], 6), (u) => 26 - 10 * u), band([[1690, 912], [1720, 880], [1736, 850]], (u) => 10 - 7 * u), band([[1820, 908], [1860, 884], [1880, 870]], (u) => 8 - 6 * u)]} fill="#120A16" light={[-0.6, -1]} w={2.2}/>
      <Rimmed paths={[...kans({x: 60, y: 1100, h: 330, seed: 81, wind: 0.3, t: f, detail: 0.8, plumes: 3}), ...kans({x: 170, y: 1100, h: 220, seed: 82, wind: 0.35, t: f, detail: 0.6, plumes: 2}),
        ...kans({x: 1820, y: 1100, h: 250, seed: 83, wind: -0.2, t: f, detail: 0.7, plumes: 2})]} fill="#0C0712" point={sunPt} light={[-1, 0]} w={1.6} rim="#F2B784"/>
      <Tortoise x={TX} y={TY} sc={1} pose={pose} light={[0.9, -0.55]} id={`${id}t`} glow={0.8 + 0.2 * Math.sin(f / 40)}/>
      <Dust f={f} sun={sun} n={60} y0={420} y1={900}/>
    </Frame>
  );
};

export const SCENES: Record<string, React.FC<SceneP>> = {ocean: Ocean, "lotus-leaf": LotusLeafScene, tortoise: TortoiseScene};
