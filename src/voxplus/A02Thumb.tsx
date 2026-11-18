// A02 thumbnails (flat, code-drawn castle with five gates; at most four big words). 1920 x 1080.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Finish, InkSurface, PaperSurface} from "./Texture";
import {useVoxFonts} from "./fonts";
import {C, F} from "./tokens";
import {CastleRow} from "./A02Props";

const NOW = -999;
const T: React.FC<{text: string; x: number; y: number; size: number; color?: string; mark?: boolean; rot?: number; bg?: string}> = ({text, x, y, size, color = C.ink, mark, rot = -2, bg}) => (
  <div style={{position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, fontFamily: F.sans, fontWeight: 900, fontSize: size, lineHeight: 1, color, whiteSpace: "nowrap", letterSpacing: -2,
    background: bg, padding: bg ? "10px 28px" : undefined}}>
    <span style={mark ? {background: C.highlight, padding: "0 24px", boxShadow: "8px 10px 0 rgba(0,0,0,0.15)"} : undefined}>{text}</span>
  </div>);
const Castle: React.FC<{y?: number}> = ({y = 60}) => <CastleRow f={300} at={-100} names={NOW} lit={[NOW, NOW, NOW, NOW, NOW]} y={y} num={false}/>;

export const A02ThumbA: React.FC = () => { useVoxFonts(); return (
  <AbsoluteFill style={{background: "#FFE81A"}}>
    <T text="5 GATES" x={80} y={50} size={165} rot={-2}/>
    <T text="5 COMPANIES" x={860} y={80} size={108} color={C.white} bg={C.ink} rot={2}/>
    <Castle y={70}/>
    <Finish f={0}/>
  </AbsoluteFill>); };
export const A02ThumbB: React.FC = () => { useVoxFonts(); return (
  <AbsoluteFill>
    <InkSurface glow={0.12}/>
    <div style={{position: "absolute", left: 90, top: -20, fontFamily: F.serif, fontSize: 330, color: C.highlightPrint, lineHeight: 1}}>5</div>
    <T text="WAYS TO KEEP" x={380} y={30} size={104} color={C.white}/>
    <T text="RIVALS OUT" x={380} y={135} size={104} color={C.highlightPrint}/>
    <Castle y={90}/>
    <Finish f={0} dark/>
  </AbsoluteFill>); };
export const A02ThumbC: React.FC = () => { useVoxFonts(); return (
  <AbsoluteFill>
    <PaperSurface tone="cream" texture={0.67}/>
    <T text="WHO HOLDS" x={90} y={60} size={100} rot={-2}/>
    <T text="THE HINGE?" x={800} y={70} size={130} mark rot={-2}/>
    <Castle y={90}/>
    <Finish f={0}/>
  </AbsoluteFill>); };
