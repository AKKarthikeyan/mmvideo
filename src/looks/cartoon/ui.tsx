// UI pieces of the CARTOON look: pop-in badges, pills, speech bubbles, the liquid slash wipe. Every digit goes through <Num>,
// which throws if it is drawn before its lock frame (the narrator's word), as the other looks do.
import React from "react";
import {Easing, interpolate, spring} from "remotion";
import {assertLocked, shown} from "../shared/lock";
import {EditorMark, markSeed, type MarkKind} from "../shared/Marks";
import type {LookNum} from "../shared/types";
import {C} from "./palette";

export const FPS = 30;
export const SANS = "'LK Schibsted', 'Helvetica Neue', Arial, sans-serif";
export const ROUND = "'LK Bricolage', 'Arial Rounded MT Bold', Arial, sans-serif";

export const pop = (f: number, at: number, stiff = 190) => f < at ? 0 : spring({frame: f - at, fps: FPS, config: {damping: 11, stiffness: stiff, mass: 0.8}});
export const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
export const easeIO = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic)});

// A printed number: digits drawn only from the lock frame.
export const Num: React.FC<{n: LookNum; f: number; where?: string}> = ({n, f, where}) => {
  assertLocked(n, f, where);
  return <>{n.text}</>;
};

// White rounded badge with one big number and an optional caption under it.
// A hand-drawn mark (rough-notation, MIT) that draws itself round a number after it lands; the seed changes every 3 frames, so the
// line "boils" the way hand-inked animation does.
export type Accent = {kind: MarkKind; color: string; seed?: number};
export const Inked: React.FC<{accent: Accent | undefined; f: number; at: number; children: React.ReactNode}> = ({accent, f, at, children}) =>
  !accent ? <>{children}</> :
  <EditorMark kind={accent.kind} at={at} dur={10} seed={markSeed(900 + (accent.seed ?? 0), Math.floor(f / 3) % 4)} color={accent.color} strokeWidth={accent.kind === "highlight" ? 1 : 7}
    padding={accent.kind === "circle" ? {left: 22, right: 22, top: 4, bottom: 4} : undefined}>{children}</EditorMark>;

export const Badge: React.FC<{n: LookNum | null; f: number; caption?: string; color?: string; size?: number; rot?: number; at?: number; accent?: Accent}> =
  ({n, f, caption, color = C.royal, size = 170, rot = -2, at, accent}) => {
  if (n && !shown(n, f)) return null;
  const t = pop(f, at ?? (n ? n.lockF : 0));
  if (t <= 0.001) return null;
  return <div style={{display: "inline-flex", flexDirection: "column", alignItems: "center", background: C.white, borderRadius: 44, padding: `18px 40px ${caption ? 20 : 14}px`,
    border: `8px solid ${C.ink}`, boxShadow: `0 12px 0 ${C.ink}`, transform: `scale(${t}) rotate(${rot}deg)`, transformOrigin: "50% 60%"}}>
    {n && <Inked accent={accent} f={f} at={(at ?? n.lockF) + 8}><div style={{fontFamily: ROUND, fontWeight: 800, fontSize: size, lineHeight: 1, color, letterSpacing: -2, whiteSpace: "nowrap", fontFeatureSettings: "'lnum' 1"}}><Num n={n} f={f} where="badge"/></div></Inked>}
    {caption && <div style={{fontFamily: SANS, fontWeight: 800, fontSize: Math.round(size * 0.24), lineHeight: 1.12, color: C.ink, marginTop: 8, textAlign: "center", maxWidth: 640}}>{caption}</div>}
  </div>;
};

// White pill, top-left style tag (location / date / source kind).
export const Pill: React.FC<{text: string; f: number; at: number; color?: string; dot?: string; size?: number}> = ({text, f, at, color = C.ink, dot = C.red, size = 34}) => {
  const t = pop(f, at, 220);
  if (t <= 0.001) return null;
  return <div style={{display: "inline-flex", alignItems: "center", gap: 14, background: C.white, borderRadius: 999, padding: "12px 28px 12px 18px", border: `6px solid ${C.ink}`,
    boxShadow: `0 8px 0 ${C.ink}`, transform: `scale(${t})`, transformOrigin: "0% 50%", fontFamily: SANS, fontWeight: 900, fontSize: size, color, letterSpacing: 0.5, whiteSpace: "nowrap"}}>
    <span style={{width: size * 0.62, height: size * 0.62, borderRadius: "50%", background: dot, border: `5px solid ${C.ink}`}}/>{text}
  </div>;
};

// Text with *starred* parts in an accent colour; a starred part carrying a number is hidden until its lock frame.
export const RichLine: React.FC<{text: string; f: number; accent: string; locks?: {text: string; num: LookNum | null}[]; size: number; color: string; mark?: Accent}> =
  ({text, f, accent, locks = [], size, color, mark}) => {
  const parts = text.split("*");
  return <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: size, lineHeight: 1.04, color, letterSpacing: -1, whiteSpace: "nowrap"}}>
    {parts.map((p, i) => {
      if (i % 2 === 0) return <React.Fragment key={i}>{p}</React.Fragment>;
      const tk = locks.find((l) => l.text === p), hide = !!(tk?.num && !shown(tk.num, f));
      const t = tk?.num ? pop(f, tk.num.lockF) : 1;
      return <span key={i} style={{display: "inline-block", color: accent, visibility: hide ? "hidden" : "visible", transform: `scale(${hide ? 1 : 0.6 + 0.4 * Math.min(1.12, t)})`, transformOrigin: "50% 70%"}}>
        <Inked accent={tk?.num ? mark : undefined} f={f} at={(tk?.num?.lockF ?? 0) + 6}>{p}</Inked></span>;
    })}
  </div>;
};

// White speech bubble, tail at (tx, ty) relative to the bubble's bottom-left.
export const Bubble: React.FC<{text: string; f: number; at: number; size?: number; tail?: "left" | "right"}> = ({text, f, at, size = 62, tail = "left"}) => {
  const t = pop(f, at, 200);
  if (t <= 0.001) return null;
  return <div style={{position: "relative", display: "inline-block", background: C.white, border: `7px solid ${C.ink}`, borderRadius: 44, padding: "26px 38px", maxWidth: 640,
    boxShadow: `0 10px 0 ${C.ink}`, transform: `scale(${t})`, transformOrigin: tail === "left" ? "10% 100%" : "90% 100%", fontFamily: ROUND, fontWeight: 800, fontSize: size, lineHeight: 1.06, color: C.ink, letterSpacing: -0.5}}>
    {text}
    <svg width={90} height={70} viewBox="0 0 90 70" style={{position: "absolute", bottom: -62, [tail]: 56} as React.CSSProperties}>
      <path d="M 6 0 L 40 62 L 74 0 Z" fill={C.white} stroke={C.ink} strokeWidth={7} strokeLinejoin="round"/>
      <rect x={0} y={-6} width={80} height={14} fill={C.white}/>
    </svg>
  </div>;
};

// Price tag on a string.
export const Tag: React.FC<{n: LookNum; f: number; x: number; y: number; at?: number; size?: number; swing?: number}> = ({n, f, x, y, at, size = 96, swing = 1}) => {
  if (!shown(n, f)) return null;
  const a0 = at ?? n.lockF, t = pop(f, a0, 160), rot = Math.sin((f - a0) / 6) * 9 * swing * Math.exp(-(f - a0) / 40);
  if (t <= 0.001) return null;
  return <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${t})`}>
    <path d={`M 0 0 L -${size * 0.3} ${size * 0.55} L ${size * 0.3} ${size * 0.55} Z`} fill="none" stroke={C.ink} strokeWidth={5}/>
    <path d={`M -${size * 0.62} ${size * 0.55} L ${size * 0.62} ${size * 0.55} L ${size * 0.62} ${size * 1.55} L -${size * 0.62} ${size * 1.55} Z`} fill={C.white} stroke={C.ink} strokeWidth={8} strokeLinejoin="round"/>
    <circle cx={0} cy={size * 0.7} r={size * 0.08} fill={C.ink}/>
    <text x={0} y={size * 1.38} textAnchor="middle" fontFamily={ROUND} fontWeight={800} fontSize={size * 0.78} fill={C.red}>{n.text}</text>
  </g>;
};

// Liquid slash wipe: royal blue covers left to right along a slant and uncovers behind it. Centre frame `at`, 18 frames long.
export const Wipe: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = (f - (at - 9)) / 18;
  if (t <= 0 || t >= 1) return null;
  const p1 = easeIO(t * 2, 0, 1), p2 = easeIO(t * 2 - 1, 0, 1), sk = 360, lead = -sk + (1080 + 2 * sk) * p1, trail = -sk + (1080 + 2 * sk) * p2;
  const wob = (y: number, x: number) => x + Math.sin(y / 120 + t * 9) * 26;
  const edge = (x: number) => [0, 480, 960, 1440, 1920].map((y, i) => `${wob(i, x - sk * (y / 1920) + sk)},${y}`);
  const A = edge(lead).join(" "), B = edge(trail).reverse().join(" ");
  return <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
    <polygon points={`${A} ${B}`} fill={C.royal}/>
    <polygon points={`${edge(lead + 46).join(" ")} ${edge(lead).reverse().join(" ")}`} fill={C.white}/>
  </svg>;
};
