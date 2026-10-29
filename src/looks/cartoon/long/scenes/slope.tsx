// Scene kind "slope" (spec 5): slope lines between survey columns (NFHS-4 -> NFHS-5 -> NFHS-6) for a few states. Each state draws on at(item.key):
// its line grows column to column, a dot lands on every survey it has a figure for, value chips pop on the dots, and the state's end label
// (name + last value) pops at the right. A survey with no figure for a state is skipped and the segment next to it is not drawn (no guess,
// no bridge). The biggest fall over each state's last drawn segment gets a hand-drawn red circle (Inked), a red halo on its line and an arrow.
// Every number comes from fig(); every digit waits for its state's key.
import React from "react";
import {C} from "../../palette";
import {Inked, Pill, ROUND, SANS, ease, pop} from "../../ui";
import type {SceneProps} from "../contract";
import {hasFig} from "../figs";
import {DEFAULT_SURVEYS, DirArrow, LINES, Sky, ValChip, camScale, chipBox, niceName, placeChips, readPoints, sortSurveys, spreadY, surveyLabel, tenths,
  type Place, type Seg} from "./slope_kit";

export type SlopeSpec = {
  items: {state: string; surveys?: string[]; key: string; name?: string}[];   // surveys default: nfhs4, nfhs5, nfhs6
  title?: string;                  // pill, top left
  sub?: string;                    // caption pill above the end labels (default for table "tfr": "Children per woman")
  t?: string;                      // figures table, default "tfr"
  hero?: string | false;           // state whose fall is circled; default: the biggest fall over each state's last drawn segment; false = none
  heroKey?: string;                // reveal key for the circle (default: 10 frames after the last state's end label, so "biggest" is only said once all are drawn)
  heroLabel?: string;              // words under the hero's arrow (default "Biggest fall" when the hero is the computed one; none for an explicit hero)
  decimals?: number;               // default 1
};

const CARD = {x: 96, y: 170, w: 1728, h: 735};
const UNITS: Record<string, string> = {tfr: "children per woman"};   // a label for the default caption, not a figure (figures.json meta.unit now spans several tables)
const STEP = 14;                   // frames from one survey point to the next
const EX = 1110, EW = 530;         // end labels

export const Scene: React.FC<SceneProps<SlopeSpec>> = ({f, dur, spec, at}) => {
  const t = spec.t ?? "tfr", dec = spec.decimals ?? 1, items = spec.items ?? [];
  if (!items.length) throw new Error("slope: spec.items is empty");
  const wanted = (it: SlopeSpec["items"][number]) => (it.surveys && it.surveys.length ? it.surveys : DEFAULT_SURVEYS);
  // The chart's columns: every survey that at least one item has a figure for, in survey order.
  const cols = sortSurveys(items.flatMap(wanted)).filter((s) => items.some((it) => wanted(it).includes(s) && hasFig({t, state: it.state, s})));
  const data = items.map((it, i) => ({it, i, name: it.name ?? niceName(it.state), ...LINES[i % LINES.length], pts: readPoints(t, it.state, wanted(it), cols, dec), f0: at(it.key)}));
  const pAt = (d: (typeof data)[number], k: number) => d.f0 + k * STEP;

  // ---- geometry ---------------------------------------------------------------------------------------------------------------
  const nC = cols.length, PX0 = nC > 1 ? 300 : 700, PX1 = 1030, PY0 = 384, PY1 = 790, DR = 17;
  const colX = (c: number) => (nC < 2 ? (PX0 + PX1) / 2 : PX0 + ((PX1 - PX0) * c) / (nC - 1));
  const vals = data.flatMap((d) => d.pts.map((p) => p.v)), vmin = Math.min(...vals), vmax = Math.max(...vals), span = Math.max(vmax - vmin, 0.4);
  const lo = vmin - (span - (vmax - vmin)) / 2;
  const yOf = (v: number) => PY1 - ((v - lo) / span) * (PY1 - PY0);
  // A segment joins two points only when they are neighbours among the surveys asked for: a survey with no figure breaks the line, never bridged.
  const adj = (d: (typeof data)[number], k: number) => k > 0 && d.pts[k].ri === d.pts[k - 1].ri + 1;
  const segsPx: Seg[] = [], dotsPx: {x: number; y: number; r: number}[] = [];
  data.forEach((d) => d.pts.forEach((p, k) => {
    dotsPx.push({x: colX(p.col), y: yOf(p.v), r: DR + 4});
    if (adj(d, k)) segsPx.push({x1: colX(d.pts[k - 1].col), y1: yOf(d.pts[k - 1].v), x2: colX(p.col), y2: yOf(p.v)});
  }));
  const CS = 52;
  const midItems: Place[] = data.flatMap((d) => d.pts.slice(0, -1).map((p, k) => ({id: `${d.i}-${k}`, x: colX(p.col), y: yOf(p.v), r: DR + 4, ...chipBox(p.text, CS)})));
  const placed = placeChips(midItems, segsPx, dotsPx, [], {x0: CARD.x + 24, x1: PX1 + 40, y0: 308, y1: 836});
  const EH = data.length > 4 ? 96 : 114, VS = data.length > 4 ? 70 : 82;
  const endY = spreadY(data.map((d) => yOf(d.pts[d.pts.length - 1].v)), EH + 10, 300 + EH / 2, 880 - EH / 2);
  const endAt = (d: (typeof data)[number]) => pAt(d, d.pts.length - 1) + 3;

  // ---- the biggest fall -------------------------------------------------------------------------------------------------------
  const fallOf = (d: (typeof data)[number]) => { for (let k = d.pts.length - 1; k > 0; k--) if (adj(d, k)) return tenths(d.pts[k - 1], dec) - tenths(d.pts[k], dec); return -1e9; };
  let hero = -1;
  if (typeof spec.hero === "string") {
    hero = data.findIndex((d) => d.it.state === spec.hero);
    if (hero < 0) throw new Error(`slope: hero "${spec.hero}" is not one of the items`);
  } else if (spec.hero === undefined) {
    let best = 0;
    data.forEach((d) => { const fl = fallOf(d); if (fl > best) { best = fl; hero = d.i; } });
  }
  const H = hero >= 0 ? data[hero] : null;
  const hf = H ? fallOf(H) : 0, heroDir: "down" | "up" | null = hf > 0 ? "down" : hf < 0 && hf > -1e8 ? "up" : null, heroCol = heroDir === "up" ? C.green : C.red;
  const heroAt = H ? (spec.heroKey ? Math.max(endAt(H) + 4, at(spec.heroKey)) : Math.max(...data.map(endAt)) + 10) : 0;
  const heroLabel = spec.heroLabel ?? (spec.hero === undefined ? "Biggest\nfall" : undefined);
  const sub = spec.sub ?? UNITS[t];
  const camS = camScale(f, dur, 0.012);

  return <>
    <Sky f={f}/>
    <div style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${camS})`, transformOrigin: "50% 52%"}}>
      {spec.title && <div style={{position: "absolute", left: SAFE_L, top: 64}}><Pill text={spec.title} f={f} at={2} dot={C.orange} size={36}/></div>}
      <div style={{position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, boxSizing: "border-box", background: C.white, border: `8px solid ${C.ink}`, borderRadius: 46,
        boxShadow: `0 14px 0 ${C.ink}`, transform: `scale(${0.94 + 0.06 * pop(f, 0)})`, opacity: ease(f, 0, 6)}}/>

      {cols.map((s, c) => {
        const lb = surveyLabel(s), tt = pop(f, 5 + c * 4);
        return <div key={s} style={{position: "absolute", left: colX(c) - 150, width: 300, top: CARD.y + 26, textAlign: "center", transform: `scale(${tt})`, opacity: tt > 0.01 ? 1 : 0}}>
          <div style={{display: "inline-block", background: C.ink, color: C.white, fontFamily: SANS, fontWeight: 900, fontSize: 38, letterSpacing: 2, lineHeight: 1, padding: "9px 26px 11px", borderRadius: 999}}>{lb.label}</div>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, lineHeight: 1, color: C.ink, marginTop: 10, opacity: 0.85}}>{lb.sub}</div>
        </div>;
      })}

      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={CARD.x + 40} x2={CARD.x + CARD.w - 40} y1={PY0 - 24 + i * ((PY1 - PY0 + 48) / 4)} y2={PY0 - 24 + i * ((PY1 - PY0 + 48) / 4)} stroke="#E6F0FA" strokeWidth={5} strokeLinecap="round"/>)}
        {cols.map((s, c) => <line key={s} x1={colX(c)} x2={colX(c)} y1={CARD.y + 150} y2={PY1 + 56} stroke="#BFD3E8" strokeWidth={6} strokeDasharray="1 18" strokeLinecap="round" opacity={ease(f, 8, 20)}/>)}
        {data.map((d) => {
          const isHero = H?.i === d.i, last = d.pts.length - 1;
          const segs = d.pts.map((p, k) => {
            if (!adj(d, k)) return null;
            const a = d.pts[k - 1], pr = ease(f, pAt(d, k - 1) + 3, pAt(d, k)), x1 = colX(a.col), y1 = yOf(a.v), x2 = colX(p.col), y2 = yOf(p.v);
            return pr <= 0 ? null : {k, x1, y1, x2: x1 + (x2 - x1) * pr, y2: y1 + (y2 - y1) * pr, last: k === last};
          }).filter(Boolean) as {k: number; x1: number; y1: number; x2: number; y2: number; last: boolean}[];
          const lp = d.pts[last], ex = colX(lp.col), ey = yOf(lp.v), ea = ease(f, endAt(d), endAt(d) + 8);
          const halo = isHero && heroDir && f >= heroAt ? 0.28 + 0.1 * Math.sin((f - heroAt) / 5) : 0;
          return <g key={d.i}>
            {halo > 0 && segs.filter((s) => s.last).map((s) => <line key={`h${s.k}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={heroCol} strokeWidth={40} strokeLinecap="round" opacity={halo}/>)}
            {segs.map((s) => <line key={`i${s.k}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={C.ink} strokeWidth={isHero ? 27 : 24} strokeLinecap="round"/>)}
            {segs.map((s) => <line key={`c${s.k}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={d.c} strokeWidth={isHero ? 15 : 12} strokeLinecap="round"/>)}
            {ea > 0 && <line x1={ex + 28} y1={ey} x2={EX - 6} y2={endY[d.i]} stroke={d.d} strokeWidth={6} strokeDasharray="1 12" strokeLinecap="round" opacity={0.8 * ea}/>}
            {d.pts.slice(0, -1).map((p, k) => {
              const b = placed[`${d.i}-${k}`], dx = colX(p.col), dy = yOf(p.v), nx = Math.min(b.x + b.w / 2, Math.max(b.x - b.w / 2, dx)), ny = Math.min(b.y + b.h / 2, Math.max(b.y - b.h / 2, dy));
              const gap = Math.hypot(nx - dx, ny - dy), la = ease(f, pAt(d, k) + 4, pAt(d, k) + 10);
              if (gap < DR + 16 || la <= 0) return null;
              const ux = (nx - dx) / gap, uy = (ny - dy) / gap;
              return <line key={`l${k}`} x1={dx + ux * (DR + 5)} y1={dy + uy * (DR + 5)} x2={nx} y2={ny} stroke={d.d} strokeWidth={6} strokeDasharray="1 11" strokeLinecap="round" opacity={0.85 * la}/>;
            })}
            {d.pts.map((p, k) => {
              const s = pop(f, pAt(d, k));
              return s <= 0.001 ? null : <g key={k} transform={`translate(${colX(p.col)} ${yOf(p.v)}) scale(${s})`}>
                <circle r={k === last ? DR + 3 : DR} fill={d.c} stroke={C.ink} strokeWidth={7}/><circle cx={-5} cy={-5} r={4.5} fill={C.white} opacity={0.55}/></g>;
            })}
          </g>;
        })}
      </svg>

      {data.map((d) => d.pts.slice(0, -1).map((p, k) => {
        const tt = pop(f, pAt(d, k) + 3);
        return <ValChip key={`${d.i}-${k}`} box={placed[`${d.i}-${k}`]} text={p.text} color={d.d} size={CS} t={tt}/>;
      }))}

      {[...data].sort((a, b) => Number(a.i === H?.i) - Number(b.i === H?.i)).map((d) => {
        const tt = pop(f, endAt(d)), lp = d.pts[d.pts.length - 1], isHero = H?.i === d.i;
        if (tt <= 0.001) return null;
        const value = <span style={{fontFamily: ROUND, fontWeight: 800, fontSize: VS, lineHeight: 1, color: d.d, letterSpacing: -2, fontFeatureSettings: "'lnum' 1"}}>{lp.text}</span>;
        return <div key={d.i} style={{position: "absolute", left: EX, top: endY[d.i] - EH / 2, width: EW, height: EH, transform: `scale(${tt})`, transformOrigin: "0% 50%"}}>
          <div style={{width: EW, height: EH, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 16, padding: "0 34px 0 22px", background: C.white, border: `7px solid ${C.ink}`,
            borderRadius: 34, boxShadow: `0 9px 0 ${C.ink}`}}>
            <span style={{width: 34, height: 34, borderRadius: "50%", background: d.c, border: `6px solid ${C.ink}`, boxSizing: "border-box", flex: "none"}}/>
            <span style={{flex: 1, fontFamily: SANS, fontWeight: 900, fontSize: 36, lineHeight: 1.04, color: C.ink}}>{d.name}</span>
            {isHero ? <span style={{margin: "0 8px 0 26px", display: "inline-flex"}}><Inked accent={{kind: "circle", color: heroCol, seed: 4}} f={f} at={heroAt}>{value}</Inked></span> : value}
          </div>
        </div>;
      })}

      {H && heroDir && f >= heroAt && <div style={{position: "absolute", left: EX + EW + 10, width: 128, top: endY[H.i] - 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        transform: `scale(${pop(f, heroAt + 4, 170)}) rotate(${Math.sin(f / 9) * 2}deg)`, transformOrigin: "50% 50%"}}>
        <DirArrow dir={heroDir} size={78} color={heroCol} wob={Math.sin(f / 7) * 5}/>
        {heroLabel && <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 32, lineHeight: 1.04, color: heroCol, textAlign: "center", whiteSpace: "pre-line"}}>{heroLabel}</div>}
      </div>}

      {sub && <div style={{position: "absolute", left: EX + 84, top: CARD.y + 40, transform: `scale(${pop(f, 10)})`, transformOrigin: "0% 50%"}}>
        <div style={{display: "inline-block", maxWidth: 560, background: C.sky2, border: `6px solid ${C.ink}`, borderRadius: 44, padding: "10px 30px 12px", fontFamily: SANS, fontWeight: 800, fontSize: 36, lineHeight: 1.1, color: C.ink}}>
          {sub.charAt(0).toUpperCase() + sub.slice(1)}</div></div>}
    </div>
  </>;
};

const SAFE_L = 96;
