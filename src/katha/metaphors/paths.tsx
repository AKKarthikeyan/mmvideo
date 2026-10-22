// Katha metaphor scenes: paths (22 Oct 2026). The two roads at dusk, one climbing between lamps to the light, one sloping
// down through the three gates of desire, anger and greed (16.1-24, 16.21); the three gunas as three lights over dark water
// (14; "released" 14.20, "faith" 17); the ashvattha, the eternal tree with roots above and branches below (15.1-3; "cut");
// the wheel of sacrifice set turning: sacrifice, rain, grain, food (3.14-16).
// Lamplight: near-black silhouettes, a thin warm rim on the side facing the light, light the only colour. Every glow, haze
// and smoke is a radial or linear gradient (no blur or turbulence filters: long software renders dropped tiles under them).
// Props: s.mood (optional), s.variant (optional), s.labels (optional words, never hard-coded), s.light (two-roads only).
import React, {useId} from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {K, W, H, CAPS} from "../look";
import {SceneP, Frame, push} from "../stage";
import {Sky, Dust, Mood} from "../sky";
import {smooth, ribbon, rnd, lerp, clamp01, nrmAt, sampleCubics, Pt} from "../geom";
import {Rimmed, Bird} from "../sil";

type V2 = [number, number];
// ---------- small helpers ----------
const ease = (f: number, a: number, d: number) => interpolate(f, [a, a + Math.max(0.001, d)], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
const sstep = (v: number) => { const t = clamp01(v); return t * t * (3 - 2 * t); };
const bump = (v: number, c: number, w: number) => Math.exp(-Math.pow((v - c) / w, 2));
// Smooth 1D noise from a few incommensurate sines, in about [-1, 1].
const wob = (t: number, s = 0) => Math.sin(t + s * 1.7) * 0.5 + Math.sin(t * 2.31 + s * 3.1) * 0.3 + Math.sin(t * 4.07 + s * 5.3) * 0.2;
const useUid = () => "pa" + useId().replace(/[^a-zA-Z0-9]/g, "");
const MOODS: Mood[] = ["dusk", "dawn", "night", "gold"];
const moodOf = (s: any, d: Mood): Mood => (MOODS.includes(s?.mood) ? s.mood : d);
const labelsOf = (s: any): string[] => (Array.isArray(s?.labels) ? s.labels.map((x: any) => (x == null ? "" : String(x))) : []);
const n1 = (v: number) => v.toFixed(1);
const ridge = (pts: Pt[], yb = H + 80): string => `${smooth(pts, false)} L ${pts[pts.length - 1][0]} ${yb} L ${pts[0][0]} ${yb} Z`;
const circ = (x: number, y: number, r: number) => `M ${n1(x - r)} ${n1(y)} a ${n1(r)} ${n1(r)} 0 1 0 ${n1(2 * r)} 0 a ${n1(r)} ${n1(r)} 0 1 0 ${n1(-2 * r)} 0 Z`;
const hex = (c: string): number[] => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => { const A = hex(a), B = hex(b), u = clamp01(t); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, "0")).join(""); };
const polar = (cx: number, cy: number, r: number, degFromTop: number): V2 => { const a = (degFromTop * Math.PI) / 180; return [cx + Math.sin(a) * r, cy - Math.cos(a) * r]; };
// Arc-length helpers over a sampled polyline.
const cumLen = (pts: number[][]) => { const c = [0]; for (let i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return c; };
const idxAt = (cum: number[], s: number) => { let i = 0; while (i < cum.length - 2 && cum[i + 1] < s) i++; return i; };

// ---------- shared soft lights ----------
const PaDefs: React.FC = () => (
  <defs>
    <radialGradient id="pa-warm"><stop offset="0" stopColor="#FFEFC4" stopOpacity={0.8}/><stop offset="0.18" stopColor="#FFC877" stopOpacity={0.42}/><stop offset="0.48" stopColor="#F0904A" stopOpacity={0.13}/><stop offset="1" stopColor="#C2553A" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-soft"><stop offset="0" stopColor="#FFC877" stopOpacity={0.5}/><stop offset="0.5" stopColor="#E8904A" stopOpacity={0.18}/><stop offset="1" stopColor="#C2553A" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-pool"><stop offset="0" stopColor="#F5A85A" stopOpacity={0.6}/><stop offset="0.4" stopColor="#D0703A" stopOpacity={0.24}/><stop offset="1" stopColor="#8E3D52" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-shade"><stop offset="0" stopColor="#030108" stopOpacity={0.85}/><stop offset="0.55" stopColor="#030108" stopOpacity={0.4}/><stop offset="1" stopColor="#030108" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-ember"><stop offset="0" stopColor="#C0482C" stopOpacity={0.62}/><stop offset="0.35" stopColor="#7E2632" stopOpacity={0.3}/><stop offset="1" stopColor="#3A1030" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-mist"><stop offset="0" stopColor="#5A4878" stopOpacity={0.45}/><stop offset="0.6" stopColor="#3A2C58" stopOpacity={0.18}/><stop offset="1" stopColor="#3A2C58" stopOpacity={0}/></radialGradient>
    <linearGradient id="pa-flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#FF8A3A" stopOpacity={0.3}/><stop offset="0.15" stopColor="#FFB45A"/><stop offset="0.45" stopColor="#FFE2A0"/><stop offset="0.8" stopColor="#FFB451"/><stop offset="1" stopColor="#F07A35" stopOpacity={0.8}/></linearGradient>
    {/* guna lights: a wide glow and a tight soft fringe for each */}
    <radialGradient id="pa-g-sat"><stop offset="0" stopColor="#FFF8E2" stopOpacity={0.85}/><stop offset="0.16" stopColor="#FFE6B0" stopOpacity={0.42}/><stop offset="0.45" stopColor="#F2C47A" stopOpacity={0.12}/><stop offset="1" stopColor="#E8B65A" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-s-sat"><stop offset="0" stopColor="#FFF4D6" stopOpacity={0.6}/><stop offset="0.5" stopColor="#FFDCA0" stopOpacity={0.2}/><stop offset="1" stopColor="#F2C47A" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-g-raj"><stop offset="0" stopColor="#FFB070" stopOpacity={0.8}/><stop offset="0.16" stopColor="#F06A34" stopOpacity={0.4}/><stop offset="0.45" stopColor="#C2402A" stopOpacity={0.13}/><stop offset="1" stopColor="#8E2A2A" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-s-raj"><stop offset="0" stopColor="#FF9A5A" stopOpacity={0.6}/><stop offset="0.5" stopColor="#E0502A" stopOpacity={0.22}/><stop offset="1" stopColor="#B0302A" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-g-tam"><stop offset="0" stopColor="#8E84C8" stopOpacity={0.6}/><stop offset="0.2" stopColor="#5A4E9A" stopOpacity={0.3}/><stop offset="0.5" stopColor="#3A2E70" stopOpacity={0.1}/><stop offset="1" stopColor="#2A2050" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-s-tam"><stop offset="0" stopColor="#7A70B8" stopOpacity={0.5}/><stop offset="0.5" stopColor="#4A3E88" stopOpacity={0.2}/><stop offset="1" stopColor="#2A2050" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-smoke-t"><stop offset="0" stopColor="#5E5688" stopOpacity={0.8}/><stop offset="0.5" stopColor="#443C68" stopOpacity={0.5}/><stop offset="1" stopColor="#2A2644" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-smoke-d"><stop offset="0" stopColor="#1A1628" stopOpacity={0.9}/><stop offset="0.55" stopColor="#1A1628" stopOpacity={0.55}/><stop offset="1" stopColor="#1A1628" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-smoke-r"><stop offset="0" stopColor="#B8624A" stopOpacity={0.6}/><stop offset="0.5" stopColor="#8A4044" stopOpacity={0.3}/><stop offset="1" stopColor="#5A2A3A" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-smoke-s"><stop offset="0" stopColor="#E8D8B8" stopOpacity={0.45}/><stop offset="0.5" stopColor="#C8B898" stopOpacity={0.18}/><stop offset="1" stopColor="#A89878" stopOpacity={0}/></radialGradient>
    <radialGradient id="pa-clear"><stop offset="0" stopColor="#FFFFFF" stopOpacity={0.95}/><stop offset="0.08" stopColor="#FFF6DE" stopOpacity={0.7}/><stop offset="0.3" stopColor="#FFE2A8" stopOpacity={0.25}/><stop offset="1" stopColor="#F2C47A" stopOpacity={0}/></radialGradient>
  </defs>
);

// ---------- the flame ----------
// Outline of a flame standing on (x, y), height h, half-width w; it bends with lean and sways by sway (a wave up the flame).
const flameD = (x: number, y: number, h: number, w: number, lean = 0, sway = 0, t = 0): string => {
  const N = 12, L: Pt[] = [], R: Pt[] = [];
  let tip: Pt = [x, y - h, "c"];
  for (let i = 1; i <= N; i++) {
    const u = i / N;
    const hw = u < 0.24 ? w * Math.sqrt(Math.max(0, 1 - Math.pow((0.24 - u) / 0.24, 2))) : w * Math.pow((1 - u) / 0.76, 1.15);
    const cx = x + lean * h * u * u + sway * h * Math.pow(u, 1.6) * Math.sin(t - u * 3.2), cy = y - h * u;
    if (i === N) { tip = [cx, cy, "c"]; continue; }
    L.push([cx - hw, cy]); R.push([cx + hw, cy]);
  }
  return smooth([[x, y + w * 0.08], ...R, tip, ...L.reverse()] as Pt[]);
};
type Pal = {glow: string; soft: string; fringe: string; stops: [number, string, number][]; core: string};
const PALS: Record<string, Pal> = {
  lamp: {glow: "pa-warm", soft: "pa-soft", fringe: "#FFB45A", stops: [[0, "#FF8A3A", 0.25], [0.14, "#FFB45A", 0.95], [0.42, "#FFDE96", 1], [0.78, "#FFB451", 1], [1, "#F07A35", 0.8]], core: "#FFFDF0"},
  sattva: {glow: "pa-g-sat", soft: "pa-s-sat", fringe: "#FFF0C8", stops: [[0, "#FFD58A", 0.3], [0.14, "#FFE7B0", 0.95], [0.45, "#FFFBEA", 1], [0.8, "#FFE3A0", 1], [1, "#F6C468", 0.85]], core: "#FFFFFF"},
  rajas: {glow: "pa-g-raj", soft: "pa-s-raj", fringe: "#FF5A26", stops: [[0, "#C8301C", 0.35], [0.14, "#F0502A", 0.95], [0.4, "#FF9A48", 1], [0.75, "#F2602A", 1], [1, "#B8281A", 0.85]], core: "#FFD9A0"},
  tamas: {glow: "pa-g-tam", soft: "pa-s-tam", fringe: "#4A3C88", stops: [[0, "#1E1838", 0.4], [0.2, "#3A2E70", 0.9], [0.5, "#6A5CA8", 0.95], [0.85, "#3E3278", 0.9], [1, "#221A44", 0.7]], core: "#B0A8E0"},
};
// A flame: wide glow, soft fringe, two translucent outer fringes, the body and its pale core. b: brightness 0..1+.
const Flame: React.FC<{x: number; y: number; h: number; w?: number; lean?: number; sway?: number; t?: number; b?: number; halo?: number; pal?: Pal}> =
  ({x, y, h, w = h * 0.2, lean = 0, sway = 0, t = 0, b = 1, halo = 1, pal = PALS.lamp}) => {
  const id = useUid();
  if (b <= 0.001 || h < 0.5) return null;
  const tip = [x + lean * h, y - h];
  return (
    <g>
      <defs>
        <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1={x} y1={y + 2} x2={tip[0]} y2={tip[1]}>{pal.stops.map(([o, c, a], i) => <stop key={i} offset={o} stopColor={c} stopOpacity={a}/>)}</linearGradient>
        <radialGradient id={`${id}c`} gradientUnits="userSpaceOnUse" cx={x + lean * h * 0.1} cy={y - h * 0.22} r={h * 0.5}><stop offset="0" stopColor={pal.core}/><stop offset="0.55" stopColor={pal.core} stopOpacity={0.75}/><stop offset="1" stopColor={pal.core} stopOpacity={0}/></radialGradient>
      </defs>
      {halo > 0 ? <ellipse cx={x + lean * h * 0.4} cy={y - h * 0.45} rx={h * 5} ry={h * 5} fill={`url(#${pal.glow})`} opacity={Math.min(1, halo * b)}/> : null}
      <ellipse cx={x + lean * h * 0.3} cy={y - h * 0.42} rx={h * 1.1} ry={h * 1.3} fill={`url(#${pal.soft})`} opacity={Math.min(1, 0.9 * b)}/>
      <g opacity={Math.min(1, b * 1.1)}>
        <path d={flameD(x, y + h * 0.05, h * 1.16, w * 2, lean, sway, t)} fill={pal.fringe} opacity={0.13}/>
        <path d={flameD(x, y + h * 0.03, h * 1.07, w * 1.42, lean, sway, t)} fill={pal.fringe} opacity={0.25}/>
        <path d={flameD(x, y, h, w, lean, sway, t)} fill={`url(#${id}g)`}/>
        <path d={flameD(x, y - h * 0.03, h * 0.62, w * 0.58, lean * 0.7, sway * 0.7, t)} fill={`url(#${id}c)`}/>
      </g>
    </g>
  );
};
// Grass blades along a base line as one path (dark foreground, out of the light).
const grassD = (x0: number, x1: number, yb: number, count: number, h0: number, h1: number, seed: number, f: number): string => {
  let d = "";
  for (let i = 0; i < count; i++) {
    const x = x0 + rnd(i, seed) * (x1 - x0), h = h0 + rnd(i, seed + 1) * (h1 - h0);
    const lean = (rnd(i, seed + 2) - 0.5) * 0.9 + Math.sin(f / 40 + i * 0.7) * 0.05;
    const pts = sampleCubics([[x, yb + 8], [x + lean * h * 0.1, yb - h * 0.4], [x + lean * h * 0.5, yb - h * 0.8], [x + lean * h, yb - h]], 6);
    d += ribbon(pts, 4 + rnd(i, seed + 4) * 4, 0.6, 1) + " ";
  }
  return d;
};

// =====================================================================================================================
// TWO ROADS (16): a fork on a wide plain at dusk. The left road climbs a gentle hill between small lamps to the light on
// its crest; the right road runs to the brink and drops into shadow through three dark gates (16.21: desire, anger, greed).
// s.labels: words for the three gates (small Cinzel on their lintels); s.light: a word over the light.
// =====================================================================================================================
const SKYLINE: Pt[] = [[-60, 714], [90, 686], [230, 638], [370, 592], [490, 562], [575, 550], [640, 549], [720, 558], [820, 584], [910, 614], [990, 636], [1070, 642], [1180, 628], [1300, 610], [1420, 618], [1540, 600], [1660, 612], [1780, 598], [1900, 606], [1990, 602]];
// The skyline's height at x (piecewise linear between its points: close enough for grass on the crest).
const skyAt = (x: number) => { for (let i = 0; i < SKYLINE.length - 1; i++) { const a = SKYLINE[i], b = SKYLINE[i + 1]; if (x >= a[0] && x <= b[0]) return lerp(a[1], b[1], (x - a[0]) / (b[0] - a[0])); } return SKYLINE[SKYLINE.length - 1][1]; };
// Fine grass along the crest, dark against the light behind it.
const crestGrass = (x0: number, x1: number, count: number, f: number): string => {
  let d = "";
  for (let i = 0; i < count; i++) {
    const x = x0 + rnd(i, 201) * (x1 - x0), yb = skyAt(x) + 3, h = 6 + rnd(i, 202) * 16 * (1 - Math.abs(x - 604) / 700), lean = (rnd(i, 203) - 0.5) * 0.8 + Math.sin(f / 35 + i * 0.4) * 0.08;
    d += ribbon(sampleCubics([[x, yb], [x + lean * h * 0.2, yb - h * 0.45], [x + lean * h * 0.6, yb - h * 0.85], [x + lean * h, yb - h]], 4), 2.2, 0.4, 1) + " ";
  }
  return d;
};
// A lone umbrella acacia on the crest: a leaning trunk, a fan of limbs, two flat layered crowns with ragged undersides.
const acaciaD = (x: number, y: number, h: number): string[] => {
  const out: string[] = [];
  const fork: number[] = [x + h * 0.06, y - h * 0.46];
  out.push(ribbon(sampleCubics([[x - h * 0.02, y + 4], [x, y - h * 0.16], [x + h * 0.05, y - h * 0.3], fork], 8), h * 0.075, h * 0.045, 1));
  ([[-0.42, -0.8], [-0.14, -0.86], [0.2, -0.88], [0.5, -0.78], [0.66, -0.74]] as number[][]).forEach(([dx, dy], i) => {
    const ex = x + dx * h, ey = y + dy * h;
    out.push(ribbon(sampleCubics([fork, [lerp(fork[0], ex, 0.3) + (i - 2) * 3, lerp(fork[1], ey, 0.45)], [lerp(fork[0], ex, 0.7), lerp(fork[1], ey, 0.85)], [ex, ey]], 6), h * 0.032, h * 0.012, 1));
  });
  const crown = (cx: number, cy: number, w: number, hh: number, seed: number) => {
    const P: Pt[] = [];
    for (let k = 0; k <= 16; k++) { const u = k / 16, a = Math.PI * (1 - u); P.push([cx + Math.cos(a) * w, cy - Math.sin(a) * hh * (0.75 + 0.25 * rnd(k, seed)) - (k % 2) * hh * 0.08]); }
    for (let k = 1; k < 22; k++) { const u = 1 - k / 22; P.push([cx - w + 2 * w * u + (rnd(k, seed + 1) - 0.5) * 6, cy + (k % 2 ? hh * 0.12 + rnd(k, seed + 2) * hh * 0.25 : 0)]); }
    return smooth(P);
  };
  out.push(crown(x - h * 0.12, y - h * 0.84, h * 0.5, h * 0.14, 211), crown(x + h * 0.32, y - h * 0.8, h * 0.44, h * 0.12, 223), crown(x + h * 0.08, y - h * 0.94, h * 0.34, h * 0.1, 237));
  return out;
};
const NEAR: Pt[] = [[-60, 772], [260, 754], [560, 740], [820, 730], [1000, 728], [1160, 734], [1340, 744], [1540, 750], [1760, 756], [1990, 760]];
// A stone gate: two piers, a pointed arch, a cornice, the lintel band (for the word), a stepped crown. Base centre (cx, by).
const gateD = (cx: number, by: number, h: number): string => {
  const hw = h * 0.3, ohw = h * 0.155, top = by - h * 0.8;
  const tiers: [number, number, number][] = [[hw + h * 0.035, top, top - h * 0.04], [hw + h * 0.008, top - h * 0.04, top - h * 0.15], [hw + h * 0.03, top - h * 0.15, top - h * 0.19], [hw * 0.74, top - h * 0.19, top - h * 0.232], [hw * 0.48, top - h * 0.232, top - h * 0.27]];
  const Lp: number[][] = [[cx - hw, by], [cx - hw, top]];
  tiers.forEach(([w, y0, y1]) => { Lp.push([cx - w, y0], [cx - w, y1]); });
  const Rp = Lp.map(([x, y]) => [2 * cx - x, y]).reverse();
  let d = `M ${[...Lp, ...Rp].map((p) => `${n1(p[0])} ${n1(p[1])}`).join(" L ")} Z`;
  const fy = top - h * 0.27, k = h * 0.02;
  d += " " + smooth([[cx - 2.6 * k, fy, "c"], [cx - 2.9 * k, fy - 1.1 * k], [cx - 1.5 * k, fy - 2.1 * k], [cx - 0.4 * k, fy - 2.5 * k], [cx, fy - 4.4 * k, "c"], [cx + 0.4 * k, fy - 2.5 * k], [cx + 1.5 * k, fy - 2.1 * k], [cx + 2.9 * k, fy - 1.1 * k], [cx + 2.6 * k, fy, "c"]]);
  // small pointed niches pierced through the piers, three round holes in the crown: the glow beyond shows through
  [-1, 1].forEach((sd) => { const nx = cx + sd * h * 0.228, nw = h * 0.026, n0 = by - h * 0.3, n1y = by - h * 0.44;
    d += ` M ${n1(nx - nw)} ${n1(n0)} L ${n1(nx - nw)} ${n1(n1y)} Q ${n1(nx - nw)} ${n1(n1y - h * 0.035)} ${n1(nx)} ${n1(n1y - h * 0.05)} Q ${n1(nx + nw)} ${n1(n1y - h * 0.035)} ${n1(nx + nw)} ${n1(n1y)} L ${n1(nx + nw)} ${n1(n0)} Z`; });
  [-1, 0, 1].forEach((k) => { d += " " + circ(cx + k * h * 0.07, top - h * 0.212, h * 0.011); });
  const sp = by - h * 0.46, ap = by - h * 0.715;
  d += ` M ${n1(cx - ohw)} ${n1(by)} L ${n1(cx - ohw)} ${n1(sp)} C ${n1(cx - ohw)} ${n1(sp - h * 0.13)} ${n1(cx - ohw * 0.35)} ${n1(ap + h * 0.05)} ${n1(cx)} ${n1(ap)} C ${n1(cx + ohw * 0.35)} ${n1(ap + h * 0.05)} ${n1(cx + ohw)} ${n1(sp - h * 0.13)} ${n1(cx + ohw)} ${n1(sp)} L ${n1(cx + ohw)} ${n1(by)} Z`;
  return d;
};
// Carved lines on a gate's face: the arch moulding, the edges of the lintel band, the pier bases.
const gateLines = (cx: number, by: number, h: number): string => {
  const hw = h * 0.3, o = h * 0.185, sp = by - h * 0.46, ap = by - h * 0.75, top = by - h * 0.8;
  return `M ${n1(cx - o)} ${n1(by)} L ${n1(cx - o)} ${n1(sp)} C ${n1(cx - o)} ${n1(sp - h * 0.15)} ${n1(cx - o * 0.35)} ${n1(ap + h * 0.05)} ${n1(cx)} ${n1(ap)} C ${n1(cx + o * 0.35)} ${n1(ap + h * 0.05)} ${n1(cx + o)} ${n1(sp - h * 0.15)} ${n1(cx + o)} ${n1(sp)} L ${n1(cx + o)} ${n1(by)}`
    + ` M ${n1(cx - hw + h * 0.03)} ${n1(top - h * 0.055)} L ${n1(cx + hw - h * 0.03)} ${n1(top - h * 0.055)} M ${n1(cx - hw + h * 0.03)} ${n1(top - h * 0.135)} L ${n1(cx + hw - h * 0.03)} ${n1(top - h * 0.135)}`
    + ` M ${n1(cx - hw)} ${n1(by - h * 0.06)} L ${n1(cx - h * 0.155)} ${n1(by - h * 0.06)} M ${n1(cx + h * 0.155)} ${n1(by - h * 0.06)} L ${n1(cx + hw)} ${n1(by - h * 0.06)}`;
};
const RoadLamp: React.FC<{x: number; y: number; s: number; b: number; t: number; i: number}> = ({x, y, s, b, t, i}) => {
  const bowl = `M ${n1(x - 10 * s)} ${n1(y - 4 * s)} Q ${n1(x)} ${n1(y + 8 * s)} ${n1(x + 10 * s)} ${n1(y - 4 * s)} Q ${n1(x)} ${n1(y - 1.5 * s)} ${n1(x - 10 * s)} ${n1(y - 4 * s)} Z`;
  return (
    <g>
      <ellipse cx={x} cy={y + 2 * s} rx={56 * s} ry={15 * s} fill="url(#pa-pool)" opacity={Math.min(1, 0.8 * b)}/>
      <circle cx={x} cy={y - 10 * s} r={54 * s} fill="url(#pa-warm)" opacity={Math.min(1, 0.85 * b)}/>
      <path d={flameD(x, y - 3.5 * s, 17 * s * (0.9 + 0.1 * b), 3.6 * s, 0.05 * wob(t, i), 0.03, t)} fill="url(#pa-flame)"/>
      <ellipse cx={x} cy={y - 7.5 * s} rx={1.5 * s} ry={4 * s} fill="#FFFBEA" opacity={0.85}/>
      <path d={bowl} fill="#1C0F16"/>
      <path d={`M ${n1(x - 10 * s)} ${n1(y - 4 * s)} Q ${n1(x)} ${n1(y - 1.5 * s)} ${n1(x + 10 * s)} ${n1(y - 4 * s)}`} fill="none" stroke="#FFC877" strokeWidth={Math.max(0.6, 1.2 * s)} opacity={0.9}/>
    </g>
  );
};
const TwoRoads: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const mood = moodOf(s, "dusk");
  const sun: V2 = [604, 514];
  const labels = labelsOf(s), light = s?.light ? String(s.light) : "";
  const z = push(f, n, 1, 1.05);
  // the road comes to us from the fork; one branch climbs left to the crest, one runs right and down into the dark
  const trunkC = sampleCubics([[640, 1150], [700, 1020], [870, 930], [906, 806]], 14);
  const leftC = sampleCubics([[906, 808], [836, 790], [752, 778], [704, 750], [662, 722], [692, 692], [668, 662], [646, 632], [610, 606], [605, 582], [602, 567], [601, 557], [600, 550]], 14);
  const rightC = sampleCubics([[906, 808], [1000, 796], [1090, 790], [1166, 800], [1250, 812], [1336, 846], [1420, 882], [1504, 916], [1592, 948], [1680, 978], [1770, 1008], [1850, 1052], [1930, 1112]], 12);
  const LW0 = 120, LW1 = 5, LPW = 0.62;
  const lCum = cumLen(leftC), lLen = lCum[lCum.length - 1];
  // lamps both sides of the lit road; a wave of brightness walks up towards the light
  const lamps: {x: number; y: number; s: number; b: number; k: number}[] = [];
  const NL = 15;
  for (let k = 0; k < NL; k++) {
    const t = Math.pow((k + 0.55) / NL, 1.12), i = idxAt(lCum, t * lLen), [nx, ny] = nrmAt(leftC, i);
    const w = (LW0 + (LW1 - LW0) * Math.pow(i / (leftC.length - 1), LPW)) / 2, sc = lerp(1.1, 0.16, Math.pow(t, 0.8));
    const b = 0.82 + 0.22 * Math.sin(t * 9 - f / 11) + 0.05 * wob(f / 3, k);
    [-1, 1].forEach((side) => lamps.push({x: leftC[i][0] + nx * side * (w + 7 * sc), y: leftC[i][1] + ny * side * (w + 7 * sc), s: sc, b, k: k * 2 + (side > 0 ? 1 : 0)}));
  }
  lamps.sort((a, b) => a.y - b.y);
  // the three gates step down the dark road, each deeper in shadow
  const GATES: [number, number, number][] = [[1168, 802, 248], [1422, 884, 258], [1682, 980, 270]];
  const emberB = 0.85 + 0.15 * Math.sin(f / 37);
  const grass = grassD(-40, 430, 1080, 60, 40, 120, 3, f) + grassD(1560, 1960, 1080, 56, 40, 120, 9, f);
  return (
    <Frame f={f} zoom={z} cx={900} cy={720}>
      <PaDefs/>
      <defs>
        <linearGradient id="tr-dark" x1="0" y1="0" x2="1" y2="0"><stop offset="0.45" stopColor="#07040E" stopOpacity={0}/><stop offset="0.8" stopColor="#07040E" stopOpacity={0.45}/><stop offset="1" stopColor="#07040E" stopOpacity={0.65}/></linearGradient>
        <linearGradient id="tr-land" gradientUnits="userSpaceOnUse" x1="0" y1="540" x2="0" y2="1080"><stop offset="0" stopColor="#2E1A36"/><stop offset="0.3" stopColor="#1E1126"/><stop offset="1" stopColor="#0C0712"/></linearGradient>
        <linearGradient id="tr-vale" gradientUnits="userSpaceOnUse" x1="0" y1="600" x2="0" y2="770"><stop offset="0" stopColor="#26162F"/><stop offset="1" stopColor="#100816"/></linearGradient>
        <radialGradient id="tr-rim" gradientUnits="userSpaceOnUse" cx={sun[0]} cy={sun[1]} r={420}><stop offset="0" stopColor="#FFE6A8" stopOpacity={1}/><stop offset="0.5" stopColor="#FFC877" stopOpacity={0.5}/><stop offset="1" stopColor="#FFC877" stopOpacity={0}/></radialGradient>
        <radialGradient id="tr-pit" gradientUnits="userSpaceOnUse" cx={1900} cy={1110} r={980}><stop offset="0" stopColor="#030106" stopOpacity={0.92}/><stop offset="0.45" stopColor="#030106" stopOpacity={0.6}/><stop offset="1" stopColor="#030106" stopOpacity={0}/></radialGradient>
        <linearGradient id="tr-road" gradientUnits="userSpaceOnUse" x1="0" y1="1080" x2="0" y2="790"><stop offset="0" stopColor="#120910"/><stop offset="0.45" stopColor="#20121C"/><stop offset="0.8" stopColor="#33202E"/><stop offset="1" stopColor="#4C2E42"/></linearGradient>
        <linearGradient id="tr-rl" gradientUnits="userSpaceOnUse" x1="906" y1="808" x2="600" y2="550"><stop offset="0" stopColor="#E8A868" stopOpacity={0}/><stop offset="0.35" stopColor="#D89A62" stopOpacity={0.35}/><stop offset="1" stopColor="#FFD08A" stopOpacity={0.95}/></linearGradient>
        <linearGradient id="tr-rr" gradientUnits="userSpaceOnUse" x1="920" y1="790" x2="1800" y2="1080"><stop offset="0" stopColor="#030106" stopOpacity={0}/><stop offset="0.18" stopColor="#030106" stopOpacity={0.22}/><stop offset="0.55" stopColor="#030106" stopOpacity={0.62}/><stop offset="1" stopColor="#030106" stopOpacity={0.85}/></linearGradient>
      </defs>
      <Sky mood={mood} sun={sun} sunR={40} f={f} rays={0.48} id="tr"/>
      {/* the right half of the sky lies under heavy cloud */}
      <rect x={-40} y={-40} width={W + 80} height={H + 80} fill="url(#tr-dark)"/>
      {Array.from({length: 7}, (_, i) => <ellipse key={i} cx={1180 + i * 130 + Math.sin(f / 90 + i) * 12} cy={250 + rnd(i, 41) * 260} rx={260 + rnd(i, 42) * 160} ry={60 + rnd(i, 43) * 40} fill="url(#pa-smoke-d)" opacity={0.5}/>)}
      {/* far ridge, the land, the misty hollow beyond the plain on the right */}
      <path d={ridge([[860, 640], [990, 616], [1110, 598], [1230, 610], [1350, 588], [1490, 602], [1610, 582], [1750, 598], [1870, 588], [1990, 596]])} fill="#3A2244" opacity={0.75}/>
      <path d={ridge(SKYLINE)} fill="url(#tr-land)"/>
      <path d={smooth(SKYLINE.slice(1, 12), false)} fill="none" stroke="url(#tr-rim)" strokeWidth={2.4}/>
      <path d={crestGrass(330, 900, 150, f)} fill="#1A0E20"/>
      <Rimmed paths={acaciaD(236, skyAt(236) + 6, 178)} light={[sun[0] - 236, sun[1] - 520]} w={2} rim="#E8A868" fill="#1C1024"/>
      <path d={`${smooth([[900, 640], [1000, 650], [1120, 640], [1240, 626], [1360, 622], [1500, 616], [1640, 620], [1800, 612], [1990, 614]], false)} L 1990 790 L 900 790 Z`} fill="url(#tr-vale)"/>
      <ellipse cx={1420} cy={700} rx={640} ry={60} fill="url(#pa-mist)" opacity={0.6}/>
      <path d={ridge(NEAR)} fill="url(#tr-land)"/>
      <path d={smooth(NEAR.slice(4), false)} fill="none" stroke="#5A3446" strokeWidth={1.2} opacity={0.5}/>
      <rect x={-40} y={540} width={W + 80} height={H} fill="url(#tr-dark)" opacity={0.7}/>
      {/* warm light on the slope from the lamps and the crest; the dark and a sullen glow down where the right road goes */}
      <ellipse cx={720} cy={700} rx={420} ry={210} fill="url(#pa-pool)" opacity={0.5}/>
      {/* the roads: one dusty surface with soft edges; warmth laid on the climb, darkness on the descent */}
      {[[1.5, 0.08], [1.38, 0.1], [1.27, 0.13], [1.18, 0.17], [1.09, 0.25], [1, 1]].map(([k, o], j) => <g key={j} opacity={o}>
        <path d={ribbon(trunkC, 330 * k, 150 * k, 1.4)} fill="url(#tr-road)"/>
        <path d={ribbon(rightC, 118 * k, 128 * k, 1)} fill="url(#tr-road)"/>
        <path d={ribbon(leftC, LW0 * k, LW1 * k, LPW)} fill="url(#tr-road)"/>
      </g>)}
      <path d={ribbon(leftC, LW0, LW1, LPW)} fill="url(#tr-rl)"/>
      <rect x={880} y={700} width={1100} height={420} fill="url(#tr-rr)"/>
      {/* the three gates step down the dark road, near to far in draw order */}
      {GATES.map(([x, y, h], i) => {
        const first = i === 0;
        return <g key={i}>
          <ellipse cx={x + 30} cy={y + 4} rx={h * 0.62} ry={h * 0.06} fill="url(#pa-shade)" opacity={0.8}/>
          <Rimmed paths={[gateD(x, y, h)]} light={first ? [-1, -0.35] : [1, 0.4]} w={first ? 2.2 : 2} rim={first ? "#C88A5A" : "#B0503A"} fill={["#140A16", "#110813", "#0E0610"][i]} evenodd/>
          <path d={gateLines(x, y, h)} fill="none" stroke={first ? "#C88A5A" : "#A0503E"} strokeWidth={1} opacity={[0.3, 0.24, 0.2][i]}/>
        </g>;
      })}
      {/* down there the dark closes in: shadow over the descent, a sullen glow from below, slow dark smoke */}
      <rect x={-40} y={600} width={W + 80} height={H} fill="url(#tr-pit)"/>
      <ellipse cx={1780} cy={1090} rx={560} ry={300} fill="url(#pa-ember)" opacity={0.95 * emberB}/>
      {Array.from({length: 6}, (_, i) => { const a = ((f * 0.4 + i * 60) % 360) / 360; return <ellipse key={i} cx={1380 + i * 100 + a * 120} cy={1080 - a * 280} rx={150 + a * 130} ry={60 + a * 40} fill="url(#pa-smoke-d)" opacity={0.45 * Math.sin(Math.PI * a)}/>; })}
      {GATES.map(([x, y, h], i) => labels[i] ? (() => { const fs = Math.max(13, h * 0.06); return <text key={i} x={x} y={y - h * 0.895 + fs * 0.36} textAnchor="middle" fontFamily={CAPS} fontSize={fs} letterSpacing={fs * 0.2} fill={i === 0 ? "#E0A878" : "#D08A62"} opacity={[0.9, 0.72, 0.58][i]}>{labels[i]}</text>; })() : null)}
      {/* lamps */}
      {lamps.map((l) => <RoadLamp key={l.k} x={l.x} y={l.y} s={l.s} b={l.b} t={f / 3 + l.k} i={l.k}/>)}
      {light ? <text x={sun[0]} y={sun[1] - 86} textAnchor="middle" fontFamily={CAPS} fontSize={22} letterSpacing={6} fill={K.goldLt} opacity={0.85 * ease(f, 10, 30)}>{light}</text> : null}
      {/* a few birds flying home towards the light */}
      {[0, 1, 2].map((i) => <Bird key={i} kind="stork" x={1260 + i * 70 - f * 0.9 + (i === 1 ? 40 : 0)} y={330 + i * 26 + Math.sin(f / 40 + i) * 6} scale={0.22 - i * 0.02} f={f} speed={0.8 + i * 0.07} phase={i * 0.3} light={[sun[0] - 1100, sun[1] - 340]} fill="#24162E" flip/>)}
      <Dust f={f} sun={sun} n={120} y0={380} y1={980}/>
      {/* dark foreground: mounds and grass at the corners */}
      <path d={`M -40 1010 C 120 978 300 990 440 1040 L 440 1120 L -40 1120 Z M 1560 1050 C 1700 1000 1830 990 1960 1004 L 1960 1120 L 1560 1120 Z`} fill="#07040A"/>
      <path d={grass} fill="#07040A"/>
    </Frame>
  );
};

// =====================================================================================================================
// GUNAS (14): three lights side by side on stone posts above dark water. Sattva: a clear white-gold steady flame. Rajas:
// a restless red-orange flame throwing sparks. Tamas: a heavy, smoky, dim indigo glow. Each brightens in turn.
// variant "released" (14.20): the three lift, merge and dissolve into one clear light beyond them.
// variant "faith" (17): the three lights over three bowls of food, their three columns of smoke.
// s.labels: three words (one under each light), none by default.
// =====================================================================================================================
const GX = [560, 960, 1360];
const GCOL = ["#FFE9B8", "#FF7A40", "#7A6EC0"];
const GLAB = [K.goldLt, "#FFA070", "#A8A0D8"];
const GGLOW = ["pa-g-sat", "pa-g-raj", "pa-g-tam"];
const WATER = 622, PTOP = 556, PBASE = 770;
// A stone post standing in the water: a stepped plinth, a slim shaft, a necking and an inverted-lotus capital, the slab.
const pillarD = (x: number): string => {
  const B = PBASE, L: Pt[] = [[x - 33, B + 4, "c"], [x - 33, B - 10, "c"], [x - 26, B - 14, "c"], [x - 26, B - 22, "c"], [x - 20, B - 26, "c"], [x - 18, 612, "c"], [x - 15, 606, "c"], [x - 17, 601], [x - 24, 594], [x - 31, 586], [x - 34, 579, "c"], [x - 28, 576, "c"], [x - 28, 567, "c"], [x - 31, 566, "c"], [x - 31, PTOP, "c"]];
  const R = L.map((p) => (p[2] === "c" ? [2 * x - p[0], p[1], "c"] : [2 * x - p[0], p[1]]) as Pt).reverse();
  return smooth([...L, ...R]);
};
// Carved lines on a post (lit by its flame): bands on the shaft, the petals of the capital, two flutes.
const pillarLines = (x: number): string => {
  let d = `M ${x - 19} 690 L ${x + 19} 690 M ${x - 19} 697 L ${x + 19} 697 M ${x - 8} 612 L ${x - 9} 686 M ${x + 8} 612 L ${x + 9} 686 M ${x - 9} 701 L ${x - 10} ${PBASE - 28} M ${x + 9} 701 L ${x + 10} ${PBASE - 28}`;
  for (let k = -2; k <= 2; k++) d += ` M ${x + k * 11} 600 Q ${x + k * 13 + (k < 0 ? -4 : k > 0 ? 4 : 0)} 588 ${x + k * 14} 580`;
  return d;
};
const diyaD = (x: number, y: number, s = 1): string => smooth([[x - 34 * s, y - 16 * s], [x - 29 * s, y - 7 * s], [x - 15 * s, y - 1 * s], [x - 8 * s, y, "c"], [x + 8 * s, y, "c"], [x + 15 * s, y - 1 * s], [x + 29 * s, y - 7 * s], [x + 34 * s, y - 16 * s], [x + 42 * s, y - 21 * s, "c"], [x + 22 * s, y - 18 * s], [x, y - 17 * s], [x - 22 * s, y - 18 * s]]);
// Night water: gradient, slow ripple lines, the far shore. Reflections are added per light.
const NightWater: React.FC<{f: number; mood: Mood}> = ({f, mood}) => {
  const top = mood === "night" ? "#1E2850" : mood === "dawn" ? "#3A3C64" : "#2A1C40";
  const lines: string[] = ["", "", ""];
  for (let k = 0; k < 90; k++) {
    const v = Math.pow((k + 0.5) / 90, 1.7), y = WATER + 6 + v * (H - WATER), L = 30 + 260 * v * (0.5 + rnd(k, 61));
    const x = ((rnd(k, 62) * (W + 400) + f * (0.15 + 0.3 * rnd(k, 63))) % (W + 400)) - 200;
    lines[k % 3] += `M ${n1(x - L / 2)} ${n1(y)} L ${n1(x + L / 2)} ${n1(y)} `;
  }
  return (
    <g>
      <defs><linearGradient id="gw-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top}/><stop offset="0.12" stopColor="#141A38"/><stop offset="0.5" stopColor="#0A0D20"/><stop offset="1" stopColor="#04050C"/></linearGradient></defs>
      <rect x={-40} y={WATER} width={W + 80} height={H - WATER + 40} fill="url(#gw-w)"/>
      <path d={ridge([[-60, 614], [180, 602], [400, 608], [660, 592], [900, 604], [1160, 596], [1420, 606], [1700, 592], [1990, 604]], WATER + 2)} fill="#0A0C20"/>
      {lines.map((d, i) => <path key={i} d={d} fill="none" stroke="#8A9AD0" strokeWidth={1.2} opacity={[0.07, 0.11, 0.16][i]}/>)}
      <defs><linearGradient id="gw-mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6A74A8" stopOpacity={0}/><stop offset="0.5" stopColor="#6A74A8" stopOpacity={0.16}/><stop offset="1" stopColor="#6A74A8" stopOpacity={0}/></linearGradient></defs>
      <rect x={-40} y={WATER - 46} width={W + 80} height={92} fill="url(#gw-mist)"/>
      {/* slow wisps of mist drifting over the water */}
      {Array.from({length: 6}, (_, i) => { const x = ((rnd(i, 66) * (W + 800) + f * (0.25 + 0.15 * rnd(i, 67))) % (W + 800)) - 400; return <ellipse key={i} cx={x} cy={WATER + 14 + rnd(i, 68) * 70} rx={260 + rnd(i, 69) * 200} ry={14 + rnd(i, 70) * 12} fill="url(#pa-mist)" opacity={0.5}/>; })}
    </g>
  );
};
// The broken column of light a flame throws on the water below it.
const Reflection: React.FC<{x: number; b: number; col: string; glow?: string; jitter: number; f: number; i: number; y0?: number}> = ({x, b, col, glow, jitter, f, i, y0 = PBASE + 8}) => {
  if (b <= 0.01) return null;
  const N = 34, rects: React.ReactNode[] = [];
  for (let k = 0; k < N; k++) {
    const v = k / (N - 1), y = y0 + 4 + v * (H - y0), hw = (5 + 20 * rnd(k, 71 + i)) * (0.5 + 0.7 * v) * (0.6 + 0.5 * b);
    const dx = jitter * wob(f / (jitter > 6 ? 3 : 14) + k * 0.8, i) * (0.4 + v) + (rnd(k, 74 + i) - 0.5) * 10 * v;
    const o = b * (0.2 + 0.8 * bump(v, 0.45, 0.45)) * (0.45 + 0.55 * rnd(k, 73 + i)) * (0.75 + 0.25 * Math.sin(f / 7 + k * 1.3));
    rects.push(<rect key={k} x={x + dx - hw} y={y} width={hw * 2} height={1.6 + v * 2.2} rx={1.2} fill={col} opacity={Math.min(1, o)}/>);
  }
  return <g>{glow ? <><ellipse cx={x} cy={y0 + (H - y0) * 0.45} rx={46 + 20 * b} ry={(H - y0) * 0.6} fill={`url(#${glow})`} opacity={0.8 * b}/><ellipse cx={x} cy={y0 + (H - y0) * 0.72} rx={34} ry={90} fill={`url(#${glow})`} opacity={0.9 * b}/></> : null}{rects}</g>;
};
const Sparks: React.FC<{x: number; y: number; f: number; b: number}> = ({x, y, f, b}) => (
  <g>{Array.from({length: 16}, (_, k) => {
    const P = 34 + (k % 5) * 6, a = ((f + k * 7.3) % P) / P, vx = (rnd(k, 81) - 0.5) * 70, sx = x + vx * a + Math.sin(f / 5 + k) * 6 * a, sy = y - a * (90 + rnd(k, 82) * 90);
    return <circle key={k} cx={sx} cy={sy} r={1 + rnd(k, 83) * 1.6} fill="#FFB070" opacity={b * (1 - a) * 0.9}/>;
  })}</g>
);
// Heavy smoke rising, curling and spreading. kind: "t" tamas (thick, low, rolling), "r" rajas (thin, twisting), "s" sattva (a fine straight thread).
const Smoke: React.FC<{x: number; y: number; f: number; kind: "t" | "r" | "s"; b?: number; height?: number}> = ({x, y, f, kind, b = 1, height = 300}) => {
  if (kind === "s") {
    // a fine column rising straight and calm, faintly lit
    const thread = (ph: number, amp: number) => { const pts: number[][] = []; for (let k = 0; k <= 28; k++) { const v = k / 28; pts.push([x + Math.sin(v * 6 - f / 30 + ph) * amp * Math.pow(v, 1.3) + Math.sin(v * 13 - f / 17 + ph) * 4 * v, y - v * height]); } return pts; };
    return <g opacity={b}>
      <defs><linearGradient id={`pa-thread-${Math.round(x)}`} gradientUnits="userSpaceOnUse" x1={0} y1={y} x2={0} y2={y - height}><stop offset="0" stopColor="#F2E6C8" stopOpacity={0.12}/><stop offset="0.25" stopColor="#F2E6C8" stopOpacity={0.45}/><stop offset="0.65" stopColor="#E8D8B8" stopOpacity={0.2}/><stop offset="1" stopColor="#E8D8B8" stopOpacity={0}/></linearGradient></defs>
      <path d={ribbon(thread(0, 26), 8, 70, 1.4)} fill={`url(#pa-thread-${Math.round(x)})`} opacity={0.3}/>
      <path d={ribbon(thread(0.8, 22), 4, 30, 1.3)} fill={`url(#pa-thread-${Math.round(x)})`} opacity={0.45}/>
      <path d={ribbon(thread(1.7, 18), 1.6, 9, 1.2)} fill={`url(#pa-thread-${Math.round(x)})`} opacity={0.8}/>
    </g>;
  }
  const N = kind === "t" ? 16 : 10, P = kind === "t" ? 220 : 110;
  return (
    <g>{Array.from({length: N}, (_, k) => {
      const a = ((f + (k * P) / N) % P) / P;
      if (kind === "t") {
        // thick and slow: it climbs a little, rolls over and spreads sideways, lit from below by its dim glow
        const yy = y - Math.sqrt(a) * height * 0.6, xx = x + Math.sin(a * 3.4 + k * 2.1) * 40 * a + (k % 2 ? 1 : -0.6) * a * 60, r = 12 + a * 64;
        return <ellipse key={k} cx={xx} cy={yy} rx={r * 1.35} ry={r * 0.9} fill={k % 3 === 0 ? "url(#pa-smoke-d)" : "url(#pa-smoke-t)"} opacity={b * Math.min(1, a * 9) * Math.pow(1 - a, 0.7) * 0.9}/>;
      }
      const yy = y - a * height, xx = x + Math.sin(a * 8 + f / 9 + k) * 36 * a, r = 8 + a * 34;
      return <ellipse key={k} cx={xx} cy={yy} rx={r} ry={r * 1.2} fill="url(#pa-smoke-r)" opacity={b * Math.min(1, a * 6) * Math.pow(1 - a, 0.8)}/>;
    })}</g>
  );
};
// One guna's flame at (x, y) with brightness b (bb = how much it is in its turn, 0..1).
const GunaFlame: React.FC<{i: number; x: number; y: number; f: number; b: number; bb: number}> = ({i, x, y, f, b, bb}) => {
  if (i === 0) return <Flame x={x} y={y} h={76 * (1 + 0.08 * bb)} w={13} lean={0.012 * wob(f / 40)} sway={0.008} t={f / 14} b={b} pal={PALS.sattva}/>;
  if (i === 1) {
    const h = 66 + 9 * wob(f / 2.1, 1) + 8 * bb, lean = 0.17 * wob(f / 4.3, 2);
    return <g>
      <Flame x={x} y={y} h={h} w={16} lean={lean} sway={0.14} t={f / 1.7} b={b} pal={PALS.rajas}/>
      <Flame x={x + 7 + 4 * wob(f / 3, 4)} y={y - 4} h={h * (0.45 + 0.15 * wob(f / 2.6, 5))} w={7} lean={-lean * 1.4 + 0.1} sway={0.2} t={f / 1.4 + 2} b={b * 0.9} halo={0} pal={PALS.rajas}/>
      <Flame x={x - 8 + 3 * wob(f / 2.8, 6)} y={y - 3} h={h * (0.38 + 0.14 * wob(f / 2.2, 7))} w={6} lean={lean * 1.5 - 0.12} sway={0.2} t={f / 1.5 + 4} b={b * 0.85} halo={0} pal={PALS.rajas}/>
      <Sparks x={x + lean * h} y={y - h * 0.8} f={f} b={b}/>
    </g>;
  }
  return <g>
    <ellipse cx={x} cy={y - 30} rx={190 + 60 * bb} ry={160 + 50 * bb} fill="url(#pa-g-tam)" opacity={0.5 + 0.4 * bb}/>
    <Flame x={x} y={y} h={32 + 7 * bb + 2 * wob(f / 14, 3)} w={14} lean={0.05 * wob(f / 20, 8)} sway={0.04} t={f / 12} b={b} halo={1} pal={PALS.tamas}/>
  </g>;
};
const GunasScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const variant = String(s?.variant || "");
  if (variant === "faith") return <FaithScene s={s} n={n}/>;
  const mood = moodOf(s, "night"), u = f / Math.max(1, n), labels = labelsOf(s);
  const released = variant === "released";
  const z = push(f, n, 1, 1.05);
  const FY = PTOP - 16;                                            // flame root on top of each post's lamp
  const turn = [0, 1, 2].map((i) => bump(u, released ? 0.06 + i * 0.07 : 0.17 + i * 0.33, released ? 0.08 : 0.15));
  // released: each light lifts towards one point above and beyond, while one clear light grows there
  const M: V2 = [960, 352];
  const lift = [0, 1, 2].map((i) => (released ? sstep((u - 0.24 - i * 0.03) / 0.36) : 0));
  const merged = released ? sstep((u - 0.5) / 0.3) : 0;
  const amb = released ? merged : 0;
  return (
    <Frame f={f} zoom={z} cx={960} cy={560}>
      <PaDefs/>
      <Sky mood={mood} sun={[960, 1500]} sunR={2} f={f} rays={0} clouds={0.6} id="gu"/>
      <NightWater f={f} mood={mood}/>
      <rect x={-40} y={WATER - 40} width={W + 80} height={80} fill="url(#pa-mist)" opacity={0.0}/>
      {/* each light washes the air around it with its own colour, most in its turn */}
      {GX.map((x, i) => <ellipse key={i} cx={x} cy={FY - 40} rx={620} ry={460} fill={`url(#${["pa-g-sat", "pa-g-raj", "pa-g-tam"][i]})`} opacity={(0.18 + 0.32 * turn[i]) * (1 - lift[i])}/>)}
      {/* released: the one clear light beyond */}
      {released ? <g>
        <circle cx={M[0]} cy={M[1]} r={900 * (0.4 + 0.6 * merged)} fill="url(#pa-g-sat)" opacity={0.75 * merged}/>
        <defs><radialGradient id="gu-ray" gradientUnits="userSpaceOnUse" cx={M[0]} cy={M[1]} r={1200}><stop offset="0" stopColor="#FFF0C8" stopOpacity={1}/><stop offset="0.45" stopColor="#FFE2A8" stopOpacity={0.4}/><stop offset="1" stopColor="#FFE2A8" stopOpacity={0}/></radialGradient></defs>
        {Array.from({length: 14}, (_, k) => {
          const a = (-172 + k * 12.3 + rnd(k, 91) * 6 + Math.sin(f / 90 + k) * 1.5) * Math.PI / 180, w = (1.2 + rnd(k, 92) * 2.2) * Math.PI / 180, L = 1300 * merged;
          return <g key={k}>{[1, 0.6, 0.28].map((q, j) => <path key={j} d={`M ${M[0]} ${M[1]} L ${n1(M[0] + Math.cos(a - w * q) * L)} ${n1(M[1] + Math.sin(a - w * q) * L)} L ${n1(M[0] + Math.cos(a + w * q) * L)} ${n1(M[1] + Math.sin(a + w * q) * L)} Z`} fill="url(#gu-ray)" opacity={0.07 * merged * (0.7 + 0.3 * Math.sin(f / 40 + k))}/>)}</g>;
        })}
        <circle cx={M[0]} cy={M[1]} r={150 * merged} fill="url(#pa-clear)" opacity={merged}/>
        <Reflection x={M[0]} b={merged} col="#FFF0C8" glow="pa-g-sat" jitter={2} f={f} i={9} y0={WATER + 4}/>
      </g> : null}
      {/* reflections of the three lights */}
      {GX.map((x, i) => <Reflection key={i} x={x} b={(i === 2 ? 0.5 : 0.85) * (0.55 + 0.45 * turn[i]) * (1 - lift[i])} col={GCOL[i]} glow={GGLOW[i]} jitter={[1.5, 11, 5][i]} f={f} i={i}/>)}
      {/* each light pools on the water round its post */}
      {GX.map((x, i) => <ellipse key={i} cx={x} cy={PBASE + 6} rx={280} ry={34} fill={`url(#${GGLOW[i]})`} opacity={(0.45 + 0.4 * turn[i]) * (1 - lift[i])}/>)}
      {/* posts and lamps, rim-lit from above by their own light */}
      {GX.map((x, i) => {
        const b = (0.55 + 0.45 * turn[i]) * (1 - lift[i] * 0.9) + amb * 0.6;
        const rim = released ? mix(GCOL[i], "#FFE9B8", merged) : GCOL[i];
        return <g key={i}>
          <rect x={x - 24} y={PBASE + 6} width={48} height={190} fill="url(#pa-shade)" opacity={0.6}/>
          <ellipse cx={x} cy={PBASE + 5} rx={58 + 4 * Math.sin(f / 30 + i)} ry={6} fill="none" stroke="#8A9AD0" strokeWidth={1.2} opacity={0.22}/>
          <ellipse cx={x} cy={PBASE + 7} rx={92 + 6 * Math.sin(f / 30 + i + 1)} ry={9} fill="none" stroke="#8A9AD0" strokeWidth={1} opacity={0.1}/>
          <path d={pillarD(x)} fill="#0E0A18"/>
          <g opacity={Math.min(1, b)}><Rimmed paths={[pillarD(x), diyaD(x, PTOP - 2)]} light={released && merged > 0.3 ? [M[0] - x, M[1] - PTOP] : [0, -1]} w={2.4} rim={rim} fill="#0E0A18"/></g>
          <path d={pillarLines(x)} fill="none" stroke={rim} strokeWidth={1} opacity={0.22 * Math.min(1, b)}/>
          <path d={diyaD(x, PTOP - 2)} fill="#120C1A" opacity={1 - Math.min(1, b)}/>
        </g>;
      })}
      {/* the three flames (they lift away in "released") */}
      {GX.map((x, i) => {
        const e = lift[i];
        if (e <= 0.001) return <GunaFlame key={i} i={i} x={x} y={FY} f={f} b={0.48 + 0.62 * turn[i]} bb={turn[i]}/>;
        const px = lerp(x, M[0], e), py = lerp(FY - 30, M[1], e) - Math.sin(Math.PI * e) * 70, r = lerp(16, 9, e) * (1 - 0.5 * merged);
        const col = mix(GCOL[i], "#FFF6E0", e);
        const trail = Array.from({length: 18}, (_, j) => { const ee = Math.max(0, e - j * 0.012); return [lerp(x, M[0], ee), lerp(FY - 30, M[1], ee) - Math.sin(Math.PI * ee) * 70]; });
        return <g key={i}>
          <g opacity={1 - sstep(e * 3)}><GunaFlame i={i} x={x} y={FY} f={f} b={0.7} bb={0}/></g>
          <circle cx={px} cy={py} r={r * 14} fill={`url(#${GGLOW[i]})`} opacity={(1 - merged) * 0.95}/>
          {trail.map(([tx, ty], j) => <circle key={j} cx={tx} cy={ty} r={r * (1 - j / 18) * 0.7} fill={col} opacity={(1 - merged) * 0.5 * (1 - j / 18)}/>)}
          <circle cx={px} cy={py} r={r * 2.4} fill="url(#pa-clear)" opacity={(1 - merged) * 0.8}/>
          <circle cx={px} cy={py} r={r} fill={col} opacity={(1 - merged) * 0.95}/>
          <circle cx={x} cy={FY - 4} r={2.4} fill="#FFB070" opacity={0.6 * (1 - e)}/>
        </g>;
      })}
      {/* tamas smoke (fades as it is released) */}
      <Smoke x={GX[2]} y={FY - 20} f={f} kind="t" b={(0.75 + 0.35 * turn[2]) * (1 - lift[2])} height={340}/>
      {labels.slice(0, 3).map((w, i) => w ? <text key={i} x={GX[i]} y={PTOP - 170} textAnchor="middle" fontFamily={CAPS} fontSize={24} letterSpacing={7} fill={GLAB[i]} opacity={(0.4 + 0.6 * turn[i]) * (1 - lift[i])}>{w}</text> : null)}
      <Dust f={f} sun={released ? M : [960, FY]} n={90} y0={260} y1={900} color="#E8DDC0"/>
    </Frame>
  );
};
// Faith (17): three bronze bowls of food on the stone steps by the water, each with its light above and its smoke.
// A bowl on a low foot, seen a little from above; (x, y) is the foot on the step.
const bowlD = (x: number, y: number): string => smooth([[x - 30, y, "c"], [x - 24, y - 9, "c"], [x - 34, y - 13], [x - 62, y - 26], [x - 84, y - 44], [x - 92, y - 58, "c"], [x - 60, y - 52], [x, y - 50], [x + 60, y - 52], [x + 92, y - 58, "c"], [x + 84, y - 44], [x + 62, y - 26], [x + 34, y - 13], [x + 24, y - 9, "c"], [x + 30, y, "c"]]);
const bowlRim = (x: number, y: number) => `M ${x - 92} ${y - 58} C ${x - 70} ${y - 72} ${x + 70} ${y - 72} ${x + 92} ${y - 58}`;
// The food in each bowl: sattva a neat mound of rice with a leaf; rajas a tall heap of round sweets; tamas a low, slumped heap.
const foodD = (i: number, x: number, y: number): string[] => {
  const t = y - 56;
  if (i === 0) return [smooth([[x - 76, t], [x - 58, t - 22], [x - 30, t - 38], [x, t - 43], [x + 30, t - 38], [x + 58, t - 22], [x + 76, t]]), smooth([[x + 4, t - 42, "c"], [x + 14, t - 60], [x + 34, t - 70, "c"], [x + 30, t - 52], [x + 16, t - 44]])];
  if (i === 1) {
    const balls: number[][] = [[-48, -22], [-16, -24], [16, -24], [48, -22], [-32, -48], [0, -50], [32, -48], [-16, -74], [16, -74], [0, -98]];
    return [smooth([[x - 74, t], [x - 60, t - 14], [x + 60, t - 14], [x + 74, t]]), ...balls.map(([dx, dy]) => circ(x + dx, t + dy, 16.5))];
  }
  return [smooth([[x - 78, t], [x - 66, t - 12], [x - 40, t - 16], [x - 18, t - 12], [x + 6, t - 20], [x + 34, t - 15], [x + 60, t - 10], [x + 80, t]])];
};
const FaithScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const mood = moodOf(s, "night"), u = f / Math.max(1, n), labels = labelsOf(s);
  const z = push(f, n, 1, 1.04);
  const LEDGE = 800, LY = 480;                                    // the top step; the lights hang at LY above the bowls
  const turn = [0, 1, 2].map((i) => bump(u, 0.17 + i * 0.33, 0.15));
  return (
    <Frame f={f} zoom={z} cx={960} cy={600}>
      <PaDefs/>
      <defs>
        <linearGradient id="fa-step" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2C2238"/><stop offset="0.08" stopColor="#1A1424"/><stop offset="1" stopColor="#0E0A16"/></linearGradient>
        <linearGradient id="fa-step2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1C1626"/><stop offset="1" stopColor="#06040A"/></linearGradient>
      </defs>
      <Sky mood={mood} sun={[960, 1500]} sunR={2} f={f} rays={0} clouds={0.6} id="fa"/>
      <NightWater f={f} mood={mood}/>
      {GX.map((x, i) => <ellipse key={i} cx={x} cy={LY} rx={600} ry={460} fill={`url(#${GGLOW[i]})`} opacity={0.18 + 0.3 * turn[i]}/>)}
      {GX.map((x, i) => <Reflection key={i} x={x} b={(i === 2 ? 0.35 : 0.6) * (0.55 + 0.45 * turn[i])} col={GCOL[i]} glow={GGLOW[i]} jitter={[1.5, 11, 5][i]} f={f} i={i} y0={WATER + 10}/>)}
      {/* the columns of smoke rising from the bowls through the lights */}
      <Smoke x={GX[0]} y={LEDGE - 110} f={f} kind="s" b={0.8 + 0.4 * turn[0]} height={460}/>
      <Smoke x={GX[1]} y={LEDGE - 150} f={f} kind="r" b={1.2 + 0.5 * turn[1]} height={420}/>
      <Smoke x={GX[1] + 10} y={LEDGE - 140} f={f + 55} kind="r" b={0.9 + 0.4 * turn[1]} height={380}/>
      <Smoke x={GX[2]} y={LEDGE - 80} f={f} kind="t" b={1 + 0.4 * turn[2]} height={380}/>
      <Smoke x={GX[2] - 20} y={LEDGE - 76} f={f + 110} kind="t" b={0.8 + 0.4 * turn[2]} height={320}/>
      {GX.map((x, i) => <GunaFlame key={i} i={i} x={x} y={LY + 30} f={f} b={0.46 + 0.62 * turn[i]} bb={turn[i]}/>)}
      {/* the stone steps */}
      <rect x={-40} y={LEDGE} width={W + 80} height={70} fill="url(#fa-step)"/>
      <rect x={-40} y={LEDGE + 70} width={W + 80} height={H} fill="url(#fa-step2)"/>
      <rect x={-40} y={LEDGE - 1} width={W + 80} height={1.6} fill="#8A80B0" opacity={0.35}/>
      <rect x={-40} y={LEDGE + 69} width={W + 80} height={1.2} fill="#8A80B0" opacity={0.18}/>
      {GX.map((x, i) => <ellipse key={i} cx={x} cy={LEDGE + 4} rx={260} ry={22} fill={`url(#${GGLOW[i]})`} opacity={0.35 + 0.35 * turn[i]}/>)}
      {GX.map((x, i) => <ellipse key={i} cx={x} cy={LEDGE + 3} rx={120} ry={10} fill="url(#pa-shade)" opacity={0.9}/>)}
      {GX.map((x, i) => <g key={i}>
        <Rimmed paths={[bowlD(x, LEDGE), ...foodD(i, x, LEDGE)]} light={[0, -1]} w={2.4} rim={GCOL[i]} fill="#120C1A"/>
        <path d={bowlRim(x, LEDGE)} fill="none" stroke={GCOL[i]} strokeWidth={1.2} opacity={0.35 + 0.3 * turn[i]}/>
      </g>)}
      {labels.slice(0, 3).map((w, i) => w ? <text key={i} x={GX[i]} y={LEDGE + 48} textAnchor="middle" fontFamily={CAPS} fontSize={22} letterSpacing={7} fill={GLAB[i]} opacity={0.4 + 0.6 * turn[i]}>{w}</text> : null)}
      <Dust f={f} sun={[960, LY]} n={80} y0={200} y1={780} color="#E8DDC0"/>
    </Frame>
  );
};

// =====================================================================================================================
// ASHVATTHA (15.1-3): the eternal peepal hanging in the sky, roots above in a band of light, trunk hanging down, branches
// spreading below towards the earth, thousands of heart-shaped leaves trembling. variant "cut": a blade of light sweeps
// through the trunk and the lower tree falls away into dust while the light above remains.
// =====================================================================================================================
type Seg = {pts: number[][]; w0: number; w1: number; d: number};
type Leaf = {x: number; y: number; th: number; L: number; ph: number; layer: number; tx: number; ty: number; k: number; lit: boolean};
const TC: V2 = [960, 236];                                         // the root crown (top of the trunk)
const TB: V2 = [960, 470];                                         // where the trunk divides into limbs
const growTree = () => {
  const br: Seg[] = [], twigs: Seg[] = [], roots: Seg[] = [], hairs: Seg[] = [], leaves: Leaf[] = [];
  const Y0 = TB[1], squash = 0.73;
  const sq = (p: number[]) => [p[0], Y0 + (p[1] - Y0) * squash];
  let lk = 0;
  // a clump of leaves hanging round a twig end (cx, cy)
  const clump = (cx: number, cy: number, count: number, rad: number, a: number, id: number) => {
    for (let j = 0; j < count; j++) {
      const ra = rnd(id * 13 + j, 22) * Math.PI * 2, rr = Math.sqrt(rnd(id * 19 + j, 23)) * rad;
      const x = cx + Math.cos(ra) * rr, y = cy + Math.sin(ra) * rr * 0.75 + rad * 0.2;
      const th = (rnd(id * 23 + j, 24) - 0.5) * 1.6 - Math.sin(a) * 0.45;
      const lay = rnd(id * 37 + j, 27);
      leaves.push({x, y, th, L: 24 + rnd(id * 29 + j, 25) * 14, ph: rnd(id * 31 + j, 26) * 6.28, layer: lay < 0.28 ? 0 : lay < 0.6 ? 1 : 2, tx: cx, ty: cy, k: lk++, lit: false});
    }
  };
  // branches grow away from the trunk, downwards and outwards (a = angle from straight down); the outer ones droop
  const grow = (x: number, y: number, a: number, len: number, w: number, d: number, id: number) => {
    const bend = (rnd(id, 11) - 0.5) * 0.6 - Math.sign(a) * 0.12 * d;
    const ex = x + Math.sin(a + bend * 0.25) * len, ey = y + Math.cos(a + bend * 0.25) * len;
    const pts = sampleCubics([[x, y], [x + Math.sin(a - bend) * len * 0.34, y + Math.cos(a - bend) * len * 0.34], [x + Math.sin(a + bend) * len * 0.68, y + Math.cos(a + bend) * len * 0.68], [ex, ey]], d < 3 ? 8 : 5).map(sq);
    (d <= 2 ? br : twigs).push({pts, w0: w, w1: w * 0.62, d});
    const e = pts[pts.length - 1], m = pts[Math.floor(pts.length / 2)];
    if (d === 2) clump(e[0], e[1], 6, 30, a, id);
    if (d === 3) { clump(e[0], e[1], 12, 44, a, id); clump(m[0], m[1], 6, 32, a, id + 7000); }
    if (d === 4) { clump(e[0], e[1], 13, 42, a, id); clump(m[0], m[1], 5, 28, a, id + 7000); }
    if (d >= 4) return;
    const kids = d <= 1 ? 3 : rnd(id, 13) < 0.6 ? 2 : 3;
    for (let i = 0; i < kids; i++) {
      const spread = 0.42 + 0.04 * d;
      let na = a + (i / (kids - 1) - 0.5) * 2 * spread + (rnd(id * 7 + i, 17) - 0.5) * 0.3;
      na = Math.max(-1.15, Math.min(1.15, na * 0.86));                // the crown hangs as a rounded, inverted dome
      grow(ex, ey, na, len * (0.74 + rnd(id * 5 + i, 19) * 0.12), w * 0.6, d + 1, id * 4 + i + 1);
    }
  };
  const limbs = [-1.3, -0.9, -0.45, 0.04, 0.48, 0.92, 1.32];
  limbs.forEach((a, i) => grow(TB[0] + a * 28, TB[1] - 8, a, 165 + rnd(i, 3) * 40 - Math.abs(a) * 10, 36, 1, i + 1));
  // more clumps scattered through the inverted dome so the crown reads full, with sky showing through here and there
  for (let i = 0; i < 96; i++) {
    const u = rnd(i, 61) * 2 - 1, v = Math.sqrt(rnd(i, 62));
    const y = 540 + v * 330, hw = 620 * Math.sqrt(Math.max(0, 1 - Math.pow((y - 520) / 380, 2))), x = 960 + u * hw;
    if (y < 570 + Math.abs(u) * 50) continue;
    clump(x, y, 8, 36, (x - 960) / 600, 9000 + i);
  }
  // roots flare out from the crown, then climb, sinuous and ever finer, into the light (a = angle from straight up)
  const root = (x: number, y: number, a: number, len: number, w: number, d: number, id: number) => {
    const pts: number[][] = [];
    const K = d <= 2 ? 14 : 9, ph = rnd(id, 51) * 6.28, amp = len * (0.05 + 0.04 * rnd(id, 52)), curl = Math.sign(a) * (d <= 1 ? -0.5 : -0.15);
    let px = x, py = y, aa = a;
    for (let k = 0; k <= K; k++) {
      const u = k / K;
      if (k > 0) { aa = a + curl * u + Math.sin(ph + u * 7) * 0.12; px += Math.sin(aa) * len / K; py -= Math.cos(aa) * len / K; }
      const [nx, ny] = [Math.cos(aa), Math.sin(aa)];
      const wig = Math.sin(ph + u * 9) * amp * u;
      pts.push([px + nx * wig, py + ny * wig]);
    }
    (d <= 3 ? roots : hairs).push({pts, w0: w, w1: w * 0.5, d});
    const [ex, ey] = pts[pts.length - 1];
    if (d >= 6) return;
    const kids = d <= 1 ? 2 : d >= 4 ? 3 : rnd(id, 53) < 0.5 ? 2 : 3;
    for (let i = 0; i < kids; i++) {
      const na = (a + curl) * 0.8 + (i / Math.max(1, kids - 1) - 0.5) * (d >= 4 ? 1.3 : 0.9) + (rnd(id * 3 + i, 55) - 0.5) * 0.5;
      root(ex, ey, Math.max(-1.45, Math.min(1.45, na)), len * (d >= 4 ? 0.62 : 0.74 + rnd(id * 9 + i, 57) * 0.14), w * 0.55, d + 1, id * 4 + i + 1);
    }
  };
  const rl = [-1.55, -1.35, -1.05, -0.7, -0.36, -0.1, 0.12, 0.38, 0.72, 1.05, 1.35, 1.55];
  rl.forEach((a, i) => root(TC[0] + a * 44, TC[1] + 10 - Math.abs(a) * 4, a, 92 + rnd(i, 59) * 40, 22, 1, 100 + i));
  return {br, twigs, roots, hairs, leaves};
};
let TREE: ReturnType<typeof growTree> | null = null;
const tree = () => (TREE ??= growTree());
// The trunk: massive and fluted, flaring into the root crown above and into the limbs below.
const TRUNK = smooth([[850, 222], [890, 236], [912, 262], [918, 298], [916, 340], [920, 382], [912, 424], [892, 458], [858, 486], [912, 478], [960, 488], [1010, 478], [1064, 488], [1028, 458], [1006, 424], [1000, 384], [1004, 342], [1002, 300], [1008, 262], [1030, 236], [1072, 220], [1012, 232], [960, 228], [910, 232]]);
const FLUTES = [[[934, 250], [930, 330], [936, 410], [920, 470]], [[958, 246], [962, 330], [956, 400], [962, 478]], [[986, 252], [990, 320], [984, 410], [1000, 472]]].map((c) => sampleCubics(c, 10));
// A peepal leaf (heart-shaped, with a long drip tip) hanging from (x, y), turned by th, length L.
const leafD = (x: number, y: number, th: number, L: number): string => {
  const c = Math.cos(th) * L, s = Math.sin(th) * L;
  const T = (lx: number, ly: number) => `${n1(x + lx * c - ly * s)} ${n1(y + lx * s + ly * c)}`;
  return `M${T(0, 0.05)}C${T(0.07, -0.01)} ${T(0.25, -0.01)} ${T(0.31, 0.12)}C${T(0.36, 0.24)} ${T(0.27, 0.37)} ${T(0.15, 0.46)}C${T(0.08, 0.52)} ${T(0.035, 0.6)} ${T(0.018, 0.7)}C${T(0.008, 0.8)} ${T(0.004, 0.9)} ${T(0, 1)}C${T(-0.004, 0.9)} ${T(-0.008, 0.8)} ${T(-0.018, 0.7)}C${T(-0.035, 0.6)} ${T(-0.08, 0.52)} ${T(-0.15, 0.46)}C${T(-0.27, 0.37)} ${T(-0.36, 0.24)} ${T(-0.31, 0.12)}C${T(-0.25, -0.01)} ${T(-0.07, -0.01)} ${T(0, 0.05)}Z`;
};
const segsD = (segs: Seg[]) => segs.map((g) => ribbon(g.pts, g.w0, g.w1, 1)).join(" ");
const AshvatthaScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const mood = moodOf(s, "dusk"), cut = String(s?.variant || "") === "cut";
  const T = tree();
  const z = push(f, n, 1, 1.045);
  // the cut: the blade sweeps at tc; then the lower tree sinks and crumbles into dust
  const tc = Math.round(n * 0.3), YC = 392;
  const sweep = cut ? ease(f, tc - 12, 12) : 0, after = cut ? Math.max(0, f - tc) : 0;
  const fall = cut ? 0.5 * 0.02 * after * after : 0;
  const fade = cut ? 1 - ease(f, tc + 40, Math.max(60, n * 0.4)) : 1;
  const band = 1 + (cut ? 0.3 * ease(f, tc, 60) : 0);
  // leaves tremble (the peepal's leaves move with no wind at all); after the cut each shrinks into a mote as it falls
  const lay = ["", "", ""], rimL = [""], litL = [""], twig = [""], motes = ["", "", ""];
  for (const l of T.leaves) {
    let x = l.x, y = l.y, tx = l.tx, ty = l.ty, sc = 1;
    const th = l.th + 0.16 * Math.sin(f * 0.31 + l.ph) + 0.06 * Math.sin(f * 0.83 + l.ph * 2.3);
    if (cut && after > 0) {
      const td = tc + 14 + rnd(l.k, 31) * n * 0.5, e = clamp01((f - td) / 26);
      const drift = Math.max(0, f - td), dx = (rnd(l.k, 32) - 0.5) * drift * 0.9, dy = drift * drift * 0.01 + drift * 0.5;
      x += dx; y += fall + dy; tx += dx; ty += fall + dy; sc = 1 - e;
      if (e > 0 && l.k % 5 === 0) { const age = clamp01((f - td) / 80); if (age < 1) motes[Math.min(2, Math.floor(age * 3))] += circ(x + (rnd(l.k, 33) - 0.5) * 30, y - 6 + l.L * 0.4 + age * 30, 1 + rnd(l.k, 34) * 1.4); }
    }
    if (sc <= 0.02) continue;
    const L = l.L * sc;
    if (l.lit) { litL[0] += leafD(x, y, th, L); continue; }
    lay[l.layer] += leafD(x, y, th, L);
    if (l.layer === 2) rimL[0] += leafD(x, y - 1.5, th, L);
    if (l.k % 2 === 0 && Math.hypot(tx - x, ty - y) < 46) twig[0] += `M${n1(tx)} ${n1(ty)}L${n1(x)} ${n1(y)}`;
  }
  const flutes = FLUTES.map((c) => ribbon(c, 3, 1.5, 1)).join(" ");
  return (
    <Frame f={f} zoom={z} cx={960} cy={440}>
      <PaDefs/>
      <defs>
        <linearGradient id="as-band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF0C8" stopOpacity={1}/><stop offset="0.12" stopColor="#FFD992" stopOpacity={0.97}/><stop offset="0.3" stopColor="#FFB862" stopOpacity={0.66}/><stop offset="0.55" stopColor="#F09850" stopOpacity={0.2}/><stop offset="1" stopColor="#E88A50" stopOpacity={0}/></linearGradient>
        <linearGradient id="as-earth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2A1428"/><stop offset="1" stopColor="#0A0610"/></linearGradient>
        <radialGradient id="as-shaft"><stop offset="0" stopColor="#FFE6B0" stopOpacity={0.4}/><stop offset="1" stopColor="#FFE6B0" stopOpacity={0}/></radialGradient>
        <clipPath id="as-up"><rect x={-100} y={-200} width={W + 200} height={YC + 200}/></clipPath>
        <clipPath id="as-dn"><rect x={-100} y={YC} width={W + 200} height={H + 400}/></clipPath>
      </defs>
      <Sky mood={mood} sun={[960, 1070]} sunR={60} f={f} rays={0.3} clouds={0.5} id="as"/>
      {/* soft shafts of light falling from the band above */}
      {[0, 1, 2, 3, 4, 5].map((k) => <ellipse key={k} cx={420 + k * 216 + Math.sin(f / 80 + k) * 10} cy={120} rx={44 + rnd(k, 5) * 30} ry={420 + rnd(k, 7) * 160} fill="url(#as-shaft)" opacity={0.22 * band * (0.7 + 0.3 * Math.sin(f / 50 + k))}/>)}
      {/* the earth far below */}
      <path d={ridge([[-60, 1000], [200, 990], [480, 996], [760, 986], [1000, 994], [1260, 984], [1540, 994], [1800, 988], [1990, 994]])} fill="url(#as-earth)"/>
      {/* the lower tree: limbs, branches and leaves (falls away in "cut") */}
      <g opacity={fade} transform={`translate(0 ${n1(fall)})`}>
        <path d={lay[0]} fill="#3C2040" opacity={0.92}/>
        <path d={segsD(T.twigs)} fill="#1A0E22"/>
        <path d={twig[0]} fill="none" stroke="#1E1026" strokeWidth={0.8} opacity={0.8}/>
        {cut ? <g clipPath="url(#as-dn)"><Rimmed paths={[segsD(T.br), TRUNK]} light={[0, -1]} w={1.8} rim="#F2C27A"/></g> : null}
        <path d={lay[1]} fill="#25142D"/>
        <path d={rimL[0]} fill="#F2C27A" opacity={0.5}/>
        <path d={lay[2]} fill={K.sil}/>
        <path d={litL[0]} fill="#D07A44" opacity={0.75}/>
      </g>
      {cut ? <g clipPath="url(#as-dn)" opacity={fade} transform={`translate(0 ${n1(fall)})`}><path d={flutes} fill="#E8B070" opacity={0.14}/></g> : null}
      {/* roots, trunk and limbs as one rim-lit silhouette (in "cut" the part above the cut stays) */}
      {cut
        ? <g clipPath="url(#as-up)"><path d={segsD(T.hairs)} fill="#1E1028"/><Rimmed paths={[segsD(T.roots), TRUNK]} light={[0, -1]} w={1.7} rim="#FFD38A"/><path d={flutes} fill="#E8B070" opacity={0.14}/></g>
        : <><path d={segsD(T.hairs)} fill="#1E1028"/><Rimmed paths={[segsD(T.roots), TRUNK, segsD(T.br)]} light={[0, -1]} w={1.8} rim="#F2C27A"/><path d={flutes} fill="#E8B070" opacity={0.14}/></>}
      <rect x={-40} y={-40} width={W + 80} height={360 * band} fill="url(#as-band)"/>
      <ellipse cx={960} cy={-40} rx={1250} ry={210 * band} fill="url(#pa-clear)" opacity={0.8}/>
      {/* the cut: a blade of light through the trunk, then a glowing seam */}
      {cut && sweep > 0 && sweep < 1 ? (() => {
        // a crescent of light swinging through the trunk, its trail fading behind it
        const bx = lerp(640, 1280, sweep), arc = (k: number) => `M ${n1(bx - 70 * k)} ${n1(YC - 150 * k)} Q ${n1(bx + 46 * k)} ${n1(YC)} ${n1(bx - 70 * k)} ${n1(YC + 150 * k)} Q ${n1(bx + 6 * k)} ${n1(YC)} ${n1(bx - 70 * k)} ${n1(YC - 150 * k)} Z`;
        return <g opacity={Math.sin(Math.PI * sweep) * 0.6 + 0.4}>
          <ellipse cx={bx - 120} cy={YC} rx={300} ry={26} fill="url(#pa-clear)" opacity={0.8}/>
          <path d={`M ${n1(bx - 420)} ${YC + 2} L ${n1(bx)} ${YC - 2.5} L ${n1(bx)} ${YC + 2.5} Z`} fill="#FFF8E0" opacity={0.85}/>
          <circle cx={bx} cy={YC} r={130} fill="url(#pa-clear)" opacity={0.7}/>
          <path d={arc(1)} fill="#FFF6DC" opacity={0.95}/>
          <path d={arc(1.25)} fill="#FFE2A8" opacity={0.3}/>
        </g>;
      })() : null}
      {cut && f >= tc ? <g opacity={1 - ease(f, tc + 10, 80)}>
        <ellipse cx={960} cy={YC} rx={140} ry={30} fill="url(#pa-clear)"/>
        <rect x={906} y={YC - 1.5} width={108} height={3} fill="#FFF6DC"/>
      </g> : null}
      {motes.map((d, i) => d ? <path key={i} d={d} fill="#FFE2A8" opacity={[0.9, 0.55, 0.25][i]}/> : null)}
      <Dust f={f} sun={[960, 120]} n={110} y0={120} y1={980}/>
    </Frame>
  );
};

// =====================================================================================================================
// WHEEL (3.14-16): "from food come beings, from rain food, from sacrifice rain": a great wheel drawn in fine gold line on
// deep indigo, turning slowly; four emblems on its rim (sacrificial fire under the sun, cloud and rain, sprouting grain,
// a bowl of food) each light as they come to the top. Seasons of colour flow round it. s.labels: four words (optional),
// one beside each emblem while it is lit.
// =====================================================================================================================
const SEASON = ["#F0A04B", "#D97A9A", "#C8C060", "#5A86D8"];      // at emblem angles 0 (fire), 90 (food), 180 (grain), 270 (rain)
const seasonAt = (deg: number) => { const d = ((deg % 360) + 360) % 360, i = Math.floor(d / 90), t = (d - i * 90) / 90; return mix(SEASON[i], SEASON[(i + 1) % 4], sstep(t)); };
const GOLD = "#E8B65A";
// The ring of twelve petals round each emblem's medallion.
const MED_PETALS = Array.from({length: 12}, (_, i) => { const a = (i / 12) * 360, p = (r: number, d: number) => polar(0, 0, r, a + d).map(n1).join(" "); return `M ${p(50, -13)} Q ${p(58, -10)} ${p(64, 0)} Q ${p(58, 10)} ${p(50, 13)}`; }).join(" ");
// The emblems, drawn in local units (about +-30) upright, in fine line. lit 0..1.
const Emblem: React.FC<{k: number; lit: number; f: number}> = ({k, lit, f}) => {
  const col = mix("#C9A060", "#FFF4D6", lit), sw = 1.6 + 0.8 * lit, fillO = 0.15 + 0.75 * lit;
  const common = {fill: "none", stroke: col, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const};
  if (k === 0) {   // sun and the sacrificial fire
    const rays: string[] = []; for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, r0 = 19, r1 = i % 2 ? 25 : 29; rays.push(`M ${n1(Math.cos(a) * r0)} ${n1(Math.sin(a) * r0)} L ${n1(Math.cos(a) * r1)} ${n1(Math.sin(a) * r1)}`); }
    const fl = flameD(0, 9, 22 + 2 * Math.sin(f / 6), 6, 0.04 * Math.sin(f / 9), 0.05, f / 5);
    return <g><circle r={15} {...common}/><path d={rays.join(" ")} {...common}/><path d={fl} fill={col} fillOpacity={fillO} stroke={col} strokeWidth={sw * 0.7}/><path d="M -9 11 L 9 11" {...common}/></g>;
  }
  if (k === 1) {   // cloud and rain
    const cloud = smooth([[-26, -4], [-24, -12], [-15, -15], [-10, -24], [0, -27], [9, -23], [13, -17], [22, -18], [27, -10], [25, -3], [12, 0, "c"], [-12, 0, "c"]]);
    const rain = [-16, -7, 2, 11, 20].map((x, i) => { const o = ((f / 3 + i * 5) % 12); return `M ${x} ${6 + o * 0.6} L ${x - 4} ${14 + o * 0.6}`; }).join(" ");
    return <g><path d={cloud} {...common} fill={col} fillOpacity={fillO * 0.6}/><path d={rain} {...common}/></g>;
  }
  if (k === 2) {   // sprouting grain: three stalks from the earth, the middle ear bowing heavy with grain
    const grains = Array.from({length: 8}, (_, i) => { const t = i / 7, x = 2 + t * 15 + t * t * 3, y = -24 + t * t * 20, ang = 10 + t * 70; return <ellipse key={i} cx={n1(x + (i % 2 ? 2.6 : -2.6) * Math.cos((ang * Math.PI) / 180))} cy={n1(y - (i % 2 ? 2.6 : -2.6) * Math.sin((ang * Math.PI) / 180) * 0.4)} rx={3.6} ry={1.9} transform={`rotate(${n1(ang + (i % 2 ? -25 : 25))} ${n1(x)} ${n1(y)})`} fill={col} fillOpacity={0.3 + 0.7 * lit} stroke={col} strokeWidth={sw * 0.45}/>; });
    return <g><path d="M -24 24 Q 0 19 24 24" {...common}/>
      <path d="M 0 24 C 0 8 -1 -10 2 -24 C 10 -26 16 -18 20 -4" {...common}/>
      <path d="M -6 24 C -8 12 -14 2 -18 -10 M 6 24 C 9 14 13 8 18 2" {...common} strokeWidth={sw * 0.8}/>
      <path d="M -1 16 C -10 12 -18 10 -24 2 C -16 4 -8 8 -1 12 Z M 1 8 C 8 4 13 -2 15 -10 C 9 -4 5 0 1 4 Z" fill={col} fillOpacity={fillO * 0.7} stroke={col} strokeWidth={sw * 0.6}/>
      {grains}
      {[-18, 18].map((x, i) => <ellipse key={i} cx={x} cy={i ? 0 : -12} rx={1.8} ry={3.4} transform={`rotate(${i ? 30 : -25} ${x} ${i ? 0 : -12})`} fill={col} fillOpacity={0.3 + 0.7 * lit} stroke="none"/>)}
    </g>;
  }
  // a bowl of food, a little steam
  const steam = [-8, 0, 8].map((x, i) => { const p = Math.sin(f / 12 + i) * 2; return `M ${x} -14 C ${x - 4 + p} -18 ${x + 4 + p} -22 ${x + p} -28`; }).join(" ");
  return <g><path d="M -26 2 C -24 16 -12 22 0 22 C 12 22 24 16 26 2 Z" {...common} fill={col} fillOpacity={fillO * 0.5}/><path d="M -8 22 L -10 27 L 10 27 L 8 22" {...common}/>
    <path d="M -20 2 C -16 -10 -6 -14 0 -14 C 6 -14 16 -10 20 2" {...common} fill={col} fillOpacity={fillO}/><path d={steam} {...common} strokeWidth={sw * 0.8} opacity={0.4 + 0.6 * lit}/></g>;
};
const WheelScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const labels = labelsOf(s), mood = moodOf(s, "night");
  const BG: Record<Mood, [string, string, string]> = {night: ["#241A48", K.indigo, K.night], dusk: ["#3A2048", "#24143A", "#0C0614"], dawn: ["#2A2E5A", "#1A1C40", "#0A0A1C"], gold: ["#3E2638", "#2A1828", "#0E080E"]};
  const C: V2 = [960, 524], R = 350;
  const z = push(f, n, 1, 1.04);
  // clockwise, every emblem passing the top once per beat; the wheel slows a little as each comes to the top
  const r0 = -30 + f * (330 / Math.max(90, n)), rot = r0 - ((90 * 0.45) / (2 * Math.PI)) * Math.sin((2 * Math.PI * r0) / 90);
  const EMB = [0, 270, 180, 90];                                   // fire, rain, grain, food: each comes to the top in that order
  const lit = EMB.map((a) => { let d = (((a + rot) % 360) + 360) % 360; if (d > 180) d -= 360; return bump(d, 0, 30); });
  const topCol = seasonAt(-rot);
  // the wheel's ornament, in wheel coordinates
  const beads: string[] = [], petals: string[] = [], cusps: string[] = [], studs: string[] = [];
  for (let i = 0; i < 72; i++) { const [x, y] = polar(0, 0, R - 15, (i / 72) * 360); beads.push(circ(x, y, 2.6)); }
  for (let i = 0; i < 48; i++) { const a0 = (i / 48) * 360, a1 = ((i + 1) / 48) * 360, [x0, y0] = polar(0, 0, R - 30, a0), [x1, y1] = polar(0, 0, R - 30, a1), [xm, ym] = polar(0, 0, R - 46, (a0 + a1) / 2); petals.push(`M ${n1(x0)} ${n1(y0)} Q ${n1(xm)} ${n1(ym)} ${n1(x1)} ${n1(y1)}`); }
  for (let i = 0; i < 16; i++) {
    const a0 = (i / 16) * 360 + 3, a1 = ((i + 1) / 16) * 360 - 3, am = (a0 + a1) / 2, r0 = R - 46;
    const p = (r: number, a: number) => polar(0, 0, r, a).map(n1).join(" ");
    cusps.push(`M ${p(r0, a0)} C ${p(r0 - 18, a0)} ${p(r0 - 24, am - 3)} ${p(r0 - 36, am)} C ${p(r0 - 24, am + 3)} ${p(r0 - 18, a1)} ${p(r0, a1)}`);
  }
  for (let i = 0; i < 16; i++) { const [x, y] = polar(0, 0, 84, (i / 16) * 360 + 11.25); studs.push(circ(x, y, 2.4)); }
  const hubPetals: string[] = [];
  for (let i = 0; i < 16; i++) { const a = (i / 16) * 360, p = (r: number, d: number) => polar(0, 0, r, a + d).map(n1).join(" "); hubPetals.push(`M ${p(54, -9)} Q ${p(68, -8)} ${p(76, 0)} Q ${p(68, 8)} ${p(54, 9)}`); }
  // spokes: eight broad ones with a carved medallion halfway, eight fine ones with a bead
  const R0 = 92, R1 = R - 46, RM = (R0 + R1) / 2;
  const spoke = (a: number, wA: number, wB: number, gap: number) => {
    const P = (r: number, w: number) => { const [x, y] = polar(0, 0, r, a), q = ((a + 90) * Math.PI) / 180; return [x + Math.sin(q) * w, y - Math.cos(q) * w]; };
    const seg = (ra: number, rb: number) => [-1, 1].map((sd) => { const pa = P(ra, sd * lerp(wA, wB, (ra - R0) / (R1 - R0)) / 2), pb = P(rb, sd * lerp(wA, wB, (rb - R0) / (R1 - R0)) / 2); return `M ${n1(pa[0])} ${n1(pa[1])} L ${n1(pb[0])} ${n1(pb[1])}`; }).join(" ");
    return gap > 0 ? seg(R0, RM - gap) + " " + seg(RM + gap, R1) : seg(R0, R1);
  };
  const major: string[] = [], minor: string[] = [], meds: React.ReactNode[] = [];
  for (let i = 0; i < 8; i++) {
    const a = i * 45; major.push(spoke(a, 30, 20, 30));
    const [mx, my] = polar(0, 0, RM, a);
    meds.push(<g key={i} transform={`translate(${n1(mx)} ${n1(my)}) rotate(${a})`}>
      <circle r={30}/><circle r={24} strokeWidth={0.9} opacity={0.7}/>
      {Array.from({length: 8}, (_, j) => <path key={j} d="M 0 -4 C 5 -9 4 -17 0 -21 C -4 -17 -5 -9 0 -4 Z" transform={`rotate(${j * 45})`} strokeWidth={1}/>)}
      <circle r={3.2} fill={GOLD} stroke="none"/>
    </g>);
    // cross bands along the broad spoke
    [R0 + 26, R1 - 22].forEach((r, j) => { const w = lerp(30, 20, (r - R0) / (R1 - R0)) / 2, q = ((a + 90) * Math.PI) / 180, [x, y] = polar(0, 0, r, a); major.push(`M ${n1(x - Math.sin(q) * w)} ${n1(y + Math.cos(q) * w)} L ${n1(x + Math.sin(q) * w)} ${n1(y - Math.cos(q) * w)}`); });
    minor.push(spoke(a + 22.5, 8, 6, 9));
    const [bx, by] = polar(0, 0, RM + 20, a + 22.5); minor.push(circ(bx, by, 8));
  }
  // seasons: a ring of soft colour round the rim, each patch the colour of its season
  const ringN = 24;
  return (
    <Frame f={f} zoom={z} cx={C[0]} cy={C[1]}>
      <PaDefs/>
      <defs>
        <radialGradient id="wh-bg" cx="0.5" cy="0.48" r="0.75"><stop offset="0" stopColor={BG[mood][0]}/><stop offset="0.5" stopColor={BG[mood][1]}/><stop offset="1" stopColor={BG[mood][2]}/></radialGradient>
        <radialGradient id="wh-tint"><stop offset="0" stopColor={topCol} stopOpacity={0.42}/><stop offset="0.6" stopColor={topCol} stopOpacity={0.08}/><stop offset="1" stopColor={topCol} stopOpacity={0}/></radialGradient>
        {Array.from({length: ringN}, (_, i) => { const c = seasonAt((i / ringN) * 360); return <radialGradient key={i} id={`wh-s${i}`}><stop offset="0" stopColor={c} stopOpacity={0.55}/><stop offset="0.5" stopColor={c} stopOpacity={0.18}/><stop offset="1" stopColor={c} stopOpacity={0}/></radialGradient>; })}
        <radialGradient id="wh-lit"><stop offset="0" stopColor="#C88A3A" stopOpacity={0.95}/><stop offset="0.55" stopColor="#7A4A2A" stopOpacity={0.8}/><stop offset="1" stopColor="#3A2230" stopOpacity={0.5}/></radialGradient>
        <radialGradient id="wh-beam"><stop offset="0" stopColor="#FFE9B8" stopOpacity={0.2}/><stop offset="0.5" stopColor="#FFE9B8" stopOpacity={0.08}/><stop offset="1" stopColor="#FFE9B8" stopOpacity={0}/></radialGradient>
      </defs>
      <rect x={-40} y={-40} width={W + 80} height={H + 80} fill="url(#wh-bg)"/>
      <ellipse cx={C[0]} cy={C[1]} rx={900} ry={620} fill="url(#wh-tint)"/>
      {/* faint outer rings of the yantra, still */}
      <g fill="none" stroke={GOLD} opacity={0.16}>
        <circle cx={C[0]} cy={C[1]} r={R + 62} strokeWidth={1}/><circle cx={C[0]} cy={C[1]} r={R + 70} strokeWidth={0.8}/>
        <circle cx={C[0]} cy={C[1]} r={R + 96} strokeWidth={1} strokeDasharray="1 10"/>
      </g>
      {/* the light from above that kindles each emblem as it comes to the top */}
      <ellipse cx={C[0]} cy={40} rx={110} ry={C[1] - R + 60} fill="url(#wh-beam)" opacity={0.6 + 0.4 * Math.max(...lit)}/>
      <circle cx={C[0]} cy={C[1] - R + 14} r={150} fill="url(#pa-warm)" opacity={0.25 + 0.45 * Math.max(...lit)}/>
      <g transform={`translate(${C[0]} ${C[1]}) rotate(${n1(rot)})`}>
        {Array.from({length: ringN}, (_, i) => { const [x, y] = polar(0, 0, R + 8, (i / ringN) * 360); return <circle key={i} cx={x} cy={y} r={120} fill={`url(#wh-s${i})`} opacity={0.85}/>; })}
        <circle r={R - 50} fill="url(#pa-soft)" opacity={0.25}/>
        <g fill="none" stroke={GOLD} strokeLinecap="round">
          <circle r={R + 16} strokeWidth={1} strokeDasharray="2 9" opacity={0.6}/>
          <circle r={R} strokeWidth={2.2}/><circle r={R - 30} strokeWidth={1.5}/><circle r={R - 46} strokeWidth={1.1} opacity={0.8}/>
          <path d={petals.join(" ")} strokeWidth={1} opacity={0.75}/>
          <path d={cusps.join(" ")} strokeWidth={1.1} opacity={0.85}/>
          <path d={major.join(" ")} strokeWidth={1.6}/>
          <path d={minor.join(" ")} strokeWidth={1.1} opacity={0.85}/>
          {meds}
          <circle r={R0} strokeWidth={1.8}/><circle r={76} strokeWidth={1.1}/><circle r={54} strokeWidth={1.3}/><circle r={30} strokeWidth={1.6}/>
          <path d={hubPetals.join(" ")} strokeWidth={1.1}/>
          {Array.from({length: 8}, (_, i) => { const [x, y] = polar(0, 0, 28, i * 45); return <path key={i} d={`M 0 0 L ${n1(x)} ${n1(y)}`} strokeWidth={1} opacity={0.7}/>; })}
        </g>
        <path d={beads.join(" ")} fill={GOLD} opacity={0.85}/>
        <path d={studs.join(" ")} fill={GOLD} opacity={0.8}/>
        <circle r={9} fill="#FFE9B8"/>
        <circle r={40} fill="url(#pa-warm)" opacity={0.6}/>
        {/* the four emblems on the rim */}
        {EMB.map((a, k) => {
          const [x, y] = polar(0, 0, R - 15, a), L = lit[k];
          return <g key={k} transform={`translate(${n1(x)} ${n1(y)}) rotate(${a})`}>
            <circle r={190} fill="url(#pa-warm)" opacity={L}/>
            <circle r={90} fill="url(#pa-clear)" opacity={0.35 * L}/>
            <circle r={60} fill="#120C26"/>
            <path d={MED_PETALS} fill="none" stroke={mix(GOLD, "#FFF0C8", L)} strokeWidth={1} opacity={0.75 + 0.25 * L}/>
            <circle r={50} fill="#120C26"/>
            <circle r={50} fill="url(#wh-lit)" opacity={L}/>
            <circle r={50} fill="none" stroke={mix(GOLD, "#FFF0C8", L)} strokeWidth={1.8 + L}/>
            <circle r={44} fill="none" stroke={GOLD} strokeWidth={0.8} strokeDasharray="1.5 4" opacity={0.8}/>
            <g transform="scale(1.12)"><Emblem k={k} lit={L} f={f}/></g>
          </g>;
        })}
      </g>
      {/* a light runs round the rim ahead of the turning, trailing the colour of each season it passes */}
      <circle cx={polar(C[0], C[1], R + 16, f * (720 / Math.max(90, n)))[0]} cy={polar(C[0], C[1], R + 16, f * (720 / Math.max(90, n)))[1]} r={40} fill="url(#pa-warm)" opacity={0.7}/>
      {Array.from({length: 44}, (_, j) => { const a = (f * (720 / Math.max(90, n)) - j * 0.75) % 360, [x, y] = polar(C[0], C[1], R + 16, a); return <circle key={j} cx={x} cy={y} r={3.4 - j * 0.065} fill={mix("#FFF4D6", seasonAt(a - rot), j / 30)} opacity={0.8 * Math.pow(1 - j / 44, 1.5)}/>; })}
      {labels.slice(0, 4).map((w, k) => w && lit[k] > 0.05 ? <text key={k} x={C[0] + 74} y={C[1] - R - 8} fontFamily={CAPS} fontSize={22} letterSpacing={6} fill={K.goldLt} opacity={lit[k]}>{w}</text> : null)}
      <Dust f={f} sun={[C[0], C[1] - R]} n={110} y0={120} y1={980}/>
    </Frame>
  );
};

export const SCENES: Record<string, React.FC<SceneP>> = {"two-roads": TwoRoads, gunas: GunasScene, ashvattha: AshvatthaScene, wheel: WheelScene};
