// KURZ look, props (art builder, 29 Oct 2026): egg, white layer hen, red desi hen, chick, coin, calendar, a generic 1970 saloon car,
// a 1970s goods van, an egg-tray crate, a rate sheet with no readable digits, and a document stack. Original, drawn in code, no brands.
// Each prop is drawn around its anchor (x, y) at scale s; grounded props stand on y + base(icon) * s.
import React from "react";
import {GlowDot, Lit, P, ell, litOf, mod, poly, pulse, rng, rr, shadeOf, useArt} from "./base";

export type Icon = "egg" | "hen" | "deshen" | "chick" | "coin" | "rupee" | "calendar" | "car" | "van" | "crate" | "ratesheet" | "doc";
// Where the ground contact sits below the anchor, in unscaled units (null: the prop floats).
export const BASE: Record<string, number | null> = {egg: 62, hen: 62, deshen: 60, chick: 34, coin: null, rupee: null, calendar: null, car: 60, van: 60, crate: 46, ratesheet: null, doc: null};
export const WIDTH: Record<string, number> = {egg: 100, hen: 130, deshen: 120, chick: 60, coin: 100, rupee: 100, calendar: 110, car: 330, van: 360, crate: 150, ratesheet: 230, doc: 220};
export const floats = (icon: string, y: number) => BASE[icon] == null || (icon === "egg" && y < 800);

const EGG = "M 0 -62 C 34 -62 52 -10 52 18 C 52 48 30 62 0 62 C -30 62 -52 48 -52 18 C -52 -10 -34 -62 0 -62 Z";

export const EggArt: React.FC<{f: number; seed?: number; hero?: boolean}> = ({f, seed = 0, hero}) => {
  const {T} = useArt(), tw = Math.sin(f / 60 + seed) * 4;
  return <g transform={`rotate(${tw})`}>
    {hero && <GlowDot x={0} y={0} r={190} c="#FFE2A0" o={0.55}/>}
    <Lit d={EGG} c="#FFF1D6" s="#E3C493" side={1} cut={10} tilt={0.18} rim={5} rimC="#FFFFFF"/>
    <ellipse cx={-20} cy={-24} rx={9} ry={17} fill={T("#FFFFFF")} opacity={0.9} transform="rotate(20 -20 -24)"/>
    <ellipse cx={-30} cy={6} rx={4} ry={7} fill={T("#FFFFFF")} opacity={0.6}/>
    {[[-10, 30], [16, -20], [24, 34]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={2.4} fill={T("#D9B07A")} opacity={0.6}/>)}
  </g>;
};

// A hen (white hybrid layer or red desi hen). Pecks on a smooth pulse; the tail and wattles follow.
export const HenArt: React.FC<{f: number; seed?: number; desi?: boolean}> = ({f, seed = 0, desi}) => {
  const {T} = useArt();
  const peck = pulse(f, 96 + (seed % 3) * 14, 7, seed * 29) * 34 + pulse(f, 96 + (seed % 3) * 14, 5, seed * 29 + 16) * 22;
  const bob = Math.sin(f / 14 + seed) * 1.5, look = Math.sin(f / 47 + seed * 2) * 4;
  const body = desi ? "#B4542A" : "#F4F2EC", wing = desi ? "#8E3A1E" : "#E2DED6", tail = desi ? "#8A3A1C" : "#ECE8E0", hackle = desi ? "#E2A04A" : "#FAF8F2";
  const comb = desi ? "#D93A30" : "#E2322C";
  return <g transform={`translate(0 ${bob})`}>
    <path d="M -8 40 L -14 62 M 14 40 L 18 62" stroke={T("#E8B03A")} strokeWidth={7} strokeLinecap="round"/>
    <path d="M -22 62 L -2 62 M 8 62 L 28 62" stroke={T("#E8B03A")} strokeWidth={5} strokeLinecap="round"/>
    {/* tail */}
    <g transform={`rotate(${Math.sin(f / 33 + seed) * 3} -46 -6)`}>
      {desi && <path d="M -44 2 C -80 -2 -100 -30 -96 -54 C -80 -36 -60 -24 -30 -12 Z" fill={T("#24403A")}/>}
      <Lit d={desi ? "M -46 4 C -76 -8 -90 -40 -82 -64 C -68 -44 -50 -30 -24 -16 Z" : "M -44 0 C -70 -30 -76 -70 -60 -86 C -50 -56 -36 -30 -20 -16 Z"} c={tail} side={1} cut={-56} rim={3}/>
    </g>
    {/* body */}
    <Lit d="M -52 4 C -54 -32 -6 -40 26 -16 C 50 4 40 44 4 48 C -30 52 -52 34 -52 4 Z" c={body} side={1} cut={4} tilt={0.5} rim={5} k={0.24}/>
    <Lit d="M -40 0 C -30 -18 4 -18 16 0 C 6 24 -24 30 -40 0 Z" c={wing} side={1} cut={-4} k={0.2}/>
    {desi && [-28, -14, 0].map((xx) => <path key={xx} d={`M ${xx} 2 Q ${xx + 8} 14 ${xx + 2} 24`} stroke={T("#6E2A14")} strokeWidth={3} fill="none" opacity={0.7}/>)}
    {/* neck + head, pecking */}
    <g transform={`rotate(${peck + look} 22 -10)`}>
      <Lit d="M 10 -14 C 12 -40 26 -52 40 -48 C 50 -40 44 -14 34 0 Z" c={hackle} side={1} cut={32} k={0.22}/>
      <Lit d={ell(38, -50, 17)} c={body === "#F4F2EC" ? "#F8F6F0" : "#C2622E"} side={1} cut={44} rim={3}/>
      <path d={desi ? "M 28 -64 Q 32 -74 38 -66 Q 42 -74 46 -64 Z" : "M 24 -62 Q 26 -80 34 -68 Q 38 -84 44 -68 Q 50 -80 52 -62 Z"} fill={T(comb)}/>
      <path d="M 50 -46 Q 54 -34 48 -32 Q 44 -38 46 -46 Z" fill={T(comb)}/>
      <path d="M 52 -54 L 68 -48 L 52 -42 Z" fill={T("#F2B23A")}/>
      <circle cx={44} cy={-53} r={3.4} fill={T("#1A1420")}/><circle cx={45} cy={-54} r={1.1} fill={T("#FFFFFF")}/>
    </g>
  </g>;
};

export const ChickArt: React.FC<{f: number; seed?: number}> = ({f, seed = 0}) => {
  const {T} = useArt();
  const hop = Math.max(0, Math.sin(f / 9 + seed * 2.2)) ** 6 * 7, peck = pulse(f, 70 + (seed % 4) * 9, 5, seed * 17) * 30;
  return <g transform={`translate(0 ${-hop})`}>
    <path d="M -6 20 L -8 34 M 8 20 L 10 34" stroke={T("#F0A030")} strokeWidth={4} strokeLinecap="round"/>
    <Lit d={ell(0, 4, 28, 24)} c="#FFD84A" s="#E6A82A" side={1} cut={6} tilt={0.4} rim={3} rimC="#FFF3B0"/>
    <path d="M -22 2 Q -32 -6 -26 -14 Q -18 -6 -14 0 Z" fill={T("#F4BE36")}/>
    <g transform={`rotate(${peck} 8 -6)`}>
      <Lit d={ell(14, -18, 17)} c="#FFDF5C" s="#EDB232" side={1} cut={18} rim={3} rimC="#FFF6C4"/>
      <path d="M 28 -20 L 38 -16 L 28 -12 Z" fill={T("#F28A1C")}/>
      <circle cx={20} cy={-22} r={2.6} fill={T("#1A1420")}/>
    </g>
  </g>;
};

export const CoinArt: React.FC<{f: number}> = ({f}) => {
  const {T} = useArt(), spin = Math.cos(f / 30);
  return <g transform={`scale(${Math.max(0.18, Math.abs(spin))} 1)`}>
    <GlowDot x={0} y={0} r={110} c="#FFD25A" o={0.35}/>
    <Lit d={ell(0, 0, 50)} c="#FFD25A" s="#E08A1C" side={1} cut={6} rim={4}/>
    <circle r={36} fill="none" stroke={T("#FFF0B0")} strokeWidth={5} opacity={0.6}/>
    <text x={0} y={18} textAnchor="middle" fontFamily="'LK Bricolage', Arial" fontWeight={800} fontSize={52} fill={T("#B8620A")}>₹</text>
  </g>;
};

export const CalendarArt: React.FC<{f: number}> = ({f}) => {
  const {T} = useArt(), flap = Math.sin(f / 40) * 3;
  return <g>
    <Lit d={rr(-55, -48, 110, 100, 14)} c="#F4F7FF" side={1} cut={20} rim={3}/>
    <path d="M -55 -18 L -55 -34 Q -55 -48 -41 -48 L 41 -48 Q 55 -48 55 -34 L 55 -18 Z" fill={T("#F25F5C")}/>
    {[-30, 30].map((xx) => <rect key={xx} x={xx - 4} y={-58} width={8} height={20} rx={4} fill={T("#3A3550")}/>)}
    {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={-40 + c * 22} y={-6 + r * 18 + (r === 0 ? flap * 0 : 0)} width={14} height={11} rx={3} fill={T(r === 1 && c === 2 ? "#FF9F1C" : "#B9C2E6")}/>))}
  </g>;
};

// Wheel with spokes that turn with the distance driven (rot in degrees).
const Wheel: React.FC<{x: number; y: number; r: number; rot: number}> = ({x, y, r, rot}) => {
  const {T} = useArt();
  return <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={T("#1C1A24")}/><circle r={r * 0.62} fill={T("#B8BCC8")}/><circle r={r * 0.62} fill={T("#7E8294")} opacity={0.5} transform={`translate(${r * 0.15} ${r * 0.1})`}/>
    <g transform={`rotate(${rot})`}>{[0, 60, 120].map((a) => <rect key={a} x={-r * 0.56} y={-2.5} width={r * 1.12} height={5} fill={T("#5A5E70")} transform={`rotate(${a})`}/>)}</g>
    <circle r={r * 0.18} fill={T("#E6E8EE")}/>
  </g>;
};

// A generic rounded 1970 saloon (no brand, no grille badge). Faces +x.
export const CarArt: React.FC<{f: number; rot: number; moving: number}> = ({f, rot, moving}) => {
  const {T} = useArt(), shake = Math.sin(f * 1.3) * (0.6 + moving * 1.2);
  const body = "M -160 30 C -164 0 -150 -20 -120 -24 L -80 -30 C -66 -70 -40 -84 0 -86 C 46 -86 72 -72 88 -32 L 132 -24 C 158 -18 166 0 164 30 C 162 42 150 46 140 46 L -150 46 C -158 46 -162 40 -160 30 Z";
  return <g>
    <g transform={`translate(0 ${shake})`}>
      <Lit d={body} c="#EDE6D2" s="#B9AE96" side={1} cut={40} tilt={0.05} rim={5} rimC="#FFFFFF"/>
      <path d="M -66 -32 C -54 -64 -34 -74 -6 -76 L -6 -32 Z" fill={T("#3B4A6E")}/>
      <path d="M 4 -76 C 40 -76 60 -64 74 -32 L 4 -32 Z" fill={T("#2E3A5C")}/>
      <path d="M -50 -40 L -30 -68 L -20 -68 L -40 -40 Z" fill={T("#9FB4E0")} opacity={0.55}/>
      <path d="M 22 -40 L 36 -70 L 44 -70 L 30 -40 Z" fill={T("#9FB4E0")} opacity={0.4}/>
      <path d="M -156 4 L 160 4" stroke={T("#C9C2B0")} strokeWidth={4}/>
      <path d="M 0 -30 L 0 40" stroke={T(shadeOf("#EDE6D2", 0.35))} strokeWidth={3}/>
      <rect x={-30} y={-14} width={18} height={5} rx={2} fill={T("#8A8EA0")}/><rect x={30} y={-14} width={18} height={5} rx={2} fill={T("#8A8EA0")}/>
      <circle cx={154} cy={0} r={11} fill={T("#FFF3C4")}/><circle cx={154} cy={0} r={6} fill={T("#FFFFFF")}/>
      <rect x={144} y={28} width={30} height={10} rx={5} fill={T("#C8CCD6")}/><rect x={-174} y={28} width={30} height={10} rx={5} fill={T("#C8CCD6")}/>
      <rect x={-162} y={-6} width={10} height={12} rx={3} fill={T("#E2322C")}/>
    </g>
    <Wheel x={-96} y={36} r={26} rot={rot}/><Wheel x={104} y={36} r={26} rot={rot}/>
  </g>;
};

// A 1970s cab-forward goods van with a canvas-topped load box. Faces +x.
export const VanArt: React.FC<{f: number; rot: number; moving: number}> = ({f, rot, moving}) => {
  const {T} = useArt(), shake = Math.sin(f * 1.1) * (0.5 + moving * 1.2);
  return <g>
    <g transform={`translate(0 ${shake})`}>
      <Lit d={rr(-176, -96, 230, 136, 6)} c="#A9784A" side={1} cut={-10} rim={4}/>
      {[-64, -32, 0].map((yy) => <rect key={yy} x={-176} y={yy} width={230} height={5} fill={T("#6E4A2C")} opacity={0.6}/>)}
      {[-150, -90, -30, 30].map((xx) => <rect key={xx} x={xx} y={-96} width={7} height={136} fill={T("#7A5232")} opacity={0.7}/>)}
      <Lit d="M -184 -92 Q -186 -150 -140 -152 L 20 -152 Q 62 -150 60 -92 Z" c="#C9B48A" side={1} cut={-30} rim={5}/>
      <path d="M -170 -96 L -120 -150 M -110 -96 L -60 -150 M -50 -96 L 0 -150 M 10 -96 L 50 -146" stroke={T("#7A6A4A")} strokeWidth={4}/>
      <Lit d="M 58 40 L 58 -96 Q 60 -110 76 -110 L 132 -110 Q 160 -104 170 -60 L 178 -6 L 180 40 Z" c="#4E9AA8" side={1} cut={130} rim={5}/>
      <path d="M 82 -96 L 132 -96 Q 150 -92 158 -58 L 82 -58 Z" fill={T("#2E3A5C")}/>
      <path d="M 92 -64 L 108 -92 L 116 -92 L 100 -64 Z" fill={T("#9FB4E0")} opacity={0.5}/>
      <circle cx={170} cy={-4} r={10} fill={T("#FFF3C4")}/>
      <rect x={60} y={26} width={124} height={14} rx={6} fill={T("#C8CCD6")}/><rect x={-184} y={26} width={30} height={12} rx={5} fill={T("#C8CCD6")}/>
      <path d="M 112 -40 L 112 30" stroke={T(shadeOf("#6E9FAE", 0.3))} strokeWidth={3}/>
    </g>
    <Wheel x={-110} y={36} r={28} rot={rot}/><Wheel x={124} y={36} r={28} rot={rot}/>
  </g>;
};

// A slatted wooden crate holding stacked paper-pulp trays of eggs.
export const CrateArt: React.FC<{f: number; seed?: number}> = ({f, seed = 0}) => {
  const {T} = useArt(), r = rng(seed + 5);
  const eggs = Array.from({length: 6}, (_, i) => ({x: -55 + i * 22, y: -42 + Math.sin(i * 1.7 + seed) * 2}));
  return <g>
    {eggs.map((e, i) => <g key={i} transform={`translate(${e.x} ${e.y}) scale(0.24)`}><Lit d={EGG} c={r() < 0.25 ? "#E8C49A" : "#FFF1D6"} s="#DDBB8C" side={1} cut={10} tilt={0.2}/></g>)}
    <Lit d={rr(-74, -36, 148, 82, 6)} c="#C08A4E" side={1} cut={36} tilt={0.05} rim={4}/>
    {[-20, 4, 28].map((yy) => <rect key={yy} x={-74} y={yy} width={148} height={4} fill={T("#7A5230")} opacity={0.6}/>)}
    <rect x={-74} y={-36} width={10} height={82} fill={T("#8E5E34")}/><rect x={64} y={-36} width={10} height={82} fill={T("#6E4426")}/>
    <path d="M -70 -36 Q -48 -46 -26 -36 Q -4 -46 18 -36 Q 40 -46 70 -36" fill="none" stroke={T("#B9A88E")} strokeWidth={4}/>
  </g>;
};

// A printed rate board: a coloured header band, then rows of bars and boxes. No digits, no readable text.
export const RateSheetArt: React.FC<{f: number}> = ({f}) => {
  const {T} = useArt(), sway = Math.sin(f / 45) * 1.5;
  return <g transform={`rotate(${sway} 0 -150)`}>
    <GlowDot x={0} y={0} r={240} c="#FFD27A" o={0.3}/>
    <path d="M 0 -170 L -60 -136 M 0 -170 L 60 -136" stroke={T("#5A4A3A")} strokeWidth={4}/>
    <circle cx={0} cy={-172} r={7} fill={T("#C9A86A")}/>
    <Lit d={rr(-110, -140, 220, 280, 14)} c="#FFF6E2" s="#EADBBE" side={1} cut={60} tilt={0.04} rim={5} rimC="#FFFFFF"/>
    <path d="M -110 -126 Q -110 -140 -96 -140 L 96 -140 Q 110 -140 110 -126 L 110 -96 L -110 -96 Z" fill={T("#E8762A")}/>
    <rect x={-86} y={-124} width={120} height={12} rx={6} fill={T("#FFE2C2")} opacity={0.9}/>
    {Array.from({length: 7}, (_, i) => <g key={i}>
      {i % 2 === 0 && <rect x={-100} y={-86 + i * 30} width={200} height={28} fill={T("#F3E4C6")}/>}
      <rect x={-88} y={-77 + i * 30} width={70 + ((i * 37) % 40)} height={10} rx={5} fill={T("#8C8AA8")} opacity={0.75}/>
      <rect x={34} y={-79 + i * 30} width={52} height={14} rx={4} fill={T(i === 0 ? "#F25F5C" : "#3D4F8C")} opacity={i === 0 ? 0.95 : 0.55}/>
    </g>)}
  </g>;
};

// A document stack: three fanned sheets, a ribbon tag and a blank stamp; the top sheet's corner lifts in a breeze.
export const DocArt: React.FC<{f: number}> = ({f}) => {
  const {T} = useArt(), lift = Math.sin(f / 30) * 0.5 + 0.5;
  return <g>
    <GlowDot x={0} y={0} r={230} c="#BFD0FF" o={0.28}/>
    <g transform="rotate(-9)"><Lit d={rr(-96, -126, 192, 252, 10)} c="#E9E1CF" side={1} cut={40}/></g>
    <g transform="rotate(5)"><Lit d={rr(-96, -126, 192, 252, 10)} c="#F0EADB" side={1} cut={40}/></g>
    <g>
      <Lit d={`M -96 -116 Q -96 -126 -86 -126 L 86 -126 Q 96 -126 96 -116 L 96 ${96 - lift * 10} L ${66 - lift * 8} 126 L -86 126 Q -96 126 -96 116 Z`} c="#FBF7EE" s="#E6DCC6" side={1} cut={46} rim={4} rimC="#FFFFFF"/>
      <path d={`M 96 ${96 - lift * 10} L ${66 - lift * 8} 126 L ${70 - lift * 4} ${100 - lift * 6} Z`} fill={T("#D8CDB4")}/>
      <rect x={-70} y={-104} width={110} height={12} rx={6} fill={T("#2C3556")} opacity={0.8}/>
      {Array.from({length: 6}, (_, i) => <rect key={i} x={-70} y={-70 + i * 22} width={140 - ((i * 29) % 50)} height={8} rx={4} fill={T("#9A9AB4")} opacity={0.7}/>)}
      <circle cx={46} cy={78} r={22} fill="none" stroke={T("#B8393A")} strokeWidth={5} opacity={0.75}/>
      <path d="M -96 -60 L -112 -60 L -112 -20 L -104 -28 L -96 -20 Z" fill={T("#F25F5C")}/>
    </g>
  </g>;
};

// Dispatch by icon. rot/moving apply to vehicles only.
export const PropArt: React.FC<{icon: string; f: number; seed?: number; hero?: boolean; rot?: number; moving?: number}> = ({icon, f, seed = 0, hero, rot = 0, moving = 0}) => {
  switch (icon) {
    case "egg": return <EggArt f={f} seed={seed} hero={hero}/>;
    case "hen": return <HenArt f={f} seed={seed}/>;
    case "deshen": return <HenArt f={f} seed={seed} desi/>;
    case "chick": return <ChickArt f={f} seed={seed}/>;
    case "coin": case "rupee": return <CoinArt f={f}/>;
    case "calendar": return <CalendarArt f={f}/>;
    case "car": return <CarArt f={f} rot={rot} moving={moving}/>;
    case "van": return <VanArt f={f} rot={rot} moving={moving}/>;
    case "crate": return <CrateArt f={f} seed={seed}/>;
    case "ratesheet": return <RateSheetArt f={f}/>;
    case "doc": return <DocArt f={f}/>;
    default: throw new Error(`kurz stage: no art for icon "${icon}"`);
  }
};
void litOf; void mod; void poly; void P;
