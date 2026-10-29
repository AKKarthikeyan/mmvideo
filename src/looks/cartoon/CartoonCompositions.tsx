// Preview composition for the CARTOON look pilot: DATA-cw01-look-cartoon (same length, size and fps as DATA-cw01).
import React from "react";
import {Composition} from "remotion";
import type {BeatData} from "../../datayt/BeatStory";
import {BEATS} from "../../datayt/beatData";
import {getBrand, lookBrand} from "../brands";
import {LookFonts} from "../shared/LookFonts";
import {useLookData} from "../shared/useLookData";
import {CartoonStory} from "./CartoonStory";
import {LongCompositions} from "./long/LongCompositions";

const CartoonPreview: React.FC<{D: BeatData; brand?: string}> = ({D, brand}) => {
  const L = useLookData(D, {look: "counter", brand});
  const br = getBrand(L.brand), B = React.useMemo(() => lookBrand(br, "counter"), [br]);
  const faces = [br.faces.bricolage, br.faces.schibsted, br.faces.oswald];
  return <LookFonts faces={faces}><CartoonStory L={L} B={B}/></LookFonts>;
};

export const CartoonCompositions: React.FC = () => {
  const D = BEATS.find((d) => d.id === "cw01");
  if (!D) return <LongCompositions/>;
  return <><LongCompositions/><Composition {...({id: "DATA-cw01-look-cartoon", component: CartoonPreview, defaultProps: {D}, durationInFrames: Math.ceil(D.total * 30), fps: 30, width: 1080, height: 1920} as any)}/></>;
};
