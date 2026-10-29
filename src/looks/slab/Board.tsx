// Slab look: the Board, a printed number as a bazaar price board. Before the narrator's word each digit is a blank
// split-flap tile; from lockF - 8 the tiles run a glyph-free streak reel; the digits then drop in right to left, the
// rightmost exactly on lockF and the rest one or two frames after (assertLocked guards every digit). Static glyphs (₹ , .
// % ×) stand from the start; the sign and word units (t, crore, lakh cr, of 11, years) arrive on the lock. Digits are a
// solid brand colour with a solid hard drop (no image inside any digit), with a misregistration ghost that decays over
// 8 frames at the lock.
import React from "react";
import type {LookBrand} from "../brands/types";
import {ratio} from "../brands/contrast";
import {assertLocked} from "../shared/lock";
import {fitCss} from "../shared/fit";
import type {LookNum} from "../shared/types";
import {BASE, CAP, CAP_TOP, DROP, ease, springAt, type Pal} from "./kit";
import {colLock, display, fullLock, heroFont, numChars, per, REEL, Tile, type NumChar} from "./type";

type G = NumChar & {x: number; w: number; size: number; top: number};
export type BoardLayout = {n: LookNum; S: number; stretch: number; glyphs: G[]; coreW: number; unit: {text: string; size: number; x: number; top: number; w: number} | null; w: number; h: number};

const factor = (c: NumChar) => c.kind === "sign" ? 0.72 : c.kind === "prefix" ? 0.6 : c.kind === "gunit" ? (c.ch === "%" ? 0.62 : 0.9) : 1;

export const boardLayout = (B: LookBrand, n: LookNum, W: number, maxS: number, maxH: number, opts: {minS?: number; stretches?: number[]; unitScale?: number} = {}): BoardLayout => {
  const chars = numChars(n).filter((c) => c.kind !== "qual");
  const core = chars.filter((c) => c.kind !== "wunit");
  const unitText = chars.filter((c) => c.kind === "wunit").map((c) => c.ch).join("").trim();      // as printed: t, crore, lakh cr, of 11
  const uk = opts.unitScale ?? 0.3;
  const uFont = display(B, 100);
  const tries = opts.stretches ?? [125, 112, 100, 90, 80, 70, 62];
  const cands: {S: number; st: number; below: boolean}[] = [];
  for (const st of tries) {
    const font = heroFont(B, st);
    const coreP = core.reduce((s, c) => s + per(c.ch, font) * factor(c), 0) + (core.some((c) => c.kind === "prefix") ? 0.03 : 0) + (core.some((c) => c.kind === "sign") ? 0.03 : 0);
    const uP = unitText ? per(unitText, uFont) * uk + 0.07 : 0;
    for (const below of unitText ? [false, true] : [false]) {
      const wP = (below ? Math.max(coreP, uP - 0.07) : coreP + uP) + 0.13;      // + the outlines and the hard drop at both ends
      const hP = (below ? CAP + 0.16 + CAP * uk : CAP) + (core.some((c) => c.ch === ",") && !below ? 0.17 : 0);
      cands.push({S: Math.min(maxS, (W * 0.985) / wP, maxH / hP), st, below});
    }
  }
  const bestOf = (xs: typeof cands) => xs.reduce((a, c) => (c.S > a.S + 1 || (Math.abs(c.S - a.S) <= 1 && c.st > a.st)) ? c : a);
  const inl = bestOf(cands.filter((c) => !c.below));
  const bel = cands.some((c) => c.below) ? bestOf(cands.filter((c) => c.below)) : null;
  // a unit goes under the digits only when it is a word of 4 or more letters (lakh cr, of 11, years); a short unit (t, cr)
  // stays inline, so it never sits orphaned on a line of its own
  const {S: S0, st, below} = bel && unitText.replace(/\s/g, "").length >= 4 && bel.S > inl.S * 1.15 ? bel : inl;
  const S = Math.floor(S0 * 10) / 10;
  if (opts.minS && S < opts.minS) throw new Error(`slab board: "${n.text}" fits ${W}x${maxH} only at ${S.toFixed(0)}px (< ${opts.minS})`);
  const font = heroFont(B, st);
  const padL = 0.03 * S;      // the first glyph's outline stays inside the box (and the safe box)
  let x = padL;
  const glyphs: G[] = core.map((c) => {
    const s = S * factor(c);
    const w = per(c.ch, font) * s;
    let top: number;
    if (c.kind === "sign" || (c.kind === "gunit" && c.ch === "×")) { const yb = CAP * S - (0.3375 * S - 0.24 * s); top = yb - BASE * s; }
    else if (c.kind === "prefix" || (c.kind === "gunit" && c.ch === "%")) top = -CAP_TOP * s;
    else top = -CAP_TOP * S;
    const g = {...c, x, w, size: s, top};
    x += w + (c.kind === "prefix" || c.kind === "sign" ? 0.03 * S : 0);
    return g;
  });
  const coreW = x;
  let unit: BoardLayout["unit"] = null;
  if (unitText) {
    const u = S * uk, uw = per(unitText, uFont) * u;
    unit = below ? {text: unitText, size: u, x: padL, top: CAP * S + 0.16 * S - CAP_TOP * u, w: uw} : {text: unitText, size: u, x: coreW + 0.07 * S, top: CAP * S - BASE * u, w: uw};
  }
  // the box includes the last glyph's outline and hard drop, so a right-aligned board keeps its drop inside the safe box
  const w = (below || !unit ? Math.max(coreW, unit?.w ?? 0) : unit.x + unit.w) + 0.08 * S;
  const desc = core.some((c) => c.ch === ",") ? 0.17 * S : 0;      // a comma hangs below the baseline
  const h = below && unit ? CAP * S + 0.16 * S + CAP * unit.size : CAP * S + desc;
  return {n, S, stretch: st, glyphs, coreW, unit, w, h};
};

export type BoardStyle = {hero: boolean; color?: string; unitColor?: string};

// x, y: the board's top-left (cap top of the digits). The board draws itself at L.w x L.h from there.
export const Board: React.FC<{B: LookBrand; L: BoardLayout; x: number; y: number; pal: Pal; f: number; style: BoardStyle; where: string; tileFrom?: number}> =
  ({B, L, x, y, pal, f, style, where, tileFrom}) => {
  const n = L.n, S = L.S;
  const font = heroFont(B, L.stretch);
  const color = style.color ?? pal.num;
  const lockAll = fullLock(n);
  const thunk = springAt(f, lockAll, {damping: 12, stiffness: 300, mass: 0.5});
  const sc = f < lockAll ? 1 : 1 - 0.035 * (1 - thunk);      // settles inward: the board never grows past its box
  const gp = ease(f, n.lockF, n.lockF + 8);
  const ghostOn = f >= n.lockF && gp < 1;
  // static glyphs (₹ , . % ×) arrive with the blank tiles, the sign with the digits
  const visible = (g: G) => g.kind === "digit" ? f >= colLock(n, g.col) : g.kind === "sign" ? f >= n.lockF : f >= (tileFrom ?? -1e9);
  const dropY = (g: G) => g.kind === "digit" ? (1 - springAt(f, colLock(n, g.col), DROP)) * -0.3 * S : 0;
  // Hard drop: one solid extrusion (stacked text-shadows, 1 px apart, down-right) under each glyph, so the drop is a
  // single shape that never shows through a counter or breaks into pieces. A misregistration ghost decays over 8 frames
  // at the lock. Each digit lands inside its own tile box (a split-flap flip from the box's top edge), so a landing digit
  // never crosses the name block or a row above it.
  const d = Math.max(4, Math.round(0.045 * S));
  const shadow = style.hero ? Array.from({length: d}, (_, k) => `${k + 1}px ${k + 1}px 0 ${pal.drop}`).join(", ") : undefined;
  const glyph = (g: G, i: number, layer: "ghost" | "fill") => {
    if (!visible(g)) return null;
    if (g.kind === "digit") assertLocked(n, f, where);
    const gx = layer === "ghost" ? 0.036 * S * (1 - gp) : 0, gy = layer === "ghost" ? 0.024 * S * (1 - gp) : 0;
    const st: React.CSSProperties = {position: "absolute", left: g.x + gx, top: g.top + gy + dropY(g), ...fitCss(font, g.size), lineHeight: `${g.size}px`,
      color: layer === "ghost" ? pal.ghost : color, textShadow: layer === "fill" ? shadow : undefined};
    if (layer === "ghost") st.opacity = Math.min(1, (1 - gp) * 1.6);
    if (g.kind !== "digit" || dropY(g) === 0) return <span key={`${layer}${i}`} style={st}>{g.ch}</span>;
    const cx = g.x - 0.05 * S, cy = -0.012 * S;
    return <div key={`${layer}${i}`} style={{position: "absolute", left: cx, top: cy, width: g.w + 0.16 * S, height: CAP * S + 0.25 * S, overflow: "hidden"}}>
      <span style={{...st, left: (st.left as number) - cx, top: (st.top as number) - cy}}>{g.ch}</span></div>;
  };
  const tilesFrom = tileFrom ?? -1e9;
  return <div style={{position: "absolute", left: x, top: y, width: L.w, height: L.h, transform: `scale(${sc})`, transformOrigin: "50% 100%"}}>
    {L.glyphs.map((g, i) => g.kind === "digit" && !visible(g) && f >= tilesFrom
      ? <Tile key={`t${i}`} x={g.x} y={0} w={g.w} h={CAP * S} f={f} reelFrom={n.lockF - REEL} seed={g.col + 1} pal={pal} streak={ratio(color, pal.tile) > 2 ? color : pal.bg}/> : null)}
    {ghostOn && L.glyphs.map((g, i) => glyph(g, i, "ghost"))}
    {L.glyphs.map((g, i) => glyph(g, i, "fill"))}
    {L.unit && f >= n.lockF && (() => {
      const p = ease(f, n.lockF, n.lockF + 6);
      // the unit wipes in left to right in place (a slide from the right would leave the safe box)
      return <div style={{position: "absolute", left: L.unit.x, top: L.unit.top, ...fitCss(display(B, 100), L.unit.size), lineHeight: `${L.unit.size}px`,
        color: style.unitColor ?? color, clipPath: `inset(-0.1em ${((1 - p) * 100).toFixed(2)}% -0.1em 0)`}}>{L.unit.text}</div>;
    })()}
  </div>;
};
