// KURZ look, "seasons" scene (data builder, 29 Oct 2026). A grid of the full years in meta.nk_monthly.years (rows) by 12 months.
// Each cell is a lit tile shaded by that month's NECC rate, scaled within its own year (cheap = cool, dear = warm), so the yearly
// shape shows despite nominal prices doubling. Tiles fill in a wave at at(key). At at(lowKey) each year's cheapest month
// (meta.nk_monthly.low_month) lights an egg, the March-April column glows, and the badge reads `count` of `of`.
// Spec: {series: "nk_monthly", key, lowKey, count: NumIn & {caption}, of: NumIn, source}
import React from "react";
import {AbsoluteFill} from "remotion";
import type {SceneProps} from "../cartoon/long/contract";
import {meta} from "../cartoon/long/figs";
import {MON, numOf, sourceOf, type NumIn} from "../cartoon/long/scenes/nk_kit";
import {KNum} from "./kit";
import {Cam, Dust, EggDefs, EggG, Finish, K, Place, ROUND, SANS, SourceTag, Space, Shafts, ease, mix, panel, pop} from "./data_kit";

type SSpec = {series: string; key: string; lowKey: string; count: NumIn & {caption?: string}; of: NumIn; source: string};
const G = {x0: 330, cw: 78, y0: 168, rh: 42};

// "13 of 16": both digits through numOf + KNum at their keys, the caption under them.
const CountOf: React.FC<{count: NumIn & {caption?: string}; of: NumIn; at: number; atOf: number; f: number}> = ({count, of, at, atOf, f}) => {
  if (f < at) return null;
  const t = pop(f, at), a = numOf({...count, prefix: "", suffix: ""}, at), b = numOf({...of, prefix: "", suffix: ""}, atOf);
  return <div style={{display: "inline-flex", flexDirection: "column", alignItems: "center", padding: "22px 40px 24px", ...panel(0.76), borderRadius: 34,
    transform: `scale(${t}) translateY(${(1 - t) * 30}px)`, opacity: Math.min(1, t * 1.4)}}>
    <div style={{display: "flex", alignItems: "baseline", gap: 18, fontFamily: ROUND, fontWeight: 800, lineHeight: 1, whiteSpace: "nowrap"}}>
      <span style={{fontSize: 150, color: K.yellow, textShadow: `0 0 34px ${K.yellow}99`, letterSpacing: -2}}><KNum n={a} f={f} where="seasons count"/></span>
      <span style={{fontSize: 56, color: K.white, opacity: 0.85}}>of</span>
      {f >= atOf && <span style={{fontSize: 110, color: K.white, letterSpacing: -2}}><KNum n={b} f={f} where="seasons of"/></span>}
    </div>
    <div style={{width: "38%", height: 5, borderRadius: 3, background: K.yellow, boxShadow: `0 0 12px ${K.yellow}`, marginTop: 16, opacity: 0.85}}/>
    {count.caption && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: K.white, marginTop: 14, maxWidth: 400, textAlign: "center", lineHeight: 1.2}}>{count.caption}</div>}
  </div>;
};

export const Scene: React.FC<SceneProps<SSpec>> = ({f, dur, spec, at}) => {
  const uid = "dkss";
  const M = meta(`meta.${spec.series}`) as {years: number[]; low_month: Record<string, number>; rs: Record<string, number>} | undefined;
  if (!M?.years || !M.rs || !M.low_month) throw new Error(`seasons: meta.${spec.series} incomplete`);
  const years = M.years, gA = at(spec.key), lA = at(spec.lowKey), oA = at(spec.of.key);
  const rows = years.map((y) => {
    const v = Array.from({length: 12}, (_, m) => { const x = M.rs[`${y}-${String(m + 1).padStart(2, "0")}`]; if (typeof x !== "number") throw new Error(`seasons: no rate for ${y}-${m + 1}`); return x; });
    const lo = Math.min(...v), hi = Math.max(...v), low = M.low_month[String(y)];
    if (v[low - 1] !== lo) throw new Error(`seasons: low_month ${y} = ${low} is not the cheapest month`);
    return {y, v, lo, hi, low};
  });
  const cnt = rows.filter((r) => r.low === 3 || r.low === 4).length;
  if (cnt !== numOf(spec.count, 0).value || years.length !== numOf(spec.of, 0).value) throw new Error(`seasons: grid gives ${cnt} of ${years.length}, figures say ${numOf(spec.count, 0).value} of ${numOf(spec.of, 0).value}`);
  const W = G.cw * 12, H = G.rh * years.length, colT = ease(f, lA - 4, lA + 18);
  const cheap = "#2B4CC4", dear = K.pink;
  const cellCol = (t: number) => (t < 0.5 ? mix(cheap, K.purple, t * 2) : mix(K.purple, dear, (t - 0.5) * 2));
  return <AbsoluteFill>
    <Space f={f} uid={uid} seed={51} glowY={0.9}/>
    <Cam f={f} dur={dur} push={0.03} fx={800} fy={500}>
      <svg width={1920} height={1080} style={{position: "absolute"}}>
        <defs>
          <EggDefs uid={uid}/>
          <filter id={`${uid}-gl`} x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation={16}/></filter>
        </defs>
        <Shafts f={f} uid={uid} x={560} color={K.yellowL} n={3} a={0.6}/>
        <rect x={G.x0 - 24} y={G.y0 - 24} width={W + 44} height={H + 44} rx={28} fill={K.night} opacity={0.5}/>
        {/* the March-April column glow */}
        {colT > 0 && <g opacity={colT}>
          <rect x={G.x0 + 2 * G.cw - 10} y={G.y0 - 86} width={G.cw * 2 + 16} height={H + 106} rx={24} fill={K.yellow} opacity={0.35 + 0.08 * Math.sin(f / 16)} filter={`url(#${uid}-gl)`}/>
          <rect x={G.x0 + 2 * G.cw - 6} y={G.y0 - 82} width={G.cw * 2 + 8} height={H + 98} rx={20} fill="none" stroke={K.yellow} strokeWidth={4}/>
        </g>}
        {/* the tiles */}
        {rows.map((r, ri) => r.v.map((v, m) => {
          const t = pop(f, gA + ri * 1.6 + m * 1.1, 200); if (t <= 0.01) return null;
          const s = (r.hi > r.lo ? (v - r.lo) / (r.hi - r.lo) : 0), c = cellCol(s), x = G.x0 + m * G.cw + 4, y = G.y0 + ri * G.rh + 3, w = G.cw - 8, h = G.rh - 6;
          const isLow = m + 1 === r.low, lt = isLow ? ease(f, lA + ri * 1.4, lA + ri * 1.4 + 10) : 0;
          const dim = colT * 0.35 * (isLow ? 0 : 1);
          return <g key={`${ri}-${m}`} transform={`translate(${x + w / 2} ${y + h / 2}) scale(${Math.min(1.08, t)}) translate(${-w / 2} ${-h / 2})`} opacity={1 - dim}>
            <rect width={w} height={h} rx={8} fill={c}/>
            <path d={`M ${w * 0.55} 0 L ${w - 8} 0 Q ${w} 0 ${w} 8 L ${w} ${h - 8} Q ${w} ${h} ${w - 8} ${h} L ${w * 0.3} ${h} Z`} fill="#000" opacity={0.18}/>
            <rect x={3} y={2} width={w * 0.5} height={4} rx={2} fill="#fff" opacity={0.3}/>
            {lt > 0 && <g>
              <rect x={-3} y={-3} width={w + 6} height={h + 6} rx={10} fill="none" stroke={r.low === 3 || r.low === 4 ? K.yellow : K.white} strokeWidth={4} opacity={lt}/>
              <EggG x={w / 2} y={h / 2} s={0.27 * pop(f, lA + ri * 1.4, 220)} uid={uid} fill={r.low === 3 || r.low === 4 ? K.yellow : K.white} shade={r.low === 3 || r.low === 4 ? K.orange : "#AEB9DD"} shadow={0}/>
            </g>}
          </g>;
        }))}
        <Dust f={f} n={30} seed={14} color={K.yellowL}/>
      </svg>
      {/* month initials and years */}
      {MON.map((mn, m) => { const hiM = m === 2 || m === 3, t = ease(f, gA - 10 + m, gA + 6 + m);
        return <Place key={mn} x={G.x0 + m * G.cw + G.cw / 2} y={G.y0 - 30} anchor="b">
          <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: 34, color: hiM ? mix(K.white, K.yellow, colT) : K.white, opacity: t * (hiM ? 1 : 0.8 - 0.3 * colT), textShadow: hiM && colT > 0 ? `0 0 16px ${K.yellow}` : undefined}}>{mn}</div>
        </Place>; })}
      {rows.map((r, ri) => <Place key={r.y} x={G.x0 - 22} y={G.y0 + ri * G.rh + G.rh / 2} anchor="r">
        <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: 34, color: K.white, opacity: ease(f, gA + ri * 1.6, gA + ri * 1.6 + 10) * 0.85, lineHeight: 1}}>{r.y}</div>
      </Place>)}
      {/* the count badge */}
      <Place x={1582} y={420} anchor="c"><CountOf count={spec.count} of={spec.of} at={lA} atOf={oA} f={f}/></Place>
      {/* legend */}
      <Place x={1582} y={760} anchor="c">
        <div style={{...panel(0.66), borderRadius: 18, padding: "14px 22px", opacity: ease(f, gA + 20, gA + 40), display: "flex", flexDirection: "column", alignItems: "center", gap: 10}}>
          <div style={{width: 300, height: 22, borderRadius: 11, background: `linear-gradient(90deg, ${cheap}, ${K.purple}, ${dear})`}}/>
          <div style={{width: 300, display: "flex", justifyContent: "space-between", fontFamily: SANS, fontWeight: 700, fontSize: 30, color: K.white}}><span>cheaper</span><span>dearer</span></div>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, color: "rgba(244,247,255,0.8)"}}>within each year</div>
        </div>
      </Place>
    </Cam>
    <Finish/>
    <SourceTag text={sourceOf(spec.source)} f={f}/>
  </AbsoluteFill>;
};
