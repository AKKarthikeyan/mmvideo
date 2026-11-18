// A01 v4 cold open, "What Is a Moat? The $26 Loom That Explains It" (18 Oct 2026), Vox Motion+ kit.
// Narration = script.md v4.1 beats c01-c05 word for word (MiniMax speech-2.6-hd, English_Diligent_Man, one file per beat,
// public/voxplus/a01v4/vo/*_n.wav at -16 LUFS). Cut and event times are taken from the voiced files (sentence timings +
// silence detection), in seconds from the start of the film. 21 shots in 65.8 s (one every 3.1 s).
// Fixes from the kit demo: no "candy shop worth more than looms/factory" (the comparison is ONE STORE'S GOODWILL > what the
// machines sold for, $163,122 gross, with the two paper routes as the equal alternative); goodwill explained visually in c04
// (people who know and trust a name); no bars (price tags only); loom photo captioned "looms like these (photo: HAER/LoC)";
// every scene has content from its first frame.
import React from "react";
import {AbsoluteFill, Audio, Img, Sequence, random, useVideoConfig} from "remotion";
import {BigWord, PriceTag} from "./BigType";
import {Layer, camAt, CamKey} from "./Camera";
import {SourceTag} from "./Cards";
import {PhotoPrint, Sticker, StickerLabel, TornBlock, piecePose} from "./Collage";
import {DocPage, docPoint, docRectCentre} from "./DocPage";
import {Rect} from "./Marker";
import {Cue, MusicBed, SfxTrack} from "./Sound";
import {Finish, Halftone, InkSurface} from "./Texture";
import {useVoxFonts} from "./fonts";
import {C, F, H, V, W, clamp01, ease, inOut, outCubic, outQuint, shake, spr, step, tk2f, useTicks} from "./tokens";
import {MarkerText, Paper, SP, Series, Shot, Stamp, Tr, TT, layoutShots, tsec} from "./A01V4Parts";
import {BEAT, BEAT_DUR, VO_SUFFIX, W as warp} from "./a01v4Timing";

const fr = tsec;   // seconds -> ticks (1/30 s)
// Cues below are written in the 18 Oct film seconds; warp() maps them onto the tightened narration (pause fix).
export const useL = (s0: number) => (s: number) => fr(warp(s)) - s0;   // film second -> local tick

// ---------------- narration (start in s; lengths from ffprobe of the _n.wav files) ----------------
export const VO = ["c01", "c02", "c03", "c04", "c05"].map((k) => ({k, at: BEAT[k], len: BEAT_DUR[k]}));
export const A01V4_COLD_TOTAL = fr(warp(65.8));

// ---------------- shots: [id, visible cut (s), incoming transition] (stage-1 cuts, unchanged) ----------------
export const COLD_CUTS: [string, number, Tr][] = [
  ["S1", 0, {k: "hard"}], ["S2", 4.2, {k: "whip", d: "left"}], ["S3", 8.75, {k: "paper", d: "up"}], ["S4", 12.0, {k: "whip", d: "up"}],
  ["S5", 14.1, {k: "hard"}], ["S6", 17.4, {k: "whip", d: "right"}], ["S7", 21.6, {k: "paper", d: "left"}], ["S8", 25.3, {k: "whip", d: "down"}],
  ["S9", 27.1, {k: "paper", d: "up"}], ["S10", 31.4, {k: "push", x: 0, y: 0}], ["S11", 35.0, {k: "whip", d: "left"}], ["S12", 38.65, {k: "paper", d: "up"}],
  ["S13", 43.6, {k: "whip", d: "down"}], ["S14", 46.2, {k: "push", x: 1450, y: 600}], ["S15", 47.6, {k: "hard"}], ["S16", 49.9, {k: "paper", d: "up"}],
  ["S17", 51.9, {k: "whip", d: "left"}], ["S18", 54.7, {k: "paper", d: "up"}], ["S19", 58.8, {k: "hard"}], ["S20", 61.05, {k: "whip", d: "left"}],
  ["S21", 63.3, {k: "hard"}],
];

// =====================================================================================================
// small pieces drawn in code (ours)
// =====================================================================================================

/** Name bar (text only, no portrait): black bar with the name, yellow strip with the role. */
export const NameBar: React.FC<{f: number; at: number; name: string; sub: string; x: number; y: number}> = ({f, at, name, sub, x, y}) => {
  const p = ease(f, at, at + 10, outQuint), p2 = ease(f, at + 6, at + 16, outQuint);
  if (p <= 0) return null;
  return (
    <div style={{position: "absolute", left: x, top: y}}>
      <div style={{background: C.ink, color: C.white, fontFamily: F.sans, fontWeight: 900, fontSize: 54, letterSpacing: 1, padding: "14px 28px 12px",
        whiteSpace: "nowrap", clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, boxShadow: "0 10px 24px rgba(0,0,0,0.3)"}}>{name}</div>
      <div style={{display: "inline-block", background: C.highlight, color: C.ink, fontFamily: F.sans, fontWeight: 800, fontSize: 30, letterSpacing: 3,
        padding: "8px 28px 6px", opacity: p2, transform: `translateY(${(1 - p2) * -20}px)`}}>{sub}</div>
    </div>
  );
};

/** Manila tag on a string, wide enough for any number (the kit's PriceTag is sized for short values). */
export const TagCard: React.FC<{f: number; at: number; x: number; y: number; text: string; size?: number; string?: number}> =
  ({f, at, x, y, text, size = 96, string = 70}) => {
    if (f < at) return null;
    const drop = 1 - spr(f, at, 12, 150);
    const ang = 12 * Math.exp(-(f - at) / 16) * Math.cos((f - at) * 0.25) + 1.0 * Math.sin(f * 0.05);
    const w = text.length * size * 0.5 + size * 1.0, h = size * 1.7;
    return (
      <div style={{position: "absolute", left: x, top: y - drop * 700, transform: `rotate(${ang}deg)`, transformOrigin: "0 0"}}>
        <div style={{position: "absolute", left: -2, top: 0, width: 4, height: string, background: "linear-gradient(90deg,#8A7A60,#C8B994,#8A7A60)"}}/>
        <div style={{position: "absolute", left: -w / 2, top: string - 14, width: w, height: h, filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.35))"}}>
          <div style={{position: "absolute", inset: 0, clipPath: "polygon(9% 0, 91% 0, 100% 24%, 100% 100%, 0 100%, 0 24%)",
            background: "linear-gradient(160deg, #F2DDA8, #E7CB89 60%, #DDBE77)"}}/>
          <div style={{position: "absolute", left: w / 2 - 14, top: 8, width: 28, height: 28, borderRadius: "50%", background: "#C9A85E",
            boxShadow: "inset 0 2px 3px rgba(0,0,0,0.35)"}}/>
          <div style={{position: "absolute", left: w / 2 - 7, top: 15, width: 14, height: 14, borderRadius: "50%", background: "#3B2B18"}}/>
          <div style={{position: "absolute", left: 0, right: 0, top: size * 0.42, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: F.serif, fontSize: size, color: "#2A1C0E", letterSpacing: -2, lineHeight: 1}}>{text}</div>
        </div>
      </div>
    );
  };

/** Archive photo in a black film gate (rounded corners, 1 px weave, light flicker), slow tilt inside. */
export const FilmGate: React.FC<{f: number; d: number; src: string; caption: string}> = ({f, d, src, caption}) => {
  const k = Math.floor(f / 2), jx = (random("wx" + k) - 0.5) * 2, jy = (random("wy" + k) - 0.5) * 2;
  const flick = 1 + (random("fl" + k) - 0.5) * 0.07, p = clamp01(f / d);
  return (
    <AbsoluteFill style={{background: "#0B0A09"}}>
      <div style={{position: "absolute", left: 100 + jx, top: 64 + jy, width: 1720, height: 952, borderRadius: 40, overflow: "hidden", background: "#111"}}>
        <Img src={V(src)} style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.14 - 0.05 * p}) translateY(${-22 + 44 * p}px)`,
          filter: `grayscale(1) sepia(0.18) contrast(1.15) brightness(${(0.8 * flick).toFixed(3)})`}}/>
        <Halftone opacity={0.12} size={5}/>
        <AbsoluteFill style={{boxShadow: "inset 0 0 180px rgba(0,0,0,0.75)"}}/>
        <div style={{position: "absolute", left: 40, bottom: 26, fontFamily: F.mono, fontSize: 20, color: "#E8E2D6", letterSpacing: 1, opacity: 0.85}}>{caption}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Year strip with a moving red pointer (TimelineScrubber). Screen space. */
export const Timeline: React.FC<{f: number; at: number; years: number[]; from: number; to: number; moveAt: number; moveDur?: number; y: number; x0: number; x1: number}> =
  ({f, at, years, from, to, moveAt, moveDur = 18, y, x0, x1}) => {
    const ent = ease(f, at, at + 10, outQuint);
    if (ent <= 0) return null;
    const n = years.length, xOf = (yr: number) => x0 + ((x1 - x0) * years.indexOf(yr)) / (n - 1);
    const pos = xOf(from) + (xOf(to) - xOf(from)) * ease(f, moveAt, moveAt + moveDur, inOut);
    const curI = Math.round(((pos - x0) / (x1 - x0)) * (n - 1));
    return (
      <div style={{position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translateY(${(1 - ent) * 220}px)`}}>
        <div style={{position: "absolute", left: x0 - 70, top: y - 66, width: x1 - x0 + 140, height: 140, background: "#FBF8F1",
          boxShadow: "0 3px 4px rgba(30,20,10,0.16), 0 14px 30px rgba(30,20,10,0.22)", transform: "rotate(-0.6deg)"}}/>
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
          <line x1={x0 - 30} x2={x1 + 30} y1={y} y2={y} stroke={C.ink} strokeWidth={4}/>
          {years.map((yr, i) => <line key={yr} x1={xOf(yr)} x2={xOf(yr)} y1={y - 12} y2={y + 12} stroke={C.ink} strokeWidth={i === curI ? 6 : 3}/>)}
          <path d={`M ${pos - 18} ${y - 46} L ${pos + 18} ${y - 46} L ${pos} ${y - 18} Z`} fill={C.markerRed}/>
        </svg>
        {years.map((yr, i) => (
          <div key={yr} style={{position: "absolute", left: xOf(yr), top: y + 38, transform: `translate(-50%, -50%) scale(${i === curI ? 1.35 : 1})`,
            fontFamily: i === curI ? F.serif : F.mono, fontSize: i === curI ? 44 : 28, color: i === curI ? C.ink : C.grey}}>{yr}</div>
        ))}
      </div>
    );
  };

/** Face-down letter tile (wood-toned), flips up and wobbles. */
export const Tile: React.FC<{f: number; at: number; x: number; y: number; size?: number; seed: string}> = ({f, at, x, y, size = 170, seed}) => {
  if (f < at) return null;
  const s = spr(f, at, 11, 150);
  const wob = 4 * Math.sin((f - at) * 0.2 + random(seed) * 6) * Math.exp(-(f - at) / 30) + 1.4 * Math.sin(f * 0.06 + random(seed) * 9);
  return (
    <div style={{position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size,
      transform: `perspective(900px) rotateX(${(1 - s) * 95}deg) rotate(${wob}deg)`, transformOrigin: "50% 100%",
      background: "linear-gradient(145deg, #EBD6AA, #D7B880 70%, #C9A86C)", borderRadius: size * 0.09,
      boxShadow: "0 3px 4px rgba(30,20,10,0.25), 0 16px 28px rgba(30,20,10,0.3), inset 0 -6px 0 rgba(110,72,28,0.25), inset 0 4px 0 rgba(255,255,255,0.35)"}}>
      <div style={{position: "absolute", inset: size * 0.1, borderRadius: size * 0.06,
        background: "repeating-linear-gradient(45deg, rgba(120,80,30,0.13) 0 7px, rgba(0,0,0,0) 7px 17px)", border: "3px solid rgba(110,72,28,0.22)"}}/>
    </div>
  );
};

/** Numbered check box that pops in and gets a red tick. */
export const CheckBox: React.FC<{f: number; at: number; tickAt: number; n: number; x: number; y: number}> = ({f, at, tickAt, n, x, y}) => {
  if (f < at) return null;
  const s = spr(f, at, 10, 200), tp = ease(f, tickAt, tickAt + 7, outCubic);
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.4 + 0.6 * s})`, opacity: clamp01(s * 3)}}>
      <div style={{position: "absolute", left: -150, top: -10, transform: "translate(-50%, -50%)", fontFamily: F.serif, fontSize: 120, color: C.ink}}>{n}</div>
      <div style={{position: "absolute", left: -75, top: -75, width: 150, height: 150, border: `10px solid ${C.ink}`, borderRadius: 14, background: "#FBF8F1",
        boxShadow: "0 12px 24px rgba(30,20,10,0.22)"}}/>
      <svg width={220} height={220} style={{position: "absolute", left: -95, top: -125, overflow: "visible"}}>
        <path d="M 30 120 L 78 170 L 190 30" fill="none" stroke={C.markerRed} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tp}/>
      </svg>
    </div>
  );
};

/** Car icon as a white-bordered sticker (code-drawn). */
export const CarSticker: React.FC<{f: number; at: number; x: number; y: number; w?: number; rot?: number}> = ({f, at, x, y, w = 360, rot = -4}) => {
  const pose = piecePose(f, {at, mode: "pop", rot0: -12});
  if (!pose) return null;
  const body = "M 24 128 L 24 98 Q 26 76 56 72 L 100 40 Q 112 32 134 32 L 214 32 Q 236 32 250 44 L 284 72 Q 322 76 326 100 L 326 128 Z";
  return (
    <svg width={w} height={w * 0.55} viewBox="0 0 350 192" style={{position: "absolute", left: x - w / 2, top: y - w * 0.275, overflow: "visible",
      transform: `translate(${pose.dx}px, ${pose.dy}px) rotate(${rot + pose.r}deg) scale(${pose.s})`, opacity: pose.o,
      filter: "drop-shadow(0 4px 3px rgba(30,20,10,0.25)) drop-shadow(0 18px 22px rgba(30,20,10,0.28))"}}>
      <g stroke={C.white} strokeWidth={22} strokeLinejoin="round" fill={C.white}>
        <path d={body}/><circle cx={92} cy={132} r={30}/><circle cx={258} cy={132} r={30}/>
      </g>
      <path d={body} fill={C.inkSoft}/>
      <path d="M 112 50 L 160 50 L 160 72 L 86 72 Z M 176 50 L 230 50 L 256 72 L 176 72 Z" fill="#CFE0E8"/>
      <circle cx={92} cy={132} r={27} fill={C.ink}/><circle cx={92} cy={132} r={11} fill="#BDB6A8"/>
      <circle cx={258} cy={132} r={27} fill={C.ink}/><circle cx={258} cy={132} r={11} fill="#BDB6A8"/>
    </svg>
  );
};

/** A tied bundle of newspapers (code-drawn, no masthead text). */
export const NewsBundle: React.FC<{f: number; at: number; x: number; y: number; w?: number; h?: number; rot?: number; seed: string}> =
  ({f, at, x, y, w = 230, h = 160, rot = 0, seed}) => {
    const pose = piecePose(f, {at, mode: "drop", rot0: 12, stepped: 2});
    if (!pose) return null;
    const sheet = (i: number) => (
      <div key={i} style={{position: "absolute", left: (random(seed + i) - 0.5) * 10, top: -i * 7, width: w, height: h, background: i === 0 ? "#E8E0CF" : "#F1EBDD",
        transform: `rotate(${(random(seed + "r" + i) - 0.5) * 3}deg)`, boxShadow: "0 1px 2px rgba(0,0,0,0.18)"}}/>
    );
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h,
        transform: `translate(${pose.dx}px, ${pose.dy}px) rotate(${rot + pose.r}deg) scale(${pose.s})`, opacity: pose.o,
        filter: "drop-shadow(0 14px 20px rgba(30,20,10,0.32))"}}>
        {[0, 1, 2, 3].map(sheet)}
        <div style={{position: "absolute", left: 0, top: -28, width: w, height: h, background: "#F6F1E6", overflow: "hidden"}}>
          <div style={{position: "absolute", left: "7%", right: "7%", top: "8%", height: "17%", background: C.ink}}/>
          <div style={{position: "absolute", left: "7%", width: "38%", top: "32%", height: "40%", background: "#9C958A"}}/>
          <div style={{position: "absolute", left: "50%", right: "7%", top: "32%", bottom: "8%",
            background: "repeating-linear-gradient(180deg, #7D776D 0 3px, rgba(0,0,0,0) 3px 9px)"}}/>
          <div style={{position: "absolute", left: "7%", width: "38%", top: "76%", bottom: "8%",
            background: "repeating-linear-gradient(180deg, #7D776D 0 3px, rgba(0,0,0,0) 3px 9px)"}}/>
          <Halftone opacity={0.18} size={4}/>
        </div>
        {/* twine */}
        <div style={{position: "absolute", left: w * 0.62, top: -40, width: 7, height: h + 50, background: "#9A7646", boxShadow: "1px 0 0 rgba(0,0,0,0.25)"}}/>
        <div style={{position: "absolute", left: -6, top: h * 0.42 - 28, width: w + 12, height: 7, background: "#9A7646", boxShadow: "0 1px 0 rgba(0,0,0,0.25)"}}/>
      </div>
    );
  };

/** Faceless customer figure that walks in (stepped), with a "know and trust" tick bubble. */
export const Person: React.FC<{f: number; at: number; x: number; y: number; from: number; tickAt: number; s?: number; tone?: string}> =
  ({f, at, x, y, from, tickAt, s = 1, tone = C.inkSoft}) => {
    const pose = piecePose(f, {at, mode: "slide", from: [from, 0], dur: 16, stepped: 2});
    if (!pose) return null;
    const walking = f < at + 18, bob = walking ? -Math.abs(Math.sin(step(f, 2) * 0.55)) * 10 : 0;
    const tk = spr(f, tickAt, 10, 220), tp = ease(f, tickAt + 3, tickAt + 10, outCubic);
    return (
      <div style={{position: "absolute", left: x - 60 * s, top: y - 170 * s + bob, width: 120 * s, height: 200 * s,
        transform: `translate(${pose.dx}px, 0px) scale(${s})`, transformOrigin: "0 0", filter: pose.blur > 1 ? `blur(${pose.blur * 0.2}px)` : undefined}}>
        <svg width={120} height={200} viewBox="0 0 120 200" style={{overflow: "visible"}}>
          <circle cx={60} cy={38} r={27} fill={tone}/>
          <path d="M 18 196 L 18 120 Q 18 76 60 74 Q 102 76 102 120 L 102 196 Z" fill={tone}/>
          {f >= tickAt ? (
            <g transform={`translate(108 -14) scale(${tk})`}>
              <circle cx={0} cy={0} r={32} fill={C.white} stroke={C.ink} strokeWidth={4}/>
              <path d="M -14 0 L -3 12 L 16 -12" fill="none" stroke={C.markerRed} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round"
                pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tp}/>
            </g>
          ) : null}
        </svg>
      </div>
    );
  };

/** "You cannot touch it": a breathing dotted glow round an object (gold dashes over a soft yellow halo). */
export const GlowRing: React.FC<{f: number; at: number; cx: number; cy: number; rx: number; ry: number; ripple?: number}> = ({f, at, cx, cy, rx, ry, ripple}) => {
  const p = ease(f, at, at + 16, outCubic);
  if (p <= 0) return null;
  const rp = ripple != null ? Math.exp(-Math.max(0, f - ripple) / 8) * (f >= ripple ? 1 : 0) : 0;
  const b = 1 + 0.035 * Math.sin((f - at) * 0.13) + 0.06 * rp;
  return (
    <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none"}}>
      <defs>
        <radialGradient id={"gr" + cx + cy}><stop offset="0%" stopColor="#FFE45C" stopOpacity={0.5}/><stop offset="70%" stopColor="#FFE45C" stopOpacity={0.18}/>
          <stop offset="100%" stopColor="#FFE45C" stopOpacity={0}/></radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx * 1.15 * b} ry={ry * 1.25 * b} fill={`url(#gr${cx}${cy})`} opacity={p}/>
      <ellipse cx={cx} cy={cy} rx={rx * b} ry={ry * b} fill="none" stroke="#D9A300" strokeWidth={8 + 6 * rp} strokeLinecap="round"
        strokeDasharray="2 22" strokeDashoffset={-(f - at) * 1.6} opacity={p}/>
    </svg>
  );
};

export const Candy: React.FC<{f: number; x: number; y: number; w: number; rot?: number; at?: number; bob?: number}> = ({f, x, y, w, rot = -5, at = 0, bob = 3}) => (
  <Sticker f={f} src="media/candy_box_sticker.png" x={x} y={y} w={w} h={w * 623 / 1794} rot={rot} bob={bob} enter={{at, mode: at <= 0 ? "none" : "slide", from: [-1400, 120], rot0: -16, dur: 11}}/>
);

/** Marker ">" (more than) drawn as a pen stroke. */
export const MoreThan: React.FC<{f: number; at: number; x: number; y: number; s?: number}> = ({f, at, x, y, s = 1}) => {
  const p = ease(f, at, at + 9, outCubic);
  if (p <= 0) return null;
  return <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
    <path d={`M ${x - 55 * s} ${y - 80 * s} L ${x + 60 * s} ${y} L ${x - 55 * s} ${y + 80 * s}`} fill="none" stroke={C.markerRed} strokeWidth={22 * s}
      strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}/>
  </svg>;
};

// documents (rects in image px from tools/letter_shot.py -> public/voxplus/a01v4/docs/bh1985_cold.json)
export const D85 = {src: "a01v4/docs/bh1985_cold.png", imgW: 2018, imgH: 918, x: 960, y: 560, width: 1500, rot: -1.0};
export const R85 = {
  scrap: [[1493, 486, 317, 54], [24, 540, 893, 54]] as Rect[],
  d26: [686, 540, 86, 54] as Rect,
  removal: [975, 540, 835, 54] as Rect,
  candy: [686, 702, 750, 54] as Rect,             // "a single See's candy store"
  goodwill: [658, 648, 490, 54] as Rect,          // "economic goodwill"
  routes: [[1637, 648, 288, 54], [24, 702, 490, 54]] as Rect[],
};
export const D86 = {src: "a01v4/docs/bh1986_top.png", imgW: 2018, imgH: 378, x: 960, y: 400, width: 1500, rot: 1.0};   // cropped above the word
export const R86 = {auto: [1292, 54, 403, 54] as Rect};

// =====================================================================================================
// shots
// =====================================================================================================

// S1 (0-4.2) the question: loom photo, the $26 tag, a marker "?"
export const S1: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const cam = camAt(f, [[0, 1.0, 960, 540], [d, 1.07, 990, 530]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam} depth={0.8}>
        <PhotoPrint f={f} src="media/looms_radcliffe_1912.jpg" x={1400} y={430} w={760} h={470} rot={-5} halftone={0.22} darken={0.12}
          enter={{at: -1, mode: "slide", from: [1400, 0], dur: 9, stepped: 2}}/>
      </Layer>
      <Layer cam={cam}>
        <PhotoPrint f={f} src="media/loom_draper_1987.jpg" x={720} y={510} w={1060} h={760} rot={2} halftone={0.12} caption="looms like these (photo: HAER/LoC)"
          enter={{at: -4, mode: "slide", from: [1800, 60], rot0: 8, dur: 8}} crop={{s0: 1.1, s1: 1.0, fx: 0.55, fy: 0.6, dur: d}}/>
      </Layer>
      <Layer cam={cam} depth={1.06}>
        <PriceTag f={f} enterAt={7} x={1450} y={-40} string={300} scale={1.1} values={[{text: "$26", at: 7}]}/>
        <MarkerText f={f} at={L(2.5)} text="?" x={1600} y={600} size={210} rot={8} dur={10} dir="y"/>
      </Layer>
      <Layer cam={cam} depth={1.12}>
        <StickerLabel f={f} text="Why sell at $26?" x={700} y={968} size={66} dark rot={-1.5} enter={{at: 12, mode: "slide", from: [0, 300], dur: 9}}/>
      </Layer>
      <SourceTag f={f} at={8} text="Berkshire letter for 1985"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// S2 (4.2-8.75) "It is a loom. In 1981, Warren Buffett's company": lateral glide, timeline ticks to 1981, name bar
export const S2: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const cam = camAt(f, [[0, 1.06, 1080, 540], [d, 1.06, 860, 530]]);
  const arrow = ease(f, L(4.75), L(5.05), outCubic);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        <PhotoPrint f={f} src="media/looms_radcliffe_1912.jpg" x={930} y={470} w={1320} h={790} rot={-1.5} halftone={0.16} enter={{at: 0, mode: "none"}}
          crop={{s0: 1.0, s1: 1.07, fx: 0.4, fy: 0.55, dur: d}} caption="looms like these (illustration, 1912)"/>
      </Layer>
      <Layer cam={cam} depth={1.12}>
        <StickerLabel f={f} text="A loom" x={470} y={210} size={60} rot={-4} enter={{at: L(4.55), mode: "pop", rot0: -14}}/>
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <path d="M 560 250 Q 640 300 700 400" fill="none" stroke={C.markerRed} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrow}/>
          <path d="M 668 380 L 702 404 L 712 364" fill="none" stroke={C.markerRed} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round"
            opacity={arrow >= 1 ? 1 : 0}/>
        </svg>
      </Layer>
      <Timeline f={f} at={L(5.3)} years={[1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983]} from={1976} to={1981} moveAt={L(5.9)} moveDur={24} y={958} x0={330} x1={1590}/>
      <NameBar f={f} at={L(7.4)} name="WARREN BUFFETT" sub="INVESTOR" x={1150} y={150}/>
      <SourceTag f={f} at={0} text="Berkshire letter for 1985"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// S3 (8.75-12.0) "Berkshire, bought some fairly new ones": pull-out, loom prints land
const S3P: [number, number, number, number, number][] = [[1110, 360, -6, 0.5, 0.55], [1460, 330, 4, 0.35, 0.62], [1770, 400, -3, 0.7, 0.5], [1230, 700, 5, 0.6, 0.7], [1600, 720, -4, 0.45, 0.45]];
export const S3: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const cam = camAt(f, [[0, 1.13, 1050, 560], [d, 1.0, 980, 540, outCubic]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper tone="kraft" drift={f / d}/></Layer>
      <Layer cam={cam} depth={0.92}>
        <TornBlock f={f} x={470} y={540} w={660} h={560} rot={-3} color={C.wallBlue} enter={{at: 0, mode: "none"}}/>
      </Layer>
      <Layer cam={cam}>
        {S3P.map(([x, y, r, fx, fy], i) => (
          <PhotoPrint key={i} f={f} src="media/loom_draper_1987.jpg" x={x} y={y} w={390} h={280} rot={r} border={10} tape={i % 2 === 0} halftone={0.15}
            crop={{s0: 1.5, s1: 1.5, fx, fy}} enter={{at: (i === 0 ? 0 : L(9.45) + i * 4), mode: "drop", rot0: 10, stepped: 2}}/>
        ))}
      </Layer>
      <Layer cam={cam} depth={1.12}>
        <StickerLabel f={f} text="Berkshire" x={470} y={470} size={88} rot={-3} enter={{at: 3, mode: "pop", rot0: -10}}/>
        <StickerLabel f={f} text="His company" x={470} y={610} size={40} rot={2} dark enter={{at: L(8.95), mode: "pop", rot0: 8}}/>
        <MarkerText f={f} at={L(10.6)} text="fairly new" x={1440} y={960} size={74} rot={-3}/>
      </Layer>
      <SourceTag f={f} at={0} text="Berkshire letter for 1985"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// S4 (12.0-14.1) "Five thousand dollars each": the tag flips $26 -> $5,000
export const S4: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const cam = camAt(f, [[0, 1.0, 960, 540, inOut, -1.2], [d, 1.05, 960, 560, inOut, 1.0]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.8}><Paper drift={f / d}/></Layer>
      <Layer cam={cam} depth={0.85} blur={7}>
        <PhotoPrint f={f} src="media/loom_draper_1987.jpg" x={960} y={560} w={1500} h={980} rot={1} halftone={0.12} darken={0.1} enter={{at: 0, mode: "none"}}/>
      </Layer>
      <Layer cam={cam}>
        <PriceTag f={f} enterAt={-80} x={960} y={-90} string={330} scale={1.45} values={[{text: "$26", at: -80}, {text: "$5,000", at: L(12.4)}]}/>
      </Layer>
      <Layer cam={cam} depth={1.1}>
        <StickerLabel f={f} text="Each · 1981" x={960} y={700} size={58} dark rot={-2} enter={{at: L(12.75), mode: "pop", rot0: -8}}/>
      </Layer>
      <SourceTag f={f} at={0} text="Berkshire letter for 1985"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// S5 (14.1-17.4) "When Berkshire shut its cloth mill": film-gate archive still, CLOSED stamp
export const S5: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  return (
    <AbsoluteFill>
      <FilmGate f={f} d={d} src="media/looms_radcliffe_1912.jpg" caption="a weaving shed, 1912 (illustration)"/>
      <Stamp f={f} at={L(15.0)} text="CLOSED" x={960} y={520} size={150} rot={-9}/>
      <StickerLabel f={f} text="1985" x={1600} y={230} size={66} rot={5} enter={{at: L(15.55), mode: "pop", rot0: 14}}/>
      <SourceTag f={f} at={0} text="Berkshire letter for 1985" dark/>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};

// S6 (17.4-21.6) "even at fifty dollars ... scrap at twenty six dollars each": $50 crossed out, $26 stamped, crash zoom
export const S6: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const z = L(20.95);
  const cam = camAt(f, [[0, 1.0, 1000, 540], [z, 0.97, 940, 540], [z + 6, 1.24, 960, 470, outQuint], [d, 1.27, 960, 470]]);
  const zb = 6 * Math.sin(Math.PI * clamp01((f - z) / 8));
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.8}><Paper tone="kraft" drift={f / d}/></Layer>
      <Layer cam={cam} depth={0.82} blur={6 + zb}>
        <PhotoPrint f={f} src="media/looms_radcliffe_1912.jpg" x={760} y={560} w={1300} h={800} rot={-3} halftone={0.16} darken={0.15} enter={{at: 0, mode: "none"}}/>
      </Layer>
      <Layer cam={cam} blur={zb * 0.5}>
        <PriceTag f={f} enterAt={-80} x={1000} y={-90} string={330} scale={1.35} values={[
          {text: "$5,000", at: -80}, {text: "$50", at: L(17.85), crossAt: L(18.55)}, {text: "$26", at: z, stamp: true}]}/>
      </Layer>
      <Layer cam={cam} depth={1.1}>
        <StickerLabel f={f} text="No takers" x={1500} y={640} size={60} rot={4} enter={{at: L(18.75), mode: "pop", rot0: 12}} exit={{at: L(20.2), to: [900, 0]}}/>
        <StickerLabel f={f} text="Scrap" x={520} y={640} size={66} rot={-4} dark enter={{at: L(20.3), mode: "pop", rot0: -12}}/>
      </Layer>
      <SourceTag f={f} at={0} text="Berkshire letter for 1985"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// S7 (21.6-25.3) the letter itself: "for scrap at $26 each, a sum less than removal costs"
export const S7: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const a = docPoint(D85, 1009, 540);
  const cam = camAt(f, [[0, 1.0, 960, 560], [L(23.2), 1.3, a.x, a.y - 30, inOut], [d, 1.36, a.x + 30, a.y - 20, inOut]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.9}><Paper tone="kraft" drift={f / d}/></Layer>
      <Layer cam={cam}>
        <DocPage f={f} {...D85} stack={2}
          highlights={[{rects: R85.scrap, at: L(21.75), dur: 8}, {rects: [R85.removal], at: L(23.05), dur: 14}]}
          circles={[{rect: R85.d26, at: L(22.35), dur: 12}]}
          underlines={[{rect: R85.removal, at: L(23.95), dur: 10}]}
          focus={{rect: [0, 486, 2018, 108], at: L(22.4), blur: 2.6}}/>
      </Layer>
      <StickerLabel f={f} text="Less than removal" x={960} y={985} size={62} dark rot={-1.5} enter={{at: L(24.05), mode: "slide", from: [0, 300], dur: 9}}/>
      <SourceTag f={f} at={0} text="Berkshire letter for 1985 · signed 4 Mar 1986"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// S8 (25.3-27.1) "Now the strange part." big serif on black, pull-out
export const S8: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const s = 1.08 - 0.08 * ease(f, 0, d, outCubic);
  return (
    <AbsoluteFill>
      <InkSurface glow={0.08}/>
      <AbsoluteFill style={{transform: `scale(${s})`}}>
        <BigWord f={f} at={2} text="Now the strange part." x={960} y={530} size={170} stagger={5} mark={["strange"]} markAt={L(25.95)}/>
      </AbsoluteFill>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};

// S9 (27.1-31.4) back to the same letter: "a single See's candy store", circle "economic goodwill"
const S9_A = docPoint(D85, 1009, 702);
const S9_CAM = (s0: number, d: number): CamKey[] => [[0, 1.0, 960, 560], [fr(warp(28.0)) - s0, 1.02, 960, 570], [d, 1.42, S9_A.x - 60, S9_A.y - 20, inOut]];
export const S9: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const cam = camAt(f, S9_CAM(s0, d));
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.9}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        <DocPage f={f} {...D85} stack={3} enter={{at: 0, mode: "slide-up", dur: 12}}
          highlights={[{rects: [R85.candy], at: L(28.15), dur: 12}]}
          circles={[{rect: R85.goodwill, at: L(30.3), dur: 13}]}
          focus={{rect: [0, 648, 2018, 108], at: L(29.2), blur: 2.6}}/>
      </Layer>
      <StickerLabel f={f} text="Goodwill?" x={1560} y={150} size={70} rot={3} bg={C.markerRed} color={C.white} enter={{at: L(30.7), mode: "pop", rot0: 12}}/>
      <SourceTag f={f} at={0} text="Berkshire letter for 1985"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
export const S9_GW_END = (() => {
  const {start, dur} = layoutShots(COLD_CUTS.map(([id, cut, tr]) => ({id, cut: warp(cut), tr, C: () => null})), A01V4_COLD_TOTAL), i = 8;
  const s0 = start[i], d = dur[i], c = camAt(d - TT, S9_CAM(s0, d)), w = docRectCentre(D85, R85.goodwill);
  return {x: (w.x - c.x) * c.s + W / 2, y: (w.y - c.y) * c.s + H / 2};
})();

// S10 (31.4-35.0) the comparison, as the letter says: ONE STORE'S GOODWILL > what the machines sold for ($163,122)
export const S10: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const cam = camAt(f, [[0, 1.05, 880, 545], [d, 1.05, 1040, 535]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.82}><Paper drift={f / d}/></Layer>
      <Layer cam={cam} depth={0.9}>
        <TornBlock f={f} x={470} y={580} w={760} h={600} rot={-2} color={C.wallBlue} enter={{at: 0, mode: "none"}}/>
        <TornBlock f={f} x={1460} y={590} w={700} h={600} rot={3} color={C.kraft} seed="tb2" enter={{at: 0, mode: "none"}}/>
      </Layer>
      <Layer cam={cam}>
        <GlowRing f={f} at={4} cx={470} cy={640} rx={330} ry={150}/>
        <Candy f={f} x={470} y={640} w={600} rot={-6}/>
        {[[1390, 740, -5, 0.5, 0.6], [1530, 690, 6, 0.65, 0.55], [1440, 640, -2, 0.4, 0.7]].map(([x, y, r, fx, fy], i) => (
          <PhotoPrint key={i} f={f} src="media/loom_draper_1987.jpg" x={x} y={y} w={360} h={250} rot={r} border={9} tape={false} halftone={0.16}
            crop={{s0: 1.5, s1: 1.5, fx, fy}} enter={{at: 0, mode: "none"}}/>
        ))}
        <TagCard f={f} at={L(33.45)} x={1500} y={330} string={64} text="$163,122" size={92}/>
        <MoreThan f={f} at={L(31.75)} x={985} y={560}/>
        <MarkerText f={f} at={L(31.95)} text="more than" x={985} y={700} size={46} rot={-4}/>
      </Layer>
      <Layer cam={cam} depth={1.1}>
        <StickerLabel f={f} text="One store's goodwill" x={470} y={270} size={50} rot={-2} enter={{at: 2, mode: "pop", rot0: -8}}/>
        <StickerLabel f={f} text="The machines sold for" x={1460} y={240} size={44} rot={2} dark enter={{at: L(33.15), mode: "pop", rot0: 8}}/>
      </Layer>
      <SourceTag f={f} at={0} text="Berkshire letter for 1985 · gross proceeds"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// S11 (35.0-38.65) "So was the goodwill of two paper routes in Buffalo": the equal alternative
export const S11: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const cam = camAt(f, [[0, 1.08, 930, 555], [d, 1.0, 960, 540, outCubic]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.82}><Paper drift={f / d}/></Layer>
      <Layer cam={cam} depth={0.9}>
        <TornBlock f={f} x={620} y={600} w={1110} h={560} rot={-1.5} color={C.wallBlue} enter={{at: 0, mode: "none"}}/>
      </Layer>
      <Layer cam={cam}>
        <Candy f={f} x={330} y={620} w={420} rot={-6}/>
        <MarkerText f={f} at={L(35.5)} text="or" x={600} y={610} size={92} rot={-6} color={C.highlight}/>
        <NewsBundle f={f} at={L(35.95)} x={820} y={650} w={260} h={180} rot={-6} seed="nb1"/>
        <NewsBundle f={f} at={L(36.1)} x={1060} y={640} w={260} h={180} rot={5} seed="nb2"/>
        <MoreThan f={f} at={2} x={1265} y={600} s={0.85}/>
        <TagCard f={f} at={-40} x={1560} y={400} string={60} text="$163,122" size={86}/>
      </Layer>
      <Layer cam={cam} depth={1.1}>
        <StickerLabel f={f} text="1 store" x={330} y={420} size={50} rot={-3} enter={{at: 2, mode: "pop", rot0: -8}}/>
        <StickerLabel f={f} text="2 paper routes" x={940} y={420} size={50} rot={2} enter={{at: L(36.3), mode: "pop", rot0: 8}}/>
        <StickerLabel f={f} text="Buffalo" x={940} y={800} size={50} rot={-3} dark enter={{at: L(37.5), mode: "pop", rot0: -10}}/>
        <StickerLabel f={f} text="Machines sold for" x={1560} y={320} size={38} rot={2} dark enter={{at: 0, mode: "none"}}/>
      </Layer>
      <SourceTag f={f} at={0} text="Berkshire letter for 1985"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// S12 (38.65-43.6) c04 gloss: GOODWILL = people know and trust the name (OUR WORDS)
const S12P: [number, number, number][] = [[210, 900, -1100], [370, 930, -1100], [530, 905, -1100], [1390, 905, 1100], [1550, 930, 1100], [1710, 900, 1100]];
export const S12: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const cam = camAt(f, [[0, 1.06, 960, 520, inOut, -0.8], [d, 1.0, 960, 540, inOut, 0.4]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        <MarkerText f={f} at={3} text="GOODWILL" x={960} y={160} size={120} rot={-2} color={C.ink} dur={16}/>
        <GlowRing f={f} at={L(39.6)} cx={960} cy={540} rx={420} ry={190}/>
        <Candy f={f} x={960} y={540} w={640} rot={-4}/>
        <StickerLabel f={f} text="See's" x={1250} y={420} size={48} rot={6} enter={{at: 8, mode: "pop", rot0: 14}}/>
        {S12P.map(([x, y, from], i) => (
          <Person key={i} f={f} at={L(40.2) + i * 3} x={x} y={y} from={from} tickAt={L(41.75) + i * 3} s={0.95} tone={i % 2 ? C.inkSoft : "#4A4038"}/>
        ))}
      </Layer>
      <Layer cam={cam} depth={1.1}>
        <StickerLabel f={f} text="Known and trusted" x={960} y={850} size={56} dark rot={-1.5} enter={{at: L(41.9), mode: "slide", from: [0, 300], dur: 9}}/>
      </Layer>
      <SourceTag f={f} at={0} text="Our words (the gloss) · Buffett's own words follow"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// S13 (43.6-46.2) "Our question: why could rivals copy"
export const S13: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const up = ease(f, L(44.75), L(45.1), inOut), s = 1.05 - 0.05 * ease(f, 0, d, outCubic);
  return (
    <AbsoluteFill>
      <InkSurface glow={0.08}/>
      <AbsoluteFill style={{transform: `scale(${s})`}}>
        <div style={{position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translateY(${-230 * up}px) scale(${1 - 0.45 * up})`, transformOrigin: "50% 50%"}}>
          <BigWord f={f} at={2} text="Our question:" x={960} y={540} size={140} italic color="#B9B2A6" stagger={5}/>
        </div>
        <BigWord f={f} at={L(44.95)} text="Why could rivals copy" x={960} y={590} size={160} stagger={7} mark={["copy"]} markAt={L(45.85)}/>
      </AbsoluteFill>
      <SourceTag f={f} at={0} text="Our question" dark/>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};

// S14 (46.2-47.6) "the mill's machines": anyone can copy a machine
export const S14: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const cam = camAt(f, [[0, 1.04, 860, 540], [d, 1.04, 1010, 540]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        {[0, 1, 2].map((i) => (
          <React.Fragment key={i}>
            <PhotoPrint f={f} src="media/loom_draper_1987.jpg" x={880 + i * 330} y={560 + (i % 2 ? -30 : 20)} w={400} h={290} rot={(i - 1) * 4} border={10} tape={false}
              halftone={0.2} darken={0.05} crop={{s0: 1.25, s1: 1.25, fx: 0.55, fy: 0.6}} enter={{at: L(46.25) + i * 4, mode: "slide", from: [-330 * (i + 1), 0], dur: 6, stepped: 2}}/>
            <StickerLabel f={f} text="Copy" x={900 + i * 330} y={720 + (i % 2 ? -30 : 20)} size={44} rot={-6} bg={C.markerRed} color={C.white} enter={{at: L(46.25) + i * 4 + 5, mode: "pop", rot0: -14}}/>
          </React.Fragment>
        ))}
        <PhotoPrint f={f} src="media/loom_draper_1987.jpg" x={500} y={540} w={560} h={400} rot={-3} halftone={0.12} crop={{s0: 1.25, s1: 1.25, fx: 0.55, fy: 0.6}}
          enter={{at: 0, mode: "none"}}/>
      </Layer>
      <Layer cam={cam} depth={1.1}>
        <StickerLabel f={f} text="Machines" x={500} y={300} size={54} rot={-3} dark enter={{at: 2, mode: "pop", rot0: -8}}/>
      </Layer>
      <SourceTag f={f} at={0} text="Our question"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// S15 (47.6-49.9) "but not that trust?": the candy box glowing, red marker "?"
export const S15: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const s = 1.0 + 0.04 * ease(f, 0, d, (t) => t);
  return (
    <AbsoluteFill>
      <InkSurface glow={0.1}/>
      <AbsoluteFill style={{transform: `scale(${s})`}}>
        <BigWord f={f} at={1} text="But not that trust?" x={960} y={300} size={150} stagger={5} mark={["trust"]} markAt={L(48.5)}/>
        <GlowRing f={f} at={2} cx={900} cy={720} rx={360} ry={150}/>
        <Candy f={f} x={900} y={720} w={520} rot={-4}/>
        <MarkerText f={f} at={L(48.85)} text="?" x={1500} y={700} size={280} rot={10} dir="y" dur={10}/>
      </AbsoluteFill>
      <SourceTag f={f} at={0} text="Our question" dark/>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};

// S16 (49.9-51.9) "Hint: you cannot touch it": a pen reaches for the glow and goes straight through it
export const S16: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const cam = camAt(f, [[0, 1.08, 960, 560], [d, 1.0, 960, 540, outCubic]]);
  const ar = ease(f, L(50.2), L(50.75), outCubic);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        <GlowRing f={f} at={0} cx={960} cy={560} rx={430} ry={200} ripple={L(50.75)}/>
        <Candy f={f} x={960} y={560} w={600} rot={-4}/>
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <path d="M 1720 180 Q 1500 260 1300 470" fill="none" stroke={C.markerRed} strokeWidth={11} strokeLinecap="round" pathLength={1}
            strokeDasharray={1} strokeDashoffset={1 - ar}/>
          <path d="M 1288 428 L 1300 472 L 1344 462" fill="none" stroke={C.markerRed} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" opacity={ar >= 1 ? 1 : 0}/>
        </svg>
      </Layer>
      <Layer cam={cam} depth={1.1}>
        <StickerLabel f={f} text="Hint" x={330} y={200} size={72} rot={-5} dark enter={{at: 2, mode: "pop", rot0: -14}}/>
        <StickerLabel f={f} text="Can't touch it" x={960} y={890} size={60} rot={-1.5} enter={{at: L(50.4), mode: "slide", from: [0, 300], dur: 9}}/>
      </Layer>
      <SourceTag f={f} at={0} text="Our reading"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// S17 (51.9-54.7) "We think what protects it has a one word name": four face-down tiles
export const S17: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const cam = camAt(f, [[0, 1.05, 860, 540], [d, 1.05, 1060, 540]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper tone="kraft" drift={f / d}/></Layer>
      <Layer cam={cam}>
        <GlowRing f={f} at={0} cx={960} cy={290} rx={250} ry={110}/>
        <Candy f={f} x={960} y={290} w={380} rot={-4} bob={2}/>
        {[0, 1, 2, 3].map((i) => <Tile key={i} f={f} at={i === 0 ? 2 : L(52.1) + i * 4} x={960 + (i - 1.5) * 200} y={640} seed={"t" + i}/>)}
        <MarkerText f={f} at={L(53.55)} text="one word" x={960} y={880} size={84} rot={-3}/>
      </Layer>
      <SourceTag f={f} at={0} text="Our reading (what protects it has a name)"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// S18 (54.7-59.0) "In the letters we have, that word first shows up a year later": the 1986 letter (cropped above the word)
export const S18: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const cam = camAt(f, [[0, 1.12, 860, 430, inOut, -1], [d, 1.0, 1000, 560, inOut, 0.6]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.88}><Paper tone="kraft" drift={f / d}/></Layer>
      <Layer cam={cam}>
        <DocPage f={f} {...D86} stack={3} enter={{at: 0, mode: "slide-up", dur: 12}} highlights={[{rects: [R86.auto], at: L(56.55), dur: 12}]}/>
        <Stamp f={f} at={L(57.95)} text="1986" x={1560} y={250} size={84} rot={9}/>
        <CarSticker f={f} at={L(58.25)} x={1520} y={740} w={330}/>
      </Layer>
      <Timeline f={f} at={4} years={[1983, 1984, 1985, 1986, 1987, 1988]} from={1985} to={1986} moveAt={L(57.7)} moveDur={16} y={930} x0={420} x1={1300}/>
      <SourceTag f={f} at={0} text="Berkshire letter for 1986 · letters in our collection"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// S19 (59.0-60.9) "Not about candy."
export const S19: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const cam = camAt(f, [[0, 1.0, 960, 540], [d, 1.06, 990, 540]]);
  const x1 = ease(f, L(59.85), L(59.85) + 5, outCubic), x2 = ease(f, L(59.85) + 5, L(59.85) + 10, outCubic);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        <CarSticker f={f} at={-20} x={560} y={520} w={480} rot={-3}/>
        <Candy f={f} x={1340} y={540} w={560} rot={-5}/>
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <path d="M 1090 380 L 1590 700" stroke={C.markerRed} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - x1}/>
          <path d="M 1590 380 L 1090 700" stroke={C.markerRed} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - x2}/>
        </svg>
      </Layer>
      <Layer cam={cam} depth={1.1}>
        <StickerLabel f={f} text="1986" x={560} y={290} size={58} rot={-4} enter={{at: 2, mode: "pop", rot0: -10}}/>
        <StickerLabel f={f} text="Not candy" x={1340} y={850} size={64} dark rot={2} enter={{at: L(60.1), mode: "pop", rot0: 8}}/>
      </Layer>
      <SourceTag f={f} at={0} text="Berkshire letter for 1986"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// S20 (60.9-63.3) "A three question check comes last."
export const S20: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), L = useL(s0);
  const cam = camAt(f, [[0, 1.04, 1060, 540], [d, 1.04, 880, 540]]);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper drift={f / d}/></Layer>
      <Layer cam={cam}>
        {[0, 1, 2].map((i) => <CheckBox key={i} f={f} at={2 + i * 4} tickAt={L(62.0) + i * 5} n={i + 1} x={620 + i * 420} y={520}/>)}
      </Layer>
      <Layer cam={cam} depth={1.1}>
        <StickerLabel f={f} text="3 questions" x={960} y={820} size={70} dark rot={-1.5} enter={{at: L(61.4), mode: "slide", from: [0, 300], dur: 9}}/>
      </Layer>
      <SourceTag f={f} at={0} text="Our test"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// S21 (63.3-65.8) title card
export const S21: React.FC<SP> = ({d}) => {
  const f = useTicks();
  const s = 1.06 - 0.06 * ease(f, 0, d, outCubic);
  const st = spr(f, 3, 9, 240), sh = shake(f, 6, 10, "title"), u = ease(f, 16, 28, inOut), it = ease(f, 12, 24, outQuint);
  return (
    <AbsoluteFill>
      <Paper drift={f / d}/>
      <AbsoluteFill style={{transform: `scale(${s})`}}>
        {[0, 1, 2, 3].map((i) => <Tile key={i} f={f} at={-30} x={960 + (i - 1.5) * 120} y={250} size={96} seed={"tt" + i}/>)}
        <div style={{position: "absolute", left: 960 + sh.x, top: 520 + sh.y, transform: `translate(-50%, -50%) scale(${1.7 - 0.7 * st})`, opacity: clamp01(st * 3),
          fontFamily: F.serif, fontSize: 200, color: C.ink, whiteSpace: "nowrap", letterSpacing: -3}}>What Is a Moat?</div>
        <div style={{position: "absolute", left: 960 - 520, top: 640, width: 1040, height: 26, background: C.highlight, transform: `scaleX(${u})`, transformOrigin: "0 50%",
          mixBlendMode: "multiply"}}/>
        <div style={{position: "absolute", left: 0, right: 0, top: 730, textAlign: "center", fontFamily: F.serif, fontStyle: "italic", fontSize: 64, color: C.inkSoft,
          opacity: it, transform: `translateY(${(1 - it) * 24}px)`}}>The $26 loom</div>
      </AbsoluteFill>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

const COMPS: Record<string, React.FC<SP>> = {S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21};
export const coldShots = (): Shot[] =>
  COLD_CUTS.map(([id, cut, tr]) => ({id, cut: warp(cut), tr: id === "S10" ? {k: "push" as const, x: S9_GW_END.x, y: S9_GW_END.y} : tr, C: COMPS[id]}));

// ---------------- sound (seconds; thinned 18 Oct to about one meaningful effect every 6-7 s) ----------------
export type SCue = [number, Cue[1], number?];
export const COLD_CUES: SCue[] = [
  [0, "paper", 0.7], [8.7, "paper", 0.5], [15.0, "stamp", 0.75], [20.95, "stamp", 0.85], [23.05, "highlighter", 0.6],
  [28.15, "highlighter", 0.6], [36.45, "paper", 0.5], [46.45, "stamp", 0.35], [58.05, "stamp", 0.6], [63.35, "stamp", 1.0],
].map(([t, n, g]) => [warp(t), n, g] as SCue);
export const cueFrames = (cues: SCue[], fps: number): Cue[] => cues.map(([s, n, g]) => [tk2f(tsec(s), fps), n, g] as Cue);

/** Narration: one normalised file per beat, placed at its start (seconds). */
export const VoiceTrack: React.FC<{vo: {k: string; at: number; len: number}[]}> = ({vo}) => {
  const {fps} = useVideoConfig();
  return (
    <>
      {vo.map((v) => (
        <Sequence key={v.k} from={tk2f(tsec(v.at), fps)} durationInFrames={tk2f(tsec(v.len + 0.3), fps)} layout="none">
          <Audio src={V(`a01v4/vo/${v.k}${VO_SUFFIX}.wav`)} volume={1}/>
        </Sequence>
      ))}
    </>
  );
};

export const A01V4Cold: React.FC<{music?: boolean; bed?: string}> = ({music = true, bed = "audio/music_06_curious_ambience_reg1n0ld.wav"}) => {
  useVoxFonts();
  const {fps} = useVideoConfig();
  const shots = coldShots();
  const {start, dur} = layoutShots(shots, A01V4_COLD_TOTAL);
  const fs = (s: number) => tk2f(tsec(s), fps);
  const voice: [number, number][] = VO.map((v) => [fs(v.at), fs(v.at + v.len)]);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Series shots={shots} start={start} dur={dur}/>
      <VoiceTrack vo={VO}/>
      {music ? <MusicBed src={bed} total={fs(warp(65.8))} voice={voice} duck={0.2} open={0.42} startFrom={fs(20)} fadeIn={fs(1 / 3)} fadeOut={fs(1)}/> : null}
      <SfxTrack cues={cueFrames(COLD_CUES, fps)}/>
    </AbsoluteFill>
  );
};
