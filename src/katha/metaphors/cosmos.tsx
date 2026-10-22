// Katha metaphor scenes: cosmos (22 Oct 2026). Lamplight look: near-black silhouettes, a thin warm rim on the side
// facing the light, light the only colour. Soft light, haze and glow are gradients, never blur filters (two scenes use
// one gradient mask each: the light sweeping over sun-world, the fading reflection of the ghats).
//  - type "light" (Gita 11.12, the splendour of a thousand suns): Krishna's cosmic form shown ONLY as light, never as a
//    figure: a radiance above the small dark field, rings of fine gold geometry, a thousand suns turning, rays. s.variant
//    "dawn" (a point of light is born) | "full" (overwhelming, the default) | "fade" (11.50-51: it gathers back into a
//    gentle, human-scale glow at the front of the chariot, where Krishna's silhouette returns) | "friend" (11.41-44: night,
//    the two friends on the chariot lit by a small lamp between them). s.tone 0..1 deepens the gold towards red.
//  - "sun-world" (13.33): one sun rises over a vast land (river, fields, villages, a temple on a hill); its light sweeps
//    across the land from left to right over the beat and the long shadows draw back. s.mood "dawn" | "gold" | "dusk".
//  - "glories" (ch. 10): silhouette vignettes dissolving one into the next: sun, peak (Meru), river (the Ganga at the
//    ghats, lamps on the water), ashvattha, ocean, lion; also "silence" and "letter" (shows s.text). s.items picks and
//    orders them (aliases: himalaya, meru, ganga, tree, sea...); without it 4 to 6 by beat length. s.labels: one small
//    Cinzel caption per vignette. s.variant "sparks" (10.41): sparks fly up from one fire and each becomes a star.
//  - "field" (ch. 13): a vast field of grain under the night sky, wind running through it in waves, one steady light above
//    that never changes while the field below grows, ripens, is harvested and lies bare (the default cycle); s.variant
//    "ripe" | "growth" | "harvest" | "bare" holds one stage for the whole beat.
// Every scene renders from {type, kind} alone; s.mood ("night" | "dusk" | "dawn" | "gold") tints the sky where it applies.
import React, {useId} from "react";
import {useCurrentFrame} from "remotion";
import {K, W, H, CAPS, SA} from "../look";
import {SceneP, Frame, push, Flock} from "../stage";
import {Dust, Sky} from "../sky";
import {armyPath} from "../field";
import {smooth, ribbon, rnd, lerp, clamp01, Pt} from "../geom";
import {Rimmed, horseItem, krishnaTeach, arjuna, ratha, wheel} from "../sil";

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
// ================================================================================================================
const LSKY: Record<Mood, Stops> = {
  night: [[0, "#040310"], [0.34, "#0B0A22"], [0.6, "#171436"], [0.8, "#281D46"], [0.92, "#43284F"], [1, "#5E3050"]],
  dusk: [[0, "#0D0A22"], [0.38, "#221A44"], [0.66, "#45244E"], [0.86, "#7E3650"], [1, "#B24C3C"]],
  dawn: [[0, "#0F142C"], [0.42, "#25305A"], [0.72, "#55507C"], [0.9, "#A07484"], [1, "#D89A7C"]],
  gold: [[0, "#1C1230"], [0.36, "#3E2648"], [0.66, "#7A3C50"], [0.86, "#C0663F"], [1, "#EFA458"]],
};
// The rings of fine gold geometry: each is one path in local units (radius r), turned slowly about the light.
const ringPath = (k: number, r: number): string => {
  const P: string[] = [], T = Math.PI * 2;
  const ticks = (m: number, r0: number, r1: number) => { for (let i = 0; i < m; i++) { const a = (i / m) * T; P.push(`M ${n1(Math.cos(a) * r0)} ${n1(Math.sin(a) * r0)} L ${n1(Math.cos(a) * r1)} ${n1(Math.sin(a) * r1)}`); } };
  const ring = (rr: number) => P.push(circ(0, 0, rr));
  switch (k % 8) {
    case 0: ring(r); ticks(24, r, r + 7); break;
    case 1: { const m = 16, rr = r * Math.sin(Math.PI / m) * 1.25; for (let i = 0; i < m; i++) { const a = (i / m) * T; P.push(circ(Math.cos(a) * r, Math.sin(a) * r, rr)); } break; }
    case 2: ring(r - 5); ring(r + 5); for (let i = 0; i < 72; i++) { const a = (i / 72) * T; P.push(circ(Math.cos(a) * r, Math.sin(a) * r, 1.3)); } break;
    case 3: { const m = 18, st = 7; for (let i = 0; i < m; i++) { const a = (i / m) * T, b = (((i + st) % m) / m) * T; P.push(`M ${n1(Math.cos(a) * r)} ${n1(Math.sin(a) * r)} L ${n1(Math.cos(b) * r)} ${n1(Math.sin(b) * r)}`); } ring(r); break; }
    case 4: ring(r); ring(r + 12); ticks(96, r, r + 12); for (let i = 0; i < 8; i++) { const a = (i / 8 + 1 / 16) * T; P.push(circ(Math.cos(a) * (r + 26), Math.sin(a) * (r + 26), 7)); } break;
    case 5: { const m = 24; for (let i = 0; i < m; i++) { const a0 = (i / m) * T, a1 = ((i + 1) / m) * T, am = (a0 + a1) / 2; P.push(`M ${n1(Math.cos(a0) * r)} ${n1(Math.sin(a0) * r)} Q ${n1(Math.cos(am - 0.04) * (r + 20))} ${n1(Math.sin(am - 0.04) * (r + 20))} ${n1(Math.cos(am) * (r + 28))} ${n1(Math.sin(am) * (r + 28))} Q ${n1(Math.cos(am + 0.04) * (r + 20))} ${n1(Math.sin(am + 0.04) * (r + 20))} ${n1(Math.cos(a1) * r)} ${n1(Math.sin(a1) * r)}`); } ring(r); break; }
    case 6: ring(r); for (let i = 0; i < 36; i++) { const a = (i / 36) * T; P.push(circ(Math.cos(a) * (r + 10), Math.sin(a) * (r + 10), i % 3 ? 1.4 : 3)); } break;
    default: ring(r); ring(r - 9); ticks(180, r - 9, r - 3); break;
  }
  return P.join(" ");
};
const RING_R = [64, 112, 172, 246, 334, 436, 552, 690, 850];
const RINGS = RING_R.map((r, k) => ringPath(k, r));
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
const Splendour: React.FC<{f: number; I: number; C: [number, number]; sc: number; id: string; reveal: number; rays: number; suns: number; sunFade?: number; tone?: number}> = ({f, I, C, sc, id, reveal, rays, suns, sunFade = 1, tone = 0}) => {
  const [cx, cy] = C;
  const Rb = lerp(170, 2500, Math.pow(I, 1.15)) * Math.max(0.12, sc);
  const red = tone;   // 0 gold, 1 deep red (the gold "deepens to red")
  const engrave = clamp01(I * 1.6);
  return (
    <g>
      <defs>
        <Rad id={`${id}-blaze`} user cx={cx} cy={cy} r={Rb} stops={[[0, "#FFFFFF"], [0.04, "#FFFBEA"], [0.1, mix("#FFEFC4", "#FFE0B0", red)], [0.2, mix("#FFD994", "#FFB070", red), 0.97], [0.32, mix("#F8B565", "#EE7A44", red), 0.92], [0.45, mix("#E98A4C", "#C8402E", red), 0.84], [0.6, mix("#C2553A", "#8E2230", red), 0.66], [0.8, "#6A2F55", 0.34], [1, "#4A2B5C", 0]]}/>
        <Rad id={`${id}-ray`} user cx={cx} cy={cy} r={1900 * Math.max(0.15, sc)} stops={[[0, "#FFF6D8", 1], [0.25, "#FFE09A", 0.7], [0.6, "#F7B860", 0.25], [1, "#F7B860", 0]]}/>
        <Rad id={`${id}-sun`} stops={[[0, "#FFFBEA", 1], [0.12, "#FFEBB4", 0.8], [0.3, "#FFD488", 0.36], [0.55, "#FFC870", 0.12], [0.8, "#FFC870", 0.03], [1, "#FFC870", 0]]}/>
        <Rad id={`${id}-core`} stops={[[0, "#FFFFFF", 1], [0.25, "#FFFDF4", 0.96], [0.5, "#FFF3D0", 0.6], [0.75, "#FFE8B0", 0.2], [1, "#FFE4A0", 0]]}/>
        <Lin id={`${id}-streak`} x1={0} y1={0} x2={1} y2={0} stops={[[0, "#FFE9B8", 0], [0.3, "#FFF0CC", 0.35], [0.5, "#FFFAEC", 1], [0.7, "#FFF0CC", 0.35], [1, "#FFE9B8", 0]]}/>
        <Rad id={`${id}-streakv`} stops={soft("#FFF4DA", 1, 2)}/>
      </defs>
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={`url(#${id}-blaze)`} opacity={clamp01(0.4 + I * 0.8)}/>
      {/* rays filling the sky, three nested wedges each for a soft edge, turning very slowly */}
      {rays > 0.001 ? <g opacity={rays} transform={`rotate(${f * 0.012} ${cx} ${cy})`}>{Array.from({length: 64}, (_, i) => {
        const a = (i / 64) * Math.PI * 2 + rnd(i, 51) * 0.08, w = (0.3 + Math.pow(rnd(i, 52), 2) * 1.9) * Math.PI / 180, L = 2300 * Math.max(0.15, sc);
        const o = (0.05 + 0.09 * rnd(i, 53)) * (0.72 + 0.28 * Math.sin(f / 37 + i * 1.7));
        return <g key={i}>{[1, 0.55, 0.22].map((k, j) => <path key={j} d={`M ${n1(cx)} ${n1(cy)} L ${n1(cx + Math.cos(a - w * k) * L)} ${n1(cy + Math.sin(a - w * k) * L)} L ${n1(cx + Math.cos(a + w * k) * L)} ${n1(cy + Math.sin(a + w * k) * L)} Z`} fill={`url(#${id}-ray)`} opacity={o}/>)}</g>;
      })}</g> : null}
      {rays > 0.001 && I > 0.3 ? <g opacity={rays * clamp01((I - 0.3) * 1.6)} transform={`rotate(${-f * 0.008 + 3} ${cx} ${cy})`}>{Array.from({length: 40}, (_, i) => {
        const a = (i / 40) * Math.PI * 2 + (rnd(i, 54) - 0.5) * 0.12, w = (0.3 + Math.pow(rnd(i, 55), 1.5) * 2.2) * Math.PI / 180, L = 2300 * Math.max(0.15, sc), r0 = (60 + 120 * rnd(i, 57)) * Math.max(0.15, sc);
        const o = (0.025 + 0.055 * rnd(i, 56)) * (0.7 + 0.3 * Math.sin(f / 43 + i * 2.1));
        return <path key={i} d={`M ${n1(cx + Math.cos(a) * r0)} ${n1(cy + Math.sin(a) * r0)} L ${n1(cx + Math.cos(a - w) * L)} ${n1(cy + Math.sin(a - w) * L)} L ${n1(cx + Math.cos(a + w) * L)} ${n1(cy + Math.sin(a + w) * L)} Z`} fill="#A4521F" opacity={o}/>;
      })}</g> : null}
      {/* the rings of fine gold geometry: a darker engraving that reads on the white, a pale line that reads on the dark */}
      <g transform={`translate(${n1(cx)} ${n1(cy)}) scale(${sc})`}>
        {RINGS.map((d, k) => {
          const rv = clamp01(reveal * RINGS.length - k * 0.85), dir = k % 2 ? -1 : 1, sp = 0.025 + (k % 3) * 0.018;
          if (rv <= 0) return null;
          const o = (0.55 + 0.35 * (1 - k / RINGS.length)) * (0.8 + 0.2 * Math.sin(f / 50 + k)), dash = rv < 1 ? `${rv} 1` : undefined, s1 = 1 / Math.max(0.3, sc);
          return <g key={k} transform={`rotate(${n1(dir * f * sp + k * 9)})`} opacity={o}>
            <path d={d} fill="none" stroke="#A8642A" strokeWidth={1.7 * s1} opacity={0.5 * engrave} pathLength={1} strokeDasharray={dash}/>
            <path d={d} fill="none" stroke="#FFE9B4" strokeWidth={1 * s1} opacity={0.75} pathLength={1} strokeDasharray={dash}/>
          </g>;
        })}
      </g>
      {/* a thousand suns, turning like a galaxy: inner ones faster; ring suns turn with their ring */}
      {suns > 0.001 && sunFade > 0.001 ? <g opacity={sunFade}>{SUNS.map((p, i) => {
        const ig = clamp01((suns * 1.12 - p.t) / 0.1);
        if (ig <= 0) return null;
        const a = p.a + f * p.sp, r = p.r * sc, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        if (x < -60 || x > W + 60 || y < -60 || y > H + 60) return null;
        const tw = 0.72 + 0.28 * Math.sin(f / p.tw + i), hs = p.halo * (0.6 + 1.0 * I) * Math.max(0.35, Math.sqrt(sc));
        return <g key={i} opacity={ig * tw}>
          <circle cx={x} cy={y} r={hs} fill={`url(#${id}-sun)`}/>
          <circle cx={x} cy={y} r={p.core * (0.8 + 0.5 * I) * Math.max(0.5, Math.sqrt(sc))} fill="#FFFBEE"/>
          {p.big > 0.85 ? <path d={`M ${n1(x - hs * 1.3)} ${n1(y)} L ${n1(x)} ${n1(y - 0.7)} L ${n1(x + hs * 1.3)} ${n1(y)} L ${n1(x)} ${n1(y + 0.7)} Z M ${n1(x)} ${n1(y - hs)} L ${n1(x + 0.6)} ${n1(y)} L ${n1(x)} ${n1(y + hs)} L ${n1(x - 0.6)} ${n1(y)} Z`} fill="#FFF6DC" opacity={0.45}/> : null}
        </g>;
      })}</g> : null}
      {/* a soft anamorphic streak and the white heart of the light */}
      <ellipse cx={cx} cy={cy} rx={Math.max(1, (260 + 900 * I) * Math.max(0.2, sc))} ry={8 + 14 * I} fill={`url(#${id}-streakv)`} opacity={0.25 + 0.3 * I}/>
      <ellipse cx={cx} cy={cy} rx={Math.max(1, (140 + 520 * I) * Math.max(0.2, sc))} ry={1.6 + 1.6 * I} fill={`url(#${id}-streak)`} opacity={0.3 + 0.3 * I}/>
      <circle cx={cx} cy={cy} r={(30 + 420 * Math.pow(I, 1.6)) * Math.max(0.25, sc)} fill={`url(#${id}-core)`}/>
    </g>
  );
};
// The chariot small on the field: horses standing, the car, Arjuna; Krishna's silhouette only when ko > 0
// (in "fade" the light gathers back into him; in "friend" he stands as the friend). Hub at (0, 0), ground y = 118.
const MiniRig: React.FC<{f: number; lightA: [number, number]; lightK: [number, number]; lightCar: [number, number]; lightH?: [number, number]; ko: number; aPose: "despair" | "listen" | "resolve"; rim?: number; rimCol?: string}> =
  ({f, lightA, lightK, lightCar, lightH, ko, aPose, rim = 6, rimCol = K.rim}) => {
  const HS: [number, number, number, number][] = [[716, 106, 1.36, 0.55], [676, 110, 1.4, 0.3], [636, 114, 1.44, 0.8], [596, 118, 1.48, 0.05]];
  const w = Math.sin(f / 40) * 0.3;
  return (
    <g>
      <Rimmed paths={HS.map(([x, y, sc, ph], i) => horseItem(x, y, sc, f, 1, ph, ["#241A2F", "#20162B", "#1C1227", "#170E21"][i], true))} light={lightH ?? lightCar} w={rim * 0.7} rim={rimCol}/>
      <Rimmed paths={ratha(f, w)} light={lightCar} w={rim} rim={rimCol}/>
      <Rimmed paths={arjuna(aPose, w, f)} transform="translate(-95 -36) scale(0.95)" light={lightA} w={rim / 0.95} rim={rimCol}/>
      {ko > 0.001 ? <g opacity={ko}><Rimmed paths={krishnaTeach(w, f)} transform="translate(205 -36) scale(0.95)" light={lightK} w={rim / 0.95} rim={rimCol}/></g> : null}
      <Rimmed paths={[wheel(118, f * 0.002)]} light={lightCar} w={rim * 0.8} evenodd rim={rimCol}/>
    </g>
  );
};
// The armies as rows on low rises (no boxes): each row is a mound and its banners, spears, elephants and parasols,
// the top edge caught by the light.
type Row = {y: number; s: number; c: number; seed: number; x0: number; x1: number; col: string; h: number};
const Host: React.FC<{rows: Row[]; f: number; rim: number; rimCol?: string}> = ({rows, f, rim, rimCol = "#E9B26A"}) => (
  <g>{rows.map((r, k) => {
    const L = r.x1 - r.x0, pts: Pt[] = [];
    for (let i = 0; i <= 14; i++) { const u = i / 14, x = r.x0 + L * u, bump = Math.pow(Math.sin(Math.PI * u), 0.6) * r.h * (0.8 + 0.4 * rnd(i, r.seed)); pts.push([x, r.y + 1 - bump]); }
    pts.push([r.x1 + 4, r.y + 3, "c"], [r.x0 - 4, r.y + 3, "c"]);
    const mound = smooth(pts), d = armyPath(r.y - r.h * 0.55, r.s, Math.max(1, Math.round(r.c)), r.seed, r.x0 + L * 0.06, r.x1 - L * 0.06, f / 18);
    return <g key={k}>
      {rim > 0.001 ? <g transform="translate(0 -1.5)" opacity={rim}><path d={mound} fill={rimCol}/><path d={d} fill={rimCol} stroke={rimCol} strokeWidth={0.8 * r.s}/></g> : null}
      <path d={mound} fill={r.col}/><path d={d} fill={r.col} stroke={r.col} strokeWidth={0.8 * r.s}/>
    </g>;
  })}</g>
);
// The field below, small and dark: the ground, a pool of light, the armies in three rows either side of the chariot.
const SmallField: React.FC<{f: number; hor: number; I: number; lx: number; id: string; gap?: [number, number]; warm?: number}> = ({f, hor, I, lx, id, gap = [800, 1180], warm = 1}) => {
  const far = "#3A2646", mid = "#26182F", near = "#160C1F";
  const rows: Row[] = [
    {y: hor + 2, s: 0.46, c: 150, seed: 140, x0: -80, x1: gap[0] - 20, col: far, h: 5}, {y: hor + 2, s: 0.46, c: 150, seed: 147, x0: gap[1] + 20, x1: W + 80, col: far, h: 5},
    {y: hor + 24, s: 0.8, c: 70, seed: 150, x0: -120, x1: gap[0] - 120, col: mid, h: 9}, {y: hor + 26, s: 0.8, c: 62, seed: 157, x0: gap[1] + 110, x1: W + 120, col: mid, h: 9},
    {y: hor + 60, s: 1.25, c: 30, seed: 160, x0: -160, x1: gap[0] - 280, col: near, h: 16}, {y: hor + 64, s: 1.25, c: 26, seed: 167, x0: gap[1] + 260, x1: W + 160, col: near, h: 16},
  ];
  return (
    <g>
      <defs>
        <Lin id={`${id}-gnd`} stops={[[0, "#2A1832"], [0.18, "#170D20"], [1, "#06030A"]]}/>
        <Rad id={`${id}-pool`} stops={soft("#FFC879", 0.6, 2.2)}/>
        <Lin id={`${id}-hline`} stops={[[0, "#FFD999", 0], [0.5, "#FFD999", 1], [1, "#FFD999", 0]]}/>
        <Lin id={`${id}-sheen`} stops={[[0, "#E9A35E", 0.8], [0.25, "#B8663E", 0.35], [0.6, "#6A3046", 0.1], [1, "#6A3046", 0]]}/>
      </defs>
      <rect x={-200} y={hor} width={W + 400} height={H - hor + 300} fill={`url(#${id}-gnd)`}/>
      <ellipse cx={lx} cy={hor + 4} rx={260 + 1100 * I} ry={24 + 70 * I} fill={`url(#${id}-pool)`} opacity={(0.3 + 0.7 * I) * warm}/>
      <ellipse cx={lx} cy={hor + 90} rx={160 + 260 * I} ry={150 + 60 * I} fill={`url(#${id}-pool)`} opacity={0.35 * I * warm}/>
      <rect x={-200} y={hor} width={W + 400} height={160} fill={`url(#${id}-sheen)`} opacity={0.55 * I * warm}/>
      <rect x={-200} y={hor - 14} width={W + 400} height={28} fill={`url(#${id}-hline)`} opacity={(0.08 + 0.45 * I) * warm}/>
      <Host rows={rows} f={f} rim={(0.3 + 0.65 * I) * warm}/>
    </g>
  );
};
const LightScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const id = useUid("czl");
  const v: string = ["dawn", "full", "fade", "friend"].includes(s.variant) ? s.variant : "full";
  if (v === "friend") return <FriendLight s={s} n={n} f={f} id={id}/>;
  const u = clamp01(f / Math.max(1, n));
  const HOR = 842, hub: [number, number] = [905, 880], RS = 0.27;
  const kHead: [number, number] = [hub[0] + 205 * RS, hub[1] + (-36 - 372 * 0.95) * RS];
  let I = 1, sc = 1, C: [number, number] = [960, 400], reveal = 1, rays = 1, suns = 1, sunFade = 1, ko = 0, gather = 0;
  if (v === "dawn") {
    const e = ss(u * 1.05);
    I = 0.03 + 0.4 * e; sc = 0.55 + 0.45 * e; reveal = clamp01(e * 0.9); rays = 0.15 + 0.6 * e; suns = e * 0.62;
  } else if (v === "full") {
    const e = ss(u);
    I = 0.86 + 0.14 * e; sc = 1 + 0.06 * e;
  } else {
    gather = ss(u * 1.08);
    const g2 = ss(gather * 1.1);
    I = 0.92 * Math.pow(1 - gather, 1.4) + 0.02; sc = lerp(1, 0.04, ss(gather * 1.05)); reveal = 1 - gather * 0.5; rays = Math.pow(1 - gather, 1.5); suns = 1;
    sunFade = Math.pow(clamp01(1 - gather * 1.15), 1.5);
    C = [lerp(960, kHead[0], g2), lerp(400, kHead[1], g2)];
    ko = span(gather, 0.5, 0.92);
  }
  const mood = moodOf(s.mood, "night");
  const lightOn = (x: number, y: number): [number, number] => [C[0] - x, C[1] - y];
  const z = push(f, n, 1, v === "fade" ? 1.07 : 1.04);
  return (
    <Frame f={f} zoom={z} cx={960} cy={v === "fade" ? 720 : 520}>
      <defs>
        <Lin id={`${id}-sky`} user x1={0} y1={0} x2={0} y2={HOR} stops={LSKY[mood]}/>
        <Rad id={`${id}-kh`} stops={soft("#FFDFA0", 0.75, 2.3)}/>
        <Rad id={`${id}-shadow`} stops={soft("#05030A", 0.85, 1.6)}/>
      </defs>
      <rect x={-200} y={-200} width={W + 400} height={HOR + 210} fill={`url(#${id}-sky)`}/>
      <Stars f={f} n={240} yMax={HOR - 60} o={clamp01(1 - I * 1.4)}/>
      <Splendour f={f} I={I} C={C} sc={sc} id={id} reveal={reveal} rays={rays} suns={suns} sunFade={sunFade} tone={s.tone ?? 0}/>
      <SmallField f={f} hor={HOR} I={I} lx={C[0]} id={id}/>
      {/* the long shadow of the chariot falls towards us */}
      <ellipse cx={hub[0] + 90} cy={hub[1] + 36} rx={190} ry={9} fill={`url(#${id}-shadow)`} opacity={0.8}/>
      {v === "fade" ? <Glow x={kHead[0]} y={kHead[1] + 10} r={60 + 150 * gather} fill={`${id}-kh`} o={ss(gather * 1.2)}/> : null}
      <g transform={`translate(${hub[0]} ${hub[1]}) scale(${RS})`}>
        <MiniRig f={f} lightA={lightOn(hub[0] - 25, hub[1] - 60)} lightK={lightOn(kHead[0], kHead[1] + 50)} lightCar={lightOn(hub[0] + 60, hub[1] - 20)} ko={ko} aPose="listen" rim={7}/>
      </g>
      <Dust f={f} sun={C} n={110} y0={160} y1={1000} color="#FFE6B4"/>
    </Frame>
  );
};
// "friend" (11.41-44): night, the chariot near, a small lamp on the rail between the two friends lights each from the
// side that faces it; the stars are what is left of the thousand suns.
const FriendLight: React.FC<{s: any; n: number; f: number; id: string}> = ({s, n, f, id}) => {
  const mood = moodOf(s.mood, "night");
  const HOR = 730, hub: [number, number] = [640, 880], RS = 0.96;
  const lampX = 52, lamp: [number, number] = [hub[0] + lampX * RS, hub[1] - 117 * RS];
  const flame: [number, number] = [lamp[0] + 40 * RS * 0.55, lamp[1] - 34 * RS * 0.55];
  const fl = 0.95 + 0.035 * Math.sin(f / 7) + 0.015 * Math.sin(f / 3.1);
  const z = push(f, n, 1.0, 1.06);
  // light directions in rig units: from each figure towards the flame (low and between them)
  const toF = (x: number, y: number): [number, number] => [lampX + 22 - x, -140 - y];
  return (
    <Frame f={f} zoom={z} cx={flame[0]} cy={600}>
      <defs>
        <Lin id={`${id}-sky`} user x1={0} y1={0} x2={0} y2={HOR} stops={LSKY[mood]}/>
        <Rad id={`${id}-warm`} stops={[[0, "#FFE2A0", 0.7], [0.08, "#FBC679", 0.5], [0.2, "#F2A65A", 0.28], [0.38, "#D9733F", 0.12], [0.6, "#A8473A", 0.04], [1, "#A8473A", 0]]}/>
        <Rad id={`${id}-hot`} stops={soft("#FFF4D2", 0.95, 2.4)}/>
        <Rad id={`${id}-floor`} stops={soft("#F5B266", 0.45, 2.1)}/>
        <Lin id={`${id}-gnd`} stops={[[0, "#1C1028"], [0.4, "#0E0816"], [1, "#05030A"]]}/>
        <Lin id={`${id}-flame`} x1={0} y1={1} x2={0} y2={0} stops={[[0, "#FFFDF2"], [0.3, "#FFE7A6"], [0.62, "#F9B45A"], [0.86, "#E8783E", 0.75], [1, "#C2553A", 0.1]]}/>
        <Rad id={`${id}-sh`} stops={soft("#04020A", 0.75, 1.8)}/>
      </defs>
      <rect x={-200} y={-200} width={W + 400} height={HOR + 210} fill={`url(#${id}-sky)`}/>
      <Stars f={f} n={380} yMax={HOR - 30} rot={f * 0.004} cx={960} cy={-400}/>
      <SmallField f={f} hor={HOR} I={0.04} lx={flame[0]} id={id + "f"} gap={[300, 1760]} warm={0.5}/>
      <ellipse cx={hub[0] + 300} cy={hub[1] + 116} rx={760} ry={50} fill={`url(#${id}-sh)`}/>
      <ellipse cx={flame[0]} cy={hub[1] + 112} rx={460 * fl} ry={64 * fl} fill={`url(#${id}-floor)`}/>
      <Glow x={flame[0]} y={flame[1] - 20} r={900 * fl} ry={760 * fl} fill={`${id}-warm`}/>
      <g transform={`translate(${hub[0]} ${hub[1]}) scale(${RS})`}>
        <MiniRig f={f} lightA={toF(-95, -230)} lightK={toF(205, -230)} lightCar={[0, -1]} lightH={[-1, -0.25]} ko={1} aPose="listen" rim={4.2} rimCol="#FFCF88"/>
      </g>
      <Diya x={lamp[0]} y={lamp[1]} s={0.55 * RS} f={f} id={id}/>
      <Glow x={flame[0]} y={flame[1] - 14} r={340 * fl} ry={300 * fl} fill={`${id}-warm`} o={0.8}/>
      <Glow x={flame[0]} y={flame[1] - 10} r={130 * fl} fill={`${id}-hot`} o={0.6}/>
      <Dust f={f} sun={flame} n={80} y0={260} y1={900} color="#FFE2A8"/>
    </Frame>
  );
};
// A small clay diya with a pinched spout and its flame; x, y = the middle of the bowl's base line; s = scale (1 = ~180
// px wide). The flame burns at the spout tip (40, -34) in local units (scaled by s).
const DIYA = smooth([[-74, -30], [-78, -22], [-74, -10], [-60, 0], [-38, 8], [-16, 11], [-12, 18, "c"], [12, 18, "c"], [16, 11], [36, 7], [56, -2], [74, -14], [92, -26], [104, -36, "c"], [86, -36], [66, -34], [40, -36], [0, -38], [-40, -37], [-66, -34]]);
const DIYA_OIL = smooth([[-62, -35], [-30, -39.5], [10, -40], [50, -38], [80, -35], [50, -36.2], [10, -37.2], [-30, -37]]);
const Diya: React.FC<{x: number; y: number; s: number; f: number; id: string}> = ({x, y, s, f, id}) => {
  const sway = Math.sin(f / 9) * 3 + Math.sin(f / 4.3) * 1.4, h = 92 + Math.sin(f / 5.7) * 5 + Math.sin(f / 2.3) * 2;
  const fl = smooth([[0, 0], [-13, -10], [-15, -26], [-10, -h * 0.52], [sway * 0.5 - 3, -h * 0.8], [sway, -h, "c"], [sway * 0.55 + 4, -h * 0.79], [9, -h * 0.5], [14, -26], [12, -10]]);
  const core = smooth([[0, -4], [-6, -12], [-6, -24], [sway * 0.25 - 1, -h * 0.5], [5, -24], [6, -12]]);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Rimmed paths={[DIYA]} light={[0.5, -1]} w={4} rim="#FFD9A0" fill="#1A0F1E"/>
      <path d={DIYA_OIL} fill="#FFD48A" opacity={0.55}/>
      <g transform="translate(100 -40)">
        <path d={fl} fill={`url(#${id}-flame)`}/>
        <path d={core} fill="#FFFFFA" opacity={0.95}/>
      </g>
    </g>
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
type Patch = {d: string; tone: number; furrow: string; t: number; wet: boolean; din: string};
const SW_FIELDS: Patch[] = (() => {
  const out: Patch[] = [];
  for (let k = 0; k < SW_ROWS.length - 1; k++) {
    const t0 = SW_ROWS[k], t1 = SW_ROWS[k + 1], tm = (t0 + t1) / 2;
    const xs: number[] = []; let x = -260 - rnd(k, 61) * 200;
    while (x < W + 260) { xs.push(x); x += (90 + 260 * rnd(xs.length, 62 + k)) * (0.35 + tm * 1.6) + 14; }
    for (let j = 0; j < xs.length - 1; j++) {
      const X0 = 960 + (xs[j] - 960) / tm, X1 = 960 + (xs[j + 1] - 960) / tm;
      const a = swProj(X0, t0), b = swProj(X1, t0), c = swProj(X1, t1), d = swProj(X0, t1);
      const tone = Math.floor(rnd(j, 63 + k * 7) * 4);
      // furrows: lines towards the vanishing point, or across the row
      const fl: string[] = [], m = Math.max(2, Math.round((c[0] - d[0]) / (7 + tm * 22))), wet = tm > 0.05 && tm < 0.9 && rnd(j, 65 + k) < 0.2, plain = wet || tm < 0.12 || rnd(j, 69 + k) < 0.3;
      if (plain) { /* flooded paddy or fallow: no furrows */ }
      else if (rnd(j, 64 + k) < 0.55) { for (let i = 1; i < m; i++) { const u = i / m, p = swProj(lerp(X0, X1, u), t0 + (t1 - t0) * 0.06), q = swProj(lerp(X0, X1, u), t1 - (t1 - t0) * 0.06); fl.push(`M ${n1(p[0])} ${n1(p[1])} L ${n1(q[0])} ${n1(q[1])}`); } }
      else { const mm = Math.max(2, Math.round((d[1] - a[1]) / (4 + tm * 12))); for (let i = 1; i < mm; i++) { const tt = lerp(t0, t1, i / mm), p = swProj(lerp(X0, X1, 0.04), tt), q = swProj(lerp(X0, X1, 0.96), tt); fl.push(`M ${n1(p[0])} ${n1(p[1])} L ${n1(q[0])} ${n1(q[1])}`); } }
      const ix = 0.05, iy = 0.14, q = (P1: number[], P2: number[], P3: number[]) => [P1[0] + (P2[0] - P1[0]) * ix + (P3[0] - P1[0]) * iy, P1[1] + (P2[1] - P1[1]) * ix + (P3[1] - P1[1]) * iy];
      const din = lineD([q(a, b, d), q(b, a, c), q(c, d, b), q(d, c, a)], true);
      out.push({d: `M ${n1(a[0])} ${n1(a[1])} L ${n1(b[0])} ${n1(b[1])} L ${n1(c[0])} ${n1(c[1])} L ${n1(d[0])} ${n1(d[1])} Z`, tone, furrow: fl.join(" "), t: tm, wet, din});
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
// A palm (trunk and fronds) as path strings, base at (x, y), height h.
const palm = (x: number, y: number, h: number, lean: number, ph: number): string[] => {
  const top: [number, number] = [x + lean * h * 0.3, y - h];
  const trunk = dense([[x, y], [x + lean * h * 0.08, y - h * 0.4], [x + lean * h * 0.2, y - h * 0.75], top], 5);
  const P = [ribbon(trunk, h * 0.07, h * 0.042)];
  const A = [-178, -158, -140, -116, -97, -80, -60, -36, -14, 6, 168];
  A.forEach((deg, i) => {
    const th = (deg + Math.sin(ph + i) * 3 + (rnd(i, 70 + ph) - 0.5) * 14) * Math.PI / 180, L = h * (0.3 + 0.16 * rnd(i, 68 + ph)) * (i >= 9 ? 0.8 : 1), up = Math.max(0, -Math.sin(th));
    const p1: [number, number] = [top[0] + Math.cos(th) * L * 0.5, top[1] - L * (0.08 + 0.22 * up)];
    const p2: [number, number] = [top[0] + Math.cos(th) * L * 0.9, top[1] + L * (0.1 + 0.1 * (1 - up))];
    const p3: [number, number] = [top[0] + Math.cos(th) * L * 1.02, top[1] + L * (0.34 + 0.14 * (1 - up))];
    P.push(ribbon(dense([top, p1, p2, p3], 4), h * 0.085, h * 0.008, 0.9));
  });
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
// The temple: a curvilinear shikhara with amalaka and finial, a mandapa, a platform and a pennant. Base at (0, 0), ~110 tall.
const templeD = (f: number): string[] => {
  const P: string[] = [];
  P.push(smooth([[-62, 0, "c"], [-62, -9, "c"], [54, -9, "c"], [54, 0, "c"]]));
  P.push(smooth([[-22, -9, "c"], [-22, -34, "c"], [22, -34, "c"], [22, -9, "c"]]));
  P.push(smooth([[-24, -34, "c"], [-23, -48], [-20, -62], [-15, -76], [-9, -88, "c"], [9, -88, "c"], [15, -76], [20, -62], [23, -48], [24, -34, "c"]]));
  P.push(smooth([[-13, -88], [-12, -93], [0, -95], [12, -93], [13, -88], [0, -86]]));
  P.push(smooth([[-4, -94], [-6, -99], [-3, -104], [0, -110, "c"], [3, -104], [6, -99], [4, -94]]));
  P.push(smooth([[-56, -9, "c"], [-56, -26, "c"], [-24, -26, "c"], [-24, -9, "c"]]));
  P.push(smooth([[-60, -26, "c"], [-50, -38, "c"], [-44, -46], [-40, -52, "c"], [-36, -46], [-30, -38, "c"], [-20, -26, "c"]]));
  P.push(`M -0.8 -108 L -0.8 -134 L 0.8 -134 L 0.8 -108 Z`);
  const wv = Math.sin(f / 14) * 2.5;
  P.push(`M 0.8 -134 C 8 ${-133 + wv} 15 ${-131 - wv} 22 ${-129 + wv} L 14 -125 L 21 ${-121 + wv} C 14 ${-122 - wv} 8 ${-124 + wv} 0.8 -122 Z`);
  return P;
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
const objPaths = (o: SWObj, f: number): string[] => o.kind === "hut" ? [hut(o.x, o.y, 64 * o.s, 0.9 + rnd(o.seed, 74) * 0.3)] : o.kind === "palm" ? palm(o.x, o.y, (150 + 60 * rnd(o.seed, 75)) * o.s, rnd(o.seed, 76) - 0.5, f / 40 + o.seed) : roundTree(o.x, o.y, (110 + 50 * rnd(o.seed, 77)) * o.s, o.seed);
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
const SW_BANYAN = (() => {
  const P: string[] = [];
  const lobes: [number, number, number, number][] = [[1860, 250, 190, 100], [1700, 300, 130, 70], [1930, 380, 150, 84], [1780, 180, 120, 66], [1620, 360, 80, 40], [1960, 150, 130, 70], [1760, 380, 110, 50]];
  lobes.forEach(([cx, cy, rx, ry], j) => { const pts: Pt[] = []; for (let i = 0; i < 150; i++) { const a = (i / 150) * Math.PI * 2, b = 1 + 0.06 * Math.sin(a * 7 + j) + 0.04 * Math.sin(a * 17 + j * 2) + 0.035 * Math.pow(Math.abs(Math.sin(a * 41 + j)), 2) + 0.025 * Math.abs(Math.sin(a * 73 + j * 3)) + 0.03 * (rnd(i, 86 + j) - 0.5); pts.push([cx + Math.cos(a) * rx * b, cy + Math.sin(a) * ry * b]); } P.push(smooth(pts)); });
  P.push(smooth([[1780, 1000, "c"], [1790, 860], [1786, 720], [1772, 580], [1748, 460], [1780, 430], [1806, 500], [1826, 420], [1856, 430], [1846, 560], [1856, 720], [1872, 860], [1904, 990, "c"]]));
  P.push(ribbon(dense([[1772, 500], [1700, 440], [1630, 410]], 6), 22, 8));
  P.push(ribbon(dense([[1846, 500], [1910, 450], [1980, 430]], 6), 24, 10));
  return P;
})();
const SW_ROOTS = (() => { const P: string[] = []; for (let i = 0; i < 9; i++) { const x = 1640 + i * 34 + rnd(i, 87) * 14, y0 = 400 + rnd(i, 88) * 40, L = 120 + rnd(i, 89) * 300; P.push(ribbon([[x, y0], [x + 3, y0 + L * 0.5], [x + 1, y0 + L]], 2.6, 1.2)); } return P.join(" "); })();
const SW_TUFTS = (() => { const P: string[] = []; for (let i = 0; i < 46; i++) { const x = -20 + i * 44 + rnd(i, 90) * 20, y = 1004 + Math.sin(i * 0.3) * 10 + (x > 700 && x < 1300 ? 34 : x > 1300 ? 0 : 0); for (let k = 0; k < 5; k++) { const a = -0.9 + k * 0.45 + (rnd(i * 5 + k, 91) - 0.5) * 0.3, L = 18 + rnd(i * 5 + k, 92) * 26; P.push(ribbon([[x + k * 2, y + 6], [x + k * 2 + Math.sin(a) * L * 0.5, y + 6 - L * 0.55], [x + k * 2 + Math.sin(a) * L, y + 6 - L]], 3.4, 0.3)); } } return P.join(" "); })();

const SWLand: React.FC<{f: number; lit: boolean; id: string; shadowK: number}> = ({f, lit, id, shadowK}) => {
  const light: [number, number] = [-1, -0.2];
  const T = lit
    ? {mtn: "#8A5868", mtn2: "#5C3852", plain: "#3C2440", hillL: "#2E1B36", hillR: "#2C1A35", fields: ["#36213C", "#3D2642", "#311E38", "#442A47"], furrow: "#F4BE72", fo: 0.2, hedge: "#22142A", obj: "#1E1226", ridge: "#120A18", tree: "#0F0815"}
    : {mtn: "#3A3258", mtn2: "#2A2446", plain: "#221C3C", hillL: "#17122A", hillR: "#161129", fields: ["#1E1832", "#231C38", "#1B152E", "#261F3C"], furrow: "#120E22", fo: 0.5, hedge: "#120E22", obj: "#110C1C", ridge: "#0B0712", tree: "#0A0610"};
  const R = (paths: string[], fill: string, w = 2.2, rimCol = "#FFCF8A") => lit ? <Rimmed paths={paths} fill={fill} light={light} w={w} rim={rimCol}/> : <g>{paths.map((d, i) => <path key={i} d={d} fill={fill}/>)}</g>;
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
      <g transform="translate(1330 542) scale(0.98)">{R(templeD(f), lit ? "#1E1226" : "#120C1E", 2.6, "#FFD9A0")}</g>
      {fields(true)}
      {/* field edges: a fine line of light where one field meets the next */}
      {lit ? <path d={SW_FIELDS.filter((p) => p.t > 0.1).map((p) => p.d).join(" ")} fill="none" stroke="#F2B46A" strokeWidth={0.7} opacity={0.08}/> : null}
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
      {lit ? <g fill="#0E0816" opacity={0.4}>{SW_VILLAGES.map((o, i) => { const h = objH(o), L = h * shadowK, w = h * 0.22; return <ellipse key={i} cx={o.x + L / 2} cy={o.y + 1} rx={L / 2 + w * 0.3} ry={Math.max(0.6, w * 0.16)}/>; })}</g> : null}
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
      <path d={SW_ROOTS} fill={T.tree}/>
      {R(SW_BANYAN, T.tree, 3.2)}
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
        <linearGradient id={`${id}-sweep`} gradientUnits="userSpaceOnUse" x1={sweep - 520} y1={300} x2={sweep} y2={620}><stop offset="0" stopColor="#FFF"/><stop offset="0.55" stopColor="#FFF" stopOpacity={0.55}/><stop offset="1" stopColor="#FFF" stopOpacity={0}/></linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x={-200} y={-200} width={W + 400} height={H + 400}><rect x={-200} y={-200} width={W + 400} height={H + 400} fill={`url(#${id}-sweep)`}/></mask>
        <linearGradient id={`${id}-front`} gradientUnits="userSpaceOnUse" x1={sweep - 520 - fx * 300} y1={300 - fy * 300} x2={sweep} y2={620}><stop offset="0" stopColor="#FFD08A" stopOpacity={0}/><stop offset="0.7" stopColor="#FFD08A" stopOpacity={0.22}/><stop offset="1" stopColor="#FFD08A" stopOpacity={0}/></linearGradient>
        <Lin id={`${id}-rvd`} user x1={0} y1={SW_HY} x2={0} y2={H} stops={[[0, "#9A94C4"], [0.12, "#6A6A9E"], [0.4, "#3A3E70"], [1, "#1A1E3C"]]}/>
        <Lin id={`${id}-rvl`} user x1={0} y1={SW_HY} x2={0} y2={H} stops={[[0, "#FFF8E4"], [0.1, "#FFE2A8"], [0.26, "#F2AA6C"], [0.45, "#B4646A"], [0.68, "#5E3A66"], [1, "#2E2650"]]}/>
        <Lin id={`${id}-pdd`} user x1={0} y1={SW_HY} x2={0} y2={H} stops={[[0, "#7E7AAA"], [0.2, "#4E4E80"], [0.6, "#30305A"], [1, "#242648"]]}/>
        <Lin id={`${id}-pdl`} user x1={0} y1={SW_HY} x2={0} y2={H} stops={[[0, "#FFEBC0"], [0.15, "#F2BC80"], [0.42, "#B86A5C"], [1, "#4E2E50"]]}/>
        <Lin id={`${id}-hzd`} user x1={0} y1={SW_HY - 4} x2={0} y2={SW_HY + 416} stops={[[0, "#7C74A6", 0.62], [0.12, "#6A6496", 0.36], [0.4, "#4A4478", 0.12], [1, "#4A4478", 0]]}/>
        <Lin id={`${id}-hzl`} user x1={0} y1={SW_HY - 4} x2={0} y2={SW_HY + 416} stops={[[0, "#FFD6A8", 0.6], [0.12, "#F2A880", 0.34], [0.4, "#B8606A", 0.1], [1, "#B8606A", 0]]}/>
        <Rad id={`${id}-lamp`} stops={soft("#FFC870", 0.55, 2.2)}/>
        <Rad id={`${id}-side`} user cx={sunX} cy={SW_HY + 30} r={1300} tr={`translate(${sunX} ${SW_HY + 30}) scale(1 0.55) translate(${-sunX} ${-SW_HY - 30})`} stops={[[0, "#FFD08A", 0.34], [0.3, "#F2A060", 0.16], [0.7, "#C2553A", 0.04], [1, "#C2553A", 0]]}/>
        <Lin id={`${id}-mist`} stops={[[0, "#F0BCA0", 0], [0.5, "#F0BCA0", 0.5], [1, "#F0BCA0", 0]]}/>
        <Lin id={`${id}-mistd`} stops={[[0, "#5E5A8A", 0], [0.5, "#5E5A8A", 0.42], [1, "#5E5A8A", 0]]}/>
        <Lin id={`${id}-glow`} user x1={0} y1={SW_HY - 120} x2={0} y2={H} stops={[[0, "#FFC27A", 0], [0.12, "#FFC27A", 0.3], [0.25, "#E88A58", 0.12], [0.55, "#8E3D52", 0.04], [1, "#8E3D52", 0]]}/>
      </defs>
      <Sky mood={mood} sun={[sunX, sunY]} sunR={sunR} f={f} rays={0.5} id={id + "k"} stars={mood === "dawn" ? 0.25 * (1 - e) : 0}/>
      <Flock f={f + 400} light={[-1, 0]} y={230} count={5} scale={0.22} seed={2}/>
      <SWLand f={f} lit={false} id={id} shadowK={shadowK}/>
      <rect x={-200} y={SW_HY + 24} width={W + 400} height={100} fill={`url(#${id}-mistd)`} opacity={0.5}/>
      <g mask={`url(#${id}-m)`}>
        <SWLand f={f} lit id={id} shadowK={shadowK}/>
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
const deodar = (x: number, y: number, h: number): string => { const pts: Pt[] = [[x, y - h, "c"]]; const tiers = 7; for (let k = 1; k <= tiers; k++) { const v = k / tiers, w = h * 0.2 * v + h * 0.03; pts.push([x + w, y - h + h * v * 0.92, "c"], [x + w * 0.45, y - h + h * v * 0.92 - h * 0.03, "c"]); } const right = pts.slice(1); const left = right.map((p) => [2 * x - p[0], p[1], "c"] as Pt).reverse(); return smooth([pts[0], ...right, [x + h * 0.03, y, "c"], [x - h * 0.03, y, "c"], ...left]); };
const GPeak: GV = ({f, u, id}) => {
  const glow = 0.7 + 0.3 * ss(u);
  const forest = (() => { const P: string[] = []; for (let i = 0; i < 46; i++) { const x = -40 + i * 44 + rnd(i, 27) * 30, h = 110 + rnd(i, 28) * 120 + (Math.abs(x - 960) > 500 ? 60 : 0); P.push(deodar(x, 1090, h)); } return P.join(" "); })();
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
      <Rimmed paths={[forest]} fill="#0E0A18" light={[-0.6, -1]} w={1.6} rim="#D89A7A"/>
    </g>
  );
};
// --- the sun: half risen behind ranges of hills, mist in the valleys, birds crossing its face
const GSun: GV = ({f, u, id, mood}) => {
  const sy = lerp(650, 600, ss(u));
  const R = (y0: number, amp: number, seed: number, sc: number) => range(y0, amp, seed, sc);
  const layers: [number, number, number, number, string, string][] = [[668, 46, 41, 260, "#9A5866", "#FFE0A8"], [736, 74, 43, 220, "#5E3450", "#FFC27A"], [826, 96, 47, 200, "#33203E", "#F2A462"], [930, 120, 53, 180, "#170C1E", "#E8925A"]];
  const trees = (() => { const P: string[] = []; for (let i = 0; i < 9; i++) { const x = 1460 + i * 52 + rnd(i, 61) * 30; P.push(deodar(x, 900 - Math.pow(ridged(x / 180, 53), 1.4) * 120 + 30, 70 + rnd(i, 62) * 70)); } return P.join(" "); })();
  return (
    <g>
      <defs><Lin id={`${id}-mist`} stops={[[0, "#F2B48A", 0], [0.55, "#F2B48A", 0.5], [1, "#F2B48A", 0]]}/></defs>
      <Sky mood={mood && mood !== "night" ? mood : "gold"} sun={[960, sy]} sunR={150} f={f} rays={0.75} id={id + "s"} stars={0} clouds={0.45}/>
      {layers.map(([y0, amp, seed, sc, col, rim], k) => <g key={k}>
        <Rimmed paths={[R(y0, amp, seed, sc)]} fill={col} light={[0, -1]} w={1.6} rim={rim}/>
        {k < 3 ? <rect x={-100} y={y0 - 30 + k * 6} width={W + 200} height={90 + k * 20} fill={`url(#${id}-mist)`} opacity={0.55 - k * 0.1} transform={`translate(${Math.sin(f / 90 + k) * 18} 0)`}/> : null}
      </g>)}
      <Rimmed paths={[trees]} fill="#170C1E" light={[-0.5, -1]} w={1.6} rim="#E8925A"/>
      <Flock f={f + 120} light={[0, -1]} y={500} count={5} scale={0.34} seed={4}/>
      <Dust f={f} sun={[960, sy]} n={60} y0={300} y1={900}/>
    </g>
  );
};
// --- the Ganga: dusk at the ghats; havelis and temple spires on the bank, steps into the water, lamps floating
const GH_WL = 652;
const GHATS = (() => {
  const P: string[] = [], win: number[][] = [], umb: string[] = [];
  let x = -80;
  while (x < 1250) {
    const sc = lerp(1, 0.42, clamp01((x + 80) / 1330)), base = GH_WL - 64 * sc, w = (60 + rnd(x, 41) * 90) * sc, k = rnd(x, 42), h = (110 + rnd(x, 43) * 150) * sc, top = base - h;
    P.push(`M ${n1(x)} ${n1(base + 2)} L ${n1(x)} ${n1(top)} L ${n1(x + w)} ${n1(top)} L ${n1(x + w)} ${n1(base + 2)} Z`);
    P.push(`M ${n1(x - 3 * sc)} ${n1(top)} L ${n1(x + w + 3 * sc)} ${n1(top)} L ${n1(x + w + 3 * sc)} ${n1(top - 5 * sc)} L ${n1(x - 3 * sc)} ${n1(top - 5 * sc)} Z`);
    if (k < 0.28) {      // a temple spire
      const c = x + w / 2, sh = h * 0.95, bw = w * 0.36;
      P.push(smooth([[c - bw, top, "c"], [c - bw * 0.96, top - sh * 0.3], [c - bw * 0.7, top - sh * 0.62], [c - bw * 0.3, top - sh * 0.9, "c"], [c + bw * 0.3, top - sh * 0.9, "c"], [c + bw * 0.7, top - sh * 0.62], [c + bw * 0.96, top - sh * 0.3], [c + bw, top, "c"]]));
      P.push(smooth([[c - bw * 0.42, top - sh * 0.9], [c, top - sh * 0.97], [c + bw * 0.42, top - sh * 0.9], [c, top - sh * 0.86]]));
      P.push(`M ${n1(c - 1)} ${n1(top - sh * 0.95)} L ${n1(c - 1)} ${n1(top - sh * 0.95 - 30 * sc)} L ${n1(c + 1)} ${n1(top - sh * 0.95 - 30 * sc)} L ${n1(c + 1)} ${n1(top - sh * 0.95)} Z M ${n1(c + 1)} ${n1(top - sh * 0.95 - 30 * sc)} L ${n1(c + 18 * sc)} ${n1(top - sh * 0.95 - 25 * sc)} L ${n1(c + 1)} ${n1(top - sh * 0.95 - 20 * sc)} Z`);
    } else if (k < 0.5) { // a dome
      const c = x + w / 2, r = w * 0.34;
      P.push(smooth([[c - r, top, "c"], [c - r * 1.02, top - r * 0.6], [c - r * 0.7, top - r * 1.1], [c, top - r * 1.38, "c"], [c + r * 0.7, top - r * 1.1], [c + r * 1.02, top - r * 0.6], [c + r, top, "c"]]));
      P.push(`M ${n1(c - 0.8)} ${n1(top - r * 1.38)} L ${n1(c - 0.8)} ${n1(top - r * 1.38 - 14 * sc)} L ${n1(c + 0.8)} ${n1(top - r * 1.38 - 14 * sc)} L ${n1(c + 0.8)} ${n1(top - r * 1.38)} Z`);
    } else if (k < 0.82) { // chhatris on the roof
      for (const cx of [x + w * 0.22, x + w * 0.78]) { const r = Math.max(4, w * 0.11); P.push(`M ${n1(cx - r)} ${n1(top - 5 * sc)} L ${n1(cx - r)} ${n1(top - 5 * sc - r * 1.4)} L ${n1(cx + r)} ${n1(top - 5 * sc - r * 1.4)} L ${n1(cx + r)} ${n1(top - 5 * sc)} Z`); P.push(smooth([[cx - r * 1.3, top - 5 * sc - r * 1.4, "c"], [cx - r * 1.1, top - 5 * sc - r * 2.2], [cx, top - 5 * sc - r * 2.7, "c"], [cx + r * 1.1, top - 5 * sc - r * 2.2], [cx + r * 1.3, top - 5 * sc - r * 1.4, "c"]])); }
    }
    // jharokha balconies and windows (some lit)
    const rows = Math.max(1, Math.round(h / (40 * sc))), cols = Math.max(1, Math.round(w / (26 * sc)));
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (rnd(x + r * 7 + c, 44) < 0.32) win.push([x + (c + 0.5) * w / cols, top + (r + 0.6) * h / rows, 5 * sc + 1.5]);
    x += w + (2 + rnd(x, 45) * 10) * sc;
  }
  // the steps down to the water, wide and receding
  for (let i = 0; i < 12; i++) { const v = i / 12, y0 = GH_WL - 64 + v * 64, y1 = GH_WL - 64 * 0.42 + v * 64 * 0.42; P.push(`M -80 ${n1(y0)} L 1250 ${n1(y1)} L 1250 ${n1(y1 + 1.6)} L -80 ${n1(y0 + 2.6)} Z`); }
  P.push(`M -80 ${GH_WL - 64} L 1250 ${n1(GH_WL - 64 * 0.42)} L 1290 ${GH_WL} L -80 ${GH_WL} Z`);
  // bamboo umbrellas on the steps
  [[60, 1], [250, 0.9], [470, 0.8], [700, 0.68], [930, 0.56]].forEach(([ux, s]) => { const uy = GH_WL - 30 * s; umb.push(`M ${n1(ux - 1.2 * s)} ${n1(uy)} L ${n1(ux - 1.2 * s)} ${n1(uy - 40 * s)} L ${n1(ux + 1.2 * s)} ${n1(uy - 40 * s)} L ${n1(ux + 1.2 * s)} ${n1(uy)} Z`); umb.push(smooth([[ux - 30 * s, uy - 38 * s, "c"], [ux - 20 * s, uy - 50 * s], [ux, uy - 56 * s, "c"], [ux + 20 * s, uy - 50 * s], [ux + 30 * s, uy - 38 * s, "c"]])); });
  return {d: P.join(" "), win, umb: umb.join(" ")};
})();
const GRiver: GV = ({f, u, id, mood}) => {
  const WL = GH_WL;
  const lamps = Array.from({length: 40}, (_, i) => { const z = 0.08 + Math.pow(rnd(i, 46), 1.4) * 0.95, x = ((rnd(i, 47) * 2600 + f * (0.25 + 0.6 * z)) % 2500) - 280, y = WL + 6 + z * 410; return {x, y, z, i}; }).sort((a, b) => a.y - b.y);
  return (
    <g>
      <defs>
        <Lin id={`${id}-water`} user x1={0} y1={WL} x2={0} y2={H} stops={[[0, "#EE9E6E"], [0.1, "#A85A62"], [0.35, "#4A2C56"], [1, "#120C22"]]}/>
        <linearGradient id={`${id}-fade`} gradientUnits="userSpaceOnUse" x1={0} y1={WL} x2={0} y2={WL + 300}><stop offset="0" stopColor="#FFF" stopOpacity={0.8}/><stop offset="1" stopColor="#FFF" stopOpacity={0}/></linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x={-100} y={WL} width={W + 200} height={420}><rect x={-100} y={WL} width={W + 200} height={420} fill={`url(#${id}-fade)`}/></mask>
        <Rad id={`${id}-lamp`} stops={soft("#FFC870", 0.8, 2.2)}/>
        <Lin id={`${id}-fl`} x1={0} y1={1} x2={0} y2={0} stops={[[0, "#FFFBEA"], [0.4, "#FFD27A"], [1, "#F07A3A", 0.3]]}/>
        <Lin id={`${id}-streak`} x1={0} y1={0} x2={0} y2={1} stops={[[0, "#FFD27A", 0.75], [1, "#FFD27A", 0]]}/>
      </defs>
      <Sky mood={mood && mood !== "night" ? mood : "dusk"} sun={[1580, 624]} sunR={58} f={f} rays={0.35} id={id + "s"}/>
      <path d={`M 1180 ${WL - 3} Q 1560 ${WL - 12} 1980 ${WL - 7} L 1980 ${WL + 2} L 1180 ${WL + 2} Z`} fill="#3A1E36"/>
      <rect x={-100} y={WL} width={W + 200} height={H - WL + 100} fill={`url(#${id}-water)`}/>
      {/* the bank mirrored in the water, fading and broken by ripples */}
      <g mask={`url(#${id}-m)`}><path d={GHATS.d} fill="#1E1026" transform={`translate(0 ${2 * WL}) scale(1 -1)`}/>
        {GHATS.win.map(([x, y, s], i) => <rect key={i} x={x - s * 0.3} y={2 * WL - y} width={s * 0.6} height={s * 2.4} fill="#FFC870" opacity={0.35}/>)}</g>
      {Array.from({length: 70}, (_, i) => { const y = WL + 3 + Math.pow(rnd(i, 48), 1.5) * 300, w = 40 + rnd(i, 49) * 260, x = rnd(i, 50) * 1400 - 100 + Math.sin(f / 26 + i) * 8; return <rect key={i} x={x} y={y} width={w} height={1 + (y - WL) / 160} fill="#B86A6A" opacity={0.55}/>; })}
      <Rimmed paths={[GHATS.d, GHATS.umb]} fill="#1C1024" light={[1, -0.35]} w={1.5} rim="#FFB874"/>
      <path d={Array.from({length: 12}, (_, i) => { const v = i / 12; return `M -80 ${n1(GH_WL - 64 + v * 64)} L 1250 ${n1(GH_WL - 64 * 0.42 + v * 64 * 0.42)}`; }).join(" ")} fill="none" stroke="#FFB874" strokeWidth={0.9} opacity={0.32}/>
      {GHATS.win.map(([x, y, s], i) => <path key={i} d={`M ${n1(x - s * 0.35)} ${n1(y + s * 0.6)} L ${n1(x - s * 0.35)} ${n1(y - s * 0.2)} A ${n1(s * 0.35)} ${n1(s * 0.4)} 0 0 1 ${n1(x + s * 0.35)} ${n1(y - s * 0.2)} L ${n1(x + s * 0.35)} ${n1(y + s * 0.6)} Z`} fill="#FFC870" opacity={0.6 + 0.3 * Math.sin(f / (8 + i % 5) + i)}/>)}
      {Array.from({length: 46}, (_, i) => { const y = WL + 6 + Math.pow(rnd(i, 51), 1.6) * 420, w = 30 + (y - WL) * 0.5 * rnd(i, 52), x = 900 + rnd(i, 53) * 1100 + Math.sin(f / 30 + i) * 10; return <rect key={i} x={x} y={y} width={w} height={1 + (y - WL) / 200} rx={1} fill="#F6B888" opacity={0.3 * (1 - (y - WL) / 500)}/>; })}
      {lamps.map((l) => { const s = 0.3 + l.z * 1.25, fl = 0.9 + 0.1 * Math.sin(f / 5 + l.i); return <g key={l.i}>
        <ellipse cx={l.x} cy={l.y + 12 * s} rx={5 * s} ry={14 * s} fill={`url(#${id}-streak)`} opacity={0.5}/>
        <circle cx={l.x} cy={l.y - 6 * s} r={36 * s} fill={`url(#${id}-lamp)`} opacity={fl}/>
        <path d={`M ${n1(l.x - 10 * s)} ${n1(l.y - 3 * s)} Q ${n1(l.x)} ${n1(l.y + 6 * s)} ${n1(l.x + 10 * s)} ${n1(l.y - 3 * s)} Z`} fill="#1A0E1C"/>
        <path d={`M ${n1(l.x)} ${n1(l.y - 4 * s)} q ${n1(-3.6 * s)} ${n1(-5 * s)} 0 ${n1(-15 * s * fl)} q ${n1(3.6 * s)} ${n1(10 * s * fl)} 0 ${n1(15 * s * fl)} Z`} fill={`url(#${id}-fl)`}/>
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
      <path d={`M 1074 851 Q 1086 860 1098 851 Z`} fill="#140A1A"/>
      <path d={`M 1086 850 q -4 -6 0 -${n1(17 + Math.sin(f / 4))} q 4 ${n1(11 + Math.sin(f / 4))} 0 ${n1(17 + Math.sin(f / 4))} Z`} fill={`url(#${id}-df)`}/>
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
// --- silence: a dark sky with nothing in it but a faint glow and a few stars
const GSilence: GV = ({f, u, id}) => (
  <g>
    <defs><Lin id={`${id}-sky`} stops={[[0, "#04030A"], [0.6, "#0B0920"], [1, "#16112E"]]}/><Rad id={`${id}-g`} stops={soft("#6A5A9A", 0.18, 2)}/></defs>
    <rect x={-100} y={-100} width={W + 200} height={H + 200} fill={`url(#${id}-sky)`}/>
    <Glow x={960} y={760} r={900} ry={300} fill={`${id}-g`}/>
    <Stars f={f} n={90} yMax={900} o={0.6}/>
  </g>
);
const GLetter: React.FC<{f: number; u: number; id: string; text: string}> = ({f, u, id, text}) => (
  <g>
    <defs><Lin id={`${id}-sky`} stops={[[0, "#0B0820"], [0.6, "#1A1438"], [1, "#221A40"]]}/><Rad id={`${id}-g`} stops={soft("#FFD08A", 0.35, 2.2)}/></defs>
    <rect x={-100} y={-100} width={W + 200} height={H + 200} fill={`url(#${id}-sky)`}/>
    <g transform={`translate(960 520) rotate(${f * 0.03})`} opacity={0.5}>{[1, 3, 5].map((k) => <path key={k} d={RINGS[k]} fill="none" stroke="#E8B65A" strokeWidth={1}/>)}</g>
    <Glow x={960} y={500} r={360} fill={`${id}-g`} o={0.6 + 0.4 * ss(u * 2)}/>
    <text x={960} y={600} textAnchor="middle" fontFamily={SA} fontSize={300} fill="url(#k-gold)" opacity={ss(u * 3)}>{text}</text>
  </g>
);
const GITEMS: Record<string, GV> = {sun: GSun, peak: GPeak, river: GRiver, ashvattha: GTree, ocean: GOcean, lion: GLion, silence: GSilence};
const GALIAS: Record<string, string> = {surya: "sun", light: "sun", himalaya: "peak", meru: "peak", mountain: "peak", mountains: "peak", ganga: "river", ganges: "river", tree: "ashvattha", peepal: "ashvattha", pipal: "ashvattha", sea: "ocean", lions: "lion", beasts: "lion", a: "letter", letters: "letter", secrets: "silence"};
const Glories: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const id = useUid("czg");
  if (s.variant === "sparks") return <Sparks s={s} n={n} f={f} id={id}/>;
  const req: string[] = (Array.isArray(s.items) ? s.items : []).map((x: any) => String(x).toLowerCase().trim()).map((x: string) => GALIAS[x] || x).filter((x: string) => GITEMS[x] || (x === "letter" && s.text));
  const count = Math.max(4, Math.min(6, Math.round(n / 80)));
  const items = req.length ? req : ["sun", "peak", "river", "ashvattha", "ocean", "lion"].slice(0, count);
  const m = items.length, seg = n / m, ov = Math.min(40, seg * 0.45);
  const labels: string[] = Array.isArray(s.labels) ? s.labels : [];
  return (
    <Frame f={f} zoom={1}>
      <defs><Rad id={`${id}-lb`} stops={soft("#07040C", 0.55, 1.6)}/></defs>
      {items.map((k, i) => {
        const a = i * seg, b = (i + 1) * seg;
        const o = i === 0 ? 1 - span(f, b - ov / 2, b + ov / 2) : i === m - 1 ? span(f, a - ov / 2, a + ov / 2) : span(f, a - ov / 2, a + ov / 2) * (1 - span(f, b - ov / 2, b + ov / 2));
        if (o <= 0.001) return null;
        const lu = clamp01((f - a + ov / 2) / (seg + ov)), z = 1 + 0.06 * lu;
        const V = GITEMS[k];
        return <g key={i} opacity={o}>
          <g transform={`translate(960 560) scale(${z}) translate(-960 -560)`}>{k === "letter" ? <GLetter f={f} u={lu} id={`${id}-${i}`} text={String(s.text)}/> : <V f={f} u={lu} id={`${id}-${i}`} mood={s.mood ? moodOf(s.mood, "dusk") : undefined}/>}</g>
          {labels[i] ? <ellipse cx={960} cy={870} rx={300} ry={34} fill={`url(#${id}-lb)`} opacity={span(f, a + ov * 0.3, a + ov * 1.2) * (i === m - 1 ? 1 : 1 - span(f, b - ov, b - ov * 0.2))}/> : null}
          {labels[i] ? <text x={960} y={880} textAnchor="middle" fontFamily={CAPS} fontSize={30} letterSpacing={8} fill="#F2D49A" opacity={0.9 * span(f, a + ov * 0.3, a + ov * 1.2) * (i === m - 1 ? 1 : 1 - span(f, b - ov, b - ov * 0.2))} style={{textShadow: "0 0 12px rgba(0,0,0,.8)"}}>{String(labels[i]).toUpperCase()}</text> : null}
        </g>;
      })}
    </Frame>
  );
};
// --- sparks (10.41): one fire in a brick altar; sparks fly up from it and each settles in the sky as a star
const NSPARK = 110;
const flameTongue = (dx: number, h: number, w: number, sw: number): string => smooth([[dx - w, 0], [dx - w * 0.95, -h * 0.25], [dx - w * 0.55 + sw * 0.3, -h * 0.55], [dx - w * 0.18 + sw * 0.7, -h * 0.82], [dx + sw, -h, "c"], [dx + w * 0.22 + sw * 0.6, -h * 0.78], [dx + w * 0.6 + sw * 0.3, -h * 0.5], [dx + w * 0.95, -h * 0.22], [dx + w, 0]]);
const Sparks: React.FC<{s: any; n: number; f: number; id: string}> = ({s, n, f, id}) => {
  const fire: [number, number] = [960, 846];
  const span0 = Math.max(60, n - 70);
  const labels: string[] = Array.isArray(s.labels) ? s.labels : [];
  // the altar: three stepped tiers seen a little from above; brick courses on the faces
  const tiers: [number, number, number][] = [[170, 0, 26], [134, -26, 22], [100, -48, 18]];
  const faces = tiers.map(([w, y, h]) => smooth([[-w, y, "c"], [-w, y - h, "c"], [w, y - h, "c"], [w, y, "c"]]));
  const tops = tiers.map(([w, y, h]) => smooth([[-w, y - h, "c"], [-w + 16, y - h - 9, "c"], [w - 16, y - h - 9, "c"], [w, y - h, "c"]]));
  const bricks = tiers.map(([w, y, h]) => { const P: string[] = []; for (let r = 1; r < 3; r++) P.push(`M ${-w} ${n1(y - (h * r) / 3)} L ${w} ${n1(y - (h * r) / 3)}`); for (let r = 0; r < 3; r++) for (let x = -w + ((r % 2) * 14) + 14; x < w; x += 28) P.push(`M ${x} ${n1(y - (h * r) / 3)} L ${x} ${n1(y - (h * (r + 1)) / 3)}`); return P.join(" "); }).join(" ");
  const ridgeD = range(902, 70, 71, 260);
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.05)} cx={960} cy={600}>
      <defs>
        <Lin id={`${id}-sky`} stops={s.mood === "dusk" || s.mood === "gold" ? [[0, "#06040E"], [0.5, "#1A1232"], [0.8, "#3E2244"], [1, "#6A2E40"]] : s.mood === "dawn" ? [[0, "#06081A"], [0.5, "#141C3E"], [0.8, "#2E3260"], [1, "#5A4A70"]] : [[0, "#03030A"], [0.5, "#0A0A22"], [0.8, "#1A1636"], [1, "#2E1E3A"]]}/>
        <Rad id={`${id}-fire`} stops={[[0, "#FFE4A0", 0.7], [0.1, "#FFB45A", 0.42], [0.26, "#E0602E", 0.18], [0.55, "#8E2A2A", 0.05], [1, "#8E2A2A", 0]]}/>
        <Lin id={`${id}-fb`} x1={0} y1={1} x2={0} y2={0} stops={[[0, "#FFB45A"], [0.5, "#E8602E", 0.85], [1, "#A8302A", 0]]}/>
        <Lin id={`${id}-fm`} x1={0} y1={1} x2={0} y2={0} stops={[[0, "#FFE2A0"], [0.45, "#FFB45A"], [0.8, "#F07A3A", 0.6], [1, "#E0602E", 0]]}/>
        <Lin id={`${id}-fc`} x1={0} y1={1} x2={0} y2={0} stops={[[0, "#FFFFF4"], [0.5, "#FFF0C0"], [1, "#FFD27A", 0]]}/>
        <Rad id={`${id}-sp`} stops={soft("#FFC870", 0.9, 2.2)}/>
        <Rad id={`${id}-st`} stops={soft("#FFF6E0", 0.85, 2.4)}/>
        <Lin id={`${id}-gnd`} user x1={0} y1={838} x2={0} y2={H} stops={[[0, "#24142A"], [0.3, "#140A18"], [1, "#05030A"]]}/>
      </defs>
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={`url(#${id}-sky)`}/>
      <Stars f={f} n={60} yMax={760} o={0.4}/>
      {/* the sparks: born from the fire, they drift up on wavering paths, cool from ember to gold to white, then hold as stars */}
      {Array.from({length: NSPARK}, (_, i) => {
        const t0 = rnd(i, 81) * span0 * 0.95, dur = 70 + rnd(i, 82) * 60, life = (f - t0) / dur;
        if (life <= 0) return null;
        const tx = 80 + rnd(i, 83) * (W - 160), ty = 60 + Math.pow(rnd(i, 84), 1.3) * 600, side = (rnd(i, 85) - 0.5) * 260;
        const p = Math.min(1, life), e = 1 - Math.pow(1 - p, 2.4);
        const c1: [number, number] = [fire[0] + side, fire[1] - 320], c2: [number, number] = [tx - (tx - fire[0]) * 0.25, ty + 160];
        const bz = (k: number): [number, number] => { const v = 1 - k, wob = Math.sin(k * 9 + i) * 18 * k * (1 - k); return [v * v * v * fire[0] + 3 * v * v * k * c1[0] + 3 * v * k * k * c2[0] + k * k * k * tx + wob, v * v * v * (fire[1] - 130) + 3 * v * v * k * c1[1] + 3 * v * k * k * c2[1] + k * k * k * ty]; };
        const [x, y] = bz(e), big = Math.pow(rnd(i, 86), 4);
        if (p < 1) {
          const tail = [0.012, 0.026].map((d) => bz(Math.max(0, e - d)));
          const col = mix("#FF8A3A", "#FFF4D8", e), fl = 0.75 + 0.25 * Math.sin(f * 0.9 + i * 3);
          return <g key={i} opacity={fl}>
            <path d={ribbon([[x, y], ...tail.map((q) => [q[0], q[1]])], 2 + big * 1.6, 0.2)} fill={col} opacity={0.6}/>
            <circle cx={x} cy={y} r={7 + big * 9} fill={`url(#${id}-sp)`} opacity={0.6}/>
            <circle cx={x} cy={y} r={1.3 + big * 1.2} fill="#FFFBEA"/>
          </g>;
        }
        const tw = 0.7 + 0.3 * Math.sin(f / (9 + rnd(i, 87) * 12) + i), flash = clamp01(1 - (life - 1) * 4);
        return <g key={i} opacity={tw}>
          <circle cx={x} cy={y} r={(5 + big * 13) * (1 + 0.8 * flash)} fill={`url(#${id}-st)`} opacity={0.6 + 0.3 * flash}/>
          <circle cx={x} cy={y} r={0.9 + big * 1.7} fill="#FFFBF0"/>
          {big > 0.55 ? <path d={`M ${n1(x - 14 * big)} ${n1(y)} L ${n1(x)} ${n1(y - 0.5)} L ${n1(x + 14 * big)} ${n1(y)} L ${n1(x)} ${n1(y + 0.5)} Z M ${n1(x)} ${n1(y - 10 * big)} L ${n1(x + 0.5)} ${n1(y)} L ${n1(x)} ${n1(y + 10 * big)} L ${n1(x - 0.5)} ${n1(y)} Z`} fill="#FFF6DC" opacity={0.5}/> : null}
        </g>;
      })}
      <Rimmed paths={[ridgeD]} fill="#140C1C" light={[0, -1]} w={1.4} rim="#8E5A6A"/>
      <path d="M -200 1300 L -200 930 Q 480 890 960 852 Q 1440 890 2120 930 L 2120 1300 Z" fill={`url(#${id}-gnd)`}/>
      <Glow x={fire[0]} y={fire[1] - 80} r={820} ry={600} fill={`${id}-fire`} o={0.85 + 0.12 * Math.sin(f / 4) + 0.05 * Math.sin(f / 1.7)}/>
      <ellipse cx={fire[0]} cy={fire[1] + 6} rx={420} ry={40} fill={`url(#${id}-fire)`} opacity={0.8}/>
      {/* the altar */}
      <g transform={`translate(${fire[0]} ${fire[1]}) scale(1.3)`}>
        {faces.map((d, k) => <Rimmed key={k} paths={[d]} fill="#160B18" light={[0, -1]} w={2.2} rim="#FFB060"/>)}
        <path d={bricks} fill="none" stroke="#E8904A" strokeWidth={0.8} opacity={0.18}/>
        {tops.map((d, k) => <path key={k} d={d} fill="#5A2A2A" opacity={0.7}/>)}
      </g>
      {/* the flames: deep tongues behind, gold in the middle, a white heart */}
      <g transform={`translate(${fire[0]} ${fire[1]}) scale(1.3) translate(0 -66)`}>
        {[[-60, 0.5, 0.3], [-30, 0.8, 1.1], [0, 1, 2.3], [34, 0.85, 3.1], [62, 0.5, 4.4]].map(([dx, k, ph], j) => { const h = 190 * k * (0.84 + 0.12 * Math.sin(f / 4.2 + ph) + 0.07 * Math.sin(f / 1.9 + ph * 2)); return <path key={j} d={flameTongue(dx, h, 44 * k, Math.sin(f / 7 + ph) * 16 * k)} fill={`url(#${id}-fb)`} opacity={0.85}/>; })}
        {[[-36, 0.62, 0.8], [-8, 0.86, 1.9], [24, 0.7, 2.7], [48, 0.42, 3.6]].map(([dx, k, ph], j) => { const h = 170 * k * (0.84 + 0.14 * Math.sin(f / 3.6 + ph) + 0.07 * Math.sin(f / 1.6 + ph * 2)); return <path key={j} d={flameTongue(dx, h, 32 * k, Math.sin(f / 6 + ph) * 12 * k)} fill={`url(#${id}-fm)`} opacity={0.9}/>; })}
        <path d={flameTongue(2, 92 + 8 * Math.sin(f / 3), 30, Math.sin(f / 5) * 6)} fill={`url(#${id}-fc)`}/>
        <path d="M -66 6 L 22 -8 L 25 -2 L -63 11 Z M 58 5 L -16 -10 L -19 -4 L 55 10 Z M -20 8 L 44 -2 L 45 3 L -19 12 Z" fill="#1A0C14" opacity={0.8}/>
        {Array.from({length: 14}, (_, k) => <circle key={k} cx={-60 + k * 9 + Math.sin(k * 2.3) * 4} cy={4 + Math.sin(k * 1.7) * 3} r={1.6 + (k % 3)} fill="#FFC870" opacity={0.5 + 0.5 * Math.sin(f / 3 + k * 1.9)}/>)}
      </g>
      {labels[0] ? <text x={960} y={140} textAnchor="middle" fontFamily={CAPS} fontSize={30} letterSpacing={8} fill="#F2D49A" opacity={0.85 * span(f, 20, 60)}>{String(labels[0]).toUpperCase()}</text> : null}
    </Frame>
  );
};

// ================================================================================================================
// FIELD (Gita 13): the field and the knower of the field. A vast field of grain under the night sky, wind running
// through it in waves; one steady light above it, watching. Below, the field grows, ripens, is harvested and lies
// bare; the light never changes. s.variant "ripe" | "growth" | "harvest" | "bare" holds one stage for the whole beat.
// ================================================================================================================
const FH = 636;
type FState = {g: number; front: number; sheaf: number; stub: number; furrow: number; sprout: number};
const fieldState = (u: number, v: string): FState => {
  if (v === "ripe") return {g: 1, front: -1e4, sheaf: 0, stub: 1, furrow: 0, sprout: 0};
  if (v === "growth") return {g: 0.12 + 0.88 * ss(u * 1.15), front: -1e4, sheaf: 0, stub: 1, furrow: 0, sprout: 0};
  if (v === "harvest") return {g: 1, front: lerp(-900, 2300, ss(u)), sheaf: 1, stub: 1, furrow: 0, sprout: 0};
  if (v === "bare") return {g: 1, front: 1e5, sheaf: 0, stub: 0, furrow: 1, sprout: ss((u - 0.3) / 0.6)};
  return {g: 0.14 + 0.86 * ss(u / 0.3), front: u < 0.5 ? -1e4 : lerp(-900, 2300, ss((u - 0.5) / 0.26)), sheaf: span(u, 0.52, 0.6) * (1 - span(u, 0.8, 0.88)), stub: 1 - span(u, 0.84, 0.94), furrow: span(u, 0.82, 0.95), sprout: span(u, 0.9, 1.0)};
};
const FROWS = Array.from({length: 34}, (_, k) => { const t = 0.04 + Math.pow(k / 33, 1.7) * 1.3; return {t, y: FH + 6 + 380 * t, k}; });
const FURROWS = Array.from({length: 46}, (_, k) => { const t = 0.02 + Math.pow(k / 45, 1.8) * 1.35; return {t, y: FH + 4 + 380 * t, k}; });
// wind: a wave running diagonally across the field
const wind = (x: number, t: number, f: number) => Math.sin(x / 260 - f / 22 + t * 7) * 0.6 + Math.sin(x / 120 - f / 13 + t * 3.1) * 0.25;
const FieldScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const id = useUid("czf");
  const u = clamp01(f / Math.max(1, n));
  const v: string = ["ripe", "growth", "harvest", "bare"].includes(s.variant) ? s.variant : "cycle";
  const st = fieldState(u, v);
  const mood = moodOf(s.mood, "night");
  const L: [number, number] = [960, 214];
  const rot = f * 0.012;
  const ripe = clamp01((st.g - 0.55) / 0.4);
  const isCut = (x: number, y: number) => x < st.front + (y - FH) * 1.1;
  // the field, row by row from the far edge to us
  const rows = FROWS.map(({t, y, k}) => {
    const sp = 4 + 30 * t, Hrow = 14 + 200 * t, stems: string[] = [], heads: string[][] = [[], [], []], tips: string[][] = [[], [], []], leaves: string[] = [], heaps: string[] = [];
    let standing = 0;
    const top: Pt[] = [[-80, y + 6, "c"]];
    const pool = (x: number) => Math.exp(-Math.pow((x - 960) / (520 + 500 * t), 2));
    for (let x = -60 + rnd(k, 110) * sp; x < W + 60; x += sp * (0.7 + 0.6 * rnd(Math.round(x), 111 + k))) {
      const i = Math.round(x * 7 + k * 1000), yy = y + (rnd(i, 112) - 0.5) * 6 * t, w = wind(x, t, f);
      if (isCut(x, yy)) { const hh = Hrow * 0.1 * st.stub; top.push([x, yy - hh * 0.7]); continue; }
      standing++;
      const h = Hrow * st.g * (0.8 + 0.4 * rnd(i, 113)), bend = 0.16 + 0.2 * w;
      top.push([x, yy - h * (0.5 + 0.12 * rnd(i, 116)) + h * bend * 0.1]);
      const tx = x + h * bend, ty = yy - h * (1 - bend * bend * 0.5);
      stems.push(`M ${n1(x)} ${n1(yy - h * 0.4)} Q ${n1(x + h * bend * 0.3)} ${n1(yy - h * 0.75)} ${n1(tx)} ${n1(ty)}`);
      if (t > 0.45 && rnd(i, 117) < 0.6) { const lb = h * 0.75, la = (rnd(i, 118) < 0.5 ? -1 : 1) * (0.3 + 0.3 * rnd(i, 119)) + bend * 0.8; leaves.push(ribbon([[x, yy - h * 0.3], [x + Math.sin(la) * lb * 0.45, yy - h * 0.3 - lb * 0.5], [x + Math.sin(la) * lb * 0.95 + bend * lb * 0.3, yy - h * 0.3 - lb * 0.55 + lb * 0.25]], 4 + 6 * t, 0.4)); }
      if (ripe < 0.6) { // young shoots: the light catches their tips, like dew
        const shine = clamp01(0.3 + 0.45 * w + 0.45 * pool(x)), b = shine > 0.78 ? 2 : shine > 0.5 ? 1 : 0, q = 0.82;
        tips[b].push(`M ${n1(lerp(x + h * bend * 0.3, tx, q))} ${n1(lerp(yy - h * 0.75, ty, q))} L ${n1(tx)} ${n1(ty)}`);
      }
      if (ripe > 0.15) {
        const shine = clamp01(0.3 + 0.45 * w + 0.45 * pool(x)), b = shine > 0.8 ? 2 : shine > 0.5 ? 1 : 0;
        const hl = (6 + 30 * t) * ripe, dx = hl * (0.45 + 0.3 * bend), dy = hl * 0.9;
        if (t < 0.4) heads[b].push(`M ${n1(tx)} ${n1(ty)} Q ${n1(tx + dx)} ${n1(ty - dy * 0.1)} ${n1(tx + dx * 1.05)} ${n1(ty + dy)}`);
        else { // a drooping panicle of grains
          for (let g = 0; g < 7; g++) { const v2 = (g + 1) / 7.5, px = tx + dx * Math.sin(v2 * 1.4), py = ty - dy * 0.1 + dy * v2 * v2 * 1.1, side = g % 2 ? 1 : -1, r = (1.1 + 1.7 * t) * (0.35 + 0.65 * ripe); heads[b].push(`M ${n1(px + side * r * 0.8 - r)} ${n1(py)} a ${n1(r)} ${n1(r * 0.55)} ${side * 40} 1 0 ${n1(2 * r)} 0 a ${n1(r)} ${n1(r * 0.55)} ${side * 40} 1 0 ${n1(-2 * r)} 0 Z`); }
        }
      }
    }
    top.push([W + 80, y + 6, "c"]);
    // heaps of the harvest left standing in the cut field
    if (st.sheaf > 0.01 && t > 0.15 && k % 4 === 1) for (let x = -40 + rnd(k, 114) * 260; x < W + 40; x += (300 + 260 * rnd(Math.round(x), 115)) * (0.5 + t)) {
      if (!isCut(x + 60, y)) continue;
      const hh = Hrow * 0.42, ww = hh * 1.05, pts: Pt[] = [[x - ww, y + 2, "c"]];
      for (let j = 1; j < 22; j++) { const a = Math.PI - (j / 22) * Math.PI, rr = 1 + 0.025 * Math.sin(j * 2.7 + x) + (j % 2 ? 0.012 : -0.008); pts.push([x + Math.cos(a) * ww * rr * (1 + 0.08 * Math.sin(a)), y - Math.sin(a) * hh * rr * (0.9 + 0.1 * Math.sin(a))]); }
      pts.push([x + ww, y + 2, "c"]);
      heaps.push(smooth(pts));
    }
    return {t, y, k, tips: tips.map((h) => h.join(" ")), mass: standing > 0 || st.stub > 0.05 ? smooth(top, true, 0.3) : "", stems: stems.join(" "), heads: heads.map((h) => h.join(" ")), leaves: leaves.join(" "), heaps: heaps.join(" ")};
  });
  const FB = H + 40, FT = FH + 5, fx = (xb: number, y: number) => 960 + (xb - 960) * clamp01((y - FT) / (FB - FT));
  const furrows = st.furrow > 0.01 ? (() => { const P: string[] = []; for (let xb = -14000; xb <= 16000; xb += 46) { const x0 = fx(xb, FT), x1 = xb; if (x0 < -40 && x1 < -40) continue; if (x0 > W + 40 && x1 > W + 40) continue; P.push(`M ${n1(x0)} ${FT} L ${n1(x1)} ${FB}`); } return P.join(" "); })() : "";
  const sprouts = (() => { if (st.sprout <= 0.01) return ""; const P: string[] = []; FURROWS.forEach(({t, y, k}) => { if (t < 0.22 || k % 2) return; for (let xb = -6000 + (k % 4) * 46; xb <= 8000; xb += 46 * 3) { const x = fx(xb, y) + (rnd(xb, 120 + k) - 0.5) * 6 * t; if (x < -30 || x > W + 30) continue; const h = (4 + 34 * t) * st.sprout * (0.7 + 0.5 * rnd(xb, 122 + k)); for (let b = 0; b < 4; b++) { const a = (b - 1.5) * 0.4 + Math.sin(f / 30 + xb) * 0.05; P.push(ribbon([[x + b * 1.4, y], [x + b * 1.4 + Math.sin(a) * h * 0.35, y - h * 0.55], [x + b * 1.4 + Math.sin(a) * h, y - h * (1 - 0.15 * Math.abs(a))]], 1.2 + 3 * t, 0.2)); } } }); return P.join(" "); })();
  const treeLine = (() => { const pts: Pt[] = [[-60, FH + 4, "c"]]; for (let i = 0; i <= 120; i++) { const x = -60 + i * 17, hh = 4 + 14 * Math.pow(vnoise(i * 0.4, 121), 2) + (vnoise(i * 0.13, 122) > 0.62 ? 16 * vnoise(i * 0.9, 123) : 0); pts.push([x, FH - hh]); } pts.push([1980, FH + 4, "c"]); return smooth(pts); })();
  const SKYS: Record<Mood, Stops> = {night: [[0, "#03040C"], [0.45, "#0A0E26"], [0.8, "#18183C"], [1, "#2C2650"]], dusk: [[0, "#0D0A22"], [0.5, "#2A1E4A"], [0.85, "#6A2E50"], [1, "#B24C3C"]], dawn: [[0, "#0F142C"], [0.5, "#2A3460"], [0.85, "#7A6890"], [1, "#D89A7C"]], gold: [[0, "#1C1230"], [0.5, "#4E2E50"], [0.85, "#B05A44"], [1, "#EFA458"]]};
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.04)} cx={960} cy={560}>
      <defs>
        <Lin id={`${id}-sky`} user x1={0} y1={0} x2={0} y2={FH} stops={SKYS[mood]}/>
        <Rad id={`${id}-halo`} stops={[[0, "#FFF6DC", 0.9], [0.04, "#FFE6B0", 0.6], [0.12, "#FFD08A", 0.26], [0.3, "#E8A060", 0.09], [0.6, "#8A5A70", 0.03], [1, "#8A5A70", 0]]}/>
        <Rad id={`${id}-core`} stops={soft("#FFFDF4", 1, 2.4)}/>
        <Lin id={`${id}-gnd`} user x1={0} y1={FH} x2={0} y2={H} stops={[[0, "#241A36"], [0.2, "#140C20"], [1, "#07040C"]]}/>
        <Rad id={`${id}-pool`} user cx={960} cy={FH + 120} r={900} tr={`translate(960 ${FH + 120}) scale(1 0.4) translate(-960 ${-FH - 120})`} stops={[[0, "#E8B87A", 0.3], [0.4, "#B07A6A", 0.12], [1, "#B07A6A", 0]]}/>
        <Lin id={`${id}-hz`} user x1={0} y1={FH - 60} x2={0} y2={FH + 40} stops={[[0, "#5A4A80", 0], [0.6, "#5A4A80", 0.45], [1, "#5A4A80", 0]]}/>
        <Lin id={`${id}-fz`} user x1={0} y1={FH} x2={0} y2={FH + 90} stops={[[0, "#241A36", 1], [0.4, "#1E1530", 0.7], [1, "#1E1530", 0]]}/>
        <linearGradient id={`${id}-fur`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={W} y2={0}><stop offset="0" stopColor="#B89070" stopOpacity={0.1}/><stop offset="0.5" stopColor="#FFD8A0" stopOpacity={0.55}/><stop offset="1" stopColor="#B89070" stopOpacity={0.1}/></linearGradient>
      </defs>
      <rect x={-200} y={-200} width={W + 400} height={FH + 210} fill={`url(#${id}-sky)`}/>
      {/* the stars wheel slowly about the light; the light itself never moves, never flickers */}
      <Stars f={f} n={420} yMax={FH + 200} rot={rot} cx={L[0]} cy={L[1]}/>
      <Glow x={L[0]} y={L[1]} r={760} fill={`${id}-halo`}/>
      <circle cx={L[0]} cy={L[1]} r={64} fill="none" stroke="#FFE6B0" strokeWidth={0.8} opacity={0.22}/>
      <path d={RINGS[2]} transform={`translate(${L[0]} ${L[1]}) scale(0.55)`} fill="none" stroke="#FFE6B0" strokeWidth={1.4} opacity={0.14}/>
      <Glow x={L[0]} y={L[1]} r={30} fill={`${id}-core`}/>
      <circle cx={L[0]} cy={L[1]} r={5} fill="#FFFFFF"/>
      <rect x={-200} y={FH - 60} width={W + 400} height={100} fill={`url(#${id}-hz)`}/>
      <Rimmed paths={[treeLine]} fill="#1A1228" light={[0, -1]} w={1.2} rim="#8A7AA8"/>
      <rect x={-200} y={FH} width={W + 400} height={H - FH + 200} fill={`url(#${id}-gnd)`}/>
      <rect x={-200} y={FH} width={W + 400} height={H - FH + 200} fill={`url(#${id}-pool)`}/>
      {/* bare earth: ploughed ridges that catch the light, and the first shoots */}
      {furrows ? <g opacity={st.furrow}><path d={furrows} fill="none" stroke="#08050C" strokeWidth={3.2}/><path d={furrows} fill="none" stroke={`url(#${id}-fur)`} strokeWidth={1.1} transform="translate(2.2 0)"/></g> : null}
      {furrows ? <rect x={-200} y={FH} width={W + 400} height={90} fill={`url(#${id}-fz)`} opacity={st.furrow}/> : null}
      {sprouts ? <Rimmed paths={[sprouts]} fill="#100A16" light={[0, -1]} w={1} rim="#E8C48A"/> : null}
      {/* the grain, far rows first: a dark mass, stems and leaves, and the heads that catch the light as the wind goes over */}
      {rows.map((r) => { const col = mix("#2A2040", "#0C0712", clamp01(r.t * 1.3)), sw = 0.5 + r.t * 1.6; return <g key={r.k}>
        {r.mass ? <path d={r.mass} fill={col}/> : null}
        {r.heaps ? <Rimmed paths={[r.heaps]} fill={mix(col, "#06030A", 0.6)} light={[0, -1]} w={0.8 + r.t * 0.8} rim="#B89068"/> : null}
        {r.leaves ? <path d={r.leaves} fill={col}/> : null}
        <path d={r.stems} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round"/>
        {ripe < 0.6 ? r.tips.map((d, b) => d ? <path key={"t" + b} d={d} fill="none" stroke={["#2E2444", "#7A6890", "#F2DCA8"][b]} strokeWidth={0.8 + r.t * 2} strokeLinecap="round" opacity={1 - ripe / 0.6}/> : null) : null}
        {r.heads.map((d, b) => d ? (r.t < 0.4
          ? <path key={b} d={d} fill="none" stroke={["#30243C", "#8A6E54", "#F2CF8E"][b]} strokeWidth={0.8 + r.t * 3} strokeLinecap="round"/>
          : <path key={b} d={d} fill={["#1C1426", "#6A5042", "#E8C080"][b]}/>) : null)}
      </g>; })}
      <Dust f={f} sun={L} n={70} y0={300} y1={1000} color="#FFE8C0"/>
    </Frame>
  );
};

export const SCENES: Record<string, React.FC<SceneP>> = {light: LightScene, "sun-world": SunWorld, glories: Glories, field: FieldScene};
