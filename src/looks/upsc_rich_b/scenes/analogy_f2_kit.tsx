// Shared parts for the ECO-16 Part 2 scenes of builder F2 (ledger, vault-crr, rounds-stairs, gear-multiplier, crr-timeline, rbi-panel, omo):
// figure reads, an office backdrop, money blocks, brass dials, gears, coin and note stacks, a cheque, signs. Everything is a smooth function of f.
// Amounts that set a size or print a value are read from the e16_* tables through fig(); no number is typed in a scene.
import React from "react";
import {SANS, SERIF, W, H, eo, eio, clamp} from "../kit";
import {fig} from "../../cartoon/long/figs";
import {prog} from "./analogy_kit";
import {E2Defs, DeskTop, Shade} from "./analogy_e2_kit";
import {Specks, Spot, Defs as E3Defs} from "./analogy_e3_kit";

export {elabs, Classical, Plus, Tag, Counter, Plaza, BalanceBar, Brace} from "./analogy_e3_kit";
export {ECard} from "./analogy_e2_kit";
export {Specks, Spot, Shade, DeskTop};

// ---- figure reads ----------------------------------------------------------------------------------------------------------------
export const F = (t: string, s: string, dec = 0) => fig({t, state: "India", s}, dec);
export const v = (t: string, s: string) => fig({t, state: "India", s}).value;

// ---- time helpers (all smooth in f) ------------------------------------------------------------------------------------------------
export const sm = (f: number, a: number, d: number) => eio(prog(f, a, d));
export const ez = (f: number, a: number, d: number) => eo(prog(f, a, d));
export const pulse = (f: number, a: number, d: number) => Math.sin(Math.PI * clamp((f - a) / d));
/** a spring-ish settle from 0 to 1 starting at a (small overshoot) */
export const pop = (f: number, a: number, d = 18) => { const t = clamp((f - a) / d); return t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3) + Math.sin(t * Math.PI) * 0.14 * (1 - t); };
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Defs: React.FC = () => (
  <g>
    <E2Defs/>
    <E3Defs/>
    <defs>
      <linearGradient id="f2-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f2f6f8"/><stop offset="0.5" stopColor="#b7c4cc"/><stop offset="1" stopColor="#6f808b"/></linearGradient>
      <linearGradient id="f2-steel-d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c9d4da"/><stop offset="0.5" stopColor="#8a9ba6"/><stop offset="1" stopColor="#4c5b66"/></linearGradient>
      <radialGradient id="f2-gear" cx="38%" cy="32%" r="85%"><stop offset="0" stopColor="#fbe7a6"/><stop offset="0.45" stopColor="#dcae52"/><stop offset="1" stopColor="#8e6522"/></radialGradient>
      <radialGradient id="f2-gear-d" cx="50%" cy="50%" r="60%"><stop offset="0" stopColor="#7a5122" stopOpacity="0"/><stop offset="1" stopColor="#3d2610" stopOpacity="0.55"/></radialGradient>
      <linearGradient id="f2-board" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6f4a2a"/><stop offset="1" stopColor="#3f2814"/></linearGradient>
      <linearGradient id="f2-leather" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8c3a2a"/><stop offset="0.5" stopColor="#6e2a1e"/><stop offset="1" stopColor="#4a1a12"/></linearGradient>
      <linearGradient id="f2-page" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#efe0bc"/><stop offset="0.12" stopColor="#fbf2dc"/><stop offset="0.9" stopColor="#fffaee"/><stop offset="1" stopColor="#e6d2a4"/></linearGradient>
      <linearGradient id="f2-pageR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#e6d2a4"/><stop offset="0.1" stopColor="#fffaee"/><stop offset="0.88" stopColor="#fbf2dc"/><stop offset="1" stopColor="#efe0bc"/></linearGradient>
      <linearGradient id="f2-shaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff2c4" stopOpacity="0.55"/><stop offset="1" stopColor="#fff2c4" stopOpacity="0"/></linearGradient>
      <linearGradient id="f2-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6e9cc"/><stop offset="1" stopColor="#e2cb9b"/></linearGradient>
      <linearGradient id="f2-win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9cc8ea"/><stop offset="1" stopColor="#f0eddc"/></linearGradient>
    </defs>
  </g>
);

/** a warm bank office: panelled wall, arched windows with light shafts, soft dust. `deskY` draws the desk from there down (0 = none). */
export const OfficeBG: React.FC<{f: number; deskY?: number; id: string; cool?: boolean; panel?: string}> = ({f, deskY = 0, id, cool = false, panel = "#b98d5a"}) => {
  const gy = deskY > 0 ? deskY : 780;
  return (
    <g>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={cool ? "#e6ebf0" : "url(#f2-wall)"}/>
      {Array.from({length: 10}, (_, i) => <rect key={i} x={i * 200 - 30} y={-20} width={100} height={gy} fill={cool ? "#d6dde6" : "#f0dcb4"} opacity={0.26}/>)}
      {[200, 560, 920, 1280, 1640].map((x, i) => (
        <g key={i} opacity={0.88}>
          <path d={`M${x},${gy - 110} V190 A110,110 0 0 1 ${x + 220},190 V${gy - 110} Z`} fill="url(#f2-win)" stroke="#a9895a" strokeWidth={8}/>
          <path d={`M${x + 110},80 V${gy - 110} M${x},${gy - 300} H${x + 220} M${x},${gy - 500 < 200 ? 300 : gy - 500} H${x + 220}`} stroke="#a9895a" strokeWidth={5} opacity={0.8}/>
          <path d={`M${x + 20},${gy - 110} V190 A90,90 0 0 1 ${x + 110},100`} stroke="#fff" strokeWidth={9} fill="none" opacity={0.3}/>
          <path d={`M${x + 20},${gy - 110} L${x - 120},${gy + 120} L${x + 200},${gy + 120} L${x + 240},${gy - 110} Z`} fill="url(#f2-shaft)" opacity={0.22 + 0.06 * Math.sin(f / 50 + i)}/>
        </g>
      ))}
      {/* wainscot */}
      <rect x={-40} y={gy - 160} width={W + 80} height={170} fill={panel} opacity={0.92}/>
      <rect x={-40} y={gy - 168} width={W + 80} height={12} fill="#e2c28a"/>
      {Array.from({length: 9}, (_, i) => <rect key={i} x={i * 230 + 30} y={gy - 138} width={180} height={112} rx={6} fill="none" stroke="#7a5430" strokeWidth={3} opacity={0.55}/>)}
      {deskY > 0 && <DeskTop y0={deskY}/>}
      <Specks f={f} n={22} seed={7} y0={120} y1={gy}/>
    </g>
  );
};

// ---- a money block ---------------------------------------------------------------------------------------------------------------
type Tone = "gold" | "blue" | "green";
const TONES: Record<Tone, {f: [string, string]; top: string; side: string; edge: string; ink: string}> = {
  gold: {f: ["#f9dc7a", "#c8921f"], top: "#fff3bd", side: "#a8741c", edge: "#7a4f0e", ink: "#4a2f06"},
  blue: {f: ["#86c8f0", "#2a74b0"], top: "#c6e9fb", side: "#1f5c92", edge: "#164a78", ink: "#ffffff"},
  green: {f: ["#96d8a6", "#2f8e58"], top: "#d2f3da", side: "#226f43", edge: "#1a5a37", ink: "#ffffff"},
};
/** a solid money block with depth: x centre, y base (front face bottom), w x h front; `k` 0..1 grows it from the base */
export const Block: React.FC<{id: string; x: number; y: number; w: number; h: number; tone: Tone; text?: string; a?: number; k?: number; glow?: number; size?: number; ridges?: boolean; dx?: number; dy?: number}> =
  ({id, x, y, w, h, tone, text, a = 1, k = 1, glow = 0, size, ridges = true, dx = 20, dy = -15}) => {
  if (a <= 0.001 || k <= 0.001) return null;
  const T = TONES[tone], hh = h * k, x0 = x - w / 2, y0 = y - hh;
  return (
    <g opacity={a}>
      <defs>
        <linearGradient id={`${id}-f`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={T.f[0]}/><stop offset="1" stopColor={T.f[1]}/></linearGradient>
      </defs>
      {glow > 0.01 && <ellipse cx={x + dx / 2} cy={y - hh / 2} rx={w * 0.95} ry={hh * 0.8 + 40} fill="#fff1b0" opacity={0.55 * glow} filter="url(#e3-glow)"/>}
      <ellipse cx={x + dx * 0.5} cy={y + 6} rx={w * 0.62} ry={9} fill="#2a1808" opacity={0.3} filter="url(#ak-blur8)"/>
      <polygon points={`${x0 + w},${y0} ${x0 + w + dx},${y0 + dy} ${x0 + w + dx},${y + dy} ${x0 + w},${y}`} fill={T.side} stroke={T.edge} strokeWidth={1.8} strokeLinejoin="round"/>
      <polygon points={`${x0},${y0} ${x0 + dx},${y0 + dy} ${x0 + w + dx},${y0 + dy} ${x0 + w},${y0}`} fill={T.top} stroke={T.edge} strokeWidth={1.8} strokeLinejoin="round"/>
      <rect x={x0} y={y0} width={w} height={hh} rx={5} fill={`url(#${id}-f)`} stroke={T.edge} strokeWidth={2}/>
      {ridges && Array.from({length: Math.max(0, Math.floor(hh / 26) - 1)}, (_, i) => <path key={i} d={`M${x0 + 6},${y0 + 26 * (i + 1)} H${x0 + w - 6}`} stroke="#fff" strokeWidth={1.4} opacity={0.2}/>)}
      <rect x={x0 + 8} y={y0 + 8} width={Math.max(0, w * 0.1)} height={Math.max(0, hh - 16)} rx={5} fill="#fff" opacity={0.2}/>
      <rect x={x0 + 4} y={y0 + 4} width={w - 8} height={Math.max(0, hh - 8)} rx={4} fill="none" stroke="#fff" strokeWidth={1.2} opacity={0.35}/>
      {text && hh > 40 && <text x={x} y={y0 + hh / 2 + (size ?? 52) * 0.34} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={size ?? 52} fill={T.ink} stroke={tone === "gold" ? "none" : T.edge} strokeWidth={tone === "gold" ? 0 : 1.2} paintOrder="stroke" opacity={clamp((k - 0.5) * 3)}>{text}</text>}
    </g>
  );
};

// ---- a brass dial ----------------------------------------------------------------------------------------------------------------
/** A round brass-bezel dial: `ang` is the needle angle in degrees from straight up (negative = left). Ticks run over `sweep` degrees (symmetric about up).
 *  `read` prints in the centre (small); `lit` 0..1 adds a warm glow ring; `marks` are extra coloured tick positions as angles. */
export const Dial: React.FC<{id: string; cx: number; cy: number; r: number; ang: number; sweep?: number; ticks?: number; read?: string; lit?: number; marks?: {ang: number; c: string}[]; face?: string; needle?: string; a?: number; hub?: boolean}> =
  ({id, cx, cy, r, ang, sweep = 270, ticks = 28, read, lit = 0, marks = [], face = "#fbf3dc", needle = "#b32d24", a = 1, hub = true}) => {
  if (a <= 0.001) return null;
  const rad = (d: number) => ((d - 90) * Math.PI) / 180, P = (d: number, rr: number) => [cx + Math.cos(rad(d)) * rr, cy + Math.sin(rad(d)) * rr];
  const half = sweep / 2;
  return (
    <g opacity={a}>
      <defs>
        <radialGradient id={`${id}-face`} cx="40%" cy="32%" r="80%"><stop offset="0" stopColor="#fffdf2"/><stop offset="0.7" stopColor={face}/><stop offset="1" stopColor="#d9c595"/></radialGradient>
        <clipPath id={`${id}-clip`}><circle cx={cx} cy={cy} r={r * 0.9}/></clipPath>
      </defs>
      {lit > 0.01 && <circle cx={cx} cy={cy} r={r * 1.35} fill="url(#ak-sunglow)" opacity={0.85 * lit}/>}
      <ellipse cx={cx + r * 0.08} cy={cy + r * 1.02} rx={r * 1.0} ry={r * 0.12} fill="#2a1808" opacity={0.3} filter="url(#ak-blur8)"/>
      <circle cx={cx} cy={cy} r={r} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
      <circle cx={cx} cy={cy} r={r * 0.94} fill="none" stroke="#fff3c0" strokeWidth={2} opacity={0.6}/>
      <circle cx={cx} cy={cy} r={r * 0.9} fill={`url(#${id}-face)`} stroke="#8e6522" strokeWidth={2.4}/>
      {Array.from({length: ticks + 1}, (_, i) => { const d = -half + (sweep * i) / ticks, big = i % 4 === 0, p1 = P(d, r * 0.8), p2 = P(d, r * (big ? 0.66 : 0.72));
        return <path key={i} d={`M${p1[0]},${p1[1]} L${p2[0]},${p2[1]}`} stroke="#4a2f0a" strokeWidth={big ? 3.4 : 2} strokeLinecap="round" opacity={0.8}/>; })}
      {marks.map((m, i) => { const p1 = P(m.ang, r * 0.84), p2 = P(m.ang, r * 0.6); return <path key={i} d={`M${p1[0]},${p1[1]} L${p2[0]},${p2[1]}`} stroke={m.c} strokeWidth={6} strokeLinecap="round"/>; })}
      {read && <text x={cx} y={cy + r * 0.52} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={r * 0.26} fill="#4a2f0a">{read}</text>}
      <g transform={`rotate(${ang} ${cx} ${cy})`}>
        <path d={`M${cx - 6},${cy + r * 0.2} L${cx},${cy - r * 0.74} L${cx + 6},${cy + r * 0.2} Z`} fill={needle} stroke="#5a140e" strokeWidth={1.6} strokeLinejoin="round"/>
        <path d={`M${cx - 1},${cy + r * 0.1} L${cx},${cy - r * 0.7} L${cx + 2},${cy + r * 0.1} Z`} fill="#fff" opacity={0.35}/>
        <circle cx={cx} cy={cy + r * 0.2} r={r * 0.07} fill="#6c4a16"/>
      </g>
      {hub && <><circle cx={cx} cy={cy} r={r * 0.1} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2}/><circle cx={cx - r * 0.025} cy={cy - r * 0.03} r={r * 0.035} fill="#fff6cf" opacity={0.8}/></>}
      <path d={`M${cx - r * 0.7},${cy - r * 0.35} A${r * 0.78},${r * 0.78} 0 0 1 ${cx - r * 0.05},${cy - r * 0.78}`} fill="none" stroke="#fff" strokeWidth={r * 0.06} strokeLinecap="round" opacity={0.5}/>
      {[0, 1, 2, 3].map((i) => { const p = P(45 + i * 90, r * 0.97); return <circle key={i} cx={p[0]} cy={p[1]} r={r * 0.03} fill="#fff3c0" stroke="#6c4a16" strokeWidth={1}/>; })}
    </g>
  );
};

// ---- gears -----------------------------------------------------------------------------------------------------------------------
const gearPath = (n: number, ro: number, rr: number) => {
  const p = (2 * Math.PI) / n, pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = i * p;
    [[rr, -0.34], [ro, -0.17], [ro, 0.17], [rr, 0.34]].forEach(([r, k]) => pts.push(`${(Math.cos(a + k * p) * r).toFixed(1)},${(Math.sin(a + k * p) * r).toFixed(1)}`));
  }
  return "M" + pts.join(" L") + " Z";
};
/** a brass gear centred at cx,cy: n teeth, outer radius ro, rotation `rot` in radians, `spokes` windows cut to the board behind */
export const Gear: React.FC<{id: string; cx: number; cy: number; n: number; ro: number; rot: number; spokes?: number; hub?: number; shadow?: boolean; a?: number; depth?: number}> =
  ({id, cx, cy, n, ro, rot, spokes = 0, hub = 0.16, shadow = true, a = 1, depth: depthP}) => {
  const depth = depthP ?? Math.min(ro * 0.09, 26), rr = ro - depth, ring = ro * 0.14, rin = rr - ring, rh = ro * hub;
  const wins = spokes > 0 ? Array.from({length: spokes}, (_, i) => {
    const w = (2 * Math.PI) / spokes, a0 = i * w + w * 0.14, a1 = (i + 1) * w - w * 0.14, ri = rh * 1.7, big = a1 - a0 > Math.PI ? 1 : 0;
    const q = (r: number, an: number) => `${(Math.cos(an) * r).toFixed(1)},${(Math.sin(an) * r).toFixed(1)}`;
    return `M${q(ri, a0)} L${q(rin, a0)} A${rin},${rin} 0 ${big} 1 ${q(rin, a1)} L${q(ri, a1)} A${ri},${ri} 0 ${big} 0 ${q(ri, a0)} Z`;
  }) : [];
  return (
    <g opacity={a}>
      {shadow && <ellipse cx={cx + ro * 0.06} cy={cy + ro * 0.07} rx={ro * 1.02} ry={ro * 1.02} fill="#1c1006" opacity={0.4} filter="url(#e3-glow-s)"/>}
      <g transform={`translate(${cx} ${cy}) rotate(${(rot * 180) / Math.PI})`}>
        <path d={gearPath(n, ro, rr)} fill="url(#f2-gear)" stroke="#6c4a16" strokeWidth={Math.max(2, ro * 0.012)} strokeLinejoin="round"/>
        <circle r={rr} fill="none" stroke="#fff3c0" strokeWidth={Math.max(1.5, ro * 0.01)} opacity={0.55}/>
        {wins.map((d, i) => <path key={i} d={d} fill="#3f2814" stroke="#6c4a16" strokeWidth={Math.max(2, ro * 0.012)} strokeLinejoin="round"/>)}
        {wins.map((d, i) => <path key={`i${i}`} d={d} fill="url(#f2-gear-d)" opacity={0.5}/>)}
        <circle r={rin} fill="none" stroke="#8e6522" strokeWidth={Math.max(1.5, ro * 0.008)} opacity={0.8}/>
        <circle r={rh * 1.7} fill="none" stroke="#8e6522" strokeWidth={Math.max(1.5, ro * 0.008)} opacity={0.8}/>
        <circle r={rh} fill="url(#f2-gear)" stroke="#6c4a16" strokeWidth={Math.max(2, ro * 0.014)}/>
        {Array.from({length: 6}, (_, i) => <circle key={i} cx={Math.cos((i * Math.PI) / 3) * rh * 0.62} cy={Math.sin((i * Math.PI) / 3) * rh * 0.62} r={rh * 0.09} fill="#6c4a16"/>)}
        <circle r={rh * 0.28} fill="#6c4a16"/>
      </g>
      <circle cx={cx - rh * 0.3} cy={cy - rh * 0.3} r={rh * 0.16} fill="#fff6cf" opacity={0.65}/>
      <path d={`M${cx - ro * 0.78},${cy - ro * 0.4} A${ro * 0.88},${ro * 0.88} 0 0 1 ${cx - ro * 0.12},${cy - ro * 0.86}`} fill="none" stroke="#fff" strokeWidth={Math.max(3, ro * 0.03)} strokeLinecap="round" opacity={0.32}/>
    </g>
  );
};

// ---- stacks, notes, cheque -----------------------------------------------------------------------------------------------------
/** a vertical stack of coins: base centre x,y; height h (px, grows with k); d diameter */
export const CoinStack: React.FC<{id: string; x: number; y: number; h: number; d: number; a?: number; k?: number}> = ({id, x, y, h, d, a = 1, k = 1}) => {
  if (a <= 0.001 || k <= 0.001 || h < 2) return null;
  const hh = h * k, th = Math.max(5, d * 0.17), ry = d * 0.17, n = Math.max(1, Math.round(hh / th)), top = y - hh;
  return (
    <g opacity={a}>
      <defs>
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#b9811a"/><stop offset="0.3" stopColor="#f6d36a"/><stop offset="0.55" stopColor="#e9b948"/><stop offset="1" stopColor="#8a5c10"/></linearGradient>
      </defs>
      <ellipse cx={x + d * 0.06} cy={y + 2} rx={d * 0.62} ry={ry * 0.8} fill="#2a1808" opacity={0.3} filter="url(#ak-blur8)"/>
      <path d={`M${x - d / 2},${top} V${y} A${d / 2},${ry} 0 0 0 ${x + d / 2},${y} V${top} Z`} fill={`url(#${id}-s)`} stroke="#7a4f0e" strokeWidth={1.8}/>
      {Array.from({length: n - 1}, (_, i) => { const yy = y - (hh * (i + 1)) / n; return <path key={i} d={`M${x - d / 2},${yy} A${d / 2},${ry} 0 0 0 ${x + d / 2},${yy}`} fill="none" stroke="#7a4f0e" strokeWidth={1.2} opacity={0.55}/>; })}
      <ellipse cx={x} cy={top} rx={d / 2} ry={ry} fill="#f9e08c" stroke="#7a4f0e" strokeWidth={1.8}/>
      <ellipse cx={x} cy={top} rx={d * 0.36} ry={ry * 0.72} fill="none" stroke="#b9811a" strokeWidth={1.6} opacity={0.8}/>
      <ellipse cx={x - d * 0.1} cy={top - ry * 0.2} rx={d * 0.2} ry={ry * 0.3} fill="#fff" opacity={0.45}/>
    </g>
  );
};

/** a banknote bundle stack (paper bundles with cream bands): base centre x,y; height h; w wide */
export const NoteStack: React.FC<{id: string; x: number; y: number; h: number; w: number; a?: number; k?: number; tone?: "teal" | "violet"}> = ({id, x, y, h, w, a = 1, k = 1, tone = "teal"}) => {
  if (a <= 0.001 || k <= 0.001 || h < 2) return null;
  const hh = h * k, c = tone === "teal" ? ["#8fd0c0", "#2a6f78", "#d6f1e8"] : ["#b4a6dc", "#4e3f86", "#e6dffa"], ry = w * 0.12;
  const n = Math.max(1, Math.round(hh / 34)), bh = hh / n;
  return (
    <g opacity={a}>
      <defs><linearGradient id={`${id}-n`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={c[1]}/><stop offset="0.25" stopColor={c[0]}/><stop offset="0.8" stopColor={c[0]}/><stop offset="1" stopColor={c[1]}/></linearGradient></defs>
      <ellipse cx={x + w * 0.05} cy={y + 2} rx={w * 0.66} ry={ry * 0.8} fill="#2a1808" opacity={0.3} filter="url(#ak-blur8)"/>
      {Array.from({length: n}, (_, i) => {
        const yy = y - bh * (i + 1), dx = ((i * 37) % 7 - 3) * 0.9;
        return (
          <g key={i} transform={`translate(${dx} 0)`}>
            <rect x={x - w / 2} y={yy + 1.5} width={w} height={bh - 1.5} rx={3} fill={`url(#${id}-n)`} stroke={c[1]} strokeWidth={1.8}/>
            {Array.from({length: Math.max(1, Math.floor(bh / 6))}, (_, k2) => <path key={k2} d={`M${x - w / 2 + 2},${yy + 5 + k2 * 6} H${x + w / 2 - 2}`} stroke={c[2]} strokeWidth={0.9} opacity={0.4}/>)}
            <rect x={x - w * 0.1} y={yy + 1.5} width={w * 0.2} height={bh - 1.5} fill="#efe0b4" stroke="#a98a52" strokeWidth={1.2}/>
            <path d={`M${x - w * 0.1},${yy + bh * 0.4} H${x + w * 0.1}`} stroke="#b9975a" strokeWidth={1.2} opacity={0.7}/>
          </g>
        );
      })}
      <path d={`M${x - w / 2},${y - hh + 1.5} L${x - w / 2 + ry * 0.9},${y - hh - ry * 0.9 + 1.5} L${x + w / 2 + ry * 0.9},${y - hh - ry * 0.9 + 1.5} L${x + w / 2},${y - hh + 1.5} Z`} fill={c[2]} stroke={c[1]} strokeWidth={1.8} strokeLinejoin="round"/>
      <rect x={x - w / 2 + 6} y={y - hh + 4} width={7} height={Math.max(0, hh - 8)} rx={3} fill="#fff" opacity={0.18}/>
    </g>
  );
};

/** a plain generic cheque (no bank name, no logo): paper, pay line, amount box, scribbled signature */
export const Cheque: React.FC<{x: number; y: number; w?: number; rot?: number; a?: number}> = ({x, y, w = 190, rot = 0, a = 1}) => {
  if (a <= 0.001) return null;
  const h = w * 0.44;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={a} filter="url(#e3-sh-s)">
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={5} fill="#f3f9ee" stroke="#5f8a6a" strokeWidth={2.2}/>
      <rect x={-w / 2 + 6} y={-h / 2 + 6} width={w - 12} height={h - 12} rx={3} fill="none" stroke="#5f8a6a" strokeWidth={1} opacity={0.6}/>
      <rect x={-w / 2} y={-h / 2} width={w * 0.22} height={h} rx={5} fill="#cfe6d4" opacity={0.7}/>
      <text x={-w / 2 + 12} y={-h / 2 + 24} fontFamily={SANS} fontWeight={800} fontSize={h * 0.2} letterSpacing={2} fill="#3f6a4c">PAY</text>
      <path d={`M${-w * 0.2},${-h * 0.12} H${w * 0.36}`} stroke="#3f6a4c" strokeWidth={1.6}/>
      <path d={`M${-w * 0.2},${h * 0.1} H${w * 0.18}`} stroke="#3f6a4c" strokeWidth={1.6}/>
      <rect x={w * 0.24} y={h * 0.02} width={w * 0.2} height={h * 0.22} rx={3} fill="none" stroke="#3f6a4c" strokeWidth={1.8}/>
      <path d={`M${w * 0.05},${h * 0.34} q12,-16 24,0 t24,-4 t22,2`} stroke="#1f3a52" strokeWidth={2} fill="none" strokeLinecap="round"/>
      <path d={`M${-w / 2 + 8},${h / 2 - 6} H${w / 2 - 8}`} stroke="#8fb09a" strokeWidth={4} strokeDasharray="2 3" opacity={0.7}/>
    </g>
  );
};

/** a hand-stop sign: a red octagon with a white open palm */
export const StopSign: React.FC<{x: number; y: number; r: number; a?: number; k?: number; pole?: number}> = ({x, y, r, a = 1, k = 1, pole = r * 1.5}) => {
  if (a <= 0.001) return null;
  const oct = Array.from({length: 8}, (_, i) => { const an = (Math.PI / 8) + (i * Math.PI) / 4; return `${(Math.cos(an) * r).toFixed(1)},${(Math.sin(an) * r).toFixed(1)}`; }).join(" ");
  const s = r / 100;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} opacity={a}>
      <rect x={-r * 0.07} y={r * 0.8} width={r * 0.14} height={pole} fill="url(#f2-steel-d)" stroke="#4c5b66" strokeWidth={2}/>
      <ellipse cx={0} cy={r * 0.8 + pole} rx={r * 0.7} ry={r * 0.11} fill="#2a1808" opacity={0.3} filter="url(#ak-blur8)"/>
      <rect x={-r * 0.34} y={r * 0.8 + pole - 8} width={r * 0.68} height={14} rx={6} fill="url(#f2-steel-d)" stroke="#4c5b66" strokeWidth={2}/>
      <polygon points={oct} fill="#d63a2e" stroke="#fff" strokeWidth={r * 0.07} strokeLinejoin="round" filter="url(#e3-sh)"/>
      <polygon points={oct} fill="none" stroke="#8c1f1a" strokeWidth={r * 0.025} strokeLinejoin="round" transform="scale(0.88)"/>
      <g transform={`scale(${s})`} fill="#fff">
        <rect x={-34} y={-8} width={68} height={52} rx={22}/>
        <rect x={-34} y={-62} width={14} height={66} rx={7}/><rect x={-17} y={-76} width={14} height={78} rx={7}/><rect x={0} y={-76} width={14} height={78} rx={7}/><rect x={17} y={-62} width={14} height={66} rx={7}/>
        <path d="M-34,14 Q-52,-6 -50,-18 Q-46,-28 -38,-16 L-30,2 Z"/>
      </g>
    </g>
  );
};

/** a lifebuoy ring with a rope, centred at x,y, outer radius r */
export const Lifebuoy: React.FC<{x: number; y: number; r: number; a?: number; k?: number; f?: number}> = ({x, y, r, a = 1, k = 1, f = 0}) => {
  if (a <= 0.001) return null;
  const sw = r * 0.34, rm = r - sw / 2;
  return (
    <g transform={`translate(${x} ${y + Math.sin(f / 16) * 2}) rotate(${Math.sin(f / 20) * 2}) scale(${k})`} opacity={a} filter="url(#e3-sh)">
      <circle r={rm} fill="none" stroke="#8c1f1a" strokeWidth={sw + 4}/>
      <circle r={rm} fill="none" stroke="#fffaf0" strokeWidth={sw}/>
      {[0, 1, 2, 3].map((i) => { const a0 = (i * Math.PI) / 2 - 0.4, a1 = a0 + 0.8; return <path key={i} d={`M${Math.cos(a0) * rm},${Math.sin(a0) * rm} A${rm},${rm} 0 0 1 ${Math.cos(a1) * rm},${Math.sin(a1) * rm}`} fill="none" stroke="#d63a2e" strokeWidth={sw}/>; })}
      <circle r={rm + sw / 2} fill="none" stroke="#fff" strokeWidth={2} opacity={0.5}/>
      <circle r={rm - sw / 2} fill="none" stroke="#8c1f1a" strokeWidth={2} opacity={0.6}/>
      {[0, 1, 2, 3].map((i) => <circle key={`l${i}`} cx={Math.cos((i * Math.PI) / 2 + 0.75) * (rm + sw * 0.62)} cy={Math.sin((i * Math.PI) / 2 + 0.75) * (rm + sw * 0.62)} r={r * 0.04} fill="#7a4f0e"/>)}
      <path d={`M${-r * 0.95},${-r * 0.2} Q${-r * 1.15},${r * 0.5} ${-r * 0.7},${r * 0.9}`} fill="none" stroke="#b78a4a" strokeWidth={5} strokeLinecap="round" strokeDasharray="1 7"/>
    </g>
  );
};

/** a brass/paper tag that sits in the picture (not a label card): used for in-art captions that belong to the object */
export const Plate: React.FC<{x: number; y: number; w: number; text: string; a?: number; size?: number; ink?: string; fill?: string}> = ({x, y, w, text, a = 1, size = 26, ink = "#4a2f0a", fill = "url(#e2-brass)"}) => {
  if (a <= 0.001) return null;
  const h = size * 1.7;
  return (
    <g transform={`translate(${x} ${y})`} opacity={a} filter="url(#e3-sh-s)">
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h * 0.22} fill={fill} stroke="#6c4a16" strokeWidth={2.2}/>
      <rect x={-w / 2 + 5} y={-h / 2 + 5} width={w - 10} height={h - 10} rx={h * 0.16} fill="none" stroke="#fff3c0" strokeWidth={1.2} opacity={0.6}/>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j], k) => <circle key={k} cx={i * (w / 2 - 11)} cy={j * (h / 2 - 9)} r={2.6} fill="#6c4a16"/>)}
      <text y={size * 0.34} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={size} letterSpacing={size * 0.08} fill={ink}>{text}</text>
    </g>
  );
};

export {SANS, SERIF, W, H, eo, eio, clamp, prog};
