// kotakq2 "Where did it go?" (s01-s02) and "The margin" (m01-m03).
import React from "react";
import {SCue} from "./A01V4Cold";
import {ChapterQ, Shot, Stamp, Words} from "./A01V4Parts";
import {C} from "./tokens";
import {H0, PU, S, W, WD, WL, WR, WU} from "./KotakCue";
import {zoomCam} from "./KotakS1";
import {Bars, Big, BizCard, Black, DECK, Desk, Disc, Doc, Head, Lab, RELEASE, RowsCard, Rs} from "./KotakPieces";
import {LineChart, NimGauge, PieIllu, PriceTag, mk} from "./KotakKit";

const BS = "Standalone balance sheet · 30 Jun → 30 Sep 2026 · ₹ crore";
const R1 = RELEASE("1");
// ---- s01
const s01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={2} q="Where did it go?" icon="coin"/>);
const s01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={DECK("11")} chip2={BS}>
    <RowsCard f={f} head="Balance sheet · JUN 2026 → SEP 2026 · ₹ crore" rows={[
      {l: "DEPOSITS", v: "572,820 → 651,491", hl: a("s01", "deposits rose") - 2}, {l: "BORROWINGS", v: "25,840 → 55,223", hl: a("s01", "Borrowings") - 2},
      {l: "TOTAL ASSETS", v: "775,073 → 886,758"}]} w={1250} y={500}/>
  </Desk>));
const s01c = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("11")} chip2={BS}>
    <Bars f={f} title="Deposits" source="₹ crore · 30 Jun vs 30 Sep 2026" max={720000} box={{x: 560, y: 300, w: 800, h: 560}}
      bars={[{label: "JUN 2026", v: 572820, txt: "572,820", at: 0}, {label: "SEP 2026", v: 651491, txt: "651,491", at: a("s01", "six lakh") - 4, key: true}]}/>
  </Black>));
const s01d = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("11")} chip2={BS}>
    <Bars f={f} title="Borrowings" source="₹ crore · more than doubled (55,223 ÷ 25,840 = 2.1×)" max={62000} box={{x: 560, y: 300, w: 800, h: 560}}
      bars={[{label: "JUN 2026", v: 25840, txt: "25,840", at: 0}, {label: "SEP 2026", v: 55223, txt: "55,223", at: a("s01", "doubled") - 2, key: true}]}/>
  </Black>));
// ---- s02
const s02a = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("11")} chip2="Our arithmetic: 886,758 − 775,073 = 111,685">
    <Bars f={f} title="Total assets" source="₹ crore · 30 Jun vs 30 Sep 2026" max={960000} box={{x: 560, y: 300, w: 800, h: 560}}
      bars={[{label: "JUN 2026", v: 775073, txt: "775,073", at: 0}, {label: "SEP 2026", v: 886758, txt: "886,758", at: a("s02", "in three months") - 6, key: true}]}/>
  </Black>));
const s02b = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("11")} chip2="Line “Cash, Bank and Call” · ₹ crore">
    <Bars f={f} title="Cash and short-term balances" source="₹ crore · 30 Jun vs 30 Sep 2026" max={92000} box={{x: 560, y: 300, w: 800, h: 560}}
      bars={[{label: "JUN 2026", v: 44620, txt: "44,620", at: 0}, {label: "SEP 2026", v: 80910, txt: "80,910", at: a("s02", "to about eighty") - 6, key: true}]}/>
  </Black>));
const s02c = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("11")} chip2="Our arithmetic: 80,910 ÷ 44,620 − 1 = 81.3%">
    <Big f={f} at={a("s02", "up eighty one") - 4} text="+81%" x={960} y={500} size={340} color={C.highlightPrint} rot={-3}/>
    <Lab f={f} at={a("s02", "up eighty one") + 8} text="cash and short-term balances, in three months" x={960} y={730} color={C.white} size={34}/>
  </Black>));
const s02d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip="Not in the filings" chip2="The filing does not link the cash to the FCNR(B) money">
    <BizCard f={f} at={0} x={520} y={520} name="CASH ₹80,910 CR" icon="jar" rot={-3} w={480}/>
    <PriceTag f={f} at={4} x={1260} y={120} text="₹55,344 CR" size={100} swing={0.5}/>
    <Big f={f} at={a("s02", "does not say") - 2} text="?" x={940} y={470} size={300} color={C.markerRed}/>
    <Stamp f={f} at={a("s02", "money") - 14} text="NOT IN THE FILINGS" x={1400} y={860} size={64} rot={-6}/>
  </Desk>));
// ---- m01
const m01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={3} q="The margin" icon="thermo"/>);
const m01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip="Plain definition, not the filing's" chip2="Net interest margin (NIM) is not defined in the filings">
    <Disc f={f} at={0} name="coin" x={420} y={460} size={220}/>
    <Lab f={f} at={4} text="EARNS ON LOANS & INVESTMENTS" x={420} y={640} size={26}/>
    <Big f={f} at={a("m01", "minus") - 4} text="−" x={800} y={460} size={220}/>
    <Disc f={f} at={a("m01", "minus") + 2} name="coin" x={1180} y={460} size={220}/>
    <Lab f={f} at={a("m01", "minus") + 6} text="PAYS FOR MONEY" x={1180} y={640} size={26}/>
    <Head f={f} at={a("m01", "as a percentage") - 2} text="AS A PERCENTAGE" x={1560} y={460} size={52} rot={3}/>
  </Desk>));
const m01c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip="Plain definition, not the filing's">
    <Disc f={f} at={0} name="piggy" x={560} y={480} size={240}/>
    <Head f={f} at={a("m01", "earning assets") - 4} text="OF ITS EARNING ASSETS" x={1180} y={480} size={64} rot={-2}/>
  </Desk>));
const m01d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={R1} chip2="Standalone NIM, Q2 FY27 vs Q2 FY26 and Q1 FY27">
    <NimGauge f={f} at={0} from={4.54} to={4.31} moveAt={a("m01", "Kotak") + 4} y={560} ghosts={[{v: 4.54, label: "SEP 2025", at: a("m01", "a year ago") + 4}, {v: 4.53, label: "JUN 2026", at: a("m01", "in June") + 2}]}/>
  </Desk>));
const m01e = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("nim", "Net Interest Margin (NIM) for Q2FY27 stood at 4.31% versus 4.54%", 6, d, 1.8, 960, 500, 1700, -0.5)} chip={R1}>
    <Doc f={f} name="nim" x={960} y={500} width={1700} rot={-0.5} hl={[["Net Interest Margin (NIM) for Q2FY27 stood at 4.31% versus 4.54%", 2]]}/>
  </Desk>));
// ---- m02
const m02a = mk((f, a, d) => <Words f={f} d={d} text="A lower margin is not lower income." at={1} mark={["income."]} markAt={a("m02", "lower income") + 2} size={120}/>);
const m02b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={R1} chip2="Standalone net interest income, year on year">
    <Head f={f} at={0} text="NET INTEREST INCOME" x={960} y={200} size={64}/>
    <Rs f={f} at={a("m02", "eight thousand") - 2} v={8459} x={820} y={470} size={190}/>
    <Big f={f} at={a("m02", "sixteen") - 2} text="+16%" x={1500} y={470} size={170} color={C.markerRed} rot={-3}/>
    <Lab f={f} at={a("m02", "sixteen") + 8} text="the rupees themselves, from a year ago" x={960} y={690} size={34}/>
  </Desk>));
const m02c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.04, 960, 540]]} chip="Illustration, no values" chip2="Same slice, bigger base">
    <PieIllu f={f} at={0} y={500}/>
    <Head f={f} at={a("m02", "thinner slice")} text="THINNER SLICE" x={960} y={930} size={80}/>
  </Desk>));
// ---- m03
const m03a = mk((f, a, d) => <Words f={f} d={d} text="Did money get dearer?" at={1} mark={["dearer?"]} markAt={10} size={150}/>);
const m03b = mk((f, a, d) => (
  <Black f={f} d={d} chip={R1} chip2="Standalone cost of funds · quarterly">
    <LineChart f={f} title="Cost of funds" source="% · what the bank pays on average for money" min={4.3} max={4.8} circleLast={a("m03", "up from")}
      pts={[{label: "SEP 2025", v: 4.70, txt: "4.70%", at: a("m03", "against four point seven")}, {label: "JUN 2026", v: 4.46, txt: "4.46%", at: a("m03", "four point four six") - 4}, {label: "SEP 2026", v: 4.52, txt: "4.52%", at: a("m03", "four point five two") - 4}]}/>
  </Black>));

export const SHOTS2: Shot[] = [
  S("s01", -0.85, PU, s01card), S("s01", "Between", WL, s01b), S("s01", "rose from", WD, s01c), S("s01", "Borrowings", WR, s01d),
  S("s02", 0, PU, s02a), S("s02", "Cash and", WL, s02b), S("s02", "up eighty", WD, s02c), S("s02", "The filing", PU, s02d),
  S("m01", -0.85, PU, m01card), S("m01", "Net interest margin", WL, m01b), S("m01", "as a percentage", PU, m01c), S("m01", "Kotak", WR, m01d), S("m01", "in June", WD, m01e),
  S("m02", 0, H0, m02a), S("m02", "Net interest income", PU, m02b), S("m02", "A thinner", WL, m02c),
  S("m03", 0, H0, m03a), S("m03", "Cost of funds", WD, m03b),
];
void WU; void BizCard; void Doc;
export const CUES2: SCue[] = [
  [W("s01", -0.85), "paper", 0.6], [W("s01", "rose from"), "whoosh", 0.4], [W("s01", "Borrowings"), "ding", 0.5], [W("s02", "Cash and"), "whoosh", 0.4], [W("s02", "up eighty"), "ding", 0.6], [W("s02", "The filing"), "stamp", 0.7],
  [W("m01", -0.85), "paper", 0.6], [W("m01", "Kotak"), "whoosh", 0.5], [W("m01", "in June"), "highlighter", 0.4], [W("m02", "eight thousand"), "ding", 0.5], [W("m02", "A thinner"), "pop", 0.5],
  [W("m03", "Cost of funds"), "whoosh", 0.4], [W("m03", "up from"), "circle", 0.5],
];
