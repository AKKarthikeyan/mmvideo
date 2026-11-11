// POL-03 Parts 1-2 (Fundamental Rights) analogy variants, builder W1 (contract ../CONTRACT_B_POL03.md). Same entry shape as analogy_e1.tsx.
import React from "react";
import type {AP} from "./analogy_kit";
import {GhatArt, GhatLabels} from "./analogy_w1_ghat";
import {BalanceArt, BalanceLabels} from "./analogy_w1_scale";
import {SeriesPathArt, SeriesPathLabels, WantsRightsArt, WantsRightsLabels} from "./analogy_w1_path";
import {BillGlassArt, BillGlassLabels, StateBuildingsArt, StateBuildingsLabels, RulebookArt, RulebookLabels} from "./analogy_w1_law";

export const W1: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "ghat-steps": {Art: GhatArt, Labels: GhatLabels, bg: "#EFE6D2"},
  "balance": {Art: BalanceArt, Labels: BalanceLabels, bg: "#EFE6D2"},
  "series-path": {Art: SeriesPathArt, Labels: SeriesPathLabels, bg: "#EFE6D2"},
  "wants-rights": {Art: WantsRightsArt, Labels: WantsRightsLabels, bg: "#EFE6D2"},
  "bill-glass": {Art: BillGlassArt, Labels: BillGlassLabels, bg: "#EFE6D2"},
  "state-buildings": {Art: StateBuildingsArt, Labels: StateBuildingsLabels, bg: "#EFE6D2"},
  "rulebook": {Art: RulebookArt, Labels: RulebookLabels, bg: "#EFE6D2"},
};
