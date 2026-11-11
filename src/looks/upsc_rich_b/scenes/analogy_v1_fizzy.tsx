// GEO-04 Part 1, builder V1: `fizzy`. mode "jugs" (water with small bubbles beside thick porridge with big bursting bubbles), mode "bottle" (the girl shakes a bottle,
// foam bursts), mode "limit" (a rising magma column in a cut-away, bubbles grow as it climbs, a depth gauge falls).
import React from "react";
import {SANS} from "../kit";
import {Girl} from "../girl";
import {Tree, Hills, type AP} from "./analogy_kit";
import {Speckle, eio, eo, mixn, mkLabels, prog, rnd} from "./analogy_v1_kit";

const Counter: React.FC<{y: number}> = ({y}) => (
  <g>
    <rect width={1920} height={y + 4} fill="url(#v1f-wall)"/>
    <rect x={-20} y={y} width={1960} height={36} fill="url(#v1f-counter)"/>
    <rect x={-20} y={y} width={1960} height={5} fill="#d79a5c"/>
    <rect x={-20} y={y + 36} width={1960} height={400} fill="#5c3a24"/>
    {Array.from({length: 12}).map((_, i) => <line key={i} x1={i * 180 - 20} x2={i * 180 + 40} y1={y + 36} y2={1080} stroke="#3f2616" strokeWidth={3} opacity={0.5}/>)}
  </g>
);

const FDefs: React.FC = () => (
  <defs>
    <linearGradient id="v1f-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4e1b6"/><stop offset="1" stopColor="#e6c18a"/></linearGradient>
    <linearGradient id="v1f-counter" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b57a45"/><stop offset="1" stopColor="#8e5a33"/></linearGradient>
    <linearGradient id="v1f-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fd8f2"/><stop offset="1" stopColor="#3e8fcf"/></linearGradient>
    <linearGradient id="v1f-por" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f0dcae"/><stop offset="1" stopColor="#cfae72"/></linearGradient>
    <linearGradient id="v1f-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffffff" stopOpacity="0.55"/><stop offset="0.15" stopColor="#ffffff" stopOpacity="0.08"/><stop offset="0.85" stopColor="#ffffff" stopOpacity="0.05"/><stop offset="1" stopColor="#ffffff" stopOpacity="0.4"/></linearGradient>
    <linearGradient id="v1f-jug" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5b8fd0"/><stop offset="0.35" stopColor="#8fb8ec"/><stop offset="1" stopColor="#3d66a6"/></linearGradient>
    <linearGradient id="v1f-bottle" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2c7a4c"/><stop offset="0.3" stopColor="#6fcf8c"/><stop offset="0.7" stopColor="#2f8a55"/><stop offset="1" stopColor="#1d5736"/></linearGradient>
    <linearGradient id="v1f-soda" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f1d27a"/><stop offset="1" stopColor="#b9752a"/></linearGradient>
    <linearGradient id="v1f-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a8d6ef"/><stop offset="1" stopColor="#f6ead0"/></linearGradient>
    <linearGradient id="v1f-mag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd470"/><stop offset="0.5" stopColor="#ff7a24"/><stop offset="1" stopColor="#c0260e"/></linearGradient>
    <filter id="v1f-b8" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter>
  </defs>
);

// ---- jugs --------------------------------------------------------------------------------------------------------------------
const Pop: React.FC<{x: number; y: number; r: number; u: number; col?: string}> = ({x, y, r, u, col = "#ffffff"}) => (
  <g opacity={1 - u}><circle cx={x} cy={y} r={r + u * r * 2.2} fill="none" stroke={col} strokeWidth={2.6 * (1 - u)}/></g>
);

const Jugs: React.FC<AP> = ({f}) => {
  const BY = 770, LX = 520, RX = 1300;
  const pourIn = eio(prog(f, 4, 30)), tilt = -34 * pourIn;
  const surfL = 520, surfR = 560;
  const stream = `M${606} ${330} Q${588} ${420} ${572} ${surfL}`;
  return (
    <g>
      <FDefs/>
      <Counter y={BY}/>
      <rect x={90} y={120} width={260} height={300} rx={10} fill="#bfe3f4" stroke="#a6713f" strokeWidth={10}/><ellipse cx={170} cy={400} rx={120} ry={60} fill="#6aa560"/><ellipse cx={290} cy={405} rx={90} ry={44} fill="#86bb72"/><circle cx={280} cy={200} r={28} fill="#fff3bf"/><line x1={220} x2={220} y1={124} y2={416} stroke="#a6713f" strokeWidth={9}/><line x1={92} x2={348} y1={270} y2={270} stroke="#a6713f" strokeWidth={9}/>
      {/* left: a tall beaker with water, a jug pouring */}
      <clipPath id="v1f-bl"><path d={`M${LX - 112},430 L${LX - 108},${BY - 10} Q${LX - 108},${BY} ${LX - 96},${BY} L${LX + 96},${BY} Q${LX + 108},${BY} ${LX + 108},${BY - 10} L${LX + 112},430 Z`}/></clipPath>
      <g clipPath="url(#v1f-bl)">
        <rect x={LX - 120} y={surfL} width={240} height={BY - surfL} fill="url(#v1f-water)"/>
        <path d={`M${LX - 120},${surfL} Q${LX - 60},${surfL - 5 + Math.sin(f / 9) * 3} ${LX},${surfL} T${LX + 120},${surfL}`} stroke="#e6f6ff" strokeWidth={5} fill="none"/>
        {/* small bubbles: born under the stream, rising fast, popping at the top */}
        {Array.from({length: 22}).map((_, i) => {
          const u = (f * 0.034 + rnd(i, 1)) % 1, x = 572 + (rnd(i, 2) - 0.5) * 150 * (0.4 + u * 0.8), r = 3.5 + rnd(i, 3) * 5;
          const y = mixn(surfL + 150 + rnd(i, 4) * 30, surfL + 4, Math.min(1, u / 0.86));
          return u < 0.86 ? <g key={i}><circle cx={x} cy={y} r={r} fill="#ffffff" opacity={0.28}/><circle cx={x} cy={y} r={r} fill="none" stroke="#f4fbff" strokeWidth={1.8} opacity={0.9}/><circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.28} fill="#fff"/></g>
            : <Pop key={i} x={x} y={surfL + 2} r={r} u={(u - 0.86) / 0.14}/>;
        })}
        <ellipse cx={572} cy={surfL + 30} rx={46} ry={14} fill="#fff" opacity={0.18}/>
      </g>
      <path d={`M${LX - 112},430 L${LX - 108},${BY - 10} Q${LX - 108},${BY} ${LX - 96},${BY} L${LX + 96},${BY} Q${LX + 108},${BY} ${LX + 108},${BY - 10} L${LX + 112},430`} fill="url(#v1f-glass)" stroke="#e8f4fa" strokeWidth={5}/>
      <ellipse cx={LX} cy={430} rx={112} ry={14} fill="none" stroke="#e8f4fa" strokeWidth={4}/>
      {[0, 1, 2, 3].map((i) => <line key={i} x1={LX + 62} x2={LX + 100} y1={500 + i * 62} y2={500 + i * 62} stroke="#6a8aa0" strokeWidth={3} opacity={0.6}/>)}
      {/* the jug */}
      <g transform={`translate(700 262) rotate(${tilt} -90 70)`}>
        <path d="M-120,40 Q-130,-20 -110,-30 L-80,-30 L-80,170 Q-80,200 -50,200 L40,200 Q80,200 80,170 L80,-10 Q80,-40 50,-40 L-80,-30" fill="none"/>
        <path d="M-100,-10 L-80,-34 L60,-34 Q100,-34 100,10 L100,150 Q100,200 50,200 L-50,200 Q-100,200 -100,150 Z" fill="url(#v1f-jug)" stroke="#2c4e86" strokeWidth={4}/>
        <path d="M-100,-10 L-132,-30 L-110,-8 Z" fill="#8fb8ec" stroke="#2c4e86" strokeWidth={4}/>
        <path d="M100,10 Q170,10 160,90 Q150,150 98,140" fill="none" stroke="#2c4e86" strokeWidth={16} strokeLinecap="round"/>
        <path d="M100,10 Q164,10 154,90 Q146,142 98,134" fill="none" stroke="#7ba6e0" strokeWidth={8} strokeLinecap="round"/>
        <rect x={-80} y={70} width={160} height={14} fill="#f2e6c4" opacity={0.8}/>
        <path d="M-70,10 L-70,170" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.4}/>
      </g>
      {pourIn > 0.5 && (
        <g opacity={eo(prog(f, 22, 12))}>
          <path d={stream} stroke="#7cc4ee" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.95}/>
          <path d={stream} stroke="#e8f8ff" strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="12 26" strokeDashoffset={-f * 4}/>
          <ellipse cx={572} cy={surfL + 4} rx={26 + Math.sin(f / 3) * 3} ry={7} fill="#e8f8ff" opacity={0.85}/>
        </g>
      )}
      {/* right: a glass bowl of thick porridge */}
      <clipPath id="v1f-br"><path d={`M${RX - 214},470 L${RX - 214},${BY - 60} Q${RX - 214},${BY} ${RX - 150},${BY} L${RX + 150},${BY} Q${RX + 214},${BY} ${RX + 214},${BY - 60} L${RX + 214},470 Z`}/></clipPath>
      <g clipPath="url(#v1f-br)">
        <rect x={RX - 220} y={surfR} width={440} height={BY - surfR} fill="url(#v1f-por)"/>
        <Speckle x={RX - 220} y={surfR} w={440} h={BY - surfR} n={140} seed={7} cols={["#b8935a", "#fff4d6", "#8a6a3a"]} op={0.5} rmax={4.4}/>
        {/* big bubbles forming deep, growing, rising slowly, doming at the top, bursting */}
        {[0, 1, 2, 3, 4].map((i) => {
          const P = 150, t = ((f + i * 31) % P) / P, x = RX - 150 + i * 75 + Math.sin(i * 2.4) * 18, base = BY - 40 - (i % 2) * 40;
          if (t < 0.62) {
            const u = t / 0.62, r = mixn(10, 34, eo(u)), y = mixn(base, surfR + r * 0.9, eio(u));
            return <g key={i}><circle cx={x} cy={y} r={r} fill="#fff4d0" opacity={0.3}/><circle cx={x} cy={y} r={r} fill="none" stroke="#fffaf0" strokeWidth={3.4}/><ellipse cx={x - r * 0.32} cy={y - r * 0.34} rx={r * 0.3} ry={r * 0.2} fill="#fff" opacity={0.9}/></g>;
          }
          return null;
        })}
      </g>
      {[0, 1, 2, 3, 4].map((i) => {
        const P = 150, t = ((f + i * 31) % P) / P, x = RX - 150 + i * 75 + Math.sin(i * 2.4) * 18;
        if (t >= 0.62 && t < 0.8) {
          const u = (t - 0.62) / 0.18, r = mixn(36, 50, eo(u)), h = mixn(10, r * 1.05, eo(u));
          return <g key={`d${i}`}><path d={`M${x - r},${surfR} Q${x - r},${surfR - h * 1.4} ${x},${surfR - h * 1.3} Q${x + r},${surfR - h * 1.4} ${x + r},${surfR} Z`} fill="#fff4d0" opacity={0.42} stroke="#fffaf0" strokeWidth={3.4}/>
            <ellipse cx={x - r * 0.35} cy={surfR - h * 0.85} rx={r * 0.22} ry={h * 0.2} fill="#fff" opacity={0.9}/></g>;
        }
        if (t >= 0.8) {
          const u = (t - 0.8) / 0.2, tt = u * 24;
          return (
            <g key={`b${i}`}>
              <ellipse cx={x} cy={surfR + 3} rx={30 + u * 40} ry={6 + u * 5} fill="none" stroke="#fff" strokeWidth={3.6 * (1 - u)} opacity={0.9}/>
              {Array.from({length: 7}).map((_, k) => {
                const a = -Math.PI / 2 + (rnd(k + i * 7, 3) - 0.5) * 2.4, v = 9 + rnd(k + i * 7, 4) * 9, dx = Math.cos(a) * v * tt * 0.7, dy = Math.sin(a) * v * tt * 0.9 + 0.55 * tt * tt * 0.8;
                return <circle key={k} cx={x + dx} cy={surfR - 4 + dy} r={(3 + rnd(k + i, 5) * 5) * (1 - u * 0.5)} fill="#f0dcae" stroke="#b8935a" strokeWidth={1.6} opacity={1 - u * u}/>;
              })}
            </g>
          );
        }
        return null;
      })}
      <path d={`M${RX - 214},470 L${RX - 214},${BY - 60} Q${RX - 214},${BY} ${RX - 150},${BY} L${RX + 150},${BY} Q${RX + 214},${BY} ${RX + 214},${BY - 60} L${RX + 214},470`} fill="url(#v1f-glass)" stroke="#e8f4fa" strokeWidth={5}/>
      <path d={`M${RX - 214},${surfR} Q${RX - 110},${surfR - 7 + Math.sin(f / 22) * 2} ${RX},${surfR} T${RX + 214},${surfR}`} stroke="#fff4d6" strokeWidth={5} fill="none" opacity={0.8}/>
      {/* wooden spoon leaning in the porridge */}
      <g transform={`translate(${RX + 150} 470) rotate(24)`}><rect x={-7} y={-150} width={14} height={300} rx={7} fill="#c08a52" stroke="#7a4e28" strokeWidth={3}/><ellipse cx={0} cy={168} rx={26} ry={36} fill="#c08a52" stroke="#7a4e28" strokeWidth={3}/></g>
    </g>
  );
};

// ---- bottle ------------------------------------------------------------------------------------------------------------------
const BottleShape: React.FC<{lvl?: number; fz: number}> = ({fz}) => (
  <g>
    <path d="M-15,-125 L-15,-92 Q-15,-70 -36,-46 Q-38,-36 -38,-20 L-38,108 Q-38,125 -20,125 L20,125 Q38,125 38,108 L38,-20 Q38,-36 36,-46 Q15,-70 15,-92 L15,-125 Z" fill="url(#v1f-bottle)" stroke="#164a2c" strokeWidth={3}/>
    <path d="M-34,-6 L34,-6 L34,100 Q34,118 18,118 L-18,118 Q-34,118 -34,100 Z" fill="url(#v1f-soda)" opacity={0.92}/>
    <rect x={-38} y={22} width={76} height={42} fill="#f6ecd4" opacity={0.94}/>
    <rect x={-38} y={22} width={76} height={6} fill="#c9503a"/><rect x={-38} y={58} width={76} height={6} fill="#c9503a"/>
    <circle cx={0} cy={43} r={10} fill="#c9503a" opacity={0.85}/>
    <path d="M-27,-30 L-27,100" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.4}/>
    <rect x={-17} y={-132} width={34} height={11} rx={4} fill="#c9503a" stroke="#7a2a18" strokeWidth={2.4}/>
    <rect x={-19} y={-124} width={38} height={5} fill="#7a2a18" opacity={0.6}/>
    {Array.from({length: 22}).map((_, i) => {
      const grow = Math.min(1, fz), x = (rnd(i, 1) - 0.5) * 56, y = -4 + rnd(i, 2) * 118;
      return <circle key={i} cx={x} cy={y} r={(1.4 + rnd(i, 3) * 3) * (0.3 + grow)} fill="#fff" opacity={0.15 + 0.6 * grow * rnd(i, 4)}/>;
    })}
  </g>
);

const Bottle: React.FC<AP> = ({f, dur}) => {
  const t0 = dur * 0.06, t1 = dur * 0.42, tb = dur * 0.54;
  const shake = prog(f, t0, 14) * (1 - prog(f, t1, 10) * 0.7), fz = prog(f, t0, t1 - t0);
  const lift = eio(prog(f, t1, 16));
  const S = 1.12, gx = 1250, gy = 985;
  const wrist = [-116, -406] as [number, number];
  const hx = gx + S * wrist[0] - 6, hy = gy + S * wrist[1] + 6 - 10 * lift;
  const jx = Math.sin(f * 2.2) * 7 * shake, jy = Math.sin(f * 2.9 + 1) * 11 * shake, ja = Math.sin(f * 2.2) * 3.5 * shake;
  const tt = Math.max(0, f - tb), burst = tt > 0 ? 1 : 0;
  const mx = hx, my = hy - 2;
  return (
    <g>
      <FDefs/>
      <rect width={1920} height={1080} fill="url(#v1f-sky)"/>
      <circle cx={1650} cy={170} r={60} fill="#fff3bf" opacity={0.9}/><circle cx={1650} cy={170} r={130} fill="#ffe08a" opacity={0.25}/>
      <Hills id="v1f-h1" base={600} amp={60} top="#a9c7b8" bottom="#d6e0c4" seed={31} wl={480} bottomY={900}/>
      <Hills id="v1f-h2" base={700} amp={50} top="#78a470" bottom="#a3c07d" seed={33} wl={360} bottomY={940}/>
      <Tree x={250} y={930} s={1.5} f={f} seed={2}/><Tree x={470} y={950} s={1.0} f={f} seed={3} hue={6}/>
      <rect x={-20} y={800} width={1960} height={110} fill="#c9b08a"/>
      {Array.from({length: 4}).map((_, r) => Array.from({length: 22}).map((__, c) => <rect key={`${r}-${c}`} x={c * 96 - (r % 2) * 48 - 20} y={806 + r * 26} width={90} height={22} rx={4} fill={(r + c) % 3 ? "#d8c29c" : "#bfa27a"} opacity={0.9}/>))}
      <rect x={-20} y={796} width={1960} height={12} fill="#e8d7b4"/>
      {[[860, 0], [1500, 1], [1660, 2], [180, 3]].map(([x, k]) => <g key={k}><ellipse cx={x} cy={800} rx={90} ry={50} fill="#3f8a4a"/><ellipse cx={x - 30} cy={786} rx={60} ry={36} fill="#5aa85a"/>{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={x - 50 + i * 26} cy={784 + (i % 2) * 14} r={7} fill={["#e8503a", "#f6c23a", "#f08ab0", "#fff", "#e8503a"][i]}/>)}</g>)}
      <rect x={-20} y={900} width={1960} height={200} fill="#b99a6c"/>
      {Array.from({length: 11}).map((_, i) => <line key={i} x1={i * 200 - 60} x2={i * 200 - 140} y1={900} y2={1080} stroke="#8e7448" strokeWidth={3} opacity={0.5}/>)}
      <ellipse cx={gx - 10} cy={gy + 4} rx={160} ry={20} fill="#2a1808" opacity={0.28}/>
      {/* the bottle, drawn first so her hand closes over its mouth and thumb */}
      <g transform={`translate(${hx + jx} ${hy + jy + 118}) rotate(${ja} 0 -118)`}>
        <BottleShape fz={fz}/>
      </g>
      <g transform={`translate(${gx} ${gy}) scale(${S})`}><Girl f={f} id="v1f-g1" pose="present" talk={burst > 0}/></g>
      {/* foam: a jet from the mouth, droplets, and a head of foam on the neck */}
      {burst > 0 && (
        <g>
          {[[-26, 0, 30], [0, -16, 36], [28, -2, 28], [-6, 6, 30], [16, -26, 22]].map(([ox, oy, r], i) => <circle key={i} cx={mx + (ox as number) * eo(prog(f, tb, 12))} cy={my + (oy as number) * eo(prog(f, tb, 12)) - 4} r={(r as number) * eo(prog(f, tb, 12)) * (1 + 0.05 * Math.sin(f / 5 + i))} fill="#fffaf0" stroke="#b9a37a" strokeWidth={3}/>)}
          {Array.from({length: 70}).map((_, i) => {
            const a = -Math.PI / 2 + (rnd(i, 1) - 0.5) * 1.4 - 0.5, v = 9 + rnd(i, 2) * 17, life = 60 + rnd(i, 3) * 60, u = tt / life;
            if (u > 1) return null;
            const x = mx + Math.cos(a) * v * tt * 0.8, y = my + Math.sin(a) * v * tt * 0.9 + 0.5 * 0.9 * tt * tt * 0.6, r = (9 + rnd(i, 4) * 15) * (1 - u * 0.4);
            return i % 3 === 0 ? <circle key={i} cx={x} cy={y} r={r * 0.4} fill="#e8b45a" opacity={1 - u}/>
              : <g key={i} opacity={1 - u * u}><circle cx={x} cy={y} r={r} fill="#fffaf0" stroke="#b9a37a" strokeWidth={2.6}/><circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.3} fill="#fff"/></g>;
          })}
          {/* foam running down the glass */}
          <path d={`M${mx - 18},${my + 12} Q${mx - 26},${my + 70} ${mx - 22},${my + 120}`} stroke="#fffaf0" strokeWidth={12} strokeLinecap="round" fill="none" opacity={eo(prog(f, tb + 10, 30)) * 0.9}/>
          <path d={`M${mx + 18},${my + 12} Q${mx + 28},${my + 56} ${mx + 22},${my + 90}`} stroke="#fffaf0" strokeWidth={10} strokeLinecap="round" fill="none" opacity={eo(prog(f, tb + 16, 30)) * 0.9}/>
        </g>
      )}
    </g>
  );
};

// ---- limit -------------------------------------------------------------------------------------------------------------------
const Limit: React.FC<AP> = ({f, dur}) => {
  const TOP = 190, BOT = 730, CXm = 960, HWd = 44;
  const head = mixn(BOT - 20, TOP + 54, eio(prog(f, 14, dur - 70)));
  const conduit = `M${CXm},${BOT + 20} L${CXm + 4},${TOP}`;
  const layers = [{y: 190, c: "#c9a272"}, {y: 300, c: "#b4895a"}, {y: 420, c: "#9c7a58"}, {y: 540, c: "#84665a"}, {y: 660, c: "#6a5058"}, {y: 760, c: "#52404c"}];
  const gx = 400;
  const N = 26;
  const depth = (y: number) => (y - TOP) / (BOT - TOP);
  return (
    <g>
      <FDefs/>
      <defs>
        <clipPath id="v1f-col"><rect x={CXm - HWd + 2} y={head} width={HWd * 2 - 4} height={BOT + 40 - head}/></clipPath>
        <linearGradient id="v1f-gauge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe9b8"/><stop offset="0.5" stopColor="#f09a4a"/><stop offset="1" stopColor="#b8200e"/></linearGradient>
        <clipPath id="v1f-pipe"><path d={`M${CXm - HWd},${BOT + 40} L${CXm - HWd + 4},${TOP} L${CXm + HWd + 4},${TOP} L${CXm + HWd},${BOT + 40} Z`}/></clipPath>
      </defs>
      <rect width={1920} height={1080} fill="#d9c8a8"/>
      {layers.map((L, i) => <g key={i}><rect x={-20} y={L.y} width={1960} height={140} fill={L.c}/><rect x={-20} y={L.y} width={1960} height={4} fill="#fff" opacity={0.2}/></g>)}
      {layers.map((L, i) => <Speckle key={`s${i}`} x={-20} y={L.y} w={1960} h={130} n={110} seed={i * 5 + 1} cols={["#2a1a10", "#fff", "#6a4a30"]} op={0.2} rmax={4}/>)}
      <rect x={0} y={0} width={1920} height={190} fill="url(#v1f-sky)"/>
      <rect x={-20} y={170} width={1960} height={26} fill="#86a85c"/>
      <path d={`M${CXm - 120},190 L${CXm - 38},120 L${CXm + 38},120 L${CXm + 120},190 Z`} fill="#6e5850"/>
      {/* the conduit */}
      <path d={`M${CXm - HWd - 10},${BOT + 50} L${CXm - HWd - 4},${TOP} L${CXm + HWd + 8},${TOP} L${CXm + HWd + 10},${BOT + 50} Z`} fill="#2a1a18"/>
      <g clipPath="url(#v1f-pipe)">
        <g clipPath="url(#v1f-col)">
          <rect x={CXm - HWd - 10} y={TOP} width={HWd * 2 + 24} height={BOT + 60 - TOP} fill="url(#v1f-mag)"/>
          {Array.from({length: N}).map((_, i) => {
            const span = BOT + 20 - head, yb = BOT + 10 - ((f * 1.3 + i * (span / N) * 1.0 + rnd(i, 1) * 60) % Math.max(60, span)), d = depth(yb);
            if (d > 0.78 || yb < head + 6) return null;
            const grow = Math.pow(1 - d / 0.78, 1.05), r = 2.2 + 20 * grow * (0.7 + 0.3 * rnd(i, 2));
            const x = CXm + (rnd(i, 3) - 0.5) * (HWd * 2 - r * 2 - 8) + Math.sin(f / 20 + i) * 3;
            return <g key={i}><circle cx={x} cy={yb} r={r} fill="#fff3c2" opacity={0.35}/><circle cx={x} cy={yb} r={r} fill="none" stroke="#fff8e0" strokeWidth={2.4}/><circle cx={x - r * 0.3} cy={yb - r * 0.3} r={r * 0.26} fill="#fff"/></g>;
          })}
          <rect x={CXm - HWd - 10} y={head} width={HWd * 2 + 24} height={16} fill="#ffe29a" opacity={0.7}/>
        </g>
      </g>
      <path d={`M${CXm - HWd - 10},${BOT + 50} L${CXm - HWd - 4},${TOP} M${CXm + HWd + 8},${TOP} L${CXm + HWd + 10},${BOT + 50}`} stroke="#150d0c" strokeWidth={6} fill="none"/>
      <ellipse cx={CXm} cy={head} rx={HWd + 30} ry={44} fill="url(#v1f-mag)" opacity={0.0}/>
      <ellipse cx={CXm} cy={BOT + 40} rx={280} ry={70} fill="url(#v1f-mag)"/>
      <ellipse cx={CXm} cy={BOT + 40} rx={380} ry={120} fill="#ff7a24" opacity={0.25} filter="url(#v1f-b8)"/>
      {/* the depth gauge */}
      <g transform={`translate(${gx} 0)`}>
        <rect x={-20} y={TOP} width={40} height={BOT - TOP} rx={12} fill="url(#v1f-gauge)" stroke="#3a2418" strokeWidth={4}/>
        {Array.from({length: 11}).map((_, i) => <line key={i} x1={20} x2={i % 5 === 0 ? 40 : 32} y1={TOP + (i / 10) * (BOT - TOP)} y2={TOP + (i / 10) * (BOT - TOP)} stroke="#3a2418" strokeWidth={3}/>)}
        <g transform={`translate(0 ${head})`}>
          <path d="M-34,0 L-62,-16 L-62,16 Z" fill="#fff6e2" stroke="#3a2418" strokeWidth={3}/>
          <line x1={20} x2={CXm - gx - HWd - 12} y1={0} y2={0} stroke="#fff6e2" strokeWidth={3} strokeDasharray="10 10" opacity={0.7}/>
        </g>
        <text x={0} y={TOP - 18} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} fill="#3a2418" letterSpacing={1.5}>SHALLOW</text>
        <text x={0} y={BOT + 44} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} fill="#fff1d4" letterSpacing={1.5}>DEEP</text>
      </g>
    </g>
  );
};

export const FizzyArt: React.FC<AP> = (p) => {
  const m = (p.spec as any).mode;
  return m === "bottle" ? <Bottle {...p}/> : m === "limit" ? <Limit {...p}/> : <Jugs {...p}/>;
};

export const FizzyLabels: React.FC<AP> = (p) => {
  const m = (p.spec as any).mode;
  const L = m === "bottle" ? mkLabels({fz: {cx: 1560, y: 260, size: 48, maxW: 520, tone: "dark"}})
    : m === "limit" ? mkLabels({gp: {cx: 1480, y: 330, size: 38, maxW: 560, tone: "dark"}})
    : mkLabels({rn: {cx: 520, y: 800, size: 34, maxW: 520, tone: "cool"}, th: {cx: 1300, y: 170, size: 36, maxW: 640, tone: "dark"}, vs: {cx: 1300, y: 800, size: 38, maxW: 520}});
  return <L {...p}/>;
};
