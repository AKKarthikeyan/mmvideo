// The counter camera (after AK's voxplus camAt, ported to 1080x1920): a world point (x, y) at the screen centre at scale
// s. It moves the world layer only (surfaces and objects); every word stays in screen space, and a word tied to an object
// (a shelf label, a tag's thread) is placed by projecting the object's world point and clamping into the safe box.
// Every framing keeps the counter's base line where it is on screen (scale pivots on it), so the shelf labels and the
// source chit on the counter front never move: the moves are a punch toward the subject, a pull back, a pan, and a
// rise (a slow push that lifts the tops). A ±1 px drift keeps holds alive.
import {noise2D} from "@remotion/noise";
import type {BeatPlan} from "./plan";
import {ease, inOut} from "./motion";
import {STAGE} from "./surfaces";

export type Cam = {s: number; x: number; y: number};
const yFor = (s: number) => STAGE.base - (STAGE.base - 960) / s;      // keeps world y = base at screen y = base
export const ID: Cam = {s: 1, x: 540, y: 960};
export const baseCam = (s: number, x = 540): Cam => ({s, x, y: yFor(s)});

export const project = (c: Cam, wx: number, wy: number): [number, number] => [540 + (wx - c.x) * c.s, 960 + (wy - c.y) * c.s];
export const camCss = (c: Cam) => `translate(540px, 960px) scale(${c.s}) translate(${-c.x}px, ${-c.y}px)`;

// The camera of a beat at frame f. base: the resting framing; focus: the world point the moves go toward. Each move
// eases in over 10-14 frames and is held; a slow push across the whole beat keeps every hold alive.
export const camAt = (p: BeatPlan, f: number, f0: number, base: Cam, focus: [number, number], seed: number, f1 = f0 + 120): Cam => {
  const e0 = ease(f, f0, f0 + 14, inOut);
  let s = base.s * (1.04 - 0.04 * e0), x = base.x;
  s *= 1 + 0.025 * Math.max(0, Math.min(1, (f - f0) / Math.max(1, f1 - f0)));
  for (const m of p.moves) {
    const t = ease(f, m.f, m.f + (m.kind === "punch" ? 10 : 14), inOut);
    if (t <= 0) continue;
    // bold enough to read on a phone (the scene caps the scale by the room above the objects, so a tall pile only pans/pulls)
    if (m.kind === "punch") { s *= 1 + 0.32 * t; x += (focus[0] - x) * 0.5 * t; }
    else if (m.kind === "crane") { s *= 1 + 0.18 * t; x += (focus[0] - x) * 0.3 * t; }
    else if (m.kind === "pull") s *= 1 - 0.15 * t;
    else if (m.kind === "push") s *= 1 + 0.176 * t;           // undoes a pull
    else x += (focus[0] > 540 ? 140 : -140) * t;
  }
  return {s, x: x + noise2D(`cx${seed}`, f * 0.03, 0), y: yFor(s) + noise2D(`cy${seed}`, 0, f * 0.03) * 0.6};
};
