// Thumbnail still for "Airtel's Moat: Price, Mix or Convergence?" (first pass; AK picks the wording). Render at 1920x1080, save at 1280x720.
// Uses the three suspect cards. No logos, no faces, no price. Words are labels, not claims.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Paper} from "./kit/A01V4Parts";
import {Finish} from "./kit/Texture";
import {useVoxFonts} from "./kit/fonts";
import {C, F} from "./kit/tokens";
import {SuspectCards} from "./devices_airtel";

export const Thumb: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <Paper/>
      <div style={{position: "absolute", left: 90, top: 110, fontFamily: F.sans, fontWeight: 800, fontSize: 64, color: C.teal}}>AIRTEL</div>
      <div style={{position: "absolute", left: 90, top: 200, width: 1740, fontFamily: F.sans, fontWeight: 800, fontSize: 190, lineHeight: 0.98, color: C.ink, letterSpacing: -4}}>WHO RAISED<br/>THE BILL?</div>
      <SuspectCards f={999} at={0} x={960} y={780} w={1740} h={250}/>
      <div style={{position: "absolute", right: 70, bottom: 40, fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: C.ink, letterSpacing: 1}}>MOAT <span style={{color: C.teal}}>&</span> MARGIN</div>
      <Finish f={0}/>
    </AbsoluteFill>
  );
};
