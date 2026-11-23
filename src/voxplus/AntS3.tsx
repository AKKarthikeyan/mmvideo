// ants1 chapter 3 "Who pays?" (p01-p05) and chapter 4 "The moat test" (m01-m08). Ledger rows in brackets.
import React from "react";
import {SCue} from "./A01V4Cold";
import {ChapterQ, Shot, Stamp, StickyNote, Words} from "./A01V4Parts";
import {StickerLabel} from "./Collage";
import {C} from "./tokens";
import {H0, PU, PUSH, S, W, WD, WL, WR} from "./AntCue";
import {Bars, Big, Black, Counter, Desk, Doc, Head, Lab, Receipt, S1P, Squares, pg} from "./AntPieces";
import {mk} from "./AntKit";
import {Bill, CodeWindow, IdxCard, Loop, Pyramid, SandTimer, Coins} from "./AntProps";
import {ARITH, CLAIM, MEASURE, NOTE, P149, P157, READING, zoomCam} from "./AntS1";

// ---- p01 [28, 29]
const p01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={3} q="Who pays?" icon="crowd"/>);
const p01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 520], [d, 1.05, 960, 540]]} chip={S1P("F-27") + " · revenue by type"} chip2={ARITH + ": 13,064 ÷ 16,286 · Jan–Jun 2026"}>
    <Bill f={f} at={-20} x={940} y={420} w={960} rot={-1.5} splitAt={a("p01", "Eighty") - 2} gap={70}
      parts={[{frac: 0.8, label: "80¢ BILLED BY USAGE", tint: "#7FB2E5"}, {frac: 0.2, label: "20¢ SUBSCRIPTIONS", tint: "#E8B341"}]}/>
    <Lab f={f} at={a("p01", "minimum spend") - 4} text="some under contracts with a minimum spend" x={960} y={900} size={32}/>
  </Desk>));
// ---- p02 [30, 31]
const p02a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={pg("custs")} chip2="Sep 2025 → Sep 2026 · trailing 12 months">
    <Counter f={f} keys={[[0, 950], [a("p02", "nine hundred"), 950], [a("p02", "eleven thousand") + 20, 11900]]} x={960} y={460} size={200} pre="" label="CUSTOMERS PAYING $100K+ A YEAR"/>
    <Lab f={f} at={2} text="more than" x={960} y={270} size={36}/>
  </Desk>));
const p02b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 520]]} chip={pg("custs")} chip2="Customers by yearly spend · Sep 2026">
    <Pyramid f={f} y={560} tiers={[{label: "PAY $100K+ A YEAR", v: "11,900+", at: 0}, {label: "PAY $1M+", v: "1,900+", at: a("p02", "nineteen") - 4},
      {label: "PAY $10M+", v: "~250", at: a("p02", "two hundred and fifty") - 4}]}/>
  </Desk>));
// ---- p03 [32]
const p03a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 560], [d, 1.05, 960, 520]]} chip={MEASURE} chip2="Excludes Pro and Max subscribers · group ratio, net of leavers">
    <Coins f={f} at={a("p03", "September quarter") - 4} n={2} x={620} y={820} label="JUL–SEP 2025" sub="what they paid"/>
    <Coins f={f} at={a("p03", "nine times") - 4} n={18} x={1300} y={820} dur={40} label="~9× A YEAR LATER" sub="the same customers, Jul–Sep 2026"/>
  </Desk>));
const p03b = mk((f, a, d) => (
  <Black f={f} d={d} chip={MEASURE} chip2={pg("nrr") + " · as of Sep 30, 2026"}>
    <Big f={f} at={a("p03", "nine hundred") - 6} text="~900%" x={960} y={460} size={280} color={C.highlightPrint}/>
    <Lab f={f} at={a("p03", "net revenue") - 2} text="net revenue retention" x={960} y={680} size={44} color="#E8E2D6"/>
  </Black>));
// ---- p04 [33, 34]
const p04a = mk((f, a, d) => <Words f={f} d={d} text="Hooked on a few giants?" at={1} mark={["giants?"]} markAt={a("p04", "giants") - 2} size={140}/>);
const p04b = mk((f, a, d) => (
  <Black f={f} d={d} chip={ARITH + ": 100 – 64 and 100 – 79 · p.144"} chip2="Top five customers' share of quarterly revenue">
    <Squares f={f} at={0} fill={0} x={560} y={500} cell={44} red={36} redAt={a("p04", "thirty six") - 4}/>
    <Lab f={f} at={2} text="JAN–MAR 2026" x={560} y={790} size={34} color="#E8E2D6"/>
    <Big f={f} at={a("p04", "thirty six") - 4} text="36%" x={560} y={890} size={90} color="#FF8FA8"/>
    <Squares f={f} at={6} fill={0} x={1360} y={500} cell={44} red={21} redAt={a("p04", "twenty one") - 4}/>
    <Lab f={f} at={8} text="JUL–SEP 2026" x={1360} y={790} size={34} color="#E8E2D6"/>
    <Big f={f} at={a("p04", "twenty one") - 4} text="21%" x={1360} y={890} size={90} color="#FF8FA8"/>
  </Black>));
const p04c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={S1P(57)} chip2="Nine months to Sep 30, 2026">
    <StickerLabel f={f} text="TOP FIVE, JAN–SEP 2026: ~25%" x={960} y={400} size={66} rot={-2} dark enter={{at: 2, mode: "drop"}}/>
    <Lab f={f} at={a("p04", "cut spending") - 4} text="many top customers can cut spending at any time" x={960} y={620} size={38} color={C.markerRed}/>
  </Desk>));
// ---- p05 [35]
const p05a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("f500", "Over 50% of the Fortune 500", 6, d, 1.4, 960, 520, 1700, -0.5)} chip={pg("f500")} chip2={CLAIM + " · listed Fortune 500 companies only"}>
    <Doc f={f} name="f500" x={960} y={520} width={1700} rot={-0.5} hl={[["Over 50% of the Fortune 500", a("p05", "Over half") - 2]]}/>
  </Desk>));
const p05b = mk((f, a, d) => (
  <Desk f={f} d={d} tone="kraft" cam={[[0, 1.0, 960, 420], [d, 1.04, 960, 620]]} chip="Illustration · company's claim, Jul–Sep 2026" chip2={pg("f500")}>
    <Receipt f={f} x={960} y={60} w={900} head="A LISTED FORTUNE 500 COMPANY" rot={-1.5}
      lines={[{l: "PEOPLE", r: "···", at: 2}, {l: "BUILDINGS", r: "···", at: 6}, {l: "SUPPLIERS", r: "···", at: 10}, {l: "EVERYTHING ELSE", r: "···", at: 14},
        {l: "CLAUDE", r: "UNDER 0.1%", at: a("p05", "tenth") - 4, big: true, red: true}]} circleAt={a("p05", "tenth") + 6}/>
  </Desk>));

// ---- m01 [32]
const m01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={4} q="The moat test" icon="castle"/>);
const TEST = (f: number, a: (k: string, x?: number | string) => number, tick = true) => (
  <>
    <IdxCard f={f} at={a("m01", "One") - 2} x={500} y={520} n="1" title="SPEND MORE?" mark={tick ? undefined : undefined} tick={tick ? a("m01", "yes") : undefined} rot={-3}/>
    <IdxCard f={f} at={a("m01", "Two") - 2} x={960} y={520} n="2" title="COPY?" mark="?" rot={2}/>
    <IdxCard f={f} at={a("m01", "Three") - 2} x={1420} y={520} n="3" title="PROFIT?" mark="?" rot={-1.5}/>
  </>);
const m01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.04, 960, 540]]} chip="The Moat Atlas moat test" chip2="Q1: net revenue retention ~900% (company's measure)">
    {TEST(f, a)}
  </Desk>));
// ---- m02 [36]
const m02a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("frontier", "at the frontier of AI capability", a("m02", "frontier") - 14, d, 1.45, 960, 520, 1750, -0.5)} chip={pg("frontier")} chip2="Quote, word for word">
    <Doc f={f} name="frontier" x={960} y={520} width={1750} rot={-0.5} hl={[["Customers adopt and retain our technology", a("m02", "Customers adopt") - 2],
      ["at the frontier of AI capability", a("m02", "frontier") - 2], ["essential to revenue generation", a("m02", "essential") - 2]]}/>
  </Desk>));
// ---- m03 [6, 37, 38]
const m03a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={pg("new80")}>
    <SandTimer f={f} at={-30} x={960} y={500} s={1.2} flips={[6]} run={200}/>
    <Head f={f} at={a("m03", "matter") - 2} text="WHY NEW MODELS MATTER" x={960} y={900} size={64}/>
  </Desk>));
const m03b = mk((f, a, d) => (
  <Black f={f} d={d} chip={pg("new80")} chip2="Share of Jul–Sep 2026 revenue">
    <Squares f={f} at={0} fill={80} x={960} y={480} cell={56} color={C.highlightPrint} per={0.4}/>
    <Lab f={f} at={a("m03", "eighty") - 4} text="over 80%: models released Apr–Sep 2026" x={960} y={900} size={36} color={C.highlightPrint}/>
  </Black>));
const m03c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("opus", "approximately 40%", a("m03", "forty") - 18, d, 1.6, 960, 520, 1700, -0.5)} chip={pg("opus")} chip2={CLAIM + " · Opus 5.5 vs Opus 5"}>
    <Doc f={f} name="opus" x={960} y={520} width={1700} rot={-0.5} hl={[["approximately 40%", a("m03", "forty") - 4]]}/>
    <Lab f={f} at={a("m03", "new uses") - 2} text="each release opens new uses (company's claim)" x={960} y={820} size={32}/>
  </Desk>));
// ---- m04 [39, 40]
const m04a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 540]]} chip={pg("primary")} chip2="Names as text only">
    <StickerLabel f={f} text="ANTHROPIC" x={960} y={520} size={70} rot={-1} enter={{at: 0, mode: "pop"}}/>
    <StickerLabel f={f} text="GOOGLE" x={470} y={380} size={70} rot={-4} dark enter={{at: a("m04", "Google") - 2, mode: "drop"}}/>
    <StickerLabel f={f} text="OPENAI" x={1450} y={400} size={70} rot={3} dark enter={{at: a("m04", "OpenAI") - 2, mode: "drop"}}/>
    <Lab f={f} at={a("m04", "main rivals") - 2} text="its main rivals, named in the filing" x={960} y={800} size={36}/>
  </Desk>));
const m04b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("rivals", "substantially greater financial, technical, and marketing resources", 4, d, 1.4, 960, 520, 1700, -0.5)} chip={pg("rivals")} chip2="Quote, word for word">
    <Doc f={f} name="rivals" x={960} y={520} width={1700} rot={-0.5} hl={[["substantially greater financial, technical, and marketing resources", a("m04", "substantially") - 2],
      ["greater access to sources of compute", a("m04", "access to compute") - 6]]}/>
  </Desk>));
// ---- m05 [42]
const LOOP = (a: (k: string, x?: number | string) => number, done = false) => [
  {icon: "bolt" as const, label: "COMPUTE", at: done ? -100 : a("m05", "Compute trains") - 2},
  {icon: "star" as const, label: "BETTER MODEL", at: done ? -100 : a("m05", "A better") - 2},
  {icon: "crowd" as const, label: "MORE CUSTOMERS", at: done ? -100 : a("m05", "serves more") - 2},
  {icon: "doc" as const, label: "WHAT TO BUILD NEXT", at: done ? -100 : a("m05", "teaches") - 2},
];
const m05a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]}>
    <StickyNote f={f} at={-100} text={NOTE} x={1640} y={190}/>
    <Head f={f} at={4} text="WHAT CAN'T A RIVAL COPY?" x={960} y={540} size={74}/>
  </Desk>));
const m05b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.04, 960, 540]]} chip={CLAIM + " · " + pg("loop")} chip2="The company's description of its own cycle">
    <Loop f={f} at={0} nodes={LOOP(a)} x={960} y={520} r={300} title="COMPANY'S CLAIM"/>
    <StickyNote f={f} at={-100} text={NOTE} x={1640} y={190}/>
  </Desk>));
// ---- m06 [43, 44]
const m06a = mk((f, a, d) => (
  <Desk f={f} d={d} tone="kraft" cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={CLAIM + " · " + pg("codebase")} chip2="Contributions to its codebase, Sep 2026 · illustration">
    <CodeWindow f={f} at={0} x={820} y={520} w={1000} lines={["def plan(task):", "    steps = split(task)", "    for s in steps:", "        run(s)", "    return report(steps)"]}
      tagAt={a("m06", "ninety") - 6} tagged={[0, 1, 2, 3, 4]}/>
    <Big f={f} at={a("m06", "ninety") - 4} text="90%+" x={1560} y={480} size={180} color={C.markerRed} rot={-4}/>
    <Lab f={f} at={a("m06", "written by Claude") - 4} text="written by Claude" x={1560} y={630} size={34}/>
  </Desk>));
const m06b = mk((f, a, d) => (
  <Black f={f} d={d} chip={CLAIM + " · " + pg("headcount")} chip2="Headcount Dec 2024 → Sep 2026 · quarterly revenue Oct–Dec 2024 → Jul–Sep 2026">
    <Bars f={f} title="Growth since the end of 2024" source="Anthropic S-1 · p.184 · times larger" max={95} box={{x: 560, y: 300, w: 800, h: 540}}
      bars={[{label: "HEADCOUNT", v: 5, txt: "×5+", at: a("m06", "headcount") - 4}, {label: "QUARTERLY REVENUE", v: 86, txt: "×86", at: a("m06", "eighty six") - 6, key: true}]}/>
  </Black>));
// ---- m07 [14, 15, 18]
const m07a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={P149 + " · p.158"} chip2={MEASURE + " · " + P157}>
    <IdxCard f={f} at={0} x={960} y={360} n="3" title="DOES IT MAKE MONEY?" w={720} rot={-1}/>
    <Stamp f={f} at={a("m07", "minus four") - 2} text="–4¢ · JAN–JUN" x={560} y={720} size={56} rot={-7}/>
    <Stamp f={f} at={a("m07", "June quarter") - 2} text="IN PROFIT · APR–JUN" x={1360} y={700} size={52} rot={4} color={C.ink}/>
    <Stamp f={f} at={a("m07", "ten percent") - 4} text="10% · ADJUSTED" x={960} y={850} size={52} rot={-3} color="#2E8B57"/>
  </Desk>));
// ---- m08 [36, 40]
const m08a = mk((f, a, d) => <Words f={f} d={d} text="A speed moat, not a wall." at={1} mark={["speed"]} markAt={a("m08", "speed moat") + 2} size={140} chip={READING}/>);
const m08b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 540]]} chip={READING} chip2={pg("rivals") + " · some rivals have more compute"}>
    <Loop f={f} at={0} nodes={LOOP(a, true)} x={560} y={500} r={230}/>
    <Loop f={f} at={a("m08", "can run") - 6} nodes={[{icon: "bolt", label: "COMPUTE"}, {icon: "star", label: "MODEL"}, {icon: "crowd", label: "CUSTOMERS"}, {icon: "doc", label: "NEXT"}]}
      x={1380} y={500} r={230} grey per={8} title="A RIVAL"/>
  </Desk>));
const m08c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.07, 960, 520]]} chip={READING}>
    <SandTimer f={f} at={0} x={620} y={500} s={1.15} run={180}/>
    <Stamp f={f} at={a("m08", "won again") - 2} text="SPEED MOAT" x={1300} y={440} size={110} rot={-6}/>
    <Lab f={f} at={a("m08", "every new model") - 2} text="won again with every new model" x={1300} y={640} size={36}/>
  </Desk>));
void PUSH; void Bill;

export const SHOTS3: Shot[] = [
  S("p01", -0.85, PU, p01card), S("p01", "Eighty cents", WL, p01b),
  S("p02", 0, PU, p02a), S("p02", "More than nineteen", WD, p02b),
  S("p03", 0, PU, p03a), S("p03", "The company calls", WD, p03b),
  S("p04", 0, H0, p04a), S("p04", "Its top five", WD, p04b), S("p04", "Over the first", PU, p04c),
  S("p05", 0, WL, p05a), S("p05", "yet on average", PU, p05b),
  S("m01", -0.85, PU, m01card), S("m01", "Three questions", WL, m01b),
  S("m02", 0, PU, m02a),
  S("m03", 0, WD, m03a), S("m03", "Models released", WD, m03b), S("m03", "The company says", PU, m03c),
  S("m04", 0, WL, m04a), S("m04", "and says many", PU, m04b),
  S("m05", 0, WD, m05a), S("m05", "The company says", PUSH(960, 540), m05b),
  S("m06", 0, PU, m06a), S("m06", "Since the end", WD, m06b),
  S("m07", 0, PU, m07a),
  S("m08", 0, H0, m08a), S("m08", "A rival with", PU, m08b), S("m08", "So the lead", WR, m08c),
];
export const CUES3: SCue[] = [
  [W("p01", -0.85), "paper", 0.6], [W("p01", "Eighty"), "paper", 0.5], [W("p02", "eleven thousand"), "ding", 0.4], [W("p02", "nineteen"), "pop", 0.4],
  [W("p03", "nine times"), "ding", 0.4], [W("p03", "nine hundred"), "stamp", 0.4], [W("p04", "thirty six"), "pop", 0.4], [W("p04", "twenty one"), "circle", 0.4],
  [W("p05", "Over half"), "highlighter", 0.4], [W("p05", "tenth"), "circle", 0.5],
  [W("m01", -0.85), "paper", 0.6], [W("m01", "yes"), "pop", 0.5], [W("m02", "frontier"), "highlighter", 0.5], [W("m03", "matter"), "whoosh", 0.4],
  [W("m03", "forty"), "highlighter", 0.4], [W("m04", "Google"), "pop", 0.4], [W("m04", "substantially"), "highlighter", 0.4],
  [W("m05", "Compute trains"), "pop", 0.4], [W("m06", "ninety"), "stamp", 0.4], [W("m06", "eighty six"), "ding", 0.4],
  [W("m07", "minus four"), "stamp", 0.5], [W("m07", "ten percent"), "stamp", 0.4], [W("m08", "won again"), "stamp", 0.6],
];
