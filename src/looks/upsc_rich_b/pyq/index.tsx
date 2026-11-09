// Entry point for the Mains answer videos (render: npx remotion render src/looks/upsc_rich_b/pyq/index.tsx PYQ-<id>[-60] <out.mp4>).
// A separate entry keeps the shared LongCompositions.tsx untouched.
import React from "react";
import {Composition, registerRoot} from "remotion";
import type {Timeline} from "../../cartoon/long/contract";
import {PyqLong} from "./PyqLong";
import geo from "../../../../public/datayt/long/upsc/pyq-2018-geo1-3a/timeline.json";
import pol from "../../../../public/datayt/long/upsc/pyq-2019-gs2-12/timeline.json";
import eco from "../../../../public/datayt/long/upsc/pyq-2025-eco1-4c/timeline.json";

const VIDEOS: [string, any][] = [["PYQ-2018-geo1-3a", geo], ["PYQ-2019-gs2-12", pol], ["PYQ-2025-eco1-4c", eco]];
const Root: React.FC = () => <>{VIDEOS.map(([id, t]) => <React.Fragment key={id}>
  <Composition id={id} component={PyqLong as any} defaultProps={{timeline: t as Timeline, draft: true}} durationInFrames={Math.max(30, t.total)} fps={30} width={1920} height={1080}/>
  <Composition id={`${id}-60`} component={PyqLong as any} defaultProps={{timeline: t as Timeline, draft: true, fps: 60}} durationInFrames={Math.max(60, t.total * 2)} fps={60} width={1920} height={1080}/>
</React.Fragment>)}</>;
registerRoot(Root);
