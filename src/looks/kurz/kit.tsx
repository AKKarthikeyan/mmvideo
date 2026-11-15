// KURZ look (Namakkal comparison, 29 Oct 2026): a Kurzgesagt-like flat vector look for the long-form engine. Dark navy space, flat
// geometric shapes with no outlines, a lit side and a shade side on every shape, soft glows, bright saturated accents, rounded type.
// Everything is original and drawn in code: no characters, birds, logos or frames copied from any channel.
// Numbers go through KNum, which throws if drawn before its lock frame, exactly like the cartoon look.
import React from "react";
import {Easing, interpolate, spring} from "remotion";
import {assertLocked, shown} from "../shared/lock";
import type {LookNum} from "../shared/types";

export const K = {
  night: "#0B1433", deep: "#13215A", mid: "#203487", soft: "#2E47A8", haze: "#4B63C9",
  teal: "#2EC4B6", tealD: "#16897F", tealL: "#8BF0E6", orange: "#FF9F1C", orangeD: "#D9700A", orangeL: "#FFC86B",
  pink: "#F25F5C", pinkD: "#B8393A", yellow: "#FFD25A", yellowL: "#FFF0B0", purple: "#7B6CF6", purpleD: "#5241C9",
  white: "#F4F7FF", cream: "#FFF1D6", creamD: "#E8CFA3", skin: "#E7A97A", skinD: "#C9865A", ink: "#0B1433",
} as const;
export const ROUND = "'LK Bricolage', 'Arial Rounded MT Bold', Arial, sans-serif";
export const SANS = "'LK Schibsted', 'Helvetica Neue', Arial, sans-serif";
export const FPS = 30;

export const pop = (f: number, at: number, stiff = 150) => f < at ? 0 : spring({frame: f - at, fps: FPS, config: {damping: 13, stiffness: stiff, mass: 0.9}});
export const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
export const easeIO = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic)});

export const KNum: React.FC<{n: LookNum; f: number; where?: string}> = ({n, f, where}) => { assertLocked(n, f, where); return <>{n.text}</>; };

// A glowing number with a small label under it on a translucent panel. No outline, no hard shadow: light, not ink.
export const KBadge: React.FC<{n: LookNum; f: number; at: number; caption?: string; color?: string; size?: number}> = ({n, f, at, caption, color = K.yellow, size = 150}) => {
  if (!shown(n, f)) return null;
  const t = pop(f, at);
  if (t <= 0.001) return null;
  return <div style={{display: "inline-flex", flexDirection: "column", alignItems: "center", padding: `16px 38px ${caption ? 18 : 14}px`, borderRadius: 34,
    background: "rgba(11,20,51,0.62)", boxShadow: `0 0 0 3px rgba(255,255,255,0.08), 0 18px 40px rgba(0,0,0,0.35)`, transform: `scale(${t}) translateY(${(1 - t) * 30}px)`, opacity: Math.min(1, t * 1.4)}}>
    <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: size, lineHeight: 1, color, letterSpacing: -1, whiteSpace: "nowrap", textShadow: `0 0 ${size * 0.25}px ${color}88`}}><KNum n={n} f={f} where="kbadge"/></div>
    {caption && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: Math.max(24, Math.round(size * 0.2)), color: K.white, opacity: 0.86, marginTop: 8, whiteSpace: "nowrap"}}>{caption}</div>}
  </div>;
};

export const KPill: React.FC<{text: string; f: number; at: number; color?: string; size?: number}> = ({text, f, at, color = K.teal, size = 30}) => {
  const t = ease(f, at, at + 12);
  if (t <= 0.001) return null;
  return <div style={{display: "inline-flex", alignItems: "center", gap: 14, padding: "10px 24px 10px 16px", borderRadius: 999, background: "rgba(244,247,255,0.10)",
    fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: 2, color: K.white, whiteSpace: "nowrap", opacity: t, transform: `translateX(${(1 - t) * -24}px)`}}>
    <span style={{width: size * 0.5, height: size * 0.5, borderRadius: "50%", background: color, boxShadow: `0 0 14px ${color}`}}/>{text}
  </div>;
};

// Night sky with soft stars that twinkle. Every star position is fixed by a seed, so a still is stable.
export const Stars: React.FC<{f: number; n?: number; seed?: number; h?: number}> = ({f, n = 70, seed = 3, h = 1080}) => {
  let s = seed * 9973; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return <g>{Array.from({length: n}, (_, i) => { const x = r() * 1920, y = r() * h, rad = 1 + r() * 2.6, ph = r() * 6.28;
    return <circle key={i} cx={x} cy={y} r={rad} fill={K.white} opacity={0.25 + 0.35 * (0.5 + 0.5 * Math.sin(f / 18 + ph))}/>; })}</g>;
};

export const Glow: React.FC<{id: string; sd?: number}> = ({id, sd = 14}) => <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur stdDeviation={sd} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>;

// ---- art: every shape has a lit half and a shade half (a straight cut), the look's signature ---------------------------------------
export const Egg: React.FC<{x: number; y: number; s: number; f: number; seed?: number}> = ({x, y, s, f, seed = 0}) => {
  const bob = Math.sin((f + seed * 20) / 22) * 6, id = `kegg${seed}${Math.round(x)}`;
  const shape = "M 0 -60 C 34 -60 50 -8 50 18 C 50 48 28 62 0 62 C -28 62 -50 48 -50 18 C -50 -8 -34 -60 0 -60 Z";
  return <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
    <ellipse cx={0} cy={78} rx={40} ry={8} fill="#000" opacity={0.25}/>
    <clipPath id={id}><path d={shape}/></clipPath>
    <path d={shape} fill={K.cream}/>
    <g clipPath={`url(#${id})`}><path d="M 8 -80 L 80 -80 L 80 80 L -40 80 Z" fill={K.creamD}/></g>
    <ellipse cx={-20} cy={-22} rx={9} ry={16} fill="#fff" opacity={0.85} transform="rotate(18 -20 -22)"/>
  </g>;
};

export const Hen: React.FC<{x: number; y: number; s: number; f: number; seed?: number; flip?: boolean}> = ({x, y, s, f, seed = 0, flip}) => {
  const k = (f + seed * 31) % 84, peck = Math.exp(-((k - 22) ** 2) / 30) * 22;
  return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={58} rx={46} ry={8} fill="#000" opacity={0.22}/>
    <path d="M -50 0 L -70 -36 L -40 -18 Z" fill={K.pinkD}/>
    <path d="M -48 6 C -48 -30 10 -34 26 -8 C 40 14 30 48 0 50 C -30 52 -48 34 -48 6 Z" fill={K.orange}/>
    <path d="M -48 6 C -48 28 -30 52 0 50 C 30 48 40 14 26 -8 L -10 30 Z" fill={K.orangeD}/>
    <path d="M -6 50 L -8 60 M 10 49 L 12 60" stroke={K.yellow} strokeWidth={6} strokeLinecap="round"/>
    <g transform={`rotate(${peck} 20 -10)`}>
      <circle cx={30} cy={-24} r={18} fill={K.orange}/>
      <path d="M 30 -42 A 18 18 0 0 1 48 -24 L 30 -24 Z" fill={K.orangeL} opacity={0.6}/>
      <path d="M 20 -40 Q 26 -54 30 -42 Q 36 -56 40 -40 Z" fill={K.pink}/>
      <path d="M 46 -26 L 60 -20 L 46 -14 Z" fill={K.yellow}/>
      <circle cx={36} cy={-27} r={3.5} fill={K.ink}/>
    </g>
  </g>;
};

// A person built from a capsule body and a round head: no outline, no mouth, dot eyes; lit and shade halves.
export const Person: React.FC<{x: number; y: number; h: number; f: number; color?: string; shade?: string; flip?: boolean; seed?: number}> =
  ({x, y, h, f, color = K.teal, shade = K.tealD, flip, seed = 0}) => {
  const s = h / 300, bob = Math.sin((f + seed * 17) / 16) * 3, blink = (f + seed * 41) % 100 < 4;
  return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={4} rx={70} ry={12} fill="#000" opacity={0.22}/>
    <g transform={`translate(0 ${bob})`}>
      <rect x={-42} y={-60} width={30} height={64} rx={15} fill={K.purpleD}/><rect x={12} y={-60} width={30} height={64} rx={15} fill={K.purpleD}/>
      <rect x={-60} y={-196} width={120} height={150} rx={56} fill={color}/>
      <path d="M 10 -196 L 4 -196 Q 60 -196 60 -140 L 60 -102 Q 60 -46 4 -46 L 10 -46 Z" fill={shade}/>
      <circle cx={0} cy={-238} r={46} fill={K.skin}/>
      <path d="M 10 -282 A 46 46 0 0 1 10 -194 Z" fill={K.skinD}/>
      <path d="M -46 -246 Q -40 -292 4 -288 Q 44 -286 46 -250 Q 20 -268 -46 -246 Z" fill={K.ink}/>
      {blink ? <><rect x={-20} y={-240} width={12} height={3} fill={K.ink}/><rect x={8} y={-240} width={12} height={3} fill={K.ink}/></>
        : <><circle cx={-14} cy={-238} r={6} fill={K.ink}/><circle cx={14} cy={-238} r={6} fill={K.ink}/></>}
    </g>
  </g>;
};

export const Coin: React.FC<{x: number; y: number; s: number; f: number}> = ({x, y, s, f}) => {
  const spin = Math.abs(Math.cos(f / 26));
  return <g transform={`translate(${x} ${y}) scale(${s * Math.max(0.15, spin)} ${s})`}>
    <circle r={50} fill={K.yellow}/><path d="M 0 -50 A 50 50 0 0 1 0 50 Z" fill={K.orange}/>
    <circle r={36} fill="none" stroke={K.yellowL} strokeWidth={5} opacity={0.6}/>
    <text x={0} y={18} textAnchor="middle" fontFamily={ROUND} fontWeight={800} fontSize={54} fill={K.orangeD}>₹</text>
  </g>;
};

export const Sun: React.FC<{x: number; y: number; r: number; f: number}> = ({x, y, r, f}) => <g>
  {[3, 2.2, 1.6].map((k, i) => <circle key={i} cx={x} cy={y} r={r * k * (1 + 0.02 * Math.sin(f / 20 + i))} fill={K.orangeL} opacity={0.07 + i * 0.04}/>)}
  <circle cx={x} cy={y} r={r} fill={K.yellow}/><path d={`M ${x} ${y - r} A ${r} ${r} 0 0 1 ${x} ${y + r} Z`} fill={K.orange} opacity={0.5}/>
</g>;

// Dawn landscape: graded sky, sun, three hill layers with lit crests, a few palms; used by the stage scene's "village" set.
export const Dawn: React.FC<{f: number; id: string}> = ({f, id}) => <svg width={1920} height={1080} style={{position: "absolute"}}>
  <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor={K.night}/><stop offset="0.55" stopColor={K.purpleD}/><stop offset="0.8" stopColor={K.pink}/><stop offset="1" stopColor={K.orangeL}/>
  </linearGradient></defs>
  <rect width={1920} height={1080} fill={`url(#${id})`}/>
  <Stars f={f} n={50} h={420}/>
  <Sun x={1380} y={640} r={90} f={f}/>
  <path d={`M 0 640 Q 300 ${560 + Math.sin(f / 60) * 4} 640 620 T 1300 600 T 1920 610 L 1920 1080 L 0 1080 Z`} fill={K.purple}/>
  <path d="M 0 720 Q 420 650 900 720 T 1920 700 L 1920 1080 L 0 1080 Z" fill={K.tealD}/>
  <path d="M 0 720 Q 420 650 900 720 T 1920 700" fill="none" stroke={K.teal} strokeWidth={10}/>
  <path d="M 0 820 Q 600 770 1200 820 T 1920 800 L 1920 1080 L 0 1080 Z" fill={K.deep}/>
  {[220, 1720].map((px, i) => <g key={px} transform={`translate(${px} 760) rotate(${Math.sin(f / 30 + i) * 2})`}>
    <path d="M -6 0 Q 0 -150 12 -260 L 22 -260 Q 12 -150 8 0 Z" fill={K.night}/>
    {[-60, -20, 20, 60, 100].map((a) => <ellipse key={a} cx={16} cy={-262} rx={80} ry={16} fill={K.night} transform={`rotate(${a} 16 -262)`}/>)}
  </g>)}
</svg>;
