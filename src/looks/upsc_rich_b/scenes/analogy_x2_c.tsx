// ECO-12 Part 2, builder X2: `padlocks`, `midnight-clock`, `ship-freight`, `shared-pen`.
// Buildings are generic (no Parliament or court emblem, no copy of a real building).
import React from "react";
import {Cloud, type AP} from "./analogy_kit";
import {Desk, Ink, Portico, Room, Shadow, Sheet, W5Defs, clamp, eo, prog, show, slotLabels, atOr, W, H} from "./analogy_w5_kit";
import {Hand} from "./analogy_x2_a";
import {eio} from "../kit";

// ---------------------------------------------------------------- padlocks
const Lock: React.FC<{x: number; y: number; a: number; swing: number; tag?: boolean}> = ({x, y, a, swing, tag}) => (
  <g transform={`translate(${x} ${y}) rotate(${swing})`} opacity={a}>
    <path d="M-34,0 V-50 Q0,-96 34,-50 V0" stroke="#7a5414" strokeWidth={14} fill="none"/>
    <rect x={-60} y={-6} width={120} height={110} rx={16} fill="url(#w5-brass)" stroke="#7a5414" strokeWidth={4}/>
    <circle cx={0} cy={40} r={12} fill="#3a1e0c"/><rect x={-5} y={44} width={10} height={30} fill="#3a1e0c"/>
    {tag && <g transform="translate(70 80) rotate(10)"><rect x={-10} y={-20} width={120} height={50} rx={6} fill="#fffaf0" stroke="#7a4a26" strokeWidth={3}/><Ink x={50} y={14} t="PART 3" size={18} c="#c0392b"/></g>}
  </g>
);
export const LocksArt: React.FC<AP> = (p) => {
  const {f} = p, ks = ["rt", "dm", "cp"], X = [620, 960, 1300];
  return <g>
    <W5Defs/>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w5-room)"/>
    <Shadow x={960} y={940} rx={620}/>
    <rect x={460} y={160} width={1000} height={780} rx={10} fill="url(#w5-wood)" stroke="#3a1e0c" strokeWidth={5}/>
    {[0, 1].map((i) => <rect key={i} x={500 + i * 470} y={200} width={420} height={700} rx={8} fill="none" stroke="#3a1e0c" strokeWidth={3} opacity={0.4}/>)}
    <Ink x={960} y={240} t="GST COUNCIL" size={30} c="#f3e4c4"/>
    <path d="M520,470 Q960,560 1400,470" stroke="#5a5a5a" strokeWidth={10} fill="none"/>
    {ks.map((k, i) => { const a = show(p, k, 16, 4), sw = Math.sin(f / 12 + i) * 6 * Math.exp(-Math.max(0, f - atOr(p, k)) / 40); return <Lock key={k} x={X[i]} y={520 - (i === 1 ? -40 : 0)} a={a} swing={sw} tag={i === 2}/>; })}
  </g>;
};
export const LocksLabels = slotLabels({rt: {cx: 520, y: 84, size: 26, maxW: 600}, dm: {cx: 960, y: 846, size: 28, maxW: 760}, cp: {cx: 1420, y: 84, size: 26, maxW: 600}, p3: {cx: 1560, y: 760, size: 26, tone: "dark"}});

// ---------------------------------------------------------------- midnight-clock
export const ClockArt: React.FC<AP> = (p) => {
  const {f} = p, strike = eio(prog(f, atOr(p, "md") - 30, 40)), m = -60 + 60 * strike, flip = eio(prog(f, atOr(p, "md"), 30)), ring = show(p, "md", 10) * (1 - clamp(prog(f, atOr(p, "md") + 30, 40)));
  return <g>
    <W5Defs/>
    <defs><linearGradient id="x2-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#141c38"/><stop offset="1" stopColor="#3a3a5a"/></linearGradient></defs>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#x2-night)"/>
    {Array.from({length: 40}, (_, i) => <circle key={i} cx={(i * 197) % W} cy={(i * 89) % 420} r={1.5 + (i % 3)} fill="#fff6d8" opacity={0.4 + 0.3 * Math.sin(f / 20 + i)}/>)}
    <rect x={-60} y={800} width={W + 120} height={300} fill="#2a2a3a"/>
    <g opacity={0.85}><Portico x={760} y={790} w={760} h={320} cols={10} open={0.8} tone="stone"/></g>
    <path d="M500,470 Q760,330 1020,470 Z" fill="#cdb48c" opacity={0.85}/>
    <g transform="translate(760 280)">
      <circle r={120} fill="#fff6d8" stroke="url(#w5-brass)" strokeWidth={12}/><circle r={160} fill="url(#w5-glow)" opacity={ring}/>
      {Array.from({length: 12}, (_, i) => <path key={i} d={`M0,-100 V-84`} stroke="#3a1e0c" strokeWidth={5} transform={`rotate(${i * 30})`}/>)}
      <path d="M0,0 V-60" stroke="#3a1e0c" strokeWidth={10} strokeLinecap="round"/>
      <path d="M0,0 V-90" stroke="#3a1e0c" strokeWidth={6} strokeLinecap="round" transform={`rotate(${m})`}/>
      <circle r={8} fill="#3a1e0c"/>
    </g>
    <g transform="translate(1500 420)">
      <rect x={-140} y={-130} width={280} height={260} rx={10} fill="#fffaf0" stroke="#a88a60" strokeWidth={3}/><rect x={-140} y={-130} width={280} height={60} rx={10} fill="#c0392b"/>
      <g opacity={1 - flip}><Ink x={0} y={30} t="30 JUNE" size={40} c="#2a1a10"/></g>
      <g opacity={flip}><Ink x={0} y={30} t="1 JULY" size={44} c="#2a1a10"/></g>
      <Ink x={0} y={-88} t="2017" size={26} c="#fff"/>
    </g>
  </g>;
};
export const ClockLabels = slotLabels({md: {cx: 960, y: 846, size: 32, maxW: 1000}, nc: {cx: 960, y: 84, size: 32, maxW: 1100}});

// ---------------------------------------------------------------- ship-freight
export const ShipArt: React.FC<AP> = (p) => {
  const {f} = p, x = 300 + 300 * clamp(f / 400), roll = Math.sin(f / 18) * 1.5, tag = show(p, "ig", 20), stamp = eo(prog(f, atOr(p, "sd"), 14));
  return <g>
    <W5Defs/>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w5-sky)"/>
    {[0, 1].map((i) => <Cloud key={i} x={500 + i * 800} y={140} s={0.8} f={f} speed={0.2} seed={i + 51} a={0.85}/>)}
    <rect x={-60} y={620} width={W + 120} height={500} fill="#3f78a8"/>
    {Array.from({length: 8}, (_, i) => <path key={i} d={`M${-60 + ((i * 260 + f) % 2100)},${660 + (i % 4) * 70} q40,-14 80,0`} stroke="#cfe6f5" strokeWidth={4} fill="none" opacity={0.6}/>)}
    <g transform={`translate(${x} 640) rotate(${roll})`}>
      <path d="M-380,0 H420 L360,110 H-330 Z" fill="#3b3f48" stroke="#1e2028" strokeWidth={4}/><rect x={-380} y={10} width={800} height={14} fill="#c0392b"/>
      {Array.from({length: 10}, (_, i) => <rect key={i} x={-300 + (i % 5) * 112} y={-76 - Math.floor(i / 5) * 70} width={104} height={64} rx={4} fill={["#d8682a", "#2f78b8", "#3f9a5a", "#e8c46c", "#c0392b"][i % 5]} stroke="#1e2028" strokeWidth={2}/>)}
      <rect x={300} y={-130} width={90} height={130} fill="#f3e4c4" stroke="#1e2028" strokeWidth={3}/>
      <g transform="translate(-60 -170) rotate(-4)" opacity={tag}>
        <path d="M-120,-44 H80 L120,0 L80,44 H-120 Z" fill="#f6dd8a" stroke="#7a5414" strokeWidth={3}/><Ink x={-20} y={-2} t="IGST ON" size={20} c="#3a1e0c"/><Ink x={-20} y={26} t="FREIGHT" size={20} c="#3a1e0c"/>
        <g opacity={stamp} transform={`scale(${1.4 - 0.4 * stamp})`}><path d="M-110,-40 L110,40 M-110,40 L110,-40" stroke="#c0392b" strokeWidth={10} strokeLinecap="round"/></g>
      </g>
    </g>
    <Portico x={1660} y={600} w={300} h={260} cols={4} open={0.3}/>
  </g>;
};
export const ShipLabels = slotLabels({mm: {cx: 760, y: 84, size: 32, maxW: 900}, ig: {cx: 1500, y: 240, size: 30}, sd: {cx: 760, y: 846, size: 40, upper: true, tone: "dark"}});

// ---------------------------------------------------------------- shared-pen
export const PenShareArt: React.FC<AP> = (p) => {
  const {f} = p, hands = eio(prog(f, 4, 30)), talk = show(p, "fd", 20);
  return <g>
    <W5Defs/>
    <Room y0={560} win={[960, 60]}/>
    <Desk y0={560}/>
    <Sheet x={960} y={720} w={640} h={300} rot={-1}>
      <Ink x={0} y={-100} t="GST LAW" size={30} c="#5e2a0e"/>{[-50, -10, 30, 70].map((y) => <path key={y} d={`M-260,${y} H${y > 50 ? 60 * Math.min(1, f / 200) : 260}`} stroke="#c9b48a" strokeWidth={6}/>)}
    </Sheet>
    <g transform={`translate(960 ${500 + Math.sin(f / 16) * 6})`} opacity={hands}>
      <rect x={-200} y={-10} width={400} height={20} rx={8} fill="#3f78a8"/><path d="M200,-10 L240,0 L200,10 Z" fill="#c99a3a"/>
      <Hand x={-120} y={6}/><Hand x={120} y={-6} flip/>
    </g>
    {[0, 1, 2, 3].map((i) => {
      const a = talk * (0.55 + 0.45 * Math.sin(f / 20 - i * 1.6)), left = i % 2 === 0;
      return <g key={i} transform={`translate(${left ? 520 - i * 30 : 1400 + i * 30} ${380 - i * 50})`} opacity={a}>
        <path d={`M-90,-40 H90 Q110,-40 110,-20 V20 Q110,40 90,40 H${left ? 10 : -10} L${left ? -30 : 30},70 V40 H-90 Q-110,40 -110,20 V-20 Q-110,-40 -90,-40 Z`} fill="#fffaf0" stroke={left ? "#8a5ab8" : "#3f78a8"} strokeWidth={4}/>
        {[-10, 10].map((y) => <path key={y} d={`M-70,${y} H70`} stroke="#d6c39c" strokeWidth={6}/>)}
      </g>;
    })}
  </g>;
};
export const PenShareLabels = slotLabels({rb: {cx: 480, y: 84, size: 26, maxW: 720}, lp: {cx: 1440, y: 84, size: 26, maxW: 720}, fd: {cx: 520, y: 846, size: 28}, eq: {cx: 1400, y: 846, size: 28}});
