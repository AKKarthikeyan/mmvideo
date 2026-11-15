// SCENE KIND "windmap" in look B (rich daylight atlas): the Indian Ocean, India or Asia as a relief map with wind, heat and rain layers.
// Spec: WindmapSpec in windmap_layers.tsx (same fields as the cartoon film, CONTRACT_UPSC.md). Every layer and label is drawn only from at(key).
// Quantities come from lab(); a missing key throws. India is drawn whole in every focus (basemap_b.json).
import React from "react";
import {AbsoluteFill} from "remotion";
import type {SceneProps} from "../../cartoon/long/contract";
import {lab} from "../../cartoon/long/figs";
import {PaperFinish, Pill, SANS, W, H, clamp, eio, eo, lerp, prog} from "../kit";
import {Graticule, Land, MapDefs, MapLabel, Ocean} from "../map";
import {ANCHORS, FBOX, projector, type LL, type Pt} from "./windmap_geo";
import {LAYERS, type Ctx, type WindmapSpec} from "./windmap_layers";
import {Beach, Card, Tag, WmDefs, cardW, estW} from "./windmap_parts";
import {pinCovers, renderPins, type PinItem} from "./windmap_p2";

export type {WindmapSpec} from "./windmap_layers";
const ID = "wm", CLIP = "wm-all";
const SX0 = 96, SX1 = 1824, TOP = 64, BOT = 920;

// Badge cards: screen position (x, y) and the point on the map the card points at, per layer and focus.
type BadgeCfg = {title: string; x: number; y: number; target: LL; size?: number};
const BADGE: Record<string, Partial<Record<string, BadgeCfg>>> = {
  cross: {ocean: {title: "TRADES CROSS THE EQUATOR AT", x: 96, y: 575, target: [40, 0]}},
  lat20: {india: {title: "LINE OF LATITUDE", x: 1490, y: 350, target: [108, 20], size: 76}},
  "itcz-july": {asia: {title: "JULY RAIN BAND AT", x: 1400, y: 590, target: [99, 22.5]}},
  mascarene: {ocean: {title: "HIGH CENTRED AT", x: 96, y: 735, target: [50, -30], size: 56}},
  tibet: {asia: {title: "PLATEAU HEIGHT", x: 1380, y: 620, target: [100, 31], size: 58}},
};
const BADGE_DELAY: Record<string, number> = {"itcz-july": 58};

// Place names (map furniture, not keyed items). `anchor`: hidden when a tag sits on that anchor.
type Place = {text2?: string; lon: number; lat: number; text: string; size: number; rot?: number; col?: string; track?: number; anchor?: string; sans?: boolean};
const PLACES: Record<string, Place[]> = {
  ocean: [
    {lon: 24, lat: 2, text: "AFRICA", size: 38, col: "#6b5a34"},
    {lon: 86, lat: -15, text: "INDIAN OCEAN", size: 40, rot: -3, track: 0.5},
    {lon: 64, lat: 12.5, text: "ARABIAN SEA", size: 22, rot: -12, anchor: "arabian"},
    {lon: 87.5, lat: 15.5, text: "BAY OF BENGAL", size: 17, track: 0.2, anchor: "bay"},
    {lon: 79.5, lat: 23, text: "INDIA", size: 30, col: "#5b3f16", track: 0.35, anchor: "india"},
    {lon: 125, lat: -26, text: "AUSTRALIA", size: 28, col: "#6b5a34"},
    {lon: 47, lat: -19.2, text: "MADAGASCAR", size: 14, col: "#5b4a2a", sans: true, track: 0.12},
  ],
  india: [
    {lon: 57, lat: 12, text: "ARABIAN SEA", size: 30, rot: -6, anchor: "arabian"},
    {lon: 88.5, lat: 14.5, text: "BAY OF BENGAL", size: 28, anchor: "bay"},
    {lon: 90.5, lat: 4.6, text: "INDIAN OCEAN", size: 28, track: 0.5},
    {lon: 79, lat: 22.5, text: "INDIA", size: 44, col: "#5b3f16", track: 0.35, anchor: "india"},
  ],
  asia: [
    {lon: 60, lat: 9, text: "ARABIAN SEA", size: 24, rot: -8, anchor: "arabian"},
    {lon: 88.5, lat: 9.6, text: "BAY OF", text2: "BENGAL", size: 18, anchor: "bay"},
    {lon: 80, lat: -4, text: "INDIAN OCEAN", size: 34, track: 0.5},
    {lon: 79.5, lat: 20.5, text: "INDIA", size: 34, col: "#5b3f16", track: 0.35, anchor: "india"},
  ],
};

export const Scene: React.FC<SceneProps<WindmapSpec>> = ({f, dur, spec, at}) => {
  const focus = spec.focus, B = FBOX[focus];
  if (!B) throw new Error(`windmap: unknown focus "${focus}"`);
  const P = React.useMemo(() => projector(B), [B]);
  const ctx: Ctx = {f, dur, at, B, focus, P, spec, ID, clip: CLIP};

  // ---- camera: a slow push-in and a gentle drift; zoomFromBeach opens on the west coast and pulls back in the first 1.3 s
  const zoom = !!spec.zoomFromBeach, mid: Pt = {x: 960, y: 540}, F = P(73.9, 15.4);
  const u = clamp(f / Math.max(60, dur)), dx = lerp(8, -8, u);
  const tz = zoom ? eio(prog(f, 0, 38)) : 1;
  const sc = (zoom ? Math.pow(6, 1 - tz) : 1) * (1 + 0.022 * u);
  const base = zoom ? F : mid, fix = zoom ? {x: mid.x + (F.x - mid.x) * tz, y: mid.y + (F.y - mid.y) * tz} : mid;
  const tx = fix.x - base.x * sc, ty = fix.y - base.y * sc;
  const cam = (p: Pt): Pt => ({x: fix.x + (p.x + dx - base.x) * sc, y: fix.y + (p.y - base.y) * sc});

  const outs = spec.layers.map((L) => {
    const fn = LAYERS[L.id];
    if (!fn) throw new Error(`windmap: unknown layer "${L.id}"`);
    return fn(ctx, L);
  });

  // ---- tags (label items). Same anchor + later key: the earlier tag gives way to the later one.
  const items = spec.layers.filter((L) => L.id !== "pins").flatMap((L) => (L.items ?? []).map((it) => ({...it, text: it.lab ? lab(it.lab) : (it.text ?? "")})));
  // pins (Part 2): atlas pins with a serif card; they share the anchors, so they also hide the map names they sit on
  const pinItems: PinItem[] = spec.layers.filter((L) => L.id === "pins").flatMap((L) => (L.items ?? []).map((it) => ({text: it.lab ? lab(it.lab) : (it.text ?? ""), at: it.at, key: it.key, hl: it.hl})));
  pinItems.forEach((p) => { if (!p.text) throw new Error(`windmap: pin ${p.key} has neither text nor lab`); });
  const used = new Set([...items.map((i) => i.at), ...pinItems.map((i) => i.at)]);
  if (spec.layers.some((L) => L.id === "front" && L.steps?.some((st) => st.lab))) used.add("central"); // a front label sits on the country: drop the INDIA name
  const tagNodes = items.map((it, i) => {
    const a = ANCHORS[focus][it.at];
    if (!a) throw new Error(`windmap: unknown label anchor "${it.at}"`);
    if (!it.text) throw new Error(`windmap: label ${it.key} has neither text nor lab`);
    const t = at(it.key), later = items.filter((o) => o.at === it.at && o !== it && at(o.key) > t).map((o) => at(o.key)).sort((x, y) => x - y)[0];
    const fade = later === undefined ? 1 : 1 - eo(prog(f, later - 2, 10));
    let size = 29; while (size > 22 && estW(it.text, size) + 70 > 1100) size -= 1;
    const w = estW(it.text, size) + 70, h = size + 30, p = cam(P(a[0], a[1]));
    let x = Math.min(SX1 - w / 2, Math.max(SX0 + w / 2, p.x));
    const y = Math.min(BOT - h / 2, Math.max(TOP + h / 2, p.y));
    if (y - h / 2 < 126 && x + w / 2 > 1540) x = 1540 - w / 2;
    return <Tag key={"t" + i} x={x} y={y} text={it.text} a={eo(prog(f, t, 14))} fade={fade} size={size} hot={/HOT|HEAT/.test(it.text)}/>;
  });

  // ---- badge cards with a dotted leader to the map
  const cardNodes: React.ReactNode[] = [], leaders: React.ReactNode[] = [];
  spec.layers.forEach((L) => {
    if (!L.badge) return;
    const cfg = BADGE[L.id]?.[focus];
    if (!cfg) throw new Error(`windmap: no badge position for layer "${L.id}" on focus "${focus}"`);
    const value = lab(L.badge.lab), size = cfg.size ?? 72, a = eo(prog(f, at(L.badge.key) + (BADGE_DELAY[L.id] ?? 6), 16));
    const w = cardW(cfg.title, value, size), hh = 38 + 22 + size * 1.1, tp = cam(P(cfg.target[0], cfg.target[1]));
    const sy = cfg.y + hh / 2;
    const fromEdge: Pt = tp.x > cfg.x + w ? {x: cfg.x + w, y: sy} : tp.x < cfg.x ? {x: cfg.x, y: sy} : {x: tp.x, y: tp.y > cfg.y + hh ? cfg.y + hh : cfg.y};
    cardNodes.push(<Card key={"c" + L.id} x={cfg.x} y={cfg.y} title={cfg.title} value={value} size={size} a={a}/>);
    leaders.push(<g key={"d" + L.id} opacity={a * 0.95}>
      <path d={`M${fromEdge.x},${fromEdge.y} L${tp.x},${tp.y}`} stroke="#fff6c8" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" style={{filter: "drop-shadow(0 1px 2px rgba(10,30,60,.6))"}}/>
      <circle cx={tp.x} cy={tp.y} r="6" fill="#fff6c8" stroke="#8c4a22" strokeWidth="2"/>
    </g>);
  });

  // ---- legend for the trade-wind pictures
  const trK = spec.layers.find((l) => l.id === "trades-se"), bdK = spec.layers.find((l) => l.id === "bend");
  const legend = trK ? (
    <div style={{position: "absolute", left: 96, top: 800, display: "flex", flexDirection: "column", gap: 12, opacity: eo(prog(f, at(trK.key), 14)), fontFamily: SANS, fontWeight: 800, fontSize: 21, letterSpacing: "0.13em", color: "#fff", textShadow: "0 1px 6px rgba(8,30,60,.8)"}}>
      <div style={{display: "flex", alignItems: "center", gap: 14}}><span style={{width: 50, height: 9, borderRadius: 5, background: "#2f86da", boxShadow: "0 0 10px #2f86da"}}/>SOUTH-EAST TRADES</div>
      {bdK && <div style={{display: "flex", alignItems: "center", gap: 14, opacity: eo(prog(f, at(bdK.key), 14))}}><span style={{width: 50, height: 9, borderRadius: 5, background: "#f2923a", boxShadow: "0 0 10px #f2923a"}}/>BENT RIGHT: SOUTH-WEST MONSOON</div>}
    </div>
  ) : null;

  const places = (PLACES[focus] ?? []).filter((q) => !(q.anchor && used.has(q.anchor)) && !(q.anchor === "india" && used.has("central")) && !(pinItems.length && pinCovers(ctx, cam, pinItems, q.lon, q.lat, q.size, q.text)));
  const andaman = P(94.8, 12.2), lak = P(72.8, 10.6), s = B.k / 12.4 > 1.4 ? 1.35 : 1;

  return (
    <AbsoluteFill style={{background: "#24689a"}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", inset: 0}}>
        <MapDefs id={ID} b={B} f={f}/><WmDefs/>
        <defs><clipPath id={CLIP}><path d={B.land}/><path d={B.india}/></clipPath></defs>
        <g transform={`matrix(${sc} 0 0 ${sc} ${tx} ${ty}) translate(${dx} 0)`}>
          <Ocean id={ID} b={B} f={f} w={W} h={H}/>
          <Graticule b={B} f={f}/>
          <Land id={ID} b={B} w={W} h={H}/>
          {places.map((q, i) => { const p = P(q.lon, q.lat); return <React.Fragment key={i}><MapLabel x={p.x} y={p.y} text={q.text} size={q.size} rot={q.rot ?? 0} col={q.col} op={0.6} track={q.track ?? 0.3} sans={q.sans}/>{q.text2 && <MapLabel x={p.x} y={p.y + q.size * 1.25} text={q.text2} size={q.size} col={q.col} op={0.6} track={q.track ?? 0.3}/>}</React.Fragment>; })}
          {outs.map((o, i) => <React.Fragment key={"u" + i}>{o.under}</React.Fragment>)}
          {outs.map((o, i) => <React.Fragment key={"o" + i}>{o.over}</React.Fragment>)}
          <g>
            <MapLabel x={andaman.x} y={andaman.y - 6} text="ANDAMAN" size={13 * s} sans col="#f4fbff" op={0.9} track={0.12} anchor="start"/>
            <MapLabel x={andaman.x} y={andaman.y + 10 * s} text="& NICOBAR" size={13 * s} sans col="#f4fbff" op={0.9} track={0.12} anchor="start"/>
            <path d={`M${lak.x},${lak.y + 8 * s} V${lak.y + 62 * s}`} stroke="#fff" strokeWidth="1.4" strokeDasharray="2 4" opacity="0.9"/>
            <MapLabel x={lak.x} y={lak.y + 78 * s} text="LAKSHADWEEP" size={13 * s} sans col="#f4fbff" op={0.95} track={0.12}/>
          </g>
        </g>
        {zoom && f < 42 && <Beach f={f} a={1 - eo(prog(f, 12, 28))}/>}
        <g>{leaders}</g>
      </svg>
      <PaperFinish id="wmpf" grain={0.5} vignette={0.3}/>
      {legend}
      {cardNodes}
      {outs.map((o, i) => <React.Fragment key={"h" + i}>{o.hud?.(cam)}</React.Fragment>)}
      {renderPins(ctx, cam, pinItems)}
      {tagNodes}
      {spec.chip && <Pill x={96} y={80} text={spec.chip} a={1}/>}
      {spec.limit && <div style={{position: "absolute", left: SX0, top: 880, fontFamily: SANS, fontWeight: 600, fontSize: 24, color: "#fff6e4", textShadow: "0 1px 6px rgba(8,30,60,.8)"}}>Where the picture stops: {spec.limit}</div>}
    </AbsoluteFill>
  );
};
