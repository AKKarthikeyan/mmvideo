// Scene kind "tfr-line": a clean flat line chart of the total fertility rate across the NFHS surveys, with the replacement line (2.1, a
// constant of the definition) drawn across it. Every plotted value is read with fig(); nothing is typed. Dots, values and survey labels
// appear on the narrator's word (the reveal key of each point); the hand-drawn circle lands on the crossing (spec.cross).
//
// spec = {
//   state?:  string                     // row of figures.json, default "India"
//   t?:      string                     // table of figures.json, default "tfr"
//   points?: (string | {s, key?, state?, t?, label?, year?})[]
//                                       // survey ids in time order, default ["nfhs3","nfhs4","nfhs5","nfhs6"]. A string "nfhs4" is
//                                       // {s: "nfhs4", key: "nfhs4"}: s is the figures.json column, key the reveal key (default = s).
//   years?:  Record<string,string> | string[]   // survey year labels by survey id (or in point order); defaults NFHS-3 2005-06, NFHS-4 2015-16, NFHS-5 2019-21, NFHS-6 2023-24
//   cross?:  string                     // reveal key of the hand-drawn circle on the point where the line crosses 2.1 (none: no circle)
//   crossLabel?: string                 // text beside the circle, default "<state> crosses the line"
//   line?:   string                     // reveal key of the 2.1 line (default: drawn in the first 20 frames)
//   lineLabel?: string                  // caption of the 2.1 badge, default "replacement"
//   kicker?: string                     // top-left pill, default "<STATE> · CHILDREN PER WOMAN"
//   decimals?: number                   // printed decimals, default 1
// }
import React from "react";
import {C} from "../../palette";
import {Badge, Inked, Pill, ROUND, SANS, ease, pop} from "../../ui";
import type {LookNum} from "../../../shared/types";
import {H, W, type FigRef, type SceneProps} from "../contract";
import {fig, meta} from "../figs";

const REPL = 2.1;   // replacement-level fertility: a constant of the definition, not a survey figure

type PtIn = string | {s: string; key?: string; state?: string; t?: string; label?: string; year?: string};
export type TfrLineSpec = {
  state?: string; t?: string; points?: PtIn[]; years?: Record<string, string> | string[]; cross?: string; crossLabel?: string;
  line?: string; lineLabel?: string; kicker?: string; decimals?: number;
};

const YEARS: Record<string, string> = {nfhs3: "2005-06", nfhs4: "2015-16", nfhs5: "2019-21", nfhs6: "2023-24"};
const DEFAULT_POINTS = ["nfhs3", "nfhs4", "nfhs5", "nfhs6"];
const surveyName = (s: string) => s.replace(/^nfhs(\d+)$/i, "NFHS-$1").toUpperCase();

const mkNum = (text: string, value: number, lockF: number): LookNum => ({
  text, qual: "", sign: "", prefix: "", digits: text, unit: "", value, scale: 1, grouping: "none",
  decimals: (text.split(".")[1] ?? "").length, glyphs: [...text], role: "big", lockF, spokenF: lockF, lockHow: "spoken",
});

// ---- geometry -------------------------------------------------------------------------------------------------------------
const CARD = {x: 96, y: 160, w: 1728, h: 752};
const BASE = 800;                       // x-axis line
const PX0 = 300, PX1 = 1330;            // x of the first and last point
const Y_HI = 215, Y_LO = 590;           // y of the highest and lowest value (value badges sit in a row under the dots, from y 632)
const DOT_R = 24;
const BH = 160;                         // value badge box height (estimate); badges sit in one row just above the axis
const RB = {x: 1630, w: 300, h: 224};   // the 2.1 badge on the right end of the line

type Box = {x0: number; y0: number; x1: number; y1: number};
const hit = (a: Box, b: Box) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
const segHit = (p: number[], q: number[], b: Box, pad: number) => {
  const n = Math.max(1, Math.ceil(Math.hypot(q[0] - p[0], q[1] - p[1]) / 10));
  for (let i = 0; i <= n; i++) {
    const x = p[0] + (q[0] - p[0]) * i / n, y = p[1] + (q[1] - p[1]) * i / n;
    if (x > b.x0 - pad && x < b.x1 + pad && y > b.y0 - pad && y < b.y1 + pad) return true;
  }
  return false;
};
const boxAt = (cx: number, cy: number, w: number, h: number): Box => ({x0: cx - w / 2, y0: cy - h / 2, x1: cx + w / 2, y1: cy + h / 2});

type Pt = {s: string; key: string; label: string; year: string; v: number; text: string; x: number; y: number; at: number};

export const Scene: React.FC<SceneProps<TfrLineSpec>> = ({f, dur, spec, at}) => {
  const state = spec.state ?? "India", table = spec.t ?? "tfr", decimals = spec.decimals ?? 1;
  const ins = (spec.points ?? DEFAULT_POINTS).map((p) => typeof p === "string" ? {s: p} : p);
  const n = ins.length;
  if (n < 1) throw new Error("tfr-line: spec.points is empty");

  // values come from fig() only; a missing figure throws
  const raw = ins.map((p, i) => {
    const ref: FigRef = {t: p.t ?? table, state: p.state ?? state, s: p.s};
    const fv = fig(ref, decimals);
    const key = (p as {key?: string}).key ?? p.s;
    const yr = Array.isArray(spec.years) ? spec.years[i] : spec.years?.[p.s];
    return {s: p.s, key, label: (p as {label?: string}).label ?? surveyName(p.s), year: (p as {year?: string}).year ?? yr ?? YEARS[p.s] ?? "", v: fv.value, text: fv.text, at: at(key)};
  });
  const vmin = Math.min(REPL, ...raw.map((r) => r.v)), vmax = Math.max(REPL, ...raw.map((r) => r.v));
  const yTop = vmax === REPL ? 292 : Y_HI;    // when 2.1 is the highest line, keep room above it for its badge
  const span = Math.max(vmax - vmin, 0.1), ppu = Math.min(700, (Y_LO - yTop) / span);
  const yMid = (yTop + Y_LO) / 2, vMid = (vmin + vmax) / 2;
  const yOf = (v: number) => yMid - (v - vMid) * ppu;
  const yR = yOf(REPL);
  const pts: Pt[] = raw.map((r, i) => ({...r, x: n === 1 ? (PX0 + PX1) / 2 : PX0 + (PX1 - PX0) * i / (n - 1), y: yOf(r.v)}));

  // the line's first crossing of 2.1 (down or up), and where its circle goes
  let cross: {x: number; y: number} | null = null, crossed = true;
  for (let i = 0; i + 1 < n && !cross; i++) {
    const a = pts[i], b = pts[i + 1];
    if ((a.v - REPL) * (b.v - REPL) < 0 || (b.v === REPL && a.v !== REPL)) {
      const t = (a.v - REPL) / (a.v - b.v);
      cross = {x: a.x + (b.x - a.x) * t, y: yR};
    }
  }
  if (!cross) { crossed = false; const below = pts.find((p) => p.v < REPL) ?? pts[n - 1]; cross = {x: below.x, y: below.y}; }

  // ---- value badges: one row just above the axis, each under its dot on the drop line, so they never meet the line ---------------
  const bsize = n <= 4 ? 104 : n === 5 ? 92 : 76, bRowY = BASE - 22 - BH / 2;
  const obstacles: Box[] = [
    {x0: 0, y0: BASE - 6, x1: W, y1: H},                              // x axis and survey labels
    {x0: 0, y0: bRowY - BH / 2, x1: W, y1: BASE},                     // the badge row
    {x0: 0, y0: yR - 18, x1: W, y1: yR + 18},                         // the 2.1 line
    boxAt(RB.x, yR, RB.w, RB.h),                                      // its badge
    {x0: CARD.x + CARD.w - 330, y0: CARD.y, x1: CARD.x + CARD.w, y1: yR - RB.h / 2 - 12},   // zone label above (right end)
    {x0: CARD.x + CARD.w - 330, y0: yR + RB.h / 2 + 12, x1: CARD.x + CARD.w, y1: BASE},      // zone label below
    ...pts.map((p) => boxAt(p.x, p.y, 2 * DOT_R + 20, 2 * DOT_R + 20)),
  ];
  const inCard = (b: Box) => b.x0 > CARD.x + 12 && b.x1 < CARD.x + CARD.w - 12 && b.y0 > CARD.y + 12 && b.y1 < BASE - 4;
  const lineHit = (b: Box) => pts.some((p, i) => i + 1 < n && segHit([p.x, p.y], [pts[i + 1].x, pts[i + 1].y], b, 16));
  const placed: Box[] = [];

  // the label beside the crossing circle
  const crossAt = spec.cross ? at(spec.cross) : -1;
  const crossText = spec.crossLabel ?? (crossed ? `${state} crosses the line` : "");   // no default label when the line never crosses 2.1
  const CLW = Math.round(crossText.length * 21 + 64), CLH = 76, hasLabel = crossText.length > 0;
  const cc = [[-CLW / 2 - 40, 118], [CLW / 2 + 40, 118], [-CLW / 2 - 40, -128], [CLW / 2 + 40, -128], [0, 130], [0, -140]];
  let clBest = cc[0], clScore = 1e9;
  for (const c of cc) {
    const b = boxAt(cross.x + c[0], cross.y + c[1], CLW, CLH);
    const score = (inCard(b) ? 0 : 5) + (lineHit(b) ? 3 : 0) + obstacles.filter((o) => hit(b, o) && o !== obstacles[2]).length * 4 + placed.filter((o) => hit(b, o)).length * 4;
    if (score < clScore) { clBest = c; clScore = score; }
    if (score === 0) break;
  }
  const clx = cross.x + clBest[0], cly = cross.y + clBest[1];

  // ---- the 2.1 line ---------------------------------------------------------------------------------------------------------
  const la = spec.line ? at(spec.line) : 4;
  const lineP = ease(f, la, la + 18);
  const replNum = mkNum(REPL.toFixed(1), REPL, la);
  const camS = 1 + 0.028 * ease(f, 0, Math.max(60, dur));
  const kicker = spec.kicker ?? `${state.toUpperCase()} · ${String(meta("meta.unit") ?? "children per woman").toUpperCase()}`;
  const colOf = (v: number) => v >= REPL ? {fill: C.orange, dark: C.orangeDark} : {fill: C.green, dark: C.greenDark};
  const cardPath = `M ${CARD.x + 44} ${CARD.y} H ${CARD.x + CARD.w - 44} Q ${CARD.x + CARD.w} ${CARD.y} ${CARD.x + CARD.w} ${CARD.y + 44} V ${CARD.y + CARD.h - 44} Q ${CARD.x + CARD.w} ${CARD.y + CARD.h} ${CARD.x + CARD.w - 44} ${CARD.y + CARD.h} H ${CARD.x + 44} Q ${CARD.x} ${CARD.y + CARD.h} ${CARD.x} ${CARD.y + CARD.h - 44} V ${CARD.y + 44} Q ${CARD.x} ${CARD.y} ${CARD.x + 44} ${CARD.y} Z`;

  return <div style={{position: "absolute", inset: 0, background: C.sky, overflow: "hidden"}}>
    <div style={{position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${camS})`, transformOrigin: "50% 50%"}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", left: 0, top: 0}}>
        <defs>
          <clipPath id="tl-card"><path d={cardPath}/></clipPath>
          <clipPath id="tl-line"><rect x={0} y={0} width={W * lineP} height={H}/></clipPath>
        </defs>
        {/* card with its hard shadow */}
        <path d={cardPath} transform="translate(0 14)" fill={C.ink}/>
        <path d={cardPath} fill={C.white}/>
        <g clipPath="url(#tl-card)">
          <rect x={CARD.x} y={CARD.y} width={CARD.w} height={Math.max(0, yR - CARD.y)} fill="#FFF1CF"/>
          <rect x={CARD.x} y={yR} width={CARD.w} height={Math.max(0, BASE - yR)} fill="#DDF3E2"/>
          {/* the 2.1 line, drawn across on its key */}
          <g clipPath="url(#tl-line)">
            <line x1={CARD.x - 20} x2={CARD.x + CARD.w + 20} y1={yR} y2={yR} stroke={C.ink} strokeWidth={26} strokeLinecap="round" strokeDasharray="44 26" strokeDashoffset={-f * 1.2}/>
            <line x1={CARD.x - 20} x2={CARD.x + CARD.w + 20} y1={yR} y2={yR} stroke={C.red} strokeWidth={12} strokeLinecap="round" strokeDasharray="44 26" strokeDashoffset={-f * 1.2}/>
          </g>
        </g>
        <path d={cardPath} fill="none" stroke={C.ink} strokeWidth={8}/>
        {/* axis */}
        <line x1={CARD.x + 60} x2={CARD.x + CARD.w - 60} y1={BASE} y2={BASE} stroke={C.ink} strokeWidth={8} strokeLinecap="round"/>
        {/* drop lines, data line, dots */}
        {pts.map((p, i) => {
          const k = ease(f, p.at, p.at + 10);
          return k > 0 && <line key={`d${i}`} x1={p.x} x2={p.x} y1={p.y} y2={p.y + (BASE - p.y) * k} stroke={C.ink} strokeOpacity={0.35} strokeWidth={5} strokeDasharray="4 14" strokeLinecap="round"/>;
        })}
        {pts.map((p, i) => {
          if (i === 0) return null;
          const a = pts[i - 1], sa = Math.max(a.at, p.at), k = ease(f, sa, sa + 12);
          if (k <= 0) return null;
          const ex = a.x + (p.x - a.x) * k, ey = a.y + (p.y - a.y) * k;
          return <g key={`s${i}`}>
            <line x1={a.x} y1={a.y} x2={ex} y2={ey} stroke={C.ink} strokeWidth={30} strokeLinecap="round"/>
            <line x1={a.x} y1={a.y} x2={ex} y2={ey} stroke={C.royal} strokeWidth={14} strokeLinecap="round"/>
          </g>;
        })}
        {pts.map((p, i) => {
          const t = pop(f, p.at, 200), col = colOf(p.v), ring = ease(f, p.at, p.at + 16);
          if (t <= 0.001) return null;
          const idle = 1 + 0.035 * Math.sin((f - p.at) / 7 + i);
          return <g key={`p${i}`}>
            {ring < 1 && <circle cx={p.x} cy={p.y} r={DOT_R + 8 + 54 * ring} fill="none" stroke={col.fill} strokeWidth={7} opacity={(1 - ring) * 0.8}/>}
            <circle cx={p.x} cy={p.y} r={DOT_R * t * idle} fill={col.fill} stroke={C.ink} strokeWidth={8}/>
            <circle cx={p.x - 7} cy={p.y - 8} r={6 * t} fill={C.white} opacity={0.85}/>
          </g>;
        })}
      </svg>

      {/* survey labels under the axis */}
      {pts.map((p, i) => {
        const t = pop(f, p.at, 220);
        if (t <= 0.001) return null;
        return <div key={`l${i}`} style={{position: "absolute", left: p.x, top: BASE + 16, transform: `translate(-50%, 0) scale(${t})`, transformOrigin: "50% 0%", textAlign: "center", whiteSpace: "nowrap"}}>
          <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: 42, lineHeight: 1.05, color: C.ink, letterSpacing: -0.5}}>{p.label}</div>
          {p.year && <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, lineHeight: 1.1, color: C.royal}}>{p.year}</div>}
        </div>;
      })}

      {/* zone labels at the right end */}
      {yR - RB.h / 2 - 54 > CARD.y + 36 && <div style={{position: "absolute", left: RB.x, top: yR - RB.h / 2 - 54, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 12, fontFamily: SANS, fontWeight: 900, fontSize: 36, letterSpacing: 2, color: C.orangeDark, opacity: ease(f, la + 10, la + 20)}}>
        <svg width={34} height={30} viewBox="0 0 34 30"><path d="M 17 3 L 31 27 H 3 Z" fill={C.orange} stroke={C.ink} strokeWidth={4} strokeLinejoin="round"/></svg>ABOVE
      </div>}
      {yR + RB.h / 2 + 54 < BASE - 30 && <div style={{position: "absolute", left: RB.x, top: yR + RB.h / 2 + 54, transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", gap: 12, fontFamily: SANS, fontWeight: 900, fontSize: 36, letterSpacing: 2, color: C.greenDark, opacity: ease(f, la + 10, la + 20)}}>
        <svg width={34} height={30} viewBox="0 0 34 30"><path d="M 17 27 L 31 3 H 3 Z" fill={C.green} stroke={C.ink} strokeWidth={4} strokeLinejoin="round"/></svg>BELOW
      </div>}

      {/* the 2.1 badge on the line */}
      <div style={{position: "absolute", left: RB.x, top: yR, transform: "translate(-50%, -50%)"}}>
        <Badge n={replNum} f={f} caption={spec.lineLabel ?? "replacement"} color={C.redDark} size={140} rot={2} at={la + 8}/>
      </div>

      {/* value badges: in a row above the axis, each under its dot */}
      {pts.map((p, i) => <div key={`b${i}`} style={{position: "absolute", left: p.x, top: bRowY, transform: "translate(-50%, -50%)"}}>
        <Badge n={mkNum(p.text, p.v, p.at)} f={f} color={colOf(p.v).dark} size={bsize} rot={i % 2 ? 2 : -2} at={p.at}/>
      </div>)}

      {/* the crossing: a hand-drawn circle on the point where the line meets 2.1, and its label */}
      {spec.cross && f >= crossAt && <>
        {hasLabel && (() => {
          const dx = cross.x - clx, dy = cross.y - cly, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, k = ease(f, crossAt + 10, crossAt + 20);
          const ex = cross.x - ux * 84, ey = cross.y - uy * 84, sx = clx, sy = cly, mx = sx + (ex - sx) * k, my = sy + (ey - sy) * k;
          return <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
            <line x1={sx} y1={sy} x2={mx} y2={my} stroke={C.ink} strokeWidth={7} strokeLinecap="round"/>
            {k > 0.95 && <path d={`M ${ex} ${ey} L ${ex - ux * 26 - uy * 15} ${ey - uy * 26 + ux * 15} L ${ex - ux * 26 + uy * 15} ${ey - uy * 26 - ux * 15} Z`} fill={C.ink} stroke={C.ink} strokeWidth={4} strokeLinejoin="round"/>}
          </svg>;
        })()}
        <div style={{position: "absolute", left: cross.x - 70, top: cross.y - 58, width: 140, height: 116}}>
          <Inked accent={{kind: "circle", color: C.ink, seed: 5}} f={f} at={crossAt}><div style={{width: 96, height: 108}}/></Inked>
        </div>
        {hasLabel && <div style={{position: "absolute", left: clx, top: cly, transform: `translate(-50%, -50%) scale(${pop(f, crossAt + 8, 200)}) rotate(-2deg)`, background: C.white, border: `7px solid ${C.ink}`, borderRadius: 26,
          boxShadow: `0 8px 0 ${C.ink}`, padding: "8px 26px 10px", fontFamily: ROUND, fontWeight: 800, fontSize: 38, color: C.ink, whiteSpace: "nowrap", letterSpacing: -0.5}}>{crossText}</div>}
      </>}
    </div>
    <div style={{position: "absolute", left: 96, top: 60}}><Pill text={kicker} f={f} at={2} dot={C.royal} size={34}/></div>
  </div>;
};
