// tatamotorsq2 cold open (c01-c04), chapter 1 "Which Tata Motors?" (w01) and chapter 2 "Where the trucks went" (v01-v05).
// Figures: ledger rows in contentengine/drafts/2026-10-23/_video/script.md (Air, reviewed 24 Oct). Standalone figures are chipped STANDALONE.
import React from "react";
import {SCue} from "./A01V4Cold";
import {ChapterQ, SP, Shot, Stamp, StickyNote, Words} from "./A01V4Parts";
import {StickerLabel} from "./Collage";
import {C, useTicks} from "./tokens";
import {H0, PU, PUSH, S, W, WD, WL, WR, WU, useAt} from "./TataMotorsCue";
import {Bars, Big, BizCard, Black, Counter, DECK, Desk, Disc, Doc, DocName, Head, Lab, RELEASE, RESULTS, STANDALONE, Squares, XI, aimAt} from "./TataMotorsPieces";
import {CamKey} from "./Camera";
import {Ledger, LineChart, PriceTag, SansBig, TearSheet} from "./TataMotorsKit";

export const ARITH = (s: string) => `Our arithmetic: ${s}`;
export const MEASURE = "Company's measure: reported EBITDA";
/** camera keys that settle, then push in on one phrase of a Doc (doc placed at x, y, width, rot) */
export const zoomCam = (name: DocName, phrase: string, t0: number, d: number, Z: number, x = 960, y = 520, width = 1500, rot = -0.8): CamKey[] => {
  const p = aimAt(name, phrase, x, y, width, rot), a = Math.max(1, t0);
  return a + 23 < d ? [[0, 1.0, 960, 540], [a, 1.0, 960, 540], [a + 22, Z, p.x, p.y], [d, Z * 1.03, p.x, p.y]] : [[0, 1.0, 960, 540], [Math.max(a + 1, d), Z, p.x, p.y]];
};

// ---------------------------------------------------------------- c01: the 30-cent raise
const c01a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.15, 960, 520], [d, 1.04, 960, 540]]} chip={DECK("5")}>
      <PriceTag f={f} at={0} x={860} y={160} text="€14.10" size={150} q={a("c01", "thirty cents") - 4}/>
      <StickerLabel f={f} text="+30 CENTS" x={1420} y={420} size={70} rot={6} bg={C.markerRed} color={C.white} enter={{at: a("c01", "thirty cents"), mode: "pop"}}/>
      <Head f={f} at={a("c01", "thirty cents") + 6} text="WHY +30 CENTS?" x={1300} y={880}/>
    </Desk>
  );
};
const c01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("c01", "Tata Motors");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 1000, 520]]} chip={DECK("5")} chip2="Offer price revised 9 October 2026">
      <BizCard f={f} at={0} x={420} y={520} name="9 OCT 2026" icon="calendar" rot={-3} w={360}/>
      <StickerLabel f={f} text="TATA MOTORS" x={980} y={420} size={70} rot={-2} dark enter={{at: t, mode: "drop"}}/>
      <StickerLabel f={f} text="IVECO GROUP" x={1480} y={640} size={70} rot={3} dark enter={{at: a("c01", "Iveco Group"), mode: "drop"}}/>
      <Lab f={f} at={t + 8} text="offer for every share →" x={1200} y={530} size={36} color={C.markerRed}/>
    </Desk>
  );
};
const c01c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const s = a("c01", "fourteen euros forty");
  return (
    <Desk f={f} d={d} cam={[[0, 1.05, 960, 540], [d, 1.14, 900, 520]]} chip={DECK("5")}>
      <PriceTag f={f} at={-30} x={760} y={120} text="€14.10" size={150} dim={f >= s ? 0.6 : 0}/>
      {f >= s ? <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}><line x1={560} y1={330} x2={560 + 420 * Math.min(1, (f - s) / 8)} y2={300} stroke={C.markerRed} strokeWidth={18}/></svg> : null}
      <SansBig f={f} at={s + 4} text="€14.40" x={1380} y={520} size={230} color={C.ink} rot={-3}/>
      <Lab f={f} at={s + 10} text="per Iveco share" x={1380} y={680} size={40}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- c02: the reason and the most it could cost
const c02a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={DECK("5")} chip2="The company's own reason">
      <Doc f={f} name="price" x={960} y={500} width={1400} hl={[["Offer price increased from €14.10 to €14.40", 2], ["In consideration of the slight delay in the completion of the Offer", a("c02", "slight delay")]]}/>
    </Desk>
  );
};
const c02b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("c02", "forty two thousand");
  return (
    <Desk f={f} d={d} cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]} chip={RESULTS("11, note 6")} chip2="Revised maximum offer value, approx.">
      <Head f={f} at={a("c02", "The most")} text="THE MAXIMUM COST" x={960} y={180}/>
      <Counter f={f} keys={[[0, 0], [t, 0], [t + 40, 42561]]} x={960} y={520} size={170} pre="₹"/>
      <Lab f={f} at={t + 14} text="crore · €3.91 billion" x={960} y={700} size={40}/>
    </Desk>
  );
};
const c02c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={zoomCam("note6", "42,561 crores (€3.91 billion)", 2, d, 1.9, 960, 520, 1760, -0.4)} chip={RESULTS("11, note 6")}>
      <Doc f={f} name="note6" x={960} y={520} width={1760} rot={-0.4} hl={[["42,561 crores (€3.91 billion)", 4], ["revised maximum", 10]]}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- c03: the other half
const c03a: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="Now the other half." at={1} mark={["half."]} markAt={8} size={150}/>;
};
const c03b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 0.98, 960, 540], [d, 1.06, 760, 520]]} chip={RELEASE("3")} chip2={STANDALONE}>
      <Ledger f={f} enterAt={0} cols={[{name: "THE TRUCKS", val: "+42%", sub: "vehicles wholesaled, Jul–Sep", at: a("c03", "forty two percent")},
        {name: "IVECO", val: "€14.40", sub: "offer per share", red: true, at: 2}]}/>
    </Desk>
  );
};
const c03c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={RELEASE("2")} chip2={STANDALONE}>
      <Bars f={f} title="Up on a year earlier" source="Jul–Sep 2026 vs Jul–Sep 2025" max={50} box={{x: 560, y: 300, w: 800, h: 560}}
        bars={[{label: "VEHICLES", v: 42, txt: "+42%", at: 0}, {label: "REVENUE", v: 42, txt: "+42%", at: a("c03", "up forty two") - 4, key: true}]}/>
    </Black>
  );
};
const c03d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={RELEASE("2")} chip2={MEASURE}>
      <Squares f={f} at={0} fill={11.7} x={720} y={540} cell={78} per={0.2}/>
      <Lab f={f} at={4} text="₹100 of sales · one square = ₹1" x={720} y={980} color="#CFC9BE" size={30}/>
      <Stamp f={f} at={a("c03", "less operating")} text="LESS KEPT" x={1500} y={520} size={120} rot={-8}/>
    </Black>
  );
};
// ---------------------------------------------------------------- c04: the big question
const c04a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.06, 960, 560], [d, 1.0, 960, 540]]} chip="Our question">
      <Disc f={f} at={2} name="truck" x={640} y={520} size={300}/>
      <Lab f={f} at={6} text="THE TRUCKS" x={640} y={740} size={40}/>
      <Big f={f} at={a("c04", "truck business") - 2} text="?" x={880} y={360} size={240} color={C.markerRed}/>
      <StickyNote f={f} at={a("c04", "truck business")} text="TRUCKS? COST?" x={1480} y={220}/>
    </Desk>
  );
};
const c04b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip="Our question">
      <StickyNote f={f} at={-30} text="TRUCKS? COST?" x={1480} y={220}/>
      <PriceTag f={f} at={0} x={760} y={160} text="€14.40" size={140} q={a("c04", "cost") - 2}/>
      <Head f={f} at={a("c04", "cost")} text="WHAT IT COULD COST" x={1200} y={880}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- w01: which Tata Motors?
const w01card: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <ChapterQ f={f} d={d} n={1} q="Which Tata Motors?" icon="factory"/>;
};
const w01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 540]]} chip={RESULTS("11, note 5")} chip2="Scheme effective 1 October 2025">
      <TearSheet f={f} at={a("w01", "split in two")} title="TATA MOTORS LTD" left={<div style={{display: "flex", justifyContent: "center"}}><XI name="truck" size={230}/></div>}
        right={<div style={{display: "flex", justifyContent: "center"}}><XI name="car" size={230}/></div>}/>
      <Head f={f} at={a("w01", "split in two") + 8} text="SPLIT IN TWO" x={960} y={930}/>
    </Desk>
  );
};
const w01c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const n = a("w01", "now named");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={RESULTS("1")}>
      <BizCard f={f} at={0} x={600} y={500} name="TRUCKS & BUSES" icon="truck" rot={-3} w={360} sub="commercial vehicles"/>
      <StickerLabel f={f} text="TML COMMERCIAL VEHICLES" x={1260} y={360} size={50} rot={-2} enter={{at: a("w01", "TML Commercial"), mode: "drop"}}/>
      <Lab f={f} at={n} text="now named ↓" x={1260} y={480} size={36} color={C.markerRed}/>
      <StickerLabel f={f} text="TATA MOTORS LIMITED" x={1260} y={600} size={60} rot={2} dark enter={{at: a("w01", "Tata Motors Limited"), mode: "pop"}}/>
    </Desk>
  );
};
const w01d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.04, 960, 540], [d, 1.0, 960, 540]]} chip={RESULTS("11, note 5")} chip2="Effective 1 October 2025">
      <BizCard f={f} at={-20} x={600} y={470} name="TATA MOTORS LTD" icon="truck" rot={-3} w={480} sub="formerly TML Commercial Vehicles"/>
      <BizCard f={f} at={a("w01", "The old Tata") + 2} x={1320} y={470} name="TATA MOTORS PV" icon="car" rot={3} w={480} sub="Passenger Vehicles · old Tata Motors"/>
      <Head f={f} at={a("w01", "kept the passenger")} text="TWO COMPANIES NOW" x={960} y={930}/>
    </Desk>
  );
};
const w01e: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={zoomCam("demerger", "consolidating the passenger vehicles business", 2, d, 1.6, 960, 500, 1720, -0.4)} chip={RESULTS("11, note 5")}>
      <Doc f={f} name="demerger" x={960} y={500} width={1720} rot={-0.4} hl={[["consolidating the passenger vehicles business", 2], ["effective from October 1, 2025", 10]]}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- v01: where did 42% come from?
const v01card: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <ChapterQ f={f} d={d} n={2} q="Where the trucks went" icon="depot"/>;
};
const v01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("v01", "One hundred");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={DECK("6")} chip2={STANDALONE}>
      {Array.from({length: 12}).map((_, i) => <Disc key={i} f={f} at={t + i * 1.6} name={(["truck", "pickup", "bus"] as const)[i % 3]} x={260 + (i % 6) * 280} y={250 + Math.floor(i / 6) * 190} size={150}/>)}
      <Big f={f} at={t} text="135.1K" x={960} y={720} size={170}/>
      <Lab f={f} at={t + 12} text="vehicles wholesaled · Jul–Sep 2026" x={960} y={850} size={36}/>
    </Desk>
  );
};
const v01c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.14, 960, 520]]} chip={DECK("6")}>
      <Doc f={f} name="segments" x={960} y={480} width={1500} hl={[["Double digit growth across segments", 2]]}/>
      <Head f={f} at={8} text="EVERY SEGMENT GREW" x={960} y={860}/>
    </Desk>
  );
};
const SEG = (a: (k: string, x: string) => number, part: 1 | 2) => part === 1
  ? [{label: "HEAVY TRUCKS", v: 33.8, txt: "+41%", sub: "33.8K", at: a("v01", "Heavy trucks"), key: true},
     {label: "SMALL CV & PICKUPS", v: 44.0, txt: "+27%", sub: "44.0K", at: a("v01", "small commercial")}]
  : [{label: "PASSENGER CARRIERS", v: 15.4, txt: "+31%", sub: "15.4K", at: a("v01", "passenger carriers")},
     {label: "INTERMEDIATE, LIGHT, MEDIUM", v: 20.8, txt: "+24%", sub: "20.8K", at: a("v01", "intermediate")}];
const v01d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("6")} chip2={STANDALONE}>
      <Bars f={f} title="Wholesales by segment" source="Jul–Sep 2026 · thousand vehicles · growth on a year earlier" max={52} box={{x: 460, y: 300, w: 1000, h: 560}} bw={300} bars={SEG(a, 1)}/>
    </Black>
  );
};
const v01e: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("6")} chip2={STANDALONE}>
      <Bars f={f} title="Wholesales by segment" source="Jul–Sep 2026 · thousand vehicles · growth on a year earlier" max={52} box={{x: 460, y: 300, w: 1000, h: 560}} bw={300} bars={SEG(a, 2)}/>
    </Black>
  );
};
// ---------------------------------------------------------------- v02: abroad
const v02a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("6")} chip2="Deck: international business ~3x">
      <Bars f={f} title="International volumes" source="Thousand vehicles · Jul–Sep" max={24} box={{x: 460, y: 300, w: 800, h: 560}}
        bars={[{label: "2025", v: 7.6, txt: "7.6K", at: 0}, {label: "2026", v: 21.1, txt: "21.1K", at: a("v02", "International") - 2, key: true}]}/>
      <Big f={f} at={a("v02", "one hundred and seventy")} text="+177%" x={1480} y={430} size={160} color={C.highlightPrint}/>
      <Head f={f} at={a("v02", "nearly triple")} text="NEARLY TRIPLED ABROAD" x={1500} y={640} rot={3} light/>
    </Black>
  );
};
const v02b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 1000, 520]]} chip={DECK("17")}>
      <Disc f={f} at={0} name="ship" x={330} y={330} size={260}/>
      <Doc f={f} name="indonesia" x={1080} y={540} width={1300} hl={[["177% YoY", 2], ["on the back of Indonesia order", a("v02", "Indonesia") - 4]]}/>
    </Desk>
  );
};
const v02c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.05, 960, 540], [d, 1.0, 960, 540]]} chip={RELEASE("3")}>
      <Disc f={f} at={0} name="truck" x={620} y={500} size={300}/>
      <Big f={f} at={a("v02", "thirty percent")} text="+30%" x={1260} y={460} size={220}/>
      <Lab f={f} at={a("v02", "thirty percent") + 4} text="domestic volumes · year on year" x={1260} y={620} size={38}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- v04: rivals or the market?
const v04a: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="Rivals, or the market?" at={1} mark={["market?"]} markAt={10} size={140}/>;
};
const v04b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("17")} chip2="Company's figures: industry offtake vs its own">
      <Bars f={f} title="A bit of both" source="Volume growth, Jul–Sep 2026, year on year" max={36} box={{x: 560, y: 300, w: 800, h: 560}}
        bars={[{label: "INDUSTRY", v: 28, txt: "+28%", at: 0}, {label: "TATA MOTORS", v: 30, txt: "~+30%", at: a("v04", "its own"), key: true}]}/>
    </Black>
  );
};
const v04c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 960, 520]]} chip={RELEASE("3")} chip2="Vahan registrations, H1 FY27">
      <Doc f={f} name="share" x={960} y={500} width={1450} hl={[["36.2%, up 110 bps from FY26", a("v04", "thirty six point")]]}/>
    </Desk>
  );
};
const v04d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("15")} chip2="Vahan portal, excl. Telangana · Apr–Sep 2026">
      <Squares f={f} at={0} fill={36.2} x={720} y={540} cell={78} per={0.2}/>
      <Big f={f} at={4} text="36.2%" x={1480} y={440} size={170} color={C.highlightPrint}/>
      <Lab f={f} at={8} text="of commercial vehicle registrations" x={1480} y={590} color={C.white} size={32}/>
    </Black>
  );
};
const v04e: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("15")} chip2="Heavy trucks (HCV), H1 FY27">
      <Squares f={f} at={0} fill={55.7} x={720} y={540} cell={78} per={0.25}/>
      <Big f={f} at={a("v04", "fifty five")} text="55.7%" x={1480} y={440} size={170} color={C.highlightPrint}/>
      <Head f={f} at={a("v04", "fifty five") + 8} text="MORE THAN HALF" x={1480} y={640} rot={3} light/>
    </Black>
  );
};
// ---------------------------------------------------------------- v05: not every line gained
const v05a: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="Not every line gained." at={1} mark={["gained."]} markAt={10} size={140}/>;
};
const v05b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const rows: [string, string, string, string][] = [["HEAVY TRUCKS", "+0.5 PT", "heavy trucks", "truck"], ["SMALL CV & PICKUPS", "+1.3 PTS", "small commercial", "pickup"],
    ["PASSENGER CARRIERS", "+5.0 PTS", "passenger carriers", "bus"]];
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip={DECK("15")} chip2="Share of registrations, H1 FY27 vs FY26">
      {rows.map(([n, v, w, ic], i) => (
        <React.Fragment key={n}>
          <Disc f={f} at={a("v05", w)} name={ic as "truck"} x={560 + i * 400} y={420} size={200}/>
          <Lab f={f} at={a("v05", w) + 2} text={n} x={560 + i * 400} y={590} size={28}/>
          <Big f={f} at={a("v05", w) + 6} text={v} x={560 + i * 400} y={700} size={90} color={C.ink}/>
        </React.Fragment>
      ))}
    </Desk>
  );
};
const v05c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("15")} chip2="Intermediate, light & medium trucks (ILMCV)">
      <LineChart f={f} title="Share of registrations" source="Intermediate, light and medium trucks · %" min={30} max={42} circleLast={a("v05", "thirty six point three")}
        pts={[{label: "FY26", v: 38.0, txt: "38.0%", at: 0}, {label: "H1 FY27", v: 36.3, txt: "36.3%", at: a("v05", "thirty six point three") - 6}]}/>
    </Black>
  );
};
const v05d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("15")} chip2="All commercial vehicles, by quarter">
      <LineChart f={f} title="Share, quarter by quarter" source="All commercial vehicle registrations · %" min={32} max={40}
        pts={[{label: "APR–JUN 26", v: 36.8, txt: "36.8%", at: 0}, {label: "JUL–SEP 26", v: 35.7, txt: "35.7%", at: a("v05", "thirty five point seven")}]}/>
    </Black>
  );
};

export const SHOTS1: Shot[] = [
  S("c01", 0, H0, c01a), S("c01", "On the ninth", WL, c01b), S("c01", "from fourteen", PU, c01c),
  S("c02", 0, WD, c02a), S("c02", "The most", PU, c02b), S("c02", "five hundred", WR, c02c),
  S("c03", 0, H0, c03a), S("c03", "The same results", PU, c03b), S("c03", "Revenue", WL, c03c), S("c03", "Yet less", WD, c03d),
  S("c04", 0, PU, c04a), S("c04", "and what do", PUSH(960, 540), c04b),
  S("w01", -0.85, PU, w01card), S("w01", "Last year", WL, w01b), S("w01", "The commercial vehicle", PU, w01c), S("w01", "The old Tata", WR, w01d), S("w01", "kept the passenger", WD, w01e),
  S("v01", -0.85, PU, v01card), S("v01", "One hundred", WL, v01b), S("v01", "Every segment", PU, v01c), S("v01", "Heavy trucks", WD, v01d), S("v01", "passenger carriers", WR, v01e),
  S("v02", 0, WU, v02a), S("v02", "which the company", PU, v02b), S("v02", "At home", WL, v02c),
  S("v04", 0, H0, v04a), S("v04", "A bit of both", WD, v04b), S("v04", "Over the half", PU, v04c), S("v04", "registrations on", WR, v04d), S("v04", "in heavy trucks", WL, v04e),
  S("v05", 0, H0, v05a), S("v05", "Against last", PU, v05b), S("v05", "Yet intermediate", WD, v05c), S("v05", "The second quarter", WR, v05d),
];
export const CUES1: SCue[] = [
  [W("c01", 0.05), "paper", 0.6], [W("c01", "thirty cents"), "pop", 0.6], [W("c01", "On the ninth"), "whoosh", 0.5], [W("c01", "from fourteen"), "paper", 0.5],
  [W("c01", "fourteen euros forty"), "circle", 0.5], [W("c02", "slight delay"), "highlighter", 0.5], [W("c02", "forty two thousand"), "ding", 0.5],
  [W("c03", "The same results"), "paper", 0.5], [W("c03", "Yet less"), "stamp", 0.7], [W("c04", "truck business"), "pop", 0.7],
  [W("w01", -0.85), "paper", 0.6], [W("w01", "split in two"), "whooshDeep", 0.6], [W("w01", "now named"), "circle", 0.5], [W("w01", "kept the passenger"), "highlighter", 0.4],
  [W("v01", -0.85), "paper", 0.6], [W("v01", "One hundred"), "ding", 0.4], [W("v01", "Every segment"), "highlighter", 0.4], [W("v01", "Heavy trucks"), "whoosh", 0.4],
  [W("v02", "one hundred and seventy"), "ding", 0.5], [W("v02", "Indonesia"), "highlighter", 0.4], [W("v04", "A bit of both"), "whoosh", 0.4],
  [W("v04", "thirty six point"), "highlighter", 0.4], [W("v04", "fifty five"), "ding", 0.5], [W("v05", "Yet intermediate"), "whoosh", 0.4], [W("v05", "thirty six point three"), "circle", 0.5],
];
