// SCATTER scene (spec 7 in CONTRACT.md): one dot per state / UT (India excluded), x = schooling or child marriage, y = total fertility rate,
// same survey (NFHS-6 for y "tfr6"). Axes with labelled ticks, a least-squares trend line computed here from the plotted dots (never typed), a
// correlation badge printed from fig(spec.corr.ref), an optional previous-survey badge, and the caption "Pattern, not proof" that stays on screen
// once the trend line is done. Labelled dots (default Kerala, Bihar) show a callout whose values are drawn only from their reveal key.
// Number rule: every printed figure comes from fig() and its digits are drawn only from at(key). Axis ticks are scale marks generated from the
// data range (they carry no claim). Dots, the trend line and the badge shells may grow before any key.
import React from "react";
import {AbsoluteFill} from "remotion";
import {measure} from "../../../shared/fit";
import {C} from "../../palette";
import {Inked, Pill, ROUND, SANS, ease, easeIO, pop} from "../../ui";
import {SAFE, type FigRef, type SceneProps} from "../contract";
import {fig, hasFig, stateNames} from "../figs";

export type Dir = "up" | "down" | "left" | "right" | "ur" | "ul" | "dr" | "dl";
export type LabelSpec = string | {state: string; key?: string; valueKey?: string; dir?: Dir; color?: string};
export type ScatterSpec = {
  x: "school10" | "marriage18";                          // the driver on the x axis
  y?: "tfr6" | "tfr5";                                   // fertility, from the same survey as x. Default "tfr6" (NFHS-6)
  label?: LabelSpec[];                                   // dots to name. Default ["Kerala", "Bihar"]. A string is the state; its reveal key is the state name.
                                                         // {state, key?, valueKey?}: key shows the name and grows the dot, valueKey (default key) prints the values; dir pins the chip
  trend?: boolean;                                       // trend line. Default true
  corr: {ref: FigRef; key: string; sub?: string};        // printed with 2 decimals; sub = the line under the number (default from the variant and the sign)
  caption?: string;                                      // the sticker. Default "Pattern, not proof" (split at the comma onto two lines)
  prev?: {ref: FigRef; key: string; label?: string};     // previous-survey correlation badge. label default "NFHS-5"
  title?: string;                                        // pill top-left. Default from the variant
  source?: string;                                       // optional small source line under the chart card (nothing is drawn if omitted)
  xTitle?: string; yTitle?: string;                      // axis titles. Defaults from the variant / "Children per woman"
  xDecimals?: number;                                    // decimals of the x value in the chips. Default 0 (the narrator says 87, not 86.6)
  stagger?: number;                                      // frames between dots. Default fits the scene length
  dotsKey?: string; trendKey?: string;                   // optional reveal keys to start the dots / the trend line on a narrator's word
  camera?: {fx: number; fy: number; s0: number; s1: number}; notes?: string;   // push-in. Default: a very slow push to 1.015 around the card
};

const VARIANT = {
  school10: {title: "Schooling vs babies", xTitle: "Women with 10+ years of school (%)", more: "More schooling", teaser: "Do schooling and babies move together?"},
  marriage18: {title: "Child marriage vs babies", xTitle: "Women 20-24 married before 18 (%)", more: "More child marriage", teaser: "Do child marriage and babies move together?"},
} as const;

// ---- geometry (1920 x 1080 frame) ---------------------------------------------------------------------------------------------------
const CARD = {x: 96, y: 156, w: 1140, h: 760};
const PL = {x0: CARD.x + 150, x1: CARD.x + CARD.w - 76, y0: CARD.y + 44, y1: CARD.y + CARD.h - 124};
const COL = {x: 1272, w: 528, y: 156, h: 760};              // right column, ends at x 1800 (24 px inside SAFE)
const R_DOT = 15, R_BIG = 27;
const LABEL_COLORS = [C.green, C.orange, C.red, C.yellow];
const LABEL_DARK = [C.greenDark, C.orangeDark, C.redDark, C.orangeDark];

type Pt = {state: string; x: number; y: number; px: number; py: number};
type Rect = {x: number; y: number; w: number; h: number};
type Placed = {pt: Pt; idx: number; key: string; valueKey: string; color: string; dark: string; name: string; values: string; rect: Rect; w: number; h: number; ax: number; ay: number};

const stepFor = (span: number) => [0.5, 1, 2, 5, 10, 20, 25, 50].find((s) => s >= span / 6) ?? 50;
const domain = (lo: number, hi: number) => {
  const st = stepFor(hi - lo);
  const d0 = Math.floor(lo / st + 1e-9) * st, d1 = Math.ceil(hi / st - 1e-9) * st;
  const ticks: number[] = [];
  for (let v = d0; v <= d1 + 1e-9; v += st) ticks.push(Math.round(v * 100) / 100);
  return {d0, d1, ticks, st};
};
const pearson = (xs: number[], ys: number[]) => {
  const n = xs.length, mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) ** 2; syy += (ys[i] - my) ** 2; });
  return {r: sxy / Math.sqrt(sxx * syy), slope: sxy / sxx, icpt: my - (sxy / sxx) * mx};
};
const nearestOnRect = (r: Rect, x: number, y: number) => ({x: Math.min(r.x + r.w, Math.max(r.x, x)), y: Math.min(r.y + r.h, Math.max(r.y, y))});
const touches = (a: Rect, b: Rect, m: number) => a.x < b.x + b.w + m && a.x + a.w > b.x - m && a.y < b.y + b.h + m && a.y + a.h > b.y - m;
const signed = (v: number, text: string) => (v < 0 ? "−" : "+") + text.replace("-", "");
const DEG: Record<Dir, number> = {ur: -45, ul: -135, up: -90, right: 0, left: 180, dr: 45, dl: 135, down: 90};
const DEGS = [-45, -135, -90, 0, 180, -60, -120, -30, -150, -75, -105, -15, -165, 45, 135, 90, 15, 165, 60, 120, 30, 150, 75, 105];      // every 15 degrees, up first

export const Scene: React.FC<SceneProps<ScatterSpec>> = ({f, dur, spec, at}) => {
  const xv = spec.x, V = VARIANT[xv as keyof typeof VARIANT];
  if (!V) throw new Error(`scatter: unknown x "${String(xv)}" (school10 | marriage18)`);
  const ym = /^tfr(\d)$/.exec(spec.y ?? "tfr6");
  if (!ym) throw new Error(`scatter: unknown y "${spec.y}" (tfr6 | tfr5)`);
  const survey = `nfhs${ym[1]}`, xDec = spec.xDecimals ?? 0, caption = spec.caption ?? "Pattern, not proof";
  const cr = spec.corr;
  if (!cr?.ref) throw new Error("scatter: spec.corr.ref is required (a figures.json reference for the printed correlation)");

  // ---- data: every state with a fertility value in this survey; its x value must exist too (fig throws if not) ------------------------
  const states = stateNames("tfr").filter((s) => hasFig({t: "tfr", state: s, s: survey}));
  if (states.length < 20) throw new Error(`scatter: only ${states.length} states have ${survey} fertility`);
  const raw = states.map((s) => ({state: s, x: fig({t: xv, state: s, s: survey}).value, y: fig({t: "tfr", state: s, s: survey}).value}));
  const dx = domain(Math.min(...raw.map((p) => p.x)), Math.max(...raw.map((p) => p.x)));
  const dy = domain(Math.min(...raw.map((p) => p.y)), Math.max(...raw.map((p) => p.y)));
  const X = (v: number) => PL.x0 + ((v - dx.d0) / (dx.d1 - dx.d0)) * (PL.x1 - PL.x0);
  const Y = (v: number) => PL.y1 - ((v - dy.d0) / (dy.d1 - dy.d0)) * (PL.y1 - PL.y0);
  const pts: Pt[] = raw.map((p) => ({...p, px: X(p.x), py: Y(p.y)})).sort((a, b) => a.px - b.px);

  // ---- the trend line, from the plotted data; its sign must agree with the printed correlation ---------------------------------
  const st = pearson(pts.map((p) => p.x), pts.map((p) => p.y));
  const printed = fig(cr.ref, 2);
  if (Math.sign(printed.value) !== Math.sign(st.slope) || Math.abs(printed.value - st.r) > 0.02)
    throw new Error(`scatter: printed correlation ${printed.text} disagrees with the plotted dots (r = ${st.r.toFixed(3)}, slope ${st.slope.toFixed(4)}, ${pts.length} points)`);
  const prev = spec.prev ? fig(spec.prev.ref, 2) : null;
  const trendOn = spec.trend !== false;
  const xMin = pts.reduce((a, p) => Math.min(a, p.x), Infinity), xMax = pts.reduce((a, p) => Math.max(a, p.x), -Infinity), pad = (dx.d1 - dx.d0) * 0.03;
  let lx0 = Math.max(dx.d0, xMin - pad), lx1 = Math.min(dx.d1, xMax + pad);
  const clipX = (xa: number) => { const y = st.icpt + st.slope * xa; return y < dy.d0 ? (dy.d0 - st.icpt) / st.slope : y > dy.d1 ? (dy.d1 - st.icpt) / st.slope : xa; };
  lx0 = clipX(lx0); lx1 = clipX(lx1);
  const L = {ax: X(lx0), ay: Y(st.icpt + st.slope * lx0), bx: X(lx1), by: Y(st.icpt + st.slope * lx1)};
  const lineLen = Math.hypot(L.bx - L.ax, L.by - L.ay);

  // ---- reveal frames (every key is read up front, so a missing key fails the render on the first frame) ---------------------------
  const corrAt = at(cr.key), prevAt = spec.prev ? at(spec.prev.key) : 0;
  const labels = (spec.label ?? ["Kerala", "Bihar"]).map((l) => (typeof l === "string" ? {state: l} : l) as Exclude<LabelSpec, string>);
  const n = pts.length;
  const stag = spec.stagger ?? Math.min(2, Math.max(0.6, (dur * 0.26) / n));
  const dotsAt = spec.dotsKey ? at(spec.dotsKey) : 10;
  const dotsDone = dotsAt + (n - 1) * stag + 14;
  const lineDur = 28;
  const lineAt = Math.max(spec.trendKey ? at(spec.trendKey) : 0, dotsDone - 4);
  const lineDone = lineAt + lineDur;
  const noteAt = trendOn ? lineDone + 2 : dotsDone;
  const shellAt = Math.min(corrAt, dotsDone + 8);                // the badge shell (header, a ? where the number goes) lands with the dots; the digits wait for the key

  // ---- labelled dots + callout chips: all chips are placed together (best joint spot away from the other dots, the trend line,
  // each other, and any leader line crossing a dot) --------------------------------------------------------------------------------
  type Lab = {pt: Pt; idx: number; key: string; valueKey: string; color: string; dark: string; name: string; values: string; w: number; h: number; dir?: Dir};
  const labs: Lab[] = labels.map((l, li) => {
    const idx = pts.findIndex((p) => p.state === l.state);
    if (idx < 0) throw new Error(`scatter: label "${l.state}" is not one of the plotted states`);
    const key = l.key ?? l.state, valueKey = l.valueKey ?? key;
    at(key); at(valueKey);
    const values = `${fig({t: xv, state: l.state, s: survey}, xDec).text}%  ·  ${fig({t: "tfr", state: l.state, s: survey}).text} kids`;
    const w = Math.max(measure(l.state, {family: ROUND, weight: 800}, 46), measure(values, {family: SANS, weight: 900}, 38)) + 44;
    return {pt: pts[idx], idx, key, valueKey, color: l.color ?? LABEL_COLORS[li % LABEL_COLORS.length], dark: LABEL_DARK[li % LABEL_DARK.length], name: l.state, values, w, h: 128, dir: l.dir};
  });
  const labIdx = new Set(labs.map((l) => l.idx));
  const candidates = (lb: Lab): {r: Rect; s: number}[] => {
    const {pt, w, h} = lb;
    const cand = (deg: number, gap: number): Rect => {      // 24 directions x 8 distances, each shifted to stay inside the plot
      const th = (deg * Math.PI) / 180, cx = Math.cos(th), sy = Math.sin(th);
      const ext = Math.min(Math.abs(cx) > 1e-6 ? w / 2 / Math.abs(cx) : Infinity, Math.abs(sy) > 1e-6 ? h / 2 / Math.abs(sy) : Infinity);
      const d = R_BIG + gap + ext, ccx = pt.px + cx * d, ccy = pt.py + sy * d;
      return {x: Math.min(PL.x1 - 6 - w, Math.max(PL.x0 + 14, ccx - w / 2)), y: Math.min(PL.y1 - 10 - h, Math.max(PL.y0 + 4, ccy - h / 2)), w, h};
    };
    const score = (r: Rect, bias: number) => {
      let s = bias;
      const own = nearestOnRect(r, pt.px, pt.py);
      if (Math.hypot(pt.px - own.x, pt.py - own.y) < R_BIG + 12) s += 8000;           // never sit on top of its own dot
      pts.forEach((p, i) => {
        if (i === lb.idx) return;
        const q = nearestOnRect(r, p.px, p.py), rad = labIdx.has(i) ? R_BIG : R_DOT;
        if (Math.hypot(p.px - q.x, p.py - q.y) < rad + 12) s += 600;
        const vx = own.x - pt.px, vy = own.y - pt.py, len2 = vx * vx + vy * vy || 1;     // the leader line must not run through another dot
        const t = Math.max(0, Math.min(1, ((p.px - pt.px) * vx + (p.py - pt.py) * vy) / len2));
        if (Math.hypot(p.px - (pt.px + t * vx), p.py - (pt.py + t * vy)) < rad + 9) s += 700;
      });
      if (trendOn) for (let t = 0; t <= 1; t += 0.04) {                                  // the trend segment through the chip
        const x = L.ax + t * (L.bx - L.ax), y = L.ay + t * (L.by - L.ay);
        if (x > r.x - 12 && x < r.x + r.w + 12 && y > r.y - 12 && y < r.y + r.h + 12) s += 130;
      }
      return s;
    };
    // a pool that keeps the best few distances of EVERY direction, so a second chip always has somewhere else to go
    const keep = labs.length <= 2 ? 3 : labs.length === 3 ? 2 : 1, pool: {r: Rect; s: number}[] = [];
    (lb.dir ? [DEG[lb.dir]] : DEGS).forEach((d, di) => {
      const row = [20, 40, 62, 86, 112, 140, 172, 208].map((g, gi) => { const r = cand(d, g); return {r, s: score(r, di * 3 + gi * 8)}; });
      pool.push(...row.sort((x, y) => x.s - y.s).slice(0, keep));
    });
    return pool.sort((x, y) => x.s - y.s);
  };
  const placed: Placed[] = React.useMemo(() => {          // the data never changes between frames, so the placement is computed once
    const pools = labs.map(candidates);
    let bestPick: number[] = pools.map(() => 0), bestTotal = Infinity;
    const pick: number[] = [];
    const search = (i: number, total: number) => {        // joint choice: labels are few and the pools short
      if (total >= bestTotal) return;
      if (i === pools.length) { bestTotal = total; bestPick = pick.slice(); return; }
      pools[i].forEach((o, k) => {
        let t = total + o.s;
        for (let j = 0; j < i; j++) if (touches(o.r, pools[j][pick[j]].r, 24)) t += 4000;       // two chips on top of each other is the worst outcome
        pick[i] = k; search(i + 1, t);
      });
    };
    if (pools.length <= 4) search(0, 0);
    return labs.map((lb, i) => {
      const rect = pools[i][bestPick[i]].r, a = nearestOnRect(rect, lb.pt.px, lb.pt.py);
      return {pt: lb.pt, idx: lb.idx, key: lb.key, valueKey: lb.valueKey, color: lb.color, dark: lb.dark, name: lb.name, values: lb.values, rect, w: lb.w, h: lb.h, ax: a.x, ay: a.y};
    });
  }, [xv, survey, trendOn, JSON.stringify(spec.label ?? null)]);      // eslint-disable-line react-hooks/exhaustive-deps
  const isLab = new Map<number, Placed>(placed.map((p) => [p.idx, p]));

  // ---- drawing -----------------------------------------------------------------------------------------------------------------
  const cardT = 0.92 + 0.08 * pop(f, 0, 170);
  const lineP = trendOn ? easeIO(f, lineAt, lineDone) : 0;
  const corrNeg = printed.value < 0;
  const sub = cr.sub ?? `${V.more}, ${corrNeg ? "fewer" : "more"} babies`;
  const cam = spec.camera ?? {fx: CARD.x + CARD.w / 2, fy: 540, s0: 1, s1: 1.015}, cs = cam.s0 + (cam.s1 - cam.s0) * easeIO(f, 0, Math.max(1, dur));
  const dotPopAt = (i: number) => {
    const lab = isLab.get(i), base = dotsAt + i * stag;
    return lab ? Math.max(0, Math.min(base, at(lab.key) - 8)) : base;       // a labelled dot is on screen before its key
  };
  const [cap1, ...capRest] = caption.split(/,\s*/), cap2 = capRest.join(", ");

  return <AbsoluteFill style={{background: C.sky, overflow: "hidden"}}>
    {/* backdrop: soft shapes so the sky never reads as dead space */}
    <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
      <circle cx={80} cy={1010} r={330} fill={C.sky2}/>
      <circle cx={1840} cy={90} r={260} fill={C.sky2}/>
      <circle cx={1500} cy={1010} r={170} fill={C.sky2}/>
      {[[1320, 960, 1], [150, 120, 1.2], [1000, 60, 0.8], [1760, 980, 1.1]].map(([cx, cy, s], i) =>
        <g key={i} transform={`translate(${cx} ${cy + Math.sin((f + i * 20) / 30) * 4}) scale(${s})`} stroke={C.royal} strokeWidth={7} strokeLinecap="round" opacity={0.16}><path d="M -14 0 H 14 M 0 -14 V 14"/></g>)}
    </svg>

    <div style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${cam.fx}px, ${cam.fy}px) scale(${cs}) translate(${-cam.fx}px, ${-cam.fy}px)`}}>
      {/* header: title pill + legend */}
      <div style={{position: "absolute", left: SAFE.x0 + 10, top: SAFE.y0 + 8, display: "flex", alignItems: "center", gap: 44}}>
        <Pill text={spec.title ?? V.title} f={f} at={2} dot={C.red} size={36}/>
        <div style={{display: "flex", alignItems: "center", gap: 14, fontFamily: SANS, fontWeight: 800, fontSize: 34, color: C.ink, opacity: ease(f, dotsAt, dotsAt + 8)}}>
          <svg width={36} height={36}><circle cx={18} cy={18} r={13} fill={C.blue} stroke={C.ink} strokeWidth={5}/></svg>one state or UT
        </div>
        {trendOn && <div style={{display: "flex", alignItems: "center", gap: 14, fontFamily: SANS, fontWeight: 800, fontSize: 34, color: C.ink, opacity: ease(f, lineAt, lineAt + 8)}}>
          <svg width={56} height={36}><line x1={4} y1={30} x2={52} y2={6} stroke={C.ink} strokeWidth={14} strokeLinecap="round"/><line x1={4} y1={30} x2={52} y2={6} stroke={C.red} strokeWidth={7} strokeLinecap="round"/></svg>trend
        </div>}
      </div>

      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        {/* the chart card: grid and axes scale in with it */}
        <g transform={`translate(${CARD.x + CARD.w / 2} ${CARD.y + CARD.h / 2}) scale(${cardT}) translate(${-CARD.x - CARD.w / 2} ${-CARD.y - CARD.h / 2})`}>
          <rect x={CARD.x} y={CARD.y + 12} width={CARD.w} height={CARD.h} rx={46} fill={C.ink}/>
          <rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx={46} fill={C.white} stroke={C.ink} strokeWidth={8}/>
          {dy.ticks.map((t) => <g key={`y${t}`}>
            <line x1={PL.x0} x2={PL.x1} y1={Y(t)} y2={Y(t)} stroke="#C9DAEE" strokeWidth={4} strokeDasharray="1 14" strokeLinecap="round"/>
            <line x1={PL.x0 - 12} x2={PL.x0} y1={Y(t)} y2={Y(t)} stroke={C.ink} strokeWidth={6} strokeLinecap="round"/>
            <text x={PL.x0 - 22} y={Y(t) + 12} textAnchor="end" fontFamily={SANS} fontWeight={800} fontSize={34} fill={C.ink}>{t.toFixed(dy.st < 1 ? 1 : 0)}</text>
          </g>)}
          {dx.ticks.map((t) => <g key={`x${t}`}>
            <line y1={PL.y0} y2={PL.y1} x1={X(t)} x2={X(t)} stroke="#C9DAEE" strokeWidth={4} strokeDasharray="1 14" strokeLinecap="round"/>
            <line y1={PL.y1} y2={PL.y1 + 12} x1={X(t)} x2={X(t)} stroke={C.ink} strokeWidth={6} strokeLinecap="round"/>
            <text x={X(t)} y={PL.y1 + 46} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={34} fill={C.ink}>{t.toFixed(dx.st < 1 ? 1 : 0)}%</text>
          </g>)}
          <line x1={PL.x0} x2={PL.x0} y1={PL.y0 - 12} y2={PL.y1} stroke={C.ink} strokeWidth={8} strokeLinecap="round"/>
          <line x1={PL.x0} x2={PL.x1 + 12} y1={PL.y1} y2={PL.y1} stroke={C.ink} strokeWidth={8} strokeLinecap="round"/>
          <text x={(PL.x0 + PL.x1) / 2} y={PL.y1 + 100} textAnchor="middle" fontFamily={ROUND} fontWeight={800} fontSize={38} fill={C.royalDark}>{spec.xTitle ?? V.xTitle}</text>
          <text transform={`translate(${CARD.x + 44} ${(PL.y0 + PL.y1) / 2}) rotate(-90)`} textAnchor="middle" fontFamily={ROUND} fontWeight={800} fontSize={38} fill={C.royalDark}>{spec.yTitle ?? "Children per woman"}</text>
        </g>

        {/* trend line (under the dots), drawn on after the dots have landed */}
        {lineP > 0.002 && <g>
          <line x1={L.ax} y1={L.ay} x2={L.bx} y2={L.by} stroke={C.ink} strokeWidth={20} strokeLinecap="round" strokeDasharray={lineLen} strokeDashoffset={lineLen * (1 - lineP)}/>
          <line x1={L.ax} y1={L.ay} x2={L.bx} y2={L.by} stroke={C.red} strokeWidth={10} strokeLinecap="round" strokeDasharray={lineLen} strokeDashoffset={lineLen * (1 - lineP)}/>
        </g>}

        {/* leader lines */}
        {placed.map((p) => {
          const t = pop(f, at(p.key) + 2, 200);
          return t > 0.01 ? <line key={p.name} x1={p.pt.px} y1={p.pt.py} x2={p.pt.px + (p.ax - p.pt.px) * Math.min(1, t)} y2={p.pt.py + (p.ay - p.pt.py) * Math.min(1, t)} stroke={C.ink} strokeWidth={6} strokeLinecap="round"/> : null;
        })}

        {/* dots */}
        {pts.map((p, i) => {
          const lab = isLab.get(i), t = pop(f, dotPopAt(i), 230);
          if (t <= 0.001) return null;
          const k = lab ? at(lab.key) : 0, emph = lab ? pop(f, k, 210) : 0, on = !!lab && f >= k;
          const r = R_DOT + (R_BIG - R_DOT) * emph, bob = Math.sin((f + i * 9) / 17) * (lab ? 2.4 : 1.6);
          const drop = (1 - Math.min(1, t)) * -34, blink = (f + i * 13) % 96 < 3 ? 0.12 : 1;
          return <g key={p.state} transform={`translate(${p.px} ${p.py + bob + drop}) scale(${Math.min(t, 1.25)})`}>
            {on && f - k < 16 && <circle r={r + 6 + (f - k) * 3.2} fill="none" stroke={lab!.color} strokeWidth={7} opacity={1 - (f - k) / 16}/>}
            <circle r={r} fill={on ? lab!.color : C.blue} stroke={C.ink} strokeWidth={lab ? 7 : 5}/>
            <ellipse cx={-r * 0.34} cy={-r * 0.4} rx={r * 0.26} ry={r * 0.16} transform={`rotate(-35 ${-r * 0.34} ${-r * 0.4})`} fill={C.white} opacity={0.6}/>
            {lab && emph > 0.3 && <g>
              <ellipse cx={-r * 0.3} cy={r * 0.02} rx={r * 0.1} ry={r * 0.13 * blink} fill={C.ink}/>
              <ellipse cx={r * 0.3} cy={r * 0.02} rx={r * 0.1} ry={r * 0.13 * blink} fill={C.ink}/>
              <path d={`M ${-r * 0.3} ${r * 0.34} Q 0 ${r * 0.66} ${r * 0.3} ${r * 0.34}`} fill="none" stroke={C.ink} strokeWidth={r * 0.1} strokeLinecap="round"/>
            </g>}
          </g>;
        })}

        {/* callout chips: the name from the key, the values from the value key */}
        {placed.map((p) => {
          const t = pop(f, at(p.key) + 2, 190);
          if (t <= 0.01) return null;
          const vOn = f >= at(p.valueKey);
          return <g key={p.name} transform={`translate(${p.ax} ${p.ay}) scale(${Math.min(t, 1.2)}) translate(${-p.ax} ${-p.ay})`}>
            <rect x={p.rect.x} y={p.rect.y + 8} width={p.w} height={p.h} rx={26} fill={C.ink}/>
            <rect x={p.rect.x} y={p.rect.y} width={p.w} height={p.h} rx={26} fill={C.white} stroke={C.ink} strokeWidth={6}/>
            <text x={p.rect.x + p.w / 2} y={p.rect.y + 54} textAnchor="middle" fontFamily={ROUND} fontWeight={800} fontSize={46} fill={p.dark}>{p.name}</text>
            {vOn && <text x={p.rect.x + p.w / 2} y={p.rect.y + 105} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={38} fill={C.ink} style={{whiteSpace: "pre"}}>{p.values}</text>}
          </g>;
        })}
      </svg>

      {spec.source && <div style={{position: "absolute", left: SAFE.x0 + 28, top: CARD.y + CARD.h + 24, width: CARD.w - 40, fontFamily: SANS, fontWeight: 700, fontSize: 26, lineHeight: 1.2, color: C.ink, opacity: 0.85 * ease(f, 8, 16)}}>{spec.source}</div>}
      {/* right column: correlation, previous survey, caption */}
      <div style={{position: "absolute", left: COL.x, top: COL.y, width: COL.w, height: COL.h, display: "flex", flexDirection: "column", alignItems: "center", gap: 24}}>
        {f >= shellAt && <div style={{transform: `scale(${pop(f, shellAt)}) rotate(-1.5deg)`, transformOrigin: "50% 30%", background: C.white, border: `8px solid ${C.ink}`, borderRadius: 44, boxShadow: `0 12px 0 ${C.ink}`,
          padding: "14px 28px 16px", width: COL.w - 20, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center"}}>
          <div style={{display: "flex", alignItems: "center", gap: 14, fontFamily: SANS, fontWeight: 900, fontSize: 36, letterSpacing: 2, color: C.ink}}>
            <svg width={54} height={54} viewBox="-30 -30 60 60"><circle r={25} fill={C.yellow} stroke={C.ink} strokeWidth={5}/>
              <g transform={`rotate(${f >= corrAt ? (corrNeg ? 45 : -45) : 0})`} stroke={C.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none"><path d="M -13 0 H 13 M 3 -10 L 13 0 L 3 10"/></g></svg>
            CORRELATION
          </div>
          {f >= corrAt ? <>
            <Inked accent={{kind: "underline", color: C.red, seed: 4}} f={f} at={corrAt + 8}>
              <span style={{display: "inline-block", padding: "0 6px 6px", transform: `scale(${0.6 + 0.4 * Math.min(1.12, pop(f, corrAt, 200))})`, transformOrigin: "50% 70%"}}>
                <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: 138, lineHeight: 1.05, color: C.royal, letterSpacing: -2, whiteSpace: "nowrap"}}>{signed(printed.value, printed.text)}</div></span>
            </Inked>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, lineHeight: 1.15, color: C.ink, textAlign: "center", marginTop: 8, opacity: ease(f, corrAt + 6, corrAt + 14)}}>{sub}</div>
          </> : <>
            <span style={{display: "inline-block", padding: "0 6px 6px", transform: `translateY(${Math.sin(f / 9) * 5}px) rotate(${Math.sin(f / 13) * 4}deg)`}}>
              <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: 138, lineHeight: 1.05, color: C.royal, opacity: 0.28, whiteSpace: "nowrap"}}>?</div></span>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, lineHeight: 1.15, marginTop: 8, color: C.ink, textAlign: "center", opacity: 0.55}}>{V.teaser}</div>
          </>}
        </div>}
        {prev && spec.prev && f >= prevAt && <div style={{transform: `scale(${pop(f, prevAt)}) rotate(1.5deg)`, transformOrigin: "50% 30%", background: C.white, border: `7px solid ${C.ink}`, borderRadius: 36, boxShadow: `0 10px 0 ${C.ink}`,
          padding: "8px 26px 10px", width: COL.w - 60, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14}}>
          <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 34, lineHeight: 1.1, color: C.ink, letterSpacing: 1}}>{spec.prev.label ?? "NFHS-5"}<br/><span style={{fontWeight: 800, opacity: 0.7, letterSpacing: 0}}>before</span></div>
          <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: 92, lineHeight: 1.05, color: C.blueDark, letterSpacing: -1, whiteSpace: "nowrap"}}>{signed(prev.value, prev.text)}</div>
        </div>}
        <div style={{flex: 1}}/>
        {f >= noteAt && <div style={{transform: `scale(${pop(f, noteAt, 180)}) rotate(-2.5deg)`, transformOrigin: "50% 100%", background: C.yellow, border: `8px solid ${C.ink}`, borderRadius: 36, boxShadow: `0 10px 0 ${C.ink}`,
          padding: "10px 26px 16px", width: COL.w - 20, boxSizing: "border-box", textAlign: "center", fontFamily: ROUND, fontWeight: 800, fontSize: 62, lineHeight: 1.02, color: C.ink, letterSpacing: -1}}>
          {cap1}{cap2 ? "," : ""}<br/>
          {cap2 && <Inked accent={{kind: "underline", color: C.red, seed: 6}} f={f} at={noteAt + 8}><span>{cap2}</span></Inked>}
        </div>}
      </div>
    </div>
  </AbsoluteFill>;
};
