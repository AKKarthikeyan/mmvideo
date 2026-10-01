// YouTube channel banner, 2560x1440. Everything essential sits in the 1546x423 safe area
// (x 507-2053, y 508-931); the desktop band (full width, y 508-931) carries the side art; TV-only edges are texture.
import React from "react";
import {AbsoluteFill} from "remotion";
import {C, COND, TYPE, Stage, Stamp, Strip, Tape, TornCard, VoxDefs, VoxFonts} from "../voxkit";

const W = 2560, H = 1440, S = -100;

// Castle on an island inside a ring of water: the channel's moat, drawn flat in Vox style.
const MoatArt: React.FC<{cx: number; cy: number}> = ({cx, cy}) => (
  <g transform={`translate(${cx} ${cy})`}>
    <ellipse cx={0} cy={110} rx={250} ry={78} fill="#5f8fa3" stroke={C.ink} strokeWidth={6}/>
    {[-150, -60, 40, 130].map((x, i) => <path key={i} d={`M ${x - 30} ${110 + (i % 2 ? 22 : -18)} q 15 -12 30 0 t 30 0`} fill="none" stroke={C.white} strokeWidth={4} opacity={0.8}/>)}
    <ellipse cx={0} cy={100} rx={150} ry={42} fill={C.mustard} stroke={C.ink} strokeWidth={5}/>
    <rect x={-95} y={-40} width={190} height={140} fill={C.white} stroke={C.ink} strokeWidth={6}/>
    {[-95, -57, -19, 19, 57].map((x) => <rect key={x} x={x} y={-64} width={24} height={26} fill={C.white} stroke={C.ink} strokeWidth={5}/>)}
    <rect x={-150} y={-110} width={70} height={210} fill={C.white} stroke={C.ink} strokeWidth={6}/>
    <rect x={80} y={-110} width={70} height={210} fill={C.white} stroke={C.ink} strokeWidth={6}/>
    {[-150, -115, 80, 115].map((x) => <rect key={x} x={x} y={-132} width={35} height={24} fill={C.white} stroke={C.ink} strokeWidth={5}/>)}
    <path d="M -28 100 L -28 30 Q 0 0 28 30 L 28 100 Z" fill={C.ink}/>
    <line x1={115} y1={-132} x2={115} y2={-200} stroke={C.ink} strokeWidth={5}/>
    <path d="M 115 -200 L 175 -184 L 115 -166 Z" fill={C.red} stroke={C.ink} strokeWidth={3}/>
  </g>
);

export const Banner: React.FC = () => (
  <AbsoluteFill style={{background: C.tan}}>
    <VoxFonts/>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <VoxDefs/><Stage w={W} h={H}/>
      {/* TV-only edges: faint score dimensions as texture */}
      {[["D1 NETWORK EFFECTS", "D2 SWITCHING COSTS", "D3 COST ADVANTAGE", "D4 PRICE DISCRETION"], ["D5 CORNERED RESOURCES", "D6 SCALE", "D7 COUNTER-POSITIONING"]].map((row, r) =>
        row.map((t, i) => <text key={t} x={W / 2 + (i - (row.length - 1) / 2) * 600} y={210 + r * 90} fontFamily={COND} fontWeight={700} fontSize={46} textAnchor="middle" fill={C.ink} opacity={0.1}>{t}</text>))}
      <text x={W / 2} y={1230} fontFamily={COND} fontWeight={700} fontSize={64} textAnchor="middle" fill={C.ink} opacity={0.1}>DAILY FILING DIGEST · DEEP DIVES · LONG VIDEOS · SHORTS</text>

      {/* desktop band, left: the moat */}
      <g transform="translate(278 730) scale(0.9)"><MoatArt cx={0} cy={0}/></g>
      {/* desktop band, right: MoatSCORE card */}
      <TornCard x={2110} y={560} w={380} h={320} start={S} fill={C.white} rot={2}>
        <text x={190} y={80} fontFamily={COND} fontWeight={700} fontSize={48} textAnchor="middle" fill={C.ink}>MOATSCORE</text>
        <text x={190} y={200} fontFamily={COND} fontWeight={700} fontSize={130} textAnchor="middle" fill={C.red}>500+</text>
        <text x={190} y={272} fontFamily={COND} fontWeight={700} fontSize={36} textAnchor="middle" fill={C.ink}>INDIAN COMPANIES</text>
        <Tape x={-30} y={-22} rot={-10} w={130}/>
      </TornCard>

      {/* safe area */}
      <Strip x={W / 2} y={640} start={S} text="MOAT & MARGIN" size={160} rot={-1}/>
      <Strip x={W / 2} y={808} start={S} text="RESEARCH FROM THE FILINGS" size={78} fill={C.red} color={C.white} rot={1}/>
      <text x={W / 2} y={908} fontFamily={TYPE} fontSize={38} textAnchor="middle" fill={C.ink}>Indian companies · the moat, the margin, the MoatSCORE</text>
      <Stamp x={W / 2} y={1060} start={S} text="EVERY FIGURE SOURCED" size={44} rot={-4}/>
    </svg>
  </AbsoluteFill>
);
