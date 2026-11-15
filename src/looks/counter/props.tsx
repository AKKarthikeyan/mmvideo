// The paper props that carry every word and number (screen space, always inside the safe box): the jeweller's / price
// tag on thread, the hero card, the kraft sign for a kicker, shelf-edge labels on the counter front, the taped source
// chit, the brass unit key and the provenance stamp. A number's digits are drawn only from its lock frame (Num calls
// assertLocked); before it a prop shows a glyph-free blank of the same width.
import React from "react";
import type {LookBrand} from "../brands/types";
import {fitCss, fitFont, fitLines, fitSize, measure, type FitFont} from "../shared/fit";
import {assertLocked, shown} from "../shared/lock";
import type {LookNum} from "../shared/types";
import {assertContrast, rgba, type Mat} from "./materials";

export const SAFE = {x0: 95, x1: 850, y0: 210, y1: 1480};
export const W_SAFE = SAFE.x1 - SAFE.x0;

const shadow = (M: Mat, d = 1) => `drop-shadow(${10 * d}px ${16 * d}px ${14 * d}px ${rgba(M.shadow, 0.5)}) drop-shadow(1px 2px 1px ${rgba(M.shadow, 0.35)})`;

// A printed number: its text as printed (qual + sign + prefix + digits + unit), or a blank bar before its lock.
export const Num: React.FC<{n: LookNum; f: number; font: FitFont; size: number; color: string; blank: string; where: string; style?: React.CSSProperties; qualSize?: number}> =
  ({n, f, font, size, color, blank, where, style, qualSize}) => {
  if (!shown(n, f)) {
    const w = measure(n.text, font, size);
    return <span style={{display: "inline-block", width: w, height: size * 0.7, borderRadius: size * 0.08, background: blank, verticalAlign: "baseline", ...style}}/>;
  }
  assertLocked(n, f, where);
  if (qualSize && n.qual) {
    return <span style={{...fitCss(font, size), color, lineHeight: 1, ...style}}>
      <span style={{fontSize: qualSize, verticalAlign: "top", marginRight: size * 0.04}}>{n.qual.trim()}</span>{n.text.slice(n.qual.length)}
    </span>;
  }
  return <span style={{...fitCss(font, size), color, lineHeight: 1, ...style}}>{n.text}</span>;
};

// A line of words with *starred* emphasis and its printed numbers gated by their own lock frames.
export const GatedLine: React.FC<{line: string; nums: LookNum[]; f: number; font: FitFont; size: number; ink: string; acc: string; blank: string; lh?: number}> =
  ({line, nums, f, font, size, ink, acc, blank, lh = 1.04}) => {
  const cs: {ch: string; hot: boolean; n: number}[] = [];
  let on = false;
  for (const ch of line) { if (ch === "*") { on = !on; continue; } cs.push({ch, hot: on, n: -1}); }
  const text = cs.map((c) => c.ch).join("");
  let from = 0;
  nums.forEach((n, k) => {
    const i = text.indexOf(n.text, from);
    if (i < 0 || cs.slice(i, i + n.text.length).some((c) => c.n >= 0)) return;
    for (let j = i; j < i + n.text.length; j++) cs[j].n = k;
    from = i + n.text.length;
  });
  // any digit not covered by a parsed number waits for the latest lock of the line
  const late = Math.max(-1, ...nums.map((n) => n.lockF));
  const segs: {t: string; hot: boolean; n: number}[] = [];
  for (const c of cs) {
    const last = segs[segs.length - 1];
    if (last && last.hot === c.hot && last.n === c.n) last.t += c.ch; else segs.push({t: c.ch, hot: c.hot, n: c.n});
  }
  return <div style={{...fitCss(font, size), lineHeight: lh, color: ink}}>
    {segs.map((s, i) => {
      if (s.n >= 0 && !shown(nums[s.n], f)) return <span key={i} style={{display: "inline-block", width: measure(s.t, font, size), height: size * 0.68, borderRadius: size * 0.08, background: blank, verticalAlign: "baseline"}}/>;
      if (s.n < 0 && /\d/.test(s.t) && f < late) return <span key={i} style={{display: "inline-block", width: measure(s.t, font, size), height: size * 0.68, borderRadius: size * 0.08, background: blank}}/>;
      return <span key={i} style={{color: s.hot ? acc : ink}}>{s.t}</span>;
    })}
  </div>;
};

// Plain text that holds a digit is shown only from frame `at` (its numbers are not separately locked).
export const gateText = (s: string, f: number, at: number) => !/\d/.test(s) || f >= at;

// ---------------------------------------------------------------- tag on thread
// x, y, w, h: the tag box (screen); rot: resting rotation; swing: added degrees; anchor: where the thread goes (screen).
export const Tag: React.FC<{M: Mat; x: number; y: number; w: number; h: number; rot?: number; swing?: number; scale?: number; vis?: number;
  anchor?: [number, number] | null; children: React.ReactNode; flipDeg?: number; back?: React.ReactNode; holeSide?: "left" | "top"}> =
  ({M, x, y, w, h, rot = -3, swing = 0, scale = 1, vis = 1, anchor, children, flipDeg = 0, back, holeSide = "left"}) => {
  const hx = holeSide === "left" ? x + 34 : x + w / 2, hy = holeSide === "left" ? y + h / 2 : y + 30;
  const showBack = flipDeg > 90;
  const clip = holeSide === "left" ? "polygon(0 18%, 9% 0, 100% 0, 100% 100%, 9% 100%, 0 82%)" : "polygon(0 12%, 12% 0, 88% 0, 100% 12%, 100% 100%, 0 100%)";
  return <>
    {anchor && vis > 0 && <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: vis, overflow: "visible"}}>
      <path d={`M${hx},${hy} Q${(hx + anchor[0]) / 2 - 24},${Math.max(hy, anchor[1]) + 40} ${anchor[0]},${anchor[1]}`} fill="none" stroke={M.thread} strokeWidth={3.5}/>
      <circle cx={anchor[0]} cy={anchor[1]} r={5} fill={M.thread}/>
    </svg>}
    {/* the swing turns the tag about its hole; a flip turns it about its own centre (so it stays where it hangs) */}
    <div style={{position: "absolute", left: x, top: y, width: w, height: h, transformOrigin: `${hx - x}px ${hy - y}px`, opacity: vis,
      transform: `rotate(${rot + swing}deg) scale(${scale})`, filter: shadow(M)}}>
      <div style={{position: "absolute", inset: 0, transformOrigin: "50% 50%", transform: flipDeg ? `perspective(1600px) rotateY(${flipDeg}deg)` : undefined}}>
        <div style={{position: "absolute", inset: 0, clipPath: clip, background: showBack ? M.kraft : M.paper, transform: showBack ? "scaleX(-1)" : undefined}}>
          <div style={{position: "absolute", inset: 0, background: `linear-gradient(160deg, ${rgba(M.paper, 0)} 40%, ${rgba(M.shadow, 0.06)})`}}/>
          <div style={{position: "absolute", left: hx - x - 13, top: hy - y - 13, width: 26, height: 26, borderRadius: 13, background: M.kraftDark, boxShadow: `inset 0 2px 3px ${rgba(M.shadow, 0.6)}`}}/>
          {showBack ? back : children}
        </div>
      </div>
    </div>
  </>;
};

// ---------------------------------------------------------------- a card (cream or ink) that slams
export const Card: React.FC<{M: Mat; x: number; y: number; w: number; h: number; rot?: number; scale?: number; vis?: number; bg: string; children: React.ReactNode; origin?: string}> =
  ({M, x, y, w, h, rot = -3, scale = 1, vis = 1, bg, children, origin = "50% 50%"}) =>
  <div style={{position: "absolute", left: x, top: y, width: w, height: h, opacity: vis, transform: `rotate(${rot}deg) scale(${scale})`, transformOrigin: origin, filter: shadow(M)}}>
    <div style={{position: "absolute", inset: 0, background: bg, borderRadius: 6}}>
      <div style={{position: "absolute", inset: 0, borderRadius: 6, background: `linear-gradient(165deg, ${rgba(M.paper, 0.08)} 0%, ${rgba(M.paper, 0)} 40%, ${rgba(M.shadow, 0.08)} 100%)`}}/>
      {children}
    </div>
  </div>;

// ---------------------------------------------------------------- a kraft sign (kicker), taped
// segs: the text cut into parts; a part with a gate frame (a value-like number) is a glyph-free blank before it.
export const Sign: React.FC<{B: LookBrand; M: Mat; text: string; x: number; y: number; maxW: number; vis?: number; rot?: number; size?: number;
  segs?: {t: string; gate: number}[]; f?: number; align?: "left" | "right"}> =
  ({B, M, text, x, y, maxW, vis = 1, rot = -1.2, size = 36, segs, f = 0, align = "left"}) => {
  const font = fitFont(B.f.mono, 0.04);
  const s = fitSize(text, font, maxW - 36, size, 30);
  const w = Math.min(maxW, measure(text, font, s) + 36);
  const color = assertContrast(B.c.ink, M.kraft, s, "sign");
  const parts = segs ?? [{t: text, gate: -Infinity}];
  return <div style={{position: "absolute", left: align === "right" ? x - w : x, top: y, width: w, height: s + 24, opacity: vis, transform: `rotate(${rot}deg)`, filter: shadow(M, 0.6)}}>
    <div style={{position: "absolute", inset: 0, background: M.kraft}}/>
    <div style={{position: "absolute", left: align === "right" ? w - 48 : -16, top: -10, width: 64, height: 22, background: rgba(M.paper, 0.6), transform: `rotate(${align === "right" ? 24 : -24}deg)`}}/>
    <div style={{position: "absolute", left: 18, top: 12, ...fitCss(font, s), color, lineHeight: 1, whiteSpace: "pre"}}>
      {parts.map((p, i) => f >= p.gate ? <span key={i}>{p.t}</span>
        : <span key={i} style={{display: "inline-block", width: measure(p.t, font, s), height: s * 0.7, background: rgba(B.c.ink, 0.18), borderRadius: 3}}/>)}
    </div>
  </div>;
};

// ---------------------------------------------------------------- shelf-edge label (a name), on the counter front
// One line at 34-28 px, else two lines at 30-24 px. Values never go here: they sit on the object (TopTag) or its tag.
export const LABEL_Y = 1304;
const labelFit = (B: LookBrand, name: string, maxW: number) => {
  const mono = fitFont(B.f.mono, 0.02);
  const label = name.toUpperCase();
  const one = fitSize(label, mono, maxW - 24, 40, 30);
  const fits = (r: {size: number; lines: string[]}) => r.lines.length <= 2 && r.lines.every((l) => measure(l, mono, r.size) <= maxW - 24);
  let L2 = measure(label, mono, one) <= maxW - 24 ? {size: one, lines: [label]} : fitLines(label, mono, maxW - 24, 2, 32, 26);
  // too long for two lines at 26 px: two lines at 24, and only then three (the lane above the source chit holds two)
  if (!fits(L2)) L2 = fitLines(label, mono, maxW - 24, 2, 26, 24);
  if (!fits(L2)) L2 = fitLines(label, mono, maxW - 24, 3, 24, 22);
  const w = Math.min(maxW, Math.max(...L2.lines.map((l) => measure(l, mono, L2.size))) + 26);
  return {mono, L2, w};
};
export const ShelfLabel: React.FC<{B: LookBrand; M: Mat; cx: number; y?: number; maxW: number; name: string; nameOn: boolean; hot?: boolean; dim?: boolean; left?: number}> =
  ({B, M, cx, y = LABEL_Y, maxW, name, nameOn, hot, dim, left: left0}) => {
  if (!nameOn || !name) return null;
  const {mono, L2, w} = labelFit(B, name, maxW);
  const bg = hot ? M.paper : M.kraft;
  const ink = assertContrast(B.c.ink, bg, L2.size, "shelf label");
  const left = left0 ?? Math.max(SAFE.x0, Math.min(SAFE.x1 - w, cx - w / 2));
  return <div style={{position: "absolute", left, top: y, width: w, opacity: dim ? 0.8 : 1, filter: shadow(M, 0.5)}}>
    <div style={{background: bg, padding: "4px 13px 5px", borderTop: `5px solid ${hot ? B.c.accent : M.kraftDark}`}}>
      {L2.lines.map((l, i) => <div key={i} style={{...fitCss(mono, L2.size), color: ink, lineHeight: L2.lines.length > 1 ? 1.0 : 1.1, whiteSpace: "nowrap"}}>{l}</div>)}
    </div>
  </div>;
};
// A row of shelf labels under objects at screen x `cx`. The row's width is shared by need: every label first gets its
// longest word, the rest goes to the labels whose names are longest (so a long name wraps to two lines at a readable
// size instead of three small ones), then they are pushed apart so none overlaps another and all stay in the safe box.
export const ShelfRow: React.FC<{B: LookBrand; M: Mat; labels: {cx: number; name: string; on: boolean; hot?: boolean; dim?: boolean}[]}> = ({B, M, labels}) => {
  const n = labels.length, gap = 14;
  const mono = fitFont(B.f.mono, 0.02);
  const names = labels.map((l) => (l.name || " ").toUpperCase());
  const avail = W_SAFE - gap * (n - 1);
  const natural = names.map((nm) => measure(nm, mono, 30) + 26);
  const word = names.map((nm) => Math.max(...nm.split(/\s+/).map((w) => measure(w, mono, 26))) + 26);
  let w = word.slice();
  const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
  if (sum(w) > avail) w = w.map((x) => (x * avail) / sum(w));
  else {
    const need = natural.map((nat, i) => Math.max(0, nat - w[i])), total = sum(need), rem = avail - sum(w);
    if (total > 0) w = w.map((x, i) => x + need[i] * Math.min(1, rem / total));
  }
  const maxWs = w.map((x) => Math.min(480, x));
  const ws = labels.map((l, i) => labelFit(B, l.name || " ", maxWs[i]).w);
  const xs = labels.map((l, i) => Math.max(SAFE.x0, Math.min(SAFE.x1 - ws[i], l.cx - ws[i] / 2)));
  for (let i = 1; i < n; i++) xs[i] = Math.max(xs[i], xs[i - 1] + ws[i - 1] + gap);
  if (n) xs[n - 1] = Math.min(xs[n - 1], SAFE.x1 - ws[n - 1]);
  for (let i = n - 2; i >= 0; i--) xs[i] = Math.min(xs[i], xs[i + 1] - ws[i] - gap);
  if (n) xs[0] = Math.max(xs[0], SAFE.x0);
  return <>{labels.map((l, i) => <ShelfLabel key={i} B={B} M={M} cx={l.cx} maxW={maxWs[i]} name={l.name} nameOn={l.on} hot={l.hot} dim={l.dim} left={xs[i]}/>)}</>;
};

// ---------------------------------------------------------------- a value tag on an object (screen space)
// The printed value, its source's printed qualifier above it ("ALMOST"), and a provenance line under it when the value's
// beat names an estimate source (gd01: "WGC ESTIMATE, AS REPORTED"). (ax, ay): the object point the tag sits on (its
// bottom centre), clamped into the safe box. Shows nothing before the value's lock.
type TagIn = {n: LookNum; q?: string; prov?: string | null; size?: number; ax: number; ay: number};
// The box of a value tag (screen px), so tags in a row can be kept from overlapping each other.
export const topTagBox = (B: LookBrand, t: TagIn) => {
  const {n, q, prov, size = 44, ax, ay} = t;
  const hero = fitFont(B.f.hero), mono = fitFont(B.f.mono, 0.04);
  const vs = fitSize(n.text, hero, W_SAFE - 40, size, 30);
  const qs = q ? 28 : 0;
  const provL = prov ? fitLines(prov.toUpperCase(), mono, 360, 3, 26, 24) : null;
  const w = Math.max(measure(n.text, hero, vs), q ? measure(q.toUpperCase(), mono, qs) : 0, provL ? Math.max(...provL.lines.map((l) => measure(l, mono, provL.size))) : 0) + 28;
  const h = vs * 0.95 + 16 + (q ? qs + 4 : 0) + (provL ? provL.lines.length * (provL.size * 1.15) + 6 : 0);
  const left = Math.max(SAFE.x0, Math.min(SAFE.x1 - w, ax - w / 2));
  const top = Math.max(SAFE.y0 + 60, Math.min(SAFE.y1 - 160 - h, ay - h - 10));
  return {vs, qs, provL, w, h, left, top, hero, mono};
};
// Adjusted anchor heights for a row of value tags: a tag that would overlap one already placed (left to right) is raised
// clear of it. Tags not yet shown reserve their room too, so nothing jumps when they land.
export const spreadAy = (B: LookBrand, tags: (TagIn | null)[]): number[] => {
  const placed: {l: number; r: number; t: number; b: number}[] = [];
  return tags.map((tg) => {
    if (!tg) return 0;
    let ay = tg.ay;
    for (let k = 0; k < 6; k++) {
      const g = topTagBox(B, {...tg, ay});
      const hit = placed.find((p) => g.left < p.r + 6 && g.left + g.w > p.l - 6 && g.top < p.b + 6 && g.top + g.h > p.t - 6);
      if (!hit) { placed.push({l: g.left, r: g.left + g.w, t: g.top, b: g.top + g.h}); break; }
      ay = hit.t + 2;
    }
    return ay;
  });
};

export const TopTag: React.FC<{B: LookBrand; M: Mat; n: LookNum; f: number; ax: number; ay: number; q?: string; prov?: string | null; size?: number; dim?: boolean; at?: number}> =
  ({B, M, n, f, ax, ay, q, prov, size = 44, dim, at}) => {
  const from = Math.max(n.lockF, at ?? -Infinity);
  if (f < from) return null;
  assertLocked(n, f, "top tag");
  const {vs, qs, provL, w, left, top, mono} = topTagBox(B, {n, q, prov, size, ax, ay});
  const k = Math.min(1, (f - from) / 5);
  const ink = assertContrast(B.c.ink, B.c.paper, vs, "top tag");
  return <div style={{position: "absolute", left, top, width: w, opacity: (dim ? 0.86 : 1) * k, transform: `translateY(${(1 - k) * -14}px) rotate(-1.5deg)`, filter: shadow(M, 0.5)}}>
    <div style={{background: B.c.paper, padding: "6px 14px 8px", borderRadius: 4, borderLeft: `6px solid ${B.c.accent}`}}>
      {q && <div style={{...fitCss(mono, qs), color: assertContrast(B.c.accent, B.c.paper, qs, "top tag qualifier"), lineHeight: 1.05, marginBottom: 4}}>{q.toUpperCase()}</div>}
      <div style={{height: vs * 0.95, lineHeight: 0.95, ...fitCss(fitFont(B.f.hero), vs), color: ink, whiteSpace: "nowrap"}}>{n.text}</div>
      {provL && <div style={{marginTop: 6}}>{provL.lines.map((l, i) => <div key={i} style={{...fitCss(mono, provL.size), color: assertContrast(B.c.accent, B.c.paper, provL.size, "provenance"), lineHeight: 1.15}}>{l}</div>)}</div>}
    </div>
  </div>;
};

// ---------------------------------------------------------------- taped source chit
export const SourceChit: React.FC<{B: LookBrand; M: Mat; text: string; y?: number}> = ({B, M, text, y = 1422}) => {
  const font = fitFont(B.f.mono, 0.02);
  const full = `SOURCE · ${text}`;
  // 32 px on one line when it fits, else two lines at the largest size that fits (never under 26 px)
  const one = fitSize(full, font, W_SAFE - 30, 32, 28);
  const fits = measure(full, font, one) <= W_SAFE - 30;
  const L2 = fits ? {size: one, lines: [full]} : fitLines(full, font, W_SAFE - 30, 2, 32, 26);
  const h = L2.lines.length * Math.round(L2.size * 1.2) + 14;
  const top = Math.min(y, SAFE.y1 - h - 2);
  const w = Math.max(...L2.lines.map((l) => measure(l, font, L2.size))) + 30;
  const color = assertContrast(B.c.ink, M.kraft, L2.size, "source chit");
  return <div style={{position: "absolute", left: SAFE.x0, top, width: w, height: h, transform: "rotate(-0.6deg)", filter: shadow(M, 0.5)}}>
    <div style={{position: "absolute", inset: 0, background: M.kraft}}/>
    <div style={{position: "absolute", right: -18, top: -8, width: 60, height: 20, background: rgba(M.paper, 0.55), transform: "rotate(28deg)"}}/>
    <div style={{position: "absolute", left: 15, top: 7, ...fitCss(font, L2.size), color, lineHeight: 1.2}}>{L2.lines.map((l, i) => <div key={i}>{l}</div>)}</div>
  </div>;
};

// ---------------------------------------------------------------- provenance stamp (always on paper, never a hero)
export const Stamp: React.FC<{B: LookBrand; text: string; x: number; y: number; rot?: number; k?: number; maxW?: number}> = ({B, text, x, y, rot = -8, k = 1, maxW = 300}) => {
  const font = fitFont(B.f.mono, 0.05);
  const L2 = fitLines(text.toUpperCase(), font, maxW, 2, 30, 26);
  return <div style={{position: "absolute", left: x, top: y, transform: `rotate(${rot}deg) scale(${1.5 - 0.5 * k})`, opacity: k * 0.9, mixBlendMode: "multiply",
    border: `4px solid ${B.c.accent}`, borderRadius: 8, padding: "6px 12px", color: B.c.accent, ...fitCss(font, L2.size), lineHeight: 1.2}}>
    {L2.lines.map((l, i) => <div key={i}>{l}</div>)}
  </div>;
};
