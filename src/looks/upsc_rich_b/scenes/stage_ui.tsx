// Look B overlay pieces shared by the stage, title and notebook scenes: text measuring (canvas, real fonts), number cards, speech bubbles.
// Fonts are loaded by <Fonts> in RichLong / the sample entry before any scene paints, so a measurement is the same on every frame.
import React from "react";
import {SANS, SERIF, clamp, eo, lerp, prog} from "../kit";

let ctx: CanvasRenderingContext2D | null = null;
try { ctx = document.createElement("canvas").getContext("2d"); } catch { ctx = null; }
/** width in px of a string set in `font` (a CSS font shorthand without the size), at `px` */
export const textW = (t: string, font: string, px: number): number => {
  if (!ctx) return t.length * px * 0.55;
  ctx.font = `${font.replace("{px}", String(px))}`;
  return ctx.measureText(t).width;
};
/** greedy word wrap with real metrics; `fontFor(px)` gives the CSS font string */
export const wrapLines = (t: string, fontFor: string, px: number, max: number): string[] => {
  const out: string[] = []; let cur = "";
  for (const w of t.split(" ")) { const next = cur ? `${cur} ${w}` : w; if (cur && textW(next, fontFor, px) > max) { out.push(cur); cur = w; } else cur = next; }
  if (cur) out.push(cur);
  return out;
};
export const SERIF_FONT = (w = 600) => `${w} {px}px 'RB Newsreader', Georgia, serif`;
export const SANS_FONT = (w = 600) => `${w} {px}px 'RB Schibsted', 'Helvetica Neue', Arial, sans-serif`;

/** overshoot pop, 0 before t0, 1 after about 18 logical frames */
export const popK = (f: number, t0: number, d = 16): number => {
  const t = clamp((f - t0) / d);
  if (f < t0) return 0;
  return t < 1 ? eo(t) * (1 + 0.1 * Math.sin(Math.PI * t)) : 1;
};

export type CardTone = "warm" | "cool" | "teal";
const TONES: Record<CardTone, {num: string; unit: string; cap: string; tint: string}> = {
  warm: {num: "#bd3a1e", unit: "#d1593a", cap: "#8c4a22", tint: "190,110,50"},
  cool: {num: "#1c5f93", unit: "#3b86bd", cap: "#245a85", tint: "40,100,150"},
  teal: {num: "#1d6a6e", unit: "#3b9094", cap: "#1d5558", tint: "40,120,120"},
};
export const toneFor = (suffix: string, i: number): CardTone => (/°C/.test(suffix) ? "warm" : /days/.test(suffix) ? "cool" : i % 2 ? "teal" : "cool");

export type CardBox = {w: number; h: number};
/** size of a number card (so layout can avoid it before it is drawn) */
export const numberCardBox = (txt: string, unit: string, size: number, caption?: string): CardBox => {
  const wNum = textW(txt, SERIF_FONT(600), size) + (unit ? textW(unit, SERIF_FONT(500), size * 0.46) + 8 : 0);
  const capLines = caption ? wrapLines(caption, SANS_FONT(700), 24, 560) : [];
  const wCap = capLines.reduce((m, l) => Math.max(m, textW(l, SANS_FONT(700), 24)), 0);
  return {w: Math.round(Math.max(wNum, wCap, 380) + 84), h: Math.round(30 + capLines.length * 30 + 8 + size * 1.08 + 20 + 34 + 24)};
};

/** The number card: caption on top, a big serif number counting up from `at`, a small instrument under it. */
export const NumberCard: React.FC<{f: number; at: number; x: number; y: number; w: number; h: number; value: number; decimals: number; prefix: string; suffix: string; unit: string; size: number; caption?: string; tone: CardTone; words?: string}> =
  ({f, at, x, y, w, h, value, decimals, prefix, suffix, unit, size, caption, tone, words}) => {
    if (f < at) return null;
    const a = eo(prog(f, at, 16)), T = TONES[tone], shown = value * eo(prog(f, at + 2, 36));
    const lines = caption ? wrapLines(caption, SANS_FONT(700), 24, 560) : [];
    const isC = /°C/.test(suffix), isDays = /days/.test(suffix), isPct = /%/.test(suffix);
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - h / 2 + (1 - a) * 26, width: w, height: h, opacity: a, borderRadius: 20, overflow: "hidden",
        background: "linear-gradient(160deg, rgba(255,252,243,.92), rgba(255,243,219,.8))", border: `1.5px solid rgba(${T.tint},.5)`,
        boxShadow: "0 30px 60px -26px rgba(80,44,18,.55), 0 6px 14px -6px rgba(80,44,18,.3), inset 0 1.5px 0 rgba(255,255,255,.9)", backdropFilter: "blur(10px)"}}>
        <div style={{padding: "26px 38px 0"}}>
          {lines.map((l, i) => <div key={i} style={{fontFamily: SANS, fontWeight: 700, fontSize: 24, lineHeight: "30px", color: T.cap, whiteSpace: "nowrap"}}>{l}</div>)}
          <div style={{marginTop: 8, fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1.08, color: T.num, letterSpacing: "-0.02em", fontVariantNumeric: "lining-nums tabular-nums", display: "flex", alignItems: "baseline", whiteSpace: "nowrap"}}>
            {words ?? `${prefix}${shown.toFixed(decimals)}`}<span style={{fontSize: size * 0.46, fontWeight: 500, marginLeft: 8, color: T.unit}}>{unit}</span>
          </div>
        </div>
        <div style={{margin: "12px 38px 0"}}>
          {isC && <div style={{height: 14, borderRadius: 8, background: "linear-gradient(90deg,#f6dd8a,#f2a444 45%,#d8442a 80%,#9b1f1a)", position: "relative", boxShadow: "inset 0 1px 2px rgba(80,30,10,.35)"}}>
            <div style={{position: "absolute", left: `${clamp((shown - 20) / 30) * 100}%`, top: -8, width: 6, height: 30, borderRadius: 3, background: "#3a1c10", boxShadow: "0 0 0 3px rgba(255,250,235,.9)", transform: "translateX(-3px)"}}/></div>}
          {isDays && <div style={{display: "flex", gap: 4.5}}>{Array.from({length: 31}).map((_, i) => (
            <div key={i} style={{flex: 1, height: 30, borderRadius: 3, background: "#e6ddca", position: "relative", overflow: "hidden", boxShadow: "inset 0 1px 1px rgba(80,60,30,.25)"}}>
              <div style={{position: "absolute", inset: 0, width: `${clamp(shown - i) * 100}%`, background: "linear-gradient(#59a5db,#1f6aa6)"}}/></div>))}</div>}
          {isPct && <div style={{height: 22, borderRadius: 11, background: "#e6ddca", boxShadow: "inset 0 1px 2px rgba(80,60,30,.3)", overflow: "hidden"}}>
            <div style={{width: `${clamp(shown / 100) * 100}%`, height: "100%", background: "linear-gradient(90deg,#59a5db,#1f6aa6)"}}/></div>}
        </div>
      </div>
    );
  };

/** A speech bubble: warm paper, thin outline, serif text; tail points at (tx, ty) from the bottom edge. Returns null before `at`. */
export const bubbleBox = (text: string, size: number, maxW = 700): {lines: string[]; w: number; h: number; px: number} => {
  const px = Math.min(52, Math.round(size * 0.78)), lines = wrapLines(text, SERIF_FONT(500), px, maxW - 84);
  const w = Math.max(...lines.map((l) => textW(l, SERIF_FONT(500), px))) + 84;
  return {lines, w: Math.round(w), h: Math.round(lines.length * px * 1.2 + 52), px};
};
export const Bubble: React.FC<{f: number; at: number; tx: number; ty: number; lines: string[]; w: number; h: number; px: number; left: number; top: number}> = ({f, at, tx, ty, lines, w, h, px, left, top}) => {
  if (f < at) return null;
  const k = popK(f, at, 14), tailX = clamp(tx - left, 46, w - 46);
  return (
    <div style={{position: "absolute", left, top, width: w, height: h + 34, transformOrigin: `${tailX}px ${h + 34}px`, transform: `scale(${k})`, opacity: clamp(k * 1.6)}}>
      <svg width={w} height={h + 40} viewBox={`0 0 ${w} ${h + 40}`} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <defs><linearGradient id="bb-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffdf6"/><stop offset="1" stopColor="#fff1d6"/></linearGradient></defs>
        <path d={`M${tailX - 16},${h - 1} L${clamp(tx - left, 6, w - 6)},${Math.min(h + 34, ty - top)} L${tailX + 20},${h - 1} Z`} fill="#fff6e4" stroke="#b98a5a" strokeWidth="1.8" strokeLinejoin="round"/>
        <rect x="0" y="0" width={w} height={h} rx="26" fill="url(#bb-g)" stroke="#b98a5a" strokeWidth="1.8" style={{filter: "drop-shadow(0 16px 20px rgba(80,44,18,.28))"}}/>
        <path d={`M${tailX - 14},${h - 1.2} H${tailX + 18}`} stroke="#fff6e4" strokeWidth="3.6"/>
      </svg>
      <div style={{position: "absolute", left: 42, top: 26, fontFamily: SERIF, fontWeight: 500, fontSize: px, lineHeight: 1.2, color: "#3a2412", whiteSpace: "nowrap"}}>
        {lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
};
