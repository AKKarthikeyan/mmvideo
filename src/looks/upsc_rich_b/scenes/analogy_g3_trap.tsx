// ECO-16 Part 3, builder G3: `debt-trap` (b03). Swapna's groundnut field on a raised soil block, a moneylender at the gate holding a few notes (no ledger, no table of records).
// ri: coins go from the harvest basket to the lender's hand; the crop wilts; dg: a coin column beside him grows; dt: the term card; rs: a second block, the same thin crop with a net under it,
// and a balance tips from RISK (storm cloud) to SUPPORT (life-buoy). The picture claims only what the words say: no cause for the failure, no result for the second field.
import React from "react";
import {ECard, Coin} from "./analogy_f3_kit";
import {Sun, Cloud, Hills, Tree} from "./analogy_kit";
import {Adult, handPos, type Arms, type Look} from "./analogy_e1_kit";
import {Balance} from "./analogy_e2_kit";
import {Lifebuoy} from "./analogy_f2_kit";
import {G3Defs, CoinColumn, StormCloud, Groundnut, elabs, E, rng, SANS, SERIF, W, H, eo, prog, lerp, clamp, type AP} from "./analogy_g3_kit";

const GY = 810;                       // ground line
const SY = 548, SB = 436;             // slab surface: front and back y
const LOOK_SW: Look = {kind: "saree", accent: "#9a4a2a", shirt: ["#d9b26a", "#a5782e"], hair: "#1a120d", skin: 1, female: true};
const LOOK_ML: Look = {kind: "kurta", shirt: ["#f1ead6", "#bdb08a"], pants: "#efe6cf", hair: "#8a8a86", skin: 1, glasses: true, stache: true};

/** a raised block of soil: top surface in perspective, grass lip, strata front, stilts */
const Slab: React.FC<{ox: number; w: number; fieldW: number; id: string; f: number}> = ({ox, w, fieldW, id, f}) => {
  const roots = [0.14, 0.31, 0.52, 0.7, 0.88].map((u, i) => ({x: ox + w * u, l: 24 + i * 7}));
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c08a52"/><stop offset="1" stopColor="#9a6a3c"/></linearGradient>
        <clipPath id={`${id}-clip`}><path d={`M${ox},${SY} L${ox + w},${SY} L${ox + w - 24},${SB} L${ox + 24},${SB} Z`}/></clipPath>
      </defs>
      {/* stilts, behind */}
      {[ox + 34, ox + w - 34].map((x, i) => (
        <g key={i}>
          <rect x={x - 13} y={634} width={26} height={GY + 14 - 634} fill="#7a5630" stroke="#4e361c" strokeWidth={2}/>
          <rect x={x - 13} y={634} width={8} height={GY + 14 - 634} fill="#fff" opacity={0.16}/>
          <ellipse cx={x + 6} cy={GY + 14} rx={34} ry={8} fill="#2a1808" opacity={0.3}/>
        </g>
      ))}
      {/* soft shadow under the block */}
      <ellipse cx={ox + w / 2} cy={GY + 10} rx={w * 0.46} ry={14} fill="#2a1808" opacity={0.2} filter="url(#ak-blur8)"/>
      {/* front face with strata and roots */}
      <path d={`M${ox},${SY + 12} H${ox + w} V640 ${[...Array(38)].map((_, i) => { const k = 37 - i; return `L${(ox + (w * (k)) / 38).toFixed(1)},${(640 + Math.sin(k * 1.7) * 7 + Math.sin(k * 0.6) * 5).toFixed(1)}`; }).join(" ")} L${ox},640 Z`} fill="url(#g3-soil)" stroke="#4a2c14" strokeWidth={2.4}/>
      {[0, 1, 2].map((k) => <path key={k} d={`M${ox + 6},${590 + k * 16} Q${ox + w * 0.3},${584 + k * 16 + (k % 2) * 10} ${ox + w * 0.55},${592 + k * 16} T${ox + w - 6},${588 + k * 16}`} stroke={k === 1 ? "#5a361a" : "#a37a4a"} strokeWidth={3} fill="none" opacity={0.55}/>)}
      {Array.from({length: 14}, (_, i) => <circle key={i} cx={ox + 24 + ((i * 97) % (w - 48))} cy={596 + ((i * 53) % 38)} r={3 + (i % 3)} fill={i % 2 ? "#c9a06a" : "#6a4426"} opacity={0.6}/>)}
      {roots.map((r, i) => <path key={i} d={`M${r.x},639 q${i % 2 ? 6 : -6},${r.l * 0.5} ${i % 2 ? -3 : 3},${r.l}`} stroke="#6a4a2a" strokeWidth={2.4} fill="none" strokeLinecap="round"/>)}
      {/* top surface */}
      <path d={`M${ox},${SY} L${ox + w},${SY} L${ox + w - 24},${SB} L${ox + 24},${SB} Z`} fill={`url(#${id}-top)`} stroke="#6a4426" strokeWidth={2}/>
      <g clipPath={`url(#${id}-clip)`}>
        {Array.from({length: 9}, (_, i) => { const u = (i + 0.5) / 9, xf = ox + 14 + (fieldW - 28) * u, xb = ox + 24 + 22 + (fieldW - 28 - 44) * u; return <path key={i} d={`M${xf},${SY} L${xb},${SB}`} stroke={i % 2 ? "#7c4f2a" : "#cd9a62"} strokeWidth={i % 2 ? 9 : 5} opacity={0.38}/>; })}
        <rect x={ox} y={SB} width={w} height={26} fill="#e8f0e0" opacity={0.16}/>
      </g>
      <path d={`M${ox - 4},${SY} L${ox + w + 4},${SY} V${SY + 14} H${ox - 4} Z`} fill="url(#g3-grass)" stroke="#4a6a2c" strokeWidth={2}/>
      <path d={`M${ox - 4},${SY + 2} H${ox + w + 4}`} stroke="#d8eaa8" strokeWidth={2.4} opacity={0.7}/>
    </g>
  );
};

/** rows of groundnut plants across the field; `health(i, row)` 0..1 */
const Rows: React.FC<{ox: number; fieldW: number; f: number; health: (i: number) => number; seed: number; from?: number; to?: number; n?: number}> = ({ox, fieldW, f, health, seed, from = 0, to = 4, n = 8}) => {
  const out: React.ReactNode[] = [];
  const rows = 4, r = rng(seed * 13 + 1);
  for (let ro = from; ro < to; ro++) {
    const t = ro / (rows - 1), y = lerp(SB + 18, SY - 10, t), s = lerp(0.6, 1.1, t);
    const xl = lerp(ox + 54, ox + 28, t), xr = lerp(ox + fieldW - 46, ox + fieldW - 22, t);
    for (let i = 0; i < n; i++) {
      const x = lerp(xl, xr, i / (n - 1)) + (r() - 0.5) * 8, id = ro * n + i;
      out.push(<Groundnut key={`${ro}-${i}`} x={x} y={y + (r() - 0.5) * 4} s={s} health={health(id)} f={f} seed={seed + id}/>);
    }
  }
  return <g>{out}</g>;
};

const Basket: React.FC<{x: number; y: number; fill: number}> = ({x, y, fill}) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={4} cy={6} rx={50} ry={9} fill="#2a1808" opacity={0.3}/>
    <path d="M-46,-26 L-38,0 Q0,12 38,0 L46,-26 Z" fill="#c79a52" stroke="#7a5424" strokeWidth={2.4}/>
    {[-30, -14, 2, 18, 34].map((px, i) => <path key={i} d={`M${px},${-26 + i % 2} L${px * 0.9},2`} stroke="#8a6228" strokeWidth={2} opacity={0.6}/>)}
    {[-14, -2].map((py, i) => <path key={i} d={`M${-44 + i * 2},${py} Q0,${py + 8} ${44 - i * 2},${py}`} stroke="#8a6228" strokeWidth={2} fill="none" opacity={0.6}/>)}
    {Array.from({length: Math.round(2 + fill * 8)}, (_, i) => <ellipse key={i} cx={-28 + (i % 5) * 14 + (i > 4 ? 6 : 0)} cy={-30 - (i > 4 ? 8 : 0) + (i % 2)} rx={8} ry={5.4} fill="#e3c488" stroke="#9a7a3c" strokeWidth={1.2} transform={`rotate(${(i * 37) % 60 - 30} ${-28 + (i % 5) * 14} -30)`}/>)}
    <ellipse cx={0} cy={-26} rx={46} ry={7} fill="none" stroke="#7a5424" strokeWidth={2.4}/>
  </g>
);

const Gate: React.FC<{x: number; open: number}> = ({x, open}) => (
  <g>
    {[0, 1].map((k) => <g key={k}><rect x={x + k * 58 - 8} y={SY - 112} width={16} height={122} fill="#7a5630" stroke="#4e361c" strokeWidth={2}/><rect x={x + k * 58 - 8} y={SY - 112} width={5} height={122} fill="#fff" opacity={0.18}/><circle cx={x + k * 58} cy={SY - 114} r={9} fill="#8a6038" stroke="#4e361c" strokeWidth={2}/></g>)}
    <g transform={`translate(${x + 8} ${SY - 8}) skewY(${open * -14}) scale(${1 - open * 0.4} 1)`}>
      {[-90, -50, -12].map((yy, i) => <rect key={i} x={0} y={yy} width={42} height={8} fill="#8a6038" stroke="#4e361c" strokeWidth={1.6}/>)}
    </g>
  </g>
);

/** the net: stretched in perspective between the stilts, sagging, drawn mesh by mesh left to right */
const Net: React.FC<{ox: number; w: number; k: number; f: number}> = ({ox, w, k, f}) => {
  if (k <= 0.002) return null;
  const x0 = ox + 34, x1 = ox + w - 34, yf = 752, yb = 690, sag = 36 + Math.sin(f / 22) * 2;
  const P = (u: number, v: number): [number, number] => [lerp(lerp(x0 + 6, x0 - 2, v), lerp(x1 - 6, x1 + 2, v), u) + 0, lerp(yb, yf, v) + sag * Math.sin(Math.PI * u) * Math.sin(Math.PI * Math.min(1, 0.15 + v * 0.85))];
  const line = (fn: (t: number) => [number, number]) => Array.from({length: 21}, (_, i) => { const [a, b] = fn(i / 20); return `${i ? "L" : "M"}${a.toFixed(1)},${b.toFixed(1)}`; }).join(" ");
  return (
    <g>
      <defs><clipPath id="g3net-clip"><rect x={x0 - 20} y={640} width={(x1 - x0 + 40) * eo(k)} height={200}/></clipPath></defs>
      <g clipPath="url(#g3net-clip)" opacity={clamp(k * 3)}>
        <ellipse cx={(x0 + x1) / 2} cy={yf + 54} rx={(x1 - x0) * 0.42} ry={14} fill="#2a1808" opacity={0.25} filter="url(#ak-blur8)"/>
        {Array.from({length: 13}, (_, i) => <path key={`a${i}`} d={line((t) => P(i / 12, t))} stroke="#6a4a1c" strokeWidth={3.6} fill="none" opacity={0.85}/>)}
        {Array.from({length: 6}, (_, j) => <path key={`b${j}`} d={line((t) => P(t, j / 5))} stroke="#6a4a1c" strokeWidth={3.6} fill="none" opacity={0.85}/>)}
        {Array.from({length: 13}, (_, i) => <path key={`c${i}`} d={line((t) => P(i / 12, t))} stroke="#e8c880" strokeWidth={1.8} fill="none"/>)}
        {Array.from({length: 6}, (_, j) => <path key={`d${j}`} d={line((t) => P(t, j / 5))} stroke="#e8c880" strokeWidth={1.8} fill="none"/>)}
        <path d={`${line((t) => P(t, 1))} ${line((t) => P(1, 1 - t)).replace("M", "L")} ${line((t) => P(1 - t, 0)).replace("M", "L")} ${line((t) => P(0, t)).replace("M", "L")}`} fill="none" stroke="#5a3c14" strokeWidth={6.4} strokeLinejoin="round"/>
        <path d={`${line((t) => P(t, 1))} ${line((t) => P(1, 1 - t)).replace("M", "L")} ${line((t) => P(1 - t, 0)).replace("M", "L")} ${line((t) => P(0, t)).replace("M", "L")}`} fill="none" stroke="#d9a84c" strokeWidth={3.4} strokeLinejoin="round"/>
      </g>
      {/* ropes to the stilts */}
      {[[x0, 0], [x1, 1]].map(([sx, side], i) => <g key={i} opacity={clamp(k * 3)}><path d={`M${sx},${yf - 6} L${side ? P(1, 1)[0] : P(0, 1)[0]},${yf}`} stroke="#5a3c14" strokeWidth={5}/><circle cx={sx} cy={yf - 6} r={9} fill="#d9a84c" stroke="#5a3c14" strokeWidth={2.4}/></g>)}
    </g>
  );
};

/** a few generic notes held in a hand (unit coordinates of the Adult) */
const HeldNotes: React.FC = () => (
  <g transform="translate(-1 -2)">
    {[-14, 0, 14].map((r, i) => (
      <g key={i} transform={`rotate(${r}) translate(${-1.6 + i * 0.6} -6)`}>
        <rect x={-6.6} y={-3.4} width={13.2} height={6.8} rx={0.8} fill="url(#e2-note)" stroke="#4f7f60" strokeWidth={0.5}/>
        <ellipse cx={0} cy={0} rx={2.2} ry={1.8} fill="none" stroke="#4f7f60" strokeWidth={0.4}/>
      </g>
    ))}
  </g>
);

export const DebtTrapArt: React.FC<AP> = (p) => {
  const {f, dur} = p, L = elabs(p), ri = L.ri.at, dg = L.dg.at, rs = L.rs.at;
  // the crop: healthy until it fails, then wilts over about 1.3 s before the debt column starts to grow
  const w0 = ri + 60, w1 = Math.max(w0 + 40, Math.min(dg, rs - 10) - 4), wu = prog(f, w0, w1 - w0);
  const healthL = (i: number) => clamp(1 - (wu * 1.35 - ((i * 37) % 11) / 11 * 0.35) * 0.9);
  const healthR = (i: number) => 0.22 + 0.06 * Math.sin(i * 1.7);
  const worry = E(f, w0 + 16, 30);
  const sk = E(f, rs - 30, 44);        // the second block comes in
  // the lender's arm and the coins from the harvest basket
  const ML = {x: 748, y: 586, h: 336};
  const mlArms: Arms = {L: [44, 70], R: [5, 10]};
  const hand = handPos(ML.x, ML.y, ML.h, mlArms, "L");
  const flow = [0, 1, 2].map((k) => ((f - ri) * 0.022 + k / 3) % 1);
  const flowA = f > ri ? clamp((1 - wu * 1.6)) : 0;
  const BK: [number, number] = [610, 566];
  // the debt column
  const dn = prog(f, dg, Math.min(150, Math.max(60, rs - dg - 40))) * 9 + 2;
  const tilt = lerp(11, -11, E(f, rs + 8, 48)) + Math.sin(f / 30) * 0.3;
  const balA = E(f, rs - 14, 24);
  const heat = wu * 0.1;
  return (
    <g>
      <G3Defs/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#g3-sky)"/>
      <Sun x={1660} y={150} r={52} f={f}/>
      <Cloud x={300} y={160} s={0.8} f={f} seed={3} a={0.9}/><Cloud x={1100} y={120} s={0.6} f={f} seed={8} a={0.75}/>
      <Hills id="g3dh1" base={600} amp={70} top="#b8cbd9" bottom="#d3dcd6" seed={2.2} wl={300}/>
      <Hills id="g3dh2" base={690} amp={46} top="#93b894" bottom="#c4d2a0" seed={4.1} wl={240}/>
      <rect x={-60} y={GY - 6} width={W + 120} height={H - GY + 70} fill="url(#g3-grass)"/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#ff9a3c" opacity={heat}/>
      {[[40, GY - 4, 0.5], [960, GY - 8, 0.34], [1190, GY - 4, 0.3]].map(([x, y, s], i) => <Tree key={i} x={x} y={y} s={s} f={f} seed={i + 5}/>)}

      {/* ---- the second block (the same thin crop with support below), arrives at rs ---- */}
      <g opacity={sk} transform={`translate(${(1 - sk) * 140} 0)`}>
        <Slab ox={1220} w={610} fieldW={610} id="g3slR" f={f}/>
        <Net ox={1220} w={610} k={E(f, rs - 8, 40)} f={f}/>
        <Rows ox={1220} fieldW={610} f={f} health={healthR} seed={60} n={5}/>
        <Adult x={1500} y={532} h={312} f={f} seed={41} look={LOOK_SW} arms={{L: [8, 12], R: [10, 14]}} lookX={-0.4} smile={0.1} nod={0.8} legsHidden/>
        <Rows ox={1220} fieldW={610} f={f} health={healthR} seed={60} from={3} to={4} n={5}/>
        <Basket x={1730} y={572} fill={0.15}/>
      </g>

      {/* ---- the first block: the loan season ---- */}
      <Slab ox={90} w={790} fieldW={580} id="g3slL" f={f}/>
      <path d={`M670,${SY} L880,${SY} L856,${SB} L646,${SB} Z`} fill="#d8b684" opacity={0.55}/>
      <Rows ox={110} fieldW={580} f={f} health={healthL} seed={10} to={3}/>
      <Adult x={360} y={530} h={312} f={f} seed={40} look={LOOK_SW} arms={{L: [8, 12], R: [lerp(8, 30, worry), lerp(12, -96, worry)]}} lookX={0.5} smile={lerp(0.7, -0.9, worry)} nod={worry * 1.6} legsHidden/>
      <Rows ox={110} fieldW={580} f={f} health={healthL} seed={10} from={3} to={4}/>
      <Basket x={BK[0]} y={BK[1]} fill={clamp(1 - wu * 1.1)}/>
      <Gate x={656} open={0.0}/>
      <Adult x={ML.x} y={ML.y} h={ML.h} f={f} seed={42} look={LOOK_ML} arms={mlArms} hands={{L: "open", R: "relax"}} lookX={-0.7} smile={0.2} held={{L: <HeldNotes/>}}/>
      {/* coins from the basket to his hand while the crop is good */}
      {flowA > 0.02 && flow.map((u, k) => {
        const x = lerp(BK[0] + 20, hand[0] - 8, u), y = lerp(BK[1] - 40, hand[1] - 8, u) - Math.sin(Math.PI * u) * 90;
        return <Coin key={k} x={x} y={y} r={13} spin={f / 5 + k} op={flowA * Math.min(1, u * 6, (1 - u) * 6)}/>;
      })}
      {/* the debt column */}
      {f >= dg - 2 && <CoinColumn x={846} y={SY + 8} n={dn} rx={34} step={12} f={f}/>}

      {/* ---- the balance ---- */}
      <g opacity={balA} transform={`translate(0 ${(1 - balA) * 26})`}>
        <Balance x={1038} baseY={GY} h={290} half={112} tilt={tilt} chain={90} panW={52} scale={false}
          left={<g><StormCloud x={0} y={-62} s={0.6} f={f}/><g transform="translate(0 -4)"><Groundnut x={34} y={0} s={0.5} health={0.15} f={f} seed={3}/></g></g>}
          right={<g><Lifebuoy x={0} y={-36} r={34} f={f}/></g>}/>
      </g>

    </g>
  );
};

export const DebtTrapLabels: React.FC<AP> = (p) => {
  const L = elabs(p), f = p.f;
  return (
    <>
      <ECard cx={420} y={70} text={L.ri.text} f={f} at={L.ri.at} size={34} maxW={760} upper={false}/>
      <ECard cx={1010} y={140} text={L.dt.text} f={f} at={L.dt.at} size={54} maxW={600} tone="red"/>
      <ECard cx={1160} y={292} text={L.rs.text} f={f} at={L.rs.at} size={32} maxW={560} upper={false} tone="green"/>
    </>
  );
};
