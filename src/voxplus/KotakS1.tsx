// kotakq2 cold open (c01-c04), "The foreign money" (f01-f04). Figures: contentengine/drafts/2026-10-24/_video/script.md (reviewed). Standalone throughout.
import React from "react";
import {SCue} from "./A01V4Cold";
import {ChapterQ, Shot, Stamp, StickyNote, Words} from "./A01V4Parts";
import {StickerLabel} from "./Collage";
import {C} from "./tokens";
import {H0, PU, PUSH, S, W, WD, WL, WR, WU} from "./KotakCue";
import {Bars, Big, BizCard, Black, Counter, DECK, Desk, Disc, Doc, Head, Lab, RELEASE, RowsCard, Rs, STANDALONE, Squares, XI} from "./KotakPieces";
import {NimGauge, PriceTag, QuoteCard, DepositSlip, mk} from "./KotakKit";

import {CamKey} from "./Camera";
import {DocName, aimAt} from "./KotakPieces";
/** camera keys that settle, then push in on one phrase of a Doc (doc placed at x, y, width, rot) */
export const zoomCam = (name: DocName, phrase: string, t0: number, d: number, Z: number, x = 960, y = 520, width = 1500, rot = -0.8): CamKey[] => {
  const p = aimAt(name, phrase, x, y, width, rot), a = Math.max(1, t0);
  return a + 23 < d ? [[0, 1.0, 960, 540], [a, 1.0, 960, 540], [a + 22, Z, p.x, p.y], [d, Z * 1.03, p.x, p.y]] : [[0, 1.0, 960, 540], [Math.max(a + 1, d), Z, p.x, p.y]];
};
export const ARITH = "Our arithmetic";
export const ADJ = "The bank's own adjusted figure";
export const NOT = "Not in the filings";
const R1 = RELEASE("1"), R2 = RELEASE("2");

// ---- c01 the strange object, the first question
const c01a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.1, 960, 520], [d, 1.0, 960, 540]]} chip={R1} chip2="Kotak Mahindra Bank · quarter to 30 Sep 2026">
    <DepositSlip f={f} at={0} x={900} y={600} rot={-4} stampAt={10}/>
    <PriceTag f={f} at={a("c01", "margin") - 8} x={1180} y={90} text="₹55,344 CR" size={96} q={a("c01", "margin") - 2}/>
  </Desk>));
const c01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={R1} chip2="Net interest margin, standalone">
    <NimGauge f={f} at={0} from={4.54} to={4.31} moveAt={a("c01", "fall") - 2} y={560} ghosts={[{v: 4.54, label: "SEP 2025", at: 6}]}/>
    <Head f={f} at={a("c01", "fall") + 4} text="WHY DID IT FALL?" x={960} y={930} size={80}/>
  </Desk>));
const c01c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.04, 960, 540], [d, 1.0, 960, 540]]} chip={R1}>
    <BizCard f={f} at={0} x={700} y={500} name="KOTAK MAHINDRA BANK" icon="bank" rot={-3} w={520} sub="Q2 FY27 · Jul–Sep 2026"/>
    <Disc f={f} at={a("c01", "foreign")} name="globe" x={1400} y={430} size={240}/>
    <Lab f={f} at={a("c01", "foreign") + 4} text="foreign-currency deposits" x={1400} y={640} size={34}/>
  </Desk>));
const c01d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={R1} chip2="About ~₹55,344 crore, FCNR(B) deposits">
    <Rs f={f} at={a("c01", "fifty five")} v={55344} x={960} y={470} size={190}/>
    <Lab f={f} at={a("c01", "fifty five") + 14} text="crore · taken in during one quarter" x={960} y={640} size={36}/>
  </Desk>));
// ---- c02 the bank's own attribution
const c02a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("nim", "largely on account of", 4, d, 1.9, 960, 500, 1700, -0.5)} chip={R1} chip2="The bank's own words">
    <Doc f={f} name="nim" x={960} y={500} width={1700} rot={-0.5} hl={[["largely on account of", a("c02", "largely") - 2]]}/>
  </Desk>));
const c02b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 540]]} chip={R1}>
    <PriceTag f={f} at={-30} x={640} y={60} text="₹55,344 CR" size={110} swing={0.6}/>
    <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}><path d="M 900 420 Q 1100 360 1280 470" fill="none" stroke={C.markerRed} strokeWidth={14} strokeLinecap="round" strokeDasharray="30 18"/></svg>
    <Big f={f} at={a("c02", "those deposits") - 6} text="4.31%" x={1480} y={540} size={190} color={C.markerRed} rot={-3}/>
    <Lab f={f} at={a("c02", "those deposits")} text="the margin, down from 4.54%" x={1480} y={690} size={32}/>
  </Desk>));
// ---- c03 profit rose anyway
const c03a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={R1} chip2={"Standalone profit after tax · year on year"}>
    <Big f={f} at={a("c03", "twenty nine") - 4} text="+29%" x={960} y={470} size={290} color={C.ink} rot={-3}/>
    <Lab f={f} at={a("c03", "twenty nine") + 8} text="profit, from a year earlier" x={960} y={690} size={38}/>
  </Desk>));
const c03b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 800, 520]]} chip={R1}>
    <Doc f={f} name="pat" x={960} y={330} width={1600} rot={-0.5} hl={[["₹ 4,212 crore, up 29% YoY", a("c03", "four thousand") - 6]]}/>
    <Rs f={f} at={a("c03", "four thousand")} v={4212} x={960} y={720} size={170}/>
  </Desk>));
const c03c = mk((f, a, d) => <Words f={f} d={d} text="A thinner margin. A bigger bank. More profit." at={1} mark={["profit."]} markAt={a("c03", "more profit") - 2} size={110}/>);
const c03d = mk((f, a, d) => <Words f={f} d={d} text="How does that happen?" at={1} mark={["happen?"]} markAt={10} size={150}/>);
// ---- c04 the big question
const c04a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.06, 960, 560], [d, 1.0, 960, 540]]} chip="Our question">
    <Disc f={f} at={2} name="globe" x={620} y={500} size={290}/>
    <Lab f={f} at={6} text="THIS MONEY?" x={620} y={720} size={42}/>
    <Disc f={f} at={a("c04", "cheap") - 4} name="piggy" x={1300} y={500} size={290}/>
    <Lab f={f} at={a("c04", "cheap")} text="THE CHEAP-MONEY ADVANTAGE?" x={1300} y={720} size={36}/>
  </Desk>));
const c04b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip="Our question">
    <StickyNote f={f} at={2} text="THIS MONEY? ADVANTAGE?" x={1480} y={220}/>
    <PriceTag f={f} at={0} x={620} y={120} text="₹55,344 CR" size={110} q={a("c04", "foreign")}/>
    <Head f={f} at={a("c04", "what did it do")} text="WHAT DID IT DO?" x={1100} y={880} size={80}/>
  </Desk>));
// ---- f01 what is an FCNR deposit
const f01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={1} q="The foreign money" icon="bank"/>);
const f01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip="Plain definition · RBI FAQ, 16 Jan 2025" chip2="Not defined in Kotak's filings">
    <Disc f={f} at={0} name="passport" x={420} y={470} size={250}/>
    <Disc f={f} at={a("f01", "foreign") - 20} name="globe" x={960} y={470} size={250}/>
    <Disc f={f} at={a("f01", "Indian bank") - 4} name="bank" x={1500} y={470} size={250}/>
    <Head f={f} at={a("f01", "what is") + 4} text="WHAT IS FCNR?" x={960} y={900} size={84}/>
  </Desk>));
const f01c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip="Plain definition · RBI FAQ, 16 Jan 2025" chip2="From the Reserve Bank's rules, not the filing">
    <RowsCard f={f} head="FCNR(B) · RBI rules" rows={[
      {l: "WHAT", v: "Fixed-term deposit", hl: a("f01", "fixed term") - 2}, {l: "IN", v: "Foreign currency", hl: a("f01", "foreign currency")},
      {l: "WHO", v: "Indian citizen or of Indian origin, abroad", hl: a("f01", "Indian citizen")}, {l: "FOR", v: "1 to 5 years", hl: a("f01", "for one to five")}]} w={1500} y={520}/>
  </Desk>));
const f01d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={DECK("11")} chip2="Balance sheet footnote">
    <QuoteCard f={f} head="Investor presentation · slide 11" lines={["Deposits as of 30th Sep, 2026 include FCNR(B) deposits", "aggregating to ~ ₹ 55,344 cr, pursuant to RBI’s swap facility"]}
      hl={[["pursuant to RBI’s swap facility", a("f01", "pursuant") - 2]]} w={1560} size={40}/>
  </Desk>));
// ---- f02 how big
const f02a = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("11")} chip2="Standalone · 30 Sep 2026 · ₹ crore">
    <Bars f={f} title="Deposits at 30 Sep 2026" source="₹ crore" max={720000} box={{x: 560, y: 300, w: 800, h: 560}} bw={260}
      bars={[{label: "ALL DEPOSITS", v: 651491, txt: "651,491", at: 0}, {label: "FOREIGN DEPOSITS (FCNR)", v: 55344, txt: "~55,344", at: a("f02", "foreign deposits") - 2, key: true}]}/>
  </Black>));
const f02b = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("11")} chip2="Our arithmetic: 55,344 ÷ 651,491 = 8.49%">
    <Squares f={f} at={0} fill={8.5} x={720} y={540} cell={78} per={0.5}/>
    <Big f={f} at={a("f02", "eight and a half") - 4} text="8.5%" x={1480} y={440} size={190} color={C.highlightPrint}/>
    <Lab f={f} at={a("f02", "eight and a half") + 8} text="of all deposits (our arithmetic)" x={1480} y={590} color={C.white} size={30}/>
  </Black>));
const f02c = mk((f, a, d) => (
  <Black f={f} d={d} chip={RELEASE("2")} chip2={ADJ}>
    <Bars f={f} title="Deposit growth" source="Year on year, Sep 2026" max={30} box={{x: 560, y: 300, w: 800, h: 560}}
      bars={[{label: "ALL DEPOSITS", v: 23, txt: "+23%", at: 0}, {label: "WITHOUT FOREIGN DEPOSITS", v: 13, txt: "+13%", at: a("f02", "without them") + 2, key: true}]}/>
  </Black>));
const f02d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("deposits", "Excluding FCNR (B) deposits, total deposits grew by 13% YoY", 6, d, 1.8, 960, 500, 1700, -0.5)} chip={RELEASE("2")} chip2={ADJ}>
    <Doc f={f} name="deposits" x={960} y={500} width={1700} rot={-0.5} hl={[["Excluding FCNR (B) deposits, total deposits grew by 13% YoY", a("f02", "thirteen") - 4]]}/>
  </Desk>));
// ---- f03 loans
const f03a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("advances", "Net Advances increased 25% YoY", 6, d, 1.8, 960, 500, 1700, -0.5)} chip={R1}>
    <Doc f={f} name="advances" x={960} y={500} width={1700} rot={-0.5} hl={[["Net Advances increased 25% YoY", a("f03", "grew twenty five") - 6]]}/>
  </Desk>));
const f03b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={R1} chip2="Two things the bank leaves out">
    <StickerLabel f={f} text="LOANS AGAINST FCNR DEPOSITS" x={960} y={400} size={62} rot={-2} dark enter={{at: a("f03", "loans against"), mode: "drop"}}/>
    <Disc f={f} at={a("f03", "loans against") + 6} name="scissors" x={1560} y={400} size={170}/>
    <StickerLabel f={f} text="A LOAN BOOK TAKEN OVER" x={960} y={640} size={62} rot={2} dark enter={{at: a("f03", "and a loan book"), mode: "drop"}}/>
  </Desk>));
const f03c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={DECK("3")} chip2="Subsidiary · 100% beneficially owned by the bank">
    <BizCard f={f} at={0} x={560} y={500} name="KOTAK BANK" icon="bank" rot={-3} w={520}/>
    <BizCard f={f} at={a("f03", "from its subsidiary") - 4} x={1360} y={500} name="KOTAK MAHINDRA INVESTMENTS" icon="store" rot={3} w={640} sub="its own subsidiary"/>
    <Lab f={f} at={a("f03", "from its subsidiary") + 6} text="loan book moved across →" x={960} y={930} size={34} color={C.markerRed}/>
  </Desk>));
const f03d = mk((f, a, d) => (
  <Black f={f} d={d} chip={R1} chip2={ADJ}>
    <Bars f={f} title="Net advances growth" source="Year on year, Sep 2026" max={30} box={{x: 560, y: 300, w: 800, h: 560}}
      bars={[{label: "AS REPORTED", v: 25, txt: "+25%", at: 0}, {label: "BANK'S ADJUSTED", v: 19, txt: "+19%", at: a("f03", "nineteen") - 4, key: true}]}/>
  </Black>));
// ---- f04 the two amounts
const f04a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={DECK("11")} chip2="Loans against FCNR(B) deposits, 30 Sep 2026">
    <Disc f={f} at={0} name="bank" x={420} y={500} size={230}/>
    <Lab f={f} at={4} text="INTERNATIONAL BRANCHES" x={420} y={680} size={26}/>
    <Rs f={f} at={a("f04", "sixteen") - 4} v={16110} x={1180} y={470} size={170}/>
    <Lab f={f} at={a("f04", "sixteen") + 12} text="crore of loans against the foreign deposits" x={1180} y={640} size={32}/>
  </Desk>));
const f04b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={DECK("13")} chip2="Footnote on the corporate banking line">
    <QuoteCard f={f} head="Investor presentation · slide 13" lines={["*Includes loan portfolio aggregating to ₹ 8,915 cr as at", "30th September 2026, transferred from KMIL during the quarter", "through direct assignment"]}
      hl={[["₹ 8,915 cr", a("f04", "eight thousand") - 4]]} w={1700} size={36}/>
  </Desk>));
const f04c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("advances", "Excluding loans provided against FCNR (B) deposits and loan portfolio acquired from", 6, d, 1.8, 960, 500, 1700, -0.5)} chip={R1} chip2="The release names both exclusions, gives no amounts">
    <Doc f={f} name="advances" x={960} y={500} width={1700} rot={-0.5} hl={[["Excluding loans provided against FCNR (B) deposits and loan portfolio acquired from", 0]]}/>
    <Stamp f={f} at={a("f04", "no amounts") + 2} text="NO AMOUNTS GIVEN" x={1420} y={820} size={70} rot={-6}/>
  </Desk>));
const f04d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip="Our arithmetic, not a filing's statement" chip2="Net advances 577,295 · a year ago 462,688">
    <RowsCard f={f} head="Taking off both · our arithmetic" rows={[
      {l: "NET ADVANCES", v: "577,295"}, {l: "− LOANS AGAINST FCNR", v: "16,110", red: true, hl: a("f04", "both") - 6}, {l: "− KMIL LOANS (DECK)", v: "8,915", red: true, hl: a("f04", "both") - 2},
      {l: "= GROWTH ON 462,688", v: "+19.4%", hl: a("f04", "nineteen")}]} w={1400} y={520}/>
  </Desk>));

export const SHOTS1: Shot[] = [
  S("c01", 0, H0, c01a), S("c01", "margin", WL, c01b), S("c01", "In one quarter", PU, c01c), S("c01", "fifty five", WD, c01d),
  S("c02", 0, WD, c02a), S("c02", "those deposits", PU, c02b),
  S("c03", 0, H0, c03a), S("c03", "to four", PU, c03b), S("c03", "A thinner", WL, c03c), S("c03", "How does", WD, c03d),
  S("c04", 0, PU, c04a), S("c04", "and what", PUSH(960, 540), c04b),
  S("f01", -0.85, PU, f01card), S("f01", "First, what", WL, f01b), S("f01", "a fixed", PU, f01c), S("f01", "The filing", WR, f01d),
  S("f02", 0, WD, f02a), S("f02", "about eight", PU, f02b), S("f02", "Yet without", WL, f02c), S("f02", "the bank says", WR, f02d),
  S("f03", 0, WL, f03a), S("f03", "Leave out", PU, f03b), S("f03", "taken over", WR, f03c), S("f03", "and it is", WD, f03d),
  S("f04", 0, PU, f04a), S("f04", "The deck", WL, f04b), S("f04", "The release", WD, f04c), S("f04", "but taking", PU, f04d),
];
void WU; void XI; void Counter;
export const CUES1: SCue[] = [
  [W("c01", 0.05), "paper", 0.6], [W("c01", "margin"), "whoosh", 0.5], [W("c01", "In one quarter"), "paper", 0.5], [W("c01", "fifty five"), "ding", 0.5],
  [W("c02", "largely"), "highlighter", 0.5], [W("c03", "to four"), "ding", 0.5], [W("c03", "How does"), "pop", 0.6], [W("c04", "cheap"), "pop", 0.6],
  [W("f01", -0.85), "paper", 0.6], [W("f01", "a fixed"), "paper", 0.5], [W("f01", "pursuant"), "highlighter", 0.5], [W("f02", "about eight"), "ding", 0.5], [W("f02", "thirteen"), "highlighter", 0.4],
  [W("f03", "grew twenty five"), "highlighter", 0.4], [W("f03", "and it is"), "ding", 0.5], [W("f04", "sixteen"), "ding", 0.5], [W("f04", "eight thousand"), "highlighter", 0.4], [W("f04", "no amounts"), "stamp", 0.7], [W("f04", "nineteen"), "circle", 0.5],
];
