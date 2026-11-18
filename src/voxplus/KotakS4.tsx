// kotakq2 "But..." (b01-b06), the ending back on the deposit slip (e01-e02) and the end card.
import React from "react";
import {AbsoluteFill} from "remotion";
import {SCue} from "./A01V4Cold";
import {SP, Shot, Stamp, Words} from "./A01V4Parts";
import {StickerLabel} from "./Collage";
import {Finish, InkSurface} from "./Texture";
import {C, F, ease, inOut, outQuint, useTicks} from "./tokens";
import {END, H0, MZ, PU, PUSH, S, W, WD, WL, WR} from "./KotakCue";
import {zoomCam} from "./KotakS1";
import {Bars, Big, BizCard, Black, DECK, Desk, Disc, Doc, Head, Lab, RELEASE, Rs} from "./KotakPieces";
import {DateRow, DepositSlip, LineChart, NimGauge, PriceTag, QuoteCard, mk} from "./KotakKit";

const NOT = "Not in the filings";
const R1 = RELEASE("1");
const Row: React.FC<{f: number; at: number; y: number; name: string}> = ({f, at, y, name}) => {
  const p = ease(f, at, at + 10, outQuint);
  if (p <= 0) return null;
  return (
    <div style={{position: "absolute", left: 360, top: y, width: 1200, height: 120, opacity: p, transform: `translateX(${(1 - p) * -200}px)`, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 40px", background: "#FBF8F1", boxShadow: "0 12px 26px rgba(30,20,10,0.25)", fontFamily: F.sans, fontWeight: 800, fontSize: 48, color: C.ink, letterSpacing: 2}}>
      <span>{name}</span>
      <span style={{width: 360, height: 70, border: `6px dashed ${C.markerRed}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.markerRed, fontSize: 56}}>?</span>
    </div>);
};
// ---- b01
const b01a = mk((f, a, d) => <Words f={f} d={d} text="But..." at={0} size={260} mark={["But..."]} markAt={10}/>);
const b01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={NOT} chip2="Searched all three documents">
    <Row f={f} at={0} y={160} name="WHAT IT COSTS"/>
    <Row f={f} at={a("b01", "how long") - 2} y={320} name="HOW LONG THEY RUN"/>
    <Stamp f={f} at={a("b01", "how long") + 8} text="NOT IN THE FILINGS" x={1440} y={760} size={64} rot={-6}/>
  </Desk>));
const b01c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.04, 960, 540], [d, 1.0, 960, 540]]} chip={NOT} chip2="The filings say only “pursuant to RBI’s swap facility”">
    <Row f={f} at={0} y={160} name="THE SWAP FACILITY'S TERMS"/>
    <Disc f={f} at={6} name="scale" x={960} y={640} size={230}/>
  </Desk>));
const b01d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={NOT}>
    <NimGauge f={f} at={0} from={4.54} to={4.31} moveAt={30} y={560} ghosts={[{v: 4.54, label: "SEP 2025", at: 4}]}/>
    <Row f={f} at={a("b01", "without") - 2} y={140} name="MARGIN WITHOUT FCNR"/>
  </Desk>));
// ---- b02
const b02a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip="Bank's own adjusted figures" chip2="13% deposits · 19% net advances · 41.8% CASA ratio">
    <Head f={f} at={0} text="THE ADJUSTED NUMBERS" x={960} y={180} size={64}/>
    {[["13%", 380, a("b02", "thirteen")], ["19%", 960, a("b02", "nineteen")], ["41.8%", 1540, a("b02", "forty one")]].map(([t, x, at], i) => (
      <React.Fragment key={t as string}>
        <BizCard f={f} at={at as number} x={x as number} y={440} name={t as string} icon="scissors" rot={i - 1.5} w={380}/>
      </React.Fragment>))}
  </Desk>));
const b02b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip="Our reading" chip2="The bank's own choice of what to leave out">
    <Row f={f} at={2} y={300} name="THE MARGIN WITHOUT FCNR"/>
    <Head f={f} at={a("b02", "Our reading") - 2} text="THEIR CHOICE" x={960} y={760} size={90}/>
  </Desk>));
// ---- b03
const b03a = mk((f, a, d) => (
  <Black f={f} d={d} chip={R1} chip2="Standalone provisions, Q2 FY27 vs Q2 FY26">
    <Bars f={f} title="Provisions" source="₹ crore · down 15% overall" max={1100} box={{x: 560, y: 300, w: 800, h: 560}}
      bars={[{label: "Q2 FY26", v: 947, txt: "947", at: 0}, {label: "Q2 FY27", v: 803, txt: "803", at: a("b03", "fell") - 2, key: true}]}/>
  </Black>));
const b03b = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("9")} chip2="Provision on standard assets (loans not classed as bad)">
    <Bars f={f} title="Standard-asset provisions" source="₹ crore · Q2 FY26 vs Q2 FY27" max={320} box={{x: 560, y: 300, w: 800, h: 560}}
      bars={[{label: "Q2 FY26", v: 75, txt: "75", at: 0}, {label: "Q2 FY27", v: 274, txt: "274", at: a("b03", "two hundred") - 4, key: true}]}/>
  </Black>));
const b03c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={DECK("9")} chip2="Footnote to the profit and loss slide">
    <QuoteCard f={f} head="Investor presentation · slide 9" lines={["Provision on standard assets for Q2FY27 includes ~ ₹ 120 cr on", "Advances against FCNR(B) and Loans transferred from", "Kotak Mahindra Investments Limited (“KMIL”) during the quarter"]}
      hl={[["~ ₹ 120 cr", a("b03", "one hundred and twenty") - 4]]} w={1720} size={36}/>
  </Desk>));
// ---- b04
const b04a = mk((f, a, d) => <Words f={f} d={d} text="Only income?" at={1} mark={["income?"]} markAt={10} size={170}/>);
const b04b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={DECK("9")} chip2="Footnote to other operating expenses">
    <QuoteCard f={f} head="Investor presentation · slide 9" lines={["Other Operating Expenses include fees and other", "expenditures of ~ ₹ 116 cr, on borrowings mobilized by", "Bank’s international branches"]}
      hl={[["~ ₹ 116 cr", a("b04", "one hundred") - 4]]} w={1720} size={36}/>
  </Desk>));
const b04c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={NOT} chip2="Different bases: not subtracted">
    <BizCard f={f} at={0} x={560} y={480} name="FEES ON FCNR LOANS ~₹158 CR" icon="coin" rot={-3} w={520} sub="income (slide 9)"/>
    <BizCard f={f} at={6} x={1360} y={480} name="COSTS ON BRANCH BORROWINGS ~₹116 CR" icon="bank" rot={3} w={560} sub="expense (slide 9)"/>
    <Stamp f={f} at={a("b04", "net it") - 2} text="NOT NETTED" x={960} y={820} size={72} rot={-5}/>
  </Desk>));
// ---- b05
const b05a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={NOT} chip2="Media release · investor presentation · board outcome">
    <Disc f={f} at={0} name="doc" x={520} y={440} size={230}/><Disc f={f} at={4} name="doc" x={960} y={440} size={230}/><Disc f={f} at={8} name="doc" x={1400} y={440} size={230}/>
    <Disc f={f} at={a("b05", "no guidance") - 6} name="magnifier" x={960} y={440} size={150}/>
    <Head f={f} at={a("b05", "no outlook")} text="NO OUTLOOK GIVEN" x={960} y={820} size={84}/>
  </Desk>));
const b05b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={NOT}>
    <Stamp f={f} at={2} text="NO GUIDANCE" x={960} y={500} size={110} rot={-5}/>
  </Desk>));
// ---- b06
const b06a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip="The bank's side" chip2="Labels its adjusted figures · footnotes the fees">
    <Head f={f} at={0} text="THE BANK'S SIDE" x={960} y={180} size={84}/>
    <BizCard f={f} at={a("b06", "labels") - 2} x={560} y={560} name="LABELS EACH ADJUSTED FIGURE" icon="badge" rot={-3} w={520}/>
    <BizCard f={f} at={a("b06", "footnotes") - 2} x={1360} y={560} name="FOOTNOTES THE FEES" icon="doc" rot={3} w={520}/>
  </Desk>));
const b06b = mk((f, a, d) => (
  <Black f={f} d={d} chip={DECK("15")} chip2="Standalone return on equity, quarterly">
    <LineChart f={f} title="Return on equity" source="% · annualised" min={9.5} max={12.5} circleLast={a("b06", "eleven point nine") + 6}
      pts={[{label: "SEP 2025", v: 10.38, txt: "10.38%", at: a("b06", "ten point") - 4}, {label: "JUN 2026", v: 11.98, txt: "11.98%", at: a("b06", "eleven point nine") - 4}, {label: "SEP 2026", v: 11.65, txt: "11.65%", at: a("b06", "eleven point six") - 4}]}/>
  </Black>));
// ---- e01 back to the slip
const e01a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.1, 960, 520], [d, 1.0, 960, 540]]} chip={R1} chip2="~₹55,344 crore of FCNR(B) deposits">
    <DepositSlip f={f} at={-30} x={900} y={600} rot={-4} stampAt={-20}/>
    <PriceTag f={f} at={-30} x={1180} y={90} text="₹55,344 CR" size={96} swing={0.7}/>
    <Head f={f} at={a("e01", "fifty five") + 6} text="BACK TO THE SLIP" x={960} y={950} size={74}/>
  </Desk>));
const e01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("nim", "largely on account of", 4, d, 1.9, 960, 500, 1700, -0.5)} chip={R1} chip2="The bank's own words">
    <Doc f={f} name="nim" x={960} y={500} width={1700} rot={-0.5} hl={[["largely on account of", a("e01", "largely") - 2]]}/>
  </Desk>));
const e01c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={R1} chip2="Standalone">
    <NimGauge f={f} at={0} from={4.54} to={4.31} moveAt={4} y={520} ghosts={[{v: 4.54, label: "SEP 2025", at: 2}]}/>
    <PriceTag f={f} at={a("e01", "deposits") - 4} x={300} y={60} text="₹55,344 CR" size={80} swing={0.6}/>
  </Desk>));
const e01d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={NOT}>
    <PriceTag f={f} at={-30} x={700} y={80} text="₹55,344 CR" size={110} swing={0.5}/>
    <Big f={f} at={a("e01", "what that") - 2} text="WHAT IT COSTS ?" x={1180} y={620} size={130} color={C.markerRed} rot={-3}/>
    <Stamp f={f} at={a("e01", "do not show") + 4} text="NOT IN THE FILINGS" x={1360} y={860} size={64} rot={-6}/>
  </Desk>));
// ---- e02
const e02a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip="What to watch · no forecast" chip2="Next filing: the quarter to 31 December 2026">
    <DateRow f={f} items={[{date: "DEC QUARTER", label: "the next filing to read", at: 0}]} y={470}/>
  </Desk>));
const e02b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip="Illustration, no values" chip2="Margin with and without the foreign deposits">
    <NimGauge f={f} at={0} from={4.31} to={4.31} moveAt={0} y={540} ghosts={[{v: 4.31, label: "WITH FCNR", at: 2}]} showTo={false}/>
    <Row f={f} at={a("e02", "without") - 2} y={140} name="WITHOUT FCNR"/>
  </Desk>));
export const EndCard: React.FC<SP> = ({d}) => {
  const f = useTicks();
  const p = ease(f, 0, 14, outQuint);
  return (
    <AbsoluteFill>
      <InkSurface glow={0.1}/>
      <div style={{position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: F.serif, fontSize: 130, color: C.white, opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`}}>Moat <span style={{color: C.highlightPrint}}>&amp;</span> Margin</div>
      <div style={{position: "absolute", left: 960 - 300, top: 540, width: 600, height: 14, background: C.highlight, transform: `scaleX(${ease(f, 8, 22, inOut)})`}}/>
      <div style={{position: "absolute", left: 200, right: 200, top: 640, textAlign: "center", fontFamily: F.sans, fontWeight: 600, fontSize: 34, color: "#CFC9BE", opacity: ease(f, 14, 26)}}>
        Every figure from Kotak Mahindra Bank's filings of 24 Oct 2026 · derived figures are our arithmetic</div>
      <div style={{position: "absolute", left: 200, right: 200, top: 860, textAlign: "center", fontFamily: F.mono, fontSize: 26, color: "#C4BEB3", letterSpacing: 1, opacity: ease(f, 10, 20)}}>
        Educational research, not investment advice. Not a SEBI-registered research analyst or investment adviser.</div>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};
export const SHOTS4: Shot[] = [
  S("b01", -0.85, H0, b01a), S("b01", "Here is", PU, b01b), S("b01", "The terms", WL, b01c), S("b01", "And the margin", WD, b01d),
  S("b02", 0, WR, b02a), S("b02", "Our reading", PU, b02b),
  S("b03", 0, WL, b03a), S("b03", "But provisions", WD, b03b), S("b03", "About one hundred", PU, b03c),
  S("b04", 0, H0, b04a), S("b04", "The deck", WL, b04b), S("b04", "The filings", PU, b04c),
  S("b05", 0, PU, b05a), S("b05", "no guidance", PUSH(960, 540), b05b),
  S("b06", 0, WR, b06a), S("b06", "Return on", WD, b06b),
  S("e01", -0.7, MZ, e01a), S("e01", "The bank says", PU, e01b), S("e01", "Its filings", WL, e01c), S("e01", "They do not", WD, e01d),
  S("e02", 0, WD, e02a), S("e02", "and whether", PU, e02b),
  {id: "end", cut: END("e02") + 0.6, tr: {k: "hard"}, C: EndCard},
];
void MZ; void Rs; void StickerLabel;
export const CUES4: SCue[] = [
  [W("b01", -0.85), "stamp", 0.6], [W("b01", "cost"), "click", 0.5], [W("b01", "how long"), "click", 0.5], [W("b01", "The terms"), "click", 0.5], [W("b01", "And the margin"), "stamp", 0.6],
  [W("b02", "thirteen"), "pop", 0.4], [W("b02", "nineteen"), "pop", 0.4], [W("b02", "forty one"), "pop", 0.4], [W("b03", "But provisions"), "whoosh", 0.4], [W("b03", "two hundred"), "ding", 0.5],
  [W("b03", "About one hundred"), "highlighter", 0.4], [W("b04", "The deck"), "highlighter", 0.4], [W("b04", "net it"), "stamp", 0.6], [W("b05", "no guidance"), "stamp", 0.7],
  [W("b06", "labels"), "pop", 0.4], [W("b06", "Return on"), "whoosh", 0.4],
  [W("e01", -0.7), "paper", 0.6], [W("e01", "largely"), "highlighter", 0.4], [W("e01", "do not show"), "stamp", 0.6], [W("e02", "and whether"), "paper", 0.5],
];
