// Sivakasi films: shared motion kit. 1920x1080 at 60 fps. Original code-drawn art.
// Physics rules used everywhere: springs (mass-spring-damper) for arrivals, closed-form ballistic motion with gravity and drag for particles
// and falling objects, constant-acceleration braking for vehicles, and slow-in/slow-out easing for camera moves. Text never shakes.
import React from "react";
import {AbsoluteFill, Easing, interpolate, spring, staticFile} from "remotion";

export const W = 1920, H = 1080, FPS = 60;
export const C = {
  night: "#070B22", indigo: "#121A4A", plum: "#35195A", dusk: "#6B2F72", amber: "#FFB84D", flame: "#FF6A3D", gold: "#FFD479",
  cream: "#F6EBD4", teal: "#4FD6C4", leaf: "#5BE08F", red: "#FF4D63", sand: "#E8C58A", soil: "#6E402B", clay: "#B5652F", ink: "#050816",
  steel: "#8FA3C8", sky: "#1B2A6E", green: "#2FBF71", mist: "#BFE9FF",
};
export const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
export const SERIF = "'DM Serif Display', Georgia, serif";
export const MONO = "'IBM Plex Mono', Menlo, monospace";

export const Fonts: React.FC = () => <style>{[
  ["Inter", 600, "inter-latin-600-normal"], ["Inter", 800, "inter-latin-800-normal"], ["DM Serif Display", 400, "dm-serif-display-latin-400-normal"],
  ["IBM Plex Mono", 600, "ibm-plex-mono-latin-600-normal"],
].map(([fam, w, file]) => `@font-face{font-family:'${fam}';font-weight:${w};src:url(${staticFile(`fonts/${file}.woff2`)}) format("woff2");}`).join("")}</style>;

// ---------- maths ----------
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);      // fast start, long settle (an arrival with friction)
export const easeIO = Easing.bezier(0.65, 0, 0.35, 1);      // slow in, slow out (camera, vehicles)
export const easeIn = Easing.bezier(0.55, 0, 0.9, 0.4);     // accelerating (falling, rolling away)
export const prog = (f: number, a: number, b: number, fn: (t: number) => number = easeIO) => fn(clamp((f - a) / Math.max(1, b - a)));
/** Mass-spring-damper arrival: overshoots a little when damping is low, settles exactly. */
export const sp = (f: number, start: number, damping = 16, stiffness = 110, mass = 1) =>
  spring({frame: Math.max(0, f - start), fps: FPS, config: {damping, stiffness, mass}});
export const rnd = (seed: number) => { let t = seed >>> 0; return () => { t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; };
/** Constant deceleration to a stop: position 0..1 as a vehicle brakes (v^2 = 2 a d). */
export const brake = (t: number) => 1 - (1 - clamp(t)) ** 2;
/** Falling body with bounces (restitution e) under gravity g (px/s^2), seconds t, from height h0 above the floor. Returns height above the floor. */
export function bounceH(t: number, h0: number, g = 2600, e = 0.45): number {
  let tt = Math.max(0, t), h = h0, v = 0;
  const t0 = Math.sqrt((2 * h) / g);
  if (tt < t0) return h - 0.5 * g * tt * tt;
  tt -= t0; v = g * t0 * e;
  for (let i = 0; i < 6; i++) { const air = (2 * v) / g; if (tt < air) return v * tt - 0.5 * g * tt * tt; tt -= air; v *= e; }
  return 0;
}
export const sec = (f: number) => f / FPS;

// ---------- particles: closed-form ballistic motion with linear drag k (1/s) and gravity g (px/s^2, down) ----------
export type Burst = {x: number; y: number; t0: number; n: number; speed: number; g?: number; k?: number; life: number; colors: string[]; size?: number; seed?: number;
  spread?: number; angle?: number; speedVar?: number; trail?: number};
export type P = {x: number; y: number; a: number; r: number; c: string; px: number; py: number};
export function particles(b: Burst, f: number): P[] {
  const t = sec(f) - b.t0; if (t < 0 || t > b.life) return [];
  const r = rnd((b.seed ?? 1) * 9973), g = b.g ?? 520, k = b.k ?? 1.6, out: P[] = [];
  const trail = b.trail ?? 0.06;
  for (let i = 0; i < b.n; i++) {
    const ang = (b.angle ?? 0) + (r() - 0.5) * (b.spread ?? Math.PI * 2), sp0 = b.speed * (1 - (b.speedVar ?? 0.45) * r());
    const vx = Math.cos(ang) * sp0, vy = Math.sin(ang) * sp0, col = b.colors[Math.floor(r() * b.colors.length)], jl = 0.6 + 0.4 * r();
    const at = (tt: number) => { const d = (1 - Math.exp(-k * tt)) / k; return [b.x + vx * d, b.y + (g / k) * tt + (vy - g / k) * d]; };
    const [x, y] = at(t), [px, py] = at(Math.max(0, t - trail)), life = b.life * jl, age = t / life;
    if (age > 1) continue;
    out.push({x, y, px, py, a: (1 - age) ** 1.4, r: (b.size ?? 3) * (1 - 0.5 * age), c: col});
  }
  return out;
}
export const Sparks: React.FC<{b: Burst; f: number; glow?: boolean}> = ({b, f, glow = true}) => {
  const ps = particles(b, f);
  return <g style={{mixBlendMode: "screen" as any}}>{ps.map((p, i) => <g key={i}>
    <line x1={p.px} y1={p.py} x2={p.x} y2={p.y} stroke={p.c} strokeWidth={p.r * 1.1} strokeLinecap="round" opacity={p.a * 0.7} />
    <circle cx={p.x} cy={p.y} r={p.r} fill={p.c} opacity={p.a} />
    {glow && <circle cx={p.x} cy={p.y} r={p.r * 3.2} fill={p.c} opacity={p.a * 0.16} />}</g>)}</g>;
};

// ---------- steady text (never shakes: whole pixels, transform none after the entrance) ----------
export const Key: React.FC<{text: string; sub?: string; f: number; at: number; x?: number; y?: number; size?: number; align?: "left" | "center"; color?: string; mono?: boolean; out?: number}> =
({text, sub, f, at, x = 120, y = 800, size = 78, align = "left", color = C.cream, mono, out}) => {
  const p = prog(f, at, at + 16, easeOut), o = out !== undefined ? 1 - prog(f, out, out + 12, easeIO) : 1, op = p * o;
  if (op <= 0.001) return null;
  const settled = p >= 0.999, dy = Math.round((1 - p) * 22);
  return <div style={{position: "absolute", left: align === "left" ? Math.round(x) : Math.round(x - 700), top: Math.round(y), width: align === "left" ? undefined : 1400, textAlign: align,
    opacity: op, transform: settled ? "none" : `translateY(${dy}px)`, fontFamily: mono ? MONO : SANS, fontWeight: mono ? 600 : 800, fontSize: size, lineHeight: 1.05, letterSpacing: mono ? "0.01em" : "0.04em",
    textTransform: mono ? "none" : "uppercase", color, textShadow: "0 3px 18px rgba(0,0,0,0.75), 0 0 3px rgba(0,0,0,0.9)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap"}}>
    {text}{sub && <div style={{fontFamily: SANS, fontWeight: 600, fontSize: Math.round(size * 0.4), letterSpacing: "0.12em", marginTop: 10, color: C.gold, textTransform: "uppercase"}}>{sub}</div>}</div>;
};

// ---------- finish: vignette + grain (art layer only) ----------
export const Finish: React.FC<{f: number; vign?: number}> = ({f, vign = 0.55}) => <>
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 52%, rgba(0,0,0,${vign}) 100%)`, pointerEvents: "none"}} />
  <AbsoluteFill style={{backgroundImage: `url(${staticFile("sivakasi/grain.png")})`, backgroundSize: "256px 256px", backgroundPosition: `${(f * 37) % 256}px ${(f * 91) % 256}px`, opacity: 0.075, mixBlendMode: "overlay", pointerEvents: "none"}} />
</>;
export const IllusTag: React.FC<{f: number}> = ({f}) => <div style={{position: "absolute", left: 0, right: 0, top: 1024, textAlign: "center", opacity: 0.55 * prog(f, 10, 30, easeOut),
  fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: "0.22em", color: C.cream, textShadow: "0 1px 6px rgba(0,0,0,0.8)"}}>ILLUSTRATION</div>;

// ---------- backgrounds ----------
export const Sky: React.FC<{top?: string; mid?: string; bot?: string; stars?: number; f?: number}> = ({top = C.night, mid = C.indigo, bot = C.plum, stars = 90, f = 0}) => {
  const r = rnd(5); const st = Array.from({length: stars}, () => ({x: r() * W, y: r() * H * 0.7, s: 0.6 + r() * 1.6, p: r() * 6}));
  return <AbsoluteFill><svg width={W} height={H} style={{position: "absolute"}}>
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="0.6" stopColor={mid} /><stop offset="1" stopColor={bot} /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#sky)" />
    {st.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#fff" opacity={0.35 + 0.35 * Math.sin(f / 22 + s.p)} />)}
  </svg></AbsoluteFill>;
};

// ---------- map projection (equirectangular window) ----------
export type View = {lon0: number; lon1: number; lat0: number; lat1: number; x: number; y: number; w: number; h: number};
export const proj = (v: View) => (lon: number, lat: number): [number, number] =>
  [v.x + ((lon - v.lon0) / (v.lon1 - v.lon0)) * v.w, v.y + ((v.lat1 - lat) / (v.lat1 - v.lat0)) * v.h];
export const ringPath = (r: number[][], P: (a: number, b: number) => [number, number]) => "M" + r.map(([lo, la]) => P(lo, la).map((n) => n.toFixed(1)).join(",")).join("L") + "Z";

// ---------- icons: simple drawn symbols, 100x100 box, centre (0,0) ----------
export type IconName = "match" | "flame" | "press" | "firework" | "hand" | "sun" | "gear" | "gavel" | "flask" | "qr" | "calendar" | "factory" | "coin" | "doc" | "ship" | "train" | "label" | "drop" | "house" | "person" | "tag" | "cap";
export const Icon: React.FC<{n: IconName; s?: number; color?: string; lit?: number}> = ({n, s = 100, color = C.cream, lit = 1}) => {
  const k = s / 100, st = {stroke: color, strokeWidth: 5, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const};
  const body: Record<IconName, React.ReactNode> = {
    match: <><rect x="-5" y="-10" width="10" height="55" rx="3" {...st} /><ellipse cx="0" cy="-22" rx="11" ry="14" fill={lit > 0.5 ? C.flame : "none"} stroke={color} strokeWidth="5" /></>,
    flame: <path d="M0 -42 C 22 -18 30 0 22 22 C 16 38 -16 38 -22 22 C -30 0 -10 -14 0 -42 Z M0 -4 C 10 8 12 18 0 26 C -12 18 -8 6 0 -4 Z" {...st} fill={lit > 0.5 ? C.flame : "none"} />,
    press: <><rect x="-38" y="-30" width="76" height="22" rx="4" {...st} /><circle cx="-14" cy="10" r="16" {...st} /><circle cx="18" cy="10" r="16" {...st} /><path d="M-40 38 H40" {...st} /></>,
    firework: <>{Array.from({length: 8}, (_, i) => { const a = (i * Math.PI) / 4; return <line key={i} x1={Math.cos(a) * 12} y1={Math.sin(a) * 12} x2={Math.cos(a) * 40} y2={Math.sin(a) * 40} {...st} />; })}<circle r="5" fill={color} stroke="none" /></>,
    hand: <path d="M-24 30 V-6 a7 7 0 0 1 14 0 V-22 a7 7 0 0 1 14 0 V-26 a7 7 0 0 1 14 0 V-18 a7 7 0 0 1 14 0 V14 C 18 38 -6 44 -24 30 Z" {...st} />,
    sun: <><circle r="16" {...st} />{Array.from({length: 8}, (_, i) => { const a = (i * Math.PI) / 4; return <line key={i} x1={Math.cos(a) * 26} y1={Math.sin(a) * 26} x2={Math.cos(a) * 40} y2={Math.sin(a) * 40} {...st} />; })}</>,
    gear: <><circle r="16" {...st} />{Array.from({length: 8}, (_, i) => { const a = (i * Math.PI) / 4; return <line key={i} x1={Math.cos(a) * 24} y1={Math.sin(a) * 24} x2={Math.cos(a) * 38} y2={Math.sin(a) * 38} {...st} strokeWidth="11" />; })}<circle r="28" {...st} /></>,
    gavel: <><rect x="-36" y="-24" width="40" height="22" rx="4" transform="rotate(-30)" {...st} /><path d="M-4 6 L34 38" {...st} strokeWidth="9" /><path d="M-30 44 H20" {...st} /></>,
    flask: <path d="M-10 -38 H10 M-8 -38 V-6 L-32 34 a8 8 0 0 0 7 12 H25 a8 8 0 0 0 7 -12 L8 -6 V-38" {...st} />,
    qr: <>{[[-34, -34], [14, -34], [-34, 14]].map(([x, y], i) => <rect key={i} x={x} y={y} width="20" height="20" {...st} />)}<rect x="12" y="12" width="8" height="8" fill={color} stroke="none" /><rect x="28" y="28" width="8" height="8" fill={color} stroke="none" /><rect x="28" y="10" width="8" height="8" fill={color} stroke="none" /></>,
    calendar: <><rect x="-36" y="-30" width="72" height="68" rx="6" {...st} /><path d="M-36 -10 H36 M-18 -40 V-24 M18 -40 V-24" {...st} /><circle cx="0" cy="14" r="7" fill={lit > 0.5 ? C.flame : color} stroke="none" /></>,
    factory: <path d="M-40 38 V-4 L-16 12 V-4 L8 12 V-30 H22 V38 Z M28 38 V-8 H40 V38" {...st} />,
    coin: <><circle r="30" {...st} /><path d="M-8 -12 H12 M-8 0 H12 M-4 -12 C 14 -12 14 6 -4 6 L10 22" {...st} strokeWidth="4" /></>,
    doc: <><path d="M-26 -38 H10 L26 -22 V38 H-26 Z" {...st} /><path d="M-14 -6 H14 M-14 8 H14 M-14 22 H6" {...st} strokeWidth="4" /></>,
    ship: <path d="M-42 8 H42 L30 32 H-30 Z M-8 8 V-26 L24 8 M-8 -26 V-36" {...st} />,
    train: <><rect x="-40" y="-26" width="80" height="44" rx="8" {...st} /><circle cx="-22" cy="30" r="8" {...st} /><circle cx="22" cy="30" r="8" {...st} /><path d="M-40 -6 H40" {...st} /></>,
    label: <><rect x="-34" y="-26" width="68" height="52" rx="6" {...st} /><circle r="12" {...st} /></>,
    drop: <path d="M0 -38 C 26 -6 28 14 14 28 C 4 38 -4 38 -14 28 C -28 14 -26 -6 0 -38 Z" {...st} />,
    house: <path d="M-38 6 L0 -32 L38 6 M-28 -4 V36 H28 V-4 M-8 36 V12 H8 V36" {...st} />,
    person: <><circle cy="-26" r="11" {...st} /><path d="M-22 40 V8 a22 22 0 0 1 44 0 V40" {...st} /></>,
    tag: <><path d="M-34 -4 L-4 -34 H30 V0 L0 30 Z" {...st} /><circle cx="14" cy="-16" r="5" fill={color} stroke="none" /></>,
    cap: <><path d="M-34 14 H34 M-26 14 V-6 C -26 -30 26 -30 26 -6 V14" {...st} /></>,
  };
  return <g transform={`scale(${k})`} style={{filter: lit > 0.5 ? `drop-shadow(0 0 ${10 * lit}px ${color})` : undefined}}>{body[n]}</g>;
};
