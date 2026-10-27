// KADAI DISPATCH: the front page and chart desk of an Indian financial daily (docs/datakadai/looks/LOOKS_SPEC.md, Kadai
// Dispatch). Newsprint is the ground of every beat; colour comes only as a top FOLD band (the series colour) and the ink
// TAKEAWAY page. One honest comparison object per beat (plan.ts + devices.tsx), hero figures that INK on the narrator's
// word (lockF), a masthead and a source line on every frame. Every word and number is data.json's own, drawn in code;
// colours and faces are brand tokens (B.c, B.f), so the same file renders Data Kadai or Indica Atlas.
//
// Cuts land on the story-beat downbeats the builder set (t0/t1 never move): FOLD (the band edge tweens over 15 frames),
// COLOUR WIPE (the band colour sweeps left to right over 8 frames) and PAGE (the ink page slides in from the right over
// 10 frames). Internal bar downbeats: a 3-frame punch on the chart object and a 3-frame paper flash. The last 12 frames of
// every beat are still.
import React, {useMemo} from "react";
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import type {ColorRole, LookBrand} from "../brands/types";
import {measure} from "../shared/fit";
import {downbeats} from "../shared/grid";
import {LookAudio} from "../shared/LookAudio";
import {MapClose} from "../shared/MapClose";
import {EditorMark, markSeed} from "../shared/Marks";
import {plain} from "../shared/text";
import type {LookBeat, LookData, LookNum, LookProps} from "../shared/types";
import {DeviceView, ProofView, TeaserView, type Ctx, type Pal} from "./devices";
import {CL, css, F, fitGated, fitHero, Gated, hatch, heroW, Ink, io, Masthead, Notch, onDark, Paper, ramp, RULE_Y, SourceLine, sourceTop, textOn, textW, wipe} from "./kit";
import {planStory, type BeatPlan, type StoryPlan} from "./plan";
import {plateUse} from "./plates";
import {useQuotes} from "./quotes";

type Ground = {page: "news" | "ink"; band: ColorRole | null; h: number};
const TOP = 304;      // first content line under the masthead rules

// ---------- palettes from tokens ----------
const palNews = (B: LookBrand, hot: ColorRole): Pal => ({
  text: B.c.ink, soft: B.c.softInk, hot: B.c[hot], hotLabel: B.c[textOn(B, hot, 44)], cold: hot === "ink" ? B.c.accent : B.c.ink,
  coldLabel: B.c[textOn(B, hot === "ink" ? "accent" : "ink", 44)], ghost: B.c.softInk, amber: B.c.accent2, amberText: B.c.accent2Text, rule: B.c.ink, dark: false});
const palInk = (B: LookBrand): Pal => ({
  text: B.c.paper, soft: B.c.line, hot: B.c.accent2, hotLabel: B.c[textOn(B, "accent2", 44, ["ink", "paper"])], cold: B.c.paper, coldLabel: B.c.ink,
  ghost: B.c.line, amber: B.c.accent2Light, amberText: B.c.accent2Light, rule: B.c.paper, dark: true});

// colours of type set on a band
const onBand = (B: LookBrand, band: ColorRole) => {
  const main = B.c[textOn(B, band, 40)];
  const kick: ColorRole = band === "ink" ? (B.pairOk("accent2Light", "ink", 36) ? "accent2Light" : "paper") : textOn(B, band, 36);
  const heroHot = (px: number): ColorRole => B.pairOk("accent2", band, px) ? "accent2" : band === "ink" && B.pairOk("accent2Light", "ink", px) ? "accent2Light" : textOn(B, band, px);
  const emph: ColorRole = band === "ink" ? "accent2Light" : textOn(B, band, 60);
  return {main, kick: B.c[kick], heroHot, emph: B.c[emph], dark: onDark(band)};
};

// ---------- headline rows: a hook or say's lines with the hero token set large, reading order kept ----------
// Text rows share one size (the largest at which each fits one line, down to 70% of the cap; a row that still does not fit
// wraps). The hero's line keeps its words beside the figure when the figure stays at least ~3/4 of its largest size.
type HRow = {kind: "text"; text: string} | {kind: "hero"; before: string; after: string};
type HeadRow = {r: HRow; y: number; h: number; size: number; S: number};
type HeadLayout = {rows: HeadRow[]; S: number; H: number; bottom: number};
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
    last = {rows, S, H, bottom: y};
    if (y <= maxBottom) return last;
  }
  return last!;
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
    return <div key={i} style={{position: "absolute", left: B.safe.x0 - (r.before ? 0 : size * 0.03), top: y, display: "flex", alignItems: "baseline", whiteSpace: "nowrap"}}>
      {r.before && <div style={{marginRight: S * 0.32}}>{words(r.before, 0)}</div>}
      {mark && f >= b.hero!.lockF ? <EditorMark kind="underline" at={mark.at} dur={12} seed={mark.seed} color={mark.color} strokeWidth={9} padding={{top: -size * 0.04}}>{fig}</EditorMark> : fig}
      {r.after && <div style={{marginLeft: isPunct(r.after) ? S * 0.04 : S * 0.32}}>{words(r.after, 2)}</div>}
    </div>;
  })}</>;
};

// ---------- the chart area of a fact page ----------
const flagFor = (L: LookData, b: LookBeat, P: BeatPlan) => {
  if (P.quote) return null;
  const sub = b.subShown;
  return sub ? sub : null;
};

const Flag: React.FC<{B: LookBrand; text: string; f: number; at: number; y: number; lockF: number; values: number[]; color: string; strip: string}> = ({B, text, f, at, y, lockF, values, color, strip}) => {
  const W = B.safe.x1 - B.safe.x0, ff = F.body(B, 600);
  return <div style={{position: "absolute", left: B.safe.x0, top: y, width: W, ...wipe(f, at, 8)}}>
    <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: 22, background: hatch(strip, 45, 4, 9)}}/>
    <div style={{position: "absolute", left: 0, top: 0, right: 0, bottom: 0, border: `2px solid ${color}`}}/>
    <div style={{padding: "12px 18px 12px 40px"}}>
      <Gated text={text} nums={[]} lockF={lockF} f={f} ff={ff} size={32} width={W - 60} color={color} hot={color} lineH={1.22} values={values}/></div>
  </div>;
};
const flagH = (B: LookBrand, text: string) => {
  const W = B.safe.x1 - B.safe.x0;
  const n = fitGated(text, [], F.body(B, 600), W - 60, 9, 32, 32).lines;
  return n * Math.round(32 * 1.22) + 24 + 4;
};

// A source quote set as a proof slip: a newsprint slip, a ruled hatched edge, the words exactly as the source prints them.
const Slip: React.FC<{B: LookBrand; q: {contains: string}; src: string; f: number; at: number; y: number; lockF: number; values: number[]; maxH: number}> = ({B, q, src, f, at, y, lockF, values, maxH}) => {
  const W = B.safe.x1 - B.safe.x0, serif = F.serif(B, 500);
  const quote = `“…${q.contains}…”`;
  const fit = fitGated(quote, [], serif, W - 70, 4, 42, 32);
  const h = Math.min(maxH, fit.lines * Math.round(fit.size * 1.18) + 90);
  return <div style={{position: "absolute", left: B.safe.x0, top: y, width: W, height: h, background: B.c.paper, boxShadow: `0 4px 0 ${B.c.line}`, ...wipe(f, at, 8),
    transform: `rotate(${-0.6}deg)`}}>
    <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: 16, background: hatch(B.c.accent, 45, 3, 8)}}/>
    <div style={{position: "absolute", left: 34, top: 14, ...css(F.body(B, 800, 0.12), 26), color: B.c.accent}}>FROM THE SOURCE</div>
    <div style={{position: "absolute", left: 34, top: 50}}>
      <Gated text={quote} nums={[]} lockF={lockF} f={f} ff={serif} size={fit.size} width={W - 70} color={B.c.ink} hot={B.c.ink} lineH={1.18} values={values}/></div>
    <div style={{position: "absolute", right: 16, bottom: 10, ...css(F.body(B, 500), 26), color: B.c.softInk}}>{src}</div>
  </div>;
};
const slipH = (B: LookBrand, q: {contains: string}) => {
  const W = B.safe.x1 - B.safe.x0;
  const fit = fitGated(`“…${q.contains}…”`, [], F.serif(B, 500), W - 70, 4, 42, 32);
  return fit.lines * Math.round(fit.size * 1.18) + 90;
};

// ---------- grounds ----------
const groundOf = (L: LookData, SP: StoryPlan, B: LookBrand, i: number): Ground => {
  const b = L.beats[i];
  if (b.kind === "spot" || b.kind === "hook") return {page: "news", band: SP.lead, h: frontBand(L, B, i)};
  if (b.kind === "fact") return SP.beats[i].device?.kind === "ratio" ? {page: "news", band: null, h: 0} : {page: "news", band: SP.beats[i].band, h: factBand(B, b)};
  if (b.kind === "say") return {page: "ink", band: null, h: 0};
  if (b.kind === "end") return {page: "news", band: SP.lead, h: 470};
  return {page: "news", band: null, h: 0};
};

const factHead = (B: LookBrand, b: LookBeat) => {
  const W = B.safe.x1 - B.safe.x0;
  const heroSize = b.big ? fitHero(B, b.big, W, 232, 120) : 0;
  const heroY = TOP + 52;
  const deckY = heroY + Math.round(heroSize * 0.98) + 10;
  const deck = b.text ? fitGated(b.text, b.textNums, F.serif(B), W, 2, 50, 40) : null;
  const bottom = deckY + (deck ? deck.lines * Math.round(deck.size * 1.12) : 0) + 34;
  return {heroSize, heroY, deckY, deck, bottom};
};
const factBand = (B: LookBrand, b: LookBeat) => factHead(B, b).bottom;

const frontLay = (L: LookData, B: LookBrand, i: number) => headLayout(B, L.beats[i], TOP + 6, 84, 300, 900, 0.78);
const frontBand = (L: LookData, B: LookBrand, i: number) => frontLay(L, B, i).bottom + 40;

const GroundView: React.FC<{B: LookBrand; L: LookData; SP: StoryPlan; i: number; f: number}> = ({B, L, SP, i, f}) => {
  const b = L.beats[i];
  const cur = groundOf(L, SP, B, i);
  const prev = i > 0 ? groundOf(L, SP, B, i - 1) : cur;
  const seed = L.seed + i;
  const band = (g: Ground, h: number, sd: number, clip?: number) => g.band && h > 0
    ? <Paper color={B.c[g.band]} seed={sd + 1} style={{height: h, ...(clip !== undefined ? {clipPath: `inset(0 ${(1 - clip) * 100}% 0 0)`} : {})}}/> : null;
  const page = (g: Ground, sd: number, h: number) => <>
    <Paper color={g.page === "ink" ? B.c.ink : B.c.newsprint} seed={sd} amount={g.page === "ink" ? 0.55 : 0.8}/>
    {band(g, h, sd)}
    {g.band && h > 0 && <div style={{position: "absolute", left: 0, top: h, width: 1080, height: 14, background: `linear-gradient(${B.c.ink}33, transparent)`}}/>}
  </>;
  const t = f - b.f0;
  if (cur.page !== prev.page) return page(cur, seed, cur.h);      // a PAGE cut is drawn by Sheet; after it the page is at rest
  const h = interpolate(t, [0, 15], [prev.h, cur.h], {...CL, easing: io});
  const colourChange = prev.band && cur.band && prev.band !== cur.band;
  const wipeP = ramp(f, b.f0, 8, io);
  return <>
    <Paper color={cur.page === "ink" ? B.c.ink : B.c.newsprint} seed={seed} amount={cur.page === "ink" ? 0.55 : 0.8}/>
    {colourChange ? <>{band(prev, h, seed - 1)}{band(cur, h, seed, wipeP)}</> : band(cur.band ? cur : prev, h, seed)}
    {(cur.band || prev.band) && h > 0 && <div style={{position: "absolute", left: 0, top: h, width: 1080, height: 14, background: `linear-gradient(${B.c.ink}33, transparent)`}}/>}
  </>;
};

// ---------- pages ----------
type PageProps = {L: LookData; B: LookBrand; SP: StoryPlan; i: number; f: number};

const ChartArea: React.FC<PageProps & {top: number; bottom: number; hotRole: ColorRole}> = ({L, B, SP, i, f, top, bottom, hotRole}) => {
  const b = L.beats[i], P = SP.beats[i], d = P.device;
  if (!d) return null;
  const W = B.safe.x1 - B.safe.x0;
  const grow = Math.min(b.f0 + Math.round(L.beatF), b.f1 - 40);
  const c: Ctx = {B, f, P: palNews(B, hotRole), box: {x: B.safe.x0, y: top + 40, w: W, h: bottom - top - 40}, grow, seed: L.seed + i * 13, f1: b.f1,
    markAt: Math.min(Math.max((b.big?.lockF ?? b.lockF) + 24, b.f0 + Math.round(L.barF) + 4), b.f1 - 12 - 16)};
  const db = downbeats(b, L).slice(1);
  const pk = db.map((d0) => f >= d0 && f < d0 + 3 ? 1 - (f - d0) / 3 : 0).reduce((a, x) => Math.max(a, x), 0);
  return <>
    <Notch B={B} x={B.safe.x0} y={top} w={W} color={B.c.ink} f={f} at={b.f0 + 4}/>
    <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${-8 * pk}px)`}}>
      <DeviceView c={c} d={d} lockF={b.big?.lockF ?? b.lockF}/>
    </div>
  </>;
};

const FactPage: React.FC<PageProps> = ({L, B, SP, i, f}) => {
  const b = L.beats[i], P = SP.beats[i];
  const band = P.band;
  const W = B.safe.x1 - B.safe.x0;
  const hd = factHead(B, b);
  const ob = onBand(B, band);
  const src = sourceTop(B, b.src);
  const flag = flagFor(L, b, P);
  const values = [b.big, ...b.barsL.map((r) => r.num)].filter(Boolean).map((n) => n!.value);
  const fl = flag ? flagH(B, flag) : 0;
  const sl = P.quote ? Math.min(330, slipH(B, P.quote)) : 0;
  const lowerH = P.quote ? sl : fl;
  const lowerY = src - 34 - lowerH;
  const lowAt = Math.min(Math.max(b.lockF + 15, b.f0 + Math.round(L.barF)), b.f1 - 12 - 8);
  const chartTop = hd.bottom + 46;
  const chartBottom = lowerH ? lowerY - 30 : src - 40;
  const kick = b.kicker ?? "";
  const kf = F.body(B, 800, 0.12);
  let ks = 36;
  while (ks > 26 && measure(kick, kf, ks) > W) ks--;
  return <>
    <div style={{position: "absolute", left: B.safe.x0, top: TOP, ...wipe(f, b.f0 + 3, 8)}}>
      <Gated text={kick} nums={b.big ? [b.big] : []} lockF={b.lockF} f={f} ff={kf} size={ks} width={W} color={ob.kick} hot={ob.kick} values={values}/></div>
    {b.big && <div style={{position: "absolute", left: B.safe.x0 - hd.heroSize * 0.03, top: hd.heroY}}>
      <Ink B={B} n={b.big} f={f} size={hd.heroSize} color={B.c[textOn(B, band, hd.heroSize)]} slot={ob.main} qualColor={ob.kick}/></div>}
    {P.device?.kind === "price" && P.device.old && b.big && f >= P.device.old.lockF && (() => {
      const o = P.device.old, x = B.safe.x0 + heroW(B, b.big, hd.heroSize) + 40, room = B.safe.x1 - x;
      let os = Math.round(hd.heroSize * 0.42);
      const ow = (z: number) => measure(o.text, F.hero(B), z) + (P.device.oldRest ? measure(P.device.oldRest, F.body(B, 700), Math.round(z * 0.36)) + 8 : 0) + 6;
      while (os > 40 && ow(os) > room) os -= 2;
      return <div style={{position: "absolute", left: x, top: hd.heroY + hd.heroSize * 0.3, opacity: 0.78 * ramp(f, o.lockF, 6), display: "flex", alignItems: "baseline", gap: 10}}>
        <EditorMark kind="crossed-off" at={Math.min(o.lockF + 8, b.f1 - 26)} dur={12} seed={markSeed(L.seed, 2)} color={B.c[band === "accent2" ? "accent" : "accent2"]} strokeWidth={7}>
          <span style={{...css(F.hero(B), os), fontWeight: 500, color: ob.main}}>{o.text}{P.device.oldRest && <span style={{...css(F.body(B, 700), Math.round(os * 0.36)), marginLeft: 8}}>{P.device.oldRest}</span>}</span>
        </EditorMark></div>;
    })()}
    {b.text && hd.deck && <div style={{position: "absolute", left: B.safe.x0, top: hd.deckY}}>
      <Gated text={b.text} nums={b.textNums} lockF={b.lockF} f={f} ff={F.serif(B)} size={hd.deck.size} width={W} color={ob.main} hot={ob.main} set={b.f0 + 6} lineH={1.12} values={values} balance/></div>}
    <ChartArea L={L} B={B} SP={SP} i={i} f={f} top={chartTop} bottom={chartBottom} hotRole={band === "accent2" ? "accent2" : band}/>
    {flag && <Flag B={B} text={flag} f={f} at={lowAt} y={lowerY} lockF={b.lockF} values={values} color={B.c.ink} strip={B.c.accent2}/>}
    {P.quote && <Slip B={B} q={P.quote} src={b.src} f={f} at={lowAt} y={lowerY} lockF={b.lockF} values={values} maxH={330}/>}
  </>;
};

// The chart desk (a ratio fact): the fold retracts, the page is all newsprint, every row of the comparison together.
const DeskPage: React.FC<PageProps> = ({L, B, SP, i, f}) => {
  const b = L.beats[i], P = SP.beats[i], d = P.device as Extract<NonNullable<BeatPlan["device"]>, {kind: "ratio"}>;
  const W = B.safe.x1 - B.safe.x0;
  const kf = F.body(B, 800, 0.12);
  const heroSize = b.big ? fitHero(B, b.big, W * 0.5, 300, 160) : 0;
  const deckW = W - heroW(B, b.big!, heroSize) - 30;
  const deck = b.text ? fitGated(b.text, b.textNums, F.serif(B), deckW, 3, 56, 40) : null;
  const heroY = TOP + 64;
  const src = sourceTop(B, b.src);
  const values = [b.big, ...b.barsL.map((r) => r.num)].filter(Boolean).map((n) => n!.value);
  const flag = flagFor(L, b, P);
  const fl = flag ? flagH(B, flag) : 0;
  const lowerY = src - 34 - fl;
  const top = heroY + heroSize + 40;
  const grow = Math.min(b.f0 + Math.round(L.beatF), b.f1 - 40);
  const c: Ctx = {B, f, P: palNews(B, "accent"), box: {x: B.safe.x0, y: top + 30, w: W, h: (fl ? lowerY - 30 : src - 40) - top - 30}, grow, seed: L.seed + i * 13, f1: b.f1};
  const br = Math.min(b.f1 - 12 - 16, Math.max(b.big!.lockF + 30, b.f0 + Math.round(L.barF)));
  return <>
    <div style={{position: "absolute", left: B.safe.x0, top: TOP, ...wipe(f, b.f0 + 3, 8)}}>
      <span style={{...css(kf, 36), color: B.c.ink}}>{b.kicker}</span></div>
    <div style={{position: "absolute", left: B.safe.x0 - heroSize * 0.03, top: heroY, display: "flex", alignItems: "flex-end", gap: 30}}>
      <Ink B={B} n={b.big!} f={f} size={heroSize} color={B.c.accent} slot={B.c.ink} qualColor={B.c.ink}/>
      {deck && <div style={{marginBottom: heroSize * 0.06}}><Gated text={b.text!} nums={b.textNums} lockF={b.lockF} f={f} ff={F.serif(B)} size={deck.size} width={deckW}
        color={B.c.ink} hot={B.c.ink} set={b.f0 + 8} lineH={1.08}/></div>}
    </div>
    <Notch B={B} x={B.safe.x0} y={top} w={W} color={B.c.ink} f={f} at={b.f0 + 4}/>
    <DeviceView c={c} d={d} lockF={b.big!.lockF} bracketAt={br}/>
    {flag && <Flag B={B} text={flag} f={f} at={Math.min(b.lockF + 15, b.f1 - 20)} y={lowerY} lockF={b.lockF} values={values} color={B.c.ink} strip={B.c.accent2}/>}
  </>;
};

const FrontPage: React.FC<PageProps> = ({L, B, SP, i, f}) => {
  const b = L.beats[i], P = SP.beats[i];
  const g = f + 8;      // frame 0 is 8 frames into the reveal: the headline and the object are already on the page
  const lay = frontLay(L, B, i);
  const bandH = lay.bottom + 40;
  const ob = onBand(B, SP.lead);
  const heroRole = ob.heroHot(lay.H);
  const W = B.safe.x1 - B.safe.x0;
  const src = sourceTop(B, b.src);
  const top = bandH + 48, bottom = src - 40;
  const use = plateUse(L.plate);
  const markAt = b.hero ? Math.min(b.hero.lockF + 8, b.f1 - 26) : 0;
  return <>
    <Headline B={B} b={b} lay={lay} f={f} set={b.f0 - 30} color={ob.main} emph={ob.emph} heroColor={B.c[heroRole]} slot={ob.main}
      mark={b.hero ? {at: markAt, seed: markSeed(L.seed, 1), color: B.c.accent2} : undefined}/>
    {use && L.plate ? <PlateWindow B={B} src={L.plate} x={B.safe.x0} y={top} w={W} h={bottom - top - 44} f={f} f0={b.f0} f1={b.f1} focusY={use.focusY} zoom={use.zoom}/>
      : P.teaser && <>
        <Notch B={B} x={B.safe.x0} y={top + 10} w={W} color={B.c.ink} f={g} at={0}/>
        <TeaserView c={{B, f, P: palNews(B, SP.lead), box: {x: B.safe.x0, y: top + 40, w: W, h: bottom - top - 40}, grow: b.f0 - 12, seed: L.seed, f1: b.f1}} t={P.teaser}
          heads={L.beats.filter((x) => x.kind === "fact").map((x) => ({text: x.kicker ?? "", lockF: x.lockF}))}/>
      </>}
  </>;
};

// A framed, captioned colour illustration (a QA-approved textless plate): never behind a number, a label or the source.
const PlateWindow: React.FC<{B: LookBrand; src: string; x: number; y: number; w: number; h: number; f: number; f0: number; f1: number; focusY: number; zoom: number}> = ({B, src, x, y, w, h, f, f0, f1, focusY, zoom}) => {
  const k = interpolate(f, [f0, f1], [1.04, 1.1], CL) * zoom;
  return <>
    <div style={{position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", outline: `2px solid ${B.c.ink}`}}>
      <Img src={staticFile(src)} style={{position: "absolute", left: 0, top: 0, width: w, height: h, objectFit: "cover", objectPosition: `50% ${focusY * 100}%`,
        transform: `scale(${k})`, transformOrigin: `50% ${focusY * 100}%`}}/>
      <div style={{position: "absolute", inset: 0, background: `linear-gradient(180deg, ${B.c.paper}00 40%, ${B.c.accent}26 100%)`, mixBlendMode: "multiply"}}/>
      <div style={{position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 55%, transparent 55%, ${B.c.ink}55 130%)`}}/>
    </div>
    <div style={{position: "absolute", left: x, top: y + h + 10, width: w, textAlign: "right", ...css(F.body(B, 600, 0.14), 30), color: B.c.softInk}}>ILLUSTRATION</div>
  </>;
};

const TakeawayPage: React.FC<PageProps> = ({L, B, SP, i, f}) => {
  const b = L.beats[i], P = SP.beats[i];
  const W = B.safe.x1 - B.safe.x0;
  const src = sourceTop(B, b.src);
  const note = b.note ?? "";
  const noteFit = note ? fitGated(note, [], F.body(B, 500), W, 4, 34, 28) : null;
  const noteH = noteFit ? noteFit.lines * Math.round(noteFit.size * 1.25) : 0;
  const noteY = src - 30 - noteH;
  const hasProof = !!P.proof;
  const need = !P.proof ? 0 : P.proof.kind === "slip" ? P.proof.quotes.reduce((a, q) => a + Math.min(330, slipH(B, q)) + 30, 0) : P.proof.kind === "band" ? P.proof.rows.length * 60 + 90
    : P.proof.kind === "bars" ? P.proof.rows.length * 120 + 40 : 300;
  const lay = headLayout(B, b, TOP + 70, 96, 270, hasProof ? Math.min(1000, noteY - 60 - need) : noteY - 200);
  const proofTop = lay.bottom + 50, proofBottom = noteY - 40;
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
      const qs = P.proof.quotes, hs = qs.map((q) => Math.min(330, slipH(B, q)));
      const tot = hs.reduce((a, h) => a + h, 0) + (qs.length - 1) * 30;
      let y = proofTop + Math.max(0, (proofBottom - proofTop - tot) / 2);
      return qs.map((q, k) => { const el = <Slip key={k} B={B} q={q} src={b.src} f={f} at={proofAt + k * 10} y={y} lockF={b.lockF} values={values} maxH={hs[k]}/>; y += hs[k] + 30; return el; });
    })()}
    {!hasProof && note && (() => {
      const pf = F.serif(B, 500), pull = fitGated(note, [], pf, W - 40, 5, 58, 40);
      const ph = pull.lines * Math.round(pull.size * 1.18);
      const py = Math.max(lay.bottom + 70, (lay.bottom + src - ph) / 2 - 20);
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
  const W = B.safe.x1 - B.safe.x0;
  const hook = L.beats.find((x) => x.kind === "spot" || x.kind === "hook");
  const ob = onBand(B, SP.lead);
  const q = b.q ?? "";
  const qf = F.serif(B, 640);
  const qFit = fitGated(q, b.qNums, qf, W, 3, 112, 72);
  const qY = 470 + 60;
  const qH = qFit.lines * Math.round(qFit.size * 1.06);
  const sub = b.sub ?? "";
  const subF = F.body(B, 600);
  const subFit = sub ? fitGated(sub, [], subF, W, 2, 50, 36) : null;
  const subY = qY + qH + 34;
  const cta = sub.trim() !== "Comment below." && /comment below/i.test(b.voice?.text ?? b.vo ?? "") ? "Comment below." : "";
  const ctaY = subY + (subFit ? subFit.lines * Math.round(subFit.size * 1.15) : 0) + 30;
  const srcText = L.sourceLines.join("  ·  ");
  const sf = F.body(B, 500);
  const sFit = fitGated(srcText, [], sf, W, 8, 34, 24);
  const sH = sFit.lines * Math.round(sFit.size * 1.25);
  const sY = B.safe.y1 - sH;
  const lockY = Math.max(ctaY + (cta ? 90 : 20), sY - 60 - 110);
  const lockFits = lockY + 100 <= sY - 30;
  const ghostN = hook?.hero;
  const values = [...b.qNums.map((n) => n.value), ...SP.items.map((it) => it.v)];
  const ghostText = ghostN ? ghostN.sign + ghostN.prefix + ghostN.digits + (/^[%×]$/.test(ghostN.unit.trim()) ? ghostN.unit.trim() : "") : "";
  return <>
    {ghostN && f >= ghostN.lockF && (() => {
      let gz = 400;
      while (gz > 160 && measure(ghostText, F.hero(B), gz) > 1000) gz -= 10;
      return <div style={{position: "absolute", right: 1080 - B.safe.x1 - 40, top: 470 - gz * 0.95, opacity: 0.08}}>
        <div style={{...css(F.hero(B), gz), lineHeight: 1, color: ob.main}}>{ghostText}</div></div>;
    })()}
    <div style={{position: "absolute", left: B.safe.x0, top: TOP + 30, display: "flex", alignItems: "center", gap: 14, ...wipe(f, b.f0 + 2, 8)}}>
      <span style={{...css(F.body(B, 800, 0.14), 34), color: ob.kick}}>LETTERS</span></div>
    <div style={{position: "absolute", left: B.safe.x0, top: TOP + 84, width: 120, height: 6, background: ob.kick, ...wipe(f, b.f0 + 6, 8)}}/>
    <div style={{position: "absolute", left: B.safe.x0, top: qY}}>
      <Gated text={q} nums={b.qNums} lockF={b.lockF} f={f} ff={qf} size={qFit.size} width={W} color={B.c.ink} hot={B.c.accent} lineH={1.06} set={b.f0 + 4} stagger={2} balance/></div>
    {subFit && <div style={{position: "absolute", left: B.safe.x0, top: subY, opacity: ramp(f, b.f0 + 14, 8)}}>
      <Gated text={sub} nums={[]} lockF={b.lockF} f={f} ff={subF} size={subFit.size} width={W} color={B.c.softInk} hot={B.c.softInk} lineH={1.15} values={values}/></div>}
    {cta && <div style={{position: "absolute", left: B.safe.x0, top: ctaY, ...css(F.body(B, 700), 52), color: B.c.accent, ...wipe(f, b.f0 + 20, 8)}}>{cta}</div>}
    {lockFits && <div style={{position: "absolute", left: B.safe.x0, top: lockY, display: "flex", alignItems: "center", gap: 22, opacity: ramp(f, b.f0 + 28, 10)}}>
      <B.Mark size={96} on="light"/><B.Wordmark size={B.wordmark.stacked ? 56 : 64} on="light"/></div>}
    <div style={{position: "absolute", left: B.safe.x0, top: sY - 22, width: W, height: 1.5, background: B.c.ink, opacity: 0.5}}/>
    <div style={{position: "absolute", left: B.safe.x0, top: sY, opacity: ramp(f, b.f0 + 24, 10)}}>
      <Gated text={srcText} nums={[]} lockF={b.lockF} f={f} ff={sf} size={sFit.size} width={W} color={B.c.ink} hot={B.c.ink} lineH={1.25} values={values}/></div>
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

// The masthead's colours over whatever ground sits under it. On a bright band (amber) the Mark sits on a paper disc, so
// the tea glass (amber itself) never disappears into its ground.
const chromeOf = (L: LookData, SP: StoryPlan, B: LookBrand, i: number) => {
  const g = groundOf(L, SP, B, i);
  if (g.page === "ink") return {color: B.c.paper, on: "dark" as const, plate: null};
  if (g.band && g.h > RULE_Y + 10) { const ob = onBand(B, g.band); return {color: ob.main, on: ob.dark ? "dark" as const : "light" as const, plate: ob.dark ? null : B.c.paper}; }
  return {color: B.c.ink, on: "light" as const, plate: null};
};

// One whole page of a beat at rest (its ground at its final state, its content, its masthead and source line): what a PAGE
// cut slides in over the page before it, so content always travels with its own paper.
const Sheet: React.FC<PageProps> = ({L, B, SP, i, f}) => {
  const b = L.beats[i];
  const map = b.kind === "map" || b.kind === "mapend";
  const g = groundOf(L, SP, B, i), ch = chromeOf(L, SP, B, i), seed = L.seed + i;
  return <AbsoluteFill style={{overflow: "hidden"}}>
    {map
      ? <>
          <MapClose L={L} B={B} b={b} ground="newsprint" headFont="serif" top={TOP + 6} reserveBottom={b.kind === "map" ? B.safe.y1 - sourceTop(B, b.src) + 40 : 8}/>
          <Img src={staticFile(`looks/dispatch/paper-${seed % 4}.jpg`)} style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, mixBlendMode: "soft-light", opacity: 0.6, pointerEvents: "none"}}/>
        </>
      : <>
          <Paper color={g.page === "ink" ? B.c.ink : B.c.newsprint} seed={seed} amount={g.page === "ink" ? 0.55 : 0.8}/>
          {g.band && g.h > 0 && <><Paper color={B.c[g.band]} seed={seed + 1} style={{height: g.h}}/>
            <div style={{position: "absolute", left: 0, top: g.h, width: 1080, height: 14, background: `linear-gradient(${B.c.ink}33, transparent)`}}/></>}
          <Page L={L} B={B} SP={SP} i={i} f={f}/>
        </>}
    <Masthead B={B} chip={L.chip} color={ch.color} on={ch.on} plate={ch.plate}/>
    {b.kind !== "end" && b.kind !== "mapend" && <SourceLine B={B} text={b.src} color={b.kind === "say" ? B.c.paper : B.c.ink} lockF={b.lockF} f={f}/>}
  </AbsoluteFill>;
};

export const DispatchStory: React.FC<LookProps> = ({L, B}) => {
  const f = useCurrentFrame();
  const quotes = useQuotes(L.id);      // the config's source quotes (quotes.ts); the frame is held until they are read
  const SP = useMemo(() => planStory(L, quotes ?? []), [L, quotes]);
  const i = L.beats.findIndex((x) => f >= x.f0 && f < x.f1);
  const bi = i < 0 ? L.beats.length - 1 : i;
  const b = L.beats[bi];
  const map = b.kind === "map" || b.kind === "mapend";
  const prevMap = bi > 0 && ["map", "mapend"].includes(L.beats[bi - 1].kind);
  const db = downbeats(b, L).slice(1);
  const flash = db.reduce((a, d0) => Math.max(a, f >= d0 && f < d0 + 3 ? 0.11 * (1 - (f - d0) / 3) : 0), 0);
  // PAGE cut: the new page (ground, content, chrome) slides in from the right over the old one, which stays still under it
  const pageCut = bi > 0 && f < b.f0 + 10 && (groundOf(L, SP, B, bi).page !== groundOf(L, SP, B, bi - 1).page || map !== prevMap);
  if (pageCut) {
    const p = ramp(f, b.f0, 10, io);
    return <AbsoluteFill style={{background: B.c.newsprint, overflow: "hidden"}}>
      <Sheet L={L} B={B} SP={SP} i={bi - 1} f={f}/>
      <AbsoluteFill style={{transform: `translateX(${(1 - p) * 1080}px)`, boxShadow: `-18px 0 30px ${B.c.ink}55`}}><Sheet L={L} B={B} SP={SP} i={bi} f={f}/></AbsoluteFill>
      <LookAudio L={L}/>
    </AbsoluteFill>;
  }
  const ch = chromeOf(L, SP, B, bi);
  const chPrev = bi > 0 ? chromeOf(L, SP, B, bi - 1) : ch;
  const early = f - b.f0 < 7;
  const chromeColor = early ? chPrev.color : ch.color, chromeOn = early ? chPrev.on : ch.on, chromePlate = early ? chPrev.plate : ch.plate;
  const outgoing = bi > 0 && f - b.f0 < 6 && !prevMap && !map ? bi - 1 : -1;
  if (map) return <AbsoluteFill style={{background: B.c.newsprint, overflow: "hidden"}}>
    <Sheet L={L} B={B} SP={SP} i={bi} f={f}/>
    {flash > 0 && <AbsoluteFill style={{background: B.c.paper, opacity: flash, pointerEvents: "none"}}/>}
    <LookAudio L={L}/>
  </AbsoluteFill>;
  return <AbsoluteFill style={{background: B.c.newsprint, overflow: "hidden"}}>
    <GroundView B={B} L={L} SP={SP} i={bi} f={f}/>
    {outgoing >= 0 && <div style={{position: "absolute", inset: 0, opacity: 1 - ramp(f, b.f0, 5)}}><Page L={L} B={B} SP={SP} i={outgoing} f={f}/></div>}
    <div style={{position: "absolute", inset: 0}}><Page L={L} B={B} SP={SP} i={bi} f={f}/></div>
    <Masthead B={B} chip={L.chip} color={chromeColor} on={chromeOn} plate={chromePlate}/>
    <SourceLine B={B} text={b.src} color={b.kind === "say" ? B.c.paper : B.c.ink} lockF={b.lockF} f={f}/>
    {flash > 0 && <AbsoluteFill style={{background: B.c.paper, opacity: flash, pointerEvents: "none"}}/>}
    <LookAudio L={L}/>
  </AbsoluteFill>;
};
