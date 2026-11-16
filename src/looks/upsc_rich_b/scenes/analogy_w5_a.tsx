// POL-03 Part 3, builder W5: `school-anthem` (modes shut, back), `two-books` (modes apart, compass), `three-verbs` (modes verbs, frame).
import React from "react";
import {Person, type AP} from "./analogy_kit";
import {Book, Compass, Desk, Gavel, Ink, Portico, Room, Shadow, Sheet, W5Defs, clamp, eo, prog, show, slotLabels, atOr, W, H} from "./analogy_w5_kit";
import {eio} from "../kit";

// ---------------------------------------------------------------- school-anthem
const GATE_X = 1560, YARD = 760;
const Gate: React.FC<{open: number}> = ({open}) => {
  const leaf = (dir: -1 | 1) => {
    const w = 150 * (1 - 0.8 * open);
    return <g>{Array.from({length: 7}, (_, i) => <rect key={i} x={GATE_X + dir * (6 + (i * w) / 7) - (dir < 0 ? 6 : 0)} y={YARD - 250} width={6} height={250} rx={3} fill="#3b3f48"/>)}
      <rect x={dir < 0 ? GATE_X - w - 6 : GATE_X} y={YARD - 250} width={w + 6} height={10} fill="#3b3f48"/><rect x={dir < 0 ? GATE_X - w - 6 : GATE_X} y={YARD - 120} width={w + 6} height={8} fill="#3b3f48"/></g>;
  };
  return <g>
    <rect x={GATE_X - 186} y={YARD - 300} width={28} height={300} fill="url(#w5-stoned)"/><rect x={GATE_X + 158} y={YARD - 300} width={28} height={300} fill="url(#w5-stoned)"/>
    <rect x={GATE_X - 192} y={YARD - 312} width={40} height={16} fill="#e4d3b0"/><rect x={GATE_X + 152} y={YARD - 312} width={40} height={16} fill="#e4d3b0"/>
    {leaf(-1)}{leaf(1)}
  </g>;
};
export const AnthemArt: React.FC<AP> = (p) => {
  const {f} = p, mode = (p.spec as any).mode ?? "shut";
  // where the three children are: 0 = in their row, 1 = outside the gate
  const out = mode === "shut" ? eio(prog(f, atOr(p, "ex") - 10, 50)) : 1 - eio(prog(f, atOr(p, "bj") + 20, 70));
  const gateOpen = mode === "shut" ? 1 - eio(prog(f, atOr(p, "ex") + 40, 30)) : eio(prog(f, atOr(p, "bj"), 26));
  const glow = mode === "shut" ? show(p, "st", 20) : show(p, "nl", 20);
  const rows = [0, 1, 2].map((r) => Array.from({length: 11}, (_, i) => ({x: 240 + i * 92 + (r % 2) * 40, y: YARD - 10 + r * 52, h: 150 + r * 10, seed: r * 20 + i})));
  const three = [rows[1][4], rows[1][5], rows[1][6]];
  return <g>
    <W5Defs/>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w5-dawn)"/>
    <circle cx={1700} cy={230} r={70} fill="#fff1c4" opacity={0.9}/><circle cx={1700} cy={230} r={150} fill="url(#w5-glow)" opacity={0.6}/>
    <Portico x={620} y={YARD - 140} w={760} h={420} cols={7} open={0.2} tone="warm"/>
    <rect x={-60} y={YARD - 140} width={W + 120} height={H} fill="url(#w5-ground)"/>
    <path d={`M-60,${YARD - 140} H${W + 60}`} stroke="#f2deb0" strokeWidth={4} opacity={0.7}/>
    {/* the boundary wall with the gate */}
    <rect x={1100} y={YARD - 190} width={GATE_X - 186 - 1100} height={50} fill="url(#w5-stone)" stroke="#a88a60" strokeWidth={2}/>
    <rect x={GATE_X + 186} y={YARD - 190} width={W - GATE_X} height={50} fill="url(#w5-stone)" stroke="#a88a60" strokeWidth={2}/>
    <Gate open={gateOpen}/>
    {rows.map((row, r) => row.map((c) => {
      const k = three.indexOf(c);
      if (k >= 0) return null;
      return <Person key={c.seed} x={c.x} y={c.y} h={c.h} f={f} seed={c.seed + 3}/>;
    }))}
    {three.map((c, k) => {
      const tx = GATE_X + 260 + k * 80, x = c.x + (tx - c.x) * out, y = c.y + (YARD - 6 - c.y) * out;
      const moving = out > 0.02 && out < 0.98;
      return <g key={k}>
        <ellipse cx={x} cy={y - c.h * 0.55} rx={46} ry={c.h * 0.62} fill="url(#w5-glow)" opacity={glow * 0.8}/>
        <Person x={x} y={y} h={c.h} f={f} seed={c.seed + 3} walk={moving} flip={mode === "back"}/>
      </g>;
    })}
    <Shadow x={960} y={H - 40} rx={900} a={0.12}/>
  </g>;
};
const ANTHEM_SLOTS = {st: {cx: 560, y: 92, size: 40, upper: true}, ex: {cx: 1560, y: 150, size: 46, upper: true, tone: "dark" as const},
  bj: {cx: 560, y: 86, size: 40}, ar: {cx: 1300, y: 86, size: 36, upper: true}, nl: {cx: 960, y: 830, size: 38, tone: "green" as const}};
export const AnthemLabels = slotLabels(ANTHEM_SLOTS);

// ---------------------------------------------------------------- two-books
export const BooksArt: React.FC<AP> = (p) => {
  const {f} = p, mode = (p.spec as any).mode ?? "apart";
  if (mode === "compass") {
    const open = eio(prog(f, atOr(p, "a37") - 20, 40)), rise = eo(prog(f, atOr(p, "fg") - 10, 30));
    const needle = -140 + 230 * eio(prog(f, atOr(p, "gl") - 30, 40)) + 4 * Math.sin(f / 14) * (1 - prog(f, atOr(p, "gl"), 40));
    const glow = show(p, "gl", 30);
    return <g>
      <W5Defs/>
      <Room y0={560} win={[1520, 110]}/>
      {/* the horizon through the window: GOALS */}
      <circle cx={1580} cy={300} r={36} fill="#fff1b0" opacity={0.6 + 0.4 * glow}/><circle cx={1580} cy={300} r={120} fill="url(#w5-glow)" opacity={glow}/>
      <Ink x={1520} y={420} t="GOALS" size={34} c="#7a4a26" a={glow}/>
      <Desk y0={560}/>
      <Book x={300} y={720} w={330} h={220} cover="url(#w5-red)" title="PART III" icon={<Gavel s={0.5}/>} rot={-4}/>
      <rect x={120} y={600} width={360} height={260} fill="#efe0c2" opacity={0.35}/>
      {/* PART IV opens: two page halves on the desk */}
      <g transform="translate(980 760)">
        <Shadow x={0} y={110} rx={420} a={0.3}/>
        <path d={`M0,-130 Q-200,${-150 + 30 * open} -380,-118 L-380,100 Q-200,80 0,104 Z`} fill="url(#w5-paper)" stroke="#b8a074" strokeWidth={2} opacity={open}/>
        <path d={`M0,-130 Q200,${-150 + 30 * open} 380,-118 L380,100 Q200,80 0,104 Z`} fill="url(#w5-paper)" stroke="#b8a074" strokeWidth={2}/>
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${-340},${-80 + i * 34} H${-60}`} stroke="#d6c39c" strokeWidth={6} opacity={open * 0.8}/>)}
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M60,${-80 + i * 34} H340`} stroke="#d6c39c" strokeWidth={6} opacity={0.8}/>)}
        <g transform={`translate(-190 ${-120 * (1 - open)}) scale(${1 - open} 1)`} opacity={1 - open}><rect x={-190} y={-130} width={380} height={234} rx={10} fill="url(#w5-blue)"/></g>
        <path d="M0,-130 V104" stroke="#a88a60" strokeWidth={3}/>
      </g>
      <g transform={`translate(980 ${640 - 240 * rise})`} opacity={rise}>
        <circle r={150} fill="url(#w5-glow)" opacity={0.5}/>
        <Compass s={2.2} needle={needle}/>
      </g>
    </g>;
  }
  const slide = eio(prog(f, atOr(p, "q") - 30, 50)), gap = 300 - 210 * slide;
  const jolt = Math.sin(clamp(prog(f, atOr(p, "q") + 20, 18)) * Math.PI) * 6;
  return <g>
    <W5Defs/>
    <Room y0={520} win={[1560, 100]}/>
    <Desk y0={520}/>
    <Book x={960 - gap - 230} y={700 + jolt} w={460} h={300} cover="url(#w5-red)" title="PART III" icon={<Gavel s={0.75} swing={Math.sin(f / 18) * 0.15}/>} rot={-3}/>
    <Book x={960 + gap + 230} y={700 - jolt} w={460} h={300} cover="url(#w5-blue)" title="PART IV" icon={<Compass s={0.75} needle={Math.sin(f / 30) * 40}/>} rot={3}/>
    {slide > 0.7 && <g opacity={(slide - 0.7) / 0.3}>{[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M960,${690} l${Math.cos(i * 1.05) * 60},${Math.sin(i * 1.05) * 60}`} stroke="#f0b45a" strokeWidth={6} strokeLinecap="round"/>)}</g>}
  </g>;
};
const BOOKS_SLOTS = {r3: {cx: 500, y: 104, size: 36}, r4: {cx: 1420, y: 104, size: 36}, q: {cx: 960, y: 250, size: 52, upper: true, tone: "dark" as const},
  a37: {cx: 520, y: 80, size: 38}, fg: {cx: 1300, y: 160, size: 34, upper: true}, du: {cx: 440, y: 470, size: 34}, gl: {cx: 1480, y: 470, size: 36, tone: "green" as const}};
export const BooksLabels = slotLabels(BOOKS_SLOTS);

// ---------------------------------------------------------------- three-verbs
const Mouth: React.FC<{f: number}> = ({f}) => <g>
  <path d="M-60,-40 H40 Q60,-40 60,-20 V20 Q60,40 40,40 H-10 L-34,64 V40 H-60 Q-80,40 -80,20 V-20 Q-80,-40 -60,-40 Z" fill="#fffaf0" stroke="#7a4a26" strokeWidth={4}/>
  {[0, 1, 2].map((i) => <path key={i} d={`M${-46 + i * 30},${-6 + 4 * Math.sin(f / 9 + i)} q8,-12 16,0`} stroke="#d8682a" strokeWidth={5} fill="none" strokeLinecap="round"/>)}
</g>;
const Lamp: React.FC<{f: number}> = ({f}) => <g>
  <ellipse cx={0} cy={44} rx={70} ry={14} fill="#a8742e"/><path d="M-60,30 Q0,70 60,30 Q50,10 -50,10 Z" fill="url(#w5-brass)" stroke="#7a5414" strokeWidth={3}/>
  <path d={`M0,10 Q${-16 + 3 * Math.sin(f / 7)},-30 0,-62 Q${16 + 3 * Math.sin(f / 9)},-30 0,10 Z`} fill="#ffcf5a"/><circle cx={0} cy={-20} r={60} fill="url(#w5-glow)" opacity={0.7}/>
</g>;
const OpenBook: React.FC = () => <g>
  <path d="M0,-40 Q-50,-56 -96,-44 V44 Q-50,32 0,48 Z" fill="#fffaf0" stroke="#2f5d7c" strokeWidth={4}/><path d="M0,-40 Q50,-56 96,-44 V44 Q50,32 0,48 Z" fill="#fffaf0" stroke="#2f5d7c" strokeWidth={4}/>
  {[0, 1, 2].map((i) => <g key={i}><path d={`M-80,${-22 + i * 20} H-18`} stroke="#9fb4c8" strokeWidth={5}/><path d={`M18,${-22 + i * 20} H80`} stroke="#9fb4c8" strokeWidth={5}/></g>)}
  {[0, 1, 2].map((i) => <path key={i} d={`M${100 + i * 26},${-30 + i * 10} q14,-10 28,0`} stroke="#d8682a" strokeWidth={4} fill="none" opacity={0.8}/>)}
</g>;
export const VerbsArt: React.FC<AP> = (p) => {
  const {f} = p, mode = (p.spec as any).mode ?? "verbs", X = [520, 960, 1400], keys = ["v1", "v2", "v3"];
  const icons = [<Mouth key="m" f={f}/>, <Lamp key="l" f={f}/>, <OpenBook key="b"/>];
  const frame = mode === "frame" ? 1 : 0, fr = (k: string) => (frame ? show(p, k, 18) : 0);
  const gear = mode === "frame" ? show(p, "sa", 20) : 0;
  return <g>
    <W5Defs/>
    <Room y0={600} win={[1660, 90]}/>
    <Desk y0={600}/>
    <Sheet x={960} y={390} w={1160} h={mode === "frame" ? 470 : 560} rot={-0.4}>
      {Array.from({length: 11}, (_, i) => <path key={i} d={`M-560,${-220 + i * 44} H560`} stroke="#c9d6e4" strokeWidth={1.6}/>)}
      <path d="M-480,-280 V280" stroke="#e2a0a0" strokeWidth={2}/>
    </Sheet>
    {X.map((x, i) => {
      const a = mode === "verbs" ? show(p, keys[i], 16, 6) : 1, bob = Math.sin(f / 26 + i) * 4;
      return <g key={i} transform={`translate(${x} ${(mode === "frame" ? 360 : 380) + bob + (1 - a) * 30}) scale(${mode === "frame" ? 0.9 : 1.1})`} opacity={a}>{icons[i]}</g>;
    })}
    {/* the frame of limits */}
    {frame ? <g>
      {[["po", "M360,150 H1560"], ["mo", "M360,150 V620"], ["he", "M1560,150 V620"], ["po", "M360,620 H1560"]].map(([k, d], i) => (
        <path key={i} d={d} stroke="url(#w5-brass)" strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - fr(k)}/>
      ))}
      <g transform={`translate(1700 760) rotate(${f * 1.6 * gear})`} opacity={gear}>
        {Array.from({length: 10}, (_, i) => <rect key={i} x={-12} y={-92} width={24} height={30} rx={4} fill="#8a6238" transform={`rotate(${i * 36})`}/>)}
        <circle r={70} fill="#a8742e" stroke="#6e4424" strokeWidth={6}/><circle r={24} fill="#efe0c2"/>
      </g>
    </g> : <g>
      {Array.from({length: 9}, (_, i) => <Person key={i} x={300 + i * 165} y={770 + (i % 2) * 18} h={170} f={f} seed={40 + i} op={show(p, "ap", 20) * 0.9 + 0.1}/>)}
    </g>}
  </g>;
};
const VERBS_SLOTS = {a25: {cx: 960, y: 70, size: 40}, v1: {cx: 520, y: 520, size: 40, upper: true}, v2: {cx: 960, y: 520, size: 40, upper: true}, v3: {cx: 1400, y: 520, size: 40, upper: true},
  ap: {cx: 960, y: 640, size: 34, tone: "green" as const},
  po: {cx: 960, y: 60, size: 34, upper: true}, mo: {cx: 230, y: 360, size: 30, maxW: 280, upper: true}, he: {cx: 1700, y: 360, size: 30, maxW: 260, upper: true},
  sa: {cx: 1420, y: 660, size: 28, maxW: 420}, sw: {cx: 500, y: 660, size: 28, maxW: 520}, nc: {cx: 960, y: 760, size: 28, maxW: 1100}, fc: {cx: 960, y: 838, size: 28, maxW: 1100, tone: "green" as const}};
export const VerbsLabels = slotLabels(VERBS_SLOTS);
