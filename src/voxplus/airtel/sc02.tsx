// Scene 02 | Name the question. p1: the bill (same pose as the end of 01) shrinks away, Airtel's own ARPU definition (real crop of the Quarterly
// Report glossary, held ~4 s), then "377 MILLION" on the spoken figure. p2: three illustrated icons (scale / switching costs / pricing power).
// p3: the second icon is raised, MOBILE + BROADBAND + TV = CONVERGENCE (management says), CONVERGENCE card goes active. p4: three source chips.
// The three suspect cards stay in the position they had in scene 01 (settled, blank).
import React from "react";
import {DocPage} from "./kit/DocPage";
import {SourceTag} from "./kit/Cards";
import {SCue} from "./kit/A01V4Cold";
import {SP, Shot} from "./kit/A01V4Parts";
import {C, F, ease, inOut, outCubic, outQuint, spr, useTicks} from "./kit/tokens";
import {ENTITY, EntityTag} from "./devices";
import {SuspectCards} from "./devices_airtel";
import {H0, S, W, useAt} from "./cue";
import {BillPhone, Chip, IconDisc, MgmtTag, Stage, YearRows} from "./parts0104";

// p1 ---------------------------------------------------------------------------------------------------------------
const defn: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const eq = a("s02p1", "average revenue per user"), rep = a("s02p1", "Indian mobile business"), n377 = a("s02p1", "three hundred and seventy seven");
  const gone = ease(f, 0, 14, inOut);                 // bill + rows leave
  const out = ease(f, n377 - 8, n377 + 4, inOut);          // definition card leaves after its hold
  const cnt = Math.round(377 * ease(f, n377, n377 + 28, outQuint));
  const sp = spr(f, n377, 12, 170);
  return (
    <Stage f={f} d={d}>
      <BillPhone f={f} x={560} y={370} s={0.58 - 0.2 * gone} amount="₹271" amountAt={-200} tapAt={-100} fade={1 - gone}/>
      <YearRows f={f} at1={-200} at2={-200} fade={1 - gone}/>
      <div style={{position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-60 * out}px)`}}>
        <DocPage f={f} src="airtel/docs/sc02_arpu_def.png" imgW={1836} imgH={358} x={960} y={370} width={1360} rot={-0.4} stack={1} enter={{at: 14, mode: "slide-up"}}/>
        <Chip f={f} at={eq} text="ARPU = REVENUE ÷ AVERAGE CUSTOMERS ÷ MONTHS" x={960} y={600} size={38}/>
        <Chip f={f} at={eq + 4} text="AIRTEL'S OWN DEFINITION" x={960} y={150} size={26} bg={C.teal}/>
      </div>
      {n377 > 0 && f >= n377 ? (
        <div style={{position: "absolute", left: 960, top: 380, transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * sp})`, opacity: Math.min(1, sp * 3), textAlign: "center", fontFamily: F.sans, whiteSpace: "nowrap"}}>
          <div style={{fontWeight: 800, fontSize: 230, lineHeight: 1, color: C.teal}}>{cnt} <span style={{fontSize: 100, color: C.ink}}>MILLION</span></div>
        </div>) : null}
      <EntityTag f={f} at={n377} text={ENTITY.airtelMob} period="CUSTOMERS · SEP 2026" x={960} y={560} anchor="center" size={30}/>
      <SuspectCards f={f} at={-200}/>
      <SourceTag f={f} at={0} text="Airtel Q2 FY27 Quarterly Report · glossary p.54 · customers p.17"/>
    </Stage>
  );
};

// p2 ---------------------------------------------------------------------------------------------------------------
const three: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t1 = a("s02p2", "Scale"), t2 = a("s02p2", "Switching costs"), t3 = a("s02p2", "pricing power");
  return (
    <Stage f={f} d={d}>
      <Chip f={f} at={0} text="A TELECOM MOAT CAN COME FROM THREE PLACES" x={960} y={140} size={38}/>
      <IconDisc f={f} at={t1} x={360} y={400} kind="network" label="SCALE"/>
      <IconDisc f={f} at={t2} x={960} y={400} kind="door" label="SWITCHING COSTS"/>
      <IconDisc f={f} at={t3} x={1560} y={400} kind="tag" label="PRICING POWER"/>
      <SuspectCards f={f} at={-200}/>
      <SourceTag f={f} at={0} text="Illustration · the three sources of a moat"/>
    </Stage>
  );
};

// p3 ---------------------------------------------------------------------------------------------------------------
const pitch: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const second = a("s02p3", "the second"), mob = a("s02p3", "mobile,"), bb = a("s02p3", "broadband"), tv = a("s02p3", "TV"), conv = a("s02p3", "convergence"), test = a("s02p3", "So we tested");
  const sh = ease(f, second, second + 14, inOut);
  const plus = (at: number, x: number) => <div style={{position: "absolute", left: x, top: 420, transform: "translate(-50%, -50%)", opacity: ease(f, at, at + 8), fontFamily: F.sans, fontWeight: 800, fontSize: 70, color: C.ink}}>+</div>;
  return (
    <Stage f={f} d={d}>
      <div style={{position: "absolute", inset: 0, transform: `translateY(${-190 * sh}px) scale(${1 - 0.0 * sh})`}}>
        <IconDisc f={f} at={-200} x={360} y={400} d={240 - 90 * sh} kind="network" label="SCALE" dim={1 - 0.6 * sh}/>
        <IconDisc f={f} at={-200} x={960} y={400} d={240 - 90 * sh} kind="door" label="SWITCHING COSTS" on={f >= second}/>
        <IconDisc f={f} at={-200} x={1560} y={400} d={240 - 90 * sh} kind="tag" label="PRICING POWER" dim={1 - 0.6 * sh}/>
      </div>
      <Chip f={f} at={mob} text="MOBILE" x={430} y={420} size={50}/>
      {plus(bb - 4, 690)}
      <Chip f={f} at={bb} text="BROADBAND" x={960} y={420} size={50}/>
      {plus(tv - 4, 1230)}
      <Chip f={f} at={tv} text="TV" x={1430} y={420} size={50}/>
      <Chip f={f} at={conv} text="= CONVERGENCE" x={960} y={545} size={56} bg={C.teal}/>
      <MgmtTag f={f} at={second} x={960} y={300 + 0} size={28} text="AIRTEL'S PITCH · MANAGEMENT SAYS"/>
      <Chip f={f} at={test} text="TESTED AGAINST THE FILINGS" x={960} y={640} size={30} bg={C.paperDeep} color={C.ink}/>
      <SuspectCards f={f} at={-200} active={f >= conv ? "CONVERGENCE" : null}/>
      <SourceTag f={f} at={0} text="Illustration · Airtel's own framing of convergence (management says)"/>
    </Stage>
  );
};

// p4 ---------------------------------------------------------------------------------------------------------------
const sources: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t1 = a("s02p4", "Against Airtel's"), t2 = a("s02p4", "its rivals'"), t3 = a("s02p4", "the regulator's"), t4 = a("s02p4", "Where the data");
  return (
    <Stage f={f} d={d}>
      <Chip f={f} at={0} text="NOT AGAINST OPINIONS" x={960} y={130} size={38}/>
      <IconDisc f={f} at={t1} x={360} y={350} d={200} kind="doc" label="AIRTEL'S OWN RESULTS"/>
      <IconDisc f={f} at={t2} x={960} y={350} d={200} kind="doc" label="RIVALS' FILINGS"/>
      <IconDisc f={f} at={t3} x={1560} y={350} d={200} kind="bank" label="THE REGULATOR'S DATA"/>
      <Chip f={f} at={t4} text="WHERE THE DATA CANNOT ANSWER, WE SAY SO" x={960} y={610} size={36} bg={C.teal}/>
      <SuspectCards f={f} at={-200}/>
      <SourceTag f={f} at={0} text="Illustration · Airtel results, rivals' filings, TRAI data"/>
    </Stage>
  );
};

export const SHOTS02: Shot[] = [
  S("s02p1", 0, H0, defn, "sc02-def"),
  S("s02p2", 0, H0, three, "sc02-three"),
  S("s02p3", 0, H0, pitch, "sc02-pitch"),
  S("s02p4", 0, H0, sources, "sc02-sources"),
];
export const CUES02: SCue[] = [
  [W("s02p1", "average revenue per user"), "paper", 0.4], [W("s02p1", "three hundred and seventy seven"), "pop", 0.3],
  [W("s02p2", "Switching costs"), "pop", 0.3], [W("s02p3", "convergence"), "click", 0.35],
];
