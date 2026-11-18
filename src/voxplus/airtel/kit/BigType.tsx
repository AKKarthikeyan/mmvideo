// Big serif words and numbers: kinetic lines (word by word), slam-in numbers that count, and a hanging price tag
// that flips through values with a marker cross-out and a rubber-stamp final value.
import React from "react";

import {C, F, clamp01, ease, lin, outCubic, outQuint, shake, spr} from "./tokens";

/** Kinetic serif line: words arrive one at a time (slide up + de-blur), `mark` words get a yellow box behind them. */
export const BigWord: React.FC<{f: number; at: number; text: string; x: number; y: number; size?: number; color?: string;
  stagger?: number; mark?: string[]; markColor?: string; markAt?: number; italic?: boolean; align?: "center" | "left";
  out?: number; maxWidth?: number}> =
  ({f, at, text, x, y, size = 140, color = C.white, stagger = 5, mark = [], markColor = C.highlight, markAt, italic, align = "center", out, maxWidth = 1700}) => {
    if (f < at) return null;
    const words = text.split(" ");
    const o = out != null ? 1 - ease(f, out, out + 8) : 1;
    return (
      <div style={{position: "absolute", left: x, top: y, transform: `translate(${align === "center" ? "-50%" : "0"}, -50%)`, opacity: o,
        display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.26, rowGap: size * 0.05, width: maxWidth}}>
        {words.map((w, i) => {
          const s = spr(f, at + i * stagger, 14, 170);
          const clean = w.replace(/[^A-Za-z0-9$₹%]/g, "");
          const isMark = mark.includes(clean);
          const mp = isMark ? ease(f, markAt ?? at + words.length * stagger + 6, (markAt ?? at + words.length * stagger + 6) + 9, outCubic) : 0;
          return (
            <span key={i} style={{position: "relative", display: "inline-block", transform: `translateY(${(1 - s) * size * 0.45}px)`, opacity: clamp01(s * 2.2),
              filter: s < 0.7 ? `blur(${((0.7 - s) * 14).toFixed(1)}px)` : undefined}}>
              {isMark ? <span style={{position: "absolute", left: -size * 0.08, right: -size * 0.08, top: size * 0.16, bottom: size * 0.02, background: markColor,
                transform: `scaleX(${mp})`, transformOrigin: "0 50%", zIndex: 0}}/> : null}
              <span style={{position: "relative", fontFamily: F.serif, fontStyle: italic ? "italic" : "normal", fontSize: size, lineHeight: 1.05,
                color: isMark && mp > 0.5 ? C.ink : color, letterSpacing: -size * 0.01, zIndex: 1}}>{w}</span>
            </span>
          );
        })}
      </div>
    );
  };

/** Big number that slams in (scale 1.5 -> 1 with blur) and counts up; `prefix`/`suffix` stay fixed. */
export const BigNumber: React.FC<{f: number; at: number; to: number; from?: number; dur?: number; x: number; y: number; size?: number;
  color?: string; prefix?: string; suffix?: string; decimals?: number; sub?: string; subColor?: string; slam?: boolean}> =
  ({f, at, to, from = 0, dur = 30, x, y, size = 220, color = C.white, prefix = "", suffix = "", decimals = 0, sub, subColor = C.grey, slam = true}) => {
    if (f < at) return null;
    const s = spr(f, at, 11, 200);
    const v = from + (to - from) * lin(f, at, at + dur, 0, 1, (t) => 1 - Math.pow(1 - t, 4));
    const sc = slam ? 1.5 - 0.5 * s : 0.8 + 0.2 * s;
    const sh = shake(f, at + 5, slam ? 7 : 0, "bn" + to);
    const txt = prefix + v.toLocaleString("en-US", {minimumFractionDigits: decimals, maximumFractionDigits: decimals}) + suffix;
    return (
      <div style={{position: "absolute", left: x + sh.x, top: y + sh.y, transform: `translate(-50%, -50%) scale(${sc})`, opacity: clamp01(s * 3), textAlign: "center",
        filter: s < 0.8 ? `blur(${((0.8 - s) * 18).toFixed(1)}px)` : undefined}}>
        <div style={{fontFamily: F.serif, fontSize: size, color, lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: -size * 0.02, whiteSpace: "nowrap"}}>{txt}</div>
        {sub ? <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: size * 0.16, color: subColor, marginTop: size * 0.06, letterSpacing: 1}}>{sub}</div> : null}
      </div>
    );
  };

export type TagValue = {text: string; at: number; crossAt?: number; stamp?: boolean};

/**
 * Hanging price tag (manila card on a string from pivot (x, y)). Swings in at `enterAt`, flips to each value at its `at`
 * (card turns edge-on and back), crosses a value out with a red marker at `crossAt`, and a `stamp` value slams on in red ink.
 */
export const PriceTag: React.FC<{f: number; enterAt: number; x: number; y: number; values: TagValue[]; scale?: number; string?: number}> =
  ({f, enterAt, x, y, values, scale = 1, string = 230}) => {
    if (f < enterAt) return null;
    const tw = 360 * scale, th = 210 * scale;
    // swing: drops in from above, then a damped pendulum; every flip kicks it again
    const drop = 1 - spr(f, enterAt, 12, 150);
    let ang = 22 * Math.exp(-(f - enterAt) / 18) * Math.cos((f - enterAt) * 0.22);
    for (const v of values.slice(1)) if (f >= v.at) ang += 7 * Math.exp(-(f - v.at) / 14) * Math.sin((f - v.at) * 0.3);
    ang += 1.2 * Math.sin(f * 0.05);
    // current value and flip state
    let idx = 0;
    for (let i = 0; i < values.length; i++) if (f >= values[i].at - 5) idx = i;
    const cur = values[idx];
    const flipT = idx > 0 ? clamp01((f - (cur.at - 5)) / 10) : 1;
    const rotY = idx > 0 && flipT < 1 ? (flipT < 0.5 ? flipT * 180 : (flipT - 1) * 180) : 0;
    const showIdx = idx > 0 && flipT < 0.5 ? idx - 1 : idx;
    const show = values[showIdx];
    const crossP = show.crossAt != null ? ease(f, show.crossAt, show.crossAt + 7, outCubic) : 0;
    const stampS = show.stamp ? spr(f, show.at, 9, 260) : 1;
    const sh = show.stamp ? shake(f, show.at + 2, 9, "tag") : {x: 0, y: 0};
    const fs = (show.text.length > 5 ? 118 : 138) * scale;
    return (
      <div style={{position: "absolute", left: x + sh.x, top: y - drop * 700 + sh.y, width: 0, height: 0, transform: `rotate(${ang}deg)`, transformOrigin: "0 0"}}>
        {/* string */}
        <div style={{position: "absolute", left: -2, top: 0, width: 4, height: string, background: "linear-gradient(90deg,#8A7A60,#C8B994,#8A7A60)", borderRadius: 2}}/>
        <div style={{position: "absolute", left: -tw / 2, top: string - 18 * scale, width: tw, height: th,
          transform: `perspective(1200px) rotateY(${rotY}deg)`, transformOrigin: "50% 50%"}}>
          {/* card with clipped top corners */}
          <div style={{position: "absolute", inset: 0, clipPath: "polygon(16% 0, 84% 0, 100% 22%, 100% 100%, 0 100%, 0 22%)",
            background: "linear-gradient(160deg, #F2DDA8, #E7CB89 60%, #DDBE77)", filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.35))"}}>
            <div style={{position: "absolute", inset: 10 * scale, clipPath: "polygon(15% 0, 85% 0, 100% 21%, 100% 100%, 0 100%, 0 21%)", border: `${2 * scale}px dashed rgba(120,80,30,0.35)`}}/>
          </div>
          {/* reinforced hole */}
          <div style={{position: "absolute", left: tw / 2 - 17 * scale, top: 6 * scale, width: 34 * scale, height: 34 * scale, borderRadius: "50%",
            background: "#C9A85E", boxShadow: "inset 0 2px 3px rgba(0,0,0,0.35)"}}/>
          <div style={{position: "absolute", left: tw / 2 - 8 * scale, top: 15 * scale, width: 16 * scale, height: 16 * scale, borderRadius: "50%", background: "#3B2B18"}}/>
          {/* value */}
          <div style={{position: "absolute", left: 0, right: 0, top: 46 * scale, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center",
            transform: show.stamp ? `scale(${2.2 - 1.2 * stampS}) rotate(${-7 * stampS}deg)` : undefined, opacity: show.stamp ? clamp01(stampS * 3) : 1}}>
            <div style={{position: "relative", fontFamily: F.serif, fontSize: fs, lineHeight: 1, color: show.stamp ? C.markerRed : "#2A1C0E",
              padding: show.stamp ? `${4 * scale}px ${18 * scale}px` : 0, border: show.stamp ? `${7 * scale}px solid ${C.markerRed}` : undefined, borderRadius: 10 * scale,
              letterSpacing: -2 * scale, opacity: show.stamp ? 0.9 : 1, mixBlendMode: show.stamp ? "multiply" : undefined}}>
              {show.text}
              {crossP > 0 ? <svg style={{position: "absolute", left: -20 * scale, top: 0, overflow: "visible"}} width={10} height={10}>
                <path d={`M 0 ${fs * 0.72} L ${(fs * 0.6 * show.text.length + 40 * scale) * crossP} ${fs * 0.26 + (1 - crossP) * fs * 0.46}`}
                  stroke={C.markerRed} strokeWidth={13 * scale} strokeLinecap="round" fill="none"/>
              </svg> : null}
            </div>
          </div>
        </div>
      </div>
    );
  };

/** Small helper: a short line under a big word/number, e.g. a unit or scope ("each, 1981"). */
export const SubLine: React.FC<{f: number; at: number; text: string; x: number; y: number; size?: number; color?: string}> =
  ({f, at, text, x, y, size = 34, color = C.grey}) => {
    const p = ease(f, at, at + 10, outQuint);
    if (p <= 0) return null;
    return <div style={{position: "absolute", left: x, top: y + (1 - p) * 20, transform: "translate(-50%, -50%)", opacity: p, fontFamily: F.sans, fontWeight: 600,
      fontSize: size, color, letterSpacing: 1, whiteSpace: "nowrap"}}>{text}</div>;
  };
