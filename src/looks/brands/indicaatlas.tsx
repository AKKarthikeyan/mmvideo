// Indica Atlas brand for the looks (Indica Atlas geography Shorts, code in /Volumes/DarwinSSD/MMVideo, src/geo).
// Palette from MMVideo/src/brand/Brand.tsx B = {deep #06202C, teal #0C3D52, sea #11597A, land #2E9E78, india #3DBE8C,
// amber #FFB020, cyan #3DD9FF, cream #F7F1E3}. The globe mark and the stacked INDICA / ATLAS wordmark are reproduced
// here, not imported across repos: the globe's coastlines were projected once by scripts/looks/bake_indica_globe.mjs into
// indicaatlas-globe.json (Natural Earth 10m, India point of view), so this repo needs neither d3-geo nor world.json.
import React from "react";
import globe from "./indicaatlas-globe.json";
import tokens from "./indicaatlas.tokens.json";
import type {Brand, BrandTokens, MarkProps, WordmarkProps} from "./types";

const T = tokens as unknown as BrandTokens;
const B = {deep: "#06202C", teal: "#0C3D52", sea: "#11597A", land: "#2E9E78", amber: "#FFB020", cream: "#F7F1E3"};
const G = globe as {S: number; R: number; cx: number; cy: number; graticule: string; land: {d: string; india: boolean}[]; wind: number[][]; rain: number[][]};
const fam = (role: keyof BrandTokens["fonts"]) => `'${T.faces[T.fonts[role].face].family}', ${T.fonts[role].fallback}`;

let uid = 0;
// The India-facing globe, south-west monsoon arrow and rain, drawn in a fixed 800-unit box and scaled by the viewBox.
const Mark: React.FC<MarkProps> = ({size}) => {
  const [id] = React.useState(() => `ia${++uid}`);
  const {S, R, cx, cy} = G, k = S / 800;
  const pts = G.wind as [number, number][];
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {      // Catmull-Rom to cubic Bezier, as in the original
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6}, ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6}, ${p2[0]} ${p2[1]}`;
  }
  const [ex, ey] = pts[pts.length - 1], [px, py] = pts[pts.length - 2];
  const ang = Math.atan2(ey - py, ex - px), ah = 42 * k;
  const head = `${ex + ah * Math.cos(ang)},${ey + ah * Math.sin(ang)} ${ex + ah * 0.9 * Math.cos(ang + 2.4)},${ey + ah * 0.9 * Math.sin(ang + 2.4)} ${ex + ah * 0.9 * Math.cos(ang - 2.4)},${ey + ah * 0.9 * Math.sin(ang - 2.4)}`;
  return <svg width={size} height={size} viewBox={`0 0 ${S} ${S}`} style={{display: "block", flexShrink: 0}}>
    <defs>
      <radialGradient id={`${id}bg`} cx="50%" cy="45%" r="60%"><stop offset="0%" stopColor={B.teal}/><stop offset="100%" stopColor={B.deep}/></radialGradient>
      <radialGradient id={`${id}sea`} cx="40%" cy="35%" r="75%"><stop offset="0%" stopColor="#1A7BA3"/><stop offset="100%" stopColor="#0B3A52"/></radialGradient>
      <linearGradient id={`${id}arr`} x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#FF8A00"/><stop offset="100%" stopColor={B.amber}/></linearGradient>
      <clipPath id={`${id}disc`}><circle cx={cx} cy={cy} r={R}/></clipPath>
    </defs>
    <circle cx={S / 2} cy={S / 2} r={S / 2} fill={`url(#${id}bg)`}/>
    <circle cx={S / 2} cy={S / 2} r={S / 2 - 10 * k} fill="none" stroke={B.amber} strokeOpacity={0.55} strokeWidth={6 * k}/>
    <circle cx={cx} cy={cy} r={R} fill={`url(#${id}sea)`}/>
    <g clipPath={`url(#${id}disc)`}>
      <path d={G.graticule} fill="none" stroke="#fff" strokeOpacity={0.12} strokeWidth={1.4 * k}/>
      {G.land.map((f, i) => <path key={i} d={f.d} fill={f.india ? B.cream : B.land} stroke={f.india ? "#fff" : "none"} strokeWidth={2.4 * k}/>)}
      <circle cx={cx - R * 0.35} cy={cy - R * 0.4} r={R * 1.1} fill="#fff" opacity={0.05}/>
      {G.rain.map(([x, y], i) => <line key={i} x1={x + 9 * k} y1={y - 24 * k} x2={x - 4 * k} y2={y + 8 * k} stroke="#1FA4D8" strokeWidth={8 * k} strokeLinecap="round"/>)}
    </g>
    <circle cx={cx} cy={cy} r={R} fill="none" stroke={B.cream} strokeOpacity={0.85} strokeWidth={4 * k}/>
    <path d={d} fill="none" stroke={B.deep} strokeWidth={50 * k} strokeLinecap="round" opacity={0.55}/>
    <path d={d} fill="none" stroke={`url(#${id}arr)`} strokeWidth={34 * k} strokeLinecap="round"/>
    <path d={d} fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth={6 * k} strokeLinecap="round" strokeDasharray={`${36 * k} ${54 * k}`}/>
    <polygon points={head} fill={B.amber} stroke={B.deep} strokeWidth={4 * k} strokeLinejoin="round"/>
  </svg>;
};

// The stacked lock-up of the original (INDICA over a tracked-out ATLAS), sized by its total height. On paper ATLAS is
// sea, because amber on cream fails contrast.
const Wordmark: React.FC<WordmarkProps> = ({size, on = "dark"}) => (
  <div style={{fontFamily: fam("wordmark"), fontWeight: T.fonts.wordmark.weight, lineHeight: 0.92, color: on === "dark" ? T.palette.paper : T.palette.ink, whiteSpace: "nowrap"}}>
    <div style={{fontSize: size * 0.58, letterSpacing: size * 0.035}}>{T.wordmark.parts[0]}</div>
    <div style={{fontSize: size * 0.42, letterSpacing: size * 0.198, color: on === "dark" ? T.palette.accent2 : T.palette.muted, marginLeft: size * 0.01}}>{T.wordmark.parts[1]}</div>
  </div>
);

export const INDICAATLAS: Brand = {...T, Mark, Wordmark};
