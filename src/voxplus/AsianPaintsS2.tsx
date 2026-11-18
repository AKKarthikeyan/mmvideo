// asianpaintsq2 "A hundred rupees" (m01-m03) and "The price" (p01-p03). Figures: script.md ledger rows 12-21. Standalone throughout.
import React from "react";
import {SCue} from "./A01V4Cold";
import {Shot, Stamp} from "./A01V4Parts";
import {MChapterQ as ChapterQ, MWords as Words} from "./AsianPaintsMore";
import {C} from "./tokens";
import {H0, PU, PUSH, S, W, WD, WL, WR, MZ} from "./AsianPaintsCue";
import {Bars, Big, Black, DECK, Desk, Disc, Head, Lab, RESULTS, Receipt, RowsCard, STANDALONE} from "./AsianPaintsPieces";
import {CalStrip, CoinGrid, LineChart, QuoteCard, SansBig, mk} from "./AsianPaintsKit";
import {PaintTin, PaperArrow} from "./AsianPaintsProps";
import {ARITH, NOBASE, PLAIN} from "./AsianPaintsS1";

const ST = STANDALONE;
// ---- m01 a hundred rupees
const m01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={2} q="A hundred rupees" icon="coin"/>);
const m01b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARITH} chip2={ST + " · revenue from sales"}>
    <CoinGrid f={f} at={0} ink={0} x={560} y={540}/>
    <Head f={f} at={4} text="WHAT IS LEFT?" x={1360} y={420} size={80}/>
    <Lab f={f} at={a("m01", "hundred rupees") - 2} text="₹100 a customer paid" x={1360} y={620} size={46}/>
  </Desk>));
const m01c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RESULTS("5") + " · " + ST} chip2={ARITH + " · Jul–Sep 2025"}>
    <CoinGrid f={f} at={-20} ink={43.7} inkAt={a("m01", "after paying") - 4} x={560} y={540}/>
    <SansBig f={f} at={a("m01", "forty three") - 3} text="₹43.70" x={1360} y={440} size={170} color={C.ink}/>
    <Lab f={f} at={a("m01", "was left") - 2} text="left after materials" x={1360} y={600} size={46}/>
    <Lab f={f} at={a("m01", "was left") + 4} text="a year ago" x={1360} y={680} size={46}/>
  </Desk>));
const m01d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RESULTS("5") + " · " + ST} chip2={ARITH + " · Jul–Sep 2026"}>
    <CoinGrid f={f} at={-20} ink={40.3} inkAt={-60} red={3.4} redAt={a("m01", "forty rupees") - 2} x={560} y={540} instant/>
    <SansBig f={f} at={a("m01", "forty rupees") - 3} text="₹40.30" x={1360} y={440} size={170} color={C.markerRed}/>
    <Lab f={f} at={a("m01", "forty rupees") + 6} text="left this quarter" x={1360} y={600} size={46}/>
  </Desk>));
const m01e = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARITH} chip2={RESULTS("5")}>
    <Stamp f={f} at={a("m01", "Our arithmetic") + 2} text="OUR ARITHMETIC" x={960} y={430} size={120} rot={-5}/>
    <Lab f={f} at={a("m01", "company's own") - 2} text="from the company's statement" x={960} y={680} size={48}/>
  </Desk>));
// ---- m02 rebuilt from the audited statement
const m02a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RESULTS("5")} chip2="Read from the page image · standalone · ₹ crore, Jul–Sep 2026">
    <RowsCard f={f} head="Results · p.5 · Jul–Sep 2026 · ₹ crore" rows={[
      {l: "MATERIALS CONSUMED", v: "4,140.60", hl: a("m02", "Materials consumed") - 2}, {l: "STOCK-IN-TRADE BOUGHT", v: "1,055.88", hl: a("m02", "plus goods") - 2},
      {l: "CHANGE IN INVENTORIES", v: "(168.74)", hl: a("m02", "adjusted") - 2}]} w={1500} y={540}/>
  </Desk>));
const m02b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARITH} chip2={RESULTS("5") + " · ₹ crore"}>
    <Receipt f={f} x={960} y={60} w={760} head="NOW · ₹ CRORE" lines={[
      {l: "MATERIALS CONSUMED", r: "4,140.60", at: 2}, {l: "+ STOCK-IN-TRADE", r: "1,055.88", at: 6}, {l: "− INVENTORY CHANGE", r: "168.74", at: 10},
      {l: "= TOTAL MATERIAL", r: "5,027.74", at: a("m02", "five thousand") - 2, big: true}]}/>
  </Desk>));
const m02c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARITH} chip2={RESULTS("5") + " · ₹ crore · Jul–Sep 2025"}>
    <Receipt f={f} x={960} y={60} w={760} head="A YEAR AGO · ₹ CRORE" lines={[
      {l: "MATERIALS CONSUMED", r: "3,063.74", at: 2}, {l: "+ STOCK-IN-TRADE", r: "954.01", at: 6}, {l: "+ INVENTORY CHANGE", r: "111.71", at: 10},
      {l: "= TOTAL MATERIAL", r: "4,129.46", at: a("m02", "one hundred") - 2, big: true}]}/>
  </Desk>));
const m02d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARITH} chip2="Total material ÷ revenue from sales (8,423.62 and 7,335.85)">
    <Big f={f} at={a("m02", "fifty nine") - 3} text="59.7%" x={560} y={460} size={220} color={C.markerRed} rot={-3}/>
    <Lab f={f} at={a("m02", "of sales") - 2} text="of sales · now" x={560} y={640} size={46}/>
    <Big f={f} at={a("m02", "fifty six") - 3} text="56.3%" x={1380} y={460} size={220} color={C.ink} rot={3}/>
    <Lab f={f} at={a("m02", "fifty six") + 6} text="a year ago" x={1380} y={640} size={46}/>
  </Desk>));
const m02e = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("24, 25")} chip2="Standalone gross margin">
    <RowsCard f={f} head="Deck · gross margin, standalone" rows={[{l: "JUL–SEP 2026", v: "40.3%", hl: a("m02", "forty point") - 2}, {l: "JUL–SEP 2025", v: "43.7%", hl: a("m02", "forty three point") - 2}]} w={1400} y={440}/>
    <Stamp f={f} at={a("m02", "matches") + 1} text="IT MATCHES" x={1300} y={780} size={100} rot={-5} color="#2E8B57"/>
  </Desk>));
// ---- m03 the gap in rupees
const m03a = mk((f, a, d) => (
  <Black f={f} d={d} chip={RESULTS("5") + " · " + ST} chip2={ARITH + " · materials; sales: press release p.2"}>
    <Bars f={f} title="Growth, Jul–Sep" source="% on a year earlier · standalone" max={25} box={{x: 560, y: 320, w: 800, h: 520}} bw={260}
      bars={[{label: "MATERIALS", v: 21.8, txt: "+21.8%", at: 2, key: true}, {label: "SALES", v: 14.8, txt: "+14.8%", at: a("m03", "Sales rose") - 2}]}/>
  </Black>));
const m03b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARITH} chip2="Illustration">
    <CoinGrid f={f} at={-20} ink={40.3} inkAt={-60} red={3.4} redAt={-40} x={440} y={540} cell={66} instant/>
    <Head f={f} at={a("m03", "held") - 2} text="AT LAST YEAR'S MARGIN" x={1300} y={460} size={66} rot={-2}/>
  </Desk>));
const m03c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARITH} chip2="Illustration · not a company figure">
    <SansBig f={f} at={a("m03", "two hundred") - 3} text="≈ ₹286 cr" x={960} y={440} size={220} color={C.ink}/>
    <Lab f={f} at={a("m03", "more would") - 2} text="more left this quarter" x={960} y={640} size={50}/>
  </Desk>));
const m03d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARITH} chip2="Illustration of scale, not a cause">
    <Receipt f={f} x={960} y={60} w={820} head="OUR ARITHMETIC" lines={[
      {l: "MARGIN 43.71% − 40.31%", r: "3.40 pts", at: 2}, {l: "× SALES", r: "₹8,423.62 cr", at: 8}, {l: "≈ MORE LEFT", r: "₹286 cr", at: 14, big: true}]}/>
  </Desk>));

// ---- p01 the price
const p01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={3} q="The price" icon="tag"/>);
const p01b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("24")}>
    <PaintTin f={f} at={0} x={1100} y={470} enter={false} tag2="PRICE ▲" tag2At={2}/>
    <Head f={f} at={a("p01", "Yes") - 2} text="PRICE UP. COST UP." x={960} y={820} size={76}/>
  </Desk>));
const p01c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("24")} chip2="A small box over each quarter">
    <CalStrip f={f} at={0} months={["APR–JUN", "JUL–SEP"]} from={0} to={2} arrowAt={6} label="TWO QUARTERS, 2026"/>
  </Desk>));
const p01d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("24")} chip2={NOBASE}>
    <QuoteCard f={f} head="Slide 24 · box over April–June 2026" lines={["◼ Material ▲ ~25%", "◼ Price ▲ ~7%"]} hl={[["Material ▲ ~25%", a("p01", "twenty five") - 3], ["Price ▲ ~7%", a("p01", "seven") - 3]]}
      w={1400} size={84} y={500}/>
  </Desk>));
const p01e = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("24")} chip2={NOBASE}>
    <QuoteCard f={f} head="Slide 24 · box over July–September 2026" lines={["◼ Material ▲ ~3%", "◼ Price ▲ ~5%"]} hl={[["Material ▲ ~3%", a("p01", "three") - 3], ["Price ▲ ~5%", a("p01", "about five") - 2]]}
      w={1400} size={84} y={500}/>
  </Desk>));
const p01f = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("24")} chip2={NOBASE}>
    <RowsCard f={f} head="Slide 24 · the two boxes" rows={[{l: "APR–JUN  MATERIAL", v: "▲ ~25%"}, {l: "APR–JUN  PRICE", v: "▲ ~7%"}, {l: "JUL–SEP  MATERIAL", v: "▲ ~3%"}, {l: "JUL–SEP  PRICE", v: "▲ ~5%"}]} w={1400} y={440}/>
    <Stamp f={f} at={a("p01", "measured") - 2} text="NO BASE STATED" x={1240} y={850} size={88} rot={-4}/>
  </Desk>));
// ---- p02 about twelve, partially
const p02a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("24")} chip2="The slide's note">
    <QuoteCard f={f} head="Deck · slide 24 · note" lines={["Calibrated pricing interventions (~12%) partially offset the impact"]}
      hl={[["(~12%)", a("p02", "twelve") - 3], ["partially", a("p02", "partially") - 2]]} w={1500} size={70} y={500}/>
  </Desk>));
const p02b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARITH} chip2="A plain sum of the two price boxes">
    <Big f={f} at={a("p02", "seven plus") - 3} text="7 + 5 = 12" x={960} y={440} size={230} color={C.ink} rot={-2}/>
    <Lab f={f} at={a("p02", "added") - 2} text="added · our arithmetic" x={960} y={660} size={50}/>
  </Desk>));
const p02c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("24")} chip2={NOBASE}>
    <Big f={f} at={a("p02", 12.0) - 3} text="~12%" x={960} y={420} size={260} color={C.ink} rot={-3}/>
    <Lab f={f} at={a("p02", "across") - 2} text="across the two quarters" x={960} y={640} size={50}/>
  </Desk>));
const p02d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("24")} chip2={NOBASE}>
    <Stamp f={f} at={3} text="NO BASE STATED" x={960} y={500} size={130} rot={-5}/>
  </Desk>));
const p02e = mk((f, a, d) => <Words f={f} d={d} text="Its own word: partially." at={1} mark={["partially."]} markAt={a("p02", "is partially") + 2} size={130} chip={DECK("24")}/>);
// ---- p03 the margin, quarter by quarter, and the slide's reasons
const p03a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("24") + " · " + ST}>
    <CalStrip f={f} at={0} months={["JAN–MAR", "APR–JUN", "JUL–SEP"]} from={0} to={3} arrowAt={4} label="2026"/>
    <Head f={f} at={a("p03", "quarter by") - 2} text="QUARTER BY QUARTER" x={960} y={230} size={72}/>
  </Desk>));
const GM = (f: number, a: (k: string, x?: number | string) => number) => (
  <LineChart f={f} title="Gross margin, standalone" source="Deck slide 24 · %" min={38} max={47}
    pts={[{label: "JAN–MAR", v: 45.6, txt: "45.6%", at: a("p03", "45") - 2}, {label: "APR–JUN", v: 43.8, txt: "43.8%", at: a("p03", "43") - 2}, {label: "JUL–SEP", v: 40.3, txt: "40.3%", at: a("p03", "40") - 2}]}/>);
const p03b = mk((f, a, d) => <Black f={f} d={d} chip={DECK("24")} chip2={ST}>{GM(f, a)}</Black>);
const p03c = mk((f, a, d) => <Black f={f} d={d} chip={DECK("24")} chip2={ST + " · Jan–Mar = Q4 FY26"}>{GM(f, a)}</Black>);
const p03d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("24")} chip2="The company's explanation">
    <QuoteCard f={f} head="Deck · slide 24" lines={["Gross margin moderated to 40.3% as higher-cost inventory flowed through after steep inflation in Q1 FY27"]}
      hl={[["higher-cost inventory flowed through", a("p03", "higher") - 3]]} w={1500} size={62} y={500}/>
  </Desk>));
const p03e = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("25")} chip2="The company's explanation">
    <QuoteCard f={f} head="Deck · slide 25" lines={["Impacted by steep inflation and lower price pass-through"]} hl={[["lower price pass-through", a("p03", "lower price") - 3]]} w={1500} size={70} y={500}/>
  </Desk>));
const p03f = mk((f, a, d) => (
  <Desk f={f} d={d} chip={PLAIN} chip2="How much of a cost rise reaches the price">
    <Head f={f} at={2} text="PASS-THROUGH" x={960} y={220} size={84}/>
    <Disc f={f} at={a("p03", "cost rise") - 4} name="coin" x={520} y={540} size={260}/>
    <Lab f={f} at={a("p03", "cost rise")} text="COST RISE" x={520} y={760} size={52} color={C.ink}/>
    <PaperArrow f={f} at={a("p03", "reaches") - 4} x1={700} y1={540} x2={1220} y2={540}/>
    <Disc f={f} at={a("p03", "the price") - 2} name="tag" x={1400} y={540} size={260}/>
    <Lab f={f} at={a("p03", "the price")} text="PRICE" x={1400} y={760} size={52} color={C.ink}/>
  </Desk>));

export const SHOTS2: Shot[] = [
  S("m01", -0.85, PU, m01card), S("m01", 0.65, WR, m01b), S("m01", "A year ago", PU, m01c), S("m01", "This quarter", H0, m01d), S("m01", "Our arithmetic", WD, m01e),
  S("m02", 0, WL, m02a), S("m02", "come to", PU, m02b), S("m02", "against four", WR, m02c), S("m02", "That is fifty", WD, m02d), S("m02", "It matches", PU, m02e),
  S("m03", 0, WL, m03a), S("m03", "Had the margin", MZ, m03b), S("m03", "about two hundred", PU, m03c), S("m03", "Our arithmetic", WR, m03d),
  S("p01", -0.85, PU, p01card), S("p01", 0.65, WL, p01b), S("p01", "Slide twenty four", PU, p01c), S("p01", "April to June", WD, p01d), S("p01", "July to September", WL, p01e), S("p01", "The slide does not", PU, p01f),
  S("p02", 0, WR, p02a), S("p02", "Twelve is seven", PU, p02b), S("p02", "So, about twelve", WL, p02c), S("p02", "The slide does not state", WD, p02d), S("p02", "And the company's own", H0, p02e),
  S("p03", 0, WR, p03a), S("p03", "45|-0.15", WD, p03b), S("p03", "43|-0.15", PUSH(-80, 0), p03c), S("p03", "The slide's reason", PU, p03d), S("p03", "Slide 25", WL, p03e), S("p03", "In plain terms", PU, p03f),
];
export const CUES2: SCue[] = [
  [W("m01", -0.85), "paper", 0.6], [W("m01", "hundred rupees"), "pop", 0.5], [W("m01", "A year ago"), "paper", 0.4], [W("m01", "forty three"), "ding", 0.5], [W("m01", "forty rupees"), "stamp", 0.5], [W("m01", "Our arithmetic"), "stamp", 0.6],
  [W("m02", "Materials consumed"), "highlighter", 0.4], [W("m02", "plus goods"), "highlighter", 0.3], [W("m02", "adjusted"), "highlighter", 0.3], [W("m02", "five thousand"), "ding", 0.5], [W("m02", "one hundred"), "ding", 0.4],
  [W("m02", "fifty nine"), "ding", 0.4], [W("m02", "fifty six"), "pop", 0.4], [W("m02", "matches"), "stamp", 0.6],
  [W("m03", 0), "whoosh", 0.5], [W("m03", "Sales rose"), "ding", 0.4], [W("m03", "Had the margin"), "paper", 0.4], [W("m03", "two hundred"), "ding", 0.5], [W("m03", "Our arithmetic"), "paper", 0.5],
  [W("p01", -0.85), "paper", 0.6], [W("p01", "Yes"), "pop", 0.5], [W("p01", "Slide twenty four"), "paper", 0.5], [W("p01", "twenty five"), "highlighter", 0.4], [W("p01", "seven"), "highlighter", 0.3],
  [W("p01", "July to September"), "whoosh", 0.4], [W("p01", "three"), "highlighter", 0.3], [W("p01", "about five"), "highlighter", 0.3], [W("p01", "measured"), "stamp", 0.6],
  [W("p02", 0), "paper", 0.5], [W("p02", "twelve"), "highlighter", 0.4], [W("p02", "seven plus"), "ding", 0.5], [W("p02", "across"), "pop", 0.4], [W("p02", "state the base"), "stamp", 0.6], [W("p02", "is partially"), "circle", 0.5],
  [W("p03", "quarter by"), "paper", 0.4], [W("p03", "45"), "pop", 0.4], [W("p03", "43"), "pop", 0.4], [W("p03", "40"), "ding", 0.5], [W("p03", "higher"), "highlighter", 0.4], [W("p03", "lower price"), "highlighter", 0.4], [W("p03", "reaches"), "whoosh", 0.4],
];
void Disc;
