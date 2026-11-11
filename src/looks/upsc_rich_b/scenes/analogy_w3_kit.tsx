// POL-03 Parts 1-2, builder W3: shared parts (gradients, stone wall, floor, empty chairs, glass box, shield, light shafts). Smooth functions of f only.
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, eio, rng} from "../kit";
import {prog} from "./analogy_kit";

export const W3Defs: React.FC = () => (
  <defs>
    <linearGradient id="w3-iron" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#6a7080"/><stop offset="0.35" stopColor="#2c2f38"/><stop offset="1" stopColor="#1a1c22"/></linearGradient>
    <linearGradient id="w3-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6dd8a"/><stop offset="0.5" stopColor="#c99a3a"/><stop offset="1" stopColor="#7a5414"/></linearGradient>
    <linearGradient id="w3-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b98450"/><stop offset="1" stopColor="#6e4424"/></linearGradient>
    <linearGradient id="w3-woodd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a5a34"/><stop offset="1" stopColor="#4e2f18"/></linearGradient>
    <linearGradient id="w3-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f2fbff" stopOpacity="0.62"/><stop offset="0.5" stopColor="#bfe0ee" stopOpacity="0.22"/><stop offset="1" stopColor="#8fc4dc" stopOpacity="0.42"/></linearGradient>
    <linearGradient id="w3-shield" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6fb0e0"/><stop offset="0.55" stopColor="#2f78b8"/><stop offset="1" stopColor="#1d4f84"/></linearGradient>
    <linearGradient id="w3-shieldg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fd09a"/><stop offset="0.55" stopColor="#2f9a5a"/><stop offset="1" stopColor="#1c6a3c"/></linearGradient>
    <linearGradient id="w3-shielda" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6c46a"/><stop offset="0.55" stopColor="#d88a2a"/><stop offset="1" stopColor="#965a14"/></linearGradient>
    <linearGradient id="w3-paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffaf0"/><stop offset="1" stopColor="#efe1c2"/></linearGradient>
    <linearGradient id="w3-leather" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9a3a30"/><stop offset="1" stopColor="#5a1c18"/></linearGradient>
    <linearGradient id="w3-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fb6e0"/><stop offset="0.6" stopColor="#d3e6e0"/><stop offset="1" stopColor="#fbeac0"/></linearGradient>
    <linearGradient id="w3-beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff4d0" stopOpacity="0.5"/><stop offset="1" stopColor="#fff4d0" stopOpacity="0"/></linearGradient>
    <radialGradient id="w3-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#fff2c0" stopOpacity="0.9"/><stop offset="1" stopColor="#ffd37a" stopOpacity="0"/></radialGradient>
    <radialGradient id="w3-sphere" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#9fb4c8"/></radialGradient>
    <filter id="w3-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="w3-soft14" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="14"/></filter>
  </defs>
);

/** a stone block wall filling a rectangle; tone lightness shifts the palette */
export const StoneWall: React.FC<{x: number; y: number; w: number; h: number; seed?: number; base?: [number, number, number]; row?: number; bw?: number}> = ({x, y, w, h, seed = 3, base = [215, 9, 52], row = 54, bw = 120}) => {
  const r = rng(seed * 31 + 7), rows = Math.ceil(h / row);
  const blocks: React.ReactNode[] = [];
  for (let i = 0; i < rows; i++) {
    let cx = x - ((i % 2) * bw) / 2 - r() * bw * 0.3;
    while (cx < x + w) {
      const ww = bw * (0.8 + r() * 0.4), l = base[2] + (r() - 0.5) * 8;
      blocks.push(<rect key={`${i}-${cx.toFixed(0)}`} x={cx + 1.5} y={y + i * row + 1.5} width={ww - 3} height={row - 3} rx={3} fill={`hsl(${base[0]} ${base[1]}% ${l}%)`} stroke={`hsl(${base[0]} ${base[1] + 2}% ${base[2] - 14}%)`} strokeWidth={1.2}/>);
      blocks.push(<path key={`h${i}-${cx.toFixed(0)}`} d={`M${cx + 5},${y + i * row + 6} H${cx + ww - 9}`} stroke="#fff" strokeWidth={2} opacity={0.12}/>);
      cx += ww;
    }
  }
  return (<g><clipPath id={`w3c-${seed}-${x}-${y}`}><rect x={x} y={y} width={w} height={h}/></clipPath><g clipPath={`url(#w3c-${seed}-${x}-${y})`}>{blocks}</g></g>);
};

/** dust motes drifting in a beam */
export const Motes: React.FC<{f: number; n?: number; x0: number; x1: number; y0: number; y1: number; seed?: number; col?: string}> = ({f, n = 22, x0, x1, y0, y1, seed = 5, col = "#fff6d8"}) => {
  const r = rng(seed * 17 + 1);
  return (<g>{Array.from({length: n}, (_, i) => {
    const bx = x0 + r() * (x1 - x0), by = y0 + r() * (y1 - y0), ph = r() * 6.28, sp = 0.6 + r(), rad = 1.6 + r() * 2.4;
    const x = bx + Math.sin(f / (30 + i) + ph) * 26 * sp, y = ((by - y0 + f * 0.25 * sp) % (y1 - y0)) + y0;
    return <circle key={i} cx={x} cy={y} r={rad} fill={col} opacity={0.35 + 0.35 * Math.sin(f / 22 + ph)}/>;
  })}</g>);
};

/** a high-backed judge's chair, empty (front view). glow lights it; tilt in degrees */
export const Chair: React.FC<{x: number; y: number; s?: number; glow?: number; tone?: "green" | "amber" | "plain"; a?: number}> = ({x, y, s = 1, glow = 0, tone = "plain", a = 1}) => {
  const rim = tone === "green" ? "#2f9a4a" : tone === "amber" ? "#e0902a" : "#3a2412";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={a}>
      {glow > 0.01 && <ellipse cx={0} cy={-70} rx={90} ry={110} fill="url(#w3-glow)" opacity={glow * (tone === "plain" ? 0.7 : 0.9)}/>}
      <ellipse cx={0} cy={4} rx={54} ry={8} fill="#1a0e04" opacity={0.28}/>
      <rect x={-34} y={-30} width={9} height={32} fill="url(#w3-woodd)"/><rect x={25} y={-30} width={9} height={32} fill="url(#w3-woodd)"/>
      <path d="M-42,-124 Q-42,-148 0,-150 Q42,-148 42,-124 L40,-44 L-40,-44 Z" fill="url(#w3-wood)" stroke={rim} strokeWidth={tone === "plain" ? 3 : 5}/>
      <path d="M-30,-118 Q-30,-136 0,-138 Q30,-136 30,-118 L28,-56 L-28,-56 Z" fill="url(#w3-leather)" stroke="#3a1008" strokeWidth={2}/>
      <path d="M-22,-120 Q-8,-130 -6,-60" stroke="#fff" strokeWidth={4} opacity={0.14} fill="none" strokeLinecap="round"/>
      <rect x={-46} y={-48} width={92} height={22} rx={8} fill="url(#w3-leather)" stroke="#3a1008" strokeWidth={2}/>
      <rect x={-46} y={-48} width={92} height={7} rx={3} fill="#fff" opacity={0.15}/>
      <rect x={-50} y={-30} width={100} height={7} rx={3} fill="url(#w3-woodd)"/>
    </g>
  );
};

/** a shield; fill "blue" | "green" | "amber". glow 0..1 */
export const ShieldShape: React.FC<{w?: number; h?: number; fill?: "blue" | "green" | "amber"; glow?: number; children?: React.ReactNode}> = ({w = 200, h = 240, fill = "blue", glow = 0, children}) => {
  const hw = w / 2, hh = h / 2, id = fill === "blue" ? "w3-shield" : fill === "green" ? "w3-shieldg" : "w3-shielda";
  const d = `M${-hw},${-hh * 0.8} Q${-hw * 0.4},${-hh * 0.8} 0,${-hh} Q${hw * 0.4},${-hh * 0.8} ${hw},${-hh * 0.8} L${hw},${-hh * 0.1} Q${hw * 0.9},${hh * 0.62} 0,${hh} Q${-hw * 0.9},${hh * 0.62} ${-hw},${-hh * 0.1} Z`;
  return (
    <g>
      {glow > 0.01 && <ellipse cx={0} cy={0} rx={w * 0.9} ry={h * 0.8} fill="url(#w3-glow)" opacity={glow}/>}
      <path d={d} fill="#1a0e04" opacity={0.28} transform="translate(5 14)" filter="url(#w3-soft)"/>
      <path d={d} fill={`url(#${id})`} stroke="#f4dd96" strokeWidth={7} strokeLinejoin="round"/>
      <path d={d} fill="none" stroke="#fff" strokeWidth={2} opacity={0.35} transform="scale(0.86)"/>
      <path d={`M${-hw * 0.8},${-hh * 0.7} Q${-hw * 0.3},${-hh * 0.76} ${-hw * 0.1},${-hh * 0.9} L${-hw * 0.2},${hh * 0.2} Q${-hw * 0.7},${hh * 0.1} ${-hw * 0.8},${-hh * 0.1} Z`} fill="#fff" opacity={0.14}/>
      {children}
    </g>
  );
};

/** a glass box (front, slight top) with an open/shut lid. open 0..1, children inside */
export const GlassBox: React.FC<{x: number; y: number; w?: number; h?: number; open?: number; glow?: number; tone?: string; plate?: string; a?: number; children?: React.ReactNode; melt?: number}> =
  ({x, y, w = 190, h = 210, open = 0, glow = 0, tone = "#6fb0c8", plate, a = 1, children, melt = 0}) => {
  const lid = open * 62, edge = melt > 0.01 ? `rgba(120,190,220,${0.9 * (1 - melt)})` : "#7fb4c8";
  return (
    <g transform={`translate(${x} ${y})`} opacity={a}>
      {glow > 0.01 && <ellipse cx={0} cy={-h / 2} rx={w * 0.95} ry={h * 0.8} fill="url(#w3-glow)" opacity={glow}/>}
      <ellipse cx={0} cy={4} rx={w * 0.55} ry={9} fill="#1a0e04" opacity={0.28}/>
      <rect x={-w / 2} y={-h} width={w} height={h} rx={9} fill="url(#w3-glass)" stroke={edge} strokeWidth={3.2} opacity={1 - melt * 0.85}/>
      <g opacity={1 - melt * 0.4}>{children}</g>
      <path d={`M${-w / 2 + 12},${-h + 14} L${-w / 2 + 12},${-h * 0.45} M${-w / 2 + 24},${-h + 14} L${-w / 2 + 24},${-h * 0.7}`} stroke="#fff" strokeWidth={4} opacity={0.5 * (1 - melt)} strokeLinecap="round"/>
      <g transform={`translate(${-w / 2} ${-h}) translate(0 ${-open * 22}) rotate(${-open * 24} ${w / 2} 0)`} opacity={1 - melt * 0.85}>
        <path d={`M0,0 L${w},0 L${w - 8},-14 L8,-14 Z`} fill="url(#w3-glass)" stroke={edge} strokeWidth={3}/>
        <rect x={w / 2 - 7} y={-22} width={14} height={9} rx={4} fill="url(#w3-brass)" opacity={0.9}/>
      </g>
      {plate && <g opacity={1 - melt * 0.2}><rect x={-w * 0.4} y={10} width={w * 0.8} height={30} rx={5} fill="#f4e6c4" stroke="#8a6a38" strokeWidth={1.6}/>
        <text x={0} y={32} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={w > 150 ? 19 : 14} letterSpacing="0.14em" fill="#5a3418">{plate}</text></g>}
      {lid < -1 && null}
    </g>
  );
};

export const WoodShelf: React.FC<{x: number; y: number; w: number}> = ({x, y, w}) => (
  <g>
    <rect x={x} y={y} width={w} height={26} rx={4} fill="url(#w3-wood)" stroke="#4e2f18" strokeWidth={2}/>
    <rect x={x} y={y} width={w} height={6} fill="#f2d49a" opacity={0.5}/>
    <rect x={x + 10} y={y + 26} width={w - 20} height={34} fill="#000" opacity={0.18} filter="url(#w3-soft)"/>
    {Array.from({length: Math.floor(w / 120)}, (_, i) => <path key={i} d={`M${x + 20 + i * 120},${y + 12} q40,-4 80,2`} stroke="#6e4524" strokeWidth={1.4} opacity={0.5} fill="none"/>)}
  </g>
);

export { clamp, eo, eio, prog, W, H, SANS, SERIF };
