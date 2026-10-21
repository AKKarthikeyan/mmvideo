// Compositions for the Katha (story-film) look. KATHA-dev renders one scene from props, for stills and checks:
//   npx remotion still <bundle> KATHA-dev out.png --props='{"scene":{"type":"chariot","pose":"teach"},"sec":8}' --frame=120
import React from "react";
import {AbsoluteFill, Composition} from "remotion";
import {KathaFonts, K, FPS} from "./look";
import {KATHA_SCENES} from "./scenes";

export const KathaDev: React.FC<{scene: any; sec: number}> = ({scene, sec}) => {
  const S = KATHA_SCENES[scene.type];
  const n = Math.ceil(sec * FPS);
  return <AbsoluteFill style={{background: K.night}}><KathaFonts/>{S ? <S s={scene} n={n}/> : <div style={{color: "#fff", font: "60px serif", padding: 80}}>no scene {String(scene.type)}</div>}</AbsoluteFill>;
};
export const KathaCompositions: React.FC = () => (
  <>
    <Composition id="KATHA-dev" component={KathaDev as any} defaultProps={{scene: {type: "chariot", pose: "teach"}, sec: 8}} durationInFrames={900} fps={FPS} width={1920} height={1080}/>
  </>
);
