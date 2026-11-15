// ECO-16 Part 1 analogy variants, builder E1: PLACEHOLDERS. The E1 builder replaces this file's entries with real art (see ../CONTRACT_B_ECO1.md).
// Same entry shape as analogy_p2b.tsx: {Art, Labels, bg} per `which`. Add helper files named analogy_e1_*.tsx; never touch another builder's files.
import React from "react";
import type {AP} from "./analogy_kit";
import {SANS} from "../kit";
import {PhonePayArt, PhonePayLabels} from "./analogy_e1_pay";
import {VelocityArt, VelocityLabels} from "./analogy_e1_vel";
import {LegalArt, LegalLabels, ChequeArt, ChequeLabels, NotTenderArt, NotTenderLabels} from "./analogy_e1_shop";
import {BarterArt, BarterLabels, MediumArt, MediumLabels} from "./analogy_e1_barter";

const Placeholder: React.FC<AP> = ({spec}) => (
  <text x={960} y={520} textAnchor="middle" fontFamily={SANS} fontSize={64} fill="#8a6f4a">PLACEHOLDER · {spec.which}</text>
);
const NoLabels: React.FC<AP> = () => null;

export const E1: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "phone-pay": {Art: PhonePayArt, Labels: PhonePayLabels, bg: "#EFE6D2"},
  "barter": {Art: BarterArt, Labels: BarterLabels, bg: "#EFE6D2"},
  "medium-exchange": {Art: MediumArt, Labels: MediumLabels, bg: "#EFE6D2"},
  "velocity-street": {Art: VelocityArt, Labels: VelocityLabels, bg: "#EFE6D2"},
  "legal-tender": {Art: LegalArt, Labels: LegalLabels, bg: "#EFE6D2"},
  "cheque": {Art: ChequeArt, Labels: ChequeLabels, bg: "#EFE6D2"},
  "not-tender": {Art: NotTenderArt, Labels: NotTenderLabels, bg: "#EFE6D2"},
};
