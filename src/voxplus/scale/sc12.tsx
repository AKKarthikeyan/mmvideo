// Scene 12 | Return to the recharge (AK brief): the identical phone shot from 01, then the complete path underneath it:
// revenue -> operating expenses -> investment and obligations -> cash and returns. Assessment card (NARROW MOAT, our
// editorial assessment), the three watch items in sequence, close on the payment confirmation inside the system the viewer
// now understands, brief call to action, end card "Sources and calculations in the description."
import React from "react";
import {AbsoluteFill} from "remotion";
import {Layer, camAt} from "./kit/Camera";
import {SourceTag} from "./kit/Cards";
import {SCue} from "./kit/A01V4Cold";
import {Desk, Paper, SP, Shot} from "./kit/A01V4Parts";
import {Finish} from "./kit/Texture";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr, useTicks} from "./kit/tokens";
import {Network, PaymentMarker, RechargePhone} from "./devices";
import {NET} from "./sc01";
import {H0, MZ, PU, S, W, WL, useAt} from "./cue";

const STATIONS = ["Revenue", "Operating expenses", "Investment and obligations", "Cash and returns"];
const SX = [560, 900, 1240, 1580], SY = 560;

/** The economic path under the recharge: four stations joined by a teal line; `lit` per station (0..1), `warn` tints in rust. */
const Path: React.FC<{f: number; at: number; lit: number[]; warn?: number[]; y?: number}> = ({f, at, lit, warn = [], y = SY}) => {
  const draw = ease(f, at, at + 30, inOut);
  return (
    <>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <line x1={SX[0]} x2={SX[0] + (SX[3] - SX[0]) * draw} y1={y} y2={y} stroke={C.teal} strokeWidth={8} strokeLinecap="round"/>
      </svg>
      {STATIONS.map((s, i) => {
        const p = spr(f, at + i * 7, 13, 170), w = warn.includes(i);
        return (
          <div key={s} style={{position: "absolute", left: SX[i], top: y, transform: `translate(-50%, -50%) scale(${p})`, opacity: clamp01(p * 2)}}>
            <div style={{width: 46, height: 46, margin: "0 auto", borderRadius: "50%", background: w ? C.rust : lit[i] > 0.5 ? C.teal : C.white,
              border: `6px solid ${w ? C.rust : C.teal}`, boxShadow: lit[i] > 0.5 ? `0 0 0 ${10 * lit[i]}px rgba(47,127,122,0.2)` : undefined}}/>
            <div style={{position: "absolute", left: "50%", top: 64, transform: "translateX(-50%)", width: 300, textAlign: "center", fontFamily: F.sans, fontWeight: 800,
              fontSize: 34, lineHeight: 1.1, color: w ? C.rust : C.ink}}>{s}</div>
          </div>
        );
      })}
    </>
  );
};
const Chip: React.FC<{f: number; at: number; text: string; x: number; y: number; tone?: "teal" | "rust" | "ink"}> = ({f, at, text, x, y, tone = "teal"}) => {
  const p = spr(f, at, 13, 170);
  if (p <= 0.001) return null;
  const bg = tone === "teal" ? C.teal : tone === "rust" ? C.rust : C.ink;
  return <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${p})`, background: bg, color: C.white, fontFamily: F.sans,
    fontWeight: 800, fontSize: 36, padding: "12px 24px", whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(0,0,0,0.18)"}}>{text}</div>;
};

// z1 "So let's return to this recharge." the identical phone framing from 01 (already paid)
const z1: React.FC<SP> = ({s0, d}) => {
  const f = useTicks();
  const cam = camAt(f, [[0, 1.55, 960, 700], [d, 1.42, 960, 680, inOut]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}><RechargePhone f={f} x={960} y={560} s={0.82} tapAt={-40} rot={-2}/></Layer>
      <SourceTag f={f} at={0} text="Illustration · generic recharge screen"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
// z2-z3: pull back; the path appears underneath; scale/spectrum/retention ticked; then the costs that decide it
const z2: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const but = a("s12p3", "But scale");
  const cam = camAt(f, [[0, 1.12, 900, 560], [but, 1.0, 960, 560, inOut], [d, 1.03, 1000, 560]]);
  const lit = [ease(f, 20, 30), ease(f, a("s12p3", "maintaining"), a("s12p3", "maintaining") + 10), ease(f, a("s12p3", "financing"), a("s12p3", "financing") + 10),
    ease(f, a("s12p3", "network") + 6, a("s12p3", "network") + 16)];
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        <RechargePhone f={f} x={230} y={560} s={0.36} tapAt={-40} rot={-3}/>
        <Path f={f} at={6} lit={lit} warn={f > a("s12p3", "maintaining") ? [1, 2] : []}/>
        <PaymentMarker f={f} at={but} dur={a("s12p3", "network") - but + 12} path={[[300, SY], [SX[0], SY], [SX[1], SY], [SX[2], SY], [SX[3], SY]]} size={56}/>
        <Chip f={f} at={a("s12p2", "enormous")} text="Enormous scale" x={560} y={250}/>
        <Chip f={f} at={a("s12p2", "distinctive")} text="Distinctive spectrum" x={1000} y={250}/>
        <Chip f={f} at={a("s12p2", "encouraging")} text="Encouraging retention" x={1480} y={250}/>
        <Chip f={f} at={a("s12p3", "durable") } text="Durable only after these costs" x={1060} y={860} tone="rust"/>
      </Layer>
      <SourceTag f={f} at={0} text="Moat & Margin · how the economics fit together"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
// z4 the assessment, earned (reviewer): evidence of protection (left, present from the first frame) vs questions remaining
// (right, on their words); NARROW MOAT lands on "narrow" above both. Editorial assessment, labelled so.
const Col: React.FC<{f: number; x: number; head: string; items: [string, number][]; tone: "good" | "open"}> = ({f, x, head, items, tone}) => (
  <div style={{position: "absolute", left: x, top: 470, width: 700}}>
    <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: tone === "good" ? C.highlightPrint : "#FF8FB0", marginBottom: 22}}>{head}</div>
    {items.map(([t, at], i) => {
      const p = ease(f, at, at + 10, outCubic);
      return (
        <div key={t} style={{display: "flex", alignItems: "center", gap: 22, height: 92, opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
          <div style={{width: 54, height: 54, borderRadius: tone === "good" ? 8 : "50%", background: tone === "good" ? C.highlightPrint : "transparent",
            border: tone === "good" ? undefined : `5px solid #FF8FB0`, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: F.sans, fontWeight: 800, fontSize: 38, color: C.ink}}>{tone === "good" ? "✓" : ""}</div>
          <div style={{fontFamily: F.serif, fontSize: 64, color: C.white}}>{t}</div>
        </div>
      );
    })}
  </div>
);
const z4: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const n = a("s12p4", "narrow"), p = ease(f, n - 4, n + 8, outQuint);
  return (
    <Desk f={f} d={d} tone="ink" cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]} chip="Moat & Margin's editorial assessment · not a company metric">
      <div style={{position: "absolute", left: 0, right: 0, top: 84, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 32, color: C.grey, letterSpacing: 5}}>OUR ASSESSMENT</div>
      <div style={{position: "absolute", left: 0, right: 0, top: 190, textAlign: "center", fontFamily: F.serif, fontSize: 160, lineHeight: 1, color: C.white,
        opacity: p, transform: `scale(${1.3 - 0.3 * p})`, filter: p < 0.8 ? `blur(${((0.8 - p) * 14).toFixed(1)}px)` : undefined}}>
        Narrow <span style={{background: C.highlight, color: C.ink, padding: "0 20px"}}>moat</span></div>
      <Col f={f} x={250} head="EVIDENCE OF PROTECTION" tone="good" items={[["Scale", -10], ["Spectrum", -6], ["Retention", -2]]}/>
      <Col f={f} x={1060} head="QUESTIONS REMAINING" tone="open" items={[["Pricing power", a("s12p4", "pricing")], ["Comparable costs", a("s12p4", "comparable")],
        ["Capital returns", a("s12p4", "returns")]]}/>
    </Desk>
  );
};
// z5 WATCH NEXT (s12p5-p6): the three items appear in sequence
const z5: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const items: [string, number][] = [["Earnings per customer", a("s12p5", "earn more")], ["Retention", a("s12p5", "keep its")], ["Cash and capital returns", a("s12p5", "stronger cash")]];
  return (
    <Desk f={f} d={d} tone="cream" cam={[[0, 1.0, 960, 540], [d, 1.05, 960, 520]]} chip="Moat & Margin · what to watch">
      <div style={{position: "absolute", left: 260, top: 210, fontFamily: F.serif, fontWeight: 400, fontSize: 60, color: C.ink, opacity: ease(f, 0, 10)}}>WATCH NEXT</div>
      {items.map(([t, at], i) => {
        const p = ease(f, at, at + 12, outCubic);   // items sit faint from the first frame and fill when named (no empty frame)
        return (
          <div key={t} style={{position: "absolute", left: 260, top: 340 + i * 150, display: "flex", alignItems: "center", gap: 34, opacity: 0.22 + 0.78 * p,
            transform: `translateX(${(1 - p) * -14}px)`}}>
            <div style={{width: 84, height: 84, borderRadius: "50%", background: C.teal, color: C.white, fontFamily: F.sans, fontWeight: 800, fontSize: 46,
              display: "flex", alignItems: "center", justifyContent: "center"}}>{i + 1}</div>
            <div style={{fontFamily: F.serif, fontWeight: 400, fontSize: 70, color: C.ink}}>{t}</div>
          </div>
        );
      })}
      <div style={{position: "absolute", left: 260, top: 820, fontFamily: F.sans, fontWeight: 600, fontSize: 40, color: C.teal,
        opacity: ease(f, a("s12p6", "size advantage"), a("s12p6", "size advantage") + 10)}}>Is the size advantage getting stronger?</div>
    </Desk>
  );
};
// z6 close on the payment confirmation, now surrounded by the economic system
const z6: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const sys = ease(f, a("s12p7", "For Jio"), a("s12p7", "economics") + 10, inOut);
  const cam = camAt(f, [[0, 1.3, 960, 600], [a("s12p7", "For Jio"), 1.25, 960, 590], [d, 0.95, 960, 560, inOut]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        <div style={{opacity: 0.55 * sys}}><Network f={f} net={NET} grow={sys} pulseAt={a("s12p7", "economics")}/></div>
        <RechargePhone f={f} x={960} y={560} s={0.62} tapAt={-40} rot={-2}/>
        {STATIONS.map((s, i) => {
          const ang = -Math.PI / 2 + (i * Math.PI) / 2 + Math.PI / 4, R = 560, p = ease(f, a("s12p7", "For Jio") + i * 5, a("s12p7", "For Jio") + i * 5 + 12, outCubic);
          return <div key={s} style={{position: "absolute", left: 960 + Math.cos(ang) * R * 1.25, top: 560 + Math.sin(ang) * R * 0.62, transform: "translate(-50%, -50%)",
            opacity: p, background: i === 3 ? C.teal : C.ink, color: C.white, fontFamily: F.sans, fontWeight: 800, fontSize: 36, padding: "10px 22px", whiteSpace: "nowrap"}}>{s}</div>;
        })}
      </Layer>
      <SourceTag f={f} at={0} text="Illustration"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
// z7 call to action + end card (2 s+): "Sources and calculations in the description."
const z7: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const end = a("s12p8", "headline") + 18;
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <Paper/>
      <div style={{position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: F.serif, fontWeight: 400, fontSize: 110, color: C.ink,
        opacity: ease(f, 0, 10)}}>Moat <span style={{color: C.teal}}>&</span> Margin</div>
      <div style={{position: "absolute", left: 0, right: 0, top: 510, textAlign: "center", fontFamily: F.sans, fontWeight: 600, fontSize: 44, color: C.inkSoft,
        opacity: ease(f, a("s12p8", "business"), a("s12p8", "business") + 10)}}>The business behind the headline</div>
      <div style={{position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", opacity: ease(f, end, end + 10)}}>
        <span style={{fontFamily: F.sans, fontWeight: 600, fontSize: 38, color: C.white, background: C.ink, padding: "14px 30px"}}>Sources and calculations in the description.</span>
      </div>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

export const SHOTS12: Shot[] = [
  S("s12p1", 0, MZ, z1, "s12-z1"), S("s12p2", 0, H0, z2, "s12-z2"), S("s12p4", 0, WL, z4, "s12-z4"), S("s12p5", 0, PU, z5, "s12-z5"),
  S("s12p7", 0, MZ, z6, "s12-z6"), S("s12p8", 0, PU, z7, "s12-z7"),
];
export const CUES12: SCue[] = [[W("s12p1", "recharge"), "ding", 0.35], [W("s12p4", "narrow"), "stamp", 0.4], [W("s12p7", "economics"), "paper", 0.35]];
