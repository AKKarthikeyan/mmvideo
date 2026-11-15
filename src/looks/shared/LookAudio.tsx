// The same sound as BeatStory: the story's music bed (music.wav) ducked to 0.14 under the narration and back to 0.45
// within 0.2 s of it, 0.5 in the text-led cut, and each narration line as its own Sequence at its builder time.
// Optional cues (a look's SFX) play on top, ducked to `duckTo` of their volume while the narrator speaks.
import React from "react";
import {Audio, Sequence, staticFile} from "remotion";
import type {LookData} from "./types";

const FPS = 30;
const F = (s: number) => Math.round(s * FPS);

export const musicVol = (L: Pick<LookData, "D">, fr: number) => {
  const vo = L.D.vo ?? [];
  if (!vo.length) return 0.5;      // text-led cut, music alone: leave headroom
  const t = fr / FPS;
  const near = Math.min(...vo.map((v) => t < v.at ? v.at - t : t > v.at + v.sec ? t - v.at - v.sec : 0));
  return 0.14 + 0.31 * Math.min(1, near / 0.2);
};
const speaking = (L: Pick<LookData, "D">, fr: number) => (L.D.vo ?? []).some((v) => fr / FPS >= v.at && fr / FPS <= v.at + v.sec);

export type Cue = {f: number; src: string; volume?: number; frames?: number};

export const LookAudio: React.FC<{L: LookData; cues?: Cue[]; duckTo?: number}> = ({L, cues = [], duckTo = 0.4}) => <>
  <Audio src={staticFile(`datayt/beats/${L.id}/music.wav`)} volume={(fr) => musicVol(L, fr)}/>
  {(L.D.vo ?? []).map((v) => <Sequence key={v.file} from={F(v.at)}><Audio src={staticFile(`datayt/beats/${L.id}/${v.file}`)}/></Sequence>)}
  {cues.map((c, i) => <Sequence key={`cue${i}`} from={c.f} durationInFrames={c.frames ?? 45}>
    <Audio src={staticFile(c.src)} volume={(fr) => (c.volume ?? 0.5) * (speaking(L, c.f + fr) ? duckTo : 1)}/>
  </Sequence>)}
</>;
