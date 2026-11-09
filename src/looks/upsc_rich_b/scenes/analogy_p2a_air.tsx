// Part 2 analogy "orographic" (Western Ghats cross-section, optional rain shadow) and "rain-types" (three panels). Labels only from at(key).
import React from "react";
import {SANS, W, H, clamp, eo, eio, rng} from "../kit";
import {FlowArrow, LabelCard, Shimmer, Sun, Tree, lerp, prog, type AP, type Pt} from "./analogy_kit";
import {Puff, Rain, Sky, items} from "./analogy_p2a_parts";

// ---- orographic ---------------------------------------------------------------------------------------------------------------
const PROF: Pt[] = [[470, 702], [480, 690], [560, 650], [700, 482], [820, 342], [900, 298], [990, 342], [1150, 482], [1300, 570], [1500, 606], [1980, 612]];
const profY = (x: number) => {
  if (x <= PROF[0][0]) return PROF[0][1];
  for (let i = 1; i < PROF.length; i++) if (x <= PROF[i][0]) { const [x0, y0] = PROF[i - 1], [x1, y1] = PROF[i]; return lerp(y0, y1, (x - x0) / (x1 - x0)); }
  return PROF[PROF.length - 1][1];
};
const landPath = () => `M380,1140 L${PROF.map(([x, y]) => `${x},${y}`).join(" L")} L1980,1140 Z`;
const lineD = (dy: number, x0 = -60, x1 = 1980) => { let d = ""; for (let x = x0; x <= x1; x += 20) d += `${d ? " L" : "M"}${x},${(profY(x) + dy).toFixed(1)}`; return d; };

const Palm: React.FC<{x: number; y: number; s: number; f: number; seed: number}> = ({x, y, s, f, seed}) => {
  const sw = Math.sin(f / 21 + seed) * 2.5;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M-4,0 Q${-26 + sw * 0.4},-90 ${-14 + sw},-170 L${-2 + sw},-170 Q${8},-90 8,0 Z`} fill="#8a6038" stroke="#4f3418" strokeWidth={1.6}/>
      {[-70, -35, -8, 22, 55, 85].map((a, i) => <path key={i} d={`M${-8 + sw},-170 Q${-8 + sw + Math.sin((a * Math.PI) / 180) * 60},${-200 - Math.abs(a) * 0.15} ${-8 + sw + Math.sin((a * Math.PI) / 180) * 104},${-150 + Math.abs(a) * 0.45} Q${-8 + sw + Math.sin((a * Math.PI) / 180) * 62},${-186 - Math.abs(a) * 0.1} ${-8 + sw},-166 Z`} fill={i % 2 ? "#3f8a48" : "#58a352"} stroke="#2a5c30" strokeWidth={1.4}/>)}
      <circle cx={-6 + sw} cy={-166} r={7} fill="#6b4a26"/>
    </g>
  );
};

const Oro: React.FC<AP & {lee: boolean}> = ({f, dur, lee, ...p}) => {
  const its = items({f, dur, ...p} as AP), d0 = lee ? -140 : 26;
  const arrow = eo(prog(f, lee ? 2 : 10, lee ? 40 : 70));
  const leeP = lee ? eo(prog(f, 14, 110)) : 0, dryT = lee ? eo(prog(f, 40, 120)) : 0.25;
  const wob = Math.sin(f / 19) * 3;
  const rainP = eo(prog(f, d0 + 64, 60));
  const ww = its[1];
  const leader = ww ? eo(prog(f, ww.at + 8, 26)) : 0;
  const clouds = [{x: 640, y: 392, s: 0.95, seed: 1}, {x: 745, y: 330, s: 1.1, seed: 2}, {x: 860, y: 250, s: 1.15, seed: 3}, {x: 560, y: 470, s: 0.8, seed: 5}, {x: 960, y: 222, s: 0.8, seed: 6}];
  return (
    <g>
      <Sky id="p2o-sky" a="#86bde6" b="#f6ead0" h={760}/>
      <Sun x={1650} y={180} r={58} f={f}/>
      <Puff x={250} y={170} s={0.7} grow={1} seed={9} f={f} a={0.85}/><Puff x={1330} y={120} s={0.6} grow={1} seed={10} f={f} a={0.8}/>
      {/* far, hazy ridges */}
      <path d={`M440,702 L600,580 L760,420 L880,320 L1000,262 L1120,320 L1300,470 L1500,560 L1980,580 L1980,760 L440,760 Z`} fill="#b7cde0" opacity={0.7}/>
      <path d={`M960,560 L1180,430 L1340,470 L1520,420 L1700,470 L1980,450 L1980,700 L960,700 Z`} fill="#c8d8e4" opacity={0.65}/>
      {/* sea */}
      <defs>
        <linearGradient id="p2o-sea" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stopColor="#58b4c4"/><stop offset="0.45" stopColor="#2f86b0"/><stop offset="1" stopColor="#1b4f86"/></linearGradient>
        <linearGradient id="p2o-land" x1="440" y1="0" x2="1980" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#437f4e"/><stop offset="0.2" stopColor="#5f9a58"/><stop offset="0.36" stopColor="#8aae62"/><stop offset="0.43" stopColor="#c0b075"/><stop offset="0.65" stopColor="#d4b072"/><stop offset="1" stopColor="#c99d5e"/>
        </linearGradient>
        <linearGradient id="p2o-dry" x1="880" y1="0" x2="1980" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#a8703a" stopOpacity="0"/><stop offset="0.25" stopColor="#a8703a" stopOpacity="0.9"/><stop offset="1" stopColor="#8a5a2c"/></linearGradient>
        <linearGradient id="p2o-shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#1d3a52" stopOpacity="0.4"/><stop offset="1" stopColor="#1d3a52" stopOpacity="0"/></linearGradient>
        <clipPath id="p2o-clip"><path d={landPath()}/></clipPath>
      </defs>
      <path d="M-60,702 H470 L380,1140 H-60 Z" fill="url(#p2o-sea)"/>
      {Array.from({length: 11}, (_, i) => <path key={i} d={`M${-20 + (i % 4) * 110},${722 + i * 30} q26,-10 52,0 q26,10 52,0`} stroke="#e9f8ff" strokeWidth={2.6} fill="none" opacity={0.3 + 0.2 * Math.sin(f / 13 + i)} transform={`translate(${Math.sin(f / 36 + i) * 10} 0)`}/>)}
      <ellipse cx={200} cy={708} rx={300} ry={10} fill="#fff6cc" opacity={0.25}/>
      {/* dhow on the sea */}
      <g transform={`translate(262 ${704 + Math.sin(f / 17) * 3}) rotate(${Math.sin(f / 21) * 2})`}>
        <path d="M-54,0 Q-40,26 0,28 Q44,26 60,-4 Z" fill="#7a4a24" stroke="#3f2810" strokeWidth={2}/>
        <line x1={4} y1={0} x2={4} y2={-92} stroke="#3f2810" strokeWidth={3}/><path d="M8,-90 Q54,-44 30,-8 L8,-8 Z" fill="#fff4de" stroke="#b79a64" strokeWidth={1.6}/>
      </g>
      {/* land */}
      <ellipse cx={940} cy={310} rx={420} ry={60} fill="#fff0c0" opacity={0.0}/>
      <path d={landPath()} fill="url(#p2o-land)"/>
      <g clipPath="url(#p2o-clip)">
        <rect x={880} y={200} width={1110} height={940} fill="url(#p2o-dry)" opacity={dryT * 0.85}/>
        <rect x={480} y={200} width={460} height={700} fill="url(#p2o-shade)"/>
        {Array.from({length: 190}, (_, i) => { const r = rng(i * 31 + 7), x = 470 + r() * 430, y = profY(x) + 8 + r() * 240, rr = 4 + r() * 8; return (
          <g key={i}><circle cx={x + 2} cy={y + 3} r={rr} fill="#274f2e" opacity={0.55}/><circle cx={x} cy={y} r={rr} fill={r() > 0.5 ? "#3f7a46" : "#52904f"}/><circle cx={x - rr * 0.3} cy={y - rr * 0.35} r={rr * 0.5} fill="#7fb866" opacity={0.7}/></g>); })}
        {[0, 1, 2, 3, 4, 5].map((i) => { const x0 = 560 + i * 52; return <path key={i} d={`M${x0 + 150},${profY(x0 + 150) + 6} q${-60 - i * 6},${90} ${-130 - i * 24},${220 - i * 12}`} stroke="rgba(25,55,40,.45)" strokeWidth={4} fill="none" strokeLinecap="round"/>; })}
        {Array.from({length: 8}, (_, i) => <path key={i} d={lineD(34 + i * 38)} fill="none" stroke={i % 2 ? "rgba(70,44,20,.22)" : "rgba(255,244,210,.3)"} strokeWidth={i % 2 ? 1.8 : 2.4}/>)}
        {/* ridges on the lit east face */}
        {[0, 1, 2, 3, 4].map((i) => { const x = 930 + i * 52; return <path key={i} d={`M${x},${profY(x)} q${18},${60} ${52},${150}`} stroke="rgba(80,50,22,.22)" strokeWidth={5} fill="none"/>; })}
      </g>
      <path d={lineD(0, 470, 1980)} fill="none" stroke="#3e5a34" strokeWidth={2.4} opacity={0.7}/>
      <path d={lineD(-3, 880, 990)} fill="none" stroke="#fff6dc" strokeWidth={3} opacity={0.6}/>
      {/* west face: forest and palms; east face: dry scrub and cracks */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => { const x = 506 + i * 36 + (i % 3) * 7; return <Tree key={i} x={x} y={profY(x) + 5} s={0.19 + (i % 3) * 0.035} bend={-3} f={f} seed={i + 3} hue={i % 2 ? 6 : -6}/>; })}
      {[470, 506, 530].map((x, i) => <Palm key={i} x={x + 10} y={profY(x + 10) + 3} s={0.4 - i * 0.04} f={f} seed={i}/>)}
      {Array.from({length: 13}, (_, i) => { const x = 1060 + i * 66 + (i % 3) * 14, y = profY(x) + 14 + (i % 2) * 22; return (
        <g key={i} opacity={0.55 + dryT * 0.4}><ellipse cx={x} cy={y} rx={22} ry={9} fill="#6b5a2c"/><ellipse cx={x - 4} cy={y - 6} rx={15} ry={9} fill="#8a7a3e"/></g>); })}
      {[1420, 1610, 1790].map((x, i) => { const y = profY(x) + 10; return (
        <g key={`ac${i}`} transform={`translate(${x} ${y}) scale(${0.9 - i * 0.12})`} opacity={0.9}>
          <ellipse cx={10} cy={4} rx={60} ry={8} fill="#2a1a0c" opacity={0.25}/>
          <path d="M-5,0 Q-2,-40 -14,-78 M-3,-36 Q20,-60 38,-84" stroke="#5a3d22" strokeWidth={7} fill="none" strokeLinecap="round"/>
          <ellipse cx={-6} cy={-92} rx={64} ry={20} fill="#6b7a3a" stroke="#3f4a22" strokeWidth={1.6}/><ellipse cx={40} cy={-96} rx={36} ry={13} fill="#7b8a44"/>
        </g>); })}
      {lee && Array.from({length: 7}, (_, i) => { const x = 1250 + i * 90, y = 650 + (i % 3) * 36; return <path key={i} d={`M${x},${y} l22,-9 l10,12 l22,-6 M${x + 22},${y - 9} l-6,-14`} stroke="#5a3a1c" strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={dryT * 0.8}/>; })}
      {/* moist wind from the sea */}
      <FlowArrow pts={[[30, 630], [300, 622 + wob], [480, 604], [600, 548], [700, 430], [800, 312], [890, 226]]} f={f} p={arrow} w={26} c1="#3b9ad6" c2="#bfe6fa" dark="#1b4f7e" speed={1.8}/>
      <FlowArrow pts={[[30, 684], [300, 676], [470, 660]]} f={f} p={arrow} w={14} c1="#5bb0e0" c2="#d6f0ff" dark="#1b4f7e" speed={1.4} op={0.85}/>
      {/* cloud piling on the windward face */}
      {clouds.map((c, i) => <Puff key={i} x={c.x} y={c.y} s={c.s} grow={eo(prog(f, d0 + i * 16, 54))} seed={c.seed} f={f} dark={i < 3 && rainP > 0.2}/>)}
      <Rain x0={540} x1={780} top={(x) => Math.min(profY(x) - 40, 400 + (x - 540) * 0.18)} bottom={(x) => profY(x) + 6} f={f} n={34} p={rainP} col="#e6f4ff" slant={18} sp={1.3}/>
      {/* windward bracket and leader */}
      {ww && (
        <g opacity={leader}>
          <path d={lineD(-18, 520, 770)} fill="none" stroke="#2f78b8" strokeWidth={5} strokeLinecap="round" strokeDasharray="14 12" strokeDashoffset={-f * 0.5}/>
          <path d={`M420,${770} Q500,690 600,${profY(600) - 14}`} fill="none" stroke="#2f78b8" strokeWidth={3} strokeLinecap="round" strokeDasharray="8 9"/>
        </g>
      )}
      {/* lee side: air slides down, warm and dry */}
      {lee && (
        <g>
          <FlowArrow pts={[[960, 212], [1090, 296], [1240, 430], [1420, 520], [1700, 556]]} f={f} p={leeP} w={26} c1="#e8913a" c2="#ffd89a" dark="#8a3f10" speed={1.8}/>
          {[0, 1, 2, 3].map((k) => <g key={k} opacity={leeP}><Shimmer x={1160 + k * 120} y={profY(1160 + k * 120) - 8} hgt={150} f={f} k={k * 0.23} col="#d8681f" w={4}/></g>)}
          {[0, 1, 2].map((k) => <ellipse key={k} cx={980 + k * 70} cy={236 + k * 24} rx={52 - k * 12} ry={14} fill="#fff" opacity={0.5 * (1 - k / 3) * (1 - leeP * 0.6)}/>)}
        </g>
      )}
      <path d="M440,702 Q470,710 500,700" stroke="#fff" strokeWidth={4} fill="none" opacity={0.6}/>
    </g>
  );
};
void SANS; void W; void H; void clamp; void eio; void rng;

const OroLabels = (lee: boolean): React.FC<AP> => (p) => {
  const its = items(p);
  return (
    <>
      {its[0] && <LabelCard cx={430} y={120} text={its[0].text} f={p.f} at={its[0].at} size={42} maxW={640} tone="cool"/>}
      {its[1] && <LabelCard cx={330} y={756} text={its[1].text} f={p.f} at={its[1].at} size={30} maxW={560} tone="cool"/>}
      {lee && its[2] && <LabelCard cx={1520} y={672} text={its[2].text} f={p.f} at={its[2].at} size={44} maxW={640}/>}
    </>
  );
};

// ---- rain-types ---------------------------------------------------------------------------------------------------------------
const PX0 = [120, 690, 1260], PY0 = 130, PWD = 540, PHT = 620;

const Panel: React.FC<{i: number; at: number; f: number; children: (lf: number) => React.ReactNode; bg: [string, string]}> = ({i, at, f, children, bg}) => {
  const a = eo(prog(f, at, 14));
  if (a <= 0.001) return null;
  const x0 = PX0[i], lf = f - at, id = `p2r-${i}`;
  return (
    <g opacity={a} transform={`translate(0 ${(1 - a) * 26})`}>
      <defs>
        <clipPath id={`${id}c`}><rect x={x0} y={PY0} width={PWD} height={PHT} rx={26}/></clipPath>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={bg[0]}/><stop offset="1" stopColor={bg[1]}/></linearGradient>
      </defs>
      <rect x={x0 - 12} y={PY0 - 12} width={PWD + 24} height={PHT + 24} rx={34} fill="#fffaf0" stroke="#8a6a3e" strokeWidth={2} style={{filter: "drop-shadow(0 22px 20px rgba(60,34,12,.42))"}}/>
      <g clipPath={`url(#${id}c)`}>
        <rect x={x0} y={PY0} width={PWD} height={PHT} fill={`url(#${id}s)`}/>
        <g transform={`translate(${x0} ${PY0})`}>{children(lf)}</g>
      </g>
    </g>
  );
};

const Convect = (lf: number) => {
  const up = eio(prog(lf, 16, 110)), by = lerp(500, 190, up), br = lerp(34, 74, up), cg = eo(prog(lf, 90, 56)), rp = eo(prog(lf, 150, 50));
  return (
    <g>
      <Sun x={104} y={98} r={38} f={lf} glow={1.2}/>
      <path d="M0,330 Q140,290 300,320 T540,300 V620 H0 Z" fill="#b9cfe0" opacity={0.6}/>
      <defs>
        <linearGradient id="p2r-hot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8c27a"/><stop offset="1" stopColor="#b57a3a"/></linearGradient>
        <radialGradient id="p2r-bub" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#ffd9a0" stopOpacity="0.9"/><stop offset="0.7" stopColor="#f08a3c" stopOpacity="0.55"/><stop offset="1" stopColor="#d8481f" stopOpacity="0.45"/></radialGradient>
      </defs>
      <rect x={0} y={520} width={540} height={120} fill="url(#p2r-hot)"/>
      <path d="M0,522 Q130,506 270,522 T540,520 V532 H0 Z" fill="#f2d493" opacity={0.8}/>
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M${30 + i * 60},${560 + (i % 3) * 20} l14,-10 l-5,-12 M${54 + i * 60},${590 + (i % 2) * 14} l-12,-8`} stroke="#7a4a22" strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.7}/>)}
      {[0, 1, 2, 3, 4, 5, 6].map((k) => <Shimmer key={k} x={50 + k * 72} y={520} hgt={150 + (k % 3) * 40} f={lf} k={k * 0.17} col="#d8481f" w={4}/>)}
      <g transform={`translate(270 ${by})`} opacity={clamp(1 - cg * 0.9) * 1}>
        <ellipse cx={0} cy={0} rx={br} ry={br * 1.18} fill="url(#p2r-bub)" stroke="#c0481f" strokeWidth={2}/>
        <ellipse cx={-br * 0.3} cy={-br * 0.4} rx={br * 0.28} ry={br * 0.18} fill="#fff" opacity={0.5}/>
        <path d={`M0,${br * 1.18} q-10,28 0,50 q10,22 0,40`} stroke="#d8481f" strokeWidth={4} fill="none" opacity={0.5}/>
      </g>
      <Puff x={300} y={196} s={1.0} grow={cg} dark={rp > 0.3} seed={11} f={lf}/>
      <Rain x0={150} x1={400} top={240} bottom={528} f={lf} n={30} p={rp} col="#e6f4ff" slant={10} sp={1.4}/>
    </g>
  );
};

const OroMini = (lf: number) => {
  const prof = (x: number) => (x < 90 ? 520 : x < 290 ? lerp(520, 210, (x - 90) / 200) : x < 340 ? lerp(210, 232, (x - 290) / 50) : x < 540 ? lerp(232, 470, (x - 340) / 200) : 470);
  const d = (() => { let s = "M0,640 L0,520"; for (let x = 0; x <= 540; x += 12) s += ` L${x},${prof(x)}`; return s + " L540,640 Z"; })();
  const arr = eo(prog(lf, 8, 60)), cg = eo(prog(lf, 50, 56)), rp = eo(prog(lf, 110, 50));
  return (
    <g>
      <Sun x={452} y={96} r={34} f={lf} glow={1.1}/>
      <path d="M0,400 L120,330 L260,200 L340,230 L540,380 V560 H0 Z" fill="#b7cde0" opacity={0.6}/>
      <defs><linearGradient id="p2r-m" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#437f4e"/><stop offset="0.45" stopColor="#7aa85c"/><stop offset="0.6" stopColor="#c8b27a"/><stop offset="1" stopColor="#c99d5e"/></linearGradient></defs>
      <path d={d} fill="url(#p2r-m)" stroke="#3e5a34" strokeWidth={2}/>
      {Array.from({length: 4}, (_, i) => { let s = ""; for (let x = 0; x <= 540; x += 14) s += `${s ? " L" : "M"}${x},${prof(x) + 40 + i * 34}`; return <path key={i} d={s} stroke="rgba(70,44,20,.25)" strokeWidth={2} fill="none"/>; })}
      {[110, 140, 172, 204].map((x, i) => <Tree key={i} x={x} y={prof(x) + 4} s={0.13} bend={-3} f={lf} seed={i + 2}/>)}
      <FlowArrow pts={[[10, 470], [90, 440], [160, 360], [230, 250], [292, 168]]} f={lf} p={arr} w={20} c1="#3b9ad6" c2="#bfe6fa" dark="#1b4f7e" speed={1.8}/>
      <Puff x={150} y={226} s={0.9} grow={cg} dark={rp > 0.3} seed={12} f={lf}/><Puff x={226} y={168} s={0.82} grow={cg} dark={rp > 0.3} seed={13} f={lf}/>
      <Rain x0={86} x1={236} top={260} bottom={(x) => prof(x) + 4} f={lf} n={20} p={rp} col="#e6f4ff" slant={14} sp={1.3}/>
    </g>
  );
};

const Cyclonic = (lf: number) => {
  const cx = 270, cy = 310, rot = lf * 0.9, g = eo(prog(lf, 4, 40));
  const arms: React.ReactNode[] = [];
  for (let k = 0; k < 4; k++) {
    const r = rng(k * 37 + 5);
    for (let j = 0; j < 22; j++) {
      const t = j / 21, ang = (k * Math.PI) / 2 + t * 3.6, rad = 38 + t * 220, sz = 38 - t * 22 + r() * 8;
      arms.push(<circle key={`${k}-${j}`} cx={Math.cos(ang) * rad + (r() - 0.5) * 16} cy={Math.sin(ang) * rad * 0.96 + (r() - 0.5) * 16} r={sz} fill="url(#p2r-cyc)" opacity={0.92 - t * 0.35}/>);
    }
  }
  const flash = Math.pow(Math.max(0, Math.sin(lf / 9.5) * Math.sin(lf / 4.1)), 6);
  return (
    <g>
      <defs>
        <radialGradient id="p2r-cyc" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#ffffff"/><stop offset="0.7" stopColor="#d4dcea"/><stop offset="1" stopColor="#8f9cb8"/></radialGradient>
        <linearGradient id="p2r-dsea" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2a6ea6"/><stop offset="1" stopColor="#123a68"/></linearGradient>
      </defs>
      <rect width={540} height={620} fill="url(#p2r-dsea)"/>
      {Array.from({length: 8}, (_, i) => <path key={i} d={`M0,${50 + i * 80} Q270,${30 + i * 80} 540,${50 + i * 80}`} stroke="#9fd0ee" strokeWidth={1.2} fill="none" opacity={0.25}/>)}
      <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${0.35 + 0.65 * g})`} opacity={g}>
        <circle r={240} fill="#d9e2f0" opacity={0.18} filter="url(#ak-blur22)"/>
        {arms}
        <circle r={34} fill="#14284a" opacity={0.85}/><circle r={50} fill="none" stroke="#fff" strokeWidth={5} opacity={0.5}/>
      </g>
      <circle cx={cx + 90} cy={cy - 60} r={44} fill="#fff4b0" opacity={flash * 0.55} filter="url(#ak-blur8)"/>
      {[0, 1, 2, 3].map((k) => <path key={k} d={`M${70 + k * 120},${560 - (k % 2) * 20} l60,-14 M${52 + k * 120},${590} l50,-12`} stroke="#e6f4ff" strokeWidth={3} strokeLinecap="round" opacity={0.0}/>)}
    </g>
  );
};

const RainTypesArt: React.FC<AP> = (p) => {
  const its = items(p), at = (i: number) => (its[i] ? its[i].at : 1e9);
  return (
    <g>
      <defs>
        <linearGradient id="p2r-bgw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f4e8cc"/><stop offset="1" stopColor="#e6d2a4"/></linearGradient>
        <linearGradient id="p2r-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c99a62"/><stop offset="1" stopColor="#8a5a30"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#p2r-bgw)"/>
      {Array.from({length: 22}, (_, i) => <line key={i} x1={i * 94 - 20} x2={i * 94 - 20} y1={-60} y2={H + 60} stroke="#b89a64" strokeWidth={1.4} opacity={0.16}/>)}
      <rect x={-40} y={864} width={W + 80} height={260} fill="url(#p2r-wood)"/><rect x={-40} y={860} width={W + 80} height={8} fill="#e8c690" opacity={0.7}/>
      <Panel i={0} at={at(0)} f={p.f} bg={["#8fc4e8", "#fbe9c2"]}>{Convect}</Panel>
      <Panel i={1} at={at(1)} f={p.f} bg={["#86bde6", "#f6ead0"]}>{OroMini}</Panel>
      <Panel i={2} at={at(2)} f={p.f} bg={["#46506a", "#8c94a8"]}>{Cyclonic}</Panel>
    </g>
  );
};
const RainTypesLabels: React.FC<AP> = (p) => {
  const its = items(p);
  return <>{its.slice(0, 3).map((it, i) => <LabelCard key={i} cx={PX0[i] + PWD / 2} y={PY0 + PHT + 34} text={it.text} f={p.f} at={it.at} size={36} maxW={520}/>)}</>;
};

export const OroArt: React.FC<AP> = (p) => <Oro {...p} lee={false}/>;
export const OroLeeArt: React.FC<AP> = (p) => <Oro {...p} lee/>;
export const OroLabelsA = OroLabels(false);
export const OroLabelsB = OroLabels(true);
export {RainTypesArt, RainTypesLabels};
