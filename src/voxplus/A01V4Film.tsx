// A01 v4 full film, "What Is a Moat? The $26 Loom That Explains It" (18 Oct 2026), Vox Motion+ kit, 60 fps.
// Narration: script.md v4.1, every beat word for word (MiniMax speech-2.6-hd, English_Diligent_Man, one file per beat).
// Beat starts come from the voiced files (a01v4Timing.ts, generated). Shots are cut on the real audio: each cut is
// "beat + seconds into that beat", read off MiniMax's sentence timings and silence detection (vo/timing.json).
// The cold open (c01-c05 + title) is the approved stage-1 build, unchanged (A01V4Cold.tsx).
// Numbers on screen are only the script's ledger figures; every chip names its source and date.
import React from "react";
import {AbsoluteFill, Sequence, random, useVideoConfig} from "remotion";
import {BigWord, PriceTag} from "./BigType";
import {CamKey, camAt, Layer} from "./Camera";
import {SourceTag, PauseCard} from "./Cards";
import {PhotoPrint, StickerLabel, TornBlock} from "./Collage";
import {DocPage, docRectCentre} from "./DocPage";
import {Rect} from "./Marker";
import {MapRoute, fitProjection, useGeo} from "./MapRoute";
import {geoContains} from "d3-geo";
import {MusicBed, SfxTrack} from "./Sound";
import {Finish, InkSurface} from "./Texture";
import {useVoxFonts} from "./fonts";
import {C, clamp01, ease, F, H, inOut, outCubic, outQuint, shake, spr, step, tk2f, useTicks, W} from "./tokens";
import {Attackers, camI, Castle, ChapterQ, Desk, Fig, Firework, FlipCard, Icon, IconDisc, IconName, KINDS, MarkerText, MiniStrip, Num, Paper,
  Para, PictoGrid, RebuildWall, Ring, RupeeTag, Series, ShopFront, Shot, SiegeArrows, SP, Stamp, StickyNote, Sub, Tr, TwoBars, TypedPage, Words,
  layoutShots, tsec} from "./A01V4Parts";
import {Candy, CarSticker, CheckBox, COLD_CUES, coldShots, cueFrames, D85, GlowRing, NameBar, Person, R85, SCue, TagCard, Tile, Timeline, VO as VO_COLD,
  VoiceTrack} from "./A01V4Cold";
import {BEAT, BEAT_DUR, BEAT_DUR_OLD, BEAT_OLD, BEAT_ORDER, FILM_TOTAL_S, W as warp} from "./a01v4Timing";

export const FILM_TOTAL = tsec(FILM_TOTAL_S);
// Cues are written as (beat, seconds into the beat) on the 18 Oct timing; warp() maps them onto the tightened narration.
const T = (k: string, rel: number) => warp(BEAT_OLD[k] + rel);                       // film seconds
const useAt = (s0: number) => (k: string, rel: number) => tsec(warp(BEAT_OLD[k] + rel)) - s0;   // local ticks
type AtFn = ReturnType<typeof useAt>;

// 1986 page (rendered from the official letter page by the kit, rects in image px)
const D86F = {src: "docs/bh1986_moat.png", imgW: 2018, imgH: 864, x: 960, y: 560, width: 1480, rot: 1.0};
const R86F = {line: [[456, 486, 1411.5, 54], [24, 540, 835.4, 54]] as Rect[], moat: [744.1, 486, 115.3, 54] as Rect};

// ---------------- generic shot builders ----------------
const DocShot = (o: {paras: (a: AtFn) => Para[]; chip: string; head?: string; title?: string; date?: string; font?: "letter" | "article"; size?: number; width?: number;
  aim?: [number, number]; s1?: number; tone?: "cream" | "kraft"; enter?: boolean; focus?: (a: AtFn) => number; over?: (f: number, a: AtFn, d: number) => React.ReactNode;
  inner?: (f: number, a: AtFn) => React.ReactNode; y?: number}): React.FC<SP> => ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const [ax, ay] = o.aim ?? [960, 540];
  return (
    <Desk f={f} d={d} tone={o.tone ?? "kraft"} chip={o.chip} cam={[[0, 1.0, 960, 540], [d, o.s1 ?? 1.12, ax, ay, inOut]]} over={o.over ? o.over(f, a, d) : undefined}>
      <TypedPage f={f} paras={o.paras(a)} head={o.head} title={o.title} date={o.date} font={o.font} size={o.size ?? 40} width={o.width ?? 1440} y={o.y ?? 540}
        enter={o.enter === false ? undefined : 0} focusAt={o.focus ? o.focus(a) : undefined}/>
      {o.inner ? o.inner(f, a) : null}
    </Desk>
  );
};
const label = (f: number, at: number, text: string, x = 960, y = 960, o: {dark?: boolean; size?: number; rot?: number; bg?: string; color?: string} = {}) =>
  <StickerLabel f={f} text={text} x={x} y={y} size={o.size ?? 62} dark={o.dark ?? true} rot={o.rot ?? -1.5} bg={o.bg} color={o.color} enter={{at, mode: "slide", from: [0, 320], dur: 9}}/>;
const pop = (f: number, at: number, text: string, x: number, y: number, o: {dark?: boolean; size?: number; rot?: number; bg?: string; color?: string} = {}) =>
  <StickerLabel f={f} text={text} x={x} y={y} size={o.size ?? 52} dark={o.dark} rot={o.rot ?? -3} bg={o.bg} color={o.color} enter={{at, mode: "pop", rot0: -10}}/>;

// =====================================================================================================
// Chapter 1 · What is a moat?
// =====================================================================================================
const m01a: React.FC<SP> = ({d}) => <ChapterQ f={useTicks()} d={d} n={1} q="What is a moat?"/>;
const m01b: React.FC<SP> = ({s0, d}) => {      // "Around a castle, it is deep water that keeps attackers out."
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.1, 960, 560], [d, 1.0, 960, 540, outCubic]]} chip="Our plain words">
      <Castle f={f} y={520} water={ease(f, a("m01", 3.2), a("m01", 3.2) + 15, inOut)}/>
      <Attackers f={f} at={a("m01", 4.2)} y={520}/>
      <MarkerText f={f} at={a("m01", 3.4)} text="deep water" x={1500} y={900} size={64} rot={-4}/>
    </Desk>
  );
};
const m01c: React.FC<SP> = ({s0, d}) => {      // "In business, it is whatever keeps rivals from taking your customers, for years."
  const f = useTicks(), a = useAt(s0);
  const yrs = Math.min(10, 1 + Math.floor(Math.max(0, f - a("m01", 9.9)) / 2.2));
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 900, 540], [d, 1.0, 1020, 540]]} chip="Our plain words">
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}><ellipse cx={960} cy={700} rx={430} ry={110} fill="none" stroke="#4F86C6" strokeWidth={34}
        opacity={ease(f, 0, 12)} strokeDasharray="1 0"/></svg>
      <div style={{position: "absolute", left: 960 - 130, top: 400}}><Icon name="shop" size={260}/></div>
      {[0, 1, 2, 3].map((i) => <Person key={i} f={f} at={4 + i * 6} x={700 + i * 60} y={760} from={-900} tickAt={a("m01", 99)} s={0.6}/>)}
      {[0, 1].map((i) => {
        const p = ease(f, a("m01", 7.3) + i * 6, a("m01", 7.3) + i * 6 + 22, outCubic), side = i ? 1 : -1;
        return <div key={i} style={{position: "absolute", left: 960 + side * (1200 - 640 * p) - 80, top: 520 + Math.sin(f * 0.3) * (p >= 1 ? 0 : 3)}}>
          <Icon name="shop" size={160} color={C.markerRed}/></div>;
      })}
      {f >= a("m01", 9.9) ? <div style={{position: "absolute", left: 1600, top: 220, fontFamily: F.serif, fontSize: 96, color: C.ink, textAlign: "center"}}>{yrs}
        <div style={{fontFamily: F.sans, fontWeight: 900, fontSize: 30, letterSpacing: 4}}>YEARS</div></div> : null}
      {label(f, a("m01", 8.2), "Keeps rivals out", 960, 960)}
    </Desk>
  );
};
const m02a: React.FC<SP> = ({s0, d}) => <Words f={useTicks()} d={d} text="First: the easy answer." mark={["easy"]} markAt={useAt(s0)("m02", 1.4)} chip="Berkshire letter for 1985"/>;
const m02b: React.FC<SP> = ({s0, d}) => {      // "Were the machines junk? No."
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.06, 900, 540], [d, 1.0, 960, 540]]} chip="Berkshire letter for 1985">
      <PhotoPrint f={f} src="media/loom_draper_1987.jpg" x={760} y={520} w={1060} h={760} rot={2} halftone={0.12} caption="looms like these (photo: HAER/LoC)" enter={{at: 0, mode: "none"}}/>
      <PriceTag f={f} enterAt={-60} x={1450} y={-40} string={300} scale={1.0} values={[{text: "$26", at: -60}]}/>
      <div style={{position: "absolute", left: 1470, top: 640, width: 300, height: 220, background: "linear-gradient(170deg,#FFF36B,#FBE54A)", transform: "rotate(4deg)",
        boxShadow: "0 12px 22px rgba(0,0,0,0.25)", opacity: ease(f, a("m02", 2.9), a("m02", 3.1))}}/>
      <MarkerText f={f} at={a("m02", 3.1)} text="JUNK?" x={1620} y={750} size={92} color={C.ink} rot={4}/>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <path d="M 1490 790 L 1760 700" stroke={C.markerRed} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1}
          strokeDashoffset={1 - ease(f, a("m02", 4.95), a("m02", 4.95) + 6, outCubic)}/>
      </svg>
      {pop(f, a("m02", 5.25), "Still usable", 760, 860, {size: 64, rot: -4})}
    </Desk>
  );
};
const m02c = DocShot({chip: "Berkshire letter for 1985", head: "Berkshire Hathaway · letter for 1985 (retyped excerpt)", aim: [960, 520], s1: 1.1,
  paras: (a) => [{indent: true, segs: ["The equipment sold ... took up about 750,000 square feet of factory space in New Bedford and was ",
    {t: "eminently usable", hl: a("m02", 6.6)}, ".  It ", {t: "originally cost us about $13 million", hl: a("m02", 9.0), circle: a("m02", 10.1)},
    ", including $2 million spent in 1980-84 ... the equipment could have been replaced new for perhaps $30-$50 million."]}]});
const m02d: React.FC<SP> = ({s0, d}) => {      // $13 MILLION
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" chip="Berkshire letter for 1985" cam={[[0, 1.04, 960, 540], [d, 1.0, 960, 540]]}>
      <Num f={f} at={2} to={13} x={960} y={470} size={230} pre="$" suf=" million" dur={18}/>
      <Sub f={f} at={6} text="what the equipment cost" x={960} y={620} color="#B9B2A6"/>
      <div style={{position: "absolute", left: 960, top: 780, translate: "-50% 0", whiteSpace: "nowrap", padding: "14px 24px", background: C.highlightPrint, color: C.ink, fontFamily: F.sans, fontWeight: 900,
        fontSize: 36, transform: `rotate(-3deg) scale(${spr(f, 14, 11, 200)})`}}>$30–50M TO REPLACE · HIS ESTIMATE</div>
    </Desk>
  );
};
const m03a: React.FC<SP> = ({s0, d}) => {      // chart: cost vs sold for
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" chip="Berkshire letter for 1985 · gross, before costs" cam={[[0, 1.0, 960, 540], [a("m03", 4.0), 1.0, 960, 540], [d, 1.25, 1100, 700, inOut]]}>
      <TwoBars f={f} title="Cost vs sold for" source="Berkshire letter for 1985 · true scale" max={13_500_000}
        a={{label: "Cost", v: 13_000_000, txt: "$13M", at: 4}} b={{label: "Sold for", v: 163_122, txt: "$163,122", at: a("m03", 1.4), key: true}}/>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <ellipse cx={1180} cy={790} rx={190} ry={90} fill="none" stroke={C.markerRed} strokeWidth={8} pathLength={1} strokeDasharray={1}
          strokeDashoffset={1 - ease(f, a("m03", 3.4), a("m03", 3.4) + 14, outCubic)}/>
      </svg>
    </Desk>
  );
};
const m03b: React.FC<SP> = ({s0, d}) => {      // costs of sale eat it: less than nothing
  const f = useTicks(), a = useAt(s0);
  const drop = spr(f, a("m03", 7.4), 11, 170);
  return (
    <Desk f={f} d={d} chip="Berkshire letter for 1985 · net was less than zero" cam={[[0, 1.0, 960, 560], [d, 1.05, 960, 520]]}>
      <TagCard f={f} at={-40} x={960} y={150} text={f < a("m03", 8.6) ? "$163,122" : "< $0"} size={120}/>
      <div style={{position: "absolute", left: 960 - 330, top: -260 + 640 * drop, width: 660, height: 120, background: C.markerRed, color: C.white, display: "flex",
        alignItems: "center", justifyContent: "center", fontFamily: F.sans, fontWeight: 900, fontSize: 52, letterSpacing: 3, transform: "rotate(-2deg)",
        boxShadow: "0 14px 26px rgba(0,0,0,0.3)", opacity: f >= a("m03", 7.4) ? 1 : 0}}>COSTS OF SALE</div>
      {label(f, a("m03", 8.7), "Less than nothing", 960, 930)}
    </Desk>
  );
};
const m03c: React.FC<SP> = ({s0, d}) => {      // So where was the value?
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]}>
      <GlowRing f={f} at={0} cx={960} cy={520} rx={430} ry={190}/>
      <Candy f={f} x={960} y={520} w={620} rot={-4}/>
      <MarkerText f={f} at={a("m03", 10.6)} text="?" x={1460} y={430} size={240} rot={10} dir="y"/>
      {label(f, a("m03", 10.2), "Where was the value?", 960, 900)}
    </Desk>
  );
};
const m04a: React.FC<SP> = ({s0, d}) => {      // Look at See's. His letter for 1983 ...
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 1000, 520], [d, 1.0, 900, 540]]} chip="Berkshire letter for 1983">
      <Candy f={f} x={760} y={520} w={600} rot={-5}/>
      {pop(f, a("m04", 0.3), "See's", 1010, 380, {rot: 6})}
      <Timeline f={f} at={a("m04", 1.6)} years={[1972, 1975, 1978, 1981, 1983, 1985]} from={1972} to={1983} moveAt={a("m04", 2.4)} moveDur={30} y={930} x0={420} x1={1500}/>
    </Desk>
  );
};
const m04b = DocShot({chip: "Berkshire letter for 1983 · paraphrase spoken", head: "Berkshire Hathaway · letter for 1983 (retyped excerpt)", aim: [960, 560], s1: 1.1,
  paras: (a) => [{indent: true, segs: ["It was not the fair market value of the inventories, receivables or fixed assets that produced the premium rates of return.  Rather it was a combination of intangible assets, particularly ",
    {t: "a pervasive favorable reputation with consumers", hl: a("m04", 6.7)}, " based upon ", {t: "countless pleasant experiences", hl: a("m04", 9.0)},
    " they have had with both product and personnel."]}]});
const m04c: React.FC<SP> = ({s0, d}) => {      // customers pop out, count up to COUNTLESS
  const f = useTicks(), a = useAt(s0);
  const n = Math.min(9, Math.floor(Math.max(0, f - a("m04", 9.3)) / 2.5));
  return (
    <Desk f={f} d={d} cam={[[0, 1.05, 960, 560], [d, 1.0, 960, 540]]} chip="Berkshire letter for 1983">
      <Candy f={f} x={960} y={600} w={560} rot={-3}/>
      {Array.from({length: n}).map((_, i) => {
        const ang = -Math.PI + (i / 8) * Math.PI, R = 420;
        const s = spr(f, a("m04", 9.3) + i * 2.5, 10, 200);
        return <div key={i} style={{position: "absolute", left: 960 + Math.cos(ang) * R * s - 30, top: 560 + Math.sin(ang) * R * 0.6 * s - 100, transform: `scale(${0.5 + 0.5 * s})`}}>
          <Icon name="person" size={70} color={i % 2 ? C.inkSoft : "#5A4E42"}/></div>;
      })}
      <div style={{position: "absolute", left: 1660, top: 240, fontFamily: F.serif, fontSize: 90, color: C.ink, transform: "translate(-50%,-50%)"}}>
        {f < a("m04", 10.4) ? (n || "") : "∞"}</div>
      {label(f, a("m04", 6.8), "A good name", 960, 940)}
    </Desk>
  );
};
const m05a: React.FC<SP> = ({s0, d}) => {      // Now, the word. In his letter for 1986 ...
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" cam={[[0, 1.1, 800, 520], [d, 1.0, 960, 540]]} chip="Berkshire letter for 1986">
      <Timeline f={f} at={0} years={[1983, 1984, 1985, 1986, 1987, 1988]} from={1985} to={1986} moveAt={a("m05", 2.8)} moveDur={16} y={880} x0={420} x1={1500}/>
      <BigWord f={f} at={a("m05", 0.2)} text="Now, the word." x={960} y={430} size={150} color={C.ink}/>
    </Desk>
  );
};
const m05b: React.FC<SP> = ({s0, d}) => {      // a car insurer, GEICO
  const f = useTicks(), a = useAt(s0);
  const drive = ease(f, 0, 20, outCubic);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 1000, 540]]} chip="Berkshire letter for 1986">
      <div style={{position: "absolute", left: 0, top: 0, transform: `translateX(${(1 - drive) * -1200}px)`}}><CarSticker f={f} at={-30} x={760} y={540} w={560}/></div>
      {pop(f, a("m05", 5.9), "GEICO", 1320, 420, {size: 96, rot: 4, dark: true})}
      {pop(f, a("m05", 4.5), "Car insurer", 1320, 560, {size: 52, rot: -3})}
    </Desk>
  );
};
const m05c: React.FC<SP> = ({s0, d}) => {      // 1986 page: a kind of moat
  const f = useTicks(), a = useAt(s0);
  const mm = docRectCentre(D86F, R86F.moat);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Berkshire letter for 1986 · signed 27 Feb 1987" cam={[[0, 1.0, 960, 560], [a("m05", 8.0), 1.2, mm.x + 120, mm.y, inOut], [d, 1.9, mm.x, mm.y, inOut]]}>
      <DocPage f={f} {...D86F} stack={2} highlights={[{rects: R86F.line, at: a("m05", 7.5), dur: 14}]} circles={[{rect: R86F.moat, at: a("m05", 10.2), dur: 12}]}
        focus={{rect: [0, 486, 2018, 108], at: a("m05", 8.8), blur: 2.6}}/>
    </Desk>
  );
};
const m06a: React.FC<SP> = ({s0, d}) => {      // MOAT, huge, on black
  const f = useTicks();
  const u = ease(f, 8, 20, inOut);
  return (
    <AbsoluteFill>
      <InkSurface/>
      <div style={{position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${1.15 - 0.15 * ease(f, 0, d, outCubic)})`, fontFamily: F.serif, fontSize: 330, color: C.white}}>moat</div>
      <div style={{position: "absolute", left: 960 - 380, top: 680, width: 760, height: 26, background: C.highlightPrint, transform: `scaleX(${u})`, transformOrigin: "0 50%"}}/>
      <SourceTag f={f} at={0} text="Berkshire letter for 1986" dark/>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};
const SNIPS: [string, string, string, string][] = [
  ["1986", "competitors is a kind of ", "moat", " that protects a valuable"], ["1993", "setting up a protective ", "moat", " around their economic castles"],
  ["1996", "even widen the protective ", "moat", " surrounding our economic castle"], ["2005", "we describe the phenomenon as “widening the ", "moat", ".”"],
  ["2007", "must have an enduring “", "moat", "” that protects excellent returns"], ["2008", "widening the “", "moats", "” around our operating businesses"],
  ["2013", "Its low costs create a ", "moat", " – an enduring one"], ["2016", "GEICO’s low costs create a ", "moat", " – an enduring one"],
];
const m06b: React.FC<SP> = ({d}) => {          // match cut: 'moat' dead centre in eight letters
  const f = useTicks();
  const per = [7, 7, 6, 6, 5, 5, 4, 4];
  let i = 0, acc = 0;
  for (; i < per.length - 1 && f >= acc + per[i]; i++) acc += per[i];
  const [yr, pre, w, post] = SNIPS[i];
  return (
    <AbsoluteFill>
      <Paper drift={f / d}/>
      <div style={{position: "absolute", left: 0, right: 0, top: 470, height: 140, background: "#FBF8F1", boxShadow: "0 10px 30px rgba(30,20,10,0.2)"}}/>
      <div style={{position: "absolute", left: 960, top: 540, transform: "translate(-50%,-50%)", whiteSpace: "nowrap", fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 60, color: C.ink}}>
        <span style={{position: "absolute", right: "100%", whiteSpace: "pre"}}>{pre}</span>
        <span style={{background: C.highlight, padding: "0 6px"}}>{w}</span>
        <span style={{position: "absolute", left: "100%", whiteSpace: "pre"}}>{post}</span>
      </div>
      <div style={{position: "absolute", left: 80, top: 380, fontFamily: F.sans, fontWeight: 900, fontSize: 64, color: C.markerRed}}>{yr}</div>
      <SourceTag f={f} at={0} text="Berkshire letters in our files · short lines"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
const m06c: React.FC<SP> = ({s0, d}) => {      // 13 LETTERS / 30 TIMES / FIRST: 1986
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" chip="Our count · Berkshire letters 1977-2024 in our files" cam={[[0, 1.0, 960, 540], [d, 1.04, 960, 560]]}>
      <Num f={f} at={a("m06", 3.1)} to={13} x={700} y={460} size={260} dur={14}/>
      <Sub f={f} at={a("m06", 3.6)} text="letters" x={700} y={630} color="#CFC9BE" size={48}/>
      <Num f={f} at={a("m06", 4.9)} to={30} x={1260} y={460} size={260} dur={14} color={C.highlightPrint}/>
      <Sub f={f} at={a("m06", 5.4)} text="times" x={1260} y={630} color="#CFC9BE" size={48}/>
      <Sub f={f} at={a("m06", 5.9)} text="first: 1986" x={960} y={800} color={C.markerRed} size={44}/>
    </Desk>
  );
};
const m06d: React.FC<SP> = ({s0, d}) => {      // GEICO's gap? two coin columns
  const f = useTicks(), a = useAt(s0);
  const col = (x: number, n: number, at: number, red?: boolean) => Array.from({length: n}).map((_, i) => {
    const s = spr(f, at + i * 1.2, 12, 220);
    return <div key={x + "-" + i} style={{position: "absolute", left: x - 90, top: 820 - i * 34 - (1 - s) * 300, width: 180, height: 30, borderRadius: "50%",
      background: red ? "#C9A85E" : "#D8BD72", border: "4px solid #7A5C1E", opacity: clamp01(s * 3)}}/>;
  });
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.04, 920, 560]]} chip="Berkshire letter for 1986">
      {col(700, 7, 2)}{col(1220, 12, 4, true)}
      {pop(f, 4, "GEICO", 700, 900, {dark: true})}
      {pop(f, 8, "Rivals", 1220, 900, {dark: true})}
      <div style={{position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) scale(${1 + 0.08 * Math.sin(f * 0.25)})`, fontFamily: F.marker, fontSize: 170,
        color: C.markerRed, opacity: ease(f, 10, 18)}}>?</div>
    </Desk>
  );
};

// =====================================================================================================
// Chapter 2 · Why does a business need a moat?
// =====================================================================================================
const n01a: React.FC<SP> = ({d}) => <ChapterQ f={useTicks()} d={d} n={2} q="Why does a business need a moat?"/>;
const n01b: React.FC<SP> = ({s0, d}) => {      // rivals keep attacking any castle that earns well
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]} chip="Berkshire letter for 2007 · written Feb 2008">
      <AbsoluteFill style={{transform: `scale(${1.08 - 0.08 * ease(f, 0, d, outCubic)})`}}>
        <Castle f={f} y={540} s={0.85} glow={ease(f, a("n01", 3.9), a("n01", 3.9) + 10)}/>
        <SiegeArrows f={f} at={a("n01", 2.4)} y={500} thick={ease(f, a("n01", 4.0), a("n01", 4.6))}/>
      </AbsoluteFill>
      {label(f, a("n01", 2.8), "Rivals attack", 960, 960)}
    </Desk>
  );
};
const n01c = DocShot({size: 54, chip: "Berkshire letter for 2007 · written Feb 2008", head: "Berkshire Hathaway · letter for 2007 (retyped excerpt)", aim: [960, 540], s1: 1.12,
  paras: (a) => [{indent: true, segs: ["The dynamics of capitalism guarantee that ", {t: "competitors will repeatedly assault any business “castle”", hl: a("n01", 5.2)},
    " that is earning high returns."]}]});
const n02a: React.FC<SP> = ({s0, d}) => {      // Our reading: the cloth mill had no moat.
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" chip="Our reading">
      <AbsoluteFill style={{transform: `scale(${1.05 - 0.05 * ease(f, 0, d)})`}}>
        <PhotoPrint f={f} src="media/looms_radcliffe_1912.jpg" x={960} y={520} w={1400} h={840} rot={-1} halftone={0.16} darken={0.25}
          caption="a weaving shed, 1912 (illustration)" enter={{at: 0, mode: "none"}}/>
      </AbsoluteFill>
      <MarkerText f={f} at={a("n02", 1.6)} text="no moat" x={960} y={520} size={210} rot={-6}/>
    </Desk>
  );
};
const WORLD_BBOX: [number, number, number, number] = [-130, -38, 150, 64];
const WORLD_PROJ = fitProjection(WORLD_BBOX);
const WORLD_PINS: {lon: number; lat: number; label: string; side: "left" | "right" | "top"}[] = [
  {lon: -71, lat: 41.6, label: "Home", side: "left"}, {lon: -2.3, lat: 53.5, label: "Abroad", side: "top"},
  {lon: 135, lat: 34.7, label: "Abroad", side: "left"}, {lon: 121.5, lat: 25, label: "", side: "right"}, {lon: -46.6, lat: -23.5, label: "", side: "right"}];
const n02b: React.FC<SP> = ({s0, d}) => {      // many rival mills spent to make cloth more cheaply
  const f = useTicks(), a = useAt(s0);
  const geo = useGeo("a01v4/map/world_ind.geojson");
  const cam = camI(f, [[0, 1.0, 960, 560], [d, 1.07, 960, 560]], "c1", "pull");
  return (
    <AbsoluteFill style={{background: C.mapWater}}>
      <Layer cam={cam}>
        <MapRoute f={f} geo={geo} bbox={WORLD_BBOX} focus="XXX" credit={false}
          pins={WORLD_PINS.map((p, i) => ({lon: p.lon, lat: p.lat, at: a("n02", 3.4) + i * 4, label: p.label || undefined, side: p.side}))}/>
        {WORLD_PINS.map((p, i) => {
          const at = a("n02", 5.4) + i * 3, [x, y] = WORLD_PROJ([p.lon, p.lat]) as [number, number];
          return <div key={i} style={{position: "absolute", left: x + 26, top: y - 150, transform: `rotate(${f * 4}deg) scale(${spr(f, at, 10, 200)})`}}>
            <Icon name="gear" size={76} color={C.ink}/></div>;
        })}
      </Layer>
      <SourceTag f={f} at={0} text="Berkshire letter for 1985 · pins are a picture"/>
      <SourceTag f={f} at={0} text="Map: Natural Earth (India view)" pos="br"/>
      <Finish f={f} vignette={0.26}/>
    </AbsoluteFill>
  );
};
const n02c: React.FC<SP> = ({s0, d}) => {      // savings became lower prices for everyone
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 600]]} chip="Berkshire letter for 1985 · paraphrase">
      {Array.from({length: 14}).map((_, i) => {
        const x = 140 + (i % 7) * 270 + (Math.floor(i / 7) ? 135 : 0), t0 = 4 + random("pt" + i) * 18;
        const y = -200 + Math.max(0, f - t0) * (16 + random("pv" + i) * 6);
        return <div key={i} style={{position: "absolute", left: x, top: y, transform: `rotate(${Math.sin(f * 0.1 + i) * 18}deg)`}}><Icon name="tag" size={140} color={C.markerRed} fill="#F2DDA8"/></div>;
      })}
      <div style={{position: "absolute", left: 960, top: 480, transform: "translate(-50%,-50%)", fontFamily: F.serif, fontSize: 240, color: C.markerRed, opacity: ease(f, 4, 12)}}>↓</div>
      {label(f, a("n02", 8.3), "Prices down for all", 960, 900)}
    </Desk>
  );
};
const n02d: React.FC<SP> = ({s0, d}) => {      // So profits stayed poor
  const f = useTicks(), a = useAt(s0);
  const lvl = 0.18 + 0.03 * Math.sin(f * 0.2);
  return (
    <Desk f={f} d={d} tone="ink" chip="Berkshire letter for 1985 · paraphrase" cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]}>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        <rect x={900} y={180} width={120} height={600} rx={60} fill="none" stroke="#E8E2D6" strokeWidth={10}/>
        <rect x={925} y={180 + 600 * (1 - lvl)} width={70} height={600 * lvl - 20} rx={35} fill={C.markerRed}/>
        <circle cx={960} cy={830} r={90} fill={C.markerRed} stroke="#E8E2D6" strokeWidth={10}/>
      </svg>
      <Sub f={f} at={2} text="profits" x={960} y={970} color="#E8E2D6" size={50}/>
      <MarkerText f={f} at={a("n02", 11.0)} text="stayed poor" x={1450} y={560} size={90} color={C.highlightPrint}/>
    </Desk>
  );
};
const Crowd: React.FC<{f: number; up: (i: number) => number; dimAt?: number; eyesAt?: number; cols?: number}> = ({f, up, dimAt, eyesAt, cols = 11}) => (
  <>
    {Array.from({length: cols * 2}).map((_, i) => {
      const row = Math.floor(i / cols), col = i % cols, x = 150 + col * 165 + row * 80, y = 760 + row * 170;
      const l = up(i) * 46;
      const dimmed = dimAt != null && f >= dimAt;
      return <React.Fragment key={i}>
        <Fig x={x} y={y} s={1.15} lift={l} color={row ? "#2E2822" : "#4A4038"}/>
        {eyesAt != null && l > 10 && row === 0 ? <div style={{position: "absolute", left: x - 34, top: y - 280 - l, opacity: ease(f, eyesAt, eyesAt + 6)}}>
          <Icon name="eye" size={68} color={dimmed ? "#8C877F" : C.ink}/>
          <div style={{position: "absolute", left: 54, top: -10, fontFamily: F.sans, fontWeight: 900, fontSize: 40, color: dimmed ? "#8C877F" : C.markerRed}}>{dimmed ? "=" : "+"}</div>
        </div> : null}
      </React.Fragment>;
    })}
    {/* bunting */}
    <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
      <path d="M -20 160 Q 960 300 1940 160" fill="none" stroke="#6E5E48" strokeWidth={4}/>
      {Array.from({length: 18}).map((_, i) => { const t = (i + 0.5) / 18, x = -20 + 1960 * t, y = 160 + 140 * 4 * t * (1 - t);
        return <path key={i} d={`M ${x - 28} ${y} L ${x + 28} ${y} L ${x} ${y + 56} Z`} fill={[C.markerRed, C.highlightPrint, C.wallBlue][i % 3]}/>; })}
    </svg>
  </>
);
const n03a: React.FC<SP> = ({s0, d}) => {      // a crowd at a parade; one person on tiptoe
  const f = useTicks(), a = useAt(s0);
  const one = ease(step(f, 2), a("n03", 3.3), a("n03", 3.3) + 8, outCubic);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 820, 600]]} chip="Berkshire letter for 1985 · the parade">
      <Crowd f={f} up={(i) => (i === 4 ? one : 0)} eyesAt={a("n03", 3.6)}/>
    </Desk>
  );
};
const n03b: React.FC<SP> = ({s0, d}) => {      // then everyone does; nobody sees better
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.1, 960, 600], [d, 1.0, 960, 560]]} chip="Berkshire letter for 1985 · the parade">
      <Crowd f={f} up={(i) => ease(step(f, 2), a("n03", 5.7) + (i % 11) * 1.6, a("n03", 5.7) + (i % 11) * 1.6 + 8, outCubic)} eyesAt={a("n03", 6.0)} dimAt={a("n03", 7.3)}/>
      {label(f, a("n03", 7.4), "Nobody sees better", 960, 440)}
    </Desk>
  );
};
const n03c: React.FC<SP> = ({s0, d}) => {      // Our reading: that is life without a moat
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 560], [d, 1.0, 960, 560]]} chip="Our reading">
      <Crowd f={f} up={() => 1} dimAt={0} eyesAt={0}/>
      <MarkerText f={f} at={a("n03", 9.6)} text="no moat" x={960} y={420} size={190} rot={-7} dur={14}/>
    </Desk>
  );
};
const n04a: React.FC<SP> = ({s0, d}) => {      // And the candy store? 1972
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.08, 960, 520], [d, 1.0, 960, 540]]} chip="Berkshire letters for 1983 & 1991">
      <GlowRing f={f} at={4} cx={960} cy={480} rx={380} ry={170}/>
      <Candy f={f} x={960} y={480} w={560} rot={-4}/>
      <Timeline f={f} at={a("n04", 1.6)} years={[1968, 1969, 1970, 1971, 1972, 1973]} from={1968} to={1972} moveAt={a("n04", 2.0)} moveDur={30} y={900} x0={460} x1={1460}/>
    </Desk>
  );
};
const n04b: React.FC<SP> = ({s0, d}) => {      // Buffett and Charlie Munger bought See's through Blue Chip Stamps
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 900, 540], [d, 1.0, 1020, 540]]} chip="Buyer: Blue Chip Stamps · letter for 1991">
      <Candy f={f} x={700} y={560} w={520} rot={-5}/>
      <NameBar f={f} at={a("n04", 3.4)} name="BUFFETT & MUNGER" sub="BOUGHT IT" x={1050} y={280}/>
      {pop(f, a("n04", 6.2), "Blue Chip Stamps", 1330, 640, {size: 60, dark: true, rot: 3})}
    </Desk>
  );
};
const n04c: React.FC<SP> = ({s0, d}) => {      // They paid $25 million
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 520]]} chip="Berkshire letter for 1983 · 1972 price">
      <Candy f={f} x={760} y={640} w={560} rot={-5}/>
      <TagCard f={f} at={a("n04", 8.0)} x={1250} y={200} string={110} text="$25 million" size={96}/>
      {pop(f, 2, "1972", 520, 380, {size: 64, rot: -4})}
    </Desk>
  );
};
const n04d: React.FC<SP> = ({s0, d}) => {      // pile grows as the scrubber runs 1972 -> the letter for 1999
  const f = useTicks(), a = useAt(s0);
  const g = ease(f, 6, d, inOut);
  return (
    <Desk f={f} d={d} tone="ink" chip="Only the end point is sourced (letter for 1999)" cam={[[0, 1.0, 960, 560], [d, 1.08, 960, 600]]}>
      {Array.from({length: Math.floor(4 + 60 * g)}).map((_, i) => {
        let row = 0, k = i, cap = 11;
        while (k >= cap && cap > 1) { k -= cap; row++; cap--; }
        const x = 960 + (k - (cap - 1) / 2) * 92, y = 860 - row * 40;
        return <div key={i} style={{position: "absolute", left: x - 45, top: y, width: 90, height: 30, borderRadius: "50%", background: "#D8BD72", border: "4px solid #7A5C1E"}}/>;
      })}
      <div style={{position: "absolute", left: 960, top: 180, transform: "translate(-50%,-50%)", fontFamily: F.serif, fontSize: 110, color: C.white}}>
        {g < 0.98 ? Math.round(1972 + 27 * g) : "1999"}</div>
      <Sub f={f} at={4} text="by his letter for 1999" x={960} y={270} color="#B9B2A6" size={34}/>
    </Desk>
  );
};
const n04e: React.FC<SP> = ({s0, d}) => {      // $857 MILLION · BEFORE TAX
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" chip="Berkshire letter for 1999 · signed 1 Mar 2000" cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]}>
      <Num f={f} at={a("n04", 14.3)} to={857} x={960} y={470} size={250} pre="$" suf=" million" dur={36} color={C.highlightPrint}/>
      <Sub f={f} at={a("n04", 15.0)} text="earned by See's" x={960} y={640} color="#CFC9BE" size={44}/>
      {pop(f, a("n04", 16.7), "Before tax", 960, 800, {size: 66, bg: C.markerRed, color: C.white, rot: -3})}
    </Desk>
  );
};
const n05a: React.FC<SP> = ({s0, d}) => {      // split: scrap vs decades
  const f = useTicks(), a = useAt(s0);
  const g = ease(f, a("n05", 2.4), a("n05", 2.4) + 20, inOut);
  const cam = camI(f, [[0, 1.04, 900, 540], [d * 0.5, 1.04, 1020, 540], [d, 1.04, 960, 540]], "c2", "pull");
  return (
    <AbsoluteFill>
      <Layer cam={cam}>
        <div style={{position: "absolute", left: -200, top: -200, width: 1160, height: 1480, overflow: "hidden"}}>
          <Paper tone="kraft"/>
          <PhotoPrint f={f} src="media/loom_draper_1987.jpg" x={680} y={740} w={760} h={560} rot={-2} halftone={0.2} darken={0.35 * g} enter={{at: 0, mode: "none"}}/>
          <AbsoluteFill style={{background: `rgba(120,50,20,${0.28 * g})`, mixBlendMode: "multiply"}}/>
          <PriceTag f={f} enterAt={-60} x={980} y={150} string={240} scale={0.9} values={[{text: "$26", at: -60}]}/>
        </div>
        <div style={{position: "absolute", left: 960, top: -200, width: 1160, height: 1480, overflow: "hidden"}}>
          <Paper/>
          <AbsoluteFill style={{background: `radial-gradient(circle at 40% 50%, rgba(255,214,90,${0.35 * g}), rgba(0,0,0,0) 60%)`}}/>
          <div style={{position: "absolute", left: 0, top: 200}}><Candy f={f} x={480} y={560} w={520} rot={-4}/></div>
          <div style={{position: "absolute", left: 480, top: 980, transform: "translate(-50%,-50%) rotate(-3deg)", padding: "12px 26px", background: C.ink, color: C.highlightPrint,
            fontFamily: F.serif, fontSize: 84}}>$857M</div>
        </div>
      </Layer>
      <SourceTag f={f} at={0} text="Berkshire letters for 1985 & 1999"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
const n05b: React.FC<SP> = ({s0, d}) => {      // Our reading: that is why even new looms found no buyer
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip="Our reading (why even new looms found no buyer)">
      <PhotoPrint f={f} src="media/loom_draper_1987.jpg" x={820} y={540} w={1060} h={760} rot={2} halftone={0.12} caption="looms like these (photo: HAER/LoC)" enter={{at: 0, mode: "none"}}/>
      <PriceTag f={f} enterAt={-60} x={1500} y={-40} string={300} values={[{text: "$5,000", at: -60}, {text: "$26", at: 6, stamp: true}]}/>
      <Stamp f={f} at={a("n05", 7.2)} text="NO BUYER" x={760} y={540} size={130} rot={-10}/>
    </Desk>
  );
};
const n05c: React.FC<SP> = ({s0, d}) => {      // SCRAP vs DECADES
  const f = useTicks(), a = useAt(s0);
  return (
    <Words f={f} d={d} text="Scrap vs decades" at={2} mark={["vs"]} markAt={8} size={190} chip="Our reading"/>
  );
};

// =====================================================================================================
// Chapter 3 · What is a moat made of?
// =====================================================================================================
const w01a: React.FC<SP> = ({d}) => <ChapterQ f={useTicks()} d={d} n={3} q="What is a moat made of?" icon="coin"/>;
const w01b: React.FC<SP> = ({s0, d}) => {      // Something rivals cannot copy fast.
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip="Our plain words">
      <Castle f={f} y={520} s={0.9}/>
      <Attackers f={f} at={0} y={520} n={6} color={C.markerRed}/>
      {label(f, a("w01", 2.4), "Hard to copy", 960, 960)}
    </Desk>
  );
};
const w01c: React.FC<SP> = ({s0, d}) => <Words f={useTicks()} d={d} text="5 kinds" mark={["5"]} markAt={useAt(s0)("w01", 5.6)} size={260} chip="Our grouping"/>;
const KIND_WORD = ["Cost", "Name", "Lock", "Crowd", "Licence"];
const KindsShot = (idx: number[], times: number[]): React.FC<SP> => ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const n = idx.length, gap = 1600 / n;
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, idx[0] ? 1000 : 920, 540], [d, 1.0, idx[0] ? 920 : 1000, 540]]} chip="Our grouping">
      {idx.map((k, i) => {
        const at = a("w01", times[i]), x = 960 - 800 + gap * (i + 0.5);
        const on = f >= at;
        return <React.Fragment key={k}>
          <IconDisc f={f} at={i * 3} name={KINDS[k]} x={x} y={480} size={on ? 300 + 24 * Math.exp(-(f - at) / 6) : 300} bg={on ? C.highlight : C.white} dim={on ? 0 : 0.5}/>
          {pop(f, at + 3, KIND_WORD[k], x, 730, {size: 64, dark: true})}
        </React.Fragment>;
      })}
    </Desk>
  );
};
const w01d = KindsShot([0, 1], [6.92, 8.52]);
const w01e = KindsShot([2, 3, 4], [10.4, 12.28, 13.58]);
const w02a: React.FC<SP> = ({s0, d}) => {      // Kind one: low cost. Back to GEICO's gap.
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 560], [d, 1.04, 960, 540]]} chip="Berkshire letter for 1986">
      <MiniStrip f={f} at={0} lit={0} y={150}/>
      <IconDisc f={f} at={2} name="coin" x={960} y={560} size={360} bg={C.highlight}/>
      {pop(f, 6, "Low cost", 960, 820, {size: 70, dark: true})}
    </Desk>
  );
};
const w02b: React.FC<SP> = ({s0, d}) => {      // every $100 customers paid GEICO that year
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]} chip="Berkshire letter for 1986 · dollars">
      {Array.from({length: 10}).map((_, i) => {
        const s = spr(f, 3 + i * 2, 12, 200);
        return <div key={i} style={{position: "absolute", left: 560 + (i % 5) * 170, top: 300 + Math.floor(i / 5) * 230 - (1 - s) * 400, width: 150, height: 200,
          background: "#CFE3C9", border: "5px solid #4F7A47", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.serif,
          fontSize: 70, color: "#2F5229", transform: `rotate(${(random("bn" + i) - 0.5) * 10}deg)`, opacity: clamp01(s * 3)}}>$10</div>;
      })}
      {label(f, a("w02", 4.6), "Of every $100", 960, 900)}
    </Desk>
  );
};
const w02c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" chip="Berkshire letter for 1986 · 38.5 = our arithmetic" cam={[[0, 1.0, 960, 540], [d, 1.03, 960, 540]]}>
      <TwoBars f={f} title="Of every $100 paid" source="Selling policies + handling claims, 1986" max={48}
        a={{label: "GEICO", v: 23.5, txt: "$23.5", at: a("w02", 8.2), key: true}} b={{label: "Many big rivals", v: 38.5, txt: "about $38.5", at: a("w02", 13.4)}}
        bracket={{at: a("w02", 14.2), txt: "+15"}}/>
    </Desk>
  );
};
const w03a: React.FC<SP> = ({s0, d}) => {      // Kind two: a name people trust. Imagine you open a sweet shop
  const f = useTicks(), a = useAt(s0);
  const flip = ease(f, a("w03", 4.6), a("w03", 4.6) + 10, outBackSafe);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 560], [d, 1.04, 1000, 560]]} chip="Made-up example">
      <MiniStrip f={f} at={0} lit={1} y={140} out={a("w03", 3.0)}/>
      <ShopFront x={620} y={860} sign="FAMOUS SWEETS"/>
      <ShopFront x={1300} y={860} sign={flip > 0.5 ? "YOUR SHOP" : ""} awning="#2F6E8E" signFlip={Math.abs(flip * 2 - 1)}/>
      {Array.from({length: 4}).map((_, i) => <Fig key={i} x={330 + i * 70} y={940} s={0.8} color="#4A4038"/>)}
    </Desk>
  );
};
const outBackSafe = (t: number) => clamp01(t);
const w03b: React.FC<SP> = ({s0, d}) => {      // Same sugar. Lower prices. Who wins?
  const f = useTicks(), a = useAt(s0);
  const sack = (x: number, at: number) => {
    const s = spr(f, at, 11, 180);
    return <div style={{position: "absolute", left: x - 70, top: 760 - (1 - s) * 500, width: 140, height: 150, background: "#E8DCC0", border: "5px solid #8E7E66",
      borderRadius: "40% 40% 18% 18%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.sans, fontWeight: 900, fontSize: 26, color: "#6E5E48",
      opacity: clamp01(s * 3)}}>SUGAR</div>;
  };
  const wob = Math.sin(f * 0.18) * 160;
  return (
    <Desk f={f} d={d} cam={[[0, 1.04, 1000, 560], [d, 1.0, 960, 560]]} chip="Made-up example">
      <ShopFront x={620} y={860} sign="FAMOUS SWEETS"/>
      <ShopFront x={1300} y={860} sign="YOUR SHOP" awning="#2F6E8E"/>
      {sack(560, a("w03", 6.4))}{sack(1240, a("w03", 6.5))}
      {f >= a("w03", 7.9) ? <div style={{position: "absolute", left: 1380, top: 470, transform: `rotate(-6deg) scale(${spr(f, a("w03", 7.9), 9, 240)})`, padding: "10px 20px",
        background: C.markerRed, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: 48}}><span>₹</span> ↓</div> : null}
      {[0, 1, 2].map((i) => <Fig key={i} x={960 + wob * (i % 2 ? -1 : 1) * 0.6 + (i - 1) * 90} y={1000} s={0.75} color="#3E3730"/>)}
      <div style={{position: "absolute", left: 960, top: 260, transform: "translate(-50%,-50%)", fontFamily: F.marker, fontSize: 200, color: C.markerRed, opacity: ease(f, a("w03", 9.6), a("w03", 9.8))}}>?</div>
      {label(f, a("w03", 9.7), "Who wins?", 960, 120, {dark: true})}
    </Desk>
  );
};
const w04a = DocShot({size: 54, chip: "Berkshire letter for 2004", head: "Berkshire Hathaway · letter for 2004, p.5 (retyped excerpt)", aim: [960, 540], s1: 1.12,
  paras: (a) => [{segs: ["Customers by the millions say “I need some Gillette blades” or ", {t: "“I’ll have a Coke”", hl: a("w04", 3.0), hlDur: 10}, " ..."]}],
  over: (f, a) => pop(f, a("w04", 2.0), "Coca-Cola", 1560, 820, {size: 58, dark: true, rot: 4})});
const w04b: React.FC<SP> = ({s0, d}) => {      // 44 of every 100 soft drinks
  const f = useTicks(), a = useAt(s0);
  const n = Math.min(44, Math.floor(Math.max(0, f - a("w04", 7.0)) / 0.9) + (f >= a("w04", 7.0) ? 1 : 0));
  return (
    <Desk f={f} d={d} tone="ink" chip="Berkshire letter for 1993 · worldwide" cam={[[0, 1.0, 960, 540], [d, 1.04, 900, 560]]}>
      <div style={{position: "absolute", left: 120, top: 100, fontFamily: F.serif, fontSize: 80, color: C.white}}>44 of 100 drinks</div>
      <PictoGrid f={f} icon="bottle" n={100} fill={44} at={a("w04", 7.0)} x={720} y={620} cell={64}/>
      <Num f={f} at={a("w04", 7.0)} to={44} x={1480} y={540} size={240} dur={40} suf="%" color={C.markerRed} slam={false}/>
      <div style={{position: "absolute", left: 1480, top: 790, transform: `translate(-50%,-50%) rotate(-2deg) scale(${spr(f, a("w04", 9.2), 11, 200)})`, padding: "12px 22px",
        background: "#FBF8F1", color: C.ink, fontFamily: F.sans, fontWeight: 800, fontSize: 30, whiteSpace: "nowrap"}}>GILLETTE: 60%+ OF BLADES (BY VALUE)</div>
    </Desk>
  );
};
const w04c = DocShot({chip: "Berkshire letter for 1993", head: "Berkshire Hathaway · letter for 1993 (retyped excerpt)", aim: [960, 560], s1: 1.3,
  paras: (a) => [{indent: true, segs: ["The might of their brand names, the attributes of their products, and the strength of their distribution systems give them an enormous competitive advantage, ",
    {t: "setting up a protective moat around their economic castles", hl: a("w04", 11.0), hlDur: 26}, "."]}]});
const Shelf: React.FC<{f: number; goneAt?: number}> = ({f, goneAt}) => (
  <>
    {[0, 1, 2].map((r) => <div key={r} style={{position: "absolute", left: 260, top: 360 + r * 210, width: 1400, height: 22, background: "#8E6E4A", boxShadow: "0 6px 10px rgba(0,0,0,0.3)"}}/>)}
    {Array.from({length: 27}).map((_, i) => {
      const r = Math.floor(i / 9), c = i % 9, t = goneAt != null ? goneAt + (i * 7 % 27) * 0.9 : 1e9;
      const p = ease(f, t, t + 8, outCubic);
      return <React.Fragment key={i}>
        <div style={{position: "absolute", left: 300 + c * 150, top: 220 + r * 210, width: 120, height: 140, border: "4px dashed rgba(60,40,20,0.35)", borderRadius: 8}}/>
        {p < 1 ? <div style={{position: "absolute", left: 300 + c * 150, top: 220 + r * 210 - p * 60, width: 120, height: 140, background: "linear-gradient(170deg,#F6D33C,#E8B81E)",
          border: "4px solid #B4881A", borderRadius: 8, opacity: 1 - p, boxShadow: "0 6px 10px rgba(0,0,0,0.2)"}}>
          <div style={{margin: "40px 14px 0", height: 22, background: C.markerRed}}/></div> : null}
      </React.Fragment>;
    })}
    <div style={{position: "absolute", left: 260, top: 1000, width: 1400, height: 50, background: "#F6F1E6", display: "flex", alignItems: "center", paddingLeft: 30,
      fontFamily: F.sans, fontWeight: 900, fontSize: 30, letterSpacing: 4, color: C.ink}}>MAGGI · NOODLES</div>
  </>
);
const w05a: React.FC<SP> = ({s0, d}) => {      // Can a trusted name survive vanishing?
  const f = useTicks(), a = useAt(s0);
  return <Desk f={f} d={d} cam={[[0, 1.04, 960, 600], [d, 1.0, 960, 580]]} chip="Nestlé India annual report 2015"><Shelf f={f} goneAt={a("w05", 0.8)}/></Desk>;
};
const w05b: React.FC<SP> = ({s0, d}) => {      // In June 2015, Nestlé India ...
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.04, 1000, 540]]} chip="Nestlé India annual report 2015 · company's own words">
      <FlipCard f={f} x={700} y={540} values={[{top: "JUNE", big: "2015", at: 0}, {top: "5 JUN", big: "2015", at: a("w05", 4.0)}]}/>
      {pop(f, a("w05", 4.6), "Nestlé India", 1320, 420, {size: 72, dark: true, rot: 3})}
      {pop(f, a("w05", 5.3), "Maggi", 1320, 560, {size: 64, rot: -3})}
    </Desk>
  );
};
const w05c = DocShot({chip: "Nestlé India annual report 2015, p.20", head: "Nestlé India · annual report 2015, p.20 (retyped excerpt)", font: "article", size: 46, aim: [960, 540], s1: 1.1,
  paras: (a) => [{segs: ["... on 5th June your Company announced voluntary ", {t: "withdrawal of MAGGI Noodles from the market shelves", hl: a("w05", 6.9), hlDur: 22}, " ..."]},
    {segs: [{t: "Over 35000 Tonnes of the product was withdrawn and destroyed.", hl: a("w05", 9.2), hlDur: 22}]}]});
const w05d: React.FC<SP> = ({s0, d}) => {      // 35,000+ tonnes
  const f = useTicks(), a = useAt(s0);
  const sweep = ease(f, a("w05", 12.4), a("w05", 12.4) + 10, inOut);
  return (
    <Desk f={f} d={d} tone="ink" chip="Nestlé India annual report 2015 · company's own words">
      <div style={{position: "absolute", left: 0, top: 0, transform: `translateX(${sweep * -1400}px)`}}>
        {Array.from({length: 28}).map((_, i) => {
          const r = Math.floor(i / 7), c = i % 7, s = spr(f, 2 + i * 1.2, 12, 200);
          return <div key={i} style={{position: "absolute", left: 420 + c * 160 + r * 30, top: 860 - r * 120 - (1 - s) * 500, opacity: clamp01(s * 3)}}><Icon name="crate" size={140} color="#E8E2D6"/></div>;
        })}
      </div>
      <Num f={f} at={a("w05", 10.3)} to={35000} x={960} y={250} size={190} suf="+" dur={30} color={C.highlightPrint}/>
      <Sub f={f} at={a("w05", 10.8)} text="tonnes destroyed" x={960} y={380} color="#CFC9BE" size={44}/>
    </Desk>
  );
};
const w06a: React.FC<SP> = ({s0, d}) => {      // about five months later: 157 days
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.04, 920, 540]]} chip="Withdrawal to relaunch · our count (157 days)">
      <FlipCard f={f} x={640} y={540} values={[{top: "5 JUN", big: "2015", at: -10}, {top: "9 NOV", big: "2015", at: a("w06", 2.2)}]}/>
      <Num f={f} at={a("w06", 1.3)} to={157} x={1320} y={500} size={220} color={C.ink} dur={30}/>
      <Sub f={f} at={a("w06", 1.6)} text="days" x={1320} y={650} color={C.inkSoft} size={50}/>
    </Desk>
  );
};
const w06b = DocShot({chip: "Nestlé India annual report 2015, p.21 · Nielsen", head: "Nestlé India · annual report 2015, p.21 (retyped excerpt)", font: "article", size: 48, s1: 1.1,
  paras: (a) => [{segs: ["... ", {t: "according to Nielsen figures", hl: a("w06", 4.6), hlDur: 14}, " MAGGI Noodles had already recovered its market share from ",
    {t: "0% on 9th November", hl: a("w06", 8.7), hlDur: 10}, " to 33.3% on 31st December 2015."]}],
  over: (f, a) => pop(f, a("w06", 5.2), "Nielsen = market research", 1380, 900, {size: 40, dark: true, rot: 2})});
const w06c: React.FC<SP> = ({s0, d}) => {      // ring 0 -> 33.3
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" chip="Nestlé India AR 2015 (Nielsen) · share of the noodle market" cam={[[0, 1.0, 960, 540], [d, 1.04, 960, 560]]}>
      <Ring f={f} from={0} to={33.3} at={a("w06", 11.0)} dur={40} label={f < a("w06", 11.0) ? "9 NOV 2015" : "31 DEC 2015"}/>
    </Desk>
  );
};
const w06d: React.FC<SP> = ({s0, d}) => {      // about 60, leader again
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" chip="Nestlé India AR 2016 (Nielsen) · about 60%" cam={[[0, 1.04, 960, 560], [d, 1.0, 960, 540]]}>
      <Ring f={f} from={33.3} to={60} at={a("w06", 15.6)} dur={36} label="ABOUT 60% · NEXT REPORT (2016)"/>
      {pop(f, a("w06", 16.3), "Leader again", 1470, 300, {size: 58, bg: C.highlightPrint, color: C.ink, rot: 4})}
    </Desk>
  );
};
const w06e: React.FC<SP> = ({s0, d}) => {      // It is this TRUST
  const f = useTicks(), a = useAt(s0);
  const lift = ease(f, a("w06", 18.6), a("w06", 18.6) + 14, inOut);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Nestlé India annual report 2016, p.5 · chairman" cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 500]]}>
      <div style={{opacity: 1 - 0.6 * lift}}>
        <TypedPage f={f} font="article" size={46} head="Nestlé India · annual report 2016, p.5 (retyped excerpt)"
          paras={[{segs: ["... the unstinted love and trust of our consumers to whom I owe a debt of gratitude! ", {t: "It is this TRUST", hl: a("w06", 17.7), hlDur: 10},
            " that enabled MAGGI Noodles to quickly regain leadership position ..."]}]}/>
      </div>
      <div style={{position: "absolute", left: 960, top: 540 - 160 * lift, transform: `translate(-50%,-50%) scale(${0.6 + 0.6 * lift})`, opacity: lift, fontFamily: F.serif,
        fontSize: 220, color: C.ink, textShadow: "0 10px 30px rgba(0,0,0,0.25)"}}>Trust</div>
    </Desk>
  );
};
const Phone: React.FC<{f: number; x: number; y: number}> = ({f, x, y}) => (
  <div style={{position: "absolute", left: x - 150, top: y - 280, width: 300, height: 560, borderRadius: 40, background: "#1F1B17", padding: 16, boxShadow: "0 20px 40px rgba(0,0,0,0.35)"}}>
    <div style={{width: "100%", height: "100%", borderRadius: 28, background: "#F6F1E6", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 70}}>
      <Icon name="bank" size={130}/>
      <div style={{marginTop: 30, width: 200, height: 18, background: "#CFC9BE", borderRadius: 9}}/>
      <div style={{marginTop: 14, width: 160, height: 18, background: "#E2DCCF", borderRadius: 9}}/>
    </div>
  </div>
);
const LINKS: [IconName, string, number, number][] = [["coin", "Salary", 520, 230], ["house", "Rent", 380, 560], ["doc", "School fees", 560, 860], ["phone", "Phone bill", 1400, 230],
  ["bolt", "Power bill", 1540, 560], ["shop", "Apps", 1380, 860]];
const w07a: React.FC<SP> = ({s0, d}) => {      // being hard to leave: the family bank account
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]} chip="Made-up example">
      <MiniStrip f={f} at={0} lit={2} y={110} out={a("w07", 2.6)}/>
      <Phone f={f} x={960} y={560}/>
      {pop(f, a("w07", 3.0), "Family account", 960, 900, {size: 48, dark: true, rot: 2})}
    </Desk>
  );
};
const w07b: React.FC<SP> = ({s0, d}) => {      // every salary, bill and app; would you bother?
  const f = useTicks(), a = useAt(s0);
  const pull = ease(f, a("w07", 8.4), a("w07", 8.4) + 10, inOut) * (1 - ease(f, a("w07", 9.3), a("w07", 9.3) + 8, outBackish));
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]} chip="Made-up example">
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        {LINKS.map(([, , x, y], i) => {
          const p = ease(f, a("w07", 5.0) + i * 3, a("w07", 5.0) + i * 3 + 8, outCubic);
          return <line key={i} x1={960 + pull * 260} y1={560} x2={960 + (x - 960) * p + pull * 120} y2={560 + (y - 560) * p} stroke={C.markerRed} strokeWidth={8} strokeDasharray="2 14" strokeLinecap="round"/>;
        })}
      </svg>
      {LINKS.map(([ic, t, x, y], i) => <React.Fragment key={i}><IconDisc f={f} at={a("w07", 5.0) + i * 3 + 6} name={ic} x={x} y={y} size={130}/>
        {pop(f, a("w07", 5.0) + i * 3 + 8, t, x, y + 100, {size: 34, dark: true})}</React.Fragment>)}
      <div style={{position: "absolute", left: 0, top: 0, transform: `translateX(${pull * 260}px)`}}><Phone f={f} x={960} y={560}/></div>
      <div style={{position: "absolute", left: 1720, top: 470, opacity: ease(f, a("w07", 8.2), a("w07", 8.5))}}><Icon name="bank" size={130} color={C.wallBlue}/></div>
      {label(f, a("w07", 8.7), "Would you bother?", 960, 1000)}
    </Desk>
  );
};
const outBackish = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const IEX_HUB: [number, number] = [78.5, 22.5];
const PLANTS: [number, number][] = [[72.9, 21.2], [86.3, 23.5], [80.2, 16.5], [76.9, 29.5], [83.4, 26.1], [75.0, 14.5], [88.4, 26.7], [70.8, 24.5], [79.0, 12.0], [93.0, 26.0]];
const IndiaHub: React.FC<{f: number; litAt: number; hubAt: number; rival?: number; rivalLit?: number; drift?: number; funnel?: number}> = ({f, litAt, hubAt, rival, rivalLit, drift = 0, funnel}) => {
  const geo = useGeo();
  return (
    <MapRoute f={f} geo={geo} inkAt={-40} credit={false}
      routes={PLANTS.map((p, i) => ({from: p, to: IEX_HUB, at: litAt + i * 2, dur: 20, bend: 0.12 * (i % 2 ? 1 : -1), color: drift > 0 && i % 3 === 0 ? "#E0A93A" : C.highlight}))}
      pins={[{lon: IEX_HUB[0], lat: IEX_HUB[1], at: hubAt, label: "IEX", side: "right"}, ...(rival != null ? [{lon: 84.5, lat: 19.0, at: rival, label: rivalLit != null && f >= rivalLit ? "Rival · 2022" : "?", side: "right" as const, color: "#7A7066"}] : [])]}/>
  );
};
const w08a: React.FC<SP> = ({s0, d}) => {      // Kind four: a crowd. IEX runs a market ...
  const f = useTicks(), a = useAt(s0);
  const cam = camI(f, [[0, 0.7, 960, 560], [24, 1.0, 960, 540, outCubic], [d, 1.05, 960, 540]], "c3", "pull");
  return (
    <AbsoluteFill style={{background: C.mapWater}}>
      <Layer cam={cam}><IndiaHub f={f} litAt={a("w08", 4.4)} hubAt={a("w08", 2.4)}/></Layer>
      <MiniStrip f={f} at={0} lit={3} y={110} out={a("w08", 2.2)}/>
      {pop(f, a("w08", 5.6), "Power companies", 380, 860, {size: 40, dark: true})}
      {pop(f, a("w08", 6.2), "Big buyers", 1540, 860, {size: 40, dark: true})}
      <SourceTag f={f} at={0} text="Our article (IEX, refreshed 5 Oct 2026) · dots are a picture"/>
      <SourceTag f={f} at={0} text="Map: Natural Earth (India view)" pos="br"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
const w08b: React.FC<SP> = ({s0, d}) => {      // 9,000+ participants
  const f = useTicks(), a = useAt(s0);
  return (
    <AbsoluteFill style={{background: C.mapWater}}>
      <Layer cam={camI(f, [[0, 1.7, 1010, 520], [20, 1.05, 960, 540, outCubic], [d, 1.15, 980, 560]], "c4", "pull")}><IndiaHub f={f} litAt={-80} hubAt={-60}/></Layer>
      <AbsoluteFill style={{background: "rgba(14,14,14,0.55)"}}/>
      <Num f={f} at={a("w08", 10.4)} to={9000} x={960} y={470} size={220} suf="+" dur={36} color={C.highlightPrint}/>
      <Sub f={f} at={a("w08", 11.4)} text="participants" x={960} y={620} color="#F2EDE2" size={52}/>
      {pop(f, a("w08", 7.6), "Jul 2026", 960, 780, {size: 46})}
      <SourceTag f={f} at={0} text="IEX management · analyst meet 24 Jul 2026 (via our article)" dark/>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};
const w08c: React.FC<SP> = ({s0, d}) => {      // Why can't a rival just copy that?
  const f = useTicks(), a = useAt(s0);
  return (
    <AbsoluteFill style={{background: C.mapWater}}>
      <Layer cam={camI(f, [[0, 1.0, 1000, 540], [18, 1.0, 1000, 540], [34, 1.35, 1150, 560, outCubic], [d, 1.4, 1160, 560]], "c5", "pull")}><IndiaHub f={f} litAt={-80} hubAt={-60} rival={2}/></Layer>
      <div style={{position: "absolute", left: 1380, top: 520, transform: `translate(-50%,-50%) scale(${1 + 0.1 * Math.sin(f * 0.3)})`, fontFamily: F.marker, fontSize: 180, color: C.markerRed}}>?</div>
      {label(f, a("w08", 13.2), "Copy the crowd?", 960, 960)}
      <SourceTag f={f} at={0} text="Our question"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
const w09a = DocShot({chip: "Our article · 4 Sep 2026", font: "article", size: 52, head: "moatmarginresearch.com", title: "The Market That Became Too Successful", date: "4 SEP 2026",
  aim: [960, 600], s1: 1.08,
  paras: (a) => [{segs: ["... A rival could copy the technology. ", {t: "It could not instantly copy the crowd.", hl: a("w09", 0.8), hlDur: 22}]}]});
const w09b: React.FC<SP> = ({s0, d}) => {      // a rival with serious backing came in 2022 ... could not keep up
  const f = useTicks(), a = useAt(s0);
  return (
    <AbsoluteFill style={{background: C.mapWater}}>
      <Layer cam={camI(f, [[0, 1.75, 1080, 520], [22, 1.12, 1060, 520, outCubic], [d * 0.55, 1.12, 1060, 520], [d * 0.55 + 18, 1.0, 960, 540, outCubic], [d, 1.0, 960, 540]], "c6", "pull")}>
        <IndiaHub f={f} litAt={-80} hubAt={-60} rival={0} rivalLit={a("w09", 5.0)} drift={1}/>
      </Layer>
      {pop(f, a("w09", 5.0), "Serious backing", 1500, 300, {size: 44, dark: true})}
      <MarkerText f={f} at={a("w09", 8.0)} text="busiest markets: IEX" x={760} y={160} size={60} rot={-3}/>
      <SourceTag f={f} at={0} text="Our article · 4 Sep 2026 (rival = Hindustan Power Exchange)"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
const w09c: React.FC<SP> = ({s0, d}) => <Words f={useTicks()} d={d} text="So far." at={2} size={240} mark={["far."]} markAt={8} chip="Our article · 4 Sep 2026"/>;
const w10a: React.FC<SP> = ({s0, d}) => {      // Kind five: a licence, the rule-maker's permission to operate
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.06, 960, 560], [d, 1.0, 960, 540]]} chip="Our plain words (licence)">
      <MiniStrip f={f} at={0} lit={4} y={110} out={a("w10", 2.0)}/>
      <div style={{position: "absolute", left: 960 - 330, top: 230, width: 660, height: 720, background: "#FBF8F1", boxShadow: "0 16px 34px rgba(30,20,10,0.26)", transform: "rotate(-1.5deg)"}}>
        {Array.from({length: 9}).map((_, i) => <div key={i} style={{margin: "40px 60px 0", height: 14, background: "#DCD5C7", width: `${60 + (i * 13) % 35}%`}}/>)}
      </div>
      <Stamp f={f} at={a("w10", 3.2)} text="PERMISSION" x={960} y={640} size={96} rot={-8}/>
      {pop(f, a("w10", 1.0), "Licence", 1480, 520, {size: 66, dark: true, rot: 4})}
    </Desk>
  );
};
const w10b = DocShot({chip: "Our article · 9 Aug 2026", font: "article", size: 40, head: "moatmarginresearch.com", title: "Wide-Moat Stocks in India", date: "9 AUG 2026", aim: [960, 600], s1: 1.08,
  paras: (a) => [{segs: ["... structurally protected by something other than the company's own competitive strength — ", {t: "regulatory licensing", hl: a("w10", 5.4), hlDur: 9},
    ", import barriers ... ", {t: "They are also borrowed, and the lender can call them in.", hl: a("w10", 6.1), hlDur: 20}]}],
  over: (f, a) => pop(f, a("w10", 6.9), "Borrowed", 1560, 880, {size: 64, bg: C.markerRed, color: C.white, rot: -4})});
const w10c: React.FC<SP> = ({s0, d}) => {      // PAUSE: demat account = an online locker
  const f = useTicks(), a = useAt(s0);
  const shut = ease(f, a("w10", 11.6), a("w10", 11.6) + 8, outCubic);
  return (
    <AbsoluteFill>
      <PauseCard f={f} term="demat account" note="an online locker for shares (our words)" at={0}/>
      <div style={{position: "absolute", left: 1450, top: 330, width: 300, height: 380, background: "#7D766B", border: "10px solid #4A443C", borderRadius: 10}}>
        <div style={{position: "absolute", left: 40, top: 70 + 220 * clamp01((f - a("w10", 10.6)) / 14), width: 220, height: 130, background: "#F3E6C4", border: "4px solid #B9A06A",
          opacity: f < a("w10", 10.6) ? 0 : 1 - shut, fontFamily: F.serif, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center"}}>SHARES</div>
        <div style={{position: "absolute", inset: -10, background: "#5E574D", border: "10px solid #3E3830", borderRadius: 10, transform: `perspective(900px) rotateY(${(1 - shut) * -80}deg)`,
          transformOrigin: "0 50%", display: "flex", alignItems: "center", justifyContent: "center"}}><Icon name="locker" size={140} color="#E8E2D6"/></div>
      </div>
      <SourceTag f={f} at={0} text="Our words"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
const w10d = DocShot({chip: "Our article · 9 Aug 2026", font: "article", size: 44, head: "moatmarginresearch.com", title: "Wide-Moat Stocks in India", date: "9 AUG 2026", aim: [960, 600], s1: 1.08,
  paras: (a) => [{segs: ["The network effect is textbook. ", {t: "Every demat account in the country sits with CDSL or NSDL.", hl: a("w10", 13.4), hlDur: 26}]}]});
const w10e: React.FC<SP> = ({s0, d}) => {      // two locker buildings
  const f = useTicks(), a = useAt(s0);
  const bld = (x: number, name: string, at: number) => (
    <React.Fragment>
      <div style={{position: "absolute", left: x - 220, top: 330, transform: `scale(${spr(f, at - 8, 12, 180)})`, transformOrigin: "50% 100%"}}><Icon name="bank" size={440}/></div>
      {pop(f, at, name, x, 820, {size: 70, dark: true})}
    </React.Fragment>
  );
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 520]]} chip="Our article · 9 Aug 2026">
      {bld(560, "CDSL", a("w10", 15.9))}{bld(1360, "NSDL", a("w10", 16.8))}
      {Array.from({length: 40}).map((_, i) => {
        const t = ((f + i * 7) % 60) / 60, side = i % 2 ? 1360 : 560;
        return <div key={i} style={{position: "absolute", left: 960 + (side - 960) * t - 14, top: 120 + random("lk" + i) * 120 + t * 360, opacity: f > 4 ? 0.8 * (1 - t) : 0}}>
          <Icon name="locker" size={28} color={C.inkSoft}/></div>;
      })}
    </Desk>
  );
};
const w10f: React.FC<SP> = ({s0, d}) => {      // But a moat made of rules has a catch.
  const f = useTicks(), a = useAt(s0);
  const cr = ease(f, a("w10", 19.0), a("w10", 19.0) + 10, outCubic);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 560], [d, 1.1, 960, 600]]} chip="Our article · 9 Aug 2026">
      <div style={{position: "absolute", left: 960 - 330, top: 230, width: 660, height: 720, background: "#FBF8F1", boxShadow: "0 16px 34px rgba(30,20,10,0.26)", transform: "rotate(-1.5deg)"}}/>
      <Stamp f={f} at={-40} text="PERMISSION" x={960} y={640} size={96} rot={-8}/>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        <path d="M 640 560 L 760 640 L 820 600 L 930 700 L 1010 650 L 1120 740 L 1280 690" fill="none" stroke={C.ink} strokeWidth={7} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cr}/>
      </svg>
      {label(f, a("w10", 19.3), "A catch", 960, 960)}
    </Desk>
  );
};

// =====================================================================================================
// Chapter 4 · How do you spot a fake moat?
// =====================================================================================================
const f01a: React.FC<SP> = ({d}) => <ChapterQ f={useTicks()} d={d} n={4} q="How do you spot a fake moat?"/>;
const f01b = DocShot({size: 54, chip: "Berkshire letter for 2007 · written Feb 2008", head: "Berkshire Hathaway · letter for 2007 (retyped excerpt)", aim: [960, 540], s1: 1.12,
  paras: (a) => [{segs: ["Business history is filled with ", {t: "“Roman Candles,”", hl: a("f01", 8.8), hlDur: 8}, " companies whose ", {t: "moats proved illusory and were soon crossed", hl: a("f01", 4.6), hlDur: 30}, "."]}]});
const f01c: React.FC<SP> = ({s0, d}) => {      // painted-cloth moat; rivals stroll across
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 560]]} chip="Our picture">
      <Castle f={f} y={520} painted/>
      <Attackers f={f} at={4} y={520} cross color={C.markerRed}/>
      {label(f, a("f01", 9.4), "Roman Candles", 960, 960)}
    </Desk>
  );
};
const f01d: React.FC<SP> = ({s0, d}) => {      // A Roman candle is a firework. Bright, then gone.
  const f = useTicks(), a = useAt(s0);
  const dark = ease(f, a("f01", 13.3), a("f01", 13.3) + 14, inOut);
  return (
    <AbsoluteFill>
      <InkSurface/>
      <div style={{opacity: 0.55}}><Castle f={f} y={720} s={0.75} tone="#1C1814"/></div>
      <Firework f={f} at={a("f01", 11.6)} x={960} y={330} life={44}/>
      <AbsoluteFill style={{background: "#000", opacity: dark * 0.6}}/>
      <SourceTag f={f} at={0} text="Berkshire letter for 2007" dark/>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};
const f02a: React.FC<SP> = ({s0, d}) => {      // What makes a fake one look real?
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.08, 960, 560], [d, 1.0, 960, 540]]} chip="Our question">
      <Castle f={f} y={520} painted/>
      <MarkerText f={f} at={a("f02", 0.9)} text="looks real?" x={960} y={180} size={130} rot={-4}/>
    </Desk>
  );
};
const Plane: React.FC<{f: number; x: number; y: number; crack?: number; w?: number}> = ({f, x, y, crack = 0, w = 560}) => (
  <div style={{position: "absolute", left: x - w / 2, top: y - w * 0.3, width: w, height: w * 0.6, background: "#FBF8F1", boxShadow: "0 14px 30px rgba(30,20,10,0.25)", transform: "rotate(-2deg)"}}>
    <div style={{position: "absolute", left: w * 0.1, top: w * 0.02}}><Icon name="plane" size={w * 0.56}/></div>
    {crack > 0 ? <svg width={w} height={w * 0.6} style={{position: "absolute", left: 0, top: 0}}><path d={`M 0 0 L ${w * 0.3} ${w * 0.22} L ${w * 0.45} ${w * 0.18} L ${w * 0.62} ${w * 0.4} L ${w} ${w * 0.6}`}
      fill="none" stroke={C.ink} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack}/></svg> : null}
  </div>
);
const f02b: React.FC<SP> = ({s0, d}) => {      // In 1989, Berkshire put $358 million into an airline.
  const f = useTicks(), a = useAt(s0);
  const slide = ease(f, 0, 14, outQuint);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 900, 540], [d, 1.0, 1020, 540]]} chip="Berkshire letter for 1989 · USAir as the example = our reading">
      <Timeline f={f} at={0} years={[1986, 1987, 1988, 1989, 1990, 1991]} from={1986} to={1989} moveAt={4} moveDur={18} y={940} x0={420} x1={1500}/>
      <div style={{transform: `translateX(${(1 - slide) * 1400}px)`}}><Plane f={f} x={760} y={430}/></div>
      {pop(f, a("f02", 6.6), "USAir", 1380, 300, {size: 70, dark: true, rot: 3})}
      <Num f={f} at={a("f02", 4.1)} to={358} x={1360} y={520} size={170} pre="$" suf="M" color={C.ink} dur={26}/>
    </Desk>
  );
};
const f03a: React.FC<SP> = ({s0, d}) => {      // In 1994 the airline stopped the regular payments
  const f = useTicks(), a = useAt(s0);
  const freeze = a("f03", 2.4);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.04, 960, 540]]} chip="Berkshire letter for 1994 · dividend suspended Sep 1994">
      <Plane f={f} x={480} y={420} w={420}/>
      {pop(f, 2, "Berkshire", 1500, 420, {size: 60, dark: true})}
      {Array.from({length: 7}).map((_, i) => {
        const t = f < freeze ? ((f / 26 + i / 7) % 1) : ((freeze / 26 + i / 7) % 1);
        const fall = f < freeze ? 0 : Math.pow(Math.max(0, f - freeze - i), 2) * 0.9;
        return <div key={i} style={{position: "absolute", left: 700 + 600 * t - 30, top: 430 - Math.sin(t * Math.PI) * 120 + fall}}><Icon name="coin" size={60} color="#7A5C1E" fill="#D8BD72"/></div>;
      })}
      <Stamp f={f} at={a("f03", 2.9)} text="STOPPED · SEP 1994" x={960} y={780} size={70} rot={-6}/>
    </Desk>
  );
};
const f03b: React.FC<SP> = ({s0, d}) => {      // marked it down to a quarter: $358M -> $89.5M
  const f = useTicks(), a = useAt(s0);
  const flip = f >= a("f03", 5.6);
  return (
    <Desk f={f} d={d} tone="ink" chip="Berkshire letter for 1994 · written down at yearend" cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 520]]}>
      <div style={{position: "absolute", left: 960, top: 430, transform: `translate(-50%,-50%) rotateX(${flip ? Math.max(0, 80 - (f - a("f03", 5.6)) * 10) : 0}deg)`, fontFamily: F.serif,
        fontSize: 230, color: flip ? C.markerRed : C.white}}>{flip ? "$89.5M" : "$358M"}</div>
      {pop(f, a("f03", 6.0), "25¢ per $1", 960, 660, {size: 60, bg: C.highlightPrint, color: C.ink})}
    </Desk>
  );
};
const f03c: React.FC<SP> = ({s0, d}) => <Words f={useTicks()} d={d} text="Why trust it?" at={2} mark={["trusted"]} markAt={useAt(s0)("f03", 8.0)} size={150} chip="Our question"/>;
const f03d = DocShot({chip: "Berkshire letter for 1996 · two reasons: record of profits, senior security", head: "Berkshire Hathaway · letter for 1996 (retyped excerpt)", aim: [960, 540], s1: 1.12,
  paras: (a) => [{segs: ["I was so ", {t: "beguiled by the company's long history of profitable operations", hl: a("f03", 11.3), hlDur: 34},
    ", and by the protection that ownership of a senior security seemingly offered me, that I overlooked the crucial point ..."]}]});
const f03e: React.FC<SP> = ({s0, d}) => {      // red carpet of $ painted on the floor
  const f = useTicks(), a = useAt(s0);
  const unroll = ease(f, 0, 24, outCubic), tilt = ease(f, 26, 46, inOut);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 500], [d, 1.0, 960, 560]]} chip="Our picture">
      <div style={{position: "absolute", left: 160, top: 560, width: 1600 * unroll, height: 220, background: "#B4322F", transform: `perspective(900px) rotateX(${tilt * 62}deg)`,
        transformOrigin: "50% 100%", overflow: "hidden", display: "flex", alignItems: "center", gap: 40, paddingLeft: 40}}>
        {Array.from({length: 14}).map((_, i) => <span key={i} style={{fontFamily: F.serif, fontSize: 110, color: "#F2C230"}}>$</span>)}
      </div>
      <Plane f={f} x={1500} y={360} w={360}/>
      {label(f, a("f03", 14.3), "Charmed by the past", 960, 950)}
    </Desk>
  );
};
const f04a: React.FC<SP> = ({s0, d}) => {      // Our first sign: a long past of profits
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.04, 960, 540], [d, 1.0, 960, 540]]} chip="Our signs">
      <div style={{position: "absolute", left: 420, top: 220, width: 1080, height: 640, background: "#FBF8F1", boxShadow: "0 16px 34px rgba(30,20,10,0.26)", transform: "rotate(-1deg)"}}>
        <div style={{position: "absolute", left: 50, top: 40}}><Icon name="warn" size={110} color={C.markerRed}/></div>
        <div style={{position: "absolute", left: 190, top: 64, fontFamily: F.serif, fontSize: 64, color: C.ink}}>Fake moat?</div>
      </div>
      <CheckBox f={f} at={4} tickAt={a("f04", 3.0)} n={1} x={640} y={560}/>
      <div style={{position: "absolute", left: 760, top: 520, fontFamily: F.sans, fontWeight: 900, fontSize: 64, color: C.ink, opacity: ease(f, a("f04", 2.7), a("f04", 3.0))}}>PAST PROFITS</div>
    </Desk>
  );
};
const f04b: React.FC<SP> = ({s0, d}) => {      // Our second: a moat you must keep rebuilding
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 1000, 540], [d, 1.0, 920, 540]]} chip="Our signs · Berkshire letter for 2007">
      <CheckBox f={f} at={2} tickAt={a("f04", 6.0)} n={2} x={420} y={300}/>
      <div style={{position: "absolute", left: 540, top: 262, fontFamily: F.sans, fontWeight: 900, fontSize: 64, color: C.ink, opacity: ease(f, 4, 10)}}>ALWAYS REBUILDING</div>
      <RebuildWall f={f} at={6} x={960} y={820}/>
    </Desk>
  );
};
const f04c = DocShot({size: 54, chip: "Berkshire letter for 2007 · written Feb 2008", head: "Berkshire Hathaway · letter for 2007 (retyped excerpt)", aim: [960, 540], s1: 1.18,
  paras: (a) => [{segs: [{t: "A moat that must be continuously rebuilt will eventually be no moat at all.", hl: a("f04", 9.0), hlDur: 50}]}]});

// =====================================================================================================
// Chapter 5 · Can one star person be a moat?
// =====================================================================================================
const s01a: React.FC<SP> = ({d}) => <ChapterQ f={useTicks()} d={d} n={5} q="Can one star person be a moat?" icon="star"/>;
const Spot: React.FC<{f: number; x: number; y?: number; o?: number}> = ({f, x, y = 0, o = 1}) => (
  <div style={{position: "absolute", left: x - 520, top: y - 100, width: 1040, height: 1300, opacity: o,
    background: "radial-gradient(ellipse 30% 70% at 50% 0%, rgba(255,240,190,0.0), rgba(0,0,0,0) 10%), conic-gradient(from 165deg at 50% 0%, rgba(0,0,0,0) 0deg, rgba(255,236,170,0.55) 10deg, rgba(255,236,170,0.55) 20deg, rgba(0,0,0,0) 30deg)"}}/>
);
const s01b: React.FC<SP> = ({s0, d}) => {      // a superstar
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" chip="Berkshire letter for 2007" cam={[[0, 1.06, 960, 560], [d, 1.0, 960, 560]]}>
      <Spot f={f} x={960} o={ease(f, 2, 10)}/>
      <Fig x={960} y={900} s={2.3} color="#2A2520" star/>
      <Stamp f={f} at={a("s01", 6.5)} text="NOT GREAT" x={1430} y={520} size={86} rot={-10}/>
    </Desk>
  );
};
const s01c = DocShot({chip: "Berkshire letter for 2007 · written Feb 2008", head: "Berkshire Hathaway · letter for 2007 (retyped excerpt)", aim: [960, 540], s1: 1.1,
  paras: (a) => [{segs: ["But ", {t: "if a business requires a superstar to produce great results", hl: a("s01", 5.3), hlDur: 26}, ", the business itself ", {t: "cannot be deemed great", hl: a("s01", 6.6), hlDur: 10},
    ".  A medical partnership led by ", {t: "your area’s premier brain surgeon", hl: a("s01", 9.2), hlDur: 14}, " may enjoy outsized and growing earnings ..."]}]});
const Clinic: React.FC<{f: number; walk?: number; queueAt?: number; scatter?: number; ring?: boolean}> = ({f, walk = 0, queueAt = 0, scatter = 0, ring = true}) => {
  const sx = 1100 + walk * 1100;
  return (
    <>
      <div style={{position: "absolute", left: 280, top: 300, width: 620, height: 520, background: "#E7DCC6", boxShadow: "0 14px 30px rgba(30,20,10,0.25)"}}>
        <div style={{position: "absolute", left: 230, top: 60, width: 160, height: 160, background: C.white, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: F.sans, fontWeight: 900, fontSize: 130, color: C.markerRed}}>+</div>
        <div style={{position: "absolute", left: 250, bottom: 0, width: 120, height: 200, background: "#3A3129"}}/>
      </div>
      <Spot f={f} x={sx} y={-40}/>
      {ring ? <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}><ellipse cx={sx} cy={860} rx={170} ry={46} fill="none" stroke="#4F86C6" strokeWidth={26}/></svg> : null}
      <Fig x={sx} y={860} s={1.6} color="#2A2520" star/>
      {Array.from({length: 5}).map((_, i) => <Fig key={i} x={560 + i * 90 + scatter * (i - 2) * 300} y={960 + scatter * (i % 2 ? -60 : 40)} s={0.75} color="#5A4E42"
        dim={scatter}/>)}
    </>
  );
};
const s01d: React.FC<SP> = ({s0, d}) => {      // a clinic led by the area's best brain surgeon
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 1000, 540], [d, 1.05, 960, 560]]} chip="Berkshire letter for 2007 · faceless figures">
      <Clinic f={f}/>
      {label(f, a("s01", 9.9), "Star surgeon", 1400, 300, {dark: true})}
    </Desk>
  );
};
const s02a: React.FC<SP> = ({s0, d}) => {      // quote band
  const f = useTicks(), a = useAt(s0);
  const band = ease(f, 0, 12, outQuint);
  return (
    <AbsoluteFill>
      <Paper tone="kraft"/>
      <div style={{position: "absolute", left: 0, top: 330, width: W * band, height: 420, background: C.ink, boxShadow: "0 20px 40px rgba(0,0,0,0.35)"}}/>
      <div style={{position: "absolute", left: 160, right: 160, top: 400, fontFamily: F.serif, fontStyle: "italic", fontSize: 92, lineHeight: 1.12, color: C.white,
        opacity: ease(f, 6, 16)}}>“The partnership’s moat will go when the surgeon goes.”</div>
      <div style={{position: "absolute", left: 160, top: 680, fontFamily: F.sans, fontWeight: 800, fontSize: 32, letterSpacing: 3, color: C.highlightPrint,
        opacity: ease(f, a("s02", 2.2), a("s02", 2.6))}}>PARTNERSHIP = THE CLINIC</div>
      <SourceTag f={f} at={0} text="Berkshire letter for 2007 · quote"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
const s02b: React.FC<SP> = ({s0, d}) => {      // the surgeon walks off, the queue scatters
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.05, 960, 560], [d, 1.0, 960, 540]]} chip="Our picture">
      <Clinic f={f} walk={ease(step(f, 2), 4, 40, inOut)} scatter={ease(f, 26, 44, outCubic)}/>
    </Desk>
  );
};
const s02c: React.FC<SP> = ({s0, d}) => {      // The Mayo Clinic is different; cannot name its boss
  const f = useTicks(), a = useAt(s0);
  const spin = f >= a("s02", 9.4) ? (f - a("s02", 9.4)) * 30 : 0;
  return (
    <Desk f={f} d={d} cam={[[0, 1.1, 960, 520], [d, 1.0, 960, 540, outCubic]]} chip="Berkshire letter for 2007 · generic campus, not Mayo's buildings">
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}><ellipse cx={960} cy={720} rx={820} ry={230} fill="none" stroke="#4F86C6" strokeWidth={60}/></svg>
      {[[560, 330, 300, 360], [880, 240, 340, 450], [1240, 330, 320, 360]].map(([x, y, w, h], i) => <div key={i} style={{position: "absolute", left: x - 60, top: y, width: w, height: h,
        background: i === 1 ? "#D9CDB4" : "#E7DCC6", boxShadow: "0 14px 30px rgba(30,20,10,0.22)",
        backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0) 0 40px, rgba(90,80,60,0.25) 40px 60px), repeating-linear-gradient(0deg, rgba(0,0,0,0) 0 50px, rgba(90,80,60,0.15) 50px 56px)"}}/>)}
      {pop(f, a("s02", 4.5), "Mayo Clinic", 960, 170, {size: 70, dark: true})}
      <div style={{position: "absolute", left: 1490, top: 820, transform: `rotateY(${spin}deg)`, padding: "12px 26px", background: "#FBF8F1", fontFamily: F.sans, fontWeight: 900,
        fontSize: 46, color: C.ink, boxShadow: "0 8px 18px rgba(0,0,0,0.2)", opacity: ease(f, a("s02", 9.0), a("s02", 9.3))}}>CEO: ?</div>
    </Desk>
  );
};
const s02d: React.FC<SP> = ({s0, d}) => {      // Our reading: the moat belongs to the place
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]} chip="Our reading">
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}><ellipse cx={960} cy={720} rx={820} ry={230} fill="none" stroke="#4F86C6" strokeWidth={60}/></svg>
      {[[560, 330, 300, 360], [880, 240, 340, 450], [1240, 330, 320, 360]].map(([x, y, w, h], i) => <div key={i} style={{position: "absolute", left: x - 60, top: y, width: w, height: h,
        background: i === 1 ? "#D9CDB4" : "#E7DCC6", boxShadow: "0 14px 30px rgba(30,20,10,0.22)"}}/>)}
      {label(f, a("s02", 11.4), "Moat in the place", 960, 900, {bg: C.highlight, color: C.ink, dark: false})}
    </Desk>
  );
};

// =====================================================================================================
// Chapter 6 · Does a moat last forever?
// =====================================================================================================
const l01a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <AbsoluteFill>
      <ChapterQ f={f} d={d} n={6} q="Does a moat last forever?"/>
      <MarkerText f={f} at={a("l01", 2.45)} text="No." x={1500} y={850} size={170} rot={-8}/>
      <SourceTag f={f} at={a("l01", 2.45)} text="Our reading"/>
    </AbsoluteFill>
  );
};
const l01b = DocShot({size: 54, chip: "Berkshire letter for 2005 · his own businesses", head: "Berkshire Hathaway · letter for 2005, p.13 (retyped excerpt)", aim: [960, 540], s1: 1.1,
  paras: (a) => [{segs: [{t: "Every day, in countless ways, the competitive position of each of our businesses grows either weaker or stronger.", hl: a("l01", 4.3), hlDur: 60}]}]});
const l01c: React.FC<SP> = ({s0, d}) => {      // day counter, water level bobs
  const f = useTicks(), a = useAt(s0);
  const day = 1 + Math.floor(f / 3);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 560], [d, 1.04, 960, 540]]} chip="Berkshire letter for 2005">
      <Castle f={f} y={560} s={0.85} level={0.5 + 0.5 * Math.sin(f * 0.25)}/>
      <div style={{position: "absolute", left: 1620, top: 160, transform: "translate(-50%,-50%) rotate(3deg)", padding: "10px 24px", background: "#FBF8F1", fontFamily: F.sans, fontWeight: 900,
        fontSize: 52, color: C.ink, boxShadow: "0 8px 18px rgba(0,0,0,0.2)"}}>DAY {day}</div>
      {label(f, 3, "Stronger or weaker", 960, 970)}
    </Desk>
  );
};
const l02a: React.FC<SP> = ({s0, d}) => <Words f={useTicks()} d={d} text="But…" at={1} size={300} chip="Our reading"><Sub f={useTicks()} at={useAt(s0)("l02", 1.6)} text="only under attack" x={960} y={760} color="#B9B2A6" size={50}/></Words>;
const Headline: React.FC<{f: number; at: number; title: string; date: string; x: number; y: number; rot: number}> = ({f, at, title, date, x, y, rot}) => {
  const k = spr(f, at, 12, 210);
  if (f < at) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, width: 1300, transform: `translate(-50%,-50%) translateY(${(1 - k) * 700}px) rotate(${rot + (1 - k) * 8}deg)`,
      background: "#FBF7EE", padding: "30px 46px", boxShadow: "0 16px 30px rgba(20,12,6,0.32)"}}>
      <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: C.markerRed}}>MOATMARGINRESEARCH.COM · {date}</div>
      <div style={{fontFamily: F.serif, fontSize: 62, lineHeight: 1.08, color: C.ink, marginTop: 10}}>{title}</div>
    </div>
  );
};
const l02b: React.FC<SP> = ({s0, d}) => {      // So watch Indian paint: our two articles
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 560]]} chip="Our articles · 21 Jul (upd 17 Aug) & 17 Aug 2026">
      <Headline f={f} at={2} title="The Paint Wars: Six Companies, Not One Wide Moat" date="21 JUL 2026 · UPD 17 AUG" x={900} y={400} rot={-2}/>
      <Headline f={f} at={a("l02", 3.4)} title="Does Asian Paints Have a Moat? The Filings Answer" date="17 AUG 2026" x={1020} y={680} rot={1.5}/>
    </Desk>
  );
};
const l02c = DocShot({chip: "Our article · 17 Aug 2026", font: "article", size: 46, head: "moatmarginresearch.com", title: "Does Asian Paints Have a Moat? The Filings Answer", date: "17 AUG 2026",
  aim: [960, 600], s1: 1.08,
  paras: (a) => [{segs: ["Yes — Asian Paints has a ", {t: "narrow, real moat", hl: a("l02", 6.9), hlDur: 12}, ", it lives in the distribution engine ..."]}],
  over: (f, a) => pop(f, a("l02", 7.6), "Narrow but real", 1480, 930, {size: 52, dark: true, rot: 3})});
const AP_C: [number, number] = [78.9, 22.0];
const IND_PROJ = fitProjection([66, 5.5, 99, 37.5]);
const APX = () => IND_PROJ(AP_C) as [number, number];
const PaintMap: React.FC<{f: number; shops?: number; depots?: number; towns?: number; rivalAt?: number; route?: number}> = ({f, shops, depots, towns, rivalAt, route}) => {
  const geo = useGeo();
  const ind = geo ? geo.features.find((g) => g.properties.a3 === "IND") : null;
  const dots = (n: number, at: number | undefined, seed: string, color: string, r: number, step0: number) => Array.from({length: n}).map((_, i) => {
    if (at == null || f < at + i * step0 || !ind) return null;
    const lon = 68.5 + random(seed + "x" + i) * 28, lat = 8 + random(seed + "y" + i) * 27;
    if (!geoContains(ind as never, [lon, lat])) return null;
    const [x, y] = IND_PROJ([lon, lat]) as [number, number];
    return <circle key={i} cx={x} cy={y} r={r * spr(f, at + i * step0, 10, 220)} fill={color} opacity={0.85}/>;
  });
  return (
    <>
      <MapRoute f={f} geo={geo} inkAt={-40} credit={false}/>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        {dots(220, shops, "sh", "#2F6E8E", 5, 0.25)}
        {dots(137, depots, "dp", C.markerRed, 9, 0.35)}
        {dots(260, towns, "tw", "rgba(224,36,94,0.45)", 5, 0.12)}
        {route != null ? <ellipse cx={APX()[0]} cy={APX()[1]} rx={150} ry={100} fill="none" stroke={C.highlight} strokeWidth={12}
          pathLength={1} strokeDasharray={`${route} 2`}/> : null}
      </svg>
      <div style={{position: "absolute", left: APX()[0] - 55, top: APX()[1] - 60}}><Icon name="castle" size={110} color={C.ink} fill="#F6E7B4"/></div>
      {rivalAt != null ? <StickerLabel f={f} text="Birla Opus" x={1560} y={300} size={64} dark rot={4} enter={{at: rivalAt, mode: "slide", from: [900, 0], dur: 10}}/> : null}
    </>
  );
};
const l02d: React.FC<SP> = ({s0, d}) => {      // 1.65 lakh shops (company's own number, Jul 2024)
  const f = useTicks(), a = useAt(s0);
  return (
    <AbsoluteFill style={{background: C.mapWater}}>
      <Layer cam={camI(f, [[0, 0.8, 960, 560], [20, 1.0, 960, 540, outCubic], [d, 1.04, 960, 540]], "c7", "pull")}><PaintMap f={f} shops={a("l02", 10.2)}/></Layer>
      {pop(f, a("l02", 4.5) < 0 ? 4 : 4, "Asian Paints", 380, 200, {size: 56, dark: true})}
      <div style={{position: "absolute", left: 1530, top: 720, transform: "translate(-50%,-50%)", padding: "16px 28px", background: "rgba(14,14,14,0.85)", textAlign: "center", opacity: ease(f, a("l02", 12.0), a("l02", 12.4))}}>
        <Num f={f} at={a("l02", 12.0)} to={1.65} dec={2} x={150} y={60} size={120} color={C.highlightPrint} dur={30} slam={false}/>
        <div style={{width: 300, height: 120}}/>
        <div style={{fontFamily: F.sans, fontWeight: 900, fontSize: 36, color: C.white, letterSpacing: 2}}>LAKH SHOPS</div>
      </div>
      <SourceTag f={f} at={0} text="Asian Paints call 17 Jul 2024 · company's own number · dots are a picture"/>
      <SourceTag f={f} at={0} text="Map: Natural Earth (India view)" pos="br"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
const l03a: React.FC<SP> = ({s0, d}) => {      // Then a rival with money stepped in: Birla Opus
  const f = useTicks(), a = useAt(s0);
  return (
    <AbsoluteFill style={{background: C.mapWater}}>
      <Layer cam={camI(f, [[0, 1.04, 960, 540], [d, 1.0, 1000, 540]], "c8", "pull")}><PaintMap f={f} shops={-200} rivalAt={a("l03", 2.4)}/></Layer>
      <SourceTag f={f} at={0} text="Birla Opus's own claims · as quoted in our article of 21 Jul 2026"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
const l03b: React.FC<SP> = ({s0, d}) => {      // ₹10,000 crore announced
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" chip="Company's claim · as quoted in our article of 21 Jul 2026" cam={[[0, 1.05, 960, 540], [d, 1.0, 960, 540]]}>
      <Num f={f} at={a("l03", 6.9)} to={10000} x={960} y={470} size={210} pre="₹" preSans suf=" crore" dur={36} color={C.highlightPrint}/>
      {pop(f, a("l03", 5.6), "Announced", 960, 680, {size: 56, bg: C.markerRed, color: C.white})}
      {pop(f, 3, "Birla Opus", 960, 250, {size: 56})}
    </Desk>
  );
};
const l03c: React.FC<SP> = ({s0, d}) => {      // 137 depots in 11 months
  const f = useTicks(), a = useAt(s0);
  const ring = ease(f, a("l03", 12.9), a("l03", 12.9) + 24, inOut);
  const n = Math.min(137, Math.max(0, Math.floor((f - a("l03", 11.0)) / 0.35)));
  return (
    <AbsoluteFill style={{background: C.mapWater}}>
      <Layer cam={camI(f, [[0, 1.0, 960, 540], [d, 1.06, 940, 540]], "c9", "pull")}><PaintMap f={f} shops={-200} depots={a("l03", 11.0)}/></Layer>
      <div style={{position: "absolute", left: 1560, top: 380, transform: "translate(-50%,-50%)", padding: "16px 30px", background: "rgba(14,14,14,0.85)", textAlign: "center"}}>
        <div style={{fontFamily: F.serif, fontSize: 120, color: C.highlightPrint, lineHeight: 1}}>{n}</div>
        <div style={{fontFamily: F.sans, fontWeight: 900, fontSize: 34, color: C.white, letterSpacing: 2}}>DEPOTS</div>
      </div>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        <circle cx={1560} cy={760} r={90} fill="rgba(14,14,14,0.85)"/>
        <circle cx={1560} cy={760} r={70} fill="none" stroke={C.highlightPrint} strokeWidth={16} strokeDasharray={`${440 * ring} 440`} transform="rotate(-90 1560 760)"/>
      </svg>
      <div style={{position: "absolute", left: 1560, top: 760, transform: "translate(-50%,-50%)", fontFamily: F.serif, fontSize: 64, color: C.white}}>{Math.round(11 * ring)}</div>
      <div style={{position: "absolute", left: 1560, top: 880, transform: "translate(-50%,-50%)", fontFamily: F.sans, fontWeight: 900, fontSize: 30, color: C.ink, letterSpacing: 2}}>MONTHS</div>
      <SourceTag f={f} at={0} text="Birla Opus's own claims · as quoted in our article of 21 Jul 2026 · dots are a picture"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
const l03d: React.FC<SP> = ({s0, d}) => {      // 6,600+ towns, pull back: the castle ringed
  const f = useTicks(), a = useAt(s0);
  return (
    <AbsoluteFill style={{background: C.mapWater}}>
      <Layer cam={camI(f, [[0, 1.12, 940, 540], [d, 0.92, 960, 540, outCubic]], "c10", "pull")}><PaintMap f={f} shops={-200} depots={-200} towns={2}/></Layer>
      <div style={{position: "absolute", left: 1560, top: 380, transform: "translate(-50%,-50%)", padding: "16px 30px", background: "rgba(14,14,14,0.85)", textAlign: "center"}}>
        <div style={{fontFamily: F.serif, fontSize: 110, color: C.highlightPrint, lineHeight: 1}}>{Math.round(6600 * ease(f, 2, 30)).toLocaleString("en-IN")}+</div>
        <div style={{fontFamily: F.sans, fontWeight: 900, fontSize: 34, color: C.white, letterSpacing: 2}}>TOWNS</div>
      </div>
      <SourceTag f={f} at={0} text="Birla Opus's own claims · as quoted in our article of 21 Jul 2026 · dots are a picture"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
const l04a: React.FC<SP> = ({s0, d}) => {      // Grasim, the company behind it
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 900, 540], [d, 1.0, 1020, 540]]} chip="Our article · 21 Jul 2026">
      {pop(f, 2, "Grasim", 700, 480, {size: 110, dark: true, rot: -3})}
      {pop(f, a("l04", 1.0), "Behind Birla Opus", 1250, 640, {size: 56, rot: 3})}
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}><path d="M 860 540 Q 1000 560 1080 620" fill="none" stroke={C.markerRed} strokeWidth={9}
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(f, a("l04", 1.4), a("l04", 1.4) + 10)}/></svg>
    </Desk>
  );
};
const l04b: React.FC<SP> = ({s0, d}) => {      // In one year, big paint makers together
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.06, 960, 560], [d, 1.0, 960, 540]]} chip="Grasim's figure · industry-wide · year to Mar 2025">
      {Array.from({length: 5}).map((_, i) => <IconDisc key={i} f={f} at={3 + i * 3} name="factory" x={380 + i * 290} y={500} size={210}/>)}
      {pop(f, a("l04", 3.8), "Year to Mar 2025", 960, 800, {size: 56, dark: true})}
    </Desk>
  );
};
const l04c: React.FC<SP> = ({s0, d}) => {      // about 40% more paint: 100 -> 140 tins (our picture)
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" chip="Grasim's figure · organised makers · our picture of ~40%" cam={[[0, 1.0, 960, 540], [d, 1.03, 960, 560]]}>
      <div style={{position: "absolute", left: 120, top: 90, fontFamily: F.serif, fontSize: 76, color: C.white}}>About 40% more</div>
      <PictoGrid f={f} icon="tin" n={140} fill={100} at={-200} x={960} y={610} cell={60} cols={14} color="#CFC9BE" addFrom={100} addAt={a("l04", 8.0)}/>
    </Desk>
  );
};
const l04d: React.FC<SP> = ({s0, d}) => {      // So did Asian Paints' moat hold?
  const f = useTicks(), a = useAt(s0);
  return (
    <AbsoluteFill style={{background: C.mapWater}}>
      <Layer cam={camI(f, [[0, 1.0, 960, 540], [d, 1.25, APX()[0], APX()[1]]], "c11", "pull")}><PaintMap f={f} shops={-200} depots={-200} towns={-200}/></Layer>
      <MarkerText f={f} at={a("l04", 10.8)} text="did it hold?" x={960} y={200} size={120} rot={-4}/>
      <SourceTag f={f} at={0} text="Our question · dots are a picture"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
const l04e = DocShot({chip: "Our article · 21 Jul 2026 (upd 17 Aug)", font: "article", size: 56, head: "moatmarginresearch.com", title: "The Paint Wars: Six Companies, Not One Wide Moat", date: "21 JUL 2026",
  aim: [960, 600], s1: 1.08, paras: (a) => [{segs: [{t: "The incumbent's advantage is real but bypassable.", hl: a("l04", 13.9), hlDur: 30}]}]});
const l04f: React.FC<SP> = ({s0, d}) => {      // Nobody knows the ending yet.
  const f = useTicks(), a = useAt(s0);
  return (
    <AbsoluteFill style={{background: C.mapWater}}>
      <Layer cam={camI(f, [[0, 1.15, APX()[0], 520], [d, 1.0, 960, 540]], "c12", "pull")}><PaintMap f={f} shops={-200} depots={-200} towns={-200} route={ease(f, 2, 26, inOut)}/></Layer>
      {label(f, a("l04", 17.2), "No ending yet", 960, 960)}
      <SourceTag f={f} at={0} text="Our articles · no forecast"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
const l05a: React.FC<SP> = ({s0, d}) => <Words f={useTicks()} d={d} text="The catch with rules" at={2} mark={["rules"]} markAt={useAt(s0)("l05", 1.1)} size={150} chip="Our question"/>;
const l05b = DocShot({chip: "Our article · 9 Aug 2026 · fees at CDSL's KYC unit", font: "article", size: 44, head: "moatmarginresearch.com", title: "Wide-Moat Stocks in India", date: "9 AUG 2026",
  aim: [960, 600], s1: 1.08,
  paras: (a) => [{segs: ["Then, last quarter, this happened. ", {t: "SEBI mandated a 20% cut in KRA fetch charges", hl: a("l05", 2.5), hlDur: 22}, ", from ₹35 to ₹28, and a 75% cut in creation charges, from ₹20 to ₹5. ",
    {t: "CDSL's KYC subsidiary", hl: a("l05", 6.0), hlDur: 10}, " CVL ..."]}],
  over: (f, a) => pop(f, a("l05", 3.4), "SEBI = rule-maker", 1500, 920, {size: 50, dark: true, rot: 3})});
const l05c: React.FC<SP> = ({s0, d}) => {      // ₹35 -> ₹28, ₹20 -> ₹5
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [a("l05", 10.9), 1.0, 960, 540], [d, 1.12, 1290, 560, inOut]]} chip="Our article · 9 Aug 2026">
      <RupeeTag f={f} x={640} y={330} from="₹35" to="₹28" at={a("l05", 9.6)} stampAt={a("l05", 10.3)}/>
      <RupeeTag f={f} x={1290} y={330} from="₹20" to="₹5" at={a("l05", 12.4)} stampAt={a("l05", 12.9)}/>
      {label(f, a("l05", 12.6), "Rules changed", 960, 960)}
    </Desk>
  );
};
const l06a: React.FC<SP> = ({s0, d}) => {      // And IEX's crowd, so far?
  const f = useTicks(), a = useAt(s0);
  return (
    <AbsoluteFill style={{background: C.mapWater}}>
      <Layer cam={camI(f, [[0, 1.1, 960, 520], [d, 1.0, 960, 540]], "c13", "pull")}><IndiaHub f={f} litAt={-80} hubAt={-60} rival={-50} rivalLit={-50}/></Layer>
      <SourceTag f={f} at={0} text="Our article (IEX) · dots are a picture"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
const l06b: React.FC<SP> = ({s0, d}) => {      // draft rules, 17 Apr 2026
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 500]]} chip="CERC draft 17 Apr 2026 (cited in our IEX article)">
      <div style={{position: "absolute", left: 960 - 560, top: 160 + (1 - ease(f, 0, 12, outQuint)) * 800, width: 1120, height: 760, background: "#FBF8F1", boxShadow: "0 16px 34px rgba(30,20,10,0.26)",
        transform: "rotate(-1deg)", padding: "60px 80px", boxSizing: "border-box", textAlign: "center"}}>
        <div style={{fontFamily: F.mono, fontSize: 26, letterSpacing: 3, color: C.grey}}>CENTRAL ELECTRICITY REGULATORY COMMISSION</div>
        <div style={{fontFamily: F.serif, fontSize: 64, lineHeight: 1.1, color: C.ink, marginTop: 40, backgroundImage: `linear-gradient(90deg, ${C.highlight}, ${C.highlight})`, backgroundRepeat: "no-repeat",
          backgroundSize: `${100 * ease(f, a("l06", 5.6), a("l06", 5.6) + 26, inOut)}% 80%`, backgroundPosition: "0 70%"}}>Power Market (Second Amendment) Regulations, 2026</div>
        <div style={{fontFamily: F.sans, fontWeight: 900, fontSize: 40, color: C.markerRed, marginTop: 40, letterSpacing: 3}}>DRAFT · 17 APR 2026</div>
      </div>
      {pop(f, a("l06", 5.0), "Power rule-maker", 1560, 900, {size: 46, dark: true, rot: 3})}
    </Desk>
  );
};
const l06c: React.FC<SP> = ({s0, d}) => {      // pool all exchanges' bids into one price
  const f = useTicks(), a = useAt(s0);
  const p = ease(f, a("l06", 8.6), a("l06", 8.6) + 30, inOut);
  const hubs: [number, number, string][] = [[420, 250, "IEX"], [420, 540, "Rival"], [420, 830, "Rival"]];
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 1000, 540], [d, 1.0, 920, 540]]} chip="CERC draft 17 Apr 2026 · our article (IEX)">
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        {hubs.map(([x, y], i) => <path key={i} d={`M ${x + 90} ${y} C ${x + 500} ${y}, 1000 540, 1300 540`} fill="none" stroke={C.markerRed} strokeWidth={10} pathLength={1}
          strokeDasharray={`${p} 2`}/>)}
      </svg>
      {hubs.map(([x, y, t], i) => <React.Fragment key={i}><IconDisc f={f} at={2 + i * 3} name="bolt" x={x} y={y} size={150}/>{pop(f, 4 + i * 3, t, x, y + 110, {size: 36, dark: true})}</React.Fragment>)}
      <div style={{position: "absolute", left: 1300, top: 400, width: 420, height: 280, background: C.ink, color: C.highlightPrint, clipPath: "polygon(0 0, 100% 30%, 100% 70%, 0 100%)",
        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.serif, fontSize: 64, opacity: ease(f, a("l06", 10.0), a("l06", 10.4))}}>One price</div>
      {pop(f, a("l06", 9.4), "Bids = offers", 1500, 820, {size: 40})}
    </Desk>
  );
};
const l06d: React.FC<SP> = ({s0, d}) => {      // On 5 Oct, no final rules
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" cam={[[0, 1.06, 960, 520], [d, 1.0, 960, 540]]} chip="Our check 5 Oct 2026 · CERC draft 17 Apr 2026">
      <div style={{position: "absolute", left: 960 - 560, top: 160, width: 1120, height: 760, background: "#FBF8F1", boxShadow: "0 16px 34px rgba(30,20,10,0.26)", transform: "rotate(-1deg)",
        padding: "60px 80px", boxSizing: "border-box", textAlign: "center"}}>
        <div style={{fontFamily: F.serif, fontSize: 60, lineHeight: 1.1, color: C.ink, marginTop: 60}}>Power Market (Second Amendment) Regulations, 2026</div>
      </div>
      <Stamp f={f} at={a("l06", 13.4)} text="DRAFT" x={960} y={620} size={150} rot={-12}/>
      {label(f, a("l06", 14.3), "Not final · 5 Oct", 960, 970)}
    </Desk>
  );
};
const l07a: React.FC<SP> = ({s0, d}) => {      // never yours for good: keep digging
  const f = useTicks(), a = useAt(s0);
  const w = 1 + 0.12 * Math.floor(clamp01((step(f, 2) - 8) / 40) * 3);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 560], [d, 1.04, 960, 540]]} chip="Our reading">
      <Castle f={f} y={540} s={0.85} wide={w}/>
      <div style={{position: "absolute", left: 1450, top: 640, transform: `rotate(${-30 + 30 * Math.sin(step(f, 2) * 0.4)}deg)`, transformOrigin: "50% 0"}}><Icon name="shovel" size={180}/></div>
    </Desk>
  );
};
const l07b = DocShot({size: 54, chip: "Berkshire letter for 2005 · his own businesses", head: "Berkshire Hathaway · letter for 2005, p.13 (retyped excerpt)", aim: [960, 560], s1: 1.12,
  paras: (a) => [{segs: ["But when short-term and long-term conflict, ", {t: "widening the moat must take precedence", hl: a("l07", 4.4), hlDur: 30}, "."]}]});
const l07c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]} chip="Berkshire letter for 2005">
      <Castle f={f} y={520} s={0.85} wide={1.36}/>
      {label(f, 4, "Keep digging", 960, 970)}
    </Desk>
  );
};

// =====================================================================================================
// Chapter 7 · How do you test a business?
// =====================================================================================================
const x01a: React.FC<SP> = ({d}) => <ChapterQ f={useTicks()} d={d} n={7} q="How do you test a business?" icon="warn"/>;
const QCard: React.FC<{f: number; at: number; x: number; y: number; q: string; icon: IconName; down?: boolean; w?: number; tick?: number}> = ({f, at, x, y, q, icon, down, w = 460, tick}) => {
  const flip = down ? 0 : ease(f, at, at + 12, outCubic);
  return (
    <div style={{position: "absolute", left: x - w / 2, top: y - w * 0.65, width: w, height: w * 1.3, transform: `perspective(1400px) rotateY(${(1 - flip) * 180}deg)`}}>
      <div style={{position: "absolute", inset: 0, background: flip > 0.5 ? "#FBF8F1" : C.wallBlue, boxShadow: "0 16px 34px rgba(30,20,10,0.3)", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 30, transform: flip > 0.5 ? undefined : "scaleX(-1)"}}>
        {flip > 0.5 ? <><Icon name={icon} size={w * 0.42}/><div style={{fontFamily: F.serif, fontSize: w * 0.16, color: C.ink}}>{q}</div></> : <Icon name="warn" size={w * 0.3} color="#FFFFFF"/>}
        {tick != null && flip > 0.5 ? <div style={{width: w * 0.22, height: w * 0.22, border: `8px solid ${C.ink}`, borderRadius: 10}}/> : null}
      </div>
    </div>
  );
};
const x01b: React.FC<SP> = ({s0, d}) => {      // Try our three question check (cards face down)
  const f = useTicks();
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.04, 960, 540]]} chip="Our test · a first check, not the last word">
      {[0, 1, 2].map((i) => <div key={i} style={{transform: `translateY(${(1 - spr(f, 2 + i * 4, 12, 180)) * 900}px)`}}><QCard f={f} at={0} x={460 + i * 500} y={540} q="" icon="coin" down/></div>)}
    </Desk>
  );
};
const x01c = (k: number, q: string, icon: IconName, rel: number, child?: (f: number, a: AtFn) => React.ReactNode): React.FC<SP> => ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960 + (k - 1) * 120, 540], [d, 1.0, 960 + (k - 1) * 60, 540]]} chip="Our test · a first check, not the last word">
      {[0, 1, 2].map((i) => i < k - 1 ? <QCard key={i} f={f} at={-40} x={460 + i * 500} y={540} q={["Copy?", "Rebuild?", "One person?"][i]} icon={(["coin", "wall", "person"] as IconName[])[i]}/>
        : i === k - 1 ? <QCard key={i} f={f} at={a("x01", rel)} x={460 + i * 500} y={540} q={q} icon={icon}/> : <QCard key={i} f={f} at={0} x={460 + i * 500} y={540} q="" icon="coin" down/>)}
      <div style={{position: "absolute", left: 460 + (k - 1) * 500, top: 80, transform: "translate(-50%,0)", fontFamily: F.serif, fontSize: 90, color: C.markerRed}}>{k}</div>
      {child ? child(f, a) : null}
    </Desk>
  );
};
const x01d = x01c(1, "Copy?", "coin", 4.5);
const x01e = x01c(2, "Rebuild?", "wall", 8.6);
const x01f = x01c(3, "One person?", "person", 11.7, (f, a) => label(f, a("x01", 13.2), "3 questions", 960, 990));
const x02a: React.FC<SP> = ({s0, d}) => {      // Try it on the cloth mill. Could rivals copy its machines?
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.04, 900, 540], [d, 1.0, 960, 540]]} chip="Our test · Berkshire letter for 1985">
      <PhotoPrint f={f} src="media/loom_draper_1987.jpg" x={700} y={540} w={980} h={700} rot={2} halftone={0.12} caption="looms like these (photo: HAER/LoC)" enter={{at: 0, mode: "none"}}/>
      <div style={{transform: `translateX(${(1 - ease(f, 2, 14, outQuint)) * 900}px)`}}><QCard f={f} at={-40} x={1500} y={540} q="Copy?" icon="coin" w={400}/></div>
    </Desk>
  );
};
const x02b: React.FC<SP> = ({s0, d}) => {      // They did. No moat.
  const f = useTicks(), a = useAt(s0);
  const swap = f >= a("x02", 5.55);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 540]]} chip="Our test · our verdict">
      {[0, 1, 2, 3].map((i) => <PhotoPrint key={i} f={f} src="media/loom_draper_1987.jpg" x={420 + i * 360} y={520 + (i % 2 ? -40 : 30)} w={420} h={300} rot={(i - 1.5) * 4} border={10} tape={false}
        halftone={0.18} crop={{s0: 1.3, s1: 1.3, fx: 0.55, fy: 0.6}} enter={{at: i * 3, mode: "drop", rot0: 10, stepped: 2}}/>)}
      {!swap ? <Stamp f={f} at={a("x02", 4.4)} text="RIVALS DID" x={960} y={820} size={110} rot={-8}/> : <Stamp f={f} at={a("x02", 5.55)} text="NO MOAT" x={960} y={820} size={130} rot={-8}/>}
    </Desk>
  );
};
const x02c: React.FC<SP> = ({s0, d}) => {      // Now try it on a shop on your street.
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 560], [d, 1.12, 960, 520, inOut]]} chip="Our test · your turn">
      <ShopFront x={420} y={940} w={380} h={360} sign="KIRANA" awning="#2F8E5A"/>
      <ShopFront x={960} y={940} w={380} h={360} sign="TEA" awning="#C8452F"/>
      <ShopFront x={1500} y={940} w={380} h={360} sign="TAILOR" awning="#2F6E8E"/>
      {[0, 1, 2].map((i) => <div key={i} style={{transform: `translateY(${Math.sin(f * 0.12 + i) * 8}px)`}}><QCard f={f} at={-40} x={700 + i * 260} y={300} q={["Copy?", "Rebuild?", "One person?"][i]}
        icon={(["coin", "wall", "person"] as IconName[])[i]} w={230} tick={1}/></div>)}
    </Desk>
  );
};
// recap montage (x03): each answer once
const x03a: React.FC<SP> = ({s0, d}) => { const f = useTicks(), a = useAt(s0);
  return <Desk f={f} d={d} cam={[[0, 1.05, 960, 540], [d, 1.0, 960, 540]]} chip="Recap"><Castle f={f} y={500} s={0.85}/><Attackers f={f} at={2} y={500} n={4}/>{label(f, 4, "Keeps rivals out", 960, 960)}</Desk>; };
const x03b: React.FC<SP> = ({s0, d}) => { const f = useTicks();
  return <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 520]]} chip="Recap"><Castle f={f} y={540} s={0.8} glow={1}/><SiegeArrows f={f} at={0} y={500}/>{label(f, 4, "Rivals attack", 960, 970)}</Desk>; };
const x03c: React.FC<SP> = ({s0, d}) => { const f = useTicks();
  return <Desk f={f} d={d} cam={[[0, 1.0, 1000, 540], [d, 1.0, 920, 540]]} chip="Recap · our grouping">
    {KINDS.map((k, i) => <IconDisc key={k} f={f} at={i * 3} name={k} x={330 + i * 315} y={480} size={240} bg={f >= i * 3 + 4 ? C.highlight : C.white}/>)}{label(f, 6, "5 kinds", 960, 820)}</Desk>; };
const x03d: React.FC<SP> = ({s0, d}) => { const f = useTicks();
  return <AbsoluteFill><InkSurface/><Firework f={f} at={2} x={960} y={400} life={40} n={110}/>
    <StickerLabel f={f} text="Fakes fade" x={960} y={900} size={62} rot={-1.5} enter={{at: 6, mode: "slide", from: [0, 300], dur: 9}}/><SourceTag f={f} at={0} text="Recap" dark/><Finish f={f} dark/></AbsoluteFill>; };
const x03e: React.FC<SP> = ({s0, d}) => { const f = useTicks();
  return <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]} chip="Recap"><Clinic f={f} walk={ease(step(f, 2), 0, 30, inOut)}/>{label(f, 4, "Not one star", 960, 140)}</Desk>; };
const x03f: React.FC<SP> = ({s0, d}) => { const f = useTicks();
  return <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 520]]} chip="Recap"><Castle f={f} y={540} s={0.85} level={0.5 + 0.5 * Math.sin(f * 0.25)}/>
    <div style={{position: "absolute", left: 1620, top: 160, transform: "translate(-50%,-50%) rotate(3deg)", padding: "10px 24px", background: "#FBF8F1", fontFamily: F.sans, fontWeight: 900,
      fontSize: 52, color: C.ink}}>DAY {1 + Math.floor(f / 3)}</div>{label(f, 4, "Not forever", 960, 970)}</Desk>; };

// =====================================================================================================
// e01 · Back to the loom
// =====================================================================================================
const e01a: React.FC<SP> = ({s0, d}) => {      // exactly the c01 frame: loom, $26 tag; slow push-in
  const f = useTicks(), a = useAt(s0);
  const cam = camI(f, [[0, 1.0, 960, 540], [d, 1.08, 990, 530]], "c14", "pull");
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam} depth={0.8}><PhotoPrint f={f} src="media/looms_radcliffe_1912.jpg" x={1400} y={430} w={760} h={470} rot={-5} halftone={0.22} darken={0.12} enter={{at: 0, mode: "none"}}/></Layer>
      <Layer cam={cam}><PhotoPrint f={f} src="media/loom_draper_1987.jpg" x={720} y={510} w={1060} h={760} rot={2} halftone={0.12} caption="looms like these (photo: HAER/LoC)" enter={{at: 0, mode: "none"}}/></Layer>
      <Layer cam={cam} depth={1.06}><PriceTag f={f} enterAt={2} x={1450} y={-40} string={300} scale={1.1} values={[{text: "$26", at: 2}]}/></Layer>
      <SourceTag f={f} at={0} text="Berkshire letter for 1985"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
const e01b: React.FC<SP> = ({s0, d}) => {      // Any rival could buy machines like it.
  const f = useTicks(), a = useAt(s0);
  const spots: [number, number][] = [[260, 250], [700, 200], [1220, 210], [1660, 260], [300, 800], [1640, 800]];
  return (
    <Desk f={f} d={d} cam={[[0, 1.08, 960, 540], [d, 1.0, 960, 540, outCubic]]} chip="Our reading">
      <PhotoPrint f={f} src="media/loom_draper_1987.jpg" x={960} y={560} w={760} h={540} rot={2} halftone={0.12} enter={{at: 0, mode: "none"}}/>
      {spots.map(([x, y], i) => <React.Fragment key={i}><div style={{position: "absolute", left: x - 90, top: y - 100, transform: `scale(${spr(f, 3 + i * 3, 11, 200)})`}}>
        <Icon name="mill" size={180} color={C.markerRed}/></div></React.Fragment>)}
      {label(f, 6, "Rivals can buy these", 960, 970)}
    </Desk>
  );
};
const e01c: React.FC<SP> = ({s0, d}) => {      // No rival could copy fast what the candy store had.
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip="Our reading">
      <GlowRing f={f} at={0} cx={960} cy={520} rx={430} ry={190}/>
      <Candy f={f} x={960} y={520} w={620} rot={-4}/>
      {[[260, 250], [1660, 260], [300, 820], [1640, 820]].map(([x, y], i) => <div key={i} style={{position: "absolute", left: x - 70, top: y - 70, opacity: 0.35, filter: "grayscale(1)"}}>
        <Icon name="mill" size={140} color="#7A7066"/></div>)}
    </Desk>
  );
};
const e01d: React.FC<SP> = ({s0, d}) => {      // Customers who liked it, and kept coming back.
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.04, 960, 560], [d, 1.0, 960, 540]]} chip="Our reading">
      <GlowRing f={f} at={-30} cx={960} cy={500} rx={380} ry={170}/>
      <Candy f={f} x={960} y={500} w={540} rot={-4}/>
      {Array.from({length: 10}).map((_, i) => {
        const t = ((f / 70 + i / 10) % 1), ang = t * Math.PI * 2;
        return <div key={i} style={{position: "absolute", left: 960 + Math.cos(ang) * 620 - 30, top: 560 + Math.sin(ang) * 300 - 60}}><Icon name="person" size={64} color={i % 2 ? C.inkSoft : "#5A4E42"}/></div>;
      })}
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}><ellipse cx={960} cy={560} rx={620} ry={300} fill="none" stroke={C.markerRed} strokeWidth={6} strokeDasharray="4 22"
        strokeDashoffset={-f * 2}/></svg>
      {label(f, a("e01", 10.2), "Kept coming back", 960, 970)}
    </Desk>
  );
};
const e01e: React.FC<SP> = ({s0, d}) => {      // Our reading: that is a moat. Tiles flip M-O-A-T
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" cam={[[0, 1.06, 960, 520], [d, 1.0, 960, 540]]} chip="Our reading">
      {["M", "O", "A", "T"].map((ch, i) => {
        const at = a("e01", 14.5) + i * 5, p = ease(f, at, at + 10, inOut);
        return <div key={i} style={{position: "absolute", left: 960 + (i - 1.5) * 260 - 110, top: 300, width: 220, height: 220, transform: `perspective(900px) rotateY(${(1 - p) * 180}deg)`}}>
          <div style={{position: "absolute", inset: 0, borderRadius: 20, background: "linear-gradient(145deg, #EBD6AA, #D7B880 70%, #C9A86C)",
            boxShadow: "0 3px 4px rgba(30,20,10,0.25), 0 16px 28px rgba(30,20,10,0.3)", display: "flex", alignItems: "center", justifyContent: "center"}}>
            {p > 0.5 ? <span style={{fontFamily: F.serif, fontSize: 170, color: C.ink}}>{ch}</span>
              : <div style={{position: "absolute", inset: 22, borderRadius: 12, background: "repeating-linear-gradient(45deg, rgba(120,80,30,0.13) 0 7px, rgba(0,0,0,0) 7px 17px)"}}/>}
          </div>
        </div>;
      })}
      {label(f, a("e01", 13.6), "What rivals can't copy", 960, 760)}
    </Desk>
  );
};
const e01f: React.FC<SP> = ({d}) => {          // end card: sources + disclaimer (card only, not narrated)
  const f = useTicks();
  const p = ease(f, 0, 14, outQuint);
  return (
    <AbsoluteFill style={{transform: `scale(${1 + 0.05 * ease(f, 0, d, (t) => t)})`}}>
      <Paper drift={f / d}/>
      <div style={{position: "absolute", left: 200, top: 150, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
        <div style={{fontFamily: F.serif, fontSize: 96, color: C.ink}}>Sources</div>
        <div style={{fontFamily: F.mono, fontSize: 30, lineHeight: 1.6, color: C.inkSoft, marginTop: 24, maxWidth: 1520}}>
          Berkshire Hathaway letters for 1983, 1985, 1986, 1989, 1991, 1993, 1994, 1996, 1999, 2004, 2005, 2007 (and one line each from 2008, 2013, 2016)<br/>
          Nestlé India annual reports 2015 and 2016 · Asian Paints call, 17 Jul 2024 · CERC draft, 17 Apr 2026<br/>
          Our articles at moatmarginresearch.com (links in the description)<br/>
          Loom photo: Jack E. Boucher, HAER / Library of Congress · Map: Natural Earth · CC0 sounds and music
        </div>
      </div>
      <div style={{position: "absolute", left: 200, right: 200, bottom: 150, padding: "26px 34px", background: C.ink, color: C.white, fontFamily: F.sans, fontWeight: 600, fontSize: 34,
        lineHeight: 1.4, opacity: ease(f, 8, 20)}}>
        Educational research, not investment advice. Moat &amp; Margin is not a SEBI-registered Research Analyst or Investment Adviser.
      </div>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// =====================================================================================================
// shot list: [beat, seconds into beat, transition, scene]
// =====================================================================================================
const S = (k: string, rel: number, tr: Tr, C: React.FC<SP>, id?: string): Shot => ({id: id ?? `${k}@${rel}`, cut: T(k, rel), tr, C});
const H0: Tr = {k: "hard"}, WL: Tr = {k: "whip", d: "left"}, WR: Tr = {k: "whip", d: "right"}, WU: Tr = {k: "whip", d: "up"}, WD: Tr = {k: "whip", d: "down"};
const PU: Tr = {k: "paper", d: "up"}, PL: Tr = {k: "paper", d: "left"};
const PUSH = (x: number, y: number): Tr => ({k: "push", x, y});
const CH = (k: string) => BEAT[k] - 1.0 - BEAT[k];   // chapter card cut: 1.0 s before the chapter question

export const FILM_SHOTS: Shot[] = [
  // ch1
  // pause fix: the chapter-1 card is folded into the title card ("What Is a Moat?"), which now holds until m01b
  S("m01", 1.5, PU, m01b), S("m01", 6.0, WL, m01c),
  S("m02", 0, WD, m02a), S("m02", 2.85, H0, m02b), S("m02", 6.2, PU, m02c), S("m02", 9.9, PUSH(960, 540), m02d),
  S("m03", 0.2, H0, m03a), S("m03", 5.9, PU, m03b), S("m03", 9.85, H0, m03c),
  S("m04", 0.25, WL, m04a), S("m04", 3.8, PU, m04b), S("m04", 8.5, WR, m04c),
  S("m05", 0, WL, m05a), S("m05", 2.2, H0, m05b), S("m05", 6.9, PU, m05c), S("m05", 11.1, PUSH(1180, 560), m06a),
  S("m06", 1.0, H0, m06b), S("m06", 2.95, WD, m06c), S("m06", 6.6, PU, m06d),
  // ch2
  S("n01", CH("n01"), H0, n01a), S("n01", 1.95, PU, n01b), S("n01", 5.0, WL, n01c),
  S("n02", 0, H0, n02a), S("n02", 3.0, PU, n02b), S("n02", 7.85, WD, n02c), S("n02", 10.6, H0, n02d),
  S("n03", 0, WL, n03a), S("n03", 5.5, H0, n03b), S("n03", 8.85, H0, n03c),
  S("n04", 0, WR, n04a), S("n04", 3.3, WL, n04b), S("n04", 7.6, H0, n04c), S("n04", 10.4, WD, n04d), S("n04", 14.0, H0, n04e),
  S("n05", 0, PU, n05a), S("n05", 4.8, WL, n05b), S("n05", 8.8, H0, n05c),
  // ch3
  S("w01", CH("w01"), H0, w01a), S("w01", 1.8, PU, w01b), S("w01", 4.2, WD, w01c), S("w01", 6.7, PU, w01d), S("w01", 10.2, WL, w01e),
  S("w02", 0, H0, w02a), S("w02", 4.1, WL, w02b), S("w02", 7.8, WD, w02c),
  S("w03", 0, PU, w03a), S("w03", 6.1, WL, w03b),
  S("w04", 0, PU, w04a), S("w04", 4.4, WD, w04b), S("w04", 10.6, PU, w04c),
  S("w05", 0, H0, w05a), S("w05", 2.9, WL, w05b), S("w05", 6.1, PU, w05c), S("w05", 9.9, WD, w05d),
  S("w06", 0, PU, w06a), S("w06", 3.8, PU, w06b), S("w06", 9.6, WD, w06c), S("w06", 14.2, H0, w06d), S("w06", 17.0, PU, w06e),
  S("w07", 0, WL, w07a), S("w07", 4.6, H0, w07b),
  S("w08", 0, WR, w08a), S("w08", 7.0, H0, w08b), S("w08", 12.8, H0, w08c),
  S("w09", 0, PU, w09a), S("w09", 3.5, PL, w09b), S("w09", 9.95, WD, w09c),
  S("w10", 0.4, PU, w10a), S("w10", 5.0, PL, w10b), S("w10", 8.0, H0, w10c), S("w10", 12.7, PU, w10d), S("w10", 15.3, WL, w10e), S("w10", 17.7, H0, w10f),
  // ch4
  S("f01", CH("f01"), H0, f01a), S("f01", 2.7, PU, f01b), S("f01", 7.0, WL, f01c), S("f01", 10.3, H0, f01d),
  S("f02", 0, PU, f02a), S("f02", 2.4, WL, f02b),
  S("f03", 0, H0, f03a), S("f03", 4.5, WD, f03b), S("f03", 6.9, H0, f03c), S("f03", 9.3, PU, f03d), S("f03", 13.6, WL, f03e),
  S("f04", 0, PU, f04a), S("f04", 4.8, WL, f04b), S("f04", 8.6, PU, f04c),
  // ch5
  S("s01", CH("s01"), H0, s01a), S("s01", 2.3, H0, s01b), S("s01", 5.0, PU, s01c), S("s01", 8.4, WL, s01d),
  S("s02", 0, H0, s02a), S("s02", 4.2, PU, s02b), S("s02", 6.5, H0, s02c), S("s02", 11.0, WD, s02d),
  // ch6
  S("l01", CH("l01"), H0, l01a), S("l01", 3.5, PU, l01b), S("l01", 6.3, WL, l01c),
  S("l02", 0, H0, l02a), S("l02", 2.4, PU, l02b), S("l02", 6.4, PU, l02c), S("l02", 9.7, WD, l02d),
  S("l03", 0, H0, l03a), S("l03", 3.9, WD, l03b), S("l03", 10.0, WU, l03c), S("l03", 13.9, H0, l03d),
  S("l04", 0.3, PU, l04a), S("l04", 3.5, WL, l04b), S("l04", 6.9, WD, l04c), S("l04", 10.4, WU, l04d), S("l04", 13.5, PU, l04e), S("l04", 16.9, WL, l04f),
  S("l05", 0, H0, l05a), S("l05", 1.9, PU, l05b), S("l05", 7.6, WL, l05c),
  S("l06", 0, WR, l06a), S("l06", 2.9, PU, l06b), S("l06", 7.9, WL, l06c), S("l06", 11.9, PU, l06d),
  S("l07", 0, WD, l07a), S("l07", 2.2, PU, l07b), S("l07", 5.7, WL, l07c),
  // ch7
  S("x01", CH("x01"), H0, x01a), S("x01", 2.2, PU, x01b), S("x01", 4.3, H0, x01d), S("x01", 8.3, H0, x01e), S("x01", 11.4, H0, x01f),
  S("x02", 0, WL, x02a), S("x02", 4.25, H0, x02b), S("x02", 6.8, WL, x02c),
  S("x03", 0, PU, x03a), S("x03", 4.4, WL, x03b), S("x03", 7.35, H0, x03c), S("x03", 9.05, WD, x03d), S("x03", 10.75, PU, x03e), S("x03", 12.6, WL, x03f),
  // ending
  S("e01", 0, H0, e01a), S("e01", 3.6, H0, e01b), S("e01", 6.3, PU, e01c), S("e01", 9.4, WL, e01d), S("e01", 13.2, H0, e01e), S("e01", BEAT_DUR_OLD["e01"] + 1.0, PU, e01f),
];

// ---------------- sound ----------------
const B = (k: string, rel: number) => warp(BEAT_OLD[k] + rel);
export const FILM_CUES: SCue[] = [
  ...COLD_CUES,
  [B("m01", -0.7), "whooshDeep", 0.5], [B("m02", 5.0), "highlighter", 0.6], [B("m02", 10.0), "stamp", 0.5], [B("m03", 8.6), "stamp", 0.7],
  [B("m04", 6.7), "highlighter", 0.55], [B("m05", 7.5), "highlighter", 0.6], [B("m05", 10.2), "circle", 0.55], [B("m06", 3.1), "stamp", 0.5],
  [B("n01", -0.7), "whooshDeep", 0.5], [B("n01", 5.2), "highlighter", 0.55], [B("n02", 3.4), "pop", 0.35], [B("n02", 8.3), "paper", 0.5],
  [B("n03", 3.3), "click", 0.35], [B("n04", 8.0), "paper", 0.5], [B("n04", 14.3), "stamp", 0.7], [B("n05", 7.2), "stamp", 0.7],
  [B("w01", -0.7), "whooshDeep", 0.5], [B("w01", 6.9), "pop", 0.35], [B("w01", 12.3), "pop", 0.35], [B("w02", 8.2), "ding", 0.35], [B("w02", 14.2), "highlighter", 0.5],
  [B("w03", 6.4), "paper", 0.45], [B("w04", 3.0), "highlighter", 0.55], [B("w04", 11.0), "highlighter", 0.55], [B("w05", 6.9), "highlighter", 0.55],
  [B("w05", 10.3), "stamp", 0.45], [B("w06", 2.2), "paper", 0.5], [B("w06", 8.7), "highlighter", 0.5], [B("w06", 15.6), "ding", 0.35], [B("w07", 5.0), "click", 0.35],
  [B("w08", 2.4), "pop", 0.35], [B("w08", 10.4), "ding", 0.35], [B("w09", 0.8), "highlighter", 0.55], [B("w09", 10.6), "paper", 0.45], [B("w10", 3.2), "stamp", 0.7],
  [B("w10", 9.0), "paper", 0.45], [B("w10", 13.4), "highlighter", 0.5], [B("w10", 19.0), "paper", 0.4],
  [B("f01", -0.7), "whooshDeep", 0.5], [B("f01", 4.6), "highlighter", 0.55], [B("f01", 11.6), "whooshDeep", 0.4], [B("f02", 4.1), "ding", 0.35],
  [B("f03", 2.9), "stamp", 0.7], [B("f03", 11.3), "highlighter", 0.55], [B("f04", 3.0), "highlighter", 0.4], [B("f04", 9.0), "highlighter", 0.55],
  [B("s01", -0.7), "whooshDeep", 0.5], [B("s01", 6.5), "stamp", 0.6], [B("s02", 4.4), "paper", 0.4], [B("s02", 11.4), "paper", 0.45],
  [B("l01", -0.7), "whooshDeep", 0.5], [B("l01", 4.3), "highlighter", 0.55], [B("l02", 0.1), "whooshDeep", 0.7], [B("l02", 6.9), "highlighter", 0.55],
  [B("l03", 2.4), "stamp", 0.5], [B("l03", 11.0), "pop", 0.3], [B("l04", 8.0), "pop", 0.3], [B("l04", 13.9), "highlighter", 0.5], [B("l05", 2.5), "highlighter", 0.55],
  [B("l05", 10.3), "stamp", 0.6], [B("l06", 5.6), "highlighter", 0.5], [B("l06", 13.4), "stamp", 0.75], [B("l07", 4.4), "highlighter", 0.5],
  [B("x01", -0.7), "whooshDeep", 0.5], [B("x01", 4.5), "paper", 0.4], [B("x01", 11.7), "paper", 0.4], [B("x02", 4.4), "stamp", 0.6], [B("x02", 5.55), "stamp", 0.7],
  [B("x03", 7.35), "pop", 0.3], [B("e01", 0.2), "paper", 0.5], [B("e01", 6.3), "paper", 0.4], [B("e01", 14.5), "click", 0.4], [B("e01", 16.7), "stamp", 0.6],
];

// ---------------- music: two CC0 beds, changed at chapter turns, ducked under voice ----------------
const BEDS: {src: string; from: number; to: number; offset: number; gain: number}[] = [
  {src: "audio/music_06_curious_ambience_reg1n0ld.wav", from: 0, to: B("n01", -0.6), offset: 20, gain: 1},
  {src: "audio/music_07_strings_with_percussion_buythefield.wav", from: B("n01", -1.6), to: B("f01", -0.6), offset: 0, gain: 0.7},
  {src: "audio/music_06_curious_ambience_reg1n0ld.wav", from: B("f01", -1.6), to: B("l02", -0.2), offset: 0, gain: 1},
  {src: "audio/music_07_strings_with_percussion_buythefield.wav", from: B("l02", -0.6), to: FILM_TOTAL_S, offset: 90, gain: 0.7},
];
const VO_ALL = BEAT_ORDER.map((k) => ({k, at: BEAT[k], len: BEAT_DUR[k]}));

const Beds: React.FC = () => {
  const {fps} = useVideoConfig();
  const fs = (s: number) => tk2f(tsec(s), fps);
  return (
    <>
      {BEDS.map((b, i) => {
        const a = fs(b.from), z = fs(b.to);
        const voice: [number, number][] = VO_ALL.map((v) => [fs(v.at) - a, fs(v.at + v.len) - a]);
        return (
          <Sequence key={i} from={a} durationInFrames={z - a} layout="none">
            <MusicBed src={b.src} total={z - a} voice={voice} duck={0.2 * b.gain} open={0.4 * b.gain} startFrom={fs(b.offset)} fadeIn={fs(1.0)} fadeOut={fs(1.0)}/>
          </Sequence>
        );
      })}
    </>
  );
};

/** Open-loop sticky notes (pinned when opened, unpinned when paid). */
const Notes: React.FC = () => {
  const f = useTicks();
  const tk = (k: string, rel: number) => tsec(warp(BEAT_OLD[k] + rel));
  // a note shows for 4.5 s when the loop opens, then leaves the frame (no overlay on every frame); it comes back
  // 1.2 s before the loop is paid and flies to the centre
  const note = (text: string, pin: number, unpin: number, y: number) => {
    if (f >= pin && f < pin + 135) return <AbsoluteFill style={{opacity: 1 - ease(f, pin + 118, pin + 134)}}><StickyNote f={f} at={pin} text={text} y={y}/></AbsoluteFill>;
    if (f >= unpin - 36 && f < unpin + 40) return <StickyNote f={f} at={unpin - 36} text={text} y={y} unpin={unpin}/>;
    return null;
  };
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      {note("GEICO'S GAP?", tk("m06", 7.0), tk("w02", 2.6), 170)}
      {note("SO FAR", tk("w09", 10.6), tk("l06", 0.3), 170)}
      {note("THE CATCH", tk("w10", 19.4), tk("l05", 0.2), 170)}
    </AbsoluteFill>
  );
};

export const filmShots = (): Shot[] => [...coldShots(), ...FILM_SHOTS];

export const A01V4Film: React.FC<{music?: boolean}> = ({music = true}) => {
  useVoxFonts();
  const {fps} = useVideoConfig();
  const shots = filmShots();
  const {start, dur} = layoutShots(shots, FILM_TOTAL);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Series shots={shots} start={start} dur={dur}/>
      <Notes/>
      <VoiceTrack vo={VO_ALL}/>
      {music ? <Beds/> : null}
      <SfxTrack cues={cueFrames(FILM_CUES, fps)}/>
    </AbsoluteFill>
  );
};
