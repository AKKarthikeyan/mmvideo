// The lock rule in code: a printed number may be drawn only from its lockF (the frame its word starts, or the fallback
// in word_times.py). Before that a look shows glyph-free shapes (blank tiles, streak reels, an empty card), never digits,
// and never a value that is not in the data (no count-up tweens).
import type {LookNum} from "./types";

export const shown = (n: LookNum | null | undefined, f: number) => !n || f >= n.lockF;

// Call where a look draws a number's digits; a frame before the lock throws, so a wrong layout fails the render (and
// scripts/datayt/look_stills.py, which renders lockF + 8 and the settle frame of every beat) instead of shipping.
export const assertLocked = (n: LookNum, f: number, where = "") => {
  if (f < n.lockF) throw new Error(`number "${n.text}"${where ? ` (${where})` : ""} drawn at frame ${f}, before its lock frame ${n.lockF} (${n.lockHow})`);
};

// Frames since the lock (negative before it): for slams, flips and settles that start on the word.
export const sinceLock = (n: LookNum, f: number) => f - n.lockF;
