// Look B, Part 2: the rain-fed field in the plains, for the stage scene (set "field"). Dry blue sky by default (hot haze, cracked pale soil);
// sky "clouds" is the monsoon arriving (dark cloud banks roll in from the west, a rain veil far off, damp soil, puddles, first green).
// Art coordinates are the 1920 x 1080 frame and bleed past it. The ground (where the farmer stands) begins at SET_FLOOR.field in stage_sets.
import React, {useMemo} from "react";
import {W, H, clamp, eo, lerp, prog, rng} from "../kit";

export const FIELD_HORIZON = 520;

const Tree: React.FC<{x: number; y: number; s: number; seed: number; f: number; wet: boolean; far?: boolean}> = ({x, y, s, seed, f, wet, far}) => {
  const lobes = useMemo(() => { const r = rng(seed); return Array.from({length: 11}).map(() => ({dx: (r() - 0.5) * 210, dy: -170 - r() * 120 + 0, r: 46 + r() * 38})); }, [seed]);
  const leaf = far ? (wet ? ["#6f8f7e", "#86a592", "#a8c0aa"] : ["#8a9a80", "#a1ae92", "#c3c8aa"]) : (wet ? ["#2f6a3e", "#468a4c", "#7fb15e"] : ["#5a7a3a", "#78994a", "#a6b76a"]);
  const sw = Math.sin(f / 50 + seed) * 2.5;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="20" cy="6" rx="150" ry="16" fill="#2c3a1f" opacity={far ? 0.12 : 0.28} filter="url(#fl-b6)"/>
      <path d="M-14,4 C-8,-60 -22,-120 -36,-190 L-8,-176 C4,-130 8,-70 16,4 Z M2,-110 C30,-150 60,-170 84,-196 L92,-184 C66,-160 40,-132 12,-92 Z" fill={far ? "#6f6a5a" : "#6e5438"} stroke={far ? "none" : "#3e2c1a"} strokeWidth="1.2"/>
      <g transform={`translate(${sw} 0)`}>
        {lobes.map((l, i) => <ellipse key={`a${i}`} cx={l.dx + 6} cy={l.dy + 22} rx={l.r * 1.1} ry={l.r * 0.78} fill={leaf[0]}/>)}
        {lobes.map((l, i) => <ellipse key={`b${i}`} cx={l.dx} cy={l.dy} rx={l.r} ry={l.r * 0.74} fill={leaf[1]}/>)}
        {lobes.map((l, i) => <ellipse key={`c${i}`} cx={l.dx - l.r * 0.22} cy={l.dy - l.r * 0.26} rx={l.r * 0.58} ry={l.r * 0.4} fill={leaf[2]} opacity={wet ? 0.7 : 0.85}/>)}
      </g>
    </g>
  );
};

const Palmyra: React.FC<{x: number; y: number; s: number; f: number; seed: number}> = ({x, y, s, f, seed}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity="0.92">
    <path d="M-5,0 C-8,-120 -2,-230 4,-330 L12,-330 C8,-230 6,-120 6,0 Z" fill="#7a6a56" stroke="#4a3d2e" strokeWidth="1"/>
    <g transform={`translate(8 -332) rotate(${Math.sin(f / 44 + seed) * 1.5})`}>
      {[-80, -50, -22, 8, 36, 64, 92].map((a, i) => <path key={i} transform={`rotate(${a - 90 + Math.sin(f / 30 + i + seed) * 2.5})`} d="M0,0 C34,-12 70,-8 96,16 C70,2 36,0 0,6 Z" fill={i % 2 ? "#4f7a3c" : "#5f8a45"} stroke="#2f4f26" strokeWidth="1"/>)}
      <circle r="9" fill="#5a4a34"/>
    </g>
  </g>
);

const Hut: React.FC<{x: number; y: number; s: number; roof: string}> = ({x, y, s, roof}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-40" y="-44" width="80" height="44" fill="#efe3c6" stroke="#a79672" strokeWidth="1.2"/>
    <rect x="-40" y="-14" width="80" height="14" fill="#c9b58a" opacity="0.5"/>
    <path d="M-52,-42 L0,-84 L52,-42 Z" fill={roof} stroke="#6a2f1c" strokeWidth="1.2"/>
    <path d="M-40,-44 L0,-78" stroke="#fff" strokeWidth="1.2" opacity="0.3"/>
    <rect x="-9" y="-30" width="18" height="30" rx="2" fill="#5a4630"/>
    <rect x="18" y="-34" width="14" height="14" fill="#7aa1b3" stroke="#5a4630"/>
  </g>
);

const Scarecrow: React.FC<{x: number; y: number; s: number; f: number}> = ({x, y, s, f}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="6" cy="4" rx="46" ry="7" fill="#3a2c1c" opacity="0.28" filter="url(#fl-b6)"/>
    <path d="M0,4 L0,-170" stroke="#6e5438" strokeWidth="7" strokeLinecap="round"/>
    <path d="M-72,-122 L72,-134" stroke="#6e5438" strokeWidth="6" strokeLinecap="round"/>
    <path d="M-30,-136 C-34,-90 -30,-76 -26,-60 L30,-60 C32,-80 36,-100 30,-136 Z" fill="#6f8aa6" stroke="#3c5068" strokeWidth="1.4"/>
    <path d="M-30,-136 C-62,-132 -90,-122 -108,-106 C-96,-104 -76,-108 -56,-110 L-30,-110 Z" fill="#6f8aa6" stroke="#3c5068" strokeWidth="1.2" transform={`rotate(${Math.sin(f / 26) * 3} -30 -130)`}/>
    <path d="M30,-138 C62,-138 90,-132 108,-120 C96,-114 76,-114 56,-112 L30,-112 Z" fill="#6f8aa6" stroke="#3c5068" strokeWidth="1.2" transform={`rotate(${-Math.sin(f / 26 + 1) * 3} 30 -130)`}/>
    <path d="M-26,-60 L-30,-24 M-8,-60 L-8,-28 M10,-60 L12,-26 M26,-60 L30,-30" stroke="#d9c89a" strokeWidth="3.4" strokeLinecap="round" opacity="0.9"/>
    <ellipse cx="0" cy="-172" rx="26" ry="29" fill="#c1673e" stroke="#7a3a1d" strokeWidth="1.6"/>
    <ellipse cx="-8" cy="-182" rx="9" ry="12" fill="#e08a5d" opacity="0.6"/>
    <path d="M-12,-176 l8,6 M-4,-176 l-8,6 M10,-176 l8,6 M18,-176 l-8,6" stroke="#2a1810" strokeWidth="2.4"/>
    <path d="M-12,-158 Q0,-150 12,-158" stroke="#2a1810" strokeWidth="2.2" fill="none"/>
    <path d="M-34,-190 L34,-190 L18,-228 L-18,-228 Z" fill="#8a6a3a" stroke="#4a3520" strokeWidth="1.3"/><ellipse cx="0" cy="-190" rx="44" ry="8" fill="#a07e48" stroke="#4a3520" strokeWidth="1.3"/>
  </g>
);


/** the monsoon front arriving: soft, billowing masses of slate cloud with a dark ragged base, built from blurred ellipses (no hard edges) */
const MonsoonClouds: React.FC<{f: number; arrive: number; camX: number; yH: number}> = ({f, arrive, camX, yH}) => {
  const data = useMemo(() => {
    const r = rng(311), hi = Array.from({length: 26}).map(() => ({x: r() * 2500 - 300, y: -30 + r() * 250, rx: 150 + r() * 210, ry: 54 + r() * 70, v: 0.05 + r() * 0.12, d: r()}));
    const mid = Array.from({length: 22}).map(() => ({x: r() * 2500 - 300, y: 110 + r() * 200, rx: 130 + r() * 170, ry: 48 + r() * 56, v: 0.08 + r() * 0.14, d: r()}));
    const low = Array.from({length: 26}).map(() => ({x: r() * 2500 - 300, y: 230 + r() * 120, rx: 120 + r() * 170, ry: 36 + r() * 38, v: 0.1 + r() * 0.16, d: r()}));
    return {hi, mid, low};
  }, []);
  const g = (d: number) => eo(clamp(arrive * 1.5 - d * 0.5));
  const px = (c: {x: number; v: number}, k: number) => ((c.x + f * c.v + arrive * 160 * (1 - k) + 300) % 2500) - 300 - camX * 0.05;
  return (
    <g>
      <g filter="url(#fl-b22)" opacity="0.95">{data.hi.map((c, i) => <ellipse key={i} cx={px(c, 0)} cy={c.y} rx={c.rx * (0.5 + 0.5 * g(c.d))} ry={c.ry * (0.4 + 0.6 * g(c.d))} fill={i % 3 ? "#5d7088" : "#4e6079"} opacity={0.35 + 0.65 * g(c.d)}/>)}</g>
      <g filter="url(#fl-b14)">{data.mid.map((c, i) => <ellipse key={i} cx={px(c, 0.3)} cy={c.y + 10} rx={c.rx * (0.5 + 0.5 * g(c.d))} ry={c.ry * (0.4 + 0.6 * g(c.d))} fill="#7d90a8" opacity={0.3 + 0.6 * g(c.d)}/>)}</g>
      <g filter="url(#fl-b14)">{data.mid.map((c, i) => <ellipse key={i} cx={px(c, 0.3) - c.rx * 0.12} cy={c.y - c.ry * 0.32} rx={c.rx * 0.7 * (0.5 + 0.5 * g(c.d))} ry={c.ry * 0.5 * (0.4 + 0.6 * g(c.d))} fill="#c4d0dc" opacity={(0.25 + 0.5 * g(c.d)) * (1 - 0.4 * arrive)}/>)}</g>
      <g filter="url(#fl-b14)">{data.low.map((c, i) => <ellipse key={i} cx={px(c, 0.6)} cy={yH - 230 + c.y * 0.5} rx={c.rx * (0.5 + 0.5 * g(c.d))} ry={c.ry * (0.5 + 0.5 * g(c.d))} fill={i % 2 ? "#3f4e62" : "#4a5a70"} opacity={0.3 + 0.65 * g(c.d)}/>)}</g>
      <g filter="url(#fl-b6)">{data.low.map((c, i) => <ellipse key={i} cx={px(c, 0.6) - c.rx * 0.1} cy={yH - 230 + c.y * 0.5 - c.ry * 0.45} rx={c.rx * 0.6 * (0.5 + 0.5 * g(c.d))} ry={c.ry * 0.34} fill="#aebccb" opacity={0.22 + 0.3 * g(c.d)}/>)}</g>
    </g>
  );
};

export const FieldSet: React.FC<{f: number; dur: number; camX: number; sky?: "clouds"}> = ({f, dur, camX, sky}) => {
  const wet = sky === "clouds";
  const P = (p: number) => `translate(${-camX * p} 0)`;
  const arrive = wet ? eo(prog(f, 0, Math.max(60, dur * 0.7))) : 0;
  const vx = 960 - camX * 0.35, yH = FIELD_HORIZON;
  const furrows = useMemo(() => Array.from({length: 150}).map((_, i) => i - 75), []);
  const cracks = useMemo(() => { const r = rng(5); return Array.from({length: 26}).map(() => { const x0 = r() * 2100 - 100, y0 = 780 + r() * 300, pts: string[] = [`${x0},${y0}`]; let x = x0, y = y0; for (let k = 0; k < 5; k++) { x += (r() - 0.45) * 70; y += (r() - 0.3) * 30; pts.push(`${x.toFixed(0)},${y.toFixed(0)}`); } return {d: "M" + pts.join(" L"), w: 0.8 + (y0 - 780) / 300 * 1.6}; }); }, []);
  const stalks = useMemo(() => { const r = rng(14); return Array.from({length: 46}).map(() => ({x: r() * 2200 - 140, y: 600 + r() * 480, h: 8 + r() * 26, ph: r() * 6.28})); }, []);
  const sprouts = useMemo(() => { const r = rng(33); return Array.from({length: 150}).map(() => { const y = 570 + r() * 330; return {x: r() * 2200 - 140, y, s: 0.35 + (y - 560) / 340 * 1.2, ph: r() * 6.28}; }); }, []);
  const motes = useMemo(() => { const r = rng(77); return Array.from({length: 46}).map(() => ({x: r() * 2200, y: 380 + r() * 600, v: 0.4 + r() * 0.9, s: 0.8 + r() * 1.9, ph: r() * 6.28})); }, []);
  const puddles: [number, number, number][] = [[360, 960, 200], [920, 1020, 260], [1580, 900, 170], [640, 780, 110], [1280, 740, 90]];
  const sunx = 1500 - camX * 0.05;
  const dryTop = ["#3d8ad4", "#7ebbe8", "#dcebec"], wetTop = ["#52698a", "#8397ae", "#c2cdd2"];
  const skyC = wet ? wetTop : dryTop;
  return (
    <g>
      <defs>
        <linearGradient id="fl-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={skyC[0]}/><stop offset="0.62" stopColor={skyC[1]}/><stop offset="1" stopColor={skyC[2]}/></linearGradient>
        <radialGradient id="fl-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffffff"/><stop offset="0.1" stopColor="#fffbe0"/><stop offset="0.4" stopColor="#fff0b0" stopOpacity="0.45"/><stop offset="1" stopColor="#fff0b0" stopOpacity="0"/></radialGradient>
        <radialGradient id="fl-gap" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff2c8" stopOpacity="0.85"/><stop offset="1" stopColor="#fff2c8" stopOpacity="0"/></radialGradient>
        <linearGradient id="fl-haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={wet ? "#c9d4d6" : "#f6ecd0"} stopOpacity="0"/><stop offset="0.35" stopColor={wet ? "#c9d4d6" : "#f6ecd0"} stopOpacity="0.8"/><stop offset="1" stopColor={wet ? "#c9d4d6" : "#f6ecd0"} stopOpacity="0"/></linearGradient>
        <linearGradient id="fl-far" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={wet ? "#a9b8b2" : "#d6cfae"}/><stop offset="1" stopColor={wet ? "#8ea48c" : "#c9bb8a"}/></linearGradient>
        <linearGradient id="fl-depth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={wet ? "#b8c6c8" : "#f6e9c6"} stopOpacity="0.85"/><stop offset="0.4" stopColor={wet ? "#b8c6c8" : "#f6e9c6"} stopOpacity="0.25"/><stop offset="1" stopColor={wet ? "#b8c6c8" : "#f6e9c6"} stopOpacity="0"/></linearGradient>
        <linearGradient id="fl-pud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cfdde6"/><stop offset="1" stopColor="#7f98ab"/></linearGradient>
        <filter id="fl-b22" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="22"/></filter>
        <filter id="fl-b6" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="6"/></filter>
        <filter id="fl-b14" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
        <filter id="fl-b3" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>

      {/* ---- sky ---- */}
      <rect x={-100} y={-100} width={W + 200} height={yH + 140} fill="url(#fl-sky)"/>
      {!wet && <>
        <circle cx={sunx} cy={110} r={560} fill="url(#fl-sun)"/><circle cx={sunx} cy={110} r={46} fill="#fffef4"/>
        {[[300, 130, 1.6], [980, 70, 1.1], [1700, 240, 1]].map(([x, y, s], i) => <g key={i} opacity="0.5" transform={`translate(${((x + f * 0.16 + i * 90) % 2400) - 220} ${y}) scale(${s})`} filter="url(#fl-b6)">
          <ellipse cx="0" cy="0" rx="150" ry="9" fill="#fff"/><ellipse cx="50" cy="12" rx="110" ry="6" fill="#fff"/></g>)}
      </>}
      {wet && <>
        <ellipse cx={380 - camX * 0.05} cy={yH - 60} rx={640} ry={190} fill="url(#fl-gap)" opacity={0.85 - 0.45 * arrive}/>
        <MonsoonClouds f={f} arrive={arrive} camX={camX} yH={yH}/>
        {/* a rain veil hanging far off in the west */}
        <g opacity={0.5 * arrive} filter="url(#fl-b3)">
          {Array.from({length: 26}).map((_, i) => <path key={i} d={`M${60 + i * 24 - camX * 0.05 + ((f * 0.4 + i * 9) % 18)},${yH - 150 + (i % 4) * 12} l-26,170`} stroke="#d8e2e8" strokeWidth={2 + (i % 3)} strokeLinecap="round" opacity={0.35 + (i % 5) * 0.1}/>)}
        </g>
      </>}

      {/* ---- far plain: haze, village, palms, tree line ---- */}
      <g transform={P(0.08)}>
        <rect x={-100} y={yH - 18} width={W + 200} height={90} fill="url(#fl-far)"/>
        <path d={`M-100,${yH - 12} ${Array.from({length: 44}).map((_, i) => `L${-100 + i * 48},${yH - 14 - 10 * Math.sin(i * 1.7) - 6 * Math.sin(i * 0.5)}`).join(" ")} L2100,${yH + 40} L-100,${yH + 40} Z`} fill={wet ? "#8ea48f" : "#b9b78f"} opacity="0.8"/>
      </g>
      <g transform={P(0.12)} opacity={wet ? 0.8 : 0.85}>
        <Hut x={1330} y={yH + 8} s={0.55} roof="#b25a3a"/><Hut x={1400} y={yH + 10} s={0.45} roof="#a8502f"/><Hut x={1250} y={yH + 6} s={0.4} roof="#b65f3d"/>
        <g transform={`translate(1560 ${yH + 8})`}><path d="M-22,0 L-22,-50 L-14,-80 L0,-110 L14,-80 L22,-50 L22,0 Z" fill="#e5d6b4" stroke="#a79672"/><path d="M0,-110 v-16" stroke="#8a6a3a" strokeWidth="3"/><path d="M-22,-50 H22 M-18,-26 H18" stroke="#c4b28a" strokeWidth="2"/></g>
        <Palmyra x={1180} y={yH + 6} s={0.46} f={f} seed={1}/><Palmyra x={1470} y={yH + 6} s={0.5} f={f} seed={2}/><Palmyra x={720} y={yH + 6} s={0.42} f={f} seed={3}/>
      </g>
      <g transform={P(0.18)}>{[80, 330, 600, 880, 1090, 1700, 1900].map((x, i) => <Tree key={i} x={x} y={yH + 18} s={0.34 + (i % 3) * 0.06} seed={90 + i} f={f} wet={wet} far/>)}</g>

      {/* ---- the field bund (a low earth ridge) with a thorn hedge, and the big neem ---- */}
      <g transform={P(0.45)}>
        <path d={`M-100,610 ${Array.from({length: 46}).map((_, i) => `L${-100 + i * 46},${598 + 8 * Math.sin(i * 0.8) + 4 * Math.sin(i * 2.1)}`).join(" ")} L2100,660 L-100,660 Z`} fill={wet ? "#6d5a38" : "#b99a62"} stroke={wet ? "#3e3220" : "#8a7142"} strokeWidth="1.3"/>
        <path d={`M-100,606 ${Array.from({length: 46}).map((_, i) => `L${-100 + i * 46},${596 + 8 * Math.sin(i * 0.8) + 4 * Math.sin(i * 2.1)}`).join(" ")}`} fill="none" stroke={wet ? "#a39066" : "#f1dca0"} strokeWidth="3" opacity="0.7"/>
        {Array.from({length: 70}).map((_, i) => { const x = -80 + i * 31 + (i % 3) * 5, h = 14 + (i * 7 % 22); return <path key={i} d={`M${x},610 q${(i % 2 ? 5 : -5) + Math.sin(f / 40 + i) * 2},${-h * 0.6} ${(i % 2 ? 9 : -9)},${-h}`} stroke={wet ? "#5a8a40" : "#a09a58"} strokeWidth="2.2" fill="none" strokeLinecap="round"/>; })}
        <Tree x={330} y={632} s={1.5} seed={3} f={f} wet={wet}/>
        <Tree x={1740} y={622} s={0.95} seed={8} f={f} wet={wet}/>
        <Scarecrow x={1560} y={684} s={0.88} f={f}/>
      </g>

      {/* ---- the ploughed field in perspective ---- */}
      <g>
        <rect x={-100} y={yH - 4} width={W + 200} height={700} fill={wet ? "#5f452e" : "#cdac74"}/>
        {furrows.map((i) => {
          const t0 = (a: number): [number, number, number, number] => [vx + a * 2.4, yH + 2, vx + a * 190, 1130];
          const [ax, ay, bx, by] = t0(i), [cx, cy, dx, dy] = t0(i + 1);
          return <polygon key={i} points={`${ax},${ay} ${cx},${cy} ${dx},${dy} ${bx},${by}`} fill={i % 2 ? (wet ? "#7c5a3a" : "#dbb980") : (wet ? "#523a26" : "#c2a068")}/>;
        })}
        {furrows.map((i) => { const x1 = vx + i * 2.4, x2 = vx + i * 190; return <g key={`l${i}`}>
          <path d={`M${x1 + 0.6},${yH + 2} L${x2 + 8},1130`} stroke={wet ? "#c4a47c" : "#fff0c4"} strokeWidth="2.2" opacity={wet ? 0.28 : 0.34}/>
          <path d={`M${x1 - 0.3},${yH + 2} L${x2 - 6},1130`} stroke={wet ? "#2a1c10" : "#8c6a3a"} strokeWidth="2.6" opacity={wet ? 0.5 : 0.28}/></g>; })}
        {/* soil texture */}
        {stalks.map((s, i) => !wet && <g key={i} transform={`translate(${s.x} ${s.y})`} opacity="0.85">{[-5, 0, 5].map((o, k) => <path key={k} d={`M${o},0 q${o * 0.4 + Math.sin(f / 36 + s.ph) * 1.4},${-s.h * 0.6} ${o * 1.4},${-s.h}`} stroke="#a08a50" strokeWidth="2" fill="none" strokeLinecap="round"/>)}</g>)}
        {!wet && cracks.map((c, i) => <path key={i} d={c.d} stroke="#6f5430" strokeWidth={c.w} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.55"/>)}
        {wet && sprouts.map((s, i) => <g key={i} transform={`translate(${s.x} ${s.y}) scale(${s.s})`} opacity={clamp(arrive * 1.6 - (i % 5) * 0.12)}><path d="M0,0 q-6,-10 -10,-14 M0,0 q2,-12 0,-20 M0,0 q6,-10 11,-12" stroke="#5fa04a" strokeWidth="3" strokeLinecap="round" fill="none"/></g>)}
        <rect x={-100} y={yH - 6} width={W + 200} height={470} fill="url(#fl-depth)"/>
        {/* puddles that hold the sky */}
        {wet && puddles.map(([x, y, w], i) => { const k = clamp(arrive * 1.5 - i * 0.08);
          return <g key={i} opacity={k}><ellipse cx={x} cy={y} rx={w} ry={w * 0.12} fill="url(#fl-pud)" stroke="#5a463a" strokeWidth="1.4"/><ellipse cx={x - w * 0.2} cy={y - 3} rx={w * 0.55} ry={w * 0.04} fill="#f5fafc" opacity="0.55"/><ellipse cx={x} cy={y + 2} rx={w * 0.95} ry={w * 0.09} fill="none" stroke="#e8f2f6" strokeWidth="1.2" opacity="0.5"/></g>; })}
      </g>

      {/* ---- foreground: a seed sack, a spade, a mud pot ---- */}
      <g transform={P(0.95)}>
        <g transform="translate(300 930)">
          <ellipse cx="14" cy="8" rx="110" ry="14" fill="#2e2418" opacity="0.32" filter="url(#fl-b6)"/>
          <path d="M-66,6 C-80,-30 -72,-74 -50,-96 C-36,-106 40,-106 56,-92 C80,-70 82,-24 66,6 Z" fill="#cdb98a" stroke="#7d6a40" strokeWidth="1.6"/>
          <path d="M-46,-96 C-30,-84 40,-84 52,-92" stroke="#7d6a40" strokeWidth="1.6" fill="none"/>
          {[-52, -30, -8, 14, 36].map((x, i) => <path key={i} d={`M${x},-90 q${3 - (i % 2) * 6},40 ${(i - 2) * 3},92`} stroke="#a89466" strokeWidth="1.2" fill="none" opacity="0.7"/>)}
          <path d="M-40,-96 C-30,-110 -10,-116 6,-108 C20,-116 40,-108 46,-94" stroke="#a89466" strokeWidth="3.4" fill="none" strokeLinecap="round"/>
          <path d="M-52,-34 C-40,-44 -20,-44 -8,-36" stroke="#b83d22" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.8"/>
          {Array.from({length: 9}).map((_, i) => <ellipse key={i} cx={-96 + (i % 5) * 16 - (i > 4 ? 6 : 0)} cy={4 + (i % 3) * 3 + (i > 4 ? 8 : 0)} rx="3" ry="1.9" fill="#d7a64a" stroke="#8a5f1c" strokeWidth="0.6"/>)}
        </g>
        <g transform="translate(470 932)">
          <ellipse cx="6" cy="6" rx="64" ry="10" fill="#2e2418" opacity="0.32" filter="url(#fl-b6)"/>
          <path d="M-8,4 L2,-230" stroke="#6e5438" strokeWidth="9" strokeLinecap="round"/><path d="M-8,4 L2,-230" stroke="#a88660" strokeWidth="3" strokeLinecap="round" transform="translate(-2 0)" opacity="0.7"/>
          <path d="M-22,-224 L28,-224 L24,-198 L-18,-198 Z" fill="#8a8e92" stroke="#4d5054" strokeWidth="1.4"/>
          <path d="M-12,-214 L22,-214" stroke="#d3d8dc" strokeWidth="2" opacity="0.8"/>
        </g>
        <g transform="translate(1720 950)">
          <ellipse cx="4" cy="6" rx="78" ry="11" fill="#2e2418" opacity="0.3" filter="url(#fl-b6)"/>
          <path d="M-52,-4 C-76,-50 -50,-120 -14,-134 L-8,-150 L26,-150 L30,-134 C66,-118 78,-52 54,-4 C30,10 -26,10 -52,-4 Z" fill="#c25a35" stroke="#7a2e18" strokeWidth="1.8"/>
          <path d="M-46,-62 C-18,-52 22,-52 58,-62" stroke="#7a2e18" strokeWidth="2" fill="none" opacity="0.7"/><path d="M-60,-86 C-24,-70 28,-70 70,-86" stroke="#7a2e18" strokeWidth="2" fill="none" opacity="0.7"/>
          <path d="M-40,-100 C-52,-70 -44,-40 -34,-20" stroke="#f2a47c" strokeWidth="4" fill="none" opacity="0.6"/>
          <ellipse cx="9" cy="-150" rx="21" ry="6" fill="#3d1d10"/>
        </g>
      </g>

      {/* dry: heat shimmer and dust; wet: a cool wind of leaf and water haze */}
      {!wet && <g opacity="0.55">{Array.from({length: 4}).map((_, i) => { const y = yH + 4 + i * 18; let d = `M-100,${y}`; for (let x = -100; x <= 2020; x += 80) d += ` Q${x + 20},${y - 6 * Math.sin(f / 12 + x / 110 + i)} ${x + 40},${y} T${x + 80},${y}`; return <path key={i} d={d} stroke="#fff8e0" strokeWidth="3" fill="none" opacity={0.5 - i * 0.09}/>; })}</g>}
      {motes.map((m, i) => <circle key={i} cx={((m.x + f * m.v * (wet ? 1.1 : 0.7)) % 2300) - 160} cy={m.y + Math.sin(f / 34 + m.ph) * 12} r={m.s} fill={wet ? "#f2f6f8" : "#fff3cf"} opacity={wet ? 0.28 : 0.4}/>)}
      {wet && <rect x={-100} y={-100} width={W + 200} height={H + 200} fill="#3c4a5c" opacity={0.2 * arrive} style={{mixBlendMode: "multiply"}}/>}
      <rect x={-100} y={yH - 6} width={W + 200} height={60} fill="url(#fl-haze)" opacity={wet ? 0.3 : 0.38}/>
      {void lerp}{void H}
    </g>
  );
};
