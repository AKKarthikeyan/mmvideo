// ECO-16 Part 3 analogy variants, builder G2: PLACEHOLDERS. The G2 builder replaces this file's entries with real art (see ../CONTRACT_B_ECO3.md).
// Same entry shape as analogy_f1.tsx: {Art, Labels, bg} per `which`. Add helper files named analogy_g2_*.tsx; never touch another builder's files.
import React from "react";
import type {AP} from "./analogy_kit";
import {SANS} from "../kit";
import {CreditTermsArt, CreditTermsLabels} from "./analogy_g2_credit";
import {GraphTrapArt, GraphTrapLabels} from "./analogy_g2_graph";
import {JanDhanArt, JanDhanLabels} from "./analogy_g2_jd";
import {AccountsArt, AccountsLabels, CompoundArt, CompoundLabels} from "./analogy_g2_acc";
import {UpiArt, UpiLabels, CompareArt, CompareLabels} from "./analogy_g2_upi";
import {DebtKindsArt, DebtKindsLabels, DebtBarsArt, DebtBarsLabels} from "./analogy_g2_debt";

const Placeholder: React.FC<AP> = ({spec}) => (
  <text x={960} y={520} textAnchor="middle" fontFamily={SANS} fontSize={64} fill="#8a6f4a">PLACEHOLDER · {spec.which}</text>
);
const NoLabels: React.FC<AP> = () => null;

export const G2: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "credit-terms": {Art: CreditTermsArt, Labels: CreditTermsLabels, bg: "#EFE6D2"},
  "debt-bars": {Art: (p) => (p.spec as any).mode === "bars" ? <DebtBarsArt {...p}/> : <DebtKindsArt {...p}/>, Labels: (p) => (p.spec as any).mode === "bars" ? <DebtBarsLabels {...p}/> : <DebtKindsLabels {...p}/>, bg: "#EFE6D2"},
  "graph-trap": {Art: GraphTrapArt, Labels: GraphTrapLabels, bg: "#EFE6D2"},
  "jan-dhan": {Art: JanDhanArt, Labels: JanDhanLabels, bg: "#EFE6D2"},
  "accounts": {Art: (p) => (p.spec as any).mode === "compound" ? <CompoundArt {...p}/> : <AccountsArt {...p}/>, Labels: (p) => (p.spec as any).mode === "compound" ? <CompoundLabels {...p}/> : <AccountsLabels {...p}/>, bg: "#EFE6D2"},
  "upi-compare": {Art: (p) => (p.spec as any).mode === "compare" ? <CompareArt {...p}/> : <UpiArt {...p}/>, Labels: (p) => (p.spec as any).mode === "compare" ? <CompareLabels {...p}/> : <UpiLabels {...p}/>, bg: "#0f1838"},
};
