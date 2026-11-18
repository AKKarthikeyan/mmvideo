// Jio moat Shorts (9:16): cue helpers. Times are seconds from the start of the Short; the voice starts at START.
import React from "react";
import {Shot, SP, Tr, tsec} from "../kit/A01V4Parts";
import {SHORTS, START, WORDS} from "./shortsTiming";

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();
/** seconds into the voice where the phrase starts (or ends) */
export const wt = (k: string, phrase: string, end = false): number => {
  const ws = WORDS[k] ?? [], toks = norm(phrase).split(" ").filter(Boolean);
  const flat: {t: string; i: number}[] = [];
  ws.forEach((w, i) => norm(w[0]).split(" ").forEach((t) => flat.push({t, i})));
  for (let i = 0; i + toks.length <= flat.length; i++) {
    let ok = true;
    for (let j = 0; j < toks.length && ok; j++) ok = flat[i + j].t === toks[j] || (j === toks.length - 1 && flat[i + j].t.startsWith(toks[j]));
    if (ok) return end ? ws[flat[i + toks.length - 1].i][2] : ws[flat[i].i][1];
  }
  const s = SHORTS[k].say.toLowerCase(), c = s.indexOf(phrase.toLowerCase());
  if (c < 0) throw new Error(`phrase not in ${k}: ${phrase}`);
  return (SHORTS[k].dur * c) / s.length;
};
/** seconds from the start of the Short: number, or phrase ("phrase|-0.2" offsets) */
export const W = (k: string, x: number | string = 0): number => {
  if (typeof x === "number") return START + x;
  const [p, o] = x.split("|");
  return START + wt(k, p) + (o ? parseFloat(o) : 0);
};
/** local ticks inside a shot that starts at s0 (ticks) */
export const useAt = (k: string, s0: number) => (x: number | string = 0) => tsec(W(k, x)) - s0;
export const S = (k: string, x: number | string, tr: Tr, C: React.FC<SP>, id?: string): Shot => ({id: id ?? `${k}@${x}`, cut: x === 0 ? 0 : W(k, x), tr, C});
export const H0: Tr = {k: "hard"};
export const WL: Tr = {k: "whip", d: "left"}, WR: Tr = {k: "whip", d: "right"}, WU: Tr = {k: "whip", d: "up"}, WD: Tr = {k: "whip", d: "down"};
export const PU: Tr = {k: "paper", d: "up"}, PL: Tr = {k: "paper", d: "left"};
export const MZ: Tr = {k: "match"};
