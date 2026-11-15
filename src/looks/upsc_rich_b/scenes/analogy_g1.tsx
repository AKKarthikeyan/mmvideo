// ECO-16 Part 3 analogy variants, builder G1: PLACEHOLDERS. The G1 builder replaces this file's entries with real art (see ../CONTRACT_B_ECO3.md).
// Same entry shape as analogy_f1.tsx: {Art, Labels, bg} per `which`. Add helper files named analogy_g1_*.tsx; never touch another builder's files.
import React from "react";
import type {AP} from "./analogy_kit";
import {SANS} from "../kit";
import {BorrowArt, BorrowLabels} from "./analogy_g1_borrow";
import {SuperArt, SuperLabels} from "./analogy_g1_super";
import {ShgArt, ShgLabels} from "./analogy_g1_shg";
import {NobelArt, NobelLabels} from "./analogy_g1_nobel";
import {PayArt, PayLabels} from "./analogy_g1_pay";
import {UpiArt, UpiLabels} from "./analogy_g1_upi";
import {FraudArt, FraudLabels} from "./analogy_g1_fraud";
import {WrapArt, WrapLabels} from "./analogy_g1_wrap";

const Placeholder: React.FC<AP> = ({spec}) => (
  <text x={960} y={520} textAnchor="middle" fontFamily={SANS} fontSize={64} fill="#8a6f4a">PLACEHOLDER · {spec.which}</text>
);
const NoLabels: React.FC<AP> = () => null;

export const G1: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "two-borrowers": {Art: BorrowArt, Labels: BorrowLabels, bg: "#EFE6D2"},
  "supervision": {Art: SuperArt, Labels: SuperLabels, bg: "#EFE6D2"},
  "shg-circle": {Art: ShgArt, Labels: ShgLabels, bg: "#EFE6D2"},
  "nobel-grameen": {Art: NobelArt, Labels: NobelLabels, bg: "#EFE6D2"},
  "payment-modes": {Art: PayArt, Labels: PayLabels, bg: "#EFE6D2"},
  "upi-chain": {Art: UpiArt, Labels: UpiLabels, bg: "#EFE6D2"},
  "fraud": {Art: FraudArt, Labels: FraudLabels, bg: "#EFE6D2"},
  "part-wrap": {Art: WrapArt, Labels: WrapLabels, bg: "#EFE6D2"},
};
