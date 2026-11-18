// tatamotorsq2 compositions (24 Oct 2026). Own entry (TataMotorsIndex.ts) so renders never depend on other sessions' files;
// also mounted in src/voxplus/Root.tsx (backup Root.tsx.bak1024_tatamotorsq2).
import React from "react";
import {Composition, Still} from "remotion";
import {TATAMOTORS_TOTAL, TataMotorsFilm} from "./TataMotorsFilm";
import {TataMotorsThumbA, TataMotorsThumbB, TataMotorsThumbC} from "./TataMotorsThumb";
import {H, W, tk2f} from "./tokens";

export const TataMotorsCompositions: React.FC = () => (
  <>
    <Composition id="TATAMOTORSQ2-film" component={TataMotorsFilm} durationInFrames={tk2f(TATAMOTORS_TOTAL, 60)} fps={60} width={W} height={H} defaultProps={{music: true}}/>
    <Composition id="TATAMOTORSQ2-film30" component={TataMotorsFilm} durationInFrames={tk2f(TATAMOTORS_TOTAL, 30)} fps={30} width={W} height={H} defaultProps={{music: true}}/>
    <Still id="TATAMOTORSQ2-thumbA" component={TataMotorsThumbA} width={W} height={H}/>
    <Still id="TATAMOTORSQ2-thumbB" component={TataMotorsThumbB} width={W} height={H}/>
    <Still id="TATAMOTORSQ2-thumbC" component={TataMotorsThumbC} width={W} height={H}/>
  </>
);
