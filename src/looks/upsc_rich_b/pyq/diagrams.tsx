// Pen diagrams that a student can draw in the exam hall in about a minute, drawn on the answer sheet as progress p goes 0 -> 1.
// Every label text comes from the spec (the answer module, number-locked by scripts/upsc/pyq_tool.py); nothing is typed here.
import React from "react";
import {BOXES_B, proj} from "../map";
import {clamp} from "../kit";
import {HAND, INK, RED} from "./kit";

export type DiagramSpec = {name: "monsoon" | "timeline" | "bars"; labels?: Record<string, string>; items?: {when: string; what: string}[]};
type P = {p: number; w: number; h: number; spec: DiagramSpec};
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

/** India (whole, from the Natural Earth India-view basemap) and the monsoon's moving parts, as a student would sketch them */
const Monsoon: React.FC<P> = ({p, w, h, spec}) => {
  const b = BOXES_B.ocean, pr = proj(b), L = spec.labels ?? {};
  const lon0 = 40, lon1 = 101, lat0 = -8.5, lat1 = 38.5;        // India whole incl. the islands; the Mascarene High (about 30°S) is marked at the edge
  const vx = pr.x(lon0), vy = pr.y(lat1), vw = pr.x(lon1) - vx, vh = pr.y(lat0) - vy;
  const X = pr.x, Y = pr.y, pt = (lon: number, lat: number) => `${X(lon)},${Y(lat)}`;
  const s = Math.max(vw / w, vh / h), sw = s * 3.6, fs = s * 30;                    // pen width and label size in map units
  const draw = (q: number) => ({pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - q});
  const lab = (k: string, lon: number, lat: number, q: number, col = INK, anchor: "start" | "middle" | "end" = "start") =>
    L[k] ? <text x={X(lon)} y={Y(lat)} fontFamily={HAND} fontSize={fs} fill={col} textAnchor={anchor} opacity={clamp(q * 3)}>{L[k]}</text> : null;
  const arrow = (d: string, q: number, col = INK, dash?: string) => <path d={d} fill="none" stroke={col} strokeWidth={sw * 1.15} strokeLinecap="round" strokeDasharray={dash}
    {...(dash ? {opacity: clamp(q * 2)} : draw(q))} markerEnd={q > 0.95 ? `url(#pq-ah-${col === RED ? "r" : "i"})` : undefined}/>;
  const q1 = seg(p, 0, 0.35), q2 = seg(p, 0.33, 0.45), q3 = seg(p, 0.45, 0.62), q4 = seg(p, 0.6, 0.74), q5 = seg(p, 0.72, 0.86), q6 = seg(p, 0.84, 1);
  return <svg width={w} height={h} viewBox={`${vx} ${vy} ${vw} ${vh}`} preserveAspectRatio="xMidYMid meet">
    <defs>
      {(["i", "r"] as const).map((k) => <marker key={k} id={`pq-ah-${k}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={k === "r" ? RED : INK}/></marker>)}
    </defs>
    <path d={b.india} fill="none" stroke={INK} strokeWidth={sw} strokeLinejoin="round" {...draw(q1)}/>
    <line x1={X(lon0)} y1={Y(0)} x2={X(lon1)} y2={Y(0)} stroke={INK} strokeWidth={sw * 0.6} strokeDasharray={`${sw * 4} ${sw * 3}`} opacity={clamp(q2 * 2)}/>
    {lab("equator", 100, 1, q2, INK, "end")}
    <text x={X(47)} y={Y(-4.6)} fontFamily={HAND} fontSize={fs * 1.7} fill={RED} textAnchor="middle" opacity={clamp(q2 * 3)}>H</text>
    {lab("high", 41, -7.6, q2, RED)}
    {arrow(`M${pt(48.5, -3.2)} C ${pt(46.5, 2)} ${pt(47, 6.5)} ${pt(53, 9.5)} S ${pt(66, 12.5)} ${pt(74.3, 11.5)}`, q3)}
    {lab("jet", 41, 8.5, q3)}
    {arrow(`M${pt(88.5, 8)} C ${pt(90.5, 15)} ${pt(91.5, 20)} ${pt(89.5, 23.8)} S ${pt(84.5, 26.3)} ${pt(80, 27)}`, q4)}
    {lab("bay", 100, 5, q4, INK, "end")}
    {lab("arabian", 54.5, 17.5, q4)}
    <text x={X(71.2)} y={Y(26.2)} fontFamily={HAND} fontSize={fs * 1.5} fill={RED} textAnchor="middle" opacity={clamp(q5 * 3)}>L</text>
    {lab("low", 68.5, 29.5, q5, RED, "end")}
    <path d={`M${pt(72.5, 26.6)} Q ${pt(80, 24.8)} ${pt(88, 22.4)}`} fill="none" stroke={RED} strokeWidth={sw} strokeDasharray={`${sw * 3} ${sw * 2.5}`} opacity={clamp(q5 * 2)}/>
    {lab("trough", 80, 22, q5, RED, "middle")}
    {arrow(`M${pt(99, 36.4)} L ${pt(43, 36.4)}`, q6, INK, `${sw * 5} ${sw * 3}`)}
    {lab("tej", 71, 34.6, q6, INK, "middle")}
  </svg>;
};

/** a pen timeline: one arrow, a node per item, the year above and the event below */
const Timeline: React.FC<P> = ({p, w, h, spec}) => {
  const items = spec.items ?? [], n = items.length, x0 = 100, x1 = w - 100, y = h * 0.42;
  const xs = items.map((_, i) => x0 + (x1 - x0) * (n === 1 ? 0.5 : i / (n - 1)));
  const fs = 25;
  return <svg width={w} height={h}>
    <defs><marker id="pq-tl-ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={INK}/></marker></defs>
    <line x1={x0 - 20} y1={y} x2={x0 - 20 + (x1 + 30 - x0) * clamp(p * 1.25)} y2={y} stroke={INK} strokeWidth={3} strokeLinecap="round" markerEnd={p > 0.78 ? "url(#pq-tl-ah)" : undefined}/>
    {items.map((it, i) => {
      const q = clamp((p - 0.12 - i * (0.8 / n)) / (0.8 / n));
      const words = it.what.split(" "), mid = Math.ceil(words.length / 2);
      const lines = it.what.length > 14 ? [words.slice(0, mid).join(" "), words.slice(mid).join(" ")] : [it.what];
      return <g key={i} opacity={clamp(q * 2.5)}>
        <circle cx={xs[i]} cy={y} r={9} fill="#fffaf0" stroke={i === 2 ? RED : INK} strokeWidth={3}/>
        <text x={xs[i]} y={y - 26} fontFamily={HAND} fontSize={fs + 3} fill={INK} textAnchor="middle" fontWeight={700}>{it.when}</text>
        {lines.map((l, j) => <text key={j} x={xs[i]} y={y + 44 + j * (fs + 6)} fontFamily={HAND} fontSize={fs} fill={i === 2 ? RED : INK} textAnchor="middle">{l}</text>)}
      </g>;
    })}
  </svg>;
};

/** pen bars, one per item; the height is the number printed in the item's `when` (the printed label itself), dots for an ellipsis item, the last bar in red */
const Bars: React.FC<P> = ({p, w, h, spec}) => {
  const items = spec.items ?? [], n = items.length, val = (s: string) => parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
  const vmax = Math.max(...items.map((it) => val(it.when)), 1), bw = (w - 80) / n * 0.62, base = h - 70, top = 80;
  return <svg width={w} height={h}>
    <line x1={30} y1={base} x2={w - 30} y2={base} stroke={INK} strokeWidth={3} strokeLinecap="round" opacity={clamp(p * 5)}/>
    {items.map((it, i) => {
      const q = clamp((p - 0.1 - i * (0.85 / n)) / (0.85 / n)), x = 40 + (w - 80) / n * (i + 0.5) - bw / 2, v = val(it.when), last = i === n - 1;
      const bh = (base - top) * v / vmax * q;
      return <g key={i} opacity={clamp(q * 3)}>
        {v > 0 ? <rect x={x} y={base - bh} width={bw} height={bh} fill={last ? "rgba(192,57,43,.12)" : "rgba(31,45,110,.08)"} stroke={last ? RED : INK} strokeWidth={3}/>
          : <text x={x + bw / 2} y={base - 30} fontFamily={HAND} fontSize={40} fill={INK} textAnchor="middle">…</text>}
        {v > 0 && <text x={x + bw / 2} y={base - bh - 12} fontFamily={HAND} fontSize={28} fontWeight={700} fill={last ? RED : INK} textAnchor="middle">{it.when}</text>}
        <text x={x + bw / 2} y={base + 34} fontFamily={HAND} fontSize={23} fill={last ? RED : INK} textAnchor="middle">{it.what}</text>
      </g>;
    })}
  </svg>;
};

export const Diagram: React.FC<P> = (props) => props.spec.name === "monsoon" ? <Monsoon {...props}/> : props.spec.name === "bars" ? <Bars {...props}/> : <Timeline {...props}/>;
