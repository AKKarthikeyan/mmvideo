// Unit piles: TOWER (one or more true-height piles of one unit, earlier values of the same unit as dashed ghosts, an
// estimate range as a bracket), RATIO (copies of the small pile dropped as solid true-height blocks beside the big one;
// the gap stays visible) and RACK (a value under about one unit: a single cut piece at the same scale, the big pile
// blurred behind, and a brass loupe that magnifies the piece with its sub-value split at true proportion).
import React from "react";
import {fitCss, fitFont, fitLines, fitSize, measure} from "../shared/fit";
import {shown} from "../shared/lock";
import type {LookNum} from "../shared/types";
import {project, type Cam} from "./camera";
import {assertContrast, rgba, type Mat} from "./materials";
import {clamp01, ease, flip, on2, rnd, slam, tagIn} from "./motion";
import {Loupe, Pile, useUid} from "./objects";
import type {Fam, Item} from "./plan";
import {Card, Num, SAFE, ShelfLabel, ShelfRow, Stamp, Tag, TopTag, W_SAFE, spreadAy} from "./props";
import {KickerSign, SubNote, TextStrip, World, provOf, slots, type Ctx} from "./scene";
import {STAGE} from "./surfaces";

// A pile's width: bars keep an ingot's proportions (about 6.5 : 1 face), coins and tokens a chunky disc.
export const pileW = (fam: Fam, n: number) => {
  const cap = [300, 250, 200, 160][Math.min(3, Math.max(0, n - 1))];
  const want = fam.obj === "bar" ? fam.layer * 6.5 : fam.obj === "token" ? fam.layer * 6 : fam.layer * 7.5;
  return Math.max(110, Math.min(cap, want));
};

// When the k-th pile starts landing and how fast (on twos).
const landing = (ctx: Ctx, it: Item, k: number) => {
  const units = Math.ceil(it.v);
  const start = ctx.b.f0 + 4 + k * 4;
  // the pile is down a few frames before its own number lands when there is time; never slower than 4 frames a unit
  const room = Math.max(it.lockF, ctx.b.f0 + 30) - 4 - start;
  const gap = Math.max(1, Math.min(4, Math.floor(room / Math.max(1, units))));
  return {start, gap, done: start + units * gap};
};

// The hero tag: the number and the fact's text, on the beat's side. It hangs from the beat start showing its kraft back
// with the item's name (never a digit) and flips over on the narrator's word, so the top of the frame is never empty
// while the objects build. "swing" (a tag with no time to hang first) springs in on the lock. Two ways to hang: "thread"
// (maroon thread from the tag to its object) or "hook" (a short string from a brass nail on the wall, swaying like a
// pendulum; the kicker sign then sits under it). The source's printed qualifier ("ALMOST") sits above the number; a
// provenance stamp may land on its lower corner.
export const HOOK_Y = 322;           // top of a hook-hung tag
export const tagMetrics = (ctx: Ctx, n: LookNum, q: string, maxNumW: number, hang: "thread" | "hook") => {
  const {f, B, b, L} = ctx;
  const hero = fitFont(B.f.hero), body = fitFont(B.f.body);
  const size = fitSize(n.text, hero, maxNumW, 150, 80);
  const textW = b.text ? Math.min(600, measure(b.text, body, 32) + 10) : 0;
  const stamped = !!L.sourceLabel && b.src.includes(L.sourceLabel);
  const qs = q ? 30 : 0;
  const w = Math.min(W_SAFE - 30, Math.max(measure(n.text, hero, size), textW, stamped ? 420 : 0) + (hang === "hook" ? 76 : 110));
  // the text-led cut (no narration) also prints the card's sub on the tag
  const sub = L.textLed && b.subShown && !ctx.p.sub ? fitLines(b.subShown, body, w - 90, 3, 28, 24) : null;
  const subH = sub ? sub.lines.length * Math.round(sub.size * 1.25) + 10 : 0;
  const h = Math.round(size * 0.92 + 30 + (q ? qs + 6 : 0) + (b.text ? 54 : 0) + (stamped ? 70 : 0) + subH + (hang === "hook" ? 34 : 0));
  void f;
  return {size, w, h, stamped, qs, sub, hero, body};
};

export const HeroTag: React.FC<{ctx: Ctx; n: LookNum; anchor: [number, number] | null; y?: number; at?: number; mode?: "swing" | "flip"; maxNumW?: number; q?: string; backName?: string; hang?: "thread" | "hook"}> =
  ({ctx, n, anchor, y: y0, at, mode = "flip", maxNumW = 520, q = "", backName: back0, hang = "thread"}) => {
  const {f, B, M, b, L, p} = ctx;
  const hk = hang === "hook";
  const y = y0 ?? (hk ? HOOK_Y : 392);
  const mono = fitFont(B.f.mono, 0.06);
  const lockAt = at ?? n.lockF;
  const {size, w, h, stamped, qs, sub, hero} = tagMetrics(ctx, n, q, maxNumW, hang);
  const ink = assertContrast(B.c.ink, B.c.paper, size, "hero tag");
  const textAt = Math.max(lockAt, ...b.textNums.map((x) => x.lockF));
  const right = p.side === "right";
  const x = right ? SAFE.x1 - w : SAFE.x0;
  const tilt = hk ? 0 : (right ? 1 : -1) * (1.2 + rnd(L.seed, "tag", b.i) * 2.6);
  const pad = hk ? {left: 34, top: 50, right: 34, height: h - 58} : {left: 64, top: 12, right: 14, height: h - 20};
  const front = <>
    <div style={{position: "absolute", ...pad}}>
      {q && <div style={{...fitCss(mono, qs), color: assertContrast(B.c.accent, B.c.paper, qs, "tag qualifier"), lineHeight: 1, marginBottom: 6}}>{q.toUpperCase()}</div>}
      <div style={{height: size * 0.92, lineHeight: 0.92}}><Num n={n} f={f} font={hero} size={size} color={ink} blank={rgba(B.c.ink, 0.12)} where="hero tag"/></div>
      {b.text && <div style={{position: "relative", marginTop: 8, height: 46}}><TextStrip ctx={ctx} x={0} y={0} w={w - (hk ? 68 : 84)} at={textAt} size={32} lines={1}/></div>}
      {sub && f >= textAt && <div style={{marginTop: 6}}>{sub.lines.map((l, i) => <div key={i} style={{...fitCss(fitFont(B.f.body), sub.size), fontWeight: 500,
        color: assertContrast(B.c.softInk, B.c.paper, sub.size, "tag sub"), lineHeight: 1.25}}>{l}</div>)}</div>}
    </div>
    {stamped && f >= lockAt + 15 && <Stamp B={B} text={L.sourceLabel!} x={w - 340} y={h - 82} rot={-3} k={clamp01((f - lockAt - 15) / 5)} maxW={260}/>}
  </>;
  // the pendulum of a hook-hung tag: a steady sway, kicked on the lock
  const pivot: [number, number] = [x + w / 2, y - 34];
  const pend = (node: React.ReactNode, drop = 1) => !hk ? node : <>
    <div style={{position: "absolute", inset: 0, transformOrigin: `${pivot[0]}px ${pivot[1]}px`,
      transform: `rotate(${2.2 * Math.sin((f - b.f0) / 11 + b.i) + (f >= lockAt ? 5 * Math.exp(-(f - lockAt) / 14) * Math.cos((f - lockAt) / 3.2) : 0)}deg)`}}>
      <div style={{position: "absolute", left: pivot[0] - 2, top: pivot[1], width: 4, height: (y + 30) - pivot[1] - (1 - drop) * 140, background: M.thread}}/>
      {node}
    </div>
    <div style={{position: "absolute", left: pivot[0] - 11, top: pivot[1] - 11, width: 22, height: 22, borderRadius: 11, background: `radial-gradient(circle at 35% 30%, ${M.brassLight}, ${M.brassDark})`, boxShadow: `2px 4px 5px ${rgba(M.shadow, 0.5)}`}}/>
  </>;
  if (mode === "flip" && lockAt - b.f0 > 6) {
    const fl = flip(f, lockAt, 8);
    // the blank back carries the item's name (never a digit) so the hanging tag says what it prices
    const nm = (back0 ?? (b.kicker ? b.kicker.split(" · ")[0] : b.name ?? "")).toUpperCase();
    const backName = /\d/.test(nm) ? (b.name ?? "").toUpperCase() : nm;
    const bn = /\d/.test(backName) ? "" : backName;
    const backS = bn ? fitLines(bn, mono, w - 100, 2, 40, 28) : null;
    const drop = ease(f, b.f0, b.f0 + 10);
    const sway = hk ? 0 : 3 * Math.sin((f - b.f0) / 9) * Math.exp(-Math.max(0, f - b.f0) / 40);
    return pend(<Tag M={M} x={x} y={y - (1 - drop) * 140} w={w} h={h} rot={tilt} swing={sway} anchor={hk ? null : anchor} flipDeg={fl.deg} vis={drop > 0 ? 1 : 0} holeSide={hk ? "top" : "left"}
      back={<div style={{position: "absolute", inset: hk ? "40px 22px 22px" : 22, border: `3px dashed ${M.kraftDark}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
        {backS && backS.lines.map((l, i) => <span key={i} style={{...fitCss(mono, backS.size), lineHeight: 1.15, color: assertContrast(B.c.ink, M.kraft, backS.size, "tag back")}}>{l}</span>)}
      </div>}>{front}</Tag>, drop);
  }
  const t = tagIn(f, lockAt);
  if (t.vis <= 0) return null;
  return pend(<Tag M={M} x={x} y={y} w={w} h={h} rot={tilt} swing={hk ? 0 : t.rot} scale={hk ? 1 : 0.85 + 0.15 * t.s} vis={t.vis} anchor={hk ? null : anchor} holeSide={hk ? "top" : "left"}>{front}</Tag>);
};

// The kicker sign and the hero tag of a tower or column beat, in the beat's chosen arrangement: sign above a tag on a
// thread (the default), or a tag hung from a wall nail with the sign under it on the other side.
export const HeroBlock: React.FC<{ctx: Ctx; n: LookNum; anchor: [number, number] | null; mode?: "swing" | "flip"; q?: string; maxNumW?: number}> = ({ctx, n, anchor, mode, q = "", maxNumW}) => {
  const hang = ctx.p.hang ?? "thread";
  if (hang === "thread") return <><KickerSign ctx={ctx}/><HeroTag ctx={ctx} n={n} anchor={anchor} q={q} mode={mode} maxNumW={maxNumW}/></>;
  const m = tagMetrics(ctx, n, q, maxNumW ?? 520, "hook");
  const other: "left" | "right" = ctx.p.side === "right" ? "left" : "right";
  return <>
    <KickerSign ctx={{...ctx, p: {...ctx.p, side: other}}} y={HOOK_Y + m.h + 30}/>
    <HeroTag ctx={ctx} n={n} anchor={anchor} q={q} mode={mode} maxNumW={maxNumW} hang="hook"/>
  </>;
};
export const tagBottom = (y = 392) => y;

// The value tag on a pile or column top, with the value's printed qualifier and its provenance.
export const ValueTag: React.FC<{ctx: Ctx; it: Item; ax: number; ay: number; size?: number; at?: number}> = ({ctx, it, ax, ay, size, at}) => {
  if (!it.num) return null;
  return <TopTag B={ctx.B} M={ctx.M} n={it.num} f={ctx.f} ax={ax} ay={ay} q={it.q} prov={provOf(ctx.L, it.num, it.srcBeat)} size={size} dim={it.ghost} at={at}/>;
};

// ---------------------------------------------------------------- TOWER
export const towerFrame = (ctx: Ctx) => {
  const {p} = ctx;
  const fam = p.fam!;
  const maxV = Math.max(...p.items.map((x) => x.v), p.range?.hi ?? 0);
  const xs = slots(p.items.length);
  const hi = Math.max(0, p.items.findIndex((x) => x.hero));
  return {objH: maxV * fam.layer + 30, focus: [xs[hi], STAGE.base - maxV * fam.layer * 0.6] as [number, number]};
};


export const Tower: React.FC<{ctx: Ctx; cam: Cam}> = ({ctx, cam}) => {
  const {p, f, B, M, b, hook} = ctx;
  const fam = p.fam!;
  const items = p.items;
  const xs = slots(items.length);
  const w = pileW(fam, items.length);
  const hi = items.findIndex((x) => x.hero);
  const heroIt = items[hi];
  const L0 = items.map((it, k) => landing(ctx, it, k));
  const heightNow = (it: Item, k: number) => {
    if (it.ghost || hook) return it.v;
    const l = L0[k];
    const landed = Math.max(0, Math.min(Math.ceil(it.v), Math.floor((on2(f) - l.start) / l.gap) + 1));
    return Math.min(it.v, landed);
  };
  const topY = (k: number) => STAGE.base - heightNow(items[k], k) * fam.layer - (fam.obj === "bar" ? fam.layer * 0.42 : w * 0.15);
  const topOf = (k: number) => project(cam, xs[k], topY(k));
  const r = p.range;
  return <>
    <World ctx={ctx} cam={cam}>
      {/* the hook: the piles stand built, their last layers landing between f0 and f6 */}
      {items.map((it, k) => <Pile key={k} kind={fam.obj} M={M} cx={xs[k]} base={STAGE.base} w={w} layer={fam.layer} v={it.v} f={f} seed={`${b.i}-${k}`}
        landAt={hook ? b.f0 + 6 - (Math.ceil(it.v) - 1) * 2 - (k === hi ? 0 : 2) : L0[k].start} gap={hook ? 2 : L0[k].gap} ghost={it.ghost}/>)}
      {r && heroIt && !hook && f >= r.f && <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        {(() => {
          const x = xs[hi] + w / 2 + 26, yl = STAGE.base - r.lo * fam.layer, yh = STAGE.base - r.hi * fam.layer;
          const k = ease(f, r.f, r.f + 12);
          return <g opacity={k}>
            <rect x={xs[hi] - w / 2} y={yh} width={w} height={(r.hi - heroIt.v) * fam.layer} fill="none" stroke={M.goldEdge} strokeWidth={2.5} strokeDasharray="8 7"/>
            <path d={`M${x - 12},${yl} L${x},${yl} L${x},${yl + (yh - yl) * k} L${x - 12},${yl + (yh - yl) * k}`} fill="none" stroke={B.c.accent2Light} strokeWidth={5}/>
          </g>;
        })()}
      </svg>}
    </World>
    {!hook && (heroIt?.num ? <HeroBlock ctx={ctx} n={heroIt.num} anchor={topOf(hi)} q={heroIt.q} mode={heroIt.lockF - b.f0 > 30 ? "flip" : "swing"}/> : <KickerSign ctx={ctx}/>)}
    {/* the other values sit on their own piles (earlier heroes as ghosts, with their provenance) */}
    {!hook && (() => {
      const pts = items.map((it, k) => (it.hero || !it.num ? null : topOf(k)));
      const ays = spreadAy(B, items.map((it, k) => (pts[k] ? {n: it.num!, q: it.q, prov: provOf(ctx.L, it.num, it.srcBeat), size: 40, ax: pts[k]![0], ay: pts[k]![1]} : null)));
      return items.map((it, k) => pts[k] ? <ValueTag key={k} ctx={ctx} it={it} ax={pts[k]![0]} ay={ays[k]} size={40} at={it.ghost ? b.f0 + 6 : undefined}/> : null);
    })()}
    {r && heroIt && !hook && f >= r.f + 6 && (() => {
      const [x, yh] = project(cam, xs[hi] + w / 2 + 34, STAGE.base - r.hi * fam.layer);
      const [, yl] = project(cam, 0, STAGE.base - r.lo * fam.layer);
      const mono = fitFont(B.f.mono);
      const ink = assertContrast(B.c.ink, B.c.accent2Light, 30, "range pill");
      const pill = (t: string, y: number) => <div style={{position: "absolute", left: Math.min(x, SAFE.x1 - measure(t, mono, 30) - 22), top: y - 22, padding: "4px 10px", borderRadius: 6,
        background: B.c.accent2Light, ...fitCss(mono, 30), color: ink, lineHeight: 1.1, opacity: ease(f, r.f + 6, r.f + 12)}}>{t}</div>;
      return <>{pill(r.hiText.trim(), yh - 18)}{pill(r.loText, yl + 22)}</>;
    })()}
    <ShelfRow B={B} M={M} labels={items.map((it, k) => ({cx: project(cam, xs[k], STAGE.base)[0], name: it.name, on: f >= it.nameF && !(hook && /\d/.test(it.name)), hot: it.hero && !hook, dim: it.ghost}))}/>
  </>;
};

// ---------------------------------------------------------------- RATIO
// The big pile left, copies of the small one dropped as solid true-height blocks on the right; bracket lines mark each
// copy (no derived numbers: the card prints the ratio as data.json has it). The card slams on the right this time, so the
// beat does not repeat the hook's frame, and the camera punches onto the two tops on the first bar line.
const RA = 300, RC = 640;
export const ratioFrame = (ctx: Ctx) => {
  const {p} = ctx;
  const fam = p.fam!;
  const [A, C] = p.items;
  const h = Math.max(A.v, C.v * (p.copies ?? 1)) * fam.layer;
  return {objH: h + 30, focus: [(RA + RC) / 2, STAGE.base - A.v * fam.layer] as [number, number]};
};

export const Ratio: React.FC<{ctx: Ctx; cam: Cam}> = ({ctx, cam}) => {
  const {p, f, B, M, b, hook} = ctx;
  const fam = p.fam!;
  const [A, C] = p.items;
  const n = p.copies ?? 1;
  const w = pileW(fam, 2);
  // the hook: the first copy lands between f0 and f6; the rest wait (as ghosts) for the hero's word
  const copyAt = (j: number) => hook ? (j === 0 ? b.f0 + 4 : (b.hero?.lockF ?? b.f0) + 10 + (j - 1) * 7) : b.f0 + 4 + j * 7;
  const big = b.big ?? b.hero;
  const lockF = big?.lockF ?? b.lockF;
  const cardIn = slam(f, lockF);
  const hero = fitFont(B.f.hero), disp = fitFont(B.f.display);
  const size = big ? fitSize(big.text, hero, 400, 210, 90) : 0;
  const cw = big ? measure(big.text, hero, size) + 80 : 0, ch = size * 0.96 + 56;
  const cardX = SAFE.x1 - cw;
  return <>
    <World ctx={ctx} cam={cam}>
      <Pile kind={fam.obj} M={M} cx={RA} base={STAGE.base} w={w} layer={fam.layer} v={A.v} f={f} seed={`${b.i}-a`} settled/>
      {Array.from({length: n}, (_, j) => {
        const at = copyAt(j);
        if (on2(f) < at - 8) return null;
        const fall = clamp01((on2(f) - (at - 8)) / 8);
        const y = -(1 - fall * fall) * 300;
        const sq = on2(f) >= at ? 1 - 0.06 * Math.exp(-(on2(f) - at) / 3) : 1;
        const by = STAGE.base - j * C.v * fam.layer;
        const ghost = hook && j > 0;
        return <div key={j} style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translate(0px, ${y}px)`, transformOrigin: `${RC}px ${by}px`}}>
          <div style={{position: "absolute", inset: 0, transform: `scale(1, ${sq})`, transformOrigin: `${RC}px ${by}px`}}>
            <Pile kind={fam.obj} M={M} cx={RC} base={by} w={w} layer={fam.layer} v={C.v} f={f} seed={`${b.i}-c${j}`} settled shadow={j === 0} ghost={ghost}/>
          </div>
        </div>;
      })}
      {f >= lockF + 6 && <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <line x1={RA - w / 2} x2={RC + w / 2 + 10} y1={STAGE.base - A.v * fam.layer} y2={STAGE.base - A.v * fam.layer} stroke={M.paper} strokeWidth={3} strokeDasharray="10 8"
          opacity={ease(f, lockF + 6, lockF + 14)}/>
      </svg>}
    </World>
    {!hook && <KickerSign ctx={ctx}/>}
    {f >= lockF && Array.from({length: n}, (_, j) => {
      if (hook && f < copyAt(j)) return null;
      const [x, y0] = project(cam, RC + w / 2 + 14, STAGE.base - j * C.v * fam.layer - 3);
      const [, y1] = project(cam, 0, STAGE.base - (j + 1) * C.v * fam.layer + 3);
      const k = ease(f, lockF + j * 4, lockF + j * 4 + 10);
      return <svg key={j} width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <path d={`M${x},${y0} L${x + 14},${y0} L${x + 14},${y0 + (y1 - y0) * k} L${x},${y0 + (y1 - y0) * k}`} fill="none" stroke={B.c.paper} strokeWidth={4} opacity={0.9}/>
      </svg>;
    })}
    {/* the two values on their piles: the big on its top, the small beside its first copy */}
    {!hook && (() => {
      const [ax, ay] = project(cam, RA, STAGE.base - A.v * fam.layer - 8);
      const [cx, cy] = project(cam, RC + w / 2 + 20, STAGE.base - C.v * fam.layer * 0.5 + 40);
      return <>
        <ValueTag ctx={ctx} it={A} ax={ax} ay={ay} size={40} at={Math.max(A.lockF, b.f0 + 8)}/>
        <ValueTag ctx={ctx} it={C} ax={Math.min(cx + 80, SAFE.x1 - 80)} ay={cy} size={36} at={Math.max(C.lockF, b.f0 + 8)}/>
      </>;
    })()}
    {!hook && <SubNote ctx={ctx} x={SAFE.x0} y={398 + ch + 24} w={Math.min(W_SAFE, 520)}/>}
    {!hook && big && cardIn.vis > 0 && <Card M={M} x={cardX} y={398} w={cw} h={ch} rot={3} scale={cardIn.s} bg={B.c.paper} origin="100% 50%">
      <div style={{position: "absolute", left: 40, top: 26}}><Num n={big} f={f} font={hero} size={size} color={assertContrast(B.c.accent, B.c.paper, size, "ratio card")} blank={rgba(B.c.ink, 0.1)} where="ratio card"/></div>
    </Card>}
    {!hook && big && f >= lockF + 4 && b.text && (() => {
      const x = SAFE.x0, ww = cardX - 30 - x;
      const s = fitSize(b.text!.split(" ").slice(0, 2).join(" "), disp, ww, 58, 40);
      const words = b.text!.split(" ");
      const lines: string[] = []; let cur = "";
      for (const wd of words) { const nx = cur ? cur + " " + wd : wd; if (cur && measure(nx, disp, s) > ww) { lines.push(cur); cur = wd; } else cur = nx; }
      if (cur) lines.push(cur);
      const top = 404;
      return <div style={{position: "absolute", left: x, top, width: ww, textAlign: "right"}}>
        {lines.slice(0, 4).map((l, i) => <div key={i} style={{...fitCss(disp, s), color: assertContrast(B.c.paper, M.wall, s, "ratio text"), lineHeight: 1.04, opacity: ease(f, lockF + 4, lockF + 10)}}>{l}</div>)}
      </div>;
    })()}
    {[A, C].map((it, k) => {
      const [lx] = project(cam, k ? RC : RA, STAGE.base);
      return <ShelfLabel key={k} B={B} M={M} cx={lx} maxW={340} name={it.name} nameOn={f >= it.nameF && !(hook && /\d/.test(it.name))} hot={k === 0 && !hook}/>;
    })}
  </>;
};

// ---------------------------------------------------------------- RACK (tiny against huge, same scale) + loupe
// The tiny piece stands left (its tag's thread drops straight to it), the big pile blurred at the right edge at the same
// scale, and a brass loupe in the middle magnifies the piece: a gold block split at the sub-value's true proportion, with
// a bracket and pill on the part the sub-value names, so it is clear which part is which.
const XH = 290, XB = 800;
export const rackFrame = (ctx: Ctx) => {
  const {p} = ctx;
  const fam = p.fam!;
  const big = p.items.find((x) => x.ghost);
  return {objH: (big?.v ?? 2) * fam.layer, focus: [XH, STAGE.base - 40] as [number, number]};
};

// The magnified piece inside the loupe: a gold ingot (tapered front, a stamped recess, a lit top face), a single steel
// coin, or a paper pad, standing at the lens centre. Its height h is the true value at the loupe's scale.
const LoupePiece: React.FC<{kind: Fam["obj"]; M: Mat; cx: number; bot: number; w: number; h: number; d: number}> = ({kind, M, cx, bot, w, h, d}) => {
  const gid = useUid("lp");
  const x0 = cx - w / 2, ty = bot - h, t = w * 0.06;
  if (kind === "bar") {
    return <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      <defs><linearGradient id={`${gid}f`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={M.goldFront}/><stop offset="0.5" stopColor={M.goldMid}/><stop offset="1" stopColor={M.goldDeep}/></linearGradient>
        <linearGradient id={`${gid}t`} x1="0" y1="1" x2="0.4" y2="0"><stop offset="0" stopColor={M.goldTop}/><stop offset="1" stopColor={M.goldFront}/></linearGradient></defs>
      <path d={`M${x0},${bot} L${x0 + w},${bot} L${x0 + w - t},${ty} L${x0 + t},${ty} Z`} fill={`url(#${gid}f)`}/>
      <path d={`M${x0 + t},${ty} L${x0 + w - t},${ty} L${x0 + w - t * 1.9},${ty - d} L${x0 + t * 1.9},${ty - d} Z`} fill={`url(#${gid}t)`}/>
      <path d={`M${x0 + t},${ty} L${x0 + w - t},${ty}`} stroke={M.goldEdge} strokeWidth={2.5}/>
      <rect x={x0 + w * 0.2} y={ty + h * 0.2} width={w * 0.6} height={h * 0.6} rx={8} fill="none" stroke={M.goldEdge} strokeWidth={2.5} opacity={0.55}/>
      <rect x={x0 + w * 0.08} y={ty + 6} width={w * 0.035} height={h - 14} fill={M.paper} opacity={0.3}/>
    </svg>;
  }
  const coin = kind === "coin";
  const face = coin ? M.coin : M.token, edge = coin ? M.coinEdge : M.tokenEdge, dark = coin ? M.coinDark : M.tokenDark;
  return <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
    <defs><linearGradient id={`${gid}e`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={dark}/><stop offset="0.3" stopColor={face}/><stop offset="0.7" stopColor={edge}/><stop offset="1" stopColor={dark}/></linearGradient></defs>
    <rect x={x0} y={ty} width={w} height={h} fill={`url(#${gid}e)`}/>
    <path d={`M${x0},${ty} L${x0 + w},${ty} L${x0 + w - w * 0.05},${ty - d} L${x0 + w * 0.05},${ty - d} Z`} fill={face} stroke={edge} strokeWidth={2}/>
  </svg>;
};

export const Rack: React.FC<{ctx: Ctx; cam: Cam}> = ({ctx, cam}) => {
  const {p, f, B, M, b} = ctx;
  const fam = p.fam!;
  const hero = p.items.find((x) => x.hero)!;
  const subs = p.items.filter((x) => !x.hero && !x.ghost);
  const big = p.items.find((x) => x.ghost);
  const wh = 280;
  const landAt = b.f0 + 8;
  const loupeAt = Math.max(hero.lockF + 24, b.f0 + Math.round(ctx.L.barF * 1.4));
  const lk = ease(f, loupeAt, loupeAt + 10);
  const [px, py] = project(cam, XH, STAGE.base - hero.v * fam.layer * 0.5);
  const R = 172, lcx = 600, lcy = 958;
  const mono = fitFont(B.f.mono), heroF = fitFont(B.f.hero);
  const mag = Math.min(9, (R * 1.0) / Math.max(1, hero.v * fam.layer));
  const ph = hero.v * fam.layer * mag, pw = 2 * R * 0.72;
  const pd = Math.min(44, ph * 0.25);           // the piece's top face
  const pBot = R + (ph + pd) / 2;
  const fl = (side: "left" | "right") => ({...ctx, p: {...p, side}});
  return <>
    <World ctx={ctx} cam={cam}>
      {big && <div style={{position: "absolute", inset: 0, filter: "blur(4px)", opacity: 0.85}}>
        <Pile kind={fam.obj} M={M} cx={XB} base={STAGE.base} w={170} layer={fam.layer} v={big.v} f={f} seed={`${b.i}-big`} settled/>
      </div>}
      <Pile kind={fam.obj} M={M} cx={XH} base={STAGE.base} w={wh} layer={fam.layer} v={hero.v} f={f} seed={`${b.i}-h`} landAt={landAt} gap={2}/>
    </World>
    <KickerSign ctx={fl("left")}/>
    {hero.num && <HeroTag ctx={fl("left")} n={hero.num} anchor={project(cam, XH, STAGE.base - hero.v * fam.layer - 8)} q={hero.q}/>}
    {big?.num && (() => {
      const [ax, ay] = project(cam, XB, STAGE.base - big.v * fam.layer - 8);
      return <ValueTag ctx={ctx} it={big} ax={SAFE.x1} ay={762} size={36} at={b.f0 + 6}/>;
    })()}
    {lk > 0 && <>
      <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: lk, overflow: "visible"}}>
        <path d={`M${px + wh / 2 * cam.s - 20},${py - 14} L${lcx - R * 0.72},${lcy + R * 0.7}`} stroke={B.c.paper} strokeWidth={3} strokeDasharray="9 8" opacity={0.8}/>
      </svg>
      <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${0.7 + 0.3 * lk})`, transformOrigin: `${lcx}px ${lcy}px`, opacity: lk}}>
        <Loupe M={M} cx={lcx} cy={lcy} r={R} label={<div style={{position: "absolute", left: -200, top: R * 0.3, padding: "4px 12px", background: M.brassLight, borderRadius: 6,
          ...fitCss(mono, 30), color: assertContrast(B.c.ink, M.brassLight, 30, "loupe label"), lineHeight: 1.1}}>ZOOMED IN</div>}>
          {/* the piece, magnified, drawn by the same unit renderer as the piles (a bar or a coin, not a box) */}
          <LoupePiece kind={fam.obj} M={M} cx={R} bot={pBot} w={pw} h={ph} d={pd}/>
          <svg width={2 * R} height={2 * R} style={{position: "absolute", left: 0, top: 0}}>
            {subs.filter((s) => shown(s.num, f)).map((s, i) => {
              const y = pBot - (s.v / hero.v) * ph;
              return <g key={i}>
                <rect x={R - pw / 2} y={y} width={pw} height={pBot - y} fill={M.shadow} opacity={0.18}/>
                <line x1={R - pw / 2 - 10} x2={R + pw / 2 + 10} y1={y} y2={y} stroke={B.c.ink} strokeWidth={3.5} strokeDasharray="10 6"/>
                <path d={`M${R + pw / 2 + 8},${y + 3} L${R + pw / 2 + 22},${y + 3} L${R + pw / 2 + 22},${pBot - 3} L${R + pw / 2 + 8},${pBot - 3}`} fill="none" stroke={B.c.paper} strokeWidth={4}/>
              </g>;
            })}
          </svg>
        </Loupe>
      </div>
      {subs.map((s, i) => {
        if (!s.num || !shown(s.num, f)) return null;
        const yMid = lcy - R + pBot - ((s.v / hero.v) * ph) / 2;
        const ww = 280, x = SAFE.x1 - ww;
        const text = s.name.toUpperCase();
        const ns = fitSize(text, mono, ww - 30, 32, 26), vs = fitSize(s.num.text, heroF, ww - 30, 50, 34);
        const yy = Math.min(SAFE.y1 - 250, lcy + R + 24 + i * 120);
        return <React.Fragment key={i}>
          <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: lk, overflow: "visible"}}>
            <path d={`M${lcx + pw / 2 + 22},${yMid} Q${x + 40},${yMid} ${x + 60},${yy}`} fill="none" stroke={B.c.paper} strokeWidth={3}/>
          </svg>
          <div style={{position: "absolute", left: x, top: yy, width: ww, opacity: lk}}>
            <div style={{background: B.c.paper, padding: "8px 14px", display: "inline-block", boxShadow: `4px 6px 10px ${rgba(M.shadow, 0.5)}`, borderLeft: `6px solid ${M.goldDeep}`}}>
              <div style={{...fitCss(mono, ns), color: assertContrast(B.c.ink, B.c.paper, ns, "loupe pill"), lineHeight: 1.1, opacity: f >= s.nameF ? 1 : 0}}>{text}</div>
              <Num n={s.num} f={f} font={heroF} size={vs} color={B.c.ink} blank={rgba(B.c.ink, 0.15)} where="loupe value"/>
            </div>
          </div>
        </React.Fragment>;
      })}
    </>}
    {big && <ShelfLabel B={B} M={M} cx={project(cam, XB, 0)[0]} maxW={300} name={big.name} nameOn dim/>}
    <ShelfLabel B={B} M={M} cx={project(cam, XH, 0)[0]} maxW={320} name={hero.name} nameOn={f >= hero.nameF} hot/>
  </>;
};
