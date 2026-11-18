// swiggyq2 chapter 3 "What does break-even take?" (k01-k06). Company's claims and expectations are chipped as such.
import React from "react";
import {SCue} from "./A01V4Cold";
import {ChapterQ, SP, Shot, Words} from "./A01V4Parts";
import {StickerLabel} from "./Collage";
import {C, ease, inOut, useTicks} from "./tokens";
import {H0, PU, PUSH, S, W, WD, WL, WR, WU, useAt} from "./SwiggyCue";
import {Bars, Big, Black, Desk, Disc, Doc, Head, Lab, LETTER, Receipt} from "./SwiggyPieces";
import {CalStrip, LineChart, PriceTag, Thirds} from "./SwiggyKit";
import {ARITH, MEASURE} from "./SwiggyS1";

export const IMLOSS = (t: number, flagAt?: number) => [{label: "JUL–SEP 25", v: -849, txt: "–849", at: t}, {label: "OCT–DEC", v: -908, txt: "–908", at: t + 3},
  {label: "JAN–MAR", v: -858, txt: "–858", at: t + 6}, {label: "APR–JUN", v: -778, txt: "–778", at: t + 9}, {label: "JUL–SEP 26", v: -895, txt: "–895", at: t + 12, key: true}];
export const PeakFlag: React.FC<{f: number; at: number; x: number; y: number}> = ({f, at, x, y}) => {
  const p = ease(f, at, at + 12, inOut);
  if (p <= 0) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `rotate(${4 * Math.sin(f * 0.1)}deg)`, transformOrigin: "0 260px"}}>
      <div style={{position: "absolute", left: 0, top: 0, width: 8, height: 260 * p, background: C.white}}/>
      <div style={{position: "absolute", left: 8, top: 0, background: C.markerRed, color: C.white, fontFamily: "Inter", fontWeight: 900, fontSize: 52, padding: "10px 22px",
        clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, whiteSpace: "nowrap"}}>PEAK?</div>
    </div>
  );
};

// ---------------------------------------------------------------- k01
const k01card: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <ChapterQ f={f} d={d} n={3} q="What does break-even take?" icon="calendar"/>;
};
const k01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.14, 1000, 560]]} chip={LETTER("14")} chip2="Company's claim">
      <Doc f={f} name="peaked" x={960} y={500} width={1600} hl={[["We believe the Adjusted EBITDA losses to have peaked out in Q2FY27.", a("k01", "We believe")]]}/>
    </Desk>
  );
};
const k01c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("8")} chip2={MEASURE}>
      <Bars f={f} title="Instamart, adjusted EBITDA" source="₹ crore · five quarters" max={150} min={-1000} box={{x: 260, y: 230, w: 1400, h: 600}} bw={180}
        bars={IMLOSS(0)}/>
      <PeakFlag f={f} at={6} x={1520} y={140}/>
      <Head f={f} at={10} text="PEAKED OUT?" x={460} y={930} light/>
    </Black>
  );
};
const k01d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.06, 960, 520], [d, 1.16, 900, 500]]} chip={LETTER("14")} chip2="Company's expectation">
      <Doc f={f} name="peaked" x={960} y={500} width={1600} hl={[["expect them to start reversing over the next couple of quarters", a("k01", "start reversing")]]}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- k02
const k02a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("14")} chip2="Dotted point: the company's expectation (about +1 pt); not a reported figure">
      <LineChart f={f} title="Instamart loss as a share of GOV" source="Adjusted EBITDA margin · % of gross order value" min={-13} max={-8}
        pts={[{label: "JAN–MAR", v: -10.9, txt: "–10.9%", at: -20}, {label: "APR–JUN", v: -9.8, txt: "–9.8%", at: -20}, {label: "JUL–SEP", v: -9.7, txt: "–9.7%", at: -20},
          {label: "OCT–DEC (EXPECTED)", v: -8.7, txt: "about +1 pt", at: a("k02", "improve"), dotted: true}]}/>
    </Black>
  );
};
const k02b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 900, 520]]} chip={LETTER("14")} chip2="Break-even on the company's adjusted EBITDA measure">
      <Doc f={f} name="breakeven" x={960} y={480} width={1620} hl={[["We need ~2.3x today", a("k02", "two point three") - 4]]}/>
      <Head f={f} at={a("k02", "spells out")} text="WHAT IT NEEDS" x={1400} y={860}/>
    </Desk>
  );
};
const k02c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("k02", "two point three");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={LETTER("14")} chip2="Company's target">
      <Disc f={f} at={0} name="store" x={420} y={500} size={260}/>
      <Disc f={f} at={t + 4} name="store" x={760} y={500} size={260}/>
      <div style={{position: "absolute", left: 1000, top: 370, width: 260 * 0.3 * ease(f, t + 8, t + 20), height: 260, overflow: "hidden"}}>
        <Disc f={f} at={t + 8} name="store" x={130} y={130} size={260}/></div>
      <Big f={f} at={t} text="×2.3" x={1500} y={480} size={220} color={C.markerRed}/>
      <Head f={f} at={t + 10} text="×2.3 THE SIZE" x={960} y={870}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- k03
const k03a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("14")} chip2="Order value after discounts (NOV), annualised">
      <Bars f={f} title="Instamart orders, per year" source="₹ crore · company's figures" max={68000} box={{x: 560, y: 300, w: 800, h: 560}}
        bars={[{label: "TODAY", v: 26400, txt: "₹26,400 cr", at: a("k03", "twenty six") - 6, key: true}, {label: "NEEDED", v: 60000, txt: "₹60,000 cr", at: a("k03", "sixty thousand") - 4}]}/>
      <Head f={f} at={a("k03", "a year")} text="A YEAR OF ORDERS" x={1620} y={260} rot={3} light/>
    </Black>
  );
};
const k03b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.05, 960, 540], [d, 1.16, 1100, 520]]} chip={LETTER("14")}>
      <Doc f={f} name="breakeven" x={960} y={500} width={1620} hl={[["60,000 Cr of annualised NOV, from INR 26,400 Cr today", 0]]}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- k04: ₹30 an order vs about –₹7 today
const k04a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 1100, 520]]} chip={LETTER("14")} chip2="Company's target: contribution per order">
      <PriceTag f={f} at={-30} x={380} y={150} text="₹9 STORE" size={90} dim={0.4}/>
      <PriceTag f={f} at={a("k04", "thirty rupees") - 4} x={1220} y={150} text="+₹30 / ORDER" size={120}/>
      <Head f={f} at={a("k04", "per order")} text="₹30 AN ORDER" x={1220} y={880}/>
    </Desk>
  );
};
const k04b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.1, 960, 470], [d, 1.0, 960, 520]]} chip={ARITH("–1.0% × ₹708 average order = –₹7.1")} chip2={LETTER("8, 14")}>
      <Receipt f={f} x={960} y={110} w={880} head="ONE AVERAGE ORDER" lines={[{l: "GROSS ORDER VALUE", r: "₹708", at: a("k04", "seven hundred")},
        {l: "CONTRIBUTION", r: "–1.0%", at: a("k04", "seven hundred") + 10}, {l: "LEFT OVER", r: "≈ –₹7", at: a("k04", "minus seven"), big: true, red: true}]} rot={-2}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- k05
const k05a: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="Where would it come from?" at={1} mark={["from?"]} markAt={8} size={130}/>;
};
const k05b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("15")} chip2="Company's claim">
      <Thirds f={f} at={a("k05", "Roughly")} at2={a("k05", "One third")}/>
      <Head f={f} at={a("k05", "Roughly") + 12} text="TWO THIRDS, ONE THIRD" x={960} y={220} light/>
    </Black>
  );
};
const k05c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const items: [string, string, "shelf" | "tag" | "doc"][] = [["product mix", "PRODUCT MIX", "shelf"], ["own brands", "OWN BRANDS", "tag"], ["advertising", "ADVERTISING", "doc"]];
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={LETTER("15")} chip2="Earning more per order">
      {items.map(([ph, t, ic], i) => (
        <React.Fragment key={t}>
          <Disc f={f} at={a("k05", ph) - 4} name={ic} x={480 + i * 480} y={500} size={240}/>
          <Lab f={f} at={a("k05", ph)} text={t} x={480 + i * 480} y={690}/>
        </React.Fragment>
      ))}
    </Desk>
  );
};
const k05d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 960, 500]]} chip={LETTER("15")} chip2="Company's claim">
      <Doc f={f} name="thirds" x={960} y={500} width={1620} hl={[["Roughly two-thirds of this will come from higher revenue per order", -20], ["one-third from lower cost per order", 0]]}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- k06: the rule change
const k06a: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="And a rule change." at={1} mark={["rule"]} markAt={8} size={160}/>;
};
const k06b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 900, 520]]} chip={LETTER("3, 15")}>
      <Doc f={f} name="iocc" x={960} y={460} width={1620} hl={[["49.5% (fully diluted basis) to qualify as an Indian Owned and Controlled entity", a("k06", "forty nine")]]}/>
      <Big f={f} at={a("k06", "forty nine")} text="49.5%" x={560} y={820} size={150} color={C.markerRed}/>
      <Lab f={f} at={a("k06", "forty nine") + 6} text="cap on foreign ownership" x={1160} y={820}/>
    </Desk>
  );
};
const k06c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 1000, 540]]} chip={LETTER("3")}>
      <Disc f={f} at={0} name="shelf" x={620} y={500} size={360}/>
      {[0, 1, 2, 3].map((i) => <Disc key={i} f={f} at={a("k06", "own the stock") + i * 4} name="box" x={1120 + (i % 2) * 230} y={380 + Math.floor(i / 2) * 230} size={180}/>)}
      <StickerLabel f={f} text="INSTAMART OWNS IT" x={1240} y={700} size={56} rot={-3} dark enter={{at: a("k06", "own the stock") + 10, mode: "pop"}}/>
      <Head f={f} at={4} text="OWNING THE STOCK" x={620} y={880}/>
    </Desk>
  );
};
const k06d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 1000, 540]]} chip={LETTER("15")} chip2="Company's plan · completes over 2-3 quarters">
      <CalStrip f={f} at={0} months={["OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR", "MAY", "JUN"]} from={1.5} to={8.9} arrowAt={4} label="MID-QUARTER START"/>
    </Desk>
  );
};
const k06e: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 1000, 520]]} chip={LETTER("15")} chip2="Company's expectation">
      <Doc f={f} name="bps80" x={960} y={460} width={1620} hl={[["The IOCC transition will start from mid-Q3 FY27", -20], ["contribution margin when fully rolled-out", a("k06", "zero point eight")]]}/>
      <Big f={f} at={a("k06", "zero point eight")} text="≈ +0.8 pt" x={1300} y={830} size={130} color={C.markerRed}/>
    </Desk>
  );
};

export const SHOTS3: Shot[] = [
  S("k01", -0.85, PU, k01card), S("k01", "Here is how far", WL, k01b), S("k01", "in the quarter just", WD, k01c), S("k01", "It also expects", PU, k01d),
  S("k02", 0, WD, k02a), S("k02", "And it spells", PU, k02b), S("k02", "First about", WR, k02c),
  S("k03", 0, WD, k03a), S("k03", "up from", PU, k03b),
  S("k04", 0, WL, k04a), S("k04", "Today", PU, k04b),
  S("k05", 0, H0, k05a), S("k05", "Roughly", WD, k05b), S("k05", "product mix", PU, k05c), S("k05", "One third", WL, k05d),
  S("k06", 0, H0, k06a), S("k06", "Shareholders approved", PU, k06b), S("k06", "That lets", WR, k06c), S("k06", "from the middle", WD, k06d), S("k06", "Swiggy says", PU, k06e),
];
export const CUES3: SCue[] = [
  [W("k01", -0.85), "paper", 0.6], [W("k01", "We believe"), "highlighter", 0.5], [W("k01", "in the quarter just"), "stamp", 0.5], [W("k01", "start reversing"), "highlighter", 0.4],
  [W("k02", "improve"), "pop", 0.5], [W("k02", "two point three"), "ding", 0.5], [W("k03", "sixty thousand"), "ding", 0.5], [W("k04", "thirty rupees"), "paper", 0.5],
  [W("k04", "minus seven"), "stamp", 0.6], [W("k05", "Roughly"), "whoosh", 0.5], [W("k05", "One third"), "pop", 0.4], [W("k06", "forty nine"), "highlighter", 0.4],
  [W("k06", "own the stock"), "pop", 0.5], [W("k06", "zero point eight"), "ding", 0.4],
];
