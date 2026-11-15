// India Map of the Day: one standard map, one surprise, 30 s. Same look every day; the story, hook and voice change.
// Data: public/datakadai/maps/<id>/episode.json, written and claim-checked by scripts/datakadai/build_map.py.
// Scenes (hard cuts): hook -> map fills lowest to highest -> top/bottom ranks -> twist -> question -> end card.
import React from "react";
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from "remotion";
import {K, COND, SANS, DkFonts, Paper, Brand, TrustStamp, SourceBar, DraftMark, prog, usePop, fmt, Source, StampKind} from "./kit";
import {IndiaMap, Pin, Legend, GEO, STATE} from "./IndiaMap";

export const DK_FPS = 30;
const T = {hook: 0, reveal: 105, rank: 300, twist: 510, question: 690, end: 810};
export const DK_MAP_TOTAL = 900;

type Row = {id: string; name: string; v: number};
export type MapEp = {
  id: string; draft?: string | null; series: string; title: string;
  metric: {label: string; unit: string; decimals?: number};
  hook: {kicker: string; big: string; line: string}; reveal: string;
  rank: {top: string; bottom: string};
  twist: {states: string[]; title: string; lines: string[]};
  question: {big: string; line: string}; thumb: {big: string; line: string};
  source: Source; stamp: StampKind; audio?: string | null;
  values: Record<string, number | null>; india: number | null;
  bins: {color: string; label: string}[]; fills: Record<string, string>; order: string[];
  top: Row[]; bottom: Row[]; mapAttribution: string;
};

type Box = {x: number; y: number; w: number};
type Layout = {W: number; H: number; s: number; map: Box; brand: Box; header: Box; stamp: Box; panel: Box; legend: Box; source: Box; hook: Box & {h: number}};
// Vertical keeps text out of the Shorts overlays (bottom ~15 %, right-hand icon column).
const VERT: Layout = {W: 1080, H: 1920, s: 1, map: {x: 170, y: 390, w: 740}, brand: {x: 56, y: 70, w: 0},
  header: {x: 56, y: 150, w: 968}, stamp: {x: 760, y: 410, w: 0.78}, panel: {x: 56, y: 1255, w: 968},
  legend: {x: 252, y: 1262, w: 0}, source: {x: 56, y: 1592, w: 968}, hook: {x: 60, y: 520, w: 960, h: 700}};
const WIDE: Layout = {W: 1920, H: 1080, s: 0.92, map: {x: 80, y: 55, w: 820}, brand: {x: 990, y: 50, w: 0},
  header: {x: 990, y: 118, w: 870}, stamp: {x: 700, y: 70, w: 0.72}, panel: {x: 990, y: 390, w: 870},
  legend: {x: 990, y: 330, w: 0}, source: {x: 990, y: 965, w: 870}, hook: {x: 990, y: 180, w: 870, h: 700}};

const Header: React.FC<{D: MapEp; L: Layout}> = ({D, L}) => {
  const {on, s} = usePop(T.reveal);
  if (!on) return null;
  return (
    <div style={{position: "absolute", left: L.header.x, top: L.header.y, width: L.header.w, transform: `translateY(${(1 - s) * 30}px)`}}>
      <span style={{background: K.turmeric, color: K.ink, fontFamily: COND, fontWeight: 700, fontSize: 28 * L.s, letterSpacing: 2, padding: "4px 14px", borderRadius: 6}}>
        {D.series.toUpperCase()}
      </span>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 92 * L.s, color: K.ink, lineHeight: 1.05, marginTop: 14}}>{D.title}</div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30 * L.s, color: K.soft}}>{D.metric.label} · {D.metric.unit}</div>
    </div>
  );
};

const Hook: React.FC<{D: MapEp; L: Layout}> = ({D, L}) => {
  const f = useCurrentFrame();
  const big = usePop(8), line = usePop(30);
  return (
    <div style={{position: "absolute", left: L.hook.x, top: L.hook.y, width: L.hook.w, height: L.hook.h, display: "flex",
      flexDirection: "column", justifyContent: "center", alignItems: L.W > L.H ? "flex-start" : "center", textAlign: L.W > L.H ? "left" : "center"}}>
      <div style={{opacity: prog(f, 0, 8), fontFamily: COND, fontWeight: 700, fontSize: 40 * L.s, color: K.brick, letterSpacing: 3}}>{D.hook.kicker.toUpperCase()}</div>
      {big.on && <div style={{fontFamily: COND, fontWeight: 700, fontSize: 300 * L.s, color: K.ink, lineHeight: 1,
        transform: `scale(${0.7 + 0.3 * big.s})`, textShadow: `0 0 40px ${K.paper}`}}>{D.hook.big}</div>}
      {line.on && <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 52 * L.s, color: K.ink, lineHeight: 1.2, maxWidth: L.hook.w,
        background: "rgba(251,243,228,0.85)", padding: "8px 16px", borderRadius: 8, transform: `translateY(${(1 - line.s) * 30}px)`}}>{D.hook.line}</div>}
    </div>
  );
};

const RankList: React.FC<{title: string; rows: Row[]; color: string; max: number; start: number; dec: number; w: number; s: number}> =
  ({title, rows, color, max, start, dec, w, s: k}) => {
  const f = useCurrentFrame();
  return (
    <div style={{width: w}}>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 30 * k, color, letterSpacing: 1, opacity: prog(f, start, 6)}}>{title.toUpperCase()}</div>
      {rows.map((r, i) => {
        const p = prog(f, start + 8 + i * 7, 12);
        return (
          <div key={r.id} style={{display: "flex", alignItems: "center", gap: 10, marginTop: 2, opacity: p}}>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 25 * k, color: K.ink, width: w * 0.48, whiteSpace: "nowrap", overflow: "hidden"}}>{r.name}</div>
            <div style={{height: 18 * k, width: (w * 0.3) * (r.v / max) * p, background: color, borderRadius: 3}}/>
            <div style={{fontFamily: COND, fontWeight: 700, fontSize: 32 * k, color: K.ink}}>{fmt(r.v, dec)}</div>
          </div>
        );
      })}
    </div>
  );
};

const MapScenes: React.FC<{D: MapEp; L: Layout}> = ({D, L}) => {
  const f = useCurrentFrame();
  const dec = D.metric.decimals ?? 0;
  const scene = f < T.reveal ? "hook" : f < T.rank ? "reveal" : f < T.twist ? "rank" : f < T.twist + 180 ? "twist" : f < T.end ? "question" : "end";
  const step = 150 / Math.max(1, D.order.length);
  const startOf = Object.fromEntries(D.order.map((id, i) => [id, T.reveal + 10 + i * step]));
  const ranked = new Set([...D.top, ...D.bottom].map((r) => r.id));
  const twist = new Set(D.twist.states);
  const reveal = (id: string) => scene === "hook" ? 0 : scene === "reveal" ? (startOf[id] == null ? 1 : prog(f, startOf[id], 8)) : 1;
  const dim = (id: string) => scene === "rank" ? !ranked.has(id) : scene === "twist" ? !twist.has(id) : false;
  const focus = scene === "rank" ? [...ranked] : scene === "twist" ? D.twist.states : [];
  const pulse = (Math.sin(f / 5) + 1) / 2;
  const P = L.panel; const half = (P.w - 40) / 2;
  const maxV = Math.max(...D.top.map((r) => r.v), ...D.bottom.map((r) => r.v));
  // west half of the pinned states label to the left, east half to the right, so neighbours never collide
  const byX = [...D.twist.states].sort((a, b) => (STATE[a]?.cx ?? 0) - (STATE[b]?.cx ?? 0));
  const pinSide = (id: string): "left" | "right" => byX.length > 1 ? (byX.indexOf(id) < byX.length / 2 ? "left" : "right") : (STATE[id]?.cx ?? 0) > GEO.w * 0.55 ? "left" : "right";
  const twistLines = usePop(T.twist + 12);
  const q = usePop(T.question + 4);
  const end = usePop(T.end + 4);
  return (
    <>
      <IndiaMap x={L.map.x} y={L.map.y} w={L.map.w} fills={D.fills} reveal={reveal} dim={dim} focus={focus}
        focusColor={scene === "twist" ? K.brick : K.ink} pulse={scene === "twist" ? pulse : 0} draw={scene === "hook" ? prog(f, 0, 60) * 0.5 : 1}/>
      {scene === "hook" && <Hook D={D} L={L}/>}
      <Header D={D} L={L}/>
      {scene === "reveal" && <>
        <Legend bins={D.bins} unit={D.metric.unit} x={L.legend.x} y={L.legend.y} size={L.s} opacity={prog(f, T.reveal + 15, 10)}/>
        <div style={{position: "absolute", left: P.x, top: P.y + 110 * L.s, width: P.w, opacity: prog(f, T.reveal + 120, 8),
          fontFamily: COND, fontWeight: 700, fontSize: 52 * L.s, color: K.ink, textAlign: L.W > L.H ? "left" : "center"}}>{D.reveal}</div>
      </>}
      {scene === "rank" && <div style={{position: "absolute", left: P.x, top: P.y, width: P.w}}>
        {D.india != null && <div style={{marginBottom: 12, fontFamily: COND, fontWeight: 700, fontSize: 34 * L.s, color: K.soft,
          textAlign: L.W > L.H ? "left" : "center", opacity: prog(f, T.rank + 90, 10)}}>INDIA AVERAGE: {fmt(D.india, dec)}</div>}
        <div style={{display: "flex", gap: 40, flexDirection: L.W > L.H ? "column" : "row"}}>
          <RankList title={D.rank.top} rows={D.top} color={K.brick} max={maxV} start={T.rank} dec={dec} w={L.W > L.H ? P.w : half} s={L.s}/>
          <RankList title={D.rank.bottom} rows={D.bottom} color={K.leaf} max={maxV} start={T.rank + 40} dec={dec} w={L.W > L.H ? P.w : half} s={L.s}/>
        </div>
      </div>}
      {scene === "twist" && <>
        {D.twist.states.map((id, i) => (
          <Pin key={id} id={id} x={L.map.x} y={L.map.y} w={L.map.w} label={STATE[id].short} s={prog(f, T.twist + 6 + i * 8, 10)} side={pinSide(id)} size={L.s}/>
        ))}
        <div style={{position: "absolute", left: P.x, top: P.y, width: P.w, textAlign: L.W > L.H ? "left" : "center"}}>
          <div style={{fontFamily: COND, fontWeight: 700, fontSize: 30 * L.s, color: K.brick, letterSpacing: 3}}>THE TWIST</div>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 42 * L.s, color: K.ink, lineHeight: 1.2}}>{D.twist.title}</div>
          {twistLines.on && D.twist.lines.map((t, i) => (
            <div key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: 58 * L.s, color: K.brick, lineHeight: 1.15,
              transform: `translateX(${(1 - prog(f, T.twist + 12 + i * 10, 10)) * -40}px)`, opacity: prog(f, T.twist + 12 + i * 10, 10)}}>{t}</div>
          ))}
        </div>
      </>}
      {scene === "question" && q.on && <div style={{position: "absolute", left: P.x, top: P.y, width: P.w, textAlign: L.W > L.H ? "left" : "center",
        transform: `scale(${0.9 + 0.1 * q.s})`, transformOrigin: "top center"}}>
        <div style={{fontFamily: COND, fontWeight: 700, fontSize: 120 * L.s, color: K.ink, lineHeight: 1}}>{D.question.big}</div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40 * L.s, color: K.ink, lineHeight: 1.25, marginTop: 8}}>{D.question.line}</div>
      </div>}
      {scene === "end" && end.on && <div style={{position: "absolute", left: P.x, top: P.y, width: P.w, display: "flex", flexDirection: "column",
        alignItems: L.W > L.H ? "flex-start" : "center", transform: `translateY(${(1 - end.s) * 30}px)`}}>
        <div style={{position: "relative", height: 70 * L.s * 1.5, width: 420 * L.s * 1.5}}><Brand x={0} y={0} size={1.5 * L.s}/></div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40 * L.s, color: K.ink}}>A new India map, every day.</div>
        <div style={{fontFamily: COND, fontWeight: 700, fontSize: 40 * L.s, color: K.brick, marginTop: 6}}>FOLLOW FOR TOMORROW'S MAP</div>
      </div>}
      {f >= T.reveal && <TrustStamp kind={D.stamp} x={L.stamp.x} y={L.stamp.y} size={L.stamp.w} start={T.reveal + 30}/>}
      <SourceBar src={D.source} x={L.source.x} y={L.source.y} w={L.source.w} start={T.reveal + 15} extra={D.mapAttribution} size={L.s * 0.95}/>
    </>
  );
};

const MapVideo: React.FC<{D: MapEp; L: Layout}> = ({D, L}) => (
  <AbsoluteFill>
    <DkFonts/>
    <Paper>
      <Brand x={L.brand.x} y={L.brand.y} size={0.95 * L.s}/>
      <MapScenes D={D} L={L}/>
      <DraftMark reason={D.draft}/>
    </Paper>
    {D.audio && <Audio src={staticFile(D.audio)}/>}
  </AbsoluteFill>
);

export const MapShort: React.FC<{D: MapEp}> = ({D}) => <MapVideo D={D} L={VERT}/>;
export const MapWide: React.FC<{D: MapEp}> = ({D}) => <MapVideo D={D} L={WIDE}/>;

// 1280x720 thumbnail: finished map on the left, one big number and one line on the right.
export const MapThumb: React.FC<{D: MapEp}> = ({D}) => (
  <AbsoluteFill>
    <DkFonts/>
    <Paper>
      <IndiaMap x={30} y={24} w={585} fills={D.fills}/>
      <div style={{position: "absolute", left: 640, top: 70, width: 600}}>
        <span style={{background: K.turmeric, fontFamily: COND, fontWeight: 700, fontSize: 30, padding: "4px 14px", borderRadius: 6, color: K.ink}}>{D.title.toUpperCase()}</span>
        <div style={{fontFamily: COND, fontWeight: 700, fontSize: Math.min(168, 1150 / D.thumb.big.length), color: K.brick, lineHeight: 1.05, marginTop: 24}}>{D.thumb.big}</div>
        <div style={{fontFamily: COND, fontWeight: 700, fontSize: 62, color: K.ink, lineHeight: 1.08}}>{D.thumb.line}</div>
      </div>
      <Brand x={900} y={640} size={0.9}/>
      <TrustStamp kind={D.stamp} x={1050} y={36} size={0.6} start={-30}/>
      <DraftMark reason={D.draft}/>
    </Paper>
  </AbsoluteFill>
);
