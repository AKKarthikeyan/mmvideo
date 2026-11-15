// GEO-04 Part 1, builder V2 (volcano types): shared drawing parts. Everything is a smooth function of f (fractional at 60 fps).
import React from "react";
import {W, H, clamp, eo, eio, rng} from "../kit";
import {prog} from "./analogy_kit";

export const ease = (f: number, a: number, d: number) => eio(prog(f, a, d));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export type XY = [number, number];

/** gradients for smoke, steam, lava, water; the same ids everywhere so duplicates are harmless */
export const V2Defs: React.FC = () => (
  <defs>
    <radialGradient id="v2-puffW" cx="46%" cy="42%" r="56%"><stop offset="0" stopColor="#ffffff"/><stop offset="0.55" stopColor="#f0f3f7"/><stop offset="1" stopColor="#c6d2e2" stopOpacity="0"/></radialGradient>
    <radialGradient id="v2-puffG" cx="46%" cy="42%" r="56%"><stop offset="0" stopColor="#c9c4be"/><stop offset="0.5" stopColor="#9d9792"/><stop offset="1" stopColor="#6f6a68" stopOpacity="0.05"/></radialGradient>
    <radialGradient id="v2-puffD" cx="46%" cy="42%" r="56%"><stop offset="0" stopColor="#6d6560"/><stop offset="0.5" stopColor="#47403d"/><stop offset="1" stopColor="#2a2524" stopOpacity="0.05"/></radialGradient>
    <radialGradient id="v2-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#fff0b0" stopOpacity="0.95"/><stop offset="0.3" stopColor="#ffb040" stopOpacity="0.6"/><stop offset="0.7" stopColor="#ff5a1c" stopOpacity="0.22"/><stop offset="1" stopColor="#ff3a10" stopOpacity="0"/></radialGradient>
    <linearGradient id="v2-lavaV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe08a"/><stop offset="0.45" stopColor="#ff8a2a"/><stop offset="1" stopColor="#c8300f"/></linearGradient>
    <filter id="v2-blur4" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4"/></filter>
    <filter id="v2-blur12" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12"/></filter>
  </defs>
);

export const curve = (fn: (x: number) => number, x0: number, x1: number, step = 12): XY[] => {
  const o: XY[] = [];
  for (let x = x0; x < x1 + step * 0.01; x += step) o.push([x, fn(Math.min(x, x1))]);
  return o;
};
export const pts = (a: XY[]) => a.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
export const under = (fn: (x: number) => number, x0: number, x1: number, yb: number, step = 12) => `${pts(curve(fn, x0, x1, step))} L${x1},${yb} L${x0},${yb} Z`;
export const bandPath = (a: (x: number) => number, b: (x: number) => number, x0: number, x1: number, step = 12) => {
  const A = curve(a, x0, x1, step), B = curve(b, x0, x1, step).reverse();
  return `${pts(A)} ${B.map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")} Z`;
};

/** a rising smoke / steam / ash column of soft puffs */
export const Plume: React.FC<{x: number; y: number; f: number; n?: number; rise: number; drift?: number; r0: number; r1: number; kind?: "W" | "G" | "D"; period?: number; a?: number; seed?: number; start?: number; sway?: number; grow?: number}> =
  ({x, y, f, n = 14, rise, drift = 0, r0, r1, kind = "W", period = 90, a = 1, seed = 1, start = 0, sway = 10, grow = 1}) => {
  const g = eo(prog(f, start, 24)) * a;
  if (g <= 0.01) return null;
  const rnd = rng(seed * 131 + 17), t = Math.max(0, f - start);
  const items = Array.from({length: n}, (_, i) => {
    const jx = (rnd() - 0.5) * r0 * 1.4, ph = rnd() * 6.28, u = (t / period + i / n) % 1;
    return {u, i, jx, ph};
  }).sort((p, q) => q.u - p.u);
  return (
    <g>
      {items.map(({u, i, jx, ph}) => {
        const r = mix(r0, r1, Math.sqrt(u)) * grow, op = g * clamp(u * 7) * Math.pow(1 - u, 1.15);
        const px = x + jx * (1 - u * 0.4) + drift * Math.pow(u, 1.25) + sway * Math.sin(u * 5 + ph), py = y - rise * Math.pow(u, 0.82);
        return <circle key={i} cx={px} cy={py} r={r} fill={`url(#v2-puff${kind})`} opacity={op}/>;
      })}
    </g>
  );
};

/** ballistic lumps (bombs, cinders): each follows a parabola from (x, y) */
export const Ballistic: React.FC<{x: number; y: number; f: number; n?: number; vx: number; vy: number; g?: number; period?: number; color?: string; r?: number; seed?: number; start?: number; glow?: boolean; a?: number}> =
  ({x, y, f, n = 8, vx, vy, g = 2.2, period = 60, color = "#2c2523", r = 6, seed = 1, start = 0, glow = true, a = 1}) => {
  const k = eo(prog(f, start, 10)) * a;
  if (k <= 0.01) return null;
  const rnd = rng(seed * 71 + 3), t = Math.max(0, f - start);
  return (
    <g>
      {Array.from({length: n}, (_, i) => {
        const sx = (rnd() * 2 - 1) * vx, sy = vy * (0.55 + rnd() * 0.6), rr = r * (0.6 + rnd() * 0.8), u = (t / period + i / n) % 1, T = u * period * 0.5;
        const px = x + sx * T * 0.1, py = y - sy * T * 0.1 + g * T * T * 0.02 * 1.0;
        const hot = glow ? clamp(1 - u * 1.6) : 0;
        return (
          <g key={i} opacity={k * clamp((1 - u) * 6)}>
            {hot > 0.02 && <circle cx={px} cy={py} r={rr * 3.2} fill="url(#v2-glow)" opacity={hot}/>}
            <circle cx={px} cy={py} r={rr} fill={color}/>
            {hot > 0.02 && <circle cx={px} cy={py} r={rr * 0.6} fill="#ffb040" opacity={hot}/>}
          </g>
        );
      })}
    </g>
  );
};

export const Glow: React.FC<{x: number; y: number; r: number; a?: number}> = ({x, y, r, a = 1}) => (
  <circle cx={x} cy={y} r={r} fill="url(#v2-glow)" opacity={a}/>
);

/** soft daylight sky with horizon haze */
export const SkyBox: React.FC<{id: string; top?: string; mid?: string; bot?: string; y0?: number; y1?: number}> = ({id, top = "#6aa7d8", mid = "#b9d8e6", bot = "#f6e6c4", y0 = -60, y1 = 900}) => (
  <g>
    <defs><linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top}/><stop offset="0.62" stopColor={mid}/><stop offset="1" stopColor={bot}/></linearGradient></defs>
    <rect x={-80} y={y0} width={W + 160} height={y1 - y0} fill={`url(#${id}-sky)`}/>
  </g>
);

/** wavy strata lines across a slab (older crust under a cut-away) */
export const Strata: React.FC<{id: string; x0: number; x1: number; y0: number; y1: number; seed?: number; tones?: string[]; gap?: number}> = ({id, x0, x1, y0, y1, seed = 1, tones = ["#6e5646", "#5b473b", "#7a6050", "#4d3c33"], gap = 38}) => {
  const rnd = rng(seed * 19 + 5), rows: React.ReactNode[] = [];
  let y = y0, k = 0;
  while (y < y1) {
    const h = gap * (0.7 + rnd() * 0.7), a = (rnd() - 0.5) * 10, ph = rnd() * 6;
    const top = (x: number) => y + a * Math.sin(x / 210 + ph), bot = (x: number) => y + h + a * Math.sin(x / 210 + ph + 0.2 * k);
    rows.push(<path key={`s${k}`} d={bandPath(top, bot, x0, x1, 40)} fill={tones[k % tones.length]}/>);
    rows.push(<path key={`l${k}`} d={pts(curve(bot, x0, x1, 40))} fill="none" stroke="#e6c9a0" strokeWidth={1.2} opacity={0.25}/>);
    y += h; k++;
  }
  return <g id={id}>{rows}</g>;
};

/** a small pine for the lower slopes */
export const Pine: React.FC<{x: number; y: number; s?: number; tone?: number}> = ({x, y, s = 1, tone = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-3} y={-14} width={6} height={16} fill="#4a3320"/>
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M0,${-70 + i * 18} L${-22 + i * 2},${-26 + i * 8 - 6 + i * 4} L${22 - i * 2},${-26 + i * 8 - 6 + i * 4} Z`} fill={`hsl(${140 - tone} 36% ${26 + i * 4}%)`} stroke={`hsl(${140 - tone} 40% 16%)`} strokeWidth={0.8}/>
    ))}
  </g>
);

export const Tick: React.FC<{x: number; y: number; a: number; r?: number}> = ({x, y, a, r = 30}) => (
  a > 0.01 ? (
    <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * a})`} opacity={a} style={{filter: "drop-shadow(0 6px 6px rgba(30,20,10,.4))"}}>
      <circle r={r} fill="#2f9a4a" stroke="#fff6dc" strokeWidth={3}/>
      <path d={`M${-r * 0.42},${r * 0.02} L${-r * 0.1},${r * 0.34} L${r * 0.46},${-r * 0.3}`} fill="none" stroke="#fff" strokeWidth={r * 0.2} strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  ) : null
);
export {H};
