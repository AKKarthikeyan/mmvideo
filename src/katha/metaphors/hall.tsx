// Katha scenes: the hall (22 Oct 2026). The frame story of the Gita and the closing card.
//  "sanjaya": the blind king Dhritarashtra's hall in Hastinapura at night. Arcades of carved pillars and cusped arches
//    recede to a far arch; through it, the field of Kurukshetra as a lit diorama: two tiny armies with their banners
//    facing each other across the plain under the afterglow, dust rising between them, one chariot in the gap. A bronze
//    lamp hangs on its chains and lays a pool of light on the polished floor; the old king sits on his high throne (a
//    peacock-fan back, a sceptre with a round finial), crowned and bearded, a little bowed, very still; Sanjaya sits on a
//    low seat beside him, turbaned, and tells what the sage's gift lets him see. The camera is low and close: the seated
//    figures fill the frame; a carved pillar, out of focus, stands in the near foreground. The figures are rimmed warm
//    from the lamp and, on the same side, cool from the window (a key and a kicker; never both sides of a shape).
//    s.variant: "listen" (default) | "alone" (the king alone in the dark, the lamp low) | "dawn" (the end of the telling:
//    grey dawn through the arches, the lamp burned low). Optional hints the film data carries: s.lamp ("black; a flint
//    strike; ... catches", "low", "soft", "leaps", "stretches tall", "flares white", "back to an ordinary flame") and
//    s.detail ("grey of morning" picks dawn, "shields his eyes", "head lifts" / "turns his head" / "toward the voice",
//    "shadow" (two armies of shadow on the far wall that part), "marigold" / "petal" (a petal in the pool of light)).
//    s.mood tints the sky through the arch.
//  "end": the closing card: one diya (the kit's, petal-moulded rim, turned foot) burning on a dark ground in its halo, a
//    faint heat shimmer above the flame; the Devanagari title first (s.sa; for the Bhagavad Gita it is derived from the
//    title), then s.title, s.subtitle, a gold rule and the credit lines s.lines (24 px and up; two columns if many),
//    fading in one by one. The words sit in Frame's overlay, so the slow push never scales them.
// Lamplight: near-black silhouettes, a thin warm rim on the side facing the light, light the only colour. Every glow, haze
// and beam is a radial or linear gradient (no blur or turbulence filters: long software renders dropped tiles under them).
// Every flame is the kit's Flame / Diya (fire.tsx).
import React, {useId} from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {K, W, H, EN, SA, SoftGlow} from "../look";
import {SceneP, Frame, push} from "../stage";
import {Dust} from "../sky";
import {Flame, Diya, diyaWick} from "../fire";
import {pillar as kitPillar, ledge} from "../arch";
import {Rimmed} from "../sil";
import {armyPath} from "../field";
import {smooth, ribbon, rnd, lerp, clamp01, sampleCubics, band, Pt} from "../geom";
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
    <linearGradient id="hl-smoke" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#E8C8A0" stopOpacity={0.5}/><stop offset="0.4" stopColor="#A08890" stopOpacity={0.22}/><stop offset="1" stopColor="#6A6080" stopOpacity={0}/></linearGradient>
    <linearGradient id="hl-down" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#030108" stopOpacity={0}/><stop offset="1" stopColor="#030108" stopOpacity={0.7}/></linearGradient>
  </defs>
);
const Glow: React.FC<{x: number; y: number; rx: number; ry?: number; g?: string; o?: number}> = ({x, y, rx, ry, g = "hl-warm", o = 1}) =>
  o <= 0.002 || rx <= 0 ? null : <ellipse cx={x} cy={y} rx={rx} ry={ry ?? rx} fill={`url(#${g})`} opacity={Math.min(1, o)}/>;

// ---------- the hall: one-point perspective, every arcade the same shape at its own depth ----------
// The world is drawn with the eye at y = 0 and the floor at YF; CAM lowers the camera (the eye sits CAM nearer the floor),
// so the seated heads rise above the horizon and the hall looms over them (the art director: lower the camera).
const VPX = 960, VPY = 540, CAM = 80;                // the vanishing point; the eye is 250 above the floor
const proj = (k: number) => `translate(${VPX} ${VPY}) scale(${k}) translate(0 ${-CAM})`;
const toScreen = (X: number, Y: number, k: number): V2 => [VPX + X * k, VPY + (Y - CAM) * k];
const HW = 820, A = 80, YF = 330, YS = -570, YA = -900, YT = -2600, WO = 1600;   // world units: a person is ~400 tall
// A round arch (the multifoil torana arch, not a pointed Mughal one): from the springing (-hw, ys) up to the crown (0, ya)
// and down to (hw, ys).
const archLine = (hw: number, ys: number, ya: number, m = 200, pk = 0): V2[] => {
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
const SPANDREL = smooth([...cusped(HW, YS, YA, 11, 54), [WO, YS, "c"], [WO, YT, "c"], [-WO, YT, "c"], [-WO, YS, "c"]]);
const PORTAL_D = [SPANDREL, pillar(-PXC), pillar(PXC)];
// The other arcade carries the kit's carved pillar (lotus base, square-to-octagonal shaft, pot-and-foliage, cushion and a
// bracket capital whose rolled corbels reach in under the arch), so the arcades are not one shape repeated.
const KIT_P = [-1, 1].map((sd) => kitPillar({x: sd * PXC, y: YF, h: -YS + YF, w: 1.32 * A}));
const PORTAL_K = [SPANDREL, ...KIT_P.map((p) => (p[0] as {d: string}).d)];
const RELIEF_K = KIT_P.map((p) => (p[1] as {d: string}).d).join(" ");
const ARCHIVOLT = (o: number) => `M ${archLine(HW + o, YS, YA - o * 1.05, 80).map((p) => `${n1(p[0])} ${n1(p[1])}`).join(" L ")}`;
const CARVE = (() => {
  const d: string[] = [];
  for (const sd of [-1, 1]) {
    const xc = sd * PXC;
    for (const fx of [-0.3, 0, 0.3]) d.push(`M ${n1(xc + fx * A)} ${YF - 196} L ${n1(xc + fx * A)} ${YF - 368} M ${n1(xc + fx * A)} ${YF - 416} L ${n1(xc + fx * A)} ${YF - 568} M ${n1(xc + fx * A)} ${YF - 598} L ${n1(xc + fx * A)} ${YF - 732}`);
    for (const h of [90, 172, 192, 572, 594, 738, 748, 852]) d.push(`M ${n1(xc - 1.3 * A)} ${YF - h} L ${n1(xc + 1.3 * A)} ${YF - h}`);
  }
  return d.join(" ");
})();
// the frame round the arch and the cornice (both arcades)
const CARVE_A = `M ${-HW - 150} ${YS} L ${-HW - 150} ${YA - 170} L ${HW + 150} ${YA - 170} L ${HW + 150} ${YS} M ${-WO} ${YA - 250} L ${WO} ${YA - 250} M ${-WO} ${YA - 290} L ${WO} ${YA - 290}`;
const ROSETTES = [-1, 1].map((sd) => {
  const cx = sd * HW * 0.66, cy = YA - 40, r = 44;
  return `M ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} Z ` + Array.from({length: 8}, (_, i) => {
    const a = (i / 8) * Math.PI * 2, px = cx + Math.cos(a) * r * 0.55, py = cy + Math.sin(a) * r * 0.55;
    return `M ${n1(px + 9)} ${n1(py)} A 9 9 0 1 0 ${n1(px - 9)} ${n1(py)} A 9 9 0 1 0 ${n1(px + 9)} ${n1(py)} Z`;
  }).join(" ");
}).join(" ");
// One arcade at depth k (k = 1 is the nearest): both pillars and the cusped arch as one rim-lit silhouette.
const Portal: React.FC<{k: number; L: V2; body: string; warm: string; rim: string; eps: number; carve: number; rimOp?: number; kit?: boolean}> = ({k, L, body, warm, rim, eps, carve, rimOp = 0.9, kit = false}) => {
  const id = uid(), Lw: V2 = [(L[0] - VPX) / k, (L[1] - VPY) / k + CAM];
  return (
    <g>
      <defs>
        <radialGradient id={`${id}f`} gradientUnits="userSpaceOnUse" cx={Lw[0]} cy={Lw[1]} r={1500}><stop offset="0" stopColor={warm}/><stop offset="0.55" stopColor={body}/><stop offset="1" stopColor={body}/></radialGradient>
        <radialGradient id={`${id}c`} gradientUnits="userSpaceOnUse" cx={Lw[0]} cy={Lw[1]} r={1300}><stop offset="0" stopColor={rim} stopOpacity={0.5}/><stop offset="0.6" stopColor={rim} stopOpacity={0.1}/><stop offset="1" stopColor={rim} stopOpacity={0}/></radialGradient>
        <radialGradient id={`${id}r`} gradientUnits="userSpaceOnUse" cx={Lw[0]} cy={Lw[1]} r={1150 / Math.sqrt(k)}><stop offset="0" stopColor={rim} stopOpacity={rimOp}/><stop offset="0.45" stopColor={rim} stopOpacity={rimOp * 0.55}/><stop offset="1" stopColor={rim} stopOpacity={rimOp * 0.08}/></radialGradient>
      </defs>
      <Lit items={(kit ? PORTAL_K : PORTAL_D).map((d) => ({d, t: proj(k)}))} layers={[{c: `url(#${id}r)`}, {c: `url(#${id}f)`, t: about(L, 1 + eps)}]}>
        <g transform={proj(k)} opacity={carve}>
          {kit ? <><path d={RELIEF_K} fill="#030108" opacity={0.45} transform="translate(0 4)"/><path d={RELIEF_K} fill={`url(#${id}c)`} opacity={0.8}/></>
            : <><path d={CARVE} fill="none" stroke={`url(#${id}c)`} strokeWidth={3}/><path d={CARVE} fill="none" stroke="#030108" strokeWidth={5} opacity={0.5} transform="translate(0 5)"/></>}
          <path d={CARVE_A} fill="none" stroke={`url(#${id}c)`} strokeWidth={3}/>
          <path d={CARVE_A} fill="none" stroke="#030108" strokeWidth={5} opacity={0.5} transform="translate(0 5)"/>
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
// The view through the far arch, by mood: the field of Kurukshetra as a lit diorama. sky: stops from the arch's crown to
// the horizon; glow: the afterglow and the lit dust over the plain [core, outer]; rows: the armies' tints, far to near
// (aerial perspective: the far rows pale into the glow); rim: the light on the nearer rows' tops; dust; fires (night);
// win: the window's light on the figures (the cool kicker beside the lamp's warm key).
type FarP = {sky: [number, string][]; glow: [string, string]; rows: string[]; rim: string; land: [string, string]; dust: string; fires: number; stars: number; win: string};
const FAR: Record<string, FarP> = {
  night: {sky: [[0, "#0A0920"], [0.38, "#191640"], [0.62, "#3A2452"], [0.8, "#7A3A4C"], [0.91, "#D2703E"], [1, "#FFC877"]], glow: ["#FFE2A0", "#F08A3A"],
    rows: ["#B0645A", "#7E3E52", "#4A2242", "#22102A"], rim: "#FFC277", land: ["#8A4A44", "#1C0E1E"], dust: "#E8A060", fires: 1, stars: 1, win: "#A3A6DC"},
  dusk: {sky: [[0, "#120F2A"], [0.4, "#2E2350"], [0.64, "#6A2F55"], [0.82, "#C2553A"], [0.93, "#F0A04B"], [1, "#FFD27A"]], glow: ["#FFF0C0", "#F59A45"],
    rows: ["#C0705A", "#8A4452", "#522646", "#26122C"], rim: "#FFD08A", land: ["#9A5246", "#20101F"], dust: "#F0B070", fires: 0.6, stars: 0.5, win: "#AEA8D8"},
  gold: {sky: [[0, "#2A1A3E"], [0.4, "#6B3A55"], [0.7, "#C26A45"], [0.9, "#F2A855"], [1, "#FFE0A0"]], glow: ["#FFF6D8", "#F5A945"],
    rows: ["#D08A60", "#9A5450", "#5A2C44", "#2A142C"], rim: "#FFE0A0", land: ["#B06A4A", "#24121F"], dust: "#F8C890", fires: 0.3, stars: 0, win: "#B8B0D8"},
  dawn: {sky: [[0, "#28304E"], [0.42, "#4E5576"], [0.7, "#8A86A2"], [0.88, "#D6B0A0"], [1, "#F4D6B4"]], glow: ["#FFF2DC", "#E8B49A"],
    rows: ["#9C8A9C", "#6E6080", "#45384E", "#211A2A"], rim: "#F2DCC8", land: ["#8A7A88", "#1A1624"], dust: "#D8C8C0", fires: 0, stars: 0, win: "#C6CAE4"},
};
// One row of an army (field.tsx's banners, spears, elephants and parasols) with its footing, lit on top from the glow
// behind it: the row is drawn in the rim colour, then in its own tint 1 px lower, so only the upper edges catch light.
const ArmyRow: React.FC<{y: number; s: number; x0: number; x1: number; seed: number; c: string; rim: string; rimO: number; f: number}> = ({y, s, x0, x1, seed, c, rim, rimO, f}) => {
  // the footing: a thin strip of the host's shadow on the plain, tapering at both ends (no mound, no square ends)
  const count = Math.max(6, Math.round((x1 - x0) / (5.2 * s))), d = armyPath(y, s, count, seed, x0, x1, f / 18);
  const tp = Math.min(40, (x1 - x0) * 0.25), th = 2.2 + 4 * s;
  const base = smooth([[x0, y + th, "c"], [x0 + tp * 0.5, y + th * 0.3], [x0 + tp, y - 0.6], [x1 - tp, y - 0.6], [x1 - tp * 0.5, y + th * 0.3], [x1, y + th, "c"]], {wind: "cw"});
  return (
    <g>
      {rimO > 0 ? <path d={`${d} ${base}`} fill={rim} opacity={rimO} transform="translate(0 -1)"/> : null}
      <path d={`${d} ${base}`} fill={c} stroke={c} strokeWidth={0.5 * s}/>
    </g>
  );
};
// The chariot between the two armies (Gita 1.21), tiny: a box on one wheel, a flag on its staff, a team of four.
const tinyChariot = (x: number, y: number, s: number, f: number): string => {
  const P = (pts: number[][]) => `M ${pts.map((p) => `${n1(x + p[0] * s)} ${n1(y + p[1] * s)}`).join(" L ")} Z`;
  const wv = Math.sin(f / 9) * 0.8;
  let d = P([[-9, -4], [3, -4], [5, -8], [6, -4], [12, -3], [12, -2], [-9, -2]]);                 // the car and its pole
  d += P([[-6, -4], [-6, -14], [-5.2, -14], [-5.2, -4]]) + P([[-5.2, -14], [1, -12.6 + wv], [-5.2, -11]]);   // flagstaff, pennant
  d += `M ${n1(x - 3 * s)} ${n1(y)} m ${n1(-3 * s)} 0 a ${n1(3 * s)} ${n1(3 * s)} 0 1 0 ${n1(6 * s)} 0 a ${n1(3 * s)} ${n1(3 * s)} 0 1 0 ${n1(-6 * s)} 0 Z`;
  for (let i = 0; i < 2; i++) {                                                                   // the horses, two abreast in profile
    const hx = 13 + i * 2.2, k = Math.sin(f / 4 + i) * 0.6;
    d += P([[hx, -4], [hx + 7, -4.5], [hx + 9, -7], [hx + 10.5, -6.2], [hx + 9, -3.4], [hx + 8, 0 + k], [hx + 7, 0 + k], [hx + 6.6, -2.6], [hx + 1.6, -2.6], [hx + 1.2, 0 - k], [hx + 0.2, 0 - k], [hx, -2.4]]);
  }
  return d;
};
const FarView: React.FC<{f: number; mood: string; glow: number}> = ({f, mood, glow}) => {
  const id = uid(), P = FAR[mood] || FAR.night;
  const [x0, y0] = toScreen(-FHW, FYA, KF), [x1, y1] = toScreen(FHW, YF, KF), hz = VPY, cx = VPX;
  const pulse = glow * (0.9 + 0.07 * Math.sin(f / 37) + 0.04 * wob(f / 11, 2));
  const dawn = mood === "dawn";
  // the rows, far to near: their line, scale, and the half-width of the plain left open between the two hosts
  const ROWS: [number, number, number][] = [[hz + 1.5, 0.16, 14], [hz + 7, 0.24, 28], [hz + 17, 0.34, 46], [hz + 33, 0.46, 72]];
  return (
    <g>
      <defs>
        <clipPath id={`${id}k`}><path d={FAR_OPEN} transform={proj(KF)}/></clipPath>
        <linearGradient id={`${id}s`} gradientUnits="userSpaceOnUse" x1={0} y1={y0} x2={0} y2={hz + 2}>{P.sky.map(([o, c], i) => <stop key={i} offset={o} stopColor={c}/>)}</linearGradient>
        <linearGradient id={`${id}l`} gradientUnits="userSpaceOnUse" x1={0} y1={hz} x2={0} y2={y1}><stop offset="0" stopColor={P.land[0]}/><stop offset="0.35" stopColor={mix(P.land[0], P.land[1], 0.6)}/><stop offset="1" stopColor={P.land[1]}/></linearGradient>
        <radialGradient id={`${id}g`}><stop offset="0" stopColor={P.glow[0]} stopOpacity={0.95}/><stop offset="0.25" stopColor={P.glow[0]} stopOpacity={0.55}/><stop offset="0.6" stopColor={P.glow[1]} stopOpacity={0.2}/><stop offset="1" stopColor={P.glow[1]} stopOpacity={0}/></radialGradient>
        <radialGradient id={`${id}m`} cx="0.5" cy="0.6" r="0.5"><stop offset="0" stopColor={P.dust} stopOpacity={0.75}/><stop offset="0.55" stopColor={P.dust} stopOpacity={0.3}/><stop offset="1" stopColor={P.dust} stopOpacity={0}/></radialGradient>
        <linearGradient id={`${id}h`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={P.dust} stopOpacity={0}/><stop offset="0.5" stopColor={P.dust} stopOpacity={0.5}/><stop offset="1" stopColor={P.dust} stopOpacity={0}/></linearGradient>
      </defs>
      <g clipPath={`url(#${id}k)`}>
        <rect x={x0 - 20} y={y0 - 20} width={x1 - x0 + 40} height={hz - y0 + 24} fill={`url(#${id}s)`}/>
        {P.stars > 0 ? Array.from({length: 24}, (_, i) => {
          const x = x0 + rnd(i, 41) * (x1 - x0), y = y0 + rnd(i, 42) * (hz - y0) * 0.5, tw = 0.6 + 0.4 * Math.sin(f / (8 + rnd(i, 43) * 9) + i);
          return <circle key={i} cx={x} cy={y} r={0.5 + rnd(i, 44) * 1.0} fill="#FFF0D6" opacity={P.stars * (0.25 + 0.5 * rnd(i, 45)) * tw * (1 - (y - y0) / (hz - y0))}/>;
        }) : null}
        {/* two long lit cloud streaks, the afterglow catching their undersides */}
        {[[hz - 92, 150, 0.32, -40], [hz - 52, 190, 0.45, 50]].map(([y, rx, o, dx], i) => <ellipse key={i} cx={cx + dx + Math.sin(f / 200 + i) * 6} cy={y} rx={rx} ry={5 + i * 2} fill={`url(#${id}g)`} opacity={o * pulse}/>)}
        {/* the afterglow and the dust of the field, lit: the brightest thing in the shot after the lamp */}
        <ellipse cx={cx} cy={hz - 2} rx={290} ry={120} fill={`url(#${id}g)`} opacity={0.75 * pulse}/>
        <ellipse cx={cx} cy={hz} rx={150} ry={26} fill={`url(#${id}g)`} opacity={pulse}/>
        {/* the plain */}
        <rect x={x0 - 20} y={hz} width={x1 - x0 + 40} height={y1 - hz + 20} fill={`url(#${id}l)`}/>
        <ellipse cx={cx} cy={hz + 4} rx={40} ry={(y1 - hz) * 1.1} fill={`url(#${id}g)`} opacity={0.35 * pulse}/>
        {/* dust raised by the chariots, rising between the hosts in slow soft columns, lit from the glow */}
        {[[-0.34, 0], [-0.12, 1], [0.1, 2], [0.3, 3]].map(([u, i]) => {
          const bx = cx + u * (x1 - x0) * 0.5;
          return <g key={i}>{Array.from({length: 6}, (_, j) => {
            const v = ((j + f / 110 + rnd(i, 46)) % 6) / 6, x = bx + 26 * v * v + Math.sin(f / 60 + i + v * 3) * 4, y = hz + 14 - v * (70 + 26 * rnd(i, 47));
            const r = 10 + 32 * v, o = Math.sin(Math.PI * Math.min(1, v * 1.1)) * (dawn ? 0.22 : 0.42);
            return <ellipse key={j} cx={x} cy={y} rx={r} ry={r * 0.6} fill={`url(#${id}m)`} opacity={o}/>;
          })}</g>;
        })}
        {/* the two hosts, row behind row, the plain open between them; haze lies between the rows */}
        {ROWS.map(([y, sc, gap], i) => <g key={i}>
          <ArmyRow y={y} s={sc} x0={x0 - 10} x1={cx - gap} seed={40 + i * 10} c={P.rows[i]} rim={P.rim} rimO={i ? 0.5 + 0.12 * i : 0} f={f + i * 30}/>
          <ArmyRow y={y} s={sc} x0={cx + gap} x1={x1 + 10} seed={45 + i * 10} c={P.rows[i]} rim={P.rim} rimO={i ? 0.5 + 0.12 * i : 0} f={f + i * 30 + 15}/>
          {i < 3 ? <rect x={x0 - 20} y={y + 2} width={x1 - x0 + 40} height={8 + i * 5} fill={`url(#${id}h)`} opacity={(dawn ? 0.5 : 0.4) * pulse}/> : null}
          {i === 2 ? <path d={tinyChariot(cx + 6 + Math.sin(f / 90) * 3, hz + 27, 1.0, f)} fill={P.rows[3]}/> : null}
        </g>)}
        {/* the watch-fires along the hosts: points that breathe */}
        {P.fires > 0 ? Array.from({length: 18}, (_, i) => {
          const row = ROWS[1 + (i % 3)], side = i % 2 ? 1 : -1, x = cx + side * (row[2] + 6 + rnd(i, 51) * (x1 - cx - row[2] - 10)), y = row[0] + 1 + rnd(i, 52) * 3, b = 0.5 + 0.5 * Math.sin(f / (5 + rnd(i, 53) * 7) + i * 2.1);
          return <circle key={i} cx={x} cy={y} r={0.7 + rnd(i, 54) * 1.1} fill="#FFD9A0" opacity={P.fires * (0.4 + 0.5 * b)}/>;
        }) : null}
        {/* motes of the field's dust in the glow */}
        {Array.from({length: 22}, (_, i) => {
          const v = ((rnd(i, 61) + f / (260 + rnd(i, 62) * 200)) % 1), x = cx + (rnd(i, 63) - 0.5) * 300 + Math.sin(f / 40 + i) * 6, y = hz + 20 - v * 130;
          return <circle key={i} cx={x} cy={y} r={0.6 + rnd(i, 64) * 0.9} fill={P.glow[0]} opacity={0.5 * Math.sin(Math.PI * v) * pulse}/>;
        })}
      </g>
    </g>
  );
};

// ---------- the figures (faceless silhouettes, faces toward the right; Sanjaya is drawn flipped) ----------
// The profile head of figures.ts (facing right); its jaw meets the neck near (0, -340).
const HEAD: Pt[] = [[-6, -402], [10, -400], [20, -392], [23, -381], [22, -373], [28, -364, "c"], [23, -360], [24, -355], [22, -351], [23, -347], [18, -341], [8, -337], [-4, -341], [-16, -350], [-24, -364], [-26, -380], [-20, -394]];
// The throne's back: a post and a fan of n feathers spread over 240 degrees round (cx, cy), radius R. Returns the
// outline (clockwise) with the feathers' eyes cut as holes (counter-clockwise), and a ring of beads at the fan's root.
const peacockBack = (cx: number, cy: number, R: number, n = 11): string[] => {
  const pts: Pt[] = [], a0 = (150 * Math.PI) / 180, span = (240 * Math.PI) / 180, da = span / n;
  const at = (a: number, r: number, c = false): Pt => (c ? [cx + Math.cos(a) * r, cy + Math.sin(a) * r, "c"] : [cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  for (let j = 0; j < n; j++) {
    const a = a0 + j * da;
    pts.push(at(a, R * 0.9, true), at(a + da * 0.22, R * 0.99), at(a + da * 0.5, R * 1.05), at(a + da * 0.78, R * 0.99));
  }
  pts.push(at(a0 + span, R * 0.9, true));
  // down the fan's right flank to the post, down the post, across, up and out to the fan's left flank
  pts.push([cx + R * 0.62, cy + R * 0.58], [-134, -292], [-134, -200, "c"], [-166, -200, "c"], [-166, -292], [cx - R * 0.66, cy + R * 0.56]);
  const outline = smooth(pts, {wind: "cw"});
  const eyes = Array.from({length: n}, (_, j) => {
    const a = a0 + (j + 0.5) * da, ex = cx + Math.cos(a) * R * 0.8, ey = cy + Math.sin(a) * R * 0.8, rx = 5.2, ry = 7;
    // an upright ellipse turned along the feather, wound counter-clockwise (a hole)
    const e: Pt[] = Array.from({length: 10}, (_, i) => { const t = -(i / 10) * Math.PI * 2, u = Math.cos(t) * ry, v = Math.sin(t) * rx; return [ex + Math.cos(a) * u - Math.sin(a) * v, ey + Math.sin(a) * u + Math.cos(a) * v]; });
    return smooth(e, {wind: "ccw"});
  }).join(" ");
  // the root of the fan: a lotus boss where the feathers spring from the post
  const boss = smooth([[cx - 22, cy + 30], [cx - 12, cy + 14], [cx, cy + 8], [cx + 12, cy + 14], [cx + 22, cy + 30], [cx + 10, cy + 40], [cx - 10, cy + 40]], {wind: "cw"});
  return [`${outline} ${eyes}`, boss];
};
// Dhritarashtra on his throne. Local units (a standing person ~400), origin on the floor under the front of the seat.
// The throne is a solid moulded pedestal; his knees reach past its front so his shins hang clear of it.
const THRONE: string[] = [
  poly([[-260, 0], [190, 0], [190, -20], [172, -20], [172, -40], [154, -40], [154, -60], [-236, -60], [-236, -40], [-248, -40], [-248, -20], [-260, -20]]),   // the dais, three steps
  smooth([[0, -60, "c"], [86, -60, "c"], [90, -70], [86, -88, "c"], [4, -88, "c"], [-2, -72]]),                                                            // footstool
  poly([[-196, -60], [-22, -60], [-22, -72], [-30, -76], [-30, -84], [-36, -88], [-36, -160], [-30, -164], [-30, -172], [-20, -176], [-20, -192], [-190, -192], [-190, -176], [-180, -172], [-180, -164], [-174, -160], [-174, -88], [-180, -84], [-180, -76], [-196, -72]]),   // the pedestal
  smooth([[-194, -190], [-190, -203], [-170, -209], [-34, -209], [-20, -203], [-18, -192], [-26, -186], [-184, -186]]),                                      // cushion
  // the back: a post rising behind him into a round peacock fan (mayurasana), its feathers scalloped, their eyes pierced
  // so the light shows through; it stays clear of his head, low and broad, so it never answers the crown's spike
  ...peacockBack(-196, -352, 88),
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
// His sceptre (danda): a plain shaft, a lotus cup, and a round finial (an orb with a bead), not a spear point.
const STAFF: string[] = [
  ribbon([[104, -60], [97, -250], [91, -396]], 8, 7),
  smooth([[78, -394, "c"], [104, -394, "c"], [101, -402], [106, -410, "c"], [96, -408], [91, -414, "c"], [86, -408], [76, -410, "c"], [81, -402]]),
  pearls([[91, -428]], 15), pearls([[91, -447]], 4.5),
];
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
// wick: each wick's brightness (0 = not yet lit); strike: 0..1 through the flint's spark burst (0 = none); calm: the kit
// flame's stillness (a windless hall; lower when the flame leaps).
const HangingLamp: React.FC<{px: number; py: number; len: number; ang: number; s: number; f: number; b: number; size: number; white: number; rim: string; wick?: number[]; strike?: number; calm?: number}> =
  ({px, py, len, ang, s, f, b, size, white, rim, wick, strike = 0, calm = 0.85}) => {
  const tr = `translate(${px} ${py}) rotate(${ang.toFixed(3)}) translate(0 ${len}) scale(${s})`;
  const top = -len / s;
  const links = Array.from({length: Math.max(0, Math.ceil((-top - 200) / 15))}, (_, i) => -206 - i * 15);
  const metal = "#1A0F16", lamp: V2 = [0, -30];
  const wb = (i: number) => b * (wick ? wick[i] : 1);
  return (
    <g transform={tr}>
      {/* the chain: alternate links face us and turn edge-on; lit from below */}
      {links.map((y, i) => (i % 2 ? <rect key={i} x={-1.6} y={y - 8} width={3.2} height={16} rx={1.6} fill="#2A1C1E"/> : <ellipse key={i} cx={0} cy={y} rx={4.2} ry={8.5} fill="none" stroke="#3A2620" strokeWidth={2.4}/>))}
      <path d={links.map((y) => `M 1.5 ${y - 6} L 1.5 ${y + 6}`).join(" ")} stroke={rim} strokeWidth={1} opacity={0.35 * b}/>
      {[-80, 0, 80].map((x, i) => <path key={i} d={`M 0 -150 L ${x} -6`} stroke={i === 1 ? "#24181A" : "#3A2620"} strokeWidth={2.6} strokeDasharray="5 3"/>)}
      {[-80, 80].map((x, i) => <path key={i} d={`M 0 -150 L ${x} -6`} stroke={rim} strokeWidth={1} opacity={0.3 * b} transform="translate(0 1.5)"/>)}
      <Lit items={[{d: HAMSA}, {d: `M -10 -146 L 10 -146 L 6 -138 L -6 -138 Z`}]} layers={[{c: mix(metal, rim, Math.min(1, 0.15 + 0.85 * b))}, {c: metal, t: "translate(0 -2.5)"}]}/>
      <Lit items={[{d: LAMP_BOWL}, ...LAMP_SPOUTS.map((d) => ({d})), {d: LAMP_LIP}, {d: LAMP_DROP}]} layers={[{c: mix(metal, rim, Math.min(1, 0.25 + 0.75 * b))}, {c: metal, t: "translate(0 3)"}]}>
        <ellipse cx={0} cy={-4} rx={110} ry={22} fill="url(#hl-soft)" opacity={0.55 * b}/>
        <path d="M -88 12 Q 0 34 88 12" fill="none" stroke={rim} strokeWidth={1.4} opacity={0.3 * b}/>
        <path d="M -70 28 Q 0 46 70 28" fill="none" stroke={rim} strokeWidth={1} opacity={0.18 * b}/>
      </Lit>
      {/* the five flames: the kit's one flame model (white core, blue root, translucent licks); the lamp's shared glow
          is drawn below, so each flame's own halo is off */}
      {LAMP_FLAMES.map(([x, y, k], i) => <Flame key={i} x={x} y={y} h={34 * k * size * (0.45 + 0.55 * Math.min(1, wick ? wick[i] : 1))} f={f} seed={i * 2.3 + 1} calm={calm} b={Math.min(1.4, wb(i))} halo={0}/>)}
      {white > 0.01 ? LAMP_FLAMES.map(([x, y, k], i) => <SoftGlow key={"w" + i} x={x} y={y - 15 * k * size} r={46 * k * size} c0="#FFFFFF" c1="#FFF0C8" peak={0.85} k={1.6} o={white}/>) : null}
      {/* the flint's sparks over the middle wick */}
      {strike > 0 && strike < 1 ? Array.from({length: 9}, (_, i) => {
        const a = -Math.PI / 2 + (rnd(i, 71) - 0.5) * 2.4, sp = 40 + rnd(i, 72) * 60, u = strike, x = Math.cos(a) * sp * u, y = -14 + Math.sin(a) * sp * u + 50 * u * u;
        return <circle key={i} cx={x} cy={y} r={1.6 + rnd(i, 73) * 1.6} fill="#FFE6B0" opacity={(1 - u) * 0.95}/>;
      }) : null}
      {strike > 0 && strike < 1 ? <SoftGlow x={0} y={-14} r={70} c0="#FFF6DE" c1="#FFC877" peak={0.9} o={1 - strike}/> : null}
      {/* a thread of smoke from the middle flame, rising and loosening */}
      {[0, 1].map((j) => { const pts: number[][] = [];
        for (let i = 0; i <= 16; i++) { const u = i / 16; pts.push([Math.sin(f / 37 + u * 4.2 + j * 2) * (3 + 22 * u) + Math.sin(f / 23 + u * 7 + j) * 4 * u + j * 6, -11 - 36 * size - u * 150]); }
        return <path key={j} d={ribbon(pts, 2.4, 9, 0.7)} fill="url(#hl-smoke)" opacity={(j ? 0.5 : 0.8) * Math.min(1, wb(2))}/>; })}
      <Glow x={lamp[0]} y={lamp[1]} rx={190 * Math.sqrt(size)} ry={110 * Math.sqrt(size)} g="hl-soft" o={0.7 * b}/>
      <Glow x={lamp[0]} y={lamp[1] - 6} rx={150} ry={34} g="hl-hot" o={(0.18 + 0.4 * white) * b}/>
    </g>
  );
};
// What the film's s.lamp line asks of the flame, over the beat. b: the light it gives the hall; size: the flames' height;
// white: the flare toward white; wick: each wick's brightness; strike: the flint's spark (0..1); calm: the flame's stillness.
const lampState = (txt: string, f: number, n: number, variant: string) => {
  let b = 1, size = 1, white = 0, strike = 0, calm = 0.85;
  let wick = [1, 1, 1, 1, 1];
  if (variant === "dawn" || /\blow\b/.test(txt)) { b = 0.55; size = 0.6; }
  else if (variant === "alone") { b = 0.55; size = 0.62; }
  if (/soft/.test(txt)) { b *= 0.85; size *= 0.9; }
  if (/leap/.test(txt)) { const u = ease(f, n * 0.3, 10) * (1 - ease(f, n * 0.3 + 30, n * 0.3)); size *= 1 + 0.75 * u; b *= 1 + 0.35 * u; calm = 0.85 - 0.6 * u; }
  if (/tall|stretch/.test(txt)) { const u = sstep((f - n * 0.12) / (n * 0.6)); size *= 1 + 0.9 * u; b *= 1 + 0.2 * u; }
  if (/white|flare/.test(txt)) { const u = sstep((f - n * 0.08) / (n * 0.35)); white = u; size *= 1 + 0.55 * u; b *= 1 + 0.6 * u; }
  if (/ordinary|back to/.test(txt)) { const u = 1 - sstep((f - n * 0.04) / (n * 0.5)); white = 0.85 * u; size *= 1 + 0.5 * u; b *= 1 + 0.5 * u; }
  // the hall in the dark; a flint strikes over the middle wick; it catches, and the flame runs to the others
  if (/black|flint|catch/.test(txt)) {
    const t0 = Math.max(24, n * 0.14);
    strike = f >= t0 && f < t0 + 16 ? (f - t0) / 16 : 0;
    const rank = [3, 1, 0, 2, 4];   // the middle wick first, then its neighbours, then the spouts
    wick = [0, 1, 2, 3, 4].map((i) => sstep((f - t0 - 4 - rank[i] * 9) / 26));
    b *= 0.06 + 0.94 * (wick.reduce((x, y) => x + y, 0) / 5);
  }
  return {b, size, white, wick, strike, calm};
};

// ---------- the foreground pillar: near the lens and out of focus ----------
// The kit's carved pillar, very close on the right (depth 1.6, standing on the hall's floor: its lotus base meets the
// bottom of the frame, its capital rises out of the top). Out of focus: its carving is lost, its edge is soft (the
// outline stroked in widening, fainter bands of the same dark: no blur filter), and the lamp lays a faint broad sheen
// down the face turned towards it rather than a crisp rim.
const KFG = 1.6, FPH = (YF - YS) * KFG, FPW = FPH * 0.13, FG_PILLAR = (kitPillar({x: 0, y: 0, h: FPH, w: FPW})[0] as {d: string}).d;
const ForePillar: React.FC<{x: number; y: number; s: number; warm: number}> = ({x, y, s, warm}) => {
  const id = uid(), dark = "#050208";
  return (
    <g transform={`translate(${n1(x)} ${n1(y)}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}f`} gradientUnits="userSpaceOnUse" x1={-FPW * 0.7} y1={0} x2={FPW * 0.7} y2={0}>
          <stop offset="0.08" stopColor={mix(dark, "#3E2420", warm)}/><stop offset="0.2" stopColor={mix(dark, "#22121A", warm)}/><stop offset="0.42" stopColor="#0B060D"/><stop offset="1" stopColor={dark}/>
        </linearGradient>
      </defs>
      {[[44, 0.05], [30, 0.08], [18, 0.12], [8, 0.2]].map(([w, o], i) => <path key={i} d={FG_PILLAR} fill="none" stroke={dark} strokeWidth={w} strokeLinejoin="round" opacity={o}/>)}
      <path d={FG_PILLAR} fill={`url(#${id}f)`}/>
    </g>
  );
};
// A marigold petal fallen on the floor, in the pool of lamplight (the film: "a leaf, a flower").
const Petal: React.FC<{x: number; y: number; s: number; o: number}> = ({x, y, s, o}) => {
  const d = smooth([[-9, 0, "c"], [-4, -4.4], [3, -5], [9, -2.4], [10.5, 0.6], [6, 3.6], [-2, 3.4]]);
  return (
    <g transform={`translate(${n1(x)} ${n1(y)}) rotate(-14) scale(${s})`} opacity={o}>
      <ellipse cx={1} cy={3.5} rx={13} ry={3} fill="url(#hl-shade)" opacity={0.8}/>
      <path d={d} fill="#E8892E"/>
      <path d={d} fill="#FFC86A" transform="translate(0.4 -1.1) scale(0.86)"/>
      <path d={d} fill="#F59A3A" transform="translate(0.6 0.2) scale(0.7)"/>
    </g>
  );
};

// ---------- the scene ----------
const KFIG = 0.95, FLOOR_Y = VPY + (YF - CAM) * KFIG;   // the figures' depth and their floor line (before the camera push)
const KING_X = VPX - 320 * KFIG, SANJ_X = VPX + 290 * KFIG;
// The framing: a push of about 20% (the art director: the figures were small) about a point high in the frame, so the
// low camera keeps the lamp and the far arch in the shot and the floor line lands near the bottom third.
const CAM_Y = 165, Z0 = 1.2;
const SanjayaHall: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const id = uid();
  const detail = String(s.detail || "").toLowerCase(), lampTxt = String(s.lamp || "").toLowerCase();
  const variant: string = ["listen", "alone", "dawn"].includes(s.variant) ? s.variant : /gr[ae]y|morning|dawn/.test(detail) || s.mood === "dawn" ? "dawn" : "listen";
  const dawn = variant === "dawn", alone = variant === "alone";
  const mood = dawn ? "dawn" : ["night", "dusk", "gold"].includes(s.mood) ? s.mood : "night";
  const FP = FAR[mood] || FAR.night;
  const {b, size, white, wick, strike, calm} = lampState(lampTxt, f, n, variant);
  // the lamp hangs from the ceiling far above and sways a hair on its chain
  const len = 410, sw = 0.45 * Math.sin(f / 46) + 0.15 * Math.sin(f / 19), pivot: V2 = [VPX, -150];
  const L: V2 = [pivot[0] + Math.sin((sw * Math.PI) / 180) * len, pivot[1] + Math.cos((sw * Math.PI) / 180) * len - 30 * 0.8];
  const F: V2 = [VPX, VPY - 20];                          // the far arch: the window light
  const lampB = b * (0.94 + 0.06 * wob(f / 6, 1));
  const lk = clamp01(lampB);
  // light colours: the lamp's warm key, the window's cool kicker
  const figBody = "#100A17";
  const key = mix(figBody, dawn ? mix(K.rim, "#9A8A88", 0.45) : alone ? mix(K.rim, "#9A6A50", 0.4) : K.rim, Math.min(1, 0.15 + lk * 1.05));
  const kick = mix(FP.win, figBody, dawn ? 0.05 : 0.12);
  const rimW = 1.4 + 1.6 * Math.min(1.4, lampB);
  // poses from the film's stage direction
  const lift = /lift|turns? his head|toward the voice/.test(detail) ? sstep((f - n * 0.2) / (n * 0.45)) : 0;
  const bow = lerp(alone ? 12 : 8, -4, lift);
  const shield = /shield/.test(detail) ? sstep((f - n * 0.08) / (n * 0.2)) : 0;
  const tell = dawn ? 0.5 : 1, a = tell * (7 * Math.sin(f / 23) + 4 * Math.sin(f / 9.7 + 1));
  const sLift = -4 + tell * 2.5 * Math.sin(f / 31);
  const kingT = `translate(${KING_X} ${FLOOR_Y}) scale(${KFIG})`, sanjT = `translate(${SANJ_X} ${FLOOR_Y}) scale(${-KFIG} ${KFIG})`;
  const kc: V2 = [KING_X - 20, FLOOR_Y - 260], sc: V2 = [SANJ_X - 10, FLOOR_Y - 150];
  // a key and a kicker on the same side of each figure: warm from the lamp above, cool from the far arch behind
  const figLayers = (c: V2) => {
    const w2 = dawn ? 2.2 : 2.0;
    return [{c: key}, {c: kick, t: away(L, c, rimW)}, {c: figBody, t: `${away(L, c, rimW)} ${away(F, c, w2)}`}];
  };
  const portalRim = dawn ? mix(K.rim, "#C8CCE0", 0.55) : alone ? mix(K.rim, "#C06040", 0.45) : K.rim;
  const air = lampB * (dawn ? 0.55 : alone ? 0.6 : 1);
  const warmWall = "#5A3226";
  const zoom = alone ? push(f, n, 1.26, 1.33) : push(f, n, Z0, dawn ? 1.24 : 1.25);
  const [ax0, ay0] = toScreen(-FHW, YF, KF), [ax1] = toScreen(FHW, YF, KF);
  // the shadow-theatre: two armies of shadow thrown on the far wall, one each side of the throne; they part on "divided"
  const shadows = /shadow/.test(detail);
  const part = sstep((f - n * 0.7) / (n * 0.22));
  const petal = /marigold|petal/.test(detail);
  const poolY = FLOOR_Y - 14;
  return (
    <Frame f={f} zoom={zoom} cx={alone ? KING_X + 40 : VPX} cy={alone ? 200 : CAM_Y}>
      <HallDefs/>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#090818"/><stop offset="1" stopColor="#05040C"/></linearGradient>
        <linearGradient id={`${id}fl`} gradientUnits="userSpaceOnUse" x1={0} y1={ay0} x2={0} y2={H}><stop offset="0" stopColor={dawn ? "#1C1A2C" : "#191228"}/><stop offset="0.4" stopColor="#0D0A1B"/><stop offset="1" stopColor="#05040C"/></linearGradient>
        <linearGradient id={`${id}sh`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D8DCEC" stopOpacity={0.14}/><stop offset="0.6" stopColor="#C8CCE0" stopOpacity={0.05}/><stop offset="1" stopColor="#C8CCE0" stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}jl`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={dawn ? "#B8BCD2" : "#1C2456"}/><stop offset="1" stopColor={dawn ? "#E2D2C4" : "#3A3A72"}/></linearGradient>
        <pattern id={`${id}jp`} patternUnits="userSpaceOnUse" width={30} height={30}>
          <path d={`M 0 0 L 30 0 L 30 30 L 0 30 Z ${smooth([[15, 4], [19, 11], [26, 15], [19, 19], [15, 26], [11, 19], [4, 15], [11, 11]])}`} fill="#100A1C" fillRule="evenodd"/>
        </pattern>
        <radialGradient id={`${id}pl`}><stop offset="0" stopColor="#FFE2A6" stopOpacity={0.8}/><stop offset="0.3" stopColor="#F5B060" stopOpacity={0.42}/><stop offset="0.65" stopColor="#C26A3A" stopOpacity={0.12}/><stop offset="1" stopColor="#8E3D52" stopOpacity={0}/></radialGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id}bg)`}/>
      {/* through the far arch: the field of Kurukshetra, lit (or the grey of dawn) */}
      <FarView f={f} mood={mood} glow={alone ? 1.15 : 1}/>
      <Lit items={[{d: FAR_WALL, t: proj(KF)}]} evenodd layers={[{c: mix(portalRim, "#1A1430", 0.45)}, {c: dawn ? "#171726" : "#110E24", t: about(F, 1.012)}]}>
        <Glow x={L[0]} y={L[1] + 140} rx={560} ry={460} g="hl-air" o={1.5 * air}/>
        <path d={FAR_FRAME} transform={proj(KF)} fill="none" stroke={FP.rim} strokeWidth={5} opacity={0.24}/>
        <Glow x={F[0]} y={F[1] + 10} rx={330} ry={260} g={dawn ? "hl-cool" : "hl-warm"} o={dawn ? 0.35 : 0.22 * (alone ? 1.3 : 1)}/>
        {shadows ? [-1, 1].map((sd) => {
          const x0 = sd < 0 ? 560 : 1150, x1 = sd < 0 ? 780 : 1360;
          return <path key={sd} d={armyPath(VPY - 6, 1.45, 26, sd < 0 ? 31 : 37, x0, x1, f / 24)} fill="#030108" opacity={0.6 * Math.min(1, air * 1.2)} transform={`translate(${n1(sd * 70 * part)} 0)`}/>;
        }) : null}
      </Lit>
      {HIGH.map((d, i) => <g key={i}>
        <path d={d} transform={proj(KF)} fill={`url(#${id}jl)`} opacity={dawn ? 0.9 : 0.62}/>
        <path d={d} transform={proj(KF)} fill={`url(#${id}jp)`}/>
        <path d={d} transform={proj(KF)} fill="none" stroke={dawn ? "#C8CCE0" : portalRim} strokeWidth={5} opacity={dawn ? 0.35 : 0.2}/>
      </g>)}
      {/* the floor, polished dark stone: the far arch's light lies in it */}
      <rect x={-60} y={ay0} width={W + 120} height={H} fill={`url(#${id}fl)`}/>
      <Glow x={VPX} y={ay0 + 70} rx={(ax1 - ax0) * 0.36} ry={120} g={dawn ? "hl-cool" : "hl-warm"} o={dawn ? 0.3 : 0.28}/>
      <Glow x={VPX} y={ay0 + 6} rx={(ax1 - ax0) * 0.62} ry={20} g={dawn ? "hl-cool" : "hl-warm"} o={dawn ? 0.5 : 0.45}/>
      <path d={Array.from({length: 15}, (_, i) => { const X = (i - 7) * 420, p0 = toScreen(X, YF, KF), p1 = toScreen(X, YF, 1.6); return `M ${n1(p0[0])} ${n1(p0[1])} L ${n1(p1[0])} ${n1(p1[1])}`; }).join(" ") + " " +
        [0.44, 0.52, 0.62, 0.75, 0.92, 1.16].map((k) => { const y = VPY + (YF - CAM) * k; return `M -60 ${n1(y)} L ${W + 60} ${n1(y)}`; }).join(" ")} stroke={dawn ? "#3E3E54" : "#2E2440"} strokeWidth={1.2} opacity={dawn ? 0.35 : 0.5} fill="none"/>
      {[0.52, 0.72].map((k) => { const body = k < 0.6 ? "#110D24" : "#0D0A1D";
        return <Portal key={k} k={k} kit={k > 0.6} L={L} body={body} warm={mix(body, warmWall, 0.75 * air)} rim={portalRim} rimOp={k < 0.6 ? 0.75 : 0.85} eps={0.0034 * (0.6 + 0.4 * Math.min(1.3, lampB))} carve={0.85 * Math.min(1, air + 0.25)}/>; })}
      {/* the pool of lamplight on the floor, between the throne and the seat, and the lamp's long reflection in the stone */}
      <ellipse cx={L[0]} cy={poolY} rx={560} ry={128} fill={`url(#${id}pl)`} opacity={0.8 * air}/>
      <ellipse cx={L[0]} cy={poolY + 4} rx={280} ry={54} fill={`url(#${id}pl)`} opacity={0.9 * air}/>
      <ellipse cx={L[0]} cy={poolY + 60} rx={26} ry={120} fill={`url(#${id}pl)`} opacity={0.35 * air}/>
      {petal ? <Petal x={L[0] + 64} y={poolY + 6} s={1.25} o={Math.min(1, 0.4 + air)}/> : null}
      {/* the lamp's light in the air of the hall */}
      <Glow x={L[0]} y={L[1] + 60} rx={1000} ry={780} g="hl-air" o={air}/>
      {dawn ? <Glow x={F[0]} y={F[1] + 60} rx={1100} ry={720} g="hl-cool" o={0.3}/> : null}
      {/* dawn: grey light falls from the high windows */}
      {dawn ? HIGH.map((d, i) => { const sd = i ? 1 : -1, [wx, wy] = toScreen(sd * 800, -640, KF), ex = wx + sd * 120, ey = FLOOR_Y + 60;
        // nested quads give the shaft a soft edge without a blur filter
        return <g key={i}>{[[30, 150, 0.22], [24, 110, 0.3], [18, 72, 0.4], [12, 40, 0.5]].map(([w0, w1, o], j) =>
          <path key={j} d={poly([[wx - w0, wy], [wx + w0, wy], [ex + w1, ey], [ex - w1, ey]])} fill={`url(#${id}sh)`} opacity={o * (0.9 + 0.1 * Math.sin(f / 60 + i))}/>)}</g>; }) : null}
      {/* shadows on the floor, thrown away from the lamp */}
      <ellipse cx={KING_X - 90} cy={FLOOR_Y + 10} rx={320} ry={34} fill="url(#hl-shade)" opacity={0.85}/>
      {!alone ? <ellipse cx={SANJ_X + 50} cy={FLOOR_Y + 8} rx={160} ry={24} fill="url(#hl-shade)" opacity={0.85}/> : null}
      {/* the flare: blinding light behind the figures, so they stay dark against it */}
      {white > 0.01 ? <><Glow x={L[0]} y={L[1] + 80} rx={1400} ry={1050} g="hl-hot" o={0.75 * white}/><Glow x={L[0]} y={L[1]} rx={700} ry={600} g="hl-hot" o={0.6 * white}/></> : null}
      {/* the king, and Sanjaya beside him */}
      <Lit items={kingItems(kingT, bow)} layers={figLayers(kc)}/>
      {dawn && !alone ? <Glow x={SANJ_X - 10} y={FLOOR_Y - 200} rx={190} ry={230} g="hl-warm" o={0.3 + 0.05 * Math.sin(f / 40)}/> : null}
      {!alone ? <Lit items={sanjItems(sanjT, sLift, a, shield)} layers={figLayers(sc)}/> : null}
      {/* the lamp */}
      <Glow x={L[0]} y={L[1] - 4} rx={420 * Math.sqrt(size)} g="hl-warm" o={0.7 * lampB}/>
      <HangingLamp px={pivot[0]} py={pivot[1]} len={len} ang={-sw} s={0.8} f={f} b={lampB} size={size} white={white} rim={K.rim} wick={wick} strike={strike} calm={calm}/>
      <Dust f={f} sun={L} n={60} y0={150} y1={FLOOR_Y} color={dawn ? "#E8E2D8" : "#FFE2A8"}/>
      {/* near the lens: one carved pillar, out of focus */}
      <ForePillar x={VPX + (1815 - VPX) / Z0} y={VPY + (YF - CAM) * KFG} s={1} warm={Math.min(1, air)}/>
      {white > 0.01 ? <Glow x={L[0]} y={L[1]} rx={900} ry={700} g="hl-hot" o={0.2 * white}/> : null}
      <rect x={-60} y={800} width={W + 120} height={360} fill="url(#hl-down)" opacity={0.75}/>
    </Frame>
  );
};

// ---------- the closing card: one diya, the title, the credits ----------
// The kit's diya (petal-moulded rim, lotus petals on its belly, a turned foot) on a moulded stone ledge, burning still;
// above its flame a faint heat shimmer: thin wavering ribbons of warm air, barely there.
const Shimmer: React.FC<{x: number; y: number; h: number; f: number; o: number}> = ({x, y, h, f, o}) => (
  <g opacity={o}>
    <SoftGlow x={x} y={y - h * 0.45} r={h * 0.32} ry={h * 0.62} c0="#FFF1D6" c1="#FFD9A0" peak={0.12} k={1.4}/>
    {[0, 1, 2].map((j) => {
      const pts: number[][] = [];
      for (let i = 0; i <= 14; i++) { const u = i / 14; pts.push([x + (j - 1) * h * 0.07 * u + Math.sin(f / 7 + u * 7 + j * 2.1) * (1.5 + h * 0.06 * u) + Math.sin(f / 4.3 + u * 13 + j) * h * 0.012, y - u * h]); }
      return <path key={j} d={band(pts, h * 0.02, h * 0.05, 1, "round")} fill="#FFF3DC" opacity={(j === 1 ? 0.09 : 0.055) * (0.8 + 0.2 * Math.sin(f / 11 + j))}/>;
    })}
  </g>
);
const DEVA_TITLE = "\u0936\u094d\u0930\u0940\u092e\u0926\u094d\u092d\u0917\u0935\u0926\u094d\u0917\u0940\u0924\u093e";   // the Bhagavad Gita, in Devanagari
const End: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const id = uid();
  const title = String(s.title || "The Bhagavad Gita"), sub = String(s.subtitle || "as Krishna told it to Arjuna");
  // the Devanagari comes first (the film's text rule): s.sa, or for the Gita its own name
  const sa = s.sa ? String(s.sa) : /bhagavad\s*g[iī]t[aā]/i.test(title) ? DEVA_TITLE : "";
  const raw: string[] = Array.isArray(s.lines) ? s.lines.map(String) : [];
  const mood = ["night", "dusk", "dawn", "gold"].includes(s.mood) ? s.mood : "night";
  // the stack, top to bottom: the diya on its ledge, the Devanagari, the title, the subtitle, the rule, the credits; the
  // credits end above the disclosure strips and the low captions the film lays over this beat (y ~ 900)
  const FX = W / 2, DY = sa ? 336 : 372, DS = 2.5, DX = FX - 64;
  const flame = diyaWick(DX, DY, DS), fy = flame[1], tip = fy - 36 * DS * 1.12;
  const ySa = DY + 142, yTi = sa ? ySa + 84 : DY + 176, ySub = yTi + 50, yRule = ySub + 42, yCr = yRule + 60, LIMIT = 884;
  // the credits: 26 px, never under 24; if one column will not fit, two columns side by side
  let size = 26, gap = 1.5, cols = 1, wrapped: string[][] = [];
  const height = (ws: string[][], sz: number, g: number) => ws.reduce((h, w) => h + w.length * sz * g, 0) + Math.max(0, ws.length - 1) * sz * 0.35 - sz * g;
  for (const [sz, c] of [[26, 1], [24, 1], [24, 2]] as [number, number][]) {
    size = sz; cols = c;
    wrapped = raw.map((l) => wrap(l, sz, c === 1 ? 1460 : 700, 0.42));
    const per = Math.ceil(wrapped.length / c), hMax = Math.max(...[0, 1].slice(0, c).map((k) => height(wrapped.slice(k * per, (k + 1) * per), sz, gap)), 0);
    if (yCr + hMax <= LIMIT) break;
  }
  const per = Math.ceil(wrapped.length / cols);
  const lit = ease(f, 0, 26);
  const t0 = Math.min(78, n * 0.26), iv = raw.length ? Math.max(24, Math.min(80, (n * 0.62 - t0) / raw.length)) : 0;   // one line after another
  const bg = mood === "dawn" ? ["#1A1C30", "#0E0F1E"] : mood === "dusk" ? ["#24142A", "#120A1C"] : mood === "gold" ? ["#2A1A22", "#140C16"] : ["#1E1426", "#0D0A1C"];
  const Lg = ledge({x0: DX - 190, x1: DX + 250, y: DY, h: 34, seed: 5, wall: 30});
  const credits = wrapped.map((ls, i) => {
    const c = cols === 1 ? 0 : Math.floor(i / per), k = cols === 1 ? i : i - c * per;
    const before = wrapped.slice(c * per, c * per + k), y0 = yCr + before.reduce((h, w) => h + w.length * size * gap, 0) + k * size * 0.35;
    const x = cols === 1 ? FX : FX + (c ? 1 : -1) * 380, a = ease(f, t0 + i * iv, 30);
    return <g key={i} opacity={a} transform={`translate(0 ${(1 - a) * 6})`}>
      {ls.map((l, j) => <text key={j} x={x} y={y0 + j * size * gap} textAnchor="middle" fontFamily={EN} fontWeight={500} fontSize={size} letterSpacing={0.6} fill={i === 0 ? "#D6BE90" : "#B8A37A"}>{l}</text>)}
    </g>;
  });
  const words = (
    <g>
      {sa ? <g opacity={ease(f, 12, 34)} transform={`translate(0 ${(1 - ease(f, 12, 34)) * 8})`}>
        <text x={FX} y={ySa} textAnchor="middle" fontFamily={SA} fontSize={64} fill="none" stroke={K.gold} strokeWidth={10} strokeLinejoin="round" opacity={0.07}>{sa}</text>
        <text x={FX} y={ySa} textAnchor="middle" fontFamily={SA} fontSize={64} fill="url(#k-gold)">{sa}</text>
      </g> : null}
      <g opacity={ease(f, 24, 36)} transform={`translate(0 ${(1 - ease(f, 24, 36)) * 8})`}>
        <text x={FX} y={yTi} textAnchor="middle" fontFamily={EN} fontWeight={500} fontSize={sa ? 76 : 96} letterSpacing={1} fill="none" stroke={K.gold} strokeWidth={10} opacity={0.05}>{title}</text>
        <text x={FX} y={yTi} textAnchor="middle" fontFamily={EN} fontWeight={500} fontSize={sa ? 76 : 96} letterSpacing={1} fill={K.cream}>{title}</text>
      </g>
      <text x={FX} y={ySub} textAnchor="middle" fontFamily={EN} fontStyle="italic" fontWeight={500} fontSize={36} fill="#D9B26A" opacity={ease(f, 38, 36)}>{sub}</text>
      <Rule y={yRule} w={480 * (0.3 + 0.7 * ease(f, 48, 40))} op={ease(f, 48, 30)}/>
      {credits}
    </g>
  );
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.03)} cx={flame[0]} cy={fy} overlay={words} vig={0.85}>
      <HallDefs/>
      <defs>
        <radialGradient id={`${id}bg`} gradientUnits="userSpaceOnUse" cx={flame[0]} cy={fy} r={1250}><stop offset="0" stopColor={bg[0]}/><stop offset="0.45" stopColor={bg[1]}/><stop offset="1" stopColor={K.night}/></radialGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id}bg)`}/>
      <Mandala cx={flame[0]} cy={fy - 20} R={250} rot={f * 0.03} op={0.05 * lit}/>
      {/* the lamp's light on the dark: one broad warm air, a warmer heart */}
      <Glow x={flame[0]} y={fy - 10} rx={780} ry={600} g="hl-air" o={1.15 * lit}/>
      <SoftGlow x={flame[0]} y={fy - 20} r={330} c0="#FFE9B0" c1="#F0A04B" peak={0.5} k={2.4} o={lit * (0.95 + 0.05 * wob(f / 6, 2))}/>
      <Dust f={f} sun={flame} n={40} y0={120} y1={DY + 40}/>
      {/* the ledge the lamp stands on, its top caught by the flame */}
      <SoftGlow x={flame[0] - 20} y={DY + 4} r={300} ry={40} c0="#FFC877" c1="#C2553A" peak={0.45} o={lit}/>
      <Rimmed paths={Lg} light={[0, -1]} point={[flame[0], fy]} w={2.2} fill="#120B14" rim={mix("#120B14", K.rim, 0.25 + 0.65 * lit)}/>
      <Diya x={DX} y={DY} s={DS} f={f} seed={3} lit={lit} calm={0.95} halo={0.55}/>
      <Shimmer x={flame[0]} y={tip + 6} h={96} f={f} o={lit}/>
    </Frame>
  );
};

export const SCENES: Record<string, React.FC<SceneP>> = {sanjaya: SanjayaHall, end: End};
