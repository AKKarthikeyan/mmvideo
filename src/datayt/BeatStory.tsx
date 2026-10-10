// Data Kadai "beat" Shorts (1080x1920): one thing on screen at a time, very large type, a cut every bar or two.
// Three story types share this file: clue quiz, top-five countdown, state vs state. Beats and timing come from
// public/datayt/beats/<id>/data.json (scripts/datayt/build_beats.py). The all-states map appears only as a closing beat.
import React from "react";
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame} from "remotion";
import {COND, VoxFonts} from "../voxkit";
import geo from "../../public/datayt/india/geo.json";
import {P} from "./IndiaShort";
import {Mark} from "./Brand";
import {StateMap, MapState, MAP_RATIO} from "./StateMap";

const FPS = 30, W = 1080, H = 1920;
const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
type Beat = {kind: string; t0: number; t1: number; lines?: string[]; n?: number; of?: number; big?: string; text?: string; name?: string; geo?: string; sub?: string;
  items?: {big: string; text: string}[]; rank?: number; frac?: number; label?: string; note?: string; a?: string; b?: string; win?: string; sa?: number; sb?: number;
  title?: string; q?: string};
export type BeatData = {id: string; type: string; chip: string; sourceShort: string; source: string; accent: string; accent2: string; bands: string[];
  beats: Beat[]; total: number; beat: number; map?: MapState[]; a?: {name: string; geo: string}; b?: {name: string; geo: string}; vo: {file: string; at: number; sec: number}[]};
type G = {name: string; d: string; bbox: number[]};
const GEO = Object.fromEntries((geo.states as G[]).map((g) => [g.name, g]));

const F = (s: number) => Math.round(s * FPS);
const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
const pop = (f: number, at: number) => spring({frame: f - at, fps: FPS, config: {damping: 13, stiffness: 170}});
const Rich: React.FC<{text: string; acc: string}> = ({text, acc}) => <>{text.split("*").map((p, i) =>
  i % 2 ? <span key={i} style={{color: acc}}>{p}</span> : <React.Fragment key={i}>{p}</React.Fragment>)}</>;
// type that shrinks to fit a line: long state names stay on one line
const fit = (text: string, max: number, width: number, ratio = 0.5) => Math.min(max, width / (Math.max(1, text.length) * ratio));

// One state's outline, scaled to fill a box.
const Shape: React.FC<{name: string; x: number; y: number; w: number; h: number; fill: string; stroke?: string; scale?: number}> = ({name, x, y, w, h, fill, stroke = P.ink, scale = 1}) => {
  const g = GEO[name];
  if (!g) return null;
  const [x0, y0, x1, y1] = g.bbox;
  const bw = Math.max(1, x1 - x0), bh = Math.max(1, y1 - y0);
  const s = Math.min(w / bw, h / bh) * scale;
  return <svg width={w} height={h} style={{position: "absolute", left: x, top: y, overflow: "visible"}}>
    <g transform={`translate(${w / 2},${h / 2}) scale(${s}) translate(${-(x0 + x1) / 2},${-(y0 + y1) / 2})`}>
      <path d={g.d} fillRule="evenodd" fill={fill} stroke={stroke} strokeWidth={3 / s} strokeLinejoin="round"/>
    </g>
  </svg>;
};

const Chrome: React.FC<{D: BeatData; dark: boolean}> = ({D, dark}) => {
  const f = useCurrentFrame();
  const ink = dark ? "#FFFFFF" : P.ink;
  return <>
    <div style={{position: "absolute", left: 0, top: 0, height: 12, width: W * (f / F(D.total)), background: dark ? "#FFFFFF" : D.accent}}/>
    <div style={{position: "absolute", left: 60, top: 70, display: "flex", gap: 14, alignItems: "center"}}>
      <div style={{background: dark ? "#FFFFFF" : D.accent2, color: dark ? D.accent : P.bg, fontFamily: SANS, fontWeight: 800, fontSize: 28, letterSpacing: 3, padding: "8px 16px", borderRadius: 8}}>{D.chip}</div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 26, color: ink, opacity: 0.7}}>{D.sourceShort}</div>
    </div>
    <div style={{position: "absolute", right: 60, bottom: 50, display: "flex", alignItems: "center", gap: 10, opacity: 0.9}}>
      <Mark size={40} c={dark ? "#FFFFFF" : undefined} h={dark ? "#FFFFFF" : undefined}/>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 32, color: ink}}>DATA <span style={{color: dark ? "#FFFFFF" : P.gold}}>KADAI</span></div>
    </div>
  </>;
};

const Hook: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{justifyContent: "center", padding: "0 70px"}}>
    {(b.lines ?? []).map((l, i) => {
      const p = pop(f, f0 + 2 + i * 5);
      return <div key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: fit(l.replace(/\*/g, ""), 168, 940, 0.47), lineHeight: 1.02, color: P.ink,
        opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 60}px)`}}><Rich text={l} acc={D.accent}/></div>;
    })}
  </AbsoluteFill>;
};

const Clue: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const p = pop(f, f0 + 1);
  return <AbsoluteFill style={{justifyContent: "center", padding: "0 70px"}}>
    <div style={{display: "flex", gap: 12, marginBottom: 30}}>
      {Array.from({length: b.of ?? 5}).map((_, i) => <div key={i} style={{width: 150, height: 16, borderRadius: 8, background: i < (b.n ?? 0) ? D.accent : P.empty}}/>)}
    </div>
    <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, letterSpacing: 6, color: D.accent2}}>CLUE {b.n} OF {b.of}</div>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: fit(b.big ?? "", 380, 940, 0.62), lineHeight: 1, color: D.accent, marginTop: 10,
      transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: "left center", opacity: Math.min(1, p * 1.5)}}>{b.big}</div>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: 92, lineHeight: 1.08, color: P.ink, marginTop: 24, opacity: ease(f, f0 + 8, f0 + 16)}}>{b.text}</div>
  </AbsoluteFill>;
};

const Count: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const k = Math.min(2, Math.floor((f - f0) / F(D.beat)));
  const p = pop(f, f0 + k * F(D.beat));
  return <AbsoluteFill style={{background: D.accent, alignItems: "center", justifyContent: "center"}}>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: 120, color: "#FFFFFF", opacity: 0.9}}>{b.text}</div>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: 620, lineHeight: 1, color: "#FFFFFF", transform: `scale(${0.6 + 0.4 * p})`}}>{3 - k}</div>
  </AbsoluteFill>;
};

const Reveal: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const p = pop(f, f0);
  return <AbsoluteFill style={{background: D.accent}}>
    <Shape name={b.geo ?? ""} x={140} y={300} w={800} h={800} fill="#FFFFFF" stroke="#FFFFFF" scale={0.55 + 0.45 * p}/>
    <div style={{position: "absolute", left: 60, right: 60, top: 1180, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: fit(b.name ?? "", 230, 960, 0.5), lineHeight: 1,
      color: "#FFFFFF", transform: `translateY(${(1 - p) * 50}px)`}}>{b.name}</div>
    <div style={{position: "absolute", left: 80, right: 80, top: 1450, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 48, lineHeight: 1.25, color: "#FFFFFF", opacity: 0.92 * ease(f, f0 + 12, f0 + 22)}}>{b.sub}</div>
  </AbsoluteFill>;
};

const Recap: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{padding: "190px 70px 0"}}>
    <div style={{display: "flex", alignItems: "center", gap: 30, height: 260}}>
      <div style={{position: "relative", width: 240, height: 240}}><Shape name={b.geo ?? ""} x={0} y={0} w={240} h={240} fill={D.accent}/></div>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: fit(b.name ?? "", 150, 660, 0.5), color: D.accent, lineHeight: 1}}>{b.name}</div>
    </div>
    {(b.items ?? []).map((it, i) => {
      const a = f0 + 4 + i * 5;
      return <div key={i} style={{display: "flex", alignItems: "center", gap: 26, marginTop: 34, opacity: ease(f, a, a + 6), transform: `translateX(${(1 - ease(f, a, a + 8)) * 40}px)`}}>
        <div style={{width: 300, fontFamily: COND, fontWeight: 700, fontSize: fit(it.big, 104, 300, 0.5), color: P.ink, textAlign: "right"}}>{it.big}</div>
        <div style={{flex: 1, fontFamily: SANS, fontWeight: 600, fontSize: 40, lineHeight: 1.2, color: P.ink}}>{it.text}</div>
      </div>;
    })}
  </AbsoluteFill>;
};

const Rank: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const p = pop(f, f0);
  const top = b.rank === 1;
  const col = top ? D.accent : D.bands[Math.max(1, 4 - (b.rank ?? 1))];
  return <AbsoluteFill style={{background: top ? D.accent : "transparent"}}>
    <div style={{position: "absolute", left: 60, top: 150, fontFamily: COND, fontWeight: 700, fontSize: 330, lineHeight: 1, color: top ? "#FFFFFF" : D.accent, opacity: top ? 1 : 0.95,
      transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: "left top"}}>#{b.rank}</div>
    <Shape name={b.geo ?? ""} x={400} y={400} w={620} h={620} fill={top ? "#FFFFFF" : col} stroke={top ? "#FFFFFF" : P.ink} scale={0.6 + 0.4 * p}/>
    <div style={{position: "absolute", left: 60, right: 60, top: 1080, fontFamily: COND, fontWeight: 700, fontSize: fit(b.name ?? "", 190, 960, 0.5), lineHeight: 1, color: top ? "#FFFFFF" : P.ink}}>{b.name}</div>
    <div style={{position: "absolute", left: 60, right: 60, top: 1290, fontFamily: COND, fontWeight: 700, fontSize: fit(b.big ?? "", 300, 940, 0.62), lineHeight: 1, color: top ? "#FFFFFF" : D.accent,
      opacity: ease(f, f0 + 6, f0 + 12)}}>{b.big}</div>
    <div style={{position: "absolute", left: 60, right: 60, top: 1620, height: 26, background: top ? "#FFFFFF33" : P.empty, borderRadius: 13}}>
      <div style={{height: 26, borderRadius: 13, width: `${(b.frac ?? 1) * 100 * ease(f, f0 + 6, f0 + 24)}%`, background: top ? "#FFFFFF" : col}}/></div>
    <div style={{position: "absolute", left: 60, right: 60, top: 1668, fontFamily: SANS, fontWeight: 600, fontSize: 40, color: top ? "#FFFFFF" : P.mute}}>{b.label}</div>
  </AbsoluteFill>;
};

const Versus: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const show = ease(f, f0 + 10, f0 + 18);
  const side = (who: "a" | "b", top: number) => {
    const S = who === "a" ? D.a : D.b;
    const win = b.win === who;
    const col = who === "a" ? D.accent : D.accent2;
    const score = who === "a" ? b.sa : b.sb;
    return <div style={{position: "absolute", left: 0, right: 0, top, height: 700, background: win && show > 0.5 ? `${col}1F` : "transparent"}}>
      <Shape name={S?.geo ?? ""} x={60} y={110} w={360} h={480} fill={col}/>
      <div style={{position: "absolute", left: 460, right: 50, top: 120, fontFamily: COND, fontWeight: 700, fontSize: fit(S?.name ?? "", 120, 560, 0.5), lineHeight: 1, color: P.ink}}>{S?.name}</div>
      <div style={{position: "absolute", left: 460, right: 50, top: 260, fontFamily: COND, fontWeight: 700, fontSize: fit((who === "a" ? b.a : b.b) ?? "", 250, 560, 0.62), lineHeight: 1, color: col,
        opacity: show, transform: `translateY(${(1 - show) * 30}px)`}}>{who === "a" ? b.a : b.b}</div>
      <div style={{position: "absolute", left: 460, top: 540, display: "flex", gap: 12, alignItems: "center"}}>
        {Array.from({length: 5}).map((_, i) => <div key={i} style={{width: 44, height: 44, borderRadius: 22, background: i < (score ?? 0) - (win ? 1 - show : 0) ? col : P.empty}}/>)}
        {win && <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 38, color: col, marginLeft: 12, opacity: show}}>AHEAD</div>}
      </div>
    </div>;
  };
  return <AbsoluteFill>
    {side("a", 150)}
    <div style={{position: "absolute", left: 0, right: 0, top: 850, height: 190, background: P.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      transform: `scaleY(${ease(f, f0, f0 + 6)})`}}>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: fit(b.label ?? "", 96, 980, 0.46), color: "#FFFFFF", lineHeight: 1.05}}>{b.label}</div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, color: "#FFFFFF", opacity: 0.7}}>{b.note}</div>
    </div>
    {side("b", 1040)}
  </AbsoluteFill>;
};

const Score: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const p = pop(f, f0);
  const aw = (b.sa ?? 0) > (b.sb ?? 0);
  const row = (S: {name: string; geo: string} | undefined, n: number, col: string, win: boolean, top: number) => <div style={{position: "absolute", left: 60, right: 60, top, height: 560,
    borderRadius: 40, background: win ? col : `${col}22`, display: "flex", alignItems: "center", padding: "0 50px", gap: 30}}>
    <div style={{position: "relative", width: 300, height: 400}}><Shape name={S?.geo ?? ""} x={0} y={0} w={300} h={400} fill={win ? "#FFFFFF" : col} stroke={win ? "#FFFFFF" : P.ink}/></div>
    <div style={{flex: 1, fontFamily: COND, fontWeight: 700, fontSize: fit(S?.name ?? "", 120, 360, 0.5), color: win ? "#FFFFFF" : P.ink, lineHeight: 1}}>{S?.name}</div>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: 380, lineHeight: 1, color: win ? "#FFFFFF" : col, transform: `scale(${0.6 + 0.4 * p})`}}>{n}</div>
  </div>;
  return <AbsoluteFill>
    <div style={{position: "absolute", left: 60, top: 170, fontFamily: SANS, fontWeight: 800, fontSize: 48, letterSpacing: 6, color: P.mute}}>FINAL SCORE</div>
    {row(D.a, b.sa ?? 0, D.accent, aw, 270)}
    {row(D.b, b.sb ?? 0, D.accent2, !aw, 870)}
    <div style={{position: "absolute", left: 60, right: 60, top: 1480, fontFamily: SANS, fontSize: 30, lineHeight: 1.35, color: P.mute}}>Five categories, one point each. Source: {D.source}</div>
  </AbsoluteFill>;
};

const MapBeat: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const h = 1150, w = h * MAP_RATIO;
  return <AbsoluteFill>
    <div style={{position: "absolute", left: 60, right: 60, top: 150, fontFamily: COND, fontWeight: 700, fontSize: 84, lineHeight: 1.05, color: P.ink}}><Rich text={b.title ?? ""} acc={D.accent}/></div>
    <div style={{position: "absolute", left: 60, top: 350, fontFamily: SANS, fontSize: 36, color: P.mute}}>{b.sub}</div>
    <div style={{opacity: ease(f, f0, f0 + 8)}}><StateMap states={D.map ?? []} colors={D.bands} x={(W - w) / 2} y={440} h={h} fs={24}/></div>
  </AbsoluteFill>;
};

const End: React.FC<{D: BeatData; b: Beat; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const p = pop(f, f0);
  return <AbsoluteFill style={{justifyContent: "center", padding: "0 70px"}}>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: fit(b.q ?? "", 150, 940, 0.27), lineHeight: 1.03, color: D.accent, transform: `translateY(${(1 - p) * 40}px)`}}>{b.q}</div>
    <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 54, color: P.ink, marginTop: 24, opacity: ease(f, f0 + 8, f0 + 16)}}>{b.sub}</div>
    <div style={{fontFamily: SANS, fontSize: 28, lineHeight: 1.35, color: P.mute, marginTop: 50, opacity: ease(f, f0 + 14, f0 + 22)}}>Source: {D.source}</div>
  </AbsoluteFill>;
};

const KINDS: Record<string, React.FC<{D: BeatData; b: Beat; f0: number}>> = {hook: Hook, clue: Clue, count: Count, reveal: Reveal, recap: Recap, rank: Rank, versus: Versus, score: Score, map: MapBeat, end: End};
const DARK = (b: Beat) => b.kind === "count" || b.kind === "reveal" || (b.kind === "rank" && b.rank === 1);

const musicVol = (D: BeatData, fr: number) => {
  if (!D.vo?.length) return 1;
  const t = fr / FPS;
  const near = Math.min(...D.vo.map((v) => t < v.at ? v.at - t : t > v.at + v.sec ? t - v.at - v.sec : 0));
  return 0.14 + 0.31 * Math.min(1, near / 0.2);
};

export const BeatStory: React.FC<{D: BeatData}> = ({D}) => {
  const f = useCurrentFrame();
  const b = D.beats.find((x) => f >= F(x.t0) && f < F(x.t1)) ?? D.beats[D.beats.length - 1];
  const K = KINDS[b.kind];
  const f0 = F(b.t0);
  // a quick push-in on every cut keeps the frame moving
  const cut = 1 + 0.04 * Math.max(0, 1 - (f - f0) / 7);
  return <AbsoluteFill style={{background: P.bg}}>
    <VoxFonts/>
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${P.bg2} 0%, ${P.bg} 70%)`}}/>
    <AbsoluteFill style={{transform: `scale(${cut})`}}>{K ? <K D={D} b={b} f0={f0}/> : null}</AbsoluteFill>
    <Chrome D={D} dark={DARK(b)}/>
    <Audio src={staticFile(`datayt/beats/${D.id}/music.wav`)} volume={(fr) => musicVol(D, fr)}/>
    {(D.vo ?? []).map((v) => <Sequence key={v.file} from={F(v.at)}><Audio src={staticFile(`datayt/beats/${D.id}/${v.file}`)}/></Sequence>)}
  </AbsoluteFill>;
};
