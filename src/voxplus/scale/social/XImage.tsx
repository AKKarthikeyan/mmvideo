// X post image, 1600x900: the five-kinds scorecard with the NARROW MOAT stamp. No figures; nothing under 30 px; 60 px safe margins.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Paper} from "../kit/A01V4Parts";
import {Finish} from "../kit/Texture";
import {useVoxFonts} from "../kit/fonts";
import {C, F} from "../kit/tokens";
import {Brand, Hi, PROOF, Src, Stamp, T, VERDICTS, pillStyle} from "./common";

export const XImage: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill style={{background: C.paper, overflow: "hidden"}}>
      <Paper/>
      <T x={60} y={44} w={1480} size={76} serif ls={-2} lh={1.04}>Jio has India's most subscribers.</T>
      <T x={60} y={150} w={1480} size={76} serif ls={-2} lh={1.04}>Is it the <Hi>best protected?</Hi></T>
      {VERDICTS.map(([k, v, tone], i) => {
        const p = pillStyle(tone);
        return (
          <div key={k} style={{position: "absolute", left: 60, top: 290 + i * 92, width: 1010, height: 80, display: "flex", alignItems: "center", justifyContent: "space-between",
            background: C.white, boxShadow: "0 5px 12px rgba(0,0,0,0.14)", padding: "0 18px 0 22px", borderLeft: `10px solid ${C.ink}`}}>
            <div style={{display: "flex", alignItems: "center", gap: 20}}>
              <span style={{fontFamily: F.mono, fontWeight: 500, fontSize: 36, color: C.grey, width: 30}}>{i + 1}</span>
              <span style={{fontFamily: F.serif, fontSize: 52, color: C.ink, letterSpacing: -0.5}}>{k}</span>
            </div>
            <span style={{background: p.bg, color: p.fg, fontFamily: F.sans, fontWeight: 800, fontSize: 31, letterSpacing: 1, padding: "9px 18px 8px", whiteSpace: "nowrap"}}>{v}</span>
          </div>
        );
      })}
      <T x={1115} y={310} w={410} size={34} weight={800} color={C.inkSoft} ls={4} align="center">OUR VERDICT</T>
      <Stamp f={PROOF} at={0} text="NARROW" x={1320} y={480} size={84} rot={-5}/>
      <Stamp f={PROOF} at={0} text="MOAT" x={1320} y={610} size={84} rot={-5}/>
      <Src text="Jio RHP · TRAI · Airtel AR" left={900} bottom={48} size={30} maxWidth={640}/>
      <Brand x={60} bottom={48} size={40}/>
      <Finish f={0}/>
    </AbsoluteFill>
  );
};
