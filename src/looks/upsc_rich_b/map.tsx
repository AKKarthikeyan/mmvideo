// Shared map drawing for the two map scenes: ocean depth, shelf glow, wave texture, relief land, graticule, clouds.
import React, {useMemo} from "react";
import {getLength, getPointAtLength, getTangentAtLength} from "@remotion/paths";
import base from "../../../public/datayt/long/upsc/basemap.json";
import baseB from "../../../public/datayt/long/upsc/basemap_b.json";
import {SANS, SERIF, rng} from "./kit";

export type Box = {lon0: number; lon1: number; lat0: number; lat1: number; k: number; land: string; india: string};
export const BOXES = (base as any).boxes as Record<string, Box>;
/** Look B film boxes (scripts/upsc/windmap_basemap_b.py): every box frames India WHOLE, with a margin, so camera drift never crops it. */
export const BOXES_B = (baseB as any).boxes as Record<"ocean" | "india" | "asia", Box>;
export const proj = (b: Box) => ({x: (lon: number) => (lon - b.lon0) * b.k, y: (lat: number) => (b.lat1 - lat) * b.k});

export const MapDefs: React.FC<{id: string; b: Box; f: number}> = ({id, b, f}) => (
  <defs>
    <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stopColor="#58b4c4"/><stop offset="0.3" stopColor="#3a93b4"/><stop offset="0.65" stopColor="#24689a"/><stop offset="1" stopColor="#173f72"/></linearGradient>
    <radialGradient id={`${id}-deep`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#0f2f66" stopOpacity="0.75"/><stop offset="1" stopColor="#0f2f66" stopOpacity="0"/></radialGradient>
    <radialGradient id={`${id}-sunsea`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff6c8" stopOpacity="0.55"/><stop offset="1" stopColor="#fff6c8" stopOpacity="0"/></radialGradient>
    <linearGradient id={`${id}-land`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#dccb9f"/><stop offset="0.5" stopColor="#c9bd8a"/><stop offset="1" stopColor="#a8a975"/></linearGradient>
    <linearGradient id={`${id}-ind`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f2cf7c"/><stop offset="0.5" stopColor="#d9b552"/><stop offset="1" stopColor="#a8a252"/></linearGradient>
    <filter id={`${id}-blur12`} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="12"/></filter>
    <filter id={`${id}-blur5`} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id={`${id}-blur3`} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id={`${id}-relief`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="5" seed="4" result="n"/>
      <feDiffuseLighting in="n" surfaceScale="9" diffuseConstant="1.05" lightingColor="#fff6dd" result="lit"><feDistantLight azimuth="235" elevation="48"/></feDiffuseLighting>
      <feColorMatrix in="lit" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1"/>
    </filter>
    <filter id={`${id}-veg`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.0055 0.0075" numOctaves="4" seed="21"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.34  0 0 0 0 0.52  0 0 0 0 0.27  2.4 0 0 0 -1.05"/>
    </filter>
    <filter id={`${id}-dry`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.009 0.006" numOctaves="3" seed="8"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.78  0 0 0 0 0.52  0 0 0 0 0.3  0 2.2 0 0 -0.95"/>
    </filter>
    <filter id={`${id}-ripple`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency={`0.012 ${0.05 + 0.002 * Math.sin(f / 30)}`} numOctaves="3" seed="2"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 1.7 0 0 -0.82"/>
    </filter>
    <clipPath id={`${id}-clipLand`}><path d={b.land}/></clipPath>
    <clipPath id={`${id}-clipInd`}><path d={b.india}/></clipPath>
  </defs>
);

export const Ocean: React.FC<{id: string; b: Box; f: number; w: number; h: number}> = ({id, b, f, w, h}) => {
  const waves = useMemo(() => { const r = rng(31); return Array.from({length: 620}).map(() => ({x: r() * w, y: r() * h, l: 8 + r() * 18, o: 0.08 + r() * 0.2, p: r() * 6.28})); }, [w, h]);
  return (
    <g>
      <rect width={w} height={h} fill={`url(#${id}-sea)`}/>
      <ellipse cx={w * 0.55} cy={h * 0.78} rx={w * 0.32} ry={h * 0.3} fill={`url(#${id}-deep)`}/>
      <ellipse cx={w * 0.3} cy={h * 0.95} rx={w * 0.2} ry={h * 0.18} fill={`url(#${id}-deep)`}/>
      <ellipse cx={w * 0.78} cy={h * 0.55} rx={w * 0.2} ry={h * 0.22} fill={`url(#${id}-deep)`} opacity="0.6"/>
      <ellipse cx={w * 0.2} cy={h * 0.05} rx={w * 0.3} ry={h * 0.25} fill={`url(#${id}-sunsea)`}/>
      {/* shelf glow: shallow water near coasts */}
      <g>
        <path d={b.land + b.india} fill="none" stroke="#9fe6d8" strokeWidth="64" strokeLinejoin="round" opacity="0.28" filter={`url(#${id}-blur12)`}/>
        <path d={b.land + b.india} fill="none" stroke="#b9f2e2" strokeWidth="26" strokeLinejoin="round" opacity="0.5" filter={`url(#${id}-blur5)`}/>
        <path d={b.land + b.india} fill="none" stroke="#e8fff4" strokeWidth="7" strokeLinejoin="round" opacity="0.7" filter={`url(#${id}-blur3)`}/>
      </g>
      <rect width={w} height={h} filter={`url(#${id}-ripple)`} opacity="0.2"/>
      {waves.map((q, i) => <path key={i} d={`M${q.x},${q.y} q${q.l / 4},${-3.5 + 1.2 * Math.sin(f / 20 + q.p)} ${q.l / 2},0 t${q.l / 2},0`} stroke="#eaffff" strokeWidth="1.2" fill="none" opacity={q.o} strokeLinecap="round"/>)}
    </g>
  );
};

export const Land: React.FC<{id: string; b: Box; w: number; h: number}> = ({id, b, w, h}) => (
  <g>
    <path d={b.land} fill={`url(#${id}-land)`}/>
    <g clipPath={`url(#${id}-clipLand)`}>
      <rect width={w} height={h} filter={`url(#${id}-dry)`} opacity="0.75"/>
      <rect width={w} height={h} filter={`url(#${id}-veg)`} opacity="0.95"/>
      <rect width={w} height={h} filter={`url(#${id}-relief)`} style={{mixBlendMode: "multiply"}} opacity="0.72"/>
    </g>
    <path d={b.land} fill="none" stroke="#8d7a4c" strokeWidth="0.7" opacity="0.8" strokeLinejoin="round"/>
    {/* India: a warm halo and a firm outline so the whole country reads at a glance (official outline, never altered) */}
    <path d={b.india} fill="none" stroke="#fff3c0" strokeWidth="9" strokeLinejoin="round" opacity="0.5" filter={`url(#${id}-blur3)`}/>
    <path d={b.india} fill={`url(#${id}-ind)`}/>
    <g clipPath={`url(#${id}-clipInd)`}>
      <rect width={w} height={h} filter={`url(#${id}-veg)`} opacity="0.8"/>
      <rect width={w} height={h} filter={`url(#${id}-relief)`} style={{mixBlendMode: "multiply"}} opacity="0.5"/>
    </g>
    <path d={b.india} fill="none" stroke="#6b3d12" strokeWidth="2" strokeLinejoin="round"/>
    {/* land edge: a soft inner light on the coast, long shadow to the lee */}
    <path d={b.land + b.india} fill="none" stroke="#fff6d8" strokeWidth="1.4" opacity="0.5" transform="translate(-0.8 -0.8)"/>
  </g>
);

/** gentle clouds: a few puffs with a bluish underside and a shadow on the sea */
export const Cloud: React.FC<{x: number; y: number; s: number; a: number; seed?: number; id: string}> = ({x, y, s, a, seed = 1, id}) => {
  const p = useMemo(() => { const r = rng(seed); return Array.from({length: 9}).map(() => ({cx: (r() - 0.5) * 150, cy: (r() - 0.5) * 22, r: 20 + r() * 26})); }, [seed]);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={a}>
      <g transform="translate(34 62)" opacity="0.22" filter={`url(#${id}-blur12)`}>{p.map((q, i) => <ellipse key={i} cx={q.cx} cy={q.cy + 6} rx={q.r * 1.1} ry={q.r * 0.5} fill="#0e2a4a"/>)}</g>
      <g filter={`url(#${id}-blur3)`}>
        {p.map((q, i) => <ellipse key={i} cx={q.cx} cy={q.cy + 5} rx={q.r} ry={q.r * 0.74} fill="#b5c7dc"/>)}
        {p.map((q, i) => <ellipse key={i} cx={q.cx - 2} cy={q.cy - 2} rx={q.r * 0.9} ry={q.r * 0.64} fill="#f5f7fa"/>)}
        {p.map((q, i) => <ellipse key={i} cx={q.cx - 7} cy={q.cy - 8} rx={q.r * 0.5} ry={q.r * 0.34} fill="#fff"/>)}
      </g>
    </g>
  );
};

export const Graticule: React.FC<{b: Box; f: number; labels?: boolean}> = ({b, labels = true}) => {
  const {x, y} = proj(b); const out: React.ReactNode[] = [];
  for (let lon = Math.ceil(b.lon0 / 10) * 10; lon <= b.lon1; lon += 10) out.push(<g key={`o${lon}`}><path d={`M${x(lon)},0 V1080`} stroke="#fff" strokeWidth="0.8" opacity="0.2"/>{labels && x(lon) > 120 && x(lon) < 1800 && <text x={x(lon)} y={908} textAnchor="middle" fontFamily={SANS} fontSize="15" fontWeight={600} letterSpacing="1" fill="#eaf6ff" opacity="0.9" style={{paintOrder: "stroke", stroke: "rgba(10,40,70,.55)", strokeWidth: 3}}>{lon}{"°E"}</text>}</g>);
  for (let lat = Math.ceil(b.lat0 / 10) * 10; lat <= b.lat1; lat += 10) out.push(<g key={`a${lat}`}><path d={`M0,${y(lat)} H1920`} stroke="#fff" strokeWidth="0.8" opacity="0.2"/>{labels && y(lat) > 90 && y(lat) < 900 && lat !== 0 && <text x={104} y={y(lat) - 6} fontFamily={SANS} fontSize="15" fontWeight={600} letterSpacing="1" fill="#eaf6ff" opacity="0.9" style={{paintOrder: "stroke", stroke: "rgba(10,40,70,.55)", strokeWidth: 3}}>{Math.abs(lat)}{"°"}{lat > 0 ? "N" : "S"}</text>}</g>);
  return <g>{out}</g>;
};

export type Streamline = {d: string};
/** A wind ribbon: soft glow, a coloured band, white dashes flowing, chevrons riding along. p = reveal 0..1 */
export const Ribbon: React.FC<{id: string; d: string; p: number; f: number; c1: string; c2: string; w?: number; chevrons?: number; speed?: number; ph?: number}> = ({id, d, p, f, c1, c2, w = 7, chevrons = 4, speed = 1.1, ph = 0}) => {
  const len = useMemo(() => getLength(d), [d]);
  if (p <= 0) return null;
  const items = Array.from({length: chevrons}).map((_, i) => {
    const s = ((i / chevrons + ph + f * speed / len * 1.2) % 1) * len;
    return s < p * len ? {s} : null;
  }).filter(Boolean) as {s: number}[];
  return (
    <g>
      <defs>
        <mask id={`${id}-m`}><path d={d} stroke="#fff" strokeWidth="60" fill="none" pathLength={1} strokeDasharray={`${p} 2`}/></mask>
        <linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1" y2="0"><stop stopColor={c1}/><stop offset="1" stopColor={c2}/></linearGradient>
      </defs>
      <g mask={`url(#${id}-m)`}>
        <path d={d} stroke={c1} strokeWidth={w * 4} strokeLinecap="round" fill="none" opacity="0.3" filter="url(#mp-glow)"/>
        <path d={d} stroke={c1} strokeWidth={w} strokeLinecap="round" fill="none" opacity="0.85"/>
        <path d={d} stroke="#ffffff" strokeWidth={w * 0.28} strokeLinecap="round" fill="none" strokeDasharray="1 14" strokeDashoffset={-f * 1.8} opacity="0.95"/>
      </g>
      {items.map((it, i) => { const pt = getPointAtLength(d, it.s), t = getTangentAtLength(d, it.s), ang = (Math.atan2(t.y, t.x) * 180) / Math.PI; const e = Math.min(1, Math.min(it.s, p * len - it.s) / 40);
        return <path key={i} transform={`translate(${pt.x} ${pt.y}) rotate(${ang})`} d={`M-9,-9 L5,0 L-9,9 L-4,0 Z`} fill="#fff" stroke={c2} strokeWidth="1.6" strokeLinejoin="round" opacity={e}/>; })}
    </g>
  );
};

export const GlowDef: React.FC = () => (
  <defs><filter id="mp-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter></defs>
);

export const MapLabel: React.FC<{x: number; y: number; text: string; size?: number; rot?: number; col?: string; op?: number; italic?: boolean; sans?: boolean; track?: number; anchor?: "start" | "middle" | "end"}> = ({x, y, text, size = 26, rot = 0, col = "#eaf7ff", op = 0.75, italic = true, sans = false, track = 0.3, anchor = "middle"}) => (
  <text x={x} y={y} transform={`rotate(${rot} ${x} ${y})`} textAnchor={anchor} fontFamily={sans ? SANS : SERIF} fontStyle={italic && !sans ? "italic" : "normal"} fontWeight={sans ? 700 : 500} fontSize={size} letterSpacing={`${track}em`} fill={col} opacity={op}
    style={{paintOrder: "stroke", stroke: "rgba(10,40,70,.35)", strokeWidth: 3, strokeLinejoin: "round"}}>{text}</text>
);
