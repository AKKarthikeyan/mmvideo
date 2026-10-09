// NFHS-6 "Alcohol use among men in Tamil Nadu": animated district choropleth, 16:9 long and 9:16 Short.
// Geometry: public/tnmap/geo.json (scripts/tn_alcohol_geo.py). Values, buckets, timeline: public/tnmap/data.json
// (scripts/tn_alcohol_build.py, which also writes the synced sound bed public/tnmap/bed.wav).
import React from "react";
import {AbsoluteFill, Audio, Composition, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {C, COND, VoxFonts} from "../voxkit";
import geo from "../../public/tnmap/geo.json";
import data from "../../public/tnmap/data.json";

const FPS = data.fps;
const TOTAL = Math.ceil(data.total * FPS);
const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
const BG = "#EFE7D6", EMPTY = "#DDD4C2", EDGE = "#3B3027", INK = C.ink;
const BRAND = "Moat & Margin";

type D = {name: string; v: number; label: string; bucket: number; at: number; nudge: number[]};
type G = {name: string; d: string; lx: number; ly: number; r: number};
const DS = data.districts as D[];
const GEO = Object.fromEntries((geo.districts as G[]).map((g) => [g.name, g]));
const BY = Object.fromEntries(DS.map((d) => [d.name, d]));
const T = data.t as Record<string, [number, number]>;
const F = (s: number) => Math.round(s * FPS);
const sceneAt = (f: number) => Object.keys(T).find((k) => f >= F(T[k][0]) && f < F(T[k][1])) ?? "end";
const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
const mix = (a: string, b: string, p: number) => {
  const h = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16);
  return "#" + [0, 1, 2].map((i) => Math.round(h(a, i) + (h(b, i) - h(a, i)) * p).toString(16).padStart(2, "0")).join("");
};

const useL = () => {
  const {width: W, height: H} = useVideoConfig();
  const land = W > H;
  // map box (screen px) and side/bottom panel
  const mh = land ? 1000 : 1010;
  const s = mh / geo.h;
  const mw = geo.w * s;
  const mx = land ? 70 : (W - mw) / 2, my = land ? 40 : 250;
  const panel = land ? {x: 930, y: 90, w: 920, h: 900} : {x: 70, y: 1290, w: 940, h: 560};
  return {W, H, land, s, mx, my, mw, mh, panel};
};

// ---------------- map ----------------
const MapLayer: React.FC = () => {
  const f = useCurrentFrame();
  const L = useL();
  const sc = sceneAt(f);
  const t0 = F(T.draw[0]);
  const focus: string[] | null =
    sc === "top" ? data.top : sc === "bottom" ? data.bottom : sc === "gap" ? [data.hi, data.lo] : null;
  const focusP = focus ? ease(f, F(T[sc][0]), F(T[sc][0]) + 18) : 0;
  const title = f < t0;
  const mapOp = title ? ease(f, 20, 70, 0, 0.16) : sc === "end" ? ease(f, F(T.end[0]), F(T.end[0]) + 20, 1, 0.22) : 1;
  const zoom = 1 + 0.015 * Math.sin((f / TOTAL) * Math.PI);
  const ordered = [...DS].sort((a, b) => GEO[a.name].ly - GEO[b.name].ly);

  const labels: {d: D; mode: "pill" | "value"; op: number}[] = [];
  for (const d of DS) {
    const at = F(d.at);
    const bk = `b${d.bucket}`;
    if (sc === bk) labels.push({d, mode: "pill", op: ease(f, at, at + 8) * ease(f, F(T[bk][1]) - 8, F(T[bk][1]), 1, 0)});
    if (sc === "all") labels.push({d, mode: "value", op: ease(f, F(T.all[0]) + d.bucket * 4, F(T.all[0]) + d.bucket * 4 + 10)});
    if (focus && focus.includes(d.name) && sc !== "end") labels.push({d, mode: "pill", op: ease(f, F(T[sc][0]) + 6 + focus.indexOf(d.name) * 5, F(T[sc][0]) + 18 + focus.indexOf(d.name) * 5)});
  }

  return (
    <svg width={L.W} height={L.H} style={{position: "absolute", left: 0, top: 0, opacity: mapOp}}>
      <defs>
        <filter id="mshadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="9" floodColor="#5a4630" floodOpacity="0.25"/>
        </filter>
      </defs>
      <g transform={`translate(${L.mx + L.mw / 2},${L.my + L.mh / 2}) scale(${L.s * zoom}) translate(${-geo.w / 2},${-geo.h / 2})`}>
        <g filter="url(#mshadow)">
          {ordered.map((d, i) => {
            const g = GEO[d.name];
            const dStart = t0 + 4 + i * 2;
            const draw = title ? 1 : ease(f, dStart, dStart + 26);
            const base = ease(f, dStart + 20, dStart + 34);
            const fillP = ease(f, F(d.at), F(d.at) + 10);
            const col = mix(EMPTY, data.buckets[d.bucket].color, fillP);
            const pop = spring({frame: f - F(d.at), fps: FPS, config: {damping: 12, stiffness: 180}, durationInFrames: 14});
            const lift = fillP > 0 && fillP < 1 ? 1 : 0;
            const dim = focus && !focus.includes(d.name) ? 1 - 0.7 * focusP : 1;
            const sc2 = 1 + 0.06 * Math.sin(pop * Math.PI) * (f >= F(d.at) ? 1 : 0);
            return (
              <g key={d.name} opacity={dim}
                 transform={`translate(${g.lx},${g.ly}) scale(${sc2}) translate(${-g.lx},${-g.ly})`}>
                <path d={g.d} fillRule="evenodd" fill={title ? EMPTY : col} fillOpacity={title ? 1 : base}
                      stroke={EDGE} strokeWidth={lift ? 2.2 : 1.3} strokeLinejoin="round"
                      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw}/>
              </g>
            );
          })}
        </g>
        {labels.map(({d, mode, op}) => <Label key={d.name + mode} d={d} mode={mode} op={op} s={L.s}/>)}
      </g>
    </svg>
  );
};

const Label: React.FC<{d: D; mode: "pill" | "value"; op: number; s: number}> = ({d, mode, op, s}) => {
  if (op <= 0.001) return null;
  const g = GEO[d.name];
  // value-only labels sit inside their district unless it is too small (big nudges only)
  const [nx, ny] = mode === "value" && Math.hypot(d.nudge[0], d.nudge[1]) < 40 ? [0, 0] : d.nudge;
  const x = g.lx + nx, y = g.ly + ny;
  const k = 1 / s; // screen px -> map units
  const dark = d.bucket >= 3;
  if (mode === "value") {
    const fs = 21 * k;
    return <g opacity={op}>
      {(nx || ny) ? <line x1={g.lx} y1={g.ly} x2={x} y2={y} stroke={INK} strokeWidth={1.2 * k} opacity={0.6}/> : null}
      <text x={x} y={y + fs * 0.35} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={fs}
            fill={dark && !(nx || ny) ? "#fff" : INK} stroke={dark && !(nx || ny) ? "none" : BG} strokeWidth={4 * k} paintOrder="stroke">{d.label}</text>
    </g>;
  }
  const nfs = 19 * k, vfs = 26 * k;
  const w = Math.max(d.name.length * nfs * 0.56, d.label.length * vfs * 0.5) + 22 * k, h = 62 * k;
  const pop = 0.85 + 0.15 * op;
  return <g opacity={op} transform={`translate(${x},${y}) scale(${pop})`}>
    {(nx || ny) ? <line x1={-nx} y1={-ny} x2={0} y2={0} stroke={INK} strokeWidth={1.5 * k}/> : null}
    {(nx || ny) ? <circle cx={-nx} cy={-ny} r={3.5 * k} fill={INK}/> : null}
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={9 * k} fill="#FFFDF8" stroke={INK} strokeOpacity={0.25}
          strokeWidth={1.2 * k} style={{filter: "drop-shadow(0 2px 3px rgba(0,0,0,.18))"}}/>
    <text x={0} y={-h / 2 + 22 * k} textAnchor="middle" fontFamily={SANS} fontWeight={600} fontSize={nfs} fill="#3a3a3a">{d.name}</text>
    <text x={0} y={h / 2 - 10 * k} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={vfs} fill={data.buckets[d.bucket].color === "#FBF1DC" ? INK : mix(data.buckets[d.bucket].color, "#000000", 0.15)}>{d.label}</text>
  </g>;
};

// ---------------- panel ----------------
const Kicker: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = C.red}) =>
  <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 24, letterSpacing: 4, color, textTransform: "uppercase", marginBottom: 14}}>{children}</div>;

const In: React.FC<{at: number; children: React.ReactNode; dy?: number; style?: React.CSSProperties}> = ({at, children, dy = 24, style}) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 14);
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * dy}px)`, ...style}}>{children}</div>;
};

const Legend: React.FC<{active?: number; upto?: number}> = ({active = -1, upto = 4}) => {
  const L = useL();
  return <div style={{display: "flex", gap: L.land ? 10 : 8, flexWrap: "nowrap"}}>
    {data.buckets.map((b, i) => (
      <div key={i} style={{flex: 1, opacity: i > upto ? 0.25 : active < 0 || active === i ? 1 : 0.45,
        transform: active === i ? "translateY(-4px)" : "none"}}>
        <div style={{height: active === i ? 22 : 16, background: b.color, border: `1.5px solid ${EDGE}`, borderRadius: 3}}/>
        <div style={{fontFamily: SANS, fontSize: L.land ? 17 : 16, fontWeight: active === i ? 700 : 500, color: INK, marginTop: 6, whiteSpace: "nowrap"}}>{b.label}</div>
      </div>
    ))}
  </div>;
};

const Bars: React.FC<{names: string[]; start: number; title: string; sub: string; kicker: string}> = ({names, start, title, sub, kicker}) => {
  const f = useCurrentFrame();
  const L = useL();
  const max = 40;
  return <div>
    <In at={start}><Kicker>{kicker}</Kicker></In>
    <In at={start + 3}><div style={{fontFamily: COND, fontWeight: 700, fontSize: L.land ? 76 : 64, lineHeight: 1.02, color: INK}}>{title}</div></In>
    <In at={start + 8}><div style={{fontFamily: SANS, fontSize: L.land ? 28 : 26, color: "#4a4a4a", margin: "14px 0 30px"}}>{sub}</div></In>
    {names.map((n, i) => {
      const d = BY[n];
      const a = start + 14 + i * 6;
      const p = ease(f, a, a + 22);
      return <div key={n} style={{display: "flex", alignItems: "center", marginBottom: L.land ? 18 : 12, opacity: ease(f, a, a + 8)}}>
        <div style={{width: L.land ? 250 : 240, fontFamily: SANS, fontWeight: 600, fontSize: L.land ? 28 : 26, color: INK}}>{i + 1}. {n}</div>
        <div style={{flex: 1, height: L.land ? 46 : 40, position: "relative"}}>
          <div style={{position: "absolute", inset: 0, background: "#00000010", borderRadius: 4}}/>
          <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${(d.v / max) * 100 * p}%`,
            background: data.buckets[d.bucket].color, border: `1.5px solid ${EDGE}`, borderRadius: 4}}/>
          <div style={{position: "absolute", left: `calc(${(d.v / max) * 100 * p}% + 12px)`, top: "50%", transform: "translateY(-50%)",
            fontFamily: COND, fontWeight: 700, fontSize: L.land ? 34 : 30, color: INK}}>
            {d.label.endsWith("+") ? (p < 1 ? `${(d.v * p).toFixed(0)}%` : d.label) : `${(d.v * p).toFixed(1)}%`}</div>
        </div>
      </div>;
    })}
  </div>;
};

const Panel: React.FC = () => {
  const f = useCurrentFrame();
  const L = useL();
  const sc = sceneAt(f);
  if (sc === "title") return null;
  const s0 = F(T[sc][0]), s1 = F(T[sc][1]);
  const out = sc === "end" ? 1 : ease(f, s1 - 10, s1, 1, 0);
  const big = L.land ? 92 : 72;
  let body: React.ReactNode = null;

  if (sc === "draw") {
    body = <div>
      <In at={s0 + 6}><Kicker>NFHS-6 · Tamil Nadu</Kicker></In>
      <In at={s0 + 10}><div style={{fontFamily: COND, fontWeight: 700, fontSize: L.land ? 120 : 92, lineHeight: 1, color: INK}}>38 districts.</div></In>
      <In at={s0 + 30}><div style={{fontFamily: SANS, fontSize: L.land ? 34 : 30, lineHeight: 1.35, color: "#3a3a3a", marginTop: 22, maxWidth: 820}}>
        Each one coloured by the share of men who drink alcohol, from the latest National Family Health Survey.</div></In>
    </div>;
  } else if (/^b\d$/.test(sc)) {
    const i = parseInt(sc.slice(1), 10);
    const b = data.buckets[i];
    const mem = DS.filter((d) => d.bucket === i);
    const cols = L.land ? (mem.length > 5 ? 2 : 1) : 3;
    body = <div>
      <In at={s0}><Kicker color={INK}>Band {i + 1} of 5 · {b.count} districts</Kicker></In>
      <In at={s0 + 3}><div style={{display: "flex", alignItems: "center", gap: 22}}>
        <div style={{width: 64, height: 64, background: b.color, border: `2px solid ${EDGE}`, borderRadius: 8}}/>
        <div style={{fontFamily: COND, fontWeight: 700, fontSize: big, color: INK, lineHeight: 1}}>{b.label}</div>
      </div></In>
      <div style={{display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, columnGap: 40, rowGap: L.land ? 14 : 8, marginTop: L.land ? 40 : 26}}>
        {mem.map((d) => <In key={d.name} at={F(d.at)} dy={14}>
          <div style={{display: "flex", justifyContent: "space-between", borderBottom: "1.5px solid #00000022", paddingBottom: 6,
            fontFamily: SANS, fontSize: L.land ? 28 : 23, color: INK}}>
            <span style={{fontWeight: 500}}>{d.name}</span><span style={{fontFamily: COND, fontWeight: 700}}>{d.label}</span>
          </div></In>)}
      </div>
    </div>;
  } else if (sc === "all") {
    body = <div>
      <In at={s0}><Kicker>The pattern</Kicker></In>
      <In at={s0 + 4}><div style={{fontFamily: COND, fontWeight: 700, fontSize: big, lineHeight: 1.05, color: INK}}>
        Darkest in the north and the <span style={{color: "#6B1E35"}}>delta coast</span>.</div></In>
      <In at={s0 + 40}><div style={{fontFamily: COND, fontWeight: 700, fontSize: big * 0.8, lineHeight: 1.05, color: "#9a8a6a", marginTop: 26}}>
        Palest in Chennai and the deep south.</div></In>
    </div>;
  } else if (sc === "top") {
    body = <Bars names={data.top} start={s0} kicker="Highest" title="Top 5 districts" sub="Share of men who drink alcohol"/>;
  } else if (sc === "bottom") {
    body = <Bars names={data.bottom} start={s0} kicker="Lowest" title="Bottom 5 districts" sub="Share of men who drink alcohol"/>;
  } else if (sc === "gap") {
    const hi = BY[data.hi], lo = BY[data.lo];
    const n = ease(f, s0 + 20, s0 + 50, 1, data.ratio);
    body = <div>
      <In at={s0}><Kicker>The gap</Kicker></In>
      <In at={s0 + 10}><div style={{fontFamily: COND, fontWeight: 700, fontSize: L.land ? 260 : 200, lineHeight: 0.9, color: "#6B1E35"}}>
        {data.approx ? "~" : ""}{n.toFixed(1)}×</div></In>
      <In at={s0 + 34}><div style={{fontFamily: SANS, fontSize: L.land ? 34 : 29, lineHeight: 1.4, color: INK, marginTop: 18, maxWidth: 840}}>
        A man in <b>{hi.name}</b> ({hi.label}) is about twice as likely to drink as a man in <b>{lo.name}</b> ({lo.label}).</div></In>
    </div>;
  } else if (sc === "end") {
    body = <div>
      <In at={s0}><Kicker>Source</Kicker></In>
      <In at={s0 + 4}><div style={{fontFamily: SANS, fontSize: L.land ? 32 : 28, lineHeight: 1.45, color: INK, maxWidth: 840}}>
        National Family Health Survey (NFHS-6), Tamil Nadu district estimates: men who consume alcohol.
        {data.approx ? " Thiruvarur shown as 32%+ (exact figure pending)." : ""}</div></In>
      <In at={s0 + 12}><div style={{fontFamily: SANS, fontSize: L.land ? 22 : 20, color: "#6a6a6a", marginTop: 18}}>
        District boundaries: 38 districts, datta07/INDIAN-SHAPEFILES.</div></In>
      <In at={s0 + 24}><div style={{fontFamily: COND, fontWeight: 700, fontSize: L.land ? 64 : 56, color: C.red, marginTop: 44}}>Which district surprised you?</div>
        <div style={{fontFamily: SANS, fontSize: L.land ? 28 : 26, color: INK, marginTop: 8}}>Tell us in the comments.</div></In>
    </div>;
  }

  const showLegend = sc !== "end" && sc !== "top" && sc !== "bottom" && sc !== "gap";
  const active = /^b\d$/.test(sc) ? parseInt(sc.slice(1), 10) : -1;
  const upto = sc === "draw" ? -1 : active >= 0 ? active : 4;
  return <div style={{position: "absolute", left: L.panel.x, top: L.panel.y, width: L.panel.w, height: L.panel.h, opacity: out,
    display: "flex", flexDirection: "column", justifyContent: L.land ? "center" : "flex-start"}}>
    {body}
    {showLegend && <div style={{position: L.land ? "absolute" : "relative", bottom: L.land ? 10 : undefined, left: 0, right: 0, marginTop: L.land ? 0 : 30,
      opacity: ease(f, F(T.draw[0]) + 40, F(T.draw[0]) + 60)}}><Legend active={active} upto={upto}/></div>}
  </div>;
};

const Title: React.FC = () => {
  const f = useCurrentFrame();
  const L = useL();
  const e = F(T.title[1]);
  if (f >= e) return null;
  const out = ease(f, e - 10, e, 1, 0);
  return <AbsoluteFill style={{justifyContent: "center", padding: L.land ? "0 140px" : "0 80px", opacity: out}}>
    <In at={4}><Kicker>NFHS-6 · District by district</Kicker></In>
    <In at={10}><div style={{fontFamily: COND, fontWeight: 700, fontSize: L.land ? 150 : 128, lineHeight: 0.98, color: INK, maxWidth: 1400}}>
      How many men drink in <span style={{color: "#6B1E35"}}>Tamil Nadu</span>?</div></In>
    <In at={34}><div style={{fontFamily: SANS, fontSize: L.land ? 38 : 34, color: "#3a3a3a", marginTop: 30}}>Every district, mapped. The answer ranges from 16% to over 32%.</div></In>
  </AbsoluteFill>;
};

const Chrome: React.FC = () => {
  const L = useL();
  const f = useCurrentFrame();
  const op = ease(f, F(T.draw[0]), F(T.draw[0]) + 20);
  return <>
    <div style={{position: "absolute", left: L.land ? L.panel.x : 70, top: L.land ? 40 : 90, fontFamily: SANS, fontWeight: 700, fontSize: L.land ? 22 : 30,
      letterSpacing: 3, color: INK, opacity: 0.55 * op, textTransform: "uppercase"}}>Alcohol use among men · Tamil Nadu</div>
    <div style={{position: "absolute", right: 60, bottom: L.land ? 34 : 60, fontFamily: SANS, fontSize: L.land ? 20 : 24, color: INK, opacity: 0.5}}>
      Source: NFHS-6 · {BRAND}</div>
  </>;
};

const Progress: React.FC = () => {
  const f = useCurrentFrame();
  const {width} = useVideoConfig();
  return <div style={{position: "absolute", left: 0, bottom: 0, height: 6, width: width * (f / TOTAL), background: "#6B1E35", opacity: 0.8}}/>;
};

export const TnAlcohol: React.FC = () => (
  <AbsoluteFill style={{background: BG}}>
    <VoxFonts/>
    <AbsoluteFill style={{background: "radial-gradient(ellipse at 35% 45%, #F7F1E4 0%, #EFE7D6 55%, #E4D9C3 100%)"}}/>
    <MapLayer/>
    <Title/>
    <Panel/>
    <Chrome/>
    <Progress/>
    <Audio src={staticFile("tnmap/bed.wav")} volume={0.9}/>
  </AbsoluteFill>
);

export const TnAlcoholCompositions: React.FC = () => <>
  <Composition id="TN-alcohol" component={TnAlcohol} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080}/>
  <Composition id="TN-alcohol-short" component={TnAlcohol} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920}/>
</>;
