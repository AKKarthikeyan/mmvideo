// Look comparison sheet (dev tool): row A and row B, three scenes each, from public/upsc_sheet/cmp/c1..c6.png.
import React from "react";
import {AbsoluteFill, Composition, Img, registerRoot, staticFile} from "remotion";
const L = ["A · Kurz look (night, glow)", "B · Rich daylight illustration"];
const Cmp: React.FC = () => (
  <AbsoluteFill style={{background: "#1b1b1b", padding: 16, display: "flex", flexDirection: "column", gap: 16}}>
    {[0, 1].map((r) => (
      <div key={r} style={{display: "flex", flexDirection: "column", gap: 8}}>
        <div style={{color: "#fff", font: "bold 34px sans-serif"}}>{L[r]}</div>
        <div style={{display: "flex", gap: 12}}>{[1, 2, 3].map((c) => <Img key={c} src={staticFile(`upsc_sheet/cmp/c${r * 3 + c}.png`)} style={{width: 960, height: 540}}/>)}</div>
      </div>))}
  </AbsoluteFill>);
registerRoot(() => <Composition id="CMP" component={Cmp} width={2936} height={1230} fps={30} durationInFrames={1}/>);
