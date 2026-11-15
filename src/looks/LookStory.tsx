// The look dispatcher. BeatStory (src/datayt/BeatStory.tsx) renders <LookStory D={D}/> when data.json carries a "look";
// the DATA-<id>-look-<look> previews (LookCompositions.tsx) pass the look as a prop. LookStory builds the LookData
// (shared/useLookData.ts), resolves the brand for the look (brands/index.ts), loads and checks the fonts, then draws the
// look. Each look lives in its own folder and only exports its component here.
import React, {useMemo} from "react";
import {AbsoluteFill} from "remotion";
import type {BeatData} from "../datayt/BeatStory";
import {facesFor, getBrand, lookBrand} from "./brands";
import type {LookId} from "./brands/types";
import {CounterStory} from "./counter/CounterStory";
import {DispatchStory} from "./dispatch/DispatchStory";
import {LookFonts} from "./shared/LookFonts";
import type {LookOpts, LookProps} from "./shared/types";
import {useLookData} from "./shared/useLookData";
import {SlabStory} from "./slab/SlabStory";

export const LOOKS: Record<LookId, React.FC<LookProps>> = {slab: SlabStory, counter: CounterStory, dispatch: DispatchStory};

export type LookStoryProps = {D: BeatData; look?: string; brand?: string; lookOpts?: LookOpts};

export const LookStory: React.FC<LookStoryProps> = ({D, look, brand, lookOpts}) => {
  const L = useLookData(D, {look, brand, lookOpts});
  const B = useMemo(() => lookBrand(getBrand(L.brand), L.look), [L.brand, L.look]);
  const faces = useMemo(() => facesFor(getBrand(L.brand), L.look), [L.brand, L.look]);
  const Look = LOOKS[L.look];
  return <AbsoluteFill style={{background: B.c.ground}}>
    <LookFonts faces={faces}><Look L={L} B={B}/></LookFonts>
  </AbsoluteFill>;
};
