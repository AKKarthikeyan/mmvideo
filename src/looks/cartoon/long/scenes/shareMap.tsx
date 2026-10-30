// SHARE-MAP scene (Namakkal, 29 Oct 2026): the India state map with a few states lit and their share badges, an optional town pin,
// and an optional slow zoom. Only the states the spec names get a number; the rest stay plain (the full state table is not loaded).
// Boundaries: public/datayt/india/geo.json, as every Data Kadai map; replace with Survey of India boundaries before publishing.
import React from "react";
import {AbsoluteFill} from "remotion";
import {C} from "../../palette";
import {Badge, Pill, SANS, easeIO, pop} from "../../ui";
import {type SceneProps} from "../contract";
import {GEO, GEO_BY, MAP} from "./map_geo";
import {numOf, pinOf, sourceOf, type ShareMapSpec} from "./nk_kit";

export type {ShareMapSpec};

export const Scene: React.FC<SceneProps<ShareMapSpec>> = ({f, dur, spec, at}) => {
  for (const s of [...spec.states, ...(spec.lit ?? [])]) if (!GEO_BY[s.state]) throw new Error(`share-map: no state "${s.state}" in geo.json`);
  const z = spec.zoom, zt = z ? easeIO(f, 0, dur) : 0;
  // map units -> screen at rest, then the zoom: scale about the focus point and move it toward the frame centre-left
  const sc = MAP.s * (1 + ((z?.s ?? 1) - 1) * zt);
  const fx = z ? z.u : 500, fy = z ? z.v : 550;
  const ox = (MAP.x + fx * MAP.s) * (1 - zt) + 760 * zt, oy = (MAP.y + fy * MAP.s) * (1 - zt) + 560 * zt;
  const tf = `translate(${ox} ${oy}) scale(${sc}) translate(${-fx} ${-fy})`;
  const toScreen = (u: number, v: number) => [ox + (u - fx) * sc, oy + (v - fy) * sc] as const;
  const fillOf = (name: string) => {
    const s = spec.states.find((x) => x.state === name);
    if (s) { const t = Math.min(1, Math.max(0, (f - at(s.key)) / 10)); return t > 0 ? s.color ?? C.orange : C.white; }
    const l = (spec.lit ?? []).find((x) => x.state === name);
    if (l) return !l.key || f >= at(l.key) ? l.color ?? C.orange : C.white;
    return C.white;
  };
  const pin = spec.pin ? pinOf(spec.pin.name) : null;
  const pinT = spec.pin ? pop(f, at(spec.pin.key)) : 0;
  return <AbsoluteFill style={{background: C.sky}}>
    <svg width={1920} height={1080} style={{position: "absolute"}}>
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={260 + i * 480} cy={140 + Math.sin(f / 40 + i) * 8} r={70} fill={C.white} opacity={0.55}/>)}
      <g transform={`translate(0 14)`}><g transform={tf}>{GEO.map((g) => <path key={g.name} d={g.d} fill={C.ink}/>)}</g></g>
      <g transform={tf}>
        {GEO.map((g) => <path key={g.name} d={g.d} fill={fillOf(g.name)} stroke={C.ink} strokeWidth={3 / sc} strokeLinejoin="round"/>)}
        {pin && pinT > 0 && <g transform={`translate(${pin[0]} ${pin[1]}) scale(${pinT / sc})`}>
          <circle r={34 + 10 * Math.sin(f / 5)} fill={C.red} opacity={0.25}/>
          <circle r={18} fill={C.red} stroke={C.ink} strokeWidth={6}/>
        </g>}
      </g>
    </svg>
    {pin && spec.pin && pinT > 0 && (() => { const [x, y] = toScreen(pin[0], pin[1]); return <div style={{position: "absolute", left: x + 40, top: y - 34}}><Pill text={spec.pin.label} f={f} at={at(spec.pin.key)} dot={C.red}/></div>; })()}
    {spec.states.map((s) => <div key={s.key} style={{position: "absolute", left: s.bx, top: s.by, transform: "translate(-50%, -50%)"}}>
      <Badge n={numOf({...s, suffix: s.suffix ?? "%"}, at(s.key))} f={f} at={at(s.key)} caption={s.caption ?? s.state} size={100} color={s.color === C.blue ? C.blueDark : C.royal}/>
    </div>)}
    {spec.title && <div style={{position: "absolute", left: 96, top: 72}}><Pill text={spec.title} f={f} at={4}/></div>}
    <div style={{position: "absolute", left: 96, top: spec.title ? 160 : 72, fontFamily: SANS, fontWeight: 700, fontSize: 24, color: C.ink, background: "rgba(255,255,255,0.85)", borderRadius: 10, padding: "4px 12px"}}>{sourceOf(spec.source)} · map boundaries: draft</div>
  </AbsoluteFill>;
};
