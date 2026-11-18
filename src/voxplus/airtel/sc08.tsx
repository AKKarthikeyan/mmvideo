// Scene 08 | Does stickiness show? p1: Airtel mobile monthly churn, nine quarters (zero-based line, direct labels, no trend line); only the two
// matching points (Sep-26 and Sep-25, 2.9% each) are circled, "last quarter 2.6%" is labelled. p2: management's own words (Q1 FY27 call,
// Shashwat Sharma): higher churn and weaker continuity in certain cohorts; MANAGEMENT SAYS. p3: Digital TV from the real Quarterly Report
// page (customers 16,003 -> 15,560 thousand, -443 thousand) with the loss and churn tiles. Data: claims C47 (churn series), C46, C73;
// ledger rows s08p1-s08p3.
import React from "react";
import {SCue} from "./kit/A01V4Cold";
import {SP, Shot} from "./kit/A01V4Parts";
import {DocPage} from "./kit/DocPage";
import {Rect} from "./kit/Marker";
import {C, useTicks} from "./kit/tokens";
import {H0, PU, S, W, useAt} from "./cue";
import {LineChart, LinePoint, QuoteCard} from "./devices_airtel";
import {EntityTag} from "./devices";
import {T, Tile, Stage} from "./parts0508";
import QJ from "../../../public/voxplus/airtel/docs/sc08_cohorts.json";
import DJ from "../../../public/voxplus/airtel/docs/sc08_dtv.json";

const CHURN = [3.2, 2.5, 2.3, 2.7, 2.9, 2.6, 2.4, 2.6, 2.9];                       // C47, % per month, Sep-24 .. Sep-26
const QL = ["Sep-24", "Dec-24", "Mar-25", "Jun-25", "Sep-25", "Dec-25", "Mar-26", "Jun-26", "Sep-26"];

const a8: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tDraw = a("s08p1", "stickier"), tMg = a("s08p1", "Management says this"), tAir = a("s08p1", "Airtel's monthly");
  const tNow = a("s08p1", "two point nine percent"), tYr = a("s08p1", "A year ago"), tLast = a("s08p1", "Last quarter");
  const pts: LinePoint[] = CHURN.map((v, i) => ({label: QL[i], v, hi: i === 8 ? {at: tNow} : i === 4 ? {at: tYr} : undefined}));
  return (
    <Stage f={f} d={d} chip="Airtel Quarterly Reports (Q2 FY26, Q2 FY27) · 4.2 Mobile Services India · 9.4 Operational Performance">
      <EntityTag f={f} at={-30} text="AIRTEL · INDIA MOBILE" period="QUARTERLY, SEP-24 TO SEP-26" x={250} y={136}/>
      <LineChart f={f} at={tDraw} x={250} y={330} w={1400} h={320} points={pts} yMax={4} drawDur={Math.max(60, tAir - tDraw + 20)} unit="%" digits={1}
        title="MONTHLY MOBILE CHURN, % OF CUSTOMERS PER MONTH"/>
      <T f={f} at={tNow} text="THIS QUARTER 2.9%" x={520} y={830} size={38} color={C.markerRed} align="center"/>
      <T f={f} at={tYr} text="A YEAR AGO 2.9%" x={960} y={830} size={38} color={C.markerRed} align="center"/>
      <T f={f} at={tLast} text="LAST QUARTER 2.6%" x={1400} y={830} size={38} color={C.ink} align="center"/>
      <T f={f} at={tMg} text="MANAGEMENT SAYS: SEASONALITY + PRICING MOVE; THE PRICING EFFECT IS TEMPORARY" x={960} y={905} size={32} color={C.white} bg={C.ink} align="center"/>
      <T f={f} at={tMg} text="Q2 FY27 call 00:44:16 · our transcription of the company's official audio" x={960} y={950} size={22} mono color={C.ink} align="center"/>
    </Stage>
  );
};

const b8: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tT = a("s08p2", "tightened");
  return (
    <Stage f={f} d={d} chip="Airtel earnings webinar transcript · Q1 FY27 (5 Aug 2026)">
      <QuoteCard f={f} at={-10} x={960} y={400} w={1500} src="airtel/docs/sc08_cohorts.png" imgW={QJ.w} imgH={QJ.h} speaker="Shashwat Sharma, MD & CEO, Airtel India" source="Q1 FY27 call · 5 Aug 2026"/>
      <T f={f} at={tT} text="“WE HAVE TIGHTENED ACQUISITION QUALITY”" x={960} y={780} size={40} color={C.white} bg={C.ink} align="center" spacing={1}/>
    </Stage>
  );
};

const c8: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tLost = a("s08p3", "lost"), t443 = a("s08p3", "four hundred and forty three"), tLoss = a("s08p3", "a loss"), tCh = a("s08p3", "three point five");
  const X = DJ.extra as unknown as Record<string, Rect[]>;
  const row = (k: string, w: number): Rect => [X[k][0][0], X[k][0][1], w, X[k][0][3]];
  return (
    <Stage f={f} d={d} chip="Airtel Q2 FY27 Quarterly Report · 4.4 Digital TV Services p.18 · 3.3.5 Digital TV Services p.13">
      <EntityTag f={f} at={-30} text="AIRTEL · DIGITAL TV" period="Q2 FY27 · DTH CUSTOMERS" x={280} y={126}/>
      <DocPage f={f} src="airtel/docs/sc08_dtv.png" imgW={DJ.w} imgH={DJ.h} x={960} y={385} width={1300} margin={0.05} rot={-0.3}
        enter={{at: -10, mode: "drop", dur: 8}}
        highlights={[{rects: [X["15,560"][0], X["16,003"][0]], at: tLost, dur: 10}, {rects: [row("(443)", 54)], at: t443, dur: 10}, {rects: [[X["Monthly Churn"][0][0], X["Monthly Churn"][0][1], 870, X["Monthly Churn"][0][3]] as Rect], at: tCh, dur: 14}]}/>
      <T f={f} at={tLost} text="CUSTOMERS, THOUSAND: 16,003 (JUN-26) → 15,560 (SEP-26)" x={960} y={632} size={28} mono color={C.ink} align="center" bg={C.white}/>
      <Tile f={f} at={t443} x={420} y={690} w={500} big="−443,000" bigSize={72} sub="customers in the quarter" color={C.rust}/>
      <Tile f={f} at={tLoss} x={960} y={690} w={500} big="₹131.8 crore" bigSize={72} sub="Digital TV EBIT loss · (1,318) Rs Mn" color={C.rust}/>
      <Tile f={f} at={tCh} x={1500} y={690} w={500} big="3.5%" bigSize={72} sub="monthly churn, Digital TV" color={C.ink}/>
    </Stage>
  );
};

export const SHOTS08: Shot[] = [S("s08p1", 0, H0, a8, "s08-a"), S("s08p2", 0, PU, b8, "s08-b"), S("s08p3", 0, PU, c8, "s08-c")];
export const CUES08: SCue[] = [[W("s08p1", "Airtel's monthly"), "paper", 0.3], [W("s08p1", "two point nine percent|+0.3"), "circle", 0.5], [W("s08p2", "Management also"), "paper", 0.3],
  [W("s08p3", "Digital TV"), "paper", 0.3]];
