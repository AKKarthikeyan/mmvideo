// Shared parts for the ECO-16 Part 1 analogy scenes of builder E2 (demand-side diagrams): room and desk, coins, notes, wallet, certificates, brass plaque,
// padlock, clock, tags, hand, brass balance, glass jar. Every motion is a smooth function of f; every printed word comes from a spec label via L()/ELabel.
import React from "react";
import {SANS, SERIF, W, H, cardStyle, clamp, eo, eio, rng} from "../kit";
import {lab as labQ} from "../../cartoon/long/figs";
import {prog, type AP} from "./analogy_kit";

export type LI = {text?: string; lab?: string; key: string};
export const tryAt = (p: AP, key: string, fb: number) => { try { return p.at(key); } catch { return fb; } };
/** a spec label by key: {text, at}; null when the spec has no such label. `fb` is used when the storyboard has no reveal for the key. */
export const L = (p: AP, key: string, fb = 1e9): {text: string; at: number} | null => {
  const l = (((p.spec as any).labels ?? []) as LI[]).find((x) => x.key === key);
  return l ? {text: l.lab ? labQ(l.lab) : l.text ?? "", at: tryAt(p, key, fb)} : null;
};
/** plain time of a key (event or label) */
export const T = (p: AP, key: string, fb = 1e9) => tryAt(p, key, fb);

export const E2Defs: React.FC = () => (
  <defs>
    <linearGradient id="e2-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe9a0"/><stop offset="0.5" stopColor="#e9b948"/><stop offset="1" stopColor="#b9801f"/></linearGradient>
    <radialGradient id="e2-coin" cx="38%" cy="32%" r="75%"><stop offset="0" stopColor="#fff2b8"/><stop offset="0.55" stopColor="#f0c04e"/><stop offset="1" stopColor="#c28a22"/></radialGradient>
    <linearGradient id="e2-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6dc94"/><stop offset="0.45" stopColor="#d2a24a"/><stop offset="1" stopColor="#8e6522"/></linearGradient>
    <linearGradient id="e2-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d4a56c"/><stop offset="1" stopColor="#7e4f28"/></linearGradient>
    <linearGradient id="e2-leather" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c0814a"/><stop offset="1" stopColor="#7a4524"/></linearGradient>
    <linearGradient id="e2-paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fffaf0"/><stop offset="1" stopColor="#efdfbb"/></linearGradient>
    <linearGradient id="e2-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#eef3f6"/><stop offset="1" stopColor="#8a9ba6"/></linearGradient>
    <linearGradient id="e2-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0.6"/><stop offset="0.3" stopColor="#e1f1f6" stopOpacity="0.16"/><stop offset="0.8" stopColor="#bcd6e2" stopOpacity="0.14"/><stop offset="1" stopColor="#fff" stopOpacity="0.5"/></linearGradient>
    <linearGradient id="e2-skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e3b88e"/><stop offset="1" stopColor="#b6805a"/></linearGradient>
    <linearGradient id="e2-note" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d6ecd8"/><stop offset="1" stopColor="#7fb293"/></linearGradient>
    <linearGradient id="e2-shaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff2c4" stopOpacity="0.5"/><stop offset="1" stopColor="#fff2c4" stopOpacity="0.04"/></linearGradient>
    <linearGradient id="e2-win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fc0e6"/><stop offset="1" stopColor="#e9efe0"/></linearGradient>
  </defs>
);

// ---- room and desk -----------------------------------------------------------------------------------------------------------
export const Room: React.FC<{f: number; deskY?: number; variant?: "shop" | "study" | "bank"; winX?: number; dim?: number}> = ({f, deskY = 770, variant = "shop", winX = 1330, dim = 0}) => {
  const cool = variant === "bank", w0 = cool ? "#eceff3" : "#f7e9cd", w1 = cool ? "#cdd5e0" : "#e5d0a4", rail = cool ? "#a9b4c4" : "#c7a56e";
  const r = rng(variant.length * 31 + 7);
  const breathe = 0.85 + 0.15 * Math.sin(f / 40);
  return (
    <g>
      <E2Defs/>
      <defs>
        <linearGradient id="e2-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={w0}/><stop offset="1" stopColor={w1}/></linearGradient>
        <clipPath id="e2-winclip"><rect x={winX} y={120} width={360} height={300} rx={6}/></clipPath>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#e2-wall)"/>
      {Array.from({length: 11}, (_, i) => <rect key={i} x={i * 180 - 20} y={-20} width={90} height={deskY} fill={cool ? "#dfe5ee" : "#f1dfba"} opacity={0.28}/>)}
      {/* far shapes: pale and bluish */}
      {variant === "shop" && [0, 1].map((row) => (
        <g key={row} opacity={0.5}>
          <rect x={110} y={300 + row * 150} width={540} height={12} rx={3} fill="#a98757"/>
          <rect x={110} y={312 + row * 150} width={540} height={5} fill="#7e6038" opacity={0.5}/>
          {Array.from({length: 7}, (_, i) => { const hh = 40 + r() * 52, ww = 38 + r() * 26, x = 130 + i * 74; return <g key={i}><rect x={x} y={300 + row * 150 - hh} width={ww} height={hh} rx={8} fill={["#9fb8c9", "#c9a98a", "#a9c3a4", "#d3b9a0"][(i + row) % 4]}/><rect x={x + 5} y={300 + row * 150 - hh - 9} width={ww - 10} height={10} rx={3} fill="#8b7c6a"/></g>; })}
        </g>
      ))}
      {variant === "study" && (
        <g opacity={0.55}>
          <rect x={100} y={170} width={460} height={deskY - 170} rx={6} fill="#a98757"/>
          {[0, 1, 2, 3].map((row) => (
            <g key={row}><rect x={114} y={186 + row * 140} width={432} height={128} fill="#d9c49c" opacity={0.7}/>
              {Array.from({length: 13}, (_, i) => { const hh = 80 + r() * 40; return <rect key={i} x={120 + i * 33} y={186 + row * 140 + 128 - hh} width={26 + r() * 5} height={hh} fill={["#8aa5bd", "#b86a52", "#7ea184", "#c9a35d", "#8f7aa8"][Math.floor(r() * 5)]}/>; })}
            </g>
          ))}
        </g>
      )}
      {variant === "bank" && (
        <g opacity={0.45}>
          {[160, 400].map((x) => <g key={x}><path d={`M${x},${deskY - 60} V300 Q${x + 90},170 ${x + 180},300 V${deskY - 60} Z`} fill="#c3ccd9" stroke="#9aa6b8" strokeWidth={4}/><path d={`M${x + 24},${deskY - 60} V310 Q${x + 90},210 ${x + 156},310 V${deskY - 60} Z`} fill="#dfe6f0"/></g>)}
        </g>
      )}
      {/* window with a hazy view */}
      <g>
        <rect x={winX - 16} y={104} width={392} height={332} rx={12} fill="#9b6f3f" stroke="#6e4824" strokeWidth={3}/>
        <g clipPath="url(#e2-winclip)">
          <rect x={winX} y={120} width={360} height={300} fill="url(#e2-win)"/>
          <ellipse cx={winX + 270 + Math.sin(f / 90) * 12} cy={190} rx={80} ry={24} fill="#fff" opacity={0.85}/>
          <ellipse cx={winX + 220 + Math.sin(f / 90) * 12} cy={202} rx={60} ry={20} fill="#fff" opacity={0.85}/>
          <path d={`M${winX},330 Q${winX + 90},270 ${winX + 190},320 T${winX + 360},300 V420 H${winX} Z`} fill="#b3c9d6"/>
          <path d={`M${winX},370 Q${winX + 120},330 ${winX + 230},366 T${winX + 360},350 V420 H${winX} Z`} fill="#9bb996"/>
        </g>
        <path d={`M${winX + 180},120 V420 M${winX},270 H${winX + 360}`} stroke="#8a5f33" strokeWidth={8}/>
        <rect x={winX - 22} y={430} width={404} height={16} rx={5} fill="#b98a52"/>
      </g>
      {/* sun shaft */}
      <polygon points={`${winX + 10},420 ${winX + 350},420 ${winX - 250},${deskY + 150} ${winX - 780},${deskY + 150}`} fill="url(#e2-shaft)" opacity={0.42 * breathe * (1 - dim)}/>
      {Array.from({length: 14}, (_, i) => { const u = (f * 0.004 + i * 0.071) % 1, x = winX + 20 + (i * 53) % 320 - u * (320 + (i % 3) * 120), y = 430 + u * (deskY - 330) + Math.sin(f / 30 + i) * 10; return <circle key={i} cx={x} cy={y} r={2 + (i % 3)} fill="#fff6d6" opacity={0.55 * Math.sin(u * Math.PI) * (1 - dim)}/>; })}
      {/* wainscot */}
      <rect x={-40} y={deskY - 230} width={W + 80} height={240} fill={cool ? "#aab6c7" : "#b88b57"} opacity={0.55}/>
      {Array.from({length: 9}, (_, i) => <rect key={i} x={i * 230 - 30} y={deskY - 206} width={190} height={190} rx={6} fill="none" stroke={cool ? "#8794a8" : "#8e6532"} strokeWidth={2} opacity={0.5}/>)}
      <rect x={-40} y={deskY - 238} width={W + 80} height={14} fill={rail}/>
      <DeskTop y0={deskY} f={f}/>
    </g>
  );
};

export const DeskTop: React.FC<{y0: number; f?: number}> = ({y0}) => (
  <g>
    <rect x={-40} y={y0} width={W + 80} height={H - y0 + 80} fill="url(#e2-wood)"/>
    {Array.from({length: 9}, (_, i) => <path key={i} d={`M-40,${y0 + 26 + i * 32} Q960,${y0 + 18 + i * 32 + (i % 2) * 9} 1960,${y0 + 26 + i * 32}`} stroke="#6e4524" strokeWidth={1.6} fill="none" opacity={0.45}/>)}
    <ellipse cx={560} cy={y0 + 60} rx={620} ry={46} fill="#fff1c8" opacity={0.16} filter="url(#ak-blur22)"/>
    <rect x={-40} y={y0 - 4} width={W + 80} height={8} fill="#f0d49c" opacity={0.85}/>
    <rect x={-40} y={y0 + 4} width={W + 80} height={4} fill="#5a3418" opacity={0.18}/>
  </g>
);

/** a soft contact shadow */
export const Shade: React.FC<{x: number; y: number; rx: number; ry?: number; o?: number}> = ({x, y, rx, ry = 12, o = 0.3}) => <ellipse cx={x + rx * 0.08} cy={y} rx={rx} ry={ry} fill="#2a1808" opacity={o} filter="url(#ak-blur8)"/>;

// ---- coins, notes --------------------------------------------------------------------------------------------------------------
const STAR = (() => { const p: string[] = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? 0.2 : 0.46; p.push(`${(Math.cos(a) * rr).toFixed(3)},${(Math.sin(a) * rr).toFixed(3)}`); } return p.join(" "); })();
/** a generic coin (disc, rim, plain star), `spin` in radians makes it flip about its vertical axis */
export const Coin: React.FC<{x: number; y: number; r?: number; spin?: number; op?: number; rot?: number}> = ({x, y, r = 26, spin = 0, op = 1, rot = 0}) => {
  const sx = Math.max(0.12, Math.abs(Math.cos(spin)));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sx} 1)`} opacity={op}>
      <ellipse cx={0} cy={r * 0.16} rx={r} ry={r} fill="#8c5f18"/>
      <circle r={r} fill="url(#e2-coin)" stroke="#a8741c" strokeWidth={r * 0.07}/>
      <circle r={r * 0.78} fill="none" stroke="#b9831f" strokeWidth={r * 0.06} opacity={0.8}/>
      <polygon points={STAR} transform={`scale(${r * 1.4})`} fill="#c58f26" opacity={0.85}/>
      <path d={`M${-r * 0.62},${-r * 0.3} A${r * 0.7},${r * 0.7} 0 0 1 ${-r * 0.1},${-r * 0.7}`} stroke="#fffbe0" strokeWidth={r * 0.1} fill="none" strokeLinecap="round" opacity={0.8}/>
    </g>
  );
};

/** a plain generic banknote (no portrait, no emblem), centred at x,y */
export const Note: React.FC<{x: number; y: number; w?: number; rot?: number; op?: number; hue?: "green" | "blue"}> = ({x, y, w = 150, rot = 0, op = 1, hue = "green"}) => {
  const h = w * 0.46, c1 = hue === "green" ? "url(#e2-note)" : "#9fc2dc", edge = hue === "green" ? "#3f7a5c" : "#34688e";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={op}>
      <rect x={-w / 2 + 3} y={-h / 2 + 5} width={w} height={h} rx={5} fill="#2a1808" opacity={0.22}/>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={5} fill={c1} stroke={edge} strokeWidth={2}/>
      <rect x={-w / 2 + 7} y={-h / 2 + 7} width={w - 14} height={h - 14} rx={3} fill="none" stroke={edge} strokeWidth={1.2} opacity={0.7}/>
      {[0.2, 0.14, 0.08].map((k, i) => <ellipse key={i} cx={0} cy={0} rx={w * (0.2 - k * 0.5 + 0.1)} ry={h * (0.34 - k * 0.5 + 0.1)} fill="none" stroke={edge} strokeWidth={1} opacity={0.55}/>)}
      <ellipse cx={0} cy={0} rx={w * 0.1} ry={h * 0.22} fill={edge} opacity={0.2}/>
      <text x={-w / 2 + 13} y={-h / 2 + 24} fontFamily={SERIF} fontWeight={700} fontSize={w * 0.14} fill={edge} opacity={0.85}>₹</text>
      <text x={w / 2 - 13} y={h / 2 - 12} textAnchor="end" fontFamily={SERIF} fontWeight={700} fontSize={w * 0.14} fill={edge} opacity={0.85}>₹</text>
      <rect x={w * 0.24} y={-h * 0.3} width={w * 0.14} height={h * 0.6} fill={edge} opacity={0.18}/>
    </g>
  );
};

/** a small heap of coins lying on a surface (n coins) */
export const CoinHeap: React.FC<{x: number; y: number; n: number; r?: number; seed?: number}> = ({x, y, n, r = 22, seed = 1}) => {
  const rd = rng(seed * 11 + 3);
  return <g>{Array.from({length: Math.max(0, Math.floor(n))}, (_, i) => { const row = Math.floor(Math.sqrt(i * 2)), col = i - (row * row) / 2; return <Coin key={i} x={x + (col - row / 2.4) * r * 1.5 + (rd() - 0.5) * 6} y={y - row * r * 0.55 + (rd() - 0.5) * 3} r={r} spin={0.5 + rd() * 0.6}/>; })}</g>;
};

// ---- wallet ---------------------------------------------------------------------------------------------------------------------
/** an open leather wallet, front view, base centre at x,y. fat 0..1: how full (thicker body, more notes). */
export const Wallet: React.FC<{x: number; y: number; s?: number; fat?: number; coins?: number; f?: number; glow?: number; notes?: number; inside?: React.ReactNode}> = ({x, y, s = 1, fat = 0.5, coins = 0, f = 0, glow = 0, notes: nOver, inside}) => {
  const bh = 120 + fat * 52, notes = nOver ?? Math.round(1 + fat * 5), bulge = fat * 16;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shade x={0} y={4} rx={188} ry={18} o={0.34}/>
      {glow > 0.01 && <ellipse cx={0} cy={-bh / 2} rx={250} ry={150} fill="#ffd37a" opacity={0.35 * glow} filter="url(#ak-blur22)"/>}
      {/* back panel */}
      <path d={`M-160,0 L-160,${-bh - 18} Q-160,${-bh - 40} -138,${-bh - 40} L138,${-bh - 40} Q160,${-bh - 40} 160,${-bh - 18} L160,0 Z`} fill="#5b3419" stroke="#3d2210" strokeWidth={2}/>
      {/* notes standing in the wallet */}
      {Array.from({length: notes}, (_, i) => <Note key={i} x={-52 + i * 24 + (i % 2) * 6} y={-bh - 6 - (i % 3) * 14 - fat * 10} w={142} rot={-9 + i * 5.2} hue={i % 2 ? "green" : "blue"}/>)}
      {coins > 0 && <CoinHeap x={96} y={-bh - 10} n={coins} r={19} seed={4}/>}
      {inside}
      {/* front pocket */}
      <path d={`M-168,0 L-168,${-bh + 10 - bulge} Q-168,${-bh - 6 - bulge} -148,${-bh - 6 - bulge} L148,${-bh - 6 - bulge} Q168,${-bh - 6 - bulge} 168,${-bh + 10 - bulge} L168,0 Z`} fill="url(#e2-leather)" stroke="#6a3a1c" strokeWidth={2.4}/>
      <path d={`M-150,${-bh + 8 - bulge} L150,${-bh + 8 - bulge}`} stroke="#f0c48a" strokeWidth={2.4} strokeDasharray="9 6" opacity={0.8}/>
      <path d={`M-150,-10 L150,-10`} stroke="#f0c48a" strokeWidth={2} strokeDasharray="9 6" opacity={0.6}/>
      <path d={`M-168,${-bh - 6 - bulge} L168,${-bh - 6 - bulge}`} stroke="#e8b678" strokeWidth={4} opacity={0.7}/>
      <rect x={-150} y={-bh + 26 - bulge} width={22} height={bh - 40 + bulge} rx={10} fill="#fff" opacity={0.1}/>
      <circle cx={0} cy={-bh * 0.46} r={15} fill="url(#e2-brass)" stroke="#7a521a" strokeWidth={2}/>
      <circle cx={-4} cy={-bh * 0.46 - 4} r={5} fill="#fff6cf" opacity={0.7}/>
    </g>
  );
};

// ---- certificates and plaques -------------------------------------------------------------------------------------------------
/** a bond or share certificate (generic: border, rosettes, seal), centred at x,y */
export const Cert: React.FC<{x: number; y: number; w?: number; rot?: number; word?: string; ink?: string; op?: number}> = ({x, y, w = 230, rot = 0, word = "BOND", ink = "#2b4d72", op = 1}) => {
  const h = w * 0.68;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={op}>
      <rect x={-w / 2 + 5} y={-h / 2 + 8} width={w} height={h} rx={5} fill="#2a1808" opacity={0.25}/>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={5} fill="url(#e2-paper)" stroke="#a98a52" strokeWidth={2}/>
      <rect x={-w / 2 + 8} y={-h / 2 + 8} width={w - 16} height={h - 16} rx={3} fill="none" stroke={ink} strokeWidth={2.4}/>
      <rect x={-w / 2 + 15} y={-h / 2 + 15} width={w - 30} height={h - 30} rx={2} fill="none" stroke="#c99a3c" strokeWidth={1.4}/>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <g key={i} transform={`translate(${a * (w / 2 - 24)} ${b * (h / 2 - 24)})`}><circle r={9} fill="none" stroke={ink} strokeWidth={1.4}/><circle r={4} fill="#c99a3c"/>{Array.from({length: 8}, (_, k) => <path key={k} d={`M0,-9 V-14`} stroke={ink} strokeWidth={1} transform={`rotate(${k * 45})`}/>)}</g>)}
      <text x={0} y={-h * 0.14} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={w * 0.17} letterSpacing={w * 0.03} fill={ink}>{word}</text>
      {[0.02, 0.1, 0.18].map((k, i) => <rect key={i} x={-w * (0.3 - i * 0.04)} y={h * k + 6} width={w * (0.6 - i * 0.08)} height={3.4} rx={1.7} fill={ink} opacity={0.4}/>)}
      <g transform={`translate(${w * 0.3} ${h * 0.24})`}>
        <path d="M-8,10 L-14,34 L-3,28 L2,38 L6,12 Z" fill="#b42f2a"/>
        <circle r={15} fill="#c9382f" stroke="#8c1f1a" strokeWidth={2}/><circle r={9} fill="none" stroke="#f1b0a0" strokeWidth={1.4}/>
      </g>
    </g>
  );
};

/** a brass name plate with engraved serif text. The text is a spec label (name and year only). */
export const Plaque: React.FC<{x: number; y: number; w: number; text: string; f: number; at: number; size?: number}> = ({x, y, w, text, f, at, size = 40}) => {
  const a = eo(prog(f, at, 16));
  if (a <= 0.001) return null;
  const h = size * 1.9;
  return (
    <g transform={`translate(${x} ${y + (1 - a) * -26}) rotate(${(1 - a) * -3})`} opacity={a}>
      <rect x={-w / 2 + 6} y={-h / 2 + 12} width={w} height={h} rx={12} fill="#2a1808" opacity={0.3}/>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
      <rect x={-w / 2 + 9} y={-h / 2 + 9} width={w - 18} height={h - 18} rx={7} fill="none" stroke="#6c4a16" strokeWidth={1.8} opacity={0.7}/>
      <rect x={-w / 2 + 12} y={-h / 2 + 11} width={w - 24} height={5} rx={2.5} fill="#fff3c0" opacity={0.55}/>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j], k) => <g key={k} transform={`translate(${i * (w / 2 - 20)} ${j * (h / 2 - 17)})`}><circle r={5.5} fill="#e9cf8a" stroke="#6c4a16" strokeWidth={1.4}/><path d="M-3,-3 L3,3" stroke="#6c4a16" strokeWidth={1.4}/></g>)}
      <text x={0} y={size * 0.34 + 2} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={size} letterSpacing={size * 0.08} fill="#fff1bd" opacity={0.7}>{text}</text>
      <text x={0} y={size * 0.34} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={size} letterSpacing={size * 0.08} fill="#4a2f0a">{text}</text>
    </g>
  );
};

/** a padlock; closed 0 = open (shackle lifted and swung), 1 = clicked shut; `click` 0..1 is a burst ring right after closing */
export const Padlock: React.FC<{x: number; y: number; s?: number; closed: number; click?: number}> = ({x, y, s = 1, closed, click = 0}) => {
  const lift = (1 - closed) * 20, sw = (1 - closed) * 20;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shade x={0} y={30} rx={30} ry={6} o={0.3}/>
      <g transform={`translate(${sw > 0 ? 0 : 0} ${-lift}) rotate(${-sw * 0.9} 17 0)`}>
        <path d="M-17,0 V-24 Q-17,-48 0,-48 Q17,-48 17,-24 V0" fill="none" stroke="#6f7f8a" strokeWidth={9} strokeLinecap="round"/>
        <path d="M-17,0 V-24 Q-17,-48 0,-48 Q17,-48 17,-24 V0" fill="none" stroke="#dce6eb" strokeWidth={3.4} strokeLinecap="round" transform="translate(-1.5 -1.5)"/>
      </g>
      <rect x={-31} y={-4} width={62} height={50} rx={10} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
      <rect x={-26} y={0} width={52} height={7} rx={3} fill="#fff3c0" opacity={0.55}/>
      <circle cx={0} cy={19} r={6.5} fill="#3f2a10"/><path d="M-2.4,22 L-4.4,36 L4.4,36 L2.4,22 Z" fill="#3f2a10"/>
      {click > 0.01 && click < 0.99 && <g opacity={1 - click}><circle cx={0} cy={20} r={20 + click * 52} fill="none" stroke="#ffd36a" strokeWidth={4}/>{Array.from({length: 8}, (_, k) => <path key={k} d={`M0,${-30 - click * 20} v-12`} stroke="#ffd36a" strokeWidth={4} strokeLinecap="round" transform={`translate(0 20) rotate(${k * 45})`}/>)}</g>}
    </g>
  );
};

/** a clock (desk or wall) with ticks only; hands are functions of f */
export const Clock: React.FC<{x: number; y: number; r?: number; f: number; speed?: number; stand?: boolean; tick?: number}> = ({x, y, r = 90, f, speed = 1, stand = false, tick = 0}) => {
  const st = tick > 0 ? f / tick : 0, sec = tick > 0 ? (Math.floor(st) + eo((st - Math.floor(st)) * 5)) * 6 : f * speed * 6 * 0.5, min = f * speed * 0.5, hr = f * speed * 0.04;
  return (
    <g transform={`translate(${x} ${y})`}>
      {stand && <><Shade x={0} y={r + 34} rx={r * 0.9} ry={9} o={0.3}/><path d={`M${-r * 0.5},${r + 32} L${-r * 0.2},${r * 0.8} L${r * 0.2},${r * 0.8} L${r * 0.5},${r + 32} Z`} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2}/></>}
      <circle r={r + 12} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
      <circle r={r} fill="#fffaf0" stroke="#8e6522" strokeWidth={2}/>
      <circle r={r * 0.96} fill="none" stroke="#e5d6b4" strokeWidth={2}/>
      {Array.from({length: 60}, (_, i) => <path key={i} d={`M0,${-r * 0.93} v${i % 5 ? r * 0.05 : r * 0.12}`} stroke="#4a3520" strokeWidth={i % 5 ? 1.2 : 3} transform={`rotate(${i * 6})`} strokeLinecap="round"/>)}
      <path d={`M0,${r * 0.1} L0,${-r * 0.5}`} stroke="#3b2a18" strokeWidth={r * 0.06} strokeLinecap="round" transform={`rotate(${hr})`}/>
      <path d={`M0,${r * 0.12} L0,${-r * 0.78}`} stroke="#3b2a18" strokeWidth={r * 0.045} strokeLinecap="round" transform={`rotate(${min})`}/>
      <g transform={`rotate(${sec})`}><path d={`M0,${r * 0.2} L0,${-r * 0.86}`} stroke="#c63f2f" strokeWidth={2.4} strokeLinecap="round"/><circle cy={r * 0.2} r={r * 0.05} fill="#c63f2f"/></g>
      <circle r={r * 0.06} fill="#c63f2f" stroke="#7a2a1d" strokeWidth={1.5}/>
      <path d={`M${-r * 0.7},${-r * 0.5} A${r * 0.9},${r * 0.9} 0 0 1 ${-r * 0.1},${-r * 0.9}`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.5} strokeLinecap="round"/>
    </g>
  );
};

/** a hanging price tag (two short lines of text, split at " · " when the label has one) */
export const PriceTag: React.FC<{x: number; y: number; text: string; f: number; at: number; rot?: number; size?: number; w?: number; string?: boolean}> = ({x, y, text, f, at, rot = 0, size = 34, w = 190, string: str = true}) => {
  const a = eo(prog(f, at, 14));
  if (a <= 0.001) return null;
  const parts = text.split(/ · |: /, 2), h = size * (parts.length > 1 ? 2.75 : 1.7);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot + Math.sin(f / 14 + x) * 1.2}) scale(${0.7 + 0.3 * a})`} opacity={a}>
      {str && <path d={`M0,${-h / 2 - 10} Q-14,${-h / 2 - 50} -4,${-h / 2 - 86}`} stroke="#8a6b3e" strokeWidth={2.4} fill="none"/>}
      <path d={`M${-w / 2 + 20},${-h / 2} L${w / 2},${-h / 2} L${w / 2},${h / 2} L${-w / 2},${h / 2} L${-w / 2},${-h / 2 + 20} Z`} fill="#fff7e2" stroke="#b58a52" strokeWidth={2.4} style={{filter: "drop-shadow(0 8px 8px rgba(40,22,8,.35))"}}/>
      <circle cx={-w / 2 + 22} cy={-h / 2 + 18} r={6} fill="#d7c29a" stroke="#b58a52" strokeWidth={1.6}/>
      {parts.map((t, i) => <text key={i} x={10} y={parts.length > 1 ? -h / 2 + size * (i === 0 ? 0.95 : 2.12) + 4 : size * 0.3} textAnchor="middle" fontFamily={i === 0 ? SANS : SERIF} fontWeight={i === 0 ? 800 : 700} fontSize={i === 0 ? size * 0.62 : size} letterSpacing={i === 0 ? "0.12em" : 0} fill={i === 0 ? "#8a5a30" : "#5e2a0e"}>{i === 0 ? t.toUpperCase() : t}</text>)}
      {parts.length === 1 && null}
    </g>
  );
};

// ---- hand ------------------------------------------------------------------------------------------------------------------------
/** an adult hand and sleeve reaching down from above; origin at the fist centre. up flips it to reach up from below. */
export const Hand: React.FC<{x: number; y: number; s?: number; rot?: number; len?: number; sleeve?: string; shade?: string; up?: boolean}> = ({x, y, s = 1, rot = 0, len = 260, sleeve = "#6c8fb5", shade = "#41607f", up = false}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s} ${up ? -s : s})`}>
    <path d={`M-32,${-len} L32,${-len} L28,-72 L-28,-72 Z`} fill={sleeve} stroke={shade} strokeWidth={1.6}/>
    <path d={`M6,${-len} L32,${-len} L28,-72 L6,-72 Z`} fill={shade} opacity={0.35}/>
    <rect x={-31} y={-80} width={62} height={20} rx={7} fill={sleeve} stroke={shade} strokeWidth={1.6}/>
    <rect x={-31} y={-80} width={62} height={6} rx={3} fill="#fff" opacity={0.22}/>
    <rect x={-17} y={-62} width={34} height={42} rx={9} fill="url(#e2-skin)"/>
    <rect x={-26} y={-26} width={52} height={40} rx={18} fill="url(#e2-skin)" stroke="#a8754f" strokeWidth={1.4}/>
    {[-19, -6.5, 6.5, 19].map((dx, i) => <ellipse key={i} cx={dx} cy={13} rx={7} ry={11} fill="url(#e2-skin)" stroke="#a8754f" strokeWidth={1.2}/>)}
    <ellipse cx={-24} cy={-4} rx={9} ry={15} transform="rotate(24 -24 -4)" fill="url(#e2-skin)" stroke="#a8754f" strokeWidth={1.2}/>
    <path d="M-20,2 Q0,8 20,2" stroke="#a8754f" strokeWidth={1.2} fill="none" opacity={0.6}/>
  </g>
);

// ---- brass balance --------------------------------------------------------------------------------------------------------------
/** geometry of a balance: tilt > 0 lowers the left end */
export const balGeom = (x: number, baseY: number, h: number, half: number, tilt: number, chain: number) => {
  const a = (tilt * Math.PI) / 180, py = baseY - h, ex = half * Math.cos(a), ey = half * Math.sin(a);
  return {px: x, py, lx: x - ex, ly: py + ey, rx: x + ex, ry: py - ey, lpy: py + ey + chain, rpy: py - ey + chain};
};

/** the brass balance; children `left` and `right` are drawn on the pan surfaces (origin = centre of the pan top, y up is negative) */
export const Balance: React.FC<{x: number; baseY: number; h?: number; half?: number; tilt: number; chain?: number; panW?: number; left?: React.ReactNode; right?: React.ReactNode; scale?: boolean}> =
  ({x, baseY, h = 340, half = 330, tilt, chain = 130, panW = 120, left, right, scale = true}) => {
  const g = balGeom(x, baseY, h, half, tilt, chain);
  const pan = (cx: number, cy: number, ex: number, ey: number, kids: React.ReactNode, key: string) => (
    <g key={key}>
      <path d={`M${ex},${ey} L${cx - panW},${cy} M${ex},${ey} L${cx + panW},${cy} M${ex},${ey} L${cx},${cy + 6}`} stroke="#8e6522" strokeWidth={3} strokeDasharray="7 3" fill="none"/>
      <Shade x={cx} y={baseY + 8} rx={panW * 0.9} ry={8} o={0.14}/>
      <path d={`M${cx - panW - 8},${cy} Q${cx - panW * 0.9},${cy + 40} ${cx},${cy + 44} Q${cx + panW * 0.9},${cy + 40} ${cx + panW + 8},${cy} Z`} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
      <g transform={`translate(${cx} ${cy})`}>{kids}</g>
      <ellipse cx={cx} cy={cy} rx={panW + 8} ry={8} fill="#f6dc94" stroke="#6c4a16" strokeWidth={2.4}/>
      <path d={`M${cx - panW + 6},${cy + 14} Q${cx},${cy + 34} ${cx + panW - 6},${cy + 14}`} stroke="#fff3c0" strokeWidth={3} fill="none" opacity={0.6}/>
    </g>
  );
  return (
    <g>
      {/* plinth and pillar */}
      <Shade x={x} y={baseY + 6} rx={150} ry={16} o={0.38}/>
      <path d={`M${x - 140},${baseY} Q${x - 140},${baseY - 34} ${x - 70},${baseY - 40} L${x + 70},${baseY - 40} Q${x + 140},${baseY - 34} ${x + 140},${baseY} Z`} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.6}/>
      <ellipse cx={x} cy={baseY - 40} rx={70} ry={10} fill="#f6dc94" stroke="#6c4a16" strokeWidth={2}/>
      <path d={`M${x - 20},${baseY - 40} L${x - 11},${g.py + 20} L${x + 11},${g.py + 20} L${x + 20},${baseY - 40} Z`} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
      <rect x={x - 6} y={g.py + 40} width={5} height={baseY - g.py - 100} fill="#fff3c0" opacity={0.5}/>
      {scale && <g>
        <path d={`M${x - 70},${g.py + 108} A110,110 0 0 0 ${x + 70},${g.py + 108}`} fill="none" stroke="#6c4a16" strokeWidth={5}/>
        <path d={`M${x - 70},${g.py + 108} A110,110 0 0 0 ${x + 70},${g.py + 108}`} fill="none" stroke="#f6dc94" strokeWidth={2.4}/>
        {[-6, -3, 0, 3, 6].map((k) => <path key={k} d={`M${x + k * 11},${g.py + 112 + (k === 0 ? 4 : 0)} v${k === 0 ? 14 : 8}`} stroke="#4a2f0a" strokeWidth={k === 0 ? 3 : 1.6} transform={`rotate(${k * 2.4} ${x} ${g.py})`}/>)}
      </g>}
      {/* pans */}
      {pan(g.lx, g.lpy, g.lx, g.ly, left, "L")}
      {pan(g.rx, g.rpy, g.rx, g.ry, right, "R")}
      {/* beam */}
      <path d={`M${g.lx},${g.ly} L${g.rx},${g.ry}`} stroke="#6c4a16" strokeWidth={20} strokeLinecap="round"/>
      <path d={`M${g.lx},${g.ly} L${g.rx},${g.ry}`} stroke="url(#e2-brass)" strokeWidth={14} strokeLinecap="round"/>
      <path d={`M${g.lx},${g.ly - 3} L${g.rx},${g.ry - 3}`} stroke="#fff3c0" strokeWidth={3} strokeLinecap="round" opacity={0.7}/>
      <circle cx={g.lx} cy={g.ly} r={11} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/><circle cx={g.rx} cy={g.ry} r={11} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
      <path d={`M${x},${g.py + 4} L${x + Math.sin((tilt * 2.4 * Math.PI) / 180) * 98},${g.py + 4 + Math.cos((tilt * 2.4 * Math.PI) / 180) * 98}`} stroke="#c63f2f" strokeWidth={4} strokeLinecap="round"/>
      <circle cx={x} cy={g.py} r={19} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/><circle cx={x - 5} cy={g.py - 5} r={6} fill="#fff6cf" opacity={0.8}/>
      <circle cx={x} cy={g.py - 30} r={11} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2}/>
    </g>
  );
};

// ---- glass jar ------------------------------------------------------------------------------------------------------------------
/** a glass jar with a metal rim, base centre at x,y; coins inside as a heap (n) */
export const GlassJar: React.FC<{x: number; y: number; w?: number; h?: number; n?: number; seed?: number; glow?: number; coinR?: number}> = ({x, y, w = 250, h = 300, n = 0, seed = 1, glow = 0, coinR}) => {
  const hw = w / 2, sh = 44;
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shade x={0} y={6} rx={hw + 26} ry={16} o={0.34}/>
      {glow > 0.01 && <ellipse cx={0} cy={-h / 2} rx={hw + 70} ry={h * 0.6} fill="#ffd37a" opacity={0.4 * glow} filter="url(#ak-blur22)"/>}
      <path d={`M${-hw},${-h + sh} L${-hw},-30 Q${-hw},0 ${-hw + 36},0 L${hw - 36},0 Q${hw},0 ${hw},-30 L${hw},${-h + sh} Z`} fill="#e6f1f5" opacity={0.4}/>
      <CoinHeap x={0} y={-24} n={n} r={coinR ?? Math.min(24, w * 0.085)} seed={seed}/>
      <path d={`M${-hw},${-h + sh} L${-hw},-30 Q${-hw},0 ${-hw + 36},0 L${hw - 36},0 Q${hw},0 ${hw},-30 L${hw},${-h + sh}`} fill="none" stroke="#7da3ba" strokeWidth={5} strokeLinecap="round"/>
      <path d={`M${-hw},${-h + sh} L${-hw},-30 Q${-hw},0 ${-hw + 36},0 L${hw - 36},0 Q${hw},0 ${hw},-30 L${hw},${-h + sh} Z`} fill="url(#e2-glass)"/>
      <rect x={-hw + 18} y={-h + sh + 24} width={14} height={h - 120} rx={7} fill="#fff" opacity={0.55}/>
      <path d={`M${-hw},${-h + sh} Q${-hw},${-h + 8} ${-hw + 34},${-h + 4} L${hw - 34},${-h + 4} Q${hw},${-h + 8} ${hw},${-h + sh}`} fill="none" stroke="#7da3ba" strokeWidth={5}/>
      <rect x={-hw + 20} y={-h - 18} width={w - 40} height={26} rx={9} fill="url(#e2-steel)" stroke="#6a7b86" strokeWidth={2.4}/>
      <rect x={-hw + 26} y={-h - 14} width={w - 52} height={6} rx={3} fill="#fff" opacity={0.6}/>
    </g>
  );
};

/** a tiny arrow glyph for rises (dir -1 up, 1 down) */
export const Chev: React.FC<{x: number; y: number; s?: number; up?: boolean; col?: string}> = ({x, y, s = 1, up = true, col = "#c63f2f"}) => (
  <g transform={`translate(${x} ${y}) scale(${s} ${up ? s : -s})`}><path d="M-14,10 L0,-8 L14,10 M-14,26 L0,8 L14,26" fill="none" stroke={col} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"/></g>
);

/** HTML term / label card (warm paper); `y` is the top edge. Uses kit's cardStyle so it matches the finished scenes. */
export const ECard: React.FC<{cx: number; y: number; text: string; f: number; at: number; size?: number; maxW?: number; tone?: "warm" | "cool" | "green" | "dark" | "red"; upper?: boolean; left?: boolean}> =
  ({cx, y, text, f, at, size = 40, maxW = 900, tone = "warm", upper = true, left = false}) => {
  const a = eo(prog(f, at, 14));
  if (a <= 0.001) return null;
  const tint = tone === "cool" ? "70,120,180" : tone === "green" ? "50,140,80" : tone === "red" ? "190,60,50" : "190,110,50";
  const bar = tone === "cool" ? "#2f78b8" : tone === "green" ? "#2f9a4a" : tone === "red" ? "#c63f2f" : tone === "dark" ? "#f0b45a" : "#d8682a";
  const st = cardStyle(cx, y, 0, 0, a, 22, tint), dark = tone === "dark";
  return (
    <div style={{...st, width: "max-content", height: "auto", maxWidth: maxW, transform: left ? "none" : "translateX(-50%)", padding: `${Math.round(size * 0.42)}px ${Math.round(size * 0.8)}px ${Math.round(size * 0.46)}px`, textAlign: left ? "left" : "center",
      ...(dark ? {background: "linear-gradient(160deg, rgba(34,40,70,.92), rgba(22,26,52,.9))", border: "1.5px solid rgba(255,225,170,.45)"} : {})}}>
      <div style={{width: 46, height: 5, borderRadius: 3, background: bar, margin: left ? `0 0 ${Math.round(size * 0.3)}px` : `0 auto ${Math.round(size * 0.3)}px`, opacity: 0.9}}/>
      <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1.14, letterSpacing: upper ? "0.015em" : "0.005em", color: dark ? "#fff0d4" : tone === "cool" ? "#173a5c" : tone === "green" ? "#14502a" : tone === "red" ? "#6a1d16" : "#5e2a0e", textTransform: upper ? "uppercase" : "none"}}>{text}</div>
    </div>
  );
};

/** a card drawn from the spec label with this key; renders nothing when the spec has no such label */
export const KeyCard: React.FC<{p: AP; k: string; cx: number; y: number; size?: number; maxW?: number; tone?: "warm" | "cool" | "green" | "dark" | "red"; upper?: boolean; at?: number; left?: boolean}> = ({p, k, at, ...rest}) => {
  const l = L(p, k);
  return l ? <ECard {...rest} text={l.text} f={p.f} at={at ?? l.at}/> : null;
};

export { eio, clamp, W, H };
