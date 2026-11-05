// Preview compositions for the Atlas look (Johnny Harris-style, AK 1 Nov 2026): DATA-<id>-atlas (narrated) and
// DATA-<id>-atlas-text (no narration), registered from src/datayt/DataVideos.tsx. Only state stories (fact, versus) listed here.
import React from "react";
import {Composition} from "remotion";
import {BEATS} from "../../datayt/beatData";
import {AtlasStory} from "./AtlasStory";

export const ATLAS_IDS = ["fa90", "vs90"];

export const AtlasCompositions: React.FC = () => <>
  {ATLAS_IDS.flatMap((id) => {
    const D = BEATS.find((d) => d.id === id);
    if (!D) return [];
    const dur = Math.ceil(D.total * 30);
    return [
      <Composition key={`${id}-atlas`} {...({id: `DATA-${id}-atlas`, component: AtlasStory, defaultProps: {D}, durationInFrames: dur, fps: 30, width: 1080, height: 1920} as any)}/>,
      <Composition key={`${id}-atlas-text`} {...({id: `DATA-${id}-atlas-text`, component: AtlasStory, defaultProps: {D: {...D, vo: []}}, durationInFrames: dur, fps: 30, width: 1080, height: 1920} as any)}/>,
    ];
  })}
</>;
