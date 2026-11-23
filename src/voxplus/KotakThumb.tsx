// kotakq2 thumbnails (Vox look: cream paper, yellow highlighter, black ink, red marker). Three options, 1920 x 1080. No logos.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Finish, InkSurface, PaperSurface} from "./Texture";
import {useVoxFonts} from "./fonts";
import {C, F} from "./tokens";
import {XI} from "./KotakPieces";
import {DepositSlip, NimGauge} from "./KotakKit";
import {PriceTag} from "./KotakKit";

const BigQ: React.FC<{text: string; x: number; y: number; size: number; color?: string; mark?: boolean; rot?: number}> = ({text, x, y, size, color = C.ink, mark, rot = -3}) => (
  <div style={{position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, fontFamily: F.sans, fontWeight: 900, fontSize: size, lineHeight: 1, color, whiteSpace: "nowrap", letterSpacing: -2}}>
    <span style={mark ? {background: C.highlight, padding: "0 24px", boxShadow: "8px 10px 0 rgba(0,0,0,0.15)"} : undefined}>{text}</span>
  </div>
);
const Tag: React.FC<{text: string; x: number; y: number; size?: number; bg?: string; rot?: number}> = ({text, x, y, size = 70, bg = C.ink, rot = -2}) => (
  <div style={{position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, background: bg, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: size,
    letterSpacing: 3, padding: "12px 28px", whiteSpace: "nowrap", boxShadow: "0 10px 20px rgba(0,0,0,0.25)"}}>{text}</div>
);

// A: the deposit slip with the ₹55,344 CR tag, a NIM ruler falling 4.54 -> 4.31, "WHY DID IT FALL?"
export const KotakThumbA: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <PaperSurface tone="cream" texture={0.67}/>
      <DepositSlip f={300} at={0} x={520} y={470} rot={-5} s={0.9} stampAt={0}/>
      <PriceTag f={300} at={0} x={900} y={40} text="₹55,344 CR" size={150} swing={0}/>
      <NimGauge f={300} at={0} from={4.31} to={4.31} moveAt={0} x={1180} y={470} showTo ghosts={[{v: 4.54, label: "BEFORE", at: 0}]} label=""/>
      <BigQ text="WHY DID IT FALL?" x={80} y={800} size={190} mark rot={-2}/>
      <Finish f={0}/>
    </AbsoluteFill>
  );
};
// B: on black, +29% profit against a falling margin
export const KotakThumbB: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <InkSurface glow={0.12}/>
      <Tag text="PROFIT" x={170} y={160} size={76}/>
      <div style={{position: "absolute", left: 140, top: 270, fontFamily: F.sans, fontWeight: 900, fontSize: 290, color: C.highlightPrint, lineHeight: 1, whiteSpace: "nowrap", transform: "rotate(-3deg)"}}>+29%</div>
      <Tag text="MARGIN" x={1000} y={540} size={76} bg={C.markerRed} rot={2}/>
      <div style={{position: "absolute", left: 900, top: 650, fontFamily: F.sans, fontWeight: 900, fontSize: 220, color: "#FF8FA8", lineHeight: 1, whiteSpace: "nowrap", transform: "rotate(2deg)"}}>4.54 → 4.31</div>
      <div style={{position: "absolute", left: 120, top: 965, fontFamily: F.mono, fontSize: 32, color: "#CFC9BE", letterSpacing: 3}}>KOTAK MAHINDRA BANK · JUL–SEP 2026 · STANDALONE</div>
      <Finish f={0} dark/>
    </AbsoluteFill>
  );
};
// C: ₹55,344 CR foreign deposits and the question
export const KotakThumbC: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <PaperSurface tone="kraft" texture={0.67}/>
      <PriceTag f={300} at={0} x={960} y={40} text="₹55,344 CR" size={200} swing={0}/>
      <div style={{position: "absolute", left: 1450, top: 430}}><XI name="globe" size={300}/></div>
      <Tag text="FOREIGN DEPOSITS IN ONE QUARTER" x={150} y={600} size={54} rot={-2}/>
      <BigQ text="WHAT DID IT COST?" x={150} y={730} size={170} mark rot={-2}/>
      <Finish f={0}/>
    </AbsoluteFill>
  );
};
