// Skies, light and air for the Katha kit: gradient sky by mood, sun or moon with glow and slow god rays, lit cloud
// bands, stars, haze, drifting dust motes. All deterministic per frame.
import React from "react";
import {K, W, H, blur} from "./look";
import {rnd} from "./geom";

export type Mood = "dusk" | "dawn" | "night" | "gold";
const SKIES: Record<Mood, [number, string][]> = {
  dusk: [[0, "#120F2A"], [0.32, "#2E2350"], [0.55, "#6A2F55"], [0.72, "#C2553A"], [0.84, "#F0A04B"], [0.92, "#FFD27A"]],
  dawn: [[0, "#151C38"], [0.35, "#2F3D6E"], [0.58, "#7D6A92"], [0.75, "#E3967A"], [0.87, "#F7C58E"], [0.95, "#FFE6B8"]],
  night: [[0, "#04050D"], [0.4, "#0B1029"], [0.7, "#16204A"], [0.88, "#24305E"], [1, "#2E3A6A"]],
  gold: [[0, "#2A1A3E"], [0.3, "#6B3A55"], [0.55, "#C26A45"], [0.75, "#F2A855"], [0.9, "#FFD98E"], [1, "#FFF0C8"]],
};
const SUN: Record<Mood, [string, string, string]> = {   // core, halo, outer
  dusk: ["#FFF6D8", "#FFC86A", "#F59A45"], dawn: ["#FFF8E4", "#FFD9A0", "#F2A47A"], night: ["#F4F1E6", "#C9CFE6", "#6B78A8"], gold: ["#FFFBEA", "#FFE08A", "#F5A945"],
};
export const Sky: React.FC<{mood?: Mood; sun?: [number, number]; sunR?: number; f: number; rays?: number; stars?: number; clouds?: number; id?: string}> =
  ({mood = "dusk", sun = [1010, 640], sunR = 92, f, rays = 0.5, stars, clouds = 1, id = "a"}) => {
  const stops = SKIES[mood], [c0, c1, c2] = SUN[mood];
  const nStars = stars ?? (mood === "night" ? 1 : mood === "dusk" ? 0.6 : 0.25);
  const top = mood === "night" ? 900 : 340;
  return (
    <g>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">{stops.map(([o, c], i) => <stop key={i} offset={o} stopColor={c}/>)}</linearGradient>
        <radialGradient id={`sun-${id}`}><stop offset="0" stopColor={c0}/><stop offset="0.08" stopColor={c1}/><stop offset="0.2" stopColor={c1} stopOpacity={0.85}/><stop offset="0.45" stopColor={c2} stopOpacity={0.35}/><stop offset="1" stopColor={c2} stopOpacity={0}/></radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill={`url(#sky-${id})`}/>
      {nStars > 0 ? Array.from({length: Math.round(220 * nStars)}, (_, i) => {
        const x = rnd(i, 7) * W, y = rnd(i, 8) * top, r = 0.6 + rnd(i, 9) * 1.5, tw = 0.6 + 0.4 * Math.sin(f / (9 + rnd(i, 11) * 14) + i);
        return <circle key={i} cx={x} cy={y} r={r} fill="#FFF3D6" opacity={(1 - y / top) * (0.3 + 0.6 * rnd(i, 10)) * tw}/>;
      }) : null}
      <circle cx={sun[0]} cy={sun[1]} r={sunR * 6.7} fill={`url(#sun-${id})`}/>
      {rays > 0 ? (
        <g opacity={rays} filter={blur(14)} transform={`rotate(${Math.sin(f / 240) * 3} ${sun[0]} ${sun[1]})`}>
          {Array.from({length: 16}, (_, i) => {
            const a = (-178 + i * 11.5 + rnd(i, 3) * 6) * Math.PI / 180, w = (1.4 + rnd(i, 4) * 2.6) * Math.PI / 180, L = 1700;
            const breathe = 0.7 + 0.3 * Math.sin(f / 50 + i * 1.3);
            return <path key={i} d={`M ${sun[0]} ${sun[1]} L ${sun[0] + Math.cos(a - w) * L} ${sun[1] + Math.sin(a - w) * L} L ${sun[0] + Math.cos(a + w) * L} ${sun[1] + Math.sin(a + w) * L} Z`} fill={c1} opacity={(0.08 + 0.08 * rnd(i, 5)) * breathe}/>;
          })}
        </g>) : null}
      <circle cx={sun[0]} cy={sun[1]} r={sunR} fill={c0} filter={blur(4)}/>
      {clouds > 0 ? <Clouds f={f} mood={mood} op={clouds}/> : null}
    </g>
  );
};
// Bands of soft cloud, darker above and lit from below by the low sun; they drift slowly.
export const Clouds: React.FC<{f: number; mood: Mood; op?: number}> = ({f, mood, op = 1}) => {
  const bands: [number, number, number, string, string][] = mood === "night"
    ? [[300, 50, 0.35, "#1A2148", "#3A4677"], [480, 36, 0.3, "#1E2650", "#4A5688"]]
    : [[250, 64, 0.5, "#3A2A5A", "#D9784F"], [395, 50, 0.55, "#5B2F57", "#F2A060"], [520, 34, 0.5, "#8E3D52", "#FFC27A"]];
  return (
    <g opacity={op}>
      {bands.map(([y, h, a, dark, lit], b) => (
        <g key={b} opacity={a}>
          {Array.from({length: 10}, (_, i) => {
            const x = ((rnd(i, b * 10 + 1) * 2300 + f * (0.08 + b * 0.05)) % 2300) - 190, w = 240 + rnd(i, b * 10 + 2) * 560, hh = h * (0.5 + rnd(i, b * 10 + 3) * 0.8), yy = y + rnd(i, b * 10 + 4) * 34;
            return <g key={i}>
              <ellipse cx={x} cy={yy} rx={w / 2} ry={hh / 2} fill={dark} filter={blur(14)}/>
              <ellipse cx={x + w * 0.05} cy={yy + hh * 0.3} rx={w * 0.42} ry={hh * 0.16} fill={lit} filter={blur(4)} opacity={0.85}/>
            </g>;
          })}
        </g>
      ))}
    </g>
  );
};
// Dust motes in the light, brighter near the sun; they drift up and across.
export const Dust: React.FC<{f: number; sun: [number, number]; n?: number; y0?: number; y1?: number; color?: string}> = ({f, sun, n = 160, y0 = 260, y1 = 1040, color = "#FFE2A8"}) => (
  <g>{Array.from({length: n}, (_, i) => {
    const sp = 0.15 + rnd(i, 105) * 0.5, x = ((rnd(i, 101) * W + f * sp) % (W + 40)) - 20, y = y0 + ((rnd(i, 102) * (y1 - y0) - f * sp * 0.4) % (y1 - y0) + (y1 - y0)) % (y1 - y0) + Math.sin(f / 30 + i) * 6;
    const d = Math.hypot(x - sun[0], y - sun[1]), a = Math.max(0.05, 1 - d / 1100), r = 0.8 + rnd(i, 103) * 2.4;
    return <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={a * (0.5 + 0.4 * Math.sin(f / 13 + i))} filter={rnd(i, 104) < 0.3 ? blur(1.5) : undefined}/>;
  })}</g>
);
// A horizontal band of haze (between depth layers).
export const Haze: React.FC<{y: number; h: number; color: string; op?: number}> = ({y, h, color, op = 0.55}) => (
  <g>
    <defs><linearGradient id={`haze-${y}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity={0}/><stop offset="0.6" stopColor={color} stopOpacity={op}/><stop offset="1" stopColor={color} stopOpacity={0}/></linearGradient></defs>
    <rect x={-40} y={y - h / 2} width={W + 80} height={h} fill={`url(#haze-${y})`} filter={blur(14)}/>
  </g>
);
