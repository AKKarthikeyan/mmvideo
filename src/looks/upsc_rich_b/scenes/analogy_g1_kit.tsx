// ECO-16 Part 3, builder G1: shared parts for the people and story scenes (two borrowers, supervision, self-help group, Grameen, payment modes, UPI chain, fraud, part wrap).
// Re-exports the finished Part 1 and 2 kits (read only), adds a few gradients, a seated figure for the courtyard scenes and small props. Everything is a smooth function of f.
// No copied currency, logos or real faces; moneylenders never get a ledger.
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, eio, rng} from "../kit";
import {prog, type AP} from "./analogy_kit";

export {Adult, Phone, Note, Coin, QRCard, Awning, E1Defs, AccountBar, FruitPile, handPos, reach, mix2, arc, type Look, type Arms, type HandKind} from "./analogy_e1_kit";
export {E, win, armTo, path, mixp, F1Defs, Stamp, BankBuilding, Palm, House, VillageOutdoors, type P} from "./analogy_f1_kit";
export {StreetBG, Auto} from "./analogy_e1_bg";
export {Shoes} from "./analogy_e1_props";
export {P2Card, rlabs} from "./analogy_p2b_kit";
export {elabs, Defs as E3Defs, Tag} from "./analogy_e3_kit";
export {Dial, Defs as F2Defs} from "./analogy_f2_kit";
export {Hills, Cloud, Sun, Tree, FlowArrow, lerp, prog, type AP} from "./analogy_kit";
export {SANS, SERIF, W, H, clamp, eo, eio, rng};

/** gradients owned by this builder (ids start with g1-) */
export const GDefs: React.FC = () => (
  <defs>
    <linearGradient id="g1-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f0d9a8"/><stop offset="1" stopColor="#f6e6c0"/></linearGradient>
    <linearGradient id="g1-wallcool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dfe6e2"/><stop offset="1" stopColor="#efeadb"/></linearGradient>
    <linearGradient id="g1-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b98456"/><stop offset="1" stopColor="#6f4a2a"/></linearGradient>
    <linearGradient id="g1-carton" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d9b07a"/><stop offset="1" stopColor="#a8783e"/></linearGradient>
    <linearGradient id="g1-cartonlid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ecc78e"/><stop offset="1" stopColor="#c99a5e"/></linearGradient>
    <linearGradient id="g1-van" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4efe4"/><stop offset="1" stopColor="#c9c2b2"/></linearGradient>
    <linearGradient id="g1-vanblue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3f78b0"/><stop offset="1" stopColor="#24507c"/></linearGradient>
    <linearGradient id="g1-soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a4744a"/><stop offset="1" stopColor="#6c4526"/></linearGradient>
    <linearGradient id="g1-soildry" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d3b684"/><stop offset="1" stopColor="#b08e5a"/></linearGradient>
    <linearGradient id="g1-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fb2dc"/><stop offset="0.6" stopColor="#cfe0e0"/><stop offset="1" stopColor="#f8e8c2"/></linearGradient>
    <linearGradient id="g1-skydry" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a9b9c6"/><stop offset="0.6" stopColor="#ddd8c4"/><stop offset="1" stopColor="#f2dcae"/></linearGradient>
    <linearGradient id="g1-mat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c0543a"/><stop offset="0.5" stopColor="#d9784a"/><stop offset="1" stopColor="#b64a34"/></linearGradient>
    <linearGradient id="g1-navy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#34476e"/><stop offset="1" stopColor="#1a2442"/></linearGradient>
    <linearGradient id="g1-screen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b8ed2"/><stop offset="1" stopColor="#1d5a9a"/></linearGradient>
    <radialGradient id="g1-spot" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#fff3c8" stopOpacity="0.9"/><stop offset="0.5" stopColor="#ffd98a" stopOpacity="0.35"/><stop offset="1" stopColor="#ffd98a" stopOpacity="0"/></radialGradient>
    <radialGradient id="g1-cool" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#d6ecff" stopOpacity="0.9"/><stop offset="0.5" stopColor="#9fd0f4" stopOpacity="0.32"/><stop offset="1" stopColor="#9fd0f4" stopOpacity="0"/></radialGradient>
    <radialGradient id="g1-red" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ff8a7a" stopOpacity="0.75"/><stop offset="1" stopColor="#ff8a7a" stopOpacity="0"/></radialGradient>
    <linearGradient id="g1-ray" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff2c4" stopOpacity="0.55"/><stop offset="1" stopColor="#fff2c4" stopOpacity="0"/></linearGradient>
    <filter id="g1-sh" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="9" stdDeviation="8" floodColor="#1c1006" floodOpacity="0.36"/></filter>
    <filter id="g1-sh-s" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#1c1006" floodOpacity="0.38"/></filter>
  </defs>
);

export const ez = (f: number, a: number, d: number) => eo(prog(f, a, Math.max(1, d)));
export const sm = (f: number, a: number, d: number) => eio(prog(f, a, Math.max(1, d)));
/** 0 -> 1 -> 0 over d frames starting at a */
export const pulse = (f: number, a: number, d: number) => Math.sin(Math.PI * clamp((f - a) / Math.max(1, d)));
/** a soft overshoot pop from a, 0 before */
export const pop = (f: number, a: number, d = 18) => { const t = clamp((f - a) / d); return t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3) + Math.sin(t * Math.PI) * 0.14 * (1 - t); };
export const mixn = (a: number, b: number, u: number) => a + (b - a) * u;
export const arcP = (a: [number, number], b: [number, number], lift: number, u: number): [number, number] => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - Math.sin(Math.PI * u) * lift];

/** label lookup that tolerates a missing key (falls back to a frame past the end, so nothing shows) but never invents a time */
export const T = (p: AP, key: string): number => p.at(key);

/** one warm spotlight ellipse */
export const Spot: React.FC<{cx: number; cy: number; rx: number; ry: number; a: number; id?: string}> = ({cx, cy, rx, ry, a, id = "g1-spot"}) => a > 0.01 ? (
  <g opacity={a}><ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${id})`}/></g>
) : null;

/** a wash over a region: dims or desaturates what is behind it (a = 0 none) */
export const Veil: React.FC<{x: number; y: number; w: number; h: number; a: number; c?: string}> = ({x, y, w, h, a, c = "#efe3c8"}) => a > 0.005 ? <rect x={x} y={y} width={w} height={h} fill={c} opacity={a}/> : null;

/** a brass-edged small tag drawn in the picture (words only, shown with alpha a) */
export const Plate: React.FC<{x: number; y: number; w: number; h: number; lines: string[]; a: number; size?: number; ink?: string; fill?: string; glow?: number}> = ({x, y, w, h, lines, a, size = 30, ink = "#3d2a08", fill = "url(#f1-brass)", glow = 0}) => {
  if (a <= 0.003) return null;
  return (
    <g transform={`translate(${x} ${y - (1 - a) * 14})`} opacity={a} filter="url(#g1-sh-s)">
      {glow > 0.01 && <ellipse cx={0} cy={0} rx={w * 0.7} ry={h * 0.95} fill="url(#g1-spot)" opacity={glow}/>}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h * 0.14} fill={fill} stroke="#5a3c0a" strokeWidth={2.4}/>
      <rect x={-w / 2 + 7} y={-h / 2 + 7} width={w - 14} height={h - 14} rx={h * 0.1} fill="none" stroke="#fff3b8" strokeWidth={1.6} opacity={0.7}/>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => <circle key={i} cx={sx * (w / 2 - 14)} cy={sy * (h / 2 - 14)} r={3.4} fill="#7a5412" stroke="#fff3b8" strokeWidth={0.8}/>)}
      {lines.map((t, i) => <text key={i} x={0} y={(i - (lines.length - 1) / 2) * size * 1.18 + size * 0.34} textAnchor="middle" fontFamily={i === 1 && lines.length === 3 ? SERIF : SERIF} fontWeight={700} fontSize={size} letterSpacing="0.06em" fill={ink}>{t}</text>)}
    </g>
  );
};

/** a paper sign card in the art (SVG), centred at x, text as given */
export const Sign: React.FC<{x: number; y: number; text: string; a?: number; size?: number; fill?: string; ink?: string; edge?: string; w?: number; sans?: boolean}> = ({x, y, text, a = 1, size = 26, fill = "#fff7e4", ink = "#5e2a0e", edge = "#b58a52", w, sans = true}) => {
  if (a <= 0.003) return null;
  const ww = w ?? text.length * size * 0.64 + size * 1.6, hh = size * 1.9;
  return (
    <g transform={`translate(${x} ${y - (1 - a) * 10})`} opacity={a} filter="url(#g1-sh-s)">
      <rect x={-ww / 2} y={-hh / 2} width={ww} height={hh} rx={hh * 0.2} fill={fill} stroke={edge} strokeWidth={2}/>
      <text y={size * 0.34} textAnchor="middle" fontFamily={sans ? SANS : SERIF} fontWeight={800} fontSize={size} letterSpacing={size * 0.1} fill={ink}>{text}</text>
    </g>
  );
};

/** a cardboard shoe box seen from the front-top: w x h body, lid, a brand-free stripe (no logo) */
export const ShoeBox: React.FC<{x: number; y: number; w?: number; rot?: number; k?: number; stripe?: string; op?: number}> = ({x, y, w = 96, rot = 0, k = 1, stripe = "#c0543a", op = 1}) => {
  const h = w * 0.5;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`} opacity={op}>
      <ellipse cx={0} cy={h * 0.5 + 3} rx={w * 0.56} ry={5} fill="#2a1808" opacity={0.22}/>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={3} fill="url(#g1-carton)" stroke="#6a4420" strokeWidth={1.8}/>
      <rect x={-w / 2 - 3} y={-h / 2 - 7} width={w + 6} height={h * 0.34} rx={3} fill="url(#g1-cartonlid)" stroke="#6a4420" strokeWidth={1.8}/>
      <rect x={-w / 2} y={h * 0.1} width={w} height={h * 0.16} fill={stripe} opacity={0.88}/>
      <path d={`M${-w * 0.2},${-h * 0.36} H${w * 0.2}`} stroke="#fff6dc" strokeWidth={2.2} opacity={0.55} strokeLinecap="round"/>
      <path d={`M${-w / 2},${-h / 2 + 2} H${w / 2}`} stroke="#fff" strokeWidth={1.6} opacity={0.35}/>
    </g>
  );
};

/** small bundle of generic notes (a few plain coloured rectangles with a band), centred */
export const Bundle: React.FC<{x: number; y: number; s?: number; rot?: number; glow?: number; op?: number; n?: number}> = ({x, y, s = 1, rot = 0, glow = 0, op = 1, n = 3}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={op}>
    {glow > 0.01 && <ellipse rx={90} ry={56} fill="url(#ak-sunglow)" opacity={glow}/>}
    {Array.from({length: n}, (_, i) => (
      <g key={i} transform={`translate(${(i - (n - 1) / 2) * 7} ${(i - (n - 1) / 2) * -5}) rotate(${(i - (n - 1) / 2) * 7})`}>
        <rect x={-34} y={-15} width={68} height={30} rx={3} fill={["#6aa078", "#d2a05a", "#6f98c4"][i % 3]} stroke="#2c4a3a" strokeWidth={1.4}/>
        <rect x={-30} y={-11} width={60} height={22} rx={2} fill="none" stroke="#fff6dc" strokeWidth={1} opacity={0.65}/>
        <ellipse cx={4} cy={0} rx={10} ry={7} fill="#fff6dc" opacity={0.6}/>
      </g>
    ))}
    <rect x={-8} y={-17} width={16} height={34} rx={2} fill="#efe3c8" stroke="#a8946a" strokeWidth={1}/>
  </g>
);

/** a coin that lies flat (an ellipse seen from the front-top) */
export const FlatCoin: React.FC<{x: number; y: number; r?: number; op?: number}> = ({x, y, r = 12, op = 1}) => (
  <g transform={`translate(${x} ${y})`} opacity={op}>
    <ellipse cx={0} cy={r * 0.3} rx={r} ry={r * 0.5} fill="#8a5a10"/>
    <ellipse cx={0} cy={0} rx={r} ry={r * 0.5} fill="url(#e1-gold)" stroke="#8a5a10" strokeWidth={1.2}/>
    <ellipse cx={0} cy={-r * 0.06} rx={r * 0.62} ry={r * 0.3} fill="none" stroke="#b9801a" strokeWidth={1}/>
  </g>
);

/** a tick or cross badge */
export const Badge: React.FC<{x: number; y: number; ok?: boolean; s?: number; a?: number}> = ({x, y, ok = true, s = 1, a = 1}) => a > 0.01 ? (
  <g transform={`translate(${x} ${y}) scale(${s * (0.6 + 0.4 * a)})`} opacity={a}>
    <circle r={24} fill={ok ? "#2f9a4a" : "#c63f2f"} stroke={ok ? "#1a6a30" : "#7a1a12"} strokeWidth={2.4}/>
    {ok ? <path d="M-11,0 L-3,9 L13,-9" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      : <path d="M-9,-9 L9,9 M9,-9 L-9,9" stroke="#fff" strokeWidth={6} strokeLinecap="round"/>}
  </g>
) : null;

/** a bank building icon (small), for chains */
export const BankIcon: React.FC<{x: number; y: number; w?: number; tone?: string; lit?: number}> = ({x, y, w = 120, tone = "#dccfb3", lit = 0}) => {
  const h = w * 0.82;
  return (
    <g transform={`translate(${x} ${y})`}>
      {lit > 0.01 && <ellipse cx={0} cy={-h * 0.4} rx={w * 0.9} ry={h * 0.75} fill="url(#g1-spot)" opacity={lit}/>}
      <path d={`M${-w / 2},${-h * 0.66} L0,${-h} L${w / 2},${-h * 0.66} Z`} fill={tone} stroke="#8f826a" strokeWidth={2} strokeLinejoin="round"/>
      <rect x={-w / 2} y={-h * 0.66} width={w} height={h * 0.1} fill="#d9cfbd" stroke="#8f826a" strokeWidth={1.6}/>
      {[-0.36, -0.12, 0.12, 0.36].map((u, i) => <rect key={i} x={u * w - w * 0.045} y={-h * 0.56} width={w * 0.09} height={h * 0.4} fill="#f2ead8" stroke="#8f826a" strokeWidth={1.4}/>)}
      <rect x={-w * 0.56} y={-h * 0.16} width={w * 1.12} height={h * 0.1} fill="#cfc4ac" stroke="#8f826a" strokeWidth={1.6}/>
      <rect x={-w * 0.62} y={-h * 0.06} width={w * 1.24} height={h * 0.08} fill="#b9ad94" stroke="#8f826a" strokeWidth={1.4}/>
    </g>
  );
};

// ---- a seated person (courtyard scenes) ---------------------------------------------------------------------------------------------
const SKIN: [string, string][] = [["#e0b48a", "#b9835a"], ["#c68f64", "#94603c"], ["#a9744a", "#7a4a2c"], ["#d8a47a", "#a8754f"]];
export type SeatLook = {skin?: number; top?: [string, string]; lower?: string; hair?: string; female?: boolean; scarf?: string; bald?: boolean; stache?: boolean; cap?: boolean};

/** seated cross-legged, unit height ~64 (head top at -64), scaled to total height h. facing: "front" shows the face, "back" the back of the head, "side" a turned head.
 *  `raise` (0..1) lifts the right hand towards (rx, ry) in unit coordinates relative to the figure (a coin, a pen), `nod` tilts the head. */
export const Seated: React.FC<{x: number; y: number; h: number; f: number; seed?: number; look?: SeatLook; facing?: "front" | "back" | "side"; flip?: boolean; raise?: number; rx?: number; ry?: number; nod?: number; op?: number; held?: React.ReactNode; sway?: number}> =
  ({x, y, h, f, seed = 1, look = {}, facing = "front", flip = false, raise = 0, rx = 20, ry = -30, nod = 0, op = 1, held, sway = 1}) => {
  const r = rng(seed * 313 + 7), sk = SKIN[look.skin ?? Math.floor(r() * SKIN.length)], female = look.female ?? r() < 0.7;
  const top = look.top ?? ["#d9b26a", "#a5782e"], low = look.lower ?? "#8a5a3a", hr = look.hair ?? "#1a120d", scarf = look.scarf;
  const br = Math.sin(f / 38 + seed * 1.7) * 0.5 * sway, tilt = Math.sin(f / 55 + seed) * 0.8 * sway + nod;
  const wide = female ? 12.4 : 13.6;
  const face = facing !== "back";
  const rhx = mixn(5.8, rx, raise), rhy = mixn(-12, ry, raise);
  const armD = (sd: number, hx: number, hy: number) => {
    const sx = sd * 11.6, sy = -45 + br * 0.4, ex = sd * 13.6 + (hx - sd * 11.6) * 0.18, ey = -26 + (hy + 26) * 0.35;
    return `M${sx},${sy} L${ex},${ey} L${hx},${hy}`;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${(h / 64) * (flip ? -1 : 1)} ${h / 64})`} opacity={op}>
      <ellipse cx={0} cy={1} rx={28} ry={4.2} fill="#2a1808" opacity={0.3}/>
      {/* crossed legs under a long cloth */}
      <path d="M-27,0 Q-31,-8 -20,-14 Q0,-19 20,-14 Q31,-8 27,0 Q0,5 -27,0 Z" fill={low} stroke="#00000030" strokeWidth={0.5}/>
      <path d="M-4,-17 Q8,-14 24,-10 Q29,-6 27,0 Q8,3 -4,0 Z" fill="#000" opacity={0.16}/>
      <path d="M-20,-9 Q-6,-12 8,-9 M-16,-4 Q0,-7 18,-4" stroke="#00000030" strokeWidth={0.5} fill="none"/>
      <g transform={`translate(0 ${br})`}>
        {/* back hair for women, behind the torso */}
        {female && face && <path d="M-6.6,-62 Q-9.4,-52 -6.6,-45 L6.6,-45 Q9.4,-52 6.6,-62 Z" fill={hr}/>}
        {/* torso */}
        <path d={`M${-wide + 1},-45 C${-wide - 0.6},-34 ${-wide + 0.6},-22 ${-wide - 2},-12 L${wide + 2},-12 C${wide - 0.6},-22 ${wide + 0.6},-34 ${wide - 1},-45 Q0,-49 ${-wide + 1},-45 Z`} fill={top[0]} stroke={top[1]} strokeWidth={0.5}/>
        <path d={`M2,-47 Q${wide - 1},-46 ${wide - 1},-45 C${wide + 0.6},-34 ${wide - 0.6},-22 ${wide + 2},-12 L2,-12 Z`} fill={top[1]} opacity={0.32}/>
        {female && face && <path d={`M${-wide + 1},-44 Q-2,-34 ${wide + 1},-18 L${wide + 2},-12 L${wide - 5},-12 Q${wide - 6},-28 ${-wide + 4},-38 Z`} fill={scarf ?? low} opacity={0.92} stroke="#00000022" strokeWidth={0.4}/>}
        {female && !face && <path d={`M${-wide + 1},-45 Q0,-40 ${wide - 1},-45 L${wide + 2},-12 L${-wide - 2},-12 Z`} fill={scarf ?? low} opacity={0.9}/>}
        {/* arms: left hand rests in the lap, right hand optionally rises */}
        <path d={armD(-1, -6.4, -12)} stroke={top[1]} strokeWidth={5.1} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d={armD(-1, -6.4, -12)} stroke={top[0]} strokeWidth={4.4} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <ellipse cx={-6.4} cy={-12} rx={2.3} ry={2.1} fill={sk[0]}/>
        <path d={armD(1, rhx, rhy)} stroke={top[1]} strokeWidth={5.1} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d={armD(1, rhx, rhy)} stroke={top[0]} strokeWidth={4.4} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <ellipse cx={rhx} cy={rhy} rx={2.3} ry={2.1} fill={sk[0]} stroke="#6a3f26" strokeWidth={0.25}/>
        {held && <g transform={`translate(${rhx} ${rhy})`}>{held}</g>}
        {/* neck and head */}
        <g transform={`rotate(${tilt} 0 -48)`}>
          <rect x={-2.2} y={-52} width={4.4} height={6.4} rx={1.4} fill={sk[1]}/>
          <ellipse cx={0} cy={-57.4} rx={5.3} ry={6.5} fill={sk[0]} stroke="#6a3f26" strokeWidth={0.28}/>
          {face && <path d="M1.5,-63.4 Q6.4,-60 5.3,-54.2 Q4,-51.2 1.5,-51 Z" fill={sk[1]} opacity={0.3}/>}
          {!face && <path d={`M-5.9,-57 Q-6.1,-66.6 0,-66 Q6.1,-66.6 5.9,-57 Q5.4,-52 0,-51.2 Q-5.4,-52 -5.9,-57 Z`} fill={hr}/>}
          {!face && female && <circle cx={0} cy={-65} r={3.3} fill={hr}/>}
          {face && !look.bald && !look.cap && <path d={`M-5.8,-57.6 Q-6,-66.2 0,-65.6 Q6,-66.2 5.8,-57.6 Q3.2,-62 0,-61.6 Q-3.2,-62 -5.8,-57.6 Z`} fill={hr}/>}
          {face && look.cap && <path d="M-5.9,-59 Q-6.2,-67.4 0,-67 Q6.2,-67.4 5.9,-59 Q0,-61.4 -5.9,-59 Z" fill="#f1ead6" stroke="#bdb08a" strokeWidth={0.4}/>}
          {face && female && <circle cx={4.4} cy={-64.6} r={2.5} fill={hr}/>}
          {face && (
            <g transform={`translate(${facing === "side" ? 1.2 : 0} 0)`}>
              <ellipse cx={-5.3} cy={-56.8} rx={0.9} ry={1.6} fill={sk[1]}/><ellipse cx={5.3} cy={-56.8} rx={0.9} ry={1.6} fill={sk[1]}/>
              <path d="M-3.4,-59.4 L-1.3,-59.6 M1.3,-59.6 L3.4,-59.4" stroke={hr} strokeWidth={0.6} strokeLinecap="round"/>
              <ellipse cx={-2.2} cy={-58.1} rx={0.9} ry={0.5} fill="#fff" opacity={0.9}/><ellipse cx={2.2} cy={-58.1} rx={0.9} ry={0.5} fill="#fff" opacity={0.9}/>
              <ellipse cx={-2.2 + (facing === "side" ? 0.3 : 0)} cy={-58.1} rx={0.56} ry={0.44} fill="#2a1a10"/><ellipse cx={2.2 + (facing === "side" ? 0.3 : 0)} cy={-58.1} rx={0.56} ry={0.44} fill="#2a1a10"/>
              <path d="M-0.1,-57.2 Q0.8,-55.6 -0.1,-54.8" stroke={sk[1]} strokeWidth={0.5} fill="none"/>
              {look.stache && <path d="M-2.4,-54.9 Q0,-56.4 2.4,-54.9 Q0,-54 -2.4,-54.9 Z" fill={hr}/>}
              <path d="M-1.9,-53.5 Q0,-52.7 1.9,-53.5" stroke="#7a3d2a" strokeWidth={0.55} fill="none" strokeLinecap="round"/>
              {female && <circle cx={0} cy={-60.2} r={0.5} fill="#c8402a"/>}
            </g>
          )}
        </g>
      </g>
    </g>
  );
};
