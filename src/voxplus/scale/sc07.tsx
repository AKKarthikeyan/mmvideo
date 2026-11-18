// Scene 07 | 4:55-5:50 | The customers who leave (AK brief + review pass 20 Oct): two identical 1,000-dot grids; ~17 (Jio) and ~24 (Airtel)
// dots light up and leave: each grid has a MAGNIFIED INSET where the departing dots are drawn large with "about 17" / "about 24".
// EntityTags (RJIL | EXIT QUARTER FY26, AIRTEL · INDIA MOBILE | EXIT QUARTER FY26). Then the actual definition (RHP p.132 note 6) as one dominant
// image; the real table row for FY24-FY26 as provenance, then a full-size three-year chart (Jio lower each year); reasons; evidence not proof;
// the scene ends on a recharge price changing (generic "₹ X", not an actual plan). Nothing is annualised.
import React from "react";
import {StickerLabel} from "./kit/Collage";
import {SCue} from "./kit/A01V4Cold";
import {SP, Shot} from "./kit/A01V4Parts";
import {DocPage} from "./kit/DocPage";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr, useTicks} from "./kit/tokens";
import {DotGrid, ENTITY, EntityTag} from "./devices";
import {H0, PU, S, W, WL, WR, useAt} from "./cue";
import {Departures, Frame, Headline, PricePhone} from "./parts789";
import DEF from "../../../public/voxplus/scale/docs/sc07_rhp132_churn_def.json";
import R136 from "../../../public/voxplus/scale/docs/sc07_rhp136_churn.json";

const CELL = 15.5, GY = 500, GXJ = 350, GXA = 1295;
const CHIP = "Jio RHP p.131, p.136 · exit-quarter monthly churn";
const PERIOD = "EXIT QUARTER FY26";

/** big rate readout under a grid */
const Rate: React.FC<{f: number; at: number; x: number; y: number; big: string; calc: string; calcAt: number}> = ({f, at, x, y, big, calc, calcAt}) => {
  const p = ease(f, at, at + 10, outCubic), q = ease(f, calcAt, calcAt + 10, outCubic);
  return (
    <div style={{position: "absolute", left: x, top: y, whiteSpace: "nowrap"}}>
      <div style={{opacity: p, transform: `translateY(${(1 - p) * 20}px)`, lineHeight: 1}}>
        <span style={{fontFamily: F.serif, fontWeight: 400, fontSize: 92, color: C.ink}}>{big}</span>
        <span style={{fontFamily: F.sans, fontWeight: 600, fontSize: 30, color: C.grey}}>  monthly churn</span></div>
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 24, color: C.grey, opacity: q, marginTop: 10}}>{calc}</div>
    </div>
  );
};

// A (p1 - p3): grids, reported rates, the dots that leave (with the zoom inset), then the definition as one dominant image
const a7: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tJio = a("s07p2", "seventeen") - 4, tAir = a("s07p2", "twenty") - 4;
  const gJio = tJio + 17 * 1.2 + 8, gAir = tAir + 24 * 1.2 + 8;
  const sw = a("s07p3", "monthly"), out = 1 - ease(f, sw, sw + 10);
  const tag1 = 1 - ease(f, a("s07p2", "Jio's") - 6, a("s07p2", "Jio's") - 1);
  const tagA = 1 - ease(f, a("s07p2", "Airtel's") - 6, a("s07p2", "Airtel's") - 1);
  const sum = ease(f, sw + 4, sw + 14, outCubic);
  return (
    <Frame f={f} d={d} chip={CHIP} cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <Headline f={f} at={a("s07p2", "reported") - 4} b="REPORTED MONTHLY CHURN · EXIT QUARTER · FY26" y={100} size={52}/>
      <div style={{position: "absolute", left: 0, right: 0, top: 176, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 32, letterSpacing: 4, color: C.grey,
        opacity: ease(f, -30, -20) * out}}>ILLUSTRATION PER 1,000 CONNECTIONS</div>
      <div style={{opacity: out}}>
        <EntityTag f={f} at={-30} text={ENTITY.rjil} period={PERIOD} x={40} y={268} size={22}/>
        <EntityTag f={f} at={-30} text={ENTITY.airtelMob} period={PERIOD} x={985} y={268} size={22}/>
        <DotGrid f={f} at={-30} x={GXJ} y={GY} hi={17} hiAt={tJio} goneAt={gJio} cell={CELL}/>
        <DotGrid f={f} at={-30} x={GXA} y={GY} hi={24} hiAt={tAir} goneAt={gAir} cell={CELL}/>
        <Departures f={f} gx={GXJ} gy={GY} cell={CELL} hi={17} boxX={685} boxY={300} at={tJio - 6} flyAt={gJio} word="about 17"/>
        <Departures f={f} gx={GXA} gy={GY} cell={CELL} hi={24} boxX={1630} boxY={300} at={tAir - 6} flyAt={gAir} word="about 24"/>
        <div style={{position: "absolute", left: 40, top: 744, width: 580, fontFamily: F.sans, fontWeight: 800, fontSize: 44, color: C.ink, opacity: tag1}}>1,000 connections</div>
        <div style={{position: "absolute", left: 985, top: 744, width: 580, fontFamily: F.sans, fontWeight: 800, fontSize: 44, color: C.ink, opacity: tagA}}>1,000 connections</div>
        <Rate f={f} at={a("s07p2", "Jio's") - 2} x={40} y={740} big="1.67%" calc="1.67% × 1,000 = 16.7 · our calculation" calcAt={gJio}/>
        <Rate f={f} at={a("s07p2", "Airtel's") - 2} x={985} y={740} big="2.43%" calc="2.43% × 1,000 = 24.3 · our calculation" calcAt={gAir}/>
      </div>
      {/* p3: the two reported rates stay as a pair; the definition is the one dominant image */}
      <EntityTag f={f} at={sw + 4} text={ENTITY.rjil} period={PERIOD} x={60} y={250} size={26}/>
      <EntityTag f={f} at={sw + 4} text={ENTITY.airtelMob} period={PERIOD} x={1000} y={250} size={26}/>
      <div style={{position: "absolute", left: 60, top: 290, fontFamily: F.serif, fontWeight: 400, fontSize: 100, color: C.ink, opacity: sum}}>1.67%</div>
      <div style={{position: "absolute", left: 1000, top: 290, fontFamily: F.serif, fontWeight: 400, fontSize: 100, color: C.ink, opacity: sum}}>2.43%</div>
      <div style={{position: "absolute", left: 0, right: 0, top: 530, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 28, letterSpacing: 2, color: C.grey, opacity: ease(f, sw + 8, sw + 18)}}>
        HOW JIO DEFINES IT · RHP p.132, NOTE 6</div>
      <DocPage f={f} src="scale/docs/sc07_rhp132_churn_def.png" imgW={DEF.w} imgH={DEF.h} x={960} y={690} width={1700} margin={0.03} rot={0}
        enter={{at: sw + 6, mode: "slide-up", dur: 12}}
        highlights={[{rects: DEF.rects.num, at: sw + 26, dur: 14}, {rects: DEF.rects.den, at: a("s07p3", "year") - 40, dur: 14}, {rects: [DEF.rects.dv[0], DEF.rects.three[0]], at: a("s07p3", "year") - 6, dur: 8}]}/>
      <StickerLabel f={f} text="One month's rate · not a year" x={960} y={880} size={36} rot={-1} dark enter={{at: sw + 8, mode: "pop", rot0: -5}}/>
    </Frame>
  );
};

/** FY24-FY26 exit-quarter monthly churn, Jio vs Airtel India mobile: values exactly as printed in the RHP table. Full size. */
const STRIP = [{fy: "FY24", jio: 1.52, air: 2.37}, {fy: "FY25", jio: 1.81, air: 2.31}, {fy: "FY26", jio: 1.67, air: 2.43}];
const Strip: React.FC<{f: number; ats: number[]; lowerAt: number}> = ({f, ats, lowerAt}) => {
  const K = 330, X0 = 330, top = 290;
  return (
    <>
      <div style={{position: "absolute", left: 120, top: 100, fontFamily: F.serif, fontWeight: 400, fontSize: 64, color: C.ink}}>MONTHLY CHURN · EXIT QUARTER</div>
      <EntityTag f={f} at={ats[0] - 4} text={ENTITY.rjil} period="EXIT QUARTER" x={120} y={206} size={26}/>
      <EntityTag f={f} at={ats[0] - 4} text={ENTITY.airtelMob} period="EXIT QUARTER" x={940} y={206} size={26} dark/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <line x1={X0} x2={X0} y1={top - 10} y2={top + 590} stroke={C.ink} strokeWidth={4}/>
        {STRIP.map((r, i) => {
          const p = ease(f, ats[i], ats[i] + 18, outQuint), y = top + i * 205, lo = ease(f, lowerAt + i * 6, lowerAt + i * 6 + 10, outCubic);
          return (
            <g key={r.fy} opacity={clamp01(p * 3)}>
              <text x={X0 - 24} y={y + 92} textAnchor="end" fontFamily={F.serif} fontSize={52} fill={C.ink}>{r.fy}</text>
              <rect x={X0} y={y} width={r.jio * K * p} height={78} fill={C.teal}/>
              <rect x={X0} y={y + 90} width={r.air * K * p} height={78} fill="#5E5A53"/>
              <text x={X0 + 18} y={y + 54} fontFamily={F.sans} fontWeight={800} fontSize={34} fill={C.white}>RJIL</text>
              <text x={X0 + 18} y={y + 144} fontFamily={F.sans} fontWeight={800} fontSize={34} fill={C.white}>AIRTEL</text>
              <text x={X0 + r.jio * K * p + 20} y={y + 58} fontFamily={F.serif} fontSize={56} fill={C.ink}>{r.jio.toFixed(2)}%</text>
              <text x={X0 + r.air * K * p + 20} y={y + 148} fontFamily={F.serif} fontSize={56} fill={C.ink}>{r.air.toFixed(2)}%</text>
              <g opacity={lo}><text x={1500} y={y + 58} fontFamily={F.sans} fontWeight={800} fontSize={34} letterSpacing={2} fill={C.teal}>JIO LOWER</text></g>
            </g>
          );
        })}
      </svg>
    </>
  );
};

// B (p4): the real table row for provenance (about 2 s), then the full-size three-year chart
const b7: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const swap = a("s07p4", "Jio") - 6, docOut = 1 - ease(f, swap, swap + 8), chartIn = ease(f, swap, swap + 8);
  const ats = [swap + 4, swap + 10, swap + 16];
  return (
    <Frame f={f} d={d} chip={CHIP + " · Airtel = India mobile"} cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <div style={{opacity: docOut}}>
        <DocPage f={f} src="scale/docs/sc07_rhp136_churn.png" imgW={R136.w} imgH={R136.h} x={960} y={560} width={1640} margin={0.025} rot={0}
          enter={{at: -14, mode: "drop", dur: 8}}
          highlights={[{rects: [R136.rects.jio_fy26[0], R136.rects.jio_fy25[0], R136.rects.jio_fy24[0]], at: 4, dur: 8},
            {rects: [R136.rects.air_fy26[0], R136.rects.air_fy25[0], R136.rects.air_fy24[0]], at: 22, dur: 8, color: "#D9D3C6"}]}/>
        <div style={{position: "absolute", left: 0, right: 0, top: 100, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 28, letterSpacing: 2, color: C.grey}}>
          MONTHLY CHURN (FOR EXIT QUARTER) · THE COMPANY = JIO · BHARTI AIRTEL = INDIA MOBILE · RHP p.136</div>
      </div>
      <div style={{opacity: chartIn}}>
        <Strip f={f} ats={ats} lowerAt={a("s07p4", "lower") - 4}/>
        <StickerLabel f={f} text="An encouraging signal" x={1480} y={900} size={44} rot={1.5} bg={C.teal} color={C.white} enter={{at: a("s07p4", "encouraging") - 4, mode: "pop", rot0: 6}}/>
      </div>
    </Frame>
  );
};

// C (p5): "the dots don't tell us why people stayed" - the Jio grid with its gap, and the possible reasons as they are named
const REASONS = [["Price", "price"], ["Coverage", "coverage"], ["Bundles", "bundles"], ["Convenience", "convenience"]] as const;
const c7: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Frame f={f} d={d} chip={"Illustration · Jio grid after one month's disconnections"} cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <EntityTag f={f} at={-30} text={ENTITY.rjil} period={PERIOD} x={90} y={206} size={24}/>
      <DotGrid f={f} at={-100} x={500} y={540} hi={17} hiAt={-100} goneAt={-100} cell={17}/>
      <Headline f={f} at={-30} a="THE DOTS DON'T SAY" b="WHY PEOPLE STAYED" x={1360} y={150} size={64} align="center"/>
      {REASONS.map(([t, w], i) => (
        <StickerLabel key={t} f={f} text={t} x={1360} y={390 + i * 100} size={52} rot={i % 2 ? 1.5 : -1.5} enter={{at: a("s07p5", w) - 3, mode: "pop", rot0: i % 2 ? 6 : -6}}/>
      ))}
      <StickerLabel f={f} text="Or a combination" x={1360} y={830} size={52} rot={-1} bg={C.teal} color={C.white} enter={{at: a("s07p5", "combination") - 14, mode: "pop", rot0: 5}}/>
    </Frame>
  );
};

// D (p6): evidence, not proof (the first card is on screen from the cut)
const Card7: React.FC<{f: number; at: number; x: number; y: number; small: string; big: string; ok?: boolean; rot?: number}> = ({f, at, x, y, small, big, ok, rot = 0}) => {
  const e = spr(f, at, 13, 160);
  if (e <= 0.001) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, width: 760, padding: "40px 48px 44px", transform: `translate(-50%, -50%) translateY(${(1 - e) * 260}px) rotate(${rot}deg)`,
      opacity: clamp01(e * 2), background: C.white, boxShadow: "0 3px 4px rgba(30,20,10,0.16), 0 18px 34px rgba(30,20,10,0.2)", borderTop: `10px solid ${ok ? C.teal : C.ink}`}}>
      <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 30, color: ok ? C.teal : C.grey, letterSpacing: 2}}>{small}</div>
      <div style={{fontFamily: F.serif, fontWeight: 400, fontSize: 70, color: C.ink, lineHeight: 1.08, marginTop: 10}}>{big}</div>
    </div>
  );
};
const d7: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Frame f={f} d={d} chip="Moat & Margin · reading the retention evidence" cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <Card7 f={f} at={-20} x={520} y={540} small="RETENTION GIVES US" big="Evidence of customer behaviour" ok rot={-1.2}/>
      <Card7 f={f} at={a("s07p6", "doesn't") - 6} x={1400} y={540} small="IT DOES NOT AUTOMATICALLY" big="Prove customers are locked in" rot={1.2}/>
    </Frame>
  );
};

// E (p7): the test - a recharge price changes (generic graphic); the phone is on screen from the cut
const e7: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Frame f={f} d={d} chip="Illustration · generic recharge screen · not an actual plan" cam={[[0, 1.0, 960, 540], [d, 1.06, 960, 520]]}>
      <PricePhone f={f} x={960} y={510} s={0.8} showAt={a("s07p7", "Watch")} changeAt={a("s07p7", "price")}/>
      <StickerLabel f={f} text="Test: change the price" x={1480} y={430} size={40} rot={2} dark enter={{at: -4, mode: "pop", rot0: 6}}/>
      <StickerLabel f={f} text="Then watch the response" x={1480} y={530} size={40} rot={-1.5} bg={C.teal} color={C.white} enter={{at: a("s07p7", "changes") - 2, mode: "pop", rot0: -6}}/>
    </Frame>
  );
};

export const SHOTS07: Shot[] = [
  S("s07p1", 0, H0, a7, "s07-a"), S("s07p4", 0, PU, b7, "s07-b"), S("s07p5", 0, WL, c7, "s07-c"), S("s07p6", 0, WR, d7, "s07-d"), S("s07p7", 0, PU, e7, "s07-e"),
];
export const CUES07: SCue[] = [[W("s07p2", "seventeen"), "pop", 0.3], [W("s07p2", "twenty"), "pop", 0.3], [W("s07p4", "Jio|-0.1"), "highlighter", 0.35], [W("s07p7", "price"), "click", 0.45]];
