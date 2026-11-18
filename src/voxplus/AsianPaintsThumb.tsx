// asianpaintsq2 thumbnails (Vox look: cream paper, yellow highlighter, black ink, red marker). Three options, 1920 x 1080. No logos, no real photos:
// the paint tin is drawn in code, plain and unbranded.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Finish, InkSurface, PaperSurface} from "./Texture";
import {useVoxFonts} from "./fonts";
import {C, F} from "./tokens";
import {CoinGrid} from "./AsianPaintsKit";
import {PaintTin} from "./AsianPaintsProps";

const BigQ: React.FC<{text: string; x: number; y: number; size: number; color?: string; mark?: boolean; rot?: number}> = ({text, x, y, size, color = C.ink, mark, rot = -3}) => (
  <div style={{position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, fontFamily: F.sans, fontWeight: 900, fontSize: size, lineHeight: 1, color, whiteSpace: "nowrap", letterSpacing: -2}}>
    <span style={mark ? {background: C.highlight, padding: "0 24px", boxShadow: "8px 10px 0 rgba(0,0,0,0.15)"} : undefined}>{text}</span>
  </div>
);
const Tag: React.FC<{text: string; x: number; y: number; size?: number; bg?: string; rot?: number}> = ({text, x, y, size = 70, bg = C.ink, rot = -2}) => (
  <div style={{position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, background: bg, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: size,
    letterSpacing: 3, padding: "12px 28px", whiteSpace: "nowrap", boxShadow: "0 10px 20px rgba(0,0,0,0.25)"}}>{text}</div>
);

// A: the tin with its +6.4% VOLUME tag, the ₹100 grid, "THINNER MARGIN. WHY?"
export const AsianPaintsThumbA: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <PaperSurface tone="cream" texture={0.67}/>
      <PaintTin f={300} at={0} x={430} y={430} s={1.05} tag="+6.4% VOLUME" tagAt={-200} enter={false}/>
      <CoinGrid f={300} at={-100} ink={40.3} inkAt={-200} red={3.4} redAt={-200} x={1420} y={400} cell={62} instant/>
      <Tag text="₹43.70 → ₹40.30 LEFT" x={1050} y={730} size={56} bg={C.markerRed} rot={-2}/>
      <BigQ text="THINNER MARGIN. WHY?" x={80} y={880} size={130} mark rot={-2}/>
      <Finish f={0}/>
    </AbsoluteFill>
  );
};
// B: on black, volume up against gross margin down
export const AsianPaintsThumbB: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <InkSurface glow={0.12}/>
      <Tag text="VOLUME" x={170} y={140} size={72} bg="#2E8B57"/>
      <div style={{position: "absolute", left: 140, top: 250, fontFamily: F.serif, fontSize: 290, color: C.highlightPrint, lineHeight: 1, whiteSpace: "nowrap", transform: "rotate(-3deg)"}}>+6.4%</div>
      <Tag text="GROSS MARGIN" x={830} y={560} size={72} bg={C.markerRed} rot={2}/>
      <div style={{position: "absolute", left: 780, top: 670, fontFamily: F.sans, fontWeight: 900, fontSize: 200, color: "#FF8FA8", lineHeight: 1, whiteSpace: "nowrap", transform: "rotate(2deg)"}}>−339 bps</div>
      <div style={{position: "absolute", left: 120, top: 965, fontFamily: F.mono, fontSize: 32, color: "#CFC9BE", letterSpacing: 3}}>ASIAN PAINTS · JUL–SEP 2026 · DECOR VOLUME · STANDALONE MARGIN</div>
      <Finish f={0} dark/>
    </AbsoluteFill>
  );
};
// C: kraft paper, the tin with its volume tag, "SOLD MORE. THINNER MARGIN. WHY?"
export const AsianPaintsThumbC: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <PaperSurface tone="kraft" texture={0.67}/>
      <PaintTin f={300} at={0} x={1320} y={470} s={1.1} tag="+6.4% VOLUME" tagAt={-200} enter={false}/>
      <BigQ text="SOLD MORE." x={110} y={250} size={130} rot={-2}/>
      <BigQ text="THINNER MARGIN." x={110} y={430} size={110} rot={-2}/>
      <BigQ text="WHY?" x={110} y={620} size={190} mark rot={-2}/>
      <Finish f={0}/>
    </AbsoluteFill>
  );
};
