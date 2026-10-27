// Unit piles: TOWER (one or more true-height piles of one unit, earlier values of the same unit as dashed ghosts, an
// estimate range as a bracket), RATIO (copies of the small pile dropped as solid true-height blocks beside the big one;
// the gap stays visible) and RACK (a value under about one unit: a single cut piece at the same scale, the big pile
// blurred behind, and a brass loupe that magnifies the piece with its sub-value split at true proportion).
import React from "react";
import {fitCss, fitFont, fitLines, fitSize, measure} from "../shared/fit";
import {shown} from "../shared/lock";
import type {LookNum} from "../shared/types";
import {project, type Cam} from "./camera";
import {assertContrast, rgba} from "./materials";
import {clamp01, ease, flip, on2, rnd, slam, tagIn} from "./motion";
import {Loupe, Pile} from "./objects";
import type {Fam, Item} from "./plan";
import {Card, LABEL_Y, Num, SAFE, ShelfLabel, Stamp, Tag, W_SAFE} from "./props";
import {KickerSign, SubNote, TextStrip, World, slots, type Ctx} from "./scene";
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

const keyText = (fam: Fam) => `1 ${fam.noun} = ${fam.perText}`;

// The hero tag: the number and the fact's text, on maroon thread to its object. "swing": it springs in on the lock with a
// decaying swing (piles); "flip": it hangs from the beat start showing its blank kraft back and flips over on the lock
// (jars, priced items). A provenance stamp may land on its lower corner.
export const HeroTag: React.FC<{ctx: Ctx; n: LookNum; anchor: [number, number] | null; y?: number; at?: number; mode?: "swing" | "flip"; maxNumW?: number}> =
  ({ctx, n, anchor, y = 392, at, mode = "swing", maxNumW = 540}) => {
  const {f, B, M, b, L} = ctx;
  const hero = fitFont(B.f.hero), body = fitFont(B.f.body);
  const lockAt = at ?? n.lockF;
  const size = fitSize(n.text, hero, maxNumW, 150, 70);
  const textW = b.text ? Math.min(600, measure(b.text, body, 30) + 10) : 0;
  const stamped = !!L.sourceLabel && b.src.includes(L.sourceLabel);
  const w = Math.min(W_SAFE - 30, Math.max(measure(n.text, hero, size), textW, stamped ? 420 : 0) + 110);
  // the text-led cut (no narration) also prints the card's sub on the tag
  const sub = L.textLed && b.subShown && !ctx.p.sub ? fitLines(b.subShown, fitFont(B.f.body), w - 90, 3, 24, 18) : null;
  const subH = sub ? sub.lines.length * Math.round(sub.size * 1.25) + 10 : 0;
  const h = Math.round(size * 0.92 + 30 + (b.text ? 52 : 0) + (stamped ? 66 : 0) + subH);
  const ink = assertContrast(B.c.ink, B.c.paper, size, "hero tag");
  const textAt = Math.max(lockAt, ...b.textNums.map((x) => x.lockF));
  const tilt = -(1.2 + rnd(L.seed, "tag", b.i) * 2.6);      // each story's tags hang a little differently
  const front = <>
    <div style={{position: "absolute", left: 64, top: 12, right: 14, height: h - 20}}>
      <div style={{height: size * 0.92, lineHeight: 0.92}}><Num n={n} f={f} font={hero} size={size} color={ink} blank={rgba(B.c.ink, 0.12)} where="hero tag"/></div>
      {b.text && <div style={{position: "relative", marginTop: 8, height: 44}}><TextStrip ctx={ctx} x={0} y={0} w={w - 84} at={textAt} size={30} lines={1}/></div>}
      {sub && f >= textAt && <div style={{marginTop: 6}}>{sub.lines.map((l, i) => <div key={i} style={{...fitCss(fitFont(B.f.body), sub.size), fontWeight: 500,
        color: assertContrast(B.c.softInk, B.c.paper, sub.size, "tag sub"), lineHeight: 1.25}}>{l}</div>)}</div>}
    </div>
    {stamped && f >= lockAt + 15 && <Stamp B={B} text={L.sourceLabel!} x={w - 330} y={h - 78} rot={-3} k={clamp01((f - lockAt - 15) / 5)} maxW={250}/>}
  </>;
  if (mode === "flip") {
    const fl = flip(f, lockAt, 8);
    // the blank back carries the item's name (never a digit) so the hanging tag says what it prices
    const mono = fitFont(B.f.mono, 0.06);
    const nm = (b.kicker && !/\d/.test(b.kicker) ? b.kicker : b.name ?? "").toUpperCase();
    const backName = /\d/.test(nm) ? "" : nm;
    const backS = backName ? fitSize(backName, mono, w - 90, 34, 18) : 0;
    const sway = 3 * Math.sin((f - b.f0) / 9) * Math.exp(-Math.max(0, f - b.f0) / 40);
    return <Tag M={M} x={SAFE.x0} y={y} w={w} h={h} rot={tilt} swing={sway} anchor={anchor} flipDeg={fl.deg}
      back={<div style={{position: "absolute", inset: 22, border: `3px dashed ${M.kraftDark}`, display: "flex", alignItems: "center", justifyContent: "center"}}>
        {backName && <span style={{...fitCss(mono, backS), color: assertContrast(B.c.ink, M.kraft, backS, "tag back")}}>{backName}</span>}
      </div>}>{front}</Tag>;
  }
  const t = tagIn(f, lockAt);
  if (t.vis <= 0) return null;
  return <Tag M={M} x={SAFE.x0} y={y} w={w} h={h} rot={tilt} swing={t.rot} scale={0.85 + 0.15 * t.s} vis={t.vis} anchor={anchor}>{front}</Tag>;
};
export const tagBottom = (y = 392) => y;

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
  const topOf = (k: number) => project(cam, xs[k], STAGE.base - heightNow(items[k], k) * fam.layer - (fam.obj === "bar" ? fam.layer * 0.42 : w * 0.15));
  const r = p.range;
  return <>
    <World ctx={ctx} cam={cam}>
      {items.map((it, k) => <Pile key={k} kind={fam.obj} M={M} cx={xs[k]} base={STAGE.base} w={w} layer={fam.layer} v={it.v} f={f} seed={`${b.i}-${k}`}
        landAt={hook ? b.f0 - 12 - Math.ceil(it.v) * 2 + (k === hi ? 16 : 0) : L0[k].start} gap={hook ? 2 : L0[k].gap} ghost={it.ghost}/>)}
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
    {!hook && <KickerSign ctx={ctx} unitKey={heroIt ? {text: keyText(fam), at: heroIt.lockF + 12} : undefined}/>}
    {!hook && heroIt?.num && <HeroTag ctx={ctx} n={heroIt.num} anchor={topOf(hi)}/>}
    {r && heroIt && !hook && f >= r.f + 6 && (() => {
      const [x, yh] = project(cam, xs[hi] + w / 2 + 34, STAGE.base - r.hi * fam.layer);
      const [, yl] = project(cam, 0, STAGE.base - r.lo * fam.layer);
      const mono = fitFont(B.f.mono);
      const ink = assertContrast(B.c.ink, B.c.accent2Light, 24, "range pill");
      const pill = (t: string, y: number) => <div style={{position: "absolute", left: Math.min(x, SAFE.x1 - measure(t, mono, 24) - 22), top: y - 18, padding: "4px 10px", borderRadius: 6,
        background: B.c.accent2Light, ...fitCss(mono, 24), color: ink, lineHeight: 1.1, opacity: ease(f, r.f + 6, r.f + 12)}}>{t}</div>;
      return <>{pill(r.hiText.trim(), yh - 14)}{pill(r.loText, yl + 18)}</>;
    })()}
    {items.map((it, k) => {
      const [lx] = project(cam, xs[k], STAGE.base);
      return <ShelfLabel key={k} B={B} M={M} cx={lx} y={LABEL_Y} maxW={Math.min(300, (W_SAFE - 80) / items.length - 14)} name={it.name} nameOn={f >= it.nameF && !(hook && /\d/.test(it.name))}
        num={hook || it.hero ? null : it.num} f={f} hot={it.hero && !hook} dim={it.ghost}/>;
    })}
  </>;
};

// ---------------------------------------------------------------- RATIO
const RA = 300, RC = 600;
export const ratioFrame = (ctx: Ctx) => {
  const {p} = ctx;
  const fam = p.fam!;
  const [A, C] = p.items;
  const h = Math.max(A.v, C.v * (p.copies ?? 1)) * fam.layer;
  return {objH: h + 30, focus: [450, STAGE.base - A.v * fam.layer] as [number, number]};
};

export const Ratio: React.FC<{ctx: Ctx; cam: Cam}> = ({ctx, cam}) => {
  const {p, f, B, M, b, hook} = ctx;
  const fam = p.fam!;
  const [A, C] = p.items;
  const n = p.copies ?? 1;
  const w = pileW(fam, 2);
  const copyAt = (j: number) => hook ? (j === 0 ? b.f0 - 20 : (b.hero?.lockF ?? b.f0) + 10 + (j - 1) * 7) : b.f0 + 4 + j * 7;
  const big = b.big ?? b.hero;
  const lockF = big?.lockF ?? b.lockF;
  const cardIn = slam(f, lockF);
  const hero = fitFont(B.f.hero), mono = fitFont(B.f.mono), disp = fitFont(B.f.display);
  const size = big ? fitSize(big.text, hero, 400, 210, 90) : 0;
  const cw = big ? measure(big.text, hero, size) + 80 : 0, ch = size * 0.96 + 56;
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
    {!hook && <KickerSign ctx={ctx} unitKey={{text: keyText(fam), at: lockF + 16}}/>}
    {f >= lockF && Array.from({length: n}, (_, j) => {
      if (hook && f < copyAt(j)) return null;
      const [x, y0] = project(cam, RC + w / 2 + 14, STAGE.base - j * C.v * fam.layer - 3);
      const [, y1] = project(cam, 0, STAGE.base - (j + 1) * C.v * fam.layer + 3);
      const k = ease(f, lockF + j * 4, lockF + j * 4 + 10);
      const t = `×${j + 1}`;
      const ink = assertContrast(B.c.paper, M.wall, 30, "ratio bracket");
      return <React.Fragment key={j}>
        <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <path d={`M${x},${y0} L${x + 14},${y0} L${x + 14},${y0 + (y1 - y0) * k} L${x},${y0 + (y1 - y0) * k}`} fill="none" stroke={B.c.paper} strokeWidth={4} opacity={0.9}/>
        </svg>
        <div style={{position: "absolute", left: Math.min(x + 28, SAFE.x1 - measure(t, mono, 30)), top: (y0 + y1) / 2 - 18, ...fitCss(mono, 30), color: ink, opacity: k}}>{t}</div>
      </React.Fragment>;
    })}
    {!hook && <SubNote ctx={ctx} x={SAFE.x0} y={398 + ch + 24} w={Math.min(W_SAFE, 520)}/>}
    {!hook && big && cardIn.vis > 0 && <Card M={M} x={SAFE.x0} y={398} w={cw} h={ch} rot={-3} scale={cardIn.s} bg={B.c.paper} origin="4% 50%">
      <div style={{position: "absolute", left: 40, top: 26}}><Num n={big} f={f} font={hero} size={size} color={assertContrast(B.c.accent, B.c.paper, size, "ratio card")} blank={rgba(B.c.ink, 0.1)} where="ratio card"/></div>
    </Card>}
    {!hook && big && f >= lockF + 4 && b.text && (() => {
      const x = SAFE.x0 + cw + 36, ww = SAFE.x1 - x;
      const s = fitSize(b.text!.split(" ").slice(0, 2).join(" "), disp, ww, 54, 34);
      const words = b.text!.split(" ");
      const lines: string[] = []; let cur = "";
      for (const wd of words) { const nx = cur ? cur + " " + wd : wd; if (cur && measure(nx, disp, s) > ww) { lines.push(cur); cur = wd; } else cur = nx; }
      if (cur) lines.push(cur);
      const top = 398 + ch / 2 - (lines.length * s * 1.04) / 2;
      return <div style={{position: "absolute", left: x, top, width: ww}}>
        {lines.slice(0, 4).map((l, i) => <div key={i} style={{...fitCss(disp, s), color: assertContrast(B.c.paper, M.wall, s, "ratio text"), lineHeight: 1.04, opacity: ease(f, lockF + 4, lockF + 10)}}>{l}</div>)}
      </div>;
    })()}
    {[A, C].map((it, k) => {
      const [lx] = project(cam, k ? RC : RA, STAGE.base);
      return <ShelfLabel key={k} B={B} M={M} cx={lx} y={LABEL_Y} maxW={340} name={k && f >= lockF && !hook ? `${it.name} ×${n}` : it.name} nameOn={f >= it.nameF && !(hook && /\d/.test(it.name))}
        num={hook ? null : it.num} f={f} hot={k === 0 && !hook} dim={false}/>;
    })}
  </>;
};

// ---------------------------------------------------------------- RACK (tiny against huge, same scale) + loupe
const XB = 200, XH = 600;
export const rackFrame = (ctx: Ctx) => {
  const {p} = ctx;
  const fam = p.fam!;
  const big = p.items.find((x) => x.ghost);
  return {objH: (big?.v ?? 2) * fam.layer, focus: [XH, STAGE.base - 40] as [number, number]};
};

export const Rack: React.FC<{ctx: Ctx; cam: Cam}> = ({ctx, cam}) => {
  const {p, f, B, M, b} = ctx;
  const fam = p.fam!;
  const hero = p.items.find((x) => x.hero)!;
  const subs = p.items.filter((x) => !x.hero && !x.ghost);
  const big = p.items.find((x) => x.ghost);
  const wh = 300;
  const landAt = b.f0 + 8;
  const loupeAt = Math.max(hero.lockF + 24, b.f0 + Math.round(ctx.L.barF * 1.4));
  const lk = ease(f, loupeAt, loupeAt + 10);
  const [px, py] = project(cam, XH, STAGE.base - hero.v * fam.layer * 0.5);
  const R = 165, lcx = 470, lcy = 930;
  const mono = fitFont(B.f.mono), heroF = fitFont(B.f.hero);
  const mag = Math.min(9, (R * 1.05) / Math.max(1, hero.v * fam.layer));
  const ph = hero.v * fam.layer * mag, pw = 2 * R * 0.8;
  const pTop = R + ph / 2 - ph;
  const face = fam.obj === "bar" ? M.goldMid : fam.obj === "coin" ? M.coin : M.token;
  return <>
    <World ctx={ctx} cam={cam}>
      {big && <div style={{position: "absolute", inset: 0, filter: "blur(4px)", opacity: 0.85}}>
        <Pile kind={fam.obj} M={M} cx={XB} base={STAGE.base} w={150} layer={fam.layer} v={big.v} f={f} seed={`${b.i}-big`} settled/>
      </div>}
      <Pile kind={fam.obj} M={M} cx={XH} base={STAGE.base} w={wh} layer={fam.layer} v={hero.v} f={f} seed={`${b.i}-h`} landAt={landAt} gap={2}/>
    </World>
    <KickerSign ctx={ctx} unitKey={{text: keyText(fam), at: hero.lockF + 12}}/>
    {hero.num && <HeroTag ctx={ctx} n={hero.num} anchor={project(cam, XH, STAGE.base - hero.v * fam.layer - 8)}/>}
    {lk > 0 && <>
      <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, opacity: lk, overflow: "visible"}}>
        <path d={`M${px - wh / 2 * cam.s},${py} L${lcx - R * 0.8},${lcy + R * 0.6} M${px + wh / 2 * cam.s},${py} L${lcx + R * 0.8},${lcy + R * 0.6}`} stroke={B.c.paper} strokeWidth={3} strokeDasharray="9 8" opacity={0.8}/>
      </svg>
      <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${0.7 + 0.3 * lk})`, transformOrigin: `${lcx}px ${lcy}px`, opacity: lk}}>
        <Loupe M={M} cx={lcx} cy={lcy} r={R} label={<div style={{position: "absolute", left: R - 80, top: -58, padding: "3px 10px", background: M.brassLight, borderRadius: 6,
          ...fitCss(mono, 24), color: assertContrast(B.c.ink, M.brassLight, 24, "loupe label"), lineHeight: 1.1}}>ZOOMED IN</div>}>
          <svg width={2 * R} height={2 * R} style={{position: "absolute", left: 0, top: 0}}>
            <rect x={R - pw / 2} y={pTop} width={pw} height={ph} rx={4} fill={face}/>
            <rect x={R - pw / 2} y={pTop} width={pw} height={Math.min(10, ph * 0.12)} fill={fam.obj === "bar" ? M.goldTop : M.paper} opacity={0.7}/>
            {subs.filter((s) => shown(s.num, f)).map((s, i) => {
              const y = R + ph / 2 - (s.v / hero.v) * ph;
              return <g key={i}>
                <rect x={R - pw / 2} y={y} width={pw} height={R + ph / 2 - y} fill={M.goldDeep} opacity={0.45}/>
                <line x1={R - pw / 2} x2={R + pw / 2} y1={y} y2={y} stroke={B.c.ink} strokeWidth={3} strokeDasharray="10 6"/>
              </g>;
            })}
          </svg>
        </Loupe>
      </div>
      {subs.map((s, i) => {
        if (!s.num) return null;
        const x = lcx + R + 30, ww = SAFE.x1 - x;
        const text = s.name.toUpperCase();
        const ns = fitSize(text, mono, ww - 20, 24, 15), vs = fitSize(s.num.text, heroF, ww - 20, 40, 22);
        const yy = lcy + ph / 2 - (s.v / hero.v) * ph * 0.5 - 30 + i * 90;
        return <div key={i} style={{position: "absolute", left: x, top: yy, width: ww, opacity: lk}}>
          <div style={{background: B.c.paper, padding: "6px 10px", display: "inline-block", boxShadow: `4px 6px 10px ${rgba(M.shadow, 0.5)}`, borderLeft: `6px solid ${M.goldDeep}`}}>
            <div style={{...fitCss(mono, ns), color: assertContrast(B.c.ink, B.c.paper, ns, "loupe pill"), lineHeight: 1.1, opacity: f >= s.nameF ? 1 : 0}}>{text}</div>
            <Num n={s.num} f={f} font={heroF} size={vs} color={B.c.ink} blank={rgba(B.c.ink, 0.15)} where="loupe value"/>
          </div>
        </div>;
      })}
    </>}
    {big && <ShelfLabel B={B} M={M} cx={project(cam, XB, 0)[0]} y={LABEL_Y} maxW={260} name={big.name} nameOn num={big.num} f={f} dim/>}
    <ShelfLabel B={B} M={M} cx={project(cam, XH, 0)[0]} y={LABEL_Y} maxW={300} name={hero.name} nameOn={f >= hero.nameF} f={f} hot/>
  </>;
};
