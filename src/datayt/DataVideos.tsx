// Data YT Videos: standalone data-story videos (maps, rankings, survey data), kept separate from the
// Moat & Margin filings / Letters series. One entry per video: long (16:9) + Short (9:16), ids prefixed DATA-.
import React from "react";
import {Composition} from "remotion";
import {TnAlcohol, TN_ALCOHOL_FRAMES, TN_ALCOHOL_FPS} from "./TnAlcohol";

export const DataVideoCompositions: React.FC = () => <>
  <Composition id="DATA-tn-alcohol" component={TnAlcohol} durationInFrames={TN_ALCOHOL_FRAMES} fps={TN_ALCOHOL_FPS} width={1920} height={1080}/>
  <Composition id="DATA-tn-alcohol-short" component={TnAlcohol} durationInFrames={TN_ALCOHOL_FRAMES} fps={TN_ALCOHOL_FPS} width={1080} height={1920}/>
</>;
