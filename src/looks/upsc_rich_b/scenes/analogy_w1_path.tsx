// POL-03 builder W1: `series-path` (modes part1/part2/part3: a three-stop path, the stop of the mode glows, the others dim, a traveller walks to it) and
// `wants-rights` (the girl's notebook: a phone slides into WANTS, a public well into RIGHTS). Motion depends on f, dur and at(key) only.
import React from "react";
import {SANS, SERIF, W, clamp, eo, eio} from "../kit";
import {Cloud, Hills, Person, Sun, Tree, prog, type AP} from "./analogy_kit";
import {Girl} from "../girl";
import {P2Card, rlabs} from "./analogy_p2b_kit";

type Pt = [number, number];
const STOPS: Pt[] = [[380, 700], [960, 640], [1540, 700]];
// the winding path: a cubic through the stops
const bez = (a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt => { const u = 1 - t; return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]; };
const SEG: [Pt, Pt, Pt, Pt][] = [
  [[110, 860], [200, 700], [250, 820], STOPS[0]],
  [STOPS[0], [560, 600], [760, 800], STOPS[1]],
  [STOPS[1], [1160, 500], [1340, 820], STOPS[2]],
  [STOPS[2], [1680, 560], [1760, 780], [1860, 640]],
];
const pathAt = (s: number): Pt => { const i = Math.min(3, Math.max(0, Math.floor(s))); return bez(...SEG[i], clamp(s - i)); };
const pathD = SEG.map((q, i) => `${i === 0 ? `M${q[0][0]},${q[0][1]}` : ""} C${q[1][0]},${q[1][1]} ${q[2][0]},${q[2][1]} ${q[3][0]},${q[3][1]}`).join(" ");

const Stone: React.FC<{x: number; y: number; n: number; lit: number; f: number}> = ({x, y, n, lit, f}) => {
  const pulse = 1 + 0.04 * Math.sin(f / 9) * lit, s = (0.86 + 0.2 * lit) * pulse, sat = 0.35 + 0.65 * lit;
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={6} rx={150 * s} ry={26 * s} fill="#2a1808" opacity={0.3}/>
      {lit > 0.01 && <circle cx={0} cy={-120 * s} r={230 * lit} fill="url(#ak-sunglow)" opacity={0.95 * lit}/>}
      <g transform={`scale(${s})`} style={{filter: `saturate(${sat}) brightness(${0.9 + 0.12 * lit})`}}>
        <path d="M-104,0 V-170 Q-104,-246 0,-246 Q104,-246 104,-170 V0 Z" fill="#d9c8a4" stroke="#8a7650" strokeWidth={3}/>
        <path d="M0,-246 Q104,-246 104,-170 V0 H0 Z" fill="#a89570" opacity={0.45}/>
        <path d="M-72,0 V-166 Q-72,-216 0,-216 Q72,-216 72,-166 V0 Z" fill="#efe2c4" stroke="#b8a074" strokeWidth={2}/>
        <path d="M-72,0 V-166 Q-72,-216 0,-216 Q72,-216 72,-166 V0 Z" fill={lit > 0.2 ? "#ffe9a6" : "none"} opacity={0.5 * lit}/>
        <rect x={-112} y={-14} width={224} height={14} rx={4} fill="#b7a27a"/>
        <circle cy={-140} r={46} fill="#7a2a1a" stroke="#f2d27a" strokeWidth={4}/>
        <text x={0} y={-124} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={56} fill="#ffe9a8">{n}</text>
      </g>
    </g>
  );
};

export const SeriesPathArt: React.FC<AP> = (p) => {
  const {f, dur} = p, mode = (p.spec as any).mode ?? "part1", k = mode === "part3" ? 2 : mode === "part2" ? 1 : 0;
  const wd = Math.max(60, dur * 0.55), w = eio(prog(f, 10, wd));
  const pos: Pt = bez(...SEG[k], w);
  const lit = [0, 1, 2].map((i) => (i === k ? eo(prog(f, 10 + wd * 0.85, 26)) : 0));
  return (
    <g>
      <defs>
        <linearGradient id="w1p-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fc0e6"/><stop offset="1" stopColor="#f0eccd"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={700} fill="url(#w1p-sky)"/>
      <Sun x={1560} y={150} r={46} f={f} glow={0.6}/><Cloud x={220} y={120} s={1.3} f={f} seed={1} speed={0.05}/><Cloud x={500} y={210} s={1} a={0.85} f={f} seed={2} speed={0.05}/>
      <Hills id="w1p-h1" base={500} amp={90} top="#a9c3d8" bottom="#cddcd6" seed={0.8} wl={340} bottomY={700}/>
      <Hills id="w1p-h2" base={560} amp={60} top="#9fbf9c" bottom="#bcd3a6" seed={3.4} wl={250} bottomY={760}/>
      <rect x={-60} y={600} width={W + 120} height={600} fill="#9fc27e"/>
      <Hills id="w1p-h3" base={640} amp={30} top="#a8cc82" bottom="#86b062" seed={5.1} wl={200} bottomY={1100}/>
      {Array.from({length: 40}).map((_, i) => <path key={i} d={`M${(i * 211) % 1900},${690 + ((i * 97) % 380)} q8,-14 4,-24 M${(i * 211) % 1900 + 6},${690 + ((i * 97) % 380)} q4,-12 12,-18`} stroke="#6a9a48" strokeWidth={2.6} fill="none" opacity={0.5}/>)}
      {[[170, 600, 0.7], [700, 570, 0.6], [1200, 560, 0.62], [1790, 590, 0.75], [560, 960, 1.1], [1360, 980, 1.2], [90, 990, 1.2]].map(([x, y, sc], i) => <Tree key={i} x={x} y={y} s={sc} f={f} seed={i + 2} hue={i * 3}/>)}
      {/* the path: soft shadow, dust, and a dashed centre line */}
      <path d={pathD} stroke="#6a4a2a" strokeWidth={84} fill="none" strokeLinecap="round" opacity={0.25} transform="translate(0 10)"/>
      <path d={pathD} stroke="#d9b98a" strokeWidth={78} fill="none" strokeLinecap="round"/>
      <path d={pathD} stroke="#ecd3a2" strokeWidth={60} fill="none" strokeLinecap="round"/>
      <path d={pathD} stroke="#b88f5a" strokeWidth={3} fill="none" strokeDasharray="14 18" opacity={0.7}/>
      {STOPS.map(([x, y], i) => <Stone key={i} x={x} y={y} n={i + 1} lit={lit[i]} f={f}/>)}
      {/* the traveller */}
      <g><Person x={pos[0] + 120} y={pos[1] + 84} h={190 + (pos[1] - 640) * 0.5} f={f} seed={72} walk={w < 0.98} ph={0}/></g>
    </g>
  );
};

export const SeriesPathLabels: React.FC<AP> = (p) => {
  const mode = (p.spec as any).mode ?? "part1", k = mode === "part3" ? 2 : mode === "part2" ? 1 : 0, L = rlabs(p);
  const cx = [380, 960, 1540];
  return (
    <>
      {L.slice(0, 3).map((l, i) => (
        <div key={i} style={{opacity: i === k ? 1 : 0.55}}>
          <P2Card cx={cx[i]} y={i === 1 ? 140 : 196} text={l.text} f={p.f} at={l.at} size={i === k ? 36 : 32} maxW={i === 1 ? 560 : 500} upper={false} tone={i === k ? "warm" : "cool"}/>
        </div>
      ))}
    </>
  );
};

// ---- wants-rights ---------------------------------------------------------------------------------------------------------------
const Phone: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`} style={{filter: "drop-shadow(0 12px 10px rgba(40,22,8,.4))"}}>
    <rect x={-50} y={-100} width={100} height={200} rx={16} fill="#2a3240" stroke="#10151e" strokeWidth={3}/>
    <rect x={-42} y={-86} width={84} height={166} rx={8} fill="#6aa8d8"/><rect x={-42} y={-86} width={84} height={70} rx={8} fill="#a8d4f0" opacity={0.7}/>
    {[[-20, -50], [10, -50], [-20, -20], [10, -20], [-20, 10], [10, 10]].map(([x, y], i) => <rect key={i} x={x - 6} y={y - 6} width={26} height={26} rx={7} fill={["#e8c46c", "#d8688a", "#7fc48a", "#f09a4a", "#9a7ad8", "#fff"][i]} opacity={0.95}/>)}
    <rect x={-14} y={-96} width={28} height={6} rx={3} fill="#10151e"/>
  </g>
);
const Well: React.FC<{s?: number; f: number}> = ({s = 1, f}) => (
  <g transform={`scale(${s})`} style={{filter: "drop-shadow(0 12px 10px rgba(40,22,8,.4))"}}>
    <rect x={-84} y={-150} width={10} height={150} fill="#8a5a34"/><rect x={74} y={-150} width={10} height={150} fill="#8a5a34"/>
    <path d="M-110,-150 L0,-210 L110,-150 Z" fill="#b8532f" stroke="#7a2f18" strokeWidth={3}/><path d="M0,-210 L110,-150 H0 Z" fill="#7a2f18" opacity={0.35}/>
    <rect x={-92} y={-96} width={184} height={8} rx={4} fill="#6a4020"/>
    <path d={`M0,-96 V${-40 + 6 * Math.sin(f / 20)}`} stroke="#6a5a3a" strokeWidth={3}/><path d={`M-14,${-40 + 6 * Math.sin(f / 20)} h28 l-4 24 h-20 Z`} fill="#8a6a3a" stroke="#4a3418" strokeWidth={2}/>
    <path d="M-100,0 V-46 Q0,-66 100,-46 V0 Z" fill="#cdb98e" stroke="#8a7650" strokeWidth={3}/>
    {[-60, -20, 20, 60].map((x, i) => <path key={i} d={`M${x - 16},${-44 + (i % 2) * 18} h32 M${x},${-44 + (i % 2) * 18} v14`} stroke="#8a7650" strokeWidth={2} opacity={0.45}/>)}
    <ellipse cx={0} cy={-52} rx={96} ry={14} fill="#3f7f98"/><ellipse cx={0} cy={-54} rx={80} ry={9} fill="#7fc0d6" opacity={0.7}/>
  </g>
);

export const WantsRightsArt: React.FC<AP> = (p) => {
  const {f} = p, wn = p.at("wn"), rt = p.at("rt"), jc = p.at("jc");
  const aw = eo(prog(f, wn, 18)), ar = eo(prog(f, rt, 18)), ph = eio(prog(f, wn + 18, 36)), wl = eio(prog(f, rt + 18, 36));
  const NX = 1180, NY = 470;
  return (
    <g>
      <defs>
        <linearGradient id="w1w-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b98a58"/><stop offset="1" stopColor="#7a5230"/></linearGradient>
        <linearGradient id="w1w-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e3d2ae"/><stop offset="1" stopColor="#d2bd92"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={1200} fill="url(#w1w-wall)"/>
      <path d="M-60,820 H2000 V1200 H-60 Z" fill="url(#w1w-desk)"/><rect x={-60} y={820} width={W + 120} height={8} fill="#d6a572"/>
      {Array.from({length: 10}).map((_, i) => <path key={i} d={`M-60,${850 + i * 24} Q600,${844 + i * 24} 2000,${856 + i * 24}`} stroke="#4a2a14" strokeWidth={1.6} fill="none" opacity={0.25}/>)}
      <g opacity={0.9}><rect x={90} y={110} width={260} height={320} rx={6} fill="#ece0c4" stroke="#8a6a44" strokeWidth={6}/><rect x={108} y={128} width={224} height={284} fill="#dbe9ee"/><path d="M220,128 V412 M108,270 H332" stroke="#8a6a44" strokeWidth={6}/></g>
      {/* the girl at the left, beside her notebook */}
      <g transform="translate(250 960) scale(0.62)"><ellipse cx={30} cy={4} rx={150} ry={22} fill="#2a1808" opacity={0.28}/><Girl f={f} id="w1w-g" pose={f < wn + 54 ? "write" : "present"}/></g>
      {/* the open notebook */}
      <g transform={`translate(${NX} ${NY})`}>
        <ellipse cx={0} cy={346} rx={560} ry={26} fill="#2a1808" opacity={0.3}/>
        <path d="M-560,-300 H0 V330 H-560 Z" fill="#fbf4de" stroke="#b8a074" strokeWidth={3}/><path d="M0,-300 H560 V330 H0 Z" fill="#f8f0d8" stroke="#b8a074" strokeWidth={3}/>
        <path d="M-560,330 H560 V350 H-560 Z" fill="#c8b88c"/><rect x={-6} y={-300} width={12} height={630} fill="#cdbb90" opacity={0.7}/>
        <rect x={-560} y={-300} width={1120} height={630} fill="none" stroke="#2a4a6a" strokeWidth={0}/>
        {Array.from({length: 12}).map((_, i) => <g key={i}><path d={`M-540,${-190 + i * 44} H-20`} stroke="#9ab8d2" strokeWidth={1.8} opacity={0.65}/><path d={`M20,${-190 + i * 44} H540`} stroke="#9ab8d2" strokeWidth={1.8} opacity={0.65}/></g>)}
        <path d="M-540,-300 V330" stroke="#d8688a" strokeWidth={2} opacity={0.5}/>
        {/* column heads */}
        <g opacity={aw}><text x={-290} y={-196} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={62} fill="#b8401f" letterSpacing="0.04em">WANTS</text><path d="M-420,-176 Q-290,-166 -160,-178" stroke="#b8401f" strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={`${300 * aw} 300`}/></g>
        <g opacity={ar}><text x={290} y={-196} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={62} fill="#1f6a3a" letterSpacing="0.04em">RIGHTS</text><path d="M160,-178 Q290,-166 420,-178" stroke="#1f6a3a" strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={`${300 * ar} 300`}/></g>
        {/* the phone slides into WANTS, the well into RIGHTS */}
        {aw > 0.01 && <g transform={`translate(${-290 + (1 - ph) * -380} ${96 - (1 - ph) * 360}) rotate(${-14 * (1 - ph)}) scale(${1.15 - 0.15 * ph})`} opacity={clamp(aw * 4)}><Phone s={1.35}/></g>}
        {ar > 0.01 && <g transform={`translate(${290 + (1 - wl) * 380} ${180 - (1 - wl) * 380}) rotate(${12 * (1 - wl)})`} opacity={clamp(ar * 4)}><Well s={1.05} f={f}/></g>}
        <path d="M0,-170 V300" stroke="#cdbb90" strokeWidth={2} strokeDasharray="6 10" opacity={0.6}/>
      </g>
    </g>
  );
};

export const WantsRightsLabels: React.FC<AP> = (p) => {
  const L = rlabs(p), labs = (p.spec.labels ?? []) as {key: string}[];
  const g = (k: string) => { const i = labs.findIndex((l) => l.key === k); return i >= 0 ? L[i] : undefined; };
  const jc = g("jc"), cs = g("cs");
  return <>
    {jc && <P2Card cx={1180} y={108} text={jc.text} f={p.f} at={jc.at} size={40} maxW={1180} upper={false}/>}
    {cs && <P2Card cx={1180} y={800} text={cs.text} f={p.f} at={cs.at} size={32} maxW={1100} upper={false} tone="green"/>}
  </>;
};
