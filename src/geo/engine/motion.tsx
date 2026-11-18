// Motion layer for the premium theme (AK 25 Oct 2026: "more motion graphics, visually rich").
// Engine-wide (no spec changes needed): floating camera + beat punch-ins, light sweep at each beat, 9-segment beat progress,
// drifting light motes, locator globe inset. Plus an animated line-icon library used by the "icon" layer kind.
import React from "react";
import {noise2D} from "@remotion/noise";
import {geoArea, geoOrthographic, geoPath} from "d3-geo";
import {PC, SANS} from "./premium";

type Cam = {lon: number; lat: number; span: number};
type LB = {key: string; start: number; end: number}[];
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);

// ---------- camera: organic drift + a small push-in at every beat start ----------
export const driftCam = (c: Cam, t: number, B: LB): Cam => {
  const dx = noise2D("cx", t * 0.12, 0) * 0.018 * c.span, dy = noise2D("cy", 0, t * 0.12) * 0.018 * c.span;
  const beat = [...B].reverse().find((b) => t >= b.start);
  const since = beat && beat !== B[0] ? t - beat.start : 99;
  const punch = since < 0.9 ? Math.sin(Math.PI * clamp(since / 0.9)) * 0.022 : 0;
  const breathe = 1 + noise2D("cz", t * 0.08, 3) * 0.02;
  return {lon: c.lon + dx, lat: c.lat + dy, span: c.span * breathe * (1 - punch)};
};

// ---------- light sweep at each beat change ----------
export const Sweep: React.FC<{t: number; B: LB}> = ({t, B}) => {
  const beat = [...B].reverse().find((b) => t >= b.start);
  if (!beat || beat === B[0]) return null;
  const u = (t - beat.start) / 0.6; if (u > 1) return null;
  const x = -600 + 2400 * easeOut(u);
  return <div style={{position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen", opacity: 0.55 * (1 - u * 0.6),
    background: `linear-gradient(105deg, rgba(255,255,255,0) ${x - 260}px, rgba(255,214,150,0.22) ${x - 60}px, rgba(255,255,255,0.32) ${x}px, rgba(255,214,150,0.22) ${x + 60}px, rgba(255,255,255,0) ${x + 260}px)`}}/>;
};

// ---------- beat progress: 9 segments under the channel tag ----------
export const Progress: React.FC<{t: number; B: LB}> = ({t, B}) => {
  const w = 600, gap = 8, n = B.length, sw = (w - gap * (n - 1)) / n;
  return <div style={{position: "absolute", top: 160, left: (1080 - w) / 2, width: w, height: 6, display: "flex", gap}}>
    {B.map((b) => { const k = clamp((t - b.start) / Math.max(0.1, b.end - b.start));
      return <div key={b.key} style={{width: sw, height: 5, borderRadius: 3, background: "rgba(244,236,221,0.22)", overflow: "hidden"}}>
        <div style={{width: `${k * 100}%`, height: "100%", background: PC.amber, boxShadow: `0 0 8px ${PC.amber}`}}/></div>; })}
  </div>;
};

// ---------- drifting light motes ----------
export const Motes: React.FC<{t: number}> = ({t}) => <svg width={1080} height={1920} style={{position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen"}}>
  <defs><radialGradient id="mote"><stop offset="0%" stopColor="#FFE2A8" stopOpacity={0.9}/><stop offset="100%" stopColor="#FFE2A8" stopOpacity={0}/></radialGradient></defs>
  {Array.from({length: 26}).map((_, i) => {
    const sp = 18 + (i % 5) * 9, r = 3 + (i % 4) * 2.5;
    const x = ((i * 397) % 1080) + noise2D("mx" + i, t * 0.15, 0) * 60;
    const y = 1920 - (((i * 613) + t * sp) % 2100) + 90;
    const o = 0.18 + 0.22 * (0.5 + 0.5 * Math.sin(t * 1.3 + i));
    return <circle key={i} cx={x} cy={y} r={r * 3} fill="url(#mote)" opacity={o}/>;
  })}
</svg>;

// ---------- locator globe inset (top-right) whenever the camera is zoomed in ----------
type Geo = {countries: Record<string, number[][][]>};
const FEAT = new WeakMap<object, {iso: string; f: any}[]>();
const feats = (G: Geo) => {   // d3 wants clockwise outer rings: flip any ring that comes out inside-out (same fix as src/brand/Brand.tsx)
  let v = FEAT.get(G); if (v) return v;
  v = Object.entries(G.countries).map(([iso, rings]) => ({iso, f: {type: "MultiPolygon", coordinates: rings.map((r) => {
    const ring = r.map(([a, b]) => [a, b]); return [geoArea({type: "Polygon", coordinates: [ring]} as any) > 2 * Math.PI ? ring.reverse() : ring]; })}}));
  FEAT.set(G, v); return v;
};
export const Locator: React.FC<{c: Cam; G: Geo; t: number}> = ({c, G, t}) => {
  const o = clamp((24 - c.span) / 8); if (o <= 0) return null;
  const R = 70, cx = 972, cy = 610;   // below the headline zone (y 200-520), above YouTube's right-hand buttons (y > 900)
  const proj = geoOrthographic().rotate([-c.lon + t * 0.6, -c.lat * 0.85]).scale(R).translate([cx, cy]).clipAngle(90);
  const path = geoPath(proj);
  const [px, py] = (proj([c.lon, c.lat]) as [number, number]) ?? [cx, cy];
  const pulse = (t % 1.4) / 1.4;
  return <svg width={1080} height={1920} style={{position: "absolute", inset: 0, opacity: o, pointerEvents: "none"}}>
    <defs><radialGradient id="lg" cx="38%" cy="32%" r="75%"><stop offset="0%" stopColor="#1d4f75"/><stop offset="100%" stopColor="#071a2b"/></radialGradient></defs>
    <circle cx={cx} cy={cy} r={R + 10} fill="rgba(11,15,23,0.55)" stroke="rgba(244,236,221,0.25)" strokeWidth={2}/>
    <circle cx={cx} cy={cy} r={R} fill="url(#lg)"/>
    {feats(G).map(({iso, f}) => <path key={iso} d={path(f) ?? ""}
      fill={iso === "IND" ? "rgba(244,236,221,0.85)" : "rgba(120,170,140,0.55)"} stroke="none"/>)}
    <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2}/>
    <circle cx={px} cy={py} r={6 + 18 * pulse} fill="none" stroke={PC.amber} strokeWidth={3} opacity={1 - pulse}/>
    <circle cx={px} cy={py} r={6} fill={PC.amber} stroke="#fff" strokeWidth={2}/>
  </svg>;
};

// ---------- animated line icons (24-unit grid, stroke only) ----------
const circ = (x: number, y: number, r: number) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
export const ICONS: Record<string, string> = {
  ship: "M2 18h20l-3 4H5z M5 18v-7h14v7 M8 11V7h8v4 M12 7V3",
  dhow: "M3 18h18l-3 3H6z M12 3v15 M12 3l7 13h-7 M12 5L6 15h6",
  plane: "M2 13l9-2 4-8 2 1-2 7 6 1 1 2-7 1-1 7-2 1-1-7-9-1z",
  rocket: "M12 2c3 2 5 6 5 10l-2 4H9l-2-4c0-4 2-8 5-10z M9 16l-2 4 3-1 M15 16l2 4-3-1 M10 18c0 2 1 3 2 4 1-1 2-2 2-4 " + circ(12, 9, 1.6),
  drop: "M12 2C9 7 6 10 6 14a6 6 0 0 0 12 0c0-4-3-7-6-12z",
  rig: "M8 22l4-20 4 20 M9.5 15h5 M10.5 10h3 M6 22h12 M11 6h2",
  coin: circ(12, 12, 9) + " M12 7v10 M14.5 9.5h-4a1.5 1.5 0 0 0 0 3h3a1.5 1.5 0 0 1 0 3h-4",
  scroll: "M6 3h11a2 2 0 0 1 2 2v12 M6 3a2 2 0 0 0-2 2v2h4 M8 5v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-2h-9v2a2 2 0 0 1-2 2 M11 8h5 M11 11h5",
  bird: "M2 16c4 0 6-2 8-6 2-4 5-6 9-6l3 2-3 2c0 6-4 10-10 10H4z M16 6h.01",
  croc: "M2 14h14l6-2-6-2H9c-3 0-5 1-7 4z M5 14v2 M10 14v2 M14 14v2 M18 11h.01",
  palm: "M12 22v-9 M12 13c-1-4-5-6-9-5 3 1 5 3 6 5 M12 13c1-4 5-6 9-5-3 1-5 3-6 5 M12 13c-2-3-1-7 2-9-1 3-1 6-2 9",
  mountain: "M2 20l7-12 4 6 3-4 6 10z M8 10l1.5 2 1-1",
  volcano: "M3 21l6-11h6l6 11z M9 10l1-2h4l1 2 M12 2v3 M9 3l1 2 M15 3l-1 2",
  waves: "M2 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0 M2 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0 M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0",
  compass: circ(12, 12, 9) + " M15.5 8.5l-2 5-5 2 2-5z",
  anchor: circ(12, 5, 2) + " M12 7v14 M5 12H3a9 9 0 0 0 18 0h-2 M9 10h6",
  train: "M6 3h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M4 10h16 M8 21l2-4 M16 21l-2-4 M8 14h.01 M16 14h.01",
  bridge: "M2 18h20 M4 18V9 M20 18V9 M2 9c4 5 16 5 20 0 M8 12v6 M12 13v5 M16 12v6",
  shirt: "M8 3L3 6l2 5 3-1v11h8V10l3 1 2-5-5-3c0 2-2 3-4 3S8 5 8 3z",
  rice: "M12 22V8 M12 8c-2-1-3-3-3-5 2 1 3 3 3 5z M12 8c2-1 3-3 3-5-2 1-3 3-3 5z M12 13c-2-1-4-2-4-5 2 1 4 2 4 5z M12 13c2-1 4-2 4-5-2 1-4 2-4 5z M12 18c-2-1-4-2-4-5 2 1 4 2 4 5z M12 18c2-1 4-2 4-5-2 1-4 2-4 5z",
  door: "M6 21V5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v16 M3 21h18 M14 12h.01 M9 6h6 M9 9h6",
  pepper: circ(8, 9, 2.2) + " " + circ(14, 7, 2.2) + " " + circ(11, 14, 2.2) + " " + circ(17, 13, 2.2) + " " + circ(7, 17, 2.2) + " M4 21c4-1 8-1 16 0",
  crown: "M3 18h18 M3 18l-1-11 5 4 5-7 5 7 5-4-1 11",
  shield: "M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z M9 12l2 2 4-4",
  beads: circ(12, 11, 7) + " M12 18v4 M10 22h4",
  lighthouse: "M10 22l1-14h2l1 14z M9 8h6 M10 8V6l2-2 2 2v2 M7 22h10 M15 5l4-2 M15 7l4 1 M9 5L5 3 M9 7l-4 1",
  fish: "M2 12c3-4 7-6 12-6 3 0 6 2 8 6-2 4-5 6-8 6-5 0-9-2-12-6z M18 11h.01 M2 8l3 4-3 4",
  factory: "M2 21V10l6 4v-4l6 4V6h4v15z M2 21h20 M6 17h2 M11 17h2 M16 17h2",
  house: "M3 11l9-8 9 8 M5 9v12h14V9 M10 21v-6h4v6",
  envelope: "M3 5h18v14H3z M3 5l9 8 9-8",
  clock: circ(12, 12, 9) + " M12 7v5l3 2",
  globe: circ(12, 12, 9) + " M3 12h18 M12 3c3 3 4 6 4 9s-1 6-4 9c-3-3-4-6-4-9s1-6 4-9z",
  people: circ(9, 8, 3) + " " + circ(16, 9, 2.5) + " M3 21c0-3 3-5 6-5s6 2 6 5 M15 16c3 0 6 2 6 5",
  bale: "M3 7l9-4 9 4v10l-9 4-9-4z M3 7l9 4 9-4 M12 11v10",
  island: "M2 18c3-2 6-2 10 0s7 2 10 0 M7 18c0-3 2-5 5-5s5 2 5 5 M12 13V6 M12 6c-2-1-4-1-6 1 M12 6c2-1 4-1 6 1",
  fort: "M3 21V9h3V6h3v3h6V6h3v3h3v12z M3 21h18 M10 21v-5h4v5 M3 12h18",
  telescope: "M3 14l14-6 2 4-14 6z M10 16l-3 6 M12 15l3 7 M17 8l2-1 2 4-2 1",
  boot: "M5 3h6v10l7 3c2 1 3 2 3 4v1H5z M5 17h16",
};

export const PIcon: React.FC<{x: number; y: number; o: number; age: number; name: string; size?: number; color?: string; label?: string; seed?: number}> =
  ({x, y, o, age, name, size = 120, color, label, seed = 0}) => {
  if (o <= 0) return null;
  const c = color ?? PC.amber; const d = ICONS[name] ?? ICONS.compass;
  const draw = easeOut(age / 0.9), pop = easeOut(age / 0.35);
  const bob = noise2D("ib" + seed, age * 0.5, 0) * 8, rot = noise2D("ir" + seed, 0, age * 0.4) * 4;
  const R = size * 0.62;
  return <div style={{position: "absolute", left: x, top: y + bob, transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * pop}) rotate(${rot}deg)`, opacity: o * pop, textAlign: "center"}}>
    <svg width={R * 2 + 20} height={R * 2 + 20} viewBox={`${-R - 10} ${-R - 10} ${R * 2 + 20} ${R * 2 + 20}`} style={{overflow: "visible", display: "block", margin: "0 auto"}}>
      <circle r={R} fill="rgba(11,15,23,0.72)" stroke="rgba(244,236,221,0.15)" strokeWidth={2}/>
      <circle r={R} fill="none" stroke={c} strokeWidth={4} pathLength={1} strokeDasharray={`${draw} 1`} transform="rotate(-90)" strokeLinecap="round"/>
      <g transform={`translate(${-size * 0.36},${-size * 0.36}) scale(${size * 0.72 / 24})`}>
        <path d={d} fill="none" stroke={PC.cream} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${draw} 1`}/>
      </g>
    </svg>
    {label && <div style={{marginTop: 8, fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: "0.14em", color: PC.cream, textTransform: "uppercase",
      textShadow: "0 2px 10px rgba(0,0,0,0.9)", opacity: easeOut((age - 0.4) / 0.4), whiteSpace: "nowrap"}}>{label}</div>}
  </div>;
};
