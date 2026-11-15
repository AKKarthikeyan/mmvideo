// Thumbnails for "If Heat Brings the Monsoon, Why Does the Rain Wait?" in look B. Compositions: THUMB-1, THUMB-2 (1280 x 720).
// Render with scripts/upsc/thumbs_render.sh style commands (see the report), small copies at 320 px.
import React from "react";
import {Composition, registerRoot} from "remotion";
import {T1Layer, Thumb1} from "./thumb1";
import {Thumb2} from "./thumb2";

const Root: React.FC = () => (
  <>
    <Composition id="T1-LAYER-L" component={() => <T1Layer side="L"/>} durationInFrames={1} fps={30} width={1920} height={1080}/>
    <Composition id="T1-LAYER-R" component={() => <T1Layer side="R"/>} durationInFrames={1} fps={30} width={1920} height={1080}/>
    <Composition id="THUMB-2" component={Thumb2} durationInFrames={1} fps={30} width={1280} height={720}/>
    <Composition id="THUMB-1" component={Thumb1} durationInFrames={1} fps={30} width={1280} height={720}/>
  </>
);
registerRoot(Root);
