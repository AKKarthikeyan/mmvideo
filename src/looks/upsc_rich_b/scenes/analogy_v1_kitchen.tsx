// GEO-04 Part 1, builder V1: `pot-lid`. A kitchen, a steel pot on a gas flame; the lid rattles harder as the pressure builds, then the question: slip out, or blow the lid off?
import React from "react";
import type {AP} from "./analogy_kit";
import {Puffs, eio, mkLabels, prog} from "./analogy_v1_kit";

const POT = {x: 830, top: 432, bot: 668, w: 330};

const Flame: React.FC<{f: number; p: number; cx: number; y: number}> = ({f, p, cx, y}) => {
  const n = 15, R = 112;
  return (
    <g>
      <ellipse cx={cx} cy={y + 8} rx={150} ry={26} fill="#2d6fc8" opacity={0.28 + 0.2 * p} filter="url(#v1k-b8)"/>
      {Array.from({length: n}).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + 0.2, x = cx + Math.cos(a) * R, yy = y + Math.sin(a) * 12 - 2, back = Math.sin(a) < 0;
        const hgt = (30 + 26 * p) * (0.78 + 0.22 * Math.sin(f / 3.1 + i * 2.3)) * (back ? 0.9 : 1.05);
        return (
          <g key={i} transform={`translate(${x} ${yy})`}>
            <path d={`M-9,0 Q-8,-${hgt * 0.62} 0,-${hgt} Q8,-${hgt * 0.62} 9,0 Z`} fill="#3a7de0" opacity={0.9}/>
            <path d={`M-5,0 Q-4,-${hgt * 0.5} 0,-${hgt * 0.72} Q4,-${hgt * 0.5} 5,0 Z`} fill="#bfe0ff"/>
            <path d={`M-2.4,0 Q-2,-${hgt * 0.3} 0,-${hgt * 0.4} Q2,-${hgt * 0.3} 2.4,0 Z`} fill="#fff"/>
          </g>
        );
      })}
    </g>
  );
};

const Jar: React.FC<{x: number; y: number; w: number; h: number; c: string; lid: string}> = ({x, y, w, h, c, lid}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={9} fill={c} stroke="#3a2a1c" strokeWidth={2.4}/>
    <rect x={x + 6} y={y + 6} width={w * 0.2} height={h - 12} rx={5} fill="#fff" opacity={0.28}/>
    <rect x={x - 3} y={y - 15} width={w + 6} height={17} rx={5} fill={lid} stroke="#3a2a1c" strokeWidth={2.2}/>
    <rect x={x + 8} y={y + h * 0.3} width={w - 16} height={h * 0.34} rx={4} fill="#f6ecd4" opacity={0.85}/>
  </g>
);

export const PotArt: React.FC<AP> = ({f, dur, at}) => {
  const tq = at("q"), tp = at("pb");
  const p = eio(prog(f, 0, tq - 14)), pop = eio(prog(f, tq + 2, 22));
  const amp = 1.5 + 9 * p + 12 * pop, rate = 1.15 + 0.5 * p;
  const lift = amp * (0.5 + 0.5 * Math.sin(f * rate)) * (0.72 + 0.28 * Math.sin(f * 0.43 + 1)) + 22 * pop * (0.6 + 0.4 * Math.sin(f * 0.8));
  const tilt = Math.sin(f * rate + 1.3) * (0.8 + 3.2 * p + 2.4 * pop);
  const lidCx = POT.x, lidY = POT.top - 4 - lift * 0.8;
  const steam = 0.12 + 0.88 * p;
  void dur;
  void tp;
  return (
    <g>
      <defs>
        <linearGradient id="v1k-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f2d9a8"/><stop offset="1" stopColor="#e6bd86"/></linearGradient>
        <linearGradient id="v1k-tile" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f7f3ea"/><stop offset="1" stopColor="#d9dfdc"/></linearGradient>
        <linearGradient id="v1k-steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7f8a96"/><stop offset="0.18" stopColor="#d7dee6"/><stop offset="0.4" stopColor="#f6f9fc"/><stop offset="0.7" stopColor="#aab4be"/><stop offset="1" stopColor="#6c7681"/></linearGradient>
        <linearGradient id="v1k-lid" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8a95a1"/><stop offset="0.25" stopColor="#e8eef4"/><stop offset="0.5" stopColor="#ffffff"/><stop offset="0.8" stopColor="#a9b3bd"/><stop offset="1" stopColor="#707a85"/></linearGradient>
        <linearGradient id="v1k-counter" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b97a46"/><stop offset="0.12" stopColor="#8e5a33"/><stop offset="1" stopColor="#5e3a22"/></linearGradient>
        <linearGradient id="v1k-cab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4d6a62"/><stop offset="1" stopColor="#2f4540"/></linearGradient>
        <linearGradient id="v1k-sun" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3c0" stopOpacity="0.55"/><stop offset="1" stopColor="#fff3c0" stopOpacity="0"/></linearGradient>
        <filter id="v1k-b8" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="8"/></filter>
      </defs>
      {/* wall, backsplash tiles */}
      <rect width={1920} height={760} fill="url(#v1k-wall)"/>
      <rect x={0} y={410} width={1920} height={300} fill="url(#v1k-tile)"/>
      {Array.from({length: 25}).map((_, i) => <line key={`v${i}`} x1={i * 80} x2={i * 80} y1={410} y2={710} stroke="#b9c2c0" strokeWidth={2} opacity={0.7}/>)}
      {Array.from({length: 4}).map((_, i) => <line key={`h${i}`} x1={0} x2={1920} y1={410 + i * 75} y2={410 + i * 75} stroke="#b9c2c0" strokeWidth={2} opacity={0.7}/>)}
      <rect x={0} y={404} width={1920} height={10} fill="#c8a06a"/>
      {/* window with daylight and a plant outside */}
      <rect x={110} y={110} width={340} height={270} rx={10} fill="#8c5a32"/>
      <rect x={126} y={126} width={308} height={238} rx={4} fill="#9fd0ea"/>
      <rect x={126} y={126} width={308} height={238} fill="#c9e6f2" opacity={0.55}/>
      <ellipse cx={230} cy={350} rx={160} ry={64} fill="#5f9b58"/><ellipse cx={380} cy={340} rx={120} ry={52} fill="#7ab36a"/>
      <circle cx={360} cy={190} r={26} fill="#fff6c4"/>
      <rect x={272} y={126} width={14} height={238} fill="#8c5a32"/><rect x={126} y={238} width={308} height={14} fill="#8c5a32"/>
      <rect x={96} y={378} width={368} height={20} rx={5} fill="#a6713f"/>
      {[[170, "#d8683a"], [250, "#4f8a52"]].map(([x, c], i) => <g key={i}><path d={`M${x},398 L${(x as number) + 56},398 L${(x as number) + 48},346 L${(x as number) + 8},346 Z`} fill={c as string} stroke="#3a2a1c" strokeWidth={2.4}/></g>)}
      {/* sunlight from the window falls across the wall */}
      <path d="M450,130 L1010,420 L1010,640 L450,370 Z" fill="url(#v1k-sun)"/>
      {/* shelf with spice jars and hanging ladles */}
      <rect x={560} y={262} width={440} height={14} rx={4} fill="#a6713f"/><rect x={560} y={276} width={440} height={6} fill="#5e3a22" opacity={0.5}/>
      <Jar x={588} y={196} w={58} h={66} c="#c9503a" lid="#e8d9b0"/><Jar x={670} y={176} w={60} h={86} c="#d8a43a" lid="#6e4a2a"/><Jar x={756} y={202} w={54} h={60} c="#6f9a4a" lid="#e8d9b0"/>
      <Jar x={836} y={186} w={62} h={76} c="#b8744a" lid="#6e4a2a"/><Jar x={922} y={206} w={52} h={56} c="#e6e0cf" lid="#c9503a"/>
      <line x1={600} x2={1000} y1={330} y2={330} stroke="#5a5a5e" strokeWidth={5} strokeLinecap="round"/>
      {[[640, 30], [740, 40], [860, 34], [950, 26]].map(([x, l], i) => (
        <g key={i} transform={`translate(${x} 330) rotate(${Math.sin(f / 70 + i) * 1.4} 0 0)`}>
          <line x1={0} y1={0} x2={0} y2={l as number} stroke="#6a6a70" strokeWidth={5} strokeLinecap="round"/>
          <ellipse cx={0} cy={(l as number) + 14} rx={i % 2 ? 13 : 17} ry={i % 2 ? 22 : 15} fill="#8f98a3" stroke="#555a62" strokeWidth={2.4}/>
        </g>
      ))}
      {/* counter */}
      <rect x={-20} y={706} width={1960} height={30} fill="url(#v1k-counter)"/>
      <rect x={-20} y={706} width={1960} height={5} fill="#d79a5c" opacity={0.9}/>
      <rect x={-20} y={736} width={1960} height={360} fill="url(#v1k-cab)"/>
      {[0, 1, 2, 3].map((i) => <g key={i}><rect x={20 + i * 480} y={768} width={440} height={300} rx={8} fill="#56756c" stroke="#2c403b" strokeWidth={3}/><rect x={36 + i * 480} y={784} width={408} height={268} rx={5} fill="none" stroke="#7aa397" strokeWidth={2.4} opacity={0.7}/><rect x={i % 2 ? 54 + i * 480 : 404 + i * 480} y={790} width={14} height={80} rx={6} fill="#d9c9a0"/></g>)}
      {/* potted plant and a cloth on the counter */}
      <g transform="translate(250 706)">
        <path d="M-52,0 L52,0 L40,-70 L-40,-70 Z" fill="#c8683a" stroke="#6a3a1c" strokeWidth={3}/>
        {[-40, -18, 6, 28, 46].map((x, i) => <path key={i} d={`M${x * 0.3},-70 Q${x * 1.6},-${110 + (i % 3) * 22} ${x * 2.1},-${64 + (i % 2) * 40}`} stroke="#3f7a46" strokeWidth={14} strokeLinecap="round" fill="none"/>)}
      </g>
      {/* the hob */}
      <rect x={560} y={690} width={600} height={26} rx={8} fill="#2b2f36"/>
      <rect x={560} y={690} width={600} height={6} rx={3} fill="#5a606c"/>
      <ellipse cx={POT.x} cy={694} rx={190} ry={22} fill="#1c1e24"/>
      <ellipse cx={POT.x} cy={692} rx={150} ry={15} fill="#34363e"/>
      {[610, 1100].map((x) => <circle key={x} cx={x} cy={703} r={11} fill="#8a909c" stroke="#222" strokeWidth={2.4}/>)}
      {[-150, -60, 60, 150].map((x) => <rect key={x} x={POT.x + x - 6} y={664} width={12} height={28} fill="#1c1e24"/>)}
      <Flame f={f} p={p} cx={POT.x} y={690}/>
      {/* the pot */}
      <ellipse cx={POT.x} cy={POT.bot + 4} rx={POT.w / 2 + 6} ry={14} fill="#10131a" opacity={0.45}/>
      <path d={`M${POT.x - POT.w / 2},${POT.top} L${POT.x - POT.w / 2 + 6},${POT.bot} Q${POT.x},${POT.bot + 26} ${POT.x + POT.w / 2 - 6},${POT.bot} L${POT.x + POT.w / 2},${POT.top} Z`} fill="url(#v1k-steel)" stroke="#5a636e" strokeWidth={3}/>
      <rect x={POT.x - POT.w / 2 - 2} y={POT.top} width={POT.w + 4} height={18} rx={8} fill="#c4ccd4" stroke="#5a636e" strokeWidth={2.4}/>
      <path d={`M${POT.x - POT.w / 2 + 24},${POT.top + 30} L${POT.x - POT.w / 2 + 30},${POT.bot - 12}`} stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.5}/>
      {[-1, 1].map((s) => <g key={s}><rect x={s < 0 ? POT.x - POT.w / 2 - 70 : POT.x + POT.w / 2 + 2} y={POT.top + 34} width={68} height={22} rx={10} fill="#262a30" stroke="#101216" strokeWidth={2.4}/><rect x={s < 0 ? POT.x - POT.w / 2 - 62 : POT.x + POT.w / 2 + 10} y={POT.top + 38} width={44} height={5} rx={2.5} fill="#6a717e" opacity={0.7}/></g>)}
      {/* steam leaking at the rim: more and denser as the pressure builds */}
      <Puffs f={f} n={9} x0={POT.x - POT.w / 2 + 16} y0={POT.top - 6} rise={130 + 90 * pop} drift={-26} r0={10} r1={34 + 22 * pop} speed={0.006 + 0.004 * p} seed={3} spread={14} op={steam} wob={8}/>
      <Puffs f={f} n={9} x0={POT.x + POT.w / 2 - 16} y0={POT.top - 6} rise={130 + 90 * pop} drift={30} r0={10} r1={34 + 22 * pop} speed={0.006 + 0.004 * p} seed={4} spread={14} op={steam} wob={8}/>
      <Puffs f={f} n={7} x0={POT.x} y0={POT.top - 30} rise={210 + 140 * pop} drift={10} r0={16} r1={46 + 26 * pop} speed={0.005 + 0.004 * pop} seed={6} spread={60} op={Math.max(0, p - 0.5) * 1.6} wob={12}/>
      {/* the lid, rattling about its far rim */}
      <g transform={`translate(${lidCx} ${lidY}) rotate(${tilt} ${POT.w / 2 - 10} 0)`}>
        <ellipse cx={0} cy={4} rx={POT.w / 2 + 8} ry={9} fill="#9aa5b0" stroke="#5a636e" strokeWidth={2.4}/>
        <path d={`M${-POT.w / 2 - 6},4 Q${-POT.w / 2 + 40},-62 0,-64 Q${POT.w / 2 - 40},-62 ${POT.w / 2 + 6},4 Z`} fill="url(#v1k-lid)" stroke="#5a636e" strokeWidth={3}/>
        <path d={`M${-POT.w / 2 + 40},-14 Q${-POT.w / 2 + 70},-48 -30,-54`} stroke="#fff" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.7}/>
        <rect x={-9} y={-82} width={18} height={20} rx={5} fill="#262a30"/><ellipse cx={0} cy={-84} rx={22} ry={9} fill="#262a30" stroke="#101216" strokeWidth={2}/>
        <ellipse cx={-70} cy={-50} rx={4} ry={3} fill="#262a30"/>
      </g>
      {/* tiny puffs at the rattling gap */}
      {Array.from({length: 6}).map((_, i) => {
        const u = (f * 0.03 * (0.6 + p) + i / 6) % 1, side = i % 2 ? 1 : -1, g = lift > 3 ? 1 : 0.2;
        return <circle key={i} cx={POT.x + side * (POT.w / 2 - 6 + u * 24)} cy={POT.top - 6 - u * 46} r={5 + u * 13} fill="#fff" opacity={(1 - u) * 0.8 * g * steam}/>;
      })}
    </g>
  );
};

export const PotLabels = mkLabels({pb: {cx: 1470, y: 250, size: 44, maxW: 640, tone: "dark"}, q: {cx: 1470, y: 440, size: 40, maxW: 640}});
