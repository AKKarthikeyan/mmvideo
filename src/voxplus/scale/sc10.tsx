// Scene 10 | 7:35-8:30 | The strongest positive case (AK brief + 20 Oct review pass). ONE shot, s10p1 .. s10p6, so no cut ever lands on an
// empty frame: two labelled bars on a zero-based percentage scale (cash capex / revenue, FY24 48.8%, FY26 23.3%; no FY25 point) with
// the conditional diagram "What would need to happen" overlaid; the qualification strip arrives with "But lower spending ...";
// at "cash calendar" THE scene-04 calendar (devices.tsx CashCalendar, x=960 y=520 w=760) drops in over the dimmed chart; at "Because one
// definition ..." the calendar leaves to the left and the real net-debt definition (RHP p.132 note 17) slides in large and centred.
import React from "react";
import {AbsoluteFill} from "remotion";
import {SourceTag} from "./kit/Cards";
import {StickerLabel} from "./kit/Collage";
import {DocPage} from "./kit/DocPage";
import {SCue} from "./kit/A01V4Cold";
import {SP, Shot} from "./kit/A01V4Parts";
import {Frame} from "./parts1011";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr, useTicks} from "./kit/tokens";
import {CashCalendar, ENTITY, EntityTag} from "./devices";
import {MZ, S, W, useAt} from "./cue";

// ---- chart geometry (world px, 1920x1080) -------------------------------------------------------------
const BASE = 790, TOP = 330, MAXV = 60;                  // zero-based scale: 0% at BASE, 60% at TOP
const K = (BASE - TOP) / MAXV;
const X0 = 560, X1 = 1360, BW = 230;
const BARS = [{l: "FY24", v: 48.8, cx: 760, col: C.white}, {l: "FY26", v: 23.3, cx: 1160, col: C.highlightPrint}];

const Chart: React.FC<{f: number; t0: number; t1: number; tArrow: number}> = ({f, t0, t1, tArrow}) => {
  const ax = ease(f, -12, 0, outCubic);                  // axes are on screen from the first frame
  const ps = [ease(f, t0, t0 + 24, outQuint), ease(f, t1, t1 + 24, outQuint)];
  const arr = ease(f, tArrow, tArrow + 16, outCubic);
  const y0 = BASE - BARS[0].v * K, y1 = BASE - BARS[1].v * K;
  return (
    <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      {[0, 20, 40, 60].map((g) => (
        <g key={g} opacity={ax}>
          <line x1={X0} x2={X1} y1={BASE - g * K} y2={BASE - g * K} stroke={g === 0 ? C.white : C.grey} strokeWidth={g === 0 ? 4 : 1.5} strokeDasharray={g === 0 ? undefined : "4 8"} opacity={g === 0 ? 0.9 : 0.55}/>
          <text x={X0 - 18} y={BASE - g * K + 12} textAnchor="end" fontFamily={F.sans} fontWeight={600} fontSize={32} fill={C.grey}>{g}%</text>
        </g>
      ))}
      {BARS.map((b, i) => {
        const p = ps[i], h = b.v * K * p;
        return (
          <g key={b.l}>
            <rect x={b.cx - BW / 2} y={BASE - h} width={BW} height={h} fill={b.col}/>
            {p > 0.02 ? <text x={b.cx} y={BASE - h - 22} textAnchor="middle" fontFamily={F.serif} fontWeight={400} fontSize={76} fill={C.white}
              opacity={clamp01(p * 3)}>{(b.v * p).toFixed(1)}%</text> : null}
            <text x={b.cx} y={BASE + 64} textAnchor="middle" fontFamily={F.serif} fontWeight={400} fontSize={48} fill={C.white} opacity={ax}>{b.l}</text>
          </g>
        );
      })}
      {arr > 0 ? (
        <g opacity={arr}>
          <line x1={900} y1={y0 + 40} x2={900 + 130 * arr} y2={y0 + 40 + (y1 - y0 - 80) * arr} stroke={C.rust} strokeWidth={9} strokeLinecap="round"/>
          {arr > 0.9 ? <polygon points={`1030,${y1 - 40} 1002,${y1 - 78} 1042,${y1 - 74}`} fill={C.rust}/> : null}
        </g>
      ) : null}
    </svg>
  );
};

/** One step of the conditional diagram: dashed outline = "if". */
const Node: React.FC<{f: number; at: number; y: number; n: string; text: string; x?: number; w?: number; final?: boolean}> = ({f, at, y, n, text, x = 1400, w = 780, final}) => {
  const e = spr(f, at, 14, 160);
  if (e <= 0.001) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, width: w, height: 100, transform: `translate(-50%, -50%) translateX(${(1 - e) * 120}px)`, opacity: clamp01(e * 2),
      background: final ? "rgba(255,232,26,0.12)" : "rgba(251,248,242,0.06)", border: `4px dashed ${final ? C.highlightPrint : C.white}`, display: "flex", alignItems: "center",
      padding: "0 30px", gap: 26}}>
      <span style={{fontFamily: F.sans, fontWeight: 800, fontSize: 34, color: final ? C.highlightPrint : C.grey, letterSpacing: 2}}>{n}</span>
      <span style={{fontFamily: F.sans, fontWeight: 800, fontSize: 42, color: C.white, lineHeight: 1.05, whiteSpace: "nowrap"}}>{text}</span>
    </div>
  );
};
const Arrow: React.FC<{f: number; at: number; y: number; x?: number}> = ({f, at, y, x = 1400}) => {
  const e = ease(f, at, at + 12, outCubic);
  if (e <= 0) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, opacity: e}}>
      <svg width={60} height={60} style={{position: "absolute", left: -30, top: -30}}>
        <path d="M 30 6 L 30 50 M 14 34 L 30 52 L 46 34" fill="none" stroke={C.grey} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
};

const DEF = {w: 2748, h: 161, hl: [[156.1, 1.8, 1002.8, 53.4], [156.1, 57.2, 2485.6, 53.4], [156.1, 112.0, 202.1, 53.4]] as [number, number, number, number][]};

const A: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const mv = a("s10p2", 0), m = ease(f, mv, mv + 26, inOut);   // chart slides left as the diagram opens
  const tx = -480 * m, sc = 1 - 0.22 * m;
  const q = a("s10p4", 0);                                      // the qualification
  const tCal = a("s10p5", "calendar") - 8;                     // calendar drops in; chart + diagram dim behind it
  const t6 = a("s10p6", 0);                                     // definition arrives, calendar leaves
  const dimQ = 1 - 0.45 * ease(f, q + 6, q + 26);
  const dimC = 1 - 0.82 * ease(f, tCal, tCal + 14);
  const strip = spr(f, q + 4, 16, 170);
  const stripOut = 1 - ease(f, tCal, tCal + 10);
  const calOut = ease(f, t6, t6 + 20, inOut);
  const defIn = ease(f, t6, t6 + 6);
  const chartOut = 1 - ease(f, t6, t6 + 16);
  return (
    <Frame f={f} d={d} tone="ink" cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}
      over={(
        <>
          <SourceTag f={f} at={-20} until={tCal} text="RHP pp.131, 452 · ratio: our calculation" dark/>
          <SourceTag f={f} at={tCal + 4} until={t6} text="Concept · cash calendar" dark/>
          <SourceTag f={f} at={t6 + 2} text="RHP p.132 · note 17 · net-debt definition" dark/>
        </>
      )}>
      {/* chart + diagram group (stays on screen, dimmed, until the definition takes over) */}
      <div style={{position: "absolute", inset: 0, opacity: dimC * chartOut}}>
        <div style={{position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: F.serif, fontWeight: 400, fontSize: 68, color: C.white, letterSpacing: 3,
          transform: `translateX(${tx}px)`}}>CASH CAPEX <span style={{color: C.highlightPrint}}>/ REVENUE</span></div>
        <EntityTag f={f} at={-12} text={ENTITY.jioPlat} period="FY24 · FY26" x={960 + tx} y={246} anchor="center" dark size={24}/>
        <div style={{position: "absolute", left: 0, right: 0, top: 282, textAlign: "center", fontFamily: F.sans, fontWeight: 600, fontSize: 26, color: C.grey, letterSpacing: 1,
          transform: `translateX(${tx}px)`}}>% of revenue from operations</div>
        <div style={{position: "absolute", inset: 0, transformOrigin: "960px 560px", transform: `translateX(${tx}px) scale(${sc})`}}>
          <Chart f={f} t0={a("s10p1", "forty") - 2} t1={a("s10p1", "twenty") - 2} tArrow={a("s10p1", "falling")}/>
        </div>
        <div style={{position: "absolute", inset: 0, opacity: dimQ}}>
          <div style={{position: "absolute", left: 1400, top: 300, transform: "translate(-50%, -50%)", opacity: ease(f, mv + 8, mv + 22),
            fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: C.ink, background: C.highlightPrint, padding: "10px 22px", letterSpacing: 1, whiteSpace: "nowrap"}}>WHAT WOULD NEED TO HAPPEN</div>
          <div style={{position: "absolute", left: 1400, top: 340, transform: "translateX(-50%)", opacity: ease(f, mv + 10, mv + 24), fontFamily: F.sans, fontWeight: 600,
            fontSize: 26, color: C.grey, letterSpacing: 2}}>ILLUSTRATION · CONDITIONAL</div>
          <Node f={f} at={a("s10p2", "existing") - 6} y={430} n="IF" text="Existing capacity"/>
          <Arrow f={f} at={a("s10p2", "paying") - 10} y={510}/>
          <Node f={f} at={a("s10p2", "paying") - 6} y={590} n="AND" text="Additional paying demand"/>
          <div style={{position: "absolute", left: 1400, top: 656, transform: "translateX(-50%)", opacity: ease(f, a("s10p2", "without"), a("s10p2", "without") + 10), fontFamily: F.sans,
            fontWeight: 600, fontSize: 28, color: C.grey, whiteSpace: "nowrap"}}>without equally large new spending</div>
          <Arrow f={f} at={a("s10p2", "cash") - 10} y={716}/>
          <Node f={f} at={a("s10p2", "cash") - 6} y={796} n="THEN" text="Potential cash improvement" final/>
        </div>
        <StickerLabel f={f} text="The strongest positive case" x={1400} y={200} size={44} rot={2} bg={C.teal} color={C.white}
          enter={{at: a("s10p3", "strongest") - 4, mode: "pop", rot0: 8}} exit={{at: q + 4}}/>
        {strip > 0.01 ? (
          <div style={{position: "absolute", left: 960, top: 905, transform: `translate(-50%, -50%) translateY(${(1 - strip) * 60}px)`, opacity: clamp01(strip * 2) * stripOut, whiteSpace: "nowrap",
            background: C.ink, border: `4px solid ${C.rust}`, padding: "14px 30px", fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: C.white}}>
            Future cash improvement depends on <span style={{color: C.highlightPrint}}>utilisation</span> and <span style={{color: C.highlightPrint}}>further investment</span></div>
        ) : null}
      </div>

      {/* THE scene-04 calendar: same component, same props, same place; it leaves to the left when the definition arrives */}
      <div style={{position: "absolute", inset: 0, opacity: 1 - calOut, transform: `translateX(${-620 * calOut}px)`}}>
        <CashCalendar f={f} at={tCal} x={960} y={520} w={760} title="Cash payments"/>
      </div>
      <StickerLabel f={f} text="Set aside earlier" x={960} y={915} size={44} rot={-2} enter={{at: a("s10p5", "set") - 2, mode: "pop", rot0: -8}} exit={{at: t6}}/>

      {/* the real definition: large, centred, highlighted */}
      {defIn > 0 ? (
        <AbsoluteFill>
          <div style={{position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: F.serif, fontWeight: 400, fontSize: 60, color: C.white, opacity: defIn}}>HOW NET DEBT IS DEFINED</div>
          <DocPage f={f} src="scale/docs/sc10_rhp132_netdebt_def.png" imgW={DEF.w} imgH={DEF.h} x={960} y={560} width={1640} rot={-0.4}
            enter={{at: t6, mode: "slide-left", dur: 14}} stack={1} highlights={[{rects: DEF.hl, at: a("s10p6", "definition"), dur: 22}]}/>
        </AbsoluteFill>
      ) : null}
    </Frame>
  );
};

export const SHOTS10: Shot[] = [S("s10p1", 0, MZ, A, "s10-a")];
export const CUES10: SCue[] = [[W("s10p1", "forty"), "pop", 0.3], [W("s10p2", "existing"), "paper", 0.25], [W("s10p5", "calendar"), "paper", 0.4], [W("s10p6", "definition"), "highlighter", 0.4]];
