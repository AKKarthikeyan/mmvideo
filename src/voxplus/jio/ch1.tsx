// Jio film, chapter 1 "The IPO" (beats q10-q14): the reporter's desk. Real RHP pages (p.109, p.116, p.132) with the highlighter,
// charts on black, big serif numbers, a sticky note for the open loop (0.36x, paid off in chapter 8).
// Numbers only from the ledger: 66.43 / 9.98 / 7.73 (p.109), 27 crore and about 3% (our arithmetic), 27,500 crore and 25% (p.116), 0.36x (p.132).
import React from "react";
import {AbsoluteFill} from "remotion";
import {BigWord, BigNumber, SubLine} from "../BigType";
import {StickerLabel} from "../Collage";
import {DocPage, docRectCentre} from "../DocPage";
import {SCue} from "../A01V4Cold";
import {Desk, Num, SP, Shot, Stamp, Sub} from "../A01V4Parts";
import {C, F, ease, inOut, outQuint, spr, useTicks} from "../tokens";
import {H0, PU, S, WL, WR, WU, WD, MZ, W, useAt} from "./kit";
import {ApproxNum, Card12, DeskP, ShareBars, StickyBig} from "./parts12";

const pop = (f: number, at: number, text: string, x: number, y: number, o: {dark?: boolean; size?: number; rot?: number; bg?: string; color?: string} = {}) =>
  <StickerLabel f={f} text={text} x={x} y={y} size={o.size ?? 50} dark={o.dark} rot={o.rot ?? -3} bg={o.bg} color={o.color} enter={{at, mode: "pop", rot0: -10}}/>;

// ---------------------------------------------------------------- q10 chapter card
const q10: React.FC<SP> = ({s0}) => {
  const f = useTicks(), a = useAt(s0);
  return <Card12 f={f} n={1} word="The IPO" labelAt={a("q10", 0)} wordAt={a("q10", "The")}/>;
};

// ---------------------------------------------------------------- q11 shareholding before the issue
const P109 = {src: "jio/docs/ch1_rhp109_holding.png", imgW: 1461, imgH: 831, x: 960, y: 520, width: 1250, rot: -0.8};
const q11a: React.FC<SP> = ({s0, d}) => {      // "Reliance Industries owns 66.43% of Jio Platforms before the issue."
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(P109, [240, 396, 540, 90]);
  const t0 = a("q11", "Reliance");
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.109 · before the issue" cam={[[0, 1.0, 960, 540], [d, 1.32, c.x, c.y, inOut]]}
      over={pop(f, a("q11", "before"), "Before the issue", 1560, 190, {dark: true, rot: 2})}>
      <DocPage f={f} {...P109} stack={2} enter={{at: 0, mode: "slide-up"}} focus={{rect: [0, 385, 1461, 110], at: t0 + 6, blur: 2.2}}
        highlights={[{rects: [[240.8, 396.5, 94.4, 29.9], [240.8, 427.4, 106.6, 29.9], [240.8, 458.4, 85.4, 29.9]], at: t0, dur: 7}, {rects: [[474.2, 427.4, 155.2, 29.9]], at: a("q11", "sixty"), dur: 14}]}
        circles={[{rect: [715.4, 427.4, 61, 29.9], at: a("q11", "four|-0.1"), dur: 14}]}/>
    </Desk>
  );
};
const q11b: React.FC<SP> = ({s0, d}) => {      // chart on black: Reliance key bar, Meta 9.98, Google 7.73
  const f = useTicks(), a = useAt(s0);
  return (
    <DeskP f={f} d={d} tone="ink" chip="Jio RHP p.109 · pre-issue shareholding" cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]}>
      <ShareBars f={f} title="Who owns Jio" source="Pre-issue shareholding · share of paid-up capital" max={100}
        bars={[{label: "Reliance Industries", v: 66.43, txt: "66.43%", at: 4, key: true}, {label: "Meta affiliate", v: 9.98, txt: "9.98%", at: a("q11", "A Meta|+0.1")},
          {label: "Google", v: 7.73, txt: "7.73%", at: a("q11", "and Google|+0.0")}]}/>
    </DeskP>
  );
};

// ---------------------------------------------------------------- q12 27 crore new shares are about 3%
const q12a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const x0 = 210, bw = 1500, y = 770, h = 64, newW = bw * (27 / (894 + 27));
  const g = ease(f, a("q12", "twenty|+0.4"), a("q12", "twenty|+0.4") + 26, (t) => 1 - Math.pow(1 - t, 4));
  const sl = spr(f, a("q12", "new shares|-0.1"), 11, 200);
  return (
    <DeskP f={f} d={d} tone="ink" chip="Our arithmetic · RHP cover & p.109" cam={[[0, 1.05, 960, 540], [d, 1.0, 960, 560]]}>
      <BigWord f={f} at={a("q12", "twenty")} text="27 crore new shares" x={960} y={210} size={104} stagger={4}/>
      <ApproxNum f={f} at={a("q12", "about|+0.1")} to={3} x={960} y={470} size={300}/>
      <SubLine f={f} at={a("q12", "of the company")} text="of the company, after the issue" x={960} y={650} size={40} color="#B9B2A6"/>
      <div style={{position: "absolute", left: x0, top: y, width: (bw - newW) * g, height: h, background: C.chartBlue}}/>
      <div style={{position: "absolute", left: x0 + 22, top: y + 14, fontFamily: F.sans, fontWeight: 700, fontSize: 30, color: C.white, opacity: g > 0.9 ? 1 : 0, letterSpacing: 1}}>≈894 CR EXISTING SHARES</div>
      <div style={{position: "absolute", left: x0 + bw - newW, top: y, width: newW, height: h, background: C.highlightPrint, transform: `scaleY(${sl})`, transformOrigin: "50% 100%"}}/>
      {pop(f, a("q12", "new shares|-0.1"), "27 cr new", x0 + bw - 110, y - 62, {size: 34, rot: -3, dark: false})}
      <SubLine f={f} at={a("q12", "by our")} text="27 ÷ (894 + 27) crore shares" x={960} y={885} size={30} color="#9C968C"/>
    </DeskP>
  );
};
const q12b: React.FC<SP> = ({s0, d}) => {      // "Reliance stays firmly in control."
  const f = useTicks(), a = useAt(s0);
  return (
    <DeskP f={f} d={d} tone="cream" chip="Jio RHP p.109 · pre-issue stake" cam={[[0, 1.0, 900, 540], [d, 1.04, 960, 540, inOut]]}>
      <BigWord f={f} at={a("q12", "Reliance")} text="Reliance stays in control" x={960} y={480} size={150} color={C.ink} stagger={7} mark={["control"]} markAt={a("q12", "control")} maxWidth={1500}/>
      <SubLine f={f} at={a("q12", "control|+0.3")} text="66.43% before the issue" x={960} y={760} size={44} color={C.inkSoft}/>
    </DeskP>
  );
};

// ---------------------------------------------------------------- q13 the money
const q13a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <DeskP f={f} d={d} tone="ink" chip="Jio RHP p.116 · objects of the issue" cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520]]}>
      <Sub f={f} at={a("q13", "money")} text="The money" x={960} y={250} size={46} color="#B9B2A6"/>
      <Num f={f} at={a("q13", "twenty")} to={27500} x={960} y={470} size={250} pre="₹" preSans suf=" crore" dur={60}/>
      <Sub f={f} at={a("q13", "crore|+0.2")} text="275,000 ₹ million in the table" x={960} y={680} size={34}/>
    </DeskP>
  );
};
const P116 = {src: "jio/docs/ch1_rhp116_objects.png", imgW: 1461, imgH: 549, x: 960, y: 520, width: 1560, rot: 0.6};
const q13b: React.FC<SP> = ({s0, d}) => {      // prepays loans of RJIL, the telecom subsidiary
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(P116, [166, 333, 670, 70]);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.116 · objects of the issue" cam={[[0, 1.0, 1000, 560], [d, 1.3, c.x + 150, c.y, inOut]]}
      over={pop(f, a("q13", "telecom"), "RJIL: telecom subsidiary", 1380, 200, {dark: true, rot: 2, size: 46})}>
      <DocPage f={f} {...P116} stack={2} enter={{at: 0, mode: "slide-right"}} focus={{rect: [0, 328, 1461, 76], at: a("q13", "prepays|-0.2"), blur: 2.8}}
        highlights={[{rects: [[166, 333, 670, 34], [166, 364, 572, 34]], at: a("q13", "prepays"), dur: 12}]}
        circles={[{rect: [1019.7, 351.3, 88, 29.9], at: a("q13", "Reliance"), dur: 12}]}/>
    </Desk>
  );
};
const q13c: React.FC<SP> = ({s0, d}) => {      // general corporate purposes <= 25%
  const f = useTicks(), a = useAt(s0);
  const k = 1900 / 1461, p = {...P116, width: 1900, rot: -0.5, x: 960 - (600 - 730.5) * k, y: 520 - (440 - 274.5) * k};
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.116 · footnote" cam={[[0, 1.0, 960, 540], [d, 1.1, 900, 560, inOut]]}
      over={pop(f, a("q13", "quarter"), "≤ 25% of proceeds", 1400, 820, {dark: true, rot: -2, size: 60})}>
      <DocPage f={f} {...p} stack={1} focus={{rect: [0, 392, 1461, 140], at: a("q13", "General"), blur: 2.6}}
        highlights={[{rects: [[166.3, 399.5, 296.9, 29.9]], at: a("q13", "General"), dur: 12}, {rects: [[1127, 464.4, 269, 27], [42, 492, 425, 27]], at: a("q13", "can't"), dur: 14}]}
        circles={[{rect: [42.1, 492.2, 204.6, 26.7], at: a("q13", "quarter"), dur: 14}]}/>
    </Desk>
  );
};

// ---------------------------------------------------------------- q14 net debt 0.36x: hold on to that number
const PKPI = {src: "jio/docs/ch1_rhp132_kpi.png", imgW: 1605, imgH: 207, x: 960, y: 520, width: 1640, rot: -0.5};
const q14a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(PKPI, [1000, 160, 300, 34]);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.132 · KPIs · FY26" cam={[[0, 1.0, 960, 540], [d, 1.4, c.x, c.y, inOut]]}>
      <DocPage f={f} {...PKPI} stack={2} enter={{at: 0, mode: "slide-left"}} focus={{rect: [0, 156, 1605, 46], at: a("q14", "net"), blur: 3}}
        highlights={[{rects: [[150.7, 162.5, 146.2, 29.9]], at: a("q14", "net"), dur: 8}]} circles={[{rect: [1099.4, 162.5, 60.9, 29.9], at: a("q14", "zero|+0.2"), dur: 14}]}/>
    </Desk>
  );
};
const q14b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <DeskP f={f} d={d} tone="ink" chip="Jio RHP p.132 · FY26" cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <BigNumber f={f} at={a("q14", "zero")} to={0.36} decimals={2} suffix="x" x={960} y={470} size={380} dur={30}/>
      <SubLine f={f} at={a("q14", "EBITDA|-0.1")} text="net debt ÷ EBITDA · FY26" x={960} y={730} size={44} color="#B9B2A6"/>
    </DeskP>
  );
};
const q14c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <DeskP f={f} d={d} tone="cream" cam={[[0, 1.0, 1000, 540], [d, 1.06, 960, 540, inOut]]}>
      <BigWord f={f} at={a("q14", "So")} text="Why repay debt?" x={960} y={500} size={170} color={C.ink} stagger={6} mark={["repay"]} markAt={a("q14", "repay")}/>
    </DeskP>
  );
};
const q14d: React.FC<SP> = ({s0, d}) => {      // Hold on to that number: the sticky note pins 0.36x for chapter 8
  const f = useTicks(), a = useAt(s0);
  const p = {...PKPI, y: 600, width: 1500, rot: 1.0};
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.132 · FY26" cam={[[0, 1.04, 940, 560], [d, 1.0, 960, 540, inOut]]}>
      <DocPage f={f} {...p} stack={2} focus={{rect: [0, 156, 1605, 46], at: 0, blur: 3.4}} highlights={[{rects: [[150.7, 162.5, 146.2, 29.9], [1099.4, 162.5, 60.9, 29.9]], at: 0, dur: 4}]}/>
      <StickyBig f={f} at={a("q14", "Hold")} moveAt={a("q14", "We come")} big="0.36x" small="NET DEBT ÷ EBITDA" x={960} y={400}/>
    </Desk>
  );
};

export const SHOTS1: Shot[] = [
  S("q10", 0, PU, q10),
  S("q11", 0, PU, q11a), S("q11", "A Meta|-0.15", WL, q11b),
  S("q12", 0, WU, q12a), S("q12", "Reliance|-0.1", MZ, q12b),
  S("q13", 0, PU, q13a), S("q13", "prepays|-0.15", WR, q13b), S("q13", "General|-0.1", H0, q13c),
  S("q14", 0, WD, q14a), S("q14", "zero|-0.2", H0, q14b), S("q14", "So|-0.1", WL, q14c), S("q14", "Hold|-0.2", PU, q14d),
];
export const CUES1: SCue[] = [
  [W("q10", 0.9), "whoosh", 0.7],
  [W("q11", "Reliance"), "highlighter", 1], [W("q11", "A Meta|+0.1"), "pop", 1],
  [W("q12", "about|+0.1"), "stamp", 0.7],
  [W("q13", "twenty"), "ding", 1], [W("q13", "prepays"), "highlighter", 1],
  [W("q14", "net"), "highlighter", 1], [W("q14", "zero"), "stamp", 0.8], [W("q14", "Hold"), "pop", 1],
];
