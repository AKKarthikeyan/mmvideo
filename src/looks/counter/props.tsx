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
export const Sign: React.FC<{B: LookBrand; M: Mat; text: string; x: number; y: number; maxW: number; vis?: number; rot?: number; size?: number}> =
  ({B, M, text, x, y, maxW, vis = 1, rot = -1.2, size = 32}) => {
  const font = fitFont(B.f.mono, 0.04);
  const s = fitSize(text, font, maxW - 36, size, 22);
  const w = measure(text, font, s) + 36;
  const color = assertContrast(B.c.ink, M.kraft, s, "sign");
  return <div style={{position: "absolute", left: x, top: y, width: w, height: s + 22, opacity: vis, transform: `rotate(${rot}deg)`, filter: shadow(M, 0.6)}}>
    <div style={{position: "absolute", inset: 0, background: M.kraft}}/>
    <div style={{position: "absolute", left: -16, top: -10, width: 64, height: 22, background: rgba(M.paper, 0.6), transform: "rotate(-24deg)"}}/>
    <div style={{position: "absolute", left: 18, top: 11, ...fitCss(font, s), color, lineHeight: 1}}>{text}</div>
  </div>;
};

// ---------------------------------------------------------------- shelf-edge label (name + optional value), clipped to the counter edge
export const ShelfLabel: React.FC<{B: LookBrand; M: Mat; cx: number; y: number; maxW: number; name: string; nameOn: boolean; num?: LookNum | null; f: number; hot?: boolean; dim?: boolean}> =
  ({B, M, cx, y, maxW, name, nameOn, num, f, hot, dim}) => {
  const mono = fitFont(B.f.mono, 0.03), hero = fitFont(B.f.hero);
  const label = name.toUpperCase();
  const ns = fitSize(label, mono, maxW - 24, 22, 15);
  const vs = num ? fitSize(num.text, hero, maxW - 24, 36, 24) : 0;
  const w = Math.min(maxW, Math.max(measure(label, mono, ns), num ? measure(num.text, hero, vs) : 0) + 26);
  const bg = hot ? M.paper : M.kraft;
  const ink = assertContrast(B.c.ink, bg, ns, "shelf label");
  const left = Math.max(SAFE.x0, Math.min(SAFE.x1 - w, cx - w / 2));
  if (!nameOn && (!num || !shown(num, f))) return null;      // nothing to say yet: no empty label
  return <div style={{position: "absolute", left, top: y, width: w, opacity: dim ? 0.78 : 1, filter: shadow(M, 0.5)}}>
    <div style={{background: bg, padding: "5px 13px 6px", borderTop: `5px solid ${hot ? B.c.accent : M.kraftDark}`}}>
      <div style={{...fitCss(mono, ns), color: ink, lineHeight: 1.12, opacity: nameOn ? 1 : 0}}>{label}</div>
      {num && <div style={{marginTop: 3, height: vs * 0.95, lineHeight: 0.95}}><Num n={num} f={f} font={hero} size={vs} color={ink} blank={rgba(B.c.ink, 0.18)} where="shelf label"/></div>}
    </div>
  </div>;
};
export const LABEL_Y = 1336;

// ---------------------------------------------------------------- taped source chit
export const SourceChit: React.FC<{B: LookBrand; M: Mat; text: string; y?: number}> = ({B, M, text, y = 1424}) => {
  const font = fitFont(B.f.mono, 0.02);
  const full = `SOURCE · ${text}`;
  const one = fitSize(full, font, W_SAFE - 30, 26, 17);
  const fits = measure(full, font, one) <= W_SAFE - 30;
  const L2 = fits ? {size: one, lines: [full]} : fitLines(full, font, W_SAFE - 30, 2, 22, 16);
  const h = L2.lines.length * Math.round(L2.size * 1.3) + 16;
  const top = Math.min(y, SAFE.y1 - h - 4);
  const w = Math.max(...L2.lines.map((l) => measure(l, font, L2.size))) + 30;
  const color = assertContrast(B.c.ink, M.kraft, L2.size, "source chit");
  return <div style={{position: "absolute", left: SAFE.x0, top, width: w, height: h, transform: "rotate(-0.6deg)", filter: shadow(M, 0.5)}}>
    <div style={{position: "absolute", inset: 0, background: M.kraft}}/>
    <div style={{position: "absolute", right: -18, top: -8, width: 60, height: 20, background: rgba(M.paper, 0.55), transform: "rotate(28deg)"}}/>
    <div style={{position: "absolute", left: 15, top: 8, ...fitCss(font, L2.size), color, lineHeight: 1.3}}>{L2.lines.map((l, i) => <div key={i}>{l}</div>)}</div>
  </div>;
};

// ---------------------------------------------------------------- brass unit key
export const UnitKey: React.FC<{B: LookBrand; M: Mat; text: string; x: number; y: number; vis?: number; dx?: number}> = ({B, M, text, x, y, vis = 1, dx = 0}) => {
  const font = fitFont(B.f.mono, 0.06);
  const s = fitSize(text, font, 300, 26, 18);
  const color = assertContrast(B.c.ink, M.brassLight, s, "unit key");
  return <div style={{position: "absolute", left: x + dx, top: y, opacity: vis, padding: "8px 18px", borderRadius: 8,
    background: `linear-gradient(180deg, ${M.brassLight}, ${M.brass})`, boxShadow: `0 6px 10px ${rgba(M.shadow, 0.5)}, inset 0 1px 0 ${rgba(M.paper, 0.6)}`,
    ...fitCss(font, s), color, lineHeight: 1}}>{text}</div>;
};

// ---------------------------------------------------------------- provenance stamp (always on paper, never a hero)
export const Stamp: React.FC<{B: LookBrand; text: string; x: number; y: number; rot?: number; k?: number; maxW?: number}> = ({B, text, x, y, rot = -8, k = 1, maxW = 300}) => {
  const font = fitFont(B.f.mono, 0.05);
  const L2 = fitLines(text.toUpperCase(), font, maxW, 2, 24, 16);
  return <div style={{position: "absolute", left: x, top: y, transform: `rotate(${rot}deg) scale(${1.5 - 0.5 * k})`, opacity: k * 0.9, mixBlendMode: "multiply",
    border: `4px solid ${B.c.accent}`, borderRadius: 8, padding: "6px 12px", color: B.c.accent, ...fitCss(font, L2.size), lineHeight: 1.2}}>
    {L2.lines.map((l, i) => <div key={i}>{l}</div>)}
  </div>;
};
