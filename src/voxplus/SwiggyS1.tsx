// swiggyq2 cold open (c01-c04) and chapter 1 "The part with a profit" (f01-f05).
// Figures: ledger rows in contentengine/drafts/2026-10-22/_video/script.md (Air, reviewed 23 Oct). Adjusted EBITDA is always chipped COMPANY'S MEASURE.
import React from "react";
import {SCue} from "./A01V4Cold";
import {ChapterQ, SP, Shot, Stamp, StickyNote, Words} from "./A01V4Parts";
import {StickerLabel} from "./Collage";
import {C, ease, inOut, useTicks} from "./tokens";
import {H0, PU, PUSH, S, W, WD, WL, WR, WU, useAt} from "./SwiggyCue";
import {Bars, Big, Black, Counter, Desk, Disc, Doc, Head, Lab, LETTER, RESULTS, Receipt, RowsCard, Rs, Squares} from "./SwiggyPieces";
import {Ledger, PriceTag, Trips} from "./SwiggyKit";

export const MEASURE = "Company's measure: adjusted EBITDA";
export const ARITH = (s: string) => `Our arithmetic: ${s}`;

// ---------------------------------------------------------------- c01: the ₹9 store
const c01a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.15, 960, 520], [d, 1.05, 960, 540]]} chip={LETTER("13")}>
      <PriceTag f={f} at={0} x={900} y={180} text="₹9 STORE" size={130} q={a("c01", "cost") - 2}/>
      <Head f={f} at={a("c01", "cost")} text="WHAT DOES ₹9 COST?" x={1340} y={880}/>
    </Desk>
  );
};
const c01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 1040, 520]]} chip={LETTER("13")} chip2="Shareholders' letter, answer 6 (quick commerce)">
      <Doc f={f} name="store9" x={960} y={520} width={1600} hl={[["INR 9 Store", a("c01", "price offers")]]} circle={[["INR 9 Store", a("c01", "price offers") + 12]]}/>
    </Desk>
  );
};
const c01c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const i = a("c01", "Instamart");
  return (
    <Desk f={f} d={d} cam={[[0, 1.05, 960, 540], [d, 1.0, 960, 540]]} chip={RESULTS("8, segment note")}>
      <PriceTag f={f} at={-30} x={640} y={160} text="₹9 STORE" size={110}/>
      <StickerLabel f={f} text="INSTAMART" x={1300} y={330} size={84} rot={-3} dark enter={{at: i, mode: "drop"}}/>
      <Disc f={f} at={i + 6} name="bag" x={1180} y={600} size={190}/>
      <Disc f={f} at={i + 10} name="scooter" x={1440} y={620} size={190}/>
      <Lab f={f} at={a("c01", "quick delivery")} text="quick delivery app" x={1310} y={790}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- c02: no price, a loss
const c02a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 500]]} chip={LETTER("13")} chip2="No price, items or cost in the filings">
      <Receipt f={f} x={960} y={130} w={820} head="INR 9 STORE" lines={[{l: "ITEMS", r: "—", at: 4}, {l: "PRICE", r: "—", at: 8}, {l: "NOT IN THE LETTER", r: "", at: a("c02", "no price"), big: true, red: true}]} rot={-2}/>
      <Head f={f} at={a("c02", "no price") + 4} text="NO PRICE GIVEN" x={1500} y={860} rot={3}/>
    </Desk>
  );
};
const c02b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.05, 960, 540], [d, 1.15, 960, 520]]} chip={LETTER("5, 8")} chip2={MEASURE}>
      <Lab f={f} at={0} text="Instamart · quarter to 30 Sep 2026" x={960} y={260} size={40}/>
      <Rs f={f} at={a("c02", "eight hundred")} v={895} sign="–" x={960} y={520} size={260} color={C.markerRed}/>
      <Lab f={f} at={a("c02", "adjusted EBITDA")} text="adjusted EBITDA · the company's own measure" x={960} y={730} size={34}/>
    </Desk>
  );
};
const c02c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("8")} chip2={MEASURE}>
      <Bars f={f} title="Instamart, adjusted EBITDA" source="Letter p.8 · ₹ crore" max={60} min={-1000} box={{x: 560, y: 260, w: 800, h: 560}}
        bars={[{label: "APR–JUN", v: -778, txt: "–₹778 cr", at: 0}, {label: "JUL–SEP", v: -895, txt: "–₹895 cr", at: 4, key: true}]}/>
      <Lab f={f} at={a("c02", "seven hundred") + 6} text="+₹118 cr more loss" x={1600} y={700} size={40} color="#FF8FA8"/>
    </Black>
  );
};
// ---------------------------------------------------------------- c03: the other half
const c03a: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="Now the other half." at={1} mark={["half."]} markAt={8} size={150}/>;
};
const c03b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 0.98, 960, 540], [d, 1.06, 760, 520]]} chip={LETTER("8, 11")} chip2={MEASURE}>
      <Ledger f={f} enterAt={0} cols={[{name: "FOOD", val: "+₹341 cr", sub: "a record · adjusted EBITDA", at: a("c03", "a record")},
        {name: "INSTAMART", val: "–₹895 cr", sub: "adjusted EBITDA", red: true, at: 2}]}/>
      <Head f={f} at={a("c03", "three hundred") + 8} text="SAME QUARTER" x={960} y={930}/>
    </Desk>
  );
};
const c03c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.16, 900, 520]]} chip={LETTER("14")} chip2="Answer 7: quick commerce">
      <Doc f={f} name="chose" x={960} y={500} width={1620} hl={[["we chose", a("c03", "we chose")], ["to calibrate near-term investments to accelerate growth", a("c03", "calibrate")]]}/>
      <StickerLabel f={f} text="INSTAMART" x={300} y={230} size={50} rot={-4} dark enter={{at: 2, mode: "pop"}}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- c04: the big question
const c04a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const b = a("c04", "buying");
  const items: [string, number, "crowd" | "shelf" | "box"][] = [["USERS", 520, "crowd"], ["STORES", 960, "shelf"], ["ORDERS", 1400, "box"]];
  return (
    <Desk f={f} d={d} cam={[[0, 1.06, 960, 560], [d, 1.0, 960, 540]]} chip="Our question">
      <PriceTag f={f} at={-30} x={260} y={120} text="₹9" size={90}/>
      {items.map(([t, x, ic], i) => (
        <React.Fragment key={t}>
          <Disc f={f} at={b - 6 + i * 6} name={ic} x={x} y={560} size={220}/>
          <Lab f={f} at={b - 2 + i * 6} text={t} x={x} y={740}/>
        </React.Fragment>
      ))}
      <StickyNote f={f} at={b} text="BUYING WHAT?" x={1640} y={210}/>
    </Desk>
  );
};
const c04b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const st = a("c04", "losses stop");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip="Our question">
      <StickyNote f={f} at={-30} text="BUYING WHAT?" x={1540} y={230}/>
      <Disc f={f} at={0} name="watch" x={760} y={520} size={300}/>
      <Big f={f} at={st - 4} text="?" x={1060} y={430} size={260} color={C.markerRed}/>
      <Head f={f} at={st} text="UNTIL WHEN?" x={960} y={860}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- f01: food orders
const f01card: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <ChapterQ f={f} d={d} n={1} q="The part with a profit" icon="coin"/>;
};
const f01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("f01", "ten thousand");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={LETTER("5, 11")} chip2="Gross order value (GOV): before discounts">
      <Disc f={f} at={2} name="bowl" x={420} y={500} size={260}/>
      <Lab f={f} at={4} text="FOOD DELIVERY" x={420} y={700} size={40}/>
      <Counter f={f} keys={[[0, 0], [t, 0], [t + 40, 10054]]} x={1180} y={480} size={160} pre="₹"/>
      <Lab f={f} at={t + 10} text="crore, Jul–Sep 2026" x={1180} y={640}/>
      <Lab f={f} at={a("f01", "before discounts")} text="counted before discounts" x={1180} y={700} color={C.markerRed}/>
    </Desk>
  );
};
const f01c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("5, 7")} chip2="Year-earlier bar: the letter's p.7 chart (10,054 ÷ 1.177 agrees)">
      <Bars f={f} title="Food delivery, gross order value" source="₹ crore · quarter to 30 Sep" max={11500} box={{x: 560, y: 300, w: 800, h: 560}}
        bars={[{label: "2025", v: 8542, txt: "₹8,542 cr", at: 0}, {label: "2026", v: 10054, txt: "₹10,054 cr", at: 4, key: true}]}/>
      <Big f={f} at={a("f01", "seventeen")} text="+17.7%" x={1620} y={430} size={150} color={C.highlightPrint}/>
      <Head f={f} at={a("f01", "seventeen") + 10} text="FOOD DELIVERY" x={1600} y={640} rot={3} light/>
    </Black>
  );
};
// ---------------------------------------------------------------- f02: ₹3.40 per ₹100
const f02a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("5")} chip2={MEASURE}>
      <Squares f={f} at={0} fill={3.4} x={760} y={540} cell={78} per={0.2}/>
      <Lab f={f} at={6} text="₹100 of food orders · one square = ₹1" x={760} y={980} color="#CFC9BE" size={30}/>
      <Big f={f} at={a("f02", "three rupees")} text="3.4%" x={1580} y={460} size={170} color={C.highlightPrint}/>
      <Lab f={f} at={a("f02", "three rupees") + 4} text="≈ ₹3.40 per ₹100" x={1580} y={600} color={C.white} size={40}/>
    </Black>
  );
};
const f02b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.14, 1000, 520]]} chip={LETTER("5")} chip2={MEASURE}>
      <Doc f={f} name="foodhl" x={960} y={520} width={1600} hl={[["Margin stood at 3.4% of GOV", 2], ["INR 341 Cr", 8]]}/>
    </Desk>
  );
};
const f02c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("7 (chart), 5")} chip2={MEASURE + ", % of GOV"}>
      <Bars f={f} title="Food: adjusted EBITDA per ₹100" source="Of gross order value · quarter to 30 Sep" max={4} box={{x: 560, y: 300, w: 800, h: 560}}
        bars={[{label: "2025", v: 2.8, txt: "₹2.80", at: a("f02", "two rupees") - 6}, {label: "2026", v: 3.4, txt: "₹3.40", at: 0, key: true}]}/>
      <Head f={f} at={a("f02", "two rupees")} text="₹3.40 PER ₹100" x={1600} y={300} rot={3} light/>
    </Black>
  );
};
// ---------------------------------------------------------------- f03: why it rose
const f03a: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="Why did it rise?" at={1} mark={["rise?"]} markAt={8} size={160}/>;
};
const f03b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 900, 520]]} chip={LETTER("11")} chip2="'Some of' the levers">
      <Doc f={f} name="takerate" x={960} y={500} width={1600} hl={[["Some of the margin", 2], ["accelerated the take-rate to 26.1%", a("f03", "advertising")]]}/>
    </Desk>
  );
};
const f03c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("11")} chip2="Take rate: Swiggy's cut of each food order">
      <Squares f={f} at={0} fill={26.1} x={720} y={540} cell={76} per={0.25}/>
      <Big f={f} at={a("f03", "twenty six")} text="26.1%" x={1560} y={440} size={170} color={C.highlightPrint}/>
      <Lab f={f} at={a("f03", "take rate")} text="SWIGGY'S CUT" x={1560} y={590} color={C.white} size={44}/>
      <Lab f={f} at={a("f03", "highest ever")} text="its highest ever" x={1560} y={660} color="#CFC9BE"/>
    </Black>
  );
};
// ---------------------------------------------------------------- f04: shorter trips
const f04a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 1100, 540]]} chip={LETTER("11")} chip2="Illustration">
      <Trips f={f} at={0} shortAt={a("f04", "closer together")}/>
      <Head f={f} at={a("f04", "shorter trips")} text="COSTS LESS PER TRIP" x={960} y={110} rot={-2}/>
    </Desk>
  );
};
const f04b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 1000, 520]]} chip={LETTER("11")}>
      <Doc f={f} name="bolt" x={960} y={500} width={1600} hl={[["Delivery cost efficiency through higher order", 2], ["Bolt and 99-Store", a("f04", "Bolt")],
        ["more than 25% of Food delivery volumes", a("f04", "more than")]]}/>
      <StickerLabel f={f} text="BOLT" x={420} y={820} size={60} rot={-4} dark enter={{at: a("f04", "Bolt"), mode: "drop"}}/>
      <StickerLabel f={f} text="99-STORE" x={700} y={850} size={60} rot={3} dark enter={{at: a("f04", "ninety nine"), mode: "drop"}}/>
    </Desk>
  );
};
const f04c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("11")}>
      <Squares f={f} at={0} fill={25} x={720} y={540} cell={76} per={0.2}/>
      <Big f={f} at={2} text="25%+" x={1560} y={460} size={170} color={C.highlightPrint}/>
      <Lab f={f} at={6} text="of food delivery volumes" x={1560} y={600} color={C.white} size={36}/>
    </Black>
  );
};
// ---------------------------------------------------------------- f05: the whole company
const f05a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const no = a("f05", "No");
  return (
    <Desk f={f} d={d} cam={[[0, 0.94, 960, 540], [d, 1.0, 1300, 540]]} chip={MEASURE} chip2="Group: consolidated">
      <Ledger f={f} enterAt={-30} w={1700} cols={[{name: "FOOD", val: "+₹341 cr", at: -30}, {name: "INSTAMART", val: "–₹895 cr", red: true, at: -30},
        {name: "GROUP", val: f >= no ? "LOSS" : "?", sub: f >= no ? "all businesses together" : undefined, red: f >= no, at: 4}]}/>
      <Stamp f={f} at={no} text="NO" x={1380} y={760} size={150} rot={-10}/>
    </Desk>
  );
};
const f05b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={RESULTS("5") + " · letter p.17, 23"} chip2={ARITH("7,571 ÷ 5,561 = +36.1%")}>
      <Bars f={f} title="Group revenue from operations" source="Consolidated, unaudited · ₹ crore · quarter to 30 Sep" max={8500} box={{x: 560, y: 300, w: 800, h: 560}}
        bars={[{label: "2025", v: 5561, txt: "₹5,561 cr", at: 0}, {label: "2026", v: 7571, txt: "₹7,571 cr", at: a("f05", "seven thousand") - 6, key: true}]}/>
      <Big f={f} at={a("f05", "thirty six")} text="+36%" x={1620} y={430} size={160} color={C.highlightPrint}/>
    </Black>
  );
};
const f05c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 560]]} chip={LETTER("23, Annexure A")} chip2="Consolidated results, unaudited · retyped">
      <RowsCard f={f} head="Swiggy group, consolidated, unaudited (INR crore)" y={600}
        rows={[{l: "Revenue from operations", v: "7,571"}, {l: "Total tax expense", v: "–"}, {l: "Loss for the period", v: "(922)", hl: a("f05", "nine hundred"), red: true}]}/>
    </Desk>
  );
};
const f05d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={RESULTS("5") + " · letter p.23"} chip2="Standard accounts (Ind AS), group, unaudited">
      <Bars f={f} title="Group loss for the period" source="₹ crore" max={80} min={-1250} box={{x: 460, y: 260, w: 1000, h: 560}} bw={220}
        bars={[{label: "JUL–SEP 25", v: -1092, txt: "–₹1,092", at: 0}, {label: "APR–JUN 26", v: -791, txt: "–₹791", at: a("f05", "quarter before") - 4},
          {label: "JUL–SEP 26", v: -922, txt: "–₹922", at: 2, key: true}]}/>
      <Head f={f} at={4} text="STILL IN THE RED" x={1600} y={170} rot={3} light/>
    </Black>
  );
};

export const SHOTS1: Shot[] = [
  S("c01", 0, H0, c01a), S("c01", "Swiggy's letter", WL, c01b), S("c01", "on Instamart", PU, c01c),
  S("c02", 0, PU, c02a), S("c02", "It does give", WD, c02b), S("c02", "The quarter before", WR, c02c),
  S("c03", 0, H0, c03a), S("c03", "On that measure", PU, c03b), S("c03", "On Instamart", WL, c03c),
  S("c04", 0, WU, c04a), S("c04", "and what does", PUSH(960, 540), c04b),
  S("f01", -0.85, PU, f01card), S("f01", "Food orders", WL, f01b), S("f01", "seventeen point", WD, f01c),
  S("f02", 0, PU, f02a), S("f02", "was left", WR, f02b), S("f02", "A year earlier", WD, f02c),
  S("f03", 0, H0, f03a), S("f03", "Some of", PU, f03b), S("f03", "lifted", WU, f03c),
  S("f04", 0, WL, f04a), S("f04", "The letter ties", PU, f04b), S("f04", "together more", WD, f04c),
  S("f05", 0, PU, f05a), S("f05", "Group revenue", WL, f05b), S("f05", "Yet on the standard", PU, f05c), S("f05", "less than a year", WD, f05d),
];
export const CUES1: SCue[] = [
  [W("c01", 0.05), "paper", 0.6], [W("c01", "cost"), "circle", 0.5], [W("c01", "Swiggy's letter"), "whoosh", 0.6], [W("c01", "price offers"), "highlighter", 0.5],
  [W("c01", "on Instamart"), "paper", 0.5], [W("c02", "no price"), "stamp", 0.5], [W("c02", "eight hundred"), "stamp", 0.6], [W("c02", "The quarter before"), "whoosh", 0.5],
  [W("c03", "On that measure"), "paper", 0.5], [W("c03", "a record"), "ding", 0.6], [W("c03", "we chose"), "highlighter", 0.5], [W("c04", "buying"), "pop", 0.8],
  [W("f01", -0.85), "paper", 0.6], [W("f01", "ten thousand"), "ding", 0.4], [W("f01", "seventeen point"), "whoosh", 0.5], [W("f02", "three rupees"), "ding", 0.5],
  [W("f02", "was left"), "highlighter", 0.4], [W("f03", "Some of"), "highlighter", 0.4], [W("f03", "twenty six"), "ding", 0.5], [W("f04", "Bolt"), "pop", 0.5],
  [W("f04", "ninety nine"), "pop", 0.5], [W("f05", "No"), "stamp", 0.8], [W("f05", "thirty six"), "ding", 0.4], [W("f05", "nine hundred"), "highlighter", 0.4],
];
