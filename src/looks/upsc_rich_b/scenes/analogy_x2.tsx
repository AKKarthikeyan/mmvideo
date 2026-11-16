// ECO-12 Part 2 (Who decides GST?), builder X2 (CONTRACT_B_ECO12.md). Entry shape as analogy_x1.tsx: {Art, Labels, bg} per `which`.
import React from "react";
import type {AP} from "./analogy_kit";
import {BookArt, BookLabels, DefArt, DefLabels, ListsArt, ListsLabels, TableArt, TableLabels} from "./analogy_x2_a";
import {ExciseArt, ExciseLabels, FunnelArt, FunnelLabels, SheetArt, SheetLabels, VoteArt, VoteLabels} from "./analogy_x2_b";
import {ClockArt, ClockLabels, LocksArt, LocksLabels, PenShareArt, PenShareLabels, ShipArt, ShipLabels} from "./analogy_x2_c";

export const X2: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "council-table": {Art: TableArt, Labels: TableLabels, bg: "#d9c49c"}, "two-lists": {Art: ListsArt, Labels: ListsLabels, bg: "#efe0c2"},
  "amendment-book": {Art: BookArt, Labels: BookLabels, bg: "#efe0c2"}, "definition-page": {Art: DefArt, Labels: DefLabels, bg: "#efe0c2"},
  "excise-cards": {Art: ExciseArt, Labels: ExciseLabels, bg: "#efe0c2"}, "tax-funnel": {Art: FunnelArt, Labels: FunnelLabels, bg: "#efe0c2"},
  "council-sheet": {Art: SheetArt, Labels: SheetLabels, bg: "#efe0c2"}, "vote-meter": {Art: VoteArt, Labels: VoteLabels, bg: "#efe0c2"},
  "padlocks": {Art: LocksArt, Labels: LocksLabels, bg: "#efe0c2"}, "midnight-clock": {Art: ClockArt, Labels: ClockLabels, bg: "#141c38"},
  "ship-freight": {Art: ShipArt, Labels: ShipLabels, bg: "#d9e8e2"}, "shared-pen": {Art: PenShareArt, Labels: PenShareLabels, bg: "#efe0c2"},
};
