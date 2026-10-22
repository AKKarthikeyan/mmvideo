// Katha metaphor scenes: cosmos (22 Oct 2026). Lamplight look: near-black silhouettes, a thin warm rim on the side
// facing the light, light the only colour. Soft light, haze and glow are gradients, never blur filters (a few scenes use
// one gradient mask each: the light sweeping over sun-world, the reflections at the ghats and the lake, the mist wipe).
// Fix round 1 (22 Oct 2026, after the art director): the shared kit throughout (flora, arch, fire: Indian trees and
// temples only, one flame model), one light per shot, no translucent ghosts (changes happen behind a flash or mist),
// every beat lands on an image, the chariot at hero scale; details per scene below.
//  - type "light" (Gita 11.12, the splendour of a thousand suns): Krishna's cosmic form shown ONLY as light, never as a
//    figure: a radiance over the field (white core, falling off to plum and indigo at the edges), rings of fine gold
//    geometry, a thousand suns and starbursts at three depths that keep igniting through the beat, rays; the light casts
//    long shadows from the chariot and the armies towards us. s.variant "dawn" (a point of light is born) | "full"
//    (overwhelming, the default) | "fade" (11.50-51: it gathers back to the front of the chariot, where Krishna's
//    silhouette returns under a flash, and the camera closes in) | "friend" (11.41-44: night, the two friends on the
//    chariot lit by a lamp on a stand on the deck between them). s.tone 0..1 deepens the gold towards red; s.pose
//    ("despair" | "resolve") changes Arjuna's pose.
//  - "sun-world" (13.33): one sun rises over a vast land (river, irregular paddies, villages, a temple on a hill); its
//    light sweeps across the land from left to right, flooded fields flash as it reaches them, long shadows draw back.
//    s.mood "dawn" | "gold" | "dusk".
//  - "glories" (ch. 10): vignettes that follow one another through a wipe of lit mist: sun, peak (Meru), river (the
//    Ganga at the ghats, lamps on the water), ashvattha, ocean, lion; also "silence" (a still lake, a closed lotus) and
//    "letter" (s.text, in gold in a lamp-lit niche). s.items picks and orders them (aliases: himalaya, meru, ganga, tree,
//    sea...); without it three per 10 s. s.labels: one word per vignette, by the kit's Label. s.variant "sparks" (10.41):
//    sparks rise from one fire in a Vedic kunda and each becomes a star.
//  - "field" (ch. 13): golden dusk over rice paddies under the one steady sun: flooded seedlings grow, ripen into
//    backlit panicles, are harvested into thatched stacks (the default cycle); s.variant "ripe" | "growth" | "harvest" |
//    "bare" holds one stage for the whole beat.
// Every scene renders from {type, kind} alone; s.mood ("night" | "dusk" | "dawn" | "gold") tints the sky where it applies.
import React, {useId} from "react";
import {useCurrentFrame} from "remotion";
import {K, W, H, SA} from "../look";
import {SceneP, Frame, push, Flock, Label} from "../stage";
import {Dust, Sky, LightFlash, mistCover} from "../sky";
import {armyPath} from "../field";
import {smooth, ribbon, band as gband, polyD, rnd, lerp, clamp01, Pt} from "../geom";
import {Rimmed, krishnaTeach, arjuna, ratha, wheel, CYCLES, frameOf} from "../sil";
import type {Item} from "../sil";
import {Flame, Fire, Diya, diyaWick} from "../fire";
import {peepal, neem, khejri, palmyra, coconut, banyan, deodar as fDeodar, lotusLeaf, lotusBud} from "../flora";
import {temple, shrine, pillar, ghat, niche, RELIEF} from "../arch";

// ---------- helpers ----------
const ss = (v: number) => { const t = clamp01(v); return t * t * (3 - 2 * t); };
const span = (f: number, a: number, b: number) => ss((f - a) / Math.max(1e-6, b - a));
const useUid = (p: string) => p + useId().replace(/[^a-zA-Z0-9]/g, "");
const n1 = (v: number) => v.toFixed(1);
const lineD = (pts: number[][], close = false) => "M " + pts.map((p) => `${n1(p[0])} ${n1(p[1])}`).join(" L ") + (close ? " Z" : "");
const hx = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => { const A = hx(a), B = hx(b), k = clamp01(t); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, "0")).join(""); };
const circ = (x: number, y: number, r: number) => `M ${n1(x + r)} ${n1(y)} a ${n1(r)} ${n1(r)} 0 1 0 ${n1(-2 * r)} 0 a ${n1(r)} ${n1(r)} 0 1 0 ${n1(2 * r)} 0 Z`;
// Dense open Catmull-Rom polyline through control points (k samples per segment).
const dense = (pts: number[][], k = 10): number[][] => {
  const n = pts.length, out: number[][] = [], P = (i: number) => pts[Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < n - 1; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    for (let j = 0; j < k; j++) {
      const t = j / k, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3)));
    }
  }
  out.push([pts[n - 1][0], pts[n - 1][1]]);
  return out;
};
type Mood = "night" | "dusk" | "dawn" | "gold";
const moodOf = (m: any, d: Mood): Mood => (m === "night" || m === "dusk" || m === "dawn" || m === "gold" ? m : d);
type Stops = [number, string, number?][];
const Lin: React.FC<{id: string; stops: Stops; x1?: number; y1?: number; x2?: number; y2?: number; user?: boolean}> = ({id, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1, user}) => (
  <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2} gradientUnits={user ? "userSpaceOnUse" : undefined}>{stops.map(([o, c, a], i) => <stop key={i} offset={o} stopColor={c} stopOpacity={a ?? 1}/>)}</linearGradient>
);
const Rad: React.FC<{id: string; stops: Stops; cx?: number; cy?: number; r?: number; user?: boolean; tr?: string}> = ({id, stops, cx, cy, r, user, tr}) => (
  <radialGradient id={id} cx={cx} cy={cy} r={r} gradientUnits={user ? "userSpaceOnUse" : undefined} gradientTransform={tr}>{stops.map(([o, c, a], i) => <stop key={i} offset={o} stopColor={c} stopOpacity={a ?? 1}/>)}</radialGradient>
);
// A soft glow: an ellipse filled with a radial gradient whose stops fade to 0 (no blur filter).
const Glow: React.FC<{x: number; y: number; r: number; ry?: number; fill: string; o?: number}> = ({x, y, r, ry, fill, o = 1}) =>
  <ellipse cx={x} cy={y} rx={Math.max(0.1, r)} ry={Math.max(0.1, ry ?? r)} fill={`url(#${fill})`} opacity={o}/>;
// Gaussian-like stops for a glow with no visible edge.
const soft = (c: string, a: number, k = 2.4): Stops => [0, 0.1, 0.2, 0.32, 0.45, 0.6, 0.78, 1].map((t) => [t, c, t >= 1 ? 0 : a * Math.exp(-Math.pow(t * k, 2))] as [number, string, number]);
// Twinkling stars as one path per brightness class (cheap): positions seeded, above yMax faded.
const Stars: React.FC<{f: number; n: number; yMax: number; seed?: number; o?: number; rot?: number; cx?: number; cy?: number; color?: string}> = ({f, n, yMax, seed = 0, o = 1, rot = 0, cx = W / 2, cy = 0, color = "#FFF3D6"}) => {
  const groups: string[][] = [[], [], [], []];
  for (let i = 0; i < n; i++) {
    const x = rnd(i, 31 + seed) * (W + 400) - 200, y = Math.pow(rnd(i, 32 + seed), 1.3) * yMax, r = 0.5 + Math.pow(rnd(i, 33 + seed), 3) * 1.9;
    const tw = Math.floor(((Math.sin(f / (11 + rnd(i, 34 + seed) * 17) + i * 2.3) + 1) / 2) * 3.99);
    groups[tw].push(circ(x, y, r));
  }
  return <g opacity={o} transform={rot ? `rotate(${rot} ${cx} ${cy})` : undefined}>{groups.map((g, k) => <path key={k} d={g.join(" ")} fill={color} opacity={0.25 + k * 0.22}/>)}</g>;
};

// ================================================================================================================
// LIGHT (Gita 11.12): "If the splendour of a thousand suns were to blaze forth at once in the sky..."
// Fix round 1 (22 Oct 2026, the art director): the blaze blooms from a white core and falls off to plum and indigo at
// the frame's edges (no flat cream wash); the light casts long shadows from the chariot and the armies towards us and a
// bright rim runs along the ground at the horizon; the thousand suns build over the beat (starbursts with diffraction
// spikes at three depths keep igniting and drift outwards, the rings widen) under a slow push-in on the chariot; the
// chariot is at hero scale (figures ~200 px); the scalloped ring is now radiating petals of light; in "fade" Krishna
// returns under a flash of light (never a ghost), a faint residue of the rings lingers and the camera closes in.
// ================================================================================================================
const LSKY: Record<Mood, Stops> = {
  night: [[0, "#040310"], [0.34, "#0B0A22"], [0.6, "#171436"], [0.8, "#281D46"], [0.92, "#43284F"], [1, "#5E3050"]],
  dusk: [[0, "#0D0A22"], [0.38, "#221A44"], [0.66, "#45244E"], [0.86, "#7E3650"], [1, "#B24C3C"]],
  dawn: [[0, "#0F142C"], [0.42, "#25305A"], [0.72, "#55507C"], [0.9, "#A07484"], [1, "#D89A7C"]],
  gold: [[0, "#1C1230"], [0.36, "#3E2648"], [0.66, "#7A3C50"], [0.86, "#C0663F"], [1, "#EFA458"]],
};
// The rings of fine gold geometry: each is one path in local units (radius r), turned slowly about the light.
// (Ring 1, once a scalloped "lotus" of circles, is a ring of beads; ring 5's scallops became PETALS, drawn filled.)
const ringPath = (k: number, r: number): string => {
  const P: string[] = [], T = Math.PI * 2;
  const ticks = (m: number, r0: number, r1: number) => { for (let i = 0; i < m; i++) { const a = (i / m) * T; P.push(`M ${n1(Math.cos(a) * r0)} ${n1(Math.sin(a) * r0)} L ${n1(Math.cos(a) * r1)} ${n1(Math.sin(a) * r1)}`); } };
  const ring = (rr: number) => P.push(circ(0, 0, rr));
  switch (k % 8) {
    case 0: ring(r); ticks(24, r, r + 7); break;
    case 1: for (let i = 0; i < 40; i++) { const a = (i / 40) * T; P.push(circ(Math.cos(a) * r, Math.sin(a) * r, i % 5 ? 0.9 : 1.8)); } break;
    case 2: ring(r - 5); ring(r + 5); for (let i = 0; i < 72; i++) { const a = (i / 72) * T; P.push(circ(Math.cos(a) * r, Math.sin(a) * r, 1.3)); } break;
    case 3: { const m = 18, st = 7; for (let i = 0; i < m; i++) { const a = (i / m) * T, b = (((i + st) % m) / m) * T; P.push(`M ${n1(Math.cos(a) * r)} ${n1(Math.sin(a) * r)} L ${n1(Math.cos(b) * r)} ${n1(Math.sin(b) * r)}`); } ring(r); break; }
    case 4: ring(r); ring(r + 12); ticks(96, r, r + 12); for (let i = 0; i < 8; i++) { const a = (i / 8 + 1 / 16) * T; P.push(circ(Math.cos(a) * (r + 26), Math.sin(a) * (r + 26), 7)); } break;
    case 5: ring(r); break;
    case 6: ring(r); for (let i = 0; i < 36; i++) { const a = (i / 36) * T; P.push(circ(Math.cos(a) * (r + 10), Math.sin(a) * (r + 10), i % 3 ? 1.4 : 3)); } break;
    default: ring(r); ring(r - 9); ticks(180, r - 9, r - 3); break;
  }
  return P.join(" ");
};
const RING_R = [64, 112, 172, 246, 334, 436, 552, 690, 850];
const RINGS = RING_R.map((r, k) => ringPath(k, r));
// Ring 5: radiating petals of light (long, narrow, pointed, filled with a gold that fades towards the tip).
const PETALS = (() => {
  const r = RING_R[5], P: string[] = [], m = 32;
  for (let i = 0; i < m; i++) {
    const a = (i / m) * Math.PI * 2, L = i % 2 ? 46 : 78, w = i % 2 ? 0.035 : 0.05, c = Math.cos(a), s = Math.sin(a), q = (rr: number, da: number) => `${n1(Math.cos(a + da) * rr)} ${n1(Math.sin(a + da) * rr)}`;
    P.push(`M ${q(r + 3, -w * 0.6)} Q ${q(r + L * 0.45, -w)} ${n1(c * (r + L))} ${n1(s * (r + L))} Q ${q(r + L * 0.45, w)} ${q(r + 3, w * 0.6)} Z`);
  }
  return P.join(" ");
})();
// A thousand suns: a phyllotaxis field (inner ones ignite first) and suns strung on four of the rings.
const NSUN = 430;
type Sun = {r: number; a: number; core: number; halo: number; t: number; tw: number; big: number; sp: number};
const SUNS: Sun[] = [
  ...Array.from({length: NSUN}, (_, i) => {
    const r = 40 + 1180 * Math.sqrt((i + 1) / NSUN) * (0.9 + 0.2 * rnd(i, 41)), a = i * 2.39996 + rnd(i, 42) * 0.2, big = Math.pow(rnd(i, 43), 5);
    return {r, a, core: 0.9 + big * 3 + rnd(i, 44) * 0.6, halo: 5 + big * 26 + rnd(i, 45) * 5, t: clamp01(r / 1250) * 0.82 + rnd(i, 46) * 0.16, tw: 9 + rnd(i, 47) * 15, big, sp: 0.0006 + 0.004 / (1 + r / 160)};
  }),
  ...[2, 4, 6, 8].flatMap((k, j) => Array.from({length: 20 + j * 12}, (_, i) => {
    const m = 20 + j * 12, r = RING_R[k] + (k === 4 ? 26 : 0), big = Math.pow(rnd(i + j * 99, 48), 4);
    return {r, a: (i / m) * Math.PI * 2, core: 1.1 + big * 1.6, halo: 6 + big * 12, t: clamp01(r / 1250) * 0.85 + 0.06 + (i % 4) * 0.01, tw: 12 + rnd(i, 49) * 10, big: 0, sp: (k % 2 ? -1 : 1) * (0.025 + (k % 3) * 0.018) * Math.PI / 180};
  })),
];
// The starbursts: suns with diffraction spikes at three depths (0 far and small, 2 near and large). They ignite through
// the beat (t) and drift outwards as the light grows, the near ones fastest, so the field deepens as we watch.
type Burst = {a: number; r: number; d: number; t: number; s: number; rot: number; n: number; tw: number};
const BURSTS: Burst[] = Array.from({length: 96}, (_, i) => {
  const d = i % 8 === 0 ? 2 : i % 3 === 0 ? 1 : 0, r = 110 + 980 * Math.pow(rnd(i, 140), 0.8);
  return {a: rnd(i, 141) * Math.PI * 2, r, d, t: clamp01(0.06 + rnd(i, 142) * 0.86), s: [15, 30, 64][d] * (0.7 + 0.6 * rnd(i, 143)), rot: (rnd(i, 144) - 0.5) * 0.5, n: d === 2 ? 8 : d === 1 ? 6 : 4, tw: 8 + rnd(i, 145) * 10};
});
const spikes = (n: number, L: number, w: number): string => {
  let d = "";
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2, len = L * (k % 2 ? (n > 4 ? 0.45 : 0.72) : 1), c = Math.cos(a), s = Math.sin(a);
    d += `M ${n1(-s * w)} ${n1(c * w)} L ${n1(c * len)} ${n1(s * len)} L ${n1(s * w)} ${n1(-c * w)} Z `;
  }
  return d;
};
const Splendour: React.FC<{f: number; I: number; C: [number, number]; sc: number; id: string; reveal: number; rays: number; suns: number; sunFade?: number; tone?: number; bursts?: number; grow?: number; ringO?: number}> =
  ({f, I, C, sc, id, reveal, rays, suns, sunFade = 1, tone = 0, bursts = 0, grow = 0, ringO = 1}) => {
  const [cx, cy] = C;
  // the blaze: a white core, gold, amber, rose, then plum and indigo before the frame's edges
  const Rb = lerp(240, 1380, Math.pow(I, 1.1)) * Math.max(0.12, Math.min(1, sc * 1.05));
  const red = tone;
  const engrave = clamp01(I * 1.6);
  return (
    <g>
      <defs>
        <Rad id={`${id}-blaze`} user cx={cx} cy={cy} r={Rb} stops={[[0, "#FFFFFF"], [0.035, "#FFFDF4"], [0.09, mix("#FFF1CC", "#FFE2B8", red)], [0.18, mix("#FFDC98", "#FFB676", red)], [0.3, mix("#F7B25E", "#EE7A44", red)], [0.43, mix("#DE7E46", "#C8402E", red)], [0.57, mix("#AE4C46", "#8E2230", red)], [0.71, "#6E2C52"], [0.85, "#3A2050", 0.85], [1, "#1C1638", 0]]}/>
        <Rad id={`${id}-ray`} user cx={cx} cy={cy} r={1500 * Math.max(0.15, sc)} stops={[[0, "#FFF6D8", 1], [0.25, "#FFE09A", 0.7], [0.6, "#F7B860", 0.22], [1, "#F7B860", 0]]}/>
        <Rad id={`${id}-sun`} stops={[[0, "#FFFBEA", 1], [0.12, "#FFEBB4", 0.8], [0.3, "#FFD488", 0.36], [0.55, "#FFC870", 0.12], [0.8, "#FFC870", 0.03], [1, "#FFC870", 0]]}/>
        <Rad id={`${id}-spk`} stops={[[0, "#FFFFFF", 1], [0.25, "#FFF8E4", 0.8], [0.6, "#FFE8B8", 0.3], [1, "#FFE0A0", 0]]}/>
        <Rad id={`${id}-core`} stops={[[0, "#FFFFFF", 1], [0.25, "#FFFDF4", 0.96], [0.5, "#FFF3D0", 0.6], [0.75, "#FFE8B0", 0.2], [1, "#FFE4A0", 0]]}/>
        <Rad id={`${id}-pet`} user cx={0} cy={0} r={RING_R[5] + 80} stops={[[0, "#FFE9B4", 0], [(RING_R[5] - 4) / (RING_R[5] + 80), "#FFE9B4", 0], [(RING_R[5] + 6) / (RING_R[5] + 80), "#FFF2D0", 0.75], [1, "#FFD488", 0]]}/>
        <Lin id={`${id}-streak`} x1={0} y1={0} x2={1} y2={0} stops={[[0, "#FFE9B8", 0], [0.3, "#FFF0CC", 0.35], [0.5, "#FFFAEC", 1], [0.7, "#FFF0CC", 0.35], [1, "#FFE9B8", 0]]}/>
        <Rad id={`${id}-streakv`} stops={soft("#FFF4DA", 1, 2)}/>
      </defs>
      <rect x={-300} y={-300} width={W + 600} height={H + 600} fill={`url(#${id}-blaze)`} opacity={clamp01(0.35 + I * 0.75)}/>
      {/* rays filling the sky, three nested wedges each for a soft edge, turning very slowly */}
      {rays > 0.001 ? <g opacity={rays} transform={`rotate(${f * 0.012} ${cx} ${cy})`}>{Array.from({length: 64}, (_, i) => {
        const a = (i / 64) * Math.PI * 2 + rnd(i, 51) * 0.08, w = (0.3 + Math.pow(rnd(i, 52), 2) * 1.9) * Math.PI / 180, L = 1900 * Math.max(0.15, sc);
        const o = (0.05 + 0.09 * rnd(i, 53)) * (0.72 + 0.28 * Math.sin(f / 37 + i * 1.7));
        return <g key={i}>{[1, 0.55, 0.22].map((k, j) => <path key={j} d={`M ${n1(cx)} ${n1(cy)} L ${n1(cx + Math.cos(a - w * k) * L)} ${n1(cy + Math.sin(a - w * k) * L)} L ${n1(cx + Math.cos(a + w * k) * L)} ${n1(cy + Math.sin(a + w * k) * L)} Z`} fill={`url(#${id}-ray)`} opacity={o}/>)}</g>;
      })}</g> : null}
      {/* the rings of fine gold geometry: a darker engraving that reads on the white, a pale line that reads on the dark */}
      <g transform={`translate(${n1(cx)} ${n1(cy)}) scale(${sc})`}>
        {RINGS.map((d, k) => {
          const rv = clamp01(reveal * RINGS.length - k * 0.85), dir = k % 2 ? -1 : 1, sp = 0.025 + (k % 3) * 0.018;
          if (rv <= 0) return null;
          const o = ringO * (0.42 + 0.3 * (1 - k / RINGS.length)) * (0.8 + 0.2 * Math.sin(f / 50 + k)), dash = rv < 1 ? `${rv} 1` : undefined, s1 = 1 / Math.max(0.3, sc);
          return <g key={k} transform={`rotate(${n1(dir * f * sp + k * 9)})`} opacity={o}>
            <path d={d} fill="none" stroke="#A8642A" strokeWidth={1.2 * s1} opacity={0.42 * engrave} pathLength={1} strokeDasharray={dash}/>
            <path d={d} fill="none" stroke="#FFE9B4" strokeWidth={0.75 * s1} opacity={0.7} pathLength={1} strokeDasharray={dash}/>
            {k === 5 ? <path d={PETALS} fill={`url(#${id}-pet)`} opacity={0.55 * rv}/> : null}
          </g>;
        })}
      </g>
      {/* a thousand suns, turning like a galaxy: inner ones faster; ring suns turn with their ring */}
      {suns > 0.001 && sunFade > 0.001 ? <g opacity={sunFade}>{SUNS.map((p, i) => {
        const ig = clamp01((suns * 1.12 - p.t) / 0.1);
        if (ig <= 0) return null;
        const a = p.a + f * p.sp, r = p.r * sc * (1 + 0.08 * grow), x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        if (x < -60 || x > W + 60 || y < -60 || y > H + 60) return null;
        const tw = 0.72 + 0.28 * Math.sin(f / p.tw + i), hs = p.halo * (0.6 + 1.0 * I) * Math.max(0.35, Math.sqrt(sc));
        return <g key={i} opacity={ig * tw}>
          <circle cx={x} cy={y} r={hs} fill={`url(#${id}-sun)`}/>
          <circle cx={x} cy={y} r={p.core * (0.8 + 0.5 * I) * Math.max(0.5, Math.sqrt(sc))} fill="#FFFBEE"/>
        </g>;
      })}</g> : null}
      {/* the starbursts at three depths: diffraction spikes, a glow, a white heart */}
      {bursts > 0.001 && sunFade > 0.001 ? <g opacity={sunFade}>{BURSTS.map((b, i) => {
        const ig = clamp01((bursts * 1.1 - b.t) / 0.08);
        if (ig <= 0) return null;
        const a = b.a + f * (0.0004 + 0.0006 * (2 - b.d)), r = b.r * sc * (1 + [0.06, 0.16, 0.36][b.d] * grow), x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 0.94;
        if (x < -120 || x > W + 120 || y < -120 || y > H + 60) return null;
        const tw = 0.78 + 0.22 * Math.sin(f / b.tw + i * 1.3), s = b.s * (0.7 + 0.3 * ig) * (0.85 + 0.3 * I) * (1 + 0.25 * grow * (b.d / 2));
        return <g key={i} opacity={ig * tw * [0.55, 0.8, 1][b.d]} transform={`translate(${n1(x)} ${n1(y)})`}>
          <circle r={s * 0.75} fill={`url(#${id}-sun)`}/>
          <path d={spikes(b.n, s * 1.6, 0.55 + 0.35 * b.d)} transform={`rotate(${n1((b.rot + f * 0.0004) * 57.3)})`} fill={`url(#${id}-spk)`}/>
          <circle r={1.1 + b.d * 0.9} fill="#FFFFFF"/>
        </g>;
      })}</g> : null}
      {/* a soft anamorphic streak and the white heart of the light */}
      <ellipse cx={cx} cy={cy} rx={Math.max(1, (260 + 900 * I) * Math.max(0.2, sc))} ry={8 + 14 * I} fill={`url(#${id}-streakv)`} opacity={0.25 + 0.3 * I}/>
      <ellipse cx={cx} cy={cy} rx={Math.max(1, (140 + 520 * I) * Math.max(0.2, sc))} ry={1.6 + 1.6 * I} fill={`url(#${id}-streak)`} opacity={0.3 + 0.3 * I}/>
      <circle cx={cx} cy={cy} r={(30 + 300 * Math.pow(I, 1.6)) * Math.max(0.25, Math.min(1, sc))} fill={`url(#${id}-core)`}/>
    </g>
  );
};

// ---------- the chariot at hero scale ----------
// The rig in the kit's units: hub at (0, 0), ground at y = 118. Arjuna stands at the back (x -95), Krishna at the front
// (x 205); four horses abreast drawn as ONE silhouette (their outlines merged, so only the team's outer edge takes the
// rim), the horses within told apart by a shade of tone; items on a figure's far side from the light are drawn flat, so
// no figure is rimmed on both sides.
const HS: [number, number, number, number][] = [[716, 106, 1.36, 0.55], [676, 110, 1.4, 0.3], [636, 114, 1.44, 0.8], [596, 118, 1.48, 0.05]];
const HTONE = ["#211629", "#1E1326", "#1B1123", "#170D1F"];
// a traced horse frame (absolute M / C / L / Z only) moved and scaled into the rig's units
const bake = (d: string, tx: number, ty: number, s: number) => { let k = 0; return d.replace(/-?\d*\.?\d+(?:e-?\d+)?/g, (m) => (k++ % 2 ? ty + +m * s : tx + +m * s).toFixed(1)); };
const team = (f: number): Item[] => {
  // the near horse (drawn last) takes the lamp's rim; the three beyond it are flat, a shade lighter each, so the team
  // reads as one silhouette with quiet inner separations and no stack of offset outlines
  const c = CYCLES.stand, ds = HS.map(([x, y, sc, ph]) => bake(c.frames[frameOf(c, f, 1, ph)], x, y, sc));
  return ds.map((d, i) => (i === ds.length - 1 ? {d, fill: HTONE[i]} : {d, fill: HTONE[i], rim: false}));
};
// the rough centre of a path (bounding box of its end points; absolute and relative commands)
const centreOf = (d: string): [number, number] => {
  const tok = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  const N: Record<string, number> = {M: 2, L: 2, C: 6, Q: 4, S: 4, T: 2, A: 7, H: 1, V: 1, Z: 0};
  let cmd = "M", x = 0, y = 0, i = 0, x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  while (i < tok.length) {
    if (/[a-zA-Z]/.test(tok[i])) { cmd = tok[i++]; if (cmd === "Z" || cmd === "z") continue; }
    const U = cmd.toUpperCase(), k = N[U] ?? 2, rel = cmd !== U;
    if (!k || i + k > tok.length) { i++; continue; }
    const v = tok.slice(i, i + k).map(Number); i += k;
    if (U === "H") x = (rel ? x : 0) + v[0]; else if (U === "V") y = (rel ? y : 0) + v[0]; else { x = (rel ? x : 0) + v[k - 2]; y = (rel ? y : 0) + v[k - 1]; }
    if (U === "M") cmd = rel ? "l" : "L";
    x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
  }
  return x0 > x1 ? [0, 0] : [(x0 + x1) / 2, (y0 + y1) / 2];
};
// a figure's items, those on its far side from the light (side +1: the light is to the right) drawn flat; the crown's
// finial and the feather (above keep) keep their rim
const farFlat = (paths: string[], side: number, keep = -420): Item[] => paths.map((d) => { const [x, y] = centreOf(d); return x * side < -14 && y > keep ? {d, rim: false} : d; });
type RigP = {f: number; L: (x: number, y: number) => [number, number]; krishna: boolean; kL?: [number, number]; aPose?: "despair" | "listen" | "resolve"; rim: number; rimCol: string; car?: [number, number]; behind?: React.ReactNode};
const Rig: React.FC<RigP> = ({f, L, krishna, kL, aPose = "listen", rim, rimCol, car, behind}) => {
  const w = Math.sin(f / 40) * 0.3, la = L(-95, -230), lk = kL ?? L(205, -230);
  return (
    <g>
      <Rimmed paths={team(f)} light={L(690, -150)} w={rim * 0.8} rim={rimCol}/>
      {behind}
      <Rimmed paths={ratha(f, w)} light={L(60, -110)} point={car} w={rim} rim={rimCol}/>
      <Rimmed paths={farFlat(arjuna(aPose as "listen", w, f), la[0] >= 0 ? 1 : -1)} transform="translate(-95 -36) scale(0.95)" light={la} w={rim / 0.95} rim={rimCol}/>
      {krishna ? <Rimmed paths={farFlat(krishnaTeach(w, f), lk[0] >= 0 ? 1 : -1)} transform="translate(205 -36) scale(0.95)" light={lk} w={rim / 0.95} rim={rimCol}/> : null}
      <Rimmed paths={[wheel(118, f * 0.002)]} light={L(0, 0)} point={car} w={rim * 0.8} evenodd rim={rimCol}/>
    </g>
  );
};
// The rig's shadow on the ground, streaming towards us: each part casts a long streak along the ray from the light (the
// wheel a broad one, the car's lattice posts, the figures, the flagstaff, each horse), tapering and fading as it comes;
// three nested copies give the streaks a soft edge (no blur).
const RigShadow: React.FC<{x: number; gy: number; s: number; vp: [number, number]; k: number; o: number; id: string; krishna: boolean}> = ({x, gy, s, vp, k, o, id, krishna}) => {
  if (o <= 0.01) return null;
  const C: [number, number, number][] = [[0, 150, 236], [-216, 34, 200], [362, 30, 240], [-95, 56, 440], [-208, 10, 620], ...Array.from({length: 10}, (_, i) => [-178 + i * 42, 9, 150] as [number, number, number]), ...HS.map(([hx, , sc]) => [hx + 10 * sc, 70 * sc, 190 * sc] as [number, number, number])];
  if (krishna) C.push([205, 64, 480]);
  const wedges = (spread: number) => C.map(([cx, bw, ch]) => {
    const xs = x + cx * s, b = bw * s * spread, L = ch * s * k * (0.9 + 0.2 * spread);
    let dx = xs - vp[0], dy = gy - vp[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const ex = xs + dx * L, ey = gy + dy * L, e = b * 1.35, mx = xs + dx * L * 0.55, my = gy + dy * L * 0.55, mw = b * 1.25;
    return smooth([[xs - b / 2, gy, "c"], [xs + b / 2, gy, "c"], [mx + mw / 2, my], [ex + e * 0.1, ey, "c"], [ex - e * 0.1, ey, "c"], [mx - mw / 2, my]], {wind: "cw"});
  }).join(" ");
  return (
    <g opacity={o}>
      <defs><Lin id={`${id}-rsh`} stops={[[0, "#05020A", 0.95], [0.3, "#07030C", 0.6], [0.7, "#08040E", 0.18], [1, "#08040E", 0]]}/></defs>
      {[[1.7, 0.18], [1.3, 0.3], [1, 0.55]].map(([sp, op], i) => <path key={i} d={wedges(sp)} fill={`url(#${id}-rsh)`} opacity={op}/>)}
    </g>
  );
};
// The armies as rows on low rises (no boxes): each row is a mound and its banners, spears, elephants and parasols,
// the top edge caught by the light.
type Row = {y: number; s: number; c: number; seed: number; x0: number; x1: number; col: string; h: number};
const Host: React.FC<{rows: Row[]; f: number; rim: number; rimCol?: string}> = ({rows, f, rim, rimCol = "#E9B26A"}) => (
  <g>{rows.map((r, k) => <HostRow key={k} r={r} f={f} rim={rim} rimCol={rimCol}/>)}</g>
);
const HostRow: React.FC<{r: Row; f: number; rim: number; rimCol: string}> = ({r, f, rim, rimCol}) => {
  const L = r.x1 - r.x0, pts: Pt[] = [];
  for (let i = 0; i <= 14; i++) { const u = i / 14, x = r.x0 + L * u, bump = Math.pow(Math.sin(Math.PI * u), 0.6) * r.h * (0.8 + 0.4 * rnd(i, r.seed)); pts.push([x, r.y + 1 - bump]); }
  pts.push([r.x1 + 4, r.y + 3, "c"], [r.x0 - 4, r.y + 3, "c"]);
  const mound = smooth(pts), d = armyPath(r.y - r.h * 0.55, r.s, Math.max(1, Math.round(r.c)), r.seed, r.x0 + L * 0.06, r.x1 - L * 0.06, f / 18);
  return <g>
    {rim > 0.001 ? <g transform="translate(0 -1.5)" opacity={rim}><path d={mound} fill={rimCol}/><path d={d} fill={rimCol} stroke={rimCol} strokeWidth={0.8 * r.s}/></g> : null}
    <path d={mound} fill={r.col}/><path d={d} fill={r.col} stroke={r.col} strokeWidth={0.8 * r.s}/>
  </g>;
};
// The shadows of one row: every banner, spear, elephant and parasol of armyPath (the same seeds) casts a long wedge
// towards us along the ray from the light's foot (vp), widening as it comes.
const rowShadows = (r: Row, vp: [number, number], len: number): string => {
  const L = r.x1 - r.x0, x0 = r.x0 + L * 0.06, x1 = r.x1 - L * 0.06, yb = r.y - r.h * 0.55 + 2, P: string[] = [];
  for (let i = 0; i < Math.round(r.c); i++) {
    const x = x0 + rnd(i, r.seed) * (x1 - x0), h = (18 + rnd(i, r.seed + 1) * 26) * r.s, k = rnd(i, r.seed + 2), s = r.s;
    const [hh, wb] = k < 0.45 ? [h, 2.6 * s] : k < 0.62 ? [h * 1.7, 3.2 * s] : k < 0.71 ? [62 * s, 30 * s] : [h * 1.1, 12 * s];
    let dx = x - vp[0], dy = yb - vp[1]; const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
    const Ls = hh * len, ex = x + dx * Ls, ey = yb + dy * Ls, we = wb * 1.9;
    P.push(`M ${n1(x - wb / 2)} ${n1(yb)} L ${n1(x + wb / 2)} ${n1(yb)} L ${n1(ex + we / 2)} ${n1(ey)} L ${n1(ex - we / 2)} ${n1(ey)} Z`);
  }
  // the mound's own shadow: a soft band under the row
  return P.join(" ");
};
// The field under the light: the ground lit towards the horizon, a bright rim along the horizon itself, the armies in
// three rows either side of the chariot, and their long shadows streaming towards us.
const LitField: React.FC<{f: number; hor: number; I: number; C: [number, number]; id: string; gap: [number, number]; shadow: number}> = ({f, hor, I, C, id, gap, shadow}) => {
  const far = mix("#3A2646", "#6A3A50", I * 0.5), mid = "#26182F", near = "#160C1F";
  const rows: Row[] = [
    {y: hor + 2, s: 0.5, c: 160, seed: 140, x0: -80, x1: gap[0] - 40, col: far, h: 5}, {y: hor + 2, s: 0.5, c: 160, seed: 147, x0: gap[1] + 40, x1: W + 80, col: far, h: 5},
    {y: hor + 26, s: 0.85, c: 70, seed: 150, x0: -120, x1: gap[0] - 150, col: mid, h: 9}, {y: hor + 28, s: 0.85, c: 64, seed: 157, x0: gap[1] + 140, x1: W + 120, col: mid, h: 9},
    {y: hor + 66, s: 1.3, c: 30, seed: 160, x0: -160, x1: gap[0] - 320, col: near, h: 16}, {y: hor + 70, s: 1.3, c: 26, seed: 167, x0: gap[1] + 300, x1: W + 160, col: near, h: 16},
  ];
  const vp: [number, number] = [C[0], C[1]];
  const lit = clamp01(I);
  return (
    <g>
      <defs>
        <Lin id={`${id}-gnd`} user x1={0} y1={hor} x2={0} y2={H} stops={[[0, mix("#2A1832", "#F2B676", lit * 0.92)], [0.05, mix("#22142C", "#D9885A", lit * 0.85)], [0.18, mix("#170D20", "#8E4A4C", lit * 0.7)], [0.45, mix("#0E0716", "#40213A", lit * 0.6)], [1, "#06030A"]]}/>
        <Rad id={`${id}-pool`} stops={soft("#FFD08A", 0.75, 2.0)}/>
        <Lin id={`${id}-hline`} stops={[[0, "#FFE6B0", 0], [0.2, "#FFE6B0", 0.5], [0.5, "#FFF8E8", 1], [0.8, "#FFE6B0", 0.5], [1, "#FFE6B0", 0]]} x1={0} y1={0} x2={1} y2={0}/>
        <Lin id={`${id}-hsoft`} stops={[[0, "#FFD9A0", 0], [0.5, "#FFD9A0", 0.85], [1, "#FFD9A0", 0]]}/>
        <Lin id={`${id}-shd`} stops={[[0, "#07040C", 0.82], [0.45, "#08040E", 0.5], [1, "#08040E", 0]]}/>
      </defs>
      <rect x={-300} y={hor} width={W + 600} height={H - hor + 300} fill={`url(#${id}-gnd)`}/>
      <ellipse cx={C[0]} cy={hor + 6} rx={300 + 1100 * I} ry={30 + 110 * I} fill={`url(#${id}-pool)`} opacity={0.25 + 0.75 * I}/>
      {/* the bright rim of the ground along the horizon, where the light grazes it */}
      <rect x={-300} y={hor - 26} width={W + 600} height={52} fill={`url(#${id}-hsoft)`} opacity={0.12 + 0.55 * I}/>
      <rect x={-300} y={hor - 2.5} width={W + 600} height={5} fill={`url(#${id}-hline)`} opacity={0.15 + 0.85 * I}/>
      {rows.map((r, k) => <g key={k}>
        {shadow > 0.01 ? <path d={rowShadows(r, vp, 3.5 + 5 * (r.y - hor) / 70)} fill={`url(#${id}-shd)`} opacity={shadow}/> : null}
        <HostRow r={r} f={f} rim={0.3 + 0.65 * I} rimCol="#FFD9A0"/>
      </g>)}
    </g>
  );
};
// The rig's place in "dawn", "full" and "fade": hero scale (Arjuna ~197 px, Krishna ~220 px before the push), under the light.
const RS = 0.48, HUB: [number, number] = [756, 848], LHOR = 792;
const GY = HUB[1] + 118 * RS;
const LightScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const id = useUid("czl");
  const v: string = ["dawn", "full", "fade", "friend"].includes(s.variant) ? s.variant : "full";
  if (v === "friend") return <FriendLight s={s} n={n} f={f} id={id}/>;
  const u = clamp01(f / Math.max(1, n));
  const kHead: [number, number] = [HUB[0] + 205 * RS, HUB[1] + (-36 - 372 * 0.95) * RS];
  let I = 1, sc = 1, C: [number, number] = [960, 400], reveal = 1, rays = 1, suns = 1, sunFade = 1, bursts = 1, grow = 0, ringO = 1, krishna = false, flash = 0, residue = 0, halo = 0;
  let z = 1, zc: [number, number] = [930, 760];
  if (v === "dawn") {
    const e = ss(u * 1.05);
    I = 0.03 + 0.4 * e; sc = 0.55 + 0.45 * e; reveal = clamp01(e * 0.9); rays = 0.15 + 0.6 * e; suns = e * 0.62; bursts = e * 0.45; grow = e * 0.5; ringO = 0.62;
    z = 1 + 0.06 * ss(u);
  } else if (v === "full") {
    const e = ss(u);
    I = 0.84 + 0.16 * e; sc = 0.9 + 0.32 * e; suns = 0.22 + 0.78 * e; bursts = 0.14 + 0.86 * e; grow = e; rays = 0.8 + 0.2 * e; ringO = 0.9;
    z = 1 + 0.1 * e;
  } else {
    // fade (11.45-51): the light draws in to a point at the front of the chariot; Krishna returns under a flash there
    const g = ss(clamp01(u / 0.62));
    I = 0.92 * Math.pow(1 - g, 1.4) + 0.03; sc = lerp(1, 0.04, ss(g * 1.05)); reveal = 1 - g * 0.5; rays = Math.pow(1 - g, 1.5); suns = 1; bursts = 1 - g;
    sunFade = Math.pow(clamp01(1 - g * 1.15), 1.5); ringO = 0.9;
    const g2 = ss(g * 1.1);
    C = [lerp(960, kHead[0], g2), lerp(400, kHead[1], g2)];
    flash = clamp01((u - 0.5) / 0.22);
    krishna = u > 0.61;
    halo = span(u, 0.56, 0.75);
    residue = 0.24 * span(u, 0.12, 0.42) * (1 - span(f, n - 60, n - 6));
    z = 1 + 0.3 * ss(clamp01((u - 0.25) / 0.75)); zc = [kHead[0] - 40, 740];
  }
  const mood = moodOf(s.mood, "night");
  // rims: every Rimmed in the shot takes its light from C; in the rig's units
  const Cr: [number, number] = [(C[0] - HUB[0]) / RS, (C[1] - HUB[1]) / RS];
  const Lr = (x: number, y: number): [number, number] => [Cr[0] - x, Cr[1] - y];
  const shadow = clamp01((I - 0.08) * 1.25);
  return (
    <Frame f={f} zoom={z} cx={zc[0]} cy={zc[1]} vig={v === "full" ? 0.85 : 1}>
      <defs>
        <Lin id={`${id}-sky`} user x1={0} y1={0} x2={0} y2={LHOR} stops={LSKY[mood]}/>
        <Rad id={`${id}-kh`} stops={soft("#FFDFA0", 0.8, 2.3)}/>
      </defs>
      <rect x={-300} y={-300} width={W + 600} height={LHOR + 310} fill={`url(#${id}-sky)`}/>
      <Stars f={f} n={240} yMax={LHOR - 60} o={clamp01(1 - I * 1.4)}/>
      {residue > 0.002 ? <g transform={`translate(960 400) scale(${0.95 + 0.05 * u})`} opacity={residue}>{RINGS.map((d, k) => <path key={k} d={d} transform={`rotate(${n1((k % 2 ? -1 : 1) * f * 0.03 + k * 9)})`} fill="none" stroke="#FFE2A8" strokeWidth={0.9}/>)}</g> : null}
      <Splendour f={f} I={I} C={C} sc={sc} id={id} reveal={reveal} rays={rays} suns={suns} sunFade={sunFade} tone={s.tone ?? 0} bursts={bursts} grow={grow} ringO={ringO}/>
      <LitField f={f} hor={LHOR} I={I} C={C} id={id} gap={[560, 1330]} shadow={shadow}/>
      <RigShadow x={HUB[0]} gy={GY} s={RS} vp={C} k={1.5} o={shadow} id={id} krishna={krishna}/>
      {halo > 0.001 ? <Glow x={kHead[0]} y={kHead[1] + 30} r={230} ry={260} fill={`${id}-kh`} o={halo * (0.85 + 0.08 * Math.sin(f / 23))}/> : null}
      {halo > 0.001 ? <Glow x={kHead[0] + 40} y={GY + 4} r={420} ry={46} fill={`${id}-kh`} o={halo * 0.55}/> : null}
      <g transform={`translate(${HUB[0]} ${HUB[1]}) scale(${RS})`}>
        <Rig f={f} L={Lr} krishna={krishna} kL={krishna ? [0, -1] : undefined} aPose={s.pose === "despair" || s.pose === "resolve" ? s.pose : "listen"} rim={5.6} rimCol={K.rim}/>
      </g>
      {flash > 0 && flash < 1 ? <LightFlash p={flash} x={kHead[0]} y={kHead[1] + 90} r={300}/> : null}
      <Dust f={f} sun={C} n={110} y0={160} y1={1000} color="#FFE6B4"/>
    </Frame>
  );
};
// "friend" (11.41-44): night, the chariot near; a small lamp stands on the deck between the two friends and lights each
// on the side that faces it, the rail and the deck round it; the stars are what is left of the thousand suns.
// The lamp: the kit's Diya on a slender brass stand (deepastambha) whose foot is on the deck behind the side panel.
const lampStand = (x: number, y0: number, y1: number): Item[] => {
  const S: string[] = [];
  S.push(smooth([[x - 26, y0, "c"], [x - 24, y0 - 5], [x - 12, y0 - 10], [x - 6, y0 - 18, "c"], [x + 6, y0 - 18, "c"], [x + 12, y0 - 10], [x + 24, y0 - 5], [x + 26, y0, "c"]], {wind: "cw"}));
  S.push(gband([[x, y0 - 16], [x, (y0 + y1) / 2], [x, y1 + 8]], 8, 6, 1, "round"));
  for (const yy of [y0 - 34, (y0 + y1) / 2, y1 + 22]) S.push(smooth([[x - 10, yy], [x, yy - 6], [x + 10, yy], [x, yy + 6]], {wind: "cw"}));
  S.push(smooth([[x - 7, y1 + 10, "c"], [x - 14, y1 + 5], [x - 30, y1 + 1], [x - 32, y1, "c"], [x + 32, y1, "c"], [x + 30, y1 + 1], [x + 14, y1 + 5], [x + 7, y1 + 10, "c"]], {wind: "cw"}));
  return S;
};
const FriendLight: React.FC<{s: any; n: number; f: number; id: string}> = ({s, n, f, id}) => {
  const mood = moodOf(s.mood, "night");
  const HOR = 730, hub: [number, number] = [640, 856], R = 0.96;
  const SX = 52, SY = -170, DS = 0.92;                      // the stand's x and top (rig units), the diya's scale
  const wk = diyaWick(SX, SY, DS);                          // the flame's root (rig units)
  const fr: [number, number] = [wk[0], wk[1] - 12];         // the heart of its light
  const flame: [number, number] = [hub[0] + fr[0] * R, hub[1] + fr[1] * R];
  const fl = 0.95 + 0.035 * Math.sin(f / 7) + 0.015 * Math.sin(f / 3.1);
  const z = push(f, n, 1.0, 1.06);
  // light directions in rig units: towards the flame, kept nearly level so each friend is rimmed on his lamp side only
  const toF = (x: number, y: number): [number, number] => [fr[0] - x, (fr[1] - y) * 0.35];
  return (
    <Frame f={f} zoom={z} cx={flame[0]} cy={600}>
      <defs>
        <Lin id={`${id}-sky`} user x1={0} y1={0} x2={0} y2={HOR} stops={LSKY[mood]}/>
        <Rad id={`${id}-warm`} stops={[[0, "#FFE2A0", 0.7], [0.08, "#FBC679", 0.5], [0.2, "#F2A65A", 0.28], [0.38, "#D9733F", 0.12], [0.6, "#A8473A", 0.04], [1, "#A8473A", 0]]}/>
        <Rad id={`${id}-hot`} stops={soft("#FFF4D2", 0.9, 2.4)}/>
        <Rad id={`${id}-floor`} stops={soft("#F5B266", 0.5, 2.1)}/>
        <Rad id={`${id}-deck`} stops={soft("#FFC27A", 0.95, 1.9)}/>
        <Rad id={`${id}-bounce`} user cx={fr[0]} cy={fr[1] + 20} r={360} stops={[[0, "#FFC878", 0.62], [0.25, "#F59A50", 0.34], [0.55, "#C8643A", 0.12], [1, "#C8643A", 0]]}/>
        <Rad id={`${id}-sh`} stops={soft("#04020A", 0.75, 1.8)}/>
        <clipPath id={`${id}-car`}>{ratha(f, Math.sin(f / 40) * 0.3).map((d, i) => <path key={i} d={d}/>)}</clipPath>
      </defs>
      <rect x={-200} y={-200} width={W + 400} height={HOR + 210} fill={`url(#${id}-sky)`}/>
      <Stars f={f} n={380} yMax={HOR - 30} rot={f * 0.004} cx={960} cy={-400}/>
      <LitField f={f} hor={HOR} I={0.05} C={flame} id={id + "f"} gap={[300, 1760]} shadow={0}/>
      <ellipse cx={hub[0] + 300} cy={hub[1] + 116} rx={760} ry={50} fill={`url(#${id}-sh)`}/>
      <ellipse cx={flame[0]} cy={hub[1] + 112} rx={460 * fl} ry={64 * fl} fill={`url(#${id}-floor)`}/>
      <Glow x={flame[0]} y={flame[1] - 20} r={900 * fl} ry={760 * fl} fill={`${id}-warm`}/>
      <g transform={`translate(${hub[0]} ${hub[1]}) scale(${R})`}>
        <Rig f={f} L={toF} krishna aPose="listen" rim={3.6} rimCol="#FFCF88" car={fr} behind={<g>
          {/* the pool of light on the deck, seen through the arches of the side panel and over the rail */}
          <ellipse cx={SX + 20} cy={-60} rx={300 * fl} ry={90 * fl} fill={`url(#${id}-deck)`}/>
          <Rimmed paths={lampStand(SX, -36, SY)} point={fr} light={[0, -1]} w={3} rim="#FFD9A0" fill="#1C1018"/>
        </g>}/>
        {/* warm bounce from the lamp on the rail, the lattice and the deck */}
        <g clipPath={`url(#${id}-car)`}><rect x={-260} y={-240} width={700} height={280} fill={`url(#${id}-bounce)`} opacity={fl}/></g>
        <Diya x={SX} y={SY} s={DS} f={f} calm={0.92} halo={0.7} shadow={0}/>
      </g>
      <Glow x={flame[0]} y={flame[1] - 6} r={300 * fl} ry={260 * fl} fill={`${id}-warm`} o={0.75}/>
      <Glow x={flame[0]} y={flame[1] - 4} r={110 * fl} fill={`${id}-hot`} o={0.5}/>
      <Dust f={f} sun={flame} n={80} y0={260} y1={900} color="#FFE2A8"/>
    </Frame>
  );
};

// ================================================================================================================
// SUN-WORLD (Gita 13.33): "As the one sun lights up this whole world, so the knower of the field lights up the field."
// A vast land seen from a hill: far mountains on the curve of the world, a river, fields, villages, a temple on a hill.
// The land is drawn twice, in shadow and in light; the lit copy is revealed by a soft front that sweeps from left to
// right as the sun climbs, and the long shadows of trees, huts and the temple draw back towards their feet.
// ================================================================================================================
const SW_HY = 468, SW_DEPTH = 612, SW_CURVE = 34;
const swProj = (X: number, t: number): [number, number] => { const x = 960 + (X - 960) * t, k = (x - 960) / 960; return [x, SW_HY + SW_DEPTH * t + SW_CURVE * k * k * (1 - Math.min(1, t))]; };
const swHor = (x: number) => { const k = (x - 960) / 960; return SW_HY + SW_CURVE * k * k; };
// Field rows (depth t) and, per row, boundaries in ground X so that edges radiate from the vanishing point.
const SW_ROWS = [0.012, 0.03, 0.052, 0.08, 0.115, 0.16, 0.215, 0.29, 0.385, 0.5, 0.64, 0.8, 1.0, 1.25];
type Patch = {d: string; tone: number; furrow: string; t: number; wet: boolean; din: string; cx: number};
// Fix round 1: the paddies are irregular: each row's boundaries wander in depth (swT) and the lines between fields lean,
// so no field is a rectangle; the bunds between them are stroked and catch the light; one field in five is flooded.
const swT = (k: number, X: number) => SW_ROWS[k] * (k === 0 || k === SW_ROWS.length - 1 ? 1 : 1 + 0.08 * Math.sin(X / 420 + k * 1.7) + 0.04 * Math.sin(X / 131 + k * 2.9));
const SW_FIELDS: Patch[] = (() => {
  const out: Patch[] = [];
  for (let k = 0; k < SW_ROWS.length - 1; k++) {
    const t0 = SW_ROWS[k], t1 = SW_ROWS[k + 1], tm = (t0 + t1) / 2;
    const xs: number[] = []; let x = -260 - rnd(k, 61) * 200;
    while (x < W + 260) { xs.push(x); x += (90 + 260 * rnd(xs.length, 62 + k)) * (0.35 + tm * 1.6) + 14; }
    const X = xs.map((v) => 960 + (v - 960) / tm), sk = xs.map((_, j) => (rnd(j, 66 + k) - 0.5) * 0.5 * (150 / tm));
    const edge = (kk: number, Xa: number, Xb: number, m = 6) => Array.from({length: m + 1}, (_, i) => { const XX = lerp(Xa, Xb, i / m); return swProj(XX, swT(kk, XX)); });
    for (let j = 0; j < xs.length - 1; j++) {
      const top = edge(k, X[j] - sk[j], X[j + 1] - sk[j + 1]), bot = edge(k + 1, X[j] + sk[j], X[j + 1] + sk[j + 1]);
      const a = top[0], b = top[top.length - 1], c = bot[bot.length - 1], d = bot[0];
      const tone = Math.floor(rnd(j, 63 + k * 7) * 4);
      const P = (u: number, v: number) => [lerp(lerp(a[0], b[0], u), lerp(d[0], c[0], u), v), lerp(lerp(a[1], b[1], u), lerp(d[1], c[1], u), v)];
      const fl: string[] = [], m = Math.max(2, Math.round((c[0] - d[0]) / (7 + tm * 22))), wet = tm > 0.05 && tm < 0.9 && rnd(j, 65 + k) < 0.22, plain = wet || tm < 0.12 || rnd(j, 69 + k) < 0.3;
      if (plain) { /* flooded paddy or fallow: no furrows */ }
      else if (rnd(j, 64 + k) < 0.55) { for (let i = 1; i < m; i++) { const u = i / m, p = P(u, 0.08), q = P(u, 0.92); fl.push(`M ${n1(p[0])} ${n1(p[1])} L ${n1(q[0])} ${n1(q[1])}`); } }
      else { const mm = Math.max(2, Math.round((d[1] - a[1]) / (4 + tm * 12))); for (let i = 1; i < mm; i++) { const v = i / mm, p = P(0.05, v), q = P(0.95, v); fl.push(`M ${n1(p[0])} ${n1(p[1])} L ${n1(q[0])} ${n1(q[1])}`); } }
      const din = lineD([P(0.06, 0.16), P(0.94, 0.16), P(0.94, 0.86), P(0.06, 0.86)], true);
      out.push({d: lineD([...top, ...[...bot].reverse()], true), tone, furrow: fl.join(" "), t: tm, wet, din, cx: (a[0] + b[0] + c[0] + d[0]) / 4});
    }
  }
  return out;
})();
// The river: a meandering centreline in ground coordinates, its banks projected.
const SW_RIVER = (() => {
  const C = dense([[1010, 0.0], [1060, 0.03], [990, 0.07], [1120, 0.13], [930, 0.22], [700, 0.33], [860, 0.47], [560, 0.64], [330, 0.86], [140, 1.3]], 12);
  const hw = (t: number) => 105 + 30 * t, L = C.map(([X, t]) => swProj(X - hw(t), t)), R = C.map(([X, t]) => swProj(X + hw(t), t));
  return {d: lineD([...L, ...[...R].reverse()], true), C, L, R};
})();
// Hedgerows of small trees along a few field boundaries.
const SW_HEDGES = (() => {
  const P: string[] = [];
  const lines: [number, number, number][] = [[3, -500, 820], [5, 1300, 3600], [7, -1800, 400], [8, 1250, 2600], [10, -900, 120]];
  for (const [k, Xa, Xb] of lines) {
    const t = SW_ROWS[k], s = 3 + t * 34, top: Pt[] = [];
    const xa = swProj(Xa, t)[0], xb = swProj(Xb, t)[0], m = Math.max(4, Math.round((xb - xa) / (s * 0.9)));
    for (let i = 0; i <= m; i++) { const X = lerp(Xa, Xb, i / m), [x, y] = swProj(X, t), e = Math.min(1, Math.min(i, m - i) / 2); top.push([x, y - s * e * (0.62 + 0.38 * Math.sin(i * 1.9 + k) * Math.sin(i * 0.7) + 0.25 * rnd(i, 66 + k))]); }
    const [x0, y0] = swProj(Xa, t), [x1, y1] = swProj(Xb, t);
    P.push(smooth([[x0, y0 + 1, "c"], ...top.slice(1, -1), [x1, y1 + 1, "c"]]));
  }
  return P.join(" ");
})();
// A slim palm (fix round 1: no umbrellas): a thin curving trunk and fronds that arch out and droop hard; large ones are
// the kit's coconut.
const palm = (x: number, y: number, h: number, lean: number, ph: number, seed = 0): Item[] => {
  if (h > 70) return coconut({x, y, h: h * 1.15, seed, lean: lean * 0.5, t: ph * 30, detail: 0.5});
  const top: [number, number] = [x + lean * h * 0.28, y - h];
  const P = [ribbon(dense([[x, y], [x + lean * h * 0.06, y - h * 0.4], [x + lean * h * 0.18, y - h * 0.75], top], 5), h * 0.04, h * 0.024)];
  for (let i = 0; i < 9; i++) {
    const th = -Math.PI / 2 + (i - 4) * 0.42 + Math.sin(ph + i) * 0.05, side = i < 4 ? -1 : i > 4 ? 1 : (rnd(i, 71) < 0.5 ? -1 : 1), L = h * (0.32 + 0.08 * rnd(i, 70 + seed));
    const p1 = [top[0] + Math.cos(th) * L * 0.42, top[1] + Math.sin(th) * L * 0.42 - L * 0.04], p2 = [top[0] + Math.cos(th) * L * 0.72 + side * L * 0.12, top[1] + Math.sin(th) * L * 0.25 + L * 0.2], p3 = [top[0] + Math.cos(th) * L * 0.8 + side * L * 0.2, top[1] + L * 0.6];
    P.push(gband(dense([top, p1, p2, p3], 4), Math.max(0.6, h * 0.05), 0.2, 1, "point"));
  }
  return P;
};
// A round-crowned tree (mango or neem) as one bumpy outline and a trunk.
const roundTree = (x: number, y: number, h: number, seed: number): string[] => {
  const pts: Pt[] = [], m = 40;
  for (let i = 0; i < m; i++) {
    const a = Math.PI + (i / m) * Math.PI * 2, top = Math.sin(a) < 0;
    const b = 1 + 0.07 * Math.sin(a * 9 + seed) + 0.05 * Math.sin(a * 17 + seed * 2) + 0.05 * (rnd(i, seed) - 0.5);
    pts.push([x + Math.cos(a) * h * 0.5 * b, y - h * 0.42 + Math.sin(a) * h * (top ? 0.5 : 0.2) * b]);
  }
  return [smooth(pts), ribbon([[x - h * 0.02, y], [x, y - h * 0.15], [x + h * 0.01, y - h * 0.3]], h * 0.1, h * 0.06)];
};
// A hut: walls and a thatched roof with an overhang (one closed outline), base centre (x, y), width w.
const hut = (x: number, y: number, w: number, tall = 1): string => {
  const h = w * 0.5 * tall, r = w * 0.62;
  return smooth([[x - w / 2, y, "c"], [x - w / 2, y - h, "c"], [x - r, y - h + w * 0.02, "c"], [x - w * 0.2, y - h - w * 0.36], [x, y - h - w * 0.48], [x + w * 0.2, y - h - w * 0.36], [x + r, y - h + w * 0.02, "c"], [x + w / 2, y - h, "c"], [x + w / 2, y, "c"]]);
};
type SWObj = {kind: "palm" | "tree" | "hut"; x: number; y: number; s: number; seed: number};
// Villages: clusters of huts with palms and round trees (ground X, depth t).
const SW_VILLAGES: SWObj[] = (() => {
  const out: SWObj[] = [];
  const at: [number, number, number, number][] = [[880, 0.11, 7, 3], [1500, 0.3, 9, 5], [-160, 0.56, 10, 7]];
  at.forEach(([X0, t0, nh, seed]) => {
    for (let i = 0; i < nh + 5; i++) {
      const X = X0 + (rnd(i, seed * 11) - 0.5) * 900, t = t0 * (1 + (rnd(i, seed * 13) - 0.5) * 0.22), [x, y] = swProj(X, t), s = t;
      out.push({kind: i < nh ? "hut" : i < nh + 3 ? "palm" : "tree", x, y, s, seed: i + seed * 17});
    }
  });
  // scattered palms and trees across the plain
  for (let i = 0; i < 12; i++) { const t = 0.05 + Math.pow(rnd(i, 71), 1.4) * 0.8, X = 960 + (rnd(i, 72) * 2400 - 1200) / t, [x, y] = swProj(X, t); if (x < -40 || x > W + 40) continue; out.push({kind: "palm", x, y, s: t, seed: 100 + i}); }
  // groves: tight clusters of mango domes
  ([[1320, 0.42, 6], [420, 0.24, 5], [2100, 0.7, 5], [700, 0.62, 4], [1180, 0.16, 4]] as [number, number, number][]).forEach(([X0, t0, m], g) => { for (let i = 0; i < m; i++) { const t = t0 * (1 + (rnd(i, 74 + g) - 0.5) * 0.08), X = X0 + (rnd(i, 75 + g) - 0.5) * 260 / Math.max(0.3, t0), [x, y] = swProj(X, t); out.push({kind: "tree", x, y, s: t * (0.85 + 0.3 * rnd(i, 76 + g)), seed: 200 + g * 10 + i}); } });
  return out.sort((a, b) => a.y - b.y);
})();
const objPaths = (o: SWObj, f: number): Item[] => o.kind === "hut" ? [hut(o.x, o.y, 64 * o.s, 0.9 + rnd(o.seed, 74) * 0.3)] : o.kind === "palm" ? palm(o.x, o.y, (150 + 60 * rnd(o.seed, 75)) * o.s, rnd(o.seed, 76) - 0.5, f / 40 + o.seed, o.seed) : roundTree(o.x, o.y, (110 + 50 * rnd(o.seed, 77)) * o.s, o.seed);
const objH = (o: SWObj) => (o.kind === "hut" ? 60 : o.kind === "palm" ? 175 : 130) * o.s;
// The far range on the curve of the world, the left hills and the temple hill.
// 1-D value noise (smooth), and a ridged fractal for mountain skylines.
const vnoise = (x: number, seed: number) => { const i = Math.floor(x), u = x - i, a = rnd(i, seed), b = rnd(i + 1, seed), k = u * u * (3 - 2 * u); return a + (b - a) * k; };
const ridged = (x: number, seed: number) => { let h = 0, amp = 1, fr = 1, norm = 0; for (let o = 0; o < 5; o++) { const v = 1 - Math.abs(vnoise(x * fr, seed + o * 13) * 2 - 1); h += v * v * amp; norm += amp; amp *= 0.5; fr *= 2.1; } return h / norm; };
const ridge = (x0: number, x1: number, base: (x: number) => number, hMax: number, seed: number, m: number, scale: number): string => {
  const pts: number[][] = [];
  for (let i = 0; i <= m; i++) { const x = lerp(x0, x1, i / m); pts.push([x, base(x) - Math.pow(ridged(x / scale, seed), 1.6) * hMax]); }
  return `M ${n1(x0)} ${n1(base(x0) + 10)} L ` + pts.map((p) => `${n1(p[0])} ${n1(p[1])}`).join(" L ") + ` L ${n1(x1)} ${n1(base(x1) + 10)} Z`;
};
const SW_MTN = ridge(-80, 2000, (x) => swHor(x) - 1, 110, 3, 220, 260);
const SW_MTN2 = ridge(-80, 2000, (x) => swHor(x) + 2, 46, 9, 260, 120);
const SW_HILL_L = smooth([[-80, 610, "c"], [-80, 520], [60, 506], [200, 512], [320, 522], [430, 516], [560, 528], [690, 548], [770, 574, "c"], [780, 610, "c"]]);
const SW_HILL_R = smooth([[1060, 624, "c"], [1110, 600], [1190, 572], [1270, 548], [1330, 540], [1390, 543], [1470, 556], [1560, 566], [1650, 560], [1760, 566], [1860, 560], [2000, 556], [2000, 640, "c"]]);
const SW_HILL_TREES = (() => { const P: string[] = []; for (let i = 0; i < 40; i++) { const x = 1130 + i * 19 + rnd(i, 82) * 10, y = (x < 1330 ? lerp(592, 540, (x - 1130) / 200) : lerp(540, 566, Math.min(1, (x - 1330) / 230))) + 4, r = 4 + rnd(i, 83) * 4; if (Math.abs(x - 1330) < 70) continue; P.push(`M ${n1(x - r)} ${n1(y)} a ${n1(r)} ${n1(r * 1.15)} 0 0 1 ${n1(2 * r)} 0 Z`); } for (let i = 0; i < 34; i++) { const x = 20 + i * 21 + rnd(i, 84) * 10, y = 514 + Math.sin(i * 0.5) * 6 + (x > 560 ? (x - 560) * 0.3 : 0) + 4, r = 4 + rnd(i, 85) * 4; P.push(`M ${n1(x - r)} ${n1(y)} a ${n1(r)} ${n1(r * 1.15)} 0 0 1 ${n1(2 * r)} 0 Z`); } return P.join(" "); })();
// The near ridge we stand on, and the great tree at the right edge (a banyan with hanging roots).
const SW_RIDGE = smooth([[-60, 1100, "c"], [-60, 1012], [180, 990], [420, 1000], [700, 1030], [980, 1046], [1260, 1030], [1500, 1004], [1700, 986], [1980, 976], [1980, 1100, "c"]]);
const SW_TUFTS = (() => { const P: string[] = []; for (let i = 0; i < 46; i++) { const x = -20 + i * 44 + rnd(i, 90) * 20, y = 1004 + Math.sin(i * 0.3) * 10 + (x > 700 && x < 1300 ? 34 : x > 1300 ? 0 : 0); for (let k = 0; k < 5; k++) { const a = -0.9 + k * 0.45 + (rnd(i * 5 + k, 91) - 0.5) * 0.3, L = 18 + rnd(i * 5 + k, 92) * 26; P.push(ribbon([[x + k * 2, y + 6], [x + k * 2 + Math.sin(a) * L * 0.5, y + 6 - L * 0.55], [x + k * 2 + Math.sin(a) * L, y + 6 - L]], 3.4, 0.3)); } } return P.join(" "); })();

const SWLand: React.FC<{f: number; lit: boolean; id: string; shadowK: number; sweep: number}> = ({f, lit, id, shadowK, sweep}) => {
  const light: [number, number] = [-1, -0.2];
  const T = lit
    ? {mtn: "#8A5868", mtn2: "#5C3852", plain: "#3C2440", hillL: "#2E1B36", hillR: "#2C1A35", fields: ["#36213C", "#3D2642", "#311E38", "#442A47"], furrow: "#F4BE72", fo: 0.2, hedge: "#22142A", obj: "#1E1226", ridge: "#120A18", tree: "#0F0815"}
    : {mtn: "#3A3258", mtn2: "#2A2446", plain: "#221C3C", hillL: "#17122A", hillR: "#161129", fields: ["#1E1832", "#231C38", "#1B152E", "#261F3C"], furrow: "#120E22", fo: 0.5, hedge: "#120E22", obj: "#110C1C", ridge: "#0B0712", tree: "#0A0610"};
  const R = (paths: Item[], fill: string, w = 2.2, rimCol = "#FFCF8A") => lit ? <Rimmed paths={paths} fill={fill} light={light} w={w} rim={rimCol}/> : <g>{paths.map((it, i) => <path key={i} d={typeof it === "string" ? it : it.d} fill={fill}/>)}</g>;
  // fields merged by tone (patches never overlap), furrows by depth band: a few elements instead of hundreds
  const fields = (near: boolean) => {
    const ps = SW_FIELDS.filter((p) => (p.t >= 0.19) === near);
    return <g>
      {[0, 1, 2, 3].map((tone) => <path key={tone} d={ps.filter((p) => p.tone === tone).map((p) => p.d).join(" ")} fill={T.fields[tone]}/>)}
      <path d={ps.filter((p) => p.wet).map((p) => p.din).join(" ")} fill={`url(#${id}-${lit ? "pdl" : "pdd"})`} opacity={lit ? 0.85 : 0.7}/>
      {[[0, 0.3], [0.3, 0.6], [0.6, 9]].map(([t0, t1], j) => { const tm = Math.min(1, (t0 + Math.min(t1, 1.2)) / 2); return <path key={"f" + j} d={ps.filter((p) => !p.wet && p.furrow && p.t >= t0 && p.t < t1).map((p) => p.furrow).join(" ")} fill="none" stroke={T.furrow} strokeWidth={0.5 + tm * 1.2} opacity={T.fo * (lit ? 0.3 + tm * 0.5 : 0.7)}/>; })}
    </g>;
  };
  return (
    <g>
      {R([SW_MTN], T.mtn, 2, "#FFE0B0")}
      {R([SW_MTN2], T.mtn2, 1.6, "#FFD49A")}
      {/* the land under everything: from the curved horizon down */}
      <path d={`M -80 ${n1(swHor(-80))} ${Array.from({length: 21}, (_, i) => { const x = -80 + i * 104; return `L ${n1(x)} ${n1(swHor(x))}`; }).join(" ")} L 2000 1100 L -80 1100 Z`} fill={T.plain}/>
      {fields(false)}
      {R([SW_HILL_L, SW_HILL_TREES], T.hillL, 1.6)}
      {R([SW_HILL_R], T.hillR, 1.6)}
      {R(temple({x: 1330, y: 543, w: 34, porch: -1, spires: 1, t: f, wind: 0.3}), lit ? "#1E1226" : "#120C1E", 2, "#FFD9A0")}
      {fields(true)}
      {/* field edges: a fine line of light where one field meets the next */}
      {/* the bunds between the fields: raised edges that catch the light once it reaches them */}
      {[[0.03, 0.2], [0.2, 0.5], [0.5, 9]].map(([t0, t1], j) => <path key={"b" + j} d={SW_FIELDS.filter((p) => p.t >= t0 && p.t < t1).map((p) => p.d).join(" ")} fill="none" stroke={lit ? "#F6C080" : "#0C0818"} strokeWidth={0.5 + j * 0.7} opacity={lit ? 0.34 : 0.5}/>)}
      {/* flooded paddies flash as the light reaches them */}
      {lit ? SW_FIELDS.filter((p) => p.wet).map((p, i) => { const fl = Math.exp(-Math.pow((p.cx - (sweep - 230)) / 210, 2)); return fl > 0.03 ? <path key={"w" + i} d={p.din} fill="#FFE6B8" opacity={0.75 * fl}/> : null; }) : null}
      {R([SW_HEDGES], T.hedge, 1.2)}
      {/* the river: dark steel before the light, molten gold after it, with a bright thread and glints */}
      <path d={SW_RIVER.d} fill={lit ? `url(#${id}-rvl)` : `url(#${id}-rvd)`}/>
      <path d={ribbon(SW_RIVER.L, 1, 7, 1)} fill={lit ? "#24132A" : "#0E0B1C"} opacity={0.7}/>
      <path d={ribbon(SW_RIVER.R, 1, 5, 1)} fill={lit ? "#24132A" : "#0E0B1C"} opacity={0.45}/>
      {SW_RIVER.C.filter((_, i) => i % 2 === 1).map(([X, t], i) => { const [x, y] = swProj(X + (rnd(i, 79) - 0.5) * 150, t); const w = (24 + rnd(i, 78) * 40) * t + 2; return <path key={i} d={`M ${n1(x - w / 2)} ${n1(y)} Q ${n1(x)} ${n1(y - 1.5 - t * 3)} ${n1(x + w / 2)} ${n1(y)}`} fill="none" stroke={lit ? "#FFF0CC" : "#9EA4D4"} strokeWidth={0.6 + t} opacity={0.35}/>; })}
      {lit ? <g>
        <path d={lineD(SW_RIVER.R)} fill="none" stroke="#FFE2A8" strokeWidth={1.2} opacity={0.55}/>
        {SW_RIVER.C.map(([X, t], i) => { const tw = 0.5 + 0.5 * Math.sin(f / 7 + i * 1.9); const [x, y] = swProj(X + (rnd(i, 93) - 0.5) * 200, t); const w = (16 + rnd(i, 94) * 46) * t + 2; return <rect key={i} x={x - w / 2} y={y} width={w} height={0.6 + t * 2} rx={1} fill="#FFFBEA" opacity={tw * 0.85}/>; })}
      </g> : <g>{SW_RIVER.C.filter((_, i) => i % 3 === 0).map(([X, t], i) => { const [x, y] = swProj(X + (rnd(i, 98) - 0.5) * 160, t); const w = (14 + rnd(i, 99) * 30) * t + 2; return <rect key={i} x={x - w / 2} y={y} width={w} height={0.6 + t * 1.6} fill="#8A90C0" opacity={0.25 + 0.2 * Math.sin(f / 11 + i)}/>; })}</g>}
      {/* long shadows, cast away from the sun, shortening as it climbs */}
      {lit ? <path d={SW_VILLAGES.map((o) => { const h = objH(o), L = h * shadowK, w = h * (o.kind === "palm" ? 0.08 : 0.3); return polyD([[o.x - w * 0.5, o.y + 0.5], [o.x + w * 0.5, o.y + 0.5], [o.x + L, o.y + 1 + L * 0.05 + w * 0.08], [o.x + L, o.y + 1 + L * 0.05 - w * 0.02]], true, "cw"); }).join(" ")} fill="#0E0816" opacity={0.5}/> : null}
      {lit ? <path d={`M 1300 543 L ${1330 + 120 * shadowK} 549 L ${1330 + 120 * shadowK} 553 L 1300 552 Z`} fill="#120A1A" opacity={0.3}/> : null}
      {/* huts, palms and trees */}
      {R(SW_VILLAGES.flatMap((o) => objPaths(o, f)), T.obj, 1.2)}
      {/* lamps in the doorways while the village is still in shadow */}
      {!lit ? SW_VILLAGES.filter((o) => o.kind === "hut" && rnd(o.seed, 95) < 0.6).map((o, i) => <g key={i}><circle cx={o.x} cy={o.y - 8 * o.s} r={30 * o.s + 2} fill={`url(#${id}-lamp)`}/><rect x={o.x - 3 * o.s} y={o.y - 14 * o.s} width={6 * o.s + 0.6} height={14 * o.s} fill="#FFC870" opacity={0.85}/></g>) : null}
      {/* smoke from the hearths */}
      {SW_VILLAGES.filter((o) => o.kind === "hut" && o.seed % 5 === 1).slice(0, 3).map((o, i) => { const h = 260 * o.s + 20, pts: number[][] = []; for (let k = 0; k <= 10; k++) { const u = k / 10; pts.push([o.x + u * h * 0.6 + Math.sin(f / 30 + u * 4 + i) * 6 * u, o.y - 30 * o.s - u * h]); } return <path key={i} d={ribbon(pts, 2 + 4 * o.s, 14 + 40 * o.s, 1)} fill={lit ? "#F6CF98" : "#3A3254"} opacity={lit ? 0.16 : 0.26}/>; })}
      <rect x={-200} y={SW_HY - 4} width={W + 400} height={420} fill={`url(#${id}-${lit ? "hzl" : "hzd"})`}/>
      {/* the near ridge and the great banyan */}
      {R([SW_RIDGE], T.ridge, 3)}
      <path d={SW_TUFTS} fill={T.ridge}/>
      {lit ? <path d={SW_TUFTS} fill="none" stroke="#FFCF8A" strokeWidth={0.6} opacity={0.3}/> : null}
      {R(banyan({x: 1790, y: 1004, h: 330, seed: 9, t: f, wind: 0.1, detail: 0.85, back: lit ? "#1E1028" : T.tree}), T.tree, 2.6)}
    </g>
  );
};
const SunWorld: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const id = useUid("czs");
  const u = clamp01(f / Math.max(1, n)), e = ss(u);
  const mood: "dawn" | "gold" | "dusk" = s.mood === "gold" || s.mood === "dusk" ? s.mood : "dawn";
  const sunX = 400 + 70 * e, sunY = lerp(452, 300, e), sunR = 62;
  const sweep = lerp(330, 2850, Math.pow(u, 0.92));
  const shadowK = lerp(7, 1.6, e);
  const z = push(f, n, 1.0, 1.05);
  const ang = Math.atan2(320, 520), fx = Math.cos(ang), fy = Math.sin(ang);
  return (
    <Frame f={f} zoom={z} cx={800} cy={560}>
      <defs>
        <linearGradient id={`${id}-sweep`} gradientUnits="userSpaceOnUse" x1={sweep - 300} y1={330} x2={sweep} y2={560}><stop offset="0" stopColor="#FFF"/><stop offset="0.6" stopColor="#FFF" stopOpacity={0.6}/><stop offset="1" stopColor="#FFF" stopOpacity={0}/></linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x={-200} y={-200} width={W + 400} height={H + 400}><rect x={-200} y={-200} width={W + 400} height={H + 400} fill={`url(#${id}-sweep)`}/></mask>
        <linearGradient id={`${id}-front`} gradientUnits="userSpaceOnUse" x1={sweep - 520 - fx * 300} y1={300 - fy * 300} x2={sweep} y2={620}><stop offset="0" stopColor="#FFD08A" stopOpacity={0}/><stop offset="0.8" stopColor="#FFDCA0" stopOpacity={0.42}/><stop offset="1" stopColor="#FFD08A" stopOpacity={0}/></linearGradient>
        <Lin id={`${id}-rvd`} user x1={0} y1={SW_HY} x2={0} y2={H} stops={[[0, "#9A94C4"], [0.12, "#6A6A9E"], [0.4, "#3A3E70"], [1, "#1A1E3C"]]}/>
        <Lin id={`${id}-rvl`} user x1={0} y1={SW_HY} x2={0} y2={H} stops={[[0, "#FFF8E4"], [0.1, "#FFE2A8"], [0.26, "#F2AA6C"], [0.45, "#B4646A"], [0.68, "#5E3A66"], [1, "#2E2650"]]}/>
        <Lin id={`${id}-pdd`} user x1={0} y1={SW_HY} x2={0} y2={H} stops={[[0, "#7E7AAA"], [0.2, "#4E4E80"], [0.6, "#30305A"], [1, "#242648"]]}/>
        <Lin id={`${id}-pdl`} user x1={0} y1={SW_HY} x2={0} y2={H} stops={[[0, "#FFEBC0"], [0.15, "#F2BC80"], [0.42, "#B86A5C"], [1, "#4E2E50"]]}/>
        <Lin id={`${id}-hzd`} user x1={0} y1={SW_HY - 4} x2={0} y2={SW_HY + 416} stops={[[0, "#7C74A6", 0.62], [0.12, "#6A6496", 0.36], [0.4, "#4A4478", 0.12], [1, "#4A4478", 0]]}/>
        <Lin id={`${id}-hzl`} user x1={0} y1={SW_HY - 4} x2={0} y2={SW_HY + 416} stops={[[0, "#FFDCB0", 0.82], [0.1, "#F6B488", 0.55], [0.28, "#D88070", 0.22], [0.55, "#B8606A", 0.06], [1, "#B8606A", 0]]}/>
        <Rad id={`${id}-lamp`} stops={soft("#FFC870", 0.55, 2.2)}/>
        <Rad id={`${id}-side`} user cx={sunX} cy={SW_HY + 30} r={1300} tr={`translate(${sunX} ${SW_HY + 30}) scale(1 0.55) translate(${-sunX} ${-SW_HY - 30})`} stops={[[0, "#FFD08A", 0.34], [0.3, "#F2A060", 0.16], [0.7, "#C2553A", 0.04], [1, "#C2553A", 0]]}/>
        <Lin id={`${id}-mist`} stops={[[0, "#F0BCA0", 0], [0.5, "#F0BCA0", 0.5], [1, "#F0BCA0", 0]]}/>
        <Lin id={`${id}-mistd`} stops={[[0, "#5E5A8A", 0], [0.5, "#5E5A8A", 0.42], [1, "#5E5A8A", 0]]}/>
        <Lin id={`${id}-glow`} user x1={0} y1={SW_HY - 120} x2={0} y2={H} stops={[[0, "#FFC27A", 0], [0.12, "#FFC27A", 0.3], [0.25, "#E88A58", 0.12], [0.55, "#8E3D52", 0.04], [1, "#8E3D52", 0]]}/>
      </defs>
      <Sky mood={mood} sun={[sunX, sunY]} sunR={sunR} f={f} rays={0.5} id={id + "k"} stars={mood === "dawn" ? 0.25 * (1 - e) : 0}/>
      <Flock f={f + 400} light={[-1, 0]} y={230} count={5} scale={0.22} seed={2}/>
      <SWLand f={f} lit={false} id={id} shadowK={shadowK} sweep={sweep}/>
      <rect x={-200} y={SW_HY + 24} width={W + 400} height={100} fill={`url(#${id}-mistd)`} opacity={0.5}/>
      <g mask={`url(#${id}-m)`}>
        <SWLand f={f} lit id={id} shadowK={shadowK} sweep={sweep}/>
        <rect x={-200} y={SW_HY - 120} width={W + 400} height={H} fill={`url(#${id}-glow)`}/>
        <rect x={-200} y={SW_HY - 10} width={W + 400} height={H} fill={`url(#${id}-side)`}/>
        <rect x={-200} y={SW_HY + 24} width={W + 400} height={100} fill={`url(#${id}-mist)`} opacity={0.4}/>
      </g>
      <rect x={-200} y={SW_HY - 10} width={W + 400} height={H} fill={`url(#${id}-front)`}/>
      <Dust f={f} sun={[sunX, sunY]} n={70} y0={200} y1={980}/>
    </Frame>
  );
};

// ================================================================================================================
// GLORIES (Gita 10): "of lights I am the radiant sun... of mountains Meru... of rivers the Ganga... of trees the
// ashvattha..." Silhouette vignettes, each dissolving into the next. s.items picks and orders them (sun, peak, river,
// ashvattha, ocean, lion; also "silence", and "letter" which shows s.text); s.labels are small Cinzel captions.
// s.variant "sparks" (10.41): sparks fly up from one fire and each becomes a star.
// ================================================================================================================
type GV = React.FC<{f: number; u: number; id: string; mood?: Mood}>;
// --- Meru / the Himalaya: a great peak catching the first light, ranges and mist below, deodars in front
const PEAK = (() => {
  const L: number[][] = [], R: number[][] = [];
  for (let i = 0; i <= 60; i++) { const u = i / 60, x = lerp(1000, 120, u), y = lerp(232, 800, Math.pow(u, 0.9)) - (ridged(u * 7, 11) - 0.45) * 70 * Math.sin(Math.PI * u) - Math.sin(u * Math.PI) * 60; L.push([x, y]); }
  for (let i = 0; i <= 60; i++) { const u = i / 60, x = lerp(1000, 1880, u), y = lerp(232, 800, Math.pow(u, 0.75)) - (ridged(u * 6, 17) - 0.45) * 80 * Math.sin(Math.PI * u) - Math.sin(u * Math.PI * 1.6) * 40; R.push([x, y]); }
  const outline = lineD([...L.reverse(), ...R], false) + ` L 1960 820 L 40 820 Z`;
  // the inner crest from the summit down towards the base: it parts the lit face (left) from the shadow face
  const C: number[][] = []; for (let i = 0; i <= 40; i++) { const u = i / 40; C.push([1000 + u * 160 + Math.sin(u * 9) * 18 + (ridged(u * 5, 23) - 0.5) * 30, 232 + u * 560]); }
  const lit = lineD([...[...L].reverse().slice(0, 61), ...[...C].reverse()], true);
  const streaks: string[] = []; for (let k = 0; k < 8; k++) { const x0 = 1050 + k * 80 + rnd(k, 24) * 40, y0 = 300 + k * 34 + rnd(k, 25) * 40, len = 100 + rnd(k, 26) * 200; const pts: number[][] = []; for (let i = 0; i <= 8; i++) { const v = i / 8; pts.push([x0 + v * len * 0.35 + Math.sin(v * 5 + k) * 6, y0 + v * len]); } streaks.push(ribbon(pts, 7, 0.6)); }
  return {outline, lit, streaks: streaks.join(" "), C};
})();
const range = (y0: number, amp: number, seed: number, sc: number) => { const pts: number[][] = []; for (let i = 0; i <= 120; i++) { const x = -60 + i * 17; pts.push([x, y0 - Math.pow(ridged(x / sc, seed), 1.4) * amp]); } return `M -60 ${y0 + 400} L ` + pts.map((p) => `${n1(p[0])} ${n1(p[1])}`).join(" L ") + ` L 1980 ${y0 + 400} Z`; };
const GPeak: GV = ({f, u, id}) => {
  const glow = 0.7 + 0.3 * ss(u);
  // deodars from the kit (no generic pines): a far row in the mist, a near row in front
  const farT: Item[] = [], nearT: Item[] = [];
  for (let i = 0; i < 15; i++) { const x = -60 + i * 138 + rnd(i, 27) * 60; farT.push(...fDeodar({x, y: 1012 + rnd(i, 29) * 16, h: 120 + rnd(i, 28) * 70, seed: 40 + i, t: f, wind: 0.15, fill: "#221A38", back: "#2A2142"})); }
  for (let i = 0; i < 10; i++) { const x = -90 + i * 222 + rnd(i, 30) * 90; nearT.push(...fDeodar({x, y: 1100, h: 210 + rnd(i, 31) * 90 + (Math.abs(x - 960) > 560 ? 70 : 0), seed: 60 + i, t: f, wind: 0.15, fill: "#0E0A18", back: "#16112A"})); }
  return (
    <g>
      <defs>
        <Lin id={`${id}-sky`} stops={[[0, "#0A0E26"], [0.35, "#1C2350"], [0.6, "#4A3F6E"], [0.78, "#9A6A80"], [0.9, "#E2A07C"], [1, "#F4C08E"]]}/>
        <Lin id={`${id}-shade`} user x1={1000} y1={230} x2={1300} y2={820} stops={[[0, "#5C6596"], [0.35, "#343B6A"], [1, "#1A1C3A"]]}/>
        <Lin id={`${id}-lit`} user x1={0} y1={230} x2={0} y2={820} stops={[[0, "#FFF0CE"], [0.12, "#FFD394"], [0.3, "#F0A070"], [0.55, "#A85C6C"], [0.8, "#4A3460"], [1, "#2A2448"]]}/>
        <Lin id={`${id}-mist`} stops={[[0, "#C9A0B0", 0], [0.5, "#C9A0B0", 0.42], [1, "#C9A0B0", 0]]}/>
        <Rad id={`${id}-sum`} stops={soft("#FFE2B0", 0.6, 2.2)}/>
      </defs>
      <rect x={-100} y={-100} width={W + 200} height={H + 200} fill={`url(#${id}-sky)`}/>
      <Stars f={f} n={150} yMax={420} o={0.8 * (1 - ss(u) * 0.5)}/>
      <Glow x={1000} y={240} r={420} ry={300} fill={`${id}-sum`} o={0.35 * glow}/>
      <path d={PEAK.outline} fill={`url(#${id}-shade)`}/>
      <path d={PEAK.lit} fill={`url(#${id}-lit)`} opacity={glow}/>
      <path d={PEAK.streaks} fill="#8C96CC" opacity={0.16}/>
      <path d={lineD(PEAK.C)} fill="none" stroke="#FFE6B8" strokeWidth={1.4} opacity={0.35 * glow}/>
      <rect x={-100} y={600} width={W + 200} height={160} fill={`url(#${id}-mist)`} transform={`translate(${Math.sin(f / 90) * 20} 0)`}/>
      <Rimmed paths={[range(780, 150, 31, 300)]} fill="#2A2246" light={[-1, -0.6]} w={1.6} rim="#F2B08A"/>
      <rect x={-100} y={720} width={W + 200} height={140} fill={`url(#${id}-mist)`} opacity={0.8} transform={`translate(${-Math.sin(f / 80) * 24} 0)`}/>
      <Rimmed paths={[range(900, 130, 37, 220)]} fill="#1A142E" light={[-1, -0.6]} w={1.6} rim="#E8A07A"/>
      <Rimmed paths={farT} light={[-0.6, -1]} w={1.3} rim="#B07A86" fill="#221A38"/>
      <Rimmed paths={nearT} light={[-0.6, -1]} w={1.8} rim="#D89A7A" fill="#0E0A18"/>
    </g>
  );
};
// --- the sun: half risen behind ranges of hills, mist in the valleys, birds crossing its face
const GSun: GV = ({f, u, id, mood}) => {
  const sy = lerp(650, 600, ss(u));
  const R = (y0: number, amp: number, seed: number, sc: number) => range(y0, amp, seed, sc);
  const layers: [number, number, number, number, string, string][] = [[668, 46, 41, 260, "#9A5866", "#FFE0A8"], [736, 74, 43, 220, "#5E3450", "#FFC27A"], [826, 96, 47, 200, "#33203E", "#F2A462"], [930, 120, 53, 180, "#170C1E", "#E8925A"]];
  const trees: Item[] = Array.from({length: 9}, (_, i) => { const x = 1460 + i * 52 + rnd(i, 61) * 30; return fDeodar({x, y: 900 - Math.pow(ridged(x / 180, 53), 1.4) * 120 + 30, h: 70 + rnd(i, 62) * 70, seed: 80 + i, t: f, fill: "#170C1E", back: "#1E1226"}); }).flat();
  return (
    <g>
      <defs><Lin id={`${id}-mist`} stops={[[0, "#F2B48A", 0], [0.55, "#F2B48A", 0.5], [1, "#F2B48A", 0]]}/></defs>
      <Sky mood={mood && mood !== "night" ? mood : "gold"} sun={[960, sy]} sunR={150} f={f} rays={0.75} id={id + "s"} stars={0} clouds={0.45}/>
      {layers.map(([y0, amp, seed, sc, col, rim], k) => <g key={k}>
        <Rimmed paths={[R(y0, amp, seed, sc)]} fill={col} light={[0, -1]} w={1.6} rim={rim}/>
        {k < 3 ? <rect x={-100} y={y0 - 30 + k * 6} width={W + 200} height={90 + k * 20} fill={`url(#${id}-mist)`} opacity={0.55 - k * 0.1} transform={`translate(${Math.sin(f / 90 + k) * 18} 0)`}/> : null}
      </g>)}
      <Rimmed paths={trees} fill="#170C1E" light={[-0.5, -1]} w={1.4} rim="#E8925A"/>
      <Flock f={f + 120} light={[0, -1]} y={500} count={5} scale={0.34} seed={4}/>
      <Dust f={f} sun={[960, sy]} n={60} y0={300} y1={900}/>
    </g>
  );
};
// --- the Ganga at the ghats (fix round 1): dusk; stone steps descend to the water across the frame; on them havelis with
// jharokhas, chhatris and arched doors (no window grids), two Nagara temples and a small shrine; the panda's parasols
// on the steps; boats at the water; leaf-cup lamps floating on the current, each the kit's Flame; the bank mirrored.
const GH_WL = 700, GH_TOP = 598;
type Hav = {S: string[]; R: string[]; glow: number[][]; lit: string[]; dark: string[]};
const hbox = (x0: number, y0: number, x1: number, y1: number) => polyD([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], true, "cw");
// an arched opening from its sill (y0) up to its crown (y1), half-width hw
const archD = (cx: number, y0: number, y1: number, hw: number) => `M ${n1(cx - hw)} ${n1(y0)} L ${n1(cx - hw)} ${n1(y1 + hw)} Q ${n1(cx - hw)} ${n1(y1)} ${n1(cx)} ${n1(y1 - hw * 0.3)} Q ${n1(cx + hw)} ${n1(y1)} ${n1(cx + hw)} ${n1(y1 + hw)} L ${n1(cx + hw)} ${n1(y0)} Z`;
// a chhatri: a small domed pavilion on two visible pillars (sky between them)
const chhatri = (cx: number, base: number, cw: number, S: string[]) => {
  const ph = cw * 0.72;
  S.push(hbox(cx - cw * 0.62, base - 3, cx + cw * 0.62, base));
  for (const sx of [-1, 1]) S.push(hbox(cx + sx * cw * 0.44 - cw * 0.07, base - ph, cx + sx * cw * 0.44 + cw * 0.07, base - 2));
  S.push(hbox(cx - cw * 0.66, base - ph - 3, cx + cw * 0.66, base - ph + 1));
  S.push(smooth([[cx - cw * 0.5, base - ph - 2, "c"], [cx - cw * 0.56, base - ph - cw * 0.3], [cx - cw * 0.34, base - ph - cw * 0.62], [cx, base - ph - cw * 0.78, "c"], [cx + cw * 0.34, base - ph - cw * 0.62], [cx + cw * 0.56, base - ph - cw * 0.3], [cx + cw * 0.5, base - ph - 2, "c"]], {wind: "cw"}));
  S.push(hbox(cx - 0.8, base - ph - cw * 0.98, cx + 0.8, base - ph - cw * 0.74));
};
// a jharokha: an oriel window on brackets under a curved (bangla) eave; frame and eave in a lighter relief (it sits
// inside the facade, so the silhouette does not change), the opening lit or dark
const jharokha = (cx: number, sill: number, w: number, out: Hav, lit: boolean) => {
  const h = w * 1.05;
  out.R.push(smooth([[cx - w * 0.62, sill - h, "c"], [cx - w * 0.5, sill - h - w * 0.2], [cx, sill - h - w * 0.32], [cx + w * 0.5, sill - h - w * 0.2], [cx + w * 0.62, sill - h, "c"], [cx + w * 0.62, sill - h + 4, "c"], [cx - w * 0.62, sill - h + 4, "c"]], {wind: "cw"}));
  out.R.push(hbox(cx - w * 0.5, sill - h + 4, cx + w * 0.5, sill), hbox(cx - w * 0.6, sill, cx + w * 0.6, sill + 4));
  for (const sx of [-0.36, 0, 0.36]) out.R.push(polyD([[cx + sx * w - 3, sill + 4], [cx + sx * w + 3, sill + 4], [cx + sx * w, sill + 4 + w * 0.32]], true, "cw"));
  const ow = w * 0.3, oy = sill - 3, ot = sill - h + 11, a = archD(cx, oy, ot, ow);
  if (lit) { out.lit.push(a); out.glow.push([cx, (oy + ot) / 2]); } else out.dark.push(a);
};
const haveli = (x: number, y: number, w: number, h: number, seed: number, out: Hav) => {
  out.S.push(hbox(x, y - h, x + w, y + 2));
  out.S.push(hbox(x - 4, y - h - 6, x + w + 4, y - h + 2));
  // a plain parapet with small finials at its corners (no battlements); some houses step back into an upper storey
  out.S.push(hbox(x - 1, y - h - 13, x + w + 1, y - h - 6));
  for (const fx0 of [x + 2, x + w - 2]) out.S.push(smooth([[fx0 - 3, y - h - 12, "c"], [fx0 - 3.5, y - h - 18], [fx0, y - h - 25, "c"], [fx0 + 3.5, y - h - 18], [fx0 + 3, y - h - 12, "c"]], {wind: "cw"}));
  if (rnd(seed, 12) < 0.45 && w > 110) { const ux = x + w * (rnd(seed, 13) < 0.5 ? 0.08 : 0.42), uw = w * 0.5, uh = 44; out.S.push(hbox(ux, y - h - uh, ux + uw, y - h)); out.S.push(hbox(ux - 3, y - h - uh - 5, ux + uw + 3, y - h - uh + 1)); out.lit.push(archD(ux + uw / 2, y - h - 8, y - h - uh + 12, 6)); out.glow.push([ux + uw / 2, y - h - 20]); }
  // a projecting balcony (jharokha) at a corner breaks the outline
  if (rnd(seed, 14) < 0.6) { const side = rnd(seed, 15) < 0.5 ? x : x + w, by = y - h * (0.35 + 0.3 * rnd(seed, 16)), bw = 14; out.S.push(hbox(side - bw * 0.6, by - 30, side + bw * 0.6, by), smooth([[side - bw, by - 30, "c"], [side, by - 40], [side + bw, by - 30, "c"]], {wind: "cw"}), polyD([[side - bw * 0.6, by], [side + bw * 0.6, by], [side, by + 12]], true, "cw")); }
  const floors = Math.max(2, Math.round(h / 56));
  for (let k = 1; k < floors; k++) { const fy = y - (h * k) / floors; out.S.push(hbox(x - 3, fy - 2.5, x + w + 3, fy + 1)); out.R.push(hbox(x, fy + 1, x + w, fy + 3.5)); }
  const nc = w > 120 ? 2 : rnd(seed, 3) < 0.65 ? 1 : 0;
  for (let c = 0; c < nc; c++) chhatri(x + w * (nc === 1 ? 0.5 + (rnd(seed, 4) - 0.5) * 0.4 : c ? 0.8 : 0.2), y - h - 6, Math.min(32, w * 0.26), out.S);
  const nj = 1 + Math.floor(rnd(seed, 5) * Math.min(3, w / 45));
  for (let j = 0; j < nj; j++) {
    const jw = Math.min(34, w * 0.3) * (0.8 + 0.3 * rnd(seed + j, 6)), jx = x + w * (0.2 + 0.6 * ((j + rnd(seed + j, 7)) / nj)), fl = 1 + Math.floor(rnd(seed + j, 8) * (floors - 1));
    jharokha(jx, y - (h * fl) / floors - 8, jw, out, rnd(seed + j, 9) < 0.6);
  }
  const nd = w > 100 ? 2 : 1;
  for (let d = 0; d < nd; d++) {
    const dx = x + w * (nd === 1 ? 0.5 : d ? 0.72 : 0.28), dw = Math.min(14, w * 0.11), a = archD(dx, y, y - 44, dw);
    if (rnd(seed + d, 11) < 0.5) { out.lit.push(a); out.glow.push([dx, y - 22]); } else out.dark.push(a);
  }
};
// the bank: havelis, a low wall with a pavilion where the sun goes down; built once (it does not move)
const GBANK = (() => {
  const HV: [number, number, number][] = [[-40, 150, 232], [112, 112, 306], [226, 128, 206], [742, 124, 246], [868, 168, 276], [1236, 138, 214], [1540, 128, 252], [1672, 116, 204], [1792, 160, 286]];
  const items: {S: string; R: string; c: [number, number]}[] = [], out: Hav = {S: [], R: [], glow: [], lit: [], dark: []};
  HV.forEach(([x, w, h], i) => {
    const o: Hav = {S: [], R: [], glow: [], lit: [], dark: []};
    haveli(x, GH_TOP, w, h, 300 + i * 7, o);
    items.push({S: o.S.join(" "), R: o.R.join(" "), c: [x + w / 2, GH_TOP - h / 2]});
    out.glow.push(...o.glow); out.lit.push(...o.lit); out.dark.push(...o.dark);
  });
  const low: string[] = [hbox(1034, GH_TOP - 64, 1238, GH_TOP + 2)];
  chhatri(1100, GH_TOP - 64, 40, low);
  items.push({S: low.join(" "), R: "", c: [1136, GH_TOP - 40]});
  return {items, glow: out.glow, lit: out.lit, dark: out.dark};
})();
const GBOAT = (x: number, y: number, L: number, dir: number, canopy: boolean): string[] => {
  const X = (v: number) => x + dir * v * L, P: string[] = [];
  P.push(smooth([[X(-0.5), y - L * 0.075, "c"], [X(-0.44), y - L * 0.035], [X(-0.3), y + L * 0.03], [X(0.3), y + L * 0.03], [X(0.44), y - L * 0.02], [X(0.53), y - L * 0.12, "c"], [X(0.47), y - L * 0.065], [X(0.32), y - L * 0.03], [X(-0.3), y - L * 0.03], [X(-0.45), y - L * 0.045]], {wind: "cw"}));
  if (canopy) {
    for (const v of [-0.26, 0.04]) P.push(hbox(Math.min(X(v), X(v + 0.012)), y - L * 0.2, Math.max(X(v), X(v + 0.012)), y - L * 0.03));
    P.push(smooth([[X(-0.3), y - L * 0.19, "c"], [X(-0.12), y - L * 0.25], [X(0.08), y - L * 0.19, "c"], [X(0.08), y - L * 0.175, "c"], [X(-0.3), y - L * 0.175, "c"]], {wind: "cw"}));
  }
  // the oar or the pole, leaning
  P.push(polyD([[X(0.36), y - L * 0.03], [X(0.36) + dir * 1.6, y - L * 0.03], [X(0.2) + dir * 1.6, y - L * 0.36], [X(0.2), y - L * 0.36]], true, "cw"));
  return P;
};
const GParasol = (x: number, y: number, s: number): string[] => [hbox(x - 1.4 * s, y - 52 * s, x + 1.4 * s, y), smooth([[x - 38 * s, y - 50 * s, "c"], [x - 20 * s, y - 60 * s], [x, y - 66 * s, "c"], [x + 20 * s, y - 60 * s], [x + 38 * s, y - 50 * s, "c"], [x + 26 * s, y - 47 * s], [x, y - 48 * s], [x - 26 * s, y - 47 * s]], {wind: "cw"})];
const GRiver: GV = ({f, u, id, mood}) => {
  const WL = GH_WL, sun: [number, number] = [1150, 506];
  const t1 = temple({x: 640, y: GH_TOP, w: 66, porch: -1, spires: 1, t: f, wind: 0.4}), t2 = temple({x: 1430, y: GH_TOP, w: 46, porch: 1, spires: 0, t: f, wind: 0.4});
  const sh = shrine({x: 360, y: 654, h: 74, flag: true, t: f, wind: 0.4});
  const steps = ghat({x0: -60, y0: GH_TOP, x1: 1980, y1: WL, n: 13, view: "front", landing: 5, seed: 7});
  const parasols = [[150, 650, 1], [470, 676, 1.1], [905, 640, 0.95], [1320, 664, 1.05], [1700, 648, 1]].flatMap(([x, y, s]) => GParasol(x, y, s));
  const bank: Item[] = [...GBANK.items.map((b) => ({d: b.S, c: b.c})), ...GBANK.items.filter((b) => b.R).map((b) => ({d: b.R, fill: RELIEF, rim: false})), ...t1, ...t2, ...sh, ...steps, {d: parasols.join(" "), c: [960, 640] as [number, number]}];
  const boats: Item[] = [...GBOAT(300, WL + 10, 210, 1, true), ...GBOAT(1660, WL + 14, 180, -1, false)].map((d) => ({d}));
  const drift = 1060 + f * 0.22, mid = GBOAT(drift, 868, 320, 1, true);
  const lamps = Array.from({length: 20}, (_, i) => { const z = 0.1 + Math.pow(rnd(i, 46), 1.3) * 0.9, x = ((rnd(i, 47) * 2600 + f * (0.18 + 0.5 * z)) % 2400) - 240, y = WL + 12 + z * 360; return {x, y, z, i}; }).sort((a, b) => a.y - b.y);
  const doorGlow = [t1.at.door, t2.at.door, sh.at.lamp].filter(Boolean) as [number, number][];
  return (
    <g>
      <defs>
        <Lin id={`${id}-water`} user x1={0} y1={WL} x2={0} y2={H} stops={[[0, "#F2A672"], [0.08, "#C46E62"], [0.3, "#5A3058"], [0.7, "#24183A"], [1, "#100A1C"]]}/>
        <linearGradient id={`${id}-fade`} gradientUnits="userSpaceOnUse" x1={0} y1={WL} x2={0} y2={WL + 300}><stop offset="0" stopColor="#FFF" stopOpacity={0.85}/><stop offset="1" stopColor="#FFF" stopOpacity={0}/></linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x={-100} y={WL} width={W + 200} height={420}><rect x={-100} y={WL} width={W + 200} height={420} fill={`url(#${id}-fade)`}/></mask>
        <Rad id={`${id}-win`} stops={soft("#FFC870", 0.85, 2.0)}/>
        <Lin id={`${id}-streak`} x1={0} y1={0} x2={0} y2={1} stops={[[0, "#FFD27A", 0.7], [1, "#FFD27A", 0]]}/>
        <Lin id={`${id}-col`} x1={0} y1={0} x2={0} y2={1} stops={[[0, "#FFE6B0", 0.9], [0.5, "#FFC27A", 0.35], [1, "#FFC27A", 0]]}/>
        <linearGradient id={`${id}-lip`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={W} y2={0}><stop offset="0" stopColor="#E89A62" stopOpacity={0.18}/><stop offset="0.6" stopColor="#FFD9A0" stopOpacity={0.55}/><stop offset="1" stopColor="#E89A62" stopOpacity={0.2}/></linearGradient>
      </defs>
      <Sky mood={mood && mood !== "night" ? mood : "dusk"} sun={sun} sunR={54} f={f} rays={0.32} id={id + "s"} horizon={GH_TOP + 10} stars={0.4}/>
      <rect x={-100} y={WL} width={W + 200} height={H - WL + 100} fill={`url(#${id}-water)`}/>
      {/* the sun's road on the water */}
      <rect x={sun[0] - 70} y={WL} width={140} height={380} fill={`url(#${id}-col)`} opacity={0.5}/>
      {Array.from({length: 26}, (_, i) => { const v = Math.pow(rnd(i, 60), 1.4), y = WL + 4 + v * 360, w = 10 + (1 - v) * 70 * rnd(i, 61) + v * 50, x = sun[0] + (rnd(i, 62) - 0.5) * (40 + v * 160); return <rect key={i} x={x - w / 2} y={y} width={w} height={1 + v * 2} fill="#FFF0CC" opacity={Math.max(0, Math.sin(f / (5 + rnd(i, 63) * 5) + i)) * (1 - v * 0.6)}/>; })}
      {/* the bank mirrored in the water, fading and broken by ripples */}
      <g mask={`url(#${id}-m)`} opacity={0.85}>
        <g transform={`translate(0 ${2 * WL}) scale(1 -1)`}>
          {bank.map((it, i) => <path key={i} d={typeof it === "string" ? it : it.d} fill="#1A0E22"/>)}
          <path d={GBANK.lit.join(" ")} fill="#E8A860" opacity={0.5}/>
        </g>
      </g>
      {Array.from({length: 54}, (_, i) => { const y = WL + 3 + Math.pow(rnd(i, 48), 1.5) * 300, w = 40 + rnd(i, 49) * 260, x = rnd(i, 50) * 2100 - 120 + Math.sin(f / 26 + i) * 8; return <rect key={i} x={x} y={y} width={w} height={1 + (y - WL) / 160} fill="#C27466" opacity={0.5}/>; })}
      {/* lit doorways and windows glow behind the bank (the openings are holes) */}
      {doorGlow.map(([x, y], i) => <rect key={i} x={x - 12} y={y - 30} width={24} height={30} fill="#FFC870" opacity={0.85}/>)}
      <Rimmed paths={bank} point={sun} light={[0, -1]} w={1.8} rim="#FFC27A" fill="#1C1024"/>
      {GBANK.lit.map((d, i) => <path key={i} d={d} fill="#FFC870" opacity={0.72 + 0.22 * Math.sin(f / (7 + (i % 5)) + i)}/>)}
      {GBANK.glow.map(([x, y], i) => <circle key={"g" + i} cx={x} cy={y} r={26} fill={`url(#${id}-win)`} opacity={0.45}/>)}
      <path d={GBANK.dark.join(" ")} fill="#0C0712"/>
      <path d={Array.from({length: 13}, (_, k) => `M -60 ${n1(GH_TOP + ((WL - GH_TOP) * k) / 13 + 1.2)} L 1980 ${n1(GH_TOP + ((WL - GH_TOP) * k) / 13 + 1.2)}`).join(" ")} stroke={`url(#${id}-lip)`} strokeWidth={1.1} fill="none"/>
      <Rimmed paths={boats} point={sun} light={[0, -1]} w={1.6} rim="#FFC27A" fill="#170C1E"/>
      <Rimmed paths={mid} light={[sun[0] - drift, sun[1] - 860]} w={2} rim="#FFC27A" fill="#150A1A"/>
      <path d={mid[0]} transform={`translate(0 ${2 * 868 + 12}) scale(1 -1)`} fill="#140A1A" opacity={0.35}/>
      {lamps.map((l) => { const s = 0.35 + l.z * 1.2; return <g key={l.i}>
        <ellipse cx={l.x} cy={l.y + 14 * s} rx={4 * s} ry={16 * s} fill={`url(#${id}-streak)`} opacity={0.55}/>
        <path d={`M ${n1(l.x - 11 * s)} ${n1(l.y - 2 * s)} Q ${n1(l.x)} ${n1(l.y + 7 * s)} ${n1(l.x + 11 * s)} ${n1(l.y - 2 * s)} Q ${n1(l.x)} ${n1(l.y + 1 * s)} ${n1(l.x - 11 * s)} ${n1(l.y - 2 * s)} Z`} fill="#1A0E1C"/>
        <Flame x={l.x} y={l.y - 1.5 * s} h={13 * s} f={f} seed={l.i * 3} calm={0.55} halo={0.7}/>
      </g>; })}
    </g>
  );
};
// --- the ashvattha: a great peepal on a rise; limbs drawn by recursive branching, foliage in clumps whose edge leaves tremble
// A peepal leaf (heart with a long drip tip) hanging from (x, y) along angle a; L = length.
const leafD = (x: number, y: number, L: number, a: number): string => {
  const c = Math.cos(a), s = Math.sin(a), P = (px: number, py: number) => `${n1(x + (px * c - py * s) * L)} ${n1(y + (px * s + py * c) * L)}`;
  return `M ${P(0, 0)} C ${P(-0.14, 0.08)} ${P(-0.5, 0.18)} ${P(-0.44, 0.48)} C ${P(-0.4, 0.68)} ${P(-0.12, 0.8)} ${P(0, 1.18)} C ${P(0.12, 0.8)} ${P(0.4, 0.68)} ${P(0.44, 0.48)} C ${P(0.5, 0.18)} ${P(0.14, 0.08)} ${P(0, 0)} Z`;
};
// A tapered band whose winding is always the same, so many can share one path with the nonzero rule.
const band = (pts: number[][], w0: number, w1: number): string => {
  const L: number[][] = [], R: number[][] = [], n = pts.length;
  for (let i = 0; i < n; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1, w = (w0 + (w1 - w0) * i / Math.max(1, n - 1)) / 2; L.push([pts[i][0] - ty / l * w, pts[i][1] + tx / l * w]); R.push([pts[i][0] + ty / l * w, pts[i][1] - tx / l * w]); }
  const poly = [...L, ...R.reverse()];
  let A = 0; for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length]; A += p[0] * q[1] - q[0] * p[1]; }
  return lineD(A < 0 ? poly.reverse() : poly, true);
};
const PEEPAL = (() => {
  const wood: string[] = [], tips: [number, number, number][] = [];
  const grow = (x: number, y: number, ang: number, len: number, w: number, depth: number, seed: number) => {
    const bend = (rnd(seed, 1) - 0.5) * 0.5, ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len;
    const mx = x + Math.cos(ang + bend) * len * 0.5, my = y + Math.sin(ang + bend) * len * 0.5;
    wood.push(band(dense([[x, y], [mx, my], [ex, ey]], 5), w, w * 0.7));
    if (depth <= 1 || (depth === 2 && rnd(seed, 9) < 0.7)) tips.push([ex, ey, ang]);
    if (depth === 0) return;
    const kids = depth === 4 ? 3 : 2;
    for (let k = 0; k < kids; k++) {
      const spread = (kids === 3 ? (k - 1) * 0.55 : (k - 0.5) * 0.85) + (rnd(seed * 3 + k, 2) - 0.5) * 0.35;
      let na = ang + spread; na = na + (-Math.PI / 2 - na) * 0.1;
      grow(ex, ey, na, len * (0.72 + rnd(seed * 5 + k, 3) * 0.14), w * 0.64, depth - 1, seed * 4 + k + 1);
    }
  };
  wood.push(band(dense([[960, 884], [954, 780], [948, 690], [952, 620]], 6), 112, 80));
  wood.push(band(dense([[880, 886], [916, 860], [936, 820]], 4), 30, 10), band(dense([[1046, 888], [1000, 862], [976, 820]], 4), 30, 10));
  const limbs: [number, number, number][] = [[-2.85, 180, 1], [-2.32, 190, 2], [-1.6, 170, 3], [-0.95, 190, 4], [-0.32, 180, 5]];
  limbs.forEach(([a, L, sd]) => grow(952, 628, a, L, 46, 4, sd * 7));
  const masses: string[] = [], leaves: [number, number, number, number][] = [];
  tips.forEach(([x, y], i) => {
    const r = 34 + rnd(i, 4) * 22, pts: Pt[] = [];
    for (let k = 0; k < 14; k++) { const b = (k / 14) * Math.PI * 2; pts.push([x + Math.cos(b) * r * (1 + 0.16 * Math.sin(b * 3 + i)), y + Math.sin(b) * r * 0.74]); }
    masses.push(smooth(pts));
    const m = 6;
    for (let k = 0; k < m; k++) { const b = (k / m) * Math.PI * 2 + rnd(i * 9 + k, 5) * 0.8, rr = r * (0.9 + 0.25 * rnd(i * 9 + k, 6)); const dir = Math.atan2(Math.sin(b) * 0.74, Math.cos(b)); leaves.push([x + Math.cos(b) * rr, y + Math.sin(b) * rr * 0.74, lerp(dir - Math.PI / 2, 0, 0.45) + (rnd(i * 9 + k, 7) - 0.5) * 0.6, 22 + rnd(i * 9 + k, 8) * 12]); }
  });
  return {wood: wood.join(" "), masses: masses.join(" "), leaves};
})();
const GTree: GV = ({f, u, id, mood}) => {
  const leaves = PEEPAL.leaves.map(([x, y, a, L], i) => leafD(x, y, L, a + Math.sin(f / (5 + (i % 7)) + i * 1.3) * 0.2)).join(" ");
  const ground = `M -60 1100 L -60 896 Q 420 852 960 846 Q 1500 852 1980 900 L 1980 1100 Z`;
  const plinth = [smooth([[776, 872, "c"], [776, 850, "c"], [1144, 850, "c"], [1144, 872, "c"]]), smooth([[746, 892, "c"], [746, 870, "c"], [1174, 870, "c"], [1174, 892, "c"]])];
  return (
    <g>
      <defs><Rad id={`${id}-bk`} stops={soft("#FFC27A", 0.42, 2)}/><Rad id={`${id}-dg`} stops={soft("#FFD08A", 0.8, 2.3)}/><Lin id={`${id}-df`} x1={0} y1={1} x2={0} y2={0} stops={[[0, "#FFFBEA"], [0.5, "#FFD27A"], [1, "#F07A3A", 0.2]]}/></defs>
      <Sky mood={mood && mood !== "night" ? mood : "dusk"} sun={[1090, 740]} sunR={80} f={f} rays={0.55} id={id + "s"}/>
      <Glow x={1000} y={560} r={820} ry={480} fill={`${id}-bk`}/>
      <Rimmed paths={[ground]} fill="#1A0E1E" light={[0, -1]} w={2} rim="#FFC27A"/>
      <g transform="translate(960 884) scale(0.9) translate(-960 -884)">
        <Rimmed paths={[PEEPAL.wood, PEEPAL.masses]} fill="#140A1A" light={[0.2, 1]} w={2.4} rim="#FFC27A"/>
        <Rimmed paths={[leaves]} fill="#140A1A" light={[0.2, 1]} w={1.5} rim="#FFD08A"/>
      </g>
      <Rimmed paths={plinth} fill="#160B1A" light={[0.3, -1]} w={2} rim="#FFC27A"/>
      {/* a small lamp on the platform at the foot of the tree */}
      <Glow x={1086} y={842} r={80} fill={`${id}-dg`} o={0.8 + 0.1 * Math.sin(f / 5)}/>
      <Diya x={1086} y={852} s={0.42} f={f} halo={0.6}/>
      <Dust f={f} sun={[1090, 740]} n={60} y0={300} y1={900}/>
    </g>
  );
};
// --- the lion on a rock, seated like the lions of old: forelegs straight, head high, a full mane of flowing locks
// (facing left, ground y = 0). The mane's edge is built from soft locks swept back along the outline.
const maneEdge = (ctrl: number[][], A: number, lean: number, t: number, seed: number): Pt[] => {
  const base = dense(ctrl, 6), cum = [0];
  for (let i = 1; i < base.length; i++) cum.push(cum[i - 1] + Math.hypot(base[i][0] - base[i - 1][0], base[i][1] - base[i - 1][1]));
  const Ltot = cum[cum.length - 1], wl = 44, m = Math.max(2, Math.round(Ltot / wl)), out: Pt[] = [];
  const at = (s: number) => { let j = 1; while (j < cum.length - 1 && cum[j] < s) j++; const u = (s - cum[j - 1]) / Math.max(1e-6, cum[j] - cum[j - 1]), a = base[j - 1], b = base[j]; return {x: lerp(a[0], b[0], u), y: lerp(a[1], b[1], u), tx: (b[0] - a[0]) / Math.max(1e-6, cum[j] - cum[j - 1]), ty: (b[1] - a[1]) / Math.max(1e-6, cum[j] - cum[j - 1])}; };
  for (let i = 0; i < m; i++) {
    const v = at((i / m) * Ltot); out.push([v.x, v.y]);
    const p = at(((i + 0.62) / m) * Ltot), k = A * (0.75 + 0.5 * rnd(i, seed)) * (0.6 + 0.4 * Math.sin(Math.PI * (i + 0.5) / m)) + Math.sin(t / 15 + i * 1.3) * 1.4;
    out.push([p.x + p.ty * k + p.tx * lean, p.y - p.tx * k + p.ty * lean]);
  }
  const e = at(Ltot); out.push([e.x, e.y]);
  return out;
};
const LION = (t: number): string[] => {
  const P: string[] = [];
  const sw = Math.sin(t / 34) * 4;
  // body: chest, back sloping to the great haunch, hind foot flat on the ground, belly, near foreleg
  P.push(smooth([[-150, -400], [-112, -420], [0, -380], [26, -330], [44, -290], [84, -262], [124, -234], [158, -206], [184, -170], [200, -126], [198, -82], [186, -42], [172, -14], [160, 0, "c"], [44, 0, "c"], [38, -12], [48, -22], [96, -28], [84, -60], [58, -98], [28, -132], [-6, -156], [-52, -170], [-60, -150], [-62, -100], [-64, -50], [-66, -18], [-58, -6], [-58, 0, "c"], [-120, 0, "c"], [-124, -10], [-112, -22], [-110, -70], [-112, -130], [-118, -186], [-124, -226], [-150, -270], [-170, -310], [-186, -322]]));
  // the far foreleg, just behind
  P.push(smooth([[2, -150], [4, -96], [2, -44], [0, -18], [8, -6], [6, 0, "c"], [-46, 0, "c"], [-48, -10], [-38, -20], [-38, -60], [-40, -116], [-44, -160]]));
  // the head: brow, a broad straight muzzle, the chin
  P.push(smooth([[-146, -406], [-162, -397], [-178, -386], [-196, -372], [-205, -362], [-210, -351], [-208, -342], [-206, -332], [-201, -321], [-190, -318], [-186, -310], [-180, -300], [-166, -292], [-150, -300], [-138, -330], [-132, -366], [-136, -392]]));
  P.push(smooth([[-134, -404], [-130, -422], [-118, -424], [-114, -408]]));
  // the mane: over the crown and down the back of the neck to the shoulder; a fringe down the chest
  const back = maneEdge([[-140, -410], [-128, -438], [-96, -458], [-56, -460], [-18, -442], [10, -412], [28, -374], [36, -332], [32, -292]], 11, 20, t, 93);
  const front = maneEdge([[-110, -196], [-130, -222], [-146, -248], [-158, -270], [-166, -288], [-170, -298]], 10, 10, t, 94);
  P.push(smooth([...back, [10, -250], [-40, -210], [-90, -186], ...front, [-148, -330], [-142, -376]]));
  // the tail along the rock, its tuft in front of the hind foot
  const tail = dense([[176, -24], [188, -8], [160, -4], [110, -6], [64, -10], [24 + sw, -14]], 8);
  P.push(ribbon(tail, 14, 9));
  const tp = tail[tail.length - 1];
  P.push(smooth([[tp[0] + 6, tp[1] - 8], [tp[0] - 10, tp[1] - 12], [tp[0] - 26, tp[1] - 4, "c"], [tp[0] - 10, tp[1] + 6], [tp[0] + 6, tp[1] + 6]]));
  return P;
};
// --- the ocean under a rising moon: broken swell crests that catch the light only near its path
const GOcean: GV = ({f, u, id}) => {
  const HOR = 560, mx = 1180, my = lerp(470, 430, ss(u));
  const crests = (() => {
    const out: {d: string; w: number; o: number}[] = [];
    for (let k = 0; k < 34; k++) {
      const v = k / 33, y0 = HOR + 4 + Math.pow(v, 1.75) * 520, amp = 0.6 + v * 6, ph = f * (0.03 + v * 0.05) + k * 1.7;
      let x = -120 + rnd(k, 101) * 120; const segs: string[] = [];
      while (x < W + 120) {
        const len = (50 + rnd(x + k * 13, 102) * 160) * (0.4 + v * 1.4), gap = (20 + rnd(x + k * 17, 103) * 90) * (0.4 + v * 1.2);
        const pts: number[][] = []; for (let i = 0; i <= 6; i++) { const xx = x + (len * i) / 6; pts.push([xx, y0 - Math.sin((i / 6) * Math.PI) * amp + Math.sin(xx / 140 + ph) * amp * 0.6]); }
        segs.push(lineD(pts)); x += len + gap;
      }
      out.push({d: segs.join(" "), w: 0.6 + v * 2.2, o: 0.4 + 0.45 * (1 - v)});
    }
    return out;
  })();
  return (
    <g>
      <defs>
        <Lin id={`${id}-sky`} user x1={0} y1={0} x2={0} y2={HOR} stops={[[0, "#05060F"], [0.45, "#0E1430"], [0.8, "#2A2A52"], [1, "#5A4466"]]}/>
        <Lin id={`${id}-sea`} user x1={0} y1={HOR} x2={0} y2={H} stops={[[0, "#3E3456"], [0.15, "#1E1C3C"], [1, "#07070F"]]}/>
        <Rad id={`${id}-moon`} stops={[[0, "#FFF8E6"], [0.8, "#FFF2D2"], [0.93, "#FFE8B8", 0.8], [1, "#FFE8B8", 0]]}/>
        <Rad id={`${id}-halo`} stops={soft("#FFE2A8", 0.38, 2.1)}/>
        <Rad id={`${id}-cl`} stops={[[0, "#1E1C40", 0.75], [0.6, "#1E1C40", 0.4], [1, "#1E1C40", 0]]}/>
        <Rad id={`${id}-path`} user cx={mx} cy={HOR} r={560} tr={`translate(${mx} ${HOR}) scale(0.5 1) translate(${-mx} ${-HOR})`} stops={[[0, "#FFE6B0", 0.4], [0.5, "#FFE6B0", 0.12], [1, "#FFE6B0", 0]]}/>
        <linearGradient id={`${id}-crest`} gradientUnits="userSpaceOnUse" x1={mx - 760} y1={0} x2={mx + 760} y2={0}><stop offset="0" stopColor="#8A86B8" stopOpacity={0.18}/><stop offset="0.38" stopColor="#FFE6B0" stopOpacity={0.5}/><stop offset="0.5" stopColor="#FFF0CC" stopOpacity={1}/><stop offset="0.62" stopColor="#FFE6B0" stopOpacity={0.5}/><stop offset="1" stopColor="#8A86B8" stopOpacity={0.18}/></linearGradient>
      </defs>
      <rect x={-100} y={-100} width={W + 200} height={HOR + 100} fill={`url(#${id}-sky)`}/>
      <Stars f={f} n={260} yMax={HOR - 40}/>
      <Glow x={mx} y={my} r={520} fill={`${id}-halo`}/>
      <ellipse cx={mx - 300} cy={my + 46} rx={420} ry={16} fill={`url(#${id}-cl)`}/>
      <ellipse cx={mx + 340} cy={my - 56} rx={300} ry={12} fill={`url(#${id}-cl)`}/>
      <circle cx={mx} cy={my} r={58} fill={`url(#${id}-moon)`}/>
      <rect x={-100} y={HOR} width={W + 200} height={H - HOR + 100} fill={`url(#${id}-sea)`}/>
      <rect x={mx - 600} y={HOR} width={1200} height={H - HOR} fill={`url(#${id}-path)`}/>
      {crests.map((c, k) => <path key={k} d={c.d} fill="none" stroke={`url(#${id}-crest)`} strokeWidth={c.w} strokeLinecap="round" opacity={c.o}/>)}
      {Array.from({length: 140}, (_, i) => { const v = Math.pow(rnd(i, 64), 1.4), y = HOR + 3 + v * 500, spread = 16 + v * 380, x = mx + (rnd(i, 65) - 0.5) * spread * (rnd(i, 66) < 0.75 ? 1 : 1.8), w = 5 + v * 46 * rnd(i, 67), o = Math.max(0, Math.sin(f / (4 + rnd(i, 68) * 6) + i * 2.1)); return o > 0.15 ? <rect key={i} x={x - w / 2} y={y} width={w} height={0.8 + v * 2.2} rx={1} fill="#FFF4D8" opacity={o * (1 - v * 0.5)}/> : null; })}
      <Rimmed paths={[smooth([[-60, 1100, "c"], [-60, 900], [80, 880], [160, 900], [260, 930], [330, 980], [380, 1040], [400, 1100, "c"]]), smooth([[1640, 1100, "c"], [1700, 1010], [1790, 980], [1880, 990], [1980, 960], [1980, 1100, "c"]])]} fill="#0A0812" light={[mx - 900, my - 900]} w={2} rim="#E8D2A8"/>
    </g>
  );
};
const ROCK = smooth([[560, 1100, "c"], [600, 860], [660, 760], [720, 712], [800, 690], [900, 682], [1000, 684, "c"], [1080, 676], [1180, 680], [1260, 700], [1330, 740], [1400, 800], [1470, 860], [1560, 900], [1700, 930], [1980, 950], [1980, 1100, "c"]]);
const ROCK2 = smooth([[-60, 1100, "c"], [-60, 920], [120, 900], [300, 920], [460, 960], [620, 1010], [700, 1100, "c"]]);
const GLion: GV = ({f, u, id, mood}) => {
  const sy = lerp(560, 530, ss(u));
  const grass = (() => { const P: string[] = []; const tuft = (x: number, y: number, h: number, i: number) => { for (let k = 0; k < 7; k++) { const a = -0.9 + k * 0.3 + (rnd(i * 7 + k, 73) - 0.5) * 0.3 + Math.sin(f / 30 + i + k * 0.4) * 0.05, L = h * (0.5 + 0.6 * rnd(i * 7 + k, 72)); P.push(ribbon([[x + k * 2, y], [x + k * 2 + Math.sin(a) * L * 0.4, y - L * 0.55], [x + k * 2 + Math.sin(a) * L * 1.1, y - L]], 3.2, 0.3)); } };
    for (let i = 0; i < 16; i++) { const x = 1420 + i * 34 + rnd(i, 71) * 20; tuft(x, 900 + (x - 1420) * 0.06 + 8, 34 + rnd(i, 74) * 30, i); }
    for (let i = 0; i < 9; i++) { const x = 20 + i * 60 + rnd(i, 75) * 20; tuft(x, 930 + Math.abs(x - 240) * 0.04, 30 + rnd(i, 76) * 26, i + 40); }
    return P.join(" "); })();
  const strata = "M 640 820 Q 760 800 900 810 M 700 900 Q 860 880 1040 896 M 1180 740 Q 1260 760 1320 800 M 820 980 Q 980 960 1160 990 M 1060 720 Q 1140 716 1200 730";
  return (
    <g>
      <Sky mood={mood && mood !== "night" ? mood : "dusk"} sun={[1000, sy]} sunR={200} f={f} rays={0.5} id={id + "s"}/>
      <Rimmed paths={[ROCK2]} fill="#1A0E1E" light={[1, -0.6]} w={2} rim="#FFB874"/>
      <Rimmed paths={[ROCK, smooth([[860, 690], [880, 650], [940, 630], [1010, 636], [1060, 660], [1080, 684]])]} fill="#170C1C" light={[0, -1]} w={2.6} rim="#FFC27A"/>
      <path d={strata} fill="none" stroke="#E8A06A" strokeWidth={1.2} opacity={0.22}/>
      <g transform="translate(1010 686) scale(1.12)"><Rimmed paths={LION(f)} fill="#140A18" light={[0.15, -1]} w={3.4} rim="#FFD08A"/></g>
      <Rimmed paths={[grass]} fill="#120A16" light={[0, -1]} w={1.4} rim="#FFC27A"/>
      <Flock f={f + 900} light={[0, -1]} y={150} count={4} scale={0.24} seed={6}/>
    </g>
  );
};
// --- silence (fix round 1: an image, not an empty sky): a still lake under the warm moon; on the far bank a small shrine
// with a lamp that does not flicker and a few trees; in front a closed lotus bud (the secret kept) on the still water,
// everything doubled in it.
const GSilence: GV = ({f, u, id}) => {
  const WL = 652, FG = 930, moon: [number, number] = [1420, 250];
  const sh = shrine({x: 640, y: WL - 2, h: 104, flag: true, t: f * 0.3, wind: 0.2});
  const bank: Item[] = [
    smooth([[-80, WL + 2, "c"], [-80, WL - 14], [200, WL - 20], [520, WL - 16], [760, WL - 22], [1000, WL - 12], [1300, WL - 8], [1600, WL - 16], [2000, WL - 10], [2000, WL + 2, "c"]], {wind: "cw"}),
    ...peepal({x: 420, y: WL - 14, h: 190, seed: 21, t: f * 0.3, detail: 0.7}), ...neem({x: 880, y: WL - 16, h: 120, seed: 23, t: f * 0.3, detail: 0.7}),
    ...palmyra({x: 1120, y: WL - 10, h: 210, seed: 25, t: f * 0.3}), ...palmyra({x: 1185, y: WL - 9, h: 170, seed: 26, t: f * 0.3}), ...neem({x: 1660, y: WL - 14, h: 130, seed: 27, t: f * 0.3, detail: 0.6}), ...sh,
  ];
  const lotus: Item[] = [...lotusBud({x: 1010, y: FG, h: 300, seed: 31, t: f * 0.4, open: 0.05}), ...lotusLeaf({x: 860, y: FG + 6, r: 92, seed: 32, t: f * 0.4}), ...lotusLeaf({x: 1190, y: FG + 4, r: 70, seed: 33, t: f * 0.4}), ...lotusLeaf({x: 1340, y: FG + 10, r: 60, seed: 34, raised: false}), ...lotusLeaf({x: 700, y: FG + 14, r: 50, seed: 35, raised: false})];
  const lampAt = sh.at.lamp;
  return (
    <g>
      <defs>
        <Lin id={`${id}-water`} user x1={0} y1={WL} x2={0} y2={H} stops={[[0, "#9A5A52"], [0.06, "#5A3452"], [0.3, "#22183C"], [1, "#0A0816"]]}/>
        <linearGradient id={`${id}-fade`} gradientUnits="userSpaceOnUse" x1={0} y1={WL} x2={0} y2={WL + 260}><stop offset="0" stopColor="#FFF" stopOpacity={0.8}/><stop offset="1" stopColor="#FFF" stopOpacity={0}/></linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x={-100} y={WL} width={W + 200} height={440}><rect x={-100} y={WL} width={W + 200} height={440} fill={`url(#${id}-fade)`}/></mask>
        <Rad id={`${id}-moonroad`} stops={soft("#FFE8B8", 0.5, 2)}/>
        <Rad id={`${id}-lamp`} stops={soft("#FFC870", 0.9, 2.1)}/>
      </defs>
      <Sky mood="night" sun={moon} sunR={34} f={f} rays={0} clouds={0.35} id={id + "s"} horizon={WL}/>
      <rect x={-100} y={WL} width={W + 200} height={H - WL + 100} fill={`url(#${id}-water)`}/>
      <ellipse cx={moon[0]} cy={WL + 120} rx={70} ry={150} fill={`url(#${id}-moonroad)`} opacity={0.5}/>
      {Array.from({length: 24}, (_, i) => { const vv = Math.pow(rnd(i, 73), 1.3), y = WL + 6 + vv * 400, w = 8 + (20 + 70 * vv) * rnd(i, 74), x = moon[0] + (rnd(i, 75) - 0.5) * (24 + vv * 120); return <rect key={"g" + i} x={x - w / 2} y={y} width={w} height={0.8 + vv * 1.6} fill="#FFF0D0" opacity={(0.35 + 0.45 * Math.max(0, Math.sin(f / (9 + rnd(i, 76) * 7) + i))) * (1 - vv * 0.5)}/>; })}
      <g mask={`url(#${id}-m)`}><g transform={`translate(0 ${2 * WL}) scale(1 -1)`}>{bank.map((it, i) => <path key={i} d={typeof it === "string" ? it : it.d} fill="#160C1E"/>)}</g></g>
      {Array.from({length: 22}, (_, i) => { const y = WL + 6 + Math.pow(rnd(i, 70), 1.6) * 380, w = 60 + rnd(i, 71) * 300; return <rect key={i} x={rnd(i, 72) * 2000 - 100} y={y} width={w} height={0.8 + (y - WL) / 260} fill="#B07870" opacity={0.18}/>; })}
      <circle cx={lampAt[0]} cy={lampAt[1] - 6} r={34} fill={`url(#${id}-lamp)`}/>
      <rect x={lampAt[0] - 8} y={lampAt[1] - 22} width={16} height={24} fill="#3A1E1A"/>
      <Flame x={lampAt[0]} y={lampAt[1] - 2} h={13} f={f} seed={5} calm={1} halo={0.8}/>
      <Rimmed paths={bank} light={[moon[0] - 900, moon[1] - 560]} w={1.4} rim="#F2D3A0" fill="#170D1F"/>
      {/* the lotus doubled in the still water */}
      <g transform={`translate(0 ${2 * FG + 8}) scale(1 -1)`} opacity={0.45}>{lotus.map((it, i) => <path key={i} d={typeof it === "string" ? it : it.d} fill="#120A1A"/>)}</g>
      <Rimmed paths={lotus} light={[moon[0] - 1010, moon[1] - 760]} w={2.4} rim="#FFE2B0" fill="#120A18"/>
      <rect x={-100} y={FG + 9} width={W + 200} height={2} fill="#C8907A" opacity={0.12}/>
    </g>
  );
};
// --- the letter A (10.33): the first letter, written in gold on the back of a stone niche and lit by one still lamp on
// its sill. The letter is the vignette's image, set in the film's Devanagari (Tiro, gold) and never scaled by a push.
const GLetter: React.FC<{f: number; u: number; id: string; text: string}> = ({f, u, id, text}) => {
  const x = 960, sill = 846, w = 430, h = 430;
  const nc = niche({x, y: sill, w, h, wall: [-120, -120, 2040, 1200], seed: 4});
  const [wx, wy] = diyaWick(x, sill + 2, 1.35);
  const lamp: [number, number] = [wx, wy - 18];
  return (
    <g>
      <defs>
        <Lin id={`${id}-back`} user x1={0} y1={sill - h} x2={0} y2={sill} stops={[[0, "#2A1A30"], [0.55, "#5A3036"], [1, "#9A5A3E"]]}/>
        <Rad id={`${id}-g`} user cx={lamp[0]} cy={lamp[1]} r={520} stops={[[0, "#FFD9A0", 0.62], [0.25, "#F2A65A", 0.3], [0.6, "#A8473A", 0.08], [1, "#A8473A", 0]]}/>
        <Lin id={`${id}-wall`} user x1={0} y1={0} x2={0} y2={H} stops={[[0, "#0B0718"], [0.6, "#140D24"], [1, "#1C1228"]]}/>
      </defs>
      <rect x={-120} y={-120} width={W + 240} height={H + 240} fill={`url(#${id}-wall)`}/>
      {/* the back of the niche, warm where the lamp is, and the letter on it */}
      <rect x={x - w / 2 - 2} y={sill - h * 1.1} width={w + 4} height={h * 1.1 + 4} fill={`url(#${id}-back)`}/>
      <text x={x} y={sill - 120} textAnchor="middle" fontFamily={SA} fontSize={300} fill="none" stroke="#F2C46A" strokeWidth={14} strokeLinejoin="round" opacity={0.08}>{text}</text>
      <text x={x} y={sill - 120} textAnchor="middle" fontFamily={SA} fontSize={300} fill="url(#k-gold)">{text}</text>
      <Rimmed paths={nc} point={lamp} light={[0, -1]} w={2.4} rim="#FFC27A" fill="#150C1C"/>
      <rect x={-120} y={-120} width={W + 240} height={H + 240} fill={`url(#${id}-g)`}/>
      <Diya x={x} y={sill + 2} s={1.35} f={f} calm={0.97} halo={0.9}/>
      <Dust f={f} sun={lamp} n={36} y0={360} y1={860} color="#FFE2A8"/>
    </g>
  );
};
const GITEMS: Record<string, GV> = {sun: GSun, peak: GPeak, river: GRiver, ashvattha: GTree, ocean: GOcean, lion: GLion, silence: GSilence};
const GALIAS: Record<string, string> = {surya: "sun", light: "sun", himalaya: "peak", meru: "peak", mountain: "peak", mountains: "peak", ganga: "river", ganges: "river", tree: "ashvattha", peepal: "ashvattha", pipal: "ashvattha", sea: "ocean", lions: "lion", beasts: "lion", a: "letter", letters: "letter", secrets: "silence"};
// One vignette in place: its own slow push (the letter is never scaled).
const Vignette: React.FC<{k: string; f: number; lu: number; id: string; s: any}> = ({k, f, lu, id, s}) => {
  if (k === "letter") return <GLetter f={f} u={lu} id={id} text={String(s.text)}/>;
  const V = GITEMS[k], z = 1 + 0.06 * lu;
  return <g transform={`translate(960 560) scale(${z}) translate(-960 -560)`}><V f={f} u={lu} id={id} mood={s.mood ? moodOf(s.mood, "dusk") : undefined}/></g>;
};
// Glories: the vignettes follow one another through a wipe of warm mist (fix round 1: no crossfades, no ghosts): the next
// vignette is uncovered behind a soft edge that sweeps across the frame, and a dense band of lit mist rides that edge,
// so the two shots only meet inside the mist. Three vignettes per 10 s when s.items does not choose them.
const Glories: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const id = useUid("czg");
  if (s.variant === "sparks") return <Sparks s={s} n={n} f={f} id={id}/>;
  const req: string[] = (Array.isArray(s.items) ? s.items : []).map((x: any) => String(x).toLowerCase().trim()).map((x: string) => GALIAS[x] || x).filter((x: string) => GITEMS[x] || (x === "letter" && s.text));
  const count = Math.max(3, Math.min(6, Math.round(n / 100)));
  const items = req.length ? req : ["sun", "peak", "river", "ashvattha", "ocean", "lion"].slice(0, count);
  const m = items.length, seg = n / m, T = Math.min(42, seg * 0.42);
  const labels: string[] = Array.isArray(s.labels) ? s.labels : [];
  // the current vignette and, near a boundary, the wipe into the next one
  const i = Math.min(m - 1, Math.floor(f / seg)), b = (i + 1) * seg, p = i < m - 1 ? clamp01((f - (b - T * 0.55)) / T) : 0;
  const j = p > 0 ? i + 1 : -1, dir = i % 2 ? -1 : 1, e = p * p * (3 - 2 * p);
  const edge = dir > 0 ? lerp(-420, W + 420, e) : lerp(W + 420, -420, e);
  const lu = (k: number) => clamp01((f - k * seg + T / 2) / (seg + T));
  const gx = (o: number) => edge + dir * o;
  return (
    <Frame f={f} zoom={1} overlay={labels.map((t, k) => t ? <Label key={k} en={String(t)} f={f} at={k * seg + (k ? T * 0.5 : 6)} until={(k + 1) * seg + (k < m - 1 ? T * 0.3 : 0)}/> : null)}>
      <defs>
        <linearGradient id={`${id}-wm`} gradientUnits="userSpaceOnUse" x1={gx(50)} y1={0} x2={gx(-50)} y2={dir * 18}><stop offset="0" stopColor="#000"/><stop offset="1" stopColor="#FFF"/></linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x={-200} y={-200} width={W + 400} height={H + 400}><rect x={-200} y={-200} width={W + 400} height={H + 400} fill={`url(#${id}-wm)`}/></mask>
        <linearGradient id={`${id}-mist`} gradientUnits="userSpaceOnUse" x1={gx(-380)} y1={0} x2={gx(380)} y2={dir * 120}>
          <stop offset="0" stopColor="#C8A0B0" stopOpacity={0}/><stop offset="0.24" stopColor="#D6AEB4" stopOpacity={0.45}/><stop offset="0.4" stopColor="#E6C0B0" stopOpacity={0.86}/><stop offset="0.5" stopColor="#ECC8B4" stopOpacity={0.93}/><stop offset="0.6" stopColor="#E0B6B4" stopOpacity={0.86}/><stop offset="0.76" stopColor="#C8A0B4" stopOpacity={0.45}/><stop offset="1" stopColor="#B894B0" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <Vignette k={items[i]} f={f} lu={lu(i)} id={`${id}-${i}`} s={s}/>
      {j >= 0 ? <g mask={`url(#${id}-m)`}><Vignette k={items[j]} f={f} lu={lu(j)} id={`${id}-${j}`} s={s}/></g> : null}
      {j >= 0 ? <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={`url(#${id}-mist)`} opacity={Math.min(1, Math.sin(Math.PI * p) * 1.6)}/> : null}
    </Frame>
  );
};
// --- sparks (10.41), fix round 1: one fire in a Vedic kunda (a square pit stepped inward and down, seen from a low
// angle: the far inner wall's steps glow, the near lip is dark against the flames) under the open roof of a yajna
// pavilion whose carved pillars catch the firelight; trees on a warm horizon. The sparks rise from the fire in a column
// that widens and slows as it climbs, and each one settles into the sky as a star, so the stars gather above the fire.
const NSPARK = 150;
const kundaParts = (cx: number, yf: number, yn: number, wf: number, wn: number) => {
  // the far inner wall: three risers stepping in and down, each with a lit tread; the side walls; the near lip's face
  const steps: {d: string; k: number}[] = [], dy = (yn - yf) / 3.4;
  for (let k = 0; k < 3; k++) {
    const y0 = yf + k * dy, inset = k * wf * 0.09, x0 = cx - wf + inset, x1 = cx + wf - inset;
    steps.push({d: polyD([[x0, y0], [x1, y0], [x1 - wf * 0.03, y0 + dy * 0.72], [x0 + wf * 0.03, y0 + dy * 0.72]], true, "cw"), k: 0});
    steps.push({d: polyD([[x0 + wf * 0.03, y0 + dy * 0.72], [x1 - wf * 0.03, y0 + dy * 0.72], [x1 - wf * 0.09, y0 + dy], [x0 + wf * 0.09, y0 + dy]], true, "cw"), k: 1});
  }
  const sideL = polyD([[cx - wn, yn], [cx - wf, yf], [cx - wf * 0.73, yf + dy * 3], [cx - wn * 0.8, yn]], true, "cw");
  const sideR = polyD([[cx + wn, yn], [cx + wn * 0.8, yn], [cx + wf * 0.73, yf + dy * 3], [cx + wf, yf]], true, "cw");
  // the raised border (mekhala) all round the mouth, its near face in brick
  const rim = smooth([[cx - wn - 18, yn + 2, "c"], [cx - wf - 12, yf - 3, "c"], [cx + wf + 12, yf - 3, "c"], [cx + wn + 18, yn + 2, "c"], [cx + wn + 18, yn + 20, "c"], [cx - wn - 18, yn + 20, "c"]], {wind: "cw"});
  const mouth = polyD([[cx - wn, yn], [cx - wf, yf], [cx + wf, yf], [cx + wn, yn]], true, "ccw");
  const courses: string[] = [];
  for (let r = 0; r < 3; r++) { const yy = yn + 4 + r * 7; courses.push(hbox(cx - wn - 16, yy, cx + wn + 16, yy + 0.8)); for (let x = cx - wn - 16 + (r % 2) * 14; x < cx + wn + 16; x += 28) courses.push(hbox(x, yy, x + 0.8, yy + 5)); }
  const near = [0, 1, 2].map((k) => polyD([[cx - wn - 6 - k * 14, yn + 1 + k * 7], [cx - wn + 4 - k * 14, yn - 1 + k * 7], [cx + wn - 4 + k * 14, yn - 1 + k * 7], [cx + wn + 6 + k * 14, yn + 1 + k * 7], [cx + wn + 6 + k * 14, yn + 8 + k * 7], [cx - wn - 6 - k * 14, yn + 8 + k * 7]], true, "cw"));
  return {steps, sideL, sideR, rim: rim + " " + mouth, near, mouthFill: polyD([[cx - wn, yn + 2], [cx - wf, yf], [cx + wf, yf], [cx + wn, yn + 2]], true, "cw"), courses: courses.join(" ")};
};
const Sparks: React.FC<{s: any; n: number; f: number; id: string}> = ({s, n, f, id}) => {
  const HOR = 856, cx = 960, yf = 872, yn = 918, fire: [number, number] = [cx, 820], top: [number, number] = [cx, 742];
  const labels: string[] = Array.isArray(s.labels) ? s.labels : [];
  const kd = kundaParts(cx, yf, yn, 176, 214);
  const flick = 0.9 + 0.07 * Math.sin(f / 4) + 0.04 * Math.sin(f / 1.7);
  // the pavilion: three carved pillars a side receding to the fire, a beam along each colonnade
  const cols: [number, number, number][] = [[250, 1016, 480], [528, 924, 300], [704, 888, 214]];
  const pil: Item[] = [], beams: string[] = [];
  for (const sd of [-1, 1]) {
    cols.forEach(([x, y, h]) => pil.push(...pillar({x: cx + sd * (cx - x), y, h})));
    const [nx, ny, nh] = cols[0], [fx, fy, fh] = cols[2], X = (x: number) => cx + sd * (cx - x);
    beams.push(polyD([[X(fx + 40), fy - fh - 2], [X(fx - 26), fy - fh - 2], [X(nx - 120), ny - nh - 4], [X(nx - 120), ny - nh - 34], [X(fx - 26), fy - fh - 16], [X(fx + 40), fy - fh - 16]], true, "cw"));
  }
  const trees: Item[] = [...peepal({x: 150, y: HOR + 6, h: 250, seed: 41, t: f * 0.4, detail: 0.7, fill: "#1E1228"}), ...khejri({x: 1790, y: HOR + 6, h: 200, seed: 43, t: f * 0.4, fill: "#1E1228"}), ...palmyra({x: 1560, y: HOR + 4, h: 230, seed: 44, t: f * 0.4, fill: "#1E1228"})];
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.05)} cx={960} cy={640} overlay={labels[0] ? <Label en={String(labels[0])} f={f} at={18} until={n}/> : null}>
      <defs>
        <Rad id={`${id}-fire`} stops={[[0, "#FFE4A0", 0.7], [0.1, "#FFB45A", 0.42], [0.26, "#E0602E", 0.18], [0.55, "#8E2A2A", 0.05], [1, "#8E2A2A", 0]]}/>
        <Rad id={`${id}-sp`} stops={soft("#FFC870", 0.9, 2.2)}/>
        <Rad id={`${id}-st`} stops={soft("#FFF6E0", 0.85, 2.4)}/>
        <Rad id={`${id}-spk`} stops={[[0, "#FFFFFF", 1], [0.3, "#FFF6DC", 0.7], [1, "#FFF0C8", 0]]}/>
        <Lin id={`${id}-gnd`} user x1={0} y1={HOR} x2={0} y2={H} stops={[[0, "#2C1828"], [0.25, "#1A0E1C"], [1, "#07040C"]]}/>
        <Rad id={`${id}-pool`} stops={soft("#F2944A", 0.7, 1.9)}/>
        <Lin id={`${id}-riser`} user x1={0} y1={yf} x2={0} y2={yn} stops={[[0, "#B8502C"], [1, "#FF9A48"]]}/>
        <Lin id={`${id}-side`} user x1={0} y1={yf} x2={0} y2={yn} stops={[[0, "#5A2224"], [1, "#B0482A"]]}/>
      </defs>
      <Sky mood="night" sun={null} f={f} horizon={HOR} band={0.75} stars={0.3} clouds={0.3} id={id + "k"}/>
      {/* the sparks become stars: each rises in the column, slows as it widens out, and settles */}
      {Array.from({length: NSPARK}, (_, i) => {
        const t0 = -70 + rnd(i, 81) * (n - 10), dur = 95 + rnd(i, 82) * 70, life = (f - t0) / dur;
        if (life <= 0) return null;
        const ty = 70 + Math.pow(rnd(i, 84), 0.9) * 470, tx = cx + (rnd(i, 83) - 0.5) * (200 + (560 - ty) * 2.9);
        const at = (p: number): [number, number] => {
          const e = 1 - Math.pow(1 - clamp01(p), 2.4), y = top[1] + (ty - top[1]) * e, hf = clamp01((top[1] - y) / (top[1] - ty));
          return [top[0] + (rnd(i, 85) - 0.5) * 30 + (tx - top[0]) * Math.pow(hf, 1.8) + Math.sin(p * 9 + i) * 10 * (1 - p), y];
        };
        const big = Math.pow(rnd(i, 86), 4);
        if (life < 1) {
          const [x, y] = at(life), sp = Math.pow(1 - life, 1.4), t1 = at(life - 0.008 - 0.02 * sp * sp), t2 = at(life - 0.016 - 0.04 * sp * sp);
          const col = mix("#FF8A3A", "#FFF4D8", Math.pow(life, 0.8)), fl = 0.75 + 0.25 * Math.sin(f * 0.9 + i * 3);
          return <g key={i} opacity={fl}>
            {sp > 0.35 ? <path d={ribbon([[x, y], t1, t2], 1.8 + big * 1.4, 0.2)} fill={col} opacity={0.55 * sp}/> : null}
            <circle cx={x} cy={y} r={5 + big * 8} fill={`url(#${id}-sp)`} opacity={0.4 + 0.3 * sp}/>
            <circle cx={x} cy={y} r={1.1 + big * 1.1} fill={col}/>
          </g>;
        }
        const [x, y] = at(1), tw = 0.7 + 0.3 * Math.sin(f / (9 + rnd(i, 87) * 12) + i), flash = clamp01(1 - (life - 1) * 5);
        return <g key={i} opacity={tw}>
          <circle cx={x} cy={y} r={(4 + big * 12) * (1 + 0.8 * flash)} fill={`url(#${id}-st)`} opacity={0.55 + 0.35 * flash}/>
          <circle cx={x} cy={y} r={0.9 + big * 1.5} fill="#FFFBF0"/>
          {big > 0.4 ? <path d={spikes(4, 10 + 16 * big, 0.6)} transform={`translate(${n1(x)} ${n1(y)})`} fill={`url(#${id}-spk)`} opacity={0.7}/> : null}
        </g>;
      })}
      <Rimmed paths={trees} light={[0, -1]} w={1.4} rim="#9A5A6A" fill="#1E1228"/>
      <rect x={-200} y={HOR} width={W + 400} height={H - HOR + 200} fill={`url(#${id}-gnd)`}/>
      <ellipse cx={cx} cy={yn + 6} rx={760} ry={150} fill={`url(#${id}-pool)`} opacity={0.75 * flick}/>
      <Glow x={fire[0]} y={fire[1] - 40} r={760} ry={560} fill={`${id}-fire`} o={0.8 * flick}/>
      {/* the pavilion picked out by the fire */}
      <Rimmed paths={[...beams.map((d) => ({d, c: [cx, 700] as [number, number]})), ...pil]} point={fire} light={[0, -1]} w={2.6} rim="#FFB060" fill="#150A16"/>
      {/* the kunda: inner wall steps and side walls lit from within, the fire, then the near lip in front */}
      <path d={kd.mouthFill} fill="#3A1416"/>
      {kd.steps.map((st, k) => <path key={k} d={st.d} fill={st.k ? "#FFC27A" : `url(#${id}-riser)`} opacity={st.k ? 0.85 : 1}/>)}
      <path d={kd.sideL} fill={`url(#${id}-side)`}/><path d={kd.sideR} fill={`url(#${id}-side)`}/>
      <Rimmed paths={[kd.rim]} point={fire} light={[0, -1]} w={2.4} rim="#FFB060" fill="#1A0C14"/>
      <Fire x={cx} y={yn - 8} w={92} h={196} f={f} k={1.05} calm={0.25} sparks={0} halo={1}/>
      <Rimmed paths={[...kd.near, {d: kd.courses, fill: "#3A1A1E", rim: false}]} light={[0, -1]} w={1.8} rim="#FFB060" fill="#1A0C14"/>
    </Frame>
  );
};

// ================================================================================================================
// FIELD (Gita 13): the field and the knower of the field. Fix round 1 (the art director): golden dusk as in ref-field
// (plum sky, an amber horizon), the low sun the one steady light that never moves while the field below changes:
// flooded paddies mirror the sky between clumps of seedlings, the rice grows and ripens into drooping panicles (a curved
// stalk, grains hanging on one side) backlit in gold, a harvest sweeps across behind a drift of lit chaff and leaves
// conical thatched stacks with a centre pole; raised bunds catch the light; a khejri and a hut on the bund give scale.
// s.variant "ripe" | "growth" | "harvest" | "bare" (seedlings in water) holds one stage for the whole beat.
// ================================================================================================================
const FH = 602, FA = 478;                           // the horizon, and the depth scale: y = FH + FA * q (q = 1 / distance)
const fy = (q: number) => FH + FA * q, fx = (X: number, q: number) => 960 + X * q;
const FROWS = Array.from({length: 26}, (_, k) => 0.035 + Math.pow(k / 25, 1.7) * 1.02);
const FBUNDS = [-760, 380, 1240];                   // bunds running away from us (ground X)
const FCROSS = [0.16, 0.42];                        // bunds across the field (depth q)
const onBund = (X: number, q = 0.5) => FBUNDS.some((b) => Math.abs(X - (b + 30 * Math.sin(q * 7 + b * 0.01) + 14 * Math.sin(q * 19 + b))) < 34);
// haystacks stand in the harvested field: [X, q]
const FSTACKS: [number, number][] = [[-1380, 0.14], [-640, 0.17], [-120, 0.15], [700, 0.18], [1720, 0.2], [-980, 0.3], [-330, 0.34], [180, 0.29], [820, 0.4], [-760, 0.56], [1420, 0.5], [-1500, 0.72], [600, 0.78]];
type FS = {g: number; ripe: number; front: number; water: number};
const fieldState = (u: number, v: string): FS => {
  if (v === "ripe") return {g: 1, ripe: 1, front: -1e4, water: 0};
  if (v === "growth") return {g: 0.18 + 0.82 * ss(u * 1.1), ripe: span(u, 0.6, 0.95), front: -1e4, water: 1 - span(u, 0.3, 0.8)};
  if (v === "harvest") return {g: 1, ripe: 1, front: lerp(-400, 2400, ss(u)), water: 0};
  if (v === "bare") return {g: 0.2 + 0.08 * ss(u), ripe: 0, front: -1e4, water: 1};
  return {g: 0.18 + 0.52 * ss(u / 0.32) + 0.3 * span(u, 0.32, 0.5), ripe: span(u, 0.3, 0.5), front: u < 0.5 ? -1e4 : lerp(-400, 2400, ss((u - 0.5) / 0.32)), water: 1 - span(u, 0.18, 0.46)};
};
// the harvest front: a diagonal that runs left to right; a point is cut when it is behind (left of) the front
const cutAt = (front: number, x: number, y: number) => x < front - (y - FH) * 0.55;
const haystack = (x: number, y: number, w: number, hs: number): {S: string; straw: string} => {
  // a cone of thatch: straight flanks with a slight swell, a flared skirt at the foot, a twisted cap and the centre pole
  const S = smooth([[x - w * 0.5, y + 1, "c"], [x - w * 0.47, y - hs * 0.08], [x - w * 0.4, y - hs * 0.26], [x - w * 0.27, y - hs * 0.55], [x - w * 0.12, y - hs * 0.82], [x - w * 0.04, y - hs * 0.95, "c"], [x + w * 0.04, y - hs * 0.95, "c"], [x + w * 0.12, y - hs * 0.82], [x + w * 0.27, y - hs * 0.55], [x + w * 0.4, y - hs * 0.26], [x + w * 0.47, y - hs * 0.08], [x + w * 0.5, y + 1, "c"]], {wind: "cw"})
    + " " + hbox(x - Math.max(0.6, w * 0.014), y - hs * 1.2, x + Math.max(0.6, w * 0.014), y - hs * 0.9)
    + " " + smooth([[x - w * 0.07, y - hs * 0.93, "c"], [x - w * 0.03, y - hs * 1.02], [x, y - hs * 1.06, "c"], [x + w * 0.03, y - hs * 1.02], [x + w * 0.07, y - hs * 0.93, "c"]], {wind: "cw"});
  const st: string[] = [];
  for (let i = 0; i < 11; i++) { const a = (i / 10 - 0.5) * 1.7, x0 = x + a * w * 0.05, y0 = y - hs * 0.92, x1 = x + a * w * 0.5, y1 = y - hs * 0.04 * (1 - Math.abs(a)); st.push(`M ${n1(x0)} ${n1(y0)} Q ${n1(x + a * w * 0.3)} ${n1(y - hs * 0.5)} ${n1(x1)} ${n1(y1)}`); }
  // a band of rope round the middle
  st.push(`M ${n1(x - w * 0.33)} ${n1(y - hs * 0.4)} Q ${n1(x)} ${n1(y - hs * 0.34)} ${n1(x + w * 0.33)} ${n1(y - hs * 0.4)}`);
  return {S, straw: st.join(" ")};
};
const FieldScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const id = useUid("czf");
  const u = clamp01(f / Math.max(1, n));
  const v: string = ["ripe", "growth", "harvest", "bare"].includes(s.variant) ? s.variant : "cycle";
  const st = fieldState(u, v);
  const sun: [number, number] = [960, 590];
  const wind = (x: number, q: number) => Math.sin(x / 230 - f / 24 + q * 6) * 0.6 + Math.sin(x / 110 - f / 14 + q * 2.7) * 0.25;
  // the rows, far to near: blades (strokes), the grown mass, panicles (stalk + hanging grains), stubble, reflections
  const rows = FROWS.map((q, k) => {
    const y = fy(q), gap = Math.max(6, 34 * q), hgt = 112 * q * st.g, blades: string[] = [], pan: string[] = [], stub: string[] = [], refl: string[] = [], mass: Pt[] = [];
    const nB = q < 0.2 ? 3 : 5, ripe = st.ripe;
    let any = false;
    for (let x = -40 + rnd(k, 110) * gap, i = 0; x < W + 40; x += gap * (0.8 + 0.4 * rnd(i, 111 + k)), i++) {
      const X = (x - 960) / q;
      if (onBund(X, q)) continue;
      const yy = y + (rnd(i, 112 + k) - 0.5) * 3 * q, h = hgt * (0.85 + 0.3 * rnd(i, 113 + k)), w = wind(x, q);
      if (cutAt(st.front, x, yy)) { const sh = Math.max(1.2, 112 * q * 0.1); stub.push(`M ${n1(x - 1.5 * q)} ${n1(yy)} l ${n1(-0.8 * q)} ${n1(-sh)} M ${n1(x + 1.5 * q)} ${n1(yy)} l ${n1(0.6 * q)} ${n1(-sh * 0.8)}`); continue; }
      any = true;
      mass.push([x, yy - h * (0.42 + 0.1 * rnd(i, 116))]);
      for (let b = 0; b < nB; b++) {
        const a = (b / (nB - 1) - 0.5) * 1.1 + w * 0.18 * st.g, L = h * (0.75 + 0.3 * rnd(i * 7 + b, 114));
        const ex = x + Math.sin(a) * L + a * L * 0.25, ey = yy - Math.cos(a) * L * 0.95;
        blades.push(`M ${n1(x)} ${n1(yy)} Q ${n1(x + Math.sin(a) * L * 0.3)} ${n1(yy - L * 0.6)} ${n1(ex)} ${n1(ey)}`);
        if (st.water > 0.05 && q > 0.12) refl.push(`M ${n1(x)} ${n1(yy + 1)} Q ${n1(x + Math.sin(a) * L * 0.3)} ${n1(yy + L * 0.5)} ${n1(ex)} ${n1(yy + (yy - ey) * 0.85)}`);
      }
      if (ripe > 0.02) {
        const nP = q < 0.2 ? 1 : 2;
        for (let p = 0; p < nP; p++) {
          const d = (rnd(i * 3 + p, 117 + k) < 0.5 ? -1 : 1) * (0.6 + 0.4 * rnd(i, 118)) + w * 0.3, sx = x + d * h * 0.06, sy = yy - h * (0.95 + 0.12 * rnd(i * 3 + p, 119));
          const L = h * 0.55 * (0.5 + 0.5 * ripe), cx = sx + d * L * 0.55, cy = sy - L * 0.32, ex = sx + d * L * 0.85, ey = sy + L * 0.35 * (0.4 + 0.6 * ripe);
          pan.push(`M ${n1(x)} ${n1(yy - h * 0.5)} Q ${n1(x + d * h * 0.02)} ${n1(sy + h * 0.2)} ${n1(sx)} ${n1(sy)} Q ${n1(cx)} ${n1(cy)} ${n1(ex)} ${n1(ey)}`);
          const nG = q < 0.2 ? 3 : 6;
          for (let g = 1; g <= nG; g++) {
            const t = 0.25 + 0.75 * (g / nG), bx = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cx + t * t * ex, by = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cy + t * t * ey;
            const gl = h * 0.11 * ripe * (1 - 0.3 * t);
            pan.push(`M ${n1(bx)} ${n1(by)} l ${n1(d * gl * 0.35)} ${n1(gl)}`);
          }
        }
      }
    }
    // the grown mass under the blades: it rises with the crop and covers the water
    const mk = clamp01((st.g - 0.45) / 0.4);
    const massD = mk > 0.01 && mass.length > 2 ? smooth([[mass[0][0] - 4, y + gap * 0.2, "c"], ...mass.map(([mx, my]) => [mx, lerp(y + 2, my, mk)] as Pt), [mass[mass.length - 1][0] + 4, y + gap * 0.2, "c"]], true, 0.3) : "";
    return {q, y, k, any, blades: blades.join(" "), pan: pan.join(" "), stub: stub.join(" "), refl: refl.join(" "), mass: massD};
  });
  const sw = (q: number) => 0.6 + 2.6 * q;
  const tree = khejri({x: fx(1240, 0.23), y: fy(0.23) + 2, h: 250, seed: 7, t: f * 0.5, wind: 0.2});
  const hutX = fx(1240, 0.23) - 120;
  const bq = Array.from({length: 24}, (_, i) => 0.006 + Math.pow(i / 23, 1.6) * 1.16);
  const bX = (X: number, q: number) => X + 30 * Math.sin(q * 7 + X * 0.01) + 14 * Math.sin(q * 19 + X);
  const bundD = (X: number) => polyD([...bq.map((q) => [fx(bX(X, q) - 24, q), fy(q)]), ...[...bq].reverse().map((q) => [fx(bX(X, q) + 24, q), fy(q)])], true, "cw");
  const bundGrass = FBUNDS.map((X) => bq.filter((q) => q > 0.1).flatMap((q, i) => [-1, 1].map((sd) => { const x = fx(bX(X, q) + sd * 24, q), y = fy(q), hh = 26 * q; return `M ${n1(x)} ${n1(y)} l ${n1(-2 * q)} ${n1(-hh)} M ${n1(x + 3 * q)} ${n1(y)} l ${n1(3 * q)} ${n1(-hh * 0.8)} M ${n1(x - 3 * q)} ${n1(y)} l ${n1(-5 * q)} ${n1(-hh * 0.7)}`; })).join(" ")).join(" ");
  const crossD = (q: number) => polyD([[-60, fy(q) - 22 * q - 1], [W + 60, fy(q) - 22 * q - 1], [W + 60, fy(q) + 4 * q], [-60, fy(q) + 4 * q]], true, "cw");
  const lightAt = (x: number, y: number): [number, number] => [sun[0] - x, sun[1] - y];
  const stackFor = (k: number) => FSTACKS.filter(([, q]) => FROWS[k] <= q && (k === FROWS.length - 1 || FROWS[k + 1] > q));
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.04)} cx={960} cy={640} vig={0.9}>
      <defs>
        <Lin id={`${id}-water`} user x1={0} y1={FH} x2={0} y2={H} stops={[[0, "#FFD28E"], [0.05, "#F2A66C"], [0.18, "#C46C5C"], [0.45, "#6A3252"], [1, "#2A1634"]]}/>
        <Lin id={`${id}-earth`} user x1={0} y1={FH} x2={0} y2={H} stops={[[0, "#7A4448"], [0.2, "#3E2036"], [1, "#160C1C"]]}/>
        <Lin id={`${id}-bund`} user x1={0} y1={FH} x2={0} y2={H} stops={[[0, "#F4B878"], [0.1, "#A85E50"], [0.4, "#4A2638"], [1, "#1E1024"]]}/>
        <linearGradient id={`${id}-rim`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={W} y2={0}><stop offset="0" stopColor="#C8743E" stopOpacity={0.5}/><stop offset="0.3" stopColor="#F2B06A" stopOpacity={0.8}/><stop offset="0.5" stopColor="#FFE6A8"/><stop offset="0.7" stopColor="#F2B06A" stopOpacity={0.8}/><stop offset="1" stopColor="#C8743E" stopOpacity={0.5}/></linearGradient>
        <linearGradient id={`${id}-btop`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={W} y2={0}><stop offset="0" stopColor="#7A4044"/><stop offset="0.5" stopColor="#D8905E"/><stop offset="1" stopColor="#7A4044"/></linearGradient>
        <Lin id={`${id}-haze`} user x1={0} y1={FH - 40} x2={0} y2={FH + 170} stops={[[0, "#F6B47A", 0], [0.25, "#F8BC84", 0.55], [0.55, "#E89A6E", 0.25], [1, "#E89A6E", 0]]}/>
        <Lin id={`${id}-road`} x1={0} y1={0} x2={0} y2={1} stops={[[0, "#FFF0C8", 0.8], [0.5, "#FFD08A", 0.25], [1, "#FFD08A", 0]]}/>
        <Lin id={`${id}-shd`} stops={[[0, "#0A050E", 0.75], [0.45, "#0A050E", 0.2], [1, "#0A050E", 0]]}/>
        <linearGradient id={`${id}-chaff`} gradientUnits="userSpaceOnUse" x1={st.front - 420} y1={FH} x2={st.front + 160} y2={FH + 320}>
          <stop offset="0" stopColor="#F2C890" stopOpacity={0}/><stop offset="0.45" stopColor="#F6CE96" stopOpacity={0.62}/><stop offset="0.62" stopColor="#FFE0B0" stopOpacity={0.8}/><stop offset="0.8" stopColor="#E8A878" stopOpacity={0.35}/><stop offset="1" stopColor="#E8A878" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <Sky mood={s.mood === "dawn" || s.mood === "gold" ? s.mood : "dusk"} sun={sun} sunR={60} f={f} rays={0.4} horizon={FH} id={id + "k"} stars={0.2}/>
      {/* the far land: a low line of trees and two palmyras on the horizon, in haze */}
      <Rimmed paths={[smooth([[-80, FH + 3, "c"], [-80, FH - 8], [300, FH - 14], [700, FH - 9], [1250, FH - 13], [1700, FH - 8], [2000, FH - 12], [2000, FH + 3, "c"]], {wind: "cw"}), ...neem({x: 230, y: FH - 8, h: 46, seed: 51, detail: 0.5, t: f * 0.3}), ...neem({x: 1520, y: FH - 8, h: 40, seed: 52, detail: 0.5, t: f * 0.3}), ...palmyra({x: 1610, y: FH - 6, h: 74, seed: 53, t: f * 0.3}), ...palmyra({x: 330, y: FH - 8, h: 64, seed: 54, t: f * 0.3})]} light={[0, -1]} w={1} rim="#E8A070" fill="#4A2C46"/>
      <rect x={-200} y={FH} width={W + 400} height={H - FH + 200} fill={`url(#${id}-earth)`}/>
      {/* the flooded paddies mirror the sky; the crop covers them as it grows */}
      <rect x={-200} y={FH} width={W + 400} height={H - FH + 200} fill={`url(#${id}-water)`} opacity={st.water}/>
      {st.water > 0.02 ? <g opacity={st.water}>
        <g transform={`translate(0 ${2 * fy(0.23) + 2}) scale(1 -1)`} opacity={0.55}>{[...tree, hut(hutX, fy(0.23) + 1, 92, 1.05)].map((it, i) => <path key={i} d={typeof it === "string" ? it : it.d} fill="#3A1C36"/>)}</g>
        <rect x={-200} y={FH + 1} width={W + 400} height={7} fill="#5A3246" opacity={0.7}/>
        {Array.from({length: 40}, (_, i) => { const y = FH + 8 + Math.pow(rnd(i, 124), 1.6) * 460, w = 30 + rnd(i, 125) * 220 * (0.3 + (y - FH) / 460); return <rect key={"r" + i} x={rnd(i, 126) * 2100 - 100} y={y} width={w} height={0.8 + (y - FH) / 300} fill={rnd(i, 127) < 0.6 ? "#FFE4B4" : "#4A2848"} opacity={0.45}/>; })}
        <rect x={sun[0] - 60} y={FH} width={120} height={300} fill={`url(#${id}-road)`} opacity={0.6}/>
        {Array.from({length: 30}, (_, i) => { const vv = Math.pow(rnd(i, 120), 1.5), y = FH + 3 + vv * 420, w = 8 + 60 * rnd(i, 121) * (1 - vv * 0.5), x = sun[0] + (rnd(i, 122) - 0.5) * (30 + vv * 300); return <rect key={i} x={x - w / 2} y={y} width={w} height={1 + vv * 2} fill="#FFF2D0" opacity={Math.max(0, Math.sin(f / (6 + rnd(i, 123) * 5) + i)) * 0.85}/>; })}
      </g> : null}
      <rect x={-200} y={FH - 40} width={W + 400} height={210} fill={`url(#${id}-haze)`}/>
      {/* the bunds that run away from us: raised earth, their tops catching the light */}
      {FBUNDS.map((X, i) => <path key={i} d={bundD(X)} fill={`url(#${id}-bund)`}/>)}
      <path d={bundGrass} fill="none" stroke="#1E1024" strokeWidth={1.2} strokeLinecap="round"/>
      {rows.map((r, k) => {
        const cross = FCROSS.filter((q) => q >= r.q && (k === FROWS.length - 1 || q < FROWS[k + 1]));
        return <g key={k}>
          {r.refl ? <path d={r.refl} fill="none" stroke="#2A1430" strokeWidth={sw(r.q) * 0.9} strokeLinecap="round" opacity={0.3 * st.water}/> : null}
          {r.mass ? <path d={r.mass} fill="#1C0F20"/> : null}
          {r.stub ? <path d={r.stub} fill="none" stroke="#2A1626" strokeWidth={sw(r.q) * 0.8} strokeLinecap="round"/> : null}
          {r.blades ? <path d={r.blades} fill="none" stroke="#1A0D1E" strokeWidth={sw(r.q)} strokeLinecap="round"/> : null}
          {r.pan ? <g>
            <path d={r.pan} transform={`translate(0 ${n1(-0.8 - 0.8 * r.q)})`} fill="none" stroke={`url(#${id}-rim)`} strokeWidth={sw(r.q) * 0.85 + 1.1} strokeLinecap="round" opacity={0.85 * st.ripe}/>
            <path d={r.pan} fill="none" stroke="#1A0D1E" strokeWidth={sw(r.q) * 0.75} strokeLinecap="round"/>
          </g> : null}
          {cross.map((q, i) => <g key={"c" + i}><path d={crossD(q)} fill="#24122A"/><rect x={-60} y={fy(q) - 22 * q - 1} width={W + 120} height={9 * q + 1} fill={`url(#${id}-btop)`}/><path d={`M -60 ${n1(fy(q) - 22 * q - 1)} L ${W + 60} ${n1(fy(q) - 22 * q - 1)}`} stroke={`url(#${id}-rim)`} strokeWidth={0.6 + q * 1.2} opacity={0.4}/></g>)}
          {/* haystacks in the cut field (built behind the chaff, never popping in front of us) */}
          {stackFor(k).map(([X, q], i) => {
            const x = fx(X, q), y = fy(q);
            if (!cutAt(st.front - 260, x, y)) return null;
            const hs = haystack(x, y, 260 * q, 250 * q), sl = 560 * q;
            return <g key={"h" + i}>
              <path d={polyD([[x - 95 * q, y + 1], [x + 95 * q, y + 1], [x + (x - sun[0]) * 0.35 * q, y + sl]], true, "cw")} fill={`url(#${id}-shd)`} opacity={0.6}/>
              <Rimmed paths={[hs.S]} light={lightAt(x, y - 120 * q)} w={1.2 + 2.4 * q} rim="#FFCF8A" fill="#1E1020"/>
              <path d={hs.straw} fill="none" stroke="#4A2C38" strokeWidth={0.5 + 1.4 * q} opacity={0.75}/>
            </g>;
          })}
          {/* the khejri and the hut on the bund, with their long shadows towards us */}
          {r.q <= 0.23 && (k === FROWS.length - 1 || FROWS[k + 1] > 0.23) ? <g>
            <path d={polyD([[fx(1240, 0.23) - 10, fy(0.23)], [fx(1240, 0.23) + 10, fy(0.23)], [fx(1240, 0.23) + 150, H + 60], [fx(1240, 0.23) + 60, H + 60]], true, "cw")} fill={`url(#${id}-shd)`} opacity={0.8}/>
            <Rimmed paths={[...tree, hut(hutX, fy(0.23) + 1, 92, 1.05)]} light={lightAt(fx(1240, 0.23), fy(0.23) - 140)} w={2.2} rim="#FFCF8A" fill="#1A0E1E"/>
            <rect x={hutX - 9} y={fy(0.23) - 30} width={18} height={30} fill="#FFC870" opacity={0.85}/>
          </g> : null}
        </g>;
      })}
      {/* lit chaff drifting on the harvest front: the change happens behind it */}
      {st.front > -300 && st.front < 2300 ? <rect x={-200} y={FH - 60} width={W + 400} height={H - FH + 200} fill={`url(#${id}-chaff)`}/> : null}
      <Flock f={f + 260} light={[0, -1]} y={330} count={5} scale={0.26} seed={8}/>
      <Dust f={f} sun={sun} n={70} y0={300} y1={1000} color="#FFE8C0"/>
    </Frame>
  );
};

export const SCENES: Record<string, React.FC<SceneP>> = {light: LightScene, "sun-world": SunWorld, glories: Glories, field: FieldScene};
