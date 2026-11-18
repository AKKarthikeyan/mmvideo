// Jio film, chapter 3 "The industry" (beats q30-q35), VoxPlus kit, 20 Oct 2026.
// Real pages: TRAI QPIR Table 1.11 (q31), TRAI YIR p.5 note + Chart 1.11 on p.46 (q32), Jio RHP p.51 (q34). Charts on black for q31, q33.
// Every number is cued to the word that says it (kit.tsx a(beat, phrase)); sources sit in the chip, top left.
import React from "react";
import {AbsoluteFill} from "remotion";
import {camAt, CamKey, Layer} from "../Camera";
import {PhotoPrint, StickerLabel} from "../Collage";
import {DocPage, docPoint, docRectCentre} from "../DocPage";
import {MapRoute, useGeo} from "../MapRoute";
import {MarkerStrike, Rect} from "../Marker";
import {Shot, SP, Stamp, Num, Sub} from "../A01V4Parts";
import {SCue} from "../A01V4Cold";
import {SourceTag} from "../Cards";
import {Finish} from "../Texture";
import {C, F, inOut, outCubic, useTicks} from "../tokens";
import {H0, PU, PUSH, S, useAt, W, WL, WR} from "./kit";
import {Chap, ChartTitle, CueWords, PairBars, ShareBars, Stage} from "./parts34";

const lab = (f: number, at: number, text: string, x: number, y: number, o: {dark?: boolean; size?: number; rot?: number; bg?: string; color?: string; exit?: {at: number; to?: [number, number]}} = {}) =>
  <StickerLabel f={f} text={text} x={x} y={y} size={o.size ?? 52} dark={o.dark} rot={o.rot ?? -3} bg={o.bg} color={o.color} enter={{at, mode: "pop", rot0: -10}} exit={o.exit}/>;

// ---------------------------------------------------------------------------------------------------------------
// q30  Chapter three. The industry.
// ---------------------------------------------------------------------------------------------------------------
const q30: React.FC<SP> = () => <Chap f={useTicks()} n={3} word="The industry"/>;

// ---------------------------------------------------------------------------------------------------------------
// q31  TRAI June 2026: map, the real table, the chart
// ---------------------------------------------------------------------------------------------------------------
const DQ = {src: "jio/docs/ch3_trai_qpir_t111.png", imgW: 1620, imgH: 532, x: 960, y: 520, width: 1500, rot: -0.5};
const RQ = {jio: [72.3, 247.7, 212.4, 42.0] as Rect, jioSubs: [655.9, 252.6, 113.1, 38.7] as Rect, jioShare: [1366.0, 252.6, 122.3, 38.7] as Rect,
  air: [72.3, 317.2, 217.4, 42.0] as Rect, vi: [72.3, 386.3, 317.5, 42.0] as Rect, bsnl: [72.3, 455.8, 98.6, 42.0] as Rect};
const CHIP31 = "TRAI QPIR Apr-Jun 2026 · Table 1.11";

const q31a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0), geo = useGeo();
  const cam = camAt(f, [[0, 0.62, 940, 590], [28, 1.0, 960, 540, outCubic], [d, 1.07, 950, 545]]);
  return (
    <AbsoluteFill style={{background: C.mapWater}}>
      <Layer cam={cam}>
        <MapRoute f={f} geo={geo} inkAt={6} credit={false}/>
        <PhotoPrint f={f} src="jio/media/crowd_dumdum_platform_print.jpg" x={1560} y={690} w={600} h={450} rot={4} halftone={0.14} border={12}
          enter={{at: 6, mode: "slide", from: [900, 200], rot0: 8, dur: 12}}/>
        {lab(f, 2, "TRAI data", 330, 330, {dark: true, size: 64, rot: -4})}
        {lab(f, a("q31", "June"), "June 2026", 1180, 330, {size: 56, rot: 3})}
      </Layer>
      <SourceTag f={f} at={0} text="TRAI quarterly report, Apr-Jun 2026"/>
      <SourceTag f={f} at={0} text="Map: Natural Earth (India view)" pos="br"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

const q31b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const jioC = docRectCentre(DQ, RQ.jio), subC = docRectCentre(DQ, RQ.jioSubs), shC = docRectCentre(DQ, RQ.jioShare);
  const cam: CamKey[] = [[0, 1.0, 960, 560], [a("q31", "Jio,"), 1.3, jioC.x + 160, jioC.y - 10, inOut], [a("q31", "thirty nine|-0.5"), 1.45, shC.x - 360, shC.y, inOut], [d, 1.5, shC.x - 420, shC.y]];
  return (
    <Stage f={f} d={d} tone="kraft" cam={cam} chip={CHIP31}>
      <DocPage f={f} {...DQ} stack={2} enter={{at: 0, mode: "slide-up", dur: 12}}
        highlights={[{rects: [RQ.jio], at: a("q31", "Jio,"), dur: 10}, {rects: [RQ.jioSubs], at: a("q31", "fifty one"), dur: 10}, {rects: [RQ.jioShare], at: a("q31", "thirty nine"), dur: 10}]}
        circles={[{rect: RQ.jioShare, at: a("q31", "percent|-0.1"), dur: 12}]}
        focus={{rect: [0, 240, 1620, 60], at: a("q31", "Jio,") - 4, blur: 2.4, feather: 1.6}}/>
      {lab(f, a("q31", "crore|-0.05"), "= 51.76 crore", subC.x - 40, subC.y - 130, {dark: true, size: 46, rot: -3})}
    </Stage>
  );
};

const SHARE = (a: (k: string, x?: number | string) => number, quickJio: boolean) => [
  quickJio ? {name: "Jio", crore: 51.76, pct: 39.81, key: true, nameAt: 0, croreAt: 4, pctAt: 18}
    : {name: "Jio", crore: 51.76, pct: 39.81, key: true, nameAt: a("q31", "Jio,"), croreAt: a("q31", "fifty one"), pctAt: a("q31", "thirty nine")},
  {name: "Airtel", crore: 49.06, pct: 37.73, nameAt: a("q31", "Airtel,"), croreAt: a("q31", "forty nine point zero"), pctAt: a("q31", "thirty seven")},
  {name: "Vodafone Idea", crore: 19.88, pct: 15.29, nameAt: a("q31", "Vodafone"), croreAt: a("q31", "nineteen point eight"), pctAt: a("q31", "eight crore|+0.1")},
  {name: "BSNL", crore: 9.3, pct: 7.15, nameAt: a("q31", "BSNL,"), croreAt: a("q31", "nine point three"), pctAt: a("q31", "three crore|+0.05")},
];
const q31c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Stage f={f} d={d} tone="ink" chip={CHIP31} cam={[[0, 1.1, 800, 470], [a("q31", "forty nine point zero"), 1.0, 960, 540, inOut], [d, 1.04, 980, 560]]}
      over={<ChartTitle f={f} title="Wireless subscribers" sub="June 2026 · share of all wireless" at={2}/>}>
      <ShareBars f={f} rows={SHARE(a, true)}/>
    </Stage>
  );
};
const q31d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Stage f={f} d={d} tone="ink" chip={CHIP31} cam={[[0, 1.2, 900, 640], [d, 1.0, 960, 540, inOut]]}
      over={<ChartTitle f={f} title="Wireless subscribers" sub="June 2026 · share of all wireless" at={-40}/>}>
      <ShareBars f={f} rows={SHARE(a, false)}/>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// q32  the caution: Airtel started counting M2M in FY26 (TRAI YIR)
// ---------------------------------------------------------------------------------------------------------------
const DN = {src: "jio/docs/ch3_trai_yir_note.png", imgW: 1500, imgH: 144, x: 960, y: 610, width: 1560, rot: -0.7};
const RN = {fy: [143.7, 103.7, 149.2, 33.1] as Rect, line3: [838.9, 69.1, 601.4, 33.1] as Rect, line4: [143.7, 103.7, 595.9, 33.1] as Rect};
const q32a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(DN, RN.line4);
  return (
    <Stage f={f} d={d} tone="kraft" chip="TRAI YIR 2025-26 · p.5 note" cam={[[0, 1.0, 960, 590], [a("q32", "financial"), 1.12, 960, 600, inOut], [a("q32", "Airtel,"), 1.2, c.x + 300, c.y - 40, inOut], [d, 1.26, c.x + 320, c.y - 50]]}>
      <DocPage f={f} {...DN} stack={3} enter={{at: 0, mode: "slide-up", dur: 12}}
        circles={[{rect: RN.fy, at: a("q32", "twenty six|-0.3"), dur: 14}]}
        highlights={[{rects: [RN.line3, RN.line4], at: a("q32", "Airtel,"), dur: 16}]}/>
      <Stamp f={f} at={a("q32", "caution|-0.05")} text="CAUTION" x={1200} y={400} size={110} rot={-6}/>
    </Stage>
  );
};

const DM = {src: "jio/docs/ch3_trai_yir_m2m.png", imgW: 1500, imgH: 1161, x: 590, y: 545, width: 780, rot: -1.2};
const RM = {chartLabel: [402.1, 285.9, 76.5, 33.1] as Rect, para: [468.3, 984.0, 235.4, 42.0] as Rect};
const q32b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const cl = docRectCentre(DM, RM.chartLabel);
  return (
    <Stage f={f} d={d} tone="kraft" chip="TRAI YIR 2025-26 · PDF p.46 · 76.99 million = 7.70 crore" cam={[[0, 1.0, 960, 540], [a("q32", "Seven"), 1.08, 900, 540, inOut], [d, 1.16, 880, 560]]}>
      <DocPage f={f} {...DM} stack={2} enter={{at: 0, mode: "slide-left", dur: 12}}
        circles={[{rect: RM.chartLabel, at: a("q32", "Seven|+0.1"), dur: 14}]}
        highlights={[{rects: [RM.para], at: a("q32", "seven|+0.1"), dur: 14}]}/>
      <Num f={f} at={a("q32", "Seven")} to={7.7} dec={2} x={1440} y={430} size={260} color={C.ink} dur={34}/>
      <Sub f={f} at={a("q32", "crore")} text="crore connections" x={1440} y={600} size={44} color={C.inkSoft}/>
      {lab(f, a("q32", "March|-0.1"), "Airtel · March 2026", 1440, 730, {dark: true, size: 48, rot: -2})}
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// q33  without M2M: Jio 41.4% vs Airtel 35.1% (our arithmetic)
// ---------------------------------------------------------------------------------------------------------------
const CHIP33 = "Our arithmetic · TRAI YIR 2025-26";
const q33a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Stage f={f} d={d} tone="ink" chip="TRAI YIR 2025-26" cam={[[0, 1.14, 960, 540], [d, 1.0, 960, 540, outCubic]]}>
      <CueWords f={f} words={[{w: "M2M", at: a("q33", "machine|-0.05")}]} x={960} y={520} size={360}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <MarkerStrike f={f} at={a("q33", "out|-0.05")} rect={[500, 380, 920, 300]} dur={9} width={20} color={C.markerRed} seed="m2m"/>
      </svg>
      {lab(f, a("q33", "everyone,|-0.1"), "For everyone", 960, 830, {size: 60, rot: -2})}
    </Stage>
  );
};
const bars33 = (a: (k: string, x?: number | string) => number, quick: boolean) => [
  {label: "Jio", v: 41.4, text: (v: number) => v.toFixed(1) + "%", at: quick ? a("q33", "forty one") : a("q33", "forty one"), key: true},
  {label: "Airtel", v: 35.1, text: (v: number) => v.toFixed(1) + "%", at: a("q33", "Airtel,|+0.45"), subAt: a("q33", "Airtel,")},
];
const T33 = (f: number) => <ChartTitle f={f} title="Share without M2M" sub="Mobile connections · March 2026" at={2}/>;
const q33b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Stage f={f} d={d} tone="ink" chip={CHIP33} cam={[[0, 1.0, 960, 540], [d, 1.18, 760, 520, inOut]]} over={T33(f)}>
      <PairBars f={f} bars={bars33(a, false)} max={50} box={{x: 460, y: 330, w: 1000, h: 470}} circleAt={a("q33", "of mobile|-0.1")}/>
    </Stage>
  );
};
const q33c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Stage f={f} d={d} tone="ink" chip={CHIP33} cam={[[0, 1.3, 1250, 600], [d, 1.02, 980, 540, outCubic]]} over={T33(f)}>
      <PairBars f={f} bars={bars33(a, true)} max={50} box={{x: 460, y: 330, w: 1000, h: 470}} circleAt={a("q33", "of mobile|-0.1")}/>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// q34  two rules (RHP p.51)
// ---------------------------------------------------------------------------------------------------------------
const DS = {src: "jio/docs/ch3_rhp51_spectrum.png", imgW: 1392, imgH: 107, x: 960, y: 560, width: 1560, rot: -0.6};
const RS = {auct: [570.4, 34.6, 508.7, 33.1] as Rect, share1: [1086.2, 34.6, 291.9, 33.1] as Rect, share2: [18.1, 69.1, 400.3, 33.1] as Rect};
const q34a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(DS, RS.auct);
  return (
    <Stage f={f} d={d} tone="kraft" chip="Jio RHP p.51 · Risk Factor 25" cam={[[0, 1.0, 960, 560], [a("q34", "Spectrum"), 1.2, c.x - 20, c.y, inOut], [a("q34", "or|-0.1"), 1.2, 960, c.y + 20, inOut], [d, 1.24, 960, c.y + 24]]}>
      <DocPage f={f} {...DS} stack={3} enter={{at: 0, mode: "slide-up", dur: 12}}
        highlights={[{rects: [RS.auct], at: a("q34", "Spectrum"), dur: 16}, {rects: [RS.share1, RS.share2], at: a("q34", "or|-0.1"), dur: 12}]}/>
      {lab(f, a("q34", "rules|-0.05"), "Two rules", 960, 270, {dark: true, size: 76, rot: -3})}
      {lab(f, a("q34", "Spectrum"), "Rule 1 · Spectrum", 960, 860, {size: 54, rot: 2})}
    </Stage>
  );
};

const DF = {src: "jio/docs/ch3_rhp51_fees.png", imgW: 1392, imgH: 322, x: 960, y: 500, width: 1500, rot: -0.4};
const RF = {row1: [34.3, 189.0, 402.3, 29.9] as Rect, row2: [34.3, 220.3, 431.7, 29.9] as Rect, v: [991.0, 204.5, 69.9, 29.9] as Rect};
const CAM34B = (a: (k: string, x?: number | string) => number, d: number): CamKey[] => {
  const v = docRectCentre(DF, RF.v);
  return [[0, 1.0, 960, 520], [a("q34", "licence"), 1.12, 900, 500, inOut], [a("q34", "cost|-0.1"), 1.7, v.x - 20, v.y, inOut], [d, 1.8, v.x - 20, v.y]];
};
const q34b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Stage f={f} d={d} tone="kraft" chip="Jio RHP p.51 · FY26" cam={CAM34B(a, d)}>
      <DocPage f={f} {...DF} stack={2} enter={{at: 0, mode: "drop"}}
        highlights={[{rects: [RF.row1, RF.row2], at: a("q34", "licence"), dur: 12}]}
        circles={[{rect: RF.v, at: a("q34", "cost"), dur: 14}]}/>
      {lab(f, a("q34", "licence|+0.1"), "Rule 2 · Fees", 960, 250, {dark: true, size: 60, rot: -2, exit: {at: a("q34", "cost|-0.4"), to: [0, -500]}})}
    </Stage>
  );
};
const q34c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Stage f={f} d={d} tone="ink" chip="Jio RHP p.51 · FY26" cam={[[0, 1.1, 960, 540], [d, 1.0, 960, 540, outCubic]]}>
      <Num f={f} at={a("q34", "seven point nine")} to={7.97} dec={2} suf="%" x={960} y={500} size={400} color={C.highlightPrint} dur={30}/>
      <Sub f={f} at={12} text="Licence + spectrum charges" x={960} y={250} size={44} color="#CFC9BE"/>
      <Sub f={f} at={a("q34", "revenue")} text="of FY26 revenue" x={960} y={760} size={58} color={C.white}/>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// q35  re-hook: the real test is Jio against Airtel
// ---------------------------------------------------------------------------------------------------------------
const q35a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = (sec: number) => a("q35", sec);   // local tick of "sec" seconds into the beat
  return (
    <Stage f={f} d={d} tone="ink" chip="Jio RHP p.51 · licence + spectrum charges" cam={[[0, 1.12, 960, 540], [d, 1.0, 960, 540, outCubic]]}>
      <CueWords f={f} size={150} x={960} y={470} words={[{w: "Costs", at: t(0.15)}, {w: "hit", at: t(0.7)}, {w: "every", at: t(1.2), mark: true, markAt: t(1.55)}, {w: "operator.", at: t(1.65)}]}/>
      {lab(f, t(2.5), "Not just Jio", 960, 800, {size: 64, rot: -2})}
    </Stage>
  );
};
const q35b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Stage f={f} d={d} tone="ink" chip="Our question" cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 560, inOut]]}>
      <CueWords f={f} size={96} x={960} y={330} color="#CFC9BE" words={[{w: "The", at: a("q35", "So the")}, {w: "moat", at: a("q35", "moat")}, {w: "question", at: a("q35", "question")}]}/>
      <CueWords f={f} size={230} x={960} y={620} words={[{w: "One", at: a("q35", "one real")}, {w: "real", at: a("q35", "real"), mark: true, markAt: a("q35", "real|+0.1")}, {w: "test.", at: a("q35", "test")}]}/>
    </Stage>
  );
};
const q35c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const j = Math.min(1, Math.max(0, (f - a("q35", "Jio against")) / 12)), ar = Math.min(1, Math.max(0, (f - a("q35", "Airtel.")) / 12));
  const e = (p: number) => 1 - Math.pow(1 - p, 3);
  return (
    <Stage f={f} d={d} tone="ink" chip="Our question" cam={[[0, 1.2, 960, 560], [d, 1.0, 960, 540, inOut]]}>
      <div style={{position: "absolute", left: 520 - (1 - e(j)) * 700, top: 500, transform: "translate(-50%,-50%)", opacity: e(j), fontFamily: F.serif, fontSize: 330, color: C.highlightPrint}}>Jio</div>
      <div style={{position: "absolute", left: 1400 + (1 - e(ar)) * 700, top: 500, transform: "translate(-50%,-50%)", opacity: e(ar), fontFamily: F.serif, fontSize: 330, color: C.white}}>Airtel</div>
      <div style={{position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) rotate(-6deg) scale(${f >= a("q35", "against") ? 1 : 0})`, fontFamily: F.marker, fontSize: 120, color: C.markerRed}}>vs</div>
    </Stage>
  );
};
const q35d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const w = (p: string, x: string, o: Partial<{mark: boolean; markAt: number}> = {}) => ({w: x, at: a("q35", p), ...o});
  return (
    <Stage f={f} d={d} tone="ink" chip="Our question" cam={[[0, 1.0, 960, 540], [d, 1.12, 960, 560, inOut]]}>
      <CueWords f={f} size={132} x={960} y={500} maxWidth={1560} words={[w("Does", "Does"), w("Jio have", "Jio"), w("have an", "have"), w("an edge", "an"), w("edge", "edge"), w("Airtel can't", "Airtel"),
        {w: "can't", at: a("q35", "can't"), mark: true, markAt: a("q35", "can't")}, {w: "copy?", at: a("q35", "copy"), mark: true, markAt: a("q35", "copy|+0.1")}]}/>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------------------
export const SHOTS3: Shot[] = [
  S("q30", 0, PU, q30),
  S("q31", 0, WL, q31a),
  S("q31", "Jio,|-0.4", PU, q31b),
  S("q31", "Airtel,|-0.5", WL, q31c),
  S("q31", "Vodafone|-0.35", H0, q31d),
  S("q32", 0, PU, q32a),
  S("q32", "Seven|-0.4", WL, q32b),
  S("q33", 0, WR, q33a),
  S("q33", "Jio|-0.35", H0, q33b),
  S("q33", "Airtel,|-0.3", H0, q33c),
  S("q34", 0, PU, q34a),
  S("q34", "And licence|-0.3", WL, q34b),
  S("q34", "seven point|-0.15", PUSH(996, 540), q34c),
  S("q35", 0, WR, q35a),
  S("q35", "So the|-0.2", H0, q35b),
  S("q35", "Jio against|-0.3", WL, q35c),
  S("q35", "Does|-0.2", H0, q35d),
];
export const CUES3: SCue[] = [
  [W("q30", 0.05), "paper", 0.6],
  [W("q31", "Jio,|-0.4"), "paper", 0.5],
  [W("q31", "Jio,"), "highlighter", 0.55],
  [W("q31", "Airtel, forty|+0.1"), "ding", 0.5],
  [W("q32", 0.3), "stamp", 0.7],
  [W("q32", "Seven|+0.1"), "circle", 0.6],
  [W("q33", "out|-0.05"), "highlighter", 0.6],
  [W("q34", "Spectrum"), "highlighter", 0.55],
  [W("q34", "seven point nine"), "stamp", 0.7],
  [W("q35", "can't"), "stamp", 0.45],
];
