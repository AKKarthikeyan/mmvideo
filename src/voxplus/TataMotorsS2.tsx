// tatamotorsq2 chapter 3 "Why it kept less" (m01-m05) and chapter 4 "The cash" (k01-k03). Standalone figures (incl. Tata Cummins JO);
// EBITDA and free cash flow are the company's own defined measures (deck p.3) and chipped so.
import React from "react";
import {SCue} from "./A01V4Cold";
import {ChapterQ, SP, Shot, Stamp, Words} from "./A01V4Parts";
import {StickerLabel} from "./Collage";
import {C, useTicks} from "./tokens";
import {H0, PU, PUSH, S, W, WD, WL, WR, WU, useAt} from "./TataMotorsCue";
import {Bars, Big, Black, DECK, Desk, Disc, Doc, Head, Lab, RELEASE, RowsCard, Rs, STANDALONE, Squares} from "./TataMotorsPieces";
import {BStep, Bridge, PriceTag, Safe} from "./TataMotorsKit";
import {ARITH, MEASURE, zoomCam} from "./TataMotorsS1";

const FCFM = "Company's measure: free cash flow";
// PBT (bei) bridge, deck p.9 (labels matched to the page image)
const PBT = (t: number[]): BStep[] => [
  {label: "PBT (bei) Jul–Sep 25", v: 1757, at: t[0], kind: "start"}, {label: "Volume, mix", v: 1159, at: t[1]}, {label: "Realisation (net)", v: 1017, at: t[2]},
  {label: "Variable costs", v: -1416, at: t[3]}, {label: "Other costs", v: -214, at: t[4]}, {label: "FX & others", v: 356, at: t[5]}, {label: "PBT (bei) Jul–Sep 26", v: 2660, at: t[6], kind: "total"},
];
const N = 9999;
// ---------------------------------------------------------------- m01
const m01card: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <ChapterQ f={f} d={d} n={3} q="Why it kept less" icon="coin"/>;
};
const m01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("21")} chip2={MEASURE + " · " + STANDALONE}>
      <Bars f={f} title="Sales outran profit" source="Jul–Sep 2026 vs Jul–Sep 2025" max={50} box={{x: 560, y: 300, w: 800, h: 560}}
        bars={[{label: "REVENUE", v: 42, txt: "+42%", at: 0}, {label: "EBITDA", v: 31, txt: "+31%", at: a("m01", "rose only") - 4, key: true}]}/>
    </Black>
  );
};
const m01c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 900, 520]]} chip={DECK("3")} chip2={MEASURE}>
      <Doc f={f} name="ebitdadef" x={960} y={460} width={1500} hl={[["Reported EBITDA is defined", 2]]}/>
      <StickerLabel f={f} text="COMPANY'S MEASURE" x={960} y={820} size={58} rot={-2} dark enter={{at: 8, mode: "pop"}}/>
    </Desk>
  );
};
const m01d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("21")} chip2={MEASURE + ", % of revenue"}>
      <Squares f={f} at={0} fill={11.7} x={720} y={540} cell={78} per={0.2}/>
      <Lab f={f} at={4} text="₹100 of sales · one square = ₹1" x={720} y={980} color="#CFC9BE" size={30}/>
      <Big f={f} at={a("m01", "eleven rupees")} text="₹11.70" x={1480} y={440} size={160} color={C.highlightPrint}/>
      <Head f={f} at={a("m01", "eleven rupees") + 8} text="₹11.70 PER ₹100" x={1480} y={620} rot={3} light/>
    </Black>
  );
};
const m01e: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("21")} chip2={MEASURE}>
      <Bars f={f} title="EBITDA per ₹100 of sales" source="Jul–Sep · standalone" max={14} box={{x: 560, y: 300, w: 800, h: 560}}
        bars={[{label: "2025", v: 12.6, txt: "₹12.60", at: 0}, {label: "2026", v: 11.7, txt: "₹11.70", at: 2, key: true}]}/>
    </Black>
  );
};
// ---------------------------------------------------------------- m02: steel and rubber
const m02a: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="Why?" at={0} mark={["Why?"]} markAt={6} size={260}/>;
};
const m02b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip="Results, release and deck · 23 Oct 2026">
      <Disc f={f} at={0} name="scale" x={960} y={460} size={320}/>
      <Big f={f} at={a("m02", "one cause") - 2} text="?" x={1240} y={340} size={220} color={C.markerRed}/>
      <Head f={f} at={a("m02", "one cause")} text="NO SINGLE CAUSE NAMED" x={960} y={850}/>
    </Desk>
  );
};
const m02c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={zoomCam("cfo", "particularly in steel and rubber, we maintained margins sequentially", a("m02", "Despite"), d, 1.35, 960, 560, 1700, -0.5)} chip={RELEASE("3")} chip2="CFO GV Ramanan">
      <StickerLabel f={f} text="GV RAMANAN · CFO" x={420} y={190} size={54} rot={-3} dark enter={{at: 0, mode: "drop"}}/>
      <Doc f={f} name="cfo" x={960} y={560} width={1700} rot={-0.5} hl={[["Despite significant commodity cost pressures", a("m02", "Despite")], ["particularly in steel and rubber, we maintained margins sequentially", a("m02", "particularly")]]}/>
    </Desk>
  );
};
const m02d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("21")} chip2={MEASURE}>
      <Bars f={f} title="Against the June quarter" source="EBITDA per ₹100 of sales" max={14} box={{x: 560, y: 300, w: 800, h: 560}}
        bars={[{label: "APR–JUN 26", v: 11.7, txt: "₹11.70", at: 0}, {label: "JUL–SEP 26", v: 11.7, txt: "₹11.70", at: 4, key: true}]}/>
      <Head f={f} at={a("m02", "margins held")} text="HELD" x={1600} y={300} rot={3} light/>
    </Black>
  );
};
// ---------------------------------------------------------------- m03: the bridge
const bridgeShot = (title: string, upto: (a: (k: string, x?: number | string) => number) => number[], circle?: (a: (k: string, x?: number | string) => number) => [number, number]): React.FC<SP> =>
  ({s0, d}) => {
    const f = useTicks(), a = useAt(s0);
    return (
      <Black f={f} d={d} chip={DECK("9") + " · for analytical purposes only"} chip2={STANDALONE}>
        <Bridge f={f} title={title} source="Profit before exceptional items and tax · ₹ crore · Jul–Sep 2025 → 2026" steps={PBT(upto(a))} max={4300} circle={circle ? circle(a) : undefined}/>
      </Black>
    );
  };
const m03a = bridgeShot("The tug of war", () => [0, N, N, N, N, N, N]);
const m03b = bridgeShot("The tug of war", (a) => [-40, a("m03", "added one thousand one hundred"), N, N, N, N, N]);
const m03c = bridgeShot("The tug of war", (a) => [-40, -30, a("m03", "added one thousand and seventeen"), N, N, N, N]);
const m03d = bridgeShot("The tug of war", (a) => [-40, -30, -20, a("m03", "took away"), N, N, N], (a) => [3, a("m03", "four hundred and sixteen")]);
const m03head: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  return (
    <Desk f={f} d={d} cam={[[0, 1.1, 960, 540], [d, 1.0, 960, 540]]} chip={DECK("9")}>
      <Disc f={f} at={0} name="truck" x={560} y={480} size={260}/>
      <Disc f={f} at={2} name="steel" x={1360} y={480} size={260}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}><path d="M 700 480 Q 960 560 1220 480" fill="none" stroke="#B8432F" strokeWidth={10}/></svg>
      <Head f={f} at={4} text="THE TUG OF WAR" x={960} y={820}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- m04: largely or partially
const m04a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={DECK("9")}>
      <Doc f={f} name="largely" x={960} y={480} width={1600} hl={[["largely offset", a("m04", "largely")]]}/>
      <Head f={f} at={a("m04", "largely") + 8} text="LARGELY" x={600} y={800}/>
    </Desk>
  );
};
const m04b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={zoomCam("partially", "helped partially mitigate the impact", 6, d, 1.55, 960, 460, 1700, -0.8)} chip={RELEASE("2")}>
      <Doc f={f} name="partially" x={960} y={460} width={1700} hl={[["helped partially mitigate the impact", a("m04", "partially")]]}/>
      <Head f={f} at={a("m04", "partially") + 6} text="LARGELY OR PARTIALLY?" x={960} y={850}/>
    </Desk>
  );
};
const m04c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip="Not in the filings">
      <PriceTag f={f} at={0} x={900} y={140} text="STEEL + RUBBER: ₹ ?" size={100}/>
      <Stamp f={f} at={a("m04", "no number")} text="NOT IN THE FILINGS" x={960} y={760} size={96} rot={-6}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- m05: did profit fall?
const m05a: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="So did profit fall?" at={1} mark={["fall?"]} markAt={8} size={150}/>;
};
const m05b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("9")} chip2={STANDALONE}>
      <Bridge f={f} title="No." source="Profit before exceptional items and tax · ₹ crore" steps={PBT([-50, -50, -50, -50, 0, 6, 12])} max={4300}/>
      <Stamp f={f} at={4} text="NO" x={1650} y={300} size={140} rot={-10}/>
    </Black>
  );
};
const m05c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("21") + " · " + RELEASE("2")} chip2={STANDALONE}>
      <Bars f={f} title="Profit before exceptional items and tax" source="₹ crore · Jul–Sep" max={3000} box={{x: 560, y: 300, w: 800, h: 560}}
        bars={[{label: "2025", v: 1757, txt: "₹1,757", at: 0}, {label: "2026", v: 2660, txt: "₹2,660", at: a("m05", "two thousand six") - 4, key: true}]}/>
      <Big f={f} at={a("m05", "fifty one")} text="+51%" x={1500} y={430} size={160} color={C.highlightPrint}/>
    </Black>
  );
};
const m05d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 560]]} chip={DECK("21")} chip2="₹ crore, Jul–Sep 2025 → 2026 · retyped">
      <RowsCard f={f} head="Standalone P&L details (₹ crore)" y={600} rows={[{l: "Finance cost", v: "186 → 52", hl: a("m05", "Lower finance")},
        {l: "Other income (excl. grants)", v: "222 → 340", hl: a("m05", "higher other")}]}/>
      <Head f={f} at={a("m05", "helped")} text="PROFIT STILL ROSE" x={960} y={900}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- k01: the cash
const k01card: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <ChapterQ f={f} d={d} n={4} q="The cash" icon="bank"/>;
};
const k01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]} chip={DECK("10")} chip2={FCFM + " · " + STANDALONE}>
      <Disc f={f} at={0} name="coin" x={420} y={500} size={260}/>
      <Head f={f} at={4} text="FREE CASH FLOW" x={1160} y={260}/>
      <Rs f={f} at={a("k01", "four thousand")} v={4606} x={1160} y={480} size={220}/>
      <Lab f={f} at={a("k01", "four thousand") + 10} text="free cash flow · Jul–Sep 2026" x={1160} y={650} size={38}/>
    </Desk>
  );
};
const k01c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("10")} chip2={FCFM}>
      <Bars f={f} title="Free cash flow" source="₹ crore · Jul–Sep · standalone" max={5200} box={{x: 560, y: 300, w: 800, h: 560}}
        bars={[{label: "2025", v: 2210, txt: "₹2,210", at: a("k01", "two thousand two") - 4}, {label: "2026", v: 4606, txt: "₹4,606", at: 0, key: true}]}/>
    </Black>
  );
};
const k01d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 900, 520]]} chip={DECK("3")} chip2={FCFM}>
      <Doc f={f} name="fcfdef" x={960} y={440} width={1400} hl={[["Free cash flow is defined as", 2]]}/>
      <Head f={f} at={a("k01", "Where did")} text="WHERE FROM?" x={960} y={820}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- k02: working capital
const FCF = (t: number[]): BStep[] => [
  {label: "Cash profit after tax", v: 2287, at: t[0], kind: "start"}, {label: "Capex", v: -483, at: t[1]}, {label: "Working capital", v: 2679, at: t[2]},
  {label: "Finance (net) & dividend", v: 123, at: t[3]}, {label: "Free cash flow", v: 4606, at: t[4], kind: "total"},
];
const k02a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("10")} chip2={FCFM}>
      <Bridge f={f} title="Where the cash came from" source="₹ crore · Jul–Sep 2026 · the deck's own table" max={5600}
        steps={FCF([0, a("k02", "two thousand two hundred and eighty") + 14, a("k02", "Changes in working") + 6, N, N])}/>
    </Black>
  );
};
const k02b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("10")} chip2={FCFM}>
      <Bridge f={f} title="Where the cash came from" source="₹ crore · Jul–Sep 2026" max={5600} steps={FCF([-40, -30, a("k02", "added two thousand"), a("k02", "added two thousand") + 16, a("k02", "added two thousand") + 26])}
        circle={[2, a("k02", "six hundred and seventy nine")]}/>
    </Black>
  );
};
const k02c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("10")} chip2={ARITH("2,679 ÷ 4,606 = 58.2%")}>
      <Squares f={f} at={0} fill={58} x={720} y={540} cell={78} per={0.2}/>
      <Big f={f} at={a("k02", "fifty eight")} text="58%" x={1480} y={430} size={190} color={C.highlightPrint}/>
      <Head f={f} at={a("k02", "fifty eight") + 8} text="FROM WORKING CAPITAL" x={1480} y={620} rot={3} light/>
    </Black>
  );
};
const k02d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={DECK("10")} chip2={ARITH("905 ÷ 2,210 = 41%; 2,679 ÷ 4,606 = 58%")}>
      <Bars f={f} title="Share of free cash from working capital" source="Jul–Sep · our arithmetic on the deck's table" max={70} box={{x: 560, y: 300, w: 800, h: 560}}
        bars={[{label: "2025", v: 41, txt: "41%", at: a("k02", "forty one") - 4}, {label: "2026", v: 58, txt: "58%", at: 0, key: true}]}/>
    </Black>
  );
};
// ---------------------------------------------------------------- k03: net cash
const k03a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]} chip={RELEASE("2")} chip2={STANDALONE}>
      <Safe f={f} at={0} x={960} y={480} v="₹11.3K CR" label="net cash · the company" sub="30 Sep 2026"/>
    </Desk>
  );
};
const k03b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 1100, 540]]} chip={RELEASE("2") + " · " + DECK("13")} chip2="Group = consolidated, unaudited">
      <Safe f={f} at={-30} x={560} y={500} v="₹11.3K CR" label="the company" s={0.8}/>
      <Safe f={f} at={a("k03", "fifteen thousand") - 6} x={1340} y={480} v="₹15.9K CR" label="the group" s={1.1}/>
    </Desk>
  );
};
const k03c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.16, 960, 520]]} chip={DECK("13")}>
      <Doc f={f} name="tmf" x={960} y={460} width={1300} hl={[["market value", a("k03", "market value")]]}/>
      <Head f={f} at={a("k03", "nets") + 4} text="NET CASH" x={960} y={820}/>
    </Desk>
  );
};

export const SHOTS2: Shot[] = [
  S("m01", -0.85, PU, m01card), S("m01", "Sales rose", WL, m01b), S("m01", "EBITDA, an", PU, m01c), S("m01", "Out of every", WD, m01d), S("m01", "against twelve", WR, m01e),
  S("m02", 0, H0, m02a), S("m02", "The filings do not", PU, m02b), S("m02", "The chief", WL, m02c), S("m02", "Against the June", WD, m02d),
  S("m03", 0, PU, m03a), S("m03", "Volume and mix", WR, m03b), S("m03", "Realisation", PUSH(1100, 600), m03c), S("m03", "Variable costs", PUSH(1300, 700), m03d),
  S("m04", 0, PU, m04a), S("m04", "The press release", WL, m04b), S("m04", "The filings put", WD, m04c),
  S("m05", 0, H0, m05a), S("m05", "No", WU, m05b), S("m05", "On the company's", PU, m05c), S("m05", "Lower finance", WR, m05d),
  S("k01", -0.85, PU, k01card), S("k01", "Free cash flow", WL, k01b), S("k01", "against two thousand", WD, k01c), S("k01", "Where did", PU, k01d),
  S("k02", 0, WR, k02a), S("k02", "added two thousand", PUSH(1200, 500), k02b), S("k02", "By our arithmetic", WD, k02c), S("k02", "A year earlier", WL, k02d),
  S("k03", 0, PU, k03a), S("k03", "The group figure", WR, k03b), S("k03", "nets", PU, k03c),
];
void m03head;
export const CUES2: SCue[] = [
  [W("m01", -0.85), "paper", 0.6], [W("m01", "rose only"), "whoosh", 0.4], [W("m01", "eleven rupees"), "ding", 0.5], [W("m02", "Why"), "stamp", 0.6],
  [W("m02", "particularly"), "highlighter", 0.5], [W("m03", "Volume and mix"), "pop", 0.4], [W("m03", "Realisation"), "pop", 0.4], [W("m03", "took away"), "stamp", 0.5],
  [W("m04", "largely"), "highlighter", 0.4], [W("m04", "partially"), "highlighter", 0.4], [W("m04", "no number"), "stamp", 0.7], [W("m05", "No"), "stamp", 0.8],
  [W("m05", "fifty one"), "ding", 0.5], [W("k01", -0.85), "paper", 0.6], [W("k01", "four thousand"), "ding", 0.5], [W("k02", "added two thousand"), "pop", 0.5],
  [W("k02", "six hundred and seventy nine"), "circle", 0.5], [W("k02", "fifty eight"), "ding", 0.5], [W("k03", "eleven thousand"), "click", 0.6], [W("k03", "fifteen thousand"), "click", 0.6],
  [W("k03", "market value"), "highlighter", 0.4],
];
