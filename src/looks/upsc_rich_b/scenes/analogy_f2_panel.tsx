// ECO-16 Part 2, builder F2: `rbi-panel` (b11). A control console with five dials in two groups: QUANTITATIVE (CRR, bank rate, bonds) and QUALITATIVE (moral suasion, margin requirement, with an "e.g." tag).
// At `up` the CRR dial turns up and a money bar beside its pipe shrinks while the banks' lending arrows shorten. No figures are printed; every word comes from a spec label or names a dial.
import React from "react";
import {SANS, SERIF, W, H, clamp} from "../kit";
import type {AP} from "./analogy_kit";
import {FlowArrow} from "./analogy_kit";
import {BalanceBar, Classical, Defs, Dial, ECard, OfficeBG, Plate, Shade, Spot, elabs, ez, lerp, pulse, sm} from "./analogy_f2_kit";

const CY = 690, CRR = {x: 330, r: 118}, QX = [330, 640, 950], LX = [1370, 1640];
const BAR = {x: 330, base: 450, h: 240}, BANK = {x: 650, base: 450}, ARW = {x0: 770, y: [292, 346, 400]};

const House: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`} filter="url(#e3-sh-s)">
    <rect x={-22} y={-6} width={44} height={30} fill="#e8c88a" stroke="#8a6a3a" strokeWidth={2.4}/><path d="M-28,-4 L0,-30 L28,-4 Z" fill="#c0603d" stroke="#7a2f1a" strokeWidth={2.4} strokeLinejoin="round"/>
    <rect x={-6} y={6} width={12} height={18} fill="#6a4a2a"/><rect x={8} y={2} width={10} height={9} fill="#9cc8ea" stroke="#8a6a3a" strokeWidth={1.4}/>
  </g>
);
const Shop: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`} filter="url(#e3-sh-s)">
    <rect x={-26} y={-8} width={52} height={32} fill="#f3e3b8" stroke="#8a6a3a" strokeWidth={2.4}/>
    {Array.from({length: 6}, (_, i) => <path key={i} d={`M${-26 + i * 8.7},-8 l8.7,0 l-3,-14 l-8.7,0 Z`} fill={i % 2 ? "#fffaf0" : "#2f9a4a"} stroke="#14502a" strokeWidth={1}/>)}
    <rect x={-8} y={4} width={16} height={20} fill="#6a4a2a"/>
  </g>
);
const Cart: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`} filter="url(#e3-sh-s)">
    <path d="M-26,-10 H22 L16,12 H-20 Z" fill="#c9a15a" stroke="#6a4a2a" strokeWidth={2.4} strokeLinejoin="round"/>
    <path d="M22,-10 L34,-20" stroke="#6a4a2a" strokeWidth={3} strokeLinecap="round"/>
    <circle cx={-12} cy={18} r={8} fill="#3d4a54" stroke="#1c2630" strokeWidth={2}/><circle cx={10} cy={18} r={8} fill="#3d4a54" stroke="#1c2630" strokeWidth={2}/>
    {[-14, 0, 14].map((dx, i) => <circle key={i} cx={dx} cy={-14} r={6} fill={["#d3302a", "#f3a52a", "#9cc454"][i]} stroke="#4a2a10" strokeWidth={1.2}/>)}
  </g>
);

export const RbiPanelArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p);
  const up = sm(f, L.up.at, 70), tQ = L.qn.at, tL = L.ql.at;
  const crrAng = lerp(-30, 78, up) + Math.sin(f / 4) * 0.5 * pulse(f, L.up.at, 90);
  const idle = (i: number, base: number) => base + Math.sin(f / 46 + i * 1.7) * 3.5;
  const level = lerp(0.9, 0.5, up), alen = lerp(1, 0.46, up);
  const dials: {x: number; r: number; base: number; face: string; plate: string; at: number; i: number}[] = [
    {x: QX[1], r: 100, base: 10, face: "#fbf3dc", plate: "BANK RATE", at: tQ, i: 1},
    {x: QX[2], r: 100, base: -40, face: "#fbf3dc", plate: "BONDS", at: tQ + 10, i: 2},
    {x: LX[0], r: 90, base: 30, face: "#e6eef0", plate: "MORAL SUASION", at: tL, i: 3},
    {x: LX[1], r: 90, base: -20, face: "#e6eef0", plate: "MARGIN", at: tL + 10, i: 4},
  ];
  return (
    <g>
      <Defs/>
      <OfficeBG f={f} deskY={0} id="rp" cool panel="#9aa9b8"/>
      <Spot id="rp-sp" cx={960} cy={430} rx={900} ry={360} c="#fff2cc" a={0.3}/>
      {/* the RBI behind, which holds the levers */}
      <g opacity={0.95}><Classical x={1530} y={450} w={330} h={270} text="RESERVE BANK" id="rp-rbi" cols={5} stone={["#e2c892", "#a98a52"]}/></g>
      {/* the effect strip: the money bar and the banks' lending */}
      <g>
        <path d={`M${CRR.x},${CY - CRR.r - 6} V${BAR.base + 12}`} stroke="#6c4a16" strokeWidth={16} strokeLinecap="round"/>
        <path d={`M${CRR.x - 4},${CY - CRR.r - 6} V${BAR.base + 12}`} stroke="#f6dc94" strokeWidth={4} opacity={0.7}/>
        <rect x={CRR.x - 48} y={BAR.base + 12} width={96} height={20} rx={8} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
        <BalanceBar id="rp-bar" x={BAR.x} y={BAR.base} w={100} h={BAR.h} level={level} f={f} tone="blue"/>
        <Plate x={BAR.x} y={BAR.base - BAR.h - 40} w={140} text="MONEY" size={22} a={ez(f, L.up.at, 18)}/>
        <Classical x={BANK.x} y={BANK.base} w={220} h={190} text="BANK" id="rp-bk" cols={4}/>
        {ARW.y.map((y, i) => <FlowArrow key={i} pts={[[ARW.x0, y], [ARW.x0 + 330 * alen * 0.5, y - 2], [ARW.x0 + 330 * alen, y]]} f={f} p={1} w={16} c1="#4aa56a" c2="#9be0b2" dark="#1a5a37" speed={1.2}/>)}
        <House x={1180} y={ARW.y[0]}/><Shop x={1180} y={ARW.y[1]}/><Cart x={1180} y={ARW.y[2] + 2}/>
      </g>
      {/* the console */}
      <g>
        <Shade x={960} y={858} rx={900} ry={22} o={0.4}/>
        <path d="M110,560 L190,512 H1750 L1830,560 Z" fill="url(#f2-steel)" stroke="#2e3a44" strokeWidth={3} strokeLinejoin="round"/>
        <rect x={110} y={560} width={1720} height={290} rx={22} fill="url(#f2-steel-d)" stroke="#2e3a44" strokeWidth={4}/>
        <rect x={126} y={576} width={1688} height={258} rx={14} fill="#26333d" stroke="#8fa2ae" strokeWidth={2}/>
        {/* the two groups: raised plates */}
        <rect x={150} y={596} width={1000} height={222} rx={16} fill="#34454f" stroke="#7f95a3" strokeWidth={2.4}/>
        <rect x={1190} y={596} width={600} height={222} rx={16} fill="#3a4a52" stroke="#7f95a3" strokeWidth={2.4}/>
        {[[136, 586], [1804, 586], [136, 824], [1804, 824], [1170, 600], [1170, 814]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={6} fill="url(#f2-steel)" stroke="#2e3a44" strokeWidth={1.6}/>)}
        {/* indicator lamps */}
        {[0, 1, 2, 3].map((i) => <circle key={i} cx={1740 - i * 34} cy={612} r={7} fill={i === 0 ? "#f3a52a" : i === 1 ? "#4aa56a" : "#c63f2f"} opacity={0.4 + 0.5 * (0.5 + 0.5 * Math.sin(f / (14 + i * 5) + i))}/>)}
        <Dial id="rp-c" cx={CRR.x} cy={CY} r={CRR.r} ang={crrAng} ticks={24} lit={0.8 * pulse(f, L.up.at, 120)} marks={[]}/>
        <Plate x={CRR.x} y={CY + CRR.r + 28} w={130} text="CRR" size={22} a={ez(f, L.up.at, 16)}/>
        {dials.map((d) => (
          <g key={d.i}>
            <Dial id={`rp-d${d.i}`} cx={d.x} cy={CY} r={d.r} ang={idle(d.i, d.base)} ticks={20} face={d.face} marks={[]}/>
            <Plate x={d.x} y={CY + d.r + 28} w={d.plate.length * 16 + 52} text={d.plate} size={20} a={ez(f, d.at, 16)}/>
          </g>
        ))}
        {/* the "e.g." tag on the qualitative group */}
        <g opacity={ez(f, tL + 6, 16)} transform="translate(1202 640)" filter="url(#e3-sh-s)">
          <path d="M0,0 H64 V34 H0 Z" fill="#fffaf0" stroke="#b58a52" strokeWidth={2}/><circle cx={11} cy={17} r={3.6} fill="#c63f2f"/>
          <text x={38} y={25} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={21} fill="#5e2a0e">e.g.</text>
        </g>
      </g>
    </g>
  );
};

export const RbiPanelLabels: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p);
  return <>
    <ECard cx={960} y={58} text={L.up.text} f={f} at={L.up.at} size={36} maxW={1300}/>
    <ECard cx={650} y={500} text={L.qn.text} f={f} at={L.qn.at} size={26} maxW={860} upper={false} tone="cool"/>
    <ECard cx={1490} y={500} text={L.ql.text} f={f} at={L.ql.at} size={26} maxW={620} upper={false} tone="warm"/>
  </>;
};
