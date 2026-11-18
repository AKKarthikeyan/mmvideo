// Scene 05 | 2:55-3:50 | Show how scale could work (AK brief). A real tower photo is annotated (site, equipment, power, backhaul)
// as the words come; a schematic labelled "Illustration" shows one tower serving more phones, costs spreading, then added
// capacity; the two traffic definitions are shown from the actual RHP lines (Jio: all data carried on the network, shown with
// phone + house; Airtel: mobile services only, phone) and a proposed cost / traffic division is stopped when the scope
// difference appears; the scene ends zooming from the tower antenna toward the spectrum graphic (scene 06).
// No cost-per-GB ranking is shown (the script dropped it).
import React from "react";
import {AbsoluteFill, Img} from "remotion";
import {Layer, camAt} from "./kit/Camera";
import {SourceTag} from "./kit/Cards";
import {PhotoPrint, StickerLabel} from "./kit/Collage";
import {DocPage} from "./kit/DocPage";
import {Rect} from "./kit/Marker";
import {SCue} from "./kit/A01V4Cold";
import {SP, Shot} from "./kit/A01V4Parts";
import {Finish} from "./kit/Texture";
import {C, F, V, clamp01, ease, inOut, outCubic, outQuint, spr, useTicks} from "./kit/tokens";
import {H0, MZ, PU, S, W, WL, useAt} from "./cue";
import {EntityTag, ENTITY} from "./devices";
import {Frame, Arcs, Headline, HouseG, Leader, PanelG, PhoneG, Svg, TowerBig, Txt, pulse} from "./parts56";
import JL from "../../../public/voxplus/scale/docs/sc05_jio_line.json";
import AL from "../../../public/voxplus/scale/docs/sc05_airtel_line.json";

const R = (j: {rects: Record<string, number[][]>}, k: string) => j.rects[k] as Rect[];
const FIELDS = "jio/media/tower_in_todabhim_fields.jpg", TOP = "jio/media/tower_in_todabhim_top.jpg";

/** World position of a point (fractions fx, fy of the photo) inside a PhotoPrint card with border b (object-fit cover, centred). */
type Card = {x: number; y: number; w: number; h: number; pw: number; ph: number; b: number};
const cardPt = (c: Card, fx: number, fy: number): [number, number] => {
  const iw = c.w - 2 * c.b, ih = c.h - 2 * c.b, k = Math.max(iw / c.pw, ih / c.ph);
  return [c.x - iw / 2 + iw / 2 + (fx - 0.5) * c.pw * k, c.y + (fy - 0.5) * c.ph * k];
};

// p1a: the film opens on a full-screen tower (CC BY 3.0 plate) before the annotated photos
const p1a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  const cam = camAt(f, [[0, 1.0, 960, 560], [d, 1.09, 1000, 500, outCubic]]);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Layer cam={cam}><Img src={V("jio/media/tower_in_rooftop_cluster.jpg")} style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover"}}/></Layer>
      <SourceTag f={f} at={0} text="Photo: Suresh Babunair, CC BY 3.0, Wikimedia Commons"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// p1 "A tower needs a site, equipment, power and a connection to the rest of the network."
// Real photos (CC BY 4.0), annotated as each word is spoken.
// ---------------------------------------------------------------------------------------------------------------------
const p1: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const FC: Card = {x: 360, y: 520, w: 474, h: 840, pw: 2268, ph: 4032, b: 12};
  const TC: Card = {x: 1130, y: 520, w: 800, h: 840, pw: 2268, ph: 2419, b: 12};
  const tSite = a("s05p1", "site"), tEq = a("s05p1", "equipment"), tPow = a("s05p1", "power"), tBh = a("s05p1", "connection"), tNet = a("s05p1", "rest");
  // targets
  const site = cardPt(FC, 0.69, 0.895), eq = cardPt(TC, 0.592, 0.367), dish = cardPt(TC, 0.564, 0.636), cab = cardPt(TC, 0.575, 0.78);
  const zTop = cardPt(FC, 0.6, 0.12), zBot = cardPt(FC, 0.72, 0.42);        // antenna zone on the wide shot
  const tl: [number, number] = [TC.x - TC.w / 2, TC.y - TC.h / 2 + 30], bl: [number, number] = [TC.x - TC.w / 2, TC.y + TC.h / 2 - 30];
  const z = ease(f, a("s05p1", "needs") + 2, a("s05p1", "needs") + 14, outCubic);
  return (
    <Frame f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.025, 960, 540]]} chip="Photos: Rahulsince93, CC BY 4.0, Wikimedia Commons · labels: Moat & Margin">
      <PhotoPrint f={f} src={FIELDS} x={FC.x} y={FC.y} w={FC.w} h={FC.h} rot={0} border={12} tape={false} halftone={0} enter={{at: -8, mode: "pop"}}/>
      <PhotoPrint f={f} src={TOP} x={TC.x} y={TC.y} w={TC.w} h={TC.h} rot={0} border={12} tape={false} halftone={0} enter={{at: a("s05p1", "needs") - 2, mode: "slide", from: [260, 0], dur: 12}}/>
      <Svg>
        {z > 0 ? <g opacity={z}>
          <rect x={zTop[0]} y={zTop[1]} width={zBot[0] - zTop[0]} height={zBot[1] - zTop[1]} fill="none" stroke={C.white} strokeWidth={4}/>
          <line x1={zBot[0]} y1={zTop[1]} x2={tl[0]} y2={tl[1]} stroke={C.white} strokeWidth={3} strokeDasharray="10 9"/>
          <line x1={zBot[0]} y1={zBot[1]} x2={bl[0]} y2={bl[1]} stroke={C.white} strokeWidth={3} strokeDasharray="10 9"/>
        </g> : null}
        <Leader f={f} at={tSite} from={[250, 885]} to={site} r={30}/>
        <Leader f={f} at={tEq} from={[1735, 330]} to={eq} r={44}/>
        <Leader f={f} at={tPow} from={[1735, 770]} to={cab} r={36} dash/>
        <Leader f={f} at={tBh} from={[1735, 550]} to={dish} r={44}/>
      </Svg>
      <StickerLabel f={f} text="Site" x={250} y={885} size={42} rot={-2} bg={C.teal} color={C.white} enter={{at: tSite - 2, mode: "pop", rot0: -8}}/>
      <StickerLabel f={f} text="Equipment" x={1735} y={330} size={42} rot={2} bg={C.teal} color={C.white} enter={{at: tEq - 2, mode: "pop", rot0: 8}}/>
      <StickerLabel f={f} text="Power" x={1735} y={770} size={42} rot={-2} bg={C.teal} color={C.white} enter={{at: tPow - 2, mode: "pop", rot0: -8}}/>
      <StickerLabel f={f} text="Backhaul" x={1735} y={550} size={42} rot={2} bg={C.teal} color={C.white} enter={{at: tBh - 2, mode: "pop", rot0: 8}}/>
      <Txt f={f} at={tNet} text="to the rest of the network" x={1715} y={606} size={24} weight={600} color={C.inkSoft}/>
    </Frame>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// p2 + p3 Illustration: fixed costs exist first; more phones spread them; capacity runs out; added capacity appears.
// ---------------------------------------------------------------------------------------------------------------------
const PX = 520, PYB = 790, GAUGE0 = 200, GAUGE_W = 640;
const phonePos = (i: number): [number, number] => {
  const ang = i * 2.399963, rr = 175 + 125 * ((i * 0.6180339) % 1);
  return [PX + Math.cos(ang) * rr * 1.18, 520 + Math.sin(ang) * rr * 0.9];
};
const p2: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tFirst = a("s05p2", "next"), tAdd = a("s05p2", "Adding"), tSpread = a("s05p2", "spread"), tCap = a("s05p2", "capacity"), tExp = a("s05p2", "expanding"), tAgain = a("s05p2", "again");
  const tPromise = a("s05p3", "promise");
  const nF = f < tFirst ? 0 : f < tExp ? 1 + 23 * ease(f, tAdd, tCap - 8, inOut) : 24 + 16 * ease(f, tExp + 12, tPromise + 10, inOut);
  const n = Math.floor(nF + 1e-6);
  const ex = ease(f, tExp, tExp + 16, outQuint);
  const limit = 24 + 24 * ex, total = 520 + 220 * ex;
  const fill = (n / 48) * GAUGE_W, atLimit = f >= tCap - 8 && f < tExp + 6 ? 1 : 0;
  const pls = pulse(f, tExp, 22);
  const X0 = 1090, blocks = [["SITE", 0.6], ["EQUIPMENT", 0.95], ["POWER", 1.3], ["BACKHAUL", 1.65]] as [string, number][];
  const lt = a("s05p2", "Some");
  return (
    <Frame f={f} d={d} cam={[[0, 1.0, 960, 540], [tExp, 1.0, 960, 540], [tExp + 14, 1.035, 880, 560, outCubic], [d, 1.03, 900, 556]]} chip="Illustration · not Jio's costs">
      <Svg>
        {/* tower, panels and the ground line */}
        <line x1={170} x2={880} y1={PYB} y2={PYB} stroke={C.grey} strokeWidth={4}/>
        <g><TowerBig x={PX} yb={PYB} h={440} w={150} sw={7}/></g>
        {[-1, 0, 1].map((k) => <PanelG key={k} x={PX + k * 26} y={352 + Math.abs(k) * 22} s={0.9}/>)}
        {[-1, 1].map((k) => <PanelG key={"n" + k} x={PX + k * 46} y={470} s={ex} color={C.rust} op={ex}/>)}
        {ex > 0 ? <circle cx={PX} cy={420} r={90 + 140 * pls} fill="none" stroke={C.rust} strokeWidth={6} opacity={(1 - clamp01((f - tExp) / 22)) * 0.9}/> : null}
        {/* phones served */}
        {Array.from({length: 40}).map((_, i) => {
          const p = clamp01(nF - i);
          if (p <= 0) return null;
          const [x, y] = phonePos(i);
          return <g key={i} opacity={p}><line x1={x} y1={y} x2={PX} y2={470} stroke={C.teal} strokeWidth={2} opacity={0.35}/><PhoneG x={x} y={y} s={0.62 + 0.38 * p} color={C.ink}/></g>;
        })}
        {/* capacity gauge */}
        <rect x={GAUGE0} y={852} width={(GAUGE_W * limit) / 48} height={34} rx={6} fill="none" stroke={C.ink} strokeWidth={4}/>
        {ex > 0 ? <rect x={GAUGE0 + GAUGE_W / 2} y={852} width={(GAUGE_W / 2) * ex} height={34} rx={0} fill={C.rust} opacity={0.22}/> : null}
        <rect x={GAUGE0 + 2} y={854} width={Math.max(0, fill - 4)} height={30} rx={4} fill={atLimit ? C.rust : C.teal}/>
        {/* fixed costs (right) */}
        {blocks.map(([t, at], i) => {
          const p = ease(f, lt + at * 30, lt + at * 30 + 10, outCubic);
          if (p <= 0) return null;
          return <g key={t} opacity={p}><rect x={X0 + i * 130} y={372} width={126} height={78} fill={C.ink}/><text x={X0 + i * 130 + 63} y={418} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={19} fill={C.white}>{t}</text></g>;
        })}
        {ex > 0 ? <g opacity={ex}><rect x={X0 + 520} y={372} width={220 * ex} height={78} fill={C.rust}/>
          {ex > 0.8 ? <text x={X0 + 630} y={418} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={19} fill={C.white}>NEW CAPACITY</text> : null}</g> : null}
        {/* one phone's share of the fixed costs */}
        {n >= 1 ? <rect x={X0} y={566} width={Math.max(4, total / n)} height={50} fill={C.teal}/> : null}
        {n >= 1 ? <line x1={X0} x2={X0 + total} y1={640} y2={640} stroke={C.grey} strokeWidth={3} strokeDasharray="4 10"/> : null}
      </Svg>
      <Txt f={f} at={lt + 12} text="Fixed costs of one site" x={X0} y={336} size={34} align="left"/>
      <Txt f={f} at={tFirst + 4} text="One phone's share" x={X0} y={532} size={34} align="left"/>
      <Txt f={f} at={tFirst + 4} text="PHONES SERVED" x={X0} y={716} size={26} weight={600} color={C.grey} align="left" spacing={2}/>
      {n >= 1 ? <div style={{position: "absolute", left: X0, top: 742, fontFamily: F.serif, fontWeight: 400, fontSize: 110, color: C.ink, lineHeight: 1}}>{n}</div> : null}
      <Txt f={f} at={tFirst + 4} text="Capacity" x={GAUGE0} y={828} size={28} weight={800} align="left"/>
      {ex > 0.5 ? <StickerLabel f={f} text="Capacity added" x={PX + 270} y={380} size={36} rot={3} bg={C.rust} color={C.white} enter={{at: tExp + 6, mode: "pop", rot0: 6}}/> : null}
      <StickerLabel f={f} text="Costs spread" x={1620} y={545} size={36} rot={2} dark enter={{at: a("s05p2", "widely"), mode: "pop", rot0: 8}}/>
      <div style={{position: "absolute", left: 0, right: 0, top: 150, textAlign: "center"}}>
        <Headline f={f} at={tAdd - 4} text="MORE TRAFFIC CAN SPREAD COSTS" y={0} x={1090}/>
      </div>
      <StickerLabel f={f} text="The promise of scale" x={1500} y={900} size={40} rot={-2} bg={C.teal} color={C.white} enter={{at: tPromise, mode: "pop", rot0: -8}}/>
    </Frame>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// p4 "Jio's reported traffic includes home broadband. The Airtel traffic comparison here is mobile only."
// One defining line at a time, each filling most of the frame width (readable on a phone). Icons: phone + house for Jio,
// phone for Airtel. Sources: RHP KPI note 4 (p.132) and RHP peer-table note 6 (p.137).
// ---------------------------------------------------------------------------------------------------------------------
const LineShot: React.FC<{f: number; d: number; who: "jio" | "airtel"; tInc: number; tHome: number; tMob: number}> = ({f, d, who, tInc, tHome, tMob}) => {
  const jio = who === "jio", J = jio ? JL : AL, w = jio ? 1640 : 1500;
  return (
    <Frame f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.02, 960, 540]]}
      chip={jio ? "Jio Platforms RHP · KPI definitions, note 4 · p.132" : "Jio Platforms RHP · peer table, Bharti Airtel note 6 · p.137"}>
      <Svg>
        <PhoneG x={jio ? 840 : 960} y={250} s={2.8} color={C.ink}/>
        {jio ? <g opacity={ease(f, tHome - 8, tHome)}><text x={915} y={274} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={84} fill={C.teal}>+</text>
          <HouseG x={1030} y={254} s={2.8} color={C.teal}/></g> : null}
      </Svg>
      <EntityTag f={f} at={-20} text={jio ? ENTITY.jioPlat : ENTITY.airtel} period="FY26" x={960 - w / 2 + 20} y={412} anchor="left" size={30}/>
      <DocPage f={f} src={jio ? "scale/docs/sc05_jio_line.png" : "scale/docs/sc05_airtel_line.png"} imgW={J.w} imgH={J.h} x={960} y={570} width={w} margin={0.06}
        enter={{at: -14, mode: "slide-up", dur: 12}} highlights={[{rects: [[0, 0, J.w, J.h]] as Rect[], at: jio ? tInc : tMob, dur: 24}]}/>
      <StickerLabel f={f} text={jio ? "Mobile + home broadband" : "Mobile only"} x={960} y={790} size={44} rot={jio ? -1.5 : 1.5} bg={jio ? C.teal : C.ink} color={C.white}
        enter={{at: jio ? tHome + 4 : tMob + 20, mode: "pop", rot0: 6}}/>
    </Frame>
  );
};
const p4a: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return <LineShot f={f} d={d} who="jio" tInc={a("s05p4", "includes")} tHome={a("s05p4", "home")} tMob={0}/>;
};
const p4b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return <LineShot f={f} d={d} who="airtel" tInc={0} tHome={0} tMob={a("s05p4", "mobile")}/>;
};

// ---------------------------------------------------------------------------------------------------------------------
// p5 "Divide costs by those different traffic totals, and you risk comparing different kinds of networks."
// A proposed cost / traffic division starts; it is stopped when the scope difference appears.
// ---------------------------------------------------------------------------------------------------------------------
const Frac: React.FC<{f: number; x: number; name: string; house?: boolean; tCost: number; tTraf: number; tBar: number; tStop: number}> = ({f, x, name, house, tCost, tTraf, tBar, tStop}) => {
  const c = ease(f, tCost, tCost + 12, outQuint), t = ease(f, tTraf, tTraf + 12, outQuint), bar = ease(f, tBar, tBar + 16, inOut);
  const stop = ease(f, tStop, tStop + 6, outCubic);
  const jolt = f >= tStop && f < tStop + 8 ? Math.sin((f - tStop) * 2.4) * 6 : 0;
  return (
    <>
      <Txt f={f} at={-20} text={name} x={x - 190} y={236} size={44} align="left" spacing={2}/>
      <div style={{position: "absolute", left: x - 190, top: 340 - (1 - c) * 80, width: 380, height: 96, background: C.ink, opacity: c, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: C.white, letterSpacing: 2}}>COST</div>
      <div style={{position: "absolute", left: x - 190, top: 520 + (1 - t) * 80, width: 380, height: 150, background: C.white, opacity: t, boxShadow: "0 3px 4px rgba(30,20,10,0.16), 0 14px 28px rgba(30,20,10,0.18)"}}>
        <div style={{position: "absolute", left: 22, top: 12, fontFamily: F.sans, fontWeight: 800, fontSize: 24, color: C.grey, letterSpacing: 2}}>TRAFFIC</div>
        <svg width={380} height={150} style={{position: "absolute", left: 0, top: 0}}>
          <PhoneG x={house ? 120 : 190} y={92} s={1.2} color={C.ink}/>
          {house ? <><text x={190} y={104} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={44} fill={C.teal}>+</text><HouseG x={262} y={92} s={1.2} color={C.teal}/></> : null}
        </svg>
      </div>
      <Svg>
        {bar > 0.02 ? <line x1={x - 190} x2={x - 190 + 380 * bar} y1={478} y2={478} stroke={stop > 0 ? C.rust : C.ink} strokeWidth={8} strokeLinecap="round" strokeDasharray={stop > 0 ? "28 18" : undefined}/> : null}
        {stop > 0 ? <g transform={`translate(${jolt} 0)`} opacity={stop}>
          <circle cx={x + 250} cy={478} r={44} fill="none" stroke={C.grey} strokeWidth={5} strokeDasharray="10 9"/>
          <text x={x + 250} y={494} textAnchor="middle" fontFamily={F.serif} fontWeight={400} fontSize={50} fill={C.grey}>?</text>
        </g> : null}
      </Svg>
    </>
  );
};
const p5: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tStop = a("s05p5", "you"), st = ease(f, tStop, tStop + 8, outCubic);
  return (
    <Frame f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.02, 960, 540]]} chip="Proposed division, stopped · not calculated">
      <Frac f={f} x={520} name="JIO" house tCost={a("s05p5", "costs") - 4} tTraf={-20} tBar={a("s05p5", "totals") - 4} tStop={tStop}/>
      <Frac f={f} x={1400} name="AIRTEL" tCost={a("s05p5", "costs") - 2} tTraf={-20} tBar={a("s05p5", "totals") - 2} tStop={tStop}/>
      <Svg>
        <rect x={954} y={300} width={12} height={(400) * st} fill={C.rust}/>
        {st > 0.9 ? <g><circle cx={960} cy={500} r={38} fill={C.paper} stroke={C.rust} strokeWidth={7}/><text x={960} y={518} textAnchor="middle" fontFamily={F.serif} fontWeight={400} fontSize={52} fill={C.rust}>≠</text></g> : null}
      </Svg>
      <div style={{position: "absolute", left: 0, right: 0, top: 800}}><Headline f={f} at={a("s05p5", "comparing") - 4} text="Comparison limit: mobile + home broadband vs mobile" y={0} size={38} bg={C.ink}/></div>
    </Frame>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// p6 "Scale gives Jio a plausible cost advantage. The available comparison doesn't tell us its precise size."
// ---------------------------------------------------------------------------------------------------------------------
const Card2: React.FC<{f: number; at: number; x: number; y: number; big: string; sub: string; kind: "yes" | "no"}> = ({f, at, x, y, big, sub, kind}) => {
  const e = spr(f, at, 13, 160);
  if (e <= 0.001) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, width: 720, height: 360, transform: `translate(-50%, -50%) translateY(${(1 - e) * 220}px)`, opacity: clamp01(e * 2), background: C.white,
      boxShadow: "0 3px 4px rgba(30,20,10,0.16), 0 18px 34px rgba(30,20,10,0.2)", border: kind === "no" ? `6px dashed ${C.grey}` : undefined, borderLeft: kind === "yes" ? `18px solid ${C.teal}` : undefined,
      padding: "40px 48px", boxSizing: "border-box"}}>
      <svg width={120} height={120} viewBox="0 0 120 120" style={{position: "absolute", right: 36, top: 30}}>
        {kind === "yes" ? <><circle cx={60} cy={60} r={52} fill={C.teal}/><path d="M 32 62 L 53 83 L 90 38" fill="none" stroke={C.white} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round"/></>
          : <><circle cx={60} cy={60} r={52} fill="none" stroke={C.grey} strokeWidth={7} strokeDasharray="12 9"/><text x={60} y={82} textAnchor="middle" fontFamily={F.serif} fontWeight={400} fontSize={72} fill={C.grey}>?</text></>}
      </svg>
      <div style={{fontFamily: F.serif, fontWeight: 400, fontSize: 64, color: C.ink, lineHeight: 1.05, maxWidth: 520}}>{big}</div>
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 34, color: C.grey, marginTop: 22}}>{sub}</div>
    </div>
  );
};
const p6: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Frame f={f} d={d} cam={[[0, 1.0, 960, 540], [d, 1.025, 960, 540]]} chip="Moat & Margin · reading of the disclosures">
      <Card2 f={f} at={-2} x={520} y={480} big="Plausible cost advantage" sub="more traffic can spread costs" kind="yes"/>
      <Card2 f={f} at={a("s05p6", "precise") - 8} x={1400} y={480} big="Precise size: not shown" sub="mobile + home broadband vs mobile" kind="no"/>
    </Frame>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// p7 "And capacity depends on another resource, one you can't see from the street: spectrum."
// The tower photo pushes into the antenna; radio arcs appear; the match-zoom lands on the spectrum strip in scene 06.
// ---------------------------------------------------------------------------------------------------------------------
const AX7 = 1037, AY7 = 819;
const p7: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tSee = a("s05p7", "street"), tSp = a("s05p7", "spectrum");
  const cam = camAt(f, [[0, 0.92, 960, 640], [a("s05p7", "another"), 1.0, 1000, 760, inOut], [d, 2.35, AX7, AY7, inOut]]);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Layer cam={cam}>
        <Img src={V(TOP)} style={{position: "absolute", left: 0, top: 0, width: 1920, height: 2048}}/>
        <Svg>
          <Arcs f={f} at={tSee - 10} cx={AX7 + 20} cy={AY7 - 20} radii={[110, 190, 270, 350, 430]} color={C.white} sw={10} span={50} gap={9}/>
        </Svg>
      </Layer>
      <StickerLabel f={f} text="Can't see it from the street" x={960} y={170} size={50} rot={-1.5} bg={C.paper} color={C.ink} enter={{at: tSee - 4, mode: "pop", rot0: -6}}/>
      <StickerLabel f={f} text="Spectrum" x={960} y={870} size={64} rot={1.5} bg={C.teal} color={C.white} enter={{at: tSp - 2, mode: "pop", rot0: 6}}/>
      <SourceTag f={f} at={0} text="Photo: Rahulsince93, CC BY 4.0, Wikimedia Commons"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

export const SHOTS05: Shot[] = [
  S("s05p1", 0, MZ, p1a, "s05-tower-full"),
  S("s05p1", "site|-0.2", WL, p1, "s05-towerphoto"),
  S("s05p2", 0, PU, p2, "s05-schematic"),
  S("s05p4", "Jio's|-0.1", WL, p4a, "s05-traffic-jio"),
  S("s05p4", "The Airtel|-0.1", PU, p4b, "s05-traffic-airtel"),
  S("s05p5", 0, H0, p5, "s05-division"),
  S("s05p6", 0, PU, p6, "s05-plausible"),
  S("s05p7", 0, WL, p7, "s05-antenna"),
];
export const CUES05: SCue[] = [
  [W("s05p1", "site") - 0.05, "pop", 0.35],
  [W("s05p2", "expanding") - 0.05, "ding", 0.4],
  [W("s05p4", "includes") - 0.05, "highlighter", 0.4],
  [W("s05p5", "you") - 0.05, "click", 0.4],
  [W("s05p7", "spectrum") - 0.2, "whoosh", 0.3],
];
