// POL-03 Part 2 (Fundamental Rights) analogy variants, builder W4: the widening and the safeguards (see ../CONTRACT_B_POL03.md).
// Same entry shape as analogy_e1.tsx: {Art, Labels, bg} per `which`. Helper files: analogy_w4_*.tsx only.
import React from "react";
import type {AP} from "./analogy_kit";
import {ThreeGatesArt, ThreeGatesLabels, Tree21Art, Tree21Labels} from "./analogy_w4_a";
import {PoliceDeskArt, PoliceDeskLabels, DetentionArt, DetentionLabels} from "./analogy_w4_b";
import {EmergencyDoorArt, EmergencyDoorLabels, StadiumWageArt, StadiumWageLabels, MineSchoolArt, MineSchoolLabels} from "./analogy_w4_c";

export const W4: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "three-gates": {Art: ThreeGatesArt, Labels: ThreeGatesLabels, bg: "#2a3458"},
  "tree-21": {Art: Tree21Art, Labels: Tree21Labels, bg: "#EFE6D2"},
  "police-desk": {Art: PoliceDeskArt, Labels: PoliceDeskLabels, bg: "#8a5a30"},
  "detention-calendar": {Art: DetentionArt, Labels: DetentionLabels, bg: "#d9c9a8"},
  "emergency-door": {Art: EmergencyDoorArt, Labels: EmergencyDoorLabels, bg: "#c9a58a"},
  "stadium-wage": {Art: StadiumWageArt, Labels: StadiumWageLabels, bg: "#f5d6a2"},
  "mine-school": {Art: MineSchoolArt, Labels: MineSchoolLabels, bg: "#e7d8b6"},
};
