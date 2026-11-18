// Scene 02 | 0:10-0:55 | Establish the contradiction (AK brief): the network becomes a schematic India outline with
// illustrative subscriber dots (not geographic data), then the sourced TRAI ranking with date and definition; two
// questions below (customer count / earnings per customer), the payment marker moves to the second; the title
// "Jio's size advantage has a catch" is built into the image (no separate title break).
import React from "react";
import {AbsoluteFill, random} from "remotion";
import {geoContains} from "d3-geo";
import {Layer, camAt} from "./kit/Camera";
import {SourceTag} from "./kit/Cards";
import {StickerLabel} from "./kit/Collage";
import {MapRoute, fitProjection, useGeo} from "./kit/MapRoute";
import {SCue} from "./kit/A01V4Cold";
import {Desk, Paper, SP, Shot} from "./kit/A01V4Parts";
import {Finish} from "./kit/Texture";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr, useTicks} from "./kit/tokens";
import {Network, PaymentMarker, RechargePhone} from "./devices";
import {NET} from "./sc01";
import {H0, PU, S, W, WL, WR, useAt} from "./cue";

const IND_PROJ = fitProjection([66, 5.5, 99, 37.5]);
const MAP_FILL = "#DCE8E4";

/** India outline with seeded illustrative dots (uniform scatter inside the border: NOT customer density). */
const DotMap: React.FC<{f: number; at: number; n?: number; inkAt?: number}> = ({f, at, n = 900, inkAt = -40}) => {
  const geo = useGeo();
  const ind = geo ? geo.features.find((g) => g.properties.a3 === "IND") : null;
  return (
    <>
      <MapRoute f={f} geo={geo} inkAt={inkAt} credit={false} focusFill={MAP_FILL}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        {ind ? Array.from({length: n}).map((_, i) => {
          const t = at + (i / n) * 40;
          if (f < t) return null;
          const lon = 68.5 + random("sd-x" + i) * 28, lat = 8 + random("sd-y" + i) * 27;
          if (!geoContains(ind as never, [lon, lat])) return null;
          const [x, y] = IND_PROJ([lon, lat]) as [number, number];
          return <circle key={i} cx={x} cy={y} r={5 * spr(f, t, 10, 220)} fill={C.teal} opacity={0.75}/>;
        }) : null}
      </svg>
    </>
  );
};

/** Horizontal ranking bars on charcoal (TRAI, wireless subscribers, 30 Jun 2026; crore). */
const ROWS = [{l: "Jio", v: 51.76}, {l: "Airtel", v: 49.06}, {l: "Vodafone Idea", v: 19.88}, {l: "BSNL", v: 9.30}];
const Ranking: React.FC<{f: number; at: number}> = ({f, at}) => (
  <div style={{position: "absolute", left: 260, top: 300, width: 1400}}>
    <div style={{fontFamily: F.serif, fontWeight: 400, fontSize: 50, color: C.white, marginBottom: 10}}>Wireless subscribers, crore</div>
    <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 26, color: C.grey, marginBottom: 40}}>TRAI · wireless subscribers as reported · as of 30 June 2026</div>
    {ROWS.map((r, i) => {
      const p = ease(f, at + i * 7, at + i * 7 + 22, outQuint);
      return (
        <div key={r.l} style={{display: "flex", alignItems: "center", height: 96, opacity: clamp01(p * 3)}}>
          <div style={{width: 300, fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: i === 0 ? C.highlightPrint : C.white}}>{r.l}</div>
          <div style={{height: 56, width: (r.v / 55) * 900 * p, background: i === 0 ? C.teal : "#55514B"}}/>
          <div style={{marginLeft: 22, fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: C.white}}>{(r.v * p).toFixed(2)}</div>
        </div>
      );
    })}
  </div>
);

// p1 "Jio built India's largest subscriber base." network settles into the India outline, dots appear
const b1: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const cam = camAt(f, [[0, 1.12, 960, 560], [d, 1.0, 960, 540, outCubic]]);
  const fade = 1 - ease(f, 0, 24);
  return (
    <AbsoluteFill style={{background: C.mapWater}}>
      <Layer cam={cam}><DotMap f={f} at={a("s02p1", "largest") - 10} inkAt={0}/></Layer>
      <AbsoluteFill style={{opacity: fade}}><Paper/><Network f={f} net={NET} grow={1}/></AbsoluteFill>
      <StickerLabel f={f} text="Largest subscriber base" x={1380} y={240} size={56} rot={-2} dark enter={{at: a("s02p1", "largest"), mode: "pop", rot0: -10}}/>
      <SourceTag f={f} at={0} text="Illustration · dots are not customer locations"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
// "That should give it an advantage": the sourced ranking, date and definition visible
const b2: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  return (
    <Desk f={f} d={d} tone="ink" cam={[[0, 1.0, 960, 540], [d, 1.04, 960, 520]]} chip="TRAI performance indicators · Apr-Jun 2026 · Table 1.11">
      <Ranking f={f} at={2}/>
    </Desk>
  );
};
// "More customers sharing the cost of a vast network": network with many small users feeding one shared cost
const b3: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const cam = camAt(f, [[0, 1.0, 900, 540], [d, 1.05, 1000, 540]]);
  const share = ease(f, a("s02p1", "sharing"), a("s02p1", "sharing") + 30);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        <Network f={f} net={NET} grow={1} pulseAt={0}/>
        <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
          {Array.from({length: 60}).map((_, i) => {
            const n = NET.nodes[i % NET.nodes.length], ang = random("u" + i) * Math.PI * 2, r = 60 + random("r" + i) * 40;
            const x = n[0] + Math.cos(ang) * r, y = n[1] + Math.sin(ang) * r, p = spr(f, a("s02p1", "More") + i * 0.6, 12, 200);
            return <g key={i} opacity={p}><line x1={x} y1={y} x2={x + (n[0] - x) * share} y2={y + (n[1] - y) * share} stroke={C.rust} strokeWidth={2} opacity={0.5}/>
              <circle cx={x} cy={y} r={8 * p} fill={C.rust}/></g>;
          })}
        </svg>
      </Layer>
      <StickerLabel f={f} text="One network, shared cost" x={960} y={960} size={56} rot={-1.5} dark enter={{at: a("s02p1", "sharing"), mode: "slide", from: [0, 300], dur: 9}}/>
      <SourceTag f={f} at={0} text="Illustration"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
// p2-p4 (reviewer): ONE contrast instead of three cards. Left "More customers" (answered by size, ticked); right "Better
// economics?" (what each customer earns, what investment it takes); the payment marker crosses to the right; Airtel joins it.
const Panel: React.FC<{f: number; at: number; x: number; title: string; sub: string; lit?: number; dim?: number; children?: React.ReactNode}> =
  ({f, at, x, title, sub, lit = 0, dim = 0, children}) => {
    const e = spr(f, at, 13, 160);
    if (e <= 0.001) return null;
    return (
      <div style={{position: "absolute", left: x, top: 540, width: 760, height: 620, transform: `translate(-50%, -50%) translateY(${(1 - e) * 200}px)`,
        opacity: clamp01(e * 2) * (1 - 0.45 * dim), background: C.white, boxShadow: `0 3px 4px rgba(30,20,10,0.16), 0 22px 40px rgba(30,20,10,0.22), 0 0 0 ${10 * lit}px ${C.highlight}`}}>
        <div style={{position: "absolute", left: 50, top: 46, fontFamily: F.sans, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: C.grey}}>{sub}</div>
        <div style={{position: "absolute", left: 50, top: 92, right: 40, fontFamily: F.serif, fontSize: 92, lineHeight: 1, color: C.ink}}>{title}</div>
        {children}
      </div>
    );
  };
const b4: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const q2 = a("s02p3", "how much each"), inv = a("s02p3", "investment"), mv = a("s02p4", "follow"), air = a("s02p4", "Airtel");
  const cam = camAt(f, [[0, 1.0, 960, 540], [mv, 1.0, 960, 540], [d, 1.05, 1200, 540, inOut]]);
  const tick = ease(f, a("s02p2", "how many") , a("s02p2", "how many") + 10, outCubic);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper tone="cream" drift={f / d}/></Layer>
      <Layer cam={cam}>
        <Panel f={f} at={-4} x={520} sub="SIZE ANSWERS" title="More customers" dim={ease(f, q2, q2 + 12)}>
          <svg width={760} height={620} style={{position: "absolute", left: 0, top: 0}}>
            {Array.from({length: 54}).map((_, i) => <circle key={i} cx={90 + (i % 9) * 70} cy={330 + Math.floor(i / 9) * 44} r={13} fill={C.teal}
              opacity={ease(f, 2 + i * 0.5, 8 + i * 0.5)}/>)}
            <path d="M 600 330 L 650 380 L 730 280" fill="none" stroke={C.teal} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" pathLength={1}
              strokeDasharray={1} strokeDashoffset={1 - tick}/>
          </svg>
        </Panel>
        <Panel f={f} at={q2 - 4} x={1400} sub="SIZE DOESN'T ANSWER" title="Better economics?" lit={ease(f, mv + 18, mv + 28)}>
          <div style={{position: "absolute", left: 50, top: 330, fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: C.ink, opacity: ease(f, q2 + 6, q2 + 14)}}>
            ₹ earned per customer?</div>
          <div style={{position: "absolute", left: 50, top: 410, fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: C.ink, opacity: ease(f, inv, inv + 8)}}>
            Investment to keep them?</div>
          <div style={{position: "absolute", left: 50, top: 500, fontFamily: F.sans, fontWeight: 800, fontSize: 30, letterSpacing: 2, color: C.white, background: C.teal,
            padding: "10px 22px", opacity: ease(f, air, air + 8)}}>COMPARE: AIRTEL</div>
        </Panel>
        <RechargePhone f={f} x={230} y={900} s={0.26} enterAt={mv - 12} rot={-4}/>
        <PaymentMarker f={f} at={mv} dur={a("s02p4", "Then") - mv} path={[[230, 840], [700, 960], [1150, 880], [1400, 760]]} size={58}/>
      </Layer>
      <SourceTag f={f} at={0} text="Moat & Margin · the question"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
// p5 "Because a network can be enormous, while the financial advantage it creates is much smaller than you expect."
// the title lands inside the image: the big network pulls back, a small teal disc remains: the advantage
const b5: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const sm = a("s02p5", "much smaller");
  const cam = camAt(f, [[0, 1.1, 960, 560], [sm, 0.9, 960, 560, inOut], [d, 0.86, 960, 560]]);
  const shrink = ease(f, sm, sm + 24, inOut), t = ease(f, a("s02p5", "financial") - 4, a("s02p5", "financial") + 10, outCubic);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        <div style={{opacity: 1 - 0.65 * shrink}}><Network f={f} net={NET} grow={1} pulseAt={0}/></div>
        <div style={{position: "absolute", left: 960, top: 560, width: 520 - 380 * shrink, height: 520 - 380 * shrink, borderRadius: "50%", transform: "translate(-50%, -50%)",
          border: `10px solid ${C.teal}`, background: "rgba(47,127,122,0.12)", opacity: ease(f, a("s02p5", "financial") - 6, a("s02p5", "financial") + 6)}}/>
      </Layer>
      <div style={{position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", opacity: t, transform: `translateY(${(1 - t) * 30}px)`}}>
        <span style={{fontFamily: F.serif, fontWeight: 400, fontSize: 92, color: C.ink, background: C.white, padding: "8px 28px", boxShadow: "0 12px 30px rgba(0,0,0,0.15)"}}>
          Jio’s size advantage <span style={{color: C.rust}}>has a catch</span></span>
      </div>
      <StickerLabel f={f} text="Enormous network" x={420} y={930} size={46} rot={-2} dark enter={{at: a("s02p5", "enormous"), mode: "pop", rot0: -8}}/>
      <StickerLabel f={f} text="Smaller advantage?" x={1500} y={930} size={46} rot={2} bg={C.teal} color={C.white} enter={{at: sm + 6, mode: "pop", rot0: 8}}/>
      <SourceTag f={f} at={0} text="Moat & Margin"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

export const SHOTS02: Shot[] = [
  S("s02p1", 0, H0, b1, "s02-b1"), S("s02p1", "That should|-0.1", WL, b2, "s02-b2"), S("s02p1", "More customers|-0.15", PU, b3, "s02-b3"),
  S("s02p2", 0, WR, b4, "s02-b4"), S("s02p5", 0, PU, b5, "s02-b5"),
];
export const CUES02: SCue[] = [[W("s02p1", "largest"), "pop", 0.3], [W("s02p3", "how much each"), "paper", 0.4], [W("s02p5", "much smaller"), "whoosh", 0.3]];
