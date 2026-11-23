// tatamotorsq2 (Tata Motors Q2 FY27, 24 Oct 2026): cue helpers (copy of EternalCue.tsx). Cut and animate on spoken words (whisper word times on the
// pause-fixed narration): W("c02", "eighty four") = film second when that phrase starts. Same API as scale/cue.tsx.
import React from "react";
import {Shot, SP, Tr, tsec} from "./A01V4Parts";
import {BEAT, DUR, SAY, WORDS} from "./TataMotorsTiming";

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();
/** seconds into beat k where the phrase starts (or ends, with end=true); falls back to the character position. */
export const wt = (k: string, phrase: string, end = false): number => {
  const ws = WORDS[k] ?? [], toks = norm(phrase).split(" ").filter(Boolean);
  const flat: {t: string; i: number}[] = [];
  ws.forEach((w, i) => norm(w[0]).split(" ").filter(Boolean).forEach((t) => flat.push({t, i})));
  for (let i = 0; i + toks.length <= flat.length; i++) {
    let ok = true;
    for (let j = 0; j < toks.length && ok; j++) ok = flat[i + j].t === toks[j] || (j === toks.length - 1 && flat[i + j].t.startsWith(toks[j]));
    if (ok) return end ? ws[flat[i + toks.length - 1].i][2] : ws[flat[i].i][1];
  }
  const s = (SAY[k] ?? "").toLowerCase(), p = phrase.toLowerCase(), c = s.indexOf(p);
  if (c < 0) throw new Error(`phrase not in ${k}: ${phrase}`);
  return (DUR[k] * (c + (end ? p.length : 0))) / Math.max(1, s.length);
};
/** film seconds: beat start + (seconds | phrase start); offset with "phrase|+0.4" or "phrase|-0.3". */
export const W = (k: string, x: number | string = 0): number => {
  if (typeof x === "number") return BEAT[k] + x;
  const [p, o] = x.split("|");
  return BEAT[k] + wt(k, p) + (o ? parseFloat(o) : 0);
};
export const WE = (k: string, phrase: string) => BEAT[k] + wt(k, phrase, true);
export const END = (k: string) => BEAT[k] + DUR[k];
/** local ticks inside a shot that starts at s0 (ticks) */
export const useAt = (s0: number) => (k: string, x: number | string = 0) => tsec(W(k, x)) - s0;
export const useEnd = (s0: number) => (k: string, phrase?: string) => tsec(phrase ? WE(k, phrase) : END(k)) - s0;
export const S = (k: string, x: number | string, tr: Tr, C: React.FC<SP>, id?: string): Shot => ({id: id ?? `${k}@${x}`, cut: W(k, x), tr, C});
export const H0: Tr = {k: "hard"};
export const WL: Tr = {k: "whip", d: "left"}, WR: Tr = {k: "whip", d: "right"}, WU: Tr = {k: "whip", d: "up"}, WD: Tr = {k: "whip", d: "down"};
export const PU: Tr = {k: "paper", d: "up"}, PL: Tr = {k: "paper", d: "left"};
export const MZ: Tr = {k: "match"};
export const PUSH = (x: number, y: number): Tr => ({k: "push", x, y});
export {BEAT, DUR, SAY, WORDS};
