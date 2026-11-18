// Rich, moving art for No. 002 The Fridge (AK 22 Oct 2026: explain like I'm 5; rich motion and rich visuals; fill the screen).
// Everything drawn in code, everything keeps moving: sea, steam, drips, frost, glow.
import React from "react";
import {C, Draw, HEAD, MONO, W} from "../kit";

const ICE = "#BFE3F5", ICE_D = "#6FAED0", HOT = "#E8563A", WARM = "#F2A03D", SEA = "#5FA8D3", SEA_D = "#2F7BAE";
// a band of sea from the wave line down to `bottom` (never to the frame edge: AK, no blocks of colour at the margins)
const wave = (y: number, amp: number, len: number, ph: number, x0 = 60, x1 = 1000, bottom = 1560) => {
  const pts = []; for (let x = x0; x <= x1; x += 20) pts.push(`${x},${y + amp * Math.sin(x / len + ph)}`);
  return `M ${x0} ${bottom} L ${pts.join(" L ")} L ${x1} ${bottom} Q ${(x0 + x1) / 2} ${bottom + 30} ${x0} ${bottom} Z`;
};
const Sparkle: React.FC<{x: number; y: number; t: number; s?: number; c?: string}> = ({x, y, t, s = 1, c = "#fff"}) => {
  const k = (Math.sin(t * 5 + x) + 1) / 2;
  return <path d={`M ${x} ${y - 16 * s * k} L ${x + 4 * s} ${y} L ${x} ${y + 16 * s * k} L ${x - 4 * s} ${y} Z M ${x - 16 * s * k} ${y} L ${x} ${y + 4 * s} L ${x + 16 * s * k} ${y} L ${x} ${y - 4 * s} Z`} fill={c} opacity={0.4 + 0.6 * k}/>;
};

export const Cube: React.FC<{x: number; y: number; s: number; t?: number; o?: number}> = ({x, y, s, t = 0, o = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
    <rect x={-30} y={-30} width={60} height={60} rx={10} fill={ICE} stroke={ICE_D} strokeWidth={4}/>
    <path d="M -30 -10 L -30 -20 Q -30 -30 -20 -30 L 20 -30 Q 30 -30 30 -20 L 30 -10 Z" fill="#E4F4FC"/>
    <path d="M -18 -18 L 8 -18" stroke="#fff" strokeWidth={6} strokeLinecap="round"/>
    <Sparkle x={14} y={-14} t={t + x} s={0.8}/>
  </g>
);

/** sea voyage: sky, sun, rolling sea, rocking ship with glinting ice, route and labels */
export const IceShip: React.FC<{p: number; draw: number; t: number; o?: number}> = ({p, draw, t, o = 1}) => {
  const x = 190 + 620 * p, bob = Math.sin(t * 2.2) * 10, rock = Math.sin(t * 1.7) * 4;
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o}}>
      <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FCE7C8"/><stop offset="1" stopColor="#F2EEE7" stopOpacity="0"/></linearGradient></defs>
      <circle cx={860} cy={880} r={70} fill="#F6C453"/>
      {Array.from({length: 10}).map((_, k) => { const a = k / 10 * Math.PI * 2 + t * 0.4; return <line key={k} x1={860 + Math.cos(a) * 90} y1={880 + Math.sin(a) * 90} x2={860 + Math.cos(a) * 120} y2={880 + Math.sin(a) * 120} stroke="#F6C453" strokeWidth={8} strokeLinecap="round"/>; })}
      {[0, 1].map((k) => <path key={k} d={`M ${(120 + t * 30 + k * 380) % 1100 - 60} ${930 + k * 50} q 18 -16 36 0 q 18 -16 36 0`} fill="none" stroke={C.ink2} strokeWidth={5}/>)}
      <path d={wave(1290, 14, 70, t * 2, 60, 1000, 1430)} fill={SEA} opacity={0.55}/>
      <g transform={`translate(${x},${1240 + bob}) rotate(${rock})`}>
        <path d="M -150 22 L 150 22 L 112 96 L -112 96 Z" fill="#8A5A3C" stroke={C.ink} strokeWidth={6}/>
        <path d="M -140 40 L 140 40" stroke="#6E4630" strokeWidth={6}/>
        <line x1={0} y1={22} x2={0} y2={-230} stroke={C.ink} strokeWidth={8}/>
        <path d={`M 8 -220 Q ${90 + Math.sin(t * 3) * 10} -130 120 -44 L 8 -44 Z`} fill={C.white} stroke={C.ink} strokeWidth={5}/>
        <path d={`M -8 -196 Q ${-80 + Math.sin(t * 3) * 8} -120 -110 -44 L -8 -44 Z`} fill="#FBF6EC" stroke={C.ink} strokeWidth={5}/>
        <path d="M 0 -230 L 40 -218 L 0 -206 Z" fill={C.accent}/>
        {[-96, -32, 32, 96].map((cx, k) => <Cube key={cx} x={cx} y={-6} s={0.95} t={t + k}/>)}
        {[-60, 0, 60].map((cx, k) => <Cube key={"u" + cx} x={cx} y={-60} s={0.85} t={t + k + 4}/>)}
      </g>
      <path d={wave(1320, 18, 90, -t * 2.6, 60, 1000, 1420)} fill={SEA_D} opacity={0.75}/>
      {Array.from({length: 6}).map((_, k) => <circle key={k} cx={x - 170 - k * 34} cy={1322 + Math.sin(t * 4 + k) * 6} r={8 - k} fill="#fff" opacity={0.7 - k * 0.1}/>)}
      <Draw d="M 150 1460 Q 500 1400 850 1460" p={draw} stroke={C.ink2} w={5} len={800}/>
      <circle cx={150} cy={1460} r={12} fill={C.ink}/><circle cx={850} cy={1460} r={12} fill={C.accent}/>
      <circle cx={150 + 700 * p} cy={1460 - 60 * Math.sin(p * Math.PI)} r={10} fill={C.accent}/>
      <text x={150} y={1520} textAnchor="middle" fontFamily={MONO} fontSize={28} letterSpacing={3} fill={C.ink}>AMERICA</text>
      <text x={850} y={1520} textAnchor="middle" fontFamily={MONO} fontSize={28} letterSpacing={3} fill={C.ink}>CALCUTTA</text>
    </svg>
  );
};

/** nine glinting cubes; four melt into a spreading puddle with drips */
export const MeltCubes: React.FC<{p: number; melt: number; t: number; o?: number}> = ({p, melt, t, o = 1}) => (
  <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
    <ellipse cx={540} cy={1450} rx={240 + 50 * melt} ry={36 + 10 * melt} fill={ICE} opacity={0.35 + 0.3 * melt}/>
    {Array.from({length: 9}).map((_, i) => {
      const r = Math.floor(i / 3), c = i % 3, gone = i >= 5, cx = 340 + c * 200, cy = 900 + r * 190;
      const s = gone ? 1.8 * (1 - melt * 0.92) : 1.8;
      return (
        <g key={i}>
          <Cube x={cx} y={cy + (gone ? 30 * melt : 0)} s={s} t={t + i} o={gone ? 1 - melt * 0.5 : 1}/>
          {gone && melt > 0.05 && [0, 1].map((d) => { const ph = (t * 1.3 + d * 0.5 + i * 0.2) % 1; return <path key={d} d={`M ${cx - 20 + d * 40} ${cy + 50 + ph * 120} q 8 12 0 20 q -8 -8 0 -20`} fill={ICE_D} opacity={(1 - ph) * melt}/>; })}
        </g>
      );
    })}
  </svg>
);

/** a fridge, front view, shaded; the door swings a little and cold light spills out */
export const FridgeFront: React.FC<{p: number; t: number; o?: number; q?: boolean}> = ({p, t, o = 1, q = true}) => {
  const open = (Math.sin(t * 1.4) + 1) / 2 * 0.35;
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
      <defs><linearGradient id="ff" x1="0" x2="1"><stop offset="0" stopColor="#FFFFFF"/><stop offset="1" stopColor="#E3E6EA"/></linearGradient>
        <radialGradient id="glow"><stop offset="0" stopColor="#DDF1FB" stopOpacity="0.9"/><stop offset="1" stopColor="#DDF1FB" stopOpacity="0"/></radialGradient></defs>
      <ellipse cx={540} cy={1600} rx={260} ry={26} fill="#000" opacity={0.12}/>
      <circle cx={760} cy={1250} r={260 * open * 2} fill="url(#glow)"/>
      <rect x={330} y={740} width={420} height={860} rx={44} fill="url(#ff)" stroke={C.ink} strokeWidth={8}/>
      <line x1={330} y1={1010} x2={750} y2={1010} stroke={C.ink} strokeWidth={6}/>
      <rect x={690} y={830} width={18} height={120} rx={9} fill={C.ink}/>
      <g transform={`translate(750,1010) scale(${1 - open},1) translate(-750,-1010)`}><rect x={330} y={1010} width={420} height={590} rx={40} fill="url(#ff)" stroke={C.ink} strokeWidth={8}/><rect x={690} y={1070} width={18} height={170} rx={9} fill={C.ink}/></g>
      {open > 0.1 && Array.from({length: 6}).map((_, k) => { const ph = (t * 0.6 + k / 6) % 1; return <g key={k} transform={`translate(${760 + ph * 220}, ${1120 + k * 60 + Math.sin(ph * 6) * 20})`} opacity={(1 - ph) * open * 2.5}><path d="M -14 0 L 14 0 M 0 -14 L 0 14 M -10 -10 L 10 10 M -10 10 L 10 -10" stroke={ICE_D} strokeWidth={4}/></g>; })}
      {q && <text x={540} y={1440} textAnchor="middle" fontFamily={HEAD} fontSize={240} fill={C.accent} transform={`rotate(${Math.sin(t * 2) * 6} 540 1360)`}>?</text>}
    </svg>
  );
};

/** wet hand with sliding drops, swirling breath, cool aura and shiver lines */
export const WetHand: React.FC<{p: number; blow: number; t: number; o?: number}> = ({p, blow, t, o = 1}) => {
  const shiver = blow > 0.5 ? Math.sin(t * 40) * 3 : 0;
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
      <circle cx={640} cy={1130} r={300} fill={ICE} opacity={0.35 * blow}/>
      <g transform={`translate(${640 + shiver},1180)`}>
        <path d="M -90 280 L -110 20 Q -130 -60 -95 -70 Q -70 -75 -62 -10 L -60 -180 Q -60 -215 -32 -215 Q -5 -215 -5 -180 L -2 -60 L 2 -230 Q 4 -262 32 -262 Q 60 -262 60 -230 L 58 -60 L 64 -200 Q 66 -230 92 -230 Q 118 -230 118 -200 L 112 -40 L 122 -150 Q 126 -175 148 -172 Q 170 -168 168 -140 L 150 80 Q 140 200 90 280 Z" fill="#F1C9A5" stroke={C.ink} strokeWidth={7} strokeLinejoin="round"/>
        <path d="M -40 120 Q 20 150 80 110" fill="none" stroke="#D9A982" strokeWidth={5}/>
        {[[-40, -120], [30, -150], [90, -100], [10, 20], [-60, 80], [80, 40], [-20, 200]].map(([x, y], i) => {
          const slide = ((t * 0.5 + i * 0.3) % 1) * 30;
          return <path key={i} d={`M ${x} ${y - 20 + slide} Q ${x + 14} ${y + slide} ${x} ${y + 12 + slide} Q ${x - 14} ${y + slide} ${x} ${y - 20 + slide} Z`} fill={ICE} stroke={ICE_D} strokeWidth={3} opacity={1 - blow * 0.75}/>;
        })}
      </g>
      {blow > 0 && Array.from({length: 5}).map((_, k) => {
        const ph = (t * 0.9 + k / 5) % 1, x = 120 + ph * 420, y = 1020 + k * 55;
        return <path key={k} d={`M ${x} ${y} q 30 -26 60 0 t 60 0 q 20 18 0 34`} fill="none" stroke={C.accent} strokeWidth={7} strokeLinecap="round" opacity={blow * (1 - ph)}/>;
      })}
      {blow > 0.5 && [0, 1, 2].map((k) => <path key={k} d={`M ${850 + k * 26} ${980 + k * 10} l 14 -22 l 14 22`} fill="none" stroke={ICE_D} strokeWidth={5} opacity={blow}/>)}
      {blow > 0.5 && <text x={820} y={940} textAnchor="middle" fontFamily={HEAD} fontSize={70} fill={C.accent} transform={`rotate(${Math.sin(t * 8) * 4} 820 920)`}>BRRR</text>}
    </svg>
  );
};

/** a big drop drying up while glowing heat dots ride away on the steam */
export const DryingDrop: React.FC<{p: number; dry: number; t: number; o?: number}> = ({p, dry, t, o = 1}) => {
  const s = 1 - 0.7 * dry, wob = Math.sin(t * 3) * 0.03;
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
      <defs><radialGradient id="dg" cx="0.35" cy="0.35" r="0.8"><stop offset="0" stopColor="#F2FAFE"/><stop offset="1" stopColor="#8FC7E6"/></radialGradient></defs>
      <ellipse cx={540} cy={1460} rx={200 * s + 40} ry={22} fill={ICE} opacity={0.5}/>
      <g transform={`translate(540,1300) scale(${s + wob},${s - wob})`}>
        <path d="M 0 -170 Q 120 0 110 60 Q 100 150 0 150 Q -100 150 -110 60 Q -120 0 0 -170 Z" fill="url(#dg)" stroke={ICE_D} strokeWidth={6}/>
        <ellipse cx={-38} cy={10} rx={18} ry={34} fill="#fff" opacity={0.8}/>
      </g>
      {Array.from({length: 9}).map((_, k) => {
        const ph = (t * 0.55 + k / 9) % 1, x = 450 + k * 22 + Math.sin(ph * 7 + k) * 30, y = 1200 - ph * 460;
        return <g key={k} opacity={Math.max(0.15, dry) * (1 - ph)}>
          <path d={`M ${x} ${y + 50} q 16 -25 0 -50 q -16 -25 0 -50`} fill="none" stroke={C.mute} strokeWidth={6}/>
          <circle cx={x} cy={y - 56} r={14} fill={HOT}/><circle cx={x} cy={y - 56} r={24} fill={HOT} opacity={0.25}/>
        </g>;
      })}
      <text x={760} y={880} fontFamily={MONO} fontWeight={600} fontSize={30} letterSpacing={3} fill={HOT} opacity={dry}>HEAT LEAVES</text>
    </svg>
  );
};

/** Cullen's flask bubbling in a bowl; frost crystals grow across the water as it freezes */
export const CullenFlask: React.FC<{p: number; freeze: number; t: number; o?: number}> = ({p, freeze, t, o = 1}) => (
  <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
    <defs><linearGradient id="bw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CFE8F5"/><stop offset="1" stopColor="#9CCDE8"/></linearGradient></defs>
    <ellipse cx={540} cy={1480} rx={300} ry={28} fill="#000" opacity={0.1}/>
    <path d="M 250 1140 L 830 1140 L 775 1460 L 305 1460 Z" fill="url(#bw)" stroke={C.ink} strokeWidth={7}/>
    <path d="M 268 1170 L 812 1170 L 770 1440 L 310 1440 Z" fill="#F4FBFE" opacity={freeze * 0.85}/>
    {Array.from({length: 9}).map((_, i) => {
      const x = 320 + (i % 5) * 110 + (i > 4 ? 55 : 0), y = 1230 + (i > 4 ? 130 : 0), g = Math.max(0, Math.min(1, freeze * 1.6 - i * 0.08));
      return <g key={i} stroke={ICE_D} strokeWidth={4} opacity={g} transform={`translate(${x},${y}) scale(${g}) rotate(${i * 20 + t * 10})`}>
        {[0, 60, 120].map((a) => <g key={a} transform={`rotate(${a})`}><line x1={-30} y1={0} x2={30} y2={0}/><line x1={18} y1={0} x2={26} y2={-8}/><line x1={18} y1={0} x2={26} y2={8}/><line x1={-18} y1={0} x2={-26} y2={-8}/><line x1={-18} y1={0} x2={-26} y2={8}/></g>)}
      </g>;
    })}
    <path d="M 500 880 L 500 1070 Q 425 1115 425 1220 Q 425 1330 540 1330 Q 655 1330 655 1220 Q 655 1115 580 1070 L 580 880 Z" fill="#FFFFFF" fillOpacity={0.85} stroke={C.ink} strokeWidth={7}/>
    <path d="M 436 1220 Q 436 1318 540 1318 Q 644 1318 644 1220 Z" fill="#F4E9A8"/>
    {Array.from({length: 6}).map((_, k) => { const ph = (t * 1.2 + k / 6) % 1; return <circle key={k} cx={470 + k * 26} cy={1300 - ph * 90} r={7 - ph * 3} fill="#fff" opacity={1 - ph}/>; })}
    {[0, 1, 2, 3].map((k) => { const ph = (t * 0.8 + k / 4) % 1; return <path key={k} d={`M ${520 + k * 14} ${870 - ph * 260} q 18 -28 0 -56 q -18 -28 0 -56`} fill="none" stroke={C.mute} strokeWidth={6} opacity={1 - ph}/>; })}
    <Sparkle x={330} y={1200} t={t} s={1.2} c={freeze > 0.5 ? ICE_D : "#fff"}/><Sparkle x={760} y={1250} t={t + 2} s={1.2} c={freeze > 0.5 ? ICE_D : "#fff"}/>
    <text x={540} y={1530} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={30} letterSpacing={3} fill={ICE_D} opacity={freeze}>WATER TURNS TO ICE</text>
  </svg>
);

// the fridge loop, cut open: inside pipes (top of the box) -> down the back -> pump -> up the back coil -> back inside
const LOOP: [number, number][] = [[250, 900], [600, 900], [600, 960], [250, 960], [250, 1020], [600, 1020], [700, 1020], [700, 1480],
  [760, 1480], [760, 1400], [840, 1400], [840, 1320], [760, 1320], [760, 1240], [840, 1240], [840, 1160], [760, 1160], [760, 1080], [840, 1080], [840, 860], [700, 860], [250, 860], [250, 900]];
const SEG = LOOP.slice(1).map((q, i) => Math.hypot(q[0] - LOOP[i][0], q[1] - LOOP[i][1]));
const LEN = SEG.reduce((a, b) => a + b, 0);
const at = (u: number): [number, number, number] => {
  let d = ((u % 1) + 1) % 1 * LEN;
  for (let i = 0; i < SEG.length; i++) { if (d <= SEG[i]) { const f = d / SEG[i]; return [LOOP[i][0] + (LOOP[i + 1][0] - LOOP[i][0]) * f, LOOP[i][1] + (LOOP[i + 1][1] - LOOP[i][1]) * f, i]; } d -= SEG[i]; }
  return [LOOP[0][0], LOOP[0][1], 0];
};
/** step: 0 none, 1 inside pipes, 2 pump, 3 back coils, 4 all */
export const FridgeLoop: React.FC<{p: number; t: number; step: number; o?: number}> = ({p, t, step, o = 1}) => {
  const hi = (n: number) => step === n || step === 4 ? 1 : 0.3;
  const pulse = 0.5 + 0.5 * Math.sin(t * 6);
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
      <defs><linearGradient id="box" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EEF7FC"/><stop offset="1" stopColor="#FFFFFF"/></linearGradient></defs>
      <ellipse cx={520} cy={1600} rx={380} ry={26} fill="#000" opacity={0.1}/>
      <rect x={200} y={820} width={460} height={760} rx={30} fill="url(#box)" stroke={C.ink} strokeWidth={8}/>
      {[1160, 1340].map((y) => <line key={y} x1={215} y1={y} x2={645} y2={y} stroke={C.line} strokeWidth={6}/>)}
      <text x={430} y={800} textAnchor="middle" fontFamily={MONO} fontSize={26} letterSpacing={3} fill={C.mute}>INSIDE</text>
      <text x={800} y={800} textAnchor="middle" fontFamily={MONO} fontSize={26} letterSpacing={3} fill={C.mute}>BACK</text>
      <rect x={250} y={1380} width={90} height={180} rx={14} fill="#FFFFFF" stroke={C.ink} strokeWidth={5}/><rect x={250} y={1380} width={90} height={40} fill={C.accent}/>
      <circle cx={420} cy={1510} r={48} fill={HOT} stroke={C.ink} strokeWidth={5}/><path d="M 410 1462 q 10 -16 24 -6" stroke="#4E8B3A" strokeWidth={6} fill="none"/>
      <rect x={490} y={1450} width={140} height={110} rx={16} fill="#9FD18B" stroke={C.ink} strokeWidth={5}/>
      <rect x={260} y={1200} width={120} height={120} rx={14} fill="#F6D06B" stroke={C.ink} strokeWidth={5}/>
      <polyline points={LOOP.map((q) => q.join(",")).join(" ")} fill="none" stroke={C.line} strokeWidth={18} strokeLinejoin="round"/>
      <polyline points={LOOP.slice(0, 7).map((q) => q.join(",")).join(" ")} fill="none" stroke={ICE_D} strokeWidth={18} strokeLinejoin="round" opacity={hi(1)}/>
      {(step === 1 || step === 4) && <polyline points={LOOP.slice(0, 6).map((q) => q.join(",")).join(" ")} fill="none" stroke="#DFF2FC" strokeWidth={36} strokeLinejoin="round" opacity={0.4 + 0.3 * pulse}/>}
      <polyline points={LOOP.slice(7, 20).map((q) => q.join(",")).join(" ")} fill="none" stroke={WARM} strokeWidth={18} strokeLinejoin="round" opacity={hi(3)}/>
      {(step === 3 || step === 4) && <polyline points={LOOP.slice(8, 20).map((q) => q.join(",")).join(" ")} fill="none" stroke={WARM} strokeWidth={40} strokeLinejoin="round" opacity={0.15 + 0.2 * pulse}/>}
      <g transform={`translate(730,1500) scale(${step === 2 ? 1 + 0.08 * pulse : 1})`} opacity={0.45 + 0.55 * hi(2)}>
        <circle r={62} fill={C.ink2} stroke={C.ink} strokeWidth={6}/>
        <g transform={`rotate(${t * 240})`}>{[0, 120, 240].map((a) => <path key={a} transform={`rotate(${a})`} d="M 0 -6 Q 18 -40 4 -48 Q -14 -40 -6 -6 Z" fill="#C9CDD3"/>)}<circle r={9} fill="#C9CDD3"/></g>
      </g>
      <text x={730} y={1610} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={24} letterSpacing={2} fill={C.ink} opacity={hi(2)}>PUMP</text>
      {Array.from({length: 16}).map((_, k) => {
        const [x, y, i] = at(t * 0.12 + k / 16); const hot = i >= 6 && i < 20;
        return <g key={k}><circle cx={x} cy={y} r={20} fill={hot ? HOT : C.accent} opacity={0.18}/><circle cx={x} cy={y} r={11} fill={hot ? HOT : C.accent} stroke={C.white} strokeWidth={3}/></g>;
      })}
      {(step === 1 || step === 4) && [300, 420, 560].map((x, k) => {
        const ph = (t * 0.7 + k / 3) % 1;
        return <g key={x} opacity={1 - ph}><path d={`M ${x} ${1440 - ph * 400} q 16 -18 0 -36 q -16 -18 0 -36`} fill="none" stroke={HOT} strokeWidth={7}/><circle cx={x} cy={1440 - ph * 400 - 80} r={9} fill={HOT}/></g>;
      })}
      {(step === 3 || step === 4) && [0, 1, 2].map((k) => {
        const ph = (t * 0.7 + k / 3) % 1;
        return <path key={k} d={`M ${870 + ph * 110} ${980 + k * 200} q 16 -14 32 0 q 16 14 32 0`} fill="none" stroke={HOT} strokeWidth={8} opacity={1 - ph}/>;
      })}
    </svg>
  );
};

/** a rocking boat full of "heat" water, a bucket scooping it over the side, splashes, waves */
export const BucketBoat: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => {
  const ph = (t * 0.8) % 1, ang = -20 + 110 * Math.sin(Math.min(1, ph * 1.4) * Math.PI), rock = Math.sin(t * 1.8) * 3;
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
      <path d={wave(1440, 14, 60, t * 2, 80, 940, 1540)} fill={SEA} opacity={0.5}/>
      <g transform={`rotate(${rock} 480 1300)`}>
        <path d="M 180 1170 L 780 1170 L 715 1390 L 245 1390 Z" fill="#B07A50" stroke={C.ink} strokeWidth={7}/>
        <path d="M 180 1170 L 780 1170" stroke="#8A5A3C" strokeWidth={14}/>
        <path d={`M 215 1290 Q 480 ${1280 + Math.sin(t * 3) * 10} 745 1290 L 718 1375 L 242 1375 Z`} fill="#8CC6E6"/>
        <text x={480} y={1350} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={32} letterSpacing={4} fill={HOT}>HEAT</text>
        <g transform={`translate(700,1240) rotate(${ang})`}>
          <line x1={0} y1={0} x2={0} y2={-130} stroke={C.ink} strokeWidth={9}/>
          <path d="M -44 -130 L 44 -130 L 32 -205 L -32 -205 Z" fill={C.ink2} stroke={C.ink} strokeWidth={5}/>
        </g>
      </g>
      {ph > 0.38 && ph < 0.8 && Array.from({length: 6}).map((_, k) => <circle key={k} cx={790 + k * 18 + (ph - 0.38) * 80} cy={1160 + (ph - 0.38) * 560 + (k % 2) * 24} r={11 - k} fill="#8CC6E6"/>)}
      <path d={wave(1470, 16, 80, -t * 2.4, 80, 940, 1540)} fill={SEA_D} opacity={0.6}/>
      <text x={480} y={1090} textAnchor="middle" fontFamily={MONO} fontSize={26} letterSpacing={4} fill={C.mute}>ANALOGY</text>
    </svg>
  );
};

/** back of the fridge: coils pulse warm, heat shimmers up */
export const WarmBack: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => {
  const pulse = 0.5 + 0.5 * Math.sin(t * 4);
  const coil = "380,860 700,860 700,940 380,940 380,1020 700,1020 700,1100 380,1100 380,1180 700,1180 700,1260 380,1260 380,1340 700,1340";
  return (
    <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o * p}}>
      <defs><radialGradient id="wg"><stop offset="0" stopColor={WARM} stopOpacity="0.45"/><stop offset="1" stopColor={WARM} stopOpacity="0"/></radialGradient></defs>
      <circle cx={540} cy={1120} r={420} fill="url(#wg)" opacity={0.6 + 0.4 * pulse}/>
      <rect x={300} y={760} width={480} height={800} rx={36} fill="#E9E3D9" stroke={C.ink} strokeWidth={8}/>
      <polyline points={coil} fill="none" stroke={WARM} strokeWidth={30} strokeLinejoin="round" opacity={0.2 + 0.25 * pulse}/>
      <polyline points={coil} fill="none" stroke={WARM} strokeWidth={14} strokeLinejoin="round"/>
      <g transform="translate(540,1450)"><circle r={62} fill={C.ink2}/><g transform={`rotate(${t * 240})`}>{[0, 120, 240].map((a) => <path key={a} transform={`rotate(${a})`} d="M 0 -6 Q 18 -40 4 -48 Q -14 -40 -6 -6 Z" fill="#C9CDD3"/>)}<circle r={9} fill="#C9CDD3"/></g></g>
      {[380, 480, 600, 700].map((x, k) => { const ph = (t * 0.6 + k / 4) % 1; return <path key={x} d={`M ${x} ${840 - ph * 220} q 20 -22 0 -44 q -20 -22 0 -44`} fill="none" stroke={HOT} strokeWidth={8} opacity={1 - ph}/>; })}
    </svg>
  );
};
