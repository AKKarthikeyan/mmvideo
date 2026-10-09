// Data Kadai daily chart post: a still built from the same data as the day's Short.
// Instagram 1080x1350 (4:5) and X 1600x900 (16:9). Coloured map + answer + top 5 + India + source + brand.
import React from "react";
import {AbsoluteFill, Still} from "remotion";
import {COND, VoxFonts} from "../voxkit";
import geo from "../../public/datayt/india/geo.json";
import {P, ShortData} from "./IndiaShort";
import {Mark} from "./Brand";
import {SHORTS} from "./shortsData";

const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
type G = {name: string; d: string};
const STATES = geo.states as G[];
const fmt = (v: number, unit: string) => `${v.toFixed(1)}${unit}`;
const plain = (l: string) => l.replace(/\*/g, "");

const MapStill: React.FC<{D: ShortData; w: number}> = ({D, w}) => (
  <svg width={w} height={w * geo.h / geo.w} viewBox={`0 0 ${geo.w} ${geo.h}`}>
    {STATES.map((g) => {
      const v = D.values[g.name];
      const isA = g.name === D.answer;
      return <path key={g.name} d={g.d} fillRule="evenodd" fill={isA ? (D.accent ?? P.gold) : v === undefined ? P.empty : D.bands[D.band[g.name]]}
        stroke={isA ? P.ink : P.line} strokeWidth={isA ? 4 : 1} strokeLinejoin="round"/>;
    })}
  </svg>
);

const Bars: React.FC<{D: ShortData; size: number}> = ({D, size}) => {
  const rows = [...D.top.map((x, i) => ({...x, rank: `${i + 1}`})), {name: "India", key: "India", v: D.india, rank: "—"}];
  const max = Math.max(...rows.map((r) => r.v)) / 0.62;
  return <div>
    {rows.map((r) => {
      const isA = r.key === D.answer, isI = r.key === "India";
      return <div key={r.key} style={{display: "flex", alignItems: "center", gap: 12, height: size * 1.9}}>
        <div style={{width: size * 1.2, fontFamily: COND, fontWeight: 700, fontSize: size, color: isA ? (D.accent ?? P.gold) : P.mute}}>{r.rank}</div>
        <div style={{width: size * 8.5, fontFamily: SANS, fontWeight: 700, fontSize: size * 0.82, color: isA ? (D.accent ?? P.gold) : P.ink}}>{r.name}</div>
        <div style={{flex: 1, position: "relative", height: size * 1.3}}>
          <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${(r.v / max) * 100}%`, borderRadius: 8,
            background: isA ? (D.accent ?? P.gold) : isI ? P.line : D.bands[3]}}/>
          <div style={{position: "absolute", left: `calc(${(r.v / max) * 100}% + 10px)`, top: "50%", transform: "translateY(-50%)",
            fontFamily: COND, fontWeight: 700, fontSize: size, color: isA ? (D.accent ?? P.gold) : P.ink}}>{fmt(r.v, D.unit)}</div>
        </div>
      </div>;
    })}
  </div>;
};

const Footer: React.FC<{D: ShortData; size: number}> = ({D, size}) => (
  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
    <div style={{fontFamily: SANS, fontSize: size, color: P.mute}}>Source: {D.source}</div>
    <div style={{display: "flex", alignItems: "center", gap: 10}}>
      <Mark size={size * 2.4}/>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: size * 1.5, color: P.ink}}>DATA <span style={{color: P.gold}}>KADAI</span></div>
    </div>
  </div>
);

const Head: React.FC<{D: ShortData; size: number}> = ({D, size}) => (
  <div>
    <div style={{display: "flex", gap: 12, alignItems: "center", marginBottom: size * 0.5}}>
      <div style={{background: (D.accent2 ?? P.cyan), color: P.bg, fontFamily: SANS, fontWeight: 800, fontSize: size * 0.45, letterSpacing: 3,
        padding: "6px 14px", borderRadius: 8}}>{D.series.toUpperCase()}</div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: size * 0.45, color: P.mute}}>NFHS-6 · 2023-24</div>
    </div>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: size, lineHeight: 1.05, color: P.ink}}>
      {plain(D.hook.join(" "))} <span style={{color: (D.accent ?? P.gold)}}>It's {D.answerName}.</span></div>
    <div style={{fontFamily: SANS, fontSize: size * 0.46, color: P.mute, marginTop: size * 0.3}}>
      {D.label}: <b style={{color: (D.accent ?? P.gold)}}>{fmt(D.value, D.unit)}</b> vs India {fmt(D.india, D.unit)}</div>
  </div>
);

export const PostIG: React.FC<{D: ShortData}> = ({D}) => (
  <AbsoluteFill style={{background: P.bg, padding: 64, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
    <VoxFonts/>
    <Head D={D} size={64}/>
    <div style={{display: "flex", gap: 24, alignItems: "center"}}>
      <MapStill D={D} w={500}/>
      <div style={{flex: 1}}><Bars D={D} size={30}/></div>
    </div>
    <Footer D={D} size={22}/>
  </AbsoluteFill>
);

export const PostX: React.FC<{D: ShortData}> = ({D}) => (
  <AbsoluteFill style={{background: P.bg, padding: 56, display: "flex", flexDirection: "row", gap: 48}}>
    <VoxFonts/>
    <MapStill D={D} w={700}/>
    <div style={{flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
      <Head D={D} size={60}/>
      <Bars D={D} size={30}/>
      <Footer D={D} size={20}/>
    </div>
  </AbsoluteFill>
);

export const PosterStills: React.FC = () => <>
  {SHORTS.map((d) => <React.Fragment key={d.id}>
    <Still {...({id: `DK-post-${d.id}-ig`, component: PostIG, defaultProps: {D: d}, width: 1080, height: 1350} as any)}/>
    <Still {...({id: `DK-post-${d.id}-x`, component: PostX, defaultProps: {D: d}, width: 1600, height: 900} as any)}/>
  </React.Fragment>)}
</>;
