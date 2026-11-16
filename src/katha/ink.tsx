// Ink on lamplit paper (16 Nov 2026, INNER_CHARIOT_NORTH_STAR.md section 5): the second layer of the channel's look, for
// IDEA beats (the chariot model, the two birds, the anger chain, the lake). Story beats stay in Lamplight silhouettes.
// Dark iron-gall ink with gold-leaf fill, drawn by a brush whose width swells and tapers like a real nib, on warm paper.
// Deliberately NOT udbhava's glowing gold line on indigo: ours is dark ink on warm paper.
//   Paper    the ground: warm paper, fibres, a deckled darker edge, the house grain and vignette (any frame size).
//   InkLine  a path drawn on as a variable-width brush stroke (a filled outline sampled along the path, cut at progress p),
//            with an optional gold-leaf fill that floods in after the stroke closes.
//   InkLake  a worked example for Yoga Sutra 1.2 ("thoughts are waves, you are the lake"): waves settle, the moon's
//            reflection gathers, labels in the Label style.
// Everything is gradients and paths: no turbulence or large blur filters (they made long renders drop tiles, 22 Oct).
import React, {useMemo} from "react";
import {AbsoluteFill, interpolate} from "remotion";
import {svgPathProperties} from "svg-path-properties";
import {K, SA, CAPS, EN, Finish, KathaDefs} from "./look";
import {rnd} from "./geom";

export const PAPER = {base: "#F1E4C6", light: "#F8EED8", edge: "#D8C29A", fibre: "#B49A6A", ink: "#22170F", inkSoft: "#4A3626", gold: "#C9963A"};
const ip = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

export const Paper: React.FC<{f: number; w?: number; h?: number; children?: React.ReactNode; seed?: number}> = ({f, w = 1920, h = 1080, children, seed = 1}) => {
  const fibres = useMemo(() => Array.from({length: Math.round((w * h) / 9000)}, (_, i) => {
    const x = rnd(i, seed) * w, y = rnd(i, seed + 1) * h, l = 10 + rnd(i, seed + 2) * 34, a = rnd(i, seed + 3) * Math.PI;
    const bx = Math.cos(a) * l, by = Math.sin(a) * l, c = (rnd(i, seed + 4) - 0.5) * 10;
    return {d: `M ${x.toFixed(1)} ${y.toFixed(1)} q ${(bx / 2 + c).toFixed(1)} ${(by / 2 - c).toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`, o: 0.06 + rnd(i, seed + 5) * 0.12};
  }), [w, h, seed]);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 75% 70% at 50% 42%, ${PAPER.light} 0%, ${PAPER.base} 58%, ${PAPER.edge} 100%)`}}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: "absolute"}}>
        <g stroke={PAPER.fibre} strokeWidth={1} fill="none">{fibres.map((x, i) => <path key={i} d={x.d} opacity={x.o}/>)}</g>
        {/* deckled edge: a darker uneven band, drawn as soft radial falloff from each side */}
        <defs>
          <linearGradient id="pp-l" x1="0" x2="1"><stop offset="0" stopColor="#8A6A3A" stopOpacity={0.35}/><stop offset="1" stopColor="#8A6A3A" stopOpacity={0}/></linearGradient>
          <linearGradient id="pp-t" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8A6A3A" stopOpacity={0.3}/><stop offset="1" stopColor="#8A6A3A" stopOpacity={0}/></linearGradient>
        </defs>
        <rect x={0} y={0} width={60} height={h} fill="url(#pp-l)"/><rect x={w - 60} y={0} width={60} height={h} fill="url(#pp-l)" transform={`rotate(180 ${w - 30} ${h / 2})`}/>
        <rect x={0} y={0} width={w} height={50} fill="url(#pp-t)"/><rect x={0} y={h - 50} width={w} height={50} fill="url(#pp-t)" transform={`rotate(180 ${w / 2} ${h - 25})`}/>
      </svg>
      {children}
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: "absolute"}}><KathaDefs/><Finish f={f} w={w} h={h} vig={0.35} grain={0.08}/></svg>
    </AbsoluteFill>
  );
};

// Sample a path every `step` px: points with their unit normals.
type Pt = {x: number; y: number; nx: number; ny: number; s: number};
const sample = (d: string, step = 3): {pts: Pt[]; len: number} => {
  const P = new svgPathProperties(d), len = P.getTotalLength(), n = Math.max(2, Math.ceil(len / step));
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const s = (len * i) / n, p = P.getPointAtLength(s), t = P.getTangentAtLength(s), m = Math.hypot(t.x, t.y) || 1;
    pts.push({x: p.x, y: p.y, nx: -t.y / m, ny: t.x / m, s});
  }
  return {pts, len};
};
// The nib: width along the stroke (u in 0..1 of the full stroke). Tapered at both ends, swelling in the middle, with a
// slow pressure wobble so two strokes never look stamped.
const nib = (u: number, w: number, seed: number) => {
  const taper = Math.min(1, u / 0.08) * Math.min(1, (1 - u) / 0.12);
  const press = 0.72 + 0.28 * Math.sin(u * Math.PI) + 0.08 * Math.sin(u * 23 + seed * 3.1) + 0.05 * Math.sin(u * 61 + seed);
  return Math.max(0.25, w * press * (0.3 + 0.7 * Math.sqrt(taper)));
};
// p: how much of the stroke is drawn (0..1). fillP: the gold-leaf fill (0..1), for closed shapes. w: the nib's width.
export const InkLine: React.FC<{d: string; p: number; w?: number; color?: string; fill?: string; fillP?: number; seed?: number; opacity?: number}> =
  ({d, p, w = 5, color = PAPER.ink, fill, fillP = 0, seed = 1, opacity = 1}) => {
  const {pts, len} = useMemo(() => sample(d), [d]);
  if (p <= 0 && fillP <= 0) return null;
  const upto = len * Math.min(1, p);
  const L: string[] = [], R: string[] = [];
  for (const q of pts) {
    if (q.s > upto) break;
    const r = nib(q.s / len, w, seed) / 2;
    L.push(`${(q.x + q.nx * r).toFixed(1)} ${(q.y + q.ny * r).toFixed(1)}`);
    R.push(`${(q.x - q.nx * r).toFixed(1)} ${(q.y - q.ny * r).toFixed(1)}`);
  }
  const outline = L.length > 1 ? `M ${L.join(" L ")} L ${R.reverse().join(" L ")} Z` : "";
  return (
    <g opacity={opacity}>
      {fill && fillP > 0 ? <path d={d} fill={fill} opacity={fillP}/> : null}
      {outline ? <path d={outline} fill={color}/> : null}
    </g>
  );
};

// A label in the house style (Devanagari first, the English in small Cinzel capitals), in ink on paper.
export const InkLabel: React.FC<{x: number; y: number; sa?: string; en: string; o: number; align?: "start" | "middle" | "end"}> = ({x, y, sa, en, o, align = "middle"}) => (
  <g opacity={o}>
    {sa ? <text x={x} y={y} textAnchor={align} fontFamily={SA} fontSize={40} fill={PAPER.inkSoft}>{sa}</text> : null}
    <text x={x} y={y + (sa ? 38 : 0)} textAnchor={align} fontFamily={CAPS} fontWeight={600} fontSize={20} letterSpacing={5} fill={PAPER.ink}>{en}</text>
  </g>
);

// ---------- worked example: Yoga Sutra 1.2, the lake (an idea beat for L9 and the "One Word: Vritti" Short)
// 0-60: the lake's banks draw on; 60-150: the waves draw on, rough; 150-260: the waves settle to a still line; 200-300:
// the moon draws on above and its reflection gathers on the still water; labels on cue.
export const InkLake: React.FC<{f: number; w?: number; h?: number}> = ({f, w = 1920, h = 1080}) => {
  const tall = h > w;
  const cx = tall ? 500 : w / 2, cy = h * (tall ? 0.52 : 0.6), rx = tall ? 400 : 720, ry = rx * (tall ? 0.34 : 0.24);
  const calm = ip(f, 150, 260);
  // an uneven bank, so the lake reads as water and not as a plate
  const bankPts = Array.from({length: 13}, (_, i) => {
    const a = (i / 12) * Math.PI * 2, j = 1 + (rnd(i, 21) - 0.5) * 0.08;
    return [cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j * (Math.sin(a) > 0 ? 1.08 : 0.92)];
  });
  // a closed smooth curve: start at the midpoint of the last and first points, then quadratic curves through midpoints
  const bp = bankPts.slice(0, 12), mid2 = (a: number[], b: number[]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const st = mid2(bp[11], bp[0]);
  const bank = `M ${st[0].toFixed(1)} ${st[1].toFixed(1)} ` + bp.map((p, i) => { const q = mid2(p, bp[(i + 1) % 12]); return `Q ${p[0].toFixed(1)} ${p[1].toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`; }).join(" ") + " Z";
  // waves: smooth, rough at first; as the mind settles they shrink, flatten and fade until the water is clear
  const waves = Array.from({length: 4}, (_, k) => {
    const y = cy - ry * 0.45 + k * ry * 0.3, span = rx * (0.72 - Math.abs(k - 1.5) * 0.12), amp = (1 - calm) * (16 + 6 * rnd(k, 9));
    const n = 5 + k % 2, m = 96, pts: string[] = [];
    for (let i = 0; i <= m; i++) { const t = i / m, x = cx - span + 2 * span * t; pts.push(`${x.toFixed(1)} ${(y + Math.sin(t * n * Math.PI * 2 + k * 1.3 + (f / 10) * (1 - calm)) * amp * Math.sin(t * Math.PI)).toFixed(1)}`); }
    return `M ${pts.join(" L ")}`;
  });
  // reeds on the near bank
  const reeds = Array.from({length: 7}, (_, i) => {
    const x = cx - rx * 1.06 + i * 15 + rnd(i, 31) * 6, y0 = cy + ry * 0.75 + i * 6 + rnd(i, 33) * 6, hgt = 80 + rnd(i, 35) * 80, bend = (i % 2 ? 1 : -1) * (14 + rnd(i, 37) * 22);
    return `M ${x.toFixed(1)} ${y0.toFixed(1)} Q ${(x + bend * 0.3).toFixed(1)} ${(y0 - hgt * 0.6).toFixed(1)} ${(x + bend).toFixed(1)} ${(y0 - hgt).toFixed(1)}`;
  });
  const moonX = cx + rx * (tall ? 0.3 : 0.38), moonY = cy - ry - (tall ? 260 : 210), mr = tall ? 60 : 64;
  const moon = `M ${moonX - mr} ${moonY} a ${mr} ${mr} 0 1 0 ${2 * mr} 0 a ${mr} ${mr} 0 1 0 ${-2 * mr} 0`;
  const refl = ip(f, 230, 300) * calm;
  const titleY = tall ? 330 : h * 0.13;
  return (
    <Paper f={f} w={w} h={h}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: "absolute"}}>
        <InkLine d={bank} p={ip(f, 0, 60)} w={7} seed={2} fill="#E5D4AE" fillP={ip(f, 50, 80) * 0.75}/>
        {reeds.map((d, i) => <InkLine key={i} d={d} p={ip(f, 40 + i * 4, 70 + i * 4)} w={3.4} seed={40 + i} color={PAPER.inkSoft}/>)}
        {waves.map((d, k) => <InkLine key={k} d={d} p={ip(f, 60 + k * 12, 110 + k * 12)} w={4 - Math.abs(k - 1.5) * 0.5} seed={k + 4} color={PAPER.inkSoft} opacity={1 - 0.85 * calm}/>)}
        <InkLine d={moon} p={ip(f, 200, 250)} w={4.5} seed={11} fill={PAPER.gold} fillP={ip(f, 245, 275) * 0.85}/>
        {/* the reflection gathers only on still water */}
        <ellipse cx={moonX} cy={cy + ry * 0.05} rx={mr * 0.9} ry={mr * 0.2} fill={PAPER.gold} opacity={0.75 * refl}/>
        {[0.6, 0.35].map((k, i) => <ellipse key={i} cx={moonX} cy={cy + ry * (0.05 + 0.17 * (i + 1))} rx={mr * (0.62 - 0.18 * i)} ry={mr * 0.07} fill={PAPER.gold} opacity={k * refl}/>)}
        {tall ? <>
          <InkLabel x={cx} y={cy + ry + 120} sa="वृत्ति" en="THE WAVES · THOUGHTS" o={ip(f, 110, 130) * (1 - ip(f, 260, 280))}/>
          <InkLabel x={cx} y={cy + ry + 120} sa="द्रष्टा" en="THE STILL LAKE · THE SEER" o={ip(f, 285, 305)}/>
        </> : <>
          <InkLabel x={cx - rx * 0.6} y={cy + ry + 120} sa="वृत्ति" en="THE WAVES · THOUGHTS" o={ip(f, 110, 130) * (1 - 0.5 * calm)}/>
          <InkLabel x={cx + rx * 0.5} y={cy + ry + 120} sa="द्रष्टा" en="THE STILL LAKE · THE SEER" o={ip(f, 280, 300)}/>
        </>}
        <text x={cx} y={titleY} textAnchor="middle" fontFamily={EN} fontStyle="italic" fontWeight={600} fontSize={tall ? 58 : 50} fill={PAPER.ink} opacity={ip(f, 10, 30)}>
          {tall ? <><tspan x={cx} dy={0}>Thoughts are waves.</tspan><tspan x={cx} dy={70}>You are the lake.</tspan></> : "Thoughts are waves. You are the lake."}
        </text>
      </svg>
    </Paper>
  );
};
