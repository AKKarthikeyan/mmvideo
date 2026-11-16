// Dev harness: render one illustrated scene from props, without a video script or audio.
//   npx remotion still <bundle> ILLUS-dev out.png --props=props.json --frame=120
// props.json: {"scene": {...}, "say": "narration the `at` phrases are found in", "sec": 9}
import React from "react";
import {AbsoluteFill, staticFile} from "remotion";
import {C, COND, VoxFonts} from "../../voxkit";
import {Beat, H, IStage, Icon, ICONS, SP, W, makeT, FPS, Chip, Arrow, Num} from "./kit";
import {ILLUS} from "./index";
import {DharmaFonts} from "./Dharma";

const KitDemo: React.FC<SP> = ({n}) => (
  <IStage n={n}>
    {Object.keys(ICONS).map((k, i) => <g key={k}><Icon name={k} x={200 + i * 215} y={330} size={170}/>
      <text x={200 + i * 215} y={470} fontFamily={COND} fontWeight={700} fontSize={34} textAnchor="middle" fill={C.ink}>{k}</text></g>)}
    <Chip x={500} y={640} start={0} text="CHIP LABEL"/><Chip x={1000} y={640} start={0} text="RED CHIP" fill={C.red} color={C.white}/>
    <Arrow x1={300} y1={800} x2={900} y2={800} start={0}/><Num x={1400} y={840} start={0} to={2629} prefix="₹" suffix=" CR"/>
  </IStage>
);
export const IllusDev: React.FC<{scene: any; say: string; sec: number; guides?: boolean}> = ({scene, say, sec, guides = true}) => {
  const b: Beat = {ch: 1, key: "dev", say, cap: say, sec, cues: [say], scene};
  const n = Math.ceil((sec + 0.5) * FPS);
  const Scene = scene.type === "kitdemo" ? KitDemo : ILLUS[scene.type];
  return (
    <AbsoluteFill style={{background: C.tan}}>
      <VoxFonts/><DharmaFonts/><style>{`@font-face{font-family:Virgil;src:url(${staticFile("fonts/Virgil-Regular.woff2")}) format("woff2");}`}</style>
      {Scene ? <AbsoluteFill><Scene s={scene} n={n} T={makeT(b)} b={b} D={{id: "dev"}}/></AbsoluteFill>
        : <div style={{font: "60px sans-serif", padding: 80}}>no such scene type: {String(scene.type)}</div>}
      {/* guides: furniture above y=110, captions below y=925 */}
      {guides ? <svg width={W} height={H} style={{position: "absolute"}}><rect x={0} y={0} width={W} height={110} fill="#0a0" opacity={0.10}/><rect x={0} y={925} width={W} height={155} fill="#0a0" opacity={0.10}/></svg> : null}
    </AbsoluteFill>
  );
};
// One kit icon on a transparent ground, for export to the illustration library (512 x 512).
export const IllusIcon: React.FC<{name: string}> = ({name}) => (
  <AbsoluteFill><VoxFonts/><svg width={512} height={512} viewBox="0 0 512 512"><Icon name={name} x={256} y={256} size={400}/></svg></AbsoluteFill>
);
