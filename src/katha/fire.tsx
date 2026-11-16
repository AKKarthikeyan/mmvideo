// Fire for the Katha kit (22 Oct 2026): ONE flame model for the whole film, a fire built from that same flame, and the
// diya (the clay lamp). Gradients only, no blur filters; every flicker comes from the frame and a seed (deterministic).
//
// The flame, inside out: a white core low in the body; a gold body that turns orange and thins to a translucent tip;
// a faint blue cup at the root; translucent licks that rise and fall beside it; a translucent mantle around it; and
// one glow falloff (softStops, the same Gaussian-like curve as k-halo) for its light on the world.
import React, {useId} from "react";
import {K, softStops} from "./look";
import {smooth, wob, rnd, clamp01, band, Pt} from "./geom";

const uid = (p: string) => p + useId().replace(/[^a-zA-Z0-9]/g, "");
// The outline of a flame standing on (x, y): height h, half-width w; it bends by lean (a fraction of h at the tip) and
// sways by sway (a wave travelling up the flame at phase t). A rounded bowl at the root, a sharp tip.
export const flameOutline = (x: number, y: number, h: number, w: number, lean = 0, sway = 0, t = 0): string => {
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
// The flicker of a flame at frame f: height and brightness factors, lean and sway. calm: 1 = a windless lamp (6.19),
// 0 = a restless, wind-torn flame.
export const flicker = (f: number, seed = 0, calm = 0.8, wind = 0) => {
  const r = 1 - clamp01(calm), t = f / 30;
  return {
    hk: 1 + (0.025 + 0.13 * r) * wob(t * (3.2 + 6 * r), seed),
    bk: 1 + (0.02 + 0.07 * r) * wob(t * (6.1 + 3 * r), seed + 5),
    lean: wind * 0.35 + (0.015 + 0.14 * r) * wob(t * (1.1 + 2.2 * r), seed + 3),
    sway: 0.025 + 0.16 * r,
    ph: t * (4.2 + 7 * r) + seed * 2.3,
    r,
  };
};
export type FlameP = {
  x: number; y: number;     // the root of the flame (the wick tip)
  h: number;                // height
  w?: number;               // half-width (default 0.22 h)
  f: number;                // frame
  seed?: number;
  calm?: number;            // 1 = still, 0 = restless (default 0.8)
  lean?: number;            // a steady lean (fraction of h at the tip; + = right)
  wind?: number;            // wind, -1..1: leans the flame and its licks
  b?: number;               // brightness 0..1+ (0 = out)
  halo?: number;            // the glow on the world, 0..1+ (0 = none, e.g. when a Fire draws one shared glow)
  licks?: number;           // number of translucent licks (default 1 for a calm flame, up to 4 when restless)
  blue?: number;            // the blue root, 0..1 (default 1)
};
export const Flame: React.FC<FlameP> = ({x, y, h, w, f, seed = 0, calm = 0.8, lean = 0, wind = 0, b = 1, halo = 1, licks, blue = 1}) => {
  const id = uid("fm");
  if (b <= 0.001 || h < 0.5) return null;
  const F = flicker(f, seed, calm, wind), H = h * F.hk, W = (w ?? h * 0.22) * (1 + 0.04 * Math.sin(F.ph * 0.7)), ln = lean + F.lean;
  const B = b * F.bk, tipX = x + ln * H;
  const nL = licks ?? Math.round(1 + 3 * F.r);
  return (
    <g>
      <defs>
        <radialGradient id={`${id}h`}>{softStops("#FFE6B0", 0.4, "#E8823A", 2.6)}</radialGradient>
        <radialGradient id={`${id}i`}>{softStops("#FFF0C8", 0.62, "#F59A45", 1.7)}</radialGradient>
        <linearGradient id={`${id}b`} gradientUnits="userSpaceOnUse" x1={x} y1={y + W * 0.1} x2={tipX} y2={y - H}>
          <stop offset="0" stopColor="#FF9A3A" stopOpacity={0}/>
          <stop offset="0.07" stopColor="#FFB04E" stopOpacity={0.85}/>
          <stop offset="0.3" stopColor="#FFD789"/>
          <stop offset="0.6" stopColor="#FFC260" stopOpacity={0.96}/>
          <stop offset="0.84" stopColor="#F5923E" stopOpacity={0.72}/>
          <stop offset="1" stopColor="#E06A2C" stopOpacity={0.18}/>
        </linearGradient>
        <linearGradient id={`${id}l`} gradientUnits="userSpaceOnUse" x1={x} y1={y} x2={x} y2={y - H}>
          <stop offset="0" stopColor="#FFB050" stopOpacity={0}/><stop offset="0.25" stopColor="#FFC060" stopOpacity={0.9}/>
          <stop offset="0.7" stopColor="#F59040" stopOpacity={0.55}/><stop offset="1" stopColor="#E06A2C" stopOpacity={0}/>
        </linearGradient>
        <radialGradient id={`${id}c`} gradientUnits="userSpaceOnUse" cx={x + ln * H * 0.08} cy={y - H * 0.24} r={H * 0.36}>
          <stop offset="0" stopColor="#FFFFF8"/><stop offset="0.5" stopColor="#FFF8E0" stopOpacity={0.95}/><stop offset="0.85" stopColor="#FFEAB0" stopOpacity={0.35}/><stop offset="1" stopColor="#FFE2A0" stopOpacity={0}/>
        </radialGradient>
        <radialGradient id={`${id}m`} gradientUnits="userSpaceOnUse" cx={x + ln * H * 0.25} cy={y - H * 0.32} r={H * 0.72}>
          <stop offset="0" stopColor="#FFB050" stopOpacity={0.34}/><stop offset="0.55" stopColor="#FF9A45" stopOpacity={0.2}/><stop offset="1" stopColor="#F08A3A" stopOpacity={0}/>
        </radialGradient>
        <radialGradient id={`${id}u`} gradientUnits="userSpaceOnUse" cx={x} cy={y - H * 0.02} r={W * 1.05}>
          <stop offset="0" stopColor="#7C96FF" stopOpacity={0.7}/><stop offset="0.55" stopColor="#4A66E0" stopOpacity={0.35}/><stop offset="1" stopColor="#3A50C8" stopOpacity={0}/>
        </radialGradient>
      </defs>
      {halo > 0 ? <circle cx={x + ln * H * 0.3} cy={y - H * 0.45} r={H * 4.4} fill={`url(#${id}h)`} opacity={Math.min(1, halo * B)}/> : null}
      <ellipse cx={x + ln * H * 0.35} cy={y - H * 0.46} rx={H * 0.7} ry={H * 0.95} fill={`url(#${id}i)`} opacity={Math.min(1, 0.62 * B)}/>
      <g opacity={Math.min(1, B * 1.1)}>
        {Array.from({length: nL}, (_, i) => {
          const side = i % 2 ? 1 : -1, k = 0.5 + 0.5 * Math.sin(F.ph * (0.55 + 0.13 * i) + i * 2.1 + seed);
          const lh = H * (0.5 + 0.38 * k) * (1 + 0.15 * F.r), off = side * W * (0.35 + 0.25 * rnd(i, seed + 9));
          return <path key={i} d={flameOutline(x + off, y - H * 0.04, lh, W * (0.42 + 0.12 * F.r), ln + side * (0.08 + 0.18 * F.r) * (0.6 + 0.4 * k), F.sway * 1.6, F.ph * 1.3 + i * 1.7)}
            fill={`url(#${id}l)`} opacity={0.15 + 0.17 * k}/>;
        })}
        <path d={flameOutline(x, y + H * 0.04, H * 1.12, W * 1.55, ln, F.sway, F.ph)} fill={`url(#${id}m)`}/>
        <path d={flameOutline(x, y, H, W, ln, F.sway, F.ph)} fill={`url(#${id}b)`}/>
        <path d={flameOutline(x, y - H * 0.07, H * 0.5, W * 0.52, ln * 0.6, F.sway * 0.6, F.ph)} fill={`url(#${id}c)`}/>
        {blue > 0 ? <ellipse cx={x} cy={y - H * 0.025} rx={W * 0.72} ry={H * 0.085} fill={`url(#${id}u)`} opacity={0.5 * blue}/> : null}
      </g>
    </g>
  );
};
// A fire built from the same flame: a row of flames over an ember bed, taller in the middle, one shared glow, sparks.
// (x, y): the middle of the base line; w: half-width; h: the tallest flame; k: strength (0 = out, 1 = full, > 1 = flaring).
export const Fire: React.FC<{x: number; y: number; w: number; h: number; f: number; seed?: number; k?: number; wind?: number; sparks?: number; halo?: number; calm?: number}> =
  ({x, y, w, h, f, seed = 0, k = 1, wind = 0, sparks = 14, halo = 1, calm = 0.2}) => {
  const id = uid("fi");
  if (k <= 0.001) return null;
  const n = Math.max(3, Math.min(11, Math.round((2 * w) / (h * 0.2))));
  const fl = Array.from({length: n}, (_, i) => {
    const u = n === 1 ? 0.5 : i / (n - 1), env = Math.pow(Math.sin(Math.PI * (0.08 + 0.84 * u)), 0.9);
    return {x: x - w + 2 * w * u + (rnd(i, seed + 1) - 0.5) * w * 0.08, h: h * k * (0.42 + 0.58 * env) * (0.85 + 0.3 * rnd(i, seed + 2)), s: seed * 10 + i};
  }).sort((a, b) => a.h - b.h);
  return (
    <g>
      <defs>
        <radialGradient id={`${id}h`}>{softStops("#FFD9A0", 0.55, "#D8602E", 2.0)}</radialGradient>
        <radialGradient id={`${id}e`}>{softStops("#FFB060", 0.95, "#C0401E", 1.6)}</radialGradient>
      </defs>
      {halo > 0 ? <ellipse cx={x} cy={y - h * 0.5 * k} rx={(w + h) * 2.6} ry={h * 2.8} fill={`url(#${id}h)`} opacity={Math.min(1, halo * (0.85 + 0.1 * wob(f / 9, seed)))}/> : null}
      <ellipse cx={x} cy={y} rx={w * 1.15} ry={h * 0.09} fill={`url(#${id}e)`} opacity={Math.min(1, k)}/>
      {fl.map((q) => <Flame key={q.s} x={q.x} y={y} h={q.h} f={f} seed={q.s} calm={calm} wind={wind} halo={0} licks={2} blue={0.6}/>)}
      {Array.from({length: Math.round(sparks * Math.min(1.5, k))}, (_, i) => {
        const life = 50 + rnd(i, seed + 4) * 40, u = ((f + rnd(i, seed + 5) * life) % life) / life;
        const sx = x + (rnd(i, seed + 6) - 0.5) * w * 1.4 + Math.sin(u * 6 + i) * 10 + wind * u * h * 0.8, sy = y - h * 0.4 - u * h * (1.4 + rnd(i, seed + 7));
        return <circle key={i} cx={sx} cy={sy} r={1 + rnd(i, seed + 8) * 1.4} fill="#FFD08A" opacity={(1 - u) * 0.85}/>;
      })}
    </g>
  );
};

// ---------- the diya ----------
// A clay lamp seen a little from above: a round, shallow bowl pinched at one side into a spout where the wick lies (to
// the right; flip for left), its rim moulded into lotus petals, lotus petals in low relief round the belly, standing on
// a turned foot (neck, bead, flared base). It is clay in the dark: near-black, its rim and the petals on the side facing
// its own flame caught in gold, the oil glowing round the wick. Local units, s = 1: about 104 wide and 50 tall; the
// origin is the bottom of the foot, standing on the surface; the wick tip (the flame's root) is diyaWick().
const DR = 38, DK = 0.34, RIM_Y = -40, PET = 12;
// the rim's plan outline, projected: a circle drawn out into a pinched spout at angle 0; petal: the scallop depth
const rimPts = (r: number, petal: number, n = 72): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI + (2 * Math.PI * i) / n, sp = Math.exp(-Math.pow(a / 0.5, 2));
    const pk = petal ? petal * (1 - Math.pow(Math.abs(Math.cos((PET * a) / 2)), 0.5)) * (1 - sp) : 0;
    const rr = r * (1 + 0.62 * sp) + pk;
    out.push([Math.cos(a) * rr, RIM_Y + Math.sin(a) * rr * DK * (1 - 0.55 * sp)]);
  }
  return out;
};
export const diyaWick = (x: number, y: number, s = 1, flip = false): [number, number] => [x + (flip ? -1 : 1) * DR * 1.48 * s, y + (RIM_Y - 5) * s];
export const Diya: React.FC<{x: number; y: number; s?: number; f?: number; seed?: number; lit?: number; flame?: boolean; calm?: number; wind?: number; flip?: boolean; shadow?: number; halo?: number}> =
  ({x, y, s = 1, f = 0, seed = 0, lit = 1, flame = true, calm = 0.85, wind = 0, flip = false, shadow = 1, halo = 1}) => {
  const id = uid("dy");
  const L = clamp01(lit), wx = DR * 1.48, wy = RIM_Y - 5;
  // the body: the front of the lip, the belly down to the turned foot, back up under the spout
  const body: Pt[] = [
    [-DR - 2, RIM_Y], [-DR + 1, RIM_Y + 11], [-DR * 0.72, RIM_Y + 21], [-DR * 0.36, RIM_Y + 26], [-9, RIM_Y + 28, "c"],
    [-7, -11], [-11, -9, "c"], [-11, -6.5, "c"], [-8, -5, "c"], [-13, -2.5], [-23, -1, "c"], [-24, 0, "c"], [24, 0, "c"], [23, -1, "c"], [13, -2.5], [8, -5, "c"], [11, -6.5, "c"], [11, -9, "c"], [7, -11],
    [9, RIM_Y + 28, "c"], [DR * 0.4, RIM_Y + 25], [DR * 0.85, RIM_Y + 17], [DR * 1.22, RIM_Y + 8], [DR * 1.52, RIM_Y + 1], [DR * 1.55, RIM_Y - 1, "c"],
  ];
  const lip = rimPts(DR, 3.2), inner = rimPts(DR - 5, 0);
  const sx = flip ? -s : s, gold = "#FFCF86";
  // lotus petals in low relief round the belly: pointed arches from the foot, their edges catching the flame's side
  const petals = Array.from({length: 7}, (_, i) => {
    // each petal rises from the foot and spreads up the belly towards the rim (a pointed arch, drawn in perspective)
    const u = (i + 0.5) / 7, c = Math.sin((u - 0.5) * Math.PI) * DR * 0.86, cb = c * 0.3, wb = DR * 0.09 * (1 - Math.abs(u - 0.5)), top = RIM_Y + 9 + Math.abs(u - 0.5) * 8, bot = RIM_Y + 27;
    const f = (v: number) => v.toFixed(1);
    return {d: `M ${f(cb - wb)} ${bot} Q ${f(c - wb * 2.6)} ${f(top + 7)} ${f(c)} ${f(top)} Q ${f(c + wb * 2.6)} ${f(top + 7)} ${f(cb + wb)} ${bot}`, k: clamp01(0.2 + u)};
  });
  return (
    <g>
      <g transform={`translate(${x} ${y}) scale(${sx} ${s})`}>
        <defs>
          <linearGradient id={`${id}b`} gradientUnits="userSpaceOnUse" x1={-DR} y1={0} x2={wx} y2={0}>
            <stop offset="0" stopColor="#1A0E14"/><stop offset="0.55" stopColor={L > 0 ? "#34190F" : "#1D1118"}/><stop offset="1" stopColor={L > 0 ? "#6E3A1C" : "#24151C"}/>
          </linearGradient>
          <linearGradient id={`${id}l`} gradientUnits="userSpaceOnUse" x1={-DR} y1={0} x2={wx} y2={0}>
            <stop offset="0" stopColor="#24141A"/><stop offset="0.5" stopColor={L > 0 ? "#4A2616" : "#2A1820"}/><stop offset="1" stopColor={L > 0 ? "#9A5626" : "#2E1C22"}/>
          </linearGradient>
          <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1={-DR} y1={0} x2={wx} y2={0}>
            <stop offset="0" stopColor={gold} stopOpacity={0.02 + 0.03 * L}/><stop offset="0.5" stopColor={gold} stopOpacity={0.08 + 0.3 * L}/><stop offset="1" stopColor={gold} stopOpacity={0.25 + 0.75 * L}/>
          </linearGradient>
          <radialGradient id={`${id}o`} gradientUnits="userSpaceOnUse" cx={wx - 14} cy={RIM_Y - 1} r={DR * 1.6}>
            <stop offset="0" stopColor="#FFD58A" stopOpacity={0.9 * L}/><stop offset="0.16" stopColor="#A85C24" stopOpacity={0.3 + 0.6 * L}/><stop offset="0.5" stopColor="#2A1410"/><stop offset="1" stopColor="#100810"/>
          </radialGradient>
          <radialGradient id={`${id}s`}><stop offset="0" stopColor="#030108" stopOpacity={0.75}/><stop offset="0.6" stopColor="#030108" stopOpacity={0.3}/><stop offset="1" stopColor="#030108" stopOpacity={0}/></radialGradient>
        </defs>
        {shadow > 0 ? <ellipse cx={-10} cy={1} rx={86} ry={8} fill={`url(#${id}s)`} opacity={shadow}/> : null}
        <path d={smooth(body)} fill={`url(#${id}b)`}/>
        <path d={smooth(body)} fill="none" stroke={`url(#${id}g)`} strokeWidth={1}/>
        {/* the petals on the belly, and the turned foot's bead and base, lit on the flame's side */}
        {petals.map((p, i) => <path key={i} d={p.d} fill="none" stroke={gold} strokeWidth={0.9} opacity={(0.08 + 0.42 * L) * p.k}/>)}
        <path d="M -9 -8.2 L 9 -8.2" stroke={gold} strokeWidth={1} opacity={0.08 + 0.3 * L}/>
        <path d="M -21 -1.4 L 22 -1.4" stroke={gold} strokeWidth={0.9} opacity={0.06 + 0.22 * L}/>
        {/* the lip, moulded into petals, its edge catching the light; the oil inside, glowing near the wick */}
        <path d={smooth(lip)} fill={`url(#${id}l)`}/>
        <path d={smooth(lip)} fill="none" stroke={`url(#${id}g)`} strokeWidth={1.1}/>
        <path d={smooth(inner)} fill={`url(#${id}o)`}/>
        {/* the wick: a twist of cotton lying in the spout, its tip glowing */}
        <path d={band([[wx - 22, RIM_Y + 1], [wx - 10, RIM_Y - 1], [wx - 3, RIM_Y - 3], [wx, wy]], 3.4, 2, 1, "round")} fill="#1E120E"/>
        {L > 0 ? <circle cx={wx} cy={wy} r={1.8} fill="#FF8A3A" opacity={L}/> : null}
      </g>
      {flame && L > 0 ? (() => { const [fx, fy] = diyaWick(x, y, s, flip); return <Flame x={fx} y={fy} h={36 * s * (0.4 + 0.6 * L)} f={f} seed={seed} calm={calm} wind={wind} b={L} halo={halo}/>; })() : null}
    </g>
  );
};
