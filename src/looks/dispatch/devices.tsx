// Kadai Dispatch chart devices: ONE honest comparison object per beat (plan.ts picks it from the data). Every bar is to
// scale (one scale per frame, the story's running maximum for its unit), every printed value is drawn only from its lock
// frame (shapes may show magnitude first: "object first"), every name is a data string and its own numbers are gated too.
// No device fills a whole (no 100% frame behind shares) and no count can be read off the screen before it is said (tiles
// and segments are divided only on the word). A bar's colour is its thing's colour for the whole Short (plan.ts roles);
// a thing that is not the focus and has no colour is neutral hatch. Colours come from brand tokens; fonts from roles.
import React from "react";
import {evolvePath} from "@remotion/paths";
import type {LookBrand} from "../brands/types";
import {measure} from "../shared/fit";
import {assertLocked} from "../shared/lock";
import {EditorMark, markSeed} from "../shared/Marks";
import {css, F, FOOT, Gated, hatch, Ink, io, LABEL, ramp, Slug, textOn} from "./kit";
import type {Device, Gate, Proof, Role, Row, Teaser} from "./plan";

export type Pal = {text: string; soft: string; hot: string; ghost: string; amber: string; amberText: string; rule: string; dark: boolean};
export type Box = {x: number; y: number; w: number; h: number};
export type Ctx = {B: LookBrand; f: number; P: Pal; box: Box; grow: number; seed: number; f1: number; markAt?: number};

const LBL = LABEL;       // value labels (spec: labels >= 44 px)
const NAME = LABEL;      // row names
export const lockOf = (r: Pick<Row, "lockF" | "num">) => Math.max(r.lockF, r.num ? r.num.lockF : 0);
const settleBy = (c: Ctx, at: number, dur: number) => Math.min(at, c.f1 - 12 - dur);

// ---------- paint: a row's colour is its thing's colour ----------
export const roleColor = (c: Ctx, role: Role) => (c.P.dark && role === "ink" ? c.B.c.paper : c.B.c[role]);
export type Paint = {fill: string; border: string | null; inLabel: string; solid: boolean; line: string};
export const paint = (c: Ctx, r: Pick<Row, "role" | "ghost">): Paint => {
  const {B, P} = c;
  const col = r.role ? roleColor(c, r.role) : null;
  if (r.ghost) return {fill: hatch((col ?? P.ghost) + "30", 45, 3, 9), border: col ?? P.ghost, inLabel: P.soft, solid: false, line: col ?? P.soft};
  if (!col) return {fill: hatch(P.text + "50", 45, 4, 11), border: P.text, inLabel: P.text, solid: false, line: P.text};
  const bgRole = P.dark && r.role === "ink" ? "paper" : r.role!;
  return {fill: col, border: P.dark && r.role === "accent" ? B.c.paper : null, inLabel: B.c[textOn(B, bgRole, LBL)], solid: true, line: col};
};

// A value label: the printed text, or a slug before its lock.
const Val: React.FC<{c: Ctx; r: Row; size: number; color: string; at?: number}> = ({c, r, size, color, at}) => {
  const ff = F.body(c.B, 700);
  const lock = Math.max(lockOf(r), at ?? 0);
  if (c.f < lock) return <Slug w={measure(r.text, ff, size)} size={size} color={color}/>;
  if (r.num) assertLocked(r.num, c.f, "Dispatch chart label");
  const p = ramp(c.f, lock, 6);
  return <span style={{...css(ff, size), color, display: "inline-block", clipPath: `inset(-20% ${(1 - p) * 100}% -20% 0)`}}>{r.text}</span>;
};

// A name: a data string, its own value-like numbers gated by their lock frames ("200 ml" of "200 ml of Campa").
export const Name: React.FC<{c: Ctx; text: string; gates?: Gate[]; lockF?: number; size?: number; color?: string; style?: React.CSSProperties; at?: number; maxW?: number; weight?: number}> =
  ({c, text, gates = [], lockF, size = NAME, color, style, at, maxW, weight = 700}) => {
  const ff = F.body(c.B, weight);
  let s = size;
  while (maxW && s > 36 && measure(text, ff, s) > maxW) s--;
  return <div style={{position: "absolute", ...css(ff, s), color: color ?? c.P.text, opacity: at === undefined ? 1 : ramp(c.f, at, 6), ...style}}>
    <Gated text={text} nums={gates} lockF={lockF ?? c.f1} f={c.f} ff={ff} size={s} width={Math.ceil(measure(text, ff, s)) + 4} color={color ?? c.P.text} hot={color ?? c.P.text} lineH={1.15}/>
  </div>;
};
const rowName = (c: Ctx, r: Row, p: {color?: string; style?: React.CSSProperties; at?: number; maxW?: number; size?: number}) =>
  <Name c={c} text={r.name} gates={r.gates} lockF={lockOf(r)} {...p}/>;

// ---------- preferred heights (the page gives a device about this much and the colour band takes the rest) ----------
export const deviceH = (d: Device): number => {
  switch (d.kind) {
    case "rows": { const n = d.rows.length + (d.ghost ? 1 : 0); return (n === 1 ? 270 : n === 2 ? 450 : 130 + n * 165) + (d.refs.length ? 80 : 0); }
    case "diverge": { const n = d.rows.length + (d.ghost ? 1 : 0); return n === 1 ? 300 : n === 2 ? 470 : 150 + n * 165; }
    case "periods": return 560;
    case "tally": return 330;
    case "duration": return 300;
    case "threshold": return 330;
    case "price": return (d.rows.length + 1) * 210 + (d.old ? 150 : 0);
    case "sum": return 430;
    case "inset": return 660;
    case "ratio": return 520;
  }
};

// ---------- horizontal rows (rows, diverge, inset, ghosts) ----------
const BarRows: React.FC<{c: Ctx; rows: Row[]; scale: number; axisX: number; leftRoom: number; rightRoom: number; y: number; th: number; pitch: number;
  stagger?: number; noLabels?: boolean; growAt?: number[]; range?: {lo: number; hi: number; idx: number} | null}> =
  ({c, rows, scale, axisX, leftRoom, rightRoom, y, th, pitch, stagger = 4, noLabels, growAt, range}) => {
  const {B, f, P} = c;
  const ff = F.body(B, 700);
  return <>
    {rows.map((r, i) => {
      const yy = y + i * pitch, dir = r.v < 0 ? -1 : 1, len = (Math.abs(r.v) / scale) * (r.v < 0 ? leftRoom : rightRoom);
      const at = growAt?.[i] ?? (r.ghost ? c.grow - 10 : c.grow + i * stagger);
      const g = settleBy(c, at, 14);
      const p = ramp(f, g, 14, io);
      const Lx = len * p;
      const pt = paint(c, r);
      const lw = measure(r.text, ff, LBL);
      const rLo = range && range.idx === i ? (range.lo / scale) * rightRoom : Infinity;
      const inEnd = Math.min(len, rLo - 4);
      const inside = pt.solid && inEnd >= lw + 36;
      const outRoom = dir > 0 ? (c.box.x + c.box.w) - (axisX + len) : (axisX - len) - c.box.x;
      const outside = !inside && outRoom >= lw + 20;
      const x0 = dir > 0 ? axisX : axisX - Lx;
      const nameX = dir > 0 ? axisX : Math.max(c.box.x, axisX - len);
      return <React.Fragment key={i}>
        {rowName(c, r, {color: r.ghost ? P.soft : P.text, at: g - 4, maxW: c.box.w,
          style: dir > 0 ? {left: nameX, top: yy - NAME * 1.25} : {left: c.box.x, width: axisX - c.box.x - 12, textAlign: "right", top: yy - NAME * 1.25}})}
        <div style={{position: "absolute", left: x0, top: yy, width: Math.max(0, Lx), height: th, background: pt.fill,
          border: r.ghost ? `3px dashed ${pt.border}` : pt.border ? `3px solid ${pt.border}` : undefined, boxSizing: "border-box"}}/>
        {range && range.idx === i && p > 0.98 && (() => {
          const a = axisX + (range.lo / scale) * rightRoom, b2 = axisX + (range.hi / scale) * rightRoom, q = ramp(f, g + 16, 8);
          return <>
            <div style={{position: "absolute", left: a, top: yy - 8, width: (b2 - a) * q, height: th + 16, background: hatch(P.amber, 45, 5, 10), outline: `2px solid ${P.amber}`, opacity: 0.95}}/>
            <div style={{position: "absolute", right: 1080 - b2, top: yy - NAME * 1.25 + 6, opacity: q}}>
              <span style={{...css(F.body(B, 800, 0.08), FOOT), color: P.amberText}}>RANGE</span></div>
          </>;
        })()}
        {!noLabels && p > 0.6 && <div style={{position: "absolute", top: yy + (th - LBL * 1.15) / 2, height: LBL * 1.15, display: "flex", alignItems: "center",
          ...(inside ? (dir > 0 ? {left: axisX + inEnd - lw - 18} : {left: axisX - len + 18})
            : outside ? (dir > 0 ? {left: axisX + len + 14} : {left: axisX - len - 14 - lw})
            : {left: dir > 0 ? axisX + 8 : axisX - lw - 8, top: yy + th + 6})}}>
          {r.hot && c.markAt !== undefined && f >= c.markAt && !inside
            ? <EditorMark kind="circle" at={c.markAt} dur={14} seed={markSeed(c.seed, 7)} color={P.dark ? P.amber : B.c.accent} strokeWidth={5} padding={10}>
                <Val c={c} r={r} size={LBL} color={P.text}/></EditorMark>
            : <Val c={c} r={r} size={LBL} color={inside ? pt.inLabel : r.ghost ? P.soft : P.text}/>}
        </div>}
      </React.Fragment>;
    })}
  </>;
};

// Rows fill the box: thicker bars for fewer rows (130-180 px for one or two, as a printed chart would), centred.
const rowsBlock = (n: number, h: number) => {
  const pitch = Math.max(120, Math.min(h / Math.max(1, n), n <= 2 ? 260 : 200));
  const th = Math.max(56, Math.min(n <= 1 ? 180 : 140, Math.round((pitch - NAME * 1.3 - 34) * 0.92)));
  const used = (n - 1) * pitch + NAME * 1.3 + th;
  return {pitch, th, top: Math.max(0, (h - used) / 2) + NAME * 1.3};
};

const RowsDevice: React.FC<{c: Ctx; d: Extract<Device, {kind: "rows"}>}> = ({c, d}) => {
  const rows = d.ghost ? [d.ghost, ...d.rows] : d.rows;
  const refH = d.refs.length ? 80 : 0;
  const {pitch, th, top} = rowsBlock(rows.length, c.box.h - refH);
  const idx = d.range ? rows.findIndex((r) => r.hot) : -1;
  const ff = F.body(c.B, 700);
  return <>
    <BarRows c={c} rows={rows} scale={d.scale} axisX={c.box.x} leftRoom={0} rightRoom={c.box.w} y={c.box.y + top} th={th} pitch={pitch}
      range={d.range && idx >= 0 ? {lo: d.range.lo.value, hi: d.range.hi.value, idx} : null}/>
    {d.refs.map((r, k) => {
      // a dashed reference line through the bars only (never through a name or a value label), named in full below them
      const x = c.box.x + (r.v / d.scale) * c.box.w, at = settleBy(c, c.grow + 18, 10), op = ramp(c.f, at, 8);
      const labW = measure(r.name, ff, LBL) + 14 + measure(r.text, ff, LBL);
      const left = Math.max(c.box.x, Math.min(x - 1.5, c.box.x + c.box.w - labW));
      const yLab = c.box.y + top + (rows.length - 1) * pitch + th + 30;
      return <React.Fragment key={k}>
        {rows.map((row, j) => {
          const yy = c.box.y + top + j * pitch;
          const len = (Math.abs(row.v) / d.scale) * c.box.w, lw = measure(row.text, ff, LBL);
          // the value label sits inside the bar end or just past it: skip the line where it would cross that label
          const labX0 = len >= lw + 36 ? c.box.x + len - lw - 18 : c.box.x + len + 14, labX1 = labX0 + lw;
          if (x > labX0 - 10 && x < labX1 + 10) return null;
          return <div key={j} style={{position: "absolute", left: x - 1.5, top: yy - 10, height: th + 20, borderLeft: `3px dashed ${c.P.text}`, opacity: op}}/>;
        })}
        <div style={{position: "absolute", left: x - 1.5, top: c.box.y + top + (rows.length - 1) * pitch + th + 10, height: 18, borderLeft: `3px dashed ${c.P.text}`, opacity: op}}/>
        <div style={{position: "absolute", left, top: yLab, opacity: op, display: "flex", gap: 14, alignItems: "baseline", whiteSpace: "nowrap"}}>
          <Name c={c} text={r.name} gates={r.gates} lockF={lockOf(r)} color={c.P.soft} style={{position: "relative"}}/>
          <Val c={c} r={r} size={LBL} color={c.P.soft}/></div>
      </React.Fragment>;
    })}
  </>;
};

// Negatives and mixed signs: one scale for both sides of a zero axis, names above each bar on its axis side, values
// outside the bar ends (room is reserved for them, so a label never sits on a bar or off the box). centre: the axis sits
// in the middle and each side's scale is the largest value shown so far (a teaser whose values land one by one).
const DivergeDevice: React.FC<{c: Ctx; rows: Row[]; ghost?: Row | null; noLabels?: boolean; growAt?: number[]; centre?: boolean}> = ({c, rows: rows0, ghost, noLabels, growAt, centre}) => {
  const {B, f, P, box} = c;
  const rows = ghost ? [ghost, ...rows0] : rows0;
  const shownRows = centre && growAt ? rows.filter((_, i) => f >= growAt[i]) : rows;
  const neg = Math.max(0, ...rows.map((r) => r.v < 0 ? -r.v : 0)), pos = Math.max(0, ...rows.map((r) => r.v > 0 ? r.v : 0));
  const ff = F.body(B, 700);
  const lab = noLabels ? 0 : Math.max(...rows.map((r) => measure(r.text, ff, LBL))) + 22;
  let axisX: number, k: number;
  if (centre) {
    axisX = box.x + box.w / 2;
    k = (box.w / 2 - lab) / Math.max(1e-9, ...shownRows.map((r) => Math.abs(r.v)), 1e-9);
  } else {
    const avail = box.w - (neg > 0 ? lab : 0) - (pos > 0 ? lab : 0);
    k = avail / Math.max(1e-9, neg + pos);
    axisX = box.x + (neg > 0 ? lab : 0) + neg * k;
  }
  const {pitch, th, top} = rowsBlock(rows.length, box.h - 20);
  const at0 = settleBy(c, c.grow - 8, 8);
  const y0 = box.y + top;
  return <>
    <div style={{position: "absolute", left: axisX - 2, top: y0 - NAME * 1.3 - 10, width: 4, height: (rows.length - 1) * pitch + th + NAME * 1.3 + 24, background: P.rule,
      transformOrigin: "top", transform: `scaleY(${ramp(f, at0, 10)})`}}/>
    {rows.map((r, i) => {
      const y = y0 + i * pitch, dir = r.v < 0 ? -1 : 1, len = Math.abs(r.v) * k;
      const g = settleBy(c, growAt?.[i] ?? (r.ghost ? c.grow - 10 : c.grow + i * 4), 14), p = ramp(f, g, 14, io);
      const pt = paint(c, r);
      const lw = measure(r.text, ff, LBL);
      const nameSide: React.CSSProperties = dir > 0 ? {left: axisX + 10} : {right: 1080 - axisX + 10};
      return <React.Fragment key={i}>
        {rowName(c, r, {color: r.ghost ? P.soft : P.text, at: centre ? undefined : g - 4, maxW: dir > 0 ? box.x + box.w - axisX - 10 : axisX - box.x - 10, style: {...nameSide, top: y - NAME * 1.25}})}
        <div style={{position: "absolute", top: y, height: th, width: len * p, left: dir > 0 ? axisX : axisX - len * p, background: pt.fill,
          border: r.ghost ? `3px dashed ${pt.border}` : pt.border ? `3px solid ${pt.border}` : undefined, boxSizing: "border-box"}}/>
        {!noLabels && p > 0.6 && <div style={{position: "absolute", top: y + (th - LBL * 1.15) / 2, height: LBL * 1.15, display: "flex", alignItems: "center",
          left: dir > 0 ? axisX + len + 12 : axisX - len - 12 - lw}}>
          <Val c={c} r={r} size={LBL} color={r.ghost ? P.soft : P.text}/></div>}
      </React.Fragment>;
    })}
  </>;
};

// ---------- columns: two periods of one thing (shares are on 0-100, with no frame or track behind them) ----------
const PeriodsDevice: React.FC<{c: Ctx; d: Extract<Device, {kind: "periods"}>}> = ({c, d}) => {
  const {B, f, P, box} = c;
  const colW = Math.min(220, box.w * 0.28);
  const xs = [box.x + box.w * 0.1, box.x + box.w * 0.6];
  const base = box.y + box.h - 70, maxH = box.h - 70 - 120;
  const tops: number[] = [];
  const els = d.rows.map((r, i) => {
    const g = settleBy(c, c.grow + i * 8, 14), p = ramp(f, g, 14, io);
    const hh = (Math.abs(r.v) / d.scale) * maxH;
    const pt = paint(c, {role: r.role, ghost: false});
    tops.push(base - hh);
    // the earlier period hatched in the thing's colour, the later one solid
    const earlier = i === 0;
    return <React.Fragment key={i}>
      <div style={{position: "absolute", left: xs[i], top: base - hh * p, width: colW, height: hh * p, background: earlier ? hatch(pt.line, 45, 6, 12) : pt.fill,
        border: `3px solid ${pt.line}`, boxSizing: "border-box"}}/>
      {rowName(c, r, {color: P.text, at: g - 4, style: {left: xs[i] - 60, width: colW + 120, top: base + 12, textAlign: "center"}})}
      <div style={{position: "absolute", left: xs[i] - 80, width: colW + 160, top: base - hh - 100, display: "flex", justifyContent: "center"}}>
        {p > 0.9 && (r.hot && c.markAt !== undefined && f >= c.markAt
          ? <EditorMark kind="circle" at={c.markAt} dur={14} seed={markSeed(c.seed, 7)} color={P.dark ? P.amber : B.c.accent} strokeWidth={5} padding={10}>
              <Val c={c} r={r} size={76} color={P.text}/></EditorMark>
          : <Val c={c} r={r} size={76} color={P.text}/>)}</div>
    </React.Fragment>;
  });
  const both = Math.max(...d.rows.map(lockOf));
  const s = ramp(f, settleBy(c, Math.max(both + 4, c.grow + 22), 12), 12, io);
  const x1 = xs[0] + colW, x2 = xs[1];
  const path = `M ${x1} ${tops[0]} L ${x2} ${tops[1]}`;
  const ev = evolvePath(s, path);
  return <>
    {els}
    <div style={{position: "absolute", left: box.x, top: base, width: box.w, height: 3, background: P.rule}}/>
    <svg style={{position: "absolute", left: 0, top: 0, overflow: "visible"}} width={1080} height={1920}>
      <path d={path} stroke={P.text} strokeWidth={3} fill="none" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} opacity={0.8}/>
    </svg>
  </>;
};

// ---------- tally: k of N. Before the word there is only an undivided, empty track (no count can be read); the k tiles
// ink together on k's word, the other N-k appear hatched on N's word. ----------
export const TallyTiles: React.FC<{c: Ctx; k: number; N: number; kF: number; NF: number}> = ({c, k, N, kF, NF}) => {
  const {f, P, box} = c;
  const gap = 10, tw = (box.w - (N - 1) * gap) / N, th = Math.min(240, box.h - 40), y = box.y + (box.h - th) / 2;
  const trackOp = 1 - ramp(f, kF, 6);
  return <>
    <div style={{position: "absolute", left: box.x, top: y, width: box.w * ramp(f, c.grow, 10, io), height: th, border: `3px solid ${P.text}`, boxSizing: "border-box",
      background: hatch(P.soft + "26", -45, 4, 14), opacity: 0.6 * trackOp}}/>
    {Array.from({length: N}, (_, i) => {
      const mine = i < k;
      const at = mine ? kF : NF;
      if (f < at) return null;
      const q = ramp(f, at, 8);
      return <div key={i} style={{position: "absolute", left: box.x + i * (tw + gap), top: y, width: tw, height: th, opacity: q,
        border: `3px solid ${P.text}`, boxSizing: "border-box", background: mine ? "transparent" : hatch(P.soft + "66", -45, 4, 10)}}>
        {mine && <div style={{position: "absolute", left: 0, top: 0, width: "100%", height: "100%", background: P.hot, clipPath: `inset(${(1 - q) * 100}% 0 0 0)`}}/>}
      </div>;
    })}
  </>;
};

// ---------- duration: an undivided rule until the word, then N equal segments ink on it, then the arrow onward ----------
const DurationDevice: React.FC<{c: Ctx; years: number; lockF: number}> = ({c, years, lockF}) => {
  const {f, P, box} = c;
  const w = box.w * 0.82, segW = w / years, th = 84, y = box.y + (box.h - th) / 2;
  const g = settleBy(c, c.grow, 12);
  const div = ramp(f, lockF, 6);
  const ink = ramp(f, lockF, 14, io);
  const arrow = ramp(f, settleBy(c, lockF + 16, 10), 10);
  return <>
    <div style={{position: "absolute", left: box.x, top: y, width: w * ramp(f, g, 12, io), height: th, border: `3px solid ${P.text}`, boxSizing: "border-box", opacity: 1 - div}}/>
    {f >= lockF && Array.from({length: years}, (_, i) => <div key={i} style={{position: "absolute", left: box.x + i * segW, top: y, width: segW - 6, height: th,
      border: `3px solid ${P.text}`, boxSizing: "border-box", opacity: div}}>
      <div style={{position: "absolute", inset: 0, background: P.hot, clipPath: `inset(0 ${Math.min(1, Math.max(0, 1 - (ink * years - i))) * 100}% 0 0)`}}/>
    </div>)}
    <div style={{position: "absolute", left: box.x + w, top: y + th / 2 - 2, width: (box.w - w - 14) * arrow, borderTop: `5px dashed ${P.text}`}}/>
    <svg style={{position: "absolute", left: box.x + box.w - 30, top: y + th / 2 - 18, opacity: arrow}} width={30} height={36}>
      <path d="M 0 0 L 28 18 L 0 36 Z" fill={P.text}/></svg>
  </>;
};

// ---------- threshold: a rule on a track; the side the deck names is shaded (earlier limits of other rules: not drawn) ----------
export const ThresholdDevice: React.FC<{c: Ctx; at: Row; side: "above" | "below"; noLabel?: boolean; lockAt?: number}> = ({c, at, side, noLabel, lockAt}) => {
  const {f, P, box} = c;
  const scale = Math.abs(at.v) * 1.6;
  const X = (v: number) => box.x + (Math.abs(v) / scale) * box.w;
  const th = 96, used = 90 + 30 + th + 40;
  const top = box.y + Math.max(0, (box.h - used) / 2);
  const y = top + 120;
  const g = settleBy(c, c.grow - 6, 12);
  const track = ramp(f, g, 12, io);
  const xm = X(at.v);
  const lock = lockAt ?? lockOf(at);
  const shade = ramp(f, settleBy(c, Math.max(g + 14, lock), 10), 10);
  const col = at.role ? roleColor(c, at.role) : P.hot;
  return <>
    <div style={{position: "absolute", left: box.x, top: y, width: box.w * track, height: th, border: `3px solid ${P.text}`, borderRight: "none", boxSizing: "border-box"}}/>
    {Array.from({length: 17}, (_, i) => <div key={i} style={{position: "absolute", left: box.x + (i / 16) * box.w - 1, top: y + th, width: 2, height: i % 4 ? 12 : 22, background: P.text, opacity: track}}/>)}
    <div style={{position: "absolute", top: y + 3, height: th - 6, background: hatch(col, 45, 6, 12), opacity: 0.9 * shade,
      ...(side === "above" ? {left: xm, width: (box.x + box.w - xm) * shade} : {left: box.x + 3, width: (xm - box.x - 3) * shade})}}/>
    <div style={{position: "absolute", left: xm - 5, top: y - 50, width: 10, height: th + 80, background: col, transformOrigin: "bottom", transform: `scaleY(${ramp(f, g + 6, 10, io)})`}}/>
    {!noLabel && <div style={{position: "absolute", top: top, ...(xm < box.x + box.w * 0.6 ? {left: xm - 5} : {right: 1080 - xm - 5})}}>
      <Val c={c} r={at} size={64} color={P.text} at={lock}/></div>}
  </>;
};

// ---------- price board: name ... leader ... price. Earlier prices are ruled rows; this beat's price INKs on the board at
// hero size (it is the beat's hero, printed once); a printed old price sits crossed off above it ----------
export const PriceBoard: React.FC<{c: Ctx; d: Extract<Device, {kind: "price"}>; heroSize: number; markSeed0: number}> = ({c, d, heroSize, markSeed0}) => {
  const {B, f, P, box} = c;
  const serif = F.serif(B, 560);
  const g = settleBy(c, c.grow - 8, 10);
  const ghostH = 190, oldH = d.old ? 150 : 0, hotH = heroSize + 40;
  const used = d.rows.length * ghostH + oldH + hotH;
  let y = box.y + Math.max(0, (box.h - used) / 2);
  const row = (r: Row, i: number, ps: number, h: number, hot: boolean) => {
    const pw = hot ? 0 : measure(r.text, F.hero(B), ps);
    const room = hot ? box.w : box.w - pw - 90;
    let ns = 60;
    while (ns > LBL && measure(r.name, serif, ns) > room) ns--;
    const nw = Math.min(room, measure(r.name, serif, ns));
    const op = ramp(f, g + 4 + i * 5, 8);
    const pt = paint(c, r);
    const el = <React.Fragment key={i}>
      <div style={{position: "absolute", left: box.x, top: y + h - 2, width: box.w, height: 2, background: P.rule, opacity: 0.6 * op}}/>
      <div style={{position: "absolute", left: box.x, top: hot ? y : y + h * 0.5 - ns * 0.8, opacity: op}}>
        <Gated text={r.name} nums={r.gates} lockF={lockOf(r)} f={f} ff={serif} size={ns} width={Math.ceil(nw) + 4} color={r.ghost ? P.soft : P.text} hot={P.text}/></div>
      {!hot && <>
        <div style={{position: "absolute", left: box.x + nw + 18, top: y + h * 0.5, width: Math.max(0, box.w - nw - pw - 44), borderTop: `5px dotted ${P.soft}`, opacity: op * 0.6}}/>
        <div style={{position: "absolute", right: 1080 - (box.x + box.w), top: y + h * 0.5 - ps * 0.8, opacity: op}}>
          <PriceVal c={c} r={r} size={ps} color={r.ghost ? (r.role ? pt.line : P.soft) : P.text}/></div>
      </>}
      {hot && <>
        <div style={{position: "absolute", left: box.x, top: y + ns * 1.25, width: Math.max(0, box.w - (r.num ? measure(r.text, F.hero(B), heroSize) : 0) - 40), borderTop: `5px dotted ${P.soft}`, opacity: op * 0.6,
          marginTop: heroSize * 0.45}}/>
        {r.num && <div style={{position: "absolute", right: 1080 - (box.x + box.w), top: y + ns * 1.25 + 6}}>
          <Ink B={B} n={r.num} f={f} size={heroSize} color={r.role ? roleColor(c, r.role) === B.c.accent2 ? P.text : roleColor(c, r.role) : P.text} slot={P.text}/></div>}
      </>}
    </React.Fragment>;
    y += h;
    return el;
  };
  const ghosts = d.rows.map((r, i) => row(r, i, 120, ghostH, false));
  const old = d.old ? (() => {
    const o = d.old!, os = 120, rest = d.oldRest, rs = LBL;
    const show = f >= o.lockF;
    const el = <div key="old" style={{position: "absolute", right: 1080 - (box.x + box.w), top: y + 10, display: "flex", alignItems: "baseline", gap: 14, opacity: show ? 0.8 * ramp(f, o.lockF, 6) : 0}}>
      {show && <EditorMark kind="crossed-off" at={Math.min(o.lockF + 8, c.f1 - 26)} dur={12} seed={markSeed0} color={B.c.accent} strokeWidth={7}>
        <span style={{display: "inline-flex", alignItems: "baseline", gap: 12}}>
          <span style={{...css(F.hero(B), os), fontWeight: 500, color: P.text, lineHeight: 1}}>{o.text}</span>
          {rest && <span style={{...css(F.body(B, 700), rs), color: P.text}}>{rest}</span>}</span>
      </EditorMark>}
    </div>;
    y += oldH;
    return el;
  })() : null;
  const hot = row(d.hot, d.rows.length, heroSize, hotH + 60, true);
  return <>{ghosts}{old}{hot}</>;
};
const PriceVal: React.FC<{c: Ctx; r: Row; size: number; color: string}> = ({c, r, size, color}) => {
  const ff = F.hero(c.B);
  if (c.f < lockOf(r)) return <Slug w={measure(r.text, ff, size)} size={size} color={color}/>;
  if (r.num) assertLocked(r.num, c.f, "Dispatch price");
  const p = ramp(c.f, lockOf(r), 7);
  return <span style={{...css(ff, size), lineHeight: 1, color, display: "inline-block", clipPath: `inset(-20% ${(1 - p) * 100}% -20% 0)`}}>{r.text}</span>;
};

// ---------- a sum: parts stacked end to end, against an earlier rule (the limit) ----------
const SumDevice: React.FC<{c: Ctx; d: Extract<Device, {kind: "sum"}>}> = ({c, d}) => {
  const {B, f, P, box} = c;
  const th = 140, y = box.y + (box.h - th) / 2 + 20;
  const tot = d.total.role ? roleColor(c, d.total.role) : P.text;
  let x = box.x;
  const parts = d.parts.map((r, i) => {
    const w = (r.v / d.scale) * box.w, g = settleBy(c, c.grow + i * 10, 12), p = ramp(f, g, 12, io);
    const solid = i % 2 === 1;
    const el = <React.Fragment key={i}>
      <div style={{position: "absolute", left: x, top: y, width: w * p, height: th, background: solid ? tot : hatch(tot, 45, 6, 12), border: `3px solid ${tot}`,
        borderRight: `4px solid ${B.c.newsprint}`, boxSizing: "border-box"}}/>
      {rowName(c, r, {at: g, style: {left: x, top: y - NAME * 1.3}})}
      <div style={{position: "absolute", left: x + 16, top: y + th + 14, height: LBL * 1.15, display: "flex", alignItems: "center"}}>
        {p > 0.8 && <Val c={c} r={r} size={LBL} color={P.text}/>}</div>
    </React.Fragment>;
    x += w;
    return el;
  });
  const ln = d.line;
  const lx = ln ? box.x + (ln.v / d.scale) * box.w : 0;
  const la = settleBy(c, c.grow - 8, 8);
  return <>
    {parts}
    {ln && <>
      <div style={{position: "absolute", left: lx - 2, top: y - 120, height: th + 200, borderLeft: `5px dashed ${P.text}`, opacity: ramp(f, la, 8)}}/>
      <div style={{position: "absolute", right: 1080 - lx + 14, top: y - 120, opacity: ramp(f, la, 8), display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
        <Name c={c} text={ln.name} gates={ln.gates} lockF={lockOf(ln)} color={P.soft} size={FOOT + 2} style={{position: "relative"}}/>
        <Val c={c} r={ln} size={LBL} color={P.text}/></div>
    </>}
  </>;
};

// ---------- inset: a sliver at true scale beside the story's biggest, then ZOOMED IN ----------
const InsetDevice: React.FC<{c: Ctx; d: Extract<Device, {kind: "inset"}>}> = ({c, d}) => {
  const {B, f, P, box} = c;
  const th = 70, gy = box.y + NAME * 1.3, sy = gy + th + 34 + NAME * 1.3;
  const hot = d.rows.find((r) => r.hot) ?? d.rows[0];
  const sw = Math.max(4, (hot.v / d.scale) * box.w);
  const g = settleBy(c, c.grow, 12);
  const zy = sy + th + 70, zh = box.y + box.h - zy;
  const zAt = settleBy(c, Math.max(lockOf(hot) + 10, g + 20), 26);
  const conn = ramp(f, zAt, 10, io);
  const zmax = Math.max(...d.rows.map((r) => r.v));
  const zr = d.rows.length;
  const zth = Math.min(80, (zh - 70) / zr - NAME * 1.3 - 14);
  const pt = paint(c, hot);
  return <>
    <BarRows c={c} rows={[d.ghost]} scale={d.scale} axisX={box.x} leftRoom={0} rightRoom={box.w} y={gy} th={th} pitch={100}/>
    {rowName(c, hot, {at: g, style: {left: box.x, top: sy - NAME * 1.3}})}
    <div style={{position: "absolute", left: box.x, top: sy, width: sw * ramp(f, g, 8), height: th, background: pt.fill}}/>
    {f >= lockOf(hot) && <div style={{position: "absolute", left: box.x + sw + 16, top: sy + 10}}><Val c={c} r={hot} size={LBL} color={P.text}/></div>}
    <svg style={{position: "absolute", left: 0, top: 0, overflow: "visible"}} width={1080} height={1920}>
      {[[box.x, sy + th, box.x, zy], [box.x + sw, sy + th, box.x + box.w, zy]].map(([a, b2, x2, y2], k) => {
        const p = `M ${a} ${b2} L ${x2} ${y2}`;
        return <path key={k} d={p} stroke={P.text} strokeWidth={2.5} strokeDasharray={`8 8`} fill="none" opacity={conn > 0 ? 1 : 0}
          style={{clipPath: `inset(0 0 ${(1 - conn) * 100}% 0)`}}/>;
      })}
    </svg>
    <div style={{position: "absolute", left: box.x, top: zy, width: box.w, height: zh, border: `2.5px solid ${P.text}`, boxSizing: "border-box", opacity: ramp(f, zAt + 6, 6)}}>
      <div style={{position: "absolute", right: 14, top: 10, ...css(F.body(B, 800, 0.1), FOOT), color: P.soft}}>ZOOMED IN</div>
    </div>
    <BarRows c={{...c, grow: zAt + 10, box: {x: box.x + 24, y: zy, w: box.w - 48, h: zh}}} rows={d.rows} scale={zmax} axisX={box.x + 24} leftRoom={0} rightRoom={box.w - 48}
      y={zy + 40 + NAME * 1.3} th={zth} pitch={zth + NAME * 1.3 + 24}/>
  </>;
};

// ---------- the chart desk: A, B, and copies of B laid end to end against A ----------
// Before `fillAt` (a hook whose ratio is not yet said) A and B are named, empty, full-width tracks: no magnitude shows.
export const RatioDesk: React.FC<{c: Ctx; A: Row; B2: Row; copies: number; scale: number; range: {lo: number; hi: number} | null; copiesAt: number; noLabels?: boolean;
  th?: number; bracketAt?: number; fillAt?: number}> = ({c, A, B2, copies, scale, range, copiesAt, noLabels, th: th0, bracketAt, fillAt}) => {
  const {B, f, P, box} = c;
  const th = th0 ?? Math.max(80, Math.min(140, (box.h - 2 * NAME * 1.3 - 120) / 2));
  const used = 2 * th + 2 * NAME * 1.3 + 40 + 74;
  const ay = box.y + Math.max(0, (box.h - used) / 2) + NAME * 1.3, by = ay + th + 40 + NAME * 1.3;
  const bw = (B2.v / scale) * box.w, aw = (A.v / scale) * box.w;
  const step = 14.52;
  const pB = paint(c, B2);
  const empty = fillAt !== undefined && f < fillAt;
  const grow = fillAt !== undefined ? fillAt - 2 : c.grow;
  return <>
    {fillAt !== undefined && [ay, by].map((yy, k) => <div key={k} style={{position: "absolute", left: box.x, top: yy, width: box.w * ramp(f, c.grow, 10, io), height: th,
      border: `3px solid ${P.text}`, boxSizing: "border-box", opacity: empty ? 0.45 : 0.45 * (1 - ramp(f, fillAt, 8))}}/>)}
    {fillAt !== undefined && empty && [A, B2].map((r, k) => rowName(c, r, {color: P.text, style: {left: box.x, top: (k ? by : ay) - NAME * 1.25}}))}
    {!empty && <>
      <BarRows c={{...c, grow}} rows={[{...A, hot: true}]} scale={scale} axisX={box.x} leftRoom={0} rightRoom={box.w} y={ay} th={th} pitch={100} noLabels={noLabels}
        range={range ? {lo: range.lo, hi: range.hi, idx: 0} : null}/>
      <BarRows c={{...c, grow}} rows={[{...B2, hot: false}]} scale={scale} axisX={box.x} leftRoom={0} rightRoom={box.w} y={by} th={th} pitch={100} noLabels={noLabels} growAt={[grow + 8]}/>
    </>}
    {Array.from({length: Math.max(0, copies - 1)}, (_, k) => {
      const at = settleBy(c, copiesAt + k * step, 10), p = ramp(f, at, 10, io);
      return <div key={k} style={{position: "absolute", left: box.x + bw * k + bw * p, top: by, width: bw, height: th, opacity: ramp(f, at, 3),
        border: `3px solid ${pB.line}`, boxSizing: "border-box", background: hatch(pB.line + "66", -45, 5, 10)}}/>;
    })}
    <div style={{position: "absolute", left: box.x + aw - 2, top: ay - 12, height: by + th - ay + 24, borderLeft: `4px dashed ${paint(c, A).line}`, opacity: ramp(f, settleBy(c, copiesAt, 8), 8)}}/>
    <div style={{position: "absolute", left: box.x, top: by + th + 24, display: "flex", alignItems: "center", gap: 14, opacity: ramp(f, settleBy(c, copiesAt + 4, 8), 8)}}>
      <span style={{width: 64, height: 36, border: `3px solid ${pB.line}`, boxSizing: "border-box", background: hatch(pB.line + "66", -45, 5, 10)}}/>
      <span style={{...css(F.body(B, 700), LBL), color: P.text}}>= {B2.name}</span>
    </div>
    {bracketAt !== undefined && copies > 1 && f >= bracketAt && <div style={{position: "absolute", left: box.x + bw, top: by - 4, width: bw * (copies - 1), height: th + 8}}>
      <EditorMark kind="bracket" at={bracketAt} dur={14} seed={markSeed(c.seed, 5)} color={P.amber} strokeWidth={7} brackets={["bottom"]} padding={8}>
        <div style={{width: bw * (copies - 1), height: th + 8}}/></EditorMark></div>}
  </>;
};

// ---------- the dispatcher ----------
export const DeviceView: React.FC<{c: Ctx; d: Device; lockF: number; bracketAt?: number; heroSize?: number}> = ({c, d, lockF, bracketAt, heroSize = 220}) => {
  switch (d.kind) {
    case "rows": return <RowsDevice c={c} d={d}/>;
    case "diverge": return <DivergeDevice c={c} rows={d.rows} ghost={d.ghost}/>;
    case "periods": return <PeriodsDevice c={c} d={d}/>;
    case "tally": return <TallyTiles c={c} k={d.k} N={d.N} kF={lockF} NF={lockF}/>;
    case "duration": return <DurationDevice c={c} years={d.years} lockF={lockF}/>;
    case "threshold": return <ThresholdDevice c={c} at={d.at} side={d.side}/>;
    case "price": return <PriceBoard c={c} d={d} heroSize={heroSize} markSeed0={markSeed(c.seed, 2)}/>;
    case "sum": return <SumDevice c={c} d={d}/>;
    case "inset": return <InsetDevice c={c} d={d}/>;
    case "ratio": return <RatioDesk c={c} A={d.A} B2={d.B} copies={d.copies} scale={d.scale} range={d.range ? {lo: d.range.lo.value, hi: d.range.hi.value} : null}
      copiesAt={lockF + 10} bracketAt={bracketAt}/>;
  }
};

// ---------- hook teasers: names and empty tracks first; a shape lands on the hook's own word ----------
export const teaserH = (t: Teaser) => t.kind === "ratio" ? 470 : t.kind === "tally" ? 300 : t.kind === "rows" ? 140 + t.rows.length * 170 : t.kind === "threshold" ? 330
  : t.kind === "count" ? 330 : 64 + Math.min(5, t.heads.length) * 86;
export const TeaserView: React.FC<{c: Ctx; t: Teaser}> = ({c, t}) => {
  const {B, f, P, box} = c;
  switch (t.kind) {
    case "ratio": return <RatioDesk c={c} A={t.A} B2={t.B} copies={t.copies} scale={t.scale} range={t.range ? {lo: t.range.lo.value, hi: t.range.hi.value} : null}
      copiesAt={t.lockF + 12} noLabels fillAt={t.lockF}/>;
    case "tally": return <TallyTiles c={c} k={t.k} N={t.N} kF={t.kF} NF={t.NF}/>;
    case "threshold": return <ThresholdDevice c={c} at={t.at} side="above" noLabel lockAt={t.lockF}/>;
    case "rows": {
      // each value's bar grows on its own word; both sides of zero on one scale of the values said so far
      const neg = t.rows.some((r) => r.v < 0);
      if (neg) return <DivergeDevice c={c} rows={t.rows} noLabels growAt={t.at} centre/>;
      const {pitch, th, top} = rowsBlock(t.rows.length, box.h);
      const said = t.rows.filter((_, i) => f >= t.at[i]);
      const scale = Math.max(1e-9, ...said.map((r) => Math.abs(r.v)));
      return <>
        {t.rows.map((r, i) => <div key={i} style={{position: "absolute", left: box.x, top: box.y + top + i * pitch, width: box.w, height: th, border: `3px solid ${P.text}`,
          boxSizing: "border-box", opacity: f < t.at[i] ? 0.45 : 0}}/>)}
        <BarRows c={c} rows={t.rows} scale={scale} axisX={box.x} leftRoom={0} rightRoom={box.w} y={box.y + top} th={th} pitch={pitch} noLabels growAt={t.at}/>
        {t.rows.map((r, i) => f < t.at[i] - 4 && rowName(c, r, {color: P.text, style: {left: box.x, top: box.y + top + i * pitch - NAME * 1.25}}))}
      </>;
    }
    case "count": {
      // N equal, named tiles (the story's own sections), inked together on the number word: shapes, no digits
      const gap = 18, tw = (box.w - gap * (t.n - 1)) / t.n, th = Math.min(200, box.h - 120), y = box.y + 20;
      const q = ramp(f, t.lockF, 10, io);
      return <>{t.names.map((nm, i) => <React.Fragment key={i}>
        <div style={{position: "absolute", left: box.x + i * (tw + gap), top: y, width: tw, height: th, border: `3px solid ${P.text}`, boxSizing: "border-box",
          background: f >= t.lockF ? undefined : hatch(P.soft + "22", -45, 4, 14)}}>
          <div style={{position: "absolute", inset: 0, background: P.hot, clipPath: `inset(${(1 - q) * 100}% 0 0 0)`}}/></div>
        <div style={{position: "absolute", left: box.x + i * (tw + gap), top: y + th + 14, width: tw, ...css(F.body(B, 700), LBL), whiteSpace: "normal", lineHeight: 1.08, color: P.text}}>
          {nm.split(" ").map((w, k) => <div key={k}>{w}</div>)}</div>
      </React.Fragment>)}</>;
    }
    case "index": {
      const ff = F.body(B, 700), size = LBL;
      return <>
        <div style={{position: "absolute", left: box.x, top: box.y, ...css(F.body(B, 800, 0.14), FOOT), color: P.amberText}}>INSIDE</div>
        {t.heads.slice(0, 5).map((h, i) => {
          const y = box.y + 58 + i * 86;
          let s = size;
          while (s > 36 && measure(h.text, ff, s) > box.w - 70) s--;
          return <React.Fragment key={i}>
            <div style={{position: "absolute", left: box.x, top: y, width: box.w, height: 2, background: P.rule, opacity: 0.4}}/>
            <div style={{position: "absolute", left: box.x, top: y + 16, ...css(F.serif(B, 700), 44), color: P.hot === B.c.accent2 ? P.text : P.hot}}>{"—"}</div>
            <div style={{position: "absolute", left: box.x + 64, top: y + 18}}>
              <Gated text={h.text} nums={h.gates} lockF={h.lockF} f={f} ff={ff} size={s} width={box.w - 64} color={P.text} hot={P.text}/></div>
          </React.Fragment>;
        })}
      </>;
    }
  }
};

// ---------- say proofs (on the ink page) ----------
export const proofH = (p: Exclude<Proof, {kind: "slip"}>) => p.kind === "tiles" ? 260 : p.kind === "equal" ? p.rows.length * 170 + 40 : p.kind === "band" ? p.rows.length * 70 + 150
  : 140 + p.rows.length * 150;
export const ProofView: React.FC<{c: Ctx; p: Exclude<Proof, {kind: "slip"}>}> = ({c, p}) => {
  const {B, f, P, box} = c;
  switch (p.kind) {
    case "tiles": {
      const th = 100, used = NAME * 1.4 + th + 20 + 46;
      const y = box.y + Math.max(0, (box.h - used) / 2) + NAME * 1.4;
      const aw = (p.A.v / p.scale) * box.w, tw = (p.B.v / p.scale) * box.w;
      const g = settleBy(c, c.grow, 10);
      const pA = paint(c, p.A), pB = paint(c, p.B);
      return <>
        {rowName(c, p.A, {at: g, style: {left: box.x, top: y - NAME * 1.35}})}
        <div style={{position: "absolute", left: box.x, top: y, width: aw * ramp(f, g, 10, io), height: th, border: `4px solid ${pA.line}`, boxSizing: "border-box"}}/>
        {Array.from({length: p.n}, (_, i) => {
          const at = settleBy(c, p.lockF + 2 + i * 2, 4), q = ramp(f, at, 4);
          return <div key={i} style={{position: "absolute", left: box.x + i * tw + 2, top: y + 4 + (1 - q) * -40, width: tw - 2, height: th - 8, background: pB.line,
            borderRight: `2px solid ${B.c.ink}`, boxSizing: "border-box", opacity: q}}/>;
        })}
        {p.lo !== null && <div style={{position: "absolute", left: box.x + (p.lo / p.scale) * box.w - 1.5, top: y - 18, height: th + 36, borderLeft: `3px dashed ${P.text}`,
          opacity: ramp(f, settleBy(c, p.lockF + 2 + p.n * 2, 8), 8)}}/>}
        <div style={{position: "absolute", left: box.x, top: y + th + 20, display: "flex", alignItems: "center", gap: 14, opacity: ramp(f, settleBy(c, p.lockF + 6, 8), 8)}}>
          <span style={{width: Math.max(18, Math.min(64, tw)), height: 36, background: pB.line}}/>
          <Name c={c} text={`= ${p.B.name}`} gates={p.B.gates} lockF={lockOf(p.B)} color={P.text} style={{position: "relative"}}/>
        </div>
      </>;
    }
    case "equal": {
      const th = 84, pitch = th + NAME * 1.3 + 40, y0 = box.y + Math.max(0, (box.h - p.rows.length * pitch) / 2);
      return <>{p.rows.map((r, i) => {
        const y = y0 + NAME * 1.3 + i * pitch, g = settleBy(c, c.grow + i * 6, 12), q = ramp(f, g, 12, io);
        const pt = paint(c, r);
        return <React.Fragment key={i}>
          {rowName(c, r, {at: g, maxW: box.w, style: {left: box.x, top: y - NAME * 1.3}})}
          <div style={{position: "absolute", left: box.x, top: y, width: box.w * 0.7 * q, height: th, background: pt.fill, border: pt.border ? `3px solid ${pt.border}` : undefined, boxSizing: "border-box"}}/>
          <div style={{position: "absolute", left: box.x + box.w * 0.7 + 20, top: y + 8}}><Val c={c} r={r} size={64} color={P.text}/></div>
        </React.Fragment>;
      })}
      <div style={{position: "absolute", left: box.x + box.w * 0.7, top: y0 + 10, height: p.rows.length * pitch, borderLeft: `3px dashed ${P.text}`, opacity: ramp(f, settleBy(c, p.lockF, 8), 8)}}/></>;
    }
    case "band": {
      // every value the Short showed, in time order, against the claim's band (labelled: these are the Short's own rows)
      const n = p.rows.length, pitch = Math.min(70, (box.h - 110) / n), cx = box.x + box.w * 0.62, half = box.w * 0.36;
      const top = box.y + 54;
      const X = (v: number) => cx + (v / p.edge) * half;
      const shown = f >= p.lockF;
      return <>
        <div style={{position: "absolute", left: box.x, top: box.y, ...css(F.body(B, 800, 0.12), FOOT), color: P.amber}}>SHOWN IN THIS SHORT</div>
        <div style={{position: "absolute", left: X(-p.edge), top, width: half * 2, height: n * pitch + 20, background: hatch(P.hot + "40", 45, 4, 12),
          borderLeft: `3px dashed ${P.hot}`, borderRight: `3px dashed ${P.hot}`, boxSizing: "border-box", opacity: shown ? ramp(f, p.lockF, 8) : 0}}/>
        <div style={{position: "absolute", left: cx - 1.5, top: top - 10, height: n * pitch + 40, width: 3, background: P.text, opacity: 0.8}}/>
        {p.rows.map((r, i) => {
          const y = top + 10 + i * pitch + pitch / 2, at = settleBy(c, c.grow + i * 3, 8), q = ramp(f, at, 8);
          const col = r.role ? roleColor(c, r.role) : P.text;
          return <React.Fragment key={i}>
            {rowName(c, r, {size: LBL, maxW: X(-p.edge) - box.x - 16, color: P.text, style: {left: box.x, top: y - LBL * 0.62, opacity: q}})}
            <div style={{position: "absolute", left: cx, top: y - 2, width: Math.abs(X(r.v) - cx) * q, height: 4, background: P.text, transform: r.v < 0 ? "translateX(-100%)" : undefined, opacity: 0.5}}/>
            <div style={{position: "absolute", left: X(r.v) - 15, top: y - 15, width: 30, height: 30, borderRadius: 15, background: col, border: `3px solid ${P.text}`, boxSizing: "border-box", opacity: q}}/>
          </React.Fragment>;
        })}
        {shown && <div style={{position: "absolute", left: X(p.edge) - 50, top: top + n * pitch + 34, opacity: ramp(f, p.lockF, 8), ...css(F.body(B, 800), LBL), color: P.amber}}>{p.text}</div>}
      </>;
    }
    case "bars": return <DivergeDevice c={c} rows={p.rows}/>;
  }
};
