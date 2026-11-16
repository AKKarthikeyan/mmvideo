// Skies, light and air for the Katha kit: gradient sky by mood, sun or moon with glow and slow god rays, lit cloud
// bands, stars, haze, drifting dust motes. All deterministic per frame.
// 22 Oct 2026 (kit pass): the moon is warm ivory-gold (moon="cool" keeps the old blue-white); night has a warm amber
// horizon band so indigo, plum and amber carry through the film; sun={null} (or disc={false}, glow={0}) draws no disc;
// clouds sit BEHIND the disc and their band heights can be set; `horizon` puts the sky's bright band at a given y; every
// gradient id is per instance (useId), so two Skies, Clouds or Hazes never collide.
import React, {useId} from "react";
import {W, H} from "./look";
import {rnd} from "./geom";

export type Mood = "dusk" | "dawn" | "night" | "gold";
export const MOODS: Mood[] = ["dusk", "dawn", "night", "gold"];
const uid = (p: string) => p + useId().replace(/[^a-zA-Z0-9]/g, "");
// Sky stops, top (0) to the horizon glow (~0.92) and below. With `horizon`, offset 0.92 lands on the horizon line.
const SKIES: Record<Mood, [number, string][]> = {
  dusk: [[0, "#120F2A"], [0.32, "#2E2350"], [0.55, "#6A2F55"], [0.72, "#C2553A"], [0.84, "#F0A04B"], [0.92, "#FFD27A"]],
  dawn: [[0, "#151C38"], [0.35, "#2F3D6E"], [0.58, "#7D6A92"], [0.75, "#E3967A"], [0.87, "#F7C58E"], [0.95, "#FFE6B8"]],
  // indigo high up, plum low, a banked amber glow at the horizon (the warm band the film keeps through the night)
  night: [[0, "#06050F"], [0.34, "#0E0C27"], [0.6, "#1D1842"], [0.76, "#34244F"], [0.86, "#56304F"], [0.92, "#8A4A44"], [1, "#B0683E"]],
  gold: [[0, "#2A1A3E"], [0.3, "#6B3A55"], [0.55, "#C26A45"], [0.75, "#F2A855"], [0.9, "#FFD98E"], [1, "#FFF0C8"]],
};
const NIGHT_COOL: [number, string][] = [[0, "#04050D"], [0.4, "#0B1029"], [0.7, "#16204A"], [0.88, "#24305E"], [1, "#2E3A6A"]];
// Disc colours: core, halo, outer.
const SUN: Record<Mood, [string, string, string]> = {
  dusk: ["#FFF6D8", "#FFC86A", "#F59A45"], dawn: ["#FFF8E4", "#FFD9A0", "#F2A47A"], night: ["#FFF2D6", "#F2D49C", "#B9825A"], gold: ["#FFFBEA", "#FFE08A", "#F5A945"],
};
const MOON_COOL: [string, string, string] = ["#F4F1E6", "#C9CFE6", "#6B78A8"];
// For scenes that build their own sky or sea: the stops and the disc colours of a mood.
export const skyStops = (mood: Mood, moon: "warm" | "cool" = "warm"): [number, string][] => (mood === "night" && moon === "cool" ? NIGHT_COOL : SKIES[mood] || SKIES.dusk);
export const sunColors = (mood: Mood, moon: "warm" | "cool" = "warm"): [string, string, string] => (mood === "night" && moon === "cool" ? MOON_COOL : SUN[mood] || SUN.dusk);
// The warm band along the horizon, per mood: colour and default strength.
const BAND: Record<Mood, [string, number]> = {dusk: ["#FF9A4A", 0.35], dawn: ["#FFB27A", 0.3], night: ["#E0874A", 0.42], gold: ["#FFC870", 0.3]};

export type SkyP = {
  mood?: Mood; sun?: [number, number] | null; sunR?: number; f: number; rays?: number; stars?: number; clouds?: number; id?: string;
  disc?: boolean;           // draw the sun / moon disc (default true; sun={null} draws neither disc nor glow)
  glow?: number;            // the disc's glow, 0..1+ (default 1)
  moon?: "warm" | "cool";   // night only: warm ivory-gold (default) or the old blue-white moon and blue night sky
  horizon?: number;         // y of the horizon: the sky gradient's bright band sits here (default: the old full-frame span)
  band?: number;            // the warm horizon band's strength (default per mood; 0 = none)
  bands?: number[];         // cloud band heights (y); default 250 / 395 / 520, or proportional to `horizon`
};
export const Sky: React.FC<SkyP> =
  ({mood = "dusk", sun = [1010, 640], sunR = 92, f, rays = 0.5, stars, clouds = 1, id, disc = true, glow = 1, moon = "warm", horizon, band, bands}) => {
  const u = uid("sk" + (id ?? ""));
  const stops = skyStops(mood as Mood, moon as "warm"), [c0, c1, c2] = sunColors(mood as Mood, moon as "warm");
  const nStars = stars ?? (mood === "night" ? 1 : mood === "dusk" ? 0.6 : 0.25);
  const hy = horizon ?? H * 0.92;                         // the line the warm band and the bright stop sit on
  const span = horizon != null ? horizon / 0.92 : H;      // the gradient's length
  const top = horizon != null ? Math.min(hy * 0.85, mood === "night" ? 900 : 380) : mood === "night" ? 900 : 340;
  const [bc, bk] = BAND[mood] || BAND.dusk, bandK = (band ?? bk) * (mood === "night" && moon === "cool" ? 0 : 1);
  const showSun = sun != null && sunR > 0;
  const S = sun ?? [W / 2, hy];
  const warmMoon = mood === "night" && moon !== "cool";
  return (
    <g>
      <defs>
        <linearGradient id={`${u}s`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={0} y2={span}>{stops.map(([o, c], i) => <stop key={i} offset={o} stopColor={c}/>)}</linearGradient>
        <radialGradient id={`${u}g`}><stop offset="0" stopColor={c0}/><stop offset="0.08" stopColor={c1}/><stop offset="0.2" stopColor={c1} stopOpacity={0.8}/><stop offset="0.45" stopColor={c2} stopOpacity={0.3}/><stop offset="0.75" stopColor={c2} stopOpacity={0.08}/><stop offset="1" stopColor={c2} stopOpacity={0}/></radialGradient>
        <radialGradient id={`${u}b`}><stop offset="0" stopColor={bc} stopOpacity={1}/><stop offset="0.35" stopColor={bc} stopOpacity={0.55}/><stop offset="0.7" stopColor={bc} stopOpacity={0.15}/><stop offset="1" stopColor={bc} stopOpacity={0}/></radialGradient>
        <radialGradient id={`${u}c`}><stop offset="0.8" stopColor={c0}/><stop offset="0.93" stopColor={c0} stopOpacity={0.9}/><stop offset="1" stopColor={c0} stopOpacity={0}/></radialGradient>
        <radialGradient id={`${u}m`}><stop offset="0" stopColor="#B08A66" stopOpacity={0.5}/><stop offset="1" stopColor="#B08A66" stopOpacity={0}/></radialGradient>
      </defs>
      <rect x={-80} y={-80} width={W + 160} height={H + 160} fill={`url(#${u}s)`}/>
      {nStars > 0 ? Array.from({length: Math.round(220 * nStars)}, (_, i) => {
        const x = rnd(i, 7) * W, y = rnd(i, 8) * top, r = 0.6 + rnd(i, 9) * 1.5, tw = 0.6 + 0.4 * Math.sin(f / (9 + rnd(i, 11) * 14) + i);
        return <circle key={i} cx={x} cy={y} r={r} fill="#FFF3D6" opacity={(1 - y / top) * (0.3 + 0.6 * rnd(i, 10)) * tw}/>;
      }) : null}
      {bandK > 0 ? <ellipse cx={showSun ? S[0] * 0.6 + W * 0.2 : W / 2} cy={hy} rx={W * 0.75} ry={Math.max(60, (span - 0) * 0.16)} fill={`url(#${u}b)`} opacity={bandK}/> : null}
      {clouds > 0 ? <Clouds f={f} mood={mood} op={clouds} bands={bands ?? (horizon != null ? [0.36, 0.56, 0.74].map((k) => k * horizon) : undefined)}/> : null}
      {showSun && glow > 0 ? <circle cx={S[0]} cy={S[1]} r={sunR * (warmMoon ? 4.8 : 6.7)} fill={`url(#${u}g)`} opacity={Math.min(1, glow)}/> : null}
      {showSun && rays > 0 ? (
        <g opacity={rays} transform={`rotate(${Math.sin(f / 240) * 3} ${S[0]} ${S[1]})`}>
          <defs><radialGradient id={`${u}r`} cx={S[0]} cy={S[1]} r={1500} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor={c1} stopOpacity={1}/><stop offset="0.5" stopColor={c1} stopOpacity={0.45}/><stop offset="1" stopColor={c1} stopOpacity={0}/></radialGradient></defs>
          {Array.from({length: 16}, (_, i) => {
            const a = (-178 + i * 11.5 + rnd(i, 3) * 6) * Math.PI / 180, w = (1.4 + rnd(i, 4) * 2.6) * Math.PI / 180, L = 1700;
            const breathe = 0.7 + 0.3 * Math.sin(f / 50 + i * 1.3), o = (0.06 + 0.06 * rnd(i, 5)) * breathe;
            // three nested wedges give the ray a soft edge without a blur filter
            return <g key={i}>{[1, 0.62, 0.3].map((k, j) => <path key={j} d={`M ${S[0]} ${S[1]} L ${S[0] + Math.cos(a - w * k) * L} ${S[1] + Math.sin(a - w * k) * L} L ${S[0] + Math.cos(a + w * k) * L} ${S[1] + Math.sin(a + w * k) * L} Z`} fill={`url(#${u}r)`} opacity={o}/>)}</g>;
          })}
        </g>) : null}
      {showSun && disc ? <circle cx={S[0]} cy={S[1]} r={sunR * 1.08} fill={`url(#${u}c)`}/> : null}
      {showSun && disc && warmMoon && sunR >= 10 ? (
        // faint maria laid out as on the real near side (Procellarum, Imbrium, Serenitatis, Tranquillitatis, Crisium,
        // Fecunditatis, Nubium), so the warm disc reads as the moon and not a second sun, and never as a face
        <g opacity={0.42}>
          {([[-0.46, 0.06, 0.28, 0.44], [-0.18, -0.36, 0.3, 0.22], [0.17, -0.3, 0.16, 0.15], [0.31, 0.02, 0.21, 0.17], [0.66, -0.17, 0.1, 0.12], [0.5, 0.33, 0.13, 0.16], [-0.1, 0.44, 0.2, 0.13]] as number[][]).map(([dx, dy, rx, ry], i) =>
            <ellipse key={i} cx={S[0] + dx * sunR} cy={S[1] + dy * sunR} rx={rx * sunR} ry={ry * sunR} fill={`url(#${u}m)`} transform={`rotate(${(i * 37) % 50 - 25} ${S[0] + dx * sunR} ${S[1] + dy * sunR})`}/>)}
        </g>) : null}
    </g>
  );
};
// Bands of soft cloud, darker above and lit from below by the low sun; they drift slowly. bands: the y of each band.
export const Clouds: React.FC<{f: number; mood: Mood; op?: number; bands?: number[]}> = ({f, mood, op = 1, bands: ys}) => {
  const u = uid("cl");
  const base: [number, number, number, string, string][] = mood === "night"
    ? [[300, 50, 0.32, "#1E1A40", "#6A4A5E"], [480, 36, 0.3, "#261E46", "#8A5A56"]]
    : [[250, 64, 0.5, "#3A2A5A", "#D9784F"], [395, 50, 0.55, "#5B2F57", "#F2A060"], [520, 34, 0.5, "#8E3D52", "#FFC27A"]];
  const bands = base.map((b, i) => (ys && ys[i] != null ? [ys[i], b[1], b[2], b[3], b[4]] : b) as typeof b).slice(0, ys ? Math.min(base.length, ys.length) : base.length);
  return (
    <g opacity={op}>
      <defs>{bands.map(([, , , dark, lit], b) => <React.Fragment key={b}>
        <radialGradient id={`${u}d${b}`}><stop offset="0" stopColor={dark}/><stop offset="0.55" stopColor={dark} stopOpacity={0.85}/><stop offset="1" stopColor={dark} stopOpacity={0}/></radialGradient>
        <radialGradient id={`${u}l${b}`}><stop offset="0" stopColor={lit}/><stop offset="0.5" stopColor={lit} stopOpacity={0.7}/><stop offset="1" stopColor={lit} stopOpacity={0}/></radialGradient></React.Fragment>)}</defs>
      {bands.map(([y, h, a], b) => (
        <g key={b} opacity={a}>
          {Array.from({length: 10}, (_, i) => {
            const x = ((rnd(i, b * 10 + 1) * 2300 + f * (0.08 + b * 0.05)) % 2300) - 190, w = 240 + rnd(i, b * 10 + 2) * 560, hh = h * (0.5 + rnd(i, b * 10 + 3) * 0.8), yy = y + rnd(i, b * 10 + 4) * 34;
            return <g key={i}>
              <ellipse cx={x} cy={yy} rx={w / 2 + 28} ry={hh / 2 + 28} fill={`url(#${u}d${b})`}/>
              <ellipse cx={x + w * 0.05} cy={yy + hh * 0.3} rx={w * 0.42 + 8} ry={hh * 0.16 + 8} fill={`url(#${u}l${b})`} opacity={0.85}/>
            </g>;
          })}
        </g>
      ))}
    </g>
  );
};
// Dust motes in the light, brighter near the sun; they drift up and across.
export const Dust: React.FC<{f: number; sun: [number, number]; n?: number; y0?: number; y1?: number; color?: string}> = ({f, sun, n = 160, y0 = 260, y1 = 1040, color = "#FFE2A8"}) => (
  <g>{Array.from({length: n}, (_, i) => {
    const sp = 0.15 + rnd(i, 105) * 0.5, x = ((rnd(i, 101) * W + f * sp) % (W + 40)) - 20, y = y0 + ((rnd(i, 102) * (y1 - y0) - f * sp * 0.4) % (y1 - y0) + (y1 - y0)) % (y1 - y0) + Math.sin(f / 30 + i) * 6;
    const d = Math.hypot(x - sun[0], y - sun[1]), a = Math.max(0.05, 1 - d / 1100), r = 0.8 + rnd(i, 103) * 2.4;
    return <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={a * (0.5 + 0.4 * Math.sin(f / 13 + i))}/>;
  })}</g>
);
// A horizontal band of haze (between depth layers).
export const Haze: React.FC<{y: number; h: number; color: string; op?: number}> = ({y, h, color, op = 0.55}) => {
  const u = uid("hz");
  return (
    <g>
      <defs><linearGradient id={u} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity={0}/><stop offset="0.6" stopColor={color} stopOpacity={op}/><stop offset="1" stopColor={color} stopOpacity={0}/></linearGradient></defs>
      <rect x={-40} y={y - h / 2} width={W + 80} height={h} fill={`url(#${u})`}/>
    </g>
  );
};

// ---------- changes of state without ghosts (22 Oct 2026) ----------
// A solid shape is never faded to a translucent ghost. Hide the change behind light or mist instead: swap what is
// behind while cover > 0.9, i.e. for p in about 0.42..0.58.
// mistCover(p): how thick the mist / flash is at progress p (0..1): 0 at the ends, 1 across the middle.
export const mistCover = (p: number) => { const u = Math.max(0, Math.min(1, p)); return Math.min(1, Math.sin(Math.PI * u) * 1.35); };
// A mist wipe: a bank of warm haze that drifts across the box [x0, x1] x [y - h/2, y + h/2] as p runs 0..1 (dir -1:
// right to left), thick in the middle, with soft edges all round, so whatever it passes over can change unseen.
export const MistWipe: React.FC<{p: number; x0?: number; x1?: number; y: number; h: number; color?: string; dir?: 1 | -1; op?: number}> =
  ({p, x0 = 0, x1 = W, y, h, color = "#3A2846", dir = 1, op = 1}) => {
  const u = uid("mw");
  if (p <= 0 || p >= 1) return null;
  const span = x1 - x0, bw = span * 0.75, q = dir > 0 ? p : 1 - p, cx = x0 - bw * 0.5 + (span + bw) * q, k = mistCover(p);
  return (
    <g opacity={op}>
      <defs>
        <radialGradient id={u}><stop offset="0" stopColor={color} stopOpacity={1}/><stop offset="0.5" stopColor={color} stopOpacity={1}/><stop offset="0.78" stopColor={color} stopOpacity={0.5}/><stop offset="1" stopColor={color} stopOpacity={0}/></radialGradient>
      </defs>
      <ellipse cx={cx} cy={y} rx={bw * 0.5 + span * 0.35 * k} ry={h * 0.5} fill={`url(#${u})`} opacity={Math.min(1, 0.4 + k)}/>
      {[-0.3, 0.05, 0.32].map((o, i) => <ellipse key={i} cx={cx + o * bw + Math.sin(p * 6 + i) * bw * 0.05} cy={y + (i - 1) * h * 0.22} rx={bw * 0.42} ry={h * 0.2} fill={`url(#${u})`} opacity={0.5 * k}/>)}
    </g>
  );
};
// A flash of light: a bloom of warm white at (x, y) that swells and ebbs as p runs 0..1, covering radius r at its
// height (use it where a lamp is lit, a form appears, a world turns: the frame is changed under the light).
export const LightFlash: React.FC<{p: number; x: number; y: number; r: number; color?: string}> = ({p, x, y, r, color = "#FFF4DC"}) => {
  const u = uid("lf");
  const k = mistCover(p);
  if (k <= 0.002) return null;
  return (
    <g>
      <defs><radialGradient id={u}><stop offset="0" stopColor={color} stopOpacity={1}/><stop offset="0.3" stopColor={color} stopOpacity={0.96}/><stop offset="0.55" stopColor="#FFE6B4" stopOpacity={0.6}/><stop offset="0.8" stopColor="#FFD38A" stopOpacity={0.18}/><stop offset="1" stopColor="#FFD38A" stopOpacity={0}/></radialGradient></defs>
      <circle cx={x} cy={y} r={r * (0.55 + 0.45 * k)} fill={`url(#${u})`} opacity={k}/>
    </g>
  );
};
