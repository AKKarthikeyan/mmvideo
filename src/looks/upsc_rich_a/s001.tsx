// Sample A, s001: a Nagpur rooftop on a May afternoon. Heat haze, an empty bucket, a thermometer, a curious girl, two number badges.
// Original art in the Kurz look: no outlines, a lit side and a shade side on every shape, long shadows, rim light, glow, parallax layers.
import React from "react";
import {AbsoluteFill} from "remotion";
import {K, SANS, W, H, Finish, NumCard, Orb, Haze, Motes, Stars, LS, rrect, ellp, poly, rnd, clamp, easeOut, easeIO, lerp, mix, shade, lite, sstep} from "./rk";

const SKY: [number, string][] = [[0, "#16277A"], [0.2, "#3A3C9A"], [0.4, "#B35A92"], [0.58, "#FF8756"], [0.74, "#FFC070"], [1, "#FFE4A2"]];
const SUN = {x: 250, y: 178};

// ---- skylines ------------------------------------------------------------------------------------------------------------------------
const Skyline: React.FC<{seed: number; base: number; n: number; wMin: number; wMax: number; hMin: number; hMax: number; c: string; sh: string; win: number; f: number; tanks?: boolean; tower?: number}> =
  ({seed, base, n, wMin, wMax, hMin, hMax, c, sh, win, f, tanks, tower}) => {
  const r = rnd(seed); let x = -120; const out: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const w = wMin + r() * (wMax - wMin), h = hMin + r() * (hMax - hMin), gap = r() * 18 - 6, y = base - h, cut = x + w * (0.34 + r() * 0.2);
    const bc = mix(c, "#FFFFFF", r() * 0.05), bs = mix(sh, "#000000", r() * 0.1);
    out.push(<g key={i}>
      <rect x={x} y={y} width={w} height={h + 40} fill={bc}/>
      <rect x={cut} y={y} width={x + w - cut} height={h + 40} fill={bs}/>
      <rect x={x} y={y} width={w} height={6} fill={lite(c, 0.45)} opacity={0.8}/>
      {win > 0 && Array.from({length: Math.floor(w / 26)}, (_, a) => Array.from({length: Math.floor((h - 24) / 30)}, (_, b) => (r() < 0.55 ?
        <rect key={`${a}-${b}`} x={x + 10 + a * 26} y={y + 20 + b * 30} width={12} height={16} rx={2} fill={r() < 0.5 ? "#FFE3A0" : "#1B1550"} opacity={win}/> : null)))}
      {tanks && r() < 0.6 && <g><rect x={x + w * 0.2} y={y - 24} width={w * 0.34} height={24} rx={6} fill={lite(c, 0.2)}/><rect x={x + w * 0.2 + w * 0.17} y={y - 24} width={w * 0.17} height={24} rx={6} fill={sh}/></g>}
      {r() < 0.35 && <path d={`M ${x + w * 0.7} ${y} L ${x + w * 0.7} ${y - 46 - r() * 30} M ${x + w * 0.7 - 10} ${y - 30} L ${x + w * 0.7 + 10} ${y - 30}`} stroke={sh} strokeWidth={3}/>}
    </g>);
    x += w + gap;
  }
  const tw = tower ?? 0;
  return <g>{out}
    {tw > 0 && <g transform={`translate(${tw} ${base - 60})`}>
      <path d="M -26 60 L -3 -250 L 3 -250 L 26 60 Z" fill="none" stroke={mix(c, "#000", 0.2)} strokeWidth={5}/>
      <path d="M -20 0 L 20 0 M -15 -60 L 15 -60 M -10 -120 L 10 -120 M -20 0 L 10 -60 M 20 0 L -10 -60 M -15 -60 L 6 -120 M 15 -60 L -6 -120" stroke={mix(c, "#000", 0.2)} strokeWidth={3}/>
      <circle cx={0} cy={-256} r={7} fill="#FF4D4D" opacity={0.45 + 0.55 * Math.max(0, Math.sin(f / 12))}/>
      <circle cx={0} cy={-256} r={22} fill="#FF4D4D" opacity={0.18 * Math.max(0, Math.sin(f / 12))}/>
    </g>}
  </g>;
};

// ---- the girl: about 12, Indian, dressed simply (teal cotton kurta, cream leggings, chappals), shading her eyes, a hand fan in the other hand --
const Girl: React.FC<{x: number; y: number; h: number; f: number; sil?: string}> = ({x, y, h, f, sil}) => {
  const s = h / 560, F = (c: string) => sil ?? c;
  const breathe = Math.sin(f / 17) * 2.2, tilt = Math.sin(f / 70) * 1.6, blink = (f % 118) < 4;
  const skin = "#C98A5E", skinS = "#9E5F3B", skinL = "#E3A87A";
  const kurta = K.teal, kS = K.tealD, hair = "#1A1236", fan = Math.sin(f / 5.5) * 12;
  const sway = (i: number) => Math.sin(f / 26 + i * 0.5) * (1 + i * 1.1);
  const drop = ((f / 70) % 1);
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* legs */}
    <LS d={rrect(-52, -200, 40, 184, 16)} c={F("#F2E1C0")} s={F("#C9B38C")} cut={-32} tilt={0.05}/>
    <LS d={rrect(10, -200, 40, 184, 16)} c={F("#E6D3AE")} s={F("#B79F78")} cut={22} tilt={0.05}/>
    {!sil && [-60, -80, -100].map((yy) => <g key={yy}><path d={`M -50 ${yy} q 20 8 38 0`} stroke="#B9A27A" strokeWidth={3} fill="none" opacity={0.7}/><path d={`M 12 ${yy} q 18 8 36 0`} stroke="#9F8861" strokeWidth={3} fill="none" opacity={0.7}/></g>)}
    {/* chappals */}
    <LS d="M -78 0 Q -84 -22 -50 -24 L -8 -24 L -8 0 Z" c={F("#C9633C")} s={F("#8A3425")} cut={-30}/>
    <LS d="M -4 0 Q -8 -22 22 -24 L 56 -24 L 60 0 Z" c={F("#B85634")} s={F("#7C2E20")} cut={30}/>
    <g transform={`translate(0 ${breathe})`}>
      {/* braid behind: tapering ovals, swaying */}
      {Array.from({length: 8}, (_, i) => <ellipse key={i} cx={84 + sway(i) + i * 2} cy={-392 + i * 24} rx={19 - i * 1.2} ry={15} fill={F(i % 2 ? "#251A4A" : hair)}/>)}
      <ellipse cx={84 + sway(8) + 14} cy={-186} rx={11} ry={8} fill={F("#F25F5C")}/>
      <path d={`M ${84 + sway(8) + 12} -180 L ${84 + sway(8) + 4} -150 L ${84 + sway(8) + 20} -156 Z`} fill={F(hair)}/>
      {/* kurta */}
      <LS d="M -72 -338 Q 0 -360 74 -338 L 92 -168 Q 0 -146 -92 -168 Z" c={F(kurta)} s={F(kS)} cut={14} tilt={0.06} rim={sil ? undefined : "#9BF5EA"} rimW={3}/>
      {!sil && <g>
        <path d="M -92 -176 Q 0 -154 92 -176 L 90 -160 Q 0 -138 -90 -160 Z" fill={K.orange}/>
        <path d="M 14 -176 L 92 -176 L 90 -160 Q 50 -148 14 -146 Z" fill={K.orangeD} opacity={0.65}/>
        {Array.from({length: 9}, (_, i) => <circle key={i} cx={-70 + i * 17} cy={-166 + Math.sin(i / 1.4) * 1} r={3} fill={K.yellowL}/>)}
        <path d="M -20 -352 Q 0 -318 20 -352" fill="none" stroke={K.yellowL} strokeWidth={5} strokeLinecap="round"/>
        <path d="M 0 -330 L 0 -176" stroke={kS} strokeWidth={3} opacity={0.5}/>
        {[-300, -262, -224].map((yy) => <circle key={yy} cx={0} cy={yy} r={4} fill={K.yellowL}/>)}
      </g>}
      {/* left arm (screen right): hangs, holds a hand fan */}
      <g>
        <path d={`M 66 -326 L 88 -268`} stroke={F(kS)} strokeWidth={42} strokeLinecap="round"/>
        <path d={`M 88 -268 L 108 -222`} stroke={F(skinS)} strokeWidth={30} strokeLinecap="round"/>
        <g transform={`translate(114 -214) rotate(${fan - 20})`}>
          <rect x={-3} y={-8} width={6} height={44} rx={3} fill={F("#7A4A2A")}/>
          <g transform="translate(0 -44)">
            <circle r={44} fill={F("#FFD25A")}/>
            <path d="M 0 -44 A 44 44 0 0 1 0 44 Z" fill={F("#E8A92E")}/>
            {!sil && Array.from({length: 7}, (_, i) => <path key={i} d={`M 0 0 L ${Math.cos(i * 0.5 - 1.5) * 44} ${Math.sin(i * 0.5 - 1.5) * 44}`} stroke="#B97A1A" strokeWidth={2.5} opacity={0.6}/>)}
            {!sil && <circle r={44} fill="none" stroke="#FF9F1C" strokeWidth={6}/>}
          </g>
        </g>
        <circle cx={108} cy={-218} r={16} fill={F(skinS)}/>
      </g>
      {/* neck and head, a slight curious tilt */}
      <g transform={`rotate(${tilt - 2} 0 -350)`}>
        <LS d={rrect(-22, -372, 44, 44, 16)} c={F(skin)} s={F(skinS)} cut={-4}/>
        {/* hair behind */}
        <ellipse cx={4} cy={-456} rx={82} ry={86} fill={F(hair)}/>
        {!sil && <path d="M -70 -480 Q -30 -536 40 -528" fill="none" stroke="#6B58C8" strokeWidth={7} strokeLinecap="round" opacity={0.8}/>}
        {/* face */}
        <LS d={ellp(-6, -438, 66, 72)} c={F(skinL)} s={F(skinS)} cut={46} tilt={0.1} rim={sil ? undefined : "#FFD9B0"} rimW={3}/>
        {!sil && <ellipse cx={52} cy={-432} rx={14} ry={18} fill={skinS}/>}
        {!sil && <circle cx={52} cy={-410} r={6.5} fill={K.yellow}/>}
        {/* fringe with a side parting */}
        <path d="M -76 -430 C -74 -508 -14 -536 34 -520 C 74 -506 82 -470 80 -428 C 66 -466 36 -484 -2 -482 C -34 -480 -62 -462 -76 -430 Z" fill={F(hair)}/>
        {!sil && <path d="M 10 -526 Q 4 -500 -4 -484" stroke="#3A2D78" strokeWidth={4} fill="none"/>}
        {/* face details */}
        {!sil && <g>
          <ellipse cx={-42} cy={-410} rx={17} ry={10} fill="#F25F5C" opacity={0.32}/><ellipse cx={14} cy={-412} rx={15} ry={9} fill="#F25F5C" opacity={0.28}/>
          <path d="M -58 -468 Q -40 -486 -18 -472" stroke={hair} strokeWidth={7} fill="none" strokeLinecap="round"/>
          <path d="M -2 -472 Q 20 -488 38 -472" stroke={hair} strokeWidth={7} fill="none" strokeLinecap="round"/>
          {blink ? <><path d="M -50 -444 L -22 -444 M -4 -446 L 24 -446" stroke={hair} strokeWidth={5} strokeLinecap="round"/></> : <>
            <ellipse cx={-36} cy={-444} rx={14} ry={17} fill="#FFFFFF"/><ellipse cx={10} cy={-446} rx={14} ry={17} fill="#FFFFFF"/>
            <circle cx={-41} cy={-450} r={10.5} fill="#2A1A2C"/><circle cx={5} cy={-452} r={10.5} fill="#2A1A2C"/>
            <circle cx={-44} cy={-455} r={3.6} fill="#fff"/><circle cx={2} cy={-457} r={3.6} fill="#fff"/></>}
          <path d="M -60 -424 Q -66 -416 -56 -412" stroke={skinS} strokeWidth={5} fill="none" strokeLinecap="round"/>
          <ellipse cx={-32} cy={-392} rx={9} ry={11} fill="#7A2430"/><ellipse cx={-32} cy={-387} rx={6} ry={5} fill="#D9606A"/>
          <path d={`M 40 ${-470 + drop * 52} q -7 11 0 16 q 7 -5 0 -16 Z`} fill="#CFF3FF" opacity={0.9 * Math.sin(Math.PI * drop)}/>
        </g>}
      </g>
      {/* right arm (screen left): raised, hand shading the eyes */}
      <g>
        <path d="M -66 -324 L -134 -382" stroke={F(kS)} strokeWidth={42} strokeLinecap="round"/>
        <path d="M -66 -324 L -134 -382" stroke={F(kurta)} strokeWidth={22} strokeLinecap="round" transform="translate(-5 -5)" opacity={sil ? 0 : 1}/>
        <path d="M -134 -382 L -92 -470" stroke={F(skinS)} strokeWidth={30} strokeLinecap="round"/>
        <path d="M -134 -382 L -92 -470" stroke={F(skin)} strokeWidth={14} strokeLinecap="round" transform="translate(-5 0)" opacity={sil ? 0 : 1}/>
        <g transform="translate(-58 -486) rotate(-12)">
          <rect x={-34} y={-12} width={66} height={26} rx={13} fill={F(skin)}/>
          <rect x={-34} y={4} width={66} height={10} rx={5} fill={F(skinS)}/>
          {!sil && [-14, 2, 18].map((xx) => <path key={xx} d={`M ${xx} -10 L ${xx} 12`} stroke={skinS} strokeWidth={2.5} opacity={0.7}/>)}
        </g>
      </g>
    </g>
  </g>;
};

// ---- props ---------------------------------------------------------------------------------------------------------------------------
const Bucket: React.FC<{x: number; y: number; s: number; sil?: string}> = ({x, y, s, sil}) => {
  const F = (c: string) => sil ?? c;
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -56 -118 Q 0 -178 56 -118" fill="none" stroke={F("#B8C0DB")} strokeWidth={6} strokeLinecap="round"/>
    <LS d="M -62 -120 L 62 -120 L 48 0 Q 0 10 -48 0 Z" c={F("#FF6B66")} s={F("#B8393A")} cut={14} tilt={0.14} rim={sil ? undefined : "#FFC6B0"} rimW={3}/>
    {!sil && <g>
      <path d="M -57 -80 L 56 -80 L 54 -70 L -55 -70 Z" fill="#FFB3A0" opacity={0.5}/><path d="M -52 -38 L 51 -38 L 49 -28 L -50 -28 Z" fill="#FFB3A0" opacity={0.45}/>
      <rect x={-44} y={-112} width={11} height={98} rx={5} fill="#fff" opacity={0.28}/>
      <ellipse cx={0} cy={-120} rx={62} ry={15} fill="#FFD3C6"/><ellipse cx={0} cy={-119} rx={54} ry={11} fill="#2A1840"/>
      <path d="M -50 -118 Q 0 -108 50 -118 Q 0 -112 -50 -118" fill="#6B3B7A"/>
      <ellipse cx={-14} cy={-116} rx={18} ry={4} fill="#8C5A3A" opacity={0.7}/>
    </g>}
  </g>;
};
const Thermo: React.FC<{x: number; y: number; level: number; f: number; sil?: string}> = ({x, y, level, f, sil}) => {
  const F = (c: string) => sil ?? c, top = -500, bot = -150, my = lerp(bot, top, level);
  return <g transform={`translate(${x} ${y})`}>
    <LS d={rrect(-48, -170, 18, 170, 6)} c={F("#7A4A8A")} s={F("#3B2358")} cut={-40}/><LS d={rrect(30, -170, 18, 170, 6)} c={F("#7A4A8A")} s={F("#3B2358")} cut={40}/>
    <LS d={rrect(-62, -556, 124, 430, 40)} c={F("#FFEBC8")} s={F("#D2B07E")} cut={14} tilt={0.05} rim={sil ? undefined : "#FFFFFF"} rimW={3}/>
    {!sil && <g>
      <path d={rrect(-17, -512, 34, 372, 17)} fill="#2A1840"/>
      <path d={rrect(-17, -512, 12, 372, 6)} fill="#3C2860"/>
      {Array.from({length: 13}, (_, i) => { const yy = -150 - i * 28, big = i % 4 === 0; return <g key={i}><path d={`M -26 ${yy} L ${big ? -50 : -40} ${yy}`} stroke="#6B4A4A" strokeWidth={big ? 5 : 3} strokeLinecap="round"/><path d={`M 26 ${yy} L ${big ? 50 : 40} ${yy}`} stroke="#6B4A4A" strokeWidth={big ? 5 : 3} strokeLinecap="round"/></g>; })}
      <circle cx={0} cy={-132} r={38} fill="#2A1840"/>
      <circle cx={0} cy={-132} r={36} fill={K.pink}/><path d="M 4 -168 A 36 36 0 0 1 4 -96 Z" fill={K.pinkD}/>
      <rect x={-11} y={my} width={22} height={-132 - my} rx={11} fill={K.pink}/><rect x={2} y={my} width={9} height={-132 - my} rx={4} fill={K.pinkD}/>
      <circle cx={-12} cy={-142} r={9} fill="#fff" opacity={0.7}/>
      <rect x={-8} y={my + 8} width={4} height={Math.max(0, -140 - my - 10)} rx={2} fill="#FFD0C8" opacity={0.7}/>
      <Orb x={0} y={my} r={70} c="#FF6B66" o={0.55 + 0.15 * Math.sin(f / 8)}/>
    </g>}
    {!sil && <circle cx={0} cy={-548} r={9} fill="#6B4A4A"/>}
  </g>;
};
const Tank: React.FC<{x: number; y: number; sil?: string}> = ({x, y, sil}) => {
  const F = (c: string) => sil ?? c;
  return <g transform={`translate(${x} ${y})`}>
    <LS d="M -92 -226 L 92 -226 L 92 -10 Q 0 22 -92 -10 Z" c={F("#4B58C4")} s={F("#1A1D55")} cut={0} tilt={0.0} rim={sil ? undefined : "#9AA8FF"} rimW={4} k={0.55}/>
    {!sil && <g>
      {[-60, -120, -180].map((yy) => <path key={yy} d={`M -92 ${yy} Q 0 ${yy + 20} 92 ${yy}`} fill="none" stroke="#0E1038" strokeWidth={6} opacity={0.5}/>)}
      <ellipse cx={0} cy={-228} rx={92} ry={24} fill="#6B7BE0"/><path d="M 0 -252 A 92 24 0 0 1 0 -204 Q 60 -216 92 -228 A 92 24 0 0 0 0 -252 Z" fill="#2B3591"/>
      <ellipse cx={0} cy={-242} rx={30} ry={10} fill="#3B4AB0"/><ellipse cx={0} cy={-246} rx={24} ry={7} fill="#8B99F0"/>
      <rect x={-60} y={-190} width={9} height={160} rx={4} fill="#fff" opacity={0.18}/>
    </g>}
  </g>;
};
const Plant: React.FC<{x: number; y: number; f: number; sil?: string}> = ({x, y, f, sil}) => {
  const F = (c: string) => sil ?? c;
  return <g transform={`translate(${x} ${y})`}>
    {Array.from({length: 7}, (_, i) => { const a = -70 + i * 24, sw = Math.sin(f / 40 + i) * 2;
      return <path key={i} d={`M 0 -78 Q ${a * 0.9} ${-150 + Math.abs(a) * 0.2} ${a * 1.5 + sw} ${-110 + Math.abs(a) * 0.9}`} stroke={F(i % 2 ? "#8E6B2E" : "#B08A3A")} strokeWidth={9} strokeLinecap="round" fill="none"/>; })}
    <LS d="M -46 -90 L 46 -90 L 34 0 L -34 0 Z" c={F("#E0743C")} s={F("#9A3F25")} cut={8} tilt={0.1} rim={sil ? undefined : "#FFC08A"}/>
    {!sil && <rect x={-52} y={-102} width={104} height={20} rx={8} fill="#F08A4C"/>}
  </g>;
};

// ---- the scene ----------------------------------------------------------------------------------------------------------------------------
export const S001: React.FC<{f: number; dur: number; at: (k: string) => number}> = ({f, dur, at}) => {
  const t5 = at("t5"), r5 = at("r5");
  const p = easeIO(f, 0, dur);
  const cam = (d: number) => `translate(${(-30 + 60 * p) * d + Math.sin(f / 140) * 6 * d} ${Math.cos(f / 170) * 3 * d})`;
  const push = 1 + 0.045 * p;
  const level = easeOut(f, 8, t5 + 4, 0.1, 0.92) + Math.sin(f / 9) * 0.005;
  const shim = (id: string, sc: number, fx: number) => <filter id={id} x="-5%" y="-30%" width="110%" height="160%">
    <feTurbulence type="fractalNoise" baseFrequency={`${fx} ${0.032 + 0.006 * Math.sin(f / 38)}`} numOctaves={2} seed={3} result="n"/>
    <feOffset in="n" dy={8 * Math.sin(f / 31)} dx={0} result="n2"/>
    <feDisplacementMap in="SourceGraphic" in2="n2" scale={sc} xChannelSelector="R" yChannelSelector="G"/></filter>;
  const sh = (fn: (sil: string) => React.ReactNode, x0: number, y0: number) => <g transform={`matrix(1 0 -0.95 -0.26 ${x0} ${y0})`} opacity={0.3}>{fn("#1A0F3C")}</g>;
  const leafs = [0, 1, 2].map((i) => { const u = ((f * (0.0045 + i * 0.001) + i * 0.33) % 1), x = -60 + u * 2040, y = 985 + i * 34 - Math.abs(Math.sin(u * 22 + i)) * 26;
    return <g key={i} transform={`translate(${x} ${y}) rotate(${u * 900 + i * 40})`} opacity={Math.min(1, u * 8, (1 - u) * 8) * 0.9}><path d="M -14 0 Q 0 -10 14 0 Q 0 8 -14 0 Z" fill={i % 2 ? "#A8782F" : "#C9954A"}/><path d="M -12 0 L 12 0" stroke="#6B4A1F" strokeWidth={1.8}/></g>; });
  const ripples = Array.from({length: 7}, (_, i) => { const u = (f / 160 + i / 7) % 1, y = 840 - u * 330, a = Math.sin(Math.PI * u) * 0.17;
    return <path key={i} d={`M -50 ${y} ${Array.from({length: 24}, (_, k) => `L ${k * 85} ${y + Math.sin(k * 0.9 + f / 14 + i * 2) * (6 + u * 12)}`).join(" ")}`} fill="none" stroke="#FFE9C0" strokeWidth={5 + u * 6} opacity={a} strokeLinecap="round"/>; });

  return <AbsoluteFill style={{background: K.night}}>
    <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
      <defs>
        <linearGradient id="s1sky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="900">{SKY.map(([o, c]) => <stop key={o} offset={o} stopColor={c}/>)}</linearGradient>
        <linearGradient id="s1floor" gradientUnits="userSpaceOnUse" x1="0" y1="880" x2="0" y2="1080"><stop offset="0" stopColor="#E9B888"/><stop offset="1" stopColor="#B77F68"/></linearGradient>
        <linearGradient id="s1wall" gradientUnits="userSpaceOnUse" x1="0" y1="820" x2="0" y2="892"><stop offset="0" stopColor="#F6D2A4"/><stop offset="1" stopColor="#D49A78"/></linearGradient>
        <filter id="s1fg" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={9}/></filter>{shim("s1shimA", 18, 0.004)}{shim("s1shimB", 7, 0.006)}
      </defs>
      <g transform={`translate(960 600) scale(${push}) translate(-960 -600)`}>
        <rect x={-100} y={-100} width={W + 200} height={1000} fill="url(#s1sky)"/>
        <Stars f={f} n={40} seed={9} h={220} o={0.35}/>
        {/* the sun: huge glow, hard disc, light shafts */}
        <Orb x={SUN.x} y={SUN.y} r={900} c="#FFB347" o={0.5} core={0.2}/><Orb x={SUN.x} y={SUN.y} r={380} c="#FFE9A8" o={0.9} core={0.35}/>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => { const a = 0.18 + i * 0.12 + Math.sin(f / 90 + i) * 0.01, len = 2400, w = 0.03 + (i % 3) * 0.012;
          return <path key={i} d={`M ${SUN.x} ${SUN.y} L ${SUN.x + Math.cos(a - w) * len} ${SUN.y + Math.sin(a - w) * len} L ${SUN.x + Math.cos(a + w) * len} ${SUN.y + Math.sin(a + w) * len} Z`} fill="#FFE2A0" opacity={0.07 + 0.03 * Math.sin(f / 50 + i * 2)} style={{mixBlendMode: "screen"}}/>; })}
        <circle cx={SUN.x} cy={SUN.y} r={150} fill="#FFF3C0" opacity={0.35}/><circle cx={SUN.x} cy={SUN.y} r={112} fill="#FFF6D0" opacity={0.6}/><circle cx={SUN.x} cy={SUN.y} r={92} fill="#FFFBE6"/>
        {/* thin high haze streaks */}
        {[0, 1, 2].map((i) => <ellipse key={i} cx={1100 + i * 280 + Math.sin(f / 200 + i) * 30} cy={120 + i * 70} rx={260} ry={9} fill="#FFC9A0" opacity={0.14}/>)}
        {/* far skyline, shimmering */}
        <g transform={cam(0.25)} filter="url(#s1shimA)">
          <Skyline seed={4} base={786} n={26} wMin={60} wMax={130} hMin={70} hMax={190} c="#9B5FA6" sh="#7D4A9A" win={0.0} f={f} tower={1480}/>
        </g>
        <Haze y={640} h={220} c="#FFB27A" o={0.6}/>
        <g transform={cam(0.55)} filter="url(#s1shimB)">
          <Skyline seed={12} base={860} n={14} wMin={130} wMax={250} hMin={120} hMax={300} c="#C0697F" sh="#8E4A82" win={0.4} f={f} tanks/>
        </g>
        <Haze y={720} h={170} c="#FFC890" o={0.5}/>
        {/* ripples of heat */}
        <g>{ripples}</g>
        {/* parapet wall and the roof floor */}
        <rect x={-100} y={822} width={W + 200} height={72} fill="url(#s1wall)"/>
        <rect x={-100} y={822} width={W + 200} height={13} fill="#FFEACB"/>
        <path d={`M -100 835 L ${W + 100} 835 L ${W + 100} 893 L -100 893 Z`} fill="#000" opacity={0.04}/>
        <path d="M 1200 822 L 2100 822 L 2100 893 L 1100 893 Z" fill="#8E4A62" opacity={0.18}/>
        <rect x={-100} y={892} width={W + 200} height={14} fill="#8A5A58"/>
        <rect x={-100} y={906} width={W + 200} height={400} fill="url(#s1floor)"/>
        {Array.from({length: 17}, (_, i) => <path key={i} d={`M ${960 + (i - 8) * 70} 906 L ${960 + (i - 8) * 280} 1100`} stroke="#8A5A58" strokeWidth={2.5} opacity={0.35}/>)}
        {[936, 972, 1020, 1080].map((y) => <path key={y} d={`M -100 ${y} L ${W + 100} ${y}`} stroke="#8A5A58" strokeWidth={2.5} opacity={0.3}/>)}
        <path d="M 1000 1080 L 1900 1080 L 1900 960 L 1130 912 Z" fill="#FFF1D2" opacity={0.18}/>
        {/* cracks and stipple in the dry floor */}
        {[[300, 1010], [820, 1040], [1650, 1000]].map(([cx, cy], i) => <path key={i} d={`M ${cx} ${cy} l 30 -10 l 22 12 l 34 -8 M ${cx + 22} ${cy + 2} l 8 22 l 20 6`} stroke="#6B3B48" strokeWidth={3} fill="none" opacity={0.5} strokeLinecap="round"/>)}
        {/* long shadows (light from the upper left) */}
        {sh((s) => <Tank x={0} y={0} sil={s}/>, 640, 898)}
        {sh((s) => <Thermo x={0} y={0} level={0.9} f={f} sil={s}/>, 250, 962)}
        {sh((s) => <Bucket x={0} y={0} s={1.3} sil={s}/>, 1150, 934)}
        {sh((s) => <Plant x={0} y={0} f={f} sil={s}/>, 1770, 930)}
        {sh((s) => <Girl x={0} y={0} h={560} f={f} sil={s}/>, 1450, 962)}
        {/* things on the roof */}
        <Tank x={640} y={898}/>
        <Plant x={1770} y={930} f={f}/>
        <Thermo x={250} y={962} level={level} f={f}/>
        <Bucket x={1150} y={934} s={1.3}/>
        <Girl x={1450} y={962} h={560} f={f}/>
        {leafs}
        <Motes f={f} n={46} seed={2} box={[0, 120, W, 1000]} c="#FFE6B0" r={[1.3, 3.2]} vx={0.5} vy={-0.18} o={0.7} glow/>
        <g filter="url(#s1fg)" transform={`translate(${20 - p * 16} 1135)`}>
          {Array.from({length: 9}, (_, i) => <path key={i} d={`M 0 0 Q ${-40 + i * 34} ${-150 - (i % 3) * 40} ${-80 + i * 62 + Math.sin(f / 50 + i) * 6} ${-260 - (i % 4) * 30}`} stroke={i % 2 ? "#3A1E4E" : "#552A5E"} strokeWidth={26} strokeLinecap="round" fill="none"/>)}
        </g>
        <Orb x={SUN.x + 40} y={SUN.y + 30} r={700} c="#FFE9B0" o={0.16} core={0.2}/>
      </g>
    </svg>
    <NumCard n={{key: "t5", ref: {t: "u7_nagpur", state: "May", s: "tmax"}, decimals: 1}} f={f} at={t5} x={820} y={270} size={170} unit="°C" caption="May afternoons, Nagpur" color={K.yellow}/>
    <NumCard n={{key: "r5", ref: {t: "u7_nagpur", state: "May", s: "raindays"}, decimals: 1}} f={f} at={r5} x={820} y={560} size={120} unit="days" caption="with rain in May" color={K.tealL}/>
    <Finish vig={0.5}/>
  </AbsoluteFill>;
};
