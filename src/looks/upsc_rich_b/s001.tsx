// s001: a Nagpur rooftop in May, heat haze, an empty bucket, a thermometer, a curious girl, two number cards.
import React, {useMemo} from "react";
import {AbsoluteFill} from "remotion";
import {fig} from "../cartoon/long/figs";
import {Girl} from "./girl";
import {Fonts, PaperFinish, Pill, SANS, SERIF, W, H, Wire, cardStyle, clamp, eio, eo, lerp, prog, rng} from "./kit";

const TMAX = fig({t: "u7_nagpur", state: "May", s: "tmax"}, 1);
const RAIN = fig({t: "u7_nagpur", state: "May", s: "raindays"}, 1);

// ---------- skyline layers ----------
type Bld = {x: number; w: number; h: number; k: number; roof: number; r: number[]};
const mkBlds = (seed: number, x0: number, x1: number, wmin: number, wmax: number, hmin: number, hmax: number, gap = 0): Bld[] => {
  const r = rng(seed); const out: Bld[] = []; let x = x0;
  while (x < x1) { const w = wmin + r() * (wmax - wmin); out.push({x, w, h: hmin + r() * (hmax - hmin), k: Math.floor(r() * 4), roof: Math.floor(r() * 5), r: [r(), r(), r(), r()]}); x += w + gap * r(); }
  return out;
};
const Tank: React.FC<{x: number; y: number; s?: number; col?: string; lid?: string}> = ({x, y, s = 1, col = "#2a2f36", lid = "#3a424b"}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-16" y="-34" width="32" height="34" rx="3" fill={col}/><ellipse cx="0" cy="-34" rx="16" ry="4.5" fill={lid}/>
    <rect x="-16" y="-34" width="9" height="34" fill="#fff" opacity="0.12"/><rect x="-5" y="-40" width="10" height="5" rx="1.5" fill={lid}/>
  </g>
);

const FarCity: React.FC<{f: number}> = ({f}) => {
  const bl = useMemo(() => mkBlds(11, -140, 2100, 54, 120, 70, 250, 6), []);
  const base = 600;
  return (
    <g>
      <defs>
        <pattern id="s1-winF" width="13" height="17" patternUnits="userSpaceOnUse"><rect x="3.5" y="4" width="6" height="8" rx="0.8" fill="#eaf1f7" opacity="0.55"/></pattern>
        <linearGradient id="s1-farG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#aac1d6"/><stop offset="1" stopColor="#d3dfe6"/></linearGradient>
      </defs>
      {bl.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={base - b.h} width={b.w} height={b.h} fill="url(#s1-farG)"/>
          <rect x={b.x + b.w * 0.7} y={base - b.h} width={b.w * 0.3} height={b.h} fill="#8da8c2" opacity="0.35"/>
          <rect x={b.x + 3} y={base - b.h + 8} width={b.w - 6} height={b.h - 8} fill="url(#s1-winF)"/>
          <rect x={b.x} y={base - b.h - 4} width={b.w} height={4} fill="#c3d3e1"/>
          {b.roof === 0 && <Tank x={b.x + b.w * 0.3} y={base - b.h - 4} s={0.7} col="#7d93a8" lid="#8ea4b8"/>}
          {b.roof === 1 && <path d={`M${b.x + b.w * 0.5},${base - b.h - 4} l0,-38 M${b.x + b.w * 0.5 - 7},${base - b.h - 28} l14,0 M${b.x + b.w * 0.5 - 5},${base - b.h - 36} l10,0`} stroke="#8aa1b6" strokeWidth="1.6"/>}
          {b.roof === 2 && <path d={`M${b.x + b.w * 0.4},${base - b.h - 4} l5,-60 l5,60 M${b.x + b.w * 0.4 + 2},${base - b.h - 30} l6,0 M${b.x + b.w * 0.4 + 1},${base - b.h - 14} l8,0`} stroke="#8aa1b6" strokeWidth="1.3" fill="none"/>}
        </g>
      ))}
      {/* a tall chimney and a tower, far off */}
      <rect x="1180" y={base - 330} width="12" height="330" fill="#a3b9cd"/><rect x="1180" y={base - 330} width="12" height="12" fill="#c9d6e2"/><rect x="1180" y={base - 300} width="12" height="5" fill="#c4584a" opacity="0.5"/>
      <rect x="1750" y={base - 300} width="10" height="300" fill="#a3b9cd"/>
    </g>
  );
};

const Window: React.FC<{x: number; y: number; w: number; h: number; lit?: number; shut?: string; ac?: boolean; id: string}> = ({x, y, w, h, lit = 0, shut, ac}) => (
  <g>
    <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} fill="#efe6d2" stroke="#8e7c62" strokeWidth="0.8" opacity="0.95"/>
    <rect x={x} y={y} width={w} height={h} fill="url(#s1-glass)"/>
    {lit > 0.6 && <rect x={x} y={y} width={w} height={h * 0.55} fill="#f1c078" opacity="0.55"/>}
    <path d={`M${x + w / 2},${y} V${y + h} M${x},${y + h / 2} H${x + w}`} stroke="#6f5f4c" strokeWidth="1.1"/>
    <path d={`M${x},${y + h * 0.25} l${w},${-h * 0.15} v${h * 0.1} l${-w},${h * 0.15} Z`} fill="#fff" opacity="0.28"/>
    {shut && <><rect x={x - w * 0.55} y={y} width={w * 0.5} height={h} fill={shut} stroke="#2c4a3a" strokeWidth="0.8"/><rect x={x + w + w * 0.05} y={y} width={w * 0.5} height={h} fill={shut} stroke="#2c4a3a" strokeWidth="0.8"/></>}
    <rect x={x - 5} y={y + h + 3} width={w + 10} height={4} fill="#d5c8ad" stroke="#8e7c62" strokeWidth="0.6"/>
    {ac && <g><rect x={x + w * 0.1} y={y + h + 8} width={w * 0.85} height={h * 0.38} rx="2" fill="#f2f0ea" stroke="#9b9588" strokeWidth="0.8"/><path d={`M${x + w * 0.18},${y + h + 14} h${w * 0.7}`} stroke="#bdb8ac" strokeWidth="1.2"/></g>}
  </g>
);

const MidCity: React.FC<{f: number}> = ({f}) => {
  const bl = useMemo(() => mkBlds(23, -60, 2100, 130, 230, 110, 230, 14), []);
  const base = 600;
  const cols = ["#d9cdbd", "#cfc7bb", "#dcc7b0", "#c6cdcf", "#d6c9b7"];
  return (
    <g>
      <defs>
        <linearGradient id="s1-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fc2dc"/><stop offset="1" stopColor="#54768f"/></linearGradient>
        <linearGradient id="s1-midS" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.28"/><stop offset="0.6" stopColor="#fff" stopOpacity="0"/><stop offset="1" stopColor="#4a4d78" stopOpacity="0.22"/></linearGradient>
      </defs>
      {bl.map((b, i) => {
        const c = cols[b.k % cols.length]; const cols2 = Math.max(2, Math.floor(b.w / 38)); const rows = Math.max(2, Math.floor(b.h / 50));
        return (
          <g key={i}>
            <rect x={b.x} y={base - b.h} width={b.w} height={b.h} fill={c} stroke="#8d7f6c" strokeWidth="0.8"/>
            <rect x={b.x} y={base - b.h} width={b.w} height={b.h} fill="url(#s1-midS)"/>
            <rect x={b.x - 3} y={base - b.h - 8} width={b.w + 6} height={8} fill="#e8dec9" stroke="#8d7f6c" strokeWidth="0.8"/>
            {Array.from({length: rows}).flatMap((_, r) => Array.from({length: cols2}).map((_, cI) => {
              const ww = 16, hh = 24, gx = (b.w - cols2 * ww) / (cols2 + 1); const q = (b.r[(r + cI) % 4] + r * 0.37 + cI * 0.21) % 1;
              return <Window key={`${r}-${cI}`} id="m" x={b.x + gx + cI * (ww + gx)} y={base - b.h + 18 + r * 50} w={ww} h={hh} lit={q} ac={q > 0.72} shut={q < 0.18 ? "#4f7a63" : undefined}/>;
            }))}
            {b.roof === 0 && <Tank x={b.x + b.w * 0.25} y={base - b.h - 8} s={1.15}/>}
            {b.roof === 1 && <><Tank x={b.x + b.w * 0.3} y={base - b.h - 8} s={1}/><Tank x={b.x + b.w * 0.6} y={base - b.h - 8} s={1.1}/></>}
            {b.roof === 2 && <g><path d={`M${b.x + b.w * 0.5},${base - b.h - 8} v-54`} stroke="#6d6a68" strokeWidth="2"/>{[0, 1, 2].map((j) => <path key={j} d={`M${b.x + b.w * 0.5 - 16 + j * 3},${base - b.h - 22 - j * 12} h${32 - j * 6}`} stroke="#6d6a68" strokeWidth="1.5"/>)}</g>}
            {b.roof === 3 && <g><path d={`M${b.x + b.w * 0.6},${base - b.h - 8} l6,-26`} stroke="#5d5a58" strokeWidth="2"/><ellipse cx={b.x + b.w * 0.6 + 8} cy={base - b.h - 40} rx="14" ry="10" fill="#e9e6df" stroke="#8d897d" strokeWidth="1" transform={`rotate(-24 ${b.x + b.w * 0.6 + 8} ${base - b.h - 40})`}/></g>}
          </g>
        );
      })}
    </g>
  );
};

const Gulmohar: React.FC<{x: number; y: number; s: number; seed: number; f: number}> = ({x, y, s, seed, f}) => {
  const bl = useMemo(() => { const r = rng(seed); return Array.from({length: 46}).map(() => { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 120; return {cx: Math.cos(a) * d * 1.3, cy: -190 + Math.sin(a) * d * 0.62, r: 26 + r() * 30, c: r()}; }); }, [seed]);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-9,0 C-10,-50 -6,-100 -14,-150 L14,-150 C8,-100 10,-50 9,0 Z" fill="#5c4333" stroke="#3a2a1f" strokeWidth="1"/>
      <path d="M-8,-110 C-50,-140 -80,-150 -96,-190 M8,-120 C52,-150 78,-160 100,-196" stroke="#5c4333" strokeWidth="9" fill="none" strokeLinecap="round"/>
      {bl.map((b, i) => <circle key={i} cx={b.cx} cy={b.cy + 1.4 * Math.sin(f / 30 + i)} r={b.r} fill={b.c < 0.5 ? "#3f7a45" : b.c < 0.85 ? "#4e8a4c" : "#2f6439"} opacity="0.95"/>)}
      {bl.filter((_, i) => i % 2 === 0).map((b, i) => <circle key={`h${i}`} cx={b.cx - b.r * 0.25} cy={b.cy - b.r * 0.3} r={b.r * 0.62} fill="#7bb25b" opacity="0.6"/>)}
      {/* flowers: gulmohar is in bloom in May */}
      {bl.flatMap((b, i) => Array.from({length: 4}).map((_, j) => ({x: b.cx + Math.cos(i * 2.1 + j * 1.7) * b.r * 0.8, y: b.cy + Math.sin(i * 3.3 + j * 2.3) * b.r * 0.55, k: (i + j) % 3}))).map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4.5 + p.k * 1.4} fill={["#e0452c", "#f0702f", "#cf2f2a"][p.k]} opacity="0.92"/>)}
    </g>
  );
};

const NearBlocks: React.FC<{f: number}> = ({f}) => {
  const blocks = [
    {x: 560, w: 330, h: 290, c: "#e3cdb0", t: "#c7a984"}, {x: 905, w: 260, h: 340, c: "#cfd9d0", t: "#a8b9ac"},
    {x: 1180, w: 300, h: 270, c: "#e7c5a8", t: "#c99d7a"}, {x: 1495, w: 280, h: 330, c: "#d6d0c6", t: "#b2aa9c"}, {x: 1790, w: 240, h: 300, c: "#e0d0b6", t: "#bba883"},
  ];
  const base = 640;
  return (
    <g>
      {blocks.map((b, i) => {
        const nC = Math.floor(b.w / 78), nR = Math.floor((b.h - 30) / 92);
        return (
          <g key={i}>
            <rect x={b.x} y={base - b.h} width={b.w} height={b.h} fill={b.c} stroke={b.t} strokeWidth="1.4"/>
            <rect x={b.x} y={base - b.h} width={b.w} height={b.h} fill="url(#s1-midS)"/>
            <rect x={b.x - 6} y={base - b.h - 14} width={b.w + 12} height={14} fill="#f1e8d4" stroke={b.t} strokeWidth="1.2"/>
            <rect x={b.x - 6} y={base - b.h - 2} width={b.w + 12} height={7} fill="#4a4d78" opacity="0.18"/>
            {/* water stains below the roof edge */}
            {[0.2, 0.55, 0.8].map((q, j) => <path key={j} d={`M${b.x + b.w * q},${base - b.h + 2} q-4,40 2,${70 + j * 20}`} stroke={b.t} strokeWidth="9" opacity="0.28" fill="none" strokeLinecap="round"/>)}
            {Array.from({length: nR}).flatMap((_, r) => Array.from({length: nC}).map((_, cI) => {
              const gx = (b.w - nC * 40) / (nC + 1); const x = b.x + gx + cI * (40 + gx), y = base - b.h + 30 + r * 92; const q = (Math.sin(i * 7.3 + r * 3.1 + cI * 5.7) + 1) / 2;
              return (
                <g key={`${r}-${cI}`}>
                  <Window id="n" x={x} y={y} w={32} h={50} lit={q} ac={q > 0.6} shut={q < 0.22 ? "#557f66" : undefined}/>
                  {/* balcony rail */}
                  {q > 0.35 && q < 0.6 && <g><rect x={x - 12} y={y + 58} width={56} height={5} fill="#d7cbb3" stroke="#8e7c62" strokeWidth="0.8"/><path d={`M${x - 10},${y + 58} v-14 M${x + 4},${y + 58} v-14 M${x + 18},${y + 58} v-14 M${x + 32},${y + 58} v-14 M${x + 42},${y + 58} v-14 M${x - 12},${y + 44} h56`} stroke="#5a5e63" strokeWidth="1.3"/>
                    <path d={`M${x + 2},${y + 44} q6,-18 14,-6 q4,-14 10,-2`} stroke="#4f8a4b" strokeWidth="5" fill="none" strokeLinecap="round"/></g>}
                  {/* clothes hung out to dry */}
                  {q >= 0.6 && q < 0.72 && <g><path d={`M${x - 14},${y + 54} H${x + 52}`} stroke="#4a4a4a" strokeWidth="1"/><path d={`M${x - 4},${y + 54} v26 h14 v-26 Z`} fill="#e9a3b3" opacity="0.95"/><path d={`M${x + 20},${y + 54} v20 h18 v-20 Z`} fill="#f4f0e6"/></g>}
                </g>
              );
            }))}
            {/* rooftop clutter */}
            {i % 2 === 0 ? <><Tank x={b.x + b.w * 0.3} y={base - b.h - 14} s={1.6}/><Tank x={b.x + b.w * 0.6} y={base - b.h - 14} s={1.4}/></> : <g><rect x={b.x + b.w * 0.2} y={base - b.h - 54} width={90} height={42} fill={b.c} stroke={b.t}/><rect x={b.x + b.w * 0.2 - 4} y={base - b.h - 58} width={98} height={6} fill="#f1e8d4" stroke={b.t}/><Tank x={b.x + b.w * 0.7} y={base - b.h - 14} s={1.5}/></g>}
          </g>
        );
      })}
    </g>
  );
};

const Pole: React.FC<{x: number; y: number; h: number}> = ({x, y, h}) => (
  <g>
    <path d={`M${x},${y} v${-h}`} stroke="#3d3430" strokeWidth="7" strokeLinecap="round"/>
    <path d={`M${x - 36},${y - h + 22} h72 M${x - 28},${y - h + 50} h56`} stroke="#3d3430" strokeWidth="5" strokeLinecap="round"/>
    {[-34, -14, 14, 34].map((o, i) => <circle key={i} cx={x + o} cy={y - h + 20} r="3.5" fill="#cbd3d6" stroke="#6a6f72"/>)}
  </g>
);

const Haze: React.FC<{f: number}> = ({f}) => (
  <g>
    {/* shimmering bands over the roofs */}
    {Array.from({length: 7}).map((_, i) => {
      const y = 560 + i * 24, ph = f / 18 + i * 1.7;
      let d = `M-100,${y}`; for (let x = -100; x <= 2020; x += 60) d += ` Q${x + 15},${y - 7 * Math.sin(ph + x / 90)} ${x + 30},${y} T${x + 60},${y}`;
      return <path key={i} d={d} stroke="#fffbea" strokeWidth={2.2} fill="none" opacity={0.2 - i * 0.015} filter="url(#s1-blur2)"/>;
    })}
  </g>
);

const Thermometer: React.FC<{x: number; y: number; level: number; f: number}> = ({x, y, level, f}) => {
  const top = y - 175, bot = y + 150;               // board 112 x 330
  const tubeTop = top + 58, tubeBot = bot - 62, tl = tubeBot - tubeTop;
  const mer = tubeBot - tl * level;
  return (
    <g>
      <rect x={x - 56 + 6} y={top + 8} width={112} height={bot - top} rx="14" fill="#3a2a22" opacity="0.25" filter="url(#s1-blur2)"/>
      <rect x={x - 56} y={top} width={112} height={bot - top} rx="14" fill="url(#s1-board)" stroke="#8c7a63" strokeWidth="2"/>
      <rect x={x - 50} y={top + 6} width={100} height={bot - top - 12} rx="10" fill="none" stroke="#c63f2f" strokeWidth="1.2" opacity="0.6"/>
      {[[-40, 18], [40, 18], [-40, bot - top - 18], [40, bot - top - 18]].map(([ox, oy], i) => <g key={i}><circle cx={x + ox} cy={top + oy} r="4.2" fill="#a8a29a" stroke="#6a655e"/><path d={`M${x + ox - 2.4},${top + oy - 0.8} l4.8,1.6`} stroke="#5b564f" strokeWidth="1"/></g>)}
      <text x={x} y={top + 44} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize="17" letterSpacing="2" fill="#7a2a1d">{"°C"}</text>
      {/* scale */}
      {Array.from({length: 26}).map((_, i) => { const yy = tubeBot - (tl * i) / 25; const maj = i % 5 === 0; return <g key={i}><path d={`M${x + 12},${yy} h${maj ? 15 : 8}`} stroke="#4b3e34" strokeWidth={maj ? 1.8 : 1}/><path d={`M${x - 12},${yy} h${maj ? -15 : -8}`} stroke="#4b3e34" strokeWidth={maj ? 1.8 : 1}/>
        {maj && <text x={x - 32} y={yy + 4} textAnchor="end" fontFamily={SANS} fontWeight={700} fontSize="13" fill="#4b3e34">{i * 2}</text>}</g>; })}
      {/* glass tube, bulb, mercury */}
      <rect x={x - 6} y={tubeTop - 6} width={12} height={tl + 12} rx="6" fill="#fdfaf2" stroke="#8d8579" strokeWidth="1.4"/>
      <circle cx={x} cy={tubeBot + 20} r="19" fill="#fdfaf2" stroke="#8d8579" strokeWidth="1.4"/>
      <circle cx={x} cy={tubeBot + 20} r="14.5" fill="url(#s1-mer)"/>
      <rect x={x - 3.4} y={mer} width="6.8" height={tubeBot + 14 - mer} fill="url(#s1-mer)"/>
      <ellipse cx={x} cy={mer} rx="3.4" ry="2" fill="#e2503c"/>
      <rect x={x - 4.6} y={tubeTop - 2} width="2.4" height={tl} rx="1.2" fill="#fff" opacity="0.75"/>
      <circle cx={x - 6} cy={tubeBot + 14} r="4.4" fill="#fff" opacity="0.7"/>
    </g>
  );
};

const Bucket: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="14" cy="4" rx="64" ry="12" fill="#4a4678" opacity="0.28" filter="url(#s1-blur6)"/>
    <path d="M-40,-92 C-46,-60 -34,-22 -28,-2 L28,-2 C34,-22 46,-60 40,-92 Z" fill="url(#s1-bkt)" stroke="#8a2c1d" strokeWidth="1.3"/>
    <path d="M-36,-84 C-36,-60 -26,-26 -22,-6" stroke="#ffd0a6" strokeWidth="3" opacity="0.6" fill="none"/>
    {[-60, -36, -14].map((yy, i) => <path key={i} d={`M-${41 - i * 2.5},${yy} Q0,${yy + 6} ${41 - i * 2.5},${yy}`} stroke="#8a2c1d" strokeWidth="1.1" fill="none" opacity="0.5"/>)}
    <ellipse cx="0" cy="-92" rx="41" ry="11" fill="#2a1612" stroke="#f1d9c6" strokeWidth="4.5"/>
    <ellipse cx="0" cy="-88" rx="35" ry="7.5" fill="#46302a"/>
    <path d="M-20,-86 q8,4 14,-1 q6,4 12,-1 M2,-90 l8,4" stroke="#6f5648" strokeWidth="1" fill="none"/>
    <path d="M-40,-96 C-44,-148 44,-148 40,-96" stroke="#9aa0a4" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
    <path d="M-38,-104 C-40,-136 -10,-146 4,-143" stroke="#e4e8ea" strokeWidth="1.2" fill="none"/>
    <rect x="-47" y="-100" width="7" height="9" rx="2" fill="#6b7075"/><rect x="40" y="-100" width="7" height="9" rx="2" fill="#6b7075"/>
  </g>
);

const WaterTank: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="60" cy="8" rx="190" ry="26" fill="#4a4678" opacity="0.22" filter="url(#s1-blur6)"/>
    <rect x="-70" y="-48" width="140" height="48" fill="#b8826a" stroke="#7a4a38" strokeWidth="1.3"/>
    {[-34, -16].map((yy) => <path key={yy} d={`M-70,${yy - 24} H70`} stroke="#8d5a46" strokeWidth="1" opacity="0.6"/>)}
    {Array.from({length: 7}).map((_, i) => <path key={i} d={`M${-64 + i * 21},-48 v-0 M${-60 + i * 21},-24 v-24`} stroke="#8d5a46" strokeWidth="1" opacity="0.5"/>)}
    <rect x="-84" y="-56" width="168" height="10" fill="#d9c9ab" stroke="#8c7c60"/>
    <path d="M-74,-56 C-78,-130 -76,-220 -66,-270 L66,-270 C76,-220 78,-130 74,-56 Z" fill="url(#s1-tank)" stroke="#12161b" strokeWidth="1.3"/>
    {[-100, -150, -204].map((yy) => <path key={yy} d={`M-76,${yy} Q0,${yy + 12} 76,${yy}`} stroke="#0c1014" strokeWidth="3" fill="none" opacity="0.7"/>)}
    <path d="M-62,-62 C-66,-130 -64,-220 -56,-262" stroke="#8fa3b6" strokeWidth="5" opacity="0.4" fill="none" strokeLinecap="round"/>
    <path d="M-66,-270 C-60,-292 -30,-306 0,-306 C30,-306 60,-292 66,-270 Z" fill="#3a424b" stroke="#12161b" strokeWidth="1.3"/>
    <path d="M-50,-282 C-36,-298 -10,-302 6,-303" stroke="#9fb0c0" strokeWidth="2.5" fill="none" opacity="0.7"/>
    <circle cx="0" cy="-308" r="9" fill="#4d5762" stroke="#12161b"/>
    <path d="M70,-30 h30 v28" stroke="#6b7a86" strokeWidth="6" fill="none" strokeLinecap="round"/><rect x="92" y="-6" width="16" height="9" rx="2" fill="#8b99a4"/>
  </g>
);

const Mumty: React.FC<{f: number; level: number}> = ({f, level}) => (
  <g>
    <polygon points="520,740 1180,880 1180,960 520,775" fill="#4a4678" opacity="0.2" filter="url(#s1-blur6)"/>
    <rect x="40" y="340" width="480" height="430" fill="url(#s1-mum)" stroke="#9c8a6e" strokeWidth="1.6"/>
    <rect x="40" y="340" width="480" height="430" fill="url(#s1-stain)" opacity="0.9"/>
    <rect x="26" y="316" width="508" height="30" fill="#efe3c9" stroke="#9c8a6e" strokeWidth="1.6"/><rect x="26" y="344" width="508" height="9" fill="#4a4678" opacity="0.22"/>
    <rect x="26" y="316" width="508" height="6" fill="#fffaf0" opacity="0.7"/>
    {/* wall plaster bands, cracks and peeling patches */}
    <path d="M40,700 H520" stroke="#b09874" strokeWidth="1.2" opacity="0.8"/><rect x="40" y="702" width="480" height="68" fill="#b9a583" opacity="0.5"/>
    <path d="M330,350 l8,34 l-10,22 l12,40 l-6,26" stroke="#7b6a52" strokeWidth="1.5" fill="none"/>
    <path d="M60,430 q30,-10 50,10 q-8,40 -42,32 q-18,-20 -8,-42" fill="#d9c9a7" opacity="0.7"/>
    {/* the steel door */}
    <rect x="372" y="520" width="112" height="250" fill="#2f6b6f" stroke="#17393c" strokeWidth="2"/>
    <rect x="372" y="520" width="38" height="250" fill="#fff" opacity="0.12"/>
    <rect x="386" y="540" width="84" height="92" fill="none" stroke="#1e494d" strokeWidth="2"/><rect x="386" y="652" width="84" height="100" fill="none" stroke="#1e494d" strokeWidth="2"/>
    <circle cx="460" cy="650" r="6" fill="#d9ba6a" stroke="#7a5f20"/><rect x="366" y="512" width="124" height="10" fill="#efe3c9" stroke="#9c8a6e"/>
    {/* meter box and conduit */}
    <rect x="440" y="410" width="58" height="70" fill="#c9cfd2" stroke="#6a7378" strokeWidth="1.4"/><circle cx="469" cy="440" r="15" fill="#fbfbf6" stroke="#6a7378"/><path d="M469,440 l6,-7" stroke="#b6382a" strokeWidth="2"/>
    <path d="M469,480 V510" stroke="#6a7378" strokeWidth="5"/>
    {/* water tank on the stair-room roof */}
    <Tank x={140} y={316} s={3.2} col="#262b32" lid="#39424b"/>
    <Thermometer x={236} y={565} level={level} f={f}/>
  </g>
);

const Kites: React.FC<{f: number}> = ({f}) => (
  <g stroke="#3b3a44" strokeWidth="2.4" fill="none" strokeLinecap="round">
    {[[1180, 190, 1], [1420, 150, 0.8], [980, 250, 0.7]].map(([x, y, s], i) => {
      const cx = x + 60 * Math.cos(f / 60 + i * 2.2), cy = y + 22 * Math.sin(f / 60 + i * 2.2) , fl = Math.sin(f / 7 + i) * 3;
      return <path key={i} transform={`translate(${cx} ${cy}) scale(${s})`} d={`M-22,${2 - fl} Q-10,${-9 + fl} 0,0 Q10,${-9 + fl} 22,${2 - fl}`}/>;
    })}
  </g>
);

const Clothes: React.FC<{f: number}> = ({f}) => {
  const sw = Math.sin(f / 22) * 3;
  return (
    <g>
      <Wire x1={1290} y1={560} x2={1650} y2={530} sag={34} w={1.5} c="#4a3d36"/>
      {[[1340, 562, "#e86a8a", 56], [1420, 568, "#f6f1e4", 62], [1510, 566, "#3e82b8", 58]].map(([x, y, c, h], i) => (
        <g key={i} transform={`translate(${x} ${(y as number) + 8 + i % 2 * 2}) skewX(${sw})`}>
          <path d={`M0,0 q-4,${(h as number) * 0.5} 2,${h} h34 q4,${-(h as number) * 0.5} -2,${-(h as number)} Z`} fill={c as string} stroke="#00000030" strokeWidth="1" opacity="0.96"/>
          <path d={`M4,6 q10,${(h as number) * 0.5} 4,${(h as number) - 12}`} stroke="#fff" strokeWidth="2" opacity="0.28" fill="none"/>
          <rect x="3" y="-4" width="5" height="9" rx="1.5" fill="#d8c27a"/><rect x="26" y="-4" width="5" height="9" rx="1.5" fill="#d8c27a"/>
        </g>
      ))}
    </g>
  );
};

const Pot: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="14" cy="2" rx="46" ry="7" fill="#4a4678" opacity="0.25" filter="url(#s1-blur2)"/>
    <path d="M-26,-48 L26,-48 L18,0 L-18,0 Z" fill="#c4683e" stroke="#7d3a1c" strokeWidth="1.2"/><rect x="-30" y="-58" width="60" height="12" rx="3" fill="#d27648" stroke="#7d3a1c" strokeWidth="1.2"/>
    <path d="M-14,-58 q-6,-20 -22,-22 M0,-58 q2,-30 -8,-48 M10,-58 q10,-24 26,-24" stroke="#8a8a3c" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {[[-36, -80], [-8, -108], [36, -82], [-24, -94], [22, -100]].map(([lx, ly], i) => <ellipse key={i} cx={lx} cy={ly + (i % 2) * 4} rx="9" ry="4.5" fill={i % 2 ? "#9a8a40" : "#7e8a3c"} transform={`rotate(${i * 36 - 40} ${lx} ${ly})`}/>)}
  </g>
);

const FloorBits: React.FC<{f: number}> = ({f}) => {
  const r = rng(5);
  const leaves = Array.from({length: 26}).map(() => ({x: 80 + r() * 1760, y: 790 + r() * 270, a: r() * 360, s: 0.6 + r() * 0.9, c: r()}));
  return (
    <g>
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.a}) scale(${l.s * (0.6 + (l.y - 790) / 400)})`}>
          <ellipse cx="3" cy="3" rx="13" ry="4.5" fill="#4a4678" opacity="0.2"/>
          <path d="M-12,0 Q0,-9 13,0 Q0,8 -12,0 Z" fill={l.c < 0.5 ? "#b98b4a" : "#9a7a3a"} stroke="#6b4c24" strokeWidth="0.8"/><path d="M-11,0 H12" stroke="#6b4c24" strokeWidth="0.8"/>
        </g>
      ))}
      {/* a coiled hose, dry */}
      <g transform="translate(700 990)"><ellipse cx="10" cy="8" rx="78" ry="16" fill="#4a4678" opacity="0.25" filter="url(#s1-blur6)"/>
        {[0, 1, 2].map((i) => <ellipse key={i} cx="0" cy={-i * 5} rx={60 - i * 9} ry={14 - i * 2} fill="none" stroke={i % 2 ? "#2f7d57" : "#3b9468"} strokeWidth="8"/>)}
        <ellipse cx="-12" cy="-12" rx="26" ry="5" fill="none" stroke="#6bc299" strokeWidth="2" opacity="0.6"/></g>
      {/* two bricks */}
      <g transform="translate(1010 800)"><polygon points="0,0 60,0 66,14 -4,14" fill="#b4573a" stroke="#6e2d1c"/><rect x="-4" y="14" width="70" height="12" fill="#8f3f27" stroke="#6e2d1c"/></g>
    </g>
  );
};

const Floor: React.FC = () => {
  const lines: React.ReactNode[] = [];
  for (let i = 0; i <= 9; i++) { const y = 720 + 360 * (1 - 1 / (1 + i * 0.42)); lines.push(<path key={`h${i}`} d={`M-100,${y} H2020`} stroke="#8d6f4c" strokeWidth={0.8 + i * 0.15} opacity="0.28"/>); }
  for (let i = -14; i <= 22; i++) { const x1080 = 960 + (i - 4) * 230, x720 = 960 + (x1080 - 960) * (290 / 650); lines.push(<path key={`v${i}`} d={`M${x720},720 L${x1080},1080`} stroke="#8d6f4c" strokeWidth="1" opacity="0.25"/>); }
  return (
    <g>
      <rect x="-120" y="716" width="2160" height="400" fill="url(#s1-floor)"/>
      <rect x="-120" y="716" width="2160" height="400" fill="url(#s1-floorTex)" opacity="0.5"/>
      {lines}
      <ellipse cx="360" cy="930" rx="520" ry="150" fill="#fff4cf" opacity="0.38" filter="url(#s1-blur20)"/>
      <rect x="-120" y="716" width="2160" height="46" fill="url(#s1-floorHaze)"/>
    </g>
  );
};

const Parapet: React.FC = () => (
  <g>
    <rect x="-120" y="562" width="2160" height="160" fill="url(#s1-par)" stroke="#a08c6c" strokeWidth="1.4"/>
    <rect x="-120" y="562" width="2160" height="160" fill="url(#s1-stain)" opacity="0.8"/>
    <rect x="-130" y="548" width="2180" height="20" fill="#efe3c9" stroke="#a08c6c" strokeWidth="1.4"/><rect x="-130" y="548" width="2180" height="5" fill="#fffaf0" opacity="0.8"/><rect x="-130" y="566" width="2180" height="10" fill="#4a4678" opacity="0.2"/>
    <rect x="-120" y="700" width="2160" height="22" fill="#4a4678" opacity="0.12"/>
    {[300, 840, 1310, 1700].map((x) => <g key={x}><rect x={x} y="666" width="46" height="22" fill="#6d6762" stroke="#3a3632" strokeWidth="1"/><rect x={x + 6} y="672" width="34" height="10" fill="#2e2b29"/></g>)}
    {[0.1, 0.3, 0.62, 0.9].map((q, i) => <path key={i} d={`M${q * 1900},568 q-4,34 3,${80 + i * 22}`} stroke="#8e7a58" strokeWidth="10" opacity="0.2" fill="none" strokeLinecap="round"/>)}
  </g>
);

const Defs: React.FC<{f: number}> = ({f}) => (
  <defs>
    <linearGradient id="s1-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5f9bd0"/><stop offset="0.3" stopColor="#9cc6e4"/><stop offset="0.52" stopColor="#e6ecdf"/><stop offset="0.66" stopColor="#f9e5b8"/><stop offset="1" stopColor="#f9e5b8"/></linearGradient>
    <radialGradient id="s1-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fffbe2" stopOpacity="1"/><stop offset="0.12" stopColor="#fff2b8" stopOpacity="0.95"/><stop offset="0.35" stopColor="#ffe29a" stopOpacity="0.45"/><stop offset="1" stopColor="#ffd98a" stopOpacity="0"/></radialGradient>
    <linearGradient id="s1-fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbeccb" stopOpacity="0"/><stop offset="1" stopColor="#fbeccb" stopOpacity="0.85"/></linearGradient>
    <linearGradient id="s1-mum" x1="0" x2="1"><stop offset="0" stopColor="#f2e3c1"/><stop offset="0.7" stopColor="#dccaa4"/><stop offset="1" stopColor="#bfae96"/></linearGradient>
    <linearGradient id="s1-par" x1="0" x2="1"><stop offset="0" stopColor="#efe0bf"/><stop offset="0.6" stopColor="#e1cfa8"/><stop offset="1" stopColor="#c7b697"/></linearGradient>
    <linearGradient id="s1-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ecd7b0"/><stop offset="1" stopColor="#b99b72"/></linearGradient>
    <linearGradient id="s1-floorHaze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff3cf" stopOpacity="0.7"/><stop offset="1" stopColor="#fff3cf" stopOpacity="0"/></linearGradient>
    <linearGradient id="s1-board" x1="0" x2="1"><stop offset="0" stopColor="#fffaf0"/><stop offset="1" stopColor="#e8dcc4"/></linearGradient>
    <linearGradient id="s1-mer" x1="0" x2="1"><stop offset="0" stopColor="#f0604a"/><stop offset="1" stopColor="#b8281a"/></linearGradient>
    <linearGradient id="s1-bkt" x1="0" x2="1"><stop offset="0" stopColor="#f08a5a"/><stop offset="0.6" stopColor="#d4502f"/><stop offset="1" stopColor="#a63520"/></linearGradient>
    <linearGradient id="s1-tank" x1="0" x2="1"><stop offset="0" stopColor="#4a5560"/><stop offset="0.45" stopColor="#252b32"/><stop offset="1" stopColor="#12161b"/></linearGradient>
    <filter id="s1-blur2" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>
    <filter id="s1-blur6" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="s1-blur20" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="22"/></filter>
    <filter id="s1-stain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="4" seed="5"/><feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.33  0 0 0 0 0.2  0 0 0 1.1 -0.45"/></filter>
    <filter id="s1-floorTex" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves="4" seed="9"/><feColorMatrix type="matrix" values="0 0 0 0 0.42  0 0 0 0 0.3  0 0 0 0 0.18  0 0 0 1.3 -0.55"/></filter>
    <filter id="s1-haze" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency={`0.004 ${0.028 + 0.0015 * Math.sin(f / 25)}`} numOctaves="2" seed={3 + Math.floor(f / 40)} result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale={9 + 3 * Math.sin(f / 9)} xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
);

export const SceneS001: React.FC<{f: number}> = ({f}) => {
  const t = f / 240, camX = lerp(-18, 18, t), camY = lerp(4, -4, t), zoom = 1.025 + 0.012 * t;
  const P = (p: number) => `translate(${-camX * p} ${-camY * p * 0.5})`;
  const lvl = lerp(0.18, TMAX.value / 50, eio(prog(f, 14, 70)));
  const c1 = eo(prog(f, 52, 18)), c2 = eo(prog(f, 112, 18));
  const num1 = TMAX.value * eo(prog(f, 58, 36)), num2 = RAIN.value * eo(prog(f, 118, 34));
  const pillA = eo(prog(f, 8, 16));
  const fadeIn = eo(prog(f, 0, 10));
  const rainTicks = 31;
  return (
    <AbsoluteFill style={{background: "#f3dfb6", opacity: fadeIn}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", inset: 0}}>
        <Defs f={f}/>
        <g transform={`translate(960 540) scale(${zoom}) translate(-960 -540)`}>
          <rect x="-100" y="-100" width="2200" height="860" fill="url(#s1-sky)"/>
          <circle cx={330 - camX * 0.05} cy="150" r="560" fill="url(#s1-sun)"/>
          <circle cx={330 - camX * 0.05} cy="150" r="46" fill="#fffbe6"/>
          {/* sun shafts */}
          <g opacity="0.2" style={{mixBlendMode: "screen"}} filter="url(#s1-blur20)">{[-5, 12, 28, 46].map((a, i) => <polygon key={i} points={`330,150 ${330 + 1900 * Math.cos((a * Math.PI) / 180)},${150 + 1900 * Math.sin((a * Math.PI) / 180)} ${330 + 1900 * Math.cos(((a + 5) * Math.PI) / 180)},${150 + 1900 * Math.sin(((a + 5) * Math.PI) / 180)}`} fill="#fff3c0"/>)}</g>
          <g transform={P(0.12)}><Kites f={f}/></g>
          <g filter="url(#s1-haze)">
            <g transform={P(0.14)}><FarCity f={f}/></g>
            <rect x="-100" y="400" width="2200" height="260" fill="url(#s1-fog)" opacity="0.65"/>
            <g transform={P(0.28)}><MidCity f={f}/></g>
            <rect x="-100" y="470" width="2200" height="190" fill="url(#s1-fog)" opacity="0.55"/>
          </g>
          <g transform={P(0.5)}>
            <NearBlocks f={f}/>
            <Gulmohar x={560} y={650} s={1.15} seed={4} f={f}/><Gulmohar x={1170} y={650} s={0.95} seed={9} f={f}/><Gulmohar x={1880} y={650} s={1.2} seed={13} f={f}/>
          </g>
          <g transform={P(0.6)}>
            <Pole x={820} y={650} h={330}/><Pole x={1560} y={650} h={300}/>
            <Wire x1={786} y1={342} x2={1526} y2={372} sag={36} sway={Math.sin(f / 30) * 2}/><Wire x1={850} y1={342} x2={1590} y2={372} sag={34} sway={Math.sin(f / 30 + 1) * 2}/>
            <Wire x1={806} y1={370} x2={1546} y2={398} sag={32}/><Wire x1={820} y1={342} x2={0} y2={300} sag={28}/><Wire x1={1560} y1={350} x2={2020} y2={316} sag={26}/>
          </g>
          <Haze f={f}/>
          <g transform={P(0.8)}>
            <Parapet/>
            <Pot x={940} y={560}/>
          </g>
          <g transform={P(0.95)}><Clothes f={f}/><WaterTank x={1750} y={738}/></g>
          <g transform={P(1)}>
            <Floor/>
            <Mumty f={f} level={lvl}/>
            {/* shadows of bucket and girl */}
            <ellipse cx="1200" cy="936" rx="80" ry="12" fill="#4a4678" opacity="0.28" filter="url(#s1-blur6)"/>
            <path d="M1440,962 C1520,950 1700,972 1860,1010 C1700,1022 1540,1006 1440,970 Z" fill="#4a4678" opacity="0.3" filter="url(#s1-blur6)"/>
            <FloorBits f={f}/>
            <Bucket x={1140} y={934} s={1.2}/>
            <g transform={`translate(1450 962) scale(${560 / 560})`}><Girl f={f}/></g>
          </g>
          {/* heat shimmer over the foreground floor, hot air */}
          <g opacity="0.5" style={{mixBlendMode: "screen"}}>
            {Array.from({length: 4}).map((_, i) => { const y = 760 + i * 30; let d = `M-100,${y}`; for (let x = -100; x <= 2020; x += 80) d += ` Q${x + 20},${y - 9 * Math.sin(f / 14 + x / 120 + i)} ${x + 40},${y} T${x + 80},${y}`; return <path key={i} d={d} stroke="#fffbe8" strokeWidth="3" fill="none" opacity={0.35 - i * 0.06} filter="url(#s1-blur2)"/>; })}
          </g>
          {/* drifting dust in the light */}
          {Array.from({length: 38}).map((_, i) => { const r = rng(i + 77); const x = ((r() * 2200 + f * (0.4 + r() * 0.5)) % 2200) - 140, y = 100 + r() * 800 + 12 * Math.sin(f / 30 + i); return <circle key={i} cx={x} cy={y} r={0.8 + r() * 2.1} fill="#fffbe6" opacity={0.25 + r() * 0.35}/>; })}
          <rect x="-100" y="-100" width="2200" height="1300" fill="#ffe7a8" opacity="0.1" style={{mixBlendMode: "soft-light"}}/>
        </g>
      </svg>
      <PaperFinish id="s1pf" grain={0.55} vignette={0.38}/>
      <Pill x={96} y={72} text="IMD NORMALS 1991–2020" a={pillA}/>
      {/* card 1: heat */}
      <div style={cardStyle(610, 150, 620, 318, c1)}>
        <div style={{padding: "26px 34px 0", fontFamily: SANS, fontWeight: 700, fontSize: 23, letterSpacing: "0.18em", color: "#8c4a22", textTransform: "uppercase"}}>May afternoons, Nagpur</div>
        <div style={{padding: "0 34px", fontFamily: SERIF, fontWeight: 600, fontSize: 170, lineHeight: 1.05, color: "#bd3a1e", letterSpacing: "-0.02em", fontVariantNumeric: "lining-nums tabular-nums", display: "flex", alignItems: "baseline"}}>
          {num1.toFixed(1)}<span style={{fontSize: 78, fontWeight: 500, marginLeft: 6, color: "#d1593a"}}>{"°C"}</span>
        </div>
        <div style={{margin: "8px 34px 0", height: 14, borderRadius: 8, background: "linear-gradient(90deg,#f6dd8a,#f2a444 45%,#d8442a 80%,#9b1f1a)", position: "relative", boxShadow: "inset 0 1px 2px rgba(80,30,10,.35)"}}>
          <div style={{position: "absolute", left: `${clamp((num1 - 20) / 30) * 100}%`, top: -8, width: 6, height: 30, borderRadius: 3, background: "#3a1c10", boxShadow: "0 0 0 3px rgba(255,250,235,.9)", transform: "translateX(-3px)"}}/>
        </div>
      </div>
      {/* card 2: rain days */}
      <div style={cardStyle(690, 500, 620, 260, c2, 26, "40,100,150")}>
        <div style={{padding: "22px 34px 0", fontFamily: SANS, fontWeight: 700, fontSize: 23, letterSpacing: "0.18em", color: "#245a85", textTransform: "uppercase"}}>with rain in May</div>
        <div style={{padding: "0 34px", fontFamily: SERIF, fontWeight: 600, fontSize: 120, lineHeight: 1.1, color: "#1c5f93", letterSpacing: "-0.02em", fontVariantNumeric: "lining-nums tabular-nums", display: "flex", alignItems: "baseline"}}>
          {num2.toFixed(1)}<span style={{fontSize: 56, fontWeight: 500, marginLeft: 12, color: "#3b86bd"}}>days</span>
        </div>
        <div style={{margin: "10px 34px 0", display: "flex", gap: 4.5}}>
          {Array.from({length: rainTicks}).map((_, i) => { const fill = clamp(num2 - i); return (
            <div key={i} style={{flex: 1, height: 30, borderRadius: 3, background: "#e6ddca", position: "relative", overflow: "hidden", boxShadow: "inset 0 1px 1px rgba(80,60,30,.25)"}}>
              <div style={{position: "absolute", inset: 0, width: `${fill * 100}%`, background: "linear-gradient(#59a5db,#1f6aa6)"}}/>
            </div>); })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const S001: React.FC<{f: number}> = ({f}) => <Fonts><SceneS001 f={f}/></Fonts>;
