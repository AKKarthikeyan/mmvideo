// marutiq2 "The invested cash" (i01-i03), "But..." (b01-b03). Figures: contentengine/drafts/2026-10-27/_video/script.md (reviewed). Standalone.
import React from "react";
import {SCue} from "./A01V4Cold";
import {Shot, Stamp} from "./A01V4Parts";
import {MChapterQ as ChapterQ, MWords as Words, MRing as Ring} from "./MarutiMore";
import {StickerLabel} from "./Collage";
import {C} from "./tokens";
import {H0, PU, S, W, WD, WL, WR} from "./MarutiCue";
import {Bars, Big, Black, DECK, Desk, Disc, Head, Lab, RELEASE, RESULTS, RowsCard, Rs, XI} from "./MarutiPieces";
import {Baskets, Bridge, PriceTag, QuoteCard, Ruler, mk} from "./MarutiKit";
import {ARITH, CONV, NOT, OURREAD} from "./MarutiS1";

const REL = RELEASE();

// ---- i01 a second hole
const i01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={5} q="The invested cash" icon="coin"/>);
const i01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]} chip="Profit before tax">
    <Disc f={f} at={0} name="magnifier" x={960} y={450} size={290}/>
    <Head f={f} at={3} text="A SECOND HOLE" x={960} y={850} size={90}/>
  </Desk>));
const i01c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={DECK("5")} chip2={ARITH + " · " + CONV}>
    <RowsCard f={f} head="Profit before tax · ₹ million · standalone" rows={[
      {l: "JUL–SEP 2025", v: "42,909"}, {l: "JUL–SEP 2026", v: "31,658"}, {l: "FALL = ₹1,125.1 CRORE", v: "11,251", red: true, hl: a("i01", "one thousand") - 2}]} w={1500} y={520}/>
  </Desk>));
const i01d = mk((f, a, d) => (
  <Black f={f} d={d} chip={"Results p.2 · deck slide 5"} chip2={ARITH + " · " + CONV}>
    <Bridge f={f} title="Why profit before tax fell" source="₹ crore · Jul–Sep 2025 to Jul–Sep 2026" max={4600}
      steps={[{label: "A YEAR AGO", v: 4290.9, at: 0, kind: "start"}, {label: "OPERATING PROFIT (EBIT) FELL", v: -578.3, at: a("i01", "Operating profit") + 2},
        {label: "OTHER INCOME NET OF INTEREST FELL", v: -546.8, at: a("i01", "other five") - 2}, {label: "NOW", v: 3165.8, at: a("i01", "other five") + 14, kind: "total"}]}
      circle={[2, a("i01", "forty seven") - 4]}/>
  </Black>));

// ---- i02 other income
const i02a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]} chip={RESULTS("2")} chip2="The line that holds invested cash's earnings">
    <Disc f={f} at={0} name="piggy" x={960} y={450} size={290}/>
    <Head f={f} at={a("i02", "other income") + 2} text="OTHER INCOME" x={960} y={850} size={90}/>
  </Desk>));
const i02b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={DECK("6")} chip2="Our arithmetic: other income ÷ net sales · the two lines tie, no filing says they are one">
    <RowsCard f={f} head="% of net sales · Q2 FY27 | Q2 FY26" rows={[
      {l: "SLIDE 6 · NON-OPERATING INCOME", v: "0.8 | 2.4", hl: a("i02", "deck") + 2}, {l: "RESULTS p.2 · OTHER INCOME ÷ SALES", v: "0.85 | 2.41", hl: a("i02", "our arithmetic") - 4}]} w={1700} y={520}/>
  </Desk>));
const i02c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={REL} chip2="The company's words">
    <QuoteCard f={f} head="Press release · Q2 FY27" lines={["However, non-operating income declined sharply in Q2", "owing to mark-to-market losses on invested surplus."]}
      hl={[["declined sharply in Q2", a("i02", "declined") - 2]]} w={1620} size={50}/>
  </Desk>));
const i02d = mk((f, a, d) => (
  <Black f={f} d={d} chip={RESULTS("2")} chip2={"Other income, standalone · " + CONV}>
    <Bars f={f} title="Other income" source="₹ crore" max={2100} box={{x: 560, y: 300, w: 1240, h: 560}} bw={260}
      bars={[{label: "JUL–SEP 2025", v: 966.1, txt: "966", at: a("i02", "nine hundred") - 6}, {label: "APR–JUN 2026", v: 1873.7, txt: "1,874", at: a("i02", "one thousand") - 6}]}/>
  </Black>));
const i02e = mk((f, a, d) => (
  <Black f={f} d={d} chip={RESULTS("2")} chip2={"Other income, standalone · " + CONV}>
    <Bars f={f} title="Other income" source="₹ crore" max={2100} box={{x: 560, y: 300, w: 1240, h: 560}} bw={260}
      bars={[{label: "JUL–SEP 2025", v: 966.1, txt: "966", at: -40}, {label: "APR–JUN 2026", v: 1873.7, txt: "1,874", at: -40}, {label: "JUL–SEP 2026", v: 429.8, txt: "430", at: a("i02", "four hundred") - 6, key: true}]}/>
  </Black>));

// ---- i03 half the fall
const i03a = mk((f, a, d) => (
  <Black f={f} d={d} chip={ARITH} chip2="Other income net of interest: ₹546.8 crore of the ₹1,125.1 crore fall">
    <Ring f={f} x={960} y={500} r={230} from={0} to={49} at={a("i03", "half") - 2} dur={40} label="OF THE FALL IN PROFIT BEFORE TAX"/>
  </Black>));
const i03b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={ARITH} chip2="Operating profit fall ₹578.3 crore · other income net of interest ₹546.8 crore">
    <Disc f={f} at={0} name="car" x={540} y={450} size={260}/>
    <Big f={f} at={4} text="51%" x={540} y={680} size={130} color={C.ink}/>
    <Lab f={f} at={8} text="operating profit" x={540} y={790} size={46}/>
    <Disc f={f} at={a("i03", "sits in") - 2} name="piggy" x={1380} y={450} size={260}/>
    <Big f={f} at={a("i03", "sits in") + 2} text="49%" x={1380} y={680} size={130} color={C.markerRed}/>
    <Lab f={f} at={a("i03", "sits in") + 8} text="other income," x={1380} y={790} size={46}/>
    <Lab f={f} at={a("i03", "sits in") + 10} text="net of interest" x={1380} y={850} size={46}/>
  </Desk>));
const i03c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip="Press release · deck slide 7" chip2={NOT}>
    <Disc f={f} at={0} name="piggy" x={960} y={400} size={260}/>
    <Stamp f={f} at={a("i03", "do not give") + 4} text="NO RUPEE SIZE GIVEN" x={960} y={730} size={96} rot={-4}/>
    <Lab f={f} at={a("i03", "do not give") + 14} text="of the mark-to-market loss for the quarter" x={960} y={880} size={34}/>
  </Desk>));

// ---- b01 But...
const b01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={6} q="But…" icon="eye"/>);
const b01b = mk((f, a, d) => <Words f={f} d={d} text="Our reading can break." at={1} mark={["break."]} markAt={a("b01", "can break") + 2} size={150} chip={OURREAD}/>);
const b01c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={OURREAD} chip2={ARITH + " · average of all sales"}>
    <PriceTag f={f} at={-20} x={620} y={30} text="₹7.29 LAKH" size={100} string={140} swing={0.3}/>
    <PriceTag f={f} at={-20} x={1320} y={30} text="₹7.27 LAKH" size={100} string={150} swing={0.3}/>
    <Big f={f} at={a("b01", "flat") - 6} text="FLAT" x={960} y={720} size={220} color={C.markerRed} rot={-4}/>
  </Desk>));
const b01d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={DECK("7")} chip2="Positive factors · no size given">
    <QuoteCard f={f} head="Investor presentation · slide 7 · Positive factors" lines={["◼ Improved realization"]} hl={[["Improved realization", a("b01", "improved") - 2]]} w={1500} size={72}/>
  </Desk>));
const b01e = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip="Plain definition · ours, not the filing's" chip2="Realization is not defined in the deck">
    <Disc f={f} at={0} name="car" x={520} y={470} size={250}/>
    <Big f={f} at={a("b01", "what a company") - 6} text="=" x={880} y={470} size={200} color={C.ink}/>
    <Disc f={f} at={a("b01", "what a company") - 2} name="coin" x={1340} y={470} size={250}/>
    <Lab f={f} at={a("b01", "what a company") + 8} text="what the company gets per vehicle" x={960} y={760} size={40}/>
  </Desk>));
const b01f = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={OURREAD}>
    <Head f={f} at={a("b01", "Both can") + 2} text="BOTH TRUE?" x={960} y={470} size={130}/>
    <Lab f={f} at={a("b01", "mix changed") - 2} text="if the mix changed" x={960} y={680} size={50}/>
  </Desk>));

// ---- b02 the mix did change
const b02a = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("15")} chip2="Units, Q2 FY27 against Q2 FY26 · year on year">
    <Bars f={f} title="Units sold, year on year" source="% change · Jul–Sep" max={60} min={-30} box={{x: 560, y: 300, w: 1240, h: 560}} bw={200}
      bars={[{label: "UTILITY", v: 52.3, txt: "+52.3%", at: a("b02", "utility") - 4, key: true}, {label: "CARS", v: 31.9, txt: "+31.9%", at: a("b02", "Passenger cars") - 4}]}/>
  </Black>));
const b02b = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("15")} chip2="Units, Q2 FY27 against Q2 FY26 · year on year">
    <Bars f={f} title="Units sold, year on year" source="% change · Jul–Sep" max={60} min={-30} box={{x: 380, y: 300, w: 1400, h: 560}} bw={170}
      bars={[{label: "UTILITY", v: 52.3, txt: "+52.3%", at: -40, key: true}, {label: "CARS", v: 31.9, txt: "+31.9%", at: -40}, {label: "EXPORTS", v: -2.1, txt: "−2.1%", at: a("b02", "Exports") - 2},
        {label: "OTHER MAKERS", v: -23.2, txt: "−23.2%", at: a("b02", "other carmakers") - 2}]}/>
  </Black>));
const b02c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip="Illustration only · no values" chip2={OURREAD}>
    <Baskets f={f} at={0} at2={a("b02", "moves an average") - 8}/>
  </Desk>));
const b02d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={OURREAD} chip2={ARITH}>
    <Lab f={f} at={3} text="our flat average may be" x={960} y={330} size={44}/>
    <Head f={f} at={a("b02", "partly be mix") - 2} text="PARTLY MIX" x={960} y={500} size={150}/>
  </Desk>));
const b02e = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={NOT} chip2="No price for any model in the four documents">
    <Disc f={f} at={2} name="magnifier" x={960} y={250} size={200}/>
    <Stamp f={f} at={a("b02", "no price") + 2} text="NO PRICE BY MODEL" x={960} y={560} size={120} rot={-4}/>
    <Lab f={f} at={a("b02", "cannot say") + 2} text="so we cannot say how much" x={960} y={700} size={44}/>
  </Desk>));

// ---- b03 the strongest case against us
const b03a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]} chip={OURREAD}>
    <StickerLabel f={f} text="THE STRONGEST CASE AGAINST US" x={960} y={470} size={64} rot={-2} dark enter={{at: 2, mode: "drop"}}/>
  </Desk>));
const b03b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={DECK("7")} chip2="The three negatives the company lists">
    <QuoteCard f={f} head="Slide 7 · negative factors" lines={["◼ Adverse commodity prices …", "◼ Adverse foreign exchange movement", "◼ … mark-to-market losses on invested surplus"]} w={1500} size={46}/>
    <Big f={f} at={4} text="→ OUTSIDE" x={1500} y={880} size={90} color={C.markerRed} rot={-3}/>
  </Desk>));
const b03c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={OURREAD} chip2="Our summary of slide 7's negatives">
    <Disc f={f} at={a("b03", "Commodities") - 2} name="globe" x={480} y={450} size={250}/>
    <Lab f={f} at={a("b03", "Commodities") + 6} text="commodities" x={480} y={640} size={34}/>
    <Disc f={f} at={a("b03", "exchange rates") - 2} name="repeat" x={960} y={450} size={250}/>
    <Lab f={f} at={a("b03", "exchange rates") + 6} text="exchange rates" x={960} y={640} size={34}/>
    <Disc f={f} at={a("b03", "investment losses") - 2} name="piggy" x={1440} y={450} size={250}/>
    <Lab f={f} at={a("b03", "investment losses") + 6} text="investment losses" x={1440} y={640} size={34}/>
  </Desk>));
const b03d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 540]]} chip={DECK("10")} chip2="Material cost, % of net sales · Q1 FY27 against Q2 FY27">
    <Ruler f={f} at={0} lo={79.5} hi={81} step={0.5} from={80.5} to={79.9} moveAt={a("b03", "materials were lower") + 8} label="MATERIAL COST, % OF NET SALES" dec={1} ghost={{v: 80.5, label: "APR–JUN", at: 8}} y={560}/>
  </Desk>));
const b03e = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("9")} chip2={"Operating EBITDA · " + CONV}>
    <Bars f={f} title="Operating EBITDA, from April–June" source="₹ crore" max={5600} box={{x: 360, y: 300, w: 1200, h: 560}} bw={260}
      bars={[{label: "APR–JUN 2026", v: 4311.1, txt: "4,311", at: 0}, {label: "JUL–SEP 2026 (+10.5%)", v: 4763.3, txt: "4,763", at: a("b03", "ten point five") - 8, key: true}]}/>
  </Black>));
const b03f = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={OURREAD}>
    <Head f={f} at={a("b03", "Read that way") + 2} text="AN OUTSIDE SHOCK?" x={960} y={450} size={130}/>
    <Lab f={f} at={a("b03", "little about") + 2} text="says little about Maruti's own edge" x={960} y={660} size={40}/>
  </Desk>));

export const SHOTS3: Shot[] = [
  S("i01", -0.85, PU, i01card), S("i01", 0.65, WL, i01b), S("i01", "Profit before", PU, i01c), S("i01", "Operating profit", WR, i01d),
  S("i02", 0, WD, i02a), S("i02", "In the deck", PU, i02b), S("i02", "The release says", WL, i02c), S("i02", "It was nine", WR, i02d), S("i02", "This quarter", H0, i02e),
  S("i03", 0, PU, i03a), S("i03", "sits in", WL, i03b), S("i03", "The filings do", WD, i03c),
  S("b01", -0.85, PU, b01card), S("b01", 0.65, WD, b01b), S("b01", "Our average", WL, b01c), S("b01", "Yet the company", PU, b01d), S("b01", "In plain", WR, b01e), S("b01", "Both can", H0, b01f),
  S("b02", 0, WL, b02a), S("b02", "Exports fell", PU, b02b), S("b02", "A different mix", WR, b02c), S("b02", "So our flat", WD, b02d), S("b02", "The filings give", PU, b02e),
  S("b03", 0, H0, b03a), S("b03", "points outside", PU, b03b), S("b03", "Commodities", WL, b03c), S("b03", "And against", WR, b03d), S("b03", "Operating E B I T D A", WD, b03e), S("b03", "Read that way", PU, b03f),
];
void XI;
export const CUES3: SCue[] = [
  [W("i01", -0.85), "paper", 0.6], [W("i01", "There is"), "pop", 0.5], [W("i01", "Profit before"), "paper", 0.5], [W("i01", "Operating profit"), "ding", 0.5], [W("i01", "other five"), "ding", 0.5],
  [W("i02", "In the deck"), "paper", 0.5], [W("i02", "declined"), "highlighter", 0.5], [W("i02", "nine hundred"), "ding", 0.5], [W("i02", "one thousand"), "ding", 0.5], [W("i02", "four hundred"), "stamp", 0.6],
  [W("i03", "half"), "ding", 0.5], [W("i03", "sits in"), "pop", 0.5], [W("i03", "do not give"), "stamp", 0.7],
  [W("b01", -0.85), "paper", 0.7], [W("b01", "Here is"), "pop", 0.5], [W("b01", "Yet the company"), "highlighter", 0.4], [W("b01", "Both can"), "stamp", 0.6],
  [W("b02", 0), "whoosh", 0.5], [W("b02", "utility"), "ding", 0.4], [W("b02", "Exports fell"), "ding", 0.4], [W("b02", "A different mix"), "pop", 0.5], [W("b02", "no price"), "stamp", 0.7],
  [W("b03", 2), "stamp", 0.6], [W("b03", "Commodities"), "pop", 0.4], [W("b03", "exchange rates"), "pop", 0.4], [W("b03", "investment losses"), "pop", 0.4], [W("b03", "ten point five"), "ding", 0.5], [W("b03", "Read that way"), "pop", 0.5],
];
