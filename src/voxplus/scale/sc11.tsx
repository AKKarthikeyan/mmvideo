// Scene 11 | 8:30-9:30 | The footnote, explained (AK brief + 20 Oct review pass). Three shots, none of which starts on an empty frame:
//  A (s11p1) the real RHP p.132 page for under a second, then a push until the Net Leverage row fills ~70% of the frame; 0.36x lands.
//  B (s11p2) the real p.137 page for under a second, then the Note 2 crop; the exclusion words ("does not include deferred payment
//    liabilities and lease liabilities") are zoomed to ~60% of the frame width, centred and highlighted; then a pan to the March-2026 amount.
//  T (s11p3 .. end) one continuous shot: the reconciliation (same EBITDA denominator under two numerator boxes; the added category is
//    animated BEFORE the ratio moves 0.36x -> ~1.73x, our calculation) holds through s11p4; at s11p5 it shrinks to the top and the two
//    questions arrive beneath it; at s11p6 THE scene-04 calendar drops in over the fading questions (exact props); at s11p7 the heading and
//    the three steps arrive over the still-visible calendar, which then fades as they land.
// Figures (ledger jioipo.csv q14/q81/q82; RHP p.137 note 2; EBITDA 762,554 mn p.131/452; net debt 275,792 mn p.406; deferred payment
// liabilities 1,045,137 mn p.137/364) are shown in Rs crore: 27,579 / 1,04,514 / 76,255 (our unit conversion). No repayment timetable.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Layer, camAt} from "./kit/Camera";
import {SourceTag} from "./kit/Cards";
import {StickerLabel} from "./kit/Collage";
import {DocPage, docRectCentre} from "./kit/DocPage";
import {SCue} from "./kit/A01V4Cold";
import {SP, Shot} from "./kit/A01V4Parts";
import {Frame} from "./parts1011";
import {C, F, clamp01, ease, inOut, outCubic, spr, useTicks} from "./kit/tokens";
import {CashCalendar, ENTITY, EntityTag, PaymentMarker} from "./devices";
import {H0, PL, PU, S, W, useAt} from "./cue";

type R4 = [number, number, number, number];
const SHADOW = "0 3px 4px rgba(30,20,10,0.16), 0 18px 34px rgba(30,20,10,0.22)";

// ---------------------------------------------------------------------------------------------------------------------
// A (s11p1): the real page 132, briefly; then the Net Leverage row, big
// ---------------------------------------------------------------------------------------------------------------------
const P132 = {x: 960, y: 540, width: 700, imgW: 3060, imgH: 3960};
const ROW132: R4 = [561.1, 630.8, 1683, 49.8], NET132: R4 = [561.1, 630.8, 243.6, 49.8], V132: R4 = [2142.4, 630.8, 101.6, 49.8];
const A: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const rc = docRectCentre({...P132, rot: 0}, ROW132);
  const t = ease(f, a("s11p1", "zero") + 6, a("s11p1", "zero") + 24, outCubic);
  return (
    <Frame f={f} d={d} tone="cream" cam={[[0, 1.0, 960, 540], [24, 1.0, 960, 540], [54, 3.4, rc.x, rc.y + 40, inOut], [d, 3.45, rc.x, rc.y + 40]]}
      over={(
        <>
          <SourceTag f={f} at={-20} text="RHP p.132 · key performance indicators"/>
          <div style={{position: "absolute", left: 960, top: 800, transform: `translate(-50%, -50%) scale(${0.88 + 0.12 * t})`, opacity: t, textAlign: "center", background: C.white,
            padding: "10px 60px 16px", boxShadow: SHADOW}}>
            <div style={{fontFamily: F.serif, fontWeight: 400, fontSize: 124, color: C.ink, lineHeight: 1}}>0.36×</div>
            <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 28, color: C.grey, letterSpacing: 2, marginTop: 4}}>NET DEBT ÷ EBITDA · AS REPORTED</div>
          </div>
          <EntityTag f={f} at={a("s11p1", "zero") + 8} text={ENTITY.jioPlat} period="FY26" x={960} y={690} anchor="center" size={26}/>
        </>
      )}>
      <DocPage f={f} src="scale/docs/sc11_rhp132_page.png" imgW={P132.imgW} imgH={P132.imgH} x={P132.x} y={P132.y} width={P132.width} stack={1}
        highlights={[{rects: [NET132], at: a("s11p1", "net") + 6, dur: 14}, {rects: [V132], at: a("s11p1", "zero"), dur: 10}]}/>
    </Frame>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// B (s11p2): the real page 137, briefly; the Note 2 crop; the exclusion words large and centred; then the March-2026 amount
// ---------------------------------------------------------------------------------------------------------------------
const P137 = {x: 960, y: 540, width: 1180, imgW: 2376, imgH: 1836};
const NOTE = {w: 4152, h: 385, W: 1560, ex: [820.6, 112.0, 1263.8, 53.4] as R4, amt: [2231.2, 167.4, 340.8, 53.4] as R4};
const noteC = (r: R4) => docRectCentre({x: 960, y: 540, width: NOTE.W, imgW: NOTE.w, imgH: NOTE.h, rot: 0}, r);
const B: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tCrop = a("s11p2", "definition") + 4;
  const dim = 0.5 * ease(f, tCrop - 2, tCrop + 8);
  const ec = noteC(NOTE.ex), ac = noteC(NOTE.amt);
  const tEx = a("s11p2", "excludes"), tAmt = a("s11p2", "money");
  const cam = camAt(f, [[0, 1.0, 960, 540], [tEx - 22, 1.0, 960, 540], [tEx + 6, 2.45, ec.x, ec.y, inOut], [tAmt - 6, 2.45, ec.x, ec.y], [tAmt + 16, 2.9, ac.x - 60, ac.y, inOut]]);
  return (
    <Frame f={f} d={d} tone="cream" cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}
      over={(
        <>
          <AbsoluteFill style={{background: `rgba(14,14,14,${dim})`}}/>
          <AbsoluteFill>
            <Layer cam={cam}>
              <DocPage f={f} src="scale/docs/sc11_rhp137_note2.png" imgW={NOTE.w} imgH={NOTE.h} x={960} y={540} width={NOTE.W} rot={0}
                enter={{at: tCrop, mode: "drop", dur: 12}}
                highlights={[{rects: [NOTE.ex], at: tEx, dur: a("s11p2", "liabilities") + 12 - tEx}, {rects: [NOTE.amt], at: tAmt + 8, dur: 14}]}/>
            </Layer>
          </AbsoluteFill>
          <SourceTag f={f} at={-20} until={tCrop} text="RHP p.137 · peer comparison table"/>
          <SourceTag f={f} at={tCrop + 6} text="RHP p.137 · note 2 (excerpt)"/>
          <EntityTag f={f} at={tAmt + 6} text={ENTITY.jioPlat} period="AT 31 MAR 2026" x={960} y={800} anchor="center" size={28}/>
        </>
      )}>
      <DocPage f={f} src="scale/docs/sc11_rhp137_page.png" imgW={P137.imgW} imgH={P137.imgH} x={P137.x} y={P137.y} width={P137.width} stack={1}/>
    </Frame>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// T (s11p3 .. s11p7): reconciliation -> questions -> calendar -> three steps, one continuous shot
// ---------------------------------------------------------------------------------------------------------------------
const box = (extra: React.CSSProperties): React.CSSProperties => ({position: "absolute", boxShadow: "0 3px 4px rgba(30,20,10,0.16), 0 14px 28px rgba(30,20,10,0.18)", ...extra});
const CX = [520, 1400], CW = 700;
const Q: React.FC<{f: number; at: number; x: number; y: number; n: string; text: string; rot?: number}> = ({f, at, x, y, n, text, rot = 0}) => {
  const e = spr(f, at, 13, 160);
  if (e <= 0.001) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, width: 700, padding: "30px 44px", transform: `translate(-50%, -50%) translateY(${(1 - e) * 240}px) rotate(${rot}deg)`, opacity: clamp01(e * 2),
      background: C.white, boxShadow: SHADOW}}>
      <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 28, color: C.teal, letterSpacing: 2}}>{n}</div>
      <div style={{fontFamily: F.serif, fontWeight: 400, fontSize: 56, color: C.ink, lineHeight: 1.08, marginTop: 8}}>{text}</div>
    </div>
  );
};
const Part: React.FC<{f: number; at: number; y: number; text: string; rot?: number}> = ({f, at, y, text, rot = 0}) => {
  const e = spr(f, at, 13, 170);
  if (e <= 0.001) return null;
  return (
    <div style={{position: "absolute", left: 290, top: y, width: 460, padding: "26px 34px", transform: `translate(-50%, -50%) translateX(${(1 - e) * -260}px) rotate(${rot}deg)`, opacity: clamp01(e * 2),
      background: C.white, boxShadow: SHADOW, borderLeft: `10px solid ${C.teal}`}}>
      <div style={{fontFamily: F.serif, fontWeight: 400, fontSize: 44, color: C.ink, lineHeight: 1.08}}>{text}</div>
    </div>
  );
};
const Step: React.FC<{f: number; at: number; x: number; n: string; text: string; sub: string}> = ({f, at, x, n, text, sub}) => {
  const e = spr(f, at, 13, 160);
  if (e <= 0.001) return null;
  return (
    <div style={{position: "absolute", left: x, top: 570, width: 480, height: 260, transform: `translate(-50%, -50%) translateY(${(1 - e) * 200}px)`, opacity: clamp01(e * 2),
      background: C.white, boxShadow: SHADOW, padding: "30px 34px", boxSizing: "border-box"}}>
      <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 28, color: C.teal, letterSpacing: 2}}>{n}</div>
      <div style={{fontFamily: F.serif, fontWeight: 400, fontSize: 52, color: C.ink, lineHeight: 1.06, marginTop: 10}}>{text}</div>
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 26, color: C.grey, marginTop: 14}}>{sub}</div>
    </div>
  );
};

const T: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  // reconciliation timeline
  const tAdd = a("s11p3", "obligations") - 2, add = spr(f, tAdd, 13, 170);
  const tRatio = a("s11p3", "becomes") + 4, pr = ease(f, tRatio, tRatio + 34, inOut);
  const ratioB = 0.36 + (1.73 - 0.36) * pr;
  const h2 = ease(f, a("s11p3", "obligations") - 6, a("s11p3", "obligations") + 8, outCubic);
  const arrowOn = ease(f, tRatio - 4, tRatio + 8);
  const tDef = a("s11p4", "definition"), t5 = a("s11p5", 0);
  const sh = ease(f, a("s11p5", "understand") - 10, a("s11p5", "understand") + 10, inOut);   // reconciliation shrinks to the top
  const t6 = a("s11p6", 0), t7 = a("s11p7", 0), tWhat = a("s11p7", "what");
  const outR = 1 - ease(f, t6, t6 + 16);                                                      // reconciliation + questions leave as the calendar lands
  const outCal = 1 - ease(f, tWhat - 10, tWhat + 6);                                           // calendar + parts leave as the first step lands
  return (
    <Frame f={f} d={d} tone="cream" cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}
      over={(
        <>
          <SourceTag f={f} at={-20} until={t6} text="RHP pp.132, 137, 364 · FY26 · ₹ crore"/>
          <SourceTag f={f} at={t6 + 6} until={tWhat - 8} text="Concept · cash calendar"/>
          <SourceTag f={f} at={tWhat} text="Moat & Margin · connecting the three"/>
        </>
      )}>
      {/* --- reconciliation (visible from the first frame), shrinking to the top at s11p5 --- */}
      <div style={{position: "absolute", inset: 0, opacity: outR, transformOrigin: "960px 100px", transform: `scale(${1 - 0.5 * sh})`}}>
        <div style={{position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", fontFamily: F.serif, fontWeight: 400, fontSize: 58, color: C.ink, letterSpacing: 2, opacity: 1 - h2}}>
          REPORTED NET DEBT ÷ EBITDA</div>
        <div style={{position: "absolute", left: 0, right: 0, top: 80, textAlign: "center", fontFamily: F.serif, fontWeight: 400, fontSize: 58, color: C.ink, letterSpacing: 2, opacity: h2}}>
          INCLUDING <span style={{color: C.teal}}>DEFERRED SPECTRUM LIABILITIES</span></div>
        <div style={{position: "absolute", left: 0, right: 0, top: 166, textAlign: "center", fontFamily: F.sans, fontWeight: 600, fontSize: 26, color: C.grey, letterSpacing: 3}}>
          SAME DENOMINATOR FOR BOTH · BOXES NOT TO SCALE</div>
        <EntityTag f={f} at={-12} text={ENTITY.jioPlat} period="FY26" x={170} y={226} size={24}/>

        {CX.map((cx, i) => (
          <div key={i} style={box({left: cx - CW / 2, top: 365, width: CW, height: 170, background: C.white, borderLeft: `14px solid ${C.ink}`, padding: "26px 40px", boxSizing: "border-box"})}>
            <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 30, color: C.grey, letterSpacing: 1}}>Reported net debt</div>
            <div style={{fontFamily: F.serif, fontWeight: 400, fontSize: 66, color: C.ink, lineHeight: 1.1, marginTop: 6}}>₹27,579 crore</div>
          </div>
        ))}
        {add > 0.01 ? (
          <div style={box({left: CX[1] - CW / 2, top: 244, width: CW, height: 112, background: C.rust, opacity: clamp01(add * 2), transform: `translateY(${(1 - add) * -140}px)`, padding: "14px 40px", boxSizing: "border-box"})}>
            <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 28, color: C.white, letterSpacing: 1}}>+ Deferred spectrum liabilities</div>
            <div style={{fontFamily: F.serif, fontWeight: 400, fontSize: 54, color: C.white, lineHeight: 1.1, marginTop: 2}}>₹1,04,514 crore</div>
          </div>
        ) : null}

        {CX.map((cx, i) => <div key={i} style={{position: "absolute", left: cx - CW / 2, top: 560, width: CW, height: 6, background: C.ink}}/>)}
        <div style={box({left: CX[0] - CW / 2, top: 590, width: CX[1] - CX[0] + CW, height: 96, background: C.ink, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px 0 44px", boxSizing: "border-box"})}>
          <span style={{fontFamily: F.serif, fontWeight: 400, fontSize: 48, color: C.white}}>EBITDA · ₹76,255 crore</span>
        </div>
        <EntityTag f={f} at={-12} text={ENTITY.jioPlat} period="FY26" x={CX[1] + CW / 2 - 30} y={638} anchor="right" dark size={24}/>

        <div style={{position: "absolute", left: CX[0], top: 780, transform: "translate(-50%, -50%)", fontFamily: F.serif, fontWeight: 400, fontSize: 132, color: C.ink, lineHeight: 1, fontVariantNumeric: "tabular-nums"}}>0.36×</div>
        <div style={{position: "absolute", left: CX[1], top: 780, transform: "translate(-50%, -50%)", fontFamily: F.serif, fontWeight: 400, fontSize: 132, lineHeight: 1, color: pr > 0.02 ? C.rust : C.ink,
          fontVariantNumeric: "tabular-nums"}}>{pr > 0.02 ? "~" : ""}{ratioB.toFixed(2)}×</div>
        <div style={{position: "absolute", left: 960, top: 780, transform: "translate(-50%, -50%)", opacity: arrowOn, fontFamily: F.serif, fontWeight: 400, fontSize: 90, color: C.teal}}>→</div>
        <div style={{position: "absolute", left: CX[0], top: 862, transform: "translateX(-50%)", fontFamily: F.sans, fontWeight: 600, fontSize: 30, color: C.grey, letterSpacing: 2}}>AS REPORTED</div>
        <div style={{position: "absolute", left: CX[1], top: 862, transform: "translateX(-50%)", opacity: ease(f, tRatio, tRatio + 12), fontFamily: F.sans, fontWeight: 600, fontSize: 30, color: C.grey,
          letterSpacing: 2, whiteSpace: "nowrap"}}>WITH DEFERRED SPECTRUM LIABILITIES</div>
        <div style={{position: "absolute", left: 0, right: 0, top: 912, textAlign: "center", opacity: ease(f, tRatio + 20, tRatio + 36), fontFamily: F.sans, fontWeight: 600, fontSize: 28, color: C.ink,
          whiteSpace: "nowrap"}}>Same period and denominator · Adjusted ratio: our calculation · lease liabilities not added</div>
        <StickerLabel f={f} text="Same business · different definition" x={520} y={292} size={34} rot={-1.5} bg={C.teal} color={C.white}
          enter={{at: tDef - 2, mode: "pop", rot0: -6}} exit={{at: t5}}/>
        <StickerLabel f={f} text="Disclosed in the prospectus" x={520} y={292} size={34} rot={1.5} bg={C.ink} color={C.white}
          enter={{at: a("s11p5", "disclosed") - 2, mode: "pop", rot0: 6}}/>
      </div>
      <div style={{position: "absolute", inset: 0, opacity: outR}}>
        <Q f={f} at={a("s11p5", "understand") - 4} x={520} y={750} n="WHAT IT INCLUDES" text="What does each measure include?" rot={-1.2}/>
        <Q f={f} at={a("s11p5", "when") - 4} x={1400} y={750} n="WHEN IT FALLS DUE" text="When do the payments fall due?" rot={1.2}/>
        <div style={{position: "absolute", left: 1400, top: 905, transform: "translateX(-50%)", opacity: ease(f, a("s11p5", "payments") + 12, a("s11p5", "payments") + 26), fontFamily: F.sans, fontWeight: 600,
          fontSize: 28, color: C.grey, whiteSpace: "nowrap"}}>Repayment schedule not shown here</div>
      </div>

      {/* --- THE scene-04 calendar (same component, same props) + three parts of the picture --- */}
      <div style={{position: "absolute", inset: 0, opacity: outCal}}>
        <CashCalendar f={f} at={t6} x={960} y={520} w={760} title="Cash payments"/>
        <Part f={f} at={a("s11p6", "Subscriber") - 4} y={290} text="Subscriber growth" rot={-1}/>
        <Part f={f} at={a("s11p6", "reported") - 4} y={520} text="Reported profit" rot={0.8}/>
        <Part f={f} at={a("s11p6", "debt") - 4} y={750} text="A debt ratio" rot={-0.6}/>
        <StickerLabel f={f} text="Each shows part" x={1600} y={520} size={46} rot={2} dark enter={{at: a("s11p6", "part") - 2, mode: "pop", rot0: 8}}/>
      </div>

      {/* --- connect the three --- */}
      <div style={{position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", fontFamily: F.serif, fontWeight: 400, fontSize: 56, color: C.ink, letterSpacing: 2,
        opacity: ease(f, a("s11p7", "connect") - 4, a("s11p7", "connect") + 8)}}>CONNECT THE THREE</div>
      {[0, 1].map((i) => {
        const X = [360, 960, 1560], w = a("s11p7", i === 0 ? "reinvested" : "owed");
        const lp = ease(f, w - 10, w + 6, outCubic);
        if (lp <= 0) return null;
        return (
          <svg key={i} width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
            <line x1={X[i] + 250} y1={570} x2={X[i] + 250 + (X[i + 1] - X[i] - 500) * lp} y2={570} stroke={C.teal} strokeWidth={8} strokeLinecap="round" strokeDasharray="1 18"/>
          </svg>
        );
      })}
      <Step f={f} at={tWhat - 4} x={360} n="1" text="What comes in" sub="Revenue · EBITDA"/>
      <Step f={f} at={a("s11p7", "must") - 8} x={960} n="2" text="What must be reinvested" sub="Cash capex"/>
      <Step f={f} at={a("s11p7", "still") - 8} x={1560} n="3" text="What is still owed" sub="Debt · deferred payments"/>
      <PaymentMarker f={f} at={tWhat + 2} dur={a("s11p7", "owed") - tWhat + 4} path={[[360, 400], [960, 400], [1560, 400]]} size={60}/>
    </Frame>
  );
};

export const SHOTS11: Shot[] = [
  S("s11p1", 0, H0, A, "s11-a"),
  S("s11p2", 0, PL, B, "s11-b"),
  S("s11p3", 0, PU, T, "s11-t"),
];
export const CUES11: SCue[] = [
  [W("s11p1", "zero"), "pop", 0.3], [W("s11p2", "excludes"), "highlighter", 0.4], [W("s11p3", "obligations"), "paper", 0.35], [W("s11p3", "becomes"), "ding", 0.35],
  [W("s11p6", "calendar"), "paper", 0.35],
];
