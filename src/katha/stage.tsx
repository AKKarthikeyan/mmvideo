// The stage every Katha scene is built on (21 Oct 2026): the full-frame SVG with the shared defs, a slow camera push,
// film grain and vignette on top; plus two common layers, a flock of birds and an out-of-focus foreground.
import React from "react";
import {interpolate} from "remotion";
import {W, H, KathaDefs, Finish, blur} from "./look";
import {Bird} from "./sil";
import {rnd} from "./geom";

export type SceneP = {s: any; n: number};
export const push = (f: number, n: number, from = 1, to = 1.05) => interpolate(f, [0, Math.max(1, n)], [from, to], {extrapolateRight: "clamp"});
export const Frame: React.FC<{children: React.ReactNode; f: number; zoom?: number; cx?: number; cy?: number}> = ({children, f, zoom = 1, cx = W / 2, cy = H / 2}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute"}}>
    <KathaDefs/>
    <g transform={`translate(${cx} ${cy}) scale(${zoom}) translate(${-cx} ${-cy})`}>{children}</g>
    <Finish f={f}/>
  </svg>
);
// Birds crossing the sky in a loose line (storks at dusk, parrots by day).
export const Flock: React.FC<{f: number; kind?: "stork" | "flamingo" | "parrot"; count?: number; y?: number; scale?: number; light: [number, number]; seed?: number}> =
  ({f, kind = "stork", count = 5, y = 260, scale = 0.45, light, seed = 0}) => (
  <g>{Array.from({length: count}, (_, i) => {
    const sp = 1.1 + (i % 3) * 0.12, x = ((f * sp * 1.6 + i * 140 + seed * 400) % (W + 600)) - 300, yy = y + Math.sin(i * 1.7 + seed) * 46 + i * 12;
    return <Bird key={i} kind={kind} x={x} y={yy} scale={scale * (0.8 + (i % 4) * 0.08)} f={f} speed={0.9 + (i % 3) * 0.1} phase={i * 0.23} light={light} fill="#2A1A36"/>;
  })}</g>
);
// A dark foreground ridge with grass, broken spears and arrows, out of focus: depth for the shot.
export const Foreground: React.FC<{f: number; y?: number; side?: "both" | "left" | "right"; blurPx?: number}> = ({f, y = 1000, side = "both", blurPx = 4}) => {
  const parts: string[] = [];
  const tuft = (x: number, yy: number, h: number, i: number) => { for (let k = 0; k < 7; k++) { const a = -1.2 + k * 0.4 + Math.sin(f / 30 + i + k) * 0.05, L = h * (0.6 + rnd(i * 7 + k, 3) * 0.6); parts.push(`M ${x - 3 + k} ${yy} Q ${x + Math.cos(a - 1.57) * L * 0.3 + k} ${yy - L * 0.6} ${x + Math.sin(a) * L} ${yy - L} Q ${x + Math.cos(a - 1.57) * L * 0.3 + k + 3} ${yy - L * 0.55} ${x + 4 + k} ${yy} Z`); } };
  const spear = (x: number, yy: number, L: number, ang: number) => { const r = (ang * Math.PI) / 180, ex = x + Math.sin(r) * L, ey = yy - Math.cos(r) * L; parts.push(`M ${x - 3} ${yy} L ${ex - 2} ${ey} L ${ex + 2} ${ey} L ${x + 3} ${yy} Z`); };
  const L = side !== "right", R = side !== "left";
  if (L) { parts.push(`M -40 ${y - 30} C 200 ${y - 60} 420 ${y - 40} 620 ${y + 10} L 620 1100 L -40 1100 Z`); for (let i = 0; i < 9; i++) tuft(20 + i * 62, y - 34 + i * 4.5, 40 + rnd(i, 5) * 40, i); spear(160, y - 40, 230, -14); spear(300, y - 42, 150, 22); spear(470, y - 20, 120, -32); }
  if (R) { parts.push(`M 1300 ${y + 14} C 1500 ${y - 40} 1720 ${y - 64} 1960 ${y - 36} L 1960 1100 L 1300 1100 Z`); for (let i = 0; i < 9; i++) tuft(1360 + i * 64, y - 10 - i * 5, 40 + rnd(i, 6) * 40, i + 20); spear(1700, y - 54, 260, 12); spear(1560, y - 40, 140, -26); spear(1840, y - 58, 180, 30); }
  return <g filter={blurPx ? blur(blurPx) : undefined}>{parts.map((d, i) => <path key={i} d={d} fill="#08040C"/>)}</g>;
};
