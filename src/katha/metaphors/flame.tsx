// Katha metaphor scenes: flame (21 Oct 2026). The lamp in a windless place (6.19), the sacrificial fire (4.24-25, 4.37,
// 17.23), fire veiled by smoke and the dusty mirror (3.38), the flame that climbs to the sun (8.24-26).
// Lamplight: one warm source per shot, everything else a near-black shape rimmed by it. Soft light, haze and smoke are
// radial / linear gradients only (no blur or turbulence filters: long renders dropped tiles under them).
import React, {useId} from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {K, W, H, SA, CAPS} from "../look";
import {SceneP, Frame, push} from "../stage";
import {Sky, Dust, Mood} from "../sky";
import {smooth, ribbon, rnd, lerp, clamp01, nrmAt, Pt} from "../geom";
import {Rimmed} from "../sil";

type V2 = [number, number];
// ---------- small helpers ----------
const ease = (f: number, a: number, d: number) => interpolate(f, [a, a + Math.max(0.001, d)], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
const sstep = (v: number) => { const t = clamp01(v); return t * t * (3 - 2 * t); };
// Smooth 1D noise from a few incommensurate sines, in about [-1, 1].
const wob = (t: number, s = 0) => Math.sin(t + s * 1.7) * 0.5 + Math.sin(t * 2.31 + s * 3.1) * 0.3 + Math.sin(t * 4.07 + s * 5.3) * 0.2;
const uid = () => "fl" + useId().replace(/[^a-zA-Z0-9]/g, "");
const MOODS: Mood[] = ["dusk", "dawn", "night", "gold"];
const moodOf = (s: any, d: Mood): Mood => (MOODS.includes(s?.mood) ? s.mood : d);
// The cool ambient that the warm light plays against, per mood.
const AMB: Record<Mood, string> = {night: "#6E78B0", dusk: "#9A5A8A", dawn: "#7A8AC0", gold: "#B07A6A"};
// A skyline through points, closed down to the bottom of the frame (yb).
const ridge = (pts: Pt[], yb = H + 80): string => `${smooth(pts, false)} L ${pts[pts.length - 1][0]} ${yb} L ${pts[0][0]} ${yb} Z`;
// A leaf blade along a curved midline (base to tip), widest a third of the way up.
const blade = (pts: number[][], wmax: number): string => {
  const n = pts.length, L: Pt[] = [], R: Pt[] = [];
  for (let i = 1; i < n - 1; i++) {
    const u = i / (n - 1), [nx, ny] = nrmAt(pts, i), w = wmax * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.75)), 0.9);
    L.push([pts[i][0] + nx * w, pts[i][1] + ny * w]); R.push([pts[i][0] - nx * w, pts[i][1] - ny * w]);
  }
  return smooth([[pts[0][0], pts[0][1], "c"], ...L, [pts[n - 1][0], pts[n - 1][1], "c"], ...R.reverse()]);
};
const isDeva = (t: string) => /[\u0900-\u097F]/.test(t);

// Shared soft lights. Every glow, shadow and smoke puff is an ellipse filled with one of these.
const SMOKES: [string, string][] = [["fl-sm-warm", "#8A5446"], ["fl-sm-mid", "#4C3C56"], ["fl-sm-cool", "#2C2842"], ["fl-sm-pale", "#7A7290"], ["fl-sm-ash", "#9A92A0"]];
const FlameDefs: React.FC = () => (
  <defs>
    <radialGradient id="fl-warm"><stop offset="0" stopColor="#FFEFC4" stopOpacity={0.8}/><stop offset="0.18" stopColor="#FFC877" stopOpacity={0.42}/><stop offset="0.48" stopColor="#F0904A" stopOpacity={0.13}/><stop offset="1" stopColor="#C2553A" stopOpacity={0}/></radialGradient>
    <radialGradient id="fl-soft"><stop offset="0" stopColor="#FFC877" stopOpacity={0.5}/><stop offset="0.5" stopColor="#E8904A" stopOpacity={0.18}/><stop offset="1" stopColor="#C2553A" stopOpacity={0}/></radialGradient>
    <radialGradient id="fl-hot"><stop offset="0" stopColor="#FFFDF2"/><stop offset="0.3" stopColor="#FFE9B8" stopOpacity={0.75}/><stop offset="1" stopColor="#FFC877" stopOpacity={0}/></radialGradient>
    <radialGradient id="fl-ember"><stop offset="0" stopColor="#FFB060" stopOpacity={0.95}/><stop offset="0.35" stopColor="#F0602A" stopOpacity={0.55}/><stop offset="1" stopColor="#A0301E" stopOpacity={0}/></radialGradient>
    <radialGradient id="fl-shade"><stop offset="0" stopColor="#030108" stopOpacity={0.8}/><stop offset="0.5" stopColor="#030108" stopOpacity={0.4}/><stop offset="1" stopColor="#030108" stopOpacity={0}/></radialGradient>
    <radialGradient id="fl-cool"><stop offset="0" stopColor="#DDE2F2" stopOpacity={0.55}/><stop offset="0.3" stopColor="#9AA4D8" stopOpacity={0.2}/><stop offset="1" stopColor="#6B78A8" stopOpacity={0}/></radialGradient>
    <radialGradient id="fl-blue"><stop offset="0" stopColor="#6F8CFF" stopOpacity={0.85}/><stop offset="1" stopColor="#3D5BD0" stopOpacity={0}/></radialGradient>
    <radialGradient id="fl-floor"><stop offset="0" stopColor="#F5A85A" stopOpacity={0.6}/><stop offset="0.35" stopColor="#D0703A" stopOpacity={0.3}/><stop offset="0.7" stopColor="#8E3D52" stopOpacity={0.1}/><stop offset="1" stopColor="#4A2B5C" stopOpacity={0}/></radialGradient>
    {SMOKES.map(([id, c]) => <radialGradient key={id} id={id}><stop offset="0" stopColor={c} stopOpacity={0.85}/><stop offset="0.45" stopColor={c} stopOpacity={0.55}/><stop offset="1" stopColor={c} stopOpacity={0}/></radialGradient>)}
    <radialGradient id="fl-sm-body"><stop offset="0" stopColor="#3A3246" stopOpacity={0.97}/><stop offset="0.66" stopColor="#362E42" stopOpacity={0.92}/><stop offset="0.86" stopColor="#30283C" stopOpacity={0.4}/><stop offset="1" stopColor="#30283C" stopOpacity={0}/></radialGradient>
    <linearGradient id="fl-down" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#030108" stopOpacity={0.6}/><stop offset="1" stopColor="#030108" stopOpacity={0}/></linearGradient>
    <linearGradient id="fl-fade-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={K.rim} stopOpacity={0}/><stop offset="0.5" stopColor={K.rim}/><stop offset="1" stopColor={K.rim} stopOpacity={0}/></linearGradient>
    <linearGradient id="fl-fade-h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={K.rim} stopOpacity={0}/><stop offset="0.5" stopColor={K.rim}/><stop offset="1" stopColor={K.rim} stopOpacity={0}/></linearGradient>
  </defs>
);
const Glow: React.FC<{x: number; y: number; rx: number; ry?: number; g?: string; o?: number}> = ({x, y, rx, ry, g = "fl-warm", o = 1}) =>
  o <= 0.002 || rx <= 0 ? null : <ellipse cx={x} cy={y} rx={rx} ry={ry ?? rx} fill={`url(#${g})`} opacity={Math.min(1, o)}/>;

// ---------- the flame ----------
// Outline of a flame standing on (x, y), height h, half-width w; it bends with lean and sways by sway (a wave up the flame).
const flameOutline = (x: number, y: number, h: number, w: number, lean: number, sway: number, t: number): string => {
  const N = 12, L: Pt[] = [], R: Pt[] = [];
  let tip: Pt = [x, y - h, "c"];
  for (let i = 1; i <= N; i++) {
    const u = i / N;
    const hw = u < 0.24 ? w * Math.sqrt(Math.max(0, 1 - Math.pow((0.24 - u) / 0.24, 2))) : w * Math.pow((1 - u) / 0.76, 1.15);
    const cx = x + lean * h * u * u + sway * h * Math.pow(u, 1.6) * Math.sin(t - u * 3.2);
    const cy = y - h * u;
    if (i === N) { tip = [cx, cy, "c"]; continue; }
    L.push([cx - hw, cy]); R.push([cx + hw, cy]);
  }
  return smooth([[x, y + w * 0.08], ...R, tip, ...L.reverse()] as Pt[]);
};
// A lamp flame: halo, two soft fringes, the gold body, a white core and a blue root. b: brightness 0..1+ (0 = gone).
const Flame: React.FC<{x: number; y: number; h: number; w?: number; lean?: number; sway?: number; t?: number; b?: number; halo?: number}> =
  ({x, y, h, w = h * 0.2, lean = 0, sway = 0, t = 0, b = 1, halo = 1}) => {
  const id = uid();
  if (b <= 0.001 || h < 0.5) return null;
  const tip = [x + lean * h, y - h];
  return (
    <g>
      <defs>
        <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1={x} y1={y + 2} x2={tip[0]} y2={tip[1]}>
          <stop offset="0" stopColor="#FF8A3A" stopOpacity={0.2}/>
          <stop offset="0.12" stopColor="#FFB45A" stopOpacity={0.95}/>
          <stop offset="0.4" stopColor="#FFD889"/>
          <stop offset="0.75" stopColor="#FFB451"/>
          <stop offset="1" stopColor="#F07A35" stopOpacity={0.8}/>
        </linearGradient>
        <radialGradient id={`${id}c`} gradientUnits="userSpaceOnUse" cx={x + lean * h * 0.1} cy={y - h * 0.2} r={h * 0.5}>
          <stop offset="0" stopColor="#FFFFF6"/><stop offset="0.55" stopColor="#FFF4D0" stopOpacity={0.9}/><stop offset="1" stopColor="#FFE2A0" stopOpacity={0}/>
        </radialGradient>
      </defs>
      {halo > 0 ? <Glow x={x + lean * h * 0.4} y={y - h * 0.45} rx={h * 5.5} o={halo * b}/> : null}
      <Glow x={x + lean * h * 0.3} y={y - h * 0.42} rx={h * 1.1} ry={h * 1.25} g="fl-soft" o={0.9 * b}/>
      <g opacity={Math.min(1, b * 1.15)}>
        <path d={flameOutline(x, y + h * 0.05, h * 1.16, w * 2.0, lean, sway, t)} fill="#F59A45" opacity={0.12}/>
        <path d={flameOutline(x, y + h * 0.03, h * 1.07, w * 1.42, lean, sway, t)} fill="#FFB45A" opacity={0.24}/>
        <path d={flameOutline(x, y, h, w, lean, sway, t)} fill={`url(#${id}g)`}/>
        <path d={flameOutline(x, y - h * 0.03, h * 0.64, w * 0.6, lean * 0.7, sway * 0.7, t)} fill={`url(#${id}c)`}/>
        <ellipse cx={x} cy={y - h * 0.05} rx={w * 0.7} ry={h * 0.11} fill="url(#fl-blue)" opacity={0.55}/>
      </g>
    </g>
  );
};

// ---------- the clay lamp (diya), seen from the front and a little above; the spout points at us ----------
// Origin: the centre of the rim. The wick tip (the flame's root) is at (0, 17) * s; the foot at (0, 56) * s.
const DIYA_BODY = smooth([[-78, -2], [-76, 10], [-66, 26], [-48, 40], [-26, 48], [-18, 56, "c"], [18, 56, "c"], [26, 48], [48, 40], [66, 26], [76, 10], [78, -2], [70, -12], [40, -19], [0, -21], [-40, -19], [-70, -12]]);
const DIYA_OPEN = smooth([[-66, -2], [-50, -12], [0, -16], [50, -12], [66, -2], [48, 8], [14, 12], [0, 20], [-14, 12], [-48, 8]]);
const DIYA_LIP = smooth([[-70, -1], [-48, 11], [-16, 15], [-6, 22], [0, 27, "c"], [6, 22], [16, 15], [48, 11], [70, -1], [72, 6], [50, 18], [18, 22], [8, 30], [0, 34, "c"], [-8, 30], [-18, 22], [-50, 18], [-72, 6]]);
const Diya: React.FC<{x: number; y: number; s?: number; lit?: number; cold?: boolean; shadow?: number}> = ({x, y, s = 1, lit = 1, cold = false, shadow = 1}) => {
  const id = uid();
  const warm = cold ? "#7A84B0" : K.rim, L = Math.min(1, lit);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={cold ? "#272236" : "#4A2418"}/><stop offset="0.35" stopColor={cold ? "#17131F" : "#26120F"}/><stop offset="1" stopColor="#0C070B"/></linearGradient>
        <radialGradient id={`${id}o`} cx="0.5" cy="0.75" r="0.6"><stop offset="0" stopColor={cold ? "#3A3550" : "#FFD68A"} stopOpacity={cold ? 0.4 : 0.9 * L}/><stop offset="0.4" stopColor={cold ? "#1E1A2A" : "#9A5A22"} stopOpacity={0.85}/><stop offset="1" stopColor="#1A0E0C"/></radialGradient>
      </defs>
      {shadow > 0 ? <ellipse cx={0} cy={56} rx={112} ry={13} fill="url(#fl-shade)" opacity={0.85 * shadow}/> : null}
      <path d={DIYA_BODY} fill={`url(#${id}b)`}/>
      {/* incised bands on the belly, catching the light */}
      <path d="M -70 20 Q 0 44 70 20" fill="none" stroke={warm} strokeWidth={1} opacity={cold ? 0.12 : 0.24 * L}/>
      <path d="M -58 32 Q 0 52 58 32" fill="none" stroke={warm} strokeWidth={0.8} opacity={cold ? 0.08 : 0.14 * L}/>
      <path d={DIYA_BODY} fill="none" stroke={warm} strokeWidth={1.4} opacity={cold ? 0.2 : 0.3 * L}/>
      <path d={DIYA_OPEN} fill={`url(#${id}o)`}/>
      {!cold ? <ellipse cx={0} cy={2} rx={24} ry={4} fill="url(#fl-hot)" opacity={0.6 * L}/> : null}
      <path d={DIYA_LIP} fill={cold ? "#2A2438" : "#6A3020"}/>
      <path d={DIYA_LIP} fill="none" stroke={warm} strokeWidth={1.5} opacity={cold ? 0.32 : 0.85 * L}/>
      <path d={ribbon([[0, -2], [1, 6], [-1, 12], [0, 18]], 5, 3.5)} fill="#2A1A14"/>
      <circle cx={0} cy={17} r={2.6} fill={cold ? "#4A3A3A" : "#FF7A2A"} opacity={cold ? 0.6 : L}/>
    </g>
  );
};

// ---------- stone ----------
// An ashlar wall: courses of blocks of uneven height and tone, mortar grooves, and a lit lip on the side of each joint
// facing the light (lx, ly).
const AshlarWall: React.FC<{lx: number; ly: number; seed?: number; light?: number; base?: string; lit?: string; reach?: number}> =
  ({lx, ly, seed = 1, light = 1, base = "#150E1E", lit = "#FFCB86", reach = 760}) => {
  const x0 = -80, x1 = W + 80, y0 = -80, y1 = H + 80;
  const blocks: React.ReactNode[] = [], joints: string[] = [], lips: [string, number][] = [], chips: React.ReactNode[] = [];
  let r = 0, y = y0;
  while (y < y1) {
    const course = 80 + rnd(r, seed + 9) * 34;
    let x = x0 - rnd(r, seed) * 200, c = 0;
    while (x < x1) {
      const w = 170 + rnd(r * 31 + c, seed + 2) * 190, sh = rnd(r * 17 + c, seed + 3);
      blocks.push(<rect key={`${r}-${c}`} x={x} y={y} width={w} height={course} fill={base} opacity={0.7 + sh * 0.3}/>);
      joints.push(`M ${x.toFixed(1)} ${y.toFixed(1)} l 0 ${course.toFixed(1)}`);
      const d = Math.hypot(x - lx, y + course / 2 - ly), a = Math.max(0, 1 - d / reach);
      if (a > 0.02) lips.push([`M ${(x + (x < lx ? 3 : -3)).toFixed(1)} ${(y + 5).toFixed(1)} l 0 ${(course - 10).toFixed(1)}`, a]);
      // weathering: a couple of chips in each block
      for (let k = 0; k < 2; k++) {
        const cx = x + 16 + rnd(r * 7 + c * 3 + k, seed + 5) * (w - 32), cy = y + 10 + rnd(r * 5 + c * 11 + k, seed + 6) * (course - 20);
        chips.push(<ellipse key={`${r}-${c}-${k}`} cx={cx} cy={cy} rx={3 + rnd(c + k, r + 4) * 9} ry={1.5 + rnd(c * 3 + k, r) * 3} fill="#05030A" opacity={0.35}/>);
      }
      x += w; c++;
    }
    joints.push(`M ${x0} ${y.toFixed(1)} L ${x1} ${y.toFixed(1)}`);
    const a = Math.max(0, 1 - Math.abs(y - ly) / reach);
    if (a > 0.02) lips.push([`M ${Math.max(x0, lx - reach)} ${(y + (y > ly ? 3.5 : -3.5)).toFixed(1)} L ${Math.min(x1, lx + reach)} ${(y + (y > ly ? 3.5 : -3.5)).toFixed(1)}`, a]);
    y += course; r++;
  }
  return (
    <g>
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="#08060F"/>
      {blocks}
      {chips}
      <path d={joints.join(" ")} stroke="#040208" strokeWidth={4} fill="none" opacity={0.8}/>
      {light > 0 ? lips.map(([d, a], i) => <path key={i} d={d} stroke={lit} strokeWidth={1.4} fill="none" opacity={a * a * 0.36 * light}/>) : null}
    </g>
  );
};

// The horseshoe (chaitya) arch of a temple niche: from the left springing over the apex to the right one.
const archPts = (cx: number, hw: number, ySpr: number, yApex: number, bulge = 0.06): Pt[] => {
  const h = ySpr - yApex, b = hw * bulge;
  const half: Pt[] = [[cx - hw, ySpr], [cx - hw - b, ySpr - h * 0.3], [cx - hw * 0.9 - b * 0.4, ySpr - h * 0.62], [cx - hw * 0.6, ySpr - h * 0.86], [cx - hw * 0.24, ySpr - h * 0.975]];
  const right = half.map(([x, y]) => [2 * cx - x, y] as Pt).reverse();
  return [...half, [cx, yApex, "c"], ...right];
};
const nicheShape = (cx: number, hw: number, yFloor: number, ySpr: number, yApex: number, bulge?: number) =>
  smooth([[cx - hw, yFloor, "c"], ...archPts(cx, hw, ySpr, yApex, bulge), [cx + hw, yFloor, "c"]]);

// ---------- the restless night: peepal leaves and grit blown across ----------
const PEEPAL: Pt[] = [[0, 0, "c"], [-0.03, -0.14], [0.04, -0.3], [0.18, -0.38], [0.34, -0.36], [0.5, -0.26], [0.64, -0.15], [0.8, -0.05], [1, 0, "c"], [0.8, 0.05], [0.64, 0.15], [0.5, 0.26], [0.34, 0.36], [0.18, 0.38], [0.04, 0.3], [-0.03, 0.14]];
const leafPath = (L: number, narrow = 1): string => smooth(PEEPAL.map((p) => [p[0] * L, p[1] * L * narrow, p[2]] as Pt))
  + " " + ribbon([[L * 0.03, 0], [-L * 0.14, L * 0.02], [-L * 0.3, L * 0.07]], L * 0.04, L * 0.018);
// Leaves tumbling across in the wind, in bands above and below the niche, rim-lit when they pass near the light.
const Leaves: React.FC<{f: number; n?: number; wind?: number; lx: number; ly: number; seed?: number; bands: [number, number][]}> = ({f, n = 6, wind = 1, lx, ly, seed = 0, bands}) => (
  <g>
    {Array.from({length: n}, (_, i) => {
      const k = i + seed * 50, sc = 0.5 + rnd(k, 62) * 0.4, band = bands[i % bands.length];
      const vx = (9 + rnd(k, 63) * 7) * wind, span = W + 700;
      const x = ((f * vx + rnd(k, 64) * span) % span) - 350;
      const y = band[0] + rnd(k, 65) * (band[1] - band[0]) + Math.sin(f / 17 + k) * 30 * wind + (x / W) * (rnd(k, 66) - 0.3) * 120;
      const rot = f * (4 + rnd(k, 67) * 6) * wind * (rnd(k, 68) < 0.5 ? 1 : -1) + rnd(k, 69) * 360, flip = Math.cos(f / (6 + rnd(k, 70) * 4) + k);
      const tr = `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${sc} ${(sc * (0.18 + 0.82 * Math.abs(flip))).toFixed(3)})`;
      const lit = Math.max(0, 1 - Math.hypot(x - lx, y - ly) / 760);
      return <Rimmed key={i} paths={[leafPath(70, 0.75 + rnd(k, 71) * 0.2)]} transform={tr} light={[lx - x, ly - y]} fill="#0E0814" rim={lit > 0.06 ? "#E8A868" : "#5A5884"} w={1.8 / sc}/>;
    })}
  </g>
);
// Grit and seed-fluff streaking sideways in the wind: thin tapered streaks.
const Gust: React.FC<{f: number; n?: number; wind?: number; lx: number; ly: number; y0?: number; y1?: number}> = ({f, n = 60, wind = 1, lx, ly, y0 = 120, y1 = 960}) => (
  <g>{Array.from({length: n}, (_, i) => {
    const vx = (14 + rnd(i, 81) * 18) * wind, span = W + 300, x = ((f * vx + rnd(i, 82) * span) % span) - 150;
    const y = y0 + rnd(i, 83) * (y1 - y0) + Math.sin(f / 9 + i) * 10, len = vx * (1.6 + rnd(i, 84) * 1.4), d = Math.hypot(x - lx, y - ly), a = 0.08 + Math.max(0, 1 - d / 650) * 0.5;
    return <path key={i} d={ribbon([[x - len, y - len * 0.05], [x - len * 0.5, y - len * 0.02], [x, y]], 0.1, 1 + rnd(i, 85) * 1.6)} fill={d < 650 ? "#FFD9A0" : "#9AA0C8"} opacity={a * (0.4 + 0.6 * rnd(i, 86))}/>;
  })}</g>
);
// A peepal twig reaching in from a corner, tossing in the wind: crisp silhouette, faint warm rim from the lamp.
const Twig: React.FC<{f: number; x: number; y: number; s?: number; flip?: boolean; wind?: number; seed?: number; light: V2; rim?: string}> =
  ({f, x, y, s = 1, flip = false, wind = 1, seed = 0, light, rim = "#B88A62"}) => {
  const sw = (Math.sin(f / 16 + seed) * 2.6 + Math.sin(f / 6.3 + seed * 2) * 1.1) * wind;
  const stem: number[][] = [[0, 0], [-70, 34], [-150, 64], [-232, 84], [-312, 112], [-380, 160], [-428, 222], [-452, 290]];
  const items: {d: string; t: string}[] = [];
  for (let i = 0; i < 13; i++) {
    const p = stem[1 + (i % 7)], side = i % 2 ? 1 : -1;
    const ang = 96 + side * 34 + rnd(i, seed + 3) * 30 + Math.sin(f / 3.4 + i * 1.3) * 15 * wind;
    const L = 66 + rnd(i, seed + 4) * 34, sy = 0.4 + 0.6 * Math.abs(Math.cos(f / 4.6 + i * 0.9));
    items.push({d: leafPath(L, 0.78), t: `translate(${p[0] + side * 8} ${p[1] + 6}) rotate(${ang.toFixed(1)}) scale(1 ${sy.toFixed(3)})`});
  }
  const lv: V2 = [flip ? -light[0] : light[0], light[1]];
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) rotate(${sw.toFixed(2)})`}>
      <Rimmed paths={[ribbon(stem, 13, 4), ...items]} light={lv} fill="#07040B" rim={rim} w={1.6 / s}/>
    </g>
  );
};

// Smoke above a burning flame: one straight thread in still air, torn curls in the wind.
const SmokeThread: React.FC<{x: number; y: number; f: number; top: number; mode: "thread" | "torn"}> = ({x, y, f, top, mode}) => {
  const id = uid(), N = 30, pts: number[][] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N, yy = lerp(y, top, u);
    const dx = mode === "thread" ? Math.pow(u, 3) * 6 * Math.sin(f / 30 + u * 6) : u * 70 * Math.sin(f / 6 - u * 8) + u * u * 180;
    pts.push([x + dx, yy]);
  }
  return (
    <g>
      <defs><linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x} y1={y} x2={x} y2={top}><stop offset="0" stopColor="#E9D8C0" stopOpacity={0}/><stop offset="0.06" stopColor="#F0E2CC" stopOpacity={0.55}/><stop offset="0.7" stopColor="#B8A8B8" stopOpacity={0.25}/><stop offset="1" stopColor="#8A80A0" stopOpacity={0}/></linearGradient></defs>
      <path d={ribbon(pts, 1.4, mode === "thread" ? 3 : 16)} fill={`url(#${id})`}/>
      {mode === "torn" ? <path d={ribbon(pts.map(([px, py]) => [px + 6, py]), 4, 34)} fill={`url(#${id})`} opacity={0.3}/> : null}
    </g>
  );
};
// The flame just gone: an ember fading on the wick and a curl of smoke unwinding up out of the niche.
const OutSmoke: React.FC<{x: number; y: number; f: number; n: number; top: number}> = ({x, y, f, n, top}) => {
  const id = uid(), ember = 1 - ease(f, 0, n * 0.5), Hh = y - top;
  const curls = [0, 1, 2].map((k) => {
    const N = 44, pts: number[][] = [], grow = 0.55 + 0.45 * Math.min(1, (f + k * 30) / 150);
    for (let i = 0; i <= N; i++) {
      const u = i / N, yy = y - u * Hh * grow;
      const dx = Math.sin(u * 8.5 - f / 20 + k * 2.1) * (3 + u * 30) + u * u * 46 * (k - 0.8);
      pts.push([x + dx, yy]);
    }
    return pts;
  });
  return (
    <g>
      <defs><linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x} y1={y} x2={x} y2={top}><stop offset="0" stopColor="#D0CCE0" stopOpacity={0.75}/><stop offset="0.45" stopColor="#A09EBE" stopOpacity={0.36}/><stop offset="1" stopColor="#7A7898" stopOpacity={0}/></linearGradient></defs>
      {curls.map((p, i) => <path key={i} d={ribbon(p, 2.2, 9 + i * 6, 1.4)} fill={`url(#${id})`} opacity={(1 - i * 0.3) * (0.45 + 0.55 * (1 - ease(f, n * 0.5, n * 0.5)))}/>)}
      <Glow x={x} y={y + 2} rx={16} g="fl-ember" o={ember * 0.8}/>
      <circle cx={x} cy={y + 2} r={2.4} fill="#FFB060" opacity={ember}/>
    </g>
  );
};

// A temple pilaster in shallow relief: base mouldings, shaft, a bracket capital; the edge facing the lamp lit.
const Pilaster: React.FC<{x: number; y0: number; y1: number; w: number; side: number; lit: number; cold?: boolean}> = ({x, y0, y1, w, side, lit, cold}) => {
  const stone = cold ? "#15132A" : "#1E1424", rim = cold ? "#7880AA" : K.rim;
  const parts: [number, number, number][] = [[y1 - 26, 26, w + 22], [y1 - 40, 14, w + 10], [y0 + 34, y1 - 40 - (y0 + 34), w], [y0 + 20, 14, w + 12], [y0, 20, w + 34]];
  return (
    <g>
      {parts.map(([yy, hh, ww], i) => <g key={i}>
        <rect x={x - ww / 2} y={yy} width={ww} height={hh} fill={stone}/>
        <rect x={side > 0 ? x + ww / 2 - 2 : x - ww / 2} y={yy + 1} width={2} height={hh - 2} fill={rim} opacity={(cold ? 0.16 : 0.45) * lit}/>
        <rect x={x - ww / 2} y={yy + hh - 2} width={ww} height={2} fill="#000" opacity={0.45}/>
      </g>)}
      {[-0.25, 0, 0.25].map((k, i) => <rect key={i} x={x + k * w - 1} y={y0 + 40} width={2} height={y1 - y0 - 86} fill="#000" opacity={0.3}/>)}
    </g>
  );
};

// ---------- 6.19: the lamp in the niche ----------
const LampNiche: React.FC<SceneP & {mode: string}> = ({s, n, mode}) => {
  const f = useCurrentFrame();
  const mood = moodOf(s, "night"), amb = AMB[mood];
  const cold = mode === "out", flick = mode === "flicker";
  const wind = flick ? 1.6 : cold ? 0.9 : 1.15;
  const NX = 960, HW = 250, FLOOR = 792, SPR = 486, APEX = 268, J = 34;
  const DY = 712, DS = 1.25, FX = NX, FY = DY + 17 * DS;
  // still: only a faint breath; flicker: the restless mind, the flame thrown about and the light jumping with it
  const lean = flick ? wob(f * 0.15, 1) * 0.62 + 0.15 : 0;
  const sway = flick ? 0.18 + 0.1 * wob(f * 0.2, 2) : 0.004 * Math.sin(f / 23);
  const hF = flick ? 118 * (0.66 + 0.42 * (0.5 + 0.5 * wob(f * 0.21, 3))) : 118 * (1 + 0.012 * Math.sin(f / 37));
  const bright = cold ? 0 : flick ? 0.62 + 0.38 * (0.5 + 0.5 * wob(f * 0.27, 4)) : 1 + 0.025 * Math.sin(f / 41);
  const lx = FX + lean * hF * 0.6, ly = FY - hF * 0.5;
  const z = push(f, n, 1, flick ? 1.04 : 1.07);
  const front = nicheShape(NX, HW, FLOOR, SPR, APEX);
  const back = nicheShape(NX, HW - J, FLOOR - 24, SPR + 6, APEX + 40);
  const id = uid();
  const stone = cold ? "#17152A" : "#201424", rim = cold ? "#8088B4" : K.rim;
  const L = cold ? 0 : bright;
  return (
    <Frame f={f} zoom={z} cx={FX} cy={FY - 80}>
      <FlameDefs/>
      <defs>
        <radialGradient id={`${id}w`} cx={lx} cy={ly} r={1000} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFC878" stopOpacity={0.55}/><stop offset="0.14" stopColor="#E8904A" stopOpacity={0.3}/><stop offset="0.4" stopColor="#8E3D52" stopOpacity={0.1}/><stop offset="1" stopColor="#2E2350" stopOpacity={0}/>
        </radialGradient>
        <radialGradient id={`${id}d`} cx={NX} cy={FY - 140} r={1250} gradientUnits="userSpaceOnUse">
          <stop offset="0.22" stopColor="#030108" stopOpacity={0}/><stop offset="0.62" stopColor="#030108" stopOpacity={0.5}/><stop offset="1" stopColor="#030108" stopOpacity={0.88}/>
        </radialGradient>
        <radialGradient id={`${id}n`} cx={lx} cy={ly + 10} r={340} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE2A4"/><stop offset="0.22" stopColor="#EAA455"/><stop offset="0.55" stopColor="#8A4430"/><stop offset="1" stopColor="#2A1626"/>
        </radialGradient>
        <radialGradient id={`${id}c`} cx={NX - 620} cy={-120} r={1500} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={amb} stopOpacity={0.26}/><stop offset="0.6" stopColor={amb} stopOpacity={0.07}/><stop offset="1" stopColor={amb} stopOpacity={0}/>
        </radialGradient>
        <linearGradient id={`${id}j`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#000" stopOpacity={0.6}/><stop offset="0.5" stopColor="#000" stopOpacity={0}/><stop offset="1" stopColor="#000" stopOpacity={0.6}/></linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={cold ? "#201E34" : "#3A2226"}/><stop offset="0.5" stopColor={cold ? "#15132A" : "#24151C"}/><stop offset="1" stopColor={cold ? "#0E0C1A" : "#140C14"}/></linearGradient>
        <clipPath id={`${id}k`}><path d={front}/></clipPath>
        <clipPath id={`${id}o`}><path d={`M -200 -200 L ${W + 200} -200 L ${W + 200} ${H + 200} L -200 ${H + 200} Z ${nicheShape(NX, HW + 96, FLOOR + 50, SPR, APEX - 100)}`} clipRule="evenodd"/></clipPath>
      </defs>
      {/* the wall: stone, cool night from the upper left, the lamp's warmth, and darkness closing in at the edges */}
      <AshlarWall lx={lx} ly={ly} light={L} base={cold ? "#12101F" : "#150E1E"}/>
      <rect x={-100} y={-100} width={W + 200} height={H + 200} fill={`url(#${id}c)`} opacity={cold ? 1.6 : 1}/>
      {!cold ? <rect x={-100} y={-100} width={W + 200} height={H + 200} fill={`url(#${id}w)`} opacity={bright}/> : null}
      {/* the cornice above and the pilasters either side */}
      <rect x={NX - HW - 230} y={APEX - 168} width={2 * HW + 460} height={44} fill={stone}/>
      <rect x={NX - HW - 230} y={APEX - 126} width={2 * HW + 460} height={3} fill={rim} opacity={cold ? 0.18 : 0.5 * bright}/>
      <rect x={NX - HW - 200} y={APEX - 123} width={2 * HW + 400} height={26} fill="url(#fl-down)" opacity={0.8}/>
      <rect x={NX - HW - 214} y={APEX - 186} width={2 * HW + 428} height={18} fill={stone}/>
      {[-1, 1].map((sd) => <Pilaster key={sd} x={NX + sd * (HW + 150)} y0={APEX - 122} y1={FLOOR} w={58} side={-sd} lit={cold ? 1 : bright} cold={cold}/>)}
      {/* the moulded frame of the arch: three bands, each with a lit inner edge */}
      {[[96, 30], [62, 14], [36, 20]].map(([o, bw], i) => {
        const outer = nicheShape(NX, HW + o, FLOOR, SPR, APEX - o * 1.05), inner = nicheShape(NX, HW + o - bw, FLOOR, SPR, APEX - (o - bw) * 1.05);
        return <g key={i}>
          <path d={`${outer} ${inner}`} fillRule="evenodd" fill={stone}/>
          <path d={inner} fill="none" stroke={rim} strokeWidth={1.5} opacity={cold ? 0.15 : 0.5 * bright}/>
          <path d={outer} fill="none" stroke="#05030A" strokeWidth={3} opacity={0.8}/>
        </g>;
      })}
      {/* the recess: jambs and soffit, then the back wall, then the floor */}
      <path d={front} fill={cold ? "#0E0C1A" : "#341A22"}/>
      <g clipPath={`url(#${id}k)`}>
        <path d={front} fill={`url(#${id}n)`} opacity={cold ? 0 : 0.75 * bright}/>
        <rect x={NX - HW} y={APEX} width={HW * 2} height={FLOOR - APEX} fill={`url(#${id}j)`}/>
        <path d={back} fill={cold ? "#0B0915" : `url(#${id}n)`}/>
        <path d={back} fill="none" stroke="#000" strokeWidth={16} opacity={0.14}/>
        <path d={back} fill="none" stroke="#000" strokeWidth={6} opacity={0.24}/>
        <path d={`M ${NX - HW} ${FLOOR} L ${NX - HW + J} ${FLOOR - 24} L ${NX + HW - J} ${FLOOR - 24} L ${NX + HW} ${FLOOR} Z`} fill={cold ? "#161424" : "#9A5E36"} opacity={cold ? 1 : 0.9 * Math.min(1, bright)}/>
        {cold ? <rect x={NX - HW} y={APEX} width={HW * 2} height={FLOOR - APEX} fill={amb} opacity={0.06}/> : null}
        {/* the lamp's shadow on the floor, swinging when the flame leans */}
        <ellipse cx={FX - lean * 60} cy={FLOOR - 9} rx={128} ry={12} fill="url(#fl-shade)" opacity={cold ? 0.4 : 0.8}/>
      </g>
      {/* the sill: a projecting stone ledge */}
      <path d={`M ${NX - HW - 140} ${FLOOR} L ${NX + HW + 140} ${FLOOR} L ${NX + HW + 154} ${FLOOR + 12} L ${NX - HW - 154} ${FLOOR + 12} Z`} fill={cold ? "#24223A" : "#5E3A2C"} opacity={cold ? 0.9 : 0.85 * Math.min(1, bright)}/>
      <rect x={NX - HW - 154} y={FLOOR + 12} width={HW * 2 + 308} height={38} fill={`url(#${id}s)`}/>
      <rect x={NX - HW - 154} y={FLOOR + 12} width={HW * 2 + 308} height={2} fill={rim} opacity={cold ? 0.26 : 0.55 * bright}/>
      <rect x={NX - HW - 154} y={FLOOR + 30} width={HW * 2 + 308} height={2.5} fill="#05030A" opacity={0.6}/>
      <rect x={NX - HW - 130} y={FLOOR + 50} width={HW * 2 + 260} height={18} fill="#100A16"/>
      <rect x={NX - HW - 154} y={FLOOR + 50} width={HW * 2 + 308} height={34} fill="url(#fl-down)"/>
      {/* darkness closing in from the edges of the frame */}
      <rect x={-100} y={-100} width={W + 200} height={H + 200} fill={`url(#${id}d)`}/>
      {/* the lamp and its flame */}
      <Diya x={FX} y={DY} s={DS} lit={bright} cold={cold} shadow={0}/>
      {!cold ? <>
        <SmokeThread x={FX + lean * hF} y={FY - hF} f={f} top={APEX + 44} mode={flick ? "torn" : "thread"}/>
        <Flame x={FX} y={FY} h={hF} w={hF * 0.2} lean={lean} sway={sway} t={flick ? f / 2.2 : f / 4} b={bright} halo={1.05}/>
      </> : <OutSmoke x={FX} y={FY - 2} f={f} n={n} top={APEX + 30}/>}
      {/* the wind outside the niche: streaks (never inside the recess), leaves, a twig at the corner */}
      <g clipPath={`url(#${id}o)`}><Gust f={f} wind={wind} lx={lx} ly={ly} n={flick ? 80 : 50}/></g>
      <Leaves f={f} n={flick ? 9 : 7} wind={wind} lx={lx} ly={ly} seed={1} bands={[[40, 150], [880, 1010], [330, 520], [60, 170], [860, 990], [560, 640]]}/>
      <Twig f={f} x={W + 40} y={-40} s={1.35} wind={wind} seed={1} light={[lx - (W - 200), ly - 100]} rim={cold ? "#6A6E98" : "#B88A62"}/>
    </Frame>
  );
};

// ---------- the stair of lamps: ghat steps in silhouette, lamps kindling one after another up to the shrine ----------
// A Nagara shrine in silhouette: a curvilinear tower (shikhara) ribbed with courses, an amalaka disc, a kalasha finial;
// the doorway glows with the light inside. y is the base; s scales (s = 1 ~ 520 tall).
const SHRINE_TOWER = smooth([[-150, 0, "c"], [-150, -150, "c"], [-130, -150, "c"], [-126, -230], [-112, -310], [-88, -380], [-58, -428], [-40, -440, "c"], [40, -440, "c"], [58, -428], [88, -380], [112, -310], [126, -230], [130, -150, "c"], [150, -150, "c"], [150, 0, "c"]]);
const SHRINE_AMALAKA = smooth([[-56, -440], [-50, -458], [0, -466], [50, -458], [56, -440], [0, -432]]);
const SHRINE_FINIAL = smooth([[-8, -466], [-18, -484], [-10, -500], [0, -526, "c"], [10, -500], [18, -484], [8, -466]]);
const Shrine: React.FC<{x: number; y: number; s: number; glow: number; light: V2; rim?: string}> = ({x, y, s, glow, light, rim = "#9AA4D8"}) => {
  const ribs = Array.from({length: 9}, (_, k) => { const yy = -170 - k * 30, ww = 128 - Math.pow(k / 9, 1.8) * 86; return `M ${-ww} ${yy} L ${ww} ${yy}`; }).join(" ");
  const door = `M -40 0 L -40 -96 Q -40 -128 0 -136 Q 40 -128 40 -96 L 40 0 Z`;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Glow x={0} y={-70} rx={330} ry={220} o={0.45 * glow}/>
      <Rimmed paths={[SHRINE_TOWER, SHRINE_AMALAKA, SHRINE_FINIAL]} light={light} fill="#110A18" rim={rim} w={3 / s}/>
      <path d={ribs} stroke="#000" strokeWidth={3} opacity={0.5}/>
      <path d={ribs} stroke={rim} strokeWidth={1} opacity={0.1} transform="translate(0 -3)"/>
      <path d={door} fill="#FFC27A" opacity={0.2 + 0.7 * glow}/>
      <Glow x={0} y={-50} rx={70} ry={90} g="fl-hot" o={0.65 * glow}/>
    </g>
  );
};
const LampStair: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const mood = moodOf(s, "night"), amb = AMB[mood];
  const N = Math.max(2, Math.min(14, Math.round(Number(s.count) || 7)));
  const id = uid();
  const moon: V2 = [340, 250];
  const X0 = 150, Y0 = 1000, X1 = 1470, Y1 = 520;
  const run = (X1 - X0) / N, rise = (Y0 - Y1) / N;
  const tread = (i: number) => ({xa: X0 + i * run, xb: X0 + (i + 1) * run, y: Y0 - (i + 1) * rise});
  const seg: string[] = [`M -80 ${Y0}`, `L ${X0} ${Y0}`];
  for (let i = 0; i < N; i++) { const t = tread(i); seg.push(`L ${t.xa.toFixed(1)} ${t.y.toFixed(1)}`, `L ${t.xb.toFixed(1)} ${t.y.toFixed(1)}`); }
  seg.push(`L ${W + 80} ${Y1}`, `L ${W + 80} ${H + 80}`, `L -80 ${H + 80} Z`);
  const stair = seg.join(" ");
  const ds = Math.max(0.3, Math.min(0.56, run / 330));
  const pos = (i: number): V2 => { const t = tread(i); return [t.xa + run * 0.52, t.y]; };
  // the kindling: lamp i catches at T[i] (the first is already burning); a spark carries the light from lamp i-1 to i
  const T = Array.from({length: N}, (_, i) => (i === 0 ? -30 : lerp(n * 0.06, n * 0.8, (i - 1) / Math.max(1, N - 2))));
  const litOf = (i: number) => ease(f, T[i], 12);
  const litSum = T.reduce((a, _, i) => a + litOf(i), 0);
  // masonry of the stair's side wall: a course per step and staggered joints
  const joints: string[] = [];
  for (let i = 0; i < N; i++) {
    const t = tread(i);
    joints.push(`M -80 ${(t.y + rise).toFixed(1)} L ${t.xa.toFixed(1)} ${(t.y + rise).toFixed(1)}`);
    for (let x = t.xa - run * (i % 2 ? 0.2 : 0.7); x > -80; x -= run) joints.push(`M ${x.toFixed(1)} ${(t.y + rise).toFixed(1)} l 0 ${rise.toFixed(1)}`);
  }
  const shrineX = 1700;
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.05)} cx={900} cy={620}>
      <FlameDefs/>
      <Sky mood={mood} sun={moon} sunR={20} f={f} rays={0} id={`lrow${id}`} clouds={0.55}/>
      <defs>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1A1222"/><stop offset="1" stopColor="#0A0610"/></linearGradient>
        <clipPath id={`${id}k`}><path d={stair}/></clipPath>
      </defs>
      {/* far bank: a low line of trees in the haze */}
      <path d={ridge([[-60, 712], ...Array.from({length: 26}, (_, i) => [i * 80 - 20, 690 - rnd(i, 12) * 46 - (i % 3 === 0 ? 24 : 0)] as Pt), [W + 60, 700]], 740)} fill="#140F26"/>
      {/* the river below the ghat, holding a little moonlight */}
      <defs><linearGradient id={`${id}r`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#24305E"/><stop offset="1" stopColor="#0C1028"/></linearGradient></defs>
      <rect x={-60} y={738} width={W + 120} height={H - 700} fill={`url(#${id}r)`}/>
      {Array.from({length: 40}, (_, i) => { const y = 746 + Math.pow(rnd(i, 13), 1.4) * 260, x = moon[0] + (rnd(i, 14) - 0.5) * (60 + (y - 740) * 1.1), len = 10 + (y - 740) * 0.25; return <rect key={i} x={x - len / 2} y={y} width={len} height={1.6} fill="#C9CFE6" opacity={(0.15 + 0.25 * Math.sin(f / 6 + i * 2)) * (1 - (y - 740) / 320)}/>; })}
      {/* the shrine at the top of the stair */}
      <Shrine x={shrineX} y={Y1 + 2} s={0.64} glow={0.15 + 0.85 * Math.pow(litSum / N, 1.5)} light={[moon[0] - shrineX, moon[1] - Y1 + 200]} rim={AMB[mood]}/>
      {/* the stair: one dark mass, faintly rimmed by the moon on its upper-left edges */}
      <Rimmed paths={[stair]} light={[moon[0] - 900, moon[1] - 700]} fill={`url(#${id}m)`} rim={amb} w={2.2}/>
      {/* each lamp's light: a pool spilling down the stair's face, the tread it stands on and the riser behind it */}
      <g clipPath={`url(#${id}k)`}>
        {Array.from({length: N}, (_, i) => {
          const L = litOf(i); if (L <= 0) return null;
          const [x, y] = pos(i), fl = 1 + 0.04 * Math.sin(f / 9 + i * 2);
          return <Glow key={i} x={x} y={y + rise * 0.3} rx={run * 1.7} ry={rise * 3.2} o={L * 0.75 * fl}/>;
        })}
        <path d={joints.join(" ")} stroke="#05030A" strokeWidth={3} fill="none" opacity={0.75}/>
      </g>
      {Array.from({length: N}, (_, i) => {
        const L = litOf(i); if (L <= 0) return null;
        const t = tread(i);
        return <g key={i} opacity={L}>
          <rect x={t.xa} y={t.y} width={run} height={2.2} fill="url(#fl-fade-h)"/>
          {i < N - 1 ? <rect x={t.xb - 2.2} y={t.y - rise} width={2.2} height={rise} fill="url(#fl-fade-v)" opacity={0.8}/> : null}
        </g>;
      })}
      {/* the lamps */}
      {Array.from({length: N}, (_, i) => {
        const [x, y] = pos(i), L = litOf(i), fl = f - T[i];
        const flare = fl > 0 ? 1 + 0.5 * Math.max(0, 1 - fl / 16) : 1;
        const rim = y - 56 * ds;
        return <g key={i}>
          <Diya x={x} y={rim} s={ds} lit={L} cold={L < 0.05} shadow={0.6}/>
          <Flame x={x} y={rim + 17 * ds} h={92 * ds * (0.3 + 0.7 * L) * (1 + 0.015 * Math.sin(f / 7 + i))} w={18 * ds * (0.4 + 0.6 * L)} sway={0.03} t={f / 5 + i} b={L * flare} halo={0.7}/>
        </g>;
      })}
      {/* the spark that carries the light up from one lamp to the next */}
      {Array.from({length: N - 1}, (_, i) => {
        const a = Math.max(T[i] + 6, T[i + 1] - n * 0.1), b = T[i + 1], u = (f - a) / (b - a);
        if (u <= 0 || u >= 1) return null;
        const [x0, y0] = pos(i), [x1, y1] = pos(i + 1), e = sstep(u), h0 = 92 * ds;
        const px = lerp(x0, x1, e), py = lerp(y0 - 56 * ds - h0 * 0.9, y1 - 56 * ds + 10 * ds, e) - Math.sin(u * Math.PI) * rise * 1.6;
        return <g key={i}>
          {[1, 2, 3, 4].map((k) => { const uu = Math.max(0, u - k * 0.035), ee = sstep(uu); return <circle key={k} cx={lerp(x0, x1, ee)} cy={lerp(y0 - 56 * ds - h0 * 0.9, y1 - 56 * ds + 10 * ds, ee) - Math.sin(uu * Math.PI) * rise * 1.6} r={2.4 - k * 0.4} fill="#FFE2A8" opacity={0.5 - k * 0.1}/>; })}
          <Glow x={px} y={py} rx={34} g="fl-warm"/>
          <circle cx={px} cy={py} r={3.4} fill="#FFF6DC"/>
        </g>;
      })}
      <Dust f={f} sun={pos(Math.max(0, Math.min(N - 1, Math.floor(litSum) - 1)))} n={60} y0={300} y1={1000}/>
    </Frame>
  );
};

const Lamp: React.FC<SceneP> = ({s, n}) => {
  const v = s.variant || "still";
  if (v === "row") return <LampStair s={s} n={n}/>;
  return <LampNiche s={s} n={n} mode={v === "flicker" || v === "out" ? v : "still"}/>;
};

// ---------- fire: tongues of flame, sparks, smoke ----------
// One tongue of fire standing on (x, y): slender (pw > 1 thins the upper part), a sharp tip, an S-wave travelling up it.
const tongue = (x: number, y: number, h: number, w: number, lean: number, sway: number, t: number, pw = 1.7): string => {
  const N = 16, L: Pt[] = [], R: Pt[] = [];
  let tip: Pt = [x, y - h, "c"];
  for (let i = 1; i <= N; i++) {
    const u = i / N;
    const hw = u < 0.16 ? w * Math.sqrt(Math.max(0, 1 - Math.pow((0.16 - u) / 0.16, 2))) : w * Math.pow((1 - u) / 0.84, pw);
    const cx = x + lean * h * u * u + sway * h * Math.pow(u, 1.3) * Math.sin(t - u * 4.6);
    const cy = y - h * u;
    if (i === N) { tip = [cx, cy, "c"]; continue; }
    L.push([cx - hw, cy]); R.push([cx + hw, cy]);
  }
  return smooth([[x, y + w * 0.1], ...R, tip, ...L.reverse()] as Pt[]);
};
// The body of a fire: a low swelling dome the tongues rise out of.
const dome = (x: number, y: number, w: number, h: number, t: number): string => smooth([
  [x - w, y + 6, "c"], [x - w * 0.94, y - h * 0.32], [x - w * 0.72, y - h * (0.72 + 0.06 * Math.sin(t))], [x - w * 0.38, y - h * (0.95 + 0.05 * Math.sin(t * 1.3 + 1))],
  [x, y - h], [x + w * 0.38, y - h * (0.95 + 0.05 * Math.sin(t * 1.1 + 2))], [x + w * 0.72, y - h * (0.72 + 0.06 * Math.sin(t * 0.9 + 3))], [x + w * 0.94, y - h * 0.32], [x + w, y + 6, "c"]]);
type Tg = {x: number; h: number; w: number; lean: number; sway: number; t: number};
// A living fire on the line y (its base is meant to sit hidden behind a rim), half-width w, height h; k: its strength
// (0 = out, 1 = full, more = flaring). Four layers: a soft red fringe, the orange body, the gold heart, a white core.
const Blaze: React.FC<{f: number; x: number; y: number; w: number; h: number; k?: number; seed?: number; wind?: number}> = ({f, x, y, w, h, k = 1, seed = 0, wind = 0}) => {
  const id = uid();
  if (k <= 0.02) return null;
  const kk = Math.min(1.4, k), Hk = h * kk, Wk = w * (0.45 + 0.55 * Math.min(1, kk));
  const mk = (M: number, span: number, hK: number, wK: number, ph: number): Tg[] => Array.from({length: M}, (_, i) => {
    const u = i / (M - 1) - 0.5;
    const prof = 0.4 + 0.6 * Math.pow(Math.cos(u * Math.PI * 0.96), 1.5);
    const life = 0.6 + 0.4 * (0.5 + 0.5 * wob(f * 0.068 + i * 1.9 + ph, seed + i + ph));
    return {x: x + u * 2 * Wk * span + Math.sin(f * 0.03 + i + ph) * Wk * 0.04, h: Hk * hK * prof * life, w: Wk * wK * (0.85 + 0.3 * rnd(i, seed + 3 + ph)),
      lean: -u * 0.35 + wind * 0.25 + 0.1 * wob(f * 0.045 + i * 2.7 + ph, seed + 7), sway: 0.1 + 0.05 * rnd(i, seed + 4 + ph), t: f * 0.17 + i * 1.7 + ph};
  });
  const outer = mk(11, 0.84, 1, 0.27, 0), mid = mk(7, 0.62, 0.74, 0.26, 2.1), core = mk(5, 0.42, 0.4, 0.22, 4.3);
  const layer = (T: Tg[], dw: number, dh: number, hs: number, ws: number, fill: string, key: string) => [
    <path key={key + "d"} d={dome(x, y, Wk * dw, Hk * dh, f * 0.05 + dw)} fill={fill}/>,
    ...T.map((tg, i) => <path key={key + i} d={tongue(tg.x, y, tg.h * hs, tg.w * ws, tg.lean, tg.sway, tg.t)} fill={fill}/>),
  ];
  const wisps = outer.map((tg, i) => {
    const P = 30 + rnd(i, seed + 11) * 18, a = ((f + rnd(i, seed + 12) * P) % P) / P;
    const fx = tg.x + tg.lean * tg.h * 0.85 + Math.sin(a * 4 + i) * 10, fy = y - tg.h * (0.78 + 0.55 * a);
    const len = tg.w * 3.4 * (1 - 0.45 * a), wid = tg.w * 0.34 * (1 - 0.6 * a);
    return wid > 0.6 ? <path key={i} d={tongue(fx, fy, len, wid, tg.lean * 0.6, 0.16, f * 0.25 + i, 1.2)} fill="#EE7032" opacity={Math.pow(1 - a, 1.6) * 0.7}/> : null;
  });
  return (
    <g>
      <defs>
        <linearGradient id={`${id}o`} gradientUnits="userSpaceOnUse" x1={0} y1={y + 6} x2={0} y2={y - Hk * 1.05}><stop offset="0" stopColor="#FFA040" stopOpacity={0.95}/><stop offset="0.3" stopColor="#F2702C" stopOpacity={0.92}/><stop offset="0.62" stopColor="#C8401E" stopOpacity={0.72}/><stop offset="0.88" stopColor="#8E2A1E" stopOpacity={0.25}/><stop offset="1" stopColor="#8E2A1E" stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}m`} gradientUnits="userSpaceOnUse" x1={0} y1={y + 4} x2={0} y2={y - Hk * 0.82}><stop offset="0" stopColor="#FFE9A8"/><stop offset="0.3" stopColor="#FFC462"/><stop offset="0.66" stopColor="#F68A34" stopOpacity={0.85}/><stop offset="1" stopColor="#E0602A" stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}c`} gradientUnits="userSpaceOnUse" x1={0} y1={y + 2} x2={0} y2={y - Hk * 0.4}><stop offset="0" stopColor="#FFFBE6"/><stop offset="0.35" stopColor="#FFEDB4" stopOpacity={0.9}/><stop offset="1" stopColor="#FFD889" stopOpacity={0}/></linearGradient>
      </defs>
      <Glow x={x} y={y - Hk * 0.42} rx={Wk * 2.6 + Hk * 0.5} ry={Hk * 1.15} o={0.72 * Math.min(1, kk) * (0.93 + 0.07 * wob(f * 0.13, seed))}/>
      <Glow x={x} y={y - Hk * 0.2} rx={Wk * 1.5} ry={Hk * 0.5} g="fl-soft" o={0.9 * Math.min(1, kk)}/>
      <g opacity={0.24}>{layer(outer, 1.12, 0.36, 1.08, 1.55, "#E8642C", "f")}</g>
      <g opacity={0.96}>{layer(outer, 1, 0.3, 1, 1, `url(#${id}o)`, "o")}</g>
      {wisps}
      <g>{layer(mid, 0.78, 0.2, 1, 1, `url(#${id}m)`, "m")}</g>
      <g>{layer(core, 0.5, 0.11, 1, 1, `url(#${id}c)`, "c")}</g>
    </g>
  );
};
// Sparks rising from a fire, curling, fading, each with a short streak.
const Sparks: React.FC<{f: number; x: number; y: number; w: number; h: number; n?: number; k?: number; seed?: number; wind?: number}> = ({f, x, y, w, h, n = 34, k = 1, seed = 0, wind = 0}) => (
  <g>{k <= 0.02 ? null : Array.from({length: n}, (_, i) => {
    const P = 60 + rnd(i, seed + 1) * 70, a = ((f + rnd(i, seed + 2) * P) % P) / P, rise = h * (1.0 + rnd(i, seed + 4) * 1.1);
    const sx = x + (rnd(i, seed + 3) - 0.5) * w * 1.5 + Math.sin(a * 6 + i) * 34 * a + wind * a * 220, sy = y - h * 0.3 - a * rise;
    const vy = rise / P, vx = Math.cos(a * 6 + i) * 34 * 6 / P + wind * 220 / P;
    const op = Math.pow(Math.sin(a * Math.PI), 0.7) * Math.min(1, k) * (0.45 + 0.55 * rnd(i, seed + 5)), r = 1.1 + rnd(i, seed + 6) * 1.7;
    return <g key={i} opacity={op}>
      <path d={ribbon([[sx - vx * 2.5, sy + vy * 2.5], [sx, sy]], 0.2, r * 1.2)} fill="#FFB060" opacity={0.45}/>
      <circle cx={sx} cy={sy} r={r * 4} fill="url(#fl-warm)"/>
      <circle cx={sx} cy={sy} r={r} fill="#FFEAC0"/>
    </g>;
  })}</g>
);
// Smoke rising off a fire: soft puffs that swell, drift and fade, lit warm from below.
const Plume: React.FC<{f: number; x: number; y: number; rise: number; n?: number; op?: number; wind?: number; seed?: number; r0?: number; r1?: number; spread?: number}> =
  ({f, x, y, rise, n = 22, op = 1, wind = 0.3, seed = 0, r0 = 40, r1 = 190, spread = 40}) => (
  <g>{op <= 0.01 ? null : Array.from({length: n}, (_, i) => {
    const P = 170 + rnd(i, seed + 21) * 90, a = ((f + rnd(i, seed + 22) * P) % P) / P;
    const px = x + (rnd(i, seed + 23) - 0.5) * spread + a * wind * 320 + Math.sin(a * 4 + i) * 40 * a, py = y - a * rise;
    const r = r0 + (r1 - r0) * Math.pow(a, 0.8), o = Math.pow(Math.sin(Math.PI * Math.min(1, a * 1.15)), 0.9) * op * (0.55 + 0.45 * rnd(i, seed + 24));
    const g = a < 0.22 ? "fl-sm-warm" : a < 0.55 ? "fl-sm-mid" : "fl-sm-cool";
    return <circle key={i} cx={px} cy={py} r={r} fill={`url(#${g})`} opacity={o}/>;
  })}</g>
);
// Heat shimmer: faint wavering bands of warm air above a fire.
const Shimmer: React.FC<{f: number; x: number; y: number; w: number; h: number; k?: number}> = ({f, x, y, w, h, k = 1}) => (
  <g opacity={0.5 * Math.min(1, k)}>{Array.from({length: 7}, (_, i) => {
    const P = 70 + i * 9, a = ((f + i * 23) % P) / P, pts: number[][] = [];
    for (let j = 0; j <= 10; j++) { const u = j / 10; pts.push([x + (i - 3) * w * 0.28 + Math.sin(u * 7 + f / 7 + i) * 9 * u, y - a * h * 0.6 - u * h * 0.5]); }
    return <path key={i} d={ribbon(pts, 3, 12)} fill="#FFD9A0" opacity={0.06 * Math.sin(a * Math.PI)}/>;
  })}</g>
);

// ---------- the havan kund: a square brick fire altar, its pit stepped down in three ledges, seen a little from above ----------
// x, y: the middle of the bottom edge of its front face. P(px, pz, hy) projects a point of its plan (pz > 0 is further
// away, hy < 0 is down into the pit).
const kundGeom = (x: number, y: number, s = 1) => {
  const A = 330 * s, FH = 104 * s, slope = 0.25, drop = 0.85, yTop = y - FH, yc = yTop - A * slope;
  const P = (px: number, pz: number, hy = 0): V2 => [x + px * (1 - (pz + A) * 0.00022 / s), yc - pz * slope - hy * drop];
  return {x, y, s, A, FH, yTop, yc, P, rings: [A, A * 0.8, A * 0.66, A * 0.54], hs: [0, -14 * s, -28 * s, -46 * s], fb: yc + A * slope * 0.9};
};
type KG = ReturnType<typeof kundGeom>;
const poly = (pts: V2[]) => `M ${pts.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(" L ")} Z`;
const sq = (g: KG, a: number, hy: number) => poly([g.P(-a, -a, hy), g.P(a, -a, hy), g.P(a, a, hy), g.P(-a, a, hy)]);
// Brick joints across the top ledge, on the given sides (f, b, l, r): two courses of bricks, staggered.
const ledgeJoints = (g: KG, sides: string[]): string => {
  const a0 = g.rings[0], a1 = g.rings[1], m = (a0 + a1) / 2, st = 46 * g.s, out: string[] = [];
  const at = (sd: string, t: number, r: number) => (sd === "f" ? g.P(t, -r) : sd === "b" ? g.P(t, r) : sd === "l" ? g.P(-r, t) : g.P(r, t));
  for (const sd of sides) for (let t = -a0 + st; t < a0; t += st) {
    ([[a0, m, 0], [m, a1, st / 2]] as const).forEach(([o, i, off]) => {
      const tt = t + off;
      if (Math.abs(tt) >= i - 4) return;
      const p0 = at(sd, tt, o), p1 = at(sd, tt, i);
      out.push(`M ${p0[0].toFixed(1)} ${p0[1].toFixed(1)} L ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`);
    });
  }
  return out.join(" ");
};
// The bed of the pit: a low heap of charcoal glowing through its gaps, greying over with ash.
const pitBed = (g: KG) => {
  const a3 = g.rings[3], hf = g.hs[3];
  const [lx, ly] = g.P(-a3 * 0.98, -a3 * 0.6, hf), [rx, ry] = g.P(a3 * 0.98, -a3 * 0.6, hf), yb = g.P(0, a3 * 0.7, hf)[1];
  const topAt = (x: number) => { const u = clamp01((x - lx) / (rx - lx)); return yb - Math.pow(Math.sin(u * Math.PI), 0.7) * 34 * g.s - Math.sin(u * 9.4) * 5 * g.s; };
  const top: Pt[] = Array.from({length: 13}, (_, i) => { const x = lerp(lx, rx, i / 12); return [x, topAt(x) + (rnd(i, 38) - 0.5) * 9 * g.s] as Pt; });
  const mound = smooth([[lx, ly + 30, "c"], ...top, [rx, ry + 30, "c"]]);
  const chunks = Array.from({length: 46}, (_, i) => {
    const cx = lerp(lx + 16, rx - 16, rnd(i, 41)), cy = lerp(topAt(cx) + 6 * g.s, ly + 20, Math.pow(rnd(i, 42), 0.8));
    const w = (7 + rnd(i, 43) * 12) * g.s, h = (4 + rnd(i, 44) * 6) * g.s, rot = rnd(i, 45) * Math.PI;
    const pts: Pt[] = Array.from({length: 5}, (_, k) => { const an = rot + (k / 5) * Math.PI * 2, rr = 0.7 + rnd(i * 5 + k, 46) * 0.45; return [cx + Math.cos(an) * w * rr, cy + Math.sin(an) * h * rr, "c"] as Pt; });
    return {d: smooth(pts), cx, cy, w};
  });
  return {mound, chunks, cx: (lx + rx) / 2, cy: (yb + ly) / 2, rx: (rx - lx) / 2};
};
const KundBack: React.FC<{g: KG; light: number; f: number; ash?: number}> = ({g, light, f, ash = 0}) => {
  const id = uid(), {rings, hs, P} = g, L = Math.min(1.3, light);
  const bed = pitBed(g);
  const [fx, fy] = P(0, 0, hs[3]);
  return (
    <g>
      <defs>
        <radialGradient id={`${id}t`} gradientUnits="userSpaceOnUse" cx={fx} cy={fy - 20} r={g.A * 1.2}><stop offset="0" stopColor="#E0905A"/><stop offset="0.4" stopColor="#8A4228"/><stop offset="1" stopColor="#2A1416"/></radialGradient>
        <linearGradient id={`${id}r`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F2A462"/><stop offset="1" stopColor="#9A4426"/></linearGradient>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9A929E"/><stop offset="0.6" stopColor="#6E6876"/><stop offset="1" stopColor="#4A4450"/></linearGradient>
      </defs>
      {[0, 1, 2].map((j) => {
        const a = rings[j + 1], h0 = hs[j], h1 = hs[j + 1];
        return <g key={j}>
          <path d={`${sq(g, rings[j], h0)} ${sq(g, a, h0)}`} fillRule="evenodd" fill="#1E1014"/>
          <path d={`${sq(g, rings[j], h0)} ${sq(g, a, h0)}`} fillRule="evenodd" fill={`url(#${id}t)`} opacity={0.25 + 0.55 * L}/>
          {j === 0 ? <path d={ledgeJoints(g, ["b", "l", "r"])} stroke="#140709" strokeWidth={1.6} opacity={0.7}/> : null}
          {/* the course line along the middle of the ledge */}
          <path d={sq(g, (rings[j] + a) / 2, h0)} fill="none" stroke="#1A0A0C" strokeWidth={1.6 * g.s} opacity={0.55}/>
          {/* the risers down to the next ledge: the back one faces us and the fire */}
          <path d={poly([P(-a, a, h0), P(a, a, h0), P(a, a, h1), P(-a, a, h1)])} fill="#140809"/>
          <path d={poly([P(-a, a, h0), P(a, a, h0), P(a, a, h1), P(-a, a, h1)])} fill={`url(#${id}r)`} opacity={0.18 + 0.4 * L}/>
          <path d={poly([P(-a, -a, h0), P(-a, a, h0), P(-a, a, h1), P(-a, -a, h1)])} fill="#8A4024" opacity={0.3 + 0.5 * L}/>
          <path d={poly([P(a, -a, h0), P(a, a, h0), P(a, a, h1), P(a, -a, h1)])} fill="#8A4024" opacity={0.3 + 0.5 * L}/>
          <path d={poly([P(-a, a, h0), P(a, a, h0)])} stroke={K.rim} strokeWidth={1.2} opacity={0.35 * L}/>
        </g>;
      })}
      {/* the pit floor: a bed of coals glowing through the gaps, greying over with ash */}
      <path d={sq(g, rings[3], hs[3])} fill="#2A0E0C"/>
      <defs><clipPath id={`${id}m`}><path d={bed.mound}/></clipPath></defs>
      <path d={bed.mound} fill="#1E0C0C"/>
      <g clipPath={`url(#${id}m)`}>
        <Glow x={bed.cx} y={bed.cy} rx={bed.rx * 1.1} ry={60 * g.s} g="fl-ember" o={0.95 - 0.5 * ash}/>
        {bed.chunks.map((c, i) => {
          const puls = 0.55 + 0.45 * Math.sin(f / (15 + rnd(i, 36) * 12) + i * 2.3), live = i % 5 === 2;
          return <g key={i}>
            <path d={c.d} fill="#F06A2C" opacity={(0.5 + 0.5 * puls) * (1 - 0.5 * ash)}/>
            <path d={c.d} fill={live ? "#5A1E12" : "#160A0C"} transform={`translate(0 ${(-1.8 * g.s).toFixed(2)})`}/>
            {live ? <path d={c.d} fill="#FF9A48" opacity={puls * 0.55 * (1 - 0.6 * ash)} transform={`translate(0 ${(-1.8 * g.s).toFixed(2)})`}/> : null}
          </g>;
        })}
        {ash > 0 ? <>
          <path d={bed.mound} fill={`url(#${id}a)`} opacity={0.88 * ash}/>
          {/* the ash lies in soft lumps; embers glow through its cracks */}
          {bed.chunks.filter((_, i) => i % 6 === 0).map((c, i) => <ellipse key={i} cx={c.cx} cy={c.cy + 4 * g.s} rx={c.w * 2.4} ry={c.w * 0.9} fill="url(#fl-shade)" opacity={0.3 * ash}/>)}
          {bed.chunks.filter((_, i) => i % 5 === 3).map((c, i) => {
            const pts: number[][] = [[c.cx, c.cy]];
            for (let k = 1; k < 9; k++) pts.push([pts[k - 1][0] + (8 + rnd(i * 9 + k, 57) * 8) * g.s * (i % 2 ? 1 : -1), pts[k - 1][1] + Math.sin(k * 0.9 + i) * 2.2 * g.s]);
            const pu = 0.55 + 0.45 * Math.sin(f / 23 + i * 2.1);
            return <g key={i} opacity={ash * pu}>
              <path d={ribbon(pts, 2.4 * g.s, 0.4 * g.s)} fill="#FF7A30"/>
              <path d={ribbon(pts, 1.1 * g.s, 0.3 * g.s)} fill="#FFD08A"/>
            </g>;
          })}
          {bed.chunks.filter((_, i) => i % 4 === 1).map((c, i) => {
            const pu = 0.55 + 0.45 * Math.sin(f / 19 + i * 1.7);
            return <g key={i}>
              <Glow x={c.cx} y={c.cy} rx={c.w * 1.5} ry={c.w * 0.75} g="fl-ember" o={ash * pu}/>
              <ellipse cx={c.cx} cy={c.cy} rx={c.w * 0.32} ry={c.w * 0.16} fill="#FFC27A" opacity={ash * pu * 0.9}/>
            </g>;
          })}
        </> : null}
      </g>
    </g>
  );
};
// The front of the altar, drawn over the foot of the flames: the near ledge and the brick face with its moulding.
const KundFront: React.FC<{g: KG; light: number}> = ({g, light}) => {
  const id = uid(), {x, y, s, A, yTop, rings, P} = g, L = Math.min(1.3, light);
  const bricks: string[] = [];
  const ch = (g.FH - 22 * s) / 4;
  for (let c = 0; c < 4; c++) {
    const yy = yTop + 12 * s + c * ch;
    bricks.push(`M ${x - A} ${yy.toFixed(1)} L ${x + A} ${yy.toFixed(1)}`);
    for (let bx = x - A + (c % 2 ? 36 * s : 0) + 72 * s; bx < x + A - 4; bx += 72 * s) bricks.push(`M ${bx.toFixed(1)} ${yy.toFixed(1)} l 0 ${ch.toFixed(1)}`);
  }
  return (
    <g>
      <defs>
        <radialGradient id={`${id}t`} gradientUnits="userSpaceOnUse" cx={x} cy={g.yc} r={A * 1.2}><stop offset="0" stopColor="#E0905A"/><stop offset="0.4" stopColor="#8A4228"/><stop offset="1" stopColor="#2A1416"/></radialGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A1C1C"/><stop offset="0.25" stopColor="#1E1016"/><stop offset="1" stopColor="#0E080C"/></linearGradient>
      </defs>
      <ellipse cx={x} cy={y + 4} rx={A * 1.25} ry={20 * s} fill="url(#fl-shade)" opacity={0.8}/>
      <path d={poly([P(-A, -A), P(A, -A), P(rings[1], -rings[1]), P(-rings[1], -rings[1])])} fill="#1E1014"/>
      <path d={poly([P(-A, -A), P(A, -A), P(rings[1], -rings[1]), P(-rings[1], -rings[1])])} fill={`url(#${id}t)`} opacity={0.25 + 0.55 * L}/>
      <path d={ledgeJoints(g, ["f"])} stroke="#140709" strokeWidth={1.6} opacity={0.7}/>
      <path d={poly([P(-rings[1], -rings[1]), P(rings[1], -rings[1])])} stroke="#FFD9A0" strokeWidth={1.4} opacity={0.6 * L}/>
      <rect x={x - A} y={yTop} width={2 * A} height={g.FH} fill={`url(#${id}f)`}/>
      <rect x={x - A - 6 * s} y={yTop} width={2 * A + 12 * s} height={12 * s} fill="#2A1418"/>
      <rect x={x - A - 6 * s} y={yTop} width={2 * A + 12 * s} height={1.8} fill={K.rim} opacity={0.75 * L}/>
      <path d={bricks.join(" ")} stroke="#060307" strokeWidth={2 * s} fill="none" opacity={0.85}/>
      <rect x={x - A - 10 * s} y={y - 10 * s} width={2 * A + 20 * s} height={10 * s} fill="#140A10"/>
    </g>
  );
};
// A water pot (kalasha) with mango leaves splayed from its mouth and hanging over the rim, a coconut upright on top;
// in silhouette, base at (0, 0).
const KALASHA: string[] = [
  smooth([[-26, 0, "c"], [-42, -8], [-58, -30], [-62, -56], [-52, -80], [-32, -94], [-18, -100], [-16, -108, "c"], [-28, -114], [-31, -120, "c"], [31, -120, "c"], [28, -114], [16, -108, "c"], [18, -100], [32, -94], [52, -80], [62, -56], [58, -30], [42, -8], [26, 0, "c"]]),
  smooth([[-22, -118], [-27, -138], [-22, -158], [-10, -172], [-3, -180], [0, -192, "c"], [3, -180], [10, -172], [22, -158], [27, -138], [22, -118]]),
  ...[[-1, 0, 74, 0.12], [-1, 1, 82, 0.42], [-1, 2, 66, 0.78], [1, 0, 74, 0.12], [1, 1, 82, 0.42], [1, 2, 66, 0.78]].map(([sd, k, L, up]) => {
    const pts: number[][] = [];
    for (let i = 0; i <= 12; i++) {
      const u = i / 12, x = sd * (10 + L * u * (1 - 0.25 * up)), y = -126 - up * 40 * Math.sin(u * Math.PI * 0.7) + (0.55 - up * 0.25) * L * u * u * (k === 2 ? 0.6 : 1);
      pts.push([x, y]);
    }
    return blade(pts, 9 + (k === 1 ? 1.5 : 0));
  }),
];
// The pillars of the fire pavilion: base, shaft, bracket capital.
const pillar = (x: number, w: number, y0: number, y1: number): string[] => [
  `M ${x - w * 0.8} ${y1} L ${x + w * 0.8} ${y1} L ${x + w * 0.8} ${y1 - w * 0.5} L ${x + w * 0.62} ${y1 - w * 0.7} L ${x - w * 0.62} ${y1 - w * 0.7} L ${x - w * 0.8} ${y1 - w * 0.5} Z`,
  `M ${x - w / 2} ${y1 - w * 0.7} L ${x + w / 2} ${y1 - w * 0.7} L ${x + w * 0.46} ${y0 + w * 1.2} L ${x - w * 0.46} ${y0 + w * 1.2} Z`,
  smooth([[x - w * 0.55, y0 + w * 1.25, "c"], [x - w * 0.62, y0 + w * 0.9], [x - w * 1.1, y0 + w * 0.7], [x - w * 1.2, y0 + w * 0.45, "c"], [x - w * 1.2, y0, "c"], [x + w * 1.2, y0, "c"], [x + w * 1.2, y0 + w * 0.45, "c"], [x + w * 1.1, y0 + w * 0.7], [x + w * 0.62, y0 + w * 0.9], [x + w * 0.55, y0 + w * 1.25, "c"]]),
];

const Fire: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const v = String(s.variant || "");
  const mood = moodOf(s, "night"), amb = AMB[mood];
  const id = uid();
  const X = 960, g = kundGeom(X, 904, 1), FB = g.fb;
  let k = 1, flow = 0, ash = 0;
  if (v === "ash") { const p = sstep((f - 0.1 * n) / (0.62 * n)); k = 1 - 0.985 * p; ash = sstep((f - 0.3 * n) / (0.5 * n)); }
  if (v === "offering") { flow = ease(f, 0, 14) * (1 - ease(f, 0.82 * n, 0.1 * n)); k = 1 + 0.2 * ease(f, 20, 40) * (1 - ease(f, 0.86 * n, 0.12 * n)); }
  if (v === "syllables") k = 0.86;
  const flick = 0.93 + 0.07 * wob(f * 0.11, 3), light = Math.max(v === "ash" ? 0.3 * (1 - 0.5 * ash) : 0, k) * flick;
  const FH = 450, FW = 190;
  const labels: string[] = Array.isArray(s.labels) ? s.labels.slice(0, 3).map(String) : [];
  const smokeOp = v === "syllables" ? 0.95 : v === "ash" ? 0.45 + 0.4 * (1 - k) : 0.55;
  const lightAt = (px: number, py: number): V2 => [X - px, FB - 180 - py];
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.05)} cx={X} cy={600}>
      <FlameDefs/>
      <Sky mood={mood} sun={[1600, 200]} sunR={15} f={f} rays={0} id={`fire${id}`} clouds={0.4}/>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#140D1E"/><stop offset="1" stopColor="#06030A"/></linearGradient>
      </defs>
      {/* far trees on the horizon, then the ground */}
      <path d={ridge([[-60, 712], ...Array.from({length: 22}, (_, i) => [i * 95 - 30, 690 - rnd(i, 31) * 50 - (i % 4 === 1 ? 26 : 0)] as Pt), [W + 60, 700]], 760)} fill="#150E24"/>
      <rect x={-60} y={730} width={W + 120} height={H - 700} fill={`url(#${id}g)`}/>
      <Glow x={X} y={g.y - 30} rx={1000 * Math.max(0.3, light)} ry={240 * Math.max(0.3, light)} g="fl-floor" o={Math.min(1, 0.3 + 0.7 * light)}/>
      {/* the pavilion's far pillars */}
      {[[560, 40, 40, 770], [1360, 40, 40, 770]].map(([px, pw, y0, y1], i) => (
        <Rimmed key={i} paths={pillar(px, pw, y0, y1)} light={lightAt(px, (y0 + y1) / 2)} fill="#140C18" rim={K.rim} w={2.5}/>
      ))}
      <Plume f={f} x={X} y={FB - FH * 0.8 * Math.max(0.3, k)} rise={640} n={v === "syllables" ? 28 : 18} op={smokeOp} wind={0.22} r0={50} r1={230} spread={90}/>
      <KundBack g={g} light={light} f={f} ash={ash}/>
      {v === "offering" ? <Ghee f={f} flow={flow} fb={FB} fh={FH}/> : null}
      <Shimmer f={f} x={X} y={FB - FH * 0.85 * k} w={FW} h={380} k={k}/>
      <Blaze f={f} x={X} y={FB} w={FW} h={FH} k={k} seed={2}/>
      {v === "ash" && k < 0.6 ? <Plume f={f} x={X} y={FB - 30} rise={560} n={9} op={0.75 * (1 - k)} wind={0.12} r0={16} r1={120} spread={180} seed={5}/> : null}
      <KundFront g={g} light={light}/>
      <Sparks f={f} x={X} y={FB} w={FW} h={FH} k={k} n={v === "offering" ? 46 : 32}/>
      {labels.map((t, i) => <Syllable key={i} t={t} i={i} m={labels.length} f={f} n={n} fb={FB}/>)}
      {/* the kalasha, and the near pillars and lintel, rimmed by the fire */}
      <g transform={`translate(${X - 500} ${g.y - 2})`}>
        <ellipse cx={0} cy={2} rx={76} ry={11} fill="url(#fl-shade)" opacity={0.75}/>
        <Rimmed paths={KALASHA} light={[1, -0.5]} fill="#170D16" rim={K.rim} w={2.6}/>
      </g>
      {[[140, 76, -10, 1030], [1780, 76, -10, 1030]].map(([px, pw, y0, y1], i) => (
        <Rimmed key={i} paths={pillar(px, pw, y0, y1)} light={lightAt(px, (y0 + y1) / 2)} fill="#0A060D" rim={K.rim} w={3.2}/>
      ))}
      <rect x={-60} y={-40} width={W + 120} height={76} fill="#09050C"/>
      <rect x={60} y={35} width={W - 120} height={1.6} fill={K.rim} opacity={0.35 * light}/>
      <Dust f={f} sun={[X, FB - 200]} n={60} y0={200} y1={1000}/>
    </Frame>
  );
};
// The offering: a long ladle (sruk) reaching in from above, a thin stream of ghee pouring into the fire.
const Ghee: React.FC<{f: number; flow: number; fb: number; fh: number}> = ({f, flow, fb, fh}) => {
  const id = uid();
  const tip: V2 = [1048, 232], tilt = 0.5 * flow;
  const end = fb - fh * 0.48;
  const bowl = smooth([[tip[0], tip[1], "c"], [tip[0] + 22, tip[1] + 18], [tip[0] + 62, tip[1] + 26], [tip[0] + 104, tip[1] + 14], [tip[0] + 128, tip[1] - 8, "c"], [tip[0] + 96, tip[1] - 14], [tip[0] + 52, tip[1] - 12], [tip[0] + 18, tip[1] - 6]]);
  const handle = ribbon([[tip[0] + 118, tip[1] - 8], [tip[0] + 340, tip[1] - 90], [tip[0] + 620, tip[1] - 188], [tip[0] + 960, tip[1] - 300]], 11, 20);
  const knob = smooth([[tip[0] + 108, tip[1] - 2], [tip[0] + 118, tip[1] - 20], [tip[0] + 138, tip[1] - 22], [tip[0] + 146, tip[1] - 6], [tip[0] + 130, tip[1] + 4]]);
  const pts: number[][] = [];
  for (let i = 0; i <= 18; i++) { const u = i / 18; pts.push([tip[0] + 2 - 24 * Math.sqrt(u) + Math.sin(f / 5 + u * 9) * 1.2 * u, tip[1] + 4 + (end - tip[1] - 4) * u]); }
  return (
    <g>
      <defs><linearGradient id={`${id}s`} gradientUnits="userSpaceOnUse" x1={0} y1={tip[1]} x2={0} y2={end}><stop offset="0" stopColor="#FFF2CC"/><stop offset="0.6" stopColor="#F5C870"/><stop offset="1" stopColor="#F0A04B" stopOpacity={0.3}/></linearGradient></defs>
      {flow > 0.01 ? <g opacity={flow}>
        <path d={ribbon(pts, 6, 3.2)} fill={`url(#${id}s)`}/>
        {Array.from({length: 5}, (_, i) => { const u = ((f * 0.045 + i / 5) % 1); const p = pts[Math.floor(u * 18)]; return <ellipse key={i} cx={p[0]} cy={p[1]} rx={1.5} ry={5} fill="#FFFBEA" opacity={0.8}/>; })}
        <Glow x={pts[18][0]} y={end} rx={80} ry={56} g="fl-hot" o={0.45}/>
      </g> : null}
      <g transform={`rotate(${(-tilt * 8).toFixed(2)} ${tip[0] + 130} ${tip[1]})`}>
        <Rimmed paths={[handle, bowl, knob]} light={[0.15, 1]} fill="#160C14" rim={K.rim} w={2.6}/>
      </g>
    </g>
  );
};
// One of the three words rising out of the fire into the smoke, in gold light.
const Syllable: React.FC<{t: string; i: number; m: number; f: number; n: number; fb: number}> = ({t, i, m, f, n, fb}) => {
  const t0 = n * (0.04 + 0.22 * i), d = n * 0.34, p = clamp01((f - t0) / d);
  if (p <= 0) return null;
  const e = sstep(p), x1 = 960 + (i - (m - 1) / 2) * 290, y1 = 236;
  const x = lerp(960 + (i - (m - 1) / 2) * 60, x1, e), y = lerp(fb - 300, y1, e) + Math.sin(f / 40 + i) * 4 * e;
  const o = sstep(p / 0.35), deva = isDeva(t);
  return (
    <g opacity={o}>
      <Glow x={x} y={y - 30} rx={190} ry={110} g="fl-warm" o={0.55}/>
      <text x={x} y={y} textAnchor="middle" fontFamily={deva ? SA : CAPS} fontSize={deva ? 108 : 92} letterSpacing={deva ? 0 : 10} fill="url(#k-gold)">{t}</text>
    </g>
  );
};

// ---------- 3.38: fire covered by smoke ----------
// A hearth on the ground: crossed logs under the fire, and a ring of stones in front of it.
const HearthBack: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => {
  const logs = [ribbon([[x - 190, y + 4], [x - 60, y - 34], [x + 70, y - 74]], 34, 24), ribbon([[x + 195, y + 8], [x + 60, y - 32], [x - 70, y - 76]], 32, 22)];
  return (
    <g>
      <Glow x={x} y={y - 20} rx={240} ry={70} g="fl-ember" o={0.8}/>
      <Rimmed paths={logs} light={[0, -1]} fill="#1A0D10" rim="#FF9A50" w={3}/>
      {[[x - 188, y + 4], [x + 193, y + 8]].map(([lx, ly], i) => <g key={i}>
        <ellipse cx={lx} cy={ly} rx={12} ry={17} fill="#2A1210"/>
        <ellipse cx={lx} cy={ly} rx={9} ry={12} fill="url(#fl-ember)" opacity={0.6 + 0.3 * Math.sin(f / 13 + i)}/>
      </g>)}
    </g>
  );
};
const HearthFront: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g>{Array.from({length: 7}, (_, i) => {
    const a = Math.PI * (0.06 + (i / 6) * 0.88), sx = x - Math.cos(a) * 230, sy = y + 18 + Math.sin(a) * 34, w = 46 + rnd(i, 61) * 16, h = 30 + rnd(i, 62) * 10;
    const stone = smooth(Array.from({length: 10}, (_, k) => { const an = (k / 10) * Math.PI * 2, rr = 0.88 + rnd(i * 10 + k, 63) * 0.18; return [sx + Math.cos(an) * w * rr, sy + Math.min(0.55, Math.sin(an)) * h * rr] as Pt; }));
    return <Rimmed key={i} paths={[stone]} light={[x - sx, y - 200 - sy]} fill="#130A12" rim={K.rim} w={2.4}/>;
  })}</g>
);
// A billow of smoke: a cluster of lobes (so its edge is lumpy, never a disc), a warm underside where the fire lights it,
// a cool cap where the night sky does. q seeds the lobes; t turns them slowly.
const Billow: React.FC<{x: number; y: number; r: number; o: number; warm: number; cool: number; q: number; t?: number}> = ({x, y, r, o, warm, cool, q, t = 0}) => {
  if (o <= 0.01) return null;
  const lobes = Array.from({length: 5}, (_, k) => {
    if (k === 0) return [x, y, r];
    const an = -Math.PI / 2 + (k - 2.5) * 0.9 + (rnd(q * 5 + k, 77) - 0.5) * 0.6 + Math.sin(t + k) * 0.12, d = r * (0.5 + rnd(q * 5 + k, 78) * 0.25);
    return [x + Math.cos(an) * d * 1.25, y + Math.sin(an) * d * 0.8, r * (0.5 + rnd(q * 5 + k, 79) * 0.25)];
  });
  return (
    <g opacity={Math.min(1, o)}>
      {lobes.map(([lx, ly, lr], k) => <circle key={k} cx={lx} cy={ly} r={lr} fill="url(#fl-sm-body)"/>)}
      {warm > 0.02 ? <ellipse cx={x} cy={y + r * 0.3} rx={r * 0.85} ry={r * 0.55} fill="url(#fl-sm-warm)" opacity={warm}/> : null}
      {cool > 0.02 ? lobes.slice(1, 4).map(([lx, ly, lr], k) => <ellipse key={k} cx={lx - lr * 0.1} cy={ly - lr * 0.3} rx={lr * 0.7} ry={lr * 0.45} fill="url(#fl-sm-pale)" opacity={cool}/>) : null}
    </g>
  );
};
const SmokeVeil: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const mood = moodOf(s, "night");
  const id = uid();
  const X = 960, GY = 868, FB = GY - 24, FH = 370;
  const clear = sstep((f - 0.08 * n) / (0.76 * n));
  const keep = (q: number, early = 0) => clamp01((rnd(q, 85) + 0.16 - clear * (1.2 + early)) * 4);
  const warmAt = (x: number, y: number) => clamp01(1 - Math.hypot((x - X) * 0.7, y - FB) / 460) * 0.95;
  const back: React.ReactNode[] = [], column: React.ReactNode[] = [], front: React.ReactNode[] = [];
  for (let i = 0; i < 20; i++) {
    const q = 100 + i, vx = (0.2 + rnd(q, 71) * 0.25) * (i % 2 ? -1 : 1), span = W + 700;
    const x = ((i / 20 + rnd(q, 73) * 0.05) * span + f * vx + span * 4) % span - 350, y = lerp(470, 660, rnd(q, 74)) - clear * 140;
    back.push(<Billow key={q} q={q} t={f / 90} x={x} y={y} r={lerp(110, 170, rnd(q, 76))} o={0.85 * keep(q)} warm={warmAt(x, y) * 0.7} cool={0.35}/>);
  }
  for (let i = 0; i < 58; i++) {
    const P = 330 + rnd(i, 81) * 140, a = ((f + rnd(i, 82) * P) % P) / P, spread = lerp(30, 520, Math.pow(a, 1.2));
    const x = X + (rnd(i, 83) - 0.5) * 2 * spread + Math.sin(a * 5 + i) * 30 + a * a * 160, y = FB - 40 - a * (FB + 160);
    const r = lerp(46, 160, Math.pow(a, 0.8)) * (0.8 + 0.4 * rnd(i, 84));
    const life = Math.min(1, a / 0.08) * Math.min(1, (1 - a) / 0.15), surv = i % 6 === 0 ? lerp(1, 0.35, clear) : keep(i);
    column.push(<Billow key={i} q={i} t={f / 70 + i} x={x} y={y} r={r} o={0.92 * life * surv} warm={warmAt(x, y)} cool={0.35 * clamp01((FB - y) / 500)}/>);
  }
  for (let i = 0; i < 22; i++) {
    const q = 300 + i, vx = (0.25 + rnd(q, 91) * 0.25) * (i % 2 ? 1 : -1), span = W + 700;
    const x = ((i / 22 + rnd(q, 92) * 0.05) * span + f * vx + span * 4) % span - 350, y = lerp(740, 940, rnd(q, 93)) - clear * 40;
    front.push(<Billow key={q} q={q} t={f / 80} x={x} y={y} r={lerp(90, 150, rnd(q, 94))} o={0.95 * keep(q, 0.25)} warm={warmAt(x, y)} cool={0.12}/>);
  }
  return (
    <Frame f={f} zoom={push(f, n, 1.02, 1.07)} cx={X} cy={640}>
      <FlameDefs/>
      <Sky mood={mood} sun={[420, 230]} sunR={18} f={f} rays={0} id={`smk${id}`} clouds={0.3}/>
      <defs><linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#120C1C"/><stop offset="1" stopColor="#06030A"/></linearGradient></defs>
      <path d={ridge([[-60, 760], [200, 700], [520, 668], [800, 694], [1100, 656], [1400, 692], [1700, 650], [W + 60, 700]], 800)} fill="#140E24"/>
      <rect x={-60} y={770} width={W + 120} height={H - 740} fill={`url(#${id}g)`}/>
      <Glow x={X} y={GY + 10} rx={920} ry={210} g="fl-floor" o={0.95}/>
      <g>{back}</g>
      <HearthBack x={X} y={GY} f={f}/>
      <Blaze f={f} x={X} y={FB} w={125} h={FH} k={1} seed={6}/>
      <HearthFront x={X} y={GY}/>
      <Sparks f={f} x={X} y={FB} w={125} h={FH} n={22} seed={3}/>
      <g>{column}</g>
      {/* the fire's light caught in the smoke */}
      <Glow x={X} y={FB - 140} rx={560} ry={380} g="fl-soft" o={0.3 + 0.35 * (1 - clear)}/>
      <g>{front}</g>
      <Glow x={X} y={FB - 70} rx={320} ry={220} g="fl-warm" o={0.5 * (1 - clear)}/>
      <Dust f={f} sun={[X, FB - 100]} n={50} y0={250} y1={1000}/>
    </Frame>
  );
};

// ---------- 3.38: the mirror covered with dust ----------
const Mirror: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const mood = moodOf(s, "night"), amb = AMB[mood];
  const id = uid();
  const MX = 1000, MY = 450, R = 226;
  const clear = sstep((f - 0.14 * n) / (0.62 * n));
  const lamp: V2 = [690, 0];
  const moon: V2 = [MX + 62, MY - 58];
  // the clearing sweeps across the face from upper left to lower right
  const sweep = lerp(-0.35, 1.35, clear);
  const specks = Array.from({length: 240}, (_, i) => {
    const a = rnd(i, 101) * Math.PI * 2, rr = Math.sqrt(rnd(i, 102)) * R;
    return {x: MX + Math.cos(a) * rr, y: MY + Math.sin(a) * rr, r: 0.6 + rnd(i, 103) * 2.2, o: 0.15 + rnd(i, 104) * 0.4};
  });
  const motes = Array.from({length: 60}, (_, i) => {
    const a = rnd(i, 111) * Math.PI * 2, rr = Math.sqrt(rnd(i, 112)) * R, x0 = MX + Math.cos(a) * rr, y0 = MY + Math.sin(a) * rr;
    const along = ((x0 - (MX - R)) + (y0 - (MY - R))) / (4 * R), born = lerp(0.14 * n, 0.76 * n, clamp01((along + 0.35) / 1.7)), age = (f - born) / 60;
    if (age <= 0 || age >= 1) return null;
    return <circle key={i} cx={x0 + age * (60 + rnd(i, 113) * 140)} cy={y0 - age * (20 + rnd(i, 114) * 90) + Math.sin(age * 6 + i) * 6} r={0.8 + rnd(i, 115) * 1.6} fill="#FFE2A8" opacity={Math.sin(age * Math.PI) * 0.8}/>;
  });
  const beads = Array.from({length: 40}, (_, i) => { const a = (i / 40) * Math.PI * 2; return smooth(Array.from({length: 8}, (_, k) => { const an = (k / 8) * Math.PI * 2; return [MX + Math.cos(a) * (R + 52) + Math.cos(an) * 9, MY + Math.sin(a) * (R + 52) + Math.sin(an) * 9] as Pt; })); });
  const ring = `M ${MX - R - 44} ${MY} a ${R + 44} ${R + 44} 0 1 0 ${2 * (R + 44)} 0 a ${R + 44} ${R + 44} 0 1 0 ${-2 * (R + 44)} 0 Z M ${MX - R} ${MY} a ${R} ${R} 0 1 1 ${2 * R} 0 a ${R} ${R} 0 1 1 ${-2 * R} 0 Z`;
  // the crest: a lotus bud between two curling leaves
  const cy0 = MY - R - 48;
  const crest = [
    smooth([[MX - 30, cy0 + 6, "c"], [MX - 34, cy0 - 30], [MX - 20, cy0 - 70], [MX, cy0 - 112, "c"], [MX + 20, cy0 - 70], [MX + 34, cy0 - 30], [MX + 30, cy0 + 6, "c"]]),
    ...[-1, 1].map((sd) => smooth([[MX + sd * 22, cy0 + 4, "c"], [MX + sd * 44, cy0 - 18], [MX + sd * 74, cy0 - 30], [MX + sd * 96, cy0 - 22], [MX + sd * 100, cy0 - 4], [MX + sd * 86, cy0 + 6], [MX + sd * 80, cy0 - 8], [MX + sd * 70, cy0 - 12], [MX + sd * 50, cy0 - 2], [MX + sd * 36, cy0 + 10, "c"]])),
    smooth([[MX - 50, cy0 + 14, "c"], [MX, cy0 - 2], [MX + 50, cy0 + 14, "c"], [MX, cy0 + 22]]),
  ];
  const stand = smooth([[MX - 20, MY + R + 40, "c"], [MX - 26, MY + R + 74], [MX - 16, MY + R + 100], [MX - 60, MY + R + 118], [MX - 112, MY + R + 132, "c"], [MX - 112, MY + R + 146, "c"], [MX + 112, MY + R + 146, "c"], [MX + 112, MY + R + 132, "c"], [MX + 60, MY + R + 118], [MX + 16, MY + R + 100], [MX + 26, MY + R + 74], [MX + 20, MY + R + 40, "c"]]);
  const knot = smooth([[MX - 30, MY + R + 70], [MX - 22, MY + R + 60], [MX + 22, MY + R + 60], [MX + 30, MY + R + 70], [MX + 22, MY + R + 80], [MX - 22, MY + R + 80]]);
  const TABLE = MY + R + 146, DS = 0.86;
  const LF: V2 = [lamp[0], TABLE - 56 * DS + 17 * DS];
  const lightV: V2 = [LF[0] - MX, LF[1] - 90 - MY];
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.06)} cx={MX - 80} cy={MY}>
      <FlameDefs/>
      <defs>
        <radialGradient id={`${id}r`} cx="0.5" cy="0.25" r="0.8"><stop offset="0" stopColor="#26325E"/><stop offset="0.6" stopColor="#151C40"/><stop offset="1" stopColor="#0A0F26"/></radialGradient>
        <radialGradient id={`${id}d`} cx="0.42" cy="0.4" r="0.7"><stop offset="0" stopColor="#76674F"/><stop offset="0.7" stopColor="#584A3C"/><stop offset="1" stopColor="#3E3430"/></radialGradient>
        <radialGradient id={`${id}b`}><stop offset="0" stopColor="#2A221E" stopOpacity={0.5}/><stop offset="1" stopColor="#2A221E" stopOpacity={0}/></radialGradient>
        <linearGradient id={`${id}m`} gradientUnits="userSpaceOnUse" x1={MX - R} y1={MY - R} x2={MX + R} y2={MY + R}>
          <stop offset={Math.max(0, Math.min(1, sweep - 0.22))} stopColor="#000"/><stop offset={Math.max(0, Math.min(1, sweep + 0.22))} stopColor="#fff"/>
        </linearGradient>
        <mask id={`${id}k`} maskUnits="userSpaceOnUse" x={MX - R - 10} y={MY - R - 10} width={2 * R + 20} height={2 * R + 20}><rect x={MX - R - 10} y={MY - R - 10} width={2 * R + 20} height={2 * R + 20} fill={`url(#${id}m)`}/></mask>
        <clipPath id={`${id}c`}><circle cx={MX} cy={MY} r={R}/></clipPath>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="1"><stop offset="0.3" stopColor="#fff" stopOpacity={0}/><stop offset="0.5" stopColor="#fff" stopOpacity={0.07}/><stop offset="0.7" stopColor="#fff" stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A2420"/><stop offset="0.1" stopColor="#1A0E14"/><stop offset="1" stopColor="#0A0610"/></linearGradient>
        <radialGradient id={`${id}w`} cx={LF[0]} cy={LF[1] - 40} r={1150} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#8A4A32" stopOpacity={0.9}/><stop offset="0.3" stopColor="#3A1E2A" stopOpacity={0.9}/><stop offset="1" stopColor="#0A0712" stopOpacity={1}/></radialGradient>
      </defs>
      {/* a dark room: the wall warmed by the lamp, a cool breath of moonlight from behind us */}
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id}w)`}/>
      <Glow x={MX} y={MY} rx={720} ry={560} g="fl-cool" o={0.32}/>
      {/* the mirror: the reflected night sky and moon, the dust over them, the bronze frame */}
      <g clipPath={`url(#${id}c)`}>
        <circle cx={MX} cy={MY} r={R} fill={`url(#${id}r)`}/>
        {Array.from({length: 40}, (_, i) => <circle key={i} cx={MX - R + rnd(i, 121) * 2 * R} cy={MY - R + rnd(i, 122) * 2 * R} r={0.6 + rnd(i, 123) * 1.2} fill="#FFF3D6" opacity={0.3 + 0.5 * rnd(i, 124)}/>)}
        <Glow x={moon[0]} y={moon[1]} rx={190} g="fl-cool" o={0.9}/>
        <circle cx={moon[0]} cy={moon[1]} r={46} fill="#F4F1E6"/>
        <circle cx={moon[0] + 12} cy={moon[1] - 8} r={9} fill="#D8D4C8" opacity={0.5}/>
        <circle cx={moon[0] - 14} cy={moon[1] + 12} r={6} fill="#D8D4C8" opacity={0.4}/>
        {[0, 1].map((k) => <ellipse key={k} cx={MX - 260 + ((f * (0.35 + k * 0.2) + k * 240) % 620)} cy={MY + 30 + k * 70} rx={150} ry={12} fill="#3A4677" opacity={0.45}/>)}
        {/* bronze gives back a little gold, and the lamp's glow at its lower edge */}
        <circle cx={MX} cy={MY} r={R} fill="#C9A060" opacity={0.08}/>
        <Glow x={MX - R * 0.8} y={MY + R * 0.75} rx={R * 0.9} ry={R * 0.6} g="fl-soft" o={0.5}/>
        <rect x={MX - R} y={MY - R} width={2 * R} height={2 * R} fill={`url(#${id}s)`}/>
        {/* the dust: a dull film, blotches and specks, and the moon only a smear through it */}
        <g mask={`url(#${id}k)`} opacity={1 - 0.6 * clear}>
          <circle cx={MX} cy={MY} r={R} fill={`url(#${id}d)`} opacity={0.95}/>
          <Glow x={moon[0]} y={moon[1]} rx={150} g="fl-cool" o={0.3}/>
          {Array.from({length: 8}, (_, i) => <ellipse key={i} cx={MX + (rnd(i, 131) - 0.5) * R * 1.3} cy={MY + (rnd(i, 132) - 0.5) * R * 1.3} rx={50 + rnd(i, 133) * 70} ry={36 + rnd(i, 134) * 50} fill={`url(#${id}b)`}/>)}
          {specks.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#C8B8A0" opacity={p.o}/>)}
        </g>
      </g>
      <Rimmed paths={[ring, ...crest, stand, knot, ...beads]} light={lightV} fill="#24160F" rim={K.rim} w={3.2} evenodd/>
      <circle cx={MX} cy={MY} r={R + 1} fill="none" stroke="#C99A5E" strokeWidth={2} opacity={0.6}/>
      <circle cx={MX} cy={MY} r={R + 22} fill="none" stroke="#0A0508" strokeWidth={3} opacity={0.6}/>
      <circle cx={MX} cy={MY} r={R + 24} fill="none" stroke="#C99A5E" strokeWidth={1} opacity={0.35}/>
      {motes}
      {/* the table and the lamp beside the mirror */}
      <rect x={-60} y={TABLE} width={W + 120} height={H - TABLE + 60} fill={`url(#${id}t)`}/>
      <rect x={-60} y={TABLE} width={W + 120} height={2} fill={K.rim} opacity={0.35}/>
      <Glow x={LF[0]} y={TABLE + 6} rx={560} ry={70} g="fl-floor" o={0.85}/>
      <Diya x={lamp[0]} y={TABLE - 56 * DS} s={DS} lit={1} shadow={0.7}/>
      <Flame x={lamp[0]} y={LF[1]} h={86} w={16.5} sway={0.01} t={f / 6} b={1 + 0.03 * Math.sin(f / 37)} halo={0.85}/>
      <Dust f={f} sun={[MX, MY]} n={50} y0={150} y1={950}/>
    </Frame>
  );
};
const Smoke: React.FC<SceneP> = ({s, n}) => (s.variant === "mirror" ? <Mirror s={s} n={n}/> : <SmokeVeil s={s} n={n}/>);

// ---------- 8.24-26: the flame that climbs the path of light to the sun ----------
const FlameSun: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const mood = moodOf(s, "dawn");
  const id = uid();
  const SUN: V2 = [960, 400], SR = 58, HZ = 566, BANK = 892;
  const DS = 0.86, DY = BANK - 56 * DS, FY = DY + 17 * DS, FH = 80;
  const T0 = 0.16 * n, T1 = 0.84 * n;
  const lift = ease(f, 0.06 * n, T0 - 0.06 * n), u = sstep((f - T0) / (T1 - T0)), gone = f > T0;
  const merge = ease(f, T1 - 0.06 * n, 0.14 * n);
  // the spark: up from the flame's tip, along the path of light, smaller as it goes into the distance
  const sy0 = FY - FH * (1 + 0.35 * lift);
  const at = (uu: number) => ({x: SUN[0] + Math.sin(uu * Math.PI * 2.5) * 18 * (1 - uu), y: lerp(sy0, SUN[1], uu), s: lerp(1, 0.4, Math.pow(uu, 0.8))});
  const sp = at(u);
  const path = clamp01(0.3 + 0.7 * Math.max(u, 0.3 * lift));
  const rows: React.ReactNode[] = [];
  for (let r = 0; r < 46; r++) {
    const q = r / 45, y = HZ + 3 + Math.pow(q, 1.6) * (BANK - HZ - 14), spread = lerp(16, 250, Math.pow(q, 1.1));
    for (let j = 0; j < 4; j++) {
      const k = r * 4 + j, x = SUN[0] + (rnd(k, 141) - 0.5) * 2 * spread * (0.3 + 0.7 * rnd(k, 142)), len = lerp(8, 70, q) * (0.5 + rnd(k, 143));
      const tw = 0.5 + 0.5 * Math.sin(f / (4 + rnd(k, 144) * 5) + k), lit = Math.max(0, 1 - Math.abs(x - SUN[0]) / (spread * 1.2));
      rows.push(<rect key={k} x={x - len / 2} y={y} width={len} height={lerp(1.2, 3.2, q)} rx={1} fill="#FFE6B8" opacity={tw * lit * (0.35 + 0.5 * path)}/>);
    }
  }
  const trail = Array.from({length: 12}, (_, k) => { const p = at(Math.max(0, u - (k + 1) * 0.016)); return {...p, o: (1 - k / 12) * 0.6}; });
  const far: Pt[] = [[-60, HZ + 4], ...Array.from({length: 24}, (_, i) => [i * 86 - 40, HZ - 12 - rnd(i, 151) * 26 - (i % 5 === 2 ? 18 : 0)] as Pt), [W + 60, HZ + 2]];
  const ghat = ridge([[-60, BANK + 6], [300, BANK - 2], [700, BANK + 2], [960, BANK], [1240, BANK + 2], [1600, BANK - 4], [W + 60, BANK + 4]]);
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.06)} cx={SUN[0]} cy={620}>
      <FlameDefs/>
      <Sky mood={mood} sun={SUN} sunR={SR} f={f} rays={0.28 + 0.4 * merge} id={`fsun${id}`} clouds={0.55}/>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E3A27E"/><stop offset="0.22" stopColor="#7D6A92"/><stop offset="1" stopColor="#1E2448"/></linearGradient>
        <linearGradient id={`${id}h`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFE3A3" stopOpacity={0}/><stop offset="0.5" stopColor="#FFF0C8"/><stop offset="1" stopColor="#FFE3A3" stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}v`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={0} y2={FY}><stop offset="0" stopColor="#fff" stopOpacity={0.15}/><stop offset={SUN[1] / FY} stopColor="#fff" stopOpacity={1}/><stop offset="0.85" stopColor="#fff" stopOpacity={0.55}/><stop offset="1" stopColor="#fff" stopOpacity={0}/></linearGradient>
        <mask id={`${id}k`} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}><rect x={0} y={0} width={W} height={FY} fill={`url(#${id}v)`}/></mask>
        <radialGradient id={`${id}s`}><stop offset="0" stopColor="#FFFDF4"/><stop offset="0.75" stopColor="#FFF4D8"/><stop offset="0.92" stopColor="#FFE6B0" stopOpacity={0.9}/><stop offset="1" stopColor="#FFE6B0" stopOpacity={0}/></radialGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2A1C34"/><stop offset="0.3" stopColor="#170E1E"/><stop offset="1" stopColor="#0A060E"/></linearGradient>
      </defs>
      {/* the river, holding the dawn */}
      <rect x={-60} y={HZ} width={W + 120} height={BANK - HZ + 60} fill={`url(#${id}w)`}/>
      <Glow x={SUN[0]} y={HZ + 8} rx={560} ry={80} g="fl-warm" o={0.5}/>
      <Rimmed paths={[ridge(far, HZ + 30)]} light={[0, -1]} fill="#2A2040" rim="#FFC890" w={1.6}/>
      <Shrine x={1330} y={HZ - 8} s={0.17} glow={0.2} light={[SUN[0] - 1330, SUN[1] - HZ]} rim="#FFC890"/>
      {/* the path of light: the sun's track on the water and a column of light rising through the sun */}
      {rows}
      <g mask={`url(#${id}k)`} opacity={0.2 + 0.4 * path}>
        <rect x={SUN[0] - 130} y={0} width={260} height={FY} fill={`url(#${id}h)`} opacity={0.5}/>
        <rect x={SUN[0] - 34} y={0} width={68} height={FY} fill={`url(#${id}h)`}/>
      </g>
      <Glow x={SUN[0]} y={SUN[1]} rx={SR * (2.4 + 2.6 * merge)} g="fl-hot" o={0.45 + 0.5 * merge}/>
      <circle cx={SUN[0]} cy={SUN[1]} r={SR * 0.98} fill={`url(#${id}s)`}/>
      {/* the ghat: a stone step at the water's edge, the lamp on it */}
      <Rimmed paths={[ghat]} light={[0, -1]} fill={`url(#${id}g)`} rim="#FFC890" w={2.2}/>
      <path d={Array.from({length: 7}, (_, i) => `M ${-60 + i * 330 + (i % 2) * 90} ${BANK + 8} l 0 52`).join(" ")} stroke="#05030A" strokeWidth={2.5} opacity={0.55}/>
      <rect x={-60} y={BANK + 60} width={W + 120} height={H - BANK} fill="#0A060E"/>
      <rect x={-60} y={BANK + 60} width={W + 120} height={1.6} fill="#FFC890" opacity={0.25}/>
      <Glow x={SUN[0]} y={BANK + 4} rx={340} ry={40} g="fl-floor" o={0.85}/>
      <Diya x={SUN[0]} y={DY} s={DS} lit={gone ? 0.8 : 1} shadow={0.6}/>
      <Flame x={SUN[0]} y={FY} h={FH * (gone ? 0.6 : 1 + 0.35 * lift)} w={15 * (gone ? 0.85 : 1 - 0.15 * lift)} sway={0.012} t={f / 6} b={gone ? 0.85 : 1} halo={0.7}/>
      {gone && u < 1 ? <g>
        {trail.map((p, k) => <circle key={k} cx={p.x} cy={p.y} r={3.4 * p.s} fill="#FFE9B8" opacity={p.o}/>)}
        <Glow x={sp.x} y={sp.y} rx={110 * sp.s} g="fl-warm"/>
        <path d={flameOutline(sp.x, sp.y + 18 * sp.s, 44 * sp.s, 9 * sp.s, 0, 0.03, f / 4)} fill="#FFD889"/>
        <path d={flameOutline(sp.x, sp.y + 14 * sp.s, 24 * sp.s, 5 * sp.s, 0, 0.03, f / 4)} fill="#FFFBEA"/>
      </g> : null}
      <Dust f={f} sun={SUN} n={70} y0={150} y1={880}/>
    </Frame>
  );
};

export const SCENES: Record<string, React.FC<SceneP>> = {lamp: Lamp, fire: Fire, smoke: Smoke, "flame-sun": FlameSun};
