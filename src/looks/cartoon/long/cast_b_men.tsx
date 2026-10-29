// The father: tall and broad-shouldered, orange shirt, slate trousers, short black hair, a watch. (The uncle is in cast_uncle.tsx.)
import React from "react";
import {C} from "../palette";
import {Arm, Ears, Face, HAIR_BLACK, INK, Sweat, armPose, cid, headPath, shade, type Rig} from "./cast_b_kit";

type P = {r: Rig; blink: number};

export const FATHER_TOP = 86;
export const Father: React.FC<P> = ({r, blink}) => {
  const {f, pose} = r, worry = pose === "worried";
  const skin = "#B97B4C", dark = shade(skin, 0.2), shirt = C.orange, pants = "#3E4A6E";
  const g = armPose(r, {shL: [112, 334], shR: [288, 334], len: 172, out: 0.09});
  const torso = "M 98 336 Q 98 300 142 298 L 258 298 Q 302 300 302 336 L 298 442 L 102 442 Z", clip = cid("father", "torso");
  const wrist = (e: [number, number]) => <g transform={`translate(${e[0]} ${e[1] + 14})`}><rect x={-22} y={-7} width={44} height={14} rx={5} fill="#2B2433" stroke={INK} strokeWidth={4}/></g>;
  void wrist;
  return <g>
    {[150, 250].map((x) => <ellipse key={x} cx={x + (x < 200 ? -4 : 4)} cy={594} rx={42} ry={14} fill="#2B2433" stroke={INK} strokeWidth={6}/>)}
    <path d="M 106 436 L 110 590 L 194 590 L 200 490 L 206 590 L 290 590 L 294 436 Z" fill={pants} stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
    <path d="M 152 470 L 150 584 M 248 470 L 250 584" stroke={shade(pants, 0.25)} strokeWidth={5} strokeLinecap="round"/>
    <clipPath id={clip}><path d={torso}/></clipPath>
    <path d={torso} fill={shirt}/>
    <g clipPath={`url(#${clip})`}>
      <rect x={232} y={348} width={34} height={38} rx={6} fill={shade(shirt, 0.1)} stroke={INK} strokeWidth={4}/>
      <line x1={200} y1={350} x2={200} y2={440} stroke={shade(shirt, 0.28)} strokeWidth={5}/>
      {[372, 400, 424].map((y) => <circle key={y} cx={200} cy={y} r={4.5} fill={C.cream}/>)}
    </g>
    <path d={torso} fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
    <rect x={102} y={428} width={196} height={22} fill="#4A2E22" stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    <rect x={186} y={430} width={28} height={18} rx={3} fill={C.gold} stroke={INK} strokeWidth={4}/>
    <rect x={176} y={262} width={48} height={50} rx={14} fill={dark} stroke={INK} strokeWidth={6}/>
    <path d="M 160 296 L 200 352 L 150 322 Z M 240 296 L 200 352 L 250 322 Z" fill={C.cream} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    <Arm sh={[112, 334]} c={g.L.c} e={g.L.e} w={40} sleeve={shirt} sleeveT={0.36} skin={skin} hr={23}/>
    <Arm sh={[288, 334]} c={g.R.c} e={g.R.e} w={40} sleeve={shirt} sleeveT={0.36} skin={skin} hr={23} finger={g.finger}/>
    <Ears cy={198} dx={93} rx={17} ry={25} skin={skin}/>
    <path d={headPath(200, 192, 93, 100, 100, 0.8)} fill={skin} stroke={INK} strokeWidth={8}/>
    <path d="M 104 188 Q 96 90 200 88 Q 304 90 296 188 Q 290 150 262 134 Q 246 150 214 130 Q 176 120 144 130 Q 112 148 104 188 Z" fill={HAIR_BLACK} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    <path d="M 146 130 Q 172 112 214 130" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round"/>
    <Face r={r} blink={blink} ey={192} edx={38} er={17} epr={8} by={162} bdx={38} bw={38} bthick={8} barch={3} btilt={-2} my={262} mk={0.95}
      nose={<path d="M 198 208 Q 186 234 205 236" stroke={dark} strokeWidth={6} fill="none" strokeLinecap="round"/>}/>
    {worry && <Sweat x={296} y={134} f={f}/>}
  </g>;
};
