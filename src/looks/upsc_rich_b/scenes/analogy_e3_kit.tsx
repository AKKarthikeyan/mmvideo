// Shared parts for the ECO-16 Part 1 analogy scenes of builder E3 (split-bar, plan-path, press-mint, fiat-note, promise-note, deposit-money,
// m-measures, m3-bar, base-tower, paise-bar, part2-seam): label lookup, a generic banknote, a generic coin, a classical building, braces, small props.
// Everything is a smooth function of f. No real currency, emblem or logo is copied: notes are plain coloured rectangles with a border and a portrait-free oval.
import React from "react";
import {SANS, SERIF, W, H, eo} from "../kit";
import {lab as labQ} from "../../cartoon/long/figs";
import type {AP} from "./analogy_kit";

export type LI = {text?: string; lab?: string; key: string};
export type EL = {text: string; at: number; key: string};

/** every spec label by key: `{lab,key}` prints lab(lab), `{text,key}` prints the text as given; `at` is the reveal frame of the key.
 *  A key without a reveal in the timeline (the storyboard may list a label whose word was not found) falls back to `fallback[key]` when given, else throws like at(). */
export const elabs = (p: AP, fallback: Record<string, () => number> = {}): Record<string, EL> => {
  const out: Record<string, EL> = {};
  for (const l of ((p.spec as any).labels ?? []) as LI[]) {
    let at: number;
    try { at = p.at(l.key); } catch (e) { if (fallback[l.key]) at = fallback[l.key](); else throw e; }
    out[l.key] = {text: l.lab ? labQ(l.lab) : l.text ?? "", at, key: l.key};
  }
  return out;
};

export const Defs: React.FC = () => (
  <defs>
    <filter id="e3-sh" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#1c1006" floodOpacity="0.38"/></filter>
    <filter id="e3-sh-s" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#1c1006" floodOpacity="0.4"/></filter>
    <filter id="e3-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="e3-glow-s" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
);

/** a plain five-point star path, radius r */
export const starPath = (r: number, ri = r * 0.42) => Array.from({length: 10}, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? ri : r; return `${i ? "L" : "M"}${(Math.cos(a) * rr).toFixed(2)},${(Math.sin(a) * rr).toFixed(2)}`; }).join(" ") + "Z";

// ---- a generic banknote --------------------------------------------------------------------------------------------------------
const TONES: Record<string, [string, string, string, string]> = {
  teal: ["#4fa89c", "#2a6f78", "#a8e0d2", "#e58a3c"],
  violet: ["#8c78b8", "#4e3f86", "#cfc2ee", "#e0a53a"],
  olive: ["#a2a968", "#5f6b38", "#dfe2a8", "#c8573a"],
  blue: ["#5f93c4", "#2c5a8a", "#bcdcf6", "#ee8c3a"],
};

/** A plain generic banknote centred on the origin, size w x h: gradient, wavy guilloche lines, double border, portrait-free oval with a plain star, security thread, the word RUPEES.
 *  `sat` (0..1) drains its colour; `id` must be unique per use on the page. */
export const Note: React.FC<{id: string; w: number; h: number; tone?: keyof typeof TONES; sat?: number; f?: number; shadow?: boolean; strip?: React.ReactNode; gloss?: number}> =
  ({id, w, h, tone = "teal", sat = 1, f = 0, shadow = true, strip, gloss = 1}) => {
  const [c1, c2, lt, ac] = TONES[tone], r = h * 0.09, x0 = -w / 2, y0 = -h / 2;
  const waves = Array.from({length: 9}, (_, i) => {
    const yy = y0 + h * (0.1 + i * 0.1), ph = i * 0.8;
    return `M${x0},${yy} ` + Array.from({length: 17}, (_, k) => `L${(x0 + (k / 16) * w).toFixed(1)},${(yy + Math.sin(k * 0.9 + ph) * h * 0.035).toFixed(1)}`).join(" ");
  });
  return (
    <g filter={shadow ? "url(#e3-sh)" : undefined}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={c1}/><stop offset="1" stopColor={c2}/></linearGradient>
        <clipPath id={`${id}-c`}><rect x={x0} y={y0} width={w} height={h} rx={r}/></clipPath>
        <filter id={`${id}-s`}><feColorMatrix type="saturate" values={String(Math.max(0, Math.min(1, sat)))}/></filter>
        <linearGradient id={`${id}-gl`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0"/><stop offset="0.5" stopColor="#fff" stopOpacity="0.42"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
      </defs>
      <g filter={sat < 0.999 ? `url(#${id}-s)` : undefined}>
        <rect x={x0} y={y0} width={w} height={h} rx={r} fill={`url(#${id}-g)`} stroke={c2} strokeWidth={2}/>
        <g clipPath={`url(#${id}-c)`}>
          {waves.map((d, i) => <path key={i} d={d} fill="none" stroke={lt} strokeWidth={1.3} opacity={0.34}/>)}
          {Array.from({length: 5}, (_, i) => <ellipse key={i} cx={w * 0.2} cy={0} rx={h * (0.12 + i * 0.06)} ry={h * (0.12 + i * 0.06)} fill="none" stroke={lt} strokeWidth={1.1} opacity={0.3} transform={`translate(${x0 + w * 0.5 - w * 0.2 + w * 0.2 - w * 0.5} 0)`}/>)}
          <rect x={x0 + w * 0.6} y={y0} width={w * 0.4} height={h} fill={ac} opacity={0.22}/>
          <rect x={x0 + w * 0.585} y={y0} width={w * 0.012} height={h} fill="#e9eef2" opacity={0.85}/>
          <rect x={x0 + w * 0.585} y={y0} width={w * 0.012} height={h} fill="none" stroke="#6b7a86" strokeWidth={0.6} strokeDasharray="3 4" opacity={0.6}/>
        </g>
        <rect x={x0 + w * 0.03} y={y0 + h * 0.06} width={w * 0.94} height={h * 0.88} rx={r * 0.6} fill="none" stroke={lt} strokeWidth={2.2} opacity={0.75}/>
        <rect x={x0 + w * 0.045} y={y0 + h * 0.1} width={w * 0.91} height={h * 0.8} rx={r * 0.5} fill="none" stroke={lt} strokeWidth={0.9} opacity={0.5}/>
        {/* portrait-free oval, ringed, with a plain star */}
        <g transform={`translate(${x0 + w * 0.3} 0)`}>
          <ellipse rx={w * 0.14} ry={h * 0.34} fill={c2} opacity={0.5}/>
          <ellipse rx={w * 0.14} ry={h * 0.34} fill="none" stroke={lt} strokeWidth={2.4}/>
          <ellipse rx={w * 0.115} ry={h * 0.285} fill="none" stroke={lt} strokeWidth={1} opacity={0.7} strokeDasharray="2 3"/>
          <path d={starPath(Math.min(w * 0.075, h * 0.2))} fill={lt} opacity={0.92}/>
        </g>
        <text x={x0 + w * 0.78} y={y0 + h * 0.29} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={h * 0.095} letterSpacing={h * 0.014} fill="#fff7e4" opacity={0.92}>RUPEES</text>
        <rect x={x0 + w * 0.66} y={y0 + h * 0.4} width={w * 0.24} height={h * 0.035} rx={h * 0.012} fill="#fff7e4" opacity={0.55}/>
        <rect x={x0 + w * 0.66} y={y0 + h * 0.48} width={w * 0.17} height={h * 0.035} rx={h * 0.012} fill="#fff7e4" opacity={0.4}/>
        {[[0.1, 0.18], [0.1, 0.82], [0.9, 0.82]].map(([a, b], i) => <path key={i} d={`M${x0 + w * a},${y0 + h * b - h * 0.05} l${h * 0.05},${h * 0.05} l${-h * 0.05},${h * 0.05} l${-h * 0.05},${-h * 0.05} Z`} fill={lt} opacity={0.8}/>)}
        {strip}
        {gloss > 0 && <g clipPath={`url(#${id}-c)`} opacity={gloss}><rect x={x0 + ((f * 3.2) % (w * 2.2)) - w * 0.5 - w * 0.3} y={y0 - 4} width={w * 0.26} height={h + 8} fill={`url(#${id}-gl)`} transform={`skewX(-18)`}/></g>}
      </g>
    </g>
  );
};

// ---- a generic coin -------------------------------------------------------------------------------------------------------------
/** a gold disc with a rim, an inner ring and a plain star; centred on the origin */
export const Coin: React.FC<{id: string; r: number; rot?: number; shadow?: boolean; hue?: "gold" | "silver"}> = ({id, r, rot = 0, shadow = true, hue = "gold"}) => {
  const a = hue === "gold" ? ["#fff0b0", "#f2c14a", "#b9811a", "#8a5c10"] : ["#ffffff", "#dfe5ea", "#a4afb9", "#6c7884"];
  return (
    <g transform={`rotate(${rot})`} filter={shadow ? "url(#e3-sh-s)" : undefined}>
      <defs><radialGradient id={`${id}-cg`} cx="38%" cy="32%" r="80%"><stop offset="0" stopColor={a[0]}/><stop offset="0.45" stopColor={a[1]}/><stop offset="1" stopColor={a[2]}/></radialGradient></defs>
      <circle r={r} fill={`url(#${id}-cg)`} stroke={a[3]} strokeWidth={Math.max(1, r * 0.06)}/>
      <circle r={r * 0.82} fill="none" stroke={a[3]} strokeWidth={Math.max(0.8, r * 0.05)} opacity={0.7}/>
      <circle r={r * 0.92} fill="none" stroke="#fff" strokeWidth={Math.max(0.6, r * 0.03)} opacity={0.5} strokeDasharray={`${r * 0.08} ${r * 0.1}`}/>
      <path d={starPath(r * 0.46)} fill={a[2]} stroke={a[3]} strokeWidth={Math.max(0.6, r * 0.03)} opacity={0.9}/>
      <path d={`M${-r * 0.7},${-r * 0.35} A${r * 0.78},${r * 0.78} 0 0 1 ${r * 0.1},${-r * 0.76}`} fill="none" stroke="#fff" strokeWidth={r * 0.1} strokeLinecap="round" opacity={0.55}/>
    </g>
  );
};

/** a coin seen edge-on (a short cylinder), left edge at x, centre at y, thickness t, diameter d: for rows of coins lying down */
export const CoinEdge: React.FC<{x: number; y: number; t: number; d: number; hue?: "gold" | "silver"}> = ({x, y, t, d, hue = "gold"}) => {
  const c = hue === "gold" ? ["#f6d36a", "#c8921f", "#8a5c10"] : ["#f0f3f6", "#b9c3cc", "#6c7884"];
  return (
    <g>
      <rect x={x} y={y - d / 2} width={t} height={d} rx={t * 0.3} fill={c[1]} stroke={c[2]} strokeWidth={1.1}/>
      <rect x={x + t * 0.12} y={y - d / 2 + d * 0.06} width={t * 0.28} height={d * 0.88} rx={t * 0.1} fill={c[0]} opacity={0.8}/>
      <path d={`M${x + 1},${y - d * 0.28} h${t - 2} M${x + 1},${y + d * 0.28} h${t - 2}`} stroke={c[2]} strokeWidth={0.8} opacity={0.6}/>
    </g>
  );
};

// ---- a classical bank facade ----------------------------------------------------------------------------------------------------
/** A plain classical building with its base centred on x, standing on y: pediment, frieze with `text`, columns, steps. No logo. */
export const Classical: React.FC<{x: number; y: number; w: number; h: number; text: string; id: string; stone?: [string, string]; cols?: number; a?: number; glow?: number; textSize?: number; fri?: number}> =
  ({x, y, w, h, text, id, stone = ["#efe3c8", "#cdb890"], cols = 6, a = 1, glow = 0, textSize, fri = 0.12}) => {
  const stepH = h * 0.09, pedH = h * 0.22, friH = h * fri, colH = h - stepH - pedH - friH - h * 0.03, x0 = x - w / 2, bw = w * 0.9, bx = x - bw / 2, yb = y - stepH;
  const colW = bw / (cols * 2 - 1) * 0.9, gap = (bw - colW) / (cols - 1);
  const ts = textSize ?? Math.min(friH * 0.6, (bw * 0.92) / (Math.max(1, text.length) * 0.74));
  return (
    <g opacity={a}>
      <defs>
        <linearGradient id={`${id}-st`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={stone[0]}/><stop offset="1" stopColor={stone[1]}/></linearGradient>
        <linearGradient id={`${id}-co`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={stone[0]}/><stop offset="0.5" stopColor="#fffaf0"/><stop offset="1" stopColor={stone[1]}/></linearGradient>
      </defs>
      {glow > 0 && <ellipse cx={x} cy={y - h * 0.5} rx={w * 0.75} ry={h * 0.7} fill="url(#ak-sunglow)" opacity={glow}/>}
      <ellipse cx={x + w * 0.08} cy={y + 4} rx={w * 0.58} ry={h * 0.035} fill="#2a1808" opacity={0.26}/>
      {[0, 1, 2].map((i) => <rect key={i} x={x0 + w * 0.02 * (2 - i) - w * 0.02} y={y - stepH * (i + 1) / 3} width={w - w * 0.04 * (2 - i) + w * 0.04} height={stepH / 3} fill={`url(#${id}-st)`} stroke={stone[1]} strokeWidth={1}/>)}
      <rect x={bx} y={yb - colH - friH * 0.0} width={bw} height={colH + friH * 0.0} fill={stone[1]} opacity={0.5}/>
      <rect x={bx + bw * 0.04} y={yb - colH * 0.92} width={bw * 0.92} height={colH * 0.9} fill="#8e6b46" opacity={0.28}/>
      {Array.from({length: cols}, (_, i) => (
        <g key={i}>
          <rect x={bx + i * gap} y={yb - colH} width={colW} height={colH} fill={`url(#${id}-co)`} stroke={stone[1]} strokeWidth={1.2}/>
          {[0.3, 0.5, 0.7].map((u, k) => <path key={k} d={`M${bx + i * gap + colW * u},${yb - colH + 4} v${colH - 8}`} stroke={stone[1]} strokeWidth={0.8} opacity={0.5}/>)}
          <rect x={bx + i * gap - colW * 0.12} y={yb - colH} width={colW * 1.24} height={colH * 0.045} fill={stone[0]} stroke={stone[1]} strokeWidth={1}/>
          <rect x={bx + i * gap - colW * 0.12} y={yb - colH * 0.04} width={colW * 1.24} height={colH * 0.04} fill={stone[0]} stroke={stone[1]} strokeWidth={1}/>
        </g>
      ))}
      <rect x={x0} y={yb - colH - friH} width={w} height={friH} fill={`url(#${id}-st)`} stroke={stone[1]} strokeWidth={1.4}/>
      <text x={x} y={yb - colH - friH / 2 + ts * 0.34} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={ts} letterSpacing={ts * 0.12} fill="#5a4426">{text}</text>
      <path d={`M${x0 - w * 0.01},${yb - colH - friH} L${x},${yb - colH - friH - pedH} L${x0 + w + w * 0.01},${yb - colH - friH} Z`} fill={`url(#${id}-st)`} stroke={stone[1]} strokeWidth={1.6}/>
      <path d={`M${x0 + w * 0.08},${yb - colH - friH - h * 0.012} L${x},${yb - colH - friH - pedH + h * 0.04} L${x0 + w * 0.92},${yb - colH - friH - h * 0.012} Z`} fill="none" stroke={stone[1]} strokeWidth={1} opacity={0.6}/>
      <circle cx={x} cy={yb - colH - friH - pedH * 0.42} r={pedH * 0.17} fill="none" stroke={stone[1]} strokeWidth={1.4} opacity={0.8}/>
      <path d={starPath(pedH * 0.11)} transform={`translate(${x} ${yb - colH - friH - pedH * 0.42})`} fill={stone[1]} opacity={0.7}/>
    </g>
  );
};

// ---- small props ----------------------------------------------------------------------------------------------------------------
/** a curly brace drawn from (x, y0) to (x, y1), bulging toward `dir` (-1 left, +1 right) */
export const Brace: React.FC<{x: number; y0: number; y1: number; dir: 1 | -1; c?: string; w?: number; p?: number; amp?: number}> = ({x, y0, y1, dir, c = "#5a3418", w = 5, p = 1, amp = 26}) => {
  if (p <= 0.002) return null;
  const m = (y0 + y1) / 2, a = amp * dir, d = `M${x},${y0} Q${x + a},${y0} ${x + a},${y0 + (m - y0) * 0.5} Q${x + a},${m - 12} ${x + a * 1.9},${m} Q${x + a},${m + 12} ${x + a},${m + (y1 - m) * 0.5} Q${x + a},${y1} ${x},${y1}`;
  const len = Math.abs(y1 - y0) * 1.5;
  return <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)}/>;
};

/** a plus sign with a brass body and a glow */
export const Plus: React.FC<{x: number; y: number; s: number; a?: number; f?: number}> = ({x, y, s, a = 1, f = 0}) => {
  if (a <= 0.001) return null;
  const k = 1 + Math.sin(f / 7) * 0.03;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k * (0.7 + 0.3 * a)})`} opacity={a}>
      <circle r={70} fill="url(#ak-sunglow)" opacity={0.8}/>
      <g filter="url(#e3-sh-s)"><path d="M-14,-52 h28 v38 h38 v28 h-38 v38 h-28 v-38 h-38 v-28 h38 Z" fill="#e9b24c" stroke="#8a5c10" strokeWidth={3} strokeLinejoin="round"/>
        <path d="M-8,-46 h8 v34 h-8 Z M-46,-8 h34 v8 h-34 Z" fill="#fff0b0" opacity={0.7}/></g>
    </g>
  );
};

/** a pulsing question mark */
export const Quest: React.FC<{x: number; y: number; s?: number; a?: number; f: number; c?: string}> = ({x, y, s = 1, a = 1, f, c = "#d8682a"}) => {
  if (a <= 0.001) return null;
  const k = 1 + Math.sin(f / 6) * 0.07;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`} opacity={a}>
      <circle r={72} fill="url(#ak-sunglow)" opacity={0.7 + Math.sin(f / 6) * 0.2}/>
      <text y={34} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={104} fill={c} stroke="#5e2a0e" strokeWidth={2.2} paintOrder="stroke">?</text>
    </g>
  );
};

/** soft warm spotlight from above */
export const Spot: React.FC<{id: string; cx: number; cy: number; rx: number; ry: number; c?: string; a?: number}> = ({id, cx, cy, rx, ry, c = "#fff0c8", a = 0.5}) => (
  <g><defs><radialGradient id={id}><stop offset="0" stopColor={c} stopOpacity={a}/><stop offset="1" stopColor={c} stopOpacity="0"/></radialGradient></defs><ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id})`}/></g>
);

/** twinkling floating specks */
export const Specks: React.FC<{f: number; n?: number; seed?: number; c?: string; x0?: number; x1?: number; y0?: number; y1?: number}> = ({f, n = 28, seed = 3, c = "#ffe9b0", x0 = 0, x1 = W, y0 = 0, y1 = H}) => {
  const rr = (k: number) => { const v = Math.sin(k * 127.1 + seed * 311.7) * 43758.5453; return v - Math.floor(v); };
  return <g>{Array.from({length: n}, (_, i) => { const u = (f * (0.002 + rr(i + 9) * 0.004) + rr(i)) % 1, tw = 0.5 + 0.5 * Math.sin(f / (8 + rr(i + 4) * 8) + i);
    return <circle key={i} cx={x0 + rr(i + 1) * (x1 - x0) + Math.sin(u * 6 + i) * 10} cy={y1 - u * (y1 - y0)} r={1.4 + rr(i + 2) * 2.4} fill={c} opacity={0.5 * tw * Math.min(1, u * 6, (1 - u) * 4)}/>; })}</g>;
};

/** a wooden counter / table top from y0 down, with warm edge light */
export const Counter: React.FC<{id: string; y0: number; dark?: boolean}> = ({id, y0, dark}) => (
  <g>
    <defs><linearGradient id={`${id}-w`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={dark ? "#6a4a30" : "#cf9f66"}/><stop offset="1" stopColor={dark ? "#2c1a0e" : "#7a4a24"}/></linearGradient></defs>
    <rect x={-40} y={y0} width={W + 80} height={H - y0 + 80} fill={`url(#${id}-w)`}/>
    {Array.from({length: 7}, (_, i) => <path key={i} d={`M-40,${y0 + 26 + i * 30} Q960,${y0 + 18 + i * 30 + (i % 2) * 8} 1960,${y0 + 26 + i * 30}`} stroke={dark ? "#1c0e06" : "#6e4524"} strokeWidth={1.5} fill="none" opacity={0.45}/>)}
    <rect x={-40} y={y0 - 3} width={W + 80} height={7} fill="#f2d79c" opacity={0.8}/>
  </g>
);

/** a hanging paper/brass tag drawn in SVG (for small in-picture names that are part of the art, shown from `a`) */
export const Tag: React.FC<{x: number; y: number; text: string; a: number; size?: number; fill?: string; ink?: string; edge?: string}> = ({x, y, text, a, size = 26, fill = "#fff7e4", ink = "#5e2a0e", edge = "#b58a52"}) => {
  if (a <= 0.001) return null;
  const w = text.length * size * 0.62 + size * 1.6, h = size * 1.9;
  return (
    <g transform={`translate(${x} ${y - (1 - a) * 12})`} opacity={a} filter="url(#e3-sh-s)">
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h * 0.22} fill={fill} stroke={edge} strokeWidth={2}/>
      <text y={size * 0.34} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={size} letterSpacing={size * 0.12} fill={ink}>{text}</text>
    </g>
  );
};

/** a plaza in daylight: pale sky, hazy skyline, stone ground from y = ground */
export const Plaza: React.FC<{id: string; ground: number; f?: number}> = ({id, ground, f = 0}) => (
  <g>
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a9cde6"/><stop offset="0.65" stopColor="#e4eadc"/><stop offset="1" stopColor="#f8ead0"/></linearGradient>
      <linearGradient id={`${id}-gr`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e2cfa6"/><stop offset="1" stopColor="#b79c70"/></linearGradient>
    </defs>
    <rect x={-60} y={-60} width={W + 120} height={ground + 70} fill={`url(#${id}-sky)`}/>
    <circle cx={1540} cy={170} r={150} fill="url(#ak-sunglow)" opacity={0.8}/>
    {[0, 1, 2].map((i) => <g key={i} opacity={0.5}><ellipse cx={((f * 0.12 + i * 700) % 2300) - 200} cy={150 + (i % 2) * 90} rx={170} ry={34} fill="#fff"/><ellipse cx={((f * 0.12 + i * 700) % 2300) - 150} cy={132 + (i % 2) * 90} rx={110} ry={30} fill="#fff"/></g>)}
    {Array.from({length: 20}, (_, i) => { const hh = 120 + ((i * 53) % 130), x = i * 104 - 30; return <g key={i} opacity={0.55}><rect x={x} y={ground - 60 - hh} width={80} height={hh + 70} fill={i % 2 ? "#b9c9d8" : "#c6c4d2"}/>{Array.from({length: Math.floor(hh / 34)}, (_, k) => <rect key={k} x={x + 12} y={ground - 60 - hh + 14 + k * 34} width={56} height={8} fill="#e4edf5" opacity={0.7}/>)}</g>; })}
    <rect x={-60} y={ground} width={W + 120} height={H - ground + 80} fill={`url(#${id}-gr)`}/>
    <rect x={-60} y={ground} width={W + 120} height={7} fill="#f6e6c4"/>
    {Array.from({length: 8}, (_, i) => <path key={i} d={`M-60,${ground + 26 + i * i * 7} H${W + 60}`} stroke="#8e7452" strokeWidth={1.4} opacity={0.35}/>)}
    {Array.from({length: 15}, (_, i) => <path key={i} d={`M${-60 + i * 150},${ground} L${960 + (i - 7) * 330},${H + 80}`} stroke="#8e7452" strokeWidth={1.2} opacity={0.3}/>)}
  </g>
);

/** an upright glass balance bar (an account): liquid level 0..1 of h, base on y */
export const BalanceBar: React.FC<{id: string; x: number; y: number; w: number; h: number; level: number; f: number; tone?: "blue" | "green"; a?: number}> = ({id, x, y, w, h, level, f, tone = "blue", a = 1}) => {
  if (a <= 0.001) return null;
  const c = tone === "blue" ? ["#6cc4ee", "#1f6ea8", "#bfe7fa"] : ["#7fe0a8", "#1f8a58", "#c8f5dc"], wy = y - h * level;
  return (
    <g opacity={a}>
      <defs>
        <linearGradient id={`${id}-l`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c[0]}/><stop offset="1" stopColor={c[1]}/></linearGradient>
        <clipPath id={`${id}-k`}><rect x={x - w / 2 + 8} y={y - h + 8} width={w - 16} height={h - 16} rx={14}/></clipPath>
        <linearGradient id={`${id}-g`} x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.6"/><stop offset="0.25" stopColor="#fff" stopOpacity="0.05"/><stop offset="0.85" stopColor="#fff" stopOpacity="0.08"/><stop offset="1" stopColor="#fff" stopOpacity="0.4"/></linearGradient>
      </defs>
      <ellipse cx={x + 18} cy={y + 8} rx={w * 0.75} ry={18} fill="#2a1808" opacity={0.32} filter="url(#e3-glow-s)"/>
      <rect x={x - w / 2} y={y - h} width={w} height={h} rx={20} fill="#e6f1f5" opacity={0.45}/>
      <g clipPath={`url(#${id}-k)`}>
        <rect x={x - w / 2} y={wy} width={w} height={y - wy} fill={`url(#${id}-l)`}/>
        <path d={`M${x - w / 2},${wy} ${Array.from({length: 9}, (_, i) => `L${x - w / 2 + (i + 1) * (w / 8)},${wy + Math.sin(f / 9 + i * 1.3) * 3}`).join(" ")} L${x + w / 2},${wy - 9} L${x - w / 2},${wy - 9} Z`} fill={c[2]} opacity={0.8}/>
        {[0, 1, 2, 3, 4].map((i) => { const u = (f * 0.011 + i * 0.2) % 1; return <circle key={i} cx={x - w / 2 + 30 + ((i * 47) % (w - 60))} cy={y - 16 - u * Math.max(8, y - wy - 30)} r={3 + (i % 3) * 2} fill="#e9f8ff" opacity={0.5 * (1 - u)}/>; })}
        {/* stacked balance blocks inside */}
        {Array.from({length: 9}, (_, i) => <path key={i} d={`M${x - w / 2},${y - 22 - i * (h / 9)} H${x + w / 2}`} stroke="#fff" strokeWidth={1.6} opacity={0.2}/>)}
      </g>
      {Array.from({length: 10}, (_, i) => <path key={i} d={`M${x + w / 2 - 12},${y - 18 - i * ((h - 40) / 10)} h${i % 3 === 2 ? -34 : -20}`} stroke="#4d6d86" strokeWidth={i % 3 === 2 ? 3 : 2} opacity={0.6} strokeLinecap="round"/>)}
      <rect x={x - w / 2} y={y - h} width={w} height={h} rx={20} fill={`url(#${id}-g)`} stroke="#7da3ba" strokeWidth={5}/>
      <rect x={x - w / 2 + 14} y={y - h + 26} width={14} height={h - 70} rx={7} fill="#fff" opacity={0.5}/>
      <rect x={x - w / 2 - 14} y={y - 10} width={w + 28} height={22} rx={8} fill="#8a6a44" stroke="#4e361c" strokeWidth={2}/>
      <rect x={x - w / 2 - 6} y={y - h - 8} width={w + 12} height={16} rx={7} fill="#b8cfda" stroke="#7da3ba" strokeWidth={3}/>
    </g>
  );
};

/** An adult hand and forearm pinching something with thumb and index finger. (tipX, tipY) is where the two fingertips meet; `ang` (degrees, clockwise) points the fingers:
 *  0 = fingers point left (forearm comes in from the right), 90 = fingers point up (forearm comes up from below), -90 = fingers point down. `len` is the visible forearm length.
 *  Drawn as an outline layer plus a fill layer so the fingers merge into one clean silhouette. */
export const Hand: React.FC<{tipX: number; tipY: number; ang: number; len?: number; s?: number; skin?: [string, string]; sleeve?: [string, string]; op?: number; id: string}> =
  ({tipX, tipY, ang, len = 300, s = 1, skin = ["#d8a47a", "#a8754f"], sleeve = ["#6c8fb5", "#41607f"], op = 1, id}) => {
  // local frame: the pinch tip is the origin, fingers point -x from the palm, the forearm runs along +x
  const fing = [{x1: 66, y1: -30, x2: 6, y2: -9, w: 21}, {x1: 66, y1: 26, x2: 8, y2: 7, w: 24}] as const;
  const curled = [{cx: 58, cy: 16, r: 14}, {cx: 74, cy: 34, r: 14}, {cx: 92, cy: 44, r: 13}];
  const lines = (stroke: string, add: number, fill?: boolean) => (
    <>
      {fing.map((q, i) => <path key={i} d={`M${q.x1},${q.y1} L${q.x2},${q.y2}`} stroke={fill ? `url(#${id}-sk)` : stroke} strokeWidth={q.w + add} strokeLinecap="round" fill="none"/>)}
      {curled.map((c, i) => <circle key={i} cx={c.cx} cy={c.cy} r={c.r + add / 2} fill={fill ? `url(#${id}-sk)` : stroke}/>)}
      <ellipse cx={90} cy={-2} rx={44 + add / 2} ry={42 + add / 2} fill={fill ? `url(#${id}-sk)` : stroke}/>
      <path d={`M120,-34 L${len},-56 L${len},58 L120,38 Z`} fill={fill ? `url(#${id}-sk)` : stroke} stroke={fill ? "none" : stroke} strokeWidth={add}/>
    </>
  );
  return (
    <g transform={`translate(${tipX} ${tipY}) rotate(${ang}) scale(${s})`} opacity={op}>
      <defs>
        <linearGradient id={`${id}-sk`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={skin[0]}/><stop offset="1" stopColor={skin[1]}/></linearGradient>
        <linearGradient id={`${id}-sl`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sleeve[0]}/><stop offset="1" stopColor={sleeve[1]}/></linearGradient>
      </defs>
      <g filter="url(#e3-sh-s)">
        <g>
          {lines(skin[1], 4)}
          {lines("", 0, true)}
          <path d={`M150,-36 Q136,2 150,40 L${len},${58} L${len},-56 Z`} fill={`url(#${id}-sl)`} stroke={sleeve[1]} strokeWidth={2}/>
          <path d={`M150,-36 Q134,2 150,40`} fill="none" stroke={sleeve[1]} strokeWidth={4} strokeLinecap="round"/>
          <path d={`M160,-34 L${len},-52 L${len},-40 L160,-24 Z`} fill="#fff" opacity={0.16}/>
          {/* knuckle and finger creases, nails */}
          <path d="M40,-14 Q60,-26 84,-18 M40,16 Q62,28 84,20" stroke={skin[1]} strokeWidth={1.8} fill="none" opacity={0.55} strokeLinecap="round"/>
          <ellipse cx={12} cy={-10} rx={7} ry={4} fill="#fff" opacity={0.45} transform="rotate(-13 12 -10)"/>
          <ellipse cx={14} cy={8} rx={8} ry={4.4} fill="#fff" opacity={0.45} transform="rotate(14 14 8)"/>
        </g>
      </g>
    </g>
  );
};

export { eo };
