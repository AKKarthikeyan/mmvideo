// Counter motion. Object physics run on twos (stop-motion: the frame is floored to even); camera, type, tags and cards
// run on ones. Entrances are physical (drop, swing, slam, flip, feed), never fades from blank.
import {Easing, interpolate, random, spring} from "remotion";

export const FPS = 30;
export const on2 = (f: number) => Math.floor(f / 2) * 2;
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (f: number, a: number, b: number, fn: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [a, Math.max(a + 1e-3, b)], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: fn});
export const inOut = Easing.inOut(Easing.cubic);

// A drop: a 9-frame gravity fall from `from` px above, landing at `at` (on twos), squash 1.06/0.90 then a spring settle.
// vis is 0 before the fall starts (the object is out of frame above).
export const drop = (f: number, at: number, from = 260) => {
  const g = on2(f);
  if (g < at - 9) return {y: -from, sx: 1, sy: 1, vis: 0};
  if (g < at) { const t = (g - (at - 9)) / 9; return {y: -from * (1 - t * t), sx: 0.97, sy: 1.04, vis: 1}; }
  const s = spring({frame: g - at, fps: FPS, config: {damping: 9, stiffness: 260, mass: 0.6}});
  const k = 1 - s;
  return {y: 0, sx: 1 + 0.06 * k, sy: 1 - 0.10 * k, vis: 1};
};

// The small camera dip after a heavy landing (px, positive = down).
export const dip = (f: number, at: number, px = 3) => {
  const t = f - at;
  if (t < 0 || t > 10) return 0;
  return px * Math.sin((t / 10) * Math.PI) * Math.exp(-t / 6);
};

// A tag springing in (12/200) with a 7 degree swing decaying with tau 14 frames.
export const tagIn = (f: number, at: number) => {
  const t = f - at;
  if (t < 0) return {s: 0, rot: 0, vis: 0};
  const s = spring({frame: t, fps: FPS, config: {damping: 12, stiffness: 200}});
  return {s, rot: 7 * Math.exp(-t / 14) * Math.cos(t / 3.2), vis: clamp01(t / 2 + 0.5)};
};

// A card slam from scale 1.4 to 1 (spring 14/320).
export const slam = (f: number, at: number) => {
  const t = f - at;
  if (t < 0) return {s: 1.4, vis: 0};
  const k = spring({frame: t, fps: FPS, config: {damping: 14, stiffness: 320}});
  return {s: 1.4 - 0.4 * k, vis: 1};
};

// A flip about the vertical axis that starts at `at` and takes `dur` frames: the back shows until half way (edge-on),
// then the front. Returns the rotateY in degrees (180 -> 0) and which face is up.
export const flip = (f: number, at: number, dur = 8) => {
  const t = clamp01((f - at) / dur);
  const e = Easing.inOut(Easing.cubic)(t);
  const deg = 180 * (1 - e);
  return {deg, front: f >= at && deg <= 90};
};

// Seeded value in [0, 1) for a story, a beat and a purpose.
export const rnd = (seed: number, ...k: (string | number)[]) => random(`${seed}:${k.join(":")}`);
