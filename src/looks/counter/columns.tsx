// COLUMNS for percentages, on one story-wide scale (plan.ts ColScale), never a container:
//  - a share (no printed sign) is a solid column standing on the counter from zero, its height share x px. Nothing is
//    drawn as "the whole market": no jar, no glass above, no graduations, no "others". The source's printed qualifier
//    ("ALMOST 15%") rides on its tag. In a drinks story the column is the drink (cola, with a lit core), every period alike.
//  - a change (a printed sign) rises from a brass rail at zero, or hangs below it for a fall, |change| x px, so +0.88%
//    and +0.10% (or +29.8% and +3.7%) differ visibly at true scale; no "zoomed" exaggeration is needed.
// Each column turns into view edge-on at its own lock frame (a flip about its vertical axis): its height is the final
// value from the first frame it shows, so no level is ever drawn that is not in the data and nothing shows before the
// narrator's word. Before it a small brass foot marks the empty slot.
import React from "react";
import {random} from "remotion";
import {type Cam, project} from "./camera";
import {rgba} from "./materials";
import {clamp01, ease} from "./motion";
import {useUid} from "./objects";
import type {Item} from "./plan";
import {SAFE, ShelfRow, W_SAFE, spreadAy} from "./props";
import {HeroBlock, ValueTag} from "./piles";
import {KickerSign, World, provOf, slots, type Ctx} from "./scene";
import {STAGE} from "./surfaces";

const widthFor = (n: number) => [230, 196, 164, 136][Math.min(3, Math.max(0, n - 1))];

const geom = (ctx: Ctx, it: Item) => {
  const {P} = ctx;
  const change = it.chg ?? (it.num ? it.num.sign !== "" : it.v < 0);
  const y0 = STAGE.base - (change ? P.cols.rail : 0);
  const h = Math.abs(it.v) * (change ? P.cols.change : P.cols.share);
  const neg = change && it.v < 0;
  return {change, y0, h, neg, top: neg ? y0 : y0 - h, bot: neg ? y0 + h : y0, end: neg ? y0 + h : y0 - h};
};

export const colsFrame = (ctx: Ctx) => {
  const g = ctx.p.items.map((it) => geom(ctx, it));
  const top = Math.min(...g.map((x) => x.top), STAGE.base - 200);
  const hi = Math.max(0, ctx.p.items.findIndex((x) => x.hero));
  return {objH: STAGE.base - top + 30, focus: [slots(ctx.p.items.length)[hi], (g[hi]?.end ?? STAGE.base - 200)] as [number, number]};
};

// One column in world space: w wide from y `top` to `bot`, its end rounded, turned in by k (0 edge-on .. 1 square on).
const Column: React.FC<{ctx: Ctx; cx: number; w: number; top: number; bot: number; neg: boolean; hero: boolean; k: number; seed: string}> = ({ctx, cx, w, top, bot, neg, hero, k, seed}) => {
  const {M, P, f} = ctx;
  const gid = useUid("col");
  const ww = Math.max(2, w * k), x0 = cx - ww / 2, h = Math.max(2, bot - top);
  const cola = P.liquid === "cola";
  const c1 = cola ? M.cola : hero ? M.grainHero : M.grainOther, c2 = cola ? M.colaLit : hero ? M.grainHeroLight : M.grainOtherDark;
  const dots = React.useMemo(() => Array.from({length: 90}, (_, i) => ({x: random(`${seed}x${i}`), y: random(`${seed}y${i}`), r: 2 + random(`${seed}r${i}`) * 3.2, l: random(`${seed}c${i}`) > 0.5})), [seed]);
  const ry = Math.min(ww * 0.16, 18);
  // the end away from the rail/counter is an ellipse (a cylinder seen slightly from above)
  const capY = neg ? bot : top;
  return <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
    <defs>
      <linearGradient id={`${gid}g`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={cola ? M.cola : hero ? M.goldDeep : M.grainOtherDark}/><stop offset="0.38" stopColor={c2}/><stop offset="0.62" stopColor={c2}/><stop offset="1" stopColor={c1}/>
      </linearGradient>
      <clipPath id={`${gid}c`}><rect x={x0} y={top} width={ww} height={h}/></clipPath>
      <filter id={`${gid}s`} x="-60%" y="-200%" width="220%" height="500%"><feGaussianBlur stdDeviation="10"/></filter>
    </defs>
    {!neg && <ellipse cx={cx + 18} cy={bot + 4} rx={ww * 0.6} ry={12} fill={M.shadow} opacity={0.5} filter={`url(#${gid}s)`}/>}
    <rect x={x0} y={top} width={ww} height={h} fill={`url(#${gid}g)`}/>
    <g clipPath={`url(#${gid}c)`}>
      {cola ? Array.from({length: 10}, (_, i) => {
        const d = dots[i], t = ((f * 0.01 * (0.6 + d.x) + d.y) % 1);
        return <circle key={i} cx={x0 + 10 + d.x * (ww - 20)} cy={bot - t * h} r={d.r * 0.7} fill={M.paper} opacity={0.28}/>;
      }) : dots.map((d, i) => <circle key={i} cx={x0 + d.x * ww} cy={top + d.y * h} r={d.r} fill={d.l ? c2 : M.shadow} opacity={d.l ? 0.5 : 0.14}/>)}
    </g>
    <ellipse cx={cx} cy={capY} rx={ww / 2} ry={ry} fill={cola ? M.colaLit : c2} stroke={rgba(M.paper, 0.7)} strokeWidth={2}/>
    {neg && <rect x={x0} y={top} width={ww} height={h} fill="none" stroke={M.paper} strokeWidth={2.5} strokeDasharray="10 7" opacity={0.75}/>}
    <rect x={x0 + ww * 0.1} y={top + 8} width={Math.max(1, ww * 0.06)} height={Math.max(0, h - 16)} fill={M.paper} opacity={0.22}/>
  </svg>;
};

// A kraft-paper parcel tied with twine: stands where a column will be until the narrator says its number, then it is
// lifted away and the column turns in. Its height is a fixed 250 px for every column (it says nothing about the value).
const PARCEL_H = 250;
const Parcel: React.FC<{ctx: Ctx; cx: number; w: number; y0: number; k: number; seed: number}> = ({ctx, cx, w, y0, k, seed}) => {
  const {M, f} = ctx;
  const gid = useUid("pc");
  const ww = w * 0.9, x0 = cx - ww / 2, top = y0 - PARCEL_H, d = Math.min(30, ww * 0.16);
  const wob = Math.sin((f + seed * 7) / 15) * 0.7;
  const lift = k * 200;
  return <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - k}}>
    <defs>
      <linearGradient id={`${gid}g`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={M.kraftDark}/><stop offset="0.35" stopColor={M.kraft}/><stop offset="0.75" stopColor={M.kraft}/><stop offset="1" stopColor={M.kraftDark}/></linearGradient>
      <filter id={`${gid}s`} x="-60%" y="-200%" width="220%" height="500%"><feGaussianBlur stdDeviation="10"/></filter>
    </defs>
    <ellipse cx={cx + 18} cy={y0 + 4} rx={ww * 0.62} ry={12} fill={M.shadow} opacity={0.5} filter={`url(#${gid}s)`}/>
    <g transform={`translate(0 ${-lift}) rotate(${wob} ${cx} ${y0})`}>
      <path d={`M${x0},${top} L${x0 + d},${top - d * 0.7} L${x0 + ww - d},${top - d * 0.7} L${x0 + ww},${top} Z`} fill={M.paper} opacity={0.85}/>
      <rect x={x0} y={top} width={ww} height={PARCEL_H} fill={`url(#${gid}g)`}/>
      <rect x={x0} y={top} width={ww} height={5} fill={M.paper} opacity={0.35}/>
      {/* twine, tied with a bow */}
      <rect x={cx - 3} y={top} width={6} height={PARCEL_H} fill={M.thread}/>
      <rect x={x0} y={top + PARCEL_H * 0.36} width={ww} height={6} fill={M.thread}/>
      <ellipse cx={cx - 14} cy={top + PARCEL_H * 0.36 - 6} rx={15} ry={9} fill="none" stroke={M.thread} strokeWidth={5} transform={`rotate(-24 ${cx - 14} ${top + PARCEL_H * 0.36 - 6})`}/>
      <ellipse cx={cx + 14} cy={top + PARCEL_H * 0.36 - 6} rx={15} ry={9} fill="none" stroke={M.thread} strokeWidth={5} transform={`rotate(24 ${cx + 14} ${top + PARCEL_H * 0.36 - 6})`}/>
      <rect x={x0 + ww * 0.78} y={top + PARCEL_H * 0.62} width={ww * 0.1} height={PARCEL_H * 0.3} fill={M.paper} opacity={0.18}/>
    </g>
  </svg>;
};

// A dashed outline of an earlier column on the same scale (value tag dimmed), standing as context for the hero.
const GhostColumn: React.FC<{ctx: Ctx; cx: number; w: number; top: number; bot: number; neg: boolean}> = ({ctx, cx, w, top, bot, neg}) => {
  const {M} = ctx;
  const h = Math.max(3, bot - top);
  return <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
    <rect x={cx - w / 2} y={top} width={w} height={h} rx={w * 0.08} fill={rgba(M.paper, 0.05)} stroke={M.paper} strokeWidth={3} strokeDasharray="12 9" opacity={0.65}/>
    {neg ? null : <ellipse cx={cx} cy={top} rx={w / 2} ry={Math.min(w * 0.16, 18)} fill="none" stroke={M.paper} strokeWidth={2.5} strokeDasharray="9 7" opacity={0.65}/>}
  </svg>;
};

export const Columns: React.FC<{ctx: Ctx; cam: Cam}> = ({ctx, cam}) => {
  const {p, f, B, M, b, hook, P} = ctx;
  const items = p.items;
  const xs = slots(items.length);
  const w = widthFor(items.length);
  const G = items.map((it) => geom(ctx, it));
  const turn = (it: Item) => (it.ghost ? 1 : f < it.lockF ? 0 : ease(f, it.lockF, it.lockF + 7));
  const hi = Math.max(0, items.findIndex((x) => x.hero));
  const heroIt = items[hi];
  const rail = G.some((g) => g.change);
  const yRail = STAGE.base - P.cols.rail;
  return <>
    <World ctx={ctx} cam={cam}>
      {rail && P.cols.rail > 0 && <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <defs><linearGradient id={`rl${b.i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={M.brassLight}/><stop offset="1" stopColor={M.brassDark}/></linearGradient></defs>
        {/* the rail stands on two brass posts on the counter */}
        {[80, 1000].map((x) => <rect key={x} x={x - 8} y={yRail} width={16} height={STAGE.base - yRail} fill={`url(#rl${b.i})`}/>)}
      </svg>}
      {items.map((it, k) => {
        const g = G[k], kk = turn(it);
        return <React.Fragment key={k}>
          {/* the empty slot: a brass foot on the counter or rail */}
          <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
            <ellipse cx={xs[k]} cy={g.y0} rx={w * 0.42} ry={9} fill={M.brassDark} opacity={0.9}/>
            <ellipse cx={xs[k]} cy={g.y0 - 2} rx={w * 0.36} ry={6} fill={M.brassLight} opacity={0.6}/>
          </svg>
          {it.ghost ? <GhostColumn ctx={ctx} cx={xs[k]} w={w} top={g.top} bot={g.bot} neg={g.neg}/> : <>
            {f < it.lockF + 6 && <Parcel ctx={ctx} cx={xs[k]} w={w} y0={g.y0} k={f < it.lockF ? 0 : ease(f, it.lockF, it.lockF + 6)} seed={k + b.i}/>}
            {kk > 0 && <Column ctx={ctx} cx={xs[k]} w={w} top={g.top} bot={g.bot} neg={g.neg} hero={it.hero} k={kk} seed={`${ctx.L.seed}-${b.i}-${k}`}/>}
          </>}
        </React.Fragment>;
      })}
      {rail && <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <rect x={60} y={yRail - 7} width={960} height={14} rx={7} fill={`url(#rl${b.i})`}/>
        <rect x={60} y={yRail - 7} width={960} height={4} rx={2} fill={M.paper} opacity={0.3}/>
      </svg>}
    </World>
    {!hook && (heroIt?.num ? <HeroBlock ctx={ctx} n={heroIt.num} q={heroIt.q} anchor={f >= heroIt.lockF ? project(cam, xs[hi], G[hi].neg ? G[hi].y0 - 4 : G[hi].top - 6) : project(cam, xs[hi], G[hi].y0 - PARCEL_H - 4)}
      mode={heroIt.lockF - b.f0 > 6 ? "flip" : "swing"}/> : <KickerSign ctx={ctx}/>)}
    {!hook && (() => {
      const pts = items.map((it, k) => (it.hero || !it.num ? null : project(cam, xs[k], G[k].neg ? G[k].y0 - 10 : G[k].top - 8)));
      const sz = items.length > 3 ? 34 : 40;
      const ays = spreadAy(B, items.map((it, k) => (pts[k] ? {n: it.num!, q: it.q, prov: provOf(ctx.L, it.num, it.srcBeat), size: sz, ax: pts[k]![0], ay: pts[k]![1]} : null)));
      return items.map((it, k) => pts[k] ? <ValueTag key={k} ctx={ctx} it={it} ax={pts[k]![0]} ay={ays[k]} size={sz} at={it.ghost ? b.f0 + 6 : it.lockF + 3}/> : null);
    })()}
    <ShelfRow B={B} M={M} labels={items.map((it, k) => ({cx: project(cam, xs[k], STAGE.base)[0], name: it.name, on: f >= it.nameF, hot: it.hero && !hook, dim: it.ghost}))}/>
    {void SAFE}{void clamp01}
  </>;
};
