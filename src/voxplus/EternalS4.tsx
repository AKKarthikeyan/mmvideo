// eternalq2 "But..." (b01-b05), the ending back on the receipt (e01-e02) and the end card.
import React from "react";
import {AbsoluteFill} from "remotion";
import {SCue} from "./A01V4Cold";
import {SP, Shot, StickyNote, Words} from "./A01V4Parts";
import {StickerLabel} from "./Collage";
import {Finish, InkSurface} from "./Texture";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr, step, useTicks} from "./tokens";
import {END, H0, MZ, PU, S, W, WD, WL, WR, WU, useAt} from "./EternalCue";
import {Desk, Big, BizCard, Black, Chain, Counter, Cursor, Disc, Doc, Head, Lab, LETTER, Receipt, Rs, SLIP, Squares, XI} from "./EternalPieces";

const MEASURE = "Company's measure: adjusted EBITDA";
const CHAIN = [{icon: "pot" as const, label: "RESTAURANT KITCHEN"}, {icon: "scooter" as const, label: "RIDER"}, {icon: "store" as const, label: "DARK STORE"}, {icon: "shelf" as const, label: "INVENTORY"}];

const b01a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="But..." at={0} size={260} mark={["But..."]} markAt={10}/>;
};
const b01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const lift = ease(f, 6, 24, inOut);
  return (
    <Desk f={f} d={d} cam={[[0, 0.95, 960, 540], [d, 1.0, 960, 560]]} chip={LETTER("6-8")} chip2="The company's own argument">
      <div style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${lift * 60}px, ${-lift * 40}px) rotate(${-2 * lift}deg)`,
        background: `rgba(255,255,255,${0.18 + 0.25 * lift})`, boxShadow: lift > 0.1 ? "0 20px 50px rgba(0,0,0,0.2)" : undefined}}>
        <Chain f={f} at={-40} items={CHAIN} taut={1}/>
      </div>
      <StickerLabel f={f} text="COMPANY'S VIEW" x={1420} y={200} size={60} rot={4} color={C.white} bg={C.markerRed} enter={{at: a("b01", "own argument"), mode: "drop"}}/>
      <Head f={f} at={a("b01", "own business")} text="THEIR OWN ARGUMENT" x={760} y={900}/>
    </Desk>
  );
};
const b01c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 960, 520]]} chip={LETTER("8")}>
      <Doc f={f} name="incumbents" x={960} y={520} width={1560} hl={[["We are conscious that as incumbents, we may be predisposed to see resilience where others see", a("b01", "We are conscious")],
        ["vulnerability.", a("b01", "vulnerability") - 4]]}/>
    </Desk>
  );
};
const b02a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 900, 520]]} chip={LETTER("8")}>
      <Doc f={f} name="digitaltrust" x={960} y={500} width={1560} hl={[["observing how this plays out in", a("b02", "watching")]]}/>
      <Head f={f} at={a("b02", "other markets")} text="WATCHING OTHERS FIRST" x={1250} y={860} size={54}/>
    </Desk>
  );
};
const Gap: React.FC<{f: number; at: number; x: number; y: number; t: string}> = ({f, at, x, y, t}) => {
  if (f < at) return null;
  const k = spr(f, at, 11, 200);
  return (
    <div style={{position: "absolute", left: x - 220, top: y - 90, width: 440, height: 180, border: `5px dashed ${C.inkSoft}`, background: "rgba(255,255,255,0.4)",
      transform: `scale(${0.5 + 0.5 * k})`, opacity: clamp01(k * 3), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
      <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 34, letterSpacing: 2, color: C.inkSoft}}>{t}</div>
      <div style={{fontFamily: F.marker, fontSize: 80, color: C.markerRed, lineHeight: 1}}>?</div>
    </div>
  );
};
const b02b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 560]]} chip={LETTER("16, Annexure A")} chip2="Our reading of the letter and results">
      <div style={{position: "absolute", left: 960 - 560, top: 180, width: 1120, background: "#FBF8F1", padding: "26px 40px", boxShadow: "0 12px 26px rgba(30,20,10,0.22)",
        opacity: ease(f, a("b02", "total capital") - 4, a("b02", "total capital") + 6), display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
        <span style={{fontFamily: F.sans, fontWeight: 800, fontSize: 40}}>CAPITAL SPENDING, Q2 FY27</span>
        <span style={{fontFamily: F.serif, fontSize: 90}}><span style={{fontFamily: F.sans, fontWeight: 700, fontSize: 70}}>₹</span>941<span style={{fontFamily: F.sans, fontWeight: 700, fontSize: 40}}> cr</span></span>
      </div>
      <Lab f={f} at={a("b02", "total capital") + 8} text="all businesses together" x={960} y={360} size={28}/>
      <Gap f={f} at={a("b02", "cost per new")} x={460} y={600} t="COST PER STORE"/>
      <Gap f={f} at={a("b02", "payback")} x={960} y={600} t="PAYBACK"/>
      <Gap f={f} at={a("b02", "market share")} x={1460} y={600} t="MARKET SHARE"/>
      <Head f={f} at={a("b02", "leave things out")} text="NOT IN THE FILINGS" x={960} y={880}/>
    </Desk>
  );
};
const b03a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 860, 520]]} chip={LETTER("5")}>
      <Doc f={f} name="darkq" x={960} y={500} width={1500} hl={[["Q1. What", a("b03", "very first")]]}/>
      <Head f={f} at={a("b03", "very first")} text="ANSWER NUMBER ONE" x={1300} y={880} size={54}/>
    </Desk>
  );
};
const b03b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("5")} chip2="Company's description">
      <StickerLabel f={f} text="DARK.AI" x={960} y={460} size={170} rot={-2} enter={{at: 2, mode: "drop"}}/>
      <Disc f={f} at={a("b03", "private") - 4} name="lock" x={960} y={760} size={190}/>
      <Lab f={f} at={a("b03", "private")} text="private, it says" x={960} y={920} color="#CFC9BE"/>
    </Black>
  );
};
const b03c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const np = a("b03", "no price");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 560]]} chip={LETTER("5")}>
      <Doc f={f} name="darklaunch" x={960} y={430} width={1500} hl={[["Dark will launch globally, hopefully within 2026.", 0]]}/>
      <StickerLabel f={f} text="PRICE: ?   SPEND: ?" x={1260} y={820} size={60} rot={-3} color={C.white} bg={C.markerRed} enter={{at: np, mode: "drop"}}/>
      <Head f={f} at={np + 10} text="ITS OWN AI" x={500} y={880}/>
    </Desk>
  );
};
const b04a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("13")} chip2="Group cash balance, as the company counts it">
      <Lab f={f} at={0} text="Eternal cash balance, 30 Sep 2026" x={960} y={260} color="#CFC9BE" size={38}/>
      <Rs f={f} at={2} v={16475} x={960} y={500} size={230} color={C.white}/>
      <StickerLabel f={f} text="–₹1,813 CR IN THE QUARTER" x={960} y={740} size={60} rot={-3} color={C.white} bg={C.markerRed} enter={{at: a("b04", "one thousand eight"), mode: "drop"}}/>
    </Black>
  );
};
const b04b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={LETTER("13")}>
      <Doc f={f} name="cash" x={960} y={480} width={1560} hl={[["built inventory ahead of the festive season", a("b04", "festive")], ["restaurant settlement cycle", a("b04", "timing")]]}/>
      <Head f={f} at={a("b04", "main driver")} text="MAIN DRIVER" x={500} y={860}/>
    </Desk>
  );
};
const b05a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 860, 520]]} chip={LETTER("7")}>
      <Doc f={f} name="winner" x={960} y={500} width={1400} hl={[["Agents could end up making some categories", a("b05", "agents could")]]}/>
      <Head f={f} at={a("b05", "winner")} text="WINNER TAKES ALL?" x={1250} y={860}/>
    </Desk>
  );
};
const b05b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const g = ease(f, 4, d - 6, inOut);
  const ws = [0.4 + 0.5 * g, 0.4 - 0.15 * g, 0.4 - 0.2 * g];
  return (
    <Black f={f} d={d} chip={LETTER("7")} chip2="Illustration · no names, no figures">
      <div style={{position: "absolute", left: 120, top: 100, fontFamily: F.serif, fontSize: 76, color: C.white}}>Whoever executes best</div>
      {ws.map((w, i) => (
        <React.Fragment key={i}>
          <div style={{position: "absolute", left: 420, top: 340 + i * 190, width: 1200 * w, height: 120, background: i === 0 ? C.highlightPrint : "rgba(255,255,255,0.35)"}}/>
          <Lab f={f} at={0} text={"Platform " + "ABC"[i]} x={260} y={400 + i * 190} color="#CFC9BE" size={30}/>
        </React.Fragment>
      ))}
    </Black>
  );
};
const b05c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip="Our arithmetic: 627 ÷ 666 = 94%" chip2={MEASURE}>
      <Squares f={f} at={0} fill={94} x={760} y={540} cell={76} per={0.0}/>
      <Big f={f} at={a("b05", "ninety four")} text="94%" x={1530} y={470} size={210} color={C.highlightPrint}/>
      <Lab f={f} at={a("b05", "food delivery")} text="from food delivery" x={1530} y={640} color="#CFC9BE"/>
    </Black>
  );
};
// ending: same receipt framing as c01a (match cut)
const e01a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const ph = a("e01", "physical part");
  return (
    <Desk f={f} d={d} cam={[[0, 1.25, 960, 470], [ph, 1.15, 960, 500], [d, 1.0, 960, 540, inOut]]} chip="Our reading" chip2={MEASURE}>
      <Receipt f={f} x={960} y={150} enterAt={-30} lines={SLIP(-30, -30, -30)} rot={-2}/>
      <StickyNote f={f} at={-30} text="SKIP WHAT?" x={1640} y={210} unpin={ph - 10}/>
      <Head f={f} at={ph} text="THE PHYSICAL PART" x={960} y={900}/>
    </Desk>
  );
};
const e01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.04, 960, 540]]} chip="Our reading">
      <Disc f={f} at={a("e01", "store nearby")} name="store" x={500} y={520} size={260}/>
      <Disc f={f} at={a("e01", "rider")} name="scooter" x={960} y={520} size={260}/>
      <Disc f={f} at={a("e01", "shelf")} name="shelf" x={1420} y={520} size={260}/>
      <Cursor f={f} x={900} y={180} at={0} frozen label="AI AGENT"/>
      <Lab f={f} at={a("e01", "store nearby") + 4} text="store nearby" x={500} y={720}/>
      <Lab f={f} at={a("e01", "rider") + 4} text="rider" x={960} y={720}/>
      <Lab f={f} at={a("e01", "shelf") + 4} text="the shelf" x={1420} y={720}/>
    </Desk>
  );
};
const e02a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={LETTER("11")} chip2="Company's expectation">
      <Doc f={f} name="improving" x={960} y={500} width={1560} hl={[["We expect Adjusted EBITDA margins to keep improving through this expansion.", 2]]}/>
    </Desk>
  );
};
const e02b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 520]]} chip={LETTER("8, 11")} chip2="Company's plan">
      <Counter f={f} keys={[[0, 2751]]} x={760} y={520} label="STORES, 30 SEP 2026"/>
      <div style={{position: "absolute", left: 1330, top: 330, transform: `rotate(${4 * Math.sin(f * 0.1)}deg)`, transformOrigin: "0 300px"}}>
        <div style={{position: "absolute", left: 0, top: 0, width: 8, height: 340, background: C.ink}}/>
        <div style={{position: "absolute", left: 8, top: 0, background: C.markerRed, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: 56, padding: "14px 26px",
          clipPath: `inset(0 ${(1 - ease(f, 4, 16)) * 100}% 0 0)`, whiteSpace: "nowrap"}}>3,500 · MARCH 2027</div>
      </div>
      <Head f={f} at={a("e02", "checkpoint")} text="NEXT CHECK: MARCH" x={960} y={870}/>
    </Desk>
  );
};
const e02c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const g = a("e02", "keeps growing");
  return (
    <Desk f={f} d={d} cam={[[0, 1.15, 960, 500], [d, 1.25, 960, 470]]} chip={LETTER("8")} chip2={MEASURE}>
      <Receipt f={f} x={960} y={150} enterAt={-30} lines={[...SLIP(-30, -30, -30).slice(0, 2), {l: "BLINKIT MARGIN", r: f > g ? "₹ ?" : "₹0.90", at: -30, big: true}]} rot={-2}
        flickerAt={a("e02", "next letters")} qAt={g}/>
    </Desk>
  );
};
// end card: no voice; disclosure line in small type
export const EndCard: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  const p = ease(f, 0, 14, outQuint);
  return (
    <AbsoluteFill>
      <InkSurface glow={0.1}/>
      <div style={{position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: F.serif, fontSize: 130, color: C.white, opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`}}>Moat <span style={{color: C.highlightPrint}}>&amp;</span> Margin</div>
      <div style={{position: "absolute", left: 960 - 300, top: 540, width: 600, height: 14, background: C.highlight, transform: `scaleX(${ease(f, 8, 22, inOut)})`}}/>
      <div style={{position: "absolute", left: 200, right: 200, top: 640, textAlign: "center", fontFamily: F.sans, fontWeight: 600, fontSize: 34, color: "#CFC9BE", opacity: ease(f, 14, 26)}}>
        Every figure from Eternal's filings of 21 Oct 2026 · derived figures are our arithmetic</div>
      <div style={{position: "absolute", left: 200, right: 200, top: 860, textAlign: "center", fontFamily: F.mono, fontSize: 26, color: "#C4BEB3", letterSpacing: 1, opacity: ease(f, 10, 20)}}>
        Educational research, not investment advice. Not a SEBI-registered research analyst or investment adviser.</div>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};

export const SHOTS4: Shot[] = [
  S("b01", -0.85, H0, b01a), S("b01", "This is", PU, b01b), S("b01", "Quote", WR, b01c),
  S("b02", 0, PU, b02a), S("b02", "And the filings", WD, b02b),
  S("b03", 0, PU, b03a), S("b03", "dark dot", WU, b03b), S("b03", "It hopes", PU, b03c),
  S("b04", 0, WD, b04a), S("b04", "The letter says", PU, b04b),
  S("b05", 0, WL, b05a), S("b05", "favouring", WD, b05b), S("b05", "Food delivery", H0, b05c),
  S("e01", -0.7, MZ, e01a), S("e01", "The store nearby", PU, e01b),
  S("e02", 0, PU, e02a), S("e02", "The next checkpoint", WL, e02b), S("e02", "Its next letters", MZ, e02c),
  {id: "end", cut: END("e02") + 0.6, tr: {k: "hard"}, C: EndCard},
];
export const CUES4: SCue[] = [
  [W("b01", -0.85), "stamp", 0.7], [W("b01", "own argument"), "stamp", 0.5], [W("b01", "We are conscious"), "highlighter", 0.5],
  [W("b02", "watching"), "highlighter", 0.5], [W("b02", "cost per new"), "pop", 0.5], [W("b02", "payback"), "pop", 0.5], [W("b02", "market share"), "pop", 0.5],
  [W("b03", "dark dot"), "stamp", 0.5], [W("b03", "no price"), "stamp", 0.5], [W("b04", "one thousand eight"), "stamp", 0.6], [W("b04", "festive"), "highlighter", 0.5],
  [W("b05", "winner"), "highlighter", 0.5], [W("b05", "ninety four"), "ding", 0.5], [W("e01", -0.7), "whooshDeep", 0.5], [W("e01", "physical part"), "pop", 0.6],
  [W("e01", "store nearby"), "pop", 0.5], [W("e01", "rider"), "pop", 0.5], [W("e01", "shelf"), "pop", 0.5], [W("e02", "checkpoint"), "paper", 0.5], [W("e02", "keeps growing"), "circle", 0.6],
];
