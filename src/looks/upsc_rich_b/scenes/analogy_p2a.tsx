// Look B analogy scenes for GEO-07 Part 2 (p2a); see ../CONTRACT_B_P2.md. Same entry shape as analogy_a.tsx.
// which: checklist | calendar-flip | orographic (lee?) | rain-types | column-house | spells | months
import React from "react";
import type {AP} from "./analogy_kit";
import {ChecklistArt, ChecklistLabels} from "./analogy_p2a_clip";
import {CalendarArt, CalendarLabels} from "./analogy_p2a_cal";
import {OroArt, OroLeeArt, OroLabelsA, OroLabelsB, RainTypesArt, RainTypesLabels} from "./analogy_p2a_air";
import {ColumnHouseArt, ColumnHouseLabels, MonthsArt, MonthsLabels, SpellsArt, SpellsLabels} from "./analogy_p2a_data";

// orographic with or without the rain shadow is chosen by spec.lee, so one entry picks the variant
const Oro: React.FC<AP> = (p) => ((p.spec as any).lee ? <OroLeeArt {...p}/> : <OroArt {...p}/>);
const OroL: React.FC<AP> = (p) => ((p.spec as any).lee ? <OroLabelsB {...p}/> : <OroLabelsA {...p}/>);

export const P2A: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  checklist: {Art: ChecklistArt, Labels: ChecklistLabels, bg: "#e2c69a"},
  "calendar-flip": {Art: CalendarArt, Labels: CalendarLabels, bg: "#f3e3c2"},
  orographic: {Art: Oro, Labels: OroL, bg: "#86bde6"},
  "rain-types": {Art: RainTypesArt, Labels: RainTypesLabels, bg: "#f4e8cc"},
  "column-house": {Art: ColumnHouseArt, Labels: ColumnHouseLabels, bg: "#7fb2d8"},
  spells: {Art: SpellsArt, Labels: SpellsLabels, bg: "#f6ecd2"},
  months: {Art: MonthsArt, Labels: MonthsLabels, bg: "#f6ecd2"},
};
