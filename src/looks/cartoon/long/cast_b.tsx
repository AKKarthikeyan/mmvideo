// The cast of actors for the long-form stage scene (builder B): eight original flat-vector characters in the pilot's art language (flat fills from C,
// 8 px ink outline, white eyes with dot pupils, mitten hands). Drawing lives in cast_b_kit.tsx (shared parts), cast_b_uncle.tsx, cast_b_women.tsx,
// cast_b_men.tsx, cast_b_kids.tsx; this file is the fixed API: <Actor who x y h f pose flip mouth seed/> draws one character as an SVG <g> in the
// 1920x1080 frame; (x, y) is the middle of the feet line, h the character's own standing height in px (hair to feet).
// To use this cast in the video: cast.tsx = `export * from "./cast_b";`
import React from "react";
import {spring} from "remotion";
import {C} from "../palette";
import {blinkAmt, gazeAt, type Pose, type Rig, type Who} from "./cast_b_kit";
import {Uncle, UNCLE_TOP} from "./cast_b_uncle";
import {Grandmother, GRANNY_TOP, Mother, MOTHER_TOP, Teacher, TEACHER_TOP} from "./cast_b_women";
import {Father, FATHER_TOP} from "./cast_b_men";
import {Baby, BABY_TOP, Boy, BOY_TOP, Girl, GIRL_TOP} from "./cast_b_kids";

export type {Who, Pose};
export const WHO: Who[] = ["uncle", "mother", "father", "grandmother", "girl", "boy", "baby", "teacher"];

// Suggested standing heights, uncle = 1: a family scene reads right when h = RELH[who] * the uncle's h. (HEIGHT is the same table under a second name.)
export const RELH: Record<Who, number> = {uncle: 1, father: 1.08, mother: 0.98, grandmother: 0.88, teacher: 1.04, girl: 0.72, boy: 0.6, baby: 0.42};
export const HEIGHT = RELH;

type Spec = {top: number; hw: number; Comp: React.FC<{r: Rig; blink: number}>};
const SPEC: Record<Who, Spec> = {
  uncle: {top: UNCLE_TOP, hw: 150, Comp: Uncle},
  mother: {top: MOTHER_TOP, hw: 140, Comp: Mother},
  father: {top: FATHER_TOP, hw: 150, Comp: Father},
  grandmother: {top: GRANNY_TOP, hw: 160, Comp: Grandmother},
  girl: {top: GIRL_TOP, hw: 130, Comp: Girl},
  boy: {top: BOY_TOP, hw: 120, Comp: Boy},
  baby: {top: BABY_TOP, hw: 150, Comp: Baby},
  teacher: {top: TEACHER_TOP, hw: 120, Comp: Teacher},
};

export type ActorProps = {
  who: Who; x: number; y: number; h: number; f: number;
  pose?: Pose; flip?: boolean; mouth?: string; seed?: number;
  look?: number;     // gaze, -1 (left) to 1 (right); default is a slow seeded drift
  since?: number;    // frame the pose began: arms swing from idle to the pose with a springy overshoot (default: already in the pose)
};

export const Actor: React.FC<ActorProps> = ({who, x, y, h, f, pose = "idle", flip, mouth = "X", seed = 1, look, since}) => {
  const sp = SPEC[who], s = h / (600 - sp.top), Comp = sp.Comp;
  const t = since === undefined ? 1 : f < since ? 0 : Math.max(0, spring({frame: f - since, fps: 30, config: {damping: 11, stiffness: 170, mass: 0.7}}));
  const ep: Pose = t > 0.02 ? pose : "idle";
  const r: Rig = {f, pose: ep, mouth, seed, look: gazeAt(f, seed, look), t};
  const ph = seed * 1.9, bob = Math.sin(f / 11 + ph) * 3.5, breath = 1 + Math.sin(f / 11 + ph) * 0.006;
  const hop = ep === "cheer" ? Math.abs(Math.sin(f / 7 + ph)) * 26 * t : 0;
  const lean = (ep === "present" || ep === "point" ? 1.6 * t : 0) + (ep === "worried" ? Math.sin(f / 2.3 + ph) * 0.7 : 0);
  return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) translate(-200 -600)`}>
    <ellipse cx={200} cy={600} rx={sp.hw * (1 - hop / 150)} ry={15 * (1 - hop / 200)} fill={C.shadow}/>
    <g transform={`translate(0 ${bob * 0.5 - hop}) translate(200 600) rotate(${lean}) scale(1 ${breath}) translate(-200 -600)`}>
      <Comp r={r} blink={blinkAmt(f, seed)}/>
    </g>
  </g>;
};
