// A01 v4 thumbnails (18 Oct 2026): Vox paper/collage look, the loom photo and the $26 tag, at most 4 big words.
// Rendered as stills at 1920x1080 (scale 2/3 -> 1280x720). Three variants: v=1 "$26?", v=2 "WHY $26?", v=3 "WHAT IS A MOAT?".
import React from "react";
import {AbsoluteFill} from "remotion";
import {PhotoPrint, Sticker, TornBlock} from "./Collage";
import {Finish} from "./Texture";
import {useVoxFonts} from "./fonts";
import {C, F} from "./tokens";
import {Paper} from "./A01V4Parts";

const Tag: React.FC<{x: number; y: number; text: string; w?: number; rot?: number; cross?: boolean; red?: boolean}> = ({x, y, text, w = 640, rot = 6, cross, red}) => {
  const h = w * 0.58;
  return (
    <div style={{position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.4))"}}>
      <div style={{position: "absolute", left: w / 2 - 3, top: -260, width: 6, height: 280, background: "linear-gradient(90deg,#8A7A60,#C8B994,#8A7A60)"}}/>
      <div style={{position: "absolute", inset: 0, clipPath: "polygon(16% 0, 84% 0, 100% 22%, 100% 100%, 0 100%, 0 22%)", background: "linear-gradient(160deg, #F2DDA8, #E7CB89 60%, #DDBE77)"}}/>
      <div style={{position: "absolute", left: w / 2 - 26, top: 14, width: 52, height: 52, borderRadius: "50%", background: "#C9A85E", boxShadow: "inset 0 3px 4px rgba(0,0,0,0.35)"}}/>
      <div style={{position: "absolute", left: 0, right: 0, top: h * 0.2, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.serif,
        fontSize: Math.min(w * 0.42, (w * 1.3) / text.length), color: red ? C.markerRed : "#2A1C0E", letterSpacing: -4}}>{text}</div>
      {cross ? <svg width={w} height={h} style={{position: "absolute", left: 0, top: 0}}><path d={`M ${w * 0.12} ${h * 0.8} L ${w * 0.9} ${h * 0.35}`} stroke={C.markerRed} strokeWidth={w * 0.05} strokeLinecap="round"/></svg> : null}
    </div>
  );
};

export const A01V4Thumb: React.FC<{v?: number}> = ({v = 1}) => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <Paper/>
      {v === 2 ? <TornBlock f={0} x={1500} y={600} w={760} h={820} rot={4} color={C.wallBlue} enter={{at: 0, mode: "none"}}/> : null}
      <PhotoPrint f={0} src="media/loom_draper_1987.jpg" x={v === 3 ? 1260 : 640} y={v === 3 ? 690 : 560} w={v === 3 ? 1060 : 1140} h={v === 3 ? 700 : 820} rot={v === 3 ? 3 : -4} halftone={0.12}
        enter={{at: 0, mode: "none"}}/>
      {v === 1 ? <>
        <Tag x={1520} y={360} text="$5,000" w={420} rot={-8} cross/>
        <Tag x={1400} y={720} text="$26" w={720} rot={7}/>
        <div style={{position: "absolute", left: 1660, top: 470, fontFamily: F.marker, fontSize: 380, color: C.markerRed, transform: "rotate(10deg)", textShadow: "0 8px 0 rgba(255,255,255,0.9)"}}>?</div>
      </> : null}
      {v === 2 ? <>
        <Sticker f={0} src="media/candy_box_sticker.png" x={1500} y={820} w={700} h={243} rot={-6} enter={{at: 0, mode: "none"}}/>
        <Tag x={1080} y={600} text="$5,000" w={560} rot={8} cross/>
        <div style={{position: "absolute", left: 60, top: 40, padding: "6px 40px 16px", background: C.ink, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: 210,
          letterSpacing: 2, transform: "rotate(-2deg)", boxShadow: "0 18px 30px rgba(0,0,0,0.35)"}}>WHY <span style={{color: C.highlightPrint}}>$26?</span></div>
      </> : null}
      {v === 3 ? <>
        <Tag x={520} y={800} text="$26" w={600} rot={-6}/>
        <div style={{position: "absolute", left: 70, top: 90, fontFamily: F.serif, fontSize: 200, lineHeight: 1.0, color: C.ink, letterSpacing: -4}}>
          What is a<br/><span style={{background: C.highlight, padding: "0 20px"}}>moat?</span></div>
      </> : null}
      <Finish f={0} grain={0.04}/>
    </AbsoluteFill>
  );
};
