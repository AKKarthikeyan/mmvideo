// ants1 chapter 5 "But..." (b01-b07) and the verdict (e01-e05) + the Moat Atlas end card. Ledger rows in brackets.
import React from "react";
import {SCue} from "./A01V4Cold";
import {ChapterQ, MarkerText, Shot, Stamp, StickyNote, Words} from "./A01V4Parts";
import {StickerLabel} from "./Collage";
import {C, F, ease, outQuint} from "./tokens";
import {H0, PU, S, W, WD, WL, WR} from "./AntCue";
import {Bars, Black, Desk, Doc, Head, Lab, S1P, pg} from "./AntPieces";
import {Ledger, PriceTag, mk} from "./AntKit";
import {AtlasEnd, Bill, Control, IdxCard, Loop, SandTimer} from "./AntProps";
import {ARITH, CLAIM, MEASURE, NOTE, P149, P157, READING, zoomCam} from "./AntS1";

const CARDS = ["GROWTH", "RULE-BREAKERS", "HOLIDAYS", "FIXED BILLS", "SAFETY", "CONTROL"];
/** the six index cards in a fan; `lit` = the one in focus (1-based), others dimmed */
const Six: React.FC<{f: number; at: number; lit?: number; y?: number; s?: number}> = ({f, at, lit, y = 560, s = 1}) => (
  <>{CARDS.map((t, i) => (
    <IdxCard key={t} f={f} at={at + i * 3} x={260 + i * 280} y={y + (i % 2) * 40} n={String(i + 1)} title={t} w={300 * s} rot={(i - 2.5) * 2.4}
      dim={lit && lit !== i + 1 ? 1 : 0}/>))}</>
);
// ---- b01
const b01a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.08, 960, 520], [d, 1.0, 960, 540]]}>
    <MarkerText f={f} at={2} text="But…" x={960} y={250} size={230} rot={-4}/>
    <Six f={f} at={a("b01", "six things") - 4} y={700}/>
  </Desk>));
// ---- b02 [45]
const b02a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("decline", "it may decline significantly and more rapidly than we anticipate", 4, d, 1.3, 960, 560, 1700, -0.5)} chip={pg("decline")} chip2="Risk factors">
    <IdxCard f={f} at={-20} x={1600} y={180} n="1" title="GROWTH" w={300} rot={-4}/>
    <Doc f={f} name="decline" x={960} y={560} width={1700} rot={-0.5} hl={[["not be sustainable over time", a("b02", "sustainable") - 4], ["it may decline significantly and more rapidly than we anticipate", a("b02", "expects") - 2]]}/>
  </Desk>));
// ---- b03 [46]
const b03a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 520], [d, 1.05, 960, 540]]} chip={"Company's estimate · " + pg("violate")} chip2="Share of revenue, Jan–Sep 2026">
    <IdxCard f={f} at={-20} x={1600} y={180} n="2" title="RULE-BREAKERS" w={300} rot={-4}/>
    <Bill f={f} at={-10} x={900} y={460} w={980} rot={-1.5} splitAt={a("b03", "five to seven") - 2} gap={60}
      parts={[{frac: 0.94}, {frac: 0.06, label: "5–7¢", tint: C.markerRed, drop: true}]}/>
    <Lab f={f} at={a("b03", "breaking") - 2} text="from customers later found breaking its usage rules" x={960} y={900} size={32} color={C.markerRed}/>
  </Desk>));
const b03b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("violate", "approximately 5% to 7% of our revenue", 2, d, 1.5, 960, 480, 1700, -0.5)} chip={pg("violate")} chip2="Enforcement may reduce revenue and growth (S-1)">
    <Doc f={f} name="violate" x={960} y={480} width={1700} rot={-0.5} hl={[["approximately 5% to 7% of our revenue", -100]]}/>
    <Stamp f={f} at={a("b03", "may reduce") - 2} text="MAY REDUCE REVENUE" x={1300} y={840} size={64} rot={-5}/>
  </Desk>));
// ---- b04 [47]
const b04a = mk((f, a, d) => (
  <Black f={f} d={d} chip={pg("holiday")} chip2={ARITH + ": index, prior two weeks = 100"}>
    <Bars f={f} title="Customer spend over the holidays" source="Two weeks vs the two weeks before · Anthropic S-1 · p.144" max={110} box={{x: 560, y: 300, w: 800, h: 520}}
      bars={[{label: "DEC 6–19, 2025", v: 100, txt: "100", at: a("b04", "last two weeks") - 6}, {label: "DEC 20 – JAN 2", v: 80, txt: "≈ –20%", at: a("b04", "twenty percent") - 6, key: true}]}/>
  </Black>));
const b04b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("holiday", "declined by approximately 20%", 2, d, 1.6, 960, 520, 1700, -0.5)} chip={pg("holiday")}>
    <IdxCard f={f} at={-20} x={1600} y={180} n="3" title="HOLIDAYS" w={300} rot={-4}/>
    <Doc f={f} name="holiday" x={960} y={520} width={1700} rot={-0.5} hl={[["declined by approximately 20%", 2]]}/>
  </Desk>));
// ---- b05 [48, 49]
const b05a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("takepay", "regardless of actual utilization", a("b05", "whether or not") - 12, d, 1.5, 960, 520, 1700, -0.5)} chip={pg("takepay")} chip2="Take-or-pay compute contracts">
    <IdxCard f={f} at={-20} x={1600} y={180} n="4" title="FIXED BILLS" w={300} rot={-4}/>
    <Doc f={f} name="takepay" x={960} y={520} width={1700} rot={-0.5} hl={[["regardless of actual utilization", a("b05", "whether or not") - 2]]}/>
  </Desk>));
const YEARS = [2026, 2030, 2035, 2040, 2045];
const b05b = mk((f, a, d) => {
  const g = ease(f, a("b05", "commitments") - 2, a("b05", "twenty forty five") + 6, outQuint);
  return (
    <Desk f={f} d={d} tone="kraft" cam={[[0, 1.0, 960, 540], [d, 1.03, 960, 540]]} chip={pg("y2045")} chip2="Commitment amounts blank in this draft">
      <div style={{position: "absolute", left: 200, top: 470, width: 1520 * g, height: 120, background: "linear-gradient(180deg,#F2D04B,#E2B92E)", boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
        backgroundImage: "repeating-linear-gradient(90deg, #3A2E10 0 4px, transparent 4px 76px)"}}/>
      {YEARS.map((y, i) => g * 1520 >= i * 380 - 2 ? <div key={y} style={{position: "absolute", left: 200 + i * 380, top: 620, transform: "translateX(-50%)", fontFamily: F.serif,
        fontSize: 72, color: y === 2045 ? C.markerRed : C.ink}}>{y}</div> : null)}
      <Head f={f} at={a("b05", "twenty forty five") + 4} text="COMMITMENTS RUN TO 2045" x={960} y={300} size={62}/>
    </Desk>);
});
const b05c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("blank", "aggregate committed spend of more than $", 2, d, 1.12, 960, 480, 1600, -0.5)} chip={pg("blank")} chip2="Preliminary S-1: figure not yet filled in">
    <Doc f={f} name="blank" x={960} y={500} width={1600} rot={-0.5} circle={[["aggregate committed spend of more than $", a("b05", "blank") - 6]]}/>
    <Stamp f={f} at={a("b05", "blank") + 4} text="AMOUNT BLANK" x={1160} y={700} size={68} rot={-5}/>
  </Desk>));
// ---- b06 [50]
const b06a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("safety", "delaying the release of models", 2, d, 1.15, 960, 600, 1600, -0.5)} chip={pg("safety")} chip2="Company's disclosure">
    <IdxCard f={f} at={-20} x={1600} y={180} n="5" title="SAFETY" w={300} rot={-4}/>
    <Doc f={f} name="safety" x={960} y={600} width={1600} rot={-0.5} hl={[["delaying the release of models", a("b06", "delayed") - 2], ["slow our capability gains", a("b06", "slow") - 2]]}/>
  </Desk>));
// ---- b07 [51, 52, 53]
const b07a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={pg("ltbt")}>
    <IdxCard f={f} at={-20} x={960} y={360} n="6" title="CONTROL" w={520} rot={-2}/>
    <StickerLabel f={f} text="PUBLIC BENEFIT CORPORATION" x={960} y={760} size={64} rot={-2} dark enter={{at: a("b07", "public benefit") - 2, mode: "drop"}}/>
  </Desk>));
const b07b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.03, 960, 560]]} chip={pg("ltbt") + " · p.14 · p.i"} chip2="A controlled company under Nasdaq rules (S-1)">
    <Control f={f} trustAt={0} founderAt={a("b07", "founders") - 2} boardAt={a("b07", "most of the board") - 4} allAt={a("b07", "Together") - 2} listedAt={a("b07", "People who") - 2}/>
  </Desk>));

// ---- e01 [6]
const e01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={6} q="The verdict" icon="stamp"/>);
const e01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.04, 960, 540]]} chip={READING}>
    <StickyNote f={f} at={-100} text={NOTE} x={1640} y={190} unpin={a("e01", "What does") + 4}/>
    <Head f={f} at={a("e01", "What does") + 30} text="WHAT CAN'T A RIVAL COPY?" x={960} y={540} size={74}/>
  </Desk>));
const e01c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={pg("new80")} chip2="Share of Jul–Sep 2026 revenue">
    <SandTimer f={f} at={-100} x={600} y={500} s={1.2} flips={[a("e01", "Over eighty") - 4]} run={400}/>
    <Head f={f} at={2} text="NOT ANY ONE MODEL" x={1220} y={420} size={60}/>
    <Lab f={f} at={a("e01", "Over eighty") + 4} text="80%+ from models under 6 months old" x={1220} y={570} size={30}/>
  </Desk>));
// ---- e02 [54, 30, 40] (word times for e02 come from a no-prompt transcription: figures are digits there)
const e02a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.04, 960, 540]]} chip={READING} chip2={pg("forty") + " · " + pg("custs")}>
    <Loop f={f} at={0} nodes={[{icon: "bolt", label: "COMPUTE"}, {icon: "star", label: "BETTER MODEL"}, {icon: "crowd", label: "MORE CUSTOMERS"}, {icon: "doc", label: "WHAT TO BUILD NEXT"}]}
      x={960} y={520} r={280} per={6}/>
    <StickerLabel f={f} text="≈40M CUSTOMERS UNDER $100K" x={640} y={170} size={40} rot={-3} enter={{at: a("e02", "40 million") - 2, mode: "pop"}}/>
    <StickerLabel f={f} text="11,900+ PAY $100K+ A YEAR" x={1300} y={890} size={40} rot={3} enter={{at: a("e02", "11,900") - 2, mode: "pop"}}/>
  </Desk>));
const e02b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 540]]} chip={READING} chip2={pg("rivals")}>
    <Loop f={f} at={-100} nodes={[{icon: "bolt", label: "COMPUTE"}, {icon: "star", label: "MODEL"}, {icon: "crowd", label: "CUSTOMERS"}, {icon: "doc", label: "NEXT"}]} x={560} y={500} r={230} per={0} title="ANTHROPIC"/>
    <Loop f={f} at={6} nodes={[{icon: "bolt", label: "COMPUTE"}, {icon: "star", label: "MODEL"}, {icon: "crowd", label: "CUSTOMERS"}, {icon: "doc", label: "NEXT"}]} x={1380} y={500} r={230} grey per={8} title="A RIVAL"/>
  </Desk>));
// ---- e03 [14, 15, 18]
const e03a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={READING}>
    <Stamp f={f} at={a("e03", "speed moat") - 2} text="MOAT: SPEED MOAT" x={960} y={440} size={96} rot={-5}/>
    <Lab f={f} at={a("e03", "every release") - 2} text="won again with every release" x={960} y={660} size={40}/>
  </Desk>));
const e03b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 560]]} chip={P149 + " · p.158 · p.157"} chip2={MEASURE + " (adjusted)"}>
    <PriceTag f={f} at={0} x={960} y={-10} text="$1.04" size={90} swing={0.6}/>
    <Ledger f={f} y={640} w={1440} cols={[{name: "JAN–JUN", val: "–4%", sub: "operating margin", red: true, at: a("e03", "break even") - 2},
      {name: "APR–JUN", val: "PROFIT", sub: "operating profit $974M", at: a("e03", "June quarter") - 2}, {name: "ADJUSTED", val: "10%", sub: "company's measure", at: a("e03", "ten percent") - 2}]}/>
  </Desk>));
// ---- e04 [13, 6, 33]
const WATCH = (f: number, a: (k: string, x?: number | string) => number) => (
  <>
    <IdxCard f={f} at={a("e04", "Compute's") - 2} x={490} y={560} title="COMPUTE PER $1" big="55¢" sub="Jan–Jun 2026 · next: ?" w={440} rot={-3}/>
    <IdxCard f={f} at={a("e04", "Revenue from") - 2} x={960} y={560} title="NEW-MODEL REVENUE" big="80%+" sub="Jul–Sep 2026 · next: ?" w={440} rot={1.5}/>
    <IdxCard f={f} at={a("e04", "And the top") - 2} x={1430} y={560} title="TOP FIVE CUSTOMERS" big="21%" sub="Jul–Sep 2026 · next: ?" w={440} rot={-1.5}/>
  </>);
const e04a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.1, 760, 560], [d, 1.06, 820, 560]]} chip={S1P(149) + " · " + pg("new80") + " · p.144"} chip2={ARITH}>
    <Head f={f} at={2} text="3 NUMBERS TO WATCH" x={960} y={230} size={62}/>
    {WATCH(f, a)}
  </Desk>));
const e04b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.1, 960, 540], [d, 1.0, 960, 540]]} chip={S1P(149) + " · " + pg("new80") + " · p.144"} chip2={ARITH}>
    <Head f={f} at={-100} text="3 NUMBERS TO WATCH" x={960} y={230} size={62}/>
    {WATCH(f, a)}
  </Desk>));
// ---- e05 + end card
const e05a = mk((f) => <AtlasEnd f={f} next="NEXT: TSMC"/>);
void Black; void WR; void CLAIM; void P157; void Words;

export const SHOTS4: Shot[] = [
  S("b01", -0.85, PU, b01a),
  S("b02", 0, WL, b02a),
  S("b03", 0, PU, b03a), S("b03", "It expects", WD, b03b),
  S("b04", 0, WD, b04a), S("b04", "lower than", PU, b04b),
  S("b05", 0, WL, b05a), S("b05", "and its commitments", PU, b05b), S("b05", "The amounts", WD, b05c),
  S("b06", 0, WL, b06a),
  S("b07", 0, PU, b07a), S("b07", "A trust", WD, b07b),
  S("e01", -0.85, PU, e01card), S("e01", "What does", H0, e01b), S("e01", "Not any one", WL, e01c),
  S("e02", 0, PU, e02a), S("e02", "A rival", WR, e02b),
  S("e03", 0, PU, e03a), S("e03", "Margin", WD, e03b),
  S("e04", 0, PU, e04a), S("e04", "And the top", H0, e04b),
  S("e05", -0.4, PU, e05a),
];
export const CUES4: SCue[] = [
  [W("b01", -0.85), "paper", 0.6], [W("b01", "six things"), "paper", 0.5], [W("b02", "expects"), "highlighter", 0.4], [W("b03", "five to seven"), "paper", 0.5],
  [W("b03", "may reduce"), "stamp", 0.4], [W("b04", "twenty percent"), "ding", 0.4], [W("b05", "whether or not"), "highlighter", 0.4], [W("b05", "blank"), "stamp", 0.5],
  [W("b06", "delayed"), "highlighter", 0.4], [W("b07", "public benefit"), "pop", 0.4], [W("b07", "Together"), "circle", 0.5],
  [W("e01", -0.85), "paper", 0.6], [W("e01", "Over eighty"), "whoosh", 0.4], [W("e02", "40 million"), "pop", 0.4], [W("e03", "speed moat"), "stamp", 0.6],
  [W("e03", "June quarter"), "ding", 0.4], [W("e04", "Compute's"), "pop", 0.4], [W("e04", "And the top"), "pop", 0.4],
];
