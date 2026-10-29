// Original cartoon art for the CARTOON look: a shopkeeper, bottle characters, a glass-door fridge, mini bottles, a bottle-filled
// bar, and the kirana shop set. All flat SVG drawn in code. Bottles carry only a plain name, never a real logo or label.
import React from "react";
import {random} from "remotion";
import {C} from "./palette";

type Expr = "smug" | "worried" | "happy" | "cheer" | "flat" | "shock";
type Arms = "down" | "cheer" | "hip" | "hold";

const blinkAt = (f: number, seed: number) => {
  const p = 96 + Math.floor(random(`b${seed}`) * 40), k = (f + Math.floor(random(`o${seed}`) * p)) % p;
  return k < 4;
};

// ---- Bottle character (anchor: bottom centre; viewBox 200 x 520) ----------------------------------------------------
const BODY = "M 82 34 L 82 110 C 82 150 30 160 30 215 L 30 480 Q 30 510 62 510 L 138 510 Q 170 510 170 480 L 170 215 C 170 160 118 150 118 110 L 118 34 Z";

export type BottleProps = {
  x: number; y: number; h: number; liquid: string; label: string; trim: string; cap: string; name?: string; nameColor?: string;
  expr?: Expr; arms?: Arms; crown?: boolean; sweat?: boolean; tilt?: number; f?: number; seed?: number; look?: number; flip?: boolean; bob?: number;
};

export const Bottle: React.FC<BottleProps> = ({x, y, h, liquid, label, trim, cap, name, nameColor, expr = "flat", arms = "down", crown, sweat, tilt = 0, f = 0, seed = 1, look = 0, flip, bob = 0}) => {
  const s = h / 520, blink = blinkAt(f, seed), by = bob ? Math.sin((f + seed * 7) / 9) * bob : 0;
  const lx = look * 5;
  const eyeY = 292, eyeDx = 30;
  const brow = (dx: number, sgn: number): React.ReactNode => {
    const a = expr === "worried" ? sgn * 14 : expr === "smug" ? -sgn * 8 : expr === "shock" ? 0 : expr === "cheer" || expr === "happy" ? -sgn * 4 : 0;
    const yy = expr === "shock" ? eyeY - 34 : eyeY - 24;
    return <line x1={100 + dx - 14} y1={yy + a * 0.5} x2={100 + dx + 14} y2={yy - a * 0.5} stroke={C.ink} strokeWidth={6} strokeLinecap="round"/>;
  };
  const eye = (dx: number) => {
    const r = expr === "shock" ? 17 : 14;
    if (blink || expr === "smug" || expr === "cheer") {
      const lidY = eyeY + (expr === "smug" ? 4 : 0);
      return expr === "cheer" && !blink
        ? <path d={`M ${100 + dx - 13} ${eyeY + 4} Q ${100 + dx} ${eyeY - 14} ${100 + dx + 13} ${eyeY + 4}`} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round"/>
        : <g><ellipse cx={100 + dx} cy={eyeY} rx={r} ry={expr === "smug" ? 9 : 2} fill={C.white}/><path d={`M ${100 + dx - r} ${lidY - 1} L ${100 + dx + r} ${lidY - 1}`} stroke={C.ink} strokeWidth={5} strokeLinecap="round"/>
          {expr === "smug" && !blink && <circle cx={100 + dx + lx} cy={eyeY + 4} r={5.5} fill={C.ink}/>}</g>;
    }
    return <g><circle cx={100 + dx} cy={eyeY} r={r} fill={C.white}/><circle cx={100 + dx + lx} cy={eyeY + 1} r={expr === "shock" ? 4.5 : 7} fill={C.ink}/></g>;
  };
  const mouth = () => {
    const my = 340;
    switch (expr) {
      case "happy": return <path d={`M 76 ${my} Q 100 ${my + 30} 124 ${my}`} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round"/>;
      case "cheer": return <path d={`M 72 ${my - 4} Q 100 ${my + 44} 128 ${my - 4} Z`} fill={C.ink} stroke={C.ink} strokeWidth={5} strokeLinejoin="round"/>;
      case "smug": return <path d={`M 78 ${my + 4} Q 104 ${my + 20} 128 ${my - 6}`} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round"/>;
      case "worried": return <path d={`M 78 ${my + 14} Q 89 ${my} 100 ${my + 12} Q 111 ${my + 24} 122 ${my + 10}`} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round"/>;
      case "shock": return <ellipse cx={100} cy={my + 10} rx={13} ry={18} fill={C.ink}/>;
      default: return <path d={`M 82 ${my + 6} L 118 ${my + 6}`} stroke={C.ink} strokeWidth={6} strokeLinecap="round"/>;
    }
  };
  const arm = (side: -1 | 1) => {
    const sx = 100 + side * 70, sy = 330;
    let ex = 100 + side * 118, ey = 400, cx = 100 + side * 100, cy = 372;
    if (arms === "cheer") { ex = 100 + side * 112; ey = 220 + Math.sin(f / 5 + side) * 14; cx = 100 + side * 128; cy = 300; }
    if (arms === "hip") { ex = 100 + side * 82; ey = 392; cx = 100 + side * 128; cy = 352; }
    if (arms === "hold") { ex = 100 + side * 64; ey = 372; cx = 100 + side * 112; cy = 350; }
    return <g key={side}><path d={`M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`} stroke={C.ink} strokeWidth={11} fill="none" strokeLinecap="round"/>
      <circle cx={ex} cy={ey} r={17} fill={C.white} stroke={C.ink} strokeWidth={5}/></g>;
  };
  return <g transform={`translate(${x} ${y + by}) rotate(${tilt}) scale(${flip ? -s : s} ${s}) translate(-100 -510)`}>
    <ellipse cx={100} cy={512} rx={86} ry={12} fill={C.shadow}/>
    {arm(-1)}{arm(1)}
    <path d={BODY} fill={liquid} stroke={C.ink} strokeWidth={7} strokeLinejoin="round"/>
    <rect x={44} y={200} width={13} height={270} rx={6} fill="#FFFFFF" opacity={0.2}/>
    <rect x={76} y={0} width={48} height={40} rx={8} fill={cap} stroke={C.ink} strokeWidth={6}/>
    <rect x={30} y={236} width={140} height={190} fill={label}/>
    <rect x={30} y={236} width={140} height={14} fill={trim}/>
    <rect x={30} y={412} width={140} height={14} fill={trim}/>
    <path d={BODY} fill="none" stroke={C.ink} strokeWidth={7} strokeLinejoin="round"/>
    {brow(-eyeDx, -1)}{brow(eyeDx, 1)}{eye(-eyeDx)}{eye(eyeDx)}{mouth()}
    {name && <text x={100} y={398} transform={flip ? "translate(200 0) scale(-1 1)" : undefined} textAnchor="middle" fontFamily="'LK Schibsted', Arial, sans-serif" fontWeight={900} fontSize={name.length > 7 ? 24 : 32} fill={nameColor ?? C.ink}>{name}</text>}
    {crown && <g transform="translate(100 -26)"><path d="M -34 28 L -38 -14 L -16 8 L 0 -22 L 16 8 L 38 -14 L 34 28 Z" fill={C.gold} stroke={C.ink} strokeWidth={6} strokeLinejoin="round"/></g>}
    {sweat && <path d="M 176 250 q -10 24 0 30 q 12 -6 0 -30 Z" fill={C.sky} stroke={C.ink} strokeWidth={4}/>}
  </g>;
};

// ---- Mini bottle (shelf stock, no face) -----------------------------------------------------------------------------
export const MiniBottle: React.FC<{x: number; y: number; w: number; liquid: string; label: string; cap: string}> = ({x, y, w, liquid, label, cap}) => {
  const s = w / 200;
  return <g transform={`translate(${x} ${y}) scale(${s}) translate(-100 -510)`}>
    <path d={BODY} fill={liquid} stroke={C.ink} strokeWidth={10} strokeLinejoin="round"/>
    <rect x={30} y={250} width={140} height={140} fill={label}/>
    <rect x={76} y={0} width={48} height={40} rx={8} fill={cap} stroke={C.ink} strokeWidth={10}/>
    <rect x={44} y={200} width={14} height={260} rx={7} fill="#FFFFFF" opacity={0.22}/>
    <path d={BODY} fill="none" stroke={C.ink} strokeWidth={10} strokeLinejoin="round"/>
  </g>;
};

export type Stock = {liquid: string; label: string; cap: string};
export const STOCK = {
  red: {liquid: C.cola, label: C.red, cap: C.red} as Stock,
  blue: {liquid: "#17284B", label: C.blue, cap: C.blue} as Stock,
  orange: {liquid: C.orange, label: C.white, cap: C.orange} as Stock,
  lime: {liquid: C.lime, label: C.white, cap: C.green} as Stock,
  dark: {liquid: C.cola, label: C.yellow, cap: C.ink} as Stock,
};

// ---- Fridge ---------------------------------------------------------------------------------------------------------
// rows[r] is the list of stock per slot on shelf r (null = empty slot). Interior is drawn at (x, y) top-left, w x h.
export const Fridge: React.FC<{x: number; y: number; w: number; h: number; rows: (Stock | null)[][]; light?: number}> = ({x, y, w, h, rows, light = 1}) => {
  const pad = 26, top = 56, inW = w - pad * 2, inH = h - top - 34, rowH = inH / rows.length;
  return <g transform={`translate(${x} ${y})`}>
    <rect x={8} y={h - 6} width={w - 16} height={20} rx={10} fill={C.shadow}/>
    <rect width={w} height={h} rx={26} fill={C.fridge} stroke={C.ink} strokeWidth={8}/>
    <rect x={pad} y={top} width={inW} height={inH} rx={12} fill={C.fridgeIn} stroke={C.ink} strokeWidth={6}/>
    <rect x={pad} y={top} width={inW} height={inH} rx={12} fill={C.yellow} opacity={0.08 * light}/>
    <rect x={w * 0.3} y={16} width={w * 0.4} height={22} rx={11} fill={C.fridgeDark} stroke={C.ink} strokeWidth={5}/>
    {rows.map((row, r) => {
      const baseY = top + rowH * (r + 1) - 12, slot = inW / Math.max(1, row.length);
      return <g key={r}>
        <rect x={pad + 4} y={baseY} width={inW - 8} height={12} rx={4} fill={C.fridgeDark} stroke={C.ink} strokeWidth={4}/>
        {row.map((st, i) => st && <MiniBottle key={i} x={pad + slot * (i + 0.5)} y={baseY} w={Math.min(slot * 0.86, rowH * 0.3)} liquid={st.liquid} label={st.label} cap={st.cap}/>)}
      </g>;
    })}
    <rect x={w - pad - 8} y={top + inH * 0.3} width={10} height={inH * 0.3} rx={5} fill={C.ink} opacity={0.35}/>
    <path d={`M ${pad + 18} ${top + 10} L ${pad + 70} ${top + 10} L ${pad + 18} ${top + 80} Z`} fill={C.white} opacity={0.35}/>
  </g>;
};

// ---- Bottle-filled bar: a flat rounded bar with mini bottles printed on it ---------------------------------------------
export const BottleBar: React.FC<{x: number; yBase: number; w: number; h: number; color: string; dark: string; f?: number}> = ({x, yBase, w, h, color, dark}) => {
  const id = `bb${Math.round(x)}${Math.round(w)}${color.replace("#", "")}`, cell = 74, cols = Math.max(1, Math.floor(w / cell));
  return <g>
    <clipPath id={id}><rect x={x - w / 2} y={yBase - h} width={w} height={h} rx={16}/></clipPath>
    <rect x={x - w / 2} y={yBase - h} width={w} height={h} rx={16} fill={color}/>
    <g clipPath={`url(#${id})`} opacity={0.35}>
      {Array.from({length: Math.ceil(h / 120) + 1}, (_, r) => Array.from({length: cols}, (_, c) =>
        <MiniBottle key={`${r}-${c}`} x={x - w / 2 + w / cols * (c + 0.5) + (r % 2 ? 14 : -14)} y={yBase - 14 - r * 120} w={40} liquid={dark} label={dark} cap={dark}/>))}
    </g>
    <rect x={x - w / 2} y={yBase - h} width={w} height={h} rx={16} fill="none" stroke={C.ink} strokeWidth={8}/>
  </g>;
};

// ---- Shopkeeper (anchor: bottom centre; viewBox 400 x 600) ----------------------------------------------------------
export type KeeperProps = {x: number; y: number; h: number; f: number; pose?: "idle" | "present" | "point" | "lift"; mouth?: "smile" | "open" | "flat"; viseme?: string; flip?: boolean; look?: number};

// Mouth shapes in Rhubarb's alphabet (scripts/datayt/mouth_cues.py), drawn under the moustache. X is the resting smile.
const Tongue: React.FC<{cx: number; cy: number; rx: number; ry: number}> = ({cx, cy, rx, ry}) => <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#E87D7D"/>;
export const Mouth: React.FC<{v: string}> = ({v}) => {
  const dark = C.redDark, st = {stroke: C.ink, strokeWidth: 5, strokeLinejoin: "round" as const};
  switch (v) {
    case "A": return <path d="M 178 272 L 222 272" stroke={C.ink} strokeWidth={8} strokeLinecap="round"/>;
    case "B": return <ellipse cx={200} cy={274} rx={21} ry={7} fill={dark} {...st}/>;
    case "C": return <g><ellipse cx={200} cy={278} rx={25} ry={15} fill={dark} {...st}/><Tongue cx={200} cy={286} rx={14} ry={5}/></g>;
    case "D": return <g><ellipse cx={200} cy={284} rx={28} ry={24} fill={dark} {...st}/><Tongue cx={200} cy={297} rx={17} ry={8}/></g>;
    case "E": return <ellipse cx={200} cy={280} rx={15} ry={16} fill={dark} {...st}/>;
    case "F": return <ellipse cx={200} cy={277} rx={9} ry={9} fill={dark} {...st}/>;
    case "G": return <g><ellipse cx={200} cy={275} rx={23} ry={10} fill={dark} {...st}/><rect x={181} y={267} width={38} height={8} rx={3} fill={C.white} stroke={C.ink} strokeWidth={3}/></g>;
    case "H": return <g><ellipse cx={200} cy={278} rx={24} ry={14} fill={dark} {...st}/><Tongue cx={200} cy={273} rx={13} ry={5}/></g>;
    default: return <path d="M 174 266 Q 200 286 226 266" stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round"/>;
  }
};

export const Keeper: React.FC<KeeperProps> = ({x, y, h, f, pose = "idle", mouth = "smile", viseme, flip, look = 0}) => {
  const s = h / 600, blink = blinkAt(f, 77), bob = Math.sin(f / 11) * 3, lk = look * 6;
  const armR = pose === "present" ? {c: [330, 330], e: [370, 240]} : pose === "point" ? {c: [320, 360], e: [388, 300]} : pose === "lift" ? {c: [330, 340], e: [320, 210 - Math.sin(f / 7) * 8]} : {c: [330, 440], e: [320, 500]};
  const armL = pose === "idle" ? {c: [70, 440], e: [84, 500]} : {c: [76, 420], e: [100, 480]};
  const arm = (a: {c: number[]; e: number[]}, sx: number) => <g><path d={`M ${sx} 330 Q ${a.c[0]} ${a.c[1]} ${a.e[0]} ${a.e[1]}`} stroke={C.royalDark} strokeWidth={46} fill="none" strokeLinecap="round"/>
    <circle cx={a.e[0]} cy={a.e[1]} r={26} fill={C.skin} stroke={C.ink} strokeWidth={6}/></g>;
  return <g transform={`translate(${x} ${y + bob}) scale(${flip ? -s : s} ${s}) translate(-200 -600)`}>
    <ellipse cx={200} cy={600} rx={150} ry={16} fill={C.shadow}/>
    {arm(armL, 96)}
    <path d="M 70 600 L 76 360 Q 78 316 130 306 L 270 306 Q 322 316 324 360 L 330 600 Z" fill={C.royal} stroke={C.ink} strokeWidth={8} strokeLinejoin="round"/>
    <path d="M 150 306 L 200 396 L 250 306 Z" fill={C.cream} stroke={C.ink} strokeWidth={6} strokeLinejoin="round"/>
    <rect x={172} y={262} width={56} height={56} rx={14} fill={C.skinDark} stroke={C.ink} strokeWidth={6}/>
    {arm(armR, 304)}
    <ellipse cx={92} cy={200} rx={22} ry={30} fill={C.skin} stroke={C.ink} strokeWidth={6}/>
    <ellipse cx={308} cy={200} rx={22} ry={30} fill={C.skin} stroke={C.ink} strokeWidth={6}/>
    <path d="M 100 196 Q 100 96 200 96 Q 300 96 300 196 Q 300 296 200 300 Q 100 296 100 196 Z" fill={C.skin} stroke={C.ink} strokeWidth={8}/>
    <path d="M 98 180 Q 94 112 150 96 Q 196 84 250 98 Q 306 114 302 180 Q 290 134 250 126 Q 200 112 150 128 Q 108 138 98 180 Z" fill={C.hair} stroke={C.ink} strokeWidth={6} strokeLinejoin="round"/>
    <g stroke={C.ink} strokeWidth={6} strokeLinecap="round"><line x1={142} y1={160} x2={176} y2={166}/><line x1={258} y1={160} x2={224} y2={166}/></g>
    {blink ? <g stroke={C.ink} strokeWidth={6} strokeLinecap="round"><line x1={146} y1={196} x2={176} y2={196}/><line x1={224} y1={196} x2={254} y2={196}/></g>
      : <g><circle cx={162} cy={196} r={20} fill={C.white} stroke={C.ink} strokeWidth={5}/><circle cx={238} cy={196} r={20} fill={C.white} stroke={C.ink} strokeWidth={5}/>
        <circle cx={162 + lk} cy={198} r={8} fill={C.ink}/><circle cx={238 + lk} cy={198} r={8} fill={C.ink}/>
        <line x1={182} y1={192} x2={218} y2={192} stroke={C.ink} strokeWidth={5}/></g>}
    <path d="M 196 214 Q 186 240 200 244" stroke={C.skinDark} strokeWidth={6} fill="none" strokeLinecap="round"/>
    <path d="M 128 252 Q 160 220 200 238 Q 240 220 272 252 Q 240 270 200 256 Q 160 270 128 252 Z" fill={C.moustache} stroke={C.ink} strokeWidth={5} strokeLinejoin="round"/>
    {viseme ? <Mouth v={viseme === "X" ? "smile" : viseme}/> : mouth === "open" ? <path d="M 170 262 Q 200 296 230 262 Z" fill={C.redDark} stroke={C.ink} strokeWidth={5} strokeLinejoin="round"/>
      : mouth === "smile" ? <path d="M 174 266 Q 200 286 226 266" stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round"/>
      : <line x1={180} y1={270} x2={220} y2={270} stroke={C.ink} strokeWidth={6} strokeLinecap="round"/>}
  </g>;
};

// ---- Kirana shop set (full frame 1080 x 1920) ---------------------------------------------------------------------------
export const Shop: React.FC<{tint?: string}> = ({tint = C.wall}) => {
  const packets = ["#E03A3E", "#2F6FDE", "#F58A1F", "#3DB25C", "#FFD23F", "#8E5BD9"];
  return <g>
    <rect width={1080} height={1920} fill={tint}/>
    <rect y={1010} width={1080} height={910} fill={C.wallLow}/>
    <rect y={1010} width={1080} height={14} fill={C.ink} opacity={0.25}/>
    <rect y={1380} width={1080} height={540} fill={C.floor}/>
    {Array.from({length: 6}, (_, i) => <line key={i} x1={i * 220 - 60} y1={1380} x2={i * 260 - 160} y2={1920} stroke={C.floorDark} strokeWidth={8}/>)}
    <rect y={1372} width={1080} height={16} fill={C.floorDark}/>
    {[330, 640].map((sy, k) => <g key={sy}>
      <rect x={k ? 560 : 40} y={sy} width={480} height={16} rx={6} fill={C.floorDark} stroke={C.ink} strokeWidth={5}/>
      {Array.from({length: 6}, (_, i) => <g key={i}><rect x={(k ? 580 : 60) + i * 74} y={sy - 84 - (i % 3) * 8} width={58} height={84 + (i % 3) * 8} rx={6} fill={packets[(i + k * 2) % 6]} stroke={C.ink} strokeWidth={5}/>
        <rect x={(k ? 590 : 70) + i * 74} y={sy - 56} width={38} height={20} rx={4} fill={C.white} opacity={0.7}/></g>)}
    </g>)}
    <path d="M 0 200 L 1080 200" stroke={C.ink} strokeWidth={8} opacity={0.18}/>
    {Array.from({length: 8}, (_, i) => <g key={i}><line x1={70 + i * 130} y1={200} x2={70 + i * 130} y2={250} stroke={C.ink} strokeWidth={4}/>
      <rect x={42 + i * 130} y={250} width={56} height={84} rx={8} fill={packets[i % 6]} stroke={C.ink} strokeWidth={5}/></g>)}
  </g>;
};
