// swiggyq2 thumbnails (Vox look: cream paper, yellow highlighter, black ink, red marker). Three options, 1920 x 1080.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Finish, InkSurface, PaperSurface} from "./Texture";
import {useVoxFonts} from "./fonts";
import {C, F} from "./tokens";
import {Receipt} from "./SwiggyPieces";
import {PriceTag} from "./SwiggyKit";

const BigQ: React.FC<{text: string; x: number; y: number; size: number; color?: string; mark?: boolean; rot?: number}> = ({text, x, y, size, color = C.ink, mark, rot = -3}) => (
  <div style={{position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, fontFamily: F.sans, fontWeight: 900, fontSize: size, lineHeight: 1, color, whiteSpace: "nowrap", letterSpacing: -2}}>
    <span style={mark ? {background: C.highlight, padding: "0 24px", boxShadow: "8px 10px 0 rgba(0,0,0,0.15)"} : undefined}>{text}</span>
  </div>
);
const Tag: React.FC<{text: string; x: number; y: number; size?: number; bg?: string; rot?: number}> = ({text, x, y, size = 70, bg = C.ink, rot = -2}) => (
  <div style={{position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, background: bg, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: size,
    letterSpacing: 3, padding: "12px 28px", whiteSpace: "nowrap", boxShadow: "0 10px 20px rgba(0,0,0,0.25)"}}>{text}</div>
);

// A: the ₹9 tag with a red "?" and a torn receipt line "INSTAMART LOSS ₹895 CR" (adjusted EBITDA)
export const SwiggyThumbA: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <PaperSurface tone="cream" texture={0.67}/>
      <PriceTag f={300} at={0} x={520} y={120} text="₹9 STORE" size={190} swing={0} q={0}/>
      <div style={{position: "absolute", left: 0, top: 0, transform: "scale(1.05)", transformOrigin: "1400px 0"}}>
        <Receipt f={300} x={1400} y={500} w={900} head="INSTAMART · JUL–SEP" lines={[{l: "ADJ. EBITDA (COMPANY'S MEASURE)", r: "", at: 0}, {l: "", r: "–₹895 CR", at: 0, big: true, red: true}]} rot={4} circleAt={0}/>
      </div>
      <BigQ text="₹9 STORE?" x={90} y={760} size={190} mark rot={-2}/>
      <Finish f={0}/>
    </AbsoluteFill>
  );
};
// B: on black, +₹341 (food) against –₹895 (Instamart), both adjusted EBITDA
export const SwiggyThumbB: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <InkSurface glow={0.12}/>
      <Tag text="FOOD" x={170} y={180} size={80}/>
      <div style={{position: "absolute", left: 140, top: 300, fontFamily: F.sans, fontWeight: 900, fontSize: 230, color: C.highlightPrint, lineHeight: 1, whiteSpace: "nowrap", transform: "rotate(-3deg)"}}>+₹341 CR</div>
      <Tag text="INSTAMART" x={980} y={560} size={80} bg={C.markerRed} rot={2}/>
      <div style={{position: "absolute", left: 640, top: 680, fontFamily: F.sans, fontWeight: 900, fontSize: 230, color: "#FF8FA8", lineHeight: 1, whiteSpace: "nowrap", transform: "rotate(2deg)"}}>–₹895 CR</div>
      <div style={{position: "absolute", left: 120, top: 960, fontFamily: F.mono, fontSize: 34, color: "#CFC9BE", letterSpacing: 3}}>SAME COMPANY · ADJ. EBITDA · JUL–SEP 2026</div>
      <Finish f={0} dark/>
    </AbsoluteFill>
  );
};
// C: two tags, –₹7 today and +₹30 needed, an arrow between: "₹30 AN ORDER?"
export const SwiggyThumbC: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <PaperSurface tone="kraft" texture={0.67}/>
      <PriceTag f={300} at={0} x={480} y={330} text="–₹7" size={200} swing={0} bg={C.markerRed} color={C.white}/>
      <PriceTag f={300} at={0} x={1400} y={330} text="+₹30" size={200} swing={0}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <path d="M 760 640 Q 940 470 1120 640" fill="none" stroke={C.ink} strokeWidth={16}/>
        <path d="M 1080 600 L 1124 645 L 1068 668" fill="none" stroke={C.ink} strokeWidth={16}/>
      </svg>
      <BigQ text="₹30 AN ORDER?" x={150} y={90} size={170} mark rot={-2}/>
      <Tag text="INSTAMART" x={760} y={880} size={64} rot={2}/>
      <Finish f={0}/>
    </AbsoluteFill>
  );
};
