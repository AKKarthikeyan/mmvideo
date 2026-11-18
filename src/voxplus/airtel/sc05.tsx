// Scene 05 | Suspect two: postpaid. The MIX card comes to the front. p1: postpaid base, five quarter-ends as zero-based bars
// (+1.2 million this quarter in rust, "best ever" labelled MANAGEMENT SAYS) and the real Quarterly Report line, highlighted. p2: the 1,000-dot
// grid (illustration of the share, consumer mobile customers excl. IoT/M2M): 83 lit, then 76 a year ago; held for the whole beat. p3: the same
// report page, one ARPU row for all customers, "POSTPAID ARPU: NOT DISCLOSED"; stamp SMALL BUT REAL on the MIX card.
// Data: claim C44 (postpaid base, thousand: 27,523 28,143 28,958 30,004 31,238), ledger rows s05p1/s05p2.
import React from "react";
import {SCue} from "./kit/A01V4Cold";
import {SP, Shot} from "./kit/A01V4Parts";
import {DocPage} from "./kit/DocPage";
import {Rect} from "./kit/Marker";
import {C, useTicks} from "./kit/tokens";
import {H0, PU, S, W, useAt} from "./cue";
import {SuspectCards} from "./devices_airtel";
import {EntityTag} from "./devices";
import {BigStamp, PostpaidDots, T, ZBars, ZItem, Stage} from "./parts0508";
import C0 from "../../../public/voxplus/airtel/docs/sc05_postpaid.json";

const R = C0.rects as Rect[];
const X = C0.extra as unknown as Record<string, Rect[]>;
const POST = [27523, 28143, 28958, 30004, 31238];          // C44, thousand
const QL = ["Sep-25", "Dec-25", "Mar-26", "Jun-26", "Sep-26"];
const CHIP = "Airtel Q2 FY27 Quarterly Report · 4.2 Mobile Services India · 9.4 Operational Performance";

const p1: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t12 = a("s05p1", "one point two million"), tBest = a("s05p1", "best ever"), tBase = a("s05p1", "taking the base"), t31 = a("s05p1", "thirty one point two");
  const items: ZItem[] = POST.map((v, i) => {
    const m = (v / 1000).toFixed(1);
    if (i < 4) return {label: QL[i], v: v / 1000, text: m, at: 8 + i * 5, color: C.grey, textSize: 34};
    return {label: QL[i], v: v / 1000, text: m, at: t12 - 4, labelAt: t31, color: C.teal, seg: {from: POST[3] / 1000, color: C.rust, at: t12}, inside: true, textSize: 36};
  });
  const CH = {x: 80, y: 270, w: 780, h: 290}, MAX = 34;
  const docRects: Rect[] = [R[0], X["31,238"][0], X["30,004"][0]];
  return (
    <Stage f={f} d={d} chip={CHIP}>
      <EntityTag f={f} at={-30} text="AIRTEL · INDIA MOBILE" period="QUARTER-END, SEP-25 TO SEP-26" x={80} y={150}/>
      <T f={f} at={-30} text="POSTPAID CUSTOMERS, MILLION" x={80} y={212} size={36}/>
      <ZBars f={f} {...CH} items={items} max={MAX} barW={104} labelSize={26}/>
      <T f={f} at={t12} text="+1.2 MILLION" x={CH.x + 4.5 * (CH.w / 5)} y={CH.y + CH.h - (POST[4] / 1000 / MAX) * CH.h - 44} size={32} color={C.rust} weight={900} align="center"/>
      <T f={f} at={t12 + 6} text="SEP-26 MINUS JUN-26 · OUR ARITHMETIC" x={80} y={628} size={22} mono color={C.grey}/>
      <T f={f} at={tBest} text="MANAGEMENT SAYS: “BEST EVER”" x={1400} y={196} size={30} color={C.white} bg={C.ink} align="center" spacing={1}/>
      <DocPage f={f} src="airtel/docs/sc05_postpaid.png" imgW={C0.w} imgH={C0.h} x={1400} y={440} width={820} margin={0.05} rot={0.4}
        enter={{at: tBase - 6, mode: "slide-left", dur: 12}} highlights={[{rects: docRects, at: tBase + 6, dur: 10}]}/>
      <T f={f} at={t31} text="31,238 THOUSAND = 31.2 MILLION" x={1400} y={640} size={30} align="center" color={C.ink}/>
      <SuspectCards f={f} at={-60} active="MIX"/>
    </Stage>
  );
};

const p2: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t83 = a("s05p2", "eight point three"), t76 = a("s05p2", "seven point six"), tYr = a("s05p2", "A year ago");
  return (
    <Stage f={f} d={d} chip="Airtel Q2 FY27 Quarterly Report · customer base and postpaid base (consumer mobile, excl. IoT/M2M)">
      <EntityTag f={f} at={-30} text="AIRTEL · INDIA MOBILE" period="POSTPAID SHARE" x={140} y={130}/>
      <PostpaidDots f={f} at={-20} x={520} y={395} n1={83} n2={76} litAt={t83 - 6} dropAt={tYr}/>
      <T f={f} at={-10} text="ILLUSTRATION · 1 DOT IN 1,000 MOBILE CUSTOMERS (EXCL. IoT/M2M)" x={520} y={655} size={22} mono color={C.grey} align="center"/>
      <T f={f} at={t83} text="8.3%" x={1400} y={300} size={200} weight={900} color={C.rust} align="center"/>
      <T f={f} at={t83 + 4} text="of Airtel's mobile customers are postpaid · Sep-26" x={1400} y={420} size={32} weight={600} color={C.ink} align="center" maxW={620}/>
      <T f={f} at={t76} text="7.6%" x={1400} y={528} size={120} weight={900} color={C.grey} align="center"/>
      <T f={f} at={t76 + 4} text="a year ago · Sep-25" x={1400} y={612} size={32} weight={600} color={C.grey} align="center"/>
      <SuspectCards f={f} at={-60} active="MIX"/>
    </Stage>
  );
};

const p3: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tNot = a("s05p3", "does not disclose"), tArpu = a("s05p3", "of its ARPU"), tHelp = a("s05p3", "helping");
  const arpu = X["Average Revenue Per User (ARPU)"][0];
  return (
    <Stage f={f} d={d} chip="Airtel Q2 FY27 Quarterly Report · p.17 · 4.2 Mobile Services India">
      <T f={f} at={tNot} text="POSTPAID ARPU: NOT DISCLOSED" x={960} y={128} size={46} color={C.white} bg={C.ink} align="center" spacing={1}/>
      <T f={f} at={tArpu + 4} text="ONE ARPU FIGURE FOR ALL MOBILE CUSTOMERS" x={960} y={186} size={30} color={C.rust} align="center" spacing={1}/>
      <DocPage f={f} src="airtel/docs/sc05_postpaid.png" imgW={C0.w} imgH={C0.h} x={960} y={430} width={1100} margin={0.05} rot={-0.3}
        enter={{at: -10, mode: "drop", dur: 8}} highlights={[{rects: [[arpu[0], arpu[1], 858, arpu[3]] as Rect], at: tArpu + 2, dur: 14}]}/>
      <SuspectCards f={f} at={-60} active="MIX"/>
      <BigStamp f={f} at={tHelp + 4} text="SMALL BUT REAL" x={948} y={850} size={34}/>
    </Stage>
  );
};

export const SHOTS05: Shot[] = [S("s05p1", 0, H0, p1, "s05-a"), S("s05p2", 0, PU, p2, "s05-b"), S("s05p3", 0, PU, p3, "s05-c")];
export const CUES05: SCue[] = [[W("s05p1", "added|-0.1"), "paper", 0.3], [W("s05p1", "taking the base|-0.2"), "paper", 0.3], [W("s05p2", "eight point three"), "ding", 0.3],
  [W("s05p3", "helping|+0.1"), "stamp", 0.7]];
