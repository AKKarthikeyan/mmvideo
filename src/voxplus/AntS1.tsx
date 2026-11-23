// ants1 cold open (c01-c04) and "What Anthropic sells" (w01-w02). Figures: docs/global-launch/EP_ANTHROPIC_S1_SCRIPT.md (draft 2, AK sign-off 27 Oct 2026),
// ledger rows in brackets. Names of companies appear as text stickers only (no logos).
import React from "react";
import {SCue} from "./A01V4Cold";
import {ChapterQ, Shot, Words} from "./A01V4Parts";
import {CamKey} from "./Camera";
import {StickerLabel} from "./Collage";
import {C} from "./tokens";
import {H0, PU, PUSH, S, W, WD, WL, WR} from "./AntCue";
import {BizCard, Black, Desk, Disc, Doc, DocName, Head, Lab, S1, S1P, Usd, aimAt, pg, Bars} from "./AntPieces";
import {CalStrip, PriceTag, QuoteCard, mk} from "./AntKit";
import {AtlasMark, Bill, CodeWindow, SandTimer} from "./AntProps";
import {StickyNote} from "./A01V4Parts";

/** camera keys that settle, then push in on one phrase of a Doc (doc placed at x, y, width, rot) */
export const zoomCam = (name: DocName, phrase: string, t0: number, d: number, Z: number, x = 960, y = 520, width = 1500, rot = -0.8): CamKey[] => {
  const p = aimAt(name, phrase, x, y, width, rot), a = Math.max(1, t0);
  return a + 23 < d ? [[0, 1.0, 960, 540], [a, 1.0, 960, 540], [a + 22, Z, p.x, p.y], [d, Z * 1.03, p.x, p.y]] : [[0, 1.0, 960, 540], [Math.max(a + 1, d), Z, p.x, p.y]];
};
export const ARITH = "Our arithmetic on the S-1";
export const MEASURE = "Company's measure · not standard accounts";
export const CLAIM = "Company's claim";
export const READING = "Our reading";
export const P148 = S1P(148), P149 = S1P(149), P157 = S1P(157), P158 = S1P(158), P169 = S1P(169);
export const NOTE = "COPY IN 6 MONTHS?";
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// ---- c01 the revenue [1, 2, 3]
const c01a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.08, 960, 520], [d, 1.0, 960, 540]]} chip={P148} chip2="Calendar 2026">
    <CalStrip f={f} at={0} months={MONTHS} from={0} to={6} arrowAt={a("c01", "first six") - 4} label="JAN–JUN 2026"/>
    <StickerLabel f={f} text="ANTHROPIC" x={960} y={210} size={84} rot={-2} dark enter={{at: a("c01", "Anthropic"), mode: "pop", rot0: -8}}/>
    <Lab f={f} at={a("c01", "the company behind")} text="the company behind Claude" x={960} y={300} size={36}/>
  </Desk>));
const c01b = mk((f, a, d) => (
  <Black f={f} d={d} chip={P148} chip2="Revenue · Jan–Jun 2026 · US$">
    <Usd f={f} at={a("c01", "sixteen") - 4} v={16.3} x={960} y={470} size={300} color={C.white}/>
    <Lab f={f} at={a("c01", "of revenue") - 2} text="revenue · Jan–Jun 2026" x={960} y={700} size={44} color="#CFC9BE"/>
  </Black>));
const c01c = mk((f, a, d) => (
  <Black f={f} d={d} chip={P148} chip2="US$ billions · first half of each year">
    <Bars f={f} title="Revenue, January to June" source="Anthropic S-1 · p.148 · US$ billions" max={18} box={{x: 560, y: 300, w: 800, h: 560}}
      bars={[{label: "JAN–JUN 2025", v: 1.163, txt: "$1.2B", at: a("c01", "one point") - 4}, {label: "JAN–JUN 2026", v: 16.286, txt: "$16.3B", at: 0, key: true}]}/>
  </Black>));
// ---- c02 the filing, the $1.04 [4, 5]
const c02a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 470]]} chip="Anthropic S-1 · cover page" chip2="Preliminary prospectus · some figures still blank">
    <QuoteCard f={f} head="Registration statement · US Securities and Exchange Commission" lines={["ANTHROPIC, PBC", "FORM S-1", "Filed October 26, 2026 · Class A common stock"]}
      hl={[["Filed October 26, 2026", a("c02", "October") - 2]]} w={1300} size={58} y={520}/>
  </Desk>));
const c02b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={P148}>
    <Bill f={f} at={0} x={960} y={500} w={980}/>
    <Head f={f} at={a("c02", "growth cost") - 2} text="WHAT DID GROWTH COST?" x={960} y={880} size={70}/>
  </Desk>));
const c02c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 900, 480]]} chip={ARITH + ": 16,979 ÷ 16,286 · p.148"} chip2="Operating costs per $1 of revenue · Jan–Jun 2026">
    <Bill f={f} at={-30} x={760} y={560} w={900} rot={-4}/>
    <PriceTag f={f} at={a("c02", "a dollar and four") - 10} x={1420} y={140} text="$1.04" size={130}/>
    <Lab f={f} at={a("c02", "for every dollar")} text="spent for every $1 of revenue" x={1420} y={700} size={34}/>
  </Desk>));
// ---- c03 the strange part [6]
const c03a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("new80", "September 30, 2026 accounted for over 80% of our revenue", a("c03", "eighty") - 10, d, 1.7, 960, 500, 1700, -0.5)}
    chip={pg("new80")} chip2="Revenue for Jul–Sep 2026">
    <Doc f={f} name="new80" x={960} y={500} width={1700} rot={-0.5} hl={[["model versions released in the six months ended", a("c03", "models released") - 2],
      ["September 30, 2026 accounted for over 80% of our revenue", a("c03", "eighty") - 2]]}/>
  </Desk>));
const c03b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={pg("new80")}>
    <SandTimer f={f} at={0} x={960} y={470} s={1.2} run={240}/>
    <Head f={f} at={a("c03", "half a year")} text="AT MOST 6 MONTHS OLD" x={960} y={900} size={66}/>
  </Desk>));
// ---- c04 the big question
const c04a = mk((f, a, d) => <Words f={f} d={d} text="What can't be copied?" at={2} mark={["copied?"]} markAt={a("c04", "copy") - 2} size={150}/>);
const c04b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.06, 960, 520], [d, 1.0, 960, 540]]}>
    <Bill f={f} at={0} x={960} y={480} w={1000} rot={-2}/>
    <StickyNote f={f} at={2} text={NOTE} x={1640} y={190}/>
    <Head f={f} at={a("c04", "follow the dollar") - 4} text="FOLLOW THE DOLLAR" x={960} y={880} size={74}/>
    <AtlasMark f={f} at={a("c04", "follow the dollar") + 8} x={110} y={150} s={1.2}/>
  </Desk>));

// ---- w01 what it sells [7, 41]
const w01card = mk((f, a, d) => <ChapterQ f={f} d={d} n={1} q="What Anthropic sells" icon="shop"/>);
const w01b = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 540]]} chip={S1P(9)} chip2={'"Three ways" is our grouping'}>
    <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
      {[300, 540, 780].map((y, i) => {
        const t = [a("w01", "Developers"), a("w01", "People and"), a("w01", "And it's sold")][i] + 10;
        return f >= t ? <line key={i} x1={980} y1={y} x2={1260} y2={540} stroke={C.markerRed} strokeWidth={9} strokeDasharray="22 14" strokeLinecap="round"/> : null;
      })}
    </svg>
    <BizCard f={f} at={0} x={1500} y={540} name="CLAUDE" icon="star" w={400} rot={2}/>
    <Disc f={f} at={a("w01", "Developers")} name="gear" x={860} y={300} size={170}/>
    <Lab f={f} at={a("w01", "Developers") + 4} text="developers · its platform" x={730} y={300} size={27} anchor="r"/>
    <Disc f={f} at={a("w01", "People and")} name="phone" x={860} y={540} size={170}/>
    <Lab f={f} at={a("w01", "People and") + 4} text="people and companies · its apps" x={730} y={540} size={27} anchor="r"/>
    <Disc f={f} at={a("w01", "And it's sold")} name="globe" x={860} y={780} size={170}/>
    <Lab f={f} at={a("w01", "And it's sold") + 4} text="the three big clouds" x={730} y={780} size={27} anchor="r"/>
  </Desk>));
const w01c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.04, 960, 540], [d, 1.0, 960, 540]]} chip={S1P(74)} chip2="Names as text only">
    {["AMAZON", "GOOGLE", "MICROSOFT"].map((n, i) => (
      <StickerLabel key={n} f={f} text={n} x={420 + i * 540} y={300} size={64} rot={[-3, 2, -1][i]} dark enter={{at: i * 4, mode: "drop"}}/>))}
    {[["COMPUTE SUPPLIERS", "compute"], ["INVESTORS", "investors"], ["CUSTOMERS", "customers"]].map(([t, w], i) => (
      <StickerLabel key={t} f={f} text={t} x={960} y={520 + i * 140} size={56} rot={[-1, 1.5, -2][i]} enter={{at: a("w01", w) - 2, mode: "pop"}}/>))}
  </Desk>));
// ---- w02 partners and the coding agent [8, 9]
const w02a = mk((f, a, d) => (
  <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 540]]} chip={S1}>
    <StickerLabel f={f} text="ACCENTURE" x={640} y={420} size={70} rot={-3} dark enter={{at: a("w02", "Accenture") - 2, mode: "drop"}}/>
    <StickerLabel f={f} text="DELOITTE" x={1280} y={440} size={70} rot={2} dark enter={{at: a("w02", "Deloitte") - 2, mode: "drop"}}/>
    <Lab f={f} at={a("w02", "bring it")} text="bring Claude to their clients" x={960} y={640} size={40}/>
  </Desk>));
const w02b = mk((f, a, d) => (
  <Desk f={f} d={d} tone="kraft" cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip="Illustration · not a product screenshot">
    <CodeWindow f={f} at={0} x={960} y={500} w={1200} lines={["$ claude", "> fix the failing test in billing.py", "  reading billing.py ...", "  editing 2 files ...", "  tests pass"]}/>
    <StickerLabel f={f} text="CLAUDE CODE" x={1460} y={860} size={56} rot={-3} dark enter={{at: a("w02", "Claude Code") - 2, mode: "pop"}}/>
  </Desk>));
const w02c = mk((f, a, d) => (
  <Desk f={f} d={d} cam={zoomCam("coding", "Claude Code, our coding agent", 4, d, 1.6, 960, 520, 1700, -0.6)} chip={pg("coding")}>
    <Doc f={f} name="coding" x={960} y={520} width={1700} rot={-0.6} hl={[["Claude Code, our coding agent", a("w02", "coding agent") - 8]]}/>
  </Desk>));

export const SHOTS1: Shot[] = [
  S("c01", 0, H0, c01a), S("c01", "booked sixteen", WL, c01b), S("c01", "In the same", PU, c01c),
  S("c02", 0, WD, c02a), S("c02", "And the filing", PU, c02b), S("c02", "In operating", WR, c02c),
  S("c03", 0, WL, c03a), S("c03", "Most of what", PU, c03b),
  S("c04", 0, WD, c04a), S("c04", "To answer", PU, c04b),
  S("w01", -0.85, PU, w01card), S("w01", "Developers", WL, w01b), S("w01", "which are also", WD, w01c),
  S("w02", 0, PU, w02a), S("w02", "And its flagship", WR, w02b), S("w02", "which the filing", PUSH(960, 540), w02c),
];
export const CUES1: SCue[] = [
  [W("c01", 0.05), "paper", 0.6], [W("c01", "booked sixteen"), "ding", 0.5], [W("c02", "October"), "highlighter", 0.4], [W("c02", "a dollar and four"), "stamp", 0.5],
  [W("c03", "eighty"), "highlighter", 0.5], [W("c03", "Most of what"), "paper", 0.4], [W("c04", "To answer"), "paper", 0.5], [W("c04", "follow the dollar"), "stamp", 0.5],
  [W("w01", -0.85), "paper", 0.6], [W("w01", "Developers"), "pop", 0.5], [W("w01", "which are also"), "whoosh", 0.4],
  [W("w02", "Accenture"), "pop", 0.5], [W("w02", "which the filing"), "highlighter", 0.4],
];
