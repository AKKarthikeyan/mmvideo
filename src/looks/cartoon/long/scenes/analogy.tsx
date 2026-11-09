// Scene kind "analogy" (UPSC monsoon film). Spec: {which, time?, chip?, limit?, labels: [{text, key}]}.
// which: heat-rates | column | rooms | gradient | breeze (time: day | night) | roundabout | pot. See CONTRACT_UPSC.md.
// Labels are drawn only from at(key). Art lives in analogy_a.tsx (first four) and analogy_b.tsx (last three); parts in analogy_kit.tsx.
import React from "react";
import {C} from "../../palette";
import type {SceneProps} from "../contract";
import {A} from "./analogy_a";
import {B, BREEZE_BG} from "./analogy_b";
import {Frame, type AnalogyBase} from "./analogy_kit";

export type AnalogySpec = AnalogyBase & {camera?: unknown; notes?: string};
const ART: Record<string, React.FC<any>> = {...A, ...B};
const BG: Record<string, string> = {"heat-rates": C.sky2, column: C.sky, rooms: "#EAF1FA", gradient: C.sky2, breeze: "", roundabout: "#F6EFD9", pot: C.sky2};

export const Scene: React.FC<SceneProps<AnalogySpec>> = ({f, dur, spec, at}) => {
  const which = spec?.which ?? "";
  const Art = ART[which];
  if (!Art) throw new Error(`analogy: unknown which "${which}" (heat-rates, column, rooms, gradient, breeze, roundabout, pot)`);
  const night = which === "breeze" && spec.time === "night";
  const bg = which === "breeze" ? (night ? BREEZE_BG.night : BREEZE_BG.day) : BG[which];
  return <Frame f={f} dur={dur} bg={bg} chip={spec.chip || undefined} limit={spec.limit || undefined} dark={night}>
    <Art f={f} dur={dur} spec={spec} at={at}/>
  </Frame>;
};
