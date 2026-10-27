// The counter's surfaces, drawn in code from brand tones (materials.ts): an eye-level stage (a back wall under one warm
// key light, a gently raked counter top, the counter front) and top-down surfaces for the bill and the end card. Teak
// grain is a set of seeded wavy SVG strokes per plank; velvet is the brand's maroon with a fine nap from the shared
// grain tiles. No isometric: the counter is seen straight on, from slightly above.
import React, {useMemo} from "react";
import {AbsoluteFill, random} from "remotion";
import type {Mat, Surface} from "./materials";
import {rgba} from "./materials";

// World geometry of the eye-level stage (frame px at the identity camera).
export const STAGE = {top: 1236, edge: 1326, base: 1292};
const WX0 = -420, WX1 = 1500, WY0 = -500, WY1 = 2420;      // the world is drawn larger than the frame (camera moves)

// Wavy grain lines for one plank (x0..x1, y0..y0+h), seeded.
const grainPaths = (seed: string, x0: number, x1: number, y0: number, h: number, n: number) => {
  const out: {d: string; w: number; o: number}[] = [];
  for (let i = 0; i < n; i++) {
    const yy = y0 + ((i + 0.5) / n) * h + (random(`${seed}y${i}`) - 0.5) * (h / n) * 0.8;
    const amp = 2 + random(`${seed}a${i}`) * 7, len = 260 + random(`${seed}l${i}`) * 520, ph = random(`${seed}p${i}`) * 6.28;
    let d = "";
    for (let x = x0; x <= x1; x += 40) {
      const y = yy + Math.sin(x / len * 6.28 + ph) * amp + Math.sin(x / (len * 0.37) + ph * 2) * amp * 0.35;
      d += `${d ? "L" : "M"}${x.toFixed(0)},${y.toFixed(1)}`;
    }
    out.push({d, w: 1 + random(`${seed}w${i}`) * 2.2, o: 0.25 + random(`${seed}o${i}`) * 0.45});
  }
  // a cathedral arch or two: the figure of flat-sawn teak
  for (let k = 0; k < 2; k++) {
    const cx = x0 + random(`${seed}cx${k}`) * (x1 - x0), cy = y0 + h * (0.35 + random(`${seed}cy${k}`) * 0.3), rx = 120 + random(`${seed}rx${k}`) * 180;
    for (let j = 0; j < 4; j++) {
      const r = rx * (1 - j * 0.2), ry = h * (0.16 - j * 0.03);
      out.push({d: `M${(cx - r).toFixed(0)},${(cy + ry).toFixed(1)} Q${cx.toFixed(0)},${(cy - ry * 2).toFixed(1)} ${(cx + r).toFixed(0)},${(cy + ry).toFixed(1)}`, w: 1.4, o: 0.35});
    }
  }
  return out;
};

// Horizontal teak planks over a region (world px).
export const Teak: React.FC<{M: Mat; seed: number; x0: number; x1: number; y0: number; y1: number; plank: number; tone?: number; id: string}> = ({M, seed, x0, x1, y0, y1, plank, tone = 0, id}) => {
  const planks = useMemo(() => {
    const out: {y: number; h: number; c: string; g: ReturnType<typeof grainPaths>}[] = [];
    let k = 0;
    for (let y = y0; y < y1; y += plank, k++) {
      const c = random(`${seed}${id}pc${k}`) > 0.5 ? M.teak : M.teakLight;
      out.push({y, h: Math.min(plank, y1 - y), c, g: grainPaths(`${seed}${id}${k}`, x0, x1, y, Math.min(plank, y1 - y), Math.max(5, Math.round(plank / 22)))});
    }
    return out;
  }, [M, seed, x0, x1, y0, y1, plank, id]);
  return <g>
    {planks.map((p, i) => <g key={i}>
      <rect x={x0} y={p.y} width={x1 - x0} height={p.h} fill={p.c}/>
      {p.g.map((g, j) => <path key={j} d={g.d} fill="none" stroke={M.grain} strokeWidth={g.w} opacity={g.o}/>)}
      <rect x={x0} y={p.y} width={x1 - x0} height={3} fill={M.grain} opacity={0.75}/>
      <rect x={x0} y={p.y + 3} width={x1 - x0} height={2} fill={M.wallLight} opacity={0.10}/>
    </g>)}
    {tone !== 0 && <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={tone > 0 ? M.wallLight : M.shadow} opacity={Math.abs(tone)}/>}
  </g>;
};

// The eye-level stage, in world coordinates: wall, counter top and counter front.
export const EyeLevel: React.FC<{M: Mat; surface: Surface; seed: number}> = ({M, surface, seed}) => {
  const {top, edge} = STAGE;
  const bokeh = useMemo(() => Array.from({length: 9}, (_, i) => ({x: 60 + random(`${seed}bx${i}`) * 960, y: 260 + random(`${seed}by${i}`) * 760,
    r: 26 + random(`${seed}br${i}`) * 60, o: 0.05 + random(`${seed}bo${i}`) * 0.08})), [seed]);
  return <svg width={WX1 - WX0} height={WY1 - WY0} viewBox={`${WX0} ${WY0} ${WX1 - WX0} ${WY1 - WY0}`}
    style={{position: "absolute", left: WX0, top: WY0, overflow: "visible"}}>
    <defs>
      <radialGradient id="ck-key" cx="0.30" cy="0.30" r="0.75">
        <stop offset="0" stopColor={M.wallLight} stopOpacity={0.30}/><stop offset="0.45" stopColor={M.wallLight} stopOpacity={0.08}/><stop offset="1" stopColor={M.wallLight} stopOpacity={0}/>
      </radialGradient>
      <linearGradient id="ck-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={M.wallLow}/><stop offset="0.55" stopColor={M.wall}/><stop offset="1" stopColor={M.wallLow}/>
      </linearGradient>
      <linearGradient id="ck-top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={M.shadow} stopOpacity={0.55}/><stop offset="0.35" stopColor={M.shadow} stopOpacity={0.1}/><stop offset="1" stopColor={M.wallLight} stopOpacity={0.12}/>
      </linearGradient>
      <linearGradient id="ck-front" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={M.shadow} stopOpacity={0.62}/><stop offset="0.25" stopColor={M.shadow} stopOpacity={0.35}/><stop offset="1" stopColor={M.shadow} stopOpacity={0.6}/>
      </linearGradient>
      <linearGradient id="ck-brass" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={M.brassDark}/><stop offset="0.38" stopColor={M.brassLight}/><stop offset="1" stopColor={M.brassDark}/>
      </linearGradient>
      <filter id="ck-bokeh" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
    </defs>
    {/* back wall */}
    <rect x={WX0} y={WY0} width={WX1 - WX0} height={top - WY0} fill="url(#ck-wall)"/>
    <rect x={WX0} y={WY0} width={WX1 - WX0} height={top - WY0} fill="url(#ck-key)"/>
    {surface === "velvet"
      ? bokeh.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={M.brassLight} opacity={b.o} filter="url(#ck-bokeh)"/>)
      : <g opacity={0.5}>
        {/* two plain shelves' shadows on the plaster */}
        <rect x={WX0} y={440} width={WX1 - WX0} height={10} fill={M.shadow} opacity={0.35}/>
        <rect x={WX0} y={450} width={WX1 - WX0} height={40} fill={M.shadow} opacity={0.12}/>
        <rect x={WX0} y={860} width={WX1 - WX0} height={10} fill={M.shadow} opacity={0.3}/>
        <rect x={WX0} y={870} width={WX1 - WX0} height={44} fill={M.shadow} opacity={0.1}/>
      </g>}
    {/* counter top (raked) */}
    {surface === "velvet"
      ? <g>
        <rect x={WX0} y={top} width={WX1 - WX0} height={edge - top} fill={M.velvet}/>
        <rect x={WX0} y={top} width={WX1 - WX0} height={edge - top} fill="url(#ck-top)"/>
        <rect x={WX0} y={top - 4} width={WX1 - WX0} height={5} fill="url(#ck-brass)"/>
      </g>
      : <g>
        <Teak M={M} seed={seed} id="top" x0={WX0} x1={WX1} y0={top} y1={edge} plank={45}/>
        <rect x={WX0} y={top} width={WX1 - WX0} height={edge - top} fill="url(#ck-top)"/>
      </g>}
    {/* front edge: a brass lip (velvet tray) or a lit teak nosing */}
    <rect x={WX0} y={edge} width={WX1 - WX0} height={6} fill={surface === "velvet" ? "url(#ck-brass)" : M.teakLight}/>
    {/* counter front */}
    {surface === "velvet"
      ? <rect x={WX0} y={edge + 6} width={WX1 - WX0} height={WY1 - edge} fill={M.velvetDark}/>
      : <Teak M={M} seed={seed} id="front" x0={WX0} x1={WX1} y0={edge + 6} y1={WY1} plank={120} tone={-0.25}/>}
    <rect x={WX0} y={edge + 6} width={WX1 - WX0} height={WY1 - edge} fill="url(#ck-front)"/>
    {/* the counter front: drawers with brass pulls (teak), or a dark glass display front with a brass rail (velvet) */}
    {surface === "teak"
      ? [-380, 20, 380, 740, 1100].map((x, i) => <g key={i}>
        <rect x={x + 14} y={edge + 70} width={332} height={300} rx={6} fill={M.teakDark} opacity={0.55}/>
        <rect x={x + 14} y={edge + 70} width={332} height={300} rx={6} fill="none" stroke={M.teakLight} strokeWidth={3} opacity={0.35}/>
        <rect x={x + 30} y={edge + 86} width={300} height={268} rx={4} fill="none" stroke={M.shadow} strokeWidth={4} opacity={0.4}/>
        <rect x={x + 130} y={edge + 104} width={100} height={18} rx={9} fill="url(#ck-brass)"/>
      </g>)
      : <g>
        <rect x={WX0} y={edge + 60} width={WX1 - WX0} height={8} fill="url(#ck-brass)" opacity={0.85}/>
        <rect x={WX0} y={edge + 68} width={WX1 - WX0} height={420} fill={M.shadow} opacity={0.35}/>
        <rect x={WX0} y={edge + 488} width={WX1 - WX0} height={8} fill="url(#ck-brass)" opacity={0.6}/>
      </g>}
  </svg>;
};

// A top-down surface over the whole frame (screen coordinates, with bleed).
export const TopDown: React.FC<{M: Mat; surface: Surface; seed: number}> = ({M, surface, seed}) => {
  if (surface === "velvet") {
    return <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 60% at 35% 30%, ${M.velvetLight} 0%, ${M.velvet} 45%, ${M.velvetDark} 100%)`}}/>;
  }
  return <AbsoluteFill>
    <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
      <Teak M={M} seed={seed} id="td" x0={-40} x1={1120} y0={-60} y1={1990} plank={250}/>
    </svg>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 75% 50% at 38% 32%, ${rgba(M.wallLight, 0.22)}, ${rgba(M.wallLight, 0)} 60%), radial-gradient(ellipse 120% 90% at 50% 50%, ${rgba(M.shadow, 0)} 55%, ${rgba(M.shadow, 0.55)} 100%)`}}/>
  </AbsoluteFill>;
};

// The key light and falloff over everything (screen space).
export const Light: React.FC<{M: Mat; amount?: number}> = ({M, amount = 1}) =>
  <AbsoluteFill style={{pointerEvents: "none", opacity: amount,
    background: `radial-gradient(ellipse 70% 45% at 28% 18%, ${rgba(M.wallLight, 0.10)}, ${rgba(M.wallLight, 0)} 65%), radial-gradient(ellipse 110% 85% at 50% 45%, ${rgba(M.shadow, 0)} 60%, ${rgba(M.shadow, 0.5)} 100%)`}}/>;
