// Scenes 09-11 shared pieces (Builder C). Local variants only: Frame (static camera), Head (one-sans headline), Note cards, Stamp-free bars.
// Nothing here edits devices*.tsx; every value is passed in by the scene from the ledger (scripts/ledger/airtelconv.csv).
import React from "react";
import {AbsoluteFill} from "remotion";
import {CamKey, Layer, camAt} from "./kit/Camera";
import {SourceTag} from "./kit/Cards";
import {Paper} from "./kit/A01V4Parts";
import {Finish} from "./kit/Texture";
import {C, F, clamp01, ease, outCubic, spr} from "./kit/tokens";

export const Frame: React.FC<{f: number; d: number; cam?: CamKey[]; chip?: string; chip2?: string; children?: React.ReactNode; over?: React.ReactNode}> =
  ({f, d, cam, chip, chip2, children, over}) => {
    const c = camAt(f, cam ?? [[0, 1.0, 960, 540], [d, 1.02, 960, 540]]);
    return (
      <AbsoluteFill>
        <Layer cam={c} depth={0.85}><Paper drift={f / Math.max(1, d)}/></Layer>
        <Layer cam={c}>{children}</Layer>
        {over}
        {chip ? <SourceTag f={f} at={0} text={chip}/> : null}
        {chip2 ? <SourceTag f={f} at={0} text={chip2} pos="bl"/> : null}
        <Finish f={f}/>
      </AbsoluteFill>
    );
  };

/** One-sans headline (Inter 800), optional small caps kicker. */
export const Head: React.FC<{f: number; at: number; b: string; a?: string; x?: number; y?: number; size?: number; align?: "left" | "center"; color?: string; w?: number}> =
  ({f, at, b, a, x = 960, y = 150, size = 70, align = "center", color = C.ink, w = 1700}) => {
    const p = ease(f, at, at + 10, outCubic);
    if (p <= 0) return null;
    return (
      <div style={{position: "absolute", left: align === "center" ? x - w / 2 : x, top: y, width: w, textAlign: align, opacity: p, transform: `translateY(${(1 - p) * 24}px)`, lineHeight: 1.05, fontFamily: F.sans}}>
        {a ? <div style={{fontWeight: 800, fontSize: 30, letterSpacing: 3, color: C.grey, marginBottom: 10}}>{a}</div> : null}
        <div style={{fontWeight: 800, fontSize: size, letterSpacing: 1, color}}>{b}</div>
      </div>
    );
  };

/** Small sticker label (e.g. OUR ARITHMETIC). */
export const Tag: React.FC<{f: number; at: number; text: string; x: number; y: number; bg?: string; color?: string; size?: number; rot?: number; anchor?: "left" | "center"}> =
  ({f, at, text, x, y, bg = C.highlight, color = C.ink, size = 30, rot = -1.5, anchor = "left"}) => {
    const e = spr(f, at, 13, 170);
    if (e <= 0.001) return null;
    return <div style={{position: "absolute", left: x, top: y, transform: `translate(${anchor === "center" ? "-50%" : "0"}, -50%) rotate(${rot}deg) scale(${0.8 + 0.2 * e})`, opacity: clamp01(e * 2),
      background: bg, color, fontFamily: F.sans, fontWeight: 800, fontSize: size, letterSpacing: 2, padding: `${size * 0.3}px ${size * 0.6}px`, whiteSpace: "nowrap",
      boxShadow: "0 8px 18px rgba(0,0,0,0.18)"}}>{text}</div>;
  };

/** Mono caption line (definitions / units), never in the bottom band. */
export const Mono: React.FC<{f: number; at: number; text: string; x: number; y: number; size?: number; align?: "left" | "center"; w?: number; color?: string}> =
  ({f, at, text, x, y, size = 24, align = "left", w = 1000, color = C.inkSoft}) => {
    const p = ease(f, at, at + 10, outCubic);
    if (p <= 0) return null;
    return <div style={{position: "absolute", left: align === "center" ? x - w / 2 : x, top: y, width: w, textAlign: align, opacity: p, fontFamily: F.mono, fontSize: size, color, letterSpacing: 1}}>{text}</div>;
  };

/** White card with an ink title strip and one big line. */
export const Card: React.FC<{f: number; at: number; x: number; y: number; w: number; h: number; strip?: string; stripBg?: string; children?: React.ReactNode; grey?: boolean}> =
  ({f, at, x, y, w, h, strip, stripBg = C.ink, children, grey}) => {
    const e = spr(f, at, 14, 150);
    if (e <= 0.001) return null;
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, opacity: clamp01(e * 2), transform: `translateY(${(1 - e) * 260}px) rotate(-0.5deg)`,
        background: grey ? C.paperDeep : C.white, border: grey ? `3px dashed ${C.grey}` : undefined, borderRadius: 16, boxShadow: grey ? undefined : "0 22px 50px rgba(0,0,0,0.25)",
        overflow: "hidden", fontFamily: F.sans, display: "flex", flexDirection: "column"}}>
        {strip ? <div style={{background: stripBg, color: C.white, padding: "14px 28px", fontWeight: 800, fontSize: 30, letterSpacing: 3, whiteSpace: "nowrap"}}>{strip}</div> : null}
        <div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 30px"}}>{children}</div>
      </div>
    );
  };
