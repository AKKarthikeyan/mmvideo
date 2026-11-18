// 60 FPS entry for Vox long videos (20 Oct 2026). Separate from src/Root.tsx so no shared file changes.
// Render: npx remotion render src/v60/index.ts VX60-<id>-long out/vx/<file>.mp4
import React from "react";
import {Composition} from "remotion";
import {VData, VoxLong, longLayout} from "./vx/VoxEngine";
import a01moat from "../../public/vx/a01moat/data.json";
import jioipo from "../../public/vx/jioipo/data.json";
const FPS60 = 60;
const ALL = [a01moat, jioipo] as unknown as VData[];
export const Root60: React.FC = () => (
  <>
    {ALL.map((D) => (
      <Composition key={D.id} id={`VX60-${D.id}-long`} component={VoxLong as any} defaultProps={{D}}
        durationInFrames={longLayout(D).total * (FPS60 / 30)} fps={FPS60} width={1920} height={1080}/>
    ))}
  </>
);
