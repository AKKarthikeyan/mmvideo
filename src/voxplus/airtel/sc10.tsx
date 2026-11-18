// Scene 10 | What the balance sheet buys (8:35-9:25). Airtel Q2 FY27 Quarterly Report, definitions as Airtel prints them.
// (1) net debt / EBITDA (annualised) 1.63x -> 1.18x and ROCE (annualised) 18.9% -> 22.7%; (2) capex 12,467 + land 2,826 (reported separately) and
// net finance costs 4,428 -> 5,058 (Rs crore, one shared scale); (3) net income before exceptional items Rs 9,015 crore (+32.7%) and the grey
// 'why not compare margins' note (no numbers). No share price, no valuation, no Jio margin or ARPU.
import React from "react";
import {SCue} from "./kit/A01V4Cold";
import {SP, Shot} from "./kit/A01V4Parts";
import {C, F, ease, outQuint, useTicks} from "./kit/tokens";
import {H0, PU, S, W, WL, useAt} from "./cue";
import {ENTITY, EntityTag} from "./devices";
import {PairBars} from "./devices_airtel";
import {Card, Frame, Mono, Tag} from "./parts0911";

const GREYBAR = "#B9B2A4";
const QR = "Airtel Quarterly Report Q2 FY27 · p.3 (PDF p.5)";
const sub = (f: number, x: number, y: number, t: string, size = 30) => <div style={{position: "absolute", left: x, top: y, fontFamily: F.sans, fontWeight: 800, fontSize: size, color: C.ink, letterSpacing: 1}}>{t}</div>;

const A10: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t1 = a("s10p1", "one point two") - 6, t0 = a("s10p1", "one point six") - 6, r1 = a("s10p1", "twenty three") - 6, r0 = a("s10p1", "nineteen") - 6;
  return (
    <Frame f={f} d={d} chip={QR} cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <EntityTag f={f} at={-20} text={ENTITY.airtel + " · CONSOLIDATED"} period="Q2 FY26 → Q2 FY27" x={54} y={150} size={26}/>
      {sub(f, 150, 232, "NET DEBT ÷ EBITDA (ANNUALISED), TIMES")}
      <PairBars f={f} x={150} y={330} w={700} h={400} max={2} barW={200} items={[
        {label: "Q2 FY26", v: 1.63, text: "1.63×", at: t0, color: C.grey}, {label: "Q2 FY27", v: 1.18, text: "1.18×", at: t1, color: C.teal}]}/>
      {sub(f, 1050, 232, "RETURN ON CAPITAL EMPLOYED (ANNUALISED), %")}
      <PairBars f={f} x={1050} y={330} w={700} h={400} max={25} barW={200} items={[
        {label: "Q2 FY26", v: 18.9, text: "18.9%", at: r0, color: C.grey}, {label: "Q2 FY27", v: 22.7, text: "22.7%", at: r1, color: C.teal}]}/>
      <Mono f={f} at={t1} text="Net debt as Airtel prints it: includes lease obligations" x={150} y={850} size={22} w={1620}/>
    </Frame>
  );
};

const B10: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tC = a("s10p2", "twelve thousand") - 6, tL = a("s10p2", "two thousand eight hundred") - 6, tN = a("s10p2", "five thousand and fifty") - 6, tO = a("s10p2", "four thousand four hundred") - 6;
  return (
    <Frame f={f} d={d} chip={QR + " · finance cost p.33 (PDF p.35)"} cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <EntityTag f={f} at={-20} text={ENTITY.airtel + " · CONSOLIDATED"} period="₹ CRORE · SAME SCALE" x={54} y={150} size={26}/>
      {sub(f, 150, 232, "CAPEX · Q2 FY27")}
      <PairBars f={f} x={150} y={330} w={760} h={420} max={14000} barW={220} items={[
        {label: "Capex", v: 12467, text: "₹12,467", at: tC, color: C.teal}, {label: "Land for data centres (reported separately)", v: 2826, text: "₹2,826", at: tL, color: GREYBAR}]}/>
      {sub(f, 1050, 232, "NET FINANCE COSTS")}
      <PairBars f={f} x={1050} y={330} w={720} h={420} max={14000} barW={220} items={[
        {label: "Q2 FY26", v: 4427.8, text: "₹4,428", at: tO, color: C.grey}, {label: "Q2 FY27", v: 5057.6, text: "₹5,058", at: tN, color: C.ink}]}/>
      <Mono f={f} at={tL} text="Land parcel: reported in addition to capex, not part of the capex bar" x={150} y={858} size={22} w={1620}/>
    </Frame>
  );
};

const C10: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tP = a("s10p3", "thirty three") - 4, tN = a("s10p3", "nine thousand") - 4, tW = a("s10p3", "We leave out") - 4;
  const k = ease(f, tN, tN + 30, outQuint), v = Math.round(9015 * k);
  return (
    <Frame f={f} d={d} chip={QR + " · consolidated"} cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <EntityTag f={f} at={-20} text={ENTITY.airtel + " · CONSOLIDATED"} period="Q2 FY27" x={54} y={150} size={26}/>
      <Card f={f} at={-16} x={960} y={420} w={1400} h={400} strip="NET INCOME BEFORE EXCEPTIONAL ITEMS">
        <div style={{fontFamily: F.sans, fontWeight: 900, fontSize: 170, lineHeight: 1, color: k > 0 ? C.teal : C.grey, opacity: k > 0 ? 1 : 0.0}}>₹{v.toLocaleString("en-US")} CR</div>
      </Card>
      <Tag f={f} at={tP} text="+32.7%" x={1500} y={330} bg={C.teal} color={C.white} size={52} rot={3}/>
      <Tag f={f} at={tP + 6} text="BEFORE ONE-OFF ITEMS" x={760} y={655} bg={C.highlight} size={30} rot={-1} anchor="center"/>
      <Card f={f} at={tW} x={960} y={800} w={1100} h={130} grey>
        <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 38, whiteSpace: "nowrap", color: C.inkSoft, letterSpacing: 1}}>WHY NOT COMPARE MARGINS? DIFFERENT BASES</div>
      </Card>
    </Frame>
  );
};

export const SHOTS10: Shot[] = [
  S("s10p1", 0, H0, (p) => <A10 {...p}/>, "sc10-leverage-roce"),
  S("s10p2", 0, WL, (p) => <B10 {...p}/>, "sc10-capex-finance"),
  S("s10p3", 0, PU, (p) => <C10 {...p}/>, "sc10-net-income"),
];
export const CUES10: SCue[] = [[W("s10p1", "one point two"), "pop", 0.3], [W("s10p2", "twelve thousand"), "pop", 0.3], [W("s10p3", "nine thousand"), "ding", 0.4], [W("s10p3", "We leave out"), "paper", 0.3]];
