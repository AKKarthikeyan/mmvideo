// GEO-04 Part 1 (Volcanoes) analogy variants, builder V2: the volcano types. Same entry shape as analogy_e1.tsx: {Art, Labels, bg} per `which`.
// Art lives in analogy_v2_*.tsx (shield, comp, five/cards, misc); see ../CONTRACT_B_GEO04.md.
import React from "react";
import type {AP} from "./analogy_kit";
import {ShieldArt, ShieldLabels} from "./analogy_v2_shield";
import {CompositeArt, CompositeLabels} from "./analogy_v2_comp";
import {FiveArt, FiveLabels} from "./analogy_v2_five";
import {CinderArt, CinderLabels, FerryArt, FerryLabels} from "./analogy_v2_misc";

export const V2: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "shield": {Art: ShieldArt, Labels: ShieldLabels, bg: "#EFE6D2"},
  "composite": {Art: CompositeArt, Labels: CompositeLabels, bg: "#EFE6D2"},
  "five-types": {Art: FiveArt, Labels: FiveLabels, bg: "#EFE6D2"},
  "cinder-cone": {Art: CinderArt, Labels: CinderLabels, bg: "#EFE6D2"},
  "ferry-island": {Art: FerryArt, Labels: FerryLabels, bg: "#EFE6D2"},
};
