// Local shot frame for scenes 10-11 (the kit's Desk adds a random mid-shot glide that shifts dense layouts off-frame):
// same look as Desk (paper or ink surface, camera layer, source chip, finish) with ONLY the camera keys given.
import React from "react";
import {AbsoluteFill} from "remotion";
import {CamKey, Layer, camAt} from "./kit/Camera";
import {SourceTag} from "./kit/Cards";
import {Paper} from "./kit/A01V4Parts";
import {Finish, InkSurface} from "./kit/Texture";

export const Frame: React.FC<{f: number; d: number; cam?: CamKey[]; tone?: "cream" | "ink"; chip?: string; chip2?: string; children?: React.ReactNode; over?: React.ReactNode}> =
  ({f, d, cam, tone = "cream", chip, chip2, children, over}) => {
    const c = camAt(f, cam ?? [[0, 1.0, 960, 540], [d, 1.02, 960, 540]]);
    const dark = tone === "ink";
    return (
      <AbsoluteFill>
        {dark ? <InkSurface glow={0.08}/> : <Layer cam={c} depth={0.85}><Paper drift={f / Math.max(1, d)}/></Layer>}
        <Layer cam={c}>{children}</Layer>
        {over}
        {chip ? <SourceTag f={f} at={0} text={chip} dark={dark}/> : null}
        {chip2 ? <SourceTag f={f} at={0} text={chip2} dark={dark} pos="bl"/> : null}
        <Finish f={f} dark={dark}/>
      </AbsoluteFill>
    );
  };
