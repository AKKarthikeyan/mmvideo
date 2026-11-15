// Private test entry for the windmap builder (Part 1 and Part 2): renders only windmap scenes, so other builders' unfinished files do not matter.
// Composition ids: WP1-<scene> (Part 1), WP2-<scene> (Part 2); 30 fps logical frames.
import React from "react";
import {Composition, registerRoot, useCurrentFrame} from "remotion";
import tl1 from "../../../../public/datayt/long/upsc/geo07-p1/timeline.json";
import tl2 from "../../../../public/datayt/long/upsc/geo07-p2/timeline.json";
import {Fonts} from "../kit";
import {Scene} from "./windmap";

const mk = (s: any, k = 1): React.FC => () => {
  const f = useCurrentFrame() / k;
  const at = (key: string) => { if (!(key in s.reveals)) throw new Error(`no reveal ${key}`); return s.reveals[key]; };
  return <Fonts><Scene f={f} dur={s.dur} spec={s.spec} at={at} draft={false}/></Fonts>;
};
const list = (tl: any, pre: string, k = 1) => (tl as any).scenes.filter((s: any) => s.kind === "windmap").map((s: any) => <Composition key={pre + s.id} id={`${pre}-${s.id}`} component={mk(s, k)} durationInFrames={s.dur * k} fps={30 * k} width={1920} height={1080}/>);
const Root: React.FC = () => <>{list(tl1, "WP1")}{list(tl2, "WP2")}{list(tl2, "WP2x", 2)}</>;
registerRoot(Root);
