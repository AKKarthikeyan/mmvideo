// Rich, moving art for No. 005 "The Chocolate Bar That Invented the Microwave" (24 Oct 2026). AK: "make the visuals richer".
// Every scene is layered: a back plate (wall, sky, counter), the main drawing, secondary motion (steam, sparks, waves,
// drips, popcorn physics) and small detail (dials, rivets, labels). All drawn in code, page coordinates 1080 x 1920.
import React from "react";
import {C, HEAD, MONO, W, interpolateColor} from "../kit";

const CHOC = "#6B3E26", CHOC_L = "#8A5436", CHOC_D = "#4A2A19", FOIL = "#C8CDD3", STEEL = "#AEB6BF", STEEL_D = "#6E7782";
const WARM = "#F2A03D", HOT = "#E8563A", GLOW = "#FFE9A8", WALL = "#E7E0D3", COAT = "#F7F5F0", BLUEPRINT = "#D7E3EE";
const Page: React.FC<{o?: number; children: React.ReactNode}> = ({o = 1, children}) => (
  <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: o, overflow: "visible"}}>{children}</svg>
);
const Sparkle: React.FC<{x: number; y: number; t: number; s?: number; c?: string}> = ({x, y, t, s = 1, c = "#fff"}) => {
  const k = (Math.sin(t * 5 + x * 0.7) + 1) / 2;
  return <path d={`M ${x} ${y - 16 * s * k} L ${x + 4 * s} ${y} L ${x} ${y + 16 * s * k} L ${x - 4 * s} ${y} Z M ${x - 16 * s * k} ${y} L ${x} ${y + 4 * s} L ${x + 16 * s * k} ${y} L ${x} ${y - 4 * s} Z`} fill={c} opacity={0.35 + 0.65 * k}/>;
};
/** rising steam wisps */
const Steam: React.FC<{x: number; y: number; t: number; n?: number; h?: number; o?: number}> = ({x, y, t, n = 3, h = 180, o = 0.5}) => (
  <g>{Array.from({length: n}).map((_, k) => {
    const ph = (t * 0.5 + k / n) % 1, xx = x + (k - (n - 1) / 2) * 34;
    return <path key={k} d={`M ${xx} ${y - ph * h} q 18 -24 0 -48 q -18 -24 0 -48`} fill="none" stroke={C.ink2} strokeWidth={5} strokeLinecap="round" opacity={o * Math.sin(ph * Math.PI)}/>;
  })}</g>
);
/** expanding wave arcs from a point, travelling in direction `dir` (radians) */
const Arcs: React.FC<{x: number; y: number; t: number; dir?: number; n?: number; r?: number; color?: string; w?: number}> = ({x, y, t, dir = 0, n = 4, r = 260, color = C.accent, w = 6}) => (
  <g transform={`translate(${x},${y}) rotate(${(dir * 180) / Math.PI})`}>{Array.from({length: n}).map((_, k) => {
    const ph = (t * 0.9 + k / n) % 1, rr = 20 + ph * r;
    return <path key={k} d={`M ${rr * Math.cos(-0.6)} ${rr * Math.sin(-0.6)} A ${rr} ${rr} 0 0 1 ${rr * Math.cos(0.6)} ${rr * Math.sin(0.6)}`} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" opacity={1 - ph}/>;
  })}</g>
);
/** a 1940s engineer: lab coat, glasses, tie; `look` turns the head toward his pocket; `melt` drips the chocolate bar in his breast pocket */
export const Engineer: React.FC<{x: number; y: number; s?: number; t: number; melt?: number; look?: number}> = ({x, y, s = 1, t, melt = 0, look = 0}) => {
  const bob = Math.sin(t * 1.6) * 2;
  return (
    <g transform={`translate(${x},${y + bob}) scale(${s})`}>
      <path d="M -70 300 L -55 560 L -20 560 L -10 330 L 10 330 L 20 560 L 55 560 L 70 300 Z" fill="#4A4F5C" stroke={C.ink} strokeWidth={5}/>
      <path d="M -110 90 Q -120 60 -80 40 L 80 40 Q 120 60 110 90 L 120 330 L -120 330 Z" fill={COAT} stroke={C.ink} strokeWidth={6}/>
      <path d="M -24 40 L 0 120 L 24 40" fill="#D9D3C7" stroke={C.ink} strokeWidth={4}/>
      <path d="M -8 60 L 8 60 L 12 140 L 0 160 L -12 140 Z" fill={C.accent} stroke={C.ink} strokeWidth={3}/>
      <line x1={0} y1={120} x2={0} y2={330} stroke={C.ink2} strokeWidth={3}/>
      {/* breast pocket with the chocolate bar */}
      <rect x={30} y={120} width={64} height={60} rx={6} fill={COAT} stroke={C.ink} strokeWidth={4}/>
      <rect x={40} y={92 + 10 * melt} width={44} height={44 - 14 * melt} rx={3} fill={CHOC} stroke={CHOC_D} strokeWidth={3}/>
      <rect x={40} y={118} width={44} height={14} fill={FOIL} opacity={1 - melt * 0.6}/>
      {melt > 0.05 && [0, 1, 2].map((k) => { const ph = (t * 0.8 + k / 3) % 1; return <path key={k} d={`M ${48 + k * 14} ${180 + ph * 70 * melt} q 6 10 0 16 q -6 -6 0 -16`} fill={CHOC} opacity={melt * (1 - ph)}/>; })}
      {melt > 0.05 && <path d={`M 34 180 Q 62 ${180 + 40 * melt} 90 180`} fill={CHOC} opacity={0.85 * melt}/>}
      <path d="M -110 100 Q -150 220 -120 320 M 110 100 Q 150 220 130 300" fill="none" stroke={C.ink} strokeWidth={6}/>
      <circle cx={-118} cy={326} r={16} fill="#F1D3B5" stroke={C.ink} strokeWidth={4}/><circle cx={132} cy={306} r={16} fill="#F1D3B5" stroke={C.ink} strokeWidth={4}/>
      <g transform={`rotate(${look * 18}, 0, -20)`}>
        <rect x={-14} y={0} width={28} height={40} fill="#F1D3B5" stroke={C.ink} strokeWidth={4}/>
        <ellipse cx={0} cy={-50} rx={58} ry={66} fill="#F1D3B5" stroke={C.ink} strokeWidth={6}/>
        <path d="M -58 -70 Q -40 -128 10 -118 Q 60 -110 58 -66 Q 30 -96 -58 -70 Z" fill="#7A5A3A" stroke={C.ink} strokeWidth={4}/>
        <circle cx={-22} cy={-50} r={16} fill="none" stroke={C.ink} strokeWidth={4}/><circle cx={22} cy={-50} r={16} fill="none" stroke={C.ink} strokeWidth={4}/>
        <line x1={-6} y1={-50} x2={6} y2={-50} stroke={C.ink} strokeWidth={4}/>
        <circle cx={-22 + 4 * look} cy={-46 + 6 * look} r={4} fill={C.ink}/><circle cx={22 + 4 * look} cy={-46 + 6 * look} r={4} fill={C.ink}/>
        <path d={look > 0.5 ? "M -12 -8 Q 0 -2 12 -8" : "M -14 -12 Q 0 -4 14 -12"} fill="none" stroke={C.ink} strokeWidth={4} strokeLinecap="round"/>
        <path d="M 30 -30 q 10 4 14 14" fill="none" stroke={C.ink2} strokeWidth={3} opacity={look}/>
      </g>
    </g>
  );
};

/** b01: a 1940s lab: blueprint wall, wall clock, the radar cabinet with a glowing magnetron window and waves, the engineer */
export const LabScene: React.FC<{p: number; t: number; melt: number; look: number; o?: number}> = ({p, t, melt, look, o = 1}) => (
  <Page o={o * p}>
    <rect x={90} y={780} width={900} height={720} rx={24} fill={WALL}/>
    {Array.from({length: 9}).map((_, k) => <line key={`v${k}`} x1={640 + k * 40} y1={800} x2={640 + k * 40} y2={1000} stroke={BLUEPRINT} strokeWidth={2}/>)}
    {Array.from({length: 6}).map((_, k) => <line key={`h${k}`} x1={640} y1={800 + k * 40} x2={960} y2={800 + k * 40} stroke={BLUEPRINT} strokeWidth={2}/>)}
    <rect x={640} y={800} width={320} height={200} fill="none" stroke="#9DB6CC" strokeWidth={4}/>
    <path d="M 670 960 L 720 880 L 780 930 L 840 840 L 930 900" fill="none" stroke="#5E86AD" strokeWidth={4}/>
    <circle cx={200} cy={870} r={56} fill={C.white} stroke={C.ink} strokeWidth={5}/>
    <line x1={200} y1={870} x2={200 + Math.sin(t * 0.8) * 40} y2={870 - Math.cos(t * 0.8) * 40} stroke={C.ink} strokeWidth={4}/>
    <line x1={200} y1={870} x2={226} y2={884} stroke={C.ink} strokeWidth={6}/>
    <rect x={90} y={1480} width={900} height={20} fill="#B9AE9C"/>
    {/* the radar cabinet */}
    <g transform="translate(560,1000)">
      <rect x={0} y={0} width={380} height={500} rx={14} fill={STEEL} stroke={C.ink} strokeWidth={6}/>
      <rect x={20} y={20} width={340} height={120} rx={8} fill={STEEL_D}/>
      {[0, 1, 2].map((k) => <g key={k} transform={`translate(${80 + k * 110},80)`}><circle r={34} fill="#F5F1E8" stroke={C.ink} strokeWidth={4}/><line x1={0} y1={0} x2={Math.cos(t * (1 + k * 0.7) + k) * 26} y2={Math.sin(t * (1 + k * 0.7) + k) * 26} stroke={HOT} strokeWidth={4}/></g>)}
      <rect x={60} y={180} width={260} height={180} rx={20} fill={C.night} stroke={C.ink} strokeWidth={5}/>
      <circle cx={190} cy={270} r={60} fill={GLOW} opacity={0.35 + 0.25 * Math.sin(t * 9)}/>
      <circle cx={190} cy={270} r={34} fill="#FFD27A"/>
      {Array.from({length: 8}).map((_, k) => { const a = (k / 8) * Math.PI * 2; return <circle key={k} cx={190 + Math.cos(a) * 50} cy={270 + Math.sin(a) * 50} r={9} fill={C.night} stroke="#FFD27A" strokeWidth={2}/>; })}
      {Array.from({length: 10}).map((_, k) => <circle key={k} cx={20 + k * 38} cy={400} r={6} fill={STEEL_D}/>)}
      <rect x={30} y={430} width={320} height={40} rx={6} fill={STEEL_D}/>
      <text x={190} y={458} textAnchor="middle" fontFamily={MONO} fontSize={22} letterSpacing={3} fill="#E9EDF1">MAGNETRON</text>
    </g>
    <Arcs x={560} y={1270} t={t} dir={Math.PI} r={240} color={C.accent} w={5}/>
    <Engineer x={330} y={1010} s={0.82} t={t} melt={melt} look={look}/>
  </Page>
);

/** b02: a kitchen counter with a modern microwave: glowing window, turning plate, steam, and a crossed-out flame */
export const KitchenMicrowave: React.FC<{p: number; t: number; o?: number; ding?: number}> = ({p, t, o = 1, ding = 0}) => (
  <Page o={o * p}>
    <rect x={60} y={1360} width={960} height={40} rx={8} fill="#C9B79C" stroke={C.ink} strokeWidth={5}/>
    <rect x={90} y={1400} width={900} height={140} fill="#E3D6C1" stroke={C.ink} strokeWidth={5}/>
    {[0, 1, 2].map((k) => <rect key={k} x={110 + k * 300} y={1420} width={280} height={100} rx={8} fill="none" stroke={C.ink2} strokeWidth={4}/>)}
    {[0, 1, 2].map((k) => <circle key={k} cx={250 + k * 300} cy={1470} r={8} fill={C.ink2}/>)}
    <rect x={200} y={940} width={680} height={420} rx={30} fill="#F3F4F6" stroke={C.ink} strokeWidth={7}/>
    <rect x={240} y={980} width={460} height={340} rx={18} fill="#2B2E35" stroke={C.ink} strokeWidth={5}/>
    <rect x={250} y={990} width={440} height={320} rx={14} fill={GLOW} opacity={0.45 + 0.1 * Math.sin(t * 6)}/>
    <ellipse cx={470} cy={1270} rx={170} ry={26} fill="#E9F1F7" opacity={0.8}/>
    <g transform={`translate(470,1225)`}>
      <path d="M -80 0 Q -80 50 0 50 Q 80 50 80 0 Z" fill="#F2D49B" stroke={C.ink} strokeWidth={4}/>
      <ellipse rx={80} ry={14} fill="#F7E3B8" stroke={C.ink} strokeWidth={4}/>
      <rect x={-60 + ((t * 40) % 120)} y={-4} width={14} height={8} rx={3} fill="#E8B04A" opacity={0.7}/>
    </g>
    <Steam x={470} y={1200} t={t} n={3} h={150} o={0.45}/>
    <rect x={720} y={980} width={130} height={340} rx={10} fill="#E3E6EA" stroke={C.ink} strokeWidth={4}/>
    <rect x={740} y={1000} width={90} height={44} rx={6} fill="#1F2A1F"/>
    <text x={785} y={1031} textAnchor="middle" fontFamily={MONO} fontSize={26} fill="#7CFF8A">{ding > 0.5 ? "END" : `0:${String(30 - (Math.floor(t) % 30)).padStart(2, "0")}`}</text>
    {Array.from({length: 9}).map((_, k) => <rect key={k} x={745 + (k % 3) * 28} y={1070 + Math.floor(k / 3) * 34} width={20} height={22} rx={4} fill="#C7CDD4"/>)}
    <rect x={745} y={1190} width={80} height={36} rx={8} fill={C.accent}/>
    <g transform="translate(920,860)"><path d="M 0 40 Q -36 0 0 -56 Q 8 -18 26 -36 Q 56 8 0 40 Z" fill={WARM} stroke={C.ink} strokeWidth={4}/><line x1={-50} y1={-60} x2={50} y2={50} stroke={HOT} strokeWidth={10} strokeLinecap="round"/></g>
    {ding > 0 && <Sparkle x={860} y={950} t={t} s={1.6} c={C.accent}/>}
  </Page>
);

/** b03: a weaving mill (sawtooth roof, chimney smoke) and a boy reading by a lamp, his stack of books growing */
export const MillBooks: React.FC<{p: number; t: number; books: number; o?: number}> = ({p, t, books, o = 1}) => (
  <Page o={o * p}>
    <rect x={80} y={1440} width={920} height={8} fill={C.ink}/>
    <g transform="translate(110,1100)">
      <path d="M 0 340 L 0 120 L 70 60 L 70 120 L 140 60 L 140 120 L 210 60 L 210 120 L 280 60 L 280 340 Z" fill="#C98A6A" stroke={C.ink} strokeWidth={5}/>
      <rect x={300} y={-40} width={50} height={380} fill="#A8694B" stroke={C.ink} strokeWidth={5}/>
      {[0, 1, 2, 3].map((k) => { const ph = (t * 0.35 + k / 4) % 1; return <circle key={k} cx={325 + ph * 70 + Math.sin(t + k) * 10} cy={-60 - ph * 220} r={20 + ph * 40} fill={C.ink2} opacity={0.22 * (1 - ph)}/>; })}
      {Array.from({length: 8}).map((_, k) => <rect key={k} x={20 + (k % 4) * 64} y={170 + Math.floor(k / 4) * 80} width={44} height={50} fill={GLOW} opacity={0.6 + 0.3 * Math.sin(t * 2 + k)} stroke={C.ink} strokeWidth={3}/>)}
      <text x={175} y={400} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={3} fill={C.ink2}>THE MILL</text>
    </g>
    <g transform="translate(700,1060)">
      <path d="M 120 -20 L 160 -120 L 200 -20 Z" fill={WARM} stroke={C.ink} strokeWidth={4}/>
      <line x1={160} y1={-20} x2={160} y2={260} stroke={C.ink} strokeWidth={6}/>
      <ellipse cx={160} cy={-30} rx={120} ry={60} fill={GLOW} opacity={0.35 + 0.1 * Math.sin(t * 7)}/>
      <ellipse cx={0} cy={60} rx={44} ry={50} fill="#F1D3B5" stroke={C.ink} strokeWidth={5}/>
      <path d="M -44 40 Q -30 0 10 6 Q 44 12 44 50 Q 20 26 -44 40 Z" fill="#8A6A44" stroke={C.ink} strokeWidth={4}/>
      <path d="M -60 110 Q 0 90 60 110 L 70 260 L -70 260 Z" fill="#6D7FA0" stroke={C.ink} strokeWidth={5}/>
      <g transform={`rotate(${Math.sin(t * 0.7) * 3}, 0, 160)`}><path d="M -70 150 L 0 170 L 70 150 L 70 210 L 0 230 L -70 210 Z" fill={C.white} stroke={C.ink} strokeWidth={4}/><line x1={0} y1={170} x2={0} y2={230} stroke={C.ink} strokeWidth={3}/></g>
      {Array.from({length: Math.round(8 * books)}).map((_, k) => <rect key={k} x={-210 + (k % 2) * 6} y={360 - k * 26} width={120} height={22} rx={3} fill={["#B9452F", "#2F6FB9", "#3F8F55", "#C9A24A"][k % 4]} stroke={C.ink} strokeWidth={3}/>)}
    </g>
  </Page>
);

/** b04: night radar: a dish sweeping, pulses out to a plane; an inset cutaway of the magnetron */
export const RadarScene: React.FC<{p: number; t: number; inset: number; o?: number}> = ({p, t, inset, o = 1}) => {
  const sweep = Math.sin(t * 0.9) * 0.5, px = 820 - ((t * 60) % 300), ping = (t * 0.8) % 1;
  return (
    <Page o={o * p}>
      <rect x={60} y={760} width={960} height={760} rx={24} fill="#1C2333"/>
      {Array.from({length: 26}).map((_, k) => <circle key={k} cx={90 + ((k * 137) % 900)} cy={790 + ((k * 71) % 380)} r={k % 3 ? 2 : 3} fill="#fff" opacity={0.3 + 0.4 * Math.abs(Math.sin(t + k))}/>)}
      <path d="M 60 1420 Q 300 1360 540 1400 Q 800 1440 1020 1380 L 1020 1520 L 60 1520 Z" fill="#2B3446"/>
      <g transform={`translate(${px},950)`}>
        <path d="M -60 0 L 60 0 L 80 -8 L 60 -14 L -40 -14 Z" fill="#AEB6BF" stroke="#fff" strokeWidth={2}/>
        <path d="M -10 -14 L 20 -50 L 34 -50 L 24 -14 Z M -10 0 L 20 34 L 34 34 L 24 0 Z" fill="#AEB6BF"/>
        <circle r={60 * ping} fill="none" stroke="#7CFF8A" strokeWidth={3} opacity={1 - ping}/>
      </g>
      <g transform={`translate(260,1360) rotate(${sweep * 30 - 40})`}>
        <path d="M -90 -40 Q 0 40 90 -40" fill="none" stroke="#DDE3EA" strokeWidth={10}/>
        <line x1={0} y1={0} x2={0} y2={-70} stroke="#DDE3EA" strokeWidth={6}/>
      </g>
      <rect x={240} y={1360} width={40} height={80} fill="#DDE3EA"/>
      <Arcs x={290} y={1300} t={t} dir={-0.75} n={4} r={420} color="#7CFF8A" w={5}/>
      <g transform="translate(800,1260)" opacity={inset}>
        <circle r={150} fill="#F5F1E8" stroke={C.ink} strokeWidth={6}/>
        <circle r={110} fill="#C47A3C" stroke={C.ink} strokeWidth={5}/>
        {Array.from({length: 8}).map((_, k) => { const a = (k / 8) * Math.PI * 2; return <g key={k}><circle cx={Math.cos(a) * 72} cy={Math.sin(a) * 72} r={20} fill="#F5F1E8" stroke={C.ink} strokeWidth={4}/><line x1={Math.cos(a) * 30} y1={Math.sin(a) * 30} x2={Math.cos(a) * 52} y2={Math.sin(a) * 52} stroke="#F5F1E8" strokeWidth={8}/></g>; })}
        <circle r={30} fill="#F5F1E8" stroke={C.ink} strokeWidth={4}/>
        <circle r={14} fill={GLOW} opacity={0.6 + 0.4 * Math.sin(t * 10)}/>
        <text y={190} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={3} fill="#E9EDF1">MAGNETRON · INSIDE</text>
      </g>
    </Page>
  );
};

/** b05: kernels held near the machine's horn pop one by one into popcorn that flies and tumbles */
export const Popcorn: React.FC<{p: number; t: number; pop: number; o?: number}> = ({p, t, pop, o = 1}) => {
  const N = 14;
  return (
    <Page o={o * p}>
      <rect x={60} y={1400} width={960} height={20} fill="#B9AE9C"/>
      <g transform="translate(110,1060)">
        <rect x={0} y={0} width={240} height={340} rx={12} fill={STEEL} stroke={C.ink} strokeWidth={6}/>
        <path d="M 240 120 L 360 80 L 360 260 L 240 220 Z" fill={STEEL_D} stroke={C.ink} strokeWidth={6}/>
        <circle cx={120} cy={100} r={40} fill={C.night}/><circle cx={120} cy={100} r={20} fill={GLOW} opacity={0.5 + 0.4 * Math.sin(t * 9)}/>
      </g>
      <Arcs x={470} y={1230} t={t} dir={0} n={4} r={220} color={C.accent} w={5}/>
      <g transform="translate(720,1240)">
        <path d="M -110 -60 L 110 -60 L 80 160 L -80 160 Z" fill="#F4EFE6" stroke={C.ink} strokeWidth={6}/>
        {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={-96 + k * 44} y={-60} width={22} height={220} fill={HOT} opacity={0.8} transform={`skewX(${-6 + k * 3})`}/>)}
        {Array.from({length: N}).map((_, k) => {
          const born = k / N, q = Math.max(0, Math.min(1, (pop - born) * 3)), seed = Math.sin(k * 12.9) * 0.5 + 0.5;
          const ang = -Math.PI / 2 + (seed - 0.5) * 1.6, vx = Math.cos(ang) * 260, vy = Math.sin(ang) * 420;
          const x = vx * q, y = -40 + vy * q + 520 * q * q, rot = q * 400 * (seed - 0.5);
          return q <= 0
            ? <ellipse key={k} cx={-60 + (k % 5) * 30} cy={-50 + Math.floor(k / 5) * 12} rx={10} ry={13} fill="#E8B04A" stroke={C.ink} strokeWidth={2}/>
            : <g key={k} transform={`translate(${x},${y}) rotate(${rot})`}>
                {[0, 1, 2, 3].map((i) => <circle key={i} cx={Math.cos(i * 1.6) * 12} cy={Math.sin(i * 1.6) * 12} r={16} fill="#FFF6DA" stroke={C.ink} strokeWidth={3}/>)}
                <circle r={10} fill="#E8B04A" opacity={0.6}/>
                {q < 0.25 && <Sparkle x={0} y={0} t={t + k} s={2} c={WARM}/>}
              </g>;
        })}
      </g>
    </Page>
  );
};

/** b06: the 1947 Radarange next to a person and a modern microwave, with a height line */
export const Radarange: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => (
  <Page o={o * p}>
    <rect x={60} y={1500} width={960} height={10} fill={C.ink}/>
    <g transform="translate(160,780)">
      <rect x={0} y={0} width={300} height={720} rx={16} fill="#C9CED4" stroke={C.ink} strokeWidth={7}/>
      <rect x={30} y={40} width={240} height={60} rx={8} fill="#8C96A1"/>
      {[0, 1, 2].map((k) => <circle key={k} cx={80 + k * 70} cy={70} r={18} fill="#F5F1E8" stroke={C.ink} strokeWidth={3}/>)}
      <rect x={40} y={140} width={220} height={200} rx={12} fill="#2B2E35" stroke={C.ink} strokeWidth={5}/>
      <rect x={50} y={150} width={200} height={180} rx={10} fill={GLOW} opacity={0.35 + 0.1 * Math.sin(t * 5)}/>
      {Array.from({length: 5}).map((_, k) => <rect key={k} x={40} y={380 + k * 60} width={220} height={40} rx={6} fill="#B3BAC2" stroke={C.ink2} strokeWidth={3}/>)}
      <text x={150} y={-20} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={3} fill={C.ink}>1947</text>
    </g>
    <g transform="translate(560,1500)">
      <circle cy={-560} r={44} fill="#F1D3B5" stroke={C.ink} strokeWidth={5}/>
      <path d="M -50 -500 L 50 -500 L 60 -260 L 30 -260 L 26 0 L 4 0 L 0 -240 L -4 0 L -26 0 L -30 -260 L -60 -260 Z" fill="#6D7FA0" stroke={C.ink} strokeWidth={5}/>
    </g>
    <line x1={500} y1={780} x2={500} y2={1500} stroke={C.ink} strokeWidth={3} strokeDasharray="10 10"/>
    <g transform="translate(720,1330)">
      <rect x={0} y={0} width={240} height={150} rx={14} fill="#F3F4F6" stroke={C.ink} strokeWidth={5}/>
      <rect x={16} y={18} width={150} height={114} rx={8} fill="#2B2E35"/>
      <rect x={180} y={20} width={44} height={110} rx={6} fill="#E3E6EA"/>
      <text x={120} y={-20} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={3} fill={C.ink}>TODAY</text>
    </g>
  </Page>
);

/** b07: the wave strip: long radio waves → short microwaves → light, with the microwave band lit */
export const WaveStrip: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => {
  const band = (y: number, len: number, amp: number, col: string, label: string, hi: boolean) => {
    const pts: string[] = []; for (let x = 120; x <= 960 * Math.min(1, p * 1.4) + 1; x += 6) pts.push(`${x},${y + amp * Math.sin((x - t * 220) / len)}`);
    return (
      <g>
        {hi && <rect x={90} y={y - amp - 40} width={900} height={amp * 2 + 80} rx={20} fill={C.accent} opacity={0.1}/>}
        <polyline points={pts.join(" ")} fill="none" stroke={col} strokeWidth={hi ? 9 : 6}/>
        <text x={120} y={y - amp - 14} fontFamily={MONO} fontSize={26} fontWeight={600} letterSpacing={3} fill={hi ? C.accent : C.ink2}>{label}</text>
      </g>
    );
  };
  return (
    <Page o={o}>
      {band(900, 90, 60, C.ink2, "RADIO · long waves", false)}
      {band(1160, 22, 60, C.accent, "MICROWAVES · about 12 cm", true)}
      {band(1400, 4, 30, WARM, "LIGHT · tiny waves", false)}
    </Page>
  );
};

/** water molecule: a big O with two Hs; + and − ends */
const Molecule: React.FC<{x: number; y: number; a: number; s?: number; heat?: number}> = ({x, y, a, s = 1, heat = 0}) => (
  <g transform={`translate(${x},${y}) rotate(${a}) scale(${s})`}>
    <line x1={0} y1={0} x2={-34} y2={30} stroke={C.ink} strokeWidth={6}/><line x1={0} y1={0} x2={34} y2={30} stroke={C.ink} strokeWidth={6}/>
    <circle r={32} fill={interpolateColor(heat, "#5FA8D3", HOT)} stroke={C.ink} strokeWidth={4}/>
    <circle cx={-38} cy={34} r={18} fill={C.white} stroke={C.ink} strokeWidth={4}/><circle cx={38} cy={34} r={18} fill={C.white} stroke={C.ink} strokeWidth={4}/>
    <text x={0} y={-42} textAnchor="middle" fontFamily={HEAD} fontSize={30} fill={C.ink}>−</text>
    <text x={0} y={86} textAnchor="middle" fontFamily={HEAD} fontSize={30} fill={C.ink}>+</text>
  </g>
);
/** b08: one big water molecule, labelled */
export const OneMolecule: React.FC<{p: number; t: number; o?: number}> = ({p, t, o = 1}) => (
  <Page o={o * p}>
    <circle cx={540} cy={1140} r={300} fill="#EAF4FA"/>
    {Array.from({length: 10}).map((_, k) => { const a = k * 0.63 + t * 0.2; return <circle key={k} cx={540 + Math.cos(a) * 260} cy={1140 + Math.sin(a) * 260} r={10} fill="#5FA8D3" opacity={0.4}/>; })}
    <Molecule x={540} y={1110} a={Math.sin(t * 1.2) * 6} s={3}/>
    <text x={540} y={1490} textAnchor="middle" fontFamily={MONO} fontSize={26} letterSpacing={3} fill={C.ink2}>ONE WATER MOLECULE</text>
  </Page>
);
/** b09: a field of water molecules flipping back and forth faster and faster, warming, with heat shimmer rising */
export const MoleculeField: React.FC<{p: number; t: number; flip: number; o?: number}> = ({p, t, flip, o = 1}) => (
  <Page o={o * p}>
    <rect x={90} y={840} width={900} height={620} rx={30} fill="#EAF4FA"/>
    {Array.from({length: 20}).map((_, k) => {
      const c = k % 5, r = Math.floor(k / 5), f = 2 + flip * 18;
      return <Molecule key={k} x={190 + c * 175} y={930 + r * 150} a={Math.sin(t * f + k * 0.4) * 80 * flip} s={0.85} heat={flip}/>;
    })}
    {flip > 0.2 && Array.from({length: 6}).map((_, k) => { const ph = (t * 0.7 + k / 6) % 1; return <path key={k} d={`M ${190 + k * 150} ${860 - ph * 140} q 20 -20 0 -40 q -20 -20 0 -40`} fill="none" stroke={HOT} strokeWidth={5} opacity={flip * Math.sin(ph * Math.PI) * 0.7}/>; })}
  </Page>
);

/** b10: a potato cut in half: a thin outer band heats first (microwaves), then the heat creeps inward (conduction) */
export const PotatoCut: React.FC<{p: number; t: number; heat: number; o?: number}> = ({p, t, heat, o = 1}) => (
  <Page o={o * p}>
    <ellipse cx={540} cy={1160} rx={330} ry={250} fill="#B88A55" stroke={C.ink} strokeWidth={7}/>
    <ellipse cx={540} cy={1160} rx={300} ry={222} fill={interpolateColor(Math.min(1, heat * 1.4), "#F4E4B8", HOT)}/>
    <ellipse cx={540} cy={1160} rx={300 - 70 - 140 * heat} ry={222 - 52 - 104 * heat} fill="#F4E4B8"/>
    <ellipse cx={540} cy={1160} rx={(300 - 70 - 140 * heat) + 22} ry={(222 - 52 - 104 * heat) + 16} fill="none" stroke={WARM} strokeWidth={10} opacity={0.6}/>
    {Array.from({length: 8}).map((_, k) => { const a = (k / 8) * Math.PI * 2, ph = (t * 0.8 + k / 8) % 1; return <line key={k} x1={540 + Math.cos(a) * 440} y1={1160 + Math.sin(a) * 340} x2={540 + Math.cos(a) * (440 - 90 * ph)} y2={1160 + Math.sin(a) * (340 - 70 * ph)} stroke={C.accent} strokeWidth={6} strokeLinecap="round" opacity={1 - ph}/>; })}
    <text x={540} y={1168} textAnchor="middle" fontFamily={MONO} fontSize={21} letterSpacing={2} fill={C.ink2}>{heat > 0.6 ? "WARMING" : "STILL COOL"}</text>
    <text x={540} y={1480} textAnchor="middle" fontFamily={MONO} fontSize={26} letterSpacing={3} fill={C.accent}>WAVES HEAT ONLY THE OUTER FEW CM</text>
  </Page>
);

/** b11: inside the oven: hands lift the glass turntable out; a chocolate bar goes onto a plate */
export const TurntableOut: React.FC<{p: number; t: number; lift: number; bar: number; o?: number}> = ({p, t, lift, bar, o = 1}) => (
  <Page o={o * p}>
    <rect x={150} y={860} width={780} height={600} rx={30} fill="#3A3E47" stroke={C.ink} strokeWidth={7}/>
    <rect x={190} y={900} width={700} height={520} rx={18} fill="#F6F1E6"/>
    <rect x={190} y={900} width={700} height={520} rx={18} fill={GLOW} opacity={0.15}/>
    <g transform={`translate(540,${1330 - 380 * lift}) rotate(${lift * -8})`} opacity={1 - Math.max(0, lift - 0.8) * 5}>
      <ellipse rx={260} ry={40} fill="#DDEFF7" stroke={C.ink2} strokeWidth={5} opacity={0.9}/>
      <ellipse rx={200} ry={28} fill="none" stroke="#fff" strokeWidth={4}/>
      <g transform="translate(-280,-10)"><ellipse rx={46} ry={30} fill="#F1D3B5" stroke={C.ink} strokeWidth={4}/></g>
      <g transform="translate(280,-10)"><ellipse rx={46} ry={30} fill="#F1D3B5" stroke={C.ink} strokeWidth={4}/></g>
    </g>
    <g transform={`translate(540,${1360 - 40 * (1 - bar)})`} opacity={bar}>
      <ellipse rx={230} ry={34} fill={C.white} stroke={C.ink} strokeWidth={5}/>
      <rect x={-170} y={-40} width={340} height={44} rx={6} fill={CHOC} stroke={CHOC_D} strokeWidth={4}/>
      {Array.from({length: 6}).map((_, k) => <line key={k} x1={-170 + k * 57} y1={-40} x2={-170 + k * 57} y2={4} stroke={CHOC_D} strokeWidth={3}/>)}
    </g>
    <text x={540} y={1540} textAnchor="middle" fontFamily={MONO} fontSize={26} letterSpacing={3} fill={C.ink}>WITH A GROWN-UP · ~20 SECONDS</text>
  </Page>
);

/** b12 / b13: the chocolate bar from above with three melted spots; a ruler measures the gap */
export const ChocSpots: React.FC<{p: number; t: number; melt: number; ruler: number; o?: number}> = ({p, t, melt, ruler, o = 1}) => (
  <Page o={o * p}>
    <rect x={120} y={980} width={840} height={260} rx={20} fill={CHOC} stroke={CHOC_D} strokeWidth={8}/>
    {Array.from({length: 7}).map((_, k) => <line key={k} x1={120 + (k + 1) * 105} y1={980} x2={120 + (k + 1) * 105} y2={1240} stroke={CHOC_D} strokeWidth={5}/>)}
    <line x1={120} y1={1110} x2={960} y2={1110} stroke={CHOC_D} strokeWidth={5}/>
    {[300, 540, 780].map((x, k) => (
      <g key={k}>
        <ellipse cx={x} cy={1110} rx={80 * melt} ry={64 * melt} fill={CHOC_L}/>
        <ellipse cx={x - 14} cy={1098} rx={30 * melt} ry={18 * melt} fill="#B07650" opacity={0.8}/>
        {melt > 0.4 && <circle cx={x + 26} cy={1132} r={8 + 4 * Math.sin(t * 4 + k)} fill={CHOC_L} opacity={0.8}/>}
        {melt > 0.6 && <Steam x={x} y={1000} t={t + k} n={2} h={90} o={0.3}/>}
      </g>
    ))}
    <g opacity={ruler}>
      <rect x={300} y={1300} width={480 * Math.min(1, ruler * 1.2)} height={70} rx={8} fill="#F6E7B8" stroke={C.ink} strokeWidth={4}/>
      {Array.from({length: 25}).map((_, k) => k * 20 < 480 * ruler && <line key={k} x1={300 + k * 20} y1={1300} x2={300 + k * 20} y2={k % 5 ? 1322 : 1336} stroke={C.ink} strokeWidth={3}/>)}
      <path d="M 300 1270 L 300 1240 M 540 1270 L 540 1240" stroke={C.accent} strokeWidth={5}/>
      <text x={420} y={1430} textAnchor="middle" fontFamily={HEAD} fontSize={56} fill={C.accent}>~6 cm</text>
    </g>
  </Page>
);
