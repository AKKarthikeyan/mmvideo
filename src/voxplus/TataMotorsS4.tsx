// tatamotorsq2 "But..." (b01-b06), the ending back on the €14.40 tag (e01-e02) and the end card.
import React from "react";
import {AbsoluteFill} from "remotion";
import {SCue} from "./A01V4Cold";
import {SP, Shot, Stamp, StickyNote, Words} from "./A01V4Parts";
import {StickerLabel} from "./Collage";
import {Finish, InkSurface} from "./Texture";
import {C, F, ease, inOut, outQuint, useTicks} from "./tokens";
import {END, H0, MZ, PU, PUSH, S, W, WD, WL, WR, WU, useAt} from "./TataMotorsCue";
import {Big, Black, DECK, Desk, Disc, Doc, Head, Lab, RELEASE, RESULTS, Rs, STANDALONE, Squares} from "./TataMotorsPieces";
import {Blocks, CashJar, DateRow, Ledger, PriceTag, Safe, Seesaw} from "./TataMotorsKit";
import {ARITH, zoomCam} from "./TataMotorsS1";

const NOT = "Not in the filings";
// ---------------------------------------------------------------- b01: how will it pay?
const b01a: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="But..." at={0} size={260} mark={["But..."]} markAt={10}/>;
};
const b01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={NOT}>
      <PriceTag f={f} at={0} x={960} y={100} text="₹42,561 CR" size={120}/>
      <Head f={f} at={a("b01", "how Tata Motors")} text="HOW IS IT PAID?" x={960} y={720} size={80}/>
      <Stamp f={f} at={a("b01", "will pay") + 6} text="NOT IN THE FILINGS" x={1500} y={900} size={64} rot={-6}/>
    </Desk>
  );
};
const b01c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.04, 960, 540], [d, 1.0, 960, 540]]} chip={RELEASE("2")} chip2="Company = standalone · group = consolidated">
      <Safe f={f} at={a("b01", "eleven thousand") - 4} x={560} y={500} v="₹11.3K CR" label="the company" s={0.85}/>
      <Safe f={f} at={a("b01", "fifteen thousand") - 4} x={1340} y={500} v="₹15.9K CR" label="the group" s={0.95}/>
    </Desk>
  );
};
const Row: React.FC<{f: number; at: number; y: number; name: string; n: number; tint: string}> = ({f, at, y, name, n, tint}) => (
  <>
    <div style={{position: "absolute", left: 200, top: y - 150}}><span style={{background: C.ink, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: 40, letterSpacing: 3, padding: "8px 18px"}}>{name}</span></div>
    {Array.from({length: Math.ceil(n)}).map((_, i) => {
      const k = ease(f, at + i * 5, at + i * 5 + 10, outQuint), frac = Math.min(1, n - i);
      return <div key={i} style={{position: "absolute", left: 200 + i * 300, top: y - 80, width: 280 * frac, height: 170, background: tint, opacity: k,
        transform: `translateY(${(1 - k) * -200}px) rotate(${(i % 2 ? 1 : -1) * 1.2}deg)`, boxShadow: "0 10px 20px rgba(30,20,10,0.25)"}}/>;
    })}
  </>
);
const b01d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.04, 960, 540]]} chip={ARITH("42,561 ÷ 11,300 = 3.77; 42,561 ÷ 15,900 = 2.68")} chip2="Illustration: blocks to scale">
      <Row f={f} at={0} y={380} name="COMPANY NET CASH" n={1} tint="#E9DFC4"/>
      <Row f={f} at={a("b01", "three point eight") - 12} y={720} name="MAXIMUM OFFER" n={3.77} tint={C.highlightPrint}/>
      <Big f={f} at={a("b01", "three point eight")} text="≈3.8×" x={1480} y={360} size={130} color={C.markerRed}/>
      <Lab f={f} at={a("b01", "two point seven")} text="≈2.7× the group's net cash" x={1480} y={470} size={30}/>
    </Desk>
  );
};
const b01e: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]} chip={NOT}>
      <Disc f={f} at={0} name="safe" x={960} y={460} size={300}/>
      <Head f={f} at={a("b01", "one possible") } text="ONE POSSIBLE SOURCE" x={960} y={780}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- b02: what is enough?
const b02a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={NOT} chip2={DECK("5")}>
      <Squares f={f} at={-30} fill={35} x={720} y={540} cell={78} per={0}/>
      <Lab f={f} at={2} text="35% tendered" x={720} y={985} color="#CFC9BE" size={32}/>
      <Lab f={f} at={8} text="needed for the offer: ?" x={1500} y={430} color={C.highlightPrint} size={44}/>
      <Head f={f} at={a("b02", "conditions")} text="WHAT IS ENOUGH?" x={1500} y={760} rot={3} light/>
    </Black>
  );
};
const b02b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 540]]} chip={DECK("5")}>
      <DateRow f={f} items={[{date: "22 OCT", label: "35% tendered", at: 0, done: true}, {date: "26 OCT", label: "acceptance closes", at: a("b02", "four days")}]}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- b03
const b03a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={NOT}>
      <Disc f={f} at={0} name="coin" x={620} y={460} size={260}/>
      <Big f={f} at={a("b03", "margin")} text="?" x={800} y={330} size={200} color={C.markerRed}/>
      <Disc f={f} at={a("b03", "debt") - 2} name="bank" x={1300} y={460} size={260}/>
      <Big f={f} at={a("b03", "debt")} text="?" x={1480} y={330} size={200} color={C.markerRed}/>
      <Head f={f} at={a("b03", "added in") - 4} text="MARGIN? DEBT?" x={960} y={820}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- b04: the CEO's warnings
const b04a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.08, 960, 540], [d, 1.0, 960, 540]]} chip={RELEASE("3")} chip2="MD & CEO Girish Wagh">
      <StickerLabel f={f} text="GIRISH WAGH · MD & CEO" x={960} y={420} size={76} rot={-2} dark enter={{at: 0, mode: "drop"}}/>
      <Head f={f} at={a("b04", "own warnings") - 4} text="OWN WARNINGS" x={960} y={720}/>
    </Desk>
  );
};
const wagh = (hl: string, ph: string, cam: [number, number]): React.FC<SP> => ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={zoomCam("wagh", hl, Math.max(2, a("b04", ph) - 12), d, 1.45, 960, 500, 1720, -0.4)} chip={RELEASE("3")} chip2="MD & CEO Girish Wagh">
      <Doc f={f} name="wagh" x={960} y={500} width={1720} rot={-0.4} hl={[[hl, a("b04", ph)]]}/>
    </Desk>
  );
};
const b04b = wagh("growth rates are expected to moderate in the second", "are expected", [1300, 440]);
const b04c = wagh("remain a headwind", "remain a headwind", [1200, 620]);
const b04d = wagh("well positioned for a robust FY27", "well positioned", [700, 440]);
// ---------------------------------------------------------------- b05: our reading
const b05a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 540]]} chip="Our reading" chip2={DECK("10") + " · illustration"}>
      <Seesaw f={f} at={a("b05", "swing back") - 10} label="₹2,679 CR WORKING CAPITAL"/>
      <Head f={f} at={a("b05", "swing back")} text="CAN SWING BACK" x={560} y={220}/>
    </Desk>
  );
};
const b05b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]} chip={NOT}>
      <Seesaw f={f} at={-40} label="₹2,679 CR WORKING CAPITAL"/>
      <Stamp f={f} at={a("b05", "whether it will")} text="NOT IN THE FILINGS" x={960} y={260} size={90} rot={-6}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- b06: the other side
const b06a: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="The other side." at={1} mark={["side."]} markAt={8} size={160}/>;
};
const b06b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={DECK("8") + " · " + RELEASE("2")} chip2={STANDALONE}>
      <CashJar f={f} at={a("b06", "eleven thousand") - 10} v0={7.5} v1={11.3} vmax={14} x={620} y={540}/>
      <Big f={f} at={a("b06", "seven thousand")} text="₹7.5K cr" x={1340} y={380} size={110} color={C.grey}/>
      <Lab f={f} at={a("b06", "seven thousand") + 4} text="31 Mar 2026" x={1340} y={470} size={32}/>
      <Big f={f} at={a("b06", "eleven thousand")} text="₹11.3K cr" x={1340} y={620} size={140}/>
      <Lab f={f} at={a("b06", "eleven thousand") + 4} text="net cash · 30 Sep 2026" x={1340} y={730} size={32}/>
    </Desk>
  );
};
const b06c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={RELEASE("2") + " · " + DECK("10")} chip2="Company's measure: free cash flow">
      <Rs f={f} at={a("b06", "five thousand seven")} v={5721} x={960} y={440} size={230}/>
      <Lab f={f} at={a("b06", "five thousand seven") + 8} text="free cash flow · Apr–Sep 2026" x={960} y={620} size={40}/>
      <Head f={f} at={a("b06", "twenty one") + 4} text="THE OTHER SIDE" x={960} y={850}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- e01 / e02: back to €14.40
const e01a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  return (
    <Desk f={f} d={d} cam={[[0, 1.15, 960, 520], [d, 1.04, 960, 540]]} chip={DECK("5")}>
      <PriceTag f={f} at={0} x={860} y={160} text="€14.40" size={150}/>
      <StickyNote f={f} at={-30} text="TRUCKS? COST?" x={1480} y={220} unpin={20}/>
      <Head f={f} at={10} text="BACK TO €14.40" x={1300} y={880}/>
    </Desk>
  );
};
const e01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={DECK("5")}>
      <Doc f={f} name="price" x={960} y={500} width={1400} hl={[["In consideration of the slight delay in the completion of the Offer", a("e01", "slight delay")]]}/>
    </Desk>
  );
};
const e01c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 0.98, 960, 540], [d, 1.05, 900, 540]]} chip={RELEASE("2, 3")} chip2={STANDALONE}>
      <Ledger f={f} enterAt={0} cols={[{name: "WHOLESALED", val: "+42%", sub: "Jul–Sep 2026", at: a("e01", "far more")}, {name: "KEPT PER ₹100", val: "₹11.70", sub: "from ₹12.60 · EBITDA", red: true, at: a("e01", "a little less")}]}/>
      <Disc f={f} at={a("e01", "steel")} name="steel" x={1220} y={890} size={140}/>
      <Disc f={f} at={a("e01", "rubber")} name="tyre" x={1400} y={890} size={140}/>
    </Desk>
  );
};
const e02a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={DECK("5")} chip2="Subject to offer conditions">
      <PriceTag f={f} at={-30} x={420} y={80} text="€14.40" size={100}/>
      <DateRow f={f} items={[{date: "30 OCT", label: "settlement, if conditions are met", at: 0}]} y={430}/>
      <Big f={f} at={a("e02", "conditions are met")} text="?" x={1500} y={480} size={220} color={C.markerRed}/>
    </Desk>
  );
};
const e02b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const p = ease(f, 0, 14, outQuint);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 540]]} chip={DECK("18") + " · " + RELEASE("3")} chip2="Company's expectation">
      <div style={{position: "absolute", left: 660, top: 160, width: 600, height: 760, border: `8px dashed ${C.ink}`, opacity: p, background: "rgba(255,255,255,0.35)"}}>
        <div style={{position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: F.sans, fontWeight: 900, fontSize: 52, color: C.inkSoft, letterSpacing: 3}}>NEXT QUARTER</div>
      </div>
      <Head f={f} at={a("e02", "next filing")} text="NEXT FILING" x={960} y={930}/>
    </Desk>
  );
};
export const EndCard: React.FC<SP> = ({d}) => {
  const f = useTicks();
  const p = ease(f, 0, 14, outQuint);
  return (
    <AbsoluteFill>
      <InkSurface glow={0.1}/>
      <div style={{position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: F.serif, fontSize: 130, color: C.white, opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`}}>Moat <span style={{color: C.highlightPrint}}>&amp;</span> Margin</div>
      <div style={{position: "absolute", left: 960 - 300, top: 540, width: 600, height: 14, background: C.highlight, transform: `scaleX(${ease(f, 8, 22, inOut)})`}}/>
      <div style={{position: "absolute", left: 200, right: 200, top: 640, textAlign: "center", fontFamily: F.sans, fontWeight: 600, fontSize: 34, color: "#CFC9BE", opacity: ease(f, 14, 26)}}>
        Every figure from Tata Motors' filings of 23 Oct 2026 · derived figures are our arithmetic</div>
      <div style={{position: "absolute", left: 200, right: 200, top: 860, textAlign: "center", fontFamily: F.mono, fontSize: 26, color: "#C4BEB3", letterSpacing: 1, opacity: ease(f, 10, 20)}}>
        Educational research, not investment advice. Not a SEBI-registered research analyst or investment adviser.</div>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};

export const SHOTS4: Shot[] = [
  S("b01", -0.85, H0, b01a), S("b01", "Here is what", PU, b01b), S("b01", "The company itself", WL, b01c), S("b01", "The maximum offer", WD, b01d), S("b01", "Net cash is only", PU, b01e),
  S("b02", 0, WR, b02a), S("b02", "Thirty five", PU, b02b),
  S("b03", 0, WL, b03a),
  S("b04", 0, PU, b04a), S("b04", "Chief executive", WD, b04b), S("b04", "and that commodity", PUSH(1200, 620), b04c), S("b04", "In the same", WL, b04d),
  S("b05", 0, PU, b05a), S("b05", "The filings do not", WD, b05b),
  S("b06", 0, H0, b06a), S("b06", "net cash in", PU, b06b), S("b06", "And over the half", WR, b06c),
  S("e01", -0.7, MZ, e01a), S("e01", "The company's own", PU, e01b), S("e01", "And the trucks", WL, e01c),
  S("e02", 0, WD, e02a), S("e02", "If it is", PU, e02b),
  {id: "end", cut: END("e02") + 0.6, tr: {k: "hard"}, C: EndCard},
];
void WU; void RESULTS;
export const CUES4: SCue[] = [
  [W("b01", -0.85), "stamp", 0.6], [W("b01", "will pay"), "stamp", 0.6], [W("b01", "eleven thousand"), "click", 0.5], [W("b01", "fifteen thousand"), "click", 0.5],
  [W("b01", "three point eight"), "ding", 0.5], [W("b02", "conditions"), "pop", 0.5], [W("b03", "margin"), "pop", 0.4], [W("b03", "debt"), "pop", 0.4],
  [W("b04", "are expected"), "highlighter", 0.4], [W("b04", "remain a headwind"), "highlighter", 0.4], [W("b04", "well positioned"), "highlighter", 0.4],
  [W("b05", "whether it will"), "stamp", 0.7], [W("b06", "eleven thousand"), "ding", 0.4], [W("b06", "five thousand seven"), "ding", 0.5],
  [W("e01", -0.7), "paper", 0.6], [W("e01", "slight delay"), "highlighter", 0.4], [W("e02", "conditions are met"), "circle", 0.5], [W("e02", "next filing"), "paper", 0.5],
];
