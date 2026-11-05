// "Atlas" look (AK, 1 Nov 2026: "Johnny Harrison style" read as Johnny Harris): map first, a guide who walks you in.
// One paper map of India stays on screen; a camera flies into the state the beat is about, a hand-drawn ring and a name
// label mark it, and each number sits on a cut-out paper tag. Captions carry the narration. It takes the built data.json
// of a `fact` or `versus` Short unchanged (same beats, same voice files, same music), so a Short can be rendered in the
// house look or in this one. Nothing here is a Johnny Harris asset: the paper, tape, tags and hand-drawn marks are drawn in code.
import React, {useEffect, useState} from "react";
import {AbsoluteFill, Easing, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame} from "remotion";
import geo from "../../../public/datayt/india/geo.json";
import type {BeatData} from "../../datayt/BeatStory";
import {Mark} from "../../datayt/Brand";
import {StateMap, MAP_RATIO} from "../../datayt/StateMap";
import {COND, VoxFonts} from "../../voxkit";
import {LookAudio} from "../shared/LookAudio";

const W = 1080, H = 1920, FPS = 30;
const SAFE = {x: 50, y: 95, s: 0.78};      // the clear area of a Short, as BeatStory
const HAND = "Virgil, 'Segoe Print', 'Bradley Hand', cursive";
const INK = "#2A2017", PAPER = "#EADFC8", TAG = "#FBF5E3", SAND = "#D9C8A0", MUTE = "#7A6A52", BLUE = "#2F5D8A";
const K = 0.98;      // map units to page pixels at camera scale 1: India fills the page width
const F = (s: number) => Math.round(s * FPS);
const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});

type G = {name: string; d: string; bbox: number[]; lx: number; ly: number};
const GEO = Object.fromEntries((geo.states as G[]).map((g) => [g.name, g]));
type B = Record<string, any>;
type Cam = {cx: number; cy: number; s: number; py: number};
type HL = {name: string; tone: "a" | "b" | "c"};

const union = (names: string[]) => {
  const bs = names.map((n) => GEO[n]?.bbox).filter(Boolean) as number[][];
  if (!bs.length) return null;
  return [Math.min(...bs.map((b) => b[0])), Math.min(...bs.map((b) => b[1])), Math.max(...bs.map((b) => b[2])), Math.max(...bs.map((b) => b[3]))];
};
const fitCam = (names: string[], span: number, py: number): Cam => {
  const u = union(names);
  if (!u) return WIDE;
  return {cx: (u[0] + u[2]) / 2, cy: (u[1] + u[3]) / 2, s: Math.min(6, span / (Math.max(u[2] - u[0], u[3] - u[1], 1) * K)), py};
};
const WIDE: Cam = {cx: 500, cy: 550, s: 1, py: 960};

// The states a beat is about, with the tone of each (a = the story's accent, b = its second colour, c = a third voice).
const highlights = (D: BeatData, b: B): HL[] => {
  const a = D as any;
  if (b.kind === "spot") return b.spots ? b.spots.map((s: any) => ({name: s.geo, tone: s.tone === "b" ? "b" : "a"})) : [{name: b.geo, tone: "a"}];
  if (b.kind === "fact") return [{name: b.geo || b.name, tone: "a"}];
  if (b.kind === "versus") return [{name: a.a.geo, tone: "a"}, {name: a.b.geo, tone: "b"}];
  if (b.kind === "say") {
    const text = (b.lines ?? []).join(" ");
    const hit = Object.keys(GEO).filter((n) => text.includes(n === "NCT of Delhi" ? "Delhi" : n)).sort((x, y) => text.indexOf(x) - text.indexOf(y));
    return hit.slice(0, 2).map((name, i) => ({name, tone: i ? "c" : "a"} as HL));
  }
  return [];
};
const camFor = (D: BeatData, b: B): Cam => {
  const names = highlights(D, b).map((h) => h.name);
  if (b.kind === "spot") return fitCam(names, names.length > 1 ? 560 : 430, 1020);
  if (b.kind === "fact") return fitCam(names, 400, 560);
  if (b.kind === "versus") return fitCam(names, 540, 560);
  if (b.kind === "say") return fitCam(names, names.length > 1 ? 760 : 420, 560);
  return WIDE;
};

const ring = (u: number[], seed: number) => {      // a hand-drawn ellipse that overshoots its start, deterministic
  const cx = (u[0] + u[2]) / 2, cy = (u[1] + u[3]) / 2, rx = (u[2] - u[0]) / 2 * 1.32 + 12, ry = (u[3] - u[1]) / 2 * 1.32 + 12;
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const a = -Math.PI / 2 - 0.2 + (i / 40) * (Math.PI * 2 + 0.55);
    const j = 1 + 0.045 * Math.sin(i * 1.7 + seed) + 0.03 * Math.cos(i * 2.9 + seed * 1.3) + (i / 40) * 0.06;
    pts.push(`${i ? "L" : "M"}${(cx + Math.cos(a) * rx * j).toFixed(1)},${(cy + Math.sin(a) * ry * j).toFixed(1)}`);
  }
  return {d: pts.join(""), rx, ry, cx, cy};
};

const Rich: React.FC<{t: string; acc: string; hl?: boolean}> = ({t, acc, hl}) => <>{t.split("*").map((s, i) => i % 2
  ? <span key={i} style={{color: acc, ...(hl ? {background: "linear-gradient(transparent 52%, rgba(243,217,107,.8) 52%)"} : {})}}>{s}</span>
  : <span key={i}>{s}</span>)}</>;

const jag = (() => {      // the torn bottom edge of a paper tag
  const pts = ["0% 0%", "100% 0%"];
  for (let i = 0; i <= 24; i++) pts.push(`${100 - i * (100 / 24)}% ${i % 2 ? 98.2 : 100}%`);
  return `polygon(${pts.join(",")})`;
})();
const tagStyle = (x: number, y: number, w: number, h: number, rot: number, p: number): React.CSSProperties => ({
  position: "absolute", left: x, top: y, width: w, height: h, background: TAG, clipPath: jag, transform: `rotate(${rot}deg) translateY(${(1 - p) * 60}px)`,
  opacity: p, boxShadow: "0 10px 26px rgba(42,32,23,.28)", padding: "26px 34px", boxSizing: "border-box"});

const useFonts = () => {
  const [h] = useState(() => delayRender("atlas fonts"));
  useEffect(() => {
    Promise.all([document.fonts.load("40px Virgil"), document.fonts.load("700 40px Oswald")]).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
};

const Tape: React.FC<{x: number; y: number; w: number; rot: number; children: React.ReactNode; size?: number}> = ({x, y, w, rot, children, size = 34}) => (
  <div style={{position: "absolute", left: x, top: y, width: w, transform: `rotate(${rot}deg)`, background: "rgba(236,214,150,.92)", padding: "8px 18px",
    fontFamily: COND, fontWeight: 700, fontSize: size, letterSpacing: 1.5, color: INK, boxShadow: "0 3px 8px rgba(42,32,23,.2)", textAlign: "center"}}>{children}</div>
);

// ------------------------------------------------------------------------------------------------------------------ beats
const toneColor = (D: BeatData, t: HL["tone"]) => t === "a" ? D.accent : t === "b" ? D.accent2 : BLUE;

const SpotText: React.FC<{D: BeatData; b: B; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  return <div style={{position: "absolute", left: 60, right: 60, top: 230}}>
    {(b.lines as string[]).map((ln, i) => <div key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: i === 2 ? 70 : 98, lineHeight: 1.06, color: INK,
      opacity: ease(f, f0 + 4 + i * 5, f0 + 12 + i * 5), transform: `translateY(${(1 - ease(f, f0 + 4 + i * 5, f0 + 14 + i * 5)) * 26}px)`}}><Rich t={ln} acc={D.accent}/></div>)}
  </div>;
};

const FactTag: React.FC<{D: BeatData; b: B; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - f0 - 6, fps: FPS, config: {damping: 14, stiffness: 120}});
  const big = spring({frame: f - f0 - 16, fps: FPS, config: {damping: 9, stiffness: 160}});
  const bars = (b.bars ?? []) as {name: string; label: string; frac: number}[];
  return <div style={tagStyle(60, 930, 960, 690, -0.7, Math.min(1, p))}>
    <div style={{fontFamily: HAND, fontSize: 34, color: D.accent2, letterSpacing: 1}}>{b.kicker}</div>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: 228, lineHeight: 1.0, color: D.accent, opacity: Math.min(1, big), transform: `scale(${0.7 + 0.3 * Math.min(1.15, big)})`, transformOrigin: "0 60%"}}>{b.big}</div>
    <div style={{fontFamily: HAND, fontSize: 40, lineHeight: 1.28, color: INK, marginTop: 4}}>{b.text}</div>
    <div style={{marginTop: 18}}>
      {bars.map((r, i) => <div key={r.name} style={{display: "flex", alignItems: "center", gap: 18, marginTop: 10}}>
        <div style={{fontFamily: HAND, fontSize: 32, width: 250, color: INK}}>{r.name}</div>
        <div style={{width: 470, height: 22, background: "rgba(42,32,23,.1)", borderRadius: 11, position: "relative"}}>
          <div style={{position: "absolute", left: 0, top: 0, height: 22, borderRadius: 11, width: 470 * r.frac * ease(f, f0 + 18 + i * 4, f0 + 34 + i * 4), background: i ? "#9C8A6A" : D.accent}}/></div>
        <div style={{fontFamily: COND, fontWeight: 700, fontSize: 38, color: i ? MUTE : D.accent}}>{r.label}</div>
      </div>)}
    </div>
    <div style={{fontFamily: HAND, fontSize: 25, lineHeight: 1.3, color: MUTE, marginTop: 16, opacity: ease(f, f0 + 26, f0 + 36)}}>{b.sub}</div>
  </div>;
};

const VersusTags: React.FC<{D: BeatData; b: B; f0: number; n: number}> = ({D, b, f0, n}) => {
  const f = useCurrentFrame(), a = D as any;
  const p = spring({frame: f - f0 - 6, fps: FPS, config: {damping: 14, stiffness: 120}});
  const side = (who: "a" | "b", x: number, rot: number, d: number) => {
    const won = b.win === who, col = who === "a" ? D.accent : D.accent2;
    const big = spring({frame: f - f0 - 14 - d, fps: FPS, config: {damping: 9, stiffness: 160}});
    return <div style={tagStyle(x, 1050, 470, 470, rot, Math.min(1, p))}>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 60, color: col, lineHeight: 1.05}}>{a[who].name}</div>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 146, lineHeight: 1.1, color: INK, opacity: Math.min(1, big), transform: `scale(${0.7 + 0.3 * Math.min(1.15, big)})`, transformOrigin: "0 60%"}}>{b[who]}</div>
      {won && <div style={{position: "absolute", right: 24, bottom: 54, fontFamily: COND, fontWeight: 700, fontSize: 52, letterSpacing: 3, color: col, border: `5px solid ${col}`, borderRadius: 10,
        padding: "2px 14px", transform: `rotate(-9deg) scale(${0.6 + 0.4 * ease(f, f0 + 26, f0 + 34)})`, opacity: ease(f, f0 + 26, f0 + 32)}}>AHEAD</div>}
      <div style={{position: "absolute", left: 34, bottom: 54, display: "flex", gap: 10}}>
        {Array.from({length: n}).map((_, i) => <div key={i} style={{width: 24, height: 24, borderRadius: 12, background: i < (who === "a" ? b.sa : b.sb) ? col : "rgba(42,32,23,.14)"}}/>)}</div>
    </div>;
  };
  return <>
    <div style={{position: "absolute", left: 60, right: 60, top: 898, textAlign: "center", fontFamily: COND, fontWeight: 700, fontSize: 62, color: INK, opacity: ease(f, f0 + 2, f0 + 10)}}>{b.label}</div>
    <div style={{position: "absolute", left: 60, right: 60, top: 990, textAlign: "center", fontFamily: HAND, fontSize: 26, color: MUTE, opacity: ease(f, f0 + 4, f0 + 12)}}>{b.note}</div>
    {side("a", 52, -1.1, 0)}{side("b", 558, 0.9, 5)}
  </>;
};

const Notepad: React.FC<{D: BeatData; b: B; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const p = spring({frame: f - f0 - 4, fps: FPS, config: {damping: 14, stiffness: 110}});
  return <div style={{...tagStyle(70, 980, 940, 600, 0.8, Math.min(1, p)), padding: "36px 46px", clipPath: "none",
    backgroundImage: "repeating-linear-gradient(transparent 0 85px, rgba(47,93,138,.28) 85px 87px)", backgroundPosition: "0 38px"}}>
    {(b.lines as string[]).map((ln, i) => <div key={i} style={{fontFamily: HAND, fontSize: 49, lineHeight: "87px", color: INK, opacity: ease(f, f0 + 8 + i * 9, f0 + 16 + i * 9)}}><Rich t={ln} acc={D.accent} hl/></div>)}
  </div>;
};

const MapPage: React.FC<{D: BeatData; b: B; f0: number}> = ({D, b, f0}) => {
  const f = useCurrentFrame();
  const end = b.kind === "mapend", h = 1000, w = h * MAP_RATIO;
  const pal = {ink: "#4A3826", bg: PAPER, empty: SAND, light: TAG};
  const rg = Object.fromEntries((b.ring ?? []).map((n: string) => [n, INK]));
  const txt = (end ? b.q : b.title) as string;
  return <AbsoluteFill>
    <div style={{position: "absolute", left: 60, right: 60, top: 120, fontFamily: COND, fontWeight: 700, fontSize: end ? 86 : 68, lineHeight: 1.05, color: INK, whiteSpace: "nowrap"}}><Rich t={txt} acc={D.accent}/></div>
    <div style={{position: "absolute", left: 60, right: 60, top: end ? 232 : 214, fontFamily: HAND, fontSize: end ? 42 : 34, color: end ? D.accent2 : MUTE}}>{b.sub}</div>
    <div style={{opacity: end ? 1 : ease(f, f0, f0 + 8)}}>
      <StateMap states={D.map ?? []} colors={D.bands} x={(W - w) / 2} y={end ? 400 : 380} h={end ? 940 : h} fs={24} frame={b.anim ? f : null} t0={f0} fps={FPS} ring={rg} pal={pal} font={COND}/></div>
    {b.note && <div style={{position: "absolute", left: 60, right: 60, top: 1440, fontFamily: HAND, fontSize: 27, lineHeight: 1.3, color: INK, opacity: end ? 1 : ease(f, f0 + 90, f0 + 104)}}>{b.note}</div>}
    {end && <div style={{position: "absolute", left: 60, right: 330, top: 1600, fontFamily: HAND, fontSize: 19, lineHeight: 1.35, color: MUTE}}>Source: {D.source}</div>}
  </AbsoluteFill>;
};

// ------------------------------------------------------------------------------------------------------------------ story
export const AtlasStory: React.FC<{D: BeatData}> = ({D}) => {
  useFonts();
  const f = useCurrentFrame();
  const beats = D.beats as B[];
  const idx = Math.max(0, beats.findIndex((b) => f < F(b.t1)) === -1 ? beats.length - 1 : beats.findIndex((b) => f < F(b.t1)));
  const b = beats[idx], f0 = F(b.t0);
  const keys = beats.map((x) => camFor(D, x));
  const from = idx ? keys[idx - 1] : WIDE, to = keys[idx];
  const p = interpolate(f, [f0, f0 + (idx ? 26 : 34)], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic)});
  const cam: Cam = {cx: from.cx + (to.cx - from.cx) * p, cy: from.cy + (to.cy - from.cy) * p, py: from.py + (to.py - from.py) * p,
    s: Math.exp(Math.log(from.s) + (Math.log(to.s) - Math.log(from.s)) * p)};
  const sp = (x: number, y: number) => ({x: W / 2 + K * cam.s * (x - cam.cx), y: cam.py + K * cam.s * (y - cam.cy)});
  const isMap = b.kind === "map" || b.kind === "mapend";
  const mapIdx = beats.findIndex((x) => x.kind === "map");
  const mapOp = mapIdx > -1 ? 1 - ease(f, F(beats[mapIdx].t0), F(beats[mapIdx].t0) + 10) : 1;
  const hl = isMap ? [] : highlights(D, b);
  const nRounds = beats.filter((x) => x.kind === "versus").length;
  const k = K * cam.s;
  const grid: React.ReactNode[] = [];
  for (let g = -200; g <= 1200; g += 100) {
    grid.push(<line key={`v${g}`} x1={g} y1={-300} x2={g} y2={1500} stroke={INK} strokeOpacity={0.07} strokeWidth={1} vectorEffect="non-scaling-stroke" strokeDasharray="6 8"/>);
    grid.push(<line key={`h${g}`} x1={-300} y1={g} x2={1300} y2={g} stroke={INK} strokeOpacity={0.07} strokeWidth={1} vectorEffect="non-scaling-stroke" strokeDasharray="6 8"/>);
  }
  const cap = (b.vo ?? "") as string;
  return <AbsoluteFill style={{background: PAPER}}>
    <VoxFonts/><style>{`@font-face{font-family:Virgil;src:url(${staticFile("fonts/Virgil-Regular.woff2")}) format("woff2");}`}</style>
    <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 40%, rgba(255,250,235,.7), rgba(150,120,70,.28) 100%)"}}/>
    <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, opacity: 0.5, mixBlendMode: "multiply"}}>
      <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.27  0 0 0 0 0.15  0 0 0 0.35 0"/></filter>
      <rect width={W} height={H} filter="url(#paper)"/></svg>
    <div style={{position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${SAFE.x}px, ${SAFE.y}px) scale(${SAFE.s})`}}>
      {!isMap || mapOp > 0 ? <div style={{opacity: mapOp}}>
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <g transform={`translate(${W / 2},${cam.py}) scale(${k}) translate(${-cam.cx},${-cam.cy})`}>
            {grid}
            {(geo.states as G[]).map((g) => <path key={g.name} d={g.d} fill={SAND} stroke="#5B4630" strokeWidth={1.3} vectorEffect="non-scaling-stroke" strokeLinejoin="round" fillRule="evenodd"/>)}
            {hl.map((h) => <g key={h.name}>
              <path d={GEO[h.name].d} fill="rgba(42,32,23,.3)" transform="translate(7,9)" fillRule="evenodd"/>
              <path d={GEO[h.name].d} fill={toneColor(D, h.tone)} stroke={INK} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" fillRule="evenodd"/></g>)}
            {hl.map((h, i) => {
              const r = ring(GEO[h.name].bbox, i * 2.1 + idx);
              return <path key={`r${h.name}`} d={r.d} fill="none" stroke={toneColor(D, h.tone)} strokeWidth={8} vectorEffect="non-scaling-stroke" strokeLinecap="round"
                pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(f, f0 + 10 + i * 6, f0 + 34 + i * 6)}/>;
            })}
          </g>
        </svg>
        {hl.map((h, i) => {   // the guide's name label, above the first state and below the second
          const u = GEO[h.name].bbox, r = ring(u, 0), c = sp(r.cx, r.cy), up = i === 0;
          const y = up ? c.y - r.ry * k - 78 : c.y + r.ry * k + 14;
          if (b.kind === "versus" || b.kind === "fact" && false) return null;
          return <div key={`l${h.name}`} style={{position: "absolute", left: c.x - 240, width: 480, top: y, textAlign: "center", fontFamily: HAND, fontSize: 52, color: INK,
            opacity: ease(f, f0 + 22 + i * 6, f0 + 32 + i * 6), transform: `rotate(${up ? -2 : 1.5}deg)`}}>{GEO[h.name].name === "NCT of Delhi" ? "Delhi" : h.name}</div>;
        })}
      </div> : null}
      {!isMap && <Tape x={60} y={96} w={420} rot={-2.2} size={30}>{D.chip}</Tape>}
      {!isMap && <div style={{position: "absolute", left: 510, top: 104, fontFamily: HAND, fontSize: 27, color: MUTE}}>{D.sourceShort}</div>}
      {b.kind === "spot" && <SpotText D={D} b={b} f0={f0}/>}
      {b.kind === "fact" && <FactTag D={D} b={b} f0={f0}/>}
      {b.kind === "versus" && <VersusTags D={D} b={b} f0={f0} n={nRounds}/>}
      {b.kind === "say" && <Notepad D={D} b={b} f0={f0}/>}
      {isMap && <MapPage D={D} b={b} f0={f0}/>}
      {cap && !isMap && <div style={{position: "absolute", left: 60, right: 60, top: 1668, display: "flex", justifyContent: "center", opacity: ease(f, f0 + 6, f0 + 14)}}>
        <div style={{background: "rgba(42,32,23,.92)", color: TAG, fontFamily: HAND, fontSize: 40, lineHeight: 1.25, padding: "12px 26px", borderRadius: 12, textAlign: "center"}}>{cap}</div></div>}
      <div style={{position: "absolute", left: 60, top: 1832, display: "flex", alignItems: "center", gap: 12}}>
        <Mark size={52} c={INK} h={D.accent}/><div style={{fontFamily: COND, fontWeight: 700, fontSize: 40, letterSpacing: 2, color: INK}}>DATA <span style={{color: D.accent}}>KADAI</span></div></div>
    </div>
    <LookAudio L={{D, id: D.id} as any}/>
  </AbsoluteFill>;
};
