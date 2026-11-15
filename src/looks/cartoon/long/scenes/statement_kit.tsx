// Shared helpers for the three "words" scenes of the long-form cartoon video (statement, title, end), all owned by one builder.
// - rich text: lines of text with *starred* accent words, an `accent` word list and {figure tokens}; wrapped by real measurement;
// - the number rule: a printed figure is a token ({tfr/Bihar/nfhs6}, {@stats.key}, {const:2.1}) resolved through fig()/meta(), its digits
//   are not in the DOM before its reveal frame, and a digit typed straight into a line throws (so no figure is ever typed by hand);
// - the look's small parts: ink chip, speech bubble (any width), doodles, camera push-in, colour tokens.
import React from "react";
import {random} from "remotion";
import {EditorMark, markSeed, type MarkKind} from "../../../shared/Marks";
import {measure} from "../../../shared/fit";
import {C} from "../../palette";
import {ROUND, SANS, easeIO, pop} from "../../ui";
import {fig, meta} from "../figs";

export const ROUND_FONT: any = {family: ROUND, weight: 800, tnum: false, letterSpacing: -0.01};
export const SANS_FONT: any = {family: SANS, weight: 800, tnum: false};
export const SANS9_FONT: any = {family: SANS, weight: 900, tnum: false};

export type AccentIn = string | {text: string; mark?: MarkKind};
export type LineIn = string | {text: string; key?: string; show?: string};
export type Unit = {text: string; tok: boolean; star: boolean; mark: MarkKind; space: boolean};
export type Cam = {fx?: number; fy?: number; s0?: number; s1?: number};

// ---- figure tokens -------------------------------------------------------------------------------------------------------------
// {tfr/Bihar/nfhs6} or {tfr/Bihar/nfhs6:2} (decimals, default 1)  -> fig({t, state, s})
// {@stats.corr_school_tfr6:2}                                     -> a number found at that path of figures.json
// {const:2.1}                                                     -> a definitional constant (the replacement level), still revealed by key
const num = (v: number, d: number) => (v < 0 ? "−" : "") + Math.abs(v).toFixed(d);
export const resolveToken = (body: string, where: string): string => {
  const b = body.trim();
  if (b.startsWith("const:")) {
    const v = b.slice(6).trim();
    if (!/^\d+(\.\d+)?$/.test(v)) throw new Error(`${where}: bad constant {${b}}`);
    return v;
  }
  const [ref, decs] = b.split(":"), d = decs === undefined ? undefined : Number(decs);
  if (d !== undefined && !(Number.isInteger(d) && d >= 0 && d <= 3)) throw new Error(`${where}: bad decimals in {${b}}`);
  if (ref.startsWith("@")) {
    const v = meta(ref.slice(1));
    if (typeof v !== "number") throw new Error(`${where}: figure missing: {${b}}`);
    return d !== undefined ? num(v, d) : Number.isInteger(v) ? num(v, 0) : num(v, 1);
  }
  const [t, state, s] = ref.split("/").map((p) => p.trim());
  if (!t || !state) throw new Error(`${where}: figure token {${b}} must look like {tfr/Bihar/nfhs6}, {@path} or {const:2.1}`);
  const v = fig({t, state, ...(s ? {s} : {})}, d ?? 1);
  return v.value < 0 ? "−" + v.text.replace("-", "") : v.text;
};

// Digits typed straight into narration-like text are refused, except names (NFHS-6) and years (2015-16). Figures come from tokens.
const IDENT = /[A-Za-z]+-?\d+|\b(?:19|20)\d{2}(?:[-–]\d{2,4})?\b/g;
export const assertNoTypedNumbers = (text: string, where: string) => {
  if (/\d/.test(text.replace(IDENT, ""))) throw new Error(`${where}: a number is typed into "${text}". Print figures with a token such as {tfr/Bihar/nfhs6}, {@stats.key} or {const:2.1}, or write the number in words.`);
};

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
type Atom = {text: string; tok: boolean; raw?: string; star: boolean; mark?: MarkKind};

// Text -> units. `accents` are matched at word boundaries inside plain text (or equal to a token's text); `hits` collects the accents found.
export const parseLine = (raw: string, accents: {text: string; mark?: MarkKind}[], hits: Set<string>, where: string): Unit[] => {
  let atoms: Atom[] = [], star = false, buf = "";
  const flush = () => { if (buf) atoms.push({text: buf, tok: false, star}); buf = ""; };
  for (let i = 0; i < raw.length;) {
    const ch = raw[i];
    if (ch === "*") { flush(); star = !star; i++; }
    else if (ch === "{") {
      const j = raw.indexOf("}", i);
      if (j < 0) throw new Error(`${where}: unclosed { in "${raw}"`);
      flush();
      const body = raw.slice(i + 1, j);
      atoms.push({text: resolveToken(body, where), tok: true, raw: `{${body}}`, star});
      i = j + 1;
    } else { buf += ch; i++; }
  }
  flush();
  if (star) throw new Error(`${where}: unmatched * in "${raw}"`);
  atoms.forEach((a) => { if (!a.tok) assertNoTypedNumbers(a.text, where); });
  // accent list
  for (const ac of accents) {
    const next: Atom[] = [];
    for (const a of atoms) {
      if (a.tok) {
        if (!a.star && (ac.text === a.text || ac.text === a.raw)) { hits.add(ac.text); a.star = true; a.mark = ac.mark; }
        next.push(a);
      } else if (a.star) next.push(a);
      else {
        const re = new RegExp(`(?<![\\p{L}\\p{N}])${esc(ac.text)}(?![\\p{L}\\p{N}])`, "giu");
        let last = 0, m: RegExpExecArray | null;
        while ((m = re.exec(a.text))) {
          if (m.index > last) next.push({text: a.text.slice(last, m.index), tok: false, star: false});
          next.push({text: m[0], tok: false, star: true, mark: ac.mark});
          hits.add(ac.text);
          last = m.index + m[0].length;
        }
        if (last < a.text.length) next.push({text: a.text.slice(last), tok: false, star: false});
      }
    }
    atoms = next;
  }
  const units: Unit[] = [];
  const kindOf = (a: Atom, core: string): MarkKind => a.mark ?? (a.tok || /\d/.test(core) ? "circle" : "underline");
  for (const a of atoms) {
    const t = a.text;
    if (a.tok || a.star) {
      const core = t.trim();
      if (/^\s/.test(t) && units.length) units[units.length - 1].space = true;
      if (!core) continue;
      units.push({text: core, tok: a.tok, star: a.star, mark: kindOf(a, core), space: /\s$/.test(t)});
    } else {
      if (!t.trim()) { if (units.length) units[units.length - 1].space = true; continue; }
      const re = /(\s*)(\S+)(\s*)/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(t))) {
        if (m[1] && units.length) units[units.length - 1].space = true;
        units.push({text: m[2], tok: false, star: false, mark: "circle", space: m[3].length > 0});
      }
    }
  }
  return units;
};

// ---- layout by real measurement ----------------------------------------------------------------------------------------------
export type Chunk = {units: Unit[]; w: number};
export type VLine = {chunks: Chunk[]; w: number; src: number};
export const spaceW = (size: number) => measure("a a", ROUND_FONT, size) - measure("aa", ROUND_FONT, size);
const chunksOf = (units: Unit[], size: number): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Unit[] = [];
  units.forEach((u, i) => { cur.push(u); if (u.space || i === units.length - 1) { out.push({units: cur, w: measure(cur.map((x) => x.text).join(""), ROUND_FONT, size)}); cur = []; } });
  return out;
};
const greedy = (chunks: Chunk[], width: number, sw: number): Chunk[][] => {
  const rows: Chunk[][] = [];
  let cur: Chunk[] = [], w = 0;
  for (const c of chunks) {
    if (cur.length && w + sw + c.w > width) { rows.push(cur); cur = []; w = 0; }
    w += (cur.length ? sw : 0) + c.w;
    cur.push(c);
  }
  if (cur.length) rows.push(cur);
  return rows;
};
export const rowW = (row: Chunk[], sw: number) => row.reduce((a, c) => a + c.w, 0) + sw * Math.max(0, row.length - 1);
export const layout = (lines: Unit[][], size: number, width: number, balance = false): VLine[] => {
  const sw = spaceW(size), out: VLine[] = [];
  lines.forEach((units, src) => {
    const chunks = chunksOf(units, size);
    let rows = greedy(chunks, width, sw);
    if (balance && rows.length > 1) {   // same number of rows, as even as possible
      const k = rows.length;
      let lo = Math.max(...chunks.map((c) => c.w)), hi = width;
      for (let n = 0; n < 14; n++) { const mid = (lo + hi) / 2; if (greedy(chunks, mid, sw).length <= k) hi = mid; else lo = mid; }
      rows = greedy(chunks, hi + 0.5, sw);
    }
    rows.forEach((r) => out.push({chunks: r, w: rowW(r, sw), src}));
  });
  return out;
};
// Largest size (max .. min) at which the author's lines fit without extra wrapping; else the largest at which the wrapped block fits maxH.
export const fitBlock = (lines: Unit[][], width: number, maxH: number, max: number, min: number, lh: number, gap: number, balance = false, where = "text") => {
  const hOf = (v: VLine[], s: number) => v.length * s * lh + (v.length - 1) * gap;
  for (let s = max; s >= min; s -= 2) { const v = layout(lines, s, width, balance); if (v.length === lines.length && hOf(v, s) <= maxH) return {size: s, v}; }
  for (let s = max; s >= min; s -= 2) { const v = layout(lines, s, width, balance); if (hOf(v, s) <= maxH) return {size: s, v}; }
  throw new Error(`${where}: the text does not fit ${width} x ${maxH} px even at ${min} px; shorten it or split it over more lines`);
};

// ---- drawing the text ---------------------------------------------------------------------------------------------------------
// A hand-drawn mark (rough-notation) sized to the text: the circle hugs the digits (negative top/bottom padding: the line box is taller than the
// glyphs, and rough-notation draws the ellipse root-two wider than its box so that the box fits inside), the underline sits under the word.
// The seed changes every 3 frames, so the line boils the way hand-inked animation does.
export const Mark: React.FC<{kind: MarkKind; color: string; seed: number; f: number; at: number; size: number; children: React.ReactNode}> = ({kind, color, seed, f, at, size, children}) =>
  <EditorMark kind={kind} at={at} dur={10} seed={markSeed(900 + seed, Math.floor(f / 3) % 4)} color={color} strokeWidth={Math.max(6, Math.round(size * 0.05))}
    padding={kind === "circle" ? {left: -size * 0.04, right: -size * 0.04, top: -size * 0.2, bottom: -size * 0.2} : undefined}>{children}</EditorMark>;

export type RowStyle = {color: string; accent: string; mark: string};
export const Row: React.FC<{row: Chunk[]; size: number; f: number; t0: number; revealAt: number | null; st: RowStyle; seed: number; justify?: "flex-start" | "center"; shadow?: string}> =
  ({row, size, f, t0, revealAt, st, seed, justify = "flex-start", shadow}) => {
  const sw = spaceW(size);
  let k = 0;
  return <div style={{display: "flex", justifyContent: justify, alignItems: "baseline", gap: sw, whiteSpace: "nowrap", fontFamily: ROUND, fontWeight: 800, fontSize: size, lineHeight: 1.12, letterSpacing: "-0.01em",
    color: st.color, textShadow: shadow, fontFeatureSettings: "'lnum' 1"}}>
    {row.map((c, ci) => <span key={ci} style={{display: "inline-block", whiteSpace: "nowrap"}}>
      {c.units.map((u, ui) => {
        const id = k++;
        if (u.tok) {
          if (revealAt === null || f < revealAt) return <span key={ui} style={{display: "inline-block", width: measure(u.text, ROUND_FONT, size), height: 0, margin: u.star && u.mark === "circle" ? `0 ${size * 0.16}px` : undefined, boxSizing: "content-box", borderBottom: `${Math.max(6, size * 0.06)}px dashed ${st.color}`, opacity: 0.35}}/>;
          const t = pop(f, revealAt), inner = <span style={{display: "inline-block", transform: `scale(${0.6 + 0.4 * Math.min(1.12, t)})`, transformOrigin: "50% 70%"}}>{u.text}</span>;
          return <span key={ui} style={{display: "inline-block", color: u.star ? st.accent : undefined, margin: u.star && u.mark === "circle" ? `0 ${size * 0.16}px` : undefined}}>
            {u.star ? <Mark kind={u.mark} color={st.mark} seed={seed + id} f={f} at={revealAt + 6} size={size}>{inner}</Mark> : inner}</span>;
        }
        if (u.star) return <span key={ui} style={{display: "inline-block", color: st.accent, margin: u.mark === "circle" ? `0 ${size * 0.16}px` : undefined}}>
          <Mark kind={u.mark} color={st.mark} seed={seed + id} f={f} at={t0 + 14 + id * 6} size={size}>{u.text}</Mark></span>;
        return <span key={ui}>{u.text}</span>;
      })}
    </span>)}
  </div>;
};

// ---- small parts ------------------------------------------------------------------------------------------------------------
export const Chip: React.FC<{text: string; f: number; at: number; size?: number; bg?: string; fg?: string}> = ({text, f, at, size = 30, bg = C.ink, fg = C.white}) => {
  const t = pop(f, at, 200);
  if (t <= 0.001) return null;
  return <div style={{display: "inline-block", background: bg, color: fg, borderRadius: 999, padding: `${Math.round(size * 0.32)}px ${Math.round(size * 0.95)}px`, fontFamily: SANS, fontWeight: 900, fontSize: size,
    letterSpacing: size * 0.1, whiteSpace: "nowrap", transform: `scale(${t})`, transformOrigin: "0% 50%"}}>{text}</div>;
};

// Camera push-in on a group of SVG art: scale s0 -> s1 about (fx, fy) over the scene.
export const Push: React.FC<{f: number; dur: number; cam?: Cam; dflt: Required<Cam>; children: React.ReactNode}> = ({f, dur, cam, dflt, children}) => {
  const c = {...dflt, ...(cam ?? {})}, s = c.s0 + (c.s1 - c.s0) * easeIO(f, 0, Math.max(1, dur - 1));
  return <g transform={`translate(${c.fx} ${c.fy}) scale(${s}) translate(${-c.fx} ${-c.fy})`}>{children}</g>;
};

// Floating flat doodles (plus signs, rings, dots, squares) that drift slowly; `area` lists the boxes they may appear in (never closer than 150 px to each other).
export const Doodles: React.FC<{f: number; seed: string; n: number; colors: string[]; area: [number, number, number, number][]; size?: number}> = ({f, seed, n, colors, area, size = 1}) => {
  const items: {x: number; y: number; kind: number; col: string; s: number; ph: number; sp: number}[] = [];
  for (let i = 0; i < n && area.length; i++) {
    const a = area[i % area.length];
    for (let tries = 0; tries < 12; tries++) {
      const r = (k: string) => random(`${seed}-${i}-${tries}-${k}`), x = a[0] + r("x") * (a[2] - a[0]), y = a[1] + r("y") * (a[3] - a[1]);
      if (items.some((o) => Math.hypot(o.x - x, o.y - y) < 150) && tries < 11) continue;
      if (tries === 11 && items.some((o) => Math.hypot(o.x - x, o.y - y) < 150)) break;
      items.push({x, y, kind: Math.floor(r("k") * 4), col: colors[Math.floor(r("c") * colors.length)], s: (22 + r("s") * 26) * size, ph: r("p") * 6.28, sp: 30 + r("v") * 30});
      break;
    }
  }
  return <g>{items.map((d, i) => {
    const dy = Math.sin(f / d.sp + d.ph) * 12, dx = Math.cos(f / (d.sp * 1.3) + d.ph) * 7, rot = Math.sin(f / (d.sp * 1.7) + d.ph) * 18;
    const props = {fill: "none", stroke: d.col, strokeWidth: 9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const};
    return <g key={i} transform={`translate(${d.x + dx} ${d.y + dy}) rotate(${rot})`}>
      {d.kind === 0 && <path d={`M ${-d.s} 0 L ${d.s} 0 M 0 ${-d.s} L 0 ${d.s}`} {...props}/>}
      {d.kind === 1 && <circle r={d.s * 0.8} {...props}/>}
      {d.kind === 2 && <circle r={d.s * 0.45} fill={d.col}/>}
      {d.kind === 3 && <rect x={-d.s * 0.7} y={-d.s * 0.7} width={d.s * 1.4} height={d.s * 1.4} rx={7} {...props}/>}
    </g>;
  })}</g>;
};

// A speech bubble of any width: white, ink border, hard offset shadow, tail pointing at (tx, ty). Lines are drawn centred.
export const SpeechBubble: React.FC<{lines: string[]; size: number; x: number; y: number; w: number; h: number; tx: number; ty: number; f: number; at: number; side?: "left" | "bottom"}> =
  ({lines, size, x, y, w, h, tx, ty, f, at, side = "left"}) => {
  const t = pop(f, at, 200);
  if (t <= 0.001) return null;
  const rx = Math.min(46, h / 2 - 2), lh = size * 1.12, bob = Math.sin(f / 16) * 3;
  const cl = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
  let tail: string, patch: string;
  if (side === "left") {
    const by = cl(ty, y + rx * 0.8 + 34, y + h - rx * 0.8 - 34);
    tail = `M ${x} ${by - 34} L ${tx} ${ty} L ${x} ${by + 34} Z`;
    patch = `M ${x + 1} ${by - 28} L ${x + 10} ${by - 28} L ${x + 10} ${by + 28} L ${x + 1} ${by + 28} Z`;
  } else {
    const bx = cl(tx, x + rx + 40, x + w - rx - 40);
    tail = `M ${bx - 34} ${y + h} L ${tx} ${ty} L ${bx + 34} ${y + h} Z`;
    patch = `M ${bx - 28} ${y + h - 1} L ${bx - 28} ${y + h - 10} L ${bx + 28} ${y + h - 10} L ${bx + 28} ${y + h - 1} Z`;
  }
  return <g transform={`translate(${tx} ${ty}) scale(${t}) translate(${-tx} ${-ty}) translate(0 ${bob})`}>
    <g transform="translate(0 10)" fill={C.ink} stroke={C.ink} strokeWidth={7} strokeLinejoin="round"><rect x={x} y={y} width={w} height={h} rx={rx}/><path d={tail}/></g>
    <path d={tail} fill={C.white} stroke={C.ink} strokeWidth={7} strokeLinejoin="round"/>
    <rect x={x} y={y} width={w} height={h} rx={rx} fill={C.white} stroke={C.ink} strokeWidth={7}/>
    <path d={patch} fill={C.white}/>
    {lines.map((ln, i) => <text key={i} x={x + w / 2} y={y + (h - lines.length * lh) / 2 + lh * i + size * 0.84} textAnchor="middle" fontFamily={ROUND} fontWeight={800} fontSize={size} letterSpacing={-0.5} fill={C.ink}>{ln}</text>)}
  </g>;
};

// A talking mouth without a recording: ~7 syllables a second in phrases of 1.7 s with a breath between (Rhubarb's shapes).
const SHAPES = ["B", "C", "D", "E", "C", "F", "G", "H", "B", "D"];
export const visemeAt = (f: number, seed: number, from: number, to: number): string => {
  if (f < from || f >= to) return "X";
  const t = f - from, phrase = Math.floor(t / 52), k = t % 52;
  if (k >= 44) return "X";
  const r = random(`vis${seed}-${phrase}-${Math.floor(k / 4)}`);
  if (k % 4 === 3 && r < 0.4) return "A";
  return SHAPES[Math.floor(r * SHAPES.length)];
};
