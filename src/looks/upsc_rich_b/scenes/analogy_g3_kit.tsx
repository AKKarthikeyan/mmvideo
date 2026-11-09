// ECO-16 Part 3, builder G3: shared parts (defs, label split helpers, small props: coin stack, storm cloud, bank door, pea-nut plant, bank facade).
// Everything is a smooth function of f. Labels come from the spec through elabs(); no figure is typed here. No copied currency, logos or real faces.
import React from "react";
import {SANS, SERIF, W, H, eo, eio, clamp, rng} from "../kit";
import {prog, lerp, type AP} from "./analogy_kit";
import {F3Defs, elabs} from "./analogy_f3_kit";
import {E1Defs} from "./analogy_e1_kit";
import {F1Defs, E, win} from "./analogy_f1_kit";

export {elabs, E, win, eo, eio, clamp, rng, prog, lerp, SANS, SERIF, W, H};
export type {AP};

/** every gradient and filter the G3 scenes use */
export const G3Defs: React.FC = () => (
  <>
    <F3Defs/><E1Defs/><F1Defs/>
    <defs>
      <linearGradient id="g3-soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a5703f"/><stop offset="1" stopColor="#7c4f2a"/></linearGradient>
      <linearGradient id="g3-grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9cc067"/><stop offset="1" stopColor="#6c9a48"/></linearGradient>
      <linearGradient id="g3-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8dbfe6"/><stop offset="0.6" stopColor="#d5e6e2"/><stop offset="1" stopColor="#f8e8c6"/></linearGradient>
      <linearGradient id="g3-navy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f4670"/><stop offset="1" stopColor="#1a2748"/></linearGradient>
    </defs>
  </>
);

/** split a label on " · " into its parts (a label never gets words that are not in it) */
export const parts = (t: string): string[] => t.split(/\s*·\s*/);

/** "1 · credit and what it costs" -> ["1", "credit and what it costs"] */
export const numbered = (t: string): [string, string] => { const m = /^(\d+|I+)\s*·\s*(.*)$/.exec(t); return m ? [m[1], m[2]] : ["", t]; };

/** a plain paper tag with a brass eyelet and a string, anchored at (x, y) (its top centre), swinging a little */
export const HangTag: React.FC<{x: number; y: number; w: number; h: number; text: string; a: number; size?: number; f: number; rot?: number; edge?: string; ink?: string; fill?: string; sub?: string}> =
  ({x, y, w, h, text, a, size = 32, f, rot = -3, edge = "#b9482a", ink = "#5e2a0e", fill = "url(#f1-paper)", sub}) => {
  if (a <= 0.002) return null;
  const sw = Math.sin(f / 30) * 1.1;
  return (
    <g transform={`translate(${x} ${y + (1 - a) * -30}) rotate(${rot + sw})`} opacity={a}>
      <path d="M0,0 L-18,-40 M0,0 L18,-40" stroke="#8a6a3a" strokeWidth={3} fill="none" strokeLinecap="round"/>
      <g filter="url(#e3-sh-s)">
        <path d={`M${-w / 2 + 22},0 L${w / 2 - 22},0 L${w / 2},22 L${w / 2},${h} L${-w / 2},${h} L${-w / 2},22 Z`} fill={fill} stroke={edge} strokeWidth={3} strokeLinejoin="round"/>
        <path d={`M${-w / 2 + 12},${h - 10} H${w / 2 - 12}`} stroke={edge} strokeWidth={1.6} opacity={0.5}/>
      </g>
      <circle cx={0} cy={13} r={7} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={1.6}/><circle cx={0} cy={13} r={2.6} fill="#3f2a10"/>
      <text x={0} y={h * 0.62} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={size} letterSpacing={size * 0.03} fill={ink}>{text}</text>
      {sub ? <text x={0} y={h * 0.62 + size * 0.95} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={size * 0.6} letterSpacing={size * 0.08} fill={edge}>{sub}</text> : null}
    </g>
  );
};

/** gold coins in a side-on stack, base centre (x, y); n coins (fractional n pops the last one in) */
export const CoinColumn: React.FC<{x: number; y: number; n: number; rx?: number; step?: number; f?: number}> = ({x, y, n, rx = 40, step = 11, f = 0}) => {
  const k = Math.floor(n), part = n - k;
  const coin = (i: number, s: number) => {
    const cy = y - i * step - (1 - s) * 40, lean = Math.sin(i * 2.3) * 2.4;
    return (
      <g key={i} transform={`translate(${x + lean} ${cy})`} opacity={clamp(s * 1.6)}>
        <ellipse cx={0} cy={step * 0.5} rx={rx} ry={rx * 0.28} fill="#8c5f18"/>
        <rect x={-rx} y={0} width={rx * 2} height={step * 0.5} fill="#c58f26"/>
        <ellipse cx={0} cy={0} rx={rx} ry={rx * 0.28} fill="url(#e2-coin)" stroke="#a8741c" strokeWidth={2}/>
        <ellipse cx={0} cy={0} rx={rx * 0.72} ry={rx * 0.2} fill="none" stroke="#b9831f" strokeWidth={1.6} opacity={0.8}/>
        <path d={`M${-rx * 0.6},${-rx * 0.06} Q${-rx * 0.2},${-rx * 0.2} ${rx * 0.1},${-rx * 0.2}`} stroke="#fffbe0" strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.8}/>
      </g>
    );
  };
  return (
    <g>
      <ellipse cx={x + 8} cy={y + step * 0.6 + 4} rx={rx * 1.1} ry={rx * 0.26} fill="#2a1808" opacity={0.3} filter="url(#ak-blur8)"/>
      {Array.from({length: k}, (_, i) => coin(i, 1))}
      {part > 0.02 ? coin(k, eo(part)) : null}
      {n > 3 ? <ellipse cx={x} cy={y - n * step} rx={rx * 1.5} ry={rx * 0.6} fill="url(#ak-sunglow)" opacity={0.25 + 0.1 * Math.sin(f / 9)}/> : null}
    </g>
  );
};

/** a small storm cloud with a flash, centred at (x, y) */
export const StormCloud: React.FC<{x: number; y: number; s?: number; f?: number; a?: number}> = ({x, y, s = 1, f = 0, a = 1}) => {
  const fl = Math.max(0, Math.sin(f / 7) * Math.sin(f / 3.1 + 1)) > 0.7 ? 1 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={a}>
      <ellipse cx={0} cy={44} rx={70} ry={8} fill="#2a1808" opacity={0.2} filter="url(#ak-blur8)"/>
      {[[-34, 6, 28], [-6, -10, 36], [30, 0, 30], [52, 14, 20], [-52, 16, 20]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#6d7a8c" stroke="#47515f" strokeWidth={1.6}/>)}
      {[[-34, 2, 20], [-6, -14, 26], [30, -4, 21]].map(([cx, cy, r], i) => <circle key={`h${i}`} cx={cx - 5} cy={cy - 5} r={r} fill="#8d9aab" opacity={0.7}/>)}
      <path d="M2,26 L-12,52 L0,50 L-8,76 L16,42 L4,44 Z" fill={fl ? "#fff4a8" : "#f2cf55"} stroke="#9a7410" strokeWidth={2} strokeLinejoin="round"/>
    </g>
  );
};

const mixc = (a: [number, number, number], b: [number, number, number], t: number) => `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))})`;

/** a groundnut plant: health 1 = green leaflets held up, 0 = yellow-brown and drooping; base at (x, y) */
export const Groundnut: React.FC<{x: number; y: number; s?: number; health: number; f: number; seed?: number}> = ({x, y, s = 1, health, f, seed = 1}) => {
  const hl = clamp(health), r = rng(seed * 31 + 7), sway = Math.sin(f / 26 + seed) * 2 * hl;
  const leafA = mixc([88, 140, 62], [150, 120, 54], 1 - hl), leafB = mixc([52, 104, 44], [112, 84, 40], 1 - hl);
  const droop = (1 - hl) * 52;
  const stems = [-1, 0, 1].map((k) => ({k, len: (46 + r() * 12) * (0.78 + 0.22 * hl) - (1 - hl) * 6}));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={4} cy={2} rx={34} ry={6} fill="#2a1808" opacity={0.28}/>
      {stems.map(({k, len}) => {
        const ang = k * (22 + (1 - hl) * 10) + sway + (k === 0 ? 0 : k * droop * 0.5);
        return (
          <g key={k} transform={`rotate(${ang})`}>
            <path d={`M0,0 Q${k * 3 + (1 - hl) * k * 8},${-len * 0.6} ${k * (1 - hl) * 14},${-len}`} stroke="#4a6a2c" strokeWidth={3.2} fill="none" strokeLinecap="round"/>
            <g transform={`translate(${k * (1 - hl) * 14} ${-len}) rotate(${k * droop * 0.7})`}>
              {[[-11, -5, -26], [11, -5, 26], [-9, 8, -12], [9, 8, 12]].map(([lx, ly, rt], i) => (
                <g key={i} transform={`translate(${lx} ${ly + (1 - hl) * 7}) rotate(${rt + (rt > 0 ? 1 : -1) * droop * 0.7})`}>
                  <ellipse cx={0} cy={-10} rx={7.5} ry={12} fill={leafB} stroke="#2f4a1c" strokeWidth={0.8}/>
                  <ellipse cx={-1.4} cy={-11.5} rx={4.4} ry={8} fill={leafA} opacity={0.9}/>
                </g>
              ))}
              {hl > 0.5 && k === 0 ? <g><circle cx={0} cy={-8} r={5} fill="#f2c62c" stroke="#b58a10" strokeWidth={1}/><circle cx={0} cy={-8} r={1.8} fill="#e08a1a"/></g> : null}
            </g>
          </g>
        );
      })}
    </g>
  );
};

/** a small bank facade (columns, a pediment, one arched door): `door` 0..1 how lit the doorway is */
export const MiniBank: React.FC<{x: number; y: number; w: number; h: number; tone?: [string, string]; door?: number; sign?: string; f?: number}> = ({x, y, w, h, tone = ["#e6dac0", "#bfae8a"], door = 0, sign, f = 0}) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={3} rx={w * 0.62} ry={h * 0.06} fill="#2a1808" opacity={0.26} filter="url(#ak-blur8)"/>
    <rect x={-w / 2} y={-h * 0.72} width={w} height={h * 0.72} fill={tone[0]} stroke={tone[1]} strokeWidth={2}/>
    <rect x={w * 0.16} y={-h * 0.72} width={w * 0.34} height={h * 0.72} fill="#3a2a12" opacity={0.1}/>
    <path d={`M${-w * 0.56},${-h * 0.72} L0,${-h} L${w * 0.56},${-h * 0.72} Z`} fill={tone[0]} stroke={tone[1]} strokeWidth={2} strokeLinejoin="round"/>
    <path d={`M0,${-h} L${w * 0.56},${-h * 0.72} L0,${-h * 0.72} Z`} fill={tone[1]} opacity={0.22}/>
    {[-0.34, 0.34].map((u) => <g key={u}><rect x={w * u - w * 0.05} y={-h * 0.68} width={w * 0.1} height={h * 0.64} fill="#f5eedc" stroke={tone[1]} strokeWidth={1.2}/><rect x={w * u + w * 0.012} y={-h * 0.68} width={w * 0.038} height={h * 0.64} fill={tone[1]} opacity={0.3}/></g>)}
    <path d={`M${-w * 0.14},0 V${-h * 0.38} Q0,${-h * 0.54} ${w * 0.14},${-h * 0.38} V0 Z`} fill="#4a3220" stroke="#2a1a0c" strokeWidth={1.6}/>
    {door > 0.01 ? <path d={`M${-w * 0.12},0 V${-h * 0.38} Q0,${-h * 0.51} ${w * 0.12},${-h * 0.38} V0 Z`} fill="#ffe9a0" opacity={0.35 + 0.65 * door}/> : null}
    {door > 0.01 ? <ellipse cx={0} cy={-h * 0.2} rx={w * 0.5} ry={h * 0.34} fill="url(#ak-sunglow)" opacity={door * (0.7 + 0.1 * Math.sin(f / 9))}/> : null}
    {sign ? <g><rect x={-w * 0.4} y={-h * 0.72 + 8} width={w * 0.8} height={h * 0.1} rx={3} fill="#2a3a5c"/><text x={0} y={-h * 0.72 + 8 + h * 0.075} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={h * 0.062} letterSpacing={h * 0.012} fill="#f6e3a8">{sign}</text></g> : null}
    <rect x={-w * 0.5} y={-6} width={w} height={6} fill="#cfc4ac" stroke={tone[1]} strokeWidth={1}/>
  </g>
);

/** a small door-shaped icon of a bank for rows and rings (no text) */
export const DoorIcon: React.FC<{x: number; y: number; s?: number; col?: string; glow?: number}> = ({x, y, s = 1, col = "#e6dac0", glow = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {glow > 0.01 ? <ellipse cx={0} cy={-34} rx={64} ry={58} fill="url(#ak-sunglow)" opacity={glow}/> : null}
    <ellipse cx={0} cy={2} rx={38} ry={6} fill="#2a1808" opacity={0.28}/>
    <path d="M-34,0 V-52 L0,-76 L34,-52 V0 Z" fill={col} stroke="#8f826a" strokeWidth={2.2} strokeLinejoin="round"/>
    <path d="M0,-76 L34,-52 V0 H0 Z" fill="#000" opacity={0.1}/>
    <path d="M-12,0 V-30 Q0,-44 12,-30 V0 Z" fill="#4a3220" stroke="#2a1a0c" strokeWidth={1.6}/>
    <rect x={-34} y={-4} width={68} height={5} fill="#cfc4ac" stroke="#8f826a" strokeWidth={1}/>
    <path d="M-34,-52 H34" stroke="#8f826a" strokeWidth={1.6}/>
  </g>
);
