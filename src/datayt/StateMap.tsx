// India state map with a number on every state, shared by the story Shorts and their chart posts.
// Animated when `frame` is given (outline draws from `t0`, each state fills at its own `at`), static when it is null.
import React from "react";
import {Easing, interpolate, spring} from "remotion";
import {COND} from "../voxkit";
import geo from "../../public/datayt/india/geo.json";
import {P} from "./IndiaShort";

export type MapState = {name: string; short?: string; label: string; bucket: number; at?: number; nudge: number[]; alt?: boolean};
type G = {name: string; d: string; lx: number; ly: number};
const GEO = Object.fromEntries((geo.states as G[]).map((g) => [g.name, g]));
const ORDER = [...(geo.states as G[])].sort((a, b) => a.ly - b.ly);
export const MAP_RATIO = geo.w / geo.h;
const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
const mix = (a: string, b: string, p: number) => {
  const h = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16);
  return "#" + [0, 1, 2].map((i) => Math.round(h(a, i) + (h(b, i) - h(a, i)) * p).toString(16).padStart(2, "0")).join("");
};

export const StateMap: React.FC<{states: MapState[]; colors: string[]; x: number; y: number; h: number; frame?: number | null; t0?: number; fps?: number;
  focus?: string[] | null; focusP?: number; ring?: Record<string, string>; fs?: number}> =
  ({states, colors, x, y, h, frame = null, t0 = 0, fps = 30, focus = null, focusP = 1, ring = {}, fs = 22}) => {
  const S = h / geo.h, k = 1 / S;
  const BY = Object.fromEntries(states.map((s) => [s.name, s]));
  const f = frame ?? 1e9;
  const F = (s: number) => Math.round(s * fps);
  return <svg width={geo.w * S} height={h} style={{position: "absolute", left: x, top: y, overflow: "visible"}}>
    <g transform={`scale(${S})`}>
      {ORDER.map((g, i) => {
        const d = BY[g.name];
        const dStart = t0 + 2 + i * 0.6;
        const draw = ease(f, dStart, dStart + 18), base = ease(f, dStart + 12, dStart + 22);
        const at = F(d?.at ?? 0);
        const fillP = d ? ease(f, at, at + 6) : 0;
        const col = d ? mix(P.empty, colors[d.bucket], fillP) : P.empty;
        const pop = d && frame != null ? spring({frame: f - at, fps, config: {damping: 12, stiffness: 180}, durationInFrames: 9}) : 0;
        const sc = 1 + 0.07 * Math.sin(pop * Math.PI) * (d && f >= at ? 1 : 0);
        const dim = focus && !focus.includes(g.name) ? 1 - 0.72 * focusP : 1;
        const rg = ring[g.name];
        return <g key={g.name} opacity={dim} transform={`translate(${g.lx},${g.ly}) scale(${sc}) translate(${-g.lx},${-g.ly})`}>
          <path d={g.d} fillRule="evenodd" fill={col} fillOpacity={base} stroke={rg ?? P.ink} strokeOpacity={rg ? 1 : 0.55} strokeWidth={rg ? 5 : 1.1}
                strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw}/>
        </g>;
      })}
      {states.map((d) => {
        const at = F(d.at ?? 0);
        const hot = focus?.includes(d.name) ?? false;
        const op = ease(f, at + 2, at + 8) * (focus && !hot ? 1 - 0.6 * focusP : 1);
        if (op <= 0.001) return null;
        const g = GEO[d.name];
        const [nx, ny] = d.nudge;
        const out = !!(nx || ny);
        const lx = g.lx + nx, ly = g.ly + ny;
        const size = (hot ? fs * 1.35 : d.bucket >= 3 ? fs * 1.12 : fs) * k;
        const dark = d.bucket >= 2 && !out;
        return <g key={d.name} opacity={op}>
          {out && <line x1={g.lx} y1={g.ly} x2={lx} y2={ly} stroke={P.ink} strokeWidth={1.3 * k} opacity={0.55}/>}
          {out && <circle cx={g.lx} cy={g.ly} r={3 * k} fill={P.ink} opacity={0.7}/>}
          <text x={lx} y={ly + size * 0.35} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={size}
                fill={dark ? "#FFFFFF" : P.ink} stroke={dark ? mix(colors[d.bucket], "#000000", 0.25) : P.bg}
                strokeWidth={(dark ? 3 : 5) * k} paintOrder="stroke">{d.label}</text>
        </g>;
      })}
    </g>
  </svg>;
};
