// Five Jio moat Shorts (9:16, 60 fps). Separate entry: npx remotion render src/voxplus/scale/shorts/index.ts SHORT-sh1 out/...
// Each Short is wrapped in its own component: shot lists hold React components, which must not go through (serialised) props.
import React from "react";
import {Composition} from "remotion";
import {tk2f} from "../kit/tokens";
import {ShortFilm, VH, VW, shortTotal} from "./frame";
import {CUES_SH1, SHOTS_SH1} from "./sh1";
import {CUES_SH2, SHOTS_SH2} from "./sh2";
import {CUES_SH3, SHOTS_SH3} from "./sh3";
import {CUES_SH4, SHOTS_SH4} from "./sh4";
import {CUES_SH5, SHOTS_SH5} from "./sh5";
const Sh1: React.FC<{music?: boolean}> = ({music = true}) => <ShortFilm k="sh1" n={1} shots={SHOTS_SH1} cues={CUES_SH1} music={music}/>;
const Sh2: React.FC<{music?: boolean}> = ({music = true}) => <ShortFilm k="sh2" n={2} shots={SHOTS_SH2} cues={CUES_SH2} music={music}/>;
const Sh3: React.FC<{music?: boolean}> = ({music = true}) => <ShortFilm k="sh3" n={3} shots={SHOTS_SH3} cues={CUES_SH3} music={music}/>;
const Sh4: React.FC<{music?: boolean}> = ({music = true}) => <ShortFilm k="sh4" n={4} shots={SHOTS_SH4} cues={CUES_SH4} music={music}/>;
const Sh5: React.FC<{music?: boolean}> = ({music = true}) => <ShortFilm k="sh5" n={5} shots={SHOTS_SH5} cues={CUES_SH5} music={music}/>;
export const ShortsRoot: React.FC = () => (
  <>
    <Composition id="SHORT-sh1" component={Sh1} durationInFrames={tk2f(shortTotal("sh1"), 60)} fps={60} width={VW} height={VH} defaultProps={{music: true}}/>
    <Composition id="SHORT-sh2" component={Sh2} durationInFrames={tk2f(shortTotal("sh2"), 60)} fps={60} width={VW} height={VH} defaultProps={{music: true}}/>
    <Composition id="SHORT-sh3" component={Sh3} durationInFrames={tk2f(shortTotal("sh3"), 60)} fps={60} width={VW} height={VH} defaultProps={{music: true}}/>
    <Composition id="SHORT-sh4" component={Sh4} durationInFrames={tk2f(shortTotal("sh4"), 60)} fps={60} width={VW} height={VH} defaultProps={{music: true}}/>
    <Composition id="SHORT-sh5" component={Sh5} durationInFrames={tk2f(shortTotal("sh5"), 60)} fps={60} width={VW} height={VH} defaultProps={{music: true}}/>
  </>
);
