// Every object of the counter, drawn in code (SVG in world coordinates), generic and brand-free: oblique-free unit
// piles seen straight on from slightly above (gold bars, plain unmarked coins, paper count tokens), a kirana glass jar,
// a clear 200 ml-style bottle, an unspecified pack (dashed outline), abacus beads and a brass loupe. Colours come
// from materials.ts (brand tones only).
//
// TRUE HEIGHT: a pile of v units is floor(v) full layers plus one layer cut to (v - floor(v)) of the layer height, so its
// pixel height is exactly v x layer; the missing part of the last layer is a dashed ghost.
import React from "react";
import {random} from "remotion";
import type {Mat} from "./materials";
import {rgba} from "./materials";
import {drop, on2} from "./motion";
import type {ObjKind} from "./plan";

let uid = 0;
export const useUid = (p: string) => React.useState(() => `${p}${++uid}`)[0];

// ---------------------------------------------------------------- one layer of a pile
// cx: centre x; by: bottom y of this layer; w: width; h: full layer height; q: fraction of the layer (0..1]; top: draw
// the top face (only the top of a pile shows it).
const Layer: React.FC<{kind: ObjKind; M: Mat; cx: number; by: number; w: number; h: number; q: number; top: boolean; gid: string; ghostTop?: boolean}> = ({kind, M, cx, by, w, h, q, top, gid, ghostTop}) => {
  const hh = h * q;
  if (kind === "bar") {
    // a bar seen from the front and slightly above: a front face that tapers (w at the base, 0.86 w at the top) and a
    // narrow top face receding to 0.74 w.
    const t = 0.045 * w, x0 = cx - w / 2, x1 = cx + w / 2;
    const tx0 = x0 + t * q, tx1 = x1 - t * q, ty = by - hh;
    const d = Math.max(3, h * 0.42);
    const front = `M${x0},${by} L${x1},${by} L${tx1},${ty} L${tx0},${ty} Z`;
    const topF = `M${tx0},${ty} L${tx1},${ty} L${tx1 - t * 0.9},${ty - d} L${tx0 + t * 0.9},${ty - d} Z`;
    return <g>
      {ghostTop && q < 0.999 && <path d={`M${x0 + t * q},${ty} L${x0 + t},${by - h} L${x1 - t},${by - h} L${x1 - t * q},${ty}`} fill="none" stroke={M.goldEdge} strokeWidth={2} strokeDasharray="7 6" opacity={0.75}/>}
      <path d={front} fill={`url(#${gid}f)`}/>
      <path d={`M${x0},${by} L${x1},${by}`} stroke={M.goldDeep} strokeWidth={2} opacity={0.9}/>
      <path d={`M${tx0},${ty} L${tx1},${ty}`} stroke={M.goldEdge} strokeWidth={1.8}/>
      {hh > 9 && <path d={`M${x0 + w * 0.16},${by - hh * 0.55} L${x0 + w * 0.5},${by - hh * 0.55}`} stroke={M.goldEdge} strokeWidth={Math.max(1, hh * 0.1)} strokeLinecap="round" opacity={0.28}/>}
      {top && <path d={topF} fill={`url(#${gid}t)`}/>}
      {top && <path d={`M${tx0 + t * 0.9},${ty - d} L${tx1 - t * 0.9},${ty - d}`} stroke={M.goldEdge} strokeWidth={1.4} opacity={0.8}/>}
    </g>;
  }
  if (kind === "token") {
    // a pad of paper slips (counts): a block seen from the front and slightly above, page edges, a band round it
    const x0 = cx - w / 2, ty = by - hh, d = Math.min(w * 0.14, 26), inset = w * 0.05;
    const lines = Math.floor(hh / 3.2);
    return <g>
      {ghostTop && q < 0.999 && <rect x={x0} y={by - h} width={w} height={h - hh} fill="none" stroke={M.paper} strokeWidth={2} strokeDasharray="7 6" opacity={0.7}/>}
      <rect x={x0} y={ty} width={w} height={hh} fill={`url(#${gid}e)`}/>
      {Array.from({length: lines}, (_, i) => <line key={i} x1={x0 + 2} x2={x0 + w - 2} y1={ty + 2 + i * 3.2} y2={ty + 2 + i * 3.2} stroke={M.coinEdge} strokeWidth={0.8} opacity={0.55}/>)}
      <rect x={cx + w * 0.18} y={ty} width={w * 0.07} height={hh} fill={M.tokenDark} opacity={0.9}/>
      <line x1={x0} x2={x0 + w} y1={by} y2={by} stroke={M.shadow} strokeWidth={1.6} opacity={0.5}/>
      {top && <path d={`M${x0},${ty} L${x0 + w},${ty} L${x0 + w - inset},${ty - d} L${x0 + inset},${ty - d} Z`} fill={M.token} stroke={M.coinEdge} strokeWidth={1.2}/>}
      {top && <path d={`M${cx + w * 0.18},${ty} L${cx + w * 0.25},${ty} L${cx + w * 0.25 - inset * 0.3},${ty - d} L${cx + w * 0.18 - inset * 0.3},${ty - d} Z`} fill={M.tokenDark} opacity={0.9}/>}
    </g>;
  }
  // coins: a cylinder seen from slightly above (ellipse top, a band for the edge); unmarked
  const rx = w / 2, ry = w * 0.15, x0 = cx - rx, ty = by - hh;
  const coin = kind === "coin";
  const face = coin ? M.coin : M.token, edge = coin ? M.coinEdge : M.tokenEdge, dark = coin ? M.coinDark : M.tokenDark;
  return <g>
    {ghostTop && q < 0.999 && <path d={`M${x0},${ty} L${x0},${by - h} A${rx},${ry} 0 0 0 ${x0 + w},${by - h} L${x0 + w},${ty}`} fill="none" stroke={face} strokeWidth={2} strokeDasharray="7 6" opacity={0.7}/>}
    <path d={`M${x0},${ty} L${x0},${by} A${rx},${ry} 0 0 0 ${x0 + w},${by} L${x0 + w},${ty} Z`} fill={`url(#${gid}e)`}/>
    {!coin && hh > 6 && <path d={`M${x0},${by - hh * 0.5} A${rx},${ry} 0 0 0 ${x0 + w},${by - hh * 0.5}`} fill="none" stroke={dark} strokeWidth={Math.max(1.5, hh * 0.22)} opacity={0.85}/>}
    <path d={`M${x0},${by} A${rx},${ry} 0 0 0 ${x0 + w},${by}`} fill="none" stroke={dark} strokeWidth={1.6} opacity={0.7}/>
    {top && <ellipse cx={cx} cy={ty} rx={rx} ry={ry} fill={face} stroke={edge} strokeWidth={1.5}/>}
    {top && <ellipse cx={cx} cy={ty} rx={rx * 0.8} ry={ry * 0.8} fill="none" stroke={edge} strokeWidth={1.2} opacity={0.6}/>}
    {top && <ellipse cx={cx - rx * 0.3} cy={ty - ry * 0.3} rx={rx * 0.35} ry={ry * 0.3} fill={M.paper} opacity={0.25}/>}
  </g>;
};

const Grads: React.FC<{kind: ObjKind; M: Mat; gid: string}> = ({kind, M, gid}) => kind === "bar"
  ? <defs>
    <linearGradient id={`${gid}f`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={M.goldFront}/><stop offset="0.45" stopColor={M.goldMid}/><stop offset="1" stopColor={M.goldDeep}/></linearGradient>
    <linearGradient id={`${gid}t`} x1="0" y1="1" x2="0.4" y2="0"><stop offset="0" stopColor={M.goldTop}/><stop offset="1" stopColor={M.goldFront}/></linearGradient>
  </defs>
  : <defs>
    <linearGradient id={`${gid}e`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={kind === "coin" ? M.coinDark : M.coinEdge}/><stop offset="0.3" stopColor={kind === "coin" ? M.coin : M.token}/>
      <stop offset="0.7" stopColor={kind === "coin" ? M.coinEdge : M.token}/><stop offset="1" stopColor={kind === "coin" ? M.coinDark : M.coinEdge}/>
    </linearGradient>
  </defs>;

export type PileProps = {
  kind: ObjKind; M: Mat; cx: number; base: number; w: number; layer: number; v: number;
  f: number; landAt?: number; gap?: number; settled?: boolean; seed: string; ghost?: boolean; jitter?: number; shadow?: boolean;
};

// A pile of v units at true height. Unit k lands at landAt + k * gap (on twos) with a drop; settled draws it built.
export const Pile: React.FC<PileProps> = ({kind, M, cx, base, w, layer, v, f, landAt = 0, gap = 2, settled, seed, ghost, jitter = 5, shadow = true}) => {
  const gid = useUid("pl");
  const n = Math.max(0, Math.ceil(v - 1e-9));
  const layers = Array.from({length: n}, (_, k) => k);
  const shown = layers.filter((k) => settled || on2(f) >= landAt + k * gap - 9);
  const lastLanded = settled ? n - 1 : shown.filter((k) => on2(f) >= landAt + k * gap).length - 1;
  const height = Math.min(v, shown.length) * layer;
  if (ghost) {
    // a dashed outline of a pile seen before: same scale, no fill
    const top = base - v * layer;
    return <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      <rect x={cx - w / 2} y={top} width={w} height={v * layer} rx={kind === "bar" ? 3 : w * 0.06} fill={rgba(M.paper, 0.05)} stroke={M.paper} strokeWidth={3} strokeDasharray="12 9" opacity={0.6}/>
    </svg>;
  }
  return <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
    <Grads kind={kind} M={M} gid={gid}/>
    <defs><filter id={`${gid}s`} x="-60%" y="-200%" width="220%" height="500%"><feGaussianBlur stdDeviation="12"/></filter></defs>
    {shadow && n > 0 && <>
      <ellipse cx={cx + 22} cy={base + 6} rx={w * 0.62} ry={Math.max(10, w * 0.08)} fill={M.shadow} opacity={0.6} filter={`url(#${gid}s)`}/>
      {height > 4 && <path d={`M${cx - w * 0.3},${base + 2} L${cx + w * 0.5},${base + 2} L${cx + w * 0.5 + height * 0.25},${base + 34} L${cx - w * 0.3 + height * 0.2},${base + 34} Z`}
        fill={M.shadow} opacity={0.22} filter={`url(#${gid}s)`}/>}
    </>}
    {shown.map((k) => {
      const dr = settled ? {y: 0, sx: 1, sy: 1} : drop(f, landAt + k * gap, 220);
      const jx = (random(`${seed}${k}`) - 0.5) * jitter;
      const q = Math.min(1, v - k);
      const by = base - k * layer;
      const isTop = k === shown.length - 1 || k === lastLanded;
      return <g key={k} transform={`translate(${cx + jx}, ${by + dr.y}) scale(${dr.sx}, ${dr.sy}) translate(${-cx - jx}, ${-by})`}>
        <Layer kind={kind} M={M} cx={cx + jx} by={by} w={w} h={layer} q={q} top={isTop} gid={gid} ghostTop={q < 1}/>
      </g>;
    })}
  </svg>;
};

// ---------------------------------------------------------------- the kirana jar (barni)
// A glass jar seen straight on: body (cx, base, w, h), a wide neck and a lid. level: the content's top as a fraction of
// the body's inner height (0..1.04). mark: an etched dashed line (last year's level), as a fraction, or null. ticks:
// graduations every 10% of the body (share jars). Content: hero (the brand's amber) or other (pale).
export const Jar: React.FC<{M: Mat; cx: number; base: number; w: number; h: number; level: number; mark?: number | null; ticks?: boolean;
  hero?: boolean; seed: string; lid?: string; liquid?: boolean; f?: number}> = ({M, cx, base, w, h, level, mark = null, ticks, hero, seed, lid, liquid, f = 0}) => {
  const gid = useUid("jr");
  const x0 = cx - w / 2, top = base - h, r = w * 0.12;
  const inner = {x0: x0 + 10, x1: x0 + w - 10, y0: top + 16, y1: base - 10};
  const ih = inner.y1 - inner.y0;
  const ly = inner.y1 - Math.max(0, Math.min(1.04, level)) * ih;
  const c1 = hero ? M.grainHero : M.grainOther, c2 = hero ? M.grainHeroLight : M.grainOtherDark;
  const dots = React.useMemo(() => Array.from({length: 150}, (_, i) => ({x: random(`${seed}x${i}`), y: random(`${seed}y${i}`), r: 2 + random(`${seed}r${i}`) * 3.5, l: random(`${seed}c${i}`) > 0.5})), [seed]);
  const neckW = w * 0.7, neckH = 34, lidH = 30;
  return <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
    <defs>
      <clipPath id={`${gid}c`}><rect x={inner.x0} y={ly} width={inner.x1 - inner.x0} height={Math.max(0, inner.y1 - ly)} rx={r * 0.6}/></clipPath>
      <linearGradient id={`${gid}g`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={M.glass} stopOpacity={0.28}/><stop offset="0.18" stopColor={M.glass} stopOpacity={0.06}/>
        <stop offset="0.8" stopColor={M.glass} stopOpacity={0.04}/><stop offset="1" stopColor={M.glass} stopOpacity={0.22}/>
      </linearGradient>
      <linearGradient id={`${gid}q`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={hero ? M.grainHero : M.grainOtherDark}/><stop offset="0.35" stopColor={hero ? M.grainHeroLight : M.grainOther}/><stop offset="1" stopColor={hero ? M.goldDeep : M.grainOtherDark}/></linearGradient>
      <linearGradient id={`${gid}l`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={lid ?? M.brassLight}/><stop offset="1" stopColor={M.brassDark}/></linearGradient>
      <filter id={`${gid}s`} x="-60%" y="-200%" width="220%" height="500%"><feGaussianBlur stdDeviation="12"/></filter>
    </defs>
    <ellipse cx={cx + 20} cy={base + 4} rx={w * 0.62} ry={14} fill={M.shadow} opacity={0.55} filter={`url(#${gid}s)`}/>
    {/* contents */}
    <g clipPath={`url(#${gid}c)`}>
      {liquid ? <>
        <rect x={inner.x0} y={inner.y0 - 40} width={inner.x1 - inner.x0} height={ih + 60} fill={`url(#${gid}q)`}/>
        {dots.slice(0, 26).map((d, i) => {
          const t = ((f * 0.012 * (0.6 + d.x) + d.y) % 1);
          return <circle key={i} cx={inner.x0 + 10 + d.x * (inner.x1 - inner.x0 - 20)} cy={inner.y1 - t * (inner.y1 - ly)} r={d.r * 0.7} fill={M.paper} opacity={0.3}/>;
        })}
        <rect x={inner.x0} y={ly} width={inner.x1 - inner.x0} height={6} fill={M.paper} opacity={0.35}/>
      </> : <>
        <rect x={inner.x0} y={inner.y0 - 40} width={inner.x1 - inner.x0} height={ih + 60} fill={c1}/>
        {dots.map((d, i) => <circle key={i} cx={inner.x0 + d.x * (inner.x1 - inner.x0)} cy={inner.y0 - 30 + d.y * (ih + 40)} r={d.r} fill={d.l ? c2 : M.shadow} opacity={d.l ? 0.55 : 0.14}/>)}
        <rect x={inner.x0} y={ly} width={inner.x1 - inner.x0} height={5} fill={c2} opacity={0.8}/>
      </>}
    </g>
    {/* glass body */}
    <rect x={x0} y={top} width={w} height={h} rx={r} fill={`url(#${gid}g)`} stroke={M.glass} strokeOpacity={0.75} strokeWidth={3}/>
    <rect x={x0 + w * 0.08} y={top + h * 0.08} width={w * 0.05} height={h * 0.78} rx={4} fill={M.glass} opacity={0.32}/>
    <rect x={x0 + w * 0.86} y={top + h * 0.12} width={w * 0.025} height={h * 0.5} rx={3} fill={M.glass} opacity={0.2}/>
    {ticks && Array.from({length: 9}, (_, i) => {
      const y = inner.y1 - ((i + 1) / 10) * ih;
      return <line key={i} x1={x0 + w - 4} x2={x0 + w - (i % 5 === 4 ? 34 : 20)} y1={y} y2={y} stroke={M.glass} strokeOpacity={0.6} strokeWidth={2.5}/>;
    })}
    {mark != null && <line x1={x0 - 14} x2={x0 + w + 14} y1={inner.y1 - mark * ih} y2={inner.y1 - mark * ih} stroke={M.paper} strokeWidth={3.5} strokeDasharray="14 9" opacity={0.95}/>}
    {/* neck and lid */}
    <rect x={cx - neckW / 2} y={top - neckH + 4} width={neckW} height={neckH} rx={6} fill={`url(#${gid}g)`} stroke={M.glass} strokeOpacity={0.5} strokeWidth={2.5}/>
    <rect x={cx - neckW / 2 - 8} y={top - neckH - lidH + 6} width={neckW + 16} height={lidH} rx={8} fill={`url(#${gid}l)`}/>
    <rect x={cx - neckW / 2 - 8} y={top - neckH - lidH + 6} width={neckW + 16} height={6} rx={3} fill={M.paper} opacity={0.25}/>
  </svg>;
};
export const jarGeom = (cx: number, base: number, w: number, h: number) => {
  const top = base - h;
  const inner = {y0: top + 16, y1: base - 10};
  return {top, lidTop: top - 34 - 30 + 6, levelY: (level: number) => inner.y1 - level * (inner.y1 - inner.y0), x0: cx - w / 2, x1: cx + w / 2};
};

// ---------------------------------------------------------------- a clear, stubby 200 ml-style bottle (no label, no contour)
export const Bottle: React.FC<{M: Mat; cx: number; base: number; cap: string; seed: string; f: number; scale?: number}> = ({M, cx, base, cap, seed, f, scale = 1}) => {
  const gid = useUid("bt");
  const W = 150 * scale, H = 380 * scale, neck = 46 * scale, capW = 70 * scale;
  const x0 = cx - W / 2, top = base - H, sh = top + H * 0.36, nk = top + 26 * scale;
  const body = `M${x0 + 14},${base} Q${x0},${base} ${x0},${base - 18} L${x0},${sh + 30} C${x0},${sh} ${cx - neck / 2},${sh - 40} ${cx - neck / 2},${nk + 40} L${cx - neck / 2},${nk}
    L${cx + neck / 2},${nk} L${cx + neck / 2},${nk + 40} C${cx + neck / 2},${sh - 40} ${x0 + W},${sh} ${x0 + W},${sh + 30} L${x0 + W},${base - 18} Q${x0 + W},${base} ${x0 + W - 14},${base} Z`;
  const fill = base - (base - (sh + 10)) * 0.82 - 18;
  const bubbles = React.useMemo(() => Array.from({length: 8}, (_, i) => ({x: random(`${seed}bx${i}`), sp: 0.6 + random(`${seed}bs${i}`), ph: random(`${seed}bp${i}`)})), [seed]);
  return <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
    <defs>
      <clipPath id={`${gid}c`}><path d={body}/></clipPath>
      <linearGradient id={`${gid}g`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={M.cola}/><stop offset="0.42" stopColor={M.colaLit}/><stop offset="0.6" stopColor={M.colaLit}/><stop offset="1" stopColor={M.cola}/></linearGradient>
      <filter id={`${gid}s`} x="-60%" y="-200%" width="220%" height="500%"><feGaussianBlur stdDeviation="10"/></filter>
    </defs>
    <ellipse cx={cx + 18} cy={base + 4} rx={W * 0.7} ry={13} fill={M.shadow} opacity={0.55} filter={`url(#${gid}s)`}/>
    <g clipPath={`url(#${gid}c)`}>
      <rect x={x0} y={fill} width={W} height={base - fill} fill={`url(#${gid}g)`}/>
      {bubbles.map((b, i) => {
        const t = ((f * 0.01 * b.sp + b.ph) % 1);
        return <circle key={i} cx={x0 + 22 + b.x * (W - 44)} cy={base - 20 - t * (base - fill - 30)} r={2.5 * scale} fill={M.paper} opacity={0.35}/>;
      })}
    </g>
    <path d={body} fill={M.glass} fillOpacity={0.08} stroke={M.glass} strokeOpacity={0.75} strokeWidth={3.5}/>
    <path d={`M${x0 + 18},${sh + 40} L${x0 + 18},${base - 30}`} stroke={M.paper} strokeWidth={7 * scale} strokeLinecap="round" opacity={0.42}/>
    <path d={`M${x0 + W - 22},${sh + 60} L${x0 + W - 22},${base - 60}`} stroke={M.paper} strokeWidth={3 * scale} strokeLinecap="round" opacity={0.25}/>
    <rect x={cx - capW / 2} y={nk - 24 * scale} width={capW} height={26 * scale} rx={4} fill={cap} stroke={M.paper} strokeOpacity={0.55} strokeWidth={2}/>
    {Array.from({length: 7}, (_, i) => <rect key={i} x={cx - capW / 2 + 4 + i * (capW - 8) / 7} y={nk - 4 * scale} width={(capW - 8) / 14} height={6 * scale} fill={M.shadow} opacity={0.3}/>)}
  </svg>;
};
export const bottleGeom = (cx: number, base: number, scale = 1) => ({neckY: base - 380 * scale + 26 * scale - 24 * scale, top: base - 380 * scale, w: 150 * scale});

// An unspecified pack: a dashed rounded outline, no neck, no size cue (the table gives no size).
export const Pack: React.FC<{M: Mat; cx: number; base: number; w: number; h: number}> = ({M, cx, base, w, h}) =>
  <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
    <rect x={cx - w / 2} y={base - h} width={w} height={h} rx={w * 0.22} fill={rgba(M.paper, 0.05)} stroke={M.paper} strokeWidth={4} strokeDasharray="16 12" opacity={0.85}/>
  </svg>;

// ---------------------------------------------------------------- a brass loupe (screen or world)
export const Loupe: React.FC<{M: Mat; cx: number; cy: number; r: number; children: React.ReactNode; label?: React.ReactNode}> = ({M, cx, cy, r, children, label}) =>
  <div style={{position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r}}>
    <div style={{position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", background: rgba(M.shadow, 0.55), boxShadow: `0 18px 30px ${rgba(M.shadow, 0.6)}`}}>{children}</div>
    <div style={{position: "absolute", inset: -14, borderRadius: "50%", border: `14px solid ${M.brass}`, boxShadow: `inset 0 0 0 3px ${M.brassLight}, 0 0 0 3px ${M.brassDark}`}}/>
    <div style={{position: "absolute", left: r * 1.62, top: r * 1.62, width: r * 0.5, height: 34, borderRadius: 17, background: `linear-gradient(180deg, ${M.brassLight}, ${M.brassDark})`, transform: "rotate(45deg)", transformOrigin: "0 50%"}}/>
    {label}
  </div>;

// ---------------------------------------------------------------- abacus beads on a rod (tallies)
export const Abacus: React.FC<{M: Mat; x0: number; x1: number; y: number; n: number; pos: number[]; hot: boolean[]; r: number; base?: number}> = ({M, x0, x1, y, n, pos, hot, r, base}) => {
  const gid = useUid("ab");
  const fx0 = x0 - r - 40, fx1 = x1 + r + 40, top = y - r * 2.2, bot = base ?? y + r * 2.4;
  return <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
    <defs>
      <radialGradient id={`${gid}a`} cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor={M.brassLight}/><stop offset="0.6" stopColor={M.grainHero}/><stop offset="1" stopColor={M.brassDark}/></radialGradient>
      <radialGradient id={`${gid}b`} cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor={M.paper}/><stop offset="0.6" stopColor={M.coin}/><stop offset="1" stopColor={M.coinDark}/></radialGradient>
      <linearGradient id={`${gid}r`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={M.brassLight}/><stop offset="1" stopColor={M.brassDark}/></linearGradient>
      <linearGradient id={`${gid}w`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={M.teakDark}/><stop offset="0.5" stopColor={M.teakLight}/><stop offset="1" stopColor={M.teakDark}/></linearGradient>
      <filter id={`${gid}s`} x="-30%" y="-200%" width="160%" height="500%"><feGaussianBlur stdDeviation="10"/></filter>
    </defs>
    {/* a wooden counting frame standing on the counter: two posts, a top rail, a foot */}
    <ellipse cx={(fx0 + fx1) / 2 + 20} cy={bot + 4} rx={(fx1 - fx0) * 0.55} ry={14} fill={M.shadow} opacity={0.5} filter={`url(#${gid}s)`}/>
    <rect x={fx0} y={top} width={26} height={bot - top} rx={6} fill={`url(#${gid}w)`}/>
    <rect x={fx1 - 26} y={top} width={26} height={bot - top} rx={6} fill={`url(#${gid}w)`}/>
    <rect x={fx0 - 10} y={top - 18} width={fx1 - fx0 + 20} height={24} rx={8} fill={`url(#${gid}w)`}/>
    <rect x={fx0 - 22} y={bot - 22} width={fx1 - fx0 + 44} height={24} rx={6} fill={`url(#${gid}w)`}/>
    <rect x={fx0 + 20} y={y - 6} width={fx1 - fx0 - 40} height={12} rx={6} fill={`url(#${gid}r)`}/>
    {Array.from({length: n}, (_, i) => <g key={i}>
      <ellipse cx={pos[i] + 8} cy={y + r * 1.1} rx={r * 0.7} ry={r * 0.22} fill={M.shadow} opacity={0.3}/>
      <ellipse cx={pos[i]} cy={y} rx={r * 0.66} ry={r} fill={`url(#${gid}${hot[i] ? "a" : "b"})`} stroke={hot[i] ? M.brassDark : M.coinDark} strokeWidth={2}/>
      <ellipse cx={pos[i] - r * 0.2} cy={y - r * 0.45} rx={r * 0.18} ry={r * 0.22} fill={M.paper} opacity={0.35}/>
    </g>)}
  </svg>;
};
