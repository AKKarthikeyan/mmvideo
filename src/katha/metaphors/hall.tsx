// Katha scenes: the hall (22 Oct 2026). The frame story of the Gita and the closing card.
//  "sanjaya": the blind king Dhritarashtra's hall in Hastinapura at night. Arcades of carved pillars and cusped arches
//    recede to a far arch; through it, a red glow on the horizon where the battle is. A bronze lamp hangs on its chains;
//    the old king sits on his high throne, crowned and bearded, a little bowed, his hand on his staff, very still;
//    Sanjaya sits on a low seat beside him, turbaned, and tells what the sage's gift lets him see.
//    s.variant: "listen" (default) | "alone" (the king alone in the dark, the lamp low) | "dawn" (the end of the telling:
//    grey dawn through the arches, the lamp burned low). Optional hints the film data carries: s.lamp ("low", "soft",
//    "leaps", "stretches tall", "flares white", "back to an ordinary flame") and s.detail ("grey of morning" picks dawn,
//    "shields his eyes", "head lifts" / "turns his head" / "toward the voice"). s.mood tints the sky through the arch.
//  "end": the closing card: one diya burning on a dark ground in its halo; s.title (default "The Bhagavad Gita"),
//    s.subtitle (default "as Krishna told it to Arjuna"), a gold rule and the credit lines s.lines fading in one by one.
// Lamplight: near-black silhouettes, a thin warm rim on the side facing the light, light the only colour. Every glow, haze
// and beam is a radial or linear gradient (no blur or turbulence filters: long software renders dropped tiles under them).
import React, {useId} from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {K, W, H, EN} from "../look";
import {SceneP, Frame, push} from "../stage";
import {Dust} from "../sky";
import {smooth, ribbon, rnd, lerp, clamp01, sampleCubics, Pt} from "../geom";
import {Rule, wrap, Mandala} from "../cards";

type V2 = [number, number];
type It = {d: string; t?: string};
// ---------- small helpers ----------
const ease = (f: number, a: number, d: number) => interpolate(f, [a, a + Math.max(0.001, d)], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
const sstep = (v: number) => { const t = clamp01(v); return t * t * (3 - 2 * t); };
const wob = (t: number, s = 0) => Math.sin(t + s * 1.7) * 0.5 + Math.sin(t * 2.31 + s * 3.1) * 0.3 + Math.sin(t * 4.07 + s * 5.3) * 0.2;
const uid = () => "hl" + useId().replace(/[^a-zA-Z0-9]/g, "");
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => { const A = hex(a), B = hex(b); return "#" + A.map((v, i) => Math.round(lerp(v, B[i], clamp01(t))).toString(16).padStart(2, "0")).join(""); };
const n1 = (v: number) => v.toFixed(1);
// Move a shape away from a point light at L by scaling about it (far parts move more: the rim is on the side facing L).
const about = (L: V2, s: number) => `translate(${n1(L[0])} ${n1(L[1])}) scale(${s.toFixed(4)}) translate(${n1(-L[0])} ${n1(-L[1])})`;
// Move a shape w px away from a light at L, as seen from the point c.
const away = (L: V2, c: V2, w: number) => { const dx = c[0] - L[0], dy = c[1] - L[1], l = Math.hypot(dx, dy) || 1; return `translate(${(dx / l * w).toFixed(2)} ${(dy / l * w).toFixed(2)})`; };
const sh = (pts: Pt[], dx: number, dy: number, s = 1): Pt[] => pts.map((p) => (p[2] ? [p[0] * s + dx, p[1] * s + dy, "c"] : [p[0] * s + dx, p[1] * s + dy]) as Pt);
const poly = (pts: number[][]) => `M ${pts.map((p) => `${n1(p[0])} ${n1(p[1])}`).join(" L ")} Z`;
const pearls = (pts: number[][], r: number): string => pts.map(([x, y]) => `M ${n1(x + r)} ${n1(y)} a ${r} ${r} 0 1 0 ${-2 * r} 0 a ${r} ${r} 0 1 0 ${2 * r} 0 Z`).join(" ");

// One silhouette lit by stacked layers. The first colour fills the whole shape; each later layer is the same shape moved
// by its transform (away from a light) and clipped to the shape, so a thin crescent of the colour before it stays on the
// side facing that light. The last layer is the body. Children are drawn inside the clip, over the body (carving).
const Lit: React.FC<{items: It[]; layers: {c: string; t?: string}[]; evenodd?: boolean; children?: React.ReactNode}> = ({items, layers, evenodd, children}) => {
  const id = uid(), fr = evenodd ? "evenodd" : "nonzero";
  const draw = (c: string, k: string) => items.map((it, i) => <path key={k + i} d={it.d} transform={it.t} fill={c} fillRule={fr} clipRule={fr}/>);
  return (
    <g>
      <defs><clipPath id={id}>{draw("#000", "c")}</clipPath></defs>
      {draw(layers[0].c, "a")}
      <g clipPath={`url(#${id})`}>
        {layers.slice(1).map((L, j) => <g key={j} transform={L.t}>{draw(L.c, `l${j}`)}</g>)}
        {children}
      </g>
    </g>
  );
};

// ---------- shared soft lights (every glow is a gradient on an ellipse; bounding-box units, so one def serves all) ----------
const HallDefs: React.FC = () => (
  <defs>
    <radialGradient id="hl-warm"><stop offset="0" stopColor="#FFEFC4" stopOpacity={0.85}/><stop offset="0.16" stopColor="#FFC877" stopOpacity={0.42}/><stop offset="0.45" stopColor="#F0904A" stopOpacity={0.13}/><stop offset="1" stopColor="#C2553A" stopOpacity={0}/></radialGradient>
    <radialGradient id="hl-air"><stop offset="0" stopColor="#FFC877" stopOpacity={0.36}/><stop offset="0.2" stopColor="#E8904A" stopOpacity={0.16}/><stop offset="0.55" stopColor="#8E3D52" stopOpacity={0.05}/><stop offset="1" stopColor="#4A2B5C" stopOpacity={0}/></radialGradient>
    <radialGradient id="hl-hot"><stop offset="0" stopColor="#FFFDF2"/><stop offset="0.3" stopColor="#FFE9B8" stopOpacity={0.75}/><stop offset="1" stopColor="#FFC877" stopOpacity={0}/></radialGradient>
    <radialGradient id="hl-soft"><stop offset="0" stopColor="#FFC877" stopOpacity={0.55}/><stop offset="0.5" stopColor="#E8904A" stopOpacity={0.18}/><stop offset="1" stopColor="#C2553A" stopOpacity={0}/></radialGradient>
    <radialGradient id="hl-red"><stop offset="0" stopColor="#FF8A4A" stopOpacity={0.75}/><stop offset="0.3" stopColor="#D2502E" stopOpacity={0.4}/><stop offset="1" stopColor="#8E2D2E" stopOpacity={0}/></radialGradient>
    <radialGradient id="hl-cool"><stop offset="0" stopColor="#E4E6F2" stopOpacity={0.6}/><stop offset="0.35" stopColor="#A6ACCC" stopOpacity={0.22}/><stop offset="1" stopColor="#6B78A8" stopOpacity={0}/></radialGradient>
    <radialGradient id="hl-shade"><stop offset="0" stopColor="#030108" stopOpacity={0.85}/><stop offset="0.5" stopColor="#030108" stopOpacity={0.45}/><stop offset="1" stopColor="#030108" stopOpacity={0}/></radialGradient>
    <radialGradient id="hl-blue"><stop offset="0" stopColor="#6F8CFF" stopOpacity={0.85}/><stop offset="1" stopColor="#3D5BD0" stopOpacity={0}/></radialGradient>
    <linearGradient id="hl-flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#FF8A3A" stopOpacity={0.25}/><stop offset="0.14" stopColor="#FFB45A" stopOpacity={0.95}/><stop offset="0.42" stopColor="#FFD889"/><stop offset="0.78" stopColor="#FFB451"/><stop offset="1" stopColor="#F07A35" stopOpacity={0.8}/></linearGradient>
    <radialGradient id="hl-core" cx="0.5" cy="0.72" r="0.6"><stop offset="0" stopColor="#FFFFF6"/><stop offset="0.55" stopColor="#FFF4D0" stopOpacity={0.9}/><stop offset="1" stopColor="#FFE2A0" stopOpacity={0}/></radialGradient>
    <linearGradient id="hl-smoke" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#E8C8A0" stopOpacity={0.5}/><stop offset="0.4" stopColor="#A08890" stopOpacity={0.22}/><stop offset="1" stopColor="#6A6080" stopOpacity={0}/></linearGradient>
    <linearGradient id="hl-down" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#030108" stopOpacity={0}/><stop offset="1" stopColor="#030108" stopOpacity={0.7}/></linearGradient>
  </defs>
);
const Glow: React.FC<{x: number; y: number; rx: number; ry?: number; g?: string; o?: number}> = ({x, y, rx, ry, g = "hl-warm", o = 1}) =>
  o <= 0.002 || rx <= 0 ? null : <ellipse cx={x} cy={y} rx={rx} ry={ry ?? rx} fill={`url(#${g})`} opacity={Math.min(1, o)}/>;

// ---------- the flame ----------
const flamePath = (x: number, y: number, h: number, w: number, lean: number, sway: number, t: number): string => {
  const N = 11, L: Pt[] = [], R: Pt[] = [];
  let tip: Pt = [x, y - h, "c"];
  for (let i = 1; i <= N; i++) {
    const u = i / N;
    const hw = u < 0.26 ? w * Math.sqrt(Math.max(0, 1 - Math.pow((0.26 - u) / 0.26, 2))) : w * Math.pow((1 - u) / 0.74, 1.2);
    const cx = x + lean * h * u * u + sway * h * Math.pow(u, 1.6) * Math.sin(t - u * 3.1), cy = y - h * u;
    if (i === N) { tip = [cx, cy, "c"]; break; }
    L.push([cx - hw, cy]); R.push([cx + hw, cy]);
  }
  return smooth([[x, y + w * 0.12], ...R, tip, ...L.reverse()] as Pt[]);
};
// A lamp flame: soft fringes, the gold body, a white core, a blue root. b = brightness, white = the flare toward white.
const Flame: React.FC<{x: number; y: number; h: number; t: number; seed?: number; b?: number; halo?: number; white?: number}> = ({x, y, h, t, seed = 0, b = 1, halo = 1, white = 0}) => {
  if (b <= 0.01 || h < 0.5) return null;
  const hh = h * (1 + 0.07 * wob(t * 0.9, seed)), w = hh * 0.2, lean = 0.05 * wob(t * 0.37, seed + 3), sway = 0.05 + 0.03 * wob(t * 0.5, seed + 1), ph = t * 1.3 + seed;
  return (
    <g>
      {halo > 0 ? <Glow x={x} y={y - hh * 0.45} rx={hh * 4.2} o={halo * b * 0.9}/> : null}
      <Glow x={x} y={y - hh * 0.42} rx={hh * 1.1} ry={hh * 1.3} g="hl-soft" o={0.9 * b}/>
      <path d={flamePath(x, y + hh * 0.05, hh * 1.16, w * 2.0, lean, sway, ph)} fill="#F59A45" opacity={0.14 * Math.min(1, b)}/>
      <path d={flamePath(x, y + hh * 0.03, hh * 1.07, w * 1.42, lean, sway, ph)} fill="#FFB45A" opacity={0.26 * Math.min(1, b)}/>
      <path d={flamePath(x, y, hh, w, lean, sway, ph)} fill="url(#hl-flame)" opacity={Math.min(1, b * 1.1)}/>
      <path d={flamePath(x, y - hh * 0.03, hh * (0.62 + 0.3 * white), w * (0.6 + 0.35 * white), lean * 0.7, sway * 0.7, ph)} fill="url(#hl-core)" opacity={Math.min(1, b * 1.1)}/>
      <ellipse cx={x} cy={y - hh * 0.05} rx={w * 0.7} ry={hh * 0.11} fill="url(#hl-blue)" opacity={0.5 * (1 - white)}/>
    </g>
  );
};

// ---------- the hall: one-point perspective, every arcade the same shape at its own depth ----------
const VPX = 960, VPY = 540;                          // the vanishing point: the eye is level with the seated king's head
const proj = (k: number) => `translate(${VPX} ${VPY}) scale(${k})`;
const toScreen = (X: number, Y: number, k: number): V2 => [VPX + X * k, VPY + Y * k];
const HW = 820, A = 80, YF = 330, YS = -570, YA = -900, YT = -2600, WO = 1600;   // world units: a person is ~400 tall
// A Mughal-Rajput arch: from the springing (-hw, ys) up to a slightly pointed apex (0, ya) and down to (hw, ys).
const archLine = (hw: number, ys: number, ya: number, m = 200, pk = 0.2): V2[] => {
  const h = ys - ya, out: V2[] = [];
  for (let i = 0; i <= m; i++) {
    const u = i / m, t = u <= 0.5 ? u * 2 : (1 - u) * 2, th = (t * Math.PI) / 2;
    out.push([-hw * Math.cos(th) * (u <= 0.5 ? 1 : -1), ys - h * ((1 - pk) * Math.sin(th) + pk * t * t * t)]);
  }
  return out;
};
// The same arch engrailed: n round lobes cut into the solid, meeting at sharp cusps that point into the opening.
const cusped = (hw: number, ys: number, ya: number, n: number, depth: number, dx = 0): Pt[] => {
  const L = archLine(hw, ys, ya, 400), cum = [0];
  for (let i = 1; i < L.length; i++) cum.push(cum[i - 1] + Math.hypot(L[i][0] - L[i - 1][0], L[i][1] - L[i - 1][1]));
  const tot = cum[cum.length - 1];
  const at = (s: number): [V2, V2] => {
    let i = 1; while (i < L.length - 1 && cum[i] < s) i++;
    const a = L[i - 1], b = L[i], u = (s - cum[i - 1]) / Math.max(1e-6, cum[i] - cum[i - 1]), l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [[lerp(a[0], b[0], u), lerp(a[1], b[1], u)], [(b[0] - a[0]) / l, (b[1] - a[1]) / l]];
  };
  const pts: Pt[] = [];
  for (let j = 0; j < n; j++) {
    const s0 = (tot * j) / n, s1 = (tot * (j + 1)) / n, [p0] = at(s0);
    pts.push([p0[0] + dx, p0[1], "c"]);
    for (const u of [0.12, 0.28, 0.5, 0.72, 0.88]) {
      const [p, tg] = at(lerp(s0, s1, u)), o = depth * Math.pow(Math.sin(Math.PI * u), 0.62);
      pts.push([p[0] + tg[1] * o + dx, p[1] - tg[0] * o]);
    }
  }
  const [pe] = at(tot);
  pts.push([pe[0] + dx, pe[1], "c"]);
  return pts;
};
// The pillar, top (the springing) to floor: [height above the floor, half-width in A, sharp corner]. A stepped bracket,
// an abacus, hanging foliage over the vase-and-foliage capital, a ring, the shaft with two bands and a medallion, a ring,
// the swelling lotus base and a two-stepped plinth.
const PROF: [number, number, boolean?][] = [
  [900, 1.75, true], [886, 1.75], [873, 1.55], [864, 1.3, true], [864, 1.12, true], [850, 1.12, true],
  [846, 0.95], [838, 1.13], [828, 1.06, true], [824, 0.8],
  [814, 0.74], [798, 0.96], [780, 1.0], [762, 0.9], [750, 0.7, true],
  [748, 0.8, true], [736, 0.8, true], [734, 0.62, true],
  [596, 0.62, true], [592, 0.74, true], [574, 0.74, true], [570, 0.62, true],
  [414, 0.64, true], [408, 0.72], [392, 0.8], [376, 0.72], [370, 0.64, true],
  [194, 0.68, true], [190, 0.8, true], [174, 0.8, true], [170, 0.72, true],
  [150, 0.78], [126, 0.98], [104, 1.12], [92, 1.14, true],
  [92, 1.26, true], [70, 1.26, true], [70, 1.4, true], [0, 1.4, true],
];
const pillar = (xc: number): string => {
  const R: Pt[] = PROF.map(([h, r, c]) => (c ? [xc + r * A, YF - h, "c"] : [xc + r * A, YF - h]) as Pt);
  const L: Pt[] = PROF.slice().reverse().map(([h, r, c]) => (c ? [xc - r * A, YF - h, "c"] : [xc - r * A, YF - h]) as Pt);
  return smooth([...R, ...L]);
};
const PXC = HW + 0.62 * A;                                     // pillar centre: the shaft's inner face is the springing
const PORTAL_D = [smooth([...cusped(HW, YS, YA, 11, 54), [WO, YS, "c"], [WO, YT, "c"], [-WO, YT, "c"], [-WO, YS, "c"]]), pillar(-PXC), pillar(PXC)];
const ARCHIVOLT = (o: number) => `M ${archLine(HW + o, YS, YA - o * 1.05, 80).map((p) => `${n1(p[0])} ${n1(p[1])}`).join(" L ")}`;
const CARVE = (() => {
  const d: string[] = [];
  for (const sd of [-1, 1]) {
    const xc = sd * PXC;
    for (const fx of [-0.3, 0, 0.3]) d.push(`M ${n1(xc + fx * A)} ${YF - 196} L ${n1(xc + fx * A)} ${YF - 368} M ${n1(xc + fx * A)} ${YF - 416} L ${n1(xc + fx * A)} ${YF - 568} M ${n1(xc + fx * A)} ${YF - 598} L ${n1(xc + fx * A)} ${YF - 732}`);
    for (const h of [90, 172, 192, 572, 594, 738, 748, 852]) d.push(`M ${n1(xc - 1.3 * A)} ${YF - h} L ${n1(xc + 1.3 * A)} ${YF - h}`);
  }
  d.push(`M ${-HW - 150} ${YS} L ${-HW - 150} ${YA - 170} L ${HW + 150} ${YA - 170} L ${HW + 150} ${YS}`);   // the frame round the arch
  d.push(`M ${-WO} ${YA - 250} L ${WO} ${YA - 250} M ${-WO} ${YA - 290} L ${WO} ${YA - 290}`);              // the cornice
  return d.join(" ");
})();
const ROSETTES = [-1, 1].map((sd) => {
  const cx = sd * HW * 0.66, cy = YA - 40, r = 44;
  return `M ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} Z ` + Array.from({length: 8}, (_, i) => {
    const a = (i / 8) * Math.PI * 2, px = cx + Math.cos(a) * r * 0.55, py = cy + Math.sin(a) * r * 0.55;
    return `M ${n1(px + 9)} ${n1(py)} A 9 9 0 1 0 ${n1(px - 9)} ${n1(py)} A 9 9 0 1 0 ${n1(px + 9)} ${n1(py)} Z`;
  }).join(" ");
}).join(" ");
// One arcade at depth k (k = 1 is the nearest): both pillars and the cusped arch as one rim-lit silhouette.
const Portal: React.FC<{k: number; L: V2; body: string; warm: string; rim: string; eps: number; carve: number; rimOp?: number}> = ({k, L, body, warm, rim, eps, carve, rimOp = 0.9}) => {
  const id = uid(), Lw: V2 = [(L[0] - VPX) / k, (L[1] - VPY) / k];
  return (
    <g>
      <defs>
        <radialGradient id={`${id}f`} gradientUnits="userSpaceOnUse" cx={Lw[0]} cy={Lw[1]} r={1500}><stop offset="0" stopColor={warm}/><stop offset="0.55" stopColor={body}/><stop offset="1" stopColor={body}/></radialGradient>
        <radialGradient id={`${id}c`} gradientUnits="userSpaceOnUse" cx={Lw[0]} cy={Lw[1]} r={1300}><stop offset="0" stopColor={rim} stopOpacity={0.5}/><stop offset="0.6" stopColor={rim} stopOpacity={0.1}/><stop offset="1" stopColor={rim} stopOpacity={0}/></radialGradient>
        <radialGradient id={`${id}r`} gradientUnits="userSpaceOnUse" cx={Lw[0]} cy={Lw[1]} r={1150 / Math.sqrt(k)}><stop offset="0" stopColor={rim} stopOpacity={rimOp}/><stop offset="0.45" stopColor={rim} stopOpacity={rimOp * 0.55}/><stop offset="1" stopColor={rim} stopOpacity={rimOp * 0.08}/></radialGradient>
      </defs>
      <Lit items={PORTAL_D.map((d) => ({d, t: proj(k)}))} layers={[{c: `url(#${id}r)`}, {c: `url(#${id}f)`, t: about(L, 1 + eps)}]}>
        <g transform={proj(k)} opacity={carve}>
          <path d={CARVE} fill="none" stroke={`url(#${id}c)`} strokeWidth={3}/>
          <path d={CARVE} fill="none" stroke="#030108" strokeWidth={5} opacity={0.5} transform="translate(0 5)"/>
          <path d={ARCHIVOLT(70)} fill="none" stroke={`url(#${id}c)`} strokeWidth={4}/>
          <path d={ARCHIVOLT(110)} fill="none" stroke={`url(#${id}c)`} strokeWidth={2.5}/>
          <path d={ARCHIVOLT(96)} fill="none" stroke="#030108" strokeWidth={10} opacity={0.4}/>
          <path d={ROSETTES} fill="none" stroke={`url(#${id}c)`} strokeWidth={3}/>
        </g>
      </Lit>
    </g>
  );
};

// ---------- the far wall: the great arch to the night outside, and two pierced-stone windows ----------
const KF = 0.38, FHW = 450, FYS = -250, FYA = -500;
const FAR_OPEN = smooth([[-FHW, YF, "c"], ...cusped(FHW, FYS, FYA, 9, 34), [FHW, YF, "c"]]);
const FAR_WALL = `M -3000 ${YT} L 3000 ${YT} L 3000 ${YF} L -3000 ${YF} Z ${FAR_OPEN}`;
// two high windows of pierced stone above the arch: night blue, or the first grey of morning
const HIGH = [-1, 1].map((sd) => smooth([[sd * 800 - 105, -600, "c"], ...cusped(105, -750, -850, 5, 12, sd * 800), [sd * 800 + 105, -600, "c"]]));
const FAR_FRAME = `M ${archLine(FHW + 50, FYS, FYA - 52, 60).map((p) => `${n1(p[0])} ${n1(p[1])}`).join(" L ")} M ${-FHW - 50} ${FYS} L ${-FHW - 50} ${YF} M ${FHW + 50} ${FYS} L ${FHW + 50} ${YF}`;
// The sky through the far arch and the land below it, by mood: [sky stops], horizon glow colour, land rim colour.
const FAR: Record<string, {sky: [number, string][]; glow: string; rim: string; smoke: string; fires: number}> = {
  night: {sky: [[0, "#06071A"], [0.42, "#111233"], [0.68, "#2E1636"], [0.84, "#6E2430"], [0.94, "#C24A2C"], [1, "#E8783A"]], glow: "hl-red", rim: "#E0603A", smoke: "#5A2430", fires: 1},
  dusk: {sky: [[0, "#120F2A"], [0.4, "#2E2350"], [0.66, "#6A2F55"], [0.84, "#C2553A"], [0.95, "#F0A04B"], [1, "#FFD27A"]], glow: "hl-red", rim: "#F08A4A", smoke: "#6A3040", fires: 0.6},
  gold: {sky: [[0, "#2A1A3E"], [0.4, "#6B3A55"], [0.7, "#C26A45"], [0.9, "#F2A855"], [1, "#FFD98E"]], glow: "hl-warm", rim: "#FFC27A", smoke: "#7A4A40", fires: 0.4},
  dawn: {sky: [[0, "#252C4A"], [0.45, "#4E5574"], [0.72, "#8C8CA4"], [0.9, "#D2B6A8"], [1, "#EED4B6"]], glow: "hl-cool", rim: "#D8D0D8", smoke: "#8A8AA0", fires: 0},
};
const CITY = (() => {    // Hastinapura below the palace: flat roofs, domed pavilions and one temple tower
  const pts: Pt[] = [[-480, 330, "c"], [-480, 262, "c"]];
  const B: [number, number, number][] = [[70, 52, 0], [56, 70, 1], [90, 46, 0], [60, 60, 0], [44, 96, 2], [80, 58, 0], [64, 74, 1], [96, 50, 0], [58, 64, 0]];
  let x = -480;
  for (const [w, h, kind] of B) {
    const y = 330 - h;
    if (kind === 1) pts.push([x, y, "c"], [x + w * 0.12, y - 4], [x + w * 0.5, y - w * 0.42], [x + w * 0.88, y - 4], [x + w, y, "c"]);
    else if (kind === 2) pts.push([x, y + 30, "c"], [x + w * 0.16, y - 10], [x + w * 0.34, y - 60], [x + w * 0.5, y - 84, "c"], [x + w * 0.66, y - 60], [x + w * 0.84, y - 10], [x + w, y + 30, "c"]);
    else pts.push([x, y, "c"], [x + w, y, "c"]);
    x += w;
  }
  pts.push([500, 268, "c"], [500, 330, "c"]);
  return smooth(pts);
})();
const FarView: React.FC<{f: number; mood: string; glow: number}> = ({f, mood, glow}) => {
  const id = uid(), P = FAR[mood] || FAR.night;
  const [x0, y0] = toScreen(-FHW, FYA, KF), [x1, y1] = toScreen(FHW, YF, KF);
  const pulse = glow * (0.86 + 0.1 * Math.sin(f / 37) + 0.05 * wob(f / 11, 2));
  return (
    <g>
      <defs>
        <clipPath id={`${id}k`}><path d={FAR_OPEN} transform={proj(KF)}/></clipPath>
        <linearGradient id={`${id}s`} gradientUnits="userSpaceOnUse" x1={0} y1={y0} x2={0} y2={VPY + 4}>{P.sky.map(([o, c], i) => <stop key={i} offset={o} stopColor={c}/>)}</linearGradient>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mix(P.rim, "#120814", 0.62)}/><stop offset="0.25" stopColor="#1C0E1A"/><stop offset="1" stopColor="#0B060E"/></linearGradient>
        <radialGradient id={`${id}m`} cx="0.5" cy="0.6" r="0.5"><stop offset="0" stopColor={P.smoke} stopOpacity={0.8}/><stop offset="0.55" stopColor={P.smoke} stopOpacity={0.35}/><stop offset="1" stopColor={P.smoke} stopOpacity={0}/></radialGradient>
      </defs>
      <g clipPath={`url(#${id}k)`}>
        <rect x={x0 - 20} y={y0 - 20} width={x1 - x0 + 40} height={VPY - y0 + 26} fill={`url(#${id}s)`}/>
        {mood !== "dawn" ? Array.from({length: 26}, (_, i) => {
          const x = x0 + rnd(i, 41) * (x1 - x0), y = y0 + rnd(i, 42) * (VPY - y0) * 0.55, tw = 0.6 + 0.4 * Math.sin(f / (8 + rnd(i, 43) * 9) + i);
          return <circle key={i} cx={x} cy={y} r={0.5 + rnd(i, 44) * 1.1} fill="#FFF0D6" opacity={(0.25 + 0.5 * rnd(i, 45)) * tw * (1 - (y - y0) / (VPY - y0))}/>;
        }) : null}
        {/* smoke of the battle rising off the horizon in slow soft columns, lit from below */}
        {[[-0.62, 0], [-0.2, 1], [0.22, 2], [0.6, 3]].map(([u, i]) => {
          const bx = VPX + u * (x1 - x0) * 0.5;
          return <g key={i}>{Array.from({length: 7}, (_, j) => {
            const v = ((j + f / 90 + rnd(i, 46)) % 7) / 7, x = bx + 34 * v * v + Math.sin(f / 60 + i + v * 3) * 5, y = VPY - 8 - v * (120 + 30 * rnd(i, 47));
            const r = 16 + 46 * v, o = Math.sin(Math.PI * Math.min(1, v * 1.15)) * (P.fires > 0 ? 0.5 : 0.25);
            return <ellipse key={j} cx={x} cy={y} rx={r} ry={r * 0.72} fill={`url(#${id}m)`} opacity={o}/>;
          })}</g>;
        })}
        <Glow x={VPX} y={VPY} rx={300} ry={64} g={P.glow} o={pulse}/>
        <Glow x={VPX - 60} y={VPY + 2} rx={130} ry={20} g={P.glow} o={pulse * 0.8}/>
        <rect x={x0 - 20} y={VPY} width={x1 - x0 + 40} height={y1 - VPY + 20} fill={`url(#${id}l)`}/>
        {/* the far fires on the plain: points that breathe */}
        {P.fires > 0 ? Array.from({length: 16}, (_, i) => {
          const x = x0 + 14 + rnd(i, 51) * (x1 - x0 - 28), y = VPY + 1 + rnd(i, 52) * 5, b = 0.5 + 0.5 * Math.sin(f / (5 + rnd(i, 53) * 7) + i * 2.1);
          return <circle key={i} cx={x} cy={y} r={0.8 + rnd(i, 54) * 1.2} fill="#FFC890" opacity={P.fires * (0.35 + 0.55 * b)}/>;
        }) : null}
        <g transform={proj(KF)}>
          <path d={CITY} fill="#0A050C" transform="translate(0 6)"/>
          <path d={CITY} fill="none" stroke={P.rim} strokeWidth={3} opacity={0.22 * glow}/>
          <path d={CITY} fill="#0A050C" transform="translate(0 4)"/>
        </g>
      </g>
    </g>
  );
};

// ---------- the figures (faceless silhouettes, faces toward the right; Sanjaya is drawn flipped) ----------
// The profile head of figures.ts (facing right); its jaw meets the neck near (0, -340).
const HEAD: Pt[] = [[-6, -402], [10, -400], [20, -392], [23, -381], [22, -373], [28, -364, "c"], [23, -360], [24, -355], [22, -351], [23, -347], [18, -341], [8, -337], [-4, -341], [-16, -350], [-24, -364], [-26, -380], [-20, -394]];
// The kirita-mukuta of figures.ts: a tall crown swelling like a bell to a finial, petals at its band.
const mukuta = (x: number, y: number, s: number, tall = 1): string[] => {
  const T = (p: number[]): Pt => (p[2] ? [x + p[0] * s, y + p[1] * s * (p[1] < 0 ? tall : 1), "c"] : [x + p[0] * s, y + p[1] * s * (p[1] < 0 ? tall : 1)]) as Pt;
  const C = 1;
  return [
    smooth(([[-25, 0], [-27, -10], [-24, -22], [-20, -34], [-18, -46], [-12, -58], [-6, -70], [-2, -82, C], [2, -70], [8, -58], [14, -46], [16, -34], [20, -22], [23, -10], [21, 0]] as number[][]).map(T)),
    smooth(([[-30, 2], [26, 2], [26, -6, C], [-30, -6, C]] as number[][]).map(T)),
    smooth(([[-4, -84], [0, -96], [4, -84], [0, -78]] as number[][]).map(T)),
    ...[[-30, -4], [26, -4]].map(([px, py]) => smooth(([[px - 4, py], [px, py - 12], [px + 4, py]] as number[][]).map(T))),
  ];
};
// Dhritarashtra on his throne. Local units (a standing person ~400), origin on the floor under the front of the seat.
// The throne is a solid moulded pedestal; his knees reach past its front so his shins hang clear of it.
const THRONE: string[] = [
  poly([[-260, 0], [190, 0], [190, -20], [172, -20], [172, -40], [154, -40], [154, -60], [-236, -60], [-236, -40], [-248, -40], [-248, -20], [-260, -20]]),   // the dais, three steps
  smooth([[0, -60, "c"], [86, -60, "c"], [90, -70], [86, -88, "c"], [4, -88, "c"], [-2, -72]]),                                                            // footstool
  poly([[-196, -60], [-22, -60], [-22, -72], [-30, -76], [-30, -84], [-36, -88], [-36, -160], [-30, -164], [-30, -172], [-20, -176], [-20, -192], [-190, -192], [-190, -176], [-180, -172], [-180, -164], [-174, -160], [-174, -88], [-180, -84], [-180, -76], [-196, -72]]),   // the pedestal
  smooth([[-194, -190], [-190, -203], [-170, -209], [-34, -209], [-20, -203], [-18, -192], [-26, -186], [-184, -186]]),                                      // cushion
  // the tall back, rising behind the king to a flame crest with scrolls, clear of his head
  smooth([[-136, -200, "c"], [-135, -300], [-134, -392], [-126, -412], [-112, -424], [-104, -440], [-112, -446], [-122, -438], [-130, -446], [-128, -462], [-134, -476], [-144, -482], [-150, -510, "c"], [-156, -482], [-166, -476], [-172, -462], [-170, -446], [-178, -438], [-188, -446], [-196, -440], [-188, -424], [-174, -412], [-166, -392], [-165, -300], [-164, -200, "c"]]),
  pearls([[-150, -518]], 6),
];
const KING_BODY: string[] = [
  smooth([[-140, -204, "c"], [-140, -226], [-128, -246], [-96, -254], [-40, -250], [0, -244], [20, -232], [28, -214], [30, -192], [32, -164], [36, -134], [42, -110], [52, -96, "c"], [6, -96, "c"], [8, -122], [8, -152], [4, -176], [-6, -194], [-26, -204, "c"]]),   // robe over lap and legs
  smooth([[8, -98, "c"], [48, -98], [64, -96], [76, -93], [82, -89, "c"], [6, -89, "c"]]),                                                       // the feet on the footstool
  smooth([[-132, -210, "c"], [-136, -250], [-132, -290], [-122, -320], [-108, -340], [-88, -351], [-68, -354], [-50, -348], [-40, -332], [-34, -308], [-36, -280], [-42, -254], [-48, -232], [-62, -214, "c"]]),   // torso, a little hunched
  smooth([[-82, -346], [-56, -350], [-54, -374], [-76, -380]]),                                                                                   // neck
  ribbon(sampleCubics([[-82, -338], [-72, -312], [-56, -284], [-28, -262]], 8), 30, 22),                                                          // upper arm
  ribbon(sampleCubics([[-28, -262], [6, -268], [42, -276], [80, -284]], 8), 22, 15),                                                              // forearm to the staff
  smooth([[74, -294], [82, -302], [96, -301], [101, -292], [100, -278], [92, -270], [78, -272], [72, -282]]),                                     // hand on the staff
];
const STAFF: string[] = [ribbon([[104, -60], [96, -280], [86, -500]], 8, 7), smooth([[86, -500], [95, -510], [93, -528], [86, -546, "c"], [79, -528], [77, -510]]), smooth([[78, -494], [94, -494], [94, -486, "c"], [78, -486, "c"]])];
const KHX = -60, KHY = -10;   // where the old king's head sits
// A king's crown: a jewelled band with upturned petals at its sides, three stepped tiers and a finial.
const kingCrown = (x: number, y: number, s: number, sy = s): string[] => {
  const T = (p: Pt): Pt => (p[2] ? [x + p[0] * s, y + p[1] * sy, "c"] : [x + p[0] * s, y + p[1] * sy]) as Pt;
  return [
    smooth(([[-28, 2, "c"], [28, 2, "c"], [28, -7, "c"], [23, -9], [25, -17], [19, -22, "c"], [21, -30], [15, -36, "c"], [16, -44], [10, -50, "c"], [10, -58], [5, -63, "c"], [3, -70], [7, -77], [0, -92, "c"], [-7, -77], [-3, -70], [-5, -63, "c"], [-10, -58], [-10, -50, "c"], [-16, -44], [-15, -36, "c"], [-21, -30], [-19, -22, "c"], [-25, -17], [-23, -9], [-28, -7, "c"]] as Pt[]).map(T)),
    ...[-1, 1].map((sd) => smooth(([[sd * 24, -2], [sd * 34, -8], [sd * 40, -20, "c"], [sd * 31, -13], [sd * 24, -9]] as Pt[]).map(T))),
    pearls([[x, y - 92 * sy - 4.5 * s]], 4.5 * s),
  ];
};
// The old king's head in profile, faceless: brow, a strong nose, the mouth set back, and a long beard flowing down to a
// soft point; hair falls behind to the nape.
const KING_HEAD = (): string[] => [
  smooth(sh([[-6, -406], [8, -404], [18, -397], [22, -389], [20, -383], [26, -377], [35, -370, "c"], [26, -365], [24, -361], [21, -357, "c"], [26, -349], [29, -334], [28, -316], [22, -296, "c"], [11, -309], [2, -322], [-8, -336], [-14, -348], [-22, -358], [-27, -372], [-27, -388], [-18, -400]], KHX, KHY)),
  smooth(sh([[-16, -398], [-27, -384], [-30, -368], [-33, -352], [-36, -340], [-27, -338], [-21, -350], [-17, -366], [-13, -382]], KHX, KHY)),
  ...kingCrown(KHX - 3, -401 + KHY, 0.92, 0.64),
];
const kingItems = (base: string, bow: number): It[] => {
  const head = `${base} rotate(${bow.toFixed(2)} ${KHX} ${-350 + KHY})`;
  return [...THRONE.map((d) => ({d, t: base})), ...KING_BODY.map((d) => ({d, t: base})), ...STAFF.map((d) => ({d, t: base})), ...KING_HEAD().map((d) => ({d, t: head}))];
};
// Sanjaya on a low seat, telling. Local units, origin on the floor under the seat; drawn facing right (flipped on screen).
const SEAT: string[] = [
  smooth([[-74, -44, "c"], [86, -44, "c"], [90, -51], [86, -58, "c"], [-74, -58, "c"], [-78, -51]]),
  smooth([[62, -44, "c"], [78, -44, "c"], [80, -30], [75, -14], [82, 0, "c"], [64, 0, "c"], [67, -16], [64, -30]]),
  smooth([[-48, -44, "c"], [-64, -44, "c"], [-66, -30], [-61, -14], [-68, 0, "c"], [-50, 0, "c"], [-53, -16], [-50, -30]]),
  smooth([[-56, -44, "c"], [72, -44, "c"], [72, -37], [40, -32], [8, -30], [-24, -32], [-56, -37]]),
];
const SANJ_BODY: string[] = [
  smooth([[-62, -56, "c"], [44, -56, "c"], [70, -56], [88, -60], [94, -71], [88, -85], [68, -95], [38, -101], [10, -105], [-20, -105], [-48, -99], [-62, -82]]),   // crossed legs, the dhoti
  smooth([[76, -60], [92, -58], [96, -48, "c"], [84, -44, "c"], [80, -52]]),                                                                     // the dhoti's fall over the seat
  smooth([[-62, -80, "c"], [-60, -112], [-58, -150], [-58, -190], [-56, -216], [-48, -234], [-32, -244], [-14, -246], [2, -240], [14, -228], [22, -210], [24, -186], [20, -160], [16, -130], [14, -100, "c"]]),   // torso: a straight back, the chest forward
  smooth([[-20, -240], [0, -242], [2, -264], [-18, -266]]),                                                                                      // neck
  smooth([[-58, -206], [-66, -180], [-70, -150], [-68, -124], [-60, -118], [-58, -150], [-54, -186]]),                                           // the shawl falling down his back
];
const SHX = -8, SHY = 340 * 0.94 - 262, SHS = 0.94;   // the head: its jaw at (-8, -262), a little smaller than the king's
const SANJ_HEAD: string[] = [
  smooth(sh(HEAD, SHX, SHY, SHS)),
  smooth(sh([[21, -386], [25, -396], [22, -410], [12, -420], [-2, -425], [-18, -423], [-30, -413], [-35, -399], [-33, -385], [-27, -377], [-16, -381], [2, -387], [14, -386]], SHX, SHY, SHS)),   // the turban, wrapped
  smooth(sh([[4, -422], [10, -432], [17, -428], [15, -420]], SHX, SHY, SHS)),                                                                    // its knot
  pearls([[SHX + 18 * SHS, SHY - 418 * SHS]], 3.4),                                                                                              // a jewel at its front
];
// The telling hand: the forearm forward and up, the palm open and turned up toward the king, moving as he speaks (a).
// shield: the hand raised flat over the brow against a blinding light.
const sanjArm = (a: number, shield: number): string[] => {
  const sx = -24, sy = -228, el: V2 = [lerp(10, 34, shield), lerp(-174, -236, shield)];
  const fa = ((-24 + a) * Math.PI) / 180, wr: V2 = [lerp(10 + Math.cos(fa) * 54, 46, shield), lerp(-174 + Math.sin(fa) * 54, -296, shield)];
  const ha = (lerp(-38 + a * 0.8, -160, shield) * Math.PI) / 180, ux = Math.cos(ha), uy = Math.sin(ha), vx = -uy, vy = ux;
  const hp = (p: number, q: number): Pt => [wr[0] + ux * p + vx * q, wr[1] + uy * p + vy * q];
  return [
    ribbon(sampleCubics([[sx, sy], [lerp(sx, el[0], 0.4) - 4, lerp(sy, el[1], 0.4)], [lerp(sx, el[0], 0.75) - 2, lerp(sy, el[1], 0.75)], el], 8), 24, 18),
    ribbon(sampleCubics([el, [lerp(el[0], wr[0], 0.33), lerp(el[1], wr[1], 0.33)], [lerp(el[0], wr[0], 0.66), lerp(el[1], wr[1], 0.66)], wr], 8), 18, 12),
    smooth([hp(-4, 6), hp(-2, -6), hp(6, -8), hp(10, -15), hp(14, -14), hp(14, -8), hp(24, -7), hp(33, -4), hp(35, -1), hp(33, 2), hp(24, 5), hp(12, 8), hp(2, 9)]),
  ];
};
const sanjItems = (base: string, lift: number, a: number, shield: number): It[] => [
  ...SEAT.map((d) => ({d, t: base})), ...SANJ_BODY.map((d) => ({d, t: base})), ...sanjArm(a, shield).map((d) => ({d, t: base})),
  ...SANJ_HEAD.map((d) => ({d, t: `${base} rotate(${lift.toFixed(2)} -8 -262)`})),
];

// ---------- the hanging lamp: three chains from a swan finial to a five-wicked bronze bowl ----------
const LAMP_BOWL = smooth([[-96, -4, "c"], [96, -4, "c"], [92, 8], [74, 26], [46, 40], [0, 47], [-46, 40], [-74, 26], [-92, 8]]);
const LAMP_SPOUTS = [smooth([[-80, -3], [-102, -9], [-122, -16, "c"], [-106, 4], [-84, 9]]), smooth([[80, -3], [102, -9], [122, -16, "c"], [106, 4], [84, 9]]), smooth([[-14, -3], [0, -12, "c"], [14, -3], [8, 6], [-8, 6]])];
const LAMP_LIP = smooth([[-100, -8, "c"], [100, -8, "c"], [100, 0, "c"], [-100, 0, "c"]]);
const LAMP_DROP = smooth([[-5, 44], [5, 44], [5, 62], [12, 74], [10, 92], [0, 112, "c"], [-10, 92], [-12, 74], [-5, 62]]);
const HAMSA = smooth([[-34, -150], [-22, -164], [-2, -168], [14, -166], [22, -172], [16, -186], [12, -196], [18, -206], [26, -210], [36, -206], [44, -204, "c"], [34, -200], [26, -198], [24, -190], [30, -176], [28, -162], [14, -150], [-12, -146], [-32, -142], [-46, -150], [-54, -170, "c"], [-44, -162]]);
const LAMP_FLAMES: [number, number, number][] = [[-120, -16, 0.86], [-52, -8, 0.78], [0, -11, 1.0], [52, -8, 0.78], [120, -16, 0.86]];
const HangingLamp: React.FC<{px: number; py: number; len: number; ang: number; s: number; f: number; b: number; size: number; white: number; rim: string}> = ({px, py, len, ang, s, f, b, size, white, rim}) => {
  const tr = `translate(${px} ${py}) rotate(${ang.toFixed(3)}) translate(0 ${len}) scale(${s})`;
  const top = -len / s;
  const links = Array.from({length: Math.ceil((-top - 200) / 15)}, (_, i) => -206 - i * 15);
  const metal = "#1A0F16", lamp: V2 = [0, -30];
  return (
    <g transform={tr}>
      {/* the chain: alternate links face us and turn edge-on; lit from below */}
      {links.map((y, i) => (i % 2 ? <rect key={i} x={-1.6} y={y - 8} width={3.2} height={16} rx={1.6} fill="#2A1C1E"/> : <ellipse key={i} cx={0} cy={y} rx={4.2} ry={8.5} fill="none" stroke="#3A2620" strokeWidth={2.4}/>))}
      <path d={links.map((y) => `M 1.5 ${y - 6} L 1.5 ${y + 6}`).join(" ")} stroke={rim} strokeWidth={1} opacity={0.35 * b}/>
      {[-80, 0, 80].map((x, i) => <path key={i} d={`M 0 -150 L ${x} -6`} stroke={i === 1 ? "#24181A" : "#3A2620"} strokeWidth={2.6} strokeDasharray="5 3"/>)}
      {[-80, 80].map((x, i) => <path key={i} d={`M 0 -150 L ${x} -6`} stroke={rim} strokeWidth={1} opacity={0.3 * b} transform="translate(0 1.5)"/>)}
      <Lit items={[{d: HAMSA}, {d: `M -10 -146 L 10 -146 L 6 -138 L -6 -138 Z`}]} layers={[{c: rim}, {c: metal, t: "translate(0 -2.5)"}]}/>
      <Lit items={[{d: LAMP_BOWL}, ...LAMP_SPOUTS.map((d) => ({d})), {d: LAMP_LIP}, {d: LAMP_DROP}]} layers={[{c: rim}, {c: metal, t: "translate(0 3)"}]}>
        <ellipse cx={0} cy={-4} rx={110} ry={22} fill="url(#hl-soft)" opacity={0.55 * b}/>
        <path d="M -88 12 Q 0 34 88 12" fill="none" stroke={rim} strokeWidth={1.4} opacity={0.3 * b}/>
        <path d="M -70 28 Q 0 46 70 28" fill="none" stroke={rim} strokeWidth={1} opacity={0.18 * b}/>
      </Lit>
      {LAMP_FLAMES.map(([x, y, k], i) => <Flame key={i} x={x} y={y} h={36 * k * size} t={f / 4.2} seed={i * 2.3} b={b} halo={0} white={white}/>)}
      {/* a thread of smoke from the middle flame, rising and loosening */}
      {[0, 1].map((j) => { const pts: number[][] = [];
        for (let i = 0; i <= 16; i++) { const u = i / 16; pts.push([Math.sin(f / 37 + u * 4.2 + j * 2) * (3 + 22 * u) + Math.sin(f / 23 + u * 7 + j) * 4 * u + j * 6, -11 - 36 * size - u * 150]); }
        return <path key={j} d={ribbon(pts, 2.4, 9, 0.7)} fill="url(#hl-smoke)" opacity={(j ? 0.5 : 0.8) * Math.min(1, b)}/>; })}
      <Glow x={lamp[0]} y={lamp[1]} rx={190 * Math.sqrt(size)} ry={110 * Math.sqrt(size)} g="hl-soft" o={0.7 * b}/>
      <Glow x={lamp[0]} y={lamp[1] - 6} rx={150} ry={34} g="hl-hot" o={(0.18 + 0.4 * white) * b}/>
    </g>
  );
};
// What the film's s.lamp line asks of the flame, over the beat.
const lampState = (txt: string, f: number, n: number, variant: string) => {
  let b = 1, size = 1, white = 0;
  if (variant === "dawn" || /\blow\b/.test(txt)) { b = 0.55; size = 0.6; }
  else if (variant === "alone") { b = 0.55; size = 0.62; }
  if (/soft/.test(txt)) { b *= 0.85; size *= 0.9; }
  if (/leap/.test(txt)) { const u = ease(f, n * 0.3, 10) * (1 - ease(f, n * 0.3 + 30, n * 0.3)); size *= 1 + 0.75 * u; b *= 1 + 0.35 * u; }
  if (/tall|stretch/.test(txt)) { const u = sstep((f - n * 0.12) / (n * 0.6)); size *= 1 + 0.9 * u; b *= 1 + 0.2 * u; }
  if (/white|flare/.test(txt)) { const u = sstep((f - n * 0.08) / (n * 0.35)); white = u; size *= 1 + 0.55 * u; b *= 1 + 0.6 * u; }
  if (/ordinary|back to/.test(txt)) { const u = 1 - sstep((f - n * 0.04) / (n * 0.5)); white = 0.85 * u; size *= 1 + 0.5 * u; b *= 1 + 0.5 * u; }
  return {b, size, white};
};

// ---------- the scene ----------
const KFIG = 0.95, FLOOR_Y = VPY + YF * KFIG;           // the figures' depth and their floor line on screen
const KING_X = VPX - 320 * KFIG, SANJ_X = VPX + 290 * KFIG;
const SanjayaHall: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const id = uid();
  const detail = String(s.detail || "").toLowerCase(), lampTxt = String(s.lamp || "").toLowerCase();
  const variant: string = ["listen", "alone", "dawn"].includes(s.variant) ? s.variant : /gr[ae]y|morning|dawn/.test(detail) || s.mood === "dawn" ? "dawn" : "listen";
  const dawn = variant === "dawn", alone = variant === "alone";
  const mood = dawn ? "dawn" : ["night", "dusk", "gold"].includes(s.mood) ? s.mood : "night";
  const {b, size, white} = lampState(lampTxt, f, n, variant);
  // the lamp hangs from the ceiling far above and sways a hair on its chain
  const len = 470, sw = 0.45 * Math.sin(f / 46) + 0.15 * Math.sin(f / 19), pivot: V2 = [VPX, -150];
  const L: V2 = [pivot[0] + Math.sin((sw * Math.PI) / 180) * len, pivot[1] + Math.cos((sw * Math.PI) / 180) * len - 30 * 0.8];
  const F: V2 = [VPX, VPY + 30];                          // the far arch, the second light
  const lampB = b * (0.94 + 0.06 * wob(f / 6, 1));
  // light colours
  const goldRim = dawn ? mix(K.rim, "#7A6E7A", 0.4) : alone ? mix(K.rim, "#9A6A50", 0.4) : K.rim;
  const farRim = dawn ? "#AEB4CC" : FAR[mood].rim;
  const rimW = 1.6 + 1.6 * Math.min(1.4, lampB);
  // poses from the film's stage direction
  const lift = /lift|turns? his head|toward the voice/.test(detail) ? sstep((f - n * 0.2) / (n * 0.45)) : 0;
  const bow = lerp(alone ? 12 : 8, -4, lift);
  const shield = /shield/.test(detail) ? sstep((f - n * 0.08) / (n * 0.2)) : 0;
  const tell = dawn ? 0.5 : 1, a = tell * (7 * Math.sin(f / 23) + 4 * Math.sin(f / 9.7 + 1));
  const sLift = -4 + tell * 2.5 * Math.sin(f / 31);
  const kingT = `translate(${KING_X} ${FLOOR_Y}) scale(${KFIG})`, sanjT = `translate(${SANJ_X} ${FLOOR_Y}) scale(${-KFIG} ${KFIG})`;
  const kc: V2 = [KING_X - 20, FLOOR_Y - 260], sc: V2 = [SANJ_X - 10, FLOOR_Y - 150];
  const figBody = "#110A18";
  const figLayers = (c: V2) => {
    const Ls: {c: string; t?: string}[] = [{c: goldRim}];
    if (dawn || alone) { const w1 = dawn ? 1.5 : 1.6, w2 = dawn ? 2.0 : 1.7; Ls.push({c: mix(farRim, figBody, 0.2), t: away(L, c, w1)}, {c: figBody, t: `${away(L, c, w1)} ${away(F, c, w2)}`}); }
    else Ls.push({c: figBody, t: away(L, c, rimW)});
    return Ls;
  };
  const portalRim = dawn ? mix(K.rim, "#C8CCE0", 0.55) : alone ? mix(K.rim, "#C06040", 0.45) : K.rim;
  const air = lampB * (dawn ? 0.55 : alone ? 0.6 : 1);
  const warmWall = "#5A3226";
  const zoom = alone ? push(f, n, 1.06, 1.13) : push(f, n, 1, 1.05);
  const [ax0, ay0] = toScreen(-FHW, YF, KF), [ax1] = toScreen(FHW, YF, KF);
  return (
    <Frame f={f} zoom={zoom} cx={alone ? KING_X + 40 : VPX} cy={alone ? 600 : 590}>
      <HallDefs/>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#090818"/><stop offset="1" stopColor="#05040C"/></linearGradient>
        <linearGradient id={`${id}fl`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={dawn ? "#1A1A2C" : "#14112A"}/><stop offset="0.35" stopColor="#0C0A1C"/><stop offset="1" stopColor="#05040C"/></linearGradient>
        <linearGradient id={`${id}sh`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D8DCEC" stopOpacity={0.14}/><stop offset="0.6" stopColor="#C8CCE0" stopOpacity={0.05}/><stop offset="1" stopColor="#C8CCE0" stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}jl`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={dawn ? "#B8BCD2" : "#1C2456"}/><stop offset="1" stopColor={dawn ? "#E2D2C4" : "#3A3A72"}/></linearGradient>
        <pattern id={`${id}jp`} patternUnits="userSpaceOnUse" width={30} height={30}>
          <path d={`M 0 0 L 30 0 L 30 30 L 0 30 Z ${smooth([[15, 4], [19, 11], [26, 15], [19, 19], [15, 26], [11, 19], [4, 15], [11, 11]])}`} fill="#100A1C" fillRule="evenodd"/>
        </pattern>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id}bg)`}/>
      {/* through the far arch: the night, the battle's glow on the horizon (or the grey of dawn) */}
      <FarView f={f} mood={mood} glow={alone ? 1.15 : 1}/>
      <Lit items={[{d: FAR_WALL, t: proj(KF)}]} evenodd layers={[{c: mix(portalRim, "#1A1430", 0.5)}, {c: dawn ? "#171726" : "#110E24", t: about(F, 1.012)}]}>
        <Glow x={L[0]} y={L[1] + 140} rx={560} ry={460} g="hl-air" o={1.5 * air}/>
        <path d={FAR_FRAME} transform={proj(KF)} fill="none" stroke={farRim} strokeWidth={5} opacity={0.2}/>
        <Glow x={F[0]} y={F[1] - 30} rx={330} ry={260} g={dawn ? "hl-cool" : "hl-red"} o={dawn ? 0.35 : 0.2 * (alone ? 1.3 : 1)}/>
      </Lit>
      {HIGH.map((d, i) => <g key={i}>
        <path d={d} transform={proj(KF)} fill={`url(#${id}jl)`} opacity={dawn ? 0.9 : 0.62}/>
        <path d={d} transform={proj(KF)} fill={`url(#${id}jp)`}/>
        <path d={d} transform={proj(KF)} fill="none" stroke={dawn ? "#C8CCE0" : portalRim} strokeWidth={5} opacity={dawn ? 0.35 : 0.2}/>
      </g>)}
      {/* the floor, polished dark stone: the far arch and the lamp lie in it */}
      <rect x={-60} y={ay0} width={W + 120} height={H} fill={`url(#${id}fl)`}/>
      <Glow x={VPX} y={ay0 + 150} rx={(ax1 - ax0) * 0.42} ry={230} g={dawn ? "hl-cool" : "hl-red"} o={dawn ? 0.3 : 0.22}/>
      <Glow x={VPX} y={ay0 + 10} rx={(ax1 - ax0) * 0.66} ry={26} g={dawn ? "hl-cool" : "hl-red"} o={dawn ? 0.5 : 0.4}/>
      <path d={Array.from({length: 15}, (_, i) => { const X = (i - 7) * 420, p0 = toScreen(X, YF, KF), p1 = toScreen(X, YF, 1.6); return `M ${n1(p0[0])} ${n1(p0[1])} L ${n1(p1[0])} ${n1(p1[1])}`; }).join(" ") + " " +
        [0.44, 0.52, 0.62, 0.75, 0.92, 1.16].map((k) => { const y = VPY + YF * k; return `M -60 ${n1(y)} L ${W + 60} ${n1(y)}`; }).join(" ")} stroke={dawn ? "#3E3E54" : "#2E2440"} strokeWidth={1.2} opacity={dawn ? 0.35 : 0.5} fill="none"/>
      <Glow x={L[0]} y={FLOOR_Y + 10} rx={600} ry={96} g="hl-soft" o={0.42 * air}/>
      <Glow x={L[0]} y={FLOOR_Y + 150} rx={60} ry={230} g="hl-soft" o={0.3 * air}/>
      {[0.52, 0.72].map((k) => { const body = k < 0.6 ? "#110D24" : "#0D0A1D";
        return <Portal key={k} k={k} L={L} body={body} warm={mix(body, warmWall, 0.75 * air)} rim={portalRim} rimOp={k < 0.6 ? 0.75 : 0.85} eps={0.0034 * (0.6 + 0.4 * Math.min(1.3, lampB))} carve={0.85 * Math.min(1, air + 0.25)}/>; })}
      {/* the lamp's light in the air of the hall */}
      <Glow x={L[0]} y={L[1] + 60} rx={1000} ry={780} g="hl-air" o={air}/>
      {dawn ? <Glow x={F[0]} y={F[1] + 40} rx={1100} ry={720} g="hl-cool" o={0.32}/> : null}
      {/* dawn: grey light falls from the high windows */}
      {dawn ? HIGH.map((d, i) => { const sd = i ? 1 : -1, [wx, wy] = toScreen(sd * 800, -640, KF), ex = wx + sd * 120, ey = FLOOR_Y + 60;
        // nested quads give the shaft a soft edge without a blur filter
        return <g key={i}>{[[30, 150, 0.22], [24, 110, 0.3], [18, 72, 0.4], [12, 40, 0.5]].map(([w0, w1, o], j) =>
          <path key={j} d={poly([[wx - w0, wy], [wx + w0, wy], [ex + w1, ey], [ex - w1, ey]])} fill={`url(#${id}sh)`} opacity={o * (0.9 + 0.1 * Math.sin(f / 60 + i))}/>)}</g>; }) : null}
      {/* shadows on the floor, thrown away from the lamp */}
      <ellipse cx={KING_X - 70} cy={FLOOR_Y + 14} rx={300} ry={34} fill="url(#hl-shade)" opacity={0.8}/>
      {!alone ? <ellipse cx={SANJ_X + 40} cy={FLOOR_Y + 12} rx={150} ry={24} fill="url(#hl-shade)" opacity={0.8}/> : null}
      {/* the flare: blinding light behind the figures, so they stay dark against it */}
      {white > 0.01 ? <><Glow x={L[0]} y={L[1] + 80} rx={1400} ry={1050} g="hl-hot" o={0.75 * white}/><Glow x={L[0]} y={L[1]} rx={700} ry={600} g="hl-hot" o={0.6 * white}/></> : null}
      {/* the king, and Sanjaya beside him */}
      <Lit items={kingItems(kingT, bow)} layers={figLayers(kc)}/>
      {dawn && !alone ? <Glow x={SANJ_X - 10} y={FLOOR_Y - 200} rx={190} ry={230} g="hl-warm" o={0.3 + 0.05 * Math.sin(f / 40)}/> : null}
      {!alone ? <Lit items={sanjItems(sanjT, sLift, a, shield)} layers={figLayers(sc)}/> : null}
      {/* the lamp */}
      <Glow x={L[0]} y={L[1] - 4} rx={420 * Math.sqrt(size)} g="hl-warm" o={0.7 * lampB}/>
      <HangingLamp px={pivot[0]} py={pivot[1]} len={len} ang={-sw} s={0.8} f={f} b={lampB} size={size} white={white} rim={K.rim}/>
      <Dust f={f} sun={L} n={70} y0={180} y1={FLOOR_Y} color={dawn ? "#E8E2D8" : "#FFE2A8"}/>
      {/* the nearest arcade frames the shot */}
      <Portal k={1} L={L} body="#080611" warm={mix("#08060E", "#3A2018", 0.45 * air)} rim={portalRim} rimOp={0.8} eps={0.0028} carve={0.7}/>
      {white > 0.01 ? <Glow x={L[0]} y={L[1]} rx={900} ry={700} g="hl-hot" o={0.2 * white}/> : null}
      <rect x={-60} y={880} width={W + 120} height={260} fill="url(#hl-down)" opacity={0.8}/>
    </Frame>
  );
};

// ---------- the closing card: one diya, the title, the credits ----------
// A clay diya seen a little from above, its spout toward us. Origin: the centre of the rim; the flame stands at (0, 30).
const DIYA_BODY = smooth([[-122, 0, "c"], [-116, 18], [-100, 36], [-74, 52], [-40, 62], [0, 66], [40, 62], [74, 52], [100, 36], [116, 18], [122, 0, "c"], [104, -14], [60, -22], [0, -25], [-60, -22], [-104, -14]]);
const DIYA_IN = smooth([[-108, 1], [-92, -10], [-50, -17], [0, -19], [50, -17], [92, -10], [108, 1], [92, 10], [50, 15], [0, 16], [-50, 15], [-92, 10]]);
const DIYA_LIP = smooth([[-122, 0, "c"], [-104, 13], [-60, 22], [-24, 25], [-12, 32], [0, 44, "c"], [12, 32], [24, 25], [60, 22], [104, 13], [122, 0, "c"], [108, 1, "c"], [92, 10], [50, 15], [20, 17], [8, 22], [0, 30, "c"], [-8, 22], [-20, 17], [-50, 15], [-92, 10], [-108, 1, "c"]]);
const DIYA_FOOT = smooth([[-34, 60, "c"], [34, 60, "c"], [38, 70], [30, 76, "c"], [-30, 76, "c"], [-38, 70]]);
const EndDiya: React.FC<{x: number; y: number; s: number; f: number; lit: number}> = ({x, y, s, f, lit}) => {
  const id = uid(), L = clamp01(lit);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6A3020"/><stop offset="0.3" stopColor="#3A1812"/><stop offset="0.75" stopColor="#1A0C0C"/><stop offset="1" stopColor="#0C0709"/></linearGradient>
        <radialGradient id={`${id}i`} cx="0.5" cy="0.8" r="0.7"><stop offset="0" stopColor="#FFD68A" stopOpacity={0.95 * L}/><stop offset="0.35" stopColor="#B86A2A" stopOpacity={0.9}/><stop offset="1" stopColor="#2A140E"/></radialGradient>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mix("#6A3020", "#FFB066", 0.55 * L)}/><stop offset="1" stopColor="#4A2016"/></linearGradient>
      </defs>
      <ellipse cx={0} cy={70} rx={190} ry={20} fill="url(#hl-shade)" opacity={0.9}/>
      <path d={DIYA_FOOT} fill="#120A0C"/>
      <path d={DIYA_BODY} fill={`url(#${id}b)`}/>
      <path d="M -112 22 Q 0 70 112 22" fill="none" stroke={K.rim} strokeWidth={1.2} opacity={0.22 * L}/>
      <path d="M -96 38 Q 0 78 96 38" fill="none" stroke={K.rim} strokeWidth={0.9} opacity={0.12 * L}/>
      {Array.from({length: 9}, (_, i) => { const u = (i - 4) / 4.6, cx = u * 100, cy = 44 + 14 * (1 - u * u); return <circle key={i} cx={cx} cy={cy} r={2.4} fill={K.rim} opacity={0.18 * L * (1 - Math.abs(u) * 0.6)}/>; })}
      <path d={DIYA_IN} fill={`url(#${id}i)`}/>
      <ellipse cx={0} cy={4} rx={40} ry={6} fill="url(#hl-hot)" opacity={0.55 * L}/>
      <path d={DIYA_LIP} fill={`url(#${id}l)`}/>
      <path d={DIYA_LIP} fill="none" stroke={K.rim} strokeWidth={1.4} opacity={0.7 * L}/>
      <path d={ribbon([[0, 0], [1, 10], [-1, 20], [0, 30]], 6, 4)} fill="#2A1A14"/>
      <circle cx={0} cy={30} r={3} fill="#FF7A2A" opacity={L}/>
      <Flame x={0} y={30} h={112 * (0.4 + 0.6 * L)} t={f / 4.5} seed={1.3} b={L} halo={0}/>
    </g>
  );
};
const End: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const id = uid();
  const title = String(s.title || "The Bhagavad Gita"), sub = String(s.subtitle || "as Krishna told it to Arjuna");
  const raw: string[] = Array.isArray(s.lines) ? s.lines.map(String) : [];
  const mood = ["night", "dusk", "dawn", "gold"].includes(s.mood) ? s.mood : "night";
  // the credits, wrapped, laid out below the rule; they shrink together if there are many
  let size = 27, gap = 1.56, wrapped: string[][] = [];
  for (let pass = 0; pass < 5; pass++) {
    wrapped = raw.map((l) => wrap(l, size, 1460, 0.42));
    const rows = wrapped.reduce((a, w) => a + w.length, 0) + Math.max(0, raw.length - 1) * 0.35;
    if (742 + rows * size * gap <= 892 || size < 20) break;
    size -= 2; gap -= 0.04;
  }
  const out = 1 - ease(f, n - 40, 26), dark = 1 - ease(f, n - 22, 22);
  const lit = ease(f, 0, 26) * dark;
  const t0 = Math.min(78, n * 0.26), iv = raw.length ? Math.max(24, Math.min(80, (n * 0.62 - t0) / raw.length)) : 0;   // one line after another
  const FX = W / 2, FY = 318, DS = 1.15, flame: V2 = [FX, FY + 30 * DS - 66];
  const bg = mood === "dawn" ? ["#1A1C30", "#0E0F1E"] : mood === "dusk" ? ["#24142A", "#120A1C"] : mood === "gold" ? ["#2A1A22", "#140C16"] : ["#1E1426", "#0D0A1C"];
  // with no credits the card sits lower, centred; with many, it rises so the last line stays clear of the captions
  const rowsN = wrapped.reduce((a2, w) => a2 + w.length, 0), lastY = 744 + (rowsN - 1) * size * gap + Math.max(0, raw.length - 1) * size * 0.35;
  const oy = raw.length ? -Math.min(150, Math.max(0, lastY - 892)) : 60;
  let row = 0;
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.03)} cx={FX} cy={430}>
      <HallDefs/>
      <defs>
        <radialGradient id={`${id}bg`} gradientUnits="userSpaceOnUse" cx={FX} cy={FY} r={1250}><stop offset="0" stopColor={bg[0]}/><stop offset="0.45" stopColor={bg[1]}/><stop offset="1" stopColor={K.night}/></radialGradient>
        <radialGradient id={`${id}gr`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#E8904A" stopOpacity={0.38}/><stop offset="0.4" stopColor="#8E3D52" stopOpacity={0.12}/><stop offset="1" stopColor="#4A2B5C" stopOpacity={0}/></radialGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id}bg)`}/>
      <g transform={`translate(0 ${oy})`}>
      {/* the dark ground the lamp stands on, warm where its light falls */}
      <ellipse cx={FX} cy={FY + 84} rx={640} ry={96} fill={`url(#${id}gr)`} opacity={lit}/>
      <Mandala cx={FX} cy={flame[1] + 10} R={238} rot={f * 0.03} op={0.055 * lit}/>
      <Glow x={flame[0]} y={flame[1]} rx={760} ry={640} g="hl-air" o={1.2 * lit}/>
      <Glow x={flame[0]} y={flame[1]} rx={300} g="hl-warm" o={0.75 * lit * (0.95 + 0.05 * wob(f / 6, 2))}/>
      <Dust f={f} sun={flame} n={46} y0={140} y1={620}/>
      <Glow x={FX} y={FY + 128} rx={46} ry={70} g="hl-soft" o={0.3 * lit}/>
      <EndDiya x={FX} y={FY} s={DS} f={f} lit={lit}/>
      <g opacity={out}>
        <g opacity={ease(f, 18, 36)} transform={`translate(0 ${(1 - ease(f, 18, 36)) * 8})`}>
          <text x={FX} y={566} textAnchor="middle" fontFamily={EN} fontWeight={500} fontSize={104} letterSpacing={1} fill="none" stroke={K.gold} strokeWidth={14} opacity={0.05}>{title}</text>
          <text x={FX} y={566} textAnchor="middle" fontFamily={EN} fontWeight={500} fontSize={104} letterSpacing={1} fill="none" stroke={K.gold} strokeWidth={5} opacity={0.08}>{title}</text>
          <text x={FX} y={566} textAnchor="middle" fontFamily={EN} fontWeight={500} fontSize={104} letterSpacing={1} fill={K.cream}>{title}</text>
        </g>
        <text x={FX} y={626} textAnchor="middle" fontFamily={EN} fontStyle="italic" fontWeight={500} fontSize={40} fill="#D9B26A" opacity={ease(f, 34, 36)}>{sub}</text>
        <Rule y={680} w={480 * (0.3 + 0.7 * ease(f, 44, 40))} op={ease(f, 44, 30)}/>
        {wrapped.map((ls, i) => {
          const a = ease(f, t0 + i * iv, 30), y0 = 744 + row * size * gap + i * size * 0.35;
          row += ls.length;
          return <g key={i} opacity={a} transform={`translate(0 ${(1 - a) * 6})`}>
            {ls.map((l, j) => <text key={j} x={FX} y={y0 + j * size * gap} textAnchor="middle" fontFamily={EN} fontWeight={500} fontSize={size} letterSpacing={0.6} fill={i === 0 ? "#CDB487" : "#A8936C"}>{l}</text>)}
          </g>;
        })}
      </g>
      </g>
    </Frame>
  );
};

export const SCENES: Record<string, React.FC<SceneP>> = {sanjaya: SanjayaHall, end: End};
