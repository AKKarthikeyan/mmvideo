// GEO-04 Part 1, builder V3: shared parts for the underground and map scenes (strata, crystals, glow, leader lines, mantle).
// Everything is a smooth function of f (a fractional 30 fps logical frame at 60 fps) and of at(key) / dur.
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, rng} from "../kit";
import {prog, type Pt} from "./analogy_kit";

export const clampN = clamp;
export type Fn = (x: number) => number;

/** gradients and patterns shared by the V3 scenes (ids are prefixed v3) */
export const V3Defs: React.FC = () => (
  <defs>
    <pattern id="v3-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="0.9" fill="#2a1a0c" opacity="0.28"/><circle cx="6.5" cy="6" r="0.7" fill="#fff" opacity="0.22"/></pattern>
    <linearGradient id="v3-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fbfe2"/><stop offset="0.75" stopColor="#d3e5e6"/><stop offset="1" stopColor="#f6e9c9"/></linearGradient>
    <linearGradient id="v3-mantle" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b8643a"/><stop offset="0.5" stopColor="#9c4528"/><stop offset="1" stopColor="#6b2a1a"/></linearGradient>
    <radialGradient id="v3-lava" cx="50%" cy="50%" r="55%"><stop offset="0" stopColor="#fff2b0"/><stop offset="0.35" stopColor="#ffb13c"/><stop offset="0.75" stopColor="#e3481a"/><stop offset="1" stopColor="#b02a10"/></radialGradient>
    <radialGradient id="v3-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ffd070" stopOpacity="0.9"/><stop offset="0.45" stopColor="#ff8a30" stopOpacity="0.4"/><stop offset="1" stopColor="#ff6a20" stopOpacity="0"/></radialGradient>
    <filter id="v3-b4" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
    <filter id="v3-b14" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="14"/></filter>
  </defs>
);

/** SVG path along a function of x */
export const trace = (fn: Fn, a: number, b: number, step = 20): string => {
  let d = "";
  for (let x = a; x < b + step * 0.5; x += step) { const xx = Math.min(x, b); d += `${d ? "L" : "M"}${xx.toFixed(1)} ${fn(xx).toFixed(1)}`; }
  return d;
};
/** closed path between a top and a bottom function */
export const band = (top: Fn, bot: Fn, a: number, b: number, step = 20): string => {
  let d = trace(top, a, b, step);
  for (let x = b; x > a - step * 0.5; x -= step) { const xx = Math.max(x, a); d += `L${xx.toFixed(1)} ${bot(xx).toFixed(1)}`; }
  return d + "Z";
};

export type Strat = {top: string; bot: string; line: string};
export const STRATA: Strat[] = [
  {top: "#ecd39a", bot: "#d5b070", line: "#a77f45"},
  {top: "#d6a265", bot: "#bb8049", line: "#8a5a2a"},
  {top: "#b4bda0", bot: "#939f88", line: "#66725c"},
  {top: "#cf7a58", bot: "#ad5a36", line: "#7e3b20"},
  {top: "#d3dad4", bot: "#adb9bb", line: "#7f8f93"},
  {top: "#94826f", bot: "#756455", line: "#4e4036"},
];

/** layered sedimentary bands. `edges[i]` is the top of band i, `edges[i+1]` its bottom; the last band runs to `floor`. Texture lines follow the bedding. */
export const Strata: React.FC<{edges: Fn[]; floor: Fn; a: number; b: number; id: string; step?: number}> = ({edges, floor, a, b, id, step = 20}) => (
  <g>
    {edges.map((top, i) => {
      const bot = i + 1 < edges.length ? edges[i + 1] : floor, c = STRATA[i % STRATA.length];
      return (
        <g key={i}>
          <defs><linearGradient id={`${id}-s${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.top}/><stop offset="1" stopColor={c.bot}/></linearGradient></defs>
          <path d={band(top, bot, a, b, step)} fill={`url(#${id}-s${i})`}/>
          <path d={band(top, bot, a, b, step)} fill="url(#v3-dots)" opacity={0.7}/>
          {[0.3, 0.62].map((u, k) => <path key={k} d={trace((x) => top(x) + (bot(x) - top(x)) * u, a, b, step)} fill="none" stroke={c.line} strokeWidth={1.1} opacity={0.3} strokeDasharray={k ? "22 9" : "46 12 6 12"}/>)}
          <path d={trace(top, a, b, step)} fill="none" stroke={c.line} strokeWidth={1.6} opacity={0.65}/>
        </g>
      );
    })}
  </g>
);

/** jittered crystal cells inside a box, as polygons (deterministic) */
export type Cell = {d: string; fill: string; cx: number; cy: number};
export const crystalCells = (x0: number, y0: number, x1: number, y1: number, cell: number, seed: number, pal: string[]): Cell[] => {
  const r = rng(seed * 313 + 7), out: Cell[] = [];
  for (let y = y0 - cell; y < y1 + cell; y += cell * 0.86) {
    const row = Math.round((y - y0) / (cell * 0.86));
    for (let x = x0 - cell; x < x1 + cell; x += cell) {
      const cx = x + (row % 2 ? cell / 2 : 0) + (r() - 0.5) * cell * 0.5, cy = y + (r() - 0.5) * cell * 0.45, n = 5 + Math.floor(r() * 3), rad = cell * (0.46 + r() * 0.2), rot = r() * 6.28;
      let d = "";
      for (let k = 0; k < n; k++) { const a = rot + (k / n) * 6.283 + (r() - 0.5) * 0.4, rr = rad * (0.78 + r() * 0.3); d += `${k ? "L" : "M"}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr * 0.86).toFixed(1)}`; }
      out.push({d: d + "Z", fill: pal[Math.floor(r() * pal.length)], cx, cy});
    }
  }
  return out;
};
export const GRANITE = ["#e9d6cb", "#c99f92", "#f4eee8", "#dcc2b4", "#6a5f64", "#b78a7d", "#f0e2d6"];
export const BASALT = ["#4a4a54", "#3a3a45", "#55555f", "#2f2f3a", "#62626b"];

/** a granite-like (coarse crystal) body clipped to `path` */
export const GraniteFill: React.FC<{path: string; id: string; box: [number, number, number, number]; cell?: number; seed?: number; outline?: boolean}> = ({path, id, box, cell = 30, seed = 3, outline = true}) => {
  const cells = React.useMemo(() => crystalCells(box[0], box[1], box[2], box[3], cell, seed, GRANITE), [box[0], box[1], box[2], box[3], cell, seed]);
  return (
    <g>
      <defs><clipPath id={`${id}-gc`}><path d={path}/></clipPath></defs>
      <path d={path} fill="#d4b1a3"/>
      <g clipPath={`url(#${id}-gc)`}>
        {cells.map((c, i) => <path key={i} d={c.d} fill={c.fill} stroke="#8c6a62" strokeWidth={0.8} opacity={0.96}/>)}
        <path d={path} fill="none" stroke="#6a4a44" strokeWidth={14} opacity={0.25}/>
      </g>
      {outline && <path d={path} fill="none" stroke="#7a5650" strokeWidth={2.2}/>}
    </g>
  );
};

/** soft pulsing glow around a path */
export const PathGlow: React.FC<{d: string; a: number; f: number; w?: number; col?: string}> = ({d, a, f, w = 10, col = "#ffb347"}) => {
  if (a <= 0.01) return null;
  const pulse = 0.75 + 0.25 * Math.sin(f / 5);
  return (
    <g opacity={a * pulse}>
      <path d={d} fill="none" stroke={col} strokeWidth={w + 12} strokeLinejoin="round" opacity={0.55} filter="url(#v3-b14)"/>
      <path d={d} fill="none" stroke="#fff3c0" strokeWidth={w * 0.4} strokeLinejoin="round" opacity={0.95}/>
      <path d={d} fill="none" stroke={col} strokeWidth={w * 0.7} strokeLinejoin="round" opacity={0.9} strokeDasharray="1 0"/>
    </g>
  );
};

/** a dotted leader from a point to the underside of a label card */
export const Leader: React.FC<{from: Pt; to: Pt; a: number; col?: string}> = ({from, to, a, col = "#5e2a0e"}) => {
  if (a <= 0.01) return null;
  const e: Pt = [from[0] + (to[0] - from[0]) * a, from[1] + (to[1] - from[1]) * a];
  return (
    <g opacity={Math.min(1, a * 1.6)}>
      <line x1={from[0]} y1={from[1]} x2={e[0]} y2={e[1]} stroke="#fffaf0" strokeWidth={6} strokeLinecap="round" opacity={0.7}/>
      <line x1={from[0]} y1={from[1]} x2={e[0]} y2={e[1]} stroke={col} strokeWidth={3} strokeLinecap="round" strokeDasharray="2 9"/>
      <circle cx={to[0]} cy={to[1]} r={9} fill="#fffaf0" stroke={col} strokeWidth={3} opacity={a}/>
    </g>
  );
};

/** sky behind a ground cut-away */
export const Sky: React.FC<{h: number; f: number; sun?: [number, number]; haze?: boolean}> = ({h, f, sun = [1640, 190], haze = true}) => (
  <g>
    <rect x={-60} y={-60} width={W + 120} height={h + 60} fill="url(#v3-sky)"/>
    <circle cx={sun[0]} cy={sun[1]} r={190} fill="url(#ak-sunglow)" opacity={0.75}/>
    <circle cx={sun[0]} cy={sun[1]} r={50} fill="url(#ak-sundisc)"/>
    {[0, 1, 2].map((i) => {
      const x = ((i * 700 + f * 0.25 + 100) % 2300) - 250, y = 110 + (i % 2) * 70;
      return <g key={i} transform={`translate(${x} ${y})`} opacity={0.8}>{[[-60, 6, 38], [-12, -10, 52], [44, 4, 42], [90, 12, 28]].map((c, k) => <circle key={k} cx={c[0]} cy={c[1]} r={c[2]} fill="url(#ak-cloud)"/>)}</g>;
    })}
    {haze && <rect x={-60} y={h - 130} width={W + 120} height={130} fill="#fff6e0" opacity={0.18}/>}
  </g>
);

/** a lava / magma blob field rising inside a tube path region (positions by f) */
export const Rise: React.FC<{x0: number; y0: number; x1: number; y1: number; f: number; n?: number; r?: number; seed?: number; a?: number}> = ({x0, y0, x1, y1, f, n = 6, r = 10, seed = 1, a = 1}) => (
  <g opacity={a}>
    {Array.from({length: n}).map((_, i) => {
      const u = (f * 0.006 + i / n + seed * 0.13) % 1, x = x0 + (x1 - x0) * u + Math.sin(u * 9 + i) * 6, y = y0 + (y1 - y0) * u, s = r * (0.7 + 0.5 * Math.sin(i * 2.3));
      return <g key={i} opacity={Math.min(1, u * 6, (1 - u) * 6)}><circle cx={x} cy={y} r={s * 2.4} fill="url(#v3-glow)"/><circle cx={x} cy={y} r={s} fill="url(#v3-lava)"/></g>;
    })}
  </g>
);

export const Txt: React.FC<{x: number; y: number; t: string; a: number; size?: number; fill?: string; anchor?: "start" | "middle" | "end"; serif?: boolean}> = ({x, y, t, a, size = 24, fill = "#fff", anchor = "middle", serif}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={serif ? SERIF : SANS} fontWeight={700} fontSize={size} letterSpacing="0.1em" fill={fill} opacity={a}
    style={{paintOrder: "stroke", stroke: "rgba(30,16,6,.55)", strokeWidth: 4, strokeLinejoin: "round"}}>{t}</text>
);

export const seg = (f: number, a: number, d: number) => eo(prog(f, a, d));
export {prog, eo, H, W};
