// Isolated test root for one scene kind: bundle only your own entry, so another builder's half-written file cannot break your render.
//   dev/<kind>_entry.ts:   import {registerRoot} from "remotion"; import {makeRoot} from "./devRoot"; import {Scene} from "../scenes/<kind>"; registerRoot(makeRoot(Scene));
//   npx remotion bundle src/looks/cartoon/long/dev/<kind>_entry.ts --out-dir=/tmp/long_<kind>
//   npx remotion still /tmp/long_<kind> LONG-scene out.png --frame=N --props=/tmp/long_<kind>_props.json     ({"spec": {...}, "dur": 150, "reveals": {"key": 40}})
import React from "react";
import {AbsoluteFill, Composition, useCurrentFrame} from "remotion";
import {getBrand} from "../../../brands";
import {LookFonts} from "../../../shared/LookFonts";
import {C} from "../../palette";
import {H, W, type SceneProps} from "../contract";

export const makeRoot = (Scene: React.FC<SceneProps>): React.FC => {
  const Test: React.FC<{spec: any; dur?: number; reveals?: Record<string, number>}> = ({spec, dur = 150, reveals = {}}) => {
    const f = useCurrentFrame(), br = getBrand("datakadai");
    const at = (key: string) => { if (!(key in reveals)) throw new Error(`no reveal frame for key "${key}" (props.reveals has: ${Object.keys(reveals).join(", ") || "none"})`); return reveals[key]; };
    return <LookFonts faces={[br.faces.bricolage, br.faces.schibsted, br.faces.oswald]}><AbsoluteFill style={{background: C.ink}}><Scene f={f} dur={dur} spec={spec} at={at} draft={false}/></AbsoluteFill></LookFonts>;
  };
  return () => <Composition {...({id: "LONG-scene", component: Test, defaultProps: {spec: {}, dur: 150, reveals: {}}, durationInFrames: 150, fps: 30, width: W, height: H,
    calculateMetadata: ({props}: any) => ({durationInFrames: props.dur ?? 150})} as any)}/>;
};
