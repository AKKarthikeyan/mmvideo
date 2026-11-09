// ECO-16 Part 2, builder F1: shared parts for the people and story scenes (deposit hook, Lala the goldsmith, queue and calm, the Part 3 street).
// Helpers for choreography (paths, arm reach), gold bars, paper receipts, stamps, a plain bank building, the village set (shop room, lane, stall).
// Everything is a smooth function of f (a fractional 30 fps logical frame at 60 fps). No copied currency, logos or real faces.
import React from "react";
import {SANS, SERIF, W, H, rng, clamp, eio} from "../kit";
import {fig} from "../../cartoon/long/figs";
import {Cloud, Hills, Sun, Tree, prog} from "./analogy_kit";
import {E1Defs, Awning, FruitPile, reach, type Arm} from "./analogy_e1_kit";

export type P = [number, number];
export type K = [number, number, number];

/** a figure read from a table of the film: pv("e16_p2", "loan").value / .text */
export const pv = (t: string, s: string, d = 0) => fig({t, state: "India", s}, d);
export const E = (f: number, a: number, d: number) => eio(prog(f, a, Math.max(1, d)));
/** 1 inside [a, b], easing in and out over r frames */
export const win = (f: number, a: number, b: number, r = 10) => E(f, a, r) * (1 - E(f, b - r, r));
export const mixp = (a: P, b: P, u: number): P => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
/** eased path through keyframes [t, x, y] */
export const path = (ks: K[], f: number): P => {
  if (f <= ks[0][0]) return [ks[0][1], ks[0][2]];
  for (let i = 0; i < ks.length - 1; i++) {
    if (f < ks[i + 1][0]) return mixp([ks[i][1], ks[i][2]], [ks[i + 1][1], ks[i + 1][2]], eio((f - ks[i][0]) / Math.max(1, ks[i + 1][0] - ks[i][0])));
  }
  const l = ks[ks.length - 1];
  return [l[1], l[2]];
};
/** weighted mix of several (weight, target) pairs: the hand goes to the weighted target with weight min(1, sum) */
export const blend = (acts: [number, P][]): {t: P; w: number} => {
  let s = 0, x = 0, y = 0;
  for (const [w, p] of acts) { s += w; x += w * p[0]; y += w * p[1]; }
  return s > 0.001 ? {t: [x / s, y / s], w: Math.min(1, s)} : {t: [0, 0], w: 0};
};
/** x along keyframes [t, x] and how fast the walker is moving (0..1) */
export const px = (ks: [number, number][], f: number): number => path(ks.map(([t, x]) => [t, x, 0] as K), f)[0];
export const walkOf = (ks: [number, number][], f: number): number => clamp(Math.abs(px(ks, f + 1) - px(ks, f - 1)) / 2 / 2.2);
/** arm angles that bring a hand to `target` with weight w (0 = arm at rest) */
export const armTo = (x: number, y: number, h: number, side: "L" | "R", target: P, w: number): Arm => {
  const r = reach(x, y, h, side, target);
  return [5 + (r[0] - 5) * w, 8 + (r[1] - 8) * w];
};

export const F1Defs: React.FC = () => (
  <defs>
    <linearGradient id="f1-plaster" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e6c690"/><stop offset="1" stopColor="#f3dfb2"/></linearGradient>
    <linearGradient id="f1-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9cfbd"/><stop offset="1" stopColor="#b6a98f"/></linearGradient>
    <linearGradient id="f1-iron" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6c7684"/><stop offset="1" stopColor="#2e3541"/></linearGradient>
    <linearGradient id="f1-paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fffaf0"/><stop offset="1" stopColor="#f0e2bc"/></linearGradient>
    <linearGradient id="f1-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6dc8a"/><stop offset="0.5" stopColor="#c9962c"/><stop offset="1" stopColor="#8a5f12"/></linearGradient>
    <linearGradient id="f1-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a9774a"/><stop offset="1" stopColor="#6e4626"/></linearGradient>
    <linearGradient id="f1-navy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a3a5c"/><stop offset="1" stopColor="#141c34"/></linearGradient>
    <radialGradient id="f1-lamp" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#fff2c0" stopOpacity="0.95"/><stop offset="0.4" stopColor="#ffd37a" stopOpacity="0.4"/><stop offset="1" stopColor="#ffb458" stopOpacity="0"/></radialGradient>
  </defs>
);

// ---- gold and paper --------------------------------------------------------------------------------------------------------------
export const GoldBar: React.FC<{s?: number; glow?: number}> = ({s = 1, glow = 0}) => (
  <g transform={`scale(${s})`}>
    {glow > 0.01 && <ellipse rx={80} ry={44} fill="url(#ak-sunglow)" opacity={glow}/>}
    <ellipse cx={4} cy={14} rx={44} ry={6} fill="#2a1808" opacity={0.28}/>
    <path d="M-40,12 L40,12 L31,-9 L-31,-9 Z" fill="url(#e1-gold)" stroke="#8a5a10" strokeWidth={2.4} strokeLinejoin="round"/>
    <path d="M-31,-9 L31,-9 L25,-20 L-25,-20 Z" fill="#fff3b0" stroke="#a8740e" strokeWidth={2} strokeLinejoin="round"/>
    <path d="M-34,6 L-24,-6 M18,6 L28,-6" stroke="#fff" strokeWidth={2.4} opacity={0.5} strokeLinecap="round"/>
    <circle cx={0} cy={2} r={4.4} fill="none" stroke="#a8740e" strokeWidth={1.6}/>
  </g>
);

/** a paper receipt: cream slip, ruled lines, a small gold-bar mark and a red seal (no text, no figures) */
export const Receipt: React.FC<{s?: number; rot?: number; glow?: number}> = ({s = 1, rot = 0, glow = 0}) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    {glow > 0.01 && <ellipse rx={78} ry={56} fill="url(#ak-sunglow)" opacity={glow}/>}
    <rect x={-35} y={-22} width={70} height={46} rx={3} fill="#2a1808" opacity={0.22} transform="translate(2 4)"/>
    <rect x={-35} y={-23} width={70} height={46} rx={3} fill="url(#f1-paper)" stroke="#b8a074" strokeWidth={1.8}/>
    <path d="M-27,-14 L-3,-14 M-27,-6 L12,-6 M-27,2 L8,2" stroke="#8a7a58" strokeWidth={2.2} strokeLinecap="round" opacity={0.75}/>
    <path d="M10,-17 l12,0 l-2.4,6 l-7.2,0 Z" fill="#e8b84a" stroke="#a8740e" strokeWidth={1}/>
    <circle cx={20} cy={11} r={7.6} fill="#b8302a" stroke="#7a1c18" strokeWidth={1.2}/><circle cx={20} cy={11} r={4} fill="none" stroke="#f3b0a4" strokeWidth={1}/>
    <path d="M-29,13 q6,-8 12,0 q4,4 10,-2" stroke="#2a3a5c" strokeWidth={1.6} fill="none" strokeLinecap="round"/>
  </g>
);

/** a rubber stamp landing: scales down from large with a small shake; text printed as given */
export const Stamp: React.FC<{x: number; y: number; text: string; f: number; at: number; rot?: number; size?: number; col?: string}> = ({x, y, text, f, at, rot = -7, size = 64, col = "#a5302a"}) => {
  const u = prog(f, at, 10);
  if (u <= 0.001) return null;
  const k = 1 + (1 - eio(u)) * 0.7, shake = Math.sin(f * 1.7) * clamp(1 - (f - at - 8) / 14) * clamp((f - at - 6) / 4) * 2.6;
  const w = text.length * size * 0.56 + 60;
  return (
    <g transform={`translate(${x + shake} ${y}) rotate(${rot}) scale(${k})`} opacity={clamp(u * 3)}>
      <rect x={-w / 2} y={-size * 0.78} width={w} height={size * 1.56} rx={12} fill="#fff6e4" opacity={0.78}/>
      <rect x={-w / 2} y={-size * 0.78} width={w} height={size * 1.56} rx={12} fill="none" stroke={col} strokeWidth={6}/>
      <rect x={-w / 2 + 9} y={-size * 0.78 + 9} width={w - 18} height={size * 1.56 - 18} rx={8} fill="none" stroke={col} strokeWidth={2.4}/>
      <text x={0} y={size * 0.3} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={size} letterSpacing="0.07em" fill={col}>{text}</text>
      {u < 1 && <circle r={size * 3} fill="none" stroke={col} strokeWidth={3} opacity={0.4 * (1 - u)} transform={`scale(${0.4 + 0.6 * u})`}/>}
    </g>
  );
};

/** a plain classical building (columns, pediment, steps): the word BANK is a generic sign, not a logo */
export const BankBuilding: React.FC<{x: number; y: number; w?: number; h?: number}> = ({x, y, w = 560, h = 340}) => {
  const cols = 6, cw = w / (cols + 1.2);
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={w / 2} cy={4} rx={w * 0.62} ry={16} fill="#2a1808" opacity={0.25}/>
      <rect x={-30} y={-14} width={w + 60} height={14} fill="#cfc4ac" stroke="#8f826a" strokeWidth={1.6}/>
      <rect x={-14} y={-28} width={w + 28} height={14} fill="#d9cfbd" stroke="#8f826a" strokeWidth={1.6}/>
      <rect x={0} y={-h * 0.8} width={w} height={h * 0.8 - 28} fill="url(#f1-stone)" stroke="#8f826a" strokeWidth={1.6}/>
      <rect x={w * 0.62} y={-h * 0.8} width={w * 0.38} height={h * 0.8 - 28} fill="#3a2a12" opacity={0.1}/>
      {Array.from({length: cols}, (_, i) => { const cx = cw * 0.8 + i * (w - cw * 1.6) / (cols - 1); return (
        <g key={i}><rect x={cx - cw * 0.26} y={-h * 0.8 + 10} width={cw * 0.52} height={h * 0.8 - 38} fill="#efe7d4" stroke="#8f826a" strokeWidth={1.4}/>
          <rect x={cx + cw * 0.04} y={-h * 0.8 + 10} width={cw * 0.22} height={h * 0.8 - 38} fill="#8f826a" opacity={0.28}/>
          <rect x={cx - cw * 0.36} y={-h * 0.8 + 4} width={cw * 0.72} height={10} fill="#d9cfbd" stroke="#8f826a" strokeWidth={1.2}/></g>); })}
      <path d={`M-26,${-h * 0.8} L${w / 2},${-h} L${w + 26},${-h * 0.8} Z`} fill="#e3d9c3" stroke="#8f826a" strokeWidth={1.8} strokeLinejoin="round"/>
      <path d={`M${w / 2},${-h} L${w + 26},${-h * 0.8} L${w / 2},${-h * 0.8} Z`} fill="#8f826a" opacity={0.22}/>
      <rect x={w / 2 - 70} y={-h * 0.8 - 52} width={140} height={36} rx={4} fill="#2a3a5c" stroke="#d9b45a" strokeWidth={2}/>
      <text x={w / 2} y={-h * 0.8 - 26} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={24} letterSpacing="0.3em" fill="#f6e3a8">BANK</text>
      <path d={`M${w / 2 - 34},${-28} V${-h * 0.8 + 86} Q${w / 2},${-h * 0.8 + 56} ${w / 2 + 34},${-h * 0.8 + 86} V${-28} Z`} fill="#4a3220" stroke="#2a1a0c" strokeWidth={1.6}/>
    </g>
  );
};

// ---- village set -----------------------------------------------------------------------------------------------------------------
export const House: React.FC<{x: number; y: number; w: number; h: number; wall: string; roof: string; op?: number; glow?: number}> = ({x, y, w, h, wall, roof, op = 1, glow = 0}) => (
  <g opacity={op}>
    <ellipse cx={x + w * 0.6} cy={y + 4} rx={w * 0.75} ry={10} fill="#2a1808" opacity={0.2}/>
    <rect x={x} y={y - h} width={w} height={h} fill={wall} stroke="#00000026" strokeWidth={1.4}/>
    <rect x={x} y={y - h} width={w * 0.28} height={h} fill="#fff" opacity={0.12}/>
    <rect x={x + w * 0.66} y={y - h} width={w * 0.34} height={h} fill="#3a2412" opacity={0.14}/>
    <rect x={x} y={y - 14} width={w} height={14} fill="#8a6a46" opacity={0.35}/>
    <path d={`M${x - 16},${y - h + 6} L${x + w + 16},${y - h + 6} L${x + w * 0.84},${y - h - h * 0.52} L${x + w * 0.16},${y - h - h * 0.52} Z`} fill={roof} stroke="#00000033" strokeWidth={1.6} strokeLinejoin="round"/>
    {[0.22, 0.38, 0.54, 0.7, 0.86].map((u, i) => <path key={i} d={`M${x + w * (0.1 + 0.8 * u) - (1 - u) * 6},${y - h + 6} L${x + w * (0.16 + 0.68 * u)},${y - h - h * 0.52}`} stroke="#00000030" strokeWidth={1.2}/>)}
    <path d={`M${x - 16},${y - h + 6} L${x + w + 16},${y - h + 6}`} stroke="#fff" strokeWidth={2} opacity={0.3}/>
    <path d={`M${x + w * 0.4},${y} V${y - h * 0.5} Q${x + w * 0.5},${y - h * 0.68} ${x + w * 0.6},${y - h * 0.5} V${y} Z`} fill="#5a3c22" stroke="#2f1d0e" strokeWidth={1.4}/>
    {glow > 0 && <path d={`M${x + w * 0.43},${y} V${y - h * 0.48} Q${x + w * 0.5},${y - h * 0.62} ${x + w * 0.57},${y - h * 0.48} V${y} Z`} fill="#ffd37a" opacity={0.55 * glow}/>}
    <rect x={x + w * 0.1} y={y - h * 0.72} width={w * 0.2} height={h * 0.24} fill="#35261a" stroke="#00000040" strokeWidth={1.2}/>
    <rect x={x + w * 0.04} y={y - h * 0.72} width={w * 0.06} height={h * 0.24} fill="#3f7a58" opacity={0.95}/><rect x={x + w * 0.3} y={y - h * 0.72} width={w * 0.06} height={h * 0.24} fill="#3f7a58" opacity={0.95}/>
  </g>
);

export const Palm: React.FC<{x: number; y: number; s?: number; f: number; seed?: number; op?: number}> = ({x, y, s = 1, f, seed = 1, op = 1}) => {
  const sway = Math.sin(f / 21 + seed) * 2.2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
      <ellipse cx={30} cy={4} rx={70} ry={9} fill="#2a1808" opacity={0.2}/>
      <path d="M-8,0 Q-2,-120 26,-250 L38,-248 Q14,-120 14,0 Z" fill="#8a6a46" stroke="#4a3220" strokeWidth={1.6}/>
      {Array.from({length: 8}, (_, i) => <path key={i} d={`M-6,${-i * 30} L18,${-i * 30 - 6}`} stroke="#4a3220" strokeWidth={1.2} opacity={0.5}/>)}
      <g transform={`translate(32 -250) rotate(${sway})`}>
        {[-150, -112, -74, -36, 0, 36, 74, 112, 150].map((a, i) => (
          <g key={i} transform={`rotate(${a * 0.62})`}>
            <path d={`M0,0 Q${a > 0 ? 50 : -50},-64 ${a > 0 ? 112 : -112},${-20 + Math.abs(a) * 0.3}`} stroke="#25592f" strokeWidth={10} fill="none" strokeLinecap="round"/>
            <path d={`M0,0 Q${a > 0 ? 50 : -50},-66 ${a > 0 ? 112 : -112},${-22 + Math.abs(a) * 0.3}`} stroke="#4c9a4a" strokeWidth={6} fill="none" strokeLinecap="round"/>
          </g>
        ))}
        <circle cx={-6} cy={8} r={9} fill="#6a4a2c"/><circle cx={10} cy={10} r={8} fill="#7a5a36"/>
      </g>
    </g>
  );
};

/** open air behind and beside the shop: sky, hills, palms, tiled houses, a well, the lane. x0 is where the open lane starts (the shop room covers the left). */
export const VillageOutdoors: React.FC<{f: number; dur: number; sun?: P; houses?: boolean; glowDoors?: number; haze?: number}> = ({f, dur, sun = [1700, 190], houses = true, glowDoors = 0, haze = 1}) => {
  const par = Math.sin((f / Math.max(1, dur)) * 3) * 5;
  return (
    <g>
      <F1Defs/><E1Defs/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#e1-sky)"/>
      <Sun x={sun[0]} y={sun[1]} r={46} f={f} glow={0.95}/>
      {[0, 1, 2].map((i) => <Cloud key={i} x={900 + i * 540} y={120 + (i % 2) * 70} s={0.7} f={f} speed={0.1} seed={i + 5} a={0.72}/>)}
      <g transform={`translate(${par} 0)`}>
        <Hills id="f1h1" base={560} amp={44} top="#b9cbdd" bottom="#d6dfe0" seed={1.9} wl={310}/>
        <Hills id="f1h2" base={640} amp={30} top="#a7c2a4" bottom="#cbd8aa" seed={4.3} wl={250}/>
        <Palm x={1010} y={690} s={0.78} f={f} seed={1} op={0.9}/><Palm x={1840} y={690} s={0.7} f={f} seed={2} op={0.9}/><Palm x={1420} y={684} s={0.6} f={f} seed={3} op={0.86}/>
      </g>
      {houses && <g transform={`translate(${par * 1.6} 0)`} opacity={haze}>
        <House x={960} y={728} w={190} h={140} wall="#e8cf9f" roof="#b4562e" op={0.95} glow={glowDoors}/>
        <House x={1250} y={722} w={170} h={120} wall="#d9b08a" roof="#9a4228" op={0.9} glow={glowDoors}/>
        <House x={1620} y={730} w={220} h={150} wall="#ead9b0" roof="#a64a2a" op={0.96} glow={glowDoors}/>
      </g>}
      <rect x={-60} y={640} width={W + 120} height={90} fill="#d7e1e2" opacity={0.2}/>
      <rect x={-60} y={724} width={W + 120} height={H - 724 + 60} fill="url(#e1-ground)"/>
      <rect x={-60} y={724} width={W + 120} height={20} fill="#f0dcb4" opacity={0.7}/>
      {Array.from({length: 7}, (_, i) => <path key={i} d={`M-60,${760 + i * i * 7 + i * 16} L${W + 60},${760 + i * i * 7 + i * 16}`} stroke="#6a4a2a" strokeWidth={1.2} opacity={0.15}/>)}
      {Array.from({length: 16}, (_, i) => <ellipse key={i} cx={(i * 263) % W} cy={790 + ((i * 71) % 220)} rx={10 + (i % 4) * 5} ry={3 + (i % 3)} fill="#7a5a36" opacity={0.2}/>)}
      <ellipse cx={1500} cy={880} rx={520} ry={34} fill="#fff" opacity={0.07}/>
      {Array.from({length: 18}, (_, i) => { const u = (f * 0.004 + i * 0.151) % 1; return <circle key={i} cx={(i * 223 + u * 90) % W} cy={600 + ((i * 89) % 330) - u * 40} r={1.6 + (i % 3)} fill="#fff4c8" opacity={0.5 * Math.sin(u * Math.PI)}/>; })}
    </g>
  );
};

/** the market stall on the lane (right side): awning, produce, a counter; receipts pile is drawn by the caller */
export const Stall: React.FC<{x: number; w: number; f: number; c1?: string}> = ({x, w, f, c1 = "#2f7a4a"}) => (
  <g transform="translate(0 -20)">
    <rect x={x + 10} y={380} width={9} height={290} fill="#6a4a2c" stroke="#3a2412" strokeWidth={1.4}/><rect x={x + w - 20} y={380} width={9} height={290} fill="#6a4a2c" stroke="#3a2412" strokeWidth={1.4}/>
    <rect x={x + 19} y={440} width={w - 39} height={230} fill="#3a2a1c" opacity={0.9}/>
    {[0, 1].map((r) => <rect key={r} x={x + 19} y={500 + r * 76} width={w - 39} height={8} fill="#8a5a30" stroke="#3a2412" strokeWidth={1}/>)}
    {Array.from({length: 7}, (_, i) => <g key={i} transform={`translate(${x + 56 + i * ((w - 112) / 6)} ${496})`}><circle r={15} fill={`url(#e1-${["apple", "orange", "guava", "mango"][i % 4]})`} stroke="#00000030"/></g>)}
    {Array.from({length: 7}, (_, i) => <g key={i} transform={`translate(${x + 56 + i * ((w - 112) / 6)} ${572})`}><circle r={15} fill={`url(#e1-${["guava", "mango", "apple", "orange"][i % 4]})`} stroke="#00000030"/></g>)}
    <Awning x={x - 12} y={330} w={w + 24} h={56} c1={c1} c2="#fff4e0" n={8} f={f}/>
    <rect x={x - 6} y={660} width={w + 12} height={26} rx={5} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
    <rect x={x + 10} y={686} width={w - 20} height={290} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
    <rect x={x - 6} y={660} width={w + 12} height={5} fill="#fff" opacity={0.28}/>
    {Array.from({length: 5}, (_, i) => <rect key={i} x={x + 30 + i * ((w - 80) / 5)} y={706} width={(w - 80) / 5 - 14} height={120} rx={6} fill="none" stroke="#d9a468" strokeWidth={1.6} opacity={0.35}/>)}
  </g>
);

/** a stack of paper receipts seen from the front; n layers */
export const ReceiptPile: React.FC<{x: number; y: number; n: number; glow?: number; s?: number}> = ({x, y, n, glow = 0, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {glow > 0.01 && <ellipse cx={0} cy={-18} rx={110} ry={48} fill="url(#ak-sunglow)" opacity={glow}/>}
    <ellipse cx={0} cy={4} rx={60} ry={8} fill="#2a1808" opacity={0.25}/>
    {Array.from({length: Math.max(1, Math.round(n))}, (_, i) => (
      <g key={i} transform={`translate(${Math.sin(i * 2.3) * 4} ${-i * 5.4}) rotate(${Math.sin(i * 1.7) * 3.4})`}>
        <rect x={-34} y={-8} width={68} height={10} rx={2} fill="url(#f1-paper)" stroke="#b8a074" strokeWidth={1.4}/>
        <rect x={-34} y={-8} width={68} height={3} fill="#fff" opacity={0.5}/>
      </g>
    ))}
  </g>
);
