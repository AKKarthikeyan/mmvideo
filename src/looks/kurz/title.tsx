// KURZ look, "title" scene (cards builder, 29 Oct 2026): {kicker, title, sub?, steps?: {text, key}[]}.
// The film's title card: an egg-shaped planet rising over a Namakkal dawn (a granite rock hill with a small fort wall, long poultry sheds,
// palms, a country road with a lorry). Kicker, title and sub sit in the dark sky at the top left. Steps are roadside milestones that
// pop up one by one from at(key), 12 frames apart (several steps may share one key).
import React from "react";
import {AbsoluteFill} from "remotion";
import type {SceneProps} from "../cartoon/long/contract";
import {K, ROUND, SANS, easeIO} from "./kit";
import {EggPlanet, Grain, Space, Tag, drift, popIn, rng} from "./cards_kit";

type TitleSpec = {kicker: string; title: string; sub?: string; steps?: {text: string; key: string}[]};

const Palm: React.FC<{x: number; y: number; s: number; f: number; c: string; seed: number}> = ({x, y, s, f, c, seed}) =>
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.sin(f / 34 + seed) * 2.2})`}>
    <path d="M -6 0 Q 2 -150 14 -260 L 24 -260 Q 14 -150 8 0 Z" fill={c}/>
    {[-70, -30, 10, 50, 95, 140].map((a, i) => <path key={a} d="M 18 -262 Q 70 -300 120 -262 Q 70 -278 18 -262 Z" fill={c}
      transform={`rotate(${a + Math.sin(f / 22 + seed + i) * 4} 18 -262)`}/>)}
  </g>;

const Shed: React.FC<{x: number; y: number; w: number; f: number}> = ({x, y, w}) => <g transform={`translate(${x} ${y})`}>
  <rect x={0} y={-26} width={w} height={26} fill="#1D2B6E"/>
  {Array.from({length: Math.floor(w / 26)}, (_, i) => <rect key={i} x={8 + i * 26} y={-20} width={14} height={12} fill={K.orangeL} opacity={0.35}/>)}
  <path d={`M -10 -24 L ${w / 2} -50 L ${w + 10} -24 Z`} fill={K.creamD}/>
  <path d={`M ${w / 2} -50 L ${w + 10} -24 L ${w / 2} -24 Z`} fill="#B39470"/>
</g>;

const Lorry: React.FC<{x: number; y: number; s: number; f: number}> = ({x, y, s, f}) => {
  const b = Math.sin(f / 3.2) * 1.2;
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={130} ry={10} fill="#000" opacity={0.3}/>
    <g transform={`translate(0 ${b})`}>
      <rect x={-120} y={-92} width={160} height={74} rx={8} fill={K.orange}/><rect x={-120} y={-56} width={160} height={38} rx={0} fill={K.orangeD}/>
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-110 + i * 38} y={-112} width={32} height={22} rx={4} fill={K.cream}/>)}
      <path d="M 44 -80 L 92 -80 Q 112 -80 116 -56 L 120 -18 L 44 -18 Z" fill={K.teal}/><path d="M 58 -74 L 92 -74 Q 104 -74 106 -58 L 58 -58 Z" fill={K.tealL} opacity={0.8}/>
      <path d="M 44 -40 L 120 -40 L 120 -18 L 44 -18 Z" fill={K.tealD}/>
      <circle cx={126} cy={-30} r={6} fill={K.yellowL}/>
    </g>
    {[-80, 80].map((wx) => <g key={wx} transform={`translate(${wx} -12)`}><circle r={20} fill={K.ink}/><circle r={8} fill={K.haze}/></g>)}
  </g>;
};

const Milestone: React.FC<{x: number; y: number; t: number; text: string}> = ({x, y, t, text}) => {
  if (t <= 0.001) return null;
  return <div style={{position: "absolute", left: x - 100, top: y - 170, width: 200, height: 170, transform: `scale(${t})`, transformOrigin: "50% 100%"}}>
    <svg width={200} height={170} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      <ellipse cx={110} cy={166} rx={100} ry={10} fill="#000" opacity={0.35}/>
      <path d="M 10 170 L 10 70 A 90 70 0 0 1 190 70 L 190 170 Z" fill={K.white}/>
      <path d="M 10 70 A 90 70 0 0 1 190 70 L 190 74 L 10 74 Z" fill={K.yellow}/>
      <path d="M 100 0 A 90 70 0 0 1 190 70 L 190 74 L 100 74 Z" fill={K.orange}/>
      <path d="M 130 74 L 190 74 L 190 170 L 100 170 Z" fill="#C9D2EE"/>
    </svg>
    <div style={{position: "absolute", left: 0, right: 0, top: 88, textAlign: "center", fontFamily: ROUND, fontWeight: 800, fontSize: 46, color: K.deep, letterSpacing: 1}}>{text}</div>
  </div>;
};

export const Scene: React.FC<SceneProps<TitleSpec>> = ({f, dur, spec, at}) => {
  const d = drift(f, 2), push = 1 + 0.05 * easeIO(f, 0, Math.max(dur, 150));
  const rise = easeIO(f, 0, 70), r = rng(5);
  const kT = popIn(f, 3, 140), sT = popIn(f, 16 + Math.min(6, spec.title.split(" ").length * 0.8), 120, 14);
  const g = rng(31), grass = Array.from({length: 34}, () => [-40 + g() * 2000, 884 + g() * 40, 22 + g() * 26, g() * 6.28] as const).sort((a, b) => a[1] - b[1]);
  const fire = Array.from({length: 26}, () => [r() * 1920, 780 + r() * 260, r() * 6.28, 2 + r() * 2.5] as const);
  const steps = spec.steps ?? [];
  const stepT = (i: number) => { const k = steps[i].key, firstOfKey = steps.findIndex((s) => s.key === k); return popIn(f, at(k) + (i - firstOfKey) * 12, 150, 11); };
  const lx = (x: number, k: number) => x + d.x * k;
  return <AbsoluteFill style={{background: K.night, overflow: "hidden"}}>
    <div style={{position: "absolute", inset: 0, transform: `scale(${push})`, transformOrigin: "72% 60%"}}>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <defs>
          <linearGradient id="kti-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={K.night}/><stop offset="0.32" stopColor="#1F2470"/><stop offset="0.52" stopColor={K.purpleD}/>
            <stop offset="0.66" stopColor="#C04D73"/><stop offset="0.74" stopColor={K.orange}/><stop offset="0.8" stopColor={K.orangeL}/>
          </linearGradient>
          <radialGradient id="kti-sun"><stop offset="0" stopColor={K.yellowL} stopOpacity={0.75}/><stop offset="0.35" stopColor={K.orangeL} stopOpacity={0.35}/><stop offset="1" stopColor={K.orange} stopOpacity={0}/></radialGradient>
          <linearGradient id="kti-haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={K.orangeL} stopOpacity={0}/><stop offset="1" stopColor={K.orangeL} stopOpacity={0.35}/></linearGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#kti-sky)"/>
      </svg>
      <Space f={f} id="kti-s" seed={9} bare h={560}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        {/* the rising egg planet, its glow and slow light shafts */}
        <g transform={`translate(${lx(1400, 0.2)} ${700 - 170 * rise + d.y * 0.2})`}>
          <circle r={620} fill="url(#kti-sun)"/>
          <g transform={`rotate(${f * 0.08})`} opacity={0.6}>{Array.from({length: 12}, (_, i) => <path key={i} d="M 0 0 L 900 -60 L 900 60 Z" fill={K.yellowL} opacity={0.05} transform={`rotate(${i * 30})`}/>)}</g>
        </g>
        <EggPlanet f={f} id="kti-p" x={lx(1400, 0.2)} y={700 - 170 * rise + d.y * 0.2} r={230} ring={K.yellowL} moons={2} tilt={-12} glow={K.yellowL} shade={0.35}/>
        {/* far hills with the granite rock and its small fort wall */}
        <g transform={`translate(${d.x * 0.35} 0)`}>
          <path d="M -60 760 Q 200 690 420 720 T 820 700 Q 900 640 960 630 Q 1060 620 1120 660 Q 1300 700 1500 690 T 1980 700 L 1980 1080 L -60 1080 Z" fill="#5A3E8E"/>
          <path d="M 860 676 Q 900 618 980 612 Q 1080 608 1130 660" fill="none" stroke={K.orangeL} strokeWidth={6} opacity={0.75}/>
          <path d="M 930 620 L 930 598 L 946 598 L 946 606 L 962 606 L 962 596 L 978 596 L 978 606 L 994 606 L 994 598 L 1010 598 L 1010 616 Z" fill="#4A3278"/>
          <path d="M 1000 612 Q 1080 608 1130 660 L 1100 700 Q 1050 640 1000 640 Z" fill="#46307A" opacity={0.8}/>
        </g>
        <rect y={600} width={1920} height={180} fill="url(#kti-haze)"/>
        {/* mid hills with long poultry sheds and palms */}
        <g transform={`translate(${d.x * 0.6} 0)`}>
          <path d="M -60 800 Q 300 740 700 780 T 1400 770 T 1980 760 L 1980 1080 L -60 1080 Z" fill={K.tealD}/>
          <path d="M -60 800 Q 300 740 700 780 T 1400 770 T 1980 760" fill="none" stroke={K.teal} strokeWidth={8}/>
          {[[180, 800, 260], [500, 792, 220], [1180, 800, 300], [1560, 790, 240]].map(([x, y, w], i) => <Shed key={i} x={x} y={y} w={w} f={f}/>)}
          {[[110, 790, 0.9], [860, 800, 0.75], [1060, 806, 0.62], [1850, 786, 0.95]].map(([x, y, s], i) => <Palm key={i} x={x} y={y} s={s} f={f} c="#123B5E" seed={i}/>)}
        </g>
        {/* near ground, road and grass */}
        <g transform={`translate(${d.x * 1.0} 0)`}>
          <path d="M -80 880 Q 500 840 1000 870 T 2000 860 L 2000 1080 L -80 1080 Z" fill={K.deep}/>
          <path d="M -80 940 Q 600 910 1100 930 T 2000 925 L 2000 1000 Q 1200 990 600 1000 T -80 1010 Z" fill="#2A3A86"/>
          {Array.from({length: 14}, (_, i) => <rect key={i} x={-60 + i * 150} y={962 - Math.sin(i) * 4} width={70} height={8} rx={4} fill={K.cream} opacity={0.35}/>)}
          {grass.map(([gx, gy, gh, ph], i) => { const sway = Math.sin(f / 18 + ph) * 5;
            return <g key={i} transform={`translate(${gx} ${gy})`}>
              <path d={`M -8 0 Q ${-10 + sway * 0.6} ${-gh * 0.6} ${-16 + sway} ${-gh} Q ${-4 + sway * 0.6} ${-gh * 0.5} 0 0 Z`} fill={K.mid}/>
              <path d={`M -2 0 Q ${2 + sway * 0.6} ${-gh * 0.8} ${4 + sway} ${-gh * 1.3} Q ${8 + sway * 0.6} ${-gh * 0.7} 6 0 Z`} fill={K.soft}/>
              <path d={`M 4 0 Q ${12 + sway * 0.6} ${-gh * 0.5} ${20 + sway} ${-gh * 0.8} Q ${14 + sway * 0.6} ${-gh * 0.3} 10 0 Z`} fill={K.mid}/>
            </g>; })}
          <Lorry x={((f * 2.4 + 560) % 2400) - 200} y={966} s={0.8} f={f}/>
        </g>
        {fire.map(([x, y, ph, rad], i) => <circle key={i} cx={x + Math.sin(f / 40 + ph) * 30 + d.x * 1.2} cy={y + Math.cos(f / 33 + ph) * 16} r={rad} fill={K.yellowL}
          opacity={0.35 + 0.35 * Math.sin(f / 21 + ph)}/>)}
      </svg>
    </div>
    <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 22% 26%, rgba(11,20,51,0.55) 0%, rgba(11,20,51,0) 70%)"}}/>
    <div style={{position: "absolute", left: 120 + d.x * 0.1, top: 96, width: 1080}}>
      <div style={{opacity: Math.min(1, kT * 1.3), transform: `translateY(${(1 - kT) * -20}px)`}}><Tag text={spec.kicker} color={K.orange} size={36}/></div>
      <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: 108, lineHeight: 1.0, color: K.white, letterSpacing: -1.5, marginTop: 26, textShadow: "0 8px 34px rgba(0,0,0,0.5)",
        ...({textWrap: "balance"} as any)}}>
        {spec.title.split(" ").map((w, i) => { const t = popIn(f, 7 + i * 1.6, 140, 14); return <span key={i} style={{display: "inline-block", marginRight: "0.24em",
          opacity: Math.min(1, t * 1.3), transform: `translateY(${(1 - t) * 44}px) scale(${0.9 + 0.1 * Math.min(1, t)})`}}>{w}</span>; })}
      </div>
      {spec.sub && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 48, lineHeight: 1.2, color: K.cream, marginTop: 24, opacity: Math.min(1, sT * 1.2),
        transform: `translateY(${(1 - sT) * 24}px)`, textShadow: "0 4px 20px rgba(0,0,0,0.6)", maxWidth: 1000, ...({textWrap: "balance"} as any)}}>{spec.sub}</div>}
    </div>
    {steps.map((s, i) => { const n = steps.length, x = 960 + (i - (n - 1) / 2) * 300 + d.x;
      return <Milestone key={i} x={x} y={905} t={stepT(i)} text={s.text}/>; })}
    <Grain id="kti"/>
  </AbsoluteFill>;
};
