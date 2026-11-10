import React from "react";
import { Composition, Folder } from "remotion";
import { FPS, W, H } from "./brand/tokens";
import { IndicaEmpireMap, empireDefaults } from "./scenes/IndicaEmpireMap";
import { IndicaMonumentSketch, monumentDefaults } from "./scenes/IndicaMonumentSketch";
import { IndicaChronicle, chronicleDefaults, chronicleDuration } from "./scenes/chronicle/IndicaChronicle";

const base = { fps: FPS, width: W, height: H } as const;

// Indica Atlas history formats. The 9:16 and 1:1 versions are format previews of the long chronicle;
// a publishable Short must be its own Reveal Loop script (docs/SHORTS_FORMAT.md, docs/SHORTS_RULES.md).
export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Chronicle">
      <Composition id="IndicaChronicle" component={IndicaChronicle} defaultProps={chronicleDefaults} durationInFrames={chronicleDuration(FPS)} {...base} />
      <Composition id="IndicaChronicleVertical" component={IndicaChronicle} defaultProps={chronicleDefaults} durationInFrames={chronicleDuration(FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="IndicaChronicleSquare" component={IndicaChronicle} defaultProps={chronicleDefaults} durationInFrames={chronicleDuration(FPS)} fps={FPS} width={1080} height={1080} />
    </Folder>
    <Folder name="Maps-and-monuments">
      <Composition id="IndicaEmpireMap" component={IndicaEmpireMap} defaultProps={empireDefaults} durationInFrames={300} {...base} />
      <Composition id="IndicaMonumentSketch" component={IndicaMonumentSketch} defaultProps={monumentDefaults} durationInFrames={270} {...base} />
    </Folder>
  </>
);
