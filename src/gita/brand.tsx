// "Gita in Ink" channel brand, drawn in code (AK, 22 Oct 2026: name final, handle @Gita-in-ink).
// The mark: a peacock-feather eye (Krishna's symbol in our videos) shaped as an ink drop, its shaft a pen stroke.
// Stills: GITA-logo (800, profile picture), GITA-watermark (150), GITA-banner (2560 x 1440, text inside YouTube's
// 1546 x 423 safe area), GITA-banner-guides (the same with the safe areas outlined), GITA-thumb-g15 (1280 x 720).
import React from "react";
import {AbsoluteFill, random} from "remotion";
import {DEVA, SANS, SERIF, useGitaFonts} from "./fonts";
import {EMBER, GOLD, INDIGO, NIGHT, PAPER, SAFFRON} from "./kit";

const DROP = "M 0 -150 C 40 -95 96 -40 96 22 C 96 82 52 122 0 122 C -52 122 -96 82 -96 22 C -96 -40 -40 -95 0 -150 Z";
const scaleDrop = (k: number) => `M 0 ${-150 * k} C ${40 * k} ${-95 * k} ${96 * k} ${-40 * k} ${96 * k} ${22 * k} C ${96 * k} ${82 * k} ${52 * k} ${122 * k} 0 ${122 * k} ` +
  `C ${-52 * k} ${122 * k} ${-96 * k} ${82 * k} ${-96 * k} ${22 * k} C ${-96 * k} ${-40 * k} ${-40 * k} ${-95 * k} 0 ${-150 * k} Z`;

// The mark, centred on (0, 0), about 340 px tall at s = 1.
export const Mark: React.FC<{s?: number; barbs?: boolean}> = ({s = 1, barbs = true}) => (
  <g transform={`scale(${s})`}>
    {barbs && Array.from({length: 22}).map((_, i) => {
      const y = 130 + i * 9, l = 62 - i * 2.4;
      return <path key={i} d={`M 0 ${y} Q ${-l * 0.5} ${y - l * 0.35} ${-l} ${y - l * 0.75} M 0 ${y} Q ${l * 0.5} ${y - l * 0.35} ${l} ${y - l * 0.75}`}
        stroke="#5f8f3a" strokeWidth={2.2} fill="none" opacity={0.8}/>;
    })}
    <path d="M 0 118 C 3 170 -2 230 -6 330" stroke={PAPER} strokeWidth={6} strokeLinecap="round" fill="none"/>
    <path d="M -6 330 l -7 -16 l 14 0 Z" fill={PAPER}/>
    <path d={DROP} fill="#3f7a2a"/>
    <path d={scaleDrop(0.78)} fill={GOLD} transform="translate(0 12)"/>
    <path d={scaleDrop(0.6)} fill="#1f7f7a" transform="translate(0 22)"/>
    <path d={scaleDrop(0.36)} fill="#16245e" transform="translate(0 34)"/>
    <ellipse cx={-12} cy={14} rx={9} ry={13} fill="#fff" opacity={0.55}/>
  </g>
);

const Grainy: React.FC<{id: string; o?: number}> = ({id, o = 0.08}) => (
  <svg width="100%" height="100%" style={{position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: o}}>
    <filter id={`g-${id}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={9}/><feColorMatrix type="saturate" values="0"/></filter>
    <rect width="100%" height="100%" filter={`url(#g-${id})`}/>
  </svg>
);

export const Logo: React.FC = () => {
  useGitaFonts();
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, ${INDIGO} 0%, ${NIGHT} 72%)`}}>
      <svg width={800} height={800} style={{position: "absolute"}}>
        <circle cx={400} cy={400} r={330} fill="none" stroke={GOLD} strokeWidth={4} opacity={0.55}/>
        <circle cx={400} cy={360} r={190} fill={SAFFRON} opacity={0.16}/>
        <g transform="translate(400 330)"><Mark s={1.05}/></g>
      </svg>
      <Grainy id="logo"/>
    </AbsoluteFill>
  );
};

export const Watermark: React.FC = () => (
  <AbsoluteFill style={{background: "transparent"}}>
    <svg width={150} height={150} style={{position: "absolute"}}>
      <circle cx={75} cy={75} r={70} fill={NIGHT} opacity={0.85}/>
      <g transform="translate(75 62) scale(0.22)"><Mark barbs={false}/></g>
    </svg>
  </AbsoluteFill>
);

const Wordmark: React.FC<{size: number}> = ({size}) => (
  <div style={{fontFamily: SERIF, fontSize: size, color: PAPER, lineHeight: 1, whiteSpace: "nowrap"}}>
    Gita <span style={{fontStyle: "italic", color: SAFFRON}}>in</span> Ink
  </div>
);

export const Banner: React.FC<{guides?: boolean}> = ({guides}) => {
  useGitaFonts();
  const W = 2560, H = 1440, sx = (W - 1546) / 2, sy = (H - 423) / 2;
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, ${INDIGO} 0%, ${NIGHT} 70%)`}}>
      <svg width={W} height={H} style={{position: "absolute"}}>
        <defs><filter id="bglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={30}/></filter></defs>
        {/* dawn band and two armies in silhouette, outside the safe area (shown on TVs only) */}
        <rect x={0} y={1180} width={W} height={260} fill="#1a1230"/>
        <ellipse cx={W / 2} cy={1180} rx={900} ry={120} fill={EMBER} opacity={0.35} filter="url(#bglow)"/>
        {Array.from({length: 120}).map((_, i) => { const x = (i / 120) * W + random(`bx${i}`) * 14; if (Math.abs(x - W / 2) < 240) return null;
          return <line key={i} x1={x} y1={1180} x2={x + 3} y2={1080 - random(`by${i}`) * 50} stroke="#2a1f3f" strokeWidth={3}/>; })}
        {Array.from({length: 160}).map((_, i) => <circle key={i} cx={random(`sx${i}`) * W} cy={random(`sy${i}`) * 1000} r={0.8 + random(`sr${i}`) * 1.8}
          fill={PAPER} opacity={0.15 + 0.3 * random(`so${i}`)}/>)}
        {/* palm-leaf strip behind the safe area */}
        <path d={`M ${sx - 120} ${H / 2} C ${sx - 120} ${sy - 10} ${sx - 40} ${sy - 30} ${sx + 120} ${sy - 30} L ${sx + 1546 - 120} ${sy - 30} C ${sx + 1546 + 40} ${sy - 30} ${sx + 1546 + 120} ${sy - 10} ${sx + 1546 + 120} ${H / 2} ` +
          `C ${sx + 1546 + 120} ${sy + 433} ${sx + 1546 + 40} ${sy + 453} ${sx + 1546 - 120} ${sy + 453} L ${sx + 120} ${sy + 453} C ${sx - 40} ${sy + 453} ${sx - 120} ${sy + 433} ${sx - 120} ${H / 2} Z`}
          fill="#e8d49e" opacity={0.08}/>
        <circle cx={W / 2} cy={H / 2} r={260} fill={SAFFRON} opacity={0.08} filter="url(#bglow)"/>
        <g transform={`translate(${sx + 230} ${H / 2 - 60}) scale(0.74)`}><Mark/></g>
        {/* mala: 18 beads along the foot of the safe area */}
        {Array.from({length: 18}).map((_, i) => <circle key={i} cx={sx + 470 + i * 34 + Math.floor(i / 6) * 22} cy={sy + 395} r={7} fill={GOLD} opacity={0.85}/>)}
        {guides && <>
          <rect x={sx} y={sy} width={1546} height={423} fill="none" stroke="#00e5ff" strokeWidth={4} strokeDasharray="16 10"/>
          <rect x={(W - 2048) / 2} y={sy} width={2048} height={423} fill="none" stroke="#ff4d6d" strokeWidth={3} strokeDasharray="10 10"/>
        </>}
      </svg>
      <div style={{position: "absolute", left: sx + 430, top: sy + 40}}>
        <div style={{fontFamily: DEVA, fontSize: 52, color: GOLD, lineHeight: 1.1}}>श्रीमद्भगवद्गीता</div>
        <Wordmark size={176}/>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: 3, color: PAPER, opacity: 0.85, marginTop: 14}}>
          The Bhagavad Gita, verse by verse, drawn in ink</div>
      </div>
      <Grainy id="banner" o={0.06}/>
    </AbsoluteFill>
  );
};

// Thumbnail for the 15-minute video: one object (the feather-drop), three to five words, no deity face.
export const ThumbG15: React.FC = () => {
  useGitaFonts();
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 72% 55%, #a1563f 0%, ${INDIGO} 45%, ${NIGHT} 100%)`}}>
      <svg width={1280} height={720} style={{position: "absolute"}}>
        <circle cx={960} cy={330} r={230} fill={SAFFRON} opacity={0.22}/>
        <g transform="translate(960 300) scale(1.25)"><Mark/></g>
        <path d="M 120 610 L 1180 610" stroke={GOLD} strokeWidth={2} opacity={0.5}/>
        {Array.from({length: 18}).map((_, i) => <circle key={i} cx={128 + i * 34 + Math.floor(i / 6) * 20} cy={660} r={9} fill={GOLD}/>)}
      </svg>
      <div style={{position: "absolute", left: 70, top: 110, width: 720}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 6, color: SAFFRON}}>ALL 18 CHAPTERS</div>
        <div style={{fontFamily: SERIF, fontSize: 132, color: PAPER, lineHeight: 0.98, marginTop: 10}}>The Gita in 15 minutes</div>
        <div style={{fontFamily: DEVA, fontSize: 40, color: GOLD, marginTop: 22}}>श्रीमद्भगवद्गीता</div>
      </div>
      <Grainy id="thumb" o={0.07}/>
    </AbsoluteFill>
  );
};
