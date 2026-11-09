// Look B "statement" scenes: citation and quote cards, the dark scenes of the film. A deep warm-brown (quotes) or ink-blue (claims) paper card fills the
// frame; cream Newsreader text, small-caps citation lines, accent words get a warm highlighter stroke. Spec: {lines: (string | {text, key})[], accent?: string[]}.
// Figure tokens ({const:9}, {tfr/...}) are resolved by the cartoon statement kit's rules; a line with a token is drawn only from at(key).
import React from "react";
import {AbsoluteFill} from "remotion";
import {measure} from "../../shared/fit";
import {SAFE, type SceneProps} from "../../cartoon/long/contract";
import {parseLine, type AccentIn, type LineIn, type Unit} from "../../cartoon/long/scenes/statement_kit";
import {PaperFinish, SANS, SERIF, W, H, clamp, eo, rng} from "../kit";

export type StatementSpec = {lines: LineIn[]; accent?: AccentIn[]; camera?: unknown; notes?: string};
type Role = "quote" | "body" | "cite";
const prog = (f: number, a: number, d: number) => clamp((f - a) / d);

const SERIF_F = {family: SERIF, weight: 500, tnum: false, letterSpacing: 0};
type Chunk = {units: Unit[]; w: number};
const chunksOf = (units: Unit[], size: number): Chunk[] => {
  const out: Chunk[] = []; let cur: Unit[] = [];
  units.forEach((u, i) => { cur.push(u); if (u.space || i === units.length - 1) { out.push({units: cur, w: measure(cur.map((x) => x.text).join(""), SERIF_F, size)}); cur = []; } });
  return out;
};
const greedy = (chunks: Chunk[], width: number, sw: number): Chunk[][] => {
  const rows: Chunk[][] = []; let cur: Chunk[] = [], w = 0;
  for (const c of chunks) { if (cur.length && w + sw + c.w > width) { rows.push(cur); cur = []; w = 0; } w += (cur.length ? sw : 0) + c.w; cur.push(c); }
  if (cur.length) rows.push(cur);
  return rows;
};
/** rows of a line at `size`, balanced (same number of rows, as even as possible) */
const rowsOf = (units: Unit[], size: number, width: number): Chunk[][] => {
  const sw = measure("a a", SERIF_F, size) - measure("aa", SERIF_F, size), chunks = chunksOf(units, size);
  let rows = greedy(chunks, width, sw);
  if (rows.length > 1) {
    const k = rows.length; let lo = Math.max(...chunks.map((c) => c.w)), hi = width;
    for (let n = 0; n < 14; n++) { const mid = (lo + hi) / 2; if (greedy(chunks, mid, sw).length <= k) hi = mid; else lo = mid; }
    rows = greedy(chunks, hi + 0.5, sw);
  }
  return rows;
};

const THEMES = {
  brown: {a: "#5c3a21", b: "#2b190d", glow: "rgba(224,150,84,.42)", glow2: "rgba(120,60,30,.5)", gold: "#dbb479", text: "#f8ecd4", accent: "#ffd27a", hi: "255,176,64"},
  blue: {a: "#223559", b: "#0d1630", glow: "rgba(110,150,220,.4)", glow2: "rgba(40,70,140,.5)", gold: "#d4bd8a", text: "#f6eedc", accent: "#ffcc78", hi: "255,170,70"},
};

export const Scene: React.FC<SceneProps<StatementSpec>> = ({f, dur, spec, at}) => {
  if (!spec || !Array.isArray(spec.lines) || !spec.lines.length) throw new Error("statement: spec.lines must be a non-empty array");
  const accents = (spec.accent ?? []).map((a) => (typeof a === "string" ? {text: a} : a)), hits = new Set<string>();
  const parsed = spec.lines.map((ln, i) => {
    const o = typeof ln === "string" ? {text: ln} : ln, units = parseLine(o.text, accents, hits, `statement line ${i + 1}`), key = (o as {key?: string}).key;
    if (units.some((u) => u.tok) && !key) throw new Error(`statement line ${i + 1}: "${o.text}" prints a figure, so the line needs a reveal key: {text, key}`);
    return {units, text: o.text, revealAt: key ? at(key) : null, tok: units.some((u) => u.tok)};
  });
  accents.forEach((a) => { if (!hits.has(a.text)) throw new Error(`statement: accent "${a.text}" is not in any line`); });
  const hasQuote = parsed.some((l) => l.text.trim().startsWith("“")), hasAccent = accents.length > 0;
  const roles: Role[] = parsed.map((l) => {
    const t = l.text.trim();
    if (t.startsWith("“")) return "quote";
    if (parsed.length > 1 && ((l.tok && !t.includes("“")) || t.endsWith(":"))) return "cite";
    return "body";
  });
  const who = !hasQuote && !hasAccent && !roles.includes("cite") && parsed.length > 1;
  const bullets = !hasQuote && !who && roles.filter((r) => r === "body").length >= 3, center = !bullets;
  const theme = hasQuote ? THEMES.brown : THEMES.blue, avail = bullets ? 1440 : 1560, maxH = 690;
  const scaleOf = (r: Role, i: number, base: number) => (who ? (i === 0 ? 1.22 : 0.74) * base : r === "body" && hasQuote ? 0.8 * base : base);
  const citeSize = (b: number) => clamp(Math.round(b * 0.36), 34, 46);
  // the largest size at which the whole card fits
  let base = 108, sized: {rows: Chunk[][]; size: number; role: Role}[] = [];
  const oneRow = bullets || who;                                               // lists and credential cards keep every line on one row when they can
  for (let pass = oneRow ? 0 : 1; pass < 2; pass++) {
    for (base = 108; base >= 48; base -= 2) {
      sized = parsed.map((l, i) => roles[i] === "cite" ? {rows: [], size: citeSize(base), role: roles[i]} : {rows: rowsOf(l.units, scaleOf(roles[i], i, base), avail), size: scaleOf(roles[i], i, base), role: roles[i]});
      const h = sized.reduce((a, s) => a + (s.role === "cite" ? s.size * 1.6 : s.rows.length * s.size * 1.16), 0) + (sized.length - 1) * 30;
      if (h <= maxH && (pass === 1 || sized.every((s) => s.rows.length <= 1))) break;
    }
    if (base >= 48) break;
  }
  if (base < 48) throw new Error("statement: the text does not fit the card even at the smallest size; shorten it");
  const heights = sized.map((s) => (s.role === "cite" ? s.size * 1.6 : s.rows.length * s.size * 1.16));
  const total = heights.reduce((a, b) => a + b, 0) + (sized.length - 1) * 30, top = SAFE.y0 + 40 + (maxH + 60 - total) / 2;
  // reveal times: a keyed line never shows before at(key); lines keep their order
  const gap = clamp(dur * 0.1, 10, 28), t0: number[] = [];
  parsed.forEach((l, i) => { const prev = i ? t0[i - 1] + 7 : 0; t0.push(l.revealAt !== null ? Math.max(l.revealAt, prev) : Math.max(6 + i * gap, prev)); });

  const t = f / Math.max(1, dur), lx = 18 + 16 * t, ly = 16 + 6 * Math.sin(f / 90);
  const motes = Array.from({length: 34}, (_, i) => { const r = rng(i * 31 + 7); return {x: r() * W, y: r() * H, s: 1 + r() * 2.8, sp: 0.1 + r() * 0.26, ph: r() * 6.28, d: 0.4 + r() * 0.9}; });
  const ink = theme.gold;
  let y = top;
  return (
    <AbsoluteFill style={{overflow: "hidden", background: theme.b}}>
      <div style={{position: "absolute", inset: 0, background: `linear-gradient(150deg, ${theme.a} 0%, ${theme.b} 78%)`}}/>
      <div style={{position: "absolute", inset: 0, background: `radial-gradient(60% 70% at ${lx}% ${ly + 14}%, ${theme.glow} 0%, rgba(0,0,0,0) 70%)`, mixBlendMode: "screen"}}/>
      <div style={{position: "absolute", inset: 0, background: `radial-gradient(70% 60% at 85% 95%, ${theme.glow2} 0%, rgba(0,0,0,0) 70%)`}}/>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", inset: 0}}>
        <defs>
          <linearGradient id="sb-rule" x1="0" x2="1"><stop offset="0" stopColor={ink} stopOpacity="0"/><stop offset="1" stopColor={ink} stopOpacity="0.9"/></linearGradient>
          <linearGradient id="sb-rule2" x1="1" x2="0"><stop offset="0" stopColor={ink} stopOpacity="0"/><stop offset="1" stopColor={ink} stopOpacity="0.9"/></linearGradient>
        </defs>
        {motes.map((m, i) => { const yy = ((m.y - f * m.sp * m.d * 3 + 4000) % (H + 40)) - 20, xx = m.x + Math.sin(f / 60 + m.ph) * 14 * m.d; return <circle key={i} cx={xx} cy={yy} r={m.s * m.d} fill="#ffe2b0" opacity={0.1 + 0.2 * m.d * (0.5 + 0.5 * Math.sin(f / 30 + m.ph))}/>; })}
        <rect x={28} y={28} width={W - 56} height={H - 56} rx={22} fill="none" stroke={ink} strokeWidth={1.8} opacity={0.55}/>
        <rect x={42} y={42} width={W - 84} height={H - 84} rx={14} fill="none" stroke={ink} strokeWidth={0.9} opacity={0.35}/>
        {[[28, 28], [W - 28, 28], [28, H - 28], [W - 28, H - 28]].map(([cx, cy], i) => <g key={i} transform={`translate(${cx} ${cy}) rotate(45)`}><rect x={-7} y={-7} width={14} height={14} fill={theme.b} stroke={ink} strokeWidth={1.6}/><rect x={-2.5} y={-2.5} width={5} height={5} fill={ink}/></g>)}
        {hasQuote && <text x={92} y={420} fontFamily={SERIF} fontWeight={600} fontSize={520} fill={theme.accent} opacity={0.08 + 0.02 * Math.sin(f / 70)}>{"“"}</text>}
      </svg>
      <PaperFinish id="stpf" grain={0.6} vignette={0.5}/>
      {sized.map((s, i) => {
        const k = eo(prog(f, t0[i], 16)), L = parsed[i], my = y, h = heights[i];
        y += h + 30;
        if (f < t0[i] && L.tok) return null;                                  // a figure is never in the DOM before its reveal
        const common: React.CSSProperties = {position: "absolute", left: 160, width: 1600, top: my, height: h, opacity: k, transform: `translateY(${(1 - k) * 34}px)`};
        if (s.role === "cite") {
          return (
            <div key={i} style={{...common, display: "flex", alignItems: "center", justifyContent: "center", gap: 28}}>
              <svg width={150} height={10} style={{flexShrink: 0, display: "block"}}><rect x={0} y={4} width={140} height={2} fill="url(#sb-rule)"/><rect x={138} y={1} width={8} height={8} transform="rotate(45 142 5)" fill={ink}/></svg>
              <span style={{fontFamily: SANS, fontWeight: 700, fontSize: s.size, letterSpacing: "0.18em", textTransform: "uppercase", color: ink, whiteSpace: "nowrap", textShadow: "0 2px 10px rgba(0,0,0,.45)"}}>{L.units.map((u) => u.text + (u.space ? " " : "")).join("").trim()}</span>
              <svg width={150} height={10} style={{flexShrink: 0, display: "block"}}><rect x={10} y={4} width={140} height={2} fill="url(#sb-rule2)"/><rect x={4} y={1} width={8} height={8} transform="rotate(45 8 5)" fill={ink}/></svg>
            </div>
          );
        }
        return (
          <div key={i} style={{...common, left: bullets ? 240 : 160, width: bullets ? avail : 1600, display: "flex", flexDirection: "column", alignItems: center ? "center" : "flex-start", justifyContent: "center"}}>
            {bullets && <svg width={22} height={22} style={{position: "absolute", left: -56, top: s.size * 0.5 - 6}}><rect x={4} y={4} width={13} height={13} transform="rotate(45 10 10)" fill={ink} opacity={0.9}/></svg>}
            {who && i === 1 && <div style={{position: "absolute", top: -17, left: "50%", marginLeft: -60, width: 120, height: 2, background: `linear-gradient(90deg, transparent, ${ink}, transparent)`}}/>}
            {s.rows.map((row, ri) => (
              <div key={ri} style={{fontFamily: SERIF, fontWeight: 500, fontSize: s.size, lineHeight: 1.16, color: theme.text, whiteSpace: "nowrap", textShadow: "0 3px 18px rgba(0,0,0,.45)", fontFeatureSettings: "'lnum' 1", opacity: who && i > 0 ? 0.86 : 1}}>
                {row.map((c, ci) => c.units.map((u, ui) => {
                  const last = ci === row.length - 1 && ui === c.units.length - 1, txt = u.text + (u.space && !last ? " " : "");
                  if (!u.star) return <span key={`${ci}-${ui}`}>{txt}</span>;
                  const p = eo(prog(f, t0[i] + 12 + ri * 4, 22));
                  return <span key={`${ci}-${ui}`} style={{color: p > 0.15 ? theme.accent : undefined, padding: "0 0.1em", margin: "0 -0.1em", backgroundImage: `linear-gradient(rgba(${theme.hi},.34), rgba(${theme.hi},.34))`,
                    backgroundRepeat: "no-repeat", backgroundPosition: "0 92%", backgroundSize: `${p * 100}% 36%`, textShadow: "0 3px 18px rgba(0,0,0,.5)"}}>{txt}</span>;
                }))}
              </div>
            ))}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
