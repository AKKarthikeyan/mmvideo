// Slab look: poster type. Rows are fitted to the safe width on Anybody's width axis (narrow first, then widen when the
// size is capped), words slam in (spring 14/260/0.6 from scale 1.35, y -0.22 em), *starred* words take the slab's
// emphasis colour or a solid block, and every printed number inside a row is an InlineNum: blank tiles, then a glyph-free
// reel, then digits from its own lock frame (never before). Fonts and colours come from the brand (B.f, Pal).
import React from "react";
import {Easing} from "remotion";
import type {LookBrand} from "../brands/types";
import {ratio} from "../brands/contrast";
import {assertLocked} from "../shared/lock";
import {fitCss, fitFont, fitLines, measure, wrap, type FitFont} from "../shared/fit";
import type {LookNum} from "../shared/types";
import {BASE, CAP, CAP_TOP, DROP, SLAM, ease, springAt, type Pal} from "./kit";
import type {Seg} from "./plan";

export const display = (B: LookBrand, stretch = 100): FitFont => ({...fitFont(B.f.display), stretch});
export const heroFont = (B: LookBrand, stretch = 100): FitFont => ({...fitFont(B.f.hero), stretch});
export const monoFont = (B: LookBrand, tracking = 0): FitFont => fitFont(B.f.mono, tracking);
export const up = (s: string) => s.toUpperCase();

// Width per px of size (measured once at 100 px; text width is linear in size).
export const per = (text: string, font: FitFont) => measure(text, font, 100) / 100;

export type Fit = {size: number; stretch: number; w: number; fits: boolean};
// Poster fit: the largest size up to `max` at which `text` fills `W`, condensing to `lo` first, widening to `hi` when capped.
export const fitRow = (text: string, font: FitFont, W: number, max: number, min: number, lo = 62, hi = 125): Fit => {
  const at = (st: number) => per(text, {...font, stretch: st});
  const sLo = (W * 0.985) / at(lo);
  if (sLo <= max) return {size: Math.floor(sLo * 10) / 10, stretch: lo, w: at(lo) * Math.floor(sLo * 10) / 10, fits: sLo >= min};
  if (at(hi) * max <= W * 0.985) return {size: max, stretch: hi, w: at(hi) * max, fits: true};
  let a = lo, b = hi;
  for (let k = 0; k < 14; k++) { const m = (a + b) / 2; if (at(m) * max <= W * 0.985) a = m; else b = m; }
  const st = Math.floor(a * 10) / 10;
  return {size: max, stretch: st, w: at(st) * max, fits: true};
};
// Natural fit: stretch fixed, size shrinks to fit (for centred rows and decks).
export const fitNatural = (text: string, font: FitFont, W: number, max: number): Fit => {
  const p = per(text, font), size = Math.min(max, Math.floor((W * 0.985) / p * 10) / 10);
  return {size, stretch: font.stretch ?? 100, w: p * size, fits: true};
};

// ---------- numbers: the char model shared by inline numbers and the board ----------
export type NumChar = {ch: string; kind: "qual" | "sign" | "prefix" | "digit" | "sep" | "gunit" | "wunit"; col: number};
export const numChars = (n: LookNum): NumChar[] => {
  const out: NumChar[] = [];
  for (const ch of n.qual) out.push({ch, kind: "qual", col: -1});
  for (const ch of n.sign) out.push({ch, kind: "sign", col: -1});
  for (const ch of n.prefix) out.push({ch, kind: "prefix", col: -1});
  let c = 0;
  for (const ch of n.digits) out.push(/\d/.test(ch) ? {ch, kind: "digit", col: c++} : {ch, kind: "sep", col: -1});
  const glyphUnit = /^[%×]$/.test(n.unit);
  for (const ch of n.unit) out.push({ch, kind: glyphUnit ? "gunit" : "wunit", col: -1});
  return out;
};
export const digitCount = (n: LookNum) => [...n.digits].filter((c) => /\d/.test(c)).length;
// Columns lock right to left: the rightmost exactly on lockF, then one or two frames apart (never before lockF).
export const colLock = (n: LookNum, col: number) => { const k = digitCount(n); return n.lockF + (k - 1 - col) * (k > 4 ? 1 : 2); };
export const fullLock = (n: LookNum) => colLock(n, 0);
export const REEL = 8;     // frames of glyph-free reel before a column locks

// A blank board tile (split-flap block with a hairline) or, from lockF - 8, a glyph-free streak reel.
export const Tile: React.FC<{x: number; y: number; w: number; h: number; f: number; reelFrom: number; seed: number; pal: Pal; streak: string}> =
  ({x, y, w, h, f, reelFrom, seed, pal, streak}) => {
  const reel = f >= reelFrom;
  const off = reel ? ((f - reelFrom) * 0.55 * h + seed * 0.37 * h) % (0.5 * h) : 0;
  return <div style={{position: "absolute", left: x + w * 0.05, top: y - h * 0.03, width: w * 0.9, height: h * 1.06, background: pal.tile, borderRadius: Math.max(2, h * 0.05), overflow: "hidden"}}>
    {reel ? <div style={{position: "absolute", left: "8%", right: "8%", top: -h, height: 3 * h, filter: `blur(${Math.max(1, h * 0.025)}px)`, transform: `translateY(${off}px)`,
      backgroundImage: `repeating-linear-gradient(to bottom, ${streak} 0px, ${streak} ${0.11 * h}px, transparent ${0.11 * h}px, transparent ${0.5 * h / 3 * 1.0}px)`, opacity: 0.85}}/>
      : <div style={{position: "absolute", left: 0, right: 0, top: h * 0.53 - 1, height: 2, background: pal.bg, opacity: 0.85}}/>}
  </div>;
};

// A printed number inside a row of words: same width as its text, gated column by column.
export const InlineNum: React.FC<{n: LookNum; text: string; font: FitFont; size: number; color: string; pal: Pal; f: number; where: string}> =
  ({n, text, font, size, color, pal, f, where}) => {
  const cs = numChars(n);
  const shownText = text;     // already upper-cased by the row if needed
  // positions by prefix measurement (sums of single glyphs, as drawn)
  let x = 0;
  const box = cs.map((c, i) => {
    const ch = shownText[i] ?? c.ch;
    const w = measure(ch, font, size);
    const b = {ch, x, w, c};
    x += w;
    return b;
  });
  const h = CAP * size;
  const lockAll = n.lockF;
  return <span style={{position: "relative", display: "inline-block", width: x, height: size, verticalAlign: "top"}}>
    {box.map((b, i) => {
      const k = b.c.kind;
      if (k === "digit") {
        const at = colLock(n, b.c.col);
        if (f < at) return <Tile key={i} x={b.x} y={(BASE - CAP) * size} w={b.w} h={h} f={f} reelFrom={n.lockF - REEL} seed={b.c.col + 1} pal={pal} streak={ratio(color, pal.tile) > 2 ? color : pal.bg}/>;
        assertLocked(n, f, where);
        const q = springAt(f, at, DROP);
        return <span key={i} style={{position: "absolute", left: b.x, top: 0, height: size, lineHeight: `${size}px`, overflow: "hidden", color}}>
          <span style={{display: "block", transform: `translateY(${(1 - q) * -0.35 * size}px)`}}>{b.ch}</span></span>;
      }
      if ((k === "sign" || k === "wunit") && f < lockAll) return null;
      const o = k === "wunit" ? ease(f, lockAll, lockAll + 5) : 1;
      return <span key={i} style={{position: "absolute", left: b.x, top: 0, lineHeight: `${size}px`, color, opacity: o, whiteSpace: "pre"}}>{b.ch}</span>;
    })}
  </span>;
};

// ---------- rows ----------
export type RowLayout = {segs: Seg[]; text: string; fit: Fit; x: number; y: number; w: number};   // y: cap top

// Words are set in capitals; printed numbers keep their own case (t is tonnes, not T).
export const rowText = (segs: Seg[], upper = true) => segs.map((s, i) => (i && s.sp ? " " : "") + (upper && !s.num ? up(s.t) : s.t)).join("");

// One row of a poster: words slam in from `at` (1 frame apart), numbers gated, hot words in the emphasis colour or block.
// The slam (scale 1.35 -> 1, y -0.22 em) happens inside each word's own clip box, a mask zoom: the word can never cross a
// neighbour or the row above, even for a frame (the 27 Oct review caught 'THEUS' and 'HOWMUCH' mid-slam). The clip box
// is the word's width (plus 0.02 em) and its line box from the row gap above to below the descenders.
export const Row: React.FC<{B: LookBrand; L: RowLayout; pal: Pal; f: number; at: number; upper?: boolean; color?: string; hot?: string; where: string; stagger?: number;
  block?: {bg: string; fg: string} | null; hotAt?: (i: number) => number}> =
  ({B, L: R, pal, f, at, upper = true, color, hot, where, stagger = 1, block, hotAt}) => {
  const font = display(B, R.fit.stretch);
  const size = R.fit.size;
  const ink = color ?? pal.ink;
  const hb = block === undefined ? pal.hotBlock : block;
  const hotC = hot ?? (hb ? hb.fg : pal.hot);
  return <div style={{position: "absolute", left: R.x, top: R.y - CAP_TOP * size, height: size, ...fitCss(font, size), lineHeight: `${size}px`, color: ink}}>
    {R.segs.map((s, i) => {
      const t = upper && !s.num ? up(s.t) : s.t;
      const a = at + i * stagger;
      const sp = springAt(f, a, SLAM);
      const o = ease(f, a, a + 2, Easing.linear);
      if (f < a) return <React.Fragment key={i}>{i && s.sp ? " " : ""}<span style={{visibility: "hidden"}}>{t}</span></React.Fragment>;
      const k = 0.35 * (1 - sp);
      const tr = `translateY(${(1 - sp) * -0.22 * size}px) scale(${1 + k})`;
      // emphasis: from the narrator's word when given (the block wipes in), else with the word
      const ha = hotAt ? hotAt(i) : a;
      const isHot = s.hot && f >= ha;
      const hp = s.hot ? ease(f, ha, ha + 5, Easing.inOut(Easing.cubic)) : 0;
      // a block wipes in left to right with the word recoloured inside it (the word drawn twice, the top copy clipped to
      // the block), so no letter is ever the colour of what is behind it
      const wiping = s.hot && !!hb && hp > 0 && hp < 1;
      const c = isHot ? (hb ? (hp >= 1 ? hotC : ink) : hotC) : ink;
      const word = (col: string) => s.num ? <InlineNum n={s.num} text={t} font={font} size={size} color={col} pal={pal} f={f} where={where}/> : t;
      const inner = wiping
        ? <span style={{position: "relative", display: "inline-block"}}>{word(ink)}
            <span style={{position: "absolute", left: 0, top: 0, color: hotC, clipPath: `inset(-0.3em ${(1 - hp) * 100}% -0.3em -0.1em)`, whiteSpace: "pre"}}>{word(hotC)}</span></span>
        : word(c);
      // isolation: the emphasis block (z -1) must stay behind its own word, not fall behind the slab
      return <React.Fragment key={i}>{i && s.sp ? " " : ""}<span style={{display: "inline-block", position: "relative", color: c, isolation: "isolate"}}>
        {s.hot && hb && hp > 0 && <span style={{position: "absolute", left: i === 0 ? 0 : -0.05 * size, top: (CAP_TOP - 0.07) * size, height: (CAP + 0.14) * size, background: hb.bg,
          width: `calc((100% + ${(i === 0 ? 0 : 0.05) + (i === R.segs.length - 1 ? 0 : 0.05)}em) * ${hp})`, zIndex: -1}}/>}
        <span style={{display: "inline-block", clipPath: `inset(0 ${i === R.segs.length - 1 ? 0 : -0.02}em -0.3em ${i === 0 ? 0 : -0.02}em)`, opacity: o}}>
          <span style={{display: "inline-block", transform: tr, transformOrigin: "50% 78%"}}>{inner}</span></span></span></React.Fragment>;
    })}
  </div>;
};

// ---------- small pieces ----------
// A mono label in a solid block (qualifier pills: OVER, UP, ABOVE, AT).
export const Pill: React.FC<{B: LookBrand; text: string; x: number; y: number; size: number; bg: string; fg: string; f: number; at: number}> = ({B, text, x, y, size, bg, fg, f, at}) => {
  const s = springAt(f, at, SLAM);
  if (f < at) return null;
  return <div style={{position: "absolute", left: x, top: y, background: bg, color: fg, padding: `${size * 0.12}px ${size * 0.3}px`, ...fitCss(monoFont(B, 0.08), size), lineHeight: 1,
    transform: `scale(${1 + 0.3 * (1 - s)})`, transformOrigin: "0% 50%", opacity: Math.min(1, s * 3)}}>{up(text)}</div>;
};
export const pillH = (size: number) => size * 1.24;

// A fact's name block: the card's name in poster type on a solid bar, wiped in left to right.
export const NameBlock: React.FC<{B: LookBrand; segs: Seg[]; fit: Fit; x: number; y: number; pal: Pal; f: number; at: number; where: string}> = ({B, segs, fit, x, y, pal, f, at, where}) => {
  const p = ease(f, at, at + 6, Easing.inOut(Easing.cubic));
  if (p <= 0) return null;
  const size = fit.size, padX = size * 0.16, padY = size * 0.14;
  return <div style={{position: "absolute", left: x, top: y, width: fit.w + 2 * padX, height: CAP * size + 2 * padY, background: pal.block.bg, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}}>
    <Row B={B} L={{segs, text: "", fit, x: padX, y: padY, w: fit.w}} pal={{...pal, ink: pal.block.fg}} f={f} at={at - 20} color={pal.block.fg} hot={pal.block.fg} block={null} where={where}/>
  </div>;
};
export const nameBlockH = (fit: Fit) => CAP * fit.size + 2 * fit.size * 0.14;
// The other name style: the name in poster type straight on the slab, a thick rule in the bar colour wiping in under it.
export const NameRule: React.FC<{B: LookBrand; segs: Seg[]; fit: Fit; x: number; y: number; pal: Pal; f: number; at: number; where: string; W: number}> = ({B, segs, fit, x, y, pal, f, at, where, W}) => {
  const p = ease(f, at + 2, at + 9, Easing.inOut(Easing.cubic));
  const size = fit.size;
  return <>
    <Row B={B} L={{segs, text: "", fit, x, y: y + 0.14 * size, w: fit.w}} pal={pal} f={f} at={at} where={where} block={null} hot={pal.ink}/>
    {p > 0 && <div style={{position: "absolute", left: x, top: y + (0.14 + CAP + 0.12) * size, width: Math.max(fit.w, Math.min(W, fit.w + 120)) * p, height: Math.max(10, 0.1 * size), background: pal.bar}}/>}
  </>;
};
export const nameRuleH = (fit: Fit) => (0.14 + CAP + 0.12 + 0.1) * fit.size + 4;
export const nameBlockW = (fit: Fit) => fit.w + 2 * fit.size * 0.16;

// A provenance ticket: perforated card, mono type, slides in from the right. Lines are given already wrapped.
export type TicketLayout = {head: string[]; body: string[]; headSize: number; bodySize: number; w: number; h: number};
export const TICKET_MIN = 32;
export const ticketLayout = (B: LookBrand, head: string, body: string, W: number, headMax = 36, bodyMax = 32): TicketLayout => {
  const pad = 20, perf = 18, inner = W - 2 * pad - perf;
  const hf = monoFont(B, 0.04), bf = monoFont(B);
  const H = head ? fitLines(up(head), hf, inner, 2, Math.max(headMax, TICKET_MIN), TICKET_MIN) : {size: headMax, lines: [] as string[]};
  const Bd = body ? fitLines(body, bf, inner, 4, Math.max(bodyMax, TICKET_MIN), TICKET_MIN) : {size: bodyMax, lines: [] as string[]};
  const wHead = Math.max(0, ...H.lines.map((l) => measure(l, hf, H.size)));
  const wBody = Math.max(0, ...Bd.lines.map((l) => measure(l, bf, Bd.size)));
  const w = Math.min(W, Math.ceil(Math.max(wHead, wBody)) + 2 * pad + perf + 2);
  const h = Math.ceil(H.lines.length * H.size * 1.25 + (Bd.lines.length ? Bd.lines.length * Bd.size * 1.3 + (H.lines.length ? 8 : 0) : 0) + 2 * 14);
  return {head: H.lines, body: Bd.lines, headSize: H.size, bodySize: Bd.size, w, h};
};
export const Ticket: React.FC<{B: LookBrand; T: TicketLayout; x: number; y: number; bg: string; fg: string; hole: string; f: number; at: number; align?: "left" | "right"; W?: number}> =
  ({B, T, x, y, bg, fg, hole, f, at, align = "left", W = 0}) => {
  if (f < at) return null;
  const p = ease(f, at, at + 7);
  const left = align === "right" ? x + W - T.w : x;
  const holes = Math.max(2, Math.floor(T.h / 16));
  return <div style={{position: "absolute", left, top: y, width: T.w, height: T.h, background: bg, color: fg, clipPath: `inset(0 ${((1 - p) * 100).toFixed(2)}% 0 0)`, padding: "14px 20px 14px 38px", boxSizing: "border-box"}}>
    <div style={{position: "absolute", left: 6, top: 0, bottom: 0, width: 10}}>
      {Array.from({length: holes}, (_, i) => <div key={i} style={{position: "absolute", left: 0, top: (i + 0.5) * (T.h / holes) - 5, width: 10, height: 10, borderRadius: 5, background: hole}}/>)}
    </div>
    <div style={{position: "absolute", left: 22, top: 6, bottom: 6, width: 0, borderLeft: `2px dashed ${hole}`, opacity: 0.6}}/>
    {T.head.map((l, i) => <div key={i} style={{...fitCss(monoFont(B, 0.04), T.headSize), lineHeight: 1.25}}>{l}</div>)}
    {T.body.length > 0 && <div style={{marginTop: T.head.length ? 8 : 0}}>{T.body.map((l, i) => <div key={i} style={{...fitCss(monoFont(B), T.bodySize), lineHeight: 1.3, opacity: 0.92}}>{l}</div>)}</div>}
  </div>;
};

// Plain wrapped deck lines (a card's text) in poster type at a fixed size, slammed per line.
export type DeckLayout = {lines: string[]; size: number; h: number};
export const deckLayout = (B: LookBrand, text: string, W: number, max = 58, min = 40, maxLines = 2): DeckLayout => {
  const font = display(B, 92);
  const D = fitLines(text, font, W, maxLines, max, min);
  let lines = D.lines;
  if (lines.length === 2) {      // balance two lines (no orphan word)
    const words = text.split(/\s+/).filter(Boolean);
    let best = lines, bw = Math.max(...lines.map((l) => measure(l, font, D.size)));
    for (let k = 1; k < words.length; k++) {
      const a = words.slice(0, k).join(" "), b = words.slice(k).join(" ");
      const w = Math.max(measure(a, font, D.size), measure(b, font, D.size));
      if (w <= W && w < bw) { bw = w; best = [a, b]; }
    }
    lines = best;
  }
  return {lines, size: D.size, h: lines.length * D.size * 1.0};
};
export const Deck: React.FC<{B: LookBrand; D: DeckLayout; x: number; y: number; color: string; f: number; at: number; align?: "left" | "right"; W: number}> = ({B, D, x, y, color, f, at, align = "left", W}) => {
  const font = display(B, 92);
  return <>{D.lines.map((l, i) => {
    const a = at + i * 3;
    if (f < a) return null;
    const s = springAt(f, a, SLAM);
    const w = measure(l, font, D.size);
    const room = Math.max(1, (W - 2) / Math.max(1, w));      // a wide line slams on the vertical only: it never leaves the box
    const sx = 1 + Math.min(0.2, room - 1) * (1 - s), sy = 1 + 0.2 * (1 - s);
    return <div key={i} style={{position: "absolute", left: align === "right" ? x + W - w : x, top: y + i * D.size - CAP_TOP * D.size, ...fitCss(font, D.size), lineHeight: `${D.size}px`, color,
      clipPath: "inset(-0.02em -0.02em -0.3em -0.02em)", opacity: Math.min(1, s * 3)}}>
      <div style={{transform: `translateY(${(1 - s) * -0.22 * D.size}px) scale(${sx}, ${sy})`, transformOrigin: align === "right" ? "100% 80%" : "0% 80%"}}>{l}</div></div>;
  })}</>;
};

export {wrap};

// ---------- stacks: rows of one group set at one common size ----------
// Greedy: start from the given rows, split the row that limits the size at its most balanced word break while that makes
// the type bigger (at most maxRows rows, each still a run of whole words and numbers), then set every row at the common
// size. justify: each row widened on the width axis (up to 125) to fill the width; ragged: one fixed width axis.
export type Stack = {rows: Seg[][]; fits: Fit[]; size: number; h: number};
export const stackFit = (B: LookBrand, rows0: Seg[][], W: number, maxH: number, maxS: number,
  opts: {mode?: "justify" | "ragged"; stretch?: number; gapK?: number; maxRows?: number; upper?: boolean; gain?: number} = {}): Stack => {
  const mode = opts.mode ?? "justify", gapK = opts.gapK ?? 0.2, maxRows = opts.maxRows ?? 5, upper = opts.upper ?? true;
  const st0 = mode === "justify" ? 62 : (opts.stretch ?? 90);
  const pw = (r: Seg[]) => per(rowText(r, upper), display(B, st0));
  const sizeFor = (rows: Seg[][]) => {
    const sW = Math.min(...rows.map((r) => (W * 0.985) / pw(r)));
    const sH = maxH / (rows.length * CAP + (rows.length - 1) * gapK);
    return Math.min(maxS, sW, sH);
  };
  const okRow = (r: Seg[]) => r.some((x) => x.num || /[A-Za-z0-9]/.test(x.t));
  // no orphan rows of one short word ("TO", "A", "OF")
  const okSplit = (r: Seg[]) => okRow(r) && !(r.length === 1 && !r[0].num && r[0].t.replace(/[^A-Za-z]/g, "").length <= 3);
  // split the widest row again and again (balanced word breaks), then keep the configuration with the biggest type;
  // each extra row has to buy at least `gain` (6%) more size than the best so far
  let cur = rows0.filter(okRow);
  let rows = cur, S = sizeFor(cur);
  const gain = opts.gain ?? 1.06;
  for (let guard = 0; guard < 10 && cur.length < maxRows; guard++) {
    const order = cur.map((r, i) => i).sort((a, b) => pw(cur[b]) - pw(cur[a]));
    let next: Seg[][] | null = null;
    for (const lim of order) {
      const r = cur[lim];
      if (r.length < 2) continue;
      let best: Seg[][] | null = null, bw = Infinity;
      for (let k = 1; k < r.length; k++) {
        const a = r.slice(0, k), b = [{...r[k], sp: false}, ...r.slice(k + 1)];
        if (!okSplit(a) || !okSplit(b)) continue;
        const w = Math.max(pw(a), pw(b));
        if (w < bw) { bw = w; best = [a, b]; }
      }
      if (best) { next = [...cur.slice(0, lim), ...best, ...cur.slice(lim + 1)]; break; }
    }
    if (!next) break;
    cur = next;
    const S2 = sizeFor(cur);
    if (S2 > S * gain) { rows = cur; S = S2; }
  }
  const size = Math.floor(S * 10) / 10;
  const fits = rows.map((r) => {
    const text = rowText(r, upper);
    if (mode === "ragged") { const st = opts.stretch ?? 90; return {size, stretch: st, w: per(text, display(B, st)) * size, fits: true}; }
    const at = (st: number) => per(text, display(B, st)) * size;
    if (at(125) <= W * 0.985) return {size, stretch: 125, w: at(125), fits: true};
    let a = 62, b = 125;
    for (let k = 0; k < 14; k++) { const m = (a + b) / 2; if (at(m) <= W * 0.985) a = m; else b = m; }
    const st = Math.floor(a * 10) / 10;
    return {size, stretch: st, w: at(st), fits: true};
  });
  return {rows, fits, size, h: rows.length * CAP * size + (rows.length - 1) * gapK * size};
};
