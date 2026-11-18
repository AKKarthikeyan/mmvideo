// Short 1/5: Low cost, "Is Jio the cheapest network to run?" (vertical, VoxPlus look).
// Shots: moat card; real tower photo with fixed costs; schematic (phones join, costs spread); 241.4 vs 101.3 bn GB bars;
// the same bars with the house icon joining Jio's; the stopped cost / traffic division; verdict stamp PLAUSIBLE, NOT PROVEN.
import React from "react";
import {Shot, SP, Stamp} from "../kit/A01V4Parts";
import {SCue} from "../kit/A01V4Cold";
import {PhotoPrint, StickerLabel} from "../kit/Collage";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr, useTicks} from "../kit/tokens";
import {ENTITY, EntityTag} from "../devices";
import {H0, PU, S, W, WL, WR, useAt} from "./cue";
import {VFrame, VSource} from "./frame";
import {HouseG, Leader, PanelG, PhoneG, Svg, TowerBig, Txt} from "../parts56";
import {Badge, MoatCard, cardPt} from "./parts15";

const K = "sh1";

// 1. moat card
const c1: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <VFrame f={f} d={d}><MoatCard f={f} n={1} title="LOW COST?" sub="Is Jio the cheapest network to run?"/></VFrame>;
};

// 2. a real tower, with the costs that exist before the next phone connects
const TC = {x: 540, y: 800, w: 960, h: 1020, pw: 2268, ph: 2419, b: 12};
const c2: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  const eq = cardPt(TC, 0.592, 0.367), dish = cardPt(TC, 0.564, 0.636), cab = cardPt(TC, 0.575, 0.76), base = cardPt(TC, 0.55, 0.955);
  const tEq = a("tower's"), tBh = a("cost"), tPw = a("paid"), tSite = a("the next");
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <PhotoPrint f={f} src="jio/media/tower_in_todabhim_top.jpg" x={TC.x} y={TC.y} w={TC.w} h={TC.h} border={12} tape={false} halftone={0} enter={{at: -10, mode: "pop"}}/>
      <Svg>
        <Leader f={f} at={tEq} from={[270, eq[1] - 40]} to={eq} r={46}/>
        <Leader f={f} at={tBh} from={[270, dish[1] + 10]} to={dish} r={46}/>
        <Leader f={f} at={tPw} from={[850, cab[1] + 30]} to={cab} r={40} dash/>
        <Leader f={f} at={tSite} from={[270, base[1] - 30]} to={base} r={40}/>
      </Svg>
      <StickerLabel f={f} text="Equipment" x={270} y={eq[1] - 40} size={40} rot={-2} bg={C.teal} color={C.white} enter={{at: tEq - 2, mode: "pop", rot0: -8}}/>
      <StickerLabel f={f} text="Backhaul" x={270} y={dish[1] + 10} size={40} rot={2} bg={C.teal} color={C.white} enter={{at: tBh - 2, mode: "pop", rot0: 8}}/>
      <StickerLabel f={f} text="Power" x={850} y={cab[1] + 30} size={40} rot={-2} bg={C.teal} color={C.white} enter={{at: tPw - 2, mode: "pop", rot0: -8}}/>
      <StickerLabel f={f} text="Site" x={270} y={base[1] - 30} size={40} rot={2} bg={C.teal} color={C.white} enter={{at: tSite - 2, mode: "pop", rot0: 8}}/>
      <StickerLabel f={f} text="Paid before the next phone" x={540} y={1350} size={38} rot={-1.5} dark enter={{at: a("before"), mode: "pop", rot0: 6}}/>
      <VSource text="Photo: Rahulsince93, CC BY 4.0, Wikimedia Commons"/>
    </VFrame>
  );
};

// 3. Illustration: more traffic spreads the fixed costs thinner
const phonePos = (i: number): [number, number] => {
  const ang = i * 2.399963, rr = 170 + 130 * ((i * 0.6180339) % 1);
  return [540 + Math.cos(ang) * rr * 1.5, 1030 + Math.sin(ang) * rr * 0.75];
};
const c3: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  const nF = 1 + 23 * ease(f, a("more"), a("thinner") + 6, inOut), n = Math.floor(nF);
  const blocks = ["SITE", "EQUIPMENT", "POWER", "BACKHAUL"];
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <Txt f={f} at={-4} text="Fixed costs of one site" x={60} y={250} size={36} align="left"/>
      <Svg>
        {blocks.map((t, i) => <g key={t}><rect x={60 + i * 240} y={290} width={236} height={84} fill={C.ink}/>
          <text x={60 + i * 240 + 118} y={342} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={26} fill={C.white}>{t}</text></g>)}
        <rect x={60} y={725} width={Math.max(6, 960 / n)} height={56} fill={C.teal}/>
        <line x1={60} x2={1020} y1={805} y2={805} stroke={C.grey} strokeWidth={3} strokeDasharray="4 10"/>
        <TowerBig x={540} yb={1290} h={420} w={160} sw={7}/>
        {[-1, 0, 1].map((k) => <PanelG key={k} x={540 + k * 26} y={892 + Math.abs(k) * 20} s={0.9}/>)}
        {Array.from({length: 24}).map((_, i) => {
          const p = clamp01(nF - i);
          if (p <= 0) return null;
          const [x, y] = phonePos(i);
          return <g key={i} opacity={p}><line x1={x} y1={y} x2={540} y2={930} stroke={C.teal} strokeWidth={2} opacity={0.35}/><PhoneG x={x} y={y} s={0.7 + 0.3 * p}/></g>;
        })}
      </Svg>
      <Txt f={f} at={-2} text="PHONES SERVED" x={60} y={440} size={28} weight={800} color={C.grey} align="left" spacing={3}/>
      <div style={{position: "absolute", left: 60, top: 470, fontFamily: F.serif, fontSize: 150, lineHeight: 1, color: C.ink}}>{n}</div>
      <Txt f={f} at={-2} text="One phone's share" x={60} y={690} size={36} align="left"/>
      <VSource text="Illustration · not Jio's costs"/>
    </VFrame>
  );
};

// 4 + 5. 241.4 vs 101.3 billion GB; then the house icon joins Jio's bar
const BX = 60, BWJ = 960, BWA = (960 * 101.3) / 241.4;
const Bars: React.FC<{f: number; a: (x: string) => number; icons: boolean}> = ({f, a, icons}) => {
  const tJ = a("Jio's network"), tJn = a("two hundred"), tA = a("Airtel's"), tAn = a("hundred and one");
  const jv = 241.4 * ease(f, tJn, tJn + 36, outQuint), av = 101.3 * ease(f, tAn, tAn + 22, outQuint);
  const jb = BWJ * ease(f, tJn, tJn + 36, outQuint), ab = BWA * ease(f, tAn, tAn + 22, outQuint);
  const tHome = a("home"), tMob = a("mobile");
  return (
    <>
      <EntityTag f={f} at={tJ - 4} text={ENTITY.jioPlat} period="FY26" x={BX} y={265} size={28}/>
      <div style={{position: "absolute", left: BX, top: 300, fontFamily: F.serif, fontSize: 190, lineHeight: 1, color: C.ink, opacity: f >= tJn - 2 ? 1 : 0}}>{jv.toFixed(1)}</div>
      <Txt f={f} at={a("billion")} text="billion GB · data traffic" x={BX} y={520} size={34} weight={600} color={C.grey} align="left"/>
      <EntityTag f={f} at={tA - 4} text={ENTITY.airtelMob} period="FY26" x={BX} y={795} size={28}/>
      <div style={{position: "absolute", left: BX, top: 830, fontFamily: F.serif, fontSize: 190, lineHeight: 1, color: C.ink, opacity: f >= tAn - 2 ? 1 : 0}}>{av.toFixed(1)}</div>
      <Txt f={f} at={tAn + 10} text="billion GB · data traffic" x={BX} y={1050} size={34} weight={600} color={C.grey} align="left"/>
      <Svg>
        <line x1={BX} x2={BX} y1={560} y2={1200} stroke={C.ink} strokeWidth={3} opacity={0.35}/>
        <rect x={BX} y={570} width={jb} height={120} fill={C.teal}/>
        <rect x={BX} y={1090} width={ab} height={120} fill={C.ink}/>
        {icons ? <g>
          <g opacity={ease(f, tHome - 30, tHome - 20)}><PhoneG x={740} y={630} s={1.7} color={C.white} screen={C.teal}/>
            <text x={826} y={652} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={64} fill={C.white}>+</text></g>
          <g transform={`translate(${(1 - ease(f, tHome - 8, tHome + 8, outCubic)) * 340} 0)`} opacity={ease(f, tHome - 8, tHome - 2)}><HouseG x={930} y={632} s={1.7} color={C.white} screen={C.teal}/></g>
          <g opacity={ease(f, tMob, tMob + 8)}><PhoneG x={BX + 56} y={1150} s={1.7} color={C.white} screen={C.ink}/></g>
        </g> : null}
      </Svg>
      {icons ? <Txt f={f} at={tHome + 6} text="mobile + home broadband" x={BX} y={720} size={34} weight={800} color={C.teal} align="left"/> : null}
      {icons ? <Txt f={f} at={tMob + 10} text="mobile only" x={BX} y={1240} size={34} weight={800} color={C.ink} align="left"/> : null}
    </>
  );
};
const c4: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <Bars f={f} a={a} icons={false}/>
      <StickerLabel f={f} text="More than twice" x={760} y={765} size={36} rot={-2} dark enter={{at: a("more than"), mode: "pop", rot0: -6}}/>
      <VSource text="Jio Platforms RHP p.131 · Airtel (mobile) RHP p.136"/>
    </VFrame>
  );
};
const c5: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <Bars f={f} a={a} icons/>
      <div style={{position: "absolute", left: 0, right: 0, top: 0}}>
        <div style={{position: "absolute", left: 540, top: 1330, transform: `translate(-50%, -50%) translateY(${(1 - ease(f, a("home") - 6, a("home") + 6)) * 20}px)`, opacity: ease(f, a("home") - 6, a("home") + 6),
          fontFamily: F.sans, fontWeight: 800, fontSize: 34, color: C.white, background: C.ink, padding: "14px 26px", whiteSpace: "nowrap"}}>Mobile + home broadband vs mobile only</div>
      </div>
      <VSource text="RHP KPI note 4 p.132 · Airtel note 6 p.137"/>
    </VFrame>
  );
};

// 6. the proposed division stops: the filings cannot size the edge
const FracV: React.FC<{f: number; x: number; name: string; house?: boolean; tCost: number; tBar: number; tStop: number}> = ({f, x, name, house, tCost, tBar, tStop}) => {
  const c = ease(f, tCost, tCost + 12, outQuint), bar = ease(f, tBar, tBar + 14, inOut), stop = ease(f, tStop, tStop + 6, outCubic);
  return (
    <>
      <Txt f={f} at={-4} text={name} x={x} y={470} size={44} spacing={2}/>
      <div style={{position: "absolute", left: x - 190, top: 540 - (1 - c) * 70, width: 380, height: 100, background: C.ink, opacity: c, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: C.white, letterSpacing: 2}}>COST</div>
      <div style={{position: "absolute", left: x - 190, top: 750, width: 380, height: 170, background: C.white, boxShadow: "0 3px 4px rgba(30,20,10,0.16), 0 14px 28px rgba(30,20,10,0.18)"}}>
        <div style={{position: "absolute", left: 22, top: 12, fontFamily: F.sans, fontWeight: 800, fontSize: 24, color: C.grey, letterSpacing: 2}}>TRAFFIC</div>
        <svg width={380} height={170} style={{position: "absolute", left: 0, top: 0}}>
          <PhoneG x={house ? 120 : 190} y={104} s={1.4}/>
          {house ? <><text x={190} y={118} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={48} fill={C.teal}>+</text><HouseG x={262} y={104} s={1.4} color={C.teal}/></> : null}
        </svg>
      </div>
      <Svg>
        {bar > 0.02 ? <line x1={x - 190} x2={x - 190 + 380 * bar} y1={695} y2={695} stroke={stop > 0 ? C.rust : C.ink} strokeWidth={8} strokeLinecap="round" strokeDasharray={stop > 0 ? "28 18" : undefined}/> : null}
      </Svg>
      {stop > 0 ? <div style={{position: "absolute", left: x - 45, top: 960, width: 90, height: 90, borderRadius: 45, border: `5px dashed ${C.grey}`, opacity: stop, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: F.sans, fontWeight: 800, fontSize: 56, color: C.grey}}>?</div> : null}
    </>
  );
};
const c6: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  const tStop = a("tell"), st = ease(f, tStop, tStop + 8, outCubic);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <FracV f={f} x={290} name="JIO" house tCost={-14} tBar={a("filings") - 6} tStop={tStop}/>
      <FracV f={f} x={790} name="AIRTEL" tCost={-12} tBar={a("filings") - 4} tStop={tStop}/>
      <Svg><rect x={534} y={510} width={12} height={460 * st} fill={C.rust}/>
        {st > 0.9 ? <g><circle cx={540} cy={740} r={36} fill={C.paper} stroke={C.rust} strokeWidth={7}/><text x={540} y={758} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={48} fill={C.rust}>≠</text></g> : null}</Svg>
      <StickerLabel f={f} text="Size of the edge: not shown" x={540} y={1190} size={38} rot={-1.5} dark enter={{at: a("big"), mode: "pop", rot0: 6}}/>
      <VSource text="Proposed division, stopped · not calculated"/>
    </VFrame>
  );
};

// 7. verdict
const c7: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(K, s0);
  const Card: React.FC<{y: number; at: number; kind: "yes" | "note"; big: string; sub: string}> = ({y, at, kind, big, sub}) => {
    const e = spr(f, at, 13, 160);
    if (e <= 0.001) return null;
    return (
      <div style={{position: "absolute", left: 60, top: y, width: 960, height: 230, transform: `translateY(${(1 - e) * 160}px)`, opacity: clamp01(e * 2), background: C.white,
        boxShadow: "0 3px 4px rgba(30,20,10,0.16), 0 18px 34px rgba(30,20,10,0.2)", borderLeft: `18px solid ${kind === "yes" ? C.teal : C.grey}`, boxSizing: "border-box", padding: "34px 40px 0 44px"}}>
        <div style={{fontFamily: F.serif, fontSize: 64, lineHeight: 1.05, color: C.ink, maxWidth: 700}}>{big}</div>
        <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 34, color: C.grey, marginTop: 14}}>{sub}</div>
      </div>
    );
  };
  return (
    <VFrame f={f} d={d} z={[1.0, 1.02]}>
      <Card y={300} at={-10} kind="yes" big="Plausible cost advantage" sub="more traffic can spread costs"/>
      <Badge x={930} y={415} kind="yes" at={-6} f={f} r={50}/>
      <Card y={580} at={a("advantage")} kind="note" big="Precise size: not shown" sub="mobile + home broadband vs mobile only"/>
      <Badge x={930} y={695} kind="note" at={a("advantage") + 4} f={f} r={50}/>
      <Stamp f={f} at={a("not a")} text="PLAUSIBLE, NOT PROVEN" x={540} y={1040} size={70} rot={-5}/>
      <VSource text="Jio Platforms RHP p.131-132, p.136-137 · our reading"/>
    </VFrame>
  );
};

export const SHOTS_SH1: Shot[] = [
  S(K, 0, H0, c1, "sh1-card"),
  S(K, "Much", WL, c2, "sh1-tower"),
  S(K, "So more|-0.05", PU, c3, "sh1-spread"),
  S(K, "Jio's network|-0.1", WL, c4, "sh1-bars"),
  S(K, "But Jio's|-0.1", H0, c5, "sh1-house"),
  S(K, "So the filings|-0.1", PU, c6, "sh1-stop"),
  S(K, "A plausible|-0.1", WR, c7, "sh1-verdict"),
];
export const CUES_SH1: SCue[] = [
  [W(K, "tower's"), "pop", 0.35],
  [W(K, "two hundred"), "pop", 0.35],
  [W(K, "home"), "circle", 0.4],
  [W(K, "not a"), "stamp", 0.7],
];
