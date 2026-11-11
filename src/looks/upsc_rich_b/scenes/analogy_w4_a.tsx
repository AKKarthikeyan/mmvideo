// POL-03 Part 2, builder W4: `three-gates` (s011) and `tree-21` (s012).
import React from "react";
import {SANS, SERIF, W, H, eo, eio} from "../kit";
import {prog, Hills, Cloud, Sun, type AP} from "./analogy_kit";
import {P2Card} from "./analogy_p2b_kit";
import {A, bez, keyed, mixN, Glow, type KL} from "./analogy_w4_kit";

const none: KL = {text: "", at: 1e9};

// ---------------------------------------------------------------- three-gates ---------------------------------------------------------
type G = {cx: number; base: number; w: number; spring: number; ry: number; t: number; band: number; bh: number; size: number};
const GATES: G[] = [
  {cx: 960, base: 900, w: 900, spring: 570, ry: 235, t: 115, band: 92, bh: 58, size: 44},
  {cx: 960, base: 800, w: 580, spring: 610, ry: 165, t: 76, band: 66, bh: 40, size: 28},
  {cx: 960, base: 742, w: 410, spring: 650, ry: 118, t: 54, band: 48, bh: 32, size: 22},
];
const Gate: React.FC<{g: G; text: string; a: number; id: string; f: number; k: number}> = ({g, text, a, id, f, k}) => {
  if (a <= 0.003) return null;
  const x0 = g.cx - g.w / 2, x1 = g.cx + g.w / 2, rx = g.w / 2, rxi = rx - g.t, ryi = g.ry - g.band;
  const outer = `M${x0},${g.base} L${x0},${g.spring} A${rx},${g.ry} 0 0 1 ${x1},${g.spring} L${x1},${g.base} Z`;
  const inner = `M${x0 + g.t},${g.base} L${x0 + g.t},${g.spring} A${rxi},${ryi} 0 0 1 ${x1 - g.t},${g.spring} L${x1 - g.t},${g.base} Z`;
  const top = g.spring - g.ry, pulse = 0.55 + 0.45 * Math.sin(f / 16 + k * 1.7);
  const rise = (1 - a) * 40;
  return (
    <g opacity={a} transform={`translate(0 ${rise})`} style={{filter: "drop-shadow(0 18px 20px rgba(8,10,30,.5))"}}>
      <path d={`${outer} ${inner}`} fillRule="evenodd" fill={`url(#${id}-stone)`} stroke="#6a5e48" strokeWidth={3}/>
      <path d={inner} fill="none" stroke="#f0d78a" strokeWidth={4} opacity={0.5 + 0.3 * pulse}/>
      {/* stone courses on the pillars */}
      {Array.from({length: 6}).map((_, i) => { const y = g.base - (i + 1) * (g.base - g.spring) / 6.4; return <g key={i}><path d={`M${x0},${y} H${x0 + g.t}`} stroke="#8e8266" strokeWidth={1.6} opacity={0.6}/><path d={`M${x1 - g.t},${y} H${x1}`} stroke="#8e8266" strokeWidth={1.6} opacity={0.6}/></g>; })}
      {/* shade on the right pillar face */}
      <path d={`M${x1 - g.t * 0.45},${g.base} L${x1 - g.t * 0.45},${g.spring} L${x1},${g.spring} L${x1},${g.base} Z`} fill="#3a3020" opacity={0.18}/>
      {/* banner on the crown */}
      <g transform={`translate(${g.cx} ${top + g.band * 0.5})`}>
        <rect x={-g.w * 0.3} y={-g.bh / 2} width={g.w * 0.6} height={g.bh} rx={g.bh * 0.2} fill="#2a2f55" stroke="#f0c660" strokeWidth={2.6}/>
        <rect x={-g.w * 0.3 + 4} y={-g.bh / 2 + 4} width={g.w * 0.6 - 8} height={g.bh * 0.4} rx={g.bh * 0.12} fill="#fff" opacity={0.1}/>
        <text x={0} y={g.size * 0.34} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={g.size} letterSpacing="0.12em" fill="#ffe7a8">{text}</text>
      </g>
      <circle cx={g.cx} cy={top - 4} r={g.bh * 0.28} fill="#f0c660" stroke="#7a5518" strokeWidth={1.5} opacity={0.6 + 0.4 * pulse}/>
    </g>
  );
};

const Phone: React.FC<{x: number; y: number; s: number; f: number}> = ({x, y, s, f}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-34} y={-104} width={68} height={108} rx={12} fill="#1b2235" stroke="#9fb4d8" strokeWidth={2}/>
    <rect x={-29} y={-98} width={58} height={92} rx={8} fill="#3c78c8"/>
    <rect x={-29} y={-98} width={58} height={34} rx={8} fill="#6aa6ea" opacity={0.7}/>
    <rect x={-10} y={-52} width={20} height={16} rx={3} fill="#fff" opacity={0.95}/>
    <path d="M-6,-52 v-6 a6,6 0 0 1 12,0 v6" fill="none" stroke="#fff" strokeWidth={3}/>
    <circle cx={0} cy={-44} r={2.4} fill="#3c78c8"/>
    {[0, 1, 2].map((i) => <rect key={i} x={-20 + i * 14} y={-24} width={12} height={8} rx={2} fill="#fff" opacity={0.7}/>)}
    <rect x={-8} y={-102} width={16} height={3} rx={1.5} fill="#0b1020"/>
    <circle cx={0} cy={-52} r={0} fill="none"/>
  </g>
);
const BankCard: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-6)`}>
    <defs><linearGradient id="w4g-card" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3aa27e"/><stop offset="1" stopColor="#1f6a58"/></linearGradient></defs>
    <rect x={-62} y={-80} width={124} height={80} rx={10} fill="url(#w4g-card)" stroke="#bfe9d8" strokeWidth={2}/>
    <rect x={-62} y={-64} width={124} height={14} fill="#10382e" opacity={0.7}/>
    <rect x={-50} y={-40} width={26} height={20} rx={4} fill="#f0cf6a" stroke="#a37d1e" strokeWidth={1.2}/>
    <path d="M-50,-30 h26 M-37,-40 v20" stroke="#a37d1e" strokeWidth={1}/>
    <rect x={-50} y={-12} width={60} height={5} rx={2.5} fill="#e8fff4" opacity={0.7}/>
    <circle cx={42} cy={-14} r={9} fill="#e86a3a" opacity={0.9}/><circle cx={52} cy={-14} r={9} fill="#f0b43a" opacity={0.85}/>
  </g>
);
const HealthApp: React.FC<{x: number; y: number; s: number; f: number}> = ({x, y, s, f}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs><linearGradient id="w4g-health" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f26a7a"/><stop offset="1" stopColor="#c23a5a"/></linearGradient></defs>
    <rect x={-48} y={-96} width={96} height={96} rx={22} fill="url(#w4g-health)" stroke="#ffd4da" strokeWidth={2}/>
    <path d="M0,-26 C-30,-46 -30,-76 -14,-76 C-6,-76 0,-70 0,-64 C0,-70 6,-76 14,-76 C30,-76 30,-46 0,-26 Z" fill="#fff"/>
    <path d="M-34,-50 H-14 L-8,-62 L0,-38 L8,-54 L14,-50 H34" fill="none" stroke="#c23a5a" strokeWidth={4.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.9}/>
  </g>
);

export const ThreeGatesArt: React.FC<AP> = (p) => {
  const {f} = p, K = keyed(p), id = "w4g";
  const kk = (k: string) => K[k] ?? none;
  const labs = ["g1", "g2", "g3"];
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#566892"/><stop offset="0.55" stopColor="#2e3a68"/><stop offset="1" stopColor="#1a2146"/></linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a4573"/><stop offset="1" stopColor="#161b3a"/></linearGradient>
        <linearGradient id={`${id}-stone`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#e6dabf"/><stop offset="0.6" stopColor="#c9bb9a"/><stop offset="1" stopColor="#a39573"/></linearGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="rgba(255,226,150,0.55)"/><stop offset="1" stopColor="rgba(255,226,150,0)"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id}-wall)`}/>
      {/* hall arches far back and window light */}
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${-40 + i * 500},700 V300 a210,210 0 0 1 420,0 V700 Z`} fill="#7384b4" opacity={0.18}/>)}
      <Glow x={960} y={560} r={520} c="150,170,240" a={0.5}/>
      {/* floor with a lit path */}
      <path d={`M-60,700 H${W + 60} V${H + 60} H-60 Z`} fill={`url(#${id}-floor)`}/>
      <path d="M880,700 L1040,700 L1300,1080 L620,1080 Z" fill="#f0d796" opacity={0.22}/>
      {[-3, -2, -1, 0, 1, 2, 3].map((i) => <path key={i} d={`M${960 + i * 40},700 L${960 + i * 330},1080`} stroke="#8b99c8" strokeWidth={1.6} opacity={0.25}/>)}
      {[730, 770, 830, 920, 1040].map((y) => <path key={y} d={`M-60,${y} H${W + 60}`} stroke="#8b99c8" strokeWidth={1.2} opacity={0.18}/>)}
      {/* plinth and the three glowing things */}
      <ellipse cx={960} cy={730} rx={190} ry={18} fill="#0a0e24" opacity={0.5}/>
      <path d="M770,722 H1150 L1170,742 H750 Z" fill="#6c5c3c"/>
      <rect x={770} y={720} width={380} height={5} fill="#f0d78a" opacity={0.7}/>
      {[0, 1, 2].map((i) => <Glow key={i} x={[868, 960, 1056][i]} y={668} r={92 + 8 * Math.sin(f / 15 + i)} c="255,222,140" a={0.85}/>)}
      <rect x={780} y={560} width={360} height={170} fill={`url(#${id}-beam)`} opacity={0.5}/>
      <Phone x={866} y={724} s={0.92} f={f}/>
      <BankCard x={962} y={716} s={0.78}/>
      <HealthApp x={1056} y={724} s={0.84} f={f}/>
      {/* gates, back to front */}
      {[2, 1, 0].map((i) => <Gate key={i} g={GATES[i]} text={kk(labs[i]).text} a={A(f, kk(labs[i]).at, 18)} id={id} f={f} k={i}/>)}
    </g>
  );
};
export const ThreeGatesLabels: React.FC<AP> = (p) => {
  const K = keyed(p), c = (k: string) => K[k] ?? none;
  return (
    <>
      <P2Card cx={310} y={150} text={c("lo").text} f={p.f} at={c("lo").at} size={32} maxW={380} upper={false}/>
      <P2Card cx={1625} y={300} text={c("dt").text} f={p.f} at={c("dt").at} size={30} maxW={390} upper={false} tone="cool"/>
      <P2Card cx={1625} y={560} text={c("dp").text} f={p.f} at={c("dp").at} size={30} maxW={390} upper={false} tone="green"/>
    </>
  );
};

// ---------------------------------------------------------------- tree-21 --------------------------------------------------------------
const BR = [
  {key: "ed", p0: [958, 610] as [number, number], c: [800, 520] as [number, number], p1: [560, 410] as [number, number]},
  {key: "lv", p0: [962, 570] as [number, number], c: [1150, 470] as [number, number], p1: [1400, 380] as [number, number]},
  {key: "wa", p0: [964, 650] as [number, number], c: [1140, 660] as [number, number], p1: [1390, 620] as [number, number]},
];
const bd = (b: typeof BR[number]) => `M${b.p0[0]},${b.p0[1]} Q${b.c[0]},${b.c[1]} ${b.p1[0]},${b.p1[1]}`;

const Leaves: React.FC<{x: number; y: number; a: number; f: number; seed: number}> = ({x, y, a, f, seed}) => (
  <g opacity={a} transform={`translate(${x} ${y})`}>
    {[[-50, 10, 38], [-20, -26, 46], [24, -22, 44], [52, 12, 36], [0, 26, 40]].map(([cx, cy, r], i) => (
      <g key={i} transform={`translate(${Math.sin(f / 12 + seed + i) * 1.5} ${Math.cos(f / 14 + i) * 1.2})`}>
        <circle cx={cx + 5} cy={cy + 8} r={r} fill="#2f6a2c"/><circle cx={cx} cy={cy} r={r * 0.94} fill="#4d9a3c"/><circle cx={cx - r * 0.22} cy={cy - r * 0.24} r={r * 0.5} fill="#8cc860" opacity={0.85}/>
      </g>
    ))}
  </g>
);

const Badge: React.FC<{x: number; y: number; a: number; children: React.ReactNode; f: number; seed: number}> = ({x, y, a, children, f, seed}) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 18 + seed) * 4}) scale(${0.4 + 0.6 * a})`} opacity={a} style={{filter: "drop-shadow(0 10px 8px rgba(40,22,8,.36))"}}>
    <circle r={62} fill="#fffaf0" stroke="#c9a46a" strokeWidth={3}/>
    <circle r={52} fill="none" stroke="#e2cfa6" strokeWidth={1.5}/>
    {children}
  </g>
);

export const Tree21Art: React.FC<AP> = (p) => {
  const {f} = p, K = keyed(p), c = (k: string) => K[k] ?? none;
  const id = "w4t";
  const trunkD = Math.max(30, c("ed").at - 26), tg = eio(prog(f, 10, trunkD));
  const bg = (k: string) => eio(prog(f, c(k).at - 8, 44));
  const seedA = 1 - eo(prog(f, 6, 24)), sprout = eo(prog(f, 4, 30));
  const ed = bg("ed"), lv = bg("lv"), wa = bg("wa");
  const tipPos = (b: typeof BR[number], t: number) => bez(b.p0, b.c, b.p1, t);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6fb0e0"/><stop offset="0.7" stopColor="#c9e2e6"/><stop offset="1" stopColor="#f6e8c6"/></linearGradient>
        <linearGradient id={`${id}-soil`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a5230"/><stop offset="1" stopColor="#3f2814"/></linearGradient>
        <linearGradient id={`${id}-grass`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8cc060"/><stop offset="1" stopColor="#4d8a3a"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id}-sky)`}/>
      <Sun x={1620} y={190} r={50} f={f}/>
      {[0, 1, 2].map((i) => <Cloud key={i} x={80 + i * 640} y={150 + (i % 2) * 90} s={0.9} f={f} speed={0.18} seed={i + 5} a={0.85}/>)}
      <Hills id={`${id}-h1`} base={720} amp={110} top="#b4cbe0" bottom="#d4dfdf" seed={1.2}/>
      <Hills id={`${id}-h2`} base={790} amp={70} top="#8fb59a" bottom="#bdd2a4" seed={3.8} wl={320}/>
      {/* meadow and soil */}
      <path d={`M-60,800 Q480,770 960,790 T${W + 60},796 V${H + 60} H-60 Z`} fill={`url(#${id}-grass)`}/>
      <ellipse cx={960} cy={830} rx={220} ry={36} fill={`url(#${id}-soil)`}/>
      <ellipse cx={960} cy={822} rx={200} ry={26} fill="#946238" opacity={0.7}/>
      {Array.from({length: 22}).map((_, i) => { const x = 40 + i * 88 + (i % 3) * 14; return <path key={i} d={`M${x},830 q-4,-26 -10,-34 M${x},830 q2,-24 8,-30`} stroke="#3f7a2e" strokeWidth={3} fill="none" strokeLinecap="round"/>; })}
      {/* seed under the soil line, shows first */}
      <g opacity={seedA}><ellipse cx={960} cy={812} rx={20} ry={11} fill="#a57444" stroke="#5a3a1a" strokeWidth={2}/><path d="M946,810 q14,-6 28,0" stroke="#5a3a1a" fill="none" strokeWidth={1.6}/></g>
      {/* signpost with the Article number */}
      <g transform="translate(700 760)">
        <rect x={-7} y={-80} width={14} height={140} fill="#7a5230" stroke="#4a3018" strokeWidth={2}/>
        <rect x={-130} y={-120} width={260} height={64} rx={8} fill="#f2e2b8" stroke="#8a6a38" strokeWidth={3} transform="rotate(-2)"/>
        <text x={0} y={-76} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={32} letterSpacing="0.1em" fill="#4a2c10" transform="rotate(-2)">ARTICLE 21</text>
      </g>
      {/* trunk grows from the seed */}
      <g opacity={sprout}>
        <path d="M960,812 C960,700 955,620 960,520" fill="none" stroke="#3f2a16" strokeWidth={56 - 10 * tg} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tg} opacity={0.9}/>
        <path d="M960,812 C960,700 955,620 960,520" fill="none" stroke="#7a5230" strokeWidth={46 - 10 * tg} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tg}/>
        <path d="M968,812 C968,700 962,620 966,520" fill="none" stroke="#a37444" strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tg} opacity={0.55}/>
      </g>
      {/* crown behind */}
      {tg > 0.85 && <Leaves x={960} y={500} a={eo((tg - 0.85) / 0.15)} f={f} seed={0}/>}
      {/* branches */}
      {BR.map((b, i) => { const g = [ed, lv, wa][i]; return g > 0.002 ? (
        <g key={b.key}>
          <path d={bd(b)} fill="none" stroke="#3f2a16" strokeWidth={30} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - g}/>
          <path d={bd(b)} fill="none" stroke="#7a5230" strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - g}/>
          <path d={bd(b)} fill="none" stroke="#a37444" strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - g} opacity={0.6} transform="translate(-3 -4)"/>
          {[0.45, 0.7, 0.88].map((t, j) => { const q = tipPos(b, t); return g > t ? <Leaves key={j} x={q[0]} y={q[1] - 6} a={eo((g - t) / 0.12)} f={f} seed={i * 3 + j}/> : null; })}
        </g>) : null; })}
      {/* fruit badges at the tips */}
      <Badge x={BR[0].p1[0]} y={BR[0].p1[1] - 6} a={A(f, c("ed").at + 6, 18)} f={f} seed={1}>
        <g transform="translate(0 6)">
          <path d="M-34,-24 L0,-14 L34,-24 V22 L0,32 L-34,22 Z" fill="#2f78b8" stroke="#173a5c" strokeWidth={2.4}/>
          <path d="M0,-14 V32" stroke="#173a5c" strokeWidth={2.4}/>
          <path d="M-28,-14 L-6,-8 M-28,-4 L-6,2 M-28,6 L-6,12 M28,-14 L6,-8 M28,-4 L6,2 M28,6 L6,12" stroke="#cfe6fa" strokeWidth={2.2} strokeLinecap="round"/>
        </g>
      </Badge>
      <Badge x={BR[1].p1[0]} y={BR[1].p1[1] - 6} a={A(f, c("lv").at + 6, 18)} f={f} seed={2}>
        <g transform="translate(0 6)">
          <rect x={-34} y={-8} width={68} height={38} rx={6} fill="#c0603d" stroke="#6a2a14" strokeWidth={2.4}/>
          <path d="M-14,-8 V-18 a4,4 0 0 1 4,-4 H10 a4,4 0 0 1 4,4 V-8" fill="none" stroke="#6a2a14" strokeWidth={3}/>
          <rect x={-34} y={6} width={68} height={7} fill="#e8a070"/><rect x={-6} y={2} width={12} height={14} rx={2} fill="#f0cf6a" stroke="#6a2a14" strokeWidth={1.6}/>
          <path d="M-30,-30 L-12,-12" stroke="#7a7a82" strokeWidth={6} strokeLinecap="round" opacity={0}/>
        </g>
      </Badge>
      <Badge x={BR[2].p1[0]} y={BR[2].p1[1] - 6} a={A(f, c("wa").at + 6, 18)} f={f} seed={3}>
        <g>
          <path d="M-10,-40 C-10,-40 -34,-6 -34,12 a24,24 0 0 0 48,0 C14,-6 -10,-40 -10,-40 Z" fill="#4aa6e0" stroke="#1c5a8c" strokeWidth={2.4} transform="translate(-4 0)"/>
          <path d="M-22,10 a12,12 0 0 0 8,12" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.8} transform="translate(-4 0)"/>
          <path d="M8,-20 q18,-8 24,4 q4,10 -10,10 M10,-4 q14,-2 20,6" stroke="#6a8aa8" strokeWidth={3.4} fill="none" strokeLinecap="round"/>
        </g>
      </Badge>
    </g>
  );
};
export const Tree21Labels: React.FC<AP> = (p) => {
  const K = keyed(p), c = (k: string) => K[k] ?? none;
  return (
    <>
      <P2Card cx={450} y={150} text={c("ed").text} f={p.f} at={c("ed").at} size={36} maxW={560} upper={false}/>
      <P2Card cx={420} y={500} text={c("nc").text} f={p.f} at={c("nc").at} size={26} maxW={520} upper={false} tone="cool"/>
      <P2Card cx={1450} y={140} text={c("lv").text} f={p.f} at={c("lv").at} size={34} maxW={560} upper={false}/>
      <P2Card cx={1630} y={590} text={c("wa").text} f={p.f} at={c("wa").at} size={28} maxW={340} upper={false} tone="green"/>
    </>
  );
};
