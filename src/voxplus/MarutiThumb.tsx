// marutiq2 thumbnails (Vox look: cream paper, yellow highlighter, black ink, red marker). Three options, 1920 x 1080. No logos, no real photos.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Finish, InkSurface, PaperSurface} from "./Texture";
import {useVoxFonts} from "./fonts";
import {C, F} from "./tokens";
import {XI} from "./MarutiPieces";
import {CoinGrid, TallyCard} from "./MarutiKit";

const BigQ: React.FC<{text: string; x: number; y: number; size: number; color?: string; mark?: boolean; rot?: number}> = ({text, x, y, size, color = C.ink, mark, rot = -3}) => (
  <div style={{position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, fontFamily: F.sans, fontWeight: 900, fontSize: size, lineHeight: 1, color, whiteSpace: "nowrap", letterSpacing: -2}}>
    <span style={mark ? {background: C.highlight, padding: "0 24px", boxShadow: "8px 10px 0 rgba(0,0,0,0.15)"} : undefined}>{text}</span>
  </div>
);
const Tag: React.FC<{text: string; x: number; y: number; size?: number; bg?: string; rot?: number}> = ({text, x, y, size = 70, bg = C.ink, rot = -2}) => (
  <div style={{position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, background: bg, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: size,
    letterSpacing: 3, padding: "12px 28px", whiteSpace: "nowrap", boxShadow: "0 10px 20px rgba(0,0,0,0.25)"}}>{text}</div>
);

// A: the RECORD tally card (696,654) and the question
export const MarutiThumbA: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <PaperSurface tone="cream" texture={0.67}/>
      <TallyCard f={300} at={0} x={620} y={-30} to={696654} countAt={-100} stampAt={-100} s={0.82} rot={-3}/>
      <BigQ text="₹5,085 CR" x={1230} y={160} size={110} color={C.ink} rot={-2}/>
      <div style={{position: "absolute", left: 1330, top: 290, fontFamily: F.sans, fontWeight: 900, fontSize: 130, color: C.markerRed, transform: "rotate(8deg)"}}>↓</div>
      <BigQ text="₹4,763 CR" x={1230} y={440} size={110} color={C.markerRed} rot={-2}/>
      <div style={{position: "absolute", left: 1235, top: 575, fontFamily: F.mono, fontSize: 28, letterSpacing: 3, color: C.inkSoft}}>OPERATING EBITDA · JUL–SEP</div>
      <BigQ text="WHY LESS PROFIT?" x={80} y={830} size={165} mark rot={-2}/>
      <Finish f={0}/>
    </AbsoluteFill>
  );
};
// B: on black, record volume against the fall in profit after tax
export const MarutiThumbB: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <InkSurface glow={0.12}/>
      <Tag text="VEHICLES SOLD" x={170} y={140} size={72}/>
      <div style={{position: "absolute", left: 130, top: 250, fontFamily: F.serif, fontSize: 300, color: C.highlightPrint, lineHeight: 1, whiteSpace: "nowrap", transform: "rotate(-3deg)"}}>696,654</div>
      <Tag text="PROFIT AFTER TAX" x={900} y={560} size={72} bg={C.markerRed} rot={2}/>
      <div style={{position: "absolute", left: 860, top: 670, fontFamily: F.sans, fontWeight: 900, fontSize: 230, color: "#FF8FA8", lineHeight: 1, whiteSpace: "nowrap", transform: "rotate(2deg)"}}>−26.9%</div>
      <div style={{position: "absolute", left: 120, top: 965, fontFamily: F.mono, fontSize: 32, color: "#CFC9BE", letterSpacing: 3}}>MARUTI SUZUKI INDIA · JUL–SEP 2026 · STANDALONE</div>
      <Finish f={0} dark/>
    </AbsoluteFill>
  );
};
// C: the ₹100 coin grid with the 4.2 red coins, and the question
export const MarutiThumbC: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <PaperSurface tone="kraft" texture={0.67}/>
      <CoinGrid f={300} at={-100} ink={75.7} inkAt={-200} red={4.2} redAt={-200} x={470} y={520} cell={74} instant/>
      <div style={{position: "absolute", left: 960, top: 180}}><XI name="car" size={240}/></div>
      <Tag text="OF EVERY ₹100 OF SALES" x={960} y={450} size={54} rot={-2}/>
      <BigQ text="WHERE DID IT GO?" x={900} y={600} size={104} mark rot={-2}/>
      <Finish f={0}/>
    </AbsoluteFill>
  );
};
