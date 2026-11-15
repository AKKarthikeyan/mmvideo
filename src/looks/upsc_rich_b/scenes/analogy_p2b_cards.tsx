// Look B analogy art for Part 2: `cards` (drought-year cards drop onto a table, one lands green) and `seesaw` (the Indian Ocean as a see-saw).
import React from "react";
import {SANS, SERIF, W, H, eio, eo, rng} from "../kit";
import {Cloud, Sun, prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";

// ---- cards ------------------------------------------------------------------------------------------------------------------
type CardItem = {text: string; key: string; good?: boolean};
const CW = 224, CH = 318;

const YearCard: React.FC<{c: CardItem; i: number; n: number; f: number; at: number}> = ({c, i, n, f, at}) => {
  const r = rng(i * 131 + 7), rot = (r() - 0.5) * 9, x = W / 2 + (i - (n - 1) / 2) * 276, y = 500 + (r() - 0.5) * 30;
  const u = prog(f, at, 22);
  if (u <= 0) return null;
  const drop = (1 - eo(u)) * 760, bounce = u >= 1 ? Math.sin((f - at - 22) / 2.4) * Math.exp(-(f - at - 22) / 6) * 14 : 0;
  const land = u >= 1 ? eo(prog(f, at + 22, 12)) : 0, [yr, rest] = c.text.split(":").map((t) => t.trim());
  const good = !!c.good;
  const id = `yc${i}`;
  return (
    <g>
      <ellipse cx={x + 14} cy={y + CH / 2 + 6} rx={CW / 2 * (0.7 + 0.3 * eo(u))} ry={14} fill="#1a0f06" opacity={0.18 + 0.2 * eo(u)} filter="url(#ak-blur8)"/>
      {good && land > 0 && <circle cx={x} cy={y} r={230 * land} fill="url(#ak-sunglow)" opacity={0.55 * (1 - land * 0.3)}/>}
      <g transform={`translate(${x} ${y - drop + bounce}) rotate(${rot + (1 - eo(u)) * (i % 2 ? 14 : -14)})`}>
        <defs>
          <linearGradient id={`${id}-f`} x1="0" y1="0" x2="1" y2="1">
            {good ? <><stop offset="0" stopColor="#9ad680"/><stop offset="1" stopColor="#2f8a46"/></> : <><stop offset="0" stopColor="#c6945c"/><stop offset="1" stopColor="#7e4f28"/></>}
          </linearGradient>
        </defs>
        <rect x={-CW / 2} y={-CH / 2} width={CW} height={CH} rx={18} fill={`url(#${id}-f)`} stroke={good ? "#1d6a34" : "#5a3418"} strokeWidth={3.5} style={{filter: "drop-shadow(0 10px 10px rgba(30,16,6,.4))"}}/>
        <rect x={-CW / 2 + 12} y={-CH / 2 + 12} width={CW - 24} height={CH - 24} rx={11} fill="none" stroke="#fff3d6" strokeWidth={2} opacity={0.65}/>
        {good ? (
          <g transform="translate(0 34)">
            {/* sprout and rain */}
            <path d="M0,112 V54" stroke="#175e2c" strokeWidth={6} strokeLinecap="round"/>
            <path d="M0,70 Q-48,66 -56,24 Q-12,22 0,70 Z" fill="#c8f0a0" stroke="#175e2c" strokeWidth={2.5}/>
            <path d="M0,86 Q46,84 56,40 Q12,40 0,86 Z" fill="#dcf6b4" stroke="#175e2c" strokeWidth={2.5}/>
            {[-60, -20, 24, 62].map((dx, k) => <path key={k} d={`M${dx},${-160 + ((k * 13) % 5) * 4} q-5,14 0,22 q5,-8 0,-22`} fill="#d6f0ff" stroke="#2f78b8" strokeWidth={1.8}/>)}
          </g>
        ) : (
          <g opacity={0.9}>
            {/* cracked earth and a hard sun */}
            <circle cx={62} cy={-116} r={20} fill="#ffd26a" stroke="#e8a02a" strokeWidth={2.5}/>
            <path d={`M-80,128 L-40,96 L-52,66 M-20,128 L8,92 L-6,64 L26,48 M50,128 L66,100 L52,72 M-76,102 L-60,84`} stroke="#4a2810" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.75}/>
          </g>
        )}
        <text x={0} y={rest ? -30 : -6} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={rest ? 60 : 66} fill="#fff6e0" stroke={good ? "#14502a" : "#4a2810"} strokeWidth={1.5} paintOrder="stroke">{yr}</text>
        {rest && <text x={0} y={12} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={24} letterSpacing="4" fill="#fff6e0">{rest}</text>}
      </g>
    </g>
  );
};

export const CardsArt: React.FC<AP> = (p) => {
  const {f, spec} = p, cards = ((spec as any).cards ?? []) as CardItem[];
  return (
    <g>
      <defs>
        <radialGradient id="cd-felt" cx="0.5" cy="0.45" r="0.75"><stop offset="0" stopColor="#7a5232"/><stop offset="0.6" stopColor="#5a3a22"/><stop offset="1" stopColor="#32200f"/></radialGradient>
        <radialGradient id="cd-lamp" cx="0.5" cy="0.45" r="0.55"><stop offset="0" stopColor="#ffe9b0" stopOpacity="0.5"/><stop offset="1" stopColor="#ffe9b0" stopOpacity="0"/></radialGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#cd-felt)"/>
      {Array.from({length: 12}, (_, i) => <path key={i} d={`M-60,${40 + i * 96} Q960,${30 + i * 96 + (i % 2) * 14} 1980,${40 + i * 96}`} stroke="#2c1a0c" strokeWidth={2} fill="none" opacity={0.35}/>)}
      <ellipse cx={960} cy={520} rx={940} ry={420} fill="url(#cd-lamp)"/>
      {cards.map((c, i) => <YearCard key={c.key} c={c} i={i} n={cards.length} f={f} at={p.at(c.key)}/>)}
    </g>
  );
};
export const CardsLabels: React.FC<AP> = () => null;

// ---- seesaw -----------------------------------------------------------------------------------------------------------------
export const SeesawArt: React.FC<AP> = (p) => {
  const {f} = p, L = rlabs(p), tIo = L[0]?.at ?? 20, tIh = L[1]?.at ?? 100;
  const split = eo(prog(f, tIo, 36)), tilt = 8 * eio(prog(f, tIh, 40)), sway = (1 - eio(prog(f, tIh, 40))) * Math.sin(f / 22) * 2.4 + Math.sin(f / 17) * 0.4;
  const ang = tilt + sway, PX = 960, PY = 520, half = 560;
  const seaY = 590;
  const wave = (y: number, ph: number, amp: number) => `M-60,${y} ${Array.from({length: 33}, (_, i) => `L${-60 + (i + 1) * 64},${y + Math.sin(i * 0.9 + f / 14 + ph) * amp}`).join(" ")} L1980,1100 L-60,1100 Z`;
  return (
    <g>
      <defs>
        <linearGradient id="ss-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7db3df"/><stop offset="1" stopColor="#f6e8c6"/></linearGradient>
        <linearGradient id="ss-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3c9bd0"/><stop offset="1" stopColor="#164a78"/></linearGradient>
        <linearGradient id="ss-warm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#e5502a"/><stop offset="0.45" stopColor="#f0a04e"/><stop offset="0.8" stopColor="#f0a04e" stopOpacity="0"/></linearGradient>
        <linearGradient id="ss-cool" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#1f5fa8"/><stop offset="0.5" stopColor="#3a96cc"/><stop offset="0.9" stopColor="#3a96cc" stopOpacity="0"/></linearGradient>
        <linearGradient id="ss-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e2b070"/><stop offset="1" stopColor="#a8703a"/></linearGradient>
        <linearGradient id="ss-land" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fb860"/><stop offset="1" stopColor="#5b8a3e"/></linearGradient>
        <linearGradient id="ss-rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b09a7c"/><stop offset="1" stopColor="#6e5a42"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#ss-sky)"/>
      <Sun x={470} y={160} r={56} f={f} glow={1 + split * 0.5}/>
      <Cloud x={1300} y={170} s={0.8} f={f} speed={0.15} seed={4} a={0.8}/>
      <Cloud x={820} y={260} s={0.55} f={f} speed={0.2} seed={6} a={0.7}/>
      {/* sea */}
      <path d={wave(seaY, 0, 5)} fill="url(#ss-sea)"/>
      <path d={wave(seaY, 0, 5)} fill="url(#ss-warm)" opacity={split}/>
      <path d={wave(seaY, 1, 5)} fill="url(#ss-cool)" opacity={split * 0.9}/>
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M${60 + i * 215},${seaY + 40 + (i % 3) * 36} q40,-14 80,0 q40,14 80,0`} fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.3}/>)}
      {/* heat shimmer over the warm west and cool breath over the east */}
      {[0, 1, 2, 3, 4].map((i) => { const u = (f * 0.012 + i * 0.2) % 1; return <path key={i} d={`M${150 + i * 140},${seaY - u * 130} q14,-18 0,-36 q-14,-18 0,-36`} fill="none" stroke="#ff7a3a" strokeWidth={5} strokeLinecap="round" opacity={0.6 * split * Math.min(1, u * 5, (1 - u) * 4)}/>; })}
      {/* Africa's coast, west */}
      <g>
        <path d={`M-60,420 L120,430 Q250,470 300,${seaY - 20} Q320,${seaY + 10} 300,${seaY + 60} L-60,${seaY + 60} Z`} fill="url(#ss-land)"/>
        <path d={`M-60,520 Q120,500 260,${seaY - 4} L260,${seaY + 40} L-60,${seaY + 40} Z`} fill="#d9b878" opacity={0.7}/>
        <path d={`M300,${seaY + 60} Q330,${seaY + 20} 292,${seaY - 12}`} stroke="#f4efe0" strokeWidth={5} fill="none" opacity={0.7}/>
        {[0, 1].map((i) => <g key={i} transform={`translate(${120 + i * 110} ${440 + i * 28})`}><path d="M0,0 V-70" stroke="#6b4a2a" strokeWidth={7}/>{[-60, -20, 20, 60].map((a, k) => <path key={k} d={`M0,-70 q${a * 0.6},${-30 + Math.abs(a) * 0.3} ${a},${12 + Math.abs(a) * 0.1}`} stroke="#2f7a3a" strokeWidth={9} fill="none" strokeLinecap="round"/>)}</g>)}
        <text x={90} y={640} fontFamily={SANS} fontWeight={800} fontSize={26} letterSpacing="5" fill="#fff6e0" opacity={0.95} stroke="#3a2a1a" strokeWidth={1} paintOrder="stroke">AFRICA</text>
      </g>
      {/* Indonesia, east */}
      <g>
        <path d={`M1980,400 L1700,410 Q1630,450 1620,${seaY - 14} Q1612,${seaY + 20} 1640,${seaY + 60} L1980,${seaY + 60} Z`} fill="url(#ss-land)"/>
        <path d={`M1620,${seaY - 6} Q1580,${seaY + 4} 1590,${seaY + 20}`} stroke="#f4efe0" strokeWidth={5} fill="none" opacity={0.7}/>
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${1730 + i * 90} ${430 + i * 14})`}><path d="M0,0 V-76" stroke="#6b4a2a" strokeWidth={7}/>{[-64, -22, 22, 64].map((a, k) => <path key={k} d={`M0,-76 q${a * 0.6},${-30 + Math.abs(a) * 0.3} ${a},${12 + Math.abs(a) * 0.1}`} stroke="#2a7a46" strokeWidth={9} fill="none" strokeLinecap="round"/>)}</g>)}
        <text x={1760} y={660} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} letterSpacing="5" fill="#fff6e0" stroke="#3a2a1a" strokeWidth={1} paintOrder="stroke">INDONESIA</text>
      </g>
      {/* fulcrum */}
      <path d={`M${PX - 120},${seaY + 130} L${PX - 34},${PY + 18} L${PX + 34},${PY + 18} L${PX + 120},${seaY + 130} Z`} fill="url(#ss-rock)" stroke="#4f3e2c" strokeWidth={3} />
      <path d={`M${PX - 20},${PY + 20} L${PX - 60},${seaY + 120}`} stroke="#d8c8a8" strokeWidth={4} opacity={0.5}/>
      <path d={`M${PX - 140},${seaY + 132} Q${PX},${seaY + 100} ${PX + 140},${seaY + 132}`} fill="none" stroke="#fff" strokeWidth={5} opacity={0.5}/>
      {/* plank */}
      <g transform={`rotate(${-ang} ${PX} ${PY})`} style={{filter: "drop-shadow(8px 12px 8px rgba(30,16,6,.38))"}}>
        <rect x={PX - half} y={PY - 18} width={half * 2} height={32} rx={14} fill="url(#ss-wood)" stroke="#6e4524" strokeWidth={2.5}/>
        <rect x={PX - half + 16} y={PY - 14} width={half * 2 - 32} height={6} rx={3} fill="#f6dba0" opacity={0.6}/>
        {Array.from({length: 7}, (_, i) => <path key={i} d={`M${PX - half + 60 + i * 150},${PY - 6} q40,6 80,0`} stroke="#8a5a30" strokeWidth={1.8} fill="none" opacity={0.5}/>)}
        <circle cx={PX} cy={PY - 2} r={14} fill="#8a8f94" stroke="#555a5e" strokeWidth={3}/>
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`translate(${PX + sd * (half - 70)} ${PY - 16})`}>
            <path d="M0,0 V-52 H-16" stroke="#7b7f84" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" transform={sd < 0 ? "scale(-1 1)" : undefined}/>
            <rect x={-8} y={-16} width={16} height={18} rx={4} fill="#a8703a"/>
          </g>
        ))}
        {/* a thermometer-red glow on the warm end, a cool one on the east end */}
        <ellipse cx={PX - half + 60} cy={PY + 30} rx={90} ry={14} fill="#ff6a2a" opacity={0.4 * split} filter="url(#ak-blur8)"/>
        <ellipse cx={PX + half - 60} cy={PY + 30} rx={90} ry={14} fill="#3a96cc" opacity={0.4 * split} filter="url(#ak-blur8)"/>
      </g>
      {/* warm west rain cloud */}
      <g opacity={eo(prog(f, tIh, 24))}>
        <Cloud x={560} y={320} s={0.7} f={0} speed={0} seed={12} a={1}/>
        {[0, 1, 2, 3].map((i) => { const u = (f * 0.03 + i * 0.25) % 1; return <path key={i} d={`M${520 + i * 50},${350 + u * 90} l-5,16`} stroke="#4aa3dd" strokeWidth={4} strokeLinecap="round" opacity={0.8 * Math.min(1, u * 5)}/>; })}
      </g>
    </g>
  );
};
export const SeesawLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  return <>
    {L[0] && <P2Card cx={960} y={92} text={L[0].text} f={p.f} at={L[0].at} size={44} maxW={900}/>}
    {L[1] && <P2Card cx={700} y={730} text={L[1].text} f={p.f} at={L[1].at} size={34} tone="green" maxW={760}/>}
  </>;
};
void H;
