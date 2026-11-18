// Airtel film, scenes 01-04: local pieces (bill phone with a hidden-amount state, year rows, icon discs, chips, pull quote).
// Everything is drawn in code (original artwork, no real customer). Imports only from ./kit and ./devices*.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Icon, IconName, Paper} from "./kit/A01V4Parts";
import {Finish} from "./kit/Texture";
import {C, F, clamp01, ease, outCubic, outQuint, spr} from "./kit/tokens";

/** paper background + finish; children sit between */
export const Stage: React.FC<{f: number; d: number; children?: React.ReactNode}> = ({f, d, children}) => (
  <AbsoluteFill>
    <Paper drift={f / d}/>
    {children}
    <Finish f={f}/>
  </AbsoluteFill>
);

/** small ink label chip, optional accent background */
export const Chip: React.FC<{f: number; at: number; text: string; x: number; y: number; size?: number; bg?: string; color?: string; anchor?: "left" | "center" | "right"}> =
  ({f, at, text, x, y, size = 40, bg = C.ink, color = C.white, anchor = "center"}) => {
    const p = ease(f, at, at + 10, outCubic);
    if (p <= 0) return null;
    const tx = anchor === "center" ? "-50%" : anchor === "right" ? "-100%" : "0";
    return (
      <div style={{position: "absolute", left: x, top: y, transform: `translate(${tx}, -50%) translateY(${(1 - p) * 20}px)`, opacity: p, background: bg, color, fontFamily: F.sans,
        fontWeight: 800, fontSize: size, letterSpacing: 2, padding: `${size * 0.3}px ${size * 0.6}px`, whiteSpace: "nowrap", boxShadow: "0 6px 14px rgba(0,0,0,0.16)"}}>{text}</div>
    );
  };

/** MANAGEMENT SAYS tag (rust) */
export const MgmtTag: React.FC<{f: number; at: number; x: number; y: number; size?: number; text?: string}> = ({f, at, x, y, size = 30, text = "MANAGEMENT SAYS"}) =>
  <Chip f={f} at={at} text={text} x={x} y={y} size={size} bg={C.rust}/>;

// ---------------------------------------------------------------------------------------------------------------------
// Bill phone: generic bill screen (same look as BillCard) whose amount can stay hidden until the figure is spoken.
// ---------------------------------------------------------------------------------------------------------------------
export const BillPhone: React.FC<{f: number; x: number; y: number; s: number; rot?: number; amount?: string | null; amountAt?: number; tapAt?: number; title?: string; fade?: number}> =
  ({f, x, y, s, rot = -2, amount, amountAt = 0, tapAt = 14, title = "Monthly mobile bill", fade = 1}) => {
  const paid = ease(f, tapAt + 3, tapAt + 9, outCubic);
  const finger = ease(f, tapAt - 14, tapAt, outCubic) * (1 - ease(f, tapAt + 4, tapAt + 16));
  const k = amount ? spr(f, amountAt, 11, 200) : 0;
  return (
    <div style={{position: "absolute", left: x, top: y, width: 560, height: 1000, opacity: fade, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s})`}}>
      <div style={{position: "absolute", inset: 0, borderRadius: 70, background: "linear-gradient(160deg, #3A3733, #1C1A18)", boxShadow: "0 40px 70px rgba(0,0,0,0.35)"}}/>
      <div style={{position: "absolute", inset: 22, borderRadius: 52, background: C.white, overflow: "hidden", fontFamily: F.sans}}>
        <div style={{margin: "64px 40px 0", fontWeight: 600, fontSize: 30, color: C.grey}}>{title}</div>
        <div style={{margin: "34px 40px 0", height: 150, display: "flex", alignItems: "center", fontWeight: 800, fontSize: 150, lineHeight: 1,
          color: amount ? C.teal : C.grey, transform: amount ? `scale(${0.8 + 0.2 * k})` : undefined, transformOrigin: "left center", opacity: amount ? clamp01(k * 3) : 0.5}}>
          {amount ?? "₹ – – –"}</div>
        <div style={{margin: "26px 40px 0", fontWeight: 600, fontSize: 28, color: C.grey}}>Airtel · India mobile</div>
        <div style={{position: "absolute", left: 40, right: 40, bottom: 90, height: 96, borderRadius: 48, background: paid > 0.5 ? C.teal : C.ink, color: C.white,
          display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 40}}>{paid > 0.5 ? "Paid" : "Pay"}</div>
        <div style={{position: "absolute", left: "50%", bottom: 120, width: 70, height: 70, borderRadius: 35, background: "rgba(14,14,14,0.35)",
          transform: `translate(-50%, ${(1 - finger) * 120}px)`, opacity: finger}}/>
      </div>
    </div>
  );
};

/** Two year rows beside the bill: current figure big (teal), a year earlier smaller (ink). Each lands on its spoken number. */
export const YearRows: React.FC<{f: number; at1: number; at2: number; x?: number; y1?: number; y2?: number; fade?: number}> = ({f, at1, at2, x = 1330, y1 = 330, y2 = 570, fade = 1}) => {
  const row = (at: number, y: number, label: string, v: string, size: number, color: string) => {
    const e = spr(f, at, 12, 170);
    if (e <= 0.001) return null;
    return (
      <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) translateX(${(1 - e) * 120}px)`, opacity: clamp01(e * 2.5) * fade, textAlign: "center", fontFamily: F.sans, whiteSpace: "nowrap"}}>
        <div style={{display: "inline-block", background: C.ink, color: C.white, fontWeight: 800, fontSize: 30, letterSpacing: 2, padding: "8px 20px"}}>{label}</div>
        <div style={{fontWeight: 800, fontSize: size, lineHeight: 1.05, color, marginTop: 6}}>{v}</div>
      </div>
    );
  };
  return <>{row(at1, y1, "SEP 2026 · NOW", "₹271", 200, C.teal)}{row(at2, y2, "SEP 2025 · A YEAR AGO", "₹256", 150, C.ink)}</>;
};

// ---------------------------------------------------------------------------------------------------------------------
// Icon discs (labelled Illustration by the scene). NetworkIcon and DoorLockIcon are drawn here.
// ---------------------------------------------------------------------------------------------------------------------
export const NetworkIcon: React.FC<{size?: number; color?: string}> = ({size = 140, color = C.ink}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={50} cy={22} r={9}/><circle cx={18} cy={74} r={9}/><circle cx={82} cy={74} r={9}/><circle cx={50} cy={58} r={7}/>
    <path d="M 45 30 L 22 66 M 55 30 L 78 66 M 27 74 L 73 74 M 50 31 L 50 51 M 24 68 L 45 62 M 76 68 L 55 62"/>
  </svg>
);
export const DoorLockIcon: React.FC<{size?: number; color?: string}> = ({size = 140, color = C.ink}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M 22 92 L 22 10 L 78 10 L 78 92 M 12 92 L 88 92"/>
    <rect x={38} y={52} width={34} height={26} rx={4} fill={C.paper}/><path d="M 45 52 L 45 44 Q 45 34 55 34 Q 65 34 65 44 L 65 52"/>
  </svg>
);
export const IconDisc: React.FC<{f: number; at: number; x: number; y: number; d?: number; kind: "network" | "door" | IconName; label: string; dim?: number; on?: boolean}> =
  ({f, at, x, y, d = 240, kind, label, dim = 1, on = false}) => {
  const e = spr(f, at, 12, 170);
  if (e <= 0.001) return null;
  const col = on ? C.white : C.ink;
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * e})`, opacity: clamp01(e * 2.5) * dim, textAlign: "center", fontFamily: F.sans}}>
      <div style={{width: d, height: d, borderRadius: d / 2, background: on ? C.teal : C.white, boxShadow: "0 14px 30px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto"}}>
        {kind === "network" ? <NetworkIcon size={d * 0.58} color={col}/> : kind === "door" ? <DoorLockIcon size={d * 0.58} color={col}/> : <Icon name={kind} size={d * 0.58} color={col}/>}
      </div>
      <div style={{marginTop: 20, fontWeight: 800, fontSize: d > 200 ? 44 : 30, letterSpacing: 2, color: C.ink, whiteSpace: "nowrap"}}>{label}</div>
    </div>
  );
};

/** One-line pull quote in plain sans (words copied verbatim from the transcript crop shown below it). */
export const PullQuote: React.FC<{f: number; at: number; text: string; y?: number; size?: number}> = ({f, at, text, y = 150, size = 52}) => {
  const p = ease(f, at, at + 12, outQuint);
  if (p <= 0) return null;
  return (
    <div style={{position: "absolute", left: 160, right: 160, top: y, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 24}px)`, fontFamily: F.sans, fontWeight: 800,
      fontSize: size, lineHeight: 1.18, color: C.ink}}>{text}</div>
  );
};
