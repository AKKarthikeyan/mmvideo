// ECO-16 Part 1, builder E2: formula-card (velocity), fisher-scale (level / double) and cambridge-k.
// No figures are typed: the formulas are spec labels; coin, tag and hand counts are picture props.
import React from "react";
import {SANS, SERIF, eo, eio, clamp} from "../kit";
import {prog, lerp, FlowArrow, type AP} from "./analogy_kit";
import {Room, Shade, Coin, CoinHeap, Note, Wallet, Plaque, Hand, Balance, balGeom, Chev, KeyCard, L, T} from "./analogy_e2_kit";

// ---- formula-card ---------------------------------------------------------------------------------------------------------------------
const CX = 960, CY = 520, CW = 1180, CH = 520, PAD = 64;
/** a point along the rounded-rectangle coin path (perimeter fraction u 0..1, clockwise from the top-left) */
const perim = (u: number) => {
  const x0 = CX - CW / 2 - PAD, x1 = CX + CW / 2 + PAD, y0 = CY - CH / 2 - PAD, y1 = CY + CH / 2 + PAD, w = x1 - x0, h = y1 - y0, P = 2 * (w + h), d = ((u % 1) + 1) % 1 * P;
  if (d < w) return {x: x0 + d, y: y0};
  if (d < w + h) return {x: x1, y: y0 + (d - w)};
  if (d < 2 * w + h) return {x: x1 - (d - w - h), y: y1};
  return {x: x0, y: y1 - (d - 2 * w - h)};
};
export const FormulaCardArt: React.FC<AP> = (p) => {
  const {f} = p, vc = L(p, "vc"), kt = L(p, "kt"), v = L(p, "v");
  const line = (l: {text: string; at: number} | null, y: number, size: number, fill: string, ls = 0, italic = false) => {
    const a = l ? eo(prog(f, l.at, 18)) : 0, u = l ? eio(prog(f, l.at + 4, 30)) : 0;
    return <g key={y}>
      <path d={`M${CX - CW / 2 + 90},${y + size * 0.3} H${CX + CW / 2 - 90}`} stroke="#b79b66" strokeWidth={2.4} strokeDasharray="4 10" opacity={0.7 * (1 - a)}/>
      {l && <g opacity={a} transform={`translate(0 ${(1 - a) * 22})`}>
        <text x={CX} y={y} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={size} letterSpacing={ls} fontStyle={italic ? "italic" : "normal"} fill={fill}>{l.text}</text>
        <path d={`M${CX - (CW / 2 - 130) * u},${y + size * 0.34} H${CX + (CW / 2 - 130) * u}`} stroke="#d8682a" strokeWidth={4} strokeLinecap="round" opacity={0.8}/>
      </g>}
    </g>;
  };
  // the coin loops around the card; it touches four stations per lap, a tally mark grows at each
  const speed = 1 / 210, uC = f * speed, stations = [0.0, 0.25, 0.5, 0.75].map((s) => perim(s));
  const laps = Math.floor(uC * 4), c = perim(uC);
  return (
    <g>
      <Room f={f} deskY={800} variant="study" winX={1380}/>
      <ellipse cx={CX} cy={CY} rx={760} ry={420} fill="#fff1c8" opacity={0.35} filter="url(#ak-blur22)"/>
      {/* the coin path: a faint brass track with four stations */}
      <path d={`M${perim(0).x},${perim(0).y} L${perim(0.1).x},${perim(0.1).y}`} stroke="none"/>
      <rect x={CX - CW / 2 - PAD} y={CY - CH / 2 - PAD} width={CW + 2 * PAD} height={CH + 2 * PAD} rx={40} fill="none" stroke="#b58a52" strokeWidth={5} strokeDasharray="3 16" strokeLinecap="round" opacity={0.7}/>
      {stations.map((s, i) => { const near = Math.abs((((uC * 4) % 1) + 1) % 1 - 0) < 0.12 && ((Math.floor(uC * 4 + 0.5)) % 4) === i; return <g key={i}><circle cx={s.x} cy={s.y} r={22} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/><circle cx={s.x} cy={s.y} r={9} fill="#fff3c0" opacity={0.7}/>{near && <circle cx={s.x} cy={s.y} r={36 + 10 * Math.sin(f / 3)} fill="none" stroke="#ffd36a" strokeWidth={3.5} opacity={0.8}/>}</g>; })}
      {/* the big card */}
      <Shade x={CX} y={CY + CH / 2 + 18} rx={CW / 2 + 20} ry={24} o={0.4}/>
      <rect x={CX - CW / 2 + 10} y={CY - CH / 2 + 20} width={CW} height={CH} rx={20} fill="#2a1808" opacity={0.28} filter="url(#ak-blur8)"/>
      <rect x={CX - CW / 2} y={CY - CH / 2} width={CW} height={CH} rx={20} fill="url(#e2-paper)" stroke="#a98a52" strokeWidth={4}/>
      <rect x={CX - CW / 2 + 22} y={CY - CH / 2 + 22} width={CW - 44} height={CH - 44} rx={12} fill="none" stroke="#2b4d72" strokeWidth={3}/>
      <rect x={CX - CW / 2 + 34} y={CY - CH / 2 + 34} width={CW - 68} height={CH - 68} rx={8} fill="none" stroke="#c99a3c" strokeWidth={1.8}/>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <g key={i} transform={`translate(${CX + a * (CW / 2 - 4)} ${CY + b * (CH / 2 - 4)})`}><path d={`M0,0 h${-a * 70} M0,0 v${-b * 70}`} stroke="url(#e2-brass)" strokeWidth={14} strokeLinecap="round"/><circle r={13} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/></g>)}
      <path d={`M${CX - 70},${CY - CH / 2 - 4} v70 l35,-24 l35,24 v-70 Z`} fill="#b43a4a" stroke="#6e1f2a" strokeWidth={2.4} opacity={0.0}/>
      {line(vc, CY - 120, 52, "#8a5a30", 5)}
      {line(kt, CY + 40, 128, "#1f3f6e", 2, true)}
      {line(v, CY + 200, 128, "#7a2a1d", 2, true)}
      {/* tally of hand-overs (plain ticks) */}
      <g transform={`translate(${CX} ${CY + CH / 2 + 126})`}>
        {Array.from({length: Math.min(12, laps + 1)}, (_, i) => <path key={i} d={`M${(i - 5.5) * 30},-20 v40`} stroke="#5a3418" strokeWidth={5} strokeLinecap="round" opacity={0.8}/>)}
      </g>
      {/* trail and coin */}
      {Array.from({length: 7}, (_, i) => { const q = perim(uC - (i + 1) * 0.006); return <Coin key={i} x={q.x} y={q.y} r={24 - i * 1.6} spin={0.4} op={0.38 - i * 0.05}/>; })}
      <circle cx={c.x} cy={c.y} r={44} fill="#ffd37a" opacity={0.45} filter="url(#ak-blur8)"/>
      <Coin x={c.x} y={c.y} r={28} spin={uC * 18}/>
    </g>
  );
};
export const FormulaCardLabels: React.FC<AP> = () => null;

// ---- fisher-scale ------------------------------------------------------------------------------------------------------------------------
const BXc = 960, BYb = 800, BH = 430, BHALF = 440, CHAIN = 140;
const Block: React.FC<{x: number; w?: number; letter: string; tone?: string}> = ({x, w = 100, letter, tone = "#c99a62"}) => (
  <g>
    <rect x={x - w / 2} y={-w} width={w} height={w} rx={9} fill={tone} stroke="#6a4520" strokeWidth={3}/>
    <rect x={x - w / 2} y={-w} width={w} height={w * 0.2} rx={9} fill="#fff1c8" opacity={0.45}/>
    <text x={x} y={-w * 0.28} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={w * 0.62} fill="#4a2f14" opacity={0.85}>{letter}</text>
  </g>
);
const SpinArrow: React.FC<{x: number; y: number; r: number; f: number}> = ({x, y, r, f}) => (
  <g transform={`translate(${x} ${y}) rotate(${f * 4})`}>
    <path d={`M${r},0 A${r},${r} 0 1 1 ${r * 0.2},${-r * 0.97}`} fill="none" stroke="#2f78b8" strokeWidth={r * 0.2} strokeLinecap="round"/>
    <polygon points={`${r * 0.2},${-r * 1.4} ${-r * 0.3},${-r * 0.92} ${r * 0.52},${-r * 0.7}`} fill="#2f78b8"/>
    <path d={`M${r},0 A${r},${r} 0 0 1 ${r * 0.6},${-r * 0.8}`} fill="none" stroke="#bcdcf2" strokeWidth={r * 0.06} strokeLinecap="round"/>
  </g>
);
const Tag: React.FC<{x: number; y: number; rot: number; hue: string}> = ({x, y, rot, hue}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d="M-22,-34 L22,-34 L22,30 L-22,30 L-22,-20 Z" fill="#fff7e2" stroke={hue} strokeWidth={3}/>
    <circle cx={-12} cy={-23} r={4} fill="#d7c29a" stroke={hue} strokeWidth={1.4}/>
    <text x={2} y={14} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={30} fill="#5e2a0e">₹</text>
  </g>
);
const Cart: React.FC<{x: number}> = ({x}) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={-66} y={-70} width={132} height={14} rx={4} fill="#8a5a2a" stroke="#4a2c14" strokeWidth={2.4}/>
    <rect x={-60} y={-122} width={58} height={52} rx={4} fill="#d9a468" stroke="#7a4a1e" strokeWidth={2.4}/><path d="M-60,-96 H-2 M-31,-122 V-70" stroke="#7a4a1e" strokeWidth={2}/>
    <path d="M6,-70 Q4,-122 30,-130 Q56,-122 52,-70 Z" fill="#e9d7ac" stroke="#a98a52" strokeWidth={2.4}/>
    <circle cx={29} cy={-98} r={10} fill="#c63f2f" opacity={0.85}/>
    <path d="M62,-62 L112,-96" stroke="#6a4520" strokeWidth={8} strokeLinecap="round"/>
    {[-34, 38].map((dx) => <g key={dx}><circle cx={dx} cy={-36} r={26} fill="#3a2a1c" stroke="#1a0e06" strokeWidth={2}/><circle cx={dx} cy={-36} r={14} fill="#a8886a"/><circle cx={dx} cy={-36} r={4} fill="#3a2a1c"/></g>)}
  </g>
);
export const FisherScaleArt: React.FC<AP> = (p) => {
  const {f} = p, mode = (p.spec as any).mode as string, dbl = mode === "double";
  const fi = L(p, "fi"), ig = L(p, "ig"), fx = L(p, "fx"), db = L(p, "db"), fl = L(p, "fl");
  const tDb = db?.at ?? 258, tFl = fl?.at ?? 350, grow = dbl ? eio(prog(f, tDb - 14, 46)) : 0;
  const nCoin = 3 + Math.round(3 * grow), nTag = 3 + Math.round(3 * grow);
  const loose = dbl ? eio(prog(f, tFl, 22)) : 0, sf = Math.max(0, f - tFl);
  const tilt = loose * (5.2 * Math.sin(sf / 12) + 2.2 * Math.sin(sf / 4.6 + 1)) + (dbl && f > tDb ? 0.35 * Math.sin(f / 18) * (1 - loose) : 0) + (dbl ? 0 : 0.4 * Math.sin(f / 22));
  const g = balGeom(BXc, BYb, BH, BHALF, tilt, CHAIN);
  const capA = dbl ? eo(prog(f, 24, 20)) : ig ? eo(prog(f, ig.at, 18)) : 0;
  const flagA = fx ? eo(prog(f, fx.at, 20)) : 0, wob = loose ? 14 * loose * Math.sin(sf / 5) : 0;
  const wave = (i: number) => Math.sin(f / 7 + i * 0.9) * (3 + 7 * loose);
  return (
    <g>
      <Room f={f} deskY={800} variant="bank" winX={1440} dim={0.3}/>
      <Balance x={BXc} baseY={BYb} h={BH} half={BHALF} tilt={tilt} chain={CHAIN} panW={176}
        left={<g transform="scale(1.22)">
          <Block x={-86} letter="M" tone="#d4a56c"/><Block x={86} letter="V" tone="#b9d3e6"/>
          <g transform="translate(-86 -100)"><CoinHeap x={0} y={0} n={nCoin} r={22} seed={7}/></g>
          <SpinArrow x={86} y={-170} r={44} f={f}/>
          <text x={0} y={58} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={21} letterSpacing="3" fill="#4a2f0a" opacity={capA}>MONEY × SPEED</text>
        </g>}
        right={<g transform="scale(1.22)">
          <Block x={-96} letter="P" tone="#e4b4a0"/><Block x={90} w={100} letter="T" tone="#c9dcb4"/>
          {Array.from({length: nTag}, (_, i) => <Tag key={i} x={-96 + (i - (nTag - 1) / 2) * (nTag > 3 ? 20 : 28)} y={-136 - (i % 2) * 8 - (nTag > 3 ? 4 : 0)} rot={(i - (nTag - 1) / 2) * 11} hue="#b58a52"/>)}
          <g transform="translate(110 -100)"><Cart x={0}/></g>
          <text x={0} y={58} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={21} letterSpacing="3" fill="#4a2f0a" opacity={capA}>PRICES × TRADE</text>
        </g>}/>
      {/* flag on the finial */}
      {fx && <g opacity={flagA} transform={`rotate(${wob * 0.5} ${BXc} ${g.py - 30})`}>
        <path d={`M${BXc},${g.py - 30} V${g.py - 172}`} stroke="#6c4a16" strokeWidth={7} strokeLinecap="round"/>
        <circle cx={BXc} cy={g.py - 176} r={9} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2}/>
        <path d={`M${BXc + 4},${g.py - 168} ${Array.from({length: 11}, (_, i) => `L${BXc + 4 + i * 54},${g.py - 168 + wave(i) * (i / 10)}`).join(" ")} ${Array.from({length: 11}, (_, i) => `L${BXc + 4 + (10 - i) * 54},${g.py - 108 + wave(10 - i) * ((10 - i) / 10)}`).join(" ")} Z`} fill="#fff4d6" stroke="#b43a4a" strokeWidth={4} strokeLinejoin="round"/>
        <path d={`M${BXc + 4},${g.py - 168} ${Array.from({length: 11}, (_, i) => `L${BXc + 4 + i * 54},${g.py - 168 + wave(i) * (i / 10)}`).join(" ")} ${Array.from({length: 11}, (_, i) => `L${BXc + 4 + (10 - i) * 54},${g.py - 108 + wave(10 - i) * ((10 - i) / 10)}`).join(" ")} Z`} fill="#b43a4a" opacity={0.12}/>
        <text x={BXc + 282} y={g.py - 128 + wave(5) * 0.5} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={25} letterSpacing={1} fill="#7a1f2e" transform={`rotate(${wave(5) * 0.1} ${BXc + 282} ${g.py - 134})`}>{fx.text}</text>
      </g>}
      {fi && <Plaque x={420} y={196} w={440} text={fi.text} f={f} at={fi.at} size={44}/>}
      {dbl && f > tDb && <g opacity={eo(prog(f, tDb, 20)) * (1 - eo(prog(f, tFl - 4, 20)))}>{[0, 1].map((i) => <Chev key={i} x={i ? 1430 : 560} y={430 + Math.sin(f / 5 + i) * 5} s={1.3} col={i ? "#c63f2f" : "#2f9a4a"}/>)}</g>}
      {void Note}{void Wallet}{void Hand}{void T}{void lerp}{void clamp}
    </g>
  );
};
export const FisherScaleLabels: React.FC<AP> = (p) => {
  const dbl = (p.spec as any).mode === "double";
  return dbl ? <>
    <KeyCard p={p} k="db" cx={960} y={76} size={50} maxW={900} tone="green" upper={false}/>
    <KeyCard p={p} k="fl" cx={960} y={822} size={34} maxW={1200} tone="red"/>
  </> : <>
    <KeyCard p={p} k="ig" cx={960} y={80} size={40} upper={false} maxW={1200}/>
    <KeyCard p={p} k="eq" cx={960} y={822} size={36} maxW={1000}/>
  </>;
};

// ---- cambridge-k -------------------------------------------------------------------------------------------------------------------------
const PIE = {x: 1020, y: 440, r: 134};
const wedge = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)], p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
  return `M${cx},${cy} L${p0[0]},${p0[1]} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p1[0]},${p1[1]} Z`;
};
export const CambridgeKArt: React.FC<AP> = (p) => {
  const {f} = p, cb = L(p, "cb"), sh = L(p, "sh"), k = L(p, "k"), pg = L(p, "pg"), tSh = sh?.at ?? 186, tK = k?.at ?? 291, tPg = pg?.at ?? 388;
  const pieA = eo(prog(f, tSh - 6, 24)), grow = eio(prog(f, tSh, 34)), fall = eio(prog(f, tPg + 6, 80));
  const ang = (Math.PI / 2) * grow * (1 - 0.42 * fall); // a quarter, then smaller as the rate climbs
  const handsA = eo(prog(f, tK - 10, 24)), rateA = eo(prog(f, tPg - 6, 22)), arrP = eio(prog(f, tPg + 4, 80));
  // four hands pass a note along
  const HX = [760, 950, 1140, 1330], HY = 800, cyc = 150, pos = (((f - tK) / cyc) % 1 + 1) % 1, seg = Math.min(2.999, pos * 3), si = Math.floor(seg), su = eio(seg - si);
  const base = (i: number) => ({x: HX[i] + 44, y: HY + (i % 2) * 26 - 56}), A0 = base(si), A1 = base(Math.min(3, si + 1)), nx = f < tK ? base(0).x : lerp(A0.x, A1.x, su), ny = f < tK ? base(0).y : lerp(A0.y, A1.y, su) - Math.sin(su * Math.PI) * 42;
  const slipX = 250;
  return (
    <g>
      <Room f={f} deskY={770} variant="study" winX={1380}/>
      {/* salary slip leaning on the desk */}
      <g transform={`translate(${slipX} 640) rotate(-3)`}>
        <Shade x={0} y={162} rx={140} ry={12} o={0.34}/>
        <rect x={-118} y={-160} width={236} height={322} rx={6} fill="url(#e2-paper)" stroke="#a98a52" strokeWidth={2.6}/>
        <rect x={-118} y={-160} width={236} height={58} rx={6} fill="#2b4d72"/>
        <rect x={-96} y={-142} width={120} height={12} rx={4} fill="#fff" opacity={0.85}/><rect x={-96} y={-124} width={78} height={9} rx={3} fill="#fff" opacity={0.5}/>
        {Array.from({length: 6}, (_, i) => <g key={i}><rect x={-96} y={-80 + i * 30} width={70 + ((i * 37) % 50)} height={9} rx={4} fill="#9bb8c8"/><rect x={44} y={-80 + i * 30} width={50} height={9} rx={4} fill="#9bb8c8"/></g>)}
        <rect x={-96} y={110} width={192} height={32} rx={6} fill="#43b565" opacity={0.28}/><rect x={-96} y={110} width={192} height={32} rx={6} fill="none" stroke="#2f9a4a" strokeWidth={2.4}/>
        <circle cx={78} cy={-130} r={14} fill="none" stroke="#c99a3c" strokeWidth={2.4} opacity={0.0}/>
      </g>
      <Wallet x={560} y={790} s={0.74} fat={0.5} notes={3} coins={0} f={f}/>
      {/* dashed path: the share kept goes to the wallet */}
      {sh && <path d={`M${PIE.x - 150},${PIE.y + 120} Q${PIE.x - 330},${PIE.y + 210} 660,640`} fill="none" stroke="#2f9a4a" strokeWidth={5} strokeDasharray="12 10" strokeDashoffset={-f * 0.8} opacity={pieA * 0.9} strokeLinecap="round"/>}
      {/* pie dial */}
      <g opacity={pieA}>
        <Shade x={PIE.x} y={PIE.y + PIE.r + 40} rx={PIE.r + 30} ry={14} o={0.3}/>
        <circle cx={PIE.x} cy={PIE.y} r={PIE.r + 26} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={4}/>
        {Array.from({length: 24}, (_, i) => <path key={i} d={`M${PIE.x},${PIE.y - PIE.r - 22} v${i % 6 === 0 ? 14 : 8}`} stroke="#4a2f0a" strokeWidth={i % 6 === 0 ? 3.4 : 2} transform={`rotate(${i * 15} ${PIE.x} ${PIE.y})`}/>)}
        <circle cx={PIE.x} cy={PIE.y} r={PIE.r} fill="#fffaf0" stroke="#8e6522" strokeWidth={2.6}/>
        <circle cx={PIE.x} cy={PIE.y} r={PIE.r} fill="#e7efe0" opacity={0.7}/>
        {ang > 0.02 && <g><path d={wedge(PIE.x, PIE.y, PIE.r - 4, -Math.PI / 2, -Math.PI / 2 + ang)} fill="#43b565" stroke="#2f7a45" strokeWidth={3} strokeLinejoin="round"/>
          <Coin x={PIE.x + (PIE.r * 0.52) * Math.cos(-Math.PI / 2 + ang / 2)} y={PIE.y + (PIE.r * 0.52) * Math.sin(-Math.PI / 2 + ang / 2)} r={26} spin={0.35}/></g>}
        <path d={`M${PIE.x},${PIE.y} L${PIE.x},${PIE.y - PIE.r + 4}`} stroke="#2f7a45" strokeWidth={3} opacity={0.0}/>
        <path d={`M${PIE.x - PIE.r + 18},${PIE.y - 60} A${PIE.r - 10},${PIE.r - 10} 0 0 1 ${PIE.x - 30},${PIE.y - PIE.r + 12}`} stroke="#fff" strokeWidth={6} fill="none" opacity={0.55} strokeLinecap="round"/>
      </g>
      {/* four hands pass a note: the velocity picture, small */}
      <g opacity={handsA}>
        <path d={`M${HX[0] + 44},${HY - 70} Q${(HX[0] + HX[3]) / 2 + 44},${HY - 230} ${HX[3] + 44},${HY - 40}`} fill="none" stroke="#b58a52" strokeWidth={3} strokeDasharray="4 12" strokeLinecap="round" opacity={0.6}/>
        {HX.map((x, i) => <PalmHand key={i} x={x} y={HY + (i % 2) * 26} sleeve={["#6c8fb5", "#c0603d", "#7fa58a", "#9a6fa0"][i]} shade={["#41607f", "#8c3a22", "#4d7358", "#6a4472"][i]}/>)}
        <Note x={nx} y={ny} w={120} rot={-6 + su * 12 * (f < tK ? 0 : 1)}/>
      </g>
      {/* interest-rate arrow climbs */}
      <g opacity={rateA}>
        <circle cx={1586} cy={540} r={40} fill="#fffaf0" stroke="#b58a52" strokeWidth={4}/>
        <text x={1586} y={556} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={46} fill="#7a2a1d">%</text>
        <FlowArrow pts={[[1586, 490], [1590, 400], [1608, 310], [1626, 210]]} f={f} p={arrP} w={26} c1="#c63f2f" c2="#f08a5a" dark="#7a2a1d"/>
      </g>
      {pg && <Plaque x={1610} y={640} w={360} text={pg.text} f={f} at={pg.at} size={36}/>}
      {void SANS}{void Chev}{void balGeom}{void Balance}{void Cb(cb)}
    </g>
  );
};
const Cb = (x: unknown) => x;
/** a forearm and an open palm reaching right, a note rests on it (the velocity picture) */
const PalmHand: React.FC<{x: number; y: number; sleeve: string; shade: string}> = ({x, y, sleeve, shade}) => (
  <g transform={`translate(${x} ${y}) rotate(-14)`}>
    <Shade x={30} y={50} rx={90} ry={8} o={0.2}/>
    <path d="M-210,-30 L-84,-26 L-84,26 L-210,34 Z" fill={sleeve} stroke={shade} strokeWidth={2}/>
    <path d="M-210,6 L-84,4 L-84,26 L-210,34 Z" fill={shade} opacity={0.3}/>
    <rect x={-98} y={-32} width={22} height={64} rx={8} fill={sleeve} stroke={shade} strokeWidth={2}/>
    <rect x={-80} y={-18} width={70} height={36} rx={14} fill="url(#e2-skin)"/>
    <rect x={-14} y={-24} width={72} height={46} rx={18} fill="url(#e2-skin)" stroke="#a8754f" strokeWidth={1.4}/>
    {[-19, -6, 7, 19].map((dy, i) => <rect key={i} x={46} y={dy - 6} width={64 - Math.abs(i - 1.5) * 4} height={13} rx={6.5} fill="url(#e2-skin)" stroke="#a8754f" strokeWidth={1.2} transform={`rotate(${(i - 1.5) * 4} 46 ${dy})`}/>)}
    <ellipse cx={14} cy={-30} rx={25} ry={9} transform="rotate(-26 14 -30)" fill="url(#e2-skin)" stroke="#a8754f" strokeWidth={1.2}/>
    <path d="M-2,0 Q24,6 48,0" stroke="#a8754f" strokeWidth={1.2} fill="none" opacity={0.5}/>
  </g>
);
export const CambridgeKLabels: React.FC<AP> = (p) => <>
  <KeyCard p={p} k="cb" cx={960} y={70} size={48} maxW={900}/>
  <KeyCard p={p} k="sh" cx={1020} y={636} size={30} maxW={620} tone="green"/>
  <KeyCard p={p} k="k" cx={1590} y={770} size={38} upper={false} maxW={400} tone="cool"/>
</>;
