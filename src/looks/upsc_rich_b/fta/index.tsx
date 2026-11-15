// Entry point for Fix This Answer episodes (render: npx remotion render src/looks/upsc_rich_b/fta/index.tsx FTA-01[-60] <out.mp4>).
import React from "react";
import {Composition, registerRoot} from "remotion";
import type {Timeline} from "../../cartoon/long/contract";
import {FtaLong} from "./FtaLong";
import e01 from "../../../../public/datayt/long/upsc/fta-01/timeline.json";

const EPISODES: [string, any][] = [["FTA-01", e01]];
const Root: React.FC = () => <>{EPISODES.map(([id, t]) => <React.Fragment key={id}>
  <Composition id={id} component={FtaLong as any} defaultProps={{timeline: t as Timeline, draft: true}} durationInFrames={Math.max(30, t.total)} fps={30} width={1920} height={1080}/>
  <Composition id={`${id}-60`} component={FtaLong as any} defaultProps={{timeline: t as Timeline, draft: true, fps: 60}} durationInFrames={Math.max(60, t.total * 2)} fps={60} width={1920} height={1080}/>
</React.Fragment>)}</>;
registerRoot(Root);
