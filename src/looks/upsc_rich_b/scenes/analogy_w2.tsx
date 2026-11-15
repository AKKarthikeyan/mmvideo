// POL-03 Part 1 analogy variants, builder W2 (equality and reservation). Same entry shape as analogy_e1.tsx: {Art, Labels, bg} per `which`.
// Art lives in analogy_w2_*.tsx (kit, a, b, c).
import React from "react";
import type {AP} from "./analogy_kit";
import {FrameCraneArt, FrameCraneLabels, TwoCirclesArt, TwoCirclesLabels, JudgeScaleArt, JudgeScaleLabels} from "./analogy_w2_a";
import {ThreeCardsArt, ThreeCardsLabels, RunnersArt, RunnersLabels} from "./analogy_w2_b";
import {MandalDeskArt, MandalDeskLabels, VacancyBarArt, VacancyBarLabels, ScTreeArt, ScTreeLabels} from "./analogy_w2_c";

export const W2: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "frame-crane": {Art: FrameCraneArt, Labels: FrameCraneLabels, bg: "#EFE6D2"},
  "two-circles": {Art: TwoCirclesArt, Labels: TwoCirclesLabels, bg: "#EFE6D2"},
  "judge-scale": {Art: JudgeScaleArt, Labels: JudgeScaleLabels, bg: "#EFE6D2"},
  "three-cards": {Art: ThreeCardsArt, Labels: ThreeCardsLabels, bg: "#EFE6D2"},
  "runners": {Art: RunnersArt, Labels: RunnersLabels, bg: "#EFE6D2"},
  "mandal-desk": {Art: MandalDeskArt, Labels: MandalDeskLabels, bg: "#EFE6D2"},
  "vacancy-bar": {Art: VacancyBarArt, Labels: VacancyBarLabels, bg: "#EFE6D2"},
  "sc-tree": {Art: ScTreeArt, Labels: ScTreeLabels, bg: "#EFE6D2"},
};
