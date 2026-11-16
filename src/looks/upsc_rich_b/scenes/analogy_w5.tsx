// POL-03 Part 3 (Fundamental Rights), builder W5 (CONTRACT_B_POL03_P3.md). Same entry shape as analogy_w3.tsx: {Art, Labels, bg} per `which`.
// Art lives in analogy_w5_*.tsx only.
import React from "react";
import type {AP} from "./analogy_kit";
import {AnthemArt, AnthemLabels, BooksArt, BooksLabels, VerbsArt, VerbsLabels} from "./analogy_w5_a";
import {MinorityArt, MinorityLabels, NeutralArt, NeutralLabels, ScriptsArt, ScriptsLabels, TempleArt, TempleLabels} from "./analogy_w5_b";
import {CourtDoorsArt, CourtDoorsLabels, NhrcArt, NhrcLabels, PropertyArt, PropertyLabels, ShelfArt, ShelfLabels, SignpostsArt, SignpostsLabels} from "./analogy_w5_c";


export const W5: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "school-anthem": {Art: AnthemArt, Labels: AnthemLabels, bg: "#f8dcb0"}, "two-books": {Art: BooksArt, Labels: BooksLabels, bg: "#efe0c2"},
  "three-verbs": {Art: VerbsArt, Labels: VerbsLabels, bg: "#efe0c2"},
  "temple-doors": {Art: TempleArt, Labels: TempleLabels, bg: "#d9e8e2"}, "neutral-state": {Art: NeutralArt, Labels: NeutralLabels, bg: "#efe0c2"},
  "scripts-ribbon": {Art: ScriptsArt, Labels: ScriptsLabels, bg: "#d9e8e2"}, "minority-school": {Art: MinorityArt, Labels: MinorityLabels, bg: "#d9e8e2"},
  "court-doors": {Art: CourtDoorsArt, Labels: CourtDoorsLabels, bg: "#d9e8e2"}, "shelf-fence": {Art: ShelfArt, Labels: ShelfLabels, bg: "#efe0c2"},
  "goal-signposts": {Art: SignpostsArt, Labels: SignpostsLabels, bg: "#d9e8e2"}, "property-plinth": {Art: PropertyArt, Labels: PropertyLabels, bg: "#efe0c2"},
  "nhrc-door": {Art: NhrcArt, Labels: NhrcLabels, bg: "#efe0c2"},
};
