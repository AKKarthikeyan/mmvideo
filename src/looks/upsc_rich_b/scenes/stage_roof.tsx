// Look B rooftop (the film's s001 set, reused and parametrised by time): a Nagpur flat roof with parapet, stair room, tanks, a city behind.
// Everything here is the s001 art; `time` only changes sky, light and weather grade. The stage scene draws actors and props over it.
import React, {useMemo} from "react";
import {W, H, Wire, eo, lerp, prog, rng, clamp} from "../kit";

export type TimeName = "may" | "july" | "noon" | "burst";
const SKY: Record<TimeName, string[]> = {
  may: ["#5f9bd0", "#9cc6e4", "#e6ecdf", "#f9e5b8", "#f9e5b8"], noon: ["#4a92d8", "#8cc3ec", "#dcebf0", "#f6f1da", "#f6f1da"],
  july: ["#6f7c89", "#93a0aa", "#b6bfc2", "#cdd0c8", "#cdd0c8"], burst: ["#232a35", "#36404d", "#525d68", "#6a7077", "#6a7077"],
};
const FOG: Record<TimeName, string> = {may: "#fbeccb", noon: "#fbf3d6", july: "#c4cdd0", burst: "#6a747c"};
export const ROOF_GRADE: Record<TimeName, {mul: string; mulA: number; filter: string}> = {
  may: {mul: "#ffe7a8", mulA: 0, filter: "none"}, noon: {mul: "#ffffff", mulA: 0, filter: "saturate(0.92) brightness(1.04)"},
  july: {mul: "#a8b8c8", mulA: 0.5, filter: "saturate(0.72) brightness(0.95)"}, burst: {mul: "#5f6f82", mulA: 0.55, filter: "saturate(0.6) brightness(0.8)"},
};

/** soft drifting rain clouds across the upper sky (july, burst) */
const SkyClouds: React.FC<{f: number; dark: boolean}> = ({f, dark}) => {
  const bl = useMemo(() => { const r = rng(41); return Array.from({length: 16}).map(() => ({x: r() * 2400 - 200, y: -40 + r() * 330, w: 260 + r() * 360, h: 60 + r() * 80, v: 0.12 + r() * 0.3, a: 0.35 + r() * 0.45})); }, []);
  return (
    <g filter="url(#s1-blur20)">
      {bl.map((b, i) => <ellipse key={i} cx={((b.x + f * b.v + 300) % 2500) - 300} cy={b.y} rx={b.w} ry={b.h} fill={dark ? (i % 3 ? "#202833" : "#30394a") : (i % 3 ? "#8e9aa4" : "#b9c2c8")} opacity={b.a}/>)}
    </g>
  );
};
const Puddles: React.FC<{f: number; rain: boolean}> = ({f, rain}) => (
  <g>
    {[[420, 880, 200], [1010, 960, 250], [1560, 860, 180], [260, 1010, 150]].map(([x, y, w], i) => (
      <g key={i}>
        <ellipse cx={x} cy={y} rx={w} ry={w * 0.12} fill="#8fa5b6" opacity="0.5"/><ellipse cx={x - w * 0.2} cy={y - 3} rx={w * 0.55} ry={w * 0.045} fill="#e7f0f5" opacity="0.5"/>
        {rain && [0, 1, 2].map((k) => { const t = ((f / 22 + k / 3 + i * 0.27) % 1); return <ellipse key={k} cx={x + (k - 1) * w * 0.3} cy={y} rx={t * 26} ry={t * 5} fill="none" stroke="#f1f7fa" strokeWidth="1.6" opacity={(1 - t) * 0.8}/>; })}
      </g>
    ))}
  </g>
);

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

const Mumty: React.FC<{f: number}> = ({f}) => (
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

const Defs: React.FC<{f: number; time: TimeName}> = ({f, time}) => (
  <defs>
    <linearGradient id="s1-sky" x1="0" y1="0" x2="0" y2="1">{[0, 0.3, 0.52, 0.66, 1].map((o, i) => <stop key={i} offset={o} stopColor={SKY[time][i]}/>)}</linearGradient>
    <radialGradient id="s1-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fffbe2" stopOpacity="1"/><stop offset="0.12" stopColor="#fff2b8" stopOpacity="0.95"/><stop offset="0.35" stopColor="#ffe29a" stopOpacity="0.45"/><stop offset="1" stopColor="#ffd98a" stopOpacity="0"/></radialGradient>
    <linearGradient id="s1-fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={FOG[time]} stopOpacity="0"/><stop offset="1" stopColor={FOG[time]} stopOpacity="0.85"/></linearGradient>
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


export const ROOF_FLOOR = 716;
/** the whole rooftop, sky to floor, as a <g> in 1920 x 1080 art coordinates. camX/camY drive the parallax (the stage's slow camera). */
export const RoofBack: React.FC<{f: number; time: TimeName; rain?: boolean; camX: number; camY: number}> = ({f, time, rain = false, camX, camY}) => {
  const P = (p: number) => `translate(${-camX * p} ${-camY * p * 0.5})`;
  const bright = time === "may" || time === "noon", gr = ROOF_GRADE[time];
  const sx = (time === "noon" ? 1010 : 330) - camX * 0.05, sy = time === "noon" ? 40 : 150;
  return (
    <g>
      <Defs f={f} time={time}/>
      <rect x="-100" y="-100" width="2200" height="860" fill="url(#s1-sky)"/>
      {bright && <>
        <circle cx={sx} cy={sy} r={time === "noon" ? 420 : 560} fill="url(#s1-sun)"/><circle cx={sx} cy={sy} r={time === "noon" ? 38 : 46} fill="#fffbe6"/>
        <g opacity="0.2" style={{mixBlendMode: "screen"}} filter="url(#s1-blur20)">{[-5, 12, 28, 46].map((a, i) => <polygon key={i} points={`${sx},${sy} ${sx + 1900 * Math.cos((a * Math.PI) / 180)},${sy + 1900 * Math.sin((a * Math.PI) / 180)} ${sx + 1900 * Math.cos(((a + 5) * Math.PI) / 180)},${sy + 1900 * Math.sin(((a + 5) * Math.PI) / 180)}`} fill="#fff3c0"/>)}</g>
        <g transform={P(0.12)}><Kites f={f}/></g>
      </>}
      {!bright && <SkyClouds f={f} dark={time === "burst"}/>}
      <g filter={bright ? "url(#s1-haze)" : undefined}>
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
      {bright && <Haze f={f}/>}
      <g transform={P(0.8)}>
        <Parapet/>
        <Pot x={940} y={560}/>
      </g>
      <g transform={P(0.95)}><Clothes f={f}/><WaterTank x={1750} y={738}/></g>
      <g transform={P(1)}>
        <Floor/>
        <Mumty f={f}/>
        {!bright && <Puddles f={f} rain={rain}/>}
        <FloorBits f={f}/>
      </g>
      {bright && <g opacity="0.5" style={{mixBlendMode: "screen"}}>
        {Array.from({length: 4}).map((_, i) => { const y = 760 + i * 30; let d = `M-100,${y}`; for (let x = -100; x <= 2020; x += 80) d += ` Q${x + 20},${y - 9 * Math.sin(f / 14 + x / 120 + i)} ${x + 40},${y} T${x + 80},${y}`; return <path key={i} d={d} stroke="#fffbe8" strokeWidth="3" fill="none" opacity={0.35 - i * 0.06} filter="url(#s1-blur2)"/>; })}
      </g>}
      {bright && Array.from({length: 38}).map((_, i) => { const r = rng(i + 77); const x = ((r() * 2200 + f * (0.4 + r() * 0.5)) % 2200) - 140, y = 100 + r() * 800 + 12 * Math.sin(f / 30 + i); return <circle key={i} cx={x} cy={y} r={0.8 + r() * 2.1} fill="#fffbe6" opacity={0.25 + r() * 0.35}/>; })}
      <rect x="-100" y="-100" width="2200" height="1300" fill={gr.mul} opacity={bright ? 0.1 : gr.mulA} style={{mixBlendMode: bright ? "soft-light" : "multiply"}}/>
    </g>
  );
};
