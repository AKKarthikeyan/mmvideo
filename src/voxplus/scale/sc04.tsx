// Scene 04 | A payment becomes an accounting picture (review pass 20 Oct 2026): the same 100 rupee units, then TWO FULL-SIZE stages on
// charcoal: stage 1 ₹100 -> ~₹50 (EBITDA excluding other income: network ~26 incl. rent, licence & spectrum ~8, staff/selling/other ~16
// = 4.5 + 3.1 + 1.1 + 7.2), stage 2 ~₹50 -> ~₹20.5 (-18.6 depreciation/amortisation, -5.9 finance costs, -7.0 tax, +2.0 other income);
// a short combined summary (₹100 -> ~₹50 -> ~₹20.5) which becomes a small card; the CashCalendar ("Cash payments", centred 960/520/760);
// and a network spend line running into a large real tower photo. Not a cash-flow waterfall. Tag: JIO PLATFORMS · CONSOLIDATED | FY26.
// Sources: Jio Platforms RHP restated P&L FY26 (p.330, notes 28 and 32), ledger rows q43/q44; arithmetic = our calculation.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Layer, camAt} from "./kit/Camera";
import {SourceTag} from "./kit/Cards";
import {PhotoPrint, StickerLabel} from "./kit/Collage";
import {SCue} from "./kit/A01V4Cold";
import {Paper, SP, Shot} from "./kit/A01V4Parts";
import {Finish, InkSurface} from "./kit/Texture";
import {C, F, clamp01, ease, inOut, outQuint, useTicks} from "./kit/tokens";
import {CashCalendar, PaymentMarker, RechargePhone} from "./devices";
import {H0, MZ, S, W, useAt} from "./cue";
import {GridLabels, L1, L2, StageBridge, StageHead, SummaryBig, SummaryCard, UnitGrid, serif, stage1Steps, stage2Steps} from "./parts34";

// p1: the same 100 units and labels as the end of scene 03 (the cut is invisible), then "not your individual recharge"
const d1: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const cam = camAt(f, [[0, 1.0, 960, 540], [d, 1.03, 1000, 540]]);
  const ph = a("s04p1", "literal"), ph2 = a("s04p1", "individual");
  const ne = ease(f, ph2, ph2 + 10, outQuint);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        <UnitGrid f={f} ghostAt={-200} fillAt={-200}/>
        <GridLabels f={f} chipAt={-100} numAt={-100} revAt={-100}/>
        <RechargePhone f={f} x={215} y={560} s={0.4} enterAt={ph} rot={-3}/>
        <div style={{position: "absolute", left: 345, top: 560, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * ne})`, opacity: ne, ...serif(100, {color: C.rust})}}>≠</div>
        <div style={{position: "absolute", left: 215, top: 820, transform: "translate(-50%, -50%)", opacity: ease(f, ph + 10, ph + 22), fontFamily: F.sans, fontWeight: 800, fontSize: 30, color: C.inkSoft,
          whiteSpace: "nowrap"}}>Your recharge</div>
      </Layer>
      <SourceTag f={f} at={0} text="Illustration · Jio Platforms consolidated · FY26 · RHP p.330"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// stage 1 (p2-p3), FULL SIZE: ₹100 -> ~₹50. Each bar starts on its spoken number; the completed stage is held.
const d2: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = [-12, a("s04p2", "twenty"), a("s04p2", "Eight"), a("s04p2", "another"), a("s04p3", "fifty")];
  const cam = camAt(f, [[0, 1.0, 960, 540], [d, 1.02, 960, 540]]);
  return (
    <AbsoluteFill>
      <InkSurface glow={0.08}/>
      <Layer cam={cam}>
        <StageHead f={f} from="₹100" to="~₹50" cap="REVENUE → EBITDA EXCLUDING OTHER INCOME" toAt={t[4]}/>
        <StageBridge f={f} steps={stage1Steps((i) => t[i])} lay={L1} emph={4} emphAt={t[4] + 16}/>
      </Layer>
      <SourceTag f={f} at={0} dark text="Jio Platforms RHP · restated P&L FY26 · p.330 · notes 28, 32 · our calculation"/>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};

// stage 2 (p4-p5), FULL SIZE: ~₹50 -> ~₹20.5 (zero-based; scale enlarged so the labels stay large)
const d3: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = [-12, a("s04p4", "assets"), a("s04p4", "financing"), a("s04p4", "tax"), a("s04p4", "other income"), a("s04p5", "Net")];
  const cam = camAt(f, [[0, 1.0, 960, 540], [d, 1.02, 960, 540]]);
  return (
    <AbsoluteFill>
      <InkSurface glow={0.08}/>
      <Layer cam={cam}>
        <StageHead f={f} from="~₹50" to="~₹20.5" cap="EBITDA EXCLUDING OTHER INCOME → NET PROFIT" toAt={t[5]} note="Scale enlarged · starts from ₹50"/>
        <StageBridge f={f} steps={stage2Steps((i) => t[i])} lay={L2} emph={5} emphAt={t[5] + 16}/>
      </Layer>
      <SourceTag f={f} at={0} dark text="Jio Platforms RHP · restated P&L FY26 · p.330 · notes 28, 30, 32 · our calculation"/>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};

// combined summary (p5 end) -> small card + cash calendar (p6) -> network line into a large tower photo (p7)
const d4: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const cardAt = a("s04p6", "timing");
  const big = 1 - ease(f, cardAt - 6, cardAt + 8);                      // the big summary hands over to the card
  const bg = ease(f, cardAt - 6, cardAt + 14, inOut);                   // charcoal -> paper
  const cal = a("s04p6", "cash") + 2;
  const first = a("s04p7", "First"), out = ease(f, first, first + 14, inOut);
  const T = (k: string, p: string) => a(k, p);
  // network line: the filled part of the strip -> into the tower photo
  const sx = 60, sw = 500, sy = 700, fx = sx + 0.26 * sw;
  const lineAt = first + 16, lp = ease(f, lineAt, lineAt + 40, inOut);
  const path: [number, number][] = [[fx, sy + 22], [fx + 160, sy + 22], [560, 600], [730, 530]];
  const pl = path.map((q) => q.join(",")).join(" ");
  const photoAt = first - 2;
  return (
    <AbsoluteFill>
      <InkSurface glow={0.08}/>
      <div style={{position: "absolute", inset: 0, opacity: bg}}><Paper drift={f / d}/></div>
      <div style={{opacity: big}}>
        <SummaryBig f={f} at={[-10, 4, 16]}/>
      </div>
      <SummaryCard f={f} at={cardAt} x={40} y={190}/>
      <div style={{position: "absolute", left: 40 + 270, top: 190 + 345 + 6, transform: "translate(-50%, -50%)", opacity: ease(f, cardAt + 18, cardAt + 30), fontFamily: F.sans, fontWeight: 800, fontSize: 28, color: C.ink,
        whiteSpace: "nowrap"}}>Accounting view</div>
      {/* p6: cash timing on the calendar (conceptual: no amounts, no dates) */}
      <div style={{opacity: 1 - out, transform: `translateY(${out * 700}px)`}}>
        <CashCalendar f={f} at={cal} x={960} y={520} w={760} title="Cash payments" rot={1.5}
          marks={[{i: 0, at: T("s04p6", "today"), color: C.ink}, {i: 1, at: T("s04p6", "acquired"), color: C.teal},
            {i: 4, at: T("s04p6", "instalments"), color: C.rust}, {i: 7, at: T("s04p6", "instalments") + 8, color: C.rust}, {i: 10, at: T("s04p6", "instalments") + 16, color: C.rust}]}/>
      </div>
      <div style={{opacity: 1 - out}}>
        <StickerLabel f={f} text="Equipment bought today" x={300} y={650} size={32} rot={-2} dark enter={{at: T("s04p6", "bought"), mode: "pop", rot0: -8}}/>
        <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
          <rect x={90} y={712} width={84} height={84} fill={C.ink} opacity={ease(f, T("s04p6", "today"), T("s04p6", "today") + 8)}/>
          <text x={132} y={770} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={44} fill={C.white} opacity={ease(f, T("s04p6", "today"), T("s04p6", "today") + 8)}>₹</text>
          <text x={208} y={770} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={44} fill={C.grey} opacity={ease(f, T("s04p6", "depreciated"), T("s04p6", "depreciated") + 8)}>→</text>
          {[0, 1, 2, 3, 4].map((i) => {
            const p = ease(f, T("s04p6", "depreciated") + 6 + i * 9, T("s04p6", "depreciated") + 16 + i * 9, outQuint);
            return <rect key={i} x={242 + i * 58} y={738 + (1 - p) * 20} width={46} height={46 * p + 0.01} fill={C.teal} opacity={p}/>;
          })}
        </svg>
        <div style={{position: "absolute", left: 300, top: 850, transform: "translate(-50%, -50%)", opacity: ease(f, T("s04p6", "depreciated") + 40, T("s04p6", "depreciated") + 52),
          fontFamily: F.sans, fontWeight: 600, fontSize: 26, color: C.inkSoft, whiteSpace: "nowrap"}}>Depreciation spreads the cost over years</div>
        <StickerLabel f={f} text="Spectrum acquired" x={1640} y={400} size={32} rot={2} bg={C.teal} color={C.white} enter={{at: T("s04p6", "acquired"), mode: "pop", rot0: 8}}/>
        <StickerLabel f={f} text="Instalments still to pay" x={1640} y={490} size={32} rot={-2} bg={C.rust} color={C.white} enter={{at: T("s04p6", "instalments"), mode: "pop", rot0: -8}}/>
      </div>
      {/* p7: a large real tower photo; the network spend line runs into it */}
      <PhotoPrint f={f} src="jio/media/tower_in_rooftop_cluster_print.jpg" x={1210} y={520} w={1240} h={740} rot={1} border={16} halftone={0.1}
        caption="Mobile towers on a rooftop, Kerala · Photo: Suresh Babunair, CC BY 3.0" enter={{at: photoAt, mode: "drop", dur: 10}} crop={{s0: 1.1, s1: 1.0, fx: 0.5, fy: 0.4, dur: 120}}/>
      {f > first + 6 ? <>
        <StickerLabel f={f} text="Network ~₹26 per ₹100" x={310} y={596} size={30} rot={-2} bg={C.rust} color={C.white} enter={{at: first + 8, mode: "pop", rot0: -6}}/>
        <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <rect x={sx} y={sy} width={sw} height={44} fill="none" stroke={C.ink} strokeWidth={3} opacity={ease(f, first + 6, first + 16)}/>
          <rect x={sx} y={sy} width={sw * 0.26 * ease(f, first + 8, first + 22)} height={44} fill={C.rust}/>
          <text x={sx} y={sy + 82} fontFamily={F.sans} fontWeight={600} fontSize={24} fill={C.inkSoft} opacity={ease(f, first + 14, first + 24)}>₹100 of revenue</text>
          {lp > 0 ? <polyline points={pl} fill="none" stroke={C.rust} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lp}/> : null}
        </svg>
        <PaymentMarker f={f} at={lineAt + 6} dur={48} path={path} size={54} trail={false}/>
      </> : null}
      <SourceTag f={f} at={0} until={first} dark={f < cardAt} text="Illustration · the calendar shows no amounts or dates"/>
      <SourceTag f={f} at={first + 10} text="Network operating expenses · RHP p.330 · our calculation"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

export const SHOTS04: Shot[] = [
  S("s04p1", 0, H0, d1, "s04-units"),
  S("s04p2", 0, MZ, d2, "s04-stage1"),
  S("s04p4", 0, H0, d3, "s04-stage2"),
  S("s04p5", "twenty|-0.1", H0, d4, "s04-summary-cash"),
];
export const CUES04: SCue[] = [
  [W("s04p2", "twenty"), "pop", 0.35],
  [W("s04p3", "fifty"), "click", 0.45],
  [W("s04p5", "Net"), "ding", 0.5],
  [W("s04p6", "cash"), "paper", 0.4],
  [W("s04p7", "network"), "click", 0.45],
];
