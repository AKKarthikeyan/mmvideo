// The seven sets of the long-form stage scene: full-frame 1920 x 1080 flat SVG backgrounds in the pilot's look (flat fills from C, 8 px ink outline, no
// gradients, no photos, no digits anywhere on the art). Every set moves a little by itself (curtains, clouds, a passing auto, a flickering tube light...), driven only
// by the frame number f, so a still at any frame is clean. Art bleeds 110 px past the frame so the camera drift never shows an edge.
// API (fixed): <Set set f/> with set one of home, school, street, clinic, village, city, void (+ rooftop, beach, himalaya, UPSC film). FLOOR[set] is the y where the back wall meets the ground: stand
// actors on y values from FLOOR + 60 down to about 960.
import React from "react";
import {random} from "remotion";
import {C} from "../palette";
import {H, W} from "./contract";
import {GlobeIntro, NewSet, TimeCover} from "./sets_upsc";
export {GlobeIntro, Lightning, Rain} from "./sets_upsc";

export type SetName = "home" | "school" | "street" | "clinic" | "village" | "city" | "void" | "rooftop" | "beach" | "himalaya";
export const SET_NAMES: SetName[] = ["home", "school", "street", "clinic", "village", "city", "void", "rooftop", "beach", "himalaya"];
export const FLOOR: Record<SetName, number> = {home: 720, school: 720, street: 712, clinic: 720, village: 700, city: 712, void: 740, rooftop: 716, beach: 680, himalaya: 806};

const B = 110;                  // bleed
const INK = C.ink;
const TAU = Math.PI * 2;
const osc = (f: number, period: number, ph = 0) => Math.sin((f / period + ph) * TAU);
const mod = (v: number, m: number) => ((v % m) + m) % m;
const hx = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
const mix = (a: string, b: string, k: number) => { const A = hx(a), Z = hx(b); return "#" + A.map((v, i) => Math.round(v + (Z[i] - v) * k).toString(16).padStart(2, "0")).join(""); };
const pale = (c: string, k = 0.5) => mix(c, "#FFFFFF", k);
const deep = (c: string, k = 0.25) => mix(c, "#17203A", k);
const pts = (p: [number, number][]) => p.map((q) => q.join(",")).join(" ");
// A flicker factor: mostly 1, now and then a short dip.
const flick = (f: number, seed = 1) => { const k = Math.floor(f / 3); return random(`fl${seed}-${k}`) > 0.9 ? 0.4 : random(`fm${seed}-${k}`) > 0.78 ? 0.78 : 1; };

const Cloud: React.FC<{x: number; y: number; s?: number; fill?: string}> = ({x, y, s = 1, fill = C.white}) =>
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -120 0 C -150 0 -150 -46 -108 -48 C -108 -90 -50 -104 -22 -76 C 0 -118 70 -108 74 -62 C 120 -66 138 -6 96 0 Z" fill={fill} stroke={INK} strokeWidth={6 / s} strokeLinejoin="round"/>
  </g>;
// clouds drifting right, wrapping around: list of [x0, y, scale, speed px/frame]
const Clouds: React.FC<{f: number; list: [number, number, number, number][]; span?: number}> = ({f, list, span = W + 560}) =>
  <>{list.map(([x0, y, s, v], i) => <Cloud key={i} x={mod(x0 + f * v, span) - 280} y={y} s={s}/>)}</>;

const Sun: React.FC<{x: number; y: number; r: number; f: number}> = ({x, y, r, f}) => <g transform={`translate(${x} ${y})`}>
  <g transform={`rotate(${f * 0.4})`}>{Array.from({length: 12}, (_, i) => <line key={i} x1={r + 16} y1={0} x2={r + (i % 2 ? 40 : 58)} y2={0} stroke={INK} strokeWidth={8} strokeLinecap="round" transform={`rotate(${i * 30})`}/>)}</g>
  <circle r={r} fill={C.yellow} stroke={INK} strokeWidth={8}/>
</g>;

const Bird: React.FC<{x: number; y: number; f: number; ph?: number; s?: number}> = ({x, y, f, ph = 0, s = 1}) => {
  const fl = Math.sin(f * 0.45 + ph);
  return <path d={`M ${-26 * s} ${-4 * s} Q ${-13 * s} ${-26 * s * fl} 0 0 Q ${13 * s} ${-26 * s * fl} ${26 * s} ${-4 * s}`} transform={`translate(${x} ${y})`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"/>;
};

// A round tree crown made of overlapping circles (ink rim drawn first, fills on top, so the outline is clean), swaying about its trunk top.
const Crown: React.FC<{x: number; y: number; r: number; f: number; fill: string; ph?: number; amp?: number}> = ({x, y, r, f, fill, ph = 0, amp = 1.6}) => {
  const blobs: [number, number, number][] = [[0, 0, 1], [-0.8, 0.28, 0.72], [0.8, 0.26, 0.74], [-0.42, -0.5, 0.62], [0.46, -0.52, 0.64]];
  return <g transform={`translate(${x} ${y}) rotate(${osc(f, 120, ph) * amp} 0 ${r * 1.2})`}>
    {blobs.map(([dx, dy, k], i) => <circle key={`a${i}`} cx={dx * r} cy={dy * r} r={r * k + 5} fill={INK}/>)}
    {blobs.map(([dx, dy, k], i) => <circle key={`b${i}`} cx={dx * r} cy={dy * r} r={r * k} fill={fill}/>)}
    {blobs.map(([dx, dy, k], i) => i % 2 === 0 && <circle key={`c${i}`} cx={dx * r - r * 0.16} cy={dy * r - r * 0.2} r={r * k * 0.5} fill={pale(fill, 0.22)}/>)}
  </g>;
};

const Floor: React.FC<{y: number; fill: string; line: string; edge: string; grid?: boolean}> = ({y, fill, line, edge, grid}) => <g>
  <rect x={-B} y={y} width={W + 2 * B} height={H - y + B} fill={fill}/>
  {Array.from({length: 14}, (_, i) => { const x1 = i * 170 - 170; return <line key={i} x1={x1} y1={y} x2={960 + (x1 - 960) * 1.9} y2={H + B} stroke={line} strokeWidth={6}/>; })}
  {grid && [60, 150, 270].map((d) => <line key={d} x1={-B} y1={y + d} x2={W + B} y2={y + d} stroke={line} strokeWidth={6}/>)}
  <rect x={-B} y={y - 14} width={W + 2 * B} height={22} fill={edge} stroke={INK} strokeWidth={5}/>
</g>;

const Curtain: React.FC<{x: number; y: number; w: number; h: number; f: number; fill: string; dark: string; mirrorAt?: number; ph?: number}> = ({x, y, w, h, f, fill, dark, mirrorAt, ph = 0}) => {
  const N = 9, sway = (t: number) => osc(f, 90, ph + t * 0.3) * 15 * t;
  const inner = Array.from({length: N + 1}, (_, i) => { const t = i / N; return [x + w + sway(t), y + h * t] as [number, number]; });
  const d = `M ${x} ${y} L ${x + w} ${y} ` + inner.slice(1).map(([px, py]) => `L ${px} ${py}`).join(" ") + ` L ${x} ${y + h} Z`;
  const fold = (k: number) => `M ${x + w * k} ${y} ` + inner.slice(1).map(([, py], i) => `L ${x + w * k + sway((i + 1) / N) * k} ${py}`).join(" ");
  const body = <g><path d={d} fill={fill} stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
    <path d={fold(0.36)} fill="none" stroke={dark} strokeWidth={6} strokeLinecap="round"/><path d={fold(0.7)} fill="none" stroke={dark} strokeWidth={6} strokeLinecap="round"/></g>;
  return mirrorAt === undefined ? body : <g transform={`translate(${2 * mirrorAt} 0) scale(-1 1)`}>{body}</g>;
};

// A pot plant: leaves swaying about the pot mouth.
const Plant: React.FC<{x: number; y: number; s: number; f: number; pot: string; leaf?: string; ph?: number}> = ({x, y, s, f, pot, leaf = C.green, ph = 0}) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  {[-52, -26, 0, 26, 52].map((a, i) => <path key={i} d="M 0 0 Q -34 -64 0 -140 Q 34 -64 0 0 Z" fill={i % 2 ? leaf : mix(leaf, C.lime, 0.35)} stroke={INK} strokeWidth={6 / s} strokeLinejoin="round"
    transform={`rotate(${a + osc(f, 100, ph + i * 0.15) * 3.5}) scale(1 ${0.8 + (i % 3) * 0.12})`}/>)}
  <path d="M -42 0 L 42 0 L 32 80 L -32 80 Z" fill={pot} stroke={INK} strokeWidth={8 / s} strokeLinejoin="round"/>
  <rect x={-48} y={-10} width={96} height={20} rx={8} fill={deep(pot, 0.12)} stroke={INK} strokeWidth={6 / s}/>
</g>;

const Clock: React.FC<{x: number; y: number; r: number; f: number}> = ({x, y, r, f}) => <g transform={`translate(${x} ${y})`}>
  <circle r={r} fill={C.white} stroke={INK} strokeWidth={8}/>
  {Array.from({length: 12}, (_, i) => <line key={i} x1={0} y1={-r * (i % 3 ? 0.74 : 0.66)} x2={0} y2={-r * 0.82} stroke={INK} strokeWidth={i % 3 ? 4 : 6} strokeLinecap="round" transform={`rotate(${i * 30})`}/>)}
  <line x1={0} y1={0} x2={0} y2={-r * 0.5} stroke={INK} strokeWidth={8} strokeLinecap="round" transform={`rotate(${f * 0.05 + 200})`}/>
  <line x1={0} y1={0} x2={0} y2={-r * 0.72} stroke={INK} strokeWidth={6} strokeLinecap="round" transform={`rotate(${f * 0.6 + 40})`}/>
  <line x1={0} y1={14} x2={0} y2={-r * 0.74} stroke={C.red} strokeWidth={4} strokeLinecap="round" transform={`rotate(${Math.floor(f / 3) * 12})`}/>
  <circle r={7} fill={C.red} stroke={INK} strokeWidth={4}/>
</g>;

const Fan: React.FC<{x: number; y: number; f: number; len?: number}> = ({x, y, f, len = 230}) => {
  const blades = [0, 1, 2].map((k) => { const a = f * 0.5 + (k * TAU) / 3; return {dx: Math.cos(a) * len, dz: Math.sin(a), k}; }).sort((a, b) => a.dz - b.dz);
  return <g>
    <line x1={x} y1={-B} x2={x} y2={y - 14} stroke={INK} strokeWidth={10}/>
    <ellipse cx={x} cy={y + 2} rx={len} ry={16} fill={C.white} opacity={0.16}/>
    {blades.map((b) => <g key={b.k}><line x1={x} y1={y} x2={x + b.dx} y2={y + b.dz * 12} stroke={INK} strokeWidth={30} strokeLinecap="round"/>
      <line x1={x} y1={y} x2={x + b.dx} y2={y + b.dz * 12} stroke={b.dz > 0 ? C.cream : C.floor} strokeWidth={15} strokeLinecap="round"/></g>)}
    <ellipse cx={x} cy={y} rx={34} ry={22} fill={C.orange} stroke={INK} strokeWidth={8}/>
  </g>;
};

const Desk: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  <rect x={-108} y={4} width={16} height={104} rx={5} fill={C.floorDark} stroke={INK} strokeWidth={7}/><rect x={92} y={4} width={16} height={104} rx={5} fill={C.floorDark} stroke={INK} strokeWidth={7}/>
  <rect x={-100} y={52} width={200} height={14} rx={5} fill={C.floorDark} stroke={INK} strokeWidth={6}/>
  <rect x={-136} y={-16} width={272} height={30} rx={10} fill="#D9A566" stroke={INK} strokeWidth={8}/>
  <rect x={-90} y={-62} width={86} height={46} rx={5} fill={C.red} stroke={INK} strokeWidth={6}/><rect x={-82} y={-52} width={70} height={10} fill={C.white} opacity={0.7}/>
  <rect x={-84} y={-100} width={74} height={38} rx={5} fill={C.blue} stroke={INK} strokeWidth={6}/>
  <rect x={30} y={-46} width={72} height={30} rx={8} fill={C.yellow} stroke={INK} strokeWidth={6}/>
</g>;

// ---- home -----------------------------------------------------------------------------------------------------------------
const Home: React.FC<{f: number}> = ({f}) => {
  const lamp = flick(f, 2);
  const gx = 258 - 130 + mod(f * 0.6 + 150, 324 + 260);
  return <g>
    <rect x={-B} y={-B} width={W + 2 * B} height={720 + B} fill={C.wall}/>
    {Array.from({length: 17}, (_, i) => <rect key={i} x={i * 130 - 60} y={-B} width={44} height={540 + B} fill={C.wallLow} opacity={0.28}/>)}
    <rect x={-B} y={540} width={W + 2 * B} height={190} fill={C.wallLow}/>
    <rect x={-B} y={528} width={W + 2 * B} height={20} fill={C.cream} stroke={INK} strokeWidth={5}/>
    <Floor y={720} fill={C.floor} line={C.floorDark} edge={C.floorDark}/>
    {/* window */}
    <rect x={236} y={116} width={368} height={368} rx={18} fill={C.white} stroke={INK} strokeWidth={8}/>
    <clipPath id="home-glass"><rect x={258} y={138} width={324} height={324} rx={6}/></clipPath>
    <g clipPath="url(#home-glass)">
      <rect x={258} y={138} width={324} height={324} fill={C.sky}/>
      <circle cx={512} cy={214} r={34} fill={C.yellow} stroke={INK} strokeWidth={6}/>
      <Cloud x={gx} y={250} s={0.55}/>
      <path d="M 258 410 Q 330 340 410 392 T 582 380 L 582 462 L 258 462 Z" fill={pale(C.green, 0.15)} stroke={INK} strokeWidth={6}/>
      <path d="M 420 138 V 462 M 258 300 H 582" stroke={INK} strokeWidth={8}/>
      <path d="M 292 138 L 352 138 L 276 262 L 258 262 L 258 196 Z" fill={C.white} opacity={0.38}/>
    </g>
    <rect x={216} y={482} width={408} height={26} rx={9} fill={C.cream} stroke={INK} strokeWidth={8}/>
    <Plant x={528} y={470} s={0.46} f={f} pot={C.orange} ph={0.2}/>
    <line x1={140} y1={100} x2={700} y2={100} stroke={INK} strokeWidth={10} strokeLinecap="round"/>
    <circle cx={140} cy={100} r={13} fill={C.gold} stroke={INK} strokeWidth={6}/><circle cx={700} cy={100} r={13} fill={C.gold} stroke={INK} strokeWidth={6}/>
    <Curtain x={168} y={112} w={136} h={372} f={f} fill={C.red} dark={C.redDark}/>
    <Curtain x={168} y={112} w={136} h={372} f={f} fill={C.red} dark={C.redDark} mirrorAt={420} ph={0.35}/>
    {/* clock */}
    <Clock x={960} y={176} r={76} f={f}/>
    {/* pictures */}
    <g>
      <rect x={1386} y={140} width={224} height={170} rx={8} fill={C.cream} stroke={INK} strokeWidth={8}/>
      <clipPath id="home-pic"><rect x={1404} y={158} width={188} height={134}/></clipPath>
      <g clipPath="url(#home-pic)"><rect x={1404} y={158} width={188} height={134} fill={C.sky}/><circle cx={1540} cy={196} r={20} fill={C.yellow}/>
        <path d="M 1404 280 Q 1450 214 1500 262 T 1592 240 L 1592 292 L 1404 292 Z" fill={C.green}/></g>
      <rect x={1650} y={134} width={140} height={190} rx={8} fill={C.cream} stroke={INK} strokeWidth={8}/>
      <path d="M 1720 270 C 1670 232 1676 190 1704 188 C 1716 188 1720 198 1720 204 C 1720 198 1724 188 1736 188 C 1764 190 1770 232 1720 270 Z" fill={C.red} stroke={INK} strokeWidth={6} strokeLinejoin="round" transform={`translate(1720 230) scale(${1 + Math.max(0, osc(f, 40)) * 0.06}) translate(-1720 -230)`}/>
    </g>
    {/* sofa */}
    <ellipse cx={1620} cy={734} rx={300} ry={20} fill={C.shadow}/>
    <rect x={1392} y={466} width={456} height={214} rx={46} fill={C.royal} stroke={INK} strokeWidth={8}/>
    <rect x={1402} y={596} width={436} height={104} rx={28} fill={C.blue} stroke={INK} strokeWidth={8}/>
    <rect x={1462} y={512} width={124} height={112} rx={28} fill={C.yellow} stroke={INK} strokeWidth={8} transform="rotate(-8 1524 568)"/>
    <rect x={1690} y={520} width={116} height={106} rx={28} fill={C.orange} stroke={INK} strokeWidth={8} transform="rotate(9 1748 573)"/>
    <rect x={1354} y={538} width={88} height={176} rx={38} fill={C.royal} stroke={INK} strokeWidth={8}/>
    <rect x={1800} y={538} width={88} height={176} rx={38} fill={C.royal} stroke={INK} strokeWidth={8}/>
    <rect x={1372} y={704} width={32} height={22} rx={6} fill={C.floorDark} stroke={INK} strokeWidth={6}/><rect x={1840} y={704} width={32} height={22} rx={6} fill={C.floorDark} stroke={INK} strokeWidth={6}/>
    {/* side table and lamp */}
    <g>
      <ellipse cx={116} cy={738} rx={110} ry={14} fill={C.shadow}/>
      <circle cx={116} cy={548} r={118} fill={C.yellow} opacity={0.22 * lamp}/>
      <rect x={30} y={640} width={172} height={22} rx={8} fill={C.floor} stroke={INK} strokeWidth={8}/>
      <rect x={44} y={660} width={16} height={64} fill={C.floorDark} stroke={INK} strokeWidth={6}/><rect x={172} y={660} width={16} height={64} fill={C.floorDark} stroke={INK} strokeWidth={6}/>
      <rect x={106} y={590} width={20} height={50} fill={C.floorDark} stroke={INK} strokeWidth={6}/>
      <path d="M 66 592 L 166 592 L 144 510 L 88 510 Z" fill={lamp > 0.9 ? C.yellow : C.cream} stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
    </g>
    <Plant x={760} y={636} s={0.9} f={f} pot={C.orange} leaf={C.greenDark}/>
    {/* rug */}
    <ellipse cx={960} cy={906} rx={600} ry={116} fill={C.orange} stroke={INK} strokeWidth={8}/>
    <ellipse cx={960} cy={906} rx={540} ry={98} fill={C.cream}/>
    <ellipse cx={960} cy={906} rx={470} ry={80} fill="none" stroke={C.orange} strokeWidth={8} strokeDasharray="26 22"/>
  </g>;
};

// ---- school ---------------------------------------------------------------------------------------------------------------
const School: React.FC<{f: number}> = ({f}) => {
  const dust = Array.from({length: 7}, (_, i) => ({x: 420 + i * 100 + osc(f, 160, i * 0.31) * 18, y: 440 - mod(f * 0.45 + i * 61, 300) * 1, o: 0.55}));
  return <g>
    <rect x={-B} y={-B} width={W + 2 * B} height={720 + B} fill="#FBEFD0"/>
    <rect x={-B} y={500} width={W + 2 * B} height={230} fill={C.sky}/>
    <rect x={-B} y={490} width={W + 2 * B} height={20} fill={C.white} stroke={INK} strokeWidth={5}/>
    <Floor y={720} fill="#D9A566" line="#BE8A4F" edge={C.floorDark}/>
    {/* blackboard */}
    <rect x={340} y={104} width={800} height={352} rx={12} fill="#C88F52" stroke={INK} strokeWidth={8}/>
    <rect x={366} y={130} width={748} height={300} rx={4} fill="#2E6F5E" stroke={INK} strokeWidth={5}/>
    <rect x={366} y={130} width={748} height={300} rx={4} fill={C.white} opacity={0.05}/>
    <rect x={350} y={456} width={780} height={22} rx={7} fill={C.floorDark} stroke={INK} strokeWidth={6}/>
    <rect x={400} y={444} width={44} height={12} rx={4} fill={C.white} stroke={INK} strokeWidth={3}/><rect x={466} y={446} width={34} height={10} rx={4} fill={C.yellow} stroke={INK} strokeWidth={3}/>
    <g fill="none" stroke={C.white} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={0.88}>
      <text x={398} y={262} fill={C.white} stroke="none" fontFamily="'LK Bricolage', Arial, sans-serif" fontWeight={800} fontSize={120}>ABC</text>
      <path d="M 398 288 Q 500 308 612 284"/>
      <path d="M 680 330 L 680 250 L 760 250 L 760 330 Z M 668 252 L 720 204 L 772 252"/><rect x={704} y={290} width={22} height={40}/>
      <circle cx={900} cy={220} r={30} />
      <g transform={`translate(900 220) rotate(${f * 0.5})`}>{Array.from({length: 8}, (_, i) => <line key={i} x1={46} y1={0} x2={64} y2={0} transform={`rotate(${i * 45})`}/>)}</g>
      <path d="M 790 390 Q 840 360 890 390 T 990 390 T 1090 390"/>
    </g>
    {dust.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={3 + (i % 3)} fill={C.white} opacity={d.o * Math.min(1, (440 - d.y) / 40)}/>)}
    {/* clock */}
    <Clock x={1226} y={196} r={60} f={f}/>
    {/* window and sunbeams */}
    <rect x={1318} y={112} width={316} height={316} rx={14} fill={C.white} stroke={INK} strokeWidth={8}/>
    <clipPath id="school-glass"><rect x={1338} y={132} width={276} height={276} rx={4}/></clipPath>
    <g clipPath="url(#school-glass)"><rect x={1338} y={132} width={276} height={276} fill={C.sky}/><Cloud x={1338 - 120 + mod(f * 0.7 + 90, 276 + 240)} y={230} s={0.5}/>
      <path d="M 1338 380 Q 1400 316 1470 362 T 1614 350 L 1614 408 L 1338 408 Z" fill={pale(C.green, 0.15)} stroke={INK} strokeWidth={6}/>
      <path d="M 1476 132 V 408 M 1338 270 H 1614" stroke={INK} strokeWidth={8}/></g>
    <rect x={1300} y={426} width={352} height={22} rx={8} fill={C.cream} stroke={INK} strokeWidth={8}/>
    <polygon points={pts([[1338, 448], [1520, 448], [1130 + osc(f, 220) * 24, 760], [880 + osc(f, 220) * 24, 760]])} fill={C.yellow} opacity={0.12}/>
    <polygon points={pts([[1540, 448], [1612, 448], [1330 + osc(f, 260, 0.3) * 24, 760], [1180 + osc(f, 260, 0.3) * 24, 760]])} fill={C.yellow} opacity={0.1}/>
    {/* cupboard */}
    <rect x={1712} y={236} width={260} height={492} rx={10} fill="#C88F52" stroke={INK} strokeWidth={8}/>
    {[0, 1, 2].map((r) => <g key={r}><rect x={1730} y={256 + r * 154} width={224} height={130} fill={deep("#C88F52", 0.18)} stroke={INK} strokeWidth={5}/>
      {Array.from({length: 6}, (_, i) => <rect key={i} x={1738 + i * 36} y={274 + r * 154 + (i % 2) * 8} width={30} height={112 - (i % 2) * 8} rx={3} fill={[C.red, C.blue, C.green, C.yellow, C.orange, C.royal][(i + r * 2) % 6]} stroke={INK} strokeWidth={4}/>)}</g>)}
    <Desk x={150} y={628} s={1}/><Desk x={420} y={606} s={0.84}/><Desk x={1530} y={642} s={1.04}/>
    <Fan x={760} y={74} f={f}/>
  </g>;
};

// ---- street ---------------------------------------------------------------------------------------------------------------
const PACKETS = [C.red, C.blue, C.orange, C.green, C.yellow, "#8E5BD9"];
const Shopfront: React.FC<{x: number; w: number; base: number; stripe: string; seed: number}> = ({x, w, base, stripe, seed}) => {
  const n = Math.max(3, Math.round((w - 60) / 46)), aw = (w - 40) / n;
  return <g>
    <rect x={x + 26} y={base - 74} width={w - 52} height={74} fill="#2A3355" stroke={INK} strokeWidth={6}/>
    {[0, 1].map((r) => <g key={r}><rect x={x + 34} y={base - 52 + r * 30} width={w - 68} height={6} fill={C.floorDark}/>
      {Array.from({length: Math.floor((w - 80) / 26)}, (_, i) => <rect key={i} x={x + 40 + i * 26} y={base - 76 + r * 30 + 2} width={16} height={22 - (i % 3) * 3} rx={3} fill={PACKETS[(i + seed + r) % 6]}/>)}</g>)}
    {Array.from({length: n}, (_, i) => { const a = x + 20 + aw * i, b = a + aw; return <polygon key={i} points={pts([[a, base - 118], [b, base - 118], [b + 4, base - 78], [a - 4, base - 78]])} fill={i % 2 ? C.white : stripe} stroke={INK} strokeWidth={5} strokeLinejoin="round"/>; })}
  </g>;
};
const Building: React.FC<{x: number; w: number; top: number; base: number; fill: string; seed: number; sign?: string}> = ({x, w, top, base, fill, seed, sign}) => {
  const cols = Math.max(2, Math.floor((w - 40) / 96)), pitch = (w - 40) / cols, rows = Math.max(1, Math.floor((base - 150 - top - 30) / 104));
  return <g>
    <rect x={x} y={top} width={w} height={base - top} fill={fill} stroke={INK} strokeWidth={8}/>
    <rect x={x - 8} y={top - 16} width={w + 16} height={26} rx={6} fill={deep(fill, 0.14)} stroke={INK} strokeWidth={8}/>
    {Array.from({length: rows}, (_, r) => Array.from({length: cols}, (_, c) => { const wx = x + 20 + c * pitch + 14, wy = top + 36 + r * 104;
      return <g key={`${r}-${c}`}><rect x={wx} y={wy} width={pitch - 28} height={70} rx={6} fill={C.sky2} stroke={INK} strokeWidth={6}/>
        <line x1={wx + (pitch - 28) / 2} y1={wy} x2={wx + (pitch - 28) / 2} y2={wy + 70} stroke={INK} strokeWidth={5}/>
        <rect x={wx - 10} y={wy + 70} width={pitch - 8} height={10} rx={4} fill={deep(fill, 0.25)} stroke={INK} strokeWidth={4}/>
        {(r + c + seed) % 4 === 0 && <rect x={wx + 6} y={wy + 6} width={pitch - 40} height={20} fill={C.white} opacity={0.5}/>}</g>; }))}
    {sign && <g><rect x={x + 40} y={base - 176} width={w - 80} height={46} rx={8} fill={C.white} stroke={INK} strokeWidth={6}/>
      <text x={x + w / 2} y={base - 141} textAnchor="middle" fontFamily="'LK Schibsted', Arial, sans-serif" fontWeight={900} fontSize={34} letterSpacing={6} fill={C.redDark}>{sign}</text></g>}
    <Shopfront x={x} w={w} base={base} stripe={seed % 2 ? C.red : C.green} seed={seed}/>
  </g>;
};
const Wheel: React.FC<{cx: number; cy: number; r: number; rot: number}> = ({cx, cy, r, rot}) => <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
  <circle r={r} fill={INK}/><circle r={r * 0.46} fill={C.white} stroke={INK} strokeWidth={4}/>
  <line x1={-r * 0.46} y1={0} x2={r * 0.46} y2={0} stroke={INK} strokeWidth={4}/><line x1={0} y1={-r * 0.46} x2={0} y2={r * 0.46} stroke={INK} strokeWidth={4}/></g>;
const Auto: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => <g transform={`translate(${x} ${y + Math.sin(f * 1.9) * 2.2})`}>
  <ellipse cx={20} cy={4} rx={158} ry={9} fill={C.shadow}/>
  <Wheel cx={-86} cy={-30} r={30} rot={f * 22}/><Wheel cx={112} cy={-30} r={30} rot={f * 22}/>
  <path d="M -152 -44 L -152 -118 L 72 -118 Q 122 -108 142 -62 L 142 -44 Z" fill={C.yellow} stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
  <rect x={-150} y={-196} width={214} height={80} fill="#2A3355"/>
  <rect x={-136} y={-160} width={96} height={44} rx={10} fill={C.orange} stroke={INK} strokeWidth={6}/>
  <circle cx={26} cy={-164} r={21} fill={C.skin} stroke={INK} strokeWidth={6}/><circle cx={34} cy={-166} r={4} fill={INK}/>
  <rect x={4} y={-146} width={46} height={32} rx={10} fill={C.royal} stroke={INK} strokeWidth={6}/>
  <path d="M -160 -112 L -152 -198 Q -150 -214 -130 -214 L 38 -214 Q 58 -214 64 -198 L 74 -112 Z" fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
  <path d="M -158 -196 Q -150 -224 -128 -224 L 40 -224 Q 62 -224 70 -198 L 72 -190 L -158 -190 Z" fill={C.green} stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
  <path d="M 68 -196 L 84 -118 L 132 -110 Q 118 -164 88 -196 Z" fill={C.sky} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
  <path d="M 92 -64 Q 138 -62 152 -60 L 152 -44 L 92 -44 Z" fill={C.yellow} stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
  <circle cx={144} cy={-76} r={9} fill={C.white} stroke={INK} strokeWidth={5}/>
</g>;
const Street: React.FC<{f: number}> = ({f}) => {
  const ax = mod(f * 6.4 + 560, 3000) - 560;
  const bld: [number, number, number, string, string?][] = [[-120, 340, 200, pale(C.orange, 0.45)], [220, 300, 280, pale(C.yellow, 0.35)], [520, 400, 180, pale(C.blue, 0.5), "KIRANA"], [920, 300, 260, pale(C.red, 0.55)], [1220, 380, 210, pale(C.green, 0.5)], [1600, 280, 280, pale(C.orange, 0.5)], [1880, 240, 230, pale(C.blue, 0.45)]];
  return <g>
    <rect x={-B} y={-B} width={W + 2 * B} height={600 + B} fill={C.sky}/>
    <Sun x={1500} y={168} r={52} f={f}/>
    <Clouds f={f} list={[[100, 150, 0.9, 0.25], [820, 110, 0.7, 0.18], [1500, 250, 0.8, 0.3]]}/>
    {bld.map(([x, w, top, fill, sign], i) => <Building key={i} x={x} w={w} top={top} base={570} fill={fill} seed={i + 1} sign={sign}/>)}
    {[0, 1, 2].map((i) => <Bird key={i} x={mod(f * 2.2 + i * 260 + 200, W + 300) - 150} y={120 + i * 46 + Math.sin(f / 22 + i) * 12} f={f} ph={i * 1.4} s={0.9}/>)}
    {/* road */}
    <rect x={-B} y={570} width={W + 2 * B} height={134} fill="#5A6483" stroke={INK} strokeWidth={8}/>
    {Array.from({length: 14}, (_, i) => <rect key={i} x={i * 160 - 40} y={632} width={90} height={10} rx={4} fill={C.white} opacity={0.85}/>)}
    <Auto x={ax} y={690} f={f}/>
    {/* pavement */}
    <rect x={-B} y={700} width={W + 2 * B} height={24} fill={C.white} stroke={INK} strokeWidth={6}/>
    <rect x={-B} y={724} width={W + 2 * B} height={H - 724 + B} fill="#E6DCC6"/>
    {Array.from({length: 14}, (_, i) => { const x1 = i * 170 - 170; return <line key={i} x1={x1} y1={724} x2={960 + (x1 - 960) * 2} y2={H + B} stroke="#CDBF9F" strokeWidth={6}/>; })}
    {[800, 900, 1010].map((y) => <line key={y} x1={-B} y1={y} x2={W + B} y2={y} stroke="#CDBF9F" strokeWidth={6}/>)}
    {/* lamp post and tree */}
    <rect x={1372} y={420} width={16} height={290} fill={INK}/><rect x={1344} y={404} width={72} height={26} rx={12} fill={C.gold} stroke={INK} strokeWidth={7}/>
    <rect x={84} y={430} width={46} height={290} rx={8} fill={C.brown} stroke={INK} strokeWidth={8}/>
    <Crown x={108} y={350} r={132} f={f} fill={pale(C.green, 0.05)}/>
  </g>;
};

// ---- clinic ---------------------------------------------------------------------------------------------------------------
const ecg = (p: number) => {
  if (p < 0.1) return -Math.sin((p / 0.1) * Math.PI) * 8;
  if (p > 0.22 && p < 0.26) return ((p - 0.22) / 0.04) * 14;
  if (p >= 0.26 && p < 0.3) return 14 - ((p - 0.26) / 0.04) * 74;
  if (p >= 0.3 && p < 0.34) return -60 + ((p - 0.3) / 0.04) * 80;
  if (p >= 0.34 && p < 0.36) return 20 - ((p - 0.34) / 0.02) * 20;
  if (p > 0.5 && p < 0.7) return -Math.sin(((p - 0.5) / 0.2) * Math.PI) * 14;
  return 0;
};
const Clinic: React.FC<{f: number}> = ({f}) => {
  const tube = flick(f, 5), pulse = 1 + Math.max(0, Math.sin((f / 48) * TAU)) * 0.06;
  const line: string[] = []; for (let i = 0; i <= 52; i++) { const x = i * 4; line.push(`${i ? "L" : "M"} ${x} ${ecg(mod((x + f * 3) / 132, 1))}`); }
  return <g>
    <rect x={-B} y={-B} width={W + 2 * B} height={720 + B} fill="#EAF7F4"/>
    <rect x={-B} y={480} width={W + 2 * B} height={250} fill="#8FD3C5"/>
    <rect x={-B} y={468} width={W + 2 * B} height={20} fill={C.white} stroke={INK} strokeWidth={5}/>
    <Floor y={720} fill="#D3E3EE" line="#B3C9DB" edge="#A9BFD2" grid/>
    {/* tube light */}
    <polygon points={pts([[700, 40], [1220, 40], [1380, 720], [540, 720]])} fill={C.white} opacity={0.2 * tube}/>
    <rect x={700} y={8} width={520} height={34} rx={12} fill={tube > 0.9 ? C.white : "#C9D6E3"} stroke={INK} strokeWidth={8}/>
    {/* big cross sign */}
    <g transform={`translate(960 238) scale(${pulse})`}>
      <rect x={-96} y={-96} width={192} height={192} rx={34} fill={C.white} stroke={INK} strokeWidth={8}/>
      <path d="M -26 -70 H 26 V -26 H 70 V 26 H 26 V 70 H -26 V 26 H -70 V -26 H -26 Z" fill={C.green} stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
    </g>
    {/* window with blinds */}
    <rect x={200} y={112} width={344} height={324} rx={14} fill={C.white} stroke={INK} strokeWidth={8}/>
    <clipPath id="clinic-glass"><rect x={220} y={132} width={304} height={284} rx={4}/></clipPath>
    <g clipPath="url(#clinic-glass)"><rect x={220} y={132} width={304} height={284} fill={C.sky}/><Cloud x={220 - 120 + mod(f * 0.6 + 40, 304 + 240)} y={250} s={0.55}/>
      {Array.from({length: 6}, (_, i) => <rect key={i} x={214} y={132 + i * 30 + Math.sin(f / 50 + i * 0.4) * 1.5} width={316} height={22} rx={5} fill="#F3DFA2" stroke={INK} strokeWidth={4}/>)}
      <line x1={496} y1={132} x2={496} y2={352 + Math.sin(f / 40) * 3} stroke={INK} strokeWidth={4}/><circle cx={496} cy={358 + Math.sin(f / 40) * 3} r={9} fill={C.gold} stroke={INK} strokeWidth={4}/></g>
    <rect x={186} y={434} width={372} height={22} rx={8} fill={C.cream} stroke={INK} strokeWidth={8}/>
    {/* poster */}
    <rect x={1100} y={142} width={160} height={210} rx={10} fill={C.white} stroke={INK} strokeWidth={8}/>
    <path d="M 1180 268 C 1126 228 1134 184 1166 182 C 1176 182 1180 192 1180 198 C 1180 192 1186 182 1196 182 C 1228 184 1234 228 1180 268 Z" fill={C.red} stroke={INK} strokeWidth={6} strokeLinejoin="round" transform={`translate(1180 226) scale(${pulse}) translate(-1180 -226)`}/>
    {[290, 316, 336].map((y, i) => <rect key={y} x={1122} y={y} width={i === 2 ? 70 : 116} height={10} rx={5} fill="#B3C9DB"/>)}
    {/* bed */}
    <ellipse cx={1600} cy={740} rx={290} ry={18} fill={C.shadow}/>
    <rect x={1330} y={600} width={500} height={110} rx={14} fill={C.white} stroke={INK} strokeWidth={8}/>
    <rect x={1330} y={540} width={500} height={80} rx={26} fill="#BFD9F5" stroke={INK} strokeWidth={8}/>
    <rect x={1348} y={500} width={140} height={60} rx={26} fill={C.white} stroke={INK} strokeWidth={8}/>
    <rect x={1820} y={470} width={30} height={240} rx={12} fill="#8FD3C5" stroke={INK} strokeWidth={8}/>
    {[1380, 1790].map((x) => <g key={x}><rect x={x - 8} y={706} width={16} height={22} fill={INK}/><circle cx={x} cy={734} r={14} fill={INK}/></g>)}
    {/* monitor cart */}
    <ellipse cx={170} cy={744} rx={120} ry={14} fill={C.shadow}/>
    <rect x={160} y={560} width={20} height={160} fill="#8D97AB" stroke={INK} strokeWidth={6}/>
    <rect x={64} y={706} width={212} height={16} rx={7} fill="#8D97AB" stroke={INK} strokeWidth={6}/>
    {[88, 252].map((x) => <circle key={x} cx={x} cy={734} r={13} fill={INK}/>)}
    <rect x={50} y={470} width={240} height={150} rx={16} fill="#E1E8F0" stroke={INK} strokeWidth={8}/>
    <rect x={68} y={488} width={204} height={112} rx={8} fill="#0F1B33" stroke={INK} strokeWidth={5}/>
    <clipPath id="clinic-ecg"><rect x={68} y={488} width={204} height={112}/></clipPath>
    <g clipPath="url(#clinic-ecg)"><g transform="translate(76 548)"><path d={line.join(" ")} fill="none" stroke={C.lime} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round"/></g></g>
    <circle cx={258} cy={502} r={5} fill={C.red} opacity={Math.floor(f / 15) % 2 ? 1 : 0.35}/>
    <Plant x={1000} y={640} s={0.8} f={f} pot={C.blue} leaf={C.greenDark} ph={0.4}/>
  </g>;
};

// ---- village --------------------------------------------------------------------------------------------------------------
const Palm: React.FC<{x: number; y: number; top: number; lean: number; f: number; ph?: number}> = ({x, y, top, lean, f, ph = 0}) => {
  const tx = x + lean, d = `M ${x} ${y} Q ${x + lean * 0.1} ${(y + top) / 2} ${tx} ${top}`;
  return <g>
    <path d={d} fill="none" stroke={INK} strokeWidth={44} strokeLinecap="round"/><path d={d} fill="none" stroke="#B07A45" strokeWidth={28} strokeLinecap="round"/>
    <path d={d} fill="none" stroke="#8C5B2E" strokeWidth={28} strokeLinecap="round" strokeDasharray="4 30"/>
    <g transform={`translate(${tx} ${top})`}>
      {[-170, -130, -92, -52, -14, 24].map((a, i) => <path key={i} d="M 0 0 Q 70 -70 160 -18 Q 80 -34 0 8 Z" fill={i % 2 ? C.green : C.greenDark} stroke={INK} strokeWidth={6} strokeLinejoin="round"
        transform={`rotate(${a + osc(f, 90, ph + i * 0.12) * 4})${a < -90 ? " scale(1 -1)" : ""}`}/>)}
      <circle cx={-14} cy={14} r={15} fill={C.brown} stroke={INK} strokeWidth={5}/><circle cx={14} cy={18} r={15} fill={C.brown} stroke={INK} strokeWidth={5}/>
    </g>
  </g>;
};
const Village: React.FC<{f: number}> = ({f}) => {
  const smoke = Array.from({length: 5}, (_, k) => { const t = mod(f + k * 30, 150) / 150; return {x: 418 + t * 70 + osc(f, 70, k * 0.2) * 8, y: 372 - t * 210, r: 12 + t * 34, o: (1 - t) * 0.85}; });
  return <g>
    <rect x={-B} y={-B} width={W + 2 * B} height={560 + B} fill={C.sky}/>
    <Sun x={1380} y={176} r={56} f={f}/>
    <Clouds f={f} list={[[160, 140, 0.9, 0.22], [900, 250, 0.7, 0.16], [1600, 120, 0.8, 0.26]]}/>
    {[0, 1, 2].map((i) => <Bird key={i} x={mod(f * 2.6 + i * 300 + 100, W + 300) - 150} y={210 + i * 40 + Math.sin(f / 20 + i) * 12} f={f} ph={i * 1.6} s={0.9}/>)}
    <path d="M -110 560 Q 200 410 460 500 T 900 470 T 1380 500 T 1700 440 T 2030 520 L 2030 600 L -110 600 Z" fill="#A9D6A0" stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    <path d="M -110 600 Q 300 500 640 580 T 1200 560 T 1760 540 T 2030 590 L 2030 640 L -110 640 Z" fill="#8CC784" stroke={INK} strokeWidth={7} strokeLinejoin="round"/>
    <rect x={-B} y={600} width={W + 2 * B} height={110} fill="#7DC86B" stroke={INK} strokeWidth={8}/>
    {Array.from({length: 22}, (_, i) => { const x1 = i * 100 - 100; return <polygon key={i} points={pts([[x1, 606], [x1 + 46, 606], [960 + (x1 + 46 - 960) * 1.6, 706], [960 + (x1 - 960) * 1.6, 706]])} fill="#5FB35B" opacity={0.85}/>; })}
    {/* ground */}
    <rect x={-B} y={700} width={W + 2 * B} height={H - 700 + B} fill="#E8CE92" stroke={INK} strokeWidth={8}/>
    <path d={`M 640 ${H + B} Q 760 840 900 740 L 1100 740 Q 1160 840 1300 ${H + B} Z`} fill="#F3E0B0"/>
    {Array.from({length: 20}, (_, i) => <g key={i} transform={`translate(${i * 104 - 30 + (i % 3) * 14} 706)`}><circle cx={0} cy={-6} r={22 + (i % 3) * 6} fill="#4FA24D" stroke={INK} strokeWidth={5}/><circle cx={-10} cy={-14} r={9} fill="#7DC86B"/></g>)}
    {[[300, 900, 12], [520, 990, 9], [1500, 930, 14], [1700, 860, 10], [1150, 1010, 8]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r * 1.6} ry={r} fill="#C9AE72" stroke={INK} strokeWidth={4}/>)}
    {/* hut */}
    <ellipse cx={330} cy={650} rx={240} ry={16} fill={C.shadow}/>
    <rect x={210} y={500} width={240} height={146} fill={C.wallLow} stroke={INK} strokeWidth={8}/>
    <path d="M 176 512 L 330 378 L 484 512 Z" fill="#C9923F" stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
    {[-60, -20, 20, 60].map((d) => <path key={d} d={`M ${330 + d * 0.5} 392 L ${330 + d * 1.9} 508`} stroke="#A8742A" strokeWidth={6} strokeLinecap="round"/>)}
    <path d="M 296 646 L 296 574 Q 330 540 364 574 L 364 646 Z" fill={C.brown} stroke={INK} strokeWidth={7} strokeLinejoin="round"/>
    <rect x={392} y={540} width={44} height={40} rx={5} fill={C.sky2} stroke={INK} strokeWidth={6}/>
    <rect x={230} y={540} width={44} height={40} rx={5} fill={C.sky2} stroke={INK} strokeWidth={6}/>
    <rect x={398} y={366} width={34} height={64} fill="#B58A5A" stroke={INK} strokeWidth={6}/>
    {smoke.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={C.white} opacity={s.o} stroke={INK} strokeWidth={4}/>)}
    <Palm x={640} y={690} top={380} lean={-24} f={f}/>
    <Palm x={1810} y={700} top={350} lean={-50} f={f} ph={0.4}/>
    <rect x={1536} y={500} width={52} height={200} rx={8} fill={C.brown} stroke={INK} strokeWidth={8}/>
    <Crown x={1560} y={470} r={116} f={f} fill={C.greenDark} ph={0.3}/>
  </g>;
};

// ---- city -----------------------------------------------------------------------------------------------------------------
const Tower: React.FC<{x: number; w: number; top: number; base: number; fill: string; id: number; f: number; lit?: boolean; antenna?: boolean; line?: number}> = ({x, w, top, base, fill, id, f, lit = true, antenna, line = 8}) => {
  const cols = Math.max(2, Math.floor(w / 54)), pitch = (w - 24) / cols, rows = Math.floor((base - top - 40) / 62);
  return <g>
    {antenna && <g><line x1={x + w / 2} y1={top} x2={x + w / 2} y2={top - 90} stroke={INK} strokeWidth={8}/><circle cx={x + w / 2} cy={top - 96} r={10} fill={C.red} stroke={INK} strokeWidth={5} opacity={Math.floor(f / 20) % 2 ? 1 : 0.3}/></g>}
    <rect x={x} y={top} width={w} height={base - top} fill={fill} stroke={INK} strokeWidth={line}/>
    <rect x={x + w * 0.76} y={top} width={w * 0.24} height={base - top} fill={INK} opacity={0.14}/>
    {lit && Array.from({length: rows}, (_, r) => Array.from({length: cols}, (_, c) => {
      const o = Math.floor(random(`o${id}-${r}-${c}`) * 180), k = Math.floor((f + o) / 180), on = random(`w${id}-${r}-${c}-${k}`) > 0.55;
      return <rect key={`${r}-${c}`} x={x + 12 + c * pitch + 5} y={top + 22 + r * 62} width={pitch - 10} height={36} rx={4} fill={on ? C.yellow : pale(fill, 0.6)} stroke={INK} strokeWidth={4}/>; }))}
  </g>;
};
const Train: React.FC<{x: number; y: number}> = ({x, y}) => <g transform={`translate(${x} ${y})`}>
  {[0, 1, 2].map((k) => <g key={k} transform={`translate(${k * 336} 0)`}>
    <rect x={0} y={-78} width={322} height={78} rx={k === 2 ? 38 : 14} fill={C.white} stroke={INK} strokeWidth={8}/>
    <rect x={0} y={-30} width={322} height={14} fill={C.royal}/>
    {Array.from({length: 5}, (_, i) => <rect key={i} x={26 + i * 58} y={-62} width={42} height={30} rx={7} fill={i === 2 ? C.royal : "#2A3355"} stroke={INK} strokeWidth={5}/>)}
    <rect x={0} y={-78} width={322} height={78} rx={k === 2 ? 38 : 14} fill="none" stroke={INK} strokeWidth={8}/>
    <circle cx={50} cy={10} r={11} fill={INK}/><circle cx={272} cy={10} r={11} fill={INK}/>
  </g>)}
</g>;
const Bus: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => <g transform={`translate(${x} ${y + Math.sin(f * 1.7) * 1.6})`}>
  <ellipse cx={0} cy={4} rx={230} ry={9} fill={C.shadow}/>
  <rect x={-220} y={-150} width={440} height={118} rx={22} fill={C.green} stroke={INK} strokeWidth={8}/>
  <rect x={-220} y={-60} width={440} height={16} fill={C.white}/>
  {Array.from({length: 6}, (_, i) => <rect key={i} x={-196 + i * 62} y={-132} width={50} height={46} rx={7} fill={C.sky} stroke={INK} strokeWidth={5}/>)}
  <rect x={-220} y={-150} width={440} height={118} rx={22} fill="none" stroke={INK} strokeWidth={8}/>
  <Wheel cx={-140} cy={-24} r={28} rot={-f * 16}/><Wheel cx={140} cy={-24} r={28} rot={-f * 16}/>
</g>;
const City: React.FC<{f: number}> = ({f}) => {
  const tx = mod(1700 + f * 9, 3800) - 1100, bx = 2200 - mod(f * 4.2 + 500, 3000);
  const far: [number, number, number][] = [[-60, 140, 330], [120, 120, 280], [250, 170, 380], [440, 130, 300], [600, 150, 360], [780, 120, 280], [900, 180, 400], [1100, 140, 310], [1260, 150, 350], [1430, 130, 290], [1570, 170, 390], [1760, 150, 330], [1900, 120, 300]];
  const near: [number, number, number, string, boolean][] = [[-40, 230, 190, C.royal, true], [230, 190, 300, "#5B86D6", false], [450, 260, 150, C.blue, true], [740, 200, 280, "#3A5FB0", false], [960, 240, 200, "#6C96E0", true], [1220, 210, 320, C.royalDark, false], [1450, 250, 170, C.blue, true], [1720, 230, 260, "#4F7BD0", false]];
  return <g>
    <rect x={-B} y={-B} width={W + 2 * B} height={600 + B} fill={C.sky}/>
    <Clouds f={f} list={[[220, 110, 0.8, 0.2], [1100, 190, 0.7, 0.15], [1650, 100, 0.9, 0.25]]}/>
    {far.map(([x, w, top], i) => <Tower key={i} x={x} w={w} top={top} base={600} fill="#BCD4EE" id={i + 40} f={f} lit={false} line={5}/>)}
    {near.map(([x, w, top, fill, ant], i) => <Tower key={i} x={x} w={w} top={top} base={600} fill={fill} id={i} f={f} antenna={ant}/>)}
    {/* viaduct and train */}
    {[160, 560, 960, 1360, 1760].map((x) => <rect key={x} x={x - 24} y={520} width={48} height={190} fill="#8D97AB" stroke={INK} strokeWidth={8}/>)}
    <Train x={tx} y={500}/>
    <rect x={-B} y={500} width={W + 2 * B} height={36} fill="#8D97AB" stroke={INK} strokeWidth={8}/>
    {/* road */}
    <rect x={-B} y={600} width={W + 2 * B} height={104} fill="#5A6483" stroke={INK} strokeWidth={8}/>
    {Array.from({length: 14}, (_, i) => <rect key={i} x={i * 160 - 20} y={646} width={90} height={9} rx={4} fill={C.white} opacity={0.85}/>)}
    <Bus x={bx} y={690} f={f}/>
    {/* pavement */}
    <rect x={-B} y={700} width={W + 2 * B} height={24} fill={C.white} stroke={INK} strokeWidth={6}/>
    <rect x={-B} y={724} width={W + 2 * B} height={H - 724 + B} fill="#CBD1DC"/>
    {Array.from({length: 14}, (_, i) => { const x1 = i * 170 - 170; return <line key={i} x1={x1} y1={724} x2={960 + (x1 - 960) * 2} y2={H + B} stroke="#AEB6C6" strokeWidth={6}/>; })}
    {[800, 900, 1010].map((y) => <line key={y} x1={-B} y1={y} x2={W + B} y2={y} stroke="#AEB6C6" strokeWidth={6}/>)}
    {[170, 1760].map((x) => <g key={x}><rect x={x - 8} y={440} width={16} height={280} fill={INK}/><path d={`M ${x - 8} 452 Q ${x + 50} 430 ${x + 90} 450`} fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round"/>
      <rect x={x + 62} y={446} width={56} height={22} rx={8} fill={C.gold} stroke={INK} strokeWidth={6}/></g>)}
  </g>;
};

// ---- void: a clean studio backdrop for ideas with no place ---------------------------------------------------------------
const Void: React.FC<{f: number}> = ({f}) => {
  const shapes: [number, number, string, string, number, number][] = [[300, 250, "plus", C.yellow, 54, 0], [1560, 200, "ring", C.red, 46, 0.3], [1300, 420, "tri", C.blue, 50, 0.6], [180, 560, "ring", C.green, 40, 0.15], [1750, 560, "plus", C.orange, 46, 0.45], [640, 150, "tri", C.red, 40, 0.75], [980, 360, "ring", C.yellow, 34, 0.9]];
  return <g>
    <rect x={-B} y={-B} width={W + 2 * B} height={H + 2 * B} fill={C.sky2}/>
    {[[260, 300, 300, 0], [1580, 260, 360, 0.4], [1000, 640, 420, 0.7]].map(([x, y, r, ph], i) => <circle key={i} cx={x + osc(f, 240, ph) * 26} cy={y + osc(f, 300, ph + 0.2) * 18} r={r} fill={C.sky}/>)}
    {Array.from({length: 17}, (_, c) => Array.from({length: 11}, (_, r) => <circle key={`${c}-${r}`} cx={c * 120 - 20} cy={mod(r * 120 - f * 0.35, 1320) - 100} r={5} fill={C.white} opacity={0.8}/>))}
    <rect x={-B} y={740} width={W + 2 * B} height={H - 740 + B} fill={C.sky}/>
    <rect x={-B} y={736} width={W + 2 * B} height={12} fill={C.white}/>
    <ellipse cx={960} cy={900} rx={780} ry={130} fill={C.white} opacity={0.6}/>
    <ellipse cx={960} cy={900} rx={680} ry={104} fill="none" stroke={C.royal} strokeWidth={6} strokeDasharray="22 20" opacity={0.35} strokeDashoffset={-f * 0.6}/>
    {shapes.map(([x, y, k, col, s, ph], i) => <g key={i} transform={`translate(${x} ${y + osc(f, 90, ph) * 16}) rotate(${osc(f, 200, ph) * 14})`}>
      {k === "plus" && <path d={`M ${-s * 0.3} ${-s} H ${s * 0.3} V ${-s * 0.3} H ${s} V ${s * 0.3} H ${s * 0.3} V ${s} H ${-s * 0.3} V ${s * 0.3} H ${-s} V ${-s * 0.3} H ${-s * 0.3} Z`} fill={col} stroke={INK} strokeWidth={7} strokeLinejoin="round"/>}
      {k === "ring" && <circle r={s} fill="none" stroke={col} strokeWidth={s * 0.38}/>}
      {k === "tri" && <path d={`M 0 ${-s} L ${s * 0.95} ${s * 0.7} L ${-s * 0.95} ${s * 0.7} Z`} fill={col} stroke={INK} strokeWidth={7} strokeLinejoin="round"/>}
    </g>)}
  </g>;
};

// time (UPSC film): "may" | "july" | "noon" | "burst" changes the sky of rooftop and beach; on the older sets it lays a flat veil (and dark cloud banks for "burst") over the art.
export const Set: React.FC<{set: SetName; f: number; time?: string}> = ({set, f, time}) => {
  switch (set) {
    case "home": return <><Home f={f}/>{time && <TimeCover f={f} time={time}/>}</>;
    case "school": return <><School f={f}/>{time && <TimeCover f={f} time={time}/>}</>;
    case "street": return <><Street f={f}/>{time && <TimeCover f={f} time={time}/>}</>;
    case "clinic": return <><Clinic f={f}/>{time && <TimeCover f={f} time={time}/>}</>;
    case "village": return <><Village f={f}/>{time && <TimeCover f={f} time={time}/>}</>;
    case "city": return <><City f={f}/>{time && <TimeCover f={f} time={time}/>}</>;
    case "void": return <><Void f={f}/>{time && <TimeCover f={f} time={time}/>}</>;
    case "rooftop": case "beach": case "himalaya": return <NewSet set={set} f={f} time={time}/>;
    default: throw new Error(`unknown set "${set}" (known: ${SET_NAMES.join(", ")})`);
  }
};
