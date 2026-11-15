// KURZ look: one stage set on its own (no cast, props or text), for other scene kinds that want a backdrop (for example the 1970
// half of the ending split). 1920 x 1080 SVG; place it inside a clipped box and scale it as needed.
// Usage: <SetScene set="village" f={f} dur={dur} tint="sepia"/>
import React from "react";
import {ArtCtx, toneFn, useUid, type Tint} from "./base";
import {SETS} from "./sets";

export const SetScene: React.FC<{set: string; f: number; dur?: number; tint?: Tint; push?: number}> = ({set, f, dur = 300, tint = "day", push = 0.05}) => {
  const S = SETS[set];
  if (!S) throw new Error(`kurz SetScene: no set "${set}"`);
  const uid = useUid(), art = React.useMemo(() => ({T: toneFn(tint), uid, tint}), [tint, uid]);
  const u = Math.min(1, Math.max(0, f / dur)), k = 1 + push * (u * u * (3 - 2 * u));
  const dx = Math.sin(f / 170) * 12, dy = Math.sin(f / 230 + 1) * 6;
  const L = (d: number) => `translate(960 640) scale(${1 + (k - 1) * d}) translate(-960 -640) translate(${dx * d} ${dy * d})`;
  return <ArtCtx.Provider value={art}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute", left: 0, top: 0, width: "100%", height: "100%"}}>
      <S.Back f={f} L={L} scroll={0}/>
      <S.Front f={f} L={L} scroll={0}/>
    </svg>
  </ArtCtx.Provider>;
};

export const SET_LIST = Object.keys(SETS);
