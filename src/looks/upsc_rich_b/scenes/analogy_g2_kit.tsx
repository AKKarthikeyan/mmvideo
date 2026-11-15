// Shared parts for the ECO-16 Part 3 scenes of builder G2 (credit-terms, debt-bars, graph-trap, jan-dhan, accounts, upi-compare): number reads from the e16_* tables,
// time helpers, a fading label card, passbooks, coin stacks, a paper chart sheet, a drafting desk, tiny-coin strips. Everything is a smooth function of f.
// No figure is typed in a component: sizes and printed values come from fig() through fv()/ft().
import React from "react";
import {fig} from "../../cartoon/long/figs";
import {SANS, SERIF, W, H, cardStyle, clamp, eo, eio, rng} from "../kit";
import {prog} from "./analogy_kit";

export {F3Defs, Hall, elabs, ECard, Tag, Brace, Shade, Plaque, Specks, Classical, Quest, Spot, Ink, inkFront, PaperCard, Cross, Weight, Bundle, wrapText} from "./analogy_f3_kit";
export {Adult, E1Defs} from "./analogy_e1_kit";
export {Padlock, Clock} from "./analogy_e2_kit";
export {Stamp, F1Defs, House} from "./analogy_f1_kit";
export {Person} from "./analogy_kit";
export {prog, eo, eio, clamp, rng, W, H, SANS, SERIF};

/** a table value / printed text from an e16_* table (state "India") */
export const fv = (t: string, s: string) => fig({t, state: "India", s}).value;
export const ft = (t: string, s: string, dec = 0) => fig({t, state: "India", s}, dec).text;

/** ease-in-out and ease-out windows, a pop with a small overshoot, a pulse that rises and falls */
export const E = (f: number, a: number, d: number) => eio(prog(f, a, Math.max(1, d)));
export const Z = (f: number, a: number, d: number) => eo(prog(f, a, Math.max(1, d)));
export const pop = (f: number, a: number, d = 18) => { const t = clamp((f - a) / d); return t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3) + Math.sin(t * Math.PI) * 0.14 * (1 - t); };
export const pulse = (f: number, a: number, d: number) => Math.sin(Math.PI * clamp((f - a) / d));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** gradients of our own */
export const G2Defs: React.FC = () => (
  <defs>
    <linearGradient id="g2-teal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fdad2"/><stop offset="0.5" stopColor="#2fa3a8"/><stop offset="1" stopColor="#176a7c"/></linearGradient>
    <linearGradient id="g2-amber" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd488"/><stop offset="0.5" stopColor="#e9953c"/><stop offset="1" stopColor="#b3591e"/></linearGradient>
    <linearGradient id="g2-plum" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c7a0d8"/><stop offset="0.5" stopColor="#8a5ea6"/><stop offset="1" stopColor="#5a3478"/></linearGradient>
    <linearGradient id="g2-sage" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c3e0a8"/><stop offset="0.5" stopColor="#7fb36a"/><stop offset="1" stopColor="#4b7f47"/></linearGradient>
    <linearGradient id="g2-sheet" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fffbef"/><stop offset="1" stopColor="#f1e4c4"/></linearGradient>
    <linearGradient id="g2-wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#dcb987"/><stop offset="0.55" stopColor="#bd8f58"/><stop offset="1" stopColor="#8f6234"/></linearGradient>
    <linearGradient id="g2-navy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1d2c63"/><stop offset="0.55" stopColor="#0f1838"/><stop offset="1" stopColor="#080d22"/></linearGradient>
    <radialGradient id="g2-coinr" cx="38%" cy="32%" r="80%"><stop offset="0" stopColor="#fff2b8"/><stop offset="0.5" stopColor="#f0c04e"/><stop offset="1" stopColor="#b9801f"/></radialGradient>
  </defs>
);

/** a label card (same look as ECard) that can leave again: visible from `at` to `out` (out = Infinity keeps it) */
export const FCard: React.FC<{cx: number; y: number; text: string; f: number; at: number; out?: number; size?: number; maxW?: number; tone?: "warm" | "cool" | "green" | "dark" | "red"; upper?: boolean; left?: boolean; rot?: number}> =
  ({cx, y, text, f, at, out = Infinity, size = 40, maxW = 900, tone = "warm", upper = true, left = false, rot = 0}) => {
  const a = eo(prog(f, at, 14)) * (1 - eo(prog(f, out, 14)));
  if (a <= 0.001) return null;
  const tint = tone === "cool" ? "70,120,180" : tone === "green" ? "50,140,80" : tone === "red" ? "190,60,50" : "190,110,50";
  const bar = tone === "cool" ? "#2f78b8" : tone === "green" ? "#2f9a4a" : tone === "red" ? "#c63f2f" : tone === "dark" ? "#f0b45a" : "#d8682a";
  const st = cardStyle(cx, y, 0, 0, a, 22, tint), dark = tone === "dark";
  return (
    <div style={{...st, width: "max-content", height: "auto", maxWidth: maxW, transform: `${left ? "" : "translateX(-50%) "}rotate(${rot}deg)`, padding: `${Math.round(size * 0.42)}px ${Math.round(size * 0.8)}px ${Math.round(size * 0.46)}px`, textAlign: left ? "left" : "center",
      ...(dark ? {background: "linear-gradient(160deg, rgba(34,40,70,.92), rgba(22,26,52,.9))", border: "1.5px solid rgba(255,225,170,.45)"} : {})}}>
      <div style={{width: 46, height: 5, borderRadius: 3, background: bar, margin: left ? `0 0 ${Math.round(size * 0.3)}px` : `0 auto ${Math.round(size * 0.3)}px`, opacity: 0.9}}/>
      <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1.14, letterSpacing: upper ? "0.015em" : "0.005em", color: dark ? "#fff0d4" : tone === "cool" ? "#173a5c" : tone === "green" ? "#14502a" : tone === "red" ? "#6a1d16" : "#5e2a0e", textTransform: upper ? "uppercase" : "none"}}>{text}</div>
    </div>
  );
};

/** a wooden drafting desk seen from above with a lamp pool and (optionally) a brass ruler along the top edge */
export const Desk: React.FC<{f: number; id: string; ruler?: boolean}> = ({f, id, ruler = false}) => (
  <g>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#g2-wood)"/>
    {Array.from({length: 17}, (_, i) => <path key={i} d={`M-60,${i * 66 - 20} Q960,${i * 66 - 34 + (i % 3) * 10} 1980,${i * 66 - 10}`} stroke="#6e4524" strokeWidth={1.6} fill="none" opacity={0.3}/>)}
    <ellipse cx={900} cy={470} rx={1050} ry={640} fill="url(#ak-sunglow)" opacity={0.3 + 0.03 * Math.sin(f / 40)}/>
    {ruler && (
      <g>
        <rect x={0} y={0} width={W} height={34} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2}/>
        {Array.from({length: 96}, (_, i) => <path key={`${id}${i}`} d={`M${i * 20},34 v${i % 5 === 0 ? -16 : -9}`} stroke="#4a2f0a" strokeWidth={i % 5 === 0 ? 2.4 : 1.5} opacity={0.8}/>)}
        <rect x={0} y={34} width={W} height={8} fill="#2a1808" opacity={0.25}/>
      </g>
    )}
  </g>
);

/** a standing coin stack (side view), base centre x,y; n coins (n may be fractional: the top coin grows in) */
export const Stack: React.FC<{x: number; y: number; n: number; rx?: number; th?: number; a?: number; glow?: number}> = ({x, y, n, rx = 62, th = 18, a = 1, glow = 0}) => {
  if (a <= 0.002 || n <= 0.001) return null;
  const full = Math.floor(n), part = n - full, total = n;
  const coins = Array.from({length: full + (part > 0.02 ? 1 : 0)}, (_, i) => ({i, k: i < full ? 1 : part}));
  const topY = y - full * th - (part > 0.02 ? th * part : 0);
  return (
    <g opacity={a}>
      {glow > 0.01 && <ellipse cx={x} cy={y - total * th * 0.5} rx={rx * 1.6} ry={total * th * 0.6 + 40} fill="url(#ak-sunglow)" opacity={glow}/>}
      <ellipse cx={x + 10} cy={y + 4} rx={rx * 1.1} ry={rx * 0.22} fill="#2a1808" opacity={0.34} filter="url(#ak-blur8)"/>
      {coins.map(({i, k}) => {
        const yb = y - i * th, t = th * k;
        return (
          <g key={i}>
            <path d={`M${x - rx},${yb - t} V${yb} A${rx},${rx * 0.3} 0 0 0 ${x + rx},${yb} V${yb - t} Z`} fill="url(#e2-gold)" stroke="#8c5f18" strokeWidth={2}/>
            <path d={`M${x + rx * 0.3},${yb - t + 3} V${yb + 2} A${rx},${rx * 0.3} 0 0 0 ${x + rx},${yb} V${yb - t} Z`} fill="#000" opacity={0.16}/>
            {k > 0.6 && Array.from({length: 7}, (_, j) => <path key={j} d={`M${x - rx + 12 + (j * (rx * 2 - 24)) / 6},${yb - t + 4} V${yb - 2}`} stroke="#8c5f18" strokeWidth={1.2} opacity={0.45}/>)}
          </g>
        );
      })}
      <ellipse cx={x} cy={topY} rx={rx} ry={rx * 0.3} fill="url(#e2-coin)" stroke="#a8741c" strokeWidth={2.4}/>
      <ellipse cx={x} cy={topY} rx={rx * 0.74} ry={rx * 0.2} fill="none" stroke="#b9831f" strokeWidth={1.6} opacity={0.8}/>
      <path d={`M${x - rx * 0.5},${topY - rx * 0.08} q${rx * 0.3},${-rx * 0.14} ${rx * 0.7},${-rx * 0.04}`} stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.6}/>
    </g>
  );
};

/** a passbook, centred on (x, y), w x h, tilted by rot. `c` = [cover top, cover bottom, trim]. Children are drawn on the cover in local coordinates (origin = centre). */
export const Passbook: React.FC<{id: string; x: number; y: number; w: number; h: number; rot?: number; c: [string, string, string]; a?: number; glow?: number; sx?: number; children?: React.ReactNode; shadow?: boolean}> =
  ({id, x, y, w, h, rot = 0, c, a = 1, glow = 0, sx = 1, children, shadow = true}) => {
  if (a <= 0.002) return null;
  const x0 = -w / 2, y0 = -h / 2;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sx} 1)`} opacity={a}>
      <defs>
        <linearGradient id={`${id}-cv`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={c[0]}/><stop offset="1" stopColor={c[1]}/></linearGradient>
        <clipPath id={`${id}-cc`}><rect x={x0} y={y0} width={w} height={h} rx={w * 0.035}/></clipPath>
      </defs>
      {glow > 0.01 && <ellipse cx={0} cy={0} rx={w * 0.85} ry={h * 0.72} fill="url(#ak-sunglow)" opacity={glow}/>}
      {shadow && <rect x={x0 + 12} y={y0 + 20} width={w} height={h} rx={w * 0.04} fill="#2a1808" opacity={0.36} filter="url(#e3-glow)"/>}
      {/* page block seen at the right and bottom */}
      <rect x={x0 + 8} y={y0 + 8} width={w} height={h} rx={w * 0.03} fill="#f6efe0" stroke="#c9b88c" strokeWidth={1.6}/>
      {Array.from({length: 5}, (_, i) => <path key={i} d={`M${x0 + w + 1 + i * 1.6},${y0 + 14} V${y0 + h + 4}`} stroke="#d8c9a0" strokeWidth={1}/>)}
      <rect x={x0} y={y0} width={w} height={h} rx={w * 0.035} fill={`url(#${id}-cv)`} stroke={c[2]} strokeWidth={2.4}/>
      <g clipPath={`url(#${id}-cc)`}>
        <rect x={x0} y={y0} width={w * 0.085} height={h} fill="#000" opacity={0.22}/>
        {Array.from({length: 9}, (_, i) => <path key={i} d={`M${x0 + w * 0.03},${y0 + h * (0.08 + i * 0.105)} h${w * 0.03}`} stroke="#f6e6b0" strokeWidth={3} strokeLinecap="round" opacity={0.6}/>)}
        <path d={`M${x0 + w * 0.1},${y0} L${x0 + w * 0.62},${y0} L${x0 + w * 0.1},${y0 + h * 0.5} Z`} fill="#fff" opacity={0.08}/>
        <rect x={x0 + w * 0.12} y={y0 + h * 0.05} width={w * 0.8} height={h * 0.9} rx={w * 0.02} fill="none" stroke={c[2]} strokeWidth={2} opacity={0.75}/>
        <rect x={x0 + w * 0.14} y={y0 + h * 0.065} width={w * 0.76} height={h * 0.87} rx={w * 0.015} fill="none" stroke={c[2]} strokeWidth={0.9} opacity={0.5}/>
        {children}
        <path d={`M${x0 + w * 0.2},${y0 + h * 0.1} Q${x0 + w * 0.5},${y0 - h * 0.02} ${x0 + w * 0.9},${y0 + h * 0.06}`} stroke="#fff" strokeWidth={w * 0.012} fill="none" strokeLinecap="round" opacity={0.28}/>
      </g>
      {/* brass corner caps */}
      {[[1, 1], [1, -1]].map(([i, j], k) => <path key={k} d={`M${x0 + w},${j > 0 ? y0 + h - h * 0.07 : y0 + h * 0.07} V${j > 0 ? y0 + h : y0} H${x0 + w - w * 0.09} Z`} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={1.4} opacity={0.95}/>)}
    </g>
  );
};

/** a strip of tiny coins: a hexagonal field of small discs inside a rounded band, drifting left to right with f. `grow` 0..1 reveals it from the left.
 *  The pattern id must be unique on the page. */
export const CoinStrip: React.FC<{id: string; x: number; y: number; w: number; h: number; r?: number; f: number; grow?: number; speed?: number; glow?: number; hue?: "gold" | "silver"}> =
  ({id, x, y, w, h, r = 9, f, grow = 1, speed = 0.7, glow = 0.5, hue = "gold"}) => {
  if (grow <= 0.002) return null;
  const pw = r * 4, ph = r * 3.4, off = (f * speed) % pw, cc = hue === "gold" ? ["#fff2b8", "#f0c04e", "#b9801f"] : ["#ffffff", "#d8e0e6", "#8f9ca8"];
  return (
    <g>
      <defs>
        <pattern id={`${id}-p`} x={x - off} y={y} width={pw} height={ph} patternUnits="userSpaceOnUse">
          <circle cx={r * 1.0} cy={r * 0.95} r={r * 0.92} fill={cc[1]} stroke={cc[2]} strokeWidth={1}/>
          <circle cx={r * 1.0} cy={r * 0.95} r={r * 0.56} fill="none" stroke={cc[2]} strokeWidth={0.9} opacity={0.7}/>
          <circle cx={r * 0.74} cy={r * 0.7} r={r * 0.26} fill={cc[0]} opacity={0.85}/>
          <circle cx={r * 3.0} cy={r * 2.65} r={r * 0.92} fill={cc[1]} stroke={cc[2]} strokeWidth={1}/>
          <circle cx={r * 3.0} cy={r * 2.65} r={r * 0.56} fill="none" stroke={cc[2]} strokeWidth={0.9} opacity={0.7}/>
          <circle cx={r * 2.74} cy={r * 2.4} r={r * 0.26} fill={cc[0]} opacity={0.85}/>
        </pattern>
        <clipPath id={`${id}-c`}><rect x={x} y={y} width={Math.max(0.1, w * grow)} height={h} rx={h * 0.12}/></clipPath>
        <linearGradient id={`${id}-sh`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.35"/><stop offset="0.25" stopColor="#fff" stopOpacity="0"/><stop offset="0.8" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity="0.35"/></linearGradient>
      </defs>
      {glow > 0.01 && <rect x={x - 20} y={y - 20} width={w * grow + 40} height={h + 40} rx={h * 0.2} fill="#ffcf6a" opacity={glow * 0.32} filter="url(#e3-glow)"/>}
      <rect x={x} y={y} width={Math.max(0.1, w * grow)} height={h} rx={h * 0.12} fill={hue === "gold" ? "#6b4710" : "#4b5560"} stroke={cc[2]} strokeWidth={2}/>
      <g clipPath={`url(#${id}-c)`}>
        <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-p)`}/>
        <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-sh)`}/>
      </g>
      <rect x={x} y={y} width={Math.max(0.1, w * grow)} height={h} rx={h * 0.12} fill="none" stroke={cc[0]} strokeWidth={1.6} opacity={0.6}/>
    </g>
  );
};

/** a person pictogram (no face: a plain head disc and a body), centred on x, standing on y, height h */
export const Pictogram: React.FC<{x: number; y: number; h: number; fill: string; edge?: string; woman?: boolean; a?: number}> = ({x, y, h, fill, edge = "rgba(30,15,5,.35)", woman = false, a = 1}) => {
  const hr = h * 0.17, bw = h * (woman ? 0.5 : 0.44);
  return (
    <g opacity={a}>
      <circle cx={x} cy={y - h + hr} r={hr} fill={fill} stroke={edge} strokeWidth={1.4}/>
      {woman
        ? <path d={`M${x - bw * 0.3},${y - h + hr * 2.35} H${x + bw * 0.3} L${x + bw * 0.62},${y - h * 0.16} Q${x},${y - h * 0.06} ${x - bw * 0.62},${y - h * 0.16} Z`} fill={fill} stroke={edge} strokeWidth={1.4} strokeLinejoin="round"/>
        : <path d={`M${x - bw * 0.5},${y - h * 0.52} Q${x - bw * 0.5},${y - h + hr * 2.3} ${x},${y - h + hr * 2.3} Q${x + bw * 0.5},${y - h + hr * 2.3} ${x + bw * 0.5},${y - h * 0.52} V${y - h * 0.04} H${x + bw * 0.08} V${y - h * 0.5} H${x - bw * 0.08} V${y - h * 0.04} H${x - bw * 0.5} Z`} fill={fill} stroke={edge} strokeWidth={1.4} strokeLinejoin="round"/>}
    </g>
  );
};
export {cardStyle};
