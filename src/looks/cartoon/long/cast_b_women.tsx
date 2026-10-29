// The three women of the cast: mother (teal saree, long braid), grandmother (lavender saree, grey bun, rounder and a little stooped),
// teacher (rose kurta set, cream dupatta, short bob, a pencil behind the ear). Everyday dress, no religious or community markers.
import React from "react";
import {C} from "../palette";
import {Arm, Ears, Face, HAIR_BLACK, HAIR_GREY, INK, Sweat, armPose, cid, headPath, shade, type Rig} from "./cast_b_kit";

type P = {r: Rig; blink: number};

// ---- Mother ---------------------------------------------------------------------------------------------------------------------
export const MOTHER_TOP = 90;
export const Mother: React.FC<P> = ({r, blink}) => {
  const {f, pose} = r, worry = pose === "worried";
  const skin = "#D79A68", dark = shade(skin, 0.18), saree = "#25A18E", pallu = "#1B7D6F", blouse = "#F2C14E";
  const g = armPose(r, {shL: [120, 336], shR: [280, 336], len: 164, out: 0.1});
  const body = "M 108 344 Q 108 306 146 302 L 254 302 Q 292 306 292 344 L 284 424 L 322 592 L 78 592 L 116 424 Z", clip = cid("mother", "body");
  const sway = Math.sin(f / 19 + r.seed) * 3;
  return <g>
    <ellipse cx={200} cy={198} rx={100} ry={106} fill={HAIR_BLACK} stroke={INK} strokeWidth={7}/>
    {[150, 250].map((x) => <ellipse key={x} cx={x} cy={592} rx={30} ry={12} fill="#3B2A25" stroke={INK} strokeWidth={6}/>)}
    <clipPath id={clip}><path d={body}/></clipPath>
    <path d={body} fill={saree}/>
    <g clipPath={`url(#${clip})`}>
      {[178, 206, 234].map((x, i) => <line key={x} x1={x - 2 + i} y1={440} x2={x - 12 + i * 12} y2={600} stroke={shade(saree, 0.22)} strokeWidth={5} strokeLinecap="round"/>)}
      <polygon points="206,300 268,300 164,432 104,432" fill={pallu}/>
      <line x1={268} y1={304} x2={164} y2={430} stroke={C.gold} strokeWidth={10}/>
      <line x1={206} y1={304} x2={106} y2={430} stroke={C.gold} strokeWidth={4}/>
      <rect x={60} y={560} width={280} height={40} fill={C.gold}/>
      <rect x={60} y={556} width={280} height={8} fill={pallu}/>
      {Array.from({length: 10}, (_, i) => <circle key={i} cx={86 + i * 26.5} cy={580} r={4.5} fill={C.cream}/>)}
    </g>
    <path d={body} fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
    <path d="M 158 302 Q 200 350 242 302 Z" fill={skin} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    <Arm sh={[120, 336]} c={g.L.c} e={g.L.e} w={34} sleeve={blouse} sleeveT={0.5} skin={skin} hr={21}/>
    <Arm sh={[280, 336]} c={g.R.c} e={g.R.e} w={34} sleeve={blouse} sleeveT={0.5} skin={skin} hr={21} finger={g.finger}/>
    {/* the braid hangs over the shoulder in front of the saree */}
    <g transform={`rotate(${sway * 0.3} 126 262)`}>
      {[[134, 292, 22, 30, 10], [130, 334, 20, 28, 5], [127, 374, 18, 27, 0], [126, 412, 16, 24, -4]].map(([x, y, rx, ry, rot], i) =>
        <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} transform={`rotate(${rot} ${x} ${y})`} fill={HAIR_BLACK} stroke={INK} strokeWidth={6}/>)}
      <rect x={110} y={432} width={32} height={14} rx={6} fill={C.yellow} stroke={INK} strokeWidth={5}/>
      <path d="M 118 444 L 112 476 M 126 446 L 126 482 M 134 444 L 140 476" stroke={INK} strokeWidth={9} strokeLinecap="round"/>
      <path d="M 118 444 L 112 476 M 126 446 L 126 482 M 134 444 L 140 476" stroke={HAIR_BLACK} strokeWidth={4} strokeLinecap="round"/>
    </g>
    <rect x={178} y={266} width={44} height={50} rx={14} fill={dark} stroke={INK} strokeWidth={6}/>
    <Ears cy={206} dx={87} rx={14} ry={20} skin={skin} ring={C.gold}/>
    <path d={headPath(200, 198, 88, 98, 96, 0.6)} fill={skin} stroke={INK} strokeWidth={8}/>
    <path d="M 108 204 Q 98 102 200 96 Q 302 102 292 204 Q 280 152 238 134 Q 212 150 200 124 Q 188 150 162 134 Q 120 152 108 204 Z" fill={HAIR_BLACK} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    <path d="M 200 98 L 200 124" stroke={INK} strokeWidth={4} strokeLinecap="round"/>
    <Face r={r} blink={blink} ey={208} edx={34} er={15} epr={7} by={180} bdx={34} bw={34} bthick={5} barch={5} my={264} mk={0.8} lash blush={[58, 244]}
      nose={<path d="M 198 224 Q 191 238 202 240" stroke={dark} strokeWidth={5} fill="none" strokeLinecap="round"/>}/>
    {worry && <Sweat x={296} y={140} f={f}/>}
  </g>;
};

// ---- Grandmother ----------------------------------------------------------------------------------------------------------------
export const GRANNY_TOP = 50;
export const Grandmother: React.FC<P> = ({r, blink}) => {
  const {f, pose} = r, worry = pose === "worried";
  const skin = "#C98F5E", dark = shade(skin, 0.18), saree = "#9275D6", pallu = "#6F55B0", blouse = C.cream;
  const g = armPose(r, {shL: [112, 340], shR: [288, 340], len: 150, out: 0.1});
  const body = "M 92 352 Q 92 308 140 304 L 260 304 Q 308 308 308 352 L 302 424 L 336 592 L 64 592 L 98 424 Z", clip = cid("grandmother", "body");
  const wr = shade(skin, 0.3);
  return <g>
    {[150, 250].map((x) => <ellipse key={x} cx={x} cy={592} rx={32} ry={12} fill="#5B4636" stroke={INK} strokeWidth={6}/>)}
    <clipPath id={clip}><path d={body}/></clipPath>
    <path d={body} fill={saree}/>
    <g clipPath={`url(#${clip})`}>
      {[170, 200, 232].map((x, i) => <line key={x} x1={x} y1={440} x2={x - 14 + i * 14} y2={600} stroke={shade(saree, 0.2)} strokeWidth={5} strokeLinecap="round"/>)}
      <polygon points="204,302 272,302 172,434 100,434" fill={pallu}/>
      <line x1={272} y1={306} x2={172} y2={432} stroke={C.cream} strokeWidth={10}/>
      <rect x={50} y={558} width={300} height={44} fill={C.cream}/>
      <rect x={50} y={554} width={300} height={8} fill={pallu}/>
      {Array.from({length: 9}, (_, i) => <rect key={i} x={76 + i * 31} y={574} width={11} height={11} rx={2} fill={saree} transform={`rotate(45 ${81.5 + i * 31} 579.5)`}/>)}
    </g>
    <path d={body} fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
    <path d="M 156 304 Q 200 352 244 304 Z" fill={skin} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    <Arm sh={[112, 340]} c={g.L.c} e={g.L.e} w={36} sleeve={blouse} sleeveT={0.52} skin={skin} hr={21}/>
    <Arm sh={[288, 340]} c={g.R.c} e={g.R.e} w={36} sleeve={blouse} sleeveT={0.52} skin={skin} hr={21} finger={g.finger}/>
    {/* a little forward stoop: head and neck lean a few degrees */}
    <g transform="translate(-2 8) rotate(-2 200 310)">
      <rect x={178} y={270} width={44} height={50} rx={14} fill={dark} stroke={INK} strokeWidth={6}/>
      <circle cx={162} cy={96} r={34} fill={HAIR_GREY} stroke={INK} strokeWidth={7}/>
      <path d="M 148 84 Q 162 72 178 84 M 146 102 Q 162 112 180 102" stroke={shade(HAIR_GREY, 0.28)} strokeWidth={4} fill="none" strokeLinecap="round"/>
      <Ears cy={208} dx={90} rx={15} ry={21} skin={skin} ring={C.gold}/>
      <path d={headPath(200, 200, 90, 100, 98, 0.62)} fill={skin} stroke={INK} strokeWidth={8}/>
      <path d="M 106 204 Q 96 104 200 98 Q 304 104 294 204 Q 284 156 242 138 Q 214 152 200 128 Q 186 152 158 138 Q 116 156 106 204 Z" fill={HAIR_GREY} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
      <path d="M 200 100 L 200 128" stroke={INK} strokeWidth={4} strokeLinecap="round"/>
      {/* wrinkles: forehead, crow's feet, smile lines */}
      <g stroke={wr} strokeWidth={4} fill="none" strokeLinecap="round">
        <path d="M 168 150 Q 190 144 206 150"/><path d="M 196 160 Q 216 154 234 160"/>
        <path d="M 138 214 L 128 210 M 138 222 L 128 224"/><path d="M 262 214 L 272 210 M 262 222 L 272 224"/>
        <path d="M 154 250 Q 148 262 156 276"/><path d="M 246 250 Q 252 262 244 276"/>
      </g>
      <Face r={r} blink={blink} ey={212} edx={34} er={14} epr={6.5} by={186} bdx={34} bw={34} bthick={5} barch={4} browColor="#A9A2B8" my={268} mk={0.82} blush={[60, 250]}
        nose={<path d="M 198 226 Q 190 242 203 244" stroke={dark} strokeWidth={5} fill="none" strokeLinecap="round"/>}/>
      {worry && <Sweat x={298} y={140} f={f}/>}
    </g>
  </g>;
};

// ---- Teacher --------------------------------------------------------------------------------------------------------------------
export const TEACHER_TOP = 88;
export const Teacher: React.FC<P> = ({r, blink}) => {
  const {f, pose} = r, worry = pose === "worried";
  const skin = "#9B6438", dark = shade(skin, 0.2), kurta = "#C84B7C", trim = C.gold, dup = "#FFF4D6", pants = "#F4ECD8";
  const g = armPose(r, {shL: [128, 332], shR: [272, 332], len: 170, out: 0.08});
  const body = "M 120 346 Q 120 306 156 302 L 244 302 Q 280 306 280 346 L 288 476 L 112 476 Z", clip = cid("teacher", "body");
  const leg = (x: number) => <g key={x}>
    <path d={`M ${x - 24} 460 L ${x - 22} 590 L ${x + 22} 590 L ${x + 24} 460 Z`} fill={pants} stroke={INK} strokeWidth={7} strokeLinejoin="round"/>
    <path d={`M ${x - 22} 556 L ${x + 22} 556`} stroke={shade(pants, 0.18)} strokeWidth={5}/>
    <ellipse cx={x + (x < 200 ? -6 : 6)} cy={593} rx={32} ry={13} fill="#6B3F2A" stroke={INK} strokeWidth={6}/></g>;
  return <g>
    {/* bob behind the head */}
    <path d="M 104 206 Q 92 94 200 90 Q 308 94 296 206 L 294 290 Q 290 312 264 306 L 136 306 Q 110 312 106 290 Z" fill={HAIR_BLACK} stroke={INK} strokeWidth={7} strokeLinejoin="round"/>
    {leg(158)}{leg(242)}
    <clipPath id={clip}><path d={body}/></clipPath>
    <path d={body} fill={kurta}/>
    <g clipPath={`url(#${clip})`}>
      <rect x={100} y={452} width={200} height={10} fill={trim}/>
      <path d="M 200 440 L 200 480" stroke={shade(kurta, 0.25)} strokeWidth={5}/>
    </g>
    <path d={body} fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
    {/* dupatta: a cream scarf round the neck, two ends hanging in front */}
    <path d="M 148 310 Q 200 330 252 310 L 262 328 Q 200 352 138 328 Z" fill={dup} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    <path d="M 142 326 L 190 346 L 176 466 L 128 456 Z" fill={dup} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    <path d="M 258 326 L 214 346 L 226 438 L 268 430 Z" fill={dup} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    <path d="M 131 440 L 177 450 M 228 418 L 266 412" stroke={C.orange} strokeWidth={9} strokeLinecap="round"/>
    <Arm sh={[128, 332]} c={g.L.c} e={g.L.e} w={32} sleeve={kurta} sleeveT={0.72} skin={skin} hr={20}/>
    <Arm sh={[272, 332]} c={g.R.c} e={g.R.e} w={32} sleeve={kurta} sleeveT={0.72} skin={skin} hr={20} finger={g.finger}/>
    <rect x={180} y={266} width={40} height={50} rx={13} fill={dark} stroke={INK} strokeWidth={6}/>
    <Ears cy={198} dx={84} rx={13} ry={19} skin={skin} ring={C.gold}/>
    <path d={headPath(200, 194, 84, 98, 98, 0.58)} fill={skin} stroke={INK} strokeWidth={8}/>
    <path d="M 108 200 Q 98 98 200 92 Q 302 98 292 200 Q 288 164 264 146 Q 232 118 166 128 Q 122 142 108 200 Z" fill={HAIR_BLACK} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    <path d="M 166 128 Q 178 110 198 96" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round"/>
    {/* pencil tucked behind the ear */}
    <g transform="rotate(-28 126 186)"><rect x={118} y={128} width={14} height={60} rx={5} fill={C.yellow} stroke={INK} strokeWidth={5}/><rect x={118} y={174} width={14} height={14} rx={4} fill="#E8735F" stroke={INK} strokeWidth={4}/><path d="M 118 128 L 125 108 L 132 128 Z" fill={C.cream} stroke={INK} strokeWidth={4} strokeLinejoin="round"/></g>
    <Face r={r} blink={blink} ey={204} edx={33} er={15} epr={7} by={176} bdx={33} bw={34} bthick={5.5} barch={5} browColor={INK} my={260} mk={0.8} lash blush={[56, 240]}
      nose={<path d="M 198 220 Q 191 234 202 236" stroke={dark} strokeWidth={5} fill="none" strokeLinecap="round"/>}/>
    {worry && <Sweat x={292} y={136} f={f}/>}
  </g>;
};
