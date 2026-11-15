// Look B sets for the stage scene (part 1): void (a warm studio backdrop), home (a study with a window and shelves), street (shopfronts in a storm).
// Art coordinates are the 1920 x 1080 frame and bleed past it. The floor line of each set is exported in SET_FLOOR.
import React, {useMemo} from "react";
import {W, H, clamp, rng} from "../kit";

export const SET_FLOOR = {void: 740, home: 720, street: 712, beach: 650, himalaya: 806, rooftop: 716} as const;

const Floorlines: React.FC<{y0: number; c: string; op?: number; vanish?: number}> = ({y0, c, op = 0.3, vanish = 960}) => {
  const out: React.ReactNode[] = [];
  for (let i = 0; i <= 9; i++) { const y = y0 + (1080 - y0) * (1 - 1 / (1 + i * 0.42)); out.push(<path key={`h${i}`} d={`M-100,${y} H2020`} stroke={c} strokeWidth={0.8 + i * 0.15} opacity={op}/>); }
  for (let i = -14; i <= 22; i++) { const x1080 = vanish + (i - 4) * 230, xTop = vanish + (x1080 - vanish) * (290 / 650); out.push(<path key={`v${i}`} d={`M${xTop},${y0} L${x1080},1080`} stroke={c} strokeWidth="1" opacity={op * 0.85}/>); }
  return <g>{out}</g>;
};

// ---------------------------------------------------------------------------------------------------------------------------------
// void: contour lines and soft light on warm paper, for ideas with no place
export const VoidSet: React.FC<{f: number; camX: number}> = ({f, camX}) => {
  const motes = useMemo(() => { const r = rng(21); return Array.from({length: 46}).map(() => ({x: r() * 2200, y: r() * 1100, s: 0.5 + r() * 1.5, v: 0.2 + r() * 0.5, o: 0.2 + r() * 0.4})); }, []);
  return (
    <g>
      <defs>
        <radialGradient id="vo-bg" cx="0.62" cy="0.38" r="0.95"><stop offset="0" stopColor="#fff6e1"/><stop offset="0.55" stopColor="#f0e0bf"/><stop offset="1" stopColor="#d9c39b"/></radialGradient>
        <linearGradient id="vo-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e9d6ae"/><stop offset="1" stopColor="#c9ae80"/></linearGradient>
        <filter id="vo-b" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
      </defs>
      <rect x={-100} y={-100} width={W + 200} height={H + 200} fill="url(#vo-bg)"/>
      <g transform={`translate(${-camX * 0.4} 0)`} opacity="0.9">
        {Array.from({length: 14}).map((_, i) => { const r = 150 + i * 118, rot = f * (0.04 + i * 0.004) * (i % 2 ? 1 : -1);
          return <circle key={i} cx={1500} cy={330} r={r} fill="none" stroke={i % 3 === 0 ? "#b98a52" : "#c9a97a"} strokeWidth={i % 3 === 0 ? 1.6 : 1} strokeDasharray={i % 2 ? "2 9" : "none"} opacity={0.28 - i * 0.012} transform={`rotate(${rot} 1500 330)`}/>; })}
        <circle cx="1500" cy="330" r="7" fill="#c0492f" opacity="0.5"/>
      </g>
      {/* a big soft sun disc with a dial of tick marks, and drifting outline glyphs (clouds, drops): ideas in the air */}
      <g transform={`translate(${-camX * 0.6} 0)`}>
        <circle cx="1500" cy="330" r="210" fill="#f6d9a0" opacity="0.42"/><circle cx="1500" cy="330" r="150" fill="#f3c47a" opacity="0.4"/>
        {Array.from({length: 72}).map((_, i) => { const a = (i / 72) * Math.PI * 2 + f * 0.004, r0 = 236, r1 = i % 6 === 0 ? 270 : 252; return <path key={i} d={`M${1500 + Math.cos(a) * r0},${330 + Math.sin(a) * r0} L${1500 + Math.cos(a) * r1},${330 + Math.sin(a) * r1}`} stroke="#b98a52" strokeWidth={i % 6 === 0 ? 2.2 : 1.2} opacity="0.5"/>; })}
        {[[260, 300, 1], [640, 190, 0.7], [1010, 420, 0.8], [330, 560, 0.6]].map(([x, y, sc], i) => { const dy = Math.sin(f / 50 + i * 2) * 12, dx = ((f * (0.3 + i * 0.07)) % 40); return (
          <g key={i} transform={`translate(${x + dx} ${y + dy}) scale(${sc})`} opacity="0.5" fill="none" stroke="#9a6a38" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            {i % 2 === 0 ? <path d="M-60,20 Q-80,20 -78,0 Q-76,-22 -48,-18 Q-44,-52 -4,-50 Q34,-50 40,-16 Q74,-18 74,8 Q74,22 54,20 Z"/> : <path d="M0,-40 Q-24,0 -22,16 Q-20,36 0,36 Q20,36 22,16 Q24,0 0,-40 Z"/>}
          </g>); })}
      </g>
      <polygon points="300,-100 700,-100 1500,900 900,900" fill="#fff6d8" opacity="0.28" filter="url(#vo-b)"/>
      <rect x={-100} y={SET_FLOOR.void} width={W + 200} height={H - SET_FLOOR.void + 120} fill="url(#vo-floor)"/>
      <Floorlines y0={SET_FLOOR.void} c="#9d7a4a" op={0.18}/>
      <rect x={-100} y={SET_FLOOR.void - 40} width={W + 200} height={90} fill="#fff1cf" opacity="0.32" filter="url(#vo-b)"/>
      <ellipse cx="960" cy="980" rx="720" ry="120" fill="#fff4d2" opacity="0.28" filter="url(#vo-b)"/>
      {motes.map((m, i) => <circle key={i} cx={((m.x + f * m.v) % 2200) - 140} cy={m.y + 14 * Math.sin(f / 40 + i)} r={m.s} fill="#fffbe8" opacity={m.o}/>)}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------------------------
// home: a study at the end of a grey monsoon afternoon, window light, books
const Spines: React.FC<{x: number; y: number; w: number; seed: number}> = ({x, y, w, seed}) => {
  const bs = useMemo(() => { const r = rng(seed); const out: {dx: number; w: number; h: number; c: string; tilt: number}[] = []; let dx = 0; const cols = ["#b5543a", "#2f7d86", "#d9a43a", "#4a5f8a", "#7a8a4a", "#8a4a62", "#d8c9a8", "#37566b"];
    while (dx < w - 20) { const bw = 16 + r() * 20; out.push({dx, w: bw, h: 58 + r() * 34, c: cols[Math.floor(r() * cols.length)], tilt: r() < 0.08 ? 6 : 0}); dx += bw + 1; } return out; }, [seed, w]);
  return <g transform={`translate(${x} ${y})`}>{bs.map((b, i) => (
    <g key={i} transform={`translate(${b.dx} 0) rotate(${b.tilt} 0 0)`}>
      <rect x="0" y={-b.h} width={b.w} height={b.h} fill={b.c} stroke="#00000030" strokeWidth="1"/><rect x="0" y={-b.h} width={b.w * 0.3} height={b.h} fill="#fff" opacity="0.14"/>
      <rect x="0" y={-b.h + 8} width={b.w} height="4" fill="#f2e3b8" opacity="0.7"/><rect x="0" y={-14} width={b.w} height="3" fill="#f2e3b8" opacity="0.5"/>
    </g>))}</g>;
};
export const HomeSet: React.FC<{f: number; camX: number}> = ({f, camX}) => {
  const lampFlick = 0.92 + 0.08 * Math.sin(f / 7) * Math.sin(f / 23);
  const trees = useMemo(() => { const r = rng(5); return Array.from({length: 18}).map(() => ({x: 150 + r() * 380, y: 360 + r() * 90, r: 30 + r() * 40, c: r()})); }, []);
  const P = (p: number) => `translate(${-camX * p} 0)`;
  return (
    <g>
      <defs>
        <linearGradient id="ho-wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f3e0bf"/><stop offset="0.6" stopColor="#e8cfa4"/><stop offset="1" stopColor="#d6b98a"/></linearGradient>
        <linearGradient id="ho-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b98657"/><stop offset="1" stopColor="#9a6a42"/></linearGradient>
        <linearGradient id="ho-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c99a68"/><stop offset="1" stopColor="#8e6240"/></linearGradient>
        <linearGradient id="ho-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8d9eac"/><stop offset="0.7" stopColor="#c4ced0"/><stop offset="1" stopColor="#a9c0a0"/></linearGradient>
        <linearGradient id="ho-curt" x1="0" x2="1"><stop offset="0" stopColor="#3d8f93"/><stop offset="0.5" stopColor="#2a6e75"/><stop offset="1" stopColor="#235a63"/></linearGradient>
        <radialGradient id="ho-lamp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffe3a0" stopOpacity="0.75"/><stop offset="1" stopColor="#ffe3a0" stopOpacity="0"/></radialGradient>
        <filter id="ho-b" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
        <filter id="ho-b3" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
        <pattern id="ho-stripe" width="70" height="40" patternUnits="userSpaceOnUse"><rect width="70" height="40" fill="none"/><rect x="0" width="26" height="40" fill="#fff" opacity="0.1"/><circle cx="48" cy="20" r="2.2" fill="#a67c4a" opacity="0.25"/></pattern>
      </defs>
      <rect x={-100} y={-100} width={W + 200} height={760} fill="url(#ho-wall)"/>
      <rect x={-100} y={-100} width={W + 200} height={760} fill="url(#ho-stripe)"/>
      {/* wainscot */}
      <rect x={-100} y={520} width={W + 200} height={206} fill="url(#ho-wood)"/>
      {Array.from({length: 11}).map((_, i) => <rect key={i} x={i * 190 - 60} y={548} width={150} height={140} rx="5" fill="none" stroke="#6d4528" strokeWidth="2.2" opacity="0.55"/>)}
      {Array.from({length: 11}).map((_, i) => <rect key={`i${i}`} x={i * 190 - 52} y={556} width={134} height={124} rx="3" fill="#fff" opacity="0.05"/>)}
      <rect x={-100} y={508} width={W + 200} height={18} fill="#e9d6ae" stroke="#8a6a44" strokeWidth="1.5"/><rect x={-100} y={508} width={W + 200} height={4} fill="#fff9e8" opacity="0.8"/>
      <rect x={-100} y={706} width={W + 200} height={22} fill="#d9c39a" stroke="#8a6a44" strokeWidth="1.5"/>
      {/* window */}
      <g transform={P(0.3)}>
        <rect x="126" y="96" width="400" height="430" fill="#efe2c4" stroke="#8a6a44" strokeWidth="3"/>
        <clipPath id="ho-glass"><rect x="148" y="118" width="356" height="372"/></clipPath>
        <g clipPath="url(#ho-glass)">
          <rect x="148" y="118" width="356" height="372" fill="url(#ho-sky)"/>
          {trees.map((t, i) => <circle key={i} cx={t.x + 10 * Math.sin(f / 50 + i)} cy={t.y} r={t.r} fill={t.c < 0.5 ? "#5f8a52" : "#4a7544"} opacity="0.8"/>)}
          <rect x="148" y="440" width="356" height="60" fill="#8fa78a" opacity="0.6"/>
          {Array.from({length: 20}).map((_, i) => { const x = 150 + ((i * 53 + f * 3) % 360), y = 118 + ((i * 97 + f * 18) % 380); return <path key={i} d={`M${x},${y} l-5,24`} stroke="#fff" strokeWidth="1.2" opacity="0.45"/>; })}
          <ellipse cx="360" cy="200" rx="190" ry="60" fill="#eef2f4" opacity="0.4" filter="url(#ho-b3)"/>
        </g>
        <path d="M326,118 V490 M148,304 H504" stroke="#efe2c4" strokeWidth="8"/><path d="M326,118 V490 M148,304 H504" stroke="#8a6a44" strokeWidth="1.2"/>
        <rect x="112" y="522" width="428" height="20" fill="#e9d6ae" stroke="#8a6a44" strokeWidth="2"/>
        <path d="M60,70 H196 C206,200 196,360 214,500 H100 C70,380 60,200 60,70 Z" fill="url(#ho-curt)" stroke="#173f46" strokeWidth="1.5"/>
        <path d="M560,70 H452 C440,200 452,360 438,500 H546 C576,380 566,200 560,70 Z" fill="url(#ho-curt)" stroke="#173f46" strokeWidth="1.5"/>
        {[0, 1, 2, 3].map((i) => <g key={i}><path d={`M${90 + i * 30},80 C${84 + i * 30},240 ${96 + i * 30},380 ${86 + i * 30},490`} stroke="#14383e" strokeWidth="2" fill="none" opacity="0.4"/><path d={`M${470 + i * 24},80 C${464 + i * 24},240 ${478 + i * 24},380 ${470 + i * 24},490`} stroke="#14383e" strokeWidth="2" fill="none" opacity="0.4"/></g>)}
        <rect x="40" y="62" width="540" height="12" rx="6" fill="#6d4528" stroke="#3a2412"/>
      </g>
      {/* bookshelf */}
      <g transform={P(0.55)}>
        <rect x="1020" y="150" width="330" height="560" fill="#a9754a" stroke="#5a3a20" strokeWidth="2.4"/>
        <rect x="1038" y="168" width="294" height="526" fill="#6d4528"/>
        {[0, 1, 2, 3].map((i) => <g key={i}><Spines x={1040} y={290 + i * 130} w={290} seed={30 + i}/><rect x="1032" y={292 + i * 130} width="306" height="12" fill="#c28f5e" stroke="#5a3a20"/></g>)}
        <rect x="1034" y="168" width="296" height="526" fill="url(#ho-wall)" opacity="0.08"/>
      </g>
      {/* desk and lamp at far right */}
      <g transform={P(0.7)}>
        <rect x="1560" y="596" width="400" height="34" fill="#a9754a" stroke="#5a3a20" strokeWidth="2"/><rect x="1580" y="630" width="26" height="92" fill="#8a5a36" stroke="#5a3a20"/><rect x="1900" y="630" width="26" height="92" fill="#8a5a36" stroke="#5a3a20"/>
        <circle cx="1680" cy="470" r="170" fill="url(#ho-lamp)" opacity={lampFlick}/>
        <path d="M1670,596 v-90 l26,-50" stroke="#2f3a40" strokeWidth="7" fill="none" strokeLinecap="round"/><path d="M1660,596 h40" stroke="#2f3a40" strokeWidth="10" strokeLinecap="round"/>
        <path d="M1676,458 L1740,430 L1744,478 L1698,490 Z" fill="#e0a43a" stroke="#7a5212" strokeWidth="1.6"/><ellipse cx="1712" cy="480" rx="26" ry="6" fill="#ffe9a8" opacity={lampFlick}/>
        <rect x="1790" y="548" width="110" height="48" fill="#37566b" stroke="#1d2f3b"/><rect x="1796" y="540" width="98" height="12" fill="#d8c9a8" stroke="#8a7a58"/>
        <path d="M1872,596 q8,-26 22,-30 q4,-22 -10,-30" stroke="#4f8a4b" strokeWidth="6" fill="none"/>
      </g>
      {/* picture frames */}
      <g transform={P(0.4)}>
        <rect x="640" y="190" width="190" height="136" fill="#f6ecd2" stroke="#6d4528" strokeWidth="6"/><rect x="654" y="204" width="162" height="108" fill="#bcd5de"/>
        <path d="M654,290 L700,244 L736,276 L770,236 L816,290 V312 H654 Z" fill="#6f8f8b"/><circle cx="780" cy="232" r="14" fill="#f4d58a"/>
        <rect x="860" y="238" width="112" height="152" fill="#f6ecd2" stroke="#6d4528" strokeWidth="5"/><circle cx="916" cy="300" r="34" fill="none" stroke="#b5543a" strokeWidth="5"/><path d="M890,340 q26,-60 52,0" stroke="#2f7d86" strokeWidth="5" fill="none"/>
      </g>
      {/* floor */}
      <rect x={-100} y={720} width={W + 200} height={400} fill="url(#ho-floor)"/>
      <Floorlines y0={720} c="#4e3220" op={0.3}/>
      {/* rug */}
      <g>
        <ellipse cx="760" cy="920" rx="640" ry="132" fill="#2a1a10" opacity="0.25" filter="url(#ho-b3)"/>
        <ellipse cx="760" cy="912" rx="620" ry="124" fill="#b5503a" stroke="#6f2a1c" strokeWidth="3"/>
        <ellipse cx="760" cy="912" rx="560" ry="108" fill="none" stroke="#f1d9a6" strokeWidth="5"/>
        <ellipse cx="760" cy="912" rx="480" ry="90" fill="#d9a45a" opacity="0.5"/>
        <ellipse cx="760" cy="912" rx="410" ry="76" fill="none" stroke="#7a2a1c" strokeWidth="2" strokeDasharray="12 10"/>
        <ellipse cx="760" cy="912" rx="260" ry="48" fill="#2f7d86" opacity="0.55"/>
        {Array.from({length: 18}).map((_, i) => { const a = (i / 18) * Math.PI * 2; return <circle key={i} cx={760 + Math.cos(a) * 520} cy={912 + Math.sin(a) * 100} r="6" fill="#f1d9a6" opacity="0.85"/>; })}
      </g>
      {/* window light on floor */}
      <polygon points="190,722 520,722 940,1010 300,1010" fill="#dce8ee" opacity="0.2" filter="url(#ho-b)"/>
      <ellipse cx="1680" cy="760" rx="260" ry="70" fill="#ffe3a0" opacity={0.2 * lampFlick} filter="url(#ho-b)"/>
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------------------------
// street: shopfronts, a wet road, poles and a tree bending in the wind
const Shop: React.FC<{x: number; w: number; h: number; c: string; awn: string; seed: number; base: number}> = ({x, w, h, c, awn, seed, base}) => {
  const r = rng(seed);
  return (
    <g>
      <rect x={x} y={base - h} width={w} height={h} fill={c} stroke="#00000033" strokeWidth="1.4"/>
      <rect x={x - 4} y={base - h - 12} width={w + 8} height="12" fill="#e9dcc2" stroke="#8a7a58"/>
      {Array.from({length: Math.floor((h - 150) / 80)}).map((_, row) => Array.from({length: Math.max(1, Math.floor(w / 80))}).map((_, col) => {
        const wx = x + 22 + col * 80, wy = base - h + 24 + row * 80, lit = r() > 0.45;
        return <g key={`${row}-${col}`}><rect x={wx} y={wy} width="40" height="50" fill={lit ? "#f4cf84" : "#6f8aa0"} stroke="#4a3d30" strokeWidth="1.5"/><path d={`M${wx + 20},${wy} v50 M${wx},${wy + 25} h40`} stroke="#4a3d30" strokeWidth="1.2"/>{lit && <rect x={wx} y={wy} width="40" height="50" fill="#ffe9b0" opacity="0.4"/>}</g>;
      }))}
      <rect x={x} y={base - 150} width={w} height="150" fill="#2a2420" opacity="0.88"/>
      <rect x={x + 10} y={base - 140} width={w - 20} height="130" fill="#ffd98a" opacity="0.5"/>
      <path d={`M${x - 6},${base - 150} h${w + 12} l-10,34 h${-(w - 8)} Z`} fill={awn} stroke="#00000044" strokeWidth="1.5"/>
      {Array.from({length: Math.floor(w / 26)}).map((_, i) => <path key={i} d={`M${x - 6 + i * 26 + 6},${base - 150} l-3,34`} stroke="#fff" strokeWidth="6" opacity="0.28"/>)}
      <rect x={x + 18} y={base - 100} width={w - 36} height="16" fill="#8a5a36" opacity="0.9"/>
      {Array.from({length: Math.floor((w - 36) / 24)}).map((_, i) => <circle key={i} cx={x + 30 + i * 24} cy={base - 108} r={8} fill={["#d9532f", "#e8b22f", "#5a9a3a"][i % 3]}/>)}
    </g>
  );
};
export const StreetSet: React.FC<{f: number; camX: number}> = ({f, camX}) => {
  const shops = useMemo(() => { const r = rng(61), cols = ["#d9c1a0", "#c9b9a8", "#cfa88c", "#b9c0b4", "#d6b48e"], awns = ["#c0492f", "#2f7d86", "#d9a43a", "#8a4a62", "#4a6fa0"];
    const out: {x: number; w: number; h: number; c: string; awn: string}[] = []; let x = -60; while (x < 2000) { const w = 230 + r() * 120; out.push({x, w, h: 330 + r() * 170, c: cols[Math.floor(r() * 5)], awn: awns[Math.floor(r() * 5)]}); x += w + 6; } return out; }, []);
  const wind = Math.sin(f / 5) * 5 + 14 + Math.sin(f / 13) * 6;
  const P = (p: number) => `translate(${-camX * p} 0)`;
  return (
    <g>
      <defs>
        <linearGradient id="st-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7f8f9c"/><stop offset="1" stopColor="#cbd0c8"/></linearGradient>
        <linearGradient id="st-road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6c6a68"/><stop offset="1" stopColor="#3e3c3c"/></linearGradient>
        <radialGradient id="st-lamp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffe3a0" stopOpacity="0.8"/><stop offset="1" stopColor="#ffe3a0" stopOpacity="0"/></radialGradient>
        <filter id="st-b" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
      </defs>
      <rect x={-100} y={-100} width={W + 200} height={720} fill="url(#st-sky)"/>
      <g transform={P(0.2)} opacity="0.55">{Array.from({length: 9}).map((_, i) => <rect key={i} x={i * 250 - 60} y={250 + (i % 3) * 36} width={180 + (i % 2) * 60} height={420} fill="#8fa0ae"/>)}</g>
      <g transform={P(0.45)}>{shops.map((s, i) => <Shop key={i} {...s} seed={i + 3} base={SET_FLOOR.street}/>)}</g>
      {/* pavement and road */}
      <rect x={-100} y={SET_FLOOR.street} width={W + 200} height={66} fill="#a9a398" stroke="#6f6a60"/>
      <rect x={-100} y={SET_FLOOR.street + 58} width={W + 200} height={14} fill="#8b867c"/>
      <rect x={-100} y={SET_FLOOR.street + 72} width={W + 200} height={500} fill="url(#st-road)"/>
      {[0, 1, 2, 3, 4].map((i) => <polygon key={i} points={`${160 + i * 420},${860} ${260 + i * 420},${860} ${290 + i * 420},${880} ${150 + i * 420},${880}`} fill="#e8e1c8" opacity="0.7"/>)}
      {/* puddles with reflections of shop lights */}
      {[[420, 900, 260], [1180, 980, 320], [1700, 860, 200]].map(([x, y, w], i) => (
        <g key={i}><ellipse cx={x} cy={y} rx={w} ry={w * 0.1} fill="#8aa0b0" opacity="0.5"/><ellipse cx={x} cy={y - 2} rx={w * 0.8} ry={w * 0.05} fill="#ffe9b8" opacity="0.28"/>
          {[0, 1, 2, 3].map((k) => { const t = (f / 16 + k / 4 + i * 0.3) % 1; return <ellipse key={k} cx={x + (k - 1.5) * w * 0.35} cy={y + (k % 2) * 6} rx={t * 30} ry={t * 6} fill="none" stroke="#e8f2f7" strokeWidth="1.8" opacity={(1 - t) * 0.8}/>; })}</g>
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={140 + i * 300} y={SET_FLOOR.street + 80} width="12" height="240" fill="#ffd98a" opacity="0.12" filter="url(#st-b)"/>)}
      {/* pole and wires */}
      <g transform={P(0.8)}>
        <path d="M1130,760 V300" stroke="#2f2a28" strokeWidth="11" strokeLinecap="round"/><path d="M1060,336 H1200 M1076,372 H1184" stroke="#2f2a28" strokeWidth="7" strokeLinecap="round"/>
        <path d="M1130,310 q40,-4 56,22" stroke="#2f2a28" strokeWidth="6" fill="none"/><ellipse cx="1190" cy="344" rx="22" ry="9" fill="#ffe9a8"/><circle cx="1190" cy="350" r="110" fill="url(#st-lamp)"/>
        <path d="M-100,310 Q500,360 1070,336 Q1600,310 2040,350" stroke="#2f2a28" strokeWidth="1.8" fill="none"/><path d="M-100,360 Q500,408 1090,372 Q1600,350 2040,392" stroke="#2f2a28" strokeWidth="1.8" fill="none"/>
      </g>
      {/* tree bending in the wind */}
      <g transform={`${P(1)} translate(210 ${SET_FLOOR.street + 60})`}>
        <ellipse cx="30" cy="8" rx="120" ry="16" fill="#1f2a30" opacity="0.4" filter="url(#st-b)"/>
        <g transform={`rotate(${-wind * 0.5} 0 0)`}>
          <path d="M-12,0 C-14,-120 -10,-230 -26,-330 L26,-330 C14,-230 18,-120 12,0 Z" fill="#4a382c" stroke="#2a1f18"/>
          <g transform={`rotate(${wind * 0.9} 0 -330) translate(${wind * 1.5} 0)`}>
            {Array.from({length: 26}).map((_, i) => { const a = i * 2.4, d = 20 + (i % 7) * 18; return <circle key={i} cx={Math.cos(a) * d * 2.4 + 40} cy={-420 + Math.sin(a) * d * 1.1 + Math.sin(f / 4 + i) * 3} r={42 + (i % 4) * 8} fill={["#2f5f3a", "#3f7a45", "#27502f"][i % 3]} opacity="0.95"/>; })}
          </g>
        </g>
      </g>
    </g>
  );
};
