// Map parts for the rich look sample A: projection from basemap.json (Natural Earth 10 m, India's official view, public domain),
// a layered land slab (shelf glow, thickness, lit gradient, relief rim, stipple, straight-cut shade), an ocean, and wind streams.
import React from "react";
import basemap from "../../../public/datayt/long/upsc/basemap.json";
import {K, W, H, clamp, lerp, mix, shade, lite, useId2, rnd, sstep} from "./rk";

export type Box = {lon0: number; lon1: number; lat0: number; lat1: number; k: number; land: string; india: string};
export const BOXES = (basemap as unknown as {boxes: Record<string, Box>}).boxes;
export type Pt = {x: number; y: number};

export type View = {tf: string; sc: number; P: (lon: number, lat: number) => Pt; M: (lon: number, lat: number) => Pt};
// A camera on a box: scale sc, centred on (cLon, cLat), which lands at screen point (sx, sy).
export const mkView = (b: Box, sc: number, cLon: number, cLat: number, sx = W / 2, sy = H / 2): View => {
  const cx = (cLon - b.lon0) * b.k, cy = (b.lat1 - cLat) * b.k;
  const M = (lon: number, lat: number): Pt => ({x: (lon - b.lon0) * b.k, y: (b.lat1 - lat) * b.k});
  return {tf: `translate(${sx} ${sy}) scale(${sc}) translate(${-cx} ${-cy})`, sc, M,
    P: (lon, lat) => { const m = M(lon, lat); return {x: sx + (m.x - cx) * sc, y: sy + (m.y - cy) * sc}; }};
};

// ---- ocean: deep navy, light from the upper left, slow current lines, faint graticule ------------------------------------------------
export const Ocean: React.FC<{f: number; b: Box; v: View; warmX?: number; warmY?: number; warm?: number; w?: number; h?: number; id: string}> = ({f, b, v, warm = 0.5, warmX = 1500, warmY = 260, w = W, h = H, id}) => {
  const rr = rnd(11);
  const lines = Array.from({length: 26}, (_, i) => ({y: 40 + rr() * (h - 80), x: rr() * w, len: 140 + rr() * 260, ph: rr() * 6.28, a: 0.05 + rr() * 0.08}));
  const grat: React.ReactNode[] = [];
  for (let lon = 10; lon <= 130; lon += 10) { const p = v.P(lon, b.lat1), q = v.P(lon, b.lat0); grat.push(<line key={`o${lon}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={K.haze} strokeWidth={1.5} opacity={0.14}/>); }
  for (let lat = -40; lat <= 40; lat += 10) { if (lat === 0) continue; const p = v.P(b.lon0, lat), q = v.P(b.lon1, lat); grat.push(<line key={`a${lat}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={K.haze} strokeWidth={1.5} opacity={0.14}/>); }
  return <g>
    <defs>
      <linearGradient id={`${id}-sea`} x1="0.1" y1="0" x2="0.7" y2="1"><stop offset="0" stopColor="#173A86"/><stop offset="0.45" stopColor="#102C6E"/><stop offset="1" stopColor="#0A1A4C"/></linearGradient>
      <radialGradient id={`${id}-wm`} cx={warmX / w} cy={warmY / h} r="0.5"><stop offset="0" stopColor={K.orange} stopOpacity={0.30 * warm}/><stop offset="1" stopColor={K.orange} stopOpacity={0}/></radialGradient>
      <radialGradient id={`${id}-cool`} cx="0.45" cy="1.05" r="0.7"><stop offset="0" stopColor={K.teal} stopOpacity={0.22}/><stop offset="1" stopColor={K.teal} stopOpacity={0}/></radialGradient>
    </defs>
    <rect width={w} height={h} fill={`url(#${id}-sea)`}/>
    <rect width={w} height={h} fill={`url(#${id}-cool)`}/>
    <rect width={w} height={h} fill={`url(#${id}-wm)`}/>
    {grat}
    {lines.map((l, i) => { const x = ((l.x + f * (0.5 + (i % 3) * 0.3)) % (w + 400)) - 200;
      return <path key={i} d={`M ${x} ${l.y} q ${l.len * 0.25} ${-12 + Math.sin(f / 40 + l.ph) * 5} ${l.len * 0.5} 0 t ${l.len * 0.5} 0`} fill="none" stroke={K.tealL} strokeWidth={3} strokeLinecap="round" opacity={l.a}/>; })}
  </g>;
};

// ---- land: shelf glow, thickness, lit gradient, relief rim, stipple, straight-cut shade; India in warm light ----------------------------
export const LandLayer: React.FC<{b: Box; v: View; f: number; id: string; indiaHeat?: number; landA?: string; landB?: string; shelf?: number}> =
  ({b, v, f, id, indiaHeat = 0.6, landA = "#5B6FD6", landB = "#26398F", shelf = 1}) => {
  const u = 1 / v.sc, mapW = (b.lon1 - b.lon0) * b.k, mapH = (b.lat1 - b.lat0) * b.k;
  const pulse = 0.5 + 0.5 * Math.sin(f / 26);
  const both = <><path d={b.land}/><path d={b.india}/></>;
  return <g transform={v.tf}>
    <defs>
      <linearGradient id={`${id}-lg`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={mapW * 0.6} y2={mapH}><stop offset="0" stopColor={landA}/><stop offset="1" stopColor={landB}/></linearGradient>
      <linearGradient id={`${id}-ig`} gradientUnits="userSpaceOnUse" x1={mapW * 0.45} y1={0} x2={mapW * 0.8} y2={mapH * 0.5}><stop offset="0" stopColor="#FFC15A"/><stop offset="1" stopColor="#F07C2E"/></linearGradient>
      <pattern id={`${id}-dots`} width={13 * u * 1.4} height={13 * u * 1.4} patternUnits="userSpaceOnUse"><circle cx={3 * u} cy={3 * u} r={1.3 * u} fill="#fff" opacity={0.22}/><circle cx={9 * u} cy={9 * u} r={1 * u} fill="#fff" opacity={0.14}/></pattern>
      <clipPath id={`${id}-all`}>{both}</clipPath>
      <clipPath id={`${id}-ind`}><path d={b.india}/></clipPath>
      <clipPath id={`${id}-oth`}><path d={b.land}/></clipPath>
      <filter id={`${id}-bl`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={14 * u}/></filter>
      <filter id={`${id}-bl2`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={34 * u}/></filter>
    </defs>
    {/* coastal shelf: the outline stroked wide, breathing slowly */}
    {[110, 64, 30].map((w, i) => <g key={w} opacity={(0.05 + i * 0.045) * shelf}>
      <path d={b.land} fill="none" stroke={K.teal} strokeWidth={(w + Math.sin(f / 40 + i) * 5) * u} strokeLinejoin="round"/>
      <path d={b.india} fill="none" stroke={K.teal} strokeWidth={(w + Math.sin(f / 40 + i) * 5) * u} strokeLinejoin="round"/></g>)}
    <g filter={`url(#${id}-bl)`} opacity={0.55}><path d={b.land} fill="none" stroke={K.tealL} strokeWidth={9 * u}/><path d={b.india} fill="none" stroke={K.tealL} strokeWidth={9 * u}/></g>
    {/* India's heat bloom */}
    <g filter={`url(#${id}-bl2)`} opacity={indiaHeat * (0.55 + 0.25 * pulse)}><path d={b.india} fill={K.orange}/></g>
    {/* thickness */}
    {[16, 11, 6].map((dy, i) => <g key={dy} transform={`translate(${dy * 0.35 * u} ${dy * u})`}><path d={b.land} fill={mix("#070D33", K.deep, i / 2)}/><path d={b.india} fill={mix("#3A1B1B", "#8A3A1E", i / 2)}/></g>)}
    {/* land */}
    <path d={b.land} fill={`url(#${id}-lg)`}/>
    <path d={b.india} fill={`url(#${id}-ig)`}/>
    <g clipPath={`url(#${id}-oth)`}>
      {[44, 24, 11].map((w, i) => <path key={w} d={b.land} fill="none" stroke="#9BB0FF" strokeWidth={w * u} strokeLinejoin="round" opacity={0.05 + i * 0.05}/>)}
      <path d={`M ${mapW * 0.52} -80 L ${mapW + 80} -80 L ${mapW + 80} ${mapH + 80} L ${mapW * 0.22} ${mapH + 80} Z`} fill={K.night} opacity={0.22}/>
      <rect x={-50} y={-50} width={mapW + 100} height={mapH + 100} fill={`url(#${id}-dots)`}/>
    </g>
    <g clipPath={`url(#${id}-ind)`}>
      {[38, 20, 9].map((w, i) => <path key={w} d={b.india} fill="none" stroke="#FFE9A8" strokeWidth={w * u} strokeLinejoin="round" opacity={0.10 + i * 0.07}/>)}
      <path d={`M ${mapW * 0.62} -80 L ${mapW + 80} -80 L ${mapW + 80} ${mapH + 80} L ${mapW * 0.46} ${mapH + 80} Z`} fill="#6A1E12" opacity={0.2}/>
      <rect x={-50} y={-50} width={mapW + 100} height={mapH + 100} fill={`url(#${id}-dots)`} opacity={0.9}/>
    </g>
    {/* rim light on the coasts */}
    <path d={b.land} fill="none" stroke="#B6C6FF" strokeWidth={1.8 * u} strokeLinejoin="round" opacity={0.7}/>
    <path d={b.india} fill="none" stroke="#FFF0C2" strokeWidth={2.2 * u} strokeLinejoin="round" opacity={0.95}/>
  </g>;
};

// ---- wind streams ----------------------------------------------------------------------------------------------------------------------
export type Curve = {pts: Pt[]; len: number[]; total: number};
export const catmull = (ctrl: Pt[], per = 14): Curve => {
  const p = [ctrl[0], ...ctrl, ctrl[ctrl.length - 1]], out: Pt[] = [];
  for (let i = 1; i < p.length - 2; i++) for (let j = 0; j < per; j++) {
    const t = j / per, t2 = t * t, t3 = t2 * t;
    const g = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
    out.push({x: g(p[i - 1].x, p[i].x, p[i + 1].x, p[i + 2].x), y: g(p[i - 1].y, p[i].y, p[i + 1].y, p[i + 2].y)});
  }
  out.push(ctrl[ctrl.length - 1]);
  const len = [0];
  for (let i = 1; i < out.length; i++) len.push(len[i - 1] + Math.hypot(out[i].x - out[i - 1].x, out[i].y - out[i - 1].y));
  return {pts: out, len, total: len[len.length - 1]};
};
export const sampleAt = (c: Curve, s: number): {x: number; y: number; a: number} => {
  s = clamp(s, 0, c.total);
  let i = 1; while (i < c.len.length - 1 && c.len[i] < s) i++;
  const a = c.pts[i - 1], b = c.pts[i], t = (s - c.len[i - 1]) / Math.max(1e-6, c.len[i] - c.len[i - 1]);
  return {x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), a: Math.atan2(b.y - a.y, b.x - a.x)};
};
const partial = (c: Curve, s: number): string => {
  if (s <= 0) return "";
  let d = `M ${c.pts[0].x.toFixed(1)} ${c.pts[0].y.toFixed(1)}`;
  for (let i = 1; i < c.pts.length && c.len[i] <= s; i++) d += ` L ${c.pts[i].x.toFixed(1)} ${c.pts[i].y.toFixed(1)}`;
  const e = sampleAt(c, s); return d + ` L ${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
};
// Lit/shade arrowhead pointing along angle a.
export const Arrowhead: React.FC<{x: number; y: number; a: number; s: number; c: string; o?: number}> = ({x, y, a, s, c, o = 1}) =>
  <g transform={`translate(${x} ${y}) rotate(${(a * 180) / Math.PI}) scale(${s})`} opacity={o}>
    <path d="M 16 0 L -10 -13 L -3 0 Z" fill={lite(c, 0.5)}/><path d="M 16 0 L -10 13 L -3 0 Z" fill={shade(c, 0.3)}/>
  </g>;

// One wind stream: a soft glow ribbon, a gradient core, chevrons that flow along it, an arrowhead at the drawn tip.
export const Stream: React.FC<{curve: Curve; s: number; f: number; w: number; c0: string; c1: string; id: string; speed?: number; gap?: number; head?: boolean; o?: number; split?: number}> =
  ({curve, s, f, w, c0, c1, id, speed = 3.2, gap = 78, head = true, o = 1, split = 0.5}) => {
  if (s <= 1) return null;
  const a = curve.pts[0], z = curve.pts[curve.pts.length - 1], d = partial(curve, s), tip = sampleAt(curve, s);
  const n = Math.floor(s / gap) + 2, chev: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const pos = (((i * gap + f * speed) % (n * gap)) + n * gap) % (n * gap);
    if (pos > s - 6) continue;
    const q = sampleAt(curve, pos), k = Math.min(1, pos / 60, (s - pos) / 60);
    const col = mix(c0, c1, sstep(split - 0.08, split + 0.1, pos / curve.total));
    chev.push(<g key={i} transform={`translate(${q.x.toFixed(1)} ${q.y.toFixed(1)}) rotate(${(q.a * 180) / Math.PI}) scale(${w * 0.17})`} opacity={k * 0.95}>
      <path d="M 9 0 L -7 -9 L -3 0 Z" fill={lite(col, 0.6)}/><path d="M 9 0 L -7 9 L -3 0 Z" fill={shade(col, 0.25)}/></g>);
  }
  return <g opacity={o}>
    <defs><linearGradient id={id} gradientUnits="userSpaceOnUse" x1={a.x} y1={a.y} x2={z.x} y2={z.y}><stop offset="0" stopColor={c0}/><stop offset={split - 0.06} stopColor={c0}/><stop offset={split + 0.1} stopColor={c1}/><stop offset="1" stopColor={c1}/></linearGradient>
      <filter id={`${id}b`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={w * 0.9}/></filter></defs>
    <path d={d} fill="none" stroke={`url(#${id})`} strokeWidth={w * 3.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} filter={`url(#${id}b)`}/>
    <path d={d} fill="none" stroke={`url(#${id})`} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={0.5}/>
    <path d={d} fill="none" stroke={lite(c0, 0.7)} strokeWidth={Math.max(1.5, w * 0.22)} strokeLinecap="round" strokeLinejoin="round" opacity={0.55}
      strokeDasharray={`${w * 5} ${w * 7}`} strokeDashoffset={-f * speed}/>
    {chev}
    {head && <Arrowhead x={tip.x} y={tip.y} a={tip.a} s={w * 0.26} c={mix(c0, c1, sstep(split - 0.08, split + 0.1, s / curve.total))}/>}
  </g>;
};

// Sparse white shimmer along a path: tiny glints that slide and twinkle (water or air).
export const Glints: React.FC<{f: number; n: number; seed: number; box: [number, number, number, number]; c?: string}> = ({f, n, seed, box, c = "#fff"}) => {
  const r = rnd(seed), [x0, y0, x1, y1] = box;
  return <g>{Array.from({length: n}, (_, i) => { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), ph = r() * 6.28, k = Math.max(0, Math.sin(f / 16 + ph)) ** 6;
    return k > 0.02 ? <g key={i} opacity={k * 0.8}><path d={`M ${x - 7} ${y} L ${x + 7} ${y} M ${x} ${y - 7} L ${x} ${y + 7}`} stroke={c} strokeWidth={2} strokeLinecap="round"/></g> : null; })}</g>;
};
export { sstep };
