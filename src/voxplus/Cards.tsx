// Chapter card, "PAUSE" aside card, headline/quote stack and the corner source tag.
import React from "react";
import {AbsoluteFill, Img, random} from "remotion";
import {PaperSurface} from "./Texture";
import {C, F, V, clamp01, ease, inOut, outQuint, shake, spr} from "./tokens";

/** Small source credit, top-left by default (never in the caption band): "BERKSHIRE HATHAWAY · 1985 LETTER". */
export const SourceTag: React.FC<{f: number; at: number; text: string; until?: number; dark?: boolean; pos?: "tl" | "bl" | "br"}> =
  ({f, at, text, until, dark, pos = "tl"}) => {
    const o = Math.min(ease(f, at, at + 10, outQuint), until != null ? 1 - ease(f, until, until + 8) : 1);
    if (o <= 0) return null;
    const place: React.CSSProperties = pos === "tl" ? {left: 54, top: 46} : pos === "bl" ? {left: 54, bottom: 46} : {right: 54, bottom: 46};
    return (
      <div style={{position: "absolute", ...place, opacity: o, transform: `translateX(${(1 - o) * -24}px)`, display: "flex", alignItems: "center", gap: 12,
        fontFamily: F.mono, fontWeight: 500, fontSize: 21, letterSpacing: 2, color: dark ? "#D8D2C6" : C.inkSoft, textTransform: "uppercase",
        background: dark ? "rgba(14,14,14,0.78)" : "rgba(246,242,233,0.94)", padding: "9px 16px 8px 14px", boxShadow: dark ? undefined : "0 2px 6px rgba(30,20,10,0.15)"}}>
        <div style={{width: 10, height: 10, background: C.highlight, boxShadow: dark ? undefined : "0 0 0 1.5px rgba(0,0,0,0.25)"}}/>
        {text}
      </div>
    );
  };

/** Chapter card: cream, small italic kicker, "Chapter N:" small, the chapter word huge in serif, a faint drifting icon grid. */
export const ChapterCard: React.FC<{f: number; n: number; word: string; kicker?: string; at?: number}> = ({f, n, word, kicker, at = 0}) => {
  const t = f - at;
  const k = ease(t, 0, 12, outQuint), w = ease(t, 6, 20, outQuint), u = ease(t, 22, 34, inOut);
  const icons = Array.from({length: 40});
  return (
    <AbsoluteFill>
      <PaperSurface drift={clamp01(t / 90)}/>
      <AbsoluteFill style={{opacity: 0.11}}>
        {icons.map((_, i) => {
          const col = i % 8, row = Math.floor(i / 8), kind = Math.floor(random("ci" + i) * 3);
          const x = 120 + col * 240 + (row % 2) * 120 - t * 0.8, y = 120 + row * 210 + Math.sin(t * 0.04 + i) * 6;
          return <div key={i} style={{position: "absolute", left: x, top: y, width: 70, height: 70, border: `5px solid ${C.ink}`,
            borderRadius: kind === 0 ? "50%" : kind === 1 ? 8 : "50% 50% 8px 8px", transform: `rotate(${random("cr" + i) * 30 - 15}deg)`}}/>;
        })}
      </AbsoluteFill>
      {kicker ? <div style={{position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: F.serif, fontStyle: "italic", fontSize: 46,
        color: C.inkSoft, opacity: k, transform: `translateY(${(1 - k) * 20}px)`}}>{kicker}</div> : null}
      <div style={{position: "absolute", left: 0, right: 0, top: 452, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 40, letterSpacing: 6,
        color: C.markerRed, textTransform: "uppercase", opacity: k}}>Chapter {n}:</div>
      <div style={{position: "absolute", left: 0, right: 0, top: 510, height: 260, overflow: "hidden", textAlign: "center"}}>
        <div style={{fontFamily: F.serif, fontSize: 230, lineHeight: 1.05, color: C.ink, transform: `translateY(${(1 - w) * 260}px)`}}>{word}</div>
      </div>
      <div style={{position: "absolute", left: 960 - 330, top: 782, width: 660, height: 22, background: C.highlight, transform: `scaleX(${u})`, transformOrigin: "0 50%",
        mixBlendMode: "multiply"}}/>
    </AbsoluteFill>
  );
};

/** PAUSE aside: "|| PAUSE" grey top-left (bars blink), the term in marker, an optional cut-out icon sliding in. */
export const PauseCard: React.FC<{f: number; term: string; note?: string; icon?: {src: string; w: number; h: number}; at?: number}> =
  ({f, term, note, icon, at = 0}) => {
    const t = f - at;
    const k = spr(t, 0, 14, 180), blink = Math.floor(t / 12) % 2 === 0 ? 1 : 0.35;
    const chars = term.length, typed = Math.min(chars, Math.floor(Math.max(0, t - 8) / 1.4));
    const sh = shake(t, 0, 8, "pause");
    return (
      <AbsoluteFill>
        <PaperSurface tone="kraft" drift={clamp01(t / 90)}/>
        <div style={{position: "absolute", left: 80 + sh.x, top: 70 + sh.y, display: "flex", alignItems: "center", gap: 22, opacity: clamp01(k * 2),
          transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: "0 50%"}}>
          <div style={{display: "flex", gap: 12, opacity: blink}}>
            <div style={{width: 20, height: 74, background: "#6F6A62"}}/><div style={{width: 20, height: 74, background: "#6F6A62"}}/>
          </div>
          <div style={{fontFamily: F.sans, fontWeight: 900, fontSize: 78, letterSpacing: 8, color: "#6F6A62"}}>PAUSE</div>
        </div>
        <div style={{position: "absolute", left: 140, top: 380, fontFamily: F.marker, fontSize: 150, color: C.ink, lineHeight: 1.05, maxWidth: 1100,
          transform: "rotate(-2deg)"}}>{term.slice(0, typed)}</div>
        {note ? <div style={{position: "absolute", left: 150, top: 640, fontFamily: F.serif, fontStyle: "italic", fontSize: 52, color: C.inkSoft,
          opacity: ease(t, chars * 1.4 + 12, chars * 1.4 + 24)}}>{note}</div> : null}
        {icon ? (() => {
          const p = ease(t, 10, 22, outQuint);
          return <Img src={V(icon.src)} style={{position: "absolute", right: 120, top: 300, width: icon.w, height: icon.h,
            transform: `translateX(${(1 - p) * 700}px) rotate(${4 - 10 * (1 - p)}deg)`, filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.3))"}}/>;
        })() : null}
      </AbsoluteFill>
    );
  };

export type Clip = {kicker: string; text: string; date?: string; at: number; style?: "news" | "quote"};

/** Headline / quote stack: clippings drop into a pile with a shake and shadow; older ones darken (V4 look). */
export const HeadlineStack: React.FC<{f: number; clips: Clip[]; x?: number; y?: number; w?: number}> = ({f, clips, x = 960, y = 560, w = 1180}) => (
  <>
    {clips.map((c, i) => {
      if (f < c.at) return null;
      const k = spr(f, c.at, 12, 210);
      const landed = f - c.at > 7;
      const sh = landed ? shake(f, c.at + 7, 5, "hs" + i) : {x: 0, y: 0};
      const newer = clips.filter((d, j) => j > i && f >= d.at + 4).length;
      const rot = (random("hr" + i) - 0.5) * 6;
      const dx = (i - (clips.length - 1) / 2) * 110 + (random("hx" + i) - 0.5) * 60, dy = i * 120 - (clips.length - 1) * 60;
      const quote = c.style === "quote";
      return (
        <div key={i} style={{position: "absolute", left: x + dx + sh.x, top: y - 120 + dy + sh.y, maxWidth: w, width: "max-content",
          transform: `translateX(-50%) translateY(${(1 - k) * 700}px) rotate(${rot + (1 - k) * 8}deg) scale(${1 + (1 - k) * 0.08})`,
          filter: `brightness(${1 - Math.min(0.4, newer * 0.2)}) drop-shadow(0 ${14 + 6 * (1 - k)}px 26px rgba(20,12,6,0.35))`}}>
          <div style={{background: quote ? C.ink : "#FBF7EE", padding: "34px 50px 38px", clipPath: "polygon(0 2%, 3% 0, 30% 1.5%, 62% 0, 100% 1%, 99% 98%, 70% 100%, 35% 98.5%, 0 100%)"}}>
            <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 26, letterSpacing: 3, textTransform: "uppercase", color: quote ? C.highlight : C.markerRed}}>{c.kicker}</div>
            <div style={{fontFamily: F.serif, fontStyle: quote ? "italic" : "normal", fontSize: 64, lineHeight: 1.08, color: quote ? C.white : C.ink, marginTop: 12}}>{c.text}</div>
            {c.date ? <div style={{fontFamily: F.mono, fontSize: 22, color: quote ? "#AAA39A" : C.grey, marginTop: 16, letterSpacing: 1}}>{c.date}</div> : null}
          </div>
        </div>
      );
    })}
  </>
);
