// Scene kind "tfr-line" (CONTRACT section 3): a flat line chart of the total fertility rate across the NFHS surveys with the 2.1 replacement line
// across it. 1920 x 1080, pilot cartoon style. Every plotted value is read with fig() (a missing figure throws); the only typed number is the
// definitional constant 2.1, taken from spec.line.const. No axis numbers are drawn: the numbers on screen are the badges (fig) and the 2.1 tile.
// Spec: {points: [{survey: "nfhs3".."nfhs6", state?: "India", key}], line: {const: 2.1, key, label?: "replacement level"},
//        years?: {nfhs3?: "2005-06", ...}, cross?: key, crossNote?: string | false, title?: string, decimals?: number = 1, camera?, notes?}
// A survey with no verified figure is simply left out of `points` (the x axis then has fewer slots); the points are drawn in survey order.
// Digits: a point's value shows from at(point.key), the 2.1 tile from at(line.key); the hand-drawn circle from at(cross) (never earlier than the
// crossing is on screen). Survey names and year labels are text labels and show from the start.
import React from "react";
import {AbsoluteFill} from "remotion";
import {C} from "../../palette";
import {Pill, ROUND, SANS, ease, easeIO, pop} from "../../ui";
import {EditorMark, markSeed} from "../../../shared/Marks";
import {SAFE, type SceneProps} from "../contract";
import {fig} from "../figs";

type PointIn = {survey: string; state?: string; key: string};
export type TfrLineSpec = {
  points: PointIn[];
  line: {const: number; key: string; label?: string};
  years?: Record<string, string>;
  cross?: string; crossNote?: string | false;
  title?: string; decimals?: number;
  camera?: {fx: number; fy: number; s0: number; s1: number};
  notes?: string;
};

const YEARS: Record<string, string> = {nfhs3: "2005-06", nfhs4: "2015-16", nfhs5: "2019-21", nfhs6: "2023-24"};
const CARD = {x: 96, y: 172, w: 1728, h: 728};
const PL = 250, PR = 1440, PT = 290, PB = 736;
const TILE_X = 1652, TILE_W = 290;

const surveyNo = (s: string) => {
  const m = /^nfhs(\d)$/.exec(s);
  if (!m) throw new Error(`tfr-line: survey must be "nfhs3".."nfhs6" (got ${JSON.stringify(s)})`);
  return Number(m[1]);
};

type Anchor = "center" | "bottom" | "top";
const NumBadge: React.FC<{text: string; f: number; at: number; x: number; y: number; size: number; color: string; caption?: string; rot?: number; width?: number; anchor?: Anchor}> =
  ({text, f, at, x, y, size, color, caption, rot = -2, width, anchor = "center"}) => {
  const t = pop(f, at);
  if (t <= 0.001) return null;
  const fl = Math.sin((f - at) / 11 + x) * 3;
  const ty = anchor === "bottom" ? "-100%" : anchor === "top" ? "0%" : "-50%";
  return <div style={{position: "absolute", left: x, top: y + fl, transform: `translate(-50%, ${ty}) scale(${t}) rotate(${rot}deg)`, transformOrigin: anchor === "bottom" ? "50% 100%" : anchor === "top" ? "50% 0%" : "50% 60%",
    display: "flex", flexDirection: "column", alignItems: "center", background: C.white, borderRadius: 40, padding: `12px 30px ${caption ? 16 : 8}px`, width,
    border: `8px solid ${C.ink}`, boxShadow: `0 10px 0 ${C.ink}`}}>
    <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: size, lineHeight: 1, color, letterSpacing: -2, whiteSpace: "nowrap", fontFeatureSettings: "'lnum' 1"}}>{text}</div>
    {caption && <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 32, lineHeight: 1.12, color: C.ink, marginTop: 8, textAlign: "center"}}>{caption}</div>}
  </div>;
};

export const Scene: React.FC<SceneProps<TfrLineSpec>> = ({f, dur, spec, at}) => {
  if (!spec || !Array.isArray(spec.points) || spec.points.length === 0) throw new Error("tfr-line: spec.points must list at least one survey");
  const L = spec.line;
  if (!L || typeof L.const !== "number" || !Number.isFinite(L.const) || typeof L.key !== "string" || !L.key) throw new Error(`tfr-line: spec.line must be {const: number, key: string} (got ${JSON.stringify(L)})`);
  const dec = spec.decimals ?? 1;
  const seen = new Set<string>();
  const pts = spec.points.map((p) => {
    if (!p || typeof p.key !== "string" || !p.key) throw new Error(`tfr-line: every point needs a key (got ${JSON.stringify(p)})`);
    if (seen.has(p.survey)) throw new Error(`tfr-line: survey ${p.survey} listed twice`);
    seen.add(p.survey);
    const state = p.state ?? "India", fg = fig({t: "tfr", state, s: p.survey}, dec);   // throws if the figure is missing
    return {survey: p.survey, no: surveyNo(p.survey), state, key: p.key, val: fg.value, text: fg.text, t: at(p.key)};
  }).sort((a, b) => a.no - b.no);
  const n = pts.length, tL = at(L.key);
  const years = {...YEARS, ...(spec.years ?? {})};
  const cam = spec.camera ?? {fx: 960, fy: 540, s0: 1, s1: 1.03};
  const sc = cam.s0 + (cam.s1 - cam.s0) * easeIO(f, 0, Math.max(1, dur));

  // vertical scale: a fixed pixels-per-unit (capped, so small differences are not blown up), centred, with room for a badge above the highest dot
  // (if any dot is above the line) and below the lowest dot (if any is below it)
  const vmin = Math.min(L.const, ...pts.map((p) => p.val)), vmax = Math.max(L.const, ...pts.map((p) => p.val));
  const yTop = pts.some((p) => p.val > L.const) ? CARD.y + 20 + 168 : PT + 20, yBot = pts.some((p) => p.val <= L.const) ? PB - 186 : PB - 40;
  const k = Math.min(400, (yBot - yTop) / Math.max(vmax - vmin, 0.01)), vmid = (vmin + vmax) / 2;
  const yOf = (v: number) => (yTop + yBot) / 2 - (v - vmid) * k;
  const slotW = (PR - PL) / n, xOf = (i: number) => PL + slotW * (i + 0.5);
  const yL = yOf(L.const);
  const P = pts.map((p, i) => ({...p, x: xOf(i), y: yOf(p.val), above: p.val > L.const}));
  const colOf = (above: boolean) => (above ? {fill: C.orange, dark: C.orangeDark} : {fill: C.blue, dark: C.blueDark});

  // where the data line crosses the replacement line (first crossing)
  let crossAt: {x: number; y: number; down: boolean; tReady: number} | null = null;
  for (let i = 0; i + 1 < P.length && !crossAt; i++) {
    const a = P[i], b = P[i + 1];
    if ((a.val > L.const && b.val <= L.const) || (a.val <= L.const && b.val > L.const)) {
      const u = (a.val - L.const) / (a.val - b.val);
      crossAt = {x: a.x + (b.x - a.x) * u, y: yL, down: a.val > b.val, tReady: b.t + 16};
    }
  }
  if (spec.cross !== undefined && !crossAt) throw new Error("tfr-line: spec.cross is set but the plotted values never cross the replacement line");
  const tC = spec.cross !== undefined && crossAt ? Math.max(at(spec.cross), crossAt.tReady, tL + 16) : Infinity;

  const lp = ease(f, tL, tL + 26), dash = -f * 1.6;
  const lineX2 = 130 + (TILE_X - 130) * lp;
  const state0 = P.every((p) => p.state === P[0].state) ? P[0].state : "";
  const title = (spec.title ?? `${state0 ? state0 + " · " : ""}children per woman`).toUpperCase();
  const noteText = spec.crossNote === false ? "" : (spec.crossNote ?? (crossAt ? (crossAt.down ? "crosses below the line" : "crosses above the line") : ""));
  const seg = (i: number) => { const a = P[i - 1], b = P[i], g = ease(f, b.t, b.t + 14); return {x1: a.x, y1: a.y, x2: a.x + (b.x - a.x) * g, y2: a.y + (b.y - a.y) * g, k: g}; };

  return <AbsoluteFill style={{background: C.sky, overflow: "hidden"}}>
    <div style={{position: "absolute", inset: 0, transformOrigin: `${cam.fx}px ${cam.fy}px`, transform: `scale(${sc})`}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute", left: 0, top: 0}}>
        <rect width={1920} height={1080} fill={C.sky}/>
        <rect x={CARD.x} y={CARD.y + 12} width={CARD.w} height={CARD.h} rx={46} fill={C.ink}/>
        <rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx={46} fill={C.white} stroke={C.ink} strokeWidth={8}/>
        {/* above / below tint, from the line's key */}
        {lp > 0.001 && <g opacity={lp}>
          <rect x={130} y={CARD.y + 24} width={TILE_X - 130 - TILE_W / 2 - 20} height={Math.max(0, yL - CARD.y - 24)} rx={18} fill={C.orange} opacity={0.1}/>
          <rect x={130} y={yL} width={TILE_X - 130 - TILE_W / 2 - 20} height={Math.max(0, PB + 6 - yL)} rx={18} fill={C.blue} opacity={0.08}/>
        </g>}
        {/* survey guides and the baseline */}
        {P.map((p) => <line key={p.survey} x1={p.x} y1={CARD.y + 56} x2={p.x} y2={PB + 6} stroke={C.ink} strokeOpacity={0.16} strokeWidth={6} strokeDasharray="4 22" strokeLinecap="round"/>)}
        <line x1={130} y1={PB + 6} x2={PR + 70} y2={PB + 6} stroke={C.ink} strokeWidth={8} strokeLinecap="round"/>
        {/* the replacement line, drawn across the plot to its tile */}
        {lp > 0.001 && <g>
          <line x1={130} y1={yL} x2={lineX2} y2={yL} stroke={C.ink} strokeWidth={22} strokeLinecap="round" strokeDasharray="30 30" strokeDashoffset={dash}/>
          <line x1={130} y1={yL} x2={lineX2} y2={yL} stroke={C.red} strokeWidth={10} strokeLinecap="round" strokeDasharray="30 30" strokeDashoffset={dash}/>
        </g>}
        {/* the data line grows to each point on its key */}
        {P.slice(1).map((_, i) => { const s = seg(i + 1); return s.k > 0.001 && <line key={`o${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={C.ink} strokeWidth={24} strokeLinecap="round"/>; })}
        {P.slice(1).map((_, i) => { const s = seg(i + 1); return s.k > 0.001 && <line key={`c${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={C.royal} strokeWidth={12} strokeLinecap="round"/>; })}
        {P.map((p) => {
          const t = pop(f, p.t), c = colOf(p.above), ring = ease(f, p.t, p.t + 16);
          if (t <= 0.001) return null;
          return <g key={p.survey}>
            {ring < 0.999 && <circle cx={p.x} cy={p.y} r={26 + 50 * ring} fill="none" stroke={c.fill} strokeWidth={8} opacity={1 - ring}/>}
            <g transform={`translate(${p.x} ${p.y}) scale(${t * (1 + 0.05 * Math.sin((f - p.t) / 9))})`}><circle r={25} fill={c.fill} stroke={C.ink} strokeWidth={8}/><circle cx={-7} cy={-8} r={6} fill={C.white} opacity={0.7}/></g>
          </g>;
        })}
      </svg>

      {/* survey names and years (labels, shown from the start) */}
      {P.map((p, i) => { const t = pop(f, 4 + i * 4, 220); return t > 0.001 && <div key={p.survey} style={{position: "absolute", left: p.x, top: PB + 56, transform: `translate(-50%, 0) scale(${t})`, textAlign: "center", whiteSpace: "nowrap"}}>
        <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: 44, lineHeight: 1.05, color: C.ink}}>{`NFHS-${p.no}`}</div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, lineHeight: 1.2, color: C.ink, opacity: 0.75}}>{years[p.survey] ?? ""}</div>
      </div>; })}

      <div style={{position: "absolute", left: SAFE.x0, top: SAFE.y0 - 4}}><Pill text={title} f={f} at={2} dot={C.red} size={34}/></div>

      {/* the numbers: each badge on its point's key */}
      {P.map((p) => { const c = colOf(p.above); return <NumBadge key={p.survey} text={p.text} f={f} at={p.t + 2} x={p.x} y={p.above ? p.y - 42 : p.y + 42} size={80} color={c.dark} anchor={p.above ? "bottom" : "top"} rot={p.above ? -2 : 2}/>; })}
      <NumBadge text={L.const.toFixed(dec)} f={f} at={tL} x={TILE_X} y={yL} size={100} color={C.red} caption={L.label ?? "replacement level"} width={TILE_W} rot={2}/>

      {/* hand-drawn circle on the crossing, and a short note */}
      {crossAt && f >= tC && <>
        <div style={{position: "absolute", left: crossAt.x - 78, top: crossAt.y - 48}}>
          <EditorMark kind="circle" at={tC} dur={14} seed={markSeed(1700, Math.floor(f / 3) % 4)} color={C.red} strokeWidth={8} padding={14}><div style={{width: 156, height: 96}}/></EditorMark>
        </div>
        {noteText && <div style={{position: "absolute", left: crossAt.x + 90, top: crossAt.y - 134, transform: `scale(${pop(f, tC + 8, 220)})`, transformOrigin: "0% 100%", background: C.ink, color: C.white, borderRadius: 999, padding: "8px 26px",
          fontFamily: SANS, fontWeight: 900, fontSize: 32, letterSpacing: 2, whiteSpace: "nowrap"}}>{noteText.toUpperCase()}</div>}
      </>}
    </div>
  </AbsoluteFill>;
};
