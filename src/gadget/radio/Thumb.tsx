// Thumbnails for No. 001 The Radio (25 Oct 2026). Double barrel with the title ("A teacher rang a bell through two walls.
// In 1895"): the thumbnail says NO WIRE over the classroom scene, the bell ringing through the walls, Bose's face.
// Vertical 1080x1920 (Shorts cover) and horizontal 1280x720. Render: npx remotion still src/gadget/brand_index.ts ID-radio-thumbV ...
import React from "react";
import {AbsoluteFill, Img, staticFile} from "remotion";
import {C, HEAD, MONO, Paper, useGKFonts} from "../kit";
import {Classroom} from "./art2";

const Face: React.FC<{x: number; y: number; d: number}> = ({x, y, d}) => (
  <div style={{position: "absolute", left: x, top: y, width: d, height: d, borderRadius: d, overflow: "hidden", border: `10px solid ${C.white}`, boxShadow: "0 18px 40px rgba(40,30,20,0.3)"}}>
    <Img src={staticFile("gadget/radio/bose_geddes1920.jpg")} style={{width: "130%", marginLeft: "-15%", marginTop: "-8%", filter: "sepia(0.3) contrast(1.1)"}}/>
  </div>
);
const Pill: React.FC<{x: number; y: number; size: number; text: string; accent?: boolean}> = ({x, y, size, text, accent}) => (
  <div style={{position: "absolute", left: x, top: y, background: accent ? C.accent : C.ink, color: C.white, fontFamily: MONO, fontWeight: 600, fontSize: size, letterSpacing: 3, padding: `${size * 0.35}px ${size * 0.8}px`, borderRadius: 999, whiteSpace: "nowrap"}}>{text}</div>
);

/** vertical Shorts cover */
export const RadioThumbV: React.FC = () => {
  useGKFonts();
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <Paper/>
      <div style={{position: "absolute", left: 70, top: 210, fontFamily: HEAD, fontSize: 300, lineHeight: 0.88, letterSpacing: -10, color: C.ink}}>
        NO<br/><span style={{color: C.accent}}>WIRE.</span>
      </div>
      <Pill x={78} y={790} size={44} text="1895 · CALCUTTA"/>
      <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "540px 1160px", transform: "translate(0px, 110px) scale(1.12)"}}>
        <Classroom p={1} t={1.35} ring={1} burst={0} wallHi={1}/>
      </div>
      <Pill x={300} y={1690} size={40} text="THROUGH 2 WALLS" accent/>
      <Face x={790} y={735} d={210}/>
    </AbsoluteFill>
  );
};

/** horizontal 1280x720 */
export const RadioThumbH: React.FC = () => {
  useGKFonts();
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <Paper/>
      <div style={{position: "absolute", left: -120, top: -560, width: 1080, height: 1920, transformOrigin: "0 0", transform: "scale(0.86)"}}>
        <Classroom p={1} t={1.35} ring={1} burst={0} wallHi={1}/>
      </div>
      <div style={{position: "absolute", left: 760, top: 70, fontFamily: HEAD, fontSize: 170, lineHeight: 0.88, letterSpacing: -6, color: C.ink}}>
        NO<br/><span style={{color: C.accent}}>WIRE.</span>
      </div>
      <Pill x={768} y={420} size={30} text="1895 · CALCUTTA"/>
      <Pill x={768} y={490} size={30} text="THROUGH 2 WALLS" accent/>
      <Face x={1010} y={560} d={150}/>
    </AbsoluteFill>
  );
};
