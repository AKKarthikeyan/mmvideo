// ECO-16 Part 2 analogy variants, builder F3: PLACEHOLDERS. The F3 builder replaces this file's entries with real art (see ../CONTRACT_B_ECO2.md).
// Same entry shape as analogy_e1.tsx: {Art, Labels, bg} per `which`. Add helper files named analogy_f3_*.tsx; never touch another builder's files.
import React from "react";
import type {AP} from "./analogy_kit";
import {SANS} from "../kit";
import {PlanQuestionsArt, PlanStepsArt, PlanLabels} from "./analogy_f3_plan";
import {DepositInsuranceArt, DepositInsuranceLabels, SpreadArt, SpreadLabels} from "./analogy_f3_money";
import {ReserveWorldArt, ReserveWorldLabels, ReserveMixArt, ReserveMixLabels, DepressionLinesArt, DepressionLinesLabels} from "./analogy_f3_world";
import {TwoViewsArt, TwoViewsLabels, LimitsBalanceArt, LimitsBalanceLabels} from "./analogy_f3_views";

const Placeholder: React.FC<AP> = ({spec}) => (
  <text x={960} y={520} textAnchor="middle" fontFamily={SANS} fontSize={64} fill="#8a6f4a">PLACEHOLDER · {spec.which}</text>
);
const NoLabels: React.FC<AP> = () => null;

export const F3: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "plan-steps": {Art: (p) => (p.spec as any).mode === "steps" ? <PlanStepsArt {...p}/> : <PlanQuestionsArt {...p}/>, Labels: PlanLabels, bg: "#EFE6D2"},
  "two-views": {Art: TwoViewsArt, Labels: TwoViewsLabels, bg: "#EFE6D2"},
  "limits-balance": {Art: LimitsBalanceArt, Labels: LimitsBalanceLabels, bg: "#EFE6D2"},
  "reserve-world": {Art: (p) => (p.spec as any).mode === "mix" ? <ReserveMixArt {...p}/> : <ReserveWorldArt {...p}/>, Labels: (p) => (p.spec as any).mode === "mix" ? <ReserveMixLabels {...p}/> : <ReserveWorldLabels {...p}/>, bg: "#EFE6D2"},
  "depression-lines": {Art: DepressionLinesArt, Labels: DepressionLinesLabels, bg: "#EFE6D2"},
  "deposit-insurance": {Art: DepositInsuranceArt, Labels: DepositInsuranceLabels, bg: "#EFE6D2"},
  "spread": {Art: SpreadArt, Labels: SpreadLabels, bg: "#EFE6D2"},
};
