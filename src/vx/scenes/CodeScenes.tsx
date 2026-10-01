// Code-drawn Vox scenes (no AI images): pure SVG built from voxkit pieces. Case File 001 (GEICO) test, 30 Sep 2026.
// Real people are never drawn as likenesses: anonymous silhouettes only, tagged "illustration".
import React from "react";
import {AbsoluteFill, Still} from "remotion";
import {C, COND, TYPE, HalftoneCutout, Pin, RedString, Stage, Stamp, Strip, Tape, TornCard, TypeLabel, VoxDefs, VoxFonts} from "../../voxkit";

const W = 1920, H = 1080, S = -200; // S: start long before frame 0, so every piece is fully in
const Frame: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: C.tan}}>
    <VoxFonts/>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute"}}>
      <VoxDefs/><Stage w={W} h={H}/>
      {children}
      <text x={W - 40} y={H - 30} textAnchor="end" fontFamily={TYPE} fontSize={22} fill={C.ink} opacity={0.55}>illustration</text>
    </svg>
  </AbsoluteFill>
);

// an anonymous person: hat, head, coat; arm raised when knocking
const person = (x: number, y: number, s: number, knock = false) =>
  `M${x - 34 * s} ${y - 250 * s} h${68 * s} l${10 * s} ${22 * s} h${-88 * s} z ` +                 // hat brim + crown
  `M${x - 26 * s} ${y - 284 * s} q${26 * s} ${-14 * s} ${52 * s} 0 v${36 * s} h${-52 * s} z ` +
  `M${x} ${y - 226 * s} a${34 * s} ${40 * s} 0 1 0 0.1 0 z ` +                                     // head
  `M${x - 70 * s} ${y} C${x - 80 * s} ${y - 120 * s} ${x - 60 * s} ${y - 150 * s} ${x} ${y - 150 * s} C${x + 60 * s} ${y - 150 * s} ${x + 80 * s} ${y - 120 * s} ${x + 70 * s} ${y} z ` + // coat
  (knock ? `M${x + 40 * s} ${y - 140 * s} L${x + 150 * s} ${y - 230 * s} L${x + 172 * s} ${y - 210 * s} L${x + 62 * s} ${y - 110 * s} z M${x + 176 * s} ${y - 222 * s} a${22 * s} ${22 * s} 0 1 0 0.1 0 z` : "");

// ---------- 1 · The locked door, Saturday, January 1951 ----------
const LockedDoor: React.FC = () => {
  const fx = 520, fw = 1000, fy = 120, fh = 860, dx = 870, dw = 300, dy = 520, dh = 460;
  const blocks = Array.from({length: 11}, (_, i) => i);
  const flakes = Array.from({length: 70}, (_, i) => [((i * 197) % 1880) + 20, ((i * 331) % 1000) + 20, 3 + (i % 3) * 2]);
  return (
    <Frame>
      {/* building facade */}
      <rect x={fx} y={fy} width={fw} height={fh} fill={C.paper} stroke={C.ink} strokeWidth={4}/>
      {blocks.map((i) => <line key={i} x1={fx} y1={fy + 80 + i * 75} x2={fx + fw} y2={fy + 80 + i * 75} stroke={C.ink} strokeWidth={1.5} opacity={0.35}/>)}
      <path d={`M${fx - 30} ${fy} L${fx + fw / 2} ${fy - 90} L${fx + fw + 30} ${fy} Z`} fill={C.white} stroke={C.ink} strokeWidth={4}/>
      <rect x={fx + 140} y={fy + 40} width={fw - 280} height={70} fill={C.ink}/>
      <text x={fx + fw / 2} y={fy + 88} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={30} letterSpacing={2} fill={C.white}>GOVERNMENT EMPLOYEES INSURANCE CO.</text>
      {[fx + 90, fx + 300, fx + fw - 390, fx + fw - 180].map((wx) => <g key={wx}><rect x={wx} y={fy + 170} width={100} height={150} fill={C.gray} opacity={0.5} stroke={C.ink} strokeWidth={3}/><line x1={wx + 50} y1={fy + 170} x2={wx + 50} y2={fy + 320} stroke={C.ink} strokeWidth={3}/></g>)}
      {/* the door, shut */}
      <rect x={dx} y={dy} width={dw} height={dh} fill={C.ink}/>
      <rect x={dx + 20} y={dy + 20} width={dw / 2 - 30} height={dh - 40} fill="#2b2b2b" stroke={C.gray} strokeWidth={2}/>
      <rect x={dx + dw / 2 + 10} y={dy + 20} width={dw / 2 - 30} height={dh - 40} fill="#2b2b2b" stroke={C.gray} strokeWidth={2}/>
      <circle cx={dx + dw / 2 - 18} cy={dy + 250} r={9} fill={C.mustard}/><circle cx={dx + dw / 2 + 18} cy={dy + 250} r={9} fill={C.mustard}/>
      <line x1={dx + 110} y1={dy + 60} x2={dx + 150} y2={dy + 20} stroke={C.white} strokeWidth={2}/><line x1={dx + 190} y1={dy + 60} x2={dx + 150} y2={dy + 20} stroke={C.white} strokeWidth={2}/>
      <g transform={`rotate(-4 ${dx + dw / 2} ${dy + 100})`}><rect x={dx + 60} y={dy + 60} width={180} height={70} fill={C.white} stroke={C.ink} strokeWidth={3}/>
        <text x={dx + dw / 2} y={dy + 108} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={42} fill={C.red}>CLOSED</text></g>
      {/* steps */}
      <rect x={dx - 60} y={dy + dh} width={dw + 120} height={24} fill={C.gray}/><rect x={dx - 110} y={dy + dh + 24} width={dw + 220} height={24} fill={C.gray} opacity={0.8}/>
      {/* the young visitor (anonymous silhouette) */}
      <HalftoneCutout d={person(680, 1028, 1.25, true)} start={S}/>
      {/* knocks */}
      <Strip x={330} y={560} start={S} text="KNOCK!" size={84} fill={C.white} rot={-8}/>
      <Strip x={300} y={700} start={S} text="KNOCK!" size={70} fill={C.white} rot={6}/>
      <Strip x={345} y={820} start={S} text="KNOCK!" size={58} fill={C.red} color={C.white} rot={-4}/>
      {flakes.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={C.white} opacity={0.7}/>)}
      <Stamp x={1680} y={940} start={S} text="SATURDAY · JAN 1951" size={40} rot={-6}/>
      <TornCard x={1480} y={640} w={400} h={200} start={S} fill={C.white} rot={3}>
        <text x={200} y={70} textAnchor="middle" fontFamily={TYPE} fontSize={26} fill={C.ink}>WASHINGTON, D.C.</text>
        <text x={200} y={115} textAnchor="middle" fontFamily={TYPE} fontSize={26} fill={C.ink}>6th floor: one man</text>
        <text x={200} y={160} textAnchor="middle" fontFamily={TYPE} fontSize={26} fill={C.ink}>still working</text>
      </TornCard>
      <Tape x={1600} y={620} rot={-10}/>
    </Frame>
  );
};

// ---------- 2 · The middleman trap vs direct ----------
const coin = (x: number, y: number, k: number) => <g key={k}><circle cx={x} cy={y} r={30} fill={C.mustard} stroke={C.ink} strokeWidth={3}/><text x={x} y={y + 12} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={34} fill={C.ink}>$</text></g>;
const node = (x: number, y: number, label: string, fill: string, k: string) => (
  <g key={k}><rect x={x - 150} y={y - 70} width={300} height={140} rx={6} fill={fill} stroke={C.ink} strokeWidth={4} style={{filter: "url(#vshadow)"}}/>
    <text x={x} y={y + 18} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={50} fill={fill === C.ink ? C.white : C.ink}>{label}</text></g>);
const arrow = (x1: number, x2: number, y: number, k: string) => <g key={k}><line x1={x1} y1={y} x2={x2 - 26} y2={y} stroke={C.ink} strokeWidth={8}/><path d={`M${x2} ${y} l-34 -22 v44 z`} fill={C.ink}/></g>;
const Middleman: React.FC = () => {
  const y1 = 330, y2 = 780;
  return (
    <Frame>
      <Strip x={960} y={110} start={S} text="WHY RIVALS COULDN'T COPY GEICO" size={70}/>
      <TypeLabel x={120} y={215} start={S} text="1936 · THE OLD WAY" size={34} cps={99}/>
      {node(300, y1, "CUSTOMER", C.white, "a")}{arrow(460, 800, y1, "a1")}{node(960, y1, "AGENT", C.white, "b")}{arrow(1120, 1460, y1, "b1")}{node(1620, y1, "INSURER", C.white, "c")}
      {coin(630, y1 + 110, 1)}{coin(690, y1 + 150, 2)}{coin(1290, y1 + 110, 3)}
      <TypeLabel x={560} y={y1 + 225} start={S} text="commission on every policy" size={30} cps={99}/>
      <line x1={120} y1={560} x2={1800} y2={560} stroke={C.ink} strokeWidth={3} strokeDasharray="18 14" opacity={0.5}/>
      <TypeLabel x={120} y={665} start={S} text="GEICO · SELL DIRECT" size={34} cps={99}/>
      {node(300, y2, "CUSTOMER", C.white, "d")}{arrow(460, 1460, y2, "d1")}{node(1620, y2, "GEICO", C.ink, "e")}
      <Strip x={960} y={y2 - 70} start={S} text="NO MIDDLEMAN" size={54} fill={C.red} color={C.white} rot={-2}/>
      <Stamp x={1560} y={985} start={S} text="AGENTS WOULD REVOLT" size={50} rot={-6}/>
    </Frame>
  );
};

// ---------- 3 · The crime board: who almost killed GEICO? ----------
const suspect = (x: number, y: number, label: string, rot: number, k: string) => (
  <g key={k}><TornCard x={x - 180} y={y - 90} w={360} h={180} start={S} fill={C.white} rot={rot}>
    <text x={180} y={52} textAnchor="middle" fontFamily={TYPE} fontSize={22} fill={C.gray}>SUSPECT</text>
    <text x={180} y={128} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={46} fill={C.ink}>{label}</text></TornCard>
    <Pin x={x} y={y - 84} start={S}/></g>);
const CrimeBoard: React.FC = () => {
  const cx = 960, cy = 560;
  const sus: [number, number][] = [[360, 250], [1560, 250], [360, 860], [1560, 860]];
  return (
    <Frame>
      <rect x={60} y={40} width={1800} height={970} fill="#B8A57F" stroke={C.ink} strokeWidth={6}/>
      {sus.map(([x, y], i) => <RedString key={i} pts={[[cx, cy], [x, y - 84]]} start={S}/>)}
      <TornCard x={cx - 240} y={cy - 170} w={480} h={340} start={S} fill={C.paper} rot={-1.5}>
        <text x={240} y={48} textAnchor="middle" fontFamily={TYPE} fontSize={26} fill={C.gray}>THE VICTIM</text>
        <text x={240} y={158} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={92} fill={C.ink}>GEICO</text>
        <text x={240} y={245} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={80} fill={C.red}>−95%</text>
        <text x={240} y={305} textAnchor="middle" fontFamily={TYPE} fontSize={28} fill={C.ink}>stock · by 1976</text>
      </TornCard>
      <Pin x={cx} y={cy - 164} start={S}/>
      {suspect(360, 250, "COMPETITORS?", -2, "s1")}{suspect(1560, 250, "REGULATORS?", 2, "s2")}{suspect(360, 860, "THE ECONOMY?", 1.5, "s3")}{suspect(1560, 860, "???", -1.5, "s4")}
      <g stroke={C.red} strokeWidth={10} strokeLinecap="round"><line x1={220} y1={180} x2={500} y2={320}/><line x1={1420} y1={180} x2={1700} y2={320}/><line x1={220} y1={790} x2={500} y2={930}/></g>
      <Stamp x={1560} y={900} start={S} text="INSIDE JOB" size={64} rot={-12}/>
    </Frame>
  );
};

export const CodeSceneStills: React.FC = () => (
  <>
    <Still id="SCN-geico-door" component={LockedDoor} width={W} height={H}/>
    <Still id="SCN-geico-middleman" component={Middleman} width={W} height={H}/>
    <Still id="SCN-geico-crimeboard" component={CrimeBoard} width={W} height={H}/>
  </>
);
