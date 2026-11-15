// Film grain from baked tiles (public/looks/grain/grain-0..3.png, made by scripts/datayt/look_bake.py): one tile at a time,
// changed every `hold` frames and offset by the story seed, overlay-blended at `amount`. Deterministic per frame, no
// per-frame noise computation, no WebGL. Put it above the ground and below the type.
import React from "react";
import {AbsoluteFill, staticFile, useCurrentFrame} from "remotion";

export const Grain: React.FC<{amount?: number; hold?: number; seed?: number; blend?: React.CSSProperties["mixBlendMode"]; scale?: number}> =
  ({amount = 0.14, hold = 4, seed = 1, blend = "overlay", scale = 1}) => {
  const f = useCurrentFrame();
  const k = Math.floor(f / hold);
  const i = (k + seed) % 4;
  const dx = ((k * 97 + seed * 31) % 256), dy = ((k * 53 + seed * 17) % 256);
  return <AbsoluteFill style={{pointerEvents: "none", opacity: amount, mixBlendMode: blend,
    backgroundImage: `url(${staticFile(`looks/grain/grain-${i}.png`)})`, backgroundSize: `${256 * scale}px ${256 * scale}px`,
    backgroundPosition: `${dx}px ${dy}px`, backgroundRepeat: "repeat"}}/>;
};

// A soft radial vignette (CSS only), for slab and counter grounds. The colour comes from the brand (e.g. B.c.deep).
export const Vignette: React.FC<{color: string; amount?: number}> = ({color, amount = 0.28}) =>
  <AbsoluteFill style={{pointerEvents: "none", background: `radial-gradient(ellipse at 50% 45%, transparent 55%, ${color} 140%)`, opacity: amount}}/>;
