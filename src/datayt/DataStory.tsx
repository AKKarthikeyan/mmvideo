// Data Kadai story Shorts (1080x1920): ranking, change, face-off, breakdown and myth-buster.
// Data and timeline: public/datayt/stories/<id>/data.json (scripts/datayt/build_story.py). Same three fixed strips as
// IndiaMapped so text never sits on the chart: header 80-330 · stage 350-1480 · panel 1500-1810 · footer 1840-1900.
import React from "react";
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {COND, VoxFonts} from "../voxkit";
import {P} from "./IndiaShort";
import {Mark} from "./Brand";

const FPS = 30, W = 1080;
const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
const STAGE = {x: 60, y: 350, w: 960, h: 1130};
const PANEL = {x: 60, y: 1500, w: 960, h: 310};

type Row = {name: string; v?: number; label?: string; rank?: number; at: number; a?: number; b?: number; d?: number; la?: string; lb?: string};
type Part = {name: string; v: number; label: string; cells: number; color: string; at: number};
type Txt = {kicker?: string; line?: string; sub?: string};
export type StoryData = {id: string; type: "ranking" | "change" | "faceoff" | "breakdown" | "myth"; chip: string; sourceShort: string; source: string;
  title: string[]; titleSub: string; headline: string[]; sub: string; unit: string; accent: string; accent2: string; bands: string[];
  t: Record<string, number[]>; total: number; end: {q: string; sub: string}; vo: {file: string; at: number; sec: number}[];
  panels: Record<string, Txt>; focus: Record<string, string[]>;
  rows?: Row[]; parts?: Part[]; india?: number; indiaLabel?: string; max?: number; min?: number; lowFirst?: boolean;
  aName?: string; bName?: string; indiaA?: number; indiaB?: number; indiaLa?: string; indiaLb?: string;
  myth?: {name: string; rank: number; label: string; of: number}; truth?: {name: string; label: string}};

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

// ---------------- shared grid: every row visible, two columns ----------------
const grid = (n: number, top = 0) => {
  const per = Math.ceil(n / 2);
  const rh = Math.min(66, (STAGE.h - top) / per);
  const cw = (STAGE.w - 34) / 2;
  return {per, rh, cw, pos: (i: number) => ({left: i < per ? 0 : cw + 34, top: top + (i % per) * rh})};
};

// League table: rank, name, bar, value. Fills from last place to first; focus rows stay bright, the rest dim.
const League: React.FC<{D: StoryData}> = ({D}) => {
  const f = useCurrentFrame();
  const sc = sceneAt(D, f);
  const rows = D.rows ?? [];
  const G = grid(rows.length);
  const focus = D.focus[sc];
  const fp = focus ? ease(f, F(D.t[sc][0]), F(D.t[sc][0]) + 10) : 0;
  const max = (D.max ?? 1) / 0.98;
  const showIndia = D.india != null && (sc === "context" || sc === "truth" || sc === "end");
  const nameW = 196, rankW = 44, valW = 92;
  const trackW = G.cw - nameW - rankW - valW;
  return <div style={{position: "absolute", left: STAGE.x, top: STAGE.y, width: STAGE.w, height: STAGE.h}}>
    {rows.map((r, i) => {
      const a = F(r.at);
      const p = ease(f, a, a + 12);
      if (f < a) return null;
      const pos = G.pos(i);
      const hot = focus?.includes(r.name) ?? false;
      const isMyth = D.myth?.name === r.name, isTop = i === 0;
      const col = isTop ? D.accent : isMyth ? D.accent2 : i < 3 ? D.bands[3] : i < 10 ? D.bands[2] : D.bands[1];
      const dim = focus && !hot ? 1 - 0.68 * fp : 1;
      const fs = Math.min(27, G.rh * 0.42);
      return <div key={r.name} style={{position: "absolute", left: pos.left, top: pos.top, width: G.cw, height: G.rh - 6, display: "flex", alignItems: "center",
        opacity: ease(f, a, a + 5) * dim, background: hot || isMyth && sc !== "table" ? `${col}14` : "transparent", borderRadius: 8}}>
        <div style={{width: rankW, fontFamily: COND, fontWeight: 700, fontSize: fs, color: isTop ? D.accent : P.mute, textAlign: "right", paddingRight: 10}}>{r.rank}</div>
        <div style={{width: nameW, fontFamily: SANS, fontWeight: hot || isTop ? 800 : 600, fontSize: fs * 0.88, color: P.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{r.name}</div>
        <div style={{width: trackW, height: G.rh * 0.46, position: "relative"}}>
          <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${((r.v ?? 0) / max) * 100 * p}%`, minWidth: 3, background: col, borderRadius: 5}}/>
          {showIndia && <div style={{position: "absolute", left: `${((D.india ?? 0) / max) * 100}%`, top: -5, bottom: -5, width: 3, background: P.ink, opacity: 0.7 * ease(f, F(D.t[sc][0]), F(D.t[sc][0]) + 12)}}/>}
        </div>
        <div style={{width: valW, fontFamily: COND, fontWeight: 700, fontSize: fs, color: isTop ? D.accent : P.ink, textAlign: "right"}}>{r.label}</div>
      </div>;
    })}
  </div>;
};

// Dumbbell rows: value A (hollow dot) to value B (solid dot) on one shared scale.
const Dumbbells: React.FC<{D: StoryData; from: string}> = ({D, from}) => {
  const f = useCurrentFrame();
  const sc = sceneAt(D, f);
  const rows = D.rows ?? [];
  if (f < F(D.t[from][0])) return null;
  const top = 64;
  const G = grid(rows.length, top);
  const lo = Math.floor((D.min ?? 0) / 10) * 10, hi = Math.ceil((D.max ?? 100) / 10) * 10;
  const nameW = 196, valW = 84, pad = 16;
  const trackW = G.cw - nameW - valW - 16 - pad * 2;
  const x = (v: number) => ((v - lo) / (hi - lo)) * trackW;
  const focus = D.focus[sc];
  const fp = focus ? ease(f, F(D.t[sc][0]), F(D.t[sc][0]) + 10) : 0;
  const change = D.type === "change";
  const s0 = F(D.t[from][0]);
  return <div style={{position: "absolute", left: STAGE.x, top: STAGE.y, width: STAGE.w, height: STAGE.h}}>
    <div style={{display: "flex", gap: 34, alignItems: "center", height: 44, opacity: ease(f, s0, s0 + 10), fontFamily: SANS, fontSize: 26, fontWeight: 700, color: P.ink}}>
      <div style={{display: "flex", alignItems: "center", gap: 10}}><div style={{width: 22, height: 22, borderRadius: 11, border: `4px solid ${change ? P.mute : D.accent2}`, background: change ? P.bg : D.accent2}}/>{D.aName}</div>
      <div style={{display: "flex", alignItems: "center", gap: 10}}><div style={{width: 22, height: 22, borderRadius: 11, background: D.accent}}/>{D.bName}</div>
      <div style={{marginLeft: "auto", fontWeight: 500, fontSize: 22, color: P.mute}}>scale {lo}{D.unit} to {hi}{D.unit}</div>
    </div>
    {rows.map((r, i) => {
      const a = F(r.at);
      if (f < a) return null;
      const pos = G.pos(i);
      const p = ease(f, a + 5, a + 20);
      const hot = focus?.includes(r.name) ?? false;
      const dim = focus && !hot ? 1 - 0.68 * fp : 1;
      const xa = x(r.a ?? 0), xb = xa + (x(r.b ?? 0) - xa) * p;
      const fs = Math.min(26, G.rh * 0.42);
      const cy = (G.rh - 6) / 2;
      return <div key={r.name} style={{position: "absolute", left: pos.left, top: pos.top, width: G.cw, height: G.rh - 6, display: "flex", alignItems: "center",
        opacity: ease(f, a, a + 5) * dim, background: hot ? `${D.accent}14` : "transparent", borderRadius: 8}}>
        <div style={{width: nameW, fontFamily: SANS, fontWeight: hot ? 800 : 600, fontSize: fs * 0.88, color: P.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingLeft: 6}}>{r.name}</div>
        <div style={{width: trackW, height: G.rh - 6, position: "relative", margin: `0 ${pad}px`}}>
          <div style={{position: "absolute", left: -pad, right: -pad, top: cy - 1, height: 2, background: P.line, opacity: 0.35}}/>
          <div style={{position: "absolute", left: Math.min(xa, xb), width: Math.abs(xb - xa), top: cy - 4, height: 8, background: change ? ((r.d ?? 0) >= 0 ? D.accent : D.accent2) : P.mute, opacity: 0.55, borderRadius: 4}}/>
          <div style={{position: "absolute", left: xa - 9, top: cy - 9, width: 18, height: 18, borderRadius: 9, boxSizing: "border-box",
            border: `4px solid ${change ? P.mute : D.accent2}`, background: change ? P.bg : D.accent2}}/>
          <div style={{position: "absolute", left: xb - 10, top: cy - 10, width: 20, height: 20, borderRadius: 10, background: D.accent, opacity: p > 0 ? 1 : 0}}/>
        </div>
        <div style={{width: valW + 16 - 0, fontFamily: COND, fontWeight: 700, fontSize: fs, color: P.ink, textAlign: "right"}}>
          {change ? `${(r.d ?? 0) >= 0 ? "+" : ""}${((r.d ?? 0) * p).toFixed(1)}` : `${Math.abs((r.d ?? 0) * p).toFixed(1)}`}</div>
      </div>;
    })}
  </div>;
};

// Two tall bars head to head (face-off), or one figure moving from then to now (change).
const Hero: React.FC<{D: StoryData; scene: string}> = ({D, scene}) => {
  const f = useCurrentFrame();
  const s0 = F(D.t[scene][0]), s1 = F(D.t[scene][1]);
  if (f < s0 || f >= s1) return null;
  const out = ease(f, s1 - 6, s1, 1, 0);
  const a = D.indiaA ?? 0, b = D.indiaB ?? 0;
  const hi = Math.max(a, b) / 0.92;
  const pa = ease(f, s0 + 6, s0 + 30), pb = ease(f, s0 + (D.type === "change" ? 34 : 6), s0 + (D.type === "change" ? 62 : 30));
  const H = 760, base = 1010;
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
  return <div style={{position: "absolute", left: STAGE.x, top: STAGE.y, width: STAGE.w, height: STAGE.h, opacity: ease(f, s1 - 6, s1, 1, 0),
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
    <In at={s0 + 2}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, color: P.mute, letterSpacing: 2}}>MOST PEOPLE GUESS</div></In>
    <In at={s0 + 8}><div style={{fontFamily: COND, fontWeight: 700, fontSize: 220, lineHeight: 1.05, color: P.ink, position: "relative"}}>{D.myth.name}
      <div style={{position: "absolute", left: -20, right: -20, top: "52%", height: 14, background: D.accent, transform: `scaleX(${stamp})`, transformOrigin: "left", borderRadius: 7}}/></div></In>
    <div style={{opacity: stamp, transform: `scale(${1.3 - 0.3 * stamp}) rotate(-4deg)`, marginTop: 40, border: `8px solid ${D.accent}`, borderRadius: 18, padding: "14px 40px",
      fontFamily: COND, fontWeight: 700, fontSize: 96, color: D.accent}}>#{D.myth.rank} of {D.myth.of}</div>
    <div style={{opacity: stamp, fontFamily: SANS, fontSize: 44, color: P.ink, marginTop: 34}}>{D.myth.label}</div>
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
  return <div style={{position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, opacity: out}}>
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
  return <div style={{position: "absolute", left: 60, right: 60, top: 1838, display: "flex", justifyContent: "flex-end", alignItems: "center", opacity: ease(f, t0, t0 + 12)}}>
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
  if (D.type === "ranking") return <League D={D}/>;
  if (D.type === "myth") return <><Guess D={D}/>{f >= F(D.t.table[0]) && <League D={D}/>}</>;
  if (D.type === "change") return <><Hero D={D} scene="india"/><Dumbbells D={D} from="rows"/></>;
  if (D.type === "faceoff") return <><Hero D={D} scene="duel"/><Dumbbells D={D} from="rows"/></>;
  return <Waffle D={D}/>;
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
