// Thumbnail concept 1: one India, two extremes. Left: the film's Konkan postcard (heavy rain on the coast); right: the film's Thar postcard (dry dunes).
// Each postcard is first rendered as a big layer still (P2-LAYER-K / P2-LAYER-T -> public/thumbs_tmp/p2_K.png, p2_T.png) from the film's own Postcards
// component, because the two share SVG ids; P2-THUMB-1 then composes them with the girl and the words. No figure is printed on this one.
import React from "react";
import {AbsoluteFill, Img, staticFile} from "remotion";
import {Fonts, SANS, rng} from "../kit";
import {Girl} from "../girl";
import {PostcardDefs, Postcards} from "../scenes/stage_props2";
import {PropDefs} from "../scenes/stage_props";

// a single postcard drawn big, from the film's own Postcards component (the card sits in its index-1 slot, so its centre is at x = CARD_X).
// The art is shown from 27% of its height down: that crops the stamp and postmark (card chrome) out of the picture.
const PF = 138;                                   // film frame where the card sways least
const CS = 8.6, CARD_K = 0.97;                    // Postcards scale; a settled card is drawn at 0.97
export const ART_W = 276 * CARD_K * CS;           // art width in layer px (1920 x 1080 layer)
const CROP = 0.27;
const ART_LEFT: Record<"konkan" | "thar", number> = {konkan: -0.47 * ART_W, thar: 870 - 0.05 * ART_W};   // layer x of the art's left edge
// the card origin sits at y + s * (lineY(0) + 4): the same sag curve the film uses
const lineY0 = (x: number) => {
  const y0 = -150, x0 = -x / CS - 80, x1 = 400 * 1.5, sag = 36 + Math.sin(PF / 50) * 2, t = (0 - x0) / (x1 - x0);
  return (1 - t) * (1 - t) * (y0 - 22) + 2 * t * (1 - t) * (y0 + sag) + t * t * (y0 - 6);
};
export const P2Card: React.FC<{which: "konkan" | "thar"}> = ({which}) => {
  const cx = ART_LEFT[which] + 138 * CARD_K * CS;
  const artTop = (cy: number) => cy + CS * (lineY0(cx) + 4) + 12 * CARD_K * CS;
  const cy = -(artTop(0) + CROP * 184 * CARD_K * CS);   // puts the 27% line at layer y = 0
  return (
    <Fonts>
      <AbsoluteFill style={{background: "#222"}}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute", inset: 0}}>
          <PropDefs/><PostcardDefs/>
          <Postcards x={cx} y={cy} s={CS} f={PF} cards={[{which, t0: Infinity, hl: false}, {which, t0: 0, hl: false}]}/>
        </svg>
      </AbsoluteFill>
    </Fonts>
  );
};

const K = 2 / 3;
const SX0 = 700, SX1 = 580;
const clipL = `polygon(0 0, ${SX0}px 0, ${SX1}px 720px, 0 720px)`;
const clipR = `polygon(${SX0}px 0, 1280px 0, 1280px 720px, ${SX1}px 720px)`;

export const Thumb1: React.FC = () => {
  const rain = React.useMemo(() => { const r = rng(21); return Array.from({length: 70}).map(() => ({x: r() * 760, y: r() * 720 - 40, l: 70 + r() * 90, w: 2.5 + r() * 3, o: 0.35 + r() * 0.4})); }, []);
  const big: React.CSSProperties = {position: "absolute", fontFamily: SANS, fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 0.92, whiteSpace: "nowrap"};
  return (
    <Fonts>
      <AbsoluteFill style={{background: "#222"}}>
        <div style={{position: "absolute", inset: 0, clipPath: clipL}}>
          <Img src={staticFile("thumbs_tmp/p2_K.png")} style={{width: 1920 * K, height: 1080 * K, filter: "saturate(1.3) contrast(1.18) brightness(0.8)"}}/>
          <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,50,110,.55), rgba(10,30,80,.3))", mixBlendMode: "multiply"}}/>
          <svg width={1280} height={720} style={{position: "absolute", inset: 0}}>
            {rain.map((d, i) => <path key={i} d={`M${d.x},${d.y} l${-d.l * 0.3},${d.l}`} stroke="#e4f2ff" strokeWidth={d.w} strokeLinecap="round" opacity={d.o}/>)}
          </svg>
        </div>
        <div style={{position: "absolute", inset: 0, clipPath: clipR}}>
          <Img src={staticFile("thumbs_tmp/p2_T.png")} style={{width: 1920 * K, height: 1080 * K, filter: "saturate(1.35) contrast(1.12) brightness(1.05)"}}/>
          <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 88% 8%, rgba(255,255,235,1) 0, rgba(255,222,130,.8) 110px, rgba(255,150,40,0) 520px)", mixBlendMode: "screen"}}/>
        </div>
        {/* seam */}
        <svg width={1280} height={720} style={{position: "absolute", inset: 0}}>
          <line x1={SX0} y1={0} x2={SX1} y2={720} stroke="#fff7dd" strokeWidth={9} opacity={0.35} style={{filter: "blur(6px)"}}/>
          <line x1={SX0} y1={0} x2={SX1} y2={720} stroke="#fff7dd" strokeWidth={5}/>
        </svg>
        {/* the girl on the seam, looking up, hand over her eyes */}
        <svg width={1280} height={720} style={{position: "absolute", inset: 0}}>
          <defs><filter id="p2t1b"><feGaussianBlur stdDeviation="9"/></filter></defs>
          <ellipse cx={646} cy={492} rx={100} ry={11} fill="#2e2a52" opacity={0.35} filter="url(#p2t1b)"/>
          <g transform="translate(642 492) scale(0.8)"><Girl f={30} id="p2t1g" pose="shade"/></g>
        </svg>
        {/* place tags */}
        <div style={{...big, left: 30, top: 28, fontSize: 46, color: "#fff6e2", background: "rgba(14,40,84,.72)", padding: "10px 20px 8px", borderRadius: 12, letterSpacing: "0.04em", lineHeight: 1}}>KONKAN</div>
        <div style={{...big, right: 30, top: 28, fontSize: 46, color: "#4a2410", background: "rgba(255,240,200,.85)", padding: "10px 20px 8px", borderRadius: 12, letterSpacing: "0.04em", lineHeight: 1}}>THAR</div>
        {/* darkening for the words */}
        <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 290, background: "linear-gradient(to top, rgba(20,16,34,.94), rgba(20,16,34,.66) 58%, rgba(20,16,34,0))"}}/>
        <div style={{...big, left: 0, right: 0, bottom: 112, textAlign: "center", fontSize: 132, color: "#fff6e2", textShadow: "0 6px 0 rgba(0,0,0,.35), 0 0 36px rgba(0,0,0,.5)"}}>
          <span style={{color: "#8fd4ff"}}>SAME</span> <span style={{color: "#ffc247"}}>MONSOON?</span>
        </div>
        <div style={{...big, left: 0, right: 0, bottom: 26, textAlign: "center", fontSize: 66, color: "#fff6e2", letterSpacing: "0.02em", textShadow: "0 4px 0 rgba(0,0,0,.35)"}}>WHAT IS NORMAL?</div>
      </AbsoluteFill>
    </Fonts>
  );
};
