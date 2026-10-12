// Data Kadai "beat" Shorts (1080x1920): one thing on screen at a time, very large type, a cut every bar or two.
// Nine story types share this file: clue quiz, top-five countdown, state vs state, data paradox, share of India, race, higher-or-lower, place story, then and now. Beats and timing come
// from public/datayt/beats/<id>/data.json (scripts/datayt/build_beats.py). The all-states map appears only as a closing beat.
import React from "react";
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame} from "remotion";
import {COND, VoxFonts} from "../voxkit";
import geo from "../../public/datayt/india/geo.json";
import {P} from "./IndiaShort";
import {Mark} from "./Brand";
import {StateMap, MapState, MAP_RATIO} from "./StateMap";

const FPS = 30, W = 1080, H = 1920;
const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
type Beat = {kind: string; t0: number; t1: number; lines?: string[]; n?: number; of?: number; big?: string; text?: string; name?: string; geo?: string; sub?: string;
  items?: {big: string; text: string}[]; rank?: number; frac?: number; label?: string; note?: string; a?: string; b?: string; win?: string; sa?: number; sb?: number;
  title?: string; q?: string; kicker?: string; bars?: {name: string; label: string; frac: number}[]; note?: string; anim?: boolean; ring?: string[]; mode?: string;
  spots?: {geo: string; also?: string[]; name: string; big?: string; note?: string; tone?: string; at?: number[]}[];
  measure?: string; pa?: {name: string; geo: string; label: string}; pb?: {name: string; geo: string; label: string};
  p0?: {period: string; label: string; frac: number}; p1?: {period: string; label: string; frac: number}; legend?: {color: string; label: string}[]};
export type BeatData = {id: string; type: string; chip: string; sourceShort: string; source: string; accent: string; accent2: string; bands: string[];
  beats: Beat[]; total: number; beat: number; map?: MapState[]; grid?: {parts: {name: string; v: number; label: string; color: string}[]; caption: string};
  race?: {years: string[]; cut: number; note: string; a: {name: string; v: number[]; sub?: string}; b: {name: string; v: number[]; sub?: string}; marks?: {i: number; text: string}[]};
  stack?: {a: {name: string; v: number; label: string}; parts: {name: string; v: number; label: string}[]; sum: string; sumName: string; note?: string};
  tally?: {q: string; win: string; wl: string; lose: string; ll: string}[];
  timeline?: {label: string}[];
  line100?: {rows: {name: string; v: number; label: string; india?: boolean}[]; max: number; note: string; line: string}; a?: {name: string; geo: string}; b?: {name: string; geo: string}; vo: {file: string; at: number; sec: number}[]};
type G = {name: string; d: string; bbox: number[]; lx: number; ly: number};
const GEO = Object.fromEntries((geo.states as G[]).map((g) => [g.name, g]));

const F = (s: number) => Math.round(s * FPS);
const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
const pop = (f: number, at: number) => spring({frame: f - at, fps: FPS, config: {damping: 13, stiffness: 170}});
const Rich: React.FC<{text: string; acc: string}> = ({text, acc}) => <>{text.split("*").map((p, i) =>
  i % 2 ? <span key={i} style={{color: acc}}>{p}</span> : <React.Fragment key={i}>{p}</React.Fragment>)}</>;
// type that shrinks to fit a line: long state names stay on one line
const fit = (text: string, max: number, width: number, ratio = 0.5) => Math.min(max, width / (Math.max(1, text.length) * ratio));

// One state's outline, scaled to fill a box.
const Shape: React.FC<{name: string; x: number; y: number; w: number; h: number; fill: string; stroke?: string; scale?: number}> = ({name, x, y, w, h, fill, stroke = P.ink, scale = 1}) => {
  const g = GEO[name];
  if (!g) return null;
  const [x0, y0, x1, y1] = g.bbox;
  const bw = Math.max(1, x1 - x0), bh = Math.max(1, y1 - y0);
  const s = Math.min(w / bw, h / bh) * scale;
  return <svg width={w} height={h} style={{position: "absolute", left: x, top: y, overflow: "visible"}}>
    <g transform={`translate(${w / 2},${h / 2}) scale(${s}) translate(${-(x0 + x1) / 2},${-(y0 + y1) / 2})`}>
      <path d={g.d} fillRule="evenodd" fill={fill} stroke={stroke} strokeWidth={3 / s} strokeLinejoin="round"/>
    </g>
  </svg>;
};

const Chrome: React.FC<{D: BeatData; dark: boolean}> = ({D, dark}) => {
  const f = useCurrentFrame();
  const ink = dark ? "#FFFFFF" : P.ink;
  return <>
    <div style={{position: "absolute", left: 0, top: 0, height: 12, width: W * (f / F(D.total)), background: dark ? "#FFFFFF" : D.accent}}/>
    <div style={{position: "absolute", left: 60, top: 70, display: "flex", gap: 14, alignItems: "center"}}>
      <div style={{background: dark ? "#FFFFFF" : D.accent2, color: dark ? D.accent : P.bg, fontFamily: SANS, fontWeight: 800, fontSize: 28, letterSpacing: 3, padding: "8px 16px", borderRadius: 8}}>{D.chip}</div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 26, color: ink, opacity: 0.7}}>{D.sourceShort}</div>
    </div>
    <div style={{position: "absolute", right: 60, bottom: 50, display: "flex", alignItems: "center", gap: 10, opacity: 0.9}}>
      <Mark size={40} c={dark ? "#FFFFFF" : undefined} h={dark ? "#FFFFFF" : undefined}/>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 32, color: ink}}>DATA <span style={{color: dark ? "#FFFFFF" : P.gold}}>KADAI</span></div>
    </div>
  </>;
};

const Hook: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{justifyContent: "center", padding: "0 70px"}}>
    {(b.lines ?? []).map((l, i) => {
      const p = pop(f, f0 + 2 + i * 5);
      return <div key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: fit(l.replace(/\*/g, ""), 168, 940, 0.47), lineHeight: 1.02, color: P.ink,
        opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 60}px)`}}><Rich text={l} acc={D.accent}/></div>;
    })}
    {b.note && <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 34, lineHeight: 1.3, color: P.mute, marginTop: 36, opacity: ease(f, f0 + 14, f0 + 22)}}>{b.note}</div>}
  </AbsoluteFill>;
};

// The hook above the outline of India with one state lit: the place and the surprise are both in the first frame.
const Spot: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const h = 1010, S = h / geo.h, w = geo.w * S;
  const g = b.spots ? undefined : GEO[b.geo ?? ""];
  const spots = b.spots ?? [];
  const tone = (t?: string) => t === "b" ? D.accent2 : D.accent;
  const lit = (name: string) => spots.find((sp) => sp.geo === name) ?? (name === b.geo && !b.spots ? {geo: name, name: "", tone: "a"} : undefined);
  const half = (name: string) => spots.find((sp) => (sp.also ?? []).includes(name));
  const p = pop(f, f0 - 6);      // the lit state and the first lines are already there on frame 0
  const pulse = ((f - f0) % 30) / 30;
  return <AbsoluteFill>
    <div style={{position: "absolute", left: 60, right: 60, top: 160}}>
      {(b.lines ?? []).map((l, i) => {
        const q = pop(f, f0 - 10 + i * 5);
        return <div key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: fit(l.replace(/\*/g, ""), 132, 960, 0.5), lineHeight: 1.04, color: P.ink,
          opacity: Math.min(1, q * 1.4), transform: `translateY(${(1 - q) * 40}px)`}}><Rich text={l} acc={D.accent}/></div>;
      })}
    </div>
    <svg width={w} height={h} style={{position: "absolute", left: (W - w) / 2, top: 770, overflow: "visible"}}>
      <g transform={`scale(${S})`}>
        {(geo.states as G[]).map((s_) => {
          const on = lit(s_.name), part = half(s_.name);
          return <path key={s_.name} d={s_.d} fillRule="evenodd" fill={on ? tone(on.tone) : part ? tone(part.tone) : P.empty} fillOpacity={part && !on ? 0.5 : 1} stroke={P.ink}
            strokeOpacity={on || part ? 1 : 0.4} strokeWidth={on ? 2.4 : 1.1} strokeLinejoin="round"/>;
        })}
        {spots.filter((sp) => sp.at).map((sp, i) => {
          const q = pop(f, f0 - 8), [tx, ty] = sp.at as number[];
          return <g key={sp.geo} opacity={Math.min(1, q * 1.4)}>
            <text x={tx} y={ty} fontFamily={COND} fontWeight={700} fontSize={46} fill={tone(sp.tone)} stroke={P.bg} strokeWidth={8} paintOrder="stroke">{sp.name}</text>
            <text x={tx} y={ty + 100} fontFamily={COND} fontWeight={700} fontSize={112} fill={tone(sp.tone)} stroke={P.bg} strokeWidth={10} paintOrder="stroke">{sp.big}</text>
            {sp.note && <text x={tx} y={ty + 138} fontFamily={SANS} fontWeight={600} fontSize={26} fill={P.mute}>{sp.note}</text>}
          </g>;
        })}
        {g && <>
          <circle cx={g.lx} cy={g.ly} r={46 + 54 * pulse} fill="none" stroke={D.accent2} strokeWidth={7} opacity={(1 - pulse) * p}/>
          <text x={g.lx} y={g.ly - 74} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={66} fill={D.accent} stroke={P.bg} strokeWidth={9}
            paintOrder="stroke" opacity={p}>{b.name}</text>
        </>}
      </g>
    </svg>
    {b.note && <div style={{position: "absolute", left: 60, right: 330, top: 1800, fontFamily: SANS, fontWeight: 600, fontSize: 24, lineHeight: 1.3, color: P.mute}}>{b.note}</div>}
  </AbsoluteFill>;
};

// 100 squares for a national total, filled part by part. A part's last square is filled only as far as its share goes
// (48.6% is 48 squares and six-tenths of the next), so nothing is rounded to make the grid add up.
// "hook" mode: the hook lines above, only the first part filled. "split" mode: a legend above, every part filled in turn.
const Grid: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const parts = D.grid?.parts ?? [];
  const over = b.mode === "over";      // 100 squares for the whole, then the extra squares below a gap
  const hook = b.mode === "hook" || over;
  const C = over ? 54 : 78, GAP = over ? 6 : 8, SZ = 10 * C + 9 * GAP, x0 = over ? 70 : (W - SZ) / 2, y0 = over ? 566 : hook ? 600 : 622;
  const cells = over ? Math.ceil(parts.reduce((t, p) => t + p.v, 0) / 10) * 10 : 100, SPLIT = 26;
  const start = (k: number) => over ? f0 - 6 + k * 34 : hook ? f0 - 4 : f0 + 6 + (k - 1) * 20;
  let from = 0;
  const seg = parts.map((p, k) => {
    const prog = over ? ease(f, start(k), start(k) + 30) : hook ? (k === 0 ? ease(f, start(0), start(0) + 34) : 0) : (k === 0 ? 1 : ease(f, start(k), start(k) + 16));
    const s_ = {from, to: from + p.v * prog, color: p.color};
    from += p.v;
    return s_;
  });
  return <AbsoluteFill>
    {hook ? <div style={{position: "absolute", left: 60, right: 60, top: 160}}>
      {(b.lines ?? []).map((l, i) => {
        const q = pop(f, f0 - 10 + i * 5);
        return <div key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: fit(l.replace(/\*/g, ""), 132, 960, 0.47), lineHeight: 1.04, color: P.ink,
          opacity: Math.min(1, q * 1.4), transform: `translateY(${(1 - q) * 40}px)`}}><Rich text={l} acc={D.accent}/></div>;
      })}
    </div> : <>
      <div style={{position: "absolute", left: 60, right: 60, top: 172, fontFamily: SANS, fontWeight: 800, fontSize: 38, letterSpacing: 4, color: D.accent2}}>{b.kicker}</div>
      <div style={{position: "absolute", left: x0, width: SZ, top: 236}}>
        {parts.map((p, k) => {
          const at = k === 0 ? f0 : start(k);
          return <div key={k} style={{display: "flex", alignItems: "center", gap: 22, height: 90, opacity: ease(f, at, at + 8)}}>
            <div style={{width: 46, height: 46, borderRadius: 10, background: p.color}}/>
            <div style={{flex: 1, fontFamily: COND, fontWeight: 700, fontSize: 66, lineHeight: 1, color: P.ink}}>{p.name}</div>
            <div style={{fontFamily: COND, fontWeight: 700, fontSize: 78, lineHeight: 1, color: k === 0 ? D.accent : P.ink}}>{p.label}</div>
          </div>;
        })}
      </div>
    </>}
    <div style={{position: "absolute", left: x0, top: y0, width: SZ, height: SZ}}>
      {Array.from({length: cells}).map((_, i) => <div key={i} style={{position: "absolute", left: (i % 10) * (C + GAP), top: Math.floor(i / 10) * (C + GAP) + (i >= 100 ? SPLIT : 0), width: C, height: C,
        borderRadius: over ? 9 : 12, background: i >= 100 ? "transparent" : P.empty, overflow: "hidden"}}>
        {seg.map((s_, k) => {
          const lo = Math.max(i, s_.from), hi = Math.min(i + 1, s_.to);
          return hi > lo ? <div key={k} style={{position: "absolute", left: (lo - i) * C, top: 0, width: (hi - lo) * C, height: C, background: s_.color}}/> : null;
        })}
      </div>)}
    </div>
    {over ? <>
      {parts.map((p, k) => {
        const top = k === 0 ? y0 + 5 * (C + GAP) - 120 : y0 + 10 * (C + GAP) + SPLIT + 10;
        return <div key={k} style={{position: "absolute", left: x0 + SZ + 40, right: 40, top, opacity: ease(f, start(k) + 14, start(k) + 24)}}>
          <div style={{fontFamily: COND, fontWeight: 700, fontSize: 170, lineHeight: 1, color: p.color}}>{p.label}</div>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, lineHeight: 1.2, color: P.ink, marginTop: 6}}>{p.name}</div>
        </div>;
      })}
      <div style={{position: "absolute", left: 60, right: 60, top: y0 + (cells / 10) * (C + GAP) + SPLIT + 14, fontFamily: SANS, fontWeight: 600, fontSize: 28, lineHeight: 1.3, color: P.mute}}>{D.grid?.caption}</div>
    </> : <div style={{position: "absolute", left: x0, width: SZ, top: y0 + SZ + 18, fontFamily: SANS, fontWeight: 600, fontSize: 30, color: P.mute}}>{D.grid?.caption}</div>}
  </AbsoluteFill>;
};

// Two states' lines over the years. "lead" mode holds the chart at the cut year, with the old leader ahead and the hook
// above it. "run" mode plays on to the last year: the x-axis always spans the first year to the current one and the
// y-axis grows with the larger line, so the chart stays full while one line climbs away.
const Race: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const R_ = D.race;
  if (!R_) return null;
  const lead = b.mode === "lead";
  const n = R_.years.length, cut = R_.cut;
  const pos = lead ? cut : interpolate(f, [f0 + 8, Math.max(f0 + 60, F(b.t1) - 75)], [cut, n - 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad)});
  const at = (v: number[]) => { const i = Math.min(n - 2, Math.floor(pos)); return v[i] + (v[i + 1] - v[i]) * (pos - i); };
  const ca = at(R_.a.v), cb = at(R_.b.v);
  let top = Math.max(ca, cb);
  for (let i = 0; i <= Math.floor(pos); i++) top = Math.max(top, R_.a.v[i], R_.b.v[i]);
  top *= 1.22;
  const X0 = 70, X1 = 690, LX = 724, Y0 = 640, Y1 = 1380;      // lines on the left, the two labels in their own column on the right
  const x = (i: number) => X0 + (X1 - X0) * (i / pos), y = (v: number) => Y1 - (Y1 - Y0) * (v / top);
  const path = (v: number[], cur: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= Math.floor(pos); i++) pts.push(`${x(i)},${y(v[i])}`);
    if (pos - Math.floor(pos) > 1e-6) pts.push(`${X1},${y(cur)}`);
    return "M" + pts.join(" L");
  };
  const endP = lead ? 0 : ease(f, F(b.t1) - 70, F(b.t1) - 58);      // the multiples appear once the run has reached the last year
  // label blocks sit beside their line ends; when the lines are close they are pushed apart so they never overlap
  let la = y(ca), lb = y(cb);
  const SEP = 196;
  if (Math.abs(la - lb) < SEP) { const mid = (la + lb) / 2, up = ca >= cb ? -SEP / 2 : SEP / 2; la = mid + up; lb = mid - up; }
  const lo = Math.max(la, lb), hi = Math.min(la, lb);
  const sh = lo > Y1 - 96 ? Y1 - 96 - lo : hi < Y0 + 60 ? Y0 + 60 - hi : 0;
  la += sh; lb += sh;
  const tag = (name: string, v: number, col: string, c: number, sub?: string) => <>
    <line x1={X1 + 18} y1={y(v)} x2={LX - 10} y2={c} stroke={col} strokeWidth={3} opacity={0.5}/>
    <text x={LX} y={c - 36} fontFamily={COND} fontWeight={700} fontSize={46} fill={col}>{name}</text>
    <text x={LX} y={c + 50} fontFamily={COND} fontWeight={700} fontSize={96} fill={col}>{v.toFixed(1)}</text>
    {sub && <text x={LX} y={c + 88} fontFamily={SANS} fontWeight={700} fontSize={27} fill={col} opacity={endP}>{sub}</text>}
  </>;
  return <AbsoluteFill>
    {lead ? <div style={{position: "absolute", left: 60, right: 60, top: 160}}>
      {(b.lines ?? []).map((l, i) => {
        const q = pop(f, f0 - 10 + i * 5);
        return <div key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: fit(l.replace(/\*/g, ""), 132, 960, 0.47), lineHeight: 1.04, color: P.ink,
          opacity: Math.min(1, q * 1.4), transform: `translateY(${(1 - q) * 40}px)`}}><Rich text={l} acc={D.accent}/></div>;
      })}
    </div> : <>
      <div style={{position: "absolute", left: 60, right: 60, top: 172, fontFamily: SANS, fontWeight: 800, fontSize: 38, letterSpacing: 4, color: D.accent2}}>{b.kicker}</div>
      <div style={{position: "absolute", left: 60, top: 222, fontFamily: COND, fontWeight: 700, fontSize: 230, lineHeight: 1, color: P.ink}}>{R_.years[Math.round(pos)]}</div>
    </>}
    <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
      <line x1={X0} y1={Y1} x2={X1} y2={Y1} stroke={P.line} strokeWidth={3}/>
      {!lead && pos > cut + 0.3 && <>
        <line x1={x(cut)} y1={Y0 + 40} x2={x(cut)} y2={Y1} stroke={P.mute} strokeWidth={3} strokeDasharray="10 12"/>
        <text x={x(cut)} y={Y0 + 24} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={30} fill={P.mute}>{R_.years[cut]}</text>
      </>}
      <path d={path(R_.b.v, cb)} fill="none" stroke={D.accent2} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round"/>
      <path d={path(R_.a.v, ca)} fill="none" stroke={D.accent} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={X1} cy={y(cb)} r={17} fill={D.accent2}/>
      <circle cx={X1} cy={y(ca)} r={17} fill={D.accent}/>
      {!lead && (R_.marks ?? []).filter((m) => pos >= m.i).map((m) => <g key={m.i} opacity={ease(pos, m.i, m.i + 0.6) * (1 - 0.45 * endP)}>
        <circle cx={x(m.i)} cy={y(R_.a.v[m.i])} r={11} fill={P.bg} stroke={D.accent} strokeWidth={5}/>
        {m.text.split("|").map((ln, k, all) => <text key={k} x={x(m.i) - 16} y={y(R_.a.v[m.i]) - 44 - (all.length - 1 - k) * 34} textAnchor="end" fontFamily={SANS} fontWeight={700}
          fontSize={28} fill={D.accent} stroke={P.bg} strokeWidth={14} paintOrder="stroke">{ln}</text>)}
      </g>)}
      {tag(R_.b.name, cb, D.accent2, lb, R_.b.sub)}
      {tag(R_.a.name, ca, D.accent, la, R_.a.sub)}
      <text x={X0} y={Y1 + 46} fontFamily={SANS} fontWeight={600} fontSize={30} fill={P.mute}>{R_.years[0]}</text>
      <text x={X1} y={Y1 + 46} textAnchor="end" fontFamily={SANS} fontWeight={600} fontSize={30} fill={P.mute}>{R_.years[Math.round(pos)]}</text>
    </svg>
    <div style={{position: "absolute", left: 60, right: 60, top: Y1 + 76, fontFamily: SANS, fontWeight: 600, fontSize: 30, lineHeight: 1.3, color: P.mute}}>{R_.note}</div>
  </AbsoluteFill>;
};

// One bar against a stack of the next largest. The stack builds one state at a time and still stops short.
const Stack: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const S_ = D.stack;
  if (!S_) return null;
  const BASE = 1400, HMAX = 760, BW = 340, XA = 120, XB = 620;
  const h = (v: number) => HMAX * v / S_.a.v;
  const pa = ease(f, f0 + 2, f0 + 20);
  const cols = [D.accent2, D.bands[3], D.bands[1]];
  const done = f0 + 24 + S_.parts.length * 16;
  let acc = 0;
  const total = S_.parts.reduce((t, p) => t + p.v, 0);
  const num: React.CSSProperties = {position: "absolute", width: BW, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 112, lineHeight: 1};
  const cap: React.CSSProperties = {position: "absolute", width: BW, top: BASE + 16, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 36, color: P.ink};
  return <AbsoluteFill>
    <div style={{position: "absolute", left: 60, right: 60, top: 165}}>
      {(b.lines ?? []).map((l, i) => <div key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: fit(l.replace(/\*/g, ""), 112, 960, 0.47), lineHeight: 1.05, color: P.ink,
        opacity: ease(f, f0 + i * 4, f0 + 8 + i * 4)}}><Rich text={l} acc={D.accent}/></div>)}
    </div>
    <div style={{position: "absolute", left: XA, width: BW, top: BASE - h(S_.a.v) * pa, height: h(S_.a.v) * pa, background: D.accent, borderRadius: "18px 18px 0 0"}}/>
    <div style={{...num, left: XA, top: BASE - h(S_.a.v) - 124, color: D.accent, opacity: pa}}>{S_.a.label}</div>
    <div style={{...cap, left: XA}}>{S_.a.name}</div>
    {S_.parts.map((p, k) => {
      const at = f0 + 24 + k * 16, pp = ease(f, at, at + 12), y0 = acc;
      acc += p.v;
      return <div key={k} style={{position: "absolute", left: XB, width: BW, top: BASE - h(y0 + p.v * pp), height: h(p.v * pp), background: cols[k % cols.length],
        borderTop: `4px solid ${P.bg}`, borderRadius: k === S_.parts.length - 1 ? "18px 18px 0 0" : 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"}}>
        {S_.parts.length > 1 && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: "#FFFFFF", opacity: ease(f, at + 8, at + 14), textAlign: "center", lineHeight: 1.2}}>{p.name}<br/>{p.label}</div>}
      </div>;
    })}
    <div style={{...num, left: XB, top: BASE - h(total) - 124, color: P.ink, opacity: ease(f, done, done + 8)}}>{S_.sum}</div>
    <div style={{...cap, left: XB}}>{S_.sumName}</div>
    {S_.note && <div style={{position: "absolute", left: 60, right: 60, top: BASE + 78, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 30, lineHeight: 1.3, color: P.mute}}>{S_.note}</div>}
  </AbsoluteFill>;
};

// One number at two dates. "then" shows the earlier figure alone; "now" moves it up and brings in the later figure, a bar
// under each and the change between them. Each figure sits under its own period as the table prints it: no figure is called "now".
const Shift: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const A = b.p0, B = b.p1;
  if (!A || !B) return null;
  const later = b.mode === "now";
  const k = later ? ease(f, f0, f0 + 8) : 0;      // 0: the earlier figure fills the frame; 1: it has made room for the later one
  const p = pop(f, f0), q = pop(f, f0 + 8);
  const sa = fit(A.label, 330, 960, 0.56), sizeA = sa - (sa - Math.min(sa, 210)) * k;
  const sizeB = fit(B.label, 290, 960, 0.56);
  const period: React.CSSProperties = {position: "absolute", left: 60, fontFamily: SANS, fontWeight: 800, fontSize: 44, letterSpacing: 3};
  const bar = (top: number, frac: number, col: string, from: number) => <div style={{position: "absolute", left: 60, width: 960, top, height: 34, borderRadius: 17, background: P.empty}}>
    <div style={{height: 34, borderRadius: 17, width: `${frac * 100 * ease(f, from, from + 18)}%`, background: col}}/></div>;
  return <AbsoluteFill>
    <div style={{position: "absolute", left: 60, right: 60, top: 172, fontFamily: SANS, fontWeight: 800, fontSize: 38, letterSpacing: 4, color: D.accent2}}>{b.kicker}</div>
    <Shape name={b.geo ?? ""} x={60} y={244} w={300} h={330} fill={D.accent}/>
    <div style={{position: "absolute", left: 400, right: 50, top: 244, height: 330, display: "flex", alignItems: "center", fontFamily: COND, fontWeight: 700,
      fontSize: fit(b.name ?? "", 150, 620, 0.5), lineHeight: 1, color: P.ink}}>{b.name}</div>
    <div style={{...period, top: 640, color: P.mute}}>{A.period}</div>
    <div style={{position: "absolute", left: 60, top: 690, fontFamily: COND, fontWeight: 700, fontSize: sizeA, lineHeight: 1, color: later ? P.mute : D.accent,
      transform: later ? undefined : `scale(${0.7 + 0.3 * p})`, transformOrigin: "left center", opacity: later ? 1 : Math.min(1, p * 1.5)}}>{A.label}</div>
    {bar(690 + sizeA + 14, A.frac, P.line, later ? f0 - 30 : f0 + 6)}
    {!later && <div style={{position: "absolute", left: 60, right: 60, top: 690 + sizeA + 90, fontFamily: COND, fontWeight: 700, fontSize: 70, lineHeight: 1.1, color: P.ink,
      opacity: ease(f, f0 + 12, f0 + 20)}}><Rich text={b.text ?? ""} acc={D.accent}/></div>}
    {later && <>
      <div style={{...period, top: 1010, color: D.accent, opacity: ease(f, f0 + 4, f0 + 10)}}>{B.period}</div>
      <div style={{position: "absolute", right: 60, top: 1000, background: D.accent2, color: "#FFFFFF", fontFamily: SANS, fontWeight: 800, fontSize: 40, padding: "8px 22px", borderRadius: 12,
        opacity: ease(f, f0 + 26, f0 + 32), transform: `scale(${0.8 + 0.2 * pop(f, f0 + 26)})`, transformOrigin: "right center"}}>{b.big}</div>
      <div style={{position: "absolute", left: 60, top: 1062, fontFamily: COND, fontWeight: 700, fontSize: sizeB, lineHeight: 1, color: D.accent,
        transform: `scale(${0.7 + 0.3 * q})`, transformOrigin: "left center", opacity: Math.min(1, q * 1.5)}}>{B.label}</div>
      {bar(1062 + sizeB + 14, B.frac, D.accent, f0 + 12)}
      <div style={{position: "absolute", left: 60, right: 60, top: 1062 + sizeB + 70, fontFamily: SANS, fontWeight: 600, fontSize: 34, lineHeight: 1.3, color: P.ink,
        opacity: ease(f, f0 + 34, f0 + 42)}}><Rich text={b.text ?? ""} acc={D.accent}/></div>
    </>}
  </AbsoluteFill>;
};

// Bars against a line at 100: the states above it, and the country for scale.
const Line100: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const L_ = D.line100;
  if (!L_) return null;
  const X0 = 60, X1 = 860, top = 500, RH = 158;
  const x = (v: number) => X0 + (X1 - X0) * v / L_.max;
  return <AbsoluteFill>
    <div style={{position: "absolute", left: 60, right: 60, top: 165}}>
      {(b.lines ?? []).map((l, i) => <div key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: fit(l.replace(/\*/g, ""), 116, 960, 0.47), lineHeight: 1.05, color: P.ink}}><Rich text={l} acc={D.accent}/></div>)}
    </div>
    {L_.rows.map((r, i) => {
      const at = f0 + 4 + i * 7, w = (x(r.v) - X0) * ease(f, at, at + 18), col = r.india ? P.mute : D.accent;
      return <div key={i} style={{position: "absolute", left: 0, right: 0, top: top + i * RH, opacity: ease(f, at, at + 6)}}>
        <div style={{position: "absolute", left: X0, top: 0, fontFamily: COND, fontWeight: 700, fontSize: 60, lineHeight: 1, color: r.india ? P.mute : P.ink}}>{r.name}</div>
        <div style={{position: "absolute", left: X0, top: 70, width: w, height: 46, borderRadius: 10, background: col, overflow: "hidden"}}>
          {r.v > 100 && <div style={{position: "absolute", left: x(100) - X0, top: 0, right: 0, height: 46, background: D.accent2}}/>}
        </div>
        <div style={{position: "absolute", left: X0 + w + 18, top: 52, fontFamily: COND, fontWeight: 700, fontSize: 84, lineHeight: 1, color: r.v > 100 ? D.accent2 : col}}>{r.label}</div>
      </div>;
    })}
    <div style={{position: "absolute", left: x(100) - 2, top: top - 46, width: 0, height: L_.rows.length * RH + 20, borderLeft: `4px dashed ${P.ink}`, opacity: 0.75}}/>
    <div style={{position: "absolute", left: x(100) - 60, width: 120, top: top - 96, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 36, color: P.ink}}>{L_.line}</div>
    <div style={{position: "absolute", left: 60, right: 60, top: top + L_.rows.length * RH + 6, fontFamily: SANS, fontWeight: 600, fontSize: 32, lineHeight: 1.3, color: P.mute}}>{L_.note}</div>
  </AbsoluteFill>;
};

// One dated event in a place's story: the date, the year in very large type, what happened in plain words, the Act,
// treaty or record it comes from, an optional count of years, and a timeline along the bottom with this event lit.
const EventBeat: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const p = pop(f, f0);
  const T_ = D.timeline ?? [], n = b.n ?? -1;
  const X0 = 110, X1 = 970, TY = 1392;
  const tx = (i: number) => T_.length > 1 ? X0 + (X1 - X0) * i / (T_.length - 1) : (X0 + X1) / 2;
  const run = n < 0 ? 0 : ease(f, f0, f0 + 10, Math.max(0, n - 1), n);      // the lit part of the line reaches this event as the beat starts
  return <AbsoluteFill>
    <div style={{position: "absolute", left: 60, right: 60, top: 172, fontFamily: SANS, fontWeight: 800, fontSize: 38, letterSpacing: 4, color: D.accent2}}>{b.kicker}</div>
    <div style={{position: "absolute", left: 56, top: 214, fontFamily: COND, fontWeight: 700, fontSize: fit(b.big ?? "", 320, 640, 0.5), lineHeight: 1, color: D.accent,
      transform: `scale(${0.8 + 0.2 * p})`, transformOrigin: "left center"}}>{b.big}</div>
    <Shape name={b.geo ?? ""} x={740} y={236} w={270} h={270} fill={D.accent2} stroke={P.ink}/>
    <div style={{position: "absolute", left: 60, right: 60, top: 560}}>
      {(b.lines ?? []).map((l, i) => <div key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: fit(l.replace(/\*/g, ""), 96, 960, 0.46), lineHeight: 1.08, color: P.ink,
        opacity: ease(f, f0 + 4 + i * 4, f0 + 12 + i * 4)}}><Rich text={l} acc={D.accent}/></div>)}
      {b.text && <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 31, lineHeight: 1.3, color: P.mute, marginTop: 26, opacity: ease(f, f0 + 14, f0 + 22)}}>{b.text}</div>}
      {b.label && <div style={{display: "flex", alignItems: "baseline", gap: 22, marginTop: 44, opacity: ease(f, f0 + 16, f0 + 24)}}>
        <div style={{fontFamily: COND, fontWeight: 700, fontSize: 190, lineHeight: 1, color: D.accent2}}>{b.label}</div>
        <div style={{flex: 1, fontFamily: COND, fontWeight: 700, fontSize: 58, lineHeight: 1.08, color: P.ink}}>{b.sub}</div>
      </div>}
    </div>
    <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
      <line x1={X0} y1={TY} x2={X1} y2={TY} stroke={P.line} strokeWidth={6} strokeLinecap="round"/>
      {n >= 0 && <line x1={X0} y1={TY} x2={tx(run)} y2={TY} stroke={D.accent} strokeWidth={6} strokeLinecap="round"/>}
      {T_.map((t, i) => {
        const on = i === n, past = i < n;
        return <g key={i}>
          <circle cx={tx(i)} cy={TY} r={on ? 20 : 12} fill={on || past ? D.accent : P.bg} stroke={on || past ? D.accent : P.line} strokeWidth={5}/>
          <text x={tx(i)} y={TY + 62} textAnchor="middle" fontFamily={SANS} fontWeight={on ? 800 : 600} fontSize={on ? 36 : 30} fill={on ? D.accent : P.mute}>{t.label}</text>
        </g>;
      })}
    </svg>
  </AbsoluteFill>;
};

// Higher or lower: two states, one question. "ask" shows the question and a bar that runs down once the voice stops;
// "tell" keeps the same frame, brings in both numbers and lifts the higher card.
const Pick: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const tell = b.mode === "tell";
  const show = tell ? ease(f, f0 + 1, f0 + 10) : 0;
  const vo = (D.vo ?? []).find((v) => v.at >= b.t0 - 0.01 && v.at < b.t1);
  const t0 = vo ? F(vo.at + vo.sec) : f0, t1 = F(b.t1) - 2;
  const left = tell ? 0 : interpolate(f, [t0, Math.max(t0 + 1, t1)], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const card = (who: "a" | "b", top: number) => {
    const S_ = who === "a" ? b.pa : b.pb, win = b.win === who, col = who === "a" ? D.accent : D.accent2;
    const p = pop(f, f0 + 1);
    return <div style={{position: "absolute", left: 50, right: 50, top, height: 420, borderRadius: 36, background: tell && win ? `${col}26` : `${col}0F`,
      border: `4px solid ${tell && win ? col : "transparent"}`, opacity: tell && !win ? 1 - 0.4 * show : 1, transform: `scale(${tell && win ? 1 + 0.02 * p : 1})`}}>
      <Shape name={S_?.geo ?? ""} x={30} y={40} w={300} h={340} fill={col}/>
      <div style={{position: "absolute", left: 370, right: 30, top: tell ? 46 : 130, fontFamily: COND, fontWeight: 700, fontSize: fit(S_?.name ?? "", tell ? 96 : 124, 580, 0.5), lineHeight: 1, color: P.ink}}>{S_?.name}</div>
      {tell && <div style={{position: "absolute", left: 370, right: 30, top: 140, fontFamily: COND, fontWeight: 700, fontSize: fit(S_?.label ?? "", 178, 560, 0.56), lineHeight: 1, color: col,
        opacity: show, transform: `translateY(${(1 - show) * 30}px)`}}>{S_?.label}</div>}
      {tell && win && <div style={{position: "absolute", left: 370, top: 326, display: "flex", alignItems: "center", gap: 18, opacity: show}}>
        <div style={{background: col, color: "#FFFFFF", fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 4, padding: "8px 18px", borderRadius: 10}}>HIGHER</div>
        <div style={{fontFamily: COND, fontWeight: 700, fontSize: 52, color: col}}>{b.big}</div>
      </div>}
    </div>;
  };
  return <AbsoluteFill>
    <div style={{position: "absolute", left: 60, right: 60, top: 172, fontFamily: SANS, fontWeight: 800, fontSize: 36, letterSpacing: 4, color: D.accent2}}>ROUND {b.n} OF {b.of}</div>
    <div style={{position: "absolute", left: 60, right: 60, top: 232}}>
      {(b.lines ?? []).map((l, i) => <div key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: fit(l.replace(/\*/g, ""), 124, 960, 0.47), lineHeight: 1.04, color: P.ink}}><Rich text={l} acc={D.accent}/></div>)}
    </div>
    {card("a", 540)}
    {card("b", 990)}
    <div style={{position: "absolute", left: 50, right: 50, top: 1436, height: 14, borderRadius: 7, background: tell ? "transparent" : P.empty}}>
      <div style={{height: 14, borderRadius: 7, width: `${left * 100}%`, background: D.accent2}}/></div>
    <div style={{position: "absolute", left: 60, right: 60, top: 1466, fontFamily: SANS, fontWeight: 600, fontSize: 32, color: P.mute}}>{b.measure}</div>
  </AbsoluteFill>;
};

// The closing card of a game: every answer with both numbers, so a viewer can check their score.
const Tally: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill>
    <div style={{position: "absolute", left: 60, right: 60, top: 165, fontFamily: COND, fontWeight: 700, fontSize: 118, lineHeight: 1.03, color: P.ink}}><Rich text={b.q ?? ""} acc={D.accent}/></div>
    <div style={{position: "absolute", left: 60, right: 60, top: 470}}>
      {(D.tally ?? []).map((r, i) => <div key={i} style={{marginBottom: 34, opacity: ease(f, f0 + 4 + i * 5, f0 + 12 + i * 5)}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, color: P.mute}}>{r.q}</div>
        <div style={{fontFamily: COND, fontWeight: 700, fontSize: fit(`${r.win} ${r.wl}   ${r.lose} ${r.ll}`, 70, 960, 0.44), lineHeight: 1.15, color: P.ink}}>
          <span style={{color: D.accent}}>{r.win} {r.wl}</span><span style={{color: P.mute}}>{"  ·  "}{r.lose} {r.ll}</span></div>
      </div>)}
    </div>
    <div style={{position: "absolute", left: 60, right: 60, top: 1180, fontFamily: SANS, fontWeight: 700, fontSize: 46, color: D.accent2}}>{b.sub}</div>
    {b.note && <div style={{position: "absolute", left: 60, right: 60, top: 1256, fontFamily: SANS, fontWeight: 600, fontSize: 32, color: P.ink}}>{b.note}</div>}
    <div style={{position: "absolute", left: 60, right: 330, top: 1330, fontFamily: SANS, fontSize: 23, lineHeight: 1.3, color: P.mute}}>Source: {D.source}</div>
  </AbsoluteFill>;
};

// One state, one number: its outline, the figure, one line of meaning, and a bar against India when there is one.
const Fact: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const p = pop(f, f0);
  const nameW = Math.min(330, Math.max(170, ...(b.bars ?? []).map((r) => r.name.length * 22 + 14)));
  return <AbsoluteFill>
    <div style={{position: "absolute", left: 60, right: 60, top: 172, fontFamily: SANS, fontWeight: 800, fontSize: 38, letterSpacing: 4, color: D.accent2}}>{b.kicker}</div>
    <Shape name={b.geo ?? ""} x={60} y={260} w={380} h={430} fill={D.accent} scale={0.6 + 0.4 * p}/>
    <div style={{position: "absolute", left: 480, right: 50, top: 260, height: 430, display: "flex", alignItems: "center", fontFamily: COND, fontWeight: 700,
      fontSize: fit(b.name ?? "", 170, 540, 0.5), lineHeight: 1, color: P.ink}}>{b.name}</div>
    <div style={{position: "absolute", left: 60, right: 60, top: 730, display: "flex", flexDirection: "column"}}>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: fit(b.big ?? "", 330, 960, 0.56), lineHeight: 1, color: D.accent, transform: `scale(${0.7 + 0.3 * p})`,
        transformOrigin: "left center", opacity: Math.min(1, p * 1.5)}}>{b.big}</div>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 74, lineHeight: 1.1, color: P.ink, marginTop: 22, opacity: ease(f, f0 + 6, f0 + 14)}}>{b.text}</div>
      {(b.bars ?? []).length > 0 && <div style={{marginTop: 44, display: "flex", flexDirection: "column", gap: 22}}>
        {(b.bars ?? []).map((r, i) => <div key={i} style={{display: "flex", alignItems: "center", gap: 20, opacity: ease(f, f0 + 10 + i * 5, f0 + 16 + i * 5)}}>
          <div style={{width: nameW, fontFamily: SANS, fontWeight: 700, fontSize: 38, color: P.ink}}>{r.name}</div>
          <div style={{flex: 1, height: 36, borderRadius: 18, background: P.empty}}>
            <div style={{height: 36, borderRadius: 18, width: `${r.frac * 100 * ease(f, f0 + 12 + i * 5, f0 + 30 + i * 5)}%`, background: i ? P.mute : D.accent}}/></div>
          <div style={{width: 170, textAlign: "right", fontFamily: COND, fontWeight: 700, fontSize: 56, color: i ? P.mute : D.accent}}>{r.label}</div>
        </div>)}
      </div>}
      {b.sub && <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 36, lineHeight: 1.3, color: P.mute, marginTop: 34, opacity: ease(f, f0 + 12, f0 + 20)}}>{b.sub}</div>}
    </div>
  </AbsoluteFill>;
};

const Clue: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const p = pop(f, f0 + 1);
  return <AbsoluteFill style={{justifyContent: "center", padding: "0 70px"}}>
    <div style={{display: "flex", gap: 12, marginBottom: 30}}>
      {Array.from({length: b.of ?? 5}).map((_, i) => <div key={i} style={{width: 150, height: 16, borderRadius: 8, background: i < (b.n ?? 0) ? D.accent : P.empty}}/>)}
    </div>
    <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, letterSpacing: 6, color: D.accent2}}>CLUE {b.n} OF {b.of}</div>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: fit(b.big ?? "", 380, 940, 0.62), lineHeight: 1, color: D.accent, marginTop: 10,
      transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: "left center", opacity: Math.min(1, p * 1.5)}}>{b.big}</div>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: 92, lineHeight: 1.08, color: P.ink, marginTop: 24, opacity: ease(f, f0 + 8, f0 + 16)}}>{b.text}</div>
  </AbsoluteFill>;
};

const Count: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const k = Math.min(2, Math.floor((f - f0) / F(D.beat)));
  const p = pop(f, f0 + k * F(D.beat));
  return <AbsoluteFill style={{background: D.accent, alignItems: "center", justifyContent: "center"}}>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: 120, color: "#FFFFFF", opacity: 0.9}}>{b.text}</div>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: 620, lineHeight: 1, color: "#FFFFFF", transform: `scale(${0.6 + 0.4 * p})`}}>{3 - k}</div>
  </AbsoluteFill>;
};

const Reveal: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const p = pop(f, f0);
  return <AbsoluteFill style={{background: D.accent}}>
    <Shape name={b.geo ?? ""} x={140} y={300} w={800} h={800} fill="#FFFFFF" stroke="#FFFFFF" scale={0.55 + 0.45 * p}/>
    <div style={{position: "absolute", left: 60, right: 60, top: 1180, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: fit(b.name ?? "", 230, 960, 0.5), lineHeight: 1,
      color: "#FFFFFF", transform: `translateY(${(1 - p) * 50}px)`}}>{b.name}</div>
    <div style={{position: "absolute", left: 80, right: 80, top: 1450, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 48, lineHeight: 1.25, color: "#FFFFFF", opacity: 0.92 * ease(f, f0 + 12, f0 + 22)}}>{b.sub}</div>
  </AbsoluteFill>;
};

const Recap: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{padding: "190px 70px 0"}}>
    <div style={{display: "flex", alignItems: "center", gap: 30, height: 260}}>
      <div style={{position: "relative", width: 240, height: 240}}><Shape name={b.geo ?? ""} x={0} y={0} w={240} h={240} fill={D.accent}/></div>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: fit(b.name ?? "", 150, 660, 0.5), color: D.accent, lineHeight: 1}}>{b.name}</div>
    </div>
    {(b.items ?? []).map((it, i) => {
      const a = f0 + 4 + i * 5;
      return <div key={i} style={{display: "flex", alignItems: "center", gap: 26, marginTop: 34, opacity: ease(f, a, a + 6), transform: `translateX(${(1 - ease(f, a, a + 8)) * 40}px)`}}>
        <div style={{width: 300, fontFamily: COND, fontWeight: 700, fontSize: fit(it.big, 104, 300, 0.5), color: P.ink, textAlign: "right"}}>{it.big}</div>
        <div style={{flex: 1, fontFamily: SANS, fontWeight: 600, fontSize: 40, lineHeight: 1.2, color: P.ink}}>{it.text}</div>
      </div>;
    })}
  </AbsoluteFill>;
};

const Rank: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const p = pop(f, f0);
  const top = b.rank === 1;
  const col = top ? D.accent : D.bands[Math.max(1, 4 - (b.rank ?? 1))];
  return <AbsoluteFill style={{background: top ? D.accent : "transparent"}}>
    <div style={{position: "absolute", left: 60, top: 150, fontFamily: COND, fontWeight: 700, fontSize: 330, lineHeight: 1, color: top ? "#FFFFFF" : D.accent, opacity: top ? 1 : 0.95,
      transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: "left top"}}>#{b.rank}</div>
    <Shape name={b.geo ?? ""} x={400} y={400} w={620} h={620} fill={top ? "#FFFFFF" : col} stroke={top ? "#FFFFFF" : P.ink} scale={0.6 + 0.4 * p}/>
    <div style={{position: "absolute", left: 60, right: 60, top: 1080, fontFamily: COND, fontWeight: 700, fontSize: fit(b.name ?? "", 190, 960, 0.5), lineHeight: 1, color: top ? "#FFFFFF" : P.ink}}>{b.name}</div>
    <div style={{position: "absolute", left: 60, right: 60, top: 1290, fontFamily: COND, fontWeight: 700, fontSize: fit(b.big ?? "", 300, 940, 0.62), lineHeight: 1, color: top ? "#FFFFFF" : D.accent,
      opacity: ease(f, f0 + 6, f0 + 12)}}>{b.big}</div>
    <div style={{position: "absolute", left: 60, right: 60, top: 1620, height: 26, background: top ? "#FFFFFF33" : P.empty, borderRadius: 13}}>
      <div style={{height: 26, borderRadius: 13, width: `${(b.frac ?? 1) * 100 * ease(f, f0 + 6, f0 + 24)}%`, background: top ? "#FFFFFF" : col}}/></div>
    <div style={{position: "absolute", left: 60, right: 60, top: 1668, fontFamily: SANS, fontWeight: 600, fontSize: 40, color: top ? "#FFFFFF" : P.mute}}>{b.label}</div>
  </AbsoluteFill>;
};

const Versus: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const show = ease(f, f0 + 10, f0 + 18);
  const side = (who: "a" | "b", top: number) => {
    const S = who === "a" ? D.a : D.b;
    const win = b.win === who;
    const col = who === "a" ? D.accent : D.accent2;
    const score = who === "a" ? b.sa : b.sb;
    return <div style={{position: "absolute", left: 0, right: 0, top, height: 700, background: win && show > 0.5 ? `${col}1F` : "transparent"}}>
      <Shape name={S?.geo ?? ""} x={60} y={110} w={360} h={480} fill={col}/>
      <div style={{position: "absolute", left: 460, right: 50, top: 120, fontFamily: COND, fontWeight: 700, fontSize: fit(S?.name ?? "", 120, 560, 0.5), lineHeight: 1, color: P.ink}}>{S?.name}</div>
      <div style={{position: "absolute", left: 460, right: 50, top: 260, fontFamily: COND, fontWeight: 700, fontSize: fit((who === "a" ? b.a : b.b) ?? "", 250, 560, 0.62), lineHeight: 1, color: col,
        opacity: show, transform: `translateY(${(1 - show) * 30}px)`}}>{who === "a" ? b.a : b.b}</div>
      <div style={{position: "absolute", left: 460, top: 540, display: "flex", gap: 12, alignItems: "center"}}>
        {Array.from({length: 5}).map((_, i) => <div key={i} style={{width: 44, height: 44, borderRadius: 22, background: i < (score ?? 0) - (win ? 1 - show : 0) ? col : P.empty}}/>)}
        {win && <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 38, color: col, marginLeft: 12, opacity: show}}>AHEAD</div>}
      </div>
    </div>;
  };
  return <AbsoluteFill>
    {side("a", 150)}
    <div style={{position: "absolute", left: 0, right: 0, top: 850, height: 190, background: P.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      transform: `scaleY(${ease(f, f0, f0 + 6)})`}}>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: fit(b.label ?? "", 96, 980, 0.46), color: "#FFFFFF", lineHeight: 1.05}}>{b.label}</div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, color: "#FFFFFF", opacity: 0.7}}>{b.note}</div>
    </div>
    {side("b", 1040)}
  </AbsoluteFill>;
};

const Score: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const p = pop(f, f0);
  const aw = (b.sa ?? 0) > (b.sb ?? 0);
  const row = (S: {name: string; geo: string} | undefined, n: number, col: string, win: boolean, top: number) => <div style={{position: "absolute", left: 60, right: 60, top, height: 560,
    borderRadius: 40, background: win ? col : `${col}22`, display: "flex", alignItems: "center", padding: "0 50px", gap: 30}}>
    <div style={{position: "relative", width: 300, height: 400}}><Shape name={S?.geo ?? ""} x={0} y={0} w={300} h={400} fill={win ? "#FFFFFF" : col} stroke={win ? "#FFFFFF" : P.ink}/></div>
    <div style={{flex: 1, fontFamily: COND, fontWeight: 700, fontSize: fit(S?.name ?? "", 120, 360, 0.5), color: win ? "#FFFFFF" : P.ink, lineHeight: 1}}>{S?.name}</div>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: 380, lineHeight: 1, color: win ? "#FFFFFF" : col, transform: `scale(${0.6 + 0.4 * p})`}}>{n}</div>
  </div>;
  return <AbsoluteFill>
    <div style={{position: "absolute", left: 60, top: 170, fontFamily: SANS, fontWeight: 800, fontSize: 48, letterSpacing: 6, color: P.mute}}>FINAL SCORE</div>
    {row(D.a, b.sa ?? 0, D.accent, aw, 270)}
    {row(D.b, b.sb ?? 0, D.accent2, !aw, 870)}
    <div style={{position: "absolute", left: 60, right: 60, top: 1480, fontFamily: SANS, fontSize: 30, lineHeight: 1.35, color: P.mute}}>Five categories, one point each. Source: {D.source}</div>
  </AbsoluteFill>;
};

// Every state's number on the map. With `anim` the states fill one by one; "mapend" holds the finished map under the
// closing question, with the caution line and the source below it. Header, map and footer are fixed strips: nothing overlaps.
const MapBeat: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const end = b.kind === "mapend", foot = !!b.note || end;
  const h = foot ? 1000 : 1150, w = h * MAP_RATIO;      // with a footer the map is shorter, so the caution line stays clear of the Shorts overlay
  const ring = Object.fromEntries((b.ring ?? []).map((n) => [n, P.ink]));
  return <AbsoluteFill>
    <div style={{position: "absolute", left: 60, right: 60, top: 150, fontFamily: COND, fontWeight: 700, fontSize: 84, lineHeight: 1.05, color: P.ink}}><Rich text={(end ? b.q : b.title) ?? ""} acc={D.accent}/></div>
    <div style={{position: "absolute", left: 60, right: 60, top: 350, fontFamily: SANS, fontWeight: end ? 700 : 400, fontSize: end ? 44 : 36, color: end ? D.accent2 : P.mute}}>{b.sub}</div>
    {b.legend && <div style={{position: "absolute", left: 60, right: 60, top: 404, display: "flex", gap: 30, alignItems: "center", opacity: end ? 1 : ease(f, f0 + 6, f0 + 14)}}>
      {b.legend.map((k) => <div key={k.label} style={{display: "flex", alignItems: "center", gap: 10}}>
        <div style={{width: 28, height: 28, borderRadius: 7, background: k.color, border: `1.5px solid ${P.line}`}}/>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 27, color: P.ink}}>{k.label}</div></div>)}
    </div>}
    <div style={{opacity: end ? 1 : ease(f, f0, f0 + 8)}}><StateMap states={D.map ?? []} colors={D.bands} x={(W - w) / 2} y={b.legend ? 452 : 440} h={b.legend ? h - 12 : h} fs={24}
      frame={b.anim ? f : null} t0={f0} ring={ring}/></div>
    {b.note && <div style={{position: "absolute", left: 60, right: 60, top: 1468, fontFamily: SANS, fontWeight: 600, fontSize: 34, lineHeight: 1.3, color: P.ink,
      opacity: end ? 1 : ease(f, Math.min(f0 + 135, F(b.t1) - 75), Math.min(f0 + 147, F(b.t1) - 63))}}>{b.note}</div>}
    {end && <div style={{position: "absolute", left: 60, right: 330, top: 1612, fontFamily: SANS, fontSize: 23, lineHeight: 1.3, color: P.mute}}>Source: {D.source}</div>}
  </AbsoluteFill>;
};

const End: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const p = pop(f, f0);
  return <AbsoluteFill style={{justifyContent: "center", padding: "0 70px"}}>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: fit(b.q ?? "", 150, 940, 0.27), lineHeight: 1.03, color: D.accent, transform: `translateY(${(1 - p) * 40}px)`}}>{b.q}</div>
    <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 54, color: P.ink, marginTop: 24, opacity: ease(f, f0 + 8, f0 + 16)}}>{b.sub}</div>
    <div style={{fontFamily: SANS, fontSize: 28, lineHeight: 1.35, color: P.mute, marginTop: 50, opacity: ease(f, f0 + 14, f0 + 22)}}>Source: {D.source}</div>
  </AbsoluteFill>;
};

const KINDS: Record<string, React.FC<{D: BeatData; b: Beat; f0: number}>> = {hook: Hook, clue: Clue, count: Count, reveal: Reveal, recap: Recap, rank: Rank, versus: Versus, score: Score, map: MapBeat, end: End,
  spot: Spot, fact: Fact, say: Hook, mapend: MapBeat, grid: Grid, race: Race, stack: Stack, pick: Pick, tally: Tally, event: EventBeat, line100: Line100, shift: Shift};
const DARK = (b: Beat) => b.kind === "count" || b.kind === "reveal" || (b.kind === "rank" && b.rank === 1);

const musicVol = (D: BeatData, fr: number) => {
  if (!D.vo?.length) return 0.5;      // text-led cut, music alone: leave headroom
  const t = fr / FPS;
  const near = Math.min(...D.vo.map((v) => t < v.at ? v.at - t : t > v.at + v.sec ? t - v.at - v.sec : 0));
  return 0.14 + 0.31 * Math.min(1, near / 0.2);
};

export const BeatStory: React.FC<{D: BeatData}> = ({D}) => {
  const f = useCurrentFrame();
  const b = D.beats.find((x) => f >= F(x.t0) && f < F(x.t1)) ?? D.beats[D.beats.length - 1];
  const K = KINDS[b.kind];
  const f0 = F(b.t0);
  // a quick push-in on every cut keeps the frame moving
  const cut = 1 + 0.04 * Math.max(0, 1 - (f - f0) / 7);
  return <AbsoluteFill style={{background: P.bg}}>
    <VoxFonts/>
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${P.bg2} 0%, ${P.bg} 70%)`}}/>
    <AbsoluteFill style={{transform: `scale(${cut})`}}>{K ? <K D={D} b={b} f0={f0}/> : null}</AbsoluteFill>
    <Chrome D={D} dark={DARK(b)}/>
    <Audio src={staticFile(`datayt/beats/${D.id}/music.wav`)} volume={(fr) => musicVol(D, fr)}/>
    {(D.vo ?? []).map((v) => <Sequence key={v.file} from={F(v.at)}><Audio src={staticFile(`datayt/beats/${D.id}/${v.file}`)}/></Sequence>)}
  </AbsoluteFill>;
};
