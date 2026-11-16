// ECO-12 Part 1, builder X1: `tax-wedge`, `staircases`, `family-jars`, `subsidy-tag`. Diagrams carry no typed figures; the labels do.
import React from "react";
import {Person, type AP} from "./analogy_kit";
import {Desk, Ink, Room, Shadow, Sheet, W5Defs, clamp, eo, prog, show, slotLabels, atOr, W, H} from "./analogy_w5_kit";
import {Coin} from "./analogy_x1_a";
import {eio} from "../kit";

// ---------------------------------------------------------------- tax-wedge
export const WedgeArt: React.FC<AP> = (p) => {
  const {f} = p, shift = eio(prog(f, atOr(p, "pr") - 30, 40)), split = show(p, "sh", 20), walk = show(p, "el", 20);
  // the notebook diagram: origin (x0, y0), demand falls, supply rises; a tax shifts supply up by T
  const x0 = 360, y0 = 860, X = (q: number) => x0 + q * 760, Y = (pz: number) => y0 - pz * 560, T = 0.26 * shift;
  const D = (q: number) => 0.92 - 0.8 * q, S = (q: number) => 0.12 + 0.7 * q;
  const qe = (0.92 - 0.12) / 1.5, qt = (0.92 - 0.12 - T) / 1.5, pb = D(qt), ps = pb - T, pe = D(qe);
  return <g>
    <W5Defs/>
    <Room y0={980} win={[1720, 90]}/>
    <Sheet x={760} y={540} w={1060} h={800} rot={-0.6}>
      {Array.from({length: 17}, (_, i) => <path key={i} d={`M-530,${-360 + i * 46} H530`} stroke="#c9d6e4" strokeWidth={1.4}/>)}
    </Sheet>
    <path d={`M${x0},${y0 - 600} V${y0} H${x0 + 820}`} stroke="#2a1a10" strokeWidth={5} fill="none"/>
    <Ink x={x0 - 20} y={y0 - 610} t="PRICE" size={22} anchor="start" c="#2a1a10"/><Ink x={x0 + 820} y={y0 + 36} t="QUANTITY" size={22} anchor="end" c="#2a1a10"/>
    <path d={`M${X(0)},${Y(D(0))} L${X(1)},${Y(D(1))}`} stroke="#2f78b8" strokeWidth={6}/><Ink x={X(1)} y={Y(D(1)) + 34} t="DEMAND" size={20} c="#2f78b8"/>
    <path d={`M${X(0)},${Y(S(0))} L${X(1)},${Y(S(1))}`} stroke="#3f9a5a" strokeWidth={6}/><Ink x={X(1)} y={Y(S(1)) - 14} t="SUPPLY" size={20} c="#3f9a5a"/>
    {shift > 0.01 && <g opacity={shift}>
      <path d={`M${X(0)},${Y(S(0) + T)} L${X(0.9)},${Y(S(0.9) + T)}`} stroke="#3f9a5a" strokeWidth={5} strokeDasharray="14 10"/>
      <Ink x={X(0.9)} y={Y(S(0.9) + T) - 14} t="SUPPLY + TAX" size={18} c="#3f9a5a"/>
      <path d={`M${x0},${Y(pe)} H${X(qe)}`} stroke="#8a6a4a" strokeWidth={2} strokeDasharray="6 6"/>
    </g>}
    {/* the wedge at the new quantity: buyer's share above the old price, seller's below */}
    <g opacity={split}>
      <rect x={X(qt) - 16} y={Y(pb)} width={32} height={Y(pe) - Y(pb)} fill="#d8682a"/>
      <rect x={X(qt) - 16} y={Y(pe)} width={32} height={Y(ps) - Y(pe)} fill="#2f78b8"/>
      <Ink x={X(qt) - 30} y={Y((pb + pe) / 2) + 8} t="BUYER" size={20} c="#d8682a" anchor="end"/><Ink x={X(qt) - 30} y={Y((pe + ps) / 2) + 8} t="SELLER" size={20} c="#2f78b8" anchor="end"/>
    </g>
    <g opacity={walk}>{[0, 1].map((i) => <path key={i} d={`M${X(qt) + 60},${Y(pb) + 40 + i * 120} q60,-10 110,${10 - i * 20}`} stroke="#c0392b" strokeWidth={6} fill="none" markerEnd=""/>)}</g>
  </g>;
};
export const WedgeLabels = slotLabels({ig: {cx: 760, y: 64, size: 30}, pr: {cx: 1560, y: 240, size: 28, maxW: 500}, sh: {cx: 1560, y: 450, size: 28, maxW: 500, upper: true},
  el: {cx: 1560, y: 660, size: 28, maxW: 500}});

// ---------------------------------------------------------------- staircases
const Stairs: React.FC<{x: number; kind: "up" | "flat" | "down"; f: number; t: number; seed: number}> = ({x, kind, f, t, seed}) => {
  const steps = 6, sw = 70, sh = kind === "flat" ? 0 : 52, base = 820;
  const top = (i: number) => base - (kind === "up" ? (i + 1) * sh : kind === "down" ? (steps - i) * sh : 60);
  const k = Math.min(steps - 1, Math.floor(t * steps)), px = x - 210 + k * sw + sw / 2;
  return <g>
    <Shadow x={x} y={base + 6} rx={260}/>
    {Array.from({length: steps}, (_, i) => <rect key={i} x={x - 210 + i * sw} y={top(i)} width={sw + 1} height={base - top(i)} fill={i % 2 ? "#e4d3b0" : "#efe0c2"} stroke="#a88a60" strokeWidth={2}/>)}
    <Person x={px} y={top(k) + 2} h={120} f={f} seed={seed} walk={t > 0.02 && t < 0.98}/>
  </g>;
};
export const StairsArt: React.FC<AP> = (p) => {
  const {f} = p, t = (k: string) => clamp(prog(f, atOr(p, k), 120));
  return <g>
    <W5Defs/>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w5-sky)"/>
    <rect x={-60} y={820} width={W + 120} height={300} fill="url(#w5-ground)"/>
    <Stairs x={360} kind="up" f={f} t={t("pg")} seed={140}/><Stairs x={960} kind="flat" f={f} t={t("pp")} seed={141}/><Stairs x={1560} kind="down" f={f} t={t("rg")} seed={142}/>
  </g>;
};
export const StairsLabels = slotLabels({pg: {cx: 360, y: 120, size: 28, maxW: 520, upper: true}, pp: {cx: 960, y: 260, size: 28, maxW: 460, upper: true},
  rg: {cx: 1560, y: 120, size: 28, maxW: 520, upper: true}, ix: {cx: 960, y: 846, size: 30, tone: "green"}});

// ---------------------------------------------------------------- family-jars
const BudgetJar: React.FC<{x: number; w: number; h: number; share: number; a: number}> = ({x, w, h, share, a}) => {
  const y1 = 840, y0 = y1 - h, fill = h * 0.82, slice = fill * share * a;
  return <g>
    <Shadow x={x} y={y1 + 6} rx={w * 0.6}/>
    <rect x={x - w / 2} y={y1 - fill} width={w} height={fill - slice} fill="#d9c08e"/>
    <rect x={x - w / 2} y={y1 - slice} width={w} height={slice} fill="#d8682a" opacity={0.85}/>
    <rect x={x - w / 2} y={y0} width={w} height={h} rx={26} fill="#eaf4f6" fillOpacity={0.35} stroke="#8fb4c4" strokeWidth={4}/>
    <rect x={x - w / 2 - 14} y={y0 - 22} width={w + 28} height={30} rx={10} fill="#a88a60"/>
    <Ink x={x} y={y0 - 40} t={w < 300 ? "SMALLER INCOME" : "LARGER INCOME"} size={20} c="#5e3518"/>
  </g>;
};
export const FamilyArt: React.FC<AP> = (p) => {
  const {f} = p, drop = eio(prog(f, atOr(p, "sm") - 30, 30)), land = show(p, "sm", 24);
  return <g>
    <W5Defs/>
    <Room y0={620} win={[960, 80]}/>
    <Desk y0={620}/>
    <BudgetJar x={600} w={240} h={300} share={0.24} a={land}/>
    <BudgetJar x={1320} w={420} h={460} share={0.07} a={land}/>
    {[600, 1320].map((x) => <Coin key={x} x={x} y={200 + 420 * drop} r={30} a={1 - land * 0.9}/>)}
  </g>;
};
export const FamilyLabels = slotLabels({nr: {cx: 960, y: 84, size: 32}, or: {cx: 960, y: 200, size: 34, upper: true, tone: "dark"}, sm: {cx: 960, y: 846, size: 30}});

// ---------------------------------------------------------------- subsidy-tag
export const SubsidyArt: React.FC<AP> = (p) => {
  const {f} = p, hand = eio(prog(f, atOr(p, "sb") - 10, 30)), slice = show(p, "pa", 24);
  const share = 6 / 100, a0 = -Math.PI / 2, a1 = a0 + share * Math.PI * 2 * slice;   // the slice drawn is the claim's share (E12-B08), not typed
  const arc = (r: number) => `M0,0 L${r * Math.cos(a0)},${r * Math.sin(a0)} A${r},${r} 0 0,1 ${r * Math.cos(a1)},${r * Math.sin(a1)} Z`;
  return <g>
    <W5Defs/>
    <Room y0={640} win={[960, 80]}/>
    <Desk y0={640}/>
    <g transform="translate(560 520) rotate(-6)">
      <Shadow x={0} y={180} rx={240}/>
      <path d="M-260,-130 H160 L250,0 L160,130 H-260 Z" fill="#f6dd8a" stroke="#7a5414" strokeWidth={4}/><circle cx={170} cy={0} r={16} fill="#7a5414"/>
      <Ink x={-50} y={14} t="PRICE" size={40} c="#5e2a0e"/>
      <path d="M-260,40 L-140,130 H-260 Z" fill="#fff" opacity={0.8}/>
      <g transform={`translate(${-210 - 40 * (1 - hand)} ${150 + 40 * (1 - hand)})`} opacity={hand}>
        <path d="M-60,40 Q-80,-10 -30,-30 L40,-40 Q60,-40 56,-24 L10,-14 L70,-14 Q84,-10 70,4 L10,8 Z" fill="#c98a5a" stroke="#7a4a26" strokeWidth={3}/>
        <Ink x={0} y={80} t="THE STATE" size={18} c="#5e3518"/>
      </g>
    </g>
    <g transform="translate(1400 560)">
      <Shadow x={0} y={230} rx={220}/>
      <circle r={200} fill="url(#w5-brass)" stroke="#7a5414" strokeWidth={6}/><circle r={170} fill="none" stroke="#7a5414" strokeWidth={2} opacity={0.5}/>
      {Array.from({length: 10}, (_, i) => <path key={i} d={`M0,0 L${200 * Math.cos(a0 + i * 0.628)},${200 * Math.sin(a0 + i * 0.628)}`} stroke="#7a5414" strokeWidth={1.5} opacity={0.3}/>)}
      <path d={arc(200)} fill="#c0392b" opacity={0.9 * slice}/>
      <Ink x={0} y={20} t="ONE RUPEE" size={30} c="#5e2a0e"/>
    </g>
  </g>;
};
export const SubsidyLabels = slotLabels({sb: {cx: 560, y: 84, size: 30, maxW: 760}, ex: {cx: 560, y: 846, size: 30}, pa: {cx: 1400, y: 84, size: 28, maxW: 680, tone: "dark"},
  bg: {cx: 1400, y: 846, size: 24, maxW: 680}});
