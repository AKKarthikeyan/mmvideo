// Thumbnails for "What Does a 'Normal' Monsoon Really Mean?" (Monsoon, Part 2) in look B.
// Compositions: P2-THUMB-1, P2-THUMB-2 (1280 x 720) and the layer stills P2-LAYER-K, P2-LAYER-T, P2-LAYER-MAP (1920 x 1080 -> public/thumbs_tmp/p2_*.png).
import React from "react";
import {Composition, registerRoot} from "remotion";
import {P2Card, Thumb1} from "./p2_thumb1";
import {P2MapLayer, Thumb2} from "./p2_thumb2";

const Root: React.FC = () => (
  <>
    <Composition id="P2-LAYER-K" component={() => <P2Card which="konkan"/>} durationInFrames={1} fps={30} width={1920} height={1080}/>
    <Composition id="P2-LAYER-T" component={() => <P2Card which="thar"/>} durationInFrames={1} fps={30} width={1920} height={1080}/>
    <Composition id="P2-LAYER-MAP" component={P2MapLayer} durationInFrames={1} fps={30} width={1920} height={1080}/>
    <Composition id="P2-THUMB-1" component={Thumb1} durationInFrames={1} fps={30} width={1280} height={720}/>
    <Composition id="P2-THUMB-2" component={Thumb2} durationInFrames={1} fps={30} width={1280} height={720}/>
  </>
);
registerRoot(Root);
