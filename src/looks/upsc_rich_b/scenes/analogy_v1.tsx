// GEO-04 Part 1 (Volcanoes) analogy variants, builder V1: PLACEHOLDERS. The V1 builder replaces this file's entries with real art
// (see ../CONTRACT_B_GEO04.md). Same entry shape as analogy_e1.tsx: {Art, Labels, bg} per `which`. Helper files: analogy_v1_*.tsx only.
import React from "react";
import type {AP} from "./analogy_kit";
import {SANS} from "../kit";
import {HookArt, HookLabels} from "./analogy_v1_hook";
import {CutArt, CutLabels} from "./analogy_v1_cut";
import {ProdArt, ProdLabels} from "./analogy_v1_prod";
import {PotArt, PotLabels} from "./analogy_v1_kitchen";
import {FizzyArt, FizzyLabels} from "./analogy_v1_fizzy";

const Placeholder: React.FC<AP> = ({spec}) => (
  <text x={960} y={520} textAnchor="middle" fontFamily={SANS} fontSize={64} fill="#8a6f4a">PLACEHOLDER · {spec.which}</text>
);
const NoLabels: React.FC<AP> = () => null;
const P = {Art: Placeholder, Labels: NoLabels, bg: "#EFE6D2"};

export const V1: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "volcano-hook": {Art: HookArt, Labels: HookLabels, bg: "#EFE6D2"}, "cutaway": {Art: CutArt, Labels: CutLabels, bg: "#EFE6D2"}, "eruption-products": {Art: ProdArt, Labels: ProdLabels, bg: "#EFE6D2"}, "pot-lid": {Art: PotArt, Labels: PotLabels, bg: "#EFE6D2"}, "fizzy": {Art: FizzyArt, Labels: FizzyLabels, bg: "#EFE6D2"},
};
