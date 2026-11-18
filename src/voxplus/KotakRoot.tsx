// kotakq2 compositions (24 Oct 2026). Own entry (KotakIndex.ts) so renders never depend on other sessions' files;
// also mounted in src/voxplus/Root.tsx (backup Root.tsx.bak1024_kotakq2).
import React from "react";
import {Composition, Still} from "remotion";
import {KOTAK_TOTAL, KotakFilm} from "./KotakFilm";
import {KotakThumbA, KotakThumbB, KotakThumbC} from "./KotakThumb";
import {H, W, tk2f} from "./tokens";

export const KotakCompositions: React.FC = () => (
  <>
    <Composition id="KOTAKQ2-film" component={KotakFilm} durationInFrames={tk2f(KOTAK_TOTAL, 60)} fps={60} width={W} height={H} defaultProps={{music: true}}/>
    <Composition id="KOTAKQ2-film30" component={KotakFilm} durationInFrames={tk2f(KOTAK_TOTAL, 30)} fps={30} width={W} height={H} defaultProps={{music: true}}/>
    <Still id="KOTAKQ2-thumbA" component={KotakThumbA} width={W} height={H}/>
    <Still id="KOTAKQ2-thumbB" component={KotakThumbB} width={W} height={H}/>
    <Still id="KOTAKQ2-thumbC" component={KotakThumbC} width={W} height={H}/>
  </>
);
