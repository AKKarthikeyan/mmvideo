import React from "react";
import {AbsoluteFill} from "remotion";
import {C, W, H, FPS, Sky, Sparks, Icon, IconName, clamp, lerp, prog, easeIO, easeOut, easeIn, sp, rnd, sec, bounceH, brake, proj, ringPath, View} from "./kit";
import {SceneProps} from "./scenes1";
import geo from "../../public/sivakasi/geo.json";

// ---------- little people ----------
export const Person: React.FC<{x: number; y: number; s?: number; color?: string; phase?: number; walk?: number; arm?: number; flip?: boolean; skin?: string}> =
({x, y, s = 1, color = "#1B2250", phase = 0, walk = 0, arm = 0, flip, skin = "#D9A066"}) => {
  const sw = Math.sin(phase) * 18 * walk, bob = Math.abs(Math.sin(phase)) * 4 * walk;
  return <g transform={`translate(${x} ${y - bob}) scale(${(flip ? -1 : 1) * s} ${s})`}>
    <line x1={-6} y1={-6} x2={-6 + sw} y2={44} stroke={color} strokeWidth={11} strokeLinecap="round" /><line x1={8} y1={-6} x2={8 - sw} y2={44} stroke={color} strokeWidth={11} strokeLinecap="round" />
    <rect x={-17} y={-62} width={34} height={62} rx={12} fill={color} /><line x1={0} y1={-50} x2={22 + arm * 16} y2={-26 - arm * 22} stroke={color} strokeWidth={10} strokeLinecap="round" />
    <circle cx={0} cy={-78} r={14} fill={skin} /></g>;
};

// ---------- map view of south and east India ----------
const VIEW: View = {lon0: 68, lon1: 93, lat0: 5, lat1: 27, x: 370, y: 0, w: 1180, h: 1080};
const places = (geo as any).places as Record<string, number[]>;
export const IndiaBase: React.FC<{f: number; dim?: number; v?: View; label?: string[]}> = ({f, dim = 1, v = VIEW, label = []}) => {
  const P = proj(v), world = (geo as any).world as {n: string; r: number[][][]}[];
  return <g>
    <rect width={W} height={H} fill="#0B1C45" />
    {world.map((c, i) => c.n === "India" ? null : c.r.map((r, j) => <path key={i + "_" + j} d={ringPath(r, P)} fill="#16335F" stroke="#27508A" strokeWidth={1} opacity={dim} />))}
    {(geo as any).india.map((r: number[][], i: number) => <path key={"in" + i} d={ringPath(r, P)} fill="#E8A44B" stroke="#FFE2A8" strokeWidth={1.4} opacity={0.92 * dim} />)}
    {(geo as any).tn.map((r: number[][], i: number) => <path key={"tn" + i} d={ringPath(r, P)} fill="#F2742F" stroke="#FFD58A" strokeWidth={1.4} opacity={dim} />)}
    {label.map((n) => { const q = places[n]; if (!q) return null; const [x, y] = P(q[0], q[1]); const sv = n.startsWith("Sivakasi"); return <g key={n}><circle cx={x} cy={y} r={sv ? 11 : 8} fill={sv ? "#fff" : C.cream} /><circle cx={x} cy={y} r={sv ? 20 + 6 * Math.sin(f / 9) : 13} fill="none" stroke={sv ? C.gold : C.cream} strokeWidth={3} opacity={0.5} /></g>; })}
  </g>;
};
const bez = (a: number[], c: number[], b: number[], t: number) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
const bezTan = (a: number[], c: number[], b: number[], t: number) => [2 * (1 - t) * (c[0] - a[0]) + 2 * t * (b[0] - c[0]), 2 * (1 - t) * (c[1] - a[1]) + 2 * t * (b[1] - c[1])];

export const RouteMap: React.FC<SceneProps> = ({f, dur, p = {}}) => {
  const v = VIEW, P = proj(v), from = places[p.from ?? "Sivakasi (approx)"], to = places[p.to ?? "Kolkata"];
  const a = P(from[0], from[1]), b = P(to[0], to[1]), mid = [(a[0] + b[0]) / 2 - 140, (a[1] + b[1]) / 2 + 30];
  const T = sec(f), vehicle = p.vehicle ?? "train", zoomK = prog(f, 0, 90, easeOut);
  const go = prog(f, 40, dur - 50, vehicle === "train" ? easeIO : (t: number) => t), k = go, pos = bez(a, mid, b, k), tan = bezTan(a, mid, b, k), ang = (Math.atan2(tan[1], tan[0]) * 180) / Math.PI;
  const route = `M${a[0]} ${a[1]} Q${mid[0]} ${mid[1]} ${b[0]} ${b[1]}`;
  const smoke = Array.from({length: 34}, (_, i) => { const ts = i * 0.1, kk = prog(ts * FPS + 0, 40, dur - 50, easeIO); return {ts, pos: bez(a, mid, b, kk)}; });
  const pulse = 1 + 0.3 * Math.sin(f / 8);
  return <AbsoluteFill><svg width={W} height={H} style={{position: "absolute"}}>
    <g transform={`translate(${W / 2} ${H / 2}) scale(${lerp(1.0, p.zoom ?? 1.12, zoomK)}) translate(${-W / 2} ${-H / 2})`}>
      <IndiaBase f={f} label={[p.from ?? "Sivakasi (approx)", p.to ?? "Kolkata"]} />
      <path d={route} stroke={C.gold} strokeWidth={5} fill="none" strokeDasharray="4 16" strokeLinecap="round" opacity={0.7} />
      <path d={route} stroke={C.gold} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 2`} opacity={0.95} />
      {vehicle === "train" && smoke.map((s, i) => { const age = T - s.ts; return age > 0 && age < 2 && s.ts < T ? <circle key={i} cx={s.pos[0]} cy={s.pos[1] - 8 - age * 22} r={4 + age * 7} fill="#DDE6FF" opacity={0.35 * (1 - age / 2)} /> : null; })}
      {vehicle === "train" && <g transform={`translate(${pos[0]} ${pos[1]}) rotate(${ang})`}><rect x={-24} y={-9} width={48} height={18} rx={5} fill="#FFE9B0" stroke="#7A4B12" strokeWidth={2} />{[-14, 0, 14].map((x) => <rect key={x} x={x - 4} y={-5} width={8} height={7} fill="#26346E" />)}</g>}
      {vehicle === "labels" && Array.from({length: 4}, (_, i) => { const kk = clamp(k - i * 0.035), q = bez(a, mid, b, kk); return <rect key={i} x={q[0] - 15} y={q[1] - 11} width={30} height={22} rx={3} fill={["#E5484D", "#F2B33D", "#4FD6C4", "#C58BFF"][i]} transform={`rotate(${ang} ${q[0]} ${q[1]})`} />; })}
      {p.arrive !== false && k > 0.97 && <g transform={`translate(${b[0]} ${b[1]}) scale(${sp(f, dur - 40, 12, 140)})`} opacity={0.95}><circle r={42 * pulse} fill={C.gold} opacity={0.22} /><g transform="translate(0 -62)"><Icon n={(p.arriveIcon ?? "match") as IconName} s={74} color={C.cream} /></g></g>}
    </g></svg></AbsoluteFill>;
};

// ---------- imports stop: ships approach, meet a barrier, brake, and turn back ----------
export const Blockade: React.FC<SceneProps> = ({f, dur}) => {
  const P = proj(VIEW), tk = prog(f, 20, dur * 0.55, brake), back = prog(f, dur * 0.62, dur - 10, easeIn), bar = prog(f, dur * 0.45, dur * 0.6, easeOut);
  const routes = [[[110, 250], [560, 640]], [[110, 640], [520, 760]], [[1810, 160], [1230, 560]], [[1810, 520], [1280, 760]], [[960, 40], [940, 330]]];
  return <AbsoluteFill><svg width={W} height={H} style={{position: "absolute"}}><IndiaBase f={f} />
    {routes.map(([s, e], i) => { const k = tk * (1 - back * 1.25), x = lerp(s[0], e[0], clamp(k)), y = lerp(s[1], e[1], clamp(k)), ang = (Math.atan2(e[1] - s[1], e[0] - s[0]) * 180) / Math.PI;
      return <g key={i}><line x1={s[0]} y1={s[1]} x2={e[0]} y2={e[1]} stroke={C.mist} strokeWidth={3} strokeDasharray="3 14" opacity={0.5} />
        <g transform={`translate(${x} ${y}) rotate(${ang > 90 || ang < -90 ? ang + 180 : ang})`}><path d="M-26 0 H26 L18 14 H-18 Z" fill="#E9EEFF" /><rect x={-8} y={-16} width={16} height={16} fill="#E5484D" /></g></g>; })}
    {routes.map(([s, e], i) => <circle key={"b" + i} cx={e[0]} cy={e[1]} r={30 * bar} fill="none" stroke={C.red} strokeWidth={5} opacity={bar} />)}
    {routes.map(([s, e], i) => <g key={"x" + i} transform={`translate(${e[0]} ${e[1]}) scale(${bar})`} opacity={bar}><line x1={-18} y1={-18} x2={18} y2={18} stroke={C.red} strokeWidth={7} strokeLinecap="round" /><line x1={18} y1={-18} x2={-18} y2={18} stroke={C.red} strokeWidth={7} strokeLinecap="round" /></g>)}
  </svg></AbsoluteFill>;
};

// ---------- a station platform: two young men wait; the train brakes into the platform ----------
export const Platform: React.FC<SceneProps> = ({f, dur}) => {
  const T = sec(f), arrive = brake(prog(f, 10, dur * 0.7, (t: number) => t)), tx = lerp(-2100, 120, arrive), steam = Array.from({length: 22}, (_, i) => { const age = ((T * 0.8 + i / 22) % 1); return <circle key={i} cx={tx + 1960 - age * 90 + 14 * Math.sin(age * 8 + i)} cy={640 - age * 220} r={12 + age * 40} fill="#E8ECF8" opacity={0.5 * (1 - age) * (1 - arrive * 0.5)} />; });
  const wave = prog(f, dur * 0.5, dur * 0.7) * Math.sin(T * 6);
  return <AbsoluteFill><svg width={W} height={H} style={{position: "absolute"}}>
    <defs><linearGradient id="pl-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F2A15C" /><stop offset="0.6" stopColor="#FAD7A0" /><stop offset="1" stopColor="#FFF0CF" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#pl-sky)" /><circle cx={1500} cy={300} r={130} fill="#FFF4D2" opacity={0.85} />
    <path d="M0 560 C 400 500 800 580 1200 530 S 1700 520 1920 560 V760 H0 Z" fill="#B88A55" opacity={0.7} />
    <rect x={0} y={760} width={W} height={320} fill="#7D5A3A" /><rect x={0} y={740} width={W} height={26} fill="#4A3424" />
    <rect x={1100} y={420} width={620} height={330} fill="#8E5E3E" /><path d="M1070 420 H1750 L1700 360 H1120 Z" fill="#5C3A26" />{[0, 1, 2].map((i) => <rect key={i} x={1160 + i * 190} y={500} width={110} height={150} fill="#F6D58C" opacity={0.85} />)}
    <g><rect x={tx} y={560} width={1960} height={180} rx={16} fill="#2A3470" />{Array.from({length: 14}, (_, i) => <rect key={i} x={tx + 30 + i * 140} y={590} width={92} height={64} rx={8} fill={C.gold} opacity={0.88} />)}<rect x={tx + 1860} y={510} width={110} height={230} rx={20} fill="#1B2250" /><rect x={tx + 1870} y={470} width={36} height={60} fill="#1B2250" />
      <circle cx={tx + 1900} cy={760} r={34} fill="#10173D" /><circle cx={tx + 1700} cy={760} r={34} fill="#10173D" /></g>{steam}
    <Person x={860} y={740} s={1.7} color="#EDE3CF" skin="#C98F58" /><Person x={980} y={740} s={1.7} color="#D9CBB0" skin="#C98F58" arm={wave} />
    <rect x={800} y={690} width={90} height={50} rx={6} fill="#6E402B" /><rect x={806} y={684} width={78} height={12} fill="#9C6A43" />
  </svg></AbsoluteFill>;
};

// ---------- apprenticeship: rows of match sticks swing into a tray; months tick by on the wall ----------
export const Workshop: React.FC<SceneProps> = ({f, dur}) => {
  const T = sec(f), months = Math.floor(prog(f, 20, dur - 30, easeIO) * 8) + 1;
  return <AbsoluteFill><svg width={W} height={H} style={{position: "absolute"}}>
    <defs><linearGradient id="ws-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4A2C1E" /><stop offset="1" stopColor="#2A1810" /></linearGradient><radialGradient id="ws-l"><stop offset="0" stopColor="#FFD58A" stopOpacity="0.55" /><stop offset="1" stopColor="#FFD58A" stopOpacity="0" /></radialGradient></defs>
    <rect width={W} height={H} fill="url(#ws-w)" /><circle cx={960} cy={150} r={700} fill="url(#ws-l)" />
    <rect x={0} y={800} width={W} height={280} fill="#1D100A" /><rect x={260} y={760} width={1400} height={56} rx={10} fill="#8B5A3A" />
    {Array.from({length: 8}, (_, m) => <g key={m} transform={`translate(${1260 + (m % 4) * 130} ${150 + Math.floor(m / 4) * 120})`}><rect width={112} height={96} rx={10} fill={m < months ? C.cream : "none"} stroke={C.cream} strokeWidth={4} opacity={m < months ? 0.95 : 0.35} transform={`scale(${m < months ? sp(f, 20 + m * 30, 14, 140) : 1})`} /></g>)}
    {Array.from({length: 9}, (_, i) => { const x = 380 + i * 135, ph = T * 1.4 + i * 0.35, ang = Math.sin(ph) * 28 - 6, dip = Math.max(0, Math.sin(ph)), head = dip > 0.6 ? C.red : "#EAD7A8";
      return <g key={i} transform={`translate(${x} 520) rotate(${ang})`}><rect x={-6} y={0} width={12} height={200} rx={3} fill="#D9BC7A" /><ellipse cx={0} cy={206} rx={11} ry={16} fill={head} /></g>; })}
    <rect x={340} y={742} width={1280} height={34} rx={8} fill="#2C1F3D" /><rect x={340} y={742} width={1280} height={10} fill={C.red} opacity={0.55} />
    <Person x={300} y={800} s={2.1} color="#EFE6D2" skin="#C98F58" arm={0.4} /><Person x={1660} y={800} s={2.1} color="#C9BFA8" skin="#B97C48" flip arm={0.2} />
  </svg></AbsoluteFill>;
};

// ---------- heavy machines: meshed gears turn, coins drain away, a price tag drops and bounces, a cross stamps in ----------
export const Machines: React.FC<SceneProps> = ({f, dur, p = {}}) => {
  const T = sec(f), w = (f / FPS) * 1.1, Gear: React.FC<{cx: number; cy: number; r: number; teeth: number; rot: number; col: string}> = ({cx, cy, r, teeth, rot, col}) => {
    const pts: string[] = []; for (let i = 0; i < teeth * 2; i++) { const a = (i / (teeth * 2)) * Math.PI * 2 + rot, rr = i % 2 ? r : r + 22; pts.push(`${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`, `${cx + Math.cos(a + 0.5 * Math.PI / teeth) * rr},${cy + Math.sin(a + 0.5 * Math.PI / teeth) * rr}`); }
    return <g><polygon points={pts.join(" ")} fill={col} stroke="#0C1030" strokeWidth={4} /><circle cx={cx} cy={cy} r={r * 0.4} fill="#0C1030" /></g>; };
  const tag = bounceH(sec(f - 70), 700, 3200, 0.38), cross = sp(f, dur * 0.55, 10, 150);
  const coins = Array.from({length: 16}, (_, i) => { const t0 = i * 0.32, t = (T - t0 - 1.2) % 5; if (T < t0 + 1.2 || t < 0) return null; const x = 1180 + (i % 4) * 14 - 20, y = 560 + 0.5 * 900 * t * t; return y < 1040 ? <g key={i} transform={`translate(${x} ${y})`}><circle r={16} fill={C.gold} stroke="#B8801F" strokeWidth={3} /><line x1={-6} y1={0} x2={6} y2={0} stroke="#B8801F" strokeWidth={3} /></g> : null; });
  return <AbsoluteFill><svg width={W} height={H} style={{position: "absolute"}}>
    <rect width={W} height={H} fill="#16193F" /><rect y={820} width={W} height={260} fill="#0B0D24" />
    <rect x={520} y={300} width={760} height={520} rx={24} fill="#2A3470" stroke="#10173D" strokeWidth={6} /><rect x={560} y={340} width={680} height={140} rx={14} fill="#10173D" />
    <Gear cx={700} cy={620} r={92} teeth={10} rot={w} col="#8FA3C8" /><Gear cx={700 + 92 * 2 + 28} cy={620} r={68} teeth={7} rot={-w * (10 / 7) + 0.22} col="#6C81B0" /><Gear cx={1010} cy={440} r={44} teeth={5} rot={w * 1.8} col="#B9C6E4" />
    <rect x={1280} y={560} width={80} height={30} fill="#3B4B8A" /><rect x={1160} y={560} width={150} height={26} rx={6} fill="#10173D" />{coins}<ellipse cx={1180} cy={1000} rx={110} ry={20} fill="#05061A" />
    <g transform={`translate(1500 ${770 - tag})`}><g transform="rotate(-8)"><Icon n="tag" s={230} color={C.gold} lit={1} /></g></g>
    <g transform={`translate(900 560) scale(${cross})`} opacity={0.9}><line x1={-300} y1={-230} x2={300} y2={230} stroke={C.red} strokeWidth={26} strokeLinecap="round" /><line x1={300} y1={-230} x2={-300} y2={230} stroke={C.red} strokeWidth={26} strokeLinecap="round" /></g>
    <g opacity={0.5}>{[0, 1, 2, 3].map((i) => <circle key={i} cx={560 + i * 190} cy={250 - ((T * 60 + i * 40) % 180) * 0.7} r={14 + ((T * 60 + i * 40) % 180) / 8} fill="#C9D3F2" opacity={1 - ((T * 60 + i * 40) % 180) / 180} />)}</g>
  </svg></AbsoluteFill>;
};

// ---------- hand network: a factory in the middle, houses around it; boxes of work travel out and back; farms sit dry ----------
export const Hands: React.FC<SceneProps> = ({f, dur, spans, p = {}}) => {
  const T = sec(f), cx = 960, cy = 540, N = 9, r = rnd(4), homes = Array.from({length: N}, (_, i) => { const a = (i / N) * Math.PI * 2 + 0.3, rr = 330 + (i % 3) * 70; return {x: cx + Math.cos(a) * rr * 1.45, y: cy + Math.sin(a) * rr * 0.85, ph: r() * 6}; });
  const build = prog(f, 10, dur * 0.5, easeOut), farms = p.farmsAt !== undefined ? prog(f, spans[p.farmsAt]?.s ?? 0, (spans[p.farmsAt]?.s ?? 0) + 40, easeOut) : 0, kit = p.mode === "kitchens";
  return <AbsoluteFill><svg width={W} height={H} style={{position: "absolute"}}>
    <defs><radialGradient id="hn-g" cx="0.5" cy="0.5" r="0.7"><stop offset="0" stopColor="#E6B26A" /><stop offset="1" stopColor="#A06A36" /></radialGradient></defs>
    <rect width={W} height={H} fill="url(#hn-g)" />
    {homes.map((h, i) => Array.from({length: 4}, (_, k) => <g key={i + "f" + k} opacity={0.9 * (p.farmsAt !== undefined ? farms : 0.8)} transform={`translate(${h.x + (k - 1.5) * 70 - 40} ${h.y + 70 + (k % 2) * 16})`}><rect width={58} height={30} fill="#8E5B33" stroke="#5B3820" strokeWidth={2} /><path d="M6 8 l14 6 l10 -6 M30 20 l12 -5" stroke="#3A2013" strokeWidth={2} fill="none" /></g>))}
    {homes.map((h, i) => <path key={"p" + i} d={`M${cx} ${cy} Q${(cx + h.x) / 2 + 40} ${(cy + h.y) / 2 - 40} ${h.x} ${h.y}`} stroke="#5B3820" strokeWidth={6} strokeDasharray="2 14" strokeLinecap="round" fill="none" opacity={build} />)}
    {homes.map((h, i) => { const t = ((T * 0.22 + i * 0.13) % 1), out = t < 0.5, k = out ? easeIO(t * 2) : easeIO(1 - (t - 0.5) * 2), q = bez([cx, cy], [(cx + h.x) / 2 + 40, (cy + h.y) / 2 - 40], [h.x, h.y], k);
      return build > 0.8 ? <rect key={"b" + i} x={q[0] - 12} y={q[1] - 12} width={24} height={24} rx={4} fill={out ? C.cream : C.red} stroke="#3A2013" strokeWidth={3} /> : null; })}
    {homes.map((h, i) => { const s = sp(f, 14 + i * 5, 12, 150); return <g key={"h" + i} transform={`translate(${h.x} ${h.y}) scale(${s})`}>
      <path d="M-46 8 L0 -34 L46 8 Z" fill="#4A2C1E" /><rect x={-36} y={8} width={72} height={52} fill="#7A4B2B" /><rect x={-9} y={26} width={18} height={34} fill="#2B1810" />
      <g transform={`translate(34 40)`}><rect x={-14} y={-8 + Math.sin(T * 5 + h.ph) * 3} width={26} height={10} rx={5} fill={C.cream} transform={`rotate(${Math.sin(T * 5 + h.ph) * 8})`} /></g>
      {kit && Array.from({length: 3}, (_, k) => { const age = ((T * 0.6 + k / 3 + h.ph) % 1); return <circle key={k} cx={-8 + age * 18} cy={-40 - age * 60} r={8 + age * 14} fill="#fff" opacity={0.45 * (1 - age)} />; })}</g>; })}
    <g transform={`translate(${cx} ${cy}) scale(${sp(f, 4, 14, 120)})`}><rect x={-120} y={-30} width={240} height={110} rx={10} fill="#2A3470" /><path d="M-120 -30 l50 -44 v44 l50 -44 v44 l50 -44 v44 l50 -44 v44" fill="#2A3470" /><rect x={70} y={-130} width={26} height={110} fill="#2A3470" /><rect x={-80} y={0} width={44} height={40} fill={C.gold} opacity={0.85} /></g>
  </svg></AbsoluteFill>;
};

// ---------- the spinning wheel: spin-up with inertia, thread drawn out ----------
export const Charkha: React.FC<SceneProps> = ({f, dur}) => {
  const T = sec(f), omega = 8 * (1 - Math.exp(-T * 0.9)), ang = omega * T * 40 / 8 * 8 / 8, cx = 900, cy = 560, R = 260;
  const rot = ((1 - Math.exp(-T * 0.9)) * T * 5 + (T * 5) * 0) * 57.3 * 0.18 + T * 90;
  return <AbsoluteFill><svg width={W} height={H} style={{position: "absolute"}}>
    <defs><linearGradient id="ch-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F3C98B" /><stop offset="1" stopColor="#C58A4A" /></linearGradient></defs><rect width={W} height={H} fill="url(#ch-bg)" />
    <rect y={860} width={W} height={220} fill="#6E402B" />
    <path d={`M${cx - 330} 860 L${cx - 60} 560 L${cx + 330} 860`} stroke="#4A2C1E" strokeWidth={26} fill="none" strokeLinecap="round" /><rect x={cx - 380} y={845} width={760} height={30} rx={8} fill="#4A2C1E" />
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`}><circle r={R} fill="none" stroke="#4A2C1E" strokeWidth={22} />{Array.from({length: 12}, (_, i) => <line key={i} x1={0} y1={0} x2={Math.cos((i * Math.PI) / 6) * R} y2={Math.sin((i * Math.PI) / 6) * R} stroke="#4A2C1E" strokeWidth={9} />)}<circle r={34} fill="#2B1810" /></g>
    <line x1={cx + R * 0.96} y1={cy + 14} x2={1480} y2={440} stroke="#FFF" strokeWidth={4} opacity={0.9} /><g transform="translate(1480 440) rotate(-8)"><rect x={-10} y={-90} width={20} height={180} rx={6} fill="#EAD7A8" /><ellipse cx={0} cy={-90} rx={34} ry={14} fill="#fff" opacity={0.9 * prog(f, 40, 140)} /></g>
    {Array.from({length: 12}, (_, i) => { const age = ((T * 0.5 + i / 12) % 1); return <circle key={i} cx={1530 + age * 160} cy={400 - age * 140 + Math.sin(age * 9 + i) * 14} r={5 + age * 3} fill="#fff" opacity={0.7 * (1 - age)} />; })}
    <Person x={440} y={870} s={2.2} color="#F4EAD3" skin="#B97C48" arm={0.6} />
  </svg></AbsoluteFill>;
};

// ---------- two rival labels meet in the middle (a squirrel and a crow): elastic bump, then both settle ----------
export const RivalLabels: React.FC<SceneProps> = ({f, dur}) => {
  const k = prog(f, 20, 100, easeIn), hit = 104, e = f < hit ? 0 : Math.exp(-(f - hit) * 0.07) * Math.cos((f - hit) * 0.5), L = lerp(-560, 428, k) - e * 40, Rr = lerp(1960, 972, k) + e * 40;
  const Label: React.FC<{x: number; col: string; children: React.ReactNode}> = ({x, col, children}) => <g transform={`translate(${x - (x > 960 ? 1010 : 0)} 300)`}><rect width={520} height={520} rx={24} fill={col} stroke="#fff" strokeWidth={8} />{children}</g>;
  const bump = f >= hit ? Math.exp(-(f - hit) * 0.12) : 0;
  return <AbsoluteFill><Sky f={f} top="#1A1240" mid="#3A1C5C" bot="#8A3A6A" stars={40} /><svg width={W} height={H} style={{position: "absolute"}}>
    <g transform={`translate(${L} 270)`}><rect width={520} height={520} rx={24} fill="#E9A23B" stroke="#fff" strokeWidth={8} />
      <ellipse cx={230} cy={330} rx={120} ry={90} fill="#9E5B22" /><circle cx={250} cy={210} r={64} fill="#B86A28" /><path d="M170 360 C 40 330 20 150 120 100 C 80 200 170 230 190 300" fill="#C97A2F" stroke="#7A4216" strokeWidth={4} /><circle cx={270} cy={196} r={9} fill="#111" /><path d="M222 160 l-8 -48 l36 30 Z" fill="#B86A28" /></g>
    <g transform={`translate(${Rr} 270)`}><rect width={520} height={520} rx={24} fill="#3FA7A1" stroke="#fff" strokeWidth={8} />
      <ellipse cx={270} cy={340} rx={130} ry={80} fill="#10131F" /><circle cx={200} cy={240} r={62} fill="#10131F" /><path d="M146 240 L76 262 L148 276 Z" fill="#E9A23B" /><circle cx={186} cy={226} r={9} fill="#fff" /><path d="M360 330 L470 390 L330 392 Z" fill="#0B0D18" /></g>
    {bump > 0.02 && <Sparks f={f} b={{x: 960, y: 520, t0: hit / FPS, n: 26, speed: 380, g: 600, k: 2, life: 0.9, colors: [C.gold, "#fff", C.flame], size: 3.2, seed: 5}} />}
  </svg></AbsoluteFill>;
};
