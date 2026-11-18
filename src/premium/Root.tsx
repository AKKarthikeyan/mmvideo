// Premium style test compositions (18 Oct 2026): the same two moments in three treatments, 16 s each, 1920x1080 at 30 fps.
// Mounted from src/Root.tsx with one line; nothing here touches the existing scenes.
import React from "react";
import {Composition} from "remotion";
import {FPS, H, TOTAL, W} from "./common";
import {PremiumA} from "./A";
import {PremiumB} from "./B";
import {PremiumC} from "./C";
import {A01v3Cold, COLD_TOTAL} from "./a01v3/Cold";

export const PremiumCompositions: React.FC = () => (
  <>
    <Composition id="PREM-A" component={PremiumA} durationInFrames={TOTAL} fps={FPS} width={W} height={H}/>
    <Composition id="PREM-B" component={PremiumB} durationInFrames={TOTAL} fps={FPS} width={W} height={H}/>
    <Composition id="PREM-C" component={PremiumC} durationInFrames={TOTAL} fps={FPS} width={W} height={H}/>
    <Composition id="A01V3-cold" component={A01v3Cold} durationInFrames={COLD_TOTAL} fps={FPS} width={W} height={H}/>
  </>
);
