// POL-03 Part 2, builder W4: shared helpers (keyed labels, faceless robed figure, brass plate, paper sheet, soft glow).
import React from "react";
import {SANS, SERIF, eo} from "../kit";
import {prog, type AP} from "./analogy_kit";
import {lab as labQ} from "../../cartoon/long/figs";

export type KL = {text: string; at: number};
/** every spec label by key: {lab} prints lab(lab), {text} prints as given */
export const keyed = (p: AP): Record<string, KL> => {
  const o: Record<string, KL> = {};
  for (const l of ((p.spec as any).labels ?? []) as any[]) o[l.key] = {text: l.lab ? labQ(l.lab) : l.text ?? "", at: p.at(l.key)};
  return o;
};
export const A = (f: number, at: number, d = 14) => eo(prog(f, at, d));
export const mixN = (a: number, b: number, t: number) => a + (b - a) * t;
export const bez = (p0: [number, number], c: [number, number], p1: [number, number], t: number): [number, number] => {
  const u = 1 - t;
  return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]];
};

/** a robed figure with no face (judge / Advisory Board member). Unit height 100, feet at origin. */
export const Robed: React.FC<{x: number; y: number; h: number; tone?: string; op?: number; f?: number; seed?: number}> = ({x, y, h, tone = "#2a2f45", op = 1, f = 0, seed = 0}) => {
  const sway = Math.sin(f / 40 + seed) * 0.4;
  return (
    <g transform={`translate(${x} ${y}) scale(${h / 100})`} opacity={op}>
      <ellipse cx={0} cy={0.5} rx={17} ry={3} fill="#1a1008" opacity={0.3}/>
      <g transform={`rotate(${sway})`}>
        <path d="M-10,-78 Q-18,-40 -17,0 L17,0 Q18,-40 10,-78 Q0,-83 -10,-78 Z" fill={tone} stroke="#12152a" strokeWidth={0.6}/>
        <path d="M3,-79 Q12,-40 10,0 L17,0 Q18,-40 10,-78 Z" fill="#000" opacity={0.28}/>
        <path d="M-12,-56 Q-20,-40 -18,-14 L-13,-14 Q-14,-40 -8,-56 Z" fill="#000" opacity={0.2}/>
        <path d="M-3.4,-79 L-1,-62 L-6.4,-62 Z M3.4,-79 L1,-62 L6.4,-62 Z" fill="#f4efe4" stroke="#cfc6b2" strokeWidth={0.3}/>
        <rect x={-2.6} y={-86} width={5.2} height={7} rx={2} fill="#3a3550"/>
        <ellipse cx={0} cy={-92} rx={6.4} ry={7.6} fill="#262a40" stroke="#12152a" strokeWidth={0.5}/>
        <path d="M-6.2,-93 Q-5,-100 0,-100 Q5,-100 6.2,-93 Q4,-97 0,-97 Q-4,-97 -6.2,-93 Z" fill="#363c58"/>
      </g>
    </g>
  );
};

/** soft glow disc */
export const Glow: React.FC<{x: number; y: number; r: number; c?: string; a?: number}> = ({x, y, r, c = "255,214,120", a = 1}) => (
  <g opacity={a}>
    <defs><radialGradient id={`w4gl-${Math.round(x)}-${Math.round(y)}-${Math.round(r)}`}><stop offset="0" stopColor={`rgba(${c},0.85)`}/><stop offset="0.5" stopColor={`rgba(${c},0.3)`}/><stop offset="1" stopColor={`rgba(${c},0)`}/></radialGradient></defs>
    <circle cx={x} cy={y} r={r} fill={`url(#w4gl-${Math.round(x)}-${Math.round(y)}-${Math.round(r)})`}/>
  </g>
);

/** brass plate with engraved text */
export const Brass: React.FC<{cx: number; cy: number; w: number; h: number; text: string; size?: number; a?: number; font?: string}> = ({cx, cy, w, h, text, size = 28, a = 1, font = SERIF}) => {
  if (a <= 0.002) return null;
  return (
    <g opacity={a} transform={`translate(${cx} ${cy}) scale(${0.92 + 0.08 * a})`} style={{filter: "drop-shadow(0 6px 6px rgba(30,16,4,.4))"}}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h * 0.16} fill="#c79a3c" stroke="#7a5518" strokeWidth={2}/>
      <rect x={-w / 2 + 4} y={-h / 2 + 4} width={w - 8} height={h - 8} rx={h * 0.12} fill="none" stroke="#f1d27a" strokeWidth={1.5} opacity={0.8}/>
      <rect x={-w / 2 + 4} y={-h / 2 + 4} width={w - 8} height={(h - 8) * 0.45} rx={h * 0.1} fill="#fff4c0" opacity={0.22}/>
      <text x={0} y={size * 0.36} textAnchor="middle" fontFamily={font} fontWeight={700} fontSize={size} letterSpacing="0.1em" fill="#4a300a">{text}</text>
    </g>
  );
};

/** a sheet of paper: x,y top-left, with a title line and ruled lines */
export const Sheet: React.FC<{x: number; y: number; w: number; h: number; title?: string; lines?: number; rot?: number; tsize?: number; ink?: string; id: string}> = ({x, y, w, h, title, lines = 6, rot = 0, tsize = 22, ink = "#8b7d62", id}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} style={{filter: "drop-shadow(0 12px 10px rgba(40,22,8,.34))"}}>
    <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fffdf4"/><stop offset="1" stopColor="#eadfc4"/></linearGradient></defs>
    <rect width={w} height={h} rx={4} fill={`url(#${id})`} stroke="#c9b98f" strokeWidth={1.4}/>
    {title && <text x={w / 2} y={tsize + 22} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={tsize} letterSpacing="0.1em" fill="#3a2a14">{title}</text>}
    {title && <path d={`M${w * 0.12},${tsize + 34} H${w * 0.88}`} stroke="#3a2a14" strokeWidth={1.6}/>}
    {Array.from({length: lines}).map((_, i) => <path key={i} d={`M${w * 0.12},${tsize + 62 + i * ((h - tsize - 100) / Math.max(1, lines - 1))} H${w * (i % 3 === 2 ? 0.7 : 0.88)}`} stroke={ink} strokeWidth={2.2} strokeLinecap="round" opacity={0.55}/>)}
  </g>
);

export const Label: React.FC<{x: number; y: number; text: string; a: number; size?: number; fill?: string; anchor?: "start" | "middle" | "end"; ls?: string}> = ({x, y, text, a, size = 24, fill = "#4a2c10", anchor = "middle", ls = "0.12em"}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={SANS} fontWeight={800} fontSize={size} letterSpacing={ls} fill={fill} opacity={a}>{text}</text>
);
