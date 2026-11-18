// asianpaintsq2 cold open (c01-c04) and "The buyers" (v01-v03). Figures: contentengine/drafts/2026-10-29/_video/script.md (reviewed, ledger rows 1-11).
import React from "react";
import {SCue} from "./A01V4Cold";
import {Shot, Stamp, StickyNote} from "./A01V4Parts";
import {MChapterQ as ChapterQ, MWords as Words} from "./AsianPaintsMore";
import {C} from "./tokens";
import {H0, PU, PUSH, S, W, WD, WL, WR, MZ} from "./AsianPaintsCue";
import {Bars, Big, Black, DECK, DECOR, Desk, Disc, Head, Lab, RELEASE, STANDALONE} from "./AsianPaintsPieces";
import {CalStrip, QuoteCard, Ruler, SansBig, mk} from "./AsianPaintsKit";
import {NameSticker, PaintTin, SwatchPair, TinRow} from "./AsianPaintsProps";
import {Receipt} from "./AsianPaintsPieces";

export const ARITH = "Our arithmetic";
export const NOT = "Not in the filings";
export const OURREAD = "Our reading";
export const PLAIN = "Plain definition";
export const NOBASE = "No base stated";
export const TAG = "+6.4% VOLUME";
export const NOTE = "PRICE POWER OR REACH?";

// ---- c01 the tin, the question
const c01a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("14")} chip2={DECOR + " · Jul–Sep 2026"}>
    <PaintTin f={f} at={0} x={760} y={520} tag={TAG} tagAt={a("c01", "sold") - 2}/>
    <Head f={f} at={a("c01", "thinner") - 2} text="THINNER MARGIN. HOW?" x={960} y={820} size={72}/>
  </Desk>));
const c01b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("14")} chip2={DECOR}>
    <TinRow f={f} at={2} n={7} x={960} y={300} per={3}/>
    <Big f={f} at={a("c01", "six point") - 3} text="+6.4%" x={960} y={640} size={230} color={C.ink} rot={-2}/>
    <Lab f={f} at={a("c01", "six point") + 6} text="volume · July to September" x={960} y={810} size={46}/>
  </Desk>));
const c01c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("14")} chip2="The slide's own title">
    <QuoteCard f={f} head="Deck · slide 14 · title" lines={["Resilient Volume Growth Despite Steep Price Hikes and Festive Season Timing"]} hl={[["Resilient", a("c01", "resilient") - 4]]} w={1500} size={62} y={500}/>
  </Desk>));
// ---- c02 standalone gross margin
const c02a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={PLAIN} chip2="Standalone = the company without its subsidiaries">
    <Disc f={f} at={2} name="factory" x={960} y={400} size={280}/>
    <Head f={f} at={a("c02", "on its own") - 2} text="ON ITS OWN" x={960} y={700} size={84}/>
  </Desk>));
const c02b = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("25") + " · " + STANDALONE} chip2="Gross margin · Jul–Sep, a year apart">
    <Ruler f={f} at={0} lo={38} hi={46} step={1} from={43.7} to={40.3} moveAt={a("c02", "to forty") - 2} label="GROSS MARGIN, % · STANDALONE" dark y={600}
      ghost={{v: 43.7, label: "A YEAR AGO", at: a("c02", "to forty") + 8}}/>
  </Black>));
const c02c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("25")} chip2={STANDALONE}>
    <Big f={f} at={3} text="−339 bps" x={960} y={450} size={240} color={C.markerRed} rot={-3}/>
    <Head f={f} at={a("c02", "basis points") + 2} text="THE MARGIN FELL" x={960} y={720} size={80}/>
  </Desk>));
const c02d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={PLAIN}>
    <Big f={f} at={2} text="1 basis point" x={960} y={380} size={150} color={C.ink} rot={-2}/>
    <Big f={f} at={a("c02", "hundredth") - 4} text="= 0.01 point" x={960} y={600} size={150} color={C.markerRed} rot={-2}/>
  </Desk>));
// ---- c03 which part of a moat
const c03a = mk((f, a, d) => <Words f={f} d={d} text="Which moat showed up?" at={1} mark={["moat"]} markAt={a("c03", "moat") + 2} size={140}/>);
const c03b = mk((f, a, d) => (
  <Desk f={f} d={d} chip="Our question">
    <Disc f={f} at={2} name="tag" x={560} y={430} size={300}/>
    <Lab f={f} at={a("c03", "power") + 2} text="PRICE POWER" x={560} y={680} size={56} color={C.ink}/>
    <Lab f={f} at={a("c03", "keep the") - 2} text="raise prices, keep margin" x={560} y={770} size={46}/>
  </Desk>));
const c03c = mk((f, a, d) => (
  <Desk f={f} d={d} chip="Our question">
    <Disc f={f} at={-20} name="tag" x={560} y={430} size={300} dim={0.6}/>
    <Lab f={f} at={-20} text="PRICE POWER" x={560} y={680} size={56}/>
    <Disc f={f} at={2} name="store" x={1360} y={430} size={300}/>
    <Lab f={f} at={a("c03", "reach") + 2} text="REACH" x={1360} y={680} size={56} color={C.ink}/>
    <StickyNote f={f} at={a("c03", "even after")} text={NOTE} x={1560} y={220}/>
  </Desk>));
// ---- c04 the CEO's own words
const c04a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RELEASE("1")} chip2="Text only · no photo">
    <NameSticker f={f} at={2} name="AMIT SYNGLE" role="MANAGING DIRECTOR & CEO" x={960} y={460}/>
    <StickyNote f={f} at={-20} text={NOTE} x={1560} y={220}/>
  </Desk>));
const QUOTE1 = "“We calibrated price increases and absorbed part of the cost inflation to protect consumer demand in this challenging environment.”";
const c04b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RELEASE("1")} chip2="Amit Syngle, MD & CEO">
    <QuoteCard f={f} head="Press release · p.1 · Amit Syngle, MD & CEO" lines={[QUOTE1]} hl={[["calibrated price increases", a("c04", "calibrated") - 3]]} w={1520} size={58} y={500}/>
  </Desk>));
const c04c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={RELEASE("1")} chip2="Amit Syngle, MD & CEO">
    <QuoteCard f={f} head="Press release · p.1" lines={["“… absorbed part of the cost inflation to protect consumer demand …”"]}
      hl={[["absorbed part of the cost inflation", -10], ["to protect consumer demand", a("c04", "protect") - 3]]} w={1460} size={66} y={420}/>
    <Head f={f} at={a("c04", "challenging") - 6} text="HIS OWN WORDS" x={960} y={800} size={72}/>
  </Desk>));

// ---- v01 the buyers
const v01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={1} q="The buyers" icon="crowd"/>);
const v01b = mk((f, a, d) => (
  <Desk f={f} d={d} chip="Our question">
    <PaintTin f={f} at={0} x={760} y={480} tag={TAG} tagAt={4} enter={false}/>
    <Head f={f} at={a("v01", "Did they") - 2} text="DID BUYERS STAY?" x={960} y={820} size={80}/>
  </Desk>));
const v01c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("14")} chip2="The company's chart">
    <Stamp f={f} at={a("v01", "says yes") + 2} text="YES" x={960} y={480} size={240} rot={-6} color="#2E8B57"/>
  </Desk>));
const v01d = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("14")} chip2={DECOR + " · volume growth"}>
    <Bars f={f} title="Volume growth" source="Decorative Business (India) · % on a year earlier" max={11} box={{x: 560, y: 320, w: 800, h: 520}} bw={260}
      bars={[{label: "APR–JUN", v: 9.0, txt: "9.0%", at: a("v01", "after nine") - 2}, {label: "JUL–SEP", v: 6.4, txt: "6.4%", at: a("v01", "six point") - 2, key: true}]}/>
  </Black>));
const v01e = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("14")} chip2="The slide's own title">
    <QuoteCard f={f} head="Deck · slide 14 · title" lines={["Resilient Volume Growth Despite Steep Price Hikes and Festive Season Timing"]}
      hl={[["Despite Steep Price Hikes", a("v01", "despite") - 3]]} w={1500} size={62} y={500}/>
  </Desk>));
// ---- v02 value against volume
const v02a = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("15")} chip2={DECOR + " · Jul–Sep 2026"}>
    <Bars f={f} title="This year" source="Growth on a year earlier, %" max={16} box={{x: 560, y: 320, w: 800, h: 520}} bw={260}
      bars={[{label: "VOLUME", v: 6.4, txt: "6.4%", at: 0}, {label: "VALUE", v: 14.5, txt: "14.5%", at: a("v02", "fourteen") - 3, key: true}]}/>
  </Black>));
const v02b = mk((f, a, d) => <Words f={f} d={d} text="The other way round." at={1} mark={["round."]} markAt={a("v02", "other way") + 2} size={120} chip={DECK("15")}/>);
const v02c = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("15")} chip2={DECOR + " · Jul–Sep 2025"}>
    <Bars f={f} title="A year ago" source="Growth on a year earlier, %" max={16} box={{x: 560, y: 320, w: 800, h: 520}} bw={260}
      bars={[{label: "VOLUME", v: 10.9, txt: "10.9%", at: a("v02", "ten point") - 3, key: true}, {label: "VALUE", v: 6.0, txt: "6.0%", at: a("v02", "value only") - 2}]}/>
  </Black>));
const v02d = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARITH} chip2="Value growth ÷ volume growth · Jul–Sep 2026">
    <Receipt f={f} x={960} y={60} w={760} head="OUR ARITHMETIC" lines={[
      {l: "VALUE  +14.5%", r: "1.145", at: 4}, {l: "÷ VOLUME  +6.4%", r: "1.064", at: a("v02", "by volume") - 2},
      {l: "= PRICE AND MIX", r: "1.076", at: a("v02", "leaves") - 2, big: true}]}/>
  </Desk>));
const v02e = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARITH} chip2="The filings do not split price from mix">
    <Big f={f} at={a("v02", "seven point") - 3} text="≈ 7.6%" x={600} y={450} size={210} color={C.ink} rot={-3}/>
    <Lab f={f} at={a("v02", "for price") - 2} text="price + mix, together" x={600} y={640} size={46}/>
    <SwatchPair f={f} at={a("v02", "product mix") - 4} x={1380} y={500}/>
  </Desk>));
const v02f = mk((f, a, d) => (
  <Desk f={f} d={d} chip={ARITH}>
    <Stamp f={f} at={a("v02", "Our arithmetic") + 2} text="OUR ARITHMETIC" x={960} y={420} size={120} rot={-5}/>
    <Lab f={f} at={a("v02", "The filings") - 2} text="filings give no split" x={960} y={680} size={50}/>
  </Desk>));
// ---- v03 the reach
const v03a = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("17")} chip2="The company's words">
    <QuoteCard f={f} head="Deck · slide 17" lines={["Distribution footprint widened further, strengthening reach and depth across markets"]}
      hl={[["widened further,", a("v03", "widened") - 3], ["reach and depth", a("v03", "reach and") - 3]]} w={1500} size={62} y={500}/>
  </Desk>));
const v03b = mk((f, a, d) => (
  <Desk f={f} d={d} chip={DECK("17")} chip2={NOT}>
    <Disc f={f} at={2} name="store" x={420} y={400} size={240}/>
    <Disc f={f} at={a("v03", "depots") - 4} name="depot" x={960} y={400} size={240}/>
    <Disc f={f} at={a("v03", "tinting") - 4} name="gear" x={1500} y={400} size={240}/>
    <Lab f={f} at={a("v03", "dealers") - 2} text="DEALERS ?" x={420} y={640} size={50} color={C.ink}/>
    <Lab f={f} at={a("v03", "depots")} text="DEPOTS ?" x={960} y={640} size={50} color={C.ink}/>
    <Lab f={f} at={a("v03", "tinting")} text="TINTING MACHINES ?" x={1500} y={640} size={50} color={C.ink}/>
  </Desk>));
const v03c = mk((f, a, d) => (
  <Desk f={f} d={d} chip={NOT}>
    <Stamp f={f} at={a("v03", "cannot") - 4} text="NOT IN THE FILINGS" x={960} y={400} size={110} rot={-5}/>
    <Head f={f} at={a("v03", "measured") - 2} text="REACH, UNMEASURED" x={960} y={700} size={80}/>
  </Desk>));

export const SHOTS1: Shot[] = [
  S("c01", 0, H0, c01a), S("c01", "From July", WL, c01b), S("c01", "The company's own", PU, c01c),
  S("c02", 0, WD, c02a), S("c02", "the gross margin", WR, c02b), S("c02", "down three", PU, c02c), S("c02", "A basis point", WL, c02d),
  S("c03", 0, H0, c03a), S("c03", "The power", WD, c03b), S("c03", "Or the reach", MZ, c03c),
  S("c04", 0, PU, c04a), S("c04", "Quote", WL, c04b), S("c04", "to protect", PUSH(0, -60), c04c),
  S("v01", -0.85, PU, v01card), S("v01", 0.65, WR, v01b), S("v01", "The company's chart", PU, v01c), S("v01", "Decorative volume", WD, v01d), S("v01", "The slide's title", WL, v01e),
  S("v02", 0, WR, v02a), S("v02", "In the same quarter", H0, v02b), S("v02", "Volume grew ten", WL, v02c), S("v02", "This year, dividing", PU, v02d), S("v02", "seven point six", WR, v02e), S("v02", "Our arithmetic", PU, v02f),
  S("v03", 0, WD, v03a), S("v03", "It gives no", PU, v03b), S("v03", "so the reach itself", WL, v03c),
];
void SansBig; void CalStrip;
export const CUES1: SCue[] = [
  [W("c01", 0.05), "whoosh", 0.5], [W("c01", "sold"), "pop", 0.5], [W("c01", "thinner"), "highlighter", 0.4], [W("c01", "From July"), "paper", 0.5], [W("c01", "six point"), "ding", 0.5], [W("c01", "resilient"), "highlighter", 0.4],
  [W("c02", 0), "paper", 0.5], [W("c02", "the gross margin"), "whoosh", 0.5], [W("c02", "to forty"), "click", 0.5], [W("c02", "down three"), "stamp", 0.6], [W("c02", "A basis point"), "paper", 0.4],
  [W("c03", "moat"), "highlighter", 0.4], [W("c03", "The power"), "pop", 0.5], [W("c03", "Or the reach"), "pop", 0.5], [W("c03", "even after"), "paper", 0.5],
  [W("c04", 0), "paper", 0.5], [W("c04", "Quote"), "paper", 0.5], [W("c04", "calibrated"), "highlighter", 0.4], [W("c04", "protect"), "highlighter", 0.4],
  [W("v01", -0.85), "paper", 0.6], [W("v01", "Did they"), "pop", 0.4], [W("v01", "says yes"), "stamp", 0.6], [W("v01", "Decorative volume"), "whoosh", 0.4], [W("v01", "six point"), "ding", 0.5], [W("v01", "despite"), "highlighter", 0.4],
  [W("v02", 0), "whoosh", 0.4], [W("v02", "fourteen"), "ding", 0.5], [W("v02", "In the same quarter"), "paper", 0.4], [W("v02", "ten point"), "ding", 0.4], [W("v02", "This year, dividing"), "paper", 0.5],
  [W("v02", "seven point six"), "ding", 0.5], [W("v02", "Our arithmetic"), "stamp", 0.6],
  [W("v03", 0), "paper", 0.5], [W("v03", "widened"), "highlighter", 0.4], [W("v03", "It gives no"), "pop", 0.4], [W("v03", "cannot"), "stamp", 0.7],
];
