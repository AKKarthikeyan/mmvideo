// swiggyq2 "But..." (b01-b06), the ending back on the ₹9 tag (e01-e02) and the end card.
import React from "react";
import {AbsoluteFill} from "remotion";
import {SCue} from "./A01V4Cold";
import {SP, Shot, Stamp, StickyNote, Words} from "./A01V4Parts";
import {StickerLabel} from "./Collage";
import {Finish, InkSurface} from "./Texture";
import {C, F, ease, inOut, outQuint, useTicks} from "./tokens";
import {END, H0, MZ, PU, PUSH, S, W, WD, WL, WR, WU, useAt} from "./SwiggyCue";
import {Bars, Big, BizCard, Black, Counter, Cursor, Desk, Doc, Head, Lab, LETTER, RowsCard} from "./SwiggyPieces";
import {Blocks, CashJar, PriceTag} from "./SwiggyKit";
import {ARITH, MEASURE} from "./SwiggyS1";
import {IMLOSS, PeakFlag} from "./SwiggyS3";

const ETERNAL = "Eternal shareholders' letter · 21 Oct 2026 · p.8";

// ---------------------------------------------------------------- b01
const b01a: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="But..." at={0} size={260} mark={["But..."]} markAt={10}/>;
};
const b01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 0.92, 960, 540], [d, 1.0, 960, 540]]} chip={LETTER("14-15")} chip2="The company's own forecasts and targets">
      <Doc f={f} name="breakeven" x={900} y={330} width={1300} rot={-3} enterAt={0} stack={1}/>
      <Doc f={f} name="thirds" x={1020} y={560} width={1300} rot={2} enterAt={4} stack={1}/>
      <Doc f={f} name="bps80" x={940} y={780} width={1300} rot={-1.5} enterAt={8} stack={1}/>
      <Stamp f={f} at={a("b01", "forecast")} text="COMPANY'S FORECAST" x={960} y={540} size={90} rot={-8}/>
    </Desk>
  );
};
const b01c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.05, 960, 540], [d, 1.12, 960, 520]]} chip={LETTER("whole letter searched")} chip2="Our check: no break-even date given">
      <div style={{position: "absolute", left: 660, top: 220, width: 600, height: 560, background: "#FBF8F1", borderTop: `60px solid ${C.markerRed}`,
        boxShadow: "0 16px 30px rgba(30,20,10,0.25)", transform: "rotate(-2deg)"}}>
        <div style={{textAlign: "center", marginTop: 40, fontFamily: F.sans, fontWeight: 800, fontSize: 40, letterSpacing: 4, color: C.inkSoft}}>BREAK-EVEN DATE</div>
      </div>
      <Big f={f} at={a("b01", "no date")} text="?" x={960} y={560} size={360} color={C.markerRed}/>
      <Head f={f} at={a("b01", "no date") + 6} text="NO DATE GIVEN" x={960} y={890}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- b02
const b02a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 900, 520]]} chip={LETTER("14")} chip2="Company's words">
      <Doc f={f} name="compete" x={960} y={500} width={1620} hl={[["Competitive intensity in the sector remains high, and we do not expect it to ease in the near-term", a("b02", "Competitive")]]}/>
    </Desk>
  );
};
const b02c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.25, 1100, 480], [d, 1.4, 1200, 480]]} chip={LETTER("14")} chip2="Company's words">
      <Doc f={f} name="compete" x={960} y={500} width={1620} hl={[["Competitive intensity in the sector remains high, and we do not expect it to ease in the near-term", -40]]}/>
      <Head f={f} at={4} text="NOT EASING" x={1300} y={760}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- b02b: the December-quarter range
const b02ba: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 1000, 520]]} chip={LETTER("14")} chip2="Company's expectation">
      <Doc f={f} name="q3range" x={960} y={500} width={1620} hl={[["we expect the contribution margin to remain within the", a("b02b", "expects contribution")],
        ["zero to -100 bps range in Q3FY27", a("b02b", "between zero")]]}/>
    </Desk>
  );
};
const Band: React.FC<{f: number; at: number}> = ({f, at}) => {
  const p = ease(f, at, at + 14, outQuint);
  return (
    <div style={{position: "absolute", left: 560, top: 620, width: 800 * p, height: 190, background: "rgba(14,14,14,0.12)", borderTop: "4px dashed #1F1C18", borderBottom: "4px dashed #1F1C18"}}>
      <div style={{position: "absolute", left: 20, top: 66, fontFamily: F.mono, fontSize: 28, letterSpacing: 2, color: C.ink, whiteSpace: "nowrap", opacity: p}}>DEC QUARTER: ₹0 TO –₹7 PER ORDER</div>
    </div>
  );
};
const b02bb: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 480]]} chip={ARITH("0 to –1.0% × ₹708 average order")} chip2={LETTER("14") + " · company's range and target"}>
      <PriceTag f={f} at={-30} x={1500} y={40} text="+₹30" size={110}/>
      <PriceTag f={f} at={-30} x={420} y={330} text="–₹7 TODAY" size={90} bg={C.markerRed} color={C.white}/>
      <Band f={f} at={a("b02b", "zero to minus seven")}/>
      <Head f={f} at={a("b02b", "zero to minus seven") + 6} text="ZERO TO –₹7" x={960} y={930} rot={-3}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <path d="M 1380 600 Q 1460 450 1500 330" fill="none" stroke={C.markerRed} strokeWidth={10} pathLength={1} strokeDasharray={1}
          strokeDashoffset={1 - ease(f, a("b02b", "against the thirty"), a("b02b", "against the thirty") + 14)}/>
      </svg>
    </Desk>
  );
};
// ---------------------------------------------------------------- b03: one line on Eternal's letter
const b03a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 1000, 540]]} chip={ETERNAL} chip2={ARITH("20,940 ÷ 6,594 = 3.2 (order value after discounts)")}>
      <Blocks f={f} rows={[{name: "INSTAMART", n: 1, at: 2}, {name: "BLINKIT", n: 3.2, at: 6, tint: "#F4E7B8"}]}/>
      <Head f={f} at={8} text="A LARGER RIVAL" x={960} y={140} rot={-2}/>
    </Desk>
  );
};
const b03b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 900, 520]]} chip={ETERNAL} chip2="Eternal's own measure: adjusted EBITDA">
      <Doc f={f} name="blinkit" x={960} y={500} width={1620} hl={[["INR 20,940 crore", a("b03", "three times") - 6], ["INR 184 crore profit", a("b03", "was a profit") - 4]]}/>
    </Desk>
  );
};
const b03c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={ETERNAL + " · Swiggy letter p.5"} chip2={ARITH("20,940 ÷ 6,594 = 3.2")}>
      <Bars f={f} title="Order value after discounts" source="Quarter to 30 Sep 2026 · ₹ crore · each company's NOV" max={23000} box={{x: 560, y: 300, w: 800, h: 560}}
        bars={[{label: "INSTAMART", v: 6594, txt: "₹6,594 cr", at: -20}, {label: "BLINKIT", v: 20940, txt: "₹20,940 cr", at: -10, key: true}]}/>
      <Big f={f} at={0} text="×3.2" x={1620} y={430} size={170} color={C.highlightPrint}/>
    </Black>
  );
};
// ---------------------------------------------------------------- b04: cash and Toing
const b04a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 1000, 540]]} chip={LETTER("17")} chip2="Group, consolidated cash balance">
      <CashJar f={f} at={a("b04", "fell")} v0={14367} v1={13662} vmax={16000} x={560}/>
      <Counter f={f} keys={[[0, 14367], [a("b04", "fell"), 14367], [a("b04", "fell") + 40, 13662]]} x={1260} y={440} size={150} pre="₹"/>
      <Lab f={f} at={2} text="crore, group cash balance" x={1260} y={590}/>
      <Lab f={f} at={a("b04", "seven hundred")} text="down ₹705 cr in the quarter" x={1260} y={650} color={C.markerRed}/>
      <Head f={f} at={a("b04", "thirteen thousand")} text="GROUP CASH FELL" x={1260} y={860}/>
    </Desk>
  );
};
const b04b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={LETTER("10, 11")}>
      <div style={{position: "absolute", left: 980, top: 420, width: 760, height: 420, background: "#C9A26B", boxShadow: "0 16px 30px rgba(30,20,10,0.3)", transform: "rotate(1deg)"}}>
        <div style={{position: "absolute", left: 0, right: 0, top: 160, textAlign: "center"}}><span style={{background: C.ink, color: C.white, fontFamily: F.sans, fontWeight: 900,
          fontSize: 46, letterSpacing: 3, padding: "10px 20px"}}>PLATFORM INNOVATIONS</span></div>
      </div>
      <div style={{position: "absolute", left: 0, top: 0, transform: `translate(${700 * ease(f, a("b04", "sits inside"), a("b04", "sits inside") + 20, inOut)}px, ${120 * ease(f, a("b04", "sits inside"), a("b04", "sits inside") + 20, inOut)}px)`}}>
        <BizCard f={f} at={0} x={480} y={420} name="TOING" icon="bowl" sub="budget meals app" rot={-3} w={320}/>
      </div>
    </Desk>
  );
};
// ---------------------------------------------------------------- b05: how much is Toing?
const b05a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("10")} chip2={MEASURE}>
      <Bars f={f} title="Platform Innovations, adjusted EBITDA" source="₹ crore · five quarters" max={30} min={-190} box={{x: 260, y: 260, w: 1400, h: 580}} bw={180}
        bars={[{label: "JUL–SEP 25", v: -46, txt: "–46", at: a("b05", "forty six") - 4}, {label: "OCT–DEC", v: -40, txt: "–40", at: 4}, {label: "JAN–MAR", v: -58, txt: "–58", at: 7},
          {label: "APR–JUN", v: -131, txt: "–131", at: 10}, {label: "JUL–SEP 26", v: -162, txt: "–162", at: a("b05", "one hundred and sixty") - 4, key: true}]}/>
    </Black>
  );
};
const b05b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const names = ["SWIGGY-MINIS", "SNACC", "TOING", "CREW", "JUS+"];
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={RESULTS_P("8, segment note")} chip2="Our check: no rupee figure for Toing">
      {names.map((n, i) => <StickerLabel key={n} f={f} text={n} x={300 + i * 330} y={460 + (i % 2) * 90} size={54} rot={(i % 2 ? 3 : -3)} dark={n !== "TOING"}
        bg={n === "TOING" ? C.highlight : undefined} enter={{at: i * 3, mode: "drop"}}/>)}
      <Big f={f} at={a("b05", "how much")} text="?" x={960} y={300} size={220} color={C.markerRed}/>
      <Head f={f} at={a("b05", "how much") + 6} text="HOW MUCH IS TOING?" x={960} y={860}/>
    </Desk>
  );
};
const RESULTS_P = (p: string) => `Swiggy results · 22 Oct 2026 · p.${p}`;
const b05c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 1000, 520]]} chip={LETTER("12")} chip2="Company's expectation">
      <Doc f={f} name="rangebound" x={960} y={500} width={1620} hl={[["investment outlay to be range bound in the short term", a("b05", "range bound") - 6]]}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- b06
const b06a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.14, 760, 500]]} chip={LETTER("14")} chip2="Company's words">
      <Doc f={f} name="peaked" x={960} y={500} width={1620} hl={[["discretionary and transient", a("b06", "discretionary")]]} circle={[["discretionary and transient", a("b06", "transient") + 6]]}/>
    </Desk>
  );
};
const b06b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tug = Math.sin(f * 0.35) * 70 * ease(f, a("b06", "competition"), a("b06", "competition") + 10);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip="Our reading" chip2="Illustration">
      <PriceTag f={f} at={-30} x={960 + tug} y={140} text="₹9 STORE" size={120}/>
      <Cursor f={f} x={560} y={560} at={2} label="SWIGGY" rot={-20}/>
      <Cursor f={f} x={1260 + tug} y={540} at={a("b06", "competition")} label="RIVALS" rot={10}/>
      <Head f={f} at={a("b06", "the only one")} text="WHO DECIDES?" x={960} y={890}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- e01 / e02: back to the ₹9 tag
const e01a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.15, 960, 520], [d, 1.05, 960, 540]]} chip={LETTER("13")}>
      <PriceTag f={f} at={0} x={900} y={180} text="₹9 STORE" size={130} q={6}/>
      <StickyNote f={f} at={-30} text="BUYING WHAT?" x={1640} y={210}/>
    </Desk>
  );
};
const e01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const ar = a("e01", "thirty rupees");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={ARITH("–1.0% × ₹708 = about –₹7 per order")} chip2={LETTER("14") + " · company's +₹30 requirement"}>
      <PriceTag f={f} at={-30} x={960} y={60} text="₹9 STORE" size={80} dim={0.5}/>
      <PriceTag f={f} at={a("e01", "seven rupees") - 6} x={470} y={300} text="–₹7 TODAY" size={100} bg={C.markerRed} color={C.white}/>
      <PriceTag f={f} at={ar - 6} x={1380} y={300} text="+₹30 / ORDER" size={96}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <path d="M 760 760 Q 960 640 1160 760" fill="none" stroke={C.ink} strokeWidth={10} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(f, ar, ar + 16)}/>
        <path d="M 1130 735 L 1165 762 L 1125 780" fill="none" stroke={C.ink} strokeWidth={10} opacity={ease(f, ar + 14, ar + 16)}/>
      </svg>
      <StickyNote f={f} at={-30} text="BUYING WHAT?" x={1640} y={160} unpin={ar + 10}/>
      <Head f={f} at={ar + 4} text="–₹7 TO +₹30" x={960} y={870}/>
    </Desk>
  );
};
const b06c: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="Who decides how long?" at={1} mark={["decides"]} markAt={8} size={140} chip="Our reading"/>;
};
const e01c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("14")} chip2={ARITH("–1.0% × ₹708")}>
      <PriceTag f={f} at={0} x={960} y={200} text="–₹7 TODAY" size={130} bg={C.markerRed} color={C.white}/>
      <Lab f={f} at={6} text="left after direct costs, average order" x={960} y={780} color={C.white} size={40}/>
    </Black>
  );
};
const e02a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("8, 14")} chip2={MEASURE}>
      <Bars f={f} title="Instamart, adjusted EBITDA" source="₹ crore · next: Oct–Dec 2026" max={150} min={-1000} box={{x: 200, y: 230, w: 1500, h: 600}} bw={170}
        bars={[...IMLOSS(-40), {label: "OCT–DEC", v: -1, txt: "?", at: a("e02", "December")}]}/>
      <PeakFlag f={f} at={-20} x={1330} y={140}/>
      <div style={{position: "absolute", left: 1560 - 85, top: 290, width: 170, height: 560, border: `5px dashed ${C.highlightPrint}`, opacity: ease(f, a("e02", "December"), a("e02", "December") + 10)}}/>
      <Head f={f} at={a("e02", "checkpoint")} text="NEXT CHECK: DECEMBER" x={760} y={950} light/>
    </Black>
  );
};
const e02b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.15, 960, 500]]} chip={LETTER("13, 14")}>
      <PriceTag f={f} at={-30} x={900} y={180} text="₹9 STORE" size={130} q={a("e02", "loss fell")}/>
    </Desk>
  );
};
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
        Every figure from Swiggy's filings of 22 Oct 2026 (and Eternal's letter of 21 Oct) · derived figures are our arithmetic</div>
      <div style={{position: "absolute", left: 200, right: 200, top: 860, textAlign: "center", fontFamily: F.mono, fontSize: 26, color: "#C4BEB3", letterSpacing: 1, opacity: ease(f, 10, 20)}}>
        Educational research, not investment advice. Not a SEBI-registered research analyst or investment adviser.</div>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};

export const SHOTS4: Shot[] = [
  S("b01", -0.85, H0, b01a), S("b01", "Almost everything", PU, b01b), S("b01", "And this letter", WR, b01c),
  S("b02", 0, PU, b02a), S("b02", "we do not expect", PUSH(1200, 480), b02c),
  S("b02b", 0, WL, b02ba), S("b02b", "At today's", PU, b02bb),
  S("b03", 0, WD, b03a), S("b03", "In Eternal's own", PU, b03b), S("b03", "by our arithmetic", WR, b03c),
  S("b04", 0, PU, b04a), S("b04", "And Toing", WL, b04b),
  S("b05", 0, WD, b05a), S("b05", "The letter does not", PU, b05b), S("b05", "It expects", WR, b05c),
  S("b06", 0, PU, b06a), S("b06", "Our reading", WL, b06b), S("b06", "the company may not", WU, b06c),
  S("e01", -0.7, MZ, e01a), S("e01", "By our arithmetic", PU, e01b, "e01b1"), S("e01", "after its direct", WD, e01c), S("e01", "Swiggy says", PU, e01b),
  S("e02", 0, WD, e02a), S("e02", "Its next letter", MZ, e02b),
  {id: "end", cut: END("e02") + 0.6, tr: {k: "hard"}, C: EndCard},
];
export const CUES4: SCue[] = [
  [W("b01", -0.85), "stamp", 0.7], [W("b01", "forecast"), "stamp", 0.5], [W("b01", "no date"), "pop", 0.5], [W("b02", "Competitive"), "highlighter", 0.5],
  [W("b02b", "between zero"), "highlighter", 0.4], [W("b02b", "zero to minus seven"), "stamp", 0.4], [W("b03", "In Eternal's own"), "paper", 0.5],
  [W("b03", "by our arithmetic"), "whoosh", 0.4], [W("b04", "fell"), "stamp", 0.5], [W("b04", "And Toing"), "paper", 0.5], [W("b05", "one hundred and sixty"), "stamp", 0.4],
  [W("b05", "how much"), "pop", 0.5], [W("b06", "discretionary"), "highlighter", 0.5], [W("b06", "competition"), "whoosh", 0.4], [W("e01", -0.7), "whooshDeep", 0.5],
  [W("e01", "seven rupees"), "stamp", 0.5], [W("e01", "thirty rupees"), "pop", 0.6], [W("e02", "checkpoint"), "paper", 0.5], [W("e02", "loss fell"), "circle", 0.6],
];
