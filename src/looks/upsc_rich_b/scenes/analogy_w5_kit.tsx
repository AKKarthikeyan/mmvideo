// POL-03 Part 3 (Fundamental Rights), builder W5: shared parts. Daylight look B: warm light, soft shadows, thin coloured outlines.
// Every motion is a smooth function of f and at(key). No real person, emblem, seal or community marker (CONTRACT_B_POL03_P3.md).
import React from "react";
import {SANS, SERIF, W, H, clamp, eo} from "../kit";
import {prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";

export const W5Defs: React.FC = () => (
  <defs>
    <linearGradient id="w5-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b98450"/><stop offset="1" stopColor="#6e4424"/></linearGradient>
    <linearGradient id="w5-paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffaf0"/><stop offset="1" stopColor="#efe1c2"/></linearGradient>
    <linearGradient id="w5-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f1e6d0"/><stop offset="1" stopColor="#d6c3a0"/></linearGradient>
    <linearGradient id="w5-stoned" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#cdb48c"/><stop offset="1" stopColor="#a88a60"/></linearGradient>
    <linearGradient id="w5-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9a6236"/><stop offset="1" stopColor="#5e3518"/></linearGradient>
    <linearGradient id="w5-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6dd8a"/><stop offset="0.5" stopColor="#c99a3a"/><stop offset="1" stopColor="#7a5414"/></linearGradient>
    <linearGradient id="w5-red" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b8463a"/><stop offset="1" stopColor="#6e1e18"/></linearGradient>
    <linearGradient id="w5-blue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3f78a8"/><stop offset="1" stopColor="#1d3f66"/></linearGradient>
    <linearGradient id="w5-green" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4f9a62"/><stop offset="1" stopColor="#245a34"/></linearGradient>
    <linearGradient id="w5-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fbfe2"/><stop offset="0.65" stopColor="#d9e8e2"/><stop offset="1" stopColor="#f8e6c0"/></linearGradient>
    <linearGradient id="w5-dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f2b98a"/><stop offset="0.55" stopColor="#f8dcb0"/><stop offset="1" stopColor="#fbeccb"/></linearGradient>
    <linearGradient id="w5-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9c08e"/><stop offset="1" stopColor="#b08f5c"/></linearGradient>
    <linearGradient id="w5-room" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#efe0c2"/><stop offset="1" stopColor="#d8c29a"/></linearGradient>
    <radialGradient id="w5-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#fff2c0" stopOpacity="0.9"/><stop offset="1" stopColor="#ffd37a" stopOpacity="0"/></radialGradient>
    <radialGradient id="w5-lamp" cx="30%" cy="10%" r="80%"><stop offset="0" stopColor="#fff4d6" stopOpacity="0.55"/><stop offset="1" stopColor="#fff4d6" stopOpacity="0"/></radialGradient>
    <filter id="w5-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>
);

/** a soft cast shadow ellipse */
export const Shadow: React.FC<{x: number; y: number; rx: number; ry?: number; a?: number}> = ({x, y, rx, ry = rx * 0.14, a = 0.28}) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#2a1606" opacity={a} filter="url(#w5-soft)"/>
);

/** a wooden desk top filling the frame from y0 down, lit from the top left */
export const Desk: React.FC<{y0: number}> = ({y0}) => (
  <g>
    <rect x={-60} y={y0} width={W + 120} height={H - y0 + 80} fill="url(#w5-desk)"/>
    {Array.from({length: 9}, (_, i) => <path key={i} d={`M-60,${y0 + 26 + i * 36} Q960,${y0 + 18 + i * 36 + (i % 2) * 9} ${W + 60},${y0 + 26 + i * 36}`} stroke="#5a3418" strokeWidth={1.6} fill="none" opacity={0.45}/>)}
    <rect x={-60} y={y0 - 3} width={W + 120} height={7} fill="#ecd09a" opacity={0.7}/>
  </g>
);

/** a warm room wall above y0, with a window of light */
export const Room: React.FC<{y0: number; win?: [number, number]}> = ({y0, win = [1500, 120]}) => (
  <g>
    <rect x={-60} y={-60} width={W + 120} height={y0 + 60} fill="url(#w5-room)"/>
    <rect x={win[0] - 150} y={win[1]} width={300} height={260} rx={8} fill="url(#w5-sky)" stroke="#8a6238" strokeWidth={10}/>
    <path d={`M${win[0]},${win[1]} V${win[1] + 260} M${win[0] - 150},${win[1] + 130} H${win[0] + 150}`} stroke="#8a6238" strokeWidth={6}/>
    <path d={`M${win[0] - 150},${win[1] + 260} L${win[0] - 520},${y0} H${win[0] + 40} L${win[0] + 150},${win[1] + 260} Z`} fill="#fff4d0" opacity={0.18}/>
    <rect x={-60} y={-60} width={W + 120} height={y0 + 60} fill="url(#w5-lamp)"/>
  </g>
);

/** a closed book lying flat in 3/4 view; cover colour, spine title, an emblem drawn by `icon` */
export const Book: React.FC<{x: number; y: number; w?: number; h?: number; cover: string; title: string; icon?: React.ReactNode; rot?: number}> = ({x, y, w = 460, h = 300, cover, title, icon, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <Shadow x={0} y={h / 2 + 18} rx={w * 0.55} a={0.32}/>
    <path d={`M${-w / 2},${-h / 2 + 18} H${w / 2} V${h / 2 + 18} H${-w / 2} Z`} fill="#f6ecd4" stroke="#b8a074" strokeWidth={2}/>
    {[4, 9, 14].map((d) => <path key={d} d={`M${-w / 2 + 6},${h / 2 + d} H${w / 2 - 6}`} stroke="#d8c8a2" strokeWidth={2}/>)}
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={cover} stroke="#2a1606" strokeOpacity={0.35} strokeWidth={3}/>
    <rect x={-w / 2} y={-h / 2} width={34} height={h} rx={8} fill="#000" opacity={0.18}/>
    <rect x={-w / 2 + 50} y={-h / 2 + 24} width={w - 80} height={h - 48} rx={6} fill="none" stroke="#f3d27a" strokeWidth={3} opacity={0.75}/>
    <text x={17} y={-h / 2 + 76} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={50} fill="#fbe7b0" letterSpacing="0.06em">{title}</text>
    <g transform={`translate(17 ${h / 2 - 90})`}>{icon}</g>
    <path d={`M${-w / 2 + 40},${-h / 2 + 8} H${w / 2 - 12}`} stroke="#fff" strokeWidth={3} opacity={0.18}/>
  </g>
);

/** a gavel icon (Part III: enforceable) */
export const Gavel: React.FC<{s?: number; swing?: number}> = ({s = 1, swing = 0}) => (
  <g transform={`scale(${s}) rotate(${-30 + swing * 22})`}>
    <rect x={-6} y={-6} width={110} height={12} rx={6} fill="#6e3f1e" stroke="#3a1e0c" strokeWidth={2}/>
    <rect x={-44} y={-26} width={52} height={52} rx={10} fill="url(#w5-wood)" stroke="#3a1e0c" strokeWidth={3}/>
    <rect x={-48} y={-30} width={10} height={60} rx={4} fill="url(#w5-brass)"/><rect x={2} y={-30} width={10} height={60} rx={4} fill="url(#w5-brass)"/>
  </g>
);

/** a compass rose with a needle (Part IV: direction, not command); needle angle in degrees */
export const Compass: React.FC<{s?: number; needle?: number}> = ({s = 1, needle = 0}) => (
  <g transform={`scale(${s})`}>
    <circle r={52} fill="#fff7e2" stroke="url(#w5-brass)" strokeWidth={8}/>
    {[0, 90, 180, 270].map((a) => <path key={a} d="M0,-44 L6,-30 H-6 Z" fill="#8a6238" transform={`rotate(${a})`}/>)}
    <g transform={`rotate(${needle})`}><path d="M0,-40 L8,0 L0,8 L-8,0 Z" fill="#c0392b"/><path d="M0,40 L8,0 L0,-8 L-8,0 Z" fill="#3b4a5c"/></g>
    <circle r={6} fill="url(#w5-brass)"/>
  </g>
);

/** a generic classical building front: steps, columns, pediment; doors open by `open` 0..1 */
export const Portico: React.FC<{x: number; y: number; w: number; h: number; cols?: number; open?: number; tone?: "stone" | "warm"; doorW?: number; children?: React.ReactNode}> = ({x, y, w, h, cols = 6, open = 0, tone = "stone", doorW = 0.22, children}) => {
  const dw = w * doorW, dh = h * 0.5, dx = x - dw / 2, dy = y - dh, colTop = y - h + h * 0.22;
  return (
    <g>
      <Shadow x={x} y={y + 30} rx={w * 0.62} a={0.25}/>
      {[0, 1, 2].map((i) => <rect key={i} x={x - w / 2 - 30 + i * 12} y={y + i * 14} width={w + 60 - i * 24} height={14} fill={i % 2 ? "#cdb48c" : "#e4d3b0"} stroke="#a88a60" strokeWidth={1.5}/>)}
      <rect x={x - w / 2} y={colTop} width={w} height={y - colTop} fill={tone === "warm" ? "#efd9b0" : "url(#w5-stone)"} stroke="#a88a60" strokeWidth={2}/>
      <rect x={dx - 8} y={dy - 8} width={dw + 16} height={dh + 8} rx={4} fill="#3a2412"/>
      <rect x={dx} y={dy} width={dw} height={dh} fill="#fff1c4" opacity={0.25 + 0.65 * open}/>
      <rect x={dx} y={dy} width={(dw / 2) * (1 - open * 0.85)} height={dh} fill="url(#w5-wood)" stroke="#3a1e0c" strokeWidth={2}/>
      <rect x={dx + dw - (dw / 2) * (1 - open * 0.85)} y={dy} width={(dw / 2) * (1 - open * 0.85)} height={dh} fill="url(#w5-wood)" stroke="#3a1e0c" strokeWidth={2}/>
      {Array.from({length: cols}, (_, i) => {
        const cx = x - w / 2 + (w / cols) * (i + 0.5);
        if (Math.abs(cx - x) < dw / 2 + 20) return null;
        return <g key={i}><rect x={cx - 18} y={colTop + 10} width={36} height={y - colTop - 10} fill="url(#w5-stoned)"/><rect x={cx - 26} y={colTop} width={52} height={14} fill="#e4d3b0"/>
          {[-8, 0, 8].map((d) => <path key={d} d={`M${cx + d},${colTop + 16} V${y - 4}`} stroke="#8a7050" strokeWidth={1.4} opacity={0.5}/>)}</g>;
      })}
      <rect x={x - w / 2 - 20} y={colTop - 30} width={w + 40} height={34} fill="#e4d3b0" stroke="#a88a60" strokeWidth={2}/>
      <path d={`M${x - w / 2 - 30},${colTop - 30} L${x},${colTop - 30 - h * 0.2} L${x + w / 2 + 30},${colTop - 30} Z`} fill="url(#w5-stone)" stroke="#a88a60" strokeWidth={3}/>
      {children}
    </g>
  );
};

/** a paper sheet / card drawn in SVG */
export const Sheet: React.FC<{x: number; y: number; w: number; h: number; rot?: number; a?: number; children?: React.ReactNode}> = ({x, y, w, h, rot = 0, a = 1, children}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={a}>
    <rect x={-w / 2 + 6} y={-h / 2 + 10} width={w} height={h} rx={6} fill="#2a1606" opacity={0.22} filter="url(#w5-soft)"/>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill="url(#w5-paper)" stroke="#c9b48a" strokeWidth={2}/>
    {children}
  </g>
);

/** a short handwritten-looking text line drawn in SVG (labels inside drawings: words only, no figures) */
export const Ink: React.FC<{x: number; y: number; t: string; size?: number; c?: string; a?: number; anchor?: "start" | "middle" | "end"; w?: number}> = ({x, y, t, size = 30, c = "#3a2412", a = 1, anchor = "middle", w = 700}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={SANS} fontWeight={700} fontSize={size} fill={c} opacity={a} letterSpacing="0.08em">{t}</text>
);

/** labels: each spec label whose key has a slot is drawn as a paper card at that slot, from at(key) */
export type Slot = {cx: number; y: number; size?: number; maxW?: number; tone?: "warm" | "cool" | "green" | "dark"; upper?: boolean};
export const slotLabels = (slots: Record<string, Slot>): React.FC<AP> => (p) => {
  const labs = ((p.spec as any).labels ?? []) as {key: string}[], L = rlabs(p);
  return <>{labs.map((l, i) => {
    const s = slots[l.key];
    if (!s) return null;
    return <P2Card key={l.key} cx={s.cx} y={s.y} text={L[i].text} f={p.f} at={L[i].at} size={s.size ?? 36} maxW={s.maxW ?? 760} tone={s.tone ?? "warm"} upper={s.upper ?? false}/>;
  })}</>;
};

/** a soft reveal value for a key that may be absent in this scene's spec */
export const atOr = (p: AP, key: string, dflt = 1e9) => {
  const labs = ((p.spec as any).labels ?? []) as {key: string}[];
  return labs.some((l) => l.key === key) ? p.at(key) : dflt;
};
export const show = (p: AP, key: string, d = 16, lead = 0) => eo(prog(p.f, atOr(p, key) - lead, d));
export {clamp, eo, prog, W, H, SANS, SERIF};
