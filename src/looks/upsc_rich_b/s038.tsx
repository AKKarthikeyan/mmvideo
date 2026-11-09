// s038: the peak. Left, the old giant sea-breeze arrow fades. Right, the glowing equatorial rain belt slides north over India, pulling the trades across the equator.
import React, {useMemo} from "react";
import {AbsoluteFill} from "remotion";
import {Fonts, PaperFinish, SANS, SERIF, W, H, clamp, eio, eo, lerp, prog, rng} from "./kit";
import {BOXES, Cloud, GlowDef, Graticule, Land, MapDefs, MapLabel, Ocean, Ribbon, proj} from "./map";

const B = BOXES.asia, P = proj(B), ID = "m38";
const PW = 960, LON_A = 56;                       // each panel shows 56-105 E
const OX = -P.x(LON_A);
const EQ = P.y(0);

const Panel: React.FC<{x: number; f: number; sat?: number; children?: React.ReactNode; camX: number}> = ({x, f, sat = 1, children, camX}) => (
  <g transform={`translate(${x} 0)`}>
    <g clipPath="url(#m38-panel)">
      <g transform={`translate(${OX + camX} 0)`} style={{filter: sat < 1 ? `saturate(${sat}) brightness(1.04)` : undefined}}>
        <Ocean id={ID} b={B} f={f} w={W} h={H}/>
        <Graticule b={B} f={f} labels={false}/>
        <Land id={ID} b={B} w={W} h={H}/>
        {children}
      </g>
    </g>
  </g>
);

export const SceneS038: React.FC<{f: number}> = ({f}) => {
  const t = f / 240, camX = lerp(6, -6, t), zoom = 1.0 + 0.02 * t;
  const fadeIn = eo(prog(f, 0, 10));
  // old picture: arrow appears, then fades away
  const aIn = eo(prog(f, 12, 28)), aOut = eio(prog(f, 84, 70)), aOp = aIn * (1 - 0.86 * aOut);
  // new picture: belt slides north from the equator over India
  const beltK = eio(prog(f, 60, 130)), beltLat = lerp(0, 20, beltK), beltY = P.y(beltLat);
  const pEq = eo(prog(f, 40, 20)), pWind = eo(prog(f, 70, 40)), pRain = eo(prog(f, 150, 40)), pLabel = eo(prog(f, 120, 18)), pOld = eo(prog(f, 6, 16));
  const belt = useMemo(() => { const r = rng(17); return Array.from({length: 44}).map((_, i) => ({lon: 52 + i * 1.3 + r() * 0.8, dy: (r() - 0.5) * 120 + 30 * Math.sin(i * 0.9), s: 0.45 + r() * 0.55, sd: 10 + i})); }, []);
  const winds = [0, 1, 2, 3].map((k) => {
    const cx = P.x(63 + k * 4.6), endx = P.x(71 + k * 4.4), endy = beltY + 36 + k * 4;
    const s1 = `M${cx + 190},${H + 30} C${cx + 120},${EQ + 190} ${cx + 30},${EQ + 80} ${cx},${EQ}`;
    const s2 = `M${cx},${EQ} C${cx - 12},${EQ - 60} ${cx + 30},${Math.max(endy + 40, EQ - 120)} ${endx},${endy}`;
    return {s1, s2};
  });
  // rain streaks fall from the belt onto India
  const rain = useMemo(() => { const r = rng(41); return Array.from({length: 900}).map(() => ({x: P.x(67) + r() * (P.x(97) - P.x(67)), y0: r(), v: 0.8 + r() * 0.7, l: 14 + r() * 20})); }, []);
  const bandOp = clamp(0.35 + 0.65 * beltK);
  return (
    <AbsoluteFill style={{background: "#24689a", opacity: fadeIn}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", inset: 0}}>
        <MapDefs id={ID} b={B} f={f}/><GlowDef/>
        <defs>
          <clipPath id="m38-panel"><rect x="0" y="0" width={PW} height={H}/></clipPath>
          <linearGradient id="m38-belt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd37a" stopOpacity="0"/><stop offset="0.4" stopColor="#ffc060" stopOpacity="0.55"/><stop offset="0.5" stopColor="#fff0b8" stopOpacity="0.8"/><stop offset="0.62" stopColor="#ffb05a" stopOpacity="0.5"/><stop offset="1" stopColor="#ff9a48" stopOpacity="0"/></linearGradient>
          <linearGradient id="m38-arrow" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#7fa7cc"/><stop offset="1" stopColor="#c7dcee"/></linearGradient>
          <linearGradient id="m38-edge" x1="0" x2="1"><stop offset="0" stopColor="#102a4a" stopOpacity="0"/><stop offset="1" stopColor="#102a4a" stopOpacity="0.5"/></linearGradient>
          <linearGradient id="m38-edgeR" x1="0" x2="1"><stop offset="0" stopColor="#102a4a" stopOpacity="0.5"/><stop offset="1" stopColor="#102a4a" stopOpacity="0"/></linearGradient>
          <filter id="m38-blur18" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>
          <filter id="m38-blur6" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
        </defs>
        <g transform={`translate(960 540) scale(${zoom}) translate(-960 -540)`}>
          {/* ---------- left: the old picture ---------- */}
          <Panel x={0} f={f} sat={lerp(0.55, 0.3, aOut)} camX={camX * 0.6}>
            <MapLabel x={P.x(78)} y={P.y(27)} text="INDIA" size={34} col="#5b3f16" op={0.7} track={0.35}/>
            {/* the giant sea-breeze arrow: from the cool ocean onto the hot land */}
            <g opacity={aOp} style={{filter: "drop-shadow(0 14px 18px rgba(10,30,60,.45))"}}>
              <path d={`M${P.x(79)},${P.y(-9.5)} C${P.x(74)},${P.y(-1)} ${P.x(83)},${P.y(5)} ${P.x(80)},${P.y(13)} L${P.x(76.4)},${P.y(12.4)} L${P.x(80)},${P.y(21.5)} L${P.x(88.2)},${P.y(13.6)} L${P.x(84.2)},${P.y(13.2)} C${P.x(87.5)},${P.y(5)} ${P.x(78)},${P.y(-1)} ${P.x(83)},${P.y(-9.5)} Z`} fill="url(#m38-arrow)" stroke="#5b7fa6" strokeWidth="2.2" strokeLinejoin="round"/>
              <path d={`M${P.x(80.4)},${P.y(-8)} C${P.x(76.8)},${P.y(-1)} ${P.x(84)},${P.y(5)} ${P.x(81.4)},${P.y(12)}`} stroke="#fff" strokeWidth="6" fill="none" opacity="0.55" strokeLinecap="round" strokeDasharray="2 18" strokeDashoffset={-f * 1.4}/>
            </g>
          </Panel>
          {/* ---------- right: the newer picture ---------- */}
          <Panel x={PW} f={f} camX={camX}>
            {/* India turns green as the rains arrive */}
            <path d={BOXES.asia.india} fill="#3f9d5c" opacity={0.42 * pRain} style={{mixBlendMode: "multiply"}}/>
            <MapLabel x={P.x(80)} y={P.y(24)} text="INDIA" size={34} col="#5b3f16" op={0.75} track={0.35}/>
            <g opacity={pEq}><path d={`M0,${EQ} H${W * pEq}`} stroke="#fffbe8" strokeWidth="2.6" strokeDasharray="16 9" opacity="0.95"/>
              <text x={P.x(97)} y={EQ - 12} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize="19" letterSpacing="0.3em" fill="#fffbe8" style={{paintOrder: "stroke", stroke: "rgba(10,40,70,.5)", strokeWidth: 3.5}}>EQUATOR</text></g>
            {winds.map((l, i) => <Ribbon key={`a${i}`} id={`m38a${i}`} d={l.s1} p={pWind} f={f} c1="#2f86da" c2="#1b4f9c" w={5.5} chevrons={2} ph={i * 0.2}/>)}
            {winds.map((l, i) => <Ribbon key={`b${i}`} id={`m38b${i}`} d={l.s2} p={pWind * clamp((EQ - (beltY + 36) - 30) / 160)} f={f} c1="#f08a2c" c2="#c24a14" w={6} chevrons={2} ph={i * 0.27}/>)}
            {/* rain over India */}
            <g clipPath="url(#m38-clipInd)" opacity={pRain}>
              {rain.map((q, i) => { const y = beltY + 30 + ((q.y0 * 420 + f * 5 * q.v) % 440); return y < beltY + 30 + 440 ? <path key={i} d={`M${q.x},${y} l-4,${q.l}`} stroke="#e6f4ff" strokeWidth="2" strokeLinecap="round" opacity="0.85"/> : null; })}
            </g>
            {/* the belt itself */}
            <g opacity={bandOp}>
              <rect x={P.x(LON_A) - 40} y={beltY - 90} width={P.x(LON_A + 50) - P.x(LON_A) + 80} height={190} fill="#ff9d3a" opacity="0.75" filter="url(#m38-blur18)" style={{mixBlendMode: "screen"}}/>
              <rect x={P.x(LON_A) - 40} y={beltY - 190} width={P.x(LON_A + 50) - P.x(LON_A) + 80} height={380} fill="url(#m38-belt)" style={{mixBlendMode: "screen"}} filter="url(#m38-blur18)"/>
              {belt.map((b, i) => <Cloud key={i} id={ID} x={P.x(b.lon)} y={beltY + b.dy + 4 * Math.sin(f / 30 + i)} s={b.s} a={0.88} seed={b.sd}/>)}
              <rect x={P.x(LON_A) - 40} y={beltY - 28} width={P.x(LON_A + 50) - P.x(LON_A) + 80} height={56} fill="#fff1b8" opacity="0.4" filter="url(#m38-blur18)" style={{mixBlendMode: "screen"}}/>
            </g>
          </Panel>
          {/* sun marker beside the belt: it moves north with the sun */}
          <g transform={`translate(${PW + 44} ${beltY})`} opacity={pWind}>
            <circle r="46" fill="#ffe08a" opacity="0.35" filter="url(#m38-blur6)"/>
            {Array.from({length: 12}).map((_, i) => <path key={i} d="M0,-26 V-38" stroke="#ffc44a" strokeWidth="3" strokeLinecap="round" transform={`rotate(${i * 30 + f * 0.8})`}/>)}
            <circle r="19" fill="#ffd45e" stroke="#e29a1e" strokeWidth="2"/><circle r="9" cx="-5" cy="-5" fill="#fff2b0" opacity="0.8"/>
          </g>
          {/* divider */}
          <rect x={PW - 14} y="0" width="14" height={H} fill="url(#m38-edge)"/><rect x={PW} y="0" width="14" height={H} fill="url(#m38-edgeR)"/>
          <rect x={PW - 2} y="0" width="4" height={H} fill="#fff7dd"/>
        </g>
      </svg>
      <PaperFinish id="s38pf" grain={0.5} vignette={0.3}/>
      {/* labels (safe box) */}
      <div style={{position: "absolute", left: 96, top: 84 - (1 - pOld) * 12, opacity: pOld * (1 - 0.35 * aOut), padding: "14px 26px", borderRadius: 16, background: "rgba(246,246,242,.9)", border: "1.5px solid rgba(80,100,130,.5)", boxShadow: "0 20px 40px -20px rgba(10,30,60,.6)"}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 16, letterSpacing: "0.22em", color: "#5a6f88"}}>THE OLD PICTURE</div>
        <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 32, color: "#3a4c63", letterSpacing: "0.01em"}}>A giant sea breeze</div>
      </div>
      <div style={{position: "absolute", left: 1008, top: 84 - (1 - pLabel) * 14, opacity: pLabel, width: 770, padding: "16px 28px", borderRadius: 18, background: "linear-gradient(160deg, rgba(255,252,243,.95), rgba(255,240,208,.88))", border: "1.5px solid rgba(200,120,40,.6)", boxShadow: "0 0 50px rgba(255,200,100,.55), 0 24px 46px -20px rgba(10,30,60,.7)"}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 18, letterSpacing: "0.22em", color: "#b8561a"}}>NEWER VIEW</div>
        <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 40, lineHeight: 1.12, color: "#6e2e0c", letterSpacing: "0.01em"}}>THE RAIN BELT MOVING NORTH</div>
      </div>
      <div style={{position: "absolute", left: 1008, top: 868, opacity: pWind, padding: "10px 20px", borderRadius: 12, background: "rgba(14,40,76,.78)", border: "1px solid rgba(255,230,170,.5)", fontFamily: SANS, fontWeight: 700, fontSize: 16, letterSpacing: "0.16em", color: "#fff"}}>THE BELT FOLLOWS THE SUN; THE TRADES ARE PULLED ACROSS</div>
    </AbsoluteFill>
  );
};
export const S038: React.FC<{f: number}> = ({f}) => <Fonts><SceneS038 f={f}/></Fonts>;
