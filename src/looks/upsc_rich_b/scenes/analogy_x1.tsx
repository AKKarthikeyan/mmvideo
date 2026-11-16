// ECO-12 Part 1 (Who really pays a tax?), builder X1 (CONTRACT_B_ECO12.md). Entry shape as analogy_w5.tsx: {Art, Labels, bg} per `which`.
import React from "react";
import type {AP} from "./analogy_kit";
import {DoorsArt, DoorsLabels, JobsArt, JobsLabels, ShopArt, ShopLabels, TreasuryArt, TreasuryLabels} from "./analogy_x1_a";
import {FamilyArt, FamilyLabels, StairsArt, StairsLabels, SubsidyArt, SubsidyLabels, WedgeArt, WedgeLabels} from "./analogy_x1_b";
import {BagsArt, BagsLabels, CreditArt, CreditLabels, GlassArt, GlassLabels, PenArt, PenLabels, TrucksArt, TrucksLabels} from "./analogy_x1_c";

export const X1: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "shop-bill": {Art: ShopArt, Labels: ShopLabels, bg: "#efe0c2"}, "treasury-flow": {Art: TreasuryArt, Labels: TreasuryLabels, bg: "#d9e8e2"},
  "three-jobs": {Art: JobsArt, Labels: JobsLabels, bg: "#efe0c2"}, "tax-doors": {Art: DoorsArt, Labels: DoorsLabels, bg: "#efe0c2"},
  "tax-wedge": {Art: WedgeArt, Labels: WedgeLabels, bg: "#efe0c2"}, "staircases": {Art: StairsArt, Labels: StairsLabels, bg: "#d9e8e2"},
  "family-jars": {Art: FamilyArt, Labels: FamilyLabels, bg: "#efe0c2"}, "subsidy-tag": {Art: SubsidyArt, Labels: SubsidyLabels, bg: "#efe0c2"},
  "pen-chain": {Art: PenArt, Labels: PenLabels, bg: "#efe0c2"}, "credit-chain": {Art: CreditArt, Labels: CreditLabels, bg: "#d9e8e2"},
  "destination-trucks": {Art: TrucksArt, Labels: TrucksLabels, bg: "#d9e8e2"}, "outside-glass": {Art: GlassArt, Labels: GlassLabels, bg: "#efe0c2"},
  "bags-seesaw": {Art: BagsArt, Labels: BagsLabels, bg: "#efe0c2"},
};
