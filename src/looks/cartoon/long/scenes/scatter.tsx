// SCATTER scene (spec 7 in CONTRACT.md): one dot per state / UT (India excluded), x = schooling or child marriage (NFHS-6), y = fertility (NFHS-6).
// Dots pop in with a stagger, a least-squares trend line draws on (computed here from the dots, never typed), labelled dots carry their
// values from their reveal key, a correlation badge prints fig(spec.corr.ref) and the caption "Pattern, not proof" stays up once the line is done.
// Number rule: every printed figure comes from fig(); digits are drawn only from at(key). Axis ticks are scale marks computed from the data
// range (they carry no claim). The dots themselves, the trend line and the empty badge shell may appear before any key.
import React from "react";
import {AbsoluteFill} from "remotion";
import {measure} from "../../../shared/fit";
import {C} from "../../palette";
import {Inked, Pill, ROUND, SANS, ease, easeIO, pop} from "../../ui";
import type {FigRef, SceneProps} from "../contract";
import {fig, hasFig, stateNames} from "../figs";

type Label = string | {state: string; key?: string; color?: string};
type Cam = {fx: number; fy: number; s0: number; s1: number};
export type ScatterSpec = {
  x: "school10" | "marriage18"; y?: "tfr6"; label?: Label[]; trend?: boolean;
  corr: {ref: FigRef; key: string}; caption?: string; prev?: {ref: FigRef; key: string; label?: string};
  title?: string; source?: string; trendKey?: string; xDecimals?: number; camera?: Cam; notes?: string;
};

// ---- geometry -------------------------------------------------------------------------------------------------------------
const CARD = {x: 96, y: 172, w: 1170, h: 740};
const PLOT = {x0: 276, x1: 1218, y0: 226, y1: 752};          // the area the dots live in (px, 1920x1080 frame)
const COL = {x0: 1330, x1: 1824};                              // right column: badges and the caption
const DOT_R = 14, DOT_BORDER = 5;
const INK = C.ink;

const VAR = {
  school10: {pill: "Schooling vs babies", xTitle: "Women aged 15-49 with 10+ years of schooling (%)", xCap: "10+ yrs school", more: "More schooling"},
  marriage18: {pill: "Child marriage vs babies", xTitle: "Women aged 20-24 married before age 18 (%)", xCap: "wed before 18", more: "More child marriage"},
} as const;

const STEPS = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50];
const niceScale = (lo: number, hi: number, maxIntervals = 7) => {
  const span = hi - lo;
  const step = STEPS.find((s) => span / s <= maxIntervals) ?? 100;
  let a = Math.floor(lo / step + 1e-9) * step, b = Math.ceil(hi / step - 1e-9) * step;
  if (lo - a < step * 0.25) a -= step;
  if (b - hi < step * 0.25) b += step;
  const ticks: number[] = [];
  for (let v = a; v <= b + step * 1e-6; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
  return {a, b, step, ticks};
};

type Pt = {state: string; x: number; y: number};
const loadPoints = (xv: string): Pt[] => {
  if (xv !== "school10" && xv !== "marriage18") throw new Error(`scatter: unknown x "${xv}" (school10 | marriage18)`);
  const states = stateNames("tfr").filter((s) => hasFig({t: "tfr", state: s, s: "nfhs6"}));      // a state with no NFHS-6 rate (Manipur) has no dot
  if (states.length < 30) throw new Error(`scatter: only ${states.length} states with an NFHS-6 fertility rate, expected about 35`);
  return states.map((s) => ({state: s, x: fig({t: xv, state: s, s: "nfhs6"}).value, y: fig({t: "tfr", state: s, s: "nfhs6"}).value}));     // throws if x is missing
};

const stats = (p: Pt[]) => {
  const n = p.length, mx = p.reduce((a, q) => a + q.x, 0) / n, my = p.reduce((a, q) => a + q.y, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (const q of p) { sxy += (q.x - mx) * (q.y - my); sxx += (q.x - mx) ** 2; syy += (q.y - my) ** 2; }
  const slope = sxy / sxx;
  return {slope, icpt: my - slope * mx, r: sxy / Math.sqrt(sxx * syy)};
};

// ---- label tags: placed where they cover no other dot ---------------------------------------------------------------------
type Rect = {x: number; y: number; w: number; h: number};
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const dotHits = (cx: number, cy: number, r: number, R: Rect) => (cx - clamp(cx, R.x, R.x + R.w)) ** 2 + (cy - clamp(cy, R.y, R.y + R.h)) ** 2 < r * r;
const rectsHit = (a: Rect, b: Rect) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

// Grid search: the free spot nearest the dot where the tag covers no dot, no earlier tag and (where it can) not the trend line.
const placeTags = (pts: {cx: number; cy: number}[], all: {cx: number; cy: number}[], size: {w: number; h: number}[], line: {x1: number; y1: number; x2: number; y2: number} | null): Rect[] => {
  const out: Rect[] = [];
  const lineHits = (R: Rect) => {
    if (!line) return 0;
    let n = 0;
    for (let i = 0; i <= 24; i++) { const x = line.x1 + (line.x2 - line.x1) * i / 24, y = line.y1 + (line.y2 - line.y1) * i / 24; if (x > R.x - 14 && x < R.x + R.w + 14 && y > R.y - 14 && y < R.y + R.h + 14) n++; }
    return n;
  };
  pts.forEach((p, i) => {
    const {w, h} = size[i];
    let best: Rect | null = null, bestScore = Infinity;
    for (let x = PLOT.x0 + 12; x <= PLOT.x1 - 12 - w; x += 12) {
      for (let y = PLOT.y0 + 8; y <= PLOT.y1 - 10 - h; y += 12) {
        const R = {x, y, w, h}, fat = {x: x - 14, y: y - 14, w: w + 28, h: h + 28};
        let sc = Math.hypot(clamp(p.cx, x, x + w) - p.cx, clamp(p.cy, y, y + h) - p.cy) + Math.hypot(x + w / 2 - p.cx, y + h / 2 - p.cy) * 0.25;
        if (sc >= bestScore) continue;
        for (const q of all) if (dotHits(q.cx, q.cy, DOT_R + DOT_BORDER, fat)) { sc += 2000; break; }
        for (const o of out) if (rectsHit(fat, o)) sc += 5000;
        sc += lineHits(R) * 40;
        if (sc < bestScore) { bestScore = sc; best = R; }
      }
    }
    out.push(best as Rect);
  });
  return out;
};

const signed = (v: number, d = 2) => `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(d)}`;

const TAG = {name: 38, num: 48, cap: 25, h: 148};
const PAL = [C.green, C.red, C.orange, C.yellow];
const PAL_DARK = [C.greenDark, C.redDark, C.orangeDark, C.orangeDark];

// ---- the scene ------------------------------------------------------------------------------------------------------------
export const Scene: React.FC<SceneProps<ScatterSpec>> = ({f, dur, spec, at}) => {
  const xv = spec.x, V = VAR[xv as keyof typeof VAR];
  if (!V) throw new Error(`scatter: unknown x "${xv}"`);
  if ((spec.y ?? "tfr6") !== "tfr6") throw new Error(`scatter: unknown y "${spec.y}" (tfr6)`);
  const xd = spec.xDecimals ?? 0;

  // data (every value through fig(); a missing one throws)
  const pts = React.useMemo(() => loadPoints(xv), [xv]);
  const st = React.useMemo(() => stats(pts), [pts]);
  const corrFig = fig(spec.corr.ref, 2);
  if (Math.sign(corrFig.value) !== Math.sign(st.slope)) throw new Error(`scatter: trend slope ${st.slope.toFixed(4)} and printed correlation ${corrFig.value} have opposite signs`);
  if (Math.abs(corrFig.value - st.r) > 0.01) throw new Error(`scatter: printed correlation ${corrFig.value} differs from the correlation of the dots ${st.r.toFixed(3)}; update figures.json stats or the spec`);
  const prevFig = spec.prev ? fig(spec.prev.ref, 2) : null;

  // reveal frames (throw on an unknown key in the real engine)
  const tCorr = at(spec.corr.key), tPrev = spec.prev ? at(spec.prev.key) : 0;
  const labels = (spec.label ?? ["Kerala", "Bihar"]).map((l, i) => {
    const o = typeof l === "string" ? {state: l} : l;
    const p = pts.find((q) => q.state === o.state);
    if (!p) throw new Error(`scatter: label "${o.state}" is not a state with a dot`);
    const key = (o as any).key ?? o.state;
    return {...o, p, key, t: at(key), color: (o as any).color ?? PAL[i % PAL.length], dark: PAL_DARK[i % PAL_DARK.length]};
  });

  // scales
  const xs = niceScale(Math.min(...pts.map((p) => p.x)), Math.max(...pts.map((p) => p.x)), 7);
  const ys = niceScale(Math.min(...pts.map((p) => p.y)), Math.max(...pts.map((p) => p.y)), 7);
  const sx = (v: number) => PLOT.x0 + ((v - xs.a) / (xs.b - xs.a)) * (PLOT.x1 - PLOT.x0);
  const sy = (v: number) => PLOT.y1 - ((v - ys.a) / (ys.b - ys.a)) * (PLOT.y1 - PLOT.y0);
  const dots = pts.map((p) => ({...p, cx: sx(p.x), cy: sy(p.y)}));

  // timeline
  const sorted = [...dots].sort((a, b) => a.x - b.x);
  const per = Math.min(1.1, Math.max(0.4, (dur * 0.3) / dots.length)), dot0 = 6;
  const order = new Map(sorted.map((d, i) => [d.state, i]));
  const dotsEnd = dot0 + dots.length * per + 12;
  const trendOn = spec.trend !== false;
  const trendStart = spec.trendKey ? at(spec.trendKey) : Math.min(dotsEnd, Math.max(10, dur - 70));
  const trendEnd = trendStart + 26;
  const doneAt = trendOn ? trendEnd : Math.max(trendStart - 20, 12);
  const caption = spec.caption ?? "Pattern, not proof";

  // camera
  const cam = spec.camera ?? {fx: 740, fy: 480, s0: 1, s1: 1.025};
  const cs = cam.s0 + (cam.s1 - cam.s0) * easeIO(f, 0, dur);

  // label tags (measured with the real fonts, then placed in free space; the full trend line is avoided where it can be)
  const xa = Math.min(...pts.map((p) => p.x)), xb = Math.max(...pts.map((p) => p.x));
  const fullLine = trendOn ? {x1: sx(xa), y1: sy(st.icpt + st.slope * xa), x2: sx(xb), y2: sy(st.icpt + st.slope * xb)} : null;
  const tagKey = labels.map((L) => L.state).join("|") + `|${xv}|${xd}`;
  const rects = React.useMemo(() => {
    const M = (t: string, fam: string, sz: number) => measure(t, {family: fam, weight: 800, tnum: false}, sz);
    const size = labels.map((L) => {
      const c1 = Math.ceil(Math.max(M(L.p.x.toFixed(xd) + "%", ROUND, TAG.num), M(V.xCap, SANS, TAG.cap))), c2 = Math.ceil(Math.max(M(L.p.y.toFixed(1), ROUND, TAG.num), M("children", SANS, TAG.cap)));
      return {w: Math.max(c1 + 30 + c2, Math.ceil(M(L.state, ROUND, TAG.name))) + 52, h: TAG.h, c1, c2};
    });
    const at0 = placeTags(labels.map((L) => ({cx: sx(L.p.x), cy: sy(L.p.y)})), dots, size, fullLine);
    return at0.map((R, i) => ({...R, c1: size[i].c1, c2: size[i].c2}));
  }, [tagKey]);      // eslint-disable-line react-hooks/exhaustive-deps

  const lineP = trendOn ? easeIO(f, trendStart, trendEnd) : 0;
  const tl = {x1: sx(xa), y1: sy(st.icpt + st.slope * xa), x2: sx(xa + (xb - xa) * lineP), y2: sy(st.icpt + st.slope * (xa + (xb - xa) * lineP))};

  const shellT = Math.min(tCorr, dot0 + 8);
  const shellP = pop(f, shellT, 170);
  const digitsP = f >= tCorr ? pop(f, tCorr, 200) : 0;
  const prevP = spec.prev ? pop(f, tPrev, 170) : 0;
  const capP = pop(f, doneAt, 200);
  const reads = `${V.more}, ${corrFig.value < 0 ? "fewer" : "more"} babies, on average`;
  const tReads = Math.min(doneAt, tCorr);
  const stamp = (n: number) => 0.55 + 0.45 * Math.min(1.12, n);

  return <AbsoluteFill style={{background: C.sky}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute", left: 0, top: 0}}>
      <circle cx={1740} cy={980} r={210} fill={C.sky2}/><circle cx={90} cy={1010} r={150} fill={C.sky2}/><circle cx={1500} cy={120} r={120} fill={C.sky2}/>
      <g transform={`translate(${cam.fx} ${cam.fy}) scale(${cs}) translate(${-cam.fx} ${-cam.fy})`}>
        <rect x={CARD.x} y={CARD.y + 12} width={CARD.w} height={CARD.h} rx={46} fill={INK}/>
        <rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx={46} fill={C.white} stroke={INK} strokeWidth={8}/>

        {/* grid, axes, ticks (scale marks, no claim) */}
        {ys.ticks.map((v) => <line key={`gy${v}`} x1={PLOT.x0} x2={PLOT.x1} y1={sy(v)} y2={sy(v)} stroke={C.sky} strokeWidth={4} strokeDasharray="4 14" strokeLinecap="round"/>)}
        {xs.ticks.map((v) => <line key={`gx${v}`} x1={sx(v)} x2={sx(v)} y1={PLOT.y0} y2={PLOT.y1} stroke={C.sky} strokeWidth={4} strokeDasharray="4 14" strokeLinecap="round"/>)}
        <line x1={PLOT.x0} x2={PLOT.x1 + 8} y1={PLOT.y1} y2={PLOT.y1} stroke={INK} strokeWidth={8} strokeLinecap="round"/>
        <line x1={PLOT.x0} x2={PLOT.x0} y1={PLOT.y0 - 8} y2={PLOT.y1} stroke={INK} strokeWidth={8} strokeLinecap="round"/>
        {xs.ticks.map((v) => <g key={`tx${v}`}><line x1={sx(v)} x2={sx(v)} y1={PLOT.y1} y2={PLOT.y1 + 14} stroke={INK} strokeWidth={6} strokeLinecap="round"/>
          <text x={sx(v)} y={PLOT.y1 + 54} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={34} fill={INK}>{v}</text></g>)}
        {ys.ticks.map((v) => <g key={`ty${v}`}><line x1={PLOT.x0 - 14} x2={PLOT.x0} y1={sy(v)} y2={sy(v)} stroke={INK} strokeWidth={6} strokeLinecap="round"/>
          <text x={PLOT.x0 - 26} y={sy(v) + 12} textAnchor="end" fontFamily={SANS} fontWeight={800} fontSize={34} fill={INK}>{v.toFixed(1)}</text></g>)}
        <text x={(PLOT.x0 + PLOT.x1) / 2} y={PLOT.y1 + 112} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={36} fill={INK}>{V.xTitle}</text>
        <text transform={`translate(146 ${(PLOT.y0 + PLOT.y1) / 2}) rotate(-90)`} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={36} fill={INK}>Children per woman</text>

        {/* dots: plain ones first, then the labelled ones on top */}
        {dots.filter((d) => !labels.some((L) => L.state === d.state)).map((d) => {
          const i = order.get(d.state) as number, t = pop(f, dot0 + i * per, 230);
          if (t <= 0.001) return null;
          const bob = Math.sin((f - dot0 - i * per) / 11 + i * 1.7) * 1.6;
          return <g key={d.state} transform={`translate(${d.cx} ${d.cy + bob}) scale(${t})`}>
            <circle cx={0} cy={4} r={DOT_R} fill={INK}/><circle r={DOT_R} fill={C.blue} stroke={INK} strokeWidth={DOT_BORDER}/><circle cx={-4} cy={-4} r={3.5} fill={C.white} opacity={0.7}/></g>;
        })}

        {/* trend line: ink outline, orange core, drawn on from the left */}
        {trendOn && lineP > 0.001 && <g strokeLinecap="round">
          <line x1={tl.x1} y1={tl.y1} x2={tl.x2} y2={tl.y2} stroke={INK} strokeWidth={17}/>
          <line x1={tl.x1} y1={tl.y1} x2={tl.x2} y2={tl.y2} stroke={C.orange} strokeWidth={8}/>
        </g>}

        {/* labelled dots, guide leaders and tags */}
        {labels.map((L, i) => {
          const d = dots.find((q) => q.state === L.state) as typeof dots[number], idx = order.get(L.state) as number;
          const base = pop(f, dot0 + idx * per, 230), hot = f >= L.t ? pop(f, L.t, 200) : 0;
          const r = DOT_R * (1 + 0.75 * Math.min(1.15, hot));
          const R = rects[i], tp = pop(f, L.t + 2, 190);
          const nx = clamp(d.cx, R.x, R.x + R.w), ny = clamp(d.cy, R.y, R.y + R.h);
          const nt = L.p.x.toFixed(xd) + "%", yt = L.p.y.toFixed(1);
          const ring = f >= L.t ? ((f - L.t) % 40) / 40 : 0;
          return <g key={L.state}>
            {hot > 0 && <g opacity={ease(f, L.t, L.t + 6)}><line x1={d.cx} y1={d.cy} x2={nx} y2={ny} stroke={INK} strokeWidth={5} strokeLinecap="round"/></g>}
            {base > 0.001 && <g transform={`translate(${d.cx} ${d.cy}) scale(${base})`}>
              {hot > 0 && <circle r={r + 8 + ring * 22} fill="none" stroke={L.color} strokeWidth={5} opacity={(1 - ring) * 0.8}/>}
              <circle cx={0} cy={4} r={r} fill={INK}/>
              <circle r={r} fill={hot > 0 ? L.color : C.blue} stroke={INK} strokeWidth={DOT_BORDER + (hot > 0 ? 1 : 0)}/>
              <circle cx={-r * 0.3} cy={-r * 0.3} r={3.5} fill={C.white} opacity={0.7}/></g>}
            {f >= L.t && tp > 0.001 && <g transform={`translate(${d.cx} ${d.cy}) scale(${tp}) translate(${-d.cx} ${-d.cy})`}>
              <rect x={R.x} y={R.y + 8} width={R.w} height={R.h} rx={26} fill={INK}/>
              <rect x={R.x} y={R.y} width={R.w} height={R.h} rx={26} fill={C.white} stroke={INK} strokeWidth={7}/>
              <rect x={R.x + 4} y={R.y + 4} width={R.w - 8} height={50} rx={22} fill={L.color} opacity={0.28}/>
              <text x={R.x + 26} y={R.y + 42} fontFamily={ROUND} fontWeight={800} fontSize={TAG.name} fill={INK}>{L.state}</text>
              <text x={R.x + 26} y={R.y + 100} fontFamily={ROUND} fontWeight={800} fontSize={TAG.num} fill={L.dark}>{nt}</text>
              <text x={R.x + 26} y={R.y + 132} fontFamily={SANS} fontWeight={800} fontSize={TAG.cap} fill={INK}>{V.xCap}</text>
              <text x={R.x + 26 + R.c1 + 30} y={R.y + 100} fontFamily={ROUND} fontWeight={800} fontSize={TAG.num} fill={L.dark}>{yt}</text>
              <text x={R.x + 26 + R.c1 + 30} y={R.y + 132} fontFamily={SANS} fontWeight={800} fontSize={TAG.cap} fill={INK}>children</text>
            </g>}
          </g>;
        })}
      </g>
    </svg>

    <div style={{position: "absolute", left: 96, top: 66}}><Pill text={spec.title ?? V.pill} f={f} at={2} dot={C.red} size={36}/></div>

    {/* right column: correlation badge, previous survey, caption, source */}
    <div style={{position: "absolute", left: COL.x0, width: COL.x1 - COL.x0, top: 132, height: 790, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28}}>
      <div style={{width: 470, background: C.white, border: `8px solid ${INK}`, borderRadius: 44, boxShadow: `0 12px 0 ${INK}`, padding: "18px 24px 22px", textAlign: "center",
        transform: `scale(${shellP}) rotate(-2deg)`, transformOrigin: "50% 60%"}}>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 34, letterSpacing: 3, color: INK}}>CORRELATION</div>
        <div style={{height: 128, display: "flex", alignItems: "center", justifyContent: "center"}}>
          {f < tCorr && <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: 118, lineHeight: 1, color: C.fridgeDark, transform: `rotate(${Math.sin(f / 9) * 5}deg)`}}>?</div>}
          {f >= tCorr && <div style={{display: "inline-block", transform: `scale(${stamp(digitsP)})`, transformOrigin: "50% 70%"}}>
            <Inked accent={{kind: "underline", color: C.red, seed: 4}} f={f} at={tCorr + 8}>
              <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: 116, lineHeight: 1, color: C.royal, letterSpacing: -2, whiteSpace: "nowrap", fontFeatureSettings: "'lnum' 1"}}>{signed(corrFig.value)}</div></Inked></div>}
        </div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, lineHeight: 1.15, color: INK, opacity: ease(f, tReads, tReads + 8)}}>{reads}</div>
      </div>

      {spec.prev && prevFig && <div style={{width: 400, background: C.white, border: `7px solid ${INK}`, borderRadius: 38, boxShadow: `0 10px 0 ${INK}`, padding: "10px 24px 16px", textAlign: "center",
        transform: `scale(${prevP}) rotate(2deg)`, transformOrigin: "50% 60%"}}>
        {f >= tPrev && <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: 84, lineHeight: 1.05, color: C.blueDark, letterSpacing: -1, whiteSpace: "nowrap", fontFeatureSettings: "'lnum' 1"}}>{signed(prevFig.value)}</div>}
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 32, color: INK, marginTop: 2}}>{spec.prev.label ?? "Last survey, NFHS-5"}</div>
      </div>}

      <div style={{background: C.yellow, border: `8px solid ${INK}`, borderRadius: 34, boxShadow: `0 12px 0 ${INK}`, padding: "10px 34px 16px", textAlign: "center", maxWidth: 480,
        fontFamily: ROUND, fontWeight: 800, fontSize: 64, lineHeight: 1.04, letterSpacing: -1, color: INK,
        transform: `scale(${capP}) rotate(${-3 + Math.sin(f / 14) * 0.8}deg)`, transformOrigin: "50% 50%"}}>{caption}</div>

      <div style={{display: "flex", alignItems: "center", gap: 14, background: C.white, border: `6px solid ${INK}`, borderRadius: 999, boxShadow: `0 8px 0 ${INK}`, padding: "8px 26px 8px 16px",
        transform: `scale(${pop(f, 4, 200)})`, fontFamily: SANS, fontWeight: 900, fontSize: 30, color: INK, whiteSpace: "nowrap"}}>
        <span style={{width: 30, height: 30, borderRadius: "50%", background: C.blue, border: `5px solid ${INK}`, display: "inline-block"}}/>one dot is one state or UT</div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 25, lineHeight: 1.2, color: INK, opacity: 0.85, textAlign: "center", maxWidth: 470, marginTop: -10}}>{spec.source ?? "Source: NFHS-6, MoHFW / IIPS"}</div>
    </div>
  </AbsoluteFill>;
};
