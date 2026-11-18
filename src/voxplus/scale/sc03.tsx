// Scene 03 | The comparison that starts the investigation (review pass 20 Oct 2026): ONE dominant image per moment.
//  1. both real excerpts briefly (provenance), then the camera pushes into the single line the calculation needs (RJIL EBITDA, RHP p.34)
//  2. full-size bars: ₹119 grows on its spoken number; the Airtel line (EBITDA margin, Annual Report p.180) enlarged full-frame;
//     back to the bars, ₹154 grows on its number, bracket ~₹35; EntityTags under the bars and "Different business scopes" always visible
//  3. a short EBITDA definition (letters, then where it sits), the finished chart again ("catch" rings the EntityTags), p6 customers
//     card (small), p7 emphasis lines; cut to 100 equal rupee units labelled Jio Platforms (consolidated).
// Sources: RHP p.34 (RJIL standalone revenue/EBITDA, Fiscal 2026), RHP p.131 (customer base 488.2 -> 524.4 mn), Airtel Integrated Report
// 2025-26 printed p.180 (Mobile Services India revenue, EBITDA margin, customers 361.6 -> 373.2 mn); ledger rows q51, q52, q55.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Layer, camAt} from "./kit/Camera";
import {SourceTag} from "./kit/Cards";
import {DocPage, docPoint} from "./kit/DocPage";
import {SCue} from "./kit/A01V4Cold";
import {Paper, SP, Shot} from "./kit/A01V4Parts";
import {Finish} from "./kit/Texture";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr, useTicks} from "./kit/tokens";
import {ENTITY, EntityTag} from "./devices";
import {H0, MZ, PU, S, W, useAt} from "./cue";
import {ChartTitle, EbitdaChart, GridLabels, PageCap, UnitGrid, serif, AX, JX, BASE} from "./parts34";

// image pixels of the two real crops (sc03_*.json): rect coordinates for the highlighter
const JIO = {src: "scale/docs/sc03_rhp34_rjil.png", imgW: 2328, imgH: 867};
const JIO_HL: [number, number, number, number][] = [[76.8, 758.6, 208.9, 49.8], [1194.2, 758.6, 146.5, 49.8]];            // "Fiscal 2026" ... "723,544"
const AIR = {src: "scale/docs/sc03_airtel_p180.png", imgW: 2020, imgH: 905};
const AIR_REV: [number, number, number, number][] = [[57, 126.4, 340, 105.2]];                                           // "₹1,129,954"
const AIR_EB: [number, number, number, number][] = [[1683.5, 325.3, 265.8, 105.2], [57, 424.8, 969, 105.2]];             // "EBITDA" / "margins expanded to 60.2%"

// 1. both excerpts (<= 1.6 s), then the camera pushes into the one line the calculation needs; stays on it until the ₹119 bar
const c1: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  const jp = {...JIO, x: 480, y: 560, width: 760, rot: 0};
  const tgt = docPoint(jp, 733, 500);
  const cam = camAt(f, [[0, 1.0, 960, 540], [46, 1.0, 960, 540], [76, 3.0, tgt.x, tgt.y, inOut], [d, 3.02, tgt.x, tgt.y]]);
  const zoom = ease(f, 60, 72, outQuint);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        <EntityTag f={f} text={ENTITY.rjil} period="FY26" x={480} y={322} anchor="center" size={26}/>
        <DocPage f={f} {...jp} stack={2} highlights={[{rects: JIO_HL, at: 12, dur: 14}]}/>
        <PageCap f={f} x={480} y={790} text="Jio Platforms RHP · p.34"/>
        <EntityTag f={f} text={ENTITY.airtelMob} period="FY26" x={1500} y={372} anchor="center" size={26}/>
        <DocPage f={f} {...AIR} x={1500} y={560} width={560} rot={0.8} stack={2} highlights={[{rects: AIR_EB, at: 30, dur: 12}]}/>
        <PageCap f={f} x={1500} y={775} text="Airtel Annual Report · p.180"/>
      </Layer>
      <div style={{opacity: zoom}}><EntityTag f={f} at={60} text={ENTITY.rjil} period="FY26" x={1840} y={130} anchor="right" size={30}/></div>
      <SourceTag f={f} at={0} text="Real excerpts · Jio RHP p.34 (RJIL standalone) · Airtel Annual Report p.180"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// 2a. the bars: ₹119 grows on its number (Jio only), "Different business scopes" already on screen
const c2: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const cam = camAt(f, [[0, 1.0, 960, 540], [d, 1.02, 965, 535]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        <ChartTitle f={f}/>
        <EbitdaChart f={f} jioAt={a("s03p2", "one hundred and nineteen")} airAt={1e6}/>
      </Layer>
      <SourceTag f={f} at={0} text="Jio RHP pp.34, 131 · our calculation"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// 2b. the Airtel line the calculation needs, enlarged full-frame (EBITDA margin, Annual Report p.180)
const c3: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  const cam = camAt(f, [[0, 1.0, 960, 560], [d, 1.03, 960, 560]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        <DocPage f={f} {...AIR} x={960} y={570} width={1860} rot={0} stack={0} margin={0.03}
          highlights={[{rects: AIR_REV, at: 4, dur: 14}, {rects: AIR_EB, at: 26, dur: 14}]}/>
      </Layer>
      <EntityTag f={f} at={-30} text={ENTITY.airtelMob} period="FY26" x={1860} y={62} anchor="right" size={28}/>
      <SourceTag f={f} at={0} text="Real excerpt · Airtel Annual Report 2025-26 · p.180 · Mobile Services India"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// 2c. back to the bars: ₹154 grows on its number; the difference bracket on "thirty-five"
const c4: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const cam = camAt(f, [[0, 1.02, 965, 535], [d, 1.0, 960, 540]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        <ChartTitle f={f} at={-100}/>
        <EbitdaChart f={f} jioAt={-200} airAt={a("s03p2", "one hundred and fifty")} diffAt={a("s03p3", "about")} braceAt={a("s03p3", "thirty")}/>
      </Layer>
      <SourceTag f={f} at={0} text="Jio RHP pp.34, 131 · Airtel AR 2025-26 p.180 · our calculations"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// 3a. EBITDA definition: the six letters as spoken, then where it sits among the costs
const LETTERS: {l: string; w: string; k: string}[] = [
  {l: "E", w: "Earnings", k: "earnings"}, {l: "B", w: "Before", k: "before"}, {l: "I", w: "Interest", k: "interest"},
  {l: "T", w: "Tax", k: "tax"}, {l: "D", w: "Depreciation", k: "depreciation"}, {l: "A", w: "Amortisation", k: "amortisation"},
];
const FlowBox: React.FC<{f: number; at: number; x: number; w: number; text: string; kind: "solid" | "hero" | "ghost"; y?: number}> = ({f, at, x, w, text, kind, y = 700}) => {
  const p = ease(f, at, at + 10, outQuint);
  if (p <= 0) return null;
  const st: React.CSSProperties = kind === "hero" ? {background: C.teal, color: C.white, border: `4px solid ${C.teal}`}
    : kind === "solid" ? {background: C.ink, color: C.white, border: `4px solid ${C.ink}`} : {background: "transparent", color: C.inkSoft, border: `4px dashed ${C.grey}`};
  return (
    <div style={{position: "absolute", left: x, top: y, width: w, height: 130, transform: `translate(0, -50%) translateY(${(1 - p) * 20}px)`, opacity: p, boxSizing: "border-box", display: "flex",
      alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: kind === "hero" ? 48 : 38, lineHeight: 1.05, padding: "0 12px", ...st}}>{text}</div>
  );
};
const Arrow: React.FC<{f: number; at: number; x: number; y?: number}> = ({f, at, x, y = 700}) =>
  <div style={{position: "absolute", left: x, top: y, transform: "translate(0, -52%)", width: 60, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 48, color: C.grey, opacity: ease(f, at, at + 8)}}>→</div>;
const Brace: React.FC<{f: number; at: number; x0: number; x1: number; y: number; text: string; color: string}> = ({f, at, x0, x1, y, text, color}) => {
  const p = ease(f, at, at + 14, outCubic);
  if (p <= 0) return null;
  return (
    <>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <path d={`M ${x0} ${y - 14} V ${y} H ${x0 + (x1 - x0) * p} V ${y - 14}`} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round"/>
      </svg>
      <div style={{position: "absolute", left: (x0 + x1) / 2, top: y + 40, transform: "translate(-50%, -50%)", opacity: p, whiteSpace: "nowrap", fontFamily: F.sans, fontWeight: 800, fontSize: 40, color}}>{text}</div>
    </>
  );
};
const c5: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const cam = camAt(f, [[0, 1.0, 960, 540], [d, 1.02, 960, 546]]);
  const tm = a("s03p4", "measures") - 4, shr = ease(f, tm, tm + 16, inOut);
  const tw = 230, gap = 40, x0 = (1920 - (6 * tw + 5 * gap)) / 2;
  const tFlow = a("s03p4", "measures"), gh = a("s03p4", "several");
  const row = [{x: 60, w: 300}, {x: 420, w: 400}, {x: 880, w: 330}, {x: 1270, w: 590}];
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper tone="cream" drift={f / d}/></Layer>
      <Layer cam={cam}>
        <div style={{position: "absolute", left: 960, top: 120, transform: "translate(-50%, -50%)", ...serif(130, {color: C.ink, letterSpacing: 4})}}>EBITDA</div>
        <div style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 250px", transform: `scale(${1 - 0.2 * shr})`}}>
          {LETTERS.map((q, i) => {
            const p = spr(f, a("s03p4", q.k), 12, 180), x = x0 + i * (tw + gap);
            const lit = clamp01(p * 2);
            return (
              <div key={q.l} style={{position: "absolute", left: x, top: 250, width: tw, transform: `scale(${0.94 + 0.06 * p})`, textAlign: "center"}}>
                <div style={{height: 190, background: lit > 0.5 ? (i < 2 ? C.teal : C.ink) : "transparent", border: `4px dashed ${lit > 0.5 ? "transparent" : C.grey}`, boxSizing: "border-box",
                  color: lit > 0.5 ? C.white : C.grey, opacity: lit > 0.5 ? 1 : 0.55, ...serif(140, {lineHeight: "182px"})}}>{q.l}</div>
                <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 38, color: C.ink, marginTop: 14, opacity: 0.25 + 0.75 * lit}}>{q.w}</div>
              </div>
            );
          })}
        </div>
        <FlowBox f={f} at={tFlow} x={row[0].x} w={row[0].w} text="Revenue" kind="solid"/>
        <Arrow f={f} at={tFlow + 6} x={row[0].x + row[0].w}/>
        <FlowBox f={f} at={tFlow + 6} x={row[1].x} w={row[1].w} text="Operating costs" kind="solid"/>
        <Arrow f={f} at={tFlow + 12} x={row[1].x + row[1].w}/>
        <FlowBox f={f} at={tFlow + 12} x={row[2].x} w={row[2].w} text="EBITDA" kind="hero"/>
        <Arrow f={f} at={gh - 4} x={row[2].x + row[2].w}/>
        <FlowBox f={f} at={gh - 4} x={row[3].x} w={row[3].w} text="Depreciation, amortisation, interest, tax" kind="ghost"/>
        <Brace f={f} at={a("s03p4", "one stage")} x0={row[0].x} x1={row[2].x + row[2].w} y={810} text="One stage of earnings" color={C.teal}/>
        <Brace f={f} at={gh + 10} x0={row[3].x} x1={row[3].x + row[3].w} y={810} text="Costs still to come" color={C.rust}/>
      </Layer>
      <SourceTag f={f} at={0} text="Definition · Moat & Margin"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// 3b. finished chart again: "catch" rings the EntityTags and the scope note goes solid; p6 a small customers card; p7 emphasis lines
const c6: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const cam = camAt(f, [[0, 1.0, 960, 540], [d, 1.015, 962, 540]]);
  const catchAt = a("s03p5", "catch"), cu = a("s03p6", "more customers"), asm = a("s03p6", "the company");
  const cardE = spr(f, asm - 2, 13, 160), cardX = 1 - ease(f, a("s03p7", "Airtel") - 6, a("s03p7", "Airtel") + 6);
  const emp = (at: number) => ease(f, at, at + 10, outQuint);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        <ChartTitle f={f} at={-100}/>
        <EbitdaChart f={f} jioAt={-200} airAt={-200} diffAt={-100} braceAt={-100} catchAt={catchAt}/>
        {/* p6: the assumption and the customer counts it rests on (small, supporting) */}
        {cardE > 0.001 && cardX > 0.01 ? (
          <div style={{position: "absolute", left: 215, top: 500, width: 380, boxSizing: "border-box", padding: "22px 26px 24px", transform: `translate(-50%, -50%) translateX(${(1 - cardE) * -420}px) rotate(-1deg)`,
            opacity: clamp01(cardE * 2) * cardX, background: C.white, boxShadow: "0 3px 4px rgba(30,20,10,0.16), 0 18px 34px rgba(30,20,10,0.2)"}}>
            <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 22, color: C.rust, letterSpacing: 2}}>THE SIMPLE ASSUMPTION</div>
            <div style={serif(36, {color: C.ink, lineHeight: 1.1, marginTop: 8})}>More customers → better economics per customer?</div>
            <div style={{marginTop: 16, fontFamily: F.sans, fontWeight: 600, fontSize: 20, color: C.inkSoft, letterSpacing: 1, opacity: ease(f, cu, cu + 8)}}>AVERAGE CUSTOMERS · FY26 · MILLION</div>
            {[{n: "RJIL · TELECOM", v: 506.3, c: C.teal}, {n: "AIRTEL · INDIA MOBILE", v: 367.4, c: C.ink}].map((r, i) => {
              const p = ease(f, cu + 4 + i * 8, cu + 26 + i * 8, outQuint);
              return (
                <div key={r.n} style={{marginTop: 10, opacity: clamp01(p * 3)}}>
                  <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 20, color: C.ink, letterSpacing: 1}}>{r.n}</div>
                  <div style={{display: "flex", alignItems: "center", gap: 12}}>
                    <div style={{height: 28, width: (r.v / 600) * 220 * p, background: r.c}}/>
                    <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 26, color: C.ink}}>{(r.v * p).toFixed(1)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
        {/* p7: what each emphasises, under its own EntityTag (narration claims; no figures) */}
        <div style={{position: "absolute", left: AX, top: BASE + 106, transform: `translate(-50%, -50%) translateY(${(1 - emp(a("s03p7", "Airtel"))) * 12}px)`, opacity: emp(a("s03p7", "Airtel")),
          fontFamily: F.sans, fontWeight: 600, fontSize: 28, color: C.inkSoft, whiteSpace: "nowrap"}}>emphasises higher-value customers</div>
        <div style={{position: "absolute", left: JX, top: BASE + 106, transform: `translate(-50%, -50%) translateY(${(1 - emp(a("s03p7", "Jio has"))) * 12}px)`, opacity: emp(a("s03p7", "Jio has")),
          fontFamily: F.sans, fontWeight: 600, fontSize: 28, color: C.inkSoft, whiteSpace: "nowrap"}}>has built extraordinary scale</div>
      </Layer>
      <SourceTag f={f} at={0} text="Jio RHP pp.34, 131 · Airtel AR 2025-26 p.180 · our calculations"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// 3c. cut to 100 equal rupee units; the entity changes to Jio Platforms (consolidated)
const c7: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const cam = camAt(f, [[0, 1.04, 960, 540], [d, 1.0, 960, 540, outCubic]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        <UnitGrid f={f} ghostAt={-20} fillAt={a("s03p8", "one hundred rupees")}/>
        <GridLabels f={f} chipAt={a("s03p8", "Jio's revenue") - 4} numAt={a("s03p8", "one hundred rupees")} revAt={a("s03p8", "rupees|+0.2")}/>
      </Layer>
      <SourceTag f={f} at={0} text="Illustration · Jio Platforms consolidated · RHP p.330"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

export const SHOTS03: Shot[] = [
  S("s03p1", 0, H0, c1, "s03-excerpts"),
  S("s03p2", "one hundred and nineteen|-0.35", MZ, c2, "s03-bar-jio"),
  S("s03p2", "Airtel's|-0.7", H0, c3, "s03-airtel-line"),
  S("s03p2", "mobile business|+0.45", H0, c4, "s03-bars"),
  S("s03p4", 0, PU, c5, "s03-definition"),
  S("s03p5", 0, H0, c6, "s03-catch"),
  S("s03p8", "first watch|-0.15", H0, c7, "s03-units"),
];
export const CUES03: SCue[] = [
  [W("s03p1", "estimates"), "highlighter", 0.5],
  [W("s03p2", "one hundred and nineteen"), "pop", 0.4],
  [W("s03p2", "one hundred and fifty"), "pop", 0.4],
  [W("s03p3", "thirty"), "click", 0.5],
  [W("s03p4", 0), "paper", 0.35],
  [W("s03p5", "catch"), "circle", 0.5],
  [W("s03p8", "one hundred rupees"), "pop", 0.4],
];
