// Jio film, chapter 6: "The moat test" (beats q60..q6f). Five walls tested one at a time on a recurring WALLS SCORECARD
// (typed ruled card, marker ticks, rubber stamps). Real RHP pages with the yellow highlighter, charts on black, rupee tags,
// a spectrum bar that splits, a paper timeline, a map with 22 dots. Every number and highlight is cued to the spoken word.
import React from "react";
import {AbsoluteFill} from "remotion";
import {BigWord} from "../BigType";
import {Cam, camAt, CamKey, Layer} from "../Camera";
import {ChapterCard, SourceTag} from "../Cards";
import {PhotoPrint, StickerLabel} from "../Collage";
import {docRectCentre} from "../DocPage";
import {MapRoute, Pin, useGeo} from "../MapRoute";
import {MarkerUnderline} from "../Marker";
import {Finish, InkSurface} from "../Texture";
import {C, F, W, H, clamp01, ease, inOut, outCubic, outQuint, spr, useTicks} from "../tokens";
import {SCue} from "../A01V4Cold";
import {Desk, MarkerText, Num, Shot, SP, Stamp, StickyNote, Sub, Words, camI} from "../A01V4Parts";
import {H0, MZ, PL, PU, S, WD, WL, WR, WU, W as WS, useAt} from "./kit";
import {Bars, DocPage, DotGrid, Ink, PaperShot, R, RowSpec, RTag, ScoreCard, Slip, TimeStrip, dp} from "./parts6";

const done = (v: RowSpec["v"]): RowSpec => ({open: -300, v, vAt: -300});
const ROWS_UP_TO = (n: number): RowSpec[] => [done("PARTIAL"), done("PARTIAL"), done("STRONG"), done("BORDERLINE"), done("DEPENDENCY")].slice(0, n);

/** sticker label that pops in at tick `at` */
const pop = (f: number, at: number, text: string, x: number, y: number, o: {size?: number; dark?: boolean; rot?: number; bg?: string; color?: string} = {}) =>
  <StickerLabel f={f} text={text} x={x} y={y} size={o.size ?? 56} dark={o.dark} rot={o.rot ?? -2} bg={o.bg} color={o.color} enter={{at, mode: "pop", rot0: (o.rot ?? -2) > 0 ? 10 : -10}}/>;

// =====================================================================================================
// q60: chapter card
// =====================================================================================================
const s60: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <AbsoluteFill>
      <ChapterCard f={f} n={6} word="The moat test" kicker="Five walls, one scorecard"/>
      <ScoreCard f={f} x={1600} y={1040} s={0.62} rot={-4} enter={a("q60", "moat") - 8} rows={[]}/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// =====================================================================================================
// q61: wall one, cost. data carried
// =====================================================================================================
const s61a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="cream" chip="Jio RHP p.131 · FY26"
      over={<ScoreCard f={f} x={1480} y={560} s={0.86} rot={2} enter={6} rows={[{open: a("q61", "cost")}]}/>}>
      <PhotoPrint f={f} src="jio/media/dc_roof_cooling_print.jpg" x={560} y={760} w={620} h={430} rot={-4} halftone={0.12} caption="Data centre roof (generic) · Rsparks3, CC0"
        enter={{at: 10, mode: "drop", rot0: 6, stepped: 2}}/>
      <BigWord f={f} at={3} text="Wall one: cost" x={560} y={290} size={170} color={C.ink} maxWidth={900} mark={["cost"]} markAt={a("q61", "cost")}/>
    </Desk>
  );
};
const s61b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Ink f={f} d={d} chip="Jio RHP p.131 · FY26 · billion GB">
      <Sub f={f} at={4} text="Jio's network carried" x={960} y={250} size={52} color="#CFC9BE"/>
      <Num f={f} at={a("q61", "two hundred")} to={241.4} dec={1} x={960} y={500} size={360} color={C.highlightPrint} dur={34}/>
      <Sub f={f} at={a("q61", "billion")} text="billion GB, last year" x={960} y={740} size={50} color={C.white}/>
    </Ink>
  );
};
const s61c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Ink f={f} d={d} chip="Jio RHP p.131, p.136-137 · FY26 · billion GB" glow={0.07}>
      <Bars f={f} title="Data carried" titleAt={0} max={260} box={{x: 620, y: 290, w: 1000, h: 540}} 
        items={[
          {label: "Jio (incl. fixed)", value: 241.4, text: "241.4", dec: 1, at: -100, key: true},
          {label: "Airtel (mobile)", value: 101.3, text: "101.3", dec: 1, at: a("q61", "about one") - 8},
          {label: "Vodafone Idea", value: 28.9, text: "28.9", dec: 1, at: a("q61", "about twenty") - 8},
        ] as never}/>
    </Ink>
  );
};
const KPI = dp("kpi", 960, 560, 1500, -0.5);
const s61d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(KPI, R("kpi", "241.4")[0] as never);
  return (
    <PaperShot f={f} d={d} tone="kraft" chip="Jio RHP p.131 · key performance indicators"
      cam={camAt(f, [[0, 1.0, 960, 540], [a("q61", "includes fixed"), 1.0, 960, 540], [a("q61", "includes fixed") + 24, 1.3, c.x - 150, c.y + 40, inOut], [d, 1.34, c.x - 200, c.y + 60]])}>
      <DocPage f={f} {...KPI} stack={2} enter={{at: 0, mode: "slide-up", dur: 12}}
        highlights={[{rects: [...R("kpi", "Data Traffic"), ...R("kpi", "241.4")], at: a("q61", "Jio's figure") + 6, dur: 14}]}
        focus={{rect: [0, 240, 1440, 44], at: a("q61", "includes fixed"), blur: 2.4}}/>
      {pop(f, a("q61", "includes fixed"), "Includes fixed broadband", 1050, 250, {size: 54})}
      {pop(f, a("q61", "mobile only"), "Airtel: mobile only", 700, 880, {size: 54, dark: true, rot: 2})}
    </PaperShot>
  );
};

// =====================================================================================================
// q62: operating cost per GB, two tags
// =====================================================================================================
const s62a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} chip="Our arithmetic · Jio RHP p.117, p.131">
      <Slip f={f} x={600} y={520} w={720} size={46} enter={2} head="PER GB"
        lines={[{t: "OPERATING COST", at: 8}, {t: "÷ GB CARRIED", at: 26}, {t: "= COST PER GB", at: 44, bold: true, color: C.markerRed}]}/>
      <MarkerText f={f} at={a("q62", "arithmetic") - 6} text="our arithmetic" x={1340} y={470} size={120} rot={-5} dur={20}/>
    </Desk>
  );
};
const s62b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} chip="Our arithmetic · Jio RHP p.117, p.131" cam={[[0, 1.0, 960, 540], [d, 1.08, 780, 540]]}>
      <RTag f={f} at={2} x={600} y={-40} string={420} size={170} to={2.34} countAt={a("q62", "two rupees")} dur={26}/>
      <Slip f={f} x={1380} y={540} w={560} size={34} rot={3} lines={[{t: "OPERATING COST", at: -100}, {t: "÷ GB CARRIED", at: -100}]}/>
      {pop(f, a("q62", "Jio spent") + 6, "Jio, per GB", 600, 850, {size: 56})}
    </Desk>
  );
};
const s62c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} chip="Airtel AR p.250 · our arithmetic · mobile only" cam={[[0, 1.0, 780, 540], [d, 1.0, 1160, 540]]}>
      <RTag f={f} at={-100} x={600} y={-40} string={420} size={170} to={2.34} countAt={-100}/>
      <RTag f={f} at={a("q62", "Airtel's mobile") + 2} x={1330} y={-40} string={420} size={170} to={4.35} countAt={a("q62", "four rupees")} dur={26}/>
      {pop(f, 4, "Jio", 600, 850, {size: 56})}
      {pop(f, a("q62", "Airtel's mobile") + 8, "Airtel mobile", 1330, 850, {size: 56, dark: true, rot: 2})}
    </Desk>
  );
};

// =====================================================================================================
// q63: sensitivity, price per GB, verdict on wall one
// =====================================================================================================
const STRIP = {x0: 260, x1: 1660, y: 600, h: 170};
const px = (pct: number) => STRIP.x0 + (STRIP.x1 - STRIP.x0) * (pct / 100);
const s63a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const band = ease(f, a("q63", "twenty to") - 2, a("q63", "twenty to") + 24, inOut);
  return (
    <Desk f={f} d={d} chip="Our assumption · the RHP gives no split" cam={[[0, 1.0, 900, 540], [d, 1.12, 700, 560]]}>
      <div style={{position: "absolute", left: STRIP.x0 - 30, top: STRIP.y - STRIP.h / 2, width: STRIP.x1 - STRIP.x0 + 60, height: STRIP.h, background: "#FBF8F1",
        boxShadow: "0 3px 4px rgba(30,20,10,0.18), 0 18px 36px rgba(30,20,10,0.26)", transform: "rotate(-0.5deg)"}}/>
      <div style={{position: "absolute", left: px(20), top: STRIP.y - STRIP.h / 2 + 12, width: (px(40) - px(20)) * band, height: STRIP.h - 24, background: C.highlight, mixBlendMode: "multiply"}}/>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        {Array.from({length: 21}).map((_, i) => <line key={i} x1={px(i * 5)} x2={px(i * 5)} y1={STRIP.y + STRIP.h / 2 - (i % 2 ? 22 : 40)} y2={STRIP.y + STRIP.h / 2 - 4} stroke={C.ink} strokeWidth={i % 2 ? 3 : 5}/>)}
      </svg>
      <div style={{position: "absolute", left: px(20), top: STRIP.y - STRIP.h / 2 - 80, transform: "translateX(-50%)", fontFamily: F.serif, fontSize: 92, color: C.ink, opacity: ease(f, a("q63", "twenty to"), a("q63", "twenty to") + 8)}}>20%</div>
      <div style={{position: "absolute", left: px(40), top: STRIP.y - STRIP.h / 2 - 80, transform: "translateX(-50%)", fontFamily: F.serif, fontSize: 92, color: C.ink, opacity: ease(f, a("q63", "forty"), a("q63", "forty") + 8)}}>40%</div>
      {pop(f, 6, "Home broadband share", 560, 310, {size: 50})}
      {pop(f, a("q63", "Jio's traffic"), "Our assumption", 1330, 430, {size: 50, dark: true, rot: 2})}
      <Stamp f={f} at={a("q63", "doesn't disclose")} text="NOT DISCLOSED" x={1180} y={800} size={86} rot={-5}/>
    </Desk>
  );
};
const s63b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Ink f={f} d={d} chip="Our assumptions · RHP gives no split">
      <Sub f={f} at={4} text="Jio would still be" x={960} y={250} size={54} color="#CFC9BE"/>
      <Num f={f} at={a("q63", "twenty four")} to={24} suf="%" x={600} y={520} size={400} color={C.white} dur={22}/>
      <div style={{position: "absolute", left: 960, top: 520, transform: "translate(-50%, -50%)", fontFamily: F.serif, fontSize: 300, color: "#8C877F", opacity: ease(f, a("q63", "to thirty"), a("q63", "to thirty") + 8)}}>–</div>
      <Num f={f} at={a("q63", "thirty eight")} to={38} suf="%" x={1320} y={520} size={400} color={C.highlightPrint} dur={22}/>
      <Sub f={f} at={a("q63", "cheaper")} text="cheaper · our assumptions" x={960} y={790} size={52} color={C.white}/>
    </Ink>
  );
};
const s63c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} chip="Our arithmetic · price per GB, approximate" cam={[[0, 1.04, 960, 540], [d, 1.0, 960, 540]]}>
      {pop(f, a("q63", "also charges") + 4, "Price per GB", 960, 160, {size: 72, dark: true})}
      <RTag f={f} at={a("q63", "about five") - 14} x={620} y={-40} string={380} size={190} to={5} dec={0} countAt={a("q63", "five rupees")} dur={14}/>
      <RTag f={f} at={a("q63", "against") - 6} x={1300} y={-40} string={380} size={190} to={8} dec={0} countAt={a("q63", "against") + 24} dur={14}/>
      {pop(f, a("q63", "about five") + 8, "Jio", 620, 850, {size: 56})}
      {pop(f, a("q63", "against") + 6, "Airtel", 1300, 850, {size: 56, dark: true, rot: 2})}
    </Desk>
  );
};
const s63d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Our reading · wall one" cam={[[0, 1.06, 900, 560], [d, 1.0, 960, 540, outCubic]]}
      over={<ScoreCard f={f} x={640} y={540} s={0.98} rot={-2} enter={2} rows={[{open: -20, v: "PARTIAL", vAt: a("q63", "a margin")}]}/>}>
      {pop(f, a("q63", "real cost lead"), "A real cost lead", 1420, 400, {size: 66})}
      {pop(f, a("q63", "not yet"), "No margin lead yet", 1420, 600, {size: 66, dark: true, rot: 2})}
    </Desk>
  );
};

// =====================================================================================================
// q64: wall two, spectrum (a bar that splits with the words)
// =====================================================================================================
const BAR = {x0: 210, w: 1500, y: 730, h: 150};
const SHARE = 22000 / 26800.8;
const s64a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="cream" chip="Jio RHP p.221-225"
      over={<ScoreCard f={f} x={470} y={540} s={0.92} rot={-2} enter={4} from="left" rows={[done("PARTIAL"), {open: a("q64", "spectrum")}]}/>}>
      <BigWord f={f} at={3} text="Wall two: spectrum" x={1330} y={500} size={150} color={C.ink} maxWidth={800} mark={["spectrum"]} markAt={a("q64", "spectrum")}/>
    </Desk>
  );
};
const s64b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const grow = ease(f, a("q64", "twenty six thousand") + 4, a("q64", "twenty six thousand") + 34, outCubic);
  const tS = a("q64", "Twenty two thousand"), sp = ease(f, tS, tS + 16, outCubic), gap = 44 * sp;
  const wA = BAR.w * SHARE * grow, wB = BAR.w * (1 - SHARE) * grow;
  const aCol = sp > 0 ? C.highlightPrint : C.chartBlue;
  return (
    <Ink f={f} d={d} chip="Jio RHP p.221-225 · MHz · 82% is our arithmetic">
      <Sub f={f} at={a("q64", "Remember")} text="Jio's spectrum, MHz" x={960} y={200} size={50} color="#CFC9BE"/>
      <Num f={f} at={a("q64", "twenty six thousand")} to={26800.8} dec={1} x={960} y={400} size={250} color={C.white} dur={40}/>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <rect x={BAR.x0 - gap} y={BAR.y - BAR.h / 2} width={Math.max(0, wA)} height={BAR.h} fill={aCol}/>
        <rect x={BAR.x0 + wA + gap} y={BAR.y - BAR.h / 2} width={Math.max(0, wB)} height={BAR.h} fill={C.chartBlue}/>
      </svg>
      <Num f={f} at={tS + 4} to={22000} x={BAR.x0 + (BAR.w * SHARE) / 2 - gap} y={BAR.y - 160} size={110} color={C.highlightPrint} dur={28} slam={false}/>
      {pop(f, a("q64", "twenty six gigahertz"), "26 GHz band", BAR.x0 + (BAR.w * SHARE) / 2 - gap, BAR.y + 135, {size: 52, rot: -2})}
      {pop(f, tS + 12, "All other bands", BAR.x0 + BAR.w * SHARE + gap + (BAR.w * (1 - SHARE)) / 2 - 20, BAR.y + 135, {size: 40, dark: true, rot: 2})}
    </Ink>
  );
};
const s64c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t0 = a("q64", "each of"), tE = a("q64", "That's eighty") - 6, dim = ease(f, tE, tE + 10);
  const bw = 124, bh = 128, gx = 16, gx0 = 960 - (11 * (bw + gx) - gx) / 2;
  return (
    <Ink f={f} d={d} chip="Jio RHP p.221-225 · 22 circles · 82% our arithmetic">
      {pop(f, a("q64", "a thousand"), "1,000 MHz each", 560, 200, {size: 60, dark: true})}
      {pop(f, a("q64", "twenty two circles"), "22 circles", 1360, 200, {size: 60})}
      {Array.from({length: 22}).map((_, i) => {
        const at = t0 + i * 1.4, k = spr(f, at, 9, 230);
        if (f < at) return null;
        const col = i % 11, row = Math.floor(i / 11);
        return <div key={i} style={{position: "absolute", left: gx0 + col * (bw + gx), top: 290 + row * (bh + gx), width: bw, height: bh, background: C.highlightPrint, opacity: (1 - 0.6 * dim) * clamp01(k * 3),
          transform: `scale(${0.5 + 0.5 * k})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.serif, fontSize: 36, color: C.ink}}>1,000</div>;
      })}
      <Num f={f} at={a("q64", "eighty two")} to={82} suf="%" x={960} y={790} size={310} color={C.white} dur={22}/>
      <Sub f={f} at={a("q64", "eighty two") + 12} text="of Jio's spectrum" x={960} y={950} size={40} color="#CFC9BE"/>
    </Ink>
  );
};

// =====================================================================================================
// q65: the 26 GHz band: fixed wireless; Airtel holds it too; leave it out
// =====================================================================================================
const SPEC = dp("spec", 960, 470, 1560, -0.6);
const s65a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(SPEC, R("spec", "access at high capacity")[0] as never);
  return (
    <PaperShot f={f} d={d} tone="cream" chip="Jio RHP p.164 · industry overview (Jio-paid report)"
      cam={camAt(f, [[0, 1.0, 960, 560], [a("q65", "band lets"), 1.0, 960, 540], [a("q65", "band lets") + 30, 1.22, c.x + 120, c.y - 30, inOut], [d, 1.26, c.x + 150, c.y - 10]])}>
      <DocPage f={f} {...SPEC} stack={3} enter={{at: 0, mode: "slide-up", dur: 12}}
        highlights={[{rects: [...R("spec", "26GHz band enables the company to deploy fixed wireless"), ...R("spec", "access at high capacity")], at: a("q65", "band lets"), dur: 36}]}/>
      <BigWord f={f} at={4} text="The 26 GHz band" x={960} y={170} size={120} color={C.ink} mark={["26"]} markAt={a("q65", "band lets") - 4}/>
      {pop(f, a("q65", "fixed wireless"), "Fixed wireless access", 960, 790, {size: 64})}
      {pop(f, a("q65", "high capacity"), "High capacity", 1400, 880, {size: 54, dark: true, rot: 2})}
    </PaperShot>
  );
};
const SpecChart: React.FC<{f: number; tAir: number; tPeel: number; tN: number; tPct: number}> = ({f, tAir, tPeel, tN, tPct}) => {
  const X0 = 440, WF = 1300, k0 = WF / 26800.8, k1 = WF / 5000, yJ = 400, yA = 660, th = 170;
  const grow = ease(f, tAir, tAir + 30, outCubic), growO = ease(f, tAir + 26, tAir + 46, outCubic);
  const peel = ease(f, tPeel, tPeel + 16, (t) => t * t), slide = ease(f, tPeel + 8, tPeel + 26, inOut), resc = ease(f, tPeel + 26, tPeel + 56, inOut);
  const k = k0 + (k1 - k0) * resc;
  const aJ = 22000 * k0, aA = 18000 * k0 * grow;
  const oxJ = X0 + aJ * (1 - slide), oxA = X0 + aA * (1 - slide);
  const oJ = 4800.8 * k, oA = 4538.1 * k * growO;
  const fly = `translateY(${-190 * peel}px) rotate(${-3 * peel}deg)`;
  const lab = (t: string, y: number) => <div style={{position: "absolute", right: W - X0 + 34, top: y, transform: "translateY(-50%)", fontFamily: F.sans, fontWeight: 800, fontSize: 44, color: C.white, letterSpacing: 2}}>{t}</div>;
  const seg = (x: number, y: number, w: number, txt: string, show: boolean) => (peel < 1 && w > 2 ? (
    <div style={{position: "absolute", left: x, top: y - th / 2, width: w, height: th, background: C.highlightPrint, transform: fly, opacity: 1 - peel, display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: F.serif, fontSize: 86, color: C.ink, whiteSpace: "nowrap", overflow: "hidden"}}>{show ? txt : ""}</div>) : null);
  return (
    <>
      {lab("JIO", yJ)}{lab("AIRTEL", yA)}
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <line x1={X0} x2={X0} y1={yJ - 130} y2={yA + 130} stroke="rgba(255,255,255,0.75)" strokeWidth={3}/>
        <rect x={oxJ} y={yJ - th / 2} width={oJ} height={th} fill={C.chartBlue}/>
        <rect x={oxA} y={yA - th / 2} width={Math.max(0, oA)} height={th} fill={C.chartBlue}/>
      </svg>
      {seg(X0, yJ, aJ, "22,000", true)}
      {seg(X0, yA, aA, grow > 0.98 ? "18,000" : Math.round(18000 * grow).toLocaleString("en-US"), grow > 0.25)}
      {peel < 1 && f >= tAir - 400 ? <div style={{position: "absolute", left: X0 + aJ / 2, top: yJ - th / 2 - 40, transform: `translate(-50%, 0) ${fly}`, opacity: 1 - peel, fontFamily: F.mono, fontSize: 26, letterSpacing: 3, color: "#CFC9BE"}}>26 GHZ BAND</div> : null}
      {f >= tN ? <div style={{position: "absolute", left: X0 + 26, top: yJ, transform: "translateY(-50%)", fontFamily: F.serif, fontSize: 90, color: C.white, opacity: ease(f, tN, tN + 8)}}>4,800.8</div> : null}
      {f >= tN + 14 ? <div style={{position: "absolute", left: X0 + 26, top: yA, transform: "translateY(-50%)", fontFamily: F.serif, fontSize: 90, color: C.white, opacity: ease(f, tN + 14, tN + 22)}}>4,538.1</div> : null}
      {f >= tPct ? (() => {
        const p = ease(f, tPct, tPct + 10, outCubic), xj = X0 + oJ, xa = X0 + oA;
        return <>
          <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
            <path d={`M ${xa} ${yA - th / 2 - 10} L ${xa} ${(yJ + yA) / 2} L ${xj} ${(yJ + yA) / 2} L ${xj} ${yJ + th / 2 + 10}`} fill="none" stroke={C.markerRed} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}/>
          </svg>
          <MarkerText f={f} at={tPct + 4} text="+6%" x={xj + 130} y={(yJ + yA) / 2} size={130} rot={-5} dur={12}/>
        </>;
      })() : null}
    </>
  );
};
const s65b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Ink f={f} d={d} chip="Jio RHP p.221-225 · Airtel AR p.52 · MHz · our arithmetic">
      <Sub f={f} at={4} text="26 GHz band, MHz" x={960} y={170} size={50} color="#CFC9BE"/>
      <SpecChart f={f} tAir={a("q65", "eighteen thousand") - 6} tPeel={99999} tN={99999} tPct={99999}/>
    </Ink>
  );
};
const s65c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Ink f={f} d={d} chip="Jio RHP p.221-225 · Airtel AR p.52 · MHz · our arithmetic">
      <Sub f={f} at={a("q65", "Leave that") + 18} text="Without the 26 GHz band" x={960} y={170} size={50} color="#CFC9BE"/>
      <SpecChart f={f} tAir={-200} tPeel={a("q65", "Leave that") + 6} tN={a("q65", "Jio holds") - 4} tPct={a("q65", "six percent") - 6}/>
    </Ink>
  );
};

// =====================================================================================================
// q66: what's unique is smaller: 700 MHz in every circle (map), real passage
// =====================================================================================================
const CIRCLES: [number, number][] = [[79.2, 17.0], [92.4, 26.3], [85.3, 25.6], [77.2, 28.6], [72.0, 22.6], [76.3, 29.2], [77.2, 31.9], [75.0, 34.0], [76.2, 14.8], [76.5, 10.3], [88.4, 22.6],
  [78.5, 23.5], [76.5, 20.0], [72.9, 19.1], [94.2, 24.0], [84.5, 20.5], [75.3, 31.0], [74.0, 26.5], [78.5, 11.0], [82.5, 26.0], [78.5, 27.8], [87.8, 23.8]];
const s66a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return <Words f={f} d={d} text="What's unique is smaller" mark={["smaller"]} markAt={a("q66", "smaller")} size={150} at={3} chip="Our reading"/>;
};
const s66b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0), geo = useGeo();
  const cam = camI(f, [[0, 1.0, 960, 540], [d, 1.1, 980, 520]], "q66map", "pull");
  const pins: Pin[] = CIRCLES.map(([lon, lat], i) => ({lon, lat, at: a("q66", "in every") + i * 1.5, color: "#F2C500"}));
  return (
    <AbsoluteFill style={{background: C.mapWater}}>
      <Layer cam={cam}><MapRoute f={f} geo={geo} inkAt={-40} credit={false} pins={pins} pinScale={0.5}/></Layer>
      {pop(f, a("q66", "seven hundred"), "700 MHz", 330, 760, {size: 80, dark: true, rot: -3})}
      {pop(f, a("q66", "every circle") + 14, "22 circles", 330, 640, {size: 56, rot: 2})}
      {pop(f, a("q66", "valid until"), "Valid to 2042", 1560, 800, {size: 66, rot: 3})}
      <SourceTag f={f} at={0} text="Jio RHP p.164, p.222-225 · dots are a picture"/>
      <SourceTag f={f} at={0} text="Map: Natural Earth (India view)" pos="br"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
const s66c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(SPEC, R("spec", "700MHz band can provide deep indoor 5G coverage", 1) as never);
  return (
    <PaperShot f={f} d={d} tone="kraft" chip="Jio RHP p.164 · industry overview (Jio-paid report)"
      cam={camAt(f, [[0, 1.05, 1100, 480], [30, 1.0, 960, 520, outCubic], [a("q66", "deep indoor") - 10, 1.0, 960, 520], [a("q66", "deep indoor") + 30, 1.28, c.x + 120, c.y, inOut], [d, 1.3, c.x + 130, c.y + 10]])}>
      <DocPage f={f} {...SPEC} stack={3} enter={{at: 0, mode: "slide-up", dur: 10}}
        highlights={[{rects: R("spec", "only operator in India to have spectrum in low-band"), at: a("q66", "prospectus") + 2, dur: 28},
          {rects: R("spec", "700MHz band can provide deep indoor 5G coverage"), at: a("q66", "deep indoor") - 6, dur: 24}]}/>
      {pop(f, a("q66", "deep indoor"), "Deep indoor coverage", 960, 800, {size: 64})}
    </PaperShot>
  );
};

// =====================================================================================================
// q67: two dates: 2,300 MHz to 2030, licence to October 2033; wall two is partial
// =====================================================================================================
const TAB = dp("spectab", 960, 520, 1500, 0.6);
const s67a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(TAB, R("spectab", "2030")[0] as never);
  return (
    <PaperShot f={f} d={d} tone="cream" chip="Jio RHP p.222 · Andhra Pradesh block · our sum of the table"
      cam={camAt(f, [[0, 1.0, 960, 540], [a("q67", "Four hundred") - 6, 1.0, 960, 540], [a("q67", "Four hundred") + 24, 1.25, c.x - 120, c.y - 20, inOut], [d, 1.3, c.x - 60, c.y - 10]])}>
      <DocPage f={f} {...TAB} stack={3} enter={{at: 0, mode: "slide-up", dur: 10}}
        highlights={[{rects: [...R("spectab", "2,300 MHz"), ...R("spectab", "2030"), ...R("spectab", "20.0 MHz")], at: a("q67", "Four hundred"), dur: 20}]}
        circles={[{rect: R("spectab", "2030")[0] as never, at: a("q67", "until twenty"), dur: 14}]}/>
      {pop(f, 3, "Two dates", 960, 170, {size: 88, dark: true})}
      {pop(f, a("q67", "Four hundred") + 14, "Sum of 22 circles", 960, 880, {size: 56})}
    </PaperShot>
  );
};
const s67b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.222-225 · telecom licence to October 2033" cam={[[0, 1.0, 900, 540], [d, 1.05, 1020, 540]]}>
      <TimeStrip f={f} at={2} from={2030} to={2033.75} moveAt={a("q67", "runs to")} moveDur={30} y={640} x0={240} x1={1680} marked={[2030, 2033]}
        pins={[{year: 2030, at: -20, label: "440 MHz of 2300 band", dy: -170, dark: true}, {year: 2033.75, at: a("q67", "telecom licence"), label: "Licence · Oct 2033", dy: -330}]}/>
    </Desk>
  );
};
const s67c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="cream" chip="Our reading · wall two" cam={[[0, 1.06, 900, 560], [d, 1.0, 960, 540, outCubic]]}
      over={<ScoreCard f={f} x={640} y={540} s={0.98} rot={-2} enter={2} rows={[done("PARTIAL"), {open: -20, v: "PARTIAL", vAt: a("q67", "partial wall")}]}/>}>
      <BigWord f={f} at={a("q67", "a partial")} text="A partial wall" x={1400} y={520} size={130} color={C.ink} maxWidth={620} mark={["partial"]} markAt={a("q67", "partial wall")}/>
    </Desk>
  );
};

// =====================================================================================================
// q68: wall three, do customers stay? churn
// =====================================================================================================
const s68a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="cream" chip="Jio RHP p.131, p.136"
      over={<ScoreCard f={f} x={1480} y={540} s={0.9} rot={2} enter={4} rows={[done("PARTIAL"), done("PARTIAL"), {open: 8}]}/>}>
      <BigWord f={f} at={4} text="Do customers stay?" x={560} y={430} size={150} color={C.ink} maxWidth={900} mark={["stay"]} markAt={a("q68", "stay")}/>
      {pop(f, a("q68", "matters most"), "Matters most", 560, 780, {size: 62, dark: true})}
    </Desk>
  );
};
const CH_BOX = {x: 700, y: 330, w: 900, h: 470};
const s68b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Ink f={f} d={d} chip="Jio RHP p.131 · monthly churn · FY26 exit quarter">
      <Bars f={f} title="Monthly churn" titleAt={2} max={4.5} box={CH_BOX} 
        items={[{label: "Jio", value: 1.67, text: "1.67%", dec: 2, at: a("q68", "Jio one") + 4, key: true}] as never}/>
    </Ink>
  );
};
const s68c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Ink f={f} d={d} chip="Jio RHP p.131, p.136 · monthly churn · FY26 exit quarter" glow={0.07}>
      <Bars f={f} title="Monthly churn" titleAt={-100} max={4.5} box={{...CH_BOX, h: 540}} 
        items={[
          {label: "Jio", value: 1.67, text: "1.67%", dec: 2, at: -100, key: true},
          {label: "Airtel", value: 2.43, text: "2.43%", dec: 2, at: a("q68", "Airtel two") - 2},
          {label: "Vodafone Idea", value: 3.9, text: "3.9%", dec: 1, at: a("q68", "Vodafone Idea") - 2},
        ] as never}/>
    </Ink>
  );
};
const s68d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="cream" chip="Our arithmetic · from monthly churn" cam={[[0, 1.04, 960, 560], [d, 1.0, 960, 540, outCubic]]}>
      {pop(f, 4, "Leave in a year", 960, 150, {size: 66, dark: true})}
      <DotGrid f={f} x={560} y={500} n={18} at={a("q68", "eighteen percent")} cell={52} enter={2}/>
      <DotGrid f={f} x={1360} y={500} n={26} at={a("q68", "twenty six")} cell={52} enter={2}/>
      <Num f={f} at={a("q68", "eighteen percent")} to={18} suf="%" x={560} y={890} size={170} color={C.ink} dur={20}/>
      <Num f={f} at={a("q68", "twenty six")} to={26} suf="%" x={1360} y={890} size={170} color={C.markerRed} dur={20}/>
      {pop(f, 6, "Jio", 560, 215, {size: 48})}
      {pop(f, 6, "Airtel", 1360, 215, {size: 48, dark: true})}
    </Desk>
  );
};
const s68e: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const years = ["FY24", "FY25", "FY26"], phr = ["each of", "the last", "three years"];
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.131, p.136 · three fiscal years" cam={[[0, 1.0, 900, 540], [d, 1.06, 1010, 540]]}>
      {years.map((y, i) => {
        const at = a("q68", phr[i]), x = 430 + i * 530, tp = ease(f, at + 2, at + 14, outCubic), s = spr(f, 2 + i * 4, 10, 200);
        return (
          <React.Fragment key={y}>
            <div style={{position: "absolute", left: x, top: 520, width: 190, height: 190, transform: `translate(-50%, -50%) scale(${0.4 + 0.6 * s})`, border: `12px solid ${C.ink}`, borderRadius: 16, background: "#FBF8F1", boxShadow: "0 12px 24px rgba(30,20,10,0.22)"}}/>
            <svg width={260} height={260} style={{position: "absolute", left: x - 130, top: 390, overflow: "visible"}}>
              <path d="M 30 140 L 90 200 L 240 20" fill="none" stroke={C.markerRed} strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tp}/>
            </svg>
            <div style={{position: "absolute", left: x, top: 300, transform: "translate(-50%, -50%)", fontFamily: F.serif, fontSize: 120, color: C.ink, opacity: s}}>{y}</div>
          </React.Fragment>
        );
      })}
      {pop(f, a("q68", "Jio was lower"), "Lower than Airtel", 960, 820, {size: 70})}
    </Desk>
  );
};
const s68f: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="cream" chip="Our reading · wall three" cam={[[0, 1.06, 900, 560], [d, 1.0, 960, 540, outCubic]]}
      over={<ScoreCard f={f} x={640} y={540} s={0.98} rot={-2} enter={2} rows={[done("PARTIAL"), done("PARTIAL"), {open: -20, v: "STRONG", vAt: a("q68", "strongest")}]}/>}>
      <BigWord f={f} at={a("q68", "Jio's strongest")} text="Strongest wall" x={1400} y={500} size={140} color={C.ink} maxWidth={640} mark={["Strongest"]} markAt={a("q68", "strongest") + 4}/>
    </Desk>
  );
};

// =====================================================================================================
// q69: wall four, pricing: the real tariff passage
// =====================================================================================================
const TAR = dp("tariff", 960, 500, 1560, -0.5);
const s69a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.43"
      over={<ScoreCard f={f} x={460} y={540} s={0.9} rot={-2} enter={4} from="left" rows={[done("PARTIAL"), done("PARTIAL"), done("STRONG"), {open: a("q69", "pricing")}]}/>}>
      <BigWord f={f} at={3} text="Wall four: pricing" x={1340} y={500} size={150} color={C.ink} maxWidth={800} mark={["pricing"]} markAt={a("q69", "pricing")}/>
    </Desk>
  );
};
const s69b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(TAR, R("tariff", "implemented a tariff increase")[0] as never);
  return (
    <PaperShot f={f} d={d} tone="cream" chip="Jio RHP p.43 · risk factors"
      cam={camAt(f, [[0, 1.0, 960, 540], [a("q69", "tariff increase") - 16, 1.0, 960, 540], [a("q69", "tariff increase") + 12, 1.3, c.x, c.y, inOut], [d, 1.34, c.x + 30, c.y + 20]])}>
      <DocPage f={f} {...TAR} stack={3} enter={{at: 0, mode: "slide-up", dur: 10}}
        highlights={[{rects: R("tariff", "implemented a tariff increase"), at: a("q69", "tariff increase") - 4, dur: 18}]}/>
      {pop(f, a("q69", "tariff increase") + 4, "Tariff increase", 960, 200, {size: 70, dark: true})}
    </PaperShot>
  );
};
const s69c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(TAR, R("tariff", "higher customer churn")[0] as never);
  return (
    <PaperShot f={f} d={d} tone="kraft" chip="Jio RHP p.43 · risk factors"
      cam={camAt(f, [[0, 1.3, c.x - 220, c.y - 40], [d, 1.36, c.x + 40, c.y + 30]])}>
      <DocPage f={f} {...TAR} stack={3}
        highlights={[{rects: R("tariff", "implemented a tariff increase"), at: -100, dur: 1},
          {rects: [...R("tariff", "which resulted in an", 0), ...R("tariff", "increase in ARPU")], at: a("q69", "ARPU rose") - 4, dur: 14},
          {rects: R("tariff", "higher customer churn"), at: a("q69", "churn rose") - 8, dur: 14},
          {rects: [...R("tariff", "lower", 1), ...R("tariff", "growth in our Total Customer Base")], at: a("q69", "customer growth") - 2, dur: 16}]}/>
      {pop(f, a("q69", "ARPU rose"), "ARPU up", 520, 840, {size: 62})}
      {pop(f, a("q69", "churn rose"), "Churn up", 960, 840, {size: 62, dark: true, rot: 2})}
      {pop(f, a("q69", "customer growth") + 8, "Growth slowed", 1400, 840, {size: 62, bg: C.markerRed, color: C.white, rot: -2})}
    </PaperShot>
  );
};

// =====================================================================================================
// q6a: net additions, ARPU vs Airtel, borderline
// =====================================================================================================
const s6aa: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Ink f={f} d={d} chip="Jio RHP p.131 · net customer additions">
      <Bars f={f} dir="v" title="Net additions" titleAt={0} max={4.6} box={{x: 330, y: 280, w: 1260, h: 540}} valSize={76}
        items={[
          {label: "FY24", value: 4.25, text: "4.25 crore", dec: 2, at: a("q6a", "four point") - 4},
          {label: "FY25", value: 0.64, text: "64 lakh", dec: 2, at: a("q6a", "sixty four") - 6, key: true},
          {label: "FY26", value: 3.62, text: "3.62 crore", dec: 2, at: a("q6a", "three point") - 6},
        ] as never}/>
      {pop(f, a("q6a", "that year"), "Tariff rise year", 960, 220, {size: 50, bg: C.markerRed, color: C.white, rot: 3})}
    </Ink>
  );
};
const s6ab: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="cream" chip="Jio RHP p.131 · Q1 FY25 figure is REPORTED (Deccan Herald)" cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 560]]}>
      <RTag f={f} at={a("q6a", "ARPU rose") - 10} x={620} y={-40} string={300} size={130} to={181.7} dec={1} countAt={a("q6a", "ARPU rose")} dur={16}/>
      <RTag f={f} at={a("q6a", "ARPU rose") + 8} x={1300} y={-40} string={300} size={130} to={206.2} dec={1} countAt={a("q6a", "ARPU rose") + 12} dur={16}/>
      {pop(f, a("q6a", "Jio's ARPU") + 8, "Reported", 620, 640, {size: 46, dark: true, rot: -3})}
      <Num f={f} at={a("q6a", "thirteen and")} to={13.5} dec={1} pre="+" suf="%" x={960} y={850} size={190} color={C.markerRed} dur={20}/>
    </Desk>
  );
};
const s6ac: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Airtel releases Q1 FY26, Q4 FY26 · Jio RHP p.131 · our arithmetic" cam={[[0, 1.0, 960, 540], [d, 1.05, 1000, 540]]}>
      {pop(f, 2, "Jio ARPU", 560, 230, {size: 52})}
      {pop(f, 2, "Airtel ARPU", 1360, 230, {size: 52, dark: true, rot: 2})}
      <Num f={f} at={-100} to={13.5} dec={1} pre="+" suf="%" x={560} y={500} size={230} color={C.ink} slam={false}/>
      <Num f={f} at={a("q6a", "Airtel's rose") + 22} to={16.1} dec={1} pre="+" suf="%" x={1360} y={500} size={230} color={C.markerRed} dur={22}/>
      {pop(f, a("q6a", "Airtel's rose") + 36, "₹211 to ₹245", 1360, 700, {size: 46, dark: true, rot: -2})}
    </Desk>
  );
};
const s6ad: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="cream" chip="Our reading · wall four" cam={[[0, 1.05, 900, 560], [d, 1.0, 960, 540, outCubic]]}
      over={<ScoreCard f={f} x={960} y={540} s={0.98} rot={-1.5} enter={2} rows={[done("PARTIAL"), done("PARTIAL"), done("STRONG"), {open: -20, v: "BORDERLINE", vAt: a("q6a", "borderline")}]}/>}>
      <></>
    </Desk>
  );
};

// =====================================================================================================
// q6b: wall five, distribution and suppliers
// =====================================================================================================
const s6ba: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.33, p.37"
      over={<ScoreCard f={f} x={1480} y={540} s={0.88} rot={2} enter={4} rows={[...ROWS_UP_TO(4), {open: a("q6b", "five")}]}/>}>
      <PhotoPrint f={f} src="jio/media/tower_in_sunset_print.jpg" x={560} y={640} w={800} h={600} rot={-3} halftone={0.12} caption="Tower at dusk · Ayush Soran, CC BY 4.0"
        enter={{at: 8, mode: "drop", rot0: 6, stepped: 2}}/>
      <BigWord f={f} at={3} text="Wall five" x={560} y={190} size={150} color={C.ink} mark={["five"]} markAt={a("q6b", "five")}/>
      {pop(f, a("q6b", "distribution"), "Distribution, suppliers", 560, 1000 - 90, {size: 50, dark: true})}
    </Desk>
  );
};
const RRL = dp("rrl", 960, 480, 1560, 0.5);
const s6bb: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(RRL, R("rrl", "sole distributor of our pre-paid connectivity services", 0)[0] as never);
  return (
    <PaperShot f={f} d={d} tone="cream" chip="Jio RHP p.33 · risk factors"
      cam={camAt(f, [[0, 1.0, 960, 540], [a("q6b", "Retail") - 8, 1.0, 960, 540], [a("q6b", "Retail") + 24, 1.22, c.x - 20, c.y + 30, inOut], [d, 1.26, c.x + 40, c.y + 40]])}>
      <DocPage f={f} {...RRL} stack={3} enter={{at: 0, mode: "slide-right", dur: 10}}
        highlights={[{rects: R("rrl", "Reliance Retail Limited"), at: a("q6b", "Retail"), dur: 14}, {rects: R("rrl", "sole distributor of our pre-paid connectivity services", 0), at: a("q6b", "distributes"), dur: 24}]}/>
      {pop(f, a("q6b", "Reliance"), "Reliance Retail", 560, 800, {size: 62, dark: true})}
      {pop(f, a("q6b", "all of"), "All prepaid", 1360, 800, {size: 62, rot: 2})}
    </PaperShot>
  );
};
const s6bc: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Ink f={f} d={d} chip="Jio RHP p.37 · as of 30 Jun 2026" glow={0.07}>
      <Sub f={f} at={a("q6b", "And of")} text="Towers Jio uses" x={960} y={250} size={54} color="#CFC9BE"/>
      <Num f={f} at={a("q6b", "three lakh")} to={360537} x={960} y={520} size={330} color={C.white} dur={36}/>
      {pop(f, a("q6b", "towers"), "Network towers", 960, 790, {size: 58})}
    </Ink>
  );
};
const TOW = dp("towers", 960, 430, 1560, -0.5);
const s6bd: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(TOW, R("towers", "174,451 Network Towers are owned by Summit Digitel Infrastructure Limited", 1)[0] as never);
  return (
    <PaperShot f={f} d={d} tone="kraft" chip="Jio RHP p.37 · risk factors"
      cam={camAt(f, [[0, 1.0, 960, 540], [a("q6b", "one lakh") + 6, 1.0, 960, 540], [a("q6b", "one lakh") + 32, 1.22, c.x + 120, c.y + 40, inOut], [d, 1.26, c.x + 140, c.y + 60]])}>
      <DocPage f={f} {...TOW} stack={3} enter={{at: 0, mode: "slide-up", dur: 10}}
        highlights={[{rects: R("towers", "360,537 Network Towers"), at: -100, dur: 1},
          {rects: R("towers", "174,451 Network Towers are owned by Summit Digitel Infrastructure Limited"), at: a("q6b", "one lakh") - 4, dur: 30}]}/>
      <Num f={f} at={a("q6b", "one lakh")} to={174451} x={960} y={860} size={190} color={C.ink} dur={30}/>
      {pop(f, a("q6b", "Summit"), "Summit Digitel", 1500, 860, {size: 60, dark: true, rot: 2})}
    </PaperShot>
  );
};
const s6be: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Ink f={f} d={d} chip="Jio RHP p.37 · approximately 98% · as of 30 Jun 2026">
      <PhotoPrint f={f} src="jio/media/fibre_reel_orange_print.jpg" x={1370} y={560} w={760} h={520} rot={3} halftone={0.12} darken={0.1} caption="Fibre cable reel (Finland) · A. Leppänen, CC BY 4.0"
        enter={{at: 4, mode: "slide", from: [900, 0], dur: 10, stepped: 2}}/>
      <Sub f={f} at={a("q6b", "About ninety")} text="Optic fibre" x={560} y={250} size={54} color="#CFC9BE"/>
      <Num f={f} at={a("q6b", "ninety eight")} to={98} suf="%" x={560} y={500} size={360} color={C.highlightPrint} dur={28}/>
      {pop(f, a("q6b", "Jio Digital"), "Jio Digital Fibre", 560, 770, {size: 58})}
    </Ink>
  );
};
const TRM = dp("terminate", 960, 470, 1560, 0.4);
const s6bf: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(TRM, R("terminate", "does not have the right to terminate the MSA and the FUA")[0] as never);
  return (
    <PaperShot f={f} d={d} tone="cream" chip="Jio RHP p.37 · risk factors"
      cam={camAt(f, [[0, 1.0, 960, 540], [20, 1.2, c.x, c.y, inOut], [d, 1.26, c.x + 40, c.y + 20]])}
      over={<ScoreCard f={f} x={1560} y={830} s={0.5} rot={3} enter={a("q6b", "agreement") - 40} rows={[...ROWS_UP_TO(4), {open: -20}]}/>}>
      <DocPage f={f} {...TRM} stack={3} enter={{at: 0, mode: "slide-left", dur: 10}}
        highlights={[{rects: R("terminate", "does not have the right to terminate the MSA and the FUA"), at: a("q6b", "can't terminate") - 8, dur: 30}]}/>
      {pop(f, a("q6b", "can't terminate"), "Can't terminate", 960, 800, {size: 70, dark: true})}
    </PaperShot>
  );
};

// =====================================================================================================
// q6c: selling cost, the agreement not on the list, verdict
// =====================================================================================================
const s6ca: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Ink f={f} d={d} chip="Jio RHP p.330 · Airtel AR p.171, p.194 (standalone) · our arithmetic">
      <Bars f={f} title="Share of revenue" titleAt={0} max={4} box={{x: 700, y: 330, w: 900, h: 440}} 
        items={[
          {label: "Jio · selling", value: 3.1, text: "3.1%", dec: 1, at: a("q6c", "three point") - 4, key: true},
          {label: "Airtel · commission", value: 3.25, text: "3.25%", dec: 2, at: a("q6c", "three point two") - 2},
        ] as never}/>
    </Ink>
  );
};
const INS = dp("inspect", 620, 560, 800, -0.6);
const s6cb: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <PaperShot f={f} d={d} tone="kraft" chip="Jio RHP p.577-580 · documents for inspection"
      cam={camAt(f, [[0, 1.05, 620, 420], [d, 1.3, 700, 700]])}>
      <DocPage f={f} {...INS} stack={3} enter={{at: 0, mode: "slide-up", dur: 10}}
        highlights={[{rects: R("inspect", "MATERIAL CONTRACTS AND DOCUMENTS FOR INSPECTION"), at: a("q6c", "documents listed") - 4, dur: 26}]}/>
      {pop(f, a("q6c", "Reliance Retail"), "Reliance Retail agreement", 1480, 380, {size: 56, dark: true, rot: 2})}
      <MarkerText f={f} at={a("q6c", "isn't among") + 4} text="?" x={1480} y={540} size={200} rot={8} dir="y" dur={10}/>
      <Stamp f={f} at={a("q6c", "isn't among")} text="NOT LISTED" x={1380} y={760} size={90} rot={-6}/>
    </PaperShot>
  );
};
const s6cc: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="cream" chip="Our reading · wall five" cam={[[0, 1.06, 900, 560], [d, 1.0, 960, 540, outCubic]]}
      over={<ScoreCard f={f} x={640} y={540} s={0.98} rot={-2} enter={2} rows={[...ROWS_UP_TO(4), {open: -20, v: "DEPENDENCY", vAt: a("q6c", "a dependency")}]}/>}>
      {pop(f, a("q6c", "wide reach"), "Wide reach", 1420, 400, {size: 72})}
      {pop(f, a("q6c", "and a dependency"), "And a dependency", 1420, 600, {size: 66, bg: C.markerRed, color: C.white, rot: 2})}
    </Desk>
  );
};

// =====================================================================================================
// q6d, q6e: returns
// =====================================================================================================
const KP2 = dp("kpi2", 960, 500, 1500, -0.5);
const s6da: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Words f={f} d={d} text="Show up in returns" mark={["returns"]} markAt={a("q6d", "returns")} size={150} at={3} chip="Our reading"
      children={<ScoreCard f={f} x={1560} y={900} s={0.58} rot={-3} enter={a("q6d", "should") - 4} rows={[...ROWS_UP_TO(5), {open: a("q6d", "returns")}]}/>}/>
  );
};
const s6db: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(KP2, R("kpi2", "10.76%")[0] as never);
  return (
    <PaperShot f={f} d={d} tone="cream" chip="Jio RHP p.132 · return on average capital employed"
      cam={camAt(f, [[0, 1.0, 960, 540], [a("q6d", "employed") - 4, 1.0, 960, 540], [a("q6d", "employed") + 24, 1.28, c.x - 340, c.y, inOut], [d, 1.32, c.x - 300, c.y + 10]])}>
      <DocPage f={f} {...KP2} stack={3} enter={{at: 0, mode: "slide-up", dur: 10}}
        highlights={[{rects: [...R("kpi2", "Return on Average Capital"), ...R("kpi2", "Employed")], at: a("q6d", "capital"), dur: 14}]}
        underlines={[{rect: R("kpi2", "Return on Average Capital")[0] as never, at: a("q6d", "own definition"), dur: 12}]}/>
      {pop(f, a("q6d", "own definition"), "Its own definition", 960, 800, {size: 64, dark: true})}
    </PaperShot>
  );
};
const s6dc: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Ink f={f} d={d} chip="Jio RHP p.132 · return on average capital employed">
      <Bars f={f} dir="v" title="Jio: return on capital" titleAt={0} max={20} box={{x: 560, y: 300, w: 800, h: 500}} valSize={86}
        items={[
          {label: "FY24", value: 12.83, text: "12.83%", dec: 2, at: a("q6d", "twelve") - 8},
          {label: "FY26", value: 10.76, text: "10.76%", dec: 2, at: a("q6d", "ten point") - 8, key: true},
        ] as never}/>
      {pop(f, a("q6d", "fell"), "Fell", 1500, 440, {size: 80, bg: C.markerRed, color: C.white, rot: 4})}
    </Ink>
  );
};
const s6dd: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Ink f={f} d={d} chip="Jio RHP p.132, p.137 · definitions differ">
      <Bars f={f} dir="v" title="Return on capital" titleAt={-100} max={20} box={{x: 380, y: 300, w: 1160, h: 500}} valSize={80}
        items={[
          {label: "Jio FY24", value: 12.83, text: "12.83%", dec: 2, at: -100},
          {label: "Jio FY26", value: 10.76, text: "10.76%", dec: 2, at: -100, key: true},
          {label: "Airtel", value: 19.0, text: "19.0%", dec: 1, at: a("q6d", "nineteen") - 8, color: "#6C7FF0"},
        ] as never}/>
      {pop(f, a("q6d", "by its definition"), "Definitions differ", 1500, 200, {size: 56, dark: false, rot: 3})}
    </Ink>
  );
};
const s6ea: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="cream" chip="Our arithmetic · Jio RHP p.330, p.406">
      <Slip f={f} x={620} y={500} w={760} size={40} enter={2} head="OUR MEASURE · CAPITAL ="
        lines={[{t: "EQUITY", at: 6}, {t: "+ BORROWINGS", at: 14}, {t: "+ LEASES", at: a("q6e", "leases") - 6, tick: a("q6e", "leases") + 2}, {t: "+ SPECTRUM DUES", at: a("q6e", "spectrum") - 6, tick: a("q6e", "spectrum") + 6}]}/>
      <MarkerText f={f} at={a("q6e", "our own") - 2} text="our own measure" x={1380} y={430} size={104} rot={-5} dur={22}/>
    </Desk>
  );
};
const s6eb: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Ink f={f} d={d} chip="Our arithmetic · Jio RHP p.330, p.406 · FY26">
      <Num f={f} at={a("q6e", "nine point")} to={9.7} dec={1} suf="%" x={960} y={470} size={400} color={C.highlightPrint} dur={30}/>
      <Sub f={f} at={a("q6e", "before tax")} text="pre-tax · our measure" x={960} y={730} size={54} color={C.white}/>
      <BigWord f={f} at={a("q6e", "One fact")} text="One fact may explain" x={960} y={880} size={70} color="#CFC9BE" maxWidth={1400}/>
    </Ink>
  );
};
const s6ec: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Ink f={f} d={d} chip="Jio RHP p.346 · our arithmetic · FY25 + FY26">
      <Num f={f} at={a("q6e", "one point")} to={1.32} dec={2} pre="₹" preSans x={960} y={460} size={380} color={C.white} dur={28}/>
      <Sub f={f} at={a("q6e", "lakh crore")} text="lakh crore of spectrum" x={960} y={730} size={64} color={C.highlightPrint}/>
      <Sub f={f} at={a("q6e", "in the last")} text="added in two years" x={960} y={820} size={44} color="#CFC9BE"/>
    </Ink>
  );
};
const ADD = dp("adds", 960, 480, 1560, -0.5);
const s6ed: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(ADD, R("adds", "832,441")[0] as never);
  return (
    <PaperShot f={f} d={d} tone="kraft" chip="Jio RHP p.346 · gross carrying value, spectrum · ₹ million"
      cam={camAt(f, [[0, 1.0, 960, 540], [d, 1.2, c.x + 60, c.y + 60]])}>
      <DocPage f={f} {...ADD} stack={3} enter={{at: 0, mode: "slide-up", dur: 10}}
        highlights={[{rects: R("adds", "832,441"), at: a("q6e", "to its books") - 2, dur: 10}, {rects: R("adds", "484,774"), at: a("q6e", "to its books") + 16, dur: 10}]}/>
      {pop(f, a("q6e", "to its books"), "FY25 + FY26", 960, 860, {size: 62, dark: true})}
    </PaperShot>
  );
};

// =====================================================================================================
// q6f: the full scorecard, and the teaser
// =====================================================================================================
const s6fa: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tally: [string, string, number, string][] = [["1 strong", "one strong", 330, "#1F3BD6"], ["2 partial", "two partial", 450, "#A15C00"], ["1 borderline", "one borderline", 570, "#C2006B"], ["1 dependency", "and a", 690, "#D01846"]];
  return (
    <Desk f={f} d={d} tone="cream" chip="Our reading · five walls" cam={[[0, 1.05, 940, 560], [d, 1.0, 960, 540, outCubic]]}
      over={<ScoreCard f={f} x={1230} y={540} s={1.0} rot={-1.5} enter={2} from="right"
        rows={[{open: -20, v: "PARTIAL", vAt: a("q6f", "partial"), ghost: true}, {open: -20, v: "PARTIAL", vAt: a("q6f", "partial") + 4, ghost: true},
          {open: -20, v: "STRONG", vAt: a("q6f", "strong"), ghost: true}, {open: -20, v: "BORDERLINE", vAt: a("q6f", "borderline"), ghost: true},
          {open: -20, v: "DEPENDENCY", vAt: a("q6f", "dependency"), ghost: true}]}/>}>
      {tally.map(([t, ph, y, col]) => <MarkerText key={t} f={f} at={a("q6f", ph)} text={t} x={420} y={y} size={80} rot={-3} color={col} dur={14}/>)}
    </Desk>
  );
};
const s6fb: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(KP2, R("kpi2", "0.36x")[0] as never);
  const flick = Math.floor(f / 3) % 4 === 0 ? 0.45 : 1;
  const lift = ease(f, a("q6f", "line") - 10, a("q6f", "changes") + 10, inOut);
  return (
    <PaperShot f={f} d={d} tone="cream" chip="Jio RHP p.132 · net leverage"
      cam={camAt(f, [[0, 1.0, 960, 540], [a("q6f", "line"), 1.0, 960, 540], [a("q6f", "read") + 6, 1.3, c.x - 300, c.y, inOut], [d, 1.34, c.x - 280, c.y + 10]])}>
      <DocPage f={f} {...KP2} stack={3} enter={{at: 0, mode: "slide-up", dur: 10}}
        focus={{rect: R("kpi2", "Net Leverage")[0] as never, at: a("q6f", "line"), blur: 2.4}}
        highlights={[{rects: [...R("kpi2", "Net Leverage"), ...R("kpi2", "0.36x")], at: a("q6f", "Jio's debt") - 8, dur: 14}]}/>
      <div style={{opacity: flick}}><StickyNote f={f} at={a("q6f", "line")} text="0.36×" x={1560} y={250}/></div>
      {/* page corner lifting: a folded flap at the bottom-right of the sheet */}
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        {lift > 0 ? (() => { const sz = 60 + 220 * lift, cx = 960 + 790, cy = 500 + 215;
          return <g>
            <polygon points={`${cx},${cy - sz} ${cx},${cy} ${cx - sz},${cy}`} fill="#D9D0BC" opacity={0.0}/>
            <polygon points={`${cx + 6},${cy - sz * 0.92} ${cx + 6},${cy + 6} ${cx - sz * 0.92},${cy + 6}`} fill="rgba(20,12,6,0.28)" transform={`translate(10 12)`}/>
            <polygon points={`${cx},${cy - sz} ${cx},${cy} ${cx - sz},${cy}`} fill="#F3EEE3"/>
            <polygon points={`${cx - sz},${cy} ${cx},${cy - sz} ${cx - sz},${cy - sz}`} fill="#FBF8F1" stroke="rgba(0,0,0,0.12)" strokeWidth={2}/>
          </g>; })() : null}
      </svg>
      <MarkerText f={f} at={a("q6f", "Jio's debt")} text="?" x={1700} y={420} size={220} rot={8} dir="y" dur={10}/>
    </PaperShot>
  );
};

// =====================================================================================================
// shots and sound
// =====================================================================================================
export const SHOTS6: Shot[] = [
  S("q60", 0, H0, s60),
  S("q61", 0, H0, s61a), S("q61", "network|+0.15", PU, s61b), S("q61", "Airtel carried|-0.1", WL, s61c), S("q61", "Jio's figure|-0.1", PL, s61d),
  S("q62", 0, WU, s62a), S("q62", "Jio spent|-0.1", H0, s62b), S("q62", "Airtel's mobile|-0.15", WR, s62c),
  S("q63", 0, WD, s63a), S("q63", "Jio would|-0.1", H0, s63b), S("q63", "But it also|-0.1", PU, s63c), S("q63", "Verdict|-0.1", PL, s63d),
  S("q64", 0, H0, s64a), S("q64", "Remember|-0.1", WL, s64b), S("q64", "a thousand|-0.15", MZ, s64c),
  S("q65", 0, PU, s65a), S("q65", "Airtel holds|-0.15", WR, s65b), S("q65", "Leave that|-0.1", H0, s65c),
  S("q66", 0, WU, s66a), S("q66", "Jio is|-0.1", H0, s66b), S("q66", "The prospectus|-0.1", PL, s66c),
  S("q67", 0, WD, s67a), S("q67", "And its|-0.1", PU, s67b), S("q67", "Verdict|-0.1", H0, s67c),
  S("q68", 0, WL, s68a), S("q68", "Monthly churn|-0.1", PU, s68b), S("q68", "Airtel|-0.1", H0, s68c), S("q68", "Over a year|-0.1", WR, s68d),
  S("q68", "Jio was lower|-0.1", PL, s68e), S("q68", "Verdict|-0.1", H0, s68f),
  S("q69", 0, WU, s69a), S("q69", "The prospectus|-0.1", PU, s69b), S("q69", "ARPU rose|-0.4", MZ, s69c),
  S("q6a", 0, WL, s6aa), S("q6a", "Jio's ARPU|-0.1", PU, s6ab), S("q6a", "Airtel's rose|-0.1", H0, s6ac), S("q6a", "Verdict|-0.1", PL, s6ad),
  S("q6b", 0, WD, s6ba), S("q6b", "Reliance|-0.1", PU, s6bb), S("q6b", "And of|-0.1", WR, s6bc), S("q6b", "one lakh|-0.15", PL, s6bd), S("q6b", "About ninety|-0.1", WU, s6be),
  S("q6b", "The telecom|-0.1", PU, s6bf),
  S("q6c", 0, WL, s6ca), S("q6c", "And the|-0.1", PU, s6cb), S("q6c", "Verdict|-0.1", PL, s6cc),
  S("q6d", 0, WD, s6da), S("q6d", "Jio's return|-0.1", PU, s6db), S("q6d", "fell from|-0.1", WL, s6dc), S("q6d", "Airtel's|-0.1", H0, s6dd),
  S("q6e", 0, WR, s6ea), S("q6e", "Jio earned|-0.1", WU, s6eb), S("q6e", "Jio added|-0.1", H0, s6ec), S("q6e", "to its|-0.1", PL, s6ed),
  S("q6f", 0, WD, s6fa), S("q6f", "But one|-0.1", PU, s6fb),
];

export const CUES6: SCue[] = [
  [WS("q60", 0.2), "paper", 0.7],
  [WS("q61", 1.0), "paper", 0.5], [WS("q61", "includes fixed"), "highlighter", 0.55],
  [WS("q62", "Jio spent"), "click", 0.5],
  [WS("q63", "doesn't disclose"), "stamp", 0.6], [WS("q63", "a margin"), "stamp", 0.85],
  [WS("q64", "Twenty two thousand"), "whoosh", 0.55],
  [WS("q65", "band lets"), "highlighter", 0.55], [WS("q65", "Leave that|+0.1"), "whoosh", 0.5],
  [WS("q66", "every circle"), "pop", 0.5],
  [WS("q67", "Four hundred"), "highlighter", 0.55], [WS("q67", "partial wall"), "stamp", 0.85],
  [WS("q68", "Wall three"), "paper", 0.5], [WS("q68", "strongest"), "stamp", 0.9],
  [WS("q69", "ARPU rose"), "highlighter", 0.55],
  [WS("q6a", "borderline"), "stamp", 0.85],
  [WS("q6b", "Retail"), "highlighter", 0.55], [WS("q6b", "can't terminate"), "highlighter", 0.55],
  [WS("q6c", "isn't among"), "stamp", 0.7], [WS("q6c", "a dependency"), "stamp", 0.9],
  [WS("q6d", "capital"), "highlighter", 0.5],
  [WS("q6e", "to its books"), "highlighter", 0.5],
  [WS("q6f", "strong"), "stamp", 0.8], [WS("q6f", "borderline"), "stamp", 0.8], [WS("q6f", "But one|+0.1"), "paper", 0.8],
];
