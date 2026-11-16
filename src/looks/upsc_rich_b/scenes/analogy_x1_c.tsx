// ECO-12 Part 1, builder X1: `pen-chain` (modes excise, vat), `credit-chain`, `destination-trucks`, `outside-glass`, `bags-seesaw`.
// No map is drawn (State lines are road signs only); tags carry words, the labels carry the figures.
import React from "react";
import {Person, Cloud, type AP} from "./analogy_kit";
import {Desk, Ink, Portico, Room, Shadow, Sheet, W5Defs, clamp, eo, prog, show, slotLabels, atOr, W, H} from "./analogy_w5_kit";
import {Coin, modeLabels} from "./analogy_x1_a";
import {eio} from "../kit";

const Tag: React.FC<{x: number; y: number; t: string; c?: string; rot?: number; s?: number}> = ({x, y, t, c = "#f6dd8a", rot = 0, s = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-110,-44 H70 L110,0 L70,44 H-110 Z" fill={c} stroke="#7a5414" strokeWidth={3}/><circle cx={74} cy={0} r={8} fill="#7a5414"/>
    <Ink x={-20} y={10} t={t} size={26} c="#3a1e0c"/>
  </g>
);

// ---------------------------------------------------------------- pen-chain
const Pen: React.FC<{x: number; y: number; s?: number; whole?: number}> = ({x, y, s = 1, whole = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-12)`}>
    <rect x={-160 - 40 * (1 - whole)} y={-16} width={70} height={32} rx={10} fill="#2f5d7c"/>
    <rect x={-90} y={-14} width={210} height={28} rx={8} fill="#3f78a8"/>
    <path d={`M${120 + 30 * (1 - whole)},-14 L${170 + 30 * (1 - whole)},0 L${120 + 30 * (1 - whole)},14 Z`} fill="#c99a3a"/>
    <rect x={-150 - 40 * (1 - whole)} y={-26} width={10} height={40} rx={4} fill="#c99a3a"/>
  </g>
);
export const PenArt: React.FC<AP> = (p) => {
  const {f} = p, mode = (p.spec as any).mode ?? "excise";
  const parts = mode === "excise" ? eio(prog(f, atOr(p, "in") - 20, 40)) : 1, made = mode === "excise" ? eio(prog(f, atOr(p, "pn") - 20, 30)) : 1;
  const vat = mode === "vat" ? eio(prog(f, atOr(p, "vt") - 6, 30)) : 0, wob = mode === "vat" ? Math.sin(f / 8) * 4 * show(p, "cs", 20) : 0;
  return <g>
    <W5Defs/>
    <Room y0={620} win={[1700, 80]}/>
    <Desk y0={620}/>
    <g opacity={1 - made * 0.8}>
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${300 + i * 140} ${560 + (1 - parts) * -200})`}><rect x={-50} y={-20} width={100} height={40} rx={8} fill={["#2f5d7c", "#3f78a8", "#c99a3a"][i]}/></g>)}
      <Tag x={440} y={680} t="EXCISE" s={0.8 * parts} c="#e9d6ae"/>
    </g>
    <Pen x={1000} y={560} s={1.6} whole={made}/>
    <g transform={`translate(1380 ${520 + wob}) rotate(${wob})`}>
      <Tag x={0} y={140} t="PRICE + EXCISE" s={made}/>
      {vat > 0.01 && <g transform={`translate(0 ${140 - 96 * vat}) rotate(${-4 + wob})`}><Tag x={0} y={0} t="VAT" c="#f0b45a"/></g>}
    </g>
  </g>;
};
export const PenLabels = modeLabels({
  excise: {cx: {cx: 960, y: 84, size: 36}, in: {cx: 440, y: 846, size: 32}, pn: {cx: 1380, y: 846, size: 32}},
  vat: {vt: {cx: 1380, y: 120, size: 30, maxW: 600}, cs: {cx: 700, y: 200, size: 40, upper: true, tone: "dark"}, so: {cx: 960, y: 846, size: 30}},
}, "excise");

// ---------------------------------------------------------------- credit-chain
const STAGES = [{x: 260, k: "FACTORY"}, {x: 740, k: "WHOLESALER"}, {x: 1220, k: "SHOP"}, {x: 1680, k: "CUSTOMER"}];
export const CreditArt: React.FC<AP> = (p) => {
  const {f} = p, G = 760, pass = clamp(prog(f, atOr(p, "ts") - 10, 160)), cred = clamp(prog(f, atOr(p, "cr"), 160)), va = show(p, "va", 20);
  return <g>
    <W5Defs/>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w5-sky)"/>
    <rect x={-60} y={G} width={W + 120} height={H} fill="url(#w5-ground)"/>
    {STAGES.slice(0, 3).map((s, i) => <g key={s.k}>
      <Portico x={s.x} y={G - 20} w={260} h={230} cols={4} open={0.5} tone={i % 2 ? "stone" : "warm"}/>
      <Ink x={s.x} y={G + 40} t={s.k} size={20} c="#5e3518"/>
      <rect x={s.x - 44} y={G - 170 - 30 * va} width={88} height={30 * va} fill="#3f9a5a" opacity={0.8}/>
    </g>)}
    <Person x={STAGES[3].x} y={G + 10} h={230} f={f} seed={150}/><Ink x={STAGES[3].x} y={G + 40} t="CUSTOMER" size={20} c="#5e3518"/>
    {[0, 1, 2].map((i) => {
      const a = STAGES[i].x + 140, b = STAGES[i + 1].x - 140, u = clamp(pass * 3 - i), r = clamp(cred * 3 - i);
      return <g key={i}>
        <path d={`M${a},${G - 200} Q${(a + b) / 2},${G - 280} ${b},${G - 200}`} fill="none" stroke="#c99a3a" strokeWidth={5} strokeDasharray="10 10" opacity={0.6}/>
        {u > 0 && u < 1 && <Coin x={a + (b - a) * u} y={G - 200 - Math.sin(u * Math.PI) * 80} r={18}/>}
        {r > 0 && <g transform={`translate(${b - (b - a) * r} ${G - 120 + Math.sin(r * Math.PI) * 50})`} opacity={r < 1 ? 1 : 0.85}>
          <rect x={-34} y={-22} width={68} height={44} rx={4} fill="#fffaf0" stroke="#3f9a5a" strokeWidth={3}/><Ink x={0} y={8} t="CREDIT" size={14} c="#3f9a5a"/></g>}
      </g>;
    })}
  </g>;
};
export const CreditLabels = slotLabels({ts: {cx: 960, y: 84, size: 34}, cr: {cx: 960, y: 196, size: 30, upper: true, tone: "green"}, va: {cx: 560, y: 846, size: 28}, nc: {cx: 1420, y: 846, size: 28}});

// ---------------------------------------------------------------- destination-trucks
const Truck: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <Shadow x={0} y={10} rx={130}/>
    <rect x={-120} y={-110} width={170} height={100} rx={6} fill="#e8c46c" stroke="#7a5414" strokeWidth={3}/>
    <path d="M50,-80 H100 L130,-46 V-10 H50 Z" fill="#2f78b8" stroke="#1d3f66" strokeWidth={3}/><rect x={64} y={-72} width={40} height={26} rx={4} fill="#cfe6f5"/>
    {[-80, 10, 96].map((cx) => <circle key={cx} cx={cx} cy={0} r={18} fill="#2a2a2a" stroke="#888" strokeWidth={4}/>)}
  </g>
);
const Road: React.FC<{y: number}> = ({y}) => (
  <g><rect x={-60} y={y - 40} width={W + 120} height={80} fill="#6a6a6a"/><path d={`M-60,${y} H${W + 60}`} stroke="#fff6d8" strokeWidth={6} strokeDasharray="40 30"/></g>
);
const Sign: React.FC<{x: number; y: number; t: string; t2?: string}> = ({x, y, t, t2}) => (
  <g><rect x={x - 6} y={y - 160} width={12} height={160} fill="#6e4424"/>
    <rect x={x - (t2 ? 170 : 100)} y={y - 220} width={t2 ? 340 : 200} height={64} rx={8} fill="#2f6b4a" stroke="#fff" strokeWidth={3}/>
    {t2 ? <><Ink x={x - 85} y={y - 178} t={t} size={22} c="#fff"/><path d={`M${x},${y - 214} V${y - 162}`} stroke="#fff" strokeWidth={3}/><Ink x={x + 85} y={y - 178} t={t2} size={22} c="#fff"/></> : <Ink x={x} y={y - 178} t={t} size={22} c="#fff"/>}
  </g>
);
export const TrucksArt: React.FC<AP> = (p) => {
  const {f} = p, u1 = clamp(prog(f, atOr(p, "wi") - 30, 160)), u2 = clamp(prog(f, atOr(p, "bt") - 20, 140));
  return <g>
    <W5Defs/>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w5-sky)"/>
    {[0, 1].map((i) => <Cloud key={i} x={400 + i * 800} y={120} s={0.7} f={f} speed={0.15} seed={i + 41} a={0.8}/>)}
    <rect x={-60} y={330} width={W + 120} height={H} fill="#bcd29a"/>
    <Road y={470}/><Road y={830}/>
    <Sign x={200} y={420} t="STATE A"/><Sign x={1700} y={420} t="STATE A"/>
    <Sign x={1100} y={780} t="STATE A" t2="STATE B"/>
    <Truck x={300 + 1000 * u1} y={490}/>
    <Truck x={200 + 1500 * u2} y={850}/>
  </g>;
};
export const TrucksLabels = slotLabels({ds: {cx: 960, y: 70, size: 34}, wi: {cx: 960, y: 290, size: 30, maxW: 600}, bt: {cx: 520, y: 560, size: 30, maxW: 600}});

// ---------------------------------------------------------------- outside-glass
export const GlassArt: React.FC<AP> = (p) => {
  const {f} = p, a1 = show(p, "al", 16, 6), a2 = show(p, "el", 16, 6), a3 = show(p, "pt", 16, 6), glass = show(p, "ng", 20);
  return <g>
    <W5Defs/>
    <Room y0={700} win={[1740, 80]}/>
    <rect x={-60} y={700} width={W + 120} height={400} fill="#b89a70"/>
    <g opacity={a1} transform="translate(420 640)">
      <Shadow x={0} y={60} rx={90}/><path d="M-40,60 V-60 Q-40,-90 -16,-110 V-170 H16 V-110 Q40,-90 40,-60 V60 Z" fill="#7aa86a" fillOpacity={0.7} stroke="#3a5a2a" strokeWidth={3}/><rect x={-20} y={-190} width={40} height={24} rx={4} fill="#8a5a34"/>
    </g>
    <g opacity={a2} transform="translate(960 640)">
      <rect x={-10} y={-360} width={20} height={420} fill="#6e4424"/><rect x={-110} y={-330} width={220} height={14} fill="#6e4424"/>
      {[-1, 1].map((s) => <path key={s} d={`M${s * 100},-322 Q${s * 400},-260 ${s * 700},-330`} stroke="#2a2a2a" strokeWidth={3} fill="none"/>)}
    </g>
    <g opacity={a3} transform="translate(1500 640)">
      <rect x={-70} y={-200} width={140} height={260} rx={10} fill="#c0392b" stroke="#6e1e18" strokeWidth={3}/><rect x={-50} y={-180} width={100} height={60} rx={6} fill="#fff6d8"/>
      <path d="M70,-60 Q140,-60 140,0 V40" stroke="#2a2a2a" strokeWidth={10} fill="none"/><rect x={120} y={36} width={40} height={60} rx={6} fill="#3b3f48"/>
      <g transform="translate(-110 -230) rotate(-8)"><rect x={-60} y={-40} width={120} height={80} rx={6} fill="#fffaf0" stroke="#7a4a26" strokeWidth={3}/><rect x={-60} y={-40} width={120} height={20} rx={6} fill="#c0392b"/>
        <Ink x={0} y={26} t="COUNCIL" size={16} c="#5e2a0e"/></g>
    </g>
    <rect x={180} y={160} width={1560} height={560} rx={10} fill="#d8eef6" fillOpacity={0.28 * glass} stroke="#8fb4c4" strokeWidth={6} opacity={glass}/>
    <path d="M260,200 L420,680 M340,200 L500,680" stroke="#fff" strokeWidth={10} opacity={0.35 * glass}/>
  </g>;
};
export const GlassLabels = slotLabels({ng: {cx: 960, y: 84, size: 40, upper: true, tone: "dark"}, al: {cx: 420, y: 846, size: 28, maxW: 520}, el: {cx: 960, y: 846, size: 28, maxW: 420},
  pt: {cx: 1500, y: 846, size: 26, maxW: 600}});

// ---------------------------------------------------------------- bags-seesaw
export const BagsArt: React.FC<AP> = (p) => {
  const {f} = p, settle = clamp(prog(f, atOr(p, "rt") - 60, 70)), tilt = (1 - eio(settle)) * 10 * Math.sin(f / 12) + (1 - settle) * 6;
  const bags = [{x: -520, s: 0.9}, {x: -280, s: 1.3}, {x: -40, s: 0.7}, {x: 200, s: 1.1}, {x: 440, s: 0.8}];
  return <g>
    <W5Defs/>
    <Room y0={760} win={[1720, 80]}/>
    <rect x={-60} y={760} width={W + 120} height={400} fill="#b89a70"/>
    <path d="M900,760 L960,640 L1020,760 Z" fill="url(#w5-wood)" stroke="#3a1e0c" strokeWidth={3}/>
    <g transform={`translate(960 640) rotate(${tilt})`}>
      <rect x={-640} y={-14} width={1280} height={22} rx={8} fill="url(#w5-wood)"/>
      {bags.map((b, i) => <g key={i} transform={`translate(${b.x} -14) scale(${b.s})`}>
        <path d="M-70,0 L-80,-150 H80 L70,0 Z" fill={["#e8c46c", "#d8682a", "#9ab070", "#8fb4c4", "#c99a62"][i]} stroke="#5e3518" strokeWidth={3}/>
        <path d="M-40,-150 Q-40,-200 0,-200 Q40,-200 40,-150" stroke="#5e3518" strokeWidth={6} fill="none"/>
        <rect x={-30} y={-110} width={60} height={34} rx={4} fill="#fffaf0" stroke="#7a4a26" strokeWidth={2}/><Ink x={0} y={-86} t="RATE" size={14} c="#5e2a0e"/>
      </g>)}
    </g>
    <path d="M960,600 V560" stroke="#c0392b" strokeWidth={8} opacity={settle}/><path d="M944,572 L960,548 L976,572 Z" fill="#c0392b" opacity={settle}/>
  </g>;
};
export const BagsLabels = slotLabels({wm: {cx: 960, y: 84, size: 34}, rt: {cx: 960, y: 230, size: 40, tone: "dark"}, ol: {cx: 960, y: 846, size: 30, upper: true}});
