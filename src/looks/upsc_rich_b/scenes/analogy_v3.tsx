// GEO-04 Part 1 (Volcanoes) analogy variants, builder V3: underground and the map (intrusive, subduction, plates-map, hotspot).
// Same entry shape as analogy_e1.tsx: {Art, Labels, bg} per `which`; `mode` picks the variant. Helper files: analogy_v3_*.tsx only.
import React from "react";
import type {AP} from "./analogy_kit";
import {RocksArt, RocksLabels, BatholithArt, BatholithLabels, AllArt, AllLabels, DeccanArt, DeccanLabels} from "./analogy_v3_intrusive";
import {SubductionArt, SubductionLabels} from "./analogy_v3_slice";
import {PlatesMapArt, PlatesMapLabels} from "./analogy_v3_map";
import {HotspotArt, HotspotLabels} from "./analogy_v3_hotspot";

const by = (m: Record<string, React.FC<AP>>, d: string): React.FC<AP> => (p) => { const C = m[(p.spec as any).mode ?? d] ?? m[d]; return <C {...p}/>; };
const IntArt = by({rocks: RocksArt, batholith: BatholithArt, all: AllArt, deccan: DeccanArt}, "rocks");
const IntLabels = by({rocks: RocksLabels, batholith: BatholithLabels, all: AllLabels, deccan: DeccanLabels}, "rocks");

export const V3: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "intrusive": {Art: IntArt, Labels: IntLabels, bg: "#EFE6D2"},
  "subduction": {Art: SubductionArt, Labels: SubductionLabels, bg: "#ECE2CC"},
  "plates-map": {Art: PlatesMapArt, Labels: PlatesMapLabels, bg: "#EDE3CC"},
  "hotspot": {Art: HotspotArt, Labels: HotspotLabels, bg: "#EFE6D2"},
};
