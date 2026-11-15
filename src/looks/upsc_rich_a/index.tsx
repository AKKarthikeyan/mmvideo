// Look sample A (Kurz look) for the UPSC monsoon film: three scenes, 1920x1080, 60 fps, about 8 s each.
// f is the scene's frame on the 30 fps logical clock (fractional at 60 fps), as in KurzLong. Local reveal timings, no timeline.
import React from "react";
import {AbsoluteFill, Composition, registerRoot, useCurrentFrame} from "remotion";
import {getBrand} from "../brands";
import {LookFonts} from "../shared/LookFonts";
import {K} from "./rk";
import {S001} from "./s001";
import {S022} from "./s022";
import {S038} from "./s038";

const DUR = 240;      // logical frames = 8 s
const TIMES: Record<string, Record<string, number>> = {
  s001: {t5: 64, r5: 132},
  s022: {eq: 24, tr: 50, cx: 104, bd: 150, ex: 200},
  s038: {nv: 70},
};
const COMPS: Record<string, React.FC<any>> = {s001: S001, s022: S022, s038: S038};

const Host: React.FC<{id: string}> = ({id}) => {
  const f = useCurrentFrame() / 2, br = getBrand("indicaatlas"), C = COMPS[id];
  const at = (k: string) => { if (!(k in TIMES[id])) throw new Error(`${id}: no reveal for ${k}`); return TIMES[id][k]; };
  return <LookFonts faces={[br.faces.bricolage, br.faces.schibsted, br.faces.oswald]}>
    <AbsoluteFill style={{background: K.night, overflow: "hidden"}}><C f={f} dur={DUR} at={at}/></AbsoluteFill>
  </LookFonts>;
};

const Root: React.FC = () => <>
  {["s001", "s022", "s038"].map((id) => <Composition key={id} id={`RICH-A-${id}`} component={Host as any} defaultProps={{id}} durationInFrames={DUR * 2} fps={60} width={1920} height={1080}/>)}
</>;
registerRoot(Root);
