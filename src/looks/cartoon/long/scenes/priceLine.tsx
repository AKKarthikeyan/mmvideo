// PRICE-LINE scene (Namakkal, 29 Oct 2026): a daily price line on a white chart card that draws itself, the run of days at the
// maximum shaded, number badges popping in on the narrator's word, an optional host beside the card. Cartoon look.
import React from "react";
import {AbsoluteFill} from "remotion";
import {C} from "../../palette";
import {Badge, Pill, SANS, ROUND, ease, easeIO, pop} from "../../ui";
import {Actor, type Pose, type Who} from "../cast";
import {SAFE, type SceneProps} from "../contract";
import {dayLabel, numOf, seriesOf, sourceOf, type PriceLineSpec} from "./nk_kit";

export type {PriceLineSpec};
const CARD = {x0: 520, y0: 150, x1: 1800, y1: 880};
const PLOT = {x0: CARD.x0 + 150, y0: CARD.y0 + 60, x1: CARD.x1 - 60, y1: CARD.y1 - 110};

export const Scene: React.FC<SceneProps<PriceLineSpec>> = ({f, dur, spec, at}) => {
  const pts = seriesOf(spec.series), n = pts.length;
  const X = (i: number) => PLOT.x0 + (PLOT.x1 - PLOT.x0) * (i / (n - 1));
  const Y = (v: number) => PLOT.y1 - (PLOT.y1 - PLOT.y0) * ((v - spec.y0) / (spec.y1 - spec.y0));
  const top = Math.max(...pts.map((p) => p.v));
  const idx = (where: string) => where === "max" ? pts.findIndex((p) => p.v === top) : where === "last" ? n - 1 : pts.findIndex((p) => p.d === where);
  const drawEnd = spec.drawKey ? at(spec.drawKey) : Math.round(dur * 0.6);
  const u = spec.drawn ? 1 : easeIO(f, 8, Math.max(9, drawEnd));
  const cut = u * (n - 1), k = Math.floor(cut);
  const shown = pts.slice(0, k + 1).map((p, i) => [X(i), Y(p.v)] as const);
  if (k < n - 1) { const a = pts[k], b = pts[k + 1], t = cut - k; shown.push([X(cut), Y(a.v + (b.v - a.v) * t)]); }
  const d = shown.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const ticks: number[] = []; for (let v = spec.y0; v <= spec.y1 + 1e-9; v += spec.ystep) ticks.push(v);
  const firsts = pts.map((p, i) => [p, i] as const).filter(([p]) => p.d.endsWith("-01"));
  const run = pts.map((p, i) => [p, i] as const).filter(([p]) => p.v === top);
  const bandT = spec.band ? ease(f, at(spec.band.key), at(spec.band.key) + 14) : 0;
  const cam = spec.camera, cs = cam ? cam.s0 + (cam.s1 - cam.s0) * easeIO(f, 0, dur) : 1;
  const cardIn = pop(f, 0, 160);
  return <AbsoluteFill style={{background: C.sky2}}>
    <div style={{position: "absolute", inset: 0, transform: `scale(${cs})`, transformOrigin: cam ? `${cam.fx}px ${cam.fy}px` : "50% 50%"}}>
      <svg width={1920} height={1080} style={{position: "absolute"}}>
        {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={140 + i * 330} cy={1010 + Math.sin(f / 30 + i) * 6} r={120} fill={C.sky} opacity={0.7}/>)}
        {spec.actor && <Actor who={spec.actor.who as Who} x={spec.actor.x} y={spec.actor.y} h={spec.actor.h} f={f} pose={(spec.actor.pose ?? "present") as Pose} flip={spec.actor.flip}/>}
        <g transform={`translate(${(CARD.x0 + CARD.x1) / 2} ${(CARD.y0 + CARD.y1) / 2}) scale(${cardIn}) translate(${-(CARD.x0 + CARD.x1) / 2} ${-(CARD.y0 + CARD.y1) / 2})`}>
          <rect x={CARD.x0} y={CARD.y0 + 14} width={CARD.x1 - CARD.x0} height={CARD.y1 - CARD.y0} rx={40} fill={C.ink}/>
          <rect x={CARD.x0} y={CARD.y0} width={CARD.x1 - CARD.x0} height={CARD.y1 - CARD.y0} rx={40} fill={C.white} stroke={C.ink} strokeWidth={8}/>
          {spec.band && run.length > 0 && <rect x={X(run[0][1]) - 6} y={PLOT.y0 - 20} width={X(run[run.length - 1][1]) - X(run[0][1]) + 12} height={PLOT.y1 - PLOT.y0 + 20}
            rx={12} fill={C.yellow} opacity={0.55 * bandT}/>}
          {ticks.map((v) => <g key={v}>
            <line x1={PLOT.x0} x2={PLOT.x1} y1={Y(v)} y2={Y(v)} stroke={v === spec.y0 ? C.ink : "#C9D6E6"} strokeWidth={v === spec.y0 ? 6 : 3} strokeLinecap="round"/>
            <text x={PLOT.x0 - 22} y={Y(v) + 12} textAnchor="end" fontFamily={ROUND} fontWeight={800} fontSize={34} fill={C.ink}>₹{v.toFixed(2)}</text>
          </g>)}
          {firsts.map(([p, i]) => <text key={p.d} x={X(i)} y={PLOT.y1 + 52} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={32} fill={C.ink}>{dayLabel(p.d)}</text>)}
          <path d={d} fill="none" stroke={C.ink} strokeWidth={20} strokeLinejoin="round" strokeLinecap="round"/>
          <path d={d} fill="none" stroke={C.orange} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round"/>
          {u < 1 && shown.length > 0 && <circle cx={shown[shown.length - 1][0]} cy={shown[shown.length - 1][1]} r={16} fill={C.yellow} stroke={C.ink} strokeWidth={6}/>}
          {spec.marks.map((m) => { const i = idx(m.at), t = at(m.key); return f >= t ? <circle key={m.key} cx={X(i)} cy={Y(pts[i].v)} r={15 * pop(f, t)} fill={m.color ?? C.red} stroke={C.ink} strokeWidth={6}/> : null; })}
          <text x={CARD.x1 - 40} y={CARD.y1 - 30} textAnchor="end" fontFamily={SANS} fontWeight={700} fontSize={26} fill="#5A6680">{sourceOf(spec.source)}</text>
        </g>
      </svg>
      {spec.marks.map((m) => {
        const i = idx(m.at), t = at(m.key), x = X(i) + (m.dx ?? 0), y = Y(pts[i].v) + (m.dy ?? 0), side = m.side ?? "above";
        const style: React.CSSProperties = side === "left" ? {right: 1920 - x + 40, top: y - 90} : side === "below" ? {left: x, top: y + 40, transform: "translateX(-50%)"} : {left: x, bottom: 1080 - y + 40, transform: "translateX(-50%)"};
        return <div key={m.key} style={{position: "absolute", ...style}}>
          <Badge n={numOf(m, t)} f={f} at={t} caption={m.caption} size={92} color={m.color ?? C.royal} rot={side === "left" ? 2 : -2}/>
        </div>;
      })}
    </div>
    {spec.title && <div style={{position: "absolute", left: SAFE.x0, top: 72}}><Pill text={spec.title.toUpperCase()} f={f} at={4} dot={C.orange}/></div>}
  </AbsoluteFill>;
};
