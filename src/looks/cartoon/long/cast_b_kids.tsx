// The children: girl (school uniform, two plaits), boy (green T-shirt, shorts, spiky hair), baby (sitting, yellow onesie, one curl of hair).
// Kids have bigger heads and eyes than the adults and shorter arms; the baby cries when worried.
import React from "react";
import {C} from "../palette";
import {Arm, Ears, Face, HAIR_BLACK, INK, Sweat, armPose, cid, headPath, shade, type Rig} from "./cast_b_kit";

type P = {r: Rig; blink: number};

// ---- Girl -----------------------------------------------------------------------------------------------------------------------
export const GIRL_TOP = 96;
export const Girl: React.FC<P> = ({r, blink}) => {
  const {f, pose} = r, worry = pose === "worried";
  const skin = "#E0A673", dark = shade(skin, 0.17), navy = C.royalDark, white = C.white;
  const g = armPose(r, {shL: [146, 330], shR: [254, 330], len: 136, out: 0.08});
  const tunic = "M 156 346 L 244 346 L 296 480 L 104 480 Z", clip = cid("girl", "tunic");
  const sway = Math.sin(f / 15 + r.seed) * 2;
  const plait = (s: number) => {
    const x0 = 200 + s * 88, p = `M ${x0} 232 Q ${200 + s * 140} ${284 + sway * s} ${200 + s * 112} ${372}`;
    return <g key={s}>
      <path d={p} stroke={INK} strokeWidth={46} fill="none" strokeLinecap="round"/>
      <path d={p} stroke={HAIR_BLACK} strokeWidth={34} fill="none" strokeLinecap="round"/>
      {[0.32, 0.55, 0.78].map((t) => { const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * (200 + s * 140) + t * t * (200 + s * 112), y = (1 - t) * (1 - t) * 232 + 2 * (1 - t) * t * (284 + sway * s) + t * t * 372;
        return <path key={t} d={`M ${x - 14} ${y - 4} Q ${x} ${y + 6} ${x + 14} ${y - 4}`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7}/>; })}
      <g transform={`translate(${200 + s * 112} 388)`}>
        <path d="M 0 0 L -22 -14 L -22 14 Z M 0 0 L 22 -14 L 22 14 Z" fill={C.red} stroke={INK} strokeWidth={5} strokeLinejoin="round"/>
        <circle r={7} fill={C.red} stroke={INK} strokeWidth={4}/></g>
    </g>;
  };
  const leg = (x: number) => <g key={x}>
    <rect x={x - 17} y={470} width={34} height={110} rx={14} fill={skin} stroke={INK} strokeWidth={7}/>
    <rect x={x - 19} y={546} width={38} height={44} rx={10} fill={white} stroke={INK} strokeWidth={6}/>
    <rect x={x - 19} y={558} width={38} height={8} fill={C.royal}/>
    <ellipse cx={x + (x < 200 ? -6 : 6)} cy={594} rx={32} ry={13} fill="#2B2433" stroke={INK} strokeWidth={6}/></g>;
  return <g>
    <ellipse cx={200} cy={200} rx={102} ry={104} fill={HAIR_BLACK} stroke={INK} strokeWidth={7}/>
    {plait(-1)}{plait(1)}
    {leg(166)}{leg(234)}
    <path d="M 142 330 Q 142 302 166 300 L 234 300 Q 258 302 258 330 L 262 372 L 138 372 Z" fill={white} stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
    <clipPath id={clip}><path d={tunic}/></clipPath>
    <path d={tunic} fill={navy}/>
    <g clipPath={`url(#${clip})`}>
      {[150, 176, 200, 224, 250].map((x, i) => <line key={x} x1={200 + (x - 200) * 0.75} y1={400} x2={200 + (x - 200) * 1.45} y2={486} stroke={shade(navy, 0.35)} strokeWidth={5} strokeLinecap="round" opacity={i === 2 ? 0 : 1}/>)}
      <rect x={90} y={462} width={220} height={8} fill={C.royal}/>
    </g>
    <path d={tunic} fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
    <path d="M 164 346 L 152 306 M 236 346 L 248 306" stroke={navy} strokeWidth={22} strokeLinecap="round"/>
    <path d="M 164 346 L 152 306 M 236 346 L 248 306" stroke={INK} strokeWidth={4} strokeLinecap="round" opacity={0}/>
    <path d="M 168 300 L 200 340 L 232 300 Z" fill={white} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    <path d="M 192 330 L 208 330 L 214 376 L 200 392 L 186 376 Z" fill={C.red} stroke={INK} strokeWidth={5} strokeLinejoin="round"/>
    <Arm sh={[146, 330]} c={g.L.c} e={g.L.e} w={30} sleeve={white} sleeveT={0.28} skin={skin} hr={19}/>
    <Arm sh={[254, 330]} c={g.R.c} e={g.R.e} w={30} sleeve={white} sleeveT={0.28} skin={skin} hr={19} finger={g.finger}/>
    <rect x={180} y={268} width={40} height={42} rx={12} fill={dark} stroke={INK} strokeWidth={6}/>
    <path d="M 168 300 L 200 340 L 232 300 Z" fill={white} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    <Ears cy={206} dx={94} rx={15} ry={22} skin={skin}/>
    <path d={headPath(200, 198, 94, 100, 98, 0.6)} fill={skin} stroke={INK} strokeWidth={8}/>
    <path d="M 108 204 Q 98 102 200 98 Q 302 102 292 204 Q 280 150 238 134 Q 212 150 200 126 Q 188 150 162 134 Q 120 150 108 204 Z" fill={HAIR_BLACK} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    <path d="M 200 100 L 200 126" stroke={INK} strokeWidth={4} strokeLinecap="round"/>
    <Face r={r} blink={blink} ey={210} edx={36} er={18} epr={8.5} by={182} bdx={36} bw={32} bthick={5.5} barch={4} my={268} mk={0.85} lash glint blush={[62, 250, 17, 11]}/>
    {worry && <Sweat x={298} y={140} f={f}/>}
  </g>;
};

// ---- Boy ------------------------------------------------------------------------------------------------------------------------
export const BOY_TOP = 58;
export const Boy: React.FC<P> = ({r, blink}) => {
  const {f, pose} = r, worry = pose === "worried";
  const skin = "#C58552", dark = shade(skin, 0.18), tee = C.green, shorts = "#D8B26A";
  const g = armPose(r, {shL: [148, 334], shR: [252, 334], len: 128, out: 0.08});
  const shirt = "M 142 332 Q 142 304 168 302 L 232 302 Q 258 304 258 332 L 268 440 L 132 440 Z", clip = cid("boy", "tee");
  const leg = (x: number) => <g key={x}>
    <rect x={x - 17} y={480} width={34} height={96} rx={13} fill={skin} stroke={INK} strokeWidth={7}/>
    <ellipse cx={x + (x < 200 ? -5 : 5)} cy={592} rx={34} ry={15} fill={C.white} stroke={INK} strokeWidth={6}/>
    <path d={`M ${x - 36 + (x < 200 ? -5 : 5)} 598 L ${x + 36 + (x < 200 ? -5 : 5)} 598`} stroke={C.red} strokeWidth={6} strokeLinecap="round"/></g>;
  return <g>
    {leg(168)}{leg(232)}
    <path d="M 134 428 L 130 520 L 196 520 L 200 478 L 204 520 L 270 520 L 266 428 Z" fill={shorts} stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
    <clipPath id={clip}><path d={shirt}/></clipPath>
    <path d={shirt} fill={tee}/>
    <g clipPath={`url(#${clip})`}><rect x={120} y={356} width={160} height={22} fill={C.white}/><rect x={120} y={392} width={160} height={14} fill={C.white}/></g>
    <path d={shirt} fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
    <Arm sh={[148, 334]} c={g.L.c} e={g.L.e} w={30} sleeve={tee} sleeveT={0.28} skin={skin} hr={19}/>
    <Arm sh={[252, 334]} c={g.R.c} e={g.R.e} w={30} sleeve={tee} sleeveT={0.28} skin={skin} hr={19} finger={g.finger}/>
    <rect x={180} y={270} width={40} height={42} rx={12} fill={dark} stroke={INK} strokeWidth={6}/>
    <path d="M 170 302 Q 200 328 230 302" stroke={INK} strokeWidth={6} fill={skin} strokeLinejoin="round"/>
    <Ears cy={208} dx={100} rx={19} ry={25} skin={skin}/>
    <path d={headPath(200, 200, 100, 100, 98, 0.62)} fill={skin} stroke={INK} strokeWidth={8}/>
    <path d="M 104 192 Q 94 116 128 100 L 136 70 L 162 94 L 184 62 L 206 92 L 236 64 L 244 96 L 272 76 L 276 104 Q 308 122 298 192 Q 284 148 250 138 Q 200 122 150 138 Q 116 148 104 192 Z" fill={HAIR_BLACK} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
    <Face r={r} blink={blink} ey={212} edx={38} er={19} epr={9} by={184} bdx={38} bw={32} bthick={6.5} barch={2} my={272} mk={0.9} glint blush={[66, 254, 18, 11]}/>
    {worry && <Sweat x={300} y={146} f={f}/>}
  </g>;
};

// ---- Baby -----------------------------------------------------------------------------------------------------------------------
export const BABY_TOP = 62;
export const Baby: React.FC<P> = ({r, blink}) => {
  const {f, pose} = r, worry = pose === "worried";
  const skin = "#E7B58C", dark = shade(skin, 0.17), suit = "#FFE27A", suitD = shade("#FFE27A", 0.2);
  const g = armPose(r, {shL: [136, 392], shR: [264, 392], len: 104, out: 0.1});
  const bodyP = "M 128 340 Q 104 350 102 410 Q 98 490 112 546 Q 200 580 288 546 Q 302 490 298 410 Q 296 350 272 340 Z", clip = cid("baby", "body");
  const foot = (s: number) => {
    const cx = 200 + s * 62, cy = 574;
    return <g key={s}>
      {[-150, -122, -94, -66, -38].map((a, i) => { const rad = (a * Math.PI) / 180; return <circle key={i} cx={cx + Math.cos(rad) * 41 + s * 4} cy={cy + Math.sin(rad) * 28} r={i === 0 || i === 4 ? 8 : 9.5} fill={skin} stroke={INK} strokeWidth={5}/>; })}
      <ellipse cx={cx} cy={cy} rx={44} ry={27} fill={skin} stroke={INK} strokeWidth={7}/>
      <path d={`M ${cx - 20} ${cy + 6} Q ${cx} ${cy + 16} ${cx + 20} ${cy + 6}`} stroke={shade(skin, 0.25)} strokeWidth={4} fill="none" strokeLinecap="round"/>
    </g>;
  };
  const tearY = (f * 1.8) % 44, fm = worry && r.mouth === "X" ? (Math.floor(f / 5) % 2 ? "D" : "C") : r.mouth;
  return <g>
    {foot(-1)}{foot(1)}
    <clipPath id={clip}><path d={bodyP}/></clipPath>
    <path d={bodyP} fill={suit}/>
    <g clipPath={`url(#${clip})`}>
      <path d="M 100 500 Q 200 540 300 500 L 300 560 L 100 560 Z" fill={suitD}/>
      {[392, 428, 464].map((y) => <circle key={y} cx={200} cy={y} r={6} fill={C.white} stroke={INK} strokeWidth={3.5}/>)}
    </g>
    <path d={bodyP} fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round"/>
    <Arm sh={[136, 392]} c={g.L.c} e={g.L.e} w={34} sleeve={suit} sleeveT={0.28} skin={skin} hr={22}/>
    <Arm sh={[264, 392]} c={g.R.c} e={g.R.e} w={34} sleeve={suit} sleeveT={0.28} skin={skin} hr={22} finger={g.finger}/>
    <Ears cy={226} dx={122} rx={16} ry={22} skin={skin}/>
    <path d={headPath(200, 212, 122, 112, 108, 0.7)} fill={skin} stroke={INK} strokeWidth={8}/>
    <path d="M 196 104 C 182 74 222 60 232 84 C 240 104 214 106 210 90" stroke={INK} strokeWidth={22} fill="none" strokeLinecap="round"/>
    <path d="M 196 104 C 182 74 222 60 232 84 C 240 104 214 106 210 90" stroke={HAIR_BLACK} strokeWidth={10} fill="none" strokeLinecap="round"/>
    <Face r={{...r, mouth: fm}} blink={blink} ey={228} edx={46} er={24} epr={11} by={192} bdx={46} bw={30} bthick={5.5} barch={3} my={288} mk={0.82} glint blush={[84, 268, 22, 14]}
      nose={<ellipse cx={200} cy={254} rx={7} ry={5} fill={dark}/>}/>
    {worry && <g>{[-1, 1].map((s) => <g key={s}>
      <rect x={200 + s * 46 - 6} y={240} width={12} height={34} rx={6} fill={C.sky} stroke={INK} strokeWidth={3.5}/>
      <path transform={`translate(${200 + s * 46} ${270 + tearY})`} d="M 0 -14 Q -10 4 0 10 Q 10 4 0 -14 Z" fill={C.sky} stroke={INK} strokeWidth={4} opacity={tearY < 30 ? 1 : 0}/></g>)}</g>}
  </g>;
};
