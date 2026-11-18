// Shared pieces for the social stills (Instagram carousel 1080x1350, X image 1600x900) of "Jio's Size Advantage Has a Catch".
// Same original VoxPlus look as the film: DM Serif Display, black ink, cream paper, Vox yellow highlighter, Vox blue, marker red.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Paper, Stamp} from "../kit/A01V4Parts";
import {InkSurface, Finish} from "../kit/Texture";
import {C, F} from "../kit/tokens";
import {EntityTag, ENTITY} from "../devices";

export {EntityTag, ENTITY, Stamp};
export const CW = 1080, CH = 1350;
export const GREY_BAR = "#6B6660";
export const PROOF = 200;   // "ticks" far past any entrance so animated kit pieces (Stamp) are fully settled in a still

/** Source chip in the same style as the kit's SourceTag (yellow square, Plex Mono, uppercase) but at a phone-readable size. */
export const Src: React.FC<{text: string; dark?: boolean; left?: number; bottom?: number; size?: number; maxWidth?: number}> =
  ({text, dark, left = 60, bottom = 116, size = 28, maxWidth = 960}) => (
    <div style={{position: "absolute", left, bottom, maxWidth, display: "flex", alignItems: "center", gap: 14, fontFamily: F.mono, fontWeight: 500, fontSize: size,
      letterSpacing: 1.5, lineHeight: 1.22, color: dark ? "#E4DED2" : C.inkSoft, textTransform: "uppercase",
      background: dark ? "#2A2723" : "rgba(246,242,233,0.94)", padding: "10px 18px 9px 16px", boxShadow: dark ? "0 0 0 1.5px #4A4540" : "0 2px 6px rgba(30,20,10,0.15)"}}>
      <div style={{flex: "none", width: 14, height: 14, background: C.highlight, boxShadow: dark ? undefined : "0 0 0 1.5px rgba(0,0,0,0.25)"}}/>
      <span>{text}</span>
    </div>
  );

export const Brand: React.FC<{dark?: boolean; x?: number; bottom?: number; size?: number}> = ({dark, x = 60, bottom = 52, size = 38}) => (
  <div style={{position: "absolute", left: x, bottom, fontFamily: F.sans, fontWeight: 800, fontSize: size, letterSpacing: 1, color: dark ? C.white : C.ink}}>
    MOAT <span style={{color: dark ? C.highlight : C.teal}}>&</span> MARGIN</div>
);

export const Counter: React.FC<{n: number; dark?: boolean}> = ({n, dark}) => (
  <div style={{position: "absolute", right: 60, bottom: 52, fontFamily: F.mono, fontWeight: 500, fontSize: 36, letterSpacing: 2, color: dark ? "#D8D2C6" : C.inkSoft}}>{n}/10</div>
);

/** One carousel slide: cream paper (or ink), content, brand mark, counter, source chip, kit grain + vignette. */
export const Slide: React.FC<{n: number; dark?: boolean; src?: string; children?: React.ReactNode}> = ({n, dark, src, children}) => (
  <AbsoluteFill style={{background: dark ? C.ink : C.paper, overflow: "hidden"}}>
    {dark ? <InkSurface glow={0.08}/> : <Paper/>}
    {children}
    {src ? <Src text={src} dark={dark}/> : null}
    <Brand dark={dark}/>
    <Counter n={n} dark={dark}/>
    <Finish f={0} dark={dark}/>
  </AbsoluteFill>
);

/** Absolutely positioned text helper. */
export const T: React.FC<{x: number; y: number; w?: number; size?: number; serif?: boolean; weight?: number; color?: string; align?: "left" | "center" | "right";
  ls?: number; lh?: number; children?: React.ReactNode; style?: React.CSSProperties}> =
  ({x, y, w, size = 40, serif, weight = 800, color = C.ink, align = "left", ls = 0, lh = 1.05, children, style}) => (
    <div style={{position: "absolute", left: x, top: y, width: w, textAlign: align, fontFamily: serif ? F.serif : F.sans, fontWeight: serif ? 400 : weight, fontSize: size,
      color, letterSpacing: ls, lineHeight: lh, ...style}}>{children}</div>
  );

export const Hi: React.FC<{children: React.ReactNode; pad?: number}> = ({children, pad = 14}) => (
  <span style={{background: C.highlight, color: C.ink, padding: `0 ${pad}px`, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone"}}>{children}</span>
);

/** The slides 4-8 template: kind of moat (n of 5), title, evidence (children), verdict stamp. */
export const KindSlide: React.FC<{slide: number; kind: number; title: string; verdict: string; src: string; children: React.ReactNode}> =
  ({slide, kind, title, verdict, src, children}) => {
    const long = verdict.length > 14;
    return (
      <Slide n={slide} src={src}>
        <EntityTag f={0} text="KIND OF MOAT" period={`${kind} OF 5`} x={60} y={96} size={30}/>
        <T x={60} y={140} w={960} size={132} serif ls={-3} lh={1}>{title}</T>
        {children}
        <Stamp f={PROOF} at={0} text={verdict} x={540} y={1056} size={long ? 52 : 74} rot={-3}/>
      </Slide>
    );
  };

export const VERDICTS: [string, string, string][] = [
  ["Low cost", "PLAUSIBLE, NOT PROVEN", "plausible"],
  ["A trusted name", "MIXED", "mixed"],
  ["Hard to leave", "ENCOURAGING, NOT PROVEN", "plausible"],
  ["A crowd", "SCALE ONLY", "scale"],
  ["A licence", "PARTIAL", "partial"],
];
export const pillStyle = (tone: string): {bg: string; fg: string} =>
  tone === "strong" ? {bg: C.teal, fg: C.white} : tone === "scale" ? {bg: C.rust, fg: C.white} : {bg: C.highlight, fg: C.ink};
