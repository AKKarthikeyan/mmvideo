// Illustration kit for the Vox engine (11 Oct 2026). AK: "more illustration with motion graphics", told as a plain
// story for a viewer who does not follow the market. Landscape 1920x1080 only. Everything is code-drawn, and every
// number on screen comes from the scene's props (never hard-coded), so no invented figure can appear.
import React from "react";
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {C, COND, TYPE, Drift, Stage, Stamp, Strip, VoxDefs} from "../../voxkit";

export const W = 1920, H = 1080, FPS = 30;
// Keep content inside this box: the chapter tag and progress bar sit above, the captions below.
export const SAFE = {top: 110, bot: 925, left: 90, right: 1830};
export const P = {...C, green: "#3E7C4F", blue: "#2F5E8C", cream: "#FBF6E9", gold: "#E2B13C", shade: "#2b2112", orange: "#D9772B", purple: "#6B4E9B", teal: "#2E8C8A"};
export type Beat = {ch: number; key: string; say: string; cap: string; sec: number; cues: string[]; scene: any};
export type TFn = (x: any, off?: number) => number;
export type SP = {s: any; n: number; T: TFn; b: Beat; D: any};

// Frame at which a phrase of the narration is spoken ("phrase|+6" adds frames). Same rule as the engine's.
export const makeT = (b: Beat): TFn => (x, off = 0) => {
  if (typeof x === "number") return x + off;
  if (x == null) return off;
  const [p, o] = String(x).split("|");
  const i = b.say.toLowerCase().indexOf(p.toLowerCase());
  if (i < 0) throw new Error(`phrase not in ${b.key}: ${p}`);
  return Math.round(b.sec * FPS * i / b.say.length) + (o ? parseInt(o, 10) : 0) + off;
};
export const fit = (text: string, size: number, maxW: number, k = 0.52) => Math.min(size, maxW / (Math.max(1, text.length) * k + 0.8));
export const fmtIN = (v: number, d = 0) => {
  const [i, f] = Math.abs(v).toFixed(d).split(".");
  const last3 = i.slice(-3), rest = i.slice(0, -3);
  const s = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3 : last3;
  return (v < 0 ? "-" : "") + (f ? `${s}.${f}` : s);
};
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// The stage every illustrated scene sits on: tan paper, grain, slow 2% drift.
export const IStage: React.FC<{n: number; children: React.ReactNode}> = ({n, children}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute"}}>
    <VoxDefs/><Stage w={W} h={H}/><Drift frames={n} cx={W / 2} cy={H / 2}>{children}</Drift>
  </svg>
);
// Heading strip, on from the first frame (text never fades in).
export const IHeading: React.FC<{text?: string; y?: number}> = ({text, y = 160}) =>
  text ? <Strip x={W / 2} y={y} start={0} text={text} size={fit(text, 60, 1640)}/> : null;
// Small typewriter tag for provenance: "OUR ARITHMETIC FROM THE RESULTS", "MADE-UP EXAMPLE".
export const INote: React.FC<{text?: string; x?: number; y?: number; anchor?: "start" | "middle" | "end"}> = ({text, x = SAFE.right, y = 236, anchor = "end"}) => {
  if (!text) return null;
  const w = text.length * 15.2 + 28, x0 = anchor === "end" ? x - w : anchor === "middle" ? x - w / 2 : x;
  return <g><rect x={x0} y={y - 28} width={w} height={40} fill={P.ink}/>
    <text x={x0 + 14} y={y} fontFamily={TYPE} fontSize={24} fill={P.white}>{text}</text></g>;
};

// Red rubber stamps from s.stamps = [{text, at, x?, y?}]: bottom-right by default, stacking upward.
export const IStamps: React.FC<{s: any; T: TFn; x?: number; y?: number}> = ({s, T, x, y}) => <>{(s.stamps || []).map((st: any, i: number) => {
  const size = fit(st.text, 60, 900, 0.56), sw = st.text.length * size * 0.55 + 70;
  return <Stamp key={i} x={st.x ?? x ?? SAFE.right - sw / 2 - 20} y={st.y ?? (y ?? SAFE.bot - 70) - i * 115} start={st.at == null ? 0 : T(st.at)} text={st.text} size={size} rot={i % 2 ? 4 : -5}/>;
})}</>;

// 0..1 progress from `start` over `dur` frames.
export const useProg = (start: number, dur = 12, ease: (t: number) => number = Easing.out(Easing.cubic)) => {
  const f = useCurrentFrame();
  return interpolate(f, [start, start + dur], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
};
// Spring 0..1 with overshoot from `start`.
export const usePop = (start: number, damping = 11, stiffness = 150) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return {on: f >= start, s: f >= start ? spring({frame: f - start, fps, config: {damping, stiffness, mass: 0.8}}) : 0};
};
// Anything that should spring into place at (x, y): hidden before `start`, overshoots, settles.
export const Pop: React.FC<{x: number; y: number; start: number; from?: number; rot?: number; children: React.ReactNode}> = ({x, y, start, from = 0.55, rot = 0, children}) => {
  const {on, s} = usePop(start);
  if (!on) return null;
  return <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${from + (1 - from) * s})`}>{children}</g>;
};
// Paper chip with an ink border: a short label that pops in.
export const Chip: React.FC<{x: number; y: number; start: number; text: string; size?: number; fill?: string; color?: string; rot?: number; anchor?: "start" | "middle" | "end"}> =
  ({x, y, start, text, size = 44, fill = P.white, color = P.ink, rot = 0, anchor = "middle"}) => {
  const w = text.length * size * 0.52 + size * 0.9, h = size * 1.5;
  const dx = anchor === "start" ? w / 2 : anchor === "end" ? -w / 2 : 0;
  return (
    <Pop x={x + dx} y={y} start={start} rot={rot}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill={fill} stroke={P.ink} strokeWidth={4} style={{filter: "url(#vshadow)"}}/>
      <text x={0} y={size * 0.36} fontFamily={COND} fontWeight={700} fontSize={size} textAnchor="middle" fill={color} letterSpacing={1}>{text}</text>
    </Pop>
  );
};
// Number that ticks up mechanically (Indian digit grouping).
export const Num: React.FC<{x: number; y: number; start: number; to: number; from?: number; dur?: number; decimals?: number; prefix?: string; suffix?: string; size?: number; color?: string; anchor?: "start" | "middle" | "end"}> =
  ({x, y, start, to, from = 0, dur = 22, decimals = 0, prefix = "", suffix = "", size = 120, color = P.ink, anchor = "middle"}) => {
  const f = useCurrentFrame();
  const p = useProg(start, dur);
  if (f < start) return null;
  return <text x={x} y={y} fontFamily={COND} fontWeight={700} fontSize={size} textAnchor={anchor} fill={color}>{prefix}{fmtIN(from + (to - from) * p, decimals)}{suffix}</text>;
};
// Arrow that draws itself from (x1, y1) to (x2, y2).
export const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; start: number; dur?: number; color?: string; width?: number; bend?: number}> =
  ({x1, y1, x2, y2, start, dur = 12, color = P.ink, width = 8, bend = 0}) => {
  const p = useProg(start, dur);
  if (p <= 0) return null;
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const a = Math.atan2(y2 - my, x2 - mx) * 180 / Math.PI;
  return (
    <g>
      <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p}/>
      {p > 0.92 ? <path d={`M 0 0 L -26 -14 L -26 14 Z`} fill={color} transform={`translate(${x2} ${y2}) rotate(${a})`}/> : null}
    </g>
  );
};

// ---------- icons: each is drawn in a 100 x 100 box centred on (0, 0); pass x, y and size (px of that box) ----------
type IP = {x?: number; y?: number; size?: number; color?: string; accent?: string};
const Ico: React.FC<IP & {children: React.ReactNode}> = ({x = 0, y = 0, size = 100, children}) =>
  <g transform={`translate(${x} ${y}) scale(${size / 100})`} strokeLinejoin="round" strokeLinecap="round">{children}</g>;
const SW = 4;
export const StoreIcon: React.FC<IP> = ({color = P.white, accent = P.red, ...p}) => (
  <Ico {...p}>
    <rect x={-40} y={-12} width={80} height={54} fill={color} stroke={P.ink} strokeWidth={SW}/>
    <rect x={-30} y={-46} width={60} height={18} fill={P.ink}/>
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${-46 + i * 18.4} -28 h 18.4 v 14 a 9.2 9.2 0 0 1 -18.4 0 Z`} fill={i % 2 ? P.white : accent} stroke={P.ink} strokeWidth={SW}/>)}
    <rect x={-8} y={10} width={20} height={32} fill={P.ink}/>
    <rect x={-32} y={8} width={18} height={16} fill={P.mustard} stroke={P.ink} strokeWidth={3}/>
    <rect x={18} y={8} width={14} height={16} fill={P.mustard} stroke={P.ink} strokeWidth={3}/>
  </Ico>
);
export const TrolleyIcon: React.FC<IP & {full?: boolean}> = ({color = P.white, accent = P.mustard, full = true, ...p}) => (
  <Ico {...p}>
    {full ? <><rect x={-22} y={-40} width={22} height={26} fill={accent} stroke={P.ink} strokeWidth={SW}/>
      <rect x={2} y={-34} width={24} height={20} fill={P.red} stroke={P.ink} strokeWidth={SW}/>
      <rect x={-8} y={-52} width={18} height={16} fill={P.green} stroke={P.ink} strokeWidth={SW}/></> : null}
    <path d="M -46 -30 h 12 l 6 16" fill="none" stroke={P.ink} strokeWidth={6}/>
    <path d="M -30 -14 h 66 l -8 34 h -50 Z" fill={color} stroke={P.ink} strokeWidth={SW}/>
    {[-14, 2, 18].map((x) => <line key={x} x1={x} y1={-12} x2={x - 2} y2={18} stroke={P.ink} strokeWidth={3}/>)}
    <circle cx={-16} cy={34} r={8} fill={P.ink}/><circle cx={22} cy={34} r={8} fill={P.ink}/>
  </Ico>
);
// The video's currency (VData.cur, default ₹): coin, tag and note icons print it unless they are given a label.
export const CurCtx = React.createContext("₹");
export const CoinIcon: React.FC<IP & {label?: string}> = ({color = P.gold, label, ...p}) => (
  <Ico {...p}>
    <circle cx={0} cy={4} r={42} fill={P.shade} opacity={0.35}/>
    <circle cx={0} cy={0} r={42} fill={color} stroke={P.ink} strokeWidth={SW}/>
    <circle cx={0} cy={0} r={32} fill="none" stroke={P.ink} strokeWidth={2.5} opacity={0.55}/>
    <text x={0} y={18} fontFamily={COND} fontWeight={700} fontSize={50} textAnchor="middle" fill={P.ink}>{label ?? <CurText/>}</text>
  </Ico>
);
// A plainly stylised note (not a likeness of real currency): pass the text to print on it.
export const NoteIcon: React.FC<IP & {label?: string}> = ({color = "#BFD9B4", label, ...p}) => (
  <Ico {...p}>
    <rect x={-78} y={-38} width={156} height={76} rx={6} fill={color} stroke={P.ink} strokeWidth={SW}/>
    <rect x={-68} y={-28} width={136} height={56} rx={3} fill="none" stroke={P.ink} strokeWidth={2} opacity={0.5}/>
    <circle cx={-48} cy={0} r={13} fill="none" stroke={P.ink} strokeWidth={2.5} opacity={0.6}/>
    <circle cx={48} cy={0} r={13} fill="none" stroke={P.ink} strokeWidth={2.5} opacity={0.6}/>
    <text x={0} y={15} fontFamily={COND} fontWeight={700} fontSize={42} textAnchor="middle" fill={P.ink}>{label ?? <CurText suffix="100"/>}</text>
  </Ico>
);
export const BankIcon: React.FC<IP> = ({color = P.white, accent = P.blue, ...p}) => (
  <Ico {...p}>
    <path d="M -46 -18 L 0 -46 L 46 -18 Z" fill={accent} stroke={P.ink} strokeWidth={SW}/>
    <rect x={-42} y={-18} width={84} height={10} fill={color} stroke={P.ink} strokeWidth={SW}/>
    {[-30, -10, 10, 30].map((x) => <rect key={x} x={x - 6} y={-8} width={12} height={36} fill={color} stroke={P.ink} strokeWidth={SW}/>)}
    <rect x={-46} y={28} width={92} height={12} fill={color} stroke={P.ink} strokeWidth={SW}/>
  </Ico>
);
export const BoxIcon: React.FC<IP> = ({color = "#C89B5A", ...p}) => (
  <Ico {...p}>
    <rect x={-36} y={-26} width={72} height={60} fill={color} stroke={P.ink} strokeWidth={SW}/>
    <path d="M -36 -26 l 14 -14 h 72 l -14 14 Z" fill="#DDB877" stroke={P.ink} strokeWidth={SW}/>
    <path d="M 36 -26 l 14 -14 v 60 l -14 14 Z" fill="#A87C42" stroke={P.ink} strokeWidth={SW}/>
    <line x1={0} y1={-26} x2={0} y2={34} stroke={P.ink} strokeWidth={3} opacity={0.5}/>
  </Ico>
);
// Faceless figure (no real person is ever drawn).
export const PersonIcon: React.FC<IP> = ({color = P.ink, ...p}) => (
  <Ico {...p}>
    <circle cx={0} cy={-28} r={15} fill={color}/>
    <path d="M -26 40 v -22 a 26 26 0 0 1 52 0 v 22 Z" fill={color}/>
  </Ico>
);
export const TagIcon: React.FC<IP & {label?: string}> = ({color = P.mustard, label, ...p}) => (
  <Ico {...p}>
    <path d="M -44 0 L -14 -30 H 44 V 30 H -14 Z" fill={color} stroke={P.ink} strokeWidth={SW}/>
    <circle cx={-18} cy={0} r={6} fill={P.white} stroke={P.ink} strokeWidth={3}/>
    <text x={16} y={14} fontFamily={COND} fontWeight={700} fontSize={38} textAnchor="middle" fill={P.ink}>{label ?? <CurText/>}</text>
  </Ico>
);
function CurText({suffix = ""}: {suffix?: string}) { return <>{React.useContext(CurCtx) + suffix}</>; }
export const ICONS: Record<string, React.FC<any>> = {store: StoreIcon, trolley: TrolleyIcon, coin: CoinIcon, note: NoteIcon, bank: BankIcon, box: BoxIcon, person: PersonIcon, tag: TagIcon};
export const Icon: React.FC<IP & {name: string; label?: string}> = ({name, ...p}) => { const I = ICONS[name] || BoxIcon; return <I {...p}/>; };
