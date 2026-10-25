// Official India choropleth. Geometry comes only from public/datakadai/geo/india.json (scripts/datakadai/build_geo.py
// checks the Government of India boundary before writing it); the country base is drawn first, so the full official
// outline is always visible even while states are still filling in.
import React from "react";
import geo from "../../public/datakadai/geo/india.json";
import {K, COND, SANS} from "./kit";

export type Geo = {w: number; h: number; outline: string; states: {id: string; name: string; short: string; d: string; cx: number; cy: number; area: number}[]};
export const GEO = geo as unknown as Geo;
export const STATE = Object.fromEntries(GEO.states.map((s) => [s.id, s]));

type Props = {
  x: number; y: number; w: number;
  fills: Record<string, string>;
  reveal?: (id: string) => number;      // 0..1 fill strength per state
  dim?: (id: string) => boolean;        // fade states that are not the point of the scene
  focus?: string[]; focusColor?: string; pulse?: number;
  draw?: number;                        // 0..1 outline draw-on (hook scene)
};

export const IndiaMap: React.FC<Props> = ({x, y, w, fills, reveal = () => 1, dim = () => false, focus = [], focusColor = K.ink, pulse = 0, draw = 1}) => {
  const k = w / GEO.w; const h = GEO.h * k;
  const sw = (px: number) => px / k;  // stroke widths in screen pixels
  return (
    <svg style={{position: "absolute", left: x, top: y}} width={w} height={h} viewBox={`0 0 ${GEO.w} ${GEO.h}`}>
      <path d={GEO.outline} fill={K.base} opacity={draw}/>
      {GEO.states.map((s) => (
        <path key={s.id} d={s.d} fill={fills[s.id] ?? K.base} fillOpacity={reveal(s.id) * (dim(s.id) ? 0.28 : 1)}
          stroke={K.white} strokeWidth={sw(1.1)} strokeOpacity={draw} strokeLinejoin="round"/>
      ))}
      {focus.map((id) => STATE[id] && (
        <path key={id} d={STATE[id].d} fill="none" stroke={focusColor} strokeWidth={sw(3 + 2 * pulse)} strokeLinejoin="round"/>
      ))}
      <path d={GEO.outline} fill="none" stroke={K.ink} strokeWidth={sw(1.8)} strokeLinejoin="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw}/>
    </svg>
  );
};

// Pin + label tag on a state's anchor, in the same coordinate frame as an IndiaMap at (x, y, w).
export const Pin: React.FC<{id: string; x: number; y: number; w: number; label: string; s: number; color?: string; side?: "left" | "right"; size?: number}> =
  ({id, x, y, w, label, s, color = K.brick, side = "right", size = 1}) => {
  const st = STATE[id]; if (!st || s <= 0) return null;
  const k = w / GEO.w; const px = x + st.cx * k; const py = y + st.cy * k;
  return (
    <>
      <div style={{position: "absolute", left: px - 11 * size, top: py - 11 * size - (1 - s) * 40, width: 22 * size, height: 22 * size,
        borderRadius: "50%", background: color, border: `4px solid ${K.white}`, boxShadow: "0 3px 8px rgba(0,0,0,0.3)", opacity: s}}/>
      <div style={{position: "absolute", top: py - 24 * size, left: side === "right" ? px + 20 * size : undefined,
        right: side === "left" ? `calc(100% - ${px - 20 * size}px)` : undefined, opacity: s, whiteSpace: "nowrap",
        background: K.ink, color: K.white, fontFamily: COND, fontWeight: 700, fontSize: 30 * size, padding: `${2 * size}px ${12 * size}px`, borderRadius: 6}}>
        {label}
      </div>
    </>
  );
};

export const Legend: React.FC<{bins: {color: string; label: string}[]; unit: string; x: number; y: number; size?: number; opacity?: number}> =
  ({bins, unit, x, y, size = 1, opacity = 1}) => (
  <div style={{position: "absolute", left: x, top: y, opacity, fontFamily: SANS, color: K.ink}}>
    <div style={{fontSize: 20 * size, fontWeight: 700, color: K.soft, marginBottom: 6 * size, textTransform: "uppercase", letterSpacing: 1}}>{unit}</div>
    <div style={{display: "flex", gap: 4 * size}}>
      {bins.map((b, i) => (
        <div key={i} style={{textAlign: "center"}}>
          <div style={{width: 92 * size, height: 22 * size, background: b.color, borderRadius: 3}}/>
          <div style={{fontSize: 20 * size, fontWeight: 700, marginTop: 4 * size}}>{b.label}</div>
        </div>
      ))}
    </div>
  </div>
);
