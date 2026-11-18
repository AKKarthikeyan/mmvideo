// marutiq2 cold open (c01-c04), "The demand" (r01), "The cost of a vehicle" (m01-m03). Figures: contentengine/drafts/2026-10-27/_video/script.md (reviewed). Standalone throughout.
import React from "react";
import {SCue} from "./A01V4Cold";
import {Shot, Stamp, StickyNote} from "./A01V4Parts";
import {MChapterQ as ChapterQ, MWords as Words} from "./MarutiMore";
import {C} from "./tokens";
import {H0, MZ, PU, PUSH, S, W, WD, WL, WR, WU} from "./MarutiCue";
import {Bars, Big, Black, DECK, Desk, Disc, Head, Lab, RELEASE, RESULTS, Receipt, RowsCard, Rs, STANDALONE, XI} from "./MarutiPieces";
import {Bridge, CoinGrid, PriceTag, QuoteCard, Ruler, TallyCard, Waterfall, mk} from "./MarutiKit";
import {CalStrip} from "./MarutiKit";

export const ARITH = "Our arithmetic";
export const CONV = "Our conversion · ₹10 million = ₹1 crore";
export const NOT = "Not in the filings";
export const OURREAD = "Our reading";
const REL = RELEASE();

// ---- c01 the strange object, the first question
const c01a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.1, 960, 520], [d, 1.0, 960, 540]]} chip={REL} chip2="Maruti Suzuki India · quarter to 30 Sep 2026 · standalone">
    <TallyCard f={f} at={0} x={960} y={30} to={696654} countAt={10} stampAt={a("c01", "Record") + 10}/>
    <Head f={f} at={a("c01", "earn less") - 4} text="WHY LESS PROFIT?" x={960} y={950} size={80}/>
  </Desk>));
const c01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={REL} chip2="The company's words">
    <QuoteCard f={f} head="Press release · Q2 FY27" lines={["The Company achieved its highest-ever quarterly total sales", "volume of 696,654 units, registering a growth of 26.5%", "over the same period previous year."]}
      hl={[["highest-ever quarterly total sales", a("c01", "six lakh") - 4]]} w={1620} size={44}/>
  </Desk>));
const c01c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.04, 960, 540], [d, 1.0, 960, 540]]} chip={REL} chip2="July to September 2026">
    <CalStrip f={f} at={0} months={["JUL", "AUG", "SEP"]} from={0} to={3} arrowAt={8} label="THREE MONTHS"/>
    <Disc f={f} at={a("c01", "its highest") - 2} name="car" x={960} y={190} size={200}/>
    <Lab f={f} at={a("c01", "its highest") + 4} text="highest ever, for a quarter" x={960} y={860} size={40}/>
  </Desk>));
// ---- c02 a year earlier, three bar pairs
const c02a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip="Investor presentation · slide 5" chip2="Same quarter, a year earlier (restated)">
    <TallyCard f={f} at={-20} x={960} y={30} from={0} to={550874} countAt={4} head="A YEAR EARLIER" sub="JUL–SEP 2025" stamp="" rot={2}/>
  </Desk>));
const c02b = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("5")} chip2={CONV}>
    <Bars f={f} title="Net sales" source="₹ crore · Jul–Sep" max={62000} box={{x: 560, y: 300, w: 800, h: 560}} bw={260}
      bars={[{label: "A YEAR AGO", v: 40135.8, txt: "40,136", at: 0}, {label: "NOW (+26.1%)", v: 50615.5, txt: "50,616", at: a("c02", "went up") + 6, key: true}]}/>
  </Black>));
const c02c = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("5")} chip2={CONV + " · company-defined measure"}>
    <Bars f={f} title="Operating EBITDA" source="₹ crore · Jul–Sep" max={6200} box={{x: 560, y: 300, w: 800, h: 560}} bw={260}
      bars={[{label: "A YEAR AGO", v: 5084.8, txt: "5,085", at: 0}, {label: "NOW (−6.3%)", v: 4763.3, txt: "4,763", at: a("c02", "before depreciation") + 4, key: true}]}/>
  </Black>));
const c02d = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("5")} chip2={CONV}>
    <Bars f={f} title="Profit after tax" source="₹ crore · Jul–Sep" max={4100} box={{x: 560, y: 300, w: 800, h: 560}} bw={260}
      bars={[{label: "A YEAR AGO", v: 3302.8, txt: "3,303", at: 0}, {label: "NOW (−26.9%)", v: 2414.9, txt: "2,415", at: a("c02", "tax fell") + 2, key: true}]}/>
  </Black>));
// ---- c03 the big question
const c03a = mk((f, a, d) => <Words f={f} d={d} text="More vehicles. More sales. Less profit." at={1} mark={["profit."]} markAt={a("c03", "Less") + 2} size={112}/>);
const c03b = mk((f, a, d) => <Words f={f} d={d} text="Where did the extra money go?" at={1} mark={["go?"]} markAt={14} size={136}/>);
// ---- c04 our question
const c04a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.06, 960, 560], [d, 1.0, 960, 540]]} chip="Our question">
    <StickyNote f={f} at={2} text="WHERE DID THE MONEY GO?" x={1560} y={230}/>
    <Disc f={f} at={a("c04", "cost of making") - 6} name="car" x={560} y={540} size={300}/>
    <Lab f={f} at={a("c04", "cost of making")} text="THE COST OF MAKING IT" x={560} y={770} size={46}/>
    <Big f={f} at={a("c04", "somewhere else") - 4} text="?" x={1360} y={500} size={340} color={C.markerRed} rot={6}/>
    <Lab f={f} at={a("c04", "somewhere else") + 6} text="SOMEWHERE ELSE?" x={1360} y={760} size={46}/>
  </Desk>));
const c04b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip="Our question">
    <StickyNote f={f} at={-10} text="WHERE DID THE MONEY GO?" x={1560} y={230}/>
    <Disc f={f} at={-10} name="car" x={640} y={540} size={300} dim={0.6}/>
    <Big f={f} at={a("c04", "somewhere else") - 4} text="?" x={1200} y={520} size={340} color={C.markerRed} rot={6}/>
    <Lab f={f} at={a("c04", "somewhere else") + 6} text="SOMEWHERE ELSE?" x={1200} y={770} size={42}/>
  </Desk>));

// ---- r01 how strong was the demand
const r01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={1} q="The demand" icon="crowd"/>);
const r01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={REL} chip2="The company's words">
    <QuoteCard f={f} head="Press release · Q2 FY27" lines={["Even with enhanced production capacity, demand continued", "to outpace supply resulting in a low network inventory …"]}
      hl={[["demand continued", a("r01", "outran") - 4]]} w={1560} size={46}/>
  </Desk>));
const r01c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={REL} chip2="Network inventory at the end of the quarter">
    <Disc f={f} at={0} name="store" x={560} y={500} size={260}/>
    <Big f={f} at={a("r01", "seventeen") - 4} text="~17 days" x={1220} y={450} size={170} color={C.ink} rot={-3}/>
    <Lab f={f} at={a("r01", "seventeen") + 8} text="of vehicles in stock" x={1220} y={600} size={34}/>
  </Desk>));
const r01d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={REL} chip2="Pending bookings at the end of the quarter">
    <Big f={f} at={a("r01", "two lakh") - 4} text="~200,000" x={960} y={470} size={250} color={C.ink} rot={-2}/>
    <Lab f={f} at={a("r01", "two lakh") + 10} text="bookings still waiting" x={960} y={660} size={44}/>
  </Desk>));
const r01e = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={REL} chip2="Passage on the domestic passenger vehicle market · no base period named">
    <QuoteCard f={f} head="Press release · Q2 FY27" lines={["The Company’s domestic market share increased by", "2.2 percentage points to 40.8%."]} hl={[["2.2 percentage points to 40.8%.", a("r01", "two point two") - 4]]} w={1560} size={50}/>
  </Desk>));
const r01f = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={REL}>
    <Big f={f} at={a("r01", "forty point") - 4} text="40.8%" x={960} y={460} size={320} color={C.ink} rot={-3}/>
    <Lab f={f} at={a("r01", "forty point") + 8} text="domestic share · up 2.2 points" x={960} y={690} size={40}/>
  </Desk>));

// ---- m01 what does it cost to make a vehicle
const m01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={2} q="A hundred rupees" icon="coin"/>);
const m01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]} chip="Our question">
    <Disc f={f} at={0} name="car" x={960} y={450} size={300}/>
    <Head f={f} at={a("m01", "cost") + 2} text="WHAT DOES IT COST?" x={960} y={850} size={84}/>
  </Desk>));
const m01c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={DECK("6")} chip2="Both years include Suzuki Motor Gujarat (slide 3) · % of net sales">
    <RowsCard f={f} head="Slide 6 · cost as % of net sales · Q2 FY27 | Q2 FY26" rows={[
      {l: "MATERIAL COST", v: "79.9 | 75.7", hl: a("m01", "every cost") + 4, red: true}, {l: "EMPLOYEE COST", v: "4.6 | 5.1"}, {l: "OTHER EXPENSES", v: "11.5 | 12.0"},
      {l: "OTHER OPERATING INCOME", v: "5.4 | 5.5"}, {l: "OP. EBITDA", v: "9.4 | 12.7"}]} w={1560} y={520}/>
  </Desk>));
const m01d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={ARITH} chip2="Plain restatement of the deck's percentages">
    <CoinGrid f={f} at={0} ink={0} x={960} y={540}/>
    <Lab f={f} at={a("m01", "hundred rupees") + 4} text="₹100 OF SALES" x={960} y={60} size={46}/>
  </Desk>));
const m01e = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={DECK("6")} chip2="Material cost, % of net sales">
    <CoinGrid f={f} at={-20} ink={75.7} inkAt={a("m01", "seventy five") - 6} x={560} y={540} instant={false}/>
    <Big f={f} at={a("m01", "seventy five") + 6} text="₹75.70" x={1400} y={440} size={170} color={C.ink} rot={-3}/>
    <Lab f={f} at={a("m01", "seventy five") + 14} text="a year ago" x={1400} y={590} size={34}/>
  </Desk>));
const m01f = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={DECK("6")} chip2="Material cost, % of net sales">
    <CoinGrid f={f} at={-20} ink={75.7} inkAt={-30} red={4.2} redAt={a("m01", "Now") + 6} x={560} y={540} instant/>
    <Big f={f} at={a("m01", "seventy nine") - 2} text="₹79.90" x={1400} y={440} size={170} color={C.markerRed} rot={-3}/>
    <Lab f={f} at={a("m01", "seventy nine") + 10} text="now" x={1400} y={590} size={34}/>
  </Desk>));
const m01g = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={ARITH} chip2={DECK("6")}>
    <Stamp f={f} at={a("m01", "That is our") + 2} text="OUR ARITHMETIC" x={960} y={470} size={130} rot={-5}/>
    <Lab f={f} at={a("m01", "company's percentages")} text="from the company's percentages" x={960} y={700} size={40}/>
  </Desk>));

// ---- m02 we rebuilt it
const m02a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={RESULTS("2")} chip2="Read from the scanned page · standalone · ₹ million, Jul–Sep 2026">
    <RowsCard f={f} head="Results statement · p.2 · Jul–Sep 2026" rows={[
      {l: "COST OF MATERIALS CONSUMED", v: "374,884", hl: a("m02", "Materials used")}, {l: "PURCHASES OF STOCK-IN-TRADE", v: "59,369", hl: a("m02", "plus goods")},
      {l: "CHANGES IN INVENTORIES", v: "(28,387)", hl: a("m02", "adjusted for stock")}, {l: "VEHICLES / DIES FOR OWN USE", v: "(1,580)", hl: a("m02", "for vehicles")}]} w={1640} y={520}/>
  </Desk>));
const m02b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={ARITH} chip2={CONV}>
    <Receipt f={f} x={960} y={90} w={760} head="SUM · ₹ MILLION" lines={[
      {l: "MATERIALS CONSUMED", r: "374,884", at: 4}, {l: "+ STOCK-IN-TRADE", r: "59,369", at: 14}, {l: "− INVENTORY CHANGE", r: "28,387", at: 24}, {l: "− OWN USE", r: "1,580", at: 34},
      {l: "= NOW", r: "404,286", at: a("m02", "come to") + 4, big: true}, {l: "= ₹40,428.6 CRORE", r: "", at: a("m02", "forty thousand") + 4}]}/>
  </Desk>));
const m02c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={ARITH} chip2={CONV + " · Jul–Sep 2025"}>
    <Receipt f={f} x={960} y={90} w={760} head="A YEAR AGO · ₹ MILLION" lines={[
      {l: "MATERIALS CONSUMED", r: "253,241", at: 4}, {l: "+ STOCK-IN-TRADE", r: "66,800", at: 12}, {l: "− INVENTORY CHANGE", r: "15,472", at: 20}, {l: "− OWN USE", r: "624", at: 28},
      {l: "= A YEAR AGO", r: "303,945", at: a("m02", "against thirty") + 8, big: true}, {l: "= ₹30,394.5 CRORE", r: "", at: a("m02", "ninety five") + 4}]}/>
  </Desk>));
const m02d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={ARITH} chip2="Share of net sales: 404,286 ÷ 506,155 and 303,945 ÷ 401,358">
    <Big f={f} at={a("m02", "seventy nine point") - 4} text="79.87%" x={560} y={470} size={230} color={C.markerRed} rot={-3}/>
    <Lab f={f} at={a("m02", "seventy nine point") + 6} text="now" x={560} y={650} size={40}/>
    <Big f={f} at={a("m02", "against seventy five") - 2} text="75.73%" x={1380} y={470} size={230} color={C.ink} rot={3}/>
    <Lab f={f} at={a("m02", "against seventy five") + 8} text="a year ago" x={1380} y={650} size={40}/>
  </Desk>));
const m02e = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={DECK("6")} chip2="The deck does not define the line">
    <RowsCard f={f} head="Slide 6 · material cost · % of net sales" rows={[{l: "Q2 FY27", v: "79.9"}, {l: "Q2 FY26", v: "75.7"}]} w={1200} y={470}/>
    <Stamp f={f} at={a("m02", "matches") + 2} text="MATCHES THE DECK" x={1330} y={760} size={90} rot={-5} color="#2E8B57"/>
  </Desk>));

// ---- m03 the other cost lines
const m03a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={DECK("6")} chip2="Points of net sales, Q2 FY27 against Q2 FY26">
    <RowsCard f={f} head="Slide 6 · the other cost lines" rows={[
      {l: "EMPLOYEE COST  5.1 → 4.6", v: "−0.5", hl: a("m03", "Staff costs")}, {l: "OTHER EXPENSES  12.0 → 11.5", v: "−0.5", hl: a("m03", "Other expenses")},
      {l: "TOGETHER, GIVEN BACK", v: "1.0", hl: a("m03", "That gives back")}]} w={1560} y={520}/>
  </Desk>));
const m03b = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("6")} chip2="Points of operating EBITDA margin · our arithmetic">
    <Waterfall f={f} title="Where the margin went" source="Points of net sales · − hurts margin" k={100} y0={450}
      steps={[{label: "STAFF", v: 0.5, at: 4}, {label: "OTHER EXPENSES", v: 0.5, at: 12}, {label: "MATERIALS", v: -4.2, at: a("m03", "But materials") + 2}, {label: "OTHER OP. INCOME", v: -0.1, at: a("m03", "slipped") - 4}]}
      total={{label: "NET", at: a("m03", "Add it up")}}/>
  </Black>));
const m03c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={ARITH} chip2="Percentage points of net sales">
    <Head f={f} at={3} text="ADD IT UP" x={960} y={250} size={80}/>
    <Big f={f} at={14} text="4.2 − 1.0 + 0.1 = 3.3" x={960} y={520} size={180} color={C.ink} rot={-2}/>
    <Lab f={f} at={a("m03", "three point three") - 4} text="points off the margin" x={960} y={690} size={44}/>
  </Desk>));
const m03d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 540]]} chip={DECK("6")} chip2="Company-defined measure">
    <Ruler f={f} at={0} lo={8} hi={14} step={1} from={12.7} to={9.4} moveAt={a("m03", "fell from") + 14} label="OPERATING EBITDA MARGIN, % OF NET SALES" ghost={{v: 12.7, label: "A YEAR AGO", at: 8}} y={560}/>
  </Desk>));

export const SHOTS1: Shot[] = [
  S("c01", 0, H0, c01a), S("c01", "In three months", WL, c01b), S("c01", "its highest", PU, c01c),
  S("c02", 0, WD, c02a), S("c02", "Sales money", PU, c02b), S("c02", "But operating", WL, c02c), S("c02", "And profit after", WR, c02d),
  S("c03", 0, H0, c03a), S("c03", "So where", WD, c03b),
  S("c04", 0, PU, c04a),
  S("r01", -0.85, PU, r01card), S("r01", 0.65, WL, r01b), S("r01", "At the end", PU, r01c), S("r01", "and about two", WR, r01d), S("r01", "And in the release", WD, r01e), S("r01", "forty point", WL, r01f),
  S("m01", -0.85, PU, m01card), S("m01", 0.65, WR, m01b), S("m01", "The investor", PU, m01c), S("m01", "Picture a", WD, m01d), S("m01", "A year ago", WL, m01e), S("m01", "Now,", H0, m01f), S("m01", "That is our", PU, m01g),
  S("m02", 0, WD, m02a), S("m02", "come to", PU, m02b), S("m02", "against thirty", WL, m02c), S("m02", "As a share", WR, m02d), S("m02", "It matches", PU, m02e),
  S("m03", 0, WL, m03a), S("m03", "But materials", WD, m03b), S("m03", "Add it up", PU, m03c), S("m03", "The company's operating", WR, m03d),
];
void WU; void XI; void PUSH; void MZ; void Bridge; void Rs; void PriceTag;
export const CUES1: SCue[] = [
  [W("c01", 0.05), "paper", 0.6], [W("c01", "Record") + 0.6, "stamp", 0.8], [W("c01", "In three months"), "paper", 0.5], [W("c01", "its highest"), "ding", 0.5],
  [W("c02", 0), "whoosh", 0.5], [W("c02", "Sales money"), "ding", 0.5], [W("c02", "But operating"), "whoosh", 0.5], [W("c02", "And profit after"), "ding", 0.5],
  [W("c03", "Less"), "stamp", 0.6], [W("c03", "So where"), "pop", 0.6], [W("c04", "cost of making"), "pop", 0.6], [W("c04", "somewhere else"), "pop", 0.6],
  [W("r01", -0.85), "paper", 0.6], [W("r01", "First, how"), "highlighter", 0.4], [W("r01", "seventeen"), "ding", 0.5], [W("r01", "two lakh"), "ding", 0.5], [W("r01", "two point two"), "highlighter", 0.4], [W("r01", "forty point"), "ding", 0.5],
  [W("m01", -0.85), "paper", 0.6], [W("m01", "The investor"), "paper", 0.5], [W("m01", "Picture a"), "pop", 0.5], [W("m01", "seventy five"), "ding", 0.5], [W("m01", "seventy nine"), "stamp", 0.5], [W("m01", "That is our"), "stamp", 0.6],
  [W("m02", "Materials used"), "highlighter", 0.4], [W("m02", "come to"), "ding", 0.5], [W("m02", "against thirty"), "ding", 0.5], [W("m02", "seventy nine point"), "ding", 0.5], [W("m02", "matches"), "stamp", 0.6],
  [W("m03", "Staff costs"), "highlighter", 0.4], [W("m03", "But materials"), "stamp", 0.6], [W("m03", "Add it up"), "ding", 0.5], [W("m03", "fell from"), "whoosh", 0.5],
];
