// ECO-16 Part 2, builder F2: `ledger` (b04 start, b05 loan). A brass-and-paper two-sided ledger on a desk: assets on the left page, liabilities on the right.
// Block heights are the e16_p2 values (dep, loan) times one fixed scale; the printed values are fig() reads. Reserves never change in either scene.
import React from "react";
import {SANS, SERIF, clamp} from "../kit";
import type {AP} from "./analogy_kit";
import {Block, Defs, ECard, OfficeBG, Shade, F, v, elabs, ez, lerp, pop, pulse, sm, Spot} from "./analogy_f2_kit";

const K = 2;                       // px per rupee of block height (one scale for both blocks, so 80 is four fifths of 100)
const DESK = 600, PX0 = 262, PX1 = 952, QX0 = 968, QX1 = 1658, PY0 = 296, PY1 = 762, SLOT_Y0 = 500, SLOT_Y1 = 742, BASE = 728;
const SX = {res: 480, loans: 790, dep: 1150, dep2: 1470};
const SW = 232;

const Slot: React.FC<{x: number; a: number; dashed?: boolean; glow?: number}> = ({x, a, dashed = true, glow = 0}) => {
  if (a <= 0.001) return null;
  return (
    <g opacity={a}>
      {glow > 0.01 && <ellipse cx={x} cy={(SLOT_Y0 + SLOT_Y1) / 2} rx={SW * 0.9} ry={170} fill="#ffd37a" opacity={0.5 * glow} filter="url(#e3-glow)"/>}
      <rect x={x - SW / 2} y={SLOT_Y0} width={SW} height={SLOT_Y1 - SLOT_Y0} rx={12} fill="#cdb78a" opacity={0.55}/>
      <rect x={x - SW / 2} y={SLOT_Y0} width={SW} height={SLOT_Y1 - SLOT_Y0} rx={12} fill="none" stroke="#7a5430" strokeWidth={3} strokeDasharray={dashed ? "14 9" : undefined}/>
      <rect x={x - SW / 2 + 6} y={SLOT_Y0 + 6} width={SW - 12} height={20} rx={6} fill="#7a5430" opacity={0.18}/>
      <path d={`M${x - SW / 2 + 8},${SLOT_Y1 - 4} H${x + SW / 2 - 8}`} stroke="#fff" strokeWidth={3} opacity={0.5}/>
    </g>
  );
};

const Caption: React.FC<{x: number; text: string; a: number}> = ({x, text, a}) => a <= 0.001 ? null : (
  <text x={x} y={SLOT_Y0 - 16 - (1 - a) * 8} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={30} letterSpacing={4} fill="#5a3418" opacity={a}>{text}</text>
);

const Ledger: React.FC<{f: number}> = ({f}) => (
  <g>
    {/* cover, with a soft shadow on the desk */}
    <ellipse cx={960} cy={812} rx={760} ry={30} fill="#1c1006" opacity={0.42} filter="url(#e3-glow)"/>
    <rect x={226} y={266} width={1468} height={540} rx={22} fill="url(#f2-leather)" stroke="#2e0f08" strokeWidth={3}/>
    <rect x={240} y={280} width={1440} height={512} rx={16} fill="none" stroke="#e0b070" strokeWidth={2} strokeDasharray="10 7" opacity={0.6}/>
    {[[226, 266], [1694, 266], [226, 806], [1694, 806]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${i % 2 ? -1 : 1} ${i > 1 ? -1 : 1})`}>
        <path d="M-6,-6 H70 L58,10 H10 V58 L-6,70 Z" fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4} strokeLinejoin="round"/>
        <circle cx={22} cy={22} r={5} fill="#6c4a16"/><circle cx={21} cy={21} r={1.8} fill="#fff6cf"/>
      </g>
    ))}
    {/* page stacks */}
    <path d={`M${PX0 - 6},${PY1} Q${PX0 + 340},${PY1 + 28} ${PX1 + 8},${PY1 + 12} L${PX1 + 8},${PY1 + 2} L${PX0 - 6},${PY1 - 4} Z`} fill="#d8c598" stroke="#a98a52" strokeWidth={1.6}/>
    <path d={`M${QX1 + 6},${PY1} Q${QX0 + 350},${PY1 + 28} ${QX0 - 8},${PY1 + 12} L${QX0 - 8},${PY1 + 2} L${QX1 + 6},${PY1 - 4} Z`} fill="#d8c598" stroke="#a98a52" strokeWidth={1.6}/>
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${PX0 - 4},${PY1 + 3 + i * 3.5} Q${PX0 + 340},${PY1 + 24 + i * 3} ${PX1 + 6},${PY1 + 9 + i * 3}`} stroke="#b59c66" strokeWidth={1} fill="none" opacity={0.7}/>)}
    {/* the two pages */}
    <path d={`M${PX0},${PY0} Q${PX0 + 340},${PY0 - 22} ${PX1},${PY0 - 4} L${PX1},${PY1} Q${PX0 + 340},${PY1 + 10} ${PX0},${PY1} Z`} fill="url(#f2-page)" stroke="#a98a52" strokeWidth={2}/>
    <path d={`M${QX1},${PY0} Q${QX0 + 350},${PY0 - 22} ${QX0},${PY0 - 4} L${QX0},${PY1} Q${QX0 + 350},${PY1 + 10} ${QX1},${PY1} Z`} fill="url(#f2-pageR)" stroke="#a98a52" strokeWidth={2}/>
    {/* ruling */}
    {Array.from({length: 9}, (_, i) => { const y = 440 + i * 36; return <g key={i}><path d={`M${PX0 + 22},${y} H${PX1 - 18}`} stroke="#7aa0c4" strokeWidth={1.4} opacity={0.5}/><path d={`M${QX0 + 18},${y} H${QX1 - 22}`} stroke="#7aa0c4" strokeWidth={1.4} opacity={0.5}/></g>; })}
    <path d={`M${PX0 + 38},${PY0 + 8} V${PY1 - 8}`} stroke="#d46a5a" strokeWidth={1.8} opacity={0.5}/>
    <path d={`M${QX1 - 38},${PY0 + 8} V${PY1 - 8}`} stroke="#d46a5a" strokeWidth={1.8} opacity={0.5}/>
    {/* gutter */}
    <rect x={PX1 - 26} y={PY0 - 6} width={26} height={PY1 - PY0 + 8} fill="#8e6a3a" opacity={0.22}/>
    <rect x={QX0} y={PY0 - 6} width={26} height={PY1 - PY0 + 8} fill="#8e6a3a" opacity={0.22}/>
    <rect x={PX1 - 2} y={PY0 - 8} width={QX0 - PX1 + 4} height={PY1 - PY0 + 12} fill="#6e2a1e" opacity={0.7}/>
    {/* ribbon */}
    <path d={`M${PX1 + 8},${PY1 - 4} l-6,70 l12,-12 l12,12 l-2,-70 Z`} fill="#c63f2f" stroke="#7a1f16" strokeWidth={1.4}/>
    {/* page corner light */}
    <ellipse cx={1313} cy={PY0 + 12} rx={300} ry={26} fill="#fff6d8" opacity={0.35} filter="url(#e3-glow-s)"/>
  </g>
);

const Lamp: React.FC<{f: number}> = ({f}) => (
  <g>
    <Shade x={150} y={DESK + 70} rx={80} ry={12} o={0.34}/>
    <ellipse cx={150} cy={DESK + 60} rx={70} ry={14} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
    <rect x={142} y={DESK - 96} width={16} height={158} rx={6} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2}/>
    <path d={`M92,${DESK - 70} Q92,${DESK - 170} 150,${DESK - 176} Q208,${DESK - 170} 208,${DESK - 70} Z`} fill="#2f8a5a" stroke="#14502a" strokeWidth={2.4}/>
    <path d={`M104,${DESK - 84} Q104,${DESK - 160} 140,${DESK - 168}`} fill="none" stroke="#bff0d0" strokeWidth={7} strokeLinecap="round" opacity={0.5}/>
    <rect x={88} y={DESK - 76} width={124} height={9} rx={4} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2}/>
    <ellipse cx={150} cy={DESK - 40} rx={80} ry={90} fill="#ffd37a" opacity={0.3 + 0.03 * Math.sin(f / 20)} filter="url(#e3-glow)"/>
  </g>
);

const Inkwell: React.FC = () => (
  <g>
    <Shade x={1780} y={DESK + 98} rx={56} ry={9} o={0.3}/>
    <path d="M1736,722 L1740,688 Q1780,676 1820,688 L1824,722 Q1780,736 1736,722 Z" fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
    <ellipse cx={1780} cy={688} rx={40} ry={9} fill="#1c2a44" stroke="#6c4a16" strokeWidth={2.4}/>
    <path d="M1784,690 L1880,560 Q1886,552 1878,556 L1790,676 Z" fill="#f4ecd6" stroke="#a98a52" strokeWidth={1.6}/>
    <path d="M1784,690 L1830,628" stroke="#b6322a" strokeWidth={4}/>
  </g>
);

const Odometer: React.FC<{x: number; y: number; value: number; a: number; f: number}> = ({x, y, value, a, f}) => {
  if (a <= 0.001) return null;
  const txt = `₹${Math.round(value)}`, w = 360, h = 132;
  return (
    <g transform={`translate(${x} ${y + (1 - a) * 18})`} opacity={a} filter="url(#e3-sh)">
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={22} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
      <rect x={-w / 2 + 12} y={-h / 2 + 12} width={w - 24} height={h - 24} rx={14} fill="#1a1510" stroke="#3a2a12" strokeWidth={2}/>
      <rect x={-w / 2 + 16} y={-h / 2 + 16} width={w - 32} height={(h - 32) * 0.46} rx={10} fill="#fff" opacity={0.06}/>
      <text x={0} y={30} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={86} fill="#ffd36a" stroke="#a8741c" strokeWidth={1.4} paintOrder="stroke" style={{letterSpacing: "0.04em"}}>{txt}</text>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j], k) => <circle key={k} cx={i * (w / 2 - 8)} cy={j * (h / 2 - 8)} r={3} fill="#6c4a16"/>)}
    </g>
  );
};

export const LedgerArt: React.FC<AP> = (p) => {
  const {f} = p, loan = (p.spec as any).mode === "loan", L = elabs(p);
  const dep = v("e16_p2", "dep"), lo = v("e16_p2", "loan"), total = v("e16_p2", "total");
  const depTxt = `₹${F("e16_p2", "dep").text}`, loTxt = `₹${F("e16_p2", "loan").text}`;
  // start: captions follow the words; loan: the ledger arrives already set up from the first scene
  const tAs = loan ? -100 : L.as.at, tLi = loan ? -100 : L.li.at, tSt = loan ? -100 : L.st.at, tRv = loan ? 1e9 : L.rv.at;
  const aRes = ez(f, tAs + 6, 16), aLoans = ez(f, tAs + 30, 16), aDep = ez(f, tLi + 6, 16);
  const resD = pop(f, tSt, 22), depD = pop(f, tSt + 6, 22);
  const tNd = loan ? L.nd.at : 1e9, tBn = loan ? L.bn.at : 1e9, tMs = loan ? L.ms.at : 1e9;
  const nd = pop(f, tNd, 24), lo2 = pop(f, tNd + 22, 24), scr = sm(f, tBn, 34);
  const cnt = lerp(dep, total, sm(f, tMs + 12, 46));
  const dropY = (u: number) => -(1 - clamp(u)) * 330;
  return (
    <g>
      <Defs/>
      <OfficeBG f={f} deskY={DESK} id="lg"/>
      <Spot id="lg-sp" cx={960} cy={420} rx={900} ry={380} c="#fff0c8" a={0.4}/>
      <Lamp f={f}/>
      <Inkwell/>
      <Ledger f={f}/>
      {/* left page: assets */}
      <Slot x={SX.res} a={loan ? 1 : aRes} dashed={false} glow={pulse(f, tRv, 70)}/>
      <Slot x={SX.loans} a={loan ? 1 : aLoans} dashed={!(loan && lo2 > 0.2)}/>
      <Caption x={SX.res} text="RESERVES" a={loan ? 1 : aRes}/>
      <Caption x={SX.loans} text="LOANS" a={loan ? 1 : aLoans}/>
      {/* right page: liabilities */}
      <Slot x={SX.dep} a={loan ? 1 : aDep} dashed={false}/>
      <Caption x={SX.dep} text="DEPOSITS" a={loan ? 1 : aDep}/>
      {loan && <Slot x={SX.dep2} a={1} dashed={nd < 0.2}/>}
      {/* blocks: reserves 100 and deposit 100 are the same in both scenes */}
      <g transform={`translate(0 ${dropY(resD)})`}><Block id="lg-res" x={SX.res} y={BASE} w={170} h={dep * K} tone="gold" text={depTxt} a={clamp(resD * 3)} glow={pulse(f, tSt + 8, 40)}/></g>
      <g transform={`translate(0 ${dropY(depD)})`}><Block id="lg-dep" x={SX.dep} y={BASE} w={170} h={dep * K} tone="blue" text={depTxt} a={clamp(depD * 3)} glow={pulse(f, tSt + 14, 40)}/></g>
      {loan && (
        <g>
          <g transform={`translate(0 ${dropY(nd)})`}><Block id="lg-new" x={SX.dep2} y={BASE} w={170} h={lo * K} tone="blue" text={loTxt} a={clamp(nd * 3)} glow={pulse(f, tNd + 10, 50)}/></g>
          <g transform={`translate(0 ${dropY(lo2)})`}><Block id="lg-ln" x={SX.loans} y={BASE} w={170} h={lo * K} tone="green" text={loTxt} a={clamp(lo2 * 3)} glow={pulse(f, tNd + 30, 50)}/></g>
          {/* a blank name strip on the new deposit, written on when the borrower is named */}
          {nd > 0.4 && (
            <g opacity={clamp((nd - 0.4) * 3)} filter="url(#e3-sh-s)">
              <path d={`M${SX.dep2 - 70},${SLOT_Y0 - 40} H${SX.dep2 + 70} V${SLOT_Y0 - 8} H${SX.dep2 - 70} Z`} fill="#fffaf0" stroke="#a98a52" strokeWidth={2}/>
              <circle cx={SX.dep2 - 56} cy={SLOT_Y0 - 24} r={3.4} fill="#c63f2f"/>
              <path d={`M${SX.dep2 - 40},${SLOT_Y0 - 20} q10,-16 20,0 t20,0 t20,-4 t22,4 t18,-2`} fill="none" stroke="#1f3a52" strokeWidth={3} strokeLinecap="round" strokeDasharray={150} strokeDashoffset={150 * (1 - scr)}/>
            </g>
          )}
        </g>
      )}
      {loan && <Odometer x={1030} y={150} value={cnt} a={ez(f, tMs, 14)} f={f}/>}
    </g>
  );
};

export const LedgerLabels: React.FC<AP> = (p) => {
  const {f} = p, loan = (p.spec as any).mode === "loan", L = elabs(p);
  if (!loan) {
    return <>
      <ECard cx={960} y={66} text={L.bs.text} f={f} at={L.bs.at} size={44} maxW={900}/>
      <ECard cx={607} y={318} text={L.as.text} f={f} at={L.as.at} size={30} maxW={620} upper={false}/>
      <ECard cx={1313} y={318} text={L.li.text} f={f} at={L.li.at} size={30} maxW={620} upper={false}/>
      <ECard cx={607} y={822} text={L.rv.text} f={f} at={L.rv.at} size={28} maxW={720} upper={false} tone="cool"/>
      <ECard cx={1313} y={822} text={L.st.text} f={f} at={L.st.at} size={32} maxW={620} upper={false} tone="green"/>
    </>;
  }
  return <>
    <ECard cx={1313} y={304} text={L.nd.text} f={f} at={L.nd.at} size={30} maxW={620} upper={false}/>
    <ECard cx={1313} y={382} text={L.bn.text} f={f} at={L.bn.at} size={26} maxW={620} upper={false} tone="cool"/>
    <ECard cx={430} y={92} text={L.ms.text} f={f} at={L.ms.at} size={32} maxW={620} upper={false}/>
    <ECard cx={1560} y={92} text={L.t.text} f={f} at={L.t.at} size={36} maxW={520} upper={false} tone="green"/>
  </>;
};
