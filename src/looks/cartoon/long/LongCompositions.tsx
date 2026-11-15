// Compositions for the long-form cartoon work:
//   LONG-scene           one scene kind at a time, for builders: --props '{"kind":"map","spec":{...},"dur":150,"reveals":{"k":30}}'
//   LONG-babies-cartoon  the whole video, from public/datayt/long/babies/timeline.json (scripts/datayt/long_timeline.py)
//   LONG-namakkal-kurz  the same timeline in the Kurzgesagt-like look (src/looks/kurz)
//   LONG-namakkal-A / LONG-namakkal-C  the two Namakkal films (Kurz look, 1920x1080, 60 fps; scripts A Paradox and C Long Road)
//   KURZ-scene           one Kurz scene at 60 fps, for builders: --props '{"kind":"timeline","spec":{...},"dur":150,"reveals":{"k":30}}'
//   LONG-namakkal-cartoon  the Namakkal look comparison (cold open + price beat), public/datayt/long/namakkal/timeline.json
import React from "react";
import {Composition, staticFile} from "remotion";
import {getBrand} from "../../brands";
import {LookFonts} from "../../shared/LookFonts";
import {AbsoluteFill} from "remotion";
import {H, W, type Timeline} from "./contract";
import {LongCartoon} from "./LongCartoon";
import {KurzLong} from "../../kurz/KurzLong";
import {RichLong} from "../../upsc_rich_b/RichLong";
import {RichShort} from "../../upsc_rich_b/RichShort";
import timelineJson from "../../../../public/datayt/long/babies/timeline.json";
import nkTimelineJson from "../../../../public/datayt/long/namakkal/timeline.json";
import nkATimelineJson from "../../../../public/datayt/long/namakkal/A/timeline.json";
import nkCTimelineJson from "../../../../public/datayt/long/namakkal/C/timeline.json";
import upscG7TimelineJson from "../../../../public/datayt/long/upsc/geo07-p1/timeline.json";
import upscG7P2TimelineJson from "../../../../public/datayt/long/upsc/geo07-p2/timeline.json";
import upscE16P1TimelineJson from "../../../../public/datayt/long/upsc/eco16-p1/timeline.json";
import upscE16P2TimelineJson from "../../../../public/datayt/long/upsc/eco16-p2/timeline.json";
import upscE16P3TimelineJson from "../../../../public/datayt/long/upsc/eco16-p3/timeline.json";

const KurzTest: React.FC<{kind: string; spec: any; dur?: number; reveals?: Record<string, number>}> = ({kind, spec, dur = 150, reveals = {}}) => {
  const tl: Timeline = {id: "test", fps: 30, total: dur, timing: "estimated", scenes: [{id: "t", act: "t", kind, spec, vo: "", from: 0, dur, reveals: new Proxy(reveals, {has: () => true, get: (o, k) => (k in o ? (o as any)[k] : 20)}) as any}]};
  return <KurzLong timeline={tl} draft={false} fps={60} brand="indicaatlas"/>;
};
const TestScene: React.FC<{kind: string; spec: any; dur?: number; reveals?: Record<string, number>}> = ({kind, spec, dur = 150, reveals = {}}) => {
  const tl: Timeline = {id: "test", fps: 30, total: dur, timing: "estimated", scenes: [{id: "t", act: "t", kind, spec, vo: "", from: 0, dur, reveals: new Proxy(reveals, {has: () => true, get: (o, k) => (k in o ? (o as any)[k] : 20)}) as any}]};
  return <LongCartoon timeline={tl} draft={false}/>;
};
void staticFile; void getBrand; void LookFonts; void AbsoluteFill;

export const LongCompositions: React.FC = () => {
  const tl = timelineJson as unknown as Timeline, nk = nkTimelineJson as unknown as Timeline,
    nkA = nkATimelineJson as unknown as Timeline, nkC = nkCTimelineJson as unknown as Timeline;
  return <>
    <Composition {...({id: "LONG-scene", component: TestScene, defaultProps: {kind: "stage", spec: {}, dur: 150, reveals: {}}, durationInFrames: 150, fps: 30, width: W, height: H,
      calculateMetadata: ({props}: any) => ({durationInFrames: props.dur ?? 150})} as any)}/>
    <Composition {...({id: "LONG-babies-cartoon", component: LongCartoon, defaultProps: {timeline: tl, draft: true}, durationInFrames: Math.max(30, tl.total), fps: 30, width: W, height: H} as any)}/>
    <Composition {...({id: "LONG-geo07-p1", component: LongCartoon, defaultProps: {timeline: upscG7TimelineJson as unknown as Timeline, draft: true}, durationInFrames: Math.max(30, (upscG7TimelineJson as any).total), fps: 30, width: W, height: H} as any)}/>
    <Composition {...({id: "LONG-geo07-p1-60", component: LongCartoon, defaultProps: {timeline: upscG7TimelineJson as unknown as Timeline, draft: true, fps: 60}, durationInFrames: Math.max(60, (upscG7TimelineJson as any).total * 2), fps: 60, width: W, height: H} as any)}/>
    <Composition {...({id: "LONG-geo07-p1-B", component: RichLong, defaultProps: {timeline: upscG7TimelineJson as unknown as Timeline, draft: true}, durationInFrames: Math.max(30, (upscG7TimelineJson as any).total), fps: 30, width: W, height: H} as any)}/>
    <Composition {...({id: "LONG-geo07-p1-B60", component: RichLong, defaultProps: {timeline: upscG7TimelineJson as unknown as Timeline, draft: true, fps: 60}, durationInFrames: Math.max(60, (upscG7TimelineJson as any).total * 2), fps: 60, width: W, height: H} as any)}/>
    <Composition {...({id: "UPSC-SHORT", component: RichShort, defaultProps: {timeline: {id: "", fps: 30, total: 30, scenes: []}, words: [], kicker: "", title: "", end: "", dur: 60, fps: 60},
      durationInFrames: 120, fps: 60, width: 1080, height: 1920, calculateMetadata: ({props}: any) => ({durationInFrames: (props.dur ?? 60) * 2})} as any)}/>
    <Composition {...({id: "LONG-eco16-p3-B60", component: RichLong, defaultProps: {timeline: upscE16P3TimelineJson as unknown as Timeline, draft: true, fps: 60}, durationInFrames: Math.max(60, (upscE16P3TimelineJson as any).total * 2), fps: 60, width: W, height: H} as any)}/>
    <Composition {...({id: "LONG-eco16-p3-B", component: RichLong, defaultProps: {timeline: upscE16P3TimelineJson as unknown as Timeline, draft: true}, durationInFrames: Math.max(30, (upscE16P3TimelineJson as any).total), fps: 30, width: W, height: H} as any)}/>
    <Composition {...({id: "LONG-eco16-p2-B60", component: RichLong, defaultProps: {timeline: upscE16P2TimelineJson as unknown as Timeline, draft: true, fps: 60}, durationInFrames: Math.max(60, (upscE16P2TimelineJson as any).total * 2), fps: 60, width: W, height: H} as any)}/>
    <Composition {...({id: "LONG-eco16-p2-B", component: RichLong, defaultProps: {timeline: upscE16P2TimelineJson as unknown as Timeline, draft: true}, durationInFrames: Math.max(30, (upscE16P2TimelineJson as any).total), fps: 30, width: W, height: H} as any)}/>
    <Composition {...({id: "LONG-eco16-p1-B60", component: RichLong, defaultProps: {timeline: upscE16P1TimelineJson as unknown as Timeline, draft: true, fps: 60}, durationInFrames: Math.max(60, (upscE16P1TimelineJson as any).total * 2), fps: 60, width: W, height: H} as any)}/>
    <Composition {...({id: "LONG-eco16-p1-B", component: RichLong, defaultProps: {timeline: upscE16P1TimelineJson as unknown as Timeline, draft: true}, durationInFrames: Math.max(30, (upscE16P1TimelineJson as any).total), fps: 30, width: W, height: H} as any)}/>
    <Composition {...({id: "LONG-geo07-p2-B60", component: RichLong, defaultProps: {timeline: upscG7P2TimelineJson as unknown as Timeline, draft: true, fps: 60}, durationInFrames: Math.max(60, (upscG7P2TimelineJson as any).total * 2), fps: 60, width: W, height: H} as any)}/>
    <Composition {...({id: "LONG-geo07-p2-B", component: RichLong, defaultProps: {timeline: upscG7P2TimelineJson as unknown as Timeline, draft: true}, durationInFrames: Math.max(30, (upscG7P2TimelineJson as any).total ), fps: 30, width: W, height: H} as any)}/>
    <Composition {...({id: "LONG-namakkal-cartoon", component: LongCartoon, defaultProps: {timeline: nk, draft: true}, durationInFrames: Math.max(30, nk.total), fps: 30, width: W, height: H} as any)}/>
    <Composition {...({id: "LONG-namakkal-A", component: KurzLong, defaultProps: {timeline: nkA, draft: true, fps: 60, brand: "indicaatlas"}, durationInFrames: Math.max(60, nkA.total * 2), fps: 60, width: W, height: H} as any)}/>
    <Composition {...({id: "LONG-namakkal-C", component: KurzLong, defaultProps: {timeline: nkC, draft: true, fps: 60, brand: "indicaatlas"}, durationInFrames: Math.max(60, nkC.total * 2), fps: 60, width: W, height: H} as any)}/>
    <Composition {...({id: "KURZ-scene", component: KurzTest, defaultProps: {kind: "chapter", spec: {n: 1, title: "Test", icon: "egg"}, dur: 150, reveals: {}}, durationInFrames: 300, fps: 60, width: W, height: H,
      calculateMetadata: ({props}: any) => ({durationInFrames: (props.dur ?? 150) * 2})} as any)}/>
    <Composition {...({id: "LONG-namakkal-kurz", component: KurzLong, defaultProps: {timeline: nk, draft: true}, durationInFrames: Math.max(30, nk.total), fps: 30, width: W, height: H} as any)}/>
  </>;
};
