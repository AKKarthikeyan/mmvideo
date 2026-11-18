// tatamotorsq2 kit (24 Oct 2026; copy of SwiggyKit.tsx + additions at the end): price tag, ledger card, charts on black, calendar strip, cash jar, blocks; bridge, safe, date row, seesaw, torn sheet.
// on black, street-grid trip illustration, calendar strip, cash jar, unit blocks, thirds bar. Ticks (1/30 s) throughout.
import React from "react";
import {random} from "remotion";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr} from "./tokens";
import {Lab, XI} from "./TataMotorsPieces";

// ---------------------------------------------------------------------------------------------------
// paper price tag on a string (₹ set in Inter: DM Serif has no ₹ glyph)
// ---------------------------------------------------------------------------------------------------
export const PriceTag: React.FC<{f: number; at: number; x: number; y: number; text: string; size?: number; bg?: string; color?: string; string?: number;
  q?: number; swing?: number; dim?: number}> =
  ({f, at, x, y, text, size = 96, bg = "linear-gradient(160deg, #F2DDA8, #E7CB89 60%, #DDBE77)", color = "#2A1C0E", string = 90, q, swing = 1, dim = 0}) => {
    if (f < at) return null;
    const drop = 1 - spr(f, at, 12, 150);
    const ang = swing * (12 * Math.exp(-(f - at) / 16) * Math.cos((f - at) * 0.25) + 2.2 * Math.sin(f * 0.06 + x * 0.01));
    const w = text.length * size * 0.55 + size * 1.1, h = size * 1.75;
    return (
      <div style={{position: "absolute", left: x, top: y - drop * 760, transform: `rotate(${ang}deg)`, transformOrigin: "0 0", opacity: 1 - dim * 0.55,
        filter: dim > 0 ? `grayscale(${dim})` : undefined}}>
        <div style={{position: "absolute", left: -2, top: -400, width: 4, height: string + 400, background: "linear-gradient(90deg,#8A7A60,#C8B994,#8A7A60)"}}/>
        <div style={{position: "absolute", left: -w / 2, top: string - 14, width: w, height: h, filter: "drop-shadow(0 12px 16px rgba(0,0,0,0.35))"}}>
          <div style={{position: "absolute", inset: 0, clipPath: "polygon(9% 0, 91% 0, 100% 24%, 100% 100%, 0 100%, 0 24%)", background: bg}}/>
          <div style={{position: "absolute", left: w / 2 - 14, top: 8, width: 28, height: 28, borderRadius: "50%", background: "#C9A85E", boxShadow: "inset 0 2px 3px rgba(0,0,0,0.35)"}}/>
          <div style={{position: "absolute", left: w / 2 - 7, top: 15, width: 14, height: 14, borderRadius: "50%", background: "#3B2B18"}}/>
          <div style={{position: "absolute", left: 0, right: 0, top: size * 0.45, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: F.sans, fontWeight: 900, fontSize: size * 0.82, color, letterSpacing: 1, lineHeight: 1, whiteSpace: "nowrap"}}>{text}</div>
        </div>
        {q != null && f >= q ? <div style={{position: "absolute", left: w / 2 + 10, top: string - 40, fontFamily: F.marker, fontSize: size * 2.1, color: C.markerRed,
          transform: `rotate(12deg) scale(${spr(f, q, 10, 200)})`, lineHeight: 1}}>?</div> : null}
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------
// two (or three) column ledger card: FOOD | INSTAMART | GROUP
// ---------------------------------------------------------------------------------------------------
export const Ledger: React.FC<{f: number; cols: {name: string; val: string; sub?: string; red?: boolean; at: number}[]; x?: number; y?: number; w?: number; enterAt?: number}> =
  ({f, cols, x = 960, y = 520, w = 1500, enterAt = 0}) => {
    if (f < enterAt) return null;
    const p = outQuint(clamp01((f - enterAt) / 12)), cw = w / cols.length;
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - 260, width: w, height: 520, background: "#FBF8F1", transform: `translateY(${(1 - p) * 800}px) rotate(-0.6deg)`,
        boxShadow: "0 2px 3px rgba(30,20,10,0.18), 0 18px 36px rgba(30,20,10,0.26)"}}>
        {cols.map((c, i) => {
          const k = ease(f, c.at, c.at + 10, outQuint);
          return (
            <div key={i} style={{position: "absolute", left: i * cw, top: 0, width: cw, height: 520, borderLeft: i ? "4px solid #1F1C18" : undefined}}>
              <div style={{position: "absolute", left: 0, right: 0, top: 50, textAlign: "center"}}>
                <span style={{background: c.red ? C.markerRed : C.ink, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: 46, letterSpacing: 3, padding: "10px 22px"}}>{c.name}</span></div>
              <div style={{position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 112, opacity: k,
                transform: `scale(${1.3 - 0.3 * k})`, color: c.red ? C.markerRed : C.ink, whiteSpace: "nowrap"}}>{c.val}</div>
              {c.sub ? <div style={{position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: F.mono, fontSize: 26, color: C.inkSoft, opacity: k, letterSpacing: 1}}>{c.sub}</div> : null}
            </div>
          );
        })}
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------
// waterfall on black: steps in percentage points (values from the ledger only)
// ---------------------------------------------------------------------------------------------------
export const Waterfall: React.FC<{f: number; title: string; source: string; steps: {label: string; v: number; at: number}[]; total?: {label: string; at: number};
  k?: number; y0?: number}> = ({f, title, source, steps, total, k = 300, y0 = 330}) => {
  const tp = ease(f, 0, 12, outQuint), n = steps.length + (total ? 1 : 0), slot = 1300 / n, x0 = 360;
  let run = 0;
  const bars = steps.map((s) => { const a = run; run += s.v; return {...s, a, b: run}; });
  const Y = (v: number) => y0 - v * k;
  return (
    <>
      <div style={{position: "absolute", left: 120, top: 80, fontFamily: F.serif, fontSize: 72, color: C.white, opacity: tp}}>{title}</div>
      <div style={{position: "absolute", left: 124, top: 172, fontFamily: F.mono, fontSize: 22, color: "#9C968C", letterSpacing: 3, textTransform: "uppercase", opacity: tp}}>{source}</div>
      <div style={{position: "absolute", left: x0 - 60, top: Y(0) - 2, width: 1420, height: 4, background: "rgba(255,255,255,0.75)"}}/>
      <div style={{position: "absolute", left: x0 - 90, top: Y(0) - 18, fontFamily: F.mono, fontSize: 26, color: "#CFC9BE", transform: "translateX(-100%)"}}>0</div>
      {bars.map((b, i) => {
        const g = ease(f, b.at, b.at + 18, outCubic), cx = x0 + slot * (i + 0.5);
        const top = Y(Math.max(b.a, b.a + b.v * g)), h = Math.abs(b.v) * k * g, neg = b.v < 0;
        return (
          <React.Fragment key={i}>
            <div style={{position: "absolute", left: cx - 110, top, width: 220, height: Math.max(2, h), background: neg ? C.markerRed : C.highlightPrint}}/>
            {g > 0.1 ? <div style={{position: "absolute", left: cx, top: neg ? top + h + 50 : top - 50, transform: "translate(-50%,-50%)", fontFamily: F.sans, fontWeight: 800,
              fontSize: 60, color: neg ? "#FF8FA8" : C.highlightPrint, whiteSpace: "nowrap", opacity: clamp01(g * 2)}}>{(b.v > 0 ? "+" : "–") + Math.abs(b.v).toFixed(1)}</div> : null}
            <Lab f={f} at={b.at} text={b.label} x={cx} y={Y(0) - 60 - (i % 2) * 0} size={26} color="#CFC9BE"/>
          </React.Fragment>
        );
      })}
      {total ? (() => {
        const g = ease(f, total.at, total.at + 18, outCubic), cx = x0 + slot * (n - 0.5), h = Math.abs(run) * k * g;
        return (
          <>
            <div style={{position: "absolute", left: cx - 110, top: Y(0), width: 220, height: Math.max(2, h), background: "#FFFFFF", opacity: 0.9}}/>
            {g > 0.1 ? <div style={{position: "absolute", left: cx, top: Y(0) + h + 50, transform: "translate(-50%,-50%)", fontFamily: F.sans, fontWeight: 900, fontSize: 72,
              color: C.white, whiteSpace: "nowrap"}}>{"–" + Math.abs(run).toFixed(1)}</div> : null}
            <Lab f={f} at={total.at} text={total.label} x={cx} y={Y(0) - 60} size={26} color={C.white}/>
          </>
        );
      })() : null}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------
// line chart on black (quarters), optional dotted expectation point and a shaded band
// ---------------------------------------------------------------------------------------------------
export const LineChart: React.FC<{f: number; title: string; source: string; pts: {label: string; v: number; txt: string; at: number; dotted?: boolean}[]; min: number; max: number;
  band?: {from: number; to: number; label: string; at: number}; circleLast?: number; unit?: string}> =
  ({f, title, source, pts, min, max, band, circleLast}) => {
    const tp = ease(f, 0, 12, outQuint), bx = 300, bw = 1340, by = 300, bh = 560;
    const X = (i: number) => bx + (bw * (i + 0.5)) / pts.length, Y = (v: number) => by + ((max - v) / (max - min)) * bh;
    const z = Y(0);
    return (
      <>
        <div style={{position: "absolute", left: 210, top: 125, fontFamily: F.serif, fontSize: 70, color: C.white, opacity: tp}}>{title}</div>
        <div style={{position: "absolute", left: 214, top: 215, fontFamily: F.mono, fontSize: 22, color: "#9C968C", letterSpacing: 3, textTransform: "uppercase", opacity: tp}}>{source}</div>
        {min < 0 && max > 0 ? <div style={{position: "absolute", left: bx - 40, top: z - 2, width: bw + 80, height: 4, background: "rgba(255,255,255,0.75)"}}/> : null}
        {band ? <div style={{position: "absolute", left: bx - 40, top: Y(band.from), width: (bw + 80) * ease(f, band.at, band.at + 14, outQuint), height: Y(band.to) - Y(band.from),
          background: "rgba(255,244,140,0.18)", borderTop: "3px dashed rgba(255,244,140,0.7)", borderBottom: "3px dashed rgba(255,244,140,0.7)"}}>
          <div style={{position: "absolute", right: 16, top: 8, fontFamily: F.mono, fontSize: 24, color: C.highlightPrint, letterSpacing: 2, whiteSpace: "nowrap", opacity: ease(f, band.at + 8, band.at + 14)}}>{band.label}</div></div> : null}
        <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          {pts.slice(1).map((p, i) => {
            const g = ease(f, p.at - 8, p.at, inOut);
            return <line key={i} x1={X(i)} y1={Y(pts[i].v)} x2={X(i) + (X(i + 1) - X(i)) * g} y2={Y(pts[i].v) + (Y(p.v) - Y(pts[i].v)) * g}
              stroke={p.dotted ? C.highlightPrint : "#FF8FA8"} strokeWidth={8} strokeDasharray={p.dotted ? "14 14" : undefined}/>;
          })}
          {pts.map((p, i) => {
            const k = spr(f, p.at, 11, 200);
            return f >= p.at ? <circle key={i} cx={X(i)} cy={Y(p.v)} r={18 * k} fill={p.dotted ? "none" : C.markerRed} stroke={p.dotted ? C.highlightPrint : C.white} strokeWidth={5}
              strokeDasharray={p.dotted ? "6 6" : undefined}/> : null;
          })}
          {circleLast != null && f >= circleLast ? (() => {
            const i = pts.length - 1 - (pts[pts.length - 1].dotted ? 1 : 0), p = ease(f, circleLast, circleLast + 14);
            return <ellipse cx={X(i)} cy={Y(pts[i].v)} rx={110} ry={80} fill="none" stroke={C.highlightPrint} strokeWidth={8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}/>;
          })() : null}
        </svg>
        {pts.map((p, i) => (
          <React.Fragment key={i}>
            <Lab f={f} at={p.at} text={p.txt} x={X(i)} y={Y(p.v) + (p.v >= 0 ? -62 : 62)} size={40} color={p.dotted ? C.highlightPrint : C.white}/>
            <Lab f={f} at={Math.min(p.at, 4)} text={p.label} x={X(i)} y={by + bh + 70} size={26} color="#9C968C"/>
          </React.Fragment>
        ))}
      </>
    );
  };

// ---------------------------------------------------------------------------------------------------
// street grid illustration: one long zig-zag trip, then short hops between close dots
// ---------------------------------------------------------------------------------------------------
export const Trips: React.FC<{f: number; at: number; shortAt: number}> = ({f, at, shortAt}) => {
  const long = [[300, 820], [300, 560], [700, 560], [700, 300], [1100, 300], [1100, 180]];
  const pl = long.map((p) => p.join(",")).join(" ");
  const lp = ease(f, at, at + 40, inOut), sp = ease(f, shortAt, shortAt + 24, outCubic);
  const dots = Array.from({length: 9}).map((_, i) => [1300 + (i % 3) * 120 + random("td" + i) * 30, 560 + Math.floor(i / 3) * 110 + random("te" + i) * 30]);
  return (
    <>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        {Array.from({length: 9}).map((_, i) => <line key={"v" + i} x1={140 + i * 200} y1={120} x2={140 + i * 200} y2={960} stroke="#D9CFBC" strokeWidth={22}/>)}
        {Array.from({length: 5}).map((_, i) => <line key={"h" + i} x1={60} y1={180 + i * 190} x2={1860} y2={180 + i * 190} stroke="#D9CFBC" strokeWidth={22}/>)}
        <polyline points={pl} fill="none" stroke={C.markerRed} strokeWidth={10} strokeDasharray="22 14" pathLength={1} opacity={1 - 0.6 * sp}
          style={{strokeDasharray: 1, strokeDashoffset: 1 - lp} as React.CSSProperties}/>
        {dots.map((d, i) => <circle key={i} cx={d[0]} cy={d[1]} r={18 * sp} fill={C.ink}/>)}
        {dots.slice(0, -1).map((d, i) => <line key={"s" + i} x1={d[0]} y1={d[1]} x2={d[0] + (dots[i + 1][0] - d[0]) * sp} y2={d[1] + (dots[i + 1][1] - d[1]) * sp}
          stroke={C.highlightPrint} strokeWidth={9}/>)}
      </svg>
      <div style={{position: "absolute", left: 300 + (lp < 1 ? 0 : 0), top: 820}}/>
      <div style={{position: "absolute", left: 260, top: 760}}><XI name="scooter" size={110}/></div>
      <Lab f={f} at={at + 6} text="long trip" x={520} y={900} size={32}/>
      <Lab f={f} at={shortAt + 6} text="short hops" x={1430} y={930} size={32}/>
    </>
  );
};

// ---------------------------------------------------------------------------------------------------
// calendar strip with an arrow (on-screen dates only)
// ---------------------------------------------------------------------------------------------------
export const CalStrip: React.FC<{f: number; at: number; months: string[]; from: number; to: number; arrowAt: number; label: string; dashedAfter?: number}> =
  ({f, at, months, from, to, arrowAt, label, dashedAfter}) => {
    const cw = 1500 / months.length, x0 = 210;
    const g = ease(f, arrowAt, arrowAt + 30, inOut);
    return (
      <>
        {months.map((m, i) => {
          const k = spr(f, at + i * 1.5, 12, 180);
          return <div key={i} style={{position: "absolute", left: x0 + i * cw + 6, top: 380, width: cw - 12, height: 220, background: "#FBF8F1", opacity: clamp01(k * 3),
            transform: `translateY(${(1 - k) * 200}px)`, boxShadow: "0 8px 16px rgba(30,20,10,0.2)", borderTop: `26px solid ${C.markerRed}`}}>
            <div style={{textAlign: "center", marginTop: 50, fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: C.ink}}>{m}</div></div>;
        })}
        <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <line x1={x0 + from * cw} y1={680} x2={x0 + (from + (to - from) * g) * cw} y2={680} stroke={C.markerRed} strokeWidth={12}
            strokeDasharray={dashedAfter != null && g > 0 ? undefined : undefined}/>
          {g > 0.95 ? <path d={`M ${x0 + to * cw - 30} 655 L ${x0 + to * cw} 680 L ${x0 + to * cw - 30} 705`} fill="none" stroke={C.markerRed} strokeWidth={12}/> : null}
        </svg>
        <Lab f={f} at={arrowAt} text={label} x={x0 + from * cw} y={740} size={34} color={C.markerRed} anchor="l"/>
      </>
    );
  };

// ---------------------------------------------------------------------------------------------------
// cash jar: level from v0 to v1 (scale vmax)
// ---------------------------------------------------------------------------------------------------
export const CashJar: React.FC<{f: number; at: number; v0: number; v1: number; vmax: number; x?: number; y?: number}> = ({f, at, v0, v1, vmax, x = 620, y = 540}) => {
  const v = v0 + (v1 - v0) * ease(f, at, at + 40, inOut), hh = 520, lvl = (v / vmax) * hh;
  return (
    <div style={{position: "absolute", left: x - 200, top: y - hh / 2 - 40, width: 400, height: hh + 80}}>
      <div style={{position: "absolute", left: 60, top: 0, width: 280, height: 50, background: "#8C7A5A", borderRadius: 8}}/>
      <div style={{position: "absolute", left: 0, top: 46, width: 400, height: hh, borderRadius: "40px 40px 60px 60px", border: "8px solid rgba(40,30,20,0.6)",
        background: "rgba(255,255,255,0.35)", overflow: "hidden"}}>
        <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: lvl, background: "linear-gradient(180deg, #7FB77E, #4E8F55)"}}/>
        <div style={{position: "absolute", left: 0, right: 0, bottom: lvl - 3, height: 6, background: C.ink}}/>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// unit blocks: n paper blocks per name (size comparison, illustration of a ratio)
// ---------------------------------------------------------------------------------------------------
export const Blocks: React.FC<{f: number; rows: {name: string; n: number; at: number; tint?: string}[]; y0?: number}> = ({f, rows, y0 = 330}) => (
  <>
    {rows.map((r, j) => (
      <React.Fragment key={j}>
        <div style={{position: "absolute", left: 160, top: y0 + j * 300 + 60}}>
          <span style={{background: C.ink, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: 48, letterSpacing: 3, padding: "10px 20px"}}>{r.name}</span></div>
        {Array.from({length: Math.ceil(r.n)}).map((_, i) => {
          const k = spr(f, r.at + i * 5, 12, 170), frac = Math.min(1, r.n - i);
          return <div key={i} style={{position: "absolute", left: 640 + i * 360, top: y0 + j * 300, width: 330 * frac, height: 190, background: r.tint ?? "#E9DFC4",
            transform: `translateY(${(1 - k) * -300}px) rotate(${(i % 2 ? 1 : -1) * 1.2}deg)`, opacity: clamp01(k * 3), boxShadow: "0 10px 20px rgba(30,20,10,0.25)"}}/>;
        })}
      </React.Fragment>
    ))}
  </>
);

// ---------------------------------------------------------------------------------------------------
// thirds bar: roughly two thirds vs one third
// ---------------------------------------------------------------------------------------------------
export const Thirds: React.FC<{f: number; at: number; at2: number}> = ({f, at, at2}) => {
  const a = ease(f, at, at + 16, outQuint), b = ease(f, at2, at2 + 16, outQuint), W0 = 1500, x0 = 210;
  return (
    <>
      <div style={{position: "absolute", left: x0, top: 420, width: (W0 * 2 / 3) * a, height: 200, background: C.highlightPrint}}/>
      <div style={{position: "absolute", left: x0 + W0 * 2 / 3 + 10, top: 420, width: (W0 / 3 - 10) * b, height: 200, background: "#E8E2D6"}}/>
      <Lab f={f} at={at + 8} text="EARN MORE PER ORDER" x={x0 + W0 / 3} y={520} size={46} color={C.ink}/>
      <Lab f={f} at={at2 + 8} text="COST LESS" x={x0 + W0 * 5 / 6} y={520} size={46} color={C.ink}/>
      <Lab f={f} at={at + 10} text="roughly ⅔" x={x0 + W0 / 3} y={680} size={36} color="#CFC9BE"/>
      <Lab f={f} at={at2 + 10} text="⅓" x={x0 + W0 * 5 / 6} y={680} size={36} color="#CFC9BE"/>
    </>
  );
};

// =====================================================================================================
// tatamotorsq2 additions (24 Oct 2026): rupee bridge (waterfall in ₹ crore with a start and an end bar), paper safe, euro number,
// date row, seesaw, torn sheet. Values only from the ledger in contentengine/drafts/2026-10-23/_video/script.md.
// =====================================================================================================
const inr = (v: number) => Math.round(Math.abs(v)).toLocaleString("en-IN");
export type BStep = {label: string; v: number; at: number; kind?: "start" | "total"};
export const Bridge: React.FC<{f: number; title: string; source: string; steps: BStep[]; max: number; circle?: [number, number]; y0?: number; h?: number}> =
  ({f, title, source, steps, max, circle, y0 = 880, h = 560}) => {
    const tp = ease(f, 0, 12, outQuint), n = steps.length, slot = 1560 / n, x0 = 200, k = h / max;
    let run = 0;
    const bars = steps.map((s) => {
      if (s.kind === "start") { run = s.v; return {...s, a: 0, b: s.v}; }
      if (s.kind === "total") return {...s, a: 0, b: s.v};
      const a = run; run += s.v; return {...s, a, b: run};
    });
    const Y = (v: number) => y0 - v * k;
    return (
      <>
        <div style={{position: "absolute", left: 210, top: 120, fontFamily: F.serif, fontSize: 66, color: C.white, opacity: tp}}>{title}</div>
        <div style={{position: "absolute", left: 214, top: 205, fontFamily: F.mono, fontSize: 22, color: "#9C968C", letterSpacing: 3, textTransform: "uppercase", opacity: tp}}>{source}</div>
        <div style={{position: "absolute", left: x0 - 40, top: y0, width: 1640, height: 4, background: "rgba(255,255,255,0.75)"}}/>
        {bars.map((b, i) => {
          const g = ease(f, b.at, b.at + 18, outCubic), cx = x0 + slot * (i + 0.5);
          const plain = b.kind === "start" || b.kind === "total", neg = b.v < 0;
          const lo = Math.min(b.a, b.a + (b.b - b.a) * g), hi = Math.max(b.a, b.a + (b.b - b.a) * g);
          const col = plain ? "#F3EEE3" : neg ? C.markerRed : C.highlightPrint;
          if (f < b.at) return null;
          return (
            <React.Fragment key={i}>
              <div style={{position: "absolute", left: cx - slot * 0.32, top: Y(hi), width: slot * 0.64, height: Math.max(3, (hi - lo) * k), background: col}}/>
              {i > 0 && !plain ? <div style={{position: "absolute", left: cx - slot * 0.82, top: Y(b.a) - 1, width: slot * 0.5, height: 2, borderTop: "3px dashed rgba(255,255,255,0.35)"}}/> : null}
              <div style={{position: "absolute", left: cx, top: Y(hi) - 46, transform: "translate(-50%,-50%)", fontFamily: F.sans, fontWeight: 800, fontSize: plain ? 50 : 54,
                color: plain ? C.white : neg ? "#FF8FA8" : C.highlightPrint, whiteSpace: "nowrap", opacity: clamp01(g * 2)}}>{(plain ? "" : neg ? "–" : "+") + inr(b.v)}</div>
              <div style={{position: "absolute", left: cx, top: y0 + 52, width: slot - 12, transform: "translate(-50%,-50%)", textAlign: "center", fontFamily: F.sans, fontWeight: 800,
                fontSize: 24, letterSpacing: 1.5, color: "#CFC9BE", textTransform: "uppercase", lineHeight: 1.15, opacity: clamp01(g * 2)}}>{b.label}</div>
              {circle && circle[0] === i && f >= circle[1] ? (
                <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
                  <ellipse cx={cx} cy={(Y(hi) + Y(lo)) / 2 - 20} rx={slot * 0.55} ry={(hi - lo) * k / 2 + 80} fill="none" stroke={C.highlightPrint} strokeWidth={8}
                    pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(f, circle[1], circle[1] + 14)}/>
                </svg>) : null}
            </React.Fragment>
          );
        })}
      </>
    );
  };

/** paper safe (code-drawn): door swings open at `at`, a rupee figure counts up inside */
export const Safe: React.FC<{f: number; at: number; x: number; y: number; v: string; label: string; sub?: string; s?: number; tint?: string}> =
  ({f, at, x, y, v, label, sub, s = 1, tint = "#5E6B73"}) => {
    if (f < at - 2) return null;
    const k = spr(f, at, 12, 160), door = ease(f, at + 6, at + 20, outCubic), W0 = 440 * s, H0 = 400 * s;
    return (
      <div style={{position: "absolute", left: x - W0 / 2, top: y - H0 / 2, width: W0, height: H0, transform: `translateY(${(1 - k) * -300}px)`, opacity: clamp01(k * 3)}}>
        <div style={{position: "absolute", inset: 0, background: tint, borderRadius: 18 * s, boxShadow: "0 18px 34px rgba(30,20,10,0.35)"}}/>
        <div style={{position: "absolute", left: 26 * s, top: 26 * s, right: 26 * s, bottom: 26 * s, background: "#F7F1E2", borderRadius: 8 * s, display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
          <div style={{fontFamily: F.sans, fontWeight: 900, fontSize: 66 * s, color: C.ink, lineHeight: 1, whiteSpace: "nowrap", opacity: door}}>{v}</div>
          <div style={{marginTop: 14 * s, fontFamily: F.sans, fontWeight: 800, fontSize: 26 * s, letterSpacing: 2, color: C.inkSoft, opacity: door, textTransform: "uppercase"}}>{label}</div>
          {sub ? <div style={{marginTop: 6 * s, fontFamily: F.mono, fontSize: 20 * s, color: C.grey, opacity: door}}>{sub}</div> : null}
        </div>
        <div style={{position: "absolute", left: 26 * s, top: 26 * s, width: W0 - 52 * s, height: H0 - 52 * s, background: "linear-gradient(135deg,#7D8A92,#53606A)", borderRadius: 8 * s,
          transformOrigin: "0 50%", transform: `perspective(1400px) rotateY(${-door * 100}deg)`, opacity: door > 0.92 ? 0 : 1, display: "flex", alignItems: "center", justifyContent: "center"}}>
          <div style={{width: 120 * s, height: 120 * s, borderRadius: "50%", border: `${10 * s}px solid #2F3940`, background: "#9AA6AD"}}/>
        </div>
      </div>
    );
  };

/** big euro / plain sans number (DM Serif's euro sign is avoided) */
export const SansBig: React.FC<{f: number; at: number; text: string; x: number; y: number; size?: number; color?: string; rot?: number}> =
  ({f, at, text, x, y, size = 200, color = C.ink, rot = 0}) => {
    if (f < at) return null;
    const s = spr(f, at, 11, 200);
    return <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${1.4 - 0.4 * s})`, opacity: clamp01(s * 3),
      fontFamily: F.sans, fontWeight: 900, fontSize: size, color, lineHeight: 1, whiteSpace: "nowrap", letterSpacing: -2}}>{text}</div>;
  };

/** row of date cards with a status mark (done = tick, open = circle) */
export const DateRow: React.FC<{f: number; items: {date: string; label: string; at: number; done?: boolean}[]; y?: number}> = ({f, items, y = 470}) => {
  const n = items.length, cw = 1500 / n, x0 = 210;
  return (
    <>
      <div style={{position: "absolute", left: x0, top: y + 250, width: 1500 * ease(f, items[0].at, items[n - 1].at + 10, inOut), height: 8, background: C.ink}}/>
      {items.map((it, i) => {
        const k = spr(f, it.at, 12, 180);
        if (f < it.at) return null;
        return (
          <React.Fragment key={i}>
            <div style={{position: "absolute", left: x0 + i * cw + 20, top: y, width: cw - 40, height: 200, background: "#FBF8F1", borderTop: `24px solid ${C.markerRed}`,
              boxShadow: "0 10px 20px rgba(30,20,10,0.22)", transform: `translateY(${(1 - k) * -220}px) rotate(${(i % 2 ? 1 : -1) * 1.2}deg)`, opacity: clamp01(k * 3)}}>
              <div style={{textAlign: "center", marginTop: 34, fontFamily: F.sans, fontWeight: 900, fontSize: 54, color: C.ink}}>{it.date}</div>
            </div>
            <div style={{position: "absolute", left: x0 + i * cw + cw / 2 - 26, top: y + 228, width: 52, height: 52, borderRadius: "50%",
              background: it.done ? C.ink : "#FBF8F1", border: `7px solid ${C.ink}`, transform: `scale(${k})`}}/>
            {it.done ? <div style={{position: "absolute", left: x0 + i * cw + cw / 2, top: y + 254, transform: "translate(-50%,-50%)", color: C.white, fontFamily: F.sans,
              fontWeight: 900, fontSize: 30, opacity: k}}>✓</div> : null}
            <div style={{position: "absolute", left: x0 + i * cw + cw / 2, top: y + 330, transform: "translate(-50%,-50%)", width: cw - 20, textAlign: "center", fontFamily: F.sans,
              fontWeight: 800, fontSize: 30, letterSpacing: 2, color: C.inkSoft, textTransform: "uppercase", opacity: clamp01(k * 2), lineHeight: 1.2}}>{it.label}</div>
          </React.Fragment>
        );
      })}
    </>
  );
};

/** seesaw: a labelled block rocking on a pivot (illustration) */
export const Seesaw: React.FC<{f: number; at: number; label: string; x?: number; y?: number}> = ({f, at, label, x = 960, y = 560}) => {
  const ang = 9 * Math.sin((f - at) * 0.09) * ease(f, at, at + 14);
  return (
    <>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <path d={`M ${x - 70} ${y + 190} L ${x} ${y + 40} L ${x + 70} ${y + 190} Z`} fill={C.ink}/>
      </svg>
      <div style={{position: "absolute", left: x - 640, top: y + 10, width: 1280, height: 26, background: "#8C7A5A", transform: `rotate(${ang}deg)`, transformOrigin: "50% 50%"}}>
        <div style={{position: "absolute", left: 760, top: -230, width: 440, height: 230, background: C.highlightPrint, boxShadow: "0 10px 20px rgba(30,20,10,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: F.sans, fontWeight: 900, fontSize: 44, color: C.ink, lineHeight: 1.1}}>{label}</div>
      </div>
    </>
  );
};

/** a sheet of paper that tears in two (code-drawn jagged edge); left and right halves carry their own labels */
export const TearSheet: React.FC<{f: number; at: number; title: string; left?: React.ReactNode; right?: React.ReactNode}> = ({f, at, title, left, right}) => {
  const g = ease(f, at, at + 22, outCubic), W0 = 1100, H0 = 640, x = 960 - W0 / 2, y = 200;
  const jag = Array.from({length: 13}).map((_, i) => `${i % 2 ? 46 : 54}% ${(i / 12) * 100}%`).join(", ");
  const half = (side: "l" | "r") => (
    <div style={{position: "absolute", left: x, top: y, width: W0, height: H0, background: "#FBF8F1", boxShadow: "0 18px 34px rgba(30,20,10,0.28)",
      clipPath: side === "l" ? `polygon(0 0, ${jag}, 0 100%)` : `polygon(100% 0, ${jag}, 100% 100%)`,
      transform: `translateX(${(side === "l" ? -1 : 1) * g * 260}px) rotate(${(side === "l" ? -1 : 1) * g * 3}deg)`}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: F.serif, fontSize: 110, color: C.ink, opacity: 1 - g}}>{title}</div>
      <div style={{position: "absolute", left: side === "l" ? 40 : W0 / 2 + 40, width: W0 / 2 - 80, top: 260, opacity: g}}>{side === "l" ? left : right}</div>
    </div>
  );
  return <>{half("l")}{half("r")}</>;
};
