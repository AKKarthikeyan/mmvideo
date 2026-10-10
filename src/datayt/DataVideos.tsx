// Data YT Videos: standalone data-story videos (maps, rankings, survey data), kept separate from the
// Moat & Margin filings / Letters series. One entry per video: long (16:9) + Short (9:16), ids prefixed DATA-.
import React from "react";
import {Composition} from "remotion";
import {TnAlcohol, TN_ALCOHOL_FRAMES, TN_ALCOHOL_FPS} from "./TnAlcohol";
import {IndiaShort} from "./IndiaShort";
import {SHORTS} from "./shortsData";
import {IndiaMapped} from "./IndiaMapped";
import {MAPPED} from "./mappedData";
import {DataStory} from "./DataStory";
import {STORIES} from "./storyData";
import {StoryPostStills} from "./StoryPosts";
import {BrandStills} from "./Brand";
import {PosterStills} from "./Poster";

export const DataVideoCompositions: React.FC = () => <>
  <BrandStills/>
  <PosterStills/>
  <StoryPostStills/>
  <Composition id="DATA-tn-alcohol" component={TnAlcohol} durationInFrames={TN_ALCOHOL_FRAMES} fps={TN_ALCOHOL_FPS} width={1920} height={1080}/>
  <Composition id="DATA-tn-alcohol-short" component={TnAlcohol} durationInFrames={TN_ALCOHOL_FRAMES} fps={TN_ALCOHOL_FPS} width={1080} height={1920}/>
  {SHORTS.map((d) => <Composition key={d.id} {...({id: `DATA-${d.id}`, component: IndiaShort, defaultProps: {D: d},
    durationInFrames: Math.ceil(d.total * 30), fps: 30, width: 1080, height: 1920} as any)}/>)}
  {MAPPED.map((d) => <Composition key={d.id} {...({id: `DATA-${d.id}`, component: IndiaMapped, defaultProps: {D: d},
    durationInFrames: Math.ceil(d.total * 30), fps: 30, width: 1080, height: 1920} as any)}/>)}
  {STORIES.map((d) => <Composition key={d.id} {...({id: `DATA-${d.id}`, component: DataStory, defaultProps: {D: d},
    durationInFrames: Math.ceil(d.total * 30), fps: 30, width: 1080, height: 1920} as any)}/>)}
</>;
