// marutiq2 "One vehicle" (p01-p03), "The company's reasons" (w01-w03). Figures: contentengine/drafts/2026-10-27/_video/script.md (reviewed). Standalone.
import React from "react";
import {SCue} from "./A01V4Cold";
import {Shot, Stamp} from "./A01V4Parts";
import {MChapterQ as ChapterQ} from "./MarutiMore";
import {StickerLabel} from "./Collage";
import {C} from "./tokens";
import {H0, PU, S, W, WD, WL, WR} from "./MarutiCue";
import {Bars, Big, Black, DECK, Desk, Disc, Head, Lab, RELEASE, RESULTS, RowsCard, Rs, XI} from "./MarutiPieces";
import {CoinGrid, PriceTag, QuoteCard, mk} from "./MarutiKit";
import {ARITH, CONV, NOT} from "./MarutiS1";

const REL = RELEASE();
const AVG = "Average of all sales and models · exports and other makers included";

// ---- p01 what it got for each vehicle
const p01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={3} q="One vehicle" icon="tag"/>);
const p01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]} chip="Our question">
    <Disc f={f} at={0} name="car" x={960} y={470} size={290}/>
    <PriceTag f={f} at={a("p01", "fall") - 6} x={520} y={-10} text="PRICE?" size={110} q={a("p01", "fall")}/>
    <PriceTag f={f} at={a("p01", "cost rise") - 6} x={1400} y={-10} text="COST?" size={110} q={a("p01", "cost rise")}/>
    <Head f={f} at={a("p01", "fall") + 6} text="PRICE OR COST?" x={960} y={900} size={80}/>
  </Desk>));
const p01c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={ARITH} chip2={AVG}>
    <RowsCard f={f} head="Net sales over every vehicle sold · Jul–Sep 2026" rows={[
      {l: "NET SALES (₹ MILLION)", v: "506,155"}, {l: "÷ VEHICLES SOLD", v: "696,654", hl: a("p01", "divide by") }, {l: "= PER VEHICLE", v: "₹7.27 LAKH", hl: a("p01", "come to")}]} w={1560} y={520}/>
  </Desk>));
const p01d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={ARITH} chip2="Net sales ÷ vehicles sold · both quarters restated for the merger">
    <PriceTag f={f} at={0} x={620} y={30} text="₹7.27 LAKH" size={100} string={150}/>
    <Lab f={f} at={8} text="now" x={620} y={600} size={36}/>
    <PriceTag f={f} at={a("p01", "against seven") - 6} x={1320} y={30} text="₹7.29 LAKH" size={100} string={140}/>
    <Lab f={f} at={a("p01", "against seven") + 4} text="a year ago" x={1320} y={590} size={36}/>
  </Desk>));
const p01e = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={ARITH} chip2={AVG}>
    <Big f={f} at={a("p01", "Down point") - 2} text="−0.3%" x={960} y={420} size={280} color={C.ink} rot={-3}/>
    <Stamp f={f} at={a("p01", "Our arithmetic, and") + 2} text="ONLY AN AVERAGE" x={960} y={760} size={96} rot={-4}/>
    <Lab f={f} at={a("p01", "with no split") + 4} text="no split for parts" x={960} y={900} size={34}/>
  </Desk>));

// ---- p02 material cost per vehicle
const p02a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={ARITH} chip2="Material cost ÷ vehicles sold">
    <Head f={f} at={2} text="MATERIAL COST PER VEHICLE" x={960} y={900} size={64}/>
    <PriceTag f={f} at={a("p02", "about five") - 4} x={620} y={30} text="₹5.80 LAKH" size={100} string={230}/>
    <Lab f={f} at={a("p02", "about five") + 6} text="now" x={620} y={700} size={36}/>
    <PriceTag f={f} at={a("p02", "against five") - 6} x={1320} y={30} text="₹5.52 LAKH" size={100} string={110}/>
    <Lab f={f} at={a("p02", "against five") + 4} text="a year ago" x={1320} y={560} size={36}/>
  </Desk>));
const p02b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={ARITH}>
    <Big f={f} at={a("p02", "Up five") - 2} text="+5.2%" x={960} y={470} size={320} color={C.markerRed} rot={-3}/>
    <Lab f={f} at={a("p02", "Up five") + 10} text="material cost per vehicle" x={960} y={700} size={40}/>
  </Desk>));
const p02c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={ARITH} chip2="About ₹28,600 · on average, not any one model">
    <Disc f={f} at={0} name="car" x={500} y={470} size={260}/>
    <Big f={f} at={a("p02", "twenty eight") - 4} text="+₹28,600" x={1230} y={440} size={160} color={C.ink} rot={-3}/>
    <Lab f={f} at={a("p02", "twenty eight") + 10} text="more on every vehicle" x={1230} y={600} size={34}/>
  </Desk>));

// ---- p03 the size of the gap
const p03a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={ARITH} chip2="₹100 of sales · material cost now against a year ago">
    <CoinGrid f={f} at={0} ink={75.7} inkAt={-30} red={4.2} redAt={4} x={540} y={540} instant/>
    <Lab f={f} at={a("p03", "stayed where") - 2} text="IF THE SHARE" x={1380} y={450} size={44}/>
    <Lab f={f} at={a("p03", "stayed where") + 4} text="HAD NOT MOVED" x={1380} y={520} size={44}/>
  </Desk>));
const p03b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={ARITH} chip2={CONV + " · an illustration of scale, not a company figure"}>
    <Rs f={f} at={a("p03", "about two") - 4} v={2100} x={960} y={450} size={240} pre="≈ ₹"/>
    <Lab f={f} at={a("p03", "about two") + 14} text="less material cost (our arithmetic)" x={960} y={640} size={40}/>
  </Desk>));
const p03c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={ARITH} chip2="4.2% × ₹50,615.5 crore ≈ ₹2,126 crore · exact shares ≈ ₹2,098 crore">
    <Disc f={f} at={0} name="magnifier" x={960} y={400} size={280}/>
    <Head f={f} at={a("p03", "size of the gap") + 2} text="THE GAP WE CHASE" x={960} y={800} size={86}/>
  </Desk>));

// ---- w01 the company's reasons
const w01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={4} q="The company's reasons" icon="stamp"/>);
const w01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]} chip="Our question" chip2={DECK("7")}>
    <Disc f={f} at={0} name="menu" x={960} y={450} size={290}/>
    <Head f={f} at={a("w01", "reasons") + 2} text="THE COMPANY'S REASONS" x={960} y={850} size={80}/>
  </Desk>));
const NEG = ["Adverse commodity prices in the context of West Asia conflict", "Adverse foreign exchange movement", "Lower non-operating income due to mark-to-market losses on invested surplus"];
const w01c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={DECK("7")} chip2="Key reasons for margin movement">
    <QuoteCard f={f} head="Investor presentation · slide 7 · Negative factors" lines={["◼ " + NEG[0], "◼ " + NEG[1], "◼ " + NEG[2]]} w={1700} size={38}/>
  </Desk>));
const w01d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={DECK("7")} chip2="Negative factor 1 of 3 · the company's wording">
    <QuoteCard f={f} head="Slide 7 · negative factor 1 of 3" lines={[NEG[0]]} hl={[[NEG[0], a("w01", "adverse commodity") - 2]]} w={1600} size={56}/>
  </Desk>));
const w01e = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={DECK("7")} chip2="Negative factor 2 of 3">
    <QuoteCard f={f} head="Slide 7 · negative factor 2 of 3" lines={[NEG[1]]} hl={[[NEG[1], a("w01", "adverse foreign") - 2]]} w={1500} size={60}/>
  </Desk>));
const w01f = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={DECK("7")} chip2="Negative factor 3 of 3 · spoken in our words">
    <QuoteCard f={f} head="Slide 7 · negative factor 3 of 3" lines={["Lower non-operating income due to", "mark-to-market losses on invested surplus"]} hl={[["mark-to-market losses on invested surplus", a("w01", "lower non") - 2]]} w={1600} size={56}/>
  </Desk>));

// ---- w02 three positives, no sizes
const w02a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={DECK("7")} chip2="Positive factors">
    <QuoteCard f={f} head="Investor presentation · slide 7 · Positive factors" lines={["◼ Improved realization", "◼ Favourable operating leverage", "◼ Cost reduction efforts"]}
      hl={[["Improved realization", a("w02", "Improved") - 2], ["Favourable operating leverage", a("w02", "Favourable") - 2], ["Cost reduction efforts", a("w02", "Cost reduction") - 2]]} w={1560} size={56}/>
  </Desk>));
const w02b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={DECK("7")} chip2={NOT}>
    {["COMMODITIES ?", "EXCHANGE RATES ?", "INVESTED CASH ?", "REALIZATION ?", "OPERATING LEVERAGE ?", "COST CUTTING ?"].map((t, i) => (
      <StickerLabel key={i} f={f} text={t} x={650 + (i % 2) * 640} y={250 + Math.floor(i / 2) * 200} size={44} rot={(i % 2 ? 1 : -1) * 2} dark={i < 3}
        enter={{at: a("w02", "gives no size") - 6 + i * 3, mode: "drop"}}/>))}
    <Stamp f={f} at={a("w02", "any of the six") - 2} text="NO SIZES GIVEN" x={960} y={850} size={110} rot={-4}/>
  </Desk>));

// ---- w03 the release on operating profit
const w03a = mk((f, a, d) => (
  <Black f={f} d={d} chip={REL} chip2={CONV + " · EBIT = operating profit, company-defined"}>
    <Bars f={f} title="Operating profit (EBIT)" source="₹ crore · Jul–Sep" max={4200} box={{x: 560, y: 300, w: 800, h: 560}} bw={260}
      bars={[{label: "A YEAR AGO", v: 3382.0, txt: "3,382", at: 0}, {label: "NOW", v: 2803.7, txt: "2,804", at: a("w03", "more direct") + 2, key: true}]}/>
  </Black>));
const w03b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={REL} chip2="The company's explanation, in its own words">
    <QuoteCard f={f} head="Press release · Q2 FY27" lines={["The Operating Profit (EBIT) in the quarter stood at INR 28,037", "million as compared to INR 33,820 million in Q2 FY25-26", "owing to West-Asia conflict linked commodity increases."]}
      hl={[["owing to West-Asia conflict linked commodity increases.", a("w03", "owing to") - 2]]} w={1700} size={42}/>
  </Desk>));
const w03c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={REL} chip2={NOT}>
    <Disc f={f} at={a("w03", "which commodities") - 4} name="jar" x={480} y={450} size={250}/>
    <Disc f={f} at={a("w03", "which commodities") + 2} name="box" x={960} y={450} size={250}/>
    <Disc f={f} at={a("w03", "which commodities") + 8} name="steel" x={1440} y={450} size={250}/>
    <Big f={f} at={a("w03", "how much") - 6} text="?" x={960} y={450} size={420} color={C.markerRed} rot={8}/>
    <Stamp f={f} at={a("w03", "does not say") + 2} text="NOT STATED" x={960} y={830} size={110} rot={-4}/>
  </Desk>));

export const SHOTS2: Shot[] = [
  S("p01", -0.85, PU, p01card), S("p01", 0.65, WL, p01b), S("p01", "But we can", PU, p01c), S("p01", "come to", WR, p01d), S("p01", "Down point", WD, p01e),
  S("p02", 0, WL, p02a), S("p02", "Up five", H0, p02b), S("p02", "That is about", PU, p02c),
  S("p03", 0, WD, p03a), S("p03", "that cost", PU, p03b), S("p03", "That is the size", WR, p03c),
  S("w01", -0.85, PU, w01card), S("w01", 0.65, WL, w01b), S("w01", "Slide seven", PU, w01c), S("w01", "One, quote", WR, w01d), S("w01", "Two, adverse", WD, w01e), S("w01", "Three, lower", WL, w01f),
  S("w02", 0, PU, w02a), S("w02", "Slide seven gives", WD, w02b),
  S("w03", 0, WL, w03a), S("w03", "It says it", PU, w03b), S("w03", "which commodities", WR, w03c),
];
void XI; void RESULTS;
export const CUES2: SCue[] = [
  [W("p01", -0.85), "paper", 0.6], [W("p01", "Did what"), "pop", 0.5], [W("p01", "But we can"), "paper", 0.5], [W("p01", "come to"), "ding", 0.5], [W("p01", "against seven"), "ding", 0.4], [W("p01", "Down point"), "stamp", 0.5],
  [W("p02", "five point eight"), "ding", 0.5], [W("p02", "Up five"), "stamp", 0.6], [W("p02", "twenty eight"), "ding", 0.5],
  [W("p03", "about two"), "ding", 0.6], [W("p03", "That is the size"), "pop", 0.5],
  [W("w01", -0.85), "paper", 0.6], [W("w01", "Slide seven"), "paper", 0.5], [W("w01", "adverse commodity"), "highlighter", 0.4], [W("w01", "adverse foreign"), "highlighter", 0.4], [W("w01", "lower non"), "highlighter", 0.4],
  [W("w02", "Improved"), "highlighter", 0.4], [W("w02", "Favourable"), "highlighter", 0.4], [W("w02", "Cost reduction"), "highlighter", 0.4], [W("w02", "any of the six"), "stamp", 0.7],
  [W("w03", 0), "whoosh", 0.5], [W("w03", "owing to"), "highlighter", 0.5], [W("w03", "or how much"), "stamp", 0.7],
];
