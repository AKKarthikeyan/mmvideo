// GEO-04 Part 1, builder V3: `plates-map` (s030 ring, s032 hawaii). The Pacific-centred world map from public/datayt/long/upsc/geo04_worldmap.json
// (Natural Earth, India's official view; made by scripts/upsc/geo04_worldmap.py). India is whole. No plate boundaries are drawn. The Ring of Fire
// band is schematic (the scene's chip says ILLUSTRATION). Only named volcanoes at their real positions are marked.
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, rng} from "../kit";
import type {AP, Pt} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {V3Defs, seg, prog} from "./analogy_v3_kit";
import world from "../../../../public/datayt/long/upsc/geo04_worldmap.json";

const MW = world as unknown as {w: number; h: number; lon0: number; lat1: number; k: number; land: string; india: string};
const OX = (W - MW.w) / 2, OY = 188;
const X = (lon: number) => OX + ((lon < MW.lon0 ? lon + 360 : lon) - MW.lon0) * MW.k;
const Y = (lat: number) => OY + (MW.lat1 - lat) * MW.k;
const pt = (lon: number, lat: number): Pt => [X(lon), Y(lat)];

// the schematic band along the Pacific rim, south of New Zealand round to the Andes (lon, lat; east longitudes continue past 180)
const RIM: [number, number][] = [[171, -45], [176, -38], [183, -30], [184, -21], [168, -16], [158, -8], [147, -6], [131, 1], [124, 8], [122, 15], [121, 23], [130, 31], [138, 36], [142, 41], [150, 46], [157, 51], [161, 56], [170, 55], [185, 52], [196, 54], [210, 60], [221, 59], [236, 48], [239, 41], [241, 35], [255, 19], [270, 14], [277, 9], [282, 0], [285, -12], [290, -24], [288, -40], [287, -52]];
const sample = (pts: Pt[], n = 8): Pt[] => {
  const P = [pts[0], ...pts, pts[pts.length - 1]], out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [P[i], P[i + 1], P[i + 2], P[i + 3]];
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};
const RIM_D = sample(RIM.map(([lo, la]) => pt(lo, la))).map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");

const VOLC: {n: string; lon: number; lat: number; dx: number; dy: number; an: "start" | "middle" | "end"}[] = [
  {n: "Mauna Loa", lon: -155.6, lat: 19.5, dx: 0, dy: 36, an: "middle"},
  {n: "Fuji", lon: 138.73, lat: 35.36, dx: -16, dy: 8, an: "end"},
  {n: "St Helens", lon: -122.18, lat: 46.2, dx: -16, dy: 8, an: "end"},
  {n: "Pinatubo", lon: 120.35, lat: 15.13, dx: -16, dy: 8, an: "end"},
  {n: "Parícutin", lon: -102.25, lat: 19.49, dx: 0, dy: 36, an: "middle"},
];

const Marker: React.FC<{x: number; y: number; a: number; f: number; r?: number}> = ({x, y, a, f, r = 1}) => (
  <g opacity={a} transform={`translate(${x} ${y}) scale(${r})`}>
    <circle r={22} fill="url(#v3-glow)" opacity={0.7 + 0.2 * Math.sin(f / 6)}/>
    <path d="M0,-13 L10,6 L-10,6 Z" fill="#d8381a" stroke="#fff6e0" strokeWidth={2.4} strokeLinejoin="round"/>
    <circle cx={0} cy={-15} r={3.2} fill="#ffd36a"/>
  </g>
);

const Base = React.memo(() => {
  const waves = (() => { const r = rng(11), out: React.ReactNode[] = []; for (let i = 0; i < 150; i++) { const x = OX + 30 + r() * (MW.w - 60), y = OY + 20 + r() * (MW.h - 40); out.push(<path key={i} d={`M${x.toFixed(0)},${y.toFixed(0)} q9,-5 18,0 t18,0`} fill="none" stroke="#fff" strokeWidth={1.6} opacity={0.22}/>); } return out; })();
  const lons = [-15 + 15, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330], lats = [60, 30, 0, -30];
  return (
    <g>
      <defs>
        <linearGradient id="v3m-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a8cfe0"/><stop offset="0.5" stopColor="#6fa7c9"/><stop offset="1" stopColor="#4d86b0"/></linearGradient>
        <radialGradient id="v3m-vig" cx="50%" cy="50%" r="70%"><stop offset="0.6" stopColor="#12304a" stopOpacity="0"/><stop offset="1" stopColor="#12304a" stopOpacity="0.28"/></radialGradient>
        <linearGradient id="v3m-land2" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={MW.h}><stop offset="0" stopColor="#efe8da"/><stop offset="0.22" stopColor="#d8d49c"/><stop offset="0.5" stopColor="#a9c481"/><stop offset="0.66" stopColor="#b9c488"/><stop offset="0.85" stopColor="#dccf9c"/><stop offset="1" stopColor="#efe7d3"/></linearGradient>
        <linearGradient id="v3m-india" gradientUnits="userSpaceOnUse" x1="0" y1={Y(37) - OY} x2="0" y2={Y(6) - OY}><stop offset="0" stopColor="#efdcaa"/><stop offset="1" stopColor="#d9b56a"/></linearGradient>
        <clipPath id="v3m-clip"><rect x={OX} y={OY} width={MW.w} height={MW.h} rx={26}/></clipPath>
      </defs>
      <rect x={OX} y={OY} width={MW.w} height={MW.h} rx={26} fill="url(#v3m-sea)"/>
      <g clipPath="url(#v3m-clip)">
        {waves}
        {lons.map((lo) => <line key={lo} x1={X(lo)} y1={OY} x2={X(lo)} y2={OY + MW.h} stroke="#fff" strokeWidth={1.2} opacity={0.28}/>)}
        {lats.map((la) => <line key={la} x1={OX} y1={Y(la)} x2={OX + MW.w} y2={Y(la)} stroke="#fff" strokeWidth={la === 0 ? 2.2 : 1.2} opacity={la === 0 ? 0.45 : 0.28}/>)}
        {[23.4, -23.4].map((la) => <line key={la} x1={OX} y1={Y(la)} x2={OX + MW.w} y2={Y(la)} stroke="#fff" strokeWidth={1.2} opacity={0.3} strokeDasharray="10 10"/>)}
        <g transform={`translate(${OX} ${OY})`}>
          <path d={MW.land + MW.india} transform="translate(3 5)" fill="#10304c" opacity={0.28} stroke="#10304c" strokeWidth={4}/>
          <path d={MW.land} fill="url(#v3m-land2)" stroke="#8a7550" strokeWidth={0.9} strokeLinejoin="round"/>
          <path d={MW.land} fill="url(#v3-dots)" opacity={0.6}/>
          <path d={MW.india} fill="url(#v3m-india)" stroke="#8a6228" strokeWidth={1.2} strokeLinejoin="round"/>
        </g>
        <rect x={OX} y={OY} width={MW.w} height={MW.h} fill="url(#v3m-vig)"/>
      </g>
      <rect x={OX} y={OY} width={MW.w} height={MW.h} rx={26} fill="none" stroke="#4a3320" strokeWidth={5}/>
    </g>
  );
});

const RingBand: React.FC<{p: number; f: number}> = ({p, f}) => {
  if (p <= 0.003) return null;
  const common = {d: RIM_D, fill: "none", pathLength: 1, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeDasharray: `${p} 2`};
  return (
    <g>
      <path {...common} stroke="#ff5a1a" strokeWidth={46} opacity={0.4 + 0.08 * Math.sin(f / 9)} filter="url(#v3-b14)"/>
      <path {...common} stroke="#ff7a22" strokeWidth={17} opacity={0.92}/>
      <path {...common} stroke="#ffd36a" strokeWidth={6.5}/>
      <path d={RIM_D} fill="none" stroke="#fffbe6" strokeWidth={3} strokeLinecap="round" strokeDasharray="1 26" strokeDashoffset={-f * 1.4} opacity={0.9 * clamp(p * 4)} pathLength={undefined as any}/>
    </g>
  );
};

export const PlatesMapArt: React.FC<AP> = ({f, dur, spec, at}) => {
  const hawaii = (spec as any).mode === "hawaii";
  const ring = hawaii ? 1 : eo(prog(f, at("mh") - 40, 260));
  const mk = hawaii ? 0 : seg(f, at("mh") + 60, 24);
  const hw = pt(-155.5, 19.6), rim = pt(-166, 53.5);
  const th = hawaii ? at("hw") : 1e9, drop = eo(prog(f, th - 46, 40)), land = prog(f, th - 8, 18), bounce = Math.sin(land * Math.PI) * 14 * (1 - land) * (land > 0 ? 1 : 0);
  const qy = hw[1] - 56 - (1 - drop) * 340 - bounce, qa = clamp(prog(f, th - 46, 10));
  const lineP = eo(prog(f, th + 14, 50)), lx = lerp2(hw[0], rim[0], lineP), ly = lerp2(hw[1], rim[1], lineP);
  return (
    <g>
      <V3Defs/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#EDE3CC"/>
      <Base/>
      <RingBand p={ring} f={f}/>
      {/* named volcanoes only */}
      {!hawaii && VOLC.map((v, i) => { const [x, y] = pt(v.lon, v.lat); return (
        <g key={i}>
          <Marker x={x} y={y} a={mk} f={f}/>
          <text x={x + v.dx} y={y + v.dy} textAnchor={v.an} fontFamily={SANS} fontWeight={700} fontSize={24} fill="#fffaf0" opacity={mk}
            style={{paintOrder: "stroke", stroke: "rgba(30,16,6,.7)", strokeWidth: 5, strokeLinejoin: "round"}}>{v.n}</text>
        </g>); })}
      {hawaii && (
        <g>
          <Marker x={hw[0]} y={hw[1]} a={1} f={f} r={1.1}/>
          <circle cx={rim[0]} cy={rim[1]} r={9} fill="#fffaf0" stroke="#7a2412" strokeWidth={3} opacity={lineP}/>
          {lineP > 0.01 && (
            <g>
              <line x1={hw[0]} y1={hw[1] - 6} x2={lx} y2={ly} stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.6}/>
              <line x1={hw[0]} y1={hw[1] - 6} x2={lx} y2={ly} stroke="#3a1608" strokeWidth={4.5} strokeLinecap="round" strokeDasharray="14 11" strokeDashoffset={-f * 0.8}/>
            </g>
          )}
          <g opacity={qa} transform={`translate(${hw[0]} ${qy})`}>
            <ellipse cx={0} cy={56 + bounce} rx={26 * (1 - (1 - drop) * 0.5)} ry={7} fill="#10304c" opacity={0.3 * drop} transform={`translate(0 ${bounce - 0})`}/>
            <path d="M0,50 L-15,18 A36,36 0 1 1 15,18 Z" fill="#c4361c" stroke="#fff6e0" strokeWidth={4} strokeLinejoin="round" style={{filter: "drop-shadow(0 8px 6px rgba(40,22,8,.4))"}}/>
            <text x={0} y={14} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={50} fill="#fff6e0">?</text>
          </g>
        </g>
      )}
    </g>
  );
};
const lerp2 = (a: number, b: number, t: number) => a + (b - a) * t;

export const PlatesMapLabels: React.FC<AP> = (p) => {
  const L = rlabs(p), hawaii = (p.spec as any).mode === "hawaii";
  if (hawaii) return <>{L[0] && <P2Card cx={900} y={62} text={L[0].text} f={p.f} at={L[0].at} size={38} maxW={1200} upper={false}/>}</>;
  return (
    <>
      {L[0] && <P2Card cx={820} y={62} text={L[0].text} f={p.f} at={L[0].at} size={36} maxW={1200} upper={false} tone="cool"/>}
      {L[2] && <P2Card cx={1290} y={548} text={L[2].text} f={p.f} at={L[2].at} size={56} maxW={560} tone="dark"/>}
      {L[1] && <P2Card cx={1290} y={700} text={L[1].text} f={p.f} at={L[1].at} size={32} maxW={480} upper={false}/>}
    </>
  );
};
void H;
