// Mains answer videos (formats A, B, C; mmvideo-dk docs/upsc/PYQ_ANSWERS_PLAN.md), drawn in look B. Shared pieces:
// the desk, the exam paper, the ruled answer booklet, handwriting, the clock, the word counter and the demand boxes.
// Contract: CONTRACT_PYQ.md. Every motion is a smooth function of f (30 fps logical frames, fractional at 60 fps).
import React from "react";
import {measure} from "../../shared/fit";
import {SANS, SERIF, W, H, clamp, eo, rng} from "../kit";

// Handwriting: Noteworthy ships with macOS (the render machine); nothing is downloaded or copied into the repo.
export const HAND = "'Noteworthy', 'Bradley Hand', 'Chalkboard SE', cursive";
export const INK = "#1f2d6e", RED = "#c0392b", PENCIL = "#5b5148";
const HAND_F = {family: HAND, weight: 400, tnum: false, letterSpacing: 0};
export const handWidth = (t: string, size: number) => measure(t, HAND_F, size);

/** a warm wooden desk under a lamp, the base of every answer scene */
export const Desk: React.FC<{f: number}> = ({f}) => {
  const r = rng(5), grain = Array.from({length: 26}, (_, i) => ({y: i * 44 + r() * 30, a: 0.05 + r() * 0.08, w: 1 + r() * 2.5}));
  return <svg width={W} height={H} style={{position: "absolute", inset: 0}}>
    <defs>
      <linearGradient id="dk-wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8a5a34"/><stop offset="0.55" stopColor="#74482a"/><stop offset="1" stopColor="#5a361f"/></linearGradient>
      <radialGradient id="dk-lamp" cx="22%" cy="8%" r="85%"><stop offset="0" stopColor="#ffe6b8" stopOpacity="0.55"/><stop offset="0.5" stopColor="#ffd59a" stopOpacity="0.12"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#dk-wood)"/>
    {grain.map((g, i) => <path key={i} d={`M-20,${g.y} C 500,${g.y + 18} 1300,${g.y - 22} ${W + 20},${g.y + 6}`} stroke="#3b2414" strokeOpacity={g.a} strokeWidth={g.w} fill="none"/>)}
    <rect width={W} height={H} fill="url(#dk-lamp)" opacity={0.92 + 0.03 * Math.sin(f / 40)}/>
  </svg>;
};

/** cream paper with a soft shadow */
export const paper = (x: number, y: number, w: number, h: number, rot = 0, a = 1): React.CSSProperties => ({
  position: "absolute", left: x, top: y, width: w, height: h, opacity: a, transform: `rotate(${rot}deg)`,
  background: "linear-gradient(170deg, #fffdf6 0%, #fbf4e4 70%, #f4ead3 100%)", borderRadius: 6,
  boxShadow: "0 40px 70px -30px rgba(40,20,5,.75), 0 10px 20px -8px rgba(40,20,5,.45)", overflow: "hidden",
});

/** greedy word wrap with real measurement; returns lines of text */
export const wrap = (text: string, size: number, width: number, w = handWidth): string[] => {
  const out: string[] = []; let cur = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const t = cur ? cur + " " + word : word;
    if (cur && w(t, size) > width) { out.push(cur); cur = word; } else cur = t;
  }
  if (cur) out.push(cur);
  return out;
};

/** handwriting that appears letter by letter: `n` characters of `text` are shown, the last few still drying */
export const Hand: React.FC<{text: string; n: number; size: number; color?: string; weight?: number; under?: boolean; wrapText?: boolean}> = ({text, n, size, color = INK, weight = 400, under, wrapText}) => {
  const k = Math.max(0, Math.min(text.length, n));
  return <span style={{fontFamily: HAND, fontSize: size, fontWeight: weight, color, whiteSpace: wrapText ? "pre-wrap" : "pre", textDecoration: under && k >= text.length ? `underline ${color} 2px` : undefined, textUnderlineOffset: 6}}>
    {text.slice(0, Math.floor(k))}<span style={{opacity: k - Math.floor(k)}}>{text.slice(Math.floor(k), Math.floor(k) + 1)}</span>
  </span>;
};

/** handwriting with _underlined terms_ (the underscores are markup, not ink); `u0` = an underline already open at the line start;
 * `n` counts visible characters, so the reveal speed ignores the markup. Underlines are drawn in red, as toppers do. */
export const HandU: React.FC<{text: string; n: number; size: number; u0?: boolean; color?: string; weight?: number}> = ({text, n, size, u0 = false, color = INK, weight = 400}) => {
  const segs: {s: string; u: boolean}[] = []; let u = u0, cur = "";
  for (const ch of text) { if (ch === "_") { if (cur) segs.push({s: cur, u}); cur = ""; u = !u; } else cur += ch; }
  if (cur) segs.push({s: cur, u});
  let left = Math.max(0, n);
  return <span style={{fontFamily: HAND, fontSize: size, fontWeight: weight, color, whiteSpace: "pre"}}>
    {segs.map((g, i) => {
      const k = Math.min(g.s.length, left); left -= k;
      const whole = Math.floor(k), part = k - whole;
      return <span key={i} style={g.u ? {textDecoration: `underline ${RED} 2.5px`, textUnderlineOffset: 7, textDecorationSkipInk: "none"} : undefined}>
        {g.s.slice(0, whole)}{part > 0 && <span style={{opacity: part}}>{g.s.slice(whole, whole + 1)}</span>}
      </span>;
    })}
  </span>;
};

export const mmss = (min: number) => { const s = Math.max(0, Math.round(min * 60)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

/** the exam clock and the word counter, stacked cards on the right */
export const Gauges: React.FC<{x: number; y: number; left: number; total: number; words: number; budget: number; a: number}> = ({x, y, left, total, words, budget, a}) => {
  const card: React.CSSProperties = {position: "absolute", left: x, width: 480, padding: "18px 26px", borderRadius: 16, opacity: a,
    background: "rgba(255,250,238,.92)", border: "1.5px solid rgba(150,90,40,.35)", boxShadow: "0 20px 40px -20px rgba(40,20,5,.7)"};
  const frac = clamp(left / total);
  return <>
    <div style={{...card, top: y}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: "0.16em", color: "#7a4a26"}}>TIME LEFT</div>
      <div style={{display: "flex", alignItems: "center", gap: 22}}>
        <svg width={92} height={92}><circle cx={46} cy={46} r={40} fill="#fff7e6" stroke="#c9a77c" strokeWidth={3}/>
          <path d={arc(46, 46, 40, frac)} fill={frac < 0.15 ? "#e3a08f" : "#f1cf8f"} opacity={0.9}/>
          <line x1={46} y1={46} x2={46 + 34 * Math.sin(2 * Math.PI * (1 - frac))} y2={46 - 34 * Math.cos(2 * Math.PI * (1 - frac))} stroke="#5a361f" strokeWidth={3} strokeLinecap="round"/></svg>
        <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 76, color: "#3b2414", fontVariantNumeric: "tabular-nums"}}>{mmss(left)}</div>
      </div>
    </div>
    <div style={{...card, top: y + 168}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: "0.16em", color: "#7a4a26"}}>WORDS</div>
      <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 60, color: "#3b2414", fontVariantNumeric: "tabular-nums"}}>{Math.round(words)}<span style={{fontSize: 32, color: "#8a6a4a"}}> / {budget}</span></div>
      <div style={{height: 10, borderRadius: 5, background: "#eadcc2", overflow: "hidden"}}><div style={{width: `${clamp(words / budget) * 100}%`, height: "100%", background: "#6f8f5a"}}/></div>
    </div>
  </>;
};
const arc = (cx: number, cy: number, r: number, frac: number) => {
  if (frac >= 0.999) return `M${cx - r},${cy} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0`;
  const a = 2 * Math.PI * frac, x = cx + r * Math.sin(-a), y = cy - r * Math.cos(-a);
  return `M${cx},${cy} L${cx},${cy - r} A${r},${r} 0 ${frac > 0.5 ? 1 : 0},0 ${x},${y} Z`;
};

/** the demand boxes: empty squares that tick (green) when their job is done */
export type Demand = {id: string; label: string; key?: string};
export const Boxes: React.FC<{x: number; y: number; items: Demand[]; shown: (d: Demand, i: number) => number; ticked: (d: Demand, i: number) => number; width?: number; size?: number; light?: boolean}> = ({x, y, items, shown, ticked, width = 480, size = 30, light}) => (
  <>{items.map((d, i) => {
    const s = eo(shown(d, i)), t = eo(ticked(d, i));
    return <div key={d.id} style={{position: "absolute", left: x, top: y + i * (size * 2.4) + (1 - s) * 16, width, opacity: s, display: "flex", alignItems: "center", gap: 18}}>
      <svg width={size * 1.5} height={size * 1.5} style={{flex: "none"}}>
        <rect x={3} y={3} width={size * 1.5 - 6} height={size * 1.5 - 6} rx={6} fill={t > 0.5 ? "#e5f0d8" : "#fffaf0"} stroke={t > 0.5 ? "#4f7a3a" : "#8a6a4a"} strokeWidth={3}/>
        <path d={`M${size * 0.32},${size * 0.78} L${size * 0.62},${size * 1.08} L${size * 1.2},${size * 0.38}`} fill="none" stroke="#3f7a2a" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t}/>
      </svg>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: size * 0.82, color: light ? "#fbefd9" : "#3b2414", lineHeight: 1.15, textShadow: light ? "0 2px 6px rgba(30,15,5,.7)" : undefined}}><span style={{color: light ? "#f2b679" : "#a0522d", fontWeight: 800}}>{d.id}</span> {d.label}</div>
    </div>;
  })}</>
);

/** a highlighter stroke behind a phrase (drawn left to right) */
export const Marker: React.FC<{p: number; color?: string}> = ({p, color = "rgba(255,206,84,.75)"}) => (
  <span style={{position: "absolute", left: -6, right: -6, top: "18%", bottom: "8%", background: color, borderRadius: 6, transformOrigin: "left center", transform: `scaleX(${clamp(p)})`, zIndex: -1}}/>
);
