// Scene 01 | Start with the bill. One continuous shot (s01p1 + s01p2): a generic bill (illustration), a tap on Paid, the amount lands on the
// spoken "two hundred and seventy one", the year-earlier row on "two hundred and fifty six", then the bill shrinks and the three blank
// suspect cards slide in on "So who raised it?". Figures: ledger rows s01p1 (C30): 271 and 256 Rs per month.
import React from "react";
import {SourceTag} from "./kit/Cards";
import {SCue} from "./kit/A01V4Cold";
import {SP, Shot} from "./kit/A01V4Parts";
import {ease, inOut, useTicks} from "./kit/tokens";
import {ENTITY, EntityTag} from "./devices";
import {SuspectCards} from "./devices_airtel";
import {H0, S, W, useAt} from "./cue";
import {BillPhone, Stage, YearRows} from "./parts0104";

const bill: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t271 = a("s01p1", "two hundred and seventy one"), t256 = a("s01p1", "two hundred and fifty six"), p2 = a("s01p2", 0), cards = a("s01p2", "price");
  const k = ease(f, p2, p2 + 22, inOut);
  const x = 600 - 40 * k, y = 530 - 160 * k, s = 0.82 - 0.24 * k;
  return (
    <Stage f={f} d={d}>
      <BillPhone f={f} x={x} y={y} s={s} amount="₹271" amountAt={t271} tapAt={14}/>
      <EntityTag f={f} at={t271} text={ENTITY.airtelMob} period="ARPU PER MONTH" x={1330} y={140} anchor="center" size={26}/>
      <YearRows f={f} at1={t271} at2={t256}/>
      <SuspectCards f={f} at={cards - 4} active={null}/>
      <SourceTag f={f} at={0} text="Illustration · generic bill screen · Airtel Q2 FY27 Quarterly Report p.17"/>
    </Stage>
  );
};

export const SHOTS01: Shot[] = [S("s01p1", 0, H0, bill, "sc01-bill")];
export const CUES01: SCue[] = [[W("s01p1", 0.5), "ding", 0.5], [W("s01p1", "two hundred and seventy one"), "pop", 0.35], [W("s01p2", "price|-0.1"), "paper", 0.4]];
