import React from "react";
import {Composition, Still} from "remotion";
import {MapShort, MapWide, MapThumb, MapEp, DK_FPS, DK_MAP_TOTAL} from "./MapOfTheDay";
import tfrNfhs5 from "../../public/datakadai/maps/tfr-nfhs5/episode.json";

// Map of the Day episodes: add each new episode.json here after build_map.py passes.
const MAPS = [tfrNfhs5] as unknown as MapEp[];

export const DataKadaiCompositions: React.FC = () => (
  <>{MAPS.map((D) => (
    <React.Fragment key={D.id}>
      <Composition id={`DK-MAP-${D.id}-short`} component={MapShort as any} defaultProps={{D}} durationInFrames={DK_MAP_TOTAL} fps={DK_FPS} width={1080} height={1920}/>
      <Composition id={`DK-MAP-${D.id}-wide`} component={MapWide as any} defaultProps={{D}} durationInFrames={DK_MAP_TOTAL} fps={DK_FPS} width={1920} height={1080}/>
      <Still id={`DK-MAP-${D.id}-thumb`} component={MapThumb as any} defaultProps={{D}} width={1280} height={720}/>
    </React.Fragment>
  ))}</>
);
