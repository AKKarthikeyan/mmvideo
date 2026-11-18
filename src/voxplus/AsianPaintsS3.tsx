// asianpaintsq2 "The rest of the bill" (o01, g01) and "But..." (b01, b02). Figures: script.md ledger rows 22-30.
import React from "react";
import {SCue} from "./A01V4Cold";
import {Shot, Stamp, StickyNote} from "./A01V4Parts";
import {MChapterQ as ChapterQ} from "./AsianPaintsMore";
import {C} from "./tokens";
import {H0, PU, PUSH, S, W, WD, WL, WR, MZ} from "./AsianPaintsCue";
import {Bars, Big, Black, DECK, Desk, Disc, Head, Lab, RELEASE, RESULTS, RowsCard, STANDALONE} from "./AsianPaintsPieces";
import {PriceTag, QuoteCard, Ruler, SansBig, mk} from "./AsianPaintsKit";
import {Balance, Envelope, GREEN, TapDisc, TinShelf} from "./AsianPaintsProps";
import {ARITH, NOBASE, OURREAD} from "./AsianPaintsS1";

const ST = STANDALONE;
const SEG = "Consolidated segment highlights";
// ---- o01 what cushioned it
const o01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={4} q="The rest of the bill" icon="doc"/>);
const o01b = mk((f, a, d) => (
  <Desk f={f} d={d} chip="Our question">
    <Head f={f} at={2} text="WHAT CUSHIONED IT?" x={960} y={480} size={96}/>
  </Desk>));
const o01c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RELEASE("2")} chip2={ST}>
    <Big f={f} at={a("o01", "P B D I T") - 2} text="PBDIT" x={960} y={440} size={260} color={C.ink} rot={-2}/>
    <Lab f={f} at={a("o01", "P B D I T") + 8} text="the next profit line" x={960} y={640} size={50}/>
  </Desk>));
const o01d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RELEASE("2")} chip2={ST}>
    <QuoteCard f={f} head="Press release · p.2 · standalone" lines={["PBDIT (Profit before depreciation, interest, tax and other income) for the quarter increased by 5.9%"]}
      hl={[["Profit before depreciation, interest, tax and other income)", a("o01", "profit before") - 3], ["increased by 5.9%", a("o01", "still rose") - 3]]} w={1500} size={62} y={500}/>
  </Desk>));
const o01e = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RELEASE("2")} chip2={ST + " · Jul–Sep 2026"}>
    <SansBig f={f} at={a("o01", "five point nine") - 3} text="₹1,440.3 cr" x={960} y={420} size={200} color={C.ink}/>
    <Lab f={f} at={a("o01", "in rupees") - 2} text="PBDIT · up 5.9% in rupees" x={960} y={620} size={52}/>
  </Desk>));
const o01f = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RELEASE("2")} chip2={ST}>
    <Ruler f={f} at={0} lo={16} hi={19} step={1} from={18.5} to={17.1} moveAt={a("o01", "to seventeen") - 2} label="PBDIT MARGIN, % OF NET SALES" y={600}
      ghost={{v: 18.5, label: "A YEAR AGO", at: a("o01", "to seventeen") + 10}}/>
  </Desk>));
const o01g = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RESULTS("5")} chip2={ST + " · other expenses ₹1,390.61 cr against ₹1,333.32 cr"}>
    <Big f={f} at={3} text="+4.3%" x={960} y={440} size={260} color={C.ink} rot={-2}/>
    <Lab f={f} at={a("o01", "four point three") + 8} text="other expenses · sales +14.8%" x={960} y={660} size={50}/>
  </Desk>));
const o01h = mk((f, a, d) => (
  <Black f={f} d={d} chip={ARITH + " · " + RESULTS("5")} chip2={ST}>
    <Bars f={f} title="Other expenses" source="₹ of every ₹100 of sales · Jul–Sep" max={20} box={{x: 560, y: 320, w: 800, h: 520}} bw={260}
      bars={[{label: "A YEAR AGO", v: 18.2, txt: "₹18.20", at: a("o01", "eighteen rupees") - 3}, {label: "NOW", v: 16.5, txt: "₹16.50", at: a("o01", "sixteen") - 3, key: true}]}/>
  </Black>));
const o01i = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RESULTS("5")} chip2="One line in the statement">
    <Envelope f={f} at={0} label="OTHER EXPENSES" sub="₹1,390.61 cr" sealAt={a("o01", "names nothing") - 2} y={500}/>
  </Desk>));
const o01j = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("25")} chip2="The company's explanation">
    <QuoteCard f={f} head="Deck · slide 25" lines={["Cost optimization initiatives offsetting part of the impact on Gross Margin"]} hl={[["Cost optimization initiatives", a("o01", "cost optimisation") - 3]]} w={1500} size={66} y={500}/>
  </Desk>));
// ---- g01 the rest of the group
const g01a = mk((f, a, d) => (
  <Desk f={f} d={d} chip="Our question" chip2={SEG}>
    <Disc f={f} at={2} name="factory" x={520} y={420} size={240}/>
    <Disc f={f} at={6} name="ship" x={960} y={420} size={240}/>
    <TapDisc f={f} at={10} x={1400} y={420}/>
    <Head f={f} at={4} text="AND THE GROUP?" x={960} y={740} size={80}/>
  </Desk>));
const g01b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("20")} chip2="The slide's own title">
    <QuoteCard f={f} head="Deck · slide 20 · industrial" lines={["Strong Industrial Growth Continues; Lower Pass-Through Dents Margins"]}
      hl={[["Lower Pass-Through Dents Margins", a("g01", "lower pass") - 3]]} w={1500} size={68} y={500}/>
  </Desk>));
const g01c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RELEASE("3")} chip2={SEG + " · international"}>
    <Disc f={f} at={2} name="ship" x={560} y={460} size={300}/>
    <SansBig f={f} at={a("g01", "profit before") - 3} text="₹52.7 cr" x={1300} y={380} size={170} color={C.ink}/>
    <Lab f={f} at={a("g01", "profit before") + 4} text="international · PBT" x={1300} y={520} size={46}/>
    <PriceTag f={f} at={a("g01", "thirty one") - 3} x={1300} y={560} text="PBT −31.0%" size={64} bg="linear-gradient(160deg, #F0567F, #C81D52)" color={C.white} string={40}/>
  </Desk>));
const g01d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("23")} chip2="The company's explanation">
    <QuoteCard f={f} head="Deck · slide 23 · international" lines={["Entire impact of steep inflation felt during the quarter"]} hl={[["Entire impact of steep inflation", a("g01", "entire") - 3]]} w={1500} size={70} y={500}/>
  </Desk>));
const g01e = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RELEASE("3")} chip2={SEG + " · bath fittings"}>
    <TapDisc f={f} at={2} x={960} y={400} size={300}/>
    <Head f={f} at={a("g01", "exception") - 2} text="ONE EXCEPTION" x={960} y={720} size={84}/>
  </Desk>));
const g01f = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RELEASE("3")} chip2={SEG + " · bath fittings · PBT"}>
    <SansBig f={f} at={3} text="₹8.7 cr" x={600} y={420} size={190} color={GREEN}/>
    <Lab f={f} at={8} text="profit · now" x={600} y={580} size={50}/>
    <SansBig f={f} at={a("g01", "loss") - 3} text="−₹4.0 cr" x={1340} y={420} size={190} color={C.markerRed}/>
    <Lab f={f} at={a("g01", "loss") + 4} text="loss · a year earlier" x={1340} y={580} size={50}/>
  </Desk>));

// ---- b01 But...
const b01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={5} q="But…" icon="eye"/>);
const b01b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={OURREAD}>
    <StickyNote f={f} at={2} text="STRONGEST CASE AGAINST US" x={1500} y={240}/>
    <Head f={f} at={a("b01", "strongest") - 2} text="THE CASE AGAINST" x={860} y={520} size={96}/>
  </Desk>));
const b01c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RELEASE("1")} chip2="Amit Syngle, MD & CEO">
    <QuoteCard f={f} head="Press release · p.1 · Amit Syngle, MD & CEO" lines={["“… absorbed part of the cost inflation to protect consumer demand …”"]}
      hl={[["absorbed part of the cost", a("b01", "absorbed") - 3], ["to protect consumer demand", a("b01", "protect") - 3]]} w={1460} size={66} y={500}/>
  </Desk>));
const b01d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={OURREAD}>
    <Balance f={f} at={0} tipAt={a("b01", "giving up") - 2} x={960} y={360}/>
    <Head f={f} at={a("b01", "moat being") - 4} text="THE MOAT, USED?" x={960} y={140} size={66}/>
  </Desk>));
const b01e = mk((f, a, d) => (
  <Desk f={f} d={d} chip={OURREAD} chip2="The filings give the company's word, no test">
    <Stamp f={f} at={2} text="CHOICE?" x={560} y={460} size={130} rot={-6}/>
    <Stamp f={f} at={a("b01", "no way") - 3} text="LIMIT?" x={1360} y={460} size={130} rot={5} color={C.ink}/>
    <Lab f={f} at={a("b01", "test it") - 4} text="no way to test" x={960} y={760} size={52}/>
  </Desk>));
// ---- b02 or just timing
const b02a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={OURREAD}>
    <Disc f={f} at={0} name="watch" x={960} y={400} size={280}/>
    <Head f={f} at={2} text="OR JUST TIMING?" x={960} y={720} size={84}/>
  </Desk>));
const b02b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("24")} chip2="The company's explanation">
    <QuoteCard f={f} head="Deck · slide 24" lines={["Gross margin moderated to 40.3% as higher-cost inventory flowed through after steep inflation in Q1 FY27"]}
      hl={[["higher-cost inventory flowed through", a("b02", "higher") - 3]]} w={1500} size={62} y={500}/>
  </Desk>));
const ROWS2 = (f: number, a: (k: string, x?: number | string) => number) => [{l: "APR–JUN  MATERIAL", v: "▲ ~25%", hl: a("b02", "twenty five") - 3}, {l: "JUL–SEP  MATERIAL", v: "▲ ~3%", hl: a("b02", "about three") - 3}];
const b02c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("24")} chip2={NOBASE}>
    <RowsCard f={f} head="Slide 24 · material boxes" rows={ROWS2(f, a)} w={1400} y={480}/>
  </Desk>));
const b02d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("24")} chip2={NOBASE}>
    <RowsCard f={f} head="Slide 24 · material boxes" rows={ROWS2(f, a)} w={1400} y={400}/>
    <Stamp f={f} at={a("b02", "no base") - 2} text="NO BASE GIVEN" x={1240} y={780} size={90} rot={-4}/>
  </Desk>));
const b02e = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RESULTS("6")} chip2={ST + " · balance sheet · ₹ crore"}>
    <RowsCard f={f} head="Results · p.6 · inventories · ₹ crore" rows={[{l: "30 SEP 2026", v: "6,008.55", hl: a("b02", "six thousand") - 3}, {l: "31 MAR 2026", v: "4,824.74", hl: a("b02", "four thousand eight") - 3}]} w={1400} y={480}/>
  </Desk>));
const b02f = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARITH + " · +24.5% since 31 Mar"} chip2={RESULTS("6")}>
    <TinShelf f={f} at={0} n={12} x={960} y={470}/>
    <PriceTag f={f} at={a("b02", "what that") - 3} x={1440} y={55} text="COST: NOT STATED" size={52} string={50}/>
  </Desk>));

export const SHOTS3: Shot[] = [
  S("o01", -0.85, PU, o01card), S("o01", 0.65, WL, o01b), S("o01", "P B D I T", PU, o01c), S("o01", "the company's profit", WR, o01d), S("o01", "still rose", WD, o01e),
  S("o01", "Its margin slipped", WL, o01f), S("o01", "Other expenses grew", PU, o01g), S("o01", "falling from", WR, o01h), S("o01", "Our arithmetic", WD, o01i), S("o01", "The deck credits", PU, o01j),
  S("g01", 0, WL, g01a), S("g01", "The industrial", PU, g01b), S("g01", "International profit", WR, g01c), S("g01", "and its slide", WD, g01d), S("g01", "One exception", PU, g01e), S("g01", "profit before tax of", MZ, g01f),
  S("b01", -0.85, PU, b01card), S("b01", 0.65, WD, b01b), S("b01", "Amit Syngle says", WL, b01c), S("b01", "If that was", PU, b01d), S("b01", "The filings give", WR, b01e),
  S("b02", 0, WD, b02a), S("b02", "Slide twenty four", PU, b02b), S("b02", "On that slide", WL, b02c), S("b02", "and about three", PUSH(0, -60), b02d), S("b02", "Stock on the", WR, b02e), S("b02", "The filings do not", PU, b02f),
];
void H0;
export const CUES3: SCue[] = [
  [W("o01", -0.85), "paper", 0.6], [W("o01", "P B D I T"), "pop", 0.5], [W("o01", "profit before"), "highlighter", 0.4], [W("o01", "still rose"), "ding", 0.5], [W("o01", "to seventeen"), "click", 0.5],
  [W("o01", "four point three"), "ding", 0.4], [W("o01", "falling from"), "whoosh", 0.4], [W("o01", "sixteen"), "ding", 0.4], [W("o01", "names nothing"), "stamp", 0.5], [W("o01", "cost optimisation"), "highlighter", 0.4],
  [W("g01", 0), "pop", 0.4], [W("g01", "lower pass"), "highlighter", 0.4], [W("g01", "thirty one"), "stamp", 0.5], [W("g01", "entire"), "highlighter", 0.4], [W("g01", "exception"), "pop", 0.5], [W("g01", "eight point"), "ding", 0.5], [W("g01", "loss"), "pop", 0.4],
  [W("b01", -0.85), "paper", 0.7], [W("b01", "strongest"), "paper", 0.4], [W("b01", "protect"), "highlighter", 0.4], [W("b01", "giving up"), "whoosh", 0.5], [W("b01", "The filings give"), "stamp", 0.6], [W("b01", "no way"), "stamp", 0.5],
  [W("b02", 0), "click", 0.5], [W("b02", "higher"), "highlighter", 0.4], [W("b02", "twenty five"), "highlighter", 0.3], [W("b02", "about three"), "highlighter", 0.3], [W("b02", "no base"), "stamp", 0.6],
  [W("b02", "six thousand"), "ding", 0.4], [W("b02", "four thousand eight"), "pop", 0.4], [W("b02", "what that"), "pop", 0.4],
];
