// Dev-only test scene for the cast. spec.mode: "cast" (all 8 side by side), "poses" (one who, 5 poses), "mouths" (one who, X + A-H),
// "scale" (one who at 300 px and 900 px), "one" (one who big). Other spec fields: pose, who, mouth, base (uncle height in px).
import React from "react";
import {AbsoluteFill} from "remotion";
import {C} from "../../palette";
import {SANS} from "../../ui";
import type {SceneProps} from "../contract";
import {Actor, HEIGHT, WHO, type Pose, type Who} from "../cast";

const POSES: Pose[] = ["idle", "present", "point", "cheer", "worried"];
const Label: React.FC<{x: number; y: number; t: string}> = ({x, y, t}) => <text x={x} y={y} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} fill={C.ink}>{t}</text>;

export const Scene: React.FC<SceneProps> = ({f, spec}) => {
  const mode = spec.mode ?? "cast", base = spec.base ?? 720, pose: Pose = spec.pose ?? "idle", who: Who = spec.who ?? "uncle";
  const floor = mode === "scale" || mode === "one" ? 1040 : 900;
  return <AbsoluteFill style={{background: C.sky2}}>
    <svg width={1920} height={1080}>
      <rect y={floor} width={1920} height={1080 - floor} fill={C.floor}/><rect y={floor - 6} width={1920} height={12} fill={C.floorDark}/>
      {mode === "cast" && WHO.map((w, i) => {
        const x = 150 + i * 232;
        return <g key={w}><Actor who={w} x={x} y={floor} h={base * HEIGHT[w]} f={f} pose={pose} mouth={spec.mouth} seed={spec.seed ?? 1}/><Label x={x} y={floor + 60} t={w}/></g>;
      })}
      {mode === "poses" && POSES.map((p, i) => {
        const x = 200 + i * 380;
        return <g key={p}><Actor who={who} x={x} y={floor} h={spec.h ?? 640} f={f} pose={p} mouth={spec.mouth} seed={spec.seed ?? 1}/><Label x={x} y={floor + 60} t={p}/></g>;
      })}
      {mode === "mouths" && ["X", "A", "B", "C", "D", "E", "F", "G", "H"].map((m, i) => {
        const x = 130 + i * 207;
        return <g key={m}><Actor who={who} x={x} y={floor} h={spec.h ?? 400} f={f} pose={pose} mouth={m} seed={spec.seed ?? 1}/><Label x={x} y={floor + 60} t={m}/></g>;
      })}
      {mode === "scale" && <g><Actor who={who} x={460} y={floor} h={900} f={f} pose={pose} mouth={spec.mouth}/><Actor who={who} x={1000} y={floor} h={300} f={f} pose={pose} mouth={spec.mouth}/>
        <Actor who={who} x={1250} y={floor} h={450} f={f} pose={pose} mouth={spec.mouth}/><Actor who={who} x={1500} y={floor} h={600} f={f} pose={pose} mouth={spec.mouth} flip/></g>}
      {mode === "one" && <Actor who={who} x={960} y={floor} h={spec.h ?? 950} f={f} pose={pose} mouth={spec.mouth}/>}
    </svg>
  </AbsoluteFill>;
};
