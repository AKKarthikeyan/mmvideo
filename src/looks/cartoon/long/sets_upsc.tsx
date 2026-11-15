// UPSC monsoon film (2 Nov 2026): the three new stage sets (rooftop, beach, himalaya), the time-of-day looks, rain, lightning and the opening Earth.
// Self-contained on purpose (sets.tsx imports this file, so nothing here may import sets.tsx). Same rules as sets.tsx: flat fills from C, 8 px ink
// outlines, no gradients, no digits anywhere on the art, everything driven only by the frame number f. Art bleeds 110 px past the frame.
import React from "react";
import {random} from "remotion";
import {C} from "../palette";
import {H, W} from "./contract";

export type TimeName = "may" | "july" | "noon" | "burst";
export const TIMES: TimeName[] = ["may", "july", "noon", "burst"];

const B = 110, INK = C.ink, TAU = Math.PI * 2;
const osc = (f: number, period: number, ph = 0) => Math.sin((f / period + ph) * TAU);
const mod = (v: number, m: number) => ((v % m) + m) % m;
const c01 = (v: number) => Math.min(1, Math.max(0, v));
const hx = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
const mix = (a: string, b: string, k: number) => { const A = hx(a), Z = hx(b); return "#" + A.map((v, i) => Math.round(v + (Z[i] - v) * k).toString(16).padStart(2, "0")).join(""); };
const pale = (c: string, k = 0.5) => mix(c, "#FFFFFF", k);
const deep = (c: string, k = 0.25) => mix(c, "#17203A", k);
const pts = (p: [number, number][]) => p.map((q) => q.join(",")).join(" ");

const Puff: React.FC<{x: number; y: number; s?: number; fill?: string; sw?: number}> = ({x, y, s = 1, fill = C.white, sw = 6}) =>
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -120 0 C -150 0 -150 -46 -108 -48 C -108 -90 -50 -104 -22 -76 C 0 -118 70 -108 74 -62 C 120 -66 138 -6 96 0 Z" fill={fill} stroke={INK} strokeWidth={sw / s} strokeLinejoin="round"/>
  </g>;
const PuffRow: React.FC<{f: number; list: [number, number, number, number][]; fill: string; span?: number}> = ({f, list, fill, span = W + 560}) =>
  <>{list.map(([x0, y, s, v], i) => <Puff key={i} x={mod(x0 + f * v, span) - 280} y={y} s={s} fill={fill}/>)}</>;
const SunDisc: React.FC<{x: number; y: number; r: number; f: number; fill?: string; rays?: number}> = ({x, y, r, f, fill = C.yellow, rays = 12}) => <g transform={`translate(${x} ${y})`}>
  <g transform={`rotate(${f * 0.4})`}>{Array.from({length: rays}, (_, i) => <line key={i} x1={r + 16} y1={0} x2={r + (i % 2 ? 40 : 60)} y2={0} stroke={INK} strokeWidth={8} strokeLinecap="round" transform={`rotate(${i * (360 / rays)})`}/>)}</g>
  <circle r={r} fill={fill} stroke={INK} strokeWidth={8}/>
</g>;
const Bird: React.FC<{x: number; y: number; f: number; ph?: number; s?: number}> = ({x, y, f, ph = 0, s = 1}) => {
  const fl = Math.sin(f * 0.45 + ph);
  return <path d={`M ${-26 * s} ${-4 * s} Q ${-13 * s} ${-26 * s * fl} 0 0 Q ${13 * s} ${-26 * s * fl} ${26 * s} ${-4 * s}`} transform={`translate(${x} ${y})`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"/>;
};

// ---- sky looks ----------------------------------------------------------------------------------------------------------------------------------
type Look = {top: string; bot: string; cloud: string; sun: boolean; build: string[]; floor: string; floorLine: string; wall: string; wallDark: string; veil?: string; veilA?: number};
const LOOK: Record<TimeName | "day", Look> = {
  day: {top: C.sky, bot: C.sky2, cloud: C.white, sun: true, build: ["#BCD4EE", "#A8C3E6", "#D2E1F4"], floor: "#CBD1DC", floorLine: "#AEB6C6", wall: "#EADFC8", wallDark: "#CDBF9F"},
  noon: {top: "#8CC8F6", bot: "#D2EAFB", cloud: C.white, sun: true, build: ["#BCD4EE", "#A8C3E6", "#D2E1F4"], floor: "#D8D2C2", floorLine: "#BDB59F", wall: "#F1E6CB", wallDark: "#D4C5A0"},
  may: {top: "#FFE6A3", bot: "#FFF4D2", cloud: "#FFF8E6", sun: true, build: ["#F3DBA2", "#E8C98A", "#F8E6B8"], floor: "#EBD5A6", floorLine: "#D5BA82", wall: "#F8E9BF", wallDark: "#DDC48A", veil: "#FFF3B0", veilA: 0.16},
  july: {top: "#8D99AE", bot: "#B3BECE", cloud: "#7B879C", sun: false, build: ["#7E8AA0", "#6F7B93", "#8D98AC"], floor: "#8E99AB", floorLine: "#7A859A", wall: "#B4BBC8", wallDark: "#98A1B2", veil: "#3A4A6E", veilA: 0.1},
  burst: {top: "#2B3358", bot: "#46507A", cloud: "#262C4A", sun: false, build: ["#2E3760", "#262E52", "#364069"], floor: "#4B5373", floorLine: "#3D4562", wall: "#6A7390", wallDark: "#565F7D", veil: "#0F1630", veilA: 0.18},
};
const lookOf = (t?: string): Look => LOOK[(t as TimeName) in LOOK ? (t as TimeName) : "day"];

const Sky: React.FC<{f: number; look: Look; horizon: number; time?: string; sunX?: number}> = ({f, look, horizon, time, sunX = 1380}) => <g>
  <rect x={-B} y={-B} width={W + 2 * B} height={horizon + B} fill={look.top}/>
  <rect x={-B} y={horizon * 0.52} width={W + 2 * B} height={horizon * 0.48} fill={look.bot}/>
  {look.sun && (time === "may"
    ? <g><circle cx={sunX} cy={170} r={118} fill="#FFFBE0" opacity={0.7}/><SunDisc x={sunX} y={170} r={72} f={f} fill="#FFF3A6" rays={16}/></g>
    : <SunDisc x={sunX} y={168} r={56} f={f}/>)}
  {time === "burst" || time === "july"
    ? <PuffRow f={f} fill={look.cloud} list={[[60, 120, 1.5, 0.35], [700, 220, 1.7, 0.28], [1300, 110, 1.6, 0.4], [1750, 260, 1.4, 0.3], [380, 330, 1.3, 0.22], [1050, 340, 1.5, 0.26]]}/>
    : <PuffRow f={f} fill={look.cloud} list={time === "may" ? [[300, 130, 0.7, 0.12]] : [[100, 150, 0.9, 0.25], [820, 110, 0.7, 0.18], [1500, 250, 0.8, 0.3]]}/>}
</g>;

// ---- rooftop ----------------------------------------------------------------------------------------------------------------------------------
const Rooftop: React.FC<{f: number; time?: string}> = ({f, time}) => {
  const look = lookOf(time), may = time === "may", wet = time === "july" || time === "burst";
  const sky: [number, number, number][] = [[-60, 150, 470], [90, 120, 420], [200, 170, 500], [370, 130, 440], [510, 150, 480], [670, 120, 410], [790, 180, 520], [980, 140, 450], [1130, 150, 490], [1290, 130, 420], [1430, 170, 510], [1600, 150, 460], [1750, 120, 430], [1860, 150, 480]];
  return <g>
    <Sky f={f} look={look} horizon={640} time={time} sunX={1180}/>
    {/* city behind the parapet */}
    {sky.map(([x, w, top], i) => <g key={i}>
      <rect x={x} y={top} width={w} height={650 - top} fill={look.build[i % 3]} stroke={INK} strokeWidth={6}/>
      {Array.from({length: Math.floor((650 - top - 50) / 52)}, (_, r) => Array.from({length: Math.max(1, Math.floor(w / 44))}, (_, c) =>
        random(`rt${i}-${r}-${c}`) > 0.45 ? <rect key={`${r}-${c}`} x={x + 12 + c * 40} y={top + 18 + r * 52} width={22} height={28} rx={3} fill={time === "burst" && random(`rl${i}-${r}-${c}`) > 0.5 ? C.yellow : pale(look.build[i % 3], 0.5)} stroke={INK} strokeWidth={3}/> : null))}
    </g>)}
    {[[330, 480], [1190, 450], [1660, 470]].map(([x, y], i) => <g key={i}><line x1={x} y1={y} x2={x} y2={y - 60} stroke={INK} strokeWidth={6}/><line x1={x - 22} y1={y - 40} x2={x + 22} y2={y - 40} stroke={INK} strokeWidth={5}/><line x1={x - 14} y1={y - 56} x2={x + 14} y2={y - 56} stroke={INK} strokeWidth={5}/></g>)}
    {may && [0, 1, 2, 3, 4].map((i) => { const y0 = 560 - i * 34, d = Array.from({length: 49}, (_, k) => `${k ? "L" : "M"} ${k * 44 - 40} ${y0 + Math.sin(k * 0.9 + f / 6 + i * 1.7) * 6}`).join(" ");
      return <path key={i} d={d} fill="none" stroke={C.white} strokeWidth={7} strokeLinecap="round" opacity={0.42}/>; })}
    {time === "july" || time === "burst" ? [0, 1, 2].map((i) => <Bird key={i} x={mod(f * 2.2 + i * 260 + 600, W + 300) - 150} y={300 + i * 44 + Math.sin(f / 22 + i) * 12} f={f} ph={i * 1.4} s={0.9}/>) : null}
    {/* stair headhouse (left) */}
    <rect x={-50} y={410} width={290} height={310} fill={look.wall} stroke={INK} strokeWidth={8}/>
    <rect x={-66} y={388} width={322} height={36} rx={8} fill={look.wallDark} stroke={INK} strokeWidth={8}/>
    <path d="M 70 720 L 70 560 Q 110 520 150 560 L 150 720 Z" fill={C.brown} stroke={INK} strokeWidth={7} strokeLinejoin="round"/><circle cx={134} cy={640} r={6} fill={C.gold}/>
    <rect x={176} y={470} width={44} height={50} rx={5} fill={look.top} stroke={INK} strokeWidth={6}/>
    {/* parapet */}
    <rect x={-B} y={626} width={W + 2 * B} height={96} fill={look.wall} stroke={INK} strokeWidth={8}/>
    <rect x={-B} y={606} width={W + 2 * B} height={30} rx={6} fill={look.wallDark} stroke={INK} strokeWidth={8}/>
    {Array.from({length: 18}, (_, i) => <rect key={i} x={i * 120 + 20} y={654} width={64} height={40} rx={4} fill={deep(look.wallDark, 0.2)} stroke={INK} strokeWidth={5}/>)}
    {/* floor */}
    <rect x={-B} y={716} width={W + 2 * B} height={H - 716 + B} fill={look.floor}/>
    {Array.from({length: 14}, (_, i) => { const x1 = i * 170 - 170; return <line key={i} x1={x1} y1={716} x2={960 + (x1 - 960) * 1.9} y2={H + B} stroke={look.floorLine} strokeWidth={6}/>; })}
    {[790, 880, 1000].map((y) => <line key={y} x1={-B} y1={y} x2={W + B} y2={y} stroke={look.floorLine} strokeWidth={6}/>)}
    <rect x={-B} y={706} width={W + 2 * B} height={20} fill={look.wallDark} stroke={INK} strokeWidth={5}/>
    {may && <polygon points={pts([[-B, 720], [W + B, 720], [W + B, 770], [-B, 770]])} fill="#FFF8D0" opacity={0.3 + 0.1 * osc(f, 60)}/>}
    {wet && [[360, 860, 150], [820, 990, 190], [1700, 890, 120]].map(([x, y, rx], i) => <g key={i}><ellipse cx={x} cy={y} rx={rx} ry={rx * 0.15} fill={pale(look.top, 0.3)} stroke={INK} strokeWidth={4}/>
      {time === "july" && [0, 1].map((k) => { const t = ((f / 40 + k / 2 + i * 0.3) % 1); return <ellipse key={k} cx={x} cy={y} rx={t * rx * 0.7} ry={t * rx * 0.1} fill="none" stroke={C.white} strokeWidth={4} opacity={1 - t}/>; })}</g>)}
    {/* water tank on its stand (right) */}
    <ellipse cx={1744} cy={768} rx={104} ry={14} fill={C.shadow}/>
    {[1672, 1816].map((x) => <rect key={x} x={x - 8} y={660} width={16} height={100} fill="#8D97AB" stroke={INK} strokeWidth={6}/>)}
    <rect x={1660} y={650} width={168} height={18} rx={5} fill="#8D97AB" stroke={INK} strokeWidth={6}/>
    <path d="M 1668 646 L 1668 470 Q 1668 440 1744 440 Q 1820 440 1820 470 L 1820 646 Z" fill="#2E3A5C" stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
    {[500, 560, 620].map((y) => <line key={y} x1={1670} y1={y} x2={1818} y2={y} stroke={INK} strokeWidth={5}/>)}
    <rect x={1722} y={414} width={44} height={30} rx={8} fill="#2E3A5C" stroke={INK} strokeWidth={7}/>
    <rect x={1684} y={470} width={14} height={140} rx={6} fill={C.white} opacity={0.22}/>
  </g>;
};

// ---- beach ------------------------------------------------------------------------------------------------------------------------------------
const Beach: React.FC<{f: number; time?: string}> = ({f, time}) => {
  const look = lookOf(time ?? "noon");
  const foamY = (x: number) => 668 + Math.sin(x / 140 + f / 20) * 9 + Math.sin(x / 61 - f / 14) * 4;
  const foam = Array.from({length: 50}, (_, k) => `${k ? "L" : "M"} ${k * 44 - 40} ${foamY(k * 44 - 40)}`).join(" ");
  const sandDots = Array.from({length: 70}, (_, i) => ({x: random(`sx${i}`) * (W + 100) - 50, y: 720 + random(`sy${i}`) * 340, r: 3 + random(`sr${i}`) * 4}));
  return <g>
    <Sky f={f} look={look} horizon={520} time={time ?? "noon"} sunX={1480}/>
    {[0, 1, 2].map((i) => <Bird key={i} x={mod(f * 2.4 + i * 330 + 200, W + 300) - 150} y={150 + i * 50 + Math.sin(f / 20 + i) * 12} f={f} ph={i * 1.6} s={0.9}/>)}
    {/* sea */}
    <rect x={-B} y={500} width={W + 2 * B} height={190} fill="#2F8FDB" stroke={INK} strokeWidth={8}/>
    <rect x={-B} y={508} width={W + 2 * B} height={46} fill="#59B0F0"/>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => { const y = 560 + i * 18;
      return <path key={i} d={`M ${(i * 233) % 400 - 100} ${y} q 40 -10 80 0 t 80 0 t 80 0`} transform={`translate(${mod(f * (0.6 + i * 0.1) + i * 300, 1100) - 300} 0)`} fill="none" stroke={C.white} strokeWidth={5} strokeLinecap="round" opacity={0.65}/>; })}
    {/* sailboat */}
    <g transform={`translate(1110 ${540 + Math.sin(f / 18) * 4}) rotate(${Math.sin(f / 24) * 2})`}>
      <path d="M -50 0 L 50 0 L 34 24 L -34 24 Z" fill={C.red} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
      <path d="M 0 -4 L 0 -96 L 40 -10 Z" fill={C.white} stroke={INK} strokeWidth={6} strokeLinejoin="round"/><line x1={0} y1={-100} x2={0} y2={2} stroke={INK} strokeWidth={6}/>
    </g>
    {/* sand */}
    <rect x={-B} y={680} width={W + 2 * B} height={H - 680 + B} fill="#F2D38A" stroke={INK} strokeWidth={8}/>
    <path d={`${foam} L ${W + 40} 720 L -40 720 Z`} fill="#E3BD70" stroke="none"/>
    <path d={foam} fill="none" stroke={C.white} strokeWidth={14} strokeLinecap="round" opacity={0.92}/>
    <path d={foam} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={0.5} transform="translate(0 9)"/>
    {sandDots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#D9B365" opacity={0.8}/>)}
    {[[420, 930], [560, 1000], [1500, 960], [1720, 1010]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={30} ry={11} fill="#D9B365" stroke={INK} strokeWidth={4}/>)}
    {/* heat shimmer over the sand */}
    {[0, 1, 2, 3].map((i) => { const y0 = 760 + i * 52, d = Array.from({length: 49}, (_, k) => `${k ? "L" : "M"} ${k * 44 - 40} ${y0 + Math.sin(k * 0.8 + f / 5 + i * 2) * 7}`).join(" ");
      return <path key={i} d={d} fill="none" stroke={C.white} strokeWidth={6} strokeLinecap="round" opacity={0.4}/>; })}
    {/* umbrella (left) */}
    <ellipse cx={260} cy={830} rx={120} ry={13} fill={C.shadow}/>
    <line x1={260} y1={560} x2={260} y2={830} stroke={INK} strokeWidth={14} strokeLinecap="round"/><line x1={260} y1={560} x2={260} y2={830} stroke="#E8DCC6" strokeWidth={6} strokeLinecap="round"/>
    <clipPath id="beach-umb"><path d="M 90 590 Q 260 400 430 590 Z"/></clipPath>
    <g clipPath="url(#beach-umb)">{Array.from({length: 6}, (_, i) => <rect key={i} x={90 + i * 56.7} y={400} width={56.7} height={200} fill={i % 2 ? C.white : C.red}/>)}</g>
    <path d="M 90 590 Q 260 400 430 590 Q 395 612 345 590 Q 305 612 260 590 Q 215 612 175 590 Q 125 612 90 590 Z" fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
    {/* palm (right) */}
    <g>
      <path d="M 1740 760 Q 1760 600 1700 430" fill="none" stroke={INK} strokeWidth={44} strokeLinecap="round"/><path d="M 1740 760 Q 1760 600 1700 430" fill="none" stroke="#B07A45" strokeWidth={28} strokeLinecap="round"/>
      <path d="M 1740 760 Q 1760 600 1700 430" fill="none" stroke="#8C5B2E" strokeWidth={28} strokeLinecap="round" strokeDasharray="4 30"/>
      <g transform="translate(1700 430)">
        {[-170, -130, -92, -52, -14, 24].map((a, i) => <path key={i} d="M 0 0 Q 70 -70 160 -18 Q 80 -34 0 8 Z" fill={i % 2 ? C.green : C.greenDark} stroke={INK} strokeWidth={6} strokeLinejoin="round"
          transform={`rotate(${a + osc(f, 90, i * 0.12) * 4})${a < -90 ? " scale(1 -1)" : ""}`}/>)}
        <circle cx={-14} cy={14} r={15} fill={C.brown} stroke={INK} strokeWidth={5}/><circle cx={14} cy={18} r={15} fill={C.brown} stroke={INK} strokeWidth={5}/>
      </g>
    </g>
  </g>;
};

// ---- himalaya: side view, north on the left, south (India) on the right -----------------------------------------------------------------------
const quad = (p0: [number, number], p1: [number, number], p2: [number, number], u: number): [number, number, number] => {
  const a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
  return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1], Math.atan2(2 * (1 - u) * (p1[1] - p0[1]) + 2 * u * (p2[1] - p1[1]), 2 * (1 - u) * (p1[0] - p0[0]) + 2 * u * (p2[0] - p1[0]))];
};
const WindArrow: React.FC<{x: number; y: number; ang: number; s: number; fill: string; o?: number}> = ({x, y, ang, s, fill, o = 1}) =>
  <g transform={`translate(${x} ${y}) rotate(${(ang * 180) / Math.PI}) scale(${s})`} opacity={o}>
    <path d="M -34 -12 L 8 -12 L 8 -28 L 40 0 L 8 28 L 8 12 L -34 12 Z" fill={fill} stroke={INK} strokeWidth={6 / s} strokeLinejoin="round"/>
    <path d="M -28 -5 L 2 -5" stroke={C.white} strokeWidth={4 / s} strokeLinecap="round" opacity={0.7}/>
  </g>;
const Range: React.FC<{poly: [number, number][]; snow: number; body: string; id: string}> = ({poly, snow, body, id}) => {
  const d = `M ${poly.map((p) => p.join(" ")).join(" L ")} Z`;
  const zig = Array.from({length: 22}, (_, i) => `L ${i * 100 - 100} ${snow + (i % 2 ? 34 : -6) + (i % 3) * 8}`).join(" ");
  return <g>
    <path d={d} fill={C.white} stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
    <clipPath id={id}><path d={`M -150 1200 L -150 ${snow} ${zig} L 2100 ${snow} L 2100 1200 Z`}/></clipPath>
    <path d={d} fill={body} clipPath={`url(#${id})`}/>
    {poly.slice(1, -1).map(([x, y], i) => y < snow + 140 ? <path key={i} d={`M ${x} ${y} L ${x + 70} ${y + 190} L ${x + 8} ${y + 190} Z`} fill={INK} opacity={0.1}/> : null)}
    <path d={d} fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
  </g>;
};
const Himalaya: React.FC<{f: number}> = ({f}) => {
  const back: [number, number][] = [[-120, 800], [90, 600], [250, 650], [420, 470], [560, 560], [720, 360], [850, 480], [990, 270], [1120, 420], [1260, 330], [1400, 490], [1540, 410], [1680, 580], [1800, 540], [2040, 700], [2040, 800]];
  const front: [number, number][] = [[-120, 820], [110, 720], [330, 660], [560, 590], [700, 540], [840, 600], [960, 520], [1110, 620], [1300, 560], [1450, 650], [1700, 700], [2040, 750], [2040, 820]];
  const cold = [0, 1, 2, 3].map((i) => { const y = 270 + i * 92, stop = [470, 520, 570, 620][i], t = mod(f + i * 27, 120) / 120, run = c01(t / 0.62), x = -60 + (stop + 60) * (1 - Math.pow(1 - run, 2)), bump = c01((t - 0.62) / 0.38);
    return {x: x - bump * 18, y: y - bump * bump * 70, ang: -bump * 1.0, s: 1.15 - bump * 0.3, o: 1 - bump};});
  const warmP: [[number, number], [number, number], [number, number]] = [[1960, 720], [1480, 700], [1330, 430]];
  return <g>
    <rect x={-B} y={-B} width={W + 2 * B} height={H + 2 * B} fill="#CFE6FA"/>
    <rect x={-B} y={200} width={W + 2 * B} height={500} fill="#E7F2FC"/>
    <PuffRow f={f} fill={C.white} list={[[100, 150, 0.8, 0.2], [900, 100, 0.7, 0.15]]}/>
    <Range poly={back} snow={470} body="#8EA9CF" id="him-back"/>
    {/* ground: frosty plateau on the north, green plains on the south */}
    <rect x={-B} y={790} width={960 + B} height={H - 790 + B} fill="#DCE8F3" stroke={INK} strokeWidth={8}/>
    <rect x={960} y={790} width={960 + B} height={H - 790 + B} fill="#8FD07F" stroke={INK} strokeWidth={8}/>
    <Range poly={front} snow={640} body="#6F8FBE" id="him-front"/>
    <rect x={-B} y={806} width={960 + B} height={H - 806 + B} fill="#DCE8F3"/><rect x={960} y={806} width={960 + B} height={H - 806 + B} fill="#8FD07F"/>
    <line x1={-B} y1={806} x2={W + B} y2={806} stroke={INK} strokeWidth={8}/>
    {Array.from({length: 12}, (_, i) => <g key={i} transform={`translate(${1010 + i * 78} ${860 + (i % 3) * 36})`}><circle r={16} fill="#4FA24D" stroke={INK} strokeWidth={4}/><circle cx={-5} cy={-6} r={6} fill="#7DC86B"/></g>)}
    {Array.from({length: 10}, (_, i) => <path key={i} d={`M ${60 + i * 88} ${850 + (i % 3) * 36} l 10 -10 l 10 10 M ${70 + i * 88} ${850 + (i % 3) * 36} l 0 -16`} stroke="#9DB7D3" strokeWidth={5} strokeLinecap="round" fill="none"/>)}
    {/* tags */}
    {[["NORTH", 150, 884, "#F4F8FD"], ["SOUTH · INDIA", 1240, 884, C.white]].map(([t, x, y, fill]) => { const w = 28 * (t as string).length + 50; return <g key={t as string}>
      <rect x={(x as number)} y={(y as number) - 54} width={w} height={64} rx={32} fill={fill as string} stroke={INK} strokeWidth={6}/><text x={(x as number) + w / 2} y={(y as number) - 8} textAnchor="middle" fontFamily="'LK Schibsted', Arial, sans-serif" fontWeight={900} fontSize={36} letterSpacing={2} fill={C.ink}>{t as string}</text></g>; })}
    {/* cold north winds bumping into the wall */}
    {cold.map((a, i) => <g key={i}><WindArrow x={a.x} y={a.y} ang={a.ang} s={a.s} fill="#A9D8FF" o={a.o}/>
      {[0, 1].map((k) => <path key={k} d={star(9)} transform={`translate(${a.x - 70 - k * 56} ${a.y + (k ? 26 : -24) + Math.sin(f / 7 + i + k) * 4}) rotate(${f * 2})`} fill={C.white} stroke={INK} strokeWidth={3} opacity={a.o}/>)}</g>)}
    {/* monsoon winds from the south, climbing and turned back at the wall, clouds piling up */}
    {Array.from({length: 6}, (_, i) => { const u = mod(f / 110 + i / 6, 1), [x, y, ang] = quad(warmP[0], warmP[1], warmP[2], u); return <WindArrow key={i} x={x} y={y} ang={ang} s={1.05} fill={C.blue} o={Math.min(1, u * 6) * (1 - c01((u - 0.82) / 0.18))}/>; })}
    {[[1420, 500, 1.0, 0], [1590, 470, 1.2, 1], [1760, 500, 0.95, 2], [1500, 380, 1.05, 3], [1680, 340, 1.25, 4], [1570, 250, 0.95, 5], [1380, 320, 0.8, 6]].map(([x, y, s, i]) => {
      const grow = 0.92 + 0.08 * osc(f, 70, (i as number) * 0.17), rise = Math.sin(f / 45 + (i as number)) * 6; return <Puff key={i as number} x={x as number} y={(y as number) + rise} s={(s as number) * grow} fill={(i as number) < 3 ? "#CBD9EA" : C.white}/>; })}
    {Array.from({length: 16}, (_, i) => { const x = 1380 + (i % 8) * 56 + (i > 7 ? 28 : 0), t = mod(f * 0.05 + i * 0.37, 1); return <line key={i} x1={x} y1={560 + t * 230} x2={x - 8} y2={584 + t * 230} stroke="#6FA8EE" strokeWidth={6} strokeLinecap="round" opacity={1 - t}/>; })}
  </g>;
};
const star = (r: number) => `M 0 ${-r} Q ${r * 0.14} ${-r * 0.14} ${r} 0 Q ${r * 0.14} ${r * 0.14} 0 ${r} Q ${-r * 0.14} ${r * 0.14} ${-r} 0 Q ${-r * 0.14} ${-r * 0.14} 0 ${-r} Z`;

export const NewSet: React.FC<{set: "rooftop" | "beach" | "himalaya"; f: number; time?: string}> = ({set, f, time}) =>
  set === "rooftop" ? <Rooftop f={f} time={time}/> : set === "beach" ? <Beach f={f} time={time}/> : <Himalaya f={f}/>;

// ---- time of day on the older sets: a flat veil, and dark cloud banks for the burst ---------------------------------------------------------------
export const TimeCover: React.FC<{f: number; time: string}> = ({f, time}) => {
  const look = lookOf(time);
  if (time === "burst") return <g>
    <rect x={-B} y={-B} width={W + 2 * B} height={H + 2 * B} fill="#0F1630" opacity={0.5}/>
    <rect x={-B} y={-B} width={W + 2 * B} height={330 + B} fill="#262C4A"/>
    <PuffRow f={f} fill="#1E2440" list={[[40, 70, 1.8, 0.45], [520, 190, 2.0, 0.38], [1000, 60, 1.9, 0.5], [1450, 200, 2.0, 0.4], [260, 290, 1.5, 0.3], [1250, 320, 1.6, 0.34]]}/>
    <Puff x={1700 + osc(f, 200) * 12} y={86} s={1.25} fill="#B9C4DB"/>
  </g>;
  return look.veil ? <rect x={-B} y={-B} width={W + 2 * B} height={H + 2 * B} fill={look.veil} opacity={(look.veilA ?? 0.1) * 1.4}/> : null;
};

// ---- weather in front of everything ----------------------------------------------------------------------------------------------------------
export const Rain: React.FC<{f: number; heavy?: boolean}> = ({f, heavy}) => {
  const n = heavy ? 150 : 110;
  return <g>
    {Array.from({length: n}, (_, i) => {
      const sp = 26 + random(`rs${i}`) * 14, x0 = random(`rx${i}`) * (W + 400) - 100, y0 = random(`ry${i}`) * (H + 200), len = 46 + random(`rl${i}`) * 32;
      const y = mod(y0 + f * sp, H + 200) - 100, x = x0 - (y + 100) * 0.16;
      return <line key={i} x1={x} y1={y} x2={x - len * 0.16} y2={y + len} stroke={i % 3 ? "#D9ECFF" : "#9CC9F5"} strokeWidth={i % 4 ? 4 : 6} strokeLinecap="round" opacity={0.85}/>;
    })}
    {Array.from({length: 14}, (_, i) => { const t = mod(f / 14 + random(`sp${i}`), 1), x = random(`spx${i}`) * W, y = 790 + random(`spy${i}`) * 220;
      return <ellipse key={i} cx={x} cy={y} rx={4 + t * 26} ry={1.5 + t * 7} fill="none" stroke={C.white} strokeWidth={3.5} opacity={(1 - t) * 0.8}/>; })}
  </g>;
};

// Lightning: a flash and a forked bolt for a few frames, about every 2.5 s, at a new place each time.
export const Lightning: React.FC<{f: number}> = ({f}) => {
  const P = 78, k = Math.floor(f / P), g = f % P, off = Math.floor(random(`lo${k}`) * 20), q = g - 6 - off;
  if (q < 0 || q > 9) return null;
  const x = 220 + random(`lx${k}`) * 1300, flash = [0.75, 0.15, 0.55, 0.1, 0.3, 0.08, 0.05, 0.03, 0.02, 0.01][q];
  const seg: [number, number][] = [[x, -20], [x + 30, 120], [x - 14, 140], [x + 46, 330], [x - 6, 346], [x + 40, 540]];
  const bolt = q < 5;
  return <g>
    <rect x={-B} y={-B} width={W + 2 * B} height={H + 2 * B} fill="#FFFFFF" opacity={flash}/>
    {bolt && <g><polyline points={pts(seg)} fill="none" stroke={INK} strokeWidth={26} strokeLinejoin="round" strokeLinecap="round"/><polyline points={pts(seg)} fill="none" stroke="#FFF8B0" strokeWidth={13} strokeLinejoin="round" strokeLinecap="round"/></g>}
  </g>;
};

// ---- opening Earth with a white cloud band (stage intro "globe-band") -------------------------------------------------------------------------
export const GlobeIntro: React.FC<{f: number}> = ({f}) => {
  const R = 330, cx = 960, cy = 520, sc = 0.94 + 0.06 * Math.min(1, f / 14);
  const band = (sign: number) => Array.from({length: 33}, (_, k) => { const x = -R + k * (R / 16); return `${x} ${sign * 52 + Math.sin(x / 70 + f / 9) * 11 + 12}`; });
  const bandD = `M ${band(-1).join(" L ")} L ${band(1).reverse().join(" L ")} Z`;
  return <g>
    <rect x={-B} y={-B} width={W + 2 * B} height={H + 2 * B} fill="#0F1B33"/>
    {Array.from({length: 46}, (_, i) => <circle key={i} cx={random(`gsx${i}`) * W} cy={random(`gsy${i}`) * H} r={2 + random(`gsr${i}`) * 3} fill={C.white} opacity={0.4 + 0.5 * Math.abs(osc(f, 40 + (i % 5) * 9, i * 0.13))}/>)}
    <g transform={`translate(${cx} ${cy}) scale(${sc})`}>
      <clipPath id="gb-clip"><circle r={R}/></clipPath>
      <circle r={R + 14} fill={C.blue} opacity={0.25}/>
      <circle r={R} fill="#2F6FDE"/>
      <g clipPath="url(#gb-clip)">
        {["M -60 -150 C 20 -170 90 -120 110 -40 C 130 40 70 140 20 230 C -20 260 -60 160 -90 80 C -140 20 -130 -110 -60 -150 Z",
          "M -40 -250 C 60 -310 220 -250 320 -140 C 340 -60 250 -40 190 -90 C 130 -120 60 -150 0 -190 Z",
          "M 160 -30 C 220 -26 250 -34 262 -12 C 248 50 224 112 204 134 C 180 82 156 30 160 -30 Z",
          "M -280 -20 C -220 -50 -170 0 -180 80 C -190 160 -230 220 -250 190 C -270 120 -310 40 -280 -20 Z"].map((d, i) => <path key={i} d={d} fill={i === 2 ? C.lime : C.green} stroke={INK} strokeWidth={7} strokeLinejoin="round"/>)}
        <path d={bandD} fill={C.white} opacity={0.94} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
        {[-250, -130, -10, 110, 230].map((x, i) => <Puff key={i} x={x + osc(f, 90, i * 0.2) * 10} y={14 + Math.sin(x / 70 + f / 9) * 11 - 20 + (i % 2) * 30} s={0.5} fill={C.white} sw={7}/>)}
        <path d={`M ${-R} 0 a ${R} ${R} 0 1 0 ${2 * R} 0 a ${R} ${R} 0 1 0 ${-2 * R} 0 Z M ${-R - 70} -30 a ${R + 40} ${R + 40} 0 1 0 ${2 * (R + 40)} 0 a ${R + 40} ${R + 40} 0 1 0 ${-2 * (R + 40)} 0 Z`} fillRule="evenodd" fill="#0F1B33" opacity={0.22}/>
      </g>
      <circle r={R} fill="none" stroke={INK} strokeWidth={9}/>
      <path d="M -250 -190 Q -170 -270 -60 -296" fill="none" stroke={C.white} strokeWidth={12} strokeLinecap="round" opacity={0.55}/>
    </g>
  </g>;
};
