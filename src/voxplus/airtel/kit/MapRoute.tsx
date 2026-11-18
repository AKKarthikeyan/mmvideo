// MapRoute: a paper map (Natural Earth, public domain) drawn with d3-geo in SVG, with routes that draw themselves,
// pins that drop and sticker labels. Any map that shows India uses Natural Earth's India point-of-view boundaries
// (public/voxplus/map/south_asia_ind.geojson, built by tools/ne_india.py): India's official outline, no other
// worldview. Check every new map by eye before use.
import React, {useEffect, useState} from "react";
import {AbsoluteFill, continueRender, delayRender, random} from "remotion";
import {geoMercator, geoPath} from "d3-geo";
import {C, F, H, V, W, clamp01, ease, inOut, spr} from "./tokens";

type Geo = {type: "FeatureCollection"; features: {type: "Feature"; properties: {a3: string; name: string}; geometry: any}[]};
const cache: Record<string, Geo> = {};

export const useGeo = (file = "map/south_asia_ind.geojson") => {
  const [geo, setGeo] = useState<Geo | null>(cache[file] || null);
  const [handle] = useState(() => (cache[file] ? null : delayRender("geo " + file)));
  useEffect(() => {
    if (cache[file]) return;
    fetch(V(file)).then((r) => r.json()).then((g) => { cache[file] = g; setGeo(g); if (handle != null) continueRender(handle); });
  }, [file, handle]);
  return geo;
};

export type Pin = {lon: number; lat: number; at: number; label?: string; side?: "left" | "right" | "top"; color?: string};
export type Route = {from: [number, number]; to: [number, number]; at: number; dur?: number; bend?: number; color?: string; dashed?: boolean};

/** A projection that fits [lonMin, latMin, lonMax, latMax] into the frame (with margin). */
export const fitProjection = (bbox: [number, number, number, number], margin = 120) => {
  const [x0, y0, x1, y1] = bbox;
  return geoMercator().fitExtent([[margin, margin], [W - margin, H - margin]],
    {type: "MultiPoint", coordinates: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]} as any);
};

/**
 * The map itself, in world px (1920x1080 at camera scale 1). Wrap it in <Layer cam> for fly-ins.
 * `inkAt` draws the focus country's outline (stroke-dashoffset) from that frame.
 */
export const MapRoute: React.FC<{f: number; geo: Geo | null; bbox?: [number, number, number, number]; focus?: string; focusFill?: string;
  pins?: Pin[]; routes?: Route[]; inkAt?: number; pinScale?: number; labelSize?: number; credit?: boolean}> =
  ({f, geo, bbox = [66, 5.5, 99, 37.5], focus = "IND", focusFill = "#F6E7B4", pins = [], routes = [], inkAt = 0, pinScale = 1, labelSize = 38, credit = true}) => {
    if (!geo) return null;
    const proj = fitProjection(bbox);
    const path = geoPath(proj);
    const focusF = geo.features.filter((g) => g.properties.a3 === focus);
    const inkP = ease(f, inkAt, inkAt + 40, inOut);
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{background: C.mapWater}}>
          <AbsoluteFill style={{backgroundImage: `url(${V("tex/paper.jpg")})`, backgroundSize: "1024px", mixBlendMode: "multiply", opacity: 0.9}}/>
        </AbsoluteFill>
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <defs>
            <filter id="mr-shadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#3A2C1A" floodOpacity="0.28"/></filter>
          </defs>
          {/* coastline halo (Vox paper-map feel): a thick pale stroke under all land */}
          <g>{geo.features.map((g, i) => <path key={"h" + i} d={path(g) || ""} fill="none" stroke="#E4E9E6" strokeWidth={14} strokeLinejoin="round" opacity={0.7}/>)}</g>
          <g>{geo.features.filter((g) => g.properties.a3 !== focus).map((g, i) => (
            <path key={i} d={path(g) || ""} fill={C.mapLandOther} stroke="#BDB29C" strokeWidth={1.6} strokeLinejoin="round"/>
          ))}</g>
          <g filter="url(#mr-shadow)">{focusF.map((g, i) => <path key={i} d={path(g) || ""} fill={focusFill} stroke="none"/>)}</g>
          {focusF.map((g, i) => {
            const d = path(g) || "";
            return <path key={"o" + i} d={d} fill="none" stroke={C.inkSoft} strokeWidth={3.2} strokeLinejoin="round" pathLength={1}
              strokeDasharray={1} strokeDashoffset={1 - inkP}/>;
          })}
          {routes.map((r, i) => <RoutePath key={i} f={f} r={r} proj={proj}/>)}
        </svg>
        {pins.map((p, i) => <PinDrop key={i} f={f} pin={p} proj={proj} scale={pinScale} labelSize={labelSize} seed={"pin" + i}/>)}
        {credit ? <div style={{position: "absolute", right: 34, bottom: 26, fontFamily: F.mono, fontSize: 16, color: "rgba(40,30,20,0.55)", letterSpacing: 1}}>
          MAP: NATURAL EARTH (INDIA VIEW)</div> : null}
      </AbsoluteFill>
    );
  };

const RoutePath: React.FC<{f: number; r: Route; proj: any}> = ({f, r, proj}) => {
  const [x0, y0] = proj(r.from), [x1, y1] = proj(r.to);
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
  const b = r.bend ?? 0.22, cx = mx - (dy / L) * L * b, cy = my + (dx / L) * L * b;
  const p = ease(f, r.at, r.at + (r.dur ?? 30), inOut);
  if (p <= 0) return null;
  // point and tangent at the end of the drawn part (for the arrowhead)
  const q = (t: number) => [(1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1];
  const [ex, ey] = q(p), [px, py] = q(Math.max(0, p - 0.02));
  const ang = (Math.atan2(ey - py, ex - px) * 180) / Math.PI;
  const color = r.color ?? C.highlight;
  return (
    <g>
      <path d={`M ${x0} ${y0} Q ${cx} ${cy} ${x1} ${y1}`} fill="none" stroke="rgba(30,20,10,0.35)" strokeWidth={13} strokeLinecap="round" pathLength={1}
        strokeDasharray={`${p} 2`} transform="translate(0 4)"/>
      <path d={`M ${x0} ${y0} Q ${cx} ${cy} ${x1} ${y1}`} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 2`}/>
      {p > 0.15 ? <path d="M -18 -15 L 6 0 L -18 15 Z" fill={color} stroke="rgba(30,20,10,0.4)" strokeWidth={1.5} transform={`translate(${ex} ${ey}) rotate(${ang})`}/> : null}
    </g>
  );
};

const PinDrop: React.FC<{f: number; pin: Pin; proj: any; scale: number; labelSize: number; seed: string}> = ({f, pin, proj, scale, labelSize, seed}) => {
  if (f < pin.at) return null;
  const [x, y] = proj([pin.lon, pin.lat]);
  const k = spr(f, pin.at, 9, 200);
  const fall = (1 - clamp01((f - pin.at) / 7)) ** 2;
  const s = scale;
  const lab = spr(f, pin.at + 6, 12, 180);
  const side = pin.side ?? "right";
  const rot = (random(seed) - 0.5) * 6;
  const color = pin.color ?? C.markerRed;
  return (
    <>
      <div style={{position: "absolute", left: x - 22 * s, top: y - 7 * s, width: 44 * s, height: 14 * s, borderRadius: "50%", background: "rgba(30,20,10,0.35)",
        transform: `scale(${0.4 + 0.6 * k})`, filter: "blur(2px)"}}/>
      <svg width={60 * s} height={84 * s} viewBox="0 0 60 84" style={{position: "absolute", left: x - 30 * s, top: y - 80 * s - fall * 260,
        transform: `scaleY(${f - pin.at < 9 ? 1 : 1 + (k - 1) * 0.6})`, transformOrigin: "50% 100%", overflow: "visible"}}>
        <path d="M 30 82 C 22 62 4 50 4 30 A 26 26 0 1 1 56 30 C 56 50 38 62 30 82 Z" fill={color} stroke="#FFF8EC" strokeWidth={4}/>
        <circle cx={30} cy={29} r={10} fill="#FFF8EC"/>
      </svg>
      {pin.label ? (
        <div style={{position: "absolute", left: side === "left" ? x - 44 * s : side === "right" ? x + 40 * s : x, top: side === "top" ? y - 132 * s : y - 46 * s,
          transform: `translate(${side === "left" ? "-100%" : side === "right" ? "0" : "-50%"}, -50%) rotate(${rot}deg) scale(${0.6 + 0.4 * lab})`, opacity: clamp01(lab * 3),
          transformOrigin: side === "left" ? "100% 50%" : "0 50%",
          background: C.white, color: C.ink, fontFamily: F.sans, fontWeight: 900, fontSize: labelSize, textTransform: "uppercase", padding: `${labelSize * 0.2}px ${labelSize * 0.38}px ${labelSize * 0.14}px`,
          lineHeight: 1, whiteSpace: "nowrap", boxShadow: "0 2px 3px rgba(0,0,0,0.18), 0 10px 20px rgba(0,0,0,0.2)"}}>{pin.label}</div>
      ) : null}
    </>
  );
};
