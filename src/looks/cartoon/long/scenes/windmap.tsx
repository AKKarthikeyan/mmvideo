// SCENE KIND "windmap" (UPSC monsoon film): a flat cartoon physical map of the Indian Ocean, India or Asia, projected from Natural Earth 10 m
// (India's point of view, public domain; scripts/upsc/windmap_basemap.py). Flat land fills, flat blue sea, ink coastlines, flowing arrows.
// Spec: WindmapSpec in windmap_layers.tsx. Layers (each drawn from at(layer.key)): seabreeze-giant, monsoon-sw, equator, trades-se, cross, bend,
// hot-nw, heatlow, lat20, itcz-july, trough, trough-move, mascarene, somali, tibet, tej, labels. A layer badge or a label item with `lab`
// prints lab(key) from figures.json (u7_labels); an item with `text` prints the text as given. A missing label key throws.
import React from "react";
import {C} from "../../palette";
import {easeIO, ease} from "../../ui";
import type {SceneProps} from "../contract";
import {lab} from "../figs";
import {LAYERS, type Ctx, type WindmapSpec} from "./windmap_layers";
import {ANCHORS, BOXES, projector, type Focus, type LL, type Pt} from "./windmap_geo";
import {PillBox, pillSize} from "./windmap_parts";

export type {WindmapSpec} from "./windmap_layers";

const SEA = "#8EC9F4", WAVE = "#C4E4FA", LAND = "#EEDFB4", INDIA = "#F6D56E";
const SAFE_X0 = 100, SAFE_X1 = 1820, TOP = 112, BOTTOM = 900;

// Where a layer's badge sits (lon, lat), per focus box.
const BADGE_POS: Record<string, Partial<Record<Focus, LL>>> = {
  cross: {ocean: [43, -14.8]}, lat20: {india: [108, 21.6]}, "itcz-july": {asia: [104.5, 25.6]}, mascarene: {ocean: [66, -31.2]}, tibet: {asia: [97.5, 31.4]},
};
const BADGE_DELAY: Record<string, number> = {"itcz-july": 58};

const WAVES = (() => {
  const r = (i: number) => { const v = Math.sin(i * 91.7 + 13.3) * 43758.5453; return v - Math.floor(v); };
  return Array.from({length: 70}).map((_, i) => ({x: r(i) * 1920, y: r(i + 99) * 1080, ph: r(i + 7) * 6.28}));
})();

// The opening beach (zoomFromBeach): sea on the left, sand on the right, a rolling shoreline with foam; it fades into the map as the camera pulls back.
const beach = (f: number): React.ReactNode => {
  const sh = (y: number) => 880 + Math.sin(y / 110 + f / 9) * 34 + Math.sin(y / 47 - f / 6) * 9;
  const ys = Array.from({length: 28}).map((_, i) => i * 40);
  const line = "M" + ys.map((y) => `${sh(y).toFixed(1)} ${y}`).join("L");
  const foam = "M" + ys.map((y) => `${(sh(y) - 26 - Math.sin(f / 7) * 8).toFixed(1)} ${y}`).join("L");
  return <g>
    <rect width={1920} height={1080} fill={INDIA}/>
    <path d={line + "L0 1080L0 0Z"} fill={SEA}/>
    <path d={foam} fill="none" stroke={C.white} strokeWidth={14} strokeLinecap="round" strokeDasharray="60 28" opacity={0.9}/>
    <path d={line} fill="none" stroke={C.ink} strokeWidth={8} strokeLinejoin="round"/>
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d="M0 0q12 -10 24 0t24 0" transform={`translate(${160 + i * 110 + Math.sin(f / 12 + i) * 16} ${150 + i * 150})`} fill="none" stroke={WAVE} strokeWidth={6} strokeLinecap="round"/>)}
  </g>;
};

export const Scene: React.FC<SceneProps<WindmapSpec>> = ({f, dur, spec, at}) => {
  const focus = spec.focus, B = BOXES[focus];
  if (!B) throw new Error(`windmap: unknown focus "${focus}"`);
  const P = React.useMemo(() => projector(B), [B]);
  const clipId = "wmland";
  const ctx: Ctx = {f, dur, at, B, focus, P, spec, clipId};

  // ---- camera: slow push-in; zoomFromBeach opens on the west coast (sand and sea) and pulls back in the first second
  const zoom = !!spec.zoomFromBeach, F = P(73.9, 15.4), mid: Pt = {x: 960, y: 540};
  const tz = zoom ? easeIO(f, 0, 38) : 1;
  const sc = (zoom ? Math.pow(6, 1 - tz) : 1) * (1 + 0.035 * Math.min(1, f / Math.max(60, dur)));
  const fix = zoom ? {x: mid.x + (F.x - mid.x) * tz, y: mid.y + (F.y - mid.y) * tz} : mid;
  const base = zoom ? F : mid;
  const cam = (p: Pt): Pt => ({x: fix.x + (p.x - base.x) * sc, y: fix.y + (p.y - base.y) * sc});
  const tx = fix.x - base.x * sc, ty = fix.y - base.y * sc;

  const out = spec.layers.map((L) => {
    const fn = LAYERS[L.id];
    if (!fn) throw new Error(`windmap: unknown layer "${L.id}"`);
    return fn(ctx, L);
  });

  // ---- labels (text items). Same anchor + later key: the earlier label gives way to the later one.
  const items = spec.layers.flatMap((L) => (L.items ?? []).map((it) => ({...it, text: it.lab ? lab(it.lab) : (it.text ?? "")})));
  const nodes: React.ReactNode[] = [];
  items.forEach((it, i) => {
    const a = ANCHORS[focus][it.at];
    if (!a) throw new Error(`windmap: unknown label anchor "${it.at}"`);
    if (!it.text) throw new Error(`windmap: label ${it.key} has neither text nor lab`);
    const t = at(it.key), later = items.filter((o) => o.at === it.at && o !== it && at(o.key) > t).map((o) => at(o.key)).sort((x, y) => x - y)[0];
    const fade = later === undefined ? 1 : 1 - ease(f, later - 2, later + 8);
    let size = 36; while (size > 24 && pillSize(it.text, size).w > 1000) size -= 2;
    const {w, h} = pillSize(it.text, size), p = cam(P(a[0], a[1]));
    let x = Math.min(SAFE_X1 - w / 2, Math.max(SAFE_X0 + w / 2, p.x));
    const y = Math.min(BOTTOM - h / 2, Math.max(TOP + h / 2, p.y));
    if (y - h / 2 < 124 && x + w / 2 > 1470) x = 1470 - w / 2;
    nodes.push(<PillBox key={"l" + i} x={x} y={y} text={it.text} f={f} at={t} size={size} fade={fade}/>);
  });
  // ---- layer badges (yellow, from the layer's badge key)
  spec.layers.forEach((L) => {
    if (!L.badge) return;
    const pos = BADGE_POS[L.id]?.[focus];
    if (!pos) throw new Error(`windmap: no badge position for layer "${L.id}" on focus "${focus}"`);
    const text = lab(L.badge.lab), size = 34, {w, h} = pillSize(text, size), p = cam(P(pos[0], pos[1]));
    const x = Math.min(SAFE_X1 - w / 2, Math.max(SAFE_X0 + w / 2, p.x)), y = Math.min(BOTTOM - h / 2, Math.max(TOP + h / 2, p.y));
    nodes.push(<PillBox key={"b" + L.id} x={x} y={y} text={text} f={f} at={at(L.badge.key) + (BADGE_DELAY[L.id] ?? 6)} size={size} fill={C.yellow}/>);
  });

  const ns = {vectorEffect: "non-scaling-stroke" as const};
  return <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
    <defs><clipPath id={clipId}><path d={B.india}/><path d={B.land}/></clipPath></defs>
    <rect width={1920} height={1080} fill={SEA}/>
    <g transform={`matrix(${sc} 0 0 ${sc} ${tx} ${ty})`}>
      <g stroke={WAVE} strokeWidth={5} strokeLinecap="round" fill="none">
        {WAVES.map((w, i) => <path key={i} d="M0 0q9 -8 18 0t18 0" transform={`translate(${w.x + Math.sin(f / 40 + w.ph) * 14} ${w.y + Math.sin(f / 23 + w.ph) * 3})`} opacity={0.55 + 0.45 * Math.sin(f / 30 + w.ph)}/>)}
      </g>
      <path d={B.land} fill={LAND} stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" {...ns}/>
      {out.map((o, i) => <React.Fragment key={"u" + i}>{o.under}</React.Fragment>)}
      <path d={B.india} fill={INDIA} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" {...ns}/>
      {out.map((o, i) => <React.Fragment key={"o" + i}>{o.over}</React.Fragment>)}
    </g>
    {zoom && f < 40 && <g opacity={1 - ease(f, 14, 38)}>{beach(f)}</g>}
    {nodes}
  </svg>;
};
