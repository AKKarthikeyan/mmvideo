// Katha metaphor scenes: water (21 Oct 2026). The ocean that stays unmoved though rivers pour into it (2.70) and, as a
// variant, the rivers and moths rushing into fire (11.28-29); the lotus leaf that water never wets (5.10); the tortoise
// drawing in its limbs (2.58). Lamplight look: near-black silhouettes, a thin warm rim on the side facing the light,
// light the only colour. Soft light, mist and glow are gradients, never blur filters.
// Props: s.mood "gold" | "dusk" | "dawn" | "night" (defaults: ocean gold, lotus-leaf dawn, tortoise dusk); s.variant "fire" on
// ocean turns the sea into a wall of fire-light that moths stream into. Every scene renders from {type, kind} alone.
import React, {useId, useMemo} from "react";
import {useCurrentFrame} from "remotion";
import {K, W, H} from "../look";
import {SceneP, Frame, push, Flock} from "../stage";
import {Clouds, Dust} from "../sky";
import {smooth, ribbon, rnd, lerp, clamp01, nrmAt, Pt} from "../geom";
import {Rimmed} from "../sil";

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

// ---------- palettes (sky above the horizon only; the sea mirrors it) ----------
type Mood = "gold" | "dusk" | "dawn" | "night";
const moodOf = (m: any, d: Mood): Mood => (m === "gold" || m === "dusk" || m === "dawn" || m === "night" ? m : d);
const SKY: Record<string, [number, string][]> = {
  gold: [[0, "#22163A"], [0.3, "#47294F"], [0.55, "#8C4650"], [0.74, "#D8824C"], [0.88, "#F8BE72"], [1, "#FFE4B0"]],
  dusk: [[0, "#100D26"], [0.35, "#2A2050"], [0.6, "#632E55"], [0.78, "#B9523E"], [0.9, "#EE9C4C"], [1, "#FFD07A"]],
  dawn: [[0, "#141B37"], [0.35, "#2D3B6B"], [0.6, "#776690"], [0.78, "#D9927E"], [0.9, "#F4C390"], [1, "#FFE5BA"]],
  night: [[0, "#04050D"], [0.5, "#0B1029"], [0.82, "#17214B"], [1, "#2E3A6A"]],
  fire: [[0, "#06030A"], [0.4, "#170A1C"], [0.66, "#3A1224"], [0.86, "#6E2026"], [1, "#A63A2C"]],
};
const SEA: Record<string, [number, string][]> = {
  gold: [[0, "#E9A464"], [0.04, "#B9694C"], [0.16, "#723A50"], [0.42, "#331E3E"], [1, "#0F0A1A"]],
  dusk: [[0, "#E39352"], [0.04, "#A55444"], [0.16, "#55294B"], [0.42, "#251940"], [1, "#0B0816"]],
  dawn: [[0, "#F2D2A6"], [0.05, "#CF9C8C"], [0.18, "#7A6890"], [0.45, "#34406C"], [1, "#11162F"]],
  night: [[0, "#3A4677"], [0.08, "#26315E"], [0.35, "#121A3A"], [1, "#05060F"]],
  fire: [[0, "#FFB060"], [0.04, "#C5512E"], [0.16, "#6A1E26"], [0.42, "#2A0F1E"], [1, "#0B060E"]],
};
const SUNC: Record<string, [string, string, string]> = {
  gold: ["#FFFBEA", "#FFE08A", "#F5A945"], dusk: ["#FFF6D8", "#FFC86A", "#F59A45"], dawn: ["#FFF8E4", "#FFD9A0", "#F2A47A"],
  night: ["#F4F1E6", "#C9CFE6", "#6B78A8"], fire: ["#FFF3D0", "#FFB45A", "#E0602E"],
};
const GLINT: Record<string, string> = {gold: "#FFF0C8", dusk: "#FFE6B0", dawn: "#FFF4DC", night: "#E8ECFF", fire: "#FFD08A"};

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
      <circle cx={sun[0]} cy={sun[1]} r={sunR * 7.5} fill={`url(#${id}-sun)`} opacity={glow}/>
      {disc ? <circle cx={sun[0]} cy={sun[1]} r={sunR * 1.1} fill={`url(#${id}-core)`}/> : null}
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
// path, and the glitter of the path itself.
const SeaSurface: React.FC<{mood: string; hor: number; sun: [number, number]; f: number; id: string; spread?: number; glints?: number; rows?: number; amp?: number; period?: number; side?: number}> =
  ({mood, hor, sun, f, id, spread = 260, glints = 340, rows = 30, amp = 1, period = 300, side = 0.22}) => {
  const [, c1] = SUNC[mood] || SUNC.gold, gc = GLINT[mood] || GLINT.gold, depth = H + 40 - hor;
  const sx = sun[0] / W;
  const out: React.ReactNode[] = [];
  for (let k = 0; k < rows; k++) {
    const u = ((((k + f / period) % rows) + rows) % rows) / rows, d = Math.pow(u, 2.05), y = hor + 2 + depth * d;
    const a = (0.4 + 6 * d) * amp, lam = 160 + 700 * d, ph = k * 1.7 + f * 0.01, fade = Math.min(1, u * 8) * Math.min(1, (1 - u) * 6);
    const Y = (x: number) => y + a * Math.sin((x / lam) * 6.283 + ph);
    // a soft dark trough under each crest gives the swell its body
    const tr: number[][] = []; for (let x = -80; x <= W + 80; x += lam / 8) tr.push([x, Y(x) + 4 + 12 * d]);
    out.push(<path key={`t${k}`} d={lineD(tr)} fill="none" stroke="#07040E" strokeWidth={3 + 16 * d} opacity={0.13 * fade}/>);
    let x = -80 + rnd(k, 31) * 120, j = 0;
    while (x < W + 80 && j < 60) {
      const len = (16 + 300 * d) * (0.35 + rnd(k * 61 + j, 32)), gap = (8 + 140 * d) * (0.3 + 1.3 * rnd(k * 61 + j, 33));
      const xm = x + len / 2, near = Math.exp(-Math.pow((xm - sun[0]) / (spread * (0.5 + 1.6 * d) + 60), 2));
      const op = fade * (side * (0.4 + 0.6 * rnd(k * 61 + j, 34)) + 0.75 * near);
      if (op > 0.02) {
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

// ---------- land ----------
const vnoise = (x: number, seed: number) => { const i = Math.floor(x), u = x - i, s = u * u * (3 - 2 * u); return lerp(rnd(i, seed), rnd(i + 1, seed), s) * 2 - 1; };
const fbm = (x: number, seed: number, oct = 4) => { let a = 1, fr = 1, sum = 0, nn = 0; for (let o = 0; o < oct; o++) { sum += a * vnoise(x * fr, seed + o * 13); nn += a; a *= 0.5; fr *= 2.07; } return sum / nn; };
// A ridge crest through key points, roughened by noise, with small trees standing on its gentler stretches.
const crestPts = (keys: number[][], rough: number, scale: number, seed: number, trees = 0, tr: [number, number] = [4, 8]): number[][] => {
  const d = dense(keys, 24), cum = cumLen(d), L = cum[cum.length - 1], N = Math.max(8, Math.round(L / 3));
  const pts = Array.from({length: N + 1}, (_, i) => { const p = atLen(d, cum, (L * i) / N), e = Math.min(1, i / 6, (N - i) / 6); return [p[0], p[1] + e * rough * fbm((L * i) / N / scale, seed)]; });
  if (trees > 0) {
    let s = rnd(seed, 91) * 40;
    for (let t = 0; s < L - 20 && t < 400; t++) {
      const i = Math.round((s / L) * N), a = pts[Math.max(0, i - 3)], b = pts[Math.min(N, i + 3)];
      const slope = Math.abs((b[1] - a[1]) / Math.max(1, Math.abs(b[0] - a[0])));
      const r = lerp(tr[0], tr[1], rnd(t, seed + 92)), stem = r * (0.15 + 0.5 * rnd(t, seed + 93));
      if (slope < 0.6 && vnoise(pts[i][0] / 140, seed + 96) > 0.1 && rnd(t, seed + 94) < trees) {
        const base = pts[i][1], cx = pts[i][0];
        for (let j = Math.max(0, i - 12); j <= Math.min(N, i + 12); j++) {
          const dx = pts[j][0] - cx; if (Math.abs(dx) < r) pts[j][1] = Math.min(pts[j][1], base - stem - Math.sqrt(r * r - dx * dx) * 0.95 + Math.abs(dx) * 0.15);
        }
      }
      s += r * (0.5 + rnd(t, seed + 95) * (vnoise(pts[i][0] / 140, seed + 96) > 0.1 ? 0.9 : 3));
    }
  }
  return pts;
};
type Ridge = {keys: number[][]; shore: number[][]; rough: number; scale: number; seed: number; trees?: number; tr?: [number, number]};
const ridgeGeo = (r: Ridge) => { const c = crestPts(r.keys, r.rough, r.scale, r.seed, r.trees || 0, r.tr); const sh = dense(r.shore, 8).map(([x, y], i) => [x, y + 1.5 * fbm(x / 30, r.seed + 7)]); return {crest: c, shore: sh, d: lineD([...c, ...sh], true)}; };

// ---------- rivers ----------
type RiverDef = {pts: number[][]; w0: number; w1: number; seed: number; broken?: number};
// A river of light: a tapering ribbon with a faint sheen around it and flecks that run downstream; a fan of light where
// it meets the sea.
const River: React.FC<{r: RiverDef; f: number; id: string; fire?: boolean; mouth?: boolean}> = ({r, f, id, fire = false, mouth = true}) => {
  const pts = useMemo(() => dense(r.pts, 12), [r]), cum = useMemo(() => cumLen(pts), [pts]), L = cum[cum.length - 1];
  // a mountain stream shows only in stretches; the rest runs hidden in the folds of the slope
  const runs = useMemo(() => {
    if (!r.broken) return [[0, L]];
    const out: number[][] = []; let a = -1;
    for (let x = 0; x <= L; x += 3) { const vis = vnoise(x / 46, r.seed + 50) > -r.broken || x > L - 40; if (vis && a < 0) a = x; if (!vis && a >= 0) { if (x - a > 8) out.push([a, x]); a = -1; } }
    if (a >= 0) out.push([a, L]);
    return out;
  }, [r, L]);
  const seg = (w0: number, w1: number) => runs.map(([a, b]) => ribbon(subLen(pts, cum, a, b, Math.max(2, Math.round((b - a) / 5))), lerp(w0, w1, a / L), lerp(w0, w1, b / L))).join(" ");
  const y0 = pts[0][1], y1 = pts[pts.length - 1][1], end = pts[pts.length - 1];
  const step = fire ? 22 : 34, cnt = Math.floor(L / step), sp = fire ? 4.5 : 1.0;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-rv`} gradientUnits="userSpaceOnUse" x1={0} y1={y0} x2={0} y2={y1}>
          {fire ? <><stop offset="0" stopColor="#B4483A"/><stop offset="0.6" stopColor="#F08A48"/><stop offset="1" stopColor="#FFD58E"/></>
            : <><stop offset="0" stopColor="#B7B0D8"/><stop offset="0.55" stopColor="#E2D8EA"/><stop offset="1" stopColor="#FFE6B4"/></>}
        </linearGradient>
        <radialGradient id={`${id}-mo`}><stop offset="0" stopColor={fire ? "#FFC070" : "#FFF0D0"} stopOpacity={0.6}/><stop offset="0.4" stopColor={fire ? "#F08A48" : "#E8C9A8"} stopOpacity={0.2}/><stop offset="1" stopColor="#E8C9A8" stopOpacity={0}/></radialGradient>
      </defs>
      <path d={seg(r.w0 * 3 + 2, r.w1 * 2.6 + 4)} fill={fire ? "#F07A40" : "#CFC6EA"} opacity={0.08}/>
      <path d={seg(r.w0, r.w1)} fill={`url(#${id}-rv)`} opacity={0.9}/>
      {Array.from({length: cnt}, (_, k) => {
        const s = ((k * step + f * sp * (0.85 + 0.3 * rnd(k, r.seed)) + rnd(k, r.seed + 1) * step) % L + L) % L;
        if (r.broken && !runs.some(([a, b]) => s >= a && s <= b)) return null;
        const len = (fire ? 14 : 9) + rnd(k, r.seed + 2) * 12, s1 = Math.min(L, s + len), wl = lerp(r.w0, r.w1, s / L);
        const fade = Math.min(1, (L - s) / 30) * Math.min(1, s / 20);
        return <path key={k} d={ribbon(subLen(pts, cum, s, s1, 4), wl * 0.15, wl * 0.6)} fill={fire ? "#FFE7B0" : "#FFFFFF"} opacity={(fire ? 0.9 : 0.55) * fade}/>;
      })}
      {mouth ? <ellipse cx={end[0]} cy={end[1] + 2} rx={r.w1 * 9} ry={r.w1 * 1.4} fill={`url(#${id}-mo)`}/> : null}
    </g>
  );
};
// A waterfall from a cliff lip to the sea: falling streaks of light and a breath of mist at its foot.
const Fall: React.FC<{x0: number; y0: number; x1: number; y1: number; w: number; f: number; id: string; fire?: boolean}> = ({x0, y0, x1, y1, w, f, id, fire = false}) => {
  const hgt = y1 - y0;
  const P = (u: number, o: number) => [lerp(x0, x1, u * u) + o * w * (1 + u * 0.7), y0 + hgt * u];
  const band = (o0: number, o1: number) => { const L: number[][] = [], R: number[][] = []; for (let i = 0; i <= 10; i++) { L.push(P(i / 10, o0)); R.push(P(i / 10, o1)); } return lineD([...L, ...R.reverse()], true); };
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-fl`} gradientUnits="userSpaceOnUse" x1={0} y1={y0} x2={0} y2={y1}><stop offset="0" stopColor={fire ? "#F08A48" : "#E4DCF0"} stopOpacity={0.95}/><stop offset="1" stopColor={fire ? "#FFD58E" : "#FFF1D6"} stopOpacity={0.8}/></linearGradient>
        <radialGradient id={`${id}-mist`}><stop offset="0" stopColor={fire ? "#FFC070" : "#FFF4E0"} stopOpacity={0.55}/><stop offset="0.45" stopColor={fire ? "#F08A48" : "#E6D4DC"} stopOpacity={0.18}/><stop offset="1" stopColor="#E6D4DC" stopOpacity={0}/></radialGradient>
      </defs>
      <path d={band(-1.8, 1.8)} fill={fire ? "#F07A40" : "#D6CCEA"} opacity={0.1}/>
      <path d={band(-0.5, 0.5)} fill={`url(#${id}-fl)`}/>
      {Array.from({length: 12}, (_, k) => {
        const u0 = ((k / 12 + f * (fire ? 0.03 : 0.011) * (0.8 + 0.4 * rnd(k, 3))) % 1), u1 = Math.min(1, u0 + 0.1 + rnd(k, 4) * 0.1), xo = (rnd(k, 5) - 0.5) * 0.7;
        return <path key={k} d={ribbon([P(u0, xo), P((u0 + u1) / 2, xo), P(u1, xo)], 0.5, 2)} fill="#FFFFFF" opacity={0.55 * Math.min(1, (1 - u0) * 4)}/>;
      })}
      <ellipse cx={x1} cy={y1 - 3} rx={w * 8 * (1 + 0.06 * Math.sin(f / 23))} ry={w * 2.6} fill={`url(#${id}-mist)`}/>
    </g>
  );
};

// ---------- the wall of fire (11.28-29) ----------
const tongue = (x: number, y: number, h: number, w: number, lean: number, ph: number): string => {
  const N = 9, L: Pt[] = [], R: Pt[] = [];
  for (let i = 0; i < N; i++) {
    const u = i / N, hw = w * Math.pow(1 - u, 1.1) * (1 + 0.22 * Math.sin(u * 6 + ph));
    const cx = x + lean * h * u * u + Math.sin(ph * 1.3 - u * 4.2) * w * 0.7 * u;
    L.push([cx - hw, y - h * u]); R.push([cx + hw, y - h * u]);
  }
  const tip: Pt = [x + lean * h + Math.sin(ph * 1.3 - 4.2) * w * 0.7, y - h, "c"];
  return smooth([[x, y + 4], ...R, tip, ...L.reverse()] as Pt[]);
};
// A horizon ablaze: a towering curtain of fire-light, three ranks of tongues and a white-hot seam where it meets the sea.
const FireWall: React.FC<{f: number; hor: number; x0: number; x1: number; hmax: number; id: string; k?: number}> = ({f, hor, x0, x1, hmax, id, k = 1}) => {
  const mid = (x0 + x1) / 2, env = (x: number) => { const u = (x - mid) / ((x1 - x0) * 0.36); return 0.34 + 0.66 * Math.exp(-u * u); };
  const layers: [number, number, number, string, number, number][] = [   // count, height, half-width, gradient, opacity, speed
    [16, 1.55, 90, "v", 0.22, 0.5], [26, 1.0, 58, "b", 0.5, 0.8], [36, 0.68, 40, "m", 0.62, 1.1], [48, 0.38, 26, "c", 0.8, 1.5],
  ];
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-v`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#F08A48" stopOpacity={0.7}/><stop offset="0.5" stopColor="#B4483A" stopOpacity={0.3}/><stop offset="1" stopColor="#6E2026" stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}-b`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#FF9A4A" stopOpacity={0.9}/><stop offset="0.45" stopColor="#C2553A" stopOpacity={0.55}/><stop offset="1" stopColor="#8E2A3A" stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}-m`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#FFD27A" stopOpacity={0.95}/><stop offset="0.5" stopColor="#F0A04B" stopOpacity={0.6}/><stop offset="1" stopColor="#C2553A" stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}-c`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#FFF6DA"/><stop offset="0.4" stopColor="#FFE3A3" stopOpacity={0.8}/><stop offset="1" stopColor="#F0A04B" stopOpacity={0}/></linearGradient>
        <radialGradient id={`${id}-gl`}><stop offset="0" stopColor="#FFD58E" stopOpacity={0.8}/><stop offset="0.25" stopColor="#F08A48" stopOpacity={0.45}/><stop offset="0.6" stopColor="#B4483A" stopOpacity={0.16}/><stop offset="1" stopColor="#8E2A3A" stopOpacity={0}/></radialGradient>
        <linearGradient id={`${id}-base`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE9B8" stopOpacity={0}/><stop offset="0.65" stopColor="#FFF4DA" stopOpacity={0.95}/><stop offset="1" stopColor="#FFE3A3" stopOpacity={0.5}/></linearGradient>
      </defs>
      <ellipse cx={mid} cy={hor} rx={(x1 - x0) * 0.6} ry={hmax * 2.1} fill={`url(#${id}-gl)`} opacity={k}/>
      {layers.map(([cnt, hk, wk, g, op, sp], li) => (
        <g key={li} opacity={k}>{Array.from({length: cnt}, (_, i) => {
          const x = x0 + ((i + 0.5 + (rnd(i, cnt) - 0.5) * 0.7) * (x1 - x0)) / cnt;
          const life = (((f * 0.01 * sp + rnd(i, cnt + 3)) % 1) + 1) % 1;
          const hh = hmax * hk * env(x) * (0.5 + 0.5 * Math.sin(Math.PI * life)) * (0.75 + 0.5 * rnd(i, li + 9));
          const lean = Math.sin(f / 37 + i * 1.3) * 0.08, ph = (f / 10) * sp + i * 2.1, ww = wk * (0.7 + 0.6 * rnd(i, li + 7));
          return <g key={i}>
            <path d={tongue(x, hor + 4, hh, ww, lean, ph)} fill={`url(#${id}-${g})`} opacity={op * 0.5}/>
            <path d={tongue(x, hor + 4, hh * 0.8, ww * 0.55, lean, ph)} fill={`url(#${id}-${g})`} opacity={op}/>
          </g>;
        })}</g>
      ))}
      <rect x={x0 - 140} y={hor - 34} width={x1 - x0 + 280} height={40} fill={`url(#${id}-base)`} opacity={k}/>
    </g>
  );
};
// Moths streaming into the fire along a few curving flight lines: dark wings rimmed by the blaze, a short spark of a
// trail, and a flare where each one meets the light.
const STREAMS: number[][][] = [
  [[-160, 120], [340, 220], [780, 500]], [[-160, 560], [320, 500], [820, 540]], [[60, 1200], [420, 800], [880, 550]], [[620, 1220], [760, 820], [930, 556]],
  [[1360, 1220], [1200, 820], [1010, 556]], [[1880, 1200], [1500, 800], [1060, 550]], [[2080, 560], [1620, 500], [1120, 540]], [[2080, 120], [1580, 230], [1160, 500]],
];
const Moths: React.FC<{f: number; id: string; per?: number}> = ({f, id, per = 15}) => {
  const out: React.ReactNode[] = [];
  STREAMS.forEach(([S, C, T], si) => {
    const B = (t: number) => { const u = 1 - t; return [u * u * S[0] + 2 * u * t * C[0] + t * t * T[0], u * u * S[1] + 2 * u * t * C[1] + t * t * T[1]]; };
    for (let j = 0; j < per; j++) {
      const i = si * 31 + j, v = 0.0042 * (0.85 + 0.3 * rnd(si, 70));
      const p = (((f * v + j / per + rnd(i, 71) * 0.06) % 1) + 1) % 1, q = Math.pow(p, 1.2);
      const P0 = B(q), Pb = B(Math.max(0, q - 0.01));
      const ang = Math.atan2(P0[1] - Pb[1], P0[0] - Pb[0]), nx = -Math.sin(ang), ny = Math.cos(ang);
      const lat = ((rnd(i, 72) - 0.5) * 46 + Math.sin(f / 9 + i) * 8) * (1 - q);
      const P = [P0[0] + nx * lat, P0[1] + ny * lat + Math.sin(f / 5 + i * 2) * 3 * (1 - q)];
      const sz = lerp(26, 3.2, Math.pow(q, 0.7)) * (0.7 + 0.5 * rnd(i, 73));
      if (q > 0.95) { const u = (q - 0.95) / 0.05; out.push(<circle key={`x${i}`} cx={T[0] + nx * lat} cy={T[1]} r={5 + 18 * u} fill={`url(#${id}-fl)`} opacity={1 - u}/>); continue; }
            out.push(<circle key={`g${i}`} cx={P[0]} cy={P[1]} r={sz * 2.4} fill={`url(#${id}-fl)`} opacity={0.12 + 0.45 * q}/>);
      const ca = Math.cos(ang), sa = Math.sin(ang), fl = 0.3 + 0.7 * Math.abs(Math.sin(f * 0.8 + i * 1.7));
      const Q = (u: number, w: number): Pt => [P[0] + ca * u * sz - sa * w * sz, P[1] + sa * u * sz + ca * w * sz];
      const wing = (sg: number) => smooth([Q(0.22, 0.05 * sg), Q(0.34, 0.42 * sg * fl), Q(0.16, 1.0 * sg * fl), Q(-0.12, 0.92 * sg * fl), Q(-0.3, 0.6 * sg * fl), Q(-0.52, 0.42 * sg * fl), Q(-0.46, 0.08 * sg)]);
      out.push(<path key={`m${i}`} d={wing(1) + " " + wing(-1)} fill="#1C0E16" stroke="#FFCB80" strokeWidth={sz > 10 ? 1 : 0.6} strokeOpacity={0.55 + 0.4 * q}/>);
      out.push(<ellipse key={`b${i}`} cx={P[0]} cy={P[1]} rx={sz * 0.42} ry={sz * 0.1} transform={`rotate(${(ang * 180) / Math.PI} ${P[0]} ${P[1]})`} fill="#2A1418" stroke="#FFCB80" strokeWidth={0.5} strokeOpacity={0.6}/>);
    }
  });
  return <g><defs><radialGradient id={`${id}-fl`}><stop offset="0" stopColor="#FFF4DA" stopOpacity={0.9}/><stop offset="0.3" stopColor="#FFC070" stopOpacity={0.4}/><stop offset="1" stopColor="#F08A48" stopOpacity={0}/></radialGradient></defs>{out}</g>;
};
// Embers lifting off the fire.
const Embers: React.FC<{f: number; hor: number; n?: number}> = ({f, hor, n = 90}) => (
  <g>{Array.from({length: n}, (_, i) => {
    const per = 120 + rnd(i, 81) * 140, p = (((f + rnd(i, 82) * per) / per) % 1 + 1) % 1;
    const x = lerp(300, 1620, rnd(i, 83)) + Math.sin(f / 30 + i) * 14 + p * (rnd(i, 84) - 0.5) * 120, y = hor - 40 - p * (240 + rnd(i, 85) * 300);
    return <circle key={i} cx={x} cy={y} r={0.8 + rnd(i, 86) * 1.8} fill="#FFD58E" opacity={Math.sin(Math.PI * p) * (0.4 + 0.5 * rnd(i, 87))}/>;
  })}</g>
);

// ---------- 1. the ocean (2.70) ----------
const OH = 572;   // horizon
const O_FAR_L: Ridge = {keys: [[-80, 440], [120, 424], [300, 446], [520, 484], [720, 528], [880, 558], [1000, 571]], shore: [[1000, OH + 1], [-80, OH + 1]], rough: 5, scale: 40, seed: 11};
const O_FAR_R: Ridge = {keys: [[2000, 466], [1820, 456], [1640, 482], [1480, 524], [1360, 556], [1250, 571]], shore: [[1250, OH + 1], [2000, OH + 1]], rough: 5, scale: 40, seed: 12};
const O_L0: Ridge = {keys: [[-80, 330], [40, 282], [150, 250], [230, 270], [300, 298], [380, 318], [460, 362], [540, 420], [620, 486], [690, 552], [740, 596], [790, 612]], shore: [[790, 614], [400, 614], [-80, 614]], rough: 10, scale: 56, seed: 13};
const O_PLAIN: Ridge = {keys: [[-80, 598], [200, 592], [420, 596], [620, 604], [740, 616], [792, 628]], shore: [[792, 630], [500, 634], [-80, 640]], rough: 1.5, scale: 30, seed: 19, trees: 0.12, tr: [3, 5]};
const O_L2: Ridge = {keys: [[-80, 548], [40, 536], [140, 548], [240, 590], [316, 640], [372, 676], [404, 694]], shore: [[404, 696], [260, 704], [80, 716], [-80, 730]], rough: 7, scale: 34, seed: 15, trees: 0.45, tr: [3.5, 6]};
const O_R0: Ridge = {keys: [[2000, 326], [1880, 292], [1780, 270], [1700, 300], [1620, 340], [1540, 400], [1470, 460], [1410, 520], [1370, 568], [1346, 594]], shore: [[1346, 596], [2000, 596]], rough: 10, scale: 56, seed: 16};
const O_R1: Ridge = {keys: [[2000, 430], [1880, 420], [1760, 440], [1660, 462], [1600, 478], [1566, 494], [1548, 500], [1538, 540], [1534, 590], [1522, 640]], shore: [[1522, 642], [2000, 642]], rough: 6, scale: 30, seed: 17, trees: 0.35, tr: [3, 5]};
const O_R2: Ridge = {keys: [[2000, 604], [1900, 588], [1800, 604], [1720, 644], [1662, 688], [1640, 702]], shore: [[1640, 704], [1820, 716], [2000, 730]], rough: 7, scale: 34, seed: 18, trees: 0.45, tr: [3.5, 6]};
const O_RIVERS: Record<string, RiverDef[]> = {
  L0: [
    {pts: [[338, 304], [342, 326], [334, 348], [338, 372], [352, 396], [348, 420], [356, 446], [368, 470], [362, 500], [378, 528], [384, 556], [398, 580], [410, 598]], w0: 0.9, w1: 3.4, seed: 1, broken: 0.3},
    {pts: [[132, 268], [136, 292], [128, 318], [134, 346], [146, 372], [140, 400], [148, 432], [158, 462], [154, 494], [166, 526], [170, 560]], w0: 0.8, w1: 2.8, seed: 7, broken: 0.25},
  ],
  PLAIN: [{pts: [[410, 598], [452, 604], [512, 600], [548, 606], [508, 612], [470, 616], [528, 622], [610, 620], [668, 624], [730, 628]], w0: 3, w1: 9, seed: 2}],
  L2: [{pts: [[110, 548], [126, 580], [108, 612], [142, 648], [172, 688], [196, 714]], w0: 1.3, w1: 8, seed: 3}],
  R0: [{pts: [[1702, 298], [1698, 322], [1708, 348], [1700, 376], [1690, 404], [1684, 432], [1676, 450]], w0: 0.8, w1: 2.8, seed: 4, broken: 0.3}],
  R1: [{pts: [[1844, 428], [1830, 446], [1862, 456], [1806, 466], [1752, 462], [1712, 474], [1752, 482], [1680, 488], [1620, 490], [1576, 500]], w0: 1.2, w1: 5.5, seed: 5}],
  R2: [{pts: [[1842, 594], [1828, 628], [1858, 658], [1812, 688], [1762, 708], [1714, 720]], w0: 1.4, w1: 9, seed: 6}],
};
const ROCKS: number[][] = [[430, 700, 14], [466, 694, 7], [372, 712, 9], [1610, 708, 12], [1580, 700, 6], [1500, 648, 8], [1474, 644, 5]];
const rock = (x: number, y: number, r: number, i: number) => smooth(Array.from({length: 7}, (_, k) => { const a = Math.PI + (k / 6) * Math.PI; return [x + Math.cos(a) * r * (0.9 + 0.3 * rnd(i * 7 + k, 41)), y + Math.sin(a) * r * (0.55 + 0.35 * rnd(i * 7 + k, 42)) + 1] as Pt; }).concat([[x + r, y + 2, "c"], [x - r, y + 2, "c"]] as Pt[]));
const reflectD = (crest: number[][], y0: number) => lineD([...crest.map(([x, y]) => [x, 2 * y0 - y]), [crest[crest.length - 1][0], y0], [crest[0][0], y0]], true);
const Ocean: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), id = useUid("oc");
  const fire = s.variant === "fire", mood = fire ? "fire" : moodOf(s.mood, "gold");
  const sun: [number, number] = [960, fire ? 560 : 512];
  const geo = useMemo(() => ({FL: ridgeGeo(O_FAR_L), FR: ridgeGeo(O_FAR_R), L0: ridgeGeo(O_L0), PL: ridgeGeo(O_PLAIN), L2: ridgeGeo(O_L2), R0: ridgeGeo(O_R0), R1: ridgeGeo(O_R1), R2: ridgeGeo(O_R2)}), []);
  const lightL: [number, number] = [1, -0.7], lightR: [number, number] = [-1, -0.7];
  const k = fire ? 0.8 + 0.2 * span(f, 0, n * 0.3) : 1;
  const far = fire ? ["#3A1A26", "#6A2A2C"] : mood === "dawn" ? ["#5A4C78", "#9A88A8"] : mood === "night" ? ["#1C2448", "#2E3A66"] : ["#5A3352", "#A0585A"];
  const mid = fire ? "#22101A" : mood === "dawn" ? "#2E2846" : mood === "night" ? "#121830" : "#2A1834";
  const rim = `url(#${id}-rimg)`;
  const layer = (g: {d: string}, fill: string, light: [number, number], w = 3, rimC = rim) => <Rimmed paths={[g.d]} fill={fill} light={light} w={w} rim={rimC}/>;
  const rivers = (key: string) => O_RIVERS[key].map((r, i) => <River key={key + i} r={r} f={f} id={`${id}${key}${i}`} fire={fire} mouth={key === "PLAIN" || key === "L2" || key === "R2"}/>);
  const shoreLine = (g: {shore: number[][]}, op: number) => <path d={lineD(g.shore)} fill="none" stroke={fire ? "#FFC070" : "#FFE3B0"} strokeWidth={1.3} opacity={op}/>;
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.05)} cy={OH}>
      <SkyW mood={mood} hor={OH} sun={sun} sunR={fire ? 0 : 50} f={f} id={id} stars={fire ? 0.15 : mood === "night" ? 1 : 0.35} disc={!fire} glow={fire ? 0.5 : 1}/>
      {!fire ? <Clouds f={f} mood={mood as Mood} op={0.55}/> : null}
      {fire ? <FireWall f={f} hor={OH} x0={-120} x1={2040} hmax={400} id={`${id}fw`} k={k}/> : null}
      <SeaBase mood={mood} hor={OH} sun={sun} id={id} spread={fire ? 700 : 220}/>
      <defs>
        <linearGradient id={`${id}-rf`} gradientUnits="userSpaceOnUse" x1={0} y1={600} x2={0} y2={800}><stop offset="0" stopColor="#0A0612" stopOpacity={fire ? 0.5 : 0.55}/><stop offset="1" stopColor="#0A0612" stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}-hz`} gradientUnits="userSpaceOnUse" x1={0} y1={400} x2={0} y2={OH}><stop offset="0" stopColor={far[0]}/><stop offset="1" stopColor={far[1]}/></linearGradient>
        <radialGradient id={`${id}-rimg`} gradientUnits="userSpaceOnUse" cx={sun[0]} cy={sun[1]} r={1150}>
          <stop offset="0" stopColor={fire ? "#FFF0C8" : "#FFF0CC"}/><stop offset="0.3" stopColor={fire ? "#FFB868" : K.rim}/><stop offset="0.62" stopColor={fire ? "#D8703E" : "#D99A66"} stopOpacity={0.75}/><stop offset="1" stopColor={fire ? "#8E3A30" : "#7A4A58"} stopOpacity={0.45}/></radialGradient>
        <linearGradient id={`${id}-fL`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={800} y2={0}><stop offset="0" stopColor={fire ? "#FF9A50" : "#F2B070"} stopOpacity={0}/><stop offset="0.55" stopColor={fire ? "#FF9A50" : "#F2B070"} stopOpacity={0.04}/><stop offset="1" stopColor={fire ? "#FFB868" : "#FFD08A"} stopOpacity={fire ? 0.3 : 0.2}/></linearGradient>
        <linearGradient id={`${id}-fR`} gradientUnits="userSpaceOnUse" x1={W} y1={0} x2={1300} y2={0}><stop offset="0" stopColor={fire ? "#FF9A50" : "#F2B070"} stopOpacity={0}/><stop offset="0.5" stopColor={fire ? "#FF9A50" : "#F2B070"} stopOpacity={0.04}/><stop offset="1" stopColor={fire ? "#FFB868" : "#FFD08A"} stopOpacity={fire ? 0.3 : 0.2}/></linearGradient>
        <linearGradient id={`${id}-h0`} gradientUnits="userSpaceOnUse" x1={0} y1={280} x2={0} y2={600}><stop offset="0" stopColor={mid}/><stop offset="1" stopColor={fire ? "#3A1620" : mood === "dawn" ? "#4A3C5E" : mood === "night" ? "#1C2446" : "#3E2238"}/></linearGradient>
      </defs>
      {/* the headlands mirrored in the still water, fading fast */}
      <path d={reflectD(geo.PL.crest, 632)} fill={`url(#${id}-rf)`}/>
      <path d={reflectD(geo.L2.crest, 706)} fill={`url(#${id}-rf)`}/>
      <path d={reflectD(geo.R1.crest, 641)} fill={`url(#${id}-rf)`}/>
      <path d={reflectD(geo.R2.crest, 712)} fill={`url(#${id}-rf)`}/>
      <SeaSurface mood={mood} hor={OH} sun={sun} f={f} id={id} spread={fire ? 640 : 220} glints={fire ? 420 : 330} side={fire ? 0.3 : 0.2}/>
      {layer(geo.FL, `url(#${id}-hz)`, lightL, 2, fire ? "#FFB060" : "#F6CB92")}
      {layer(geo.FR, `url(#${id}-hz)`, lightR, 2, fire ? "#FFB060" : "#F6CB92")}
      {layer(geo.L0, `url(#${id}-h0)`, lightL, 2.5)}<path d={geo.L0.d} fill={`url(#${id}-fL)`}/>{rivers("L0")}
      {layer(geo.R0, `url(#${id}-h0)`, lightR, 2.5)}<path d={geo.R0.d} fill={`url(#${id}-fR)`}/>{rivers("R0")}
      {layer(geo.PL, mid, lightL, 2)}{shoreLine(geo.PL, 0.25)}{rivers("PLAIN")}
      {layer(geo.R1, mid, lightR, 3)}<path d={geo.R1.d} fill={`url(#${id}-fR)`} opacity={0.6}/>{shoreLine(geo.R1, 0.25)}{rivers("R1")}
      <Fall x0={1572} y0={500} x1={1550} y1={642} w={8} f={f} id={`${id}wf`} fire={fire}/>
      {layer(geo.L2, K.sil, lightL, 3)}{shoreLine(geo.L2, 0.3)}{rivers("L2")}
      {layer(geo.R2, K.sil, lightR, 3)}{shoreLine(geo.R2, 0.3)}{rivers("R2")}
      <Rimmed paths={ROCKS.map(([x, y, r], i) => rock(x, y, r, i))} fill={K.sil} light={[0, -1]} w={1.5} rim={rim}/>
      {fire ? <><Embers f={f} hor={OH}/><Moths f={f} id={`${id}m`}/></> : <Dust f={f} sun={sun} n={40} y0={180} y1={880}/>}
    </Frame>
  );
};


// ---------- 2. the lotus leaf (5.10) ----------
// A band whose width follows wf(u) along a polyline: leaves, fronds, reeds.
const band = (pts: number[][], wf: (u: number) => number): string => {
  const L: number[][] = [], R: number[][] = [], n = pts.length;
  for (let i = 0; i < n; i++) { const nn = nrmAt(pts, i), w = wf(i / (n - 1)) / 2; L.push([pts[i][0] + nn[0] * w, pts[i][1] + nn[1] * w]); R.push([pts[i][0] - nn[0] * w, pts[i][1] - nn[1] * w]); }
  return lineD([...L, ...R.reverse()], true);
};
// A far treeline: leafy crowns over low scrub, as one silhouette.
const treeline = (baseY: number, x0: number, x1: number, seed: number, h0: number, h1: number, r0 = 14, r1 = 34): string => {
  const trees: number[][] = [];
  const win = (x: number) => Math.min(1, (x - x0) / 160, (x1 - x) / 160);
  for (let x = x0, i = 0; x < x1 && i < 500; i++) {
    const tall = rnd(i, seed + 6) < 0.12, r = lerp(r0, r1, rnd(i, seed)) * (tall ? 1.25 : 1), h = lerp(h0, h1, rnd(i, seed + 1)) * (0.55 + 0.45 * (vnoise(x / 260, seed + 2) + 1) / 2) * (tall ? 1.5 : 1) * Math.max(0.15, win(x));
    // a crown is a cluster of three lobes
    for (let k = 0; k < 5; k++) { const o = (k - 2) / 2; trees.push([x + o * r * 0.62 + (rnd(i * 5 + k, seed + 8) - 0.5) * r * 0.2, h - Math.abs(o) * r * 0.42 - rnd(i * 5 + k, seed + 9) * r * 0.15, r * (0.38 + 0.22 * (1 - Math.abs(o)) + 0.12 * rnd(i * 5 + k, seed + 10))]); }
    x += r * (0.7 + rnd(i, seed + 3) * 1.2);
  }
  const pts: number[][] = [];
  for (let x = x0; x <= x1; x += 3) {
    let top = (5 + 3 * fbm(x / 30, seed + 4)) * Math.max(0, win(x));
    for (const [cx, h, r] of trees) { const dx = Math.abs(x - cx); if (dx < r) top = Math.max(top, h - r + Math.sqrt(r * r - dx * dx) + 2.6 * fbm(x / 3.5, seed + 5)); }
    pts.push([x, baseY - top]);
  }
  return lineD([...pts, [x1, baseY + 6], [x0, baseY + 6]], true);
};
// A broad shade tree (neem, banyan): a short leaning trunk with two limbs and a wide crown with a scalloped, leafy edge.
const broadTree = (x: number, y: number, h: number, w: number, seed: number, f: number): string[] => {
  const cy = y - h * 0.68, sway = Math.sin(f / 60 + seed) * 1.5;
  const crown = Array.from({length: 140}, (_, i) => {
    const th = (i / 140) * 6.283, up = Math.max(0, -Math.sin(th));
    const r = 1 + 0.07 * fbm(th * 2.2, seed) + 0.06 * Math.abs(Math.sin(th * 11 + seed)) * (0.4 + up) + 0.025 * Math.abs(Math.sin(th * 29 + seed * 2));
    const flat = Math.sin(th) > 0 ? 0.7 : 1;
    return [x + Math.cos(th) * w * 0.5 * r + sway * up, cy - h * 0.06 + Math.sin(th) * h * 0.46 * r * flat] as Pt;
  });
  const trunk = ribbon([[x - 6, y], [x - 4, y - h * 0.2], [x + 2, y - h * 0.4], [x + 4, cy]], h * 0.09, h * 0.05);
  const limbL = ribbon([[x, y - h * 0.36], [x - w * 0.16, y - h * 0.48], [x - w * 0.26, cy + h * 0.06]], h * 0.04, h * 0.015);
  const limbR = ribbon([[x + 2, y - h * 0.4], [x + w * 0.14, y - h * 0.5], [x + w * 0.24, cy + h * 0.08]], h * 0.035, h * 0.015);
  return [smooth(crown), trunk, limbL, limbR];
};
// A palm: a slender leaning trunk and a crown of drooping fronds.
const palm = (x: number, y: number, h: number, lean: number, sc: number, f: number, seed: number): string[] => {
  const top = [x + lean * h, y - h];
  const trunk = Array.from({length: 10}, (_, k) => { const u = k / 9; return [x + lean * h * (u * 0.6 + u * u * 0.4), y - h * u]; });
  const out = [ribbon(trunk, 7 * sc, 4 * sc)];
  for (let k = 0; k < 9; k++) {
    const a = -Math.PI + (k / 8) * Math.PI + (rnd(k, seed) - 0.5) * 0.3, Lf = (40 + 16 * rnd(k, seed + 1)) * sc, sw = Math.sin(f / 40 + k + seed) * 0.04;
    const pts = Array.from({length: 8}, (_, i) => { const u = i / 7; return [top[0] + Math.cos(a + sw) * Lf * u, top[1] + Math.sin(a + sw) * Lf * u * 0.55 + Lf * 0.55 * u * u]; });
    out.push(band(pts, (u) => 9 * sc * Math.pow(Math.sin(Math.PI * Math.min(1, u * 0.9 + 0.08)), 0.7)));
  }
  return out;
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
// The drops: they fall, bead, run down the leaf and drop off its lowest edge into the pond, leaving it dry.
const Drops: React.FC<{f: number; n: number; C: number[]; rx: number; ry: number; waterY: number; id: string; droop?: number}> = ({f, n, C, rx, ry, waterY, id, droop = 30}) => {
  const P = 72, out: React.ReactNode[] = [], rip: React.ReactNode[] = [];
  const pos = (u: number, v: number) => leafPt(C, rx, ry, Math.atan2(v, u), Math.hypot(u, v), droop);
  for (let j = -3; j <= Math.ceil(n / P) + 1; j++) {
    const t0 = j * P + 4, tau = f - t0;
    if (tau < 0 || tau > 200) continue;
    let u0 = (rnd(j + 50, 1) - 0.62) * 1.3, v0 = (rnd(j + 50, 2) - 0.5) * 1.1; const l0 = Math.hypot(u0, v0); if (l0 > 0.72) { u0 *= 0.72 / l0; v0 *= 0.72 / l0; }
    const te = 0.05 + rnd(j + 50, 3) * 0.5, ue = Math.cos(te), ve = Math.sin(te), r = 10 + rnd(j + 50, 4) * 5;
    const L = pos(u0, v0), E = pos(ue, ve);
    if (tau < 16) {   // falling, a thin streak of light
      const k = tau / 16, y = L[1] - 240 * (1 - k * k), x = L[0] - 14 * (1 - k), fo = Math.min(1, k * 3);
      out.push(<g key={`f${j}`} opacity={fo}><path d={`M ${x + 3} ${y - 24 - 30 * k} L ${x} ${y}`} stroke="#FFF0D0" strokeWidth={1.6} opacity={0.5} strokeLinecap="round"/><ellipse cx={x} cy={y} rx={2.8} ry={4.4} fill="#FFF6E0"/></g>);
      continue;
    }
    if (tau < 84) {
      const k = tau < 38 ? 0 : Math.pow((tau - 38) / 46, 1.7), u = lerp(u0, ue, k), v = lerp(v0, ve, k), p = pos(u, v);
      const grow = Math.min(1, (tau - 16) / 5), sq = tau < 26 ? 1 + 0.25 * Math.sin((tau - 16) * 0.9) * (1 - (tau - 16) / 10) : 1;
      if (tau < 28) { const s2 = (tau - 16) / 12; out.push(<ellipse key={`s${j}`} cx={L[0]} cy={L[1]} rx={4 + 26 * s2} ry={(4 + 26 * s2) * (ry / rx)} fill="none" stroke="#FFE9C0" strokeWidth={1} opacity={0.5 * (1 - s2)}/>); }
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
const petalD = (B: number[], ang: number, len: number, wid: number, bend: number): string => {
  const d = [Math.sin(ang), -Math.cos(ang)], nn = [Math.cos(ang), Math.sin(ang)], L: Pt[] = [], R: Pt[] = [], N = 9;
  for (let i = 1; i < N; i++) {
    const u = i / N, ax = B[0] + d[0] * len * u + nn[0] * bend * len * u * u, ay = B[1] + d[1] * len * u + nn[1] * bend * len * u * u;
    const hw = wid * (0.28 * (1 - u) + 0.82 * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.8)), 0.9));
    L.push([ax - nn[0] * hw, ay - nn[1] * hw]); R.push([ax + nn[0] * hw, ay + nn[1] * hw]);
  }
  const tip: Pt = [B[0] + d[0] * len + nn[0] * bend * len, B[1] + d[1] * len + nn[1] * bend * len, "c"];
  return smooth([[B[0] - nn[0] * wid * 0.22, B[1] - nn[1] * wid * 0.22], ...L, tip, ...R.reverse(), [B[0] + nn[0] * wid * 0.22, B[1] + nn[1] * wid * 0.22]] as Pt[]);
};
// The lotus, from a closed bud (open = 0) to a full flower (open = 1), backlit: petals glow where the light comes through.
const LotusFlower: React.FC<{x: number; y: number; open: number; f: number; id: string; sc?: number; lightX?: number}> = ({x, y, open, f, id, sc = 1, lightX = 1}) => {
  const whorls = [
    {n: 6, az0: 15, len: 150, wid: 40, a0: 0.13, a1: 1.15},
    {n: 6, az0: 45, len: 134, wid: 36, a0: 0.07, a1: 0.72},
    {n: 5, az0: 5, len: 108, wid: 30, a0: 0.03, a1: 0.36},
  ];
  const P: {z: number; d: string; w: number}[] = [];
  whorls.forEach((w, wi) => {
    for (let k = 0; k < w.n; k++) {
      const az = ((w.az0 + (k * 360) / w.n) * Math.PI) / 180, a = lerp(w.a0, w.a1, open) + 0.015 * Math.sin(f / 40 + k + wi);
      const tx = Math.sin(a) * Math.cos(az), ty = Math.cos(a) - 0.3 * Math.sin(a) * Math.sin(az), tz = Math.sin(a) * Math.sin(az);
      const ang = Math.atan2(tx, ty), pl = Math.hypot(tx, ty), wf = 0.5 + 0.5 * Math.abs(Math.sin(az));
      const B = [x + Math.cos(az) * (8 - wi * 3) * sc * open, y + Math.sin(az) * 3 * sc];
      P.push({z: tz + wi * 0.01, d: petalD(B, ang, w.len * sc * Math.max(0.55, pl), w.wid * sc * wf, (tz < 0 ? -0.06 : 0.06) * Math.sign(tx || 1)), w: wi});
    }
  });
  P.sort((a, b) => a.z - b.z);
  const back = P.filter((p) => p.z < 0), front = P.filter((p) => p.z >= 0);
  const podY = y - 34 * sc, pod = open > 0.3 ? clamp01((open - 0.3) / 0.4) : 0;
  const draw = (p: {z: number; d: string; w: number}, i: number) => <g key={i}>
    <path d={p.d} fill={`url(#${id}-pt)`} opacity={p.z < 0 ? 0.82 : 0.96}/>
    <path d={p.d} fill={`url(#${id}-lit)`} opacity={0.5 + 0.4 * open}/>
    <path d={p.d} fill="none" stroke={`url(#${id}-rim)`} strokeWidth={1.2 * sc}/>
  </g>;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-pt`} gradientUnits="userSpaceOnUse" x1={0} y1={y} x2={0} y2={y - 150 * sc}><stop offset="0" stopColor="#1E0E20"/><stop offset="0.45" stopColor="#4A2240"/><stop offset="0.85" stopColor="#9A5466"/><stop offset="1" stopColor="#D69080"/></linearGradient>
        <radialGradient id={`${id}-lit`} gradientUnits="userSpaceOnUse" cx={x + 80 * sc * lightX} cy={y - 120 * sc} r={190 * sc}><stop offset="0" stopColor="#FFE9C4" stopOpacity={0.95}/><stop offset="0.5" stopColor="#F2A88E" stopOpacity={0.35}/><stop offset="1" stopColor="#F2A88E" stopOpacity={0}/></radialGradient>
        <linearGradient id={`${id}-rim`} gradientUnits="userSpaceOnUse" x1={x - 40 * sc * lightX} y1={0} x2={x + 140 * sc * lightX} y2={0}><stop offset="0" stopColor="#FFE3B0" stopOpacity={0}/><stop offset="0.5" stopColor="#FFE3B0" stopOpacity={0.25}/><stop offset="1" stopColor="#FFF0D0" stopOpacity={0.95}/></linearGradient>
        <linearGradient id={`${id}-pod`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE9A8"/><stop offset="1" stopColor="#B8862F"/></linearGradient>
      </defs>
      <circle cx={x} cy={y - 70 * sc} r={(140 + 180 * open) * sc} fill="url(#k-halo)" opacity={0.5 + 0.5 * open}/>
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
const reedD = (x: number, y: number, h: number, lean: number, w: number, f: number, i: number) => {
  const sway = Math.sin(f / 55 + i * 1.3) * 0.025;
  const pts = Array.from({length: 10}, (_, k) => { const u = k / 9; return [x + (lean + sway) * h * u * u, y - h * u]; });
  return band(pts, (u) => w * (1 - u * 0.92));
};
const LotusLeafScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame(), id = useUid("lt");
  const mood = moodOf(s.mood, "dawn"), HOR = 530, night = mood === "night";
  const sun: [number, number] = night ? [1440, 290] : [1440, 446];
  const open = span(f, n * 0.06, n * 0.92);
  const C = [700, 690], RX = 410, RY = 84, WY = 892;
  const flower = [1262, 548], fw = 868;
  const lightL: [number, number] = [0.85, -0.55];
  const bankFar = night ? ["#1E2850", "#33406E"] : ["#5E5280", "#B49CB0"], bankNear = night ? "#141A36" : "#33284C";
  const floating: number[][] = [[262, 584, 66], [540, 572, 38], [1040, 588, 52], [1520, 598, 80], [1800, 624, 112], [96, 668, 140]];
  const mist = Array.from({length: 9}, (_, i) => [((rnd(i, 140) * 2400 + f * (0.25 + 0.2 * rnd(i, 141))) % 2400) - 240, 540 + rnd(i, 142) * 150, 300 + rnd(i, 143) * 300]);
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.06)} cx={C[0] + 160} cy={C[1] - 60}>
      <SkyW mood={mood} hor={HOR} sun={sun} sunR={night ? 30 : 44} f={f} id={id} stars={night ? 1 : 0.15}/>
      <Clouds f={f} mood={mood as Mood} op={0.45}/>
      <defs>
        <linearGradient id={`${id}-bf`} gradientUnits="userSpaceOnUse" x1={0} y1={HOR - 90} x2={0} y2={HOR}><stop offset="0" stopColor={bankFar[0]}/><stop offset="1" stopColor={bankFar[1]}/></linearGradient>
        <linearGradient id={`${id}-mb`} gradientUnits="userSpaceOnUse" x1={0} y1={HOR - 60} x2={0} y2={HOR + 50}><stop offset="0" stopColor="#F4D9C0" stopOpacity={0}/><stop offset="0.6" stopColor={night ? "#8A96C0" : "#F4D9C0"} stopOpacity={0.55}/><stop offset="1" stopColor="#F4D9C0" stopOpacity={0}/></linearGradient>
        <radialGradient id={`${id}-mist`}><stop offset="0" stopColor={night ? "#9AA6D0" : "#F8E6D8"} stopOpacity={0.42}/><stop offset="0.6" stopColor={night ? "#9AA6D0" : "#F6E2D2"} stopOpacity={0.14}/><stop offset="1" stopColor="#F6E2D2" stopOpacity={0}/></radialGradient>
        <linearGradient id={`${id}-rf`} gradientUnits="userSpaceOnUse" x1={0} y1={WY} x2={0} y2={WY + 190}><stop offset="0" stopColor="#0A0612" stopOpacity={0.55}/><stop offset="1" stopColor="#0A0612" stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}-fs`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C8B0C8" stopOpacity={0.45}/><stop offset="0.5" stopColor="#5A4870" stopOpacity={0.12}/><stop offset="1" stopColor="#2A2038" stopOpacity={0}/></linearGradient>
      </defs>
      <path d={treeline(HOR, -60, 1980, 31, 12, 30, 8, 16)} fill={`url(#${id}-bf)`}/>
      {[[1650, 96, 0.12, 0.7], [1712, 112, -0.08, 0.8], [980, 84, 0.06, 0.6], [1500, 60, 0.0, 0.0]].filter((p) => p[3] > 0).map(([x, h, l, sc], i) => <path key={i} d={palm(x, HOR + 2, h, l, sc, f, i + 3).join(" ")} fill={`url(#${id}-bf)`}/>)}
      <path d={broadTree(1380, HOR + 2, 70, 120, 5, f).join(" ")} fill={`url(#${id}-bf)`}/>
      <Rimmed paths={[treeline(HOR + 8, -60, 600, 37, 14, 34, 9, 16), ...broadTree(130, HOR + 10, 190, 300, 2, f), ...broadTree(470, HOR + 10, 120, 170, 9, f), ...palm(330, HOR + 10, 170, 0.1, 1.05, f, 11), ...palm(372, HOR + 10, 140, -0.12, 0.95, f, 12)]} fill={bankNear} light={[1, -0.6]} w={2} rim="#F2C99A"/>
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
      {/* a small bud far left, and a furled young leaf */}
      <Rimmed paths={[ribbon([[300, 650], [296, 590], [290, 530], [284, 494]], 3.5, 2.5), petalD([284, 496], 0.08, 44, 12, 0)]} fill="#24142C" light={lightL} w={2}/>
      <Rimmed paths={[ribbon([[470, 640], [474, 600], [468, 560]], 3, 2.4), band([[468, 562], [470, 540], [478, 520], [486, 506]], (u) => 16 * Math.sin(Math.PI * (0.15 + 0.85 * u)) + 2)]} fill="#24142C" light={lightL} w={2}/>
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
      <Drops f={f} n={n} C={C} rx={RX} ry={RY} waterY={WY + 8} id={`${id}d`} droop={26}/>
      {mist.map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.16} fill={`url(#${id}-mist)`}/>)}
      {/* reeds at the edges, close to us */}
      <g>{[[-20, 1100, 500, 0.16, 16], [26, 1100, 400, 0.3, 12], [66, 1100, 300, 0.04, 10], [104, 1100, 230, 0.42, 9], [1850, 1100, 440, -0.18, 14], [1896, 1100, 340, -0.04, 11], [1800, 1100, 260, -0.36, 9]].map(([x, y, h, l, w], i) =>
        <path key={i} d={reedD(x, y, h, l, w, f, i)} fill="#0C0712"/>)}</g>
      <Dust f={f} sun={sun} n={50} y0={380} y1={860} color="#FFF0D6"/>
    </Frame>
  );
};

// ---------- 3. the tortoise (2.58) ----------
// The carapace is a loft seen from the side and a little from above: s runs tail (-1) to head (+1), t runs from the near
// rim (0) over the top (pi/2). Scute seams, growth rings and the serrated marginals all follow that surface, so the
// dome reads as a dome even in silhouette. Local frame: head towards +x, ground at y = 0.
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
// Scute seams and growth rings as one path (strokes), on the near side of the dome.
// Scute layout in (s, t): marginals in a narrow band at the rim; four costals whose seams converge towards the spine; the
// hexagonal vertebrals meet the costals in a zigzag. Growth rings are inset copies of each scute, centred high (the
// areola sits near the top of a costal), drawn as one path of strokes.
const T1 = 0.2, T2 = 1.12, TT = Math.PI / 2 + 0.45;
const COST_B = [-0.5, -0.07, 0.36], COST_T = [-0.42, -0.05, 0.31], VERT = [-0.62, -0.23, 0.13, 0.5];
const shellDetail = (oy: number): {seams: string; rings: string} => {
  const P = (s: number, t: number) => shellAt(s, t, oy);
  const path = (pts: number[][], k = 6) => { const out: number[][] = []; for (let i = 0; i < pts.length - 1; i++) for (let j = 0; j < k; j++) { const u = j / k; out.push(P(lerp(pts[i][0], pts[i + 1][0], u), lerp(pts[i][1], pts[i + 1][1], u))); } out.push(P(pts[pts.length - 1][0], pts[pts.length - 1][1])); return lineD(out); };
  const seams: string[] = [];
  seams.push(lineD(Array.from({length: 61}, (_, i) => P(lerp(-0.97, 0.97, i / 60), T1 + 0.025 * Math.sin(i * 0.67)))));
  for (let k = 1; k <= 11; k++) { let lo = -1, hi = 1; for (let it = 0; it < 30; it++) { const md = (lo + hi) / 2; if (margIdx(md) < k) lo = md; else hi = md; } const sk = (lo + hi) / 2; if (Math.abs(sk) < 0.97) seams.push(path([[sk, 0.02], [sk + 0.012 * Math.sign(sk), T1]], 3)); }
  const zig: number[][] = [[-0.88, T2]];
  VERT.forEach((v, k) => { zig.push([v, T2 + 0.07]); if (k < 3) zig.push([COST_T[k], T2 - 0.05]); });
  zig.push([0.86, T2]);
  seams.push(path(zig, 5));
  COST_B.forEach((b0, k) => seams.push(path([[b0, T1], [lerp(b0, COST_T[k], 0.5) + 0.02, (T1 + T2) / 2], [COST_T[k], T2 - 0.05]], 5)));
  VERT.forEach((v) => seams.push(path([[v, T2 + 0.07], [v * 0.96, TT]], 6)));
  const rings: string[] = [];
  let ri = 0;
  const ringsOf = (poly: number[][], c: number[], ks: number[]) => ks.forEach((q) => {
    const pts: Pt[] = [];
    poly.forEach((a, j) => { const b2 = poly[(j + 1) % poly.length]; [0, 0.5].forEach((u) => { const es = lerp(a[0], b2[0], u), et = lerp(a[1], b2[1], u); pts.push(P(c[0] + (es - c[0]) * q + (rnd(ri++, 202) - 0.5) * 0.02, c[1] + (et - c[1]) * q + (rnd(ri++, 203) - 0.5) * 0.03) as Pt); }); });
    rings.push(smooth(pts));
  });
  const cb = [-0.93, ...COST_B, 0.86], ct = [-0.8, ...COST_T, 0.72];
  for (let j = 0; j < 4; j++) {
    const top: number[][] = [[ct[j + 1], T2 - 0.05], [VERT[j], T2 + 0.07], [ct[j], T2 - 0.05]];
    const poly = [[cb[j], T1], [cb[j + 1], T1], ...top];
    ringsOf(poly, [(cb[j] + cb[j + 1] + VERT[j] * 2) / 4, lerp(T1, T2, 0.64)], [0.72, 0.46, 0.18]);
  }
  const vx = [-0.9, ...VERT, 0.9];
  for (let j = 0; j < 5; j++) {
    const poly = [[vx[j], T2 + 0.07], [j > 0 && j < 4 ? COST_T[j - 1] : (vx[j] + vx[j + 1]) / 2, T2 - 0.05], [vx[j + 1], T2 + 0.07], [vx[j + 1] * 0.96, TT], [vx[j] * 0.96, TT]];
    ringsOf(poly, [(vx[j] + vx[j + 1]) / 2, T2 + 0.32], [0.66, 0.34]);
  }
  return {seams: seams.join(" "), rings: rings.join(" ")};
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
// The head in its own frame (base at the origin, beak towards +x): a blunt, flat-topped tortoise head with a hooked beak.
const HEAD: Pt[] = [[-10, -22], [4, -27], [20, -31], [38, -32], [54, -28], [66, -20], [75, -10], [80, 0], [81, 6, "c"], [76, 11], [69, 13, "c"], [58, 13], [44, 16], [28, 20], [10, 22], [-10, 22]];
type TortoisePose = {head: number; fore: number; hind: number; look: number; f: number};
const tortoiseParts = (p: TortoisePose) => {
  const legK = (p.fore + p.hind) / 2, lift = 58 * (1 - ss(legK)), oy = -lift - 62;
  const shell = shellOutline(oy);
  // plastron and the skin of the openings between carapace and plastron
  const rimAt = (s: number) => [TA * s, oy - tRimY(s) * CE + tBw(s) * SE];
  const plastron = smooth([rimAt(0.86) as Pt, [TA * 0.84, -lift - 16], [TA * 0.78, -lift - 2], [TA * 0.3, -lift], [-TA * 0.5, -lift], [-TA * 0.78, -lift - 3], [-TA * 0.86, -lift - 18], rimAt(-0.88) as Pt, rimAt(0) as Pt]);
  // neck and head: positions relative to the body, so they ride down with it
  const hk = ss(p.head), by = -lift;
  const nc = tw([[150, -30], [206, -30], [254, -40], [294, -58]], [[110, -40], [128, -40], [144, -41], [156, -42]], hk).map(([x, y]) => [x, y + by]);
  const neckPts = dense(nc, 8).map(([x, y], i, arr) => { const u = i / (arr.length - 1); return [x, y + 7 * Math.sin(Math.PI * u) * (1 - hk)]; });
  const wr = 7 + 10 * hk;   // the neck folds as it shortens
  const neck = band(neckPts, (u) => (64 - 16 * u) * (1 - 0.4 * hk) * (1 + 0.1 * Math.sin(Math.PI * u)) * (1 + 0.06 * Math.sin(u * Math.PI * wr)));
  const hb = nc[nc.length - 1], ang = lerp(0.06 + 0.06 * Math.sin(p.f / 32) * (1 - hk) + p.look, 0.05, hk);
  const ca = Math.cos(ang), sa = Math.sin(ang), hs = lerp(1.2, 0.9, hk);
  const head = smooth(HEAD.map(([x, y, c]) => { const q: any[] = [hb[0] + (x * ca - y * sa) * hs, hb[1] + (x * sa + y * ca) * hs]; if (c) q.push(c); return q as Pt; }));
  const fk = ss(p.fore), kk = ss(p.hind);
  const fore = smooth(tw(FORE_OUT, FORE_IN, fk)), hind = smooth(tw(HIND_OUT, HIND_IN, kk));
  const foreFar = smooth(tw(FORE_OUT, FORE_IN, fk).map(([x, y, c]) => (c ? [x - 36, y - 8, c] : [x - 36, y - 8]) as Pt));
  const hindFar = smooth(tw(HIND_OUT, HIND_IN, kk).map(([x, y, c]) => (c ? [x + 34, y - 8, c] : [x + 34, y - 8]) as Pt));
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
  // details: neck folds, scales on the forelimb, skin creases on the hind leg
  const folds: string[] = [];
  for (let k = 1; k <= 9; k++) { const u = (k / 10) * 0.94, i = Math.round(u * (neckPts.length - 1)), c = neckPts[i], nn = nrmAt(neckPts, i), w = ((64 - 16 * u) * (1 + 0.1 * Math.sin(Math.PI * u))) / 2;
    const top = k % 2 === 1, a0 = top ? 0.95 : -0.15, a1 = top ? 0.2 : -0.9;   // folds alternate along the upper and lower skin
    folds.push(`M ${n1(c[0] + nn[0] * w * a0)} ${n1(c[1] + nn[1] * w * a0)} Q ${n1(c[0] + 6 + nn[0] * w * (a0 + a1) / 2)} ${n1(c[1] + nn[1] * w * (a0 + a1) / 2)} ${n1(c[0] + 2 + nn[0] * w * a1)} ${n1(c[1] + nn[1] * w * a1)}`); }
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
  const det = useMemo(() => shellDetail(T.oy), [Math.round(T.oy * 4)]);
  const top = T.oy - TC - 30;
  return (
    <g transform={`translate(${x} ${y}) scale(${-sc} ${sc})`}>
      <defs>
        <clipPath id={`${id}-sh`}><path d={T.shellD}/></clipPath>
        <clipPath id={`${id}-out`}><path d={`M -600 -600 L 600 -600 L 600 200 L -600 200 Z ${T.shellD}`} clipRule="evenodd"/></clipPath>
        <linearGradient id={`${id}-dl`} gradientUnits="userSpaceOnUse" x1={TA} y1={top} x2={-TA * 0.6} y2={0}><stop offset="0" stopColor="#FFE2A8" stopOpacity={0.75}/><stop offset="0.5" stopColor="#E9B57A" stopOpacity={0.32}/><stop offset="1" stopColor="#B8862F" stopOpacity={0.1}/></linearGradient>
        <radialGradient id={`${id}-sn`} gradientUnits="userSpaceOnUse" cx={TA * 0.55} cy={top + 40} r={260}><stop offset="0" stopColor="#FFD9A0" stopOpacity={0.3}/><stop offset="0.5" stopColor="#E9A070" stopOpacity={0.08}/><stop offset="1" stopColor="#E9A070" stopOpacity={0}/></radialGradient>
      </defs>
      <Rimmed paths={[T.foreFar, T.hindFar]} fill="#1E1428" light={light} w={2} rim="#B07A58"/>
      <Rimmed paths={[T.plastron, T.tail, T.hind, T.neck, T.head, T.fore, ...T.claws, T.shellD]} fill={K.sil} light={light} w={3.2}/>
      <g clipPath={`url(#${id}-sh)`}>
        <path d={T.shellD} fill={`url(#${id}-sn)`} opacity={glow}/>
        <path d={det.rings} fill="none" stroke={`url(#${id}-dl)`} strokeWidth={0.9} opacity={0.42}/>
        <path d={det.seams} fill="none" stroke={`url(#${id}-dl)`} strokeWidth={1.6}/>
      </g>
      <g clipPath={`url(#${id}-out)`} fill="none" stroke={`url(#${id}-dl)`} strokeLinecap="round">
        <path d={T.folds} strokeWidth={1.3} opacity={0.8 * Math.pow(1 - ss(pose.head), 1.5)}/>
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
  const bank = night ? ["#1A2244", "#2A3460"] : ["#3E2448", "#7A4258"];
  const pebbles = Array.from({length: 16}, (_, i) => [lerp(-20, 1940, rnd(i, 160)), 830 + Math.pow(rnd(i, 161), 1.2) * 220, 4 + rnd(i, 162) * 8]).filter(([x, y]) => Math.abs(x - TX) > 300 || y > 900);
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.07)} cx={TX - 80} cy={TY - 120}>
      <SkyW mood={mood} hor={HOR} sun={sun} sunR={night ? 30 : 52} f={f} id={id} stars={night ? 1 : 0.45}/>
      <Clouds f={f} mood={mood as Mood} op={0.55}/>
      <Flock f={f} light={[0, -1]} kind="stork" count={3} y={250} scale={0.26} seed={2}/>
      <defs>
        <linearGradient id={`${id}-bk`} gradientUnits="userSpaceOnUse" x1={0} y1={HOR - 120} x2={0} y2={HOR}><stop offset="0" stopColor={bank[0]}/><stop offset="1" stopColor={bank[1]}/></linearGradient>
        <linearGradient id={`${id}-sand`} gradientUnits="userSpaceOnUse" x1={0} y1={780} x2={0} y2={H}><stop offset="0" stopColor="#4A2A3C"/><stop offset="0.25" stopColor="#2A1828"/><stop offset="1" stopColor="#0E0812"/></linearGradient>
        <radialGradient id={`${id}-sg`} gradientUnits="userSpaceOnUse" cx={sun[0]} cy={800} r={1} gradientTransform={`translate(${sun[0]} 800) scale(760 150) translate(${-sun[0]} -800)`}><stop offset="0" stopColor="#F2A860" stopOpacity={0.4}/><stop offset="0.5" stopColor="#C2553A" stopOpacity={0.12}/><stop offset="1" stopColor="#C2553A" stopOpacity={0}/></radialGradient>
        <radialGradient id={`${id}-shadow`}><stop offset="0" stopColor="#05030A" stopOpacity={0.7}/><stop offset="1" stopColor="#05030A" stopOpacity={0}/></radialGradient>
        <linearGradient id={`${id}-hz`} gradientUnits="userSpaceOnUse" x1={0} y1={HOR - 50} x2={0} y2={HOR + 30}><stop offset="0" stopColor="#F0A06A" stopOpacity={0}/><stop offset="0.65" stopColor="#F0A06A" stopOpacity={0.4}/><stop offset="1" stopColor="#F0A06A" stopOpacity={0}/></linearGradient>
      </defs>
      {/* the far bank */}
      <path d={treeline(HOR, -60, 1980, 51, 10, 28, 7, 14)} fill={`url(#${id}-bk)`}/>
      <path d={[...broadTree(1520, HOR + 2, 120, 190, 4, f), ...broadTree(1700, HOR + 2, 90, 140, 8, f), ...palm(1380, HOR + 2, 150, 0.1, 0.9, f, 21), ...palm(1430, HOR + 2, 128, -0.06, 0.8, f, 22), ...palm(240, HOR + 2, 120, 0.12, 0.75, f, 23), ...broadTree(110, HOR + 2, 100, 160, 6, f)].join(" ")} fill={`url(#${id}-bk)`}/>
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
      {/* driftwood and grass at the edges */}
      <Rimmed paths={[band(dense([[1560, 930], [1660, 912], [1780, 906], [1900, 914], [1990, 908]], 6), (u) => 26 - 10 * u), band([[1690, 912], [1720, 880], [1736, 850]], (u) => 10 - 7 * u), band([[1820, 908], [1860, 884], [1880, 870]], (u) => 8 - 6 * u)]} fill="#120A16" light={[-0.6, -1]} w={2.2}/>
      <g>{Array.from({length: 22}, (_, i) => { const side = i < 12, x = side ? lerp(-20, 260, rnd(i, 180)) : lerp(1640, 1940, rnd(i, 180)), h = 60 + rnd(i, 181) * 110, l = (side ? 0.25 : -0.25) + (rnd(i, 182) - 0.5) * 0.4;
        return <path key={i} d={reedD(x, 1090, h + (side ? 120 : 60), l, 6 + rnd(i, 183) * 4, f, i)} fill="#0C0712"/>; })}</g>
      <Tortoise x={TX} y={TY} sc={1} pose={pose} light={[0.75, -1]} id={`${id}t`} glow={0.8 + 0.2 * Math.sin(f / 40)}/>
      <Dust f={f} sun={sun} n={60} y0={420} y1={900}/>
    </Frame>
  );
};

export const SCENES: Record<string, React.FC<SceneP>> = {ocean: Ocean, "lotus-leaf": LotusLeafScene, tortoise: TortoiseScene};
