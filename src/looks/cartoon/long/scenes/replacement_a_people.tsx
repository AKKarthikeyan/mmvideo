// Helper for scenes/replacement.tsx: flat person pictograms in the pilot's style (8 px ink outline, dot eyes, mitten hands, flat fills from C).
// Independent of cast.tsx. Local drawing box 200 x 400, feet line at y = 392; (x, y) is the middle of the feet line, h the height in px.
import React from "react";
import {C} from "../../palette";

export type PKind = "mother" | "father" | "girl" | "boy";
export const GHOST_FILL = "#EEF5FC";

type Props = {
  kind: PKind; x: number; y: number; h: number; f: number; seed?: number;
  ghost?: boolean;          // pale, dashed-outline "empty slot" version (no face)
  clipFrac?: number;        // draw only the bottom fraction of the figure (0..1), full colour: the "0.1 of a child"
  cheer?: number;           // 0 arms down .. 1 arms up
  shadow?: boolean;
};

const HEAD_TOP = {adult: 46, child: 64};
export const figureTop = (kind: PKind) => (kind === "girl" || kind === "boy" ? HEAD_TOP.child : HEAD_TOP.adult);

export const Person: React.FC<Props> = ({kind, x, y, h, f, seed = 1, ghost = false, clipFrac, cheer = 0, shadow = true}) => {
  const child = kind === "girl" || kind === "boy";
  const s = h / 400;
  const bob = Math.sin((f + seed * 13) / 10) * 3 / s;
  const blink = (f + seed * 37) % 112 < 4;
  const fl = (c: string) => (ghost ? GHOST_FILL : c);
  const sw = {stroke: C.ink, strokeWidth: 8, strokeLinejoin: "round" as const, ...(ghost ? {strokeDasharray: "15 12", strokeLinecap: "round" as const, strokeOpacity: 0.75} : {})};
  const hw = {...sw, strokeWidth: 6};
  const hair = C.moustache, skin = fl(C.skin);
  const cloth = {mother: C.red, father: C.blue, girl: C.yellow, boy: C.green}[kind];
  const trim = {mother: C.redDark, father: C.blueDark, girl: C.orange, boy: C.greenDark}[kind];
  const hcx = 100, hcy = child ? 124 : 98, hr = child ? 58 : 52;
  const shoulderY = child ? 190 : 160, armLen = child ? 84 : 98;
  const sway = Math.sin((f + seed * 9) / 8) * 5;
  const base = kind === "mother" ? 15 : 12;
  const th = base + (138 - base) * cheer + sway * (1 - 0.5 * cheer);
  const arm = (side: -1 | 1) => <g key={side} transform={`translate(${100 + side * (kind === "father" ? 40 : 34)} ${shoulderY + 4}) rotate(${side * -1 * th})`}>
    <rect x={-10} y={0} width={20} height={armLen} rx={10} fill={fl(kind === "mother" || kind === "girl" ? skin : cloth)} {...sw}/>
    <circle cx={0} cy={armLen + 2} r={child ? 14 : 16} fill={skin} {...hw}/>
  </g>;
  const feet = (a: number, b: number, yy: number) => <g>
    <ellipse cx={a} cy={yy} rx={20} ry={10} fill={ghost ? GHOST_FILL : C.ink} {...(ghost ? sw : {stroke: C.ink, strokeWidth: 4})}/>
    <ellipse cx={b} cy={yy} rx={20} ry={10} fill={ghost ? GHOST_FILL : C.ink} {...(ghost ? sw : {stroke: C.ink, strokeWidth: 4})}/>
  </g>;
  const face = !ghost && <g>
    {blink ? <g stroke={C.ink} strokeWidth={6} strokeLinecap="round"><line x1={hcx - 28} y1={hcy + 3} x2={hcx - 12} y2={hcy + 3}/><line x1={hcx + 12} y1={hcy + 3} x2={hcx + 28} y2={hcy + 3}/></g>
      : <g fill={C.ink}><circle cx={hcx - 20} cy={hcy + 2} r={7.5}/><circle cx={hcx + 20} cy={hcy + 2} r={7.5}/></g>}
    <path d={`M ${hcx - 17} ${hcy + 24} Q ${hcx} ${hcy + 42} ${hcx + 17} ${hcy + 24}`} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round"/>
    {kind === "father" && <path d={`M ${hcx - 24} ${hcy + 18} Q ${hcx - 10} ${hcy + 8} ${hcx} ${hcy + 16} Q ${hcx + 10} ${hcy + 8} ${hcx + 24} ${hcy + 18} Q ${hcx + 10} ${hcy + 26} ${hcx} ${hcy + 21} Q ${hcx - 10} ${hcy + 26} ${hcx - 24} ${hcy + 18} Z`} fill={C.moustache} stroke={C.ink} strokeWidth={3}/>}
  </g>;
  const fig = <g>
    {kind === "mother" && <circle cx={100} cy={36} r={21} fill={fl(hair)} {...sw}/>}
    {kind === "girl" && <g><circle cx={36} cy={134} r={17} fill={fl(hair)} {...sw}/><circle cx={164} cy={134} r={17} fill={fl(hair)} {...sw}/></g>}
    {kind === "mother" && <g>
      <rect x={78} y={310} width={16} height={74} rx={8} fill={skin} {...sw}/><rect x={106} y={310} width={16} height={74} rx={8} fill={skin} {...sw}/>
      {feet(86, 114, 386)}
      <path d="M 66 152 Q 100 142 134 152 L 164 324 Q 100 342 36 324 Z" fill={fl(cloth)} {...sw}/>
      {!ghost && <path d="M 41 304 Q 100 322 159 304 L 164 324 Q 100 342 36 324 Z" fill={trim}/>}
      {!ghost && <path d="M 66 152 Q 100 142 134 152 L 164 324 Q 100 342 36 324 Z" fill="none" stroke={C.ink} strokeWidth={8} strokeLinejoin="round"/>}
    </g>}
    {kind === "father" && <g>
      <rect x={66} y={296} width={32} height={88} rx={10} fill={fl(C.royalDark)} {...sw}/><rect x={102} y={296} width={32} height={88} rx={10} fill={fl(C.royalDark)} {...sw}/>
      {feet(82, 118, 388)}
      <path d="M 60 156 Q 100 144 140 156 L 148 314 L 52 314 Z" fill={fl(cloth)} {...sw}/>
      {!ghost && <path d="M 82 150 L 100 182 L 118 150 Z" fill={C.white} stroke={C.ink} strokeWidth={5} strokeLinejoin="round"/>}
      {!ghost && <g fill={C.ink}><circle cx={100} cy={214} r={4}/><circle cx={100} cy={246} r={4}/><circle cx={100} cy={278} r={4}/></g>}
    </g>}
    {kind === "girl" && <g>
      <rect x={78} y={306} width={15} height={78} rx={7} fill={skin} {...sw}/><rect x={107} y={306} width={15} height={78} rx={7} fill={skin} {...sw}/>
      {feet(86, 114, 386)}
      <path d="M 66 186 Q 100 176 134 186 L 158 318 Q 100 334 42 318 Z" fill={fl(cloth)} {...sw}/>
      {!ghost && <path d="M 47 300 Q 100 318 153 300 L 158 318 Q 100 334 42 318 Z" fill={trim}/>}
      {!ghost && <path d="M 66 186 Q 100 176 134 186 L 158 318 Q 100 334 42 318 Z" fill="none" stroke={C.ink} strokeWidth={8} strokeLinejoin="round"/>}
    </g>}
    {kind === "boy" && <g>
      <rect x={72} y={326} width={18} height={58} rx={8} fill={skin} {...sw}/><rect x={110} y={326} width={18} height={58} rx={8} fill={skin} {...sw}/>
      {feet(80, 120, 386)}
      <path d="M 64 190 Q 100 180 136 190 L 140 304 L 60 304 Z" fill={fl(cloth)} {...sw}/>
      <path d="M 60 298 L 140 298 L 146 346 L 104 346 L 100 326 L 96 346 L 54 346 Z" fill={fl(C.royal)} {...sw}/>
    </g>}
    {arm(-1)}{arm(1)}
    <circle cx={hcx} cy={hcy} r={hr} fill={skin} {...sw}/>
    {kind === "mother" && <path d="M 49 100 Q 46 44 100 44 Q 154 44 151 100 Q 132 74 100 72 Q 68 74 49 100 Z" fill={fl(hair)} {...sw}/>}
    {kind === "father" && <path d="M 49 90 Q 48 44 100 44 Q 152 44 151 90 Q 134 66 100 64 Q 66 66 49 90 Z" fill={fl(hair)} {...sw}/>}
    {kind === "girl" && <path d="M 42 122 Q 40 62 100 62 Q 160 62 158 122 Q 144 92 100 90 Q 56 92 42 122 Z" fill={fl(hair)} {...sw}/>}
    {kind === "boy" && <path d="M 44 118 Q 42 64 100 64 Q 158 64 156 118 Q 140 90 112 92 L 100 78 L 90 92 Q 56 94 44 118 Z" fill={fl(hair)} {...sw}/>}
    {face}
  </g>;
  const clipId = `pp${Math.round(x)}_${Math.round(y)}_${kind}`;
  const top = child ? HEAD_TOP.child : HEAD_TOP.adult;
  return <g transform={`translate(${x} ${y}) scale(${s}) translate(-100 -392)`}>
    {shadow && !clipFrac && <ellipse cx={100} cy={394} rx={child ? 78 : 88} ry={11} fill={C.shadow}/>}
    <g transform={`translate(0 ${bob})`} clipPath={clipFrac !== undefined ? `url(#${clipId})` : undefined}>
      {clipFrac !== undefined && <clipPath id={clipId}><rect x={-60} y={394 - Math.max(0, clipFrac) * (394 - top)} width={320} height={500}/></clipPath>}
      {fig}
    </g>
  </g>;
};
