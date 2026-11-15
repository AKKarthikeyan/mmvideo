// POL-03 Parts 1-2 (Fundamental Rights) analogy variants, builder W3: PLACEHOLDERS. The W3 builder replaces this file's entries with real
// art (see ../CONTRACT_B_POL03.md). Same entry shape as analogy_e1.tsx: {Art, Labels, bg} per `which`. Helper files: analogy_w3_*.tsx only.
import React from "react";
import type {AP} from "./analogy_kit";
import {SANS} from "../kit";
import {DoorsArt, DoorsLabels} from "./analogy_w3_doors";
import {PhoneArt, PhoneLabels} from "./analogy_w3_phone";
import {CourtArt, CourtLabels} from "./analogy_w3_court";
import {BoxesArt, BoxesLabels} from "./analogy_w3_boxes";
import {PrivacyArt, PrivacyLabels} from "./analogy_w3_privacy";
import {PrisonArt, PrisonLabels} from "./analogy_w3_prison";

const Placeholder: React.FC<AP> = ({spec}) => (
  <text x={960} y={520} textAnchor="middle" fontFamily={SANS} fontSize={64} fill="#8a6f4a">PLACEHOLDER · {spec.which}</text>
);
const NoLabels: React.FC<AP> = () => null;
const P = {Art: Placeholder, Labels: NoLabels, bg: "#EFE6D2"};

export const W3: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "prison-gate": {Art: PrisonArt, Labels: PrisonLabels, bg: "#1c1f26"}, "six-doors": {Art: DoorsArt, Labels: DoorsLabels, bg: "#EFE2C4"}, "phone-66a": {Art: PhoneArt, Labels: PhoneLabels, bg: "#E4EDE2"}, "court-shields": {Art: CourtArt, Labels: CourtLabels, bg: "#C89A62"}, "glass-boxes": {Art: BoxesArt, Labels: BoxesLabels, bg: "#E6D6B8"}, "privacy-search": {Art: PrivacyArt, Labels: PrivacyLabels, bg: "#EADCC0"},
};
