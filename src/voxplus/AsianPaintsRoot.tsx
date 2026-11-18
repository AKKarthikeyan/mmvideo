// asianpaintsq2 compositions (30 Oct 2026). Own entry (AsianPaintsIndex.ts) so renders never depend on other sessions' files;
// not mounted in Root.tsx (the brief: do not change Root.tsx).
import React from "react";
import {Composition, Still} from "remotion";
import {AP_TOTAL, AsianPaintsFilm} from "./AsianPaintsFilm";
import {AsianPaintsThumbA, AsianPaintsThumbB, AsianPaintsThumbC} from "./AsianPaintsThumb";
import {H, W, tk2f} from "./tokens";

export const AsianPaintsCompositions: React.FC = () => (
  <>
    <Composition id="ASIANPAINTSQ2-film" component={AsianPaintsFilm} durationInFrames={tk2f(AP_TOTAL, 60)} fps={60} width={W} height={H} defaultProps={{music: true}}/>
    <Composition id="ASIANPAINTSQ2-film30" component={AsianPaintsFilm} durationInFrames={tk2f(AP_TOTAL, 30)} fps={30} width={W} height={H} defaultProps={{music: true}}/>
    <Still id="ASIANPAINTSQ2-thumbA" component={AsianPaintsThumbA} width={W} height={H}/>
    <Still id="ASIANPAINTSQ2-thumbB" component={AsianPaintsThumbB} width={W} height={H}/>
    <Still id="ASIANPAINTSQ2-thumbC" component={AsianPaintsThumbC} width={W} height={H}/>
  </>
);
