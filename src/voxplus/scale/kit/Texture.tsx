// Surfaces and finishing layers: the "table" every scene sits on, and the grain/vignette that is always on.
// All textures are drawn in code (tools/prep_media.py) - no licence risk.
import React from "react";
import {AbsoluteFill, random} from "remotion";
import {C, V} from "./tokens";

/**
 * Cream (or kraft) paper desk. `drift` 0..1 = a slow 0-3% scale over the shot so a static card never looks frozen.
 * It bleeds 1200 px past every edge so parallax layers (depth < 1) and camera moves never expose the frame edge.
 */
export const PaperSurface: React.FC<{tone?: "cream" | "kraft"; drift?: number; tint?: string; style?: React.CSSProperties; bleed?: number; texture?: number}> =
  ({tone = "cream", drift = 0, tint, style, bleed = 1200, texture = 1}) => (
    <AbsoluteFill style={{left: -bleed, top: -bleed, width: 1920 + 2 * bleed, height: 1080 + 2 * bleed,
      background: tone === "cream" ? C.paper : C.kraft, overflow: "hidden", ...style}}>
      <AbsoluteFill style={{backgroundImage: `url(${V(tone === "cream" ? "tex/paper.jpg" : "tex/paper_dark.jpg")})`, backgroundSize: "1024px 1024px",
        transform: `scale(${1 + 0.03 * drift})`, transformOrigin: "50% 50%", opacity: texture}}/>
      {tint ? <AbsoluteFill style={{background: tint, mixBlendMode: "multiply"}}/> : null}
    </AbsoluteFill>
  );

/** Ink-black ground for charts and big type, with a faint warm lift in the centre (never a flat #000). */
export const InkSurface: React.FC<{glow?: number}> = ({glow = 0.08}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 65% at 50% 45%, rgba(255,240,210,${glow}), rgba(0,0,0,0) 70%), ${C.ink}`}}/>
);

/** Film grain: one code-drawn noise tile jumped to a new offset every `every` frames. Overlay blend, 4-7%. */
export const Grain: React.FC<{f: number; opacity?: number; every?: number; blend?: React.CSSProperties["mixBlendMode"]}> =
  ({f, opacity = 0.06, every = 2, blend = "overlay"}) => {
    const k = Math.floor(f / every);
    return <AbsoluteFill style={{backgroundImage: `url(${V("tex/grain.png")})`, backgroundSize: "512px 512px",
      backgroundPosition: `${Math.floor(random("gx" + k) * 512)}px ${Math.floor(random("gy" + k) * 512)}px`,
      mixBlendMode: blend, opacity, pointerEvents: "none"}}/>;
  };

/** Corner darkening 10-15% (radial). */
export const Vignette: React.FC<{strength?: number; color?: string}> = ({strength = 0.22, color = "20,14,8"}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 78% 74% at 50% 48%, rgba(${color},0) 58%, rgba(${color},${strength}) 100%)`, pointerEvents: "none"}}/>
);

/** Halftone dot screen to lay over a photo (multiply). size = dot pitch in px. */
export const Halftone: React.FC<{size?: number; opacity?: number; color?: string}> = ({size = 5, opacity = 0.18, color = "#000"}) => (
  <AbsoluteFill style={{backgroundImage: `radial-gradient(circle at 50% 50%, ${color} 0.9px, rgba(0,0,0,0) 1.6px)`, backgroundSize: `${size}px ${size}px`,
    mixBlendMode: "multiply", opacity, pointerEvents: "none"}}/>
);

/** The always-on finish: grain + vignette. Put it last in a composition. */
export const Finish: React.FC<{f: number; grain?: number; vignette?: number; dark?: boolean}> = ({f, grain = 0.06, vignette = 0.22, dark}) => (
  <>
    <Vignette strength={dark ? vignette * 1.6 : vignette}/>
    <Grain f={f} opacity={dark ? grain * 1.3 : grain} blend={dark ? "screen" : "overlay"}/>
  </>
);
