// POL-03 Part 1, builder W1: `ghat-steps` (mode "dawn" s001, mode "open" s014). River steps seen from the water, people walking down; the words of
// Art. 15(2) engraved on the lowest step. In "open" the scene is by day and two side panels appear: a bus seat for women, a ramp at a school.
import React from "react";
import {SANS, SERIF, W, clamp, eo, eio} from "../kit";
import {Cloud, Hills, Person, Sun, Tree, prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";

const TOP = 400, LEDGE = 772; // top of the steps, foot of the steps (feet line of the walkers)
const stepYs = (() => { const ys = [TOP]; let h = 30; while (ys[ys.length - 1] < LEDGE - 4) { ys.push(ys[ys.length - 1] + h); h *= 1.17; } return ys; })();

const Pavilion: React.FC<{x: number; y: number; s: number; col: string; sh: string}> = ({x, y, s, col, sh}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-70} y={-110} width={140} height={110} fill={col}/><rect x={0} y={-110} width={70} height={110} fill={sh} opacity={0.35}/>
    {[-52, -17, 17, 52].map((px) => <rect key={px} x={px - 7} y={-104} width={14} height={104} fill={sh} opacity={0.5}/>)}
    <path d="M-82,-110 Q0,-190 82,-110 Z" fill={col}/><path d="M0,-150 Q40,-140 82,-110 L0,-110 Z" fill={sh} opacity={0.35}/>
    <rect x={-3} y={-200} width={6} height={30} fill={sh}/><circle cy={-204} r={7} fill="#e3a53a"/>
  </g>
);
const Temple: React.FC<{x: number; y: number; s: number; col: string; sh: string}> = ({x, y, s, col, sh}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={-80} width={120} height={80} fill={col}/>
    <path d="M-52,-80 Q-44,-170 -4,-250 L4,-250 Q44,-170 52,-80 Z" fill={col}/><path d="M4,-250 Q44,-170 52,-80 L0,-80 L0,-250 Z" fill={sh} opacity={0.35}/>
    {[-100, -130, -160, -190].map((yy, i) => <path key={i} d={`M${-46 + i * 8},${yy} H${46 - i * 8}`} stroke={sh} strokeWidth={3} opacity={0.4}/>)}
    <rect x={-3} y={-290} width={6} height={44} fill={sh}/><circle cy={-292} r={6} fill="#e3a53a"/>
    <path d="M-16,0 V-38 Q0,-56 16,-38 V0 Z" fill={sh} opacity={0.6}/>
  </g>
);

/** a woman's symbol: head and a triangular dress */
const WomanGlyph: React.FC<{x: number; y: number; s: number; c: string}> = ({x, y, s, c}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={c}><circle cy={-20} r={9}/><path d="M0,-10 L-14,24 H14 Z"/></g>
);

const BusPanel: React.FC<{a: number; f: number}> = ({a, f}) => (
  <g transform={`translate(1600 ${420 + (1 - a) * 30})`} opacity={a}>
    <rect x={-210} y={-180} width={420} height={360} rx={22} fill="#fffaf0" stroke="#b8a074" strokeWidth={2.4} style={{filter: "drop-shadow(0 18px 16px rgba(40,22,8,.35))"}}/>
    <clipPath id="w1-bus"><rect x={-190} y={-160} width={380} height={320} rx={14}/></clipPath>
    <g clipPath="url(#w1-bus)">
      <rect x={-190} y={-160} width={380} height={320} fill="#e9e2cc"/>
      <rect x={-190} y={-160} width={380} height={140} fill="#bfd9e8"/>
      <path d={`M-190,-60 Q-100,-100 -20,-70 T190,-80 V-20 H-190 Z`} fill="#8fb98a"/>
      {[0, 1, 2].map((i) => <rect key={i} x={-190 + i * 140 - ((f * 0.7) % 140) + 0} y={-160} width={8} height={140} fill="#9a8a6a" opacity={0.7}/>)}
      <rect x={-190} y={-26} width={380} height={12} fill="#7a6a4a"/>
      <rect x={-190} y={-14} width={380} height={174} fill="#cdbf9c"/>
      {[-120, -10, 100].map((sx, i) => (
        <g key={sx} transform={`translate(${sx} 60)`}>
          <rect x={-50} y={-70} width={100} height={92} rx={14} fill={i === 1 ? "#d8688a" : "#3f6f9a"}/>
          <rect x={-58} y={-8} width={116} height={52} rx={12} fill={i === 1 ? "#b84a6c" : "#2c5278"}/>
          <rect x={-46} y={40} width={10} height={24} fill="#4a4a4a"/><rect x={36} y={40} width={10} height={24} fill="#4a4a4a"/>
          {i === 1 && <><circle cy={-30} r={22} fill="#fff4ea"/><WomanGlyph x={0} y={-30} s={0.8} c="#b84a6c"/></>}
        </g>
      ))}
      <path d="M-190,-100 H190" stroke="#b9b9b2" strokeWidth={7}/>
      {[-60, 60].map((hx) => <path key={hx} d={`M${hx},-100 v26 q0,10 8,10`} stroke="#d8d8d0" strokeWidth={4} fill="none"/>)}
    </g>
  </g>
);

const RampPanel: React.FC<{a: number; f: number}> = ({a, f}) => {
  const k = prog(f, 0, 1), w = Math.sin(f / 5) * 2;
  return (
    <g transform={`translate(320 ${420 + (1 - a) * 30})`} opacity={a}>
      <rect x={-210} y={-180} width={420} height={360} rx={22} fill="#fffaf0" stroke="#b8a074" strokeWidth={2.4} style={{filter: "drop-shadow(0 18px 16px rgba(40,22,8,.35))"}}/>
      <clipPath id="w1-ramp"><rect x={-190} y={-160} width={380} height={320} rx={14}/></clipPath>
      <g clipPath="url(#w1-ramp)">
        <rect x={-190} y={-160} width={380} height={320} fill="#cfe3ee"/>
        <circle cx={140} cy={-110} r={28} fill="#ffe08a"/>
        <rect x={-190} y={96} width={380} height={64} fill="#a9b98a"/>
        <rect x={-120} y={-70} width={240} height={166} fill="#d9a46a"/><rect x={0} y={-70} width={120} height={166} fill="#b98450" opacity={0.5}/>
        <path d="M-136,-70 L0,-130 L136,-70 Z" fill="#a8532f"/>
        {[-84, -34, 34, 84].map((wx) => <rect key={wx} x={wx - 16} y={-44} width={32} height={34} fill="#eaf3f6" stroke="#8a6a4a" strokeWidth={2}/>)}
        <rect x={-26} y={14} width={52} height={82} fill="#6f4426"/><circle cx={14} cy={58} r={3} fill="#e3a53a"/>
        <path d="M-190,96 H-24 L-120,140 H-190 Z" fill="none"/>
        <path d="M-186,152 L-30,100 L-30,152 Z" fill="#d8cdb0" stroke="#9a8a6a" strokeWidth={2}/>
        <path d="M-182,118 L-28,64" stroke="#7d8a94" strokeWidth={5} strokeLinecap="round"/>
        <path d="M-160,126 v-18 M-110,109 v-18 M-60,92 v-18" stroke="#7d8a94" strokeWidth={3.5}/>
        <g transform={`translate(${-100 + w * 0} 100)`}><Person x={0} y={0} h={118} f={f} seed={61} walk ph={k}/></g>
      </g>
    </g>
  );
};

export const GhatArt: React.FC<AP> = (p) => {
  const {f, dur} = p, open = (p.spec as any).mode === "open", L = rlabs(p);
  const pl = L.find((_, i) => (p.spec.labels ?? [])[i]?.key === "pl"), a1 = L.find((_, i) => (p.spec.labels ?? [])[i]?.key === "a1");
  const wc = open ? Math.min(p.at("wc"), dur - 80) : 1e9, plA = pl ? eo(prog(f, pl.at, 20)) : 0, a1A = a1 ? eo(prog(f, a1.at, 16)) : 0;
  const warm = open ? 0 : 1;
  const walkers = open
    ? [[760, 0.0, 11], [900, 0.17, 12], [1040, 0.34, 13], [1170, 0.51, 14], [830, 0.68, 15], [1100, 0.85, 16]]
    : [[330, 0.0, 11], [520, 0.14, 12], [700, 0.28, 13], [900, 0.42, 14], [1100, 0.56, 15], [1290, 0.7, 16], [1480, 0.84, 17], [1620, 0.35, 18]];
  const px = (x: number, u: number) => x + (x < 960 ? 1 : -1) * 40 * Math.sin(u * 6.28 + x) + (960 - x) * 0.08 * u;
  return (
    <g>
      <defs>
        <linearGradient id="w1g-sky" x1="0" y1="0" x2="0" y2="1">
          {open ? <><stop offset="0" stopColor="#8fc0e6"/><stop offset="1" stopColor="#e9f1e6"/></> : <><stop offset="0" stopColor="#6d84b6"/><stop offset="0.55" stopColor="#f0b987"/><stop offset="1" stopColor="#ffe1a6"/></>}
        </linearGradient>
        <linearGradient id="w1g-water" x1="0" y1="0" x2="0" y2="1">
          {open ? <><stop offset="0" stopColor="#7fb5c8"/><stop offset="1" stopColor="#3f7f98"/></> : <><stop offset="0" stopColor="#e9b483"/><stop offset="0.5" stopColor="#8f93a8"/><stop offset="1" stopColor="#4d5f84"/></>}
        </linearGradient>
        <linearGradient id="w1g-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={open ? "#e6d3ae" : "#e8c79c"}/><stop offset="1" stopColor={open ? "#cdb88e" : "#cfa479"}/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={TOP + 80} fill="url(#w1g-sky)"/>
      {open ? <Sun x={1500} y={170} r={52} f={f} glow={0.8}/> : <g><circle cx={1180} cy={TOP - 10} r={260} fill="url(#ak-sunglow)" opacity={0.9}/><circle cx={1180} cy={TOP - 6} r={64} fill="url(#ak-sundisc)"/></g>}
      <Cloud x={60} y={150} s={1.4} a={open ? 0.9 : 0.55} f={f} seed={1} speed={0.05}/><Cloud x={400} y={110} s={1.1} a={open ? 0.85 : 0.5} f={f} seed={2} speed={0.05}/>
      <Hills id="w1g-h1" base={TOP - 20} amp={50} top={open ? "#a7c3d6" : "#b5a6b8"} bottom={open ? "#c9dad6" : "#e0b9a0"} seed={1.3} wl={260} bottomY={TOP + 20}/>
      {/* far skyline of shrines and trees along the top of the ghat */}
      <g opacity={0.92}>
        <Temple x={260} y={TOP + 6} s={0.9} col={open ? "#e8dcc2" : "#e2b995"} sh={open ? "#a8987a" : "#9a6a58"}/>
        <Pavilion x={620} y={TOP + 6} s={0.95} col={open ? "#eadfc7" : "#e6c29c"} sh={open ? "#a8987a" : "#9a6a58"}/>
        <Temple x={1000} y={TOP + 6} s={1.15} col={open ? "#ecdfc4" : "#e8c29a"} sh={open ? "#a8987a" : "#9a6a58"}/>
        <Pavilion x={1360} y={TOP + 6} s={0.9} col={open ? "#eadfc7" : "#e6c29c"} sh={open ? "#a8987a" : "#9a6a58"}/>
        <Temple x={1680} y={TOP + 6} s={0.8} col={open ? "#e8dcc2" : "#e2b995"} sh={open ? "#a8987a" : "#9a6a58"}/>
        <Tree x={470} y={TOP + 12} s={0.7} f={f} seed={3} hue={-6}/><Tree x={830} y={TOP + 12} s={0.62} f={f} seed={4} hue={-10}/><Tree x={1190} y={TOP + 12} s={0.7} f={f} seed={7} hue={-4}/><Tree x={1520} y={TOP + 12} s={0.65} f={f} seed={9} hue={-8}/>
      </g>
      {/* the steps, from the top down to the ledge */}
      {stepYs.slice(0, -1).map((y0, i) => {
        const y1 = stepYs[i + 1], tr = (y1 - y0) * 0.3, shade = 1 - i * 0.012;
        return (
          <g key={i}>
            <rect x={-60} y={y0} width={W + 120} height={tr} fill={open ? "#f4e7c6" : "#f6d7a8"}/>
            <rect x={-60} y={y0 + tr} width={W + 120} height={y1 - y0 - tr} fill="url(#w1g-stone)" opacity={shade}/>
            <rect x={-60} y={y0 + tr} width={W + 120} height={3} fill={open ? "#a89470" : "#a07658"} opacity={0.55}/>
            {Array.from({length: 7}).map((_, k) => <rect key={k} x={((k * 313 + i * 97) % 1900)} y={y0 + tr + 6} width={2} height={Math.max(4, y1 - y0 - tr - 12)} fill="#9a8260" opacity={0.18}/>)}
          </g>
        );
      })}
      <rect x={-60} y={LEDGE - 2} width={W + 120} height={4} fill="#8a6c4c" opacity={0.5}/>
      {/* the engraved ledge: the words of the article */}
      <g>
        <rect x={-60} y={LEDGE} width={W + 120} height={74} fill={open ? "#cdb88c" : "#c9a276"}/><rect x={-60} y={LEDGE} width={W + 120} height={8} fill={open ? "#ece0c0" : "#f0d4a8"}/>
        {pl && (() => { const fs = Math.min(34, 1500 / (pl.text.length * 0.52)); return (
          <g opacity={plA} transform={`translate(0 ${(1 - plA) * 6})`}>
            <text x={961} y={LEDGE + 49} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={fs} letterSpacing="0.05em" fill="#f5e6c2" opacity={0.9}>{pl.text.toUpperCase()}</text>
            <text x={960} y={LEDGE + 48} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={fs} letterSpacing="0.05em" fill="#6a4426">{pl.text.toUpperCase()}</text>
          </g>); })()}
      </g>
      {/* water below the ledge */}
      <rect x={-60} y={LEDGE + 74} width={W + 120} height={400} fill="url(#w1g-water)"/>
      {Array.from({length: 26}).map((_, i) => {
        const y = LEDGE + 92 + (i % 9) * 22, x = (i * 211 + f * (0.4 + (i % 4) * 0.12)) % (W + 200) - 100, ln = 70 + (i % 5) * 26;
        return <path key={i} d={`M${x},${y} q${ln / 4},-5 ${ln / 2},0 t${ln / 2},0`} stroke={open ? "#e9f4f4" : "#ffe6bd"} strokeWidth={2.4} fill="none" opacity={0.5} strokeLinecap="round"/>;
      })}
      {!open && <path d={`M1180,${LEDGE + 80} L1180,1080`} stroke="#ffd08a" strokeWidth={90} opacity={0.12}/>}
      {/* walkers: they come down from the top and reach the ledge, then fade */}
      {walkers.map(([bx, off, seed], i) => {
        const u = ((f / 330 + off) % 1), y = TOP + 22 + u * (LEDGE - TOP - 22), h = 150 + u * 250;
        const op = Math.min(1, u * 10) * Math.min(1, (1 - u) * 9);
        return <g key={i}><Person x={px(bx as number, u)} y={y} h={h} f={f} seed={seed as number} walk ph={i * 2.1} op={op} flip={i % 2 === 0}/></g>;
      })}
      {/* the plaque on the central wall */}
      {a1 && (
        <g opacity={a1A} transform={`translate(960 ${TOP + 74 - (1 - a1A) * 8})`}>
          <rect x={-190} y={-34} width={380} height={68} rx={10} fill="#b88a3a" stroke="#6a4a1c" strokeWidth={3} style={{filter: "drop-shadow(0 8px 6px rgba(40,22,8,.35))"}}/>
          <rect x={-182} y={-26} width={364} height={52} rx={6} fill="none" stroke="#f2d27a" strokeWidth={2}/>
          <text x={0} y={10} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={36} letterSpacing="0.05em" fill="#3a2410">{a1.text}</text>
        </g>
      )}
      <rect x={-60} y={TOP - 30} width={W + 120} height={LEDGE - TOP + 120} fill={open ? "none" : "#f0a56a"} opacity={warm * 0.1}/>
      {open && <>
        <BusPanel a={eo(prog(f, wc, 22))} f={f}/>
        <RampPanel a={eo(prog(f, wc + 16, 22))} f={f}/>
      </>}
    </g>
  );
};

export const GhatLabels: React.FC<AP> = (p) => {
  const open = (p.spec as any).mode === "open", L = rlabs(p), labs = (p.spec.labels ?? []) as {key: string}[];
  const g = (k: string) => { const i = labs.findIndex((l) => l.key === k); return i >= 0 ? L[i] : undefined; };
  const a15 = g("a15"), wr = g("wr"), wc = g("wc");
  return open ? (
    <>
      {a15 && <P2Card cx={960} y={86} text={a15.text} f={p.f} at={a15.at} size={50} maxW={900}/>}
      {wr && <P2Card cx={320} y={650} text={wr.text} f={p.f} at={wr.at} size={27} maxW={420} upper={false} tone="green"/>}
      {wc && <P2Card cx={1600} y={650} text={wc.text} f={p.f} at={wc.at} size={30} maxW={420} upper={false}/>}
    </>
  ) : null;
};
