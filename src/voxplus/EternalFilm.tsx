// eternalq2: "Why Does 90 Paise Matter to Blinkit?" (Moat & Margin, 22 Oct 2026). Vox Motion+ kit (src/voxplus), 60 fps master.
// Story and facts: contentengine/drafts/2026-10-21/_video/script.md (reviewed). Narration: public/voxplus/eternalq2/vo/<beat>_t.wav
// (MiniMax speech-2.6-hd, English_Diligent_Man, pause-fixed by scripts/voxplus/eternalq2_audio.py). Shots cut on spoken words.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from "remotion";
import {cueFrames, SCue} from "./A01V4Cold";
import {layoutShots, Series, Shot, tsec} from "./A01V4Parts";
import {MusicBed, SfxTrack} from "./Sound";
import {useVoxFonts} from "./fonts";
import {C, tk2f} from "./tokens";
import {BEAT, DUR, FILM_TOTAL_S, ORDER} from "./EternalTiming";
import {CUES1, SHOTS1} from "./EternalS1";
import {CUES2, SHOTS2} from "./EternalS2";
import {CUES3, SHOTS3} from "./EternalS3";
import {CUES4, SHOTS4} from "./EternalS4";

export const ETERNAL_TOTAL = tsec(FILM_TOTAL_S);
export const ETERNAL_SHOTS: Shot[] = [...SHOTS1, ...SHOTS2, ...SHOTS3, ...SHOTS4].sort((a, b) => a.cut - b.cut);
const CUES: SCue[] = [...CUES1, ...CUES2, ...CUES3, ...CUES4];

const Voice: React.FC = () => {
  const {fps} = useVideoConfig();
  return <>{ORDER.map((k) => (
    <Sequence key={k} from={tk2f(tsec(BEAT[k]), fps)} durationInFrames={tk2f(tsec(DUR[k] + 0.3), fps)} layout="none">
      <Audio src={staticFile("voxplus/eternalq2/vo/" + k + "_t.wav")}/>
    </Sequence>))}</>;
};
// the A01 v4 CC0 beds: ambience under the evidence, strings from the "But..." to the end card; ducked under the voice
const Beds: React.FC = () => {
  const {fps} = useVideoConfig();
  const fs = (s: number) => tk2f(tsec(s), fps);
  const but = BEAT["b01"];
  const beds = [
    {src: "audio/music_06_curious_ambience_reg1n0ld.wav", from: 0, to: but - 0.3, offset: 20, gain: 0.85},
    {src: "audio/music_07_strings_with_percussion_buythefield.wav", from: but - 1.2, to: FILM_TOTAL_S, offset: 40, gain: 0.7},
  ];
  const vo = ORDER.map((k) => [BEAT[k], BEAT[k] + DUR[k]]);
  return <>{beds.map((b, i) => {
    const a = fs(b.from), z = fs(b.to);
    return (
      <Sequence key={i} from={a} durationInFrames={z - a} layout="none">
        <MusicBed src={b.src} total={z - a} voice={vo.map(([s, e]) => [fs(s) - a, fs(e) - a] as [number, number])} duck={0.18 * b.gain} open={0.34 * b.gain}
          startFrom={fs(b.offset)} fadeIn={fs(1.0)} fadeOut={fs(1.5)}/>
      </Sequence>);
  })}</>;
};
export const EternalFilm: React.FC<{music?: boolean}> = ({music = true}) => {
  useVoxFonts();
  const {fps} = useVideoConfig();
  const {start, dur} = layoutShots(ETERNAL_SHOTS, ETERNAL_TOTAL);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Series shots={ETERNAL_SHOTS} start={start} dur={dur}/>
      <Voice/>
      {music ? <Beds/> : null}
      <SfxTrack cues={cueFrames(CUES, fps)}/>
    </AbsoluteFill>
  );
};
