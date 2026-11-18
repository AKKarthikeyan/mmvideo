// Airtel-specific recurring devices (parameterised, drawn in code, no invented data: every value is passed in by the scene
// from the script / ledger). `f` is the local tick (30/s) from useTicks(); `at` values are local ticks (use useAt from ./cue).
// SuspectCards (01, 02, 04-07, 11), BillCard (01, 11), QuoteCard (04, 06, 08), LineChart (03, 07, 08), PairBars (03, 05, 07, 09, 10).
// DotGrid (05) lives in ./devices. Imports only from ./kit and ./devices.
import React from "react";
import {Img} from "remotion";
import {Stamp} from "./kit/A01V4Parts";
import {C, F, V, clamp01, ease, outCubic, outQuint, spr} from "./kit/tokens";

// ---------------------------------------------------------------------------------------------------------------------
// Three suspect cards: PRICE, MIX, CONVERGENCE. Slide in at `at` (blank), optional active card (raised, teal), optional stamp per card.
// ---------------------------------------------------------------------------------------------------------------------
export type Suspect = "PRICE" | "MIX" | "CONVERGENCE";
export const SUSPECTS: Suspect[] = ["PRICE", "MIX", "CONVERGENCE"];
export type CardStamp = {text: string; at: number; color?: string};
export const SuspectCards: React.FC<{f: number; at?: number; x?: number; y?: number; w?: number; h?: number; active?: Suspect | null;
  stamps?: Partial<Record<Suspect, CardStamp>>; dimOthers?: boolean}> = ({f, at = 0, x = 960, y = 800, w = 1500, h = 220, active = null, stamps = {}, dimOthers = true}) => {
  const gap = 36, cw = (w - gap * 2) / 3;
  return (
    <div style={{position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h}}>
      {SUSPECTS.map((name, i) => {
        const e = spr(f, at + i * 5, 14, 150);
        if (e <= 0.001) return null;
        const on = active === name, dim = dimOthers && active != null && !on;
        return (
          <div key={name} style={{position: "absolute", left: i * (cw + gap), top: 0, width: cw, height: h, transform: `translateY(${(1 - e) * 420 - (on ? 18 : 0)}px) rotate(${(i - 1) * 1.2}deg)`,
            background: on ? C.teal : C.white, color: on ? C.white : C.ink, borderRadius: 18, opacity: clamp01(e * 2) * (dim ? 0.45 : 1),
            boxShadow: on ? "0 26px 50px rgba(0,0,0,0.3)" : "0 12px 26px rgba(0,0,0,0.18)", display: "flex", alignItems: stamps[name] ? "flex-start" : "center", justifyContent: "center", paddingTop: stamps[name] ? h * 0.12 : 0,
            fontFamily: F.sans, fontWeight: 800, fontSize: Math.min(76, cw / 9.5), letterSpacing: 2, whiteSpace: "nowrap"}}>
            {name}
            {stamps[name] ? <Stamp f={f} at={stamps[name]!.at} text={stamps[name]!.text} x={cw / 2} y={h * 0.76} size={Math.min(30, cw / 17)} color={stamps[name]!.color ?? C.markerRed}/> : null}
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// Generic mobile bill screen (original interface, no real customer). Finger taps "Paid" at tapAt; the amount ticks from `from` to `to`.
// ---------------------------------------------------------------------------------------------------------------------
export const BillCard: React.FC<{f: number; x?: number; y?: number; s?: number; rot?: number; enterAt?: number; tapAt?: number; tickAt?: number; tickDur?: number;
  from: number; to: number; fromLabel?: string; toLabel?: string; prefix?: string; title?: string}> =
  ({f, x = 960, y = 540, s = 1, rot = -2, enterAt = -30, tapAt, tickAt, tickDur = 24, from, to, fromLabel, toLabel, prefix = "₹", title = "Monthly mobile bill"}) => {
  const e = enterAt <= -30 ? 1 : spr(f, enterAt, 14, 150);
  if (e <= 0.001) return null;
  const k = tickAt != null ? ease(f, tickAt, tickAt + tickDur, outCubic) : 0;
  const val = Math.round(from + (to - from) * k);
  const paid = tapAt != null ? ease(f, tapAt + 3, tapAt + 9, outCubic) : 0;
  const finger = tapAt != null ? ease(f, tapAt - 14, tapAt, outCubic) * (1 - ease(f, tapAt + 4, tapAt + 16)) : 0;
  const W0 = 560, H0 = 1000;
  return (
    <div style={{position: "absolute", left: x, top: y, width: W0, height: H0, opacity: clamp01(e * 2),
      transform: `translate(-50%, -50%) translateY(${(1 - e) * 500}px) rotate(${rot}deg) scale(${s})`}}>
      <div style={{position: "absolute", inset: 0, borderRadius: 70, background: "linear-gradient(160deg, #3A3733, #1C1A18)", boxShadow: "0 40px 70px rgba(0,0,0,0.35)"}}/>
      <div style={{position: "absolute", inset: 22, borderRadius: 52, background: C.white, overflow: "hidden", fontFamily: F.sans}}>
        <div style={{margin: "64px 40px 0", fontWeight: 600, fontSize: 30, color: C.grey}}>{title}</div>
        <div style={{margin: "34px 40px 0", fontWeight: 800, fontSize: 150, lineHeight: 1, color: k > 0 ? C.teal : C.ink}}>{prefix}{val}</div>
        <div style={{margin: "26px 40px 0", display: "flex", gap: 24, fontWeight: 600, fontSize: 28, color: C.grey}}>
          {fromLabel ? <span style={{opacity: 1 - 0.5 * k}}>{fromLabel}</span> : null}
          {toLabel ? <span style={{color: C.teal, opacity: k}}>{toLabel}</span> : null}
        </div>
        <div style={{position: "absolute", left: 40, right: 40, bottom: 90, height: 96, borderRadius: 48, background: paid > 0.5 ? C.teal : C.ink, color: C.white,
          display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 40}}>{paid > 0.5 ? "Paid" : "Pay"}</div>
        {tapAt != null ? <div style={{position: "absolute", left: "50%", bottom: 120, width: 70, height: 70, borderRadius: 35, background: "rgba(14,14,14,0.35)",
          transform: `translate(-50%, ${(1 - finger) * 120}px)`, opacity: finger}}/> : null}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// Quote card: transcript crop (png under public/voxplus/, e.g. made by scripts/voxplus/airtel_docshots.py) + speaker + 'management says'.
// Without `src` it draws a clearly marked placeholder box (never a fabricated page).
// ---------------------------------------------------------------------------------------------------------------------
export const QuoteCard: React.FC<{f: number; at: number; x?: number; y?: number; w?: number; src?: string; imgW?: number; imgH?: number;
  speaker: string; source: string; label?: string; quote?: string}> =
  ({f, at, x = 960, y = 540, w = 1200, src, imgW = 1200, imgH = 300, speaker, source, label = "MANAGEMENT SAYS", quote}) => {
  const e = spr(f, at, 14, 150);
  if (e <= 0.001) return null;
  const ih = (w * imgH) / imgW;
  return (
    <div style={{position: "absolute", left: x - w / 2, top: y - (ih + 150) / 2, width: w, opacity: clamp01(e * 2), transform: `translateY(${(1 - e) * 300}px) rotate(-0.6deg)`,
      background: C.white, borderRadius: 14, boxShadow: "0 22px 50px rgba(0,0,0,0.25)", overflow: "hidden", fontFamily: F.sans}}>
      <div style={{background: C.ink, color: C.white, padding: "14px 28px", fontWeight: 800, fontSize: 28, letterSpacing: 3}}>{label}</div>
      {src ? <Img src={V(src)} style={{display: "block", width: w, height: ih}}/> :
        <div style={{width: w, height: ih, display: "flex", alignItems: "center", justifyContent: "center", background: C.paperDeep, color: C.ink, fontWeight: 700, fontSize: 38, lineHeight: 1.25, padding: 30, textAlign: "center"}}>
          {quote ?? "TRANSCRIPT CROP PLACEHOLDER"}</div>}
      <div style={{padding: "14px 28px", fontWeight: 800, fontSize: 32, color: C.ink}}>{speaker}<span style={{fontWeight: 600, color: C.grey}}> · {source}</span></div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// Line chart: zero-based y axis, one direct label per point (no legend, no invented points), line draws left to right,
// `hi` indices get a ring + bold label at their own tick. Values come from the caller (ledger rows).
// ---------------------------------------------------------------------------------------------------------------------
export type LinePoint = {label: string; v: number; text?: string; hi?: {at: number; color?: string}};
export const LineChart: React.FC<{f: number; at: number; x: number; y: number; w: number; h: number; points: LinePoint[]; yMax?: number; drawDur?: number;
  unit?: string; title?: string; source?: string; color?: string; digits?: number}> =
  ({f, at, x, y, w, h, points, yMax, drawDur = 90, unit = "", title, source, color = C.teal, digits = 0}) => {
  const max = yMax ?? Math.max(...points.map((p) => p.v)) * 1.15;
  const px = (i: number) => (points.length === 1 ? w / 2 : (i / (points.length - 1)) * w), py = (v: number) => h - (v / max) * h;
  const prog = ease(f, at, at + drawDur, outCubic) * (points.length - 1);
  const shown = points.map((_, i) => i <= prog);
  const d = points.map((p, i) => `${i ? "L" : "M"}${px(i)} ${py(p.v)}`).join(" ");
  return (
    <div style={{position: "absolute", left: x, top: y, width: w, height: h, fontFamily: F.sans}}>
      {title ? <div style={{position: "absolute", left: 0, top: -110, fontWeight: 800, fontSize: 38, color: C.ink}}>{title}</div> : null}
      <svg width={w} height={h} style={{overflow: "visible"}}>
        <line x1={0} y1={h} x2={w} y2={h} stroke={C.ink} strokeWidth={3}/>
        <path d={d} fill="none" stroke={color} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - prog / (points.length - 1)}/>
        {points.map((p, i) => {
          if (!shown[i]) return null;
          const hi = p.hi && f >= p.hi.at ? clamp01((f - p.hi.at) / 8) : 0;
          return (
            <g key={i}>
              <circle cx={px(i)} cy={py(p.v)} r={9} fill={color}/>
              {hi > 0 ? <circle cx={px(i)} cy={py(p.v)} r={14 + 16 * hi} fill="none" stroke={p.hi!.color ?? C.markerRed} strokeWidth={6} opacity={hi}/> : null}
              <text x={px(i)} y={py(p.v) - 32} textAnchor="middle" fontWeight={hi > 0 ? 900 : 800} fontSize={hi > 0 ? 40 : 34} fill={hi > 0 ? (p.hi!.color ?? C.markerRed) : C.ink}>{p.text ?? p.v.toFixed(digits) + unit}</text>
              <text x={px(i)} y={h + 46} textAnchor="middle" fontWeight={600} fontSize={26} fill={C.grey}>{p.label}</text>
            </g>
          );
        })}
      </svg>
      {source ? <div style={{position: "absolute", left: 0, top: h + 80, fontFamily: F.mono, fontSize: 24, color: C.grey}}>{source}</div> : null}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// Pair (or small set) of zero-based bars with direct labels. Every bar's height is value/max of the SAME axis.
// ---------------------------------------------------------------------------------------------------------------------
export type BarItem = {label: string; v: number; text?: string; at: number; color?: string};
export const PairBars: React.FC<{f: number; x: number; y: number; w: number; h: number; items: BarItem[]; max?: number; title?: string; source?: string; barW?: number}> =
  ({f, x, y, w, h, items, max, title, source, barW = 220}) => {
  const m = max ?? Math.max(...items.map((b) => b.v)) * 1.1, slot = w / items.length;
  return (
    <div style={{position: "absolute", left: x, top: y, width: w, height: h, fontFamily: F.sans}}>
      {title ? <div style={{position: "absolute", left: 0, top: -100, fontWeight: 800, fontSize: 38, color: C.ink}}>{title}</div> : null}
      <div style={{position: "absolute", left: 0, top: h, width: w, height: 3, background: C.ink}}/>
      {items.map((b, i) => {
        const k = ease(f, b.at, b.at + 20, outQuint), bh = (b.v / m) * h * k;
        return (
          <div key={i}>
            <div style={{position: "absolute", left: i * slot + (slot - barW) / 2, top: h - bh, width: barW, height: bh, background: b.color ?? C.teal}}/>
            <div style={{position: "absolute", left: i * slot, width: slot, top: h - bh - 58, textAlign: "center", fontWeight: 800, fontSize: 44, color: C.ink, opacity: k > 0.2 ? 1 : 0}}>{b.text ?? String(b.v)}</div>
            <div style={{position: "absolute", left: i * slot, width: slot, top: h + 18, textAlign: "center", fontWeight: 600, fontSize: 30, color: C.grey}}>{b.label}</div>
          </div>
        );
      })}
      {source ? <div style={{position: "absolute", left: 0, top: h + 80, fontFamily: F.mono, fontSize: 24, color: C.grey}}>{source}</div> : null}
    </div>
  );
};
