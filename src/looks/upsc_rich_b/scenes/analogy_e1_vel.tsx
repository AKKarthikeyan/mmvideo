// ECO-16 Part 1, builder E1: `velocity-street` (OUR PICTURE). One generic note passes hand to hand: customer, fruit seller, milkman, bus conductor; a counter ticks at
// each handover. The handover times are at(n1), at(n2), at(n3); n0 shows the note at the left. The counter's numerals count handovers (drawn, not data).
import React from "react";
import {SANS, SERIF, clamp, eo, eio} from "../kit";
import {prog} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {StreetBG} from "./analogy_e1_bg";
import {Adult, Awning, FruitPile, Note, reach, mix2, ease, bump, type Arms, type Look} from "./analogy_e1_kit";
import type {AP} from "./analogy_kit";

type P = [number, number];
const Y = 860, H0 = 470;
const XS = [200, 500, 800, 1100];
const LOOKS: Look[] = [
  {kind: "plain", shirt: ["#4f8f9a", "#2f5f6a"], pants: "#31405a", hair: "#1a120d", skin: 2},
  {kind: "saree", accent: "#b8323f", shirt: ["#e8b84a", "#a5782e"], hair: "#1a120d", skin: 1, female: true},
  {kind: "gamcha", shirt: ["#f2ead6", "#c2b794"], pants: "#efe6cf", hair: "#2a1c14", skin: 0, stache: true},
  {kind: "khaki", shirt: ["#c9b37c", "#8f7a45"], pants: "#8f7a45", hair: "#2a1c14", skin: 3, stache: true},
];

const Cart: React.FC<{x: number; f: number}> = ({x, f}) => (
  <g>
    {[x + 6, x + 258].map((px) => <rect key={px} x={px} y={430} width={8} height={280} fill="#6a4a2c" stroke="#3a2412" strokeWidth={1.4}/>)}
    <Awning x={x - 14} y={380} w={300} h={50} c1="#d8682a" c2="#fff4e0" n={6} f={f}/>
    <FruitPile x={x + 70} y={688} w={110} rows={2} kind="mango" seed={3} r={17}/><FruitPile x={x + 200} y={688} w={110} rows={2} kind="apple" seed={4} r={16}/>
  </g>
);
const CartFront: React.FC<{x: number}> = ({x}) => (
  <g>
    <rect x={x - 6} y={704} width={284} height={26} rx={5} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
    <rect x={x} y={730} width={272} height={96} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
    <path d={`M${x + 8},${752} H${x + 264}`} stroke="#b8323f" strokeWidth={5} opacity={0.75}/>
    {[x + 58, x + 214].map((wx) => <g key={wx} transform={`translate(${wx} 836)`}><circle r={44} fill="#2a2a2e"/><circle r={35} fill="#c9a26a" stroke="#6a4a2c" strokeWidth={2.4}/><circle r={7} fill="#4a3a2a"/>
      {Array.from({length: 8}, (_, i) => <path key={i} d="M0,0 L0,-35" stroke="#6a4a2c" strokeWidth={3} transform={`rotate(${i * 45})`}/>)}</g>)}
  </g>
);

const MilkCan: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-26} y={-92} width={52} height={92} rx={9} fill="#cfd5dc" stroke="#6a727c" strokeWidth={2.4}/>
    <rect x={-26} y={-92} width={14} height={92} rx={7} fill="#fff" opacity={0.5}/><rect x={14} y={-92} width={12} height={92} rx={6} fill="#6a727c" opacity={0.3}/>
    <path d="M-26,-76 H26 M-26,-18 H26" stroke="#6a727c" strokeWidth={1.8}/>
    <path d="M-20,-92 Q-20,-110 0,-110 Q20,-110 20,-92 Z" fill="#b8bfc8" stroke="#6a727c" strokeWidth={2.4}/><rect x={-6} y={-122} width={12} height={12} rx={3} fill="#8a929c" stroke="#6a727c" strokeWidth={1.6}/>
  </g>
);
const Bicycle: React.FC<{x: number; f: number}> = ({x, f}) => (
  <g>
    <ellipse cx={x + 100} cy={866} rx={190} ry={10} fill="#2a1808" opacity={0.25}/>
    {[x - 70, x + 270].map((cx, i) => <g key={i} transform={`translate(${cx} 782) rotate(${f * 0})`}><circle r={78} fill="none" stroke="#2a2a2e" strokeWidth={8}/><circle r={70} fill="none" stroke="#9aa0a8" strokeWidth={2}/>
      {Array.from({length: 14}, (_, k) => <path key={k} d="M0,0 L0,-70" stroke="#aab0b8" strokeWidth={1.2} transform={`rotate(${k * 25.7})`}/>)}<circle r={8} fill="#4a4a50"/></g>)}
    <path d={`M${x - 70},782 L${x + 70},782 L${x + 140},690 L${x - 20},690 Z`} fill="none" stroke="#1f6a5a" strokeWidth={9} strokeLinejoin="round"/>
    <path d={`M${x + 70},782 L${x - 20},690 M${x + 140},690 L${x + 270},782 M${x + 140},690 L${x + 156},640 M${x + 124},640 L${x + 190},640`} stroke="#1f6a5a" strokeWidth={9} strokeLinecap="round"/>
    <rect x={x - 54} y={676} width={84} height={16} rx={6} fill="#2a2a2e"/>
    <rect x={x - 100} y={700} width={110} height={10} rx={3} fill="#7a7f88"/>
    <MilkCan x={x - 62} y={700}/><MilkCan x={x - 4} y={700}/>
    <path d={`M${x - 60},700 L${x - 4},700`} stroke="#6a727c" strokeWidth={3}/>
  </g>
);
const Bus: React.FC<{x: number}> = ({x}) => (
  <g>
    <ellipse cx={x + 330} cy={880} rx={380} ry={14} fill="#2a1808" opacity={0.3}/>
    <rect x={x} y={440} width={700} height={420} rx={30} fill="#a8322e" stroke="#5a1814" strokeWidth={3}/>
    <rect x={x} y={640} width={700} height={70} fill="#f2e6c8"/><rect x={x} y={700} width={700} height={10} fill="#5a1814" opacity={0.4}/>
    <rect x={x + 18} y={470} width={90} height={160} rx={8} fill="#2a1c18"/>
    <path d={`M${x + 18},630 h90 M${x + 18},590 h90 M${x + 18},550 h90 M${x + 18},510 h90`} stroke="#6a4a2c" strokeWidth={4}/>
    {Array.from({length: 4}, (_, i) => <rect key={i} x={x + 140 + i * 130} y={480} width={108} height={110} rx={10} fill="#a9d6e8" stroke="#5a1814" strokeWidth={3}/>)}
    {Array.from({length: 4}, (_, i) => <path key={i} d={`M${x + 150 + i * 130},580 L${x + 170 + i * 130},490 L${x + 190 + i * 130},490 L${x + 170 + i * 130},580 Z`} fill="#fff" opacity={0.25}/>)}
    <rect x={x + 230} y={446} width={240} height={26} rx={6} fill="#fff4e0" stroke="#5a1814" strokeWidth={2}/>
    <text x={x + 350} y={466} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={19} letterSpacing="0.3em" fill="#5a1814">CITY BUS</text>
    <rect x={x - 6} y={760} width={712} height={14} fill="#2a1c18"/>
    {[x + 130, x + 560].map((cx) => <g key={cx} transform={`translate(${cx} 836)`}><circle r={58} fill="#1c1c1e"/><circle r={32} fill="#8c8c92"/><circle r={8} fill="#4a4a50"/>{[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={0} cy={-20} r={4} fill="#3a3a40" transform={`rotate(${i * 72})`}/>)}</g>)}
    <circle cx={x + 18} cy={730} r={13} fill="#fff6c8" stroke="#7a5a10" strokeWidth={2}/>
    <rect x={x - 4} y={780} width={12} height={40} fill="#5a1814"/>
  </g>
);

const Counter: React.FC<{n: number; pop: number}> = ({n, pop}) => (
  <g transform="translate(1690 200)">
    <rect x={-94} y={-70} width={188} height={140} rx={22} fill="#fff8e8" fillOpacity={0.9} stroke="#c28a52" strokeWidth={2.4} style={{filter: "drop-shadow(0 14px 14px rgba(80,44,18,.35))"}}/>
    <text x={0} y={34 - pop * 6} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={92 + pop * 10} fill="#5e2a0e">{n}</text>
    {[0, 1, 2].map((i) => <circle key={i} cx={-28 + i * 28} cy={-48} r={8} fill={i < n ? "#e08a1c" : "#e6d8bc"} stroke="#b07a2a" strokeWidth={1.6}/>)}
  </g>
);

export const VelocityArt: React.FC<AP> = (p) => {
  const {f, dur} = p, n0 = p.at("n0"), A = [p.at("n1"), p.at("n2"), p.at("n3")];
  const hand = (k: number): P => [(XS[k] + XS[k + 1]) / 2, 612];
  const R_: P[] = XS.map((x) => [x + 30, 656]), L_: P[] = XS.map((x) => [x + 16, 656]);
  const rest = (x: number, side: "L" | "R"): P => [x + (side === "R" ? 52 : -52), 748];
  const Rt = (i: number, t: number): P => {
    // giver's R hand: rests (or holds at the chest), extends to the handover i+1 and retracts
    if (i > 2) return rest(XS[i], "R");
    const ext = eio(prog(t, A[i] - 28, 28)), back = eio(prog(t, A[i] + 4, 16)), hold = i === 0 ? eio(prog(t, n0 - 4, 14)) : eio(prog(t, A[i - 1] + 20, 8));
    let a = mix2(rest(XS[i], "R"), R_[i], hold); a = mix2(a, hand(i), ext); return mix2(a, rest(XS[i], "R"), back);
  };
  const Lt = (i: number, t: number): P => {
    if (i < 1) return rest(XS[i], "L");
    const ext = eio(prog(t, A[i - 1] - 28, 28)), back = eio(prog(t, A[i - 1] + 4, 16)), gone = i < 3 ? eio(prog(t, A[i - 1] + 22, 10)) : 0;
    let a = mix2(rest(XS[i], "L"), hand(i - 1), ext); a = mix2(a, L_[i], back); return mix2(a, rest(XS[i], "L"), gone);
  };
  const notePos = (t: number): P => {
    if (t < A[0]) return Rt(0, t);
    for (let k = 1; k <= 3; k++) {
      const next = k < 3 ? A[k] : 1e9, swap = A[k - 1] + 20;
      if (t < next) return t < swap || k === 3 ? Lt(k, t) : Rt(k, t);
    }
    return Lt(3, t);
  };
  const aShow = ease(f, n0, 12), np = notePos(f), nextP = notePos(f + 1.5), ang = Math.atan2(nextP[1] - np[1], nextP[0] - np[0]) * 57.3;
  const arms = (i: number): Arms => ({L: reach(XS[i], Y, H0, "L", Lt(i, f)), R: reach(XS[i], Y, H0, "R", Rt(i, f))});
  const count = (f >= A[0] ? 1 : 0) + (f >= A[1] ? 1 : 0) + (f >= A[2] ? 1 : 0);
  const pop = Math.max(bump(f, A[0] - 4, 16) * (f < A[1] - 10 ? 1 : 0), bump(f, A[1] - 4, 16) * (f >= A[1] - 10 && f < A[2] - 10 ? 1 : 0), bump(f, A[2] - 4, 16) * (f >= A[2] - 10 ? 1 : 0));
  const trail: React.ReactNode[] = [];
  for (let k = 1; k <= 24; k++) {
    const t1 = f - k * 2.2, t2 = f - (k - 1) * 2.2; if (t1 < n0) break;
    const a = notePos(t1), b = notePos(t2), sp = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (sp < 0.6) continue;
    trail.push(<path key={k} d={`M${a[0]},${a[1]} L${b[0]},${b[1]}`} stroke="#ffd36a" strokeWidth={Math.min(18, 6 + sp * 1.4) * (1 - k / 28)} strokeLinecap="round" opacity={0.6 * (1 - k / 26)}/>);
  }
  const glow = aShow * (0.5 + 0.3 * Math.sin(f / 4));
  return (
    <g>
      <StreetBG f={f} dur={dur} variant="velocity" sun={[1500, 190]}/>
      <Bus x={1290}/>
      <Cart x={380} f={f}/>
      <Bicycle x={690} f={f}/>
      <Adult x={XS[0]} y={Y} h={H0} f={f} seed={31} look={LOOKS[0]} arms={arms(0)} hands={{R: "fist"}} lookX={0.7} smile={0.6}/>
      <Adult x={XS[1]} y={Y} h={H0} f={f} seed={32} look={LOOKS[1]} arms={arms(1)} hands={{L: "open", R: "fist"}} lookX={0.2} smile={0.7} legsHidden/>
      <CartFront x={380}/>
      <Adult x={XS[2]} y={Y} h={H0} f={f} seed={33} look={LOOKS[2]} arms={arms(2)} hands={{L: "open", R: "fist"}} lookX={0.2} smile={0.5}/>
      <Adult x={XS[3]} y={Y} h={H0} f={f} seed={34} look={LOOKS[3]} arms={arms(3)} hands={{L: "open"}} lookX={-0.2} smile={0.5}/>
      <g>{trail}</g>
      {aShow > 0.01 && (
        <g transform={`translate(${np[0]} ${np[1]}) rotate(${clamp(ang, -18, 18) * 0.5})`} opacity={aShow}>
          <circle r={74} fill="url(#ak-sunglow)" opacity={glow}/>
          <g transform={`scale(${0.3 + 0.2 * aShow})`}><Note s={1}/></g>
        </g>
      )}
      <Counter n={count} pop={pop}/>
    </g>
  );
};

export const VelocityLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  const cx = [270, 500, 800, 1100];
  return <>{L.map((l, i) => <P2Card key={l.at + "" + i} cx={cx[i] ?? 960} y={i === 0 ? 150 : 232} text={l.text} f={p.f} at={l.at} size={i === 0 ? 30 : 30} maxW={300} upper={false}/>)}</>;
};
