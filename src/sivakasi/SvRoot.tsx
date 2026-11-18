import React from "react";
import {Composition} from "remotion";
import {AbsoluteFill} from "remotion";
import {useCurrentFrame} from "remotion";
import {W, H, FPS, Fonts, Finish} from "./kit";
import {SCENES} from "./registry";
import {Film, FILMS} from "./Film";

// test composition: one scene by name
const Test: React.FC<{name: string; dur: number}> = ({name, dur}) => {
  const f = useCurrentFrame(), S = SCENES[name];
  return <AbsoluteFill style={{background: "#000"}}><Fonts />{S && <S f={f} dur={dur} spans={[{key: "a", s: 0, e: dur / 2}, {key: "b", s: dur / 2, e: dur}]} p={{}} />}<Finish f={f} /></AbsoluteFill>;
};
export const SvRoot: React.FC = () => <>
  <Composition id="SV-scene" component={Test as any} width={W} height={H} fps={FPS} durationInFrames={600} defaultProps={{name: "FireSky", dur: 600}} />
  {Object.keys(FILMS).map((k) => <Composition key={k} id={`SV-${k}`} component={Film as any} width={W} height={H} fps={FPS} durationInFrames={FILMS[k].total} defaultProps={{film: k, audio: false}} />)}
</>;
