// ECO-12 Part 1 (Who really pays a tax?), builder X1: `shop-bill` (modes question, split, answer), `treasury-flow`, `three-jobs`, `tax-doors`.
// Shared parts are borrowed read-only from the W5 kit. Generic people and buildings; no brand, logo or real shop.
import React from "react";
import {Person, Cloud, type AP} from "./analogy_kit";
import {Desk, Ink, Portico, Room, Shadow, Sheet, W5Defs, clamp, eo, prog, show, slotLabels, atOr, W, H, type Slot} from "./analogy_w5_kit";
import {eio} from "../kit";

export const modeLabels = (by: Record<string, Record<string, Slot>>, dflt: string): React.FC<AP> => (p) => {
  const mode = (p.spec as any).mode ?? dflt, Lb = slotLabels(by[mode] ?? {});
  return <Lb {...p}/>;
};

/** a rupee coin */
export const Coin: React.FC<{x: number; y: number; r?: number; a?: number}> = ({x, y, r = 16, a = 1}) => (
  <g opacity={a}><circle cx={x} cy={y} r={r} fill="url(#w5-brass)" stroke="#7a5414" strokeWidth={2}/><circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.3} fill="#fff" opacity={0.35}/></g>
);
/** a small government office with a counter window */
export const GovtWindow: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shadow x={0} y={10} rx={150}/>
    <rect x={-140} y={-260} width={280} height={260} fill="url(#w5-stone)" stroke="#a88a60" strokeWidth={3}/>
    <path d="M-160,-260 L0,-330 L160,-260 Z" fill="url(#w5-stoned)" stroke="#a88a60" strokeWidth={3}/>
    <rect x={-70} y={-180} width={140} height={90} rx={8} fill="#3a2412"/><rect x={-60} y={-170} width={120} height={70} rx={6} fill="#fff1c4" opacity={0.6}/>
    <rect x={-90} y={-92} width={180} height={14} fill="#8a6238"/>
    <Ink x={0} y={-282} t="GOVERNMENT" size={18} c="#5e2a0e"/>
  </g>
);

// ---------------------------------------------------------------- shop-bill
const Counter: React.FC = () => (
  <g>
    <rect x={-60} y={640} width={W + 120} height={500} fill="url(#w5-wood)"/>
    <rect x={-60} y={630} width={W + 120} height={22} fill="#c99a62"/><path d="M-60,652 H1980" stroke="#3a1e0c" strokeWidth={3} opacity={0.4}/>
    {[260, 760, 1260, 1760].map((x) => <rect key={x} x={x - 180} y={700} width={360} height={260} rx={8} fill="none" stroke="#3a1e0c" strokeWidth={3} opacity={0.3}/>)}
  </g>
);
const Shelves: React.FC = () => (
  <g>
    {[200, 330, 460].map((y) => <rect key={y} x={120} y={y} width={620} height={14} fill="#8a5a34"/>)}
    {[0, 1, 2].map((r) => Array.from({length: 9}, (_, i) => <rect key={`${r}${i}`} x={140 + i * 66} y={200 + r * 130 - 70 - (i % 3) * 8} width={50} height={70 + (i % 3) * 8} rx={6}
      fill={["#d8682a", "#2f78b8", "#3f9a5a", "#e8c46c", "#c0392b", "#8a5ab8"][(i + r) % 6]} opacity={0.85}/>))}
  </g>
);
const Bill: React.FC<{x: number; y: number; out: number; ring: number; rot?: number}> = ({x, y, out, ring, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <g transform={`translate(0 ${-200 * out})`}>
      <rect x={-110} y={-10} width={220} height={260} fill="#fffdf6" stroke="#c9b48a" strokeWidth={2}/>
      {[30, 60, 90, 120].map((yy) => <path key={yy} d={`M-90,${yy} H${yy === 120 ? 20 : 90}`} stroke="#c9b48a" strokeWidth={6}/>)}
      <Ink x={-90} y={176} t="GST" size={26} c="#2a1a10" anchor="start"/><path d="M20,170 H90" stroke="#2a1a10" strokeWidth={6}/>
      <ellipse cx={-50} cy={168} rx={70} ry={30} fill="none" stroke="#c0392b" strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring}/>
    </g>
    <rect x={-150} y={-30} width={300} height={130} rx={12} fill="#3b4a5c" stroke="#1e2834" strokeWidth={3}/><rect x={-120} y={-14} width={240} height={30} rx={4} fill="#9fd4b0"/>
  </g>
);
const Wallet: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-60} y={-40} width={120} height={80} rx={12} fill="#7a4a26" stroke="#3a1e0c" strokeWidth={3}/><rect x={10} y={-18} width={56} height={36} rx={8} fill="#5e3518"/><circle cx={36} cy={0} r={6} fill="url(#w5-brass)"/></g>
);
export const ShopArt: React.FC<AP> = (p) => {
  const {f} = p, mode = (p.spec as any).mode ?? "question";
  const out = mode === "question" ? eio(prog(f, 6, 40)) : 1, ring = mode === "question" ? eo(prog(f, atOr(p, "bl"), 20)) : 1;
  const imp = mode === "split" ? eio(prog(f, atOr(p, "im") - 4, 30)) : mode === "answer" ? 1 : 0, inc = mode === "split" ? eio(prog(f, atOr(p, "ic") - 4, 30)) : mode === "answer" ? 1 : 0;
  const env = mode === "answer" ? eio(prog(f, atOr(p, "ca", atOr(p, "bl")) + 10, 50)) : 0;
  return <g>
    <W5Defs/>
    <Room y0={640} win={[1500, 90]}/>
    <Shelves/>
    {mode !== "question" && <GovtWindow x={170} y={630} s={0.75}/>}
    <Person x={620} y={720} h={420} f={f} seed={7}/>
    <Person x={1360} y={980} h={520} f={f} seed={31} flip/>
    <Counter/>
    <Bill x={960} y={600} out={out} ring={ring}/>
    <Wallet x={1460} y={860} s={1.1}/>
    {/* impact: bill to the government window; incidence: bill to the wallet */}
    {imp > 0.01 && <path d={`M900,${420} Q520,250 ${260},${400}`} fill="none" stroke="#2f78b8" strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - imp}/>}
    {inc > 0.01 && <path d={`M1020,${420} Q1320,330 ${1440},${800}`} fill="none" stroke="#d8682a" strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - inc}/>}
    {mode === "answer" && <g transform={`translate(${620 - 360 * env} ${560 - Math.sin(env * Math.PI) * 120})`} opacity={env > 0.02 && env < 0.98 ? 1 : 0}>
      <rect x={-50} y={-32} width={100} height={64} rx={6} fill="#fffaf0" stroke="#7a4a26" strokeWidth={3}/><path d="M-50,-32 L0,4 L50,-32" stroke="#7a4a26" strokeWidth={3} fill="none"/></g>}
  </g>;
};
export const ShopLabels = modeLabels({
  question: {bl: {cx: 960, y: 84, size: 38, upper: true}, cs: {cx: 960, y: 846, size: 32}, tf: {cx: 1500, y: 300, size: 46, upper: true, tone: "dark"}},
  split: {im: {cx: 420, y: 96, size: 30, maxW: 600, tone: "cool"}, ic: {cx: 1480, y: 96, size: 30, maxW: 620}, dd: {cx: 960, y: 846, size: 30}},
  answer: {ca: {cx: 420, y: 96, size: 30, maxW: 600, tone: "cool"}, cb: {cx: 1480, y: 96, size: 30, maxW: 620}, fl: {cx: 960, y: 230, size: 64, upper: true, tone: "dark"},
    bl: {cx: 420, y: 96, size: 32, maxW: 600, tone: "cool"}, ip: {cx: 1480, y: 96, size: 32, maxW: 620}, hm: {cx: 960, y: 846, size: 30}},
}, "question");

// ---------------------------------------------------------------- treasury-flow
const DEST = [{x: 1260, y: 470, k: "school"}, {x: 1480, y: 560, k: "hospital"}, {x: 1690, y: 470, k: "road"}, {x: 1700, y: 700, k: "post"}];
const Dest: React.FC<{k: string; x: number; y: number}> = ({k, x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <Shadow x={0} y={4} rx={90}/>
    {k === "school" && <g><rect x={-80} y={-110} width={160} height={110} fill="#f3e4c4" stroke="#a88a60" strokeWidth={3}/><path d="M-96,-110 L0,-160 L96,-110 Z" fill="#c0392b"/><rect x={-20} y={-60} width={40} height={60} fill="url(#w5-wood)"/></g>}
    {k === "hospital" && <g><rect x={-80} y={-140} width={160} height={140} fill="#f6f2ea" stroke="#9fb4c8" strokeWidth={3}/><rect x={-36} y={-120} width={72} height={40} rx={6} fill="#2f78b8"/><Ink x={0} y={-90} t="H" size={30} c="#fff"/><rect x={-20} y={-54} width={40} height={54} fill="#9fb4c8"/></g>}
    {k === "road" && <g><path d="M-110,0 L-40,-120 H40 L110,0 Z" fill="#6a6a6a"/><path d="M0,-110 V-80 M0,-60 V-30" stroke="#fff6d8" strokeWidth={6}/></g>}
    {k === "post" && <g><rect x={-30} y={-130} width={60} height={130} fill="#6e7f5a" stroke="#3a4a2a" strokeWidth={3}/><path d="M-44,-130 H44 L30,-150 H-30 Z" fill="#4a5a3a"/><rect x={30} y={-60} width={110} height={10} fill="#c0392b"/><rect x={60} y={-60} width={20} height={10} fill="#fff"/></g>}
  </g>
);
export const TreasuryArt: React.FC<AP> = (p) => {
  const {f} = p, G = 760, inflow = clamp(prog(f, atOr(p, "cp") - 20, 200)), outflow = clamp(prog(f, atOr(p, "sv") - 10, 200)), stamp = show(p, "a265", 14);
  return <g>
    <W5Defs/>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w5-sky)"/>
    {[0, 1].map((i) => <Cloud key={i} x={300 + i * 900} y={150} s={0.8} f={f} speed={0.15} seed={i + 31} a={0.8}/>)}
    <rect x={-60} y={G} width={W + 120} height={H} fill="url(#w5-ground)"/>
    {Array.from({length: 6}, (_, i) => <Person key={i} x={110 + i * 70} y={G + 60 + (i % 2) * 24} h={200} f={f} seed={120 + i}/>)}
    <Portico x={820} y={G - 20} w={420} h={330} cols={6} open={0.4}><Ink x={820} y={G - 300} t="TREASURY" size={22} c="#5e2a0e"/></Portico>
    {DEST.map((d) => <Dest key={d.k} {...d}/>)}
    {Array.from({length: 8}, (_, i) => { const u = (inflow * 3 + i / 8) % 1; return inflow > 0 && inflow < 1 ? <Coin key={i} x={300 + 480 * u} y={G - 80 - Math.sin(u * Math.PI) * 140} a={Math.sin(u * Math.PI)}/> : null; })}
    {DEST.map((d, j) => Array.from({length: 3}, (_, i) => { const u = (outflow * 3 + i / 3 + j * 0.13) % 1; return outflow > 0 && outflow < 1 ? <Coin key={`${j}${i}`} x={960 + (d.x - 960) * u} y={G - 200 + (d.y - 140 - G + 200) * u - Math.sin(u * Math.PI) * 80} r={13} a={Math.sin(u * Math.PI)}/> : null; }))}
    <g transform={`translate(820 ${G - 180}) rotate(-8) scale(${0.6 + 0.4 * stamp})`} opacity={stamp}>
      <circle r={110} fill="none" stroke="#c0392b" strokeWidth={8}/><circle r={92} fill="none" stroke="#c0392b" strokeWidth={3}/><Ink x={0} y={12} t="BY LAW" size={34} c="#c0392b"/>
    </g>
  </g>;
};
export const TreasuryLabels = slotLabels({cp: {cx: 960, y: 84, size: 36}, sv: {cx: 1480, y: 846, size: 30}, a265: {cx: 600, y: 846, size: 30, tone: "dark"}});

// ---------------------------------------------------------------- three-jobs
const Jar: React.FC<{x: number; a: number; children?: React.ReactNode}> = ({x, a, children}) => (
  <g transform={`translate(${x} 0)`} opacity={0.35 + 0.65 * a}>
    <Shadow x={0} y={850} rx={170}/>
    <rect x={-160} y={480} width={320} height={370} rx={36} fill="#eaf4f6" fillOpacity={0.5} stroke="#8fb4c4" strokeWidth={4}/>
    <rect x={-176} y={456} width={352} height={34} rx={10} fill="#a88a60"/>
    <path d="M-120,520 V800" stroke="#fff" strokeWidth={8} opacity={0.4}/>
    {children}
  </g>
);
export const JobsArt: React.FC<AP> = (p) => {
  const {f} = p, al = show(p, "al", 18), rd = show(p, "rd", 18), st = show(p, "st", 18);
  const move = clamp(prog(f, atOr(p, "rd"), 80)), tilt = 14 * Math.exp(-Math.max(0, f - atOr(p, "st")) / 30) * Math.sin(f / 6) * st + (1 - st) * 10;
  return <g>
    <W5Defs/>
    <Room y0={600} win={[1700, 80]}/>
    <Desk y0={600}/>
    <Jar x={420} a={al}>
      <rect x={-8} y={560} width={16} height={260} fill="#3b4a5c"/><path d="M0,570 Q60,540 90,560" stroke="#3b4a5c" strokeWidth={12} fill="none"/>
      <path d="M70,560 h50 l-12,26 h-26 Z" fill="#e8c46c"/><ellipse cx={95} cy={600} rx={50} ry={70} fill="url(#w5-glow)" opacity={al}/>
      <Ink x={0} y={840} t="an example" size={18} c="#5e3518"/>
    </Jar>
    <Jar x={960} a={rd}>
      {Array.from({length: 6}, (_, i) => <Coin key={i} x={-70} y={810 - i * 26} r={30}/>)}
      {Array.from({length: 2}, (_, i) => <Coin key={i} x={70} y={810 - i * 26} r={30}/>)}
      <Coin x={-70 + 140 * eio(move)} y={650 - Math.sin(move * Math.PI) * 60} r={30} a={rd}/>
    </Jar>
    <Jar x={1500} a={st}>
      <path d="M-30,820 L0,760 L30,820 Z" fill="#8a6238"/>
      <g transform={`translate(0 760) rotate(${tilt})`}><rect x={-130} y={-10} width={260} height={16} rx={6} fill="url(#w5-wood)"/><circle cx={-110} cy={-26} r={18} fill="#d8682a"/><circle cx={110} cy={-26} r={18} fill="#2f78b8"/></g>
    </Jar>
  </g>;
};
export const JobsLabels = slotLabels({bj: {cx: 960, y: 84, size: 38}, al: {cx: 420, y: 330, size: 28, maxW: 420, upper: true}, rd: {cx: 960, y: 330, size: 28, maxW: 460, upper: true},
  st: {cx: 1500, y: 330, size: 28, maxW: 420, upper: true}});

// ---------------------------------------------------------------- tax-doors
const DoorIn: React.FC<{x: number; open: number}> = ({x, open}) => (
  <g>
    <Shadow x={x} y={862} rx={200}/>
    <rect x={x - 170} y={360} width={340} height={500} rx={10} fill="#3a2412"/>
    <rect x={x - 150} y={380} width={300} height={480} fill="#fff1c4" opacity={0.3 + 0.6 * open}/>
    <path d={`M${x - 150},380 L${x - 150 + 300 * (1 - 0.7 * open)},${380 + 30 * open} V${860 - 30 * open} L${x - 150},860 Z`} fill="url(#w5-wood)" stroke="#3a1e0c" strokeWidth={3}/>
  </g>
);
export const DoorsArt: React.FC<AP> = (p) => {
  const {f} = p, d1 = eio(prog(f, atOr(p, "dr") - 6, 26)), d2 = eio(prog(f, atOr(p, "in") - 6, 26));
  const slip = eio(prog(f, atOr(p, "it"), 40)), tag = eio(prog(f, atOr(p, "gs"), 40));
  return <g>
    <W5Defs/>
    <Room y0={860} win={[960, 120]}/>
    <rect x={-60} y={860} width={W + 120} height={300} fill="#b89a70"/>
    <DoorIn x={560} open={d1}/><DoorIn x={1360} open={d2}/>
    <g transform={`translate(${560 + (1 - slip) * -360} ${620 - (1 - slip) * 100}) scale(${1 - 0.5 * slip})`} opacity={slip > 0.01 ? 1 - Math.max(0, slip - 0.85) / 0.15 : 0}>
      <Sheet x={0} y={0} w={180} h={120}><Ink x={0} y={-24} t="SALARY" size={22} c="#5e2a0e"/>{[10, 34].map((y) => <path key={y} d={`M-70,${y} H70`} stroke="#d6c39c" strokeWidth={5}/>)}</Sheet>
    </g>
    <g transform={`translate(${1360 + (1 - tag) * 360} ${620 - (1 - tag) * 100}) scale(${1 - 0.5 * tag})`} opacity={tag > 0.01 ? 1 - Math.max(0, tag - 0.85) / 0.15 : 0}>
      <path d="M-90,-50 H60 L100,0 L60,50 H-90 Z" fill="#f6dd8a" stroke="#7a5414" strokeWidth={3}/><circle cx={64} cy={0} r={8} fill="#7a5414"/><Ink x={-14} y={10} t="PRICE" size={24} c="#5e2a0e"/>
    </g>
  </g>;
};
export const DoorsLabels = slotLabels({dr: {cx: 560, y: 120, size: 32, maxW: 620, upper: true}, in: {cx: 1360, y: 120, size: 32, maxW: 620, upper: true},
  it: {cx: 560, y: 250, size: 30}, gs: {cx: 1360, y: 250, size: 30}});
