// KADAI COUNTER: every number becomes an object on a lit shop counter (docs/datakadai/looks/LOOKS_SPEC.md, Kadai
// Counter, with the critic's fixes): unit piles at true fractional height with a brass unit key (gold bars, plain
// unmarked coins, paper count tokens), kirana glass jars for percentages (a level against last year's line, or a share
// of a graduated jar; never 100 countable units), a priced bottle or an unspecified pack with a tag, a flip-card stand
// for numbers with no natural object, an abacus for tallies, a thermal Kadai Bill for the takeaway, the tea-glass
// Mark for the end card, and the existing state map for basket stories. Straight-on, gently raked counter (no
// isometric). Heroes are tags and cards that land on the narrator's word (lockF), never before; stamps only for
// provenance. Every colour and face comes from the brand (B), every word and number from data.json (L).
import React, {useId, useMemo, useRef} from "react";
import {AbsoluteFill, random, useCurrentFrame} from "remotion";
import {BrandBug, bugBox} from "../shared/BrandBug";
import {fitCss, fitFont, fitSize} from "../shared/fit";
import {Grain} from "../shared/Grain";
import {LookAudio} from "../shared/LookAudio";
import type {LookProps} from "../shared/types";
import {beatAt} from "../shared/useLookData";
import {Bill, billStart, Proof, proofFrame} from "./bill";
import {baseCam, camAt, type Cam} from "./camera";
import {End, MapSheet, endFrame} from "./end";
import {FlipStand, Tally, flipFrame, tallyFrame} from "./flip";
import {Columns, colsFrame} from "./columns";
import {chitFor} from "./chits";
import {assertContrast, checkObjects, materials, rgba, type Mat} from "./materials";
import {ease, inOut} from "./motion";
import {Rack, Ratio, Tower, rackFrame, ratioFrame, towerFrame} from "./piles";
import {planStory, type Cut} from "./plan";
import {Product, productFrame} from "./product";
import {SAFE, SourceChit} from "./props";
import {hookCam, hookLayout, slots, type Ctx} from "./scene";
import {Light, STAGE} from "./surfaces";
import {useSafeCheck} from "./safecheck";

const frameOf = (ctx: Ctx) => {
  switch (ctx.p.dev) {
    case "tower": return towerFrame(ctx);
    case "ratio": return ratioFrame(ctx);
    case "rack": return rackFrame(ctx);
    case "cols": return colsFrame(ctx);
    case "product": return productFrame(ctx);
    case "tally": return tallyFrame(ctx);
    case "end": return endFrame(ctx);
    case "bill": return ctx.p.proof ? proofFrame(ctx) : {objH: 0, focus: [540, 960] as [number, number]};
    default: return flipFrame(ctx);
  }
};

// One beat, drawn at frame f (also outside its own range during a cut).
const BeatScene: React.FC<{ctx: Ctx}> = ({ctx}) => {
  const {p, f, b, L} = ctx;
  if (p.dev === "map") return <MapSheet ctx={ctx}/>;
  const bill = <><Bill ctx={ctx}/><SourceChit B={ctx.B} M={ctx.M} text={chitFor(L, b)}/></>;
  if (p.dev === "bill" && !p.proof) return bill;
  if (p.dev === "bill" && p.proof) {
    // the proof on the counter, then a tilt down (vertical whip) to the bill seen from above
    const bs = billStart(ctx);
    if (f >= bs + 6) return bill;
    if (f >= bs - 6) {
      const t = ease(f, bs - 6, bs + 6, inOut), sp = Math.sin(Math.PI * t);
      return <AbsoluteFill>
        <AbsoluteFill style={{transform: `translateY(${-1920 * t}px)`}}><MotionBlur bx={0} by={36 * sp}><EyeScene ctx={{...ctx, f: Math.min(f, bs - 1)}}/></MotionBlur></AbsoluteFill>
        <AbsoluteFill style={{transform: `translateY(${1920 * (1 - t)}px)`}}><MotionBlur bx={0} by={36 * sp}>{bill}</MotionBlur></AbsoluteFill>
      </AbsoluteFill>;
    }
  }
  return <EyeScene ctx={ctx}/>;
};

// An eye-level beat: the stage under its camera, the device, the hook text and the source chit.
const EyeScene: React.FC<{ctx: Ctx}> = ({ctx}) => {
  const {p, f, b, L} = ctx;
  const fr = frameOf(ctx);
  const hk = ctx.hook ? hookLayout(ctx, p.dev === "flip" ? "flip" : "card") : null;
  const base: Cam = hk ? hookCam(hk.bottom, fr.objH) : baseCam(p.frame.s, 540 - p.frame.dx);
  const c0 = camAt(p, f, b.f0, base, fr.focus, L.seed + b.i, b.f1);
  // the moves never push a tall object up under the tags and text at the top: the scale is capped by the room above
  const room = STAGE.base - (hk ? hk.bottom + 30 : p.hang === "hook" ? 720 : 650);
  // a row of three or four objects keeps its width so every object stays over its own shelf label
  const sMax = p.items.length >= 3 && !hk ? Math.min(1, base.s) : Math.max(base.s, room / Math.max(1, fr.objH));
  let cam: Cam = c0.s > sMax ? {...baseCam(sMax, c0.x), x: p.items.length >= 3 && !hk ? 540 + (c0.x - 540) * 0.3 : c0.x} : c0;
  // a pan or a push never carries the outer objects off the frame: keep every object's edge inside x 60-1020
  if ((p.dev === "tower" || p.dev === "cols") && p.items.length) {
    const xs = slots(p.items.length), half = p.dev === "cols" ? 110 : 150;
    const lo = Math.min(...xs) - half, hi = Math.max(...xs) + half;
    // 540 + (lo - x) * s >= 60  ->  x <= lo + 480 / s ;  540 + (hi - x) * s <= 1020  ->  x >= hi - 480 / s
    const upper = lo + 480 / cam.s, lower = hi - 480 / cam.s;
    if (lower <= upper) cam = {...cam, x: Math.max(lower, Math.min(upper, cam.x))};
  }
  let body: React.ReactNode;
  switch (p.dev) {
    case "tower": body = <Tower ctx={ctx} cam={cam}/>; break;
    case "ratio": body = <Ratio ctx={ctx} cam={cam}/>; break;
    case "rack": body = <Rack ctx={ctx} cam={cam}/>; break;
    case "cols": body = <Columns ctx={ctx} cam={cam}/>; break;
    case "product": body = <Product ctx={ctx} cam={cam}/>; break;
    case "tally": body = <Tally ctx={ctx} cam={cam}/>; break;
    case "end": body = <End ctx={ctx} cam={cam}/>; break;
    case "bill": body = <Proof ctx={ctx} cam={cam}/>; break;
    default: body = <FlipStand ctx={ctx} cam={cam} n={ctx.hook ? b.hero : b.big} top={ctx.hook ? hk!.standTop : 640} showText={!ctx.hook}/>;
  }
  return <AbsoluteFill>
    {body}
    {hk && hk.render(f)}
    {p.dev !== "end" && <SourceChit B={ctx.B} M={ctx.M} text={chitFor(L, b)}/>}
  </AbsoluteFill>;
};

// A horizontal or vertical motion blur (SVG Gaussian with separate x / y deviation).
const MotionBlur: React.FC<{bx: number; by: number; children: React.ReactNode}> = ({bx, by, children}) => {
  const id = "mb" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const on = bx > 0.5 || by > 0.5;
  return <AbsoluteFill>
    {on && <svg width={0} height={0} style={{position: "absolute"}}><filter id={id} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
      <feGaussianBlur stdDeviation={`${bx.toFixed(1)} ${by.toFixed(1)}`} edgeMode="duplicate"/></filter></svg>}
    <AbsoluteFill style={{filter: on ? `url(#${id})` : undefined}}>{children}</AbsoluteFill>
  </AbsoluteFill>;
};

const WIN: Record<Cut, [number, number]> = {none: [0, 0], whip: [5, 5], drop: [0, 0], paper: [6, 6], tilt: [6, 6], tear: [6, 6]};
const DUAL: Cut[] = ["whip", "tilt", "tear"];

// The kraft sheet of a paper-over cut.
const PaperSheet: React.FC<{M: Mat; f: number; at: number; seed: number}> = ({M, f, at, seed}) => {
  const y = f < at ? 1920 * (1 - ease(f, at - 6, at, inOut)) : -1960 * ease(f, at, at + 6, inOut);
  if (y >= 1919 || y <= -1959) return null;
  const edge = Array.from({length: 28}, (_, i) => `${(i / 27) * 100}% ${(random(`${seed}e${i}`) * 18).toFixed(1)}px`).join(", ");
  return <div style={{position: "absolute", left: -20, top: y, width: 1120, height: 1960, transform: "rotate(-1deg)", filter: `drop-shadow(0 -14px 18px ${rgba(M.shadow, 0.45)})`}}>
    <div style={{position: "absolute", inset: 0, background: `linear-gradient(180deg, ${M.kraft}, ${M.kraftDark})`, clipPath: `polygon(${edge}, 100% 100%, 0 100%)`}}/>
  </div>;
};

export const CounterStory: React.FC<LookProps> = ({L, B}) => {
  const f = useCurrentFrame();
  const M = useMemo(() => { const m = materials(B); checkObjects(m); return m; }, [B]);
  const P = useMemo(() => planStory(L, typeof L.lookOpts.surface === "string" ? L.lookOpts.surface : undefined), [L]);
  const b = beatAt(L, f);
  const ctxOf = (i: number): Ctx => ({L, B, P, M, b: L.beats[i], p: P.beats[i], f, hook: i === 0 && ["spot", "hook"].includes(L.beats[0].kind)});
  // which beats are on screen, and where (cuts)
  const layers: {i: number; dx: number; dy: number; blur: [number, number]}[] = [];
  const i = b.i, cut = P.beats[i].cut, next = L.beats[i + 1], ncut = next ? P.beats[i + 1].cut : "none";
  const dual = (c: Cut, at: number) => DUAL.includes(c) && f >= at - WIN[c][0] && f < at + WIN[c][1];
  const dirOf = (k: number) => (random(`${L.seed}dir${k}`) > 0.5 ? 1 : -1);
  const place = (from: number, to: number, c: Cut, at: number, k: number) => {
    const t = ease(f, at - WIN[c][0], at + WIN[c][1], inOut);
    const sp = Math.sin(Math.PI * t);
    const d = dirOf(k);
    if (c === "whip") {
      layers.push({i: from, dx: -d * 1080 * t, dy: 0, blur: [40 * sp, 0]});
      layers.push({i: to, dx: d * 1080 * (1 - t), dy: 0, blur: [40 * sp, 0]});
    } else {
      const up = c === "tilt" ? -1 : 1;
      layers.push({i: from, dx: 0, dy: up * 1920 * t, blur: [0, 36 * sp]});
      layers.push({i: to, dx: 0, dy: -up * 1920 * (1 - t), blur: [0, 36 * sp]});
    }
  };
  if (i > 0 && dual(cut, b.f0)) place(i - 1, i, cut, b.f0, i);
  else if (next && dual(ncut, next.f0)) place(i, i + 1, ncut, next.f0, i + 1);
  else layers.push({i, dx: 0, dy: 0, blur: [0, 0]});
  // a drop cut shakes the frame for 6 frames
  const shake = cut === "drop" && f >= b.f0 && f < b.f0 + 6 ? [(random(`${L.seed}sx${f}`) - 0.5) * 6, (random(`${L.seed}sy${f}`) - 0.5) * 6] : [0, 0];
  const onLight = P.beats[i].dev === "map";
  const mono = fitFont(B.f.mono, 0.06);
  const chip = B.chip.upper ? L.chip.toUpperCase() : L.chip;
  const chipS = fitSize(chip, mono, 470, 28, 22);
  const root = useRef<HTMLDivElement>(null);
  useSafeCheck(L.lookOpts.counterSafeCheck === true, root, B.safe, f);
  const paperCut = (cut === "paper" && f < b.f0 + 6) ? b.f0 : (ncut === "paper" && next && f >= next.f0 - 6) ? next.f0 : null;
  return <div ref={root} style={{position: "absolute", inset: 0, background: M.wallLow, overflow: "hidden"}}>
    {layers.map((ly) => <AbsoluteFill key={ly.i} style={{transform: `translate(${ly.dx + shake[0]}px, ${ly.dy + shake[1]}px)`}}>
      <MotionBlur bx={ly.blur[0]} by={ly.blur[1]}><BeatScene ctx={ctxOf(ly.i)}/></MotionBlur>
    </AbsoluteFill>)}
    {paperCut !== null && <PaperSheet M={M} f={f} at={paperCut} seed={L.seed + paperCut}/>}
    <Light M={M} amount={onLight ? 0.35 : 1}/>
    <Grain amount={0.16} hold={3} seed={L.seed % 97}/>
    {/* chrome: the chip and the brand bug, top of the safe box, on every frame */}
    <div style={{position: "absolute", left: SAFE.x0, top: SAFE.y0 + 4, padding: `5px ${B.chip.padX}px 7px`, borderRadius: B.chip.radius, background: B.c[B.chip.bg],
      ...fitCss(mono, chipS), color: assertContrast(B.c[B.chip.fg], B.c[B.chip.bg], chipS, "chip"), lineHeight: 1.15, boxShadow: `0 4px 10px ${rgba(M.shadow, 0.4)}`}}>{chip}</div>
    <BrandBug B={B} on={onLight ? "light" : "dark"} size={30} x={SAFE.x1} y={SAFE.y0 + 4 + Math.max(46, bugBox(B, 30).h)}/>
    <LookAudio L={L}/>
  </div>;
};
