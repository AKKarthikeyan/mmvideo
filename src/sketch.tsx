// Hand-drawn primitives: Rough.js paths that draw themselves on, plus handwritten text.
import React from "react";
import rough from "roughjs/bin/rough";
import {interpolate, useCurrentFrame, Easing} from "remotion";

export const INK = "#1d1d1f";
export const RED = "#d9480f";
export const BLUE = "#1c64b8";
export const GREEN = "#2b8a3e";
export const PAPER = "#fbf8f1";
export const HAND = "Virgil, 'Segoe Print', 'Comic Sans MS', sans-serif";

const gen = rough.generator();
type Opt = {seed?: number; roughness?: number; stroke?: string; strokeWidth?: number; fill?: string; fillStyle?: string; bowing?: number};

const toPaths = (d: any) => gen.toPaths(d);

// One drawable shape, drawn on between frames [start, start+dur].
export const Draw: React.FC<{shape: any; start: number; dur?: number}> = ({shape, start, dur = 18}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start, start + dur], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic)});
  if (p <= 0) return null;
  return (
    <g>
      {toPaths(shape).map((path: any, i: number) => (
        <path key={i} d={path.d} pathLength={1} fill={path.fill === "none" ? "none" : path.fill}
              fillOpacity={path.fill && path.fill !== "none" ? p : 1}
              stroke={path.stroke} strokeWidth={path.strokeWidth}
              strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" strokeLinejoin="round"/>
      ))}
    </g>
  );
};

export const s = {
  rect: (x: number, y: number, w: number, h: number, o: Opt = {}) =>
    gen.rectangle(x, y, w, h, {roughness: 2.0, bowing: 1.5, stroke: INK, strokeWidth: 4, seed: 7, ...o}),
  line: (x1: number, y1: number, x2: number, y2: number, o: Opt = {}) =>
    gen.line(x1, y1, x2, y2, {roughness: 1.8, bowing: 2, stroke: INK, strokeWidth: 4, seed: 3, ...o}),
  ellipse: (x: number, y: number, w: number, h: number, o: Opt = {}) =>
    gen.ellipse(x, y, w, h, {roughness: 2.0, stroke: INK, strokeWidth: 4, seed: 5, ...o}),
  poly: (pts: [number, number][], o: Opt = {}) =>
    gen.polygon(pts, {roughness: 1.9, bowing: 1.5, stroke: INK, strokeWidth: 4, seed: 11, ...o}),
  arc: (x: number, y: number, w: number, h: number, a0: number, a1: number, o: Opt = {}) =>
    gen.arc(x, y, w, h, a0, a1, false, {roughness: 1.6, stroke: INK, strokeWidth: 4, seed: 17, ...o}),
  arrow: (x1: number, y1: number, x2: number, y2: number, o: Opt = {}) => {
    const a = Math.atan2(y2 - y1, x2 - x1), L = 34;
    return [gen.line(x1, y1, x2, y2, {roughness: 1.2, stroke: INK, strokeWidth: 4, seed: 13, ...o}),
      gen.line(x2, y2, x2 - L * Math.cos(a - 0.45), y2 - L * Math.sin(a - 0.45), {roughness: 1, stroke: INK, strokeWidth: 4, seed: 14, ...o}),
      gen.line(x2, y2, x2 - L * Math.cos(a + 0.45), y2 - L * Math.sin(a + 0.45), {roughness: 1, stroke: INK, strokeWidth: 4, seed: 15, ...o})];
  },
};

// Several shapes drawn one after another.
export const DrawMany: React.FC<{shapes: any[]; start: number; each?: number}> = ({shapes, start, each = 8}) => (
  <g>{shapes.map((sh, i) => <Draw key={i} shape={sh} start={start + i * each} dur={each + 6}/>)}</g>
);

// Handwritten text revealed left to right, like a pen writing.
export const Hand: React.FC<{x: number; y: number; start: number; size?: number; color?: string; dur?: number;
  anchor?: "start" | "middle"; weight?: number; children: React.ReactNode}> =
  ({x, y, start, size = 64, color = INK, dur, anchor = "start", weight = 400, children}) => {
  const f = useCurrentFrame();
  const len = String(children).length;
  const d = dur ?? Math.min(40, 8 + len * 1.2);
  const p = interpolate(f, [start, start + d], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  if (p <= 0) return null;
  const w = len * size * 0.56 + 60;                 // estimated rendered width of the line
  const x0 = anchor === "middle" ? x - w / 2 : x - 10;
  const id = `clip-${x}-${y}-${start}`;
  return (
    <g>
      <defs><clipPath id={id}><rect x={x0} y={y - size * 1.2} width={w * p} height={size * 1.8}/></clipPath></defs>
      <text x={x} y={y} fontFamily={HAND} fontSize={size} fill={color} textAnchor={anchor} fontWeight={weight}
            clipPath={`url(#${id})`}>{children}</text>
    </g>
  );
};

export const Fade: React.FC<{start: number; dur?: number; children: React.ReactNode}> = ({start, dur = 12, children}) => {
  const f = useCurrentFrame();
  return <g opacity={interpolate(f, [start, start + dur], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}>{children}</g>;
};
