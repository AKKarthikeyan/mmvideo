// Shared drawing kit for the Gita channel: palette, timing helpers, ink primitives, backgrounds and line icons.
// Icons are drawn on a 100 x 100 box, centred on (50, 50), stroked in ink (draw-on) or filled as silhouettes.
import React, {useMemo} from "react";
import {AbsoluteFill, Easing, interpolate, random} from "remotion";
import {svgPathProperties} from "svg-path-properties";

export const FPS = 30, W = 1920, H = 1080;
export const NIGHT = "#0e1233", INDIGO = "#1b2152", DUSK = "#3b2c5e", SAFFRON = "#f2a33a", EMBER = "#d9731f";
export const PAPER = "#f2e8d0", INK = "#2b2118", SEAL = "#b23a1c", NOTE = "#2f3f8f", BROWN = "#6b5a45", GOLD = "#d9a441";
export const SLATE = "#151c28", SLATE2 = "#223047", COOL = "#9fc3e6", TEAL = "#1f7f7a", LEAFGREEN = "#5f8f3a";

export const ip = (f: number, a: number, b: number, x = 0, y = 1, easing?: (t: number) => number) =>
  interpolate(f, [a, b], [x, y], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing});
export const EASE = Easing.bezier(0.33, 0, 0.2, 1);
export const OUT = Easing.out(Easing.cubic);

// ---------- timing (built by scripts/gita/build_gita15.py)
export type Cue = {key: string; beat: string; kind: "say" | "en"; text: string; note: boolean; card: string | null; start: number; dur: number};
export type Beat = {key: string; section: string; chapter: number | null; refs: string[]; start: number; end: number};
export type Card = {deva: string[]; iast: string[]; en: string; speaker: string; gloss: string | null};
export type Chapter = {deva: string; iast: string; en: string; ordinal: string};
export type Label = {v: string; show: string; en: string; deva: string | null};
export type G15Data = {id: string; fps: number; voice: string; total: number; beats: Beat[]; cues: Cue[];
  cards: Record<string, Card>; chapters: Record<string, Chapter>; labels: Record<string, Label>; verse_counts: number[]};

export const timing = (D: G15Data) => {
  const m: Record<string, Cue> = Object.fromEntries(D.cues.map((c) => [c.key, c]));
  const get = (k: string) => { if (!m[k]) throw new Error(`no cue ${k}`); return m[k]; };
  const s = (k: string) => Math.round(get(k).start * FPS);
  const e = (k: string) => Math.round((get(k).start + get(k).dur) * FPS);
  const at = (k: string, ph: string) => {
    const c = get(k); const i = c.text.indexOf(ph);
    if (i < 0) throw new Error(`phrase "${ph}" not in ${k}`);
    return Math.round((c.start + (c.dur * i) / c.text.length) * FPS);
  };
  const beat = (k: string) => D.beats.find((b) => b.key === k)!;
  return {s, e, at, beat, cue: get, total: Math.ceil(D.total * FPS), D};
};
export type TT = ReturnType<typeof timing>;

// ---------- ink primitives
export const Stroke: React.FC<{d: string; p: number; color?: string; w?: number; opacity?: number; filter?: string; fill?: string}> =
  ({d, p, color = INK, w = 4, opacity = 1, filter, fill}) => {
    const len = useMemo(() => new svgPathProperties(d).getTotalLength(), [d]);
    return <path d={d} fill={fill ?? "none"} stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray={len} strokeDashoffset={len * (1 - p)} opacity={p <= 0 ? 0 : opacity} filter={filter}/>;
  };
export const circ = (cx: number, cy: number, r: number) => `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`;

export const Defs: React.FC<{id: string; wobble?: number}> = ({id, wobble = 3.2}) => (
  <defs>
    <filter id={`ink-${id}`}><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={4}/>
      <feDisplacementMap in="SourceGraphic" scale={wobble}/></filter>
    <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={14}/></filter>
    <filter id={`soft-${id}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={4}/></filter>
  </defs>
);
export const Grain: React.FC<{opacity?: number; id: string}> = ({opacity = 0.09, id}) => (
  <svg width={W} height={H} style={{position: "absolute", inset: 0, mixBlendMode: "multiply", opacity}}>
    <filter id={`grain-${id}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={9}/>
      <feColorMatrix type="saturate" values="0"/></filter>
    <rect width={W} height={H} filter={`url(#grain-${id})`}/>
  </svg>
);
export const Vignette: React.FC<{strength?: number}> = ({strength = 0.55}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(5,6,20,${strength}) 100%)`}}/>
);
export const Dust: React.FC<{f: number; n?: number; color?: string; seed: string; yMin?: number; yMax?: number}> =
  ({f, n = 40, color = SAFFRON, seed, yMin = 120, yMax = 980}) => (
    <svg width={W} height={H} style={{position: "absolute", inset: 0}}>
      {Array.from({length: n}).map((_, i) => {
        const x = (random(`${seed}x${i}`) * W + f * (0.3 + random(`${seed}v${i}`) * 0.8)) % W;
        const y = yMin + random(`${seed}y${i}`) * (yMax - yMin) + Math.sin(f / 40 + i) * 12;
        const o = 0.12 + 0.3 * (0.5 + 0.5 * Math.sin(f / 18 + i * 1.7));
        return <circle key={i} cx={x} cy={y} r={1.2 + random(`${seed}r${i}`) * 2.4} fill={color} opacity={o}/>;
      })}
    </svg>
  );

// ---------- backgrounds (every scene sits on one of these)
export const NightBG: React.FC<{f: number; id: string; glow?: string; children?: React.ReactNode; dust?: boolean}> =
  ({f, id, glow = "50% 45%", children, dust = true}) => (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at ${glow}, ${INDIGO} 0%, ${NIGHT} 78%)`}}>
      {children}
      {dust && <Dust f={f} seed={id} n={28}/>}
      <Grain id={id} opacity={0.1}/>
      <Vignette/>
    </AbsoluteFill>
  );
export const PaperBG: React.FC<{id: string; children?: React.ReactNode}> = ({id, children}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, #f6eedb 0%, ${PAPER} 60%, #e6d8b8 100%)`}}>
    {children}
    <Grain id={id} opacity={0.14}/>
    <Vignette strength={0.22}/>
  </AbsoluteFill>
);
export const SlateBG: React.FC<{f: number; id: string; warm?: number; children?: React.ReactNode}> = ({f, id, warm = 0, children}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 62% 38%, ${SLATE2} 0%, ${SLATE} 75%)`}}>
    <AbsoluteFill style={{background: "radial-gradient(ellipse at 80% 30%, rgba(255,196,120,0.55) 0%, transparent 60%)", opacity: warm}}/>
    {children}
    <Grain id={id} opacity={0.12}/>
    <Vignette strength={0.5}/>
  </AbsoluteFill>
);

// ---------- kinetic serif line (narration key phrases are never shown; only labels and quotes from the script)
export const Kin: React.FC<{f: number; at: number; x: number; y: number; size?: number; color?: string; italic?: boolean;
  align?: "left" | "center" | "right"; w?: number; children: React.ReactNode; out?: number; weight?: number; font?: string}> =
  ({f, at, x, y, size = 64, color = PAPER, italic, align = "left", w = 1400, children, out, weight, font}) => {
    const o = ip(f, at, at + 10) * (out ? ip(f, out, out + 10, 1, 0) : 1);
    const left = align === "center" ? x - w / 2 : align === "right" ? x - w : x;
    return <div style={{position: "absolute", left, top: y, width: w, textAlign: align, fontFamily: font ?? "'DM Serif Display', Georgia, serif",
      fontStyle: italic ? "italic" : "normal", fontSize: size, color, opacity: o, lineHeight: 1.2, fontWeight: weight,
      transform: `translateY(${ip(f, at, at + 14, 18, 0, EASE)}px)`}}>{children}</div>;
  };

// ---------- shapes reused from the style test (side view, facing right)
export const HORSE = "M 0 0 C 60 -15 150 -15 200 -10 C 230 -40 260 -100 285 -130 L 282 -155 L 298 -136 C 320 -120 345 -80 360 -50 " +
  "C 365 -35 350 -25 335 -30 C 310 -40 290 -45 275 -30 C 265 -5 262 30 255 60 L 250 120 L 245 200 L 258 215 L 236 215 " +
  "L 228 130 L 222 85 C 170 95 100 95 60 85 L 55 140 L 70 210 L 82 215 L 60 215 L 40 150 L 25 95 C 5 80 -15 40 0 0 Z";
export const ELEPHANT = "M 0 0 C 0 -50 30 -75 75 -75 C 115 -75 140 -60 150 -40 C 165 -35 172 -10 168 25 L 160 25 C 162 0 158 -15 150 -15 " +
  "L 148 40 L 132 40 L 130 10 L 50 10 L 48 40 L 32 40 L 30 8 C 10 5 0 0 0 0 Z M 40 -78 L 110 -78 L 110 -100 L 40 -100 Z";
export const WHEEL = (cx: number, cy: number, r: number) => [circ(cx, cy, r), circ(cx, cy, r * 0.88), circ(cx, cy, r * 0.15),
  ...Array.from({length: 8}).map((_, i) => {
    const a = (i * Math.PI) / 4;
    return `M ${cx + r * 0.15 * Math.cos(a)} ${cy + r * 0.15 * Math.sin(a)} L ${cx + r * 0.88 * Math.cos(a)} ${cy + r * 0.88 * Math.sin(a)}`;
  })].join(" ");
export const BOX = "M 520 620 L 520 500 Q 525 470 565 470 L 800 470 C 860 470 900 420 915 370 L 940 372 L 930 620 Z M 530 560 L 925 560";
export const POLE = "M 930 600 C 1050 612 1250 614 1460 602 M 1440 572 L 1482 640";
export const BOW = "M 0 -380 C 40 -372 52 -330 30 -300 C 92 -200 112 -80 112 0 C 112 80 92 200 30 300 C 52 330 40 372 0 380";
export const flag = (f: number, x = 540, y = 215) => {
  const w = Math.sin(f / 7) * 10, w2 = Math.sin(f / 7 + 1.4) * 8;
  return `M ${x} ${y} C ${x + 40} ${y + 7 + w2} ${x + 80} ${y + 21 + w} ${x + 124} ${y + 31 + w} C ${x + 80} ${y + 41 + w} ${x + 40} ${y + 51 + w2} ${x} ${y + 61} Z`;
};

const FEATHER_BARBS = Array.from({length: 46}).map((_, i) => {
  const t = i / 45, y = 70 + t * 520, x = 5 - t * 30, l = 70 * (1 - t) + 14;
  return `M ${x} ${y} Q ${x - l * 0.6} ${y - l * 0.5} ${x - l} ${y - l * 0.9} M ${x} ${y} Q ${x + l * 0.6} ${y - l * 0.5} ${x + l} ${y - l * 0.9}`;
}).join(" ");
// Krishna's symbol. (x, y) = centre of the eye; scale 1 = 600 px tall.
export const Feather: React.FC<{x: number; y: number; rot?: number; scale?: number; p?: number; glint?: number}> =
  ({x, y, rot = 24, scale = 1, p = 1, glint = 0}) => (
    <g opacity={p} transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale * (0.9 + 0.1 * p)})`}>
      <path d={FEATHER_BARBS} stroke="#5f8f3a" strokeWidth={2.2 / scale} fill="none" opacity={0.75}/>
      <path d="M 0 60 C 5 200 -10 400 -30 620" stroke="#e2cf96" strokeWidth={4.5} fill="none"/>
      <ellipse cx={0} cy={0} rx={92} ry={122} fill="#4f8a2c" opacity={0.85}/>
      <ellipse cx={0} cy={6} rx={64} ry={88} fill="#c58b2a"/>
      <ellipse cx={0} cy={12} rx={50} ry={70} fill="#1f7f7a"/>
      <ellipse cx={0} cy={20} rx={30} ry={44} fill="#1b2a6b"/>
      <ellipse cx={-8} cy={2} rx={10} ry={14} fill="#fff" opacity={0.25 + 0.6 * glint}/>
    </g>
  );
// Krishna's flute (bansuri), horizontal; (x, y) = left end, len = length in px.
export const Flute: React.FC<{x: number; y: number; len?: number; p?: number; rot?: number}> = ({x, y, len = 520, p = 1, rot = 0}) => (
  <g opacity={p} transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={0} y={-11} width={len} height={22} rx={11} fill="#c79a52"/>
    <rect x={0} y={-11} width={len} height={8} rx={4} fill="#e2bd78" opacity={0.7}/>
    {[0.08, 0.92].map((t, i) => <rect key={i} x={len * t - 6} y={-12} width={12} height={24} rx={3} fill="#7a4a1e"/>)}
    {[0.2, 0.5, 0.56, 0.62, 0.68, 0.74, 0.8].map((t, i) => <circle key={i} cx={len * t} cy={0} r={i ? 4.5 : 6} fill="#3b2412"/>)}
    <path d={`M ${len * 0.92} 10 C ${len * 0.94} 40 ${len * 0.9} 70 ${len * 0.93} 110`} stroke={SEAL} strokeWidth={4} fill="none"/>
    <circle cx={len * 0.93} cy={116} r={7} fill={GOLD}/>
  </g>
);

// Diya (oil lamp) with a living flame; (x, y) = base centre; s = scale (1 = 120 px wide).
export const Diya: React.FC<{x: number; y: number; s?: number; f: number; p?: number; still?: number; id: string}> =
  ({x, y, s = 1, f, p = 1, still = 1, id}) => {
    const flick = (1 - still) * (Math.sin(f / 2.1) * 0.5 + Math.sin(f / 3.7) * 0.5);
    const lean = (1 - still) * Math.sin(f / 4.3) * 12;
    const h = 46 + 6 * Math.sin(f / 5) * still + 10 * flick;
    return (
      <g opacity={p} transform={`translate(${x} ${y}) scale(${s})`}>
        <circle cx={0} cy={-60} r={70} fill={SAFFRON} opacity={0.32 + 0.08 * Math.sin(f / 6)} filter={`url(#glow-${id})`}/>
        <path d="M -60 -8 Q 0 40 60 -8 Q 30 -2 0 -2 Q -30 -2 -60 -8 Z" fill="#9a5a24"/>
        <path d="M -60 -8 Q 0 6 60 -8" stroke="#c98a3c" strokeWidth={3} fill="none"/>
        <path d={`M 0 -6 C -14 -22 -12 ${-6 - h * 0.6} ${lean} ${-6 - h} C 12 ${-6 - h * 0.6} 14 -22 0 -6 Z`} fill={SAFFRON}/>
        <path d={`M 0 -8 C -6 -18 -5 ${-8 - h * 0.4} ${lean * 0.6} ${-8 - h * 0.62} C 5 ${-8 - h * 0.4} 6 -18 0 -8 Z`} fill="#fff1c2"/>
      </g>
    );
  };

// ---------- line icons (100 x 100 box). Drawn with <Icon d=... /> so they can draw on.
export const IC = {
  sun: `${circ(50, 50, 18)} M 50 14 L 50 24 M 50 76 L 50 86 M 14 50 L 24 50 M 76 50 L 86 50 M 25 25 L 32 32 M 68 68 L 75 75 M 75 25 L 68 32 M 32 68 L 25 75`,
  moon: "M 62 20 A 32 32 0 1 0 80 70 A 26 26 0 1 1 62 20 Z",
  earth: `${circ(50, 50, 30)} M 24 40 C 36 36 44 46 56 42 C 64 39 70 44 78 42 M 22 58 C 34 62 44 54 54 60 C 64 66 72 60 78 62`,
  water: "M 50 16 C 40 34 30 46 30 60 A 20 20 0 0 0 70 60 C 70 46 60 34 50 16 Z M 40 62 A 10 10 0 0 0 50 72",
  fire: "M 50 86 C 30 86 24 70 28 58 C 32 46 42 42 40 26 C 52 32 60 42 58 54 C 62 50 64 44 64 40 C 74 50 78 64 72 74 C 68 82 60 86 50 86 Z M 50 84 C 42 84 40 76 42 70 C 44 64 50 62 50 54 C 56 60 60 66 58 74 C 57 80 54 84 50 84 Z",
  air: "M 14 38 L 60 38 C 72 38 74 22 62 22 C 54 22 52 30 56 32 M 14 52 L 76 52 C 90 52 90 72 76 72 C 68 72 66 64 70 62 M 14 66 L 46 66",
  space: `${circ(50, 50, 32)} ${circ(50, 50, 18)} M 50 10 L 50 18 M 50 82 L 50 90 M 10 50 L 18 50 M 82 50 L 90 50`,
  mind: "M 50 20 C 30 20 20 34 22 48 C 14 52 16 64 24 66 C 24 76 36 82 46 78 L 46 86 M 50 20 C 70 20 80 34 78 48 C 86 52 84 64 76 66 C 76 76 64 82 54 78 L 54 86 M 50 20 L 50 78",
  intellect: `M 50 14 L 50 26 M 26 24 L 34 32 M 74 24 L 66 32 M 36 70 C 30 62 28 54 30 48 A 20 20 0 1 1 70 48 C 72 54 70 62 64 70 Z M 38 76 L 62 76 M 40 84 L 60 84`,
  ego: `${circ(50, 34, 14)} M 24 86 C 24 64 36 54 50 54 C 64 54 76 64 76 86 M 14 20 L 22 28 M 86 20 L 78 28 M 50 8 L 50 14`,
  mountain: "M 6 82 L 36 34 L 48 52 L 60 28 L 94 82 Z M 52 40 L 60 28 L 68 40 L 62 38 L 58 42 L 54 38 Z M 30 44 L 36 34 L 42 44",
  peepal: "M 50 92 L 50 70 M 50 70 C 24 66 14 44 20 30 C 26 18 40 12 50 8 C 60 12 74 18 80 30 C 86 44 76 66 50 70 Z M 50 70 L 50 14 M 50 30 L 36 22 M 50 30 L 64 22 M 50 44 L 30 36 M 50 44 L 70 36 M 50 56 L 32 52 M 50 56 L 68 52 M 50 8 C 50 4 52 0 56 -4",
  river: "M 8 34 C 22 26 34 42 50 34 C 66 26 78 42 92 34 M 8 52 C 22 44 34 60 50 52 C 66 44 78 60 92 52 M 8 70 C 22 62 34 78 50 70 C 66 62 78 78 92 70",
  blossom: `${circ(50, 50, 7)} M 50 43 C 40 26 60 26 50 43 M 57 50 C 74 40 74 60 57 50 M 50 57 C 60 74 40 74 50 57 M 43 50 C 26 60 26 40 43 50 M 55 45 C 66 30 72 36 55 45 M 55 55 C 70 66 64 72 55 55 M 45 55 C 34 70 28 64 45 55 M 45 45 C 30 34 36 28 45 45`,
  calendar: "M 20 22 L 80 22 L 80 86 L 20 86 Z M 20 38 L 80 38 M 34 14 L 34 28 M 66 14 L 66 28",
  leaf: "M 20 80 C 20 40 50 16 84 16 C 84 50 60 80 20 80 Z M 20 80 L 70 30 M 44 58 L 44 40 M 56 46 L 66 46 M 32 70 L 32 58",
  flower: `${circ(50, 46, 8)} M 50 38 C 42 22 58 22 50 38 M 58 46 C 74 38 74 54 58 46 M 50 54 C 58 70 42 70 50 54 M 42 46 C 26 54 26 38 42 46 M 50 54 L 50 92 M 50 74 C 60 68 68 72 70 76`,
  fruit: "M 50 30 C 26 30 18 52 22 66 C 26 82 42 90 54 88 C 72 86 84 70 80 52 C 76 36 64 30 50 30 Z M 50 30 C 50 22 54 16 60 12 M 52 22 C 62 14 74 16 78 22 C 70 28 60 28 52 22 Z",
  kalash: "M 34 26 L 66 26 M 38 26 C 38 34 30 36 26 46 C 20 62 30 84 50 84 C 70 84 80 62 74 46 C 70 36 62 34 62 26 M 30 60 L 70 60 M 40 26 C 40 18 44 12 50 8 C 56 12 60 18 60 26",
  gem: "M 30 34 L 70 34 L 84 50 L 50 88 L 16 50 Z M 16 50 L 84 50 M 30 34 L 40 50 L 50 88 M 70 34 L 60 50 L 50 88 M 40 50 L 50 34 L 60 50",
  scholar: `${circ(50, 26, 11)} M 30 84 C 30 60 38 46 50 46 C 62 46 70 60 70 84 M 34 62 L 66 62 L 66 76 L 34 76 Z M 50 62 L 50 76`,
  cow: "M 18 46 C 18 36 26 32 34 34 L 70 34 C 80 34 86 40 86 50 L 86 60 L 80 60 L 80 74 L 74 74 L 74 60 L 34 60 L 34 74 L 28 74 L 28 60 C 22 60 18 54 18 46 Z M 18 46 C 10 44 8 36 12 30 M 22 36 L 16 26 M 30 34 L 30 26",
  elephant: "M 14 70 L 14 44 C 14 28 28 20 46 20 C 70 20 86 30 86 50 L 86 78 L 76 78 L 76 62 L 34 62 L 34 78 L 24 78 L 24 64 M 14 44 C 6 52 6 66 12 74 M 34 34 C 30 44 34 52 42 52",
  dog: "M 20 66 L 20 50 C 20 42 26 40 32 40 L 66 40 L 72 28 L 78 30 L 80 40 C 86 42 88 48 84 52 L 76 52 L 76 72 L 70 72 L 70 56 L 32 56 L 32 72 L 26 72 L 26 58 M 20 50 C 12 48 10 40 14 34",
  person: `${circ(50, 24, 12)} M 26 88 C 26 60 36 44 50 44 C 64 44 74 60 74 88`,
  heart: "M 50 84 C 20 64 10 46 16 32 C 22 18 42 16 50 32 C 58 16 78 18 84 32 C 90 46 80 64 50 84 Z",
  eye: `M 8 50 C 26 24 74 24 92 50 C 74 76 26 76 8 50 Z ${circ(50, 50, 14)}`,
  axe: "M 20 86 L 64 30 M 56 22 C 66 10 86 16 90 30 C 80 34 72 40 68 48 Z",
  phone: "M 34 10 L 66 10 C 70 10 72 12 72 16 L 72 84 C 72 88 70 90 66 90 L 34 90 C 30 90 28 88 28 84 L 28 16 C 28 12 30 10 34 10 Z M 44 16 L 56 16",
  door: "M 26 88 L 26 34 C 26 18 38 10 50 10 C 62 10 74 18 74 34 L 74 88 Z M 64 52 L 64 56",
  arrow: "M 6 50 L 86 50 M 72 38 L 90 50 L 72 62 M 6 50 L 0 40 M 6 50 L 0 60 M 14 50 L 8 40 M 14 50 L 8 60",
  fireplace: "M 14 76 L 86 76 L 78 90 L 22 90 Z M 14 76 L 26 62 L 74 62 L 86 76",
};
export const Icon: React.FC<{d: string; x: number; y: number; s?: number; p?: number; color?: string; w?: number; fill?: string; fillO?: number; filter?: string}> =
  ({d, x, y, s = 1, p = 1, color = INK, w = 3, fill, fillO = 0, filter}) => (
    <g transform={`translate(${x - 50 * s} ${y - 50 * s}) scale(${s})`} filter={filter}>
      {fill && <path d={d} fill={fill} opacity={fillO * ip(p, 0.6, 1)}/>}
      <Stroke d={d} p={p} color={color} w={w / s * 1.0}/>
    </g>
  );
