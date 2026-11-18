// Jio film, chapter 8: The verdict (beats q80 q81 q82 q83 q84 q85 q86 q87 q88 q90 q91 q92). VoxPlus "reporter's desk": real RHP pages with the
// highlighter, a hanging price tag, the MoatOS verdict sheet, charts on black, typed cards and sticky notes, sources page, teaser, plain end card.
// Numbers come from the ledger (scripts/ledger/jioipo.csv) or are spoken in the beat; every cue is tied to the word that says it (kit.tsx useAt).
import React from "react";
import {AbsoluteFill} from "remotion";
import {BigWord, PriceTag} from "../BigType";
import {ChapterCard, SourceTag} from "../Cards";
import {PhotoPrint, StickerLabel, Sticker} from "../Collage";
import {DocPage, docRectCentre} from "../DocPage";
import {Rect} from "../Marker";
import {Finish} from "../Texture";
import {C, F, ease, inOut, outCubic, outQuint, useTicks} from "../tokens";
import {Desk, MarkerText, Num, Paper, Shot, SP, Sub} from "../A01V4Parts";
import {SCue} from "../A01V4Cold";
import {H0, PU, PUSH, S, WD, WL, WR, W as WK, useAt} from "./kit";
import {COL_X, EndCard, FlyNote, IndexCard, PassRuler, ROW_Y, Rs, Sticky, SourcesPage, TwoLines, VerdictSheet, WatchCard, ZeroBars} from "./parts8";

const label = (f: number, at: number, text: string, x: number, y: number, o: {dark?: boolean; size?: number; rot?: number; exit?: number} = {}) =>
  <StickerLabel f={f} text={text} x={x} y={y} size={o.size ?? 54} dark={o.dark ?? true} rot={o.rot ?? -1.5} enter={{at, mode: "slide", from: [0, 300], dur: 9}}
    exit={o.exit != null ? {at: o.exit, to: [0, 260], dur: 8} : undefined}/>;
const PAST = -999;   // "already happened" for a shot that continues the same picture

// =====================================================================================================
// q80 · chapter card
// =====================================================================================================
const q80: React.FC<SP> = () => {
  const f = useTicks();
  return <AbsoluteFill><ChapterCard f={f} n={8} word="The verdict"/><Finish f={f}/></AbsoluteFill>;
};

// =====================================================================================================
// q81 · back to the debt
// =====================================================================================================
const q81a: React.FC<SP> = ({s0, d}) => {      // "Back to the debt." The 0.36x sticky note from chapter 1 flies in.
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.07, 960, 580]]} chip="Jio RHP p.132 · FY26">
      <BigWord f={f} at={1} text="Back to the debt." x={960} y={225} size={124} color={C.ink} stagger={6}/>
      <FlyNote f={f} at={5} text="0.36×" size={170} to={[960, 620]}/>
      {label(f, a("q81", "net debt"), "Net debt ÷ EBITDA", 960, 862, {size: 50})}
    </Desk>
  );
};
const KPI = {src: "jio/docs/ch8_kpi.png", imgW: 1422, imgH: 329, x: 960, y: 540, width: 1560, rot: -0.8};
const KPI_CELL: Rect = [973.4, 184.3, 60.9, 29.9], KPI_ROW: Rect = [0, 181.3, 1422, 38.9];
const q81b: React.FC<SP> = ({s0, d}) => {      // The prospectus shows net debt at 0.36 times EBITDA (real KPI table, p.132)
  const f = useTicks(), a = useAt(s0);
  const t0 = a("q81", "zero"), c = docRectCentre(KPI, KPI_CELL);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.132 · key indicators" cam={[[0, 1.0, 960, 540], [t0 - 8, 1.0, 960, 540], [t0 + 30, 2.0, c.x - 120, c.y, inOut]]}>
      <DocPage f={f} {...KPI} stack={2} enter={{at: 0, mode: "slide-up", dur: 10}} highlights={[{rects: [KPI_CELL], at: t0, dur: 16}]}
        circles={[{rect: [KPI_CELL[0] - 760, KPI_CELL[1], 260, KPI_CELL[3]], at: a("q81", "times EBITDA"), dur: 14}]} focus={{rect: KPI_ROW, at: t0 - 12, blur: 2.2}}/>
    </Desk>
  );
};
const ND = {src: "jio/docs/ch8_netdebt.png", imgW: 1987, imgH: 235, x: 960, y: 560, width: 1580, rot: 0.7};
const ND_PHRASE: Rect = [362.3, 103.5, 631.9, 26.7];
const q81c: React.FC<SP> = ({s0, d}) => {      // Its own note says that leaves out deferred payment liabilities (p.137 note 2)
  const f = useTicks(), a = useAt(s0);
  const t0 = a("q81", "leaves out"), c = docRectCentre(ND, ND_PHRASE);
  return (
    <Desk f={f} d={d} tone="cream" chip="Jio RHP p.137 · note 2" cam={[[0, 1.0, 960, 560], [t0 - 20, 1.05, 960, 560], [t0 + 40, 2.1, c.x + 40, c.y, inOut]]}>
      <DocPage f={f} {...ND} stack={3} enter={{at: 0, mode: "slide-left", dur: 10}} highlights={[{rects: [ND_PHRASE], at: t0, dur: 56}]} focus={{rect: [0, 76, 1987, 100], at: t0 - 6, blur: 2}}/>
      {label(f, a("q81", "Its own"), "Note 2", 380, 300, {size: 52})}
    </Desk>
  );
};
const q81d: React.FC<SP> = ({s0, d}) => {      // ₹1,04,514 crore, not in the 0.36x
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" chip="Jio RHP p.137, p.364 · as at 30 Jun 2026" cam={[[0, 1.1, 960, 520], [d, 1.0, 960, 540, outCubic]]}>
      <Num f={f} at={a("q81", "One lakh")} to={104514} dur={74} x={960} y={430} size={250} color={C.highlightPrint} pre="₹" preSans/>
      <Sub f={f} at={a("q81", "crore rupees")} text="crore rupees still owed" x={960} y={620} size={48} color="#CFC9BE"/>
      <MarkerText f={f} at={a("q81", "still")} text="not in the 0.36×" x={960} y={790} size={104} rot={-3} dur={16}/>
    </Desk>
  );
};
const AU = {src: "jio/docs/ch8_auctions.png", imgW: 1463, imgH: 348, x: 960, y: 530, width: 1560, rot: 0.8};
const R21: Rect = [989.9, 79.1, 196.5, 31.5], R22: Rect = [987.7, 157.8, 201.9, 31.5], R24: Rect = [953.3, 236.6, 170.7, 31.5];
const q81e: React.FC<SP> = ({s0, d}) => {      // owed for spectrum from the 2021, 2022 and 2024 auctions (p.364)
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.364 · as at 30 Jun 2026" cam={[[0, 1.2, 760, 520], [d, 1.3, 1180, 560, inOut]]}>
      <DocPage f={f} {...AU} stack={2} enter={{at: 0, mode: "slide-up", dur: 10}}
        highlights={[{rects: [R21], at: a("q81", "twenty twenty one"), dur: 14}, {rects: [R22], at: a("q81", "twenty two"), dur: 14}, {rects: [R24], at: a("q81", "twenty four"), dur: 14}]}/>
      {label(f, a("q81", "owed for"), "Spectrum dues, 3 auctions", 960, 230, {size: 50})}
    </Desk>
  );
};

// =====================================================================================================
// q82 · include them: 0.36x -> 1.73x, Airtel 1.36x
// =====================================================================================================
const q82a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const flip = a("q82", "one point seven");
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 880, 560]]} chip="Jio RHP p.137 · our arithmetic">
      <PriceTag f={f} enterAt={0} x={700} y={-50} string={360} scale={1.45}
        values={[{text: "0.36×", at: 0, crossAt: a("q82", "Jio's ratio")}, {text: "1.73×", at: flip, stamp: true}]}/>
      <MarkerText f={f} at={a("q82", "Include")} text="+ spectrum dues" x={1330} y={420} size={104} rot={-4} dur={16}/>
      {label(f, 4, "As filed", 700, 700, {size: 50, exit: flip - 4})}
      {label(f, flip + 6, "With spectrum dues", 700, 700, {size: 50})}
      <Sub f={f} at={a("q82", "Include") + 20} text="net debt ÷ EBITDA" x={1330} y={600} size={44} color={C.inkSoft}/>
    </Desk>
  );
};
const q82b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" cam={[[0, 1.12, 960, 560], [d, 1.0, 960, 540, outCubic]]} chip="Jio RHP p.137 · note 2">
      <PriceTag f={f} enterAt={-200} x={600} y={-50} string={360} scale={1.45} values={[{text: "1.73×", at: -200, stamp: true}]}/>
      <PriceTag f={f} enterAt={a("q82", "Airtel's")} x={1320} y={-50} string={330} scale={1.45} values={[{text: "1.36×", at: 0}]}/>
      {label(f, -200, "Jio, with spectrum dues", 600, 700, {size: 46})}
      {label(f, a("q82", "which already"), "Airtel, already includes them", 1320, 700, {size: 46, dark: false})}
    </Desk>
  );
};

// =====================================================================================================
// q83 · moat verdict: NARROW, 4.87 / 10, three passes, walls and limits
// =====================================================================================================
const CHIP83 = "Moat & Margin · MoatOS 6.0 · our scoring";
const q83a: React.FC<SP> = ({s0, d}) => {      // Moat verdict: narrow.
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip={CHIP83} cam={[[0, 1.55, 1230, 300], [d, 1.2, 1060, 360, inOut]]}>
      <VerdictSheet f={f} stampAt={a("q83", "narrow")} hlAt={a("q83", "MoatOS")} scoreOn={false}/>
    </Desk>
  );
};
const q83b: React.FC<SP> = ({s0, d}) => {      // Jio scores 4.87 out of ten
  const f = useTicks(), a = useAt(s0);
  const x0 = 300, x1 = 1620, y = 820, px = x0 + 0.487 * (x1 - x0);
  const lp = ease(f, 2, 26, outCubic), pin = ease(f, a("q83", "four point eight"), a("q83", "four point eight") + 14, outQuint);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 940, 520]]} chip={CHIP83}>
      {label(f, 0, "MoatOS scorecard", 960, 190, {size: 52})}
      <Num f={f} at={a("q83", "four point eight")} to={4.87} dec={2} dur={36} x={900} y={500} size={400} color={C.ink}/>
      <div style={{position: "absolute", left: 1330, top: 560, fontFamily: F.serif, fontSize: 170, color: C.grey, opacity: ease(f, a("q83", "out of"), a("q83", "out of") + 10, outQuint)}}>/10</div>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <line x1={x0} x2={x0 + (x1 - x0) * lp} y1={y} y2={y} stroke={C.ink} strokeWidth={6} strokeLinecap="round"/>
        {Array.from({length: 11}).map((_, i) => {
          const x = x0 + (i * (x1 - x0)) / 10;
          return x - x0 <= (x1 - x0) * lp ? <g key={i}><line x1={x} x2={x} y1={y - 16} y2={y + 16} stroke={C.ink} strokeWidth={4}/>
            <text x={x} y={y + 62} textAnchor="middle" fontFamily={F.mono} fontSize={28} fill={C.inkSoft}>{i}</text></g> : null;
        })}
        {pin > 0 ? <g transform={`translate(${px} ${y - (1 - pin) * 160})`} opacity={pin}><circle r={26} fill={C.markerRed} stroke={C.paper} strokeWidth={6}/></g> : null}
      </svg>
    </Desk>
  );
};
const q83c: React.FC<SP> = ({s0, d}) => {      // three separate scoring passes landed between 4.74 and 5.08
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip={CHIP83} cam={[[0, 1.0, 760, 540], [d, 1.08, 1150, 560, inOut]]}>
      {label(f, a("q83", "Three"), "Three scoring passes", 960, 230, {size: 56})}
      <PassRuler f={f} at={2} bandAt={a("q83", "four point seven four")} bandDur={52}
        pins={[{v: 4.87, at: a("q83", "Three"), labelAt: a("q83", "Three") + 12, key: true}, {v: 4.74, at: a("q83", "separate"), labelAt: a("q83", "four point seven four")},
          {v: 5.08, at: a("q83", "scoring"), labelAt: a("q83", "five point zero")}]}/>
    </Desk>
  );
};
const sheetShot = (o: {cam: (d: number) => [number, number, number, number, ((t: number) => number)?][]; walls: (a: ReturnType<typeof useAt>) => number[]; limits: (a: ReturnType<typeof useAt>) => number[]}): React.FC<SP> =>
  ({s0, d}) => {
    const f = useTicks(), a = useAt(s0);
    return (
      <Desk f={f} d={d} tone="kraft" chip={CHIP83} cam={o.cam(d)}>
        <VerdictSheet f={f} enterAt={PAST} stampAt={PAST} scoreAt={PAST} hlAt={PAST} walls={o.walls(a)} limits={o.limits(a)}/>
      </Desk>
    );
  };
const q83d = sheetShot({      // Its walls
  cam: (d) => [[0, 1.3, COL_X[0] + 380, 680], [d, 1.12, COL_X[0] + 400, 700, inOut]],
  walls: (a) => [a("q83", "scale"), a("q83", "lowest cost"), a("q83", "lowest churn"), a("q83", "exclusive")], limits: () => []});
const q83e = sheetShot({      // Its limits (first)
  cam: (d) => [[0, 1.3, COL_X[1] + 380, 620], [d, 1.18, COL_X[1] + 400, 660, inOut]],
  walls: () => [PAST, PAST, PAST, PAST], limits: (a) => [a("q83", "similar spectrum")]});
const q83f = sheetShot({      // ...less EBITDA per customer, lower returns, one related distributor
  cam: (d) => [[0, 1.25, COL_X[1] + 380, 760], [d, 1.12, COL_X[1] + 330, 700, inOut]],
  walls: () => [PAST, PAST, PAST, PAST], limits: (a) => [PAST, a("q83", "less EBITDA"), a("q83", "lower returns"), a("q83", "one related")]});

// =====================================================================================================
// q84 · margin verdict
// =====================================================================================================
const q84a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" chip="Moat & Margin · our reading" cam={[[0, 1.12, 960, 540], [d, 1.0, 960, 540, outCubic]]}>
      <StickerLabel f={f} text="Margin verdict" x={960} y={230} size={52} dark={false} rot={-1.5} enter={{at: 0, mode: "slide", from: [0, -260], dur: 9}}/>
      <BigWord f={f} at={a("q84", "rising")} text="Rising slowly," x={960} y={470} size={200} mark={["slowly"]} markAt={a("q84", "slowly")}/>
      <BigWord f={f} at={a("q84", "not pulling")} text="not pulling ahead." x={960} y={705} size={150} mark={["ahead"]} markAt={a("q84", "ahead")}/>
    </Desk>
  );
};
const q84b: React.FC<SP> = ({s0, d}) => {      // EBITDA margin without other income stayed near fifty percent
  const f = useTicks(), a = useAt(s0);
  const x0 = 520, x1 = 1400, y = 830, p = ease(f, a("q84", "stayed"), a("q84", "stayed") + 30, outCubic);
  return (
    <Desk f={f} d={d} tone="ink" chip="Jio RHP p.131 · our arithmetic" cam={[[0, 1.0, 960, 560], [d, 1.07, 960, 540]]}>
      <Sub f={f} at={0} text="EBITDA margin" x={960} y={170} size={64} color={C.white}/>
      <Sub f={f} at={a("q84", "without")} text="without other income" x={960} y={250} size={38} color="#9C968C"/>
      <Sub f={f} at={a("q84", "stayed")} text="stayed near" x={960} y={400} size={50} color="#CFC9BE"/>
      <Num f={f} at={a("q84", "fifty")} to={50} dur={22} x={960} y={580} size={330} color={C.highlightPrint} suf="%"/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <line x1={x0} x2={x0 + (x1 - x0) * p} y1={y} y2={y} stroke={C.highlightPrint} strokeWidth={10} strokeLinecap="round"/>
        <circle cx={x0} cy={y} r={14} fill={C.highlightPrint}/>{p > 0.98 ? <circle cx={x1} cy={y} r={14} fill={C.highlightPrint}/> : null}
        <text x={x0} y={y + 64} textAnchor="middle" fontFamily={F.sans} fontWeight={600} fontSize={32} fill="#CFC9BE" opacity={p}>FY24</text>
        <text x={x1} y={y + 64} textAnchor="middle" fontFamily={F.sans} fontWeight={600} fontSize={32} fill="#CFC9BE" opacity={p}>FY26</text>
      </svg>
    </Desk>
  );
};
const q84c: React.FC<SP> = ({s0, d}) => {      // EBIT margin without other income rose from 29.4 to 31.4
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" chip="Jio RHP p.131, p.137 · our arithmetic" cam={[[0, 1.0, 960, 540], [d, 1.08, 1060, 540]]}>
      <TwoLines f={f} at={0} title="EBIT margin" sub="without other income · our arithmetic" nameAt={{Jio: a("q84", "twenty nine")}}
        lines={[{name: "Jio", v0: 29.4, v1: 31.4, at: a("q84", "from twenty nine"), dur: 56, l0: a("q84", "twenty nine"), l1: a("q84", "thirty one"), color: C.highlightPrint, above: true}]}/>
    </Desk>
  );
};
const q84d: React.FC<SP> = ({s0, d}) => {      // Airtel India's rose faster, from 23.7 to 30.4
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" chip="Jio RHP p.131, p.137 · our arithmetic" cam={[[0, 1.1, 1180, 560], [d, 1.0, 1000, 540, outCubic]]}>
      <TwoLines f={f} at={PAST} title="EBIT margin" sub="without other income · our arithmetic" nameAt={{Jio: PAST, "Airtel India": a("q84", "Airtel")}}
        lines={[{name: "Jio", v0: 29.4, v1: 31.4, at: PAST, dur: 56, l0: PAST, l1: PAST, color: C.highlightPrint, above: true},
          {name: "Airtel India", v0: 23.7, v1: 30.4, at: a("q84", "from twenty three"), dur: 62, l0: a("q84", "twenty three"), l1: a("q84", "thirty point four"), color: C.white}]}/>
      {label(f, a("q84", "faster"), "Rose faster", 1560, 215, {size: 50, dark: false, rot: 2})}
    </Desk>
  );
};

// =====================================================================================================
// q85 · cash left after capex, spectrum dues, leases and interest
// =====================================================================================================
const CF = {src: "jio/docs/ch8_cashflow.png", imgW: 998, imgH: 489, x: 960, y: 535, width: 1300, rot: 0.6};
const cfRow = (y: number, h: number): Rect => [26, y, 946, h];
const q85a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.334 · cash flow · rows chosen" cam={[[0, 1.0, 960, 540], [d, 1.16, 1000, 600, inOut]]}>
      <DocPage f={f} {...CF} stack={2} enter={{at: 0, mode: "slide-up", dur: 10}}
        highlights={[{rects: [cfRow(121, 39)], at: a("q85", "cash left"), dur: 10}, {rects: [cfRow(182, 63), cfRow(267, 39)], at: a("q85", "capex"), dur: 8},
          {rects: [cfRow(328, 39)], at: a("q85", "spectrum"), dur: 10}, {rects: [cfRow(389, 39)], at: a("q85", "leases"), dur: 10}, {rects: [cfRow(450, 39)], at: a("q85", "interest"), dur: 10}]}/>
    </Desk>
  );
};
const q85b: React.FC<SP> = ({s0, d}) => {      // minus 17,593 crore (FY24)
  const f = useTicks(), a = useAt(s0);
  const t = a("q85", "minus");
  return (
    <Desk f={f} d={d} tone="ink" chip="Jio RHP p.334 · our arithmetic" cam={[[0, 1.1, 800, 600], [d, 1.0, 960, 560, outCubic]]}>
      <ZeroBars f={f} at={0} title="Cash left after obligations" source="Jio RHP p.334 · our arithmetic"
        bars={[{label: "FY24", value: -17593, at: t, dur: 74, labelAt: t - 6, x: 700}, {label: "FY26", value: 20331, at: 1e9, dur: 74, labelAt: 1e9, key: true, x: 1220}]}/>
    </Desk>
  );
};
const q85c: React.FC<SP> = ({s0, d}) => {      // to plus 20,331 crore (FY26)
  const f = useTicks(), a = useAt(s0);
  const t = a("q85", "plus");
  return (
    <Desk f={f} d={d} tone="ink" chip="Jio RHP p.334 · our arithmetic" cam={[[0, 1.0, 960, 560], [d, 1.12, 1180, 520, inOut]]}>
      <ZeroBars f={f} at={PAST} title="Cash left after obligations" source="Jio RHP p.334 · our arithmetic" circleAt={a("q85", "thirty one") + 12}
        bars={[{label: "FY24", value: -17593, at: PAST, dur: 74, labelAt: PAST, x: 700}, {label: "FY26", value: 20331, at: t, dur: 74, labelAt: t - 6, key: true, x: 1220}]}/>
    </Desk>
  );
};

// =====================================================================================================
// q86 · what we know / q87 · what we don't know
// =====================================================================================================
const known = (a: ReturnType<typeof useAt>) => [
  {text: "Scale", at: a("q86", "scale")}, {text: "Churn lead", at: a("q86", "churn")}, {text: "Cost per GB lead", at: a("q86", "cost per")},
  {text: "Leverage with dues:", at: a("q86", "leverage"), emph: {text: "1.73×", at: a("q86", "leverage") + 34, hlAt: a("q86", "counted")}}];
const q86a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Our reading · Jio RHP, TRAI" cam={[[0, 1.0, 900, 520], [d, 1.1, 960, 560]]}>
      <IndexCard f={f} x={960} y={535} title="What we know:" titleAt={6} items={known(a)}/>
    </Desk>
  );
};
const q86b: React.FC<SP> = ({s0, d}) => {      // leverage once spectrum dues are counted (close-up)
  const f = useTicks(), a = useAt(s0);
  const its = known(a).map((it, i) => (i < 3 ? {...it, at: PAST} : it));
  return (
    <Desk f={f} d={d} tone="kraft" chip="1.73× · Jio RHP p.137 · our arithmetic" cam={[[0, 1.5, 1010, 800], [d, 1.65, 1060, 790, inOut]]}>
      <IndexCard f={f} x={960} y={535} title="What we know:" titleAt={PAST} enterAt={PAST} items={its} circleAt={a("q86", "counted") + 12}/>
    </Desk>
  );
};
const q87a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} chip="Our reading · not in the filings" cam={[[0, 1.0, 960, 540], [d, 1.1, 640, 560]]}>
      {label(f, 0, "What we don't know", 960, 200, {size: 62})}
      <Sticky f={f} at={a("q87", "Reliance Retail")} x={480} y={600} text="Reliance Retail terms" rot={-4}/>
    </Desk>
  );
};
const q87b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} chip="Our reading · not in the filings" cam={[[0, 1.18, 700, 560], [d, 1.0, 960, 560, inOut]]}>
      {label(f, PAST, "What we don't know", 960, 200, {size: 62})}
      <Sticky f={f} at={PAST} x={480} y={600} text="Reliance Retail terms" rot={-4}/>
      <Sticky f={f} at={a("q87", "home broadband")} x={960} y={620} text="Home broadband share" rot={2.5}/>
      <Sticky f={f} at={a("q87", "next tariff")} x={1440} y={590} text="Next tariff change" rot={-2.5}/>
    </Desk>
  );
};

// =====================================================================================================
// q88 · what to watch
// =====================================================================================================
const watch = (a: ReturnType<typeof useAt>, past: number): {text: string; sub?: string; node?: React.ReactNode; at: number; tickAt: number}[] => [
  {text: "Tariff change, then churn", at: past < 1 ? PAST : a("q88", "next tariff"), tickAt: past < 1 ? PAST : a("q88", "churn") + 6},
  {text: "ARPU vs Airtel", sub: "every quarter", at: past < 1 ? PAST : a("q88", "ARPU"), tickAt: past < 1 ? PAST : a("q88", "every quarter") + 8},
  {text: "", node: <>Use of <Rs size={60}/>27,500 crore</>, sub: "monitoring agency: Crisil Ratings", at: past < 2 ? PAST : a("q88", "monitoring"), tickAt: past < 2 ? PAST : a("q88", "monitoring") + 24},
  {text: "2030 spectrum expiry", at: a("q88", "twenty thirty"), tickAt: a("q88", "twenty thirty") + 22}];
const q88a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const w = watch(a, 0).map((it, i) => (i < 2 ? it : {...it, at: 1e9, tickAt: 1e9}));
  return (
    <Desk f={f} d={d} chip="Our reading · what to watch" cam={[[0, 1.0, 960, 540], [d, 1.1, 900, 520]]}>
      <WatchCard f={f} x={960} y={540} items={w}/>
    </Desk>
  );
};
const MON = {src: "jio/docs/ch8_monitor.png", imgW: 1448, imgH: 326, x: 960, y: 520, width: 1580, rot: -0.7};
const M_CRISIL: Rect = [1055.3, 126.1, 266.8, 33.1], M_AGENCY: Rect = [472, 160.7, 226.3, 33.1], M_QUARTER: Rect = [1061.2, 229.8, 230.7, 33.1];
const q88b: React.FC<SP> = ({s0, d}) => {      // the monitoring agency's reports (RHP p.124)
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.124 · p.116" cam={[[0, 1.1, 900, 520], [d, 1.3, 1160, 540, inOut]]}>
      <DocPage f={f} {...MON} stack={2} enter={{at: 0, mode: "slide-right", dur: 10}}
        highlights={[{rects: [M_CRISIL], at: a("q88", "monitoring"), dur: 14}, {rects: [M_AGENCY], at: a("q88", "agency's"), dur: 14}, {rects: [M_QUARTER], at: a("q88", "reports"), dur: 14}]}/>
      {label(f, a("q88", "twenty seven"), "₹27,500 crore", 960, 860, {size: 66, dark: false, rot: -2})}
    </Desk>
  );
};
const q88c: React.FC<SP> = ({s0, d}) => {      // ...and the 2030 spectrum expiry
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} chip="Our reading · what to watch" cam={[[0, 1.2, 1000, 760], [d, 1.35, 960, 780, inOut]]}>
      <WatchCard f={f} x={960} y={540} enterAt={PAST} hlAt={PAST} items={watch(a, 3)}/>
    </Desk>
  );
};

// =====================================================================================================
// q90 · sources
// =====================================================================================================
const srcLines = (a: ReturnType<typeof useAt>, late: boolean) => [
  {text: "Jio Platforms RHP, 14 Oct 2026", at: late ? PAST : a("q90", "Jio's prospectus")},
  {text: "TRAI performance indicators: Apr–Jun 2026 and 2025-26", at: late ? PAST : a("q90", "TRAI")},
  {text: "Bharti Airtel AR 2025-26 + quarterly releases", at: late ? PAST : a("q90", "Airtel's")},
  {text: "Vodafone Idea AR 2025-26", at: late ? PAST : a("q90", "Vodafone")},
  {text: "Analysys Mason report (paid by Jio) · press items as labelled", at: late ? PAST : a("q90", "own reports")},
  {text: "Per-customer, per-GB, leverage, returns: our arithmetic", at: late ? PAST : a("q90", "our arithmetic") - 10, hl: a("q90", "our arithmetic")}];
const q90a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} chip="Sources · links in the description" cam={[[0, 1.0, 960, 500], [d, 1.08, 960, 560]]}>
      <SourcesPage f={f} y={500} lines={srcLines(a, false)} noteAt={1e9}/>
    </Desk>
  );
};
const q90b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Sources · links in the description" cam={[[0, 1.45, 960, 760], [d, 1.35, 1000, 720, inOut]]}>
      <SourcesPage f={f} y={500} lines={srcLines(a, true)} noteAt={a("q90", "Links")}/>
    </Desk>
  );
};

// =====================================================================================================
// q91 · next video teaser
// =====================================================================================================
const q91a: React.FC<SP> = ({s0, d}) => {      // how does Airtel keep about ₹35 more from every customer
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" chip="Jio RHP p.117, p.131 · Airtel AR · our arithmetic" cam={[[0, 1.1, 960, 560], [d, 1.0, 960, 540, outCubic]]}>
      <StickerLabel f={f} text="EBITDA per customer" x={960} y={215} size={52} dark={false} rot={-1.5} enter={{at: a("q91", "Airtel"), mode: "slide", from: [0, -260], dur: 9}}/>
      <Sub f={f} at={a("q91", "about")} text="about" x={960} y={390} size={46} color="#CFC9BE"/>
      <Num f={f} at={a("q91", "thirty five") - 6} to={35} dur={26} x={960} y={580} size={400} color={C.highlightPrint} pre="₹" preSans/>
      <PhotoPrint f={f} src="jio/media/rupee_notes_spread_print.jpg" x={330} y={600} w={400} h={570} rot={-5} halftone={0.15} enter={{at: a("q91", "keep"), mode: "slide", from: [-700, 0], dur: 10}}/>
      <Sticker f={f} src="jio/media/rupee_coin_ten_sticker.png" x={1610} y={640} w={320} h={320} rot={8} enter={{at: a("q91", "thirty five") + 10, mode: "pop", rot0: -14}}/>
      <Sub f={f} at={a("q91", "more")} text="more per month" x={960} y={810} size={50} color="#CFC9BE"/>
    </Desk>
  );
};
const q91b: React.FC<SP> = ({s0, d}) => {      // with similar spectrum outside 26 GHz?
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" chip="Our reading · spectrum" cam={[[0, 1.14, 960, 540], [d, 1.0, 960, 540, outCubic]]}>
      <BigWord f={f} at={a("q91", "similar")} text="Similar spectrum," x={960} y={440} size={170} stagger={6}/>
      <BigWord f={f} at={a("q91", "outside")} text="outside 26 GHz?" x={960} y={680} size={140} mark={["26"]} markAt={a("q91", "twenty six")} stagger={6}/>
    </Desk>
  );
};
const q91c: React.FC<SP> = ({s0, d}) => {      // That's our next video.
  const f = useTicks();
  return (
    <Desk f={f} d={d} tone="kraft" cam={[[0, 1.15, 960, 540], [d, 1.0, 960, 540, outCubic]]}>
      <div style={{position: "absolute", left: 360, top: 330, width: 1200, height: 380, background: C.ink, transform: "rotate(-2deg)", boxShadow: "0 10px 30px rgba(30,20,10,0.35)"}}/>
      {label(f, 2, "Next video", 960, 520, {size: 190, dark: false, rot: -2})}
      <div style={{position: "absolute", left: 960 - 190, top: 300, width: 380, height: 56, background: "rgba(230,220,190,0.88)", transform: "rotate(2deg)", boxShadow: "0 2px 4px rgba(0,0,0,0.15)"}}/>
    </Desk>
  );
};
const q91d: React.FC<SP> = ({s0, d}) => {      // Airtel versus Jio, who really has the moat?
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" cam={[[0, 1.0, 960, 540], [d, 1.08, 960, 560]]}>
      <StickerLabel f={f} text="Next video" x={330} y={150} size={46} dark={false} rot={-3} enter={{at: PAST, mode: "none"}}/>
      <BigWord f={f} at={a("q91", "Airtel versus")} text="Airtel vs Jio" x={960} y={400} size={250} stagger={8}/>
      <BigWord f={f} at={a("q91", "who really")} text="Who really has the moat?" x={960} y={690} size={124} stagger={5} mark={["moat"]} markAt={a("q91", "moat")}/>
    </Desk>
  );
};

// =====================================================================================================
// q92 · end card: brand and site only
// =====================================================================================================
const q92: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <AbsoluteFill><Paper drift={f / d}/><EndCard f={f} d={d}/><Finish f={f}/></AbsoluteFill>;
};

// =====================================================================================================
// shot list
// =====================================================================================================
export const SHOTS8: Shot[] = [
  S("q80", 0, H0, q80),
  S("q81", 0, H0, q81a), S("q81", "at zero|-0.15", PU, q81b), S("q81", "Its own|-0.1", WL, q81c), S("q81", "One lakh|-0.05", WD, q81d), S("q81", "for spectrum|-0.2", PU, q81e),
  S("q82", 0, WR, q82a), S("q82", "Airtel's|-0.15", PU, q82b),
  S("q83", 0, PU, q83a), S("q83", "Jio|-0.1", H0, q83b), S("q83", "Three|-0.05", PU, q83c), S("q83", "Its walls|-0.1", WL, q83d), S("q83", "Its limits|-0.1", PUSH(1300, 560), q83e),
  S("q83", "less EBITDA|-0.2", H0, q83f),
  S("q84", 0, WD, q84a), S("q84", "EBITDA|-0.1", PU, q84b), S("q84", "EBIT|-0.2", WL, q84c), S("q84", "Airtel India's|-0.1", H0, q84d),
  S("q85", 0, PU, q85a), S("q85", "minus|-0.25", WD, q85b), S("q85", "to plus|-0.1", H0, q85c),
  S("q86", 0, PU, q86a), S("q86", "and its leverage|-0.3", H0, q86b),
  S("q87", 0, WL, q87a), S("q87", "how much|-0.3", H0, q87b),
  S("q88", 0, PU, q88a), S("q88", "the monitoring|-0.1", WL, q88b), S("q88", "twenty thirty|-0.45", PU, q88c),
  S("q90", 0, WD, q90a), S("q90", "or our|-0.2", H0, q90b),
  S("q91", 0, WL, q91a), S("q91", "with similar|-0.15", WD, q91b), S("q91", "That's|-0.1", PU, q91c), S("q91", "Airtel versus|-0.1", H0, q91d),
  S("q92", 0, PU, q92),
];

export const CUES8: SCue[] = [
  [WK("q80", -0.7), "whooshDeep", 0.5],
  [WK("q81", 0.2), "paper", 0.5], [WK("q81", "zero"), "highlighter", 0.5], [WK("q81", "leaves"), "highlighter", 0.55], [WK("q81", "One lakh"), "ding", 0.4],
  [WK("q82", "one point seven"), "stamp", 0.6],
  [WK("q83", "narrow"), "stamp", 0.8], [WK("q83", "scale"), "highlighter", 0.5],
  [WK("q84", "from twenty nine"), "highlighter", 0.4],
  [WK("q85", "capex"), "highlighter", 0.5], [WK("q85", "plus"), "ding", 0.5],
  [WK("q87", "Reliance"), "pop", 0.4],
  [WK("q88", "monitoring"), "highlighter", 0.5],
  [WK("q90", "Every"), "paper", 0.4],
  [WK("q91", "That's"), "stamp", 0.5],
  [WK("q92", 0.1), "paper", 0.4],
];
