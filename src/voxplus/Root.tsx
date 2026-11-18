// Vox Motion+ compositions (18 Oct 2026). Mounted from src/Root.tsx with one import and one tag.
import React from "react";
import {Composition} from "remotion";
import {CATALOG_TOTAL, Catalog} from "./Catalog";
import {DEMO_TOTAL, DemoReel} from "./DemoReel";
import {A01V4Cold, A01V4_COLD_TOTAL} from "./A01V4Cold";
import {A01V4Film, FILM_TOTAL} from "./A01V4Film";
import {A01V4Thumb} from "./A01V4Thumb";
import {FPS, H, W, tk2f} from "./tokens";
import {EternalCompositions} from "./EternalRoot";   // eternalq2, 22 Oct 2026
import {SwiggyCompositions} from "./SwiggyRoot";   // swiggyq2, 23 Oct 2026
import {TataMotorsCompositions} from "./TataMotorsRoot";   // tatamotorsq2, 24 Oct 2026

export const VoxPlusCompositions: React.FC = () => (
  <>
    <Composition id="VOXPLUS-demo" component={DemoReel} durationInFrames={DEMO_TOTAL} fps={FPS} width={W} height={H} defaultProps={{music: true}}/>
    <Composition id="A01V4-cold" component={A01V4Cold} durationInFrames={tk2f(A01V4_COLD_TOTAL, 60)} fps={60} width={W} height={H} defaultProps={{music: true}}/>
    <Composition id="A01V4-cold30" component={A01V4Cold} durationInFrames={tk2f(A01V4_COLD_TOTAL, 30)} fps={30} width={W} height={H} defaultProps={{music: true}}/>
    <Composition id="A01V4-full" component={A01V4Film} durationInFrames={tk2f(FILM_TOTAL, 60)} fps={60} width={W} height={H} defaultProps={{music: true}}/>
    <Composition id="A01V4-full30" component={A01V4Film} durationInFrames={tk2f(FILM_TOTAL, 30)} fps={30} width={W} height={H} defaultProps={{music: true}}/>
    <Composition id="A01V4-thumb" component={A01V4Thumb} durationInFrames={1} fps={30} width={W} height={H} defaultProps={{v: 1}}/>
    <EternalCompositions/>
    <SwiggyCompositions/>
    <TataMotorsCompositions/>
    <Composition id="VOXPLUS-catalog" component={Catalog} durationInFrames={CATALOG_TOTAL} fps={FPS} width={W} height={H}/>
  </>
);
