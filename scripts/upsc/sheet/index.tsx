// Contact sheet of stills (dev tool): 5 x 3 grid of public/upsc_sheet/sNN.png, starting at inputProps.start.
import React from "react";
import {AbsoluteFill, Composition, Img, registerRoot, staticFile} from "remotion";
const Sheet: React.FC<{start: number; n: number}> = ({start, n}) => (
  <AbsoluteFill style={{background: "#222", display: "flex", flexWrap: "wrap", gap: 6, padding: 6}}>
    {Array.from({length: n}, (_, i) => start + i).map((k) => (
      <div key={k} style={{position: "relative", width: 474, height: 266}}>
        <Img src={staticFile(`upsc_sheet/s${String(k).padStart(2, "0")}.png`)} style={{width: 474, height: 266}}/>
        <div style={{position: "absolute", left: 4, top: 2, color: "#ff0", font: "bold 22px sans-serif", textShadow: "0 0 4px #000"}}>{`${k}`}</div>
      </div>))}
  </AbsoluteFill>);
const Root: React.FC = () => <Composition id="SHEET" component={Sheet} defaultProps={{start: 1, n: 15}} width={2430} height={830} fps={30} durationInFrames={1}/>;
registerRoot(Root);
