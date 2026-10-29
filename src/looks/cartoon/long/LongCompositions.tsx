// Compositions for the long-form cartoon work:
//   LONG-scene           one scene kind at a time, for builders: --props '{"kind":"map","spec":{...},"dur":150,"reveals":{"k":30}}'
//   LONG-babies-cartoon  the whole video, from public/datayt/long/babies/timeline.json (scripts/datayt/long_timeline.py)
import React from "react";
import {Composition, staticFile} from "remotion";
import {getBrand} from "../../brands";
import {LookFonts} from "../../shared/LookFonts";
import {AbsoluteFill} from "remotion";
import {H, W, type Timeline} from "./contract";
import {LongCartoon} from "./LongCartoon";
import timelineJson from "../../../../public/datayt/long/babies/timeline.json";

const TestScene: React.FC<{kind: string; spec: any; dur?: number; reveals?: Record<string, number>}> = ({kind, spec, dur = 150, reveals = {}}) => {
  const tl: Timeline = {id: "test", fps: 30, total: dur, timing: "estimated", scenes: [{id: "t", act: "t", kind, spec, vo: "", from: 0, dur, reveals: new Proxy(reveals, {has: () => true, get: (o, k) => (k in o ? (o as any)[k] : 20)}) as any}]};
  return <LongCartoon timeline={tl} draft={false}/>;
};
void staticFile; void getBrand; void LookFonts; void AbsoluteFill;

export const LongCompositions: React.FC = () => {
  const tl = timelineJson as unknown as Timeline;
  return <>
    <Composition {...({id: "LONG-scene", component: TestScene, defaultProps: {kind: "stage", spec: {}, dur: 150, reveals: {}}, durationInFrames: 150, fps: 30, width: W, height: H,
      calculateMetadata: ({props}: any) => ({durationInFrames: props.dur ?? 150})} as any)}/>
    <Composition {...({id: "LONG-babies-cartoon", component: LongCartoon, defaultProps: {timeline: tl, draft: true}, durationInFrames: Math.max(30, tl.total), fps: 30, width: W, height: H} as any)}/>
  </>;
};
