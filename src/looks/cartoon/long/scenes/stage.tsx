// Scene kind "stage": an illustrated scene in the pilot's cartoon look. A set (sets.tsx) under a slow push-in camera, actors and prop icons that pop in
// on their reveal key, then the overlay: number badges (Badge from ui.tsx, digits from fig() drawn only from at(key)), pills, one speech bubble.
// Spec (every field optional except set): see StageSpec below and CONTRACT.md section 1. Positions are in the 1920 x 1080 frame.
import React from "react";
import {random} from "remotion";
import {measure, wrap} from "../../../shared/fit";
import type {LookNum} from "../../../shared/types";
import {C} from "../../palette";
import {Badge, Bubble, Inked, Num, Pill, ROUND, SANS, easeIO, pop, type Accent} from "../../ui";
import {Actor, WHO, type Pose, type Who} from "../cast";
import {H, SAFE, W, type FigRef, type SceneProps} from "../contract";
import {fig, lab} from "../figs";
import {Icon, ICONS, type IconName} from "../icons";
import {GlobeIntro, Lightning, Rain, SET_NAMES, Set, type SetName} from "../sets";

export type StageActor = {id: string; who: Who; x: number; y: number; h: number; pose?: Pose; flip?: boolean; enter?: string; seed?: number; look?: number; talk?: boolean};
export type StageProp = {icon: IconName; x: number; y: number; s: number; enter?: string; front?: boolean; shadow?: boolean;
  state?: "empty" | "filling" | "full"; level?: "high" | "mid"; glow?: boolean; hl?: boolean};   // bucket | thermometer | book | calendar (UPSC film)
export type StageBadge = {key: string; ref?: FigRef; const?: number; text?: string; prefix?: string; suffix?: string; caption?: string; x: number; y: number; size?: number;
  accent?: "underline" | "circle"; color?: string; rot?: number; decimals?: number; lab?: string};   // lab: words printed from lab(key) (figures.json u7_labels), instead of text
export type StagePill = {text?: string; lab?: string; x: number; y: number; key?: string; dot?: string; size?: number};
export type StageBubble = {who?: string;   // omitted: the first actor speaks
   text?: string; lab?: string; x?: number; y?: number; key?: string; size?: number; tail?: "left" | "right"};
// UPSC film additions: time (sky/light of rooftop and beach; a veil on the older sets), rain, thunder, intro "globe-band" (30 frames of Earth with a white cloud band, then the set).
export type StageSpec = {set: SetName; actors?: StageActor[]; props?: StageProp[]; badges?: StageBadge[]; pills?: StagePill[]; bubble?: StageBubble; mouth?: boolean;
  time?: "may" | "july" | "noon" | "burst"; rain?: boolean; thunder?: boolean; intro?: "globe-band";
  camera?: {fx: number; fy: number; s0: number; s1: number}; notes?: string};
const INTRO_F = 30;
const TIMES = ["may", "july", "noon", "burst"];

const F_ROUND = {family: ROUND, weight: 800, tnum: false};
const F_SANS8 = {family: SANS, weight: 800, tnum: false};
const F_SANS9 = {family: SANS, weight: 900, tnum: false};
const KEY_BOTTOM = 920;                         // key content stays above the draft caption strip
const BUG = {x0: 1560, y1: 118};                // the engine's brand bug, top right
const mod = (v: number, m: number) => ((v % m) + m) % m;

// A LookNum for a printed value: Badge/Num refuse to draw it before lockF.
const mkNum = (text: string, value: number, lockF: number, prefix: string, suffix: string, decimals: number): LookNum => ({
  text, qual: "", sign: "", prefix, digits: text, unit: suffix, value, scale: 1, grouping: "none", decimals, glyphs: [...text], role: "big", lockF, spokenF: lockF, lockHow: "spoken"});

// Keep a box (centre cx, cy) inside SAFE, above the caption strip and clear of the brand bug.
const placeBox = (cx: number, cy: number, w: number, h: number): [number, number] => {
  const x = Math.min(SAFE.x1 - w / 2, Math.max(SAFE.x0 + w / 2, cx));
  let y = Math.min(KEY_BOTTOM - h / 2, Math.max(SAFE.y0 + h / 2, cy));
  if (x + w / 2 > BUG.x0 && y - h / 2 < BUG.y1) y = Math.min(KEY_BOTTOM - h / 2, BUG.y1 + 6 + h / 2);
  return [x, y];
};
// The box a Badge draws (size = the big text's px; the caption is size * 0.24 px, as in ui.tsx; gap = space between the big text and the caption).
const badgeBox = (text: string, size: number, caption?: string, capPx?: number, gap = 8) => {
  const w1 = measure(text, {...F_ROUND, letterSpacing: -2 / size} as any, size), fs = capPx ?? Math.round(size * 0.24);
  const lines = caption ? wrap(caption, F_SANS8 as any, fs, 640) : [], cw = lines.reduce((m, l) => Math.max(m, measure(l, F_SANS8 as any, fs)), 0);
  return {w: Math.max(w1, cw) + 96, h: size + 18 + (caption ? 20 + gap + Math.ceil(lines.length * fs * 1.12) : 14) + 28};
};

// The same white badge as ui.tsx Badge (white, 8 px ink border, hard offset shadow, pop with overshoot) for the two cases Badge cannot do: words, and a number
// with a hand-drawn circle plus a caption (the circle reaches below the digits, so the caption needs a bigger gap). Captions are 36 px.
const BadgeCard: React.FC<{big: React.ReactNode; f: number; at: number; caption?: string; size: number; rot: number; color: string; accent?: Accent; gap?: number}> = ({big, f, at, caption, size, rot, color, accent, gap = 8}) => {
  if (f < at) return null;
  const t = pop(f, at);
  if (t <= 0.001) return null;
  return <div style={{display: "inline-flex", flexDirection: "column", alignItems: "center", background: C.white, borderRadius: 44, padding: `18px 40px ${caption ? 20 : 14}px`, border: `8px solid ${C.ink}`,
    boxShadow: `0 12px 0 ${C.ink}`, transform: `scale(${t}) rotate(${rot}deg)`, transformOrigin: "50% 60%"}}>
    <Inked accent={accent} f={f} at={at + 8}><div style={{fontFamily: ROUND, fontWeight: 800, fontSize: size, lineHeight: 1, color, letterSpacing: -2, whiteSpace: "nowrap", fontFeatureSettings: "'lnum' 1"}}>{big}</div></Inked>
    {caption && <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 36, lineHeight: 1.12, color: C.ink, marginTop: gap, textAlign: "center", maxWidth: 640}}>{caption}</div>}
  </div>;
};

// A gentle talk loop in Rhubarb shapes (draft): short bursts with a breath every few seconds.
const TALK = ["B", "C", "D", "C", "E", "B", "F", "H", "C", "X"];
const talkShape = (f: number, seed: number) => mod(f + seed * 17, 84) > 70 ? "X" : TALK[Math.floor(random(`stk${seed}-${Math.floor(f / 3)}`) * TALK.length)];

export const Scene: React.FC<SceneProps<StageSpec>> = ({f, dur, spec, at}) => {
  if (!SET_NAMES.includes(spec.set)) throw new Error(`stage: unknown set "${spec.set}" (known: ${SET_NAMES.join(", ")})`);
  const actors = spec.actors ?? [], props = spec.props ?? [], badges = spec.badges ?? [], pills = spec.pills ?? [], bub = spec.bubble;
  const ids: string[] = [];
  actors.forEach((a) => {
    if (!WHO.includes(a.who)) throw new Error(`stage: unknown actor "${a.who}" (known: ${WHO.join(", ")})`);
    if (ids.includes(a.id)) throw new Error(`stage: duplicate actor id "${a.id}"`);
    ids.push(a.id);
  });
  props.forEach((p) => { if (!ICONS.includes(p.icon)) throw new Error(`stage: unknown icon "${p.icon}" (known: ${ICONS.join(", ")})`); });
  if (spec.time !== undefined && !TIMES.includes(spec.time)) throw new Error(`stage: unknown time "${spec.time}" (known: ${TIMES.join(", ")})`);
  if (spec.intro !== undefined && spec.intro !== "globe-band") throw new Error(`stage: unknown intro "${spec.intro}" (known: globe-band)`);
  // words that come from lab(): throws when the key is missing
  const words = (o: {text?: string; lab?: string}, what: string): string => {
    if ((o.text === undefined) === (o.lab === undefined)) throw new Error(`stage: ${what} needs exactly one of text or lab`);
    return o.lab !== undefined ? lab(o.lab) : (o.text as string);
  };
  const speaker = bub ? (bub.who === undefined ? actors[0] : actors.find((a) => a.id === bub.who)) : undefined;
  if (bub && !speaker) throw new Error(`stage: bubble.who "${bub.who}" is not an actor id (ids: ${ids.join(", ") || "none"})`);

  // camera: slow push-in about (fx, fy), never below 1 so the set's edge never shows; a hair of drift keeps a still shot alive
  const cam = spec.camera ?? {fx: 960, fy: 580, s0: 1, s1: 1.05};
  const sc = Math.max(1, cam.s0 + (cam.s1 - cam.s0) * easeIO(f, 0, Math.max(1, dur - 1)));
  const dx = Math.sin(f / 70) * 4, dy = Math.cos(f / 90) * 3;
  // badges and the bubble are anchored to art coordinates, so they ride the camera with the art (pills are HUD and stay put)
  const toScreen = (x: number, y: number): [number, number] => [dx + cam.fx + (x - cam.fx) * sc, dy + cam.fy + (y - cam.fy) * sc];

  // reveal frames: asking for every key on every frame makes an unknown key throw even on a frame where nothing shows yet
  const enterOf = (k?: string) => (k ? at(k) : 0);
  const bubAt = bub ? (bub.key ? at(bub.key) : Math.max(8, (speaker?.enter ? at(speaker.enter) : 0) + 14)) : 0;
  const talking = (a: StageActor, i: number) => (a.talk || (spec.mouth && a.who === "uncle") || (bub && a.id === speaker?.id && f >= bubAt)) ? talkShape(f, a.seed ?? 11 + i * 7) : "X";

  // a calendar next to a UPSC figure (table u7_*) shows the year with June to September highlighted; `hl` on the prop forces it either way
  const upsc = badges.some((b) => b.ref?.t.startsWith("u7_"));
  const order = actors.map((a, i) => ({a, i})).sort((p, q) => p.a.y - q.a.y || p.i - q.i);
  const popAbout = (x: number, y: number, p: number) => `translate(${x} ${y}) scale(${p}) translate(${-x} ${-y})`;
  const propNode = (p: StageProp, i: number) => {
    const t0 = enterOf(p.enter);
    if (f < t0) return null;
    const k = p.enter ? pop(f, t0, 170) : 1;
    if (k <= 0.001) return null;
    const ex = {state: p.state, level: p.level, glow: p.glow, hl: p.hl ?? (p.icon === "calendar" && upsc), prog: easeIO(f, 8, Math.max(9, dur - 12))};
    return <g key={`p${i}`} transform={popAbout(p.x, p.y + p.s * 60, k)}><g transform={`translate(0 ${Math.sin((f + i * 17) / 16) * 5})`}><Icon name={p.icon} x={p.x} y={p.y} s={p.s} f={f} shadow={p.shadow} seed={i + 1} ex={ex}/></g></g>;
  };

  // overlay items
  const badgeNodes = badges.map((b, i) => {
    const t = at(b.key);
    const dec = b.decimals ?? 1, prefix = b.prefix ?? "", suffix = b.suffix ?? "";
    const btext = b.lab !== undefined ? lab(b.lab) : b.text;
    const given = [b.ref, b.const !== undefined ? 1 : undefined, btext].filter((v) => v !== undefined).length;
    if (given !== 1) throw new Error(`stage: badge "${b.key}" needs exactly one of ref, const or text`);
    const accent: Accent | undefined = b.accent ? {kind: b.accent, color: C.red, seed: i + 2} : undefined, rot = b.rot ?? (i % 2 ? 2.5 : -2.5), color = b.color ?? C.royal;
    let shown: React.ReactNode, w: number, h: number;
    if (btext !== undefined) {
      const size = b.size ?? 84, bx = badgeBox(btext, size, b.caption, 36);
      shown = <BadgeCard big={btext} f={f} at={t} caption={b.caption} size={size} rot={rot} color={color} accent={accent}/>; w = bx.w; h = bx.h;
    } else {
      const val = b.ref ? fig(b.ref, dec).value : (b.const as number), txt = prefix + (b.ref ? fig(b.ref, dec).text : val.toFixed(dec)) + suffix, num = mkNum(txt, val, t, prefix, suffix, dec);
      const size = Math.max(b.size ?? 150, b.caption ? 142 : 0), circled = b.accent === "circle" && !!b.caption, bx = badgeBox(txt, size, b.caption, undefined, circled ? 40 : 8);
      shown = circled ? <BadgeCard big={<Num n={num} f={f} where="stage badge"/>} f={f} at={t} caption={b.caption} size={size} rot={rot} color={color} accent={accent} gap={40}/>
        : <Badge n={num} f={f} caption={b.caption} size={size} rot={rot} at={t} color={color} accent={accent}/>;
      w = bx.w; h = bx.h;
    }
    const [sx, sy] = toScreen(b.x ?? 960, b.y ?? 300), [cx, cy] = placeBox(sx, sy, w, h);
    return <div key={`b${i}`} style={{position: "absolute", left: cx, top: cy, transform: "translate(-50%, -50%)"}}>{shown}</div>;
  });

  const pillNodes = pills.map((p, i) => {
    const ptext = words(p, "pill"), t = p.key ? at(p.key) : (spec.intro ? INTRO_F : 0) + 4 + i * 4, size = p.size ?? 38;
    const w = measure(ptext, {...F_SANS9, letterSpacing: 0.5 / size} as any, size) + size * 0.62 + 5 * 2 + 14 + 18 + 28 + 12, h = size * 1.25 + 24 + 12;
    const [cx, cy] = placeBox(p.x + w / 2, p.y + h / 2, w, h);
    return <div key={`l${i}`} style={{position: "absolute", left: cx - w / 2, top: cy - h / 2}}><Pill text={ptext} f={f} at={t} dot={p.dot ?? C.red} size={size}/></div>;
  });

  let bubbleNode: React.ReactNode = null;
  if (bub && speaker) {
    const btxt = words(bub, "bubble"), size = bub.size ?? 60, headX = speaker.x + (speaker.flip ? -1 : 1) * speaker.h * 0.1;
    const [tx, ty] = toScreen(bub.x ?? headX, bub.y ?? speaker.y - speaker.h * 1.02);
    const tail = bub.tail ?? (tx < W / 2 ? "left" : "right");
    // ui.tsx Bubble: max 640 px outer (border-box), 38 px padding and 7 px border each side; a wrapped bubble is always the full 640
    const lines = wrap(btxt, F_ROUND as any, size, 640 - 90), w = lines.length > 1 ? 640 : measure(lines[0] ?? "", F_ROUND as any, size) + 90, h = Math.ceil(lines.length * size * 1.06) + 66;
    let left = tail === "left" ? tx - 103 : tx + 113 - w, top = ty - 47 - h;
    left = Math.min(SAFE.x1 - w, Math.max(SAFE.x0, left)); top = Math.min(KEY_BOTTOM - 60 - h, Math.max(SAFE.y0, top));
    if (left + w > BUG.x0 && top < BUG.y1) top = BUG.y1 + 6;
    bubbleNode = <div style={{position: "absolute", left, top, width: "max-content"}}><Bubble text={btxt} f={f} at={bubAt} size={size} tail={tail}/></div>;
  }

  if (spec.intro === "globe-band" && f < INTRO_F) return <div style={{position: "absolute", left: 0, top: 0, width: W, height: H, overflow: "hidden", background: C.ink}}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", left: 0, top: 0}}><GlobeIntro f={f}/></svg></div>;
  return <div style={{position: "absolute", left: 0, top: 0, width: W, height: H, overflow: "hidden", background: C.ink}}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", left: 0, top: 0}}>
      <g transform={`translate(${dx} ${dy}) translate(${cam.fx} ${cam.fy}) scale(${sc}) translate(${-cam.fx} ${-cam.fy})`}>
        <Set set={spec.set} f={f} time={spec.time}/>
        {props.map((p, i) => !p.front && propNode(p, i))}
        {order.map(({a, i}) => {
          const t0 = enterOf(a.enter);
          if (f < t0) return null;
          const k = a.enter ? pop(f, t0, 170) : 1;
          if (k <= 0.001) return null;
          return <g key={a.id} transform={popAbout(a.x, a.y, k)}>
            <Actor who={a.who} x={a.x} y={a.y} h={a.h} f={f} pose={a.pose ?? "idle"} flip={a.flip} mouth={talking(a, i)} seed={a.seed ?? 11 + i * 7} look={a.look}
              {...({since: a.enter ? t0 + 8 : 3 + i * 3} as object)}/>
          </g>;
        })}
        {props.map((p, i) => p.front && propNode(p, i))}
        {spec.rain && <Rain f={f} heavy={spec.time === "burst"}/>}
        {spec.thunder && <Lightning f={f}/>}
      </g>
    </svg>
    {pillNodes}{badgeNodes}{bubbleNode}
  </div>;
};
