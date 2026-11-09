// ECO-16 Part 2, builder F3: `reserve-world` (a wall of reserve-ratio dials with one at zero, two textbooks; mode "mix": two toolboxes, a bridge and a mixing dial)
// and `depression-lines` (an illustrative chart with no axis numbers: money falling, the base rising, a bank-door queue and an unused vault). Words from spec labels, at(key).
import React from "react";
import {SANS, SERIF, eo, eio, rng} from "../kit";
import {lerp, prog, FlowArrow, Hills, Cloud, type AP} from "./analogy_kit";
import {BookObj, Bundle, Classical, ECard, F3Defs, Gauge, Hall, PaperCard, Person, Shade, Specks, Tag, elabs, wrapText} from "./analogy_f3_kit";

const rad = (d: number) => (d * Math.PI) / 180;

// ---- a desk globe and a gear ------------------------------------------------------------------------------------------------------
const Globe: React.FC<{x: number; y: number; r: number; f: number}> = ({x, y, r, f}) => {
  const sh = (f * 0.35) % 360;
  return (
    <g>
      <defs>
        <radialGradient id="f3-gl" cx="36%" cy="30%" r="80%"><stop offset="0" stopColor="#a9d6f2"/><stop offset="0.7" stopColor="#4f93c4"/><stop offset="1" stopColor="#25608f"/></radialGradient>
        <clipPath id="f3-glc"><circle cx={x} cy={y} r={r}/></clipPath>
      </defs>
      <Shade x={x} y={y + r + 62} rx={r * 0.9} ry={12} o={0.34}/>
      <path d={`M${x - r * 0.5},${y + r + 66} Q${x},${y + r + 30} ${x + r * 0.5},${y + r + 66} Z`} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
      <rect x={x - r * 0.12} y={y + r - 4} width={r * 0.24} height={42} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2}/>
      <circle cx={x} cy={y} r={r} fill="url(#f3-gl)"/>
      <g clipPath="url(#f3-glc)">
        {[0, 1].map((k) => (
          <g key={k} transform={`translate(${(((sh + k * 360) % 720) / 720) * r * 4 - r * 2.2 - (k ? 0 : 0)} 0)`}>
            <path d={`M${x - r * 0.6},${y - r * 0.5} q${r * 0.3},-${r * 0.35} ${r * 0.7},-${r * 0.1} q${r * 0.2},${r * 0.35} -${r * 0.1},${r * 0.6} q-${r * 0.4},${r * 0.2} -${r * 0.6},-${r * 0.5} Z`} fill="#6fae6b" stroke="#3f7a46" strokeWidth={1.5}/>
            <path d={`M${x + r * 0.5},${y + r * 0.1} q${r * 0.3},${r * 0.1} ${r * 0.2},${r * 0.5} q-${r * 0.3},${r * 0.2} -${r * 0.4},-${r * 0.1} Z`} fill="#7dba73" stroke="#3f7a46" strokeWidth={1.5}/>
            <path d={`M${x - r * 0.1},${y + r * 0.3} q${r * 0.2},-${r * 0.1} ${r * 0.3},${r * 0.2} q-${r * 0.1},${r * 0.3} -${r * 0.3},${r * 0.1} Z`} fill="#6fae6b" stroke="#3f7a46" strokeWidth={1.5}/>
          </g>
        ))}
        <ellipse cx={x} cy={y} rx={r} ry={r * 0.3} fill="none" stroke="#fff" strokeWidth={1} opacity={0.3}/>
        <ellipse cx={x} cy={y - r * 0.55} rx={r * 0.8} ry={r * 0.18} fill="none" stroke="#fff" strokeWidth={1} opacity={0.25}/>
        <circle cx={x} cy={y} r={r} fill="none" stroke="#10304a" strokeWidth={r * 0.16} opacity={0.25}/>
      </g>
      <path d={`M${x - r * 0.5},${y - r * 0.55} A${r * 0.8},${r * 0.8} 0 0 1 ${x + r * 0.1},${y - r * 0.8}`} stroke="#fff" strokeWidth={r * 0.07} fill="none" strokeLinecap="round" opacity={0.5}/>
      <path d={`M${x - r * 1.05},${y + r * 0.2} A${r * 1.05},${r * 1.05} 0 0 0 ${x + r * 0.6},${y + r * 0.88}`} fill="none" stroke="url(#e2-brass)" strokeWidth={6} strokeLinecap="round"/>
    </g>
  );
};

const Gear: React.FC<{x: number; y: number; r: number; rot: number; teeth?: number}> = ({x, y, r, rot, teeth = 10}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} filter="url(#e3-sh-s)">
    {Array.from({length: teeth}, (_, i) => <rect key={i} x={-r * 0.14} y={-r * 1.16} width={r * 0.28} height={r * 0.3} rx={3} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2} transform={`rotate(${(i * 360) / teeth})`}/>)}
    <circle r={r} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
    <circle r={r * 0.62} fill="#7a5420" opacity={0.5}/>
    <circle r={r * 0.5} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
    <path d={`M${-r * 0.3},${-r * 0.3} L${r * 0.3},${r * 0.3} M${r * 0.3},${-r * 0.3} L${-r * 0.3},${r * 0.3}`} stroke="#4a2f0a" strokeWidth={r * 0.14} strokeLinecap="round"/>
  </g>
);

// ---- reserve-world, default -------------------------------------------------------------------------------------------------------
const COLS = [460, 660, 860, 1060, 1260, 1460], ROWS = [212, 404], DR = 64;
const BASEANG = [-30, 42, 18, -58, 64, 24, 50, -14, 76, -40, 32, 8];
const US_I = 7;

export const ReserveWorldArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), a0 = eo(prog(f, 0, 26));
  const usT = L.us.at, mtT = L.mt.at;
  const usK = eio(prog(f, usT + 8, 46)), usA = eo(prog(f, usT, 18));
  const ncA = eo(prog(f, mtT, 18)), igA = eo(prog(f, mtT + 12, 18));
  return (
    <g>
      <F3Defs/>
      <defs>
        <linearGradient id="f3rw-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6ead0"/><stop offset="1" stopColor="#e3cd9f"/></linearGradient>
        <linearGradient id="f3rw-panel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3b5d59"/><stop offset="1" stopColor="#223836"/></linearGradient>
        <linearGradient id="f3rw-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d4a56c"/><stop offset="1" stopColor="#7e4f28"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={2040} height={1200} fill="url(#f3rw-wall)"/>
      {Array.from({length: 12}, (_, i) => <rect key={i} x={i * 170 - 30} y={-20} width={84} height={820} fill="#f2dfb8" opacity={0.3}/>)}
      <ellipse cx={960} cy={300} rx={900} ry={420} fill="url(#ak-sunglow)" opacity={0.3}/>
      {/* the instrument wall */}
      <g opacity={a0}>
        <rect x={340} y={118} width={1260} height={420} rx={30} fill="#2a1808" opacity={0.3} filter="url(#e3-glow)"/>
        <rect x={322} y={92} width={1276} height={420} rx={30} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={4}/>
        <rect x={340} y={110} width={1240} height={384} rx={20} fill="url(#f3rw-panel)" stroke="#16282a" strokeWidth={3}/>
        {[[360, 130], [1560, 130], [360, 474], [1560, 474]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={7} fill="#e9cf8a" stroke="#6c4a16" strokeWidth={1.6}/><path d={`M${x - 4},${y - 4} L${x + 4},${y + 4}`} stroke="#6c4a16" strokeWidth={1.4}/></g>)}
        <path d="M360,308 H1560" stroke="#16282a" strokeWidth={3} opacity={0.6}/><path d="M360,311 H1560" stroke="#6d908a" strokeWidth={1.6} opacity={0.5}/>
        {ROWS.map((ry, r) => COLS.map((cx, c) => {
          const i = r * 6 + c, isUS = i === US_I, sway = Math.sin(f / (26 + i * 5) + i) * 2.6;
          const ang = isUS ? lerp(BASEANG[i] + sway, -125, usK) : BASEANG[i] + sway;
          return <Gauge key={i} x={cx} y={ry} r={DR} ang={ang} glow={isUS ? usA * (0.55 + 0.2 * Math.sin(f / 8)) : 0} zeroRed={isUS ? usA : 0}/>;
        }))}
      </g>
      {/* the US dial: a tab, a leader line to the card */}
      {usA > 0.001 && (
        <g opacity={usA}>
          <path d={`M${COLS[1]},${ROWS[1] + DR + 14} Q${COLS[1] - 10},${ROWS[1] + DR + 50} 600,${ROWS[1] + DR + 86}`} stroke="#d6432b" strokeWidth={4} fill="none" strokeDasharray="8 8"/>
          <Tag x={COLS[1]} y={ROWS[1] - DR - 22} text="US" a={usA} size={26} fill="#fff1c4" ink="#8a1f10" edge="#d6432b"/>
        </g>
      )}
      {/* a desk globe: the world beyond one country's rules */}
      <g opacity={a0}><Globe x={196} y={650} r={82} f={f}/></g>
      {/* the shelf, two textbooks and a gear */}
      <g opacity={a0}>
        <rect x={1070} y={788} width={520} height={30} rx={6} fill="url(#f3rw-wood)" stroke="#4a2a10" strokeWidth={3}/>
        <rect x={1070} y={788} width={520} height={7} fill="#f2d79c" opacity={0.6}/>
        {[1130, 1530].map((x) => <path key={x} d={`M${x},818 v46 l40,-46`} fill="#7e4f28" stroke="#4a2a10" strokeWidth={3}/>)}
      </g>
      <BookObj x={1220} y={788 - (1 - ncA) * 260} w={120} h={210} text="NCERT" c={["#2f6b8e", "#1c4560"]} size={32} a={ncA}/>
      <BookObj x={1360} y={788 - (1 - igA) * 260} w={116} h={184} text="IGNOU" c={["#8a3a2f", "#5a1f18"]} size={30} a={igA} lean={2}/>
      {ncA > 0.5 && <g opacity={ncA}><Gear x={1500} y={742} r={42} rot={f * 0.9}/></g>}
    </g>
  );
};
export const ReserveWorldLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return (
    <>
      <ECard cx={690} y={560} text={L.us.text} f={p.f} at={L.us.at} size={31} maxW={640} upper={false} tone="red"/>
      <ECard cx={1330} y={826} text={L.mt.text} f={p.f} at={L.mt.at} size={28} maxW={760} upper={false}/>
    </>
  );
};

// ---- reserve-world, mix -----------------------------------------------------------------------------------------------------------
const BL = {x: 440, top: 598, w: 560, h: 210}, BR = {x: 1480, top: 598, w: 560, h: 210};

const Box: React.FC<{c: {x: number; top: number; w: number; h: number}; fill: [string, string]; edge: string; children: React.ReactNode; plate?: React.ReactNode}> = ({c, fill, edge, children, plate}) => (
  <g>
    <Shade x={c.x} y={c.top + c.h + 4} rx={c.w * 0.58} ry={16} o={0.36}/>
    <rect x={c.x - c.w / 2 + 14} y={c.top - 16} width={c.w - 28} height={30} rx={8} fill={edge} opacity={0.8}/>
    {children}
    <defs><linearGradient id={`f3bx-${c.x}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={fill[0]}/><stop offset="1" stopColor={fill[1]}/></linearGradient></defs>
    <rect x={c.x - c.w / 2} y={c.top} width={c.w} height={c.h} rx={12} fill={`url(#f3bx-${c.x})`} stroke={edge} strokeWidth={4}/>
    <rect x={c.x - c.w / 2} y={c.top} width={c.w} height={26} rx={10} fill="#fff" opacity={0.18}/>
    {[-1, 1].map((s) => <rect key={s} x={c.x + s * (c.w / 2 - 28) - 14} y={c.top} width={28} height={c.h} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>)}
    {[-1, 1].map((s) => [0, 1].map((k) => <circle key={`${s}${k}`} cx={c.x + s * (c.w / 2 - 28)} cy={c.top + 26 + k * (c.h - 52)} r={5} fill="#e9cf8a" stroke="#6c4a16" strokeWidth={1.4}/>))}
    {plate}
  </g>
);

const Plate: React.FC<{x: number; y: number; w: number; head: string; sub: string; a: number}> = ({x, y, w, head, sub, a}) => {
  if (a <= 0.002) return null;
  return (
    <g transform={`translate(${x} ${y + (1 - a) * -22})`} opacity={a}>
      <rect x={-w / 2 + 6} y={-52 + 12} width={w} height={112} rx={12} fill="#2a1808" opacity={0.3}/>
      <rect x={-w / 2} y={-52} width={w} height={112} rx={12} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
      <rect x={-w / 2 + 9} y={-43} width={w - 18} height={94} rx={7} fill="none" stroke="#6c4a16" strokeWidth={1.6} opacity={0.7}/>
      <text y={4} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={44} letterSpacing={5} fill="#fff1bd" opacity={0.7} transform="translate(0 2)">{head}</text>
      <text y={4} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={44} letterSpacing={5} fill="#4a2f0a">{head}</text>
      <text y={42} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={600} fontSize={27} fill="#4a2f0a">{sub}</text>
    </g>
  );
};

export const ReserveMixArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), a0 = eo(prog(f, 0, 26));
  const [exH, ...exR] = L.ex.text.split(" · "), [enH, ...enR] = L.en.text.split(" · ");
  const mxT = L.mx.at, nvT = L.nv.at;
  const k = eio(prog(f, mxT + 6, 52));
  const ang = lerp(-96, 4, k) + Math.sin(f / 9) * 5 * k + Math.sin(f / 23) * 2;
  const nvA = eo(prog(f, nvT, 18)), mxA = eo(prog(f, mxT, 18));
  const wave = (x: number, i: number) => Math.sin(x / 26 + f / 12 + i) * 3;
  return (
    <g>
      <F3Defs/>
      <defs>
        <linearGradient id="f3mx-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a9d1ea"/><stop offset="0.7" stopColor="#eef0dc"/><stop offset="1" stopColor="#f8e8c8"/></linearGradient>
        <linearGradient id="f3mx-gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9c597"/><stop offset="1" stopColor="#a88a5a"/></linearGradient>
        <linearGradient id="f3mx-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7cc2e4"/><stop offset="1" stopColor="#2f7fb0"/></linearGradient>
        <linearGradient id="f3mx-stone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#efe3c8"/><stop offset="1" stopColor="#b9a47a"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={2040} height={1200} fill="url(#f3mx-sky)"/>
      <circle cx={1540} cy={150} r={170} fill="url(#ak-sunglow)" opacity={0.7}/>
      <Hills id="f3mx-h1" base={640} amp={90} top="#c3d6e6" bottom="#d9e3e6" seed={2} wl={420}/>
      <Hills id="f3mx-h2" base={700} amp={60} top="#a9c4b2" bottom="#cfdcc0" seed={5} wl={320}/>
      <Cloud x={200} y={180} s={0.9} f={f} speed={0.25} seed={2} a={0.9}/><Cloud x={900} y={120} s={0.7} f={f} speed={0.18} seed={5} a={0.8}/>
      {/* ground, a river and a bridge */}
      <rect x={-60} y={800} width={2040} height={300} fill="url(#f3mx-gr)"/>
      <rect x={-60} y={800} width={2040} height={7} fill="#f6e6c4"/>
      <path d={`M742,800 L1178,800 L1230,1100 L690,1100 Z`} fill="url(#f3mx-water)"/>
      {Array.from({length: 7}, (_, i) => <path key={i} d={`M${740 + i * 6},${830 + i * 40} q40,${wave(i, i)} 80,0 t80,0 t80,0 t80,0`} stroke="#fff" strokeWidth={2.4} fill="none" opacity={0.4} strokeLinecap="round"/>)}
      <g opacity={a0}>
        {/* the bridge: stone abutments, a deck with parapets, an arch over the water */}
        <path d="M700,808 V706 H1220 V808 Z" fill="url(#f3mx-stone)" stroke="#8e7a52" strokeWidth={3}/>
        {Array.from({length: 4}, (_, r) => Array.from({length: 13}, (_, c) => <rect key={`${r}${c}`} x={704 + c * 40 + (r % 2) * 20} y={718 + r * 22} width={38} height={20} rx={3} fill="none" stroke="#8e7a52" strokeWidth={1.4} opacity={0.4}/>))}
        <path d="M744,812 V786 A216,112 0 0 1 1176,786 V812 Z" fill="url(#f3mx-water)" stroke="#8e7a52" strokeWidth={4}/>
        <path d="M744,800 V786 A216,112 0 0 1 1176,786 V800" fill="none" stroke="#cdb98c" strokeWidth={14} opacity={0.8}/>
        <rect x={690} y={688} width={540} height={24} rx={7} fill="#f2e6cc" stroke="#8e7a52" strokeWidth={3}/>
        <rect x={690} y={688} width={540} height={7} rx={3} fill="#fff" opacity={0.5}/>
        <path d="M960,470 V690" stroke="#3d2a10" strokeWidth={30} strokeLinecap="round"/><path d="M960,470 V690" stroke="url(#e2-brass)" strokeWidth={22} strokeLinecap="round"/>
        <ellipse cx={960} cy={696} rx={74} ry={13} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.6}/>
      </g>
      {/* the two toolboxes */}
      <g opacity={a0}>
        <Box c={BL} fill={["#7f98ad", "#4f6578"]} edge="#2f4252" plate={<Plate x={BL.x} y={BL.top + 112} w={500} head={exH} sub={exR.join(" · ")} a={eo(prog(f, L.ex.at, 18))}/>}>
          {/* tools: lever, spanner, gauge, crank */}
          <g>
            <rect x={BL.x - 210} y={BL.top - 22} width={96} height={20} rx={5} fill="#3d444c"/>
            <path d={`M${BL.x - 162},${BL.top - 16} L${BL.x - 118 + Math.sin(f / 30) * 3},${BL.top - 176}`} stroke="#3d444c" strokeWidth={16} strokeLinecap="round"/>
            <path d={`M${BL.x - 162},${BL.top - 16} L${BL.x - 118 + Math.sin(f / 30) * 3},${BL.top - 176}`} stroke="url(#f3-iron)" strokeWidth={10} strokeLinecap="round"/>
            <circle cx={BL.x - 116 + Math.sin(f / 30) * 3} cy={BL.top - 184} r={26} fill="#d6432b" stroke="#7a1d10" strokeWidth={3}/><circle cx={BL.x - 124} cy={BL.top - 194} r={8} fill="#fff" opacity={0.6}/>
            <g transform={`translate(${BL.x + 118} ${BL.top - 90}) rotate(34)`}>
              <rect x={-12} y={-100} width={24} height={150} rx={8} fill="url(#f3-iron)" stroke="#3d444c" strokeWidth={3}/>
              <path d="M-32,-100 a32,32 0 1,1 64,0 v-26 h-14 v18 a18,18 0 0 0 -36,0 v-18 h-14 Z" fill="url(#f3-iron)" stroke="#3d444c" strokeWidth={3} transform="translate(0 -14)"/>
            </g>
            <Gauge x={BL.x + 10} y={BL.top - 112} r={58} ang={lerp(-30, 40, 0.5 + 0.5 * Math.sin(f / 40))} zones={false}/>
            <g transform={`translate(${BL.x + 196} ${BL.top - 70}) rotate(${f * 1.2})`} filter="url(#e3-sh-s)">
              <circle r={44} fill="none" stroke="url(#f3-iron)" strokeWidth={12}/>
              {[0, 60, 120].map((a) => <path key={a} d="M-44,0 H44" stroke="#4d545c" strokeWidth={8} transform={`rotate(${a})`}/>)}
              <circle cx={44} cy={0} r={11} fill="#d6432b" stroke="#7a1d10" strokeWidth={2.4}/>
            </g>
          </g>
        </Box>
        <Box c={BR} fill={["#d7915a", "#9a5a32"]} edge="#5e3216" plate={<Plate x={BR.x} y={BR.top + 112} w={540} head={enH} sub={enR.join(" · ")} a={eo(prog(f, L.en.at, 18))}/>}>
          <g>
            <Person x={BR.x - 170} y={BR.top + 36} h={156} f={f} seed={21}/><Person x={BR.x - 100} y={BR.top + 36} h={142} f={f} seed={34} ph={9}/>
            <g transform={`translate(${BR.x - 12} ${BR.top - 6})`}>
              <rect x={-52} y={-86} width={104} height={80} fill="#f0d9a8" stroke="#8a6a32" strokeWidth={3}/>
              <path d="M-64,-86 L0,-134 L64,-86 Z" fill="#b5503a" stroke="#6e2a1a" strokeWidth={3}/>
              <rect x={-14} y={-52} width={28} height={46} rx={3} fill="#7a4a24"/><rect x={26} y={-72} width={20} height={20} fill="#9fcbe4" stroke="#8a6a32" strokeWidth={2}/>
            </g>
            <g transform={`translate(${BR.x + 90} ${BR.top - 6})`}>
              <rect x={-52} y={-76} width={104} height={70} fill="#e6f0d8" stroke="#6b8a52" strokeWidth={3}/>
              {Array.from({length: 6}, (_, i) => <path key={i} d={`M${-58 + i * 21},-100 h21 l-4,26 h-21 Z`} fill={i % 2 ? "#fff" : "#c9433a"} stroke="#7a2a22" strokeWidth={1.6}/>)}
              <rect x={-38} y={-52} width={76} height={46} rx={3} fill="#9fcbe4" stroke="#6b8a52" strokeWidth={2.4}/>
            </g>
            <Classical x={BR.x + 206} y={BR.top - 2} w={120} h={130} text="BANK" id="f3mx-bk" cols={4} textSize={14}/>
          </g>
        </Box>
      </g>
      {/* two coloured streams run into the mixing dial */}
      <FlowArrow pts={[[690, 588], [770, 440], [848, 392]]} f={f} p={eo(prog(f, mxT + 6, 40))} w={20} c1="#5b9bd1" c2="#a9d1ee" head={false}/>
      <FlowArrow pts={[[1230, 588], [1150, 440], [1072, 392]]} f={f} p={eo(prog(f, mxT + 6, 40))} w={20} c1="#e0813f" c2="#f5c590" head={false}/>
      {mxA > 0.001 && (
        <g opacity={mxA}>
          <Gauge x={960} y={338} r={138} ang={ang} zones zc={["#3a78b8", "#8a63a8", "#d1692e"]} glow={0.45 + 0.15 * Math.sin(f / 10)}/>
        </g>
      )}
      {/* the notebook tag */}
      {nvA > 0.001 && (
        <g transform={`translate(960 ${866 + (1 - nvA) * 40}) rotate(-3)`} opacity={nvA}>
          <rect x={-206 + 8} y={-40 + 12} width={420} height={84} rx={10} fill="#2a1808" opacity={0.32} filter="url(#ak-blur8)"/>
          <rect x={-212} y={-44} width={424} height={88} rx={10} fill="#5e3c78" stroke="#3a2250" strokeWidth={3}/>
          <rect x={-196} y={-40} width={404} height={80} rx={7} fill="url(#f3-paper)" stroke="#cbb88a" strokeWidth={1.6}/>
          {Array.from({length: 5}, (_, i) => <circle key={i} cx={-206} cy={-28 + i * 14} r={4} fill="#cdb98c" stroke="#8e7a52"/>)}
          <text x={4} y={12} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={44} letterSpacing={3} fill="#1f3a78">{L.nv.text}</text>
          <path d="M-170,26 q170,10 340,-2" stroke="#d8482a" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8}/>
        </g>
      )}
    </g>
  );
};
export const ReserveMixLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return <ECard cx={960} y={56} text={L.mx.text} f={p.f} at={L.mx.at} size={36} maxW={900} upper={false}/>;
};

// ---- depression-lines -------------------------------------------------------------------------------------------------------------
const CP = {x: 130, y: 120, w: 1270, h: 500};
const X0 = 120, XE = 900, Y0 = 280, YAX = 470;
const noise = (u: number, s: number) => Math.sin(u * 23 + s) * 3.2 + Math.sin(u * 51 + s * 2.1) * 1.8;
const moneyY = (u: number) => Y0 + 170 * Math.pow(u, 1.25) + noise(u, 1);
const baseY = (u: number) => Y0 - 92 * Math.pow(u, 0.85) + noise(u, 4) * 0.7;
const curve = (fn: (u: number) => number, k: number) => {
  const n = 64, m = Math.max(1, Math.floor(n * k)), pts: string[] = [];
  for (let i = 0; i <= m; i++) { const u = (i / n); pts.push(`${(X0 + (XE - X0) * u).toFixed(1)},${fn(u).toFixed(1)}`); }
  if (m < n) { const u = k; pts.push(`${(X0 + (XE - X0) * u).toFixed(1)},${fn(u).toFixed(1)}`); }
  return pts;
};
export const shiftDep = (f: number, fsAt: number) => 195 * (1 - eo(prog(f, fsAt - 8, 30)));

const Queue: React.FC<{f: number; x0: number; y0: number; a: number}> = ({f, x0, y0, a}) => {
  const rd = rng(7);
  return (
    <g opacity={a}>
      <defs><linearGradient id="f3dp-st" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cfe1ef"/><stop offset="1" stopColor="#f2e6cb"/></linearGradient><clipPath id="f3dp-qc"><rect x={x0} y={y0} width={625} height={180} rx={16}/></clipPath></defs>
      <g clipPath="url(#f3dp-qc)">
        <rect x={x0} y={y0} width={625} height={180} fill="url(#f3dp-st)"/>
        <rect x={x0} y={y0 + 142} width={625} height={40} fill="#c9b38a"/><rect x={x0} y={y0 + 142} width={625} height={5} fill="#f6e6c4"/>
        <Classical x={x0 + 150} y={y0 + 146} w={250} h={150} text="BANK" id="f3dp-bk" cols={5} textSize={16}/>
        <rect x={x0 + 128} y={y0 + 96} width={44} height={50} rx={22} fill="#4a2f1a" opacity={0.85}/>
        {[0, 1, 2, 3, 4, 5].map((i) => <Person key={i} x={x0 + 330 + i * 52} y={y0 + 172 + (i % 2) * 3} h={118 - (i % 2) * 4} f={f} seed={40 + i} ph={rd() * 6} flip/>)}
        {[0, 1, 2].map((i) => { const u = (f * 0.014 + i / 3) % 1; return <g key={i} opacity={Math.sin(u * Math.PI)}><rect x={x0 + 200 + u * 130} y={y0 + 98 - Math.sin(u * Math.PI) * 24} width={30} height={14} rx={2} fill="url(#f3-note)" stroke="#486b46" strokeWidth={1.4}/></g>; })}
      </g>
      <rect x={x0} y={y0} width={625} height={180} rx={16} fill="none" stroke="#bda46c" strokeWidth={3}/>
    </g>
  );
};
const VaultView: React.FC<{f: number; x0: number; y0: number; a: number}> = ({f, x0, y0, a}) => (
  <g opacity={a}>
    <defs>
      <linearGradient id="f3dp-vw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5a6772"/><stop offset="1" stopColor="#2c353d"/></linearGradient>
      <clipPath id="f3dp-vc"><rect x={x0} y={y0} width={625} height={180} rx={16}/></clipPath>
    </defs>
    <g clipPath="url(#f3dp-vc)">
      <rect x={x0} y={y0} width={625} height={180} fill="url(#f3dp-vw)"/>
      <ellipse cx={x0 + 440} cy={y0 + 90} rx={300} ry={120} fill="url(#ak-sunglow)" opacity={0.28}/>
      {[0, 1, 2].map((r) => <g key={r}><rect x={x0 + 190} y={y0 + 46 + r * 44} width={420} height={8} fill="#7d8a94"/>{Array.from({length: 6}, (_, i) => <Bundle key={i} x={x0 + 232 + i * 70} y={y0 + 46 + r * 44} w={50} h={30} d={14} band/>)}</g>)}
      <rect x={x0} y={y0 + 148} width={625} height={34} fill="#3a444c"/>
      {/* the open round vault door */}
      <g transform={`translate(${x0 + 96} ${y0 + 92})`}>
        <circle r={84} fill="#2a2018" opacity={0.35} transform="translate(8 8)"/>
        <circle r={84} fill="url(#f3-iron)" stroke="#3d444c" strokeWidth={5}/>
        <circle r={64} fill="none" stroke="#4d545c" strokeWidth={4}/>
        {[0, 60, 120].map((a) => <path key={a} d="M-62,0 H62" stroke="#4d545c" strokeWidth={9} strokeLinecap="round" transform={`rotate(${a + 20})`}/>)}
        <circle r={18} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
      </g>
    </g>
    <Specks f={f} n={14} seed={5} c="#fff0c8" x0={x0 + 180} x1={x0 + 610} y0={y0 + 20} y1={y0 + 160}/>
    <rect x={x0} y={y0} width={625} height={180} rx={16} fill="none" stroke="#bda46c" strokeWidth={3}/>
  </g>
);

export const DepressionLinesArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), a0 = eo(prog(f, 0, 26));
  const usT = L.us.at, moT = L.mo.at, bsT = L.bs.at, pmT = L.pm.at, xrT = L.xr.at, fsT = L.fs.at;
  const sx = shiftDep(f, fsT);
  const kM = eo(prog(f, moT, 80)), kB = eo(prog(f, bsT, 80)), axA = eo(prog(f, usT, 24)), dotA = eo(prog(f, usT + 14, 16));
  const kMin = Math.min(kM, kB), gapA = eo(prog(f, bsT + 40, 40));
  const mPts = curve(moneyY, kM), bPts = curve(baseY, kB);
  const wedge = (() => {
    if (kMin <= 0.02) return "";
    const n = 64, m = Math.max(1, Math.floor(n * kMin)), top: string[] = [], bot: string[] = [];
    for (let i = 0; i <= m; i++) { const u = i / n, x = (X0 + (XE - X0) * u).toFixed(1); top.push(`${x},${baseY(u).toFixed(1)}`); bot.unshift(`${x},${moneyY(u).toFixed(1)}`); }
    return `M${top.join(" L")} L${bot.join(" L")} Z`;
  })();
  const tip = (pts: string[]) => pts[pts.length - 1].split(",").map(Number) as [number, number];
  const mT = tip(mPts), bT = tip(bPts);
  const [fsA, fsB] = L.fs.text.split(", "), fsLines = fsA.toUpperCase().split(" AND ");
  const fsAll = [fsLines[0], "AND", fsLines.slice(1).join(" AND ")];
  const colA = eo(prog(f, fsT, 20));
  return (
    <g>
      <F3Defs/>
      <DeskBGPlain f={f}/>
      <g transform={`translate(${sx} 0)`}>
        <PaperCard x={CP.x} y={CP.y} w={CP.w} h={CP.h} tint="#c9922a" a={a0}>
          <g opacity={axA}>
            {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${X0 - 20},${150 + i * 80} H${XE + 330}`} stroke="#b9cde0" strokeWidth={1.6} opacity={0.6}/>)}
            {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${X0 + i * 156},130 V${YAX}`} stroke="#b9cde0" strokeWidth={1.4} opacity={0.4}/>)}
            <path d={`M${X0 - 30},${YAX} H${XE + 330}`} stroke="#3a2a14" strokeWidth={5} strokeLinecap="round"/>
            <path d={`M${X0 - 30},${YAX} V120`} stroke="#3a2a14" strokeWidth={5} strokeLinecap="round"/>
            <polygon points={`${XE + 340},${YAX} ${XE + 318},${YAX - 11} ${XE + 318},${YAX + 11}`} fill="#3a2a14"/>
            <polygon points={`${X0 - 30},112 ${X0 - 41},134 ${X0 - 19},134`} fill="#3a2a14"/>
          </g>
          {wedge && <path d={wedge} fill="#f2b84a" opacity={0.3 * gapA}/>}
          <g strokeLinecap="round" strokeLinejoin="round" fill="none">
            {kM > 0.01 && <polyline points={mPts.join(" ")} stroke="#7a1d10" strokeWidth={13} opacity={0.2} transform="translate(0 4)"/>}
            {kM > 0.01 && <polyline points={mPts.join(" ")} stroke="#c63f2f" strokeWidth={9}/>}
            {kB > 0.01 && <polyline points={bPts.join(" ")} stroke="#0f3d5a" strokeWidth={13} opacity={0.2} transform="translate(0 4)"/>}
            {kB > 0.01 && <polyline points={bPts.join(" ")} stroke="#1f78b4" strokeWidth={9}/>}
          </g>
          <g opacity={dotA}><circle cx={X0} cy={Y0} r={14} fill="#fff" stroke="#3a2a14" strokeWidth={4}/><circle cx={X0} cy={Y0} r={5} fill="#3a2a14"/></g>
          {kM > 0.02 && <circle cx={mT[0]} cy={mT[1]} r={11} fill="#c63f2f" stroke="#fff" strokeWidth={3}/>}
          {kB > 0.02 && <circle cx={bT[0]} cy={bT[1]} r={11} fill="#1f78b4" stroke="#fff" strokeWidth={3}/>}
          {kM > 0.02 && <path d={`M${mT[0] + 14},${mT[1] + 6} L${mT[0] + 40},${mT[1] + 18}`} stroke="#c63f2f" strokeWidth={3} opacity={kM > 0.9 ? 1 : 0}/>}
          <Tag x={Math.min(1090, mT[0] + 190)} y={Math.min(450, mT[1] + 20)} text={L.mo.text} a={eo(prog(f, moT, 16))} size={26} fill="#fde6df" ink="#7a1d10" edge="#c63f2f"/>
          <Tag x={Math.min(880, bT[0] + 40)} y={Math.max(160, bT[1] - 50)} text={L.bs.text} a={eo(prog(f, bsT, 16))} size={26} fill="#e0f0fa" ink="#0f3d5a" edge="#1f78b4"/>
        </PaperCard>
        <Queue f={f} x0={CP.x} y0={640} a={eo(prog(f, pmT - 4, 20))}/>
        <VaultView f={f} x0={CP.x + 645} y0={640} a={eo(prog(f, xrT - 4, 20))}/>
      </g>
      {/* Friedman and Schwartz: a name plaque on a stack of old papers, no faces */}
      {colA > 0.001 && (
        <g opacity={colA} transform={`translate(0 ${(1 - colA) * 30})`}>
          <PaperCard x={1470} y={120} w={350} h={500} tint="#8a5a2c" a={1}>
            {[[-8, 175, 190], [5, 190, 200], [-3, 205, 210]].map(([r, y, w], i) => (
              <g key={i} transform={`translate(175 ${y + 30}) rotate(${r})`}>
                <rect x={-w / 2 + 4} y={-60 + 8} width={w} height={150} rx={4} fill="#2a1808" opacity={0.25}/>
                <rect x={-w / 2} y={-60} width={w} height={150} rx={4} fill={i === 2 ? "#fffdf3" : "#f2e5c6"} stroke="#b9a15c" strokeWidth={2}/>
                {i === 2 && [0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${-w / 2 + 14},${-34 + k * 24} H${w / 2 - 14 - (k % 3) * 24}`} stroke="#8e7a52" strokeWidth={3} opacity={0.5} strokeLinecap="round"/>)}
                {i === 2 && <path d={`M${-w / 2 + 20},${50} l30,-30 l24,14 l34,-44 l40,20`} stroke="#c63f2f" strokeWidth={4} fill="none" opacity={0.7} strokeLinecap="round" strokeLinejoin="round"/>}
              </g>
            ))}
            <g transform="translate(175 372)">
              <rect x={-150 + 6} y={-70 + 12} width={300} height={196} rx={14} fill="#2a1808" opacity={0.3}/>
              <rect x={-150} y={-70} width={300} height={196} rx={14} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3.4}/>
              <rect x={-138} y={-58} width={276} height={172} rx={9} fill="none" stroke="#6c4a16" strokeWidth={1.8} opacity={0.7}/>
              {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j], k) => <g key={k} transform={`translate(${i * 128} ${j * 100 + 28})`}><circle r={5.5} fill="#e9cf8a" stroke="#6c4a16" strokeWidth={1.4}/></g>)}
              {fsAll.map((t, i) => (
                <g key={i}><text y={-18 + i * 46 + 2} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={i === 1 ? 30 : 40} letterSpacing={3} fill="#fff1bd" opacity={0.7}>{t}</text><text y={-18 + i * 46} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={i === 1 ? 30 : 40} letterSpacing={3} fill="#4a2f0a">{t}</text></g>
              ))}
              <text y={112} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={600} fontSize={30} fill="#4a2f0a">{fsB}</text>
            </g>
          </PaperCard>
        </g>
      )}
    </g>
  );
};
const DeskBGPlain: React.FC<{f: number}> = ({f}) => (
  <g>
    <defs><linearGradient id="f3dp-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#dcb987"/><stop offset="0.55" stopColor="#c19a62"/><stop offset="1" stopColor="#8f6234"/></linearGradient></defs>
    <rect x={-60} y={-60} width={2040} height={1200} fill="url(#f3dp-bg)"/>
    {Array.from({length: 17}, (_, i) => <path key={i} d={`M-60,${i * 66 - 20} Q960,${i * 66 - 34 + (i % 3) * 10} 1980,${i * 66 - 10}`} stroke="#6e4524" strokeWidth={1.6} fill="none" opacity={0.3}/>)}
    <ellipse cx={800 + Math.sin(f / 90) * 20} cy={400} rx={1000} ry={620} fill="url(#ak-sunglow)" opacity={0.3}/>
  </g>
);
export const DepressionLinesLabels: React.FC<AP> = (p) => {
  const L = elabs(p), sx = shiftDep(p.f, L.fs.at);
  return (
    <>
      <ECard cx={CP.x + 440 + sx} y={CP.y + 14} text={L.us.text} f={p.f} at={L.us.at} size={34}/>
      <ECard cx={CP.x + 312 + sx} y={832} text={L.pm.text} f={p.f} at={L.pm.at} size={26} maxW={600} upper={false}/>
      <ECard cx={CP.x + 957 + sx} y={832} text={L.xr.text} f={p.f} at={L.xr.at} size={26} maxW={600} upper={false}/>
    </>
  );
};
export { SANS, wrapText, Hall };
