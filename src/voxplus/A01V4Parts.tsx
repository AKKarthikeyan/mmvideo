// A01 v4 shared parts (18 Oct 2026): the shot runner (any fps), toned paper, retyped document pages, chapter cards,
// code-drawn icons and pieces used by the cold open (A01V4Cold.tsx) and the full film (A01V4Film.tsx).
// TIME: every `f`, `at`, `dur` here is in TICKS (1/30 s; see tokens.ts). Scenes read their local time with useTicks().
import React from "react";
import {AbsoluteFill, random, useVideoConfig} from "remotion";
import {BigWord} from "./BigType";
import {Cam, camAt, CamKey, Layer} from "./Camera";
import {SourceTag} from "./Cards";
import {piecePose, StickerLabel} from "./Collage";
import {MarkerCircle} from "./Marker";
import {Finish, InkSurface, PaperSurface} from "./Texture";
import {linearTiming, matchZoom, paperOver, pushThrough, TransitionSeries, whip} from "./Transitions";
import {C, clamp01, ease, F, H, inOut, outBack, outCubic, outQuint, shake, spr, step, tk2f, W} from "./tokens";

// =====================================================================================================
// runner
// =====================================================================================================
export type Tr = {k: "hard"} | {k: "whip"; d: "left" | "right" | "up" | "down"} | {k: "paper"; d: "up" | "left"} | {k: "push"; x: number; y: number} | {k: "match"};
export type SP = {s0: number; d: number};            // scene start and length, ticks
export type Shot = {id: string; cut: number; tr: Tr; C: React.FC<SP>};   // cut = visible cut, seconds
export const TT = 12;                                // transition length, ticks (0.4 s)
export const tsec = (s: number) => Math.round(s * 30);   // seconds -> ticks
const tlen = (t: Tr) => (t.k === "hard" ? 0 : TT);
export const layoutShots = (shots: {cut: number; tr: Tr}[], totalTicks: number) => {
  const start = shots.map(({cut, tr}, i) => (i === 0 ? 0 : tsec(cut) - tlen(tr) / 2));
  const dur = shots.map((_, i) => (i < shots.length - 1 ? start[i + 1] + tlen(shots[i + 1].tr) - start[i] : totalTicks - start[i]));
  return {start, dur};
};
const present = (tr: Tr) => {
  if (tr.k === "whip") return whip(tr.d);
  if (tr.k === "paper") return paperOver(tr.d);
  if (tr.k === "match") return matchZoom(960, 520);
  if (tr.k === "push") return pushThrough(tr.x, tr.y, 4.5, 7);
  return null;
};
/** Plays the shots at the composition's fps (lengths converted from ticks); each scene is clipped to the frame. */
export const Series: React.FC<{shots: Shot[]; start: number[]; dur: number[]}> = ({shots, start, dur}) => {
  const {fps} = useVideoConfig();
  const t = linearTiming({durationInFrames: tk2f(TT, fps)});
  // frame-exact lengths: convert cumulative tick positions, then difference (no drift from rounding)
  const fstart = start.map((s) => tk2f(s, fps));
  const fdur = dur.map((d, i) => tk2f(start[i] + d, fps) - fstart[i]);
  return (
    <TransitionSeries>
      {shots.flatMap(({id, tr, C: Comp}, i) => {
        const seq = (
          <TransitionSeries.Sequence key={id} durationInFrames={fdur[i]}>
            <AbsoluteFill style={{overflow: "hidden"}}><Comp s0={start[i]} d={dur[i]}/></AbsoluteFill>
          </TransitionSeries.Sequence>
        );
        const p = present(tr);
        if (i === 0 || !p) return [seq];
        return [<TransitionSeries.Transition key={id + "t"} presentation={p as never} timing={t}/>, seq];
      })}
    </TransitionSeries>
  );
};

/**
 * Opening camera move for a shot (the gate counts in-shot motion, not transitions): in the first ~0.9 s the camera
 * settles from an offset: a pull-out (from 22% closer), a lateral glide (280 px) or a tilt (200 px), chosen per shot so
 * moves vary and never add push-ins. Maps and edge-sensitive shots use `only: "pull"`.
 */
export const introMove = (f: number, seed: string, only?: "pull", d = 0) => {
  const kind = only === "pull" ? 0 : Math.floor(random("im" + seed) * 4);
  const e = 1 - outCubic(clamp01(f / 21));
  // a second, quicker glide half-way through longer shots (a new framing inside the shot)
  const mid = d > 80 ? outCubic(clamp01((f - d * 0.5) / 12)) : 0;
  const side = random("ms" + seed) < 0.5 ? -1 : 1;
  const m = {ds: 0, dx: side * 170 * mid, dy: 0};
  if (kind === 0) return {...m, ds: 0.45 * e};
  if (kind === 1) return {...m, ds: 0.08 * e, dx: m.dx + 520 * e};
  if (kind === 2) return {...m, ds: 0.08 * e, dx: m.dx - 520 * e};
  return {...m, ds: 0.08 * e, dy: 360 * e};
};
export const camI = (f: number, keys: CamKey[], seed: string, only?: "pull", d = 0): Cam => {
  const c = camAt(f, keys), m = introMove(f, seed, only, only ? 0 : d);
  return {...c, s: c.s * (1 + m.ds), x: c.x + m.dx, y: c.y + m.dy};
};

/** Cream or kraft paper with the blotchy texture toned down by a third (AK, 18 Oct). */
export const Paper: React.FC<{tone?: "cream" | "kraft"; drift?: number}> = ({tone, drift}) => <PaperSurface tone={tone} drift={drift} texture={0.67}/>;

/** Standard shot frame: paper (or ink), camera layer, chip, finish. */
export const Desk: React.FC<{f: number; d: number; cam?: CamKey[]; tone?: "cream" | "kraft" | "ink"; chip?: string; chip2?: string; children?: React.ReactNode; over?: React.ReactNode}> =
  ({f, d, cam, tone = "cream", chip, chip2, children, over}) => {
    const c = camI(f, cam ?? [[0, 1.0, 960, 540], [d, 1.03, 960, 540]], (chip ?? "") + d + tone, undefined, d);
    const dark = tone === "ink";
    return (
      <AbsoluteFill>
        {dark ? <InkSurface glow={0.08}/> : <Layer cam={c} depth={0.85}><Paper tone={tone === "kraft" ? "kraft" : "cream"} drift={f / Math.max(1, d)}/></Layer>}
        <Layer cam={c}>{children}</Layer>
        {over}
        {chip ? <SourceTag f={f} at={0} text={chip} dark={dark}/> : null}
        {chip2 ? <SourceTag f={f} at={0} text={chip2} dark={dark} pos="bl"/> : null}
        <Finish f={f} dark={dark}/>
      </AbsoluteFill>
    );
  };

// =====================================================================================================
// small marks
// =====================================================================================================
export const MarkerText: React.FC<{f: number; at: number; text: string; x: number; y: number; size?: number; color?: string; rot?: number; dur?: number; dir?: "x" | "y"}> =
  ({f, at, text, x, y, size = 80, color = C.markerRed, rot = -3, dur = 12, dir = "x"}) => {
    const p = ease(f, at, at + dur, (t) => t);
    if (p <= 0) return null;
    const clip = dir === "x" ? `inset(-40% ${((1 - p) * 100).toFixed(1)}% -40% -8%)` : `inset(-10% -20% ${((1 - p) * 100).toFixed(1)}% -20%)`;
    return <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg)`, fontFamily: F.marker, fontSize: size,
      color, lineHeight: 1, whiteSpace: "nowrap", clipPath: clip, opacity: 0.94}}>{text}</div>;
  };

export const Stamp: React.FC<{f: number; at: number; text: string; x: number; y: number; size?: number; rot?: number; color?: string}> =
  ({f, at, text, x, y, size = 120, rot = -8, color = C.markerRed}) => {
    if (f < at) return null;
    const s = spr(f, at, 9, 260), sh = shake(f, at + 2, 9, "stamp" + text);
    return <div style={{position: "absolute", left: x + sh.x, top: y + sh.y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${2.2 - 1.2 * s})`,
      opacity: clamp01(s * 3) * 0.9, fontFamily: F.sans, fontWeight: 900, fontSize: size, letterSpacing: size * 0.06, lineHeight: 1, color,
      border: `${size * 0.075}px solid ${color}`, borderRadius: size * 0.1, padding: `${size * 0.12}px ${size * 0.22}px ${size * 0.08}px`, mixBlendMode: "multiply",
      whiteSpace: "nowrap"}}>{text}</div>;
  };

/** Big serif number that counts (₹ and other glyphs DM Serif lacks are set in Inter via `pre`). */
export const Num: React.FC<{f: number; at: number; to: number; from?: number; dur?: number; x: number; y: number; size?: number; color?: string;
  pre?: string; preSans?: boolean; suf?: string; dec?: number; slam?: boolean; text?: string}> =
  ({f, at, to, from = 0, dur = 30, x, y, size = 200, color = C.white, pre = "", preSans, suf = "", dec = 0, slam = true, text}) => {
    if (f < at) return null;
    const s = spr(f, at, 11, 200), v = from + (to - from) * ease(f, at, at + dur, (t) => 1 - Math.pow(1 - t, 4));
    const sh = shake(f, at + 5, slam ? 7 : 0, "num" + to);
    const body = text ?? v.toLocaleString("en-IN", {minimumFractionDigits: dec, maximumFractionDigits: dec});
    return (
      <div style={{position: "absolute", left: x + sh.x, top: y + sh.y, transform: `translate(-50%, -50%) scale(${slam ? 1.5 - 0.5 * s : 0.85 + 0.15 * s})`,
        opacity: clamp01(s * 3), filter: s < 0.8 ? `blur(${((0.8 - s) * 16).toFixed(1)}px)` : undefined, whiteSpace: "nowrap", color, lineHeight: 1,
        fontFamily: F.serif, fontSize: size, letterSpacing: -size * 0.02, fontVariantNumeric: "tabular-nums"}}>
        {pre ? <span style={preSans ? {fontFamily: F.sans, fontWeight: 600, fontSize: size * 0.82} : undefined}>{pre}</span> : null}{body}{suf}
      </div>
    );
  };

/** Short label under a number (not counted as a headline when it is a unit/scope). */
export const Sub: React.FC<{f: number; at: number; text: string; x: number; y: number; size?: number; color?: string}> =
  ({f, at, text, x, y, size = 40, color = C.grey}) => {
    const p = ease(f, at, at + 10, outQuint);
    if (p <= 0) return null;
    return <div style={{position: "absolute", left: x, top: y + (1 - p) * 20, transform: "translate(-50%, -50%)", opacity: p, fontFamily: F.sans, fontWeight: 800,
      fontSize: size, color, letterSpacing: 2, whiteSpace: "nowrap", textTransform: "uppercase"}}>{text}</div>;
  };

/** Black shot with big serif words (word by word), slow pull-out. */
export const Words: React.FC<{f: number; d: number; text: string; at?: number; mark?: string[]; markAt?: number; size?: number; y?: number; chip?: string;
  italic?: boolean; color?: string; children?: React.ReactNode}> =
  ({f, d, text, at = 2, mark = [], markAt, size = 170, y = 540, chip, italic, color, children}) => {
    const s = (1.07 - 0.07 * ease(f, 0, d, outCubic)) * (1 + 0.4 * (1 - outCubic(clamp01(f / 20))));
    return (
      <AbsoluteFill>
        <InkSurface glow={0.08}/>
        <AbsoluteFill style={{transform: `scale(${s})`}}>
          <BigWord f={f} at={at} text={text} x={960} y={y} size={size} stagger={5} mark={mark} markAt={markAt} italic={italic} color={color}/>
          {children}
        </AbsoluteFill>
        {chip ? <SourceTag f={f} at={0} text={chip} dark/> : null}
        <Finish f={f} dark/>
      </AbsoluteFill>
    );
  };

// =====================================================================================================
// retyped document page (letters, our articles, company and government documents)
// =====================================================================================================
/** A run of text; marks animate with a CSS highlighter that wipes across line breaks like one pen stroke. */
export type Seg = string | {t: string; hl?: number; hlDur?: number; circle?: number; ul?: number; bold?: boolean};
export type Para = {segs: Seg[]; indent?: boolean; focus?: boolean};

const HL: React.FC<{f: number; s: Exclude<Seg, string>; fs: number}> = ({f, s, fs}) => {
  const p = s.hl != null ? ease(f, s.hl, s.hl + (s.hlDur ?? Math.max(10, s.t.length * 0.45)), inOut) : 0;
  const u = s.ul != null ? ease(f, s.ul, s.ul + 10, outCubic) : 0;
  return (
    <span style={{position: "relative", backgroundImage: `linear-gradient(90deg, ${C.highlight}, ${C.highlight})`, backgroundRepeat: "no-repeat",
      backgroundSize: `${(p * 100).toFixed(2)}% 82%`, backgroundPosition: "0 70%", fontWeight: s.bold ? 800 : undefined,
      textDecoration: u > 0 ? "underline" : undefined, textDecorationColor: C.markerRed, textDecorationThickness: fs * 0.12 * u, textUnderlineOffset: fs * 0.18}}>
      {s.t}
      {s.circle != null ? (
        <svg style={{position: "absolute", left: -fs * 0.4, top: -fs * 0.35, overflow: "visible", pointerEvents: "none"}} width={1} height={1}>
          <MarkerCircle f={f} at={s.circle} rect={[0, 0, s.t.length * fs * 0.6 + fs * 0.8, fs * 1.6]} width={fs * 0.12} padX={0.08} padY={0.2}/>
        </svg>
      ) : null}
    </span>
  );
};

export const TypedPage: React.FC<{f: number; paras: Para[]; x?: number; y?: number; width?: number; size?: number; rot?: number;
  font?: "letter" | "article"; head?: string; title?: string; date?: string; enter?: number; stack?: number; focusAt?: number; pad?: number}> =
  ({f, paras, x = 960, y = 540, width = 1420, size = 40, rot = -0.8, font = "letter", head, title, date, enter, stack = 2, focusAt, pad = 70}) => {
    let dy = 0, o = 1, blurE = 0;
    if (enter != null) {
      if (f < enter) return null;
      const p = outQuint(clamp01((f - enter) / 12)); dy = 900 * (1 - p); blurE = 14 * (1 - p); o = 1;
    }
    const fb = focusAt != null ? 2.4 * ease(f, focusAt, focusAt + 16, inOut) : 0;
    const body = font === "letter" ? {fontFamily: "'Courier New', Courier, monospace", fontWeight: 700, fontSize: size, lineHeight: 1.42, color: "#1A1714"}
      : {fontFamily: F.sans, fontWeight: 500, fontSize: size, lineHeight: 1.5, color: "#23201C"};
    return (
      <div style={{position: "absolute", left: x - width / 2, top: y, width, transform: `translate(0, -50%) translateY(${dy}px) rotate(${rot}deg)`, opacity: o,
        filter: blurE > 0.5 ? `blur(${blurE}px)` : undefined}}>
        {Array.from({length: stack}).map((_, i) => {
          const j = stack - i;
          return <div key={i} style={{position: "absolute", inset: 0, transform: `translate(${j * 10}px, ${j * 8}px) rotate(${(j % 2 ? 1 : -1) * (0.7 + j * 0.5)}deg)`,
            background: C.paperDeep, filter: `brightness(${1 - j * 0.06})`, boxShadow: "0 8px 22px rgba(30,20,10,0.22)"}}/>;
        })}
        <div style={{position: "relative", background: "#FBF8F1", padding: `${pad * 0.8}px ${pad}px ${pad}px`, boxShadow: "0 2px 3px rgba(30,20,10,0.18), 0 16px 34px rgba(30,20,10,0.26)"}}>
          {head ? <div style={{fontFamily: F.mono, fontSize: size * 0.5, letterSpacing: 2, color: C.grey, textTransform: "uppercase", marginBottom: size * 0.6}}>{head}</div> : null}
          {title ? <div style={{fontFamily: F.serif, fontSize: size * 1.55, lineHeight: 1.08, color: C.ink, marginBottom: size * 0.3}}>{title}</div> : null}
          {date ? <div style={{fontFamily: F.mono, fontSize: size * 0.5, letterSpacing: 1.5, color: C.markerRed, marginBottom: size * 0.7}}>{date}</div> : null}
          {paras.map((pa, i) => (
            <div key={i} style={{...body, textIndent: pa.indent ? size * 2.4 : 0, marginBottom: size * 0.7, filter: fb > 0.1 && !pa.focus ? `blur(${fb}px)` : undefined,
              opacity: fb > 0.1 && !pa.focus ? 1 - fb * 0.08 : 1}}>
              {pa.segs.map((s, k) => (typeof s === "string" ? <React.Fragment key={k}>{s}</React.Fragment> : <HL key={k} f={f} s={s} fs={size}/>))}
            </div>
          ))}
          <div style={{position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.10), rgba(0,0,0,0) 40%, rgba(60,40,20,0.07))", pointerEvents: "none"}}/>
        </div>
      </div>
    );
  };

// =====================================================================================================
// chapter card (short moment: the searched question, then gone)
// =====================================================================================================
export const ChapterQ: React.FC<{f: number; d: number; n: number; q: string; icon?: IconName}> = ({f, d, n, q, icon = "castle"}) => {
  const k = ease(f, 0, 12, outQuint), w = ease(f, 5, 19, outQuint), u = ease(f, 20, 32, inOut);
  const pull = 1 + 0.4 * (1 - outCubic(clamp01(f / 22)));
  return (
    <AbsoluteFill style={{transform: `scale(${pull})`}}>
      <Paper drift={f / d}/>
      <AbsoluteFill style={{opacity: 0.1, transform: `scale(${1 + 0.03 * clamp01(f / d)})`}}>
        {Array.from({length: 32}).map((_, i) => {
          const col = i % 8, row = Math.floor(i / 8);
          return <div key={i} style={{position: "absolute", left: 60 + col * 250 + (row % 2) * 125 - f * 0.7, top: 70 + row * 260}}>
            <Icon name={icon} size={110} color={C.ink}/></div>;
        })}
      </AbsoluteFill>
      <div style={{position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 40, letterSpacing: 8,
        color: C.markerRed, opacity: k}}>CHAPTER {n}</div>
      <div style={{position: "absolute", left: 160, right: 160, top: 400, height: 330, overflow: "hidden", textAlign: "center"}}>
        <div style={{fontFamily: F.serif, fontSize: q.length > 20 ? 122 : 150, lineHeight: 1.06, color: C.ink, transform: `translateY(${(1 - w) * 330}px)`, textWrap: "balance"} as React.CSSProperties}>{q}</div>
      </div>
      <div style={{position: "absolute", left: 960 - 360, top: 760, width: 720, height: 22, background: C.highlight, transform: `scaleX(${u})`, transformOrigin: "0 50%",
        mixBlendMode: "multiply"}}/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// =====================================================================================================
// icons (drawn in code, ink on paper)
// =====================================================================================================
export type IconName = "coin" | "badge" | "lock" | "crowd" | "stamp" | "castle" | "shop" | "gear" | "tag" | "thermo" | "eye" | "bottle" | "tin" | "crate"
  | "phone" | "bank" | "plant" | "factory" | "depot" | "shovel" | "plane" | "star" | "person" | "house" | "bolt" | "doc" | "locker" | "wall" | "warn" | "calendar" | "mill";
export const Icon: React.FC<{name: IconName; size?: number; color?: string; fill?: string; sw?: number}> = ({name, size = 120, color = C.ink, fill = "none", sw = 7}) => {
  const P = {fill, stroke: color, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const};
  const S = {fill: color, stroke: "none"};
  const g = (() => {
    switch (name) {
      case "coin": return <><circle cx={50} cy={50} r={36} {...P}/><path d="M 50 30 L 50 70 M 40 38 Q 50 30 60 38 Q 60 48 50 50 Q 40 52 40 62 Q 50 70 60 62" {...P} strokeWidth={sw * 0.8}/></>;
      case "badge": return <><circle cx={50} cy={40} r={26} {...P}/><path d="M 36 60 L 28 92 L 50 80 L 72 92 L 64 60" {...P}/><path d="M 40 40 L 47 47 L 61 33" {...P}/></>;
      case "lock": return <><rect x={22} y={44} width={56} height={44} rx={6} {...P}/><path d="M 34 44 L 34 30 Q 34 14 50 14 Q 66 14 66 30 L 66 44" {...P}/><circle cx={50} cy={64} r={5} {...S}/></>;
      case "crowd": return <><circle cx={50} cy={30} r={12} {...P}/><path d="M 30 80 Q 30 52 50 52 Q 70 52 70 80" {...P}/><circle cx={20} cy={40} r={9} {...P}/><path d="M 6 80 Q 6 58 20 58" {...P}/><circle cx={80} cy={40} r={9} {...P}/><path d="M 94 80 Q 94 58 80 58" {...P}/></>;
      case "stamp": return <><path d="M 38 14 L 62 14 L 58 48 L 76 54 L 76 68 L 24 68 L 24 54 L 42 48 Z" {...P}/><path d="M 18 84 L 82 84" {...P}/></>;
      case "castle": return <path d="M 12 88 L 12 40 L 20 40 L 20 32 L 28 32 L 28 40 L 36 40 L 36 22 L 44 22 L 44 30 L 56 30 L 56 22 L 64 22 L 64 40 L 72 40 L 72 32 L 80 32 L 80 40 L 88 40 L 88 88 Z M 42 88 L 42 66 Q 50 56 58 66 L 58 88" {...P}/>;
      case "shop": return <><path d="M 14 40 L 22 16 L 78 16 L 86 40 Z" {...P}/><path d="M 14 40 Q 23 52 32 40 Q 41 52 50 40 Q 59 52 68 40 Q 77 52 86 40" {...P}/><path d="M 20 48 L 20 88 L 80 88 L 80 48 M 40 88 L 40 62 L 60 62 L 60 88" {...P}/></>;
      case "gear": return <><circle cx={50} cy={50} r={16} {...P}/>{Array.from({length: 8}).map((_, i) => { const a = (i * Math.PI) / 4; return <path key={i} d={`M ${50 + Math.cos(a) * 26} ${50 + Math.sin(a) * 26} L ${50 + Math.cos(a) * 38} ${50 + Math.sin(a) * 38}`} {...P} strokeWidth={sw * 1.6}/>; })}<circle cx={50} cy={50} r={28} {...P}/></>;
      case "tag": return <><path d="M 14 50 L 40 20 L 86 20 L 86 80 L 40 80 Z" {...P}/><circle cx={34} cy={50} r={6} {...P}/></>;
      case "thermo": return <><path d="M 42 64 L 42 16 Q 50 8 58 16 L 58 64" {...P}/><circle cx={50} cy={74} r={14} {...P}/><circle cx={50} cy={74} r={8} {...S}/><path d="M 50 70 L 50 56" {...P}/></>;
      case "eye": return <><path d="M 8 50 Q 50 10 92 50 Q 50 90 8 50 Z" {...P}/><circle cx={50} cy={50} r={13} {...S}/></>;
      case "bottle": return <path d="M 42 8 L 58 8 L 58 22 Q 70 32 68 50 Q 66 62 68 74 Q 70 92 50 92 Q 30 92 32 74 Q 34 62 32 50 Q 30 32 42 22 Z" {...P}/>;
      case "tin": return <><path d="M 22 24 L 22 82 Q 50 94 78 82 L 78 24" {...P}/><ellipse cx={50} cy={24} rx={28} ry={9} {...P}/><path d="M 34 16 Q 50 2 66 16" {...P}/></>;
      case "crate": return <><rect x={10} y={22} width={80} height={64} {...P}/><path d="M 10 43 L 90 43 M 10 64 L 90 64 M 24 22 L 24 86 M 76 22 L 76 86" {...P} strokeWidth={sw * 0.7}/></>;
      case "phone": return <><rect x={28} y={8} width={44} height={84} rx={8} {...P}/><path d="M 44 80 L 56 80" {...P}/></>;
      case "bank": return <><path d="M 10 36 L 50 12 L 90 36 Z" {...P}/><path d="M 22 42 L 22 76 M 40 42 L 40 76 M 60 42 L 60 76 M 78 42 L 78 76 M 10 86 L 90 86" {...P}/></>;
      case "plant": return <><path d="M 14 88 L 14 52 L 40 52 L 40 30 L 54 30 L 54 52 L 86 52 L 86 88 Z" {...P}/><path d="M 66 22 L 58 40 L 70 40 L 62 58" {...P}/></>;
      case "factory": return <><path d="M 10 88 L 10 46 L 32 58 L 32 46 L 54 58 L 54 46 L 76 58 L 76 18 L 90 18 L 90 88 Z" {...P}/></>;
      case "mill": return <><path d="M 8 88 L 8 50 L 30 34 L 52 50 L 74 34 L 92 46 L 92 88 Z" {...P}/><path d="M 20 64 L 30 64 M 42 64 L 52 64 M 64 64 L 74 64 M 72 34 L 72 10 L 82 10 L 82 40" {...P}/></>;
      case "depot": return <><path d="M 10 88 L 10 40 L 50 16 L 90 40 L 90 88 Z" {...P}/><rect x={30} y={56} width={40} height={32} {...P}/><path d="M 30 66 L 70 66 M 30 76 L 70 76" {...P} strokeWidth={sw * 0.6}/></>;
      case "shovel": return <><path d="M 50 8 L 50 60" {...P}/><path d="M 40 8 L 60 8" {...P}/><path d="M 34 58 L 66 58 L 64 80 Q 50 96 36 80 Z" {...P}/></>;
      case "plane": return <><path d="M 6 56 Q 6 46 18 46 L 80 46 L 92 26 L 98 26 L 96 46 Q 100 52 94 58 L 18 64 Q 6 64 6 56 Z" {...P}/><path d="M 40 52 L 58 52 L 46 80 L 36 80 Z M 44 46 L 56 30 L 64 30 L 58 46" {...P}/><path d="M 14 52 L 20 52 M 26 51 L 32 51" {...P} strokeWidth={sw * 0.6}/></>;
      case "star": return <path d="M 50 8 L 61 38 L 92 38 L 67 57 L 77 88 L 50 70 L 23 88 L 33 57 L 8 38 L 39 38 Z" {...P}/>;
      case "person": return <><circle cx={50} cy={26} r={16} {...S}/><path d="M 24 92 L 24 64 Q 24 46 50 46 Q 76 46 76 64 L 76 92 Z" {...S}/></>;
      case "house": return <><path d="M 12 48 L 50 16 L 88 48" {...P}/><path d="M 22 42 L 22 88 L 78 88 L 78 42 M 42 88 L 42 64 L 58 64 L 58 88" {...P}/></>;
      case "bolt": return <path d="M 58 6 L 26 54 L 48 54 L 40 94 L 74 42 L 52 42 Z" {...P}/>;
      case "doc": return <><path d="M 22 8 L 64 8 L 80 24 L 80 92 L 22 92 Z" {...P}/><path d="M 34 40 L 68 40 M 34 54 L 68 54 M 34 68 L 58 68" {...P} strokeWidth={sw * 0.7}/></>;
      case "locker": return <><rect x={16} y={10} width={68} height={80} rx={4} {...P}/><circle cx={50} cy={48} r={14} {...P}/><path d="M 50 48 L 58 42" {...P}/><path d="M 30 82 L 70 82" {...P}/></>;
      case "wall": return <><path d="M 8 86 L 92 86 L 92 30 L 8 30 Z" {...P}/><path d="M 8 49 L 92 49 M 8 68 L 92 68 M 36 30 L 36 49 M 64 30 L 64 49 M 22 49 L 22 68 M 50 49 L 50 68 M 78 49 L 78 68 M 36 68 L 36 86 M 64 68 L 64 86" {...P} strokeWidth={sw * 0.7}/></>;
      case "warn": return <><path d="M 50 10 L 92 86 L 8 86 Z" {...P}/><path d="M 50 36 L 50 60" {...P}/><circle cx={50} cy={73} r={4} {...S}/></>;
      case "calendar": return <><rect x={12} y={18} width={76} height={70} rx={6} {...P}/><path d="M 12 38 L 88 38 M 32 10 L 32 26 M 68 10 L 68 26" {...P}/></>;
    }
  })();
  return <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: "visible", display: "block"}}>{g}</svg>;
};

/** An icon on a white round "sticker" disc that pops in (piece grammar). */
export const IconDisc: React.FC<{f: number; at: number; name: IconName; x: number; y: number; size?: number; color?: string; bg?: string; rot?: number; dim?: number}> =
  ({f, at, name, x, y, size = 150, color = C.ink, bg = C.white, rot = 0, dim = 0}) => {
    const pose = piecePose(f, {at, mode: "pop", rot0: -14});
    if (!pose) return null;
    return (
      <div style={{position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", background: bg,
        transform: `translate(${pose.dx}px, ${pose.dy}px) rotate(${rot + pose.r}deg) scale(${pose.s})`, opacity: pose.o * (1 - dim * 0.6),
        boxShadow: "0 3px 4px rgba(30,20,10,0.2), 0 14px 26px rgba(30,20,10,0.25)", display: "flex", alignItems: "center", justifyContent: "center",
        filter: dim > 0 ? `grayscale(${dim})` : undefined}}>
        <Icon name={name} size={size * 0.62} color={color}/>
      </div>
    );
  };

/** The five kinds as a strip; `lit` index glows yellow (shown briefly at the start of each kind, not on every frame). */
export const KINDS: IconName[] = ["coin", "badge", "lock", "crowd", "stamp"];
export const MiniStrip: React.FC<{f: number; at: number; lit: number; x?: number; y?: number; out?: number}> = ({f, at, lit, x = 960, y = 140, out}) => {
  const p = ease(f, at, at + 10, outQuint) * (out != null ? 1 - ease(f, out, out + 8) : 1);
  if (p <= 0) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) translateY(${(1 - p) * -60}px)`, opacity: p, display: "flex", gap: 22,
      background: "rgba(251,248,241,0.95)", padding: "14px 22px", boxShadow: "0 8px 22px rgba(30,20,10,0.22)"}}>
      {KINDS.map((k, i) => (
        <div key={k} style={{width: 92, height: 92, borderRadius: "50%", background: i === lit ? C.highlight : "transparent", display: "flex", alignItems: "center",
          justifyContent: "center", transform: `scale(${i === lit ? 1 + 0.12 * spr(f, at + 6, 9, 220) : 0.92})`, opacity: i === lit ? 1 : 0.35}}>
          <Icon name={k} size={64}/>
        </div>
      ))}
    </div>
  );
};

/** Yellow sticky note (open loop) that pins into a corner; `unpin` flies it to the centre and away. */
export const StickyNote: React.FC<{f: number; at: number; text: string; unpin?: number; x?: number; y?: number}> = ({f, at, text, unpin, x = 1690, y = 170}) => {
  if (f < at) return null;
  const s = spr(f, at, 12, 170);
  let dx = 0, dy = 0, sc = 0.6 + 0.4 * s, r = 4 - 10 * (1 - s), o = clamp01(s * 3);
  if (unpin != null && f >= unpin) {
    const u = ease(f, unpin, unpin + 18, inOut);
    dx = (960 - x) * u; dy = (540 - y) * u; sc *= 1 + 0.8 * u; r = 4 - 6 * u;
    o *= 1 - ease(f, unpin + 22, unpin + 32);
  }
  if (o <= 0.01) return null;
  return (
    <div style={{position: "absolute", left: x + dx, top: y + dy, transform: `translate(-50%, -50%) rotate(${r}deg) scale(${sc * 0.8})`, opacity: o, width: 290, padding: "26px 20px 22px",
      background: "linear-gradient(170deg, #FFF36B, #FBE54A)", boxShadow: "0 3px 3px rgba(0,0,0,0.18), 0 16px 26px rgba(0,0,0,0.25)", textAlign: "center",
      fontFamily: F.marker, fontSize: 44, color: C.ink, lineHeight: 1.05}}>
      <div style={{position: "absolute", left: 125, top: -12, width: 40, height: 22, background: "rgba(230,220,190,0.8)", transform: "rotate(-4deg)"}}/>
      {text}
    </div>
  );
};

// =====================================================================================================
// castle (code-drawn cut-out), moat water, attackers, rivals, painted cloth, siege arrows
// =====================================================================================================
export const Castle: React.FC<{f: number; x?: number; y?: number; s?: number; water?: number; painted?: boolean; wide?: number; tone?: string; glow?: number;
  ripple?: number; level?: number}> =
  ({f, x = 960, y = 560, s = 1, water = 1, painted, wide = 1, tone = "#3B342C", glow = 0, ripple = 0, level = 1}) => {
    const rx = 520 * wide, ry = 150 * wide;
    const bob = Math.sin(f * 0.12) * 4;
    return (
      <div style={{position: "absolute", left: x, top: y, width: 0, height: 0, transform: `scale(${s})`}}>
        <svg width={1400} height={900} viewBox="-700 -520 1400 900" style={{position: "absolute", left: -700, top: -520, overflow: "visible"}}>
          <defs>
            <pattern id="ht" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="1.5" fill="rgba(0,0,0,0.35)"/></pattern>
            <linearGradient id="wat" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#5C8FB8"/><stop offset="1" stopColor="#2E5F8C"/></linearGradient>
          </defs>
          {/* ground mound */}
          <ellipse cx={0} cy={210} rx={rx + 140} ry={ry + 70} fill="#CDBE9C"/>
          {/* moat: an empty ditch, then water fills it (clip wipe) */}
          <ellipse cx={0} cy={210} rx={rx} ry={ry} fill="#8D7A5C"/>
          <clipPath id="wclip"><rect x={-rx - 10} y={-200} width={(2 * rx + 20) * water} height={700}/></clipPath>
          <g clipPath="url(#wclip)">
            {painted ? (
              <g>
                <ellipse cx={0} cy={210} rx={rx} ry={ry} fill="#4F86C6"/>
                {Array.from({length: 9}).map((_, i) => <path key={i} d={`M ${-rx + i * rx * 0.25} ${110} q 30 100 0 200`} stroke="rgba(255,255,255,0.35)" strokeWidth={6} fill="none"/>)}
                {[[-rx * 0.8, 130], [rx * 0.8, 130], [-rx * 0.4, 330], [rx * 0.4, 330]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={9} fill="#C9A85E" stroke="#5A4520" strokeWidth={3}/>)}
              </g>
            ) : (
              <g>
                <ellipse cx={0} cy={210} rx={rx * (0.86 + 0.14 * level)} ry={ry * (0.86 + 0.14 * level)} fill="url(#wat)"/>
                {Array.from({length: 7}).map((_, i) => <path key={i} d={`M ${-rx * 0.75 + i * rx * 0.25} ${210 + (i % 2 ? -ry * 0.5 : ry * 0.45) + bob} q 20 -10 40 0 q 20 10 40 0`}
                  stroke="rgba(255,255,255,0.55)" strokeWidth={5} fill="none" strokeLinecap="round"/>)}
                {ripple > 0 ? <ellipse cx={0} cy={210} rx={rx * (1 + 0.04 * ripple)} ry={ry * (1 + 0.06 * ripple)} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={6 * ripple}/> : null}
              </g>
            )}
          </g>
          {/* inner island */}
          <ellipse cx={0} cy={200} rx={rx * 0.62} ry={ry * 0.58} fill="#B9A984"/>
          {glow > 0 ? <ellipse cx={0} cy={120} rx={260} ry={150} fill="#FFE45C" opacity={0.45 * glow} filter="blur(20px)"/> : null}
          {/* castle silhouette */}
          <path d="M -230 210 L -230 -20 L -200 -20 L -200 -50 L -175 -50 L -175 -20 L -150 -20 L -150 -50 L -125 -50 L -125 -20 L -100 -20 L -100 -140 L -88 -140 L -88 -165 L -68 -165 L -68 -140 L -48 -140 L -48 -165 L -28 -165 L -28 -140 L -10 -140 L 0 -200 L 10 -140 L 28 -140 L 28 -165 L 48 -165 L 48 -140 L 68 -140 L 68 -165 L 88 -165 L 88 -140 L 100 -140 L 100 -20 L 125 -20 L 125 -50 L 150 -50 L 150 -20 L 175 -20 L 175 -50 L 200 -50 L 200 -20 L 230 -20 L 230 210 Z"
            fill={tone}/>
          <path d="M -230 210 L -230 -20 L 230 -20 L 230 210 Z" fill="url(#ht)" opacity={0.6}/>
          <path d="M -40 210 L -40 120 Q 0 80 40 120 L 40 210 Z" fill="#1C1814"/>
          {[-170, 170, -60, 60].map((wx, i) => <rect key={i} x={wx - 9} y={i < 2 ? 40 : -90} width={18} height={34} rx={9} fill={glow > 0 ? "#FFD84A" : "#1C1814"}/>)}
        </svg>
      </div>
    );
  };

/** Small ink figures that march toward the castle and bounce off the water's edge (spring). */
export const Attackers: React.FC<{f: number; at: number; x?: number; y?: number; n?: number; cross?: boolean; color?: string}> = ({f, at, x = 960, y = 560, n = 6, cross, color = C.markerRed}) => {
  if (f < at) return null;
  return (
    <>
      {Array.from({length: n}).map((_, i) => {
        const side = i % 2 ? 1 : -1, row = Math.floor(i / 2);
        const t0 = at + i * 3, k = clamp01((step(f, 2) - t0) / 30);
        const edge = 590, start = 1080;
        let px: number;
        if (cross) px = side * (start - (start + 120) * k);
        else {
          const hit = clamp01((step(f, 2) - t0 - 30) / 1);
          const bounce = hit > 0 ? spr(f, t0 + 30, 7, 180) : 0;
          px = side * (start - (start - edge) * k + bounce * 70 * (1 - clamp01((f - t0 - 30) / 30)));
        }
        if (f < t0) return null;
        return <div key={i} style={{position: "absolute", left: x + px - 26, top: y + 140 + row * 70 - 60, transform: `scaleX(${-side})`}}><Icon name="person" size={58} color={color}/></div>;
      })}
    </>
  );
};

/** Siege arrows drawing in from the four edges toward a point. */
export const SiegeArrows: React.FC<{f: number; at: number; x?: number; y?: number; n?: number; thick?: number}> = ({f, at, x = 960, y = 480, n = 8, thick = 0}) => (
  <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
    {Array.from({length: n}).map((_, i) => {
      const a = (i / n) * Math.PI * 2 + 0.3, R0 = 1100, R1 = 330;
      const x0 = x + Math.cos(a) * R0, y0 = y + Math.sin(a) * R0 * 0.62, x1 = x + Math.cos(a) * R1, y1 = y + Math.sin(a) * R1 * 0.62;
      const p = ease(f, at + i * 4, at + i * 4 + 20, outCubic);
      if (p <= 0) return null;
      const ex = x0 + (x1 - x0) * p, ey = y0 + (y1 - y0) * p, ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
      return <g key={i}>
        <line x1={x0} y1={y0} x2={ex} y2={ey} stroke={C.markerRed} strokeWidth={10 + 6 * thick} strokeLinecap="round"/>
        <path d="M -26 -20 L 8 0 L -26 20 Z" fill={C.markerRed} transform={`translate(${ex} ${ey}) rotate(${ang})`}/>
      </g>;
    })}
  </svg>
);

// =====================================================================================================
// charts on black
// =====================================================================================================
/** Two bars with their own timings (key bar yellow), honest scale, optional bracket over the difference. */
export const TwoBars: React.FC<{f: number; title: string; source: string; a: {label: string; v: number; txt: string; at: number; key?: boolean};
  b: {label: string; v: number; txt: string; at: number; key?: boolean}; max: number; bracket?: {at: number; txt: string}; box?: {x: number; y: number; w: number; h: number}}> =
  ({f, title, source, a, b, max, bracket, box = {x: 520, y: 330, w: 880, h: 520}}) => {
    const bars = [a, b];
    const bw = 230, slot = box.w / 2;
    const top = (v: number) => box.y + box.h - (v / max) * box.h;
    const tp = ease(f, 0, 12, outQuint);
    return (
      <>
        <div style={{position: "absolute", left: box.x - 20, top: 110, fontFamily: F.serif, fontSize: 88, color: C.white, opacity: tp, transform: `translateY(${(1 - tp) * 30}px)`}}>{title}</div>
        <div style={{position: "absolute", left: box.x - 16, top: 218, fontFamily: F.mono, fontSize: 22, color: "#9C968C", letterSpacing: 3, textTransform: "uppercase", opacity: tp}}>{source}</div>
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <line x1={box.x - 30} x2={box.x + box.w + 30} y1={box.y + box.h} y2={box.y + box.h} stroke="rgba(255,255,255,0.75)" strokeWidth={3}/>
          {bars.map((r, i) => {
            const g = ease(f, r.at, r.at + 30, (t) => 1 - Math.pow(1 - t, 4));
            if (g <= 0) return null;
            const cx = box.x + slot * (i + 0.5), t = top(r.v * g);
            return <rect key={i} x={cx - bw / 2} y={t} width={bw} height={Math.max(3, box.y + box.h - t)} fill={r.key ? C.highlightPrint : C.chartBlue}/>;
          })}
          {bracket && f >= bracket.at ? (() => {
            const p = ease(f, bracket.at, bracket.at + 12, outCubic);
            const xA = box.x + slot * 0.5 + bw / 2 + 30, xB = box.x + slot * 1.5 - bw / 2 - 30, yA = top(a.v), yB = top(b.v);
            return <path d={`M ${xA} ${yA} L ${xA + 30} ${yA} L ${xA + 30} ${yB} L ${xB} ${yB}`} fill="none" stroke={C.markerRed} strokeWidth={8} strokeLinecap="round"
              pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}/>;
          })() : null}
        </svg>
        {bars.map((r, i) => {
          const g = ease(f, r.at, r.at + 30, (t) => 1 - Math.pow(1 - t, 4));
          const cx = box.x + slot * (i + 0.5);
          const lp = ease(f, r.at - 4, r.at + 6, outQuint);
          return (
            <React.Fragment key={i}>
              <div style={{position: "absolute", left: cx, top: box.y + box.h + 50, transform: "translate(-50%, -50%)", opacity: lp, fontFamily: F.sans, fontWeight: 700,
                fontSize: 34, color: "#CFC9BE", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 1}}>{r.label}</div>
              {g > 0 ? <div style={{position: "absolute", left: cx, top: top(r.v * g) - 56, transform: "translate(-50%, -50%)", fontFamily: F.serif, fontSize: r.key ? 86 : 72,
                color: r.key ? C.highlightPrint : C.white, whiteSpace: "nowrap"}}>{g > 0.98 ? r.txt : r.v >= 1000 ? "$" + Math.round(r.v * g).toLocaleString("en-US") : (r.v * g).toFixed(1)}</div> : null}
            </React.Fragment>
          );
        })}
        {bracket && f >= bracket.at ? (
          <div style={{position: "absolute", left: box.x + slot - 10, top: (top(a.v) + top(b.v)) / 2, transform: "translate(-50%, -50%)", fontFamily: F.marker, fontSize: 64,
            color: C.markerRed, opacity: ease(f, bracket.at + 8, bracket.at + 16)}}>{bracket.txt}</div>
        ) : null}
      </>
    );
  };

/** 10 x N pictogram grid; the first `fill` icons turn colour one after another (1 tick each). */
export const PictoGrid: React.FC<{f: number; icon: IconName; n: number; fill: number; at: number; x?: number; y?: number; cell?: number; color?: string; base?: string; cols?: number;
  addFrom?: number; addAt?: number}> =
  ({f, icon, n, fill, at, x = 960, y = 600, cell = 62, color = C.markerRed, base = "rgba(255,255,255,0.28)", cols = 10, addFrom, addAt}) => {
    const rows = Math.ceil(n / cols), w = cols * cell, h = rows * cell;
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h}}>
        {Array.from({length: n}).map((_, i) => {
          const col = i % cols, row = Math.floor(i / cols);
          const isAdd = addFrom != null && i >= addFrom;
          if (isAdd && addAt != null && f < addAt + (i - addFrom!) * 0.6) return null;
          const on = !isAdd && i < fill && f >= at + i * 0.9;
          const pop = isAdd && addAt != null ? spr(f, addAt + (i - addFrom!) * 0.6, 10, 220) : 1;
          return <div key={i} style={{position: "absolute", left: col * cell, top: row * cell, transform: `scale(${pop})`}}>
            <Icon name={icon} size={cell * 0.86} color={isAdd ? C.highlightPrint : on ? color : base} fill={on || isAdd ? (isAdd ? "rgba(255,232,26,0.35)" : "rgba(224,36,94,0.35)") : "none"} sw={8}/></div>;
        })}
      </div>
    );
  };

/** Ring chart: fills from `from` to `to` (percent) between at and at+dur. */
export const Ring: React.FC<{f: number; x?: number; y?: number; r?: number; from: number; to: number; at: number; dur?: number; label?: string}> =
  ({f, x = 960, y = 560, r = 230, from, to, at, dur = 36, label}) => {
    const v = from + (to - from) * ease(f, at, at + dur, (t) => 1 - Math.pow(1 - t, 3));
    const L = 2 * Math.PI * r;
    return (
      <>
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <circle cx={x} cy={y} r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={58}/>
          <circle cx={x} cy={y} r={r} fill="none" stroke={C.highlightPrint} strokeWidth={58} strokeDasharray={`${(L * v) / 100} ${L}`} transform={`rotate(-90 ${x} ${y})`}/>
        </svg>
        <div style={{position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", fontFamily: F.serif, fontSize: 130, color: C.white, whiteSpace: "nowrap"}}>
          {v < 0.05 ? "0" : v.toFixed(Math.abs(to - Math.round(to)) > 0.01 ? 1 : 0)}<span style={{fontSize: 70}}>%</span></div>
        {label ? <div style={{position: "absolute", left: x, top: y + r + 80, transform: "translate(-50%, -50%)", fontFamily: F.mono, fontSize: 30, color: "#CFC9BE",
          letterSpacing: 3, whiteSpace: "nowrap"}}>{label}</div> : null}
      </>
    );
  };

// =====================================================================================================
// people, crowd, street, places
// =====================================================================================================
/** Faceless figure (flat icon). */
export const Fig: React.FC<{x: number; y: number; s?: number; color?: string; lift?: number; star?: boolean; dim?: number}> = ({x, y, s = 1, color = "#3E3730", lift = 0, star, dim = 0}) => (
  <div style={{position: "absolute", left: x - 40 * s, top: y - 150 * s - lift, width: 80 * s, height: 150 * s, opacity: 1 - dim * 0.5}}>
    <svg width={80 * s} height={150 * s} viewBox="0 0 80 150" style={{overflow: "visible"}}>
      <circle cx={40} cy={26} r={21} fill={color}/>
      <path d="M 8 150 L 8 86 Q 8 52 40 52 Q 72 52 72 86 L 72 150 Z" fill={color}/>
      {star ? <g transform="translate(40 96) scale(0.34) translate(-50 -50)"><path d="M 50 8 L 61 38 L 92 38 L 67 57 L 77 88 L 50 70 L 23 88 L 33 57 L 8 38 L 39 38 Z" fill="#F2C230" stroke="#8A6A10" strokeWidth={4}/></g> : null}
    </svg>
  </div>
);

/** Flat shop front (code-drawn, no brand). */
export const ShopFront: React.FC<{x: number; y: number; w?: number; h?: number; sign?: string; color?: string; awning?: string; signFlip?: number}> =
  ({x, y, w = 440, h = 420, sign, color = "#E7DCC6", awning = "#C8452F", signFlip = 1}) => (
    <div style={{position: "absolute", left: x - w / 2, top: y - h, width: w, height: h}}>
      <div style={{position: "absolute", left: 0, top: 90, width: w, height: h - 90, background: color, boxShadow: "0 10px 26px rgba(30,20,10,0.25)"}}/>
      <div style={{position: "absolute", left: -14, top: 60, width: w + 28, height: 70, background: `repeating-linear-gradient(90deg, ${awning} 0 44px, #F6EFE2 44px 88px)`,
        clipPath: "polygon(0 0, 100% 0, 100% 70%, 95% 100%, 90% 70%, 85% 100%, 80% 70%, 75% 100%, 70% 70%, 65% 100%, 60% 70%, 55% 100%, 50% 70%, 45% 100%, 40% 70%, 35% 100%, 30% 70%, 25% 100%, 20% 70%, 15% 100%, 10% 70%, 5% 100%, 0 70%)"}}/>
      <div style={{position: "absolute", left: w * 0.1, top: 0, width: w * 0.8, height: 64, background: C.ink, color: C.white, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: F.sans, fontWeight: 900, fontSize: 34, letterSpacing: 2, transform: `perspective(600px) rotateX(${(1 - signFlip) * 90}deg)`}}>{sign ?? ""}</div>
      <div style={{position: "absolute", left: w * 0.36, top: h - 190, width: w * 0.28, height: 190, background: "#3A3129"}}/>
      <div style={{position: "absolute", left: w * 0.07, top: 180, width: w * 0.22, height: 120, background: "#BFD3DA", border: "6px solid #8E7E66"}}/>
      <div style={{position: "absolute", left: w * 0.71, top: 180, width: w * 0.22, height: 120, background: "#BFD3DA", border: "6px solid #8E7E66"}}/>
    </div>
  );

/** Gold particle firework burst at (x, y): bursts at `at`, fades out by `at + life`. */
export const Firework: React.FC<{f: number; at: number; x: number; y: number; life?: number; n?: number}> = ({f, at, x, y, life = 50, n = 64}) => {
  if (f < at - 14) return null;
  const rise = clamp01((f - (at - 14)) / 14);
  const t = clamp01((f - at) / life);
  return (
    <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      {f < at ? <circle cx={x} cy={y + 500 * (1 - rise)} r={8} fill="#FFD84A"/> : null}
      {f >= at ? Array.from({length: n}).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + random("fw" + i) * 0.2, sp = 260 + random("fs" + i) * 220;
        const px = x + Math.cos(a) * sp * Math.sqrt(t), py = y + Math.sin(a) * sp * Math.sqrt(t) + 160 * t * t;
        return <circle key={i} cx={px} cy={py} r={6 * (1 - t) + 1} fill={i % 3 ? "#FFD84A" : "#FF8A3D"} opacity={1 - t}/>;
      }) : null}
    </svg>
  );
};

/** Two-number flip card (e.g. a date). */
export const FlipCard: React.FC<{f: number; x: number; y: number; values: {top: string; big: string; at: number}[]; w?: number}> = ({f, x, y, values, w = 380}) => {
  let i = 0;
  for (let k = 0; k < values.length; k++) if (f >= values[k].at) i = k;
  const v = values[i], flip = i > 0 ? clamp01((f - values[i].at) / 8) : 1;
  return (
    <div style={{position: "absolute", left: x - w / 2, top: y - w * 0.6, width: w, height: w * 1.1, perspective: 1000}}>
      <div style={{position: "absolute", inset: 0, background: "#FBF8F1", boxShadow: "0 4px 4px rgba(0,0,0,0.18), 0 18px 34px rgba(0,0,0,0.25)",
        transform: `rotateX(${(1 - flip) * 80}deg)`, transformOrigin: "50% 0"}}>
        <div style={{height: w * 0.28, background: C.markerRed, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.sans,
          fontWeight: 900, fontSize: w * 0.13, letterSpacing: 4}}>{v.top}</div>
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: w * 0.82, fontFamily: F.serif, fontSize: w * 0.48, color: C.ink}}>{v.big}</div>
      </div>
    </div>
  );
};

/** Stepped wall that builds, crumbles and rebuilds (`cycles` times, faster each time). */
export const RebuildWall: React.FC<{f: number; at: number; x: number; y: number; cycles?: number}> = ({f, at, x, y, cycles = 3}) => {
  const ff = step(f, 2) - at;
  if (ff < 0) return null;
  let t = ff, len = 34, ph = 0;
  for (let c = 0; c < cycles; c++) { if (t < len) { ph = t / len; break; } t -= len; len *= 0.7; ph = 1; }
  const bricks = 15, built = ph < 0.6 ? Math.floor((ph / 0.6) * bricks) : bricks;
  const fall = ph >= 0.6 && ph < 1 ? (ph - 0.6) / 0.4 : 0;
  return (
    <div style={{position: "absolute", left: x - 230, top: y - 180, width: 460, height: 200}}>
      {Array.from({length: bricks}).map((_, i) => {
        if (i >= built) return null;
        const row = Math.floor(i / 5), col = i % 5;
        const dy = fall * (120 + random("wb" + i) * 200) * (row + 1) * 0.5, rot = fall * (random("wr" + i) - 0.5) * 90;
        return <div key={i} style={{position: "absolute", left: col * 90 + (row % 2) * 45 - 20, top: 140 - row * 60 + dy, width: 84, height: 54, background: "#A65A3A",
          border: "3px solid #6E3824", transform: `rotate(${rot}deg)`, opacity: 1 - fall * 0.6}}/>;
      })}
    </div>
  );
};

/** Two-number price tag (₹ in Inter) that flips from one value to another. */
export const RupeeTag: React.FC<{f: number; x: number; y: number; from: string; to: string; at: number; stampAt?: number; scale?: number}> = ({f, x, y, from, to, at, stampAt, scale = 1}) => {
  const flipped = f >= at, p = clamp01((f - (at - 5)) / 10);
  const rotY = p > 0 && p < 1 ? (p < 0.5 ? p * 180 : (p - 1) * 180) : 0;
  const txt = p < 0.5 ? from : to;
  const ang = 5 * Math.sin(f * 0.07 + x) + (flipped ? 8 * Math.exp(-(f - at) / 14) * Math.sin((f - at) * 0.3) : 0);
  const w = 360 * scale, h = 220 * scale;
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `rotate(${ang}deg)`, transformOrigin: "50% -60px"}}>
      <div style={{position: "absolute", left: -2, top: -70 * scale, width: 4, height: 70 * scale, background: "#A8987A"}}/>
      <div style={{position: "absolute", left: -w / 2, top: 0, width: w, height: h, transform: `perspective(1200px) rotateY(${rotY}deg)`,
        clipPath: "polygon(14% 0, 86% 0, 100% 22%, 100% 100%, 0 100%, 0 22%)", background: "linear-gradient(160deg, #F2DDA8, #E7CB89 60%, #DDBE77)",
        display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 20 * scale, boxSizing: "border-box"}}>
        <span style={{fontFamily: F.sans, fontWeight: 700, fontSize: 96 * scale, color: "#2A1C0E", marginRight: 4}}>₹</span>
        <span style={{fontFamily: F.serif, fontSize: 130 * scale, color: txt === to ? C.markerRed : "#2A1C0E"}}>{txt.replace("₹", "")}</span>
      </div>
      {stampAt != null ? <Stamp f={f} at={stampAt} text="CUT" x={w * 0.32} y={h * 0.9} size={54 * scale} rot={-12}/> : null}
    </div>
  );
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export {outBack};
