// Scene 01 | opening (revised 20 Oct 2026, AK + reviewer): a concrete surprise in the first ten seconds.
// s01p1 "For every hundred rupees Jio earns, about twenty become profit. But that still doesn't tell us how much cash is left."
//   recharge -> Rs 100 of revenue -> ~Rs 20.5 net profit -> CASH LEFT?  (Jio Platforms consolidated FY26, NOT one recharge)
// s01p2 "To understand that, we need to look at its network, its customers - and the bills still to come."
//   full-screen tower photo -> full-screen commuters photo -> the cash calendar with bills arriving.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Layer, camAt} from "./kit/Camera";
import {SourceTag} from "./kit/Cards";
import {PhotoPrint, StickerLabel} from "./kit/Collage";
import {SCue} from "./kit/A01V4Cold";
import {Paper, SP, Shot} from "./kit/A01V4Parts";
import {Finish, InkSurface} from "./kit/Texture";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr, useTicks} from "./kit/tokens";
import {CashCalendar, ENTITY, EntityTag, PaymentMarker, RechargePhone, makeNet} from "./devices";
import {H0, MZ, PU, S, W, WL, useAt} from "./cue";

export const NET = makeNet("jio-net", 28);

/** Screen line used in 01 (and echoed in 12). */
export const RouteTitle: React.FC<{f: number; at: number; y?: number; a?: string; b?: string}> = ({f, at, y = 120, a = "YOUR RECHARGE", b = "JIO'S BUSINESS"}) => {
  const p = ease(f, at, at + 10, outCubic), q = ease(f, at + 8, at + 18, outCubic);
  if (p <= 0) return null;
  return (
    <div style={{position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", alignItems: "center", gap: 28,
      fontFamily: F.sans, fontWeight: 800, fontSize: 46, letterSpacing: 1}}>
      <span style={{background: C.ink, color: C.white, padding: "10px 24px", opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>{a}</span>
      <span style={{color: C.ink, opacity: q, fontSize: 60}}>→</span>
      <span style={{background: C.highlight, color: C.ink, padding: "10px 24px", opacity: q, transform: `translateY(${(1 - q) * 30}px)`}}>{b}</span>
    </div>
  );
};

/** Big rupee figure in the serif (the rupee sign falls back to Inter). */
const Rs: React.FC<{f: number; at: number; v: string; x: number; y: number; size?: number; color?: string}> = ({f, at, v, x, y, size = 200, color = C.ink}) => {
  const s = spr(f, at, 11, 200);
  if (s <= 0.001) return null;
  return <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${1.4 - 0.4 * s})`, opacity: clamp01(s * 3),
    filter: s < 0.8 ? `blur(${((0.8 - s) * 16).toFixed(1)}px)` : undefined, fontFamily: F.serif, fontSize: size, color, lineHeight: 1, whiteSpace: "nowrap"}}>{v}</div>;
};

// o1: tight on the recharge; Pay -> Paid at once; on "hundred rupees" Rs 100 lands beside it, labelled Jio Platforms (not this recharge)
const o1: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const h = a("s01p1", "hundred");
  const cam = camAt(f, [[0, 1.45, 820, 640], [h - 4, 1.4, 820, 630], [d, 1.0, 960, 560, inOut]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        <RechargePhone f={f} x={600} y={560} s={0.8} tapAt={2} rot={-3}/>
        <PaymentMarker f={f} at={10} dur={Math.max(8, h - 10)} path={[[600, 840], [760, 560], [1100, 480]]} size={64}/>
        <Rs f={f} at={h} v="₹100" x={1290} y={470} size={230}/>
        <div style={{position: "absolute", left: 1290, top: 620, transform: "translateX(-50%)", fontFamily: F.sans, fontWeight: 800, fontSize: 30, letterSpacing: 2,
          color: C.ink, opacity: ease(f, h + 6, h + 14)}}>OF REVENUE</div>
        <EntityTag f={f} at={h + 10} text={ENTITY.jioPlat} period="FY26" x={1290} y={700} anchor="center" size={22}/>
        <div style={{position: "absolute", left: 1290, top: 760, transform: "translateX(-50%)", fontFamily: F.sans, fontWeight: 600, fontSize: 24, color: C.grey,
          opacity: ease(f, h + 16, h + 24), whiteSpace: "nowrap"}}>the whole company's revenue, not one recharge</div>
      </Layer>
      <RouteTitle f={f} at={4}/>
      <SourceTag f={f} at={0} text="Illustration · generic recharge screen"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// o2 ("about twenty" ... end of p1): Rs 100 bar from the first frame; Rs 20.5 net profit grows on "twenty"; on "But" the chart
// slides left and "Cash left?" lands on "cash"
const o2: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tw = a("s01p1", "twenty"), but = a("s01p1", "But"), cash = a("s01p1", "cash");
  const g = ease(f, tw - 2, tw + 16, outQuint), slide = ease(f, but, but + 14, inOut);
  const base = 880, k = 5.4;
  return (
    <AbsoluteFill>
      <InkSurface glow={0.08}/>
      <div style={{position: "absolute", inset: 0, transform: `translateX(${-330 * slide}px) scale(${1 - 0.18 * slide})`, transformOrigin: "50% 60%"}}>
        <div style={{position: "absolute", left: 620, top: base - 100 * k, width: 260, height: 100 * k, background: C.white}}/>
        <div style={{position: "absolute", left: 620, width: 260, top: base - 100 * k - 120, textAlign: "center", fontFamily: F.serif, fontSize: 96, color: C.white}}>₹100</div>
        <div style={{position: "absolute", left: 620, width: 260, top: base + 20, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 28, color: C.grey, letterSpacing: 2}}>REVENUE</div>
        <div style={{position: "absolute", left: 1040, top: base - 20.5 * k * g, width: 260, height: 20.5 * k * g, background: C.highlightPrint}}/>
        <div style={{position: "absolute", left: 1040, width: 260, top: base - 20.5 * k - 120, textAlign: "center", fontFamily: F.serif, fontSize: 96, color: C.highlightPrint,
          opacity: clamp01((g - 0.4) * 2)}}>~₹20.5</div>
        <div style={{position: "absolute", left: 1040, width: 260, top: base + 20, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 28, color: C.grey, letterSpacing: 2,
          opacity: g}}>NET PROFIT</div>
        <div style={{position: "absolute", left: 300, right: 300, top: base, height: 3, background: C.grey}}/>
        <EntityTag f={f} at={0} text={ENTITY.jioPlat} period="FY26 · PER ₹100 OF REVENUE" x={960} y={150} anchor="center" dark size={22}/>
      </div>
      <div style={{position: "absolute", left: 1330, top: 380, opacity: ease(f, cash - 4, cash + 8), transform: `translateY(${(1 - ease(f, cash - 4, cash + 8, outCubic)) * 40}px)`}}>
        <div style={{fontFamily: F.serif, fontSize: 150, color: C.white, lineHeight: 1}}>Cash</div>
        <div style={{fontFamily: F.serif, fontSize: 150, lineHeight: 1}}><span style={{background: C.highlight, color: C.ink, padding: "0 18px"}}>left?</span></div>
      </div>
      <SourceTag f={f} at={0} text="Jio RHP p.330 · restated P&L FY26 · our calculation" dark/>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};

// o3 "its network": full-screen tower photo
const o3: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const cam = camAt(f, [[0, 1.08, 960, 560], [d, 1.0, 960, 520, outCubic]]);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Layer cam={cam}>
        <PhotoPrint f={f} src="jio/media/tower_in_todabhim_fields_print.jpg" x={960} y={540} w={1880} h={1040} rot={0} border={0} tape={false} halftone={0.1}
          enter={{at: -2, mode: "none"}} crop={{s0: 1.0, s1: 1.12, fx: 0.5, fy: 0.3, dur: d}}/>
      </Layer>
      <StickerLabel f={f} text="Its network" x={1450} y={820} size={74} rot={-3} dark enter={{at: a("s01p2", "network") - 2, mode: "pop", rot0: -10}}/>
      <SourceTag f={f} at={0} text="Photo: Rahulsince93, CC BY 4.0, Wikimedia Commons"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
// o4 "its customers": full-screen commuters photo
const o4: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  const cam = camAt(f, [[0, 1.0, 960, 540], [d, 1.08, 960, 560]]);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Layer cam={cam}>
        <PhotoPrint f={f} src="jio/media/crowd_dumdum_platform_print.jpg" x={960} y={540} w={1880} h={1040} rot={0} border={0} tape={false} halftone={0.1}
          enter={{at: -2, mode: "none"}} crop={{s0: 1.05, s1: 1.15, dur: d}}/>
      </Layer>
      <StickerLabel f={f} text="Its customers" x={480} y={820} size={74} rot={2} dark enter={{at: 0, mode: "pop", rot0: 8}}/>
      <SourceTag f={f} at={0} text="Photo: Projjalm, CC0, Wikimedia Commons"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
// o5 "and the bills still to come": the cash calendar; payment dots land in future months
const o5: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const b = a("s01p2", "bills");
  const cam = camAt(f, [[0, 1.08, 960, 540], [d, 1.0, 960, 540, outCubic]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        <CashCalendar f={f} at={-6} x={960} y={520} w={760} marks={[3, 6, 9, 11].map((i, n) => ({i, at: b + n * 4}))}/>
      </Layer>
      <StickerLabel f={f} text="Bills still to come" x={1460} y={900} size={58} rot={-2} bg={C.markerRed} color={C.white} enter={{at: b + 2, mode: "pop", rot0: -8}}/>
      <SourceTag f={f} at={0} text="Concept · the calendar shows no amounts or dates"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

export const SHOTS01: Shot[] = [
  S("s01p1", 0, H0, o1, "s01-o1"), S("s01p1", "about|-0.15", MZ, o2, "s01-o2"),
  S("s01p2", 0, WL, o3, "s01-o3"), S("s01p2", "its customers|-0.1", H0, o4, "s01-o4"), S("s01p2", "and the bills|-0.05", PU, o5, "s01-o5"),
];
export const CUES01: SCue[] = [[W("s01p1", 0.12), "ding", 0.5], [W("s01p1", "twenty"), "pop", 0.35], [W("s01p2", "bills"), "paper", 0.4]];
