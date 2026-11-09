// Look B analogy scenes for GEO-07 Part 2 (p2b): jars, bucket-band, rulers, cards, seesaw, decades; see ../CONTRACT_B_P2.md. Same entry shape as analogy_a.tsx.
// Art lives in analogy_p2b_jars.tsx, analogy_p2b_rulers.tsx, analogy_p2b_cards.tsx and analogy_p2b_decades.tsx.
import React from "react";
import type {AP} from "./analogy_kit";
import {JarsArt, JarsLabels, BucketBandArt, BucketBandLabels} from "./analogy_p2b_jars";
import {RulersArt, RulersLabels} from "./analogy_p2b_rulers";
import {CardsArt, CardsLabels, SeesawArt, SeesawLabels} from "./analogy_p2b_cards";
import {DecadesArt, DecadesLabels} from "./analogy_p2b_decades";

export const P2B: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  jars: {Art: JarsArt, Labels: JarsLabels, bg: "#EFE6D2"},
  "bucket-band": {Art: BucketBandArt, Labels: BucketBandLabels, bg: "#EFE6D2"},
  rulers: {Art: RulersArt, Labels: RulersLabels, bg: "#EFE6D2"},
  cards: {Art: CardsArt, Labels: CardsLabels, bg: "#3a2514"},
  seesaw: {Art: SeesawArt, Labels: SeesawLabels, bg: "#EFE6D2"},
  decades: {Art: DecadesArt, Labels: DecadesLabels, bg: "#EFE6D2"},
};
