// The beat grid: one source of truth for picture AND sound.
// scripts/make-score.mjs computes the same seconds from chronicle.json.
import data from "./chronicle.json";

export type Chapter = (typeof data.chapters)[number];
export type Scheduled = Chapter & {
  index: number;
  start: number; // frame
  frames: number;
  beat: number; // frames per beat (fractional)
};

export const chronicle = data;

export const buildSchedule = (fps: number) => {
  let sec = 0;
  const chapters: Scheduled[] = data.chapters.map((c, index) => {
    const beatSec = 60 / c.bpm;
    const startSec = sec;
    sec += beatSec * data.beatsPerChapter;
    return {
      ...c,
      index,
      start: Math.round(startSec * fps),
      frames: Math.round(sec * fps) - Math.round(startSec * fps),
      beat: beatSec * fps,
    };
  });
  return { chapters, totalFrames: Math.round((sec + data.outroSec) * fps) };
};

export const fmtYear = (y: number) => (y < 0 ? `${Math.round(-y)} BCE` : `${Math.round(y)} CE`);
