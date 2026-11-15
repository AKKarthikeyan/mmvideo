// The eight bodies of the cast, each drawn in a 400 x 600 box (feet line y = 600, visible top about y = 70). Original flat characters in the
// pilot's language: 8 px ink outlines, flat fills, dot eyes (the host keeps his glasses), mitten hands. Everyday Indian family dress only:
// kurta, saree, shirt, school uniform. No religious or community marks.
import React from "react";
import {C} from "../palette";
import {Arms, Head, INK, K, SKIN, type FaceSpec, type PersonProps, type Rig} from "./cast_kit";

const S = 8; // outline width
const stroke = {stroke: INK, strokeWidth: S, strokeLinejoin: "round" as const};
const thin = {stroke: INK, strokeWidth: 6, strokeLinejoin: "round" as const};

// ---- uncle (the host): the pilot's shopkeeper, same geometry, plus cheer / worried poses and the cast arm rig ----------------------------
export const Uncle: React.FC<PersonProps> = ({pose, mouth, f, seed}) => {
  const [skin, dk] = SKIN.uncle;
  const rig: Rig = {shL: [96, 336], shR: [304, 336], len: 178, chest: 396, gap: 30};
  const face: FaceSpec = {eye: "white", es: 38, ey: -2, brow: INK, browY: -35, browLen: 17, stern: true, nose: "line", ms: 0.86, my: 78, skinDk: dk};
  return <g>
    <rect x={172} y={262} width={56} height={56} rx={14} fill={dk} {...thin}/>
    <path d="M 70 600 L 76 360 Q 78 316 130 306 L 270 306 Q 322 316 324 360 L 330 600 Z" fill={C.royal} {...stroke}/>
    <path d="M 150 306 L 200 396 L 250 306 Z" fill={C.cream} {...thin}/>
    <Arms pose={pose} rig={rig} f={f} seed={seed} w={40} skin={skin} hr={26} sleeve={{col: C.royalDark, frac: 1, extra: 0}}/>
    <Head cx={200} cy={198} hw={100} ht={102} hb={102} skin={skin} skinDk={dk} face={face} pose={pose} mouth={mouth} f={f} seed={seed} ear={22}
      front={<path d="M -102 -18 Q -106 -86 -50 -102 Q -4 -114 50 -100 Q 106 -84 102 -18 Q 90 -64 50 -72 Q 0 -86 -50 -70 Q -92 -60 -102 -18 Z" fill={C.hair} {...thin}/>}
      mid={<path d="M -72 54 Q -40 22 0 40 Q 40 22 72 54 Q 40 72 0 58 Q -40 72 -72 54 Z" fill={C.moustache} stroke={INK} strokeWidth={5} strokeLinejoin="round"/>}/>
  </g>;
};

// ---- father -----------------------------------------------------------------------------------------------------------------
export const Father: React.FC<PersonProps> = ({pose, mouth, f, seed}) => {
  const [skin, dk] = SKIN.father;
  const rig: Rig = {shL: [104, 332], shR: [296, 332], len: 190, chest: 392, gap: 28};
  const face: FaceSpec = {eye: "dot", es: 40, ey: 0, er: 12, brow: K.black, browY: -34, browW: 9, nose: "line", ns: 0.9, ms: 0.88, my: 66, skinDk: dk};
  return <g>
    <path d="M 100 436 L 300 436 L 292 578 L 208 578 L 200 480 L 192 578 L 108 578 Z" fill={K.slate} {...stroke}/>
    <rect x={96} y={558} width={96} height={42} rx={18} fill={K.shoe} {...thin}/><rect x={208} y={558} width={96} height={42} rx={18} fill={K.shoe} {...thin}/>
    <rect x={176} y={268} width={48} height={44} rx={12} fill={dk} {...thin}/>
    <path d="M 92 440 L 92 346 Q 92 308 130 304 L 270 304 Q 308 308 308 346 L 308 440 Z" fill={K.rust} {...stroke}/>
    <rect x={92} y={420} width={216} height={22} fill={K.shoe} {...thin}/><rect x={186} y={420} width={28} height={22} rx={4} fill={C.gold} {...thin}/>
    <path d="M 160 304 L 200 346 L 240 304 L 224 300 L 200 322 L 176 300 Z" fill={K.rustDk} {...thin}/>
    <path d="M 200 346 L 200 420" stroke={K.rustDk} strokeWidth={6}/>
    <path d="M 238 356 L 276 356 L 276 392 L 238 392 Z" fill="none" stroke={K.rustDk} strokeWidth={6} strokeLinejoin="round"/>
    <Arms pose={pose} rig={rig} f={f} seed={seed} w={44} skin={skin} hr={25} sleeve={{col: K.rust, frac: 1, extra: 0}}/>
    <Head cx={200} cy={188} hw={96} ht={94} hb={100} skin={skin} skinDk={dk} face={face} pose={pose} mouth={mouth} f={f} seed={seed} ear={21}
      front={<path d="M -99 -6 Q -106 -92 0 -97 Q 106 -92 99 -6 Q 92 -50 46 -60 Q 10 -74 -30 -60 Q -86 -52 -99 -6 Z" fill={K.black} {...thin}/>}/>
  </g>;
};

// ---- mother -----------------------------------------------------------------------------------------------------------------
export const Mother: React.FC<PersonProps> = ({pose, mouth, f, seed}) => {
  const [skin, dk] = SKIN.mother;
  const rig: Rig = {shL: [116, 330], shR: [284, 330], len: 172, chest: 388, gap: 24};
  const face: FaceSpec = {eye: "dot", es: 38, ey: 0, er: 11, brow: K.black, browY: -34, browW: 6, nose: "line", ns: 0.75, ny: 4, ms: 0.82, my: 62, blush: true, skinDk: dk};
  return <g>
    <path d="M 114 396 L 286 396 L 330 592 Q 200 606 70 592 Z" fill={K.teal} {...stroke}/>
    <g stroke={K.tealDk} strokeWidth={6} strokeLinecap="round" fill="none"><path d="M 166 404 L 148 584"/><path d="M 200 404 L 200 592"/><path d="M 234 404 L 252 584"/></g>
    <path d="M 74 566 Q 200 580 326 566 L 330 592 Q 200 606 70 592 Z" fill={C.gold} {...thin}/>
    <ellipse cx={152} cy={597} rx={24} ry={8} fill={K.shoe}/><ellipse cx={248} cy={597} rx={24} ry={8} fill={K.shoe}/>
    <rect x={178} y={270} width={44} height={44} rx={12} fill={dk} {...thin}/>
    <path d="M 116 404 L 116 342 Q 116 306 152 302 L 248 302 Q 284 306 284 342 L 284 404 Z" fill={K.maroon} {...stroke}/>
    <path d="M 164 302 Q 200 346 236 302 Z" fill={skin} {...thin}/>
    <path d="M 120 326 Q 124 304 156 302 L 196 302 L 292 412 L 292 480 L 250 480 L 214 420 Q 150 380 120 326 Z" fill={K.teal} {...stroke}/>
    <path d="M 296 480 L 250 480" fill="none" stroke={C.gold} strokeWidth={10} strokeLinecap="round"/>
    <Arms pose={pose} rig={rig} f={f} seed={seed} w={36} skin={skin} hr={23} sleeve={{col: K.maroon, frac: 0.42}}/>
    <Head cx={200} cy={190} hw={92} ht={94} hb={98} skin={skin} skinDk={dk} face={face} pose={pose} mouth={mouth} f={f} seed={seed} ear={20}
      back={<circle cx={56} cy={-96} r={34} fill={K.black} {...thin}/>}
      front={<path d="M -96 16 Q -106 -92 0 -97 Q 106 -92 96 16 Q 86 -40 32 -58 Q 8 -68 -8 -78 Q -54 -50 -96 16 Z" fill={K.black} {...thin}/>}
      over={<>{[-1, 1].map((s) => <circle key={s} cx={s * 90} cy={34} r={7} fill={C.gold} stroke={INK} strokeWidth={4}/>)}</>}/>
  </g>;
};

// ---- grandmother ------------------------------------------------------------------------------------------------------------
export const Grandmother: React.FC<PersonProps> = ({pose, mouth, f, seed}) => {
  const [skin, dk] = SKIN.grandmother;
  const rig: Rig = {shL: [110, 340], shR: [290, 340], len: 160, chest: 396, gap: 24};
  const face: FaceSpec = {eye: "dot", es: 38, ey: 2, er: 10, glasses: "round", brow: K.greyDk, browY: -34, browW: 6, nose: "line", ns: 0.8, ny: 4, ms: 0.82, my: 64, wrinkles: true, skinDk: dk};
  return <g>
    <path d="M 108 410 L 292 410 L 338 592 Q 200 606 62 592 Z" fill={K.plum} {...stroke}/>
    <g stroke={K.plumDk} strokeWidth={6} strokeLinecap="round" fill="none"><path d="M 160 418 L 140 584"/><path d="M 200 418 L 200 592"/><path d="M 240 418 L 260 584"/></g>
    <path d="M 66 566 Q 200 580 334 566 L 338 592 Q 200 606 62 592 Z" fill={K.cream} {...thin}/>
    <ellipse cx={148} cy={597} rx={24} ry={8} fill={K.shoe}/><ellipse cx={252} cy={597} rx={24} ry={8} fill={K.shoe}/>
    <rect x={176} y={286} width={48} height={40} rx={12} fill={dk} {...thin}/>
    <path d="M 108 416 L 108 356 Q 108 316 150 312 L 250 312 Q 292 316 292 356 L 292 416 Z" fill={K.cream} {...stroke}/>
    <path d="M 164 312 Q 200 352 236 312 Z" fill={skin} {...thin}/>
    <path d="M 114 340 Q 118 314 154 312 L 196 312 L 300 424 L 300 486 L 254 486 L 216 428 Q 150 392 114 340 Z" fill={K.plum} {...stroke}/>
    <path d="M 304 486 L 254 486" fill="none" stroke={K.cream} strokeWidth={10} strokeLinecap="round"/>
    <Arms pose={pose} rig={rig} f={f} seed={seed} w={36} skin={skin} hr={22} sleeve={{col: K.cream, frac: 0.4}}/>
    <Head cx={200} cy={204} hw={92} ht={94} hb={98} skin={skin} skinDk={dk} face={face} pose={pose} mouth={mouth} f={f} seed={seed} ear={20}
      back={<circle cx={0} cy={-106} r={36} fill={K.grey} {...thin}/>}
      front={<path d="M -96 14 Q -106 -92 0 -97 Q 106 -92 96 14 Q 86 -42 30 -58 Q 6 -66 0 -80 Q -6 -66 -30 -58 Q -86 -42 -96 14 Z" fill={K.grey} {...thin}/>}/>
  </g>;
};

// ---- girl (school uniform: white shirt, blue pinafore, red tie, plaits with red ribbons) ------------------------------------------
export const Girl: React.FC<PersonProps> = ({pose, mouth, f, seed}) => {
  const [skin, dk] = SKIN.girl;
  const rig: Rig = {shL: [134, 322], shR: [266, 322], len: 150, chest: 372, gap: 22, spread: 0.55};
  const face: FaceSpec = {eye: "dot", es: 42, ey: 6, er: 13, brow: K.black, browY: -30, browLen: 15, browW: 6, nose: "dot", ny: 38, ns: 1, ms: 0.8, my: 76, blush: true, skinDk: dk};
  const plait = (s: number) => <g key={s} transform={`translate(${200 + s * 104} 198)`}>
    {[0, 1, 2].map((i) => <ellipse key={i} cx={s * i * 3} cy={i * 28} rx={20 - i * 2} ry={22} fill={K.black} {...thin}/>)}
    <g transform={`translate(${s * 8} 92)`}><path d="M 0 0 L -22 -12 L -22 12 Z M 0 0 L 22 -12 L 22 12 Z" fill={C.red} {...thin}/><circle r={7} fill={C.red} {...thin}/></g>
  </g>;
  return <g>
    <rect x={146} y={440} width={42} height={130} rx={14} fill={skin} {...thin}/><rect x={212} y={440} width={42} height={130} rx={14} fill={skin} {...thin}/>
    <rect x={146} y={522} width={42} height={52} rx={12} fill={C.white} {...thin}/><rect x={212} y={522} width={42} height={52} rx={12} fill={C.white} {...thin}/>
    <ellipse cx={162} cy={586} rx={36} ry={14} fill={INK}/><ellipse cx={238} cy={586} rx={36} ry={14} fill={INK}/>
    <rect x={182} y={270} width={36} height={32} rx={10} fill={dk} {...thin}/>
    <path d="M 128 364 L 128 328 Q 128 296 162 292 L 238 292 Q 272 296 272 328 L 272 364 Z" fill={C.white} {...stroke}/>
    <path d="M 172 292 L 200 328 L 228 292 Z" fill={C.white} {...thin}/>
    <path d="M 112 456 L 138 346 L 262 346 L 288 456 Q 200 470 112 456 Z" fill={C.royal} {...stroke}/>
    <path d="M 150 350 L 158 300 L 178 296 L 176 350 Z M 250 350 L 242 300 L 222 296 L 224 350 Z" fill={C.royal} {...thin}/>
    <path d="M 190 306 L 210 306 L 214 322 L 200 330 L 186 322 Z M 192 330 L 208 330 L 214 372 L 200 384 L 186 372 Z" fill={C.red} {...thin}/>
    <path d="M 126 424 L 274 424" stroke={C.royalDark} strokeWidth={6}/>
    {plait(-1)}{plait(1)}
    <Arms pose={pose} rig={rig} f={f} seed={seed} w={34} skin={skin} hr={22} sleeve={{col: C.white, frac: 0.34}}/>
    <Head cx={200} cy={174} hw={110} ht={108} hb={112} skin={skin} skinDk={dk} face={face} pose={pose} mouth={mouth} f={f} seed={seed} ear={18}
      front={<g><path d="M -112 12 Q -122 -100 0 -106 Q 122 -100 112 12 Q 100 -44 40 -62 Q 14 -50 0 -78 Q -14 -50 -40 -62 Q -100 -44 -112 12 Z" fill={K.black} {...thin}/></g>}/>
  </g>;
};

// ---- boy ------------------------------------------------------------------------------------------------------------------
export const Boy: React.FC<PersonProps> = ({pose, mouth, f, seed}) => {
  const [skin, dk] = SKIN.boy;
  const rig: Rig = {shL: [138, 320], shR: [262, 320], len: 150, chest: 372, gap: 22, spread: 0.58};
  const face: FaceSpec = {eye: "dot", es: 42, ey: 6, er: 13, brow: K.black, browY: -30, browLen: 15, browW: 7, nose: "dot", ny: 38, ns: 1, ms: 0.8, my: 76, blush: true, skinDk: dk};
  return <g>
    <rect x={142} y={480} width={40} height={96} rx={14} fill={skin} {...thin}/><rect x={218} y={480} width={40} height={96} rx={14} fill={skin} {...thin}/>
    <rect x={142} y={538} width={40} height={36} rx={12} fill={C.white} {...thin}/><rect x={218} y={538} width={40} height={36} rx={12} fill={C.white} {...thin}/>
    <path d="M 120 572 Q 120 560 150 560 L 182 560 Q 190 586 188 600 L 124 600 Q 116 590 120 572 Z M 280 572 Q 280 560 250 560 L 218 560 Q 210 586 212 600 L 276 600 Q 284 590 280 572 Z" fill={C.white} {...thin}/>
    <rect x={184} y={274} width={32} height={30} rx={10} fill={dk} {...thin}/>
    <path d="M 126 428 L 130 336 Q 132 296 170 292 L 230 292 Q 268 296 270 336 L 274 428 Z" fill={K.green} {...stroke}/>
    <path d="M 172 292 Q 200 322 228 292" fill="none" stroke={K.greenDk} strokeWidth={8} strokeLinecap="round"/>
    <path d="M 124 424 L 276 424 L 284 498 L 206 498 L 200 466 L 194 498 L 116 498 Z" fill={K.khaki} {...stroke}/>
    <Arms pose={pose} rig={rig} f={f} seed={seed} w={34} skin={skin} hr={22} sleeve={{col: K.green, frac: 0.34}}/>
    <Head cx={200} cy={178} hw={108} ht={110} hb={108} skin={skin} skinDk={dk} face={face} pose={pose} mouth={mouth} f={f} seed={seed} ear={18}
      front={<path d="M -106 -2 Q -114 -102 0 -106 Q 114 -102 106 -2 Q 96 -48 62 -58 Q 44 -80 14 -58 Q -26 -72 -62 -52 Q -96 -44 -106 -2 Z" fill={K.black} {...thin}/>}/>
  </g>;
};

// ---- baby (a toddler in a yellow onesie, one curl of hair) ------------------------------------------------------------------------
export const Baby: React.FC<PersonProps> = ({pose, mouth, f, seed}) => {
  const [skin, dk] = SKIN.baby;
  const rig: Rig = {shL: [126, 384], shR: [274, 384], len: 130, chest: 430, gap: 22, spread: 0.58};
  const face: FaceSpec = {eye: "dot", es: 42, ey: 16, er: 14, brow: K.black, browY: -20, browLen: 14, browW: 5, nose: "none", ms: 0.85, my: 80, blush: true, skinDk: dk};
  return <g>
    <rect x={128} y={540} width={50} height={46} rx={20} fill={skin} {...thin}/><rect x={222} y={540} width={50} height={46} rx={20} fill={skin} {...thin}/>
    <ellipse cx={150} cy={588} rx={34} ry={12} fill={skin} {...thin}/><ellipse cx={250} cy={588} rx={34} ry={12} fill={skin} {...thin}/>
    <path d="M 106 520 Q 94 436 116 380 Q 140 336 200 336 Q 260 336 284 380 Q 306 436 294 520 Q 292 560 250 562 L 150 562 Q 108 560 106 520 Z" fill={C.yellow} {...stroke}/>
    <path d="M 160 336 Q 200 372 240 336" fill="none" stroke={C.orange} strokeWidth={8} strokeLinecap="round"/>
    <g fill={C.orange}><circle cx={186} cy={548} r={5}/><circle cx={200} cy={548} r={5}/><circle cx={214} cy={548} r={5}/></g>
    <Arms pose={pose} rig={rig} f={f} seed={seed} w={40} skin={skin} hr={22} sleeve={{col: C.yellow, frac: 0.42}}/>
    <Head cx={200} cy={196} hw={118} ht={122} hb={118} skin={skin} skinDk={dk} face={face} pose={pose} mouth={mouth} f={f} seed={seed} ear={20}
      front={<g><path d="M 0 -112 C -6 -150 32 -152 30 -126 C 28 -108 6 -114 14 -130" stroke={INK} strokeWidth={17} fill="none" strokeLinecap="round"/><path d="M 0 -112 C -6 -150 32 -152 30 -126 C 28 -108 6 -114 14 -130" stroke={K.black} strokeWidth={8} fill="none" strokeLinecap="round"/></g>}/>
  </g>;
};

// ---- teacher (kurta, cream dupatta, glasses, a neat bob) -------------------------------------------------------------------------
export const Teacher: React.FC<PersonProps> = ({pose, mouth, f, seed}) => {
  const [skin, dk] = SKIN.teacher;
  const rig: Rig = {shL: [114, 328], shR: [286, 328], len: 178, chest: 388, gap: 26};
  const face: FaceSpec = {eye: "dot", es: 38, ey: 0, er: 10, glasses: "rect", brow: K.black, browY: -36, browW: 6, nose: "line", ns: 0.78, ny: 4, ms: 0.82, my: 62, skinDk: dk};
  return <g>
    <path d="M 126 468 L 274 468 L 266 578 L 208 578 L 200 504 L 192 578 L 134 578 Z" fill={K.slate} {...stroke}/>
    <path d="M 120 580 Q 120 556 150 556 L 190 556 L 192 600 L 126 600 Q 118 592 120 580 Z M 280 580 Q 280 556 250 556 L 210 556 L 208 600 L 274 600 Q 282 592 280 580 Z" fill={K.shoe} {...thin}/>
    <rect x={178} y={268} width={44} height={44} rx={12} fill={dk} {...thin}/>
    <path d="M 106 474 L 114 346 Q 116 306 152 302 L 248 302 Q 284 306 286 346 L 294 474 Z" fill={K.purple} {...stroke}/>
    <path d="M 164 302 Q 200 340 236 302 Z" fill={skin} {...thin}/>
    <path d="M 108 450 L 292 450" stroke={K.purpleDk} strokeWidth={6}/>
    <path d="M 142 316 Q 200 372 258 316 L 270 336 Q 200 396 130 336 Z" fill={K.cream} {...thin}/>
    <path d="M 132 334 L 168 352 L 158 474 L 120 466 Z M 268 334 L 232 352 L 242 474 L 280 466 Z" fill={K.cream} {...thin}/>
    <path d="M 122 458 L 160 466 M 278 458 L 240 466" stroke={C.gold} strokeWidth={8} strokeLinecap="round"/>
    <Arms pose={pose} rig={rig} f={f} seed={seed} w={38} skin={skin} hr={23} sleeve={{col: K.purple, frac: 0.8}}/>
    <Head cx={200} cy={190} hw={92} ht={94} hb={98} skin={skin} skinDk={dk} face={face} pose={pose} mouth={mouth} f={f} seed={seed} ear={20}
      back={<path d="M -100 -10 Q -110 -98 0 -100 Q 110 -98 100 -10 L 104 74 Q 100 106 68 108 L -68 108 Q -100 106 -104 74 Z" fill={K.black} {...thin}/>}
      front={<path d="M -92 -4 Q -100 -92 0 -96 Q 100 -92 92 -4 Q 70 -50 30 -62 Q -20 -70 -58 -44 Q -86 -30 -92 -4 Z" fill={K.black} {...thin}/>}/>
  </g>;
};
