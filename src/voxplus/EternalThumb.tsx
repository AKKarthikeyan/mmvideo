// eternalq2 thumbnails (Vox look: cream paper, yellow highlighter, black ink, red marker). Three options, 1920 x 1080.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Finish, InkSurface, PaperSurface} from "./Texture";
import {useVoxFonts} from "./fonts";
import {C, F} from "./tokens";
import {Cursor, Disc, Receipt, SLIP, XI} from "./EternalPieces";

const BigQ: React.FC<{text: string; x: number; y: number; size: number; color?: string; mark?: boolean; rot?: number}> = ({text, x, y, size, color = C.ink, mark, rot = -3}) => (
  <div style={{position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, fontFamily: F.serif, fontSize: size, lineHeight: 1, color, whiteSpace: "nowrap"}}>
    <span style={mark ? {background: C.highlight, padding: "0 24px", boxShadow: "8px 10px 0 rgba(0,0,0,0.15)"} : undefined}>{text}</span>
  </div>
);
const Tag: React.FC<{text: string; x: number; y: number; size?: number; bg?: string; rot?: number}> = ({text, x, y, size = 70, bg = C.ink, rot = -2}) => (
  <div style={{position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, background: bg, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: size,
    letterSpacing: 3, padding: "12px 28px", whiteSpace: "nowrap", boxShadow: "0 10px 20px rgba(0,0,0,0.25)"}}>{text}</div>
);

// A: the receipt, last line circled, a black cursor reaching for it; "90 PAISE?"
export const EternalThumbA: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <PaperSurface tone="cream" texture={0.67}/>
      <div style={{position: "absolute", left: 0, top: 0, transform: "scale(1.25)", transformOrigin: "640px 0"}}>
        <Receipt f={100} x={520} y={60} lines={SLIP(0, 0, 0)} circleAt={0} rot={-4} head="ORDER SLIP"/>
      </div>
      <BigQ text="90 PAISE?" x={960} y={260} size={190} mark/>
      <Cursor f={100} x={1310} y={620} s={1.9} rot={-30} at={0}/>
      <Tag text="BLINKIT" x={1060} y={600} size={64}/>
      <Finish f={0}/>
    </AbsoluteFill>
  );
};
// B: on black, ₹0.90 huge in yellow over a faint ₹100, "OF ₹100" tag
export const EternalThumbB: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <InkSurface glow={0.12}/>
      <div style={{position: "absolute", left: 120, top: 120, fontFamily: F.serif, fontSize: 420, color: "rgba(255,255,255,0.08)", lineHeight: 1}}>
        <span style={{fontFamily: F.sans, fontWeight: 700, fontSize: 340}}>₹</span>100</div>
      <div style={{position: "absolute", left: 180, top: 300, lineHeight: 1, color: C.highlightPrint, transform: "rotate(-3deg)"}}>
        <span style={{fontFamily: F.sans, fontWeight: 800, fontSize: 300}}>₹</span><span style={{fontFamily: F.serif, fontSize: 400}}>0.90</span></div>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <ellipse cx={720} cy={520} rx={600} ry={250} fill="none" stroke={C.markerRed} strokeWidth={16} transform="rotate(-4 720 520)"/>
      </svg>
      <Tag text="WHY IT MATTERS" x={1080} y={820} size={72} bg={C.markerRed} rot={-3}/>
      <Cursor f={100} x={1500} y={300} s={1.7} rot={-20} at={0}/>
      <Finish f={0} dark/>
    </AbsoluteFill>
  );
};
// C: the AI cursor versus the physical chain (store, rider, shelf) with "CAN AI SKIP IT?"
export const EternalThumbC: React.FC = () => {
  useVoxFonts();
  const items: ("store" | "scooter" | "shelf")[] = ["store", "scooter", "shelf"];
  return (
    <AbsoluteFill>
      <PaperSurface tone="kraft" texture={0.67}/>
      {items.map((n, i) => (
        <div key={n} style={{position: "absolute", left: 980 + i * 290, top: 560 + (i % 2) * 60}}>
          <Disc f={100} at={0} name={n} x={0} y={0} size={270}/>
        </div>
      ))}
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <path d="M 1115 590 Q 1190 640 1265 650 M 1405 650 Q 1480 640 1555 590" fill="none" stroke="#B8432F" strokeWidth={9}/>
      </svg>
      <Cursor f={100} x={520} y={440} s={2.6} rot={-14} at={0}/>
      <BigQ text="Can AI skip it?" x={90} y={90} size={190} mark rot={-2}/>
      <Tag text="BLINKIT" x={1230} y={880} size={64} rot={2}/>
      <div style={{position: "absolute", left: 0, top: 0, opacity: 0}}><XI name="store" size={1}/></div>
      <Finish f={0}/>
    </AbsoluteFill>
  );
};
