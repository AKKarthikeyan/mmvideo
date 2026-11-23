// ants1 compositions (Moat Atlas, 27 Oct 2026). Own entry (AntIndex.ts) so renders never depend on other films' files.
import React from "react";
import {Composition} from "remotion";
import {ANT_TOTAL, AntFilm} from "./AntFilm";
import {H, W, tk2f} from "./tokens";
import {SFPS, ShortA, ShortB, ShortC} from "./AntShorts";
import {SHORTS} from "./AntShortTiming";

export const AntCompositions: React.FC = () => (
  <>
    <Composition id="ANTS1-film" component={AntFilm} durationInFrames={tk2f(ANT_TOTAL, 60)} fps={60} width={W} height={H} defaultProps={{music: true}}/>
    <Composition id="ANTS1-shortA" component={ShortA} durationInFrames={Math.round(SHORTS.a.total * SFPS)} fps={SFPS} width={1080} height={1920}/>
    <Composition id="ANTS1-shortB" component={ShortB} durationInFrames={Math.round(SHORTS.b.total * SFPS)} fps={SFPS} width={1080} height={1920}/>
    <Composition id="ANTS1-shortC" component={ShortC} durationInFrames={Math.round(SHORTS.c.total * SFPS)} fps={SFPS} width={1080} height={1920}/>
    <Composition id="ANTS1-film30" component={AntFilm} durationInFrames={tk2f(ANT_TOTAL, 30)} fps={30} width={W} height={H} defaultProps={{music: true}}/>
  </>
);
