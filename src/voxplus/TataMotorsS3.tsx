// tatamotorsq2 chapter 5 "The Iveco offer" (i01-i04): only what the filings state, with dates; no forecast.
import React from "react";
import {SCue} from "./A01V4Cold";
import {ChapterQ, SP, Shot, Words} from "./A01V4Parts";
import {StickerLabel} from "./Collage";
import {C, useTicks} from "./tokens";
import {PU, PUSH, S, W, WD, WL, WR, WU, H0, useAt} from "./TataMotorsCue";
import {Big, BizCard, DECK, Desk, Disc, Doc, Head, Lab, RELEASE, RESULTS, Squares, Black} from "./TataMotorsPieces";
import {DateRow, Ledger, PriceTag} from "./TataMotorsKit";
import {zoomCam} from "./TataMotorsS1";

// ---------------------------------------------------------------- i01
const i01card: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <ChapterQ f={f} d={d} n={5} q="The Iveco offer" icon="doc"/>;
};
const i01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]} chip={RESULTS("11, note 6")}>
      <PriceTag f={f} at={-30} x={300} y={60} text="€14.40" size={90}/>
      <BizCard f={f} at={2} x={960} y={500} name="30 JUL 2025" icon="calendar" rot={-2} w={460} sub="agreement announced"/>
    </Desk>
  );
};
const i01c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("i01", "the company and");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={RESULTS("11, note 6")}>
      <BizCard f={f} at={t - 4} x={460} y={500} name="TATA MOTORS" icon="truck" rot={-3} w={380}/>
      <Disc f={f} at={a("i01", "announced")} name="handshake" x={960} y={500} size={240}/>
      <BizCard f={f} at={a("i01", "Iveco Group")} x={1460} y={500} name="IVECO GROUP" icon="truck" rot={3} w={380}/>
    </Desk>
  );
};
const i01d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={zoomCam("note6", "all-cash", 2, d, 1.9, 960, 480, 1760, -0.4)} chip={RESULTS("11, note 6")}>
      <Doc f={f} name="note6" x={960} y={480} width={1760} rot={-0.4} hl={[["all-cash", a("i01", "all-cash")]]}/>
      <Head f={f} at={a("i01", "all-cash") + 8} text="ALL-CASH OFFER" x={960} y={820}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- i02: the rupee figures
const i02a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("i02", "leaves out");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 540]]} chip={RESULTS("11, note 6")} chip2="Illustration">
      <BizCard f={f} at={0} x={760} y={500} name="IVECO GROUP" icon="truck" rot={-2} w={420}/>
      <BizCard f={f} at={2} x={1260} y={520} name="DEFENCE" icon="shield" rot={4} w={320} strikeAt={t + 6}/>
      <Lab f={f} at={t + 10} text="not in the offer" x={1260} y={800} size={36} color={C.markerRed}/>
    </Desk>
  );
};
const i02b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 760, 520]]} chip={RESULTS("11, note 6")} chip2="Values as at 30 Sep 2026">
      <PriceTag f={f} at={0} x={700} y={140} text="₹41,363 CR" size={110} swing={0.6}/>
      <Lab f={f} at={a("i02", "forty one thousand") + 6} text="total consideration · €3.8 bn" x={700} y={560} size={34}/>
    </Desk>
  );
};
const i02c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 1100, 520]]} chip={RESULTS("11, note 6")} chip2="Two figures in the filing; not a per-share pairing">
      <PriceTag f={f} at={-30} x={560} y={140} text="₹41,363 CR" size={90} dim={0.4}/>
      <PriceTag f={f} at={a("i02", "a revised") - 2} x={1320} y={140} text="₹42,561 CR" size={110}/>
      <Lab f={f} at={-20} text="total consideration · €3.8 bn" x={560} y={500} size={28}/>
      <Lab f={f} at={a("i02", "a revised") + 8} text="revised maximum · €3.91 bn" x={1320} y={560} size={34}/>
      <Head f={f} at={a("i02", "five hundred") } text="THE RUPEE BILL" x={960} y={860}/>
    </Desk>
  );
};
const i02d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={zoomCam("note6", "42,561 crores (€3.91 billion)", 2, d, 1.8, 960, 480, 1760, -0.4)} chip={RESULTS("11, note 6")}>
      <Doc f={f} name="note6" x={960} y={480} width={1760} rot={-0.4} hl={[["41,363 crores", 0], ["42,561 crores (€3.91 billion)", 6]]}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- i03: where it stands
const i03a: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="Where does it stand?" at={1} mark={["stand?"]} markAt={8} size={140}/>;
};
const i03b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={zoomCam("egm", "Extraordinary General Meeting held on 16 October 2026", 2, d, 1.3, 960, 480, 1700, -0.8)} chip={RELEASE("2")}>
      <Doc f={f} name="egm" x={960} y={480} width={1700} hl={[["Extraordinary General Meeting held on 16 October 2026", a("i03", "sixteenth")], ["approved all proposed resolutions", a("i03", "approved")]]}/>
    </Desk>
  );
};
const i03c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("5")} chip2="As of 22 October 2026">
      <Squares f={f} at={0} fill={35} x={720} y={540} cell={78} per={0.25}/>
      <Big f={f} at={a("i03", "thirty five")} text="35%" x={1480} y={430} size={190} color={C.highlightPrint}/>
      <Lab f={f} at={a("i03", "thirty five") + 4} text="of shares tendered so far" x={1480} y={580} color={C.white} size={34}/>
    </Black>
  );
};
const i03d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.14, 900, 520]]} chip={DECK("5")}>
      <Doc f={f} name="tendered" x={960} y={480} width={1000} hl={[["35%", 2]]}/>
      <Lab f={f} at={6} text="*as of 22 October 2026" x={960} y={820} size={34}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- i04: dates
const i04a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.04, 960, 540]]} chip={DECK("5") + " · " + RELEASE("2")}>
      <DateRow f={f} items={[{date: "16 OCT", label: "Iveco EGM", at: 0, done: true}, {date: "22 OCT", label: "35% tendered", at: 4, done: true},
        {date: "26 OCT", label: "acceptance closes", at: a("i04", "twenty sixth")}, {date: "30 OCT", label: "settlement", at: a("i04", "Settlement")}]}/>
    </Desk>
  );
};
const i04b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.14, 1100, 520]]} chip={DECK("5")}>
      <Doc f={f} name="settle" x={960} y={460} width={1600} hl={[["subject to Offer conditions being met", a("i04", "subject to")]]}/>
      <Head f={f} at={a("i04", "subject to") + 8} text="SETTLEMENT: 30 OCTOBER" x={960} y={820}/>
    </Desk>
  );
};
const i04c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 560]]} chip={RELEASE("3")} chip2="CFO GV Ramanan">
      <StickerLabel f={f} text="GV RAMANAN · CFO" x={420} y={190} size={54} rot={-3} dark enter={{at: 0, mode: "drop"}}/>
      <Doc f={f} name="consol" x={960} y={560} width={1700} rot={-0.5} hl={[["As we prepare for consolidation from next quarter", a("i04", "for consolidation")]]}/>
    </Desk>
  );
};
const i04d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 0.98, 960, 540], [d, 1.04, 960, 540]]} chip={DECK("18")} chip2="Company's expectation">
      <Ledger f={f} enterAt={0} cols={[{name: "THE TRUCKS", val: "+42%", sub: "Jul–Sep 2026", at: 0}, {name: "IVECO", val: "NEXT?", sub: "consolidation 'next quarter'", red: true, at: 4}]}/>
    </Desk>
  );
};

export const SHOTS3: Shot[] = [
  S("i01", -0.85, PU, i01card), S("i01", "On the thirtieth", WL, i01b), S("i01", "the company and", PU, i01c), S("i01", "an all-cash", WD, i01d),
  S("i02", 0, PU, i02a), S("i02", "The filing gave", WR, i02b), S("i02", "then, after", PUSH(1200, 400), i02c), S("i02", "five hundred and sixty", WD, i02d),
  S("i03", 0, H0, i03a), S("i03", "On the sixteenth", PU, i03b), S("i03", "The slide shows", WL, i03c), S("i03", "as of the", WD, i03d),
  S("i04", 0, PU, i04a), S("i04", "Settlement is set", WR, i04b), S("i04", "The finance chief", WL, i04c), S("i04", "from next quarter", PU, i04d),
];
void WU;
export const CUES3: SCue[] = [
  [W("i01", -0.85), "paper", 0.6], [W("i01", "On the thirtieth"), "pop", 0.4], [W("i01", "announced"), "pop", 0.5], [W("i01", "all-cash"), "highlighter", 0.5],
  [W("i02", "leaves out"), "circle", 0.5], [W("i02", "forty one thousand"), "paper", 0.5], [W("i02", "a revised"), "paper", 0.5], [W("i03", "sixteenth"), "highlighter", 0.4],
  [W("i03", "thirty five"), "ding", 0.5], [W("i04", "twenty sixth"), "pop", 0.4], [W("i04", "subject to"), "highlighter", 0.5], [W("i04", "for consolidation"), "highlighter", 0.4],
];
