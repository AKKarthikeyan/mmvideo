// POL-03 Part 3, builder W5: `temple-doors`, `neutral-state`, `scripts-ribbon`, `minority-school`.
// Generic buildings and people only: no deity, symbol, flag or community marker; every script on the ribbon is an abstract pattern.
import React from "react";
import {Person, Cloud, type AP} from "./analogy_kit";
import {Desk, Ink, Portico, Room, Shadow, Sheet, W5Defs, clamp, eo, prog, show, slotLabels, atOr, W, H} from "./analogy_w5_kit";
import {eio, rng} from "../kit";

const Sky: React.FC<{f: number; ground?: number}> = ({f, ground = 760}) => (
  <g>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w5-sky)"/>
    {[0, 1, 2].map((i) => <Cloud key={i} x={160 + i * 640} y={150 + (i % 2) * 70} s={0.8} f={f} speed={0.15} seed={i + 11} a={0.8}/>)}
    <rect x={-60} y={ground} width={W + 120} height={H} fill="url(#w5-ground)"/>
    <path d={`M-60,${ground} H${W + 60}`} stroke="#f2deb0" strokeWidth={4} opacity={0.7}/>
  </g>
);

// ---------------------------------------------------------------- temple-doors
export const TempleArt: React.FC<AP> = (p) => {
  const {f} = p, G = 760, open = eio(prog(f, atOr(p, "a26") - 10, 40)), inner = show(p, "rk", 24), walk = show(p, "hp", 30);
  const tiers = [0, 1, 2, 3, 4];
  return <g>
    <W5Defs/>
    <Sky f={f} ground={G}/>
    {/* a generic tiered tower over a pillared hall, on a raised platform */}
    <g>
      {tiers.map((i) => { const w = 300 - i * 52, y = 470 - i * 58; return <g key={i}><rect x={960 - w / 2} y={y - 58} width={w} height={60} rx={6} fill={i % 2 ? "#e9d6ae" : "#f3e4c4"} stroke="#a88a60" strokeWidth={2}/>
        <path d={`M${960 - w / 2 + 10},${y - 6} H${960 + w / 2 - 10}`} stroke="#c9ad80" strokeWidth={3}/></g>; })}
      <circle cx={960} cy={168} r={20} fill="url(#w5-brass)"/>
    </g>
    <Portico x={960} y={G - 40} w={760} h={300} cols={8} open={open} tone="warm" doorW={0.24}/>
    {/* the denomination's own inner space: a small rail and lamp behind the open doors */}
    <g opacity={0.35 + 0.65 * inner}>
      <rect x={905} y={G - 166} width={110} height={78} rx={6} fill="#fff1c4" opacity={0.7}/>
      <path d={`M898,${G - 92} H1022 M908,${G - 92} V${G - 120} M960,${G - 92} V${G - 120} M1012,${G - 92} V${G - 120} M904,${G - 120} H1016`} stroke="#8a5a2a" strokeWidth={5}/>
      <ellipse cx={960} cy={G - 140} rx={28} ry={28} fill="url(#w5-glow)" opacity={inner}/>
    </g>
    {Array.from({length: 10}, (_, i) => {
      const side = i % 2 ? 1 : -1, x0 = 960 + side * (380 + (i >> 1) * 90), x = x0 + (960 + side * 40 - x0) * walk * (0.5 + (i % 3) * 0.15);
      return <Person key={i} x={x} y={G + 70 + (i % 3) * 22} h={190} f={f} seed={60 + i} walk={walk > 0.02 && walk < 0.98} flip={side > 0}/>;
    })}
  </g>;
};
export const TempleLabels = slotLabels({a26: {cx: 470, y: 84, size: 38}, oa: {cx: 1400, y: 84, size: 30, maxW: 700}, vd: {cx: 330, y: 560, size: 32, maxW: 420},
  hp: {cx: 960, y: 846, size: 36, tone: "green"}, rk: {cx: 1600, y: 560, size: 32, maxW: 380}});

// ---------------------------------------------------------------- neutral-state
export const NeutralArt: React.FC<AP> = (p) => {
  const {f} = p, a1 = show(p, "a27", 16, 6), a2 = show(p, "a28", 16, 6), sec = clamp(prog(f, atOr(p, "sc"), 40));
  return <g>
    <W5Defs/>
    <Room y0={560} win={[960, 90]}/>
    <Desk y0={560}/>
    {/* a tax receipt with a blank purpose line */}
    <Sheet x={380} y={720} w={330} h={380} rot={-5} a={0.4 + 0.6 * a1}>
      <Ink x={0} y={-140} t="TAX RECEIPT" size={30} c="#5e2a0e"/>
      {[-90, -50, -10, 30].map((y) => <path key={y} d={`M-130,${y} H130`} stroke="#d6c39c" strokeWidth={6}/>)}
      <Ink x={-130} y={86} t="SPENT ON:" size={22} c="#7a4a26" anchor="start"/>
      <path d="M-10,90 H130" stroke="#c0392b" strokeWidth={3} strokeDasharray="10 8"/>
      <Ink x={60} y={130} t="no one religion" size={20} c="#c0392b" a={a1}/>
    </Sheet>
    {/* a State school with a notice board */}
    <g opacity={0.4 + 0.6 * a2} transform="translate(0 30)">
      <Portico x={960} y={700} w={420} h={260} cols={5} open={0.6} tone="warm"/>
      <rect x={1150} y={560} width={150} height={100} rx={6} fill="#2f5d4a" stroke="#6e4424" strokeWidth={5}/>
      <Ink x={1225} y={604} t="ALL" size={24} c="#fff6d8"/><Ink x={1225} y={636} t="WELCOME" size={22} c="#fff6d8"/>
      <rect x={1220} y={660} width={10} height={60} fill="#6e4424"/>
    </g>
    {/* the Preamble page, the word written in */}
    <Sheet x={1560} y={720} w={330} h={400} rot={4}>
      <Ink x={0} y={-150} t="PREAMBLE" size={30} c="#5e2a0e"/>
      {[-100, -64, -28, 44, 80, 116].map((y) => <path key={y} d={`M-130,${y} H130`} stroke="#d6c39c" strokeWidth={6}/>)}
      <g clipPath="url(#w5-sec-clip)">
        <Ink x={0} y={18} t="SECULAR" size={36} c="#c0392b"/>
      </g>
      <defs><clipPath id="w5-sec-clip"><rect x={-110} y={-20} width={220 * sec} height={50}/></clipPath></defs>
      <path d={`M-100,28 H${-100 + 200 * sec}`} stroke="#c0392b" strokeWidth={3} opacity={0.6}/>
    </Sheet>
  </g>;
};
export const NeutralLabels = slotLabels({a27: {cx: 380, y: 84, size: 32, maxW: 520}, a28: {cx: 960, y: 220, size: 28, maxW: 620}, sc: {cx: 1540, y: 84, size: 30, maxW: 560},
  nr: {cx: 960, y: 850, size: 34, tone: "green"}});

// ---------------------------------------------------------------- scripts-ribbon
/** an abstract script-like pattern (not any real script): loops, hooks, bars and dots, seeded */
const Glyphs: React.FC<{seed: number; n: number; col: string}> = ({seed, n, col}) => {
  const r = rng(seed), out: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const x = i * 46, k = Math.floor(r() * 5);
    const d = k === 0 ? `M${x},10 q14,-26 28,0 q-14,26 -28,0` : k === 1 ? `M${x},-12 v24 M${x},-12 h26` : k === 2 ? `M${x},8 q8,-24 18,-6 q10,18 18,-8` :
      k === 3 ? `M${x},-10 l12,20 l12,-20` : `M${x},0 h30 M${x + 8},-14 v28`;
    out.push(<path key={i} d={d} stroke={col} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round"/>);
    if (r() > 0.6) out.push(<circle key={`d${i}`} cx={x + 14} cy={-24} r={4} fill={col}/>);
  }
  return <g>{out}</g>;
};
export const ScriptsArt: React.FC<AP> = (p) => {
  const {f} = p, G = 820, flow = f * 1.2, any = show(p, "as", 20), open = eio(prog(f, atOr(p, "ad"), 30));
  const bands = [{y: 360, c: "#c0392b", seed: 3}, {y: 450, c: "#2f5d7c", seed: 7}, {y: 540, c: "#3f7a2a", seed: 11}];
  return <g>
    <W5Defs/>
    <Sky f={f} ground={G}/>
    {bands.map((b, i) => {
      const a = show(p, "lc", 20, 10 - i * 6) * 0.7 + 0.3;
      return <g key={i} opacity={a}>
        <path d={`M-80,${b.y + 30} C 500,${b.y - 60} 1300,${b.y + 120} ${W + 80},${b.y + 10} L${W + 80},${b.y + 80} C 1300,${b.y + 190} 500,${b.y + 10} -80,${b.y + 100} Z`} fill="#fffaf0" stroke={b.c} strokeWidth={3} opacity={0.92}/>
        <g transform={`translate(${-((flow + i * 120) % 92)} ${b.y + 62}) `}>
          {Array.from({length: 5}, (_, k) => <g key={k} transform={`translate(${k * 460} ${Math.sin((k + i) * 0.9) * 26})`}><Glyphs seed={b.seed + k} n={9} col={b.c}/></g>)}
        </g>
      </g>;
    })}
    {/* a school door with an open sign */}
    <g transform="translate(1660 0)">
      <rect x={-130} y={G - 300} width={260} height={300} fill="url(#w5-stone)" stroke="#a88a60" strokeWidth={3}/>
      <rect x={-60} y={G - 200} width={120} height={200} fill="#fff1c4" opacity={0.3 + 0.6 * open}/>
      <rect x={-60} y={G - 200} width={120 * (1 - 0.8 * open)} height={200} fill="url(#w5-wood)" stroke="#3a1e0c" strokeWidth={2}/>
      <rect x={-50} y={G - 270} width={100} height={44} rx={6} fill="#2f9a4a" opacity={open}/><text x={0} y={G - 238} textAnchor="middle" fontFamily="sans-serif" fontWeight={700} fontSize={26} fill="#fff" opacity={open}>OPEN</text>
    </g>
    {Array.from({length: 8}, (_, i) => <Person key={i} x={160 + i * 170 + Math.sin(f / 40 + i) * 6} y={G + 80 + (i % 2) * 24} h={180} f={f} seed={80 + i} op={0.4 + 0.6 * any}/>)}
  </g>;
};
export const ScriptsLabels = slotLabels({a29: {cx: 380, y: 84, size: 40}, as: {cx: 1180, y: 84, size: 40, upper: true}, lc: {cx: 700, y: 236, size: 34},
  ad: {cx: 1500, y: 846, size: 32, tone: "green"}});

// ---------------------------------------------------------------- minority-school
const Plate: React.FC<{x: number; y: number; t: string; w?: number}> = ({x, y, t, w = 330}) => (
  <g><rect x={x - w / 2} y={y - 26} width={w} height={44} rx={6} fill="#2f5d7c" stroke="#173a5c" strokeWidth={3}/><Ink x={x} y={y + 6} t={t} size={20} c="#fff6d8"/></g>
);
export const MinorityArt: React.FC<AP> = (p) => {
  const {f} = p, G = 780, aid = eio(prog(f, atOr(p, "ai") - 6, 40)), dict = show(p, "nd", 18);
  const env = (x0: number, x1: number, u: number, k: number) => {
    const x = x0 + (x1 - x0) * u, y = 300 - Math.sin(u * Math.PI) * 120 + k * 10;
    return <g transform={`translate(${x} ${y}) rotate(${-8 + 16 * u})`} opacity={u > 0.01 ? 1 : 0}>
      <rect x={-46} y={-30} width={92} height={60} rx={6} fill="#fffaf0" stroke="#7a4a26" strokeWidth={3}/><path d="M-46,-30 L0,6 L46,-30" stroke="#7a4a26" strokeWidth={3} fill="none"/>
      <Ink x={0} y={22} t="AID" size={16} c="#7a4a26"/>
    </g>;
  };
  return <g>
    <W5Defs/>
    <Sky f={f} ground={G}/>
    <Portico x={520} y={G - 30} w={520} h={300} cols={6} open={0.5} tone="warm"><Plate x={520} y={G - 300} t="MANAGED BY A MINORITY"/></Portico>
    <Portico x={1120} y={G - 30} w={420} h={260} cols={5} open={0.5} tone="stone"><Plate x={1120} y={G - 266} t="SCHOOL" w={180}/></Portico>
    {env(820, 520, aid, 0)}{env(820, 1120, aid, 1)}
    {/* a dictionary page: MINORITY, its definition left blank */}
    <g opacity={dict} transform={`translate(1600 ${420 + (1 - dict) * 30})`}>
      <Sheet x={0} y={0} w={330} h={300} rot={3}>
        <Ink x={-130} y={-96} t="MINORITY" size={30} c="#5e2a0e" anchor="start"/>
        <Ink x={-130} y={-60} t="in the Constitution:" size={18} c="#7a4a26" anchor="start"/>
        {[-20, 20, 60, 100].map((y) => <path key={y} d={`M-130,${y} H130`} stroke="#c9b48a" strokeWidth={3} strokeDasharray="12 10"/>)}
      </Sheet>
    </g>
    {Array.from({length: 6}, (_, i) => <Person key={i} x={300 + i * 150} y={G + 90 + (i % 2) * 20} h={170} f={f} seed={100 + i}/>)}
  </g>;
};
export const MinorityLabels = slotLabels({a30: {cx: 360, y: 84, size: 40}, sc: {cx: 1000, y: 84, size: 32, maxW: 640}, ai: {cx: 820, y: 170, size: 30, tone: "green"},
  nd: {cx: 1600, y: 650, size: 28, maxW: 460}, nc: {cx: 1600, y: 840, size: 28, maxW: 460}});
