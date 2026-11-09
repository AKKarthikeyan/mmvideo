// Shared parts for the UPSC "analogy" and "sketch" scenes: frame (div + svg + slow push), chip, limit line, pop-in label pills,
// flowing arrows, drifting clouds, simple people, hand-wobble. Flat fills from C, 8 px ink outlines.
import React from "react";
import {random} from "remotion";
import {C} from "../../palette";
import {ROUND, SANS, ease, pop} from "../../ui";

export const INK = C.ink;
export const SW = 8;
export type Pt = [number, number];

export type LabelIn = {text: string; key: string};
export type AnalogyBase = {which?: string; time?: "day" | "night"; chip?: string; limit?: string; labels?: LabelIn[]};

// Full-frame wrapper: background colour, svg 1920x1080, a very slow push-in about (fx, fy). Chip and limit are drawn outside the push.
export const Frame: React.FC<{f: number; dur: number; bg: string; chip?: string; limit?: string; fx?: number; fy?: number; children: React.ReactNode; dark?: boolean}> =
  ({f, dur, bg, chip, limit, fx = 960, fy = 480, children, dark}) => {
  const s = 1 + 0.03 * (f / Math.max(1, dur));
  return <div style={{position: "absolute", inset: 0, background: bg, overflow: "hidden"}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute", left: 0, top: 0}}>
      <g transform={`translate(${fx} ${fy}) scale(${s}) translate(${-fx} ${-fy})`}>{children}</g>
      {chip ? <Chip text={chip} f={f}/> : null}
      {limit ? <Limit text={limit} f={f} dark={dark}/> : null}
    </svg>
  </div>;
};

export const Chip: React.FC<{text: string; f: number}> = ({text, f}) => {
  const w = 52 + text.length * 22, t = pop(f, 3, 220);
  return <g transform={`translate(110 74) scale(${t})`}>
    <rect x={5} y={7} width={w} height={58} rx={29} fill={INK}/>
    <rect x={0} y={0} width={w} height={58} rx={29} fill={C.yellow} stroke={INK} strokeWidth={6}/>
    <text x={w / 2} y={41} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={30} letterSpacing={2} fill={INK}>{text}</text>
  </g>;
};

export const Limit: React.FC<{text: string; f: number; dark?: boolean}> = ({text, f, dark}) =>
  <text x={960} y={902} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={32} fill={dark ? C.white : INK} opacity={0.8 * ease(f, 12, 28)}>
    Where the picture stops: {text}
  </text>;

// Greedy wrap by estimated width (caps in ROUND 800 are about 0.62 em).
export const wrap = (text: string, size: number, maxW: number): string[] => {
  const words = text.split(" "), out: string[] = [];
  let cur = "";
  for (const w of words) {
    const nx = cur ? cur + " " + w : w;
    if (nx.length * size * 0.62 > maxW && cur) { out.push(cur); cur = w; } else cur = nx;
  }
  if (cur) out.push(cur);
  return out;
};

// White pill label that pops in at frame `at`. (cx, cy) = centre.
export const Pill: React.FC<{text: string; f: number; at: number; cx: number; cy: number; size?: number; maxW?: number; color?: string; fill?: string}> =
  ({text, f, at, cx, cy, size = 54, maxW = 900, color = INK, fill = C.white}) => {
  const t = pop(f, at, 200);
  if (t <= 0.001) return null;
  const lines = wrap(text, size, maxW), w = Math.max(...lines.map((l) => l.length)) * size * 0.6 + 70, h = lines.length * size * 1.1 + 36;
  const bob = Math.sin((f - at) / 15) * 3;
  return <g transform={`translate(${cx} ${cy + bob}) scale(${t})`}>
    <rect x={-w / 2 + 0} y={-h / 2 + 9} width={w} height={h} rx={26} fill={INK}/>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={26} fill={fill} stroke={INK} strokeWidth={7}/>
    {lines.map((l, i) => <text key={i} x={0} y={-h / 2 + 18 + size * 0.85 + i * size * 1.1} textAnchor="middle" fontFamily={ROUND} fontWeight={800} fontSize={size} fill={color} letterSpacing={-0.5}>{l}</text>)}
  </g>;
};

// The label for a key: looks it up in spec.labels, draws only from at(key).
export const labelOf = (labels: LabelIn[] | undefined, i: number): LabelIn | null => (labels && labels[i]) || null;

// ---- smooth paths and flowing arrows ----------------------------------------------------------------------------------------------
export const smooth = (p: Pt[]): string => {
  if (p.length < 3) return `M ${p.map((q) => q.join(" ")).join(" L ")}`;
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[Math.max(0, i - 1)], b = p[i], c = p[i + 1], e = p[Math.min(p.length - 1, i + 2)];
    d += ` C ${b[0] + (c[0] - a[0]) / 6} ${b[1] + (c[1] - a[1]) / 6} ${c[0] - (e[0] - b[0]) / 6} ${c[1] - (e[1] - b[1]) / 6} ${c[0]} ${c[1]}`;
  }
  return d;
};

// A thick arrow whose body flows (moving dashes over a solid outline-coloured under-stroke) and ends in a head.
export const Flow: React.FC<{pts: Pt[]; f: number; color: string; w?: number; speed?: number; head?: boolean; opacity?: number; grow?: number}> =
  ({pts, f, color, w = 22, speed = 1.6, head = true, opacity = 1, grow = 1}) => {
  if (grow <= 0.001) return null;
  const d = smooth(pts), n = pts.length, a = pts[n - 2], b = pts[n - 1];
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI, hs = w * 1.25;
  return <g opacity={opacity}>
    <path d={d} fill="none" stroke={INK} strokeWidth={w + 12} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${grow} 2`}/>
    <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${grow} 2`}/>
    <path d={d} fill="none" stroke={C.white} strokeWidth={w * 0.26} strokeLinecap="round" strokeDasharray="0.02 0.045" strokeDashoffset={-(f * speed * 0.004)} opacity={0.85} pathLength={1}
      style={grow < 0.999 ? {display: "none"} : undefined}/>
    {head && grow > 0.97 && <g transform={`translate(${b[0]} ${b[1]}) rotate(${ang})`}>
      <path d={`M ${hs * 1.7} 0 L ${-hs * 0.3} ${-hs * 1.15} L ${-hs * 0.3} ${hs * 1.15} Z`} fill={color} stroke={INK} strokeWidth={SW} strokeLinejoin="round"/>
    </g>}
  </g>;
};

// Chevron-train arrow: small chevrons slide along a straight/curved path (used where a body would be too heavy).
export const Chevrons: React.FC<{pts: Pt[]; f: number; color: string; n?: number; speed?: number; size?: number}> = ({pts, f, color, n = 6, speed = 0.012, size = 22}) => {
  const segs: number[] = [0];
  for (let i = 1; i < pts.length; i++) segs.push(segs[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = segs[segs.length - 1];
  const at = (s: number): [number, number, number] => {
    let i = 1;
    while (i < segs.length - 1 && segs[i] < s) i++;
    const u = (s - segs[i - 1]) / Math.max(1e-6, segs[i] - segs[i - 1]), a = pts[i - 1], b = pts[i];
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI];
  };
  return <g>{Array.from({length: n}, (_, i) => {
    const u = ((i / n) + f * speed) % 1, [x, y, a] = at(u * L), op = Math.min(1, u * 6, (1 - u) * 6);
    return <g key={i} transform={`translate(${x} ${y}) rotate(${a})`} opacity={op}>
      <path d={`M ${-size * 0.5} ${-size} L ${size * 0.6} 0 L ${-size * 0.5} ${size}`} fill="none" stroke={INK} strokeWidth={SW + 6} strokeLinecap="round" strokeLinejoin="round"/>
      <path d={`M ${-size * 0.5} ${-size} L ${size * 0.6} 0 L ${-size * 0.5} ${size}`} fill="none" stroke={color} strokeWidth={SW - 1} strokeLinecap="round" strokeLinejoin="round"/>
    </g>;
  })}</g>;
};

// ---- scenery ---------------------------------------------------------------------------------------------------------------------
export const Cloud: React.FC<{x: number; y: number; s?: number; f: number; speed?: number; fill?: string; seed?: number; span?: number}> = ({x, y, s = 1, f, speed = 0.25, fill = C.white, seed = 1, span = 2300}) => {
  const dx = ((x + 200 + f * speed + seed * 97) % span) - 200;
  return <g transform={`translate(${dx} ${y + Math.sin(f / 40 + seed) * 5}) scale(${s})`}>
    <path d="M -90 40 C -140 40 -140 -20 -88 -22 C -90 -70 -20 -84 0 -48 C 30 -86 100 -64 92 -16 C 150 -18 150 40 96 40 Z" fill={fill} stroke={INK} strokeWidth={SW * 0.8} strokeLinejoin="round"/>
  </g>;
};

export const Sun: React.FC<{x: number; y: number; r?: number; f: number}> = ({x, y, r = 70, f}) =>
  <g transform={`translate(${x} ${y})`}>
    <g transform={`rotate(${f * 0.4})`}>{Array.from({length: 12}, (_, i) => <path key={i} d={`M ${r + 22} -10 L ${r + 62 + (i % 2) * 14} 0 L ${r + 22} 10 Z`} fill={C.orange} stroke={INK} strokeWidth={5} strokeLinejoin="round" transform={`rotate(${i * 30})`}/>)}</g>
    <circle r={r} fill={C.yellow} stroke={INK} strokeWidth={SW}/>
    <circle cx={-r * 0.3} cy={-r * 0.25} r={r * 0.12} fill={INK}/><circle cx={r * 0.3} cy={-r * 0.25} r={r * 0.12} fill={INK}/>
    <path d={`M ${-r * 0.35} ${r * 0.25} Q 0 ${r * 0.6} ${r * 0.35} ${r * 0.25}`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round"/>
  </g>;

// A tiny person (round head, capsule body), drawn from the front: used for crowds and top-down riders alike.
const SHIRTS = [C.red, C.blue, C.green, C.orange, C.yellow, "#8E5CC7", "#27A7A0"], HAIRS = [C.ink, "#4A2C1B", "#2A2320", "#6B3A1E"], SKINS = [C.skin, C.skinDark, "#EDB78A"];
export const Person: React.FC<{x: number; y: number; h: number; f: number; seed: number; opacity?: number; walk?: number}> = ({x, y, h, f, seed, opacity = 1, walk = 0}) => {
  const sh = SHIRTS[seed % SHIRTS.length], hr = HAIRS[(seed * 3) % HAIRS.length], sk = SKINS[(seed * 5) % SKINS.length];
  const s = h / 120, bob = walk ? Math.abs(Math.sin((f + seed * 4) / 3.5)) * 6 : Math.sin((f + seed * 7) / 12) * 2, sway = walk ? Math.sin((f + seed * 4) / 7) * 12 : 0;
  return <g transform={`translate(${x} ${y - bob * s}) scale(${s})`} opacity={opacity}>
    <ellipse cx={0} cy={bob + 2} rx={30} ry={7} fill="rgba(17,24,58,0.22)"/>
    <path d={`M -16 0 L -16 -30 M 16 0 L 16 -30`} stroke={INK} strokeWidth={10} strokeLinecap="round" transform={`translate(${sway * 0.2} 0)`}/>
    <path d="M -26 -28 Q -28 -88 0 -90 Q 28 -88 26 -28 Z" fill={sh} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    <circle cx={0} cy={-108} r={22} fill={sk} stroke={INK} strokeWidth={6}/>
    <path d="M -22 -112 Q -20 -134 0 -132 Q 20 -134 22 -112 Q 8 -122 -22 -112 Z" fill={hr} stroke={INK} strokeWidth={4} strokeLinejoin="round"/>
    <circle cx={-8} cy={-106} r={3} fill={INK}/><circle cx={8} cy={-106} r={3} fill={INK}/>
  </g>;
};

// Hand wobble: deterministic jitter that changes every 3 frames (the "boil" of hand-inked animation).
export const wob = (seed: string, f: number, amp: number) => (random(`${seed}-${Math.floor(f / 3) % 4}`) - 0.5) * 2 * amp;

export const Palm: React.FC<{x: number; y: number; h?: number; f: number; lean?: number; seed?: number}> = ({x, y, h = 300, f, lean = 0, seed = 0}) => {
  const sw = Math.sin(f / 16 + seed) * 2.5 + lean, topx = Math.sin(((sw + 8) * Math.PI) / 180) * h * 0.5;
  return <g transform={`translate(${x} ${y})`}>
    <path d={`M -14 0 Q ${topx * 0.2 - 10} ${-h * 0.5} ${topx} ${-h} L ${topx + 16} ${-h} Q ${topx * 0.2 + 16} ${-h * 0.5} 16 0 Z`} fill={C.floor} stroke={INK} strokeWidth={SW} strokeLinejoin="round"/>
    <g transform={`translate(${topx + 8} ${-h}) rotate(${sw * 1.5})`}>
      {[-80, -35, 10, 55, 100].map((a, i) => <path key={i} d="M 0 0 Q 70 -60 150 10 Q 70 -20 0 12 Z" fill={C.green} stroke={INK} strokeWidth={6} strokeLinejoin="round" transform={`rotate(${a + Math.sin(f / 12 + i + seed) * 4 - 90 + 30})`}/>)}
      <circle r={14} fill={C.greenDark} stroke={INK} strokeWidth={6}/>
    </g>
  </g>;
};
