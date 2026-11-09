// ECO-16 Part 1, builder E2: the jobs of money. unit-shelf (pen = five pencils on a balance), shrinking-basket (store of value), asset-shelf (stable / friedman), wallet-idle.
// Figures only from fig(): e16_price (pen, pencil, ratio). Counts of coins and items are picture props, not data.
import React from "react";
import {SANS, SERIF, eo, eio, clamp} from "../kit";
import {fig} from "../../cartoon/long/figs";
import {prog, lerp, type AP} from "./analogy_kit";
import {Room, Shade, Coin, Note, Wallet, Cert, Plaque, Padlock, Clock, PriceTag, Hand, Balance, balGeom, GlassJar, Chev, KeyCard, L, T, ECard} from "./analogy_e2_kit";

// ---- small desk objects ---------------------------------------------------------------------------------------------------------
/** a pencil standing on its flat end (base at x,y), tip up */
const Pencil: React.FC<{x: number; y: number; h?: number; rot?: number; op?: number}> = ({x, y, h = 150, rot = 0, op = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={op}>
    <rect x={-9} y={-20} width={18} height={20} rx={5} fill="#f0a7a0" stroke="#b86a64" strokeWidth={1.4}/>
    <rect x={-10} y={-34} width={20} height={16} fill="url(#e2-steel)" stroke="#6a7b86" strokeWidth={1.2}/>
    <path d="M-10,-26 h20 M-10,-30 h20" stroke="#6a7b86" strokeWidth={1}/>
    <rect x={-10} y={-h + 28} width={20} height={h - 62} fill="#f2c230" stroke="#b88a14" strokeWidth={1.4}/>
    <rect x={-10} y={-h + 28} width={7} height={h - 62} fill="#fff2a0" opacity={0.7}/>
    <rect x={4} y={-h + 28} width={6} height={h - 62} fill="#b88a14" opacity={0.35}/>
    <path d={`M-10,${-h + 30} L0,${-h} L10,${-h + 30} Z`} fill="#efc896" stroke="#b0875a" strokeWidth={1.2}/>
    <path d={`M-3.6,${-h + 12} L0,${-h} L3.6,${-h + 12} Z`} fill="#3b3b40"/>
  </g>
);
/** a pen standing on its cap end, nib up */
const Pen: React.FC<{x: number; y: number; h?: number; rot?: number; op?: number}> = ({x, y, h = 200, rot = 0, op = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={op}>
    <rect x={-13} y={-h + 44} width={26} height={h - 44} rx={9} fill="#1f3f6e" stroke="#122a4c" strokeWidth={1.6}/>
    <rect x={-13} y={-h + 44} width={9} height={h - 44} rx={4} fill="#5f8fcb" opacity={0.65}/>
    <rect x={-14} y={-h + 76} width={28} height={9} fill="#e9b948" stroke="#8e6522" strokeWidth={1}/>
    <path d={`M8,-8 V${-h + 90}`} stroke="#e9b948" strokeWidth={4} strokeLinecap="round"/>
    <path d={`M-12,${-h + 46} L-6,${-h + 14} L6,${-h + 14} L12,${-h + 46} Z`} fill="#c8d3da" stroke="#6a7b86" strokeWidth={1.4}/>
    <path d={`M-4,${-h + 16} L0,${-h} L4,${-h + 16} Z`} fill="#e9b948" stroke="#8e6522" strokeWidth={1}/>
  </g>
);

// ---- unit-shelf --------------------------------------------------------------------------------------------------------------------
export const UnitShelfArt: React.FC<AP> = (p) => {
  const {f} = p, pe = L(p, "pe"), pc = L(p, "pc"), p5 = L(p, "p5"), tp = pc?.at ?? 292, t5 = p5?.at ?? 385;
  const penV = fig({t: "e16_price", state: "India", s: "pen"}).value, pcV = fig({t: "e16_price", state: "India", s: "pencil"}).value, N = Math.round(fig({t: "e16_price", state: "India", s: "ratio"}).value);
  const baseY = 790, PX = 1230, g0 = balGeom(PX, baseY, 340, 330, 0, 130);
  // pen flight
  const tPen = tp + 6, penP = eio(prog(f, tPen, 22));
  const potX = 292, potY = baseY - 8;
  // pencils
  const tP0 = tPen + 26, sp = Math.max(3, (t5 - 10 - tP0) / N), pcLand = (i: number) => eio(prog(f, tP0 + i * sp, 22));
  const nEff = Array.from({length: N}, (_, i) => pcLand(i)).reduce((a, b) => a + b, 0);
  const tEnd = tP0 + (N - 1) * sp + 22, since = Math.max(0, f - tEnd);
  const tilt = 11 * clamp((penV * penP - nEff * pcV) / penV, -1, 1) + (f > tEnd ? 2.4 * Math.exp(-since / 9) * Math.sin(since / 2.6) : 0);
  const g = balGeom(PX, baseY, 340, 330, tilt, 130);
  const penFly = (u: number) => ({x: lerp(potX + 14, g.lx, u), y: lerp(potY - 72, g.lpy - 4, u) - Math.sin(u * Math.PI) * 170});
  const cupX = 560, cupY = baseY - 6;
  const cupSlots = Array.from({length: 8}, (_, i) => ({dx: -34 + i * 9.6 + ((i * 7) % 5), rot: -17 + i * 5 + ((i * 3) % 4)}));
  const levelGlow = eo(prog(f, tEnd + 4, 20)) * (0.7 + 0.3 * Math.sin(f / 9));
  return (
    <g>
      <Room f={f} deskY={770} variant="shop" winX={1260}/>
      {/* pen pot (ceramic) with the pen */}
      <Shade x={potX} y={baseY + 4} rx={80} ry={12}/>
      <Pen x={potX + 14} y={potY - 72} h={196} rot={14} op={penP > 0 ? 0 : 1}/>
      <Pen x={potX - 24} y={potY - 72} h={170} rot={-10}/>
      <path d={`M${potX - 58},${potY - 120} Q${potX - 64},${potY - 20} ${potX - 46},${potY + 4} L${potX + 46},${potY + 4} Q${potX + 64},${potY - 20} ${potX + 58},${potY - 120} Z`} fill="#3a6f8f" stroke="#244a62" strokeWidth={3}/>
      <path d={`M${potX - 58},${potY - 120} Q${potX - 64},${potY - 20} ${potX - 46},${potY + 4} L${potX - 20},${potY + 4} Q${potX - 36},${potY - 40} ${potX - 32},${potY - 120} Z`} fill="#6aa5c6" opacity={0.7}/>
      <ellipse cx={potX} cy={potY - 120} rx={58} ry={10} fill="#244a62"/><ellipse cx={potX} cy={potY - 121} rx={52} ry={7} fill="#1b3748"/>
      <path d={`M${potX - 48},${potY - 72} q48,18 96,0`} stroke="#f6dc94" strokeWidth={4} fill="none" opacity={0.8}/>
      {/* pencil cup (tin) */}
      <Shade x={cupX} y={baseY + 4} rx={70} ry={11}/>
      {cupSlots.map((c, i) => i < N && f >= tP0 + i * sp ? null : <Pencil key={i} x={cupX + c.dx} y={cupY - 98} h={168 + (i % 3) * 14} rot={c.rot}/>)}
      <path d={`M${cupX - 52},${cupY - 112} L${cupX - 44},${cupY} L${cupX + 44},${cupY} L${cupX + 52},${cupY - 112} Z`} fill="url(#e2-steel)" stroke="#5f7380" strokeWidth={3}/>
      {[0, 1, 2, 3].map((k) => <path key={k} d={`M${cupX - 50 + k * 1},${cupY - 100 + k * 26} H${cupX + 50 - k}`} stroke="#8fa0ab" strokeWidth={2} opacity={0.7}/>)}
      <ellipse cx={cupX} cy={cupY - 112} rx={52} ry={9} fill="#5f7380"/><rect x={cupX - 38} y={cupY - 96} width={10} height={86} rx={5} fill="#fff" opacity={0.5}/>
      {/* tags: pen, pencil */}
      {pe && <><path d={`M${potX + 52},${potY - 100} Q${potX + 90},${potY - 150} ${potX + 76},${potY - 214}`} stroke="#8a6b3e" strokeWidth={2.4} fill="none" opacity={eo(prog(f, pe.at, 14))}/>
        <PriceTag x={potX + 76} y={potY - 292} text={pe.text} f={f} at={pe.at} string={false} rot={-4}/></>}
      {pc && <><path d={`M${cupX + 50},${cupY - 108} Q${cupX + 110},${cupY - 150} ${cupX + 120},${cupY - 236}`} stroke="#8a6b3e" strokeWidth={2.4} fill="none" opacity={eo(prog(f, pc.at, 14))}/>
        <PriceTag x={cupX + 120} y={cupY - 300} text={pc.text} f={f} at={pc.at} string={false} rot={4}/></>}
      {/* the balance */}
      <Balance x={PX} baseY={baseY} tilt={tilt} h={340} half={330} chain={130} panW={118}
        left={<>{penP > 0.999 && <Pen x={0} y={-4} h={196}/>}</>}
        right={<>{Array.from({length: N}, (_, i) => pcLand(i) > 0.999 ? <Pencil key={i} x={-78 + i * 39} y={-4} h={150}/> : null)}</>}/>
      {/* flying pen and pencils (drawn above the balance) */}
      {penP > 0 && penP < 1 && <Pen x={penFly(penP).x} y={penFly(penP).y} h={196} rot={lerp(14, 0, penP)}/>}
      {Array.from({length: N}, (_, i) => { const u = pcLand(i); if (u <= 0 || u >= 1) return null; const sx = cupX + cupSlots[i].dx, sy = cupY - 98, ex = g.rx - 78 + i * 39, ey = g.rpy - 4; return <Pencil key={i} x={lerp(sx, ex, u)} y={lerp(sy, ey, u) - Math.sin(u * Math.PI) * 200} h={lerp(168, 150, u)} rot={lerp(cupSlots[i].rot, 0, u) + Math.sin(u * Math.PI) * 18}/>; })}
      {levelGlow > 0.02 && <ellipse cx={PX} cy={g0.py} rx={120} ry={90} fill="#7fe0a0" opacity={0.28 * levelGlow} filter="url(#ak-blur22)"/>}
    </g>
  );
};
export const UnitShelfLabels: React.FC<AP> = (p) => <>
  <KeyCard p={p} k="j2" cx={960} y={78} size={42} maxW={1200}/>
  <KeyCard p={p} k="p5" cx={1230} y={236} size={46} upper={false} maxW={560} tone="green"/>
</>;

// ---- shrinking-basket ------------------------------------------------------------------------------------------------------------
export const Basket: React.FC<{x: number; y: number; items: {id: string; show: number; out: number}[]; f: number; glow: number}> = ({x, y, items, glow}) => {
  const item = (id: string, o: number, outp: number) => {
    const dx = outp * 170, dy = -outp * 150 - Math.sin(outp * Math.PI) * 60, sc = 1 - outp * 0.35, op = 1 - clamp((outp - 0.55) / 0.45);
    const lift: Record<string, number> = {rice: -132, oil: -128, loaf: -156, tomato: -164, banana: -152};
    const base = (c: React.ReactNode, ix: number) => <g key={id} transform={`translate(${ix + dx} ${dy + lift[id]}) scale(${sc})`} opacity={op * o}>{c}</g>;
    switch (id) {
      case "rice": return base(<g><path d="M-52,-6 Q-62,-70 -34,-126 Q0,-146 34,-126 Q62,-70 52,-6 Z" fill="#e9d7ac" stroke="#a98a52" strokeWidth={2.4}/><path d="M-34,-126 Q0,-112 34,-126" fill="none" stroke="#a98a52" strokeWidth={2.4}/><path d="M-26,-132 L-34,-152 M26,-132 L34,-152 M-26,-132 Q0,-120 26,-132" stroke="#a98a52" strokeWidth={4} fill="none" strokeLinecap="round"/><circle cx={0} cy={-70} r={20} fill="#c63f2f" opacity={0.85}/><path d="M-8,-70 h16 M0,-78 v16" stroke="#fff" strokeWidth={4} opacity={0.8}/><rect x={-44} y={-110} width={14} height={90} rx={7} fill="#fff" opacity={0.3}/></g>, -118);
      case "oil": return base(<g><path d="M-20,-4 L-26,-100 Q-26,-124 -12,-136 L-12,-170 L12,-170 L12,-136 Q26,-124 26,-100 L20,-4 Z" fill="#e0a21c" stroke="#8c5f0a" strokeWidth={2.4} opacity={0.95}/><rect x={-14} y={-196} width={28} height={30} rx={5} fill="#c63f2f" stroke="#7a2a1d" strokeWidth={2}/><rect x={-18} y={-92} width={36} height={44} rx={5} fill="#fff7e2" stroke="#b58a52" strokeWidth={1.6}/><circle cy={-70} r={9} fill="#e0a21c"/><rect x={-20} y={-122} width={9} height={100} rx={4} fill="#fff" opacity={0.45}/></g>, -52);
      case "loaf": return base(<g><path d="M-62,-4 Q-72,-52 -34,-66 Q0,-76 34,-66 Q72,-52 62,-4 Z" fill="#d79a4a" stroke="#8c5a1d" strokeWidth={2.4}/>{[-30, 0, 30].map((dx) => <path key={dx} d={`M${dx - 8},-60 q8,14 -2,30`} stroke="#f4cf8a" strokeWidth={5} fill="none" strokeLinecap="round"/>)}<path d="M-50,-50 Q-20,-70 20,-68" stroke="#f9dfa6" strokeWidth={4} fill="none" opacity={0.7}/></g>, 16);
      case "tomato": return base(<g>{[[-18, -20], [18, -22], [0, -48]].map(([a, b], i) => <g key={i}><circle cx={a} cy={b} r={24} fill="#d9402e" stroke="#8c2217" strokeWidth={2}/><circle cx={a - 8} cy={b - 9} r={7} fill="#fff" opacity={0.4}/><path d={`M${a - 8},${b - 22} l8,6 l8,-6 l-8,-4 Z`} fill="#3f8a3a"/></g>)}</g>, 86);
      default: return base(<g>{[0, 1, 2, 3].map((i) => <path key={i} d={`M${-50 + i * 16},-20 Q${-30 + i * 16},-88 ${10 + i * 12},-96 Q${-6 + i * 14},-60 ${-40 + i * 16},-12 Z`} fill="#f2cf3c" stroke="#a8861a" strokeWidth={2}/>)}<path d="M-34,-98 q22,-18 52,-4" stroke="#7a5a1a" strokeWidth={7} fill="none" strokeLinecap="round"/></g>, 128);
    }
  };
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shade x={0} y={6} rx={210} ry={16} o={0.34}/>
      {glow > 0.01 && <ellipse cx={0} cy={-100} rx={290} ry={170} fill="#ffd37a" opacity={0.5 * glow} filter="url(#ak-blur22)"/>}
      <path d="M-170,-190 Q0,-318 170,-190" fill="none" stroke="#8a5a2a" strokeWidth={13} strokeLinecap="round"/>
      <path d="M-170,-190 Q0,-318 170,-190" fill="none" stroke="#d9a468" strokeWidth={5} strokeLinecap="round" transform="translate(0 -2)"/>
      {items.map((it) => item(it.id, it.show, it.out))}
      <path d="M-200,-150 L-160,0 L160,0 L200,-150 Z" fill="#c68b4e" stroke="#7a4a1e" strokeWidth={3.4}/>
      {Array.from({length: 7}, (_, i) => <path key={`h${i}`} d={`M${-196 + i * 4},${-132 + i * 22} H${196 - i * 4}`} stroke="#8a5a2a" strokeWidth={5} opacity={0.75}/>)}
      {Array.from({length: 11}, (_, i) => <path key={`v${i}`} d={`M${-170 + i * 34},-150 L${-150 + i * 30},0`} stroke="#e6bc84" strokeWidth={5} opacity={0.6}/>)}
      <rect x={-208} y={-164} width={416} height={26} rx={13} fill="#a8703a" stroke="#6a3f18" strokeWidth={3}/>
      <rect x={-200} y={-160} width={400} height={7} rx={3} fill="#f0cd98" opacity={0.7}/>
    </g>
  );
};

const Calendar: React.FC<{x: number; y: number; flips: number[]; f: number}> = ({x, y, flips, f}) => {
  const cells = (seed: number) => Array.from({length: 5 * 7}, (_, i) => <rect key={i} x={-88 + (i % 7) * 26} y={-96 + Math.floor(i / 7) * 34 + 52} width={20} height={26} rx={3} fill={(i * 7 + seed * 5) % 11 === 0 ? "#e8b9a8" : "#f2e6c9"} stroke="#d5bf92" strokeWidth={1}/>);
  const page = (seed: number, hue: string) => <g><rect x={-104} y={-100} width={208} height={290} rx={6} fill="url(#e2-paper)" stroke="#b79b66" strokeWidth={2}/><rect x={-104} y={-100} width={208} height={64} rx={6} fill={hue}/><rect x={-86} y={-82} width={110} height={12} rx={4} fill="#fff" opacity={0.7}/><rect x={-86} y={-62} width={70} height={9} rx={3} fill="#fff" opacity={0.45}/>{cells(seed)}</g>;
  const k = flips.filter((t) => f >= t).length, last = k ? flips[k - 1] : -99, u = prog(f, last, 14);
  const hues = ["#b5483a", "#3f7a8f", "#7a5aa0", "#4f8a55"];
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shade x={10} y={206} rx={100} ry={10} o={0.2}/>
      <rect x={-112} y={-108} width={224} height={306} rx={9} fill="#6a4a2a" opacity={0.3} transform="translate(6 8)"/>
      <g>{page(k + 1, hues[(k + 1) % 4])}</g>
      <g transform={`translate(0 -100) scale(1 ${k && u < 1 ? Math.cos(u * Math.PI / 2) : (k === 0 ? 1 : 0)}) translate(0 100)`} opacity={k && u >= 1 ? 0 : 1}>{page(k, hues[k % 4])}</g>
      {[-70, -35, 0, 35, 70].map((dx) => <g key={dx}><circle cx={dx} cy={-104} r={7} fill="#2a1d16"/><path d={`M${dx},-104 v-16`} stroke="#9aa6b0" strokeWidth={5} strokeLinecap="round"/></g>)}
      <path d="M-30,-130 H30" stroke="#6a4a2a" strokeWidth={4}/>
    </g>
  );
};

export const BasketArt: React.FC<AP> = (p) => {
  const {f} = p, j3 = T(p, "j3", 85), pp = T(p, "pp", 292);
  const t0 = j3 + 16, t1 = Math.max(t0 + 60, pp - 26), cyc = (t1 - t0) / 3, flips = [t0 + cyc, t0 + 2 * cyc, t0 + 3 * cyc];
  const ids = ["rice", "oil", "loaf", "tomato", "banana"], outAt: Record<string, number | null> = {banana: flips[0], tomato: flips[1], loaf: flips[2], rice: null, oil: null};
  const items = ids.map((id) => { const t = outAt[id]; return {id, show: 1, out: t == null ? 0 : eio(prog(f, t - 8, 22))}; });
  const kDone = flips.filter((t) => f >= t - 8).length, tagA = eo(prog(f, j3 + 4, 20));
  const jarShine = (Math.sin(f / 10) + 1) / 2;
  const tagFor = (id: string, bx: number, topY: number) => {
    const k = ids.includes(id) ? kDone : 0, rise = Math.min(kDone, 3), bounce = kDone ? Math.exp(-Math.max(0, f - (flips[kDone - 1] - 8)) / 10) * Math.sin(Math.max(0, f - (flips[kDone - 1] - 8)) / 2) * 4 : 0;
    const s = 0.82 + 0.1 * rise, ty = topY - 54 - rise * 26 + bounce;
    return <g key={id} opacity={tagA * (outAt[id] == null || items.find((i) => i.id === id)!.out < 0.5 ? 1 : 0)} transform={`translate(${bx} ${ty}) scale(${s})`}>
      <path d={`M0,${40 + rise * 26 / s} Q-10,${20} 0,2`} stroke="#8a6b3e" strokeWidth={2.4} fill="none"/>
      <path d="M-34,-24 L34,-24 L34,24 L-34,24 L-34,-12 Z" fill="#fff7e2" stroke="#b58a52" strokeWidth={2.4} style={{filter: "drop-shadow(0 6px 6px rgba(40,22,8,.35))"}}/>
      <circle cx={-24} cy={-14} r={4} fill="#d7c29a" stroke="#b58a52" strokeWidth={1.4}/>
      <text x={6} y={14} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={34} fill="#5e2a0e">₹</text>
      <Chev x={52} y={-14 - Math.max(0, k - 0) * 0} s={0.55} col="#c63f2f"/>
      {void k}
    </g>;
  };
  const bx = 1330, by = 800;
  return (
    <g>
      <Room f={f} deskY={770} variant="shop" winX={1360}/>
      <Calendar x={800} y={300} flips={flips} f={f}/>
      <GlassJar x={440} y={by - 4} w={260} h={300} n={21} seed={3} glow={0}/>
      {Array.from({length: 4}, (_, i) => { const u = (f * 0.014 + i * 0.27) % 1; return <path key={i} d={`M${340 + i * 70},${by - 150 - u * 40} l6,-12 l6,12 l-12,0 z`} fill="#fff6cf" opacity={0.7 * Math.sin(u * Math.PI) * (0.6 + 0.4 * jarShine)} transform={`rotate(${u * 60} ${346 + i * 70} ${by - 156})`}/>; })}
      <g transform={`translate(${bx} ${by}) scale(1.18) translate(${-bx} ${-by})`}>
        <Basket x={bx} y={by} items={items} f={f} glow={eo(prog(f, pp, 24)) * (0.6 + 0.4 * Math.sin(f / 12))}/>
        {tagFor("rice", bx - 118, by - 282)}{tagFor("oil", bx - 52, by - 324)}{tagFor("loaf", bx + 16, by - 232)}
      </g>
    </g>
  );
};
export const BasketLabels: React.FC<AP> = (p) => <>
  <KeyCard p={p} k="j3" cx={960} y={78} size={42} maxW={1200}/>
  <KeyCard p={p} k="pp" cx={1330} y={836} size={30} upper={false} maxW={900} tone="green"/>
</>;

// ---- asset-shelf ----------------------------------------------------------------------------------------------------------------------
const GoldBar: React.FC<{x: number; y: number; w?: number; f: number; shine?: number}> = ({x, y, w = 230, f, shine = 1}) => {
  const h = w * 0.3, d = w * 0.16, sp = ((f * 0.02) % 1.4) - 0.2;
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shade x={0} y={4} rx={w * 0.62} ry={13} o={0.4}/>
      <path d={`M${-w / 2},0 L${-w / 2 + d},${-d * 0.6} L${w / 2 + d * 0.2},${-d * 0.6} L${w / 2},0 Z`} fill="#8c5f18"/>
      <path d={`M${-w / 2},0 L${-w / 2 + w * 0.08},${-h} L${w / 2 - w * 0.08},${-h} L${w / 2},0 Z`} fill="url(#e2-gold)" stroke="#9c6d18" strokeWidth={2.4}/>
      <path d={`M${-w / 2 + w * 0.08},${-h} L${-w / 2 + w * 0.08 + d},${-h - d * 0.6} L${w / 2 - w * 0.08 + d * 0.2},${-h - d * 0.6} L${w / 2 - w * 0.08},${-h} Z`} fill="#fff1b0" stroke="#c99a30" strokeWidth={2}/>
      <path d={`M${w / 2 - w * 0.08},${-h} L${w / 2 - w * 0.08 + d * 0.2 + d * 0.0},${-h - d * 0.6} L${w / 2 + d * 0.2},${-d * 0.6} L${w / 2},0 Z`} fill="#b8801e" stroke="#9c6d18" strokeWidth={2}/>
      <rect x={-w * 0.3} y={-h * 0.72} width={w * 0.6} height={h * 0.44} rx={6} fill="none" stroke="#a8741c" strokeWidth={2.4} opacity={0.8}/>
      <polygon points="0,-30 9,-20 -9,-20" transform={`translate(0 ${-h * 0.58 + 22}) scale(0.9)`} fill="#a8741c" opacity={0}/>
      <path d={`M${-w * 0.18},${-h * 0.5} h${w * 0.36} M${-w * 0.12},${-h * 0.36} h${w * 0.24}`} stroke="#a8741c" strokeWidth={3} strokeLinecap="round" opacity={0.7}/>
      <path d={`M${-w * 0.4},${-h * 0.9} L${-w * 0.2},${-h * 0.9}`} stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.7}/>
      <g opacity={shine * clamp(1 - Math.abs(sp - 0.5) * 3)}><path d={`M${-w / 2 + sp * w},${-h - 6} l16,-28 l16,28 l-16,28 Z`} fill="#fffbe0" opacity={0.9}/></g>
    </g>
  );
};
const LandTile: React.FC<{x: number; y: number; w?: number; f: number}> = ({x, y, w = 290, f}) => {
  const hw = w / 2, hh = w * 0.21, th = 28, rows = 7;
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shade x={0} y={th} rx={w * 0.58} ry={16} o={0.36}/>
      <path d={`M${-hw},0 L0,${hh} L${hw},0 L${hw},${th} L0,${hh + th} L${-hw},${th} Z`} fill="#7a4b26" stroke="#4d2c12" strokeWidth={2.4}/>
      <path d={`M0,${hh} L${hw},0 L${hw},${th} L0,${hh + th} Z`} fill="#5a3418" opacity={0.55}/>
      <path d={`M${-hw},0 L0,${-hh} L${hw},0 L0,${hh} Z`} fill="#8fbf5a" stroke="#4d7a2a" strokeWidth={2.4}/>
      <path d={`M${-hw},0 L0,${-hh} L${hw},0 L0,${hh} Z`} fill="#c9e68c" opacity={0.28}/>
      {Array.from({length: rows}, (_, i) => { const t = (i + 0.5) / rows; return <path key={i} d={`M${lerp(-hw, 0, t) + 0},${lerp(0, -hh, t)} L${lerp(0, hw, t)},${lerp(hh, 0, t)}`} stroke={i % 2 ? "#6f9a3c" : "#a7d072"} strokeWidth={6} opacity={0.8} strokeLinecap="round" transform={`translate(${hw * 0.5} ${hh * 0.5})`}/>; })}
      {[[-hw * 0.62, -hh * 0.1], [hw * 0.55, hh * 0.12]].map(([a, b], i) => <g key={i} transform={`translate(${a} ${b})`}><path d="M0,0 V-46" stroke="#6a4a2a" strokeWidth={5} strokeLinecap="round"/><path d={`M0,-46 h${i ? -28 : 28} l${i ? 8 : -8},10 l${i ? -8 : 8},10 h${i ? 28 : -28}`} fill="#e9b948" stroke="#8e6522" strokeWidth={1.6} opacity={0.0}/><path d="M0,-46 l32,8 l-32,10 Z" fill={i ? "#c63f2f" : "#e9b948"} stroke="#6c4a16" strokeWidth={1.6} transform={`scale(${i ? -1 : 1} 1)`}/></g>)}
      <g transform={`translate(${hw * 0.08} ${-hh * 0.1})`}><path d="M0,0 V-36" stroke="#5a3d22" strokeWidth={7} strokeLinecap="round"/><circle cx={0} cy={-52} r={24} fill="#3f8a45"/><circle cx={-9} cy={-60} r={14} fill="#6cb05a" opacity={0.8}/></g>
      <path d={`M${-hw * 0.8},${hh * 0.04} L${-hw * 0.1},${-hh * 0.78} M${hw * 0.1},${hh * 0.78} L${hw * 0.8},${-hh * 0.04}`} stroke="#fff" strokeWidth={2} strokeDasharray="6 8" opacity={0.5}/>
      <g opacity={0.0}>{void f}</g>
    </g>
  );
};
const Pedestal: React.FC<{x: number; y: number; w: number; h: number; col?: string}> = ({x, y, w, h, col = "#b88a50"}) => (
  <g>
    <Shade x={x} y={y + h} rx={w * 0.58} ry={12} o={0.34}/>
    <rect x={x - w / 2} y={y} width={w} height={h} rx={8} fill={col} stroke="#6a4520" strokeWidth={2.4}/>
    <rect x={x - w / 2 + 6} y={y + 5} width={w - 12} height={7} rx={3} fill="#f6dfb2" opacity={0.6}/>
    <rect x={x - w / 2 - 8} y={y - 10} width={w + 16} height={14} rx={6} fill="#d6a966" stroke="#6a4520" strokeWidth={2}/>
  </g>
);

const lockClosed = (f: number, at: number | undefined) => at == null ? {c: 0, k: 0} : {c: eio(prog(f, at + 2, 12)), k: prog(f, at + 12, 22)};

export const AssetShelfArt: React.FC<AP> = (p) => {
  const mode = (p.spec as any).mode;
  return mode === "friedman" ? <FriedmanArt {...p}/> : <StableArt {...p}/>;
};
export const AssetShelfLabels: React.FC<AP> = (p) => (p.spec as any).mode === "friedman" ? <FriedmanLabels {...p}/> : <StableLabels {...p}/>;

const StableArt: React.FC<AP> = (p) => {
  const {f} = p, ag = L(p, "ag"), al = L(p, "al"), ab = L(p, "ab"), cv = L(p, "cv");
  const SY = 640, xs = [480, 860, 1240], locks = [lockClosed(f, ag?.at), lockClosed(f, al?.at), lockClosed(f, ab?.at)];
  const cvA = eo(prog(f, cv?.at ?? 1e9, 26)), run = (f * 0.7) % 60;
  return (
    <g>
      <Room f={f} deskY={800} variant="study" winX={1350}/>
      {/* wall shelf board with brackets */}
      <Shade x={860} y={SY + 66} rx={640} ry={14} o={0.22}/>
      <rect x={250} y={SY} width={1220} height={44} rx={8} fill="url(#e2-wood)" stroke="#5a3418" strokeWidth={3}/>
      <rect x={250} y={SY} width={1220} height={9} rx={4} fill="#f0cd98" opacity={0.7}/>
      {[330, 860, 1390].map((x) => <path key={x} d={`M${x - 20},${SY + 44} v70 l-50,0 M${x - 20},${SY + 44} L${x - 70},${SY + 114}`} stroke="#6a4520" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.0}/>)}
      {[330, 1390].map((x) => <path key={x} d={`M${x},${SY + 44} v92 M${x},${SY + 44} l${x < 860 ? 64 : -64},0 M${x},${SY + 136} l${x < 860 ? 50 : -50},-92`} stroke="#6a4520" strokeWidth={10} fill="none" strokeLinecap="round"/>)}
      {/* gold on a velvet cushion */}
      <ellipse cx={xs[0]} cy={SY - 6} rx={150} ry={22} fill="#7a1f2e" stroke="#4d1018" strokeWidth={2.4}/>
      <ellipse cx={xs[0]} cy={SY - 16} rx={140} ry={18} fill="#a8334a"/>
      <GoldBar x={xs[0]} y={SY - 18} f={f}/>
      {/* land */}
      <Pedestal x={xs[1]} y={SY - 40} w={190} h={30}/>
      <LandTile x={xs[1]} y={SY - 112} f={f}/>
      {/* bond in a stand */}
      <Pedestal x={xs[2]} y={SY - 22} w={210} h={12} col="#a9835a"/>
      <Cert x={xs[2]} y={SY - 142} w={250} rot={-2} word="BOND"/>
      <path d={`M${xs[2] - 112},${SY - 34} l-12,-6 v-12 M${xs[2] + 112},${SY - 34} l12,-6 v-12`} stroke="#6a7b86" strokeWidth={5} fill="none" strokeLinecap="round"/>
      {/* padlocks */}
      {xs.map((x, i) => ag || al || ab ? <Padlock key={i} x={x + (i === 0 ? 136 : i === 1 ? 150 : 148)} y={SY - 60} s={1.1} closed={locks[i].c} click={locks[i].k}/> : null)}
      {/* conversion: slow dashed path to a ghost coin, with an hourglass */}
      <g opacity={cvA}>
        <path d={`M${xs[0] + 20},${SY + 100} H${xs[2] + 250}`} stroke="#9a7a4a" strokeWidth={5} strokeDasharray="14 10" strokeDashoffset={-run} fill="none" strokeLinecap="round"/>
        <polygon points={`${xs[2] + 252},${SY + 80} ${xs[2] + 290},${SY + 100} ${xs[2] + 252},${SY + 120}`} fill="#9a7a4a" transform="translate(-6 0)"/>
        <g opacity={0.4}><Coin x={1640} y={SY + 100} r={42} spin={0.4}/></g>
        <g transform={`translate(${1060} ${SY + 100})`}>
          <path d="M-24,-40 H24 V-34 Q24,-10 6,0 Q24,10 24,34 V40 H-24 V34 Q-24,10 -6,0 Q-24,-10 -24,-34 Z" fill="#e9f3f7" fillOpacity={0.7} stroke="#7a5a2a" strokeWidth={4}/>
          <path d={`M-16,-34 H16 Q14,-18 0,-6 Q-14,-18 -16,-34 Z`} fill="#e9b948" opacity={0.9}/>
          <path d="M0,0 V26" stroke="#e9b948" strokeWidth={3} strokeDasharray="4 4" strokeDashoffset={-f}/>
          <path d="M-14,38 H14 Q10,28 0,20 Q-10,28 -14,38 Z" fill="#e9b948"/>
          <rect x={-30} y={-46} width={60} height={9} rx={3} fill="#7a5a2a"/><rect x={-30} y={37} width={60} height={9} rx={3} fill="#7a5a2a"/>
        </g>
      </g>
    </g>
  );
};
const StableLabels: React.FC<AP> = (p) => {
  const xs = [480, 860, 1240];
  return <>
    <KeyCard p={p} k="st" cx={960} y={76} size={38} upper={false} maxW={1320}/>
    <KeyCard p={p} k="ag" cx={xs[0]} y={330} size={32} upper={false} tone="warm"/>
    <KeyCard p={p} k="al" cx={xs[1]} y={330} size={32} upper={false} tone="green"/>
    <KeyCard p={p} k="ab" cx={xs[2]} y={330} size={32} upper={false} tone="cool"/>
    <KeyCard p={p} k="cv" cx={1020} y={800} size={32} upper={false} maxW={760} tone="red"/>
  </>;
};

// ---- friedman ---------------------------------------------------------------------------------------------------------------------------
const SLOTS = [330, 645, 960, 1275, 1590];
const SalesBag: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <Shade x={0} y={2} rx={64} ry={10}/>
    <path d="M-40,-96 Q-40,-140 0,-140 Q40,-140 40,-96" fill="none" stroke="#7a4a1e" strokeWidth={7} strokeLinecap="round"/>
    <path d="M-62,0 L-52,-100 L52,-100 L62,0 Z" fill="#c9954f" stroke="#7a4a1e" strokeWidth={3}/>
    <path d="M10,-100 L52,-100 L62,0 L22,0 Z" fill="#8a5a24" opacity={0.35}/>
    <path d="M-52,-100 L0,-86 L52,-100" fill="none" stroke="#7a4a1e" strokeWidth={2.4}/>
    <circle cx={0} cy={-50} r={18} fill="#fff7e2" stroke="#7a4a1e" strokeWidth={2}/><path d="M-9,-50 h18 M0,-59 v18" stroke="#c63f2f" strokeWidth={4}/>
  </g>
);
const Lamp: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => (
  <g transform={`translate(${x} ${y})`}>
    <Shade x={0} y={2} rx={46} ry={8}/>
    <ellipse cx={0} cy={-120} rx={96} ry={78} fill="#fff1b0" opacity={0.22 + 0.04 * Math.sin(f / 8)} filter="url(#ak-blur22)"/>
    <ellipse cx={0} cy={-6} rx={38} ry={8} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
    <rect x={-6} y={-130} width={12} height={124} rx={5} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2}/>
    <path d="M-50,-124 L-30,-176 L30,-176 L50,-124 Z" fill="#f6e4b8" stroke="#b58a52" strokeWidth={2.4}/>
    <path d="M10,-176 L30,-176 L50,-124 L22,-124 Z" fill="#d6b87c" opacity={0.5}/>
    <ellipse cx={0} cy={-124} rx={50} ry={7} fill="#fff7d2" stroke="#b58a52" strokeWidth={2}/>
  </g>
);
const ToolBox: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <Shade x={0} y={2} rx={92} ry={10}/>
    <path d="M-38,-80 Q-38,-112 0,-112 Q38,-112 38,-80" fill="none" stroke="#5f7380" strokeWidth={9} strokeLinecap="round"/>
    <rect x={-86} y={-84} width={172} height={84} rx={9} fill="#c8402f" stroke="#7a2418" strokeWidth={3}/>
    <rect x={-86} y={-84} width={172} height={22} rx={9} fill="#e4604a"/>
    <rect x={-12} y={-70} width={24} height={20} rx={4} fill="url(#e2-steel)" stroke="#5f7380" strokeWidth={2}/>
    <path d="M-86,-48 H86" stroke="#7a2418" strokeWidth={2.4}/>
    <g transform="translate(-52 -90) rotate(-28)"><rect x={-5} y={-46} width={10} height={64} rx={4} fill="url(#e2-steel)" stroke="#5f7380" strokeWidth={1.6}/><path d="M-14,-46 a14,14 0 1 1 28,0 l-8,0 a6,6 0 1 0 -12,0 Z" fill="url(#e2-steel)" stroke="#5f7380" strokeWidth={1.6}/></g>
  </g>
);
const Book: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y}) rotate(7)`}>
    <rect x={-34} y={-122} width={68} height={122} rx={5} fill="#2f5f8f" stroke="#183a5c" strokeWidth={2.4}/>
    <rect x={-34} y={-122} width={14} height={122} rx={4} fill="#1c4468"/>
    <rect x={-12} y={-100} width={36} height={8} rx={3} fill="#e9b948"/><rect x={-12} y={-84} width={26} height={6} rx={3} fill="#e9b948" opacity={0.7}/>
    <rect x={30} y={-118} width={7} height={114} fill="#fff7e2" stroke="#b58a52" strokeWidth={1}/>
  </g>
);
const Pointer: React.FC = () => null;

const FriedmanArt: React.FC<AP> = (p) => {
  const {f} = p, as = L(p, "as"), bd = L(p, "bd"), hw = L(p, "hw"), fr = L(p, "fr"), st = L(p, "st");
  const tAs = as?.at ?? 258, tBd = bd?.at ?? 292, tHw = hw?.at ?? 362;
  const sh = L(p, "sh", tBd + (tHw - tBd) / 3), pg = L(p, "pg", tBd + (2 * (tHw - tBd)) / 3);
  const stops = [tAs + 6, tBd, sh!.at, pg!.at, tHw]; // when the balance reaches each asset
  const SY = 706;
  // balance position: a smooth path along the stops
  const xAt = (() => { let x = SLOTS[0]; for (let i = 1; i < 5; i++) x = lerp(x, SLOTS[i], eio(prog(f, stops[i] - 14, 14))); return x; })();
  const enter = eo(prog(f, tAs - 14, 24)), exit = eo(prog(f, tHw + 70, 26)), vis = enter * (1 - exit);
  const dwell = (i: number) => stops[i], active = stops.reduce((a, t, i) => (f >= t - 4 ? i : a), -1);
  const wob = (() => { if (active < 0) return 0; const s = f - stops[active]; return 14 * Math.exp(-s / 12) * Math.sin(s / 2.6) + 3 * Math.sin(f / 14); })();
  const hy = lerp(150, 430, vis) - exit * 240;
  const weighed = (i: number) => eo(prog(f, stops[i] + 6, 18));
  const glow = (i: number) => weighed(i) * (i === 0 ? 1 : 0.7);
  return (
    <g>
      <Room f={f} deskY={770} variant="study" winX={1380}/>
      {/* long display plank */}
      <Shade x={960} y={SY + 74} rx={900} ry={14} o={0.22}/>
      <rect x={150} y={SY} width={1620} height={46} rx={8} fill="url(#e2-wood)" stroke="#5a3418" strokeWidth={3}/>
      <rect x={150} y={SY} width={1620} height={9} rx={4} fill="#f0cd98" opacity={0.7}/>
      {[260, 960, 1660].map((x) => <path key={x} d={`M${x},${SY + 46} v26`} stroke="#6a4520" strokeWidth={10} strokeLinecap="round"/>)}
      {/* glows under each asset once weighed */}
      {SLOTS.map((x, i) => glow(i) > 0.01 ? <ellipse key={i} cx={x} cy={SY - 90} rx={140} ry={110} fill={i === 0 ? "#ffd37a" : "#fff0b8"} opacity={0.42 * glow(i)} filter="url(#ak-blur22)"/> : null)}
      {/* assets */}
      <Wallet x={SLOTS[0]} y={SY + 4} s={0.78} fat={0.45} f={f} notes={3} coins={0}/>
      <Cert x={SLOTS[1]} y={SY - 84} w={230} word="BOND" rot={-2}/>
      <path d={`M${SLOTS[1] - 100},${SY - 8} l-10,-6 M${SLOTS[1] + 100},${SY - 8} l10,-6`} stroke="#6a7b86" strokeWidth={5} strokeLinecap="round"/>
      <Cert x={SLOTS[2]} y={SY - 84} w={230} word="SHARE" ink="#7a2a3a" rot={2}/>
      <path d={`M${SLOTS[2] - 100},${SY - 8} l-10,-6 M${SLOTS[2] + 100},${SY - 8} l10,-6`} stroke="#6a7b86" strokeWidth={5} strokeLinecap="round"/>
      <SalesBag x={SLOTS[3] - 60} y={SY}/><Lamp x={SLOTS[3] + 70} y={SY} f={f}/>
      <ToolBox x={SLOTS[4] - 50} y={SY}/><Book x={SLOTS[4] + 84} y={SY - 2}/>
      {/* hand holding the small balance */}
      {vis > 0.01 && (() => {
        const bx = xAt, by = hy + 12, half = 96, tl = wob * 0.55, a = (tl * Math.PI) / 180, lx = bx - half * Math.cos(a), ly = by + 70 + half * Math.sin(a), rx = bx + half * Math.cos(a), ry = by + 70 - half * Math.sin(a);
        const pan = (cx: number, cy: number, k: string) => <g key={k}><path d={`M${cx},${cy - 60} L${cx - 54},${cy} M${cx},${cy - 60} L${cx + 54},${cy}`} stroke="#8e6522" strokeWidth={2.4} fill="none"/><path d={`M${cx - 60},${cy} Q${cx},${cy + 30} ${cx + 60},${cy} Z`} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.2}/></g>;
        return <g opacity={vis} transform={`translate(${bx} ${by}) scale(1.55) translate(${-bx} ${-by})`}>
          <Hand x={bx} y={by - 28} s={1.15} len={900} sleeve="#7a5a8f" shade="#4d3860"/>
          <circle cx={bx} cy={by + 12} r={14} fill="none" stroke="url(#e2-brass)" strokeWidth={6}/>
          <path d={`M${bx},${by + 26} L${bx},${by + 70}`} stroke="#6c4a16" strokeWidth={4}/>
          {pan(lx, ly + 4, "l")}{pan(rx, ry + 4, "r")}
          <path d={`M${lx},${ly} L${rx},${ry}`} stroke="#6c4a16" strokeWidth={13} strokeLinecap="round"/><path d={`M${lx},${ly} L${rx},${ry}`} stroke="url(#e2-brass)" strokeWidth={8} strokeLinecap="round"/>
          <circle cx={bx} cy={by + 70} r={9} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2}/>
          <g transform={`translate(${rx} ${ry + 4 - 4})`}><rect x={-22} y={-22} width={44} height={22} rx={4} fill="url(#e2-steel)" stroke="#5f7380" strokeWidth={2}/></g>
        </g>;
      })()}
      {fr && <Plaque x={500} y={196} w={430} text={fr.text} f={f} at={fr.at} size={44}/>}
      {st && null}
      {void dwell}{void Pointer}
    </g>
  );
};
const FriedmanLabels: React.FC<AP> = (p) => {
  const tBd = T(p, "bd", 292), tHw = T(p, "hw", 362), tSh = tBd + (tHw - tBd) / 3, tPg = tBd + (2 * (tHw - tBd)) / 3;
  const nm = (k: string, i: number, at?: number) => <KeyCard key={k} p={p} k={k} at={at} cx={SLOTS[i]} y={788} size={28} upper={false} tone={i === 4 ? "cool" : "warm"}/>;
  return <>
    <KeyCard p={p} k="as" cx={1330} y={92} size={36} maxW={900}/>
    {nm("bd", 1)}{nm("sh", 2, tSh)}{nm("pg", 3, tPg)}{nm("hw", 4)}
    <KeyCard p={p} k="st" cx={500} y={262} size={30} upper={false} maxW={640} tone="green"/>
  </>;
};

// ---- wallet-idle -------------------------------------------------------------------------------------------------------------------------
export const WalletIdleArt: React.FC<AP> = (p) => {
  const {f, dur} = p, wi = T(p, "wi", 96);
  const wob = Math.sin(f / 22) * 0.4, drawP = eio(prog(f, 14, Math.max(60, dur - 40)));
  const bx = 1170, by = 380, bw = 560, bh = 340, lx0 = bx + 56, lx1 = bx + bw - 44, ly = by + bh * 0.62, lx = lerp(lx0, lx1, drawP);
  const sec = ["a", "b", "c"];
  return (
    <g>
      <Room f={f} deskY={770} variant="shop" winX={900}/>
      <Wallet x={470} y={812} s={1.35} fat={0.1} notes={0} f={f} inside={<Coin x={0} y={-174} r={42} spin={0.25 + wob * 0.5}/>}/>
      <g transform={`translate(${470} ${812 - 360})`}><path d="M-60,0 Q0,-26 60,0" stroke="#fff6cf" strokeWidth={0} fill="none"/></g>
      {[0, 1, 2].map((i) => { const u = (f * 0.011 + i * 0.33) % 1; return <path key={sec[i]} d={`M${470 - 30 + i * 30},${604 - u * 70} l5,-9 l5,9 l-10,0 z`} fill="#fff6cf" opacity={0.75 * Math.sin(u * Math.PI)}/>; })}
      <Clock x={890} y={500} r={104} f={f} tick={14} stand/>
      {/* graph paper with a flat line */}
      <g transform={`rotate(1.5 ${bx + bw / 2} ${by + bh / 2})`}>
        <rect x={bx + 10} y={by + 14} width={bw} height={bh} rx={10} fill="#2a1808" opacity={0.28} filter="url(#ak-blur8)"/>
        <rect x={bx} y={by} width={bw} height={bh} rx={10} fill="url(#e2-paper)" stroke="#b79b66" strokeWidth={2.4}/>
        {Array.from({length: 11}, (_, i) => <path key={`v${i}`} d={`M${bx + 30 + i * 50},${by + 26} V${by + bh - 36}`} stroke="#bcd0c6" strokeWidth={1.4}/>)}
        {Array.from({length: 7}, (_, i) => <path key={`h${i}`} d={`M${bx + 30},${by + 36 + i * 44} H${bx + bw - 30}`} stroke="#bcd0c6" strokeWidth={1.4}/>)}
        <path d={`M${bx + 46},${by + 26} V${by + bh - 46} H${bx + bw - 30}`} stroke="#4a3520" strokeWidth={4} fill="none" strokeLinecap="round"/>
        <polygon points={`${bx + bw - 22},${by + bh - 46} ${bx + bw - 40},${by + bh - 56} ${bx + bw - 40},${by + bh - 36}`} fill="#4a3520"/>
        <polygon points={`${bx + 46},${by + 18} ${bx + 36},${by + 38} ${bx + 56},${by + 38}`} fill="#4a3520"/>
        <path d={`M${lx0},${ly} L${lx},${ly}`} stroke="#c63f2f" strokeWidth={7} strokeLinecap="round"/>
        <circle cx={lx} cy={ly} r={11} fill="#c63f2f" stroke="#7a2a1d" strokeWidth={2}/><circle cx={lx - 3} cy={ly - 3} r={4} fill="#fff" opacity={0.6}/>
        <circle cx={bx + bw / 2} cy={by - 6} r={11} fill="#c63f2f" stroke="#7a2a1d" strokeWidth={2}/><circle cx={bx + bw / 2 - 3} cy={by - 9} r={4} fill="#fff" opacity={0.6}/>
      </g>
      {void wi}{void SANS}{void Note}{void Cert}{void Plaque}{void Padlock}{void Hand}{void ECard}
    </g>
  );
};
export const WalletIdleLabels: React.FC<AP> = (p) => <KeyCard p={p} k="wi" cx={960} y={96} size={46} maxW={1200}/>;
