// eternalq2 cold open (c01-c04) and chapter 1 "Where does the money come from?" (p01-p07).
// Figures: ledger rows in contentengine/drafts/2026-10-21/_video/script.md (Air). Adjusted EBITDA is always chipped COMPANY'S MEASURE.
import React from "react";
import {AbsoluteFill} from "remotion";
import {SCue} from "./A01V4Cold";
import {ChapterQ, SP, Shot, StickyNote, Words} from "./A01V4Parts";
import {camAt} from "./Camera";
import {SourceTag} from "./Cards";
import {StickerLabel} from "./Collage";
import {Finish, InkSurface} from "./Texture";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr, step, useTicks} from "./tokens";
import {H0, MZ, PU, PUSH, S, W, WD, WL, WR, WU, useAt} from "./EternalCue";
import {Desk, Bars, Big, BizCard, Black, Cursor, Disc, Doc, Head, Lab, LETTER, RESULTS, Receipt, RowsCard, Rs, SLIP, Squares} from "./EternalPieces";

const MEASURE = "Company's measure: adjusted EBITDA";

// ---------------------------------------------------------------- c01
const c01a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.25, 960, 470], [d, 1.12, 960, 500]]} chip={LETTER("8")} chip2={MEASURE}>
      <Receipt f={f} x={960} y={150} enterAt={0} lines={SLIP(2, 4, 8)} qAt={a("c01", "matter")} rot={-2}/>
      <Head f={f} at={a("c01", "matter") + 4} text="WHY IT MATTERS" x={1380} y={820}/>
    </Desk>
  );
};
const c01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const h = a("c01", "every hundred"), m = a("c01", "measure");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 520], [h, 1.05, 960, 470], [d, 1.6, 960, 560, inOut]]} chip={LETTER("8, 18-19")} chip2="Our arithmetic: 0.9% of order value = ₹0.90 per ₹100">
      <Receipt f={f} x={960} y={150} enterAt={-30} lines={SLIP(-30, -30, -30)} circleAt={m} rot={-2}/>
      <Lab f={f} at={a("c01", "after discounts")} text="order value after discounts" x={960} y={640} size={30}/>
    </Desk>
  );
};
const c01c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip="Our arithmetic: 184 ÷ 20,940 = 0.88%, rounded by the company to 0.9%" chip2={MEASURE}>
      <Squares f={f} at={0} fill={0.9} x={960} y={520} cell={78} per={0.0}/>
      <Lab f={f} at={8} text="₹100 of orders · one square = ₹1" x={960} y={950} color="#CFC9BE"/>
      <Big f={f} at={a("c01", "company's own") - 4} text="0.9%" x={1640} y={520} size={170} color={C.highlightPrint}/>
    </Black>
  );
};
// ---------------------------------------------------------------- c02
const c02a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={LETTER("7-8")}>
      <StickerLabel f={f} text="ETERNAL" x={960} y={260} size={90} rot={-2} dark enter={{at: 2, mode: "drop"}}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <path d="M 960 320 L 960 470" stroke={C.ink} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(f, 8, 16)}/>
      </svg>
      <StickerLabel f={f} text="BLINKIT" x={960} y={540} size={90} rot={2} enter={{at: a("c02", "ten minute") - 6, mode: "drop"}}/>
      <Disc f={f} at={a("c02", "ten minute")} name="watch" x={1340} y={560} size={200}/>
      <Lab f={f} at={a("c02", "delivery") } text="10-minute delivery" x={1340} y={720}/>
      <StickerLabel f={f} text="ZOMATO" x={560} y={560} size={60} rot={-3} enter={{at: 14, mode: "pop"}}/>
    </Desk>
  );
};
const c02b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("8")} chip2={MEASURE}>
      <Bars f={f} title="Blinkit, adjusted EBITDA" source="Quarter to 30 Sep · letter p.8" max={220} min={-180} box={{x: 560, y: 330, w: 800, h: 560}}
        bars={[{label: "Q2 FY26", v: -156, txt: "–₹156 cr", at: a("c02", "lost")}, {label: "Q2 FY27", v: 184, txt: "+₹184 cr", at: a("c02", "eighty four") - 8, key: true}]}/>
      <Head f={f} at={a("c02", "This time")} text="LOSS TO PROFIT" x={1560} y={300} rot={3}/>
    </Black>
  );
};
// ---------------------------------------------------------------- c03: the letter as question cards; Q2 is the longest
const QWORDS = [602, 1425, 210, 300, 260, 300, 270, 340, 360, 300, 150, 300, 180];   // our count (words per answer, approx); only Q1 and Q2 are labelled
const CardStack: React.FC<{f: number; at: number; pull?: number; liftQ1?: number}> = ({f, at, pull, liftQ1}) => (
  <>
    {QWORDS.map((w, i) => {
      const k = spr(f, at + i * 1.5, 12, 170), x = 260 + i * 110, hh = 120 + w * 0.42;
      const isQ2 = i === 1, isQ1 = i === 0;
      const lift = isQ2 && pull != null ? ease(f, pull, pull + 14, outQuint) : isQ1 && liftQ1 != null ? ease(f, liftQ1, liftQ1 + 14, outQuint) : 0;
      return (
        <div key={i} style={{position: "absolute", left: x, top: 880 - hh - lift * 80, width: 140, height: hh, background: isQ2 ? "#FFFCF2" : "#F5EFE2",
          transform: `translateY(${(1 - k) * 600}px) rotate(${(i % 2 ? 1 : -1) * 1.5}deg) scale(${1 + 0.08 * lift})`, opacity: clamp01(k * 3),
          boxShadow: `0 ${6 + lift * 20}px ${14 + lift * 30}px rgba(30,20,10,0.25)`, border: lift > 0.5 ? `5px solid ${C.markerRed}` : "none"}}>
          <div style={{fontFamily: F.sans, fontWeight: 900, fontSize: 40, textAlign: "center", marginTop: 14}}>Q{i + 1}</div>
          {Array.from({length: Math.floor(hh / 40) - 2}).map((_, j) => <div key={j} style={{margin: "12px 18px 0", height: 8, background: "#CFC6B4", width: `${60 + ((j * 37) % 30)}%`}}/>)}
        </div>
      );
    })}
  </>
);
const c03a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="Now the strange part." at={1} mark={["strange"]} markAt={8} size={150}/>;
};
const c03b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 0.92, 960, 560], [d, 1.0, 900, 540]]} chip={LETTER("5-13")} chip2="Our count: Q2 about 1,425 words, Q1 602">
      <CardStack f={f} at={0} pull={a("c03", "by our count")}/>
      <Lab f={f} at={a("c03", "longest")} text="13 answers in the letter" x={960} y={170} size={40}/>
      <Head f={f} at={a("c03", "by our count") + 6} text="THE LONGEST ANSWER" x={760} y={250} rot={-3} size={56}/>
    </Desk>
  );
};
const c03c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("c03", "computer programs");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 520], [d, 1.12, 960, 470]]} chip={LETTER("6")}>
      <Doc f={f} name="q2head" x={960} y={440} width={1500} enterAt={0} hl={[["Q2. How are you thinking about the impact of AI agents on your businesses?", 2]]}/>
      <Cursor f={f} x={1150} y={620} at={t} tapAt={t + 12} label="AI AGENT"/>
      <Head f={f} at={t + 6} text="SHOPS FOR YOU?" x={640} y={850}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- c04: big question
const c04a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const items: [string, number, "phone" | "shelf" | "scooter" | "box"][] = [["APP", 400, "phone"], ["SHELF", 760, "shelf"], ["RIDER", 1120, "scooter"], ["STOCK", 1480, "box"]];
  const sk = a("c04", "skip");
  const hx = 300 + 1250 * ease(f, 6, sk, inOut);
  return (
    <Desk f={f} d={d} cam={[[0, 1.08, 960, 560], [d, 1.0, 960, 540]]} chip="Our question">
      {items.map(([t, x, ic], i) => (
        <React.Fragment key={t}>
          <Disc f={f} at={4 + i * 6} name={ic} x={x} y={520} size={210}/>
          <Lab f={f} at={8 + i * 6} text={t} x={x} y={690}/>
        </React.Fragment>
      ))}
      <Cursor f={f} x={hx} y={300 + 40 * Math.sin(f * 0.15)} at={0} label="AI AGENT"/>
      <StickyNote f={f} at={sk} text="SKIP WHAT?" x={1640} y={210}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- p01: four businesses
const p01card: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  return <ChapterQ f={f} d={d} n={1} q="Where does the money come from?" icon="coin"/>;
};
const BIZ = [
  {name: "ZOMATO", icon: "bowl" as const, sub: "food delivery", x: 330},
  {name: "BLINKIT", icon: "box" as const, sub: "quick commerce", x: 750},
  {name: "DISTRICT", icon: "ticket" as const, sub: "going out", x: 1170},
  {name: "HYPERPURE", icon: "crate" as const, sub: "supplies", x: 1590},
];
const p01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const z = a("p01", "Zomato delivers");
  return (
    <Desk f={f} d={d} cam={[[0, 0.95, 960, 540], [z, 0.98, 960, 540], [d, 1.45, 330, 520, inOut]]} chip={LETTER("6-8, 12")}>
      {BIZ.map((b, i) => <BizCard key={b.name} f={f} at={2 + i * 4} x={b.x} y={520} name={b.name} icon={b.icon} sub={b.sub} rot={(i % 2 ? 2 : -2)} lift={i === 0 ? 30 * ease(f, z, z + 10) : 0}/>)}
      <Head f={f} at={8} text="FOUR BUSINESSES" x={960} y={170} rot={-1}/>
    </Desk>
  );
};
const p01c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const ds = a("p01", "dark stores");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 1000, 540]]} chip={LETTER("7")}>
      <BizCard f={f} at={-20} x={560} y={540} name="BLINKIT" icon="box" sub="quick commerce" rot={-2} w={380}/>
      <Disc f={f} at={ds - 4} name="shelf" x={1280} y={480} size={300}/>
      <StickerLabel f={f} text="DARK STORE" x={1280} y={700} size={60} rot={-3} dark enter={{at: ds, mode: "pop", rot0: -10}}/>
      <Lab f={f} at={ds + 6} text="a small warehouse" x={1280} y={790}/>
    </Desk>
  );
};
const p01d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const h = a("p01", "Hyperpure");
  return (
    <Desk f={f} d={d} cam={[[0, 1.1, 760, 540], [h, 1.1, 760, 540], [d, 1.1, 1160, 540, inOut]]} chip={LETTER("6, 12")}>
      <BizCard f={f} at={-20} x={560} y={540} name="DISTRICT" icon="ticket" sub="going out" rot={-2} w={360}/>
      <Disc f={f} at={4} name="table" x={900} y={400} size={170}/>
      <Disc f={f} at={8} name="ticket" x={900} y={650} size={170}/>
      <BizCard f={f} at={h - 6} x={1360} y={540} name="HYPERPURE" icon="crate" sub="supplies" rot={2} w={360}/>
      <Disc f={f} at={h + 4} name="pot" x={1680} y={420} size={170}/>
      <Lab f={f} at={h + 8} text="restaurants" x={1680} y={560}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- p02: group 666
const p02a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.14, 1000, 520]]} chip={LETTER("8")} chip2={MEASURE}>
      <Doc f={f} name="ebitda666" x={960} y={520} width={1500} hl={[["INR 666 crore", a("p02", "six hundred")]]} circle={[["INR 666 crore", a("p02", "crore") + 4]]}/>
      <Head f={f} at={a("p02", "adjusted EBITDA")} text="WHOLE GROUP" x={420} y={180} rot={-3}/>
    </Desk>
  );
};
const p02b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("8")} chip2="Our arithmetic: +197% = 2.97 times">
      <Bars f={f} title="Eternal, adjusted EBITDA" source="Whole group · company's measure" max={720} box={{x: 560, y: 300, w: 800, h: 560}}
        bars={[{label: "Q2 FY26", v: 666 / 2.97, txt: "", at: 2}, {label: "Q2 FY27", v: 666, txt: "₹666 cr", at: 8, key: true}]}/>
      <Big f={f} at={a("p02", "nearly three")} text="×3" x={1560} y={470} size={190} color={C.highlightPrint}/>
      <Lab f={f} at={a("p02", "nearly three") + 6} text="nearly" x={1560} y={330} color="#CFC9BE"/>
    </Black>
  );
};
const p02c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("p02", "two hundred");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 560]]} chip={LETTER("17, Annexure B")} chip2="Retyped from an image page">
      <RowsCard f={f} head="Adjusted EBITDA reconciliation, Q2 FY27 (INR crore)" y={560}
        rows={[{l: "Adjusted EBITDA", v: "666"}, {l: "Less: ESOP expense", v: "262", hl: t}, {l: "Less: Tax expense", v: "198"}, {l: "Profit for the period", v: "125"}]}/>
      <StickerLabel f={f} text="ADDED BACK" x={1500} y={300} size={56} rot={4} dark enter={{at: t + 6, mode: "pop", rot0: 10}}/>
      <Lab f={f} at={a("p02", "staff share") } text="staff share awards" x={1500} y={390} size={30}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- p03: which business
const p03a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const nb = a("p03", "Not Blinkit"), fd = a("p03", "Food delivery");
  const sx = 330 + 1260 * (0.5 + 0.5 * Math.sin(f * 0.09));
  return (
    <Desk f={f} d={d} cam={[[0, 0.95, 960, 540], [d, 1.0, 900, 540]]} chip={LETTER("8")} chip2={MEASURE}>
      {BIZ.map((b, i) => <BizCard key={b.name} f={f} at={-20} x={b.x} y={540} name={b.name} icon={b.icon} sub={b.sub} rot={(i % 2 ? 2 : -2)}
        strikeAt={i === 1 ? nb + 2 : undefined} lift={i === 0 ? 40 * ease(f, fd, fd + 10) : 0} dim={i > 0 && f > fd ? 0.6 : 0}/>)}
      <div style={{position: "absolute", left: (f < nb ? sx : 330) - 260, top: 120, width: 520, height: 860, borderRadius: "50%",
        background: "radial-gradient(closest-side, rgba(255,250,220,0.55), rgba(255,250,220,0))", mixBlendMode: "screen", opacity: 0.9}}/>
      <Head f={f} at={nb} text="NOT BLINKIT" x={1200} y={170} rot={2}/>
    </Desk>
  );
};
const p03b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("8")} chip2={MEASURE}>
      <Lab f={f} at={0} text="Food delivery (Zomato) · Q2 FY27" x={960} y={300} color="#CFC9BE" size={40}/>
      <Rs f={f} at={2} v={627} x={960} y={540} size={260} color={C.white}/>
      <Lab f={f} at={10} text="adjusted EBITDA" x={960} y={720} color="#9C968C"/>
    </Black>
  );
};
const p03c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip="Our arithmetic: 627 ÷ 666 = 94%" chip2="666 already nets off District's and others' losses">
      <Squares f={f} at={0} fill={94} x={760} y={540} cell={76} per={0.25}/>
      <Big f={f} at={a("p03", "ninety four")} text="94%" x={1530} y={470} size={210} color={C.highlightPrint}/>
      <Lab f={f} at={a("p03", "netted")} text="losses elsewhere" x={1530} y={640} color="#CFC9BE"/>
      <Lab f={f} at={a("p03", "netted") + 4} text="netted off" x={1530} y={690} color="#CFC9BE"/>
    </Black>
  );
};
// ---------------------------------------------------------------- p04
const p04a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("p04", "five and a half");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 560], [d, 1.05, 960, 520]]} chip={LETTER("8")} chip2={MEASURE}>
      <Receipt f={f} x={600} y={170} w={560} enterAt={0} head="ZOMATO" lines={[{l: "ORDERS", r: "₹100.00", at: 4}, {l: "", r: "", at: 6}, {l: "MARGIN", r: "₹5.50", at: t, big: true}]} rot={-3}/>
      <Receipt f={f} x={1320} y={170} w={560} enterAt={6} head="BLINKIT" lines={[{l: "ORDERS", r: "₹100.00", at: 10}, {l: "", r: "", at: 12}, {l: "MARGIN", r: "₹0.90", at: t + 10, big: true}]} rot={2}/>
    </Desk>
  );
};
const p04b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("8")} chip2="Order value after discounts (NOV), Q2 FY27">
      <Bars f={f} title="Order value, Q2 FY27" source="Letter p.8" max={23000} box={{x: 560, y: 320, w: 800, h: 540}}
        bars={[{label: "ZOMATO", v: 11445, txt: "₹11,445 cr", at: 0}, {label: "BLINKIT", v: 20940, txt: "₹20,940 cr", at: a("p04", "twenty thousand") - 6, key: true}]}/>
      <Head f={f} at={a("p04", "ninety paise")} text="BIGGER, THINNER" x={1600} y={300} rot={3} light/>
    </Black>
  );
};
const p04c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  const tip = ease(f, 6, 20, outCubic);
  return (
    <Desk f={f} d={d} cam={[[0, 1.05, 960, 540], [d, 1.0, 960, 560]]} chip={LETTER("8")} chip2={MEASURE}>
      <div style={{position: "absolute", left: 0, top: 0, transform: `translate(${-120 * tip}px, ${60 * tip}px) rotate(${-10 * tip}deg)`, transformOrigin: "760px 560px"}}>
        <BizCard f={f} at={-10} x={760} y={540} name="DISTRICT" icon="ticket" sub="going out" rot={-2} w={380}/>
      </div>
      <StickerLabel f={f} text="–₹64 CR" x={1300} y={480} size={110} rot={-4} color={C.white} bg={C.markerRed} enter={{at: 8, mode: "drop"}}/>
      <Lab f={f} at={12} text="adjusted EBITDA, Q2 FY27" x={1300} y={620}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- p05 tax
const p05a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="Here is a twist." at={1} mark={["twist."]} markAt={8} size={160}/>;
};
const p05b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={RESULTS("11")} chip2="Unaudited consolidated results · retyped from a scanned page">
      <RowsCard f={f} head="Consolidated, quarter to 30 Sep 2026 (INR crore)" y={560}
        rows={[{l: "Profit before tax", v: "323"}, {l: "Current tax", v: "175", hl: a("p05", "Tax was")}, {l: "Deferred tax", v: "23", hl: a("p05", "Tax was") + 6},
          {l: "Profit for the period", v: "125", hl: a("p05", "one hundred and twenty")}]}/>
    </Desk>
  );
};
const p05c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={RESULTS("11")} chip2="Letter p.17: tax expense 198">
      <Bars f={f} title="Q2 FY27, standard accounts" source="Unaudited consolidated results" max={230} box={{x: 560, y: 320, w: 800, h: 540}}
        bars={[{label: "TAX", v: 198, txt: "₹198 cr", at: 0, key: true}, {label: "PROFIT", v: 125, txt: "₹125 cr", at: 6}]}/>
      <Head f={f} at={8} text="TAX BEATS PROFIT" x={1580} y={330} rot={3} light/>
    </Black>
  );
};
// ---------------------------------------------------------------- p06 old losses
const p06a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 900, 520]]} chip={LETTER("17, Annexure B note 1")}>
      <Doc f={f} name="losses" x={960} y={520} width={1560} hl={[["will be fully utilized in FY27", a("p06", "fully used")]]}/>
    </Desk>
  );
};
const Shield: React.FC<{f: number; at: number; x: number; y: number; burnAt?: number; label: string}> = ({f, at, x, y, burnAt, label}) => {
  if (f < at) return null;
  const k = spr(f, at, 12, 170), b = burnAt != null ? ease(step(f, 2), burnAt, burnAt + 20, inOut) : 0;
  return (
    <div style={{position: "absolute", left: x - 130, top: y - 260, width: 260, height: 400, opacity: clamp01(k * 3)}}>
      <div style={{position: "absolute", left: 30, top: 0, width: 200, height: 220, clipPath: `inset(${b * 100}% 0 0 0)`, transform: `scale(${0.6 + 0.4 * k})`}}>
        <svg width={200} height={220} viewBox="0 0 100 110"><path d="M 50 4 L 92 18 L 92 52 Q 92 86 50 106 Q 8 86 8 52 L 8 18 Z" fill="#E9DFC4" stroke={C.ink} strokeWidth={5}/>
          <text x={50} y={62} textAnchor="middle" fontFamily="Inter" fontWeight={800} fontSize={13}>OLD</text><text x={50} y={78} textAnchor="middle" fontFamily="Inter" fontWeight={800} fontSize={13}>LOSSES</text></svg>
      </div>
      {b > 0 && b < 1 ? <div style={{position: "absolute", left: 30, top: 220 * b - 10, width: 200, height: 20, background: "linear-gradient(90deg, #E0602E, #FFB347, #E0602E)", filter: "blur(4px)"}}/> : null}
      <div style={{position: "absolute", left: 0, right: 0, top: 250, textAlign: "center"}}><span style={{background: C.ink, color: C.white, fontFamily: F.sans, fontWeight: 800, fontSize: 30, padding: "6px 12px"}}>{label}</span></div>
    </div>
  );
};
const p06b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const sub = a("p06", "The subsidiaries");
  return (
    <Desk f={f} d={d} cam={[[0, 1.05, 700, 540], [sub + 10, 1.0, 960, 540, inOut], [d, 1.03, 960, 540]]} chip={LETTER("17, Annexure B note 1")}>
      <Shield f={f} at={0} x={400} y={560} burnAt={4} label="ETERNAL (PARENT)"/>
      <Shield f={f} at={sub} x={900} y={560} label="BLINKIT"/>
      <Shield f={f} at={sub + 5} x={1250} y={560} label="HYPERPURE"/>
      <Shield f={f} at={sub + 10} x={1600} y={560} label="DISTRICT"/>
      <Head f={f} at={14} text="OLD LOSSES RUN OUT" x={420} y={860} rot={-2} size={52}/>
      <Lab f={f} at={a("p06", "future profits")} text="kept for their own profits" x={1250} y={900}/>
    </Desk>
  );
};
const p06c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={RESULTS("18, standalone")} chip2="Our arithmetic: 176 + 38 = 214; 214 ÷ 855 = 25%">
      <RowsCard f={f} head="Eternal Limited alone, quarter to 30 Sep 2026 (INR crore)" y={540}
        rows={[{l: "Profit before tax", v: "855", hl: a("p06b", "pre-tax")}, {l: "Current tax", v: "176", hl: a("p06b", "paid tax")}, {l: "Deferred tax", v: "38", hl: a("p06b", "paid tax") + 6},
          {l: "Tax, total (our arithmetic)", v: "214", hl: a("p06b", "a quarter"), red: true}]}/>
    </Desk>
  );
};
const TaxBar: React.FC<{f: number; at: number; x: number; total: number; tax: number; k: number; label: string; tl: string; pl: string}> = ({f, at, x, total, tax, k, label, tl, pl}) => {
  const g = ease(f, at, at + 20, outCubic), base = 860;
  return (
    <>
      <div style={{position: "absolute", left: x - 140, top: base - total * k * g, width: 280, height: (total - tax) * k * g, background: C.chartBlue}}/>
      <div style={{position: "absolute", left: x - 140, top: base - tax * k * g, width: 280, height: tax * k * g, background: C.markerRed}}/>
      <Lab f={f} at={at + 10} text={tl} x={x + 260} y={base - (tax * k) / 2} color="#FF8FA8" size={30}/>
      <Lab f={f} at={at + 14} text={pl} x={x} y={base - total * k - 50} color={C.white} size={34}/>
      <Lab f={f} at={at} text={label} x={x} y={base + 50} color="#CFC9BE" size={30}/>
    </>
  );
};
const p06d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const r = a("p06b", "Our reading");
  return (
    <Black f={f} d={d} chip="Our arithmetic and our reading" chip2={RESULTS("11, 18")}>
      <div style={{position: "absolute", left: 0, right: 0, top: 860, height: 4, background: "rgba(255,255,255,0.7)"}}/>
      <TaxBar f={f} at={-30} x={560} total={855} tax={214} k={0.62} label="PARENT ALONE" tl="TAX ₹214 CR · 25%" pl="PRE-TAX ₹855 CR"/>
      <TaxBar f={f} at={r} x={1240} total={323} tax={198} k={0.62} label="WHOLE GROUP" tl="TAX ₹198 CR · 61%" pl="PRE-TAX ₹323 CR"/>
      <Head f={f} at={r + 10} text="WHY IT LOOKS HEAVY" x={960} y={170} rot={-2} light/>
    </Black>
  );
};
// ---------------------------------------------------------------- p07 revenue
const p07a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("8, 14, 17")} chip2="Company's measure: adjusted revenue">
      <Bars f={f} title="Eternal, adjusted revenue" source="Whole group · quarter to 30 Sep" max={27000} box={{x: 560, y: 320, w: 800, h: 540}}
        bars={[{label: "Q2 FY26", v: 13968, txt: "₹13,968 cr", at: 2}, {label: "Q2 FY27", v: 24621, txt: "₹24,621 cr", at: 8, key: true}]}/>
      <Big f={f} at={a("p07", "seventy six")} text="+76%" x={1620} y={420} size={150} color={C.highlightPrint}/>
    </Black>
  );
};
const Bag: React.FC<{f: number; tagFlip: number}> = ({f, tagFlip}) => {
  const p = clamp01((f - tagFlip) / 10), rotY = p < 0.5 ? p * 180 : (p - 1) * 180, txt = p < 0.5 ? "FEE" : "FULL PRICE";
  const sw = Math.sin(f * 0.08) * 5;
  return (
    <>
      <div style={{position: "absolute", left: 560, top: 300}}><svg width={520} height={560} viewBox="0 0 100 108"><path d="M 16 30 L 84 30 L 92 104 L 8 104 Z" fill="#C9A26B" stroke="#6B4E2A" strokeWidth={2.5}/>
        <path d="M 34 30 Q 34 6 50 6 Q 66 6 66 30" fill="none" stroke="#6B4E2A" strokeWidth={3}/></svg></div>
      <div style={{position: "absolute", left: 1080, top: 380, transform: `rotate(${sw}deg)`, transformOrigin: "-120px 0"}}>
        <div style={{position: "absolute", left: -120, top: 0, width: 120, height: 3, background: "#8C7A5A"}}/>
        <div style={{transform: `perspective(1000px) rotateY(${rotY}deg)`, background: p < 0.5 ? "#F2DDA8" : C.highlight, padding: p < 0.5 ? "18px 30px" : "34px 56px",
          fontFamily: F.sans, fontWeight: 900, fontSize: p < 0.5 ? 46 : 90, color: C.ink, boxShadow: "0 10px 20px rgba(0,0,0,0.25)", whiteSpace: "nowrap"}}>{txt}</div>
      </div>
    </>
  );
};
const p07b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 900, 560], [d, 1.06, 960, 540]]} chip={LETTER("4, 8")} chip2="Illustration">
      <Bag f={f} tagFlip={a("p07", "full prices")}/>
      <Lab f={f} at={a("p07", "owns more")} text="Blinkit owns more of its inventory" x={960} y={180} size={38}/>
      <Head f={f} at={a("p07", "full prices") + 8} text="FULL PRICE, NOT FEE" x={1300} y={880} rot={-2}/>
    </Desk>
  );
};
const p07c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.15, 1100, 520]]} chip={LETTER("8")} chip2="Company's measure: adjusted revenue">
      <Doc f={f} name="adjrev" x={960} y={500} width={1560} hl={[["Adjusted Revenue grew 76% YoY", 2], ["like-for-like growth was 58% YoY", a("p07", "Like for like")]]}
        circle={[["like-for-like growth was 58% YoY", a("p07", "fifty eight")]]}/>
      <Head f={f} at={a("p07", "fifty eight")} text="58% LIKE FOR LIKE" x={1300} y={820}/>
    </Desk>
  );
};

export const SHOTS1: Shot[] = [
  S("c01", 0, H0, c01a), S("c01", "That is", WL, c01b), S("c01", "last quarter", PUSH(960, 620), c01c),
  S("c02", 0, PU, c02a), S("c02", "A year earlier", WD, c02b),
  S("c03", 0, H0, c03a), S("c03", "The longest", WU, c03b), S("c03", "computer programs", PU, c03c),
  S("c04", 0, WR, c04a),
  S("p01", -0.85, PU, p01card), S("p01", "Eternal runs", WL, p01b), S("p01", "Blinkit delivers", WR, p01c), S("p01", "District books", WL, p01d),
  S("p02", 0, PU, p02a), S("p02", "That is nearly", WD, p02b), S("p02", "The measure", PU, p02c),
  S("p03", 0, WU, p03a), S("p03", "Food delivery", PUSH(330, 540), p03b), S("p03", "By our arithmetic", H0, p03c),
  S("p04", 0, PU, p04a), S("p04", "Blinkit's orders", WD, p04b), S("p04", "District still", WL, p04c),
  S("p05", 0, H0, p05a), S("p05", "On the unaudited", PU, p05b), S("p05", "More than", WD, p05c),
  S("p06", 0, PU, p06a), S("p06", "The subsidiaries", WL, p06b),
  S("p06b", 0, PU, p06c), S("p06b", "Our reading", WD, p06d),
  S("p07", 0, WU, p07a), S("p07", "Part of that", PU, p07b), S("p07", "Like for like", WR, p07c),
];
export const CUES1: SCue[] = [
  [W("c01", 0.05), "paper", 0.6], [W("c01", "matter"), "circle", 0.5], [W("c01", "That is", -0.05), "whoosh", 0.8], [W("c01", "measure"), "circle", 0.5],
  [W("c01", "last quarter"), "whooshDeep", 0.6], [W("c02", "lost"), "stamp", 0.5], [W("c02", "eighty four"), "ding", 0.8], [W("c03", "The longest"), "whoosh", 0.7],
  [W("c03", "computer programs"), "paper", 0.5], [W("c04", "skip"), "pop", 0.8], [W("p01", -0.85), "paper", 0.6], [W("p01", "Eternal runs"), "paper", 0.5],
  [W("p02", "six hundred"), "highlighter", 0.5], [W("p02", "That is nearly"), "whoosh", 0.6], [W("p03", "Not Blinkit"), "circle", 0.6],
  [W("p03", "Food delivery"), "whooshDeep", 0.5], [W("p04", "twenty thousand"), "ding", 0.5], [W("p05", 0), "stamp", 0.4], [W("p05", "More than"), "stamp", 0.6],
  [W("p06", "fully used"), "highlighter", 0.5], [W("p06b", "Our reading"), "whoosh", 0.5], [W("p07", "full prices"), "paper", 0.5],
];
