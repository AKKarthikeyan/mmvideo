// Jio film, chapters 3 and 4: shared pieces (20 Oct 2026). Everything is in TICKS (1/30 s) like the rest of the kit.
// Stage = desk/black + camera layer + source chip + finish; Chap = chapter card with a size; Waterfall = the "follow
// Rs 100" chart (one long world, the camera glides across it); ShareBars / PairBars / RateTable = the charts on black.
import React from "react";
import {AbsoluteFill, random} from "remotion";
import {Paper} from "../A01V4Parts";
import {camAt, CamKey, Layer} from "../Camera";
import {SourceTag} from "../Cards";
import {MarkerCircle} from "../Marker";
import {Finish, InkSurface, PaperSurface} from "../Texture";
import {C, F, W, H, clamp01, ease, outCubic, outQuint, shake, spr} from "../tokens";

// ---------------------------------------------------------------------------------------------------------------
// stage
// ---------------------------------------------------------------------------------------------------------------
export const Stage: React.FC<{f: number; d: number; cam: CamKey[]; tone?: "cream" | "kraft" | "ink"; chip?: string; over?: React.ReactNode; children?: React.ReactNode}> =
  ({f, d, cam, tone = "cream", chip, over, children}) => {
    const c = camAt(f, cam), dark = tone === "ink";
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

/** screen position of a world point under a camera (for push-through transitions) */
export const toScreen = (cam: CamKey[], f: number, x: number, y: number) => {
  const c = camAt(f, cam);
  return {x: (x - c.x) * c.s + W / 2, y: (y - c.y) * c.s + H / 2};
};

// ---------------------------------------------------------------------------------------------------------------
// chapter card (the kit's ChapterCard with a size, so a long chapter word fits)
// ---------------------------------------------------------------------------------------------------------------
export const Chap: React.FC<{f: number; n: number; word: string; kicker?: string; size?: number}> = ({f, n, word, kicker, size = 230}) => {
  const k = ease(f, 0, 12, outQuint), w = ease(f, 6, 20, outQuint), u = ease(f, 22, 34, (t) => t * t * (3 - 2 * t));
  return (
    <AbsoluteFill>
      <PaperSurface drift={clamp01(f / 90)}/>
      <AbsoluteFill style={{opacity: 0.11}}>
        {Array.from({length: 40}).map((_, i) => {
          const col = i % 8, row = Math.floor(i / 8), kind = Math.floor(random("ci" + i) * 3);
          const x = 120 + col * 240 + (row % 2) * 120 - f * 0.8, y = 120 + row * 210 + Math.sin(f * 0.04 + i) * 6;
          return <div key={i} style={{position: "absolute", left: x, top: y, width: 70, height: 70, border: `5px solid ${C.ink}`,
            borderRadius: kind === 0 ? "50%" : kind === 1 ? 8 : "50% 50% 8px 8px", transform: `rotate(${random("cr" + i) * 30 - 15}deg)`}}/>;
        })}
      </AbsoluteFill>
      {kicker ? <div style={{position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", fontFamily: F.serif, fontStyle: "italic", fontSize: 46,
        color: C.inkSoft, opacity: k}}>{kicker}</div> : null}
      <div style={{position: "absolute", left: 0, right: 0, top: 452, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 40, letterSpacing: 6,
        color: C.markerRed, textTransform: "uppercase", opacity: k}}>Chapter {n}:</div>
      <div style={{position: "absolute", left: 0, right: 0, top: 510, height: 260, overflow: "hidden", textAlign: "center"}}>
        <div style={{fontFamily: F.serif, fontSize: size, lineHeight: 1.05, color: C.ink, transform: `translateY(${(1 - w) * 260}px)`,
          paddingTop: (230 - size) * 0.5}}>{word}</div>
      </div>
      <div style={{position: "absolute", left: 960 - 330, top: 782, width: 660, height: 22, background: C.highlight, transform: `scaleX(${u})`, transformOrigin: "0 50%",
        mixBlendMode: "multiply"}}/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// small type helpers (the rupee sign is set in Inter: DM Serif Display has no U+20B9)
// ---------------------------------------------------------------------------------------------------------------
export const Rs: React.FC<{v: string; size: number; color?: string; sign?: string}> = ({v, size, color = C.white, sign = ""}) => (
  <span style={{color, whiteSpace: "nowrap"}}>
    {sign ? <span style={{fontFamily: F.sans, fontWeight: 600, fontSize: size * 0.7}}>{sign}</span> : null}
    <span style={{fontFamily: F.sans, fontWeight: 600, fontSize: size * 0.8}}>₹</span>
    <span style={{fontFamily: F.serif, fontSize: size, letterSpacing: -size * 0.02, fontVariantNumeric: "tabular-nums"}}>{v}</span>
  </span>
);

/** Chart title (serif) and its small mono source line, in screen space. */
export const ChartTitle: React.FC<{f: number; at?: number; title: React.ReactNode; sub?: string; x?: number; y?: number; size?: number}> =
  ({f, at = 0, title, sub, x = 140, y = 100, size = 88}) => {
    const p = ease(f, at, at + 12, outQuint), q = ease(f, at + 6, at + 18, outQuint);
    return (
      <>
        <div style={{position: "absolute", left: x, top: y, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, fontFamily: F.serif, fontSize: size, color: C.white,
          lineHeight: 1, whiteSpace: "nowrap"}}>{title}</div>
        {sub ? <div style={{position: "absolute", left: x + 4, top: y + size + 14, opacity: q, fontFamily: F.mono, fontSize: 22, color: "#9C968C", letterSpacing: 3,
          textTransform: "uppercase", whiteSpace: "nowrap"}}>{sub}</div> : null}
      </>
    );
  };

/** Serif words, each arriving at its own spoken moment; `mark` words get a yellow box that wipes in at `markAt`. */
export type CW = {w: string; at: number; mark?: boolean; markAt?: number; color?: string};
export const CueWords: React.FC<{f: number; words: CW[]; x: number; y: number; size?: number; maxWidth?: number; color?: string; italic?: boolean}> =
  ({f, words, x, y, size = 140, maxWidth = 1700, color = C.white, italic}) => (
    <div style={{position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", display: "flex", flexWrap: "wrap", justifyContent: "center",
      columnGap: size * 0.26, rowGap: size * 0.05, width: maxWidth}}>
      {words.map((w, i) => {
        const s = spr(f, w.at, 14, 170);
        const mp = w.mark ? ease(f, w.markAt ?? w.at + 8, (w.markAt ?? w.at + 8) + 9, outCubic) : 0;
        return (
          <span key={i} style={{position: "relative", display: "inline-block", transform: `translateY(${(1 - s) * size * 0.45}px)`, opacity: clamp01(s * 2.2),
            filter: s < 0.7 ? `blur(${((0.7 - s) * 14).toFixed(1)}px)` : undefined}}>
            {w.mark ? <span style={{position: "absolute", left: -size * 0.08, right: -size * 0.08, top: size * 0.16, bottom: size * 0.02, background: C.highlight,
              transform: `scaleX(${mp})`, transformOrigin: "0 50%", zIndex: 0}}/> : null}
            <span style={{position: "relative", fontFamily: F.serif, fontStyle: italic ? "italic" : "normal", fontSize: size, lineHeight: 1.05,
              color: w.mark && mp > 0.5 ? C.ink : w.color ?? color, letterSpacing: -size * 0.01, zIndex: 1}}>{w.w}</span>
          </span>
        );
      })}
    </div>
  );

// ---------------------------------------------------------------------------------------------------------------
// q31: four operators, one row each, cued word by word
// ---------------------------------------------------------------------------------------------------------------
export type ShareRow = {name: string; crore: number; pct: number; key?: boolean; nameAt: number; croreAt: number; pctAt: number; barAt?: number};
const SB_X = 660, SB_K = 19.5, SB_Y0 = 372, SB_P = 152, SB_H = 92;
export const ShareBars: React.FC<{f: number; rows: ShareRow[]}> = ({f, rows}) => {
  const axisP = ease(f, 2, 20, outCubic);
  return (
    <>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <line x1={SB_X - 8} x2={SB_X - 8} y1={SB_Y0 - 74} y2={SB_Y0 - 74 + (SB_P * 3 + 148) * axisP} stroke="rgba(255,255,255,0.7)" strokeWidth={3}/>
        {rows.map((r, i) => {
          const g = ease(f, r.barAt ?? r.croreAt, (r.barAt ?? r.croreAt) + 28, (t) => 1 - Math.pow(1 - t, 4));
          if (g <= 0) return null;
          const y = SB_Y0 + i * SB_P;
          return <rect key={i} x={SB_X} y={y - SB_H / 2} width={Math.max(3, r.pct * SB_K * g)} height={SB_H} fill={r.key ? C.highlightPrint : C.chartBlue}/>;
        })}
      </svg>
      {rows.map((r, i) => {
        const y = SB_Y0 + i * SB_P;
        const np = ease(f, r.nameAt, r.nameAt + 10, outQuint);
        const cp = ease(f, r.croreAt, r.croreAt + 26, (t) => 1 - Math.pow(1 - t, 4));
        const pp = ease(f, r.pctAt, r.pctAt + 20, (t) => 1 - Math.pow(1 - t, 4));
        const pop = spr(f, r.pctAt, 10, 220);
        return (
          <React.Fragment key={i}>
            <div style={{position: "absolute", left: 140 - (1 - np) * 120, top: y - 52, opacity: np, fontFamily: F.sans, fontWeight: 800, fontSize: 40, letterSpacing: 1,
              color: "#E6E0D4", textTransform: "uppercase", whiteSpace: "nowrap"}}>{r.name}</div>
            {cp > 0 ? <div style={{position: "absolute", left: 140, top: y + 2, fontFamily: F.serif, fontSize: 50, color: r.key ? C.highlightPrint : "#CFC9BE", whiteSpace: "nowrap",
              fontVariantNumeric: "tabular-nums"}}>{(r.crore * cp).toFixed(2)}<span style={{fontFamily: F.sans, fontWeight: 700, fontSize: 26, letterSpacing: 2, marginLeft: 12}}>CRORE</span></div> : null}
            {pp > 0 ? <div style={{position: "absolute", left: SB_X + r.pct * SB_K + 28, top: y, transform: `translate(0, -50%) scale(${1 + 0.16 * pop * (1 - clamp01((f - r.pctAt - 8) / 10))})`,
              transformOrigin: "0 50%", fontFamily: F.serif, fontSize: r.key ? 96 : 84, color: r.key ? C.highlightPrint : C.white, whiteSpace: "nowrap",
              fontVariantNumeric: "tabular-nums"}}>{(r.pct * pp).toFixed(2)}%</div> : null}
          </React.Fragment>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// q33 / q42: two vertical bars, honest scale, each cued
// ---------------------------------------------------------------------------------------------------------------
export type PairBar = {label: string; sub?: string; v: number; text: (v: number, done: boolean) => string; at: number; subAt?: number; key?: boolean; dur?: number};
export const PairBars: React.FC<{f: number; bars: PairBar[]; max: number; box?: {x: number; y: number; w: number; h: number}; circleAt?: number}> =
  ({f, bars, max, box = {x: 460, y: 320, w: 1000, h: 480}, circleAt}) => {
    const slot = box.w / bars.length, bw = 250;
    const top = (v: number) => box.y + box.h - (v / max) * box.h;
    const axisP = ease(f, 0, 16, outCubic);
    return (
      <>
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <line x1={box.x - 30} x2={box.x - 30 + (box.w + 60) * axisP} y1={box.y + box.h} y2={box.y + box.h} stroke="rgba(255,255,255,0.75)" strokeWidth={3}/>
          {bars.map((b, i) => {
            const g = ease(f, b.at, b.at + (b.dur ?? 30), (t) => 1 - Math.pow(1 - t, 4));
            if (g <= 0) return null;
            const cx = box.x + slot * (i + 0.5), t = top(b.v * g);
            return <rect key={i} x={cx - bw / 2} y={t} width={bw} height={Math.max(3, box.y + box.h - t)} fill={b.key ? C.highlightPrint : C.chartBlue}/>;
          })}
          {circleAt != null ? (() => {
            const b = bars.findIndex((x) => x.key);
            if (b < 0) return null;
            const cx = box.x + slot * (b + 0.5);
            return <MarkerCircle f={f} at={circleAt} rect={[cx - 150, top(bars[b].v) - 120, 300, 110]} dur={14} color={C.markerRed} width={8} padX={0.1} padY={0.15}/>;
          })() : null}
        </svg>
        {bars.map((b, i) => {
          const g = ease(f, b.at, b.at + (b.dur ?? 30), (t) => 1 - Math.pow(1 - t, 4));
          const cx = box.x + slot * (i + 0.5);
          const lp = ease(f, (b.subAt ?? b.at) - 4, (b.subAt ?? b.at) + 6, outQuint);
          const pop = spr(f, b.at + 20, 10, 220);
          return (
            <React.Fragment key={i}>
              <div style={{position: "absolute", left: cx, top: box.y + box.h + 54, transform: `translate(-50%, -50%) translateY(${(1 - lp) * 16}px)`, opacity: lp, textAlign: "center",
                fontFamily: F.sans, fontWeight: 800, fontSize: 36, color: "#E6E0D4", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 1}}>{b.label}</div>
              {g > 0 ? <div style={{position: "absolute", left: cx, top: top(b.v * g) - 62, transform: `translate(-50%, -50%) scale(${1 + 0.14 * pop * (1 - clamp01((f - b.at - 30) / 10))})`,
                fontFamily: F.serif, fontSize: b.key ? 100 : 82, color: b.key ? C.highlightPrint : C.white, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums"}}>{b.text(b.v * g, g > 0.98)}</div> : null}
            </React.Fragment>
          );
        })}
      </>
    );
  };

// ---------------------------------------------------------------------------------------------------------------
// q45: margin table on black
// ---------------------------------------------------------------------------------------------------------------
export type RateRow = {label: string; vals: string[]; ats: number[]; key?: boolean; labelAt: number};
export const RateTable: React.FC<{f: number; cols: string[]; colsAt: number; rows: RateRow[]}> = ({f, cols, colsAt, rows}) => {
  const X0 = 150, CX = [1000, 1290, 1580], Y0 = 360, P = 190;
  const hp = ease(f, colsAt, colsAt + 12, outQuint);
  return (
    <>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <line x1={X0} x2={X0 + 1700 * ease(f, colsAt, colsAt + 22, outCubic)} y1={Y0 + 50} y2={Y0 + 50} stroke="rgba(255,255,255,0.7)" strokeWidth={3}/>
        {rows.map((r, i) => <line key={i} x1={X0} x2={X0 + 1700 * ease(f, r.labelAt, r.labelAt + 18, outCubic)} y1={Y0 + 50 + P * (i + 1) + 32} y2={Y0 + 50 + P * (i + 1) + 32}
          stroke="rgba(255,255,255,0.22)" strokeWidth={2} strokeDasharray="6 10"/>)}
      </svg>
      {cols.map((c, i) => <div key={i} style={{position: "absolute", left: CX[i], top: Y0, transform: `translate(-50%, 0) translateY(${(1 - hp) * 20}px)`, opacity: hp,
        fontFamily: F.sans, fontWeight: 800, fontSize: 44, letterSpacing: 4, color: "#CFC9BE"}}>{c}</div>)}
      {rows.map((r, i) => {
        const y = Y0 + 50 + P * (i + 0.5) + 16;
        const lp = ease(f, r.labelAt, r.labelAt + 12, outQuint);
        return (
          <React.Fragment key={i}>
            <div style={{position: "absolute", left: X0 + 10 - (1 - lp) * 80, top: y, transform: "translateY(-50%)", opacity: lp, fontFamily: F.sans, fontWeight: 800, fontSize: 38,
              letterSpacing: 1, textTransform: "uppercase", color: r.key ? C.highlightPrint : "#CFC9BE", lineHeight: 1.1, width: 560}}>{r.label}</div>
            {r.vals.map((v, j) => {
              const p = spr(f, r.ats[j], 11, 200), q = ease(f, r.ats[j], r.ats[j] + 14, (t) => 1 - Math.pow(1 - t, 4));
              if (p <= 0) return null;
              const num = parseFloat(v);
              return <div key={j} style={{position: "absolute", left: CX[j], top: y, transform: `translate(-50%, -50%) scale(${0.9 + 0.1 * p})`, opacity: clamp01(p * 3),
                fontFamily: F.serif, fontSize: r.key ? 132 : 112, color: r.key ? C.highlightPrint : "#B9B3A8", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums"}}>
                {(num * q).toFixed(1)}%</div>;
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// q43 + q44: follow Rs 100. One long world; each step is a bar that "falls" from the level before it.
// ---------------------------------------------------------------------------------------------------------------
export type WStep = {key: string; name: string[]; v: number; kind: "total" | "down" | "up" | "final"; at: number; color?: string};
export const WY0 = 800, WK = 5.0, WX0 = 110, WSL = 190, WBW = 128;
export const wfLevels = (steps: WStep[]) => {
  let lv = 0;
  return steps.map((s) => {
    const before = lv;
    let lo = 0, hi = 0;
    if (s.kind === "total" || s.kind === "final") { lo = 0; hi = s.v; lv = s.v; }
    else if (s.kind === "down") { hi = lv; lo = lv - s.v; lv = lo; }
    else { lo = lv; hi = lv + s.v; lv = hi; }
    return {before, lo, hi, after: lv};
  });
};
/** the running "left" amount, moving with the latest step that has started */
export const wfLeft = (f: number, steps: WStep[]) => {
  const L = wfLevels(steps);
  let out = 0;
  steps.forEach((s, i) => {
    if (f >= s.at) { const p = ease(f, s.at, s.at + 16, outCubic); out = L[i].before + (L[i].after - L[i].before) * p; }
  });
  return out;
};
export const wfX = (i: number) => WX0 + WSL * (i + 0.5);
export const wfY = (v: number) => WY0 - v * WK;
const MINT = "#4FD18B";
export const Waterfall: React.FC<{f: number; steps: WStep[]; circles?: {key: string; at: number}[]}> = ({f, steps, circles = []}) => {
  const L = wfLevels(steps), n = steps.length;
  const fmt = (v: number) => v.toFixed(1);
  return (
    <>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        {[25, 50, 75, 100].map((g) => <line key={g} x1={WX0 - 20} x2={WX0 - 20 + (n * WSL + 40)} y1={wfY(g)} y2={wfY(g)} stroke="rgba(255,255,255,0.13)" strokeWidth={2} strokeDasharray="6 10"/>)}
        <line x1={WX0 - 20} x2={WX0 - 20 + n * WSL + 40} y1={WY0} y2={WY0} stroke="rgba(255,255,255,0.75)" strokeWidth={3}/>
        {steps.map((s, i) => {
          const p = ease(f, s.at, s.at + 16, outCubic);
          if (p <= 0) return null;
          const cx = wfX(i), {lo, hi, before} = L[i], hgt = (hi - lo) * WK * p;
          const y = s.kind === "down" ? wfY(hi) : s.kind === "up" ? wfY(lo) - hgt : WY0 - hgt;
          const fill = s.color ?? (s.kind === "final" ? C.highlightPrint : s.kind === "total" ? "#D8D2C6" : s.kind === "up" ? MINT : C.chartBlue);
          const cp = ease(f, s.at - 2, s.at + 8, outCubic);
          return (
            <g key={i}>
              {i > 0 ? <line x1={wfX(i - 1) + WBW / 2} x2={wfX(i - 1) + WBW / 2 + (WSL - WBW) * cp} y1={wfY(before)} y2={wfY(before)} stroke="rgba(255,255,255,0.45)" strokeWidth={2.5} strokeDasharray="5 6"/> : null}
              <rect x={cx - WBW / 2} y={y} width={WBW} height={Math.max(3, hgt)} fill={fill}/>
            </g>
          );
        })}
        {circles.map((c, i) => {
          const si = steps.findIndex((s) => s.key === c.key);
          if (si < 0) return null;
          const cx = wfX(si), top = wfY(L[si].hi);
          return <MarkerCircle key={i} f={f} at={c.at} rect={[cx - 100, top - 78, 200, 70]} dur={14} color={C.markerRed} width={8} padX={0.12} padY={0.2} seed={"wc" + si}/>;
        })}
      </svg>
      {steps.map((s, i) => {
        const p = ease(f, s.at, s.at + 16, outCubic);
        const np = ease(f, s.at - 4, s.at + 8, outQuint);
        if (np <= 0) return null;
        const cx = wfX(i), {lo, hi} = L[i];
        const key = s.kind === "final";
        const size = key ? 70 : 54;
        const topAbove = wfY(hi) - (key ? 84 : 66), topBelow = wfY(lo) + 14;
        const below = s.kind === "down";
        const pop = key ? spr(f, s.at + 12, 10, 220) : 0;
        return (
          <React.Fragment key={i}>
            <div style={{position: "absolute", left: cx - WSL / 2, width: WSL, top: WY0 + 28, textAlign: "center", opacity: np, transform: `translateY(${(1 - np) * 14}px)`,
              fontFamily: F.sans, fontWeight: 800, fontSize: 23, letterSpacing: 1.2, color: key ? C.highlightPrint : "#CFC9BE", lineHeight: 1.25, textTransform: "uppercase"}}>
              {s.name.map((t, j) => <div key={j}>{t}</div>)}</div>
            {p > 0 ? <div style={{position: "absolute", left: cx, top: below ? topBelow : topAbove, transform: `translate(-50%, 0) scale(${1 + 0.16 * pop * (1 - clamp01((f - s.at - 22) / 10))})`,
              textAlign: "center", opacity: clamp01(p * 3)}}>
              <Rs v={fmt(s.v * p)} size={size} color={key ? C.highlightPrint : s.kind === "up" ? MINT : C.white} sign={s.kind === "up" ? "+" : ""}/></div> : null}
          </React.Fragment>
        );
      })}
    </>
  );
};

/** "LEFT ₹xx" counter, top right, in screen space */
export const LeftCounter: React.FC<{f: number; at: number; value: number; label?: string; hide?: boolean}> = ({f, at, value, label = "LEFT", hide}) => {
  const p = ease(f, at, at + 10, outQuint) * (hide ? 0 : 1);
  if (p <= 0) return null;
  return (
    <div style={{position: "absolute", right: 120, top: 92, opacity: p, textAlign: "right", transform: `translateY(${(1 - p) * 14}px)`}}>
      <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: "#9C968C"}}>{label}</div>
      <Rs v={value.toFixed(1)} size={118} color={C.highlightPrint}/>
    </div>
  );
};

export {shake};
