// Shared parts for the Part 2 analogy scenes (builder A1): label reading ({text,key} or {lab,key}), sky, anchored cloud puffs, rain streaks.
import React from "react";
import {lab as labText} from "../../cartoon/long/figs";
import {SERIF, W, H, clamp, eo, rng} from "../kit";
import {prog, type AP} from "./analogy_kit";

export type Item = {text: string; at: number; key: string; isLab: boolean};
/** every label of the spec as {text, at}: `{text,key}` prints as given, `{lab,key}` prints lab(lab) */
export const items = (p: AP): Item[] =>
  ((p.spec.labels ?? []) as any[]).map((l) => ({text: l.lab ? labText(l.lab) : String(l.text ?? ""), at: p.at(l.key), key: l.key, isLab: !!l.lab}));

export const Sky: React.FC<{id: string; a: string; b: string; h?: number; x?: number; w?: number}> = ({id, a, b, h = H, x = -60, w = W + 120}) => (
  <g><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a}/><stop offset="1" stopColor={b}/></linearGradient></defs><rect x={x} y={-60} width={w} height={h + 60} fill={`url(#${id})`}/></g>
);

/** a cloud anchored at x,y (no drift), puffs lit from the top left; `grow` 0..1 piles it up; `dark` makes a rain cloud */
export const Puff: React.FC<{x: number; y: number; s?: number; grow?: number; dark?: boolean; seed?: number; f?: number; a?: number}> = ({x, y, s = 1, grow = 1, dark = false, seed = 1, f = 0, a = 1}) => {
  if (grow <= 0.002) return null;
  const r = rng(seed * 131 + 7), n = 7;
  const puffs = Array.from({length: n}, (_, i) => ({cx: (i - (n - 1) / 2) * 44 + (r() - 0.5) * 16, cy: -Math.sin((i / (n - 1)) * Math.PI) * 38 + (r() - 0.5) * 14, rr: 40 + Math.sin((i / (n - 1)) * Math.PI) * 28 + r() * 10, k: r()}));
  const g = eo(grow), c1 = dark ? "#9aa6b8" : "#ffffff", c2 = dark ? "#5c6a82" : "#cdd8e6", c3 = dark ? "#3f4a60" : "#aebdd2";
  return (
    <g transform={`translate(${x} ${y + Math.sin(f / 31 + seed) * 3}) scale(${s * (0.45 + 0.55 * g)})`} opacity={a * clamp(grow * 3)}>
      <ellipse cx={0} cy={48} rx={190} ry={22} fill={c3} opacity={0.4} filter="url(#ak-blur8)"/>
      {puffs.map((q, i) => <circle key={`s${i}`} cx={q.cx + 6} cy={q.cy + 14} r={q.rr} fill={c3} opacity={0.55}/>)}
      {puffs.map((q, i) => <circle key={`m${i}`} cx={q.cx} cy={q.cy} r={q.rr} fill={`url(#${dark ? "ak-cloudD" : "ak-cloud"})`} stroke={dark ? "rgba(40,50,72,.45)" : "rgba(120,150,190,.28)"} strokeWidth={1.2}/>)}
      {puffs.map((q, i) => <circle key={`h${i}`} cx={q.cx - q.rr * 0.25} cy={q.cy - q.rr * 0.28} r={q.rr * 0.5} fill={c1} opacity={dark ? 0.28 : 0.55}/>)}
      <defs><radialGradient id="ak-cloudD" cx="42%" cy="35%" r="70%"><stop offset="0" stopColor={c1}/><stop offset="0.6" stopColor={c2}/><stop offset="1" stopColor={c3}/></radialGradient></defs>
    </g>
  );
};

/** slanted rain streaks falling between a ceiling and a floor function; p 0..1 sets how many are drawn */
export const Rain: React.FC<{x0: number; x1: number; top: number | ((x: number) => number); bottom: number | ((x: number) => number); f: number; n?: number; seed?: number; col?: string; p?: number; slant?: number; sp?: number; w?: number}> =
  ({x0, x1, top, bottom, f, n = 26, seed = 3, col = "#dff0fb", p = 1, slant = 14, sp = 1, w = 2.6}) => {
  const r = rng(seed * 71 + 3), fy = (v: number | ((x: number) => number), x: number) => (typeof v === "function" ? v(x) : v);
  const out: React.ReactNode[] = [];
  const cnt = Math.round(n * clamp(p));
  for (let i = 0; i < cnt; i++) {
    const x = x0 + r() * (x1 - x0), ph = r(), len = 26 + r() * 22, yt = fy(top, x), yb = fy(bottom, x), span = Math.max(10, yb - yt);
    const u = (f * 0.021 * sp + ph) % 1, y = yt + u * span, a = Math.min(1, u * 6, (1 - u) * 4);
    if (y + len * 0.5 > yb) continue;
    out.push(<line key={i} x1={x + slant * 0.3 * u} y1={y} x2={x + slant * 0.3 * u - slant * 0.5} y2={y + len} stroke={col} strokeWidth={w} strokeLinecap="round" opacity={0.82 * a}/>);
  }
  return <g>{out}</g>;
};

/** soft ground shadow + helper to read text widths loosely */
export const approxW = (t: string, size: number) => t.length * size * 0.52;
export const fadeIn = (f: number, at: number, d = 14) => eo(prog(f, at, d));
export const SerifTxt: React.FC<{x: number; y: number; size: number; fill: string; weight?: number; anchor?: "start" | "middle" | "end"; children: React.ReactNode; op?: number; ls?: number}> =
  ({x, y, size, fill, weight = 600, anchor = "start", children, op = 1, ls = 0}) => (
    <text x={x} y={y} fontFamily={SERIF} fontWeight={weight} fontSize={size} fill={fill} textAnchor={anchor} opacity={op} letterSpacing={ls}>{children}</text>
  );
