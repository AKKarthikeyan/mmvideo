// Entry point for the Mains answer videos (render: npx remotion render src/looks/upsc_rich_b/pyq/index.tsx PYQ-<id>[-60] <out.mp4>).
// A separate entry keeps the shared LongCompositions.tsx untouched.
import React from "react";
import {Composition, registerRoot} from "remotion";
import type {Timeline} from "../../cartoon/long/contract";
import {PyqLong} from "./PyqLong";
import geo from "../../../../public/datayt/long/upsc/pyq-2018-geo1-3a/timeline.json";
import pol from "../../../../public/datayt/long/upsc/pyq-2019-gs2-12/timeline.json";
import eco from "../../../../public/datayt/long/upsc/pyq-2025-eco1-4c/timeline.json";
import w0 from "../../../../public/datayt/long/upsc/pyq-2021-gs1-7/timeline.json";
import w1 from "../../../../public/datayt/long/upsc/pyq-2020-gs1-4/timeline.json";
import w2 from "../../../../public/datayt/long/upsc/pyq-2023-gs1-7/timeline.json";
import w3 from "../../../../public/datayt/long/upsc/pyq-2017-gs1-17/timeline.json";
import w4 from "../../../../public/datayt/long/upsc/pyq-2026-gs2-1/timeline.json";
import w5 from "../../../../public/datayt/long/upsc/pyq-2024-gs2-12/timeline.json";
import w6 from "../../../../public/datayt/long/upsc/pyq-2017-gs2-12/timeline.json";
import w7 from "../../../../public/datayt/long/upsc/pyq-2024-gs1-18/timeline.json";
import w8 from "../../../../public/datayt/long/upsc/pyq-2023-gs2-12/timeline.json";
import w9 from "../../../../public/datayt/long/upsc/pyq-2022-gs2-2/timeline.json";

const VIDEOS: [string, any][] = [["PYQ-2018-geo1-3a", geo], ["PYQ-2019-gs2-12", pol], ["PYQ-2025-eco1-4c", eco], ["PYQ-2021-gs1-7", w0], ["PYQ-2020-gs1-4", w1], ["PYQ-2023-gs1-7", w2], ["PYQ-2017-gs1-17", w3], ["PYQ-2026-gs2-1", w4], ["PYQ-2024-gs2-12", w5], ["PYQ-2017-gs2-12", w6], ["PYQ-2024-gs1-18", w7], ["PYQ-2023-gs2-12", w8], ["PYQ-2022-gs2-2", w9]];
const Root: React.FC = () => <>{VIDEOS.map(([id, t]) => <React.Fragment key={id}>
  <Composition id={id} component={PyqLong as any} defaultProps={{timeline: t as Timeline, draft: true}} durationInFrames={Math.max(30, t.total)} fps={30} width={1920} height={1080}/>
  <Composition id={`${id}-60`} component={PyqLong as any} defaultProps={{timeline: t as Timeline, draft: true, fps: 60}} durationInFrames={Math.max(60, t.total * 2)} fps={60} width={1920} height={1080}/>
</React.Fragment>)}</>;
registerRoot(Root);
