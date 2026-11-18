// eternalq2 compositions (22 Oct 2026). Own entry (EternalIndex.ts) so renders never depend on other sessions' files;
// also mounted in src/voxplus/Root.tsx (backup Root.tsx.bak1022_eternalq2).
import React from "react";
import {Composition, Still} from "remotion";
import {ETERNAL_TOTAL, EternalFilm} from "./EternalFilm";
import {EternalThumbA, EternalThumbB, EternalThumbC} from "./EternalThumb";
import {H, W, tk2f} from "./tokens";

export const EternalCompositions: React.FC = () => (
  <>
    <Composition id="ETERNALQ2-film" component={EternalFilm} durationInFrames={tk2f(ETERNAL_TOTAL, 60)} fps={60} width={W} height={H} defaultProps={{music: true}}/>
    <Composition id="ETERNALQ2-film30" component={EternalFilm} durationInFrames={tk2f(ETERNAL_TOTAL, 30)} fps={30} width={W} height={H} defaultProps={{music: true}}/>
    <Still id="ETERNALQ2-thumbA" component={EternalThumbA} width={W} height={H}/>
    <Still id="ETERNALQ2-thumbB" component={EternalThumbB} width={W} height={H}/>
    <Still id="ETERNALQ2-thumbC" component={EternalThumbC} width={W} height={H}/>
  </>
);
