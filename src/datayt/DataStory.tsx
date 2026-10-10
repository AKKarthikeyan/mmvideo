// Data Kadai story Shorts (1080x1920): ranking, change, face-off, breakdown and myth-buster.
// Data and timeline: public/datayt/stories/<id>/data.json (scripts/datayt/build_story.py). Fixed strips so text never sits
// on the chart. State stories: header 80-330 · map 350-1290 · panel 1310-1810 (hook card, then the map with every state's
// number, then top five and bottom five as bars). Breakdown: header · 100-square grid 350-1480 · panel 1500-1810.
// The full ranked list is not in the video; it is a chart post (StoryPosts.tsx).
import React from "react";
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {COND, VoxFonts} from "../voxkit";
import {P} from "./IndiaShort";
import {Mark} from "./Brand";
import {StateMap, MapState, MAP_RATIO} from "./StateMap";

const FPS = 30, W = 1080;
const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
const STAGE = {x: 60, y: 350, w: 960, h: 1130};
const PANEL = {x: 60, y: 1500, w: 960, h: 310};
// stories with a state map use the Mapped layout: map 350-1290, panel 1310-1810
const MAPBOX = {y: 350, h: 940};
const MPANEL = {x: 70, y: 1310, w: 940, h: 500};
const hasMap = (D: StoryData) => D.type !== "breakdown";

type Row = {name: string; v?: number; label?: string; rank?: number; at: number; a?: number; b?: number; d?: number; la?: string; lb?: string};
type Part = {name: string; v: number; label: string; cells: number; color: string; at: number};
type Txt = {kicker?: string; line?: string; sub?: string};
export type StoryData = {id: string; type: "ranking" | "change" | "faceoff" | "breakdown" | "myth"; chip: string; sourceShort: string; source: string;
  title: string[]; titleSub: string; headline: string[]; sub: string; unit: string; accent: string; accent2: string; bands: string[];
  t: Record<string, number[]>; total: number; end: {q: string; sub: string}; vo: {file: string; at: number; sec: number}[];
  panels: Record<string, Txt>; focus: Record<string, string[]>;
  rows?: Row[]; parts?: Part[]; india?: number; indiaLabel?: string; max?: number; min?: number; lowFirst?: boolean;
  aName?: string; bName?: string; indiaA?: number; indiaB?: number; indiaLa?: string; indiaLb?: string;
  myth?: {name: string; rank: number; label: string; of: number; geo: string}; truth?: {name: string; label: string; geo: string};
  map?: MapState[]; mapBands?: {label: string; color: string}[]; nodata?: string[]; focusGeo?: Record<string, string[]>;
  top5?: Bar[]; bottom5?: Bar[]; barMax?: number; indiaRow?: {name: string; v: number; label: string}};
type Bar = {name: string; geo: string; v: number; label: string; detail: string; bucket: number};

const F = (s: number) => Math.round(s * FPS);
const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
const sceneAt = (D: StoryData, f: number) => Object.keys(D.t).find((k) => f >= F(D.t[k][0]) && f < F(D.t[k][1])) ?? "end";
const Rich: React.FC<{text: string; acc: string}> = ({text, acc}) => <>{text.split("*").map((p, i) =>
  i % 2 ? <span key={i} style={{color: acc}}>{p}</span> : <React.Fragment key={i}>{p}</React.Fragment>)}</>;
const In: React.FC<{at: number; children: React.ReactNode; dy?: number; style?: React.CSSProperties}> = ({at, children, dy = 22, style}) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 8);
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * dy}px)`, ...style}}>{children}</div>;
};
const Kicker: React.FC<{children: React.ReactNode; color: string}> = ({children, color}) =>
  <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: 4, color, textTransform: "uppercase", marginBottom: 10}}>{children}</div>;
const started = (D: StoryData, f: number) => f >= F(D.t.title[1]);

// Two tall bars head to head (face-off), or one figure moving from then to now (change).
const Hero: React.FC<{D: StoryData; scene: string}> = ({D, scene}) => {
  const f = useCurrentFrame();
  const s0 = F(D.t[scene][0]), s1 = F(D.t[scene][1]);
  if (f < s0 || f >= s1) return null;
  const out = ease(f, s1 - 6, s1, 1, 0);
  const a = D.indiaA ?? 0, b = D.indiaB ?? 0;
  const hi = Math.max(a, b) / 0.92;
  const pa = ease(f, s0 + 6, s0 + 30), pb = ease(f, s0 + (D.type === "change" ? 34 : 6), s0 + (D.type === "change" ? 62 : 30));
  const H = 600, base = 790;
  const bar = (left: number, v: number, p: number, col: string, name: string) => <div style={{position: "absolute", left, top: 0, width: 330, height: STAGE.h}}>
    <div style={{position: "absolute", left: 0, right: 0, bottom: STAGE.h - base + (v / hi) * H * p + 14, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 112, lineHeight: 1, color: col, opacity: p > 0 ? 1 : 0}}>
      {(v * p).toFixed(1)}{D.unit}</div>
    <div style={{position: "absolute", left: 30, right: 30, top: base - (v / hi) * H * p, height: (v / hi) * H * p, background: col, borderRadius: "14px 14px 0 0"}}/>
    <div style={{position: "absolute", left: 0, right: 0, top: base + 18, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: P.ink}}>{name}</div>
  </div>;
  return <div style={{position: "absolute", left: STAGE.x, top: STAGE.y, width: STAGE.w, height: STAGE.h, opacity: out}}>
    <div style={{position: "absolute", left: 60, right: 60, top: base, height: 3, background: P.ink, opacity: 0.6}}/>
    {bar(110, a, pa, D.type === "change" ? P.mute : D.accent2, D.aName ?? "")}
    {bar(520, b, pb, D.accent, D.bName ?? "")}
    <div style={{position: "absolute", left: 0, right: 0, top: base + 84, textAlign: "center", fontFamily: SANS, fontSize: 30, color: P.mute}}>All India</div>
  </div>;
};

// 100 squares, one per percentage point, filled part by part.
const Waffle: React.FC<{D: StoryData}> = ({D}) => {
  const f = useCurrentFrame();
  const sc = sceneAt(D, f);
  const parts = D.parts ?? [];
  if (f < F(D.t.parts[0])) return null;
  const cell = 80, gap = 6, side = 10 * cell + 9 * gap, left = (STAGE.w - side) / 2;
  const focus = D.focus[sc];
  const fp = focus ? ease(f, F(D.t[sc][0]), F(D.t[sc][0]) + 10) : 0;
  const cells: {part: Part; k: number}[] = [];
  parts.forEach((p) => { for (let k = 0; k < p.cells; k++) cells.push({part: p, k}); });
  return <div style={{position: "absolute", left: STAGE.x, top: STAGE.y, width: STAGE.w, height: STAGE.h}}>
    {Array.from({length: 100}).map((_, i) => {
      const c = cells[i];
      const row = Math.floor(i / 10), colI = i % 10;
      const on = c ? ease(f, F(c.part.at) + c.k * 0.7, F(c.part.at) + c.k * 0.7 + 6) : 0;
      const dim = c && focus && !focus.includes(c.part.name) ? 1 - 0.75 * fp : 1;
      return <div key={i} style={{position: "absolute", left: left + colI * (cell + gap), top: row * (cell + gap), width: cell, height: cell, borderRadius: 10,
        background: P.empty}}><div style={{position: "absolute", inset: 0, borderRadius: 10, background: c?.part.color ?? P.empty, opacity: on * dim, transform: `scale(${0.6 + 0.4 * on})`}}/></div>;
    })}
    <div style={{position: "absolute", left: 0, right: 0, top: side + 22, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 34, rowGap: 6}}>
      {parts.map((p) => {
        const a = F(p.at);
        const dim = focus && !focus.includes(p.name) ? 1 - 0.6 * fp : 1;
        return <div key={p.name} style={{display: "flex", alignItems: "center", gap: 12, opacity: ease(f, a, a + 6) * dim, fontFamily: SANS, fontSize: 28, color: P.ink}}>
          <div style={{width: 28, height: 28, borderRadius: 6, background: p.color, flexShrink: 0}}/>
          <div style={{flex: 1, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{p.name}</div>
          <div style={{fontFamily: COND, fontWeight: 700, fontSize: 32}}>{p.label}</div>
        </div>;
      })}
    </div>
  </div>;
};

// Myth-buster: the answer most people give, then where it really ranks.
const Guess: React.FC<{D: StoryData}> = ({D}) => {
  const f = useCurrentFrame();
  const s0 = F(D.t.guess[0]), s1 = F(D.t.guess[1]);
  if (f < s0 || f >= s1 || !D.myth) return null;
  const mid = s0 + Math.round((s1 - s0) * 0.5);
  const stamp = ease(f, mid, mid + 8);
  return <div style={{position: "absolute", left: STAGE.x, top: STAGE.y, width: STAGE.w, height: MAPBOX.h, opacity: ease(f, s1 - 6, s1, 1, 0),
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
    <In at={s0 + 2}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, color: P.mute, letterSpacing: 2}}>MOST PEOPLE GUESS</div></In>
    <In at={s0 + 8}><div style={{fontFamily: COND, fontWeight: 700, fontSize: 200, lineHeight: 1.05, color: P.ink, position: "relative"}}>{D.myth.name}
      <div style={{position: "absolute", left: -20, right: -20, top: "52%", height: 14, background: D.accent, transform: `scaleX(${stamp})`, transformOrigin: "left", borderRadius: 7}}/></div></In>
    <div style={{opacity: stamp, transform: `scale(${1.3 - 0.3 * stamp}) rotate(-4deg)`, marginTop: 40, border: `8px solid ${D.accent}`, borderRadius: 18, padding: "14px 40px",
      fontFamily: COND, fontWeight: 700, fontSize: 96, color: D.accent}}>#{D.myth.rank} of {D.myth.of}</div>
    <div style={{opacity: stamp, fontFamily: SANS, fontSize: 44, color: P.ink, marginTop: 34}}>{D.myth.label}</div>
  </div>;
};

// The map: every state fills from the lowest value to the highest and keeps its number.
const MapView: React.FC<{D: StoryData}> = ({D}) => {
  const f = useCurrentFrame();
  const t0 = F(D.t.map[0]);
  if (f < t0 || !D.map) return null;
  const sc = sceneAt(D, f);
  const focus = D.focusGeo?.[sc] ?? null;
  const ring: Record<string, string> = {};
  if (D.myth && D.truth && (sc === "truth" || sc === "end")) { ring[D.myth.geo] = P.ink; ring[D.truth.geo] = P.ink; }
  if (sc === "bottom" || sc === "end") D.map.filter((s) => s.alt).forEach((s) => { ring[s.name] = P.ink; });
  const w = MAPBOX.h * MAP_RATIO;
  return <StateMap states={D.map} colors={D.bands} x={(W - w) / 2} y={MAPBOX.y} h={MAPBOX.h} frame={f} t0={t0}
    focus={focus} focusP={focus ? ease(f, F(D.t[sc][0]), F(D.t[sc][0]) + 10) : 0} ring={ring}/>;
};

const Legend: React.FC<{D: StoryData}> = ({D}) => (
  <div style={{display: "flex", gap: 8}}>
    {(D.mapBands ?? []).map((b, i) => <div key={i} style={{flex: 1}}>
      <div style={{height: 18, background: b.color, border: `1.5px solid ${P.ink}55`, borderRadius: 4}}/>
      <div style={{fontFamily: SANS, fontSize: 19, fontWeight: 500, color: P.ink, marginTop: 6, whiteSpace: "nowrap"}}>{b.label}</div>
    </div>)}
  </div>
);

// Five bars under the map: the top of the list or the bottom of it.
const Bars: React.FC<{D: StoryData; rows: Bar[]; start: number; kicker?: string; title?: string; first: number}> = ({D, rows, start, kicker, title, first}) => {
  const f = useCurrentFrame();
  const all = [...rows.map((r, i) => ({...r, rank: `${first + (first === 1 ? i : -i)}`, india: false})),
    ...(D.indiaRow ? [{...D.indiaRow, geo: "", detail: "", bucket: 0, rank: "—", india: true}] : [])];
  const max = (D.barMax ?? 1) / 0.74;
  const rh = all.length > 5 ? 54 : 62;
  return <div>
    {kicker && <In at={start}><Kicker color={D.accent2}>{kicker}</Kicker></In>}
    {title && <In at={start + 3}><div style={{fontFamily: COND, fontWeight: 700, fontSize: 54, lineHeight: 1, color: P.ink, marginBottom: 14}}><Rich text={title} acc={D.accent}/></div></In>}
    {all.map((r, i) => {
      const a = start + 8 + i * 4; const p = ease(f, a, a + 14);
      return <div key={r.name} style={{display: "flex", alignItems: "center", height: rh, opacity: ease(f, a, a + 5)}}>
        <div style={{width: 46, fontFamily: COND, fontWeight: 700, fontSize: 30, color: P.mute}}>{r.rank}</div>
        <div style={{width: 300}}>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, color: P.ink, whiteSpace: "nowrap", lineHeight: 1.1}}>{r.name}</div>
          {r.detail && <div style={{fontFamily: SANS, fontSize: 19, color: P.mute, whiteSpace: "nowrap"}}>{r.detail}</div>}
        </div>
        <div style={{flex: 1, height: rh * 0.62, position: "relative"}}>
          <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${(r.v / max) * 100 * p}%`, minWidth: 4, borderRadius: 6,
            background: r.india ? P.line : D.bands[r.bucket]}}/>
          <div style={{position: "absolute", left: `calc(${(r.v / max) * 100 * p}% + 12px)`, top: "50%", transform: "translateY(-50%)",
            fontFamily: COND, fontWeight: 700, fontSize: 32, color: P.ink}}>{r.label}</div>
        </div>
      </div>;
    })}
  </div>;
};

// ---------------- strips ----------------
const Header: React.FC<{D: StoryData}> = ({D}) => {
  const f = useCurrentFrame();
  const t0 = F(D.t.title[1]);
  return <>
    <div style={{position: "absolute", left: 0, top: 0, height: 10, width: W * (f / F(D.total)), background: D.accent}}/>
    {f >= t0 && <div style={{position: "absolute", left: 60, top: 84, width: 960, opacity: ease(f, t0, t0 + 10)}}>
      <div style={{display: "flex", gap: 14, alignItems: "center"}}>
        <div style={{background: D.accent2, color: P.bg, fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: 3, padding: "8px 16px", borderRadius: 8}}>{D.chip}</div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 26, color: P.mute}}>{D.sourceShort}</div>
      </div>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 66, lineHeight: 1.06, color: P.ink, marginTop: 16}}>
        {D.headline.map((l, i) => <div key={i}><Rich text={l} acc={D.accent}/></div>)}</div>
      <div style={{fontFamily: SANS, fontSize: 28, color: P.mute, marginTop: 8}}>{D.sub}</div>
    </div>}
  </>;
};

const TitleCard: React.FC<{D: StoryData}> = ({D}) => {
  const f = useCurrentFrame();
  const e = F(D.t.title[1]);
  if (f >= e) return null;
  return <AbsoluteFill style={{justifyContent: "center", padding: "0 70px", opacity: ease(f, e - 6, e, 1, 0)}}>
    <In at={1}><Kicker color={D.accent2}>{D.chip} · {D.sourceShort}</Kicker></In>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: 128, lineHeight: 1.0, color: P.ink}}>
      {D.title.map((l, i) => <In key={i} at={3 + i * 5}><Rich text={l} acc={D.accent}/></In>)}</div>
    <In at={24}><div style={{fontFamily: SANS, fontSize: 40, color: P.mute, marginTop: 34}}>{D.titleSub}</div></In>
  </AbsoluteFill>;
};

const Panel: React.FC<{D: StoryData}> = ({D}) => {
  const f = useCurrentFrame();
  const sc = sceneAt(D, f);
  if (sc === "title") return null;
  const s0 = F(D.t[sc][0]), s1 = F(D.t[sc][1]);
  const out = sc === "end" ? 1 : ease(f, s1 - 5, s1, 1, 0);
  const tx = D.panels[sc] ?? {};
  const box = hasMap(D) ? MPANEL : PANEL;
  if (hasMap(D) && (sc === "top" || sc === "bottom")) {
    const rows = (sc === "top" ? D.top5 : D.bottom5) ?? [];
    const n = D.map?.length ?? rows.length;
    return <div style={{position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, opacity: out}}>
      <Bars D={D} rows={rows} start={s0} kicker={tx.kicker} title={tx.line} first={sc === "top" ? 1 : n}/>
    </div>;
  }
  return <div style={{position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, opacity: out}}>
    {hasMap(D) && sc === "map" && <div style={{position: "absolute", left: 0, right: 0, bottom: 0}}><Legend D={D}/></div>}
    {sc === "end" ? <>
      <In at={s0}><div style={{fontFamily: COND, fontWeight: 700, fontSize: 84, lineHeight: 1.02, color: D.accent}}>{D.end.q}</div></In>
      <In at={s0 + 6}><div style={{fontFamily: SANS, fontSize: 36, color: P.ink, marginTop: 8}}>{D.end.sub}</div></In>
      <In at={s0 + 12}><div style={{fontFamily: SANS, fontSize: 21, lineHeight: 1.35, color: P.mute, marginTop: 14}}>Source: {D.source}</div></In>
    </> : <>
      {tx.kicker && <In at={s0}><Kicker color={D.accent2}>{tx.kicker}</Kicker></In>}
      {tx.line && <In at={s0 + 4}><div style={{fontFamily: COND, fontWeight: 700, fontSize: 68, lineHeight: 1.06, color: P.ink}}><Rich text={tx.line} acc={D.accent}/></div></In>}
      {tx.sub && <In at={s0 + 16}><div style={{fontFamily: SANS, fontSize: 30, lineHeight: 1.3, color: P.mute, marginTop: 12}}>{tx.sub}</div></In>}
    </>}
  </div>;
};

const Footer: React.FC<{D: StoryData}> = ({D}) => {
  const f = useCurrentFrame();
  if (!started(D, f)) return null;
  const t0 = F(D.t.title[1]);
  return <div style={{position: "absolute", left: 60, right: 60, top: 1838, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: ease(f, t0, t0 + 12)}}>
    <div style={{fontFamily: SANS, fontSize: 22, color: P.mute}}>{D.nodata?.length && f >= F(D.t.map?.[0] ?? 0) ? `Not ranked: ${D.nodata.map((n) => n.replace("NCT of ", "")).join(", ")}` : ""}</div>
    <div style={{display: "flex", alignItems: "center", gap: 10}}><Mark size={44}/>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 34, color: P.ink}}>DATA <span style={{color: P.gold}}>KADAI</span></div></div>
  </div>;
};

const musicVol = (D: StoryData, fr: number) => {
  if (!D.vo?.length) return 1;
  const t = fr / FPS;
  const near = Math.min(...D.vo.map((v) => t < v.at ? v.at - t : t > v.at + v.sec ? t - v.at - v.sec : 0));
  return 0.14 + 0.31 * Math.min(1, near / 0.2);
};

const Stage: React.FC<{D: StoryData}> = ({D}) => {
  const f = useCurrentFrame();
  if (!started(D, f)) return null;
  if (D.type === "breakdown") return <Waffle D={D}/>;
  return <>
    {D.type === "myth" && <Guess D={D}/>}
    {D.type === "change" && <Hero D={D} scene="india"/>}
    {D.type === "faceoff" && <Hero D={D} scene="duel"/>}
    <MapView D={D}/>
  </>;
};

export const DataStory: React.FC<{D: StoryData}> = ({D}) => (
  <AbsoluteFill style={{background: P.bg}}>
    <VoxFonts/>
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${P.bg2} 0%, ${P.bg} 70%)`}}/>
    <Stage D={D}/>
    <TitleCard D={D}/>
    <Header D={D}/>
    <Panel D={D}/>
    <Footer D={D}/>
    <Audio src={staticFile(`datayt/stories/${D.id}/music.wav`)} volume={(fr) => musicVol(D, fr)}/>
    {(D.vo ?? []).map((v) => <Sequence key={v.file} from={F(v.at)}><Audio src={staticFile(`datayt/stories/${D.id}/${v.file}`)}/></Sequence>)}
  </AbsoluteFill>
);
