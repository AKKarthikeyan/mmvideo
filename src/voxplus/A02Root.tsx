// a02gates compositions (30 Oct 2026). Own entry (A02Index.ts) so renders never depend on other sessions' files;
// not mounted in Root.tsx (the brief: do not change Root.tsx).
import React from "react";
import {Composition, Still} from "remotion";
import {A02_TOTAL, A02Film} from "./A02Film";
import {A02ThumbA, A02ThumbB, A02ThumbC} from "./A02Thumb";
import {H, W, tk2f} from "./tokens";

export const A02Compositions: React.FC = () => (
  <>
    <Composition id="A02GATES-film" component={A02Film} durationInFrames={tk2f(A02_TOTAL, 60)} fps={60} width={W} height={H} defaultProps={{music: true}}/>
    <Composition id="A02GATES-film30" component={A02Film} durationInFrames={tk2f(A02_TOTAL, 30)} fps={30} width={W} height={H} defaultProps={{music: true}}/>
    <Still id="A02GATES-thumbA" component={A02ThumbA} width={W} height={H}/>
    <Still id="A02GATES-thumbB" component={A02ThumbB} width={W} height={H}/>
    <Still id="A02GATES-thumbC" component={A02ThumbC} width={W} height={H}/>
  </>
);
