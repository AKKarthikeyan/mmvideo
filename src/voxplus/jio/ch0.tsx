// Jio film, cold open (beats q00-q03): hook A (AK, 20 Oct 2026). 14 shots in ~51 s, each cut on its spoken word.
// q00 hook: biggest telco -> Rs 27,500 cr raise -> RHP objects table (repay loans) -> Airtel +Rs 35 -> "really the strongest?"
// q01 the IPO (no RHP date, AK): title -> RHP cover bid period -> 27 crore new shares, no offer for sale
// q02 the plant: 26,800.8 MHz pinned as a sticky note (paid off in q64) -> 53.3 crore customers
// q03 the spine: biggest vs best protected -> moat -> margin
import React from "react";
import {AbsoluteFill} from "remotion";
import {BigNumber, BigWord, SubLine} from "../BigType";
import {Layer, camAt} from "../Camera";
import {SourceTag} from "../Cards";
import {PhotoPrint, StickerLabel, TornBlock} from "../Collage";
import {DocPage, docRectCentre} from "../DocPage";
import {Rect} from "../Marker";
import {MapRoute, useGeo} from "../MapRoute";
import {SCue} from "../A01V4Cold";
import {Castle, Desk, MarkerText, Paper, SP, Shot, Stamp, StickyNote} from "../A01V4Parts";
import {Finish} from "../Texture";
import {C, F, clamp01, ease, inOut, lin, outCubic, outQuint, shake, spr, useTicks} from "../tokens";
import {H0, MZ, PL, PU, S, W, WD, WL, WR, WU, useAt} from "./kit";

// ---------------- real RHP excerpts (scripts/voxplus/rhp_shot.py; rects in image px) ----------------
const OBJ = {src: "jio/docs/ch0_objects.png", imgW: 1338, imgH: 190, x: 960, y: 520, width: 1560, rot: -0.8};
const OBJ_R = {pre1: [98.3, 79.5, 668.9, 29.9] as Rect, pre2: [98.3, 110.5, 569.5, 29.9] as Rect, amt: [951.7, 95.0, 88.0, 29.9] as Rect};
const BID = {src: "jio/docs/ch0_bidperiod.png", imgW: 1146, imgH: 100, x: 960, y: 500, width: 1600, rot: 0.6};
const BID_R = {open: [299.0, 68.7, 236.2, 29.9] as Rect, close: [866.6, 68.7, 236.2, 29.9] as Rect};

/** Big money figure: digits in the serif, the rupee sign in Inter (DM Serif Display has no ₹ glyph). */
const Money: React.FC<{f: number; at: number; to: number; x: number; y: number; size?: number; suffix?: string; dur?: number; sign?: string; color?: string;
  sub?: string}> = ({f, at, to, x, y, size = 230, suffix = "", dur = 34, sign = "", color = C.white, sub}) => {
  if (f < at) return null;
  const s = spr(f, at, 11, 200), sc = 1.5 - 0.5 * s, sh = shake(f, at + 5, 7, "m" + to);
  const v = to * lin(f, at, at + dur, 0, 1, (t) => 1 - Math.pow(1 - t, 4));
  return (
    <div style={{position: "absolute", left: x + sh.x, top: y + sh.y, transform: `translate(-50%, -50%) scale(${sc})`, opacity: clamp01(s * 3), textAlign: "center",
      filter: s < 0.8 ? `blur(${((0.8 - s) * 18).toFixed(1)}px)` : undefined}}>
      <div style={{whiteSpace: "nowrap", lineHeight: 1, color}}>
        <span style={{fontFamily: F.serif, fontSize: size * 0.8}}>{sign}</span>
        <span style={{fontFamily: F.sans, fontWeight: 600, fontSize: size * 0.72, marginRight: size * 0.04}}>₹</span>
        <span style={{fontFamily: F.serif, fontSize: size, letterSpacing: -size * 0.02, fontVariantNumeric: "tabular-nums"}}>{Math.round(v).toLocaleString("en-IN")}</span>
        <span style={{fontFamily: F.serif, fontSize: size * 0.5}}>{suffix}</span>
      </div>
      {sub ? <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: size * 0.15, color: C.grey, marginTop: size * 0.08, letterSpacing: 2}}>{sub}</div> : null}
    </div>
  );
};

// =====================================================================================================
// q00 · hook
// =====================================================================================================
const h1: React.FC<SP> = ({s0, d}) => {      // "India's biggest telecom company": paper India map settles, label pops
  const f = useTicks(), a = useAt(s0), geo = useGeo();
  const cam = camAt(f, [[0, 0.82, 960, 560], [d, 1.0, 1000, 540, outCubic]]);
  return (
    <AbsoluteFill style={{background: C.mapWater}}>
      <Layer cam={cam}><MapRoute f={f} geo={geo} inkAt={2} credit={false}/></Layer>
      <Layer cam={cam} depth={1.08}>
        <PhotoPrint f={f} src="jio/media/tower_in_sunset_print.jpg" x={1380} y={640} w={720} h={480} rot={4} halftone={0.12}
          enter={{at: -1, mode: "slide", from: [900, 120], rot0: 10, dur: 8}} crop={{s0: 1.12, s1: 1.0, dur: d}}/>
      </Layer>
      <StickerLabel f={f} text="India's biggest telecom" x={1260} y={250} size={64} rot={-3} dark enter={{at: a("q00", "biggest"), mode: "pop", rot0: -12}}/>
      <SourceTag f={f} at={0} text="TRAI · wireless subscribers · Jun 2026"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
const h2: React.FC<SP> = ({s0, d}) => {      // "is raising twenty seven thousand five hundred crore rupees"
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" cam={[[0, 1.08, 960, 540], [d, 1.0, 960, 540, outCubic]]} chip="Jio RHP p.116 · objects of the issue">
      <BigWord f={f} at={0} text="Raising" x={960} y={250} size={90} color={C.grey} italic/>
      <Money f={f} at={a("q00", "twenty seven")} to={27500} x={960} y={560} suffix=" CR" dur={40} sub="IN THIS IPO"/>
    </Desk>
  );
};
const h3: React.FC<SP> = ({s0, d}) => {      // "Not for its network. To repay loans." the real objects table
  const f = useTicks(), a = useAt(s0);
  const t = docRectCentre(OBJ, OBJ_R.pre2);
  return (
    <Desk f={f} d={d} tone="kraft" cam={[[0, 1.0, 960, 540], [a("q00", "repay"), 1.02, 960, 530], [d, 1.25, t.x - 80, t.y - 10, inOut]]}
      chip="Jio RHP p.116 · objects of the issue (₹ million)">
      <DocPage f={f} {...OBJ} stack={2} enter={{at: -2, mode: "slide-up", dur: 10}}
        highlights={[{rects: [OBJ_R.pre1, OBJ_R.pre2], at: a("q00", "repay"), dur: 9}]}
        circles={[{rect: OBJ_R.amt, at: a("q00", "loans") + 4, dur: 12}]}/>
      <StickerLabel f={f} text="Not the network" x={560} y={250} size={58} rot={-3} bg={C.markerRed} color={C.white} enter={{at: a("q00", "Not"), mode: "pop", rot0: -10}}/>
      <MarkerText f={f} at={a("q00", "repay")} text="repay loans" x={1360} y={800} size={74} rot={-4}/>
    </Desk>
  );
};
const h4: React.FC<SP> = ({s0, d}) => {      // "And its rival Airtel keeps about thirty five rupees more from every customer, every month."
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" cam={[[0, 1.0, 900, 540], [d, 1.04, 1010, 540]]} chip="Our arithmetic · EBITDA per customer, FY26 · RHP p.131 · Airtel">
      <TornBlock f={f} x={1340} y={560} w={760} h={560} rot={2} color={C.wallBlue} enter={{at: a("q00", "Airtel") - 6, mode: "slide", from: [900, 0], dur: 9}}/>
      <StickerLabel f={f} text="Airtel" x={1340} y={320} size={70} rot={-2} enter={{at: a("q00", "Airtel"), mode: "pop", rot0: -10}}/>
      <Money f={f} at={a("q00", "thirty five")} to={35} sign="+" x={1340} y={560} size={250} dur={20}/>
      <SubLine f={f} at={a("q00", "every customer")} text="per customer" x={1340} y={720} size={40} color={C.white}/>
      <SubLine f={f} at={a("q00", "every month")} text="every month" x={1340} y={775} size={40} color={C.highlight}/>
      <BigWord f={f} at={a("q00", "And its rival")} text="Jio's rival keeps more" x={520} y={540} size={84} maxWidth={720} mark={["more"]} markAt={a("q00", "more")}/>
    </Desk>
  );
};
const h5: React.FC<SP> = ({s0, d}) => {      // "So is Jio really the strongest?"
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.1, 960, 520, inOut]]} chip="Moat & Margin · our question">
      <BigWord f={f} at={0} text="Biggest." x={960} y={380} size={170} color={C.ink}/>
      <BigWord f={f} at={a("q00", "really")} text="Strongest?" x={960} y={610} size={210} color={C.ink} mark={["Strongest"]} markAt={a("q00", "strongest")}/>
    </Desk>
  );
};

// =====================================================================================================
// q01 · the IPO
// =====================================================================================================
const i1: React.FC<SP> = ({s0, d}) => {      // "This is our Jio IPO review."
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="kraft" cam={[[0, 1.06, 1040, 540], [d, 1.06, 880, 540]]}>
      <TornBlock f={f} x={960} y={540} w={1240} h={420} rot={-1.5} color={C.ink} enter={{at: -2, mode: "slide", from: [0, 700], dur: 9}}/>
      <BigWord f={f} at={a("q01", "Jio")} text="Jio IPO review" x={960} y={520} size={150} color={C.white} mark={["IPO"]} markAt={a("q01", "IPO")}/>
      <SubLine f={f} at={a("q01", "review")} text="MOAT & MARGIN · FROM THE FILINGS" x={960} y={680} size={30} color={C.highlight}/>
    </Desk>
  );
};
const i2: React.FC<SP> = ({s0, d}) => {      // "Bidding runs from the twenty first to the twenty third of October."
  const f = useTicks(), a = useAt(s0);
  const t = docRectCentre(BID, BID_R.close);
  return (
    <Desk f={f} d={d} tone="cream" cam={[[0, 1.0, 960, 520], [a("q01", "twenty third"), 1.05, 900, 510], [d, 1.15, t.x - 200, t.y, inOut]]} chip="Jio RHP · cover page · bid/issue period">
      <DocPage f={f} {...BID} stack={1} enter={{at: -2, mode: "drop", dur: 10}}
        highlights={[{rects: [BID_R.open], at: a("q01", "twenty first"), dur: 8}, {rects: [BID_R.close], at: a("q01", "twenty third"), dur: 8}]}/>
      <StickerLabel f={f} text="Bidding: 3 days" x={960} y={840} size={56} rot={-2} dark enter={{at: a("q01", "Bidding"), mode: "slide", from: [0, 300], dur: 9}}/>
    </Desk>
  );
};
const i3: React.FC<SP> = ({s0, d}) => {      // "Up to twenty seven crore new shares, and no offer for sale, so all the money goes to the company."
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" cam={[[0, 1.0, 960, 560], [d, 1.05, 960, 520]]} chip="Jio RHP · cover page · fresh issue">
      <BigNumber f={f} at={a("q01", "twenty seven")} to={27} x={960} y={380} size={260} suffix=" crore" dur={18} sub="NEW SHARES, AT MOST"/>
      <Stamp f={f} at={a("q01", "no offer")} text="NO OFFER FOR SALE" x={960} y={700} size={78} rot={-4}/>
      <MarkerText f={f} at={a("q01", "money goes")} text="all to the company" x={1300} y={890} size={58} rot={-3} color={C.highlight}/>
    </Desk>
  );
};

// =====================================================================================================
// q02 · the plant
// =====================================================================================================
const p1: React.FC<SP> = ({s0, d}) => {      // "Jio says it holds the industry's largest spectrum, twenty six thousand eight hundred megahertz."
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} tone="ink" cam={[[0, 1.1, 960, 540], [d, 1.0, 960, 540, outCubic]]} chip="Jio RHP p.221 · as of 30 Jun 2026">
      <PhotoPrint f={f} src="jio/media/tower_in_todabhim_top_print.jpg" x={470} y={560} w={600} h={800} rot={-3} halftone={0.14} darken={0.1}
        enter={{at: -2, mode: "slide", from: [-900, 0], rot0: -8, dur: 9}} crop={{s0: 1.15, s1: 1.0, fy: 0.3, dur: d}}/>
      <BigWord f={f} at={a("q02", "largest")} text="Largest spectrum" x={1250} y={300} size={86} color={C.grey} italic maxWidth={1000}/>
      <BigNumber f={f} at={a("q02", "twenty six")} to={26800.8} decimals={1} x={1230} y={570} size={150} suffix=" MHz" dur={36} sub="JIO SAYS"/>
    </Desk>
  );
};
const p2: React.FC<SP> = ({s0, d}) => {      // "Keep that number in mind." the sticky note
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.06, 1060, 480, inOut]]} chip="We come back to this in chapter 6">
      <BigNumber f={f} at={-30} to={26800.8} decimals={1} x={820} y={600} size={170} suffix=" MHz" color={C.ink} slam={false} dur={1}/>
      <StickyNote f={f} at={a("q02", "Keep")} text="Remember this number" x={1380} y={330}/>
    </Desk>
  );
};
const p3: React.FC<SP> = ({s0, d}) => {      // "Its telecom company had fifty three point three crore customers in June."
  const f = useTicks(), a = useAt(s0);
  const cam = camAt(f, [[0, 1.0, 960, 540], [d, 1.04, 960, 530, inOut]]);
  return (
    <AbsoluteFill style={{background: C.kraft}}>
      <Layer cam={cam}>
        <PhotoPrint f={f} src="jio/media/crowd_dumdum_platform_print.jpg" x={960} y={540} w={1760} h={990} rot={-1} border={18} halftone={0.1}
          enter={{at: -2, mode: "none"}} crop={{s0: 1.0, s1: 1.1, fx: 0.5, fy: 0.5, dur: d}} caption="commuters, Kolkata (photo: Wikimedia Commons)"/>
      </Layer>
      <AbsoluteFill style={{background: `rgba(14,14,14,${0.55 * ease(f, a("q02", "fifty") - 6, a("q02", "fifty") + 4)})`}}/>
      <BigNumber f={f} at={a("q02", "fifty")} to={53.3} decimals={1} x={960} y={500} size={250} suffix=" crore" dur={24} sub="CUSTOMERS · JUNE 2026" subColor={C.white}/>
      <SourceTag f={f} at={0} text="Jio RHP p.131 · RJIL customers, 30 Jun 2026"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// =====================================================================================================
// q03 · the spine question
// =====================================================================================================
const s1: React.FC<SP> = ({s0, d}) => {      // "Our question: Jio is the biggest. Is it also the best protected?"
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.05, 900, 540], [d, 1.05, 1020, 540]]} chip="Moat & Margin · our question">
      <BigWord f={f} at={a("q03", "Jio")} text="The biggest." x={960} y={360} size={150} color={C.ink} mark={["biggest"]} markAt={a("q03", "biggest")}/>
      <BigWord f={f} at={a("q03", "Is it also")} text="Best protected?" x={960} y={600} size={170} color={C.ink} mark={["protected"]} markAt={a("q03", "protected")}/>
    </Desk>
  );
};
const s2: React.FC<SP> = ({s0, d}) => {      // "That's the moat."
  const f = useTicks(), a = useAt(s0);
  return (
    <Desk f={f} d={d} cam={[[0, 1.12, 960, 560], [d, 1.0, 960, 540, outCubic]]} chip="Our plain words">
      <Castle f={f} y={520} water={ease(f, a("q03", "moat") - 8, a("q03", "moat") + 10, inOut)}/>
      <StickerLabel f={f} text="= the moat" x={1500} y={880} size={70} rot={-4} dark enter={{at: a("q03", "moat"), mode: "pop", rot0: -10}}/>
    </Desk>
  );
};
const s3: React.FC<SP> = ({s0, d}) => {      // "And is its profit on each rupee rising or falling? That's the margin."
  const f = useTicks(), a = useAt(s0);
  const up = ease(f, a("q03", "rising"), a("q03", "rising") + 10, outQuint), dn = ease(f, a("q03", "falling"), a("q03", "falling") + 10, outQuint);
  return (
    <Desk f={f} d={d} tone="ink" cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]} chip="Our plain words">
      <BigWord f={f} at={a("q03", "profit")} text="Profit on each ₹1" x={960} y={300} size={110} color={C.white}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <path d="M 760 700 L 860 560 L 960 700" fill="none" stroke={C.highlight} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round"
          opacity={up} transform={`translate(0 ${(1 - up) * 40})`}/>
        <path d="M 1000 560 L 1100 700 L 1200 560" fill="none" stroke={C.markerRed} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round"
          opacity={dn} transform={`translate(0 ${(1 - dn) * -40})`}/>
      </svg>
      <StickerLabel f={f} text="= the margin" x={960} y={880} size={72} rot={-3} bg={C.highlight} color={C.ink} enter={{at: a("q03", "margin"), mode: "pop", rot0: -10}}/>
    </Desk>
  );
};

export const SHOTS0: Shot[] = [
  S("q00", 0, H0, h1, "c-h1"), S("q00", "raising|-0.25", WL, h2, "c-h2"), S("q00", "Not for", PU, h3, "c-h3"), S("q00", "And its rival|-0.15", WR, h4, "c-h4"),
  S("q00", "So is", H0, h5, "c-h5"),
  S("q01", 0, PU, i1, "c-i1"), S("q01", "Bidding|-0.1", WU, i2, "c-i2"), S("q01", "Up to", WD, i3, "c-i3"),
  S("q02", 0, MZ, p1, "c-p1"), S("q02", "Keep", PL, p2, "c-p2"), S("q02", "Its telecom", WL, p3, "c-p3"),
  S("q03", 0, PU, s1, "c-s1"), S("q03", "That's the moat|-0.2", H0, s2, "c-s2"), S("q03", "And is its", WR, s3, "c-s3"),
];
export const CUES0: SCue[] = [
  [W("q00", "twenty seven"), "stamp", 0.7], [W("q00", "repay"), "highlighter", 0.6], [W("q00", "thirty five"), "stamp", 0.6],
  [W("q01", "twenty first"), "highlighter", 0.5], [W("q01", "no offer"), "stamp", 0.6], [W("q02", "Keep"), "paper", 0.5],
  [W("q03", "moat"), "ding", 0.35], [W("q03", "margin"), "pop", 0.35],
];
