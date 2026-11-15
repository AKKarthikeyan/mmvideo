// Private test entry for the windmap builder: renders only windmap scenes (no other kinds), so other builders' unfinished files do not matter.
// npx remotion still src/looks/upsc_rich_b/scenes/windmap_test.tsx WM-s022 out.png --frame=100   (30 fps logical)  |  WM60-s022 (60 fps)
import React from "react";
import {Composition, registerRoot, useCurrentFrame} from "remotion";
import tl from "../../../../public/datayt/long/upsc/geo07-p1/timeline.json";
import {Fonts} from "../kit";
import {Scene} from "./windmap";

const scenes = (tl as any).scenes.filter((s: any) => s.kind === "windmap");
const mk = (s: any, k: number): React.FC => () => {
  const f = useCurrentFrame() / k;
  const at = (key: string) => { if (!(key in s.reveals)) throw new Error(`no reveal ${key}`); return s.reveals[key]; };
  return <Fonts><Scene f={f} dur={s.dur} spec={s.spec} at={at} draft={false}/></Fonts>;
};
const Root: React.FC = () => (
  <>
    {scenes.map((s: any) => <Composition key={s.id} id={`WM-${s.id}`} component={mk(s, 1)} durationInFrames={s.dur} fps={30} width={1920} height={1080}/>)}
    {scenes.map((s: any) => <Composition key={s.id + "x"} id={`WM60-${s.id}`} component={mk(s, 2)} durationInFrames={s.dur * 2} fps={60} width={1920} height={1080}/>)}
  </>
);
registerRoot(Root);
