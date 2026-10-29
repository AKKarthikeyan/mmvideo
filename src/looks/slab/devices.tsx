// Slab look: the lower-zone devices, all type-built (bars, tiles, rules), all at a shared scale from data.json values.
//   Rail       signed bars of one unit at ONE scale for the whole story (px per unit shared by every beat of that unit;
//              an unsigned percentage is a share, drawn on a 0-100 track). An earlier value appears as a dashed ghost
//              only where the script relates the two (plan.ts related()), carrying its own source line. A stack (parts
//              that add up to the big, the previous limit as a threshold marker) and an inset (slivers under 6% of the
//              scale, zoomed in a labelled box)
//   Cols       the same rail stood up as 2-4 columns on one baseline (same shared scale)
//   Tally      "9 of 11": eleven cells, nine filled, from the lock
//   Duration   "10 years": ten blocks filling left to right from the lock
//   RatioTiles "3×": the larger bar, the smaller one stamped end to end round(N) times, the remainder left visible
//   ProofTiles "over 25×": N copies of the latest value dropping into the anchor's outline
//   Burst      a rotating code-drawn starburst behind ratio and say reveals
// Bars grow on the beat's second beat (magnitude before the number, as the spec asks); every printed value, and every
// number inside a row's name ("2017"), is a gated InlineNum: blank tiles until the narrator says it.
import React from "react";
import {AbsoluteFill, Easing} from "remotion";
import type {LookBrand} from "../brands/types";
import {fitCss, fitSize, measure, wrap} from "../shared/fit";
import {assertLocked} from "../shared/lock";
import type {LookBeat, LookNum} from "../shared/types";
import {CAP, CAP_TOP, STAMP, ease, springAt, type Pal} from "./kit";
import type {RailBeat, RailRow} from "./plan";
import {labelNums, qualOf, type Spoken} from "./prep";
import {display, InlineNum, monoFont, up} from "./type";

export const NAME = 40, SRC = 32;
const GAPN = 6, BAR = 54, LAB = 50, ROWGAP = 20;
const ROW_H = NAME * 1.2 + GAPN + BAR;
const labFont = (B: LookBrand) => display(B, 88);
const nameFont = (B: LookBrand) => monoFont(B, 0.02);

export type RailCtx = {peers: RailBeat[]; spoken: Spoken};

// bars grow from the beat's second beat, one after another (never later than the settle frame allows)
const growAt = (b: LookBeat, k: number, recap = false) => Math.min(b.f0 + (recap ? 8 : 15) + k * 4, b.settleF - 26);
const labelAt = (b: LookBeat, k: number, n: LookNum, recap = false) => Math.max(growAt(b, k, recap) + 6, n.lockF);

// the printed label of a row: its qualifier (from the source's printed text), the number, the big's unit when the bars omit it
const labelParts = (r: RailRow, rb: RailBeat) => ({q: qualOf(r.num) ? up(qualOf(r.num)) + " " : "", t: r.num.text, u: rb.unitAdd});
const labelW = (B: LookBrand, r: RailRow, rb: RailBeat, size = LAB) => {
  const p = labelParts(r, rb), lf = labFont(B);
  return (p.q ? measure(p.q, lf, size * 0.62) : 0) + measure(p.t, lf, size) + (p.u ? measure(p.u, lf, size * 0.62) : 0);
};

const Label: React.FC<{B: LookBrand; r: RailRow; rb: RailBeat; size?: number; color: string; pal: Pal; f: number; where: string}> = ({B, r, rb, size = LAB, color, pal, f, where}) => {
  const p = labelParts(r, rb), lf = labFont(B);
  const small = {...fitCss(lf, size * 0.62), lineHeight: `${size}px`, display: "inline-block", verticalAlign: "top", paddingTop: (CAP - CAP * 0.62) * size + CAP_TOP * size * 0.38} as React.CSSProperties;
  return <span style={{whiteSpace: "pre", color}}>
    {p.q && <span style={small}>{p.q}</span>}
    <InlineNum n={r.num} text={p.t} font={lf} size={size} color={color} pal={pal} f={f} where={where}/>
    {p.u && f >= r.num.lockF && <span style={small}>{p.u}</span>}
  </span>;
};

// a row's name in mono capitals, any number in it gated like a printed number
export const GatedName: React.FC<{B: LookBrand; text: string; b: LookBeat; sp: Spoken; size: number; color: string; pal: Pal; f: number; mono?: boolean}> = ({B, text, b, sp, size, color, pal, f}) => {
  const nums = labelNums(sp, b, text);
  const nf = nameFont(B);
  if (!nums.length) return <>{text}</>;
  const out: React.ReactNode[] = [];
  let rest = text, k = 0;
  for (const n of nums) {
    const i = rest.indexOf(n.text);
    if (i < 0) continue;
    out.push(rest.slice(0, i));
    out.push(<InlineNum key={k++} n={n} text={n.text} font={nf} size={size} color={color} pal={pal} f={f} where={`name ${text}`}/>);
    rest = rest.slice(i + n.text.length);
  }
  out.push(rest);
  return <>{out}</>;
};

// ---------- the shared scale ----------
// px per unit for one key, the same in every beat of the story: the largest at which every drawn bar of every beat of
// that key, plus its label, fits the width, with one zero axis for the whole story. A share key is 0-100.
type Scale = {ppv: number; zeroX: number; lab: number};
const drawnOf = (rb: RailBeat, b: LookBeat | null) => {
  const primaryIdx = Math.max(0, rb.rows.findIndex((r) => b?.big && r.num.text === b.big.text));
  const main = rb.inset ? [rb.rows[primaryIdx]] : rb.rows;
  return {drawn: [...(rb.ghost ? [rb.ghost] : []), ...main], primaryIdx};
};
export const sharedScale = (B: LookBrand, rb: RailBeat, peers: RailBeat[], W: number, lab0 = LAB): Scale => {
  const ps = peers.filter((p) => p.key === rb.key);
  if (!ps.includes(rb)) ps.push(rb);
  // the labels are measured at the largest size any beat may draw them, so the scale is the same whichever bar height
  // (a ghost carries its value in its name line and the story's lone first bar carries none: neither needs label room)
  const lone = (p: RailBeat) => p.rows.length === 1 && !p.ghost && !p.recap;
  const itemsOf = (p: RailBeat) => drawnOf(p, null).drawn.map((r) => ({v: r.v, l: (p.ghost === r || lone(p) ? 0 : labelW(B, r, p, Math.max(lab0, 76)) + 16)}));
  const groups = ps.map(itemsOf);
  const mine = itemsOf(rb);
  const lab = Math.max(0, ...groups.flat().map((x) => x.l));
  if (rb.share) return {ppv: Math.min(W / 100, ...groups.flat().map((x) => (W - x.l) / Math.max(1e-9, x.v))), zeroX: 0, lab};
  const ext = (items: {v: number; l: number}[], ppv: number) => {
    let neg = 0, pos = 0;
    for (const x of items) { if (x.v < 0) neg = Math.max(neg, -x.v * ppv + x.l); else pos = Math.max(pos, x.v * ppv + x.l); }
    return {neg, pos};
  };
  // one px-per-unit for every beat of the unit: the largest at which each beat's own bars and labels fit the width
  let a = 0, z = 1e9;
  for (let k = 0; k < 60; k++) { const m = (a + z) / 2; if (groups.every((g) => { const e = ext(g, m); return e.neg + e.pos <= W; })) a = m; else z = m; }
  // the zero axis is the beat's own: at the left when it has no negative bar, else where its bars balance
  const e = ext(mine, a);
  const anyNeg = mine.some((x) => x.v < 0), anyPos = mine.some((x) => x.v >= 0);
  return {ppv: a, zeroX: anyNeg ? (anyPos ? e.neg + (W - e.neg - e.pos) / 2 : W - e.pos) : 0, lab};
};

// ---------- rail (bars) ----------
type RailGeo = {h: number; rows: {r: RailRow; ghost: boolean; y: number; primary: boolean; h: number}[]; sc: Scale; anchorOnly: boolean;
  zoom: null | {y: number; h: number; zeroX: number; ppv: number; rows: {r: RailRow; y: number}[]; labelH: number}};

// barH: the bar thickness; a fact with room to spare draws thicker bars (and bigger value labels), up to 130 px (170 for one or two bars)
export const labFor = (barH: number) => Math.round(Math.min(76, Math.max(LAB, barH * 0.62)));
export const railGeo = (B: LookBrand, rb: RailBeat, b: LookBeat, W: number, peers: RailBeat[], barH = BAR): RailGeo => {
  const anchorOnly = rb.rows.length === 1 && !rb.ghost && !rb.recap;      // the story's first value of a unit: the bar alone (the board prints it)
  const {drawn, primaryIdx} = drawnOf(rb, b);
  const sc = sharedScale(B, rb, peers, W, labFor(barH));
  let y = 0;
  const rows = drawn.map((r, k) => {
    const ghost = !!rb.ghost && k === 0;
    const h = NAME * 1.2 + GAPN + barH + (ghost && rb.ghostSrc ? SRC * 1.25 : 0);
    const o = {r, ghost, y, primary: !rb.recap && r === rb.rows[primaryIdx], h};
    y += h + ROWGAP;
    return o;
  });
  let h = y - ROWGAP;
  let zoom: RailGeo["zoom"] = null;
  if (rb.inset) {
    const zr = rb.rows;
    const zPos = Math.max(...zr.map((r) => Math.abs(r.v)));
    const pad = 22, labelH = SRC * 1.3 + 8;
    const zRr = Math.max(...zr.map((r) => labelW(B, r, rb) + 16));
    const zppv = (W - 2 * pad - zRr) / (zPos || 1);
    const zy = h + 44;
    const zrows = zr.map((r, k) => ({r, y: zy + pad + labelH + k * (ROW_H + ROWGAP)}));
    const zh = 2 * pad + labelH + zr.length * ROW_H + (zr.length - 1) * ROWGAP;
    zoom = {y: zy, h: zh, zeroX: pad, ppv: zppv, rows: zrows, labelH};
    h = zy + zh;
  }
  return {h, rows, sc, zoom, anchorOnly};
};

const hatch = (c: string) => `repeating-linear-gradient(135deg, ${c} 0px, ${c} 9px, transparent 9px, transparent 15px)`;

const RowBar: React.FC<{B: LookBrand; rb: RailBeat; r: RailRow; k: number; ghost: boolean; primary: boolean; x: number; y: number; zeroX: number; ppv: number;
  pal: Pal; f: number; b: LookBeat; W: number; noLabel?: boolean; sp: Spoken; track?: number; barH?: number}> =
  ({B, rb, r, k, ghost, primary, x, y, zeroX, ppv, pal, f, b, W, noLabel, sp, track, barH = BAR}) => {
  const BAR_ = barH, LAB_ = labFor(barH);
  const len = Math.abs(r.v) * ppv;
  const neg = r.v < 0;
  const ga = growAt(b, k, rb.recap);
  const g = ghost ? 1 : ease(f, ga, ga + 14, Easing.out(Easing.exp));
  const nameIn = ghost ? 1 : ease(f, ga - 4, ga + 2);
  const color = primary || rb.recap ? pal.bar : pal.bar2;
  const drawnW = ghost ? len : Math.max(2, len * g);
  const bx = neg ? zeroX - drawnW : zeroX;
  const nf = nameFont(B);
  const labW = labelW(B, r, rb, LAB_);
  if (ghost) assertLocked(r.num, f, `ghost ${r.name}`);      // the carried value was printed in an earlier beat
  const nameText = ghost ? `${up(rb.ghostName || r.name)} · ` : up(r.name);
  const nameW = measure(nameText, nf, NAME) + (ghost ? labW * 0.8 : 0);
  const nameX = neg ? Math.max(0, zeroX - nameW) : zeroX;
  const barY = y + NAME * 1.2 + GAPN + (ghost && rb.ghostSrc ? SRC * 1.25 : 0);
  const la = labelAt(b, k, r.num, rb.recap);
  return <>
    {track !== undefined && !ghost && <div style={{position: "absolute", left: x + zeroX, top: barY, width: track, height: BAR_, border: `2px dashed ${pal.rule}`, boxSizing: "border-box", opacity: 0.35 * nameIn}}/>}
    <div style={{position: "absolute", left: x + Math.min(nameX, W - nameW), top: y, ...fitCss(nf, NAME), lineHeight: `${NAME * 1.2}px`, color: pal.ink, opacity: (ghost ? 0.85 : 1) * nameIn}}>
      <GatedName B={B} text={nameText} b={b} sp={sp} size={NAME} color={pal.ink} pal={pal} f={f}/>
      {ghost && <Label B={B} r={r} rb={rb} size={NAME} color={pal.ink} pal={pal} f={f} where={`ghost ${r.name}`}/>}
    </div>
    {ghost && rb.ghostSrc && <div style={{position: "absolute", left: x + zeroX, top: y + NAME * 1.2, ...fitCss(monoFont(B), SRC), lineHeight: `${SRC * 1.25}px`, color: pal.ink, opacity: 0.8}}>{rb.ghostSrc}</div>}
    {ghost
      ? <div style={{position: "absolute", left: x + bx, top: barY, width: len, height: BAR_, border: `3px dashed ${pal.rule}`, boxSizing: "border-box", opacity: 0.8}}/>
      : g > 0.004 && <div style={{position: "absolute", left: x + bx, top: barY, width: drawnW, height: BAR_, background: neg ? hatch(color) : color, boxShadow: neg ? `inset 0 0 0 3px ${color}` : undefined}}/>}
    {!ghost && !noLabel && f >= la && <div style={{position: "absolute", left: x + (neg ? bx - 14 - labW : bx + len * g + 14), top: barY + (BAR_ - CAP * LAB_) / 2 - CAP_TOP * LAB_,
      ...fitCss(labFont(B), LAB_), lineHeight: `${LAB_}px`}}>
      <Label B={B} r={r} rb={rb} size={LAB_} color={primary ? pal.num : pal.ink} pal={pal} f={f} where={`rail ${r.name}`}/></div>}
  </>;
};

// ---------- stack: parts that add up to the big, the previous limit as a threshold marker ----------
const SBAR = 74;
export const stackH = NAME * 1.2 + GAPN + SBAR + 12 + NAME * 1.2 + 10;
const Stack: React.FC<{B: LookBrand; rb: RailBeat; b: LookBeat; x: number; y: number; W: number; pal: Pal; f: number; sp: Spoken}> = ({B, rb, b, x, y, W, pal, f, sp}) => {
  const nf = nameFont(B), lf = labFont(B);
  const ppv = W / rb.scale;
  let acc = 0;
  const top = y + NAME * 1.2 + GAPN;
  const parts = rb.rows.map((r, i) => { const p = {r, x0: acc * ppv, w: Math.abs(r.v) * ppv, i}; acc += Math.abs(r.v); return p; });
  const gh = rb.ghost;
  return <>
    {parts.map((p) => {
      const ga = growAt(b, p.i);
      const g = ease(f, ga, ga + 12, Easing.out(Easing.exp));
      const c = p.i % 2 ? pal.bar2 : pal.bar;
      const fg = pal.bg;
      const label = p.r.num.text, size = Math.min(44, (p.w - 24) / Math.max(1, measure(label, lf, 100) / 100));
      return <React.Fragment key={p.i}>
        <div style={{position: "absolute", left: x + p.x0, top, width: Math.max(0, p.w * g - 4), height: SBAR, background: c}}/>
        {g > 0.05 && <div style={{position: "absolute", left: x + p.x0, top: y, ...fitCss(nf, NAME), lineHeight: `${NAME * 1.2}px`, color: pal.ink, opacity: g}}>
          <GatedName B={B} text={up(p.r.name)} b={b} sp={sp} size={NAME} color={pal.ink} pal={pal} f={f}/></div>}
        {g > 0.6 && f >= labelAt(b, p.i, p.r.num) && <div style={{position: "absolute", left: x + p.x0 + 12, top: top + (SBAR - CAP * size) / 2 - CAP_TOP * size, ...fitCss(lf, size), lineHeight: `${size}px`, color: fg}}>
          <InlineNum n={p.r.num} text={label} font={lf} size={size} color={fg} pal={pal} f={f} where={`stack ${p.r.name}`}/></div>}
      </React.Fragment>;
    })}
    {gh && (() => {
      const gx = Math.abs(gh.v) * ppv;
      assertLocked(gh.num, f, `marker ${gh.name}`);
      const t = `${up(rb.ghostName || gh.name)} · ${gh.num.text}`;
      const tw = measure(t, nf, NAME);
      return <>
        <div style={{position: "absolute", left: x + gx - 2, top: top - 10, width: 0, height: SBAR + 20, borderLeft: `5px dashed ${pal.rule}`}}/>
        <div style={{position: "absolute", left: x + Math.min(W - tw, Math.max(0, gx - tw / 2)), top: top + SBAR + 12, ...fitCss(nf, NAME), lineHeight: `${NAME * 1.2}px`, color: pal.ink}}>{t}</div>
      </>;
    })()}
  </>;
};

export const railH = (B: LookBrand, rb: RailBeat, b: LookBeat, W: number, peers: RailBeat[], barH = BAR) => rb.stack ? stackH : railGeo(B, rb, b, W, peers, barH).h;
export const railBars = (rb: RailBeat) => rb.stack ? 0 : (rb.inset ? 1 : rb.rows.length) + (rb.ghost ? 1 : 0);

export const Rail: React.FC<{B: LookBrand; rb: RailBeat; b: LookBeat; x: number; y: number; W: number; pal: Pal; f: number; R: RailCtx; barH?: number}> = ({B, rb, b, x, y, W, pal, f, R, barH = BAR}) => {
  if (rb.stack) return <Stack B={B} rb={rb} b={b} x={x} y={y} W={W} pal={pal} f={f} sp={R.spoken}/>;
  const G = railGeo(B, rb, b, W, R.peers, barH);
  const anyNeg = G.rows.some((r) => r.r.v < 0);
  const z = G.zoom;
  // the zoom box stands as soon as the sliver has grown (its bars grow with the beat; their labels wait for the narrator)
  const zoomIn = z ? ease(f, b.f0 + 22, b.f0 + 34) : 0;
  void ROW_H;
  const prim = G.rows.find((r) => r.primary) ?? G.rows[G.rows.length - 1];
  const track = rb.share ? Math.min(W, 100 * G.sc.ppv) : undefined;
  return <>
    {anyNeg && <div style={{position: "absolute", left: x + Math.min(W - 4, Math.max(0, G.sc.zeroX - 2)), top: y + NAME * 1.2, width: 4, height: G.h - NAME * 1.2 + 8 - (z ? z.h + 44 : 0), background: pal.rule, opacity: 0.55}}/>}
    {G.rows.map((r, k) => <RowBar key={k} B={B} rb={rb} r={r.r} k={r.ghost ? 0 : k - (rb.ghost ? 1 : 0)} ghost={r.ghost} primary={r.primary} x={x} y={y + r.y} zeroX={G.sc.zeroX}
      ppv={G.sc.ppv} pal={pal} f={f} b={b} W={W} noLabel={G.anchorOnly} sp={R.spoken} track={track} barH={barH}/>)}
    {z && prim && zoomIn > 0 && (() => {
      const sx0 = x + G.sc.zeroX, sx1 = sx0 + Math.abs(prim.r.v) * G.sc.ppv, sy = y + prim.y + NAME * 1.2 + GAPN + barH;
      const by = y + z.y;
      return <>
        <svg style={{position: "absolute", left: 0, top: 0, overflow: "visible"}} width={1} height={1}>
          <path d={`M ${sx0 + 2} ${sy} L ${x + 2} ${by}`} stroke={pal.rule} strokeWidth={3} strokeDasharray="10 8" fill="none" opacity={zoomIn}/>
          <path d={`M ${sx1} ${sy} L ${x + W - 2} ${by}`} stroke={pal.rule} strokeWidth={3} strokeDasharray="10 8" fill="none" opacity={zoomIn}/>
        </svg>
        <div style={{position: "absolute", left: x, top: by, width: W, height: z.h, border: `4px solid ${pal.rule}`, boxSizing: "border-box", opacity: zoomIn,
          transform: `scale(${0.92 + 0.08 * zoomIn})`, transformOrigin: "50% 0%"}}>
          <div style={{position: "absolute", left: z.zeroX, top: 18, ...fitCss(monoFont(B, 0.08), SRC), lineHeight: `${SRC * 1.3}px`, color: pal.ink}}>ZOOMED IN · OWN SCALE</div>
          {z.rows.map((zr, k) => <RowBar key={k} B={B} rb={{...rb, recap: false}} r={zr.r} k={k} ghost={false} primary={zr.r === prim.r} x={0} y={zr.y - z.y} zeroX={z.zeroX} ppv={z.ppv} pal={pal}
            f={f} b={b} W={W - 2 * z.zeroX} sp={R.spoken}/>)}
        </div>
      </>;
    })()}
  </>;
};

// ---------- columns: the same rows stood up on one baseline, same shared scale ----------
export type ColsGeo = {h: number; colW: number; gap: number; nameS: number; names: string[][]; labS: number; pph: number};
const nameHOf = (G: ColsGeo) => Math.max(...G.names.map((l) => l.length)) * G.nameS * 1.2;
export const colsGeo = (B: LookBrand, rb: RailBeat, b: LookBeat, W: number, peers: RailBeat[], H: number): ColsGeo | null => {
  const {drawn} = drawnOf(rb, b);
  const n = drawn.length, gap = 28;
  const colW = Math.min(200, (W - gap * (n - 1)) / n);
  const nf = nameFont(B);
  let nameS = NAME;
  let names: string[][] = [];
  for (; nameS >= 34; nameS -= 2) {
    names = drawn.map((r, k) => wrap(up(k === 0 && rb.ghost ? (rb.ghostName || r.name) : r.name), nf, nameS, colW + gap - 6));
    if (names.every((l) => l.length <= 2 && l.every((t) => measure(t, nf, nameS) <= colW + gap - 6))) break;
  }
  if (nameS < 34) return null;
  const labS = Math.min(LAB, ...drawn.map((r) => fitSize(r.num.text + rb.unitAdd, labFont(B), colW + gap - 6, LAB, 30)));
  if (labS < 34 || drawn.some((r) => labelW(B, r, rb, labS) > colW + gap - 6)) return null;
  const nameH = Math.max(...names.map((l) => l.length)) * nameS * 1.2 + 10 + (rb.ghost && rb.ghostSrc ? SRC * 1.25 + 6 : 0);
  const ps = peers.filter((p) => p.key === rb.key);
  const max = rb.share ? 100 : Math.max(...[...ps, rb].flatMap((p) => drawnOf(p, null).drawn.map((r) => Math.abs(r.v))));
  const colMax = H - nameH - labS - 18;
  if (colMax < 160) return null;
  return {h: H, colW, gap, nameS, names, labS, pph: colMax / max};
};
export const Cols: React.FC<{B: LookBrand; rb: RailBeat; b: LookBeat; G: ColsGeo; x: number; y: number; W: number; pal: Pal; f: number; R: RailCtx}> = ({B, rb, b, G, x, y, W, pal, f, R}) => {
  const {drawn, primaryIdx} = drawnOf(rb, b);
  const nameH = nameHOf(G) + 10 + (rb.ghost && rb.ghostSrc ? SRC * 1.25 + 6 : 0);
  const base = y + G.h - nameH;
  const nf = nameFont(B), lf = labFont(B);
  const total = drawn.length * G.colW + (drawn.length - 1) * G.gap;
  const x0 = x + Math.max(0, (W - total) / 2) * 0;
  return <>
    <div style={{position: "absolute", left: x, top: base, width: W, height: 4, background: pal.rule, opacity: 0.6}}/>
    {rb.share && <div style={{position: "absolute", left: x, top: base - 100 * G.pph, width: W, height: 0, borderTop: `2px dashed ${pal.rule}`, opacity: 0.35}}/>}
    {drawn.map((r, k) => {
      const ghost = !!rb.ghost && k === 0;
      const kk = ghost ? 0 : k - (rb.ghost ? 1 : 0);
      const primary = !ghost && r === rb.rows[primaryIdx];
      const h = Math.abs(r.v) * G.pph;
      const ga = growAt(b, kk);
      const g = ghost ? 1 : ease(f, ga, ga + 14, Easing.out(Easing.exp));
      const cx = x0 + k * (G.colW + G.gap);
      const la = labelAt(b, kk, r.num);
      if (ghost) assertLocked(r.num, f, `ghost ${r.name}`);
      const lw = labelW(B, r, rb, G.labS);
      return <React.Fragment key={k}>
        {ghost
          ? <div style={{position: "absolute", left: cx, top: base - h, width: G.colW, height: h, border: `3px dashed ${pal.rule}`, boxSizing: "border-box", opacity: 0.8}}/>
          : <div style={{position: "absolute", left: cx, top: base - h * g, width: G.colW, height: h * g, background: primary ? pal.bar : pal.bar2}}/>}
        <div style={{position: "absolute", left: cx, top: base + 10, ...fitCss(nf, G.nameS), lineHeight: `${G.nameS * 1.2}px`, color: pal.ink, opacity: ghost ? 0.85 : ease(f, ga - 4, ga + 2)}}>
          {G.names[k].map((l, i) => <div key={i}><GatedName B={B} text={l} b={b} sp={R.spoken} size={G.nameS} color={pal.ink} pal={pal} f={f}/></div>)}</div>
        {ghost && rb.ghostSrc && <div style={{position: "absolute", left: x, top: base + 10 + nameHOf(G) , ...fitCss(monoFont(B), SRC), lineHeight: `${SRC * 1.25}px`, color: pal.ink, opacity: 0.8}}>
          {up(rb.ghostName || r.name)}: {rb.ghostSrc}</div>}
        {(ghost || f >= la) && <div style={{position: "absolute", left: Math.max(x, Math.min(x + W - lw, cx + (G.colW - lw) / 2)), top: base - h * g - G.labS - 10 - CAP_TOP * G.labS + (1 - CAP) * G.labS,
          ...fitCss(lf, G.labS), lineHeight: `${G.labS}px`}}>
          <Label B={B} r={r} rb={rb} size={G.labS} color={primary ? pal.num : pal.ink} pal={pal} f={f} where={`col ${r.name}`}/></div>}
      </React.Fragment>;
    })}
  </>;
};

// ---------- tally and duration ----------
// at       the frame the device first appears (the lower zone is never empty while the narrator waits for the number)
// fillAt   the frame the cells fill (the lock); before it the cells are empty outlines
// track    the count has not been said yet ("10 years" in fm04): an unmarked dashed track stands in until fillAt, so the
//          number of cells is never shown before the narrator says it
export const cellsH = (n: number) => n <= 20 ? 130 : 64;
export const Cells: React.FC<{n: number; k: number; x: number; y: number; W: number; h: number; pal: Pal; f: number; at: number; mode: "tally" | "duration";
  fillAt?: number; track?: boolean}> = ({n, k, x, y, W, h, pal, f, at, mode, fillAt, track}) => {
  if (f < at) return null;
  const t0 = fillAt ?? at;
  if (track && f < t0) {
    const o = ease(f, at, at + 8);
    return <div style={{position: "absolute", left: x, top: y, width: W * o, height: h, boxSizing: "border-box", border: `4px dashed ${pal.rule}`, opacity: 0.6 * Math.min(1, o * 3)}}/>;
  }
  const base = track ? t0 : at;
  const gap = n > 12 ? 6 : 10, cw = (W - 2 - gap * (n - 1)) / n;      // 2 px clear of the box edge (subpixel spill)
  return <>{Array.from({length: n}, (_, i) => {
    const inAt = base + (mode === "tally" ? i : 0);
    const fillAtI = mode === "tally" ? t0 + 3 + i * 2 : t0 + 2 + i * 3;
    const s = springAt(f, inAt, STAMP);
    const filled = i < k && f >= fillAtI;
    const fp = filled ? springAt(f, fillAtI, STAMP) : 0;
    return <div key={i} style={{position: "absolute", left: x + i * (cw + gap), top: y, width: cw, height: h, boxSizing: "border-box",
      border: `4px solid ${pal.rule}`, opacity: Math.min(1, s * 2) * (i < k ? 1 : 0.6), transform: `scale(${1.2 - 0.2 * s})`,
      transformOrigin: i === 0 ? "0% 50%" : i === n - 1 ? "100% 50%" : "50% 50%"}}>
      {filled && <div style={{position: "absolute", inset: 4, background: pal.bar, transform: `scaleY(${fp})`, transformOrigin: "50% 100%"}}/>}
    </div>;
  })}</>;
};

// ---------- ratio tiles (N×) ----------
export const ratioH = 2 * ROW_H + ROWGAP;
export const RatioTiles: React.FC<{B: LookBrand; b: LookBeat; x: number; y: number; W: number; pal: Pal; f: number; beatF: number}> = ({B, b, x, y, W, pal, f, beatF}) => {
  const [A, Bb] = b.barsL;
  const N = Math.round(b.big!.value);
  const lf = labFont(B), nf = nameFont(B);
  const Rr = measure(A.num!.text, lf, LAB) + 16;
  const track = W - Rr;
  const aw = track * A.frac, bw = track * Bb.frac;
  const ga = ease(f, b.f0 + 6, b.f0 + 18, Easing.out(Easing.exp));
  const yB = y + ROW_H + ROWGAP;
  const barTop = (yy: number) => yy + NAME * 1.2 + GAPN;
  const tiles = Array.from({length: N}, (_, k) => k === 0 ? b.f0 + 12 : b.lockF + Math.round((k - 1) * beatF / 2));
  return <>
    <div style={{position: "absolute", left: x, top: y, ...fitCss(nf, NAME), lineHeight: `${NAME * 1.2}px`, color: pal.ink, opacity: ga}}>{up(A.name)}</div>
    <div style={{position: "absolute", left: x, top: barTop(y), width: aw * ga, height: BAR, background: pal.bar}}/>
    {f >= Math.max(b.f0 + 10, A.num!.lockF) && <div style={{position: "absolute", left: x + aw * ga + 14, top: barTop(y) + (BAR - CAP * LAB) / 2 - CAP_TOP * LAB, ...fitCss(lf, LAB), lineHeight: `${LAB}px`, color: pal.num}}>
      <InlineNum n={A.num!} text={A.num!.text} font={lf} size={LAB} color={pal.num} pal={pal} f={f} where="ratio A"/></div>}
    {f >= tiles[0] && <div style={{position: "absolute", left: x, top: yB, ...fitCss(nf, NAME), lineHeight: `${NAME * 1.2}px`, color: pal.ink}}>
      {up(Bb.name)}{f >= Bb.num!.lockF ? <> · <InlineNum n={Bb.num!} text={Bb.num!.text} font={nf} size={NAME} color={pal.ink} pal={pal} f={f} where="ratio B"/></> : null}</div>}
    {tiles.map((at, k) => {
      if (f < at) return null;
      const s = springAt(f, at, STAMP);
      return <div key={k} style={{position: "absolute", left: x + k * bw, top: barTop(yB), width: bw - 5, height: BAR, background: k === 0 ? pal.bar2 : pal.ink, opacity: Math.min(1, s * 2),
        transform: `scale(${1.25 - 0.25 * s})`, transformOrigin: k === 0 ? "0% 50%" : "50% 50%", boxShadow: `inset 0 0 0 3px ${pal.bg}`}}/>;
    })}
    {f >= tiles[N - 1] + 6 && <div style={{position: "absolute", left: x + aw - 2, top: barTop(y) - 6, width: 0, height: BAR + ROWGAP + NAME * 1.2 + GAPN + BAR + 12, borderLeft: `3px dashed ${pal.rule}`, opacity: 0.7}}/>}
  </>;
};

// ---------- proof tiles (say "over N×"): N copies of the latest value inside the anchor's outline ----------
export const proofH = ROW_H + NAME * 1.2 + 10;
export const ProofTiles: React.FC<{B: LookBrand; A: RailRow; Aname: string; Bv: RailRow; N: number; x: number; y: number; W: number; pal: Pal; f: number; at: number; from?: number}> = ({B, A, Aname, Bv, N, x, y, W, pal, f, at, from}) => {
  const nf = nameFont(B);
  const aw = W, bw = W * Math.abs(Bv.v) / Math.abs(A.v);
  const top = y + NAME * 1.2 + GAPN;
  assertLocked(A.num, f, "proof anchor");
  if (f >= at) assertLocked(Bv.num, f, "proof unit");
  // the anchor's outline (printed and said in an earlier beat) stands from `from`, empty, while the narrator reaches the number
  const o = from === undefined ? 1 : ease(f, from, from + 9, Easing.out(Easing.exp));
  return <>
    <div style={{position: "absolute", left: x, top: y, ...fitCss(nf, NAME), lineHeight: `${NAME * 1.2}px`, color: pal.ink, opacity: Math.min(1, o * 2)}}>{up(Aname)} · {A.num.text}</div>
    <div style={{position: "absolute", left: x, top, width: aw * o, height: BAR, border: `3px solid ${pal.rule}`, boxSizing: "border-box"}}/>
    {Array.from({length: N}, (_, k) => {
      const t = at + k * 2;
      if (f < t) return null;
      const s = springAt(f, t, STAMP);
      return <div key={k} style={{position: "absolute", left: x + k * bw + 1, top: top + 4 - (1 - s) * 30, width: Math.max(2, bw - 2), height: BAR - 8, background: pal.hot, opacity: Math.min(1, s * 2)}}/>;
    })}
    {f >= at && <div style={{position: "absolute", left: x, top: top + BAR + 8, ...fitCss(nf, NAME), lineHeight: `${NAME * 1.2}px`, color: pal.ink, opacity: ease(f, at, at + 6)}}>{up(Bv.name)} · {Bv.num.text}</div>}
  </>;
};

// ---------- starburst ----------
export const Burst: React.FC<{c1: string; c2: string; cx: number; cy: number; f: number; from: number; rays?: number}> = ({c1, c2, cx, cy, f, from, rays = 22}) => {
  if (f < from) return null;
  const p = ease(f, from, from + 10, Easing.out(Easing.cubic));
  const R = 2600, rot = (f * 0.4) % 360;
  const wedges = Array.from({length: rays}, (_, i) => {
    const a0 = (i / rays) * Math.PI * 2, a1 = a0 + Math.PI / rays;
    return `M 0 0 L ${R * Math.cos(a0)} ${R * Math.sin(a0)} L ${R * Math.cos(a1)} ${R * Math.sin(a1)} Z`;
  }).join(" ");
  return <AbsoluteFill style={{background: c1, opacity: p}}>
    <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
      <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${0.6 + 0.4 * p})`}><path d={wedges} fill={c2}/></g>
    </svg>
  </AbsoluteFill>;
};

export {ROW_H, ROWGAP};
