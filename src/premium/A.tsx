// Treatment A: premium 2.5D vector. Layered depth with a slow parallax camera, soft gradient lighting (sky glow, rim light,
// long soft shadows), film grain, spring physics, particles and kinetic numbers with real motion blur. All code-drawn.
import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {B1, B2, FONT, Grain, H, KineticNumber, Label, M1, MBlur, NUM, Vignette, W, inOut, lin, outQuint, particles, spr, wave} from "./common";

const C = {ink: "#14303F", sun: "#FFF2CF", water1: "#7FD3E3", water2: "#2A8FB0", water3: "#155E7E", grass1: "#B5DA74", grass2: "#6FAE55",
  stoneL: "#FFF6E6", stoneR: "#D4BC98", roofL: "#F28C5C", roofR: "#B0452D", gold: "#FFC93C"};

// ---------- defs: every gradient lives here once (ids are document-wide) ----------
const Defs: React.FC = () => (
  <svg width={0} height={0} style={{position: "absolute"}}>
    <defs>
      <linearGradient id="pa-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3B6FA0"/><stop offset="0.38" stopColor="#86C0E2"/><stop offset="0.66" stopColor="#F9E3BE"/><stop offset="1" stopColor="#F7C891"/>
      </linearGradient>
      <radialGradient id="pa-sunglow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#FFF8E1" stopOpacity="1"/><stop offset="0.25" stopColor="#FFE8B0" stopOpacity="0.75"/><stop offset="1" stopColor="#FFD58A" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id="pa-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0.3" stopColor="#FFFFFF"/><stop offset="1" stopColor="#F6D6C2"/></linearGradient>
      <linearGradient id="pa-far" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8DB2CD"/><stop offset="1" stopColor="#C9DCE3"/></linearGradient>
      <linearGradient id="pa-mid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6FA38E"/><stop offset="1" stopColor="#A7C99A"/></linearGradient>
      <linearGradient id="pa-meadow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B9DB7C"/><stop offset="0.5" stopColor="#8EC266"/><stop offset="1" stopColor="#5E9B4A"/></linearGradient>
      <linearGradient id="pa-bank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F4DCA8"/><stop offset="1" stopColor="#D2A86C"/></linearGradient>
      <linearGradient id="pa-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.water1}/><stop offset="0.45" stopColor={C.water2}/><stop offset="1" stopColor={C.water3}/></linearGradient>
      <linearGradient id="pa-hill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#C7E68A"/><stop offset="0.45" stopColor="#7DB95A"/><stop offset="1" stopColor="#3F7E45"/></linearGradient>
      <linearGradient id="pa-stone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={C.stoneL}/><stop offset="0.55" stopColor="#EADBC2"/><stop offset="1" stopColor={C.stoneR}/></linearGradient>
      <linearGradient id="pa-stoneflat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#F7EAD3"/><stop offset="1" stopColor="#DCC6A4"/></linearGradient>
      <linearGradient id="pa-roof" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={C.roofL}/><stop offset="0.6" stopColor="#D8633F"/><stop offset="1" stopColor={C.roofR}/></linearGradient>
      <radialGradient id="pa-win" cx="0.5" cy="0.6" r="0.6"><stop offset="0" stopColor="#FFE9A8"/><stop offset="1" stopColor="#E8A040"/></radialGradient>
      <radialGradient id="pa-ao" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#0B2A2A" stopOpacity="0.45"/><stop offset="1" stopColor="#0B2A2A" stopOpacity="0"/></radialGradient>
      <linearGradient id="pa-road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F2D6A0"/><stop offset="1" stopColor="#D9AE70"/></linearGradient>
      <linearGradient id="pa-shopF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF8EC"/><stop offset="1" stopColor="#EEDDC2"/></linearGradient>
      <linearGradient id="pa-shopS" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#D9C4A2"/><stop offset="1" stopColor="#BFA57F"/></linearGradient>
      <linearGradient id="pa-bush" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4F8E4A"/><stop offset="1" stopColor="#21502F"/></linearGradient>
      <linearGradient id="pa-coinSide" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#FFE38A"/><stop offset="0.18" stopColor="#FFD050"/><stop offset="0.6" stopColor="#E7A928"/><stop offset="1" stopColor="#A86E12"/>
      </linearGradient>
      <radialGradient id="pa-coinTop" cx="0.38" cy="0.35" r="0.75"><stop offset="0" stopColor="#FFF2B8"/><stop offset="0.5" stopColor="#FFD24F"/><stop offset="1" stopColor="#E0A021"/></radialGradient>
      <linearGradient id="pa-plinth" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#F3E6CF"/><stop offset="0.6" stopColor="#D9C6A6"/><stop offset="1" stopColor="#A9926F"/></linearGradient>
      <linearGradient id="pa-wcol" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8BE0EE"/><stop offset="0.4" stopColor="#3AA9C9"/><stop offset="1" stopColor="#176A8C"/></linearGradient>
      <linearGradient id="pa-dive" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5CC4DC"/><stop offset="0.3" stopColor="#1E7FA3"/><stop offset="1" stopColor="#0C3F5E"/></linearGradient>
      <radialGradient id="pa-tree" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#B4DE78"/><stop offset="0.5" stopColor="#5E9E4C"/><stop offset="1" stopColor="#2C6337"/></radialGradient>
      <linearGradient id="pa-haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF4DE" stopOpacity="0"/><stop offset="0.6" stopColor="#FFF4DE" stopOpacity="0.45"/><stop offset="1" stopColor="#FFF4DE" stopOpacity="0"/></linearGradient>
      <linearGradient id="pa-ray" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFF3C8" stopOpacity="0.55"/><stop offset="1" stopColor="#FFF3C8" stopOpacity="0"/></linearGradient>
      <clipPath id="pa-waterclip"><ellipse cx={960} cy={668} rx={700} ry={122}/></clipPath>
    </defs>
  </svg>
);

// A camera layer: depth d scales the push and lateral drift (far layers move less = parallax).
const Layer: React.FC<{push: number; drift: number; d: number; fx?: number; fy?: number; blur?: number; children: React.ReactNode}> =
  ({push, drift, d, fx = 960, fy = 500, blur, children}) => (
    <AbsoluteFill style={{transform: `translate(${-drift * d}px, ${-drift * 0.25 * d}px) scale(${1 + push * d})`, transformOrigin: `${fx}px ${fy}px`, filter: blur ? `blur(${blur}px)` : undefined}}>
      {children}
    </AbsoluteFill>
  );
const Svg: React.FC<{children: React.ReactNode}> = ({children}) => <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", overflow: "visible"}}>{children}</svg>;

const Cloud: React.FC<{x: number; y: number; s: number; o?: number}> = ({x, y, s, o = 0.95}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={18} rx={150} ry={30} fill="url(#pa-cloud)"/>
    <circle cx={-70} cy={0} r={46} fill="url(#pa-cloud)"/><circle cx={-10} cy={-22} r={64} fill="url(#pa-cloud)"/>
    <circle cx={62} cy={-4} r={50} fill="url(#pa-cloud)"/><circle cx={110} cy={12} r={30} fill="url(#pa-cloud)"/>
  </g>
);
const Tree: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={34} cy={2} rx={70} ry={10} fill="url(#pa-ao)"/>
    <rect x={-6} y={-46} width={12} height={48} rx={4} fill="#7A5236"/>
    <circle cx={-22} cy={-70} r={34} fill="url(#pa-tree)"/><circle cx={22} cy={-66} r={30} fill="url(#pa-tree)"/><circle cx={0} cy={-98} r={36} fill="url(#pa-tree)"/>
    <path d="M -50 -78 A 34 34 0 0 1 -14 -126" fill="none" stroke="#E8F8B0" strokeWidth={3} opacity={0.6}/>
  </g>
);
// Slow god-rays from the sun.
const Rays: React.FC<{f: number; x: number; y: number}> = ({f, x, y}) => (
  <g style={{mixBlendMode: "screen"}}>
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const a = 8 + i * 13 + Math.sin(f * 0.012 + i) * 3;
      return <path key={i} d="M 0 -10 L 1500 -70 L 1500 70 L 0 10 Z" fill="url(#pa-ray)" opacity={0.18 + 0.1 * Math.sin(f * 0.03 + i * 2)} transform={`translate(${x} ${y}) rotate(${a})`}/>;
    })}
  </g>
);
const Bird: React.FC<{x: number; y: number; f: number; s?: number}> = ({x, y, f, s = 1}) => {
  const w = Math.sin(f * 0.45) * 9;
  return <path d={`M ${x - 16 * s} ${y + w * s * 0.6} Q ${x - 7 * s} ${y - 4 * s} ${x} ${y + 3 * s} Q ${x + 7 * s} ${y - 4 * s} ${x + 16 * s} ${y + w * s * 0.6}`} fill="none" stroke="#2F4A5E" strokeWidth={3 * s} strokeLinecap="round" opacity={0.7}/>;
};

// ---------- the castle: lit from the upper left, rim light on lit edges, glowing windows, waving flags ----------
const Tower: React.FC<{x: number; top: number; w: number; base: number; roofH: number; f: number; flag?: boolean}> = ({x, top, w, base, roofH, f, flag}) => {
  const fl = Math.sin(f * 0.18 + x) * 6;
  return (
    <g>
      <rect x={x - w / 2} y={top} width={w} height={base - top} fill="url(#pa-stone)"/>
      <rect x={x - w / 2} y={top} width={3} height={base - top} fill="#FFFDF6" opacity={0.9}/>
      {[0, 1, 2].map((i) => <line key={i} x1={x - w / 2 + 8 + i * 9} y1={top + 40 + i * 34} x2={x - w / 2 + 22 + i * 9} y2={top + 40 + i * 34} stroke="#C2A982" strokeWidth={2} opacity={0.5}/>)}
      <path d={`M ${x - 6} ${top + 34} v -8 a 6 6 0 0 1 12 0 v 8 Z`} fill="url(#pa-win)"/>
      <ellipse cx={x} cy={top} rx={w / 2 + 6} ry={6} fill="#8E3A24"/>
      <path d={`M ${x - w / 2 - 6} ${top} L ${x} ${top - roofH} L ${x + w / 2 + 6} ${top} Z`} fill="url(#pa-roof)"/>
      <path d={`M ${x - w / 2 - 6} ${top} L ${x} ${top - roofH}`} stroke="#FFC9A6" strokeWidth={2.5} opacity={0.8}/>
      {flag ? <g>
        <line x1={x} y1={top - roofH} x2={x} y2={top - roofH - 34} stroke="#5A3A2A" strokeWidth={3}/>
        <path d={`M ${x} ${top - roofH - 34} Q ${x + 14} ${top - roofH - 38 + fl} ${x + 30} ${top - roofH - 31 - fl * 0.5} L ${x + 28} ${top - roofH - 20 - fl * 0.4} Q ${x + 14} ${top - roofH - 24 + fl} ${x} ${top - roofH - 20} Z`} fill="#E5483A"/>
      </g> : null}
    </g>
  );
};
const Merlons: React.FC<{x0: number; x1: number; y: number; w?: number}> = ({x0, x1, y, w = 14}) => {
  const n = Math.floor((x1 - x0) / (w * 1.8));
  return <>{Array.from({length: n}).map((_, i) => <rect key={i} x={x0 + i * w * 1.8 + 2} y={y - 14} width={w} height={14} fill="url(#pa-stoneflat)"/>)}</>;
};
const Castle: React.FC<{f: number}> = ({f}) => (
  <g transform="translate(960 528) scale(0.86)">
    {/* long soft shadow cast to the right, onto the hill */}
    <ellipse cx={120} cy={4} rx={230} ry={20} fill="url(#pa-ao)"/>
    <Tower x={0} top={-262} w={66} base={-60} roofH={96} f={f} flag/>
    <rect x={-112} y={-124} width={224} height={124} fill="url(#pa-stoneflat)"/>
    <Merlons x0={-112} x1={112} y={-124}/>
    <Tower x={-122} top={-176} w={62} base={0} roofH={78} f={f + 9} flag/>
    <Tower x={122} top={-176} w={62} base={0} roofH={78} f={f + 17} flag/>
    <rect x={-54} y={-158} width={108} height={158} fill="url(#pa-stone)"/>
    <rect x={-54} y={-158} width={3} height={158} fill="#FFFDF6"/>
    <Merlons x0={-54} x1={56} y={-158} w={13}/>
    <path d="M -20 0 v -40 a 20 20 0 0 1 40 0 v 40 Z" fill="#6E4A31"/>
    <path d="M -14 0 v -38 a 14 14 0 0 1 28 0 v 38 Z" fill="#8A5E3E"/>
    {[-30, 30].map((x) => <path key={x} d={`M ${x - 8} -96 v -14 a 8 8 0 0 1 16 0 v 14 Z`} fill="url(#pa-win)"/>)}
  </g>
);

// ---------- 2.5D shop: front, side, roof, scalloped awning, lit window, soft contact shadow ----------
const Shop: React.FC<{x: number; y: number; s?: number; awn: string; awn2?: string; o?: number}> = ({x, y, s = 1, awn, awn2 = "#FFFFFF", o = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <ellipse cx={30} cy={4} rx={120} ry={16} fill="url(#pa-ao)"/>
    <path d="M 70 0 L 96 -14 L 96 -112 L 70 -100 Z" fill="url(#pa-shopS)"/>
    <rect x={-70} y={-100} width={140} height={100} fill="url(#pa-shopF)"/>
    <rect x={-70} y={-100} width={3} height={100} fill="#FFFFFF"/>
    <path d="M -80 -100 L -60 -130 L 110 -130 L 96 -112 L 70 -100 Z" fill="#B4553A"/>
    <path d="M -80 -100 L -60 -130 L 104 -130 L 80 -100 Z" fill="url(#pa-roof)"/>
    {Array.from({length: 7}).map((_, i) => (
      <path key={i} d={`M ${-76 + i * 22} -96 h 22 v 22 a 11 9 0 0 1 -22 0 Z`} fill={i % 2 ? awn2 : awn}/>
    ))}
    <rect x={-76} y={-96} width={154} height={6} fill="#000" opacity={0.08}/>
    <rect x={-56} y={-62} width={56} height={40} rx={4} fill="url(#pa-win)"/>
    {[-46, -32, -18].map((cx, i) => <circle key={cx} cx={cx} cy={-30} r={7} fill={i === 1 ? "#7DBB4C" : "#F08A2A"}/>)}
    <rect x={14} y={-60} width={34} height={60} rx={3} fill="#7A5338"/>
    <rect x={-70} y={-6} width={140} height={6} fill="#000" opacity={0.08}/>
  </g>
);

// ---------- Moment 1: the establishing shot ----------
const Moment1: React.FC<{f: number}> = ({f}) => {
  const push = lin(f, 0, M1, 0, 0.17, inOut);
  const drift = lin(f, 0, M1, 0, 26, inOut);
  const shimmer = particles("shim", 70);
  const motes = particles("mote", 38);
  const A = 470, ROADY = 900, copies = [300, 640, 810];
  const moatGlow = lin(f, B1.moat, B1.moat + 30, 0, 1) * lin(f, B1.moat + 40, M1, 1, 0.5);
  return (
    <AbsoluteFill>
      <Layer push={push} drift={drift} d={0.15}>
        <Svg>
          <rect width={W} height={H} fill="url(#pa-sky)"/>
          <circle cx={440} cy={300} r={520} fill="url(#pa-sunglow)"/>
          <Rays f={f} x={440} y={300}/>
          <circle cx={440} cy={300} r={58} fill={C.sun}/>
          <Cloud x={260 + f * 0.25} y={190} s={1.1}/><Cloud x={1380 + f * 0.18} y={150} s={0.9} o={0.85}/><Cloud x={1700 + f * 0.3} y={300} s={0.6} o={0.75}/>
        </Svg>
      </Layer>
      <Layer push={push} drift={drift} d={0.32}>
        <Svg>
          {[0, 1, 2].map((i) => <Bird key={i} x={1100 + i * 60 - f * 1.4} y={250 + (i % 2) * 26} f={f + i * 7} s={0.9}/>)}
          <path d="M 0 610 C 180 520 320 540 470 575 C 640 610 760 520 960 540 C 1180 560 1300 500 1500 545 C 1680 585 1800 540 1920 560 L 1920 700 L 0 700 Z" fill="url(#pa-far)"/>
        </Svg>
      </Layer>
      <Layer push={push} drift={drift} d={0.55}>
        <Svg>
          <path d="M 0 640 C 220 585 380 600 560 630 C 760 662 860 600 1050 610 C 1250 620 1420 580 1640 615 C 1780 638 1860 620 1920 628 L 1920 760 L 0 760 Z" fill="url(#pa-mid)"/>
          <path d="M 0 640 C 220 585 380 600 560 630" fill="none" stroke="#E6F3C8" strokeWidth={3} opacity={0.55}/>
          {[[150, 640, 0.42], [215, 632, 0.5], [1690, 636, 0.46], [1770, 630, 0.38], [1260, 628, 0.34]].map(([x, y, k], i) => <Tree key={i} x={x} y={y} s={k}/>)}
          <rect x={-100} y={540} width={W + 200} height={170} fill="url(#pa-haze)"/>
        </Svg>
      </Layer>
      <Layer push={push} drift={drift} d={1}>
        <Svg>
          <rect x={-200} y={632} width={W + 400} height={500} fill="url(#pa-meadow)"/>
          {[[140, 700, 0.85], [60, 735, 0.7], [1790, 700, 0.8], [1870, 740, 0.62]].map(([x, y, k], i) => <Tree key={i} x={x} y={y} s={k}/>)}
          <ellipse cx={960} cy={674} rx={728} ry={138} fill="url(#pa-bank)"/>
          <ellipse cx={960} cy={668} rx={700} ry={122} fill="url(#pa-water)"/>
          <g clipPath="url(#pa-waterclip)">
            {/* reflection of the hill, then moving highlights and a sun glint path */}
            <path d="M 650 672 C 760 720 860 760 960 762 C 1060 760 1160 720 1270 672 Z" fill="#2E7A5A" opacity={0.28}/>
            {shimmer.map((p, i) => {
              const x = 280 + p.x * 1360, y = 560 + p.y * 230, o = 0.25 + 0.55 * Math.max(0, Math.sin(f * 0.09 + p.p));
              const near = x < 760 ? 1.4 : 1;
              return <rect key={i} x={x + Math.sin(f * 0.03 + p.p) * 10} y={y} width={(14 + p.r * 40) * near} height={2.4} rx={1.2} fill="#F2FEFF" opacity={o * 0.8}/>;
            })}
            <ellipse cx={960} cy={668} rx={700} ry={122} fill="none" stroke="#EFFFFF" strokeWidth={7} strokeDasharray="260 4000"
              strokeDashoffset={-f * 18} opacity={moatGlow * 0.9}/>
            <ellipse cx={960} cy={668} rx={700} ry={122} fill="#BFF3FF" opacity={moatGlow * 0.12}/>
          </g>
          <ellipse cx={960} cy={668} rx={700} ry={122} fill="none" stroke="#FFFFFF" strokeWidth={2} opacity={0.35}/>
          {/* the island hill rising from the water, rim lit on its upper-left edge */}
          <path d="M 640 676 C 700 610 790 528 960 520 C 1130 528 1220 610 1280 676 Q 960 712 640 676 Z" fill="url(#pa-hill)"/>
          <path d="M 640 676 C 700 610 790 528 960 520" fill="none" stroke="#F3FFB8" strokeWidth={5} opacity={0.7}/>
          <path d="M 640 676 Q 960 712 1280 676" fill="none" stroke="#0E4A55" strokeWidth={4} opacity={0.35}/>
          <ellipse cx={960} cy={528} rx={150} ry={14} fill="#86BE5C"/>
          <Castle f={f}/>
        </Svg>
        {/* the word MOAT, rising out of the water once, letter by letter, with motion blur */}
        {f >= B1.moat ? <MBlur f={f} render={(t) => (
          <div style={{position: "absolute", left: 960, top: 742, transform: "translate(-50%, -50%)", display: "flex", gap: 6}}>
            {"MOAT".split("").map((ch, i) => {
              const s = spr(t, B1.moat + i * 4, 11, 150);
              return <span key={i} style={{display: "inline-block", fontFamily: FONT, fontWeight: 800, fontSize: 104, color: "#FFFFFF", letterSpacing: 10,
                transform: `translateY(${(1 - s) * 70}px) scaleY(${0.7 + 0.3 * s})`, opacity: Math.min(1, s * 1.8), textShadow: "0 8px 22px rgba(6,50,70,0.55), 0 0 2px rgba(6,50,70,0.4)"}}>{ch}</span>;
            })}
          </div>)}/> : null}
      </Layer>
      <Layer push={push} drift={drift} d={1.22}>
        <Svg>
          <path d="M -200 812 Q 960 770 2120 812 L 2120 1300 L -200 1300 Z" fill="url(#pa-meadow)"/>
          <path d="M -200 882 Q 960 852 2120 882 L 2120 944 Q 960 920 -200 944 Z" fill="url(#pa-road)"/>
          <path d="M -200 882 Q 960 852 2120 882" fill="none" stroke="#FFF1CF" strokeWidth={3} opacity={0.7}/>
          {particles("tuft", 40).map((p, i) => <path key={i} d={`M ${p.x * 1920} ${960 + p.y * 120} q 4 -18 ${6 + p.r * 6} -${22 + p.s * 12}`} stroke="#5E9845" strokeWidth={3} fill="none" opacity={0.6}/>)}
          {/* shop B: stays alone, in its own warm light */}
          {f >= B1.alone ? <circle cx={1500} cy={850} r={150} fill="url(#pa-sunglow)" opacity={lin(f, B1.alone, B1.alone + 20, 0, 0.75)}/> : null}
          {copies.map((cx, i) => {
            const st = B1.copy[i]; if (f < st) return null;
            const s = spr(f, st, 12, 130);
            return <Shop key={i} x={A + (cx - A) * s} y={ROADY + 10 - Math.sin(Math.min(1, s) * Math.PI) * 40} s={0.88 * (0.5 + 0.5 * s)} awn="#D9786A" o={lin(f, st, st + 8, 0, 1)}/>;
          })}
          {f >= B1.shops ? <Shop x={A} y={ROADY + 10} s={0.95 * (0.4 + 0.6 * spr(f, B1.shops, 12, 140))} awn="#E25B45"/> : null}
          {f >= B1.shops + 8 ? <Shop x={1500} y={ROADY + 10} s={0.95 * (0.4 + 0.6 * spr(f, B1.shops + 8, 12, 140))} awn="#2E9C8F"/> : null}
          {/* puffs where each copy springs out */}
          {B1.copy.map((st, i) => f >= st && f < st + 22 ? particles("puff" + i, 9).map((p, j) => {
            const k = (f - st) / 22, a = p.p;
            return <circle key={i + "-" + j} cx={A + Math.cos(a) * 90 * k} cy={ROADY - 50 + Math.sin(a) * 50 * k} r={(10 + p.r * 12) * (1 - k * 0.6)} fill="#FFFFFF" opacity={(1 - k) * 0.7}/>;
          }) : null)}
        </Svg>
      </Layer>
      <Layer push={push} drift={drift} d={1.75} blur={4}>
        <Svg>
          <path d="M -60 1100 C -40 960 60 930 140 960 C 200 900 300 930 320 1000 C 380 990 420 1040 410 1100 Z" fill="url(#pa-bush)"/>
          <path d="M 1560 1100 C 1580 980 1680 950 1760 985 C 1820 930 1940 950 1990 1020 L 1990 1100 Z" fill="url(#pa-bush)"/>
        </Svg>
      </Layer>
      {/* floating pollen and dust caught in the light */}
      <AbsoluteFill>
        <Svg>
          {motes.map((p, i) => {
            const x = (p.x * 2100 + f * (0.4 + p.s) * 1.2) % 2100 - 90, y = 140 + p.y * 820 + Math.sin(f * 0.04 + p.p) * 16;
            return <circle key={i} cx={x} cy={y} r={1.5 + p.r * 3.5} fill="#FFF6D2" opacity={0.25 + 0.45 * Math.abs(Math.sin(f * 0.05 + p.p))}/>;
          })}
        </Svg>
      </AbsoluteFill>
      <AbsoluteFill style={{background: "radial-gradient(ellipse 60% 55% at 23% 26%, rgba(255,226,160,0.30), rgba(255,226,160,0) 70%)", mixBlendMode: "screen"}}/>
      {/* the dive: water rises over the lens to carry us into moment 2 */}
      {f > 214 ? <Svg><path d={wave(-20, 1940, lin(f, 214, M1, 1120, -40, inOut), 18, 520, f * 0.25, 1200)} fill="url(#pa-dive)"/></Svg> : null}
    </AbsoluteFill>
  );
};

// ---------- Moment 2: the numbers ----------
const K = 11, BASE = 842, GX = 700, RX = 1220, CR = 112, CRY = 30;
const stackH = (t: number, start: number, v: number) => v * K * lin(t, start, start + 34, 0, 1, outQuint);
const CoinStack: React.FC<{cx: number; h: number; base: number}> = ({cx, h, base}) => {
  if (h <= 0.5) return null;
  const top = base - h, n = Math.floor(h / K);
  return (
    <g>
      <path d={`M ${cx - CR} ${top} L ${cx - CR} ${base} A ${CR} ${CRY} 0 0 0 ${cx + CR} ${base} L ${cx + CR} ${top} Z`} fill="url(#pa-coinSide)"/>
      {Array.from({length: n}).map((_, i) => {
        const y = base - (i + 1) * K; if (y <= top + 2) return null;
        return <g key={i}>
          <path d={`M ${cx - CR} ${y} A ${CR} ${CRY} 0 0 0 ${cx + CR} ${y}`} fill="none" stroke="#8A5A0E" strokeWidth={1.6} opacity={0.45}/>
          <path d={`M ${cx - CR} ${y + 2} A ${CR} ${CRY} 0 0 0 ${cx + CR} ${y + 2}`} fill="none" stroke="#FFF0B0" strokeWidth={1.2} opacity={0.35}/>
        </g>;
      })}
      <rect x={cx - CR} y={top} width={4} height={h} fill="#FFF6D0" opacity={0.85}/>
      <ellipse cx={cx} cy={top} rx={CR} ry={CRY} fill="url(#pa-coinTop)"/>
      <ellipse cx={cx} cy={top} rx={CR - 12} ry={CRY - 4} fill="none" stroke="#C88A1C" strokeWidth={2} opacity={0.6}/>
      <text x={cx} y={top + 10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill="#C88A1C" opacity={0.75} transform={`translate(0 ${top}) scale(1 ${CRY / CR * 1.6}) translate(0 ${-top})`}>₹</text>
    </g>
  );
};
const FallingCoins: React.FC<{cx: number; top: number; t: number; start: number}> = ({cx, top, t, start}) => {
  const k = (t - start) / 34; if (k <= 0 || k >= 0.95) return null;
  return <>{[0, 1, 2].map((i) => {
    const ph = ((t - start) / 6 + i / 3) % 1, y = top - 150 * (1 - ph * ph) - 10;
    return <g key={i} transform={`translate(${cx + (i - 1) * 16} ${y}) rotate(${(i - 1) * 18 + ph * 40})`} opacity={1 - ph * 0.3}>
      <ellipse cx={0} cy={4} rx={CR * 0.9} ry={CRY * 0.9} fill="#B07812"/><ellipse cx={0} cy={0} rx={CR * 0.9} ry={CRY * 0.9} fill="url(#pa-coinTop)"/>
    </g>;
  })}</>;
};
const Plinth: React.FC<{cx: number}> = ({cx}) => (
  <g>
    <ellipse cx={cx + 40} cy={BASE + 66} rx={230} ry={34} fill="url(#pa-ao)"/>
    <path d={`M ${cx - 150} ${BASE + 4} L ${cx - 150} ${BASE + 52} A 150 40 0 0 0 ${cx + 150} ${BASE + 52} L ${cx + 150} ${BASE + 4} Z`} fill="url(#pa-plinth)"/>
    <ellipse cx={cx} cy={BASE + 4} rx={150} ry={40} fill="#F6ECDA"/>
    <ellipse cx={cx} cy={BASE + 4} rx={150} ry={40} fill="none" stroke="#FFFFFF" strokeWidth={2} opacity={0.6}/>
  </g>
);

const Moment2: React.FC<{f: number}> = ({f}) => {
  const push = lin(f, 0, 240, 0, 0.05, inOut), drift = lin(f, 0, 240, 0, 18, inOut);
  const gTop = BASE - NUM.geico * K, rTop = BASE - NUM.rivals * K;
  const fill = lin(f, B2.fill, B2.fill + 26, 0, 1, inOut);            // water rising in the gap
  const drain = lin(f, B2.drain, B2.drain + 30, 0, 1, inOut);          // gap water pours down into a moat
  const ring = lin(f, B2.ring, B2.ring + 34, 0, 1, outQuint);
  const wTop = rTop + 6 + (gTop - rTop - 6) * (1 - fill + drain * fill);
  const motes = particles("m2", 30);
  return (
    <AbsoluteFill>
      <Layer push={push} drift={drift} d={0.3}>
        <Svg>
          <rect width={W} height={H} fill="url(#pa-sky)"/>
          <circle cx={360} cy={280} r={560} fill="url(#pa-sunglow)"/>
          <Rays f={f + 300} x={360} y={280}/>
          <Cloud x={1500 + f * 0.2} y={210} s={0.8} o={0.8}/><Cloud x={180 + f * 0.25} y={330} s={0.6} o={0.7}/>
          <path d="M 0 680 C 200 610 380 630 560 655 C 760 690 900 615 1100 630 C 1300 645 1450 600 1650 640 C 1800 665 1880 650 1920 655 L 1920 800 L 0 800 Z" fill="url(#pa-far)"/>
          {/* a small castle on the far hill ties the numbers back to the story */}
          <g transform="translate(1560 628) scale(0.28)" opacity={0.75}><Castle f={f}/></g>
          {[[200, 700, 0.6], [290, 690, 0.48], [1720, 690, 0.55], [1830, 700, 0.7]].map(([x, y, k], i) => <Tree key={i} x={x} y={y} s={k}/>)}
          <rect x={-100} y={600} width={W + 200} height={170} fill="url(#pa-haze)"/>
        </Svg>
      </Layer>
      <Layer push={push} drift={drift} d={1}>
        <Svg>
          <path d="M -200 760 Q 960 700 2120 760 L 2120 1300 L -200 1300 Z" fill="url(#pa-meadow)"/>
          <path d="M -200 760 Q 960 700 2120 760" fill="none" stroke="#E9F7B5" strokeWidth={3} opacity={0.6}/>
          {/* the moat ring that the saved money becomes */}
          {ring > 0 ? <g>
            <ellipse cx={GX} cy={BASE + 52} rx={150 + 150 * ring} ry={40 + 34 * ring} fill="url(#pa-bank)"/>
            <ellipse cx={GX} cy={BASE + 52} rx={145 + 132 * ring} ry={38 + 28 * ring} fill="url(#pa-water)"/>
            {particles("ring", 18).map((p, i) => <rect key={i} x={GX - 250 * ring + p.x * 500 * ring} y={BASE + 30 + p.y * 60 * ring} width={18 + p.r * 22} height={2.2} rx={1}
              fill="#F2FEFF" opacity={ring * (0.3 + 0.5 * Math.max(0, Math.sin(f * 0.1 + p.p)))}/>)}
          </g> : null}
          <Plinth cx={GX}/><Plinth cx={RX}/>
          <CoinStack cx={GX} h={stackH(f, B2.geico, NUM.geico)} base={BASE}/>
          <CoinStack cx={RX} h={stackH(f, B2.rivals, NUM.rivals)} base={BASE}/>
          <FallingCoins cx={GX} top={BASE - stackH(f, B2.geico, NUM.geico)} t={f} start={B2.geico}/>
          <FallingCoins cx={RX} top={BASE - stackH(f, B2.rivals, NUM.rivals)} t={f} start={B2.rivals}/>
          {/* the rivals' level carried across: a dashed line, then a glass of water filling GEICO's gap */}
          {f >= B2.line ? <line x1={RX + CR} y1={rTop} x2={RX + CR - (RX - GX + CR * 2 + 40) * lin(f, B2.line, B2.line + 16, 0, 1)} y2={rTop}
            stroke="#FFFFFF" strokeWidth={4} strokeDasharray="14 12" strokeLinecap="round" opacity={0.9 * (1 - drain)}/> : null}
          {f >= B2.fill ? <g opacity={1 - drain}>
            <path d={`M ${GX - CR} ${rTop} L ${GX - CR} ${gTop} A ${CR} ${CRY} 0 0 0 ${GX + CR} ${gTop} L ${GX + CR} ${rTop}`} fill="#FFFFFF" fillOpacity={0.12} stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={2}/>
            <ellipse cx={GX} cy={rTop} rx={CR} ry={CRY} fill="none" stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={2}/>
          </g> : null}
          {f >= B2.fill && wTop < gTop - 1 ? <g>
            <path d={`M ${GX - CR} ${wTop} L ${GX - CR} ${gTop} A ${CR} ${CRY} 0 0 0 ${GX + CR} ${gTop} L ${GX + CR} ${wTop} Z`} fill="url(#pa-wcol)" opacity={0.92}/>
            <ellipse cx={GX} cy={wTop} rx={CR} ry={CRY} fill="#9DEBF5"/>
            <path d={wave(GX - CR + 10, GX + CR - 10, wTop, 3, 60, f * 0.3)} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.7}/>
          </g> : null}
          {/* pouring streams while the gap drains into the ring */}
          {drain > 0 && drain < 1 ? [-1, 1].map((sd) => (
            <path key={sd} d={`M ${GX + sd * (CR - 6)} ${wTop + 6} Q ${GX + sd * (CR + 40)} ${wTop + 40} ${GX + sd * (CR + 60)} ${BASE + 40}`} stroke="#5CC8E0" strokeWidth={14 * (1 - drain * 0.5)} fill="none" strokeLinecap="round" opacity={0.85}/>
          )) : null}
          {/* a flag lands on GEICO's stack once its moat is full */}
          {f >= B2.ring + 22 ? (() => {
            const s = spr(f, B2.ring + 22, 10, 160), fl = Math.sin(f * 0.2) * 6;
            return <g transform={`translate(${GX} ${gTop}) scale(${s})`}>
              <line x1={0} y1={0} x2={0} y2={-90} stroke="#5A3A2A" strokeWidth={5}/>
              <path d={`M 0 -90 Q 26 ${-96 + fl} 56 ${-84 - fl} L 52 ${-60 - fl} Q 26 ${-68 + fl} 0 -62 Z`} fill="#E5483A"/>
            </g>;
          })() : null}
        </Svg>
        {/* labels and kinetic numbers live in the same depth layer as the stacks */}
        <Label f={f} start={B2.geico - 4} x={GX} y={BASE + 152} text="GEICO" size={42} color="#13303F" weight={800} bg="rgba(255,255,255,0.88)" spacing={2}/>
        <Label f={f} start={B2.rivals - 4} x={RX} y={BASE + 152} text="Many rivals" size={42} color="#13303F" weight={800} bg="rgba(255,255,255,0.88)" spacing={1}/>
        <MBlur f={f} render={(t) => {
          if (t < B2.geico) return null;
          const mv = lin(t, B2.fill - 8, B2.fill + 14, 0, 1, inOut);
          const y = BASE - stackH(t, B2.geico, NUM.geico) - 80 + mv * 140, x = GX - mv * (CR + 190);
          return <KineticStatic t={t} start={B2.geico} to={NUM.geico} x={x} y={y} color="#FFFFFF"/>;
        }}/>
        <MBlur f={f} render={(t) => {
          if (t < B2.rivals) return null;
          const y = BASE - stackH(t, B2.rivals, NUM.rivals) - 80;
          return <KineticStatic t={t} start={B2.rivals} to={NUM.rivals} x={RX} y={y} color="#FFFFFF"/>;
        }}/>
        {/* the gap: ₹15 */}
        {/* ₹15 rides the water down into the moat */}
        <AbsoluteFill style={{transform: `translate(${-drain * (CR + 34 + 410)}px, ${drain * (BASE - (rTop + gTop) / 2 - 18)}px) scale(${1 - drain * 0.15})`, transformOrigin: `${GX + CR + 34}px ${(rTop + gTop) / 2}px`}}>
          <KineticNumber f={f} start={B2.gap} to={NUM.gap} x={GX + CR + 34} y={(rTop + gTop) / 2 + 8} size={116} color="#E9FCFF" align="left" dur={18}
            shadow="0 10px 30px rgba(8,60,90,0.55)"/>
        </AbsoluteFill>
        <Label f={f} start={B2.ring + 16} x={GX - 250} y={BASE + 112} text="Moat" size={46} color="#FFFFFF" weight={800} bg="#1E7FA3" spacing={3}/>
      </Layer>
      <AbsoluteFill>
        <Svg>{motes.map((p, i) => <circle key={i} cx={(p.x * 2000 + f * (0.3 + p.s)) % 2000 - 40} cy={120 + p.y * 760 + Math.sin(f * 0.05 + p.p) * 14} r={1.5 + p.r * 3} fill="#FFF6D2" opacity={0.3 + 0.4 * Math.abs(Math.sin(f * 0.05 + p.p))}/>)}</Svg>
      </AbsoluteFill>
      {/* header: of every ₹100 */}
      <Label f={f} start={B2.paid} x={960} y={78} text="Of every" size={36} color="#16405A" weight={600} spacing={1}/>
      <KineticNumber f={f} start={B2.paid + 4} to={NUM.paid} from={NUM.paid} x={960} y={150} size={92} color="#16405A" dur={1} shadow="0 6px 20px rgba(255,255,255,0.6)"/>
      <AbsoluteFill style={{background: "radial-gradient(ellipse 55% 50% at 18% 22%, rgba(255,226,160,0.28), rgba(255,226,160,0) 70%)", mixBlendMode: "screen"}}/>
      {/* the dive: water falls away from the lens */}
      {f < 20 ? <Svg><path d={wave(-20, 1940, lin(f, 0, 20, -40, 1120, inOut), 18, 520, f * 0.25 + 60, -100)} fill="url(#pa-dive)"/></Svg> : null}
    </AbsoluteFill>
  );
};
// Number that follows the top of a stack (counted against the same clock as the stack).
const KineticStatic: React.FC<{t: number; start: number; to: number; x: number; y: number; color: string}> = ({t, start, to, x, y, color}) => {
  const s = spr(t, start, 12, 140), v = to * lin(t, start, start + 34, 0, 1, outQuint);
  return <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * s})`, fontFamily: FONT, fontWeight: 800, fontSize: 92,
    color, fontVariantNumeric: "tabular-nums", letterSpacing: -2, whiteSpace: "nowrap", textShadow: "0 8px 26px rgba(40,60,80,0.45)", opacity: Math.min(1, s * 2), lineHeight: 1}}>₹{v.toFixed(2)}</div>;
};

export const PremiumA: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: "#86C0E2", overflow: "hidden"}}>
      <Defs/>
      {frame < M1 ? <Moment1 f={frame}/> : <Moment2 f={frame - M1}/>}
      <Vignette strength={0.32} color="20,30,50"/>
      <Grain f={frame} opacity={0.06}/>
    </AbsoluteFill>
  );
};
