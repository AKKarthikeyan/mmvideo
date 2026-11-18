// Camera on 2D: a keyframed camera over a 1920x1080 world, parallax layers, directional (whip) blur and rack focus.
// Pattern from premium/a01v3/kit.tsx (camAt / Layer), extended with depth-of-field and velocity blur.
import React, {useId} from "react";
import {AbsoluteFill} from "remotion";
import {H, W, clamp01, inOut} from "./tokens";

/** Camera: world point (x, y) shown at the screen centre at scale s; r = roll in degrees. */
export type Cam = {s: number; x: number; y: number; r?: number};
/** Key: [frame, scale, x, y, easing?, roll?]. Scale is interpolated geometrically so zooms feel even. */
export type CamKey = [number, number, number, number, ((t: number) => number)?, number?];

export const camAt = (f: number, keys: CamKey[]): Cam => {
  const k0 = keys[0];
  if (f <= k0[0]) return {s: k0[1], x: k0[2], y: k0[3], r: k0[5] || 0};
  for (let i = 1; i < keys.length; i++) {
    const [f1, s1, x1, y1, e, r1] = keys[i];
    const [f0, s0, x0, y0, , r0] = keys[i - 1];
    if (f <= f1) {
      const t = (e || inOut)(clamp01((f - f0) / Math.max(1e-6, f1 - f0)));
      return {s: s0 * Math.pow(s1 / s0, t), x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, r: (r0 || 0) + ((r1 || 0) - (r0 || 0)) * t};
    }
  }
  const l = keys[keys.length - 1];
  return {s: l[1], x: l[2], y: l[3], r: l[5] || 0};
};

/** Screen-space velocity of the camera at frame f (px per frame), used to drive whip blur automatically. */
export const camVel = (f: number, keys: CamKey[]) => {
  const a = camAt(f - 0.5, keys), b = camAt(f + 0.5, keys);
  return {vx: (b.x - a.x) * b.s, vy: (b.y - a.y) * b.s, vs: Math.log(b.s / a.s)};
};

/** CSS transform for a layer at parallax depth d (1 = moves with the camera; <1 = farther; >1 = nearer). */
export const camTransform = (c: Cam, d = 1) => {
  const s = 1 + (c.s - 1) * d, x = W / 2 + (c.x - W / 2) * d, y = H / 2 + (c.y - H / 2) * d;
  return `translate(${W / 2}px, ${H / 2}px) rotate(${(c.r || 0) * d}deg) scale(${s}) translate(${-x}px, ${-y}px)`;
};

/** A parallax layer. blur (px) = rack-focus amount for this layer. */
export const Layer: React.FC<{cam: Cam; depth?: number; blur?: number; style?: React.CSSProperties; children?: React.ReactNode}> =
  ({cam, depth = 1, blur = 0, style, children}) => (
    <AbsoluteFill style={{transform: camTransform(cam, depth), transformOrigin: "0 0", filter: blur > 0.15 ? `blur(${blur}px)` : undefined, ...style}}>
      {children}
    </AbsoluteFill>
  );

/**
 * Directional blur (a whip pan or a fast slide). bx, by = blur radius in px along x and y. Uses an SVG
 * feGaussianBlur with separate x/y deviation, which the browser renders as true motion-direction smear.
 */
export const DirBlur: React.FC<{bx: number; by?: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({bx, by = 0, children, style}) => {
  const id = "db" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const on = Math.abs(bx) > 0.3 || Math.abs(by) > 0.3;
  return (
    <AbsoluteFill style={style}>
      {on ? (
        <svg width={0} height={0} style={{position: "absolute"}}>
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation={`${Math.abs(bx).toFixed(2)} ${Math.abs(by).toFixed(2)}`} edgeMode="duplicate"/>
          </filter>
        </svg>
      ) : null}
      <AbsoluteFill style={{filter: on ? `url(#${id})` : undefined}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * A whole camera rig: world children drawn through `keys`, automatic whip blur from camera speed
 * (blur = speed * shutter, capped), optional rack focus per layer handled by the caller via <Layer blur>.
 */
export const CameraRig: React.FC<{f: number; keys: CamKey[]; shutter?: number; maxBlur?: number;
  children: (cam: Cam) => React.ReactNode}> = ({f, keys, shutter = 0.45, maxBlur = 40, children}) => {
  const cam = camAt(f, keys);
  const v = camVel(f, keys);
  const bx = Math.min(maxBlur, Math.abs(v.vx) * shutter), by = Math.min(maxBlur, Math.abs(v.vy) * shutter);
  return <DirBlur bx={bx > 1.5 ? bx : 0} by={by > 1.5 ? by : 0}>{children(cam)}</DirBlur>;
};
