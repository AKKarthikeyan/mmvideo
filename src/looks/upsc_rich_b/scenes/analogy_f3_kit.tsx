// Shared parts for the ECO-16 Part 2 scenes of builder F3 (plan-steps, two-views, limits-balance, reserve-world, depression-lines, deposit-insurance, spread):
// bank hall, desk, notebook page with handwriting, instrument dials, iron weights, note bundles, books, wrapped text. All motion is a smooth function of f.
import React from "react";
import {SANS, SERIF, W, H, eo, rng} from "../kit";
import {prog} from "./analogy_kit";
import {E2Defs} from "./analogy_e2_kit";
import {Defs} from "./analogy_e3_kit";

export {elabs, Tag, Brace, Quest, Spot, Specks, Classical, Plus} from "./analogy_e3_kit";
export {ECard, Plaque, Coin, CoinHeap, Shade, Note, Cert} from "./analogy_e2_kit";
export {Person} from "./analogy_kit";

export const rad = (d: number) => (d * Math.PI) / 180;

/** every gradient and filter the F3 scenes share (the Part 1 defs plus a few of our own) */
export const F3Defs: React.FC = () => (
  <>
    <E2Defs/>
    <Defs/>
    <defs>
      <radialGradient id="f3-face" cx="40%" cy="35%" r="75%"><stop offset="0" stopColor="#fffdf2"/><stop offset="0.7" stopColor="#f3e8c8"/><stop offset="1" stopColor="#d9c590"/></radialGradient>
      <linearGradient id="f3-iron" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8d949c"/><stop offset="0.35" stopColor="#c9cfd5"/><stop offset="0.7" stopColor="#7d858e"/><stop offset="1" stopColor="#4d545c"/></linearGradient>
      <linearGradient id="f3-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity="0.55"/><stop offset="0.5" stopColor="#dff0f8" stopOpacity="0.18"/><stop offset="1" stopColor="#ffffff" stopOpacity="0.4"/></linearGradient>
      <linearGradient id="f3-paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fffdf3"/><stop offset="1" stopColor="#f2e7cb"/></linearGradient>
      <linearGradient id="f3-note" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d3e6cf"/><stop offset="1" stopColor="#92b48f"/></linearGradient>
    </defs>
  </>
);

/** word-wrap by character count (no measuring): returns lines */
export const wrapText = (t: string, maxChars: number): string[] => {
  const out: string[] = []; let cur = "";
  for (const w of t.split(" ")) {
    if (cur && (cur + " " + w).length > maxChars) { out.push(cur); cur = w; } else cur = cur ? cur + " " + w : w;
  }
  if (cur) out.push(cur);
  return out;
};

/** estimated width of a handwritten line */
export const inkW = (t: string, size: number) => t.length * size * 0.5;

/** a bank hall at warm light: wall, arched windows with shafts, far columns, a counter top from deskY */
export const Hall: React.FC<{f: number; deskY: number; id: string; tone?: "warm" | "cool"; winX?: number[]}> = ({f, deskY, id, tone = "warm", winX = [330, 960, 1590]}) => {
  const cool = tone === "cool", w0 = cool ? "#eef0f2" : "#f8ecd2", w1 = cool ? "#cdd6e0" : "#e4cea0";
  const br = 0.85 + 0.15 * Math.sin(f / 46);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={w0}/><stop offset="1" stopColor={w1}/></linearGradient>
        <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d7a96e"/><stop offset="1" stopColor="#7a4a24"/></linearGradient>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fc3ea"/><stop offset="1" stopColor="#f1f0dc"/></linearGradient>
        <linearGradient id={`${id}-shaft`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff2c4" stopOpacity="0.55"/><stop offset="1" stopColor="#fff2c4" stopOpacity="0.02"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id}-wall)`}/>
      {Array.from({length: 12}, (_, i) => <rect key={i} x={i * 170 - 30} y={-20} width={84} height={deskY} fill={cool ? "#dfe5ee" : "#f2dfb8"} opacity={0.3}/>)}
      {/* far pillars, pale and bluish */}
      {[120, 640, 1280, 1800].map((x, i) => (
        <g key={i} opacity={0.4}>
          <rect x={x - 38} y={110} width={76} height={deskY - 110} fill="#c4cedb"/>
          <rect x={x - 38} y={110} width={26} height={deskY - 110} fill="#e6ecf4"/>
          <rect x={x - 50} y={96} width={100} height={22} fill="#b4c0d0"/>
        </g>
      ))}
      {/* arched windows with light shafts */}
      {winX.map((cx, i) => {
        const w = 190, top = 110, h = 360, a = `M${cx - w / 2},${top + h} V${top + w / 2} A${w / 2},${w / 2} 0 0 1 ${cx + w / 2},${top + w / 2} V${top + h} Z`;
        return (
          <g key={i}>
            <polygon points={`${cx - w / 2},${top + h} ${cx + w / 2},${top + h} ${cx + w / 2 + 330},${deskY} ${cx - w / 2 + 170},${deskY}`} fill={`url(#${id}-shaft)`} opacity={0.5 * br}/>
            <path d={a} fill="#9b6f3f" stroke="#6e4824" strokeWidth={3} transform={`translate(0 0) scale(1.0)`} strokeLinejoin="round"/>
            <path d={`M${cx - w / 2 + 12},${top + h - 8} V${top + w / 2} A${w / 2 - 12},${w / 2 - 12} 0 0 1 ${cx + w / 2 - 12},${top + w / 2} V${top + h - 8} Z`} fill={`url(#${id}-sky)`}/>
            <ellipse cx={cx + 20 + Math.sin(f / 90 + i) * 12} cy={top + 110} rx={58} ry={17} fill="#fff" opacity={0.85}/>
            <path d={`M${cx - w / 2 + 12},${top + h - 90} Q${cx},${top + h - 140} ${cx + w / 2 - 12},${top + h - 100} V${top + h - 8} H${cx - w / 2 + 12} Z`} fill="#b3c9d6" opacity={0.8}/>
            <path d={`M${cx},${top + 4} V${top + h - 8} M${cx - w / 2 + 12},${top + 190} H${cx + w / 2 - 12}`} stroke="#6e4824" strokeWidth={5}/>
          </g>
        );
      })}
      {/* pendant lamps */}
      {[640, 1280].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy={96} rx={120} ry={70} fill="url(#ak-sunglow)" opacity={0.5 * br}/>
          <path d={`M${x},-20 V50`} stroke="#6c4a16" strokeWidth={4}/>
          <path d={`M${x - 46},84 Q${x - 40},50 ${x},46 Q${x + 40},50 ${x + 46},84 Z`} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
          <ellipse cx={x} cy={86} rx={30} ry={7} fill="#fff6c8" opacity={0.9 * br}/>
        </g>
      ))}
      {/* counter top */}
      <rect x={-40} y={deskY} width={W + 80} height={H - deskY + 80} fill={`url(#${id}-wood)`}/>
      {Array.from({length: 7}, (_, i) => <path key={i} d={`M-40,${deskY + 26 + i * 30} Q960,${deskY + 18 + i * 30 + (i % 2) * 8} 1960,${deskY + 26 + i * 30}`} stroke="#6e4524" strokeWidth={1.5} fill="none" opacity={0.42}/>)}
      <ellipse cx={900} cy={deskY + 50} rx={700} ry={44} fill="#fff1c8" opacity={0.15} filter="url(#ak-blur22)"/>
      <rect x={-40} y={deskY - 4} width={W + 80} height={8} fill="#f2d79c" opacity={0.85}/>
      <rect x={-40} y={deskY + 4} width={W + 80} height={4} fill="#5a3418" opacity={0.2}/>
    </g>
  );
};

/** a wooden desk surface for the notebook scenes, with a warm lamp pool and, optionally, a mug of tea */
export const DeskBG: React.FC<{f: number; id: string; mug?: boolean}> = ({f, id, mug = true}) => (
  <g>
    <defs><linearGradient id={`${id}-d`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#dcb987"/><stop offset="0.55" stopColor="#bd8f58"/><stop offset="1" stopColor="#8f6234"/></linearGradient></defs>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id}-d)`}/>
    {Array.from({length: 17}, (_, i) => <path key={i} d={`M-60,${i * 66 - 20} Q960,${i * 66 - 34 + (i % 3) * 10} 1980,${i * 66 - 10}`} stroke="#6e4524" strokeWidth={1.6} fill="none" opacity={0.3}/>)}
    <ellipse cx={900} cy={420} rx={1000} ry={620} fill="url(#ak-sunglow)" opacity={0.32}/>
    {mug && (
      <g transform="translate(1796 820)">
        <ellipse cx={8} cy={52} rx={74} ry={16} fill="#2a1808" opacity={0.32} filter="url(#ak-blur8)"/>
        <path d="M-52,-46 H52 L44,48 Q0,62 -44,48 Z" fill="#e9dcc2" stroke="#9a8460" strokeWidth={2.4}/>
        <path d="M-52,-46 H52 L50,-26 H-50 Z" fill="#c7552f" opacity={0.85}/>
        <path d="M52,-26 Q96,-24 90,10 Q84,36 46,32" fill="none" stroke="#9a8460" strokeWidth={9} strokeLinecap="round"/>
        <ellipse cx={0} cy={-46} rx={52} ry={10} fill="#9a5a2c" stroke="#9a8460" strokeWidth={2}/>
        {[0, 1, 2].map((k) => { const u = (f * 0.012 + k / 3) % 1; return <path key={k} d={`M${-10 + k * 10},${-60 - u * 80} q10,-14 0,-28`} stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.45 * Math.min(1, u * 4, (1 - u) * 3)}/>; })}
      </g>
    )}
  </g>
);

/** a ring-bound notebook page with a purple cover edge, margin and ruled lines */
export const NotePage: React.FC<{x: number; y: number; w: number; h: number; a?: number; pitch?: number; first?: number}> = ({x, y, w, h, a = 1, pitch = 52, first = 70}) => {
  const n = Math.floor((h - first - 16) / pitch);
  return (
    <g opacity={a} transform={`translate(0 ${(1 - a) * 30})`}>
      <rect x={x + 14} y={y + 24} width={w} height={h} rx={16} fill="#2a1808" opacity={0.34} filter="url(#e3-glow)"/>
      <rect x={x - 12} y={y - 10} width={w + 24} height={h + 20} rx={20} fill="#5e3c78" stroke="#3a2250" strokeWidth={3}/>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="url(#f3-paper)" stroke="#cbb88a" strokeWidth={1.6}/>
      {Array.from({length: n + 1}, (_, i) => <path key={i} d={`M${x + 20},${y + first + i * pitch} H${x + w - 20}`} stroke="#b9cde0" strokeWidth={1.4} opacity={0.62}/>)}
      <path d={`M${x + 120},${y + 8} V${y + h - 8}`} stroke="#e29a8a" strokeWidth={2.4} opacity={0.7}/>
      {Array.from({length: Math.floor(h / 92)}, (_, i) => <g key={i} transform={`translate(${x + 40} ${y + 44 + i * 92})`}><circle r={11} fill="#cdb98c" stroke="#8e7a52" strokeWidth={1.4}/><path d="M-30,0 H22" stroke="#9aa6b2" strokeWidth={5} strokeLinecap="round"/></g>)}
    </g>
  );
};

/** ink handwriting that is revealed left to right from `start` over `len` frames; returns the pencil front through `onFront` via the data attributes of the caller (compute with inkFront) */
export const Ink: React.FC<{id: string; x: number; y: number; text: string; size: number; f: number; start: number; len?: number; color?: string; maxW?: number}> = ({id, x, y, text, size, f, start, len = 40, color = "#1f3a78", maxW}) => {
  if (f < start) return null;
  const tw = maxW ?? inkW(text, size), k = eo(prog(f, start, len));
  return (
    <g>
      <defs><clipPath id={id}><rect x={x - 20} y={y - size * 1.1} width={Math.max(0.1, (tw + size) * k)} height={size * 1.6}/></clipPath></defs>
      <g clipPath={`url(#${id})`}>
        <text x={x} y={y} fontFamily={SERIF} fontStyle="italic" fontWeight={600} fontSize={size} fill={color}>{text}</text>
      </g>
    </g>
  );
};
/** x position of the writing front of an Ink */
export const inkFront = (x: number, text: string, size: number, f: number, start: number, len = 40) => x + (inkW(text, size) + size * 0.2) * eo(prog(f, start, len));

/** a yellow pencil, tip at (x, y) */
export const Pencil: React.FC<{x: number; y: number; rot?: number; s?: number}> = ({x, y, rot = -14, s = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} filter="url(#e3-sh-s)">
    <path d="M0,0 L48,-13 L48,13 Z" fill="#f2d9a8" stroke="#9a7410" strokeWidth={2}/>
    <path d="M0,0 L15,-4 L15,4 Z" fill="#3a2a1c"/>
    <rect x={48} y={-13} width={190} height={26} rx={3} fill="#f2c22a" stroke="#9a7410" strokeWidth={2}/>
    <rect x={48} y={-13} width={190} height={7} fill="#fff0a0" opacity={0.6}/>
    <rect x={238} y={-13} width={22} height={26} fill="#c8c8d0" stroke="#6a7a86" strokeWidth={1.6}/>
    <rect x={260} y={-13} width={34} height={26} rx={8} fill="#e08a8a" stroke="#8a3a3a" strokeWidth={2}/>
  </g>
);

/** an instrument dial (no digits): `ang` degrees from straight up, sweep -125..125 */
const arc = (x: number, y: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [x + r * Math.sin(rad(a)), y - r * Math.cos(rad(a))];
  const [sx, sy] = p(a0), [ex, ey] = p(a1);
  return `M${sx.toFixed(1)},${sy.toFixed(1)} A${r},${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${ex.toFixed(1)},${ey.toFixed(1)}`;
};
export const Gauge: React.FC<{x: number; y: number; r: number; ang: number; glow?: number; zones?: boolean; op?: number; zeroRed?: number; zc?: [string, string, string]}> = ({x, y, r, ang, glow = 0, zones = true, op = 1, zeroRed = 0, zc = ["#6aa974", "#e3b64e", "#cf6a48"]}) => (
  <g opacity={op}>
    {glow > 0.01 && <circle cx={x} cy={y} r={r * 1.7} fill="url(#ak-sunglow)" opacity={glow}/>}
    <ellipse cx={x + r * 0.08} cy={y + r * 1.02} rx={r * 0.95} ry={r * 0.14} fill="#2a1808" opacity={0.3} filter="url(#ak-blur8)"/>
    <circle cx={x} cy={y} r={r} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={r * 0.04}/>
    <circle cx={x} cy={y} r={r * 0.9} fill="#4d3410"/>
    <circle cx={x} cy={y} r={r * 0.85} fill="url(#f3-face)"/>
    {zones && (
      <g fill="none" strokeWidth={r * 0.09} strokeLinecap="butt" opacity={0.85}>
        <path d={arc(x, y, r * 0.7, -125, -42)} stroke={zc[0]}/>
        <path d={arc(x, y, r * 0.7, -42, 42)} stroke={zc[1]}/>
        <path d={arc(x, y, r * 0.7, 42, 125)} stroke={zc[2]}/>
      </g>
    )}
    {zeroRed > 0.01 && <path d={arc(x, y, r * 0.7, -125, -108)} fill="none" stroke="#d6432b" strokeWidth={r * 0.13} opacity={zeroRed}/>}
    {Array.from({length: 13}, (_, i) => { const a = -125 + i * (250 / 12), l = i % 3 === 0 ? 0.17 : 0.09, c = Math.sin(rad(a)), s = Math.cos(rad(a)); return <path key={i} d={`M${x + c * r * 0.82},${y - s * r * 0.82} L${x + c * r * (0.82 - l)},${y - s * r * (0.82 - l)}`} stroke="#4a3a22" strokeWidth={i % 3 === 0 ? r * 0.035 : r * 0.02} strokeLinecap="round"/>; })}
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <ellipse cx={3} cy={4} rx={r * 0.05} ry={r * 0.62} fill="#2a1808" opacity={0.25}/>
      <polygon points={`0,${-r * 0.66} ${r * 0.045},0 0,${r * 0.14} ${-r * 0.045},0`} fill="#b0361f" stroke="#6a1d0f" strokeWidth={1}/>
    </g>
    <circle cx={x} cy={y} r={r * 0.1} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={1.5}/>
    <path d={`M${x - r * 0.62},${y - r * 0.4} A${r * 0.78},${r * 0.78} 0 0 1 ${x + r * 0.2},${y - r * 0.76}`} stroke="#fff" strokeWidth={r * 0.06} fill="none" strokeLinecap="round" opacity={0.5}/>
    <circle cx={x} cy={y} r={r * 0.85} fill="url(#f3-glass)" opacity={0.35}/>
  </g>
);

/** a hand-drawn red cross that draws itself (p 0..1), centred at x,y */
export const Cross: React.FC<{x: number; y: number; s?: number; p: number; c?: string}> = ({x, y, s = 1, p, c = "#c63f2f"}) => {
  if (p <= 0.002) return null;
  const a = Math.min(1, p * 2), b = Math.max(0, p * 2 - 1), L = 34 * s;
  return (
    <g stroke={c} strokeWidth={9 * s} strokeLinecap="round" filter="url(#e3-sh-s)">
      <path d={`M${x - L},${y - L} L${x - L + 2 * L * a},${y - L + 2 * L * a}`}/>
      {b > 0 && <path d={`M${x + L},${y - L} L${x + L - 2 * L * b},${y - L + 2 * L * b}`}/>}
    </g>
  );
};

/** an iron weight with a ring handle and a brass label plate (lines of text), base centre x,y */
export const Weight: React.FC<{x: number; y: number; w: number; h: number; lines: string[]; tint: [string, string]; size?: number}> = ({x, y, w, h, lines, tint, size = 30}) => (
  <g>
    <ellipse cx={x + w * 0.08} cy={y + 4} rx={w * 0.58} ry={12} fill="#2a1808" opacity={0.34} filter="url(#ak-blur8)"/>
    <path d={`M${x - w * 0.34},${y - h * 0.9} Q${x - w * 0.34},${y - h * 1.18} ${x},${y - h * 1.2} Q${x + w * 0.34},${y - h * 1.18} ${x + w * 0.34},${y - h * 0.9}`} fill="none" stroke="#3d444c" strokeWidth={w * 0.07} strokeLinecap="round"/>
    <path d={`M${x - w * 0.5},${y} L${x - w * 0.4},${y - h * 0.9} Q${x},${y - h * 1.0} ${x + w * 0.4},${y - h * 0.9} L${x + w * 0.5},${y} Z`} fill={tint[0]} stroke={tint[1]} strokeWidth={3} strokeLinejoin="round"/>
    <path d={`M${x + w * 0.12},${y} L${x + w * 0.16},${y - h * 0.95} L${x + w * 0.4},${y - h * 0.9} L${x + w * 0.5},${y} Z`} fill="#000" opacity={0.18}/>
    <path d={`M${x - w * 0.38},${y - h * 0.8} L${x - w * 0.34},${y - h * 0.15}`} stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.35}/>
    <rect x={x - w * 0.4} y={y - h * 0.7} width={w * 0.8} height={h * 0.5} rx={8} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.2}/>
    <rect x={x - w * 0.37} y={y - h * 0.67} width={w * 0.74} height={h * 0.44} rx={5} fill="none" stroke="#6c4a16" strokeWidth={1.2} opacity={0.7}/>
    {lines.map((t, i) => (
      <text key={i} x={x} y={y - h * 0.45 + (i - (lines.length - 1) / 2) * size * 1.12 + size * 0.34} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={size} letterSpacing={size * 0.04} fill="#3b2506">{t}</text>
    ))}
  </g>
);

/** a bundle of generic notes (no portrait, no emblem), base centre x,y; w wide, h tall, d depth */
export const Bundle: React.FC<{x: number; y: number; w: number; h: number; d?: number; band?: boolean; a?: number; glow?: number}> = ({x, y, w, h, d = 26, band = true, a = 1, glow = 0}) => {
  if (a <= 0.002) return null;
  const lines = Math.max(2, Math.floor(h / 7));
  return (
    <g opacity={a}>
      {glow > 0.01 && <ellipse cx={x} cy={y - h / 2} rx={w * 0.9} ry={h * 0.7 + 30} fill="url(#ak-sunglow)" opacity={glow}/>}
      <ellipse cx={x + d * 0.5} cy={y + 4} rx={w * 0.66} ry={11} fill="#2a1808" opacity={0.3} filter="url(#ak-blur8)"/>
      <polygon points={`${x + w / 2},${y} ${x + w / 2 + d},${y - d * 0.5} ${x + w / 2 + d},${y - h - d * 0.5} ${x + w / 2},${y - h}`} fill="#7b9a77" stroke="#486b46" strokeWidth={1.6}/>
      <polygon points={`${x - w / 2},${y - h} ${x + w / 2},${y - h} ${x + w / 2 + d},${y - h - d * 0.5} ${x - w / 2 + d},${y - h - d * 0.5}`} fill="#dcecd6" stroke="#486b46" strokeWidth={1.6}/>
      <rect x={x - w / 2} y={y - h} width={w} height={h} fill="url(#f3-note)" stroke="#486b46" strokeWidth={1.8}/>
      {Array.from({length: lines}, (_, i) => <path key={i} d={`M${x - w / 2 + 2},${y - h + 5 + i * ((h - 8) / lines)} H${x + w / 2 - 2}`} stroke="#fff" strokeWidth={1} opacity={0.35}/>)}
      <rect x={x - w / 2 + w * 0.05} y={y - h + h * 0.18} width={w * 0.9} height={h * 0.64} fill="none" stroke="#486b46" strokeWidth={1.2} opacity={0.5} rx={3}/>
      {band && <g><rect x={x - w * 0.14} y={y - h - d * 0.5 + 3} width={w * 0.28} height={h + d * 0.5 - 3} fill="#f4e6bd" stroke="#a88c4c" strokeWidth={1.6} opacity={0.95}/><rect x={x - w * 0.14} y={y - h + 3} width={w * 0.28} height={h - 3} fill="#e0c880" opacity={0.35}/></g>}
    </g>
  );
};

/** a standing book with a spine title, base centre x,y */
export const BookObj: React.FC<{x: number; y: number; w: number; h: number; text: string; c: [string, string]; size?: number; a?: number; lean?: number}> = ({x, y, w, h, text, c, size = 34, a = 1, lean = 0}) => (
  <g opacity={a} transform={`rotate(${lean} ${x} ${y})`}>
    <ellipse cx={x + 6} cy={y + 3} rx={w * 0.8} ry={8} fill="#2a1808" opacity={0.3} filter="url(#ak-blur8)"/>
    <rect x={x - w / 2} y={y - h} width={w} height={h} rx={5} fill={c[0]} stroke={c[1]} strokeWidth={2.4}/>
    <rect x={x + w / 2 - 6} y={y - h + 4} width={4} height={h - 8} fill="#f6efe0" opacity={0.85}/>
    <rect x={x - w / 2} y={y - h} width={w * 0.2} height={h} fill="#000" opacity={0.15}/>
    <rect x={x - w / 2 + 6} y={y - h + 18} width={w - 12} height={6} fill="#f0d78c" opacity={0.85}/>
    <rect x={x - w / 2 + 6} y={y - 24} width={w - 12} height={6} fill="#f0d78c" opacity={0.85}/>
    <text transform={`translate(${x + size * 0.34} ${y - h / 2}) rotate(-90)`} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={size} letterSpacing={size * 0.12} fill="#fff1c4">{text}</text>
  </g>
);

/** a small rounded block with a word (used for reserves / loans / deposits), top-left x,y */
export const WordBlock: React.FC<{x: number; y: number; w: number; h: number; text: string; fill: string; edge: string; ink?: string; a?: number; size?: number; icon?: React.ReactNode}> = ({x, y, w, h, text, fill, edge, ink = "#fff", a = 1, size = 32, icon}) => {
  if (a <= 0.002) return null;
  return (
    <g opacity={a} transform={`translate(0 ${(1 - a) * 14})`}>
      <rect x={x + 5} y={y + 9} width={w} height={h} rx={14} fill="#2a1808" opacity={0.25}/>
      <rect x={x} y={y} width={w} height={h} rx={14} fill={fill} stroke={edge} strokeWidth={3}/>
      <rect x={x + 8} y={y + 7} width={w - 16} height={h * 0.2} rx={7} fill="#fff" opacity={0.2}/>
      {icon}
      <text x={x + w / 2} y={y + h - 16} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={size} fill={ink} stroke="rgba(30,15,5,.35)" strokeWidth={0.8} paintOrder="stroke">{text}</text>
    </g>
  );
};

/** a short right arrow, brass-edged, from (x0,y) to (x1,y); p 0..1 grows it */
export const Arrow: React.FC<{x0: number; x1: number; y: number; p?: number; c?: string; w?: number}> = ({x0, x1, y, p = 1, c = "#c9822e", w = 10}) => {
  if (p <= 0.002) return null;
  const e = x0 + (x1 - x0) * p, dir = Math.sign(x1 - x0) || 1, hs = w * 1.8;
  return (
    <g>
      <path d={`M${x0},${y} H${e - dir * hs * 0.6}`} stroke="#5a2a10" strokeWidth={w + 4} strokeLinecap="round"/>
      <path d={`M${x0},${y} H${e - dir * hs * 0.6}`} stroke={c} strokeWidth={w} strokeLinecap="round"/>
      <polygon points={`${e},${y} ${e - dir * hs},${y - hs * 0.62} ${e - dir * hs},${y + hs * 0.62}`} fill={c} stroke="#5a2a10" strokeWidth={3} strokeLinejoin="round"/>
    </g>
  );
};

/** soft contact shadow + a paper card in SVG with tint bar, used for the facing cards and panels */
export const PaperCard: React.FC<{x: number; y: number; w: number; h: number; tint: string; rot?: number; a?: number; children?: React.ReactNode}> = ({x, y, w, h, tint, rot = 0, a = 1, children}) => (
  <g opacity={a} transform={`translate(${x + w / 2} ${y + h / 2 + (1 - a) * 24}) rotate(${rot}) translate(${-w / 2} ${-h / 2})`}>
    <rect x={10} y={20} width={w} height={h} rx={18} fill="#2a1808" opacity={0.32} filter="url(#e3-glow)"/>
    <rect width={w} height={h} rx={18} fill="url(#f3-paper)" stroke="#bda46c" strokeWidth={2}/>
    <rect x={0} y={0} width={w} height={16} rx={8} fill={tint}/>
    <rect x={10} y={26} width={w - 20} height={h - 36} rx={11} fill="none" stroke={tint} strokeWidth={1.4} opacity={0.4}/>
    {children}
  </g>
);

export const NoLabels: React.FC = () => null;
export {eo, rng, prog, W, H, SANS, SERIF};
