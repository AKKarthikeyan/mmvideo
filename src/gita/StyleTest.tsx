// Gita channel style test (about 65 s, 16:9): 2.10 cold open, one verse card, one chariot diagram build.
// House rules on screen: the narrator is a guide, never the deity; verses show Sanskrit + IAST + English + source;
// quotes are italic, our interpretation is roman in an "OUR NOTE" box; ideas are drawn, gods are symbols (no faces).
// Timing comes from public/gita/styletest/data.json (scripts/gita/styletest.py); T.at(cue, phrase) throws on a missing phrase.
import React, {useMemo} from "react";
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, random, spring, staticFile, useCurrentFrame} from "remotion";
import {svgPathProperties} from "svg-path-properties";
import {DEVA, SANS, SERIF, useGitaFonts} from "./fonts";

export const FPS = 30, W = 1920, H = 1080;
type Cue = {key: string; beat: string; text: string; start: number; dur: number};
export type StyleData = {id: string; fps: number; lead: number; total: number; cues: Cue[]};

// palette: indigo night, saffron as the only accent, warm paper
const NIGHT = "#0e1233", INDIGO = "#1b2152", DUSK = "#3b2c5e", SAFFRON = "#f2a33a", EMBER = "#d9731f";
const PAPER = "#f2e8d0", INK = "#2b2118", LEAF = "#e8d49e", SEAL = "#b23a1c", NOTE = "#2f3f8f", BROWN = "#6b5a45";
const FADE = 14;

const ip = (f: number, a: number, b: number, x = 0, y = 1, easing?: (t: number) => number) =>
  interpolate(f, [a, b], [x, y], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing});
const EASE = Easing.bezier(0.33, 0, 0.2, 1);

const timing = (D: StyleData) => {
  const m: Record<string, Cue> = Object.fromEntries(D.cues.map((c) => [c.key, c]));
  const s = (k: string) => Math.round(m[k].start * FPS);
  const e = (k: string) => Math.round((m[k].start + m[k].dur) * FPS);
  const at = (k: string, ph: string) => {
    const c = m[k]; const i = c.text.indexOf(ph);
    if (i < 0) throw new Error(`phrase "${ph}" not in ${k}`);
    return Math.round((c.start + (c.dur * i) / c.text.length) * FPS);
  };
  return {s, e, at, total: Math.ceil(D.total * FPS), cues: D.cues};
};
type TT = ReturnType<typeof timing>;

// ---------- drawing primitives
const Stroke: React.FC<{d: string; p: number; color?: string; w?: number; opacity?: number; filter?: string}> =
  ({d, p, color = INK, w = 4, opacity = 1, filter}) => {
    const len = useMemo(() => new svgPathProperties(d).getTotalLength(), [d]);
    return <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray={len} strokeDashoffset={len * (1 - p)} opacity={p <= 0 ? 0 : opacity} filter={filter}/>;
  };
const circ = (cx: number, cy: number, r: number) => `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`;

const Defs: React.FC<{id: string}> = ({id}) => (
  <defs>
    <filter id={`ink-${id}`}><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={4}/>
      <feDisplacementMap in="SourceGraphic" scale={3.5}/></filter>
    <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={14}/></filter>
    <filter id={`soft-${id}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={4}/></filter>
  </defs>
);

const Grain: React.FC<{opacity?: number; id: string}> = ({opacity = 0.09, id}) => (
  <svg width={W} height={H} style={{position: "absolute", inset: 0, mixBlendMode: "multiply", opacity}}>
    <filter id={`grain-${id}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={9}/>
      <feColorMatrix type="saturate" values="0"/></filter>
    <rect width={W} height={H} filter={`url(#grain-${id})`}/>
  </svg>
);
const Vignette: React.FC<{strength?: number}> = ({strength = 0.55}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(5,6,20,${strength}) 100%)`}}/>
);

const Dust: React.FC<{f: number; n?: number; color?: string; seed: string; yMin?: number; yMax?: number}> =
  ({f, n = 40, color = SAFFRON, seed, yMin = 300, yMax = 1000}) => (
    <svg width={W} height={H} style={{position: "absolute", inset: 0}}>
      {Array.from({length: n}).map((_, i) => {
        const x = (random(`${seed}x${i}`) * W + f * (0.4 + random(`${seed}v${i}`) * 0.9)) % W;
        const y = yMin + random(`${seed}y${i}`) * (yMax - yMin) + Math.sin(f / 40 + i) * 12;
        const o = 0.15 + 0.35 * (0.5 + 0.5 * Math.sin(f / 18 + i * 1.7));
        return <circle key={i} cx={x} cy={y} r={1.2 + random(`${seed}r${i}`) * 2.6} fill={color} opacity={o}/>;
      })}
    </svg>
  );

// ---------- shapes (side view, facing right)
const HORSE = "M 0 0 C 60 -15 150 -15 200 -10 C 230 -40 260 -100 285 -130 L 282 -155 L 298 -136 C 320 -120 345 -80 360 -50 " +
  "C 365 -35 350 -25 335 -30 C 310 -40 290 -45 275 -30 C 265 -5 262 30 255 60 L 250 120 L 245 200 L 258 215 L 236 215 " +
  "L 228 130 L 222 85 C 170 95 100 95 60 85 L 55 140 L 70 210 L 82 215 L 60 215 L 40 150 L 25 95 C 5 80 -15 40 0 0 Z";
const HORSE_TAIL = "M 2 6 C -30 20 -52 70 -46 124";
const HORSE_MANE = "M 206 -14 C 232 -52 252 -96 278 -126";
const HORSE_MOUTH: [number, number] = [345, -32];
const HORSE_PIVOT: [number, number] = [60, 215];
const ELEPHANT = "M 0 0 C 0 -50 30 -75 75 -75 C 115 -75 140 -60 150 -40 C 165 -35 172 -10 168 25 L 160 25 C 162 0 158 -15 150 -15 " +
  "L 148 40 L 132 40 L 130 10 L 50 10 L 48 40 L 32 40 L 30 8 C 10 5 0 0 0 0 Z M 40 -78 L 110 -78 L 110 -100 L 40 -100 Z";

const WHEEL = [circ(700, 700, 150), circ(700, 700, 132), circ(700, 700, 22),
  ...Array.from({length: 8}).map((_, i) => {
    const a = (i * Math.PI) / 4;
    return `M ${700 + 22 * Math.cos(a)} ${700 + 22 * Math.sin(a)} L ${700 + 132 * Math.cos(a)} ${700 + 132 * Math.sin(a)}`;
  })].join(" ");
const BOX = "M 520 620 L 520 500 Q 525 470 565 470 L 800 470 C 860 470 900 420 915 370 L 940 372 L 930 620 Z M 530 560 L 925 560";
const POLE = "M 930 600 C 1050 612 1250 614 1460 602 M 1440 572 L 1482 640";
const FLAG_POLE = "M 540 470 L 540 210";
const flag = (f: number) => {
  const w = Math.sin(f / 7) * 10, w2 = Math.sin(f / 7 + 1.4) * 8;
  return `M 540 215 C 580 ${222 + w2} 620 ${236 + w} 664 ${246 + w} C 620 ${256 + w} 580 ${266 + w2} 540 276 Z`;
};

const rot = ([x, y]: [number, number], [px, py]: [number, number], deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180, dx = x - px, dy = y - py;
  return [px + dx * Math.cos(a) - dy * Math.sin(a), py + dx * Math.sin(a) + dy * Math.cos(a)];
};

// ---------- scene wrapper (each scene fades in over the previous one; "ink" opens as a spreading drop)
const Scene: React.FC<{from: number; to: number; first?: boolean; last?: boolean; ink?: boolean;
  children: (f: number) => React.ReactNode}> = ({from, to, first, last, ink, children}) => (
  <Sequence from={from} durationInFrames={to - from + (last ? 0 : FADE)}>
    <SceneBody from={from} first={first} ink={ink}>{children}</SceneBody>
  </Sequence>
);
const SceneBody: React.FC<{from: number; first?: boolean; ink?: boolean; children: (f: number) => React.ReactNode}> =
  ({from, first, ink, children}) => {
    const lf = useCurrentFrame();
    const style: React.CSSProperties = ink
      ? {clipPath: `circle(${ip(lf, 0, 22, 0, 1250, Easing.out(Easing.cubic))}px at 50% 42%)`}
      : {opacity: first ? 1 : ip(lf, 0, FADE)};
    return <AbsoluteFill style={style}>{children(lf + from)}</AbsoluteFill>;
  };

// ---------- A. dawn over Kurukshetra (c01-c03)
const Army: React.FC<{x0: number; x1: number; y: number; s: number; color: string; seed: string; f: number; dir: 1 | -1}> =
  ({x0, x1, y, s, color, seed, f, dir}) => {
    const els: React.ReactNode[] = [];
    let i = 0;
    for (let x = x0; x < x1; x += 24 * s + random(`${seed}g${i}`) * 10 * s, i++) {
      const r = random(`${seed}${i}`);
      const yy = y + (random(`${seed}j${i}`) - 0.5) * 8 * s;
      if (r < 0.06 && s < 1.2) {
        els.push(<path key={`e${i}`} d={ELEPHANT} fill={color} transform={`translate(${x} ${yy - 40 * s}) scale(${s * 0.55 * dir} ${s * 0.55})`}/>);
        x += 60 * s; continue;
      }
      els.push(<rect key={`b${i}`} x={x - 5 * s} y={yy - 34 * s} width={10 * s} height={34 * s} rx={4 * s} fill={color}/>);
      els.push(<circle key={`h${i}`} cx={x} cy={yy - 40 * s} r={6 * s} fill={color}/>);
      const tip = yy - (95 + r * 30) * s;
      els.push(<line key={`s${i}`} x1={x + 6 * s} y1={yy - 16 * s} x2={x + (8 + dir * 4) * s} y2={tip} stroke={color} strokeWidth={1.6 * s}/>);
      if (r > 0.86) {
        const top = yy - 150 * s, w = Math.sin(f / 8 + i) * 6 * s;
        els.push(<line key={`p${i}`} x1={x} y1={yy - 30 * s} x2={x} y2={top} stroke={color} strokeWidth={2 * s}/>);
        els.push(<path key={`f${i}`} d={`M ${x} ${top} Q ${x + dir * 22 * s} ${top + 8 * s + w} ${x + dir * 44 * s} ${top + 12 * s + w} Q ${x + dir * 22 * s} ${top + 18 * s + w} ${x} ${top + 26 * s} Z`} fill={color}/>);
      } else if (r > 0.8) {
        els.push(<path key={`u${i}`} d={`M ${x - 26 * s} ${yy - 120 * s} Q ${x} ${yy - 150 * s} ${x + 26 * s} ${yy - 120 * s} Z M ${x} ${yy - 120 * s} L ${x} ${yy - 40 * s}`} fill={color} stroke={color} strokeWidth={2 * s}/>);
      }
    }
    return <g>{els}</g>;
  };

const SmallChariot: React.FC<{f: number; shake: number; color: string}> = ({f, shake, color}) => {
  const jx = (random(`jx${f}`) - 0.5) * 3 * shake, jy = (random(`jy${f}`) - 0.5) * 2 * shake;
  return (
    <g transform="translate(960 762) scale(0.34) translate(-900 -850)">
      {[0, 1].map((k) => <path key={k} d={HORSE} fill={color} transform={`translate(${1250 + k * 60} ${635 - k * 20})`}/>)}
      <path d={POLE} stroke={color} strokeWidth={12} fill="none"/>
      <path d={BOX} fill={color}/>
      <path d={WHEEL} stroke={color} strokeWidth={14} fill="none"/>
      <path d={FLAG_POLE} stroke={color} strokeWidth={10}/>
      <path d={flag(f)} fill={color}/>
      {/* the archer: silhouette, bow upright; his hands shake on c03 */}
      <g transform={`translate(${jx} ${jy})`}>
        <circle cx={640} cy={330} r={26} fill={color}/>
        <path d="M 640 356 L 626 480 L 656 480 Z" fill={color}/>
        <path d="M 600 200 C 660 260 660 420 600 480" stroke={color} strokeWidth={9} fill="none"/>
      </g>
      <circle cx={890} cy={360} r={22} fill={color}/>
      <path d="M 890 380 L 876 480 L 904 480 Z" fill={color}/>
    </g>
  );
};

const Dawn: React.FC<{f: number; T: TT}> = ({f, T}) => {
  const end = T.s("c04");
  const cam = ip(f, 0, end, 1, 1.34, Easing.inOut(Easing.quad));
  const sunY = ip(f, 0, end, 700, 618);
  const glow = ip(f, 0, end, 0.45, 0.95);
  const shake = ip(f, T.s("c03"), T.s("c03") + 18);
  const sil = "#170f26";
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${NIGHT} 0%, ${DUSK} 45%, #b9634a 62%, #2a1b36 62.5%, #140d22 100%)`}}>
      <AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: "960px 720px"}}>
        <svg width={W} height={H}>
          <Defs id="dawn"/>
          <circle cx={960} cy={sunY} r={240} fill={SAFFRON} opacity={glow * 0.5} filter="url(#glow-dawn)"/>
          <circle cx={960} cy={sunY} r={64} fill="#f9cf7a" opacity={0.95}/>
          <rect x={0} y={672} width={W} height={H} fill="#1d1430"/>
          <path d="M 0 676 C 200 640 360 660 520 644 C 700 628 820 660 960 650 C 1120 640 1260 626 1420 648 C 1600 668 1760 640 1920 652 L 1920 690 L 0 690 Z" fill="#2c1f3f"/>
          <Army x0={30} x1={800} y={700} s={0.7} color="#3a2a4c" seed="la" f={f} dir={1}/>
          <Army x0={1130} x1={1900} y={700} s={0.7} color="#3a2a4c" seed="ra" f={f} dir={-1}/>
          <Army x0={-20} x1={760} y={760} s={1.0} color="#271a37" seed="lb" f={f} dir={1}/>
          <Army x0={1170} x1={1960} y={760} s={1.0} color="#271a37" seed="rb" f={f} dir={-1}/>
          <SmallChariot f={f} shake={shake} color={sil}/>
          <Army x0={-60} x1={700} y={860} s={1.45} color={sil} seed="lc" f={f} dir={1}/>
          <Army x0={1230} x1={2000} y={860} s={1.45} color={sil} seed="rc" f={f} dir={-1}/>
          <rect x={0} y={860} width={W} height={300} fill={sil}/>
        </svg>
      </AbsoluteFill>
      <Dust f={f} seed="dawn" yMin={500} yMax={900}/>
      <Grain id="dawn" opacity={0.12}/>
      <Vignette/>
    </AbsoluteFill>
  );
};

// ---------- B. the bow slips (c04-c07)
const BOW = "M 0 -380 C 40 -372 52 -330 30 -300 C 92 -200 112 -80 112 0 C 112 80 92 200 30 300 C 52 330 40 372 0 380";
const Line: React.FC<{f: number; at: number; y: number; dim: number; children: React.ReactNode}> = ({f, at, y, dim, children}) => (
  <div style={{position: "absolute", left: 150, top: y, fontFamily: SERIF, fontSize: 70, color: PAPER,
    opacity: ip(f, at, at + 10) * dim, transform: `translateY(${ip(f, at, at + 14, 22, 0, EASE)}px)`}}>{children}</div>
);
const BowSlips: React.FC<{f: number; T: TT}> = ({f, T}) => {
  const fall = T.at("c06", "slips") + 4, land = fall + 16;
  const r = -ip(f, fall, land, 0, 74, Easing.in(Easing.quad)) + (f > land ? Math.exp(-(f - land) / 4) * Math.sin((f - land) / 1.6) * 4 : 0);
  const shake = f < fall ? (random(`bs${f}`) - 0.5) * 4 : 0;
  const quote = T.at("c07", "I will not fight");
  const dim = ip(f, quote - 6, quote + 6, 1, 0.32);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 78% 78%, ${EMBER} 0%, #7c3b43 30%, ${DUSK} 55%, ${NIGHT} 100%)`}}>
      <svg width={W} height={H} style={{position: "absolute"}}>
        <Defs id="bow"/>
        <g transform={`translate(1780 860) rotate(${r}) translate(${shake} -380)`}>
          <path d={BOW} stroke={SAFFRON} strokeWidth={22} fill="none" opacity={0.35} filter="url(#soft-bow)"/>
          <path d={BOW} stroke="#1a1020" strokeWidth={15} fill="none" strokeLinecap="round"/>
          <path d="M 6 -372 L 6 372" stroke="#e9d9b0" strokeWidth={2.4} opacity={0.8}/>
          <rect x={100} y={-44} width={26} height={88} rx={8} fill="#1a1020"/>
        </g>
        <rect x={0} y={860} width={W} height={220} fill="#140c1c"/>
        {Array.from({length: 24}).map((_, i) => <path key={i} d={`M ${i * 84} 872 l 42 -14 l 42 14`} stroke={EMBER} strokeWidth={2} fill="none" opacity={0.55}/>)}
        <rect x={0} y={856} width={W} height={4} fill={SAFFRON} opacity={0.5}/>
      </svg>
      <Line f={f} at={T.s("c04")} y={250} dim={dim}>His mouth goes dry.</Line>
      <Line f={f} at={T.s("c05")} y={345} dim={dim}>His limbs give way.</Line>
      <Line f={f} at={T.s("c06")} y={440} dim={dim}>His bow slips from his hand.</Line>
      <div style={{position: "absolute", left: 150, top: 600, fontFamily: SERIF, fontStyle: "italic", fontSize: 112, color: PAPER,
        opacity: ip(f, quote, quote + 10), transform: `scale(${ip(f, quote, quote + 16, 1.06, 1, EASE)})`, transformOrigin: "left center"}}>
        “I will not fight.”</div>
      <div style={{position: "absolute", left: 156, top: 740, fontFamily: SANS, fontSize: 26, letterSpacing: 3, color: SAFFRON,
        opacity: ip(f, quote + 8, quote + 18)}}>ARJUNA · GITA 2.9</div>
      <div style={{position: "absolute", left: 150, top: 990, fontFamily: SANS, fontSize: 24, letterSpacing: 2, color: PAPER,
        opacity: 0.6 * ip(f, T.s("c04") + 6, T.s("c04") + 18)}}>Bhagavad Gita 1.29–30 · 1.47 · 2.9</div>
      <Grain id="bow" opacity={0.12}/>
      <Vignette/>
    </AbsoluteFill>
  );
};

// ---------- C. the reins, and the smile (c08-c09)
const FEATHER_BARBS = Array.from({length: 46}).map((_, i) => {
  const t = i / 45, y = 70 + t * 520, x = 5 - t * 30, l = 70 * (1 - t) + 14;
  return `M ${x} ${y} Q ${x - l * 0.6} ${y - l * 0.5} ${x - l} ${y - l * 0.9} M ${x} ${y} Q ${x + l * 0.6} ${y - l * 0.5} ${x + l} ${y - l * 0.9}`;
}).join(" ");
const Feather: React.FC<{p: number; glint: number}> = ({p, glint}) => (
  <g opacity={p} transform={`translate(430 300) rotate(24) scale(${0.9 + 0.1 * p})`}>
    <path d={FEATHER_BARBS} stroke="#5f8f3a" strokeWidth={2.2} fill="none" opacity={0.75}/>
    <path d="M 0 60 C 5 200 -10 400 -30 620" stroke="#e2cf96" strokeWidth={4.5} fill="none"/>
    <ellipse cx={0} cy={0} rx={92} ry={122} fill="#4f8a2c" opacity={0.85}/>
    <ellipse cx={0} cy={6} rx={64} ry={88} fill="#c58b2a"/>
    <ellipse cx={0} cy={12} rx={50} ry={70} fill="#1f7f7a"/>
    <ellipse cx={0} cy={20} rx={30} ry={44} fill="#1b2a6b"/>
    <ellipse cx={-8} cy={2} rx={10} ry={14} fill="#fff" opacity={0.25 + 0.6 * glint}/>
  </g>
);
const Reins: React.FC<{f: number; T: TT}> = ({f, T}) => {
  const p = ip(f, T.s("c08"), T.s("c08") + 34, 0, 1, EASE);
  const who = T.at("c08", "holding the reins");
  const sw = Math.sin(f / 22) * 10;
  const smile = T.s("c09");
  const bloom = ip(f, smile, smile + 26, 0, 1, EASE);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 85% 30%, #a1563f 0%, ${DUSK} 38%, ${NIGHT} 100%)`}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 55% 45%, rgba(242,163,58,0.55) 0%, transparent 60%)`, opacity: bloom}}/>
      <svg width={W} height={H} style={{position: "absolute"}}>
        <Defs id="reins"/>
        {[0, 1].map((k) => {
          const d = `M -60 ${930 + k * 40} C 500 ${760 + sw} 1200 ${520 + k * 50 - sw} 1990 ${350 + k * 90}`;
          return <g key={k}>
            <Stroke d={d} p={p} color="#3a2214" w={15}/>
            <Stroke d={d} p={p} color="#c98a3c" w={8} opacity={0.9 + 0.1 * bloom}/>
          </g>;
        })}
        <Feather p={ip(f, who - 8, who + 16, 0, 1, EASE)} glint={bloom}/>
      </svg>
      <div style={{position: "absolute", left: 980, top: 300, fontFamily: SERIF, fontSize: 110, color: "#ffe3ad",
        opacity: bloom, transform: `translateY(${(1 - bloom) * 20}px)`, textShadow: "0 0 40px rgba(242,163,58,0.6)"}}>He smiles.</div>
      <Dust f={f} seed="reins" n={30}/>
      <Grain id="reins" opacity={0.12}/>
      <Vignette/>
    </AbsoluteFill>
  );
};

// ---------- V. the verse card (c10-c11): bell, silence, Devanagari writes itself, IAST, English, source
const LEAF_D = "M 230 385 C 230 300 300 262 420 258 L 1500 258 C 1620 262 1690 300 1690 385 C 1690 470 1620 508 1500 512 L 420 512 C 300 508 230 470 230 385 Z";
const Wipe: React.FC<{p: number; top: number; children: React.ReactNode}> = ({p, top, children}) => {
  const x = -8 + p * 116;
  const m = `linear-gradient(90deg, #000 ${x - 8}%, transparent ${x}%)`;
  return <div style={{position: "absolute", left: 0, width: W, top, textAlign: "center", fontFamily: DEVA, fontSize: 60,
    color: "#3b2412", WebkitMaskImage: m, maskImage: m}}>{children}</div>;
};
const VerseCard: React.FC<{f: number; T: TT}> = ({f, T}) => {
  const ref = T.s("c10"), w1 = T.e("c10") + 6, w2 = w1 + 38, iast = w2 + 34, eng = T.s("c11");
  const hl = T.at("c11", "as if smiling");
  const leaf = ip(f, ref + 4, ref + 22, 0, 1, EASE);
  const stamp = spring({frame: f - (ref + 14), fps: FPS, config: {damping: 11, stiffness: 160}});
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 38%, ${INDIGO} 0%, ${NIGHT} 75%)`}}>
      <AbsoluteFill style={{opacity: leaf, transform: `translateY(${(1 - leaf) * 30}px)`}}>
        <svg width={W} height={H} style={{position: "absolute"}}>
          <Defs id="verse"/>
          <defs><linearGradient id="leafg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f0dfb0"/><stop offset="1" stopColor="#d4b878"/></linearGradient></defs>
          <path d={LEAF_D} fill="#000" opacity={0.35} transform="translate(0 14)" filter="url(#soft-verse)"/>
          <path d={LEAF_D} fill="url(#leafg)" filter="url(#ink-verse)"/>
          {Array.from({length: 14}).map((_, i) => (
            <path key={i} d={`M ${290 + random(`fa${i}`) * 60} ${274 + i * 17} C 700 ${270 + i * 17 + random(`fb${i}`) * 6} 1200 ${276 + i * 17} ${1640 - random(`fc${i}`) * 60} ${274 + i * 17}`}
              stroke="#b0904f" strokeWidth={1} opacity={0.28} fill="none"/>
          ))}
          <path d="M 380 290 L 1540 290 M 380 482 L 1540 482" stroke="#8a6a35" strokeWidth={1.4} opacity={0.5}/>
          <circle cx={330} cy={385} r={10} fill="#2a1c10"/><circle cx={1590} cy={385} r={10} fill="#2a1c10"/>
          <Stroke d="M 330 385 C 312 470 282 560 238 660" p={leaf} color="#9c2f1e" w={4}/>
        </svg>
        <Wipe p={ip(f, w1, w1 + 36)} top={312}>तमुवाच हृषीकेशः प्रहसन्निव भारत ।</Wipe>
        <Wipe p={ip(f, w2, w2 + 36)} top={398}>सेनयोरुभयोर्मध्ये विषीदन्तमिदं वचः ॥ २-१० ॥</Wipe>
        <div style={{position: "absolute", left: 1450, top: 150, transform: `rotate(-7deg) scale(${1.6 - 0.6 * stamp})`,
          opacity: Math.min(1, stamp * 1.4), border: `4px double ${SEAL}`, borderRadius: 10, padding: "8px 22px",
          color: SEAL, textAlign: "center", background: "rgba(242,232,208,0.92)"}}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: 4}}>BHAGAVAD GITA</div>
          <div style={{fontFamily: SERIF, fontSize: 58, lineHeight: 1}}>2.10</div>
        </div>
      </AbsoluteFill>
      <div style={{position: "absolute", top: 560, width: W, textAlign: "center", fontFamily: SANS, fontStyle: "italic",
        fontSize: 34, lineHeight: 1.5, color: PAPER, opacity: 0.85 * ip(f, iast, iast + 14)}}>
        tam uvāca hṛṣīkeśaḥ prahasann iva bhārata |<br/>senayor ubhayor madhye viṣīdantam idaṃ vacaḥ ||
      </div>
      <div style={{position: "absolute", top: 730, left: 260, width: 1400, textAlign: "center", fontFamily: SERIF, fontStyle: "italic",
        fontSize: 52, lineHeight: 1.3, color: PAPER, opacity: ip(f, eng, eng + 12)}}>
        “Then Krishna, <span style={{background: `linear-gradient(transparent 12%, rgba(242,163,58,${0.9 * ip(f, hl, hl + 8)}) 12%, rgba(242,163,58,${0.9 * ip(f, hl, hl + 8)}) 88%, transparent 88%)`,
          color: f >= hl + 4 ? INK : PAPER, padding: "0 8px"}}>as if smiling</span>, spoke these words to him, sinking in despair between the two armies.”
      </div>
      <div style={{position: "absolute", top: 985, width: W, textAlign: "center", fontFamily: SANS, fontSize: 23, letterSpacing: 1,
        color: PAPER, opacity: 0.6 * ip(f, eng + 10, eng + 24)}}>
        Word-for-word translation: ours  ·  hṛṣīkeśaḥ = Krishna  ·  bhārata: Sanjaya, telling the story to the blind king
      </div>
      <Grain id="verse" opacity={0.1}/>
      <Vignette strength={0.5}/>
    </AbsoluteFill>
  );
};

// ---------- Q. the question (c12-c13)
const Question: React.FC<{f: number; T: TT}> = ({f, T}) => {
  const a = T.s("c12"), b = T.at("c12", "at a man"), c = T.s("c13");
  const big: React.CSSProperties = {position: "absolute", width: W, textAlign: "center", fontFamily: SERIF, fontSize: 98, color: PAPER};
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 60%, ${INDIGO} 0%, ${NIGHT} 80%)`}}>
      <div style={{...big, top: 300, opacity: ip(f, a, a + 10), transform: `translateY(${ip(f, a, a + 14, 24, 0, EASE)}px)`}}>Why would anyone smile</div>
      <div style={{...big, top: 420, opacity: ip(f, b, b + 10), transform: `translateY(${ip(f, b, b + 14, 24, 0, EASE)}px)`}}>at a man who is falling apart?</div>
      <div style={{...big, top: 640, fontSize: 62, color: SAFFRON, opacity: ip(f, c, c + 10)}}>Start with who is holding the reins.</div>
      <svg width={W} height={H} style={{position: "absolute"}}>
        <Stroke d="M 420 770 C 760 812 1160 812 1500 770" p={ip(f, c + 4, c + 30, 0, 1, EASE)} color={SAFFRON} w={5}/>
      </svg>
      <Dust f={f} seed="q" n={26} yMin={100}/>
      <Grain id="q" opacity={0.1}/>
      <Vignette/>
    </AbsoluteFill>
  );
};

// ---------- D. the chariot diagram (c14-c21), Katha Upanishad 1.3.3-4
const Label: React.FC<{x: number; y: number; to: [number, number]; from: [number, number]; title: string; sub: string; p: number}> =
  ({x, y, to, from, title, sub, p}) => (
    <g opacity={ip(p, 0, 0.4)}>
      <text x={x} y={y} fontFamily={SANS} fontWeight={800} fontSize={28} letterSpacing={4} fill={INK}>{title}</text>
      <text x={x} y={y + 40} fontFamily={SERIF} fontStyle="italic" fontSize={32} fill={BROWN}>{sub}</text>
      <Stroke d={`M ${from[0]} ${from[1]} L ${to[0]} ${to[1]}`} p={ip(p, 0.2, 1)} color={BROWN} w={2}/>
      <circle cx={to[0]} cy={to[1]} r={6} fill={SEAL} opacity={ip(p, 0.8, 1)}/>
    </g>
  );
const Diagram: React.FC<{f: number; T: TT}> = ({f, T}) => {
  const t0 = T.s("c14");
  const pGround = ip(f, t0 + 8, t0 + 40, 0, 1, EASE);
  const pBody = ip(f, T.s("c15"), T.s("c15") + 36, 0, 1, EASE);
  const pHorse = ip(f, T.s("c16"), T.s("c16") + 40, 0, 1, EASE);
  const pReins = ip(f, T.s("c17"), T.s("c17") + 24, 0, 1, EASE);
  const pDriver = ip(f, T.s("c18"), T.s("c18") + 22, 0, 1, EASE);
  const self = T.at("c19", "the self");
  const pSelf = ip(f, self - 4, self + 18, 0, 1, EASE);
  // c20: the horses bolt (rear up, shake); c21: steady hands, they settle
  const bolt = ip(f, T.s("c20"), T.s("c20") + 8) * ip(f, T.s("c21") + 4, T.s("c21") + 26, 1, 0, EASE);
  const ang = -bolt * (8 + 3 * Math.sin(f / 2.2));
  const steady = ip(f, T.s("c21") + 4, T.s("c21") + 20);
  const horses: [number, number][] = [[1310, 615], [1250, 635]];
  const mouths = horses.map(([hx, hy], k) => {
    const [mx, my] = rot(HORSE_MOUTH, HORSE_PIVOT, ang * (k ? 1 : 1.2));
    return [hx + mx, hy + my] as [number, number];
  });
  const reinD = (m: [number, number], k: number) => `M 980 470 Q ${1300 + k * 20} ${520 - k * 20 - bolt * 30} ${m[0]} ${m[1]}`;
  const noteA = T.s("c20"), noteB = T.s("c21");
  const flame = 0.85 + 0.15 * Math.sin(f / 3) * Math.sin(f / 5.3);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <svg width={W} height={H} style={{position: "absolute"}}>
        <Defs id="dg"/>
        <text x={150} y={110} fontFamily={SANS} fontWeight={800} fontSize={26} letterSpacing={5} fill={SEAL}
          opacity={ip(f, t0 + 2, t0 + 14)}>KATHA UPANISHAD 1.3.3–4</text>
        <Stroke d="M 150 128 L 610 128" p={ip(f, t0 + 6, t0 + 26)} color={SEAL} w={2}/>
        <g filter="url(#ink-dg)">
          <Stroke d="M 120 852 L 1820 852" p={pGround} w={3}/>
          <Stroke d="M 200 880 L 330 880 M 520 900 L 700 900 M 980 878 L 1120 878 M 1380 896 L 1600 896" p={pGround} w={2} opacity={0.5}/>
          {/* horses (back one lighter), rearing on c20 */}
          {horses.map(([hx, hy], k) => {
            const ph = ip(pHorse, k ? 0 : 0.15, k ? 0.85 : 1);
            return (
              <g key={k} transform={`translate(${hx} ${hy}) rotate(${ang * (k ? 1 : 1.2)} ${HORSE_PIVOT[0]} ${HORSE_PIVOT[1]})`} opacity={k ? 0.55 : 1}>
                <Stroke d={HORSE} p={ph} w={4}/>
                <Stroke d={HORSE_TAIL} p={ph} w={4}/>
                <Stroke d={HORSE_MANE} p={ph} w={3}/>
                <circle cx={318} cy={-95} r={5} fill={INK} opacity={ph > 0.9 ? 1 : 0}/>
              </g>
            );
          })}
          <Stroke d={POLE} p={pBody} w={5}/>
          <Stroke d={WHEEL} p={pBody} w={4}/>
          <Stroke d={BOX} p={pBody} w={4.5}/>
          <Stroke d={FLAG_POLE} p={pBody} w={4}/>
          <path d={flag(f)} fill={SEAL} opacity={ip(pBody, 0.7, 1) * 0.85}/>
          {/* driver */}
          <Stroke d={`${circ(885, 362, 20)} M 885 384 C 882 420 879 448 876 470 M 884 405 Q 930 440 980 470`} p={pDriver} w={4.5}/>
        </g>
        {/* reins: the mind, in saffron; they glow when the hands hold steady */}
        {mouths.map((m, k) => (
          <g key={k}>
            <path d={reinD(m, k)} stroke={SAFFRON} strokeWidth={16} fill="none" opacity={0.45 * steady} filter="url(#soft-dg)"/>
            <Stroke d={reinD(m, k)} p={pReins} color={EMBER} w={5}/>
          </g>
        ))}
        {/* the self: a lamp in the chariot */}
        <g opacity={pSelf}>
          <circle cx={655} cy={432} r={60} fill={SAFFRON} opacity={0.35 * flame} filter="url(#glow-dg)"/>
          <path d="M 628 462 Q 655 486 682 462 Z" fill="#7a4a1e"/>
          <path d={`M 655 458 C 644 ${442} 648 ${424 - 4 * flame} 655 ${410 - 6 * flame} C 662 424 666 442 655 458 Z`} fill={SAFFRON}/>
        </g>
        <Label x={150} y={600} from={[400, 620]} to={[524, 590]} title="BODY" sub="the chariot · śarīra" p={ip(f, T.s("c15") + 8, T.s("c15") + 26)}/>
        <Label x={1500} y={300} from={[1620, 352]} to={[1640, 530]} title="SENSES" sub="the horses · indriya" p={ip(f, T.s("c16") + 10, T.s("c16") + 28)}/>
        <Label x={1080} y={330} from={[1200, 382]} to={[1290, 512]} title="MIND" sub="the reins · manas" p={ip(f, T.s("c17") + 8, T.s("c17") + 26)}/>
        <Label x={700} y={190} from={[820, 242]} to={[880, 336]} title="INTELLECT" sub="the driver · buddhi" p={ip(f, T.s("c18") + 6, T.s("c18") + 24)}/>
        <Label x={150} y={310} from={[420, 330]} to={[640, 420]} title="SELF" sub="the rider · ātman" p={ip(f, self + 4, self + 22)}/>
      </svg>
      {/* our interpretation: roman type, blue OUR NOTE tag (quotes are italic) */}
      <div style={{position: "absolute", left: 1040, top: 906, width: 800, opacity: ip(f, noteA, noteA + 10),
        transform: `translateY(${ip(f, noteA, noteA + 14, 20, 0, EASE)}px)`, background: "#fbf6ea", borderLeft: `8px solid ${NOTE}`,
        padding: "16px 26px", boxShadow: "0 6px 18px rgba(40,30,20,0.18)"}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 18, letterSpacing: 4, color: NOTE}}>OUR NOTE</div>
        <div style={{fontFamily: SERIF, fontSize: 36, color: INK, lineHeight: 1.25, marginTop: 4}}>
          Arjuna's horses had bolted. <span style={{opacity: ip(f, noteB, noteB + 10)}}>But the reins were still in steady hands.</span>
        </div>
      </div>
      <Grain id="dg" opacity={0.14}/>
      <Vignette strength={0.25}/>
    </AbsoluteFill>
  );
};

// ---------- E. tease (c22)
const EndCard: React.FC<{f: number; T: TT}> = ({f, T}) => {
  const a = T.s("c22"), b = T.e("c22");
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${INDIGO} 0%, ${NIGHT} 80%)`}}>
      <div style={{position: "absolute", top: 300, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 20,
        letterSpacing: 5, color: "#9fb0ff", opacity: ip(f, a, a + 10)}}>OUR NOTE</div>
      <div style={{position: "absolute", top: 350, left: 310, width: 1300, textAlign: "center", fontFamily: SERIF, fontSize: 64,
        lineHeight: 1.25, color: PAPER, opacity: ip(f, a, a + 12)}}>
        What Krishna says next, the whole of chapter two,<br/>is how to take them back.
      </div>
      <div style={{position: "absolute", top: 640, width: W, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 30,
        letterSpacing: 8, color: SAFFRON, opacity: ip(f, b, b + 12)}}>NEXT · CHAPTER 2</div>
      <svg width={W} height={H} style={{position: "absolute"}}>
        <Stroke d="M 760 720 C 880 740 1040 740 1160 720" p={ip(f, b + 4, b + 26, 0, 1, EASE)} color={SAFFRON} w={3}/>
      </svg>
      <div style={{position: "absolute", top: 1010, width: W, textAlign: "center", fontFamily: SANS, fontSize: 20, letterSpacing: 2,
        color: PAPER, opacity: 0.45}}>Style test · scratch voice · not for upload</div>
      <Dust f={f} seed="end" n={24} yMin={100}/>
      <Grain id="end" opacity={0.1}/>
      <Vignette/>
    </AbsoluteFill>
  );
};

// ---------- sound: tanpura bed ducked under every line and dropped for the verse silence; conch, thud, bells
const useBedVolume = (T: TT) => (f: number) => {
  let w = 0;
  for (const c of T.cues) {
    const s = c.start * FPS, e = (c.start + c.dur) * FPS;
    const dist = f < s ? s - f : f > e ? f - e : 0;
    w = Math.max(w, 1 - Math.min(1, dist / 10));
  }
  const base = ip(f, 0, 40, 0, 0.14) * ip(f, T.total - 50, T.total, 1, 0);   // v2: was 0.42 (AK: "loud noise")
  const verse = 1 - 0.85 * ip(f, T.e("c10"), T.e("c10") + 8) * ip(f, T.s("c11") - 10, T.s("c11"), 1, 0);
  return base * (1 - 0.6 * w) * verse;
};

export const StyleTest: React.FC<{D: StyleData}> = ({D}) => {
  useGitaFonts();
  const T = useMemo(() => timing(D), [D]);
  const bed = useBedVolume(T);
  const cuts = [0, T.s("c04") - 6, T.s("c08") - 6, T.s("c10") - 4, T.s("c12") - 6, T.s("c14") - 6, T.s("c22") - 8, T.total];
  const SC = [Dawn, BowSlips, Reins, VerseCard, Question, Diagram, EndCard];
  const land = T.at("c06", "slips") + 4 + 16;
  const a = (n: string) => staticFile(`gita/styletest/${n}`);
  return (
    <AbsoluteFill style={{background: NIGHT}}>
      {SC.map((C, i) => (
        <Scene key={i} from={cuts[i]} to={cuts[i + 1]} first={i === 0} last={i === SC.length - 1} ink={C === VerseCard}>
          {(f) => <C f={f} T={T}/>}
        </Scene>
      ))}
      <div style={{position: "absolute", right: 40, top: 30, fontFamily: SANS, fontWeight: 600, fontSize: 18, letterSpacing: 4,
        color: "#8a8a8a", opacity: 0.6}}>STYLE TEST</div>
      <Audio src={a("tanpura.wav")} loop volume={bed}/>
      <Sequence from={0}><Audio src={a("conch.wav")} volume={0.2}/></Sequence>
      <Sequence from={land}><Audio src={a("thud.wav")} volume={0.6}/></Sequence>
      <Sequence from={T.e("c10") + 2}><Audio src={a("bell.wav")} volume={0.38}/></Sequence>
      <Sequence from={T.e("c22") + 4}><Audio src={a("bell.wav")} volume={0.22}/></Sequence>
      {D.cues.map((c) => (
        <Sequence key={c.key} from={Math.round(c.start * FPS)}><Audio src={a(`${c.key}.wav`)}/></Sequence>
      ))}
    </AbsoluteFill>
  );
};
