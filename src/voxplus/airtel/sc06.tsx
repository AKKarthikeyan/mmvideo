// Scene 06 | Suspect three: convergence. The CONVERGENCE card comes to the front. p1a: homes customers 11.9 -> 15.4 million (zero-based bars,
// +3.4 million our arithmetic). p1b: the real Quarterly Report homes block, net additions row highlighted (676 vs 951 thousand). p2: two quote
// cards cropped from the call transcripts (Shashwat Sharma, Q4 FY26 call 14 May 2026: "nearly 50%", no base given; Q1 FY27 call 5 Aug 2026:
// "important lever", future tense), each labelled MANAGEMENT SAYS, no churn chart. p3: "WHAT DO THEY EARN?".
// Data: claim C60 (homes customers 15,369 / 11,928 thousand, net additions 676 / 951), ledger rows s06p1, s06p2.
import React from "react";
import {SCue} from "./kit/A01V4Cold";
import {SP, Shot} from "./kit/A01V4Parts";
import {DocPage} from "./kit/DocPage";
import {Rect} from "./kit/Marker";
import {C, ease, useTicks} from "./kit/tokens";
import {H0, PU, S, W, useAt} from "./cue";
import {QuoteCard, SuspectCards} from "./devices_airtel";
import {EntityTag} from "./devices";
import {T, Tile, ZBars, Stage} from "./parts0508";
import HJ from "../../../public/voxplus/airtel/docs/sc06_homes.json";
import Q1J from "../../../public/voxplus/airtel/docs/sc06_churn50.json";
import Q2J from "../../../public/voxplus/airtel/docs/sc06_lever.json";

const HX = HJ.extra as unknown as Record<string, Rect[]>;
const HOMES = {now: 15369, yr: 11928};   // C60, thousand
const SPEAKER = "Shashwat Sharma, MD & CEO, Airtel India";

const a6: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t154 = a("s06p1", "fifteen point four million"), t34 = a("s06p1", "three point four million");
  return (
    <Stage f={f} d={d} chip="Airtel Q2 FY27 Quarterly Report · p.17 · 4.3 Homes Services">
      <EntityTag f={f} at={-30} text="AIRTEL · HOMES" period="HOME BROADBAND AND FIBRE · CUSTOMERS" x={160} y={150}/>
      <T f={f} at={-30} text="HOMES CUSTOMERS, MILLION" x={160} y={212} size={36}/>
      <ZBars f={f} x={160} y={290} w={760} h={290} max={17} barW={190} textSize={58} labelSize={28} items={[
        {label: "Sep-25\n(a year ago)", v: HOMES.yr / 1000, text: "11.9", at: t34, color: C.grey},
        {label: "Sep-26", v: HOMES.now / 1000, text: "15.4", at: t154 - 6, labelAt: t154, color: C.teal}]}/>
      <Tile f={f} at={t34} x={1380} y={290} w={640} big="+3.4 MILLION" bigSize={80} sub="in a year · our arithmetic (15,369 − 11,928 thousand)" color={C.rust}/>
      <SuspectCards f={f} at={-60} active="CONVERGENCE"/>
    </Stage>
  );
};

const b6: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t676 = a("s06p1", "six hundred and seventy six"), t951 = a("s06p1", "nine hundred and fifty one");
  return (
    <Stage f={f} d={d} chip="Airtel Q2 FY27 Quarterly Report · p.17 · 4.3 Homes Services">
      <DocPage f={f} src="airtel/docs/sc06_homes.png" imgW={HJ.w} imgH={HJ.h} x={960} y={285} width={1250} margin={0.05} rot={-0.3}
        enter={{at: -10, mode: "slide-up", dur: 10}}
        highlights={[{rects: [HX["676"][0]], at: t676, dur: 10}, {rects: [HX["951"][0]], at: t951, dur: 10}]}/>
      <Tile f={f} at={t676} x={620} y={462} w={520} big="676 thousand" bigSize={66} sub="homes added this quarter · Q2 FY27" color={C.teal}/>
      <Tile f={f} at={t951} x={1300} y={462} w={520} big="951 thousand" bigSize={66} sub="a year ago · Q2 FY26" color={C.grey}/>
      <SuspectCards f={f} at={-60} active="CONVERGENCE"/>
    </Stage>
  );
};

const c6: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tQ1 = a("s06p2", "Management says") - 4, tNo = a("s06p2", "no base"), tNext = a("s06p2", "next quarters") - 6, tFut = a("s06p2", "important lever");
  const out1 = ease(f, tNext, tNext + 8);
  return (
    <Stage f={f} d={d} chip="Airtel earnings webinar transcripts · Q4 FY26 (14 May 2026), Q1 FY27 (5 Aug 2026)">
      <div style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 1 - out1, transform: `translateY(${out1 * 60}px)`}}>
        <QuoteCard f={f} at={tQ1} x={960} y={400} w={1500} src="airtel/docs/sc06_churn50.png" imgW={Q1J.w} imgH={Q1J.h} speaker={SPEAKER} source="Q4 FY26 call · 14 May 2026"/>
        <T f={f} at={tNo} text="NO BASE GIVEN" x={1500} y={128} size={34} color={C.white} bg={C.rust} align="center" spacing={2} rot={2}/>
      </div>
      <QuoteCard f={f} at={tNext} x={960} y={400} w={1500} src="airtel/docs/sc06_lever.png" imgW={Q2J.w} imgH={Q2J.h} speaker={SPEAKER} source="Q1 FY27 call · 5 Aug 2026"/>
      <T f={f} at={tFut} text="STILL NO NUMBER" x={1500} y={128} size={34} color={C.white} bg={C.rust} align="center" spacing={2} rot={2}/>
      <SuspectCards f={f} at={-60} active="CONVERGENCE"/>
    </Stage>
  );
};

const d6: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tHomes = a("s06p3", "fifteen million"), tEarn = a("s06p3", "what they earn");
  return (
    <Stage f={f} d={d} chip="Airtel Q2 FY27 Quarterly Report · 4.3 Homes Services">
      <Tile f={f} at={tHomes} x={960} y={150} w={760} big="15.4 MILLION HOMES" bigSize={66} sub="Airtel Homes customers · Sep-26" color={C.teal}/>
      <T f={f} at={tEarn} text="WHAT DO THEY EARN?" x={960} y={470} size={120} weight={900} color={C.ink} align="center" spacing={2}/>
      <T f={f} at={tEarn + 8} text="AIRTEL HOMES · Q2 FY27" x={960} y={580} size={30} mono color={C.grey} align="center"/>
      <SuspectCards f={f} at={-60} active="CONVERGENCE"/>
    </Stage>
  );
};

export const SHOTS06: Shot[] = [S("s06p1", 0, H0, a6, "s06-a"), S("s06p1", "It is adding|-0.2", PU, b6, "s06-b"), S("s06p2", 0, PU, c6, "s06-c"), S("s06p3", 0, PU, d6, "s06-d")];
export const CUES06: SCue[] = [[W("s06p1", "Airtel's home|+0.2"), "paper", 0.3], [W("s06p1", "It is adding|-0.2"), "paper", 0.3], [W("s06p2", "Management says"), "paper", 0.35],
  [W("s06p2", "next quarters|-0.1"), "paper", 0.3], [W("s06p3", "what they earn"), "pop", 0.3]];
