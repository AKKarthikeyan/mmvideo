// POL-03 Part 1, builder W2: shared parts (labels by key, gradients, brick, paper, brass plaque, empty judge's chair, hands, wall and desk).
import React from "react";
import {SANS, SERIF, W, H, eo, eio, clamp} from "../kit";
import {lab as labQ} from "../../cartoon/long/figs";
import {prog, type AP} from "./analogy_kit";

export type KL = {text: string; at: number; isLab: boolean};
/** spec labels by key: `{lab}` prints lab(lab), `{text}` prints the text as given; `at` is the reveal frame */
export const lk = (p: AP): Record<string, KL> => {
  const out: Record<string, KL> = {};
  for (const l of ((p.spec as any).labels ?? []) as {text?: string; lab?: string; key: string}[]) out[l.key] = {text: l.lab ? labQ(l.lab) : l.text ?? "", at: p.at(l.key), isLab: !!l.lab};
  return out;
};
export const a01 = (f: number, at: number, d = 14) => eo(prog(f, at, d));
export const sm = (f: number, at: number, d: number) => eio(prog(f, at, d));

export const WDefs: React.FC = () => (
  <defs>
    <linearGradient id="w2-brick" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9704a"/><stop offset="1" stopColor="#9c4a2c"/></linearGradient>
    <linearGradient id="w2-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe9a0"/><stop offset="0.5" stopColor="#f4c24c"/><stop offset="1" stopColor="#c9902a"/></linearGradient>
    <linearGradient id="w2-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c99a62"/><stop offset="1" stopColor="#7e4f28"/></linearGradient>
    <linearGradient id="w2-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#efe0c0"/><stop offset="1" stopColor="#dcc79b"/></linearGradient>
    <linearGradient id="w2-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f3d98a"/><stop offset="0.5" stopColor="#c9a145"/><stop offset="1" stopColor="#8f6c22"/></linearGradient>
    <linearGradient id="w2-paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffaf0"/><stop offset="1" stopColor="#f0e4c8"/></linearGradient>
    <linearGradient id="w2-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#74aedc"/><stop offset="0.7" stopColor="#c9dfe4"/><stop offset="1" stopColor="#f6e8c6"/></linearGradient>
    <filter id="w2-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="w2-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="w2-shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#2a1808" floodOpacity="0.32"/></filter>
  </defs>
);

/** pale interior wall with skirting, a window of daylight and a soft light patch */
export const Wall: React.FC<{y1?: number; win?: [number, number]}> = ({y1 = 600, win}) => (
  <g>
    <rect x={-60} y={-60} width={W + 120} height={y1 + 60} fill="url(#w2-wall)"/>
    {Array.from({length: 14}, (_, i) => <rect key={i} x={i * 150 - 30} y={-60} width={2} height={y1 + 60} fill="#b99a64" opacity={0.1}/>)}
    {win && (
      <g transform={`translate(${win[0]} ${win[1]})`}>
        <rect x={-6} y={-6} width={332} height={292} rx={6} fill="#a47a4a"/>
        <rect width={320} height={280} rx={3} fill="url(#w2-sky)"/>
        <ellipse cx={90} cy={90} rx={70} ry={26} fill="#fff" opacity={0.85}/><ellipse cx={220} cy={150} rx={80} ry={24} fill="#fff" opacity={0.7}/>
        <rect x={156} width={8} height={280} fill="#a47a4a"/><rect y={136} width={320} height={8} fill="#a47a4a"/>
        <path d="M-6,300 L330,300 L560,640 L-160,640 Z" fill="#fff6d8" opacity={0.18}/>
      </g>
    )}
    <rect x={-60} y={y1 - 26} width={W + 120} height={26} fill="#b78f5a"/><rect x={-60} y={y1 - 26} width={W + 120} height={4} fill="#e8c88a"/>
  </g>
);

/** wooden desk top from y0 down, with grain and a lit front edge */
export const Desk: React.FC<{y0: number}> = ({y0}) => (
  <g>
    <rect x={-40} y={y0} width={W + 80} height={H - y0 + 80} fill="url(#w2-wood)"/>
    {Array.from({length: 9}, (_, i) => <path key={i} d={`M-40,${y0 + 30 + i * 36} Q960,${y0 + 22 + i * 36 + (i % 2) * 9} 1960,${y0 + 30 + i * 36}`} stroke="#6e4524" strokeWidth={1.6} fill="none" opacity={0.5}/>)}
    <rect x={-40} y={y0 - 5} width={W + 80} height={9} fill="#ecd09a" opacity={0.8}/>
  </g>
);

/** brick courses in a rectangle; `gaps` leaves holes (index = row*cols+col) */
export const Bricks: React.FC<{x: number; y: number; w: number; h: number; bw?: number; bh?: number; gaps?: number[]; seed?: number}> = ({x, y, w, h, bw = 46, bh = 24, gaps = [], seed = 1}) => {
  const rows = Math.floor(h / bh), cols = Math.ceil(w / bw) + 1, out: React.ReactNode[] = [], cid = `w2bk${x}_${y}`;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (gaps.includes(r * 100 + c)) continue;
    const bx = x + c * bw - (r % 2 ? bw / 2 : 0), t = ((r * 7 + c * 13 + seed * 5) % 9) / 9;
    out.push(<rect key={`${r}-${c}`} x={bx + 1} y={y + r * bh + 1} width={bw - 2} height={bh - 2} rx={2}
      fill={`rgb(${176 + Math.round(t * 30)},${90 + Math.round(t * 26)},${58 + Math.round(t * 16)})`} stroke="#7d3a20" strokeWidth={0.8}/>);
  }
  return <g><defs><clipPath id={cid}><rect x={x} y={y} width={w} height={h}/></clipPath></defs><rect x={x} y={y} width={w} height={h} fill="#6e3a24"/><g clipPath={`url(#${cid})`}>{out}</g></g>;
};

/** a brass plaque with engraved text */
export const Plaque: React.FC<{x: number; y: number; w: number; h: number; text: string; size?: number; a?: number}> = ({x, y, w, h, text, size = 30, a = 1}) => (
  <g transform={`translate(${x} ${y})`} opacity={a} filter="url(#w2-shadow)">
    <rect x={-w / 2 - 8} y={-h / 2 - 8} width={w + 16} height={h + 16} rx={10} fill="#5b3a1c"/>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill="url(#w2-brass)" stroke="#7a5a1c" strokeWidth={2}/>
    <rect x={-w / 2 + 8} y={-h / 2 + 8} width={w - 16} height={h - 16} rx={3} fill="none" stroke="#fff3c0" strokeWidth={1.4} opacity={0.7}/>
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a1, b1], i) => <circle key={i} cx={a1 * (w / 2 - 16)} cy={b1 * (h / 2 - 16)} r={3.4} fill="#6b4a14"/>)}
    <text x={0} y={size * 0.34} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={size} letterSpacing="0.1em" fill="#4a3208" stroke="#fff3c0" strokeWidth={0.5} strokeOpacity={0.5}>{text}</text>
  </g>
);

/** a sheet of paper with title bar and text lines */
export const Sheet: React.FC<{x: number; y: number; w: number; h: number; rot?: number; lines?: number; head?: string; headCol?: string; a?: number; children?: React.ReactNode}> = ({x, y, w, h, rot = 0, lines = 6, head, headCol = "#8c2a1c", a = 1, children}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={a} filter="url(#w2-shadow)">
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={5} fill="url(#w2-paper)" stroke="#bda57a" strokeWidth={1.6}/>
    {head && <rect x={-w / 2 + 22} y={-h / 2 + 22} width={w - 44} height={Math.max(14, h * 0.07)} rx={3} fill={headCol} opacity={0.88}/>}
    {Array.from({length: lines}, (_, i) => <rect key={i} x={-w / 2 + 22} y={-h / 2 + (head ? 62 : 28) + i * Math.max(18, (h - 100) / Math.max(1, lines))} width={(w - 44) * (i % 3 === 2 ? 0.62 : i % 3 === 1 ? 0.9 : 1)} height={5} rx={2.5} fill="#8a7a5a" opacity={0.5}/>)}
    {children}
  </g>
);

/** an empty judge's chair: high back, cushion, arms; `col` tints the cushion and the back's ribbon */
export const Chair: React.FC<{x: number; y: number; s?: number; col?: [string, string]; a?: number; glow?: number}> = ({x, y, s = 1, col = ["#c8c8c8", "#8a8a8a"], a = 1, glow = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={a}>
    <ellipse cx={0} cy={4} rx={62} ry={11} fill="#2a1808" opacity={0.28}/>
    {glow > 0.01 && <ellipse cx={0} cy={-90} rx={86} ry={110} fill={col[0]} opacity={0.35 * glow} filter="url(#w2-glow)"/>}
    <path d="M-44,-190 Q0,-206 44,-190 L50,-92 L-50,-92 Z" fill="#6b4023" stroke="#3d2310" strokeWidth={2.4}/>
    <path d="M-34,-178 Q0,-192 34,-178 L38,-102 L-38,-102 Z" fill="#8a5a34"/>
    <path d="M-34,-178 Q0,-192 34,-178 L36,-150 Q0,-160 -36,-150 Z" fill={col[0]} opacity={0.9}/>
    <path d="M-34,-178 Q0,-192 34,-178" stroke={col[1]} strokeWidth={3} fill="none"/>
    <rect x={-62} y={-104} width={14} height={50} rx={5} fill="#5a361c"/><rect x={48} y={-104} width={14} height={50} rx={5} fill="#5a361c"/>
    <rect x={-56} y={-96} width={112} height={26} rx={9} fill={col[0]} stroke={col[1]} strokeWidth={2.4}/>
    <rect x={-56} y={-96} width={112} height={8} rx={4} fill="#fff" opacity={0.25}/>
    <path d="M-52,-72 L52,-72 L48,-58 L-48,-58 Z" fill="#6b4023"/>
    <rect x={-50} y={-58} width={10} height={58} fill="#4f2f17"/><rect x={40} y={-58} width={10} height={58} fill="#4f2f17"/>
  </g>
);

/** a hand and forearm reaching in from an angle; ang in degrees (0 = reaching right) */
export const HandArm: React.FC<{x: number; y: number; ang: number; len?: number; skin?: [string, string]; sleeve?: string; fist?: boolean}> = ({x, y, ang, len = 150, skin = ["#d8a47a", "#a8754f"], sleeve = "#d9b26a", fist}) => (
  <g transform={`translate(${x} ${y}) rotate(${ang})`}>
    <path d={`M${-len - 80},-26 L${-len},-24 L${-len},24 L${-len - 80},30 Z`} fill={sleeve} stroke="#00000022" strokeWidth={1.4}/>
    <path d={`M${-len},-22 L-22,-18 Q0,-18 8,-10 Q20,-6 20,6 Q16,16 4,16 L-22,22 L${-len},22 Z`} fill={skin[0]} stroke="#6a3f26" strokeWidth={1.8} strokeLinejoin="round"/>
    <path d={`M${-len},4 L-22,10 L4,16 L-22,22 L${-len},22 Z`} fill={skin[1]} opacity={0.4}/>
    {!fist && <path d="M-6,-12 Q14,-30 28,-24 Q22,-12 8,-6" fill={skin[0]} stroke="#6a3f26" strokeWidth={1.6} strokeLinejoin="round"/>}
    {fist && <path d="M-4,-14 Q10,-26 22,-18" stroke="#6a3f26" strokeWidth={1.6} fill="none"/>}
  </g>
);

export const Tick: React.FC<{x: number; y: number; s?: number; a?: number; col?: string}> = ({x, y, s = 1, a = 1, col = "#2f9a4a"}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={a}>
    <circle r={22} fill="#fff" stroke={col} strokeWidth={4}/><path d="M-10,0 L-3,8 L11,-9" stroke={col} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
);
export const Cross: React.FC<{x: number; y: number; s?: number; a?: number; col?: string; w?: number}> = ({x, y, s = 1, a = 1, col = "#c0352b", w = 9}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={a} strokeLinecap="round">
    <path d="M-42,-42 L42,42 M42,-42 L-42,42" stroke="#fff" strokeWidth={w + 5}/><path d="M-42,-42 L42,42 M42,-42 L-42,42" stroke={col} strokeWidth={w}/>
  </g>
);
export const clampN = clamp;
export {SANS};
