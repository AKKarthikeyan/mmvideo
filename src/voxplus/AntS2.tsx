// ants1 chapter 2 "Follow the dollar" (d01-d10). Jan-Jun 2026, US$ as filed (millions on the Sankey, billions on screen); cents = our arithmetic on the
// S-1 income statement (p.148). Ledger rows in brackets.
import React from "react";
import {SCue} from "./A01V4Cold";
import {ChapterQ, Shot, Stamp, Words} from "./A01V4Parts";
import {StickerLabel} from "./Collage";
import {G} from "../global/theme";
import {C} from "./tokens";
import {H0, PU, PUSH, S, W, WD, WL, WR} from "./AntCue";
import {Bars, Big, BizCard, Black, Desk, Doc, Lab, S1P, Usd, pg} from "./AntPieces";
import {PriceTag, Safe, mk} from "./AntKit";
import {Bill, Coins, DollarSankey, HBridge, SkOut} from "./AntProps";
import {ARITH, MEASURE, P148, P149, P157, P158, P169, zoomCam} from "./AntS1";

const NEVER = 1e9, DONE = -200;
const outs = (cogs: number, rd: number, sm: number, ga: number, focus?: string): SkOut[] => [
  {id: "cogs", label: "COST OF REVENUE (SERVING)", v: 2380, cents: "15¢", at: cogs, color: G.spend},
  {id: "rd", label: "RESEARCH AND DEVELOPMENT", v: 9741, cents: "60¢", at: rd, color: G.spend2},
  {id: "sm", label: "SALES AND MARKETING", v: 3808, cents: "23¢", at: sm, color: G.spend},
  {id: "ga", label: "GENERAL AND ADMIN", v: 1050, cents: "6¢", at: ga, color: G.spend2},
].map((o) => ({...o})).filter(() => focus === undefined || true);
const SK = {title: "Where each $1 of revenue went", source: "Jan–Jun 2026 · US$ · S-1 p.148 · cents = our arithmetic", rev: 16286, revLabel: "$16.3B", scale: 0.029};
const GAP = (at: number) => ({v: 693, label: "–4¢ LOSS", at});

// ---- d01 [1]
const d01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={2} q="Follow the dollar" icon="coin"/>);
const d01b = mk((f, a, d) => (
  <Black f={f} d={d} chip={P148} chip2="Jan–Jun 2026 · US$">
    <DollarSankey f={f} {...SK} revAt={a("d01", "from January") - 2} outs={outs(NEVER, NEVER, NEVER, NEVER)}/>
  </Black>));
// ---- d02 [10, 11]
const d02a = mk((f, a, d) => (
  <Black f={f} d={d} chip={ARITH + ": 2,380 ÷ 16,286"} chip2="Jan–Jun 2026 · US$">
    <DollarSankey f={f} {...SK} revAt={DONE} outs={outs(a("d02", "fifteen") - 12, NEVER, NEVER, NEVER)}/>
  </Black>));
const d02b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("costrev", "compute and infrastructure costs", 6, d, 1.5, 960, 520, 1700, -0.6)} chip={pg("costrev")} chip2="Footnote to the cost of revenue line">
    <Doc f={f} name="costrev" x={960} y={520} width={1700} rot={-0.6} hl={[["compute and infrastructure costs", a("d02", "the computing") - 2]]}/>
  </Desk>));
const d02c = mk((f, a, d) => (
  <Black f={f} d={d} chip={ARITH + ": 9,741 ÷ 16,286"} chip2="R&D is mostly compute for model development (S-1)">
    <DollarSankey f={f} {...SK} revAt={DONE} outs={outs(DONE, a("d02", "sixty") - 12, NEVER, NEVER)}/>
  </Black>));
// ---- d03 [12, 13, 41]
const d03a = mk((f, a, d) => (
  <Black f={f} d={d} chip={ARITH + ": 3,808 and 1,050 ÷ 16,286"} chip2="Jan–Jun 2026 · US$">
    <DollarSankey f={f} {...SK} revAt={DONE} outs={outs(DONE, DONE, 0, a("d03", "and six") - 6)}/>
  </Black>));
const d03b = mk((f, a, d) => (
  <Black f={f} d={d} chip={S1P(149) + " · % of revenue table"} chip2="Compute and infrastructure, across all costs">
    <DollarSankey f={f} {...SK} revAt={DONE} outs={outs(DONE, DONE, DONE, DONE)} overlay={{at: a("d03", "fifty five") - 6, text: "COMPUTE IN ALL: 55¢ OF EVERY $1"}}/>
  </Black>));
const d03c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 540]]} chip={S1P(74)} chip2="Its main compute suppliers (S-1 risk factors)">
    <Disc2 f={f}/>
    {["AMAZON", "GOOGLE", "MICROSOFT"].map((n, i) => (
      <StickerLabel key={n} f={f} text={n} x={540 + i * 420} y={640} size={56} rot={[-3, 2, -1][i]} dark enter={{at: 4 + i * 4, mode: "drop"}}/>))}
    <Lab f={f} at={a("d03", "cloud") - 4} text="much of the compute is bought from the clouds" x={960} y={820} size={36}/>
  </Desk>));
const Disc2: React.FC<{f: number}> = ({f}) => <Big f={f} at={0} text="55¢" x={960} y={340} size={230} color={C.markerRed} rot={-3}/>;
// ---- d04 [4, 14, 15]
const d04a = mk((f, a, d) => (
  <Black f={f} d={d} chip={ARITH + ": 16,979 ÷ 16,286"} chip2="Operating costs exceed revenue">
    <DollarSankey f={f} {...SK} revAt={DONE} outs={outs(DONE, DONE, DONE, DONE)} gap={GAP(a("d04", "a dollar and four") - 6)}/>
  </Black>));
const d04b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.07, 960, 520]]} chip={P149} chip2="Operating margin, Jan–Jun 2026: –4%">
    <Bill f={f} at={-30} x={640} y={560} w={820} rot={-4}/>
    <PriceTag f={f} at={-20} x={640} y={60} text="$1.04" size={100} swing={0.5}/>
    <Big f={f} at={a("d04", "four cents") - 6} text="–4¢" x={1400} y={470} size={260} color={C.markerRed} rot={-3}/>
    <Lab f={f} at={a("d04", "four cents")} text="lost on each $1" x={1400} y={650} size={40}/>
    <Lab f={f} at={a("d04", "before interest")} text="before interest and other items" x={1400} y={720} size={28}/>
  </Desk>));
const d04c = mk((f, a, d) => <Words f={f} d={d} text="The half hides a turn." at={2} mark={["turn."]} markAt={a("d04", "turn") - 2} size={150}/>);
const d04d = mk((f, a, d) => (
  <Black f={f} d={d} chip={P158} chip2="Quarterly results · US$ billions">
    <Bars f={f} title="Operating result, by quarter" source="Anthropic S-1 · p.158 · US$ billions" max={1.4} min={-2.0} box={{x: 560, y: 320, w: 800, h: 520}}
      bars={[{label: "JAN–MAR 2026", v: -1.667, txt: "–$1.7B", at: a("d04", "From January") + 4},
        {label: "APR–JUN 2026", v: 0.974, txt: "+$974M", at: a("d04", "From April") + 4, key: true}]}/>
  </Black>));
// ---- d05 [16, 17]
const d05a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 900, 500]]} chip={ARITH + ": 3,298 ÷ 1,163 · p.148"} chip2="Operating costs per $1 of revenue · Jan–Jun 2025">
    <Bill f={f} at={-30} x={720} y={580} w={860} rot={-3}/>
    <PriceTag f={f} at={a("d05", "two dollars") - 10} x={1420} y={120} text="$2.84" size={130}/>
    <Stamp f={f} at={a("d05", "every dollar it earned") - 2} text="JAN–JUN 2025" x={1420} y={780} size={70} rot={-6}/>
  </Desk>));
const d05b = mk((f, a, d) => (
  <Black f={f} d={d} chip={P149} chip2="Operating margin –184% (2025) and –4% (2026)">
    <Bars f={f} title="Operating loss on each $1 of revenue" source="Anthropic S-1 · p.149 · first half of each year" max={0.4} min={-2.0} box={{x: 560, y: 300, w: 800, h: 520}}
      bars={[{label: "JAN–JUN 2025", v: -1.84, txt: "–$1.84", at: a("d05", "from a dollar") - 4}, {label: "JAN–JUN 2026", v: -0.04, txt: "–4¢", at: a("d05", "to four") - 4, key: true}]}/>
  </Black>));
// ---- d06 [18, 19, 20]
const d06a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.07, 960, 520]]} chip={MEASURE} chip2={P157 + " · Jan–Jun 2026"}>
    <Big f={f} at={a("d06", "ten percent") - 6} text="10%" x={620} y={440} size={280} color={C.ink} rot={-2}/>
    <Lab f={f} at={a("d06", "ten percent")} text="adjusted operating margin" x={620} y={640} size={36}/>
    <StickerLabel f={f} text="STOCK-BASED PAY ≈13¢" x={1360} y={400} size={50} rot={3} enter={{at: a("d06", "stock") - 2, mode: "pop"}}/>
    <Stamp f={f} at={a("d06", "thirteen") + 8} text="NOT COUNTED" x={1360} y={560} size={64} rot={-6}/>
  </Desk>));
const d06b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("rsu", "upon the effectiveness of the registration statement", 4, d, 1.5, 960, 420, 1600, -0.5)} chip={pg("rsu")} chip2="Pro forma note · amount blank in this draft">
    <Doc f={f} name="rsu" x={960} y={420} width={1600} rot={-0.5} hl={[["upon the effectiveness of the registration statement", a("d06", "listing") - 4]]}/>
    <Stamp f={f} at={a("d06", "blank") - 2} text="AT LISTING: $ ___" x={1200} y={820} size={70} rot={-5}/>
  </Desk>));
// ---- d07 [21, 22]
const d07a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 560], [d, 1.05, 960, 540]]} chip={P169} chip2="Cash flow statement · Jan–Jun 2026">
    <Coins f={f} at={a("d07", "three point") - 4} n={18} x={960} y={640} tint="#7FBF7A" label="+$3.9B" sub="cash from operations · Jan–Jun 2026"/>
    <StickerLabel f={f} text="INCL. $1.1B INTEREST INCOME" x={1450} y={330} size={40} rot={4} enter={{at: a("d07", "interest") - 2, mode: "pop"}}/>
  </Desk>));
const d07b = mk((f, a, d) => (
  <Black f={f} d={d} chip={P169} chip2="Operating cash flow · US$ billions">
    <Bars f={f} title="Cash from operations" source="Anthropic S-1 · p.169 · first half of each year" max={4.5} min={-2.0} box={{x: 560, y: 300, w: 800, h: 520}}
      bars={[{label: "JAN–JUN 2025", v: -1.513, txt: "–$1.5B", at: a("d07", "one point five") - 4}, {label: "JAN–JUN 2026", v: 3.929, txt: "+$3.9B", at: 0, key: true}]}/>
  </Black>));
// ---- d08 / d09 [23, 24, 25, 26]
const BR = (a: (k: string, x?: number | string) => number, upto: number) => {
  const t = [a("d08", "eighty point") - 4, a("d08", "seventy two") - 4, a("d09", "two point seven") - 40, a("d09", "two point seven") - 28, a("d09", "two point seven") - 16, a("d09", "two point seven") - 4];
  return [{label: "NET LOSS", v: -80.7, kind: "start" as const}, {label: "NOTE VALUE CHARGE", v: 72.4, note: "non-cash"}, {label: "OTHER FAIR-VALUE ITEM", v: 8.7, note: "also non-cash"},
    {label: "STOCK-BASED PAY", v: 2.2}, {label: "OTHER", v: 0.1}, {label: "ADJUSTED NET INCOME", v: 2.7, kind: "total" as const, note: "company's measure"}]
    .slice(0, upto).map((r, i) => ({...r, at: t[i]}));
};
const d08a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("netloss", "$80.7 billion", 4, d, 1.6, 960, 500, 1700, -0.5)} chip={pg("netloss")} chip2="Net loss · Jan–Jun 2026">
    <Doc f={f} name="netloss" x={960} y={500} width={1700} rot={-0.5} hl={[["$80.7 billion", a("d08", "eighty point") - 4]]}/>
  </Desk>));
const d08b = mk((f, a, d) => (
  <Black f={f} d={d} chip={pg("netloss")} chip2="US$ billions · Jan–Jun 2026">
    <HBridge f={f} title="From net loss to cash reality" source="Anthropic S-1 · pp.64, 157 · US$ billions" min={-85} max={14} rows={BR(a, 2)}/>
  </Black>));
const d08c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("fvnotes", "increase in the fair value of our outstanding convertible promissory notes", 2, d, 1.12, 960, 500, 1700, -0.5)} chip={pg("fvnotes")} chip2="Footnote: change in fair value, Jan–Jun 2026">
    <Doc f={f} name="fvnotes" x={960} y={500} width={1700} rot={-0.5} hl={[["$72.4 billion", -100], ["increase in the fair value of our outstanding convertible promissory notes", 2]]}/>
  </Desk>));
const d09a = mk((f, a, d) => <Words f={f} d={d} text="It isn't cash." at={1} mark={["cash."]} markAt={8} size={170}/>);
const d09b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 540]]} chip={S1P(157) + " · conversion at the offering"} chip2="Pro forma: notes convert into shares">
    <BizCard f={f} at={0} x={620} y={500} name="CONVERTIBLE NOTES" icon="doc" w={420} rot={-3}/>
    <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
      {f >= a("d09", "turn into") ? <path d="M 860 500 L 1060 500 M 1030 470 L 1065 500 L 1030 530" fill="none" stroke={C.markerRed} strokeWidth={12} strokeLinecap="round"/> : null}
    </svg>
    <BizCard f={f} at={a("d09", "turn into") + 4} x={1300} y={500} name="MORE SHARES" icon="crowd" w={420} rot={3}/>
    <Lab f={f} at={a("d09", "not money out") - 2} text="not money out" x={960} y={920} size={44} color={C.markerRed}/>
  </Desk>));
const d09c = mk((f, a, d) => (
  <Black f={f} d={d} chip={MEASURE} chip2={P157 + " · US$ billions"}>
    <HBridge f={f} title="From net loss to adjusted net income" source="Anthropic S-1 · pp.64, 157 · US$ billions" min={-85} max={14} rows={BR(a, 6).map((r, i) => i < 2 ? {...r, at: -100} : r)}/>
  </Black>));
// ---- d10 [27]
const d10a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 540]]} chip={pg("raised")} chip2="As of June 30, 2026">
    <Safe f={f} at={a("d10", "hundred and twelve") - 6} x={660} y={520} v="$112.4B" label="cash" s={1.25}/>
    <Safe f={f} at={a("d10", "nineteen") - 6} x={1290} y={520} v="$19.3B" label="short-term investments" s={1.25} tint="#6B7A5E"/>
  </Desk>));
const d10b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("raised", "$141.1 billion", 14, d, 1.15, 960, 640, 1700, -0.5)} chip={pg("raised")} chip2="Capital raised so far, to June 30, 2026">
    <PriceTag f={f} at={0} x={760} y={70} text="RAISED $141.1B" size={84} swing={0.6}/>
    <Doc f={f} name="raised" x={960} y={640} width={1700} rot={-0.5} hl={[["$141.1 billion", 6], ["$112.4 billion", -100], ["$19.3 billion", -100]]}/>
  </Desk>));
void Usd; void PUSH;

export const SHOTS2: Shot[] = [
  S("d01", -0.85, PU, d01card), S("d01", "from January", WD, d01b),
  S("d02", 0, H0, d02a), S("d02", "mostly the computing", PU, d02b), S("d02", "About sixty", WD, d02c),
  S("d03", 0, H0, d03a), S("d03", "Counted another", H0, d03b), S("d03", "much of it", PU, d03c),
  S("d04", 0, WD, d04a), S("d04", "so over the", PU, d04b), S("d04", "But the half", WL, d04c), S("d04", "From January", WD, d04d),
  S("d05", 0, PU, d05a), S("d05", "In one year", WR, d05b),
  S("d06", 0, PU, d06a), S("d06", "And a further", WL, d06b),
  S("d07", 0, PU, d07a), S("d07", "A year before", WD, d07b),
  S("d08", 0, WL, d08a), S("d08", "Because seventy", WD, d08b), S("d08", "which rose", PU, d08c),
  S("d09", 0, H0, d09a), S("d09", "The notes are", PU, d09b), S("d09", "On its own", WD, d09c),
  S("d10", 0, PU, d10a), S("d10", "from a hundred and forty", WR, d10b),
];
export const CUES2: SCue[] = [
  [W("d01", -0.85), "paper", 0.6], [W("d02", "fifteen"), "ding", 0.4], [W("d02", "the computing"), "highlighter", 0.4], [W("d02", "sixty"), "ding", 0.4],
  [W("d03", "fifty five"), "highlighter", 0.5], [W("d04", "a dollar and four"), "ding", 0.4], [W("d04", "four cents"), "stamp", 0.4], [W("d04", "From April"), "ding", 0.5],
  [W("d05", "two dollars"), "pop", 0.5], [W("d05", "to four"), "circle", 0.4], [W("d06", "thirteen"), "stamp", 0.5], [W("d06", "blank"), "stamp", 0.5],
  [W("d07", "three point"), "ding", 0.4], [W("d08", "eighty point"), "highlighter", 0.5], [W("d08", "seventy two"), "whoosh", 0.4], [W("d09", "turn into"), "pop", 0.5],
  [W("d09", "two point seven"), "ding", 0.4], [W("d10", "hundred and twelve"), "click", 0.5], [W("d10", "forty one"), "highlighter", 0.4],
];
