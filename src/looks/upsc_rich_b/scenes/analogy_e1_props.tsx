// ECO-16 Part 1, builder E1: props for the barter lane and the shop: shoes, plough, wheat sacks and sheaf, thought bubbles, two stalls, cheque, stamps.
import React from "react";
import {SANS, SERIF, rng} from "../kit";
import {Awning, FruitPile} from "./analogy_e1_kit";

export const Shoes: React.FC<{s?: number; pair?: boolean}> = ({s = 1, pair = true}) => {
  const shoe = (dx: number, dy: number, k: number) => (
    <g transform={`translate(${dx} ${dy}) scale(${k})`}>
      <path d="M-62,10 L-62,-14 Q-62,-30 -46,-32 L-14,-34 Q-2,-10 30,-6 Q60,-2 66,8 L66,16 Q66,22 58,22 L-56,22 Q-62,22 -62,10 Z" fill="#8a4f26" stroke="#4a2810" strokeWidth={3}/>
      <path d="M-62,16 L66,16 L66,24 Q66,28 58,28 L-56,28 Q-64,28 -62,22 Z" fill="#2a1a10"/>
      <path d="M-14,-34 Q-2,-10 30,-6" stroke="#4a2810" strokeWidth={2} fill="none"/>
      <path d="M-6,-24 l16,8 M2,-30 l16,8 M10,-34 l14,6" stroke="#f4e7c4" strokeWidth={3} strokeLinecap="round"/>
      <path d="M-56,-12 Q-50,-24 -38,-26" stroke="#d99a5a" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6}/>
      <ellipse cx={34} cy={2} rx={22} ry={5} fill="#fff" opacity={0.18}/>
    </g>
  );
  return <g transform={`scale(${s})`}>{pair && shoe(-14, -10, 0.9)}{shoe(pair ? 22 : 0, 6, 1)}</g>;
};

export const Plough: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <path d="M0,0 Q40,-40 52,-120" stroke="#4a2c14" strokeWidth={24} fill="none" strokeLinecap="round"/><path d="M0,0 Q40,-40 52,-120" stroke="#9a6a3a" strokeWidth={17} fill="none" strokeLinecap="round"/>
    <path d="M52,-120 L150,-330" stroke="#4a2c14" strokeWidth={17} strokeLinecap="round"/><path d="M52,-120 L150,-330" stroke="#a87a46" strokeWidth={11} strokeLinecap="round"/>
    <path d="M122,-330 L182,-306" stroke="#4a2c14" strokeWidth={14} strokeLinecap="round"/><path d="M122,-330 L182,-306" stroke="#a87a46" strokeWidth={8} strokeLinecap="round"/>
    <path d="M44,-130 L-210,-222" stroke="#4a2c14" strokeWidth={17} strokeLinecap="round"/><path d="M44,-130 L-210,-222" stroke="#b98850" strokeWidth={11} strokeLinecap="round"/>
    <path d="M-210,-222 L-240,-232 M-210,-222 L-226,-198" stroke="#4a2c14" strokeWidth={11} strokeLinecap="round"/>
    <path d="M-34,10 L26,-6 L18,-40 L-22,-36 Z" fill="#6a6e76" stroke="#2a2c30" strokeWidth={3}/>
    <path d="M-24,-4 L14,-14" stroke="#c8ccd2" strokeWidth={3} strokeLinecap="round"/>
    <path d="M44,-98 L70,-92 M60,-150 L84,-142" stroke="#2a2c30" strokeWidth={5} strokeLinecap="round"/>
  </g>
);

export const WheatSack: React.FC<{s?: number; open?: boolean}> = ({s = 1, open = true}) => (
  <g transform={`scale(${s})`}>
    <path d="M-48,0 Q-60,-50 -46,-96 Q-34,-112 -16,-118 L16,-118 Q34,-112 46,-96 Q60,-50 48,0 Z" fill="#cfae74" stroke="#7a5a30" strokeWidth={3}/>
    <path d="M10,-110 Q44,-90 38,-40 Q36,-10 40,0 L48,0 Q60,-50 46,-96 Q34,-110 16,-118 Z" fill="#7a5a30" opacity={0.3}/>
    {open && <path d="M-34,-110 Q0,-136 34,-110 Q0,-100 -34,-110 Z" fill="#e8c04a" stroke="#a8801a" strokeWidth={2}/>}
    {open && Array.from({length: 11}, (_, i) => <circle key={i} cx={-24 + i * 5} cy={-114 + (i % 3) * 3} r={2.4} fill="#f6d66a"/>)}
    <path d="M-30,-112 Q0,-96 30,-112" stroke="#6a4a24" strokeWidth={4} fill="none"/>
    {[-24, -8, 10, 28].map((x, i) => <path key={i} d={`M${x},-80 L${x + 3},-6`} stroke="#8a6a3a" strokeWidth={1.6} opacity={0.5}/>)}
    <path d="M-40,-40 H40 M-42,-70 H42" stroke="#8a6a3a" strokeWidth={1.4} opacity={0.4}/>
  </g>
);

export const Sheaf: React.FC<{s?: number}> = ({s = 1}) => {
  const g = rng(19);
  return (
    <g transform={`scale(${s})`}>
      {Array.from({length: 26}, (_, i) => { const a = (i - 12.5) * 3.4, ln = 150 + g() * 30; return (
        <g key={i} transform={`rotate(${a})`}><path d={`M0,0 L0,${-ln}`} stroke="#c8a032" strokeWidth={3}/>
          {[0, 1, 2, 3, 4].map((k) => <ellipse key={k} cx={k % 2 ? 4 : -4} cy={-ln + 6 - k * 9} rx={3.4} ry={8} fill="#f0c94a" stroke="#a8801a" strokeWidth={0.8} transform={`rotate(${k % 2 ? 24 : -24} ${k % 2 ? 4 : -4} ${-ln + 6 - k * 9})`}/>)}</g>); })}
      <path d="M-24,-52 Q0,-44 24,-52 L22,-38 Q0,-30 -22,-38 Z" fill="#8a5a2a" stroke="#4a2c14" strokeWidth={2}/>
    </g>
  );
};

/** a thought bubble centred at (x, y) radius r, with a tail of small circles toward (tx, ty); children are drawn in the middle, scaled by the caller */
export const Thought: React.FC<{x: number; y: number; r: number; tx: number; ty: number; a: number; children?: React.ReactNode}> = ({x, y, r, tx, ty, a, children}) => {
  if (a <= 0.002) return null;
  const k = 0.7 + 0.3 * a, bob = Math.sin(x + 3) * 0;
  const puffs = [[-0.62, 0.1, 0.62], [-0.3, -0.5, 0.58], [0.3, -0.52, 0.6], [0.66, 0.05, 0.6], [0.3, 0.52, 0.56], [-0.3, 0.52, 0.56], [0, 0, 0.78]];
  return (
    <g opacity={a} transform={`translate(${x} ${y + (1 - a) * 18 + bob}) scale(${k})`} style={{filter: "drop-shadow(0 10px 8px rgba(40,22,8,.3))"}}>
      {[0.55, 0.34, 0.2].map((u, i) => <circle key={i} cx={(tx - x) * u} cy={(ty - y) * u + r * 0.5} r={r * (0.14 - i * 0.03)} fill="#fffaf0" stroke="#b8a074" strokeWidth={2}/>)}
      {puffs.map(([px, py, pr], i) => <circle key={`o${i}`} cx={px * r} cy={py * r} r={pr * r} fill="#fffaf0" stroke="#b8a074" strokeWidth={2.4}/>)}
      {puffs.map(([px, py, pr], i) => <circle key={`i${i}`} cx={px * r} cy={py * r} r={pr * r - 1.6} fill="#fffaf0"/>)}
      {children}
    </g>
  );
};
export const Tick: React.FC<{x: number; y: number; s?: number; a?: number}> = ({x, y, s = 1, a = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={a}><circle r={24} fill="#2f9a4a" stroke="#1a6a30" strokeWidth={2.4}/><path d="M-11,0 L-3,9 L13,-9" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round"/></g>
);
export const Cross: React.FC<{x: number; y: number; s?: number; a?: number}> = ({x, y, s = 1, a = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={a}><path d="M-60,-46 L60,46 M60,-46 L-60,46" stroke="#fff" strokeWidth={22} strokeLinecap="round"/><path d="M-60,-46 L60,46 M60,-46 L-60,46" stroke="#c0392b" strokeWidth={14} strokeLinecap="round"/></g>
);

/** a shoe-maker's stall: counter, shelves of shoes, striped awning, hanging sandals */
export const ShoeStall: React.FC<{x: number; w: number; f: number}> = ({x, w, f}) => (
  <g>
    <rect x={x + 10} y={440} width={9} height={270} fill="#6a4a2c" stroke="#3a2412" strokeWidth={1.4}/><rect x={x + w - 20} y={440} width={9} height={270} fill="#6a4a2c" stroke="#3a2412" strokeWidth={1.4}/>
    <rect x={x + 19} y={450} width={w - 39} height={250} fill="#3a2a1c" opacity={0.92}/>
    {[0, 1, 2].map((r) => <g key={r}><rect x={x + 19} y={520 + r * 62} width={w - 39} height={9} fill="#8a5a30" stroke="#3a2412" strokeWidth={1.2}/>
      {Array.from({length: 3}, (_, i) => <g key={i} transform={`translate(${x + 62 + i * ((w - 100) / 2.6)} ${518 + r * 62})`}><Shoes s={0.3} pair/></g>)}</g>)}
    <Awning x={x - 10} y={392} w={w + 20} h={50} c1="#2a6fb8" c2="#fff4e0" n={8} f={f}/>
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${x + 70 + i * 120} 446) rotate(${Math.sin(f / 20 + i) * 2.4})`}><path d="M0,0 V26" stroke="#4a2c14" strokeWidth={2}/><g transform="translate(0 42)"><Shoes s={0.22} pair={false}/></g></g>)}
    <rect x={x - 6} y={700} width={w + 12} height={28} rx={5} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
    <rect x={x + 10} y={728} width={w - 20} height={120} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
    <rect x={x + 60} y={744} width={w - 120} height={38} rx={4} fill="#f4e7c4" opacity={0.55}/>
    <text x={x + w / 2} y={773} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} letterSpacing="0.24em" fill="#5a3418">SHOES</text>
  </g>
);

/** a grain seller's stall: counter, jute sacks of wheat, a sheaf, green awning */
export const WheatStall: React.FC<{x: number; w: number; f: number}> = ({x, w, f}) => (
  <g>
    <rect x={x + 10} y={440} width={9} height={270} fill="#6a4a2c" stroke="#3a2412" strokeWidth={1.4}/><rect x={x + w - 20} y={440} width={9} height={270} fill="#6a4a2c" stroke="#3a2412" strokeWidth={1.4}/>
    <Awning x={x - 10} y={392} w={w + 20} h={50} c1="#2f7a4a" c2="#fff4e0" n={8} f={f}/>
    <rect x={x + 19} y={450} width={w - 39} height={250} fill="#3a2a1c" opacity={0.92}/>
    <g transform={`translate(${x + w * 0.5} 692)`}><Sheaf s={1.1}/></g>
    <g transform={`translate(${x + 70} 700)`}><WheatSack s={1.2}/></g>
    <g transform={`translate(${x + w - 70} 700)`}><WheatSack s={1.2}/></g>
    <rect x={x - 6} y={700} width={w + 12} height={28} rx={5} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
    <rect x={x + 10} y={728} width={w - 20} height={120} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
    <rect x={x + 60} y={744} width={w - 120} height={38} rx={4} fill="#f4e7c4" opacity={0.55}/>
    <text x={x + w / 2} y={773} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} letterSpacing="0.24em" fill="#5a3418">GRAIN</text>
    <g transform={`translate(${x + 36} 880)`}>{[0, 1, 2].map((i) => <g key={i} transform={`translate(${i * 56} ${-(i % 2) * 6})`}><WheatSack s={0.7} open={false}/></g>)}</g>
  </g>
);
