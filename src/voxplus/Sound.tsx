// Sound: a music-bed slot that ducks under the voice (the a01v3 approach that passed the gate: bed about -30 LUFS under
// voice, +6 dB in gaps of 1.5 s or more) and an SFX cue helper with named CC0 sounds (licences in LICENSES.md).
import React from "react";
import {Audio, Sequence, useVideoConfig} from "remotion";
import {V, clamp01} from "./tokens";

/** Named CC0 effects in public/voxplus/audio/ with a default gain (peaks were loudness-normalised in prep). */
export const SFX = {
  paper: {file: "audio/sfx_paper_slide_kingofgamers.wav", vol: 0.55},        // paper slide / page lands
  highlighter: {file: "audio/sfx_underline_stroke_zembacraftworks.wav", vol: 0.6}, // marker/highlighter squeak-stroke
  circle: {file: "audio/sfx_marker_circle_elliottklein.wav", vol: 0.6},      // marker circle
  stamp: {file: "audio/sfx_thump_stamp_mpuffenbarger.wav", vol: 0.8},        // stamp / slam
  click: {file: "audio/sfx_shutter_click_cabledmess.wav", vol: 0.45},        // photo click / slide projector
  whoosh: {file: "audio/sfx_whoosh_cartoony_branrainey.wav", vol: 0.32},     // whip pan
  whooshDeep: {file: "audio/sfx_whoosh_deep_kinoton.wav", vol: 0.4},         // push-through
  pop: {file: "audio/sfx_pop_conarb13.wav", vol: 0.3},                       // pin / label pop
  ding: {file: "audio/sfx_coin_ding_greenvwbeetle.wav", vol: 0.3},           // number lands
} as const;
export type SfxName = keyof typeof SFX;
export type Cue = [number, SfxName, number?];   // [frame, sound, gain multiplier]

// cue frames are composition frames (real fps); each effect gets a 5 s window at any frame rate
export const SfxTrack: React.FC<{cues: Cue[]}> = ({cues}) => {
  const {fps} = useVideoConfig();
  return (
  <>
    {cues.map(([at, name, g = 1], i) => (
      <Sequence key={i} from={Math.max(0, Math.round(at))} durationInFrames={Math.round(5 * fps)} layout="none">
        <Audio src={V(SFX[name].file)} volume={SFX[name].vol * g}/>
      </Sequence>
    ))}
  </>
  );
};

/**
 * Music bed with ducking. voice = [[startFrame, endFrame], ...] spans where narration plays.
 * Under voice the bed sits at `duck` (about -30 LUFS for our beds); in gaps of 1.5 s or more it opens to `open`.
 * fadeIn / fadeOut in frames; startFrom trims the source (frames).
 */
export const MusicBed: React.FC<{src: string; total: number; voice?: [number, number][]; duck?: number; open?: number;
  fadeIn?: number; fadeOut?: number; startFrom?: number}> =
  ({src, total, voice = [], duck = 0.2, open = 0.4, fadeIn = 18, fadeOut = 30, startFrom = 0}) => {
    const {fps} = useVideoConfig(), k = fps / 30;   // ramp constants below are 30-fps frames; scale with fps
    const near = (f: number) => {
      let d = 1e9;
      for (const [a, b] of voice) { if (f >= a && f <= b) return 0; d = Math.min(d, Math.abs(f - a), Math.abs(f - b)); }
      return d;
    };
    const vol = (f: number) => {
      const gap = voice.length ? near(f) : 1e9;
      const o = clamp01((gap - 8 * k) / (18 * k));           // needs ~15 frames of gap before it starts to open
      const v = duck + (open - duck) * o;
      return v * clamp01(f / fadeIn) * (1 - clamp01((f - (total - fadeOut)) / fadeOut));
    };
    return <Audio src={V(src)} volume={vol} startFrom={startFrom}/>;
  };
