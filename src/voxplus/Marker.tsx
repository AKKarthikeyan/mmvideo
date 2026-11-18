// Highlighter and marker overlays. All are SVG <g> elements, drawn in the coordinate space of the <svg> they sit in
// (for DocPage that is the page image's own pixels), so they stay glued to the text when the camera moves.
import React from "react";
import {random} from "remotion";
import {C, clamp01, ease, inOut, outCubic} from "./tokens";

export type Rect = [number, number, number, number];   // x, y, w, h

/** Rough-ended highlighter band path (2-3 px jitter at the ends, a slight skew), width w, height h. */
const bandPath = (w: number, h: number, seed: string) => {
  const j = (k: string, a: number) => (random(seed + k) - 0.5) * 2 * a;
  const sk = h * 0.06;
  return `M ${j("a", 4)} ${h * 0.08 + j("b", 2)} L ${w + j("c", 5)} ${sk + j("d", 2)} Q ${w + 6 + j("e", 3)} ${h * 0.5} ${w + j("f", 5)} ${h + sk * 0.3 + j("g", 2)}
    L ${j("h", 4)} ${h * 0.95 + j("i", 2)} Q ${-6 + j("k", 3)} ${h * 0.5} ${j("a", 4)} ${h * 0.08 + j("b", 2)} Z`;
};

/**
 * Yellow highlighter wipe over one or more line rects. Each rect wipes left-to-right in `dur` frames, one after
 * another (multi-line phrases continue onto the next line). Multiply blend so the ink shows through.
 */
export const Highlight: React.FC<{f: number; at: number; rects: Rect[]; dur?: number; color?: string; pad?: number; opacity?: number; seed?: string}> =
  ({f, at, rects, dur = 12, color = C.highlight, pad = 0.12, opacity = 0.92, seed = "hl"}) => {
    const live = rects.filter((r) => r[2] > 2);
    const total = live.reduce((s, r) => s + r[2], 0);
    // one continuous pen stroke across all lines: global eased progress, shared out by line width
    const g = ease(f, at, at + dur * live.length, inOut) * total;
    let acc = 0;
    return (
      <g style={{mixBlendMode: "multiply"}} opacity={opacity}>
        {live.map((r, i) => {
          const p = clamp01((g - acc) / r[2]);
          acc += r[2];
          if (p <= 0) return null;
          const x = r[0] - r[3] * 0.15, y = r[1] + r[3] * pad * 0.5, w = r[2] + r[3] * 0.3, h = r[3] * (1 - pad * 0.3);
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <clipPath id={`${seed}c${i}`}><rect x={-10} y={-10} width={(w + 20) * p} height={h + 20}/></clipPath>
              <path d={bandPath(w, h, seed + i)} fill={color} clipPath={`url(#${seed}c${i})`}/>
            </g>
          );
        })}
      </g>
    );
  };

/** Hand-drawn marker ellipse around a rect: overshoots its start (like a real pen loop), draws in `dur` frames. */
export const MarkerCircle: React.FC<{f: number; at: number; rect: Rect; dur?: number; color?: string; width?: number; padX?: number; padY?: number; seed?: string}> =
  ({f, at, rect, dur = 14, color = C.markerRed, width = 7, padX = 0.28, padY = 0.55, seed = "mc"}) => {
    const p = ease(f, at, at + dur, outCubic);
    if (p <= 0) return null;
    const [x, y, w, h] = rect;
    const cx = x + w / 2, cy = y + h / 2, rx = w / 2 + w * padX * 0.5 + 10, ry = h / 2 + h * padY * 0.5 + 6;
    const pts: string[] = [];
    const N = 64, turns = 1.12, a0 = -2.4 + (random(seed) - 0.5) * 0.4;
    for (let i = 0; i <= N; i++) {
      const t = i / N, a = a0 + t * turns * Math.PI * 2;
      const wob = 1 + (random(seed + "w" + Math.floor(t * 6)) - 0.5) * 0.06 + t * 0.05;
      pts.push(`${(cx + Math.cos(a) * rx * wob).toFixed(1)},${(cy + Math.sin(a) * ry * wob + t * 4).toFixed(1)}`);
    }
    const len = 2 * Math.PI * Math.sqrt((rx * rx + ry * ry) / 2) * turns * 1.08;
    return <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray={len} strokeDashoffset={len * (1 - p)} opacity={0.92}/>;
  };

/** Marker underline (slightly curved, drawn left to right). */
export const MarkerUnderline: React.FC<{f: number; at: number; rect: Rect; dur?: number; color?: string; width?: number; seed?: string}> =
  ({f, at, rect, dur = 10, color = C.markerRed, width = 7, seed = "mu"}) => {
    const p = ease(f, at, at + dur, outCubic);
    if (p <= 0) return null;
    const [x, y, w, h] = rect, yy = y + h * 1.02, j = (k: string) => (random(seed + k) - 0.5) * 8;
    const d = `M ${x - 6} ${yy + j("a")} Q ${x + w * 0.5} ${yy + 10 + j("b")} ${x + w + 8} ${yy - 4 + j("c")}`;
    const len = w * 1.1 + 30;
    return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)}/>;
  };

/** Marker strike-through (a crossing-out line drawn fast, slightly diagonal). */
export const MarkerStrike: React.FC<{f: number; at: number; rect: Rect; dur?: number; color?: string; width?: number; seed?: string}> =
  ({f, at, rect, dur = 7, color = C.markerRed, width = 10, seed = "ms"}) => {
    const p = ease(f, at, at + dur, outCubic);
    if (p <= 0) return null;
    const [x, y, w, h] = rect, j = (k: string) => (random(seed + k) - 0.5) * 6;
    const d = `M ${x - w * 0.06} ${y + h * 0.66 + j("a")} L ${x + w * 1.06} ${y + h * 0.36 + j("b")}`;
    const len = w * 1.2 + 10;
    return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)}/>;
  };

/** Progress helper for callers that want to sync sound: frame at which a highlight over `rects` finishes. */
export const highlightEnd = (at: number, rects: Rect[], dur = 12) => at + dur * rects.filter((r) => r[2] > 2).length;
