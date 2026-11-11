// Entry for the UPSC concept films made after ECO-16 (render: npx remotion render src/looks/upsc_rich_b/films_index.tsx LONG-<id>-B60 <out.mp4>).
// A separate entry keeps the shared LongCompositions.tsx untouched. Player: RichLong (look B).
import React from "react";
import {Composition, registerRoot} from "remotion";
import type {Timeline} from "../cartoon/long/contract";
import {RichLong} from "./RichLong";
import geo04p1 from "../../../public/datayt/long/upsc/geo04-p1/timeline.json";
import pol03p1 from "../../../public/datayt/long/upsc/pol03-p1/timeline.json";
import pol03p2 from "../../../public/datayt/long/upsc/pol03-p2/timeline.json";

const FILMS: [string, any][] = [["geo04-p1", geo04p1], ["pol03-p1", pol03p1], ["pol03-p2", pol03p2]];
const Root: React.FC = () => <>{FILMS.map(([id, t]) => <React.Fragment key={id}>
  <Composition id={`LONG-${id}-B`} component={RichLong as any} defaultProps={{timeline: t as Timeline, draft: true}} durationInFrames={Math.max(30, t.total)} fps={30} width={1920} height={1080}/>
  <Composition id={`LONG-${id}-B60`} component={RichLong as any} defaultProps={{timeline: t as Timeline, draft: true, fps: 60}} durationInFrames={Math.max(60, t.total * 2)} fps={60} width={1920} height={1080}/>
</React.Fragment>)}</>;
registerRoot(Root);
