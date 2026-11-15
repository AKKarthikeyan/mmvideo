// Look B parts for the "analogy" scenes: frame (slow camera, paper finish, chip, limit line), label cards, flowing arrows, sun, clouds, hills, trees, adult people.
// Everything is a smooth function of f (a fractional 30 fps logical frame at 60 fps).
import React from "react";
import {AbsoluteFill} from "remotion";
import {PaperFinish, Pill, SANS, SERIF, W, H, cardStyle, clamp, eo, rng} from "../kit";

export type Lab = {text: string; key: string};
export type AnalogySpec = {which?: string; time?: "day" | "night"; chip?: string; limit?: string; labels?: Lab[]};
export type AP = {f: number; dur: number; spec: AnalogySpec; at: (k: string) => number};
export type Pt = [number, number];

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const prog = (f: number, a: number, d: number) => clamp((f - a) / d);

/** gradients shared by the parts below */
export const KitDefs: React.FC = () => (
  <defs>
    <radialGradient id="ak-cloud" cx="42%" cy="35%" r="70%"><stop offset="0" stopColor="#ffffff"/><stop offset="0.65" stopColor="#f5f1ea"/><stop offset="1" stopColor="#cdd8e6"/></radialGradient>
    <radialGradient id="ak-sunglow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#fff3bf" stopOpacity="0.95"/><stop offset="0.35" stopColor="#ffd37a" stopOpacity="0.45"/><stop offset="1" stopColor="#ffb458" stopOpacity="0"/></radialGradient>
    <radialGradient id="ak-sundisc" cx="40%" cy="38%" r="70%"><stop offset="0" stopColor="#fffbe0"/><stop offset="0.6" stopColor="#ffe08a"/><stop offset="1" stopColor="#f5b648"/></radialGradient>
    <filter id="ak-blur8" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter>
    <filter id="ak-blur22" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="22"/></filter>
  </defs>
);

/** Full-frame wrapper: slow drift, paper finish, chip (top left), "Where the picture stops" line, label cards through `overlay`. */
export const Frame: React.FC<{f: number; dur: number; spec: AnalogySpec; id: string; bg?: string; dark?: boolean; fx?: number; fy?: number; drift?: number;
  children: React.ReactNode; overlay?: React.ReactNode}> = ({f, dur, spec, id, bg = "#EFE6D2", dark, fx = 960, fy = 520, drift = 0.03, children, overlay}) => {
  const t = clamp(f / Math.max(1, dur)), s = 1 + drift * t, dx = (0.5 - t) * 16;
  return (
    <AbsoluteFill style={{background: bg, overflow: "hidden"}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", inset: 0}}>
        <KitDefs/>
        <g transform={`translate(${fx + dx} ${fy}) scale(${s}) translate(${-fx} ${-fy})`}>{children}</g>
      </svg>
      <PaperFinish id={`${id}pf`} grain={0.5} vignette={dark ? 0.5 : 0.32}/>
      {spec.chip ? <Pill x={96} y={72} text={spec.chip} a={eo(prog(f, 3, 14))}/> : null}
      {spec.limit ? (
        <div style={{position: "absolute", left: 96, width: 1728, top: 866, textAlign: "center", opacity: eo(prog(f, 12, 22))}}>
          <span style={{display: "inline-block", padding: "9px 26px 10px", borderRadius: 30, fontFamily: SANS, fontWeight: 700, fontSize: 25, letterSpacing: "0.02em",
            color: dark ? "#fbefd6" : "#5a3418", background: dark ? "rgba(18,24,52,.72)" : "rgba(255,250,238,.84)", border: `1.2px solid ${dark ? "rgba(255,225,170,.4)" : "rgba(150,90,40,.35)"}`,
            boxShadow: "0 10px 22px -12px rgba(40,22,8,.55)"}}>Where the picture stops: {spec.limit}</span>
        </div>
      ) : null}
      {overlay}
    </AbsoluteFill>
  );
};

/** a paper label card, centred on cx, shown from the frame `at` */
export const LabelCard: React.FC<{cx: number; y: number; text: string; f: number; at: number; size?: number; maxW?: number; tone?: "warm" | "cool" | "dark"}> = ({cx, y, text, f, at, size = 40, maxW = 900, tone = "warm"}) => {
  const a = eo(prog(f, at, 14));
  if (a <= 0.001) return null;
  const tint = tone === "cool" ? "70,120,180" : "190,110,50";
  const st = cardStyle(cx, y, 0, 0, a, 22, tint);
  const bar = tone === "cool" ? "#2f78b8" : tone === "dark" ? "#f0b45a" : "#d8682a";
  return (
    <div style={{...st, width: "max-content", height: "auto", maxWidth: maxW, transform: "translateX(-50%)", padding: `${Math.round(size * 0.42)}px ${Math.round(size * 0.8)}px ${Math.round(size * 0.46)}px`, textAlign: "center",
      ...(tone === "dark" ? {background: "linear-gradient(160deg, rgba(34,40,70,.92), rgba(22,26,52,.9))", border: "1.5px solid rgba(255,225,170,.45)"} : {})}}>
      <div style={{width: 46, height: 5, borderRadius: 3, background: bar, margin: `0 auto ${Math.round(size * 0.3)}px`, opacity: 0.9}}/>
      <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1.14, letterSpacing: "0.015em", color: tone === "dark" ? "#fff0d4" : tone === "cool" ? "#173a5c" : "#5e2a0e", textTransform: "uppercase"}}>{text}</div>
    </div>
  );
};

/** Catmull-Rom sampling of a polyline */
const crSample = (pts: Pt[], n = 12): Pt[] => {
  const P = [pts[0], ...pts, pts[pts.length - 1]], out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [P[i], P[i + 1], P[i + 2], P[i + 3]];
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};

/** A ribbon arrow that grows along `pts` (p 0..1), with a lit core, drifting flow dots and a soft shadow. */
export const FlowArrow: React.FC<{pts: Pt[]; f: number; p?: number; w?: number; c1: string; c2?: string; dark?: string; speed?: number; op?: number; head?: boolean}> =
  ({pts, f, p = 1, w = 26, c1, c2, dark, speed = 1, op = 1, head = true}) => {
  if (p <= 0.002 || op <= 0.002) return null;
  const S = crSample(pts), cum = [0];
  for (let i = 1; i < S.length; i++) cum.push(cum[i - 1] + Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1]));
  const L = cum[cum.length - 1], hs = head ? w * 1.75 : 0, Lt = Math.max(1, (L - hs * 0.85) * p);
  const q: Pt[] = [S[0]];
  for (let i = 1; i < S.length; i++) {
    if (cum[i] <= Lt) q.push(S[i]);
    else { const u = (Lt - cum[i - 1]) / Math.max(1e-6, cum[i] - cum[i - 1]); q.push([lerp(S[i - 1][0], S[i][0], u), lerp(S[i - 1][1], S[i][1], u)]); break; }
  }
  const d = q.map((a, i) => `${i ? "L" : "M"}${a[0].toFixed(1)},${a[1].toFixed(1)}`).join(" ");
  const e = q[q.length - 1], b = q[Math.max(0, q.length - 3)], ang = Math.atan2(e[1] - b[1], e[0] - b[0]), ux = Math.cos(ang), uy = Math.sin(ang);
  const edge = dark ?? "#5a2a10", core = c2 ?? c1;
  const tip: Pt = [e[0] + ux * hs, e[1] + uy * hs], l: Pt = [e[0] - uy * hs * 0.62, e[1] + ux * hs * 0.62], r: Pt = [e[0] + uy * hs * 0.62, e[1] - ux * hs * 0.62];
  const hp = head ? clamp(p * 6) : 0;
  return (
    <g opacity={op} style={{filter: "drop-shadow(0 7px 8px rgba(50,26,8,.34))"}}>
      <path d={d} fill="none" stroke={edge} strokeWidth={w + 5} strokeLinecap="round" strokeLinejoin="round" opacity={0.9}/>
      <path d={d} fill="none" stroke={c1} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"/>
      <path d={d} fill="none" stroke={core} strokeWidth={w * 0.42} strokeLinecap="round" strokeLinejoin="round" opacity={0.65} transform="translate(0 -1.5)"/>
      <path d={d} fill="none" stroke="#fff" strokeWidth={w * 0.2} strokeLinecap="round" strokeDasharray="0.1 38" strokeDashoffset={-f * 1.5 * speed} opacity={0.85}/>
      {head && hp > 0.02 && (
        <g opacity={hp}>
          <polygon points={`${tip[0]},${tip[1]} ${l[0]},${l[1]} ${r[0]},${r[1]}`} fill={edge} stroke={edge} strokeWidth={6} strokeLinejoin="round" opacity={0.9}/>
          <polygon points={`${tip[0]},${tip[1]} ${l[0]},${l[1]} ${r[0]},${r[1]}`} fill={c1} stroke={c1} strokeWidth={1.5} strokeLinejoin="round"/>
        </g>
      )}
    </g>
  );
};

export const Sun: React.FC<{x: number; y: number; r?: number; f: number; glow?: number}> = ({x, y, r = 60, f, glow = 1}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r * 4.2} fill="url(#ak-sunglow)" opacity={0.85 * glow}/>
    {Array.from({length: 16}).map((_, i) => <path key={i} d={`M0,${-r * 1.28} V${-r * (i % 2 ? 1.5 : 1.78)}`} stroke="#f6b73c" strokeWidth={i % 2 ? 4 : 6} strokeLinecap="round" opacity={0.75} transform={`rotate(${i * 22.5 + f * 0.25})`}/>)}
    <circle r={r} fill="url(#ak-sundisc)" stroke="#e8a02a" strokeWidth={2}/>
    <circle cx={-r * 0.3} cy={-r * 0.3} r={r * 0.34} fill="#fffbe6" opacity={0.7}/>
  </g>
);

export const Cloud: React.FC<{x: number; y: number; s?: number; a?: number; f?: number; speed?: number; seed?: number}> = ({x, y, s = 1, a = 0.95, f = 0, speed = 0.3, seed = 1}) => {
  const r = rng(seed * 97 + 5), n = 6, puffs = Array.from({length: n}, (_, i) => ({cx: (i - (n - 1) / 2) * 46 + (r() - 0.5) * 18, cy: -Math.sin((i / (n - 1)) * Math.PI) * 34 + (r() - 0.5) * 12, rr: 38 + Math.sin((i / (n - 1)) * Math.PI) * 26 + r() * 10}));
  const dx = ((f * speed + seed * 400) % 2300) - 200;
  return (
    <g transform={`translate(${x + dx} ${y}) scale(${s})`} opacity={a}>
      <ellipse cx={0} cy={44} rx={170} ry={20} fill="#b5c4d8" opacity={0.35} filter="url(#ak-blur8)"/>
      {puffs.map((p, i) => <circle key={i} cx={p.cx} cy={p.cy} r={p.rr} fill="url(#ak-cloud)"/>)}
    </g>
  );
};

/** layered rolling hills with haze: far = paler and bluer */
export const Hills: React.FC<{id: string; base: number; amp: number; top: string; bottom: string; seed?: number; wl?: number; bottomY?: number; shift?: number}> = ({id, base, amp, top, bottom, seed = 1, wl = 380, bottomY = H + 40, shift = 0}) => {
  let d = `M-60,${bottomY}`;
  for (let x = -60; x <= W + 60; x += 30) { const xx = x + shift; d += ` L${x},${(base - amp * (0.5 + 0.5 * Math.sin(xx / wl + seed)) - amp * 0.4 * Math.sin(xx / (wl * 0.43) + seed * 2.1)).toFixed(1)}`; }
  d += ` L${W + 60},${bottomY} Z`;
  return (<g><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top}/><stop offset="1" stopColor={bottom}/></linearGradient></defs><path d={d} fill={`url(#${id})`}/></g>);
};

export const Tree: React.FC<{x: number; y: number; s?: number; bend?: number; f: number; seed?: number; hue?: number}> = ({x, y, s = 1, bend = 0, f, seed = 1, hue = 0}) => {
  const r = rng(seed * 53 + 9);
  const blobs = Array.from({length: 8}, (_, i) => ({cx: (r() - 0.5) * 120, cy: -190 - r() * 80 - (i > 4 ? 40 : 0), rr: 40 + r() * 26}));
  const sway = Math.sin(f / 17 + seed) * 1.4, flutter = Math.sin(f / 9 + seed * 2);
  return (
    <g transform={`translate(${x} ${y}) rotate(${bend + sway}) scale(${s})`}>
      <ellipse cx={20} cy={4} rx={90} ry={12} fill="#2a1a0c" opacity={0.2} transform={`skewX(${-bend})`}/>
      <path d="M-11,2 Q-8,-90 -5,-170 L7,-170 Q10,-90 15,2 Z" fill="#6b4a2c" stroke="#3f2a16" strokeWidth={1.5}/>
      <path d="M2,2 Q4,-90 3,-170 L7,-170 Q10,-90 15,2 Z" fill="#3f2a16" opacity={0.35}/>
      <path d="M-4,-120 Q-30,-150 -52,-176" stroke="#5a3d22" strokeWidth={7} fill="none" strokeLinecap="round"/>
      <g transform={`translate(${flutter * 2} ${flutter})`}>
        {blobs.map((b, i) => <circle key={`d${i}`} cx={b.cx + 6} cy={b.cy + 12} r={b.rr} fill={`hsl(${128 + hue} 38% 24%)`}/>)}
        {blobs.map((b, i) => <circle key={`m${i}`} cx={b.cx} cy={b.cy} r={b.rr * 0.94} fill={`hsl(${112 + hue} 42% 38%)`}/>)}
        {blobs.map((b, i) => <circle key={`h${i}`} cx={b.cx - b.rr * 0.22} cy={b.cy - b.rr * 0.26} r={b.rr * 0.55} fill={`hsl(${88 + hue} 52% 55%)`} opacity={0.8}/>)}
      </g>
    </g>
  );
};

const SKIN: [string, string][] = [["#e0b48a", "#b9835a"], ["#c68f64", "#94603c"], ["#a9744a", "#7a4a2c"], ["#d8a47a", "#a8754f"]];
const SHIRT: [string, string][] = [["#d9b26a", "#a5782e"], ["#6c8fb5", "#41607f"], ["#c0603d", "#8c3a22"], ["#7fa58a", "#4d7358"], ["#e8dcc4", "#b8a888"], ["#9a6fa0", "#6a4472"], ["#d98a8a", "#a65a5a"]];
const PANTS = ["#3d4658", "#5a4a3a", "#2e3a35", "#6b5b4a", "#3a3f52"];
const HAIR = ["#1a120d", "#2b1d14", "#3a2a1c", "#8a8a86"];

/** an adult, front view, 7.5 heads tall; unit height 100, feet at the origin, scaled to height h */
export const Person: React.FC<{x: number; y: number; h: number; f: number; seed: number; walk?: boolean; ph?: number; op?: number; flip?: boolean}> = ({x, y, h, f, seed, walk = false, ph = 0, op = 1, flip = false}) => {
  const r = rng(seed * 977 + 13), sk = SKIN[Math.floor(r() * SKIN.length)], sh = SHIRT[Math.floor(r() * SHIRT.length)], pa = PANTS[Math.floor(r() * PANTS.length)], hr = HAIR[Math.floor(r() * HAIR.length)];
  const female = r() < 0.4, bald = !female && r() < 0.12;
  const t = (f + ph) / 5.4, sw = walk ? Math.sin(t) * 0.4 : Math.sin(f / 44 + ph) * 0.025, bob = walk ? -Math.abs(Math.cos(t)) * 1.3 : -Math.sin(f / 23 + ph) * 0.3;
  const deg = 57.3, hem = female ? -30 : -50;
  return (
    <g transform={`translate(${x} ${y}) scale(${(h / 100) * (flip ? -1 : 1)} ${h / 100})`} opacity={op}>
      <ellipse cx={0} cy={0.5} rx={15} ry={2.8} fill="#2a1808" opacity={0.26}/>
      <g transform={`translate(0 ${bob})`}>
        {female && <path d="M-6.4,-97 Q-8.6,-82 -6.4,-72 L6.4,-72 Q8.6,-82 6.4,-97 Z" fill={hr}/>}
        {[-1, 1].map((sd) => (
          <g key={`l${sd}`} transform={`translate(${sd * 3.8} -48) rotate(${sd * sw * deg})`}>
            <path d="M-3.7,0 L3.7,0 L2.8,43 L-2.8,43 Z" fill={pa}/>
            <path d="M0.4,0 L3.7,0 L2.8,43 L0.4,43 Z" fill="#000" opacity={0.2}/>
            <ellipse cx={sd * 0.4 + 0.8} cy={45.2} rx={4.7} ry={2.3} fill="#2a1d16"/>
          </g>
        ))}
        <path d={`M-8.6,-83 Q-10.5,-66 ${female ? -11.5 : -8.2},${hem} L${female ? 11.5 : 8.2},${hem} Q10.5,-66 8.6,-83 Q0,-86.6 -8.6,-83 Z`} fill={sh[0]} stroke={sh[1]} strokeWidth={0.5}/>
        <path d={`M1,-85 Q8,-86 8.6,-83 Q10.5,-66 ${female ? 11.5 : 8.2},${hem} L1,${hem} Z`} fill={sh[1]} opacity={0.38}/>
        <path d="M-3.2,-85.5 Q0,-80.5 3.2,-85.5" stroke={sh[1]} strokeWidth={0.8} fill="none"/>
        {female && <path d="M-9.5,-80 Q0,-64 9.5,-78" stroke={sh[1]} strokeWidth={1.6} fill="none" opacity={0.7}/>}
        {[-1, 1].map((sd) => (
          <g key={`a${sd}`} transform={`translate(${sd * 9.4} -81) rotate(${-sd * sw * deg * 0.9 + sd * 3.5})`}>
            <path d="M-2.8,0 Q-3.1,10 -2.5,19 L2.5,19 Q3.1,10 2.8,0 Z" fill={sh[0]} stroke={sh[1]} strokeWidth={0.4}/>
            <path d="M-2.1,19 L2.1,19 L1.7,35 L-1.7,35 Z" fill={sk[0]}/>
            <path d="M0.2,19 L2.1,19 L1.7,35 L0.2,35 Z" fill={sk[1]} opacity={0.35}/>
            <ellipse cx={0} cy={36.8} rx={2.1} ry={2.7} fill={sk[0]}/>
          </g>
        ))}
        <rect x={-2.3} y={-89} width={4.6} height={6.4} rx={1.5} fill={sk[1]}/>
        <ellipse cx={0} cy={-94.2} rx={5.2} ry={6.4} fill={sk[0]}/>
        <path d="M1.4,-100.4 Q6.2,-97 5.2,-91 Q4,-88 1.4,-87.8 Z" fill={sk[1]} opacity={0.3}/>
        {!bald && <path d={`M-5.7,-94.5 Q-5.9,-102.6 0,-102 Q5.9,-102.6 5.7,-94.5 Q3.2,-99 0,-98.4 Q-3.2,-99 -5.7,-94.5 Z`} fill={hr}/>}
        <ellipse cx={-5.2} cy={-93.6} rx={0.9} ry={1.6} fill={sk[1]}/><ellipse cx={5.2} cy={-93.6} rx={0.9} ry={1.6} fill={sk[1]}/>
        <path d="M-3.2,-96.2 L-1.3,-96.4 M1.3,-96.4 L3.2,-96.2" stroke={hr} strokeWidth={0.55} strokeLinecap="round"/>
        <ellipse cx={-2.1} cy={-95} rx={0.62} ry={0.4} fill="#2a1a10"/><ellipse cx={2.1} cy={-95} rx={0.62} ry={0.4} fill="#2a1a10"/>
        <path d="M-0.1,-94.2 Q0.7,-92.6 -0.1,-91.8" stroke={sk[1]} strokeWidth={0.5} fill="none"/>
        <path d="M-1.9,-90.4 Q0,-89.6 1.9,-90.4" stroke="#7a3d2a" strokeWidth={0.55} fill="none" strokeLinecap="round"/>
      </g>
    </g>
  );
};

/** a wavy rising shimmer line */
export const Shimmer: React.FC<{x: number; y: number; hgt: number; f: number; k: number; col?: string; w?: number}> = ({x, y, hgt, f, k, col = "#d8481f", w = 5}) => {
  const u = (f * 0.012 + k) % 1, yy = y - u * hgt, a = Math.min(1, u * 5, (1 - u) * 4);
  return <path d={`M${x},${yy} q14,-18 0,-36 q-14,-18 0,-36`} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" opacity={0.7 * a}/>;
};
