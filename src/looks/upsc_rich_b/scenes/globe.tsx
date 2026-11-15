// Look B scene kind "globe": a daylight-illustrated Earth with the rain belt, in ten modes (band, coriolis, zoomout, hadley, itcz, seasons,
// split, overhead, and Part 2: belt-south, pacific). Spec: src/looks/cartoon/long/CONTRACT_UPSC.md. Labels come from spec.labels ({text | lab, key}) and appear only from at(key).
// Land is Natural Earth 10 m in India's view (the cartoon engine's globe_land.ts: every Indian island kept). No number is typed here.
import React from "react";
import {AbsoluteFill} from "remotion";
import type {SceneProps} from "../../cartoon/long/contract";
import {lab} from "../../cartoon/long/figs";
import {Pill, PaperFinish, clamp, eio, eo, lerp, prog, rng} from "../kit";
import {ARW, ArrowB, Backdrop, BandB, GDefs, GlobeB, Leader, SunB, Tag, TowerB, flowPts, lat_line, lineD, proj, tagBox, type TagBox, type View} from "./globe_b";
import {HadleyMode} from "./globe_hadley";
import {SplitMode} from "./globe_split";
import {BeltSouthMode, PacificMode} from "./globe_p2";

export type GlobeMode = "band" | "coriolis" | "zoomout" | "hadley" | "itcz" | "seasons" | "split" | "overhead" | "belt-south" | "pacific";
export type GlobeLabel = {text?: string; lab?: string; key: string};
export type GlobeSpec = {mode: GlobeMode; glow?: boolean; labels?: GlobeLabel[]; chip?: string; limit?: string; camera?: unknown; notes?: string};
const MODES: GlobeMode[] = ["band", "coriolis", "zoomout", "hadley", "itcz", "seasons", "split", "overhead", "belt-south", "pacific"];
const D = Math.PI / 180, GID = "gb";

export type L = {text: string; t0: number};
export type TagSpec = {text: string; box: TagBox; t0: number; to?: [number, number]; dot?: string};
export type Out = {svg: React.ReactNode; tags: TagSpec[]; bd?: View | null};
export type Ctx = {f: number; dur: number; L: L[]; glow: boolean};

const V0: View = {cx: 960, cy: 474, R: 366, lon0: 76, lat0: 16};
const drift = (v: View, f: number, dur: number): View => ({...v, R: v.R * (1 + 0.03 * clamp(f / Math.max(1, dur)))});
const tex = (v: View, lon0: number) => -(v.lon0 - lon0) * D * v.R * Math.cos(v.lat0 * D);
const stack = (L: L[], from: number, f0 = 868): TagSpec[] => L.slice(from).map((l, i) => ({text: l.text, t0: l.t0, box: tagBox(l.text, 960, f0 - i * 84)}));

// ------------------------------------------------------------------ band
const BandMode = ({f, dur, L, glow}: Ctx): Out => {
  const v0 = {...V0, lon0: V0.lon0 + f * 0.02}, v = drift(v0, f, dur);
  return {
    bd: v,
    svg: <GlobeB indiaTop v={v} id="gB" f={f} texShift={tex(v, 76)} under={<BandB v={v} gid={GID} f={f} lat={1} glow={glow ? 1 : 0}/>}/>,
    tags: stack(L, 0),
  };
};

// ------------------------------------------------------------------ coriolis
const NORTH = (lo: number): [number, number][] => [[lo + 10, 46], [lo + 6, 34], [lo - 2, 24], [lo - 16, 15]];
const SOUTH = (lo: number): [number, number][] => [[lo + 10, -46], [lo + 6, -34], [lo - 2, -24], [lo - 16, -15]];
const CoriolisMode = ({f, dur, L}: Ctx): Out => {
  const v = drift({...V0, cy: 486, lon0: V0.lon0 + f * 0.015}, f, dur);
  const tN = L[1] ? L[1].t0 - 6 : 30, tS = L[2] ? L[2].t0 - 6 : 60, tZ = L[3] ? L[3].t0 - 6 : 90;
  const g = (t: number) => eio(prog(f, t, 30));
  const arrows: React.ReactNode[] = [];
  [40, 78, 116].forEach((lo, i) => arrows.push(<ArrowB key={"n" + i} gid={GID} id={`cn${i}`} pts={flowPts(v, NORTH(lo))} f={f} grow={g(tN + i * 5)} w={17} col={ARW.north}/>));
  [40, 78, 116].forEach((lo, i) => arrows.push(<ArrowB key={"s" + i} gid={GID} id={`cs${i}`} pts={flowPts(v, SOUTH(lo))} f={f} grow={g(tS + i * 5)} w={17} col={ARW.south}/>));
  arrows.push(<ArrowB key="z1" gid={GID} id="cz1" pts={flowPts(v, [[52, -10], [52, 10]])} f={f} grow={g(tZ)} w={17} col={ARW.equator}/>);
  arrows.push(<ArrowB key="z2" gid={GID} id="cz2" pts={flowPts(v, [[104, 10], [104, -10]])} f={f} grow={g(tZ + 6)} w={17} col={ARW.equator}/>);
  const pt = (lo: number, la: number): [number, number] => { const p = proj(v, lo, la); return [p.x, p.y]; };
  const tags: TagSpec[] = [];
  if (L[0]) tags.push({text: L[0].text, t0: L[0].t0, box: tagBox(L[0].text, 960, 104)});
  if (L[1]) tags.push({text: L[1].text, t0: L[1].t0, box: tagBox(L[1].text, 1545, 330), to: pt(112, 31), dot: "#e48a1c"});
  if (L[2]) tags.push({text: L[2].text, t0: L[2].t0, box: tagBox(L[2].text, 1545, 700), to: pt(112, -31), dot: "#cc4a22"});
  if (L[3]) tags.push({text: L[3].text, t0: L[3].t0, box: tagBox(L[3].text, 110, 500, "l", 30, 500), to: pt(52, 0), dot: "#6fa8d6"});
  tags.push(...stack(L, 4));
  return {
    bd: v,
    svg: <GlobeB indiaTop v={v} id="gB" f={f} texShift={tex(v, 76)} under={<BandB v={v} gid={GID} f={f} lat={1}/>}>{arrows}</GlobeB>,
    tags,
  };
};

// ------------------------------------------------------------------ zoomout: South Asia to the whole Earth
const ZoomMode = ({f, dur, L}: Ctx): Out => {
  const e = eio(prog(f, 6, dur - 12)), R0 = 1500, R1 = V0.R;
  const R = R0 * Math.pow(R1 / R0, e), lon0 = lerp(80, 76, e), lat0 = lerp(20, 16, e);
  const q = proj({cx: 0, cy: 0, R: R0, lon0: 80, lat0: 20}, 79, 22);
  const v: View = {cx: lerp(960 - q.x, V0.cx, e), cy: lerp(520 - q.y, V0.cy, e), R, lon0, lat0};
  return {
    bd: v,
    svg: <GlobeB indiaTop v={v} id="gB" f={f} texShift={tex(v, 76)} under={<BandB v={v} gid={GID} f={f} lat={1} op={eo(clamp((e - 0.3) / 0.5))} size={0.0022}/>}/>,
    tags: stack(L, 0),
  };
};

// ------------------------------------------------------------------ itcz: trades from both sides meet, towers grow along the line
const ItczMode = ({f, dur, L}: Ctx): Out => {
  const v = drift({...V0, lon0: 80 + f * 0.015}, f, dur);
  const g = (t: number) => eio(prog(f, t, 34));
  const towers: {y: number; n: React.ReactNode}[] = [], arrows: React.ReactNode[] = [];
  for (let i = 0; i < 8; i++) {
    const lon = 18 + i * 18, p = proj(v, lon, 1);
    if (p.c < 0.3) continue;
    const r = rng(500 + i), gr = clamp(prog(f, 50 + i * 5, 60)) * (1 + 0.02 * Math.sin(f / 10 + i)), w = v.R * 0.062 * Math.sqrt(p.c), h = v.R * (0.22 + 0.12 * r());
    towers.push({y: p.y, n: <TowerB key={i} gid={GID} x={p.x} y={p.y + 12} h={h} w={w} g={gr} seed={i} a={clamp((p.c - 0.3) / 0.2)}/>});
  }
  [48, 96].forEach((lo, i) => arrows.push(<ArrowB key={"n" + i} gid={GID} id={`in${i}`} pts={flowPts(v, [[lo + 6, 38], [lo + 2, 26], [lo - 6, 14], [lo - 14, 6]])} f={f} grow={g(6 + i * 8)} w={17} col={ARW.north}/>));
  [48, 96].forEach((lo, i) => arrows.push(<ArrowB key={"s" + i} gid={GID} id={`is${i}`} pts={flowPts(v, [[lo + 8, -38], [lo + 4, -26], [lo - 4, -14], [lo - 12, -4]])} f={f} grow={g(10 + i * 8)} w={17} col={ARW.south}/>));
  towers.sort((a, b) => a.y - b.y);
  return {
    bd: v,
    svg: <GlobeB indiaTop v={v} id="gB" f={f} texShift={tex(v, 80)} under={<BandB v={v} gid={GID} f={f} lat={1} op={0.85} size={0.0021}/>}>
      {towers.map((t) => t.n)}{arrows}
    </GlobeB>,
    tags: stack(L, 0),
  };
};

// ------------------------------------------------------------------ seasons: the sun's overhead spot slides, the band follows and settles over India
const SUN_LON = 78;
const sunLat = (p: number) => 23.4 * Math.sin(2 * Math.PI * 1.25 * clamp(p));
const SeasonsMode = ({f, dur, L, glow}: Ctx): Out => {
  const v = drift({...V0, lon0: 78, lat0: 16}, f, dur);
  // Part 2 (spec.glow): the glowing belt waits in the south, then rides north with the sun once the label "summer" is spoken and settles over India.
  // Part 1 (no glow flag) keeps its own timing, unchanged.
  const tKey = L[0] ? L[0].t0 : dur * 0.5, pr = eio(prog(f, tKey - 40, 100));
  const p = clamp((f - 6) / (dur - 24)), sl = glow ? lerp(-23.4, 23.4, pr) : sunLat(p);
  const bl = glow ? lerp(-9, 18, eio(prog(f, tKey - 30, 105))) : lerp(0.9 * sunLat(p - 0.07), 17, eo(clamp((p - 0.88) / 0.12))), sp = proj(v, SUN_LON, sl);
  return {
    bd: v,
    svg: <GlobeB indiaTop v={v} id="gB" f={f} texShift={tex(v, 78)} under={<>
      <path d={lineD(v, lat_line(23.4, -60, 200, 4))} fill="none" stroke="#fff6c8" strokeWidth="2.2" strokeDasharray="10 12" opacity="0.8"/>
      <path d={lineD(v, lat_line(-23.4, -60, 200, 4))} fill="none" stroke="#fff6c8" strokeWidth="2.2" strokeDasharray="10 12" opacity="0.8"/>
      <BandB v={v} gid={GID} f={f} lat={bl} glow={glow ? 1 : 0.6}/>
    </>}>{sp.c > 0 && <SunB x={sp.x} y={sp.y} r={v.R * 0.05} f={f} gid={GID}/>}</GlobeB>,
    tags: stack(L, 0),
  };
};

// ------------------------------------------------------------------ overhead: the band over India, towers building, rain beneath
const OverheadMode = ({f, dur, L}: Ctx): Out => {
  const v = drift({cx: 960, cy: 520, R: 470, lon0: 78, lat0: 22}, f, dur);
  const bl = lerp(6, 19, eio(prog(f, 0, 80)));
  const towers: {y: number; n: React.ReactNode}[] = [], rain: React.ReactNode[] = [], ups: React.ReactNode[] = [];
  for (let i = 0; i < 7; i++) {
    const r = rng(700 + i), lon = 63 + i * 8, lat = 19 + Math.sin(i * 2.3) * 3.2, p = proj(v, lon, lat);
    const gr = clamp(prog(f, 40 + i * 7, 80)), w = 30 + 6 * r(), h = 90 + 50 * r();
    for (let k = 0; k < 5; k++) {
      const ph = (f * 0.012 + k * 0.2 + r()) % 1, rx = p.x + (k - 2) * 18 + ph * 12, ry = p.y + 22 + ph * 110;
      rain.push(<path key={`r${i}${k}`} d={`M${rx},${ry} l-6,26`} stroke="#eef9ff" strokeWidth="3" strokeLinecap="round" opacity={eo(clamp((gr - 0.6) / 0.4)) * (1 - ph) * 0.9}/>);
    }
    towers.push({y: p.y, n: <TowerB key={i} gid={GID} x={p.x} y={p.y + 6} h={h} w={w} g={gr} seed={i}/>});
    if (i % 2 === 1) ups.push(<ArrowB key={"u" + i} gid={GID} id={`ou${i}`} pts={[[p.x + 56, p.y + 74], [p.x + 56, p.y + 24], [p.x + 56, p.y - 44]]} f={f} grow={eio(prog(f, 50 + i * 6, 34))} w={11} col={ARW.rise}/>);
  }
  towers.sort((a, b) => a.y - b.y);
  return {
    bd: v,
    svg: <GlobeB indiaTop v={v} id="gB" f={f} texShift={tex(v, 78)} under={<BandB v={v} gid={GID} f={f} lat={bl} glow={0.5} size={0.0021}/>}>
      {rain}{towers.map((t) => t.n)}{ups}
    </GlobeB>,
    tags: stack(L, 0),
  };
};

const MODE_VIEW: Record<GlobeMode, (c: Ctx) => Out> = {band: BandMode, coriolis: CoriolisMode, zoomout: ZoomMode, hadley: HadleyMode, itcz: ItczMode, seasons: SeasonsMode, split: SplitMode, overhead: OverheadMode, "belt-south": BeltSouthMode, pacific: PacificMode};

export const Scene: React.FC<SceneProps<GlobeSpec>> = ({f, dur, spec, at}) => {
  if (!spec || !MODES.includes(spec.mode)) throw new Error(`globe: spec.mode must be one of ${MODES.join(", ")}`);
  const L: L[] = (spec.labels ?? []).map((l, i) => {
    const text = l.lab ? lab(l.lab) : l.text;
    if (!text) throw new Error(`globe label ${i + 1}: needs text or lab`);
    return {text, t0: at(l.key)};
  });
  const out = MODE_VIEW[spec.mode]({f, dur, L, glow: !!spec.glow});
  return (
    <AbsoluteFill style={{background: "#EFE6D2", overflow: "hidden"}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute", inset: 0}}>
        <GDefs id={GID} f={f}/>
        {out.bd !== null && <Backdrop id={GID} f={f} cx={out.bd?.cx ?? 960} cy={out.bd?.cy ?? 478} R={out.bd ? Math.min(out.bd.R, 520) : 340}/>}
        {out.svg}
        {out.tags.map((t, i) => t.to ? <Leader key={i} box={t.box} to={t.to} f={f} t0={t.t0}/> : null)}
      </svg>
      <PaperFinish id="gbpf" grain={0.45} vignette={0.3}/>
      {out.tags.map((t, i) => <Tag key={i} box={t.box} f={f} t0={t.t0} dot={t.dot}/>)}
      {spec.chip ? <Pill x={96} y={72} text={spec.chip} a={1}/> : null}
      {spec.limit ? <div style={{position: "absolute", left: 96, top: 884, fontFamily: "'RB Schibsted', sans-serif", fontWeight: 600, fontSize: 22, color: "#5a3a1c"}}>Where the picture stops: {spec.limit}</div> : null}
    </AbsoluteFill>
  );
};
