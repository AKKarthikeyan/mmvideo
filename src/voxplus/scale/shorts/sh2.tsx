// Short 2/5 | A trusted name | "What happened when Jio raised prices?" (voice 31.6 s). Shots: moat card; the recharge price ticks up (illustration); the Q2 FY25
// tariff marker on a FY24-FY26 axis; ARPU exit quarter 181.7 -> 206.2 (RJIL | EXIT QUARTER); net additions 4.25 crore -> 64 lakh (FULL YEAR);
// the RHP p.43 sentence, zoomed and highlighted; net additions recover to 3.62 crore; verdict stamp MIXED. Figures: scripts/ledger/jioscale.csv.
import React from "react";
import {Shot, SP, Stamp} from "../kit/A01V4Parts";
import {SCue} from "../kit/A01V4Cold";
import {StickerLabel} from "../kit/Collage";
import {DocPage, docRectCentre} from "../kit/DocPage";
import {C, F, clamp01, ease, inOut, outCubic, useTicks} from "../kit/tokens";
import {ENTITY, EntityTag} from "../devices";
import {PricePhone} from "../parts789";
import {H0, PU, S, W, WL, WR, useAt} from "./cue";
import {VFrame, VSource} from "./frame";
import {MoatCard, VBars, VTime, markX} from "./parts23";
import TAR from "../../../../public/voxplus/scale/docs/sc08_rhp43_tariff.json";

const K = "sh2";

const s1: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <VFrame f={f} d={d}><MoatCard f={f} n={2} l1="A TRUSTED" l2="NAME?" q="Can Jio raise prices and keep its customers?"/></VFrame>;
};

// "So what happened when Jio raised prices?": the recharge price ticks up (illustration)
const s2: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.05]} cy={800}>
      <VSource text="Illustration · generic recharge screen · not an actual plan"/>
      <PricePhone f={f} x={540} y={820} s={0.9} showAt={-30} changeAt={a("raised")}/>
      <StickerLabel f={f} text="Jio raises prices" x={540} y={268} size={60} rot={-1.5} dark enter={{at: a("raised") - 4, mode: "pop", rot0: -6}}/>
      <StickerLabel f={f} text="What happened next?" x={540} y={1372} size={46} rot={1} bg={C.teal} color={C.white} enter={{at: a("happened") - 2, mode: "pop", rot0: 5}}/>
    </VFrame>
  );
};

// "In the second quarter of financial year twenty five, Jio and other operators increased tariffs."
const s3: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  const t = ease(f, a("increased") - 4, a("increased") + 8, outCubic);
  return (
    <VFrame f={f} d={d}>
      <VSource text="Jio RHP p.43 · tariff increase, second quarter of FY25"/>
      <div style={{position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", fontFamily: F.serif, fontSize: 270, lineHeight: 1, color: C.ink}}>Q2 FY25</div>
      <div style={{position: "absolute", left: 80, right: 80, top: 590, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 54, letterSpacing: 2, color: C.grey, lineHeight: 1.2,
        opacity: ease(f, a("Jio and") - 4, a("Jio and") + 6)}}>JIO AND OTHER OPERATORS<br/>RAISED TARIFFS</div>
      <VTime f={f} y={940} markAt={a("twenty five")}/>
      <div style={{position: "absolute", left: markX - 300, top: 1240, width: 600, height: 96, background: C.rust, color: C.white, fontFamily: F.sans, fontWeight: 800, fontSize: 52, letterSpacing: 1.5,
        display: "flex", alignItems: "center", justifyContent: "center", opacity: t, transform: `scale(${0.8 + 0.2 * t})`}}>TARIFF INCREASE</div>
    </VFrame>
  );
};

// ARPU: exit quarter FY24 181.7 -> FY25 206.2
const s4: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <VSource text="Jio RHP p.131 · ARPU (for exit quarter), ₹ per month"/>
      <EntityTag f={f} at={-30} text={ENTITY.rjil} period="EXIT QUARTER" x={60} y={255} size={32}/>
      <div style={{position: "absolute", left: 60, top: 305, fontFamily: F.serif, fontSize: 92, lineHeight: 1, color: C.ink}}>REVENUE PER USER</div>
      <div style={{position: "absolute", left: 60, top: 410, fontFamily: F.sans, fontWeight: 600, fontSize: 38, color: C.grey}}>ARPU · ₹ per month</div>
      <VBars f={f} max={250} base={1190} maxH={560} bigSize={150}
        bars={[{cx: 300, w: 340, v: 181.7, at: a("one hundred and eighty two") - 6, big: "₹181.7", foot: "FY24", sub: "exit quarter"},
               {cx: 780, w: 340, v: 206.2, at: a("two hundred and six") - 6, big: "₹206.2", foot: "FY25", sub: "exit quarter"}]}/>
      <StickerLabel f={f} text="Tariff increase in between" x={540} y={485} size={38} rot={-2} bg={C.rust} color={C.white} enter={{at: a("rose") - 4, mode: "pop", rot0: -5}}/>
    </VFrame>
  );
};

const NETBARS = (a: (x?: number | string) => number, three: boolean) => [
  {cx: 215, w: 250, v: 4.25, at: three ? -100 : a("four point two five") - 6, big: "4.25", small: "crore", foot: "FY24"},
  {cx: 540, w: 250, v: 0.64, at: three ? -100 : a("sixty four") - 6, big: "64", small: "lakh", foot: "FY25"},
  ...(three ? [{cx: 865, w: 250, v: 3.62, at: a("recovered") - 4, big: "3.62", small: "crore", foot: "FY26"}] : []),
];

// "But churn rose too, and net additions fell from four point two five crore to sixty four lakh."
const s5: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <VSource text="Jio RHP p.131 · net customer addition (full year)"/>
      <EntityTag f={f} at={-30} text={ENTITY.rjil} period="FULL YEAR" x={60} y={255} size={32}/>
      <div style={{position: "absolute", left: 60, top: 305, fontFamily: F.serif, fontSize: 84, lineHeight: 1, color: C.ink}}>NET ADDITIONS</div>
      <div style={{position: "absolute", left: 60, top: 405, fontFamily: F.sans, fontWeight: 600, fontSize: 38, color: C.grey}}>Net customer additions · per year</div>
      <VBars f={f} max={5} base={1190} maxH={590} bigSize={150} bars={NETBARS(a, false)}/>
      <StickerLabel f={f} text="Churn rose too" x={760} y={560} size={56} rot={2} bg={C.rust} color={C.white} enter={{at: a("churn") - 4, mode: "pop", rot0: 6}}/>
    </VFrame>
  );
};

// "Jio says so in its own prospectus.": the real RHP p.43 passage, zoomed to the sentence and highlighted
const DOC = {imgW: TAR.w, imgH: TAR.h, x: 540, y: 760, width: 1000, rot: 0};
const s6: React.FC<SP> = ({s0, d}) => {
  // The 3-line RHP strip is too wide to zoom legibly in 9:16: show the real excerpt whole (provenance, highlighted), and the
  // sentence itself, verbatim, large below it.
  const f = useTicks();
  const q = ease(f, 10, 22, inOut);
  return (
    <VFrame f={f} d={d} z={[1, 1.02]}>
      <VSource text="Jio RHP p.43 · risk factors"/>
      <div style={{position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", fontFamily: F.serif, fontSize: 84, color: C.ink, opacity: ease(f, 0, 8)}}>IN ITS OWN WORDS</div>
      <DocPage f={f} src="scale/docs/sc08_rhp43_tariff.png" {...DOC} y={520} margin={0.03} enter={{at: -14, mode: "drop", dur: 8}}
        highlights={[{rects: TAR.rects.churn, at: 18, dur: 12}, {rects: TAR.rects.lower, at: 34, dur: 12}]}/>
      <div style={{position: "absolute", left: 80, right: 80, top: 720, opacity: q, transform: `translateY(${(1 - q) * 30}px)`}}>
        <div style={{fontFamily: F.serif, fontSize: 64, lineHeight: 1.18, color: C.ink}}>“…this tariff increase also <span style={{background: C.highlight}}>contributed to higher customer churn</span>, leading to <span style={{background: C.highlight}}>lower growth</span> in our Total Customer Base during Fiscal 2025.”</div>
        <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 34, color: C.grey, marginTop: 26, letterSpacing: 2}}>— JIO PLATFORMS RHP, P.43</div>
      </div>
    </VFrame>
  );
};

// "Growth recovered the next year."
const s7: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <VSource text="Jio RHP p.131 · net customer addition (full year)"/>
      <EntityTag f={f} at={-30} text={ENTITY.rjil} period="FULL YEAR" x={60} y={255} size={32}/>
      <div style={{position: "absolute", left: 60, top: 305, fontFamily: F.serif, fontSize: 84, lineHeight: 1, color: C.ink}}>NET ADDITIONS</div>
      <div style={{position: "absolute", left: 60, top: 405, fontFamily: F.sans, fontWeight: 600, fontSize: 38, color: C.grey}}>Net customer additions · per year</div>
      <VBars f={f} max={5} base={1190} maxH={590} bigSize={150} bars={NETBARS(a, true)}/>
      <StickerLabel f={f} text="Growth recovered" x={540} y={1360} size={50} rot={2} dark enter={{at: a("recovered") - 2, mode: "pop", rot0: 6}}/>
    </VFrame>
  );
};

// "Verdict: mixed."
const s8: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  const chips = [["Revenue per user: up", C.teal], ["Churn: up", C.rust], ["Net additions: down, then up", C.ink]] as const;
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <VSource text="Jio RHP p.43, p.131"/>
      <div style={{position: "absolute", left: 0, right: 0, top: 290, textAlign: "center"}}><span style={{fontFamily: F.sans, fontWeight: 800, fontSize: 44, letterSpacing: 4, background: C.highlight, color: C.ink, padding: "10px 26px"}}>VERDICT</span></div>
      <div style={{position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", fontFamily: F.serif, fontSize: 120, lineHeight: 1.05, color: C.ink}}>A trusted name?</div>
      <Stamp f={f} at={a("mixed") - 4} text="MIXED" x={540} y={830} size={230} rot={-7}/>
      {chips.map(([t, bg], i) => (
        <StickerLabel key={t} f={f} text={t} x={540} y={1100 + i * 100} size={46} rot={i % 2 ? 1 : -1} bg={bg} color={C.white} enter={{at: a("mixed") + 10 + i * 8, mode: "pop", rot0: 4}}/>
      ))}
    </VFrame>
  );
};

export const SHOTS_SH2: Shot[] = [
  S(K, 0, H0, s1, "sh2-card"), S(K, "So what|-0.1", WL, s2, "sh2-price"), S(K, "In the second|-0.1", PU, s3, "sh2-q2"), S(K, "Jio's|-0.1", WR, s4, "sh2-arpu"),
  S(K, "But churn|-0.1", PU, s5, "sh2-net"), S(K, "Jio says so|-0.1", WL, s6, "sh2-doc"), S(K, "Growth|-0.1", PU, s7, "sh2-recover"), S(K, "Verdict|-0.1", WR, s8, "sh2-verdict"),
];
export const CUES_SH2: SCue[] = [[W(K, "raised"), "pop", 0.3], [W(K, "Jio says so"), "highlighter", 0.35], [W(K, "mixed"), "stamp", 0.5]];
