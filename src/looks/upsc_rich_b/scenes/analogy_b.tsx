// Look B analogy art, part B: breeze (day / night), roundabout, pot. Same logic as the cartoon scenes, drawn as rich daylight illustration.
import React from "react";
import {Girl} from "../girl";
import {SANS, W, H, eo, rng} from "../kit";
import {Cloud, FlowArrow, Hills, LabelCard, Shimmer, Sun, prog, type AP, type Pt} from "./analogy_kit";

const lab = (p: AP, i: number) => { const l = p.spec.labels?.[i]; return l ? {text: l.text, at: p.at(l.key)} : null; };
const Sky: React.FC<{id: string; stops: [number, string][]}> = ({id, stops}) => (
  <g><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">{stops.map(([o, c], i) => <stop key={i} offset={o} stopColor={c}/>)}</linearGradient></defs><rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id})`}/></g>
);

// ---- breeze --------------------------------------------------------------------------------------------------------------------
const Palm: React.FC<{x: number; y: number; h: number; f: number; lean: number; seed: number; night: boolean}> = ({x, y, h, f, lean, seed, night}) => {
  const sway = Math.sin(f / 24 + seed) * 2.5 + lean * 3, tx = lean * 16 + sway * 1.6, ty = -h;
  const green = night ? ["#1d4a3c", "#2f6a52"] : ["#2f7a3c", "#7cc060"];
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={30} cy={4} rx={90} ry={12} fill="#2a1808" opacity={0.25}/>
      <path d={`M-12,0 Q${tx * 0.2 - 8},${ty * 0.55} ${tx - 7},${ty} L${tx + 7},${ty} Q${tx * 0.2 + 12},${ty * 0.55} 14,0 Z`} fill="#8a6a45" stroke="#4e3820" strokeWidth={1.6}/>
      <path d={`M2,0 Q${tx * 0.2 + 6},${ty * 0.55} ${tx + 3},${ty} L${tx + 7},${ty} Q${tx * 0.2 + 12},${ty * 0.55} 14,0 Z`} fill="#4e3820" opacity={0.35}/>
      {Array.from({length: 11}, (_, i) => { const u = (i + 1) / 12, px = tx * u * u * 0.9, py = ty * u; return <path key={i} d={`M${px - 10 + u * 4},${py} q10,5 20,0`} stroke="#4e3820" strokeWidth={1.4} fill="none" opacity={0.55}/>; })}
      <g transform={`translate(${tx} ${ty})`}>
        {Array.from({length: 9}, (_, i) => {
          const a = -192 + i * 25 + Math.sin(f / (15 + i) + seed + i) * 2.4 + sway * 0.7, len = 128 + (i % 3) * 22;
          return (
            <g key={i} transform={`rotate(${a})`}>
              <path d={`M0,0 Q${len * 0.5},${-len * 0.3} ${len},${len * 0.18} Q${len * 0.5},${-len * 0.06} 0,0 Z`} fill={green[0]} stroke={night ? "#12332a" : "#1d5128"} strokeWidth={1}/>
              <path d={`M0,0 Q${len * 0.5},${-len * 0.22} ${len},${len * 0.18} Q${len * 0.5},${-len * 0.12} 0,0 Z`} fill={green[1]} opacity={0.85}/>
              <path d={`M0,0 Q${len * 0.5},${-len * 0.18} ${len},${len * 0.18}`} stroke={night ? "#12332a" : "#1d5128"} strokeWidth={1.4} fill="none"/>
            </g>
          );
        })}
        <circle cx={-6} cy={6} r={7} fill="#6b4a2c"/><circle cx={7} cy={8} r={7} fill="#5a3d22"/>
      </g>
    </g>
  );
};

const Breeze: React.FC<AP> = (p) => {
  const {f, spec} = p;
  if (spec.time !== "day" && spec.time !== "night") throw new Error('analogy breeze: spec.time must be "day" or "night"');
  const night = spec.time === "night", seaY = 650, warm = ["#ee7a2c", "#ffbe6a"], cool = ["#2f78c8", "#8fc0ee"];
  const g = (a: number, d: number) => eo(prog(f, a, d));
  const low: Pt[] = night ? [[1260, 548], [1000, 548], [700, 552], [470, 548]] : [[470, 548], [700, 552], [1000, 548], [1260, 548]];
  const high: Pt[] = night ? [[470, 246], [700, 232], [1000, 232], [1260, 246]] : [[1260, 246], [1000, 232], [700, 232], [470, 246]];
  const landUp: Pt[] = night ? [[1335, 270], [1345, 400], [1335, 520]] : [[1335, 520], [1345, 400], [1335, 270]];
  const seaUp: Pt[] = night ? [[405, 520], [395, 400], [405, 270]] : [[405, 270], [395, 400], [405, 520]];
  const landC = night ? cool : warm, seaC = night ? warm : cool;
  const stars = Array.from({length: 46}, (_, i) => { const r = rng(i * 13 + 5); return {x: r() * W, y: r() * 420, s: 1 + r() * 2.2, ph: r() * 6.28}; });
  const lean = night ? -0.8 : 1.7;
  return (
    <g>
      {night
        ? <Sky id="ak-b-sky" stops={[[0, "#0c1436"], [0.5, "#26356f"], [0.8, "#4a5a96"]]}/>
        : <Sky id="ak-b-sky" stops={[[0, "#78b9e4"], [0.55, "#bfe0ee"], [0.8, "#fdebc4"]]}/>}
      {night
        ? <g>{stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#fff4d6" opacity={0.45 + 0.5 * Math.sin(f / 12 + s.ph) ** 2}/>)}
          <g transform="translate(1530 240)"><defs><mask id="ak-b-moon"><circle r={64} fill="#fff"/><circle cx={26} cy={-16} r={54} fill="#000"/></mask></defs>
            <circle r={150} fill="#cfd8ff" opacity={0.2} filter="url(#ak-blur22)"/><circle r={64} fill="#fff4d6" mask="url(#ak-b-moon)"/></g></g>
        : <g><Sun x={1530} y={240} r={54} f={f}/><Cloud x={160} y={140} s={0.85} f={f} speed={0.25} seed={2}/><Cloud x={900} y={90} s={0.6} f={f} speed={0.18} seed={5} a={0.8}/></g>}
      <Hills id="ak-b-h1" base={seaY - 40} amp={110} top={night ? "#2c3a78" : "#b4cbe0"} bottom={night ? "#38487f" : "#d2dede"} seed={5.2} wl={420}/>
      {/* sea */}
      <defs>
        <linearGradient id="ak-b-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={night ? "#2e4f98" : "#57b3dd"}/><stop offset="1" stopColor={night ? "#16275a" : "#1c6aa6"}/></linearGradient>
        <linearGradient id="ak-b-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={night ? "#9aa4c8" : "#f3d691"}/><stop offset="1" stopColor={night ? "#4e5a86" : "#c8964e"}/></linearGradient>
      </defs>
      <path d={`M-40,${seaY} L960,${seaY} L960,${H + 40} L-40,${H + 40} Z`} fill="url(#ak-b-sea)"/>
      {night && <ellipse cx={560} cy={seaY + 40} rx={170} ry={14} fill="#fff4d6" opacity={0.25} filter="url(#ak-blur8)"/>}
      {Array.from({length: 7}, (_, r) => Array.from({length: 5}, (_, c) => { const x = 40 + c * 210 + (r % 2) * 100 + ((f * 0.6 + r * 17) % 210), y = seaY + 24 + r * 46; return x < 920 ? <path key={`${r}-${c}`} d={`M${x},${y} q25,-${10 + r} 50,0 q25,${10 + r} 50,0`} fill="none" stroke="#f1fbff" strokeWidth={2.4 + r * 0.25} strokeLinecap="round" opacity={0.5 - r * 0.04}/> : null; }))}
      {/* sand, wet edge and dunes */}
      <path d={`M900,${seaY + 4} Q1010,${seaY - 62} 1140,${seaY - 62} L${W + 40},${seaY - 62} L${W + 40},${H + 40} L900,${H + 40} Z`} fill="url(#ak-b-sand)"/>
      <path d={`M900,${seaY + 4} Q1010,${seaY - 62} 1140,${seaY - 62}`} fill="none" stroke={night ? "#d8defa" : "#fff6dc"} strokeWidth={6} opacity={0.7}/>
      <path d={`M1140,${seaY - 62} Q1500,${seaY - 120} 1900,${seaY - 70}`} fill="none" stroke={night ? "#6a76a8" : "#e0b46a"} strokeWidth={2} opacity={0.6}/>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <ellipse key={i} cx={1060 + i * 140} cy={870 + (i % 3) * 48} rx={10 + (i % 2) * 6} ry={5} fill={night ? "#6a76a8" : "#b8864a"} opacity={0.7}/>)}
      {!night && [0, 1, 2, 3, 4].map((i) => <Shimmer key={i} x={1220 + i * 110} y={seaY - 68} hgt={120} f={f} k={i * 0.21} col="#e0561f" w={4}/>)}
      {/* boat */}
      <g transform={`translate(270 ${seaY + 10 + Math.sin(f / 14) * 6}) rotate(${Math.sin(f / 18) * 2.2})`}>
        <path d="M-84,0 L84,0 L58,44 L-58,44 Z" fill="#b8402a" stroke="#6e2412" strokeWidth={2}/><path d="M-84,0 L84,0 L80,9 L-80,9 Z" fill="#f0d8a8"/>
        <path d="M0,-4 L0,-170" stroke="#6b4a2c" strokeWidth={6} strokeLinecap="round"/>
        <path d={night ? "M-5,-166 Q-74,-100 -5,-22 Z" : "M5,-166 Q76,-100 5,-22 Z"} fill="#fdf6e4" stroke="#bfae8a" strokeWidth={1.6}/>
        {night && <g><circle cx={-70} cy={-22} r={44} fill="#ffd27a" opacity={0.35} filter="url(#ak-blur8)"/><circle cx={-70} cy={-22} r={7} fill="#fff1b8"/></g>}
      </g>
      <Palm x={1790} y={seaY + 190} h={400} f={f} lean={lean} seed={2} night={night}/>
      <Palm x={1400} y={seaY + 60} h={280} f={f} lean={lean} seed={5} night={night}/>
      <g transform="translate(1590 900) scale(0.5)" style={{filter: night ? "brightness(0.66) saturate(0.8) hue-rotate(10deg)" : undefined}}>
        <ellipse cx={30} cy={4} rx={150} ry={22} fill="#2a1808" opacity={0.28}/><Girl f={f} id="ak-b-g"/>
      </g>
      <FlowArrow pts={low} f={f} p={g(6, 40)} w={26} c1={cool[0]} c2={cool[1]} speed={1.5}/>
      <FlowArrow pts={landUp} f={f} p={g(20, 54)} w={26} c1={landC[0]} c2={landC[1]} speed={1.5}/>
      <FlowArrow pts={high} f={f} p={g(36, 70)} w={26} c1={warm[0]} c2={warm[1]} speed={1.5}/>
      <FlowArrow pts={seaUp} f={f} p={g(52, 86)} w={26} c1={seaC[0]} c2={seaC[1]} speed={1.5}/>
    </g>
  );
};
const BreezeLabels: React.FC<AP> = (p) => { const l = lab(p, 0); return l ? <LabelCard cx={880} y={84} text={l.text} f={p.f} at={l.at} size={42} maxW={1000} tone={p.spec.time === "night" ? "dark" : "warm"}/> : null; };

// ---- roundabout -----------------------------------------------------------------------------------------------------------------
const OMEGA = 0.0095, R = 208, T_ROLL = 140, GR = 328, CY = 440, CXL = 520, CXR = 1400;
const rot = (x: number, y: number, a: number): Pt => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
const ballWorld = (t: number): Pt => [0, R * 0.86 - R * 1.72 * Math.min(1, t / T_ROLL)];
const RIDERS: [number, string, string, string][] = [[0, "#2f78c8", "#e0b48a", "#2b1d14"], [130, "#3f9a52", "#a9744a", "#1a120d"], [235, "#c0402a", "#d8a47a", "#3a2a1c"], [305, "#7e4fb0", "#c68f64", "#1a120d"]];
const TopPerson: React.FC<{shirt: string; skin: string; hair: string; s?: number}> = ({shirt, skin, hair, s = 1}) => (
  <g transform={`scale(${s})`}>
    <ellipse cx={0} cy={4} rx={30} ry={20} fill="#000" opacity={0.18}/>
    <ellipse cx={0} cy={0} rx={29} ry={18} fill={shirt} stroke="#00000033" strokeWidth={1.4}/>
    <ellipse cx={-6} cy={-4} rx={18} ry={8} fill="#fff" opacity={0.18}/>
    <circle cx={0} cy={-2} r={14} fill={skin}/><path d="M-14,-4 Q0,-24 14,-4 Q0,-12 -14,-4 Z" fill={hair}/><ellipse cx={0} cy={-12} rx={9} ry={5} fill={hair}/>
  </g>
);
const Disc: React.FC = () => (
  <g>
    <defs>
      <radialGradient id="ak-rb-d" cx="42%" cy="38%" r="75%"><stop offset="0" stopColor="#f4efe2"/><stop offset="0.7" stopColor="#d9d1bd"/><stop offset="1" stopColor="#a89f88"/></radialGradient>
      <radialGradient id="ak-rb-hub" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#ff8a66"/><stop offset="1" stopColor="#a02818"/></radialGradient>
    </defs>
    <circle r={R + 16} fill="#2a1a10" opacity={0.3} transform="translate(8 10)"/>
    <circle r={R + 12} fill="#6b6a64"/>
    <circle r={R} fill="url(#ak-rb-d)"/>
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M0,0 L${R * Math.cos(i * Math.PI / 3)},${R * Math.sin(i * Math.PI / 3)} A${R},${R} 0 0 1 ${R * Math.cos((i + 1) * Math.PI / 3)},${R * Math.sin((i + 1) * Math.PI / 3)} Z`} fill={i % 2 ? "#e8b13e" : "#3f78c2"} opacity={0.5}/>)}
    <circle r={R} fill="none" stroke="#fff" strokeWidth={4} opacity={0.5}/>
    <circle r={R * 0.58} fill="none" stroke="#5a5a56" strokeWidth={5} opacity={0.6}/>
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M0,0 L${(R * 0.58) * Math.cos(i * Math.PI / 3 + 0.5)},${(R * 0.58) * Math.sin(i * Math.PI / 3 + 0.5)}`} stroke="#5a5a56" strokeWidth={5} strokeLinecap="round" opacity={0.7}/>)}
    {RIDERS.map(([a, sh, sk, hr], i) => { const k = R * 0.78, x = Math.sin(a * Math.PI / 180) * k, y = -Math.cos(a * Math.PI / 180) * k; return <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}><TopPerson shirt={sh} skin={sk} hair={hr} s={0.86}/></g>; })}
    <circle r={34} fill="url(#ak-rb-hub)" stroke="#5a1a0c" strokeWidth={3}/><circle cx={-9} cy={-9} r={9} fill="#fff" opacity={0.45}/>
  </g>
);
const World: React.FC = () => (
  <g>
    {Array.from({length: 10}, (_, i) => i).map((i) => {
      const a = i * 36 + 18; if (a > 340 || a < 20) return null;
      return <g key={i} transform={`rotate(${a}) translate(0 -${R + 70})`}><circle cx={7} cy={8} r={30} fill="#000" opacity={0.2}/><circle r={30} fill="#2f6b3c"/><circle cx={-4} cy={-5} r={22} fill="#4e9a4a"/><circle cx={-9} cy={-10} r={11} fill="#8cc460" opacity={0.85}/></g>;
    })}
    <g transform={`translate(0 ${R + 56})`}><TopPerson shirt="#2f78c8" skin="#e0b48a" hair="#2b1d14" s={1}/></g>
  </g>
);
const Ball: React.FC<{x: number; y: number; o: number}> = ({x, y, o}) => (
  <g opacity={o}><ellipse cx={x + 5} cy={y + 8} rx={16} ry={9} fill="#000" opacity={0.25}/><circle cx={x} cy={y} r={16} fill="#fff" stroke="#c0402a" strokeWidth={3}/><path d={`M${x - 14},${y - 3} Q${x},${y - 10} ${x + 14},${y - 3} M${x - 14},${y + 4} Q${x},${y + 12} ${x + 14},${y + 4}`} stroke="#c0402a" strokeWidth={2.4} fill="none"/><circle cx={x - 5} cy={y - 6} r={4} fill="#fff" opacity={0.8}/></g>
);
const Round: React.FC<AP> = ({f}) => {
  const tNow = Math.min(f, T_ROLL), fade = 1 - eo(prog(f, T_ROLL + 40, 20)), theta = OMEGA * f, cw = (a: number) => (a * 180) / Math.PI;
  const bw = ballWorld(tNow), trail: Pt[] = [];
  for (let k = 0; k <= 48; k++) { const t = (tNow * k) / 48, w = ballWorld(t); trail.push(rot(w[0], w[1], OMEGA * t)); }
  const bd = rot(bw[0], bw[1], theta), trailPath = trail.map((q, i) => `${i ? "L" : "M"}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");
  const arc: Pt[] = [-50, -72, -92, -112, -134].map((a) => [Math.cos((a * Math.PI) / 180) * (R + 44), Math.sin((a * Math.PI) / 180) * (R + 44)] as Pt);
  const aim = <path d={`M0,${R * 0.86} L0,${-R * 0.86}`} stroke="#3a2a1a" strokeWidth={3} strokeDasharray="3 14" strokeLinecap="round" opacity={0.6}/>;
  const Lawn = ({cx}: {cx: number}) => (
    <g>
      <circle cx={cx + 10} cy={CY + 16} r={GR} fill="#2a1808" opacity={0.28}/>
      <circle cx={cx} cy={CY} r={GR + 12} fill="#d8c8a0" stroke="#8e7c62" strokeWidth={2}/>
      <circle cx={cx} cy={CY} r={GR} fill="url(#ak-rb-lawn)"/>
      {[0.5, 0.64, 0.78, 0.92].map((k, i) => <circle key={i} cx={cx} cy={CY} r={GR * k} fill="none" stroke={i % 2 ? "#6fb25a" : "#a8d880"} strokeWidth={18} opacity={0.25}/>)}
    </g>
  );
  return (
    <g>
      <rect x={-40} y={-40} width={W + 80} height={H + 80} fill="#efe3c6"/>
      <defs><radialGradient id="ak-rb-lawn" cx="40%" cy="35%" r="80%"><stop offset="0" stopColor="#a8d880"/><stop offset="1" stopColor="#4e9a4a"/></radialGradient>
        <clipPath id="ak-rb-cl"><circle cx={CXL} cy={CY} r={GR}/></clipPath><clipPath id="ak-rb-cr"><circle cx={CXR} cy={CY} r={GR}/></clipPath></defs>
      <Lawn cx={CXL}/><Lawn cx={CXR}/>
      <g clipPath="url(#ak-rb-cl)"><g transform={`translate(${CXL} ${CY})`}>
        <World/>
        <g transform={`rotate(${-cw(theta)})`}><Disc/></g>
        {aim}<Ball x={bw[0]} y={bw[1]} o={fade}/>
        <FlowArrow pts={arc} f={f} p={eo(prog(f, 6, 30))} w={14} c1="#2f78c8" c2="#8fc0ee" speed={1.2}/>
      </g></g>
      <g clipPath="url(#ak-rb-cr)"><g transform={`translate(${CXR} ${CY})`}>
        <g transform={`rotate(${cw(theta)})`}><World/></g>
        <Disc/>
        {aim}
        <path d={trailPath} fill="none" stroke="#fff" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" opacity={0.7}/>
        <path d={trailPath} fill="none" stroke="#c0402a" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round"/>
        <Ball x={bd[0]} y={bd[1]} o={fade}/>
      </g></g>
    </g>
  );
};
const Tag: React.FC<{cx: number; y: number; text: string; a: number}> = ({cx, y, text, a}) => (
  <div style={{position: "absolute", left: cx - 300, width: 600, top: y, textAlign: "center", opacity: a}}>
    <span style={{display: "inline-block", padding: "9px 24px", borderRadius: 30, background: "rgba(255,250,238,.88)", border: "1.2px solid rgba(150,90,40,.35)", boxShadow: "0 10px 22px -12px rgba(40,22,8,.55)",
      fontFamily: SANS, fontWeight: 800, fontSize: 21, letterSpacing: "0.17em", color: "#6a3a1c"}}>{text}</span>
  </div>
);
const RoundLabels: React.FC<AP> = ({f}) => <><Tag cx={CXL} y={CY + GR + 22} text="SEEN FROM THE GROUND" a={eo(prog(f, 10, 16))}/><Tag cx={CXR} y={CY + GR + 22} text="SEEN FROM THE ROUNDABOUT" a={eo(prog(f, 22, 16))}/></>;

// ---- pot ------------------------------------------------------------------------------------------------------------------------
const Pot: React.FC<AP> = ({f}) => {
  const cx = 800, top = 262, bot = 640, g1 = eo(prog(f, 14, 46)), g2 = eo(prog(f, 40, 46));
  const orange: Pt[] = [[cx + 8, 620], [cx + 8, 500], [cx + 46, 396], [cx + 160, 352], [cx + 262, 390]];
  const blue: Pt[] = [[cx + 282, 440], [cx + 292, 540], [cx + 252, 620], [cx + 170, 640], [cx + 118, 640]];
  const mir = (a: Pt[]): Pt[] => a.map(([x, y]) => [2 * cx - x, y] as Pt);
  const flame = (x: number, s: number, ph: number) => (
    <g transform={`translate(${x} 722) scale(${s * (1 + Math.sin(f / 3 + ph) * 0.07)} ${s * (1 + Math.sin(f / 2.3 + ph) * 0.13)})`}>
      <ellipse cx={0} cy={-40} rx={70} ry={80} fill="#ffb347" opacity={0.28} filter="url(#ak-blur8)"/>
      <path d="M0,0 C-44,-8 -42,-62 -5,-108 C-3,-72 18,-72 20,-98 C56,-54 46,-8 0,0 Z" fill="#ee7a2c"/>
      <path d="M0,-4 C-28,-8 -26,-46 -2,-80 C0,-56 12,-56 14,-72 C38,-40 30,-8 0,-4 Z" fill="#ffc94a"/>
      <path d="M0,-6 C-12,-8 -12,-26 0,-42 C12,-26 12,-8 0,-6 Z" fill="#fff3bf"/>
    </g>
  );
  const body = `M${cx - 400},${top} L${cx + 400},${top} L${cx + 372},${bot} Q${cx + 362},${bot + 34} ${cx + 312},${bot + 34} L${cx - 312},${bot + 34} Q${cx - 362},${bot + 34} ${cx - 372},${bot} Z`;
  return (
    <g>
      {/* kitchen wall with tiles and window light */}
      <defs>
        <linearGradient id="ak-p-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4e2bc"/><stop offset="1" stopColor="#e0c08a"/></linearGradient>
        <pattern id="ak-p-tile" width="96" height="96" patternUnits="userSpaceOnUse"><rect width="96" height="96" fill="none" stroke="#b8946a" strokeWidth="2" opacity="0.5"/><path d="M0,0 L96,96 M96,0 L0,96" stroke="#c9a876" strokeWidth="1" opacity="0.3"/></pattern>
        <linearGradient id="ak-p-steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8f9aa6"/><stop offset="0.3" stopColor="#e4eaf0"/><stop offset="0.6" stopColor="#aab4be"/><stop offset="1" stopColor="#6c7681"/></linearGradient>
        <linearGradient id="ak-p-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fd6f2"/><stop offset="1" stopColor="#3f8cc4"/></linearGradient>
        <clipPath id="ak-p-clip"><path d={body}/></clipPath>
      </defs>
      <rect x={-40} y={-40} width={W + 80} height={H + 80} fill="url(#ak-p-wall)"/>
      <rect x={-40} y={-40} width={W + 80} height={760} fill="url(#ak-p-tile)"/>
      <path d="M1180,-40 L1500,-40 L1660,700 L1020,700 Z" fill="#fff3c8" opacity={0.18} style={{mixBlendMode: "screen"}}/>
      <rect x={-40} y={170} width={W + 80} height={10} fill="#b8946a" opacity={0.4}/>
      {/* counter and stove */}
      <rect x={-40} y={742} width={W + 80} height={340} fill="#5a4636"/><rect x={-40} y={742} width={W + 80} height={20} fill="#8a7058"/>
      <rect x={cx - 450} y={690} width={900} height={60} rx={10} fill="#2a2e34" stroke="#12151a" strokeWidth={2}/>
      <rect x={cx - 450} y={690} width={900} height={8} fill="#6a7580" opacity={0.7}/>
      <rect x={cx - 450} y={750} width={900} height={150} fill="url(#ak-p-steel)" stroke="#5a6470" strokeWidth={2}/>
      {[-300, -150, 150, 300].map((dx, i) => <g key={i}><circle cx={cx + dx} cy={822} r={30} fill="#2a2e34" stroke="#12151a" strokeWidth={2}/><circle cx={cx + dx} cy={822} r={22} fill="#59626d"/><path d={`M${cx + dx},${822} L${cx + dx + 14},${810}`} stroke="#f0f4f8" strokeWidth={4} strokeLinecap="round"/></g>)}
      {flame(cx - 190, 0.95, 0)}{flame(cx, 1.12, 2)}{flame(cx + 190, 0.95, 4)}
      <g transform="translate(0 -58)">
      {/* the pot: a glass-sided cut-away so the loops show */}
      <ellipse cx={cx} cy={bot + 52} rx={400} ry={20} fill="#000" opacity={0.28}/>
      <path d={body} fill="#cfe6f4" opacity={0.35}/>
      <g clipPath="url(#ak-p-clip)">
        <rect x={cx - 420} y={top + 36} width={840} height={440} fill="url(#ak-p-water)" opacity={0.92}/>
        <path d={`M${cx - 420},${top + 40 + Math.sin(f / 9) * 3} ${Array.from({length: 9}, (_, i) => `Q${cx - 420 + i * 105 + 52},${top + 22 + Math.sin(f / 7 + i) * 7 + (i % 2) * 9} ${cx - 420 + (i + 1) * 105},${top + 40}`).join(" ")} L${cx + 420},${top + 90} L${cx - 420},${top + 90} Z`} fill="#d8f0fb" opacity={0.7}/>
        {Array.from({length: 9}, (_, i) => { const u = (f * 0.008 + i * 0.125) % 1, bx = cx + Math.sin(i * 2.1 + u * 6) * 40 + (i % 3 - 1) * 16; return <circle key={i} cx={bx} cy={bot - u * (bot - top - 70)} r={7 + (i % 3) * 3} fill="#fff" fillOpacity={0.35} stroke="#fff" strokeOpacity={0.9} strokeWidth={1.6}/>; })}
        <FlowArrow pts={orange} f={f} p={g1} w={24} c1="#ee5a2a" c2="#ffbe6a" speed={1.6}/>
        <FlowArrow pts={blue} f={f} p={g2} w={24} c1="#2f78c8" c2="#8fc0ee" speed={1.6}/>
        <FlowArrow pts={mir(orange)} f={f} p={g1} w={24} c1="#ee5a2a" c2="#ffbe6a" speed={1.6}/>
        <FlowArrow pts={mir(blue)} f={f} p={g2} w={24} c1="#2f78c8" c2="#8fc0ee" speed={1.6}/>
      </g>
      <path d={body} fill="none" stroke="url(#ak-p-steel)" strokeWidth={12} strokeLinejoin="round"/>
      <path d={body} fill="none" stroke="#fff" strokeWidth={3} opacity={0.5} transform="translate(-6 0)"/>
      <rect x={cx - 424} y={top - 16} width={848} height={32} rx={16} fill="url(#ak-p-steel)" stroke="#5a6470" strokeWidth={2}/>
      {[-1, 1].map((sd) => <g key={sd}><path d={`M${cx + sd * 424},${top + 40} q${sd * 84},0 ${sd * 84},58 q0,36 ${sd * -48},38`} fill="none" stroke="#2a2e34" strokeWidth={24} strokeLinecap="round"/><path d={`M${cx + sd * 424},${top + 38} q${sd * 84},0 ${sd * 84},58`} fill="none" stroke="#6a7580" strokeWidth={5} strokeLinecap="round" opacity={0.7}/></g>)}
      {[0, 1, 2].map((i) => { const u = (f * 0.011 + i / 3) % 1; return <path key={i} d={`M${cx - 200 + i * 200},${top - 34 - u * 110} q20,-24 0,-48 q-20,-24 0,-48`} fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.55 * Math.min(1, (1 - u) * 3, u * 6)}/>; })}
      </g>
      <g transform="translate(1530 906) scale(0.84)"><ellipse cx={30} cy={4} rx={150} ry={22} fill="#2a1808" opacity={0.3}/><Girl f={f} id="ak-p-g"/></g>
    </g>
  );
};
const PotLabels: React.FC<AP> = (p) => { const l = lab(p, 0); return l ? <LabelCard cx={1520} y={190} text={l.text} f={p.f} at={l.at} size={46} maxW={560} tone="cool"/> : null; };

export const B: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>}> = {
  breeze: {Art: Breeze, Labels: BreezeLabels},
  roundabout: {Art: Round, Labels: RoundLabels},
  pot: {Art: Pot, Labels: PotLabels},
};
void Hills;
