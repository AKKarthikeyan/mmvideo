// Night lights from space, one Short per state: NASA Black Marble annual composites (VNP46A4), 2012 vs 2025.
// Frames and numbers: public/datayt/nightlights/ (research/2026-11-04/nightlights/nl_states.py + nl_export.py).
// Method follows RBI Bulletin, 23 Oct 2026 (Ghosh, Singh, Kuruganti): all-angle snow-free radiance, poor-quality
// pixels out, sum of light over the state boundary. Content sits in SAFE like every beat Short.
import React from "react";
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {COND, VoxFonts} from "../voxkit";
import {StateMap, MapState} from "./StateMap";
import {SAFE} from "./BeatStory";
import NL from "../../public/datayt/nightlights/data.json";
import VOJ from "../../public/datayt/nightlights/vo.json";

const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
const W = 1080, H = 1920, FPS = 30;
const C = {bg: "#07060A", ink: "#F4EBDD", mute: "#A39A8C", amber: "#F2B544", line: "#3A3226", card: "#141118"};
const BANDS = ["#3B2A14", "#6B4716", "#A86A12", "#E0961C", "#FFD27A"];
const CUTS = [1.5, 2, 2.5, 4];  // light 2025 / 2012: <1.5, 1.5-2, 2-2.5, 2.5-4, 4+
const SHORTNAME: Record<string, string> = {DH: "DNH and Daman & Diu", AN: "Andaman & Nicobar"};
const MAPNAME: Record<string, string> = {AN: "Andaman and Nicobar Islands", JK: "Jammu and Kashmir", DL: "NCT of Delhi",
  DH: "Dadra & Nagar Haveli and Daman & Diu"};
const NUDGE: Record<string, number[]> = {"Lakshadweep": [-30, -62], "Sikkim": [0, -62], "Mizoram": [72, 56],
  "Dadra & Nagar Haveli and Daman & Diu": [-84, 16], "Meghalaya": [-76, 52], "Andaman and Nicobar Islands": [-78, 0],
  "Nagaland": [78, 8], "Tripura": [-32, 72], "Puducherry": [96, 0], "Manipur": [88, 24], "Chandigarh": [130, -75],
  "Goa": [-82, 0], "Assam": [-26, -10], "Punjab": [-6, 0], "Kerala": [-72, 30], "Haryana": [-8, 6], "NCT of Delhi": [-215, -35]};
// RBI Bulletin Oct 2026, Table 3: correlation of y-o-y quarterly night-light growth with GSVA growth
const RBI = {date: "23 Oct 2026", corr: [["Maharashtra", "0.90"], ["Karnataka", "0.79"], ["Gujarat", "0.66"]]};

type St = {name: string; w: number; h: number; path: string; ratio: number; rank: number; lit: number[]; area_km2: number; nodata_pct: number; note?: string | null};
const D = NL as unknown as {years: number[]; states: Record<string, St>};
export const NL_IDS = Object.keys(D.states).sort();
// scene starts, seconds. Text-led cut: fixed. Voiced cut: from each line's length (research/.../nl_voice.py -> vo.json).
type Times = {hook: number; wipe: number; num: number; lit: number; rbi: number; map: number; end: number; total: number};
const TEXT: Times = {hook: 0, wipe: 4.5, num: 6.9, lit: 11.5, rbi: 18.5, map: 25.5, end: 32.5, total: 37};
const VO = VOJ as unknown as Record<string, {T: Times; vo: {file: string; at: number; sec: number}[]}>;
export const NL_VOICED = Object.keys(VO).sort();
export const nlFrames = (id: string, voice: boolean) => Math.round((voice && VO[id] ? VO[id].T : TEXT).total * FPS);

// our own synthesised effects (copied from the Namakkal set, scripts/datayt/long_sfx.py on datakadai/namakkal-looks);
// a cue peaks at -18 dBFS under the voice, -12 dBFS with no voice, plus the per-effect trim long_sfx.py uses (+6: the files peak at -6)
const TRIM: Record<string, number> = {air: -7, whoosh: 2, thud: 3, pop: 0, tick: -5, fill: -4, chime: 0, lock2: 2};
const cues = (T: Times): [string, number][] => [["air", 0.1], ["whoosh", T.wipe + 0.2], ["thud", T.num], ["pop", T.lit + 0.2],
  ["pop", T.lit + 1.0], ["tick", T.rbi + 0.8], ["tick", T.rbi + 1.2], ["tick", T.rbi + 1.6], ["fill", T.map + 0.1],
  ["chime", T.map + 1.67], ["lock2", T.end]];

const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
const sec = (s: number) => Math.round(s * FPS);
const fmtX = (r: number) => (r >= 10 ? r.toFixed(0) : r.toFixed(1)) + "×";
const pct = (v: number) => (v >= 1 ? v.toFixed(0) : v.toFixed(1)) + "%";
const bucket = (r: number) => CUTS.filter((c) => r >= c).length;

const Chip: React.FC<{text: string; y: number; op: number}> = ({text, y, op}) =>
  <div style={{position: "absolute", left: 0, top: y, opacity: op, background: C.amber, color: C.bg, fontFamily: SANS,
    fontWeight: 800, fontSize: 30, letterSpacing: 3, padding: "8px 18px", borderRadius: 8}}>{text}</div>;

const Big: React.FC<{y: number; size: number; op: number; color?: string; children: React.ReactNode}> = ({y, size, op, color = C.ink, children}) =>
  <div style={{position: "absolute", left: 0, top: y, width: W, opacity: op, fontFamily: COND, fontWeight: 700, fontSize: size,
    lineHeight: 1.05, color, textTransform: "uppercase"}}>{children}</div>;

const Line: React.FC<{y: number; size?: number; op: number; children: React.ReactNode}> = ({y, size = 40, op, children}) =>
  <div style={{position: "absolute", left: 0, top: y, width: W, opacity: op, fontFamily: SANS, fontWeight: 600, fontSize: size,
    lineHeight: 1.3, color: C.ink}}>{children}</div>;

// the satellite pair: 2012 under, 2025 over, revealed by a wipe at `wipe` (0..1)
const Sky: React.FC<{id: string; s: St; y: number; wipe: number; zoom: number}> = ({id, s, y, wipe, zoom}) => {
  const k = Math.min(W / s.w, 1000 / s.h), w = s.w * k, h = s.h * k, x = (W - w) / 2;
  const [y0, y1] = D.years;
  return <div style={{position: "absolute", left: x, top: y + (1000 - h) / 2, width: w, height: h, overflow: "hidden", borderRadius: 14,
    transform: `scale(${zoom})`, transformOrigin: "50% 50%"}}>
    <Img src={staticFile(`datayt/nightlights/${id}_${y0}.jpg`)} style={{position: "absolute", width: w, height: h}}/>
    <div style={{position: "absolute", left: 0, top: 0, width: w * wipe, height: h, overflow: "hidden"}}>
      <Img src={staticFile(`datayt/nightlights/${id}_${y1}.jpg`)} style={{position: "absolute", width: w, height: h, maxWidth: "none"}}/>
    </div>
    <svg width={w} height={h} viewBox={`0 0 ${s.w} ${s.h}`} style={{position: "absolute", left: 0, top: 0}}>
      <path d={s.path} fill="none" stroke={C.ink} strokeOpacity={0.55} strokeWidth={2 * s.w / w} strokeLinejoin="round"/>
    </svg>
    {wipe > 0.001 && wipe < 0.999 && <div style={{position: "absolute", left: w * wipe - 2, top: 0, width: 4, height: h, background: C.amber}}/>}
    <div style={{position: "absolute", left: 16, top: 12, fontFamily: COND, fontWeight: 700, fontSize: 44, color: C.amber,
      opacity: wipe > 0.5 ? 0 : 1}}>{y0}</div>
    <div style={{position: "absolute", right: 16, top: 12, fontFamily: COND, fontWeight: 700, fontSize: 44, color: C.amber,
      opacity: wipe > 0.5 ? 1 : 0}}>{y1}</div>
  </div>;
};

const Bar: React.FC<{y: number; label: string; v: number; p: number; color: string}> = ({y, label, v, p, color}) =>
  <div style={{position: "absolute", left: 0, top: y, width: W}}>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: 44, color: C.mute}}>{label}</div>
    <div style={{position: "absolute", left: 0, top: 64, width: W, height: 70, background: C.card, borderRadius: 10}}/>
    <div style={{position: "absolute", left: 0, top: 64, width: Math.max(8, W * v / 100 * p), height: 70, background: color, borderRadius: 10}}/>
    <div style={{position: "absolute", left: 0, top: 150, fontFamily: COND, fontWeight: 700, fontSize: 64, color}}>{pct(v * p)}</div>
  </div>;

export const NightLights: React.FC<{id: string; voice?: boolean}> = ({id, voice = false}) => {
  const f = useCurrentFrame();
  const T = voice && VO[id] ? VO[id].T : TEXT;
  const s = D.states[id], [y0, y1] = D.years;
  const nm = SHORTNAME[id] ?? s.name;  // on screen; the map keys stay on the full name
  const at = (t: number) => sec(t);
  const vis = (a: number, b: number) => Math.min(ease(f, at(a), at(a) + 8), 1 - ease(f, at(b) - 6, at(b)));
  const wipe = ease(f, at(T.wipe) + 6, at(T.wipe) + 66);
  const zoom = interpolate(f, [0, at(T.lit)], [1.0, 1.06], {extrapolateRight: "clamp"});
  const fullyLit = s.lit[0] >= 90;
  const map: MapState[] = Object.entries(D.states).map(([sid, v]) => {
    const name = MAPNAME[sid] ?? v.name;
    return {name, label: fmtX(v.ratio).replace("×", ""), bucket: bucket(v.ratio), nudge: NUDGE[name] ?? [0, 0], dark: bucket(v.ratio) <= 2};
  });
  const skyOp = Math.min(1, 1 - ease(f, at(T.lit) - 6, at(T.lit)));
  return <AbsoluteFill style={{background: C.bg}}>
    <VoxFonts/>
    {cues(T).map(([n, t], i) => <Sequence key={`sfx${i}`} from={sec(t)}><Audio src={staticFile(`datayt/nightlights/sfx/${n}.wav`)}
      volume={Math.pow(10, ((voice ? -18 : -12) + (TRIM[n] ?? 0) + 6) / 20)}/></Sequence>)}
    {voice && (VO[id]?.vo ?? []).map((v) => <Sequence key={v.file} from={sec(v.at)}><Audio src={staticFile(`datayt/nightlights/${v.file}`)}/></Sequence>)}
    <div style={{position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${SAFE.x}px, ${SAFE.y}px) scale(${SAFE.s})`}}>
      <Chip text="NASA SATELLITE · NIGHT LIGHTS" y={0} op={ease(f, 0, 8)}/>
      <div style={{position: "absolute", right: 0, top: 6, fontFamily: COND, fontWeight: 700, fontSize: 34, color: C.ink, opacity: 0.85}}>
        DATA <span style={{color: C.amber}}>KADAI</span></div>

      {/* 1. hook + 2. wipe */}
      <Big y={110} size={92} op={ease(f, 0, 8) * (1 - ease(f, at(T.wipe) + 54, at(T.wipe) + 60))}>{nm}<br/>at night, {y0}</Big>
      <Big y={110} size={92} op={ease(f, at(T.wipe) + 60, at(T.wipe) + 72) * (1 - ease(f, at(T.lit) - 6, at(T.lit)))}>
        {nm}<br/>at night, <span style={{color: C.amber}}>{y1}</span></Big>
      <div style={{opacity: skyOp}}><Sky id={id} s={s} y={340} wipe={wipe} zoom={zoom}/></div>
      {s.note && <div style={{position: "absolute", left: 0, top: 1350, width: W, fontFamily: SANS, fontSize: 28, color: C.mute,
        opacity: skyOp}}>{s.note}</div>}
      <Big y={1390} size={200} color={C.amber} op={ease(f, at(T.num), at(T.num) + 12) * skyOp}>{fmtX(s.ratio)}</Big>
      <Line y={1610} size={46} op={ease(f, at(T.num) + 8, at(T.num) + 20) * skyOp}>
        the light of {y0}, summed over the whole state</Line>

      {/* 3. lit area */}
      <div style={{opacity: vis(T.lit, T.rbi)}}>
        <Big y={140} size={84} op={1}>How much of {nm}<br/><span style={{color: C.amber}}>glows</span> at night</Big>
        <Bar y={560} label={String(y0)} v={s.lit[0]} p={ease(f, at(T.lit) + 6, at(T.lit) + 36)} color={C.mute}/>
        <Bar y={980} label={String(y1)} v={s.lit[1]} p={ease(f, at(T.lit) + 30, at(T.lit) + 60)} color={C.amber}/>
        <Line y={1400} size={40} op={ease(f, at(T.lit) + 60, at(T.lit) + 72)}>
          {fullyLit ? `Already lit end to end in ${y0}: the change is brightness, not new ground.`
                    : `Share of the state's land brighter than 1 nanowatt per cm² per steradian, about a lit village.`}</Line>
      </div>

      {/* 4. why RBI cares */}
      <div style={{opacity: vis(T.rbi, T.map)}}>
        <Big y={140} size={84} op={1}>Light is not income.<br/><span style={{color: C.amber}}>But it tracks it.</span></Big>
        <Line y={470} size={44} op={ease(f, at(T.rbi) + 8, at(T.rbi) + 20)}>
          RBI economists matched each quarter's night-light growth with the state's output growth (GSVA):</Line>
        {RBI.corr.map(([st, c], i) => <div key={st} style={{position: "absolute", left: 0, top: 760 + i * 180, width: W,
          opacity: ease(f, at(T.rbi) + 24 + i * 12, at(T.rbi) + 36 + i * 12), display: "flex", justifyContent: "space-between",
          borderBottom: `2px solid ${C.line}`, paddingBottom: 18}}>
          <span style={{fontFamily: COND, fontWeight: 700, fontSize: 76, color: C.ink}}>{st}</span>
          <span style={{fontFamily: COND, fontWeight: 700, fontSize: 76, color: C.amber}}>{c}</span></div>)}
        <Line y={1360} size={36} op={ease(f, at(T.rbi) + 60, at(T.rbi) + 72)}>
          Correlation, 1 = in lockstep. RBI Bulletin, {RBI.date}. RBI studied these three states, not {nm}.</Line>
      </div>

      {/* 5. every state */}
      <div style={{opacity: vis(T.map, T.total + 1)}}>
        <Big y={120} size={66} op={1}>Light in {y1} ÷ {y0}<br/><span style={{color: C.amber}}>{nm} #{s.rank} of 36</span></Big>
        <StateMap states={map} colors={BANDS} x={(W - 1000 * 1.05) / 2} y={330} h={1100 * 1.05} frame={f} t0={at(T.map)} fps={FPS}
          focus={[MAPNAME[id] ?? s.name]} focusP={ease(f, at(T.map) + 50, at(T.map) + 60) * 0.4} ring={{[MAPNAME[id] ?? s.name]: C.amber}}
          fs={24} pal={{ink: C.ink, bg: C.bg, empty: "#1C1820", light: "#FFFFFF"}} font={COND}/>
      </div>
      <Line y={1580} size={48} op={ease(f, at(T.end), at(T.end) + 10)}>
        <span style={{color: C.amber, fontWeight: 800}}>What lit up {nm}?</span> Tell us below.</Line>
      <div style={{position: "absolute", left: 0, top: 1760, width: W, fontFamily: SANS, fontSize: 26, color: C.mute,
        opacity: ease(f, at(T.map), at(T.map) + 10)}}>
        Light: NASA Black Marble VNP46A4, {y0} and {y1}, poor-quality pixels removed.<br/>Map: DataMeet, Government of India boundaries.</div>
    </div>
  </AbsoluteFill>;
};
