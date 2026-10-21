// Registry for the spiritual channel's videos (21 Oct 2026). Same Vox engine, same data shape; the data is built by
// scripts/dharma/build_dharma.py into public/vx/<id>/ (the engine reads audio and clips from there).
import React from "react";
import {Composition} from "remotion";
import {FPS, VData, VoxLong, VoxShort, longLayout, shortLayout} from "../vx/VoxEngine";
import gita02 from "../../public/vx/dhgita02/data.json";

const ALL = [gita02] as unknown as VData[];

export const DharmaCompositions: React.FC = () => (
  <>
    {ALL.map((D) => (
      <React.Fragment key={D.id}>
        <Composition id={`DH-${D.id}-long`} component={VoxLong as any} defaultProps={{D}} durationInFrames={longLayout(D).total} fps={FPS} width={1920} height={1080}/>
        {D.shorts.map((_, i) => (
          <Composition key={i} id={`DH-${D.id}-short${i + 1}`} component={VoxShort as any} defaultProps={{D, idx: i}} durationInFrames={shortLayout(D, i).total} fps={FPS} width={1080} height={1920}/>
        ))}
      </React.Fragment>
    ))}
  </>
);
