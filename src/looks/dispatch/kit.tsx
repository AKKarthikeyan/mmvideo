// Kadai Dispatch primitives: newsprint grounds, the masthead and source line, the three entrance verbs (WIPE, SET, INK),
// gated running text (a number is a blank slug until its lock frame) and the editorial flag and proof slip.
// Every colour is a brand token (B.c), every face a brand font role (B.f); nothing here types a hex or a family.
import React from "react";
import {Easing, Img, interpolate, staticFile} from "remotion";
import type {ColorRole, LookBrand} from "../brands/types";
import {fitFont, measure, type FitFont} from "../shared/fit";
import {assertLocked} from "../shared/lock";
import {findNumbers} from "../shared/numbers";
import type {LookNum, NumParse} from "../shared/types";

export const CL = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
export const io = Easing.inOut(Easing.cubic);
export const out = Easing.out(Easing.cubic);
export const ramp = (f: number, at: number, dur: number, e = out) => interpolate(f, [at, at + Math.max(1, dur)], [0, 1], {...CL, easing: e});

// ---------- fonts ----------
export const F = {
  serif: (B: LookBrand, weight?: number): FitFont => ({...fitFont(B.f.serif), weight: weight ?? B.f.serif.weight}),
  hero: (B: LookBrand): FitFont => fitFont(B.f.hero),
  body: (B: LookBrand, weight = 700, ls = 0): FitFont => ({...fitFont(B.f.body, ls), weight}),
};
export const css = (ff: FitFont, size: number): React.CSSProperties => ({fontFamily: ff.family, fontWeight: ff.weight, fontSize: size, letterSpacing: `${ff.letterSpacing ?? 0}em`,
  fontFeatureSettings: ff.tnum ? "'tnum' 1, 'lnum' 1" : "'lnum' 1", fontOpticalSizing: "auto", whiteSpace: "pre", fontStretch: `${ff.stretch ?? 100}%`});

// ---------- grounds ----------
// A flat brand colour with the baked newsprint fibre map over it (soft-light), so any brand's colour reads as paper.
export const Paper: React.FC<{color: string; seed: number; amount?: number; style?: React.CSSProperties}> = ({color, seed, amount = 0.75, style}) =>
  <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, background: color, overflow: "hidden", ...style}}>
    <Img src={staticFile(`looks/dispatch/paper-${((seed % 4) + 4) % 4}.jpg`)} style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, mixBlendMode: "soft-light", opacity: amount}}/>
  </div>;

// ---------- chrome ----------
export const onDark = (role: ColorRole | "news") => role === "accent" || role === "ink" || role === "deep" || role === "ray";
export const textOn = (B: LookBrand, bg: ColorRole, px: number, prefer: ColorRole[] = ["paper", "ink"]): ColorRole =>
  prefer.find((r) => B.pairOk(r, bg, px)) ?? (onDark(bg) ? "paper" : "ink");

// Vertical anchors from the brand's safe box (Data Kadai and Indica Atlas both start it at y 210): the masthead sits on its
// top edge, the double rule 60 px below, the first content line 94 px below.
export const geo = (B: LookBrand) => ({MAST_Y: B.safe.y0 + 4, RULE_Y: B.safe.y0 + 60, TOP: B.safe.y0 + 94});
export const CHIP = 32, LABEL = 44, FOOT = 34;      // size floors (frame px): chip, labels, footnotes and sources
export const Masthead: React.FC<{B: LookBrand; chip: string; color: string; on: "light" | "dark"; draw?: number; wordmark?: boolean; plate?: string | null}> = ({B, chip, color, on, draw = 1, wordmark = true, plate}) => {
  const W = B.safe.x1 - B.safe.x0;
  const {MAST_Y, RULE_Y} = geo(B);
  const text = chip.toUpperCase();
  // the chip keeps its 32 px: tracking tightens first (0.14 em down to 0.04 em), the size only as a last resort
  const room = W - (B.wordmark.stacked ? 250 : 290);
  let ls = 0.14, size = CHIP;
  while (ls > 0.04 && measure(text, F.body(B, 700, ls), size) > room) ls = +(ls - 0.02).toFixed(2);
  while (size > 26 && measure(text, F.body(B, 700, ls), size) > room) size--;
  const chipFont = F.body(B, 700, ls);
  return <>
    {wordmark && <div style={{position: "absolute", left: B.safe.x0, top: MAST_Y, height: 46, display: "flex", alignItems: "center", gap: 12}}>
      {plate ? <div style={{width: 52, height: 52, borderRadius: 26, background: plate, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 0}}><B.Mark size={40} on="light"/></div>
        : <B.Mark size={46} on={on}/>}<B.Wordmark size={B.wordmark.stacked ? 50 : 36} on={on}/>
    </div>}
    <div style={{position: "absolute", right: 1080 - B.safe.x1, top: MAST_Y + 23 - size * 0.62, ...css(chipFont, size), color}}>{text}</div>
    <div style={{position: "absolute", left: B.safe.x0, top: RULE_Y, width: W * draw, height: 4, background: color}}/>
    <div style={{position: "absolute", left: B.safe.x0, top: RULE_Y + 8, width: W * draw, height: 1.5, background: color}}/>
  </>;
};

export const SRC_SIZE = FOOT;
export const sourceTop = (B: LookBrand, text: string) => {
  const W = B.safe.x1 - B.safe.x0, ff = F.body(B, 500);
  const lines = wrapPlain(`Source: ${text}`, ff, SRC_SIZE, W);
  return B.safe.y1 - lines.length * Math.round(SRC_SIZE * 1.18) - 6;
};
export const SourceLine: React.FC<{B: LookBrand; text: string; color: string; lockF: number; f: number}> = ({B, text, color, lockF, f}) => {
  const W = B.safe.x1 - B.safe.x0, ff = F.body(B, 500);
  const top = sourceTop(B, text);
  return <>
    <div style={{position: "absolute", left: B.safe.x0, top: top - 12, width: W, height: 1.5, background: color, opacity: 0.55}}/>
    <div style={{position: "absolute", left: B.safe.x0, top, width: W, color}}>
      <Gated text={`Source: ${text}`} nums={[]} lockF={lockF} f={f} ff={ff} size={SRC_SIZE} width={W} color={color} hot={color} lineH={1.18} lead={{n: 7, ff: F.body(B, 800)}}/>
    </div>
  </>;
};

// ---------- gated running text ----------
export type Seg = {t: string; hot: boolean; lockF: number | null; num?: NumParse};
const NBSP = " ";

// Split a data string into styled segments: *starred* emphasis, and every printed number gated by a lock frame: the
// LookNum's own when the string prints one of the beat's parsed numbers (nums), else `lockF`. In strings the foundation
// does not parse (kickers, subs, sources, notes, quotes) a number is gated when it is a value: it has a ₹, a unit, a sign,
// decimals or digit grouping, or equals one of the beat's values. Dates ("18 OCT", "2025", "07/10/2026", "2026-27") and
// names ("Nifty 50") are not values and are never gated.
const MON = "(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\.?";
const DATE_RES = [new RegExp(`\\b\\d{1,2}/\\d{1,2}/\\d{2,4}\\b`, "g"), new RegExp(`\\b\\d{1,2}\\s+${MON}(?:\\s+(?:19|20)\\d\\d)?`, "gi"),
  new RegExp(`\\b${MON}\\s+\\d{1,2}(?:,\\s*(?:19|20)\\d\\d)?\\b`, "gi"), /\b(?:19|20)\d\d(?:[-–](?:\d\d)\b)?/g];
const dateSpans = (s: string) => DATE_RES.flatMap((re) => [...s.matchAll(re)].map((m) => [m.index!, m.index! + m[0].length] as const));
// Number words ("three", "over thirteen times") are gated too when the caller passes `wordLock` (the narrator's word frame).
const NUMW = /\b(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|twice|thrice)\b/gi;
export const segment = (text: string, nums: {text: string; lockF: number}[], lockF: number, values: number[] = [], wordLock?: (w: string) => number): Seg[] => {
  const cs: {ch: string; hot: boolean; k: number}[] = [];
  let on = false;
  for (const ch of text) { if (ch === "*") { on = !on; continue; } cs.push({ch, hot: on, k: -1}); }
  const s = cs.map((c) => c.ch).join("");
  const gates: {i: number; len: number; lockF: number; num?: NumParse}[] = [];
  let from = 0;
  for (const n of nums) {
    const i = s.indexOf(n.text, from);
    if (i < 0) continue;
    gates.push({i, len: n.text.length, lockF: n.lockF, num: n as unknown as NumParse});
    from = i + n.text.length;
  }
  const dates = dateSpans(s);
  let pos = 0;
  for (const p0 of findNumbers(s)) {
    let i = s.indexOf(p0.text, pos);
    if (i < 0) continue;
    pos = i + p0.text.length;
    let p = p0;
    if (p.sign === "-" && i > 0 && /\d/.test(s[i - 1])) { p = {...p, sign: "", text: p.text.slice(1), value: -p.value}; i += 1; }      // "2015-2025": a range dash
    const end = i + p.text.length;
    if (gates.some((g) => i < g.i + g.len && g.i < end)) continue;
    const valueLike = !!(p.prefix || p.unit.trim() || p.sign || p.decimals > 0 || p.grouping !== "none" || values.some((v) => Math.abs(Math.abs(v) - Math.abs(p.value)) < 1e-9));
    const inDate = dates.some(([a, b]) => i >= a && i < b);
    if (!valueLike || (inDate && !p.prefix && !p.unit.trim())) continue;
    gates.push({i, len: p.text.length, lockF, num: p});
  }
  if (wordLock) for (const m of s.matchAll(NUMW)) {
    const i = m.index!, end = i + m[0].length;
    if (gates.some((g) => i < g.i + g.len && g.i < end)) continue;
    gates.push({i, len: m[0].length, lockF: wordLock(m[0])});
  }
  gates.sort((a, b) => a.i - b.i).forEach((g, k) => { for (let j = g.i; j < g.i + g.len; j++) cs[j].k = k; });
  const out: (Seg & {g: number})[] = [];
  for (const c of cs) {
    const last = out[out.length - 1];
    if (last && last.hot === c.hot && last.g === c.k) last.t += c.ch;
    else { const g = c.k >= 0 ? gates[c.k] : null; out.push({t: c.ch, hot: c.hot, lockF: g ? g.lockF : null, num: g?.num, g: c.k}); }
  }
  return out;
};

type Word = {t: string; hot: boolean; lockF: number | null; space: boolean; num?: NumParse};
// Words for wrapping: a gated number (with its unit) is one unbreakable word.
const toWords = (segs: Seg[]): Word[] => {
  const ws: Word[] = [];
  let pendingSpace = false;
  for (const g of segs) {
    if (g.lockF !== null) { ws.push({t: g.t.replace(/ /g, NBSP), hot: g.hot, lockF: g.lockF, space: pendingSpace, num: g.num}); pendingSpace = false; continue; }
    const parts = g.t.split(/( +)/);
    for (const p of parts) {
      if (!p) continue;
      if (/^ +$/.test(p)) { pendingSpace = true; continue; }
      const last = ws[ws.length - 1];
      if (last && !pendingSpace && last.lockF === null && last.hot === g.hot) last.t += p;      // "word," glued
      else ws.push({t: p, hot: g.hot, lockF: null, space: pendingSpace});
      pendingSpace = false;
    }
  }
  return ws;
};
export const wrapWords = (ws: Word[], ff: FitFont, size: number, width: number, hotFF?: FitFont) => {
  const lines: Word[][] = [];
  let cur: Word[] = [], w = 0;
  const sp = measure(" ", ff, size);
  for (const x of ws) {
    const ww = measure(x.t, x.hot && hotFF ? hotFF : ff, size);
    const add = (cur.length && x.space ? sp : 0) + ww;
    if (cur.length && w + add > width + 0.5 && x.space) { lines.push(cur); cur = [{...x, space: false}]; w = ww; }
    else { cur.push(x); w += add; }
  }
  if (cur.length) lines.push(cur);
  return lines;
};
export const wrapPlain = (text: string, ff: FitFont, size: number, width: number) => wrapWords(toWords(segment(text, [], 0)), ff, size, width);
export const lineW = (ln: Word[], ff: FitFont, size: number, hotFF?: FitFont) => ln.reduce((s, x, i) => s + (i && x.space ? measure(" ", ff, size) : 0) + measure(x.t, x.hot && hotFF ? hotFF : ff, size), 0);

// Largest size in [min, max] at which the text wraps into at most maxLines lines of `width`.
export const fitGated = (text: string, nums: {text: string; lockF: number}[], ff: FitFont, width: number, maxLines: number, max: number, min: number, hotFF?: FitFont) => {
  const ws = toWords(segment(text, nums, 0));
  for (let s = max; s >= min; s -= s > 60 ? 2 : 1) {
    const lines = wrapWords(ws, ff, s, width, hotFF);
    if (lines.length <= maxLines && lines.every((ln) => lineW(ln, ff, s, hotFF) <= width + 0.5)) return {size: s, lines: lines.length};
  }
  return {size: min, lines: wrapWords(ws, ff, min, width, hotFF).length};
};
// The width of a one-line data string, its starred words measured in their own (bold) face.
export const textW = (text: string, ff: FitFont, size: number, hotFF?: FitFont) => lineW(toWords(segment(text, [], 0)), ff, size, hotFF);

// A blank: the space a figure will take before its word is said, set as a fill-in rule on the baseline (no glyph).
export const Slug: React.FC<{w: number; size: number; color: string; opacity?: number}> = ({w, size, color, opacity = 0.55}) =>
  <span style={{display: "inline-block", width: w, height: size * 0.62, borderBottom: `${Math.max(2, size * 0.045)}px solid ${color}`, opacity, boxSizing: "border-box",
    verticalAlign: "baseline"}}/>;

export type GatedProps = {
  text: string; nums: {text: string; lockF: number}[]; lockF: number; f: number; ff: FitFont; size: number; width: number;
  color: string; hot: string; hotWeight?: number; lineH?: number; set?: number | null; stagger?: number; align?: "left" | "right";
  lead?: {n: number; ff: FitFont}; maxLines?: number; values?: number[]; balance?: boolean; wordLock?: (w: string) => number;
};
// Running text set word by word (SET: each word rises out of its own mask, 8 frames, 3 frames apart, from `set`), with its
// printed numbers drawn only from their lock frames.
export const Gated: React.FC<GatedProps> = ({text, nums, lockF, f, ff, size, width, color, hot, hotWeight, lineH = 1.12, set = null, stagger = 3, align = "left", lead, values = [], balance, wordLock}) => {
  const hotFF = hotWeight ? {...ff, weight: hotWeight} : undefined;
  const ws = toWords(segment(text, nums, lockF, values, wordLock));
  let lines = wrapWords(ws, ff, size, width, hotFF);
  if (balance && lines.length > 1) {      // the narrowest width that keeps the line count: no short last line
    let lo = width * 0.45, hi = width;
    for (let k = 0; k < 10; k++) { const m = (lo + hi) / 2; if (wrapWords(ws, ff, size, m, hotFF).length > lines.length) lo = m; else hi = m; }
    lines = wrapWords(ws, ff, size, Math.ceil(hi) + 1, hotFF);
  }
  let k = 0, chars = 0;
  return <div style={{width, textAlign: align}}>{lines.map((ln, li) => <div key={li} style={{...css(ff, size), color, height: Math.round(size * lineH), lineHeight: `${Math.round(size * lineH)}px`, whiteSpace: "pre"}}>
    {ln.map((x, wi) => {
      const kk = k++;
      const c0 = chars; chars += x.t.length + 1;
      const p = set === null ? 1 : ramp(f, set + kk * stagger, 8);
      const isLead = lead && c0 < lead.n;
      const st: React.CSSProperties = {...css(isLead ? lead!.ff : ff, size), color: x.hot ? hot : color, ...(x.hot && hotWeight ? {fontWeight: hotWeight} : {})};
      let inner: React.ReactNode = x.t;
      if (x.lockF !== null) {
        if (f < x.lockF) inner = <Slug w={measure(x.t, ff, size)} size={size} color={x.hot ? hot : color}/>;
        else {
          if (x.num && "role" in (x.num as object)) assertLocked(x.num as unknown as LookNum, f, "running text");
          // a number lands whole: it rises out of its own baseline mask, so no frame shows part of it ("8,13")
          const q = ramp(f, x.lockF, 6);
          inner = <span style={{display: "inline-block", clipPath: `inset(${(1 - q) * 100}% -4% -20% -4%)`}}>{x.t}</span>;
        }
      }
      return <React.Fragment key={wi}>{wi > 0 && x.space ? " " : ""}<span style={{display: "inline-block", overflow: "hidden", verticalAlign: "bottom", lineHeight: `${Math.round(size * lineH)}px`}}>
        <span style={{display: "inline-block", ...st, transform: `translateY(${(1 - p) * 105}%)`}}>{inner}</span></span></React.Fragment>;
    })}
  </div>)}</div>;
};

// ---------- the INK verb: a hero figure ----------
// A printed number set as an editorial hero: its qualifier ("about", "over", "~") and word units in the grotesque at
// 0.3 / 0.34 em, symbols (%, ×) in the serif at 0.62 em, the figure in the hero serif. It INKs exactly at its lock frame:
// a 7-frame wipe up from the baseline (the whole figure at once, never a part of it), the weight rising from light to the face's heaviest over 10 frames, a scale from 0.94. Before that, only
// the qualifier and a hairline slot of the figure's size.
const isSym = (u: string) => /^[%×]$/.test(u.trim());
export const heroParts = (n: NumParse) => ({qual: n.qual.trim(), main: n.sign + n.prefix + n.digits, unit: n.unit.trim(), sym: isSym(n.unit)});
export const heroW = (B: LookBrand, n: NumParse, size: number) => {
  const p = heroParts(n);
  const q = p.qual ? measure(p.qual, F.body(B, 800, 0.02), size * 0.3) + size * 0.07 : 0;
  const m = measure(p.main, F.hero(B), size);
  const u = p.unit ? (p.sym ? measure(p.unit, F.hero(B), size * 0.62) + size * 0.02 : measure(p.unit, F.body(B, 800), size * 0.34) + size * 0.07) : 0;
  return q + m + u;
};
export const fitHero = (B: LookBrand, n: NumParse, width: number, max: number, min = 60) => {
  let s = max;
  while (s > min && heroW(B, n, s) > width) s -= 2;
  return s;
};

export const Ink: React.FC<{B: LookBrand; n: LookNum; f: number; size: number; color: string; slot?: string; qualColor?: string; at?: number; light?: number}> =
  ({B, n, f, size, color, slot, qualColor, at, light = 300}) => {
  const p = heroParts(n);
  const lock = Math.max(n.lockF, at ?? n.lockF);
  const shown = f >= lock;
  if (shown) assertLocked(n, f, "Dispatch hero");
  const wipe = ramp(f, lock, 7), wt = interpolate(f, [lock, lock + 10], [light, B.f.hero.weight], {...CL, easing: out}), sc = interpolate(f, [lock, lock + 9], [0.94, 1], {...CL, easing: out});
  const heroCss: React.CSSProperties = {...css(F.hero(B), size), fontWeight: wt, lineHeight: 1};
  const main = measure(p.main, F.hero(B), size);
  const uw = p.unit ? (p.sym ? measure(p.unit, F.hero(B), size * 0.62) : measure(p.unit, F.body(B, 800), size * 0.34)) : 0;
  return <div style={{display: "flex", alignItems: "baseline", whiteSpace: "pre", height: size * 0.92, lineHeight: 1}}>
    {p.qual && <span style={{...css(F.body(B, 800, 0.02), size * 0.3), color: qualColor ?? color, marginRight: size * 0.07, alignSelf: "flex-start", marginTop: size * 0.2}}>{p.qual}</span>}
    {shown
      ? <span style={{display: "inline-flex", alignItems: "baseline", clipPath: `inset(${(1 - wipe) * 125 - 25}% -4% -25% -4%)`, transform: `scale(${sc})`, transformOrigin: "0% 90%", color}}>
          <span style={heroCss}>{p.main}</span>
          {p.unit && (p.sym ? <span style={{...heroCss, fontSize: size * 0.62, marginLeft: size * 0.02}}>{p.unit}</span>
            : <span style={{...css(F.body(B, 800), size * 0.34), marginLeft: size * 0.07}}>{p.unit}</span>)}
        </span>
      : <span style={{display: "inline-block", width: main + uw + (p.unit && !p.sym ? size * 0.07 : size * 0.02), height: size * 0.7, boxSizing: "border-box",
          borderBottom: `${Math.max(6, size * 0.04)}px solid ${slot ?? color}`, background: hatch(`${slot ?? color}2E`, -45, Math.max(3, size * 0.018), Math.max(12, size * 0.07)), opacity: 0.85}}/>}
  </div>;
};

// ---------- WIPE ----------
export const wipe = (f: number, at: number, dur = 7): React.CSSProperties => ({clipPath: `inset(-4% ${(1 - ramp(f, at, dur)) * 100}% -4% 0)`});

// The tea-glass notch: the brand Mark on a 3 px chart rule over a short amber notch (replaces a newspaper's red tab).
export const Notch: React.FC<{B: LookBrand; x: number; y: number; w: number; color: string; f: number; at: number; on?: "light" | "dark"}> = ({B, x, y, w, color, f, at, on = "light"}) => {
  const p = ramp(f, at, 8);
  return <>
    <div style={{position: "absolute", left: x, top: y, width: w * p, height: 3, background: color}}/>
    <div style={{position: "absolute", left: x + 44, top: y + 3, width: 40 * Math.min(1, p * 3), height: 8, background: B.c.accent2}}/>
    <div style={{position: "absolute", left: x, top: y - 36, opacity: Math.min(1, p * 3)}}><B.Mark size={34} on={on}/></div>
  </>;
};

// An editorial flag: a 2 px ruled box with a hatched left strip, a footnote inside.
export const hatch = (c: string, angle = 45, a = 5, b = 11) => `repeating-linear-gradient(${angle}deg, ${c} 0 ${a}px, transparent ${a}px ${b}px)`;
