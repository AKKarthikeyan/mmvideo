// POL-03 Part 1, builder W2 (b): `three-cards` (Arts 16, 17, 18 on a desk) and `runners` (two starting lines, a ramp, a balance labelled EFFICIENCY).
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, eio, rng} from "../kit";
import {Cloud, Hills, Sun, Person, prog, type AP} from "./analogy_kit";
import {P2Card} from "./analogy_p2b_kit";
import {Adult, mix2, type Look} from "./analogy_e1_kit";
import {WDefs, lk, a01, sm, Desk, Sheet, HandArm, Cross} from "./analogy_w2_kit";

// ---- three-cards ---------------------------------------------------------------------------------------------------------------
const CardBase: React.FC<{cx: number; cy: number; rot: number; a: number; head: [string, string]; id: string; children: React.ReactNode}> = ({cx, cy, rot, a, head, id, children}) => {
  const lift = (1 - a) * 90;
  return (
    <g transform={`translate(${cx} ${cy + lift}) rotate(${rot + (1 - a) * (rot > 0 ? 6 : -6)})`} opacity={clamp(a * 2.2)}>
      <defs><clipPath id={`w2cc-${id}`}><rect x={-250} y={-250} width={500} height={500} rx={14}/></clipPath></defs>
      <g filter="url(#w2-shadow)"><rect x={-260} y={-260} width={520} height={520} rx={20} fill="#fffaf0" stroke="#b8a074" strokeWidth={3}/></g>
      <g clipPath={`url(#w2cc-${id})`}>
        <rect x={-250} y={-250} width={500} height={500} fill="#fbf3dd"/>
        <rect x={-250} y={-250} width={500} height={26} fill={head[0]}/><rect x={-250} y={-224} width={500} height={5} fill={head[1]}/>
        {children}
      </g>
      <rect x={-260} y={-260} width={520} height={520} rx={20} fill="none" stroke="#fff" strokeWidth={2} opacity={0.6}/>
    </g>
  );
};

const NoticeArt: React.FC<{f: number; t: number}> = ({f, t}) => {
  const walk = f - t;
  return (
    <g>
      <rect x={-250} y={-30} width={500} height={280} fill="#e6d6ae"/>
      {/* the notice */}
      <g transform="translate(0 -118) rotate(-1.2)">
        <rect x={-150} y={-100} width={300} height={190} rx={6} fill="#fffdf5" stroke="#bca56f" strokeWidth={2.4} filter="url(#w2-shadow)"/>
        <rect x={-126} y={-80} width={252} height={26} rx={4} fill="#2f78b8"/>
        <text x={0} y={-61} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={20} letterSpacing="0.18em" fill="#fff">PUBLIC POSTS</text>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={-126} y={-36 + i * 22} width={252 * (i === 3 ? 0.6 : 1)} height={6} rx={3} fill="#8a7a5a" opacity={0.55}/>)}
        <circle cx={0} cy={-104} r={9} fill="#c0352b" stroke="#7a1c14" strokeWidth={2}/>
      </g>
      {/* a wide open doorway with light, and people of every kind walking in */}
      <g transform="translate(60 240)">
        <path d="M-120,0 L-120,-130 Q0,-210 120,-130 L120,0 Z" fill="#8a5a2a" stroke="#4f2f17" strokeWidth={4}/>
        <path d="M-96,0 L-96,-124 Q0,-186 96,-124 L96,0 Z" fill="#fff3c0"/>
        <path d="M-96,0 L-96,-124 Q0,-186 96,-124 L96,0 Z" fill="url(#w2-gold)" opacity={0.4}/>
        <path d="M-96,-6 L96,-6 L180,40 L-180,40 Z" fill="#ffe9a0" opacity={0.35}/>
      </g>
      {[[-150, 11], [-86, 22], [-12, 33], [-218, 44]].map(([x, s], i) => <Person key={i} x={x + ((walk * 0.4 + i * 30) % 120) - 20} y={238} h={150 - (i % 2) * 14} f={f} seed={s + 5} walk/>)}
      <rect x={-250} y={238} width={500} height={14} fill="#b8975a" opacity={0.6}/>
    </g>
  );
};

const Chain: React.FC<{broke: number; f: number}> = ({broke, f}) => {
  const N = 11, links: React.ReactNode[] = [];
  for (let i = 0; i < N; i++) {
    const x = -170 + i * 34, mid = (i - (N - 1) / 2) / ((N - 1) / 2), side = mid < 0 ? -1 : 1;
    const drop = broke * broke * (50 + Math.abs(mid) * 120), swing = side * broke * (10 + Math.abs(mid) * 34);
    const sag = Math.sin(((i + 0.5) / N) * Math.PI) * 8 * (1 - broke);
    links.push(<g key={i} transform={`translate(${x + swing} ${-30 + sag + drop}) rotate(${(i % 2 ? 0 : 90) + side * broke * 70})`} opacity={1 - clamp((broke - 0.7) * 2.5) * 0.5}>
      <rect x={-17} y={-9} width={34} height={18} rx={9} fill="none" stroke="#5a5f68" strokeWidth={7}/><rect x={-17} y={-9} width={34} height={18} rx={9} fill="none" stroke="#a8aeb8" strokeWidth={3.4}/></g>);
  }
  const flash = Math.max(0, 1 - Math.abs(broke - 0.18) * 7);
  return <g>{links}{flash > 0.02 && <g transform="translate(0 -30)" opacity={flash}><circle r={38} fill="#fff3b0" filter="url(#w2-soft)"/>{[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d="M0,-20 L0,-54" stroke="#ffd36a" strokeWidth={5} strokeLinecap="round" transform={`rotate(${i * 60 + 20})`}/>)}</g>}</g>;
};
const Pot: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><path d="M-12,-16 Q-26,0 -12,20 L12,20 Q26,0 12,-16 L8,-24 L-8,-24 Z" fill="#c8704a" stroke="#7d3a20" strokeWidth={2.4}/><path d="M-8,-24 L8,-24" stroke="#7d3a20" strokeWidth={3}/><path d="M-18,-4 Q0,2 18,-4" stroke="#8f4524" strokeWidth={2} fill="none"/></g>
);
const WellArt: React.FC<{f: number; t: number}> = ({f, t}) => {
  const broke = sm(f, t + 34, 26), hands = a01(f, t + 56, 30), bob = Math.sin(f / 12) * 3;
  const tones: [string, string][] = [["#e0b48a", "#b9835a"], ["#c68f64", "#94603c"], ["#a9744a", "#7a4a2c"], ["#d8a47a", "#a8754f"]];
  const sl = ["#7fa58a", "#c8704a", "#4c6a9a", "#d9b26a"];
  return (
    <g>
      <rect x={-250} y={-224} width={500} height={330} fill="url(#w2-sky)"/>
      <Hills id="w2wl" base={-20} amp={40} top="#b4cbe0" bottom="#d4dfdf" seed={1.4} wl={190} bottomY={120}/>
      <rect x={-250} y={90} width={500} height={170} fill="#a9c47c"/><rect x={-250} y={90} width={500} height={10} fill="#c0d890"/>
      <path d="M-250,170 Q-60,140 250,185 L250,260 L-250,260 Z" fill="#c9a36a" opacity={0.7}/>
      {/* thatched huts, far */}
      <g transform="translate(-170 80)"><rect x={-40} y={-34} width={80} height={36} fill="#d6b184"/><path d="M-52,-30 L0,-80 L52,-30 Z" fill="#a8803c" stroke="#6e5220" strokeWidth={2}/></g>
      {/* the well */}
      <ellipse cx={0} cy={176} rx={118} ry={16} fill="#2a1808" opacity={0.25}/>
      <path d="M-92,60 L-92,170 Q0,194 92,170 L92,60 Z" fill="#b8a888" stroke="#6e6048" strokeWidth={3}/>
      {[0, 1, 2, 3].map((r) => <path key={r} d={`M-92,${80 + r * 24} Q0,${96 + r * 24} 92,${80 + r * 24}`} stroke="#6e6048" strokeWidth={1.8} fill="none"/>)}
      <ellipse cx={0} cy={60} rx={92} ry={26} fill="#d8c9a6" stroke="#6e6048" strokeWidth={3}/><ellipse cx={0} cy={62} rx={72} ry={18} fill="#2f6f94"/><ellipse cx={-12} cy={58} rx={34} ry={7} fill="#7fc0e0" opacity={0.6}/>
      <rect x={-124} y={-120} width={14} height={186} fill="#7a4a24" stroke="#4f2f17" strokeWidth={2}/><rect x={110} y={-120} width={14} height={186} fill="#7a4a24" stroke="#4f2f17" strokeWidth={2}/>
      <rect x={-136} y={-136} width={272} height={20} rx={5} fill="#8a5a2a" stroke="#4f2f17" strokeWidth={2.4}/>
      <path d={`M0,-116 L0,${-4 + bob}`} stroke="#5a3a1c" strokeWidth={3}/><g transform={`translate(0 ${bob})`}><path d="M-14,-4 L14,-4 L11,22 L-11,22 Z" fill="#8a8f98" stroke="#4a4f58" strokeWidth={2.4}/></g>
      <Chain broke={broke} f={f}/>
      {/* hands, from both sides, with pots */}
      <g opacity={hands} transform={`translate(${(1 - hands) * 40} 0)`}>
        <g transform="translate(-124 34) scale(0.7)"><HandArm x={0} y={0} ang={-12} len={130} skin={tones[0]} sleeve={sl[0]}/><Pot x={8} y={-22} s={1.1} rot={-18}/></g>
        <g transform="translate(-130 108) scale(0.7)"><HandArm x={0} y={0} ang={8} len={120} skin={tones[2]} sleeve={sl[1]}/><Pot x={10} y={-12} s={0.9} rot={10}/></g>
        <g transform="translate(130 30) scale(0.7)"><HandArm x={0} y={0} ang={188} len={130} skin={tones[1]} sleeve={sl[2]}/><Pot x={-8} y={-22} s={1.1} rot={18}/></g>
        <g transform="translate(130 104) scale(0.7)"><HandArm x={0} y={0} ang={172} len={120} skin={tones[3]} sleeve={sl[3]}/><Pot x={-10} y={-10} s={0.9} rot={-10}/></g>
      </g>
    </g>
  );
};

const Medal: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#w2-shadow)">
    <path d="M-26,-90 L0,-20 L26,-90 Z" fill="#2f5f9a" stroke="#1b3c68" strokeWidth={2.4}/><path d="M-10,-90 L0,-48 L10,-90 Z" fill="#c0352b"/>
    <circle r={50} fill="url(#w2-brass)" stroke="#7a5a1c" strokeWidth={3.4}/><circle r={40} fill="none" stroke="#fff3c0" strokeWidth={2} opacity={0.7}/>
    <path d="M0,-30 L8,-9 L30,-9 L12,5 L19,27 L0,14 L-19,27 L-12,5 L-30,-9 L-8,-9 Z" fill="#fff3c0" stroke="#8f6c22" strokeWidth={2}/>
  </g>
);
const Degree: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#w2-shadow)">
    <rect x={-70} y={-24} width={140} height={48} rx={22} fill="#fffaf0" stroke="#b8a074" strokeWidth={3} transform="rotate(-8)"/>
    <ellipse cx={-66} cy={8} rx={12} ry={26} fill="#f0e4c8" stroke="#b8a074" strokeWidth={2.4} transform="rotate(-8)"/>
    <path d="M-30,-8 L40,-18 M-30,6 L30,-4" stroke="#8a7a5a" strokeWidth={4} opacity={0.5} strokeLinecap="round" transform="rotate(-8)"/>
    <rect x={-6} y={-30} width={12} height={60} fill="#c0352b" transform="rotate(-8)"/>
    <g transform="translate(14 -66) rotate(-6)"><path d="M-44,0 L0,-18 L44,0 L0,18 Z" fill="#2a2f3a" stroke="#0e1118" strokeWidth={2}/><path d="M-24,10 L-24,28 Q0,40 24,28 L24,10 L0,22 Z" fill="#2a2f3a"/><path d="M44,0 L44,26" stroke="#e9c04a" strokeWidth={3}/><circle cx={44} cy={30} r={5} fill="#e9c04a"/></g>
  </g>
);
const TitleArt: React.FC<{f: number; t: number}> = ({f, t}) => {
  const cr = sm(f, t + 30, 18), sh = Math.sin(f / 16) * 1.2;
  return (
    <g>
      <rect x={-250} y={-224} width={500} height={474} fill="#e9dcc0"/>
      <g transform={`translate(0 -80) rotate(${sh * 0.4})`} filter="url(#w2-shadow)">
        <rect x={-190} y={-60} width={380} height={130} rx={10} fill="#fff3d0" stroke="#b8975a" strokeWidth={3}/>
        <ellipse cx={-190} cy={5} rx={16} ry={67} fill="#e8d6a8" stroke="#b8975a" strokeWidth={3}/><ellipse cx={190} cy={5} rx={16} ry={67} fill="#e8d6a8" stroke="#b8975a" strokeWidth={3}/>
        <text x={0} y={10} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={50} letterSpacing="0.14em" fill="#5e2a0e">TITLE</text>
        <path d="M-110,32 L110,32" stroke="#8c2a1c" strokeWidth={4} opacity={0.6}/>
        <circle cx={150} cy={52} r={18} fill="#c0352b" stroke="#7a1c14" strokeWidth={2.4}/>
        <Cross x={0} y={5} s={cr * 1.5} a={cr} w={6}/>
      </g>
      <Medal x={-110} y={110} s={1.05}/><Degree x={115} y={150} s={1.15}/>
    </g>
  );
};

export const ThreeCardsArt: React.FC<AP> = (p) => {
  const {f} = p, L = lk(p), t16 = L.a16 ? L.a16.at : 30, t17 = L.a17 ? L.a17.at : 260, t18 = L.a18 ? L.a18.at : 520, tLw = L.lw ? L.lw.at : 380;
  return (
    <g>
      <WDefs/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#d8c4a0"/>
      <Desk y0={40}/>
      <rect x={0} y={0} width={W} height={H} fill="url(#w2-gold)" opacity={0.05}/>
      <CardBase id="1" cx={400} cy={480} rot={-1.6} a={a01(f, t16 - 6, 26)} head={["#2f78b8", "#1b4a78"]}><NoticeArt f={f} t={t16}/></CardBase>
      <CardBase id="2" cx={960} cy={480} rot={0.8} a={a01(f, t17 - 6, 26)} head={["#2f9a4a", "#1b6a30"]}><WellArt f={f} t={t17}/></CardBase>
      <CardBase id="3" cx={1520} cy={480} rot={-0.9} a={a01(f, t18 - 6, 26)} head={["#c8741c", "#7a3e0a"]}><TitleArt f={f} t={t18}/></CardBase>
      {f >= tLw && <g opacity={a01(f, tLw, 14)}><g transform="translate(960 238)"><path d="M0,0 L0,-30" stroke="#b27a1c" strokeWidth={3} strokeDasharray="5 6"/></g></g>}
    </g>
  );
};
export const ThreeCardsLabels: React.FC<AP> = (p) => {
  const L = lk(p);
  return (
    <>
      {L.a16 && <P2Card cx={400} y={792} text={L.a16.text} f={p.f} at={L.a16.at} size={26} maxW={520}/>}
      {L.a17 && <P2Card cx={960} y={792} text={L.a17.text} f={p.f} at={L.a17.at} size={26} maxW={520}/>}
      {L.lw && <P2Card cx={960} y={96} text={L.lw.text} f={p.f} at={L.lw.at} size={28} maxW={720} tone="cool"/>}
      {L.a18 && <P2Card cx={1520} y={792} text={L.a18.text} f={p.f} at={L.a18.at} size={26} maxW={520}/>}
    </>
  );
};

// ---- runners -------------------------------------------------------------------------------------------------------------------
const RUN_A: Look = {kind: "plain", shirt: ["#d9573a", "#9a3318"], pants: "#2c3a56", hair: "#1c1410", skin: 1};
const RUN_B: Look = {kind: "plain", shirt: ["#3a78b8", "#1f4a7a"], pants: "#2c3a56", hair: "#241812", skin: 2};
const LINE_X = 1000, LANE2 = 840;
const rampY = (x: number) => (x < 820 ? LANE2 + 90 - (x - 540) * (90 / 280) : LANE2);
export const RunnersArt: React.FC<AP> = (p) => {
  const {f, dur} = p, L = lk(p), tUq = L.uq ? L.uq.at : 30, tA46 = L.a46 ? L.a46.at : 300, tA335 = L.a335 ? L.a335.at : 560;
  const ramp = sm(f, tUq + 6, 40), mv = sm(f, tUq + 56, 90), x = 640 + mv * (1086 - 640), y = rampY(x), moving = mv > 0.02 && mv < 0.98;
  const bal = sm(f, tA335 - 4, 26), tilt = Math.sin(f / 30) * 4 * bal, r = rng(5);
  const stands: React.ReactNode[] = [];
  for (let i = 0; i < 260; i++) { const cx = (r() * 1900) + 10, cy = 562 + r() * 150; stands.push(<circle key={i} cx={cx} cy={cy} r={4 + r() * 3} fill={["#d9573a", "#3a78b8", "#e9c04a", "#7fa58a", "#c8456a", "#f0e4c8"][Math.floor(r() * 6)]} opacity={0.75}/>); }
  const SL = 0.72 + ramp * 0.0;
  return (
    <g>
      <WDefs/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w2-sky)"/>
      <Sun x={1640} y={190} r={44} f={f}/>
      {[0, 1].map((i) => <Cloud key={i} x={160 + i * 900} y={140 + i * 70} s={0.8} f={f} speed={0.12} seed={i + 2} a={0.8}/>)}
      <Hills id="w2r-h" base={600} amp={80} top="#b4cbe0" bottom="#d4dfdf" seed={2.2}/>
      {/* stands */}
      <rect x={-20} y={540} width={W + 40} height={200} fill="#9aa0aa"/>{[0, 1, 2].map((i) => <rect key={i} x={-20} y={556 + i * 62} width={W + 40} height={56} fill={["#8f95a0", "#a3a9b3", "#b4bac4"][i]} opacity={0.7}/>)}
      {stands}
      <rect x={-20} y={536} width={W + 40} height={10} fill="#c9cdd5"/>
      {/* track */}
      <rect x={-20} y={740} width={W + 40} height={350} fill="#b5583a"/><rect x={-20} y={740} width={W + 40} height={8} fill="#d98a64"/>
      <path d="M-20,802 L1960,802" stroke="#f0e4d6" strokeWidth={4} opacity={0.8}/><path d="M-20,962 L1960,962" stroke="#f0e4d6" strokeWidth={4} opacity={0.0}/>
      {Array.from({length: 40}, (_, i) => <path key={i} d={`M${i * 52},${1010} l30,-6`} stroke="#8f3a22" strokeWidth={3} opacity={0.4}/>)}
      {/* the pit in the near lane: a cut-away, the start line, the ramp */}
      <path d="M460,840 L460,930 L840,930 L840,840 Z" fill="#6e3a24"/><path d="M460,840 L460,930 L840,930 L840,840" fill="none" stroke="#4a2414" strokeWidth={4}/>
      <path d="M460,840 L840,840 L840,858 L460,858 Z" fill="#3e2012" opacity={0.7}/>
      {[0, 1].map((i) => <path key={i} d={`M460,${880 + i * 32} L840,${880 + i * 32}`} stroke="#8f4a2c" strokeWidth={2} opacity={0.5}/>)}
      <g transform={`translate(820 0) scale(${ramp} 1) translate(-820 0)`}><path d="M540,930 L820,930 L820,840 Z" fill="#d9a85a" stroke="#7a5a1c" strokeWidth={3}/><path d="M560,926 L820,846" stroke="#fff3c0" strokeWidth={3} opacity={0.6}/></g>
      <path d={`M${LINE_X},745 L${LINE_X + 22},745 L${LINE_X + 150},880 L${LINE_X + 128},880 Z`} fill="#fffaf0" opacity={0.95}/>
      <g transform={`translate(${LINE_X + 4} 745)`}><rect x={-3} y={-200} width={6} height={200} fill="#6b4a2c"/><path d="M3,-200 L88,-178 L3,-156 Z" fill="#c0352b" stroke="#7a1c14" strokeWidth={2}/></g>
      {/* runners */}
      <Adult x={LINE_X - 14} y={760} h={230} f={f} seed={71} look={RUN_A} lookX={1} lean={5} arms={{L: [24, 52], R: [-8, 20]}} smile={0.3}/>
      <Adult x={x} y={y} h={268} f={f} seed={72} look={RUN_B} lookX={1} walk={moving} walkAmt={moving ? 1 : 0} lean={mv > 0.98 ? 5 : 0} arms={mv > 0.98 ? {L: [24, 52], R: [-8, 20]} : undefined} smile={0.3}/>
      {/* finish and the balance */}
      <g transform="translate(1850 760)"><rect x={-5} y={-170} width={10} height={170} fill="#6b4a2c"/><path d="M-5,-150 L-170,-134" stroke="#fffaf0" strokeWidth={8}/><path d="M-5,-150 L-170,-134" stroke="#c0352b" strokeWidth={3} strokeDasharray="14 14"/></g>
      <g transform={`translate(1470 770) scale(${bal})`} opacity={bal}>
        <ellipse cx={4} cy={6} rx={120} ry={13} fill="#2a1808" opacity={0.3}/>
        <rect x={-70} y={-12} width={140} height={14} rx={5} fill="#5a3a1c" stroke="#3a2210" strokeWidth={2}/><path d="M-9,-12 L-6,-230 L6,-230 L9,-12 Z" fill="url(#w2-brass)" stroke="#7a5a1c" strokeWidth={2}/>
        <g transform={`rotate(${tilt} 0 -232)`}><rect x={-130} y={-240} width={260} height={11} rx={5} fill="url(#w2-brass)" stroke="#7a5a1c" strokeWidth={2}/>
          {[-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * 124} -232) rotate(${-tilt})`}><path d="M0,0 L-50,92 M0,0 L50,92" stroke="#9a7a2c" strokeWidth={2.4}/><path d="M-60,92 Q0,128 60,92 Z" fill="url(#w2-brass)" stroke="#7a5a1c" strokeWidth={2.6}/></g>)}</g>
        <Medal x={0} y={0} s={0}/>
        <g transform="translate(0 38)"><rect x={-98} y={-18} width={196} height={36} rx={8} fill="#fff8e4" stroke="#b27a1c" strokeWidth={2.4}/><text x={0} y={8} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={19} letterSpacing="0.16em" fill="#5a3418">EFFICIENCY</text></g>
      </g>
    </g>
  );
};
export const RunnersLabels: React.FC<AP> = (p) => {
  const L = lk(p);
  return (
    <>
      {L.uq && <P2Card cx={560} y={80} text={L.uq.text} f={p.f} at={L.uq.at} size={32} maxW={760} upper={false}/>}
      {L.a46 && <P2Card cx={1330} y={80} text={L.a46.text} f={p.f} at={L.a46.at} size={30} maxW={760} upper={false}/>}
      {L.a335 && <P2Card cx={1430} y={250} text={L.a335.text} f={p.f} at={L.a335.at} size={28} maxW={720} upper={false}/>}
    </>
  );
};
