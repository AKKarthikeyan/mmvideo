// Thumbnails for "Jio's Size Advantage Has a Catch" (20 Oct 2026): three stills in the film's look (Inter 800, off-white,
// charcoal, teal, rust). No logos, no faces, no IPO price. Render at 1920x1080 and save at 1280x720 (scale 2/3).
import React from "react";
import {AbsoluteFill} from "remotion";
import {Paper} from "./kit/A01V4Parts";
import {Finish} from "./kit/Texture";
import {useVoxFonts} from "./kit/fonts";
import {C, F} from "./kit/tokens";
import {RechargePhone} from "./devices";

const Brand: React.FC<{dark?: boolean; right?: boolean}> = ({dark, right}) => (
  <div style={{position: "absolute", ...(right ? {right: 70} : {left: 70}), bottom: 54, fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: dark ? C.white : C.ink, letterSpacing: 1}}>
    MOAT <span style={{color: C.teal}}>&</span> MARGIN</div>
);
const Tag: React.FC<{text: string; x: number; y: number; bg?: string; size?: number; rot?: number}> = ({text, x, y, bg = C.teal, size = 64, rot = -2}) => (
  <div style={{position: "absolute", left: x, top: y, background: bg, color: C.white, fontFamily: F.sans, fontWeight: 800, fontSize: size, padding: "10px 26px",
    transform: `rotate(${rot}deg)`, boxShadow: "0 12px 26px rgba(0,0,0,0.22)", whiteSpace: "nowrap"}}>{text}</div>
);

export const ThumbA: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <Paper/>
      <RechargePhone f={0} x={430} y={560} s={0.86} tapAt={-40} rot={-6}/>
      <Tag text="JIO" x={720} y={150} size={70}/>
      <div style={{position: "absolute", left: 720, top: 280, fontFamily: F.serif, fontWeight: 400, fontSize: 210, lineHeight: 0.95, color: C.ink, letterSpacing: -6}}>BIGGEST</div>
      <div style={{position: "absolute", left: 720, top: 500, fontFamily: F.serif, fontWeight: 400, fontSize: 168, lineHeight: 0.95, color: C.rust, letterSpacing: -5}}>≠ STRONGEST?</div>
      <Brand right/>
      <Finish f={0}/>
    </AbsoluteFill>
  );
};

export const ThumbB: React.FC = () => {
  useVoxFonts();
  const base = 900, k = 3.6;
  const bar = (x: number, v: number, col: string, label: string) => (
    <>
      <div style={{position: "absolute", left: x, top: base - v * k, width: 300, height: v * k, background: col}}/>
      <div style={{position: "absolute", left: x, width: 300, top: base - v * k - 150, textAlign: "center", fontFamily: F.serif, fontWeight: 400, fontSize: 130, color: C.white}}>₹{v}</div>
      <div style={{position: "absolute", left: x, width: 300, top: base + 18, textAlign: "center", fontFamily: F.serif, fontWeight: 400, fontSize: 52, color: C.grey}}>{label}</div>
    </>
  );
  return (
    <AbsoluteFill style={{background: C.ink}}>
      {bar(860, 119, C.teal, "JIO")}
      {bar(1300, 154, "#6B6660", "AIRTEL")}
      <div style={{position: "absolute", left: 80, top: 170, fontFamily: F.serif, fontWeight: 400, fontSize: 150, lineHeight: 0.95, color: C.white, letterSpacing: -4}}>THE<br/>CATCH</div>
      <div style={{position: "absolute", left: 84, top: 480, width: 640, fontFamily: F.sans, fontWeight: 600, fontSize: 46, lineHeight: 1.2, color: C.grey}}>
        EBITDA per customer, per month · FY26 · our calculation</div>
      <Brand dark/>
      <Finish f={0} dark/>
    </AbsoluteFill>
  );
};

export const ThumbC: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <Paper/>
      <Tag text="JIO'S DEBT RATIO" x={90} y={140} size={60} bg={C.ink}/>
      <div style={{position: "absolute", left: 90, top: 330, fontFamily: F.serif, fontWeight: 400, fontSize: 250, color: C.ink, letterSpacing: -8, lineHeight: 1}}>
        0.36× <span style={{color: C.teal}}>→</span> <span style={{color: C.rust}}>1.73×</span></div>
      <div style={{position: "absolute", left: 96, top: 640, fontFamily: F.serif, fontWeight: 400, fontSize: 92, color: C.ink, letterSpacing: -2}}>
        ONE <span style={{background: C.highlight, padding: "0 16px"}}>FOOTNOTE</span></div>
      <Brand/>
      <Finish f={0}/>
    </AbsoluteFill>
  );
};
