// Jio film, chapter 2 "How Jio got here" (beats q20-q25). Real documents first: RHP p.249/250 milestones, p.43 tariff paragraph,
// the Jio-paid Analysys Mason report (PDF p.9), a press clipping marked REPORTED, photos of towers, a timeline that carries
// the story from 2019 to the June 2026 filing. Numbers only from the ledger (42.67%, 15 Nov 2019, 88,078, 19 Jun 2026).
import React from "react";
import {BigWord, SubLine} from "../BigType";
import {HeadlineStack} from "../Cards";
import {PhotoPrint, StickerLabel} from "../Collage";
import {DocPage, docRectCentre} from "../DocPage";
import {SCue} from "../A01V4Cold";
import {Desk, Num, SP, Shot, Stamp, Sub} from "../A01V4Parts";
import {C, F, ease, inOut, useTicks} from "../tokens";
import {H0, PU, PL, S, WL, WR, WU, WD, MZ, W, useAt} from "./kit";
import {Card12, DeskP, TimelineS} from "./parts12";

// photos (jio/media/MEDIA.md): toned copies by the photo builder when present; originals under src_dl otherwise
const PH = {
  fields: {src: "jio/media/tower_in_todabhim_fields_print.jpg", cap: "Photo: Rahulsince93, CC BY 4.0"},
  sunset: {src: "jio/media/tower_in_sunset_print.jpg", cap: "Photo: Ayush Soran, CC BY 4.0"},
  roof: {src: "jio/media/tower_in_rooftop_cluster_print.jpg", cap: "Photo: Suresh Babunair, CC BY 3.0"},
};
const pop = (f: number, at: number, text: string, x: number, y: number, o: {dark?: boolean; size?: number; rot?: number; bg?: string; color?: string} = {}) =>
  <StickerLabel f={f} text={text} x={x} y={y} size={o.size ?? 50} dark={o.dark} rot={o.rot ?? -3} bg={o.bg} color={o.color} enter={{at, mode: "pop", rot0: -10}}/>;
const TL = ["2019", "2020", "2022", "2024", "2026"];

// ---------------------------------------------------------------- q20 chapter card
const q20: React.FC<SP> = ({s0}) => {
  const f = useTicks(), a = useAt(s0);
  return <Card12 f={f} n={2} word="How Jio got here" labelAt={a("q20", 0)} wordAt={a("q20", "How|-0.05")}/>;
};

// ---------------------------------------------------------------- q21 4G with VoLTE in 2016; 42.67% in a year (Jio-paid report)
const P2016 = {src: "jio/docs/ch2_rhp249_2016.png", imgW: 1449, imgH: 115, x: 1290, y: 540, width: 1260, rot: 1.2};
const q21a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(P2016, [270, 80, 850, 50]);
  return (
    <Desk f={f} d={d} tone="cream" chip="Jio RHP p.249 · milestones" cam={[[0, 1.0, 900, 540], [d, 1.14, c.x - 200, 540, inOut]]}
      over={pop(f, a("q21", "4G"), "4G + VoLTE", 420, 130, {dark: true, rot: -3, size: 66})}>
      <PhotoPrint f={f} src={PH.fields.src} x={400} y={540} w={560} h={820} rot={-2.5} halftone={0.1} caption={PH.fields.cap} enter={{at: 0, mode: "slide", from: [-1200, 0], dur: 12}}
        crop={{s0: 1.0, s1: 1.1, dur: 130}}/>
      <DocPage f={f} {...P2016} stack={2} enter={{at: 6, mode: "slide-left"}} focus={{rect: [0, 74, 1449, 40], at: a("q21", "voice"), blur: 3}}
        highlights={[{rects: [[848.5, 90.6, 270.8, 29.9]], at: a("q21", "voice"), dur: 12}]} circles={[{rect: [90.6, 89.5, 54.1, 29.9], at: a("q21", "twenty"), dur: 14}]}/>
    </Desk>
  );
};
const PAM = {src: "jio/docs/ch2_am9_share.png", imgW: 1470, imgH: 228, x: 960, y: 500, width: 1400, rot: -0.7};
const q21b: React.FC<SP> = ({s0, d}) => {      // "The industry report Jio paid for"
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(PAM, [51, 148, 1290, 70]);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Analysys Mason · paid for by Jio · PDF p.9" cam={[[0, 1.0, 960, 500], [d, 1.18, c.x, c.y, inOut]]}
      over={pop(f, a("q21", "paid"), "Paid for by Jio", 1500, 190, {dark: false, bg: C.highlight, color: C.ink, rot: 3, size: 58})}>
      <DocPage f={f} {...PAM} stack={2} enter={{at: 0, mode: "slide-up"}} focus={{rect: [0, 146, 1470, 74], at: a("q21", "says"), blur: 3}}
        highlights={[{rects: [[1171.3, 148.7, 230, 33.1], [51.1, 183.2, 1293, 33.1]], at: a("q21", "says"), dur: 14}]}/>
    </Desk>
  );
};
const q21c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <DeskP f={f} d={d} tone="ink" chip="Analysys Mason · paid for by Jio · PDF p.9" cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]}>
      <Num f={f} at={a("q21", "forty")} to={42.67} dec={2} suf="%" x={960} y={430} size={330} dur={44}/>
      <SubLine f={f} at={a("q21", "of India's|-0.1")} text="of India's broadband customers" x={960} y={650} size={46} color="#CFC9BE"/>
      <SubLine f={f} at={a("q21", "within")} text="within a year" x={960} y={730} size={46} color={C.highlightPrint}/>
    </DeskP>
  );
};

// ---------------------------------------------------------------- q22 incorporated 2019; 2020 stakes
const PINC = {src: "jio/docs/ch2_rhp249_incorp.png", imgW: 1449, imgH: 186, x: 960, y: 400, width: 1500, rot: -0.6};
const q22a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.249 · history" cam={[[0, 1.0, 960, 540], [d, 1.12, 930, 480, inOut]]}
      over={<>{pop(f, a("q22", "November"), "15 Nov 2019", 1560, 190, {dark: true, rot: -2, size: 56})}
        <TimelineS f={f} at={0} labels={TL} stops={[{i: 0, at: 0}]} y={850} x0={420} x1={1500}/></>}>
      <DocPage f={f} {...PINC} stack={2} enter={{at: 0, mode: "slide-up"}} highlights={[{rects: [[44, 82.4, 770, 33.1]], at: a("q22", "incorporated"), dur: 16}]}/>
    </Desk>
  );
};
// the five 2020 investors as plain-text stickers on one board (no logos): shot B shows two, shot C all five
const INV: {t: string; x: number; y: number; r: number; bg?: string; color?: string; dark?: boolean; k: string}[] = [
  {t: "A Meta affiliate", x: 700, y: 440, r: -3, dark: true, k: "a Meta"},
  {t: "Google", x: 1280, y: 420, r: 3, k: "Google"},
  {t: "Silver Lake", x: 480, y: 620, r: 2, bg: C.highlight, color: C.ink, k: "Silver"},
  {t: "KKR", x: 900, y: 640, r: -2, dark: true, k: "K"},
  {t: "Saudi Arabia's PIF", x: 1470, y: 625, r: 3, k: "Saudi"},
];
const InvBoard = (f: number, a: (k: string, x?: number | string) => number, upto: number, quiet: number) => (
  <>
    <BigWord f={f} at={quiet ? 0 : a("q22", "In twenty")} text="2020: stakes sold" x={960} y={250} size={120} color={C.ink} stagger={5}/>
    {INV.slice(0, upto).map((v, i) => <React.Fragment key={v.t}>{pop(f, i < quiet ? 0 : a("q22", v.k + (v.k === "K" ? "" : "")), v.t, v.x, v.y, {dark: v.dark, bg: v.bg, color: v.color, rot: v.r, size: 72})}</React.Fragment>)}
  </>
);
const q22b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <DeskP f={f} d={d} tone="cream" chip="Jio RHP p.250 · 2020 stakes" cam={[[0, 1.0, 1020, 540], [d, 1.06, 960, 520, inOut]]}
      over={<TimelineS f={f} at={0} labels={TL} stops={[{i: 0, at: 0}, {i: 1, at: 8}]} y={850} x0={420} x1={1500}/>}>
      {InvBoard(f, a, 2, 0)}
    </DeskP>
  );
};
const q22c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <DeskP f={f} d={d} tone="cream" chip="Jio RHP p.250 · 2020 stakes" cam={[[0, 1.1, 1000, 560], [d, 1.0, 960, 540, inOut]]}
      over={<TimelineS f={f} at={0} labels={TL} stops={[{i: 1, at: 0}]} y={850} x0={420} x1={1500}/>}>
      {InvBoard(f, a, 5, 2)}
    </DeskP>
  );
};

// ---------------------------------------------------------------- q23 5G auction (reported) and the first standalone 5G
const q23a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <DeskP f={f} d={d} tone="cream" chip="Press · Digit · Aug 2022" cam={[[0, 1.0, 1000, 540], [d, 1.08, 1000, 540, inOut]]}
      over={<TimelineS f={f} at={0} labels={TL} stops={[{i: 1, at: 0}, {i: 2, at: a("q23", "August")}]} y={860} x0={420} x1={1500}/>}>
      <PhotoPrint f={f} src={PH.sunset.src} x={520} y={420} w={800} h={580} rot={-3} halftone={0.1} enter={{at: 0, mode: "slide", from: [-1200, 0], dur: 12}} crop={{s0: 1.0, s1: 1.1, dur: 130}}
        caption={PH.sunset.cap}/>
      <BigWord f={f} at={a("q23", "August")} text="August 2022" x={1440} y={400} size={130} color={C.ink} stagger={8} maxWidth={760}/>
      {pop(f, a("q23", "5G"), "5G auction", 1440, 600, {dark: true, rot: 2, size: 66})}
    </DeskP>
  );
};
const q23b: React.FC<SP> = ({s0, d}) => {      // the press clipping, marked REPORTED
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Press (Digit) · Aug 2022 · not in the RHP" cam={[[0, 1.0, 960, 560], [d, 1.12, 960, 520, inOut]]}>
      <HeadlineStack f={f} x={960} y={540} w={1400} clips={[{kicker: "Reported · Digit · Aug 2022", text: "5G Auction Updates: Jio buys Rs 88,078 Spectrum…", at: a("q23", "Jio was|-0.1")}]}/>
      <Stamp f={f} at={a("q23", "reported")} text="REPORTED" x={1500} y={440} size={120} rot={-7}/>
    </Desk>
  );
};
const q23c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" chip="Press (Digit) · Aug 2022 · reported" cam={[[0, 1.06, 960, 540], [d, 1.0, 960, 540]]}>
      <Num f={f} at={a("q23", "eighty")} to={88078} x={960} y={440} size={270} pre="₹" preSans suf=" cr" dur={48}/>
      <SubLine f={f} at={a("q23", "eighty|+0.3")} text="reported · the 2022 auction" x={960} y={650} size={46} color="#CFC9BE"/>
    </Desk>
  );
};
const P5G = {src: "jio/docs/ch2_rhp250_5g.png", imgW: 1449, imgH: 42, x: 960, y: 750, width: 1560, rot: -0.5};
const q23d: React.FC<SP> = ({s0, d}) => {      // "India's first standalone 5G network" (as Jio describes it)
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.250 · milestones" cam={[[0, 1.0, 960, 540], [d, 1.1, 1000, 600, inOut]]}
      over={pop(f, a("q23", "what"), "What Jio calls it", 1560, 220, {dark: true, rot: 3, size: 52})}>
      <PhotoPrint f={f} src={PH.roof.src} x={900} y={340} w={980} h={520} rot={1.5} halftone={0.1} enter={{at: 0, mode: "slide", from: [0, -900], dur: 12}} crop={{s0: 1.05, s1: 1.15, dur: 130}}
        caption={PH.roof.cap}/>
      <DocPage f={f} {...P5G} stack={1} enter={{at: 8, mode: "slide-up"}} highlights={[{rects: [[275.6, 2.2, 499.1, 29.9]], at: a("q23", "India's"), dur: 20}]}/>
    </Desk>
  );
};

// ---------------------------------------------------------------- q24 tariff rise (RHP p.43) and the 19 June 2026 filing
const PT = {src: "jio/docs/ch2_rhp43_tariff.png", imgW: 1449, imgH: 176, x: 960, y: 450, width: 1560, rot: 0.5};
const q24a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const c = docRectCentre(PT, [420, 5, 700, 70]);
  return (
    <Desk f={f} d={d} tone="kraft" chip="Jio RHP p.43 · ARPU and tariffs" cam={[[0, 1.0, 960, 540], [d, 1.22, c.x, c.y + 60, inOut]]}
      over={<>{pop(f, a("q24", "raised"), "Tariffs raised", 1500, 770, {dark: true, rot: -3, size: 60})}
        <TimelineS f={f} at={0} labels={TL} stops={[{i: 2, at: 0}, {i: 3, at: a("q24", "second")}]} y={855} x0={420} x1={1500}/></>}>
      <DocPage f={f} {...PT} stack={2} enter={{at: 0, mode: "slide-right"}} focus={{rect: [0, 0, 1449, 78], at: a("q24", "second"), blur: 2.4}}
        highlights={[{rects: [[769.5, 3.0, 355.4, 33.1]], at: a("q24", "second quarter"), dur: 14}, {rects: [[423.4, 37.6, 400, 33.1]], at: a("q24", "raised"), dur: 14}]}/>
    </Desk>
  );
};
const q24b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <DeskP f={f} d={d} tone="cream" chip="SEBI · Jio Platforms DRHP · 19 Jun 2026" cam={[[0, 1.0, 900, 540], [d, 1.06, 960, 520, inOut]]}
      over={<TimelineS f={f} at={0} labels={TL} stops={[{i: 3, at: 0}, {i: 4, at: a("q24", "nineteenth|-0.2")}]} y={850} x0={420} x1={1500}/>}>
      <Num f={f} at={a("q24", "nineteenth|-0.1")} to={0} text="19 JUN 2026" x={960} y={400} size={210} color={C.ink}/>
      <Sub f={f} at={a("q24", "June|+0.2")} text="Jio Platforms · draft prospectus" x={960} y={560} size={38} color={C.inkSoft}/>
    </DeskP>
  );
};
const q24c: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <DeskP f={f} d={d} tone="kraft" chip="SEBI · public issues listing" cam={[[0, 1.1, 960, 560], [d, 1.0, 960, 540, inOut]]}>
      <BigWord f={f} at={a("q24", "draft")} text="Draft prospectus" x={960} y={330} size={130} color={C.ink} stagger={6}/>
      <Stamp f={f} at={a("q24", "prospectus|-0.1")} text="FILED" x={960} y={620} size={190} rot={-6}/>
      <SubLine f={f} at={a("q24", "prospectus|+0.5")} text="with SEBI · 19 June 2026" x={960} y={840} size={40} color={C.inkSoft}/>
    </DeskP>
  );
};

// ---------------------------------------------------------------- q25 a ten-year-old entrant that leads; does leading mean protected?
const q25a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <DeskP f={f} d={d} tone="cream" chip="Jio RHP p.249 · launched 2016" cam={[[0, 1.1, 1000, 520], [d, 1.0, 960, 540, inOut]]}>
      <Sub f={f} at={a("q25", "company")} text="The company on offer" x={960} y={250} size={40} color={C.inkSoft}/>
      <Num f={f} at={a("q25", "ten")} to={10} x={640} y={440} size={460} color={C.ink}/>
      <BigWord f={f} at={a("q25", "year")} text="year-old entrant" x={1330} y={440} size={116} color={C.ink} stagger={8} maxWidth={640}/>
      <StickerLabel f={f} text="Now leads on subscribers" x={960} y={790} size={54} dark rot={-1.5} enter={{at: a("q25", "now"), mode: "slide", from: [0, 320], dur: 9}}/>
    </DeskP>
  );
};
const q25b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <DeskP f={f} d={d} tone="ink" cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]}>
      <BigWord f={f} at={a("q25", "But")} text="Does leading mean protected?" x={960} y={450} size={150} stagger={7} mark={["protected"]} markAt={a("q25", "protected")} maxWidth={1500}/>
      <SubLine f={f} at={a("q25", "whole")} text="we need the whole industry" x={960} y={780} size={46} color="#B9B2A6"/>
    </DeskP>
  );
};

export const SHOTS2: Shot[] = [
  S("q20", 0, PU, q20),
  S("q21", 0, PU, q21a), S("q21", "The industry|-0.15", WL, q21b), S("q21", "forty|-0.2", H0, q21c),
  S("q22", 0, WU, q22a), S("q22", "In twenty|-0.15", PL, q22b), S("q22", "Silver|-0.2", WR, q22c),
  S("q23", 0, PU, q23a), S("q23", "Jio was|-0.2", WD, q23b), S("q23", "eighty|-0.2", H0, q23c), S("q23", "It then|-0.1", WL, q23d),
  S("q24", 0, PU, q24a), S("q24", "And on|-0.15", WR, q24b), S("q24", "Jio filed|-0.15", MZ, q24c),
  S("q25", 0, WU, q25a), S("q25", "But|-0.15", PU, q25b),
];
export const CUES2: SCue[] = [
  [W("q20", 1.0), "whoosh", 0.7],
  [W("q21", "voice"), "highlighter", 1], [W("q21", "paid"), "pop", 1], [W("q21", "forty"), "ding", 1],
  [W("q22", "incorporated"), "highlighter", 0.8], [W("q22", "a Meta"), "pop", 1],
  [W("q23", "reported"), "stamp", 0.8], [W("q23", "India's"), "highlighter", 1],
  [W("q24", "second quarter"), "highlighter", 1], [W("q24", "prospectus|-0.1"), "stamp", 0.9],
  [W("q25", "protected"), "circle", 0.9],
];
