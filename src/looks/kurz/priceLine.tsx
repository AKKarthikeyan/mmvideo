// KURZ look, "price-line" scene (data builder, 29 Oct 2026). A daily rate series (meta.nk_series) drawn as a glowing line with a
// lit rim and a soft area, an egg riding its tip, on a chart plinth in space. The line is fully drawn at at(drawKey) (default 60% of
// the scene), or from the start when `drawn`. `band` shades the run of days at the series maximum at its key. Marks sit at "max" /
// "min" (the middle of the run of equal extreme days), "last" or an ISO date, with side above | below | left | right and dx, dy.
// A badge that would leave the safe box flips to the left of its point.
// Spec: {series, y0, y1, ystep, drawKey?, drawn?, band?: {value: "max", key, label?}, marks: (NumIn & {at, side?, dx?, dy?, color?, caption})[], title, source}
import React from "react";
import {AbsoluteFill} from "remotion";
import type {SceneProps} from "../cartoon/long/contract";
import {dayLabel, seriesOf, sourceOf, type PriceLineSpec} from "../cartoon/long/scenes/nk_kit";
import {Cam, Chip, DBadge, Dust, EggDefs, EggG, Finish, K, Place, Pulse, ROUND, SANS, SourceTag, Space, Shafts, Title, col, ease, easeIO, pop} from "./data_kit";

const P = {x0: 330, y0: 250, x1: 1720, y1: 790};
type Side = "above" | "below" | "left" | "right";

export const Scene: React.FC<SceneProps<PriceLineSpec & {band?: {value: "max"; key: string; label?: string}}>> = ({f, dur, spec, at}) => {
  const uid = "dkpl";
  const pts = seriesOf(spec.series), n = pts.length;
  const X = (i: number) => P.x0 + (P.x1 - P.x0) * (i / (n - 1));
  const Y = (v: number) => P.y1 - (P.y1 - P.y0) * ((v - spec.y0) / (spec.y1 - spec.y0));
  const top = Math.max(...pts.map((p) => p.v)), bottom = Math.min(...pts.map((p) => p.v));
  const runOf = (v: number) => { const is = pts.map((p, i) => (p.v === v ? i : -1)).filter((i) => i >= 0); return [is[0], is[is.length - 1]] as const; };
  const idx = (w: string) => {
    if (w === "max" || w === "min") { const [a, b] = runOf(w === "max" ? top : bottom); return Math.round((a + b) / 2); }
    if (w === "last") return n - 1;
    const i = pts.findIndex((p) => p.d === w); if (i < 0) throw new Error(`price-line: no day ${w} in ${spec.series}`); return i;
  };
  const dEnd = spec.drawKey ? at(spec.drawKey) : Math.round(dur * 0.6);
  const u = spec.drawn ? 1 : easeIO(f, 8, Math.max(9, dEnd));
  const cut = u * (n - 1), k = Math.min(n - 2, Math.floor(cut));
  const sh: [number, number][] = pts.slice(0, k + 1).map((p, i) => [X(i), Y(p.v)]);
  { const a = pts[k], b = pts[k + 1], fr = cut - k; sh.push([X(cut), Y(a.v + (b.v - a.v) * fr)]); }
  const d = sh.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${d} L${sh[sh.length - 1][0].toFixed(1)} ${P.y1} L${sh[0][0]} ${P.y1} Z`;
  const ticks: number[] = []; for (let v = spec.y0; v <= spec.y1 + 1e-9; v += spec.ystep) ticks.push(Math.round(v * 100) / 100);
  // a continuation (`drawn`) shows at once what the last scene ended on: keys at frame 0-2 do not animate
  const inst = (a: number) => !!spec.drawn && a <= 2;
  const [r0, r1] = runOf(top), bA = spec.band ? at(spec.band.key) : 0, bandT = spec.band ? (inst(bA) ? 1 : ease(f, bA, bA + 16)) : 0;
  const [tx, ty] = sh[sh.length - 1], [px, py] = sh[Math.max(0, sh.length - 2)], slope = Math.atan2(ty - py, Math.max(1e-3, tx - px)) * 180 / Math.PI;

  const placeOf = (m: PriceLineSpec["marks"][number]) => {
    const i = idx(m.at), x = X(i) + (m.dx ?? 0), y = Y(pts[i].v) + (m.dy ?? 0), Hb = 200;
    let side: Side = (m.side as Side) ?? "above";
    if (side === "below" && Y(pts[i].v) + 36 + Hb > 860) side = "left";
    if (side === "above" && Y(pts[i].v) - 36 - Hb < 150) side = "below";
    return {i, x, y, side};
  };
  return <AbsoluteFill>
    <Space f={f} uid={uid} seed={71} glowY={0.95}/>
    <Cam f={f} dur={dur} push={0.025} fx={1000} fy={540}>
      <svg width={1920} height={1080} style={{position: "absolute"}}>
        <defs>
          <EggDefs uid={uid}/>
          <filter id={`${uid}-gl`} x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation={9}/></filter>
          <linearGradient id={`${uid}-ar`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={K.orange} stopOpacity={0.42}/><stop offset="1" stopColor={K.orange} stopOpacity={0}/></linearGradient>
          <linearGradient id={`${uid}-bd`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={K.pink} stopOpacity={0.3}/><stop offset="1" stopColor={K.pink} stopOpacity={0.03}/></linearGradient>
        </defs>
        <Shafts f={f} uid={uid} x={700} color={K.orangeL} n={3} a={0.6}/>
        <rect x={P.x0 - 40} y={P.y0 - 70} width={P.x1 - P.x0 + 80} height={P.y1 - P.y0 + 100} rx={30} fill={K.night} opacity={0.4}/>
        <rect x={P.x0 - 40} y={P.y1 + 22} width={P.x1 - P.x0 + 80} height={8} rx={4} fill={K.tealL} opacity={0.12}/>
        {/* band at the series maximum */}
        {spec.band && bandT > 0 && <g opacity={bandT}>
          <rect x={X(r0) - 10} y={P.y0 - 30} width={X(r1) - X(r0) + 20} height={P.y1 - P.y0 + 30} rx={12} fill={`url(#${uid}-bd)`}/>
          <rect x={X(r0) - 10} y={P.y0 - 30} width={X(r1) - X(r0) + 20} height={5} rx={2} fill={K.pink}/>
        </g>}
        {ticks.map((v) => <g key={v}>
          <line x1={P.x0} x2={P.x1} y1={Y(v)} y2={Y(v)} stroke={K.white} strokeOpacity={v === spec.y0 ? 0.5 : 0.12} strokeWidth={v === spec.y0 ? 4 : 2}/>
          <text x={P.x0 - 24} y={Y(v) + 12} textAnchor="end" fontFamily={ROUND} fontWeight={800} fontSize={34} fill={K.white} opacity={0.78}>₹{v.toFixed(2)}</text>
        </g>)}
        {pts.map((p, i) => p.d.endsWith("-01") ? <g key={p.d}>
          <line x1={X(i)} x2={X(i)} y1={P.y1} y2={P.y1 + 16} stroke={K.white} strokeOpacity={0.5} strokeWidth={3}/>
          <text x={X(i)} y={P.y1 + 56} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={34} fill={K.white} opacity={0.82}>{dayLabel(p.d)}</text>
        </g> : null)}
        <path d={area} fill={`url(#${uid}-ar)`}/>
        <path d={d} fill="none" stroke={K.orange} strokeWidth={22} strokeLinejoin="round" strokeLinecap="round" opacity={0.45} filter={`url(#${uid}-gl)`}/>
        <path d={d} fill="none" stroke={K.orange} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round"/>
        <path d={d} fill="none" stroke={K.yellowL} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" opacity={0.7} transform="translate(0 -3)"/>
        {/* the egg riding the tip; it steps aside when a badge lands on the last day */}
        <g opacity={1 - Math.max(0, ...spec.marks.filter((m) => m.at === "last").map((m) => ease(f, at(m.key) - 8, at(m.key) + 4)))}>
          <circle cx={tx} cy={ty} r={20} fill={K.yellow} opacity={0.25 + 0.1 * Math.sin(f / 10)}/>
          <circle cx={tx} cy={ty} r={9} fill={K.white}/>
          <EggG x={tx} y={ty - 36 + Math.sin(f / 14) * 3} s={0.38} uid={uid} rot={Math.max(-30, Math.min(30, slope)) * 0.6} shadow={0}/>
        </g>
        {spec.marks.map((m) => { const {i} = placeOf(m), a = at(m.key); if (f < a) return null; const c = col(m.color, K.yellow);
          return <g key={m.key}><Pulse x={X(i)} y={Y(pts[i].v)} f={f} r={18} color={c} period={46}/><circle cx={X(i)} cy={Y(pts[i].v)} r={13 * (inst(a) ? 1 : pop(f, a))} fill={K.white}/><circle cx={X(i)} cy={Y(pts[i].v)} r={6 * (inst(a) ? 1 : pop(f, a))} fill={c}/></g>; })}
        <Dust f={f} n={30} seed={18} color={K.orangeL} y0={200} y1={900}/>
      </svg>
      {spec.band?.label && <Place x={(X(r0) + X(r1)) / 2} y={P.y0 - 44} anchor="b"><Chip text={spec.band.label} f={f} at={bA + 4} color={K.pink}/></Place>}
      {spec.marks.map((m) => { const {x, y, side} = placeOf(m), c = col(m.color, K.yellow), G = 40;
        const pos = side === "left" ? {x: x - G, y, anchor: "r" as const} : side === "right" ? {x: x + G, y, anchor: "l" as const}
          : side === "below" ? {x, y: y + G, anchor: "t" as const} : {x, y: y - G, anchor: "b" as const};
        return <Place key={m.key} x={pos.x} y={pos.y} anchor={pos.anchor}><DBadge n={m} at={at(m.key)} f={f} caption={m.caption} size={96} capSize={30} capW={420} color={c} instant={inst(at(m.key))}/></Place>; })}
    </Cam>
    <Finish/>
    {spec.title && <Title text={spec.title} f={f} color={K.orange} instant={spec.drawn}/>}
    <SourceTag text={sourceOf(spec.source)} f={f} instant={spec.drawn}/>
  </AbsoluteFill>;
};
