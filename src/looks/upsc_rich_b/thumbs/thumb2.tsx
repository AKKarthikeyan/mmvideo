// Thumbnail concept 2: the Earth over India, the glowing rain belt slid north from the equator to India, and the old
// "giant sea breeze" arrow faded and crossed out. Drawn from the film's own globe pieces (globe_b.tsx), on a dark night-blue ground for contrast.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Fonts, SANS, rng} from "../kit";
import {ARW, ArrowB, BandB, GDefs, GlobeB, flowPts, proj, type View} from "../scenes/globe_b";

const GID = "gb";
const V: View = {cx: 1520, cy: 690, R: 820, lon0: 80, lat0: 9};
const pt = (lon: number, lat: number): [number, number] => { const p = proj(V, lon, lat); return [p.x, p.y]; };

export const Thumb2: React.FC = () => {
  const f = 40;
  const stars = React.useMemo(() => { const r = rng(5); return Array.from({length: 70}).map(() => ({x: r() * 1920, y: r() * 1080, r: 0.8 + r() * 1.8, o: 0.25 + r() * 0.5})); }, []);
  // the old picture: one giant arrow from the sea onto India's west coast, faded and crossed out
  const p0 = pt(51, -9), p1 = pt(72.4, 18.8);
  const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), ang = (Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * 180) / Math.PI, mid: [number, number] = [L * 0.5, 0];
  const HW = 112, HL = 210, SW = 64;   // head half-width, head length, shaft half-width
  const arrow = `M0,${-SW} L${L - HL},${-SW} L${L - HL},${-HW} L${L},0 L${L - HL},${HW} L${L - HL},${SW} L0,${SW} Z`;
  return (
    <Fonts>
      <AbsoluteFill style={{background: "#07122b"}}>
        <svg width={1280} height={720} viewBox="0 0 1920 1080" style={{position: "absolute", inset: 0}}>
          <defs>
            <radialGradient id="t2bg" cx="0.68" cy="0.5" r="0.75"><stop offset="0" stopColor="#1d4c8c"/><stop offset="0.5" stopColor="#0f2a5a"/><stop offset="1" stopColor="#060f26"/></radialGradient>
            <radialGradient id="t2glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0.6" stopColor="#ffb64a" stopOpacity="0"/><stop offset="0.82" stopColor="#ffb64a" stopOpacity="0.3"/><stop offset="1" stopColor="#ffb64a" stopOpacity="0"/></radialGradient>
            <radialGradient id="t2spot" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ffe9a8" stopOpacity="0.5"/><stop offset="1" stopColor="#ffe9a8" stopOpacity="0"/></radialGradient>
            <filter id="t2b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
          </defs>
          <GDefs id={GID} f={f}/>
          <clipPath id="t2disc"><circle cx={V.cx} cy={V.cy} r={V.R}/></clipPath>
          <rect width={1920} height={1080} fill="url(#t2bg)"/>
          {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o}/>)}
          <circle cx={V.cx} cy={V.cy} r={V.R * 1.12} fill="url(#t2glow)"/>
          <GlobeB indiaTop v={V} id="gB" f={f} texShift={-(V.lon0 - 80) * Math.PI / 180 * V.R * Math.cos(V.lat0 * Math.PI / 180)}
            under={<BandB v={V} gid={GID} f={f} lat={19} glow={1} size={0.0016}/>}>
            <g clipPath="url(#t2disc)">
              <circle cx={V.cx} cy={V.cy} r={V.R} fill="#061633" opacity={0.42}/>
              <circle cx={pt(80, 22)[0]} cy={pt(80, 22)[1]} r={330} fill="url(#t2spot)" style={{mixBlendMode: "screen"}}/>
              <BandB v={V} gid={GID} f={f} lat={19} glow={1} size={0.0016}/>
              <g transform={`translate(${p0[0]} ${p0[1]}) rotate(${ang})`}>
                <path d={arrow} fill="#cfe6fb" opacity={0.5} transform="translate(6 10)" style={{filter: "blur(8px)"}}/>
                <path d={arrow} fill="#bcd8f2" opacity={0.42}/>
                <path d={arrow} fill="none" stroke="#e9f4ff" strokeWidth={4} strokeDasharray="14 10" opacity={0.7}/>
                <g transform={`translate(${mid[0]} ${mid[1]}) rotate(${-ang})`} strokeLinecap="round" style={{filter: "drop-shadow(0 8px 14px rgba(0,0,0,.55))"}}>
                  <path d="M-110,-110 L110,110 M110,-110 L-110,110" stroke="#fff4d6" strokeWidth={50}/>
                  <path d="M-110,-110 L110,110 M110,-110 L-110,110" stroke="#e1301e" strokeWidth={34}/>
                </g>
              </g>
            </g>
          </GlobeB>
        </svg>
        <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: 700, background: "linear-gradient(90deg, rgba(5,12,32,.9), rgba(5,12,32,.55) 70%, rgba(5,12,32,0))"}}/>
        <div style={{position: "absolute", left: 44, top: 70, fontFamily: SANS, fontWeight: 900, textTransform: "uppercase", lineHeight: 0.9, letterSpacing: "-0.02em",
          textShadow: "0 6px 0 rgba(0,0,0,.4), 0 0 40px rgba(0,0,0,.6)"}}>
          <div style={{fontSize: 128, color: "#fff6e2"}}>NOT A</div>
          <div style={{fontSize: 188, color: "#fff6e2", marginTop: 6}}>SEA</div>
          <div style={{fontSize: 150, color: "#ffc247", marginTop: 4}}>BREEZE</div>
        </div>
      </AbsoluteFill>
    </Fonts>
  );
};
