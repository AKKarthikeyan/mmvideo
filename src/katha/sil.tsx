// Silhouettes with a rim of light (21 Oct 2026). A shape is drawn three times: as a clip, in the rim colour, and in the
// dark colour nudged away from the light inside the clip, which leaves a thin crescent of light on the side facing it.
// Horses and birds are traced from animated models (scripts/katha/trace_glb.py): Mirada, 3 Dreams of Black, Apache 2.0.
import React, {useId} from "react";
import {K} from "./look";
import horseJ from "./sil/horse.json";
import flamingoJ from "./sil/flamingo.json";
import storkJ from "./sil/stork.json";
import parrotJ from "./sil/parrot.json";
import {krishnaTeach, krishnaDrive, arjuna, ratha, wheel, gandiva} from "./figures";

type Cycle = {frames: string[]; anchors?: Record<string, [number, number]>[]; cycle_sec: number};
export const CYCLES: Record<string, Cycle> = {horse: horseJ as any, flamingo: flamingoJ as any, stork: storkJ as any, parrot: parrotJ as any};
export const frameOf = (c: Cycle, f: number, speed = 1, phase = 0) => {
  const n = c.frames.length, i = Math.floor(((f / 30) * speed / c.cycle_sec + phase) * n);
  return ((i % n) + n) % n;
};
// Paths in one local frame, drawn as one rim-lit silhouette. light: the direction the light comes FROM (unit-ish vector).
export type Item = string | {d: string; t?: string; fill?: string};
export const Rimmed: React.FC<{paths: Item[]; transform?: string; fill?: string; rim?: string; light: [number, number]; w?: number; evenodd?: boolean; glow?: number}> =
  ({paths, transform, fill = K.sil, rim = K.rim, light, w = 4, evenodd = false, glow = 0}) => {
  const id = "rm" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const l = Math.hypot(light[0], light[1]) || 1, dx = (-light[0] / l) * w, dy = (-light[1] / l) * w;
  const fr = evenodd ? "evenodd" : "nonzero";
  const items = paths.map((p) => (typeof p === "string" ? {d: p} : p));
  const draw = (col: string | null, key: string) => items.map((it, i) => <path key={key + i} d={it.d} transform={it.t} fill={col ?? it.fill ?? fill} fillRule={fr} clipRule={fr}/>);
  return (
    <g transform={transform}>
      <defs><clipPath id={id}>{draw("#000", "c")}</clipPath></defs>
      {glow > 0 ? <g opacity={glow} filter="url(#k-b8)">{draw(rim, "g")}</g> : null}
      {draw(rim, "r")}
      <g clipPath={`url(#${id})`}><g transform={`translate(${dx} ${dy})`}>{draw(null, "f")}</g></g>
    </g>
  );
};
// A galloping horse (facing right) as a path item; x, y = the ground point under the barrel; scale 1 = ~210 px tall.
export const horseItem = (x: number, y: number, scale: number, f: number, speed = 1, phase = 0, fill?: string): Item =>
  ({d: CYCLES.horse.frames[frameOf(CYCLES.horse, f, speed, phase)], t: `translate(${x} ${y}) scale(${scale})`, fill});
export const Horse: React.FC<{x: number; y: number; scale: number; f: number; speed?: number; phase?: number; light: [number, number]; fill?: string}> =
  ({x, y, scale, f, speed = 1, phase = 0, light, fill = K.silHorse}) => <Rimmed paths={[horseItem(x, y, scale, f, speed, phase)]} fill={fill} light={light} w={4}/>;
export const horseAnchor = (f: number, speed = 1, phase = 0, key = "mouth") => { const c = CYCLES.horse, i = frameOf(c, f, speed, phase); return c.anchors ? c.anchors[i][key] : [0, 0]; };
// A bird in flight (facing right unless flip).
export const Bird: React.FC<{kind?: "flamingo" | "stork" | "parrot"; x: number; y: number; scale: number; f: number; speed?: number; phase?: number; light?: [number, number]; fill?: string; flip?: boolean}> =
  ({kind = "stork", x, y, scale, f, speed = 1, phase = 0, light, fill = K.sil, flip = false}) => {
  const c = CYCLES[kind], i = frameOf(c, f, speed, phase), tr = `translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`;
  return light ? <Rimmed paths={[c.frames[i]]} transform={tr} fill={fill} light={[flip ? -light[0] : light[0], light[1]]} w={2.5 / scale}/> : <path d={c.frames[i]} transform={tr} fill={fill}/>;
};
export {krishnaTeach, krishnaDrive, arjuna, ratha, wheel, gandiva};
