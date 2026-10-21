// The field of Kurukshetra: two armies as procedural silhouettes in depth (banners, spears, elephants, parasols),
// the plain, and the light that runs across it towards us.
import React, {useMemo} from "react";
import {W, H, blur} from "./look";
import {rnd} from "./geom";

// One row of an army along the horizon y: banners on poles, spears, elephants with howdahs, chariot parasols.
export const armyPath = (y: number, scale: number, count: number, seed: number, x0: number, x1: number, wave = 0): string => {
  let d = "";
  for (let i = 0; i < count; i++) {
    const x = x0 + rnd(i, seed) * (x1 - x0), h = (18 + rnd(i, seed + 1) * 26) * scale, k = rnd(i, seed + 2), s = scale;
    const fl = Math.sin(wave + i) * 3 * s;   // banners lift and fall in the wind
    if (k < 0.45) {                           // spear, sometimes with a pennant
      d += `M ${x} ${y} l ${-1.2 * s} ${-h} l ${1.2 * s} ${-6 * s} l ${1.2 * s} ${6 * s} Z `;
      if (k < 0.18) d += `M ${x + s} ${y - h} l ${14 * s} ${3 * s + fl} l ${-14 * s} ${6 * s} Z `;
    } else if (k < 0.62) {                    // tall banner
      d += `M ${x} ${y} l ${-0.9 * s} ${-h * 1.7} l ${1.8 * s} 0 Z M ${x + 0.9 * s} ${y - h * 1.7} c ${8 * s} ${-2 * s + fl} ${14 * s} ${2 * s} ${22 * s} ${2 * s + fl} l ${-4 * s} ${7 * s} l ${4 * s} ${7 * s} c ${-8 * s} ${fl} ${-14 * s} ${-3 * s} ${-22 * s} ${-2 * s} Z `;
    } else if (k < 0.71) {                    // elephant with a howdah
      const w = 36 * s, eh = 28 * s;
      d += `M ${x} ${y} l 0 ${-eh * 0.5} q ${w * 0.04} ${-eh * 0.52} ${w * 0.46} ${-eh * 0.52} q ${w * 0.44} 0 ${w * 0.5} ${eh * 0.44} q ${w * 0.14} ${eh * 0.12} ${w * 0.1} ${eh * 0.58} l ${-w * 0.07} 0 l 0 ${-eh * 0.3} l ${-w * 0.18} 0 l 0 ${eh * 0.3} l ${-w * 0.08} 0 l 0 ${-eh * 0.3} l ${-w * 0.42} 0 l 0 ${eh * 0.3} Z `;
      d += `M ${x + w * 0.2} ${y - eh * 0.98} l ${w * 0.5} 0 l ${-w * 0.04} ${-eh * 0.4} l ${-w * 0.42} 0 Z M ${x + w * 0.45} ${y - eh * 1.38} l 0 ${-eh * 0.8} l ${2 * s} 0 l 0 ${eh * 0.8} Z `;
    } else {                                  // chariot parasol and its pole
      d += `M ${x - 6 * s} ${y} l ${2 * s} ${-h * 0.6} l ${8 * s} 0 l ${2 * s} ${h * 0.6} Z M ${x - 12 * s} ${y - h * 0.6 - 1} q ${12 * s} ${-13 * s} ${24 * s} 0 Z M ${x - 0.8 * s} ${y - h * 0.6 - 8 * s} l 0 ${-h * 0.5} l ${1.6 * s} 0 l 0 ${h * 0.5} Z `;
    }
  }
  return d;
};
export const Army: React.FC<{y: number; scale: number; count: number; seed: number; x0: number; x1: number; color: string; f: number}> = ({y, scale, count, seed, x0, x1, color, f}) => {
  const base = useMemo(() => `M ${x0 - 30} ${y - 1} L ${x1 + 30} ${y - 1} L ${x1 + 30} ${y + 60} L ${x0 - 30} ${y + 60} Z`, [x0, x1, y]);
  return <g><path d={armyPath(y, scale, count, seed, x0, x1, f / 18)} fill={color} stroke={color} strokeWidth={0.8 * scale}/><path d={base} fill={color}/></g>;
};
// The plain: a dark ground with a soft path of light running from the sun towards the viewer.
export const Ground: React.FC<{y: number; sunX: number; light?: number; top?: string; bottom?: string}> = ({y, sunX, light = 0.12, top = "#2A1630", bottom = "#0B0712"}) => (
  <g>
    <defs><linearGradient id={`gnd-${y}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top}/><stop offset="1" stopColor={bottom}/></linearGradient></defs>
    <rect x={-40} y={y} width={W + 80} height={H - y + 40} fill={`url(#gnd-${y})`}/>
    <defs><radialGradient id={`gl-${y}`} cx={sunX + 190} cy={H} r={620} gradientTransform={`translate(${sunX + 190} ${H}) scale(0.9 1.6) translate(${-(sunX + 190)} ${-H})`} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#F2A050" stopOpacity={1}/><stop offset="1" stopColor="#F2A050" stopOpacity={0}/></radialGradient></defs>
    <rect x={-40} y={y} width={W + 80} height={H - y + 40} fill={`url(#gl-${y})`} opacity={light * 1.6}/>
  </g>
);
// Both armies facing each other across the plain, three depth rows each, with haze between the rows.
export const Armies: React.FC<{horizon: number; f: number; gap?: [number, number]; tint?: [string, string, string]}> = ({horizon, f, gap = [760, 1060], tint = ["#9A4A55", "#5E2B48", "#2B1430"]}) => (
  <g>
    <Army y={horizon - 6} scale={0.7} count={260} seed={40} x0={-40} x1={gap[0]} color={tint[0]} f={f}/>
    <Army y={horizon - 6} scale={0.7} count={260} seed={50} x0={gap[1]} x1={W + 40} color={tint[0]} f={f}/>
    <defs><linearGradient id={`hz-${horizon}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E58A4A" stopOpacity={0}/><stop offset="0.5" stopColor="#E58A4A" stopOpacity={0.35}/><stop offset="1" stopColor="#E58A4A" stopOpacity={0}/></linearGradient></defs>
    <rect x={0} y={horizon - 40} width={W} height={80} fill={`url(#hz-${horizon})`}/>
    <Army y={horizon + 18} scale={1.15} count={150} seed={60} x0={-60} x1={gap[0] - 140} color={tint[1]} f={f + 40}/>
    <Army y={horizon + 18} scale={1.15} count={150} seed={70} x0={gap[1] + 140} x1={W + 60} color={tint[1]} f={f + 40}/>
  </g>
);
export const NearArmies: React.FC<{horizon: number; f: number; tint?: string}> = ({horizon, f, tint = "#2B1430"}) => (
  <g>
    <Army y={horizon + 70} scale={1.9} count={70} seed={80} x0={-80} x1={420} color={tint} f={f + 80}/>
    <Army y={horizon + 70} scale={1.9} count={70} seed={90} x0={1500} x1={W + 80} color={tint} f={f + 80}/>
  </g>
);
