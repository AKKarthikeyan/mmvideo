// ECO-12 Part 2 (Who decides GST?), builder X2: `council-table` (guess, seated, together), `two-lists` (locked, open), `amendment-book`, `definition-page`.
// No party colours, faces, emblems or real people: chairs carry blank name cards; hands are generic.
import React from "react";
import {type AP} from "./analogy_kit";
import {Desk, Ink, Room, Shadow, Sheet, W5Defs, clamp, eo, prog, show, slotLabels, atOr, W, H} from "./analogy_w5_kit";
import {Coin, modeLabels} from "./analogy_x1_a";
import {eio} from "../kit";

const Chair: React.FC<{x: number; y: number; head?: boolean; glow?: number}> = ({x, y, head, glow = 0}) => (
  <g transform={`translate(${x} ${y})`}>
    {glow > 0.01 && <circle r={90} fill="url(#w5-glow)" opacity={glow}/>}
    <rect x={-38} y={-38} width={76} height={76} rx={14} fill={head ? "url(#w5-red)" : "url(#w5-wood)"} stroke="#3a1e0c" strokeWidth={3}/>
    <rect x={-30} y={-30} width={60} height={20} rx={6} fill="#000" opacity={0.15}/>
  </g>
);
export const Hand: React.FC<{x: number; y: number; flip?: boolean; s?: number; c?: string}> = ({x, y, flip, s = 1, c = "#c98a5a"}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <rect x={-220} y={-24} width={170} height={48} rx={20} fill={flip ? "#3f78a8" : "#8a5ab8"}/>
    <path d="M-60,30 Q-80,-20 -30,-34 L50,-40 Q70,-40 66,-24 L14,-16 L80,-12 Q94,-6 80,6 L20,12 L60,22 Q70,32 56,38 Z" fill={c} stroke="#7a4a26" strokeWidth={3}/>
  </g>
);
export const TableArt: React.FC<AP> = (p) => {
  const {f} = p, mode = (p.spec as any).mode ?? "guess", tops = [560, 728, 896, 1064, 1232, 1400];
  const head = mode === "seated" ? show(p, "ch", 20) : mode === "together" ? 0.5 : 0, cards = mode === "seated" ? show(p, "st", 20) : 1;
  const hands = mode === "together" ? eio(prog(f, atOr(p, "bt") - 10, 30)) : 0;
  return <g>
    <W5Defs/>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#d9c49c"/>
    {Array.from({length: 14}, (_, i) => <path key={i} d={`M-60,${i * 84} H${W + 60}`} stroke="#b89a70" strokeWidth={2} opacity={0.4}/>)}
    <Shadow x={960} y={700} rx={640} a={0.25}/>
    <rect x={420} y={420} width={1080} height={240} rx={110} fill="url(#w5-wood)" stroke="#3a1e0c" strokeWidth={4}/>
    <rect x={450} y={440} width={1020} height={40} rx={20} fill="#fff" opacity={0.1}/>
    <Chair x={330} y={540} head glow={head}/>
    <rect x={418} y={516} width={70} height={46} rx={4} fill="#fffaf0" stroke="#a88a60" strokeWidth={2}/><Ink x={453} y={546} t="UNION" size={14} c="#5e2a0e"/>
    {tops.map((x, i) => <g key={i}>
      <Chair x={x} y={360}/><Chair x={x} y={720}/>
      <rect x={x - 32} y={428} width={64} height={24} rx={3} fill="#fffaf0" opacity={cards} stroke="#c9b48a"/><rect x={x - 32} y={628} width={64} height={24} rx={3} fill="#fffaf0" opacity={cards} stroke="#c9b48a"/>
    </g>)}
    {mode === "together" && <g>
      <Sheet x={960} y={540} w={260} h={170} rot={-3}>{[-40, -10, 20, 50].map((y) => <path key={y} d={`M-100,${y} H100`} stroke="#d6c39c" strokeWidth={6}/>)}</Sheet>
      <g opacity={hands}><Hand x={800 + 60 * hands} y={560}/><Hand x={1120 - 60 * hands} y={520} flip/></g>
    </g>}
  </g>;
};
export const TableLabels = modeLabels({
  guess: {gc: {cx: 960, y: 84, size: 40, upper: true}, q1: {cx: 480, y: 846, size: 36, upper: true, tone: "dark"}, q2: {cx: 1440, y: 846, size: 36, upper: true, tone: "dark"}},
  seated: {a279: {cx: 960, y: 84, size: 36}, ch: {cx: 420, y: 200, size: 28, maxW: 520, upper: true}, ms: {cx: 520, y: 846, size: 26, maxW: 760}, st: {cx: 1440, y: 846, size: 26, maxW: 700}},
  together: {os: {cx: 960, y: 84, size: 30, upper: true, tone: "dark"}, bt: {cx: 960, y: 190, size: 40, upper: true, tone: "green"}, lk: {cx: 960, y: 846, size: 30}},
}, "guess");

// ---------------------------------------------------------------- two-lists
const Chest: React.FC<{x: number; lid: number; words: string[]; lock: number}> = ({x, lid, words, lock}) => (
  <g transform={`translate(${x} 600)`}>
    <Shadow x={0} y={150} rx={300}/>
    <rect x={-260} y={-60} width={520} height={210} rx={12} fill="url(#w5-wood)" stroke="#3a1e0c" strokeWidth={4}/>
    {words.map((w, i) => <g key={w} transform={`translate(${-150 + i * 150} ${-60 - 40 * lid})`} opacity={0.4 + 0.6 * lid}><rect x={-64} y={-30} width={128} height={60} rx={6} fill="#fffaf0" stroke="#a88a60" strokeWidth={2}/><Ink x={0} y={8} t={w} size={16} c="#5e2a0e"/></g>)}
    <g transform={`translate(0 ${-60 - 30 * lid})`} opacity={1 - lid}><rect x={-270} y={-50} width={540} height={56} rx={12} fill="#7a4a26" stroke="#3a1e0c" strokeWidth={4}/></g>
    <g opacity={lock}><rect x={-28} y={-30} width={56} height={46} rx={8} fill="url(#w5-brass)"/><path d="M-16,-30 V-50 Q0,-66 16,-50 V-30" stroke="#7a5414" strokeWidth={7} fill="none"/></g>
  </g>
);
export const ListsArt: React.FC<AP> = (p) => {
  const {f} = p, mode = (p.spec as any).mode ?? "locked";
  const lid = mode === "open" ? eio(prog(f, atOr(p, "a246") - 20, 40)) : 0, slide = mode === "open" ? eio(prog(f, atOr(p, "a246") + 10, 50)) : 0;
  const drop = mode === "open" ? clamp(prog(f, atOr(p, "a269") - 30, 50)) : 0, split = mode === "open" ? show(p, "a269", 20, -10) : 0;
  const bob = Math.sin(f / 14) * 10, tryFit = mode === "locked" ? show(p, "gs", 30, 20) : 0;
  return <g>
    <W5Defs/>
    <Room y0={720} win={[960, 80]}/>
    <Desk y0={720}/>
    <g transform={`translate(${200 * slide} 0)`} opacity={1 - 0.6 * slide}><Chest x={560} lid={lid} words={["EXCISE", "SERVICES"]} lock={1 - lid}/></g>
    <g transform={`translate(${-200 * slide} 0)`} opacity={1 - 0.6 * slide}><Chest x={1360} lid={lid} words={["SALES"]} lock={1 - lid}/></g>
    {mode === "locked" && <g transform={`translate(960 ${330 + bob}) rotate(${Math.sin(f / 20) * 3})`}>
      <rect x={-380 - 60 * tryFit} y={-36} width={760 + 120 * tryFit} height={72} rx={10} fill="#f6dd8a" stroke="#7a5414" strokeWidth={4}/>
      <Ink x={0} y={12} t="GST: ONE TAX, WHOLE CHAIN" size={30} c="#5e2a0e"/>
    </g>}
    {mode === "open" && <g opacity={slide}>
      <rect x={600} y={520} width={720} height={140} rx={10} fill="#c99a62" stroke="#3a1e0c" strokeWidth={4}/><rect x={900} y={570} width={120} height={20} rx={8} fill="url(#w5-brass)"/>
      <Ink x={960} y={630} t="ART. 246A · SHARED" size={26} c="#3a1e0c"/>
      <g transform="translate(1560 420)"><rect x={-110} y={-40} width={220} height={110} rx={8} fill="#e9d6ae" stroke="#7a5414" strokeWidth={3}/><Ink x={0} y={26} t="269A" size={28} c="#5e2a0e"/>
        <Coin x={0} y={-260 + 240 * drop} r={22} a={drop > 0 && drop < 1 ? 1 : 0}/>
        <g opacity={split}><path d="M-60,80 L-140,190 M60,80 L140,190" stroke="#2f78b8" strokeWidth={8} strokeLinecap="round"/><Ink x={-150} y={225} t="CENTRE" size={18} c="#2f78b8"/><Ink x={150} y={225} t="STATE" size={18} c="#2f78b8"/></g></g>
    </g>}
  </g>;
};
export const ListsLabels = modeLabels({
  locked: {ul: {cx: 560, y: 180, size: 32, upper: true}, sl: {cx: 1360, y: 180, size: 32, upper: true}, os: {cx: 960, y: 846, size: 26, maxW: 1200}, gs: {cx: 960, y: 84, size: 36, upper: true, tone: "dark"}},
  open: {a246: {cx: 760, y: 84, size: 32, maxW: 760}, is: {cx: 1560, y: 200, size: 28, maxW: 500}, a269: {cx: 960, y: 846, size: 30, maxW: 900}},
}, "locked");

// ---------------------------------------------------------------- amendment-book
const Cal: React.FC<{x: number; y: number; t: string; a: number}> = ({x, y, t, a}) => (
  <g transform={`translate(${x} ${y}) rotate(4)`} opacity={a}>
    <rect x={-90} y={-80} width={180} height={170} rx={8} fill="#fffaf0" stroke="#a88a60" strokeWidth={3}/><rect x={-90} y={-80} width={180} height={44} rx={8} fill="#c0392b"/>
    <Ink x={0} y={30} t={t} size={34} c="#2a1a10"/><circle cx={0} cy={-90} r={12} fill="#c0392b"/>
  </g>
);
export const BookArt: React.FC<AP> = (p) => {
  const {f} = p, page = eio(prog(f, atOr(p, "am") - 10, 40)), stitch = clamp(prog(f, atOr(p, "as"), 50));
  return <g>
    <W5Defs/>
    <Room y0={640} win={[1700, 80]}/>
    <Desk y0={640}/>
    <g transform="translate(860 560)">
      <Shadow x={0} y={230} rx={520}/>
      <path d="M0,-220 Q-240,-250 -480,-210 V220 Q-240,190 0,230 Z" fill="url(#w5-paper)" stroke="#b8a074" strokeWidth={3}/>
      <path d="M0,-220 Q240,-250 480,-210 V220 Q240,190 0,230 Z" fill="url(#w5-paper)" stroke="#b8a074" strokeWidth={3}/>
      {Array.from({length: 8}, (_, i) => <path key={i} d={`M-430,${-150 + i * 44} H-60`} stroke="#d6c39c" strokeWidth={6}/>)}
      <g transform={`translate(${260 - 240 * (1 - page)} ${-20 * (1 - page)}) rotate(${-8 * (1 - page)})`} opacity={page}>
        <rect x={-190} y={-200} width={380} height={400} rx={6} fill="#fffdf6" stroke="#2f78b8" strokeWidth={4}/>
        <Ink x={0} y={-140} t="101ST AMENDMENT" size={26} c="#2f5d7c"/>
        {Array.from({length: 6}, (_, i) => <path key={i} d={`M-150,${-90 + i * 44} H150`} stroke="#c9d6e4" strokeWidth={6}/>)}
        {Array.from({length: 9}, (_, i) => <path key={i} d={`M-196,${-180 + i * 44} l-14,10 l14,10`} stroke="#c0392b" strokeWidth={3} fill="none" opacity={clamp(stitch * 9 - i)}/>)}
      </g>
    </g>
    <Cal x={1560} y={380} t="12 SEP" a={show(p, "c1", 16)}/>
    <Cal x={1560} y={620} t="16 SEP" a={show(p, "c2", 16)}/>
  </g>;
};
export const BookLabels = slotLabels({am: {cx: 860, y: 84, size: 34}, as: {cx: 520, y: 846, size: 30}, c1: {cx: 1300, y: 230, size: 26, maxW: 460}, c2: {cx: 1250, y: 846, size: 26, maxW: 460}});

// ---------------------------------------------------------------- definition-page
export const DefArt: React.FC<AP> = (p) => {
  const {f} = p, out = eio(prog(f, atOr(p, "ex") - 10, 40)), sv = show(p, "sv", 20);
  return <g>
    <W5Defs/>
    <Room y0={700} win={[1740, 80]}/>
    <Desk y0={700}/>
    <Sheet x={860} y={500} w={1000} h={640} rot={-0.6}>
      <Ink x={0} y={-250} t="GOODS AND SERVICES TAX" size={40} c="#5e2a0e"/>
      <rect x={-400} y={-190} width={800} height={360} rx={10} fill="none" stroke="#c99a3a" strokeWidth={8}/>
      {[[-260, -60, "GOODS"], [0, -60, "SERVICES"], [260, -60, "BOTH"]].map(([x, y, t]) => <g key={t as string}><rect x={(x as number) - 110} y={(y as number) - 60} width={220} height={120} rx={12} fill="#f3e4c4" stroke="#a88a60" strokeWidth={3}/>
        <Ink x={x as number} y={(y as number) + 10} t={t as string} size={26} c="#5e2a0e"/></g>)}
      <g opacity={sv}><Ink x={0} y={120} t="SERVICES: ANYTHING OTHER THAN GOODS" size={22} c="#2f5d7c"/></g>
    </Sheet>
    <g transform={`translate(${1100 + 420 * out} ${520 + 40 * out})`}>
      <Shadow x={0} y={90} rx={70}/><path d="M-40,90 V-30 Q-40,-60 -16,-80 V-140 H16 V-80 Q40,-60 40,-30 V90 Z" fill="#7aa86a" fillOpacity={0.75} stroke="#3a5a2a" strokeWidth={3}/>
      <rect x={-20} y={-160} width={40} height={24} rx={4} fill="#8a5a34"/>
    </g>
  </g>;
};
export const DefLabels = slotLabels({df: {cx: 860, y: 70, size: 28, maxW: 1300}, ex: {cx: 1520, y: 846, size: 30}, sv: {cx: 600, y: 846, size: 26, maxW: 760}});
