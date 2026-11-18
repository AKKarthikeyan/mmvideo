// Jio film, chapters 1 and 2: helpers of our own (chapter card with word-cued reveals, string-label timeline, cued share bars,
// big sticky note, approx number). Time is in ticks (1/30 s), as everywhere in src/voxplus.
import React from "react";
import {AbsoluteFill, random} from "remotion";
import {Layer, camAt, CamKey} from "../Camera";
import {SourceTag} from "../Cards";
import {Paper} from "../A01V4Parts";
import {MarkerCircle} from "../Marker";
import {Finish, InkSurface, PaperSurface} from "../Texture";
import {C, F, W, H, clamp01, ease, inOut, outCubic, outQuint, shake, spr} from "../tokens";

/** Chapter card (cream, "Chapter N:", the word huge in serif, yellow underline): label and word are cued separately. */
export const Card12: React.FC<{f: number; n: number; word: string; labelAt?: number; wordAt: number; size?: number}> = ({f, n, word, labelAt = 0, wordAt, size}) => {
  const k = ease(f, labelAt, labelAt + 12, outQuint), w = ease(f, wordAt, wordAt + 14, outQuint), u = ease(f, wordAt + 12, wordAt + 26, inOut);
  const sz = size ?? (word.length > 10 ? 196 : 240);
  const uw = Math.min(1100, Math.max(560, word.length * sz * 0.42));
  return (
    <AbsoluteFill>
      <PaperSurface drift={clamp01(f / 90)}/>
      <AbsoluteFill style={{opacity: 0.11}}>
        {Array.from({length: 40}).map((_, i) => {
          const col = i % 8, row = Math.floor(i / 8), kind = Math.floor(random("ci" + i) * 3);
          return <div key={i} style={{position: "absolute", left: 120 + col * 240 + (row % 2) * 120 - f * 0.8, top: 120 + row * 210 + Math.sin(f * 0.04 + i) * 6, width: 70, height: 70,
            border: `5px solid ${C.ink}`, borderRadius: kind === 0 ? "50%" : kind === 1 ? 8 : "50% 50% 8px 8px", transform: `rotate(${random("cr" + i) * 30 - 15}deg)`}}/>;
        })}
      </AbsoluteFill>
      <div style={{position: "absolute", left: 0, right: 0, top: 452, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 40, letterSpacing: 6,
        color: C.markerRed, textTransform: "uppercase", opacity: k, transform: `translateY(${(1 - k) * 20}px)`}}>Chapter {n}:</div>
      <div style={{position: "absolute", left: 0, right: 0, top: 510, height: 290, overflow: "hidden", textAlign: "center"}}>
        <div style={{fontFamily: F.serif, fontSize: sz, lineHeight: 1.1, color: C.ink, whiteSpace: "nowrap", transform: `translateY(${(1 - w) * 290}px)`}}>{word}</div>
      </div>
      <div style={{position: "absolute", left: 960 - uw / 2, top: 810, width: uw, height: 22, background: C.highlight, transform: `scaleX(${u})`, transformOrigin: "0 50%", mixBlendMode: "multiply"}}/>
    </AbsoluteFill>
  );
};

/** Year strip with string labels; the red pointer sits on stops[0] at once and glides to each next stop at its `at` (ticks). Screen space. */
export const TimelineS: React.FC<{f: number; at: number; labels: string[]; stops: {i: number; at: number}[]; y: number; x0: number; x1: number}> = ({f, at, labels, stops, y, x0, x1}) => {
  const ent = ease(f, at, at + 10, outQuint);
  if (ent <= 0) return null;
  const n = labels.length, xOf = (i: number) => x0 + ((x1 - x0) * i) / (n - 1);
  let pos = xOf(stops[0].i);
  for (let k = 1; k < stops.length; k++) pos += (xOf(stops[k].i) - xOf(stops[k - 1].i)) * ease(f, stops[k].at, stops[k].at + 20, inOut);
  const cur = Math.round(((pos - x0) / (x1 - x0)) * (n - 1));
  return (
    <div style={{position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translateY(${(1 - ent) * 220}px)`}}>
      <div style={{position: "absolute", left: x0 - 90, top: y - 66, width: x1 - x0 + 180, height: 140, background: "#FBF8F1", boxShadow: "0 3px 4px rgba(30,20,10,0.16), 0 14px 30px rgba(30,20,10,0.22)", transform: "rotate(-0.5deg)"}}/>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        <line x1={x0 - 40} x2={x1 + 40} y1={y} y2={y} stroke={C.ink} strokeWidth={4}/>
        {labels.map((l, i) => <line key={l} x1={xOf(i)} x2={xOf(i)} y1={y - 12} y2={y + 12} stroke={C.ink} strokeWidth={i === cur ? 6 : 3}/>)}
        <path d={`M ${pos - 18} ${y - 46} L ${pos + 18} ${y - 46} L ${pos} ${y - 18} Z`} fill={C.markerRed}/>
      </svg>
      {labels.map((l, i) => (
        <div key={l} style={{position: "absolute", left: xOf(i), top: y + 38, transform: `translate(-50%, -50%) scale(${i === cur ? 1.3 : 1})`, whiteSpace: "nowrap",
          fontFamily: i === cur ? F.serif : F.mono, fontSize: i === cur ? 44 : 28, color: i === cur ? C.ink : C.grey}}>{l}</div>
      ))}
    </div>
  );
};

export type ShareBar = {label: string; v: number; txt: string; at: number; key?: boolean};
/** Bars on black with each bar cued to its own word; the key bar turns yellow and gets a marker circle. */
export const ShareBars: React.FC<{f: number; title: string; source: string; bars: ShareBar[]; max: number; box?: {x: number; y: number; w: number; h: number}}> =
  ({f, title, source, bars, max, box = {x: 330, y: 330, w: 1260, h: 480}}) => {
    const tp = ease(f, 0, 12, outQuint), n = bars.length, slot = box.w / n, bw = Math.min(250, slot * 0.5);
    const yOf = (v: number) => box.y + box.h - (v / max) * box.h;
    return (
      <>
        <div style={{position: "absolute", left: box.x - 20, top: 110, fontFamily: F.serif, fontSize: 88, color: C.white, opacity: tp, transform: `translateY(${(1 - tp) * 30}px)`}}>{title}</div>
        <div style={{position: "absolute", left: box.x - 16, top: 216, fontFamily: F.mono, fontSize: 22, color: "#9C968C", letterSpacing: 3, textTransform: "uppercase", opacity: tp}}>{source}</div>
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          {[0.5, 1].map((g, i) => <line key={i} x1={box.x - 20} x2={box.x - 20 + (box.w + 40) * ease(f, 4, 24, outCubic)} y1={box.y + box.h - g * box.h} y2={box.y + box.h - g * box.h}
            stroke={g === 1 ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.16)"} strokeWidth={g === 1 ? 3 : 2} strokeDasharray={g === 1 ? undefined : "6 10"}/>)}
          {bars.map((b, i) => {
            const g = ease(f, b.at, b.at + 26, (t) => 1 - Math.pow(1 - t, 4));
            if (g <= 0) return null;
            const cx = box.x + slot * (i + 0.5), top = yOf(b.v * g), turn = b.key ? ease(f, b.at + 24, b.at + 32, outCubic) : 0;
            return <rect key={i} x={cx - bw / 2} y={top} width={bw} height={Math.max(3, box.y + box.h - top)} fill={b.key && turn > 0.5 ? C.highlightPrint : C.chartBlue}/>;
          })}
          {bars.filter((b) => b.key).map((b, i) => {
            const idx = bars.indexOf(b), cx = box.x + slot * (idx + 0.5), top = yOf(b.v);
            return <MarkerCircle key={i} f={f} at={b.at + 34} rect={[cx - bw / 2 - 10, top - 120, bw + 20, box.y + box.h - top + 128]} dur={14} color={C.markerRed} width={8} padX={0.1} padY={0.12}/>;
          })}
        </svg>
        {bars.map((b, i) => {
          const g = ease(f, b.at, b.at + 26, (t) => 1 - Math.pow(1 - t, 4));
          const cx = box.x + slot * (i + 0.5), lp = ease(f, b.at - 2, b.at + 8, outQuint), pop = b.key ? spr(f, b.at + 24, 10, 220) : 0;
          return (
            <React.Fragment key={i}>
              <div style={{position: "absolute", left: cx, top: box.y + box.h + 56, transform: `translate(-50%, -50%) translateY(${(1 - lp) * 16}px)`, opacity: lp, fontFamily: F.sans, fontWeight: 600,
                fontSize: 34, color: "#CFC9BE", whiteSpace: "nowrap"}}>{b.label}</div>
              {g > 0 ? <div style={{position: "absolute", left: cx, top: yOf(b.v * g) - 54, transform: `translate(-50%, -50%) scale(${1 + 0.16 * pop * (1 - clamp01((f - b.at - 32) / 10))})`,
                fontFamily: F.serif, fontSize: b.key ? 84 : 72, color: b.key && g > 0.98 ? C.highlightPrint : C.white, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums"}}>
                {g > 0.98 ? b.txt : (b.v * g).toFixed(1) + "%"}</div> : null}
            </React.Fragment>
          );
        })}
      </>
    );
  };

/** Big sticky note: pops in at (x, y) large, then glides to a corner at `moveAt` and stays pinned there. */
export const StickyBig: React.FC<{f: number; at: number; moveAt: number; big: string; small: string; x?: number; y?: number; toX?: number; toY?: number}> =
  ({f, at, moveAt, big, small, x = 960, y = 520, toX = 1680, toY = 210}) => {
    if (f < at) return null;
    const s = spr(f, at, 12, 170), m = ease(f, moveAt, moveAt + 22, inOut);
    const px = x + (toX - x) * m, py = y + (toY - y) * m, sc = (0.6 + 0.4 * s) * (1.9 - 0.9 * m);
    const r = 3 - 8 * (1 - s) + 2 * m, sh = shake(f, at + 3, 6, "stick");
    return (
      <div style={{position: "absolute", left: px + sh.x * (1 - m), top: py + sh.y * (1 - m), transform: `translate(-50%, -50%) rotate(${r}deg) scale(${sc})`, opacity: clamp01(s * 3), width: 330,
        padding: "34px 20px 26px", background: "linear-gradient(170deg, #FFF36B, #FBE54A)", boxShadow: "0 3px 3px rgba(0,0,0,0.18), 0 18px 28px rgba(0,0,0,0.28)", textAlign: "center", color: C.ink}}>
        <div style={{position: "absolute", left: 145, top: -12, width: 44, height: 24, background: "rgba(230,220,190,0.85)", transform: "rotate(-4deg)"}}/>
        <div style={{fontFamily: F.marker, fontSize: 96, lineHeight: 1}}>{big}</div>
        <div style={{fontFamily: F.marker, fontSize: 34, lineHeight: 1.1, marginTop: 10}}>{small}</div>
      </div>
    );
  };

/** "≈3%": the approx sign in Inter (DM Serif has no reliable glyph), the number counting up in serif. */
export const ApproxNum: React.FC<{f: number; at: number; to: number; x: number; y: number; size?: number; color?: string; dur?: number}> = ({f, at, to, x, y, size = 320, color = C.white, dur = 24}) => {
  if (f < at) return null;
  const s = spr(f, at, 11, 200), v = to * ease(f, at, at + dur, (t) => 1 - Math.pow(1 - t, 4)), sh = shake(f, at + 5, 7, "ap");
  return (
    <div style={{position: "absolute", left: x + sh.x, top: y + sh.y, transform: `translate(-50%, -50%) scale(${1.5 - 0.5 * s})`, opacity: clamp01(s * 3), whiteSpace: "nowrap", color, lineHeight: 1,
      filter: s < 0.8 ? `blur(${((0.8 - s) * 16).toFixed(1)}px)` : undefined}}>
      <span style={{fontFamily: F.sans, fontWeight: 300, fontSize: size * 0.62, marginRight: size * 0.06}}>≈</span>
      <span style={{fontFamily: F.serif, fontSize: size, letterSpacing: -size * 0.02, fontVariantNumeric: "tabular-nums"}}>{Math.round(v)}%</span>
    </div>
  );
};

/** Desk with a plain keyframed camera (no random opening glide): for type-only and chart shots that must stay centred. */
export const DeskP: React.FC<{f: number; d: number; cam?: CamKey[]; tone?: "cream" | "kraft" | "ink"; chip?: string; children?: React.ReactNode; over?: React.ReactNode}> =
  ({f, d, cam, tone = "cream", chip, children, over}) => {
    const c = camAt(f, cam ?? [[0, 1.0, 960, 540], [d, 1.04, 960, 540]]);
    const dark = tone === "ink";
    return (
      <AbsoluteFill>
        {dark ? <InkSurface glow={0.08}/> : <Layer cam={c} depth={0.85}><Paper tone={tone === "kraft" ? "kraft" : "cream"} drift={f / Math.max(1, d)}/></Layer>}
        <Layer cam={c}>{children}</Layer>
        {over}
        {chip ? <SourceTag f={f} at={0} text={chip} dark={dark}/> : null}
        <Finish f={f} dark={dark}/>
      </AbsoluteFill>
    );
  };
