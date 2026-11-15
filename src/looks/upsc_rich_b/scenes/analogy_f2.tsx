// ECO-16 Part 2 analogy variants, builder F2: PLACEHOLDERS. The F2 builder replaces this file's entries with real art (see ../CONTRACT_B_ECO2.md).
// Same entry shape as analogy_e1.tsx: {Art, Labels, bg} per `which`. Add helper files named analogy_f2_*.tsx; never touch another builder's files.
import React from "react";
import type {AP} from "./analogy_kit";
import {SANS} from "../kit";
import {LedgerArt, LedgerLabels} from "./analogy_f2_ledger";
import {RoundsArt, RoundsLabels} from "./analogy_f2_rounds";
import {GearArt, GearLabels} from "./analogy_f2_gears";
import {RbiPanelArt, RbiPanelLabels} from "./analogy_f2_panel";
import {OmoArt, OmoLabels} from "./analogy_f2_omo";
import {VaultCrrArt, VaultCrrLabels, CrrTimelineArt, CrrTimelineLabels} from "./analogy_f2_vault";

const Placeholder: React.FC<AP> = ({spec}) => (
  <text x={960} y={520} textAnchor="middle" fontFamily={SANS} fontSize={64} fill="#8a6f4a">PLACEHOLDER · {spec.which}</text>
);
const NoLabels: React.FC<AP> = () => null;

export const F2: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "ledger": {Art: LedgerArt, Labels: LedgerLabels, bg: "#EFE6D2"},
  "vault-crr": {Art: VaultCrrArt, Labels: VaultCrrLabels, bg: "#EFE6D2"},
  "rounds-stairs": {Art: RoundsArt, Labels: RoundsLabels, bg: "#EFE6D2"},
  "gear-multiplier": {Art: GearArt, Labels: GearLabels, bg: "#EFE6D2"},
  "crr-timeline": {Art: CrrTimelineArt, Labels: CrrTimelineLabels, bg: "#EFE6D2"},
  "rbi-panel": {Art: RbiPanelArt, Labels: RbiPanelLabels, bg: "#EFE6D2"},
  "omo": {Art: OmoArt, Labels: OmoLabels, bg: "#EFE6D2"},
};
