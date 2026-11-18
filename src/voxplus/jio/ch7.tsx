// Jio film, chapter 7: "The other reading" (beats q70-q72). The strongest case for Jio on a paper checklist, a real RHP page for the
// 700 MHz line, capex as a share of revenue and EBITDA minus cash capex as bars on black, then the honest ending.
// q72's word times come from a fresh whisper pass over q72.mp3 (the shared jioTiming.ts only holds the last six words of that beat).
import React from "react";
import {AbsoluteFill} from "remotion";
import {Desk, Shot, SP, Stamp, Words} from "../A01V4Parts";
import {SCue} from "../A01V4Cold";
import {BigWord} from "../BigType";
import {PhotoPrint} from "../Collage";
import {DocPage} from "../DocPage";
import {Rect} from "../Marker";
import {Finish, InkSurface} from "../Texture";
import {C, ease, F, inOut, outCubic, outQuint, spr, useTicks} from "../tokens";
import {H0, PU, S, useAt, W, WD, WL, WR} from "./kit";
import {BarsBlack, Black, Checklist, ChapterCardFit, GroupName, lab, Mono} from "./parts57";

const D700 = {src: "jio/docs/ch7_rhp164_700.png", imgW: 1386, imgH: 177, x: 960, y: 470, width: 1560, rot: -0.6};
const R700 = {only: [12.1, -0.9, 1330, 33.1] as Rect, mhz: [12.1, 33.6, 411.8, 33.1] as Rect};
const DCAP = {src: "jio/docs/ch7_rhp131_capex.png", imgW: 1425, imgH: 173, x: 960, y: 500, width: 1560, rot: 0.6};
const RCAP = {row: [[36.6, 139.8, 319.8, 30.0], [958.5, 139.8, 94.5, 30.0]] as Rect[], fy24: [1326.0, 139.8, 81.0, 30.0] as Rect, fy26: [958.5, 139.8, 94.5, 30.0] as Rect};

// q72 word starts, seconds into the beat (whisper on public/vx/jioipo/q72.mp3)
const T72 = {cash: 0.82, from: 1.86, n1449: 2.1, crore1: 3.52, to: 3.9, n42071: 4.26, crore2: 5.82, ifReturns: 6.66, spectrum: 8.4, rise: 10.48, that: 11.28, serious: 12.38, filings: 13.1, prove: 14.26};

// =====================================================================================================
// q70 · chapter card
// =====================================================================================================
const q70a: React.FC<SP> = () => <ChapterCardFit f={useTicks()} n={7} word="The other reading"/>;

// =====================================================================================================
// q71 · the strongest case for Jio
// =====================================================================================================
const q71a: React.FC<SP> = ({s0, d}) => {      // The strongest case for Jio. (tower: Ayush Soran, CC BY 4.0, via Wikimedia Commons)
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Our reading of the prospectus" cam={[[0, 1.0, 900, 540], [d, 1.1, 940, 520]]}>
      <PhotoPrint f={f} src="jio/media/tower_in_sunset_print.jpg" x={900} y={500} w={1240} h={930} rot={-1.5} halftone={0.1} enter={{at: 0, mode: "none"}} crop={{s0: 1.0, s1: 1.1, dur: 50}}/>
      {lab(f, a("q71", "strongest"), "The strongest case for Jio", 1000, 880, {size: 66, rot: 1.5})}
    </Desk>
  );
};
const q71b: React.FC<SP> = ({s0, d}) => {      // lowest churn, most data, lowest cost per GB
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.131-137 · peer KPIs · our arithmetic" cam={[[0, 1.06, 900, 500], [d, 1.0, 960, 560, inOut]]}>
      <Checklist f={f} x={960} y={560} w={1240} title="Strongest case for Jio" titleAt={0} rows={4} rot={-1.2} items={[
        {text: "Lowest churn", at: a("q71", "The lowest churn|0"), tickAt: a("q71", "churn|+0.35")},
        {text: "Most data carried", at: a("q71", "The most data|0"), tickAt: a("q71", "carried|+0.3")},
        {text: "Lowest cost per GB", at: a("q71", "The lowest cost|0"), tickAt: a("q71", "measure|+0.25")}]}/>
    </Desk>
  );
};
const q71c: React.FC<SP> = ({s0, d}) => {      // the only nationwide 700 MHz band
  const f = useTicks(), a = useAt(s0);
  const tk = ease(f, a("q71", "band|+0.1"), a("q71", "band|+0.1") + 9, outCubic);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.164 · industry report Jio paid for" cam={[[0, 1.0, 960, 560], [d, 1.3, 760, 470, inOut]]}>
      <DocPage f={f} {...D700} stack={2} enter={{at: 0, mode: "slide-right"}}
        highlights={[{rects: [R700.only], at: a("q71", "only nationwide|-0.1"), dur: 26}]} underlines={[{rect: R700.mhz, at: a("q71", "seven hundred|0"), dur: 16}]}/>
      {lab(f, a("q71", "seven hundred|0"), "Only nationwide 700 MHz", 960, 790, {size: 58, rot: -1.5})}
      <svg width={120} height={120} style={{position: "absolute", left: 1500, top: 740, overflow: "visible"}}>
        {tk > 0 ? <path d="M 10 70 L 40 100 L 112 -10" fill="none" stroke={C.markerRed} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" pathLength={1}
          strokeDasharray={1} strokeDashoffset={1 - tk}/> : null}
      </svg>
    </Desk>
  );
};
const q71d: React.FC<SP> = ({s0, d}) => {      // Capex fell from 48.8% of revenue to 23.3%
  const f = useTicks(), a = useAt(s0);
  const B = 800, k = 8.8;
  const fmt = (n: number) => n.toFixed(1) + "%";
  const arrow = ease(f, a("q71", "to twenty|-0.1"), a("q71", "to twenty|-0.1") + 18, outCubic);
  const y1 = B - 48.8 * k, y2 = B - 23.3 * k;
  return (
    <Black f={f} cam={[[0, 1.0, 960, 540], [d, 1.1, 1000, 560]]} chip="Jio RHP p.131 · cash capex ÷ revenue · our arithmetic"
      over={<><Mono f={f} at={a("q71", "Capex|0")} text="Capex as a share of revenue" x={70} y={152} size={26}/></>}>
      <BarsBlack f={f} base={B} k={k} bw={270} axis={[360, 1560]} axisAt={a("q71", "Capex|0")} bars={[
        {cx: 700, v: 48.8, at: a("q71", "from forty|-0.2"), dur: 48, color: C.chartBlue, label: "FY24", fmt, size: 96},
        {cx: 1220, v: 23.3, at: a("q71", "to twenty|-0.1"), dur: 44, color: C.highlightPrint, label: "FY26", fmt, size: 96, key: true}]}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        {arrow > 0 ? <path d={`M ${700 + 150} ${y1 - 8} L ${1220 - 150} ${y2 - 120}`} fill="none" stroke={C.markerRed} strokeWidth={9} strokeLinecap="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrow}/> : null}
      </svg>
    </Black>
  );
};

// =====================================================================================================
// q72 · EBITDA minus cash capex, and the honest ending
// =====================================================================================================
const q72a: React.FC<SP> = ({s0, d}) => {      // EBITDA minus cash capex rose from
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.131-132 · KPI table" cam={[[0, 1.0, 960, 540], [d, 1.35, 800, 560, inOut]]}>
      <DocPage f={f} {...DCAP} stack={2} enter={{at: 0, mode: "slide-up"}} highlights={[{rects: [RCAP.row[0]], at: a("q72", T72.cash), dur: 20}]}/>
    </Desk>
  );
};
const q72b: React.FC<SP> = ({s0, d}) => {      // 1,449 crore to 42,071 crore
  const f = useTicks(), a = useAt(s0);
  const B = 810, k = 470 / 42071;
  const fmt = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
  return (
    <Black f={f} cam={[[0, 1.12, 760, 620], [a("q72", 4.0), 1.12, 760, 620], [a("q72", 5.9), 1.0, 960, 540, inOut]]} chip="Jio RHP p.131-132 · FY24 and FY26"
      over={<><Mono f={f} at={2} text="EBITDA minus cash capex · crore" x={70} y={152} size={26}/></>}>
      <BarsBlack f={f} base={B} k={k} bw={300} axis={[380, 1540]} axisAt={0} bars={[
        {cx: 640, v: 1449, at: a("q72", T72.n1449), dur: 36, color: C.chartBlue, label: "FY24", fmt, size: 92},
        {cx: 1260, v: 42071, at: a("q72", T72.n42071), dur: 46, color: C.highlightPrint, label: "FY26", fmt, size: 110, key: true}]}/>
    </Black>
  );
};
const q72c: React.FC<SP> = ({s0, d}) => {      // If returns are low partly because so much spectrum is new on the books, they could rise.
  const f = useTicks(), a = useAt(s0);
  const s = 1.05 - 0.05 * ease(f, 0, d, outCubic);
  return (
    <AbsoluteFill>
      <InkSurface glow={0.08}/>
      <AbsoluteFill style={{transform: `scale(${s})`}}>
        <BigWord f={f} at={a("q72", T72.ifReturns)} text="If returns are low…" x={960} y={300} size={120} italic color="#CFC9BE" stagger={5}/>
        {lab(f, a("q72", T72.spectrum), "Spectrum new on books", 960, 520, {size: 62, dark: false, rot: -2, pop: true})}
        <BigWord f={f} at={a("q72", T72.rise - 0.15)} text="They could rise." x={960} y={760} size={190} stagger={6} mark={["rise."]} markAt={a("q72", T72.rise + 0.3)}/>
      </AbsoluteFill>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};
const q72d: React.FC<SP> = ({s0, d}) => {      // That case is serious.
  const f = useTicks(), a = useAt(s0);
  return <Words f={f} d={d} text="That case is serious." at={a("q72", T72.that - 0.1)} mark={["serious."]} markAt={a("q72", T72.serious)} size={150}/>;
};
const q72e: React.FC<SP> = ({s0, d}) => {      // The filings don't prove it yet.
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.131-132 · KPI table" cam={[[0, 1.1, 1000, 560], [d, 1.0, 960, 540, inOut]]}>
      <DocPage f={f} {...DCAP} stack={2} enter={{at: 0, mode: "slide-left"}} highlights={[{rects: [RCAP.fy24, RCAP.fy26], at: a("q72", T72.filings + 0.3), dur: 14}]}/>
      <Stamp f={f} at={a("q72", T72.prove - 0.05)} text="NOT PROVEN YET" x={1000} y={780} size={104} rot={-6}/>
    </Desk>
  );
};

export const SHOTS7: Shot[] = [
  S("q70", 0, H0, q70a),
  S("q71", 0, WL, q71a), S("q71", "The lowest churn|-0.1", PU, q71b), S("q71", "And the only|-0.1", WD, q71c), S("q71", "Capex fell|-0.1", H0, q71d),
  S("q72", 0, WR, q72a), S("q72", T72.cash + 1.2, H0, q72b), S("q72", T72.ifReturns - 0.1, PU, q72c), S("q72", T72.that - 0.1, H0, q72d), S("q72", T72.filings - 0.05, PU, q72e),
];

export const CUES7: SCue[] = [
  [W("q70", 0.25), "paper", 0.7],
  [W("q71", "The lowest churn|+0.8"), "click", 0.5],
  [W("q71", "only nationwide|-0.1"), "highlighter", 0.6],
  [W("q71", "to twenty|-0.1"), "pop", 0.6],
  [W("q72", T72.n42071), "ding", 0.6],
  [W("q72", T72.prove - 0.05), "stamp", 0.9],
];
