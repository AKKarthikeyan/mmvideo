// marutiq2 compositions (28 Oct 2026). Own entry (MarutiIndex.ts) so renders never depend on other sessions' files;
// not mounted in Root.tsx (the brief: do not change Root.tsx).
import React from "react";
import {Composition, Still} from "remotion";
import {MARUTI_TOTAL, MarutiFilm} from "./MarutiFilm";
import {MarutiThumbA, MarutiThumbB, MarutiThumbC} from "./MarutiThumb";
import {H, W, tk2f} from "./tokens";

export const MarutiCompositions: React.FC = () => (
  <>
    <Composition id="MARUTIQ2-film" component={MarutiFilm} durationInFrames={tk2f(MARUTI_TOTAL, 60)} fps={60} width={W} height={H} defaultProps={{music: true}}/>
    <Composition id="MARUTIQ2-film30" component={MarutiFilm} durationInFrames={tk2f(MARUTI_TOTAL, 30)} fps={30} width={W} height={H} defaultProps={{music: true}}/>
    <Still id="MARUTIQ2-thumbA" component={MarutiThumbA} width={W} height={H}/>
    <Still id="MARUTIQ2-thumbB" component={MarutiThumbB} width={W} height={H}/>
    <Still id="MARUTIQ2-thumbC" component={MarutiThumbC} width={W} height={H}/>
  </>
);
