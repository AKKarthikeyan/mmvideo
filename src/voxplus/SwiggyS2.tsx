// swiggyq2 chapter 2 "What did the loss buy?" (q01-q08). Ledger rows: _video/script.md (Air).
import React from "react";
import {SCue} from "./A01V4Cold";
import {ChapterQ, SP, Shot, Words} from "./A01V4Parts";
import {StickerLabel} from "./Collage";
import {C, useTicks} from "./tokens";
import {H0, PU, PUSH, S, W, WD, WL, WR, WU, useAt} from "./SwiggyCue";
import {Bars, Big, Black, Counter, Desk, Disc, Doc, Head, Lab, LETTER, RESULTS, Receipt} from "./SwiggyPieces";
import {LineChart, PriceTag, Waterfall} from "./SwiggyKit";
import {ARITH, MEASURE} from "./SwiggyS1";

const CM = "Contribution margin, % of GOV (before discounts)";
const WF = "Fall in Instamart contribution margin, Apr–Jun to Jul–Sep";

// ---------------------------------------------------------------- q01
const q01card: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <ChapterQ f={f} d={d} n={2} q="What did the loss buy?" icon="shop"/>;
};
const q01b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const ds = a("q01", "dark stores");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 1060, 540]]} chip={RESULTS("8, segment note")} chip2={LETTER("8")}>
      <StickerLabel f={f} text="INSTAMART" x={420} y={260} size={70} rot={-3} dark enter={{at: 0, mode: "drop"}}/>
      <Disc f={f} at={a("q01", "groceries")} name="bag" x={330} y={560} size={190}/>
      <Disc f={f} at={a("q01", "household")} name="box" x={560} y={620} size={190}/>
      <Disc f={f} at={ds - 6} name="shelf" x={1260} y={500} size={330}/>
      <StickerLabel f={f} text="DARK STORE" x={1260} y={730} size={62} rot={-3} dark enter={{at: ds, mode: "pop", rot0: -10}}/>
      <Lab f={f} at={a("q01", "small warehouses")} text="a small warehouse" x={1260} y={820}/>
    </Desk>
  );
};
const q01c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.1, 960, 480], [d, 1.0, 960, 520]]} chip={LETTER("5, 13")} chip2="NOV: gross order value less all discounts (letter p.20)">
      <Receipt f={f} x={960} y={120} w={860} head="INSTAMART · JUL–SEP" lines={[{l: "ORDERS, AFTER DISCOUNTS", r: "₹6,594 cr", at: 4}, {l: "", r: "", at: 6},
        {l: "IN 3 MONTHS", r: "+13.4%", at: a("q01", "thirteen"), big: true}]} rot={-2}/>
    </Desk>
  );
};
const q01d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("13")} chip2="Order value after discounts (NOV), vs Apr–Jun">
      <Big f={f} at={0} text="+13.4%" x={960} y={480} size={300} color={C.highlightPrint}/>
      <Lab f={f} at={4} text="in three months" x={960} y={680} color={C.white} size={44}/>
      <Head f={f} at={a("q01", "three months")} text="WHAT DID IT BUY?" x={960} y={880} light/>
    </Black>
  );
};
// ---------------------------------------------------------------- q02
const q02a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("3, 13")} chip2="Instamart NOV growth on the quarter before">
      <Bars f={f} title="Growth in three months" source="Order value after discounts (NOV)" max={15} box={{x: 460, y: 300, w: 1000, h: 560}} bw={220}
        bars={[{label: "JAN–MAR", v: 4, txt: "4%", at: a("q02", "four percent")}, {label: "APR–JUN", v: 2.5, txt: "2.5%", at: a("q02", "two and a half")},
          {label: "JUL–SEP", v: 13.4, txt: "13.4%", at: a("q02", "sped up"), key: true}]}/>
      <Head f={f} at={a("q02", "sped up")} text="GROWTH SPED UP" x={1620} y={250} rot={3} light/>
    </Black>
  );
};
const q02b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 1000, 520]]} chip={LETTER("13")}>
      <Doc f={f} name="nov" x={960} y={500} width={1600} hl={[["NOV growing 13.4% QoQ (vs 4% and 2.5% in", 2], ["the preceding two quarters)", 10]]}/>
    </Desk>
  );
};
const q02c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("q02", "one point three");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 900, 540]]} chip={LETTER("8, 13")} chip2="Average monthly transacting users (MTU)">
      <Disc f={f} at={0} name="crowd" x={420} y={520} size={300}/>
      <Big f={f} at={t} text="+1.3 mn" x={1180} y={400} size={170} color={C.markerRed}/>
      <Big f={f} at={a("q02", "fourteen")} text="14.8 mn" x={1180} y={640} size={170}/>
      <Lab f={f} at={a("q02", "fourteen") + 4} text="average monthly ordering users" x={1180} y={780}/>
    </Desk>
  );
};
const q02d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.05, 960, 540], [d, 1.15, 900, 500]]} chip={LETTER("13")}>
      <Doc f={f} name="users" x={960} y={520} width={1600} hl={[["added 1.3 Mn MTUs in the quarter (our highest addition in five quarters)", 0]]}/>
      <StickerLabel f={f} text="MOST IN 5 QUARTERS" x={1300} y={850} size={54} rot={3} dark enter={{at: 6, mode: "pop"}}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- q03
const q03a: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="Did users stay?" at={1} mark={["stay?"]} markAt={8} size={170}/>;
};
const q03b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 1000, 540]]} chip={LETTER("13")} chip2="Company's claim">
      <Doc f={f} name="users" x={960} y={520} width={1600} hl={[["Month-1 retention", a("q03", "month one")],
        ["of the transacting user base averaged over 60% for the quarter which was meaningfully", a("q03", "averaged")], ["higher than the previous quarters", a("q03", "meaningfully") + 6]]}/>
    </Desk>
  );
};
const q03c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.08, 960, 540], [d, 1.0, 960, 540]]} chip={LETTER("13, 17-20")} chip2="Glossary has no entry for it">
      <Big f={f} at={-20} text="60%+" x={700} y={480} size={260} color={C.inkSoft}/>
      <StickerLabel f={f} text="TERM NOT DEFINED" x={1260} y={540} size={70} rot={-4} color={C.white} bg={C.markerRed} enter={{at: a("q03", "define"), mode: "drop"}}/>
      <Head f={f} at={4} text="DID USERS STAY?" x={960} y={880}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- q04
const q04a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={LETTER("5, 8")} chip2="Net new stores">
      <Disc f={f} at={0} name="store" x={420} y={500} size={280}/>
      <Big f={f} at={a("q04", "Sixty nine")} text="+69" x={420} y={760} size={120} color={C.markerRed}/>
      <Counter f={f} keys={[[0, 1171], [6, 1171], [40, 1240]]} x={1200} y={480} size={170} label="DARK STORES, 30 SEP 2026"/>
    </Desk>
  );
};
const q04b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 1000, 520]]} chip={LETTER("14")}>
      <Doc f={f} name="stores" x={960} y={500} width={1600} hl={[["We added 69 dark stores during the", 0], ["equivalent to the previous 3 quarters", a("q04", "as many as")]]}/>
    </Desk>
  );
};
const q04c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("8")} chip2={ARITH("adds from exit store counts: 34 + 7 + 28 = 69")}>
      <Bars f={f} title="Net new dark stores" source="Per quarter, from the letter's exit counts" max={80} box={{x: 360, y: 300, w: 1200, h: 560}} bw={200}
        bars={[{label: "OCT–DEC", v: 34, txt: "34", at: 0}, {label: "JAN–MAR", v: 7, txt: "7", at: 3}, {label: "APR–JUN", v: 28, txt: "28", at: 6},
          {label: "JUL–SEP", v: 69, txt: "69", at: 12, key: true}]}/>
      <Big f={f} at={a("q04", "two hundred") } text="1,240 in all" x={1520} y={200} size={80} color={C.white}/>
    </Black>
  );
};
const q04d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = a("q04", "one thousand one hundred");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 520]]} chip={LETTER("8, 14")} chip2="Based on active store-days">
      <Disc f={f} at={0} name="store" x={400} y={500} size={260}/>
      <Counter f={f} keys={[[0, 1089], [t - 6, 1089], [t + 30, 1192]]} x={1180} y={460} size={170} label="ORDERS PER STORE PER DAY"/>
      <Lab f={f} at={a("q04", "up from")} text="up from 1,089" x={1180} y={680} color={C.markerRed}/>
      <Head f={f} at={4} text="MORE, BUSIER STORES" x={960} y={890}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- q05
const q05a: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="So what did it cost?" at={1} mark={["cost?"]} markAt={8} size={150}/>;
};
const q05b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 1000, 520]]} chip={LETTER("14")} chip2="Take rate: Swiggy's cut of each order">
      <Doc f={f} name="cm" x={960} y={460} width={1600} hl={[["while our take rate declined by 140 bps QoQ", a("q05", "fell")]]}/>
      <Big f={f} at={a("q05", "one point four")} text="–1.4 pts" x={1400} y={840} size={120} color={C.markerRed}/>
    </Desk>
  );
};
const q05c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("14")} chip2={CM}>
      <LineChart f={f} title="Instamart contribution" source="After the direct costs of orders · % of GOV" min={-2} max={1}
        band={{from: 0, to: -1, label: "GUIDED RANGE: 0 TO –1%", at: a("q05", "guided range")}}
        pts={[{label: "MAY 2026", v: 0, txt: "BREAK-EVEN", at: a("q05", "broke even")}, {label: "JUL–SEP 2026", v: -1.0, txt: "–1.0%", at: a("q05", "minus one")}]}/>
    </Black>
  );
};
const q05d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 1100, 520]]} chip={LETTER("14")} chip2={CM}>
      <Doc f={f} name="cm" x={960} y={500} width={1600} hl={[["CM moved to -1.0% of GOV in Q2FY27", 0], ["of zero to -100 bps on CM", a("q05", "guided range")]]}/>
      <Head f={f} at={4} text="WHAT DID IT COST?" x={1380} y={880}/>
    </Desk>
  );
};
// ---------------------------------------------------------------- q06 / q07: the break-up of the quarter's fall
const q06a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("14")} chip2="Percentage points of GOV">
      <Waterfall f={f} title="The quarter's fall in contribution" source={WF} steps={[{label: "TARGETED INVESTMENTS", v: -1.0, at: a("q06", "One percentage")}]}/>
    </Black>
  );
};
const q06b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.12, 900, 500]]} chip={LETTER("14")}>
      <Doc f={f} name="targeted" x={960} y={520} width={1600} hl={[["Targeted investments of 100 bps in habit formation and dormant-user reactivation", 0]]}/>
    </Desk>
  );
};
const q06c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const r = a("q06", "nine rupee");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 560]]} chip="Our reading" chip2={LETTER("13-14")}>
      <div style={{position: "absolute", left: 360, top: 520, width: 1200, height: 140, background: C.markerRed, boxShadow: "0 14px 28px rgba(0,0,0,0.25)"}}/>
      <Lab f={f} at={0} text="–1.0 PT · TARGETED INVESTMENTS" x={960} y={590} color={C.white} size={48}/>
      <PriceTag f={f} at={r - 4} x={960} y={150} text="₹9 STORE" size={110}/>
      <Head f={f} at={r + 8} text="WHERE ₹9 SITS?" x={960} y={830}/>
    </Desk>
  );
};
const STEPS = (t1: number, t2: number, t3: number) => [{label: "TARGETED", v: -1.0, at: t1}, {label: "MIX", v: -0.4, at: t2}, {label: "BUSIER STORES", v: 0.6, at: t3}];
const q07a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("14")} chip2="Percentage points of GOV">
      <Waterfall f={f} title="The quarter's fall in contribution" source={WF} steps={STEPS(-30, a("q07", "zero point four"), a("q07", "clawed back"))}/>
    </Black>
  );
};
const q07b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.05, 960, 560], [d, 1.12, 960, 600]]} chip={LETTER("14")}>
      <Doc f={f} name="targeted" x={960} y={520} width={1600} hl={[["Adverse mix led impact of 40 bps", -20], ["delivered 60 bps of improvement", 2]]}/>
    </Desk>
  );
};
const q07c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("14")} chip2="Reported fall: 82 bps (rounding)">
      <Waterfall f={f} title="The quarter's fall in contribution" source={WF} steps={STEPS(-60, -60, -60)} total={{label: "NET FALL", at: 0}}/>
      <Head f={f} at={6} text="NET FALL: –0.8" x={1600} y={880} light/>
    </Black>
  );
};
// ---------------------------------------------------------------- q08: the loss and the twist
const q08a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("5, 8")} chip2={MEASURE}>
      <Bars f={f} title="Instamart, adjusted EBITDA" source="₹ crore" max={60} min={-1000} box={{x: 560, y: 260, w: 800, h: 560}}
        bars={[{label: "APR–JUN", v: -778, txt: "–₹778 cr", at: 0}, {label: "JUL–SEP", v: -895, txt: "–₹895 cr", at: a("q08", "Eight hundred"), key: true}]}/>
      <Lab f={f} at={a("q08", "one hundred and eighteen")} text="+₹118 cr" x={1600} y={720} size={56} color="#FF8FA8"/>
    </Black>
  );
};
const q08b: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <Words f={f} d={d} text="Here is the twist." at={1} mark={["twist."]} markAt={8} size={160}/>;
};
const MARGIN = (t: number) => [{label: "JUL–SEP 25", v: -12.1, txt: "–12.1%", at: t}, {label: "OCT–DEC", v: -11.4, txt: "–11.4%", at: t + 4},
  {label: "JAN–MAR", v: -10.9, txt: "–10.9%", at: t + 8}, {label: "APR–JUN", v: -9.8, txt: "–9.8%", at: t + 12}];
const q08c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={LETTER("5, 8 (chart)") + " · press release"} chip2={MEASURE + ", % of GOV"}>
      <LineChart f={f} title="Instamart loss as a share of GOV" source="Adjusted EBITDA margin · % of gross order value" min={-13} max={-8}
        pts={[...MARGIN(0), {label: "JUL–SEP 26", v: -9.7, txt: "–9.7%", at: a("q08", "nine point seven")}]} circleLast={a("q08", "barely moved")}/>
    </Black>
  );
};
const q08d: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Black f={f} d={d} chip={ARITH("GOV +16.7% on the quarter; loss 778 → 895 = +15.0%")} chip2={LETTER("5, 8")}>
      <Bars f={f} title="Growth on the quarter before" source="Instamart, Apr–Jun to Jul–Sep" max={20} box={{x: 560, y: 300, w: 800, h: 560}}
        bars={[{label: "GROSS ORDER VALUE", v: 16.7, txt: "+16.7%", at: 0, key: true}, {label: "LOSS", v: 15.0, txt: "+15.0%", at: a("q08", "than the loss") - 6}]}/>
    </Black>
  );
};

export const SHOTS2: Shot[] = [
  S("q01", -0.85, PU, q01card), S("q01", "Instamart delivers", WL, q01b), S("q01", "Last quarter", PU, q01c), S("q01", "thirteen point", PUSH(960, 540), q01d),
  S("q02", 0, WD, q02a), S("q02", "So it sped", PU, q02b), S("q02", "average monthly", WL, q02c), S("q02", "its most", WU, q02d),
  S("q03", 0, H0, q03a), S("q03", "The letter says", PU, q03b), S("q03", "It does not", WR, q03c),
  S("q04", 0, PU, q04a), S("q04", "as many as", WL, q04b), S("q04", "for one thousand", WD, q04c), S("q04", "Each store", PU, q04d),
  S("q05", 0, H0, q05a), S("q05", "Swiggy's cut", PU, q05b), S("q05", "After the direct", WD, q05c), S("q05", "For the quarter", WL, q05d),
  S("q06", 0, WD, q06a), S("q06", "Targeted investments", PU, q06b), S("q06", "Our reading", WR, q06c),
  S("q07", 0, WD, q07a), S("q07", "Cost efficiencies", PU, q07b), S("q07", "Net fall", WU, q07c),
  S("q08", 0, WL, q08a), S("q08", "Here is the twist", H0, q08b), S("q08", "As a share", WD, q08c), S("q08", "By our arithmetic", WR, q08d),
];
export const CUES2: SCue[] = [
  [W("q01", -0.85), "paper", 0.6], [W("q01", "dark stores"), "pop", 0.5], [W("q01", "thirteen"), "ding", 0.5], [W("q02", "sped up"), "whoosh", 0.5],
  [W("q02", "one point three"), "ding", 0.4], [W("q03", "define"), "stamp", 0.5], [W("q04", "Sixty nine"), "ding", 0.4], [W("q04", "as many as"), "highlighter", 0.4],
  [W("q04", "one thousand one hundred"), "ding", 0.4], [W("q05", "fell"), "highlighter", 0.4], [W("q05", "broke even"), "pop", 0.5], [W("q05", "minus one"), "stamp", 0.5],
  [W("q06", "One percentage"), "stamp", 0.5], [W("q06", "Targeted investments"), "highlighter", 0.4], [W("q06", "nine rupee"), "paper", 0.5],
  [W("q07", "zero point four"), "stamp", 0.4], [W("q07", "clawed back"), "pop", 0.5], [W("q07", "Net fall"), "stamp", 0.6], [W("q08", "Eight hundred"), "stamp", 0.5],
  [W("q08", "Here is the twist"), "whoosh", 0.6], [W("q08", "barely moved"), "circle", 0.6], [W("q08", "By our arithmetic"), "whoosh", 0.4],
];
