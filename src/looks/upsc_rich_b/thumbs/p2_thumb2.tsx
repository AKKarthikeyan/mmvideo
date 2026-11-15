// Thumbnail concept 2: the film's atlas map of India (windmap, focus "india", layer "wetdry": green wet, sand dry), India whole, with three big pins:
// Konkan and West Rajasthan carry the film's printed labels lab("p2_konkan") / lab("p2_wraj"); Tamil Nadu carries "Oct–Dec?".
// The map is first rendered as a layer still (P2-LAYER-MAP -> public/thumbs_tmp/p2_map.png) from the film's own windmap scene; P2-THUMB-2 adds pins, cards and words.
// Pin positions come from the same projector and camera as the scene (windmap_geo), so they sit on the right places. No figure is typed here.
import React from "react";
import {AbsoluteFill, Img, staticFile} from "remotion";
import {lab} from "../../cartoon/long/figs";
import {Fonts, SANS, SERIF} from "../kit";
import {Scene as Windmap} from "../scenes/windmap";
import {ANCHORS, FBOX, projector} from "../scenes/windmap_geo";

const LF = 150, LDUR = 300;   // frame and length the layer is rendered at (decides the slow push-in)
const at = (_k: string) => 0;
export const P2MapLayer: React.FC = () => (
  <Fonts><AbsoluteFill><Windmap f={LF} dur={LDUR} draft={false} at={at} spec={{focus: "india", layers: [{id: "wetdry", key: "wd"}]}}/></AbsoluteFill></Fonts>
);

// layer (1920 x 1080) -> thumbnail frame (1280 x 720): scale M, origin (OX, OY)
const M = 0.76, OX = 81, OY = 0;
const P = projector(FBOX.india);
const sc = 1 + 0.022 * Math.min(1, LF / Math.max(60, LDUR));   // the scene's own push-in at this frame (dx is 0 at u = 0.5)
const frame = (name: string) => {
  const a = ANCHORS.india[name], p = P(a[0], a[1]);
  const lx = 960 + (p.x + (8 - 16 * Math.min(1, LF / Math.max(60, LDUR))) - 960) * sc, ly = 540 + (p.y - 540) * sc;
  return {x: OX + lx * M, y: OY + ly * M};
};

const Pin: React.FC<{x: number; y: number; id: string}> = ({x, y, id}) => (
  <g transform={`translate(${x} ${y})`}>
    <defs><radialGradient id={id}><stop offset="0" stopColor="#ffe08a" stopOpacity="0.95"/><stop offset="0.5" stopColor="#ffb84a" stopOpacity="0.5"/><stop offset="1" stopColor="#ff9a3a" stopOpacity="0"/></radialGradient></defs>
    <circle cy={-30} r={72} fill={`url(#${id})`}/>
    <ellipse cx="3" cy="2" rx="22" ry="7" fill="#0b2a4a" opacity="0.45"/>
    <g transform="scale(2.2)">
      <path d="M0,0 C-5,-11 -17,-17 -17,-30 a17,17 0 1 1 34,0 C17,-17 5,-11 0,0Z" fill="#c2431f" stroke="#fff3d6" strokeWidth="2.4" strokeLinejoin="round"/>
      <path d="M-9,-38 a11,11 0 0 1 12,-6" stroke="#ff9a72" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7"/>
      <circle cy="-30" r="6.4" fill="#fff3d6"/>
    </g>
  </g>
);

const Card: React.FC<{x: number; y: number; w: number; h: number; cap: string; text: string; size: number}> = ({x, y, w, h, cap, text, size}) => (
  <div style={{position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 20px 0 28px", whiteSpace: "nowrap",
    borderRadius: 18, background: "linear-gradient(160deg, rgba(255,252,243,1), rgba(255,243,219,.97))", border: "2px solid rgba(190,110,50,.7)",
    boxShadow: "0 22px 36px -14px rgba(10,20,40,.75), 0 4px 10px -4px rgba(10,20,40,.5)"}}>
    <span style={{position: "absolute", left: 0, top: 14, bottom: 14, width: 7, borderRadius: 4, background: "#d8682a"}}/>
    <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: "0.09em", color: "#a2501f", textTransform: "uppercase", lineHeight: 1}}>{cap}</div>
    <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: size, lineHeight: 1.05, color: "#5b2c12", marginTop: 5, letterSpacing: "-0.01em"}}>{text}</div>
  </div>
);

export const Thumb2: React.FC = () => {
  const kon = frame("konkan"), raj = frame("wrajasthan"), tn = frame("tncoast");
  const CW = 430, CH = 106;
  const rajC = {x: 22, y: 24}, konC = {x: 22, y: 152}, tnC = {x: 955, y: 360, w: 295};
  const edgeR = (c: {x: number; y: number}) => ({x: c.x + CW, y: c.y + CH / 2});
  const big: React.CSSProperties = {fontFamily: SANS, fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 0.9, whiteSpace: "nowrap", textShadow: "0 5px 0 rgba(0,0,0,.4), 0 0 34px rgba(0,0,0,.6)"};
  return (
    <Fonts>
      <AbsoluteFill style={{background: "#24689a"}}>
        <Img src={staticFile("thumbs_tmp/p2_map.png")} style={{position: "absolute", left: OX, top: OY, width: 1920 * M, height: 1080 * M, filter: "saturate(1.2) contrast(1.08)"}}/>
        {/* dark ground for the words and cards */}
        <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: 650, background: "linear-gradient(90deg, rgba(6,18,44,.99), rgba(6,18,44,.95) 60%, rgba(6,18,44,0))"}}/>
        <svg width={1280} height={720} style={{position: "absolute", inset: 0}}>
          {[[edgeR(rajC), raj], [edgeR(konC), kon]].map(([a, b]: any, i) => (
            <g key={i}><path d={`M${a.x},${a.y} L${b.x},${b.y - 36}`} stroke="#fff6d8" strokeWidth={9} opacity={0.75} strokeLinecap="round"/><path d={`M${a.x},${a.y} L${b.x},${b.y - 36}`} stroke="#6b3d12" strokeWidth={3.5} strokeLinecap="round"/></g>
          ))}
          <g><path d={`M${tn.x},${tn.y - 36} L${tnC.x},${tnC.y + CH / 2}`} stroke="#fff6d8" strokeWidth={9} opacity={0.75} strokeLinecap="round"/><path d={`M${tn.x},${tn.y - 36} L${tnC.x},${tnC.y + CH / 2}`} stroke="#6b3d12" strokeWidth={3.5} strokeLinecap="round"/></g>
          <Pin x={raj.x} y={raj.y} id="p2h1"/><Pin x={kon.x} y={kon.y} id="p2h2"/><Pin x={tn.x} y={tn.y} id="p2h3"/>
        </svg>
        <Card x={rajC.x} y={rajC.y} w={CW} h={CH} cap="West Rajasthan" text={lab("p2_wraj")} size={52}/>
        <Card x={konC.x} y={konC.y} w={CW} h={CH} cap="Konkan" text={lab("p2_konkan")} size={52}/>
        <Card x={tnC.x} y={tnC.y} w={tnC.w} h={CH} cap="Tamil Nadu" text="Oct–Dec?" size={52}/>
        <div style={{position: "absolute", left: 30, bottom: 26}}>
          <div style={{...big, fontSize: 108, color: "#fff6e2"}}>WHAT IS</div>
          <div style={{...big, fontSize: 112, color: "#ffc247", marginTop: 4}}>‘NORMAL’</div>
          <div style={{...big, fontSize: 170, color: "#8fd4ff", marginTop: 2}}>RAIN?</div>
        </div>
      </AbsoluteFill>
    </Fonts>
  );
};
