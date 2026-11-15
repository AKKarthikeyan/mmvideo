// GEO-04 Part 1, builder V1: shared parts (labels, leaders, smoke puffs, curves, speckle, volcano profile). Smooth functions of f only.
import React from "react";
import {eo, eio, clamp} from "../kit";
import {prog, type AP, type Pt} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";

export const rnd = (i: number, s = 0) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
export const mixn = (a: number, b: number, t: number) => a + (b - a) * t;
export {prog, eo, eio, clamp};

type Pos = {cx: number; y: number; size?: number; maxW?: number; tone?: "warm" | "cool" | "green" | "dark"; left?: boolean};
/** a Labels component: every spec label becomes a paper card at its position, shown from at(key); `lab` labels keep their own case */
export const mkLabels = (pos: Record<string, Pos>): React.FC<AP> => (p) => {
  const L = rlabs(p), labels = ((p.spec as any).labels ?? []) as {key: string}[];
  return (
    <>
      {labels.map((l, i) => {
        const q = pos[l.key];
        if (!q) return null;
        return <P2Card key={l.key} cx={q.cx} y={q.y} text={L[i].text} f={p.f} at={L[i].at} size={q.size ?? 38} maxW={q.maxW ?? 700} tone={q.tone ?? "warm"} upper={!L[i].isLab} left={q.left}/>;
      })}
    </>
  );
};

/** a thin leader line from a card to the thing it names; grows from frame `at` */
export const Leader: React.FC<{pts: Pt[]; f: number; at: number; col?: string; w?: number}> = ({pts, f, at, col = "#7a3d1c", w = 3}) => {
  const a = eo(prog(f, at + 4, 18));
  if (a <= 0.001) return null;
  const d = pts.map((q, i) => `${i ? "L" : "M"}${q[0]},${q[1]}`).join(" "), e = pts[pts.length - 1];
  return (
    <g opacity={a}>
      <path d={d} stroke="#fff6e2" strokeWidth={w + 3} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.65}/>
      <path d={d} stroke={col} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 0"/>
      <circle cx={e[0]} cy={e[1]} r={9} fill="#fff6e2" stroke={col} strokeWidth={3}/>
      <circle cx={e[0]} cy={e[1]} r={3.6} fill={col}/>
    </g>
  );
};

/** smooth path through points (quadratic through midpoints) */
export const curve = (pts: Pt[]) => {
  if (pts.length < 3) return pts.map((q, i) => `${i ? "L" : "M"}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += ` Q${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
  }
  const l = pts[pts.length - 1];
  return d + ` L${l[0].toFixed(1)},${l[1].toFixed(1)}`;
};

/** rising billowing puffs (steam / ash). u loops 0..1; alpha 0 at both ends so the loop never pops. */
export const Puffs: React.FC<{f: number; n: number; x0: number; y0: number; rise: number; drift?: number; r0: number; r1: number; speed?: number; seed?: number; spread?: number;
  cols?: [string, string, string]; op?: number; wob?: number; curveK?: number}> =
  ({f, n, x0, y0, rise, drift = 0, r0, r1, speed = 0.004, seed = 1, spread = 30, cols = ["#ffffff", "#e9e6e2", "#b9b8bd"], op = 1, wob = 10, curveK = 1.3}) => (
  <g opacity={op}>
    {Array.from({length: n}).map((_, i) => {
      const u = (f * speed + i / n + rnd(i, seed) * 0.02) % 1, g = Math.pow(u, curveK);
      const a = Math.min(1, u * 7) * Math.pow(1 - u, 0.9);
      const x = x0 + drift * g + (rnd(i, seed + 3) - 0.5) * spread * (0.4 + u * 1.2) + Math.sin(f / 30 + i * 2.1) * wob * u;
      const y = y0 - rise * u, r = mixn(r0, r1, Math.sqrt(u));
      return (
        <g key={i} opacity={a * 0.92}>
          <circle cx={x + r * 0.12} cy={y + r * 0.16} r={r} fill={cols[2]}/>
          <circle cx={x} cy={y} r={r * 0.95} fill={cols[1]}/>
          <circle cx={x - r * 0.28} cy={y - r * 0.3} r={r * 0.62} fill={cols[0]} opacity={0.85}/>
        </g>
      );
    })}
  </g>
);

/** scattered rock speckles inside a box, clipped by the caller */
export const Speckle: React.FC<{x: number; y: number; w: number; h: number; n: number; seed: number; cols: string[]; rmax?: number; op?: number}> = ({x, y, w, h, n, seed, cols, rmax = 3.4, op = 0.55}) => (
  <g opacity={op}>
    {Array.from({length: n}).map((_, i) => (
      <ellipse key={i} cx={x + rnd(i, seed) * w} cy={y + rnd(i, seed + 1) * h} rx={0.8 + rnd(i, seed + 2) * rmax} ry={0.6 + rnd(i, seed + 3) * rmax * 0.55}
        fill={cols[Math.floor(rnd(i, seed + 4) * cols.length)]} transform={`rotate(${rnd(i, seed + 5) * 60 - 30} ${x + rnd(i, seed) * w} ${y + rnd(i, seed + 1) * h})`}/>
    ))}
  </g>
);

/** composite-cone profile: y at x for a cone with peak (cx, base-H), half width hw, crater rim half width cr and bowl depth cd */
export const coneY = (x: number, cx: number, base: number, H: number, hw: number, cr = 34, cd = 30, k = 1.6) => {
  const d = Math.abs(x - cx);
  if (d >= hw) return base;
  if (d < cr) return base - H + cd * Math.cos((Math.PI / 2) * d / cr);
  return base - H * Math.pow(1 - (d - cr) / (hw - cr), k);
};

/** points along a function of x */
export const sampleY = (fn: (x: number) => number, x0: number, x1: number, step = 8): Pt[] => {
  const out: Pt[] = [];
  for (let x = x0; x <= x1 + 0.01; x += step) out.push([x, fn(x)]);
  return out;
};
export const poly = (pts: Pt[]) => pts.map((q, i) => `${i ? "L" : "M"}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");
