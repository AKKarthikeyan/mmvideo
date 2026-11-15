// GEO-04 Part 1, builder V2: `cinder-cone` (s023, a ploughed field, a mound grows into a black cone over the seasons) and `ferry-island` (s038, the girl on a ferry looking at a smoking island).
import React from "react";
import {W, eo, eio, clamp, rng} from "../kit";
import {Cloud, Sun, Person, prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {Girl} from "../girl";
import {V2Defs, SkyBox, Plume, Ballistic, Glow, curve, pts, under, ease, mix, type XY} from "./analogy_v2_kit";

// ---- the ox (side view, faces left) -------------------------------------------------------------------------------------------------
const Ox: React.FC<{f: number; ph: number; tone?: number}> = ({f, ph, tone = 0}) => {
  const sw = (k: number) => Math.sin(f / 6 + ph + k * Math.PI) * 14;
  const c1 = tone ? "#d9d0bd" : "#e6dfce", c2 = tone ? "#a99f88" : "#b8ae98", ln = "#6e6450";
  const leg = (x: number, k: number, far: boolean) => (
    <g key={`${x}${k}`} transform={`translate(${x} 150) rotate(${sw(k) * 0.55})`} opacity={far ? 0.85 : 1}>
      <path d="M-9,0 L9,0 L7,86 L-6,86 Z" fill={far ? c2 : c1} stroke={ln} strokeWidth={1.6}/>
      <path d="M-6,86 L7,86 L9,100 L-8,100 Z" fill="#3a2e24"/>
    </g>
  );
  return (
    <g>
      <ellipse cx={0} cy={252} rx={150} ry={12} fill="#1a0f06" opacity={0.35}/>
      {leg(-70, 0, true)}{leg(50, 1, true)}
      <path d="M-120,70 Q-124,20 -70,14 Q0,4 70,14 Q118,18 126,64 Q130,120 100,150 L-90,152 Q-124,130 -120,70 Z" fill={c1} stroke={ln} strokeWidth={2}/>
      <path d="M-120,100 Q-124,130 -90,152 L100,150 Q130,120 126,86 Q40,128 -120,100 Z" fill={c2} opacity={0.6}/>
      <path d="M70,18 Q96,-26 130,-4 Q150,16 128,40 Q106,22 70,18 Z" fill={c2} stroke={ln} strokeWidth={1.8}/>
      <path d="M112,52 Q150,40 168,70 Q164,130 146,120 Q120,110 112,52 Z" fill={c2} stroke={ln} strokeWidth={1.4} opacity={0.5}/>
      <path d="M130,40 Q166,34 186,52 Q196,64 182,78 Q160,82 142,72 Q122,58 130,40 Z" fill={c1} stroke={ln} strokeWidth={2}/>
      <ellipse cx={186} cy={64} rx={9} ry={12} fill="#c9a89a" stroke={ln} strokeWidth={1.4}/>
      <circle cx={158} cy={52} r={4.4} fill="#2a1a10"/><circle cx={157} cy={50.6} r={1.4} fill="#fff"/>
      <path d="M144,36 Q132,14 154,-6 Q156,6 150,22" fill="#f3ead2" stroke={ln} strokeWidth={1.8}/>
      <path d="M128,44 Q108,48 100,62 Q114,66 126,58 Z" fill={c2} stroke={ln} strokeWidth={1.4}/>
      <path d={`M-118,50 Q-146,${70 + Math.sin(f / 9 + ph) * 8} -140,${128 + Math.sin(f / 7 + ph) * 8}`} stroke={ln} strokeWidth={5} fill="none" strokeLinecap="round"/>
      <path d="M-140,126 q-6,16 4,26 q10,-12 4,-26 Z" fill="#6e6450"/>
      {leg(-84, 1, false)}{leg(66, 0, false)}
    </g>
  );
};

const Tree: React.FC<{x: number; y: number; s: number; green: number; autumn: number; seed: number}> = ({x, y, s, green, autumn, seed}) => {
  const r = rng(seed * 33 + 1), leaves = Array.from({length: 11}, () => ({cx: (r() - 0.5) * 120, cy: -190 - r() * 90, rr: 26 + r() * 20}));
  const col = autumn > 0.02 ? `hsl(${mix(105, 28, autumn)} ${mix(40, 62, autumn)}% ${mix(40, 46, autumn)}%)` : "hsl(105 42% 40%)";
  const dk = autumn > 0.02 ? `hsl(${mix(120, 20, autumn)} 38% 26%)` : "hsl(122 40% 26%)";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={20} cy={3} rx={70} ry={9} fill="#1a1006" opacity={0.25}/>
      <path d="M-9,2 Q-6,-90 -4,-190 L6,-190 Q9,-90 13,2 Z" fill="#5d4128" stroke="#33220f" strokeWidth={1.4}/>
      {[[-4, -150, -56, -220], [3, -140, 54, -214], [0, -180, -20, -262], [2, -176, 30, -250]].map((b, i) => <path key={i} d={`M${b[0]},${b[1]} Q${(b[0] + b[2]) / 2},${b[3] + 30} ${b[2]},${b[3]}`} stroke="#4a3320" strokeWidth={6 - i} fill="none" strokeLinecap="round"/>)}
      {green > 0.03 && leaves.map((b, i) => <g key={i} opacity={clamp(green * 1.4 - i * 0.04)}><circle cx={b.cx + 6} cy={b.cy + 10} r={b.rr * green} fill={dk}/><circle cx={b.cx} cy={b.cy} r={b.rr * 0.92 * green} fill={col}/><circle cx={b.cx - b.rr * 0.2} cy={b.cy - b.rr * 0.25} r={b.rr * 0.5 * green} fill="#b8d878" opacity={0.5 * (1 - autumn)}/></g>)}
    </g>
  );
};

const HZ = 700;
export const CinderArt: React.FC<AP> = ({f, dur}) => {
  const t = clamp(f / Math.max(1, dur)), p = eio(prog(f, 36, Math.max(60, dur - 110))), st = prog(f, 14, 24);
  const green = Math.pow(Math.sin(Math.PI * t), 0.8), autumn = t > 0.5 ? clamp((t - 0.55) * 3.2) : 0;
  const day = (t * 3) % 1, night = Math.pow(1 - Math.sin(Math.PI * day), 3) * 0.42;
  const CXC = 1330, Hh = mix(5, 372, p), Hw = Hh * 1.45;
  const cone = (x: number) => { const d = Math.abs(x - CXC); return d > Hw ? HZ : HZ - Hh * Math.pow(Math.max(0, 1 - d / Hw), 1.12); };
  const rimX = Hw * 0.075, ry = cone(CXC + rimX), prof = (x: number) => { const d = Math.abs(x - CXC); return d < rimX ? ry + Hh * 0.04 * (1 - (d / rimX) * (d / rimX)) : cone(x); };
  const rnd = rng(8), spk = Array.from({length: 120}, () => { const a = rnd(), b = rnd(); return {a, b}; });
  const gwx = 470 - 90 * eio(t), rows = Array.from({length: 17}, (_, i) => i - 8);
  const sunX = mix(160, 1500, day), sunY = 700 - 470 * Math.sin(Math.PI * day);
  return (
    <g>
      <V2Defs/>
      <SkyBox id="v2cc" top="#5fa1d4" mid="#b9d9e6" bot="#f6e7c6" y1={HZ + 4}/>
      <Sun x={sunX} y={sunY} r={42} f={f} glow={0.75}/>
      {[0, 1, 2].map((i) => <Cloud key={i} x={80 + i * 640} y={170 + (i % 2) * 90} s={0.9 - i * 0.1} f={f * 1.8} speed={0.16} seed={i + 41} a={0.8}/>)}
      <path d={under((x) => 650 - 26 * Math.sin(x / 240 + 2) - 12 * Math.sin(x / 83), -60, W + 60, HZ + 4, 24)} fill="#a9c1d8" opacity={0.7}/>
      <path d={under((x) => 685 - 16 * Math.sin(x / 150 + 1) - 8 * Math.sin(x / 51), -60, W + 60, HZ + 4, 20)} fill="#86ab8c" opacity={0.8}/>
      {/* the field: ploughed rows running to the horizon */}
      <defs><linearGradient id="v2cc-soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8d6a45"/><stop offset="1" stopColor="#4b2f1c"/></linearGradient></defs>
      <rect x={-60} y={HZ} width={W + 120} height={500} fill="url(#v2cc-soil)"/>
      {rows.map((j) => <path key={j} d={`M${960 + j * 38},${HZ} L${960 + j * 250},1100 L${960 + j * 250 + 125},1100 L${960 + j * 38 + 19},${HZ} Z`} fill={j % 2 ? "#3c2415" : "#a5784c"} opacity={0.5}/>)}
      <ellipse cx={CXC} cy={HZ + 8} rx={Hw * 0.85 + 90 * p} ry={14 + 26 * p} fill="#16110f" opacity={0.28 * p + 0.04}/>
      {/* trees on the horizon: bare, green, bare */}
      {[120, 330, 560, 760, 1040, 1700].map((x, i) => <Tree key={i} x={x} y={HZ + 6 + (i % 2) * 8} s={0.34 + (i % 3) * 0.05} green={green} autumn={autumn} seed={i + 2}/>)}
      {/* the cone: black loose cinders around one vent */}
      <g>
        <defs>
          <linearGradient id="v2cc-cone" gradientUnits="userSpaceOnUse" x1={CXC - Hw} y1="0" x2={CXC + Hw} y2="0"><stop offset="0" stopColor="#5a504a"/><stop offset="0.5" stopColor="#2d2725"/><stop offset="1" stopColor="#1a1615"/></linearGradient>
        </defs>
        <path d={under(prof, CXC - Hw - 2, CXC + Hw + 2, HZ + 4, 10)} fill="url(#v2cc-cone)"/>
        <path d={pts(curve(prof, CXC - Hw, CXC + Hw, 10))} fill="none" stroke="#a89a8c" strokeWidth={1.6} opacity={0.5}/>
        {spk.map((s, i) => { const x = CXC - Hw + s.a * 2 * Hw, y = prof(x) + 6 + s.b * Math.max(0, HZ - prof(x) - 8); return Hh > 30 && y < HZ ? <circle key={i} cx={x} cy={y} r={1.6 + (i % 3)} fill={i % 2 ? "#6b6058" : "#0f0c0b"} opacity={0.6}/> : null; })}
        <Glow x={CXC} y={ry} r={40 + Hh * 0.35} a={(0.4 + 0.3 * Math.sin(f / 5)) * st}/>
        <ellipse cx={CXC} cy={ry + 2} rx={Math.max(5, rimX * 0.7)} ry={Math.max(2, rimX * 0.14)} fill="#ff8a2a" opacity={0.85 * st}/>
      </g>
      <Ballistic x={CXC} y={ry} f={f} n={14} vx={22 + 20 * p} vy={34 + 20 * p} g={3.2} period={56} seed={5} r={4 + 3 * p} start={30}/>
      <Plume x={CXC} y={ry - 6} f={f} n={18} rise={160 + 300 * p} drift={-210} r0={14 + 16 * p} r1={50 + 70 * p} kind="D" period={120} a={st} seed={7} sway={12} start={14}/>
      {/* the farmer ploughing, oxen pulling, leaving a dark furrow behind */}
      <g transform={`translate(${gwx} 0)`}>
        <path d="M130,1010 L560,1010" stroke="#2a180d" strokeWidth={16} strokeLinecap="round" opacity={0.5}/>
        <g transform="translate(150 718) scale(1.0)"><Ox f={f} ph={0} tone={1}/></g>
        <g transform="translate(190 764) scale(1.08)"><Ox f={f} ph={2.2}/></g>
        <path d="M330,872 L350,858 L690,930" stroke="#5a3a1e" strokeWidth={9} fill="none" strokeLinecap="round"/>
        <rect x={280} y={850} width={92} height={13} rx={6} fill="#6e4825" stroke="#3a240e" strokeWidth={1.6} transform="rotate(8 326 856)"/>
        <path d="M690,930 L760,1010 L792,1018" stroke="#4a3018" strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M612,892 L660,812" stroke="#4a3018" strokeWidth={9} fill="none" strokeLinecap="round"/>
        <Person x={650} y={1004} h={400} f={f} seed={14} walk ph={0}/>
      </g>
    </g>
  );
};
export const CinderLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  return (
    <>
      {L[0] && <P2Card cx={560} y={84} text={L[0].text} f={p.f} at={L[0].at} size={50} maxW={700}/>}
      {L[1] && <P2Card cx={1440} y={786} text={L[1].text} f={p.f} at={L[1].at} size={34} maxW={760} upper={false}/>}
    </>
  );
};

// ---- ferry-island ------------------------------------------------------------------------------------------------------------------
export const FerryArt: React.FC<AP> = ({f, dur}) => {
  const HZF = 560, bob = Math.sin(f / 21) * 5 + Math.sin(f / 9) * 1.6, ix = 470, iy = HZF + 6;
  const isl = (x: number) => { const d = Math.abs(x - ix); return d > 230 ? iy : iy - 190 * Math.pow(1 - d / 230, 1.35); };
  const rimY = isl(ix + 18), isl2 = (x: number) => (Math.abs(x - ix) < 18 ? rimY + 10 * (1 - Math.pow((x - ix) / 18, 2)) : isl(x));
  const sea = (x: number) => HZF + 3 * Math.sin(x / 90 + f / 14);
  return (
    <g>
      <V2Defs/>
      <defs>
        <linearGradient id="v2fy-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fcde2"/><stop offset="0.3" stopColor="#3d93bf"/><stop offset="1" stopColor="#164f7a"/></linearGradient>
        <linearGradient id="v2fy-isl" gradientUnits="userSpaceOnUse" x1="0" y1={rimY} x2="0" y2={iy}><stop offset="0" stopColor="#6e5f58"/><stop offset="0.5" stopColor="#6f7f55"/><stop offset="1" stopColor="#4a7a45"/></linearGradient>
        <linearGradient id="v2fy-deck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b98c5c"/><stop offset="1" stopColor="#6e4826"/></linearGradient>
      </defs>
      <SkyBox id="v2fy" top="#5b9ed4" mid="#b9d9e6" bot="#f8ead0" y1={HZF + 4}/>
      <Sun x={1430} y={230} r={48} f={f} glow={0.85}/>
      {[0, 1, 2].map((i) => <Cloud key={i} x={60 + i * 660} y={150 + (i % 2) * 110} s={0.95 - i * 0.1} f={f} speed={0.2} seed={i + 61} a={0.85}/>)}
      <g transform={`translate(0 ${bob * 0.6})`}>
        {/* the lone island, hazy with distance */}
        <path d={under(isl2, ix - 232, ix + 232, iy + 4, 8)} fill="url(#v2fy-isl)"/>
        <path d={under((x) => isl2(x) + 0, ix, ix + 232, iy + 4, 8)} fill="#1b2440" opacity={0.18}/>
        <path d={pts(curve(isl2, ix - 230, ix + 230, 8))} fill="none" stroke="#f0d9a8" strokeWidth={1.8} opacity={0.5}/>
        <rect x={ix - 240} y={iy - 40} width={480} height={50} fill="#dcecf2" opacity={0.28}/>
        {[-0.7, -0.4, -0.15, 0.2, 0.5, 0.75].map((j, i) => <path key={i} d={pts(Array.from({length: 14}, (_, k) => { const x = ix + j * 230 * (k / 13); return [x, k === 0 ? rimY + 6 : isl(ix + (x - ix) / Math.abs(j))] as XY; }))} fill="none" stroke={j < 0 ? "#f0dcb0" : "#1b2440"} strokeWidth={1.6} opacity={0.3}/>)}
        <rect x={ix - 232} y={iy - 5} width={464} height={8} rx={4} fill="#e8d8aa" opacity={0.8}/>
        <Glow x={ix} y={rimY - 2} r={36} a={0.35 + 0.1 * Math.sin(f / 6)}/>
        <Plume x={ix} y={rimY - 4} f={f} n={14} rise={190} drift={150} r0={12} r1={42} kind="G" period={150} a={0.9} seed={3} sway={8}/>
      </g>
      {/* the sea */}
      <rect x={-60} y={HZF} width={W + 120} height={600} fill="url(#v2fy-sea)"/>
      <ellipse cx={ix} cy={HZF + 26} rx={220} ry={10} fill="#d7efe6" opacity={0.2}/>
      {Array.from({length: 36}, (_, i) => { const r = rng(i * 5 + 1), y = HZF + 14 + Math.pow(r(), 1.7) * 360, x = (r() * 2100 + f * (0.3 + (y - HZF) / 400)) % 2100 - 100, w = 20 + (y - HZF) * 0.3; return <path key={i} d={`M${x},${y + bob * 0.3} l${w},${Math.sin(f / 12 + i) * 1.2}`} stroke="#e6fbff" strokeWidth={1.4 + (y - HZF) / 200} opacity={0.35} strokeLinecap="round"/>; })}
      <path d={pts(curve(sea, -60, W + 60, 14))} fill="none" stroke="#e8fbff" strokeWidth={2} opacity={0.6}/>
      {/* gulls */}
      {[0, 1].map((i) => { const gx = 900 + i * 220 + Math.sin(f / 40 + i) * 30, gy = 300 + i * 70 + Math.sin(f / 18 + i * 2) * 10; return <path key={i} d={`M${gx - 22},${gy} Q${gx - 10},${gy - 12 - 4 * Math.sin(f / 5 + i)} ${gx},${gy} Q${gx + 10},${gy - 12 - 4 * Math.sin(f / 5 + i)} ${gx + 22},${gy}`} stroke="#3a3a42" strokeWidth={2.4} fill="none" strokeLinecap="round"/>; })}
      {/* the ferry: rail behind the girl, planks, the girl, the near deck edge */}
      <g transform={`translate(0 ${bob})`}>
        <path d="M-60,760 L1980,760 L1980,780 L-60,780 Z" fill="#f3efe6" stroke="#b8b0a0" strokeWidth={2}/>
        {Array.from({length: 24}, (_, i) => <rect key={i} x={-20 + i * 86} y={780} width={9} height={110} fill="#f3efe6" stroke="#b8b0a0" strokeWidth={1.6}/>)}
        <path d="M-60,812 L1980,812 M-60,846 L1980,846" stroke="#d6cfc0" strokeWidth={5}/>
        <rect x={-60} y={890} width={W + 120} height={260} fill="url(#v2fy-deck)"/>
        {Array.from({length: 12}, (_, i) => <path key={i} d={`M-60,${890 + i * 28 + i * i * 1.2} L${W + 60},${890 + i * 28 + i * i * 1.2}`} stroke="#4a2c12" strokeWidth={1.6} opacity={0.45}/>)}
        <rect x={-60} y={886} width={W + 120} height={8} fill="#e8caa0" opacity={0.7}/>
        <g transform="translate(1310 934)"><ellipse cx={30} cy={4} rx={150} ry={20} fill="#2a1808" opacity={0.3}/><Girl f={f} id="v2fy-g" pose="shade"/></g>
        <path d="M-60,1010 L1980,1010 L1980,1100 L-60,1100 Z" fill="#8c5e34"/>
        <path d="M0,1010 L1920,1010" stroke="#d9b98a" strokeWidth={4} opacity={0.6}/>
      </g>
    </g>
  );
};
export const FerryLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  return <>{L[0] && <P2Card cx={960} y={84} text={L[0].text} f={p.f} at={L[0].at} size={36} maxW={1380} upper={false}/>}</>;
};
