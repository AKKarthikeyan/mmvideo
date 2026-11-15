// ECO-16 Part 2, builder F2: `rounds-stairs` (b07). A staircase of stacks on a stone ledge, atlas painted. Step 0 is the first deposit (a bundle of notes, e16_rounds r0); the steps after it
// are loans in coin stacks (r1, r2, then the same ratio r1 / r0 for the fading tail). Heights follow the table values and the geometric ratio; the running total of deposits climbs and
// settles on the table's total; the closing pie splits reserves and loans from the same table.
import React from "react";
import {SANS, SERIF, W, H, clamp} from "../kit";
import type {AP} from "./analogy_kit";
import {CoinStack, Defs, ECard, NoteStack, Plate, Shade, Specks, elabs, ez, lerp, pop, pulse, sm, v} from "./analogy_f2_kit";

const N = 11, PLINTH = 764, X0 = 250, DX = 98, K = 3.3;     // K: px per rupee of stack height (one scale for every step)

const AtlasBG: React.FC<{f: number}> = ({f}) => (
  <g>
    <defs>
      <linearGradient id="rs-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f7ecd0"/><stop offset="1" stopColor="#e8d6a8"/></linearGradient>
      <radialGradient id="rs-sea" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#8fc3c4" stopOpacity="0.55"/><stop offset="1" stopColor="#8fc3c4" stopOpacity="0"/></radialGradient>
      <radialGradient id="rs-land" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#d9b46a" stopOpacity="0.5"/><stop offset="1" stopColor="#d9b46a" stopOpacity="0"/></radialGradient>
      <linearGradient id="rs-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f0e2c0"/><stop offset="1" stopColor="#bda276"/></linearGradient>
    </defs>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#rs-bg)"/>
    <ellipse cx={420} cy={300} rx={640} ry={360} fill="url(#rs-sea)"/>
    <ellipse cx={1500} cy={760} rx={620} ry={300} fill="url(#rs-land)"/>
    <ellipse cx={1250} cy={160} rx={520} ry={220} fill="url(#rs-sea)" opacity={0.6}/>
    {/* graticule */}
    {Array.from({length: 14}, (_, i) => <path key={`m${i}`} d={`M${i * 150 - 40},-20 Q${i * 150 + 20 + Math.sin(f / 120 + i) * 2},540 ${i * 150 - 40},1100`} stroke="#9a8458" strokeWidth={1.4} fill="none" opacity={0.28}/>)}
    {Array.from({length: 8}, (_, i) => <path key={`p${i}`} d={`M-40,${i * 150 - 30} Q960,${i * 150 - 10} 1960,${i * 150 - 30}`} stroke="#9a8458" strokeWidth={1.4} fill="none" opacity={0.28}/>)}
    {/* a compass rose, faint */}
    <g transform="translate(1790 960) scale(0.9)" opacity={0.3}>
      <circle r={70} fill="none" stroke="#7a5a32" strokeWidth={2}/><circle r={54} fill="none" stroke="#7a5a32" strokeWidth={1.2}/>
      <path d="M0,-100 L12,-12 L100,0 L12,12 L0,100 L-12,12 L-100,0 L-12,-12 Z" fill="#c9a86a" stroke="#7a5a32" strokeWidth={2}/>
      <path d="M0,-100 L12,-12 L-12,-12 Z" fill="#9a3a2a"/>
    </g>
    {/* the stone ledge */}
    <ellipse cx={720} cy={PLINTH + 66} rx={760} ry={24} fill="#2a1808" opacity={0.34} filter="url(#e3-glow)"/>
    <rect x={120} y={PLINTH} width={1170} height={30} rx={6} fill="url(#rs-stone)" stroke="#8a6f42" strokeWidth={2.4}/>
    <rect x={104} y={PLINTH + 30} width={1202} height={34} rx={6} fill="#d2bb8c" stroke="#8a6f42" strokeWidth={2.4}/>
    <rect x={120} y={PLINTH} width={1170} height={6} fill="#fff" opacity={0.5}/>
    {Array.from({length: 11}, (_, i) => <path key={i} d={`M${200 + i * 108},${PLINTH + 30} V${PLINTH + 64}`} stroke="#8a6f42" strokeWidth={1.4} opacity={0.5}/>)}
    <Specks f={f} n={16} seed={9} y0={140} y1={760}/>
  </g>
);

/** the closing pie: slices from the table (reserves, loans), sweeping in */
const Pie: React.FC<{cx: number; cy: number; r: number; reserves: number; loans: number; p: number; f: number}> = ({cx, cy, r, reserves, loans, p, f}) => {
  if (p <= 0.003) return null;
  const tot = reserves + loans, a1 = (reserves / tot) * 2 * Math.PI * p, a2 = 2 * Math.PI * p, P = (a: number, rr = r): [number, number] => [cx + Math.sin(a) * rr, cy - Math.cos(a) * rr];
  const arc = (from: number, to: number, c: string, st: string, off = 0) => {
    const mid = (from + to) / 2, ox = Math.sin(mid) * off, oy = -Math.cos(mid) * off, s = P(from), e = P(to);
    return <path d={`M${cx + ox},${cy + oy} L${s[0] + ox},${s[1] + oy} A${r},${r} 0 ${to - from > Math.PI ? 1 : 0} 1 ${e[0] + ox},${e[1] + oy} Z`} fill={c} stroke={st} strokeWidth={4} strokeLinejoin="round"/>;
  };
  const pop1 = 12 * (0.5 + 0.5 * Math.sin(f / 14));
  return (
    <g filter="url(#e3-sh)" opacity={clamp(p * 4)}>
      <circle cx={cx} cy={cy} r={r + 16} fill="#fffaf0" stroke="#c9ad7a" strokeWidth={3} opacity={0.9}/>
      {arc(a1, a2, "#4aa56a", "#1a5a37")}
      {arc(0, a1, "#f0b44a", "#7a4f0e", 8 + pop1 * 0.4)}
      <path d={`M${cx - r * 0.7},${cy - r * 0.55} A${r * 0.9},${r * 0.9} 0 0 1 ${cx - r * 0.05},${cy - r * 0.92}`} fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.35}/>
    </g>
  );
};

const Badge: React.FC<{x: number; y: number; r: number; text: string; a: number; f: number}> = ({x, y, r, text, a, f}) => {
  if (a <= 0.001) return null;
  const m = text.match(/^(.*?)(\S+)$/), top = m ? m[1].trim() : "", big = m ? m[2] : text;
  return (
    <g transform={`translate(${x} ${y + (1 - a) * -30}) rotate(${Math.sin(f / 30) * 1.4}) scale(${0.7 + 0.3 * a})`} opacity={a} filter="url(#e3-sh)">
      <path d={`M${-r * 0.5},${r * 0.8} L${-r * 0.7},${r * 1.55} L${-r * 0.3},${r * 1.32} L${-r * 0.12},${r * 1.62} L${r * 0.05},${r * 0.9} Z`} fill="#c63f2f" stroke="#7a1f16" strokeWidth={2}/>
      <path d={`M${r * 0.5},${r * 0.8} L${r * 0.7},${r * 1.55} L${r * 0.3},${r * 1.32} L${r * 0.12},${r * 1.62} L${-r * 0.05},${r * 0.9} Z`} fill="#d84a38" stroke="#7a1f16" strokeWidth={2}/>
      {Array.from({length: 24}, (_, i) => { const an = (i * Math.PI * 2) / 24; return <circle key={i} cx={Math.cos(an) * r * 1.04} cy={Math.sin(an) * r * 1.04} r={r * 0.09} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={1.4}/>; })}
      <circle r={r} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
      <circle r={r * 0.84} fill="#fbf3dc" stroke="#8e6522" strokeWidth={2.4}/>
      <circle r={r * 0.76} fill="none" stroke="#c9a15a" strokeWidth={1.4} strokeDasharray="3 5"/>
      <text y={-r * 0.34} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={r * 0.2} letterSpacing={r * 0.02} fill="#6a3a12">{top.toUpperCase()}</text>
      <text y={r * 0.4} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={r * 0.7} fill="#4a2f0a">{big}</text>
    </g>
  );
};

export const RoundsArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p);
  const r0 = v("e16_rounds", "r0"), r1 = v("e16_rounds", "r1"), r2 = v("e16_rounds", "r2"), total = v("e16_rounds", "total"), res = v("e16_rounds", "reserves"), loans = v("e16_rounds", "loans");
  const q = r1 / r0;                                   // the fraction the loans shrink by each round
  const val = (i: number) => i === 0 ? r0 : i === 1 ? r1 : i === 2 ? r2 : r2 * Math.pow(q, i - 2);
  const t = (i: number) => i === 0 ? L.r0.at : i === 1 ? L.r1.at : i === 2 ? L.r2.at : L.r2.at + 30 + (i - 3) * 16;
  const g = (i: number) => sm(f, t(i), i < 3 ? 34 : 26);
  const tops = Array.from({length: N}, (_, i) => ({x: X0 + i * DX, top: PLINTH - val(i) * K * g(i)}));
  const partial = Array.from({length: N}, (_, i) => val(i) * g(i)).reduce((a, b) => a + b, 0);
  const shown = lerp(partial, total, sm(f, L.tot.at, 46));
  const pie = sm(f, L.tot.at + 10, 50);
  const guide = ez(f, L.r2.at + 20, 50);
  const hops = [0, 1, 2, 3, 4, 5].map((i) => {
    if (g(i + 1) < 0.85) return null;
    const u = (f * 0.02 + i * 0.23) % 1, a = tops[i], b = tops[i + 1], x = lerp(a.x, b.x, u), y = lerp(a.top, b.top, u) - Math.sin(Math.PI * u) * 46 - 28;
    return <g key={i} transform={`translate(${x} ${y})`} opacity={Math.min(1, u * 8, (1 - u) * 8) * (1 - i * 0.12)}><CoinStack id={`rs-h${i}`} x={0} y={0} h={9} d={34}/></g>;
  });
  return (
    <g>
      <Defs/>
      <AtlasBG f={f}/>
      {/* the guide curve through the tops: the geometric decay */}
      {guide > 0.01 && <path d={tops.slice(2).map((tp, i) => `${i ? "L" : "M"}${tp.x},${tp.top - 14}`).join(" ")} pathLength={1} strokeDasharray="0.012 0.02" fill="none" stroke="#7a5a32" strokeWidth={3} opacity={0.55 * guide} strokeLinecap="round"/>}
      {tops.map((tp, i) => {
        const h = val(i) * K, a = i < 3 ? 1 : Math.max(0.16, 1 - (i - 2) * 0.12);
        return i === 0
          ? <NoteStack key={i} id="rs-s0" x={tp.x} y={PLINTH} h={h} w={94} k={g(i)} a={clamp(g(i) * 4)} tone="teal"/>
          : <CoinStack key={i} id={`rs-s${i}`} x={tp.x} y={PLINTH} h={h} d={80} k={g(i)} a={a * clamp(g(i) * 4)}/>;
      })}
      {hops}
      <Badge x={730} y={196} r={86} text={L.rr.text} a={ez(f, L.rr.at, 22)} f={f}/>
      {/* the running total of deposits */}
      <g opacity={ez(f, L.r0.at, 24)} transform={`translate(1560 190)`} filter="url(#e3-sh)">
        <rect x={-240} y={-82} width={480} height={190} rx={26} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
        <rect x={-226} y={-68} width={452} height={162} rx={18} fill="#1a1510" stroke="#3a2a12" strokeWidth={2}/>
        <text x={0} y={-30} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={24} letterSpacing={5} fill="#c8a45a">TOTAL DEPOSITS</text>
        <text x={0} y={64} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={96} fill="#ffd36a" stroke="#a8741c" strokeWidth={1.4} paintOrder="stroke">{`₹${Math.round(shown)}`}</text>
        <rect x={-222} y={-64} width={444} height={70} rx={14} fill="#fff" opacity={0.05}/>
        <ellipse cx={0} cy={0} rx={250} ry={110} fill="#ffd37a" opacity={0.18 * pulse(f, L.tot.at, 60)} filter="url(#e3-glow)"/>
      </g>
      <Pie cx={1560} cy={532} r={140} reserves={res} loans={loans} p={pie} f={f}/>
      {pie > 0.5 && <g opacity={clamp((pie - 0.5) * 2)}>
        <text x={1708} y={366} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} letterSpacing={3} fill="#7a4f0e">RESERVES</text>
        <text x={1530} y={600} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={30} letterSpacing={4} fill="#ffffff" stroke="#1a5a37" strokeWidth={5} paintOrder="stroke">LOANS</text>
      </g>}
    </g>
  );
};

export const RoundsLabels: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p);
  const h = (i: number) => PLINTH - (i === 0 ? v("e16_rounds", "r0") : i === 1 ? v("e16_rounds", "r1") : v("e16_rounds", "r2")) * K;
  return <>
    <ECard cx={X0} y={h(0) - 168} text={L.r0.text} f={f} at={L.r0.at} size={28} maxW={420} upper={false} tone="cool"/>
    <ECard cx={X0 + DX + 20} y={h(1) - 168} text={L.r1.text} f={f} at={L.r1.at} size={28} maxW={420} upper={false}/>
    <ECard cx={X0 + 2 * DX + 40} y={h(2) - 168} text={L.r2.text} f={f} at={L.r2.at} size={28} maxW={420} upper={false}/>
    <ECard cx={1555} y={708} text={L.tot.text} f={f} at={L.tot.at} size={26} maxW={540} upper={false} tone="green"/>
  </>;
};
