// KURZ look, art base (art builder, 29 Oct 2026): colour toning by era, the lit/shade shape, particles, light shafts, haze, glows.
// Light comes from the upper left in every set, so shade halves sit on the right (screen space). Every motion is a smooth function of
// the fractional logical frame f. Everything is original, drawn in code.
import React, {createContext, useContext, useId} from "react";

export type Tint = "sepia" | "warm" | "day";

// ---- colour ------------------------------------------------------------------------------------------------------------------------
type RGB = [number, number, number];
const h2r = (h: string): RGB => {
  const s = h.replace("#", ""), v = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
};
const r2h = (c: RGB) => "#" + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
export const mix = (a: string, b: string, t: number) => { const A = h2r(a), B = h2r(b); return r2h([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]); };
const lum = (c: RGB) => (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255;
const ramp = (stops: string[], x: number) => {
  const n = stops.length - 1, p = Math.max(0, Math.min(1, x)) * n, i = Math.min(n - 1, Math.floor(p));
  return mix(stops[i], stops[i + 1], p - i);
};
// Kurz-style shade: toward a deep blue-violet, never toward grey. Lit: toward warm cream.
export const shadeOf = (c: string, k = 0.3) => mix(c, "#1B1650", k);
export const litOf = (c: string, k = 0.3) => mix(c, "#FFF4DA", k);

// Era tints. Sepia (1969-82): desaturate and map luminance onto a warm amber ramp; blues survive faintly. Warm (1982 meetings): a
// lamplit push toward orange. Day (today): the palette as drawn.
const SEPIA = ["#26160F", "#653A20", "#BC7636", "#F1B662", "#FFF2D4"];
const WARM = ["#1C1028", "#4F2440", "#B85A34", "#F2A65A", "#FFF0D4"];
const CACHE: Record<string, Map<string, string>> = {sepia: new Map(), warm: new Map(), day: new Map()};
export const toneFn = (tint: Tint) => (c: string) => {
  if (tint === "day" || !c || c[0] !== "#") return c;
  const m = CACHE[tint]; const hit = m.get(c); if (hit) return hit;
  const rgb = h2r(c), L = lum(rgb), g = r2h([L * 255, L * 255, L * 255]);
  const v = tint === "sepia" ? mix(mix(c, g, 0.3), ramp(SEPIA, L * 1.05 + 0.08), 0.7) : mix(c, ramp(WARM, L), 0.3);
  m.set(c, v); return v;
};

// ---- context: tone function and a unique id prefix for defs ------------------------------------------------------------------------
export type Art = {T: (c: string) => string; uid: string; tint: Tint};
export const ArtCtx = createContext<Art>({T: (c) => c, uid: "kz", tint: "day"});
export const useArt = () => useContext(ArtCtx);
export const useUid = () => "k" + useId().replace(/[^a-zA-Z0-9_-]/g, "");

// ---- maths -------------------------------------------------------------------------------------------------------------------------
export const rng = (seed: number) => { let a = (seed * 2654435761) >>> 0 || 1; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
export const mod = (a: number, m: number) => ((a % m) + m) % m;
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (a: number, b: number, x: number) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
// A smooth pulse train: 0 most of the time, rising to 1 for about `w` frames once every `period` frames (no discontinuity).
export const pulse = (f: number, period: number, w: number, phase = 0) => { const k = mod(f + phase, period) - period / 2; return Math.exp(-(k * k) / (w * w)); };

// ---- paths -------------------------------------------------------------------------------------------------------------------------
export const rr = (x: number, y: number, w: number, h: number, r: number) => {
  const q = Math.min(r, w / 2, h / 2);
  return `M ${x + q} ${y} H ${x + w - q} Q ${x + w} ${y} ${x + w} ${y + q} V ${y + h - q} Q ${x + w} ${y + h} ${x + w - q} ${y + h} H ${x + q} Q ${x} ${y + h} ${x} ${y + h - q} V ${y + q} Q ${x} ${y} ${x + q} ${y} Z`;
};
export const ell = (cx: number, cy: number, rx: number, ry = rx) => `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
export const poly = (p: number[][]) => "M " + p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ") + " Z";
// A smooth ridge across the frame: bumps from a seed, closed down to `base`.
export const ridge = (y: number, amp: number, seed: number, n = 7, base = 1300, x0 = -300, x1 = 2220) => {
  const r = rng(seed), pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) pts.push([x0 + ((x1 - x0) * i) / n, y - amp * (0.3 + 0.7 * r())]);
  let d = `M ${x0} ${base} L ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n; i++) { const [ax, ay] = pts[i], [bx, by] = pts[i + 1], mx = (ax + bx) / 2; d += ` C ${mx} ${ay} ${mx} ${by} ${bx} ${by}`; }
  return {d: d + ` L ${x1} ${base} Z`, peaks: pts};
};

// ---- the signature shape: a lit half and a shade half cut by a straight line, plus an inner rim light on the lit edge --------------
// side 1: shade on +x of the cut (screen right when not mirrored). Pass side = -1 inside a mirrored group to keep light from the left.
export const Lit: React.FC<{d: string; c: string; s?: string; side?: number; cut?: number; cy?: number; tilt?: number; rim?: number; rimC?: string; k?: number; opacity?: number; transform?: string}> =
  ({d, c, s, side = 1, cut = 0, cy = 0, tilt = 0.1, rim = 0, rimC, k = 0.3, opacity, transform}) => {
  const {T} = useArt(), id = useUid(), B = 6000, t = Math.tan(tilt) * side;
  const xa = cut + t * (-B - cy), xb = cut + t * (B - cy), far = side > 0 ? 3 * B : -3 * B;
  const hp = `M ${xa} ${-B} L ${xb} ${B} L ${far} ${B} L ${far} ${-B} Z`;
  return <g opacity={opacity} transform={transform}>
    <clipPath id={id}><path d={d}/></clipPath>
    <path d={d} fill={T(rim ? (rimC ?? litOf(c, 0.55)) : c)}/>
    <g clipPath={`url(#${id})`}>
      {rim ? <path d={d} fill={T(c)} transform={`translate(${rim * side} ${rim})`}/> : null}
      <path d={hp} fill={T(s ?? shadeOf(c, k))}/>
    </g>
  </g>;
};

// A flat fill through the tone function (for small parts).
export const P: React.FC<{d: string; c: string; o?: number; transform?: string}> = ({d, c, o, transform}) => { const {T} = useArt(); return <path d={d} fill={T(c)} opacity={o} transform={transform}/>; };

// ---- light and air -----------------------------------------------------------------------------------------------------------------
export const GlowDot: React.FC<{x: number; y: number; r: number; c: string; o?: number}> = ({x, y, r, c, o = 1}) => {
  const {T} = useArt(), id = useUid();
  return <g><defs><radialGradient id={id}><stop offset="0" stopColor={T(c)} stopOpacity={o}/><stop offset="0.35" stopColor={T(c)} stopOpacity={o * 0.4}/><stop offset="1" stopColor={T(c)} stopOpacity={0}/></radialGradient></defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`}/></g>;
};

export const Haze: React.FC<{y: number; h: number; c: string; o?: number}> = ({y, h, c, o = 0.5}) => {
  const {T} = useArt(), id = useUid();
  return <g><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={T(c)} stopOpacity={0}/><stop offset="0.55" stopColor={T(c)} stopOpacity={o}/><stop offset="1" stopColor={T(c)} stopOpacity={0}/></linearGradient></defs>
    <rect x={-400} y={y} width={2720} height={h} fill={`url(#${id})`}/></g>;
};

export const Sky: React.FC<{stops: [number, string][]}> = ({stops}) => {
  const {T} = useArt(), id = useUid();
  return <g><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">{stops.map(([o, c], i) => <stop key={i} offset={o} stopColor={T(c)}/>)}</linearGradient></defs>
    <rect x={-400} y={-300} width={2720} height={1700} fill={`url(#${id})`}/></g>;
};

// God rays: thin wedges fanning from a source, fading with distance, breathing slowly. Screen-blended.
export const Shafts: React.FC<{f: number; x: number; y: number; ang: number; spread: number; n: number; len: number; w?: number; c: string; o?: number; seed?: number}> =
  ({f, x, y, ang, spread, n, len, w = 0.035, c, o = 0.22, seed = 1}) => {
  const {T} = useArt(), id = useUid(), r = rng(seed);
  return <g style={{mixBlendMode: "screen"}}>
    <defs><radialGradient id={id} gradientUnits="userSpaceOnUse" cx={x} cy={y} r={len}><stop offset="0" stopColor={T(c)} stopOpacity={1}/><stop offset="0.6" stopColor={T(c)} stopOpacity={0.35}/><stop offset="1" stopColor={T(c)} stopOpacity={0}/></radialGradient></defs>
    {Array.from({length: n}, (_, i) => {
      const a = ang - spread / 2 + (spread * (i + 0.5)) / n + (r() - 0.5) * spread / n * 0.8 + Math.sin(f / 90 + i * 1.7) * 0.006;
      const ww = w * (0.5 + r()), op = o * (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(f / 55 + r() * 6.28)));
      const p1 = [x + Math.cos(a - ww) * len, y + Math.sin(a - ww) * len], p2 = [x + Math.cos(a + ww) * len, y + Math.sin(a + ww) * len];
      return <path key={i} d={`M ${x} ${y} L ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} Z`} fill={`url(#${id})`} opacity={op}/>;
    })}
  </g>;
};

// Floating dust / fireflies / chaff. Each mote drifts and wraps inside its box; it fades near the box edges, so the wrap never pops.
export const Motes: React.FC<{f: number; n: number; seed: number; box: [number, number, number, number]; c: string; r?: [number, number]; vx?: number; vy?: number; o?: number; glow?: boolean}> =
  ({f, n, seed, box, c, r = [1.5, 4], vx = 0.25, vy = -0.15, o = 0.7, glow}) => {
  const {T} = useArt(), g = rng(seed), [x0, y0, x1, y1] = box, W = x1 - x0, H = y1 - y0;
  return <g>{Array.from({length: n}, (_, i) => {
    const bx = g() * W, by = g() * H, sp = 0.5 + g(), ph = g() * 6.28, rad = r[0] + g() * (r[1] - r[0]);
    const x = x0 + mod(bx + f * vx * sp + Math.sin(f / 37 + ph) * 14, W), y = y0 + mod(by + f * vy * sp + Math.cos(f / 43 + ph) * 10, H);
    const edge = Math.min(1, (x - x0) / 80, (x1 - x) / 80, (y - y0) / 80, (y1 - y) / 80);
    const op = o * Math.max(0, edge) * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(f / 21 + ph * 3)));
    return <g key={i} opacity={op}>
      {glow && <circle cx={x} cy={y} r={rad * 3.2} fill={T(c)} opacity={0.18}/>}
      <circle cx={x} cy={y} r={rad} fill={T(c)}/>
    </g>;
  })}</g>;
};

// Soft rising smoke or steam: puffs born at (x, y), rising and growing, fading out. Continuous in f.
export const Smoke: React.FC<{f: number; x: number; y: number; c: string; n?: number; life?: number; rise?: number; drift?: number; r0?: number; r1?: number; o?: number; seed?: number; blur?: number}> =
  ({f, x, y, c, n = 6, life = 150, rise = 220, drift = 60, r0 = 10, r1 = 46, o = 0.35, seed = 1, blur = 0}) => {
  const {T} = useArt(), id = useUid();
  return <g filter={blur ? `url(#${id})` : undefined}>{blur ? <defs><filter id={id} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={blur}/></filter></defs> : null}{Array.from({length: n}, (_, i) => {
    const u = mod(f + (i * life) / n + seed * 13, life) / life;
    const px = x + drift * u + Math.sin(u * 5 + i + seed) * 10 * u, py = y - rise * u, rad = r0 + (r1 - r0) * u;
    const op = o * Math.sin(Math.PI * u) * (u < 0.1 ? u / 0.1 : 1);
    return <g key={i} opacity={op}><circle cx={px} cy={py} r={rad} fill={T(c)}/><circle cx={px - rad * 0.3} cy={py - rad * 0.3} r={rad * 0.55} fill={T(litOf(c, 0.5))} opacity={0.6}/></g>;
  })}</g>;
};

// A tiny stipple pattern laid over big flat areas (texture without noise).
export const Stipple: React.FC<{d: string; c: string; o?: number; seed?: number; size?: number}> = ({d, c, o = 0.18, seed = 1, size = 22}) => {
  const {T} = useArt(), id = useUid(), r = rng(seed);
  const dots = Array.from({length: 7}, () => [r() * size, r() * size, 0.8 + r() * 1.6]);
  return <g><defs><pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">{dots.map(([x, y, rad], i) => <circle key={i} cx={x} cy={y} r={rad} fill={T(c)}/>)}</pattern></defs>
    <path d={d} fill={`url(#${id})`} opacity={o}/></g>;
};

// A flat cloud: three lobes and a flat base, lit on top, a shade band below; drifts slowly and wraps across a wide strip.
export const Cloud: React.FC<{f: number; x: number; y: number; s: number; c?: string; v?: number; o?: number}> = ({f, x, y, s, c = "#F6E8D8", v = 0.12, o = 0.9}) => {
  const {T} = useArt(), id = useUid(), px = mod(x + f * v, 2700) - 400;
  const d = `M ${-120} 0 Q ${-122} -40 ${-80} -46 Q ${-66} -96 ${-10} -92 Q ${36} -128 ${84} -84 Q ${130} -82 ${128} -34 Q ${150} -2 ${120} 0 Z`;
  return <g transform={`translate(${px} ${y}) scale(${s})`} opacity={o}>
    <clipPath id={id}><path d={d}/></clipPath>
    <path d={d} fill={T(c)}/>
    <g clipPath={`url(#${id})`}><path d="M -200 -26 Q 0 -40 200 -30 L 200 40 L -200 40 Z" fill={T(shadeOf(c, 0.22))}/><path d={d} fill="none" stroke={T(litOf(c, 0.7))} strokeWidth={8} transform="translate(4 6)" opacity={0}/></g>
  </g>;
};
