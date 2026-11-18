// Jio film, chapter 5: "The rivals" (beats q50-q55). Reporter's-desk look: real filing pages with the highlighter, bars and numbers on
// black, a hanging tag for the gap. Every number is cued to the word that says it; ₹ is set in Inter.
import React from "react";
import {AbsoluteFill} from "remotion";
import {camI, Desk, MarkerText, Num, Shot, SP, Stamp, Sub, Words} from "../A01V4Parts";
import {SCue} from "../A01V4Cold";
import {BigWord} from "../BigType";
import {PhotoPrint} from "../Collage";
import {DocPage, docRectCentre} from "../DocPage";
import {Rect} from "../Marker";
import {Finish, InkSurface} from "../Texture";
import {C, ease, F, inOut, outCubic, outQuint, spr, useTicks} from "../tokens";
import {H0, MZ, PL, PU, S, useAt, W, WD, WL, WR, WU} from "./kit";
import {BarsBlack, Black, ChapterCardFit, GroupName, lab, Mono, RsNum, TagRs} from "./parts57";

// ---- real pages (rects in image px, from public/voxplus/jio/docs/ch5_*.json) ----
const D117 = {src: "jio/docs/ch5_rhp117.png", imgW: 1374, imgH: 369, x: 960, y: 480, width: 1500, rot: -0.8};
const R117 = {rev: [[101.1, 243.0, 273.0, 29.7], [861.3, 243.0, 108.0, 29.7]] as Rect[]};
const DAIR = {src: "jio/docs/ch5_airtel_q1.png", imgW: 1614, imgH: 204, x: 960, y: 520, width: 1640, rot: -0.5};
const RAIR = {arpu: [202.7, 48.2, 312.5, 30.1] as Rect, post: [499.0, 134.7, 316.8, 30.1] as Rect};
const DAAR = {src: "jio/docs/ch5_airtel_ar.png", imgW: 750, imgH: 305, x: 960, y: 520, width: 1180, rot: 0.8};
const RAAR = {q: [[240.7, 197.4, 473.7, 35.1], [15.7, 230.5, 430.4, 35.1]] as Rect[]};
const D137 = {src: "jio/docs/ch5_rhp137_vi.png", imgW: 2082, imgH: 321, x: 960, y: 470, width: 1660, rot: -0.5};
const R137 = {vi: [1824.0, 288.9, 73.2, 25.2] as Rect, row: [20.1, 288.9, 121.8, 25.2] as Rect, head: [1679.7, 27.3, 369.0, 25.2] as Rect};
const DVI = {src: "jio/docs/ch5_vi_ar.png", imgW: 798, imgH: 140, x: 960, y: 500, width: 1480, rot: -0.7};
const RVI = {debt: [[18.4, 6.5, 756.9, 34.9], [18.3, 49.2, 765.3, 35.4]] as Rect[], num: [18.3, 49.2, 191.7, 35.4] as Rect};

const BASE = 800, K = 1.5, BW = 190;
const REV = C.chartBlue, EB = C.highlightPrint;

// =====================================================================================================
// q50 · chapter card
// =====================================================================================================
const q50a: React.FC<SP> = () => <ChapterCardFit f={useTicks()} n={5} word="The rivals"/>;

// =====================================================================================================
// q51 · Jio, per customer per month (growing comparison starts)
// =====================================================================================================
const q51p: React.FC<SP> = ({s0, d}) => {      // "Now per customer, per month," (hand with a phone: CC0 Samson Vowles via Wikimedia Commons)
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Per customer · per month · FY26" cam={[[0, 1.0, 900, 540], [d, 1.1, 960, 520]]}>
      <PhotoPrint f={f} src="jio/media/hand_phone_lockscreen_print.jpg" x={900} y={520} w={1180} h={820} rot={-2} halftone={0.12} enter={{at: 0, mode: "none"}}/>
      {lab(f, a("q51", "per customer"), "Per customer", 1480, 360, {size: 76, rot: 3})}
      {lab(f, a("q51", "per month"), "Per month", 1480, 520, {size: 76, rot: -2, dark: false})}
    </Desk>
  );
};
const q51a: React.FC<SP> = ({s0, d}) => {      // "last year."
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(D117, R117.rev[1]);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.117 · RJIL · FY26" cam={[[0, 1.0, 960, 540], [8, 1.0, 960, 540], [d, 1.4, c.x - 120, c.y + 30, inOut]]}>
      <DocPage f={f} {...D117} stack={2} enter={{at: 0, mode: "slide-right"}} highlights={[{rects: R117.rev, at: a("q51", "last year|+0.15"), dur: 16}]}/>
      {lab(f, a("q51", "last year|+0.2"), "Revenue ÷ customers ÷ 12", 960, 880, {size: 56})}
      {lab(f, a("q51", "Jio's|0"), "Jio's telecom company", 960, 190, {size: 56, dark: false, rot: -2})}
    </Desk>
  );
};
const compSub = (f: number) => <Mono f={f} at={4} text="FY26 · per customer · per month" x={70} y={152} size={26}/>;
const q51b: React.FC<SP> = ({s0, d}) => {      // Jio's telecom company took in about 212 and kept about 119
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} cam={[[0, 1.22, 640, 560], [d, 1.3, 650, 556]]} chip="Jio RHP p.117, 131 · our arithmetic" over={compSub(f)}>
      <GroupName f={f} at={2} text="JIO" x={640} y={250}/>
      <BarsBlack f={f} base={BASE} k={K} bw={BW} axis={[400, 1500]} axisAt={0} bars={[
        {cx: 520, v: 212, at: a("q51", "about two"), dur: 30, color: REV, label: "Revenue"},
        {cx: 760, v: 119, at: a("q51", "about one"), dur: 34, color: EB, label: "EBITDA", key: true}]}/>
    </Black>
  );
};

// =====================================================================================================
// q52 · Airtel joins the chart, then what Airtel says
// =====================================================================================================
const q52a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} cam={[[0, 1.3, 650, 556], [a("q52", 0.3), 1.3, 650, 556], [a("q52", 1.9), 1.0, 960, 540, inOut]]}
      chip="Jio RHP p.117, 131 · Airtel AR note 34, p.180 · our arithmetic" over={compSub(f)}>
      <GroupName f={f} at={-99} text="JIO" x={640} y={250}/>
      <GroupName f={f} at={a("q52", 0.15)} text="AIRTEL" x={1280} y={250}/>
      <BarsBlack f={f} base={BASE} k={K} bw={BW} axis={[400, 1500]} axisAt={-99} bars={[
        {cx: 520, v: 212, at: -999, color: REV, label: "Revenue"},
        {cx: 760, v: 119, at: -999, color: EB, label: "EBITDA", key: true},
        {cx: 1160, v: 256, at: a("q52", "about two"), dur: 36, color: REV, label: "Revenue"},
        {cx: 1400, v: 154, at: a("q52", "about one"), dur: 36, color: EB, label: "EBITDA", key: true}]}/>
    </Black>
  );
};
const q52b: React.FC<SP> = ({s0, d}) => {      // Airtel says its strategy is winning quality customers and premiumising
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(DAAR, RAAR.q[0]);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Airtel annual report 2025-26 · p.180" cam={[[0, 1.0, 960, 540], [a("q52", "winning|-0.5"), 1.05, 960, 520], [d, 1.45, c.x + 60, c.y + 40, inOut]]}>
      <DocPage f={f} {...DAAR} stack={2} enter={{at: 0, mode: "slide-left"}}
        highlights={[{rects: RAAR.q, at: a("q52", "winning|-0.1"), dur: 22}]}/>
      {lab(f, a("q52", "Airtel says"), "Airtel says", 640, 190, {size: 60, dark: false, rot: -3})}
    </Desk>
  );
};

// =====================================================================================================
// q53 · June quarter: two price tags, definitions differ
// =====================================================================================================
const q53a: React.FC<SP> = ({s0, d}) => {      // June quarter, 3.0 crore postpaid
  const f = useTicks(), a = useAt(s0);
  const cp = docRectCentre(DAIR, RAIR.post);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Airtel Q1 FY27 media release · p.2" cam={[[0, 1.0, 900, 540], [a("q53", 1.2), 1.0, 900, 540], [d, 1.55, cp.x - 60, cp.y, inOut]]}>
      <DocPage f={f} {...DAIR} stack={2} enter={{at: 0, mode: "slide-up"}} highlights={[{rects: [RAIR.post], at: a("q53", "three crore|-0.05"), dur: 20}]}/>
      {lab(f, a("q53", "June quarter"), "June 2026 quarter", 960, 270, {size: 60})}
      {lab(f, a("q53", "three crore"), "30.0 Mn = 3.0 crore", cp.x, cp.y + 160, {size: 58, dark: false, rot: 2})}
    </Desk>
  );
};
const q53b: React.FC<SP> = ({s0, d}) => {      // a mobile ARPU of 264
  const f = useTicks(), a = useAt(s0);
  const ca = docRectCentre(DAIR, RAIR.arpu);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Airtel Q1 FY27 media release · p.2" cam={[[0, 1.5, ca.x + 380, ca.y], [d, 1.9, ca.x + 120, ca.y, inOut]]}>
      <DocPage f={f} {...DAIR} stack={2} highlights={[{rects: [RAIR.post], at: -50, dur: 1}, {rects: [RAIR.arpu], at: a("q53", "two hundred and sixty|-0.25"), dur: 20}]}/>
      {lab(f, a("q53", "mobile ARPU"), "Mobile ARPU", ca.x + 50, ca.y - 150, {size: 56, rot: -2})}
    </Desk>
  );
};
const q53c: React.FC<SP> = ({s0, d}) => {      // Airtel tag, then Jio's
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Airtel Q1 FY27 release · Jio RHP p.131" cam={[[0, 1.05, 960, 520], [d, 1.0, 960, 540]]}>
      <TagRs f={f} enterAt={0} x={620} y={-60} string={330} scale={1.45} text="₹264"/>
      <TagRs f={f} enterAt={a("q53", "two hundred and fifteen|-0.45")} x={1300} y={-60} string={330} scale={1.45} text="₹215.6"/>
      {lab(f, 6, "Airtel", 620, 800, {size: 66, rot: -2})}
      {lab(f, a("q53", "Jio's|-0.1"), "Jio", 1300, 800, {size: 66, rot: 2})}
    </Desk>
  );
};
const q53d: React.FC<SP> = ({s0, d}) => {      // The two are defined differently
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Airtel Q1 FY27 release · Jio RHP p.131" cam={[[0, 1.0, 960, 540], [d, 1.12, 960, 470, inOut]]}>
      <TagRs f={f} enterAt={-200} x={620} y={-60} string={330} scale={1.45} text="₹264"/>
      <TagRs f={f} enterAt={-200} x={1300} y={-60} string={330} scale={1.45} text="₹215.6"/>
      {lab(f, -10, "Airtel", 620, 800, {size: 66, rot: -2})}
      {lab(f, -10, "Jio", 1300, 800, {size: 66, rot: 2})}
      <MarkerText f={f} at={a("q53", "The two|0")} text="≠" x={960} y={360} size={260} rot={-4}/>
      <Stamp f={f} at={a("q53", "defined differently|-0.05")} text="DEFINITIONS DIFFER" x={960} y={625} size={78} rot={-5}/>
    </Desk>
  );
};

// =====================================================================================================
// q54 · Vodafone Idea
// =====================================================================================================
const q54a: React.FC<SP> = ({s0, d}) => {      // took in about 191, kept about 81
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} cam={[[0, 1.14, 960, 560], [d, 1.0, 960, 540]]} chip="Jio RHP p.136 · our arithmetic" over={compSub(f)}>
      <GroupName f={f} at={2} text="VODAFONE IDEA" x={960} y={275} size={72}/>
      <BarsBlack f={f} base={BASE} k={K} bw={BW} axis={[560, 1360]} axisAt={0} bars={[
        {cx: 760, v: 191, at: a("q54", "about one"), dur: 30, color: REV, label: "Revenue"},
        {cx: 1160, v: 81, at: a("q54", "kept about|+0.1"), dur: 26, color: EB, label: "EBITDA", key: true}]}/>
    </Black>
  );
};
const q54b: React.FC<SP> = ({s0, d}) => {      // After depreciation it made a loss
  const f = useTicks(), a = useAt(s0);
  const cv = docRectCentre(D137, R137.vi);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.137 · peer table · FY26" cam={[[0, 1.0, 960, 540], [a("q54", "After depreciation|-0.1"), 1.0, 960, 540], [a("q54", "made a loss|-0.2"), 2.3, cv.x - 80, cv.y, inOut], [d, 2.4, cv.x - 90, cv.y]]}>
      <DocPage f={f} {...D137} stack={2} enter={{at: 0, mode: "slide-right"}}
        highlights={[{rects: [R137.head], at: a("q54", "After depreciation|0"), dur: 18}, {rects: [R137.row, R137.vi], at: a("q54", "it made|0"), dur: 14}]}
        circles={[{rect: R137.vi, at: a("q54", "a loss|-0.1"), dur: 16}]}/>
      {lab(f, a("q54", "made a loss"), "EBIT margin −6.9%", cv.x - 150, cv.y + 150, {size: 34, dark: false, bg: C.markerRed, color: C.white, rot: -2})}
    </Desk>
  );
};
const q54c: React.FC<SP> = ({s0, d}) => {      // it owes the government
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(DVI, RVI.num);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Vodafone Idea annual report 2025-26 · PDF p.35" cam={[[0, 1.0, 960, 540], [d, 1.45, c.x - 160, c.y, inOut]]}>
      <DocPage f={f} {...DVI} stack={2} enter={{at: 0, mode: "slide-up"}} highlights={[{rects: RVI.debt, at: a("q54", "owes|-0.4"), dur: 16}]}/>
      {lab(f, a("q54", "government"), "Owed to government", 960, 840, {size: 56, rot: -2})}
    </Desk>
  );
};
const q54d: React.FC<SP> = ({s0, d}) => {      // about one point four five lakh crore rupees
  const f = useTicks(), a = useAt(s0);
  const t0 = a("q54", "one point four five|-0.1");
  return (
    <Black f={f} cam={[[0, 1.1, 960, 560], [d, 1.0, 960, 540, outCubic]]} chip="Vodafone Idea annual report 2025-26 · PDF p.35" glow={0.1}>
      <Num f={f} at={t0} to={145454} dur={50} x={960} y={470} size={290} color={C.markerRed} pre="₹" preSans/>
      <Sub f={f} at={t0 + 42} text="crore · owed to the government" x={960} y={660} size={40} color="#CFC9BE"/>
    </Black>
  );
};

// =====================================================================================================
// q55 · re-hook and the turn
// =====================================================================================================
const q55a: React.FC<SP> = ({s0, d}) => {     // So Jio leads on subscribers. (crowd: CC0 Projjalm via Wikimedia Commons)
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Customers, Mar 2026 · Jio RHP p.131 · Airtel AR" cam={[[0, 1.0, 960, 540], [d, 1.12, 900, 520]]}>
      <PhotoPrint f={f} src="jio/media/crowd_dumdum_platform_print.jpg" x={960} y={500} w={1240} h={930} rot={1.5} halftone={0.1} enter={{at: 0, mode: "none"}} crop={{s0: 1.0, s1: 1.12, dur: 70}}/>
      {lab(f, a("q55", "Jio leads|0"), "Jio leads on subscribers", 960, 850, {size: 70, rot: -1.5})}
    </Desk>
  );
};
const q55b: React.FC<SP> = ({s0, d}) => {      // But Airtel keeps about 35 more EBITDA
  const f = useTicks(), a = useAt(s0);
  const yJ = BASE - 119 * 2.2, yA = BASE - 154 * 2.2, xA = 700 + 95 + 28, xB = 1220 - 95 - 28;
  const t35 = a("q55", "thirty five|-0.15");
  const bp = ease(f, t35, t35 + 14, outCubic);
  const sl = spr(f, t35 + 6, 10, 220);
  return (
    <Black f={f} cam={[[0, 1.0, 960, 540], [d, 1.12, 960, 520]]} chip="Jio RHP p.117, 131 · Airtel AR note 34 · our arithmetic"
      over={<><Mono f={f} at={2} text="EBITDA per customer · per month · FY26" x={70} y={152} size={26}/></>}>
      <GroupName f={f} at={4} text="JIO" x={700} y={285}/>
      <GroupName f={f} at={a("q55", "Airtel|-0.1")} text="AIRTEL" x={1220} y={285}/>
      <BarsBlack f={f} base={BASE} k={2.2} bw={220} axis={[440, 1480]} axisAt={0} bars={[
        {cx: 700, v: 119, at: 2, dur: 22, color: REV, size: 80},
        {cx: 1220, v: 154, at: a("q55", "keeps about|-0.2"), dur: 30, color: EB, key: true, size: 80}]}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        {bp > 0 ? <path d={`M ${xA} ${yJ} L ${xA + 34} ${yJ} L ${xA + 34} ${yA} L ${xB} ${yA}`} fill="none" stroke={C.markerRed} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - bp}/> : null}
      </svg>
      {f >= t35 + 6 ? <div style={{position: "absolute", left: 960, top: 700, transform: `translate(-50%, -50%) scale(${1.5 - 0.5 * sl}) rotate(-4deg)`, opacity: Math.min(1, sl * 3)}}>
        <RsNum text="+₹35" size={100} color={C.markerRed}/></div> : null}
    </Black>
  );
};
const q55c: React.FC<SP> = ({s0, d}) => {      // from every customer, every month: a tag
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.117, 131 · Airtel AR note 34 · our arithmetic" cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 560, inOut]]}>
      <TagRs f={f} enterAt={0} x={960} y={-10} string={300} scale={1.55} text="+₹35" slam/>
      {lab(f, a("q55", "every customer"), "Per customer", 960, 690, {size: 76, rot: -2})}
      {lab(f, a("q55", "every month|-0.05"), "Per month", 960, 830, {size: 76, rot: 2, dark: false})}
    </Desk>
  );
};
const q55d: React.FC<SP> = ({s0, d}) => {      // The real question isn't who is bigger. It's who is better protected.
  const f = useTicks(), a = useAt(s0);
  const kp = ease(f, a("q55", "real question|-0.1"), a("q55", "real question|-0.1") + 14, outQuint);
  const sp = ease(f, a("q55", "bigger"), a("q55", "bigger") + 8, outCubic);
  const s = 1.0 + 0.06 * ease(f, 0, d, outCubic);
  return (
    <AbsoluteFill>
      <InkSurface glow={0.08}/>
      <AbsoluteFill style={{transform: `scale(${s})`}}>
        <div style={{position: "absolute", left: 960, top: 250, transform: `translate(-50%, -50%) translateY(${(1 - kp) * 24}px)`, opacity: kp, fontFamily: F.serif, fontStyle: "italic",
          fontSize: 78, color: "#CFC9BE", whiteSpace: "nowrap"}}>The real question</div>
        <BigWord f={f} at={a("q55", "who is bigger|-0.1")} text="Who is bigger?" x={960} y={450} size={130} color="#8C877F" stagger={4}/>
        <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          {sp > 0 ? <path d="M 560 480 L 1360 424" stroke={C.markerRed} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sp}/> : null}
        </svg>
        <BigWord f={f} at={a("q55", "who is better|-0.1")} text="Who is better protected?" x={960} y={700} size={140} stagger={5} mark={["better", "protected"]}
          markAt={a("q55", "better protected|-0.05")}/>
      </AbsoluteFill>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};
const q55e: React.FC<SP> = ({s0, d}) => {      // Let's test Jio's walls, one at a time.
  const f = useTicks(), a = useAt(s0);
  const camS = 1.08 - 0.08 * ease(f, 0, d, outCubic);
  return (
    <AbsoluteFill>
      <InkSurface glow={0.08}/>
      <AbsoluteFill style={{transform: `scale(${camS})`}}>
        <BigWord f={f} at={a("q55", "test|-0.15")} text="Testing Jio's walls" x={960} y={400} size={150} stagger={5}/>
        {[0, 1, 2, 3, 4].map((i) => {
          const at = a("q55", "one at a|-0.3") + i * 8, p = spr(f, at, 11, 200);
          if (f < at) return null;
          return <div key={i} style={{position: "absolute", left: 960 - 560 + i * 224 + 8, top: 660 + (i % 2) * 6, width: 208, height: 120, transform: `scale(${0.5 + 0.5 * p}) rotate(${(i - 2) * 1.2}deg)`, opacity: Math.min(1, p * 3),
            background: "linear-gradient(170deg,#F3EEE3,#E2DAC6)", boxShadow: "0 6px 14px rgba(0,0,0,0.5)", border: "3px solid #8C877F"}}/>;
        })}
      </AbsoluteFill>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};

export const SHOTS5: Shot[] = [
  S("q50", 0, H0, q50a),
  S("q51", 0, H0, q51p), S("q51", "last year|-0.15", PL, q51a), S("q51", "took in|-0.1", WL, q51b),
  S("q52", 0, H0, q52a), S("q52", "Airtel says|-0.1", PU, q52b),
  S("q53", 0, WD, q53a), S("q53", "and a mobile|-0.05", H0, q53b), S("q53", "sixty four|-0.15", PL, q53c), S("q53", "The two|-0.1", H0, q53d),
  S("q54", 0, WR, q54a), S("q54", "After depreciation|-0.05", PU, q54b), S("q54", "and it owes|-0.1", WU, q54c), S("q54", "about one point|-0.05", H0, q54d),
  S("q55", 0, WL, q55a), S("q55", "But Airtel|-0.05", H0, q55b), S("q55", "from every|-0.1", PU, q55c), S("q55", "The real|-0.1", WD, q55d), S("q55", "Let's test|-0.1", H0, q55e),
];

export const CUES5: SCue[] = [
  [W("q50", 0.25), "paper", 0.7],
  [W("q51", "last year|0"), "highlighter", 0.6],
  [W("q51", "about two|0"), "pop", 0.5],
  [W("q52", "winning|-0.1"), "highlighter", 0.6],
  [W("q53", "three crore|-0.05"), "highlighter", 0.55],
  [W("q53", "sixty four|-0.15"), "click", 0.6],
  [W("q53", "defined differently|-0.05"), "stamp", 0.8],
  [W("q54", "After depreciation|0"), "paper", 0.5],
  [W("q54", "about one point|-0.05"), "stamp", 0.9],
  [W("q55", "thirty five|-0.15"), "stamp", 0.8],
  [W("q55", "better protected|-0.05"), "ding", 0.55],
];
