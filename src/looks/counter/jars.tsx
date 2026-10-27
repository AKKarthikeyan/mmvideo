// JARS for percentages, on kirana glass jars (barnis). Change: every jar starts at last year's level (a dashed etched
// line, the same height in every jar of the story) and rises or falls to (1 + change) times it on the narrator's word;
// the largest rise in the story sets the line, so jars compare across beats. Share: a jar with graduations, filled to
// the share of its own scale; the empty glass above is not "the rest of the market" and nothing else is drawn in it.
// A change too small to see at true scale gets a brass loupe over the level.
import React from "react";
import {fitCss, fitFont} from "../shared/fit";
import {type Cam, project} from "./camera";
import {assertContrast, rgba} from "./materials";
import {clamp01, ease, flip} from "./motion";
import {Jar, Loupe, jarGeom} from "./objects";
import {LABEL_Y, SAFE, ShelfLabel, W_SAFE} from "./props";
import {KickerSign, World, slots, type Ctx} from "./scene";
import {HeroTag} from "./piles";
import {STAGE} from "./surfaces";

const size = (n: number) => [{w: 290, h: 520}, {w: 240, h: 500}, {w: 196, h: 480}, {w: 160, h: 460}][Math.min(3, Math.max(0, n - 1))];

export const jarFrame = (ctx: Ctx) => {
  const s = size(ctx.p.items.length);
  return {objH: s.h + 64, focus: [540, STAGE.base - s.h * 0.6] as [number, number]};
};

export const Jars: React.FC<{ctx: Ctx; cam: Cam}> = ({ctx, cam}) => {
  const {p, f, B, M, b, hook, P} = ctx;
  const items = p.items;
  const {w, h} = size(items.length);
  const xs = slots(items.length);
  const change = p.jarMode === "change";
  const mark = change ? 0.96 / (1 + P.jarMax) : null;
  // change: from last year's mark to mark x (1 + v) over the 10 frames before the word. share: a later period's jar
  // starts at the earlier period's level and moves to its own on the word (no overshoot); the first starts 60% full.
  const lvl = (v: number, at: number, k0: number) => {
    const k = ease(f, at - 10, at);
    if (change) return mark! * (1 + v * k);
    const from = k0 > 0 ? items[k0 - 1].v : items[k0].hero ? v * 0.6 : v;
    return from + (v - from) * k;
  };
  const hi = Math.max(0, items.findIndex((x) => x.hero));
  const heroIt = items[hi];
  const g = jarGeom(xs[hi], STAGE.base, w, h);
  const deltas = items.map((it) => Math.abs((change ? mark! * it.v : 0)) * (h - 26));
  const tiny = change && Math.max(...deltas) < 26;
  const mono = fitFont(B.f.mono);
  return <>
    <World ctx={ctx} cam={cam}>
      {items.map((it, k) => <Jar key={k} M={M} cx={xs[k]} base={STAGE.base} w={w} h={h} level={lvl(it.v, it.lockF, k)} mark={mark} ticks={!change}
        hero={it.hero} seed={`${ctx.L.seed}-${b.i}-${k}`} liquid={!change} f={f}/>)}
    </World>
    {!hook && <KickerSign ctx={ctx}/>}
    {/* the hero's price tag hangs from the jar's lid: its back until the word, then it flips */}
    {!hook && heroIt?.num && <HeroTag ctx={ctx} n={heroIt.num} anchor={project(cam, xs[hi], g.lidTop + 8)} mode="flip" maxNumW={470}/>}
    {/* a change too small to see: the loupe over the hero's level */}
    {tiny && !hook && (() => {
      const at = Math.max(heroIt.lockF + 18, b.f0 + Math.round(ctx.L.barF));
      const k = ease(f, at, at + 10);
      if (k <= 0) return null;
      const [jx, jy] = project(cam, xs[hi], g.levelY(mark!));
      // the loupe is held over the hero jar's level, magnifying it in place
      const R = Math.min(150, Math.max(110, w * 0.62)), lcx = Math.max(SAFE.x0 + R + 6, Math.min(SAFE.x1 - R - 6, jx)), lcy = jy;
      const mag = Math.min(14, 70 / Math.max(1, Math.max(...deltas)));
      const yMark = R + 30, yLvl = yMark - mark! * heroIt.v * (h - 26) * mag;
      return <>
        <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: k, transform: `scale(${0.7 + 0.3 * k})`, transformOrigin: `${lcx}px ${lcy}px`}}>
          <Loupe M={M} cx={lcx} cy={lcy} r={R} label={<div style={{position: "absolute", left: R - 80, top: -58, padding: "3px 10px", background: M.brassLight, borderRadius: 6,
            ...fitCss(mono, 24), color: assertContrast(B.c.ink, M.brassLight, 24, "loupe label"), lineHeight: 1.1}}>ZOOMED IN</div>}>
            <svg width={2 * R} height={2 * R} style={{position: "absolute", left: 0, top: 0}}>
              <rect x={0} y={Math.min(yLvl, yMark)} width={2 * R} height={2 * R} fill={heroIt.v >= 0 ? M.grainHero : M.grainOther}/>
              <line x1={0} x2={2 * R} y1={yMark} y2={yMark} stroke={B.c.paper} strokeWidth={4} strokeDasharray="14 9"/>
              <line x1={0} x2={2 * R} y1={yLvl} y2={yLvl} stroke={M.grainHeroLight} strokeWidth={5}/>
            </svg>
          </Loupe>
        </div>
      </>;
    })()}
    {items.map((it, k) => {
      const [lx] = project(cam, xs[k], STAGE.base);
      return <ShelfLabel key={k} B={B} M={M} cx={lx} y={LABEL_Y} maxW={Math.min(300, (W_SAFE - 80) / items.length - 14)} name={it.name}
        nameOn={f >= it.nameF && !(hook && /\d/.test(it.name))} num={it.hero && !hook ? null : it.num} f={f} hot={it.hero} dim={false}/>;
    })}
    {!hook && change && f >= b.f0 + 4 && (() => {
      // the etched line's meaning comes from the card text ("against Sep 2025"); here only a small marker at its end
      const [mx, my] = project(cam, xs[items.length - 1] + w / 2 + 14, g.levelY(mark!));
      return <div style={{position: "absolute", left: Math.min(mx, SAFE.x1 - 26), top: my - 11, width: 22, height: 22, borderRadius: 11,
        background: B.c.paper, opacity: clamp01((f - b.f0 - 4) / 6), boxShadow: `0 3px 6px ${rgba(M.shadow, 0.5)}`}}/>;
    })()}
  </>;
};
