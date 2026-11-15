// ECO-16 Part 2 analogy variants, builder F1: people and story scenes (deposit hook, Lala the goldsmith, queue and calm, the Part 3 street).
// Same entry shape as analogy_e1.tsx: {Art, Labels, bg} per `which`. Helper files: analogy_f1_*.tsx.
import type React from "react";
import type {AP} from "./analogy_kit";
import {HookArt, HookLabels} from "./analogy_f1_hook";
import {GoldArt, GoldLabels} from "./analogy_f1_gold";
import {QueueArt, QueueLabels} from "./analogy_f1_queue";
import {StreetArt, StreetLabels} from "./analogy_f1_street";

export const F1: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "deposit-hook": {Art: HookArt, Labels: HookLabels, bg: "#EFE6D2"},
  "goldsmith": {Art: GoldArt, Labels: GoldLabels, bg: "#EFE6D2"},
  "queue-calm": {Art: QueueArt, Labels: QueueLabels, bg: "#E9DEC3"},
  "part3-street": {Art: StreetArt, Labels: StreetLabels, bg: "#EFE6D2"},
};
