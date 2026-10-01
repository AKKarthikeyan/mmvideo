// Drawing-hand kit: strokes and handwriting with a hand + marker that follows the pen tip.
import React from "react";
import rough from "roughjs/bin/rough";
import {svgPathProperties} from "svg-path-properties";
import {interpolate, useCurrentFrame, Easing} from "remotion";

export const INK = "#1d1d1f", RED = "#d9480f", BLUE = "#1c64b8", GREEN = "#2b8a3e", PAPER = "#fbf8f1";
export const HANDFONT = "Virgil, 'Comic Sans MS', sans-serif";
const gen = rough.generator();
type Opt = Record<string, any>;
export const sh = {
  rect: (x: number, y: number, w: number, h: number, o: Opt = {}) => gen.rectangle(x, y, w, h, {roughness: 2, bowing: 1.5, stroke: INK, strokeWidth: 4, seed: 7, ...o}),
  line: (x1: number, y1: number, x2: number, y2: number, o: Opt = {}) => gen.line(x1, y1, x2, y2, {roughness: 1.6, bowing: 2, stroke: INK, strokeWidth: 4, seed: 3, ...o}),
  ellipse: (x: number, y: number, w: number, h: number, o: Opt = {}) => gen.ellipse(x, y, w, h, {roughness: 1.8, stroke: INK, strokeWidth: 4, seed: 5, ...o}),
  circle: (x: number, y: number, d: number, o: Opt = {}) => gen.circle(x, y, d, {roughness: 1.5, stroke: INK, strokeWidth: 4, seed: 9, ...o}),
  arc: (x: number, y: number, w: number, h: number, a0: number, a1: number, o: Opt = {}) => gen.arc(x, y, w, h, a0, a1, false, {roughness: 1.4, stroke: INK, strokeWidth: 4, seed: 17, ...o}),
};

// The hand + marker, with the pen tip at (x, y).
export const DrawingHand: React.FC<{x: number; y: number}> = ({x, y}) => (
  // Just a marker pen, tip on the stroke, body towards the lower right (AK: the cartoon hand covered the drawing).
  <g transform={`translate(${x} ${y}) rotate(150) scale(0.8)`} style={{pointerEvents: "none"}}>
    <polygon points="0,0 -6,-18 6,-18" fill="#343a40"/>
    <rect x={-11} y={-120} width={22} height={104} rx={5} fill="#495057" stroke="#212529" strokeWidth={2.5}/>
    <rect x={-11} y={-120} width={22} height={24} rx={5} fill={RED}/>
  </g>
);

const prog = (f: number, start: number, dur: number) =>
  interpolate(f, [start, start + dur], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad)});

// A rough shape drawn on, with the hand riding its first path.
export const HDraw: React.FC<{shape: any; start: number; dur?: number; hand?: boolean}> = ({shape, start, dur = 20, hand = true}) => {
  const f = useCurrentFrame();
  const p = prog(f, start, dur);
  if (p <= 0) return null;
  const paths = gen.toPaths(shape);
  let tip: {x: number; y: number} | null = null;
  if (hand && p < 1 && paths[0]) {
    const pp = new svgPathProperties(paths[0].d);
    tip = pp.getPointAtLength(pp.getTotalLength() * p);
  }
  return (
    <g>
      {paths.map((path: any, i: number) => (
        <path key={i} d={path.d} pathLength={1} fill={path.fill === "none" ? "none" : path.fill}
              fillOpacity={path.fill && path.fill !== "none" ? p : 1} stroke={path.stroke} strokeWidth={path.strokeWidth}
              strokeDasharray="1 1" strokeDashoffset={1 - p} strokeLinecap="round" strokeLinejoin="round"/>
      ))}
      {tip && <DrawingHand x={tip.x} y={tip.y}/>}
    </g>
  );
};

// Handwritten text, revealed left to right with the hand at the writing edge.
export const HWrite: React.FC<{x: number; y: number; start: number; size?: number; color?: string; dur?: number;
  anchor?: "start" | "middle"; hand?: boolean; children: React.ReactNode}> =
  ({x, y, start, size = 64, color = INK, dur, anchor = "start", hand = true, children}) => {
  const f = useCurrentFrame();
  const len = String(children).length;
  const d = dur ?? Math.min(45, 10 + len * 1.3);
  const p = prog(f, start, d);
  if (p <= 0) return null;
  const w = len * size * 0.62 + 30;
  const x0 = anchor === "middle" ? x - w / 2 : x;
  const id = `w-${x}-${y}-${start}`;
  return (
    <g>
      <defs><clipPath id={id}><rect x={x0 - 10} y={y - size * 1.2} width={w * p + 10} height={size * 1.8}/></clipPath></defs>
      <text x={x} y={y} fontFamily={HANDFONT} fontSize={size} fill={color} textAnchor={anchor} clipPath={p < 1 ? `url(#${id})` : undefined}>{children}</text>
      {hand && p < 1 && <DrawingHand x={x0 + w * p} y={y - size * 0.25}/>}
    </g>
  );
};

// Captions for muted viewing: the beat's sentences, shown one at a time.
export const Captions: React.FC<{text: string; frames: number}> = ({text, frames}) => {
  const f = useCurrentFrame();
  const parts = text.match(/[^.!?]+[.!?]*/g)?.map(s => s.trim()).filter(Boolean) ?? [text];
  const total = parts.reduce((a, s) => a + s.length, 0);
  let acc = 0, cur = parts[0];
  for (const s of parts) { const end = (acc + s.length) / total * frames; if (f < end) { cur = s; break; } acc += s.length; cur = s; }
  return (
    <div style={{position: "absolute", left: 60, right: 60, bottom: 150, textAlign: "center"}}>
      <span style={{background: "rgba(255,255,255,0.72)", color: "#1d1d1f", fontFamily: "'Helvetica Neue', Arial, sans-serif",
        fontSize: 36, lineHeight: 1.4, padding: "6px 14px", borderRadius: 8, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone"}}>{cur}</span>
    </div>
  );
};
