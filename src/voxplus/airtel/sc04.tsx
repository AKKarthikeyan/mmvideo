// Scene 04 | Suspect one: price (DRAFT2, 7 Nov 2026). p1: PRICE card raised; chip NO DATED TARIFF INCREASE IN THE FILINGS, then two text quote cards
// from Airtel's own recording of the Q2 FY27 call (management says; our transcription of the company's official audio, never played): pricing
// intervention (00:22:16), temporary effect on customer continuity (00:44:25). p2: ARPU was rising before it: Q3 FY26 filed transcript (6 Feb 2026,
// p.4) "in the absence of tariff repair"; HOW MUCH OF THE LIFT IS THE NEW MOVE? NOT DISCLOSED. p3: PRICE: A REAL SUSPECT, NOT THE ONLY ONE; stamp NOT SEPARABLE.
// (The Hexacom-session postpaid Rs 50 answer, 01:04:25, was removed after the final check: it is Bharti Hexacom's call, not Airtel's.)
import React from "react";
import {SourceTag} from "./kit/Cards";
import {SCue} from "./kit/A01V4Cold";
import {SP, Shot, Stamp} from "./kit/A01V4Parts";
import {C, useTicks} from "./kit/tokens";
import {QuoteCard, SuspectCards} from "./devices_airtel";
import {H0, S, W, useAt} from "./cue";
import {Chip, PullQuote, Stage} from "./parts0104";

const HEAD = "MANAGEMENT SAYS · Q2 FY27 CALL · OUR TRANSCRIPTION OF THE COMPANY'S OFFICIAL AUDIO";

const filings: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const one = a("s04p1", "Suspect one"), nf = a("s04p1", "no dated tariff");
  return (
    <Stage f={f} d={d}>
      <Chip f={f} at={one} text="SUSPECT ONE: PRICE" x={960} y={140} size={44}/>
      <Chip f={f} at={nf} text="NO DATED TARIFF INCREASE IN THE FILINGS" x={960} y={400} size={54} bg={C.rust}/>
      <SuspectCards f={f} at={-200} active="PRICE"/>
      <SourceTag f={f} at={0} text="Illustration · our search of Airtel's documents (no dated tariff increase found)"/>
    </Stage>
  );
};

const tq = (beat: string, phrase: string, pull: string, quote: string, src: string, imgH = 260): React.FC<SP> => ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Stage f={f} d={d}>
      <Chip f={f} at={0} text={HEAD} x={960} y={108} size={24} bg={C.paperDeep} color={C.ink}/>
      <PullQuote f={f} at={a(beat, phrase)} text={pull} y={160} size={44}/>
      <QuoteCard f={f} at={0} x={960} y={465} w={1200} imgW={1200} imgH={imgH} quote={quote} speaker="Airtel management" source={src}/>
      <SuspectCards f={f} at={-200} active="PRICE"/>
      <SourceTag f={f} at={0} text={"Airtel Q2 FY27 earnings call, 6 Nov 2026 · " + src.split("· ")[1]}/>
    </Stage>
  );
};
const qA = tq("s04p1", "But in Airtel's own", "A PRICING INTERVENTION IN THE QUARTER", "“…the intervention that we have taken on pricing… has already kind of played out.”", "Q2 FY27 call · 00:22:16");
const qB = tq("s04p1", "It also says", "THE SAME MOVE: A TEMPORARY RISE IN CHURN", "“…the pricing intervention that we took, where there is always a temporary impact on customer continuity.”", "Q2 FY27 call · 00:44:25");

const qC: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Stage f={f} d={d}>
      <Chip f={f} at={0} text="MANAGEMENT SAYS · Q3 FY26 CALL · AIRTEL'S FILED TRANSCRIPT" x={960} y={108} size={24} bg={C.paperDeep} color={C.ink}/>
      <PullQuote f={f} at={a("s04p2", "But ARPU was rising")} text="ARPU WAS RISING BEFORE THE NEW MOVE" y={160} size={44}/>
      <Chip f={f} at={a("s04p2", "And it does not say")} text="HOW MUCH OF THE LIFT IS THE NEW MOVE? NOT DISCLOSED" x={960} y={268} size={30} bg={C.rust}/>
      <QuoteCard f={f} at={0} x={960} y={488} w={1200} imgW={1200} imgH={220} quote="“…in the absence of tariff repair, we will continue to sweat ARPU growth leveraging feature phone to smartphone upgrades, prepaid to postpaid upgrades, data monetization, and our international roaming services.”" speaker="Shashwat Sharma, CEO Airtel India" source="Q3 FY26 call · 6 Feb 2026"/>
      <SuspectCards f={f} at={-200} active="PRICE"/>
      <SourceTag f={f} at={0} text="Airtel Q3 FY26 earnings call transcript (call held 6 Feb 2026) · p.4"/>
    </Stage>
  );
};

const verdict: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const v = a("s04p3", "So price is"), ns = a("s04p3", "cannot say"), st = a("s04p3", "explains|+0.25");
  return (
    <Stage f={f} d={d}>
      <Chip f={f} at={v} text="PRICE: A REAL SUSPECT, NOT THE ONLY ONE" x={960} y={300} size={52}/>
      <Chip f={f} at={ns} text="THE FILINGS CANNOT SAY HOW MUCH" x={960} y={470} size={52} bg={C.rust}/>
      <SuspectCards f={f} at={-200} active={f >= st ? null : "PRICE"}/>
      {/* local stamp overlay (larger than the device's built-in stamp), lands on the PRICE card after the last spoken word */}
      <Stamp f={f} at={st} text="NOT SEPARABLE" x={448} y={868} size={40} rot={-6}/>
      <SourceTag f={f} at={0} text="Moat & Margin reading: analysis, not a filing fact"/>
    </Stage>
  );
};

export const SHOTS04: Shot[] = [
  S("s04p1", 0, H0, filings, "sc04-filings"),
  S("s04p1", "But in Airtel's own|-0.1", H0, qA, "sc04-qa"),
  S("s04p1", "It also says|-0.1", H0, qB, "sc04-qb"),
  S("s04p2", 0, H0, qC, "sc04-qc"),
  S("s04p3", 0, H0, verdict, "sc04-verdict"),
];
export const CUES04: SCue[] = [
  [W("s04p1", "no dated tariff"), "click", 0.35], [W("s04p1", "But in Airtel's own"), "paper", 0.4], [W("s04p1", "It also says"), "paper", 0.4],
  [W("s04p2", "But ARPU was rising"), "paper", 0.4], [W("s04p3", "explains|+0.25"), "stamp", 0.7],
];
