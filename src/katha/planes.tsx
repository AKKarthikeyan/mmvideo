// Planes (16 Nov 2026, INNER_CHARIOT_PLAN_DEC_JAN.md runway): the four-plane parallax camera for Lamplight story scenes.
// A shot is a stack of layers, far to near, each at a depth: 1 = the subject plane (it moves exactly with the camera),
// > 1 = farther (moves less: the sky at 8, a far ridge at 4, mid trees at 2), < 1 = nearer (moves more: the passing
// foreground at 0.5). The camera pans (x, y in px at the subject plane) and pushes (zoom) across the beat; a layer at
// depth d moves by pan / d and zooms by 1 + (zoom - 1) / d, so near things slide past and far things barely drift.
// Haze: after each far layer a veil of the haze colour (strongest at the horizon line) is laid over it and everything
// behind, so depth reads as air (gradients only, no blur filters: the kit's rule).
// Draw every layer wider than the frame by its travel: a layer at depth d needs about |pan| / d spare on each side.
import React, {useId} from "react";
import {W, H} from "./look";
import {clamp01} from "./geom";

export type Cam = {x?: [number, number]; y?: [number, number]; zoom?: [number, number]; from?: number; to?: number};
export type PlaneL = {depth: number; node: React.ReactNode; haze?: number; key?: string};
const ease = (u: number) => u * u * (3 - 2 * u);
// Where the camera is at frame f of an n-frame beat (from / to: the part of the beat it moves in, 0..1).
export const camAt = (f: number, n: number, c: Cam) => {
  const u = ease(clamp01((f / Math.max(1, n) - (c.from ?? 0)) / Math.max(1e-6, (c.to ?? 1) - (c.from ?? 0))));
  const L = (r: [number, number] | undefined, d: number) => (r ? r[0] + (r[1] - r[0]) * u : d);
  return {x: L(c.x, 0), y: L(c.y, 0), z: L(c.zoom, 1)};
};
// The default haze for a layer at depth d: none at the subject plane or nearer, then more with distance.
export const hazeFor = (d: number) => (d <= 1 ? 0 : Math.min(0.42, 0.13 * Math.log2(d) + 0.04));

export const Planes: React.FC<{f: number; n: number; cam: Cam; layers: PlaneL[]; haze?: string; horizon?: number; cx?: number; cy?: number}> =
  ({f, n, cam, layers, haze = "#3A2A4E", horizon = H * 0.72, cx = W / 2, cy = H / 2}) => {
  const c = camAt(f, n, cam), id = "pl" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const sorted = [...layers].sort((a, b) => b.depth - a.depth);
  return (
    <g>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={0} y2={H}>
          <stop offset={0} stopColor={haze} stopOpacity={0.15}/>
          <stop offset={clamp01((horizon - 260) / H)} stopColor={haze} stopOpacity={0.55}/>
          <stop offset={clamp01(horizon / H)} stopColor={haze} stopOpacity={1}/>
          <stop offset={clamp01((horizon + 180) / H)} stopColor={haze} stopOpacity={0.35}/>
          <stop offset={1} stopColor={haze} stopOpacity={0}/>
        </linearGradient>
      </defs>
      {sorted.map((L, i) => {
        const d = Math.max(0.05, L.depth), z = 1 + (c.z - 1) / d, dx = -c.x / d, dy = -c.y / d;
        const hz = L.haze ?? hazeFor(d);
        return (
          <g key={L.key ?? i}>
            <g transform={`translate(${(cx + dx).toFixed(2)} ${(cy + dy).toFixed(2)}) scale(${z.toFixed(5)}) translate(${-cx} ${-cy})`}>{L.node}</g>
            {hz > 0.003 ? <rect x={-40} y={-40} width={W + 80} height={H + 80} fill={`url(#${id})`} opacity={hz}/> : null}
          </g>
        );
      })}
    </g>
  );
};

// Something that passes the lens on its own (a branch, grass, a post), independent of the camera: x moves from x0 by
// `speed` px a frame, wrapping over `span`. For a foreground that crosses the frame once in a beat, use speed ~ (W + width) / n.
export const passX = (f: number, x0: number, speed: number, span = W + 800) => ((((x0 - f * speed + 400) % span) + span) % span) - 400;
