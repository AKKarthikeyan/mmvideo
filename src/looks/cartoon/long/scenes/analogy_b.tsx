// analogy: breeze (day / night), roundabout, pot.
import React from "react";
import {C} from "../../palette";
import {ease} from "../../ui";
import {Actor} from "../cast";
import {Cloud, Flow, INK, Palm, Person, Pill, SW, Sun, labelOf, type AnalogyBase, type Pt} from "./analogy_kit";

type P = {f: number; dur: number; spec: AnalogyBase; at: (k: string) => number};
const lab = (spec: AnalogyBase, i: number, at: (k: string) => number) => {
  const l = labelOf(spec.labels, i);
  return l ? {text: l.text, at: at(l.key)} : null;
};

// ---- breeze -------------------------------------------------------------------------------------------------------------------------
export const BREEZE_BG = {day: C.sky, night: "#1C2A5E"};
const Breeze: React.FC<P> = ({f, spec, at}) => {
  const night = spec.time === "night";
  if (spec.time !== "day" && spec.time !== "night") throw new Error('analogy breeze: spec.time must be "day" or "night"');
  const l = lab(spec, 0, at), warm = C.orange, cool = "#4C8DF0";
  const seaY = 640;
  const grow = ease(f, 6, 40);
  const heatLines = Array.from({length: 5}, (_, i) => {
    const u = (f * 0.012 + i / 5) % 1, x = 1100 + i * 150;
    return <path key={i} d={`M ${x} ${seaY - 20 - u * 140} q 16 -22 0 -44 q -16 -22 0 -44`} fill="none" stroke={C.red} strokeWidth={7} strokeLinecap="round" opacity={night ? 0 : (1 - u) * 0.8}/>;
  });
  // loop arrows: day = sea air in low, up over sand; night = reversed
  const low: Pt[] = night ? [[1250, 585], [1000, 585], [700, 585], [470, 585]] : [[470, 585], [700, 585], [1000, 585], [1250, 585]];
  const high: Pt[] = night ? [[470, 245], [700, 232], [1000, 232], [1260, 245]] : [[1260, 245], [1000, 232], [700, 232], [470, 245]];
  const landUp: Pt[] = night ? [[1325, 270], [1335, 400], [1325, 530]] : [[1325, 530], [1335, 400], [1325, 270]];
  const seaUp: Pt[] = night ? [[405, 530], [395, 400], [405, 270]] : [[405, 270], [395, 400], [405, 530]];
  const landCol = night ? cool : warm, seaCol = night ? warm : cool;
  const lowCol = night ? cool : cool, highCol = night ? warm : warm;
  return <g>
    {night ? <g>{Array.from({length: 16}, (_, i) => <circle key={i} cx={120 + (i * 331) % 1700} cy={150 + (i * 137) % 330} r={4 + (i % 3)} fill={C.yellow} opacity={0.5 + 0.5 * Math.sin(f / 10 + i)}/>)}
      <circle cx={1530} cy={260} r={58} fill="#FFF4D6" stroke={INK} strokeWidth={SW}/><circle cx={1556} cy={244} r={48} fill={BREEZE_BG.night}/></g>
      : <Sun x={1530} y={260} r={52} f={f}/>}
    {!night && <Cloud x={200} y={150} s={0.8} f={f} seed={2} speed={0.2}/>}
    {/* sea */}
    <path d={`M 0 ${seaY} L 930 ${seaY} L 930 1080 L 0 1080 Z`} fill={night ? "#2A55B8" : C.blue} stroke={INK} strokeWidth={SW} strokeLinejoin="round"/>
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${40 + i * 220} ${seaY + 28 + (i % 2) * 40} q 40 -24 80 0 q 40 24 80 0`} fill="none" stroke={C.white} strokeWidth={7} strokeLinecap="round" opacity={0.8} transform={`translate(${Math.sin(f / 18 + i) * 14} 0)`}/>)}
    {/* sand */}
    <path d={`M 910 ${seaY + 4} Q 1010 ${seaY - 50} 1130 ${seaY - 50} L 1920 ${seaY - 50} L 1920 1080 L 910 1080 Z`} fill={night ? "#8C98B8" : "#F0C97A"} stroke={INK} strokeWidth={SW} strokeLinejoin="round"/>
    {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={1000 + i * 200} cy={880 + (i % 2) * 50} r={9} fill={night ? "#6E7AA0" : C.floor}/>)}
    {heatLines}
    {/* boat: sail leans with the wind */}
    <g transform={`translate(260 ${seaY + 6 + Math.sin(f / 14) * 6}) rotate(${Math.sin(f / 18) * 2})`}>
      <path d="M -70 0 L 70 0 L 48 38 L -48 38 Z" fill={C.red} stroke={INK} strokeWidth={SW} strokeLinejoin="round"/>
      <path d="M 0 -4 L 0 -150" stroke={INK} strokeWidth={7}/>
      <path d={night ? "M -4 -146 Q -62 -90 -4 -20 Z" : "M 4 -146 Q 66 -90 4 -20 Z"} fill={C.white} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    </g>
    <Palm x={1780} y={seaY + 190} h={330} f={f} lean={night ? -1 : 2.5} seed={2}/>
    <Actor who="girl" x={1560} y={870} h={340} f={f} pose="idle" seed={5}/>
    {/* the loop */}
    <Flow pts={low} f={f} color={lowCol} w={26} grow={grow} speed={2.2}/>
    <Flow pts={landUp} f={f} color={landCol === cool ? cool : warm} w={26} grow={ease(f, 20, 54)} speed={2.2}/>
    <Flow pts={high} f={f} color={highCol} w={26} grow={ease(f, 36, 70)} speed={2.2}/>
    <Flow pts={seaUp} f={f} color={seaCol} w={26} grow={ease(f, 52, 86)} speed={2.2}/>
    {l && <Pill text={l.text} f={f} at={l.at} cx={880} cy={116} size={50} maxW={1000}/>}
  </g>;
};

// ---- roundabout ---------------------------------------------------------------------------------------------------------------------
// World view (left): the disc spins counter-clockwise, the ball goes straight (dotted chalk line). Riders' view (right): the disc is still,
// the world (trees, the thrower) spins round it clockwise, and the same ball curves, to the right of its motion. One throw per scene.
const OMEGA = 0.0095, R = 250, T_ROLL = 140, GR = 390;
const rot = (x: number, y: number, a: number): Pt => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
const ballWorld = (t: number): Pt => [0, R * 0.86 - (R * 1.72) * Math.min(1, t / T_ROLL)];
const RIDERS: [number, string, string][] = [[0, C.blue, C.skin], [130, C.green, C.skinDark], [235, C.red, "#EDB78A"], [305, "#8E5CC7", C.skin]];
const Disc: React.FC<{f: number}> = () => <g>
  <circle r={R + 14} fill={INK}/>
  <circle r={R} fill={C.cream}/>
  {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M 0 0 L ${R * Math.cos(i * Math.PI / 3)} ${R * Math.sin(i * Math.PI / 3)} A ${R} ${R} 0 0 1 ${R * Math.cos((i + 1) * Math.PI / 3)} ${R * Math.sin((i + 1) * Math.PI / 3)} Z`} fill={i % 2 ? C.orange : C.yellow} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>)}
  <circle r={R} fill="none" stroke={INK} strokeWidth={10}/>
  <circle r={40} fill={C.red} stroke={INK} strokeWidth={8}/>
  {RIDERS.map(([a, sh, sk], i) => {
    const k = R * 0.76, x = Math.sin(a * Math.PI / 180) * k, y = -Math.cos(a * Math.PI / 180) * k;
    return <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
      <ellipse rx={30} ry={20} cy={12} fill={sh} stroke={INK} strokeWidth={6}/>
      <circle r={20} cy={-4} fill={sk} stroke={INK} strokeWidth={6}/>
      <path d="M -20 -6 Q 0 -30 20 -6 Q 0 -14 -20 -6 Z" fill={INK}/>
    </g>;
  })}
</g>;
const Tree: React.FC<{a: number}> = ({a}) => <g transform={`rotate(${a}) translate(0 -${R + 80})`}>
  <path d="M -8 20 L -6 -16 L 8 -16 L 10 20 Z" fill={C.floor} stroke={INK} strokeWidth={5}/><circle cy={-30} r={22} fill={C.green} stroke={INK} strokeWidth={5}/></g>;
const World: React.FC = () => <g>
  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ((i * 36 + 18 > 340 || i * 36 + 18 < 20) && i !== 0 && i !== 9) ? null : <Tree key={i} a={i * 36 + 18}/>)}
  <g transform={`translate(0 ${R + 62})`}><ellipse rx={36} ry={22} fill={C.blue} stroke={INK} strokeWidth={6}/><circle r={22} cy={-4} fill={C.skin} stroke={INK} strokeWidth={6}/><path d="M -22 -8 Q 0 -34 22 -8 Q 0 -16 -22 -8 Z" fill={INK}/></g>
</g>;
const Ball: React.FC<{x: number; y: number; o: number}> = ({x, y, o}) => <g opacity={o}><circle cx={x} cy={y} r={22} fill={C.white} stroke={INK} strokeWidth={8}/><circle cx={x - 6} cy={y - 6} r={5} fill={INK} opacity={0.3}/></g>;

const Round: React.FC<P> = ({f}) => {
  const cy = 478, cxL = 500, cxR = 1420, cw = (a: number) => a * 180 / Math.PI;
  const tNow = Math.min(f, T_ROLL), fade = 1 - ease(f, T_ROLL + 40, T_ROLL + 60), theta = OMEGA * f;
  const bw = ballWorld(tNow);
  const trail: Pt[] = [];
  for (let t = 0; t <= tNow; t += 3) { const w = ballWorld(t); trail.push(rot(w[0], w[1], OMEGA * t)); }
  const w = ballWorld(tNow), bd = rot(w[0], w[1], theta);
  const trailPath = trail.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ");
  const arc: Pt[] = [-52, -72, -92, -112, -132].map((a) => [Math.cos(a * Math.PI / 180) * (R + 36), Math.sin(a * Math.PI / 180) * (R + 36)] as Pt);
  const aim = <path d={`M 0 ${R * 0.86} L 0 ${-R * 0.86}`} stroke={INK} strokeWidth={6} strokeDasharray="4 18" strokeLinecap="round" opacity={0.75}/>;
  return <g>
    <circle cx={cxL} cy={cy} r={GR} fill="#8FD39B" stroke={INK} strokeWidth={SW}/>
    <circle cx={cxR} cy={cy} r={GR} fill="#8FD39B" stroke={INK} strokeWidth={SW}/>
    {/* left: the world view. Ground still, disc spins, ball straight */}
    <g transform={`translate(${cxL} ${cy})`}>
      <World/>
      <g transform={`rotate(${-cw(theta)})`}><Disc f={f}/></g>
      {aim}
      <Ball x={bw[0]} y={bw[1]} o={fade}/>
      <Flow pts={arc} f={f} color={C.royal} w={14} speed={2}/>
    </g>
    {/* right: the riders' view. Disc still, the world turns the other way, ball curves */}
    <g transform={`translate(${cxR} ${cy})`}>
      <g transform={`rotate(${cw(theta)})`}><World/></g>
      <Disc f={f}/>
      {aim}
      <path d={trailPath || "M 0 0"} fill="none" stroke={C.red} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round"/>
      <Ball x={bd[0]} y={bd[1]} o={fade}/>
    </g>
  </g>;
};

// ---- pot ---------------------------------------------------------------------------------------------------------------------------
const Pot: React.FC<P> = ({f, spec, at}) => {
  const l = lab(spec, 0, at), cx = 900, top = 270, bot = 720;
  const g1 = ease(f, 14, 60), g2 = ease(f, 40, 86);
  const mir = (p: Pt[]): Pt[] => p.map(([x, y]) => [2 * cx - x, y] as Pt);
  const orange: Pt[] = [[cx + 10, 655], [cx + 10, 520], [cx + 50, 410], [cx + 170, 372], [cx + 270, 410]];
  const blue: Pt[] = [[cx + 285, 455], [cx + 295, 560], [cx + 255, 650], [cx + 160, 678], [cx + 120, 678]];
  const flame = (x: number, s: number, ph: number) => <g transform={`translate(${x} 832) scale(${s * (1 + Math.sin(f / 3 + ph) * 0.08)} ${s * (1 + Math.sin(f / 2.3 + ph) * 0.14)})`}>
    <path d="M 0 0 C -50 -10 -46 -70 -6 -120 C -4 -80 20 -80 22 -110 C 62 -60 52 -10 0 0 Z" fill={C.orange} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    <path d="M 0 -6 C -22 -10 -20 -42 0 -66 C 24 -40 24 -10 0 -6 Z" fill={C.yellow}/></g>;
  return <g transform="translate(0 -62)">
    {/* stove */}
    <rect x={cx - 420} y={830} width={840} height={96} rx={20} fill={C.fridgeDark} stroke={INK} strokeWidth={SW}/>
    <rect x={cx - 380} y={810} width={760} height={30} rx={10} fill={C.ink}/>
    {[-300, -180, 180, 300].map((dx, i) => <circle key={i} cx={cx + dx} cy={878} r={22} fill={C.white} stroke={INK} strokeWidth={6}/>)}
    {flame(cx - 190, 0.95, 0)}{flame(cx, 1.15, 2)}{flame(cx + 190, 0.95, 4)}
    {/* pot body */}
    <path d={`M ${cx - 410} ${top} L ${cx + 410} ${top} L ${cx + 380} ${bot} Q ${cx + 370} ${bot + 40} ${cx + 320} ${bot + 40} L ${cx - 320} ${bot + 40} Q ${cx - 370} ${bot + 40} ${cx - 380} ${bot} Z`} fill={C.fridgeDark} stroke={INK} strokeWidth={SW} strokeLinejoin="round"/>
    {/* water */}
    <clipPath id="potclip"><path d={`M ${cx - 396} ${top + 40} L ${cx + 396} ${top + 40} L ${cx + 368} ${bot - 4} Q ${cx + 360} ${bot + 28} ${cx + 316} ${bot + 28} L ${cx - 316} ${bot + 28} Q ${cx - 360} ${bot + 28} ${cx - 368} ${bot - 4} Z`}/></clipPath>
    <g clipPath="url(#potclip)">
      <rect x={cx - 420} y={top + 30} width={840} height={480} fill="#8CC4F5"/>
      <path d={`M ${cx - 420} ${top + 40 + Math.sin(f / 9) * 4} ${Array.from({length: 9}, (_, i) => `Q ${cx - 420 + i * 105 + 52} ${top + 18 + Math.sin(f / 7 + i) * 8 + (i % 2) * 10} ${cx - 420 + (i + 1) * 105} ${top + 40}`).join(" ")} L ${cx + 420} ${bot + 60} L ${cx - 420} ${bot + 60} Z`} fill="#8CC4F5" stroke={INK} strokeWidth={6}/>
      {Array.from({length: 7}, (_, i) => { const u = (f * 0.008 + i * 0.173) % 1, bx = cx + Math.sin(i * 2.1 + u * 6) * 30 + (i % 3 - 1) * 14; return <circle key={i} cx={bx} cy={bot - u * (bot - top - 70)} r={10 + (i % 3) * 4} fill={C.white} stroke={INK} strokeWidth={4} opacity={0.9}/>; })}
      {/* bits floating round the loop: drawn as dots following the arrows */}
      <Flow pts={orange} f={f} color={C.red} w={24} speed={2.2} grow={g1}/>
      <Flow pts={blue} f={f} color={C.blue} w={24} speed={2.2} grow={g2}/>
      <Flow pts={mir(orange)} f={f} color={C.red} w={24} speed={2.2} grow={g1}/>
      <Flow pts={mir(blue)} f={f} color={C.blue} w={24} speed={2.2} grow={g2}/>
    </g>
    <path d={`M ${cx - 410} ${top} L ${cx + 410} ${top} L ${cx + 380} ${bot} Q ${cx + 370} ${bot + 40} ${cx + 320} ${bot + 40} L ${cx - 320} ${bot + 40} Q ${cx - 370} ${bot + 40} ${cx - 380} ${bot} Z`} fill="none" stroke={INK} strokeWidth={SW} strokeLinejoin="round"/>
    <rect x={cx - 440} y={top - 14} width={880} height={34} rx={17} fill={C.fridgeDark} stroke={INK} strokeWidth={SW}/>
    {[-1, 1].map((sd) => <path key={sd} d={`M ${cx + sd * 430} ${top + 40} q ${sd * 90} 0 ${sd * 90} 60 q 0 40 ${sd * -50} 40`} fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round"/>)}
    {/* steam */}
    {[0, 1, 2].map((i) => { const u = (f * 0.011 + i / 3) % 1; return <path key={i} d={`M ${cx - 200 + i * 200} ${top - 30 - u * 90} q 18 -22 0 -44 q -18 -22 0 -44`} fill="none" stroke={C.white} strokeWidth={9} strokeLinecap="round" opacity={(1 - u) * 0.9}/>; })}
    <Actor who="girl" x={250} y={880} h={470} f={f} pose="point" seed={8}/>
    {l && <Pill text={l.text} f={f} at={l.at} cx={1580} cy={500} size={56} maxW={460}/>}
  </g>;
};

export const B: Record<string, React.FC<P>> = {breeze: Breeze, roundabout: Round, pot: Pot};
void Person;
