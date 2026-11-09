import React from "react";
import {Composition, registerRoot, useCurrentFrame} from "remotion";
import {S001} from "./s001";
import {S022} from "./s022";
import {S038} from "./s038";

// 60 fps renders of scenes that think in 30 fps logical frames: f = frame / 2
const mk = (S: React.FC<{f: number}>): React.FC => () => { const frame = useCurrentFrame(); return <S f={frame / 2}/>; };
const Root: React.FC = () => (
  <>
    <Composition id="RICH-B-s001" component={mk(S001)} durationInFrames={480} fps={60} width={1920} height={1080}/>
    <Composition id="RICH-B-s022" component={mk(S022)} durationInFrames={480} fps={60} width={1920} height={1080}/>
    <Composition id="RICH-B-s038" component={mk(S038)} durationInFrames={480} fps={60} width={1920} height={1080}/>
  </>
);
registerRoot(Root);
