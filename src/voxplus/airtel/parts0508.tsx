// Scenes 05-08 | local helpers for Builder B (postpaid, convergence, what the homes earn, stickiness). Drawn in code; every value is passed in
// by the scene from the ledger / claims. Local variants (the shared devices stay untouched): PostpaidDots (a DotGrid whose lit dots go
// 83 -> 76), ZBars (zero-based bars with stacked segment, label timing and inside labels), MiniLine (small zero-based line),
// GapBracket, Panel, Tile, T (text).
import React from "react";
import {AbsoluteFill, random} from "remotion";
import {Layer} from "./kit/Camera";
import {SourceTag} from "./kit/Cards";
import {Paper} from "./kit/A01V4Parts";
import {Finish} from "./kit/Texture";
import {C, F, clamp01, ease, outCubic, outQuint, spr} from "./kit/tokens";

/** Shot frame like kit Desk but WITHOUT the random lateral glide (it pushed edge content off screen): paper, a settle-in (scale 1.05 -> 1.0 in 0.6 s, unless
 *  `intro` is false for continuing shots) and a barely-there drift, source chip, finish. Camera centre never moves. */
export const Stage: React.FC<{f: number; d: number; chip?: string; intro?: boolean; children?: React.ReactNode}> = ({f, d, chip, intro = true, children}) => {
  const sc = (intro ? 1 + 0.05 * (1 - outCubic(clamp01(f / 18))) : 1) * (1 + 0.012 * clamp01(f / Math.max(1, d)));
  const cam = {s: sc, x: 960, y: 540};
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><Paper tone="cream" drift={f / Math.max(1, d)}/></Layer>
      <Layer cam={cam}>{children}</Layer>
      {chip ? <SourceTag f={f} at={0} text={chip}/> : null}
      <Finish f={f}/>
    </AbsoluteFill>
  );
};


/** Text that springs in at tick `at`, optionally out at `out`. */
export const T: React.FC<{f: number; at: number; text: string; x: number; y: number; size?: number; color?: string; weight?: 600 | 800 | 900;
  align?: "left" | "center" | "right"; spacing?: number; mono?: boolean; bg?: string; out?: number; rot?: number; pad?: number; maxW?: number}> =
  ({f, at, text, x, y, size = 36, color = C.ink, weight = 800, align = "left", spacing = 0, mono, bg, out, rot = 0, pad, maxW}) => {
    const p = ease(f, at, at + 9, outQuint) * (out != null ? 1 - ease(f, out, out + 8) : 1);
    if (p <= 0.01) return null;
    const tx = align === "center" ? "-50%" : align === "right" ? "-100%" : "0";
    const pp = pad ?? (bg ? size * 0.3 : 0);
    return (
      <div style={{position: "absolute", left: x, top: y, transform: `translate(${tx}, -50%) translateY(${(1 - p) * 14}px) rotate(${rot}deg)`, opacity: p, whiteSpace: maxW ? "normal" : "nowrap",
        width: maxW, fontFamily: mono ? F.mono : F.sans, fontWeight: mono ? 500 : weight, fontSize: size, letterSpacing: spacing, color, background: bg,
        padding: bg ? `${pp}px ${pp * 1.8}px` : undefined, lineHeight: 1.15, textAlign: align}}>{text}</div>
    );
  };

/** White figure tile: one big number and a small caption. */
export const Tile: React.FC<{f: number; at: number; x: number; y: number; w: number; big: string; sub: string; color?: string; bigSize?: number; subSize?: number; out?: number}> =
  ({f, at, x, y, w, big, sub, color = C.ink, bigSize = 84, subSize = 28, out}) => {
    const p = spr(f, at, 14, 150) * (out != null ? 1 - ease(f, out, out + 8) : 1);
    if (p <= 0.01) return null;
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y, width: w, opacity: clamp01(p * 2), transform: `translateY(${(1 - p) * 120}px)`, background: C.white, borderRadius: 14,
        boxShadow: "0 3px 4px rgba(30,20,10,0.14), 0 18px 34px rgba(30,20,10,0.2)", padding: "22px 28px 20px", fontFamily: F.sans, transformOrigin: "50% 100%"}}>
        <div style={{fontWeight: 800, fontSize: bigSize, lineHeight: 1.05, color, whiteSpace: "nowrap"}}>{big}</div>
        <div style={{marginTop: 8, fontWeight: 600, fontSize: subSize, color: C.grey, lineHeight: 1.2}}>{sub}</div>
      </div>
    );
  };

/** White card panel with a title and a mono sub-line; children use panel-local coordinates. */
export const Panel: React.FC<{f: number; at: number; x: number; y: number; w: number; h: number; title: string; sub?: string; children?: React.ReactNode}> =
  ({f, at, x, y, w, h, title, sub, children}) => {
    const p = spr(f, at, 14, 150);
    if (p <= 0.01) return null;
    return (
      <div style={{position: "absolute", left: x, top: y, width: w, height: h, opacity: clamp01(p * 2), transform: `translateY(${(1 - p) * 160}px)`, background: C.white, borderRadius: 14,
        boxShadow: "0 3px 4px rgba(30,20,10,0.14), 0 18px 34px rgba(30,20,10,0.2)", fontFamily: F.sans}}>
        <div style={{position: "absolute", left: 26, top: 20, fontWeight: 800, fontSize: 29, color: C.ink, whiteSpace: "nowrap"}}>{title}</div>
        {sub ? <div style={{position: "absolute", left: 26, top: 64, fontFamily: F.mono, fontSize: 20, letterSpacing: 1, color: C.grey, whiteSpace: "nowrap"}}>{sub}</div> : null}
        {children}
      </div>
    );
  };

// ---------------------------------------------------------------------------------------------------------------------
// Zero-based bars. Each item: bar grows at `at`, its label appears at `labelAt` (default `at`); optional stacked `seg` part (e.g. the quarter's
// addition) grows at seg.at on top of the base part `seg.from`. `inside` puts the label inside the bar top (white).
// ---------------------------------------------------------------------------------------------------------------------
export type ZItem = {label: string; v: number; text: string; at: number; labelAt?: number; color?: string; seg?: {from: number; color: string; at: number}; inside?: boolean;
  textColor?: string; textSize?: number; dim?: boolean};
export const ZBars: React.FC<{f: number; x: number; y: number; w: number; h: number; items: ZItem[]; max: number; barW?: number; textSize?: number; labelSize?: number}> =
  ({f, x, y, w, h, items, max, barW = 140, textSize = 44, labelSize = 26}) => {
    const slot = w / items.length;
    return (
      <div style={{position: "absolute", left: x, top: y, width: w, height: h, fontFamily: F.sans}}>
        <div style={{position: "absolute", left: 0, top: h, width: w, height: 3, background: C.ink}}/>
        {items.map((b, i) => {
          const base = b.seg ? b.seg.from : b.v;
          const k = ease(f, b.at, b.at + 20, outQuint), k2 = b.seg ? ease(f, b.seg.at, b.seg.at + 20, outQuint) : 0;
          const bh = (base / max) * h * k, sh = b.seg ? ((b.v - base) / max) * h * k2 : 0;
          const lx = i * slot + (slot - barW) / 2, la = b.labelAt ?? b.at;
          const lp = ease(f, la, la + 8, outCubic), ts = b.textSize ?? textSize;
          const top = h - bh - sh;
          return (
            <div key={i}>
              <div style={{position: "absolute", left: lx, top: h - bh, width: barW, height: bh, background: b.color ?? C.teal, opacity: b.dim ? 0.55 : 1}}/>
              {b.seg ? <div style={{position: "absolute", left: lx, top: top, width: barW, height: sh, background: b.seg.color}}/> : null}
              <div style={{position: "absolute", left: i * slot, width: slot, top: b.inside ? top + 12 : top - ts - 14, textAlign: "center", fontWeight: 800, fontSize: ts,
                color: b.inside ? C.white : (b.textColor ?? C.ink), opacity: lp, lineHeight: 1}}>{b.text}</div>
              <div style={{position: "absolute", left: i * slot, width: slot, top: h + 16, textAlign: "center", fontWeight: 600, fontSize: labelSize, color: C.grey, lineHeight: 1.15,
                whiteSpace: "pre-line", opacity: clamp01(k * 3)}}>{b.label}</div>
            </div>
          );
        })}
      </div>
    );
  };

/** Dashed level line + translucent rust block between two bar tops (the gap), with a label inside. Geometry must match the ZBars it sits on. */
export const GapBracket: React.FC<{f: number; at: number; x: number; y: number; w: number; h: number; max: number; slots: number; lowIdx: number; highIdx: number; vLow: number; vHigh: number;
  barW?: number; text: string; textSize?: number}> = ({f, at, x, y, w, h, max, slots, lowIdx, highIdx, vLow, vHigh, barW = 140, text, textSize = 28}) => {
  const p = ease(f, at, at + 14, outQuint);
  if (p <= 0.01) return null;
  const slot = w / slots, yh = h - (vHigh / max) * h, yl = h - (vLow / max) * h;
  const lx = lowIdx * slot + (slot - barW) / 2, hx = highIdx * slot + (slot - barW) / 2;
  return (
    <div style={{position: "absolute", left: x, top: y, width: w, height: h, opacity: p, fontFamily: F.sans, pointerEvents: "none"}}>
      <div style={{position: "absolute", left: hx + barW, top: yh - 1.5, width: lx + barW - hx - barW, height: 0, borderTop: `3px dashed ${C.rust}`}}/>
      <div style={{position: "absolute", left: lx, top: yh, width: barW, height: (yl - yh) * p, background: "repeating-linear-gradient(135deg, rgba(224,36,94,0.30) 0 10px, rgba(224,36,94,0.12) 10px 20px)",
        border: `3px solid ${C.rust}`, boxSizing: "border-box"}}/>
      <div style={{position: "absolute", left: lx - 20, width: barW + 40, top: yh + (yl - yh) / 2 - textSize / 2, textAlign: "center", fontWeight: 900, fontSize: textSize, color: C.rust, lineHeight: 1, opacity: p}}>{text}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// Small zero-based line (no invented points): line draws left to right; value labels appear as the line reaches each point; x labels only at
// the ends. `ringLast` rings the last point at that tick.
// ---------------------------------------------------------------------------------------------------------------------
export const MiniLine: React.FC<{f: number; at: number; x: number; y: number; w: number; h: number; vals: number[]; max: number; xl: [string, string]; drawDur?: number;
  color?: string; ringAt?: number; labelSize?: number}> = ({f, at, x, y, w, h, vals, max, xl, drawDur = 90, color = C.teal, ringAt, labelSize = 24}) => {
  const n = vals.length, px = (i: number) => (i / (n - 1)) * w, py = (v: number) => h - (v / max) * h;
  const prog = ease(f, at, at + drawDur, outCubic) * (n - 1);
  const d = vals.map((v, i) => `${i ? "L" : "M"}${px(i)} ${py(v)}`).join(" ");
  const ring = ringAt != null ? ease(f, ringAt, ringAt + 8, outCubic) : 0;
  return (
    <div style={{position: "absolute", left: x, top: y, width: w, height: h, fontFamily: F.sans}}>
      <svg width={w} height={h} style={{overflow: "visible"}}>
        <line x1={0} y1={h} x2={w} y2={h} stroke={C.ink} strokeWidth={3}/>
        <path d={d} fill="none" stroke={color} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - prog / (n - 1)}/>
        {vals.map((v, i) => {
          if (i > prog) return null;
          const end = i === 0 || i === n - 1;
          return (
            <g key={i}>
              <circle cx={px(i)} cy={py(v)} r={end ? 10 : 7} fill={color}/>
              <text x={px(i)} y={py(v) - (end ? 28 : 20)} textAnchor="middle" fontWeight={end ? 900 : 700} fontSize={end ? 36 : labelSize} fill={end ? C.ink : C.grey}>{v}</text>
            </g>
          );
        })}
        {ring > 0 ? <circle cx={px(n - 1)} cy={py(vals[n - 1])} r={13 + 9 * ring} fill="none" stroke={C.markerRed} strokeWidth={6} opacity={ring}/> : null}
        <text x={0} y={h + 40} textAnchor="start" fontWeight={600} fontSize={26} fill={C.grey}>{xl[0]}</text>
        <text x={w} y={h + 40} textAnchor="end" fontWeight={600} fontSize={26} fill={C.grey}>{xl[1]}</text>
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------------
// Local variant of DotGrid (scene 05): 1,000 dots, `n1` seeded dots turn rust from tick `litAt`; at `dropAt` the last (n1 - n2) of them
// fade back, leaving n2 lit. Illustration of a share per 1,000, not a count of customers.
// ---------------------------------------------------------------------------------------------------------------------
export const PostpaidDots: React.FC<{f: number; at: number; x: number; y: number; n1: number; n2: number; litAt: number; dropAt: number; cell?: number; cols?: number; seed?: string}> =
  ({f, at, x, y, n1, n2, litAt, dropAt, cell = 19, cols = 40, seed = "postpaid"}) => {
    const e = ease(f, at, at + 14, outCubic);
    const n = 1000, rows = n / cols;
    const order = React.useMemo(() => Array.from({length: n}, (_, i) => i).sort((a, b) => random(seed + a) - random(seed + b)).slice(0, n1), [seed, n1]);
    const rank = React.useMemo(() => new Map(order.map((d, k) => [d, k])), [order]);
    if (e <= 0) return null;
    return (
      <div style={{position: "absolute", left: x - (cols * cell) / 2, top: y - (rows * cell) / 2, width: cols * cell, height: rows * cell, opacity: e}}>
        <svg width={cols * cell} height={rows * cell}>
          {Array.from({length: n}, (_, i) => {
            const cx = (i % cols) * cell + cell / 2, cy = Math.floor(i / cols) * cell + cell / 2;
            const k = rank.get(i);
            let lit = 0;
            if (k !== undefined) {
              lit = ease(f, litAt + k * 0.5, litAt + k * 0.5 + 5);
              if (k >= n2) lit *= 1 - ease(f, dropAt + (k - n2) * 3, dropAt + (k - n2) * 3 + 8);
            }
            return <circle key={i} cx={cx} cy={cy} r={cell * 0.32} fill={lit > 0.5 ? C.rust : C.teal} opacity={lit > 0.5 ? 1 : 0.5}/>;
          })}
        </svg>
      </div>
    );
  };

/** Large stamp for a card verdict (white on marker red, so it stays legible on the active blue card). Lands with a scale slam at tick `at`. */
export const BigStamp: React.FC<{f: number; at: number; text: string; x: number; y: number; size?: number; rot?: number}> = ({f, at, text, x, y, size = 46, rot = -6}) => {
  if (f < at) return null;
  const s = spr(f, at, 9, 260);
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${2.2 - 1.2 * s})`, opacity: clamp01(s * 3), fontFamily: F.sans, fontWeight: 900, fontSize: size,
      letterSpacing: size * 0.05, lineHeight: 1, color: C.white, background: C.markerRed, border: `${size * 0.09}px solid ${C.white}`, borderRadius: size * 0.12,
      padding: `${size * 0.16}px ${size * 0.3}px ${size * 0.12}px`, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(0,0,0,0.35)"}}>{text}</div>
  );
};
