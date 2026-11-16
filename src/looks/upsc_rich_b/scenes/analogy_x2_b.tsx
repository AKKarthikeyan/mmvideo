// ECO-12 Part 2, builder X2: `excise-cards`, `tax-funnel`, `council-sheet`, `vote-meter`.
// The vote meter's blocks are drawn from Art. 279A(9)'s shares (claim E12-D01), not typed; the labels carry the fractions.
import React from "react";
import {type AP} from "./analogy_kit";
import {Desk, Ink, Room, Shadow, Sheet, W5Defs, clamp, eo, prog, show, slotLabels, atOr, W, H} from "./analogy_w5_kit";
import {eio} from "../kit";

const Card: React.FC<{x: number; y: number; t: string; c?: string; a?: number; rot?: number}> = ({x, y, t, c = "#fffaf0", a = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={a}>
    <rect x={-95} y={-34} width={190} height={68} rx={8} fill={c} stroke="#a88a60" strokeWidth={2.5}/><Ink x={0} y={8} t={t} size={17} c="#5e2a0e"/>
  </g>
);

// ---------------------------------------------------------------- excise-cards
const OLD = ["SERVICE TAX", "EXCISE · CLOTH", "EXCISE · CARS", "EXCISE · SOAP", "EXCISE · STEEL", "EXCISE · PHONES", "EXCISE · PAPER", "EXCISE · TYRES"];
const Fuel: React.FC<{x: number; y: number; leaf?: boolean}> = ({x, y, leaf}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={58} fill="#fffaf0" stroke="#a88a60" strokeWidth={3}/>
    {leaf ? <path d="M0,34 Q-40,0 0,-38 Q40,0 0,34 Z M0,34 V-30" fill="#7a9a4a" stroke="#3a5a2a" strokeWidth={3}/>
      : <path d="M0,-36 Q30,0 22,18 Q12,38 0,38 Q-12,38 -22,18 Q-30,0 0,-36 Z" fill="#3b4a5c"/>}
  </g>
);
export const ExciseArt: React.FC<AP> = (p) => {
  const {f} = p, gone = eio(prog(f, atOr(p, "om") - 20, 50)), keep = show(p, "ex", 24);
  return <g>
    <W5Defs/>
    <Room y0={760} win={[1720, 80]}/>
    <Desk y0={760}/>
    {OLD.map((t, i) => <Card key={t} x={300 + (i % 4) * 230} y={300 + Math.floor(i / 4) * 120 + gone * 40 * (i % 2 ? 1 : -1)} t={t} a={1 - gone * (i === 0 ? 1 : 0.85)} rot={(i % 3 - 1) * 3}/>)}
    {gone > 0.3 && <path d="M220,250 L1050,480" stroke="#c0392b" strokeWidth={6} opacity={gone * 0.6}/>}
    <g opacity={keep} transform={`translate(0 ${(1 - keep) * 30})`}>
      <rect x={1150} y={250} width={620} height={420} rx={14} fill="#fffaf0" stroke="#a88a60" strokeWidth={3}/>
      <Ink x={1460} y={300} t="UNION EXCISE" size={26} c="#5e2a0e"/>
      {[0, 1, 2, 3, 4, 5].map((i) => <Fuel key={i} x={1260 + (i % 3) * 200} y={410 + Math.floor(i / 3) * 150} leaf={i === 5}/>)}
    </g>
  </g>;
};
export const ExciseLabels = slotLabels({om: {cx: 640, y: 84, size: 32, maxW: 760}, ex: {cx: 1300, y: 846, size: 30, maxW: 900}});

// ---------------------------------------------------------------- tax-funnel
const LEFT = ["EXCISE", "SERVICE TAX", "EXTRA CUSTOMS"], RIGHT = ["VAT", "CST", "LUXURY", "ENTRY", "ENTERTAINMENT"];
export const FunnelArt: React.FC<AP> = (p) => {
  const {f} = p, l = clamp(prog(f, atOr(p, "fc") - 10, 120)), r = clamp(prog(f, atOr(p, "fs") - 10, 140)), done = show(p, "ct", 20);
  const fly = (t: string, i: number, n: number, u: number, side: -1 | 1) => {
    const k = clamp(u * (n + 1) - i), x = 960 + side * (760 - 700 * k), y = 260 + i * 70 + (440 - 260 - i * 70) * k * k;
    return <Card key={t} x={x} y={y} t={t} c={side < 0 ? "#dfeaf4" : "#f7e3c4"} a={k < 1 ? 1 : 0} rot={side * (1 - k) * 10}/>;
  };
  return <g>
    <W5Defs/>
    <Room y0={800} win={[960, 60]}/>
    <rect x={-60} y={800} width={W + 120} height={300} fill="#b89a70"/>
    <Shadow x={960} y={800} rx={260}/>
    <path d="M700,400 H1220 L1010,660 V780 H910 V660 Z" fill="#c99a62" stroke="#5e3518" strokeWidth={5}/>
    <path d="M720,410 H1200" stroke="#fff" strokeWidth={6} opacity={0.3}/>
    <Ink x={960} y={540} t="GST" size={60} c="#3a1e0c"/>
    {LEFT.map((t, i) => fly(t, i, LEFT.length, l, -1))}
    {RIGHT.map((t, i) => fly(t, i, RIGHT.length, r, 1))}
    <circle cx={960} cy={540} r={200} fill="url(#w5-glow)" opacity={done * 0.6}/>
  </g>;
};
export const FunnelLabels = slotLabels({fc: {cx: 420, y: 84, size: 26, maxW: 680}, fs: {cx: 1500, y: 84, size: 26, maxW: 680}, ct: {cx: 960, y: 846, size: 34, tone: "dark"}});

// ---------------------------------------------------------------- council-sheet
export const SheetArt: React.FC<AP> = (p) => {
  const {f} = p, ticks = clamp(prog(f, atOr(p, "ls") - 20, 60)), noz = show(p, "dt", 20, 10), ban = (k: string) => show(p, k, 18);
  const lines = ["TAXES MERGED", "EXEMPTIONS", "RATES", "THRESHOLDS"];
  return <g>
    <W5Defs/>
    <Room y0={600} win={[960, 70]}/>
    <Desk y0={600}/>
    <Sheet x={560} y={400} w={560} h={420} rot={-1.5}>
      <Ink x={0} y={-160} t="RECOMMENDATIONS" size={26} c="#5e2a0e"/>
      {lines.map((t, i) => <g key={t}>
        <rect x={-220} y={-110 + i * 70} width={40} height={40} rx={6} fill="#fffaf0" stroke="#7a4a26" strokeWidth={3}/>
        <path d={`M-212,${-90 + i * 70} l12,12 l22,-26`} stroke="#3f7a2a" strokeWidth={6} fill="none" strokeLinecap="round" opacity={clamp(ticks * 4 - i)}/>
        <Ink x={-160} y={-80 + i * 70} t={t} size={22} c="#3a1e0c" anchor="start"/>
      </g>)}
    </Sheet>
    <g transform="translate(1440 430)" opacity={noz}>
      <rect x={-60} y={-160} width={120} height={220} rx={10} fill="#c0392b" stroke="#6e1e18" strokeWidth={3}/><rect x={-44} y={-140} width={88} height={50} rx={6} fill="#fff6d8"/>
      <path d="M60,-30 Q130,-30 130,30 V60" stroke="#2a2a2a" strokeWidth={10} fill="none"/>
      <g transform="translate(-150 -120) rotate(-6)"><rect x={-60} y={-40} width={120} height={80} rx={6} fill="#fffaf0" stroke="#7a4a26" strokeWidth={3}/><rect x={-60} y={-40} width={120} height={20} rx={6} fill="#c0392b"/>
        <path d="M-36,16 H36" stroke="#c9b48a" strokeWidth={4} strokeDasharray="8 6"/></g>
    </g>
    {[{x: 560, k: "nc"}, {x: 1400, k: "cn"}].map((b) => <g key={b.k} opacity={ban(b.k)}>
      <rect x={b.x - 330} y={760} width={8} height={160} fill="#6e4424"/><rect x={b.x + 322} y={760} width={8} height={160} fill="#6e4424"/>
    </g>)}
  </g>;
};
export const SheetLabels = slotLabels({cr: {cx: 560, y: 84, size: 34, upper: true}, ls: {cx: 560, y: 650, size: 26, maxW: 660}, dt: {cx: 1440, y: 160, size: 26, maxW: 560},
  nc: {cx: 560, y: 790, size: 28, maxW: 700}, cn: {cx: 1400, y: 790, size: 28, maxW: 700}});

// ---------------------------------------------------------------- vote-meter
export const VoteArt: React.FC<AP> = (p) => {
  const {f} = p, x0 = 380, w = 1160, line = x0 + w * 0.75;
  const rows = [{y: 420, t: "CENTRE", share: 1 / 3, k: "u", c: "#2f78b8"}, {y: 560, t: "ALL STATES", share: 2 / 3, k: "s", c: "#d8682a"}, {y: 700, t: "TOGETHER", share: 1, k: "ow", c: "#3f9a5a"}];
  const lineA = show(p, "v", 20);
  return <g>
    <W5Defs/>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#efe0c2"/>
    {rows.map((r) => {
      const u = eio(prog(f, atOr(p, r.k) - 6, 40)) * (r.k === "ow" ? clamp(prog(f, atOr(p, "ow") + 30, 1)) : 1);
      return <g key={r.k}>
        <Ink x={x0 - 20} y={r.y + 12} t={r.t} size={24} c="#3a1e0c" anchor="end"/>
        <rect x={x0} y={r.y - 36} width={w} height={72} rx={12} fill="#e4d3b0" stroke="#a88a60" strokeWidth={3}/>
        {r.k === "ow" ? <>
          <rect x={x0} y={r.y - 30} width={w * (1 / 3) * u} height={60} rx={10} fill="#2f78b8"/>
          <rect x={x0 + w / 3} y={r.y - 30} width={w * (2 / 3) * u} height={60} rx={10} fill="#d8682a"/>
        </> : <rect x={x0} y={r.y - 30} width={w * r.share * u} height={60} rx={10} fill={r.c}/>}
      </g>;
    })}
    <g opacity={lineA}>
      <path d={`M${line},330 V770`} stroke="#c0392b" strokeWidth={6} strokeDasharray="14 10"/>
      <path d={`M${line - 16},330 L${line},306 L${line + 16},330 Z`} fill="#c0392b"/>
    </g>
  </g>;
};
export const VoteLabels = slotLabels({v: {cx: 1250, y: 160, size: 30, maxW: 760, tone: "dark"}, u: {cx: 520, y: 200, size: 28, maxW: 480}, s: {cx: 1500, y: 846, size: 28, maxW: 560},
  ow: {cx: 560, y: 846, size: 28, maxW: 640, tone: "green"}});
