// The uncle (host): the pilot's Keeper (../art.tsx), redrawn here so it can take the Actor API: five poses (idle, present, point, cheer, worried),
// any Rhubarb mouth letter, a seeded blink. Same paths, colours and proportions as the Keeper; arms gain the ink outline used by the rest of the cast.
import React from "react";
import {C} from "../palette";
import {Arm, INK, MouthG, Sweat, armPose, type Rig} from "./cast_b_kit";

export const UNCLE_TOP = 84;

export const Uncle: React.FC<{r: Rig; blink: number}> = ({r, blink}) => {
  const {f, pose, seed, look} = r, g = armPose(r, {shL: [96, 332], shR: [304, 332], len: 170, out: 0.09});
  const lk = look * 6, cheer = pose === "cheer", worry = pose === "worried";
  const sleeve = C.royalDark, skin = C.skin;
  const arms = <>
    <Arm sh={[96, 332]} c={g.L.c} e={g.L.e} w={46} sleeve={sleeve} skin={skin} hr={26}/>
    <Arm sh={[304, 332]} c={g.R.c} e={g.R.e} w={46} sleeve={sleeve} skin={skin} hr={26} finger={g.finger}/>
  </>;
  // Keeper brows slope down towards the nose; worried lifts the inner ends, cheer raises both.
  const bl = worry ? [[142, 170, 176, 156]] : cheer ? [[142, 150, 176, 150]] : [[142, 160, 176, 166]];
  const [b0, b1, b2, b3] = bl[0];
  return <g>
    <path d="M 70 600 L 76 360 Q 78 316 130 306 L 270 306 Q 322 316 324 360 L 330 600 Z" fill={C.royal} stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
    <path d="M 150 306 L 200 396 L 250 306 Z" fill={C.cream} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    {arms}
    <rect x={172} y={262} width={56} height={56} rx={14} fill={C.skinDark} stroke={INK} strokeWidth={6}/>
    <ellipse cx={92} cy={200} rx={22} ry={30} fill={skin} stroke={INK} strokeWidth={6}/>
    <ellipse cx={308} cy={200} rx={22} ry={30} fill={skin} stroke={INK} strokeWidth={6}/>
    <path d="M 100 196 Q 100 96 200 96 Q 300 96 300 196 Q 300 296 200 300 Q 100 296 100 196 Z" fill={skin} stroke={INK} strokeWidth={8}/>
    <path d="M 98 180 Q 94 112 150 96 Q 196 84 250 98 Q 306 114 302 180 Q 290 134 250 126 Q 200 112 150 128 Q 108 138 98 180 Z" fill={C.hair} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    <g stroke={INK} strokeWidth={6} strokeLinecap="round"><line x1={b0} y1={b1} x2={b2} y2={b3}/><line x1={400 - b0} y1={b1} x2={400 - b2} y2={b3}/></g>
    {/* glasses: the two rings are the lenses, the eyes sit inside them */}
    {[162, 238].map((x) => <g key={x}>
      <circle cx={x} cy={196} r={20} fill={C.white} stroke={INK} strokeWidth={5}/>
      {cheer ? <path d={`M ${x - 12} ${202} Q ${x} ${180} ${x + 12} ${202}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round"/>
        : blink >= 1 ? <path d={`M ${x - 13} 196 Q ${x} 204 ${x + 13} 196`} stroke={INK} strokeWidth={5.5} fill="none" strokeLinecap="round"/>
        : <ellipse cx={x + lk} cy={198} rx={8} ry={blink > 0 ? 3 : 8} fill={INK}/>}
    </g>)}
    <line x1={182} y1={192} x2={218} y2={192} stroke={INK} strokeWidth={5}/>
    <path d="M 196 214 Q 186 240 200 244" stroke={C.skinDark} strokeWidth={6} fill="none" strokeLinecap="round"/>
    <path d="M 128 252 Q 160 220 200 238 Q 240 220 272 252 Q 240 270 200 256 Q 160 270 128 252 Z" fill={C.moustache} stroke={INK} strokeWidth={5} strokeLinejoin="round"/>
    <MouthG v={r.mouth} x={200} y={274} k={1} pose={pose} f={f}/>
    {worry && <Sweat x={296} y={132} f={f}/>}
  </g>;
};
