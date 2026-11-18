// COPY of src/voxplus/tokens.ts for the scale film (original VoxPlus look restored 20 Oct 2026; themed copy in ../scale.bak_themed_1020).
// Vox Motion+ design tokens (18 Oct 2026): colours, type, frame, easing and small motion helpers.
// Colours start from VOX_STUDY.md section 2.3; the yellow highlighter and the black/cream pair carry the Vox read.
import {Easing, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";

export const W = 1920, H = 1080, FPS = 30;

// ---------- time base (60 fps, 18 Oct 2026) ----------
// Every duration, delay, stagger, hold and spring in src/voxplus is written in TICKS of 1/30 s (TICK = 30 a second).
// A composition at any frame rate turns its frame into ticks with useTicks() (frame * 30 / fps), so timing is the same
// at 30 or 60 fps; 60 fps samples the same curves twice as often. Sequence/TransitionSeries lengths and audio cues are
// real frames: convert with tk2f(ticks, fps). The demo and catalog run at 30 fps, where ticks == frames (unchanged).
export const TICK = 30;
export const useTicks = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return (f * TICK) / fps; };
export const tk2f = (ticks: number, fps: number) => Math.round((ticks * fps) / TICK);
export const V = (p: string) => staticFile("voxplus/" + p);

export const C = {
  teal: "#1F3BD6",   // scene role "primary" -> Vox wall blue (scale film)
  rust: "#E0245E",   // scene role "accent" -> marker red (scale film)
  paper: "#F3EEE3",
  paperDeep: "#E9E1D0",
  kraft: "#D6C8B0",
  ink: "#0E0E0E",
  inkSoft: "#2B2824",
  highlight: "#FFF200",
  highlightPrint: "#FFE81A",   // slightly warmer yellow for bars and text on black
  wallBlue: "#1F3BD6",
  chartBlue: "#2A3FD1",
  magenta: "#E6007E",
  markerRed: "#E0245E",
  mapLand: "#EDE6D3",
  mapLandOther: "#E2DAC6",
  mapWater: "#C9D3D6",
  mapFocus: "#E4572E",
  grey: "#8C877F",
  white: "#FFFDF8",
};

// Font pairing (all free licences, loaded from local @fontsource files in fonts.ts):
//   SERIF  DM Serif Display (OFL 1.1)  - big words, numbers, chart titles, chapter words
//   SANS   Inter (OFL 1.1)             - stickers, labels, small type
//   MONO   IBM Plex Mono (OFL 1.1)     - source lines and credits
//   MARKER Permanent Marker (Apache 2) - handwritten notes, PAUSE terms
export const F = {
  serif: "'DM Serif Display', 'Inter', Georgia, 'Times New Roman', serif",   // Inter fills the missing rupee glyph
  sans: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  mono: "'IBM Plex Mono', Menlo, monospace",
  marker: "'Permanent Marker', 'Marker Felt', cursive",
};

// ---------- easing ----------
export const outQuint = Easing.bezier(0.22, 1, 0.36, 1);
export const outCubic = Easing.out(Easing.cubic);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);
export const inCubic = Easing.in(Easing.cubic);
export const outBack = Easing.bezier(0.34, 1.56, 0.64, 1);
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** 0..1 progress between frames a and b with an easing. */
export const ease = (f: number, a: number, b: number, e: (t: number) => number = inOut) => e(clamp01((f - a) / Math.max(1e-6, b - a)));
/** interpolate v0 -> v1 between frames a and b (clamped, eased). */
export const lin = (f: number, a: number, b: number, v0: number, v1: number, e: (t: number) => number = outQuint) =>
  interpolate(f, [a, b], [v0, v1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e});
/** spring 0..1 (slight overshoot), 0 before `start`. */
export const spr = (f: number, start: number, damping = 13, stiffness = 140, mass = 0.9) =>
  f < start ? 0 : spring({frame: f - start, fps: FPS, config: {damping, stiffness, mass}});
/** Stepped time for paper cut-outs: holds each value for `n` frames (n = 2 gives 15 fps motion on a 30 fps film). */
export const step = (f: number, n = 2) => Math.floor(f / n) * n;
/** damped shake offset (px) after an impact at frame `at`. */
export const shake = (f: number, at: number, amp = 10, seed = "s") => {
  if (f < at) return {x: 0, y: 0};
  // noise keyed on whole ticks, blended between neighbours so fractional ticks (60 fps) move smoothly;
  // at whole ticks (30 fps) the values are exactly the old ones
  const k = f - at, d = Math.exp(-k / 5), k0 = Math.floor(k), w = k - k0;
  const n = (a: string) => (random(seed + a + k0) * (1 - w) + random(seed + a + (k0 + 1)) * w - 0.5) * 2 * amp * d;
  return {x: n("x"), y: n("y")};
};
export const fmtMoney = (v: number, prefix = "$") => prefix + Math.round(v).toLocaleString("en-US");
