// Data Kadai "MAPPED" Short (1080x1920): every state's number on the India map, band by band.
// The all-India version of the Tamil Nadu alcohol map (TnAlcohol.tsx). Data and timeline: public/datayt/mapped/<id>/data.json
// (scripts/datayt/build_mapped.py). Layout is three fixed strips so nothing sits on the map:
//   header 80-330 (chip, headline, sub) · map 350-1290 · panel 1310-1810 · footer 1840-1900.
import React from "react";
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame} from "remotion";
import {COND, VoxFonts} from "../voxkit";
import geo from "../../public/datayt/india/geo.json";
import {P} from "./IndiaShort";
import {Mark} from "./Brand";

const FPS = 30, W = 1080;
const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
const MAP = {top: 350, h: 940};
const S = MAP.h / geo.h, MW = geo.w * S, MX = (W - MW) / 2;
const PANEL = {x: 70, y: 1310, w: 940, h: 500};

type St = {name: string; short: string; v: number; label: string; bucket: number; at: number; nudge: number[]};
type Vo = {file: string; at: number; sec: number};
export type MappedData = {id: string; chip: string; sourceShort: string; source: string; title: string[]; headline: string[]; sub: string;
  bands: {label: string; color: string; count: number}[]; accent: string; accent2: string; states: St[]; nodata: string[];
  t: Record<string, number[]>; total: number; top: string[]; topText: {kicker: string; title: string; sub: string}; max: number;
  insight: {kicker: string; big: string; text: string; focus: string[]}; end: {q: string; sub: string};
  draw: {big?: string; text?: string}; all: {line1?: string; line2?: string}; bandNotes: string[]; vo: Vo[]};
type G = {name: string; d: string; lx: number; ly: number; r: number};
const GEO = Object.fromEntries((geo.states as G[]).map((g) => [g.name, g]));

const F = (s: number) => Math.round(s * FPS);
const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
const mix = (a: string, b: string, p: number) => {
  const h = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16);
  return "#" + [0, 1, 2].map((i) => Math.round(h(a, i) + (h(b, i) - h(a, i)) * p).toString(16).padStart(2, "0")).join("");
};
const sceneAt = (D: MappedData, f: number) => Object.keys(D.t).find((k) => f >= F(D.t[k][0]) && f < F(D.t[k][1])) ?? "end";
// "*word*" marks the accent colour
const Rich: React.FC<{text: string; acc: string}> = ({text, acc}) => <>{text.split("*").map((p, i) =>
  i % 2 ? <span key={i} style={{color: acc}}>{p}</span> : <React.Fragment key={i}>{p}</React.Fragment>)}</>;
const In: React.FC<{at: number; children: React.ReactNode; dy?: number; style?: React.CSSProperties}> = ({at, children, dy = 22, style}) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 8);
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * dy}px)`, ...style}}>{children}</div>;
};
const Kicker: React.FC<{children: React.ReactNode; color: string}> = ({children, color}) =>
  <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: 4, color, textTransform: "uppercase", marginBottom: 12}}>{children}</div>;

// ---------------- map: outline draws, each state fills on its beat and keeps its number ----------------
const MapLayer: React.FC<{D: MappedData}> = ({D}) => {
  const f = useCurrentFrame();
  const sc = sceneAt(D, f);
  const t0 = F(D.t.draw[0]);
  if (f < t0) return null;
  const BY = Object.fromEntries(D.states.map((s) => [s.name, s]));
  const focus = sc === "top" ? D.top : sc === "insight" ? D.insight.focus : null;
  const focusP = focus ? ease(f, F(D.t[sc][0]), F(D.t[sc][0]) + 10) : 0;
  const order = [...(geo.states as G[])].sort((a, b) => a.ly - b.ly);
  const k = 1 / S;      // screen px -> map units
  return <svg width={W} height={1920} style={{position: "absolute", left: 0, top: 0}}>
    <g transform={`translate(${MX},${MAP.top}) scale(${S})`}>
      {order.map((g, i) => {
        const d = BY[g.name];
        const dStart = t0 + 2 + i * 0.6;
        const draw = ease(f, dStart, dStart + 18), base = ease(f, dStart + 12, dStart + 22);
        const fillP = d ? ease(f, F(d.at), F(d.at) + 6) : 0;
        const col = d ? mix(P.empty, D.bands[d.bucket].color, fillP) : P.empty;
        const pop = d ? spring({frame: f - F(d.at), fps: FPS, config: {damping: 12, stiffness: 180}, durationInFrames: 9}) : 0;
        const sc2 = 1 + 0.07 * Math.sin(pop * Math.PI) * (d && f >= F(d.at) ? 1 : 0);
        const dim = focus && !focus.includes(g.name) ? 1 - 0.72 * focusP : 1;
        return <g key={g.name} opacity={dim} transform={`translate(${g.lx},${g.ly}) scale(${sc2}) translate(${-g.lx},${-g.ly})`}>
          <path d={g.d} fillRule="evenodd" fill={col} fillOpacity={base} stroke={P.ink} strokeOpacity={0.55} strokeWidth={1.1}
                strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw}/>
        </g>;
      })}
      {D.states.map((d) => {
        const op = ease(f, F(d.at) + 2, F(d.at) + 8) * (focus && !focus.includes(d.name) ? 1 - 0.6 * focusP : 1);
        if (op <= 0.001) return null;
        const g = GEO[d.name];
        const [nx, ny] = d.nudge;
        const out = !!(nx || ny);
        const x = g.lx + nx, y = g.ly + ny;
        const hot = focus?.includes(d.name) ?? false;
        const fs = (hot ? 30 : d.bucket >= 3 ? 25 : 22) * k;
        const dark = d.bucket >= 2 && !out;
        return <g key={d.name} opacity={op}>
          {out && <line x1={g.lx} y1={g.ly} x2={x} y2={y} stroke={P.ink} strokeWidth={1.3 * k} opacity={0.55}/>}
          {out && <circle cx={g.lx} cy={g.ly} r={3 * k} fill={P.ink} opacity={0.7}/>}
          <text x={x} y={y + fs * 0.35} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={fs}
                fill={dark ? "#FFFFFF" : P.ink} stroke={dark ? mix(D.bands[d.bucket].color, "#000000", 0.25) : P.bg}
                strokeWidth={(dark ? 3 : 5) * k} paintOrder="stroke">{d.label}</text>
        </g>;
      })}
    </g>
  </svg>;
};

// ---------------- header strip: never overlaps the map ----------------
const Header: React.FC<{D: MappedData}> = ({D}) => {
  const f = useCurrentFrame();
  const t0 = F(D.t.draw[0]);
  const total = F(D.total);
  return <>
    <div style={{position: "absolute", left: 0, top: 0, height: 10, width: W * (f / total), background: D.accent}}/>
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

const TitleCard: React.FC<{D: MappedData & {titleSub?: string}}> = ({D}) => {
  const f = useCurrentFrame();
  const e = F(D.t.title[1]);
  if (f >= e) return null;
  return <AbsoluteFill style={{justifyContent: "center", padding: "0 70px", opacity: ease(f, e - 6, e, 1, 0)}}>
    <In at={1}><Kicker color={D.accent2}>{D.chip} · {D.sourceShort}</Kicker></In>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: 132, lineHeight: 1.0, color: P.ink}}>
      {D.title.map((l, i) => <In key={i} at={3 + i * 5}><Rich text={l} acc={D.accent}/></In>)}</div>
    <In at={24}><div style={{fontFamily: SANS, fontSize: 40, color: P.mute, marginTop: 34}}>{D.titleSub ?? "Every state, mapped."}</div></In>
  </AbsoluteFill>;
};

const Legend: React.FC<{D: MappedData; active: number; upto: number}> = ({D, active, upto}) => (
  <div style={{display: "flex", gap: 8}}>
    {D.bands.map((b, i) => <div key={i} style={{flex: 1, opacity: i > upto ? 0.25 : active < 0 || active === i ? 1 : 0.5, transform: active === i ? "translateY(-4px)" : "none"}}>
      <div style={{height: active === i ? 24 : 18, background: b.color, border: `1.5px solid ${P.ink}55`, borderRadius: 4}}/>
      <div style={{fontFamily: SANS, fontSize: 21, fontWeight: active === i ? 800 : 500, color: P.ink, marginTop: 6, whiteSpace: "nowrap"}}>{b.label}</div>
    </div>)}
  </div>
);

const Panel: React.FC<{D: MappedData}> = ({D}) => {
  const f = useCurrentFrame();
  const sc = sceneAt(D, f);
  if (sc === "title") return null;
  const s0 = F(D.t[sc][0]), s1 = F(D.t[sc][1]);
  const out = sc === "end" ? 1 : ease(f, s1 - 5, s1, 1, 0);
  const BY = Object.fromEntries(D.states.map((s) => [s.name, s]));
  let body: React.ReactNode = null;
  const isBand = /^b\d$/.test(sc);
  const bi = isBand ? parseInt(sc.slice(1), 10) : -1;

  if (sc === "draw") {
    body = <div>
      <In at={s0 + 4}><div style={{fontFamily: COND, fontWeight: 700, fontSize: 84, lineHeight: 1, color: P.ink}}>{D.draw.big}</div></In>
      <In at={s0 + 10}><div style={{fontFamily: SANS, fontSize: 32, lineHeight: 1.35, color: P.mute, marginTop: 16}}>{D.draw.text}</div></In>
    </div>;
  } else if (isBand) {
    const b = D.bands[bi];
    const mem = D.states.filter((d) => d.bucket === bi);
    const cols = mem.length > 6 ? 3 : 2;
    body = <div>
      <In at={s0}><Kicker color={P.mute}>Band {bi + 1} of 5 · {b.count} states/UTs{D.bandNotes[bi] ? ` · ${D.bandNotes[bi]}` : ""}</Kicker></In>
      <In at={s0 + 3}><div style={{display: "flex", alignItems: "center", gap: 20}}>
        <div style={{width: 58, height: 58, background: b.color, border: `2px solid ${P.ink}66`, borderRadius: 8}}/>
        <div style={{fontFamily: COND, fontWeight: 700, fontSize: 74, color: P.ink, lineHeight: 1}}>{b.label}</div>
      </div></In>
      <div style={{display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, columnGap: 30, rowGap: 6, marginTop: 20}}>
        {mem.map((d) => <In key={d.name} at={F(d.at)} dy={12}>
          <div style={{display: "flex", justifyContent: "space-between", borderBottom: `1.5px solid ${P.line}88`, paddingBottom: 4,
            fontFamily: SANS, fontSize: cols === 3 ? 24 : 28, color: P.ink}}>
            <span style={{fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{d.short}</span>
            <span style={{fontFamily: COND, fontWeight: 700, marginLeft: 10}}>{d.label}</span>
          </div></In>)}
      </div>
    </div>;
  } else if (sc === "all") {
    body = <div>
      <In at={s0}><Kicker color={D.accent2}>The pattern</Kicker></In>
      <In at={s0 + 4}><div style={{fontFamily: COND, fontWeight: 700, fontSize: 76, lineHeight: 1.05, color: P.ink}}><Rich text={D.all.line1 ?? ""} acc={D.accent}/></div></In>
      <In at={s0 + 18}><div style={{fontFamily: SANS, fontSize: 32, color: P.mute, marginTop: 16}}>{D.all.line2}</div></In>
    </div>;
  } else if (sc === "top") {
    body = <div>
      <In at={s0}><Kicker color={D.accent2}>{D.topText.kicker}</Kicker></In>
      <In at={s0 + 3}><div style={{fontFamily: COND, fontWeight: 700, fontSize: 60, lineHeight: 1, color: P.ink, marginBottom: 16}}>{D.topText.title}</div></In>
      {D.top.map((n, i) => {
        const d = BY[n]; const a = s0 + 8 + i * 4; const p = ease(f, a, a + 14);
        return <div key={n} style={{display: "flex", alignItems: "center", marginBottom: 9, opacity: ease(f, a, a + 5)}}>
          <div style={{width: 300, fontFamily: SANS, fontWeight: 600, fontSize: 28, color: P.ink, whiteSpace: "nowrap"}}>{i + 1}. {d.short}</div>
          <div style={{flex: 1, height: 42, position: "relative"}}>
            <div style={{position: "absolute", inset: 0, background: "#00000010", borderRadius: 6}}/>
            <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${(d.v / D.max) * 78 * p}%`, background: D.bands[d.bucket].color, borderRadius: 6}}/>
            <div style={{position: "absolute", left: `calc(${(d.v / D.max) * 78 * p}% + 12px)`, top: "50%", transform: "translateY(-50%)",
              fontFamily: COND, fontWeight: 700, fontSize: 32, color: P.ink}}>{p < 1 ? Math.round(d.v * p).toLocaleString("en-IN") : d.label}</div>
          </div>
        </div>;
      })}
    </div>;
  } else if (sc === "insight") {
    body = <div>
      <In at={s0}><Kicker color={D.accent2}>{D.insight.kicker}</Kicker></In>
      <div style={{display: "flex", alignItems: "center", gap: 36}}>
        <In at={s0 + 2}><div style={{fontFamily: COND, fontWeight: 700, fontSize: 190, lineHeight: 0.95, color: D.accent, whiteSpace: "nowrap"}}>{D.insight.big}</div></In>
        <In at={s0 + 14}><div style={{fontFamily: SANS, fontSize: 31, lineHeight: 1.38, color: P.ink}}><Rich text={D.insight.text} acc={D.accent}/></div></In>
      </div>
    </div>;
  } else if (sc === "end") {
    body = <div>
      <In at={s0}><div style={{fontFamily: COND, fontWeight: 700, fontSize: 92, lineHeight: 1.02, color: D.accent}}>{D.end.q}</div></In>
      <In at={s0 + 6}><div style={{fontFamily: SANS, fontSize: 38, color: P.ink, marginTop: 10}}>{D.end.sub}</div></In>
      <In at={s0 + 12}><div style={{fontFamily: SANS, fontSize: 23, lineHeight: 1.4, color: P.mute, marginTop: 22}}>Source: {D.source}</div></In>
    </div>;
  }
  const showLegend = sc === "draw" || isBand || sc === "all";
  return <div style={{position: "absolute", left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, opacity: out}}>
    {body}
    {showLegend && <div style={{position: "absolute", left: 0, right: 0, bottom: 0, opacity: ease(f, F(D.t.draw[0]) + 20, F(D.t.draw[0]) + 32)}}>
      <Legend D={D} active={bi} upto={sc === "draw" ? -1 : bi >= 0 ? bi : 4}/></div>}
  </div>;
};

const Footer: React.FC<{D: MappedData}> = ({D}) => {
  const f = useCurrentFrame();
  const t0 = F(D.t.draw[0]);
  if (f < t0) return null;
  return <div style={{position: "absolute", left: 60, right: 60, top: 1838, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: ease(f, t0, t0 + 12)}}>
    <div style={{fontFamily: SANS, fontSize: 22, color: P.mute}}>{D.nodata.length ? `No data: ${D.nodata.map((n) => n.replace("NCT of ", "")).join(", ")}` : ""}</div>
    <div style={{display: "flex", alignItems: "center", gap: 10}}><Mark size={44}/>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 34, color: P.ink}}>DATA <span style={{color: P.gold}}>KADAI</span></div></div>
  </div>;
};

// Music ducks while the narrator speaks, as in IndiaShort.
const musicVol = (D: MappedData, fr: number) => {
  if (!D.vo?.length) return 1;
  const t = fr / FPS;
  const near = Math.min(...D.vo.map((v) => t < v.at ? v.at - t : t > v.at + v.sec ? t - v.at - v.sec : 0));
  return 0.14 + 0.31 * Math.min(1, near / 0.2);
};

export const IndiaMapped: React.FC<{D: MappedData}> = ({D}) => (
  <AbsoluteFill style={{background: P.bg}}>
    <VoxFonts/>
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${P.bg2} 0%, ${P.bg} 70%)`}}/>
    <MapLayer D={D}/>
    <TitleCard D={D}/>
    <Header D={D}/>
    <Panel D={D}/>
    <Footer D={D}/>
    <Audio src={staticFile(`datayt/mapped/${D.id}/music.wav`)} volume={(fr) => musicVol(D, fr)}/>
    {(D.vo ?? []).map((v) => <Sequence key={v.file} from={F(v.at)}><Audio src={staticFile(`datayt/mapped/${D.id}/${v.file}`)}/></Sequence>)}
  </AbsoluteFill>
);
