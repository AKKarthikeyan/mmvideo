// POL-03 Part 2, builder W3: `phone-66a`. A phone shows an ordinary post with a padlock of fear over it; on the open law book a page labelled 66A tears out and falls,
// the lock shatters and the post is free. Motion follows f and at(key) only.
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, eio, rng} from "../kit";
import {prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {W3Defs, Motes, WoodShelf} from "./analogy_w3_kit";

const DESK = 770;

const Bars: React.FC<{x: number; y: number; w: number; n: number; gap?: number; c?: string; h?: number}> = ({x, y, w, n, gap = 17, c = "#a9a290", h = 6}) => (
  <g>{Array.from({length: n}, (_, i) => <rect key={i} x={x} y={y + i * gap} width={w * (i === n - 1 ? 0.6 : 1 - ((i * 7) % 3) * 0.06)} height={h} rx={h / 2} fill={c}/>)}</g>
);

const PhoneBig: React.FC<{f: number; free: number; lock: number}> = ({f, free, lock}) => (
  <g transform={`translate(600 ${DESK})`}>
    <ellipse cx={0} cy={4} rx={190} ry={16} fill="#1a0e04" opacity={0.3}/>
    <path d="M-60,0 L-40,-26 H40 L60,0 Z" fill="url(#w3-woodd)" stroke="#2a1a0c" strokeWidth={2}/>
    <g transform="translate(0 -22)">
      {free > 0.01 && <ellipse cx={0} cy={-250} rx={250} ry={320} fill="url(#w3-glow)" opacity={0.5 * free}/>}
      <rect x={-150} y={-520} width={300} height={520} rx={34} fill="#1d2129" stroke="#566070" strokeWidth={4}/>
      <rect x={-138} y={-508} width={276} height={496} rx={26} fill="#f7f4ec"/>
      <rect x={-138} y={-508} width={276} height={46} rx={26} fill="#2d7fd2"/><rect x={-138} y={-480} width={276} height={18} fill="#2d7fd2"/>
      <circle cx={-110} cy={-486} r={9} fill="#dff0ff"/><rect x={-92} y={-492} width={90} height={12} rx={6} fill="#dff0ff" opacity={0.85}/>
      {/* the post */}
      <circle cx={-96} cy={-410} r={26} fill="#7fa58a" stroke="#4d7358" strokeWidth={2.4}/><circle cx={-96} cy={-416} r={9} fill="#f1dcc0"/><path d="M-110,-396 Q-96,-412 -82,-396" fill="#f1dcc0"/>
      <rect x={-58} y={-424} width={110} height={11} rx={5} fill="#3a3f52"/><rect x={-58} y={-404} width={70} height={8} rx={4} fill="#a9a290"/>
      <Bars x={-120} y={-360} w={236} n={3}/>
      <rect x={-120} y={-296} width={240} height={130} rx={10} fill="url(#w3-day)" stroke="#b9c2c8" strokeWidth={1.6}/>
      <path d="M-120,-210 Q-60,-250 0,-212 Q60,-180 120,-222 L120,-176 Q120,-166 110,-166 H-110 Q-120,-166 -120,-176 Z" fill="#9cc0a0"/>
      <circle cx={70} cy={-262} r={16} fill="#ffe08a"/>
      {[[-90, "heart"], [-10, "chat"], [70, "share"]].map(([x, k]: any) => (
        <g key={k} transform={`translate(${x} -128)`}>
          {k === "heart" ? <path d="M0,10 C-22,-8 -12,-24 0,-12 C12,-24 22,-8 0,10 Z" fill={free > 0.5 ? "#e03a4a" : "#c2b6a4"}/> : k === "chat" ? <path d="M-14,-12 H14 Q18,-12 18,-8 V6 Q18,10 14,10 H0 L-8,18 V10 H-14 Q-18,10 -18,6 V-8 Q-18,-12 -14,-12 Z" fill="#c2b6a4"/> : <path d="M-14,4 L14,-10 L4,12 L0,2 Z" fill="#c2b6a4"/>}
        </g>
      ))}
      <rect x={-138} y={-86} width={276} height={74} fill="#fff" opacity={0.0}/>
      {/* the padlock of fear over the post, then freedom: a blue tick */}
      {lock > 0.01 && (
        <g transform={`translate(96 -430) scale(${0.9 + 0.1 * Math.sin(f / 9)})`} opacity={lock}>
          <path d="M-14,-6 Q-14,-30 0,-30 Q14,-30 14,-6" fill="none" stroke="#9aa0ab" strokeWidth={7} strokeLinecap="round"/>
          <rect x={-22} y={-6} width={44} height={36} rx={6} fill="#c8402a" stroke="#5a1c10" strokeWidth={2.4}/><circle cx={0} cy={10} r={5} fill="#2a1006"/>
        </g>
      )}
      {free > 0.01 && (
        <g transform="translate(96 -420)" opacity={free}><circle r={22} fill="#2d9a5a" stroke="#14502a" strokeWidth={2.4}/><path d="M-9,1 L-2,8 L11,-7" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round"/></g>
      )}
      <rect x={-138} y={-508} width={90} height={500} fill="#fff" opacity={0.07}/>
      <path d="M-134,-510 L-60,-510 L-134,-300 Z" fill="#fff" opacity={0.1}/>
    </g>
  </g>
);

const Tear: React.FC<{p: number}> = ({p}) => {
  // jagged torn edge along the left of the page
  const zz = Array.from({length: 14}, (_, i) => `L${(i % 2 ? 7 : -5)},${-190 + i * 29.2}`).join(" ");
  return <path d={`M0,-190 ${zz} L0,190 L300,190 L300,-190 Z`} fill="url(#w3-paper)" stroke="#a88a58" strokeWidth={2} opacity={1}/>;
};

export const PhoneArt: React.FC<AP> = (p) => {
  const {f} = p, sd = p.at("sd");
  const tl = sd - 55, lift = eio(prog(f, tl, 26)), fall = eio(prog(f, tl + 22, 70)), done = fall >= 1;
  const free = eo(prog(f, sd - 6, 30)), lock = eo(prog(f, 40, 24)) * (1 - eo(prog(f, tl + 18, 8)));
  const BX = 1330, BY0 = 780;
  const popin = eo(prog(f, 6, 22));
  const sh = Array.from({length: 9}, (_, i) => i);
    return (
    <g>
      <W3Defs/>
      <defs><linearGradient id="w3-roomw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9ebe6"/><stop offset="1" stopColor="#f1e4c8"/></linearGradient></defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w3-roomw)"/>
      {/* window and a warm sun beam */}
      <g><rect x={120} y={150} width={300} height={400} rx={6} fill="url(#w3-day)" stroke="#8a6a38" strokeWidth={10}/><path d="M270,150 V550 M120,350 H420" stroke="#8a6a38" strokeWidth={8}/>
        <circle cx={330} cy={250} r={34} fill="#fff1b0"/><circle cx={330} cy={250} r={90} fill="url(#w3-glow)"/>
        <rect x={104} y={550} width={332} height={16} fill="#b98450" stroke="#6a4a2a" strokeWidth={2}/></g>
      <path d={`M130,420 L420,420 L980,${DESK} L560,${DESK} Z`} fill="url(#w3-beam)" opacity={0.5}/>
      <Motes f={f} x0={300} x1={900} y0={400} y1={760} n={26} seed={3}/>
      <rect x={-60} y={DESK - 6} width={W + 120} height={H - DESK + 80} fill="url(#w3-wood)"/>
      <rect x={-60} y={DESK - 6} width={W + 120} height={12} fill="#f2d49a" opacity={0.65}/>
      {sh.map((i) => <path key={i} d={`M-60,${DESK + 40 + i * 40} Q960,${DESK + 30 + i * 40 + (i % 2) * 9} 1980,${DESK + 40 + i * 40}`} stroke="#6e4524" strokeWidth={1.8} fill="none" opacity={0.5}/>)}
      <g opacity={popin} transform={`translate(0 ${(1 - popin) * 30})`}><PhoneBig f={f} free={free} lock={lock}/></g>
      {/* the law book on an easel */}
      <g transform={`translate(${BX} ${BY0})`}>
        <ellipse cx={0} cy={6} rx={380} ry={16} fill="#1a0e04" opacity={0.3}/>
        <path d="M-120,0 L-60,-60 H60 L120,0 Z" fill="url(#w3-woodd)" stroke="#2a1a0c" strokeWidth={2}/>
        <rect x={-330} y={-50} width={660} height={20} rx={4} fill="url(#w3-leather)" stroke="#3a1008" strokeWidth={2}/>
        <path d="M-310,-52 V-430 Q-150,-452 0,-424 Q150,-452 310,-430 V-52 Z" fill="url(#w3-leather)" stroke="#3a1008" strokeWidth={3}/>
        {/* left page */}
        <path d="M-296,-58 V-418 Q-150,-438 -4,-414 V-60 Z" fill="url(#w3-paper)" stroke="#a88a58" strokeWidth={2}/>
        <Bars x={-266} y={-376} w={240} n={9} gap={30} c="#b8a882"/>
        <path d="M-296,-58 V-418 Q-150,-438 -4,-414" fill="none" stroke="#fff" strokeWidth={2} opacity={0.5}/>
        {/* the right page (static stub + the tearing page) */}
        <path d="M4,-60 V-414 Q150,-438 296,-418 V-58 Z" fill="url(#w3-paper)" stroke="#a88a58" strokeWidth={2} opacity={done || lift > 0.02 ? 0.95 : 1}/>
        {lift > 0.02 && <path d={`M4,-414 ${Array.from({length: 10}, (_, i) => `L${4 + (i % 2 ? 9 : 0)},${-414 + i * 39}`).join(" ")} L4,-60 L0,-60 L0,-414 Z`} fill="#6a4a2a" opacity={0.5}/>}
        <path d="M-310,-52 V-430 Q-150,-452 0,-424 Q150,-452 310,-430 V-52" fill="none" stroke="#e8b878" strokeWidth={2} opacity={0.3}/>
        <path d="M0,-424 V-58" stroke="#6a4a2a" strokeWidth={4} opacity={0.5}/>
      </g>
      {/* the 66A page: sits on the right of the book, tears off at its key and falls to the desk */}
      {(() => {
        const x = BX + 4 - 330 * fall, y = BY0 - 237 + 215 * Math.pow(fall, 1.6), rot = -lift * 16 * (1 - fall) + fall * 64, sy = 0.97 - 0.5 * fall;
        const xs = eo(prog(f, tl + 14, 14));
        return (
          <g transform={`translate(${x} ${y}) rotate(${rot}) scale(0.97 ${sy})`}>
            <ellipse cx={150} cy={200} rx={150} ry={10} fill="#000" opacity={0.18 * lift}/>
            <Tear p={fall}/>
            <rect x={20} y={-168} width={260} height={30} rx={4} fill="#e8d8b0"/>
            <text x={150} y={-146} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={13} letterSpacing="0.1em" fill="#6a4a2a">INFORMATION TECHNOLOGY ACT</text>
            <text x={150} y={-34} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={118} fill="#3a1c10">66A</text>
            <path d="M60,-14 H240" stroke="#c8402a" strokeWidth={5} strokeLinecap="round"/>
            <Bars x={40} y={20} w={220} n={5} gap={30} c="#b8a882"/>
            <path d="M52,-130 L248,150 M248,-130 L52,150" stroke="#c8402a" strokeWidth={10} strokeLinecap="round" opacity={0.7 * xs}/>
          </g>
        );
      })()}
    </g>
  );
};

export const PhoneLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  return (
    <>
      {L[0] && <P2Card cx={960} y={84} text={L[0].text} f={p.f} at={L[0].at} size={46} maxW={1200} upper={false}/>}
      {L[1] && <P2Card cx={1330} y={206} text={L[1].text} f={p.f} at={L[1].at} size={28} maxW={720}/>}
    </>
  );
};
