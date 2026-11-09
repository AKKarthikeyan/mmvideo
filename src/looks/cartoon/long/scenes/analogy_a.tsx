// analogy: heat-rates, column, rooms, gradient.
import React from "react";
import {C} from "../../palette";
import {ease, easeIO, pop} from "../../ui";
import {Actor} from "../cast";
import {Chevrons, Cloud, Flow, INK, Person, Pill, SW, Sun, labelOf, type AnalogyBase, type Pt} from "./analogy_kit";

type P = {f: number; dur: number; spec: AnalogyBase; at: (k: string) => number};
const lab = (spec: AnalogyBase, i: number, at: (k: string) => number) => {
  const l = labelOf(spec.labels, i);
  return l ? {text: l.text, at: at(l.key)} : null;
};

// ---- heat-rates ---------------------------------------------------------------------------------------------------------------
const Thermo: React.FC<{x: number; level: number; f: number}> = ({x, level, f}) => {
  const top = 170, bulbY = 640, tubeW = 74, fillTop = bulbY - (bulbY - top - 40) * level;
  return <g transform={`translate(${x} 0)`}>
    <rect x={-tubeW / 2 - 6} y={top - 6} width={tubeW + 12} height={bulbY - top + 20} rx={44} fill={INK}/>
    <circle cx={0} cy={bulbY + 30} r={72} fill={INK}/>
    <rect x={-tubeW / 2} y={top} width={tubeW} height={bulbY - top + 14} rx={37} fill={C.white}/>
    <circle cx={0} cy={bulbY + 30} r={62} fill={C.red}/>
    <rect x={-17} y={fillTop} width={34} height={bulbY + 30 - fillTop} fill={C.red}/>
    <rect x={-17} y={fillTop - 6} width={34} height={12} rx={6} fill={C.red}/>
    <circle cx={-18} cy={bulbY + 12} r={12} fill={C.white} opacity={0.55}/>
    {Array.from({length: 7}, (_, i) => <line key={i} x1={tubeW / 2 + 6} x2={tubeW / 2 + (i % 2 ? 24 : 40)} y1={top + 60 + i * 66} y2={top + 60 + i * 66} stroke={INK} strokeWidth={6} strokeLinecap="round"/>)}
    <path d={`M ${-tubeW / 2 + 6} ${top + 40} L ${-tubeW / 2 + 6} ${top + 130}`} stroke={C.white} strokeWidth={0}/>
    <g opacity={0.9}>{[0, 1, 2].map((i) => {
      const u = ((f * 0.02 + i / 3) % 1);
      return <circle key={i} cx={Math.sin(u * 9 + i) * 6} cy={fillTop - 18 - u * 50} r={5 - u * 3} fill={C.red} opacity={level > 0.5 ? 1 - u : 0}/>;
    })}</g>
  </g>;
};

const Heat: React.FC<P> = ({f, spec, at}) => {
  const land = ease(f, 4, 62, 0.08, 0.86) + Math.sin(f / 9) * 0.006, water = ease(f, 6, 148, 0.08, 0.34) + Math.sin(f / 13) * 0.004;
  const a = lab(spec, 0, at), b = lab(spec, 1, at), xl = 590, xw = 1330;
  return <g>
    <Sun x={960} y={190} r={64} f={f}/>
    <rect x={0} y={760} width={1920} height={320} fill="#F2E6C4"/><rect x={0} y={760} width={1920} height={8} fill={INK} opacity={0.15}/>
    <g transform="translate(0 -26)">
    {/* land tile */}
    <g transform={`translate(${xl} 0)`}>
      <path d="M -260 800 L -260 740 Q -120 690 0 730 Q 120 770 260 720 L 260 800 Z" fill="#E7C27E" stroke={INK} strokeWidth={SW} strokeLinejoin="round"/>
      <rect x={-260} y={780} width={520} height={44} rx={10} fill={C.floor} stroke={INK} strokeWidth={SW}/>
      {[-190, -70, 90, 190].map((dx, i) => <circle key={i} cx={dx} cy={758 + (i % 2) * 4} r={9} fill={C.floorDark}/>)}
      {[0, 1, 2].map((i) => { const u = (f * 0.012 + i / 3) % 1; return <path key={i} d={`M ${-150 + i * 150} ${715 - u * 80} q 14 -20 0 -38 q -14 -18 0 -38`} fill="none" stroke={C.red} strokeWidth={7} strokeLinecap="round" opacity={(1 - u) * Math.min(1, f / 20)}/>; })}
    </g>
    {/* water tile */}
    <g transform={`translate(${xw} 0)`}>
      <rect x={-260} y={750} width={520} height={74} rx={14} fill={C.blue} stroke={INK} strokeWidth={SW}/>
      {[-170, 0, 170].map((dx, i) => <path key={i} d={`M ${dx - 60} ${776 + Math.sin(f / 10 + i) * 3} q 30 -26 60 0 q 30 26 60 0`} fill="none" stroke={C.white} strokeWidth={7} strokeLinecap="round"/>)}
    </g>
    <Thermo x={xl} level={land} f={f}/>
    <Thermo x={xw} level={water} f={f}/>
    </g>
    {/* fast / slow cue: chevrons beside the mercury */}
    <g opacity={ease(f, 8, 20) * (1 - ease(f, 60, 72))}><Chevrons pts={[[xl + 130, 560], [xl + 130, 260]]} f={f} color={C.red} n={3} speed={0.05}/></g>
    <g opacity={ease(f, 70, 82)}><Chevrons pts={[[xw + 130, 560], [xw + 130, 460]]} f={f} color={C.blue} n={2} speed={0.01} size={16}/></g>
    {a && <Pill text={a.text} f={f} at={a.at} cx={xl} cy={862} size={50}/>}
    {b && <Pill text={b.text} f={f} at={b.at} cx={xw} cy={862} size={50}/>}
  </g>;
};

// ---- column ---------------------------------------------------------------------------------------------------------------------
const Column: React.FC<P> = ({f, spec, at}) => {
  const l = lab(spec, 0, at), cx = 700, feet = 860, gh = 380, headY = feet - gh + 8, top = -60, w = 400;
  const press = Math.sin(f / 10) * 2 + ease(f, 5, 40) * 5;
  return <g>
    {[0, 1, 2].map((i) => <Cloud key={i} x={200 + i * 780} y={150 + (i % 2) * 80} s={0.9} f={f} speed={0.2} seed={i + 1} fill={C.white}/>)}
    <rect x={0} y={700} width={1920} height={400} fill="#4CC06A"/>
    <rect x={0} y={700} width={1920} height={10} fill={INK}/>
    {/* the column of air, from the top of the sky down onto her head */}
    <g opacity={ease(f, 0, 14)}>
      <rect x={cx - w / 2} y={top} width={w} height={headY - top + press * 0.5} rx={30} fill="rgba(47,111,222,0.22)" stroke={INK} strokeWidth={SW} strokeDasharray="26 16" strokeDashoffset={-f * 0.6}/>
      {Array.from({length: 40}, (_, i) => {
        const col = i % 4, row = Math.floor(i / 4), x = cx - w / 2 + 52 + col * 96 + Math.sin(f / 14 + i) * 8, y = top + 90 + row * 38 + Math.cos(f / 12 + i * 2) * 6;
        return y < headY - 30 && y > 10 ? <circle key={i} cx={x} cy={y} r={11} fill={C.sky} stroke={INK} strokeWidth={5}/> : null;
      })}
      {[-1, 1].map((sd) => <g key={sd}><Flow pts={[[cx + sd * (w / 2 + 76), 90], [cx + sd * (w / 2 + 76), headY - 40]]} f={f} color={C.blue} w={22} speed={2.4}/></g>)}
    </g>
    <g transform={`translate(0 ${press * 0.5})`}><Actor who="girl" x={cx} y={feet} h={gh} f={f} pose="worried" seed={3}/></g>
    {l && <Pill text={l.text} f={f} at={l.at} cx={1400} cy={470} size={62} maxW={620}/>}
  </g>;
};

// ---- rooms ------------------------------------------------------------------------------------------------------------------------
const Rooms: React.FC<P> = ({f, spec, at}) => {
  const lo = lab(spec, 0, at), hi = lab(spec, 1, at), hl = lab(spec, 2, at);
  const floorY = 742, roofY = 300, lx0 = 150, mid = 960, rx1 = 1770, doorTop = 410;
  const crowd = Array.from({length: 18}, (_, i) => ({x: 215 + (i % 6) * 118 + (Math.floor(i / 6) % 2) * 40, y: floorY - 8 - Math.floor(i / 6) * 62, seed: i}));
  // walkers: leave the crowd, cross the door, wander into the empty room, fade out
  const walkers = [0, 1, 2, 3, 4].map((k) => {
    const P0 = 220, ph = ((f + k * (P0 / 5)) % P0) / P0, s = 100 + k * 3;
    const sx = 700 + (k % 3) * 70, sy = floorY - 40 - (k % 2) * 25;
    let x: number, y: number, op = 1;
    if (ph < 0.25) { x = sx; y = sy; op = ease(ph, 0, 0.08); }
    else if (ph < 0.55) { const u = easeIO(ph, 0.25, 0.55); x = sx + (mid - sx) * u; y = sy + (floorY - 20 - sy) * u; }
    else { const u = easeIO(ph, 0.55, 0.98); x = mid + (1200 + (k % 3) * 140 - mid) * u; y = floorY - 20 - (k % 2) * 22; op = 1 - ease(ph, 0.9, 1); }
    return <Person key={k} x={x} y={y} h={s} f={f} seed={k + 20} opacity={op} walk={ph > 0.25 && ph < 0.98 ? 1 : 0}/>;
  });
  const stay = [{x: 1330, y: floorY - 20, seed: 41}, {x: 1600, y: floorY - 42, seed: 42}];
  const up = ease(f, lo?.at ?? 1e9, (lo?.at ?? 1e9) + 22), dn = ease(f, hi?.at ?? 1e9, (hi?.at ?? 1e9) + 22), hlt = ease(f, hl?.at ?? 1e9, (hl?.at ?? 1e9) + 22);
  const room = (x0: number, x1: number, fill: string) => <g>
    <rect x={x0} y={roofY} width={x1 - x0} height={floorY - roofY} fill={fill} stroke={INK} strokeWidth={SW}/>
    <rect x={x0 - 16} y={floorY} width={x1 - x0 + 32} height={36} rx={8} fill={C.floor} stroke={INK} strokeWidth={SW}/>
    <rect x={x0 - 16} y={roofY - 30} width={x1 - x0 + 32} height={30} rx={8} fill={C.royalDark} stroke={INK} strokeWidth={SW}/>
  </g>;
  return <g>
    {room(lx0, mid - 22, "#FBE7B0")}
    {room(mid + 22, rx1, "#FFF4D6")}
    {/* shared wall with a door gap */}
    <rect x={mid - 24} y={roofY - 30} width={48} height={floorY - roofY + 30} fill="#FFF0CF"/>
    <rect x={mid - 22} y={roofY - 30} width={44} height={doorTop - roofY + 30} fill={C.wallLow} stroke={INK} strokeWidth={SW}/>
    {crowd.map((c) => <Person key={c.seed} x={c.x} y={c.y} h={96} f={f} seed={c.seed}/>)}
    {stay.map((c) => <Person key={c.seed} x={c.x} y={c.y} h={100} f={f} seed={c.seed}/>)}
    {walkers}
    {/* rise over low (right), sink over high (left) */}
    {lo && up > 0 && <Flow pts={[[1370, 290], [1370, 250], [1370, 215]]} f={f} color={C.orange} w={30} grow={up}/>}
    {hi && dn > 0 && <Flow pts={[[640, 180], [640, 215], [640, 250]]} f={f} color={C.blue} w={30} grow={dn}/>}
    {lo && <Pill text={lo.text} f={f} at={lo.at} cx={1300} cy={98} size={40} maxW={600}/>}
    {hi && <Pill text={hi.text} f={f} at={hi.at} cx={640} cy={98} size={40} maxW={600}/>}
    {hl && hlt > 0 && <Flow pts={[[700, 450], [960, 450], [1260, 450]]} f={f} color={C.red} w={30} grow={hlt}/>}
    {hl && <Pill text={hl.text} f={f} at={hl.at} cx={960} cy={362} size={50} maxW={600}/>}
  </g>;
};

// ---- gradient -------------------------------------------------------------------------------------------------------------------
const Panel: React.FC<{x: number; n: number; gap: number; f: number; strong: boolean}> = ({x, n, gap, f, strong}) => {
  const w = 780, y0 = 190, h = 560, x0 = x - w / 2;
  const span = (n - 1) * gap, first = x - span / 2;
  const speed = strong ? 5.5 : 1.3;
  const lean = strong ? 22 : 5;
  const streaks = Array.from({length: strong ? 9 : 3}, (_, i) => {
    const u = ((f * speed * 0.004 + i / (strong ? 9 : 3)) % 1), yy = y0 + 150 + (i % (strong ? 5 : 3)) * (strong ? 62 : 90) + (strong ? 0 : 20);
    const sx = x0 + 110 + u * (w - 220), len = strong ? 130 : 56;
    return <path key={i} d={`M ${sx} ${yy} l ${len} 0`} stroke={INK} strokeWidth={strong ? 8 : 6} strokeLinecap="round" opacity={Math.min(1, u * 6, (1 - u) * 6) * 0.75}/>;
  });
  return <g>
    <rect x={x0} y={y0} width={w} height={h} rx={34} fill="#F7FBFF" stroke={INK} strokeWidth={SW}/>
    <clipPath id={`cp${Math.round(x)}`}><rect x={x0 + 4} y={y0 + 4} width={w - 8} height={h - 8} rx={30}/></clipPath>
    <g clipPath={`url(#cp${Math.round(x)})`}>
      <rect x={x0} y={y0 + h - 100} width={w} height={100} fill="#4CC06A"/>
      {Array.from({length: n}, (_, i) => <path key={i} d={`M ${first + i * gap + Math.sin(f / 30 + i) * 3} ${y0 + 10} Q ${first + i * gap + 38} ${y0 + h / 2} ${first + i * gap} ${y0 + h - 10}`} fill="none" stroke={C.royal} strokeWidth={8} strokeLinecap="round"/>)}
      {streaks}
      {/* main pressure arrow, high to low */}
      <Flow pts={[[x0 + 150, y0 + 290], [x - 20, y0 + 290], [x0 + w - 170, y0 + 290]]} f={f} color={strong ? C.red : C.orange} w={strong ? 42 : 16} speed={strong ? 5 : 1.4} />
      {/* trees bend with the wind */}
      {[x0 + 150, x0 + w - 130].map((tx, i) => <g key={i} transform={`translate(${tx} ${y0 + h - 40}) rotate(${lean + Math.sin(f / (strong ? 5 : 16) + i) * (strong ? 5 : 2)})`}>
        <path d="M -9 0 L -7 -90 L 9 -90 L 11 0 Z" fill={C.floor} stroke={INK} strokeWidth={6} strokeLinejoin="round"/>
        <circle cx={0} cy={-120} r={50} fill={C.green} stroke={INK} strokeWidth={6}/>
      </g>)}
    </g>
    {/* H and L */}
    <g fontFamily="'LK Bricolage', Arial, sans-serif" fontWeight={800}>
      <circle cx={x0 + 62} cy={y0 + 66} r={42} fill={C.white} stroke={INK} strokeWidth={6}/><text x={x0 + 62} y={y0 + 84} textAnchor="middle" fontSize={52} fill={C.royal}>H</text>
      <circle cx={x0 + w - 62} cy={y0 + 66} r={42} fill={C.white} stroke={INK} strokeWidth={6}/><text x={x0 + w - 62} y={y0 + 84} textAnchor="middle" fontSize={52} fill={C.red}>L</text>
    </g>
  </g>;
};

const Gradient: React.FC<P> = ({f, spec, at}) => {
  const l = lab(spec, 0, at);
  return <g>
    <Panel x={520} n={9} gap={62} f={f} strong/>
    <Panel x={1400} n={3} gap={210} f={f} strong={false}/>
    {l && <Pill text={l.text} f={f} at={l.at} cx={960} cy={850} size={56} maxW={900}/>}
  </g>;
};

export const A: Record<string, React.FC<P>> = {"heat-rates": Heat, column: Column, rooms: Rooms, gradient: Gradient};
void pop; void Sun;
