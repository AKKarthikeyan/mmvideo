// Jio VoxPlus film entry (separate from src/Root.tsx: no shared file changes).
// Render: npx remotion render src/voxplus/jio/index.ts JIO-film out/vx/jio-ipo-review-voxplus-60fps.mp4
import React from "react";
import {Composition} from "remotion";
import {H, W, tk2f} from "../tokens";
import {JIO_TOTAL, JioFilm} from "./JioFilm";
export const JioRoot: React.FC = () => (
  <>
    <Composition id="JIO-film" component={JioFilm} durationInFrames={tk2f(JIO_TOTAL, 60)} fps={60} width={W} height={H} defaultProps={{music: true}}/>
    <Composition id="JIO-film30" component={JioFilm} durationInFrames={tk2f(JIO_TOTAL, 30)} fps={30} width={W} height={H} defaultProps={{music: true}}/>
  </>
);
