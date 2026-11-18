// swiggyq2 compositions (23 Oct 2026). Own entry (SwiggyIndex.ts) so renders never depend on other sessions' files;
// also mounted in src/voxplus/Root.tsx (backup Root.tsx.bak1023_swiggyq2).
import React from "react";
import {Composition, Still} from "remotion";
import {SWIGGY_TOTAL, SwiggyFilm} from "./SwiggyFilm";
import {SwiggyThumbA, SwiggyThumbB, SwiggyThumbC} from "./SwiggyThumb";
import {H, W, tk2f} from "./tokens";

export const SwiggyCompositions: React.FC = () => (
  <>
    <Composition id="SWIGGYQ2-film" component={SwiggyFilm} durationInFrames={tk2f(SWIGGY_TOTAL, 60)} fps={60} width={W} height={H} defaultProps={{music: true}}/>
    <Composition id="SWIGGYQ2-film30" component={SwiggyFilm} durationInFrames={tk2f(SWIGGY_TOTAL, 30)} fps={30} width={W} height={H} defaultProps={{music: true}}/>
    <Still id="SWIGGYQ2-thumbA" component={SwiggyThumbA} width={W} height={H}/>
    <Still id="SWIGGYQ2-thumbB" component={SwiggyThumbB} width={W} height={H}/>
    <Still id="SWIGGYQ2-thumbC" component={SwiggyThumbC} width={W} height={H}/>
  </>
);
