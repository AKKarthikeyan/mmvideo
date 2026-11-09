// Drawing kit for the look B "globe" scenes: an orthographic daylight-illustrated Earth (Natural Earth land in India's view, relief texture,
// soft shelf glow, light from the upper left), painted clouds and cloud towers, ribbon arrows, paper-card tags with leader lines.
// Everything here is a smooth function of f (the 60 fps film passes fractional frames). No numbers are typed: quantities arrive as labels.
import React from "react";
import {getLength, getPointAtLength, getTangentAtLength} from "@remotion/paths";
import {INDIA, LAND} from "../../cartoon/long/scenes/globe_land";
import {SANS, SERIF, clamp, eo, lerp, rng} from "../kit";

const D = Math.PI / 180;
export type View = {cx: number; cy: number; R: number; lon0: number; lat0: number};
export type P = {x: number; y: number; c: number};
export const mix = lerp;
export const cl = clamp;

// ---------------------------------------------------------------- projection (c > 0: the point faces us)
export const proj = (v: View, lon: number, lat: number): P => {
  const l = (lon - v.lon0) * D, p = lat * D, p0 = v.lat0 * D;
  const c = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
  const x = Math.cos(p) * Math.sin(l), y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l);
  return {x: v.cx + v.R * x, y: v.cy - v.R * y, c};
};
const rimmed = (v: View, p: P): P => {
  if (p.c > 0) return p;
  const dx = p.x - v.cx, dy = p.y - v.cy, n = Math.hypot(dx, dy) || 1;
  return {x: v.cx + (dx / n) * v.R, y: v.cy + (dy / n) * v.R, c: p.c};
};
const ringD = (v: View, ring: number[]): string | null => {
  let seen = false, d = "";
  for (let i = 0; i < ring.length; i += 2) {
    const p = proj(v, ring[i], ring[i + 1]);
    if (p.c > 0) seen = true;
    const q = rimmed(v, p);
    d += `${i === 0 ? "M" : "L"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
  }
  return seen ? d + "Z" : null;
};
export const lineD = (v: View, pts: [number, number][], minC = 0.04): string => {
  let d = "", pen = false;
  for (const [lo, la] of pts) {
    const p = proj(v, lo, la);
    if (p.c > minC) { d += `${pen ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`; pen = true; } else pen = false;
  }
  return d;
};
export const lat_line = (lat: number, a = -60, b = 200, step = 4): [number, number][] => { const o: [number, number][] = []; for (let l = a; l <= b; l += step) o.push([l, lat]); return o; };
export const smooth = (pts: [number, number][], per = 8): [number, number][] => {
  if (pts.length < 3) return pts;
  const o: [number, number][] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      o.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  o.push(pts[pts.length - 1]);
  return o;
};
export const pathOf = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
/** a path along lon/lat points, hidden stretches pushed to the rim */
export const flowPts = (v: View, pts: [number, number][]): [number, number][] => smooth(pts, 10).map(([lo, la]) => { const p = rimmed(v, proj(v, lo, la)); return [p.x, p.y] as [number, number]; });

// ---------------------------------------------------------------- shared defs: soft filters, textures
export const GDefs: React.FC<{id: string; f: number}> = ({id, f}) => (
  <defs>
    {/* blur for blobs (bounding-box region) */}
    <filter id={`${id}-b3`} x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id={`${id}-b8`} x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="8"/></filter>
    <filter id={`${id}-b14`} x="-40%" y="-80%" width="180%" height="260%"><feGaussianBlur stdDeviation="14"/></filter>
    {/* blur for strokes (screen-space region, so a flat line still blurs) */}
    <filter id={`${id}-u4`} filterUnits="userSpaceOnUse" x="-100" y="-100" width="2120" height="1280"><feGaussianBlur stdDeviation="4"/></filter>
    <filter id={`${id}-u10`} filterUnits="userSpaceOnUse" x="-100" y="-100" width="2120" height="1280"><feGaussianBlur stdDeviation="10"/></filter>
    <filter id={`${id}-u22`} filterUnits="userSpaceOnUse" x="-100" y="-100" width="2120" height="1280"><feGaussianBlur stdDeviation="22"/></filter>
    <filter id={`${id}-relief`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.026" numOctaves="4" seed="4" result="n"/>
      <feDiffuseLighting in="n" surfaceScale="7" diffuseConstant="1.05" lightingColor="#fff6dd" result="lit"><feDistantLight azimuth="235" elevation="48"/></feDiffuseLighting>
      <feColorMatrix in="lit" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1"/>
    </filter>
    <filter id={`${id}-veg`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.0095 0.0125" numOctaves="4" seed="21"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.34  0 0 0 0 0.52  0 0 0 0 0.27  2.4 0 0 0 -1.05"/>
    </filter>
    <filter id={`${id}-dry`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.014 0.01" numOctaves="3" seed="8"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.78  0 0 0 0 0.52  0 0 0 0 0.3  0 2.2 0 0 -0.95"/>
    </filter>
    <filter id={`${id}-ripple`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency={`0.02 ${0.07 + 0.002 * Math.sin(f / 30)}`} numOctaves="3" seed="2"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 1.7 0 0 -0.82"/>
    </filter>
    <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0.25" y2="1"><stop offset="0" stopColor="#f8efd9"/><stop offset="0.55" stopColor="#efe2c2"/><stop offset="1" stopColor="#e4d0a6"/></linearGradient>
    <radialGradient id={`${id}-sun`} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fffbe6" stopOpacity="0.95"/><stop offset="0.45" stopColor="#ffeeb8" stopOpacity="0.45"/><stop offset="1" stopColor="#ffeeb8" stopOpacity="0"/></radialGradient>
  </defs>
);

// ---------------------------------------------------------------- backdrop: warm daylight paper with an armillary ring
const farCloud = (r: () => number) => Array.from({length: 7}).map(() => ({cx: (r() - 0.5) * 220, cy: (r() - 0.5) * 30, r: 24 + r() * 30}));
const FAR = (() => { const r = rng(91); return [[130, 190, 1.0], [1700, 880, 1.25], [1820, 250, 0.7], [260, 830, 0.85]].map(([x, y, s], i) => ({x, y, s, puffs: farCloud(r), sp: 0.12 + i * 0.03})); })();
export const Backdrop: React.FC<{id: string; f: number; cx: number; cy: number; R: number}> = ({id, f, cx, cy, R}) => {
  const orbit = f * 0.0045;
  return (
    <g>
      <rect width={1920} height={1080} fill={`url(#${id}-bg)`}/>
      <circle cx={330} cy={150} r={620} fill={`url(#${id}-sun)`}/>
      {/* far clouds, pale and drifting (depth) */}
      {FAR.map((c, i) => {
        const x = ((c.x + f * c.sp + 400) % 2640) - 400;
        return <g key={i} transform={`translate(${x} ${c.y}) scale(${c.s})`} opacity="0.5" filter={`url(#${id}-b8)`}>
          {c.puffs.map((q, k) => <ellipse key={k} cx={q.cx} cy={q.cy + 5} rx={q.r} ry={q.r * 0.6} fill="#fffaf0"/>)}
        </g>;
      })}
      <circle cx={cx} cy={cy} r={R * 1.36} fill="none" stroke="#b8905a" strokeWidth="1.3" opacity="0.4" strokeDasharray="2 9" strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r={R * 1.62} fill="none" stroke="#b8905a" strokeWidth="1.1" opacity="0.22"/>
      {Array.from({length: 48}).map((_, i) => { const a = i * 7.5 * D, r0 = R * 1.62, r1 = r0 + (i % 6 === 0 ? 16 : 7);
        return <path key={i} d={`M${cx + r0 * Math.cos(a)},${cy + r0 * Math.sin(a)} L${cx + r1 * Math.cos(a)},${cy + r1 * Math.sin(a)}`} stroke="#b8905a" strokeWidth="1.1" opacity="0.3"/>; })}
      {/* a small gold sun riding the ring */}
      <g transform={`translate(${cx + R * 1.36 * Math.cos(-2.2 + orbit)} ${cy + R * 1.36 * Math.sin(-2.2 + orbit)})`}>
        <circle r="22" fill="#ffd866" opacity="0.35" filter={`url(#${id}-b8)`}/>
        <circle r="8" fill="#ffd45e" stroke="#d9951c" strokeWidth="1.4"/>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- the Earth
export const GlobeB: React.FC<{v: View; id: string; f: number; opacity?: number; under?: React.ReactNode; children?: React.ReactNode; texShift?: number; indiaTop?: boolean; texPad?: number}> = ({v, id, f, opacity = 1, under, children, texShift = 0, indiaTop = false, texPad = 80}) => {
  const rings = LAND.map((r) => ringD(v, r)).filter(Boolean) as string[];
  const india = INDIA.map((r) => ringD(v, r)).filter(Boolean) as string[];
  const landD = rings.join(""), indD = india.join("");
  const grat: string[] = [];
  for (let la = -60; la <= 60; la += 30) if (la !== 0) grat.push(lineD(v, lat_line(la, -180, 180, 5)));
  for (let lo = -180; lo < 180; lo += 30) grat.push(lineD(v, Array.from({length: 25}, (_, i) => [lo, -90 + i * 7.5] as [number, number])));
  const tx = texShift, big = v.R > 700;
  return (
    <g opacity={opacity}>
      <defs>
        <clipPath id={`${id}-disc`}><circle cx={v.cx} cy={v.cy} r={v.R}/></clipPath>
        <clipPath id={`${id}-land`}>{rings.map((d, i) => <path key={i} d={d}/>)}</clipPath>
        <clipPath id={`${id}-ind`}>{india.map((d, i) => <path key={i} d={d}/>)}</clipPath>
        <radialGradient id={`${id}-sea`} cx="0.36" cy="0.3" r="0.95"><stop offset="0" stopColor="#6ec6d2"/><stop offset="0.35" stopColor="#3b9bbd"/><stop offset="0.72" stopColor="#21679f"/><stop offset="1" stopColor="#163e74"/></radialGradient>
        <radialGradient id={`${id}-halo`} cx="0.5" cy="0.5" r="0.5"><stop offset="0.86" stopColor="#a8dcf4" stopOpacity="0"/><stop offset="0.915" stopColor="#b4e2f8" stopOpacity="0.7"/><stop offset="1" stopColor="#b4e2f8" stopOpacity="0"/></radialGradient>
        <radialGradient id={`${id}-shade`} cx="0.34" cy="0.28" r="0.98"><stop offset="0" stopColor="#fff8e0" stopOpacity="0.26"/><stop offset="0.4" stopColor="#fff8e0" stopOpacity="0"/><stop offset="0.74" stopColor="#0a2650" stopOpacity="0.22"/><stop offset="1" stopColor="#05183a" stopOpacity="0.6"/></radialGradient>
        <linearGradient id={`${id}-landg`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#dccb9f"/><stop offset="0.5" stopColor="#c9bd8a"/><stop offset="1" stopColor="#a8a975"/></linearGradient>
        <linearGradient id={`${id}-indg`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ecce88"/><stop offset="0.5" stopColor="#cdb86e"/><stop offset="1" stopColor="#98a763"/></linearGradient>
      </defs>
      {/* ground shadow and atmosphere */}
      <ellipse cx={v.cx + v.R * 0.1} cy={v.cy + v.R * 1.07} rx={v.R * 0.86} ry={v.R * 0.13} fill="#5a3a1a" opacity="0.28" filter={`url(#gb-b14)`}/>
      <circle cx={v.cx} cy={v.cy} r={v.R * 1.1} fill={`url(#${id}-halo)`}/>
      <circle cx={v.cx} cy={v.cy} r={v.R} fill={`url(#${id}-sea)`}/>
      <g clipPath={`url(#${id}-disc)`}>
        <rect x={v.cx - v.R + tx * 0.5} y={v.cy - v.R} width={v.R * 2} height={v.R * 2} filter={`url(#gb-ripple)`} opacity="0.22"/>
        {/* shallow-water glow along every coast */}
        <g>
          <path d={landD + indD} fill="none" stroke="#9fe6d8" strokeWidth={big ? 70 : 34} strokeLinejoin="round" opacity="0.3" filter={`url(#gb-u22)`}/>
          <path d={landD + indD} fill="none" stroke="#c4f4e6" strokeWidth={big ? 18 : 9} strokeLinejoin="round" opacity="0.55" filter={`url(#gb-u4)`}/>
        </g>
        {grat.map((d, i) => <path key={i} d={d} fill="none" stroke="#fff" strokeWidth="0.9" opacity="0.2"/>)}
        <path d={lineD(v, lat_line(0, -180, 180, 4))} fill="none" stroke="#fffbe8" strokeWidth="1.6" strokeDasharray="10 8" opacity="0.5"/>
        {/* land */}
        <path d={landD} fill={`url(#${id}-landg)`}/>
        <g clipPath={`url(#${id}-land)`}>
          <g transform={`translate(${tx} 0)`}>
            <rect x={v.cx - v.R - texPad} y={v.cy - v.R} width={v.R * 2 + texPad * 2} height={v.R * 2} filter={`url(#gb-dry)`} opacity="0.75"/>
            <rect x={v.cx - v.R - texPad} y={v.cy - v.R} width={v.R * 2 + texPad * 2} height={v.R * 2} filter={`url(#gb-veg)`} opacity="0.95"/>
            <rect x={v.cx - v.R - texPad} y={v.cy - v.R} width={v.R * 2 + texPad * 2} height={v.R * 2} filter={`url(#gb-relief)`} style={{mixBlendMode: "multiply"}} opacity="0.7"/>
          </g>
        </g>
        <path d={landD} fill="none" stroke="#8d7a4c" strokeWidth="1" opacity="0.85" strokeLinejoin="round"/>
        <path d={landD} fill="none" stroke="#fff6d8" strokeWidth="1.2" opacity="0.4" transform="translate(-0.8 -0.8)"/>
        {/* India: warmer and outlined, every island kept */}
        <path d={indD} fill="none" stroke="#fff0b4" strokeWidth={big ? 9 : 6} strokeLinejoin="round" opacity="0.5"/>
        <path d={indD} fill={`url(#${id}-indg)`}/>
        <g clipPath={`url(#${id}-ind)`}>
          <g transform={`translate(${tx} 0)`}>
            <rect x={v.cx - v.R - texPad} y={v.cy - v.R} width={v.R * 2 + texPad * 2} height={v.R * 2} filter={`url(#gb-veg)`} opacity="1"/>
            <rect x={v.cx - v.R - texPad} y={v.cy - v.R} width={v.R * 2 + texPad * 2} height={v.R * 2} filter={`url(#gb-relief)`} style={{mixBlendMode: "multiply"}} opacity="0.72"/>
          </g>
        </g>
        <path d={indD} fill="none" stroke="#7a5424" strokeWidth={big ? 2.4 : 2} strokeLinejoin="round"/>
        {under}
        <circle cx={v.cx} cy={v.cy} r={v.R} fill={`url(#${id}-shade)`}/>
        <ellipse cx={v.cx - v.R * 0.38} cy={v.cy - v.R * 0.5} rx={v.R * 0.26} ry={v.R * 0.12} fill="#fff" opacity="0.14" transform={`rotate(-36 ${v.cx - v.R * 0.38} ${v.cy - v.R * 0.5})`} filter={`url(#gb-b14)`}/>
      </g>
      <circle cx={v.cx} cy={v.cy} r={v.R} fill="none" stroke="#1d4d7c" strokeWidth="1.8" opacity="0.85"/>
      <circle cx={v.cx} cy={v.cy} r={v.R - 2.4} fill="none" stroke="#bfe8f8" strokeWidth="1.2" opacity="0.5"/>
      {children}
      {indiaTop && <g><path d={indD} fill="none" stroke="#fff6dc" strokeWidth={big ? 7 : 5} strokeLinejoin="round" opacity="0.8"/><path d={indD} fill="none" stroke="#7a3f12" strokeWidth="2.2" strokeLinejoin="round"/></g>}
    </g>
  );
};
// ---------------------------------------------------------------- clouds
const cloudPuffs = (seed: number) => {
  const r = rng(seed), n = 10;
  return Array.from({length: n}).map((_, i) => {
    const u = (i / (n - 1)) * 2 - 1, rad = 15 + 26 * (1 - Math.pow(Math.abs(u), 1.6)) * (0.7 + 0.6 * r());
    return {cx: u * 80 + (r() - 0.5) * 10, cy: 14 - rad * 0.85 + (r() - 0.5) * 5, r: rad};
  });
};
const PUFFS = Array.from({length: 24}, (_, i) => cloudPuffs(100 + i));
/** gentle painted cloud: a bluish underside, a white body, a warm sunlit top, a soft shadow on what lies below */
export const CloudB: React.FC<{gid: string; x: number; y: number; s: number; sx?: number; a?: number; seed?: number; flip?: boolean; shadow?: boolean}> = ({gid, x, y, s, sx = 1, a = 1, seed = 1, flip, shadow = true}) => {
  const p = PUFFS[Math.abs(Math.floor(seed)) % PUFFS.length];
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s * sx} ${s})`} opacity={a}>
      {shadow && <g transform="translate(30 58)" opacity="0.26" filter={`url(#${gid}-b8)`}>{p.map((q, i) => <ellipse key={i} cx={q.cx} cy={q.cy + 6} rx={q.r * 1.1} ry={q.r * 0.5} fill="#0e2a4a"/>)}</g>}
      <g filter={`url(#${gid}-b3)`}>
        {p.map((q, i) => <ellipse key={i} cx={q.cx} cy={q.cy + 6} rx={q.r} ry={q.r * 0.74} fill="#aebfd8"/>)}
        {p.map((q, i) => <ellipse key={i} cx={q.cx - 2} cy={q.cy - 2} rx={q.r * 0.92} ry={q.r * 0.64} fill="#f4f7fb"/>)}
        {p.map((q, i) => <ellipse key={i} cx={q.cx - 7} cy={q.cy - 9} rx={q.r * 0.5} ry={q.r * 0.34} fill="#fffaf0"/>)}
      </g>
    </g>
  );
};

/** a row of clouds along a parallel (two rows), drifting east; optional golden glow for the bright belt */
export const BandB: React.FC<{v: View; gid: string; f: number; lat: number; glow?: number; op?: number; size?: number; drift?: number; lonA?: number; lonB?: number}> =
({v, gid, f, lat, glow = 0, op = 1, size = 0.002, drift = 0.05, lonA = -50, lonB = 200}) => {
  const step = 9, sh = (f * drift) % step, base = Math.floor((f * drift) / step), s = v.R * size;
  const items: React.ReactNode[] = [];
  for (let row = 0; row < 2; row++) {
    for (let i = 0; lonA + i * step <= lonB; i++) {
      const j = i - base, lon = lonA + i * step + sh + (row ? step / 2 : 0);
      const rr = rng(1000 + row * 97 + ((j % 40) + 40) % 40);
      const la = lat + (row ? -2.2 : 1.8) + (rr() - 0.5) * 1.6, p = proj(v, lon, la);
      if (p.c < 0.08) continue;
      items.push(<CloudB key={`${row}_${i}`} gid={gid} x={p.x} y={p.y + Math.sin(f / 30 + j) * 2} s={(0.8 + rr() * 0.45) * s * (row ? 0.86 : 1)} sx={Math.sqrt(p.c)} a={cl((p.c - 0.08) / 0.12)} seed={j + row * 7} flip={rr() > 0.5}/>);
    }
  }
  const pulse = 0.5 + 0.5 * Math.sin(f / 14), gd = lineD(v, lat_line(lat, lonA, lonB, 3));
  return (
    <g opacity={op}>
      {glow > 0 && <g opacity={glow}>
        <path d={gd} fill="none" stroke="#ff9d3a" strokeWidth={v.R * (0.5 + 0.05 * pulse)} strokeLinecap="round" opacity="0.5" filter={`url(#${gid}-u22)`}/>
        <path d={gd} fill="none" stroke="#ffc760" strokeWidth={v.R * (0.3 + 0.04 * pulse)} strokeLinecap="round" opacity="0.7" filter={`url(#${gid}-u10)`}/>
        <path d={gd} fill="none" stroke="#fff1b8" strokeWidth={v.R * (0.14 + 0.03 * pulse)} strokeLinecap="round" opacity="0.85" filter={`url(#${gid}-u10)`}/>
      </g>}
      {items}
    </g>
  );
};

/** a growing cumulonimbus: g 0..1. A cauliflower of puffs: grey-blue base, white sunlit top with a warm highlight, a flat anvil near the top. */
export const TowerB: React.FC<{gid: string; x: number; y: number; h: number; w: number; g: number; seed?: number; a?: number}> = ({gid, x, y, h, w, g, seed = 1, a = 1}) => {
  if (g <= 0.01) return null;
  const rr = rng(300 + Math.floor(seed) * 13), N = w > 40 ? 34 : 20;
  const ps: {px: number; py: number; r: number; t: number}[] = [];
  for (let i = 0; i < N; i++) {
    const t = (i + 0.5) / N, hw = w * (0.95 - 0.38 * t + 0.14 * Math.sin(t * 9 + seed));
    const grow = eo(clamp((g - t) * 7 + 0.05));
    if (grow <= 0) continue;
    const r = w * (0.46 + 0.34 * rr()) * (1 - 0.2 * t) * grow;
    ps.push({px: x + (rr() * 2 - 1) * hw, py: y - t * h, r, t});
    ps.push({px: x + (rr() * 2 - 1) * hw * 0.9, py: y - (t + 0.02) * h, r: r * 0.85, t});
  }
  const top = y - h * g, anv = clamp((g - 0.74) / 0.26);
  const body = (t: number) => (t < 0.22 ? "#a2b3cf" : t < 0.5 ? "#d3deec" : "#f3f7fc");
  const shade = (t: number) => (t < 0.22 ? "#6f84a8" : t < 0.5 ? "#a3b6d0" : "#c8d6e8");
  ps.sort((p, q) => q.py - p.py);
  return (
    <g opacity={a}>
      <ellipse cx={x} cy={y + 8} rx={w * 1.6} ry={w * 0.32} fill="#1c3558" opacity="0.3" filter={`url(#${gid}-b8)`}/>
      <g filter={`url(#${gid}-b3)`}>
        {ps.map((p, i) => <ellipse key={`s${i}`} cx={p.px + p.r * 0.1} cy={p.py + p.r * 0.28} rx={p.r * 1.02} ry={p.r * 0.92} fill={shade(p.t)}/>)}
        {ps.map((p, i) => <circle key={`b${i}`} cx={p.px} cy={p.py} r={p.r} fill={body(p.t)}/>)}
        {ps.map((p, i) => <ellipse key={`h${i}`} cx={p.px - p.r * 0.3} cy={p.py - p.r * 0.34} rx={p.r * 0.58} ry={p.r * 0.46} fill={p.t > 0.4 ? "#fffaee" : "#e4ecf6"} opacity="0.92"/>)}
        {anv > 0 && Array.from({length: 9}).map((_, i) => { const u = (i / 8) * 2 - 1, ax = x + u * w * 1.7 * anv, ar = w * (0.55 - 0.22 * Math.abs(u)) * (0.4 + 0.6 * anv);
          return <g key={`a${i}`}><ellipse cx={ax + 2} cy={top + w * 0.12} rx={ar * 1.1} ry={ar * 0.58} fill="#aebfd8"/><ellipse cx={ax - ar * 0.1} cy={top + w * 0.02} rx={ar} ry={ar * 0.5} fill="#f7f9fd"/><ellipse cx={ax - ar * 0.25} cy={top - w * 0.03} rx={ar * 0.55} ry={ar * 0.24} fill="#fffaee"/></g>; })}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- arrows
export const ARW = {
  north: ["#f7c04a", "#e48a1c"], south: ["#f2875a", "#cc4a22"], equator: ["#eef7ff", "#6fa8d6"], rise: ["#f27b4c", "#c93a1c"], pole: ["#f9b94a", "#e07a14"],
  sink: ["#5aa1e6", "#2a62b4"], back: ["#ffd56a", "#e8a21c"], trade: ["#6fb4f0", "#2b6cbd"], warm: ["#ffc468", "#e2751a"], rain: ["#f3fbff", "#8fc3ea"],
} as const;
/** a ribbon arrow along screen points: soft shadow, dark under-edge, coloured band, flowing white dashes, a swept head. grow 0..1 draws it on. */
export const ArrowB: React.FC<{gid: string; id: string; pts: [number, number][]; f: number; grow?: number; w?: number; col: readonly [string, string]; opacity?: number; flow?: boolean; shadow?: boolean}> =
({gid, id, pts, f, grow = 1, w = 20, col, opacity = 1, flow = true, shadow = true}) => {
  const d = React.useMemo(() => pathOf(pts), [pts]);
  const len = React.useMemo(() => (pts.length > 1 ? getLength(d) : 0), [d, pts.length]);
  if (grow <= 0.005 || len < 4) return null;
  const hl = w * 1.9 + 14, hw = w * 1.15 + 8, cur = Math.max(len * grow, 1), shaftLen = Math.max(0, cur - hl * 0.7);
  const tip = getPointAtLength(d, Math.min(cur, len - 0.01)), tg = getTangentAtLength(d, Math.min(cur, len - 0.01)), ang = (Math.atan2(tg.y, tg.x) * 180) / Math.PI;
  const headA = cl(grow * 6), p0 = pts[0], p1 = pts[pts.length - 1];
  const dash = `${shaftLen} ${len + 20}`;
  return (
    <g opacity={opacity}>
      <defs><mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="-100" y="-100" width="2120" height="1280"><path d={d} stroke="#fff" strokeWidth={w + 12} fill="none" strokeLinecap="round" strokeDasharray={dash}/></mask><linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]}><stop offset="0" stopColor={col[0]}/><stop offset="1" stopColor={col[1]}/></linearGradient></defs>
      <g strokeLinecap="round" strokeLinejoin="round" fill="none">
        {shadow && <path d={d} stroke="#0a1f40" strokeWidth={w + 8} opacity="0.3" strokeDasharray={dash} transform="translate(5 9)" filter={`url(#${gid}-u4)`}/>}
        <path d={d} stroke={col[1]} strokeWidth={w + 5} opacity="0.55" strokeDasharray={dash} filter={`url(#${gid}-u4)`}/>
        <path d={d} stroke={`url(#${id}-g)`} strokeWidth={w} strokeDasharray={dash}/>
        <path d={d} stroke="#fff" strokeWidth={Math.max(2, w * 0.2)} opacity="0.45" strokeDasharray={dash} transform="translate(-1 -2)"/>
        {flow && <g mask={`url(#${id}-m)`}><path d={d} stroke="#fff" strokeWidth={Math.max(3, w * 0.24)} strokeDasharray={`${w * 0.7} ${w * 2.3}`} strokeDashoffset={-f * 2.2} opacity="0.7"/></g>}
      </g>
      <g transform={`translate(${tip.x} ${tip.y}) rotate(${ang})`} opacity={headA}>
        <path d={`M${-hl * 0.08},3 L${-hl},${hw + 6} L${-hl * 0.7},0 L${-hl},${-hw - 6} L${-hl * 0.08},-3 Z`} fill="#0a1f40" opacity="0.28" transform="translate(4 8)"/>
        <path d={`M0,0 L${-hl},${hw} L${-hl * 0.7},0 L${-hl},${-hw} Z`} fill={col[1]} stroke="#fff" strokeOpacity="0.75" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d={`M${-hl * 0.14},0 L${-hl * 0.78},${-hw * 0.62} L${-hl * 0.6},0 Z`} fill="#fff" opacity="0.25"/>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- labels (warm paper cards) and leaders
let mctx: CanvasRenderingContext2D | null | undefined;
const textW = (t: string, size: number, weight: number, spacing: number) => {
  try {
    mctx ??= document.createElement("canvas").getContext("2d");
    if (!mctx) throw new Error("no canvas");
    mctx.font = `${weight} ${size}px ${SERIF}`;
    return mctx.measureText(t).width + t.length * spacing * size;
  } catch { return t.length * size * 0.68 + t.length * spacing * size; }
};
export type TagBox = {cx: number; cy: number; w: number; h: number; size: number; kicker?: string; title: string};
/** where a tag sits: anchor c/l/r on x, clamped into the safe box; text shrinks to fit maxW. "KICKER: Title" becomes two lines. */
export const tagBox = (text: string, x: number, y: number, anchor: "c" | "l" | "r" = "c", size = 34, maxW = 1100): TagBox => {
  const sp = 0.02, pad = 40, parts = text.split(": "), two = parts.length === 2;
  const title = two ? parts[1] : text, kicker = two ? parts[0] : undefined;
  let sz = size, w = Math.max(textW(title, sz, 600, sp), kicker ? textW(kicker, sz * 0.5, 600, 0.2) : 0) + pad * 2 + (two ? 0 : 26);
  if (w > maxW) { sz = size * (maxW - pad * 2 - (two ? 0 : 26)) / (w - pad * 2 - (two ? 0 : 26)); w = maxW; }
  const h = two ? sz * 1.75 + 34 : sz * 1.75;
  let cx = anchor === "c" ? x : anchor === "l" ? x + w / 2 : x - w / 2;
  cx = cl(cx, 96 + w / 2, 1824 - w / 2);
  return {cx, cy: cl(y, 64 + h / 2, 916 - h / 2), w, h, size: sz, kicker, title};
};
export const Tag: React.FC<{text?: string; box: TagBox; f: number; t0: number; dot?: string}> = ({box, f, t0, dot = "#d8682a"}) => {
  if (f < t0) return null;
  const a = eo((f - t0) / 14), bob = Math.sin(f / 22) * 1.6;
  return (
    <div style={{position: "absolute", left: box.cx - box.w / 2, top: box.cy - box.h / 2 + (1 - a) * 16 + bob, width: box.w, height: box.h, opacity: a, boxSizing: "border-box",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 14, whiteSpace: "nowrap", borderRadius: box.kicker ? 22 : box.h / 2 > 40 ? 26 : box.h / 2,
      background: "linear-gradient(160deg, rgba(255,252,243,.95), rgba(255,242,214,.88))", border: "1.5px solid rgba(190,110,50,.5)",
      boxShadow: "0 24px 46px -22px rgba(80,44,18,.6), 0 6px 14px -6px rgba(80,44,18,.3), inset 0 1.5px 0 rgba(255,255,255,.9)", backdropFilter: "blur(8px)"}}>
      {box.kicker ? (
        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.1}}>
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: box.size * 0.5, letterSpacing: "0.2em", color: dot}}>{box.kicker}</span>
          <span style={{fontFamily: SERIF, fontWeight: 600, fontSize: box.size, letterSpacing: "0.02em", color: "#5e2b10"}}>{box.title}</span>
        </div>
      ) : <>
        <span style={{width: 12, height: 12, borderRadius: 7, background: dot, boxShadow: `0 0 0 4px ${dot}33`, flex: "none"}}/>
        <span style={{fontFamily: SERIF, fontWeight: 600, fontSize: box.size, letterSpacing: "0.02em", color: "#5e2b10"}}>{box.title}</span>
      </>}
    </div>
  );
};
/** a leader from a tag to the thing it names; draws itself from t0 */
export const Leader: React.FC<{box: TagBox; to: [number, number]; f: number; t0: number}> = ({box, to, f, t0}) => {
  if (f < t0) return null;
  const k = eo((f - t0) / 14), x1 = box.cx, y1 = box.cy, x2 = lerp(x1, to[0], k), y2 = lerp(y1, to[1], k);
  return (
    <g opacity={cl((f - t0) / 6)}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.7"/>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6e3a18" strokeWidth="2.6" strokeLinecap="round"/>
      <circle cx={to[0]} cy={to[1]} r={9 * k} fill="#fff6dd" stroke="#6e3a18" strokeWidth="2.6"/>
      <circle cx={to[0]} cy={to[1]} r={3.6 * k} fill="#d8452a"/>
    </g>
  );
};

/** a small sun marker with turning rays */
export const SunB: React.FC<{x: number; y: number; r: number; f: number; gid: string}> = ({x, y, r, f, gid}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r * 2.4} fill="#ffe08a" opacity="0.4" filter={`url(#${gid}-b8)`}/>
    <g transform={`rotate(${f * 0.8})`}>{Array.from({length: 12}).map((_, i) => <path key={i} d={`M0,${-r * 1.35} V${-r * 1.9}`} stroke="#ffc44a" strokeWidth={r * 0.16} strokeLinecap="round" transform={`rotate(${i * 30})`}/>)}</g>
    <circle r={r} fill="#ffd45e" stroke="#e29a1e" strokeWidth="2"/><circle cx={-r * 0.28} cy={-r * 0.28} r={r * 0.45} fill="#fff2b0" opacity="0.85"/>
  </g>
);
