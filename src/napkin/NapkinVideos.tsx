import React from "react";
import {Composition} from "remotion";
import {NapkinLong, napkinLayout, NW, NH} from "./NapkinLong";
import {FPS, VData} from "../vx/VoxEngine";
import jewel from "../../public/vx/jewel/data.json";

const ALL = [jewel] as unknown as VData[];
export const NapkinCompositions: React.FC = () => (
  <>{ALL.map((D) => <Composition key={D.id} id={`NAPKIN-${D.id}-long`} component={NapkinLong as any} defaultProps={{D}}
      durationInFrames={napkinLayout(D).total} fps={FPS} width={NW} height={NH}/>)}</>
);
