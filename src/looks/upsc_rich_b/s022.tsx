// s022: the Indian Ocean. South-east trades cross the equator between 40 and 60 E and bend right onto India.
import React from "react";
import {AbsoluteFill} from "remotion";
import {lab} from "../cartoon/long/figs";
import {Fonts, PaperFinish, SANS, SERIF, W, H, clamp, eo, lerp, prog} from "./kit";
import {BOXES, Cloud, GlowDef, Graticule, Land, MapDefs, MapLabel, Ocean, Ribbon, proj} from "./map";

const B = BOXES.ocean, P = proj(B), ID = "m22";
const EQ = P.y(0), X40 = P.x(40), X60 = P.x(60);

// five streamlines: south-east trades -> cross the equator inside 40-60 E -> bend right toward India's west coast
const lines = [0, 1, 2, 3, 4].map((k) => {
  const cx = X40 + 30 + k * ((X60 - X40 - 60) / 4);
  const ex = [1078, 1090, 1104, 1120, 1134][k], ey = [112, 156, 200, 246, 292][k];
  const s1 = `M${cx + 360},${EQ + 560} C${cx + 215},${EQ + 400} ${cx + 52},${EQ + 190} ${cx - 6},${EQ} `;
  const s2 = `M${cx - 6},${EQ} C${cx - 38},${EQ - 78} ${cx + 70},${ey + 90} ${ex},${ey}`;
  return {cx, s1, s2};
});

export const SceneS022: React.FC<{f: number}> = ({f}) => {
  const t = f / 240, camX = lerp(10, -10, t), zoom = 1.02 + 0.015 * t;
  const fadeIn = eo(prog(f, 0, 10));
  const pEq = eo(prog(f, 12, 26)), pTr = eo(prog(f, 50, 42)), pCx = eo(prog(f, 100, 16)), pBd = eo(prog(f, 138, 34)), pEx = eo(prog(f, 190, 16));
  const pCloud = eo(prog(f, 170, 50));
  const lx = (a: number) => a;
  return (
    <AbsoluteFill style={{background: "#24689a", opacity: fadeIn}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", inset: 0}}>
        <MapDefs id={ID} b={B} f={f}/><GlowDef/>
        <defs>
          <linearGradient id="m22-band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff2b0" stopOpacity="0"/><stop offset="0.35" stopColor="#fff2b0" stopOpacity="0.42"/><stop offset="0.65" stopColor="#fff2b0" stopOpacity="0.42"/><stop offset="1" stopColor="#fff2b0" stopOpacity="0"/></linearGradient>
          <linearGradient id="m22-wind1" x1="0" x2="1"><stop stopColor="#2e86d6"/><stop offset="1" stopColor="#1f5fb4"/></linearGradient>
        </defs>
        <g transform={`translate(960 540) scale(${zoom}) translate(${-960 + camX * 0.6} -540)`}>
          <Ocean id={ID} b={B} f={f} w={W} h={H}/>
          <Graticule b={B} f={f}/>
          <Land id={ID} b={B} w={W} h={H}/>
          {/* place names */}
          <MapLabel x={P.x(18)} y={P.y(2)} text="AFRICA" size={40} col="#6b5a34" op={0.55}/>
          <MapLabel x={P.x(86)} y={P.y(-12)} text="INDIAN OCEAN" size={44} rot={-4} op={0.55} track={0.5}/>
          <MapLabel x={P.x(63)} y={P.y(14)} text="ARABIAN SEA" size={24} rot={-14} op={0.7}/>
          <MapLabel x={P.x(88)} y={P.y(14.5)} text="BAY OF" size={20} op={0.7}/><MapLabel x={P.x(88)} y={P.y(14.5) + 24} text="BENGAL" size={20} op={0.7}/>
          <MapLabel x={P.x(79.5)} y={P.y(19)} text="INDIA" size={34} col="#5b3f16" op={0.8} track={0.35}/>
          <MapLabel x={P.x(122)} y={P.y(-25)} text="AUSTRALIA" size={26} col="#6b5a34" op={0.55} anchor="end"/>
          
          <MapLabel x={P.x(93.5)} y={P.y(12) - 6} text="ANDAMAN" size={13} sans col="#f4fbff" op={0.9} track={0.12} anchor="start"/><MapLabel x={P.x(93.5)} y={P.y(12) + 9} text="& NICOBAR" size={13} sans col="#f4fbff" op={0.9} track={0.12} anchor="start"/>
          <path d={`M${P.x(72.8)},${P.y(10.5) + 76} V${P.y(10.5) + 8}`} stroke="#fff" strokeWidth="1.4" strokeDasharray="2 4" opacity="0.9"/><MapLabel x={P.x(72.8)} y={P.y(10.5) + 92} text="LAKSHADWEEP" size={13} sans col="#f4fbff" op={0.95} track={0.12}/>

          {/* the 40-60 E crossing band */}
          <g opacity={pCx}>
            <rect x={X40} y={EQ - 190} width={X60 - X40} height={380} fill="url(#m22-band)"/>
            <path d={`M${X40},${EQ - 150} V${EQ + 150} M${X60},${EQ - 150} V${EQ + 150}`} stroke="#fff6c8" strokeWidth="2.2" strokeDasharray="3 8" strokeLinecap="round"/>
            <path d={`M${X40},${EQ + 168} v12 H${X60} v-12`} stroke="#fff6c8" strokeWidth="3" fill="none" strokeLinejoin="round"/>
          </g>
          {/* equator */}
          <g opacity={pEq}>
            <path d={`M0,${EQ} H${W * pEq}`} stroke="#fffbe8" strokeWidth="2.6" strokeDasharray="16 9" opacity="0.95" style={{filter: "drop-shadow(0 0 4px rgba(255,240,170,.9))"}}/>
            <text x={1330} y={EQ - 12} fontFamily={SANS} fontWeight={800} fontSize="21" letterSpacing="0.3em" fill="#fffbe8" style={{paintOrder: "stroke", stroke: "rgba(10,40,70,.45)", strokeWidth: 3.5}}>EQUATOR</text>
          </g>
          {/* trade winds + bend: two colour stages */}
          {lines.map((l, i) => <Ribbon key={`a${i}`} id={`m22a${i}`} d={l.s1} p={pTr} f={f} c1="#2f86da" c2="#1b4f9c" w={6} chevrons={3} ph={i * 0.19}/>)}
          {lines.map((l, i) => <Ribbon key={`b${i}`} id={`m22b${i}`} d={l.s2} p={pBd} f={f} c1="#f08a2c" c2="#c24a14" w={6.5} chevrons={2} ph={i * 0.23}/>)}
          {/* clouds the monsoon brings */}
          {[[1168, 140, 0.75, 5], [1178, 232, 0.6, 6], [860, 110, 0.55, 7]].map(([x, y, s, sd], i) => <Cloud key={i} id={ID} x={x} y={y + (1 - pCloud) * 18} s={s} a={pCloud * (i > 1 ? 0.9 : 1) * 0.95} seed={sd}/>)}
        </g>
      </svg>
      <PaperFinish id="s22pf" grain={0.5} vignette={0.32}/>
      {/* labels on top: kept in the safe box */}
      <div style={{position: "absolute", left: 96, top: 440, width: 470, whiteSpace: "nowrap", opacity: pCx, transform: `translateY(${(1 - pCx) * 20}px)`, background: "linear-gradient(160deg, rgba(255,252,243,.92), rgba(255,243,219,.8))", border: "1.5px solid rgba(190,110,50,.5)", borderRadius: 20, boxShadow: "0 30px 60px -26px rgba(10,30,60,.65), inset 0 1.5px 0 rgba(255,255,255,.9)", padding: "20px 28px 22px"}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 18, letterSpacing: "0.15em", color: "#8c4a22"}}>TRADES CROSS THE EQUATOR AT</div>
        <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 84, lineHeight: 1.08, color: "#b8461a", letterSpacing: "-0.01em"}}>{lab("cross")}</div>
      </div>
      <svg width={W} height={H} style={{position: "absolute", inset: 0, pointerEvents: "none"}}><path d={`M${96 + 470},${440 + 52} C${X40 - 90},${EQ + 40} ${X40 - 30},${EQ + 30} ${X40 * 1.0 + 6},${EQ + 4}`} stroke="#fff6c8" strokeWidth="3" fill="none" strokeDasharray="2 8" strokeLinecap="round" opacity={pCx}/></svg>
      <div style={{position: "absolute", left: 96, top: 780, display: "flex", flexDirection: "column", gap: 12, opacity: pTr, fontFamily: SANS, fontWeight: 700, fontSize: 19, letterSpacing: "0.15em", color: "#fff", textShadow: "0 1px 6px rgba(8,30,60,.7)"}}>
        <div style={{display: "flex", alignItems: "center", gap: 14}}><span style={{width: 46, height: 8, borderRadius: 4, background: "#2f86da", boxShadow: "0 0 10px #2f86da"}}/>SOUTH-EAST TRADES</div>
        <div style={{display: "flex", alignItems: "center", gap: 14, opacity: pBd}}><span style={{width: 46, height: 8, borderRadius: 4, background: "#f08a2c", boxShadow: "0 0 10px #f08a2c"}}/>BENT RIGHT: SOUTH-WEST MONSOON</div>
      </div>
      <div style={{position: "absolute", left: 96, top: 84 + (1 - pEx) * 14, opacity: pEx, padding: "14px 30px", borderRadius: 16, background: "rgba(255,250,236,.94)", border: "1.5px solid rgba(190,110,50,.55)", boxShadow: "0 22px 44px -20px rgba(10,30,60,.7)", fontFamily: SERIF, fontWeight: 600, fontSize: 36, color: "#7a3512", letterSpacing: "0.02em"}}>
        SE TRADES <span style={{color: "#c24a14"}}>{"→"}</span> SW MONSOON
      </div>
    </AbsoluteFill>
  );
};
export const S022: React.FC<{f: number}> = ({f}) => <Fonts><SceneS022 f={f}/></Fonts>;
