// Scene kind "globe" (UPSC monsoon film): a flat-vector Earth with the rain belt, in eight modes: band, coriolis, zoomout, hadley, itcz,
// seasons, split, overhead. Spec: ../CONTRACT_UPSC.md. Labels come from spec.labels ({text | lab, key}) and are drawn only from at(key).
// Land is Natural Earth 10 m in India's view (globe_land.ts, built by scripts/upsc/globe_land.py). No numbers are typed here: every quantity is a label.
import React from "react";
import {random} from "remotion";
import {C} from "../../palette";
import {easeIO, ease} from "../../ui";
import {type SceneProps} from "../contract";
import {lab} from "../figs";
import {Arrow2D, Band, Flow, Globe, INK, LabelPill, Puff, Sky, SunSpot, Tower, cl, lat_line, lineD, mix, proj, smooth, type View} from "./globe_kit";

export type GlobeMode = "band" | "coriolis" | "zoomout" | "hadley" | "itcz" | "seasons" | "split" | "overhead";
export type GlobeLabel = {text?: string; lab?: string; key: string};
export type GlobeSpec = {mode: GlobeMode; glow?: boolean; labels?: GlobeLabel[]; camera?: unknown; notes?: string};
const MODES: GlobeMode[] = ["band", "coriolis", "zoomout", "hadley", "itcz", "seasons", "split", "overhead"];

type L = {text: string; t0: number};
type Ctx = {f: number; dur: number; L: L[]; glow: boolean};
const V0: View = {cx: 960, cy: 490, R: 330, lon0: 76, lat0: 16};
const BOTTOM = {x: 960, y: 868};
const p2 = (v: View, lo: number, la: number): [number, number] => { const p = proj(v, lo, la); return [p.x, p.y]; };

// ------------------------------------------------------------------ band
const BandMode: React.FC<Ctx> = ({f, L, glow}) => {
  const v = {...V0, lon0: V0.lon0 + f * 0.02};
  return <>
    <Globe v={v} id="g_band" f={f}><Band v={v} f={f} lat={1} glow={glow ? 1 : 0} id="g_band"/></Globe>
    {L[0] && <LabelPill text={L[0].text} x={BOTTOM.x} y={BOTTOM.y} f={f} t0={L[0].t0}/>}
  </>;
};

// ------------------------------------------------------------------ coriolis
const NORTH = (lo: number): [number, number][] => [[lo + 10, 46], [lo + 6, 34], [lo - 2, 24], [lo - 16, 15]];
const SOUTH = (lo: number): [number, number][] => [[lo + 10, -46], [lo + 6, -34], [lo - 2, -24], [lo - 16, -15]];
const CoriolisMode: React.FC<Ctx> = ({f, L}) => {
  const v = {...V0, cy: 500, lon0: V0.lon0 + f * 0.015};
  const tN = L[1] ? L[1].t0 - 6 : 30, tS = L[2] ? L[2].t0 - 6 : 60, tZ = L[3] ? L[3].t0 - 6 : 90;
  const g = (t: number) => ease(f, t, t + 26);
  return <>
    <Globe v={v} id="g_cor" f={f}>
      <Band v={v} f={f} lat={1} id="g_cor"/>
      {[40, 78, 116].map((lo, i) => <Flow key={"n" + i} v={v} pts={NORTH(lo)} f={f} grow={g(tN + i * 5)} color={C.yellow} w={20}/>)}
      {[40, 78, 116].map((lo, i) => <Flow key={"s" + i} v={v} pts={SOUTH(lo)} f={f} grow={g(tS + i * 5)} color={C.orange} w={20}/>)}
      <Flow v={v} pts={[[52, -10], [52, 10]]} f={f} grow={g(tZ)} color={C.white} w={20}/>
      <Flow v={v} pts={[[104, 10], [104, -10]]} f={f} grow={g(tZ + 6)} color={C.white} w={20}/>
    </Globe>
    {L[0] && <LabelPill text={L[0].text} x={960} y={100} f={f} t0={L[0].t0}/>}
    {L[1] && <LabelPill text={L[1].text} x={1545} y={330} f={f} t0={L[1].t0} to={p2(v, 112, 31)}/>}
    {L[2] && <LabelPill text={L[2].text} x={1545} y={690} f={f} t0={L[2].t0} to={p2(v, 112, -31)}/>}
    {L[3] && <LabelPill text={L[3].text} x={118} y={500} anchor="l" maxW={520} f={f} t0={L[3].t0} to={p2(v, 52, 0)}/>}
    {L.slice(4).map((l, i) => <LabelPill key={i} text={l.text} x={BOTTOM.x} y={BOTTOM.y - i * 80} f={f} t0={l.t0}/>)}
  </>;
};

// ------------------------------------------------------------------ zoomout
const ZoomMode: React.FC<Ctx> = ({f, dur, L}) => {
  const e = easeIO(f, 6, dur - 12), R0 = 1500, R1 = V0.R;
  const R = R0 * Math.pow(R1 / R0, e), lon0 = mix(80, 76, e), lat0 = mix(20, 16, e);
  const q = proj({cx: 0, cy: 0, R: R0, lon0: 80, lat0: 20}, 79, 22);
  const cx0 = 960 - q.x, cy0 = 520 - q.y;
  const v: View = {cx: mix(cx0, V0.cx, e), cy: mix(cy0, V0.cy, e), R, lon0, lat0};
  return <>
    <Globe v={v} id="g_zoom" f={f}><Band v={v} f={f} lat={1} op={ease(e, 0.35, 0.8)} id="g_zoom"/></Globe>
    {L.map((l, i) => <LabelPill key={i} text={l.text} x={BOTTOM.x} y={BOTTOM.y - i * 80} f={f} t0={l.t0}/>)}
  </>;
};

// ------------------------------------------------------------------ hadley (cross-section over the band)
const gy = (x: number) => 690 + 110 * Math.pow((x - 960) / 780, 2);
const lid = (x: number) => 236 + 50 * Math.pow((x - 960) / 780, 2);
const mirror = (a: [number, number][]) => a.map(([x, y]) => [1920 - x, y] as [number, number]);
const HadleyMode: React.FC<Ctx> = ({f, L}) => {
  const tR = L[0] ? L[0].t0 - 6 : 20, tS = L[1] ? L[1].t0 - 6 : 70, tT = L[2] ? L[2].t0 - 6 : 110, tP = Math.min(tR + 16, tS - 4);
  const g = (t: number, n = 28) => ease(f, t, t + n);
  const xs = Array.from({length: 40}, (_, i) => 110 + i * (1700 / 39));
  const groundD = xs.map((x, i) => `${i ? "L" : "M"}${x.toFixed(0)} ${gy(x).toFixed(1)}`).join("");
  const lidD = xs.map((x, i) => `${i ? "L" : "M"}${x.toFixed(0)} ${lid(x).toFixed(1)}`).join("");
  const v: View = {cx: 250, cy: 310, R: 95, lon0: 78, lat0: 0};
  const rise: [number, number][] = [[996, 650], [996, 560], [996, 440], [996, 335]];
  const pole = smooth([[1030, 298], [1200, 292], [1380, 294], [1470, 304], [1500, 338]], 8);
  const sink: [number, number][] = [[1500, 352], [1500, 450], [1500, 560], [1500, 642]];
  const back = smooth([[1470, 692], [1320, 674], [1170, 658], [1040, 640]], 8);
  const cell = (mir: boolean, k: string) => {
    const m = (a: [number, number][]) => (mir ? mirror(a) : a);
    return <g key={k}>
      <Arrow2D pts={m(back)} f={f} grow={g(tT, 36)} color={C.yellow} w={22}/>
      <Arrow2D pts={m(sink)} f={f} grow={g(tS)} color={C.blue} w={24}/>
      <Arrow2D pts={m(pole)} f={f} grow={g(tP, 36)} color={C.orange} w={22}/>
      <Arrow2D pts={m(rise)} f={f} grow={g(tR)} color={C.red} w={24}/>
    </g>;
  };
  return <>
    <clipPath id="hd_clip"><rect x={110} y={125} width={1700} height={765} rx={44}/></clipPath>
    <rect x={118} y={135} width={1700} height={765} rx={44} fill={INK} opacity={0.3}/>
    <rect x={110} y={125} width={1700} height={765} rx={44} fill="#F7FBFF"/>
    <g clipPath="url(#hd_clip)">
      <path d={`${lidD}L1810 125L110 125Z`} fill={C.sky2}/>
      <path d={lidD} fill="none" stroke={C.fridgeDark} strokeWidth={14} strokeLinecap="round"/>
      <path d={`${groundD}L1810 890L110 890Z`} fill={C.blue}/>
      <path d={groundD} fill="none" stroke={INK} strokeWidth={8}/>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${240 + i * 230 + Math.sin(f / 20 + i) * 12} ${gy(240 + i * 230) + 55}q22 -16 44 0t44 0`} fill="none" stroke={C.white} strokeWidth={6} strokeLinecap="round" opacity={0.5}/>)}
      <Tower x={960} y={622} h={330} w={52} g={g(tR, 70)} seed={3}/>
      {[[700, 0.6], [1220, 0.7]].map(([x, s], i) => <Puff key={i} x={x} y={gy(x) - 70} s={46 * s} op={0.9}/>)}
      {cell(false, "r")}{cell(true, "l")}
    </g>
    <rect x={110} y={125} width={1700} height={765} rx={44} fill="none" stroke={INK} strokeWidth={8}/>
    <Globe v={v} id="g_mini" f={f}><Band v={v} f={f} lat={1} glow={1} size={0.075} id="g_mini"/>
      <line x1={v.cx} y1={v.cy - v.R - 14} x2={v.cx} y2={v.cy + v.R + 14} stroke={C.red} strokeWidth={6} strokeDasharray="14 10"/></Globe>
    {L[0] && <LabelPill text={L[0].text} x={960} y={178} f={f} t0={L[0].t0} size={42} to={[960, 292]}/>}
    {L[1] && <LabelPill text={L[1].text} x={1255} y={470} anchor="c" maxW={430} f={f} t0={L[1].t0} size={42} to={[1500, 470]}/>}
    {L[2] && <LabelPill text={L[2].text} x={1215} y={800} f={f} t0={L[2].t0} size={42} to={[1215, 664]}/>}
    {L.slice(3).map((l, i) => <LabelPill key={i} text={l.text} x={BOTTOM.x} y={BOTTOM.y - i * 80} f={f} t0={l.t0}/>)}
  </>;
};

// ------------------------------------------------------------------ itcz
const ItczMode: React.FC<Ctx> = ({f, L}) => {
  const v = {...V0, lon0: 80 + f * 0.015};
  const g = (t: number) => ease(f, t, t + 30);
  const towers: React.ReactNode[] = [];
  for (let i = 0; i < 11; i++) {
    const lon = 14 + i * 14, p = proj(v, lon, 1);
    if (p.c < 0.3) continue;
    const gr = cl(ease(f, 50 + i * 5, 110 + i * 5)) * (1 + 0.02 * Math.sin(f / 10 + i)), w = v.R * 0.055 * Math.sqrt(p.c), h = v.R * (0.12 + 0.07 * random("tw" + i));
    towers.push(<Tower key={i} x={p.x} y={p.y + 10} h={h} w={w} g={gr} seed={i}/>);
  }
  return <>
    <Globe v={v} id="g_itcz" f={f}>
      <Band v={v} f={f} lat={1} op={0.8} size={0.045} id="g_itcz"/>
      {[48, 96].map((lo, i) => <Flow key={"n" + i} v={v} pts={[[lo + 6, 38], [lo + 2, 26], [lo - 6, 14], [lo - 14, 6]]} f={f} grow={g(6 + i * 8)} color={C.yellow} w={20}/>)}
      {[48, 96].map((lo, i) => <Flow key={"s" + i} v={v} pts={[[lo + 8, -38], [lo + 4, -26], [lo - 4, -14], [lo - 12, -4]]} f={f} grow={g(10 + i * 8)} color={C.orange} w={20}/>)}
      {towers}
    </Globe>
    {L.map((l, i) => <LabelPill key={i} text={l.text} x={BOTTOM.x} y={BOTTOM.y - i * 80} f={f} t0={l.t0}/>)}
  </>;
};

// ------------------------------------------------------------------ seasons
const SUN_LON = 78;
const sunLat = (p: number) => 23.4 * Math.sin(2 * Math.PI * 1.25 * cl(p));
const SeasonsMode: React.FC<Ctx> = ({f, dur, L}) => {
  const v: View = {...V0, lon0: 78, lat0: 16};
  const p = cl((f - 6) / (dur - 24)), sl = sunLat(p);
  const bl = mix(0.9 * sunLat(p - 0.07), 17, ease(p, 0.88, 1));
  const sp = proj(v, SUN_LON, sl);
  return <>
    <Globe v={v} id="g_sea" f={f}>
      <path d={lineD(v, lat_line(23.4, -60, 200, 4))} fill="none" stroke={C.white} strokeWidth={4} strokeDasharray="10 12" opacity={0.7}/>
      <path d={lineD(v, lat_line(-23.4, -60, 200, 4))} fill="none" stroke={C.white} strokeWidth={4} strokeDasharray="10 12" opacity={0.7}/>
      <Band v={v} f={f} lat={bl} glow={0.6} id="g_sea"/>
      {sp.c > 0 && <SunSpot x={sp.x} y={sp.y} r={v.R * 0.085} f={f}/>}
    </Globe>
    {L.map((l, i) => <LabelPill key={i} text={l.text} x={BOTTOM.x} y={BOTTOM.y - i * 80} f={f} t0={l.t0}/>)}
  </>;
};

// ------------------------------------------------------------------ split (peak scene)
const SplitMode: React.FC<Ctx> = ({f, dur, L}) => {
  const vl: View = {cx: 480, cy: 480, R: 335, lon0: 78, lat0: 14}, vr: View = {cx: 1440, cy: 480, R: 335, lon0: 78, lat0: 14};
  const fade = 1 - 0.85 * ease(f, dur * 0.45, dur * 0.8);
  const slide = easeIO(f, dur * 0.12, dur * 0.8), bl = mix(1, 19, slide);
  const trade = (lo: number): [number, number][] => [[lo, -24], [lo + 1, -11], [lo + 4, 0], [lo + 9, bl * 0.5 + 2], [lo + 14, bl]];
  return <>
    <g opacity={mix(1, 0.55, ease(f, dur * 0.45, dur * 0.8))}>
      <Globe v={vl} id="g_spl_l" f={f}>
        <Band v={vl} f={f} lat={1} op={0.6 * (0.4 + 0.6 * fade)} size={0.05} id="g_spl_l"/>
        <Flow v={vl} pts={[[72, -18], [75, -6], [77, 6], [78, 17]]} f={f} grow={ease(f, 6, 40)} w={54} color={C.orange} opacity={fade}/>
      </Globe>
    </g>
    <line x1={960} y1={150} x2={960} y2={810} stroke={INK} strokeWidth={6} strokeDasharray="4 18" strokeLinecap="round" opacity={0.5}/>
    <Globe v={vr} id="g_spl_r" f={f}>
      <Band v={vr} f={f} lat={bl} glow={0.5 + 0.5 * slide} size={0.05} id="g_spl_r"/>
      {[60, 80].map((lo, i) => <Flow key={i} v={vr} pts={trade(lo)} f={f} grow={ease(f, 10 + i * 8, 40 + i * 8)} w={22} color={C.yellow}/>)}
    </Globe>
    {L.map((l, i) => <LabelPill key={i} text={l.text} x={1824} y={BOTTOM.y - i * 80} anchor="r" maxW={1150} f={f} t0={l.t0}/>)}
  </>;
};

// ------------------------------------------------------------------ overhead
const OverheadMode: React.FC<Ctx> = ({f, L}) => {
  const v: View = {cx: 960, cy: 530, R: 470, lon0: 78, lat0: 22};
  const bl = mix(6, 19, easeIO(f, 0, 80));
  const towers: {y: number; node: React.ReactNode}[] = [], rain: React.ReactNode[] = [], ups: React.ReactNode[] = [];
  for (let i = 0; i < 7; i++) {
    const lon = 63 + i * 8, lat = 19 + Math.sin(i * 2.3) * 3.2, p = proj(v, lon, lat);
    const gr = ease(f, 40 + i * 7, 120 + i * 7), w = 30 + 6 * random("ow" + i), h = 110 + 60 * random("oh" + i);
    for (let k = 0; k < 4; k++) {
      const ph = (f * 0.04 + k * 0.25 + random("rd" + i + k)) % 1, rx = p.x + (k - 1.5) * 24 + ph * 18, ry = p.y + 24 + ph * 120;
      rain.push(<line key={`r${i}${k}`} x1={rx} y1={ry} x2={rx - 8} y2={ry + 28} stroke={C.blueDark} strokeWidth={7} strokeLinecap="round" opacity={ease(gr, 0.6, 1) * (1 - ph)}/>);
    }
    towers.push({y: p.y, node: <Tower key={i} x={p.x} y={p.y + 6} h={h} w={w} g={gr} seed={i}/>});
    if (i % 2 === 1) ups.push(<Arrow2D key={"u" + i} pts={[[p.x + 54, p.y + 70], [p.x + 54, p.y + 20], [p.x + 54, p.y - 40]]} f={f} grow={ease(f, 50 + i * 6, 80 + i * 6)} w={14} color={C.red}/>);
  }
  towers.sort((a, b) => a.y - b.y);
  return <>
    <Globe v={v} id="g_ovh" f={f}>
      <Band v={v} f={f} lat={bl} glow={0.5} size={0.065} id="g_ovh"/>
      {rain}{towers.map((t) => t.node)}{ups}
    </Globe>
    {L.map((l, i) => <LabelPill key={i} text={l.text} x={BOTTOM.x} y={BOTTOM.y - i * 80} f={f} t0={l.t0}/>)}
  </>;
};

const MODE_VIEW: Record<GlobeMode, React.FC<Ctx>> = {band: BandMode, coriolis: CoriolisMode, zoomout: ZoomMode, hadley: HadleyMode, itcz: ItczMode, seasons: SeasonsMode, split: SplitMode, overhead: OverheadMode};

export const Scene: React.FC<SceneProps<GlobeSpec>> = ({f, dur, spec, at}) => {
  if (!spec || !MODES.includes(spec.mode)) throw new Error(`globe: spec.mode must be one of ${MODES.join(", ")}`);
  const L: L[] = (spec.labels ?? []).map((l, i) => {
    const text = l.lab ? lab(l.lab) : l.text;
    if (!text) throw new Error(`globe label ${i + 1}: needs text or lab`);
    return {text, t0: at(l.key)};
  });
  const push = spec.mode === "zoomout" || spec.mode === "hadley" ? 1 : 1 + 0.02 * (f / Math.max(1, dur));
  const Mode = MODE_VIEW[spec.mode];
  return <div style={{position: "absolute", inset: 0, overflow: "hidden", background: C.sky}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute", left: 0, top: 0}}>
      <Sky f={f}/>
      <g transform={`translate(960 500) scale(${push}) translate(-960 -500)`}>
        <Mode f={f} dur={dur} L={L} glow={!!spec.glow}/>
      </g>
    </svg>
  </div>;
};
