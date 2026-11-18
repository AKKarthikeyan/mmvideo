// Character rigs for the Desk Glow style: rounded flat shapes, light rim + dark shade, blink, breathe, walk, wag.
// Coordinates: origin at the feet / ground centre, drawn at scale 1; place with <g transform>.
import React from "react";
import {G, bob, rnd} from "./glow";

/** spiky seed ball (a burdock burr). hooks: draw a tiny hook at each spine tip (close-ups) */
export const Burr: React.FC<{r: number; rot?: number; hooks?: boolean; n?: number; seed?: number; gap?: number}> = ({r, rot = 0, hooks = false, n = 18, seed = 1, gap}) => {
  const spines = Array.from({length: n}, (_, k) => {
    const a = (k / n) * Math.PI * 2 + rnd(k + seed) * 0.25 + (rot * Math.PI) / 180;
    const L = r * (1.55 + 0.25 * rnd(k * 3 + seed));
    const x = Math.cos(a) * L, y = Math.sin(a) * L;
    const hx = x + Math.cos(a + 1.6) * r * 0.16, hy = y + Math.sin(a + 1.6) * r * 0.16;
    return {x, y, a, hx, hy, L};
  }).filter((s) => gap === undefined || Math.abs(((((s.a * 180) / Math.PI - gap) % 360) + 540) % 360 - 180) > 16);
  const w = Math.max(1.2, r * 0.06);
  return (
    <g>
      {spines.map((s, k) => (
        <g key={k}>
          <line x1={0} y1={0} x2={s.x} y2={s.y} stroke={G.burrLo} strokeWidth={w * 1.25} strokeLinecap="round"/>
          <line x1={0} y1={0} x2={s.x} y2={s.y} stroke={G.burrHi} strokeWidth={w * 0.55} strokeLinecap="round" opacity={0.8}/>
          {hooks && <path d={`M${s.x} ${s.y} Q ${s.x + Math.cos(s.a) * r * 0.18} ${s.y + Math.sin(s.a) * r * 0.18} ${s.hx} ${s.hy}`} fill="none" stroke={G.mint} strokeWidth={w * 0.8} strokeLinecap="round"/>}
        </g>
      ))}
      <circle r={r} fill={G.burr}/>
      <circle r={r * 0.78} cx={-r * 0.18} cy={-r * 0.2} fill={G.burrHi} opacity={0.55}/>
      <path d={`M ${-r * 0.9} ${r * 0.25} A ${r} ${r} 0 0 0 ${r * 0.9} ${r * 0.25}`} fill={G.burrLo} opacity={0.5}/>
    </g>
  );
};

export const BURR_SPOTS: [number, number, number][] = [[-62, -140, 13], [-12, -152, 12], [38, -142, 13], [-88, -100, 11], [64, -112, 12], [8, -104, 11], [-40, -112, 10], [86, -150, 10]];

/** the dog (Irish Pointer, chestnut), side view facing right.
 * walk: phase in radians or null; wag 0..1; shake 0..1; look -1..1; blink 0..1 (1 = shut); happy shows the tongue */
export const Pup: React.FC<{f: number; walk?: number | null; wag?: number; shake?: number; look?: number; blink?: number; burrs?: number; happy?: boolean; earUp?: number}> = ({f, walk = null, wag = 0.4, shake = 0, look = 0, blink = 0, burrs = 1, happy = false, earUp = 0}) => {
  const ph = walk ?? 0, moving = walk !== null;
  const leg = (o: number) => (moving ? Math.sin(ph + o) * 26 : 0);
  const lift = moving ? Math.abs(Math.sin(ph)) * 6 : 0;
  const breathe = bob(f, 2.2, 1.6);
  const sh = shake * Math.sin(f * 1.9) * 7, shx = shake * Math.sin(f * 2.3) * 6;
  const tail = -20 + wag * 26 * Math.sin(f / 2.6) - shake * 10;
  const ear = 8 * Math.sin(f / 9) + shake * 30 * Math.sin(f * 1.7) - earUp * 35 + (moving ? 10 * Math.sin(ph * 2) : 0);
  const Leg: React.FC<{x: number; o: number; far?: boolean}> = ({x, o, far}) => (
    <g transform={`translate(${x} -72) rotate(${leg(o)})`}>
      <rect x={-13} y={0} width={26} height={74} rx={13} fill={far ? G.chestnutLo : G.chestnut}/>
      <ellipse cx={4} cy={70} rx={17} ry={9} fill={far ? "#6E2C19" : G.chestnutLo}/>
    </g>
  );
  return (
    <g>
      <ellipse cx={0} cy={2} rx={128} ry={15} fill={G.ink} opacity={0.35}/>
      <g transform={`translate(${shx} ${-lift}) rotate(${sh} 0 -110)`}>
        <Leg x={-64} o={Math.PI} far/>
        <Leg x={70} o={0} far/>
        <g transform={`translate(-104 -128) rotate(${tail})`}>
          <path d="M0 0 C -28 -8 -52 -34 -60 -70" stroke={G.chestnut} strokeWidth={20} strokeLinecap="round" fill="none"/>
          <path d="M-6 -6 C -30 -16 -48 -38 -54 -62" stroke={G.chestnutHi} strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.7}/>
          {burrs > 0 && <g transform="translate(-50 -52)" opacity={burrs}><Burr r={9} seed={41}/></g>}
        </g>
        <g transform={`translate(0 ${breathe * 0.5})`}>
          <rect x={-112} y={-160} width={224} height={100} rx={50} fill={G.chestnut}/>
          <path d="M -80 -152 Q 0 -168 80 -152" stroke={G.chestnutHi} strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.8}/>
          <path d="M -95 -78 Q 0 -56 95 -78" stroke={G.chestnutLo} strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.6}/>
        </g>
        <Leg x={-48} o={0}/>
        <Leg x={86} o={Math.PI}/>
        {burrs > 0 && BURR_SPOTS.map(([x, y, r], k) => (
          <g key={k} transform={`translate(${x + shake * 3 * Math.sin(f * 2 + k)} ${y + breathe * 0.5}) rotate(${(f * 0.6 + k * 40) % 360 * 0.05})`} opacity={burrs}><Burr r={r} seed={k * 7}/></g>
        ))}
        {/* head */}
        <g transform={`translate(98 ${-150 + breathe * 0.8 + (moving ? Math.sin(ph * 2) * 3 : 0)}) rotate(${look * 6 + shake * 9 * Math.sin(f * 2.1)})`}>
          <rect x={-22} y={-40} width={46} height={70} rx={20} fill={G.chestnut}/>
          <circle cx={6} cy={-48} r={54} fill={G.chestnut}/>
          <path d="M -26 -86 Q 6 -104 38 -88" stroke={G.chestnutHi} strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.75}/>
          <rect x={22} y={-58} width={82} height={46} rx={23} fill={G.chestnutHi}/>
          <circle cx={100} cy={-44} r={12} fill={G.ink}/>
          <circle cx={97} cy={-48} r={4} fill={G.cream} opacity={0.6}/>
          <path d="M 56 -20 Q 70 -10 84 -18" stroke={G.chestnutLo} strokeWidth={5} strokeLinecap="round" fill="none"/>
          {happy && <path d="M 66 -16 Q 70 8 80 6 Q 86 -4 80 -16 Z" fill={G.rose}/>}
          <g transform={`translate(22 -64) scale(1 ${Math.max(0.08, 1 - blink)})`}>
            <circle r={12} fill={G.cream}/>
            <circle cx={3 + look * 3} cy={0} r={7} fill={G.ink}/>
            <circle cx={5 + look * 3} cy={-3} r={2.4} fill={G.cream}/>
          </g>
          <g transform={`translate(-14 -78) rotate(${ear})`}>
            <path d="M 0 0 C -26 6 -34 52 -16 80 C -6 92 10 84 12 64 C 14 40 14 12 0 0 Z" fill={G.chestnutLo}/>
          </g>
          {burrs > 0 && <g transform="translate(-8 -100)" opacity={burrs}><Burr r={10} seed={77}/></g>}
        </g>
      </g>
    </g>
  );
};

/** George: rounded figure in a hunting coat and felt hat, front view.
 * armL / armR in degrees (0 = hanging), brow -1 (worried) .. 1 (curious), mouth "smile" | "o" | "flat", tilt degrees */
export const Person: React.FC<{f: number; armL?: number; armR?: number; brow?: number; mouth?: "smile" | "o" | "flat"; tilt?: number; blink?: number; look?: number; walk?: number | null}> = ({f, armL = 8, armR = -8, brow = 0, mouth = "smile", tilt = 0, blink = 0, look = 0, walk = null}) => {
  const breathe = bob(f, 2.5, 2.1);
  const step = walk !== null ? Math.sin(walk) : 0;
  const skin = "#F1C29A", skinLo = "#D99D74", coat = G.teal, coatLo = G.deepTeal, coatHi = "#3FC4B5", hat = "#2F5D3A";
  const Arm: React.FC<{side: -1 | 1; a: number}> = ({side, a}) => (
    <g transform={`translate(${side * 56} -206) rotate(${a * side * -1 + (walk !== null ? step * 12 * side : 0)})`}>
      <rect x={-14} y={0} width={28} height={108} rx={14} fill={coat}/>
      <rect x={-14} y={0} width={10} height={100} rx={5} fill={side < 0 ? coatHi : coatLo} opacity={0.5}/>
      <circle cx={0} cy={112} r={17} fill={skin}/>
    </g>
  );
  return (
    <g>
      <ellipse cx={0} cy={2} rx={95} ry={14} fill={G.ink} opacity={0.35}/>
      <rect x={-38} y={-96} width={32} height={98} rx={16} fill="#24324F" transform={`rotate(${step * 10} -22 -96)`}/>
      <rect x={6} y={-96} width={32} height={98} rx={16} fill="#2B3A5C" transform={`rotate(${-step * 10} 22 -96)`}/>
      <g transform={`translate(0 ${breathe * 0.4})`}>
        <Arm side={1} a={armR}/>
        <rect x={-64} y={-238} width={128} height={168} rx={58} fill={coat}/>
        <path d="M -44 -224 Q -58 -150 -40 -86" stroke={coatHi} strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.55}/>
        <path d="M 46 -220 Q 60 -150 42 -86" stroke={coatLo} strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.55}/>
        <line x1={0} y1={-226} x2={0} y2={-80} stroke={coatLo} strokeWidth={4} opacity={0.7}/>
        {[-196, -160, -124].map((y) => <circle key={y} cx={10} cy={y} r={5} fill={G.gold}/>)}
        <rect x={-30} y={-246} width={60} height={22} rx={11} fill={G.coral}/>
        <Arm side={-1} a={armL}/>
        <g transform={`translate(0 -292) rotate(${tilt})`}>
          <circle r={50} fill={skin}/>
          <path d="M 30 -22 A 50 50 0 0 1 36 30" stroke={skinLo} strokeWidth={10} fill="none" opacity={0.5} strokeLinecap="round"/>
          <circle cx={-50} cy={6} r={10} fill={skin}/><circle cx={50} cy={6} r={10} fill={skin}/>
          <g transform={`translate(${look * 5} 0)`}>
            {[-17, 17].map((x) => <g key={x} transform={`translate(${x} -2) scale(1 ${Math.max(0.1, 1 - blink)})`}><circle r={6.5} fill={G.ink}/><circle cx={2} cy={-2} r={2} fill={G.cream}/></g>)}
            {/* brow > 0 lifts both brows (curious); brow < 0 lifts the inner ends (worried) */}
            {(() => { const up = Math.max(0, brow) * 7, w = Math.max(0, -brow) * 5, inner = -19 - up - w, outer = -17 - up + w; return (
              <>
                <path d={`M -27 ${outer} L -8 ${inner}`} stroke="#4A2E1E" strokeWidth={5} strokeLinecap="round"/>
                <path d={`M 8 ${inner} L 27 ${outer}`} stroke="#4A2E1E" strokeWidth={5} strokeLinecap="round"/>
              </>
            ); })()}
            <ellipse cx={2} cy={10} rx={7} ry={6} fill={skinLo}/>
            {mouth === "smile" && <path d="M -13 24 Q 2 36 17 24" stroke="#6A3020" strokeWidth={5} strokeLinecap="round" fill="none"/>}
            {mouth === "o" && <ellipse cx={2} cy={28} rx={7} ry={9} fill="#6A3020"/>}
            {mouth === "flat" && <path d="M -10 27 L 14 27" stroke="#6A3020" strokeWidth={5} strokeLinecap="round"/>}
          </g>
          {/* felt hat with a feather */}
          <path d="M -70 -30 Q 0 -46 70 -30 Q 74 -22 64 -20 Q 0 -32 -64 -20 Q -74 -22 -70 -30 Z" fill="#244A2E"/>
          <path d="M -42 -32 Q -38 -84 0 -86 Q 38 -84 42 -32 Z" fill={hat}/>
          <path d="M -40 -40 Q 0 -48 40 -40 L 41 -32 Q 0 -40 -41 -32 Z" fill={G.coral}/>
          <path d="M 34 -40 Q 64 -86 50 -110 Q 40 -78 30 -42 Z" fill={G.gold}/>
          <path d="M -30 -70 Q -10 -82 14 -80" stroke="#3E7A4C" strokeWidth={6} strokeLinecap="round" fill="none"/>
        </g>
      </g>
    </g>
  );
};

/** blink helper: returns 0..1 (1 = closed) for a short blink every few seconds */
export const blinkAt = (f: number, every = 95, offset = 0) => {
  const p = (f + offset) % every;
  return p < 3 ? p / 3 : p < 6 ? (6 - p) / 3 : 0;
};
