// asianpaintsq2 b03-b04 (the company points the other way; what the filings do not say), "Back to the tin" (e01) and the next test (e02).
// Figures: script.md ledger rows 31-34 and the callbacks to rows 2, 13, 18.
import React from "react";
import {SCue} from "./A01V4Cold";
import {Shot, Stamp, StickyNote} from "./A01V4Parts";
import {MChapterQ as ChapterQ, MWords as Words} from "./AsianPaintsMore";
import {C} from "./tokens";
import {H0, PU, PUSH, S, W, WD, WL, WR, MZ} from "./AsianPaintsCue";
import {Big, CALLN, DECK, DECOR, Desk, Disc, Head, Lab, RELEASE, RowsCard, STANDALONE} from "./AsianPaintsPieces";
import {CalStrip, CoinGrid, QuoteCard, Ruler, SansBig, mk} from "./AsianPaintsKit";
import {PaintTin} from "./AsianPaintsProps";
import {ARITH, NOT, NOTE, OURREAD, TAG} from "./AsianPaintsS1";

const ST = STANDALONE;
// ---- b03 the company points the other way
const b03a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RELEASE("2")}>
    <PaintTin f={f} at={0} x={760} y={470} enter={false} tag={TAG} tagAt={-20}/>
    <Head f={f} at={a("b03", "other way") - 3} text="THE OTHER WAY" x={960} y={820} size={80}/>
  </Desk>));
const QUOTE2 = "“With inflationary pressures showing little sign of easing, we are implementing a further round of staggered price increases in the coatings business.”";
const b03b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RELEASE("2")} chip2="Amit Syngle, MD & CEO">
    <QuoteCard f={f} head="Press release · p.2 · Amit Syngle, MD & CEO" lines={[QUOTE2]} hl={[["little sign of easing,", a("b03", "little") - 3]]} w={1520} size={58} y={500}/>
  </Desk>));
const b03c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RELEASE("2")} chip2="Staggered price increases · coatings business">
    <PaintTin f={f} at={0} x={960} y={470} enter={false} tag2="ANOTHER ROUND ▲" tag2At={a("b03", "further") - 3}/>
    <Head f={f} at={a("b03", "staggered") - 2} text="NOT OVER YET" x={960} y={820} size={80}/>
  </Desk>));
const b03d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("28")} chip2="Outlook slide">
    <QuoteCard f={f} head="Deck · slide 28 · outlook" lines={["… competitive intensity remains elevated …"]} hl={[["competitive intensity remains elevated", a("b03", "competitive") - 3]]} w={1460} size={76} y={500}/>
  </Desk>));
// ---- b04 what the filings do not say
const ROWS4 = (a: (k: string, x?: number | string) => number) => [
  {l: "MARKET SHARE", v: "—", hl: a("b04", "market share") - 3}, {l: "COMPETITOR NAMED", v: "—", hl: a("b04", "competitor") - 3}, {l: "PASS-THROUGH vs RIVALS", v: "—", hl: a("b04", "links") - 3}];
const b04a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={NOT} chip2="Searched: deck, results, release, call notice">
    <RowsCard f={f} head="What the filings do not say" rows={ROWS4(a)} w={1400} y={500}/>
  </Desk>));
const b04b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={NOT} chip2="Searched: deck, results, release, call notice">
    <RowsCard f={f} head="What the filings do not say" rows={ROWS4(a)} w={1400} y={420}/>
    <Stamp f={f} at={a("b04", "rivals") - 6} text="NOT IN THE FILINGS" x={1180} y={800} size={86} rot={-4}/>
  </Desk>));
const b04c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={CALLN} chip2="Transcript not yet filed">
    <QuoteCard f={f} head="Call notice · 29 Oct 2026" lines={["The transcript of the Investor Conference will be uploaded"]} hl={[["will be uploaded", a("b04", "will be") - 3]]} w={1500} size={70} y={500}/>
  </Desk>));
// ---- e01 back to the tin
const e01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={6} q="Back to the tin" icon="tin"/>);
const e01b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("14")} chip2={DECOR}>
    <PaintTin f={f} at={0} x={760} y={500} tag={TAG} tagAt={a("e01", "Volume") - 3}/>
    <StickyNote f={f} at={-20} text={NOTE} x={1560} y={220}/>
  </Desk>));
const e01c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARITH} chip2={ST + " · Jul–Sep 2026"}>
    <CoinGrid f={f} at={-20} ink={40.3} inkAt={-60} red={3.4} redAt={a("e01", "left after") - 4} x={560} y={540} instant/>
    <SansBig f={f} at={a("e01", "forty rupees") - 3} text="₹40.30" x={1360} y={440} size={170} color={C.ink}/>
    <Lab f={f} at={a("e01", "left after") - 2} text="left after materials" x={1360} y={600} size={46}/>
  </Desk>));
const e01d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARITH} chip2="Of every ₹100 of sales · standalone">
    <SansBig f={f} at={3} text="₹43.70 → ₹40.30" x={960} y={440} size={160} color={C.ink}/>
    <Lab f={f} at={a("e01", "our arithmetic") - 2} text="a year ago → now" x={960} y={620} size={50}/>
  </Desk>));
const e01e = mk((f, a, d) => (
  <Desk f={f} d={d} chip={OURREAD}>
    <StickyNote f={f} at={-20} text={NOTE} x={1560} y={220}/>
    <Disc f={f} at={2} name="crowd" x={960} y={330} size={260}/>
    <Lab f={f} at={a("e01", "buyers") - 2} text="buyers kept buying" x={960} y={540} size={52} color={C.ink}/>
    <Stamp f={f} at={a("e01", "passed") - 3} text="VOLUME TEST: PASSED" x={960} y={760} size={84} rot={-4} color="#2E8B57"/>
  </Desk>));
const e01f = mk((f, a, d) => (
  <Desk f={f} d={d} chip={OURREAD} chip2={DECK("24") + " · “partially”"}>
    <StickyNote f={f} at={2} text="VOLUME: YES · PRICE: PARTLY" x={1560} y={220}/>
    <Stamp f={f} at={-30} text="VOLUME: PASSED" x={760} y={420} size={86} rot={-4} color="#2E8B57"/>
    <Stamp f={f} at={a("e01", "partly") - 3} text="PRICE: PARTLY" x={960} y={680} size={96} rot={3}/>
  </Desk>));
const e01g = mk((f, a, d) => <Words f={f} d={d} text="Its own word: partially." at={1} mark={["partially."]} markAt={a("e01", "partially") + 2} size={130} chip={DECK("24")}/>);
// ---- e02 the next test, end card on the tin
const e02a = mk((f, a, d) => (
  <Desk f={f} d={d} chip="Next filing" chip2="The October–December 2026 quarter">
    <CalStrip f={f} at={0} months={["OCT", "NOV", "DEC"]} from={0} to={3} arrowAt={6} label="NEXT: DECEMBER QUARTER"/>
  </Desk>));
const e02b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("25") + " · " + ST} chip2="Gross margin, Jul–Sep 2026">
    <Ruler f={f} at={0} lo={38} hi={46} step={1} from={40.3} to={40.3} moveAt={0} label="GROSS MARGIN, % · STANDALONE" qAt={a("e02", "forty point") + 2} y={600}/>
  </Desk>));
const e02c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("14")} chip2={DECOR}>
    <PaintTin f={f} at={0} x={760} y={500} enter={false} tag={TAG} tagAt={-30}/>
    <Big f={f} at={a("e02", "keep growing") - 2} text="?" x={1480} y={560} size={300} color={C.markerRed} rot={8}/>
  </Desk>));

export const SHOTS4: Shot[] = [
  S("b03", 0, WL, b03a), S("b03", "Amit", PU, b03b), S("b03", "we are implementing", WR, b03c), S("b03", "And its outlook", PU, b03d),
  S("b04", 0, WD, b04a), S("b04", "Nothing that links", PUSH(0, -60), b04b), S("b04", "And the call", WL, b04c),
  S("e01", -0.85, PU, e01card), S("e01", 0.65, MZ, e01b), S("e01", "Of every hundred", WR, e01c), S("e01", "down from", PU, e01d), S("e01", "Our reading", WD, e01e), S("e01", "The price test", PU, e01f), S("e01", "In the company's own", H0, e01g),
  S("e02", 0, PU, e02a), S("e02", "Where does", WL, e02b), S("e02", "And does volume", MZ, e02c),
];
export const CUES4: SCue[] = [
  [W("b03", 0), "whoosh", 0.5], [W("b03", "other way"), "pop", 0.4], [W("b03", "Amit"), "paper", 0.5], [W("b03", "little"), "highlighter", 0.4], [W("b03", "further"), "pop", 0.5], [W("b03", "competitive"), "highlighter", 0.4],
  [W("b04", 0), "paper", 0.5], [W("b04", "market share"), "highlighter", 0.3], [W("b04", "competitor"), "highlighter", 0.3], [W("b04", "links"), "highlighter", 0.3], [W("b04", "rivals"), "stamp", 0.7], [W("b04", "will be"), "highlighter", 0.4],
  [W("e01", -0.85), "paper", 0.7], [W("e01", "Volume"), "pop", 0.5], [W("e01", "forty rupees"), "ding", 0.5], [W("e01", "down from"), "paper", 0.4], [W("e01", "passed"), "stamp", 0.6], [W("e01", "partly"), "stamp", 0.6], [W("e01", "partially"), "circle", 0.5],
  [W("e02", 0), "paper", 0.5], [W("e02", "Where does"), "whoosh", 0.4], [W("e02", "forty point"), "pop", 0.5], [W("e02", "And does volume"), "paper", 0.4],
];
