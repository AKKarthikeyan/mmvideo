// Scene 03 | The line itself. Shot A (p1+p2): nine-quarter ARPU line (zero-based, ledger C31), draws between the spoken 233 and 271, ring on the
// flat pair (245, 245) and on the March dip (257); "+16%" chip is our arithmetic (271/233, eight intervals). Shot B (p3): bars for the year
// (revenue +10.1%, customers +3.6%, ARPU +5.9%; our arithmetic). Shot C (p4): 62/38 split bar (our arithmetic) then Shot D: net additions
// 716k vs 3,265k. Shot E (p5): management-says crop for the extra day behind ARPU 264.
import React from "react";
import {SourceTag} from "./kit/Cards";
import {SCue} from "./kit/A01V4Cold";
import {SP, Shot} from "./kit/A01V4Parts";
import {DocPage} from "./kit/DocPage";
import {C, F, ease, outQuint, spr, useTicks} from "./kit/tokens";
import {ENTITY, EntityTag} from "./devices";
import {LineChart, PairBars} from "./devices_airtel";
import {H0, MZ, S, W, WL, useAt} from "./cue";
import {Chip, MgmtTag, Stage} from "./parts0104";

const PTS = [["Sep-24", 233], ["Dec-24", 245], ["Mar-25", 245], ["Jun-25", 250], ["Sep-25", 256], ["Dec-25", 259], ["Mar-26", 257], ["Jun-26", 264], ["Sep-26", 271]] as const;

const line: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t233 = a("s03p1", "two hundred and thirty three"), t271 = a("s03p1", "two hundred and seventy one"), pct = a("s03p1", "Sixteen percent");
  const flat = a("s03p2", "two hundred and forty five"), dip = a("s03p2", "slipped in the March");
  const pts = PTS.map(([label, v], i) => ({label, v: v as number,
    hi: i === 1 || i === 2 ? {at: flat, color: C.rust} : i === 6 ? {at: dip, color: C.rust} : undefined}));
  return (
    <Stage f={f} d={d}>
      <EntityTag f={f} at={0} text={ENTITY.airtelMob} period="ARPU, ₹ PER MONTH · NINE QUARTERS" x={960} y={135} anchor="center" size={28}/>
      <LineChart f={f} at={t233} x={210} y={300} w={1500} h={520} points={pts} yMax={340} drawDur={Math.max(40, t271 - t233 + 6)}
        title="" source="Airtel Quarterly Reports Q2 FY26 and Q2 FY27 · p.45 · India mobile"/>
      <Chip f={f} at={pct} text="+16% SEP-24 → SEP-26 · OUR ARITHMETIC" x={240} y={335} size={32} anchor="left" bg={C.teal}/>
    </Stage>
  );
};

const split: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Stage f={f} d={d}>
      <EntityTag f={f} at={0} text={ENTITY.airtelMob} period="YEAR ON YEAR · SEP-26 vs SEP-25" x={960} y={135} anchor="center" size={28}/>
      <PairBars f={f} x={360} y={330} w={1200} h={450} max={12} title="WHAT CHANGED IN A YEAR (%)" barW={240}
        items={[{label: "MOBILE REVENUE", v: 10.1, text: "+10.1%", at: a("s03p3", "ten percent"), color: C.ink},
          {label: "CUSTOMERS", v: 3.6, text: "+3.6%", at: a("s03p3", "three point six")},
          {label: "ARPU", v: 5.9, text: "+5.9%", at: a("s03p3", "five point nine"), color: C.teal}]}/>
      <Chip f={f} at={a("s03p3", "five point nine")} text="OUR ARITHMETIC" x={1640} y={340} size={28} bg={C.rust}/>
      <SourceTag f={f} at={0} text="Airtel Q2 FY27 Quarterly Report pp.12, 17 · our arithmetic"/>
    </Stage>
  );
};

// 62 / 38 bar, zero-based horizontal axis 0-100% of the extra revenue (our simplification)
const share: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t1 = a("s03p4", "three-fifths"), t2 = a("s03p4", "two-fifths"), t3 = a("s03p4", "our simplification");
  const k1 = ease(f, t1, t1 + 22, outQuint), k2 = ease(f, t2, t2 + 22, outQuint), X = 260, Wd = 1400, Y = 420, H = 150;
  return (
    <Stage f={f} d={d}>
      <EntityTag f={f} at={0} text={ENTITY.airtelMob} period="SHARE OF THE EXTRA REVENUE, YEAR ON YEAR" x={960} y={135} anchor="center" size={28}/>
      <div style={{position: "absolute", left: X, top: Y, width: Wd, height: H, background: C.paperDeep}}/>
      <div style={{position: "absolute", left: X, top: Y, width: Wd * 0.62 * k1, height: H, background: C.teal}}/>
      <div style={{position: "absolute", left: X + Wd * 0.62, top: Y, width: Wd * 0.38 * k2, height: H, background: C.ink}}/>
      <div style={{position: "absolute", left: X, top: Y + H + 24, fontFamily: F.sans, fontWeight: 800, fontSize: 56, color: C.teal, opacity: k1}}>ARPU ≈ 3/5</div>
      <div style={{position: "absolute", left: X + Wd, top: Y + H + 24, transform: "translateX(-100%)", fontFamily: F.sans, fontWeight: 800, fontSize: 56, color: C.ink, opacity: k2, whiteSpace: "nowrap"}}>CUSTOMERS ≈ 2/5</div>
      <div style={{position: "absolute", left: X, top: Y - 60, fontFamily: F.sans, fontWeight: 600, fontSize: 28, color: C.grey}}>0%</div>
      <div style={{position: "absolute", left: X + Wd, top: Y - 60, transform: "translateX(-100%)", fontFamily: F.sans, fontWeight: 600, fontSize: 28, color: C.grey}}>100%</div>
      <Chip f={f} at={t3} text="OUR ARITHMETIC: 5.9 ÷ (5.9 + 3.6) = 62% · OUR SIMPLIFICATION, NOT AIRTEL'S" x={960} y={700} size={30} bg={C.rust}/>
      <SourceTag f={f} at={0} text="Airtel Q2 FY27 Quarterly Report · our arithmetic"/>
    </Stage>
  );
};

const adds: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Stage f={f} d={d}>
      <EntityTag f={f} at={0} text={ENTITY.airtelMob} period="NET ADDITIONS, THOUSAND" x={960} y={135} anchor="center" size={28}/>
      <PairBars f={f} x={560} y={300} w={800} h={450} max={3600} title="CUSTOMER ADDITIONS ARE SLOWING" barW={220}
        items={[{label: "JUN-26 (Q1 FY27)", v: 3265, text: "3,265", at: a("s03p4", "three point three million"), color: C.ink},
          {label: "SEP-26 (Q2 FY27)", v: 716, text: "716", at: a("s03p4", "seven hundred and sixteen thousand"), color: C.teal}]}/>
      <SourceTag f={f} at={0} text="Airtel Q2 FY27 Quarterly Report p.45"/>
    </Stage>
  );
};

const extra: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t264 = a("s03p5", "Management says"), md = a("s03p5", "management says"), ex = a("s03p5", "extra day"), less = a("s03p5", "less steep");
  const e = spr(f, t264, 12, 170);
  return (
    <Stage f={f} d={d}>
      <EntityTag f={f} at={t264} text={ENTITY.airtelMob} period="ARPU · JUN-26 (Q1 FY27)" x={960} y={140} anchor="center" size={28}/>
      {f >= t264 ? <div style={{position: "absolute", left: 960, top: 300, transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * e})`, opacity: Math.min(1, e * 3), fontFamily: F.sans, fontWeight: 800, fontSize: 200, color: C.teal, lineHeight: 1}}>₹264</div> : null}
      <div style={{position: "absolute", inset: 0, opacity: ease(f, md, md + 12)}}>
        <DocPage f={f} src="airtel/docs/sc03_extra_day.png" imgW={1836} imgH={220} x={960} y={650} width={1500} rot={-0.4} stack={1}
          enter={{at: md, mode: "slide-up"}}/>
        <MgmtTag f={f} at={md} x={560} y={500} size={28}/>
        <Chip f={f} at={ex} text="Shashwat Sharma · Q1 FY27 call · 5 Aug 2026" x={1400} y={500} size={26} bg={C.ink}/>
      </div>
      <Chip f={f} at={less} text="Q1 AND Q2 ARPU EACH HAD ONE EXTRA DAY · MANAGEMENT SAYS" x={960} y={792} size={28} bg={C.ink}/>
      <Chip f={f} at={less} text="THE QUARTER-TO-QUARTER CLIMB IS LESS STEEP THAN IT LOOKS" x={960} y={868} size={30} bg={C.teal}/>
      <SourceTag f={f} at={0} text="Q1 FY27 call transcript p.3 · Q2 FY27 call 00:10:29 (our transcription of the company's official audio)"/>
    </Stage>
  );
};

export const SHOTS03: Shot[] = [
  S("s03p1", 0, H0, line, "sc03-line"),
  S("s03p3", 0, WL, split, "sc03-split"),
  S("s03p4", 0, H0, share, "sc03-share"),
  S("s03p4", "And customer additions|-0.1", MZ, adds, "sc03-adds"),
  S("s03p5", 0, H0, extra, "sc03-extra"),
];
export const CUES03: SCue[] = [
  [W("s03p1", "two hundred and thirty three"), "pop", 0.3], [W("s03p2", "slipped in the March"), "circle", 0.5],
  [W("s03p3", "ten percent"), "pop", 0.3], [W("s03p4", "our simplification"), "stamp", 0.35], [W("s03p5", "management says"), "paper", 0.4],
];
