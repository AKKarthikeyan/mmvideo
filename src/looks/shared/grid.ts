// The music grid every look cuts on. build_beats.py lays each story beat on whole bars of the 124 BPM bed
// (1 bar = 4 beats = 1.935 s = 58.06 frames at 30 fps) and data.json's t0/t1 are the truth: a look never moves them.
import type {LookBeat, LookData} from "./types";

export const FPS = 30;
export const BPM = 124;
export const BEAT_S = 60 / BPM;            // 0.4839 s
export const BAR_S = 4 * BEAT_S;           // 1.9355 s
export const BEAT_F = BEAT_S * FPS;        // 14.516 frames
export const BAR_F = BAR_S * FPS;          // 58.065 frames

// Frame of the k-th bar downbeat of a story beat (k = 0 is its first frame).
export const downbeat = (b: Pick<LookBeat, "t0">, k: number, L?: Pick<LookData, "barF">) => Math.round(b.t0 * FPS + k * (L?.barF ?? BAR_F));
// Frame of the n-th subdivision of a story beat: div 1 = beats, 2 = eighths, 4 = sixteenths.
export const gridF = (b: Pick<LookBeat, "t0">, n: number, div = 1, L?: Pick<LookData, "beatF">) => Math.round(b.t0 * FPS + n * (L?.beatF ?? BEAT_F) / div);
// Number of whole bars in a story beat (2 or 3 for most beats).
export const barsIn = (b: Pick<LookBeat, "t0" | "t1">, L?: Pick<LookData, "barF">) => Math.round((b.t1 - b.t0) * FPS / (L?.barF ?? BAR_F));
// Every bar downbeat inside a story beat, the beat's own first frame included.
export const downbeats = (b: Pick<LookBeat, "t0" | "t1">, L?: Pick<LookData, "barF">) => Array.from({length: barsIn(b, L)}, (_, k) => downbeat(b, k, L));
// The first grid point at or after frame f (div as in gridF). Use it to snap a cue forward, never backward: a number may
// land late on the grid, never before its word.
export const snapAfter = (b: Pick<LookBeat, "t0">, f: number, div = 2, L?: Pick<LookData, "beatF">) => {
  const step = (L?.beatF ?? BEAT_F) / div, t0 = b.t0 * FPS;
  return Math.round(t0 + Math.ceil((f - t0 - 1e-6) / step) * step);
};
// Index of the bar (0-based, whole Short) a frame falls in, and whether the frame is a bar downbeat of the Short.
export const barOf = (f: number, L?: Pick<LookData, "barF">) => Math.floor(f / (L?.barF ?? BAR_F) + 1e-6);
export const isDownbeat = (f: number, L?: Pick<LookData, "barF">) => Math.round(Math.round(f / (L?.barF ?? BAR_F)) * (L?.barF ?? BAR_F)) === f;
