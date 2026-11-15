// Scene kind "stage", variant B (CONTRACT.md spec 1): a cartoon set with a cast acting out one beat. Actors and props pop in on the narrator's word (enter keys),
// badges print figures read from figures.json through fig() on theirs, a slow camera push-in runs under the whole scene, and the speaker's mouth moves while
// they talk. Nothing is typed here: every number is fig() (or a {const}), every key is at(key) (which throws when the storyboard has no reveal for it), and a
// digit in free text (badge text/caption, bubble text) throws unless the spec marks it `literal`. To use this variant, point scenes/index.ts at "./stage_b".
import React from "react";
import {AbsoluteFill, random} from "remotion";
import type {LookNum} from "../../../shared/types";
import type {MarkKind} from "../../../shared/Marks";
import {measure, wrap} from "../../../shared/fit";
import {Actor, HEIGHT, type Pose, type Who} from "../cast";
import {SAFE, type FigRef, type SceneProps} from "../contract";
import {fig} from "../figs";
import {Icon, type IconName} from "../icons";
import {FLOOR, Set, SET_NAMES, type SetName} from "../sets";
import {C} from "../../palette";
import {Badge, Pill, ROUND, SANS, easeIO, pop} from "../../ui";

type When = string | number;   // a reveal key (frame = at(key)) or a local frame number

export type StageActor = {
  id?: string; who: Who;
  x?: number; y?: number; h?: number;       // middle of the feet line, standing height in px (defaults: spread across the stage on the set's floor, cast.HEIGHT proportions)
  pose?: Pose; then?: {at: When; pose: Pose}[];   // pose changes on a key or a frame
  flip?: boolean;                           // default: faces the middle of the frame
  enter?: When; exit?: When; from?: "pop" | "left" | "right" | "drop";
  talk?: boolean;                           // this actor speaks (mouth moves) from entering until the scene's last 10 frames
  seed?: number;
};
export type StageProp = {icon: IconName; x: number; y: number; s?: number; enter?: When; exit?: When; front?: boolean; label?: string; bob?: number; rot?: number};
export type StageBadge = {
  key: string;                              // reveal key: nothing of the badge shows before at(key)
  ref?: FigRef; const?: number; prefix?: string; suffix?: string; decimals?: number;   // a figure: prints prefix + fig(ref) + suffix (or a definitional constant such as the 2.1 replacement level)
  text?: string; literal?: boolean;         // words instead of a figure (a digit in them throws unless literal)
  caption?: string; x?: number; y?: number; size?: number; color?: string; rot?: number;
  accent?: MarkKind; accentColor?: string;
};
export type StagePill = {text: string; x?: number; y?: number; key?: When; enter?: When; dot?: string; size?: number};
export type StageBubble = {who?: string; text: string; x?: number; y?: number; key?: When; size?: number; ref?: FigRef; const?: number; prefix?: string; suffix?: string; decimals?: number; literal?: boolean};
export type StageSpec = {
  set: SetName;
  actors?: StageActor[]; props?: StageProp[]; badges?: StageBadge[]; pills?: StagePill[]; bubble?: StageBubble;
  camera?: {fx?: number; fy?: number; s0?: number; s1?: number}; cam?: {fx?: number; fy?: number; s0?: number; s1?: number};
  mouth?: boolean; notes?: string;
};

const SHAPES = ["B", "C", "D", "E", "C", "F", "G", "H", "B", "D"];
// A speaking mouth without a recording: ~7 syllables a second in phrases of 1.7 s with a breath between (Rhubarb's shapes).
const visemeAt = (f: number, seed: number, from: number, to: number): string => {
  if (f < from || f >= to) return "X";
  const t = f - from, phrase = Math.floor(t / 52), k = t % 52;
  if (k >= 44) return "X";
  const r = random(`vis${seed}-${phrase}-${Math.floor(k / 4)}`);
  if (k % 4 === 3 && r < 0.4) return "A";
  return SHAPES[Math.floor(r * SHAPES.length)];
};

const colorOf = (c?: string) => (c && (C as Record<string, string>)[c]) || c || C.royal;
// Survey names and survey years are labels, not figures ("NFHS-5", "2019-21"); any other digit in free text must come from fig().
const LABEL = /NFHS-?[3-6]|\b(?:19|20)\d\d(?:[-\u2013]\d\d)?\b/g;
const noDigits = (text: string, what: string, literal?: boolean) => {
  if (!literal && /[0-9]/.test(text.replace(LABEL, ""))) throw new Error(`stage: ${what} "${text}" has a digit: print figures with ref + key (fig()), or set literal: true if it is a label and not a figure`);
};
const mkNum = (text: string, lockF: number, value = 0, decimals = 0): LookNum =>
  ({text, qual: "", sign: "", prefix: "", digits: text, unit: "", value, scale: 1, grouping: "none", decimals, glyphs: text.split(""), role: "hero", lockF, spokenF: lockF, lockHow: "spoken"});
const figText = (r: FigRef, o: {decimals?: number; prefix?: string; suffix?: string}) => { const v = fig(r, o.decimals ?? 1); return {text: `${o.prefix ?? ""}${v.text}${o.suffix ?? ""}`, value: v.value}; };
// a printed number: fig(ref), or a definitional constant given in the spec ({const: 2.1})
const valueText = (o: {ref?: FigRef; const?: number; decimals?: number; prefix?: string; suffix?: string}) =>
  o.ref ? figText(o.ref, o) : {text: `${o.prefix ?? ""}${o.const!.toFixed(o.decimals ?? 1)}${o.suffix ?? ""}`, value: o.const!};

const ROUND_FONT = {family: ROUND, weight: 800, tnum: false} as any;
const SANS_FONT = {family: SANS, weight: 800, tnum: false} as any;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// A badge's real size (the Badge in ui.tsx: 8 px border, 40 px side padding, caption 0.24 em under the number).
const badgeBox = (text: string, size: number, caption?: string) => {
  const capSize = Math.round(size * 0.24), w = measure(text, ROUND_FONT, size) + 96;
  const capLines = caption ? wrap(caption, SANS_FONT, capSize, 640) : [];
  const capW = capLines.length ? Math.max(...capLines.map((l) => measure(l, SANS_FONT, capSize))) + 96 : 0;
  return {w: Math.max(w, capW), h: size + 32 + (caption ? 20 + 8 + capLines.length * capSize * 1.12 : 14) + 12};
};

type Rect = {l: number; t: number; r: number; b: number};
const hit = (a: Rect, b: Rect, m = 14) => a.l < b.r + m && a.r > b.l - m && a.t < b.b + m && a.b > b.t - m;
// A pill's real size (Pill in ui.tsx: 6 px border, 12/28/12/18 padding, a dot of 0.62 em + 5 px border and a 14 px gap).
const pillBox = (text: string, size: number) => ({w: measure(text, {...SANS_FONT, weight: 900, letterSpacing: 0.5 / size}, size) + 18 + 28 + 12 + 14 + size * 0.62 + 10, h: size * 1.15 + 24 + 12 + 8});
// The bubble's body size for a text at a size (same wrap as SpeechBubble draws).
const bubbleBox = (text: string, size: number) => {
  const padX = 38, padY = 24, lines = wrap(text, ROUND_FONT, size, 760 - padX * 2), lh = size * 1.1;
  return {lines, lh, padX, padY, w: Math.max(...lines.map((l) => measure(l, ROUND_FONT, size))) + padX * 2, h: lines.length * lh + padY * 2};
};

// ---- speech bubble: white body, hard offset shadow, a tail pointing at the speaker's head (drawn here so it can point anywhere) ----
const SpeechBubble: React.FC<{text: string; size: number; cx: number; cy: number; tx: number; ty: number; f: number; at: number}> = ({text, size, cx, cy, tx, ty, f, at}) => {
  const t = pop(f, at, 200);
  if (t <= 0.001) return null;
  const {lines, lh, padX, padY, w, h} = bubbleBox(text, size);
  const bcx = cx, bcy = cy + Math.sin(f / 14) * 3;
  const L = bcx - w / 2, R = bcx + w / 2, T = bcy - h / 2, B = bcy + h / 2, rx = Math.min(44, h / 2 - 2);
  // which edge faces the speaker, and where the tail's base sits on it
  const dx = tx - bcx, dy = ty - bcy, vertical = Math.abs(dy) / (h / 2) > Math.abs(dx) / (w / 2);
  const n = vertical ? [0, dy > 0 ? 1 : -1] : [dx > 0 ? 1 : -1, 0], tg = vertical ? [1, 0] : [0, 1];
  const along = vertical ? clamp(tx, L + rx + 30, R - rx - 30) : clamp(ty, T + rx * 0.5 + 30, B - rx * 0.5 - 30);
  const base = vertical ? [along, dy > 0 ? B : T] : [dx > 0 ? R : L, along];
  const dist = Math.hypot(tx - base[0], ty - base[1]), len = clamp(dist - 14, 48, 240), u = [(tx - base[0]) / (dist || 1), (ty - base[1]) / (dist || 1)];
  const apex = [base[0] + u[0] * len, base[1] + u[1] * len], bw = 34;
  const P1 = [base[0] - tg[0] * bw, base[1] - tg[1] * bw], P2 = [base[0] + tg[0] * bw, base[1] + tg[1] * bw];
  const tail = `M ${P1} L ${apex} L ${P2} Z`;
  const patch = [[P1[0] + tg[0] * 5 + n[0] * 5, P1[1] + tg[1] * 5 + n[1] * 5], [P2[0] - tg[0] * 5 + n[0] * 5, P2[1] - tg[1] * 5 + n[1] * 5], [P2[0] - tg[0] * 5 - n[0] * 9, P2[1] - tg[1] * 5 - n[1] * 9], [P1[0] + tg[0] * 5 - n[0] * 9, P1[1] + tg[1] * 5 - n[1] * 9]];
  return <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute", left: 0, top: 0}}>
    <g transform={`translate(${base[0]} ${base[1]}) scale(${t}) translate(${-base[0]} ${-base[1]})`}>
      <g transform="translate(0 10)" fill={C.ink} stroke={C.ink} strokeWidth={7} strokeLinejoin="round"><rect x={L} y={T} width={w} height={h} rx={rx}/><path d={tail}/></g>
      <path d={tail} fill={C.white} stroke={C.ink} strokeWidth={7} strokeLinejoin="round"/>
      <rect x={L} y={T} width={w} height={h} rx={rx} fill={C.white} stroke={C.ink} strokeWidth={7}/>
      <polygon points={patch.map((p) => p.join(",")).join(" ")} fill={C.white}/>
      {lines.map((ln, i) => <text key={i} x={bcx} y={T + padY + lh * i + size * 0.84} textAnchor="middle" fontFamily={ROUND} fontWeight={800} fontSize={size} fill={C.ink} letterSpacing={-0.5}>{ln}</text>)}
    </g>
  </svg>;
};

export const Scene: React.FC<SceneProps<StageSpec>> = ({f, dur, spec, at}) => {
  if (!spec || !SET_NAMES.includes(spec.set)) throw new Error(`stage: spec.set must be one of ${SET_NAMES.join(", ")} (got ${JSON.stringify(spec?.set)})`);
  const when = (e: When | undefined, dflt: number) => e === undefined ? dflt : typeof e === "number" ? e : at(e);
  const floor = Math.min(960, FLOOR[spec.set] + 200);   // FLOOR is where the back wall meets the ground; actors stand 60..240 px in front of it
  const acts = spec.actors ?? [], props = spec.props ?? [], badges = spec.badges ?? [], pills = spec.pills ?? [];

  // ---- actors: default positions spread across the stage, facing the middle
  const n = acts.length, spacing = n > 1 ? Math.min(500, 1000 / (n - 1)) : 0;
  const placed = acts.map((a, i) => {
    const x = a.x ?? 960 + (i - (n - 1) / 2) * spacing, base = n > 3 ? 540 : 620;
    return {...a, i, x, y: a.y ?? floor, h: a.h ?? Math.round(base * HEIGHT[a.who]), flip: a.flip ?? x > 960, enterF: when(a.enter, 2 + i * 5), exitF: a.exit === undefined ? undefined : when(a.exit, 0), seed: a.seed ?? i + 1};
  });
  const bu = spec.bubble;
  const speakerId = bu?.who;
  const talks = (a: (typeof placed)[number]) => placed.some((p) => p.talk !== undefined) ? !!a.talk : spec.mouth === true ? (placed.some((p) => p.who === "uncle") ? a.who === "uncle" : a.id === speakerId || (!speakerId && a.i === 0)) : false;

  // ---- camera: slow push-in about a focal point (default: the cast's centre)
  const cx = n ? placed.reduce((s, a) => s + a.x, 0) / n : 960, cy = n ? placed.reduce((s, a) => s + a.y - a.h * 0.55, 0) / n : 540;
  const cm = spec.camera ?? spec.cam ?? {};
  const cam = {fx: cm.fx ?? cx, fy: cm.fy ?? cy, s0: Math.max(1, cm.s0 ?? 1), s1: Math.max(1, cm.s1 ?? 1.06)};
  const s = cam.s0 + (cam.s1 - cam.s0) * easeIO(f, 0, dur);
  const map = (x: number, y: number): [number, number] => [cam.fx + (x - cam.fx) * s, cam.fy + (y - cam.fy) * s];

  // ---- draw order: back to front by the y of the feet (actors) or centre (props); `front` props go over everyone
  type Item = {z: number; node: React.ReactNode};
  const items: Item[] = [];
  placed.forEach((a) => {
    const t = pop(f, a.enterF, 170), out = a.exitF === undefined ? 1 : 1 - Math.min(1, Math.max(0, (f - a.exitF) / 8));
    if (t <= 0.001 || out <= 0.001) return;
    const from = a.from ?? "pop", sc = (from === "pop" ? t : Math.min(1, 0.4 + t * 0.6)) * out;
    const dx = from === "left" ? (1 - t) * -760 : from === "right" ? (1 - t) * 760 : 0, dy = from === "drop" ? (1 - t) * -620 : 0;
    let pose: Pose = a.pose ?? "idle";
    (a.then ?? []).forEach((c) => { if (f >= when(c.at, 1e9)) pose = c.pose; });
    const mouth = talks(a) ? visemeAt(f, a.seed, a.enterF + 6, dur - 10) : "X";
    items.push({z: a.y, node: <g key={`a${a.i}`} transform={`translate(${a.x + dx} ${a.y + dy}) scale(${sc}) translate(${-a.x} ${-a.y})`}>
      <Actor who={a.who} x={a.x} y={a.y} h={a.h} f={f} pose={pose} flip={a.flip} mouth={mouth} seed={a.seed}/></g>});
  });
  props.forEach((p, i) => {
    const e = when(p.enter, 8 + i * 4), t = pop(f, e, 170), out = p.exit === undefined ? 1 : 1 - Math.min(1, Math.max(0, (f - when(p.exit, 0)) / 8));
    if (t <= 0.001 || out <= 0.001) return;
    const bob = p.bob ? Math.sin((f + i * 9) / 11) * p.bob : 0, sz = (p.s ?? 2) * 120;
    items.push({z: p.front ? 5000 + i : p.y, node: <g key={`p${i}`} transform={`translate(${p.x} ${p.y + bob}) rotate(${p.rot ?? 0}) scale(${t * out})`}>
      <Icon name={p.icon} x={0} y={0} s={p.s ?? 2} f={f} seed={i}/>
      {p.label && <g transform={`translate(0 ${sz / 2 + 44})`}><rect x={-p.label.length * 15 - 24} y={-34} width={p.label.length * 30 + 48} height={68} rx={34} fill={C.white} stroke={C.ink} strokeWidth={6}/>
        <text y={13} textAnchor="middle" fontFamily={ROUND} fontWeight={800} fontSize={38} fill={C.ink}>{p.label}</text></g>}
    </g>});
  });
  items.sort((a, b) => a.z - b.z);

  // ---- overlay: pills (screen-fixed tags, top-left), badges (follow the camera, kept inside SAFE), the speech bubble
  const nb = badges.length, badgeRects: Rect[] = [];
  const badgeEls = badges.map((b, i) => {
    if (!b.key) throw new Error(`stage: badge ${i} has no key`);
    const isNum = !!b.ref || b.const !== undefined;
    if (b.ref && b.const !== undefined) throw new Error(`stage: badge ${i} has both ref and const`);
    if (isNum && b.text !== undefined) throw new Error(`stage: badge ${i} has both a number (ref/const) and text: give a figure or words`);
    if (!isNum && b.text === undefined) throw new Error(`stage: badge ${i} has neither ref, const nor text`);
    const lockF = at(b.key);
    let nm: LookNum, size: number;
    if (isNum) { const ft = valueText(b); nm = mkNum(ft.text, lockF, ft.value, b.decimals ?? 1); size = b.size ?? 170; }
    else {
      noDigits(b.text!, `badge ${i} text`, b.literal);
      nm = mkNum(b.text!, lockF); size = Math.min(b.size ?? 100, Math.floor(1100 / (b.text!.length * 0.56)));
    }
    if (b.caption) noDigits(b.caption, `badge ${i} caption`, b.literal);
    const tagged = !!b.caption && b.accent === "circle";            // the hand-drawn circle overshoots the badge by ~35 px: caption goes in a tag under it
    size = Math.max(size, b.caption && !tagged ? 142 : 0);
    const box = badgeBox(nm.text, size, tagged ? undefined : b.caption);
    const tagLines = tagged ? wrap(b.caption!, SANS_FONT, 38, 640) : [], tagW = tagged ? Math.max(...tagLines.map((l) => measure(l, SANS_FONT, 38))) + 56 : 0, tagH = tagged ? tagLines.length * 38 * 1.15 + 28 : 0;
    const gap = tagged ? 34 : 0, totalBelow = tagged ? gap + tagH : 0, halfW = Math.max(box.w, tagW) / 2;
    const bx0 = b.x ?? 960 + (i - (nb - 1) / 2) * 560, by0 = b.y ?? 330, [mx, my] = map(bx0, by0);
    const lo = 112 + box.h / 2, hi = 912 - box.h / 2 - totalBelow;
    const px = clamp(mx, SAFE.x0 + halfW, SAFE.x1 - halfW), py = clamp(my, lo, hi);
    const sx = clamp(bx0, SAFE.x0 + halfW, SAFE.x1 - halfW), sy = clamp(by0, lo, hi);
    badgeRects.push({l: sx - halfW, r: sx + halfW, t: sy - box.h / 2, b: sy + box.h / 2 + totalBelow});
    return <React.Fragment key={`b${i}`}>
      <div style={{position: "absolute", left: px, top: py, transform: "translate(-50%, -50%)"}}>
        <Badge n={nm} f={f} caption={tagged ? undefined : b.caption} size={size} color={colorOf(b.color)} rot={b.rot ?? (i % 2 ? 2 : -2)} accent={b.accent ? {kind: b.accent, color: colorOf(b.accentColor ?? "red"), seed: 3 + i * 5} : undefined}/>
      </div>
      {tagged && (() => { const t = pop(f, lockF + 6, 200); return t <= 0.001 ? null :
        <div style={{position: "absolute", left: px, top: py + box.h / 2 + gap, transform: `translate(-50%, 0) scale(${t})`, transformOrigin: "50% 0%", background: C.white, border: `6px solid ${C.ink}`, borderRadius: 26,
          boxShadow: `0 8px 0 ${C.ink}`, padding: "10px 24px", fontFamily: SANS, fontWeight: 800, fontSize: 38, lineHeight: 1.15, color: C.ink, whiteSpace: "pre", textAlign: "center"}}>{tagLines.join("\n")}</div>; })()}
    </React.Fragment>;
  });
  const pillRect = (p: StagePill, i: number): Rect & {x: number; y: number} => {
    const pb = pillBox(p.text, p.size ?? 38), x = clamp(p.x ?? SAFE.x0, SAFE.x0, SAFE.x1 - pb.w);
    const y = clamp(p.y ?? 104 + i * 92, SAFE.y0 + 40, 900 - pb.h), yy = x + pb.w > 1480 ? Math.max(y, 118) : y;
    return {x, y: yy, l: x, t: yy, r: x + pb.w, b: yy + pb.h};
  };
  const pillEls = pills.map((p, i) => { const r = pillRect(p, i); return <div key={`pl${i}`} style={{position: "absolute", left: r.x, top: r.y}}>
    <Pill text={p.text} f={f} at={when(p.key ?? p.enter, 6 + i * 5)} dot={colorOf(p.dot ?? "red")} size={p.size ?? 38}/></div>; });

  let bubbleEl: React.ReactNode = null;
  if (bu) {
    const speaker = placed.find((a) => a.id === bu.who) ?? placed.find(talks) ?? placed[0];
    if (bu.who && !placed.some((a) => a.id === bu.who)) throw new Error(`stage: bubble.who "${bu.who}" is not an actor id (have: ${placed.map((a) => a.id ?? "-").join(", ")})`);
    let text = bu.text, lock: number | undefined;
    if (bu.ref || bu.const !== undefined) {
      if (bu.key === undefined) throw new Error("stage: a bubble with a ref or const needs a key");
      lock = when(bu.key, 0);
      if (!bu.text.includes("{n}")) throw new Error("stage: a bubble with a ref or const needs {n} in its text");
      text = text.replace("{n}", valueText(bu).text);
    } else noDigits(text, "bubble text", bu.literal);
    const at0 = when(bu.key, speaker ? speaker.enterF + 12 : 16), size = bu.size ?? 56;
    const head = speaker ? map(speaker.x, speaker.y - speaker.h - 2) : [960, 600] as [number, number];
    const bb = bubbleBox(text, size), side = (speaker ? speaker.x : 960) < 960 ? 1 : -1;
    // given x,y: the centre of the bubble. Otherwise: up and to the middle of the frame from the speaker's head, nudged sideways off pills and badges
    const place = (p: [number, number]): [number, number] => [clamp(p[0], SAFE.x0 + bb.w / 2 + 6, SAFE.x1 - bb.w / 2 - 6), clamp(p[1], 118 + bb.h / 2, 900 - bb.h / 2)];
    let pos: [number, number];
    if (bu.x !== undefined && bu.y !== undefined) pos = place(map(bu.x, bu.y));
    else {
      // chosen in camera-free coordinates so it cannot flip while the camera moves
      const h0 = speaker ? [speaker.x, speaker.y - speaker.h - 2] : [960, 600], base0: [number, number] = [h0[0] + side * 300, h0[1] - 80 - bb.h / 2];
      const obstacles: Rect[] = [...badgeRects, ...pills.map((p, i) => pillRect(p, i))];
      let pick = 0;
      for (const k of [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5]) {
        const c = place([base0[0] + k * 110, base0[1]]), r: Rect = {l: c[0] - bb.w / 2, r: c[0] + bb.w / 2, t: c[1] - bb.h / 2, b: c[1] + bb.h / 2};
        if (!obstacles.some((o) => hit(r, o, 36))) { pick = k; break; }
      }
      pos = place([head[0] + side * 300 + pick * 110, head[1] - 80 - bb.h / 2]);
    }
    if (lock === undefined || f >= lock) bubbleEl = <SpeechBubble text={text} size={size} cx={pos[0]} cy={pos[1]} tx={head[0]} ty={head[1]} f={f} at={Math.max(at0, lock ?? 0)}/>;
  }

  return <AbsoluteFill style={{background: C.ink, overflow: "hidden"}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute", left: 0, top: 0}}>
      <g transform={`translate(${cam.fx} ${cam.fy}) scale(${s}) translate(${-cam.fx} ${-cam.fy})`}>
        <Set set={spec.set} f={f}/>
        {items.map((it) => it.node)}
      </g>
    </svg>
    {pillEls}{badgeEls}{bubbleEl}
  </AbsoluteFill>;
};
