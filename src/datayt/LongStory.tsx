// Data Kadai long-form videos (1920x1080, 30 fps): one composition per built config, DATA-LF-<id> in DataVideos.tsx.
// Scenes, chapters and every figure come from public/datayt/long/<id>/data.json (scripts/datayt/build_long.py). Nothing on screen is typed here.
// The frame: a thin progress bar, the chapter name top left, the source chip top right, a small source line bottom left, the Data Kadai mark
// bottom right, a 90 px margin (the Shorts' fonts and palette). Scene kinds: cold, card, line, bars, map, quote, compare, tiles, end.
// Every text sits in a box listed in longBoxes.json, which the builder reads too: it refuses a text that cannot fit, and this file sizes type from the same numbers.
import React from "react";
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame} from "remotion";
import {COND, VoxFonts} from "../voxkit";
import geo from "../../public/datayt/india/geo.json";
import {P} from "./IndiaShort";
import {Mark} from "./Brand";
import {StateMap, MapState} from "./StateMap";
import BOXES from "./longBoxes.json";

const FPS = 30, W = 1920, H = 1080, M = 90;
const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
type Box = {sizes?: number[]; max?: number; min?: number; w: number; wFull?: number; lines?: number; ratio: number};
const BX = BOXES as unknown as Record<string, Box>;
type Rank = {rank: number; name: string; text: string; bucket: number};
type Side = {label: string; text: string; v: number; sub: string};
export type LScene = {i: number; kind: string; ch: number; t0: number; t1: number; cues: number[]; source?: string; title?: string; caption?: string; note?: string; sub?: string;
  lines?: string[]; lit?: {geo: string; name: string; label: string}; n?: string;
  series?: {name: string; color: number; label: string; pts: {m: string; v: number}[]}[]; marks?: {m: string; s: number; text: string}[]; ymin?: number;
  rows?: {label: string; v: number; text: string; w?: number; wtext?: string; hi?: boolean}[]; weightHead?: string;
  top?: Rank[]; bottom?: Rank[]; states?: MapState[]; ring?: string[]; legend?: {lo: string; hi: string; loWord: string; hiWord: string};
  text?: string; by?: string; date?: string; a?: Side; b?: Side; tiles?: {big: string; caption: string; hi?: boolean}[]; q?: string; next?: string; sources?: string[]};
export type LongData = {id: string; title: string; chip: string; sourceShort: string; source: string; accent: string; accent2: string; bands: string[]; fps: number; total: number;
  chapters: {i: number; id: string; title: string; label: string; t0: number; t1: number}[]; scenes: LScene[];
  vo: {file: string; at: number; sec: number}[]; music: string | null; voiced: boolean};
type SP = {D: LongData; s: LScene; f: number};      // f: the frame inside the scene
type G = {name: string; d: string; lx: number; ly: number};
const STATES = geo.states as G[];
const GEO = Object.fromEntries(STATES.map((g) => [g.name, g]));

const F = (s: number) => Math.round(s * FPS);
const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
const pop = (f: number, at: number) => spring({frame: f - at, fps: FPS, config: {damping: 13, stiffness: 170}});
const plain = (t: string) => t.replace(/\*/g, "");
const Rich: React.FC<{text: string; acc: string}> = ({text, acc}) => <>{text.split("*").map((p, i) =>
  i % 2 ? <span key={i} style={{color: acc}}>{p}</span> : <React.Fragment key={i}>{p}</React.Fragment>)}</>;
const mix = (a: string, b: string, p: number) => {
  const h = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16), q = Math.max(0, Math.min(1, p));
  return "#" + [0, 1, 2].map((i) => Math.round(h(a, i) + (h(b, i) - h(a, i)) * q).toString(16).padStart(2, "0")).join("");
};
// one line, shrunk to fit its box (the box's own width unless given)
const fit = (t: string, key: string, w?: number, max?: number) => {
  const b = BX[key];
  return Math.min(max ?? b.max ?? 100, (w ?? b.w) / (Math.max(1, plain(t).length) * b.ratio));
};
// the largest of the box's sizes at which the text wraps into at most its lines (python: n_lines in build_long.py counts the same way)
const wrap = (t: string, key: string, w?: number) => {
  const b = BX[key], width = w ?? b.w, sizes = b.sizes as number[];
  const count = (s: number) => {
    const per = width / (s * b.ratio);
    let n = 1, cur = 0;
    for (const x of plain(t).split(" ")) {
      if (cur && cur + 1 + x.length > per) { n++; cur = x.length; } else cur += (cur ? 1 : 0) + x.length;
    }
    return n;
  };
  const size = sizes.find((s) => count(s) <= (b.lines as number)) ?? sizes[sizes.length - 1];
  return {size, lines: count(size)};
};
const cue = (s: LScene, k: number, dflt: number) => (s.cues && s.cues[k] != null ? F(s.cues[k]) : dflt);

const Head: React.FC<{t?: string; f: number; acc: string}> = ({t, f, acc}) => {
  if (!t) return null;
  const {size} = wrap(t, "head"), q = ease(f, 0, 10);
  return <div style={{position: "absolute", left: M, top: 100, width: BX.head.w, fontFamily: COND, fontWeight: 700, fontSize: size, lineHeight: 1.05, color: P.ink,
    opacity: q, transform: `translateY(${(1 - q) * 14}px)`}}><Rich text={t} acc={acc}/></div>;
};
const Cap: React.FC<{t?: string; f: number; at: number; top: number; w?: number}> = ({t, f, at, top, w}) => {
  if (!t) return null;
  const {size} = wrap(t, "caption", w);
  return <div style={{position: "absolute", left: M, top, width: w ?? BX.caption.w, fontFamily: SANS, fontWeight: 600, fontSize: size, lineHeight: 1.3, color: P.mute,
    opacity: ease(f, at, at + 10)}}>{t}</div>;
};

// ---------------------------------------------------------------- cold open: two or three big lines, the India map with one state lit
const Cold: React.FC<SP> = ({D, s, f}) => {
  const lines = s.lines ?? [], lit = s.lit;
  const colW = lit ? BX["cold.line"].w : (BX["cold.line"].wFull as number);
  const size = Math.min(...lines.map((l) => fit(l, "cold.line", colW)));
  const h = 880, S = h / geo.h, mw = geo.w * S, mx = W - M - mw, my = 100;
  const g = lit ? GEO[lit.geo] : undefined;
  const on = pop(f, cue(s, 1, 60) - 4), pulse = ((f - cue(s, 1, 60) + 40) % 40) / 40;
  return <AbsoluteFill>
    <div style={{position: "absolute", left: M, width: colW, top: (H - lines.length * size * 1.06) / 2 - 20}}>
      {lines.map((l, i) => {
        const q = pop(f, 2 + i * 9);
        return <div key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: size, lineHeight: 1.06, color: P.ink, whiteSpace: "nowrap", opacity: Math.min(1, q * 1.4),
          transform: `translateY(${(1 - q) * 50}px)`}}><Rich text={l} acc={D.accent}/></div>;
      })}
    </div>
    {lit && g && <svg width={mw} height={h} style={{position: "absolute", left: mx, top: my, overflow: "visible", opacity: ease(f, 14, 30)}}>
      <g transform={`scale(${S})`}>
        {STATES.map((st) => <path key={st.name} d={st.d} fillRule="evenodd" fill={st.name === lit.geo ? mix(P.empty, D.accent, on) : P.empty}
          stroke={st.name === lit.geo ? D.accent : P.ink} strokeOpacity={st.name === lit.geo ? 1 : 0.45} strokeWidth={st.name === lit.geo ? 6 : 1.1} strokeLinejoin="round"/>)}
        <circle cx={g.lx} cy={g.ly} r={46 / S} fill="none" stroke={D.accent} strokeWidth={6 / S} opacity={on}/>
        <circle cx={g.lx} cy={g.ly} r={(46 + 60 * pulse) / S} fill="none" stroke={D.accent2} strokeWidth={6 / S} opacity={(1 - pulse) * on}/>
        <g opacity={Math.min(1, on * 1.4)}>
          <text x={g.lx + 70 / S} y={g.ly - 10 / S} fontFamily={COND} fontWeight={700} fontSize={46 / S} fill={D.accent} stroke={P.bg} strokeWidth={8 / S} paintOrder="stroke">{lit.name}</text>
          <text x={g.lx + 70 / S} y={g.ly + 78 / S} fontFamily={COND} fontWeight={700} fontSize={92 / S} fill={D.accent} stroke={P.bg} strokeWidth={10 / S} paintOrder="stroke">{lit.label}</text>
        </g>
      </g>
    </svg>}
  </AbsoluteFill>;
};

// ---------------------------------------------------------------- chapter card: the number, the title
const Card: React.FC<SP> = ({D, s, f}) => {
  const T = wrap(s.title ?? "", "card.title"), p = pop(f, 2);
  const sub = s.sub ? wrap(s.sub, "card.sub") : null;
  return <AbsoluteFill>
    <div style={{position: "absolute", right: 70, top: 120, fontFamily: COND, fontWeight: 700, fontSize: 700, lineHeight: 1, color: "rgba(255,255,255,0.10)", opacity: ease(f, 0, 12)}}>{s.n}</div>
    <div style={{position: "absolute", left: M, top: 300, fontFamily: SANS, fontWeight: 800, fontSize: 36, letterSpacing: 10, color: D.accent2, opacity: ease(f, 0, 8)}}>CHAPTER {s.n}</div>
    <div style={{position: "absolute", left: M, top: 356, height: 6, width: 220 * ease(f, 2, 18), background: D.accent2, borderRadius: 3}}/>
    <div style={{position: "absolute", left: M, top: 392, width: BX["card.title"].w, fontFamily: COND, fontWeight: 700, fontSize: T.size, lineHeight: 1.04, color: "#FFFFFF",
      opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 50}px)`}}>{s.title}</div>
    {sub && s.sub && <div style={{position: "absolute", left: M, top: 392 + T.lines * T.size * 1.04 + 28, width: BX["card.sub"].w, fontFamily: SANS, fontWeight: 600, fontSize: sub.size, lineHeight: 1.3,
      color: "rgba(255,255,255,0.85)", opacity: ease(f, 14, 24)}}>{s.sub}</div>}
  </AbsoluteFill>;
};

// ---------------------------------------------------------------- line chart: one to three monthly series, months along the bottom, the last point labelled
const niceStep = (span: number) => [1, 2, 2.5, 5, 10, 20, 25, 50, 100].find((x) => span / x <= 5) ?? 200;
const LineChart: React.FC<SP> = ({D, s, f}) => {
  const ser = s.series ?? [], n = ser[0]?.pts.length ?? 0;
  if (n < 2) return null;
  const X0 = 190, X1 = 1470, Y0 = 280, Y1 = 770, LX = 1530, cols = [D.accent, D.accent2, P.mute];
  const all = ser.flatMap((q) => q.pts.map((p) => p.v)), lo = s.ymin ?? Math.min(0, ...all), hi = Math.max(...all);
  const step = niceStep(hi - lo), ymin = Math.floor(lo / step) * step, ymax = Math.ceil((hi * 1.04) / step) * step;
  const x = (i: number) => X0 + ((X1 - X0) * i) / (n - 1), y = (v: number) => Y1 - ((Y1 - Y0) * (v - ymin)) / (ymax - ymin);
  const draw = ease(f, 8, 62), reach = draw * (n - 1), done = ease(f, 60, 70);
  const ticks: number[] = [];
  for (let v = ymin; v <= ymax + 1e-9; v += step) ticks.push(v);
  let every = 1;
  while (((X1 - X0) / (n - 1)) * every < 96) every++;
  while ((n - 1) % every !== 0 && every < n - 1) every++;
  const months = ser[0].pts.map((p) => p.m);
  // the end labels sit in their own column; when the lines end close together they are pushed apart and joined to their points by a thin line
  const order = ser.map((q, k) => ({k, y: y(q.pts[n - 1].v)})).sort((a, b) => a.y - b.y), SEP = 120, ly: number[] = [];
  order.forEach((e, j) => { ly[e.k] = j === 0 ? e.y : Math.max(e.y, ly[order[j - 1].k] + SEP); });
  const over = Math.max(...ly) - (Y1 + 6);
  if (over > 0) ly.forEach((v, k) => { ly[k] = v - over; });
  return <AbsoluteFill>
    <Head t={s.title} f={f} acc={D.accent}/>
    <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
      {ticks.map((v) => <g key={v}>
        <line x1={X0} y1={y(v)} x2={X1} y2={y(v)} stroke={P.line} strokeWidth={v === ymin ? 3 : 1.5} opacity={v === ymin ? 0.9 : 0.45}/>
        <text x={X0 - 18} y={y(v) + 9} textAnchor="end" fontFamily={SANS} fontWeight={600} fontSize={26} fill={P.mute}>{v.toFixed(Number.isInteger(step) ? 0 : 1)}</text>
      </g>)}
      {months.map((m, i) => {
        if (i % every !== 0) return null;
        const [mo, yy] = m.split("-"), prev = i >= every ? months[i - every].split("-")[1] : "";
        return <g key={m}>
          <text x={x(i)} y={Y1 + 44} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={28} fill={P.ink}>{mo}</text>
          {yy !== prev && <text x={x(i)} y={Y1 + 78} textAnchor="middle" fontFamily={SANS} fontWeight={600} fontSize={24} fill={P.mute}>{`20${yy}`}</text>}
        </g>;
      })}
      {[...ser].reverse().map((q) => {
        const k = q.color, d = "M" + q.pts.map((p, i) => `${x(i)},${y(p.v)}`).join(" L");
        return <g key={q.name}>
          <path d={d} fill="none" stroke={cols[k % 3]} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw}/>
          {q.pts.map((p, i) => i < n - 1 && reach >= i && <circle key={i} cx={x(i)} cy={y(p.v)} r={7} fill={P.bg} stroke={cols[k % 3]} strokeWidth={4}/>)}
          {reach >= n - 1 - 1e-6 && <circle cx={x(n - 1)} cy={y(q.pts[n - 1].v)} r={14} fill={cols[k % 3]}/>}
        </g>;
      })}
      {(s.marks ?? []).map((mk) => {
        const i = months.indexOf(mk.m), v = ser[mk.s].pts[i].v;
        const edge = i === 0 || i === n - 1;      // at either end the label sits beside its point, inside the chart, clear of the axis numbers
        const anchor = i === 0 ? "start" : i === n - 1 ? "end" : "middle", tx = x(i) + (i === 0 ? 24 : i === n - 1 ? -24 : 0);
        const nb = i === 0 ? ser[mk.s].pts[1]?.v : i === n - 1 ? ser[mk.s].pts[n - 2]?.v : undefined;
        const climbs = nb != null && y(nb) < y(v) - 12;      // the line rises away from this end point: a label above would sit on it
        const ty = (edge && climbs) || (!edge && v < 0) ? y(v) + 62 : y(v) - 28;      // below a middle point under zero, off the zero line
        return <g key={mk.m} opacity={reach >= i ? ease(f, 8 + (54 * i) / (n - 1), 8 + (54 * i) / (n - 1) + 8) : 0}>
          <circle cx={x(i)} cy={y(v)} r={13} fill={cols[mk.s % 3]}/>
          <text x={tx} y={ty} textAnchor={anchor} fontFamily={COND} fontWeight={700} fontSize={48} fill={cols[mk.s % 3]} stroke={P.bg} strokeWidth={10} paintOrder="stroke">{mk.text}</text>
        </g>;
      })}
      {ser.map((q, k) => <g key={q.name} opacity={done}>
        <line x1={X1 + 22} y1={y(q.pts[n - 1].v)} x2={LX - 10} y2={ly[k]} stroke={cols[q.color % 3]} strokeWidth={3} opacity={0.5}/>
        <text x={LX} y={ly[k] - 40} fontFamily={SANS} fontWeight={700} fontSize={fit(q.name, "line.name")} fill={cols[q.color % 3]}>{q.name}</text>
        <text x={LX} y={ly[k] + 34} fontFamily={COND} fontWeight={700} fontSize={72} fill={cols[q.color % 3]}>{q.label}</text>
      </g>)}
    </svg>
    <Cap t={s.caption} f={f} at={64} top={895}/>
  </AbsoluteFill>;
};

// ---------------------------------------------------------------- bars: 3 to 12 rows, a bar thicker for a bigger weight when the rows carry one
const Bars: React.FC<SP> = ({D, s, f}) => {
  const rows = s.rows ?? [], n = rows.length, wt = rows.some((r) => r.w != null);
  const fs = n >= 9 ? 38 : n >= 6 ? 42 : 50;
  const top = 270, bottom = s.caption ? 880 : 960, pitch = Math.min(120, (bottom - top) / n);
  const BX0 = 740, BX1 = 1500, LR = 710;
  const vals = rows.map((r) => r.v), vmin = Math.min(0, ...vals), vmax = Math.max(...vals);
  const x = (v: number) => BX0 + ((BX1 - BX0) * (v - vmin)) / (vmax - vmin);
  const wmax = Math.max(...rows.map((r) => r.w ?? 0));
  return <AbsoluteFill>
    <Head t={s.title} f={f} acc={D.accent}/>
    {wt && s.weightHead && <div style={{position: "absolute", right: M, width: 260, top: 236, textAlign: "right", fontFamily: SANS, fontWeight: 800, fontSize: fit(s.weightHead, "bars.head"),
      letterSpacing: 2, textTransform: "uppercase", color: P.mute, opacity: ease(f, 4, 14)}}>{s.weightHead}</div>}
    {vmin < 0 && <div style={{position: "absolute", left: x(0) - 1.5, top: top - 6, width: 3, height: n * pitch + 12, background: P.ink, opacity: 0.6}}/>}
    {rows.map((r, i) => {
      const at = 6 + i * 5, grow = ease(f, at, at + 18), t = wt ? 14 + (pitch * 0.84 - 14) * ((r.w ?? 0) / wmax) : pitch * 0.6;
      const col = r.v < 0 ? P.good : r.hi ? D.accent : D.bands[1], x0 = x(0), x1 = x0 + (x(r.v) - x0) * grow;
      return <div key={i} style={{position: "absolute", left: 0, top: top + i * pitch, width: W, height: pitch, opacity: ease(f, at, at + 6)}}>
        <div style={{position: "absolute", left: M, width: LR - M, height: pitch, display: "flex", alignItems: "center", justifyContent: "flex-end", fontFamily: COND, fontWeight: 700,
          fontSize: fit(r.label, "bars.label", undefined, fs), color: r.hi ? D.accent : P.ink, whiteSpace: "nowrap"}}>{r.label}</div>
        <div style={{position: "absolute", left: Math.min(x0, x1), width: Math.abs(x1 - x0), top: (pitch - t) / 2, height: t, borderRadius: 8, background: col}}/>
        <div style={{position: "absolute", left: r.v < 0 ? x0 + 14 : x1 + 14, top: 0, height: pitch, display: "flex", alignItems: "center", fontFamily: COND, fontWeight: 700, fontSize: fs + 6,
          whiteSpace: "nowrap", color: r.v < 0 ? P.good : r.hi ? D.accent : P.ink, opacity: ease(f, at + 10, at + 18)}}>{r.text}</div>
        {wt && <div style={{position: "absolute", right: M, width: 130, top: 0, height: pitch, display: "flex", alignItems: "center", justifyContent: "flex-end", fontFamily: COND, fontWeight: 700,
          fontSize: fs, color: P.mute}}>{r.wtext}</div>}
      </div>;
    })}
    <Cap t={s.caption} f={f} at={30} top={900}/>
  </AbsoluteFill>;
};

// ---------------------------------------------------------------- map: the ranked list on the left, the state map on the right 60%
const MapScene: React.FC<SP> = ({D, s, f}) => {
  const h = 880, mx = W - M - geo.w * (h / geo.h), my = 100;
  const T = wrap(s.title ?? "", "map.title");
  let y = 100;
  const titleTop = y; y += T.lines * T.size * 1.05 + 12;
  const subTop = y; if (s.sub) y += 50;
  const hi1 = y + 8; y += 8 + 30;
  const rows1 = y; y += (s.top?.length ?? 0) * 46 + 14;
  const hi2 = y; y += 30;
  const rows2 = y; y += (s.bottom?.length ?? 0) * 46 + 18;
  const legTop = y; y += 34 + 24;
  const noteTop = y;
  const ring = Object.fromEntries((s.ring ?? []).map((nm) => [nm, P.ink]));
  const row = (r: Rank, i: number, top: number) => <div key={r.rank} style={{position: "absolute", left: M, top: top + i * 46, width: BX["map.title"].w, height: 46, display: "flex", alignItems: "center", gap: 14,
    opacity: ease(f, 10 + i * 5, 18 + i * 5), transform: `translateX(${(1 - ease(f, 10 + i * 5, 20 + i * 5)) * -20}px)`}}>
    <div style={{width: 22, height: 22, borderRadius: 6, background: D.bands[r.bucket], flex: "none"}}/>
    <div style={{width: 44, flex: "none", fontFamily: COND, fontWeight: 700, fontSize: 30, color: P.mute}}>{r.rank}</div>
    <div style={{flex: 1, fontFamily: COND, fontWeight: 700, fontSize: fit(r.name, "map.name"), color: P.ink, whiteSpace: "nowrap"}}>{r.name}</div>
    <div style={{width: 160, flex: "none", textAlign: "right", fontFamily: COND, fontWeight: 700, fontSize: 38, color: r.rank === 1 ? D.accent : P.ink}}>{r.text}</div>
  </div>;
  const lab: React.CSSProperties = {position: "absolute", left: M, fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: 4, color: P.mute};
  return <AbsoluteFill>
    <div style={{position: "absolute", left: M, top: titleTop, width: BX["map.title"].w, fontFamily: COND, fontWeight: 700, fontSize: T.size, lineHeight: 1.05, color: P.ink,
      opacity: ease(f, 0, 10)}}><Rich text={s.title ?? ""} acc={D.accent}/></div>
    {s.sub && <div style={{position: "absolute", left: M, top: subTop, width: BX["map.sub"].w, fontFamily: SANS, fontWeight: 700, fontSize: fit(s.sub, "map.sub"), color: D.accent2, whiteSpace: "nowrap",
      opacity: ease(f, 4, 14)}}>{s.sub}</div>}
    <div style={{...lab, top: hi1}}>HIGHEST</div>
    {(s.top ?? []).map((r, i) => row(r, i, rows1))}
    <div style={{...lab, top: hi2}}>LOWEST</div>
    {(s.bottom ?? []).map((r, i) => row(r, i, rows2))}
    {s.legend && <div style={{position: "absolute", left: M, top: legTop, height: 34, display: "flex", alignItems: "center", gap: 12, opacity: ease(f, 16, 26)}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 24, color: P.ink}}>{s.legend.loWord} <span style={{color: P.mute}}>{s.legend.lo}</span></div>
      <div style={{display: "flex"}}>{D.bands.map((c, i) => <div key={i} style={{width: 44, height: 22, background: c, borderRadius: i === 0 ? "6px 0 0 6px" : i === 4 ? "0 6px 6px 0" : 0}}/>)}</div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 24, color: P.ink}}><span style={{color: P.mute}}>{s.legend.hi}</span> {s.legend.hiWord}</div>
    </div>}
    {s.note && <div style={{position: "absolute", left: M, top: noteTop, width: BX["map.note"].w, fontFamily: SANS, fontWeight: 600, fontSize: 28, lineHeight: 1.3, color: P.mute,
      opacity: ease(f, 40, 52)}}>{s.note}</div>}
    <div style={{opacity: ease(f, 0, 8)}}><StateMap states={s.states ?? []} colors={D.bands} x={mx} y={my} h={h} frame={f} t0={0} fps={FPS} ring={ring} fs={25}/></div>
  </AbsoluteFill>;
};

// ---------------------------------------------------------------- quote: an official sentence in large type, who said it and when
const Quote: React.FC<SP> = ({D, s, f}) => {
  const t = s.text ?? "", Q = wrap(t, "quote.text"), words = t.split(" "), per = Math.max(1, Math.min(3, 70 / words.length));
  const by = fit(s.by ?? "", "quote.by"), block = Q.lines * Q.size * 1.14 + 44 + by * 1.3 + 40;
  const top = Math.max(290, (H - block) / 2 + 70), end = 6 + words.length * per;
  return <AbsoluteFill>
    <div style={{position: "absolute", left: M - 6, top: top - 190, fontFamily: COND, fontWeight: 700, fontSize: 340, lineHeight: 1, color: D.accent2, opacity: ease(f, 0, 10)}}>“</div>
    <div style={{position: "absolute", left: M, top, width: BX["quote.text"].w, fontFamily: COND, fontWeight: 700, fontSize: Q.size, lineHeight: 1.14, color: P.ink}}>
      {words.map((w, i) => <span key={i} style={{opacity: ease(f, 6 + i * per, 6 + i * per + 6)}}>{w}{" "}</span>)}
    </div>
    <div style={{position: "absolute", left: M, top: top + Q.lines * Q.size * 1.14 + 44, width: BX["quote.by"].w, opacity: ease(f, end, end + 10)}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: by, color: D.accent, whiteSpace: "nowrap"}}>{s.by}</div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: fit(s.date ?? "", "quote.by", undefined, 30), color: P.mute, marginTop: 8, whiteSpace: "nowrap"}}>{s.date}</div>
    </div>
  </AbsoluteFill>;
};

// ---------------------------------------------------------------- compare: two big figures, each with a bar to scale
const Compare: React.FC<SP> = ({D, s, f}) => {
  const a = s.a, b = s.b;
  if (!a || !b) return null;
  const mxv = Math.max(a.v, b.v), CW = 780, size = Math.min(fit(a.text, "cmp.big"), fit(b.text, "cmp.big"));      // one size, so the two figures compare by eye
  const col = (side: Side, left: number, color: string, at: number) => {
    const p = pop(f, at), sub = side.sub ? wrap(side.sub, "cmp.sub") : null;
    return <>
      <div style={{position: "absolute", left, top: 290, width: CW, fontFamily: SANS, fontWeight: 800, fontSize: fit(side.label, "cmp.label"), letterSpacing: 3, textTransform: "uppercase", whiteSpace: "nowrap",
        color: P.ink, opacity: ease(f, at - 2, at + 6)}}>{side.label}</div>
      <div style={{position: "absolute", left, top: 340, width: CW, fontFamily: COND, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap",
        opacity: Math.min(1, p * 1.5), transform: `scale(${0.8 + 0.2 * p})`, transformOrigin: "left center"}}>{side.text}</div>
      <div style={{position: "absolute", left, top: 340 + size * 1.05 + 26, width: CW, height: 26, borderRadius: 13, background: P.empty}}>
        <div style={{height: 26, borderRadius: 13, width: `${(side.v / mxv) * 100 * ease(f, at + 6, at + 26)}%`, background: color}}/></div>
      {sub && side.sub && <div style={{position: "absolute", left, top: 340 + size * 1.05 + 76, width: CW, fontFamily: SANS, fontWeight: 600, fontSize: sub.size, lineHeight: 1.3, color: P.ink,
        opacity: ease(f, at + 14, at + 24)}}>{side.sub}</div>}
    </>;
  };
  return <AbsoluteFill>
    <Head t={s.title} f={f} acc={D.accent}/>
    {col(a, M, D.accent2, 6)}
    {col(b, W - M - CW, D.accent, cue(s, 1, 30) - 14)}
    <div style={{position: "absolute", left: 960 - 1.5, top: 290, width: 3, height: 440, background: P.line, opacity: 0.6}}/>
    <div style={{position: "absolute", left: 960 - 38, top: 450, width: 76, height: 76, borderRadius: 38, background: "#FFFFFF", border: `3px solid ${P.line}`, display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: COND, fontWeight: 700, fontSize: 34, color: P.mute, opacity: ease(f, 14, 24)}}>vs</div>
    <Cap t={s.caption} f={f} at={cue(s, 1, 30)} top={880}/>
  </AbsoluteFill>;
};

// ---------------------------------------------------------------- tiles: three or four number tiles with a short caption each
const Tiles: React.FC<SP> = ({D, s, f}) => {
  const t = s.tiles ?? [], n = t.length, gap = 36, tw = (1740 - gap * (n - 1)) / n, inner = tw - 56;
  const big = Math.min(...t.map((x) => fit(x.big, "tile.big", inner)));      // one figure size across the row
  return <AbsoluteFill>
    <Head t={s.title} f={f} acc={D.accent}/>
    {t.map((x, i) => {
      const at = s.cues && s.cues.length === n ? cue(s, i, 10) - 4 : 10 + i * 16, p = pop(f, at), cap = wrap(x.caption, "tile.caption", inner);
      return <div key={i} style={{position: "absolute", left: M + i * (tw + gap), top: 290, width: tw, height: 480, boxSizing: "border-box", padding: 28, background: "#FFFFFF", border: `2px solid ${P.line}`,
        borderRadius: 26, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 40}px)`}}>
        <div style={{fontFamily: COND, fontWeight: 700, fontSize: big, lineHeight: 1.05, color: x.hi ? D.accent : P.ink, whiteSpace: "nowrap", marginTop: 18}}>{x.big}</div>
        <div style={{width: 64, height: 6, borderRadius: 3, background: D.accent2, margin: "26px 0 24px"}}/>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: cap.size, lineHeight: 1.25, color: P.ink}}>{x.caption}</div>
      </div>;
    })}
    <Cap t={s.note} f={f} at={50} top={810}/>
  </AbsoluteFill>;
};

// ---------------------------------------------------------------- end: the closing question, what to watch next, the sources
const End: React.FC<SP> = ({D, s, f}) => {
  const Q = wrap(s.q ?? "", "end.q"), N = wrap(s.next ?? "", "end.next"), p = pop(f, 4);
  const qH = Q.lines * Q.size * 1.04, nH = 40 + N.lines * N.size * 1.25, qTop = (H - (qH + 56 + nH)) / 2 - 10, nTop = qTop + qH + 56;
  return <AbsoluteFill>
    <div style={{position: "absolute", left: M, top: qTop, width: BX["end.q"].w, fontFamily: COND, fontWeight: 700, fontSize: Q.size, lineHeight: 1.04, color: P.ink,
      opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 40}px)`}}><Rich text={s.q ?? ""} acc={D.accent}/></div>
    <div style={{position: "absolute", left: M, top: nTop, width: BX["end.next"].w, opacity: ease(f, 22, 34)}}>
      <div style={{display: "inline-block", background: D.accent2, color: P.bg, fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: 4, padding: "6px 14px", borderRadius: 8}}>NEXT</div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: N.size, lineHeight: 1.25, color: P.ink, marginTop: 16}}>{s.next}</div>
    </div>
    <div style={{position: "absolute", left: 1150, top: 0, width: 680, height: H, display: "flex", alignItems: "center"}}><div style={{width: 680, boxSizing: "border-box", padding: "34px 36px 26px", background: "#FFFFFF",
      border: `2px solid ${P.line}`, borderRadius: 24, opacity: ease(f, 34, 46)}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: D.accent2}}>SOURCES</div>
      {(s.sources ?? []).map((x, i) => <div key={i} style={{display: "flex", gap: 14, marginTop: 20, opacity: ease(f, 40 + i * 6, 50 + i * 6)}}>
        <div style={{width: 10, height: 10, borderRadius: 5, background: D.accent, marginTop: 13, flex: "none"}}/>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, lineHeight: 1.3, color: P.ink}}>{x}</div>
      </div>)}
    </div></div>
  </AbsoluteFill>;
};

const KINDS: Record<string, React.FC<SP>> = {cold: Cold, card: Card, line: LineChart, bars: Bars, map: MapScene, quote: Quote, compare: Compare, tiles: Tiles, end: End};

// the shared frame: progress bar, chapter name, source chip, source line, mark
const Chrome: React.FC<{D: LongData; s: LScene; frame: number; dark: boolean}> = ({D, s, frame, dark}) => {
  const ink = dark ? "#FFFFFF" : P.ink, label = D.chapters[s.ch]?.label ?? "", src = s.source ?? D.sourceShort;
  return <>
    <div style={{position: "absolute", left: 0, top: 0, height: 8, width: (W * frame) / F(D.total), background: dark ? "#FFFFFF" : D.accent}}/>
    {label && !dark && <div style={{position: "absolute", left: M, top: 32, fontFamily: SANS, fontWeight: 800, fontSize: fit(label, "chapter"), letterSpacing: 3, textTransform: "uppercase", whiteSpace: "nowrap",
      color: D.accent}}>{label}</div>}
    <div style={{position: "absolute", right: M, top: 26, background: dark ? "#FFFFFF" : D.accent2, color: dark ? D.accent : P.bg, fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: 3,
      padding: "7px 14px", borderRadius: 8, whiteSpace: "nowrap"}}>{D.chip}</div>
    <div style={{position: "absolute", left: M, bottom: 36, width: BX.src.w, fontFamily: SANS, fontWeight: 600, fontSize: fit(src, "src"), whiteSpace: "nowrap", color: ink, opacity: 0.7}}>{src}</div>
    <div style={{position: "absolute", right: M, bottom: 30, display: "flex", alignItems: "center", gap: 10, opacity: 0.9}}>
      <Mark size={40} c={dark ? "#FFFFFF" : undefined} h={dark ? "#FFFFFF" : undefined}/>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 32, color: ink}}>DATA <span style={{color: dark ? "#FFFFFF" : P.gold}}>KADAI</span></div>
    </div>
  </>;
};

// the bed ducks under the voice, as in the Shorts; with no narration (the check build) it stays low
const musicVol = (D: LongData, fr: number) => {
  if (!D.vo?.length) return 0.5;
  const t = fr / FPS, near = Math.min(...D.vo.map((v) => (t < v.at ? v.at - t : t > v.at + v.sec ? t - v.at - v.sec : 0)));
  return 0.14 + 0.31 * Math.min(1, near / 0.2);
};

export const LongStory: React.FC<{D: LongData}> = ({D}) => {
  const frame = useCurrentFrame();
  const s = D.scenes.find((x) => frame >= F(x.t0) && frame < F(x.t1)) ?? D.scenes[D.scenes.length - 1];
  const K = KINDS[s.kind], f0 = F(s.t0), f = frame - f0, dark = s.kind === "card";
  const push = 1 + 0.03 * Math.max(0, 1 - f / 8);      // a quick push-in on every cut keeps the frame moving
  return <AbsoluteFill style={{background: dark ? D.accent : P.bg}}>
    <VoxFonts/>
    {!dark && <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${P.bg2} 0%, ${P.bg} 70%)`}}/>}
    <AbsoluteFill style={{transform: `scale(${push})`}}>{K ? <K D={D} s={s} f={f}/> : null}</AbsoluteFill>
    <Chrome D={D} s={s} frame={frame} dark={dark}/>
    {D.music ? <Audio src={staticFile(`datayt/long/${D.id}/${D.music}`)} volume={(fr) => musicVol(D, fr)}/> : null}
    {(D.vo ?? []).map((v, i) => <Sequence key={i} from={F(v.at)}><Audio src={staticFile(`datayt/long/${D.id}/${v.file}`)}/></Sequence>)}
  </AbsoluteFill>;
};
