// Drawing kit for the "globe" scene kind (UPSC monsoon film): an orthographic flat-vector Earth (Natural Earth land, India's view),
// cloud puffs / towers, flowing arrows and label pills. Everything is flat fills with 8 px ink outlines. See ../CONTRACT_UPSC.md.
import React from "react";
import {random} from "remotion";
import {C} from "../../palette";
import {ROUND, ease, pop} from "../../ui";
import {SAFE} from "../contract";
import {INDIA, LAND} from "./globe_land";

const D = Math.PI / 180;
export const INK = C.ink;
export type View = {cx: number; cy: number; R: number; lon0: number; lat0: number};
export type P = {x: number; y: number; c: number};
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// Orthographic projection; c > 0 means the point faces us.
export const proj = (v: View, lon: number, lat: number): P => {
  const l = (lon - v.lon0) * D, p = lat * D, p0 = v.lat0 * D;
  const c = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
  const x = Math.cos(p) * Math.sin(l), y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l);
  return {x: v.cx + v.R * x, y: v.cy - v.R * y, c};
};
// A back-facing point is pushed out to the rim so a partly hidden country keeps a sensible outline.
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
// Visible stretches of a geo polyline, as one path string.
export const lineD = (v: View, pts: [number, number][], minC = 0.04): string => {
  let d = "", pen = false;
  for (const [lo, la] of pts) {
    const p = proj(v, lo, la);
    if (p.c > minC) { d += `${pen ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`; pen = true; } else pen = false;
  }
  return d;
};
export const lat_line = (lat: number, a = -60, b = 200, step = 4): [number, number][] => { const o: [number, number][] = []; for (let l = a; l <= b; l += step) o.push([l, lat]); return o; };

// Catmull-Rom through control points, `per` samples per segment.
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

// ---------------------------------------------------------------- backdrop
export const Sky: React.FC<{f: number}> = ({f}) => <g>
  <rect x={0} y={0} width={1920} height={1080} fill={C.sky}/>
  {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={960 + Math.sin(f / 150 + i) * 20} cy={500} r={480 + i * 150} fill="none" stroke={C.sky2} strokeWidth={26} opacity={0.55 - i * 0.08}/>)}
  {Array.from({length: 22}, (_, i) => {
    const x = 70 + random("sx" + i) * 1780, y = 90 + random("sy" + i) * 820, s = 8 + random("ss" + i) * 14, tw = 0.45 + 0.4 * Math.sin(f / 18 + i * 2.1);
    return <path key={i} d={`M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`} fill={C.white} opacity={tw}/>;
  })}
</g>;

// ---------------------------------------------------------------- the Earth
export const Globe: React.FC<{v: View; id: string; f: number; opacity?: number; children?: React.ReactNode}> = ({v, id, f, opacity = 1, children}) => {
  const rings = React.useMemo(() => LAND.map((r) => ringD(v, r)).filter(Boolean) as string[], [v.cx, v.cy, v.R, v.lon0, v.lat0]); // eslint-disable-line
  const india = INDIA.map((r) => ringD(v, r)).filter(Boolean) as string[];
  const grat: string[] = [];
  for (let la = -60; la <= 60; la += 30) if (la !== 0) grat.push(lineD(v, lat_line(la, -180, 180, 5)));
  for (let lo = -180; lo < 180; lo += 30) grat.push(lineD(v, Array.from({length: 25}, (_, i) => [lo, -90 + i * 7.5] as [number, number])));
  const sh = v.R * 0.1;
  return <g opacity={opacity}>
    <clipPath id={id}><circle cx={v.cx} cy={v.cy} r={v.R}/></clipPath>
    <circle cx={v.cx + v.R * 0.05} cy={v.cy + v.R * 0.06} r={v.R + 10} fill={C.shadow}/>
    <circle cx={v.cx} cy={v.cy} r={v.R} fill={C.blue}/>
    <g clipPath={`url(#${id})`}>
      {grat.map((d, i) => <path key={i} d={d} fill="none" stroke={C.white} strokeWidth={3} opacity={0.22}/>)}
      <path d={lineD(v, lat_line(0, -180, 180, 4))} fill="none" stroke={C.white} strokeWidth={4} strokeDasharray="16 14" opacity={0.5}/>
      <g stroke={INK} strokeWidth={16} strokeLinejoin="round" fill={INK}>{rings.map((d, i) => <path key={i} d={d}/>)}{india.map((d, i) => <path key={"i" + i} d={d}/>)}</g>
      <g fill={C.green} stroke={C.green} strokeWidth={4} strokeLinejoin="round">{rings.map((d, i) => <path key={i} d={d}/>)}</g>
      <g fill={C.orange} stroke={INK} strokeWidth={5} strokeLinejoin="round">{india.map((d, i) => <path key={i} d={d}/>)}</g>
      <path fillRule="evenodd" fill={C.royalDark} opacity={0.2}
        d={`M${v.cx - v.R} ${v.cy}a${v.R} ${v.R} 0 1 0 ${2 * v.R} 0a${v.R} ${v.R} 0 1 0 ${-2 * v.R} 0ZM${v.cx - v.R - sh} ${v.cy - sh}a${v.R} ${v.R} 0 1 0 ${2 * v.R} 0a${v.R} ${v.R} 0 1 0 ${-2 * v.R} 0Z`}/>
    </g>
    <circle cx={v.cx} cy={v.cy} r={v.R} fill="none" stroke={INK} strokeWidth={10}/>
    {children}
  </g>;
};

// ---------------------------------------------------------------- clouds
const PUFF: [number, number, number][] = [[-1.15, 0.22, 0.62], [-0.5, -0.12, 0.8], [0.25, -0.3, 0.95], [1.0, -0.06, 0.78], [1.55, 0.28, 0.55], [0.15, 0.3, 0.9]];
export const Puff: React.FC<{x: number; y: number; s: number; sx?: number; op?: number; flip?: boolean; tint?: string}> = ({x, y, s, sx = 1, op = 1, flip, tint = C.white}) =>
  <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * sx} 1)`} opacity={op}>
    {PUFF.map(([a, b, r], i) => <circle key={"o" + i} cx={a * s} cy={b * s} r={r * s + 7} fill={INK}/>)}
    {PUFF.map(([a, b, r], i) => <circle key={"f" + i} cx={a * s} cy={b * s} r={r * s} fill={tint}/>)}
    <circle cx={0.3 * s} cy={0.5 * s} r={0.55 * s} fill={C.sky} opacity={0.55}/>
    <circle cx={-0.2 * s} cy={-0.5 * s} r={0.32 * s} fill={C.white}/>
  </g>;

// A row of puffs along a parallel; `lat` may be fractional; drifts slowly east. Puffs near the rim fade out.
export const Band: React.FC<{v: View; f: number; lat: number; glow?: number; op?: number; size?: number; drift?: number; lonA?: number; lonB?: number; id?: string}> =
({v, f, lat, glow = 0, op = 1, size = 0.07, drift = 0.05, lonA = -50, lonB = 200, id}) => {
  const step = 9, sh = (f * drift) % step, base = Math.floor((f * drift) / step), s = v.R * size;
  const items: React.ReactNode[] = [];
  for (let row = 0; row < 2; row++) {
    for (let i = 0; lonA + i * step <= lonB; i++) {
      const j = i - base, lon = lonA + i * step + sh + (row ? step / 2 : 0), la = lat + (row ? -2.6 : 2.4) + (random("bl" + row + j) - 0.5) * 2.2;
      const p = proj(v, lon, la);
      if (p.c < 0.1) continue;
      const rr = (0.82 + random("bs" + row + j) * 0.4) * s * (row ? 0.85 : 1);
      items.push(<Puff key={row + "_" + i} x={p.x} y={p.y + Math.sin(f / 30 + j) * 2} s={rr} sx={Math.sqrt(p.c)} op={cl((p.c - 0.1) / 0.1)} flip={random("bf" + j) > 0.5}/>);
    }
  }
  const pulse = 0.5 + 0.5 * Math.sin(f / 14);
  const gd = lineD(v, lat_line(lat, lonA, lonB, 3));
  return <g opacity={op} clipPath={id ? `url(#${id})` : undefined}>
    {glow > 0 && <g opacity={glow}>
      <path d={gd} fill="none" stroke={C.yellow} strokeWidth={v.R * (0.42 + 0.04 * pulse)} strokeLinecap="round" opacity={0.28}/>
      <path d={gd} fill="none" stroke={C.yellow} strokeWidth={v.R * (0.28 + 0.03 * pulse)} strokeLinecap="round" opacity={0.5}/>
      <path d={gd} fill="none" stroke={C.yellow} strokeWidth={v.R * (0.16 + 0.02 * pulse)} strokeLinecap="round" opacity={0.85}/>
    </g>}
    {items}
  </g>;
};

// A growing cumulonimbus: g = 0..1 growth. Storm-grey base, white top, flat anvil when nearly grown.
export const Tower: React.FC<{x: number; y: number; h: number; w: number; g: number; seed?: number}> = ({x, y, h, w, g, seed = 1}) => {
  const n = 5, cs: {cx: number; cy: number; r: number; col: string}[] = [];
  for (let i = 0; i < n; i++) {
    const k = cl(g * n - i), r = w * (0.95 - i * 0.05) * (0.55 + 0.45 * k), cy = y - (i / (n - 1)) * h * g, col = i < 2 ? "#B3C2D8" : i < 3 ? "#D8E3F0" : C.white;
    if (k <= 0) continue;
    const j = (random("tw" + seed + i) - 0.5) * w * 0.3;
    cs.push({cx: x + j, cy, r, col}, {cx: x + j - w * 0.55, cy: cy + r * 0.15, r: r * 0.7, col}, {cx: x + j + w * 0.55, cy: cy + r * 0.15, r: r * 0.7, col});
  }
  const anv = cl((g - 0.8) / 0.2), ay = y - h * g - w * 0.35;
  return <g>
    {cs.map((c, i) => <circle key={"o" + i} cx={c.cx} cy={c.cy} r={c.r + 7} fill={INK}/>)}
    {anv > 0 && <ellipse cx={x} cy={ay} rx={w * 1.45 * anv + 7} ry={w * 0.42 * anv + 7} fill={INK}/>}
    {cs.map((c, i) => <circle key={"f" + i} cx={c.cx} cy={c.cy} r={c.r} fill={c.col}/>)}
    {anv > 0 && <ellipse cx={x} cy={ay} rx={w * 1.45 * anv} ry={w * 0.42 * anv} fill={C.white}/>}
  </g>;
};

// ---------------------------------------------------------------- arrows
// Core: an arrow along screen points. `grow` 0..1 draws it on; white dashes flow along the shaft.
export const Arrow2D: React.FC<{pts: [number, number][]; f: number; grow?: number; w?: number; color?: string; opacity?: number; flow?: boolean}> =
({pts, f, grow = 1, w = 22, color = C.yellow, opacity = 1, flow = true}) => {
  if (grow <= 0.01 || pts.length < 2) return null;
  const nUse = Math.max(2, Math.round(grow * (pts.length - 1)) + 1), use = pts.slice(0, nUse);
  const q = use[use.length - 1], p = use[Math.max(0, use.length - 3)];
  const ang = Math.atan2(q[1] - p[1], q[0] - p[0]), dx = Math.cos(ang), dy = Math.sin(ang), hs = (w * 1.1 + 16) * Math.min(1, grow * 4);
  const shaft = use.slice(0, -1).concat([[q[0] - dx * hs * 0.8, q[1] - dy * hs * 0.8]]);
  const d = shaft.map((a, i) => `${i ? "L" : "M"}${a[0].toFixed(1)} ${a[1].toFixed(1)}`).join("");
  const head = `${q[0]},${q[1]} ${q[0] - dx * hs * 1.4 - dy * hs * 0.9},${q[1] - dy * hs * 1.4 + dx * hs * 0.9} ${q[0] - dx * hs * 1.4 + dy * hs * 0.9},${q[1] - dy * hs * 1.4 - dx * hs * 0.9}`;
  return <g opacity={opacity} strokeLinecap="round" strokeLinejoin="round" fill="none">
    <path d={d} stroke={INK} strokeWidth={w + 14}/>
    <polygon points={head} fill={INK} stroke={INK} strokeWidth={14}/>
    <path d={d} stroke={color} strokeWidth={w}/>
    <polygon points={head} fill={color} stroke="none"/>
    {flow && <path d={d} stroke={C.white} strokeWidth={Math.max(5, w * 0.3)} strokeDasharray={`${w * 0.9} ${w * 2.2}`} strokeDashoffset={-f * 2.6} opacity={0.85}/>}
  </g>;
};
// Arrow along a path given in lon/lat (smoothed); samples hidden behind the rim are pushed to it.
export const Flow: React.FC<{v: View; pts: [number, number][]; f: number; grow?: number; w?: number; color?: string; opacity?: number; flow?: boolean}> = ({v, pts, ...rest}) => {
  const s = smooth(pts, 8).map(([lo, la]) => { const p = rimmed(v, proj(v, lo, la)); return [p.x, p.y] as [number, number]; });
  return <Arrow2D pts={s} {...rest}/>;
};
export const Smooth2D = (pts: [number, number][], per = 8) => smooth(pts, per);

// ---------------------------------------------------------------- labels
// A white pill with an ink border and a hard offset shadow. Drawn only from t0 (the narrator's word). anchor: c/l/r on x.
export const LabelPill: React.FC<{text: string; x: number; y: number; f: number; t0: number; size?: number; anchor?: "c" | "l" | "r"; maxW?: number; to?: [number, number]; fill?: string}> =
({text, x, y, f, t0, size = 46, anchor = "c", maxW = 1500, to, fill = C.white}) => {
  if (f < t0) return null;
  const cw = 0.66, pad = 30;
  let sz = size; if (text.length * cw * sz + pad * 2 > maxW) sz = (maxW - pad * 2) / (text.length * cw);
  const w = text.length * cw * sz + pad * 2, h = sz * 1.5;
  let cx = anchor === "c" ? x : anchor === "l" ? x + w / 2 : x - w / 2;
  cx = cl(cx, SAFE.x0 + w / 2 + 22, SAFE.x1 - w / 2 - 22);
  const cy = cl(y, SAFE.y0 + h / 2 + 8, 916 - h / 2 - 8);
  const k = pop(f, t0, 170), sc = 0.4 + 0.6 * k, bob = Math.sin(f / 22) * 2;
  return <g>
    {to && <g opacity={cl((f - t0) / 8)}><line x1={cx} y1={cy} x2={to[0]} y2={to[1]} stroke={INK} strokeWidth={7} strokeLinecap="round"/><circle cx={to[0]} cy={to[1]} r={12} fill={C.red} stroke={INK} strokeWidth={5}/></g>}
    <g transform={`translate(${cx} ${cy + bob}) scale(${sc})`} opacity={cl((f - t0) / 5)}>
      <rect x={-w / 2 + 7} y={-h / 2 + 9} width={w} height={h} rx={h / 2} fill={INK} opacity={0.35}/>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={fill} stroke={INK} strokeWidth={6}/>
      <text x={0} y={sz * 0.35} textAnchor="middle" fontFamily={ROUND} fontWeight={800} fontSize={sz} fill={INK}>{text}</text>
    </g>
  </g>;
};

// A sun marker: yellow disc with slowly turning rays and an ink outline.
export const SunSpot: React.FC<{x: number; y: number; r: number; f: number}> = ({x, y, r, f}) => <g transform={`translate(${x} ${y})`}>
  <g transform={`rotate(${f * 0.8})`}>{Array.from({length: 10}, (_, i) => <g key={i} transform={`rotate(${i * 36})`}>
    <path d={`M${-r * 0.22} ${-r * 1.15}L0 ${-r * 1.75}L${r * 0.22} ${-r * 1.15}Z`} fill={C.yellow} stroke={INK} strokeWidth={5} strokeLinejoin="round"/></g>)}</g>
  <circle r={r} fill={C.yellow} stroke={INK} strokeWidth={7}/>
  <circle cx={-r * 0.3} cy={-r * 0.3} r={r * 0.28} fill={C.white} opacity={0.7}/>
</g>;

export const easeCub = (f: number, a: number, b: number, from = 0, to = 1) => ease(f, a, b, from, to);
