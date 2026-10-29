// Prop icons for the long-form cartoon stage scene (28 Oct 2026). Twelve flat vector icons in the pilot's look: C palette fills, ink
// outline, white highlight shapes, round joins. Each has a small idle motion driven by f (wiggle, tick, pulse, flap); at f = 0 every
// icon is at rest, so a still is always clean.
// API (fixed): <Icon name x y s f/> draws an SVG <g> centred on (x, y); s = 1 is about 120 px across (the art lives in a 120 x 120 box).
// Optional extras: shadow (a ground shadow under the icon, off by default) and seed (shifts the motion phase so two copies do not move in step).
// The outline keeps a steady look as the icon is scaled: 8 px on screen at s = 1 (the pilot's 8 px), growing slowly (8 * sqrt(s)) so a 400 px icon
// is not paper-thin and a 60 px icon is not a blob.
import React from "react";
import {C} from "../palette";

export type IconName = "book" | "school" | "hospital" | "house" | "ring" | "rupee" | "calendar" | "pram" | "clock" | "heart" | "tree" | "scale";
export const ICONS: IconName[] = ["book", "school", "hospital", "house", "ring", "rupee", "calendar", "pram", "clock", "heart", "tree", "scale"];

type P = {f: number; w: number; id: string};

const TAU = Math.PI * 2;
const c01 = (v: number) => Math.min(1, Math.max(0, v));
const io = (t: number) => { const u = c01(t); return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
const eo = (t: number) => 1 - Math.pow(1 - c01(t), 3);
const bump = (k: number, at: number, wd: number) => Math.exp(-((k - at) * (k - at)) / wd);
// Outline props: ink, round joins and caps.
const L = (w: number) => ({stroke: C.ink, strokeWidth: w, strokeLinejoin: "round" as const, strokeLinecap: "round" as const});
// A blink: closed for 4 frames every ~110.
const blinks = (f: number, seed: number) => (f + seed * 37) % 112 < 4;
// A four-point sparkle of radius r.
const star = (r: number) => `M 0 ${-r} Q ${r * 0.14} ${-r * 0.14} ${r} 0 Q ${r * 0.14} ${r * 0.14} 0 ${r} Q ${-r * 0.14} ${r * 0.14} ${-r} 0 Q ${-r * 0.14} ${-r * 0.14} 0 ${-r} Z`;
const ell = (cx: number, cy: number, rx: number, ry: number) => `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${2 * rx} 0 a ${rx} ${ry} 0 1 0 ${-2 * rx} 0 Z`;

// ---- book: an open book, one page turns every 3.2 s ---------------------------------------------------------------------
const PAGE = "M 0 -26 Q 26 -40 52 -28 L 52 36 Q 26 26 0 42 Z";
const PageLines: React.FC<{d: number}> = ({d}) =>
  <g fill="none" stroke={C.royal} strokeWidth={d} strokeLinecap="round" opacity={0.5}>
    {[-14, -3, 8, 19].map((y, i) => <path key={i} d={`M 9 ${y} Q 26 ${y - 7} ${i === 3 ? 32 : 44} ${y - 1}`}/>)}
  </g>;
const Book: React.FC<P> = ({f, w}) => {
  const d = w * 0.55, k = f % 96, a = io((k - 56) / 20) * Math.PI, sx = Math.cos(a), lift = Math.sin(a), bob = Math.sin(f / 15) * 1.6;
  return <g transform={`translate(0 ${-3 + bob})`}>
    <path d="M -6 40 L -6 58 L 0 52 L 6 58 L 6 40 Z" fill={C.red} {...L(d)}/>
    <path d="M -60 -34 Q -30 -46 0 -30 Q 30 -46 60 -34 L 60 44 Q 30 32 0 50 Q -30 32 -60 44 Z" fill={C.royal} {...L(w)}/>
    <g transform="scale(-1 1)"><path d={PAGE} fill={C.white} {...L(d)}/><PageLines d={d}/></g>
    <path d={PAGE} fill={C.white} {...L(d)}/><PageLines d={d}/>
    <g transform={`translate(0 ${-lift * 7}) scale(${sx} 1)`}><path d={PAGE} fill={C.white} {...L(d)}/><PageLines d={d}/></g>
    <path d="M 0 -28 L 0 44" fill="none" {...L(d)}/>
  </g>;
};

// ---- school: a three-part building with a waving flag --------------------------------------------------------------------
const School: React.FC<P> = ({f, w}) => {
  const d = w * 0.6, top = Array.from({length: 9}, (_, i) => { const t = i / 8; return [t * 28, -60 + Math.sin(f / 3.4 - t * 4.6) * 3.2 * t] as const; });
  const flag = `M 0 -60 ${top.slice(1).map(([x, y]) => `L ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")} ${[...top].reverse().map(([x, y]) => `L ${x.toFixed(1)} ${(y + 14).toFixed(1)}`).join(" ")} Z`;
  return <g transform="translate(0 8)">
    <path d="M 0 -38 L 0 -64" fill="none" {...L(d)}/>
    <path d={flag} fill={C.orange} {...L(d)}/>
    {[-1, 1].map((sg) => <g key={sg} transform={`scale(${sg} 1)`}>
      <rect x={-60} y={2} width={40} height={12} rx={3} fill={C.royal} {...L(d)}/>
      <rect x={-56} y={12} width={36} height={34} fill={C.wall} {...L(d)}/>
      {[-54, -41].map((wx) => <rect key={wx} x={wx} y={21} width={10} height={15} rx={2} fill={C.sky} {...L(d * 0.8)}/>)}
    </g>)}
    <rect x={-27} y={-12} width={54} height={58} fill={C.wall} {...L(d)}/>
    <path d="M -36 -10 L 0 -40 L 36 -10 Z" fill={C.red} {...L(w * 0.85)}/>
    <path d="M -36 -10 L 0 -40 L 0 -10 Z" fill={C.white} opacity={0.16}/>
    <circle cx={0} cy={-19} r={7.5} fill={C.sky} {...L(d * 0.8)}/>
    <path d="M -10 46 L -10 26 Q -10 15 0 15 Q 10 15 10 26 L 10 46 Z" fill={C.royal} {...L(d)}/>
    <circle cx={5} cy={31} r={1.8} fill={C.yellow}/>
    <path d="M -64 46 L 64 46" fill="none" {...L(d)}/>
  </g>;
};

// ---- hospital: the red cross pulses, the roof lamp flashes ------------------------------------------------------------------------
const Hospital: React.FC<P> = ({f, w}) => {
  const d = w * 0.6, p = 1 + 0.1 * bump(f % 48, 8, 18), lamp = (f % 30) < 15;
  const cr = "M -5.5 -15.5 L 5.5 -15.5 L 5.5 -5.5 L 15.5 -5.5 L 15.5 5.5 L 5.5 5.5 L 5.5 15.5 L -5.5 15.5 L -5.5 5.5 L -15.5 5.5 L -15.5 -5.5 L -5.5 -5.5 Z";
  return <g transform="translate(0 9)">
    <circle cx={0} cy={-61} r={5.5} fill={lamp ? C.red : C.redDark} {...L(d * 0.8)}/>
    <rect x={-34} y={-50} width={68} height={46} fill={C.white} {...L(d)}/>
    <rect x={-39} y={-57} width={78} height={11} rx={3} fill={C.royal} {...L(d)}/>
    <rect x={-54} y={-8} width={108} height={54} rx={4} fill={C.white} {...L(d)}/>
    <rect x={-54} y={-8} width={108} height={8} fill={C.royal} {...L(d)}/>
    <g transform={`translate(0 -27) scale(${p})`}><path d={cr} fill={C.red} {...L(d)}/><path d="M -3 -13 L 3 -13" stroke={C.white} strokeWidth={d * 0.8} strokeLinecap="round" opacity={0.7}/></g>
    {[-1, 1].map((sg) => [24, 42].map((wx) => <rect key={`${sg}${wx}`} x={sg * wx - 6} y={8} width={12} height={15} rx={2} fill={C.sky} {...L(d * 0.75)}/>))}
    <path d="M -12 46 L -12 26 L 12 26 L 12 46 Z" fill={C.sky} {...L(d)}/>
    <path d="M 0 26 L 0 46" fill="none" {...L(d * 0.8)}/>
  </g>;
};

// ---- house: smoke curls from the chimney, the window glows ----------------------------------------------------------------------
const House: React.FC<P> = ({f, w}) => {
  const d = w * 0.6, glow = 0.5 + 0.5 * Math.sin(f / 9);
  return <g transform="translate(0 9)">
    {[0, 1, 2].map((i) => { const p = ((f / 48) + i / 3) % 1, r = (3 + p * 8) * Math.min(1, p * 7) * (1 - p * p * p);
      return r > 0.6 ? <circle key={i} cx={27 + p * 12 + Math.sin(p * 7 + i) * 3} cy={-51 - p * 20} r={r} fill={C.white} {...L(d * 0.7)}/> : null; })}
    <rect x={20} y={-44} width={15} height={30} fill={C.orange} {...L(d)}/>
    <rect x={17} y={-47} width={21} height={8} rx={2} fill={C.orangeDark} {...L(d * 0.8)}/>
    <rect x={-40} y={-6} width={80} height={52} fill={C.cream} {...L(d)}/>
    <path d="M -54 -2 L 0 -46 L 54 -2 Z" fill={C.red} {...L(w * 0.9)}/>
    <path d="M -50 -4 L 0 -44 L 0 -4 Z" fill={C.white} opacity={0.16}/>
    <path d="M -28 46 L -28 24 Q -28 14 -18 14 Q -8 14 -8 24 L -8 46 Z" fill={C.royal} {...L(d)}/>
    <circle cx={-13} cy={32} r={2.2} fill={C.yellow}/>
    <rect x={9} y={12} width={24} height={22} rx={3} fill={C.yellow} {...L(d)}/>
    <rect x={9} y={12} width={24} height={22} rx={3} fill={C.white} opacity={0.5 * glow}/>
    <path d="M 21 12 L 21 34 M 9 23 L 33 23" fill="none" {...L(d * 0.7)}/>
    <path d="M -60 46 L 60 46" fill="none" {...L(d)}/>
  </g>;
};

// ---- ring: a gold wedding ring with a diamond; a shine sweeps the stone and sparkles twinkle -------------------------------------
const Ring: React.FC<P> = ({f, w, id}) => {
  const d = w * 0.6, sw = ((f % 84) - 10) / 40, gem = "M -17 -36 L -10 -51 L 10 -51 L 17 -36 L 0 -13 Z";
  const sp = (ph: number) => Math.pow(Math.max(0, Math.sin(f / 7 + ph)), 2);
  return <g transform={`translate(0 3) rotate(${Math.sin(f / 18) * 2.2} 0 14)`}>
    <path d={`${ell(0, 15, 38, 39)} ${ell(0, 15, 24, 25)}`} fill={C.gold} fillRule="evenodd" {...L(w)}/>
    <path d="M -32 4 Q -33 -8 -20 -17" fill="none" stroke={C.white} strokeWidth={d * 1.2} strokeLinecap="round" opacity={0.7}/>
    <path d="M 30 26 Q 24 40 8 42" fill="none" stroke={C.orangeDark} strokeWidth={d * 1.1} strokeLinecap="round" opacity={0.6}/>
    <path d={ell(0, -22, 13, 6)} fill={C.gold} {...L(d)}/>
    <path d={gem} fill={C.sky} {...L(d)}/>
    <clipPath id={`${id}g`}><path d={gem}/></clipPath>
    <g clipPath={`url(#${id}g)`}>
      <path d="M -17 -36 L -6 -36 L 0 -13 Z" fill={C.white} opacity={0.75}/>
      <rect x={-6 + sw * 44 - 22} y={-60} width={9} height={60} fill={C.white} opacity={0.85} transform={`rotate(24 ${sw * 44 - 22} -30)`}/>
    </g>
    <path d="M -17 -36 L 17 -36 M -6 -36 L 0 -13 M 6 -36 L 0 -13 M -10 -51 L -6 -36 M 10 -51 L 6 -36" fill="none" {...L(d * 0.55)}/>
    <path d={gem} fill="none" {...L(d)}/>
    {[[-40, -40, 8, 0], [38, -33, 6, 2], [34, -54, 5, 4]].map(([x, y, r, ph], i) =>
      <path key={i} transform={`translate(${x} ${y}) scale(${0.35 + 0.65 * sp(ph)}) rotate(${sp(ph) * 20})`} d={star(r * 2.1)} fill={C.yellow} {...L(d * 0.6)}/>)}
  </g>;
};

// ---- rupee: a gold coin with the rupee sign; it flips every 2.6 s and a shine crosses it -----------------------------------------
const Rupee: React.FC<P> = ({f, w, id}) => {
  const d = w * 0.6, k = f % 80, a = io((k - 50) / 22) * TAU, sx = Math.max(0.1, Math.abs(Math.cos(a))), bob = Math.sin(f / 14) * 2;
  const shine = ((f % 80) - 14) / 34;
  return <g transform={`translate(0 ${bob})`}>
    <g transform={`scale(${sx} 1)`}>
      <circle r={50} fill={C.gold} {...L(w)}/>
      <circle r={39} fill={C.yellow} {...L(d)}/>
      <circle r={44.5} fill="none" stroke={C.orangeDark} strokeWidth={d * 0.8} strokeDasharray="4 5" opacity={0.7}/>
      <path d="M -19 -27 H 19 M -19 -13 H 19 M -16 -27 H 2 C 23 -27 23 1 2 1 H -16 L 11 30" fill="none" stroke={C.ink} strokeWidth={w * 1.0} strokeLinecap="round" strokeLinejoin="round"/>
      <clipPath id={`${id}c`}><circle r={49}/></clipPath>
      <g clipPath={`url(#${id}c)`}><rect x={-70 + shine * 140} y={-70} width={16} height={140} fill={C.white} opacity={0.55} transform={`rotate(24 ${-70 + shine * 140} 0)`}/></g>
      <path d="M -30 -26 Q -26 -34 -16 -38" fill="none" stroke={C.white} strokeWidth={d} strokeLinecap="round" opacity={0.7}/>
    </g>
  </g>;
};

// ---- calendar: the circled day pulses and its ring is redrawn every 4 s ------------------------------------------------------------
const Calendar: React.FC<P> = ({f, w}) => {
  const d = w * 0.6, p = 1 + 0.09 * Math.sin(f / 6), pulse = 0.5 + 0.5 * Math.sin(f / 6);
  return <g transform="translate(0 3)">
    <rect x={-48} y={-34} width={96} height={86} rx={14} fill={C.white} {...L(w)}/>
    <path d="M -48 -6 L -48 -20 Q -48 -34 -34 -34 L 34 -34 Q 48 -34 48 -20 L 48 -6 Z" fill={C.red} {...L(w)}/>
    <path d="M -40 -26 Q -30 -30 -18 -29" fill="none" stroke={C.white} strokeWidth={d} strokeLinecap="round" opacity={0.55}/>
    {[-26, 26].map((rx) => <g key={rx}><rect x={rx - 6} y={-47} width={12} height={24} rx={6} fill={C.fridgeDark} {...L(d)}/><rect x={rx - 2} y={-43} width={3.5} height={12} rx={1.8} fill={C.white} opacity={0.7}/></g>)}
    {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => (r === 1 && c === 2) ? null :
      <rect key={`${r}${c}`} x={-37 + c * 20} y={3 + r * 16} width={14} height={11} rx={3} fill={r === 0 && c < 2 ? C.fridgeDark : C.sky} {...L(d * 0.55)}/>))}
    <g transform={`translate(10 24.5) scale(${p})`}>
      <rect x={-8} y={-6} width={16} height={12} rx={3} fill={C.yellow} {...L(d * 0.55)}/>
      <ellipse rx={13.5} ry={11.5} fill="none" stroke={C.red} strokeWidth={d * 1.25} opacity={0.55 + 0.45 * pulse} transform="rotate(-6)"/>
    </g>
    {[0, 1].map((c) => <path key={c} d={`M ${-34 + c * 20} 5.5 l 8 6 M ${-26 + c * 20} 5.5 l -8 6`} stroke={C.ink} strokeWidth={d * 0.55} strokeLinecap="round" opacity={0.5}/>)}
  </g>;
};

// ---- pram: the pram rocks and the baby blinks ----------------------------------------------------------------------------------------
const Pram: React.FC<P> = ({f, w}) => {
  const d = w * 0.6, rock = Math.sin(f / 13) * 2.4, bl = blinks(f, 3), spin = rock * 5;
  const wheel = (cx: number) => <g transform={`translate(${cx} 45) rotate(${spin})`}>
    <circle r={15} fill={C.ink}/><circle r={9.5} fill={C.fridgeDark} stroke={C.white} strokeWidth={d * 0.4}/>
    <path d="M 0 -9 L 0 9 M -9 0 L 9 0 M -6.4 -6.4 L 6.4 6.4 M 6.4 -6.4 L -6.4 6.4" stroke={C.white} strokeWidth={d * 0.4}/>
    <circle r={3.2} fill={C.ink}/>
  </g>;
  return <g transform="translate(12 -6)"><g transform={`rotate(${rock} 0 60)`}>
    <path d="M -37 6 L -51 -24 L -60 -24" fill="none" stroke={C.ink} strokeWidth={d * 2.5} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M -37 6 L -51 -24 L -60 -24" fill="none" stroke={C.fridgeDark} strokeWidth={d * 1.1} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M -53 -24 L -62 -24" fill="none" stroke={C.royal} strokeWidth={d * 1.5} strokeLinecap="round"/>
    <circle cx={20} cy={-17} r={18} fill={C.skin} {...L(d)}/>
    <path d="M 19 -35 Q 25 -43 31 -35" fill="none" {...L(d * 0.8)}/>
    {bl ? <path d="M 11 -19 L 16 -19 M 24 -19 L 29 -19" {...L(d * 0.8)}/> : <><circle cx={14} cy={-19} r={2.7} fill={C.ink}/><circle cx={27} cy={-19} r={2.7} fill={C.ink}/></>}
    <ellipse cx={10} cy={-12} rx={4} ry={2.6} fill={C.red} opacity={0.35}/><ellipse cx={31} cy={-12} rx={4} ry={2.6} fill={C.red} opacity={0.35}/>
    <path d="M 16 -10 Q 20.5 -6 25 -10" fill="none" {...L(d * 0.8)}/>
    <path d="M -43 -3 L 37 -3 C 37 23 17 37 -8 37 C -31 37 -43 23 -43 -3 Z" fill={C.blue} {...L(w)}/>
    <path d="M -37 12 Q -6 27 34 11" fill="none" stroke={C.white} strokeWidth={d * 1.3} strokeLinecap="round" opacity={0.9}/>
    <path d="M -45 -3 C -46 -32 -30 -47 -12 -47 C 2 -47 6 -22 3 -3 Z" fill={C.orange} {...L(w)}/>
    <path d="M -29 -43 Q -26 -24 -25 -4 M -13 -46 Q -9 -26 -8 -4" fill="none" stroke={C.orangeDark} strokeWidth={d * 0.8} strokeLinecap="round"/>
    {wheel(-21)}{wheel(24)}
  </g></g>;
};

// ---- clock: an alarm clock; the second hand ticks, and every 3.3 s the bells ring and the clock shakes ------------------------------------
const Clock: React.FC<P> = ({f, w}) => {
  const d = w * 0.6, k = (f + 60) % 100, amp = k < 24 ? 1 - k / 24 : 0, sh = Math.sin(k * 1.9) * amp, sec = Math.floor(f / 3) * 6, min = 60 + f * 0.2;
  const bell = (sg: number) => <g transform={`rotate(${sg * (38 + sh * 7)} 0 6)`}>
    <path d="M -15 -41 Q -15 -57 0 -57 Q 15 -57 15 -41 Z" fill={C.yellow} {...L(d)}/><path d="M -9 -46 Q -8 -53 -2 -54" fill="none" stroke={C.white} strokeWidth={d * 0.8} strokeLinecap="round" opacity={0.8}/>
  </g>;
  return <g transform={`translate(0 5) rotate(${sh * 4} 0 50)`}>
    <path d="M -22 40 L -30 54 M 22 40 L 30 54" fill="none" {...L(w * 1.1)}/>
    {bell(-1)}{bell(1)}
    <path d="M 0 -36 L 0 -46" {...L(d)}/><circle cy={-48} r={4} fill={C.ink}/>
    <circle cy={6} r={41} fill={C.red} {...L(w)}/>
    <circle cy={6} r={31} fill={C.white} {...L(d)}/>
    <path d="M -34 -4 Q -33 -19 -20.5 -23.5" fill="none" stroke={C.white} strokeWidth={d * 0.8} strokeLinecap="round" opacity={0.7}/>
    {Array.from({length: 12}, (_, i) => <path key={i} d="M 0 -26 L 0 -22" stroke={C.ink} strokeWidth={i % 3 === 0 ? d * 1.1 : d * 0.6} strokeLinecap="round" transform={`translate(0 6) rotate(${i * 30})`}/>)}
    <g transform="translate(0 6)">
      <path d="M 0 0 L 0 -16" stroke={C.ink} strokeWidth={d * 1.3} strokeLinecap="round" transform="rotate(-62)"/>
      <path d="M 0 0 L 0 -23" stroke={C.ink} strokeWidth={d} strokeLinecap="round" transform={`rotate(${min})`}/>
      <path d="M 0 5 L 0 -24" stroke={C.red} strokeWidth={d * 0.5} strokeLinecap="round" transform={`rotate(${sec})`}/>
      <circle r={3.6} fill={C.ink}/>
    </g>
  </g>;
};

// ---- heart: it beats (lub-dub) ---------------------------------------------------------------------------------------------------------------
const Heart: React.FC<P> = ({f, w}) => {
  const d = w * 0.6, k = f % 42, v = 0.13 * bump(k, 7, 9) + 0.09 * bump(k, 16, 9), sc = 1 + v, ray = c01((v - 0.02) / 0.1);
  const H = "M 0 49 C -70 4 -52 -45 -26 -45 C -12 -45 -2 -37 0 -27 C 2 -37 12 -45 26 -45 C 52 -45 70 4 0 49 Z";
  return <g transform="translate(0 -1)">
    <g transform={`translate(0 2) scale(${sc}) translate(0 -2)`}>
      <path d={H} fill={C.red} {...L(w)}/>
      <path d="M 40 -14 C 38 10 20 30 0 49 C 18 38 40 16 40 -14 Z" fill={C.redDark} opacity={0.55}/>
      <path d="M -38 -14 C -38 -30 -26 -36 -18 -34" fill="none" stroke={C.white} strokeWidth={d * 1.5} strokeLinecap="round" opacity={0.85}/>
      <circle cx={-38} cy={-3} r={d * 0.8} fill={C.white} opacity={0.85}/>
      <path d={H} fill="none" {...L(w)}/>
    </g>
    <g opacity={ray} stroke={C.ink} strokeWidth={d} strokeLinecap="round">
      <path d="M -50 -44 L -57 -52 M -58 -32 L -67 -34 M 50 -44 L 57 -52 M 58 -32 L 67 -34"/>
    </g>
  </g>;
};

// ---- tree: a round fruit tree; the canopy sways and a leaf drifts down -----------------------------------------------------------------------------
const Tree: React.FC<P> = ({f, w, id}) => {
  const d = w * 0.6, sway = Math.sin(f / 16) * 2.4, p = (f % 100) / 100;
  const blobs: [number, number, number][] = [[0, -20, 31], [-27, -4, 23], [27, -4, 23], [-15, -38, 21], [15, -40, 21]];
  return <g transform="translate(0 4)">
    <path d="M -9 50 Q -7 30 -6 10 L 6 10 Q 7 30 9 50 Z" fill={C.floor} {...L(d)}/>
    <path d="M 0 22 L 0 48" stroke={C.floorDark} strokeWidth={d * 0.6} strokeLinecap="round" opacity={0.7}/>
    <g transform={`rotate(${sway} 0 40)`}>
      {blobs.map(([x, y, r], i) => <circle key={`o${i}`} cx={x} cy={y} r={r} fill={C.green} stroke={C.ink} strokeWidth={w * 2}/>)}
      {blobs.map(([x, y, r], i) => <circle key={`f${i}`} cx={x} cy={y} r={r} fill={C.green}/>)}
      <clipPath id={`${id}t`}>{blobs.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r}/>)}</clipPath>
      <path clipPath={`url(#${id}t)`} d="M -50 4 Q -22 16 -2 8 Q 18 16 50 4 L 50 40 L -50 40 Z" fill={C.greenDark} opacity={0.6}/>
      <circle cx={-14} cy={-36} r={11} fill={C.lime} opacity={0.55}/><circle cx={-30} cy={-8} r={7} fill={C.lime} opacity={0.5}/>
      {[[-16, -14], [14, -26], [20, 2], [-8, -48]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y + Math.sin(f / 10 + i * 2) * 0.9})`}>
        <circle r={6.2} fill={C.red} {...L(d * 0.7)}/><circle cx={-1.8} cy={-1.8} r={1.6} fill={C.white} opacity={0.85}/></g>)}
    </g>
    <g transform={`translate(${34 + Math.sin(p * 9) * 8} ${-4 + p * 60}) rotate(${p * 280})`} opacity={Math.min(1, p * 8) * (1 - c01((p - 0.8) / 0.2))}>
      <path d="M -8 0 Q 0 -9 8 0 Q 0 9 -8 0 Z" fill={C.lime} {...L(d * 0.7)}/>
    </g>
  </g>;
};

// ---- scale: a balance scale; the beam rocks, the pans hang level --------------------------------------------------------------------------------------
const Scale: React.FC<P> = ({f, w}) => {
  const d = w * 0.6, ang = Math.sin(f / 17) * 7, r = ang * Math.PI / 180, L0 = 38;
  const e = [-1, 1].map((sg) => [sg * L0 * Math.cos(r), -34 + sg * L0 * Math.sin(r)] as const);
  const pan = (x: number, y: number, key: number) => <g key={key} transform={`translate(${x} ${y})`}>
    <path d="M 0 0 L -17 30 M 0 0 L 17 30" fill="none" stroke={C.ink} strokeWidth={d * 0.7} strokeLinecap="round"/>
    {key === 0 ? <><rect x={-8} y={14} width={16} height={16} rx={3} fill={C.blue} {...L(d * 0.8)}/><rect x={-4} y={18} width={5} height={7} rx={1.5} fill={C.white} opacity={0.6}/></>
      : <><circle cx={-6} cy={23} r={7} fill={C.yellow} {...L(d * 0.8)}/><circle cx={6} cy={23} r={7} fill={C.gold} {...L(d * 0.8)}/></>}
    <path d="M -22 30 L 22 30 Q 20 44 0 44 Q -20 44 -22 30 Z" fill={C.orange} {...L(d)}/>
    <path d="M -14 34 Q -12 39 -6 40" fill="none" stroke={C.white} strokeWidth={d * 0.8} strokeLinecap="round" opacity={0.7}/>
  </g>;
  return <g transform="translate(0 4)">
    <path d="M -26 54 L 26 54 L 16 42 L -16 42 Z" fill={C.royal} {...L(d)}/>
    <rect x={-6} y={-30} width={12} height={74} fill={C.blue} {...L(d)}/>
    <rect x={-2.5} y={-24} width={3.4} height={60} fill={C.white} opacity={0.5}/>
    {e.map(([x, y], i) => pan(x, y, i))}
    <g transform={`rotate(${ang} 0 -34)`}>
      <rect x={-L0 - 6} y={-40} width={(L0 + 6) * 2} height={12} rx={6} fill={C.gold} {...L(d)}/>
      <rect x={-L0 - 1} y={-37} width={30} height={3.5} rx={1.7} fill={C.white} opacity={0.6}/>
      <circle cx={-L0} cy={-34} r={3.4} fill={C.ink}/><circle cx={L0} cy={-34} r={3.4} fill={C.ink}/>
    </g>
    <circle cx={0} cy={-34} r={9} fill={C.yellow} {...L(d)}/><circle cx={0} cy={-34} r={2.8} fill={C.ink}/>
  </g>;
};

const DRAW: Record<IconName, React.FC<P>> = {book: Book, school: School, hospital: Hospital, house: House, ring: Ring, rupee: Rupee, calendar: Calendar, pram: Pram, clock: Clock, heart: Heart, tree: Tree, scale: Scale};

export const Icon: React.FC<{name: IconName; x: number; y: number; s: number; f: number; shadow?: boolean; seed?: number}> = ({name, x, y, s, f, shadow = false, seed = 0}) => {
  const Draw = DRAW[name];
  if (!Draw) throw new Error(`unknown icon "${name}" (known: ${ICONS.join(", ")})`);
  const w = 8 / Math.sqrt(Math.max(0.15, s));
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {shadow && <ellipse cx={0} cy={58} rx={46} ry={7} fill={C.shadow}/>}
    <Draw f={f + seed * 23} w={w} id={`ic-${name}-${seed}`}/>
  </g>;
};
