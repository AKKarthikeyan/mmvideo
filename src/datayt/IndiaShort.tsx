// Data YT "Guess the State" Short (1080x1920): India state map, quiz, zoom reveal, colour fill, top-5 bars, loop.
// Data and score per Short: public/datayt/shorts/<id>/ (scripts/datayt/build_india_shorts.py). Map: public/datayt/india/geo.json.
import React from "react";
import {AbsoluteFill, Audio, Easing, interpolate, spring, staticFile, useCurrentFrame} from "remotion";
import {COND, VoxFonts} from "../voxkit";
import geo from "../../public/datayt/india/geo.json";

// Data YT palette (dark, phone-first): navy ground, gold highlight, cyan accent, plasma-like bands
// Data Kadai palette, taken from AK's reference map (warm, light): off-white ground, cream -> maroon bands,
// maroon as the brand accent (answer, highlights) and amber as the second accent (chips, timer).
export const P = {bg: "#F7F4EE", bg2: "#FFFFFF", ink: "#1F1A17", mute: "#7A6F66", line: "#B9A898", empty: "#E7DFD3",
  gold: "#7A2340", cyan: "#C9822F", good: "#2F8F5B", bad: "#B3584D"};
const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";

export type ShortData = {id: string; series: string; ind: number; label: string; unit: string; hook: string[]; q: string;
  answer: string; answerName: string; options: string[]; optionKeys: string[]; answerIndex: number; value: number;
  india: number; india5: number; values: Record<string, number>; band: Record<string, number>; bands: string[];
  bandLabels: string[]; palette?: string; paletteName?: string; accent?: string; accent2?: string; top: {name: string; key: string; v: number}[]; other: {name: string; v: number}; side: string;
  statesOnly: boolean; t: Record<string, [number, number]>; total: number; fillAt: Record<string, number>; fps: number; source: string};

type G = {name: string; d: string; lx: number; ly: number; r: number; bbox: number[]};
const STATES = geo.states as G[];
const FPS = 30;
const F = (s: number) => Math.round(s * FPS);
const BEAT = 60 / 124;
const ease = (f: number, a: number, b: number, from = 0, to = 1, e = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e});
const fmt = (v: number, unit: string) => `${v.toFixed(1)}${unit}`;
const hexMix = (a: string, b: string, p: number) => {
  const h = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16);
  return "#" + [0, 1, 2].map((i) => Math.round(h(a, i) + (h(b, i) - h(a, i)) * p).toString(16).padStart(2, "0")).join("");
};

// map box on the 1080x1920 frame (kept clear of the Shorts UI: right rail and bottom caption)
const MB = {x: 70, y: 470, w: 860};
const MS = MB.w / geo.w;

const Hook: React.FC<{lines: string[]; at: number; size?: number; acc?: string}> = ({lines, at, size = 86, acc = P.gold}) => {
  const f = useCurrentFrame();
  return <div style={{position: "absolute", left: 60, top: 190, width: 900}}>
    {lines.map((l, i) => {
      const p = ease(f, at + i * 4, at + i * 4 + 8);
      return <div key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: size, lineHeight: 1.08, color: P.ink,
        opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
        {l.split(/(\*[^*]+\*)/).map((s, j) => s.startsWith("*") ? <span key={j} style={{color: acc}}>{s.slice(1, -1)}</span> : <span key={j}>{s}</span>)}
      </div>;
    })}
  </div>;
};

const IndiaMap: React.FC<{D: ShortData}> = ({D}) => {
  const f = useCurrentFrame();
  const T = D.t;
  const fill0 = F(T.fill[0]), rev0 = F(T.reveal[0]), top0 = F(T.top[0]), end0 = F(T.end[0]);
  const ans = STATES.find((s) => s.name === D.answer)!;
  // zoom: in on the answer during the reveal, back out for the fill
  const [x0, y0, x1, y1] = ans.bbox;
  const zs = Math.min(3.2, 420 / Math.max(x1 - x0, y1 - y0, 60));
  const zin = ease(f, rev0, rev0 + 14, 0, 1, Easing.inOut(Easing.cubic)) * ease(f, fill0 - 6, fill0 + 10, 1, 0, Easing.inOut(Easing.cubic));
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const s = 1 + (zs - 1) * zin;
  const tx = (geo.w / 2 - cx) * zin * 0.9, ty = (geo.h * 0.42 - cy) * zin * 0.9;
  const draw = ease(f, 2, 26);
  const dim = ease(f, top0, top0 + 10, 1, 0.22) * (f >= end0 ? ease(f, end0, end0 + 10, 1, 0.6) : 1);
  const pulse = 0.5 + 0.5 * Math.sin((f / FPS) * Math.PI * 2 / BEAT);
  return <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <g opacity={dim} transform={`translate(${MB.x},${MB.y}) scale(${MS}) translate(${geo.w / 2},${geo.h / 2}) scale(${s}) translate(${-geo.w / 2 + tx},${-geo.h / 2 + ty})`}>
      {STATES.map((g) => {
        const v = D.values[g.name];
        const has = v !== undefined;
        const isAns = g.name === D.answer;
        const at = has ? F(D.fillAt[g.name]) : fill0;
        const fp = has ? ease(f, at, at + 6) : 0;
        const col = has ? hexMix(P.empty, D.bands[D.band[g.name]], fp) : P.empty;
        const revealed = f >= rev0;
        const ansCol = revealed && f < fill0 ? hexMix(P.empty, (D.accent ?? P.gold), ease(f, rev0, rev0 + 8)) : col;
        const pop = spring({frame: f - at, fps: FPS, config: {damping: 11, stiffness: 200}, durationInFrames: 10});
        const sc = has && f >= at && f < at + 12 ? 1 + 0.08 * Math.sin(pop * Math.PI) : 1;
        return <g key={g.name} transform={`translate(${g.lx},${g.ly}) scale(${sc}) translate(${-g.lx},${-g.ly})`}>
          <path d={g.d} fillRule="evenodd" fill={isAns ? ansCol : col} stroke={isAns && revealed ? (D.accent ?? P.gold) : P.line}
                strokeWidth={(isAns && revealed ? 2.4 : 1) / Math.max(1, s * 0.7)} strokeLinejoin="round"
                pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw}
                filter={isAns && revealed && f < fill0 ? "url(#glow)" : undefined}/>
        </g>;
      })}
      {/* question mark pin on the hidden answer during the quiz */}
      {f >= F(T.quiz[0]) && f < rev0 && <g transform={`translate(${ans.lx},${ans.ly})`} opacity={0.6 + 0.4 * pulse}>
        <circle r={22} fill={(D.accent2 ?? P.cyan)} opacity={0.25}/><circle r={12} fill={(D.accent2 ?? P.cyan)}/>
        <text y={7} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={20} fill={P.bg}>?</text></g>}
    </g>
  </svg>;
};

const Quiz: React.FC<{D: ShortData}> = ({D}) => {
  const f = useCurrentFrame();
  const q0 = F(D.t.quiz[0]), rev0 = F(D.t.reveal[0]), fill0 = F(D.t.fill[0]);
  if (f < q0 || f >= fill0) return null;
  const out = ease(f, fill0 - 8, fill0, 1, 0);
  const n = Math.max(1, 3 - Math.floor((f - q0 - F(BEAT * 4)) / F(BEAT)));
  const timerOn = f >= q0 + F(BEAT * 4) && f < rev0;
  return <div style={{position: "absolute", left: 60, top: 1130, width: 880, opacity: out}}>
    {D.options.map((o, i) => {
      const p = ease(f, q0 + i * F(BEAT), q0 + i * F(BEAT) + 7);
      const right = f >= rev0 && i === D.answerIndex, wrong = f >= rev0 && i !== D.answerIndex;
      return <div key={o} style={{display: "flex", alignItems: "center", gap: 22, height: 96, marginBottom: 16, padding: "0 28px",
        borderRadius: 18, background: right ? P.good : P.bg2, border: `3px solid ${right ? P.good : P.line}`,
        opacity: p * (wrong ? 0.35 : 1), transform: `translateX(${(1 - p) * -60}px) scale(${right ? 1.03 : 1})`}}>
        <div style={{width: 54, height: 54, borderRadius: 27, background: right ? P.bg : (D.accent2 ?? P.cyan), color: right ? P.good : P.bg,
          fontFamily: COND, fontWeight: 700, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center"}}>{"ABC"[i]}</div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 46, color: right ? P.bg : P.ink}}>{o}</div>
      </div>;
    })}
    {timerOn && <div style={{position: "absolute", right: 0, top: -620, width: 170, height: 170, borderRadius: 85,
      border: `8px solid ${(D.accent2 ?? P.cyan)}`, display: "flex", alignItems: "center", justifyContent: "center", background: P.bg + "cc",
      fontFamily: COND, fontWeight: 700, fontSize: 110, color: P.ink,
      transform: `scale(${1 + 0.12 * (1 - ((f - q0 - F(BEAT * 4)) % F(BEAT)) / F(BEAT))})`}}>{n}</div>}
  </div>;
};

const Reveal: React.FC<{D: ShortData}> = ({D}) => {
  const f = useCurrentFrame();
  const r0 = F(D.t.reveal[0]), fill0 = F(D.t.fill[0]);
  if (f < r0 || f >= fill0 + F(BEAT * 6)) return null;
  const p = ease(f, r0 + 4, r0 + 26);
  const out = ease(f, fill0 + F(BEAT * 5), fill0 + F(BEAT * 6), 1, 0);
  return <div style={{position: "absolute", left: 60, top: 190, width: 900, opacity: out}}>
    <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: (D.accent2 ?? P.cyan), opacity: ease(f, r0, r0 + 6)}}>IT'S</div>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: 112, lineHeight: 1, color: (D.accent ?? P.gold),
      transform: `scale(${ease(f, r0, r0 + 8, 0.7, 1)})`, transformOrigin: "left center"}}>{D.answerName.toUpperCase()}</div>
    <div style={{display: "flex", alignItems: "baseline", gap: 24, marginTop: 8}}>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 132, color: P.ink}}>{fmt(D.value * p, D.unit)}</div>
      <div style={{fontFamily: SANS, fontSize: 34, color: P.mute}}>India: {fmt(D.india, D.unit)}</div>
    </div>
    <div style={{fontFamily: SANS, fontSize: 32, color: P.ink, opacity: 0.85}}>{D.label}</div>
  </div>;
};

const Legend: React.FC<{D: ShortData}> = ({D}) => {
  const f = useCurrentFrame();
  const fill0 = F(D.t.fill[0]), top0 = F(D.t.top[0]);
  if (f < fill0 || f >= top0) return null;
  const op = ease(f, fill0, fill0 + 10) * ease(f, top0 - 6, top0, 1, 0);
  return <div style={{position: "absolute", left: 60, top: 1440, width: 880, opacity: op}}>
    <div style={{fontFamily: SANS, fontSize: 28, color: P.mute, marginBottom: 10}}>Every state · {D.label}</div>
    <div style={{display: "flex", gap: 8}}>
      {D.bands.map((c, i) => <div key={i} style={{flex: 1}}>
        <div style={{height: 18, borderRadius: 4, background: c}}/>
        <div style={{fontFamily: SANS, fontSize: 21, color: P.mute, marginTop: 6, whiteSpace: "nowrap"}}>{D.bandLabels[i]}</div>
      </div>)}
    </div>
  </div>;
};

const Top5: React.FC<{D: ShortData}> = ({D}) => {
  const f = useCurrentFrame();
  const t0 = F(D.t.top[0]), e0 = F(D.t.end[0]);
  if (f < t0 || f >= e0) return null;
  const out = ease(f, e0 - 6, e0, 1, 0);
  const max = Math.max(...D.top.map((x) => x.v), D.india) / 0.74;   // leave room for the value after the bar
  const rows = [...D.top.map((x, i) => ({...x, rank: `${i + 1}`})), {name: "India", key: "India", v: D.india, rank: "—"}];
  return <div style={{position: "absolute", left: 60, top: 560, width: 880, opacity: out}}>
    <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: (D.accent2 ?? P.cyan)}}>{D.side === "top" ? "TOP 5" : "LOWEST 5"}{D.statesOnly ? " STATES" : ""}</div>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: 64, color: P.ink, marginBottom: 30, lineHeight: 1.05}}>{D.label}</div>
    {rows.map((r, i) => {
      const a = t0 + F(BEAT) * (i + 1) - 6;
      const p = ease(f, a, a + 12);
      const isA = r.key === D.answer, isI = r.key === "India";
      return <div key={r.key} style={{display: "flex", alignItems: "center", gap: 18, height: 88, marginBottom: 12, opacity: ease(f, a, a + 5)}}>
        <div style={{width: 46, fontFamily: COND, fontWeight: 700, fontSize: 44, color: isA ? (D.accent ?? P.gold) : P.mute}}>{r.rank}</div>
        <div style={{width: 300, fontFamily: SANS, fontWeight: 700, fontSize: r.name.length > 14 ? 30 : 36, color: isA ? (D.accent ?? P.gold) : P.ink, lineHeight: 1.05}}>{r.name}</div>
        <div style={{flex: 1, position: "relative", height: 64}}>
          <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${(r.v / max) * 100 * p}%`, borderRadius: 12,
            background: isA ? (D.accent ?? P.gold) : isI ? P.line : D.bands[3], minWidth: 8}}/>
          <div style={{position: "absolute", left: `calc(${(r.v / max) * 100 * p}% + 14px)`, top: "50%", transform: "translateY(-50%)",
            fontFamily: COND, fontWeight: 700, fontSize: 44, color: isA ? (D.accent ?? P.gold) : P.ink}}>{fmt(r.v * p, D.unit)}</div>
        </div>
      </div>;
    })}
  </div>;
};

const End: React.FC<{D: ShortData}> = ({D}) => {
  const f = useCurrentFrame();
  const e0 = F(D.t.end[0]);
  if (f < e0) return null;
  const p = ease(f, e0, e0 + 10);
  return <div style={{position: "absolute", left: 60, top: 640, width: 880, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: 96, lineHeight: 1.05, color: P.ink}}>Where does <span style={{color: (D.accent ?? P.gold)}}>your</span> state rank?</div>
    <div style={{fontFamily: SANS, fontSize: 40, color: (D.accent2 ?? P.cyan), marginTop: 26}}>Comment it below ↓</div>
    <div style={{fontFamily: SANS, fontSize: 30, color: P.mute, marginTop: 40, opacity: ease(f, e0 + 12, e0 + 20)}}>Follow for the next state</div>
  </div>;
};

const Chrome: React.FC<{D: ShortData}> = ({D}) => {
  const f = useCurrentFrame();
  const total = F(D.total);
  return <>
    <div style={{position: "absolute", left: 60, top: 110, display: "flex", gap: 14, alignItems: "center"}}>
      <div style={{background: (D.accent2 ?? P.cyan), color: P.bg, fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: 3, padding: "8px 16px", borderRadius: 8}}>{D.series.toUpperCase()}</div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 26, color: P.mute}}>NFHS-6 · 2023-24</div>
    </div>
    <div style={{position: "absolute", left: 60, top: 1620, width: 880, fontFamily: SANS, fontSize: 22, color: P.mute, opacity: 0.8}}>Source: {D.source}</div>
    <div style={{position: "absolute", left: 0, top: 0, height: 10, width: 1080 * (f / total), background: (D.accent ?? P.gold)}}/>
  </>;
};

export const IndiaShort: React.FC<{D: ShortData}> = ({D}) => {
  const f = useCurrentFrame();
  const q0 = F(D.t.quiz[0]);
  return <AbsoluteFill style={{background: P.bg}}>
    <VoxFonts/>
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${P.bg2} 0%, ${P.bg} 70%)`}}/>
    <IndiaMap D={D}/>
    {f < F(D.t.reveal[0]) && <div style={{opacity: f < q0 ? 1 : ease(f, F(D.t.reveal[0]) - 6, F(D.t.reveal[0]), 1, 0)}}>
      <Hook lines={D.hook} at={0} acc={D.accent ?? (D.accent ?? P.gold)}/>
      {f >= q0 && <div style={{position: "absolute", left: 60, top: 400, fontFamily: COND, fontWeight: 700, fontSize: 56, color: (D.accent2 ?? P.cyan),
        opacity: ease(f, q0, q0 + 6)}}>{D.q}</div>}
    </div>}
    <Quiz D={D}/>
    <Reveal D={D}/>
    <Legend D={D}/>
    <Top5 D={D}/>
    <End D={D}/>
    <Chrome D={D}/>
    <Audio src={staticFile(`datayt/shorts/${D.id}/music.wav`)}/>
  </AbsoluteFill>;
};
