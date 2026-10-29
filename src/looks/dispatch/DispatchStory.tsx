// KADAI DISPATCH: the front page and chart desk of an Indian financial daily (docs/datakadai/looks/LOOKS_SPEC.md, Kadai
// Dispatch). Newsprint is the ground of every beat; colour comes only as a BAND (the series colour) and the ink TAKEAWAY
// page. One honest comparison object per beat (plan.ts + devices.tsx), hero figures that INK on the narrator's word
// (lockF), a masthead and a source line on every frame. Every word and number is data.json's own, drawn in code; colours
// and faces are brand tokens (B.c, B.f), so the same file renders Data Kadai or Indica Atlas.
//
// Layouts rotate per story (plan.ts): a front page is a BANNER (band on top), a FOOT (band at the bottom) or PLAIN
// newsprint; a fact is a FOLD (band on top), a FOOT (band at the bottom, chart first) or a BOX (newsprint, the chart in a
// ruled box); the takeaway sets its proof below or above its headline; the letters page is a band, a FULL colour page or a
// foot band. Every page's band is one rectangle, and the ground, the masthead and the source line all read it, so type is
// always drawn in the colours of the ground actually under it, frame by frame (chrome is clipped to each band).
//
// Cuts land on the story-beat downbeats the builder set (t0/t1 never move): FOLD (the band edge tweens over 12 frames),
// COLOUR WIPE (the band colour sweeps left to right over 8 frames) and PAGE (the whole next sheet, ground and content,
// slides in from the right over 10 frames). The outgoing page's content leaves on the cut; the new page's content enters
// once its ground is in place, so two pages' type never overlap. Internal bar downbeats: an 8 px nudge of the chart object
// and a 3-frame paper flash. The last 12 frames of every beat are still.
import React, {useMemo} from "react";
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import type {ColorRole, LookBrand} from "../brands/types";
import {measure} from "../shared/fit";
import {downbeats} from "../shared/grid";
import {LookAudio} from "../shared/LookAudio";
import {MapClose} from "../shared/MapClose";
import {EditorMark, markSeed} from "../shared/Marks";
import type {LookBeat, LookData, LookNum, LookProps} from "../shared/types";
import {deviceH, DeviceView, ProofView, TeaserView, teaserH, type Ctx, type Pal} from "./devices";
import {CL, css, F, fitGated, fitHero, Gated, geo, hatch, heroW, Ink, io, Masthead, Notch, onDark, Paper, ramp, SourceLine, sourceTop, textOn, textW, wipe} from "./kit";
import {planStory, type BeatPlan, type EndLayout, type FactLayout, type HookLayout, type SayLayout, type StoryPlan} from "./plan";
import {plateUse} from "./plates";
import {useExtras} from "./quotes";
import {withDispatchData} from "./sources";

// ---------- palettes from tokens ----------
const palNews = (B: LookBrand, hot: ColorRole): Pal => ({
  text: B.c.ink, soft: B.c.softInk, hot: B.c[hot], ghost: B.c.softInk, amber: B.c.accent2, amberText: B.c.accent2Text, rule: B.c.ink, dark: false});
const palInk = (B: LookBrand): Pal => ({
  text: B.c.paper, soft: B.c.line, hot: B.c.accent2, ghost: B.c.line, amber: B.c.accent2Light, amberText: B.c.accent2Light, rule: B.c.paper, dark: true});

// colours of type set on a band
const onBand = (B: LookBrand, band: ColorRole) => {
  const main = B.c[textOn(B, band, 40)];
  const kick: ColorRole = band === "ink" ? (B.pairOk("accent2Light", "ink", 36) ? "accent2Light" : "paper") : textOn(B, band, 36);
  const heroHot = (px: number): ColorRole => B.pairOk("accent2", band, px) ? "accent2" : band === "ink" && B.pairOk("accent2Light", "ink", px) ? "accent2Light" : textOn(B, band, px);
  const emph: ColorRole = band === "ink" ? "accent2Light" : textOn(B, band, 60);
  return {main, kick: B.c[kick], heroHot, emph: B.c[emph], dark: onDark(band)};
};
// a band's colour used as type on newsprint (amber never: its darker text tone instead)
const newsText = (B: LookBrand, role: ColorRole, px = 44): ColorRole =>
  B.pairOk(role, "newsprint", px) ? role : role === "accent2" && B.pairOk("accent2Text", "newsprint", px) ? "accent2Text" : "ink";

// ---------- headline rows: a hook or say's lines with the hero token set large, reading order kept ----------
type HRow = {kind: "text"; text: string} | {kind: "hero"; before: string; after: string};
type HeadRow = {r: HRow; y: number; h: number; size: number; S: number};
type HeadLayout = {rows: HeadRow[]; S: number; H: number; bottom: number; top: number};
const isPunct = (s: string) => /^[.,;:!?)]+/.test(s);
const headLayout = (B: LookBrand, b: LookBeat, top: number, maxS: number, maxH: number, maxBottom: number, beside = 0.62): HeadLayout => {
  const W = B.safe.x1 - B.safe.x0, serif = F.serif(B), hero = b.hero;
  const nums = [...b.tokens.map((t) => t.num).filter(Boolean) as LookNum[], ...b.lineNums];
  const lines = b.lines ?? [];
  const rows0: HRow[] = [];
  const li = hero ? lines.findIndex((l) => l.includes(`*${hero.text}*`)) : -1;
  lines.forEach((l, i) => {
    if (i !== li) { rows0.push({kind: "text", text: l}); return; }
    const [before, ...rest] = l.split(`*${hero!.text}*`);
    rows0.push({kind: "hero", before: before.trim(), after: rest.join(`*${hero!.text}*`).trim()});
  });
  const hotFF = {...serif, weight: 720};
  const tw = (t: string, z: number) => textW(t, serif, z, hotFF);
  let last: HeadLayout | null = null;
  for (let k = 0; k < 14; k++) {
    const S0 = Math.round(maxS * (1 - k * 0.05)), Hmax = Math.round(maxH * (1 - k * 0.05));
    const texts = rows0.flatMap((r) => r.kind === "text" ? [r.text] : []);
    let S = S0;
    while (S > S0 * 0.62 && texts.some((t) => tw(t, S) > W)) S -= 2;
    const rows: HeadRow[] = [];
    let y = top, H = 0;
    const pushText = (text: string) => {
      const fit = fitGated(text, nums, serif, W, 3, S, S, hotFF);
      const h = fit.lines * Math.round(S * 1.1);
      rows.push({r: {kind: "text", text}, y, h, size: S, S}); y += h;
    };
    for (const r of rows0) {
      if (r.kind === "text") { pushText(r.text); continue; }
      const gapA = r.after ? (isPunct(r.after) ? S * 0.04 : S * 0.32) : 0;
      const wb = r.before ? tw(r.before, S) + S * 0.32 : 0, wa = r.after ? tw(r.after, S) + gapA : 0;
      const alone = fitHero(B, hero!, W, Hmax, 110);
      const both = fitHero(B, hero!, W - wb - wa, Hmax, 60);
      const aft = fitHero(B, hero!, W - wa, Hmax, 60);
      let before = "", after = r.after;
      if ((r.before || r.after) && both >= alone * 0.7 && heroW(B, hero!, both) + wb + wa <= W) { before = r.before; H = both; }
      else {
        if (r.before) pushText(r.before);
        if (!r.after || (aft >= alone * beside && heroW(B, hero!, aft) + wa <= W)) H = r.after ? aft : alone;
        else { H = alone; after = ""; }
      }
      const h = Math.round(H * 0.98);
      rows.push({r: {kind: "hero", before, after}, y, h, size: H, S}); y += h;
      if (r.after && !after) pushText(r.after);
    }
    last = {rows, S, H, bottom: y, top};
    if (y <= maxBottom) return last;
  }
  return last!;
};
// the same headline moved to start at `top`
const moveHead = (lay: HeadLayout, top: number): HeadLayout => {
  const d = top - lay.top;
  return {...lay, top, bottom: lay.bottom + d, rows: lay.rows.map((r) => ({...r, y: r.y + d}))};
};

const Headline: React.FC<{B: LookBrand; b: LookBeat; lay: HeadLayout; f: number; set: number; color: string; emph: string; heroColor: string; slot: string; mark?: {at: number; seed: number; color: string}}> =
  ({B, b, lay, f, set, color, emph, heroColor, slot, mark}) => {
  const W = B.safe.x1 - B.safe.x0, serif = F.serif(B);
  const nums = [...b.tokens.map((t) => t.num).filter(Boolean) as LookNum[], ...b.lineNums];
  let k = 0;
  return <>{lay.rows.map(({r, y, size, S}, i) => {
    const at = set + (k++) * 4;
    if (r.kind === "text") return <div key={i} style={{position: "absolute", left: B.safe.x0, top: y}}>
      <Gated text={r.text} nums={nums} lockF={b.lockF} f={f} ff={serif} size={size} width={W} color={color} hot={emph} hotWeight={720} lineH={1.1} set={at} balance/></div>;
    const fig = <Ink B={B} n={b.hero!} f={f} size={size} color={heroColor} slot={slot} qualColor={color}/>;
    const words = (t: string, d: number) => <div style={{marginBottom: -S * 0.2}}>
      <Gated text={t} nums={nums} lockF={b.lockF} f={f} ff={serif} size={S} width={Math.ceil(textW(t, serif, S, {...serif, weight: 720})) + 4} color={color} hot={emph} hotWeight={720} lineH={1.1} set={at + d}/></div>;
    return <div key={i} style={{position: "absolute", left: B.safe.x0, top: y, display: "flex", alignItems: "baseline", whiteSpace: "nowrap"}}>
      {r.before && <div style={{marginRight: S * 0.32}}>{words(r.before, 0)}</div>}
      {mark && f >= b.hero!.lockF ? <EditorMark kind="underline" at={mark.at} dur={12} seed={mark.seed} color={mark.color} strokeWidth={9} padding={{top: -size * 0.04}}>{fig}</EditorMark> : fig}
      {r.after && <div style={{marginLeft: isPunct(r.after) ? S * 0.04 : S * 0.32}}>{words(r.after, 2)}</div>}
    </div>;
  })}</>;
};

// ---------- footnote flag and proof slip ----------
const Flag: React.FC<{B: LookBrand; text: string; f: number; at: number; y: number; lockF: number; values: number[]; color: string; strip: string}> = ({B, text, f, at, y, lockF, values, color, strip}) => {
  const W = B.safe.x1 - B.safe.x0, ff = F.body(B, 600);
  return <div style={{position: "absolute", left: B.safe.x0, top: y, width: W, ...wipe(f, at, 8)}}>
    <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: 22, background: hatch(strip, 45, 4, 9)}}/>
    <div style={{position: "absolute", left: 0, top: 0, right: 0, bottom: 0, border: `2px solid ${color}`}}/>
    <div style={{padding: "12px 18px 12px 40px"}}>
      <Gated text={text} nums={[]} lockF={lockF} f={f} ff={ff} size={34} width={W - 60} color={color} hot={color} lineH={1.22} values={values}/></div>
  </div>;
};
const flagH = (B: LookBrand, text: string) => {
  const W = B.safe.x1 - B.safe.x0;
  const n = fitGated(text, [], F.body(B, 600), W - 60, 9, 34, 34).lines;
  return n * Math.round(34 * 1.22) + 24 + 4;
};

// A source quote set as a proof slip: a newsprint slip, a ruled hatched edge, the words exactly as the source prints them,
// credited to the document it comes from (quotes.ts quoteCredit).
const Slip: React.FC<{B: LookBrand; q: {contains: string}; src: string; f: number; at: number; y: number; lockF: number; values: number[]; maxH: number}> = ({B, q, src, f, at, y, lockF, values, maxH}) => {
  const W = B.safe.x1 - B.safe.x0, serif = F.serif(B, 500);
  const quote = `“…${q.contains}…”`;
  const fit = fitGated(quote, [], serif, W - 70, 4, 42, 32);
  const h = Math.min(maxH, fit.lines * Math.round(fit.size * 1.18) + 100);
  let cs = 30;
  while (cs > 24 && measure(src, F.body(B, 500), cs) > W - 50) cs--;
  return <div style={{position: "absolute", left: B.safe.x0, top: y, width: W, height: h, background: B.c.paper, boxShadow: `0 4px 0 ${B.c.line}`, ...wipe(f, at, 8)}}>
    <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: 16, background: hatch(B.c.accent, 45, 3, 8)}}/>
    <div style={{position: "absolute", left: 34, top: 14, ...css(F.body(B, 800, 0.12), 26), color: B.c.accent}}>FROM THE SOURCE</div>
    <div style={{position: "absolute", left: 34, top: 50}}>
      <Gated text={quote} nums={[]} lockF={lockF} f={f} ff={serif} size={fit.size} width={W - 70} color={B.c.ink} hot={B.c.ink} lineH={1.18} values={values}/></div>
    <div style={{position: "absolute", right: 16, bottom: 10, maxWidth: W - 40, overflow: "hidden", ...css(F.body(B, 500), cs), color: B.c.softInk}}>{src}</div>
  </div>;
};
const slipH = (B: LookBrand, q: {contains: string}) => {
  const W = B.safe.x1 - B.safe.x0;
  const fit = fitGated(`“…${q.contains}…”`, [], F.serif(B, 500), W - 70, 4, 42, 32);
  return Math.min(340, fit.lines * Math.round(fit.size * 1.18) + 100);
};

// ---------- geometry: every page's band and blocks, computed once and shared by ground, chrome and page ----------
type Rect = {role: ColorRole; top: number; bottom: number};
type Ground = {page: "news" | "ink"; rect: Rect | null};
const srcOf = (SP: StoryPlan, b: LookBeat) => (b.kind === "fact" ? SP.beats[b.i].src : b.src);

const lowerOf = (B: LookBrand, SP: StoryPlan, b: LookBeat) => {
  const P = SP.beats[b.i];
  const priceOld = P.device?.kind === "price" && !!P.device.old;
  if (P.quote) return {kind: "slip" as const, h: slipH(B, P.quote), text: ""};
  const sub = b.subShown;
  if (sub && !priceOld) return {kind: "flag" as const, h: flagH(B, sub), text: sub};      // a crossed-off old price already prints the sub's figure
  return null;
};

type FactGeom = {
  layout: FactLayout; band: ColorRole; heroSize: number; kickY: number; heroY: number; old: {y: number; size: number} | null;
  deckY: number; deck: {size: number; lines: number} | null; rect: Rect | null; chartTop: number; chartBottom: number;
  box: {top: number; bottom: number} | null; lower: ReturnType<typeof lowerOf>; lowerY: number; src: string; srcTop: number;
};
const factGeom = (L: LookData, SP: StoryPlan, B: LookBrand, i: number): FactGeom => {
  const b = L.beats[i], P = SP.beats[i];
  const W = B.safe.x1 - B.safe.x0, {TOP} = geo(B);
  const layout = (P.layout === "foot" || P.layout === "box" ? P.layout : "fold") as FactLayout;
  const src = srcOf(SP, b), srcTop = sourceTop(B, src);
  const lower = lowerOf(B, SP, b);
  const lowerH = lower ? lower.h : 0;
  const deck = L.textLed && b.text ? fitGated(b.text, b.textNums, F.serif(B), W, 2, 50, 40) : null;      // decks: text-led cut only
  const deckH = deck ? deck.lines * Math.round(deck.size * 1.12) + 12 : 0;
  const d = P.device;
  const oldP = d?.kind === "price" && d.old ? d.old : null;
  const need = d ? Math.max(260, Math.min(560, deviceH(d) * 0.9)) : 0;
  for (let heroMax = 300; ; heroMax -= 10) {
    const hs = b.big ? fitHero(B, b.big, W, heroMax, 120) : 0;
    const heroH = Math.round(hs * 0.98);
    const oldSize = oldP ? Math.round(Math.min(150, Math.max(110, hs * 0.55))) : 0;
    const oldH = oldP ? oldSize + 18 : 0;
    const headH = 58 + heroH + oldH + deckH;
    let kickY: number, rect: Rect | null = null, chartTop: number, chartBottom: number, lowerY: number, box: FactGeom["box"] = null;
    if (layout === "fold") {
      kickY = TOP;
      const bandBottom = TOP + headH + 34;
      rect = {role: P.band, top: 0, bottom: bandBottom};
      chartTop = bandBottom + 46;
      lowerY = srcTop - 34 - lowerH;
      chartBottom = lowerH ? lowerY - 30 : srcTop - 40;
    } else if (layout === "foot") {
      const bandTop = srcTop - 30 - headH - 44;
      rect = {role: P.band, top: bandTop, bottom: 1920};
      kickY = bandTop + 40;
      chartTop = TOP + 36;
      lowerY = bandTop - 34 - lowerH;
      chartBottom = lowerH ? lowerY - 30 : bandTop - 40;
    } else {
      kickY = TOP;
      lowerY = srcTop - 34 - lowerH;
      box = {top: TOP + headH + 20, bottom: (lowerH ? lowerY : srcTop) - 30};
      chartTop = box.top + 24;
      chartBottom = box.bottom - 20;
    }
    const heroY = kickY + 58;
    const old = oldP ? {y: heroY + heroH + 10, size: oldSize} : null;
    const deckY = heroY + heroH + oldH + 6;
    const g: FactGeom = {layout, band: P.band, heroSize: hs, kickY, heroY, old, deckY, deck, rect, chartTop, chartBottom, box, lower, lowerY, src, srcTop};
    if (!d || chartBottom - chartTop - 40 >= need || heroMax <= 180) return g;
  }
};

type FrontGeom = {layout: HookLayout; lay: HeadLayout; rect: Rect | null; objTop: number; objBottom: number};
const frontGeom = (L: LookData, SP: StoryPlan, B: LookBrand, i: number): FrontGeom => {
  const b = L.beats[i], P = SP.beats[i], {TOP} = geo(B);
  const layout = (P.layout === "foot" || P.layout === "plain" ? P.layout : "banner") as HookLayout;
  const srcTop = sourceTop(B, srcOf(SP, b));
  const lay0 = headLayout(B, b, TOP + 6, 84, 300, 900, 0.78);
  if (layout === "banner") {
    const bottom = lay0.bottom + 40;
    return {layout, lay: lay0, rect: {role: SP.lead, top: 0, bottom}, objTop: bottom + 48, objBottom: srcTop - 40};
  }
  if (layout === "plain") return {layout, lay: lay0, rect: null, objTop: lay0.bottom + 90, objBottom: srcTop - 40};
  const h = lay0.bottom - lay0.top;
  const bandTop = srcTop - 40 - h - 50;
  return {layout, lay: moveHead(lay0, bandTop + 40), rect: {role: SP.lead, top: bandTop, bottom: 1920}, objTop: TOP + 36, objBottom: bandTop - 40};
};

const lettersBlocks = (L: LookData, B: LookBrand, i: number, layout: EndLayout) => {
  const b = L.beats[i], {TOP} = geo(B);
  const W = B.safe.x1 - B.safe.x0;
  const q = b.q ?? "";
  const qf = F.serif(B, 640);
  const qFit = fitGated(q, b.qNums, qf, W, 3, 112, 72);
  const qY = layout === "band" ? 530 : TOP + 130;
  const qH = qFit.lines * Math.round(qFit.size * 1.06);
  const sub = b.sub ?? "";
  const subFit = sub ? fitGated(sub, [], F.body(B, 600), W, 2, 50, 36) : null;
  const subY = qY + qH + 34;
  const cta = sub.trim() !== "Comment below." && /comment below/i.test(b.voice?.text ?? b.vo ?? "") ? "Comment below." : "";
  const ctaY = subY + (subFit ? subFit.lines * Math.round(subFit.size * 1.15) : 0) + 30;
  const srcText = L.sourceLines.join("  ·  ");
  const sFit = fitGated(srcText, [], F.body(B, 500), W, 8, 34, 24);
  const sH = sFit.lines * Math.round(sFit.size * 1.25);
  const sY = B.safe.y1 - sH;
  const lockY = Math.max(ctaY + (cta ? 90 : 20) + (layout === "foot" ? 90 : 0), sY - 60 - 110);
  const lockFits = lockY + 100 <= sY - 30;
  return {q, qf, qFit, qY, qH, sub, subFit, subY, cta, ctaY, srcText, sFit, sH, sY, lockY, lockFits};
};
const endGeom = (L: LookData, SP: StoryPlan, B: LookBrand, i: number) => {
  const P = SP.beats[i];
  const layout = (P.layout === "full" || P.layout === "foot" ? P.layout : "band") as EndLayout;
  const k = lettersBlocks(L, B, i, layout);
  const rect: Rect = layout === "band" ? {role: SP.lead, top: 0, bottom: 470} : layout === "full" ? {role: SP.lead, top: 0, bottom: 1920}
    : {role: SP.lead, top: (k.lockFits ? k.lockY : k.sY) - 50, bottom: 1920};
  return {layout, rect, ...k};
};

const groundOf = (L: LookData, SP: StoryPlan, B: LookBrand, i: number): Ground => {
  const b = L.beats[i];
  if (b.kind === "spot" || b.kind === "hook") return {page: "news", rect: frontGeom(L, SP, B, i).rect};
  if (b.kind === "fact") return SP.beats[i].device?.kind === "ratio" ? {page: "news", rect: null} : {page: "news", rect: factGeom(L, SP, B, i).rect};
  if (b.kind === "say") return {page: "ink", rect: null};
  if (b.kind === "end") return {page: "news", rect: endGeom(L, SP, B, i).rect};
  return {page: "news", rect: null};
};

// The bands on screen at frame f, each with the horizontal share it covers (x0..x1 of the frame, for the colour wipe).
type Band = Rect & {x0: number; x1: number; seed: number};
const anchorTop = (r: Rect) => r.top <= 0;
const bandsAt = (L: LookData, SP: StoryPlan, B: LookBrand, i: number, f: number, rest = false): Band[] => {
  const b = L.beats[i], cur = groundOf(L, SP, B, i);
  const full = (r: Rect, sd: number): Band => ({...r, x0: 0, x1: 1, seed: sd});
  if (rest || i === 0) return cur.rect ? [full(cur.rect, L.seed + i + 1)] : [];
  const prev = groundOf(L, SP, B, i - 1);
  if (prev.page !== cur.page) return cur.rect ? [full(cur.rect, L.seed + i + 1)] : [];
  const t = f - b.f0;
  const grow = (r: Rect, p: number): Rect => anchorTop(r) ? {...r, bottom: r.bottom * p} : {...r, top: 1920 - (1920 - r.top) * p};
  const P = cur.rect, Q = prev.rect;
  if (!P && !Q) return [];
  if (P && !Q) return [full(grow(P, interpolate(t, [0, 12], [0, 1], {...CL, easing: io})), L.seed + i + 1)];
  if (!P && Q) { const k = interpolate(t, [0, 8], [1, 0], {...CL, easing: io}); return k > 0 ? [full(grow(Q, k), L.seed + i)] : []; }
  if (anchorTop(P!) === anchorTop(Q!) && (P!.bottom >= 1920) === (Q!.bottom >= 1920)) {
    const k = interpolate(t, [0, 12], [0, 1], {...CL, easing: io});
    const r: Rect = {role: P!.role, top: Q!.top + (P!.top - Q!.top) * k, bottom: Q!.bottom + (P!.bottom - Q!.bottom) * k};
    if (P!.role === Q!.role) return [{...r, x0: 0, x1: 1, seed: L.seed + i + 1}];
    const w = ramp(f, b.f0, 8, io);
    return [...(w < 1 ? [{...r, role: Q!.role, x0: w, x1: 1, seed: L.seed + i}] : []), {...r, x0: 0, x1: w, seed: L.seed + i + 1}];
  }
  // a band on the other edge: the old one folds away, then the new one unfolds
  const out = interpolate(t, [0, 6], [1, 0], {...CL, easing: io}), inn = interpolate(t, [3, 12], [0, 1], {...CL, easing: io});
  return [...(out > 0 ? [full(grow(Q!, out), L.seed + i)] : []), ...(inn > 0 ? [full(grow(P!, inn), L.seed + i + 1)] : [])];
};
const clipOf = (r: Band) => `inset(${Math.max(0, r.top)}px ${(1 - r.x1) * 1080}px ${Math.max(0, 1920 - r.bottom)}px ${r.x0 * 1080}px)`;
// everything outside the bands (evenodd: the frame minus each band rectangle)
const clipOutside = (bands: Band[]) => {
  const bs = bands.filter((r) => r.bottom - r.top > 0.5 && r.x1 > r.x0);
  return bs.length ? `path(evenodd, "M0 0H1080V1920H0Z ${bs.map((r) => `M${r.x0 * 1080} ${r.top}H${r.x1 * 1080}V${r.bottom}H${r.x0 * 1080}Z`).join(" ")}")` : undefined;
};

const GroundLayer: React.FC<{B: LookBrand; page: "news" | "ink"; bands: Band[]; seed: number}> = ({B, page, bands, seed}) => <>
  <Paper color={page === "ink" ? B.c.ink : B.c.newsprint} seed={seed} amount={page === "ink" ? 0.55 : 0.8}/>
  {bands.map((r, k) => r.bottom - r.top > 0.5 && r.x1 > r.x0 && <React.Fragment key={k}>
    <Paper color={B.c[r.role]} seed={r.seed} style={{clipPath: clipOf(r)}}/>
    {anchorTop(r)
      ? <div style={{position: "absolute", left: r.x0 * 1080, top: r.bottom, width: (r.x1 - r.x0) * 1080, height: 14, background: `linear-gradient(${B.c.ink}33, transparent)`}}/>
      : r.bottom >= 1920 && <div style={{position: "absolute", left: r.x0 * 1080, top: r.top - 14, width: (r.x1 - r.x0) * 1080, height: 14, background: `linear-gradient(transparent, ${B.c.ink}33)`}}/>}
  </React.Fragment>)}
</>;

// The masthead and the source line, in the colours of whatever ground is under each part of them: drawn once for the page
// and once per band, each clipped to its own ground, so no part of the brand bug or the source sits in its own colour.
const Chrome: React.FC<{B: LookBrand; L: LookData; page: "news" | "ink"; bands: Band[]; src: string | null; lockF: number; f: number}> = ({B, L, page, bands, src, lockF, f}) => {
  const set = (color: string, on: "light" | "dark", plate: string | null) => <>
    <Masthead B={B} chip={L.chip} color={color} on={on} plate={plate}/>
    {src !== null && <SourceLine B={B} text={src} color={color} lockF={lockF} f={f}/>}
  </>;
  return <>
    <AbsoluteFill style={{clipPath: clipOutside(bands)}}>{page === "ink" ? set(B.c.paper, "dark", null) : set(B.c.ink, "light", null)}</AbsoluteFill>
    {bands.filter((r) => r.bottom - r.top > 0.5 && r.x1 > r.x0).map((r, k) => {
      const ob = onBand(B, r.role);
      return <AbsoluteFill key={k} style={{clipPath: clipOf(r)}}>{set(ob.main, ob.dark ? "dark" : "light", ob.dark ? null : B.c.paper)}</AbsoluteFill>;
    })}
  </>;
};

// ---------- pages ----------
type PageProps = {L: LookData; B: LookBrand; SP: StoryPlan; i: number; f: number};

// Object first: the chart is grown before the figure lands (said-earlier figures included), never before the page is in.
// A figure said in an earlier beat (its lock is at or before this page's entrance) gets its object at once.
const enterOf = (b: LookBeat) => b.f0 + 2;
const growOf = (L: LookData, b: LookBeat) => {
  const lock = b.big?.lockF ?? b.lockF;
  if (lock <= enterOf(b) + 6) return b.f0 + 2;
  return Math.max(b.f0 + 10, Math.min(b.f0 + Math.round(L.beatF), lock - 14, b.f1 - 40));
};
// the hero inks on its word, but never before the page has entered (a said-earlier figure lands with its object)
const inkAt = (b: LookBeat) => Math.max(b.big?.lockF ?? b.lockF, enterOf(b) + 6);

const ChartArea: React.FC<PageProps & {top: number; bottom: number; hotRole: ColorRole; inset?: number}> = ({L, B, SP, i, f, top, bottom, hotRole, inset = 0}) => {
  const b = L.beats[i], P = SP.beats[i], d = P.device;
  if (!d) return null;
  const W = B.safe.x1 - B.safe.x0 - 2 * inset, X = B.safe.x0 + inset;
  const c: Ctx = {B, f, P: palNews(B, hotRole), box: {x: X, y: top + 40, w: W, h: bottom - top - 40}, grow: growOf(L, b), seed: L.seed + i * 13, f1: b.f1,
    markAt: Math.min(Math.max((b.big?.lockF ?? b.lockF) + 24, b.f0 + Math.round(L.barF) + 4), b.f1 - 12 - 16)};
  const db = downbeats(b, L).slice(1);
  const pk = db.map((d0) => f >= d0 && f < d0 + 3 ? 1 - (f - d0) / 3 : 0).reduce((a, x) => Math.max(a, x), 0);
  return <>
    {!inset && <Notch B={B} x={X} y={top} w={W} color={B.c.ink} f={f} at={b.f0 + 4}/>}
    <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${-8 * pk}px)`}}>
      <DeviceView c={c} d={d} lockF={b.big?.lockF ?? b.lockF}/>
    </div>
  </>;
};

const FactPage: React.FC<PageProps> = ({L, B, SP, i, f}) => {
  const b = L.beats[i], P = SP.beats[i];
  const g = factGeom(L, SP, B, i);
  const band = g.band;
  const W = B.safe.x1 - B.safe.x0;
  const onB = g.layout !== "box";
  const ob = onBand(B, band);
  const main = onB ? ob.main : B.c.ink, kickC = onB ? ob.kick : B.c.ink;
  const heroC = onB ? B.c[textOn(B, band, g.heroSize)] : B.c[newsText(B, band, g.heroSize)];
  const values = [b.big, ...b.barsL.map((r) => r.num)].filter(Boolean).map((n) => n!.value);
  const lowAt = Math.min(Math.max(b.lockF + 15, b.f0 + Math.round(L.barF)), b.f1 - 12 - 8);
  const kick = b.kicker ?? "";
  const kf = F.body(B, 800, 0.12);
  let ks = 36;
  while (ks > 26 && measure(kick, kf, ks) > W) ks--;
  const d = P.device;
  return <>
    {g.layout === "box" && <div style={{position: "absolute", left: B.safe.x0, top: g.kickY - 22, width: 120, height: 10, background: B.c[band], ...wipe(f, b.f0 + 2, 8)}}/>}
    <div style={{position: "absolute", left: B.safe.x0, top: g.kickY, ...wipe(f, b.f0 + 3, 8)}}>
      <Gated text={kick} nums={b.big ? [b.big] : []} lockF={b.lockF} f={f} ff={kf} size={ks} width={W} color={kickC} hot={kickC} values={values}/></div>
    {b.big && <div style={{position: "absolute", left: B.safe.x0, top: g.heroY}}>
      <Ink B={B} n={b.big} f={f} size={g.heroSize} color={heroC} slot={main} qualColor={kickC} at={inkAt(b)}/></div>}
    {d?.kind === "price" && d.old && g.old && f >= d.old.lockF && (() => {
      // the printed old price, crossed off, on its own line under the hero (spec: 150 px; its words at the 44 px label floor)
      const o = d.old;
      return <div style={{position: "absolute", left: B.safe.x0, top: g.old.y, opacity: 0.8 * ramp(f, o.lockF, 6), display: "flex", alignItems: "baseline", gap: 16}}>
        <EditorMark kind="crossed-off" at={Math.min(o.lockF + 8, b.f1 - 26)} dur={12} seed={markSeed(L.seed, 2)} color={B.c[onB ? (band === "accent2" ? "accent" : "accent2") : "accent"]} strokeWidth={8}>
          <span style={{...css(F.hero(B), g.old.size), fontWeight: 500, color: main, lineHeight: 1}}>{o.text}</span></EditorMark>
        {d.oldRest && <span style={{...css(F.body(B, 700), 44), color: main}}>{d.oldRest}</span>}
      </div>;
    })()}
    {g.deck && b.text && <div style={{position: "absolute", left: B.safe.x0, top: g.deckY}}>
      <Gated text={b.text} nums={b.textNums} lockF={b.lockF} f={f} ff={F.serif(B)} size={g.deck.size} width={W} color={main} hot={main} set={b.f0 + 6} lineH={1.12} values={values} balance/></div>}
    {g.box && <div style={{position: "absolute", left: B.safe.x0, top: g.box.top, width: W, height: g.box.bottom - g.box.top, border: `3px solid ${B.c.ink}`, boxSizing: "border-box",
      borderTop: `14px solid ${B.c[band]}`, ...wipe(f, b.f0 + 4, 10)}}/>}
    <ChartArea L={L} B={B} SP={SP} i={i} f={f} top={g.chartTop} bottom={g.chartBottom} hotRole={band} inset={g.box ? 24 : 0}/>
    {g.lower?.kind === "flag" && <Flag B={B} text={g.lower.text} f={f} at={lowAt} y={g.lowerY} lockF={b.lockF} values={values} color={B.c.ink} strip={B.c.accent2}/>}
    {g.lower?.kind === "slip" && P.quote && <Slip B={B} q={P.quote} src={P.credit || b.src} f={f} at={lowAt} y={g.lowerY} lockF={b.lockF} values={values} maxH={g.lower.h}/>}
  </>;
};

// The chart desk (a ratio fact): the page is all newsprint, every row of the comparison together.
const DeskPage: React.FC<PageProps> = ({L, B, SP, i, f}) => {
  const b = L.beats[i], P = SP.beats[i], d = P.device as Extract<NonNullable<BeatPlan["device"]>, {kind: "ratio"}>;
  const W = B.safe.x1 - B.safe.x0, {TOP} = geo(B);
  const kf = F.body(B, 800, 0.12);
  const deckOn = L.textLed && !!b.text;
  const heroSize = b.big ? fitHero(B, b.big, deckOn ? W * 0.5 : W, 300, 160) : 0;
  const deckW = W - heroW(B, b.big!, heroSize) - 30;
  const deck = deckOn ? fitGated(b.text!, b.textNums, F.serif(B), deckW, 3, 56, 40) : null;
  const heroY = TOP + 64;
  const src = srcOf(SP, b), srcTop = sourceTop(B, src);
  const values = [b.big, ...b.barsL.map((r) => r.num)].filter(Boolean).map((n) => n!.value);
  const lower = lowerOf(B, SP, b);
  const fl = lower?.kind === "flag" ? lower.h : 0;
  const lowerY = srcTop - 34 - fl;
  const top = heroY + heroSize + 40;
  const c: Ctx = {B, f, P: palNews(B, "accent"), box: {x: B.safe.x0, y: top + 30, w: W, h: (fl ? lowerY - 30 : srcTop - 40) - top - 30}, grow: growOf(L, b), seed: L.seed + i * 13, f1: b.f1};
  const br = Math.min(b.f1 - 12 - 16, Math.max(b.big!.lockF + 30, b.f0 + Math.round(L.barF)));
  return <>
    <div style={{position: "absolute", left: B.safe.x0, top: TOP, ...wipe(f, b.f0 + 3, 8)}}>
      <span style={{...css(kf, 36), color: B.c.ink}}>{b.kicker}</span></div>
    <div style={{position: "absolute", left: B.safe.x0, top: heroY, display: "flex", alignItems: "flex-end", gap: 30}}>
      <Ink B={B} n={b.big!} f={f} size={heroSize} color={B.c[newsText(B, "accent", heroSize)]} slot={B.c.ink} qualColor={B.c.ink}/>
      {deck && <div style={{marginBottom: heroSize * 0.06}}><Gated text={b.text!} nums={b.textNums} lockF={b.lockF} f={f} ff={F.serif(B)} size={deck.size} width={deckW}
        color={B.c.ink} hot={B.c.ink} set={b.f0 + 8} lineH={1.08}/></div>}
    </div>
    <Notch B={B} x={B.safe.x0} y={top} w={W} color={B.c.ink} f={f} at={b.f0 + 4}/>
    <DeviceView c={c} d={d} lockF={b.big!.lockF} bracketAt={br}/>
    {lower?.kind === "flag" && <Flag B={B} text={lower.text} f={f} at={Math.min(b.lockF + 15, b.f1 - 20)} y={lowerY} lockF={b.lockF} values={values} color={B.c.ink} strip={B.c.accent2}/>}
  </>;
};

const FrontPage: React.FC<PageProps> = ({L, B, SP, i, f}) => {
  const b = L.beats[i], P = SP.beats[i];
  const g = frontGeom(L, SP, B, i);
  const W = B.safe.x1 - B.safe.x0;
  const onB = g.layout !== "plain";
  const ob = onBand(B, SP.lead);
  const newsHot: ColorRole = SP.lead === "ink" ? "accent" : SP.lead;
  const color = onB ? ob.main : B.c.ink;
  const emph = onB ? ob.emph : B.c[newsText(B, newsHot, 60)];
  const heroC = onB ? B.c[ob.heroHot(g.lay.H)] : B.c[newsText(B, newsHot, g.lay.H)];
  const use = plateUse(L.plate);
  const markAt = b.hero ? Math.min(b.hero.lockF + 8, b.f1 - 26) : 0;
  const markC = onB ? B.c.accent2 : B.c.accent;
  const top = g.objTop, bottom = g.objBottom;
  const tH = P.teaser ? teaserH(P.teaser) : 0;
  // a short object sits in the middle of its region, not at the top of empty paper
  const tTop = P.teaser ? top + Math.max(0, Math.min(160, (bottom - top - tH - 40) / 2)) : top;
  return <>
    {g.layout === "plain" && <div style={{position: "absolute", left: B.safe.x0, top: g.lay.bottom + 30, width: W, height: 12, background: B.c[SP.lead], ...wipe(f + 8, b.f0, 8)}}/>}
    <Headline B={B} b={b} lay={g.lay} f={f} set={b.f0 - 30} color={color} emph={emph} heroColor={heroC} slot={color}
      mark={b.hero ? {at: markAt, seed: markSeed(L.seed, 1), color: markC} : undefined}/>
    {use && L.plate ? <PlateWindow B={B} src={L.plate} x={B.safe.x0} y={top} w={W} h={bottom - top - 44} f={f} f0={b.f0} f1={b.f1} focusY={use.focusY} zoom={use.zoom}/>
      : P.teaser && <>
        <Notch B={B} x={B.safe.x0} y={tTop + 10} w={W} color={B.c.ink} f={f + 8} at={0}/>
        <TeaserView c={{B, f, P: palNews(B, SP.lead), box: {x: B.safe.x0, y: tTop + 40, w: W, h: Math.max(200, Math.min(bottom - tTop - 40, Math.max(tH, 300)))}, grow: b.f0 - 12, seed: L.seed, f1: b.f1}} t={P.teaser}/>
      </>}
  </>;
};

// A framed, captioned colour illustration (a QA-approved textless plate): never behind a number, a label or the source.
const PlateWindow: React.FC<{B: LookBrand; src: string; x: number; y: number; w: number; h: number; f: number; f0: number; f1: number; focusY: number; zoom: number}> = ({B, src, x, y, w, h, f, f0, f1, focusY, zoom}) => {
  const k = interpolate(f, [f0, f1], [1.04, 1.1], CL) * zoom;
  return <>
    <div style={{position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", outline: `2px solid ${B.c.ink}`, outlineOffset: -2}}>
      <Img src={staticFile(src)} style={{position: "absolute", left: 0, top: 0, width: w, height: h, objectFit: "cover", objectPosition: `50% ${focusY * 100}%`,
        transform: `scale(${k})`, transformOrigin: `50% ${focusY * 100}%`}}/>
      <div style={{position: "absolute", inset: 0, background: `linear-gradient(180deg, ${B.c.paper}00 40%, ${B.c.accent}26 100%)`, mixBlendMode: "multiply"}}/>
      <div style={{position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 55%, transparent 55%, ${B.c.ink}55 130%)`}}/>
    </div>
    <div style={{position: "absolute", left: x, top: y + h + 8, width: w, textAlign: "right", ...css(F.body(B, 600, 0.14), 30), color: B.c.softInk}}>ILLUSTRATION</div>
  </>;
};

const TakeawayPage: React.FC<PageProps> = ({L, B, SP, i, f}) => {
  const b = L.beats[i], P = SP.beats[i];
  const W = B.safe.x1 - B.safe.x0, {TOP} = geo(B);
  const srcTop = sourceTop(B, srcOf(SP, b));
  const note = b.note ?? "";
  const noteFit = note ? fitGated(note, [], F.body(B, 500), W, 4, 34, 34) : null;
  const noteH = noteFit ? noteFit.lines * Math.round(noteFit.size * 1.25) : 0;
  const noteY = srcTop - 30 - noteH;
  const hasProof = !!P.proof;
  const need = !P.proof ? 0 : P.proof.kind === "slip" ? P.proof.quotes.reduce((a, q) => a + slipH(B, q) + 30, 0) : P.proof.kind === "band" ? P.proof.rows.length * 64 + 140
    : P.proof.kind === "bars" ? P.proof.rows.length * 150 + 60 : P.proof.kind === "equal" ? P.proof.rows.length * 170 + 40 : 300;
  const above = hasProof && (P.layout as SayLayout) === "above";
  const headTop = TOP + 70;
  let lay: HeadLayout, proofTop: number, proofBottom: number;
  if (above) {
    // proof first, under the kicker; the headline sits low, just above the note
    proofTop = headTop + 10;
    const lay0 = headLayout(B, b, proofTop + need + 60, 96, 270, noteY - 50);
    lay = moveHead(lay0, Math.max(lay0.top, noteY - 50 - (lay0.bottom - lay0.top)));
    proofBottom = lay.top - 60;
  } else {
    lay = headLayout(B, b, headTop, 96, 270, hasProof ? Math.min(1000, noteY - 60 - need) : noteY - 200);
    proofTop = lay.bottom + 50; proofBottom = noteY - 40;
  }
  const kf = F.body(B, 800, 0.14);
  const amber = B.pairOk("accent2", "ink", 34) ? B.c.accent2 : B.c.accent2Light;
  const set = b.f0 + 4;
  const values = SP.items.map((it) => it.v);
  const proofAt = Math.min(b.f0 + Math.round(L.beatF * 2), b.f1 - 40);
  return <>
    <div style={{position: "absolute", left: B.safe.x0, top: TOP + 14, display: "flex", alignItems: "center", gap: 16, ...wipe(f, b.f0 + 2, 8)}}>
      <B.Mark size={40} on="dark"/><span style={{...css(kf, 34), color: amber}}>THE TAKEAWAY</span></div>
    <Headline B={B} b={b} lay={lay} f={f} set={set} color={B.c.paper} emph={B.c.accent2Light} heroColor={amber} slot={B.c.paper}
      mark={b.hero ? {at: Math.min(b.hero.lockF + 40, b.f1 - 30), seed: markSeed(L.seed, 3), color: B.c.accent2} : undefined}/>
    {P.proof && P.proof.kind !== "slip" && <ProofView c={{B, f, P: palInk(B), box: {x: B.safe.x0, y: proofTop, w: W, h: proofBottom - proofTop}, grow: proofAt, seed: L.seed, f1: b.f1}} p={P.proof}/>}
    {P.proof && P.proof.kind === "slip" && (() => {
      const qs = P.proof.quotes, hs = qs.map((q) => slipH(B, q));
      const tot = hs.reduce((a, h) => a + h, 0) + (qs.length - 1) * 30;
      let y = proofTop + Math.max(0, (proofBottom - proofTop - tot) / 2);
      return qs.map((q, k) => { const el = <Slip key={k} B={B} q={q} src={P.credits[k] || b.src} f={f} at={proofAt + k * 10} y={y} lockF={b.lockF} values={values} maxH={hs[k]}/>; y += hs[k] + 30; return el; });
    })()}
    {!hasProof && note && (() => {
      const pf = F.serif(B, 500), pull = fitGated(note, [], pf, W - 40, 5, 58, 40);
      const ph = pull.lines * Math.round(pull.size * 1.18);
      const py = Math.max(lay.bottom + 90, (lay.bottom + srcTop - ph) / 2 - 20);
      const at = Math.min(b.f0 + Math.round(L.barF), b.f1 - 24);
      return <>
        <div style={{position: "absolute", left: B.safe.x0, top: py - 34, width: 140, height: 6, background: amber, ...wipe(f, at, 8)}}/>
        <div style={{position: "absolute", left: B.safe.x0, top: py, opacity: ramp(f, at + 4, 10)}}>
          <Gated text={note} nums={[]} lockF={b.lockF} f={f} ff={pf} size={pull.size} width={W - 40} color={B.c.paper} hot={B.c.paper} lineH={1.18} values={values}/></div>
      </>;
    })()}
    {hasProof && noteFit && <div style={{position: "absolute", left: B.safe.x0, top: noteY, opacity: 0.88 * ramp(f, Math.min(b.f0 + Math.round(L.barF), b.f1 - 20), 8)}}>
      <Gated text={note} nums={[]} lockF={b.lockF} f={f} ff={F.body(B, 500)} size={noteFit.size} width={W} color={B.c.paper} hot={B.c.paper} lineH={1.25} values={values}/></div>}
  </>;
};

const LettersPage: React.FC<PageProps> = ({L, B, SP, i, f}) => {
  const b = L.beats[i];
  const W = B.safe.x1 - B.safe.x0, {TOP, RULE_Y} = geo(B);
  const g = endGeom(L, SP, B, i);
  const hook = L.beats.find((x) => x.kind === "spot" || x.kind === "hook");
  const ob = onBand(B, SP.lead);
  const full = g.layout === "full", foot = g.layout === "foot";
  // type over the band takes the band's colours; type on newsprint is ink
  const topOnBand = full || g.layout === "band";
  const qC = full ? ob.main : B.c.ink, qHot = full ? ob.emph : B.c[newsText(B, "accent", 72)];
  const subC = full ? ob.main : B.c.softInk;
  const ctaC = full ? ob.kick : B.c[newsText(B, "accent", 52)];
  const bottomOn = full || foot;
  const srcC = bottomOn ? ob.main : B.c.ink;
  const values = [...b.qNums.map((n) => n.value), ...SP.items.map((it) => it.v)];
  const ghostN = hook?.hero;
  const ghostText = ghostN ? ghostN.sign + ghostN.prefix + ghostN.digits + (/^[%×]$/.test(ghostN.unit.trim()) ? ghostN.unit.trim() : "") : "";
  // the hook's figure ghosted for the loop: inside the safe box, in an empty part of the page
  const ghostBox = g.layout === "band" ? {top: RULE_Y + 30, bottom: 470 - 14} : {top: g.ctaY + (g.cta ? 80 : 10), bottom: (g.lockFits ? g.lockY : g.sY) - (foot ? 80 : 30)};
  const ghostColor = topOnBand ? ob.main : B.c.ink;
  return <>
    {ghostN && f >= ghostN.lockF && ghostBox.bottom - ghostBox.top >= 120 && (() => {
      let gz = 400;
      while (gz > 100 && (measure(ghostText, F.hero(B), gz) > W || gz * 0.8 > ghostBox.bottom - ghostBox.top)) gz -= 10;
      return <div style={{position: "absolute", right: 1080 - B.safe.x1, top: ghostBox.bottom - gz * 0.86, opacity: 0.08}}>
        <div style={{...css(F.hero(B), gz), lineHeight: 1, color: ghostColor}}>{ghostText}</div></div>;
    })()}
    <div style={{position: "absolute", left: B.safe.x0, top: TOP + 30, display: "flex", alignItems: "center", gap: 14, ...wipe(f, b.f0 + 2, 8)}}>
      <span style={{...css(F.body(B, 800, 0.14), 34), color: topOnBand ? ob.kick : B.c.ink}}>LETTERS</span></div>
    <div style={{position: "absolute", left: B.safe.x0, top: TOP + 84, width: 120, height: 6, background: topOnBand ? ob.kick : B.c[SP.lead], ...wipe(f, b.f0 + 6, 8)}}/>
    <div style={{position: "absolute", left: B.safe.x0, top: g.qY}}>
      <Gated text={g.q} nums={b.qNums} lockF={b.lockF} f={f} ff={g.qf} size={g.qFit.size} width={W} color={qC} hot={qHot} lineH={1.06} set={b.f0 + 4} stagger={2} balance/></div>
    {g.subFit && <div style={{position: "absolute", left: B.safe.x0, top: g.subY, opacity: ramp(f, b.f0 + 14, 8)}}>
      <Gated text={g.sub} nums={[]} lockF={b.lockF} f={f} ff={F.body(B, 600)} size={g.subFit.size} width={W} color={subC} hot={subC} lineH={1.15} values={values}/></div>}
    {g.cta && <div style={{position: "absolute", left: B.safe.x0, top: g.ctaY, ...css(F.body(B, 700), 52), color: ctaC, ...wipe(f, b.f0 + 20, 8)}}>{g.cta}</div>}
    {g.lockFits && <div style={{position: "absolute", left: B.safe.x0, top: g.lockY, display: "flex", alignItems: "center", gap: 22, opacity: ramp(f, b.f0 + 28, 10)}}>
      <B.Mark size={96} on={bottomOn && ob.dark ? "dark" : "light"}/><B.Wordmark size={B.wordmark.stacked ? 56 : 64} on={bottomOn && ob.dark ? "dark" : "light"}/></div>}
    <div style={{position: "absolute", left: B.safe.x0, top: g.sY - 22, width: W, height: 1.5, background: srcC, opacity: 0.5}}/>
    <div style={{position: "absolute", left: B.safe.x0, top: g.sY, opacity: ramp(f, b.f0 + 24, 10)}}>
      <Gated text={g.srcText} nums={[]} lockF={b.lockF} f={f} ff={F.body(B, 500)} size={g.sFit.size} width={W} color={srcC} hot={srcC} lineH={1.25} values={values}/></div>
  </>;
};

// ---------- the story ----------
const Page: React.FC<PageProps> = (p) => {
  const b = p.L.beats[p.i];
  if (b.kind === "spot" || b.kind === "hook") return <FrontPage {...p}/>;
  if (b.kind === "fact") return p.SP.beats[p.i].device?.kind === "ratio" ? <DeskPage {...p}/> : <FactPage {...p}/>;
  if (b.kind === "say") return <TakeawayPage {...p}/>;
  if (b.kind === "end") return <LettersPage {...p}/>;
  return null;
};
const isMap = (b: LookBeat) => b.kind === "map" || b.kind === "mapend";
// the per-frame source line: none on the letters page or the map end, which print the full sources themselves
const lineSrc = (SP: StoryPlan, b: LookBeat) => (b.kind === "end" || b.kind === "mapend" ? null : srcOf(SP, b));

// One whole page of a beat at rest (its ground, its content, its chrome): what a PAGE cut slides in over the page before it,
// so content always travels with its own paper.
const Sheet: React.FC<PageProps> = ({L, B, SP, i, f}) => {
  const b = L.beats[i];
  const g = groundOf(L, SP, B, i), bands = bandsAt(L, SP, B, i, f, true), seed = L.seed + i;
  const {TOP} = geo(B);
  return <AbsoluteFill style={{overflow: "hidden"}}>
    {isMap(b)
      ? <>
          <MapClose L={L} B={B} b={b} ground="newsprint" headFont="serif" top={TOP + 6} reserveBottom={b.kind === "map" ? B.safe.y1 - sourceTop(B, b.src) + 40 : 8}/>
          <Img src={staticFile(`looks/dispatch/paper-${seed % 4}.jpg`)} style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, mixBlendMode: "soft-light", opacity: 0.6, pointerEvents: "none"}}/>
        </>
      : <>
          <GroundLayer B={B} page={g.page} bands={bands} seed={seed}/>
          <Page L={L} B={B} SP={SP} i={i} f={f}/>
        </>}
    <Chrome B={B} L={L} page={isMap(b) ? "news" : g.page} bands={isMap(b) ? [] : bands} src={lineSrc(SP, b)} lockF={b.lockF} f={f}/>
  </AbsoluteFill>;
};

export const DispatchStory: React.FC<LookProps> = ({L: L0, B}) => {
  const f = useCurrentFrame();
  const extras = useExtras(L0.id);      // config quotes and printed qualifiers (quotes.ts); the frame is held until they are read
  const L = useMemo(() => withDispatchData(L0, extras?.printed ?? {}), [L0, extras]);
  const SP = useMemo(() => planStory(L, extras?.quotes ?? []), [L, extras]);
  const i = L.beats.findIndex((x) => f >= x.f0 && f < x.f1);
  const bi = i < 0 ? L.beats.length - 1 : i;
  const b = L.beats[bi];
  const map = isMap(b);
  const prevMap = bi > 0 && isMap(L.beats[bi - 1]);
  const db = downbeats(b, L).slice(1);
  const flash = db.reduce((a, d0) => Math.max(a, f >= d0 && f < d0 + 3 ? 0.11 * (1 - (f - d0) / 3) : 0), 0);
  const cur = groundOf(L, SP, B, bi), prev = bi > 0 ? groundOf(L, SP, B, bi - 1) : cur;
  // PAGE cut: the new page (ground, content, chrome) slides in from the right over the old one, which stays still under it
  const pageCut = bi > 0 && (cur.page !== prev.page || map !== prevMap);
  if (pageCut && f < b.f0 + 10) {
    const p = ramp(f, b.f0, 10, io);
    return <AbsoluteFill style={{background: B.c.newsprint, overflow: "hidden"}}>
      <Sheet L={L} B={B} SP={SP} i={bi - 1} f={f}/>
      <AbsoluteFill style={{transform: `translateX(${(1 - p) * 1080}px)`, boxShadow: `-18px 0 30px ${B.c.ink}55`}}><Sheet L={L} B={B} SP={SP} i={bi} f={f}/></AbsoluteFill>
      <LookAudio L={L}/>
    </AbsoluteFill>;
  }
  if (map) return <AbsoluteFill style={{background: B.c.newsprint, overflow: "hidden"}}>
    <Sheet L={L} B={B} SP={SP} i={bi} f={f}/>
    {flash > 0 && <AbsoluteFill style={{background: B.c.paper, opacity: flash, pointerEvents: "none"}}/>}
    <LookAudio L={L}/>
  </AbsoluteFill>;
  // FOLD / COLOUR WIPE: the old page's content leaves on the cut; the new content enters once its band is in place
  const bands = bandsAt(L, SP, B, bi, f);
  const moved = !pageCut && bi > 0 && JSON.stringify(cur.rect && [cur.rect.top, cur.rect.bottom]) !== JSON.stringify(prev.rect && [prev.rect.top, prev.rect.bottom]);
  const recoloured = !pageCut && bi > 0 && !!cur.rect && !!prev.rect && cur.rect.role !== prev.rect.role;
  // the band unfolds (from nothing, or from the other edge) by frame 12 and re-folds along its own edge by 12 (mostly by 6);
  // a recolour reaches the left half, where type starts, by 4: the new content waits for its own ground
  const same = !!cur.rect && !!prev.rect && anchorTop(cur.rect) === anchorTop(prev.rect) && (cur.rect.bottom >= 1920) === (prev.rect.bottom >= 1920);
  const delay = !moved ? (recoloured ? 4 : 1) : same ? 6 : cur.rect ? 11 : 8;
  const enter = bi === 0 || pageCut ? 1 : ramp(f, b.f0 + delay, 4);
  return <AbsoluteFill style={{background: B.c.newsprint, overflow: "hidden"}}>
    <GroundLayer B={B} page={cur.page} bands={bands} seed={L.seed + bi}/>
    <AbsoluteFill style={{opacity: enter}}><Page L={L} B={B} SP={SP} i={bi} f={f}/></AbsoluteFill>
    <Chrome B={B} L={L} page={cur.page} bands={bands} src={lineSrc(SP, b)} lockF={b.lockF} f={f}/>
    {flash > 0 && <AbsoluteFill style={{background: B.c.paper, opacity: flash, pointerEvents: "none"}}/>}
    <LookAudio L={L}/>
  </AbsoluteFill>;
};
