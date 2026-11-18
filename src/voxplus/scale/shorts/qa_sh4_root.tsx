// QA entry for Short 4 only (the shared Root.tsx passes shots as defaultProps, which the renderer JSON-serialises and loses the components).
import React from "react";
import {Composition, registerRoot} from "remotion";
import {tk2f} from "../kit/tokens";
import {ShortFilm, VH, VW, shortTotal} from "./frame";
import {CUES_SH4, SHOTS_SH4} from "./sh4";
const Sh4: React.FC = () => <ShortFilm k="sh4" n={4} shots={SHOTS_SH4} cues={CUES_SH4} music={false}/>;
registerRoot(() => <Composition id="SHORT-sh4" component={Sh4} durationInFrames={tk2f(shortTotal("sh4"), 60)} fps={60} width={VW} height={VH}/>);
