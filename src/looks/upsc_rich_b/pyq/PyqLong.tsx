// Player for the Mains answer videos: RichLong (look B) with the pyq_* scene kinds added to the look's scene registry.
// Same timeline contract and 60 fps handling as RichLong.tsx; this file only merges the registries, so no shared file is edited.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {SAFE, type SceneProps, type Timeline, type TimelineScene} from "../../cartoon/long/contract";
import {Fonts, SANS} from "../kit";
import {RICH_SCENES} from "../registry";
import {PYQ_SCENES} from "./scenes";

const SCENES: Record<string, React.FC<SceneProps>> = {...RICH_SCENES, ...PYQ_SCENES};
const strict = (id: string, reveals: Record<string, number>) => (key: string) => {
  if (!(key in reveals)) throw new Error(`scene ${id}: no reveal frame for key "${key}"`);
  return reveals[key];
};
const Host: React.FC<{s: TimelineScene; draft: boolean; k: number}> = ({s, draft, k}) => {
  const f = useCurrentFrame() / k, Comp = SCENES[s.kind];
  if (!Comp) throw new Error(`pyq: no scene for kind "${s.kind}" in scene ${s.id}`);
  return <Comp f={f} dur={s.dur} spec={s.spec} at={strict(s.id, s.reveals)} draft={draft}/>;
};
export const PyqLong: React.FC<{timeline: Timeline; draft?: boolean; audio?: string[]; fps?: number}> = ({timeline, draft = true, audio = [], fps = 30}) => {
  const k = fps / 30, f = useCurrentFrame() / k;
  const cur = timeline.scenes.find((s) => f >= s.from && f < s.from + s.dur) ?? timeline.scenes[timeline.scenes.length - 1];
  return <Fonts>
    <AbsoluteFill style={{background: "#5a361f", overflow: "hidden"}}>
      {timeline.scenes.map((s) => <Sequence key={s.id} from={Math.round(s.from * k)} durationInFrames={Math.round(s.dur * k)}><Host s={s} draft={draft} k={k}/></Sequence>)}
      {draft && cur && <div style={{position: "absolute", left: SAFE.x0, width: SAFE.x1 - SAFE.x0, top: 936, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 32, lineHeight: 1.25,
        color: "#FFFBF2", textShadow: "0 2px 10px rgba(30,20,10,0.9)", padding: "0 60px"}}>{cur.vo}</div>}
      {audio.map((a) => <Audio key={a} src={staticFile(a)}/>)}
    </AbsoluteFill>
  </Fonts>;
};
