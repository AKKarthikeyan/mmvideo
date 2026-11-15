// ECO-16 Part 1 analogy variants, builder E2 (demand-side diagrams, see ../CONTRACT_B_ECO1.md). Same entry shape as analogy_p2b.tsx: {Art, Labels, bg} per `which`.
// Art lives in analogy_e2_money.tsx (unit-shelf, shrinking-basket, asset-shelf, wallet-idle), analogy_e2_demand.tsx and analogy_e2_scale.tsx.
import React from "react";
import type {AP} from "./analogy_kit";
import {SlidersArt, SlidersLabels, ThreeJarsArt, ThreeJarsLabels, BondSeesawArt, BondSeesawLabels, RateCrowdArt, RateCrowdLabels, LiquidityTankArt, LiquidityTankLabels} from "./analogy_e2_demand";
import {FormulaCardArt, FormulaCardLabels, FisherScaleArt, FisherScaleLabels, CambridgeKArt, CambridgeKLabels} from "./analogy_e2_scale";
import {UnitShelfArt, UnitShelfLabels, BasketArt, BasketLabels, AssetShelfArt, AssetShelfLabels, WalletIdleArt, WalletIdleLabels} from "./analogy_e2_money";

export const E2: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "unit-shelf": {Art: UnitShelfArt, Labels: UnitShelfLabels, bg: "#EFE6D2"},
  "shrinking-basket": {Art: BasketArt, Labels: BasketLabels, bg: "#EFE6D2"},
  "asset-shelf": {Art: AssetShelfArt, Labels: AssetShelfLabels, bg: "#EFE6D2"},
  "wallet-idle": {Art: WalletIdleArt, Labels: WalletIdleLabels, bg: "#EFE6D2"},
  "sliders": {Art: SlidersArt, Labels: SlidersLabels, bg: "#EFE6D2"},
  "three-jars": {Art: ThreeJarsArt, Labels: ThreeJarsLabels, bg: "#EFE6D2"},
  "bond-seesaw": {Art: BondSeesawArt, Labels: BondSeesawLabels, bg: "#EFE6D2"},
  "rate-crowd": {Art: RateCrowdArt, Labels: RateCrowdLabels, bg: "#EFE6D2"},
  "liquidity-tank": {Art: LiquidityTankArt, Labels: LiquidityTankLabels, bg: "#EFE6D2"},
  "formula-card": {Art: FormulaCardArt, Labels: FormulaCardLabels, bg: "#EFE6D2"},
  "fisher-scale": {Art: FisherScaleArt, Labels: FisherScaleLabels, bg: "#EFE6D2"},
  "cambridge-k": {Art: CambridgeKArt, Labels: CambridgeKLabels, bg: "#EFE6D2"},
};
