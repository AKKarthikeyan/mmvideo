// ChartBuild: a chart that builds on black. Serif title, source line under it (small grey caps), axis first, then
// bars grow (staggered) or a line draws, values count up, and the key bar turns Vox yellow with a pop label.
// huashu t3 number rules: one takeaway per chart, base first, count-up 0.9-1.3 s, hold >= 0.5 s.
import React from "react";
import {MarkerCircle} from "./Marker";
import {InkSurface} from "./Texture";
import {C, F, clamp01, ease, lin, outCubic, outQuint, spr} from "./tokens";

export type Bar = {label: string; value: number; key?: boolean; valueText?: string};

export const ChartBuild: React.FC<{f: number; at?: number; title: string; source: string; bars?: Bar[]; line?: {label: string; value: number}[];
  max?: number; prefix?: string; suffix?: string; titleColor?: string; barColor?: string; keyColor?: string; circleKey?: boolean;
  box?: {x: number; y: number; w: number; h: number}; background?: boolean}> =
  ({f, at = 0, title, source, bars = [], line, max, prefix = "$", suffix = "", titleColor = C.white, barColor = C.chartBlue, keyColor = C.highlightPrint,
    circleKey = true, box = {x: 300, y: 330, w: 1320, h: 560}, background = true}) => {
    const t = f - at;
    const titleP = ease(t, 0, 12, outQuint), srcP = ease(t, 6, 18, outQuint), axisP = ease(t, 8, 26, outCubic);
    const vmax = max ?? Math.max(...bars.map((b) => b.value), ...(line || []).map((p) => p.value)) * 1.08;
    const n = bars.length || (line || []).length;
    const slot = box.w / Math.max(1, n), bw = Math.min(260, slot * 0.46);
    const buildAt = 22, per = 30, stagger = 9;
    const keyIdx = bars.findIndex((b) => b.key);
    const keyAt = buildAt + (n - 1) * stagger + per + 4;
    const yOf = (v: number) => box.y + box.h - (v / vmax) * box.h;
    const fmt = (v: number, b?: Bar) => (b?.valueText && v >= (b?.value ?? 0) - 1e-6 ? b.valueText : prefix + Math.round(v).toLocaleString("en-US") + suffix);
    // gentle camera drift on the chart so the frame is never frozen
    const drift = 1 + 0.025 * ease(t, 0, 140, (x) => x);
    return (
      <>
        {background ? <InkSurface/> : null}
        <div style={{position: "absolute", inset: 0, transform: `scale(${drift})`, transformOrigin: "50% 60%"}}>
          <div style={{position: "absolute", left: box.x - 20, top: 110, opacity: titleP, transform: `translateY(${(1 - titleP) * 30}px)`,
            fontFamily: F.serif, fontSize: 92, color: titleColor, lineHeight: 1}}>{title}</div>
          <div style={{position: "absolute", left: box.x - 16, top: 222, opacity: srcP, fontFamily: F.mono, fontWeight: 500, fontSize: 22,
            color: "#9C968C", letterSpacing: 3, textTransform: "uppercase"}}>{source}</div>
          <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
            {/* gridlines (dashed, 20% white) */}
            {[0.25, 0.5, 0.75, 1].map((g, i) => (
              <line key={i} x1={box.x - 20} x2={box.x - 20 + (box.w + 40) * axisP} y1={box.y + box.h - g * box.h} y2={box.y + box.h - g * box.h}
                stroke="rgba(255,255,255,0.16)" strokeWidth={2} strokeDasharray="6 10"/>
            ))}
            <line x1={box.x - 20} x2={box.x - 20 + (box.w + 40) * axisP} y1={box.y + box.h} y2={box.y + box.h} stroke="rgba(255,255,255,0.75)" strokeWidth={3}/>
            {bars.map((b, i) => {
              const a = buildAt + i * stagger;
              const g = lin(t, a, a + per, 0, 1, (x) => 1 - Math.pow(1 - x, 4));
              const cx = box.x + slot * (i + 0.5);
              const top = yOf(b.value * g), hgt = box.y + box.h - top;
              const turn = b.key ? ease(t, keyAt, keyAt + 8, outCubic) : 0;
              const fill = b.key ? mix(barColor, keyColor, turn) : barColor;
              return (
                <g key={i}>
                  <rect x={cx - bw / 2} y={top} width={bw} height={Math.max(g > 0 ? 3 : 0, hgt)} fill={fill}/>
                  {b.key && turn > 0 ? <rect x={cx - bw / 2} y={top - 3} width={bw} height={Math.max(3, hgt) + 3} fill="none" stroke={keyColor} strokeWidth={0}/> : null}
                </g>
              );
            })}
            {line ? <LinePath t={t} pts={line} box={box} vmax={vmax} color={keyColor}/> : null}
            {circleKey && keyIdx >= 0 ? (() => {
              const b = bars[keyIdx], cx = box.x + slot * (keyIdx + 0.5), top = yOf(b.value);
              return <MarkerCircle f={t} at={keyAt + 10} rect={[cx - bw / 2 - 10, top - 120, bw + 20, 128 + (box.y + box.h - top)]} dur={14} color={C.markerRed} width={8} padX={0.1} padY={0.15}/>;
            })() : null}
          </svg>
          {bars.map((b, i) => {
            const a = buildAt + i * stagger;
            const g = lin(t, a, a + per, 0, 1, (x) => 1 - Math.pow(1 - x, 4));
            const cx = box.x + slot * (i + 0.5);
            const top = yOf(b.value * g);
            const lp = ease(t, a - 2, a + 8, outQuint);
            const pop = b.key ? spr(t, keyAt, 10, 220) : 0;
            return (
              <React.Fragment key={i}>
                <div style={{position: "absolute", left: cx, top: box.y + box.h + 52, transform: `translate(-50%, -50%) translateY(${(1 - lp) * 16}px)`, opacity: lp,
                  fontFamily: F.sans, fontWeight: 600, fontSize: 36, color: "#CFC9BE", whiteSpace: "nowrap"}}>{b.label}</div>
                {g > 0 ? <div style={{position: "absolute", left: cx, top: top - 54, transform: `translate(-50%, -50%) scale(${1 + 0.18 * pop * (1 - clamp01((t - keyAt - 8) / 10))})`,
                  fontFamily: F.serif, fontSize: b.key ? 84 : 72, color: b.key && t >= keyAt ? keyColor : C.white, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums"}}>
                  {fmt(b.value * g, b)}
                </div> : null}
              </React.Fragment>
            );
          })}
        </div>
      </>
    );
  };

const LinePath: React.FC<{t: number; pts: {label: string; value: number}[]; box: {x: number; y: number; w: number; h: number}; vmax: number; color: string}> =
  ({t, pts, box, vmax, color}) => {
    const xy = pts.map((p, i) => [box.x + (box.w * i) / Math.max(1, pts.length - 1), box.y + box.h - (p.value / vmax) * box.h]);
    const d = xy.map((q, i) => `${i ? "L" : "M"} ${q[0]} ${q[1]}`).join(" ");
    let len = 0;
    for (let i = 1; i < xy.length; i++) len += Math.hypot(xy[i][0] - xy[i - 1][0], xy[i][1] - xy[i - 1][1]);
    const p = ease(t, 22, 22 + 36, (x) => x);
    return <path d={d} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)}/>;
  };

/** mix two #RRGGBB colours */
export const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * clamp01(t)).toString(16).padStart(2, "0")).join("");
};
