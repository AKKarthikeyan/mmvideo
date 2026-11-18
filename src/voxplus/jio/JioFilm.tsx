// Jio IPO Review: Biggest Telco, But Best Protected? (VoxPlus film, 20 Oct 2026). Same "reporter's desk, filmed" kit as A01 v4.
// Narration: the approved jioipo beats, voiced by MiniMax (public/vx/jioipo/<key>.mp3). Shots live in ch0..ch8.tsx and are
// cut on spoken words (kit.tsx W()). Numbers on screen come only from the ledger (scripts/ledger/jioipo.csv).
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from "remotion";
import {layoutShots, Series, Shot, tsec} from "../A01V4Parts";
import {cueFrames, SCue} from "../A01V4Cold";
import {MusicBed, SfxTrack} from "../Sound";
import {useVoxFonts} from "../fonts";
import {C, tk2f} from "../tokens";
import {BEAT, DUR, FILM_TOTAL_S, ORDER} from "./jioTiming";
import {W} from "./kit";
import {CUES0, SHOTS0} from "./ch0";
import {CUES1, SHOTS1} from "./ch1";
import {CUES2, SHOTS2} from "./ch2";
import {CUES3, SHOTS3} from "./ch3";
import {CUES4, SHOTS4} from "./ch4";
import {CUES5, SHOTS5} from "./ch5";
import {CUES6, SHOTS6} from "./ch6";
import {CUES7, SHOTS7} from "./ch7";
import {CUES8, SHOTS8} from "./ch8";

export const JIO_TOTAL = tsec(FILM_TOTAL_S);
export const JIO_SHOTS: Shot[] = [...SHOTS0, ...SHOTS1, ...SHOTS2, ...SHOTS3, ...SHOTS4, ...SHOTS5, ...SHOTS6, ...SHOTS7, ...SHOTS8].sort((a, b) => a.cut - b.cut);
const CUES: SCue[] = [...CUES0, ...CUES1, ...CUES2, ...CUES3, ...CUES4, ...CUES5, ...CUES6, ...CUES7, ...CUES8];

const Voice: React.FC = () => {
  const {fps} = useVideoConfig();
  return <>{ORDER.map((k) => (
    <Sequence key={k} from={tk2f(tsec(BEAT[k]), fps)} durationInFrames={tk2f(tsec(DUR[k] + 0.3), fps)} layout="none">
      <Audio src={staticFile("vx/jioipo/" + k + ".mp3")}/>
    </Sequence>))}</>;
};

// two CC0 beds (the A01 v4 pair), changed at chapter turns, ducked under the voice
const Beds: React.FC = () => {
  const {fps} = useVideoConfig();
  const fs = (s: number) => tk2f(tsec(s), fps);
  const beds = [
    {src: "audio/music_06_curious_ambience_reg1n0ld.wav", from: 0, to: W("q30", -0.6), offset: 20, gain: 1},
    {src: "audio/music_07_strings_with_percussion_buythefield.wav", from: W("q30", -1.6), to: W("q60", -0.6), offset: 0, gain: 0.7},
    {src: "audio/music_06_curious_ambience_reg1n0ld.wav", from: W("q60", -1.6), to: W("q80", -0.6), offset: 0, gain: 1},
    {src: "audio/music_07_strings_with_percussion_buythefield.wav", from: W("q80", -1.6), to: FILM_TOTAL_S, offset: 90, gain: 0.7},
  ];
  const vo = ORDER.map((k) => [BEAT[k], BEAT[k] + DUR[k]]);
  return <>{beds.map((b, i) => {
    const a = fs(b.from), z = fs(b.to);
    return (
      <Sequence key={i} from={a} durationInFrames={z - a} layout="none">
        <MusicBed src={b.src} total={z - a} voice={vo.map(([s, e]) => [fs(s) - a, fs(e) - a] as [number, number])} duck={0.2 * b.gain} open={0.4 * b.gain}
          startFrom={fs(b.offset)} fadeIn={fs(1.0)} fadeOut={fs(1.0)}/>
      </Sequence>);
  })}</>;
};

export const JioFilm: React.FC<{music?: boolean}> = ({music = true}) => {
  useVoxFonts();
  const {fps} = useVideoConfig();
  const {start, dur} = layoutShots(JIO_SHOTS, JIO_TOTAL);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Series shots={JIO_SHOTS} start={start} dur={dur}/>
      <Voice/>
      {music ? <Beds/> : null}
      <SfxTrack cues={cueFrames(CUES, fps)}/>
    </AbsoluteFill>
  );
};
