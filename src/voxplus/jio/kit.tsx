// Jio IPO review film (VoxPlus, 20 Oct 2026): timing helpers shared by the chapter files.
// Cue a shot or an animation by the spoken words: W("q31", "BSNL, nine") = film second when that phrase starts.
import {Shot, SP, Tr, tsec} from "../A01V4Parts";
import {BEAT, DUR, SAY, WORDS} from "./jioTiming";

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();
/** seconds into beat k where the phrase starts (or ends, with end=true); falls back to the character position. */
export const wt = (k: string, phrase: string, end = false): number => {
  const ws = WORDS[k] ?? [], toks = norm(phrase).split(" ").filter(Boolean);
  const wn = ws.map((w) => norm(w[0]));
  for (let i = 0; i + toks.length <= wn.length; i++) {
    let ok = true;
    for (let j = 0; j < toks.length && ok; j++) ok = wn[i + j] === toks[j] || (j === toks.length - 1 && wn[i + j].startsWith(toks[j]));
    if (ok) return end ? ws[i + toks.length - 1][2] : ws[i][1];
  }
  const s = (SAY[k] ?? "").toLowerCase(), p = phrase.toLowerCase().split("|")[0], c = s.indexOf(p);
  if (c < 0) throw new Error(`phrase not in ${k}: ${phrase}`);
  return (DUR[k] * (c + (end ? p.length : 0))) / Math.max(1, s.length);
};
/** film seconds: beat start + (seconds | phrase start). Add an offset with "phrase|+0.4" or "phrase|-0.3". */
export const W = (k: string, x: number | string = 0): number => {
  if (typeof x === "number") return BEAT[k] + x;
  const [p, o] = x.split("|");
  return BEAT[k] + wt(k, p) + (o ? parseFloat(o) : 0);
};
/** end of a phrase, film seconds */
export const WE = (k: string, phrase: string) => BEAT[k] + wt(k, phrase, true);
/** local ticks inside a shot that starts at s0 (ticks): a("q31", "BSNL") */
export const useAt = (s0: number) => (k: string, x: number | string = 0) => tsec(W(k, x)) - s0;
export type AtFn = ReturnType<typeof useAt>;
/** a shot cut at (beat, seconds | phrase) */
export const S = (k: string, x: number | string, tr: Tr, C: React.FC<SP>, id?: string): Shot => ({id: id ?? `${k}@${x}`, cut: W(k, x), tr, C});
// transitions
export const H0: Tr = {k: "hard"};
export const WL: Tr = {k: "whip", d: "left"}, WR: Tr = {k: "whip", d: "right"}, WU: Tr = {k: "whip", d: "up"}, WD: Tr = {k: "whip", d: "down"};
export const PU: Tr = {k: "paper", d: "up"}, PL: Tr = {k: "paper", d: "left"};
export const MZ: Tr = {k: "match"};
export const PUSH = (x: number, y: number): Tr => ({k: "push", x, y});
export {BEAT, DUR, SAY, WORDS};
