// tatamotorsq2 thumbnails (Vox look: cream paper, yellow highlighter, black ink, red marker). Three options, 1920 x 1080. No logos.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Finish, InkSurface, PaperSurface} from "./Texture";
import {useVoxFonts} from "./fonts";
import {C, F} from "./tokens";
import {XI} from "./TataMotorsPieces";
import {PriceTag} from "./TataMotorsKit";

const BigQ: React.FC<{text: string; x: number; y: number; size: number; color?: string; mark?: boolean; rot?: number}> = ({text, x, y, size, color = C.ink, mark, rot = -3}) => (
  <div style={{position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, fontFamily: F.sans, fontWeight: 900, fontSize: size, lineHeight: 1, color, whiteSpace: "nowrap", letterSpacing: -2}}>
    <span style={mark ? {background: C.highlight, padding: "0 24px", boxShadow: "8px 10px 0 rgba(0,0,0,0.15)"} : undefined}>{text}</span>
  </div>
);
const Tag: React.FC<{text: string; x: number; y: number; size?: number; bg?: string; rot?: number}> = ({text, x, y, size = 70, bg = C.ink, rot = -2}) => (
  <div style={{position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, background: bg, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: size,
    letterSpacing: 3, padding: "12px 28px", whiteSpace: "nowrap", boxShadow: "0 10px 20px rgba(0,0,0,0.25)"}}>{text}</div>
);

// A: the €14.10 tag struck through, €14.40 written under it: "+30 CENTS?"
export const TataMotorsThumbA: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <PaperSurface tone="cream" texture={0.67}/>
      <PriceTag f={300} at={0} x={560} y={60} text="€14.10" size={170} swing={0} dim={0.5}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}><line x1={300} y1={330} x2={830} y2={290} stroke={C.markerRed} strokeWidth={26} strokeLinecap="round"/></svg>
      <div style={{position: "absolute", left: 1000, top: 170, transform: "rotate(-4deg)", fontFamily: F.marker, fontSize: 250, color: C.markerRed, lineHeight: 1}}>€14.40</div>
      <div style={{position: "absolute", left: 1280, top: 460}}><XI name="truck" size={300}/></div>
      <BigQ text="+30 CENTS?" x={90} y={760} size={210} mark rot={-2}/>
      <Finish f={0}/>
    </AbsoluteFill>
  );
};
// B: on black, +42% vehicles against ₹11.70 kept per ₹100 (company's EBITDA measure)
export const TataMotorsThumbB: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <InkSurface glow={0.12}/>
      <Tag text="VEHICLES WHOLESALED" x={170} y={160} size={76}/>
      <div style={{position: "absolute", left: 140, top: 270, fontFamily: F.sans, fontWeight: 900, fontSize: 280, color: C.highlightPrint, lineHeight: 1, whiteSpace: "nowrap", transform: "rotate(-3deg)"}}>+42%</div>
      <Tag text="KEPT PER ₹100" x={1000} y={540} size={76} bg={C.markerRed} rot={2}/>
      <div style={{position: "absolute", left: 900, top: 650, fontFamily: F.sans, fontWeight: 900, fontSize: 220, color: "#FF8FA8", lineHeight: 1, whiteSpace: "nowrap", transform: "rotate(2deg)"}}>₹11.70</div>
      <div style={{position: "absolute", left: 120, top: 965, fontFamily: F.mono, fontSize: 32, color: "#CFC9BE", letterSpacing: 3}}>TATA MOTORS · JUL–SEP 2026 · EBITDA, COMPANY'S MEASURE · WAS ₹12.60</div>
      <Finish f={0} dark/>
    </AbsoluteFill>
  );
};
// C: the rupee bill tag and a question: how is it paid?
export const TataMotorsThumbC: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <PaperSurface tone="kraft" texture={0.67}/>
      <PriceTag f={300} at={0} x={960} y={40} text="₹42,561 CR" size={190} swing={0}/>
      <Tag text="IVECO OFFER, MAXIMUM" x={560} y={580} size={58} rot={-2}/>
      <BigQ text="HOW PAID?" x={330} y={720} size={230} mark rot={-2}/>
      <Finish f={0}/>
    </AbsoluteFill>
  );
};
