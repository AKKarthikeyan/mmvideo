// Slab look: the lower-zone devices, all type-built (bars, tiles, rules), all at a shared scale from data.json values.
//   Rail       signed bars of one unit, the story's anchor value carried as a dashed ghost; a stack (parts that add up to
//              the big, with the anchor as a threshold marker) and an inset (slivers under 6% of the scale zoomed below)
//   Tally      "9 of 11": eleven cells, nine filled, from the lock
//   Duration   "10 years": ten blocks filling left to right from the lock
//   RatioTiles "3×": the larger bar, the smaller one stamped end to end round(N) times, the remainder left visible
//   ProofTiles "over 25×": N copies of the latest value dropping into the anchor's outline
//   Burst      a rotating code-drawn starburst behind ratio and say reveals
// No bar or tile carries a value that is not printed in data.json; every label is a gated InlineNum.
import React from "react";
import {AbsoluteFill, Easing} from "remotion";
import type {LookBrand} from "../brands/types";
import {fitCss, measure} from "../shared/fit";
import {assertLocked} from "../shared/lock";
import type {LookBeat, LookNum} from "../shared/types";
import {CAP, CAP_TOP, STAMP, ease, springAt, type Pal} from "./kit";
import type {RailBeat, RailRow} from "./plan";
import {display, InlineNum, monoFont, up} from "./type";

const NAME = 24, GAPN = 6, BAR = 50, LAB = 46, ROWGAP = 18;
const ROW_H = NAME * 1.2 + GAPN + BAR;
const labFont = (B: LookBrand) => display(B, 88);
const nameFont = (B: LookBrand) => monoFont(B, 0.06);

// grow a bar so it lands as its number locks (never later than the settle frame allows)
const growAt = (b: LookBeat, n: LookNum) => Math.max(b.f0 + 6, Math.min(n.lockF - 10, b.settleF - 24));

type RailGeo = {h: number; rows: {r: RailRow; ghost: boolean; y: number; primary: boolean}[]; zeroX: number; ppv: number; Lr: number; Rr: number; anchorOnly: boolean;
  zoom: null | {y: number; h: number; zeroX: number; ppv: number; rows: {r: RailRow; y: number}[]}};

export const railGeo = (B: LookBrand, rb: RailBeat, b: LookBeat, W: number): RailGeo => {
  const lf = labFont(B);
  const anchorOnly = rb.rows.length === 1 && !rb.ghost;      // the story's first value of a unit: the bar alone, no repeated label
  const lw = (r: RailRow) => anchorOnly ? 0 : measure(r.num.text, lf, LAB) + 16;
  const primaryIdx = Math.max(0, rb.rows.findIndex((r) => b.big && r.num.text === b.big.text));
  const main = rb.inset ? [rb.rows[primaryIdx]] : rb.rows;
  const drawn = [...(rb.ghost ? [rb.ghost] : []), ...main];
  // the largest px-per-unit at which every bar plus its label (the ghost has none) fits the width, zero placed to suit
  const ext = (ppv: number) => {
    let neg = 0, pos = 0;
    drawn.forEach((r, k) => {
      const l = rb.ghost && k === 0 ? 0 : lw(r);
      if (r.v < 0) neg = Math.max(neg, -r.v * ppv + l); else pos = Math.max(pos, r.v * ppv + l);
    });
    return {neg, pos};
  };
  let a = 0, z = 1e9;
  for (let k = 0; k < 60; k++) { const m = (a + z) / 2; const e = ext(m); if (e.neg + e.pos <= W) a = m; else z = m; }
  const ppv = a;
  const e = ext(ppv);
  const zeroX = drawn.some((r) => r.v < 0) ? (drawn.some((r) => r.v >= 0) ? e.neg + (W - e.neg - e.pos) / 2 : W - e.pos) : 0;
  const rows = drawn.map((r, k) => ({r, ghost: !!rb.ghost && k === 0, y: k * (ROW_H + ROWGAP), primary: r === rb.rows[primaryIdx]}));
  let h = rows.length * ROW_H + (rows.length - 1) * ROWGAP;
  let zoom: RailGeo["zoom"] = null;
  if (rb.inset) {
    const zr = rb.rows;
    const zPos = Math.max(...zr.map((r) => Math.abs(r.v)));
    const pad = 22;
    const zRr = Math.max(...zr.map((r) => measure(r.num.text, lf, LAB) + 16));
    const zppv = (W - 2 * pad - zRr) / (zPos || 1);
    const zy = h + 44;
    const zrows = zr.map((r, k) => ({r, y: zy + pad + k * (ROW_H + ROWGAP)}));
    const zh = 2 * pad + zr.length * ROW_H + (zr.length - 1) * ROWGAP;
    zoom = {y: zy, h: zh, zeroX: pad, ppv: zppv, rows: zrows};
    h = zy + zh;
  }
  return {h, rows, zeroX, ppv, Lr: 0, Rr: 0, zoom, anchorOnly};
};
export const railH = (B: LookBrand, rb: RailBeat, b: LookBeat, W: number) => rb.stack ? stackH : railGeo(B, rb, b, W).h;

const hatch = (c: string) => `repeating-linear-gradient(135deg, ${c} 0px, ${c} 9px, transparent 9px, transparent 15px)`;

const RowBar: React.FC<{B: LookBrand; r: RailRow; ghost: boolean; ghostName: string; primary: boolean; x: number; y: number; zeroX: number; ppv: number; pal: Pal; f: number; b: LookBeat; W: number; noLabel?: boolean}> =
  ({B, r, ghost, ghostName, primary, x, y, zeroX, ppv, pal, f, b, W, noLabel}) => {
  const len = Math.abs(r.v) * ppv;
  const neg = r.v < 0;
  const g = ghost ? 1 : ease(f, growAt(b, r.num), growAt(b, r.num) + 14, Easing.out(Easing.exp));
  const nameIn = ghost ? 1 : ease(f, growAt(b, r.num) - 4, growAt(b, r.num) + 2);
  const color = primary ? pal.bar : pal.bar2;
  const drawnW = ghost ? len : Math.max(2, len * g);
  const bx = neg ? zeroX - drawnW : zeroX;
  const lf = labFont(B);
  const nf = nameFont(B);
  const label = r.num.text;
  const labW = measure(label, lf, LAB);
  if (ghost) assertLocked(r.num, f, `ghost ${r.name}`);      // the carried value was printed in an earlier beat
  const nameText = ghost ? `${up(ghostName || r.name)} · ${label}` : up(r.name);
  const nameX = neg ? Math.max(0, zeroX - measure(nameText, nf, NAME)) : zeroX;
  return <>
    <div style={{position: "absolute", left: x + Math.min(nameX, W - measure(nameText, nf, NAME)), top: y, ...fitCss(nf, NAME), lineHeight: `${NAME * 1.2}px`, color: pal.ink, opacity: (ghost ? 0.85 : 1) * nameIn}}>{nameText}</div>
    {ghost
      ? <div style={{position: "absolute", left: x + bx, top: y + NAME * 1.2 + GAPN, width: len, height: BAR, border: `3px dashed ${pal.rule}`, boxSizing: "border-box", opacity: 0.75}}/>
      : g > 0.004 && <div style={{position: "absolute", left: x + bx, top: y + NAME * 1.2 + GAPN, width: drawnW, height: BAR, background: neg ? hatch(color) : color, boxShadow: neg ? `inset 0 0 0 3px ${color}` : undefined}}/>}
    {!ghost && !noLabel && f >= growAt(b, r.num) && <div style={{position: "absolute", left: x + (neg ? bx - 14 - labW : bx + len * g + 14), top: y + NAME * 1.2 + GAPN + (BAR - CAP * LAB) / 2 - CAP_TOP * LAB,
      ...fitCss(lf, LAB), lineHeight: `${LAB}px`, color: primary ? pal.num : pal.ink}}>
      <InlineNum n={r.num} text={label} font={lf} size={LAB} color={primary ? pal.num : pal.ink} pal={pal} f={f} where={`rail ${r.name}`}/></div>}
  </>;
};

// ---------- stack: parts that add up to the big, the anchor as a threshold marker ----------
const SBAR = 70;
export const stackH = NAME * 1.2 + GAPN + SBAR + 12 + NAME * 1.2 + 10;
const Stack: React.FC<{B: LookBrand; rb: RailBeat; b: LookBeat; x: number; y: number; W: number; pal: Pal; f: number}> = ({B, rb, b, x, y, W, pal, f}) => {
  const nf = nameFont(B), lf = labFont(B);
  const ppv = W / rb.scale;
  let acc = 0;
  const top = y + NAME * 1.2 + GAPN;
  const parts = rb.rows.map((r, i) => { const p = {r, x0: acc * ppv, w: Math.abs(r.v) * ppv, i}; acc += Math.abs(r.v); return p; });
  const gh = rb.ghost;
  return <>
    {parts.map((p) => {
      const g = ease(f, growAt(b, p.r.num), growAt(b, p.r.num) + 12, Easing.out(Easing.exp));
      const c = p.i % 2 ? pal.bar2 : pal.bar;
      const fg = p.i % 2 ? pal.bg : pal.bg;
      const label = p.r.num.text, size = Math.min(40, (p.w - 20) / Math.max(1, measure(label, lf, 100) / 100));
      return <React.Fragment key={p.i}>
        <div style={{position: "absolute", left: x + p.x0, top, width: Math.max(0, p.w * g - 4), height: SBAR, background: c}}/>
        {g > 0.05 && <div style={{position: "absolute", left: x + p.x0, top: y, ...fitCss(nf, NAME), lineHeight: `${NAME * 1.2}px`, color: pal.ink, opacity: g}}>{up(p.r.name)}</div>}
        {g > 0.6 && f >= growAt(b, p.r.num) && <div style={{position: "absolute", left: x + p.x0 + 12, top: top + (SBAR - CAP * size) / 2 - CAP_TOP * size, ...fitCss(lf, size), lineHeight: `${size}px`, color: fg}}>
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

export const Rail: React.FC<{B: LookBrand; rb: RailBeat; b: LookBeat; x: number; y: number; W: number; pal: Pal; f: number}> = ({B, rb, b, x, y, W, pal, f}) => {
  if (rb.stack) return <Stack B={B} rb={rb} b={b} x={x} y={y} W={W} pal={pal} f={f}/>;
  const G = railGeo(B, rb, b, W);
  const anyNeg = G.rows.some((r) => r.r.v < 0);
  const z = G.zoom;
  const zoomIn = z ? ease(f, Math.min(b.lockF + 18, b.settleF - 16), Math.min(b.lockF + 30, b.settleF - 4)) : 0;
  const prim = G.rows.find((r) => r.primary);
  return <>
    {anyNeg && <div style={{position: "absolute", left: x + Math.min(W - 4, Math.max(0, G.zeroX - 2)), top: y + NAME * 1.2, width: 4, height: G.rows.length * (ROW_H + ROWGAP) - ROWGAP - NAME * 1.2 + 8, background: pal.rule, opacity: 0.55}}/>}
    {G.rows.map((r, k) => <RowBar key={k} B={B} r={r.r} ghost={r.ghost} ghostName={rb.ghostName} primary={r.primary} x={x} y={y + r.y} zeroX={G.zeroX} ppv={G.ppv} pal={pal} f={f} b={b} W={W} noLabel={G.anchorOnly}/>)}
    {z && prim && zoomIn > 0 && (() => {
      const sx0 = x + G.zeroX, sx1 = sx0 + Math.abs(prim.r.v) * G.ppv, sy = y + prim.y + NAME * 1.2 + GAPN + BAR;
      const by = y + z.y;
      return <>
        <svg style={{position: "absolute", left: 0, top: 0, overflow: "visible"}} width={1} height={1}>
          <path d={`M ${sx0 + 2} ${sy} L ${x + 2} ${by}`} stroke={pal.rule} strokeWidth={3} strokeDasharray="10 8" fill="none" opacity={zoomIn}/>
          <path d={`M ${sx1} ${sy} L ${x + W - 2} ${by}`} stroke={pal.rule} strokeWidth={3} strokeDasharray="10 8" fill="none" opacity={zoomIn}/>
        </svg>
        <div style={{position: "absolute", left: x, top: by, width: W, height: z.h, border: `4px solid ${pal.rule}`, boxSizing: "border-box", opacity: zoomIn,
          transform: `scale(${0.92 + 0.08 * zoomIn})`, transformOrigin: "50% 0%"}}>
          {z.rows.map((zr, k) => <RowBar key={k} B={B} r={zr.r} ghost={false} ghostName="" primary={zr.r === prim.r} x={0} y={zr.y - z.y} zeroX={z.zeroX} ppv={z.ppv} pal={pal}
            f={f} b={b} W={W - 2 * z.zeroX}/>)}
        </div>
      </>;
    })()}
  </>;
};

// ---------- tally and duration ----------
export const cellsH = (n: number) => n <= 20 ? 120 : 60;
export const Cells: React.FC<{n: number; k: number; x: number; y: number; W: number; h: number; pal: Pal; f: number; at: number; mode: "tally" | "duration"}> = ({n, k, x, y, W, h, pal, f, at, mode}) => {
  if (f < at) return null;
  const gap = n > 12 ? 6 : 10, cw = (W - 2 - gap * (n - 1)) / n;      // 2 px clear of the box edge (subpixel spill)
  return <>{Array.from({length: n}, (_, i) => {
    const inAt = at + (mode === "tally" ? i : 0);
    const fillAt = mode === "tally" ? at + 3 + i * 2 : at + 2 + i * 3;
    const s = springAt(f, inAt, STAMP);
    const filled = i < k && f >= fillAt;
    const fp = filled ? springAt(f, fillAt, STAMP) : 0;
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
    {f >= b.f0 + 10 && <div style={{position: "absolute", left: x + aw * ga + 14, top: barTop(y) + (BAR - CAP * LAB) / 2 - CAP_TOP * LAB, ...fitCss(lf, LAB), lineHeight: `${LAB}px`, color: pal.num}}>
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
export const ProofTiles: React.FC<{B: LookBrand; A: RailRow; Aname: string; Bv: RailRow; N: number; x: number; y: number; W: number; pal: Pal; f: number; at: number}> = ({B, A, Aname, Bv, N, x, y, W, pal, f, at}) => {
  const nf = nameFont(B);
  const aw = W, bw = W * Math.abs(Bv.v) / Math.abs(A.v);
  const top = y + NAME * 1.2 + GAPN;
  assertLocked(A.num, f, "proof anchor");
  if (f >= at) assertLocked(Bv.num, f, "proof unit");
  return <>
    <div style={{position: "absolute", left: x, top: y, ...fitCss(nf, NAME), lineHeight: `${NAME * 1.2}px`, color: pal.ink}}>{up(Aname)} · {A.num.text}</div>
    <div style={{position: "absolute", left: x, top, width: aw, height: BAR, border: `3px solid ${pal.rule}`, boxSizing: "border-box"}}/>
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

export {ROW_H, ROWGAP, NAME};
