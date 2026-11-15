// Scene kind "multiples" (spec 6): small multiples, one mini line chart per state (2 x 2 up to 3 x 2), a point on every survey the state has a
// figure for, all on one shared scale so the panels compare honestly. The replacement line (2.1) is drawn faint behind every chart. Each panel
// pops in on its key (or on the scene key, staggered), its line draws survey to survey and the values land on the dots. After the line, the
// direction of the change between the last two surveys shows as an arrow (up / down) ONLY when it is 0.3 or more; anything smaller says
// "about the same" (the script's rule: smaller moves are within survey error). The size of the change is computed from fig() in whole
// tenths, never from floats. Slots not yet drawn show an empty dashed outline (no digits).
import React from "react";
import {C} from "../../palette";
import {Pill, ROUND, SANS, ease, pop} from "../../ui";
import type {SceneProps} from "../contract";
import {hasFig} from "../figs";
import {DEFAULT_SURVEYS, DirArrow, LINES, Sky, ValChip, camScale, chipBox, niceName, placeChips, readPoints, sortSurveys, surveyLabel, tenths, tw,
  type Box, type Place, type Pt, type Seg} from "./slope_kit";

export type MultiplesSpec = {
  states: (string | {state: string; key?: string; name?: string})[];
  surveys?: string[];                                         // default nfhs4, nfhs5, nfhs6
  key?: string;                                               // scene key: panel i draws at at(key) + i * stagger unless the state has its own key
  stagger?: number;                                           // frames between panels when only `key` is given (default 24)
  t?: string;                                                 // figures table, default "tfr"
  title?: string;                                             // pill, top left
  sub?: string;                                               // caption pill, top right
  line?: {const: number; key?: string} | false;               // faint reference line; default {const: 2.1} (the replacement level) for table "tfr", none otherwise; false = none
  minChange?: number;                                         // smallest change that gets an arrow, default 0.3
  change?: [string, string];                                  // surveys the change is read between; default the state's last two figures
  decimals?: number;                                          // default 1
};

const REPLACEMENT_LEVEL = 2.1;                                // definitional constant (the contract allows it as a spec constant, revealed by key)
const AREA = {x0: 110, x1: 1810, y0: 168, y1: 905}, GAP = 30;
const STEP = 12;

export const Scene: React.FC<SceneProps<MultiplesSpec>> = ({f, dur, spec, at}) => {
  const t = spec.t ?? "tfr", dec = spec.decimals ?? 1, surveys = sortSurveys(spec.surveys?.length ? spec.surveys : DEFAULT_SURVEYS);
  const minChange = Math.round((spec.minChange ?? 0.3) * 10 ** dec), stagger = spec.stagger ?? 24;
  const states = (spec.states ?? []).map((s) => (typeof s === "string" ? {state: s} : s) as {state: string; key?: string; name?: string});
  if (!states.length) throw new Error("multiples: spec.states is empty");
  if (states.length > 6) throw new Error(`multiples: at most 6 states (got ${states.length})`);
  const cols = surveys.filter((s) => states.some((st) => hasFig({t, state: st.state, s})));
  const data = states.map((st, i) => {
    if (!st.key && !spec.key) throw new Error(`multiples: state "${st.state}" has no key and the scene has no key`);
    return {i, state: st.state, name: st.name ?? niceName(st.state), ...LINES[i % LINES.length], pts: readPoints(t, st.state, surveys, cols, dec),
      f0: st.key ? at(st.key) : at(spec.key as string) + i * stagger};
  });
  const ref = spec.line === false ? null : spec.line ?? (t === "tfr" ? {const: REPLACEMENT_LEVEL} : null);
  const refAt = (d0: number) => (ref?.key ? at(ref.key) : d0);

  // ---- grid ------------------------------------------------------------------------------------------------------------------------
  const n = data.length, nc = n <= 1 ? 1 : n <= 4 ? 2 : 3, nr = Math.ceil(n / nc);
  const pw = Math.min(900, (AREA.x1 - AREA.x0 - (nc - 1) * GAP) / nc), ph = Math.min(470, (AREA.y1 - AREA.y0 - (nr - 1) * GAP) / nr);
  const gridH = nr * ph + (nr - 1) * GAP, gy0 = AREA.y0 + (AREA.y1 - AREA.y0 - gridH) / 2, gx0 = AREA.x0 + (AREA.x1 - AREA.x0 - (nc * pw + (nc - 1) * GAP)) / 2;
  const slot = (i: number) => {
    const r = Math.floor(i / nc), inRow = Math.min(nc, n - r * nc), x0 = gx0 + ((nc - inRow) * (pw + GAP)) / 2;
    return {x: x0 + (i % nc) * (pw + GAP), y: gy0 + r * (ph + GAP)};
  };
  const wide = pw > 700, HH = wide ? 98 : 102, XB = 54, PADX = 28;

  // ---- one shared scale ---------------------------------------------------------------------------------------------------------
  const vals = [...data.flatMap((d) => d.pts.map((p) => p.v)), ...(ref ? [ref.const] : [])];
  const vmin = Math.min(...vals), vmax = Math.max(...vals), span = Math.max(vmax - vmin, 0.5), lo = vmin - (span - (vmax - vmin)) / 2;
  const cy0 = HH + 22, cy1 = ph - XB - 12, ky0 = cy0 + 14, ky1 = cy1 - 14;
  const yOf = (v: number) => ky1 - ((v - lo) / span) * (ky1 - ky0);
  const refText = ref ? String(ref.const) : "", refW = ref ? Math.ceil(tw(refText, 32)) + 34 : 0, refH = 44;
  const nCol = cols.length, pxl = wide ? 110 : 86, pxr = pw - PADX - (ref ? refW + 44 : 60);
  const colX = (c: number) => (nCol < 2 ? (pxl + pxr) / 2 : pxl + ((pxr - pxl) * c) / (nCol - 1));
  const adj = (d: (typeof data)[number], k: number) => k > 0 && d.pts[k].ri === d.pts[k - 1].ri + 1;
  const pAt = (d: (typeof data)[number], k: number) => d.f0 + 8 + k * STEP;

  // ---- chips: placed once per panel, in panel coordinates --------------------------------------------------------------------
  const CS = wide ? 50 : 46;
  const refBox: Box | null = ref ? {x: pw - PADX - refW / 2, y: yOf(ref.const), w: refW, h: refH} : null;
  const placed = data.map((d) => {
    const segs: Seg[] = [], dots: {x: number; y: number; r: number}[] = [];
    d.pts.forEach((p, k) => {
      dots.push({x: colX(p.col), y: yOf(p.v), r: 20});
      if (adj(d, k)) segs.push({x1: colX(d.pts[k - 1].col), y1: yOf(d.pts[k - 1].v), x2: colX(p.col), y2: yOf(p.v)});
    });
    const items: Place[] = d.pts.map((p, k) => ({id: String(k), x: colX(p.col), y: yOf(p.v), r: 20, ...chipBox(p.text, CS)}));
    return placeChips(items, segs, dots, refBox ? [{...refBox, w: refBox.w + 34, h: refBox.h + 14}] : [], {x0: 14, x1: pw - 14, y0: HH - 4, y1: ph - XB - 12});
  });

  // ---- the verdict: arrow only for a change of minChange or more --------------------------------------------------------------
  const verdictOf = (pts: Pt[]): "up" | "down" | "same" | null => {
    let a: Pt | undefined, b: Pt | undefined;
    if (spec.change) { a = pts.find((p) => p.s === spec.change![0]); b = pts.find((p) => p.s === spec.change![1]); }
    else if (pts.length >= 2) { a = pts[pts.length - 2]; b = pts[pts.length - 1]; }
    if (!a || !b) return null;
    const dlt = tenths(b, dec) - tenths(a, dec);
    return Math.abs(dlt) >= minChange ? (dlt > 0 ? "up" : "down") : "same";
  };

  const camS = camScale(f, dur, 0.012);
  return <>
    <Sky f={f}/>
    <div style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${camS})`, transformOrigin: "50% 52%"}}>
      {spec.title && <div style={{position: "absolute", left: 96, top: 64}}><Pill text={spec.title} f={f} at={2} dot={C.orange} size={36}/></div>}
      {spec.sub && <div style={{position: "absolute", right: 470, top: 66, transform: `scale(${pop(f, 6)})`, transformOrigin: "100% 50%"}}>
        <div style={{display: "inline-block", background: C.sky2, border: `6px solid ${C.ink}`, borderRadius: 44, padding: "10px 30px 12px", fontFamily: SANS, fontWeight: 800, fontSize: 34, lineHeight: 1.1, color: C.ink}}>
          {spec.sub.charAt(0).toUpperCase() + spec.sub.slice(1)}</div></div>}

      {data.map((d) => {
        const {x, y} = slot(d.i), s = pop(f, d.f0, 170), last = d.pts.length - 1, V = verdictOf(d.pts), vAt = pAt(d, last) + 12, ra = refAt(d.f0);
        if (f < d.f0 - 0 || s <= 0.001) {
          return <div key={d.i} style={{position: "absolute", left: x, top: y, width: pw, height: ph, boxSizing: "border-box", border: `6px dashed #9DB7D3`, borderRadius: 38, background: "rgba(255,255,255,0.45)",
            opacity: ease(f, 2 + d.i * 3, 12 + d.i * 3)}}/>;
        }
        const segs = d.pts.map((p, k) => {
          if (!adj(d, k)) return null;
          const a = d.pts[k - 1], pr = ease(f, pAt(d, k - 1) + 3, pAt(d, k)), x1 = colX(a.col), y1 = yOf(a.v), x2 = colX(p.col), y2 = yOf(p.v);
          return pr <= 0 ? null : {k, x1, y1, x2: x1 + (x2 - x1) * pr, y2: y1 + (y2 - y1) * pr};
        }).filter(Boolean) as {k: number; x1: number; y1: number; x2: number; y2: number}[];
        const nameMax = pw - PADX * 2 - (V === "same" ? (wide ? 340 : 180) : V ? (wide ? 96 : 90) : 0) - 10;
        return <div key={d.i} style={{position: "absolute", left: x, top: y, width: pw, height: ph, transform: `scale(${0.9 + 0.1 * s})`, transformOrigin: "50% 55%", opacity: Math.min(1, s * 1.6)}}>
          <div style={{position: "absolute", inset: 0, boxSizing: "border-box", background: C.white, border: `7px solid ${C.ink}`, borderRadius: 38, boxShadow: `0 10px 0 ${C.ink}`}}/>
          <svg width={pw} height={ph} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
            {cols.map((sv, c) => <line key={sv} x1={colX(c)} x2={colX(c)} y1={cy0 - 6} y2={cy1 + 8} stroke="#CFE0F2" strokeWidth={5} strokeDasharray="1 14" strokeLinecap="round"/>)}
            {ref && refBox && <line x1={PADX} x2={refBox.x - refBox.w / 2 - 8} y1={yOf(ref.const)} y2={yOf(ref.const)} stroke="#9DB7D3" strokeWidth={6} strokeDasharray="20 12" strokeLinecap="round" opacity={0.75 * ease(f, d.f0 + 2, d.f0 + 12)}/>}
            {segs.map((sg) => <line key={`i${sg.k}`} x1={sg.x1} y1={sg.y1} x2={sg.x2} y2={sg.y2} stroke={C.ink} strokeWidth={22} strokeLinecap="round"/>)}
            {segs.map((sg) => <line key={`c${sg.k}`} x1={sg.x1} y1={sg.y1} x2={sg.x2} y2={sg.y2} stroke={d.c} strokeWidth={11} strokeLinecap="round"/>)}
            {d.pts.map((p, k) => {
              const ss = pop(f, pAt(d, k));
              return ss <= 0.001 ? null : <g key={k} transform={`translate(${colX(p.col)} ${yOf(p.v)}) scale(${ss})`}><circle r={k === last ? 19 : 17} fill={d.c} stroke={C.ink} strokeWidth={7}/><circle cx={-5} cy={-5} r={4.5} fill={C.white} opacity={0.55}/></g>;
            })}
          </svg>
          {cols.map((sv, c) => <div key={sv} style={{position: "absolute", left: colX(c) - 80, width: 160, top: ph - XB - 2, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 34, lineHeight: 1, color: C.ink, opacity: 0.8 * ease(f, d.f0 + 4 + c * 3, d.f0 + 12 + c * 3)}}>{surveyLabel(sv).label}</div>)}
          <div style={{position: "absolute", left: PADX, top: 16, width: nameMax, height: HH - 24, display: "flex", alignItems: "center", fontFamily: SANS, fontWeight: 900, fontSize: wide ? 48 : 40, lineHeight: 1.02, color: C.ink}}>{d.name}</div>
          {V && f >= vAt && <div style={{position: "absolute", right: PADX, top: 20, height: HH - 24, display: "flex", alignItems: "center", transform: `scale(${pop(f, vAt, 170)})`, transformOrigin: "50% 50%"}}>
            {V === "same"
              ? <div style={{background: C.sky2, border: `5px solid ${C.ink}`, borderRadius: 30, padding: wide ? "6px 22px 8px" : "3px 16px 6px", fontFamily: SANS, fontWeight: 900, fontSize: wide ? 36 : 31, lineHeight: 1.04, color: C.ink, textAlign: "center", whiteSpace: wide ? "nowrap" : "pre-line"}}>
                {wide ? "about the same" : "about\nthe same"}</div>
              : <DirArrow dir={V} size={wide ? 82 : 76} color={V === "up" ? C.green : C.red} wob={Math.sin((f - vAt) / 7) * 5}/>}
          </div>}
          {ref && refBox && f >= ra + 4 && <div style={{position: "absolute", left: refBox.x - refBox.w / 2, top: refBox.y - refBox.h / 2, width: refBox.w, height: refBox.h, display: "flex", alignItems: "center", justifyContent: "center",
            background: "#E4EEF8", borderRadius: 999, fontFamily: ROUND, fontWeight: 800, fontSize: 32, lineHeight: 1, color: "#5F82AD", opacity: ease(f, ra + 4, ra + 12), fontFeatureSettings: "'lnum' 1"}}>{refText}</div>}
          {d.pts.map((p, k) => <ValChip key={k} box={placed[d.i][String(k)]} text={p.text} color={d.d} size={CS} t={pop(f, pAt(d, k) + 3)}/>)}
        </div>;
      })}
    </div>
  </>;
};
