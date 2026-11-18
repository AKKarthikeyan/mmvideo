// Scene 07 | What the homes earn: the peak of the film. Shots: (A) the real Quarterly Report homes block with revenue and EBIT highlighted and
// their crore equivalents; (B-D) ONE page of three charts built one by one on the same layout (continuity across hard cuts): EBIT margin bars
// 16.2% -> 6.7%, Homes ARPU line (9 quarters, 566 -> 509), capex vs EBITDA bars with the gap marked (our arithmetic); (E) management's "very
// significant moat" quote card (Gopal Vittal) over the dimmed page; (F) the final page held with the stamp BIG, NOT PAYING YET on the CONVERGENCE card.
// Data: ledger rows s07p1-s07p4; claims C66 (Homes ARPU series), C67 (revenue, EBIT, EBITDA, capex, Rs Mn), C60 (homes 15,369 / 11,928).
// The 6 s hold after the stamp needs ~5 s of silence after the last word of beat s07p4 (the cut to s08p1 is what ends it): see report.
import React from "react";
import {SCue} from "./kit/A01V4Cold";
import {SP, Shot, tsec} from "./kit/A01V4Parts";
import {DocPage} from "./kit/DocPage";
import {Rect} from "./kit/Marker";
import {C, F, useTicks} from "./kit/tokens";
import {H0, PU, S, W, WE, useAt, AtFn} from "./cue";
import {QuoteCard, SuspectCards} from "./devices_airtel";
import {EntityTag} from "./devices";
import {BigStamp, GapBracket, MiniLine, Panel, T, Tile, ZBars, Stage} from "./parts0508";
import HJ from "../../../public/voxplus/airtel/docs/sc07_homes.json";
import MJ from "../../../public/voxplus/airtel/docs/sc07_moat.json";

const ARPU = [566, 554, 543, 537, 534, 529, 527, 523, 509];   // C66, Sep-24 .. Sep-26 (Rs per user per month)
const MARGIN = {now: 6.7, yr: 16.2};                            // ledger s07p1 (EBIT / revenue, Q2 FY27 vs Q2 FY26)
const CAPEX = 2181, EBITDA = 1140;                              // ledger s07p3 (Rs crore)
const CHIP = "Airtel Q2 FY27 Quarterly Report · 3.3.4 Homes Services p.13 · 5.5.3.2 p.24 · 9.4 p.45";
const PY = 170, PH = 500, PW = 560, PX = [70, 680, 1290];
const done = (stage: number, k: number, t: number) => (stage > k ? -80 : t);

/** The three-chart page. stage 1 = margin builds, 2 = ARPU builds, 3 = capex builds, 4 = all built (held). */
const Page07: React.FC<{f: number; a: AtFn; stage: number}> = ({f, a, stage}) => {
  const t = (k: number, v: number) => done(stage, k, v);
  // panel 1: EBIT margin
  const p1 = t(1, a("s07p1", "A margin|-0.3")), tNow = t(1, a("s07p1", "six point seven")), tYr = t(1, a("s07p1", "sixteen point two"));
  // panel 2: ARPU line
  const p2 = t(2, a("s07p2", "Revenue per home") - 6), l0 = t(2, a("s07p2", "From")), t509 = a("s07p2", "five hundred and nine"), t10 = t(2, a("s07p2", "ten percent lower")), tQ = t(2, a("s07p2", "more than a quarter"));
  // panel 3: capex vs EBITDA
  const p3 = t(3, a("s07p3", "And the business") - 6), tCap = t(3, a("s07p3", "two thousand one hundred and eighty one")), tEb = t(3, a("s07p3", "one thousand one hundred and forty")), tGap = t(3, a("s07p3", "after capex"));
  return (
    <>
      <EntityTag f={f} at={-80} text="AIRTEL · HOMES" period="Q2 FY27 · QUARTER ENDED SEP-26" x={70} y={126}/>
      <Panel f={f} at={p1} x={PX[0]} y={PY} w={PW} h={PH} title="EBIT MARGIN, % OF REVENUE" sub="AIRTEL HOMES · Q2 FY27 VS Q2 FY26">
        <ZBars f={f} x={30} y={140} w={500} h={230} max={18} barW={140} textSize={46} labelSize={26} items={[
          {label: "Q2 FY26\n(a year ago)", v: MARGIN.yr, text: "16.2%", at: tYr, color: C.grey},
          {label: "Q2 FY27\n(this quarter)", v: MARGIN.now, text: "6.7%", at: tNow, color: C.teal, textColor: C.rust}]}/>
      </Panel>
      <Panel f={f} at={p2} x={PX[1]} y={PY} w={PW} h={PH} title="REVENUE PER HOME, ₹ A MONTH" sub="AIRTEL HOMES · ARPU, SEP-24 TO SEP-26">
        <MiniLine f={f} at={l0} x={40} y={140} w={480} h={230} vals={ARPU} max={700} xl={["Sep-24", "Sep-26"]} drawDur={Math.max(40, t509 - a("s07p2", "From") + 6)} ringAt={t(2, t509 + 4)}/>
        <T f={f} at={t10} text="−10% · OUR ARITHMETIC (509 ÷ 566)" x={26} y={452} size={26} color={C.rust}/>
        <T f={f} at={tQ} text="HOMES +28.8% IN A YEAR · OUR ARITHMETIC" x={26} y={482} size={20} mono color={C.grey}/>
      </Panel>
      {stage === 2 ? <T f={f} at={a("s07p2", "On this quarter's")} text="MANAGEMENT SAYS: THE LATEST FALL IS A ONE-OFF" x={1850} y={116} size={26} color={C.white} bg={C.ink} align="right"/> : null}
      {stage === 2 ? <T f={f} at={a("s07p2", "On this quarter's")} text="Q2 FY27 call 00:49:43 · our transcription of the company's official audio" x={1850} y={152} size={18} mono color={C.ink} align="right"/> : null}
      <Panel f={f} at={p3} x={PX[2]} y={PY} w={PW} h={PH} title="CAPEX VS EBITDA, ₹ CRORE" sub="AIRTEL HOMES · Q2 FY27">
        <ZBars f={f} x={30} y={140} w={500} h={230} max={2400} barW={130} textSize={44} labelSize={26} items={[
          {label: "Capex", v: CAPEX, text: "2,181", at: tCap, color: C.teal},
          {label: "EBITDA", v: EBITDA, text: "1,140", at: tEb, color: C.grey, inside: true}]}/>
        <GapBracket f={f} at={tGap} x={30} y={140} w={500} h={230} max={2400} slots={2} lowIdx={1} highIdx={0} vLow={EBITDA} vHigh={CAPEX} barW={130} text="₹1,041 cr"/>
        <T f={f} at={tGap + 6} text="GAP = EBITDA − CAPEX · OUR ARITHMETIC" x={26} y={470} size={20} mono color={C.grey}/>
      </Panel>
    </>
  );
};

// A: the report page, revenue and EBIT highlighted
const a7: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tRev = a("s07p1", "two thousand three hundred and thirty six"), tEbit = a("s07p1", "one hundred and fifty seven");
  const X = HJ.extra as unknown as Record<string, Rect[]>;
  const rev: Rect = [168, X["23,360"][0][1], 653, X["23,360"][0][3]], ebit: Rect = [168, X["1,570"][0][1], 646, X["1,570"][0][3]];
  return (
    <Stage f={f} d={d} chip={CHIP}>
      <EntityTag f={f} at={-80} text="AIRTEL · HOMES" period="Q2 FY27 · QUARTER ENDED SEP-26" x={70} y={126}/>
      <DocPage f={f} src="airtel/docs/sc07_homes.png" imgW={HJ.w} imgH={HJ.h} x={620} y={400} width={1000} margin={0.05} rot={-0.3}
        enter={{at: -10, mode: "drop", dur: 8}} highlights={[{rects: [rev], at: tRev, dur: 14}, {rects: [ebit], at: tEbit, dur: 14}]}/>
      <Tile f={f} at={tRev} x={1470} y={190} w={620} big="₹2,336 crore" bigSize={72} sub="Homes revenue · 23,360 Rs Mn in the table" color={C.ink}/>
      <Tile f={f} at={tEbit} x={1470} y={400} w={620} big="₹157 crore" bigSize={72} sub="Homes EBIT, profit before interest and tax · 1,570 Rs Mn" color={C.teal}/>
      <SuspectCards f={f} at={-60} active="CONVERGENCE"/>
    </Stage>
  );
};

const stageShot = (stage: number): React.FC<SP> => ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Stage f={f} d={d} chip={CHIP} intro={stage === 1}>
      <Page07 f={f} a={a} stage={stage}/>
      <SuspectCards f={f} at={-60} active="CONVERGENCE"/>
    </Stage>
  );
};

// E: the quote over the dimmed page
const q7: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Stage f={f} d={d} chip="Airtel earnings webinar transcript · Q4 FY26 (14 May 2026)" intro={false}>
      <div style={{opacity: 0.22}}><Page07 f={f} a={a} stage={4}/></div>
      <QuoteCard f={f} at={2} x={960} y={400} w={1300} src="airtel/docs/sc07_moat.png" imgW={MJ.w} imgH={MJ.h} speaker="Gopal Vittal, Executive Vice Chairman" source="Q4 FY26 call · 14 May 2026"/>
      <SuspectCards f={f} at={-60} active="CONVERGENCE"/>
    </Stage>
  );
};

// F: final chart held; stamp after the last words ("not yet a return")
const STAMP_S = () => WE("s07p4", "return") + 0.3;
const hold7: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tStamp = tsec(STAMP_S()) - s0;
  return (
    <Stage f={f} d={d} chip={CHIP} intro={false}>
      <Page07 f={f} a={a} stage={4}/>
      <SuspectCards f={f} at={-60} active="CONVERGENCE"/>
      <BigStamp f={f} at={tStamp} text="BIG, NOT PAYING YET" x={1452} y={856} size={40}/>
    </Stage>
  );
};

export const SHOTS07: Shot[] = [S("s07p1", 0, H0, a7, "s07-a"), S("s07p1", "A margin|-0.3", PU, stageShot(1), "s07-b"), S("s07p2", 0, H0, stageShot(2), "s07-c"),
  S("s07p3", 0, H0, stageShot(3), "s07-d"), S("s07p4", 0, H0, q7, "s07-e"), S("s07p4", "Maybe|-0.1", H0, hold7, "s07-f")];
export const CUES07: SCue[] = [[W("s07p1", "Homes revenue"), "paper", 0.3], [W("s07p1", "A margin|-0.3"), "paper", 0.3], [W("s07p1", "six point seven"), "ding", 0.3],
  [W("s07p2", "Revenue per home|-0.1"), "paper", 0.3], [W("s07p3", "And the business|-0.1"), "paper", 0.3], [W("s07p4", "Airtel itself"), "paper", 0.3],
  [STAMP_S(), "stamp", 0.9]];
