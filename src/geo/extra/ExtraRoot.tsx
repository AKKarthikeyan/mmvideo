// Separate Remotion root for Indica Atlas extra Shorts, so GeoRoot.tsx (shared with the numbered weeks) is untouched.
// Needs public/geo/<id>/data.json (written by scripts/geo/voice_geo.py extra:<id>). Fold into GeoRoot once voiced and approved.
// Render: npx remotion render src/geo/extra/index.ts GEO-tnmonsoon out/geo/extra/tnmonsoon.mp4
import React from "react";
import {Composition} from "remotion";
import {GeoShort, layout as glayout, GeoData as GD} from "../engine/GeoShort";
import {FPS, W, H} from "../Siliguri";
import {SPECSX} from "./specs";
import x_tnmonsoon from "../../../public/geo/tnmonsoon/data.json";
import x_hormuz from "../../../public/geo/hormuz/data.json";

const EXTRA: Record<string, unknown> = {tnmonsoon: x_tnmonsoon, hormuz: x_hormuz};

export const ExtraRoot: React.FC = () => (
  <>
    {Object.entries(EXTRA).map(([id, d]) => (
      <Composition key={id} id={`GEO-${id}`} component={GeoShort as any} defaultProps={{D: d as GD, S: SPECSX[id]}}
        durationInFrames={glayout(d as GD).total} fps={FPS} width={W} height={H}/>
    ))}
  </>
);
