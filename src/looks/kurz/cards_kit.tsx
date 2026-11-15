// KURZ look, cards builder's shared art (29 Oct 2026): the space backdrop, the egg planet, the chapter heroes, grain and light.
// Used by chapter.tsx, title.tsx, quote.tsx, split.tsx, statement.tsx and doc.tsx. Everything is original and drawn in code.
// Every motion is a smooth function of the fractional logical frame f (60 fps renders sample half frames): no Math.floor, no steps.
import React from "react";
import {spring} from "remotion";
import {K, ROUND, SANS, FPS} from "./kit";

// ---- small maths ----------------------------------------------------------------------------------------------------------------
export const rng = (seed: number) => { let s = Math.abs(Math.round(seed * 9973 + 11)) % 2147483647 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
export const hashStr = (str: string) => { let h = 7; for (const c of str) h = (h * 31 + c.charCodeAt(0)) % 100003; return h; };
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
// A spring with a gentle overshoot that starts at frame `at` (fractional frames are fine).
export const popIn = (f: number, at: number, stiff = 120, damping = 12) => f < at ? 0 : spring({frame: f - at, fps: FPS, config: {damping, stiffness: stiff, mass: 0.9}});
// Slow camera drift (px) shared by all layers; each layer multiplies it by its depth for parallax.
export const drift = (f: number, seed = 0) => ({x: Math.sin(f / 170 + seed) * 22 + Math.sin(f / 67 + seed * 2) * 5, y: Math.cos(f / 210 + seed) * 12 + Math.sin(f / 90 + seed) * 3});
// Rough width of a run of type at size px (rounded display face, bold caps ≈ 0.62 em, mixed case ≈ 0.55 em).
export const textW = (s: string, px: number, k?: number) => s.length * px * (k ?? (s === s.toUpperCase() ? 0.58 : 0.52));
export const fitPx = (s: string, width: number, max: number, min: number, k?: number) => clamp(width / (s.length * (k ?? (s === s.toUpperCase() ? 0.58 : 0.52))), min, max);
// Greedy word wrap by estimated width, used where each line must be addressed (highlighter sweeps).
export const wrapWords = (s: string, px: number, width: number, k = 0.55): string[] => {
  const out: string[] = []; let cur = "";
  for (const w of s.split(" ")) { const next = cur ? `${cur} ${w}` : w; if (cur && textW(next, px, k) > width) { out.push(cur); cur = w; } else cur = next; }
  if (cur) out.push(cur);
  return out;
};

// ---- era tones ----------------------------------------------------------------------------------------------------------------
export type Tone = "night" | "dawn" | "warm" | "sepia";
const SKY: Record<Tone, [string, string, string]> = {
  night: [K.mid, K.deep, K.night],
  dawn: ["#3B3C9E", K.deep, K.night],
  warm: ["#7A3B5C", "#3A1F4F", "#160F2E"],
  sepia: ["#7A5A3A", "#3D2E22", "#1A140F"],
};
const NEB: Record<Tone, string[]> = {
  night: [K.purple, K.teal, K.pink],
  dawn: [K.purple, K.pink, K.orange],
  warm: [K.orange, K.pink, K.purple],
  sepia: [K.orangeL, K.orange, K.creamD],
};

// ---- the space backdrop: graded sky, drifting nebula light, three star layers with parallax, dust motes ---------------------------
export const Space: React.FC<{f: number; id: string; seed?: number; tone?: Tone; cx?: number; cy?: number; stars?: number; bare?: boolean; h?: number}> =
  ({f, id, seed = 3, tone = "night", cx = 0.62, cy = 0.42, stars = 1, bare = false, h = 1080}) => {
  const d = drift(f, seed), r = rng(seed), sky = SKY[tone], neb = NEB[tone];
  const far = Array.from({length: Math.round(150 * stars)}, () => [r() * 2000 - 40, r() * (h + 60) - 30, 0.6 + r() * 1.1, r() * 6.28] as const);
  const mid = Array.from({length: Math.round(46 * stars)}, () => [r() * 2000 - 40, r() * (h + 60) - 30, 1.4 + r() * 1.8, r() * 6.28] as const);
  const big = Array.from({length: Math.round(9 * stars)}, () => [r() * 1900 + 10, r() * h * 0.85 + 20, 6 + r() * 7, r() * 6.28] as const);
  const dust = Array.from({length: 34}, () => [r() * 1920, r() * 1080, 1.5 + r() * 2.5, 0.25 + r() * 0.5, r() * 6.28] as const);
  return <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
    <defs>
      <radialGradient id={`${id}-sky`} cx={cx} cy={cy} r="0.95"><stop offset="0" stopColor={sky[0]}/><stop offset="0.55" stopColor={sky[1]}/><stop offset="1" stopColor={sky[2]}/></radialGradient>
      {neb.map((c, i) => <radialGradient key={i} id={`${id}-n${i}`}><stop offset="0" stopColor={c} stopOpacity={0.32}/><stop offset="0.5" stopColor={c} stopOpacity={0.1}/><stop offset="1" stopColor={c} stopOpacity={0}/></radialGradient>)}
      <radialGradient id={`${id}-vig`} cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stopColor="#000" stopOpacity={0}/><stop offset="1" stopColor="#000" stopOpacity={0.55}/></radialGradient>
    </defs>
    {!bare && <rect width={1920} height={1080} fill={`url(#${id}-sky)`}/>}
    {/* nebula light: three soft clouds that breathe and drift very slowly */}
    {!bare && neb.map((_, i) => { const a = f / (260 + i * 70) + i * 2.1 + seed;
      return <ellipse key={i} cx={[420, 1500, 960][i] + Math.sin(a) * 60 + d.x * 0.15} cy={[260, 760, 520][i] + Math.cos(a) * 40 + d.y * 0.15}
        rx={[760, 820, 1000][i]} ry={[420, 460, 380][i]} fill={`url(#${id}-n${i})`} transform={`rotate(${[-18, 14, -6][i]} 960 540)`}/>; })}
    <g transform={`translate(${d.x * 0.2} ${d.y * 0.2})`}>
      {far.map(([x, y, rad, ph], i) => <circle key={i} cx={x} cy={y} r={rad} fill={K.white} opacity={0.18 + 0.22 * (0.5 + 0.5 * Math.sin(f / 31 + ph))}/>)}
    </g>
    <g transform={`translate(${d.x * 0.5} ${d.y * 0.5})`}>
      {mid.map(([x, y, rad, ph], i) => <circle key={i} cx={x} cy={y} r={rad} fill={i % 7 === 0 ? K.yellowL : K.white} opacity={0.3 + 0.4 * (0.5 + 0.5 * Math.sin(f / 23 + ph))}/>)}
    </g>
    <g transform={`translate(${d.x * 0.8} ${d.y * 0.8})`}>
      {big.map(([x, y, rad, ph], i) => { const tw = 0.55 + 0.45 * Math.sin(f / 37 + ph), s = rad * (0.8 + 0.3 * tw);
        return <g key={i} transform={`translate(${x} ${y})`} opacity={0.5 + 0.5 * tw}>
          <circle r={s * 1.6} fill={K.white} opacity={0.08}/>
          <path d={`M 0 ${-s * 2.2} Q ${s * 0.18} ${-s * 0.18} ${s * 2.2} 0 Q ${s * 0.18} ${s * 0.18} 0 ${s * 2.2} Q ${-s * 0.18} ${s * 0.18} ${-s * 2.2} 0 Q ${-s * 0.18} ${-s * 0.18} 0 ${-s * 2.2} Z`} fill={K.white}/>
        </g>; })}
    </g>
    <g transform={`translate(${d.x * 1.3} ${d.y * 1.3})`}>
      {dust.map(([x, y, rad, sp, ph], i) => { const yy = ((y - f * sp) % 1180 + 1180) % 1180 - 50, xx = x + Math.sin(f / 50 + ph) * 18;
        const edge = Math.min(1, (yy + 50) / 160, (1130 - yy) / 160);
        return <circle key={i} cx={xx} cy={yy} r={rad} fill={K.yellowL} opacity={0.22 * edge * (0.6 + 0.4 * Math.sin(f / 19 + ph))}/>; })}
    </g>
    {!bare && <rect width={1920} height={1080} fill={`url(#${id}-vig)`}/>}
  </svg>;
};

// Fine static grain over the whole frame (a texture, never animated, so it never flickers).
export const Grain: React.FC<{id: string; o?: number}> = ({id, o = 0.07}) => <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, pointerEvents: "none", mixBlendMode: "overlay", opacity: o}}>
  <filter id={`${id}-gr`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={4} stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
  <rect width={1920} height={1080} filter={`url(#${id}-gr)`}/>
</svg>;

// A shooting star that crosses once every `every` frames: a soft streak, eased, never a flash.
export const Meteor: React.FC<{f: number; every?: number; seed?: number}> = ({f, every = 260, seed = 0}) => {
  const ph = ((f + seed * 97) % every) / 60;
  if (ph > 1) return null;
  const r = rng(seed + Math.floor((f + seed * 97) / every)), x0 = 300 + r() * 1100, y0 = 60 + r() * 220;
  const t = 1 - (1 - ph) ** 2, x = x0 + t * 420, y = y0 + t * 170, o = Math.sin(ph * Math.PI) * 0.8;
  return <g opacity={o}><line x1={x - 160} y1={y - 65} x2={x} y2={y} stroke={K.white} strokeWidth={3} strokeLinecap="round" opacity={0.5}/><circle cx={x} cy={y} r={4} fill={K.white}/></g>;
};

// ---- the egg planet: lit and shade halves, a straight terminator cut, speckles that rotate with the surface, an atmosphere, a ring -
const EGG = "M 0 -60 C 34 -60 50 -8 50 18 C 50 48 28 62 0 62 C -28 62 -50 48 -50 18 C -50 -8 -34 -60 0 -60 Z";
export const EggPlanet: React.FC<{f: number; id: string; x: number; y: number; r: number; ring?: string; tilt?: number; moons?: number; spin?: number; glow?: string; shade?: number}> =
  ({f, id, x, y, r, ring = K.teal, tilt = -16, moons = 2, spin = 1, glow = K.orangeL, shade = 0.5}) => {
  const s = r / 50, rot = Math.sin(f / 140) * 3;
  const rr = rng(7);
  const spots = Array.from({length: 26}, () => [rr() * 6.28, -50 + rr() * 104, 2 + rr() * 5] as const);
  const ringRx = 96, ringRy = 22;
  const moonEls = (front: boolean) => Array.from({length: moons}, (_, i) => {
    const a = f / (70 + i * 30) * spin + i * 2.4, mx = Math.cos(a) * ringRx, my = Math.sin(a) * ringRy;
    if ((Math.sin(a) > 0) !== front) return null;
    const ms = 0.12 + i * 0.05, depth = 0.85 + 0.15 * Math.sin(a);
    return <g key={i} transform={`translate(${mx} ${my}) scale(${ms * depth})`}>
      <path d={EGG} fill={i % 2 ? K.yellowL : K.white}/><path d="M 10 -70 L 70 -70 L 70 70 L -30 70 Z" fill={K.creamD} clipPath={`url(#${id}-ec)`}/>
    </g>;
  });
  const ringArc = (front: boolean) => <path d={front ? `M ${-ringRx} 0 A ${ringRx} ${ringRy} 0 0 0 ${ringRx} 0` : `M ${-ringRx} 0 A ${ringRx} ${ringRy} 0 0 1 ${ringRx} 0`}
    fill="none" stroke={ring} strokeWidth={front ? 3.2 : 2.6} opacity={front ? 0.85 : 0.45}/>;
  return <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
    <defs>
      <clipPath id={`${id}-ec`}><path d={EGG}/></clipPath>
      <radialGradient id={`${id}-atm`}><stop offset="0.45" stopColor={glow} stopOpacity={0.5}/><stop offset="0.7" stopColor={glow} stopOpacity={0.14}/><stop offset="1" stopColor={glow} stopOpacity={0}/></radialGradient>
      <linearGradient id={`${id}-bd`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF8E8"/><stop offset="0.6" stopColor={K.cream}/><stop offset="1" stopColor={K.creamD}/></linearGradient>
    </defs>
    <ellipse cx={0} cy={2} rx={95 * (1 + 0.02 * Math.sin(f / 30))} ry={105 * (1 + 0.02 * Math.sin(f / 30))} fill={`url(#${id}-atm)`}/>
    <g transform={`rotate(${tilt})`}>{ringArc(false)}{[0.82, 1.18].map((k) => <ellipse key={k} rx={ringRx * k} ry={ringRy * k} fill="none" stroke={ring} strokeWidth={0.8} opacity={0.18}
      strokeDasharray={k > 1 ? "2 4" : undefined}/>)}{moonEls(false)}</g>
    <path d={EGG} fill={`url(#${id}-bd)`}/>
    <g clipPath={`url(#${id}-ec)`}>
      {/* surface speckles ride round the egg as it turns */}
      {spots.map(([th, sy, sr], i) => { const a = th + f / 220 * spin, c = Math.cos(a); if (c < 0.05) return null;
        const halfW = 50 * Math.sqrt(Math.max(0, 1 - ((sy - 6) / 62) ** 2));
        return <ellipse key={i} cx={Math.sin(a) * halfW} cy={sy} rx={sr * c} ry={sr * 0.8} fill={i % 3 ? K.creamD : "#D9B486"} opacity={0.75}/>; })}
      {/* stipple hatch on the shade side */}
      {Array.from({length: 7}, (_, i) => <line key={i} x1={14 + i * 7} y1={-60} x2={-30 + i * 7} y2={70} stroke={K.orangeD} strokeWidth={0.5} opacity={0.06}/>)}
      <path d="M 6 -80 L 90 -80 L 90 90 L -46 90 Z" fill={K.orangeD} opacity={shade * 0.55}/>
      <path d={EGG} fill="none" stroke="#fff" strokeWidth={3} opacity={0.5} transform="translate(-2 -2)"/>
    </g>
    <ellipse cx={-22} cy={-24} rx={8} ry={17} fill="#fff" opacity={0.8} transform="rotate(20 -22 -24)"/>
    <ellipse cx={-12} cy={-44} rx={3} ry={5} fill="#fff" opacity={0.7}/>
    <g transform={`rotate(${tilt})`}>{ringArc(true)}{moonEls(true)}</g>
  </g>;
};

// ---- a yolk-sun with eggs on three orbits (a second planet scene, for variety between statements) -------------------------------
export const YolkSystem: React.FC<{f: number; id: string; x: number; y: number; s?: number; tilt?: number}> = ({f, id, x, y, s = 1, tilt = -10}) => {
  const orbits = [[240, 0.34, 1.0, 0.6], [330, 0.32, 0.62, 0.78], [410, 0.3, 0.42, 0.52]] as const;
  const eggs = (front: boolean) => orbits.map(([rx, k, w, es], i) => {
    const a = f / 90 * w + i * 2.2, ex = Math.cos(a) * rx, ey = Math.sin(a) * rx * k;
    if ((Math.sin(a) > 0) !== front) return null;
    const depth = 0.85 + 0.15 * Math.sin(a);
    return <g key={i} transform={`translate(${ex} ${ey}) rotate(${-tilt}) scale(${es * depth})`}>
      <ellipse cx={0} cy={0} rx={70} ry={80} fill={K.yellowL} opacity={0.12}/>
      <path d={EGG} fill={i === 1 ? K.white : K.cream}/><path d="M 8 -80 L 80 -80 L 80 80 L -40 80 Z" fill={K.creamD} clipPath={`url(#${id}-yc)`}/>
      <ellipse cx={-20} cy={-22} rx={7} ry={14} fill="#fff" opacity={0.8} transform="rotate(18 -20 -22)"/>
    </g>;
  });
  return <g transform={`translate(${x} ${y}) scale(${s}) rotate(${tilt})`}>
    <defs>
      <clipPath id={`${id}-yc`}><path d={EGG}/></clipPath>
      <clipPath id={`${id}-ys`}><circle r={165}/></clipPath>
      <radialGradient id={`${id}-yg`}><stop offset="0.3" stopColor={K.yellow} stopOpacity={0.55}/><stop offset="0.6" stopColor={K.orange} stopOpacity={0.16}/><stop offset="1" stopColor={K.orange} stopOpacity={0}/></radialGradient>
    </defs>
    <circle r={430 * (1 + 0.02 * Math.sin(f / 26))} fill={`url(#${id}-yg)`}/>
    {orbits.map(([rx, k], i) => <ellipse key={i} rx={rx} ry={rx * k} fill="none" stroke={K.white} strokeWidth={3} opacity={0.34} strokeDasharray={i === 1 ? "6 10" : undefined}/>)}
    {eggs(false)}
    <g transform={`rotate(${-tilt})`}>
      <circle r={165} fill={K.yellow}/>
      <g clipPath={`url(#${id}-ys)`}>
        {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={Math.sin(f / 120 + i * 1.6) * 80} cy={-100 + i * 64} rx={130} ry={13} fill={K.orangeL} opacity={0.5}/>)}
        <path d="M 40 -190 L 220 -190 L 220 220 L -80 220 Z" fill={K.orange} opacity={0.75}/>
        <circle r={165} fill="none" stroke={K.yellowL} strokeWidth={9} opacity={0.8} transform="translate(-6 -6)"/>
      </g>
      <ellipse cx={-66} cy={-70} rx={26} ry={42} fill="#fff" opacity={0.5} transform="rotate(35 -66 -70)"/>
    </g>
    {eggs(true)}
  </g>;
};

// ---- chapter heroes: big detailed icons drawn round (0,0), about 520 px tall at s = 1 ------------------------------------------------
type HeroP = {f: number; id: string};

const BigHen: React.FC<HeroP & {red?: boolean}> = ({f, id, red}) => {
  const body = red ? K.orange : K.white, bodyD = red ? K.orangeD : "#BCC7E8", wing = red ? K.pinkD : "#DDE4F8";
  const k = f % 96, peck = Math.exp(-((k - 30) ** 2) / 40) * 26 + Math.exp(-((k - 44) ** 2) / 30) * 18;
  const breathe = 1 + 0.015 * Math.sin(f / 14), blink = Math.exp(-(((f + 40) % 130 - 6) ** 2) / 3) > 0.5;
  const BODY = "M -160 10 C -160 -100 -40 -120 50 -80 C 140 -40 150 80 70 140 C 10 185 -130 175 -160 10 Z";
  return <g>
    <ellipse cx={-10} cy={198} rx={190} ry={22} fill="#000" opacity={0.28}/>
    {[[-30, 150], [30, 150]].map(([lx], i) => <g key={i}><path d={`M ${lx} 140 L ${lx - 4} 192`} stroke={K.yellow} strokeWidth={13} strokeLinecap="round"/>
      <path d={`M ${lx - 4} 192 l -26 6 M ${lx - 4} 192 l 22 4 M ${lx - 4} 192 l -4 10`} stroke={K.orangeD} strokeWidth={8} strokeLinecap="round"/></g>)}
    <g transform={`scale(${breathe})`}>
      {[-34, -12, 10].map((a, i) => <path key={i} d="M -140 -10 C -230 -110 -240 -180 -210 -210 C -180 -150 -150 -100 -110 -40 Z" fill={i === 1 ? bodyD : body}
        transform={`rotate(${a + Math.sin(f / 26 + i) * 2} -140 -10)`}/>)}
      <clipPath id={`${id}-hb`}><path d={BODY}/></clipPath>
      <path d={BODY} fill={body}/>
      <g clipPath={`url(#${id}-hb)`}>
        <path d="M -220 120 L 220 -30 L 220 220 L -220 220 Z" fill={bodyD} opacity={0.9}/>
        {Array.from({length: 9}, (_, i) => <path key={i} d={`M ${-120 + i * 26} ${30 + (i % 3) * 18} q 12 14 24 0`} fill="none" stroke={bodyD} strokeWidth={4} opacity={0.5}/>)}
      </g>
      <g transform={`rotate(${Math.sin(f / 22) * 3} -40 10)`}>
        <path d="M -100 0 C -50 -50 50 -30 60 30 C 30 100 -70 96 -100 0 Z" fill={wing}/>
        <path d="M -100 0 C -70 96 30 100 60 30 L -10 60 Z" fill={bodyD} opacity={0.7}/>
        {[0, 1, 2].map((i) => <path key={i} d={`M ${-60 + i * 30} ${40 + i * 4} q 18 16 36 4`} fill="none" stroke={bodyD} strokeWidth={5} strokeLinecap="round"/>)}
      </g>
      <g transform={`rotate(${peck} 70 -50)`}>
        <path d="M 40 -70 C 60 -130 110 -150 140 -120 C 160 -90 140 -60 100 -40 Z" fill={body}/>
        <circle cx={115} cy={-140} r={58} fill={body}/>
        <path d="M 125 -198 A 58 58 0 0 1 125 -82 Z" fill={bodyD} opacity={0.55}/>
        {[[88, -200, 20], [114, -212, 24], [140, -204, 20]].map(([cx, cy, rr], i) => <circle key={i} cx={cx} cy={cy} r={rr} fill={i === 1 ? K.pink : K.pinkD}/>)}
        <path d="M 168 -150 L 214 -134 L 168 -118 Z" fill={K.yellow}/><path d="M 168 -134 L 214 -134 L 168 -118 Z" fill={K.orange}/>
        <path d="M 152 -112 q 18 0 16 34 q -24 -4 -16 -34 Z" fill={K.pink}/>
        {blink ? <rect x={124} y={-152} width={22} height={5} rx={2} fill={K.ink}/> : <><circle cx={134} cy={-150} r={10} fill={K.ink}/><circle cx={137} cy={-154} r={3.5} fill="#fff"/></>}
      </g>
    </g>
  </g>;
};

const BigChick: React.FC<HeroP> = ({f, id}) => {
  const hop = Math.max(0, Math.sin(f / 11)) ** 2 * 26, tilt = Math.sin(f / 23) * 6, blink = ((f + 20) % 110) < 4;
  return <g>
    <ellipse cx={0} cy={198} rx={180 - hop * 1.4} ry={20} fill="#000" opacity={0.26}/>
    <g transform={`translate(0 ${-hop}) rotate(${tilt} 0 120)`}>
      <clipPath id={`${id}-cb`}><circle cx={0} cy={60} r={130}/></clipPath>
      <circle cx={0} cy={60} r={130} fill={K.yellow}/>
      <g clipPath={`url(#${id}-cb)`}><path d="M -200 160 L 200 0 L 200 260 L -200 260 Z" fill={K.orange} opacity={0.75}/></g>
      <path d="M -40 60 C -90 40 -120 80 -110 120 C -70 120 -40 100 -40 60 Z" fill={K.orangeL}/>
      <circle cx={30} cy={-90} r={92} fill={K.yellow}/>
      <path d="M 52 -180 A 92 92 0 0 1 52 0 Z" fill={K.orange} opacity={0.5}/>
      <path d="M 10 -176 q 6 -30 22 -14 q 4 -26 20 -6" fill="none" stroke={K.yellow} strokeWidth={10} strokeLinecap="round"/>
      <path d="M 110 -100 L 160 -84 L 110 -66 Z" fill={K.orange}/><path d="M 110 -84 L 160 -84 L 110 -66 Z" fill={K.orangeD}/>
      {blink ? <rect x={52} y={-112} width={26} height={6} rx={3} fill={K.ink}/> : <><circle cx={64} cy={-110} r={13} fill={K.ink}/><circle cx={68} cy={-115} r={4.5} fill="#fff"/></>}
      <circle cx={-16} cy={-60} r={14} fill={K.pink} opacity={0.4}/>
    </g>
    {/* the half shell it came out of */}
    <g transform="translate(0 150)">
      <path d="M -170 0 L -130 -40 L -95 -6 L -55 -46 L -15 -8 L 25 -46 L 65 -6 L 105 -44 L 140 -4 L 172 -30 C 172 30 110 60 0 60 C -110 60 -170 40 -170 0 Z" fill={K.cream}/>
      <path d="M 25 -46 L 65 -6 L 105 -44 L 140 -4 L 172 -30 C 172 30 110 60 0 60 Z" fill={K.creamD}/>
    </g>
  </g>;
};

const BigEgg: React.FC<HeroP> = ({f, id}) => {
  const sw = Math.sin(f / 24) * 8;
  return <g>
    <ellipse cx={0} cy={205} rx={150} ry={18} fill="#000" opacity={0.3}/>
    <g transform="scale(3.1) translate(0 2)"><EggTex f={f} id={id}/></g>
    {/* a price tag on a string: the shape of a price, no digits */}
    <g transform={`translate(110 -130) rotate(${12 + sw} 0 0)`}>
      <path d="M 0 0 C 30 10 60 30 70 60" fill="none" stroke={K.white} strokeWidth={4} opacity={0.8}/>
      <g transform="translate(70 60) rotate(-20)">
        <path d="M 0 0 L 40 -26 L 150 -26 Q 162 -26 162 -14 L 162 54 Q 162 66 150 66 L 40 66 L 0 40 Z" fill={K.orange}/>
        <path d="M 100 -26 L 150 -26 Q 162 -26 162 -14 L 162 54 Q 162 66 150 66 L 70 66 Z" fill={K.orangeD}/>
        <circle cx={26} cy={20} r={8} fill={K.night}/>
        <text x={98} y={44} textAnchor="middle" fontFamily={ROUND} fontWeight={800} fontSize={64} fill={K.cream}>₹</text>
      </g>
    </g>
  </g>;
};
const EggTex: React.FC<HeroP> = ({f, id}) => <g>
  <clipPath id={`${id}-eg`}><path d={EGG}/></clipPath>
  <path d={EGG} fill={K.cream}/>
  <g clipPath={`url(#${id}-eg)`}>
    {Array.from({length: 18}, (_, i) => { const r = rng(i + 3), a = r() * 6.28 + f / 260, c = Math.cos(a); return c > 0.05 ? <ellipse key={i} cx={Math.sin(a) * 44} cy={-50 + r() * 100} rx={2.2 * c} ry={1.8} fill="#D9B486" opacity={0.7}/> : null; })}
    <path d="M 8 -80 L 80 -80 L 80 80 L -40 80 Z" fill={K.creamD}/>
    <path d={EGG} fill="none" stroke="#fff" strokeWidth={1.5} opacity={0.6} transform="translate(-1 -1)"/>
  </g>
  <ellipse cx={-20} cy={-22} rx={8} ry={16} fill="#fff" opacity={0.85} transform="rotate(18 -20 -22)"/>
</g>;

const RateSheet: React.FC<HeroP & {rows?: number; hi?: number}> = ({f, id, rows = 7, hi = 2}) => {
  const scan = (f / 90) % 1, W2 = 420, H2 = 540;
  return <g>
    <ellipse cx={20} cy={300} rx={230} ry={22} fill="#000" opacity={0.3}/>
    <rect x={-W2 / 2 + 26} y={-H2 / 2 + 30} width={W2} height={H2} rx={30} fill="#000" opacity={0.25}/>
    <clipPath id={`${id}-rs`}><rect x={-W2 / 2} y={-H2 / 2} width={W2} height={H2} rx={30}/></clipPath>
    <rect x={-W2 / 2} y={-H2 / 2} width={W2} height={H2} rx={30} fill={K.white}/>
    <g clipPath={`url(#${id}-rs)`}>
      <rect x={-W2 / 2} y={-H2 / 2} width={W2} height={110} fill={K.orange}/>
      <path d={`M 60 ${-H2 / 2} L ${W2 / 2} ${-H2 / 2} L ${W2 / 2} ${-H2 / 2 + 110} L 0 ${-H2 / 2 + 110} Z`} fill={K.orangeD}/>
      <g transform={`translate(${-W2 / 2 + 62} ${-H2 / 2 + 56}) scale(0.62)`}><path d={EGG} fill={K.cream}/><path d="M 8 -80 L 80 -80 L 80 80 L -40 80 Z" fill={K.creamD} clipPath={`url(#${id}-eg2)`}/></g>
      <clipPath id={`${id}-eg2`}><path d={EGG}/></clipPath>
      <rect x={-W2 / 2 + 110} y={-H2 / 2 + 36} width={200} height={18} rx={9} fill={K.cream}/>
      <rect x={-W2 / 2 + 110} y={-H2 / 2 + 66} width={130} height={14} rx={7} fill={K.cream} opacity={0.7}/>
      {Array.from({length: rows}, (_, i) => { const y = -H2 / 2 + 140 + i * 56, on = i === hi;
        return <g key={i}>
          {on && <rect x={-W2 / 2 + 14} y={y - 8} width={W2 - 28} height={46} rx={12} fill={K.teal} opacity={0.28 + 0.12 * Math.sin(f / 16)}/>}
          <rect x={-W2 / 2 + 32} y={y + 6} width={110 + ((i * 37) % 60)} height={16} rx={8} fill={on ? K.tealD : "#B9C2E0"}/>
          {[0, 1, 2, 3].map((j) => <rect key={j} x={W2 / 2 - 150 + j * 30 + (j > 1 ? 10 : 0)} y={y + 2} width={22} height={26} rx={6} fill={on ? K.deep : "#8E9AC6"} opacity={j === 2 ? 0 : 1}/>)}
          <circle cx={W2 / 2 - 150 + 2 * 30 + 6} cy={y + 24} r={3.5} fill={on ? K.deep : "#8E9AC6"}/>
          <line x1={-W2 / 2 + 24} x2={W2 / 2 - 24} y1={y + 42} y2={y + 42} stroke="#DCE2F3" strokeWidth={2}/>
        </g>; })}
      <path d={`M 120 ${-H2 / 2} L ${W2 / 2} ${-H2 / 2} L ${W2 / 2} ${H2 / 2} L -60 ${H2 / 2} Z`} fill={K.haze} opacity={0.14}/>
      <rect x={-W2 / 2} y={-H2 / 2 + 110 + scan * (H2 - 110)} width={W2} height={30} fill={K.tealL} opacity={0.18 * Math.sin(scan * Math.PI)}/>
    </g>
    {/* pin at the top */}
    <circle cx={0} cy={-H2 / 2 + 4} r={20} fill={K.pink}/><path d={`M 0 ${-H2 / 2 - 16} A 20 20 0 0 1 0 ${-H2 / 2 + 24} Z`} fill={K.pinkD}/>
  </g>;
};

const DocStack: React.FC<HeroP> = ({f, id}) => {
  const fl = (i: number) => Math.sin(f / 30 + i * 1.3) * 2.5;
  const page = (i: number, rot: number, dx: number, dy: number, top?: boolean) =>
    <g transform={`translate(${dx} ${dy + fl(i)}) rotate(${rot + fl(i) * 0.4})`}>
      <rect x={-180 + 18} y={-240 + 24} width={360} height={480} rx={18} fill="#000" opacity={0.22}/>
      <rect x={-180} y={-240} width={360} height={480} rx={18} fill={top ? K.cream : i === 1 ? "#F0E2C4" : "#E6D3AE"}/>
      {top && <>
        <clipPath id={`${id}-dp`}><rect x={-180} y={-240} width={360} height={480} rx={18}/></clipPath>
        <g clipPath={`url(#${id}-dp)`}><path d="M 60 -260 L 200 -260 L 200 260 L -40 260 Z" fill={K.creamD} opacity={0.6}/></g>
        <rect x={-140} y={-200} width={200} height={22} rx={11} fill={K.deep}/>
        <rect x={-140} y={-166} width={140} height={14} rx={7} fill={K.soft} opacity={0.7}/>
        <rect x={-140} y={-134} width={280} height={6} rx={3} fill={K.deep} opacity={0.7}/>
        {Array.from({length: 9}, (_, k) => <rect key={k} x={-140} y={-108 + k * 30} width={[270, 240, 260, 200, 270, 230, 250, 180, 120][k]} height={12} rx={6}
          fill={k === 3 || k === 4 ? K.yellow : "#CDB88F"} opacity={k === 3 || k === 4 ? 0.9 : 0.8}/>)}
        <g transform={`translate(90 170) rotate(${-14 + Math.sin(f / 40) * 2})`}>
          <circle r={50} fill={K.pink} opacity={0.85}/><circle r={38} fill="none" stroke={K.cream} strokeWidth={4} strokeDasharray="6 6"/>
          <path d="M 0 -50 A 50 50 0 0 1 0 50 Z" fill={K.pinkD} opacity={0.6}/><circle r={14} fill={K.cream} opacity={0.8}/>
        </g>
        <path d="M -150 -250 l 0 60 q 0 16 14 16 q 14 0 14 -16 l 0 -44" fill="none" stroke={K.haze} strokeWidth={7} strokeLinecap="round"/>
      </>}
    </g>;
  return <g>
    <ellipse cx={10} cy={262} rx={230} ry={22} fill="#000" opacity={0.3}/>
    {page(2, 8, 40, 10)}{page(1, -6, -30, 4)}{page(0, -1, 0, 0, true)}
  </g>;
};

// A smooth closed blob (seeded): quadratic curves through the midpoints of a wobbly polygon.
export const blobPath = (seed: number, w: number, h: number, n = 9) => {
  const r = rng(seed), pts = Array.from({length: n}, (_, i) => { const a = (i / n) * Math.PI * 2, k = 0.62 + r() * 0.5; return [Math.cos(a) * w * k, Math.sin(a) * h * k] as const; });
  const mid = (a: readonly [number, number], b: readonly [number, number]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = `M ${mid(pts[n - 1], pts[0]).join(" ")}`;
  for (let i = 0; i < n; i++) { const p = pts[i], m = mid(p, pts[(i + 1) % n]); d += ` Q ${p[0].toFixed(1)} ${p[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`; }
  return d + " Z";
};

const Globe: React.FC<HeroP> = ({f, id}) => {
  const R = 210, rr = rng(21);
  const land = Array.from({length: 11}, (_, i) => [rr() * 6.28, -160 + rr() * 320, 46 + rr() * 50, 30 + rr() * 34, i] as const);
  const clouds = Array.from({length: 8}, () => [rr() * 6.28, -170 + rr() * 340, 30 + rr() * 40] as const);
  const ringA = f / 60, proj = (th: number, ly: number) => { const half = Math.sqrt(Math.max(0, R * R - ly * ly)); return [Math.sin(th) * half, Math.cos(th)] as const; };
  return <g>
    <defs>
      <radialGradient id={`${id}-oc`} cx="0.35" cy="0.3"><stop offset="0" stopColor={K.haze}/><stop offset="0.7" stopColor={K.soft}/><stop offset="1" stopColor={K.mid}/></radialGradient>
      <radialGradient id={`${id}-at`}><stop offset="0.62" stopColor={K.tealL} stopOpacity={0.35}/><stop offset="1" stopColor={K.tealL} stopOpacity={0}/></radialGradient>
      <clipPath id={`${id}-gl`}><circle r={R}/></clipPath>
    </defs>
    <circle r={R * 1.45} fill={`url(#${id}-at)`}/>
    <g transform="rotate(-18)"><path d={`M ${-R * 1.55} 0 A ${R * 1.55} ${R * 0.36} 0 0 1 ${R * 1.55} 0`} fill="none" stroke={K.orange} strokeWidth={6} opacity={0.5}/></g>
    <circle r={R} fill={`url(#${id}-oc)`}/>
    <g clipPath={`url(#${id}-gl)`}>
      {[-150, -90, -30, 30, 90, 150].map((ly) => <ellipse key={ly} cx={0} cy={ly} rx={Math.sqrt(R * R - ly * ly)} ry={5} fill="none" stroke={K.white} strokeWidth={1.5} opacity={0.1}/>)}
      {land.map(([th, ly, w, h, i]) => { const [x, c] = proj(th + f / 160, ly); if (c < 0) return null;
        return <g key={i} transform={`translate(${x} ${ly}) scale(${Math.max(0.04, c)} 1)`}>
          <path d={blobPath(i * 13 + 5, w, h)} fill={i % 3 ? K.teal : K.tealD}/>
          <path d={blobPath(i * 13 + 6, w * 0.45, h * 0.4)} fill={i % 2 ? K.tealL : K.yellow} opacity={0.35} transform={`translate(${-w * 0.2} ${-h * 0.15})`}/>
        </g>; })}
      {clouds.map(([th, ly, w], i) => { const [x, c] = proj(th + f / 110, ly); if (c < 0) return null;
        return <ellipse key={i} cx={x} cy={ly} rx={w * Math.max(0.05, c)} ry={9} fill={K.white} opacity={0.55}/>; })}
      <path d={`M 50 ${-R - 20} L ${R + 20} ${-R - 20} L ${R + 20} ${R + 20} L ${-R + 10} ${R + 20} Z`} fill={K.night} opacity={0.42}/>
      <circle r={R} fill="none" stroke={K.white} strokeWidth={6} opacity={0.35} transform="translate(-4 -4)"/>
    </g>
    <ellipse cx={-90} cy={-95} rx={26} ry={44} fill="#fff" opacity={0.16} transform="rotate(30 -90 -95)"/>
    <g transform="rotate(-18)">
      <path d={`M ${-R * 1.55} 0 A ${R * 1.55} ${R * 0.36} 0 0 0 ${R * 1.55} 0`} fill="none" stroke={K.orange} strokeWidth={7} opacity={0.9}/>
      {Math.sin(ringA) > 0 && <g transform={`translate(${Math.cos(ringA) * R * 1.55} ${Math.sin(ringA) * R * 0.36}) scale(0.5)`}><path d={EGG} fill={K.cream}/></g>}
    </g>
  </g>;
};

export const HERO_ICONS = ["egg", "hen", "deshen", "chick", "ratesheet", "doc", "globe"] as const;
export const Hero: React.FC<{icon: string; f: number; id: string}> = ({icon, f, id}) => {
  switch (icon) {
    case "hen": return <BigHen f={f} id={id}/>;
    case "deshen": return <BigHen f={f} id={id} red/>;
    case "chick": return <BigChick f={f} id={id}/>;
    case "egg": return <BigEgg f={f} id={id}/>;
    case "ratesheet": return <RateSheet f={f} id={id}/>;
    case "doc": return <DocStack f={f} id={id}/>;
    case "globe": return <Globe f={f} id={id}/>;
    default: throw new Error(`kurz cards: no hero art for icon "${icon}"`);
  }
};
export {RateSheet as RateSheetArt, EggTex};

// ---- type helpers ---------------------------------------------------------------------------------------------------------------
// `*starred*` words are accented: yellow, glowing, with a swoosh under them that draws in after the line lands.
export const Starred: React.FC<{text: string; f: number; at: number; accent?: string}> = ({text, f, at, accent = K.yellow}) => <>
  {text.split("*").map((part, j) => {
    if (!(j % 2)) return <span key={j}>{part}</span>;
    const u = clamp((f - at - 10) / 18, 0, 1), uu = 1 - (1 - u) ** 3;
    return <span key={j} style={{position: "relative", color: accent, textShadow: `0 0 34px ${accent}77`, whiteSpace: "nowrap"}}>
      {part}
      <span style={{position: "absolute", left: 0, bottom: "-0.04em", height: "0.12em", width: `${uu * 100}%`, borderRadius: 99, background: accent, opacity: 0.85, boxShadow: `0 0 18px ${accent}`}}/>
    </span>;
  })}
</>;

// A plain label pill with a coloured dot, readable on any art (solid translucent panel).
export const Tag: React.FC<{text: string; color?: string; size?: number; o?: number; style?: React.CSSProperties}> = ({text, color = K.teal, size = 34, o = 1, style}) =>
  <div style={{display: "inline-flex", alignItems: "center", gap: 14, padding: `${size * 0.32}px ${size * 0.75}px ${size * 0.32}px ${size * 0.5}px`, borderRadius: 999,
    background: "rgba(11,20,51,0.72)", boxShadow: "0 0 0 2px rgba(255,255,255,0.10), 0 12px 30px rgba(0,0,0,0.3)", fontFamily: SANS, fontWeight: 800, fontSize: size,
    letterSpacing: 2, color: K.white, whiteSpace: "nowrap", opacity: o, ...style}}>
    <span style={{width: size * 0.48, height: size * 0.48, borderRadius: "50%", background: color, boxShadow: `0 0 14px ${color}`, flex: "none"}}/>{text}
  </div>;
