// UPSC monsoon film, look sample A (direction A = the approved Kurz look): shared kit for the three sample scenes.
// Deep space navy, flat shapes with no outlines, a lit side and a shade side on every shape, soft long shadows, rim light, glow,
// depth layers, slow parallax. Original art, drawn in code. Every motion is a smooth function of the fractional logical frame f.
import React from "react";
import {interpolate} from "remotion";
import {K, KNum, ROUND, SANS, pop, ease} from "../kurz/kit";
import {numOf, type NumIn} from "../cartoon/long/scenes/nk_kit";

export {K, ROUND, SANS, pop, ease};
export const W = 1920, H = 1080;
export const SAFE = {x0: 96, x1: 1824, y0: 64, y1: 920};
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const sstep = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const rnd = (seed: number) => { let a = (Math.floor(seed * 7919) + 12345) >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
export const hx = (c: string): [number, number, number] => { const h = c.replace("#", ""); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number]; };
export const mix = (a: string, b: string, t: number) => { const A = hx(a), B = hx(b), u = clamp(t); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, "0")).join(""); };
export const shade = (c: string, k = 0.35) => mix(c, "#150F45", k);
export const lite = (c: string, k = 0.35) => mix(c, "#FFF3D8", k);
export const easeOut = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3)});
export const easeIO = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)});

// ---- finish: fine grain and a soft vignette over the whole frame --------------------------------------------------------------------
export const Finish: React.FC<{vig?: number}> = ({vig = 0.55}) => <>
  <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, mixBlendMode: "overlay", opacity: 0.5, pointerEvents: "none"}}>
    <filter id="rk-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={4} stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
    <rect width={W} height={H} filter="url(#rk-grain)" opacity={0.55}/>
  </svg>
  <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, pointerEvents: "none"}}>
    <defs><radialGradient id="rk-vig" cx="0.5" cy="0.48" r="0.78"><stop offset="0.55" stopColor="#050A22" stopOpacity={0}/><stop offset="1" stopColor="#050A22" stopOpacity={vig}/></radialGradient></defs>
    <rect width={W} height={H} fill="url(#rk-vig)"/>
  </svg>
</>;

// ---- a label on a dark glass panel (body labels 34 px) -----------------------------------------------------------------------------
export const Tag: React.FC<{text: string; f: number; at: number; x: number; y: number; anchor?: "l" | "c" | "r"; color?: string; size?: number; fadeAt?: number; dot?: boolean; weight?: number}> =
  ({text, f, at, x, y, anchor = "c", color = K.tealL, size = 34, fadeAt, dot = true, weight = 800}) => {
  const t = pop(f, at, 140), out = fadeAt === undefined ? 1 : 1 - easeOut(f, fadeAt, fadeAt + 10);
  if (t <= 0.001 || out <= 0.001) return null;
  const tx = anchor === "c" ? "-50%" : anchor === "r" ? "-100%" : "0%";
  return <div style={{position: "absolute", left: x, top: y, transform: `translate(${tx}, -50%) scale(${0.85 + 0.15 * t}) translateY(${(1 - t) * 14}px)`, opacity: Math.min(1, t * 1.5) * out, transformOrigin: anchor === "l" ? "0% 50%" : anchor === "r" ? "100% 50%" : "50% 50%"}}>
    <div style={{display: "flex", alignItems: "center", gap: 14, padding: "10px 26px 10px 20px", borderRadius: 999, background: "rgba(9,15,44,0.78)", backdropFilter: "blur(6px)",
      boxShadow: `inset 0 0 0 2px ${color}55, 0 10px 30px rgba(0,0,0,0.35), 0 0 30px ${color}33`, whiteSpace: "nowrap"}}>
      {dot && <span style={{width: size * 0.36, height: size * 0.36, borderRadius: "50%", background: color, boxShadow: `0 0 16px ${color}`}}/>}
      <span style={{fontFamily: SANS, fontWeight: weight, fontSize: size, letterSpacing: 1.5, color: K.white, lineHeight: 1.1}}>{text}</span>
    </div>
  </div>;
};

// ---- a number card: a glass panel, a coloured top light, a big glowing number (>= 90 px), a unit, and a caption (>= 30 px) ---------------
export const NumCard: React.FC<{n: NumIn; f: number; at: number; x: number; y: number; size: number; unit?: string; caption: string; color?: string; anchor?: "c" | "l"; tilt?: number}> =
  ({n, f, at, x, y, size, unit, caption, color = K.yellow, anchor = "c", tilt = 0}) => {
  if (f < at) return null;
  const t = pop(f, at, 130);
  if (t <= 0.001) return null;
  const lk = numOf(n, at);
  const cap = Math.max(32, Math.round(size * 0.22));
  return <div style={{position: "absolute", left: x, top: y, transform: `translate(${anchor === "c" ? "-50%" : "0"}, -50%) rotate(${tilt}deg) scale(${t}) translateY(${(1 - t) * 40}px)`, opacity: Math.min(1, t * 1.4)}}>
    <div style={{position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center", padding: `20px 44px ${22}px`, borderRadius: 40, overflow: "hidden",
      background: "linear-gradient(160deg, rgba(22,34,92,0.88), rgba(8,14,42,0.9))", boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.13), inset 0 3px 0 ${color}AA, 0 26px 60px rgba(0,0,0,0.45), 0 0 70px ${color}30`}}>
      <div style={{position: "absolute", left: -40, top: -60, width: 260, height: 160, background: `radial-gradient(closest-side, ${color}38, transparent)`}}/>
      <div style={{position: "relative", display: "flex", alignItems: "baseline", gap: size * 0.1, whiteSpace: "nowrap"}}>
        <span style={{fontFamily: ROUND, fontWeight: 800, fontSize: size, lineHeight: 1, letterSpacing: -2, color, textShadow: `0 0 ${size * 0.3}px ${color}99, 0 4px 0 ${shade(color, 0.55)}`}}><KNum n={lk} f={f} where="rich-a numcard"/></span>
        {unit && <span style={{fontFamily: ROUND, fontWeight: 800, fontSize: Math.round(size * 0.4), color: lite(color, 0.2), opacity: 0.95}}>{unit}</span>}
      </div>
      <div style={{position: "relative", fontFamily: SANS, fontWeight: 700, fontSize: cap, color: K.white, opacity: 0.9, marginTop: 10, whiteSpace: "nowrap", letterSpacing: 0.5}}>{caption}</div>
    </div>
  </div>;
};

// ---- small art parts ----------------------------------------------------------------------------------------------------------------
// A shape with a lit side and a shade side: the base fill is the lit colour; a straight cut (x = cut, slightly tilted) shades the far side.
let uidn = 0;
export const useId2 = (p: string) => React.useMemo(() => `${p}${++uidn}`, [p]);
export const LS: React.FC<{d: string; c: string; s?: string; cut?: number; tilt?: number; rim?: string; rimW?: number; k?: number; o?: number; side?: 1 | -1; blur?: boolean}> =
  ({d, c, s, cut = 0, tilt = 0.12, rim, rimW = 3, k = 0.38, o, side = 1}) => {
  const id = useId2("ls"), B = 4000, t = Math.tan(tilt);
  const xa = cut + t * (-B), xb = cut + t * B, far = side > 0 ? 3 * B : -3 * B;
  return <g opacity={o}>
    <clipPath id={id}><path d={d}/></clipPath>
    <path d={d} fill={c}/>
    <g clipPath={`url(#${id})`}>
      <path d={`M ${xa} ${-B} L ${xb} ${B} L ${far} ${B} L ${far} ${-B} Z`} fill={s ?? shade(c, k)}/>
      {rim && <path d={d} fill="none" stroke={rim} strokeWidth={rimW * 2} transform={`translate(${-rimW * 0.9 * side} ${-rimW * 0.9})`} opacity={0.85}/>}
    </g>
  </g>;
};
export const rrect = (x: number, y: number, w: number, h: number, r: number) => { const q = Math.min(r, w / 2, h / 2);
  return `M ${x + q} ${y} H ${x + w - q} Q ${x + w} ${y} ${x + w} ${y + q} V ${y + h - q} Q ${x + w} ${y + h} ${x + w - q} ${y + h} H ${x + q} Q ${x} ${y + h} ${x} ${y + h - q} V ${y + q} Q ${x} ${y} ${x + q} ${y} Z`; };
export const ellp = (cx: number, cy: number, rx: number, ry = rx) => `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
export const poly = (p: number[][]) => "M " + p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ") + " Z";

// Glow disc (radial gradient)
export const Orb: React.FC<{x: number; y: number; r: number; c: string; o?: number; core?: number}> = ({x, y, r, c, o = 1, core = 0.3}) => {
  const id = useId2("orb");
  return <g><defs><radialGradient id={id}><stop offset="0" stopColor={c} stopOpacity={o}/><stop offset={core} stopColor={c} stopOpacity={o * 0.5}/><stop offset="1" stopColor={c} stopOpacity={0}/></radialGradient></defs><circle cx={x} cy={y} r={r} fill={`url(#${id})`}/></g>;
};
// Horizontal haze band
export const Haze: React.FC<{y: number; h: number; c: string; o?: number; x?: number; w?: number}> = ({y, h, c, o = 0.5, x = -200, w = 2320}) => {
  const id = useId2("hz");
  return <g><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c} stopOpacity={0}/><stop offset="0.6" stopColor={c} stopOpacity={o}/><stop offset="1" stopColor={c} stopOpacity={0}/></linearGradient></defs>
    <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`}/></g>;
};
// Drifting motes, each fades near the edges of its box so the wrap never pops.
export const Motes: React.FC<{f: number; n: number; seed: number; box: [number, number, number, number]; c: string; r?: [number, number]; vx?: number; vy?: number; o?: number; glow?: boolean}> =
  ({f, n, seed, box, c, r = [1.5, 4], vx = 0.25, vy = -0.15, o = 0.7, glow}) => {
  const g = rnd(seed), [x0, y0, x1, y1] = box, Wd = x1 - x0, Hd = y1 - y0;
  const mod = (a: number, m: number) => ((a % m) + m) % m;
  return <g>{Array.from({length: n}, (_, i) => {
    const bx = g() * Wd, by = g() * Hd, sp = 0.5 + g(), ph = g() * 6.28, rad = r[0] + g() * (r[1] - r[0]);
    const x = x0 + mod(bx + f * vx * sp + Math.sin(f / 37 + ph) * 14, Wd), y = y0 + mod(by + f * vy * sp + Math.cos(f / 43 + ph) * 10, Hd);
    const edge = Math.min(1, (x - x0) / 80, (x1 - x) / 80, (y - y0) / 80, (y1 - y) / 80);
    const op = o * Math.max(0, edge) * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(f / 21 + ph * 3)));
    return <g key={i} opacity={op}>{glow && <circle cx={x} cy={y} r={rad * 3.2} fill={c} opacity={0.18}/>}<circle cx={x} cy={y} r={rad} fill={c}/></g>;
  })}</g>;
};
export const Stars: React.FC<{f: number; n?: number; seed?: number; h?: number; o?: number}> = ({f, n = 70, seed = 3, h = 600, o = 1}) => {
  const r = rnd(seed);
  return <g>{Array.from({length: n}, (_, i) => { const x = r() * W, y = r() * h, rad = 0.8 + r() * 2.2, ph = r() * 6.28;
    return <circle key={i} cx={x} cy={y} r={rad} fill={K.white} opacity={o * (0.2 + 0.35 * (0.5 + 0.5 * Math.sin(f / 18 + ph)))}/>; })}</g>;
};
// A flat cloud puff with a lit top and a shade band under it.
export const Puff: React.FC<{x: number; y: number; s: number; c?: string; o?: number; flat?: number}> = ({x, y, s, c = "#F2E9F7", o = 1}) => {
  const d = "M -120 0 Q -126 -38 -84 -46 Q -70 -96 -14 -90 Q 34 -128 84 -84 Q 132 -82 130 -34 Q 152 -2 122 0 Z";
  const id = useId2("pf");
  return <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <clipPath id={id}><path d={d}/></clipPath>
    <path d={d} fill={c}/>
    <g clipPath={`url(#${id})`}>
      <path d="M -200 -22 Q 0 -44 200 -26 L 200 40 L -200 40 Z" fill={shade(c, 0.28)}/>
      <path d="M -200 -2 Q 0 -20 200 -6 L 200 40 L -200 40 Z" fill={shade(c, 0.48)} opacity={0.7}/>
      <path d={d} fill="none" stroke="#fff" strokeWidth={10} transform="translate(-5 -7)" opacity={0.55}/>
    </g>
  </g>;
};
