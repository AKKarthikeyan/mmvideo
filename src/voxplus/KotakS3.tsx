// kotakq2 "The cheap-money advantage" (k01-k04), "Why profit still rose" (p01-p02), "One more thing" (n01).
import React from "react";
import {SCue} from "./A01V4Cold";
import {ChapterQ, Shot, Stamp, Words} from "./A01V4Parts";
import {StickerLabel} from "./Collage";
import {C} from "./tokens";
import {H0, PU, PUSH, S, W, WD, WL, WR} from "./KotakCue";
import {zoomCam} from "./KotakS1";
import {Bars, Big, BizCard, Black, DECK, Desk, Disc, Doc, Head, Lab, RELEASE, RESULTS, RowsCard, Rs} from "./KotakPieces";
import {DateRow, PriceTag, QuoteCard, mk} from "./KotakKit";

const R1 = RELEASE("1"), R2 = RELEASE("2");
const ADJ = "The bank's own adjusted figure";
// ---- k01
const k01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={4} q="The cheap-money advantage" icon="coin"/>);
const k01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip="Plain definition, not the filing's" chip2="CASA = current account + savings account deposits">
    <BizCard f={f} at={0} x={560} y={500} name="CURRENT ACCOUNTS" icon="shop" rot={-3} w={440}/>
    <BizCard f={f} at={a("k01", "savings") - 4} x={1360} y={500} name="SAVINGS ACCOUNTS" icon="piggy" rot={3} w={440}/>
    <Head f={f} at={a("k01", "called") - 2} text="CALLED CASA" x={960} y={900} size={84}/>
  </Desk>));
const k01c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={DECK("12")} chip2="Deposits franchise slide · averages, Q2 FY27">
    <RowsCard f={f} head="What the deck shows · Q2 FY27" rows={[
      {l: "COST OF SA (SAVINGS ACCOUNTS)", v: "2.86%", hl: a("k01", "usually costs")}, {l: "COST OF FUNDS (ALL MONEY)", v: "4.52%", hl: a("k01", "than fixed")}]} w={1250} y={500}/>
    <Lab f={f} at={a("k01", "than fixed") + 6} text="plain definition: CASA usually costs less than fixed deposits" x={960} y={840} size={30}/>
  </Desk>));
const k01d = mk((f, a, d) => (
  <Black f={f} d={d} chip={R2} chip2="Standalone CASA ratio">
    <Bars f={f} title="CASA ratio" source="share of deposits · 30 Sep" max={50} box={{x: 560, y: 300, w: 800, h: 560}}
      bars={[{label: "SEP 2025", v: 42.3, txt: "42.3%", at: 0}, {label: "SEP 2026", v: 38.2, txt: "38.2%", at: a("k01", "thirty eight") - 4, key: true}]}/>
  </Black>));
const k01e = mk((f, a, d) => <Words f={f} d={d} text="Did the advantage shrink?" at={1} mark={["shrink?"]} markAt={10} size={140}/>);
// ---- k02
const k02a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("casa", "deposit base due to FCNR (B) deposit inflows", 6, d, 1.8, 960, 500, 1700, -0.5)} chip={R2} chip2="The bank's own explanation">
    <Doc f={f} name="casa" x={960} y={500} width={1700} rot={-0.5} hl={[["deposit base due to FCNR (B) deposit inflows", a("k02", "the increase") - 2]]}/>
  </Desk>));
const k02b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={R2} chip2={ADJ}>
    <Doc f={f} name="casa" x={960} y={380} width={1500} rot={-0.5} hl={[["41.8%", a("k02", "forty one") - 2]]}/>
    <Big f={f} at={a("k02", "forty one") - 2} text="41.8%" x={960} y={760} size={230} color={C.markerRed} rot={-3}/>
  </Desk>));
// ---- k03
const k03a = mk((f, a, d) => <Words f={f} d={d} text="We checked." at={1} mark={["checked."]} markAt={8} size={190}/>);
const k03b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={DECK("11")} chip2="Standalone balance sheet, 30 Sep 2026 · ₹ crore">
    <RowsCard f={f} head="Balance sheet · 30 SEP 2026" rows={[{l: "DEPOSITS", v: "651,491"}, {l: "OF WHICH, CASA", v: "249,105", hl: a("k03", "two lakh") - 2}]} w={1400} y={500}/>
  </Desk>));
const k03c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip="Our arithmetic" chip2="651,491 − 55,344 = 596,147 (deposits less the FCNR(B) deposits)">
    <RowsCard f={f} head="Without the foreign deposits · our arithmetic" rows={[{l: "DEPOSITS", v: "651,491"}, {l: "− FOREIGN DEPOSITS", v: "55,344", red: true, hl: a("k03", "foreign deposits") - 2}, {l: "= LEFT", v: "596,147", hl: a("k03", "five lakh") - 2}]} w={1400} y={500}/>
    <PriceTag f={f} at={a("k03", "foreign deposits") - 6} x={1620} y={70} text="₹55,344 CR" size={80} swing={0.5}/>
  </Desk>));
const k03d = mk((f, a, d) => (
  <Black f={f} d={d} chip="Our arithmetic" chip2={"Bank's own figure: 41.8%"}>
    <Big f={f} at={2} text="249,105 ÷ 596,147" x={960} y={400} size={120} color={C.white}/>
    <Big f={f} at={a("k03", "Divide") + 2} text="= 41.8%" x={960} y={620} size={230} color={C.highlightPrint}/>
    <Stamp f={f} at={a("k03", "holds") - 2} text="THE BANK'S NUMBER HOLDS" x={960} y={880} size={70} rot={-4}/>
  </Black>));
// ---- k04
const k04a = mk((f, a, d) => (
  <Black f={f} d={d} chip="Our arithmetic: 42.3 − 41.8 = 0.5 point" chip2={ADJ}>
    <Bars f={f} title="CASA share" source="% of deposits · without the foreign deposits for 2026" max={50} box={{x: 560, y: 300, w: 800, h: 560}}
      bars={[{label: "SEP 2025", v: 42.3, txt: "42.3%", at: 0}, {label: "SEP 2026, ADJUSTED", v: 41.8, txt: "41.8%", at: a("k04", "half a point") - 4, key: true}]}/>
    <Big f={f} at={a("k04", "half a point")} text="−0.5" x={1500} y={440} size={190} color="#FF8FA8" rot={-4}/>
  </Black>));
const k04b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={ADJ}>
    <Disc f={f} at={0} name="piggy" x={620} y={470} size={290}/>
    <Head f={f} at={a("k04", "slipped") - 2} text="SLIPPED A LITTLE" x={1280} y={470} size={80} rot={2}/>
  </Desk>));
// ---- p01
const p01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={5} q="Why profit still rose" icon="bolt"/>);
const p01b = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("9")} chip2="Standalone, Q2 FY27 vs Q2 FY26 · profit and loss slide">
    <Bars f={f} title="Growth on a year earlier" source="Q2 FY27 · standalone" max={26} box={{x: 460, y: 300, w: 1000, h: 560}} bw={240}
      bars={[{label: "NET TOTAL INCOME", v: 18, txt: "+18%", at: 0}, {label: "COSTS", v: 14, txt: "+14%", at: a("p01", "fourteen") - 4},
        {label: "OPERATING PROFIT", v: 21, txt: "+21%", at: a("p01", "twenty one") - 4, key: true}]}/>
  </Black>));
const p01c = mk((f, a, d) => (
  <Black f={f} d={d} chip={R1} chip2="Credit cost, annualised · standalone">
    <Bars f={f} title="Credit cost" source="% · the yearly bad-loan charge" max={1} box={{x: 560, y: 300, w: 800, h: 560}}
      bars={[{label: "Q2 FY26", v: 0.79, txt: "0.79%", at: 0}, {label: "Q2 FY27", v: 0.35, txt: "0.35%", at: a("p01", "zero point three") - 4, key: true}]}/>
  </Black>));
// ---- p02
const p02a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={DECK("9")} chip2="Footnote to the fees line">
    <QuoteCard f={f} head="Investor presentation · slide 9" lines={["Q2FY27: Fees and Services include processing fees of ~ ₹ 158 cr,", "on advances against FCNR(B) deposits"]}
      hl={[["processing fees of ~ ₹ 158 cr,", a("p02", "one hundred") - 4]]} w={1700} size={38}/>
  </Desk>));
const p02b = mk((f, a, d) => (
  <Black f={f} d={d} chip={R1} chip2="Standalone fees and services">
    <Bars f={f} title="Fees and services" source="₹ crore · Q2 FY27 · year on year +21%" max={3400} box={{x: 560, y: 300, w: 800, h: 560}}
      bars={[{label: "REPORTED", v: 2926, txt: "2,926", at: 0}, {label: "FCNR LOAN FEES", v: 158, txt: "~158", at: a("p02", "one hundred") - 2, key: true}]}/>
  </Black>));
const p02c = mk((f, a, d) => (
  <Black f={f} d={d} chip="Our arithmetic: 2,926 − 158 = 2,768 vs 2,415 = +14.6%" chip2="Q2 FY26 fees: ₹2,415 crore">
    <Bars f={f} title="Fees growth" source="Year on year · Q2 FY27" max={26} box={{x: 560, y: 300, w: 800, h: 560}}
      bars={[{label: "AS REPORTED", v: 21, txt: "+21%", at: 0}, {label: "WITHOUT THOSE FEES", v: 14.6, txt: "~+15%", at: a("p02", "Without them") + 2, key: true}]}/>
  </Black>));
// ---- n01
const n01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={6} q="One more thing" icon="person"/>);
const n01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("saha", "subject to the approval of the members of the Bank", 6, d, 1.8, 960, 500, 1700, -0.5)} chip={RESULTS("1")} chip2="Board outcome · appointment of MD & CEO">
    <Doc f={f} name="saha" x={960} y={500} width={1700} rot={-0.5} hl={[["subject to the approval of the members of the Bank", a("n01", "subject to") - 2]]}/>
  </Desk>));
const n01c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={RESULTS("1")} chip2="Whole-time director today · MD & CEO for three years">
    <BizCard f={f} at={0} x={560} y={500} name="ANUP KUMAR SAHA" icon="person" rot={-3} w={520} sub="whole-time director"/>
    <StickerLabel f={f} text="MD & CEO · 3 YEARS" x={1360} y={440} size={64} rot={2} dark enter={{at: a("n01", "managing director"), mode: "drop"}}/>
    <Lab f={f} at={a("n01", "first of January") - 4} text="from 1 January 2027" x={1360} y={600} size={38}/>
  </Desk>));
const n01d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={RESULTS("1")} chip2="RBI letter of 30 Sep 2026 · members' approval pending">
    <DateRow f={f} items={[{date: "30 SEP", label: "RBI approved", at: a("n01", "R B I") - 2, done: true}, {date: "1 JAN 2027", label: "starts, subject to members", at: 8}]} y={470}/>
  </Desk>));

export const SHOTS3: Shot[] = [
  S("k01", -0.85, PU, k01card), S("k01", "Money left", WL, k01b), S("k01", "usually", PU, k01c), S("k01", "Its share", WD, k01d), S("k01", "Did the", WR, k01e),
  S("k02", 0, WL, k02a), S("k02", "Leave the", PU, k02b),
  S("k03", 0, H0, k03a), S("k03", "Cheap deposits", PU, k03b), S("k03", "Take the", WL, k03c), S("k03", "Divide", WD, k03d),
  S("k04", 0, PU, k04a), S("k04", "on the bank's own", WR, k04b),
  S("p01", -0.85, PU, p01card), S("p01", "Net total", WL, p01b), S("p01", "And credit", WD, p01c),
  S("p02", 0, PU, p02a), S("p02", "Fees grew", WR, p02b), S("p02", "Without them", WL, p02c),
  S("n01", -0.85, PU, n01card), S("n01", "The board", WL, n01b), S("n01", "now a", PUSH(960, 540), n01c), S("n01", "The R B I", WD, n01d),
];
export const CUES3: SCue[] = [
  [W("k01", -0.85), "paper", 0.6], [W("k01", "Money left"), "whoosh", 0.4], [W("k01", "usually"), "highlighter", 0.4], [W("k01", "Its share"), "whoosh", 0.4], [W("k01", "thirty eight"), "ding", 0.5],
  [W("k02", "the increase"), "highlighter", 0.4], [W("k02", "forty one"), "ding", 0.6], [W("k03", "Divide"), "ding", 0.5], [W("k03", "holds"), "stamp", 0.7], [W("k04", "half a point"), "pop", 0.5],
  [W("p01", -0.85), "paper", 0.6], [W("p01", "Net total"), "whoosh", 0.4], [W("p01", "twenty one"), "ding", 0.5], [W("p01", "And credit"), "whoosh", 0.4],
  [W("p02", "one hundred"), "highlighter", 0.5], [W("p02", "Without them"), "ding", 0.5],
  [W("n01", -0.85), "paper", 0.6], [W("n01", "subject to"), "highlighter", 0.5], [W("n01", "R B I"), "stamp", 0.6],
];
