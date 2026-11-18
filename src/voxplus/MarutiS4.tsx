// marutiq2 "But..." end (b04-b05), "Back to the number" (e01-e02). Figures: contentengine/drafts/2026-10-27/_video/script.md (reviewed). Standalone.
import React from "react";
import {SCue} from "./A01V4Cold";
import {Shot, Stamp, StickyNote} from "./A01V4Parts";
import {MChapterQ as ChapterQ} from "./MarutiMore";
import {C} from "./tokens";
import {H0, MZ, PU, S, W, WD, WL, WR} from "./MarutiCue";
import {Big, Desk, Disc, Head, Lab, RESULTS, RowsCard, XI} from "./MarutiPieces";
import {CalStrip, CoinGrid, QuoteCard, Ruler, Seesaw, TallyCard, mk} from "./MarutiKit";
import {ARITH, NOT, OURREAD} from "./MarutiS1";

// ---- b04 no rival numbers
const b04a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip="Investor presentation · slide 6 · Maruti only" chip2={NOT}>
    <RowsCard f={f} head="Operating EBITDA margin · Q2 FY27" rows={[{l: "MARUTI", v: "9.4%", hl: a("b04", "no cost") - 2}, {l: "RIVAL", v: "—"}, {l: "RIVAL", v: "—"}]} w={1300} y={500}/>
  </Desk>));
const b04b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={OURREAD} chip2="Illustration only · no values">
    <Seesaw f={f} at={0} label="MARUTI'S FALL" x={960} y={520}/>
    <Lab f={f} at={a("b04", "smaller") - 2} text="smaller than theirs, or larger" x={960} y={930} size={38}/>
  </Desk>));
const b04c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={NOT} chip2="No cost or profit numbers for any other carmaker">
    <Stamp f={f} at={a("b04", "cannot tell") - 6} text="NO RIVAL NUMBERS" x={960} y={470} size={112} rot={-4}/>
  </Desk>));

// ---- b05 the unpriced cost
const b05a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]} chip={RESULTS("5")} chip2="Note 4 to the results">
    <Disc f={f} at={0} name="car" x={960} y={430} size={270}/>
    <Head f={f} at={3} text="A COST WITH NO NUMBER" x={960} y={850} size={74}/>
  </Desk>));
const b05b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={RESULTS("5")} chip2="Read from the scanned page · note 4 · the company's wording">
    <QuoteCard f={f} head="Results statement · note 4" lines={["Consequently, the Company is currently unable to reliably", "estimate a range of possible outcomes and the impact will be", "evaluated once the implementation framework …"]}
      hl={[["currently unable to reliably", a("b05", "currently") - 2], ["estimate a range of possible outcomes", a("b05", "estimate") - 2]]} w={1700} size={42}/>
  </Desk>));
const b05c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={RESULTS("5")} chip2="End-of-Life Vehicles Rules, 2025 · producer obligations to scrap old vehicles">
    <Disc f={f} at={0} name="car" x={560} y={450} size={260} dim={0.5}/>
    <Disc f={f} at={a("b05", "scrapping") - 2} name="repeat" x={1060} y={450} size={260}/>
    <Big f={f} at={a("b05", "scrapping") + 6} text="?" x={1420} y={450} size={330} color={C.markerRed} rot={8}/>
    <Lab f={f} at={a("b05", "scrapping") + 8} text="the rules on scrapping old vehicles" x={960} y={760} size={36}/>
  </Desk>));
const b05d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip="Auditors' limited review report · p.11" chip2="Paragraph 5(i) · their description of the note">
    <QuoteCard f={f} head="Auditors' review report · p.11 · para 5(i)" lines={["Note 4 to the Statement, which describes the inability of the", "Company to reliably estimate and account for in the books its", "obligations under Extended Producer Responsibility …"]}
      hl={[["inability of the", a("b05", "inability") - 2], ["Company to reliably estimate and account for in the books its", a("b05", "account for") - 2]]} w={1740} size={40}/>
  </Desk>));
const b05e = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={NOT} chip2="No amount in the four documents for this cost">
    <Stamp f={f} at={a("b05", "gives no") + 2} text="NO AMOUNT GIVEN" x={960} y={470} size={130} rot={-4}/>
  </Desk>));

// ---- e01 back to the number
const e01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={7} q="Back to the number" icon="shop"/>);
const e01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.1, 960, 520], [d, 1.0, 960, 540]]} chip="Press release · 27 Oct 2026" chip2="Maruti Suzuki India · standalone">
    <TallyCard f={f} at={-20} x={960} y={30} to={696654} countAt={a("e01", "Six lakh") - 4} from={600000} stampAt={a("e01", "A record") - 2}/>
    <StickyNote f={f} at={-10} text="WHERE DID THE MONEY GO?" x={1560} y={230}/>
  </Desk>));
const e01c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={ARITH} chip2="Material cost, % of net sales · slide 6">
    <CoinGrid f={f} at={-20} ink={75.7} inkAt={-30} red={4.2} redAt={a("e01", "four point two") - 2} x={620} y={540} instant/>
    <Big f={f} at={a("e01", "four point two") + 4} text="+4.2" x={1400} y={440} size={260} color={C.markerRed} rot={-3}/>
    <Lab f={f} at={a("e01", "four point two") + 10} text="of every ₹100 of sales" x={1400} y={640} size={46}/>
  </Desk>));
const e01d = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip="Investor presentation · slide 7" chip2={NOT}>
    <QuoteCard f={f} head="Slide 7 · the company's list" lines={["Commodity prices ?", "Foreign exchange ?", "Lower non-operating income ?", "Improved realization ?", "Operating leverage ?", "Cost reduction ?"]} w={1300} size={54} y={450}/>
  </Desk>));
const e01e = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 540]]} chip="Press release · 27 Oct 2026">
    <TallyCard f={f} at={-20} x={960} y={30} to={696654} countAt={-40} stampAt={-20}/>
    <Head f={f} at={a("e01", "how big") - 4} text="HOW BIG EACH?" x={960} y={820} size={80}/>
  </Desk>));

// ---- e02 the next test, end card on the opening image
const e02a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip="Next filing" chip2="The October–December 2026 quarter">
    <CalStrip f={f} at={0} months={["OCT", "NOV", "DEC"]} from={0} to={3} arrowAt={6} label="NEXT: DECEMBER QUARTER"/>
  </Desk>));
const e02b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 540]]} chip={ARITH + " · slide 6"} chip2="Material cost, % of net sales">
    <Ruler f={f} at={0} lo={79.5} hi={81} step={0.5} from={79.9} to={79.9} moveAt={0} label="MATERIAL COST, % OF NET SALES" dec={1} qAt={a("e02", "seventy nine") + 2} y={560}/>
  </Desk>));
const e02c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 540]]} chip="Press release · 27 Oct 2026" chip2="Maruti Suzuki India · standalone">
    <TallyCard f={f} at={-20} x={960} y={30} to={696654} countAt={-40} stampAt={-20}/>
  </Desk>));

export const SHOTS4: Shot[] = [
  S("b04", 0, WL, b04a), S("b04", "If every", PU, b04b), S("b04", "These documents", WD, b04c),
  S("b05", 0, WR, b05a), S("b05", "Note four says", PU, b05b), S("b05", "for the rules", WL, b05c), S("b05", "The auditors", WD, b05d), S("b05", "So the company", PU, b05e),
  S("e01", -0.85, PU, e01card), S("e01", 0.65, MZ, e01b), S("e01", "Materials took", WL, e01c), S("e01", "The company lists", WD, e01d), S("e01", "It does not", MZ, e01e),
  S("e02", 0, PU, e02a), S("e02", "Do materials", WL, e02b), S("e02", "And does", MZ, e02c),
];
void XI; void H0; void Head; void Disc;
export const CUES4: SCue[] = [
  [W("b04", 0), "whoosh", 0.5], [W("b04", "If every"), "paper", 0.5], [W("b04", "These documents"), "stamp", 0.7],
  [W("b05", 0), "whoosh", 0.4], [W("b05", "Note four says"), "paper", 0.5], [W("b05", "currently"), "highlighter", 0.4], [W("b05", "for the rules"), "pop", 0.4], [W("b05", "The auditors"), "paper", 0.5], [W("b05", "gives no"), "stamp", 0.7],
  [W("e01", -0.85), "paper", 0.7], [W("e01", "So, back"), "paper", 0.5], [W("e01", "A record"), "stamp", 0.6], [W("e01", "four point two"), "ding", 0.5], [W("e01", "The company lists"), "paper", 0.5], [W("e01", "how big"), "pop", 0.5],
  [W("e02", 0), "paper", 0.5], [W("e02", "Do materials"), "whoosh", 0.4], [W("e02", "And does"), "paper", 0.4],
];
