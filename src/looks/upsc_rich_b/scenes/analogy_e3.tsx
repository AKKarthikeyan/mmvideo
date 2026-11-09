// ECO-16 Part 1 analogy variants, builder E3: PLACEHOLDERS. The E3 builder replaces this file's entries with real art (see ../CONTRACT_B_ECO1.md).
// Same entry shape as analogy_p2b.tsx: {Art, Labels, bg} per `which`. Add helper files named analogy_e3_*.tsx; never touch another builder's files.
import React from "react";
import type {AP} from "./analogy_kit";
import {SANS} from "../kit";
import {PressMintArt, PressMintLabels, FiatNoteArt, FiatNoteLabels, PromiseNoteArt, PromiseNoteLabels, DepositMoneyArt, DepositMoneyLabels} from "./analogy_e3_money";
import {PlanPathArt, NoLabels as NoL, MMeasuresArt, MMeasuresLabels, BaseTowerArt, BaseTowerLabels, PaiseBarArt, PaiseBarLabels, Part2SeamArt, Part2SeamLabels} from "./analogy_e3_misc";
import {SplitBarArt, SplitBarLabels, M3BarArt, M3BarLabels} from "./analogy_e3_bars";

const Placeholder: React.FC<AP> = ({spec}) => (
  <text x={960} y={520} textAnchor="middle" fontFamily={SANS} fontSize={64} fill="#8a6f4a">PLACEHOLDER · {spec.which}</text>
);
const NoLabels: React.FC<AP> = () => null;

export const E3: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "split-bar": {Art: SplitBarArt, Labels: SplitBarLabels, bg: "#0c1431"},
  "plan-path": {Art: PlanPathArt, Labels: NoL, bg: "#EFE6D2"},
  "press-mint": {Art: PressMintArt, Labels: PressMintLabels, bg: "#EFE6D2"},
  "fiat-note": {Art: FiatNoteArt, Labels: FiatNoteLabels, bg: "#EFE6D2"},
  "promise-note": {Art: PromiseNoteArt, Labels: PromiseNoteLabels, bg: "#EFE6D2"},
  "deposit-money": {Art: DepositMoneyArt, Labels: DepositMoneyLabels, bg: "#EFE6D2"},
  "m-measures": {Art: MMeasuresArt, Labels: MMeasuresLabels, bg: "#EFE6D2"},
  "m3-bar": {Art: M3BarArt, Labels: M3BarLabels, bg: "#EFE6D2"},
  "base-tower": {Art: BaseTowerArt, Labels: BaseTowerLabels, bg: "#EFE6D2"},
  "paise-bar": {Art: PaiseBarArt, Labels: PaiseBarLabels, bg: "#EFE6D2"},
  "part2-seam": {Art: Part2SeamArt, Labels: Part2SeamLabels, bg: "#EFE6D2"},
};
