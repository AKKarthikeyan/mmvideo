// ECO-16 Part 3 analogy variants, builder G3: stories, ladder, institutions and the exam question (plan-steps-3, debt-trap, access-ladder, institutions, syndicated).
// Same entry shape as analogy_f1.tsx: {Art, Labels, bg} per `which`. Helper files: analogy_g3_*.tsx.
import React from "react";
import type {AP} from "./analogy_kit";
import {DebtTrapArt, DebtTrapLabels} from "./analogy_g3_trap";
import {AccessLadderArt, AccessLadderLabels} from "./analogy_g3_ladder";
import {InstitutionsArt, InstitutionsLabels} from "./analogy_g3_inst";
import {SyndicatedArt, SyndicatedLabels} from "./analogy_g3_synd";
import {PlanRecapArt, PlanSteps3Art, PlanSteps3Labels} from "./analogy_g3_plan";

const PlanArt: React.FC<AP> = (p) => ((p.spec as any).mode === "steps" ? <PlanSteps3Art {...p}/> : <PlanRecapArt {...p}/>);

export const G3: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "plan-steps-3": {Art: PlanArt, Labels: PlanSteps3Labels, bg: "#EFE6D2"},
  "debt-trap": {Art: DebtTrapArt, Labels: DebtTrapLabels, bg: "#EFE6D2"},
  "access-ladder": {Art: AccessLadderArt, Labels: AccessLadderLabels, bg: "#EFE6D2"},
  "institutions": {Art: InstitutionsArt, Labels: InstitutionsLabels, bg: "#EFE6D2"},
  "syndicated": {Art: SyndicatedArt, Labels: SyndicatedLabels, bg: "#EFE6D2"},
};
