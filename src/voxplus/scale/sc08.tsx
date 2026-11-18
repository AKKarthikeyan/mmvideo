// Scene 08 | 5:50-6:45 | What a price rise reveals (AK brief + review pass 20 Oct). The Q2 FY25 tariff increase: the real RHP p.43 passage for
// about 1.5 s (provenance), then ONE panel at a time, each full width when introduced (ARPU, churn, net additions) on a shared FY24-FY26
// time axis with the tariff marker, then the combined three-panel view is held (aligned, no dual axis, no interpolation). EXIT QUARTER / FULL
// YEAR tags on every panel. Pricing-power idea (illustration), verdict tags. Finish: the recharge phone (price changed), pull back to the
// distribution relationship underneath it (continues into scene 09). No restaurant analogy.
import React from "react";
import {StickerLabel} from "./kit/Collage";
import {SCue} from "./kit/A01V4Cold";
import {SP, Shot} from "./kit/A01V4Parts";
import {DocPage} from "./kit/DocPage";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, useTicks} from "./kit/tokens";
import {H0, PU, S, W, WL, useAt} from "./cue";
import {Frame, Headline, MAP, PricePhone, Q2FY25, RelMap, ResponsePanel, TariffTag, TimeAxis} from "./parts789";
import TAR from "../../../public/voxplus/scale/docs/sc08_rhp43_tariff.json";

const CHIP_P1 = "Jio RHP p.43 · tariff increase · RHP p.131, p.136 · RJIL KPIs";
const CHIP_KPI = "Jio RHP p.131, p.136 · ARPU, churn (exit quarter) · net customer addition (full year)";

// A (p1): the passage (provenance), then one full-width panel at a time as each is narrated
const a8: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tA = a("s08p1", "average") - 4, tB = a("s08p1", "churn") - 4, tC = a("s08p1", "subscriber") - 4;
  const docOut = ease(f, tA - 8, tA);
  return (
    <Frame f={f} d={d} chip={CHIP_P1} cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <TimeAxis f={f} at={-30} y={294} markAt={-30} markLabel={false} lineTo={850}/>
      <TariffTag f={f} at={-30} y={200}/>
      <div style={{opacity: 1 - docOut, transform: `translateY(${docOut * 40}px)`}}>
        <DocPage f={f} src="scale/docs/sc08_rhp43_tariff.png" imgW={TAR.w} imgH={TAR.h} x={960} y={660} width={1640} margin={0.03} rot={0}
          enter={{at: -14, mode: "drop", dur: 8}}
          highlights={[{rects: TAR.rects.tariff, at: 2, dur: 8}, {rects: TAR.rects.arpu, at: 16, dur: 8}]}/>
      </div>
      <ResponsePanel f={f} k="a" mode="full" at={tA} out={tB}/>
      <ResponsePanel f={f} k="b" mode="full" at={tB} out={tC}/>
      <ResponsePanel f={f} k="c" mode="full" at={tC}/>
    </Frame>
  );
};

/** p4: conceptual (unlabelled-scale) bar trimmed by departures, costs and competitive responses. Labelled Illustration; no numbers. */
const PricingPower: React.FC<{f: number; at: number; out: number; a: ReturnType<typeof useAt>}> = ({f, at, out, a}) => {
  const p = ease(f, at, at + 12, outCubic) * (1 - ease(f, out, out + 10));
  if (p <= 0.01) return null;
  const steps = [{l: "departures", t: a("s08p4", "departures"), w: 0.8}, {l: "costs", t: a("s08p4", "costs"), w: 0.62}, {l: "competitive responses", t: a("s08p4", "competitive"), w: 0.46}];
  const X0 = 520, BW = 1000;
  return (
    <div style={{position: "absolute", left: 160, top: 250, width: 1600, height: 620, background: C.white, opacity: p, transform: `translateY(${(1 - p) * 40}px)`,
      boxShadow: "0 3px 4px rgba(30,20,10,0.16), 0 18px 34px rgba(30,20,10,0.22)"}}>
      <div style={{position: "absolute", left: 60, top: 40, fontFamily: F.serif, fontWeight: 400, fontSize: 64, color: C.ink}}>PRICING POWER</div>
      <div style={{position: "absolute", left: 60, top: 122, fontFamily: F.sans, fontWeight: 600, fontSize: 32, color: C.grey}}>Benefit of a price rise that stays with the company · Illustration, not to scale</div>
      <svg width={1600} height={620} style={{position: "absolute", left: 0, top: 0}}>
        <text x={40} y={262} fontFamily={F.sans} fontWeight={800} fontSize={30} fill={C.ink}>Benefit</text>
        <rect x={X0} y={215} width={BW} height={70} fill={C.teal} opacity={0.22}/>
        {(() => {
          let prev = 1;
          const out: React.ReactNode[] = [];
          out.push(<rect key="b" x={X0} y={215} width={BW * ease(f, at + 10, at + 24, outQuint)} height={70} fill={C.teal}/>);
          steps.forEach((s, i) => {
            const k = ease(f, s.t - 2, s.t + 12, outQuint), w = prev + (s.w - prev) * k, y = 330 + i * 78;
            out.push(<g key={i} opacity={clamp01(k * 3)}>
              <rect x={X0 + BW * s.w} y={215} width={BW * (prev - s.w) * k} height={70} fill={C.rust} opacity={0.85}/>
              <text x={40} y={y + 40} fontFamily={F.sans} fontWeight={800} fontSize={27} fill={C.ink}>after {s.l}</text>
              <rect x={X0} y={y} width={BW * w} height={56} fill={C.teal}/>
              <text x={X0 + BW * w - 16} y={y + 40} textAnchor="end" fontFamily={F.sans} fontWeight={800} fontSize={28} fill={C.white}>kept</text>
            </g>);
            prev = s.w;
          });
          return out;
        })()}
      </svg>
    </div>
  );
};

// B (p2 - p5): the combined view, held; spotlight; pricing power; verdict
const b8: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const q = a("s08p3", "pay"), r = a("s08p3", "respond");
  const p4 = a("s08p4", 0), p4o = a("s08p5", 0);
  const dim = ease(f, p4, p4 + 12) * (1 - ease(f, p4o, p4o + 12));
  const ringA = ease(f, q - 20, q - 8) * (1 - ease(f, q + 14, q + 24)), ringB = ease(f, r - 18, r - 6) * (1 - ease(f, p4 - 6, p4 + 6));
  return (
    <Frame f={f} d={d} chip={CHIP_KPI} cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <Headline f={f} at={-30} a="AFTER A PRICE RISE, WATCH BOTH:" b="REVENUE PER USER + CUSTOMER RESPONSE" y={98} size={46} align="left" x={60}/>
      <div style={{opacity: 1 - 0.78 * dim}}>
        <TimeAxis f={1000} at={0} y={294} markAt={0} markLabel={false} lineTo={900}/>
        <TariffTag f={1000} at={0} y={200}/>
        <ResponsePanel f={f} k="a" mode="mini" at={-100} ring={ringA}/>
        <ResponsePanel f={f} k="b" mode="mini" at={-100} ring={ringB}/>
        <ResponsePanel f={f} k="c" mode="mini" at={-100} ring={ringB}/>
      </div>
      <PricingPower f={f} at={p4} out={p4o} a={a}/>
      <StickerLabel f={f} text="Evidence: mixed" x={1560} y={120} size={44} rot={2} dark enter={{at: a("s08p5", "mixed") - 4, mode: "pop", rot0: 6}}/>
      <StickerLabel f={f} text="Encouraging" x={240} y={450} size={36} rot={-1.5} bg={C.teal} color={C.white} enter={{at: a("s08p5", "encouraging") - 8, mode: "pop", rot0: -6}}/>
      <StickerLabel f={f} text="Still matters" x={240} y={640} size={36} rot={1.5} dark enter={{at: a("s08p5", "customer") - 4, mode: "pop", rot0: 6}}/>
    </Frame>
  );
};

// C (p6): the recharge phone (price changed), then pull back to the distribution relationship underneath it
const c8: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const pull = a("s08p6", "Follow") - 6, pe = ease(f, pull, pull + 30, inOut);
  const sc = 0.8 + (0.26 - 0.8) * pe, px = 960 + (MAP.phone[0] - 960) * pe, py = 510 + (MAP.phone[1] - 510) * pe;
  const t = {rjil: pull + 10, dist: pull + 16, ghostInfra: a("s08p6", "infrastructure") - 6, legend: undefined};
  return (
    <Frame f={f} d={d} chip={pe > 0.5 ? "Illustration · distribution and infrastructure as described in the RHP" : "Illustration · generic recharge screen"}>
      <PricePhone f={f} x={px} y={py} s={sc} changeAt={-100} showAt={-100}/>
      <RelMap f={f} t={t} sub={false}/>
      <StickerLabel f={f} text="More than Jio's own network" x={1530} y={520} size={40} rot={-1} dark enter={{at: a("s08p6", "more") - 4, mode: "pop", rot0: -5}} exit={{at: pull, dur: 8}}/>
    </Frame>
  );
};

export const SHOTS08: Shot[] = [S("s08p1", 0, H0, a8, "s08-a"), S("s08p2", 0, PU, b8, "s08-b"), S("s08p6", 0, WL, c8, "s08-c")];
export const CUES08: SCue[] = [[W("s08p1", "tariffs"), "paper", 0.35], [W("s08p1", "churn"), "pop", 0.3], [W("s08p6", "Follow"), "whoosh", 0.25]];
