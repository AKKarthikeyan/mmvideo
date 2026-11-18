// Scene 11 | Return to the bill (9:25-10:15). (1) the three suspect cards (same SuspectCards position/props as scene 01) with stamps
// PRICE -> NOT SEPARABLE, MIX -> SMALL BUT REAL, CONVERGENCE -> BIG, NOT PAYING YET; (2) OUR ANALYSIS, NOT A FILING FACT card + the other reading;
// (3) the four-item watch list; (4) the opening BillCard (scene 01 defaults: x 960, y 540, s 1, rot -2) with Rs 271 alone and the cards behind it,
// one payment sound; (5) end card: sources and 'Information, not investment advice'. ARPU Rs 271 = ledger s11p4 (claim C30).
import React from "react";
import {SCue} from "./kit/A01V4Cold";
import {SP, Shot} from "./kit/A01V4Parts";
import {C, F, ease, outQuint, useTicks} from "./kit/tokens";
import {H0, PU, S, W, WL, useAt} from "./cue";
import {CardStamp, Suspect, SuspectCards} from "./devices_airtel";
import {BillPhone} from "./parts0104";
import {Card, Frame, Head, Mono} from "./parts0911";

const STAMPS = (f: number, a: (k: string, x?: number | string) => number): Partial<Record<Suspect, CardStamp>> => ({
  PRICE: {text: "NOT SEPARABLE", at: a("s11p1", "Airtel does not say") - 2},
  MIX: {text: "SMALL BUT REAL", at: a("s11p1", "Postpaid is real") - 2},
  CONVERGENCE: {text: "BIG, NOT PAYING YET", at: a("s11p1", "not yet paying") - 2},
});
const STATIC: Partial<Record<Suspect, CardStamp>> = {
  PRICE: {text: "NOT SEPARABLE", at: -40}, MIX: {text: "SMALL BUT REAL", at: -40}, CONVERGENCE: {text: "BIG, NOT PAYING YET", at: -40}};

const A11: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Frame f={f} d={d} chip="Moat & Margin · our reading of the filings" cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <Head f={f} at={0} a="AIRTEL · INDIA MOBILE · ARPU" b="WHICH SUSPECT?" y={250} size={120}/>
      <SuspectCards f={f} at={2} stamps={STAMPS(f, a)}/>
    </Frame>
  );
};

const B11: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t2 = a("s11p2", "Another reading") - 4;
  return (
    <Frame f={f} d={d} chip="Moat & Margin · analysis, not a reported metric" cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <Card f={f} at={-16} x={960} y={330} w={1500} h={270} strip="OUR ANALYSIS, NOT A FILING FACT" stripBg={C.markerRed}>
        <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 56, lineHeight: 1.12, color: C.ink}}>Moat shows more in <span style={{color: C.teal}}>pricing and scale</span><br/>than in <span style={{color: C.teal}}>proven stickiness</span></div>
      </Card>
      <Card f={f} at={t2} x={960} y={545} w={1500} h={130} grey>
        <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: C.inkSoft}}>ANOTHER READING: CONVERGENCE MAY BE AN INVESTMENT WITH A LATER PAYOFF</div>
      </Card>
      <SuspectCards f={f} at={-40} stamps={STATIC} dimOthers={false}/>
    </Frame>
  );
};

const ITEMS: [string, string, string?][] = [["Churn", "Churn"], ["Revenue and margin", "REVENUE AND MARGIN PER HOME"], ["next tariff", "NEXT TARIFF MOVE"], ["own filed transcript", "AIRTEL'S FILED CALL TRANSCRIPT", "CHECK THE WORDING"]];
const C11: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Frame f={f} d={d} chip="Moat & Margin · what to watch" cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <Head f={f} at={0} b="WHAT TO WATCH" y={150} size={72}/>
      {ITEMS.map(([ph, label, note], i) => {
        const t = a("s11p3", ph) - 4, k = ease(f, t, t + 12, outQuint);
        return (
          <div key={i} style={{position: "absolute", left: 300, top: 320 + i * 150, width: 1320, height: 120, background: C.white, borderRadius: 16, boxShadow: "0 12px 26px rgba(0,0,0,0.18)",
            opacity: k, transform: `translateX(${(1 - k) * 160}px)`, display: "flex", alignItems: "center", fontFamily: F.sans}}>
            <div style={{width: 110, textAlign: "center", fontWeight: 900, fontSize: 56, color: C.teal}}>{i + 1}</div>
            <div style={{fontWeight: 800, fontSize: 52, color: C.ink, letterSpacing: 1, flex: 1}}>{label.toUpperCase()}</div>
            {note ? <div style={{fontFamily: F.mono, fontSize: 26, color: C.grey, marginRight: 36, letterSpacing: 1}}>{note}</div> : null}
          </div>
        );
      })}
    </Frame>
  );
};

const D11: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Frame f={f} d={d} chip="Airtel Quarterly Report Q2 FY27 · p.17 (PDF p.19) · ARPU per month" cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <SuspectCards f={f} at={2} stamps={STATIC} dimOthers={false}/>
      <BillPhone f={f} x={960} y={395} s={0.58} amount="₹271" amountAt={a("s11p4", "two hundred and seventy one")} tapAt={a("s11p4", "a month|+0.1")} title="Monthly mobile bill"/>
    </Frame>
  );
};

const E11: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  return (
    <Frame f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <Head f={f} at={0} a="MOAT & MARGIN" b="AIRTEL'S MOAT: PRICE, MIX OR CONVERGENCE?" y={170} size={64}/>
      <Mono f={f} at={8} align="center" x={960} w={1500} y={470} size={30} color={C.inkSoft}
        text="SOURCES · BHARTI AIRTEL QUARTERLY REPORTS Q2 FY26, Q2 FY27 · AIRTEL EARNINGS-CALL TRANSCRIPTS · Q2 FY27 CALL: OUR TRANSCRIPTION OF THE COMPANY'S OFFICIAL AUDIO · TRAI PRESS RELEASES 104/2026, 140/2026"/>
      <Head f={f} at={16} b="INFORMATION, NOT INVESTMENT ADVICE" y={690} size={54} color={C.teal}/>
    </Frame>
  );
};

export const SHOTS11: Shot[] = [
  S("s11p1", 0, H0, (p) => <A11 {...p}/>, "sc11-verdict-cards"),
  S("s11p2", 0, PU, (p) => <B11 {...p}/>, "sc11-analysis"),
  S("s11p3", 0, WL, (p) => <C11 {...p}/>, "sc11-watch"),
  S("s11p4", 0, PU, (p) => <D11 {...p}/>, "sc11-bill"),
  S("s11p4", "lifting|+1.0", H0, (p) => <E11 {...p}/>, "sc11-end"),
];
export const CUES11: SCue[] = [[W("s11p1", "Airtel does not say"), "stamp", 0.6], [W("s11p1", "Postpaid is real"), "stamp", 0.6], [W("s11p1", "not yet paying"), "stamp", 0.6],
  [W("s11p2", 0), "paper", 0.35], [W("s11p4", "a month|+0.2"), "ding", 0.5]];
