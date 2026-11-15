// Thumbnail concept 1: one Nagpur rooftop, split. Left: May, harsh sun, empty bucket, the printed May maximum. Right: July rain, full bucket.
// The two halves are first rendered as stills of the film's own rooftop stage scene (layers "T1-LAYER-L/R" -> public/thumbs_tmp/),
// because the sets share SVG ids; THUMB-1 then composes them with the girl and the words.
import React from "react";
import {AbsoluteFill, Img, staticFile} from "remotion";
import {fig} from "../../cartoon/long/figs";
import {Fonts, SANS, SERIF} from "../kit";
import {Girl} from "../girl";
import {Scene as Stage} from "../scenes/stage";

const noKey = () => 0;
export const T1Layer: React.FC<{side: "L" | "R"}> = ({side}) => (
  <Fonts>
    <Stage f={120} dur={300} draft={false} at={noKey} spec={side === "L"
      ? {set: "rooftop", time: "may", props: [{icon: "bucket", x: 340, y: 740, s: 2.7, state: "empty"}]}
      : {set: "rooftop", time: "july", rain: true, props: [{icon: "bucket", x: 1590, y: 740, s: 2.7, state: "full"}]}}/>
  </Fonts>
);

const K = 2 / 3;
// seam: a slightly slanted cut, x at the top and at the bottom of the 1280 x 720 frame
const SX0 = 700, SX1 = 580;
const clipL = `polygon(0 0, ${SX0}px 0, ${SX1}px 720px, 0 720px)`;
const clipR = `polygon(${SX0}px 0, 1280px 0, 1280px 720px, ${SX1}px 720px)`;

export const Thumb1: React.FC = () => {
  const tmax = Math.round(fig({t: "u7_nagpur", state: "May", s: "tmax"}).value);
  const big: React.CSSProperties = {position: "absolute", fontFamily: SANS, fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 0.92, whiteSpace: "nowrap"};
  return (
    <Fonts>
      <AbsoluteFill style={{background: "#222"}}>
        <div style={{position: "absolute", inset: 0, clipPath: clipL}}>
          <Img src={staticFile("thumbs_tmp/t1_L.png")} style={{width: 1920 * K, height: 1080 * K, filter: "saturate(1.45) contrast(1.12) brightness(1.06) sepia(0.18)"}}/>
          <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 14% 8%, rgba(255,255,235,1) 0, rgba(255,226,140,.95) 70px, rgba(255,160,50,.55) 260px, rgba(255,120,20,0) 640px)", mixBlendMode: "screen"}}/>
          <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,150,40,.0) 0%, rgba(255,120,30,.38) 100%)", mixBlendMode: "multiply"}}/>
        </div>
        <div style={{position: "absolute", inset: 0, clipPath: clipR}}>
          <Img src={staticFile("thumbs_tmp/t1_R.png")} style={{width: 1920 * K, height: 1080 * K, filter: "saturate(1.05) contrast(1.14) brightness(0.88) hue-rotate(-6deg)"}}/>
          <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(40,90,150,.35), rgba(20,60,110,.2))", mixBlendMode: "multiply"}}/>
        </div>
        {/* cracked dry ground, left only */}
        <svg width={1280} height={720} style={{position: "absolute", inset: 0, clipPath: clipL}}>
          <g fill="none" stroke="#4a2410" strokeLinecap="round" strokeLinejoin="round" opacity={0.75}>
            {["M30,500 L96,520 L150,512 L214,540 L270,528 L340,560", "M96,520 L84,556 L112,590 L98,640", "M214,540 L236,586 L222,640 L250,700", "M340,560 L372,600 L360,660", "M470,500 L452,540 L492,584 L470,640 L500,700", "M150,512 L172,470", "M540,520 L520,570 L548,620", "M372,600 L420,616 L452,540", "M30,600 L84,556", "M330,520 L300,490"].map((d, i) => <path key={i} d={d} strokeWidth={i % 3 === 0 ? 4.5 : 2.8}/>)}
          </g>
        </svg>
        {/* seam */}
        <svg width={1280} height={720} style={{position: "absolute", inset: 0}}>
          <line x1={SX0} y1={0} x2={SX1} y2={720} stroke="#fff7dd" strokeWidth={9} opacity={0.35} style={{filter: "blur(6px)"}}/>
          <line x1={SX0} y1={0} x2={SX1} y2={720} stroke="#fff7dd" strokeWidth={5}/>
        </svg>
        {/* the girl on the seam, looking up at the sky, hand over her eyes */}
        <svg width={1280} height={720} style={{position: "absolute", inset: 0}}>
          <defs><filter id="t1b"><feGaussianBlur stdDeviation="9"/></filter></defs>
          <ellipse cx={650} cy={486} rx={100} ry={11} fill="#2e2a52" opacity={0.35} filter="url(#t1b)"/>
          <g transform={`translate(646 486) scale(0.8)`}><Girl f={30} id="t1g" pose="shade"/></g>
        </svg>
        {/* darkening for the words */}
        <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 250, background: "linear-gradient(to top, rgba(20,16,34,.92), rgba(20,16,34,.6) 55%, rgba(20,16,34,0))"}}/>
        {/* the printed figure */}
        <div style={{...big, left: 22, top: 8, fontFamily: SERIF, fontWeight: 800, fontSize: 236, textTransform: "none", letterSpacing: "-0.03em", color: "#b8230f",
          WebkitTextStroke: "14px #fff4d6", paintOrder: "stroke fill", textShadow: "0 10px 30px rgba(90,30,10,.45)"}}>{tmax}°C</div>
        <div style={{...big, left: 0, right: 0, bottom: 28, textAlign: "center", fontSize: 122, color: "#fff6e2", textShadow: "0 6px 0 rgba(0,0,0,.35), 0 0 36px rgba(0,0,0,.5)"}}>
          WHY DOES THE<br/><span style={{color: "#8fd4ff"}}>RAIN WAIT?</span>
        </div>
      </AbsoluteFill>
    </Fonts>
  );
};
