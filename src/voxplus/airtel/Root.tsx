// Entry for "Airtel's Moat: Price, Mix or Convergence?" (separate from src/Root.tsx, exactly like the scale film: no shared file changes).
// Render: npx remotion render src/voxplus/airtel/index.ts AIRTEL out/voxplus/airtel/airtel-convergence-moat_DRAFT1_60fps.mp4
import React from "react";
import {Composition, Still} from "remotion";
import {Thumb} from "./Thumb";
import {H, W, tk2f} from "./kit/tokens";
import {AIRTEL_TOTAL, AirtelFilm} from "./Film";
export const AirtelRoot: React.FC = () => (
  <>
    <Composition id="AIRTEL" component={AirtelFilm} durationInFrames={tk2f(AIRTEL_TOTAL, 60)} fps={60} width={W} height={H} defaultProps={{music: true}}/>
    <Composition id="AIRTEL-30" component={AirtelFilm} durationInFrames={tk2f(AIRTEL_TOTAL, 30)} fps={30} width={W} height={H} defaultProps={{music: true}}/>
    <Still id="THUMB-AIRTEL" component={Thumb} width={W} height={H}/>
  </>
);
