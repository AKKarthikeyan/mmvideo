// Entry for "Jio's Size Advantage Has a Catch" (separate from src/Root.tsx: no shared file changes).
// Render: npx remotion render src/voxplus/scale/index.ts SCALE-film out/voxplus/jio-size-advantage-catch-60fps.mp4
import React from "react";
import {Composition, Still} from "remotion";
import {ThumbA, ThumbB, ThumbC} from "./Thumb";
import {H, W, tk2f} from "./kit/tokens";
import {SCALE_TOTAL, ScaleFilm} from "./Film";
export const ScaleRoot: React.FC = () => (
  <>
    <Composition id="SCALE-film" component={ScaleFilm} durationInFrames={tk2f(SCALE_TOTAL, 60)} fps={60} width={W} height={H} defaultProps={{music: true}}/>
    <Composition id="SCALE-film30" component={ScaleFilm} durationInFrames={tk2f(SCALE_TOTAL, 30)} fps={30} width={W} height={H} defaultProps={{music: true}}/>
    <Still id="SCALE-thumbA" component={ThumbA} width={W} height={H}/>
    <Still id="SCALE-thumbB" component={ThumbB} width={W} height={H}/>
    <Still id="SCALE-thumbC" component={ThumbC} width={W} height={H}/>
  </>
);
