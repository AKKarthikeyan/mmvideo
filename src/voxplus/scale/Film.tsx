// Jio's Size Advantage Has a Catch (Moat & Margin, AK revised script 20 Oct 2026). Themed VoxPlus kit (src/voxplus/scale/kit):
// one sans, off-white/charcoal/teal/rust. Narration: public/voxplus/scale/vo/<beat>.mp3 (MiniMax English_Diligent_Man).
// Shots live in sc01..sc12.tsx and are cut on spoken words (cue.tsx). Figures only from scripts/ledger/jioscale.csv.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from "remotion";
import {layoutShots, Series, Shot, tsec} from "./kit/A01V4Parts";
import {cueFrames, SCue} from "./kit/A01V4Cold";
import {MusicBed, SfxTrack} from "./kit/Sound";
import {useVoxFonts} from "./kit/fonts";
import {C, tk2f} from "./kit/tokens";
import {BEAT, DUR, FILM_TOTAL_S, ORDER, SCENE_START} from "./scaleTiming";
import {CUES01, SHOTS01} from "./sc01";
import {CUES02, SHOTS02} from "./sc02";
import {CUES03, SHOTS03} from "./sc03";
import {CUES04, SHOTS04} from "./sc04";
import {CUES05, SHOTS05} from "./sc05";
import {CUES06, SHOTS06} from "./sc06";
import {CUES07, SHOTS07} from "./sc07";
import {CUES08, SHOTS08} from "./sc08";
import {CUES09, SHOTS09} from "./sc09";
import {CUES10, SHOTS10} from "./sc10";
import {CUES11, SHOTS11} from "./sc11";
import {CUES12, SHOTS12} from "./sc12";

export const SCALE_TOTAL = tsec(FILM_TOTAL_S);
export const SCALE_SHOTS: Shot[] = [...SHOTS01, ...SHOTS02, ...SHOTS03, ...SHOTS04, ...SHOTS05, ...SHOTS06, ...SHOTS07, ...SHOTS08, ...SHOTS09, ...SHOTS10, ...SHOTS11, ...SHOTS12].sort((a, b) => a.cut - b.cut);
const CUES: SCue[] = [...CUES01, ...CUES02, ...CUES03, ...CUES04, ...CUES05, ...CUES06, ...CUES07, ...CUES08, ...CUES09, ...CUES10, ...CUES11, ...CUES12];

const Voice: React.FC = () => {
  const {fps} = useVideoConfig();
  return <>{ORDER.map((k) => (
    <Sequence key={k} from={tk2f(tsec(BEAT[k]), fps)} durationInFrames={tk2f(tsec(DUR[k] + 0.3), fps)} layout="none">
      <Audio src={staticFile("voxplus/scale/vo/" + k + ".mp3")}/>
    </Sequence>))}</>;
};

// restrained bed (brief): the A01 v4 CC0 ambience under the whole film, ducked under the voice; quieter from the debt
// definition (scene 11) and resolving on the return to the phone (scene 12)
const Beds: React.FC = () => {
  const {fps} = useVideoConfig();
  const fs = (s: number) => tk2f(tsec(s), fps);
  const beds = [
    {src: "audio/music_06_curious_ambience_reg1n0ld.wav", from: 0, to: SCENE_START[11] - 0.4, offset: 20, gain: 0.85},
    {src: "audio/music_06_curious_ambience_reg1n0ld.wav", from: SCENE_START[11] - 1.4, to: SCENE_START[12] - 0.4, offset: 140, gain: 0.5},
    {src: "audio/music_07_strings_with_percussion_buythefield.wav", from: SCENE_START[12] - 1.4, to: FILM_TOTAL_S, offset: 60, gain: 0.7},
  ];
  const vo = ORDER.map((k) => [BEAT[k], BEAT[k] + DUR[k]]);
  return <>{beds.map((b, i) => {
    const a = fs(b.from), z = fs(b.to);
    return (
      <Sequence key={i} from={a} durationInFrames={z - a} layout="none">
        <MusicBed src={b.src} total={z - a} voice={vo.map(([s, e]) => [fs(s) - a, fs(e) - a] as [number, number])} duck={0.18 * b.gain} open={0.34 * b.gain}
          startFrom={fs(b.offset)} fadeIn={fs(1.0)} fadeOut={fs(1.2)}/>
      </Sequence>);
  })}</>;
};

export const ScaleFilm: React.FC<{music?: boolean}> = ({music = true}) => {
  useVoxFonts();
  const {fps} = useVideoConfig();
  const {start, dur} = layoutShots(SCALE_SHOTS, SCALE_TOTAL);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Series shots={SCALE_SHOTS} start={start} dur={dur}/>
      <Voice/>
      {music ? <Beds/> : null}
      <SfxTrack cues={cueFrames(CUES, fps)}/>
    </AbsoluteFill>
  );
};
