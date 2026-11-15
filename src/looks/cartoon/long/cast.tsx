// The cast of actors for the long-form stage scene (and any scene that needs a person).
// API (fixed by CONTRACT.md): <Actor who x y h f pose flip mouth seed/> draws one character as an SVG <g> in the 1920x1080 frame.
//   (x, y) = middle of the feet line; h = the character's visible height in px (hair top to soles); f = local frame (drives blink every 3-5 s,
//   breathing bob, gaze, hand waves); pose = idle | present | point | cheer | worried; flip mirrors left-right; mouth = Rhubarb shape A-H
//   or X (X or undefined = the pose's resting mouth); seed varies blink/phase between actors of the same kind.
// Heights: pass base * HEIGHT[who] to get natural proportions (a boy is shorter than his father); Actor itself draws exactly h.
// The actor spans about x +- 0.36 h and y -1.0 h .. 0 (arms up in cheer reach about 1.1 h); the shadow is drawn on the feet line.
import React from "react";
import {Baby, Boy, Father, Girl, Grandmother, Mother, Teacher, Uncle} from "./cast_people";
import type {PersonProps} from "./cast_kit";

export type Who = "uncle" | "mother" | "father" | "grandmother" | "girl" | "boy" | "baby" | "teacher";
export type Pose = "idle" | "present" | "point" | "cheer" | "worried";
export const WHO: Who[] = ["uncle", "mother", "father", "grandmother", "girl", "boy", "baby", "teacher"];
// Natural relative heights (uncle = 1).
export const HEIGHT: Record<Who, number> = {uncle: 1, mother: 0.94, father: 1.04, grandmother: 0.86, girl: 0.7, boy: 0.6, baby: 0.36, teacher: 0.97};

const BODY: Record<Who, React.FC<PersonProps>> = {uncle: Uncle, mother: Mother, father: Father, grandmother: Grandmother, girl: Girl, boy: Boy, baby: Baby, teacher: Teacher};
const SHADOW: Record<Who, number> = {uncle: 150, mother: 140, father: 140, grandmother: 144, girl: 112, boy: 104, baby: 108, teacher: 130};
const BOX_H = 530; // the box drawn: feet line y = 600, hair top about y = 70

export const Actor: React.FC<{who: Who; x: number; y: number; h: number; f: number; pose?: Pose; flip?: boolean; mouth?: string; seed?: number}> =
  ({who, x, y, h, f, pose = "idle", flip, mouth, seed = 1}) => {
  const s = h / BOX_H, sd = seed + WHO.indexOf(who) * 13;
  const hop = pose === "cheer" ? Math.abs(Math.sin((f + sd) / 5.5)) : 0;
  const bob = pose === "cheer" ? -hop * 20 : -(0.5 + 0.5 * Math.sin((f + sd * 3) / 11)) * 3.5;
  const shake = pose === "worried" ? Math.sin(f * 1.9 + sd) * 1.5 : 0;
  const breath = 1 + Math.sin((f + sd * 5) / 16) * 0.008;
  const Body = BODY[who];
  return <g>
    <ellipse cx={x} cy={y + 3 * s} rx={SHADOW[who] * s * (1 - hop * 0.16)} ry={15 * s} fill="rgba(17,24,58,0.22)"/>
    <g transform={`translate(${x + shake * s} ${y + bob * s}) scale(${(flip ? -1 : 1) * s} ${s * breath}) translate(-200 -600)`}>
      <Body pose={pose} mouth={mouth} f={f} seed={sd}/>
    </g>
  </g>;
};
