// ECO-16 Part 1, builder E2: the demand for money. sliders, three-jars (OUR PICTURE), bond-seesaw (tilt from e16_bond), rate-crowd, liquidity-tank.
// Figures only from fig(): e16_bond (r5, r6). Counts of coins and people are picture props, not data.
import React from "react";
import {SANS, SERIF, eo, eio, clamp} from "../kit";
import {fig} from "../../cartoon/long/figs";
import {prog, lerp, FlowArrow, Person, type AP} from "./analogy_kit";
import {Room, Shade, Coin, CoinHeap, Wallet, Cert, Plaque, Clock, PriceTag, GlassJar, Chev, KeyCard, ECard, L, T} from "./analogy_e2_kit";
import {Basket} from "./analogy_e2_money";

// ---- sliders -----------------------------------------------------------------------------------------------------------------------
const Slider: React.FC<{x: number; base: number; hgt: number; u: number; col: string; a: number; moving: number; f: number}> = ({x, base, hgt, u, col, a, moving, f}) => {
  const top = base - hgt, ky = base - 36 - u * (hgt - 80), rise = (1 - a) * 80;
  return (
    <g opacity={a} transform={`translate(0 ${rise})`}>
      <Shade x={x} y={base + 6} rx={110} ry={14} o={0.38}/>
      <rect x={x - 90} y={base - 34} width={180} height={40} rx={10} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
      <rect x={x - 82} y={base - 30} width={164} height={6} rx={3} fill="#fff3c0" opacity={0.6}/>
      <rect x={x - 38} y={top - 30} width={76} height={hgt + 4} rx={14} fill="#4a2f1a" stroke="#2a180a" strokeWidth={3}/>
      <rect x={x - 32} y={top - 24} width={64} height={hgt - 8} rx={10} fill="#6a4426" opacity={0.7}/>
      {Array.from({length: 12}, (_, i) => <path key={i} d={`M${x - 52},${top + 20 + i * ((hgt - 90) / 11)} h${i % 3 === 0 ? 20 : 12} M${x + 52},${top + 20 + i * ((hgt - 90) / 11)} h${i % 3 === 0 ? -20 : -12}`} stroke="#6c4a16" strokeWidth={i % 3 === 0 ? 3.4 : 2} strokeLinecap="round" opacity={0.85}/>)}
      <rect x={x - 8} y={top} width={16} height={hgt - 40} rx={8} fill="#1a0e06"/>
      <rect x={x - 8} y={ky} width={16} height={base - 36 - ky + 6} rx={8} fill={col}/>
      <rect x={x - 3} y={ky} width={5} height={base - 36 - ky + 6} rx={2} fill="#fff" opacity={0.45}/>
      {moving > 0.02 && <g opacity={moving}><Chev x={x + 96} y={ky - 8 + Math.sin(f / 5) * 5} s={1.1} col={col}/></g>}
      <g transform={`translate(${x} ${ky})`}>
        <rect x={-48} y={-24} width={96} height={52} rx={13} fill="#1a0e06" opacity={0.3} transform="translate(5 8)"/>
        <rect x={-48} y={-26} width={96} height={52} rx={13} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
        {[-24, -12, 0, 12, 24].map((dx) => <path key={dx} d={`M${dx},-18 V18`} stroke="#6c4a16" strokeWidth={2.4} opacity={0.6}/>)}
        <rect x={-42} y={-22} width={84} height={7} rx={3} fill="#fff6cf" opacity={0.7}/>
        <path d="M-40,0 h80" stroke={col} strokeWidth={5} opacity={0.9}/>
      </g>
    </g>
  );
};

const Passbook: React.FC<{x: number; y: number; entries: number; pulse: number}> = ({x, y, entries, pulse}) => (
  <g transform={`translate(${x} ${y})`}>
    <Shade x={0} y={4} rx={150} ry={12} o={0.34}/>
    {pulse > 0.01 && <ellipse cx={0} cy={-60} rx={150} ry={90} fill="#8fe0a8" opacity={0.4 * pulse} filter="url(#ak-blur22)"/>}
    <path d="M-148,0 L-148,-112 L0,-100 L148,-112 L148,0 L0,12 Z" fill="#243f69" stroke="#122a4c" strokeWidth={3}/>
    <path d="M-138,-4 L-138,-112 Q-70,-120 -4,-100 L-4,6 Q-70,-6 -138,-4 Z" fill="url(#e2-paper)" stroke="#b79b66" strokeWidth={2}/>
    <path d="M4,-100 Q70,-120 138,-112 L138,-4 Q70,-6 4,6 Z" fill="url(#e2-paper)" stroke="#b79b66" strokeWidth={2}/>
    {[0, 1, 2, 3, 4].map((i) => <path key={`l${i}`} d={`M-126,${-96 + i * 17} Q-70,${-104 + i * 17} -14,${-88 + i * 17}`} stroke="#9bb8c8" strokeWidth={1.8} fill="none"/>)}
    {[0, 1, 2, 3, 4].map((i) => <path key={`r${i}`} d={`M14,${-88 + i * 17} Q70,${-104 + i * 17} 126,${-96 + i * 17}`} stroke="#9bb8c8" strokeWidth={1.8} fill="none"/>)}
    <g transform="translate(-70 -96)" opacity={0.9}><path d="M-22,10 L0,-8 L22,10 Z" fill="#243f69"/><rect x={-18} y={10} width={36} height={4} fill="#243f69"/>{[-12, -4, 4, 12].map((dx) => <rect key={dx} x={dx - 1.5} y={-2} width={3} height={12} fill="#243f69"/>)}</g>
    {Array.from({length: Math.min(5, Math.floor(entries))}, (_, i) => <g key={i}><rect x={20} y={-84 + i * 17} width={52 + (i % 2) * 14} height={8} rx={4} fill="#2f9a4a" transform={`skewY(${-4 + 0})`} opacity={0.85}/><path d={`M92,${-83 + i * 17} h12 M98,${-89 + i * 17} v12`} stroke="#2f9a4a" strokeWidth={3} transform="skewY(-4)"/></g>)}
  </g>
);

export const SlidersArt: React.FC<AP> = (p) => {
  const {f} = p, tIn = T(p, "in", 258), tIr = T(p, "ir", 304);
  const uIn = 0.14 + 0.74 * eio(prog(f, tIn - 14, 90)), uIr0 = eio(prog(f, tIr - 14, 100)), uIr = 0.14 + 0.74 * uIr0;
  const mvIn = prog(f, tIn - 14, 8) * (1 - prog(f, tIn + 70, 20)), mvIr = prog(f, tIr - 14, 8) * (1 - prog(f, tIr + 80, 20));
  const N = 7, ts = tIr - 4, sp = Math.max(6, 70 / N), hop = (k: number) => eio(prog(f, ts + k * sp, 30));
  const out = Array.from({length: N}, (_, k) => hop(k)), left = out.filter((h) => h <= 0.001).length, landed = out.filter((h) => h >= 0.999).length;
  const fat = clamp((uIn - 0.14) / 0.74) * 0.9 + 0.08, WX = 900, WY = 800, WS = 1.28;
  const appear = (d: number) => eo(prog(f, d, 30));
  return (
    <g>
      <Room f={f} deskY={770} variant="bank" winX={1330}/>
      <Slider x={470} base={792} hgt={400} u={uIn} col="#2f9a4a" a={appear(4)} moving={mvIn} f={f}/>
      <Slider x={1450} base={792} hgt={400} u={uIr} col="#2f78b8" a={appear(14)} moving={mvIr} f={f}/>
      <g opacity={appear(24)}>
        <Wallet x={WX} y={WY} s={WS} fat={fat} coins={left} f={f} glow={mvIn * 0.8}/>
        <Passbook x={1252} y={WY} entries={landed} pulse={clamp(mvIr + (landed > 0 && f < ts + N * sp + 40 ? 0.4 : 0))}/>
      </g>
      {out.map((h, k) => {
        if (h <= 0.001 || h >= 0.999) return null;
        const sx = WX + (96 + k * 4) * WS * 0.7, sy = WY - (120 + 52 * fat) * WS - 20, ex = 1252 + 20 + (k % 3) * 18, ey = WY - 80;
        return <Coin key={k} x={lerp(sx, ex, h)} y={lerp(sy, ey, h) - Math.sin(h * Math.PI) * 190} r={20} spin={h * 9 + k} op={1 - clamp((h - 0.9) / 0.1)}/>;
      })}
    </g>
  );
};
export const SlidersLabels: React.FC<AP> = (p) => <>
  <KeyCard p={p} k="dm" cx={960} y={76} size={44} maxW={900}/>
  <KeyCard p={p} k="in" cx={470} y={252} size={36} tone="green"/>
  <KeyCard p={p} k="ir" cx={1450} y={252} size={36} tone="cool"/>
</>;

// ---- three-jars ---------------------------------------------------------------------------------------------------------------------
const JX = [300, 850, 1400], PXo = 232, BASE = 792;
const Umbrella: React.FC<{x: number; y: number; s?: number; f: number}> = ({x, y, s = 1, f}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shade x={0} y={4} rx={46} ry={8}/>
    <path d="M0,0 V-210 M0,0 q0,16 -20,16 q-18,0 -18,-18" stroke="#3a2a1c" strokeWidth={8} fill="none" strokeLinecap="round"/>
    <path d="M0,-210 V-250" stroke="#8e6522" strokeWidth={6} strokeLinecap="round"/>
    <path d="M-120,-200 Q-110,-300 0,-310 Q110,-300 120,-200 Q96,-216 80,-200 Q60,-216 40,-200 Q20,-216 0,-200 Q-20,-216 -40,-200 Q-60,-216 -80,-200 Q-96,-216 -120,-200 Z" fill="#8d3a4e" stroke="#521e2c" strokeWidth={3}/>
    {[-80, -40, 0, 40, 80].map((dx) => <path key={dx} d={`M0,-310 Q${dx * 0.9},-270 ${dx},-204`} stroke="#521e2c" strokeWidth={2.4} fill="none"/>)}
    <path d="M-100,-224 Q-70,-290 -10,-304" stroke="#fff" strokeWidth={5} fill="none" opacity={0.3} strokeLinecap="round"/>
    {[0, 1, 2].map((i) => { const u = (f * 0.02 + i * 0.33) % 1; return <path key={i} d={`M${-70 + i * 70},${-180 + u * 120} l-3,14`} stroke="#6aa5d6" strokeWidth={4} strokeLinecap="round" opacity={0.0 * (1 - u)}/>; })}
  </g>
);

const Drop: React.FC<{x: number; yTop: number; yLand: number; f: number; at: number}> = ({x, yTop, yLand, f, at}) => {
  const u = prog(f, at + 2, 32), g = u * u, y = lerp(yTop, yLand, g), since = f - (at + 34);
  return (
    <g>
      {u > 0 && u < 1 && <Coin x={x} y={y} r={24} spin={u * 14} op={1}/>}
      {since > 0 && since < 26 && <g opacity={1 - since / 26}><ellipse cx={x} cy={yLand + 12} rx={20 + since * 3.4} ry={6 + since * 0.8} fill="none" stroke="#ffe08a" strokeWidth={3.5}/>{Array.from({length: 6}, (_, k) => <path key={k} d={`M${x},${yLand - 8} l${(k - 2.5) * 10},${-14 - since * 1.1}`} stroke="#ffe08a" strokeWidth={3.2} strokeLinecap="round"/>)}</g>}
    </g>
  );
};

export const ThreeJarsArt: React.FC<AP> = (p) => {
  const {f} = p, ks = ["j1", "j2", "j3"].map((k) => L(p, k)), lp = L(p, "lp"), k = L(p, "k");
  const pop = (i: number) => { const at = ks[i]?.at ?? 1e9; return eo(prog(f, at - 8, 26)); };
  const landed = (i: number) => (ks[i] && f >= ks[i]!.at + 34 ? 1 : 0), glow = (i: number) => { const at = ks[i]?.at ?? 1e9; return clamp(1 - Math.abs(f - (at + 40)) / 40); };
  const lpA = lp ? eio(prog(f, lp.at - 4, 40)) : 0;
  return (
    <g>
      <Room f={f} deskY={770} variant="shop" winX={1360}/>
      <path d="M70,786 L1850,786 L1900,930 L20,930 Z" fill="#8d3a4e" stroke="#521e2c" strokeWidth={3}/>
      <path d="M70,786 L1850,786 L1862,826 L58,826 Z" fill="#a8546a" opacity={0.8}/>
      {Array.from({length: 40}, (_, i) => <path key={i} d={`M${60 + i * 46},832 v12`} stroke="#d9a468" strokeWidth={2.4} opacity={0.5}/>)}
      <path d="M52,846 H1868" stroke="#e6c27a" strokeWidth={4} opacity={0.7}/>
      {JX.map((x, i) => <GlassJar key={i} x={x} y={BASE} w={230} h={270} n={landed(i)} seed={i + 2} glow={glow(i) * 0.7} coinR={27}/>)}
      {/* shopping basket */}
      <g opacity={pop(0)} transform={`translate(${JX[0] + PXo} ${BASE + 6 - (1 - pop(0)) * 30}) scale(0.5) translate(${-(JX[0] + PXo)} ${-(BASE + 6)})`}>
        <Basket x={JX[0] + PXo} y={BASE + 6} items={[{id: "rice", show: 1, out: 0}, {id: "loaf", show: 1, out: 0}, {id: "oil", show: 1, out: 0}]} f={f} glow={0}/>
      </g>
      {/* umbrella */}
      <g opacity={pop(1)} transform={`translate(0 ${-(1 - pop(1)) * 30})`}><Umbrella x={JX[1] + PXo - 10} y={BASE + 4} s={0.95} f={f}/></g>
      {/* bond and clock */}
      <g opacity={pop(2)} transform={`translate(0 ${-(1 - pop(2)) * 30})`}>
        <Cert x={JX[2] + PXo - 10} y={BASE - 100} w={190} rot={-3}/>
        <path d={`M${JX[2] + PXo - 94},${BASE - 22} l-8,-6 M${JX[2] + PXo + 74},${BASE - 22} l8,-6`} stroke="#6a7b86" strokeWidth={4} strokeLinecap="round"/>
        <Clock x={JX[2] + PXo + 84} y={BASE - 78} r={44} f={f} stand speed={1.6}/>
      </g>
      {[0, 1, 2].map((i) => ks[i] ? <Drop key={i} x={JX[i]} yTop={300} yLand={BASE - 40} f={f} at={ks[i]!.at}/> : null)}
      {/* bracket */}
      {lp && lpA > 0.01 && <g>
        <path d="M200,310 Q200,266 244,266 H916 Q960,266 960,236 Q960,266 1004,266 H1716 Q1760,266 1760,310" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lpA} fill="none" stroke="#7a4a1e" strokeWidth={7} strokeLinecap="round"/>
        <path d="M200,310 Q200,266 244,266 H916 Q960,266 960,236 Q960,266 1004,266 H1716 Q1760,266 1760,310" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lpA} fill="none" stroke="#f0c48a" strokeWidth={2.4} strokeLinecap="round" transform="translate(0 -1.5)"/>
      </g>}
      {k && <Plaque x={420} y={176} w={420} text={k.text} f={f} at={k.at} size={42}/>}
    </g>
  );
};
export const ThreeJarsLabels: React.FC<AP> = (p) => <>
  <KeyCard p={p} k="lp" cx={960} y={80} size={44} maxW={900} tone="warm"/>
  {["j1", "j2", "j3"].map((k, i) => <KeyCard key={k} p={p} k={k} cx={JX[i] + 70} y={330} size={27} upper={false} maxW={440} tone={i === 0 ? "warm" : i === 1 ? "cool" : "green"}/>)}
</>;

// ---- bond-seesaw --------------------------------------------------------------------------------------------------------------------
const PIV = {x: 960, y: 650}, HALF = 560, GAIN = 520;
export const BondSeesawArt: React.FC<AP> = (p) => {
  const {f} = p, bp = T(p, "bp", 85), b5 = L(p, "b5"), b6 = L(p, "b6");
  const r5 = fig({t: "e16_bond", state: "India", s: "r5"}).value, r6 = fig({t: "e16_bond", state: "India", s: "r6"}).value, Tm = (1 - r6 / r5) * GAIN; // degrees, tilt follows the ratio of the two values
  const t5 = b5?.at ?? 304, t6 = b6?.at ?? 339;
  // up to 6% for the idea, back to 5% for the first printed value, up again for the second
  const ur = eio(prog(f, bp, 60)) * (1 - eio(prog(f, t5 - 32, 26))) + eio(prog(f, t6 - 8, 22));
  const tilt = Tm * ur, mv = clamp(Math.abs(Math.sin(Math.PI * ur)) * 3);
  const nd = -52 + 46 * ur;
  const rot = (lx: number, ly: number) => { const a = (-tilt * Math.PI) / 180; return {x: PIV.x + lx * Math.cos(a) - ly * Math.sin(a), y: PIV.y + lx * Math.sin(a) + ly * Math.cos(a)}; };
  const cert = rot(-400, -156);
  const leader = (t: {text: string; at: number} | null, tx: number, ty: number) => t ? <path d={`M${tx + 10},${ty + 52} Q${(tx + cert.x) / 2},${ty + 150} ${cert.x - 60 + (tx > 700 ? 90 : 0)},${cert.y - 112}`} stroke="#8a6b3e" strokeWidth={2.6} fill="none" strokeDasharray="6 5" opacity={eo(prog(f, t.at, 14))}/> : null;
  return (
    <g>
      <Room f={f} deskY={780} variant="bank" winX={1360}/>
      {/* fulcrum */}
      <Shade x={PIV.x} y={786} rx={190} ry={16} o={0.4}/>
      <path d={`M${PIV.x - 150},782 L${PIV.x - 26},${PIV.y + 16} L${PIV.x + 26},${PIV.y + 16} L${PIV.x + 150},782 Z`} fill="url(#e2-wood)" stroke="#4a2c14" strokeWidth={4}/>
      <path d={`M${PIV.x + 26},${PIV.y + 16} L${PIV.x + 150},782 L${PIV.x + 70},782 Z`} fill="#3a2010" opacity={0.3}/>
      <path d={`M${PIV.x - 100},760 H${PIV.x + 100}`} stroke="#d6a966" strokeWidth={5} opacity={0.5}/>
      <g transform={`rotate(${-tilt} ${PIV.x} ${PIV.y})`}>
        {/* plank */}
        <rect x={PIV.x - HALF - 6} y={PIV.y - 18} width={2 * HALF + 12} height={40} rx={10} fill="#7e4f28" opacity={0.35} transform="translate(6 12)"/>
        <rect x={PIV.x - HALF} y={PIV.y - 20} width={2 * HALF} height={38} rx={9} fill="url(#e2-wood)" stroke="#4a2c14" strokeWidth={3.4}/>
        <rect x={PIV.x - HALF + 10} y={PIV.y - 17} width={2 * HALF - 20} height={7} rx={3} fill="#f0cd98" opacity={0.65}/>
        {[-HALF, HALF - 44].map((x) => <rect key={x} x={PIV.x + x} y={PIV.y - 22} width={44} height={42} rx={8} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.6}/>)}
        <circle cx={PIV.x} cy={PIV.y - 1} r={22} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
        {/* bond certificate on the left end */}
        <Cert x={PIV.x - 400} y={PIV.y - 156} w={310} word="BOND" rot={-1}/>
        <path d={`M${PIV.x - 540},${PIV.y - 24} l-18,-14 M${PIV.x - 262},${PIV.y - 24} l18,-14`} stroke="#6a7b86" strokeWidth={6} strokeLinecap="round"/>
        <rect x={PIV.x - 560} y={PIV.y - 46} width={320} height={26} rx={6} fill="#a9835a" stroke="#4a2c14" strokeWidth={2}/>
        {/* rate dial on the right end (rotates with the plank) */}
        <g transform={`translate(${PIV.x + 400} ${PIV.y - 150})`}>
          <Shade x={0} y={128} rx={90} ry={9} o={0.3}/>
          <path d="M-46,128 L-18,64 H18 L46,128 Z" fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
          <circle r={108} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={4}/>
          <circle r={90} fill="#fffaf0" stroke="#8e6522" strokeWidth={2.6}/>
          <path d="M-72,34 A80,80 0 0 1 72,34" fill="none" stroke="#dfe9d8" strokeWidth={14}/>
          <path d="M-72,34 A80,80 0 0 1 -6,-78" fill="none" stroke="#6fc08a" strokeWidth={14}/>
          <path d="M-6,-78 A80,80 0 0 1 72,34" fill="none" stroke="#e08a6a" strokeWidth={14}/>
          {Array.from({length: 13}, (_, i) => <path key={i} d={`M0,-80 v${i % 3 === 0 ? 18 : 11}`} stroke="#4a3520" strokeWidth={i % 3 === 0 ? 3.4 : 2} transform={`rotate(${-60 + i * 10})`} strokeLinecap="round"/>)}
          <g transform={`rotate(${nd + 30})`}><path d="M-7,12 L0,-78 L7,12 Z" fill="#c63f2f" stroke="#7a2a1d" strokeWidth={1.6}/><circle r={11} fill="#4a3520"/><circle r={4} fill="#fff" opacity={0.7}/></g>
          <path d="M-62,-52 A82,82 0 0 1 -20,-80" stroke="#fff" strokeWidth={6} fill="none" opacity={0.5} strokeLinecap="round"/>
          {mv > 0.05 && <g opacity={clamp(mv)}><Chev x={132} y={-10 + Math.sin(f / 5) * 5} s={1.2} col="#c63f2f"/></g>}
        </g>
      </g>
      {/* sinking arrow beside the certificate while it falls */}
      {mv > 0.05 && ur > 0.02 && <g opacity={clamp(mv)}><Chev x={cert.x - 200} y={cert.y + 20 + Math.sin(f / 5) * 5} s={1.2} up={false} col="#c63f2f"/></g>}
      {/* price tags */}
      {leader(b5, 470, 300)}{leader(b6, 750, 380)}
      {b5 && <PriceTag x={470} y={300} text={b5.text} f={f} at={b5.at} size={42} w={250} string={false} rot={-3}/>}
      {b6 && <PriceTag x={750} y={380} text={b6.text} f={f} at={b6.at} size={42} w={250} string={false} rot={3}/>}
    </g>
  );
};
export const BondSeesawLabels: React.FC<AP> = (p) => <KeyCard p={p} k="bp" cx={960} y={78} size={42} maxW={1300}/>;

// ---- rate-crowd ------------------------------------------------------------------------------------------------------------------------
const PT = 108, PH = 322, PB = 448; // panel tops and height
const Stall: React.FC<{x: number; y: number; f: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <Shade x={0} y={2} rx={150} ry={10} o={0.3}/>
    <rect x={-120} y={-150} width={240} height={150} fill="#e9d7b0" stroke="#8a6b3e" strokeWidth={2.6}/>
    <rect x={-120} y={-70} width={240} height={70} fill="#b58a52" stroke="#6a4520" strokeWidth={2.6}/>
    <rect x={-126} y={-78} width={252} height={14} rx={4} fill="#d6a966" stroke="#6a4520" strokeWidth={2}/>
    <path d="M-140,-150 H140 L124,-206 H-124 Z" fill="#fff7e2" stroke="#8a2f3a" strokeWidth={3}/>
    {[-100, -60, -20, 20, 60, 100].map((dx, i) => i % 2 === 0 ? <path key={dx} d={`M${dx - 20},-206 H${dx + 20} L${dx + 24},-150 H${dx - 24} Z`} fill="#b43a4a"/> : null)}
    <path d="M-140,-150 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0" fill="#b43a4a" opacity={0.0}/>
    <Cert x={0} y={-118} w={92} word="BOND" rot={0}/>
  </g>
);
const Crowd: React.FC<{f: number; t0: number; x0: number; x1: number; y: number; dir: 1 | -1; seed: number; a: number; n?: number; period?: number}> = ({f, t0, x0, x1, y, dir, seed, a, n = 6, period = 300}) => (
  <g>
    {Array.from({length: n}, (_, i) => {
      const u = (((f - t0) / period + i / n) % 1 + 1) % 1, x = lerp(x0, x1, dir === 1 ? u : 1 - u), row = (i * 37) % 3, yy = y - row * 12, al = clamp(u * 7) * clamp((1 - u) * 7) * a;
      return al > 0.01 ? <Person key={i} x={x} y={yy} h={150 - row * 8} f={f} seed={seed + i * 3} walk ph={i * 7} op={al}/> : null;
    })}
  </g>
);
export const RateCrowdArt: React.FC<AP> = (p) => {
  const {f} = p, hi = L(p, "hi"), lo = L(p, "lo"), fl = L(p, "fl"), tHi = hi?.at ?? 50, tLo = lo?.at ?? 235, tFl = fl?.at ?? 442;
  const aHi = eo(prog(f, tHi + 6, 24)), aLo = eo(prog(f, tLo + 6, 24)), fa = eio(prog(f, tFl - 4, 40));
  const panel = (y: number, tint: string, edge: string, id: string) => (
    <g>
      <rect x={96} y={y + 8} width={1728} height={PH} rx={22} fill="#2a1808" opacity={0.18} filter="url(#ak-blur8)"/>
      <rect x={96} y={y} width={1728} height={PH} rx={22} fill={`url(#${id})`} stroke={edge} strokeWidth={3}/>
      <rect x={96} y={y + PH - 78} width={1728} height={78} fill="#d8c096" opacity={0.75} clipPath={`url(#${id}c)`}/>
      <g clipPath={`url(#${id}c)`} opacity={0.5}>{Array.from({length: 17}, (_, i) => { const hh = 40 + ((i * 53) % 70), ww = 50 + ((i * 29) % 40); return <g key={`b${i}`}><rect x={110 + i * 104} y={y + PH - 78 - hh} width={ww} height={hh} fill={id === "rc-top" ? "#e6c58f" : "#a9c3d6"}/>{[0, 1, 2].map((k) => <rect key={k} x={118 + i * 104} y={y + PH - 78 - hh + 8 + k * 16} width={ww - 16} height={6} fill={id === "rc-top" ? "#fff0cf" : "#e3eef6"} opacity={0.8}/>)}</g>; })}</g>
      {Array.from({length: 14}, (_, i) => <path key={i} d={`M${130 + i * 130},${y + PH - 70} l-24,64`} stroke="#b89c6a" strokeWidth={1.6} opacity={0.55}/>)}
      {void tint}
    </g>
  );
  return (
    <g>
      <Room f={f} deskY={900} variant="shop" winX={2100}/>
      <defs>
        <linearGradient id="rc-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fdeccb"/><stop offset="1" stopColor="#f3d59f"/></linearGradient>
        <linearGradient id="rc-bot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dbe8f2"/><stop offset="1" stopColor="#bcd3e3"/></linearGradient>
        <clipPath id="rc-topc"><rect x={96} y={PT} width={1728} height={PH} rx={22}/></clipPath>
        <clipPath id="rc-botc"><rect x={96} y={PB} width={1728} height={PH} rx={22}/></clipPath>
      </defs>
      {panel(PT, "", "#c98a3a", "rc-top")}
      {panel(PB, "", "#4f86b0", "rc-bot")}
      {/* top: walk to the BOND counter; bottom: walk away to the wallets */}
      <g transform={`translate(1560 ${PT + PH - 14}) scale(0.86) translate(-1560 ${-(PT + PH - 14)})`}><Stall x={1560} y={PT + PH - 14} f={f}/></g>
      <g transform={`translate(1560 ${PB + PH - 14}) scale(0.86) translate(-1560 ${-(PB + PH - 14)})`}><Stall x={1560} y={PB + PH - 14} f={f}/></g>
      <Crowd f={f} t0={tHi} x0={170} x1={1380} y={PT + PH - 34} dir={1} seed={11} a={aHi}/>
      <Crowd f={f} t0={tLo} x0={330} x1={1400} y={PB + PH - 34} dir={-1} seed={29} a={aLo}/>
      {/* wallets at the left of the bottom panel */}
      {[0, 1, 2].map((i) => <Wallet key={i} x={190 + i * 96} y={PB + PH - 20} s={0.26} fat={0.3} notes={2} f={f} glow={aLo * 0.8}/>)}
      {/* closing arrow */}
      {fl && <g opacity={fa}>
        <rect x={96} y={760} width={1728} height={150} rx={22} fill="#fffaf0" opacity={0.0}/>
        <path d="M170,905 V800 M170,905 H520" stroke="#4a3520" strokeWidth={6} fill="none" strokeLinecap="round"/>
        <FlowArrow pts={[[210, 820], [320, 846], [430, 880], [500, 892]]} f={f} p={fa} w={22} c1="#c63f2f" c2="#f08a5a" dark="#7a2a1d"/>
      </g>}
    </g>
  );
};
export const RateCrowdLabels: React.FC<AP> = (p) => <>
  <KeyCard p={p} k="hi" cx={460} y={PT + 14} size={28} upper={false} maxW={640} tone="warm"/>
  <KeyCard p={p} k="bb" cx={1560} y={PT + 14} size={26} upper={false} maxW={420} tone="warm"/>
  <KeyCard p={p} k="lo" cx={460} y={PB + 14} size={28} upper={false} maxW={640} tone="cool"/>
  <KeyCard p={p} k="sb" cx={1560} y={PB + 14} size={26} upper={false} maxW={420} tone="cool"/>
  <KeyCard p={p} k="fl" cx={1190} y={806} size={36} maxW={1060} tone="red"/>
</>;

// ---- liquidity-tank ------------------------------------------------------------------------------------------------------------------
const TX = 520, TW = 300, TTOP = 330, TBASE = 770;
export const LiquidityTankArt: React.FC<AP> = (p) => {
  const {f, dur} = p, ir = L(p, "ir"), ex = L(p, "ex"), sit = L(p, "sit"), lt = L(p, "lt");
  const tPump = (ir?.at ?? 96) + 36, run = clamp((f - tPump) / Math.max(60, dur - tPump - 30)), nHeap = Math.floor(run * 34), pumpA = eo(prog(f, tPump - 10, 20));
  const wl = TBASE - 30 - 18, hw = TW / 2, NX = 1400, NY = 470, BX = 1400, BY = 790;
  const wob = (i: number) => Math.sin(f / 10 + i * 1.2) * 2.4;
  return (
    <g>
      <Room f={f} deskY={770} variant="bank" winX={1380}/>
      {/* tank */}
      <Shade x={TX} y={TBASE + 8} rx={hw + 40} ry={16} o={0.4}/>
      <rect x={TX - hw - 24} y={TBASE - 14} width={TW + 48} height={26} rx={9} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
      <rect x={TX - hw} y={TTOP} width={TW} height={TBASE - TTOP - 12} rx={10} fill="#e6f1f5" opacity={0.4}/>
      <defs><clipPath id="lt-in"><rect x={TX - hw + 6} y={TTOP + 6} width={TW - 12} height={TBASE - TTOP - 24}/></clipPath><linearGradient id="lt-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7acbf0"/><stop offset="1" stopColor="#2677b0"/></linearGradient></defs>
      <g clipPath="url(#lt-in)">
        <rect x={TX - hw} y={wl} width={TW} height={TBASE - wl} fill="url(#lt-w)"/>
        <path d={`M${TX - hw},${wl} ${Array.from({length: 9}, (_, i) => `L${TX - hw + (i + 1) * (TW / 8)},${wl + wob(i)}`).join(" ")} L${TX + hw},${wl - 6} L${TX - hw},${wl - 6} Z`} fill="#c6ecfb" opacity={0.8}/>
        {[0, 1, 2].map((i) => { const u = (f * 0.01 + i * 0.33) % 1; return <circle key={i} cx={TX - 60 + i * 56 + Math.sin(u * 6 + i) * 6} cy={TBASE - 30 - u * 20} r={3 + i} fill="#e9f8ff" opacity={0.55 * (1 - u)}/>; })}
      </g>
      {Array.from({length: 13}, (_, i) => <path key={i} d={`M${TX + hw - 6},${TBASE - 30 - i * ((TBASE - TTOP - 60) / 12)} h${i % 4 === 0 ? -42 : -24}`} stroke="#4d6d86" strokeWidth={i % 4 === 0 ? 3.4 : 2} opacity={0.7} strokeLinecap="round"/>)}
      <rect x={TX - hw} y={TTOP} width={TW} height={TBASE - TTOP - 12} rx={10} fill="url(#e2-glass)" stroke="#7da3ba" strokeWidth={5}/>
      <rect x={TX - hw + 20} y={TTOP + 30} width={14} height={TBASE - TTOP - 100} rx={7} fill="#fff" opacity={0.5}/>
      <rect x={TX - hw - 12} y={TTOP - 16} width={TW + 24} height={26} rx={9} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
      {/* level marker: red float on a side gauge, fixed at the floor */}
      <path d={`M${TX + hw + 46},${TTOP} V${TBASE - 12}`} stroke="#4a3520" strokeWidth={5} strokeLinecap="round"/>
      <path d={`M${TX - hw + 6},${wl} H${TX + hw + 46}`} stroke="#c63f2f" strokeWidth={2.6} strokeDasharray="7 6"/>
      <polygon points={`${TX + hw + 46},${wl} ${TX + hw + 78},${wl - 15} ${TX + hw + 78},${wl + 15}`} fill="#c63f2f" stroke="#7a2a1d" strokeWidth={1.6}/>
      {ir && <Plaque x={TX} y={TTOP + 120} w={290} text={ir.text} f={f} at={ir.at} size={29}/>}
      {/* pump: base, flywheel, piston, hopper, pipe */}
      <g opacity={pumpA}>
        <Shade x={930} y={TBASE + 8} rx={150} ry={14} o={0.38}/>
        <rect x={800} y={600} width={260} height={176} rx={16} fill="#2f6a7a" stroke="#1b3f4a" strokeWidth={4}/>
        <rect x={800} y={600} width={260} height={32} rx={14} fill="#4a8fa0"/>
        <rect x={814} y={640} width={14} height={120} rx={7} fill="#fff" opacity={0.2}/>
        <circle cx={930} cy={690} r={62} fill="#e9f1f4" stroke="#6a7b86" strokeWidth={5}/>
        {Array.from({length: 6}, (_, i) => <path key={i} d={`M930,690 L930,632`} stroke="#8fa0ab" strokeWidth={6} strokeLinecap="round" transform={`rotate(${i * 60 + f * 3} 930 690)`}/>)}
        <circle cx={930} cy={690} r={14} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.6}/>
        <rect x={906} y={520 + Math.sin(f / 6.5) * 14} width={48} height={90} rx={8} fill="url(#e2-steel)" stroke="#5f7380" strokeWidth={3}/>
        <path d="M850,430 L1010,430 L970,520 H890 Z" fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3.4}/>
        <ellipse cx={930} cy={430} rx={80} ry={12} fill="#6c4a16"/>
        <path d={`M1010,470 H1330 Q1400,470 1400,${NY + 50} V${NY + 70}`} fill="none" stroke="#5f7380" strokeWidth={26} strokeLinecap="round"/>
        <path d={`M1010,470 H1330 Q1400,470 1400,${NY + 50} V${NY + 70}`} fill="none" stroke="#c8d3da" strokeWidth={16} strokeLinecap="round"/>
        <rect x={1382} y={NY + 64} width={36} height={22} rx={5} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.6}/>
        {Array.from({length: 4}, (_, i) => { const u = (f * 0.03 + i * 0.25) % 1; return <Coin key={i} x={930 + Math.sin(u * 6 + i) * 20} y={400 - u * 40} r={16} spin={u * 8} op={Math.sin(u * Math.PI) * 0.9}/>; })}
      </g>
      {/* falling coins into the basin */}
      {f > tPump && Array.from({length: 7}, (_, i) => { const u = ((f - tPump) * 0.034 + i / 7) % 1, ex1 = BX - 50 + (i % 3) * 36, ey1 = BY - 250; return <Coin key={i} x={lerp(NX, ex1, u)} y={lerp(NY + 96, ey1, u * u)} r={18} spin={u * 10 + i} op={pumpA}/>; })}
      {/* the wallet basin */}
      <Wallet x={BX} y={BY} s={1.35} fat={0.2} notes={0} f={f} glow={sit ? eo(prog(f, sit.at, 24)) * 0.9 : 0}
        inside={<CoinHeap x={-10} y={-96} n={nHeap} r={21} seed={5}/>}/>
      {/* two people who expect the rate to rise */}
      <Person x={1710} y={BY - 6} h={250} f={f} seed={41} ph={3}/><Person x={1776} y={BY - 14} h={236} f={f} seed={17} ph={9}/>
      {ex && <g opacity={eo(prog(f, ex.at, 16))}>{[[1690, 500, 10], [1672, 462, 14], [1646, 418, 19]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff9ec" stroke="#b58a52" strokeWidth={2.4}/>)}
        <Chev x={1336} y={296} s={1.5} col="#2f78b8"/></g>}
      {sit && <path d="M1160,452 Q1190,520 1290,566" fill="none" stroke="#8a6b3e" strokeWidth={3} strokeDasharray="7 6" opacity={eo(prog(f, sit.at, 16))}/>}
      {void lt}{void SANS}{void SERIF}{void ECard}{void Cert}{void PriceTag}{void Clock}
    </g>
  );
};
export const LiquidityTankLabels: React.FC<AP> = (p) => <>
  <KeyCard p={p} k="lt" cx={960} y={76} size={46} maxW={900} tone="red"/>
  <KeyCard p={p} k="ex" cx={1590} y={246} size={28} upper={false} maxW={430} tone="cool"/>
  <KeyCard p={p} k="sit" cx={1130} y={360} size={30} upper={false} maxW={520} tone="warm"/>
</>;
