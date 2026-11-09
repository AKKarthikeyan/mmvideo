// Look B sets for the stage scene (part 2): beach (noon, hot sand, glittering sea) and himalaya (side view, north left, south right).
import React, {useMemo} from "react";
import {W, H, clamp, eo, lerp, prog, rng} from "../kit";

export const BeachSet: React.FC<{f: number; camX: number}> = ({f, camX}) => {
  const P = (p: number) => `translate(${-camX * p} 0)`;
  const glints = useMemo(() => { const r = rng(9); return Array.from({length: 70}).map(() => ({x: r() * 2100 - 100, y: 440 + r() * 190, ph: r() * 6.28, s: 0.6 + r() * 1.4})); }, []);
  const prints = useMemo(() => Array.from({length: 9}).map((_, i) => ({x: 300 + i * 70 + (i % 2) * 6, y: 850 + i * 14 - (i % 2) * 8, s: 0.7 + i * 0.045})), []);
  const waveY = (x: number, k: number, a: number) => 660 + a * Math.sin(x / 90 + f / 14 + k) + a * 0.5 * Math.sin(x / 41 - f / 9 + k * 2);
  const foam = (k: number, y0: number) => { let d = `M-100,${y0}`; for (let x = -100; x <= 2020; x += 40) d += ` L${x},${y0 + 8 * Math.sin(x / 70 + f / 16 + k) + 14 * Math.sin(f / 60 + k)}`; return d; };
  return (
    <g>
      <defs>
        <linearGradient id="bc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3f8fd8"/><stop offset="0.6" stopColor="#8fc9ee"/><stop offset="1" stopColor="#e4f2f2"/></linearGradient>
        <linearGradient id="bc-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b9ac4"/><stop offset="0.55" stopColor="#35aebd"/><stop offset="1" stopColor="#8fdccb"/></linearGradient>
        <linearGradient id="bc-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9bd86"/><stop offset="0.12" stopColor="#f4dfaa"/><stop offset="1" stopColor="#e7c786"/></linearGradient>
        <radialGradient id="bc-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffffff"/><stop offset="0.12" stopColor="#fffbe0"/><stop offset="0.4" stopColor="#fff0b0" stopOpacity="0.45"/><stop offset="1" stopColor="#fff0b0" stopOpacity="0"/></radialGradient>
        <filter id="bc-b" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
        <filter id="bc-b3" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>
      <rect x={-100} y={-100} width={W + 200} height={560} fill="url(#bc-sky)"/>
      <circle cx={1420 - camX * 0.05} cy={120} r={520} fill="url(#bc-sun)"/><circle cx={1420 - camX * 0.05} cy={120} r={44} fill="#fffef4"/>
      {[[260, 150, 1.4], [880, 90, 1], [1650, 250, 0.8]].map(([x, y, s], i) => <g key={i} opacity="0.7" transform={`translate(${((x + f * 0.2 + i * 100) % 2300) - 200} ${y}) scale(${s})`}>{[[-60, 6, 70, 18], [0, 0, 100, 24], [70, 8, 60, 16]].map(([cx, cy, rx, ry], k) => <ellipse key={k} cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff"/>)}</g>)}
      {/* sea */}
      <rect x={-100} y={430} width={W + 200} height={260} fill="url(#bc-sea)"/>
      <g transform={P(0.1)} opacity="0.75"><path d="M-100,432 L100,408 L280,398 L420,414 L560,430 Z" fill="#8fb4cc"/><path d="M1180,432 L1230,420 L1300,422 L1340,432 Z" fill="#a9c3d4"/><path d="M1540,430 l30,-34 l30,34 Z M1568,430 v8" fill="#f4ecd8" stroke="#8a7a58"/></g>
      <rect x={-100} y={426} width={W + 200} height={14} fill="#dff1f2" opacity="0.6" filter="url(#bc-b3)"/>
      {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M-100,${waveY(-100, k, 3)} ${Array.from({length: 54}).map((_, i) => `L${-100 + i * 40},${480 + k * 40 + 4 * Math.sin((-100 + i * 40) / 100 + f / 16 + k)}`).join(" ")}`} stroke="#e8fbff" strokeWidth={1 + k * 0.5} fill="none" opacity={0.18 + k * 0.05}/>)}
      <ellipse cx="1420" cy="520" rx="150" ry="70" fill="#fff9d8" opacity="0.4" filter="url(#bc-b)"/>
      {glints.map((g, i) => <path key={i} d={`M${g.x},${g.y} h${14 * g.s}`} stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" opacity={clamp(0.75 * Math.sin(f / 6 + g.ph))}/>)}
      {/* shore, foam, wet sand */}
      <path d={foam(0, 646)} stroke="#ffffff" strokeWidth="14" fill="none" opacity="0.9" strokeLinejoin="round"/><path d={foam(1, 664)} stroke="#e9fbfb" strokeWidth="7" fill="none" opacity="0.75"/>
      <rect x={-100} y={654} width={W + 200} height={440} fill="url(#bc-sand)"/>
      <path d={foam(0.5, 668)} stroke="#c9ad72" strokeWidth="26" fill="none" opacity="0.4" filter="url(#bc-b3)"/>
      <path d={foam(0, 650)} stroke="#ffffff" strokeWidth="9" fill="none" opacity="0.92"/>
      {Array.from({length: 9}).map((_, i) => <path key={i} d={`M-100,${720 + i * 44} Q300,${706 + i * 44} 700,${724 + i * 44} T1500,${716 + i * 44} T2100,${726 + i * 44}`} stroke="#b99a62" strokeWidth={1 + i * 0.25} fill="none" opacity="0.28"/>)}
      {/* palm */}
      <g transform={`${P(0.6)} translate(140 780)`}>
        <ellipse cx="60" cy="12" rx="130" ry="18" fill="#6b5330" opacity="0.3" filter="url(#bc-b3)"/>
        <path d="M0,0 C-26,-140 20,-290 70,-420 L96,-414 C60,-290 26,-140 24,0 Z" fill="#8a6a44" stroke="#4a3520"/>
        {Array.from({length: 14}).map((_, i) => <path key={i} d={`M${18 + i * 0.4},${-24 - i * 28} q22,-5 34,2`} stroke="#4a3520" strokeWidth="1.2" fill="none" opacity="0.5"/>)}
        <g transform={`translate(84 -420) rotate(${Math.sin(f / 40) * 2})`}>
          {[-150, -108, -64, -18, 26, 72, 118, 158].map((a, i) => <path key={i} transform={`rotate(${a + Math.sin(f / 24 + i) * 3})`} d="M0,0 C60,-40 140,-30 200,36 C140,-4 70,-6 0,6 Z" fill={i % 2 ? "#3f7a45" : "#4f8f50"} stroke="#23502c" strokeWidth="1.4"/>)}
          <circle r="16" fill="#6b5330"/><circle cx="-8" cy="10" r="10" fill="#7a6038"/>
        </g>
      </g>
      {/* umbrella and towel */}
      <g transform={`${P(0.85)} translate(1490 880)`}>
        <ellipse cx="40" cy="110" rx="170" ry="22" fill="#6b5330" opacity="0.3" filter="url(#bc-b3)"/>
        <rect x="-76" y="76" width="190" height="62" fill="#4a8fa6" stroke="#255a6c" transform="rotate(-6)"/>{[0, 1, 2, 3].map((i) => <rect key={i} x={-70 + i * 46} y="78" width="22" height="58" fill="#f4ecd8" opacity="0.85" transform="rotate(-6)"/>)}
        <path d="M40,100 L58,-260" stroke="#4a3a2a" strokeWidth="9" strokeLinecap="round"/>
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${58 - 220 + i * 74},-190 Q${58 - 220 + i * 74 + 37},-290 ${58 - 220 + (i + 1) * 74},-190 Z`} fill={i % 2 ? "#f4ecd8" : "#c0492f"} stroke="#7f2d1b" strokeWidth="1.4"/>)}
        <path d="M-162,-190 Q58,-250 278,-190" stroke="#7f2d1b" strokeWidth="2" fill="none"/>
      </g>
      {/* footprints */}
      {prints.map((p, i) => <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s})`} opacity="0.5"><ellipse cx="0" cy="0" rx="9" ry="16" fill="#a98a52" transform="rotate(14)"/><ellipse cx="2" cy="-18" rx="6" ry="4" fill="#a98a52"/></g>)}
      {[[400, 960], [1200, 1000], [980, 790]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y}) scale(${1 + i * 0.2})`}><path d="M-14,0 q14,-26 28,0 q-14,8 -28,0 Z" fill="#f2cdb8" stroke="#a97a62"/><path d="M-6,-6 v-10 M0,-8 v-14 M6,-6 v-10" stroke="#a97a62" strokeWidth="1.2"/></g>)}
      {[0, 1, 2, 3, 4, 5].map((i) => { let d = `M-100,${760 + i * 50}`; for (let x = -100; x <= 2020; x += 70) d += ` Q${x + 17},${760 + i * 50 - 9 * Math.sin(f / 13 + x / 100 + i)} ${x + 35},${760 + i * 50} T${x + 70},${760 + i * 50}`; return <path key={i} d={d} stroke="#fffbe8" strokeWidth="3" fill="none" opacity={0.26 - i * 0.03} style={{mixBlendMode: "screen"}}/>; })}
      {[[260, 210], [520, 140], [1020, 180]].map(([x, y], i) => <path key={i} transform={`translate(${((x + f * (1.4 + i * 0.3)) % 2200) - 150} ${y + Math.sin(f / 20 + i) * 14})`} d={`M-18,0 Q-8,${-10 + Math.sin(f / 5 + i) * 4} 0,0 Q8,${-10 + Math.sin(f / 5 + i) * 4} 18,0`} stroke="#fff" strokeWidth="3" fill="none"/>)}
    </g>
  );
};

// ---------------------------------------------------------------------------------------------------------------------------------
// himalaya: a snow wall across the frame; cold dry air from the north (left) is stopped, moist air from the south (right) piles into cloud against it
const rid = (x: number, seed: number) => {   // ridged noise in 0..1: sharp peaks, soft valleys
  const o = (k: number, fr: number, ph: number) => 1 - Math.abs(Math.sin(x * fr + ph + seed * k));
  return 0.52 * o(1, 1 / 330, 0.4) + 0.3 * o(2, 1 / 140, 1.7) + 0.18 * o(3, 1 / 61, 2.9);
};
const range = (x0: number, x1: number, seed: number, base: number, amp: number, env: (x: number) => number, step = 12): [number, number][] => {
  const pts: [number, number][] = []; for (let x = x0; x <= x1; x += step) pts.push([x, base - env(x) * amp * (0.3 + 0.95 * Math.pow(rid(x, seed), 1.25))]); return pts;
};
const poly = (pts: [number, number][], bottom: number) => `M${pts[0][0]},${bottom} ` + pts.map(([x, y]) => `L${x},${y}`).join(" ") + ` L${pts[pts.length - 1][0]},${bottom} Z`;
const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

/** a billowing cloud bank, painted with soft blurred puffs: pale top, blue-grey belly; (x, y) is the middle of its base */
export const CloudBank: React.FC<{x: number; y: number; s: number; f: number; seed: number; grow: number}> = ({x, y, s, f, seed, grow}) => {
  const bl = useMemo(() => { const r = rng(seed); return Array.from({length: 22}).map(() => { const dx = (r() - 0.5) * 340; return {dx, dy: -(0.12 + r() * 0.88) * (190 - Math.abs(dx) * 0.42), r: 38 + r() * 46}; }); }, [seed]);
  const tone = (dy: number) => { const t = clamp(-dy / 190); return `rgb(${Math.round(lerp(150, 255, t))},${Math.round(lerp(164, 255, t))},${Math.round(lerp(190, 255, t))})`; };
  return <g transform={`translate(${x} ${y}) scale(${s * grow})`} opacity={clamp(grow * 3)}>
    <g filter="url(#hm-cb)">
      <ellipse cx="0" cy="10" rx="190" ry="30" fill="#6d7b95" opacity="0.8"/>
      {bl.map((b, i) => <circle key={i} cx={b.dx + Math.sin(f / 45 + i) * 3} cy={b.dy + Math.sin(f / 38 + i * 2) * 2.5} r={b.r} fill={tone(b.dy)}/>)}
      {bl.filter((_, i) => i % 3 === 0).map((b, i) => <circle key={`h${i}`} cx={b.dx - 14} cy={b.dy - b.r * 0.4} r={b.r * 0.55} fill="#ffffff" opacity="0.9"/>)}
    </g>
  </g>;
};

export const HimalayaSet: React.FC<{f: number; dur: number; camX: number}> = ({f, dur, camX}) => {
  const P = (p: number) => `translate(${-camX * p} 0)`;
  const far = useMemo(() => range(-120, 2040, 3, 700, 280, () => 1), []);
  const mid = useMemo(() => range(-120, 2040, 8, 800, 360, (x) => 0.85 - 0.3 * smooth(1200, 2000, x)), []);
  const env = (x: number) => (0.5 + 0.5 * smooth(150, 620, x)) * (1 - 0.88 * smooth(1060, 1700, x));
  const near = useMemo(() => range(-120, 2040, 14, 960, 780, env), []);   // eslint-disable-line
  const slopeY = (x: number) => { const i = Math.max(0, Math.min(near.length - 1, Math.round((x + 120) / 12))); return near[i][1]; };
  const faces = useMemo(() => near.map(([x, y], i) => ({x, y, i})).filter(({y, i}) => i > 3 && i < near.length - 8 && near.slice(i - 3, i + 4).every(([, yy]) => yy >= y) && y < 640).map(({x, y, i}) => {
    let j = i + 1; while (j < near.length - 1 && near[j + 1][1] >= near[j][1] && j - i < 22) j++;
    return `M${x},${y} ${near.slice(i, j + 1).map(([px, py]) => `L${px},${py}`).join(" ")} L${near[j][0] - 22},${near[j][1] + 40} L${x + (near[j][0] - x) * 0.3},${y + (near[j][1] - y) * 1.15} Z`;
  }), [near]);
  const arrows = [0, 1, 2, 3, 4].map((i) => { const y = 250 + i * 92; return {d: `M-60,${y} C200,${y - 8} 400,${y + 6} 500,${y + 6} C560,${y + 6} 590,${y - 30} 580,${y - 90 - i * 8} C572,${y - 140 - i * 10} 520,${y - 170 - i * 12} 470,${y - 160 - i * 12}`, i, hx: 470, hy: y - 160 - i * 12}; });
  const gr = eo(prog(f, 20, 140)), gr2 = eo(prog(f, 90, 200));
  const bx = [[1160, 0, 1.0, 5], [1330, 0, 1.0, 6], [1500, 0, 0.85, 7], [1250, 0, 0.7, 9]] as const;
  return (
    <g>
      <defs>
        <linearGradient id="hm-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5f93cc"/><stop offset="0.45" stopColor="#a9cbe6"/><stop offset="0.85" stopColor="#f2e8d4"/></linearGradient>
        <linearGradient id="hm-far" gradientUnits="userSpaceOnUse" x1="0" y1="380" x2="0" y2="760"><stop offset="0" stopColor="#f6f9fd"/><stop offset="0.5" stopColor="#dbe6f2"/><stop offset="0.62" stopColor="#b7c8dc"/><stop offset="1" stopColor="#a4bad2"/></linearGradient>
        <linearGradient id="hm-mid" gradientUnits="userSpaceOnUse" x1="0" y1="400" x2="0" y2="860"><stop offset="0" stopColor="#ffffff"/><stop offset="0.42" stopColor="#e6eef7"/><stop offset="0.52" stopColor="#aebfd5"/><stop offset="1" stopColor="#7589a6"/></linearGradient>
        <linearGradient id="hm-near" gradientUnits="userSpaceOnUse" x1="0" y1="200" x2="0" y2="980"><stop offset="0" stopColor="#ffffff"/><stop offset="0.38" stopColor="#f1f6fb"/><stop offset="0.48" stopColor="#c9d3e2"/><stop offset="0.58" stopColor="#8e8da8"/><stop offset="0.8" stopColor="#6a6a84"/><stop offset="1" stopColor="#4d4c64"/></linearGradient><linearGradient id="hm-forest" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3f7a45"/><stop offset="1" stopColor="#1f4a2f"/></linearGradient>
        <linearGradient id="hm-grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#86b862"/><stop offset="1" stopColor="#3f7a45"/></linearGradient>
        <radialGradient id="hm-cold" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#bfe0ff" stopOpacity="0.5"/><stop offset="1" stopColor="#bfe0ff" stopOpacity="0"/></radialGradient>
        <filter id="hm-b" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>
        <filter id="hm-b3" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
        <filter id="hm-cb" x="-30%" y="-40%" width="160%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      </defs>
      <rect x={-100} y={-100} width={W + 200} height={H + 200} fill="url(#hm-sky)"/>
      <circle cx="1620" cy="150" r="220" fill="#fff4cf" opacity="0.4" filter="url(#hm-b)"/><circle cx="1620" cy="150" r="32" fill="#fffbe6"/>
      <g transform={P(0.1)}><path d={poly(far, 900)} fill="url(#hm-far)" opacity="0.95"/></g>
      <g transform={P(0.25)}><path d={poly(mid, 920)} fill="url(#hm-mid)"/>
        <rect x={-100} y={560} width={W + 200} height={260} fill="#dfeaf5" opacity="0.3" filter="url(#hm-b)"/></g>
      <g transform={P(0.5)}>
        <path d={poly(near, 960)} fill="url(#hm-near)"/>
        {faces.filter((_, k) => k % 2 === 0).map((d, i) => <path key={i} d={d} fill="#34345a" opacity="0.3"/>)}
        {faces.map((d, i) => { const m = /^M([\d.-]+),([\d.-]+)/.exec(d)!, px = +m[1], py = +m[2]; return <g key={`g${i}`} fill="none" strokeLinecap="round">
          {[-26, 6, 38].map((o, k) => <path key={k} d={`M${px + o * 0.4},${py + 24 + k * 6} q${o * 0.8},${90 + k * 20} ${o * 0.3},${210 + k * 30}`} stroke={k === 1 ? "#ffffff" : "#3b3a58"} strokeWidth={3} opacity={k === 1 ? 0.18 : 0.2}/>)}</g>; })}
        <path d={`M-100,${700} Q300,${660} 700,${720} T1400,${730} T2100,${770}`} stroke="#ffffff" strokeWidth="34" fill="none" opacity="0.28" filter="url(#hm-b3)"/>
        <path d={`M-120,1000 V${830} ${Array.from({length: 40}).map((_, i) => `L${-120 + i * 56},${810 + 34 * Math.sin(i * 0.7) + (i % 3) * 8 + (i > 18 ? (i - 18) * 12 : 0)}`).join(" ")} V1000 Z`} fill="url(#hm-forest)"/>
      </g>
      {/* south foothills, river, fields */}
      <g transform={P(0.8)}>
        <path d={`M1100,1100 V920 ${Array.from({length: 18}).map((_, i) => `L${1100 + i * 50},${900 + 40 * Math.sin(i * 0.9) - i * 8}`).join(" ")} V1100 Z`} fill="url(#hm-grass)"/>
        <path d="M-100,1010 Q700,920 1200,980 T2100,900 V1100 H-100 Z" fill="#7fb15c" opacity="0.8"/>
        <path d="M1300,940 q60,50 20,100 q-40,50 30,100" stroke="#8fc6e8" strokeWidth="12" fill="none" strokeLinecap="round"/><path d="M1300,940 q60,50 20,100 q-40,50 30,100" stroke="#fff" strokeWidth="2.4" fill="none" opacity="0.6"/>
        {Array.from({length: 7}).map((_, i) => <path key={i} d={`M${1500 + i * 70},${1000 + (i % 2) * 20} l60,-12 l24,46 l-70,10 Z`} fill={i % 2 ? "#a7c860" : "#8fb852"} stroke="#4a7a3a" strokeWidth="1" opacity="0.8"/>)}
      </g>
      {/* cold dry air from the north, left: it runs at the wall and is forced up and back */}
      <g>
        <ellipse cx="260" cy="400" rx="520" ry="330" fill="url(#hm-cold)"/>
        {arrows.map(({d, i, hx, hy}) => (
          <g key={i} opacity={0.95 - i * 0.05}>
            <path d={d} stroke="#ffffff" strokeWidth="18" fill="none" strokeLinecap="round" opacity="0.3" filter="url(#hm-b3)"/>
            <path d={d} stroke="#7fb8f0" strokeWidth="9" fill="none" strokeLinecap="round" strokeDasharray="34 26" strokeDashoffset={-f * (3 + i * 0.3)}/>
            <path d={d} stroke="#eef7ff" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="34 26" strokeDashoffset={-f * (3 + i * 0.3)} opacity="0.95"/>
            <path d="M0,0 L-30,-15 L-24,0 L-30,15 Z" fill="#7fb8f0" stroke="#eef7ff" strokeWidth="2" strokeLinejoin="round" transform={`translate(${hx} ${hy}) rotate(168)`}/>
          </g>
        ))}
        {[0, 1, 2].map((k) => { const x = 160 + k * 150, t = (f / 40 + k * 0.33) % 1; return <g key={k} opacity={0.6 * (1 - t)} transform={`translate(${x + t * 320} ${280 + k * 90 + Math.sin(t * 6) * 14})`}>{[0, 1, 2, 3].map((j) => <circle key={j} cx={j * 7} cy={Math.sin(j) * 4} r={2.6} fill="#fff"/>)}</g>; })}
      </g>
      {/* moist warm air rising on the south side: cloud banks build against the slope, rain below, warm arrows climbing */}
      <g>
        {[0, 1, 2].map((i) => { const y = 740 + i * 66, d = `M1900,${y + 120} C1700,${y + 100} 1480,${y + 70} 1300,${y - 30 - i * 20} C1210,${y - 90 - i * 30} 1150,${y - 170 - i * 24} 1110,${y - 250 - i * 22}`; return <g key={i} opacity={0.85 * gr}>
          <path d={d} stroke="#f5b84a" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray="26 24" strokeDashoffset={-f * 3.2}/><path d={d} stroke="#fff3c9" strokeWidth="2" fill="none" strokeDasharray="26 24" strokeDashoffset={-f * 3.2} opacity="0.8"/></g>; })}
        {bx.map(([x, , s, sd], i) => <CloudBank key={i} x={x + Math.sin(f / 60 + i) * 6} y={Math.max(380, slopeY(x) - 10 + (i === 3 ? -150 : 0))} s={s} f={f} seed={sd} grow={clamp(i % 2 ? gr2 : gr)}/>)}
        {gr2 > 0.3 && Array.from({length: 60}).map((_, i) => { const r = rng(i + 400), x = 1040 + r() * 700, y0 = slopeY(x) + 20, y = y0 + ((f * (14 + r() * 8) + r() * 200) % 200); return <path key={i} d={`M${x - (y - y0) * 0.12},${y} l-4,22`} stroke="#d9e6f2" strokeWidth="1.8" opacity={0.6 * gr2} strokeLinecap="round"/>; })}
      </g>
    </g>
  );
};
