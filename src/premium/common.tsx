// Premium style test (18 Oct 2026): shared timing, numbers, easing and finishing layers for treatments A, B and C.
// Same two moments in every treatment so AK compares style only. Every figure on screen comes from NUM below.
import React from "react";
import {AbsoluteFill, Easing, interpolate, random, spring, staticFile} from "remotion";

export const W = 1920, H = 1080, FPS = 30;
export const M1 = 240, M2 = 240, TOTAL = M1 + M2;
// Buffett's 1986 letter, our rupee arithmetic: of every 100 paid, GEICO's running cost vs many rivals'.
export const NUM = {paid: 100, geico: 23.5, rivals: 38.5, gap: 15};
export const FONT = "'Avenir Next', 'Avenir', 'Helvetica Neue', Arial, sans-serif";

// Moment 1 beats (frames inside moment 1)
export const B1 = {shops: 34, copy: [78, 92, 106], alone: 124, moat: 156};
// Moment 2 beats (frames inside moment 2)
export const B2 = {paid: 6, geico: 44, rivals: 74, line: 122, fill: 132, gap: 150, drain: 186, ring: 196};

export const outQuint = Easing.bezier(0.22, 1, 0.36, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);
export const outBack = Easing.bezier(0.34, 1.56, 0.64, 1);
export const lin = (f: number, a: number, b: number, v0: number, v1: number, e: (t: number) => number = outQuint) =>
  interpolate(f, [a, b], [v0, v1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e});
// Physically eased spring 0..1 (slight overshoot), 0 before `start`.
export const spr = (f: number, start: number, damping = 13, stiffness = 120, mass = 0.9) =>
  f < start ? 0 : spring({frame: f - start, fps: FPS, config: {damping, stiffness, mass}});
export const money = (v: number) => "₹" + v.toFixed(Math.abs(v - Math.round(v)) > 0.001 ? 2 : 0);

// Real camera-style motion blur for any element drawn from a frame number: draws the element at sub-frame times
// across the shutter and stacks them (current frame solid on top, earlier samples fading behind).
export const MBlur: React.FC<{f: number; render: (f: number) => React.ReactNode; samples?: number; shutter?: number}> =
  ({f, render, samples = 6, shutter = 1.4}) => (
    <AbsoluteFill>
      {Array.from({length: samples}).map((_, k) => {
        const i = samples - 1 - k;
        return <AbsoluteFill key={i} style={{opacity: i === 0 ? 1 : 0.28 * (1 - i / samples)}}>{render(f - (i * shutter) / samples)}</AbsoluteFill>;
      })}
    </AbsoluteFill>
  );

// Film grain: one pre-made noise tile, jumped to a new random offset every frame (cheap: no per-frame filter).
export const Grain: React.FC<{f: number; opacity?: number; blend?: any}> = ({f, opacity = 0.07, blend = "overlay"}) => (
  <AbsoluteFill style={{backgroundImage: `url(${staticFile("premium/grain.png")})`, backgroundSize: "512px 512px",
    backgroundPosition: `${Math.floor(random("gx" + f) * 512)}px ${Math.floor(random("gy" + f) * 512)}px`, mixBlendMode: blend, opacity, pointerEvents: "none"}}/>
);
export const Vignette: React.FC<{strength?: number; color?: string}> = ({strength = 0.45, color = "0,0,0"}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 75% 70% at 50% 48%, rgba(${color},0) 55%, rgba(${color},${strength}) 100%)`, pointerEvents: "none"}}/>
);

// Kinetic number: counts up with tabular figures, scales in on a spring, carries motion blur while it moves.
export const KineticNumber: React.FC<{f: number; start: number; to: number; x: number; y: number; size: number; color: string;
  dur?: number; from?: number; prefix?: string; shadow?: string; weight?: number; align?: "center" | "left" | "right"; glow?: string}> =
  ({f, start, to, x, y, size, color, dur = 26, from = 0, prefix = "₹", shadow, weight = 800, align = "center", glow}) => {
  const draw = (t: number) => {
    if (t < start) return null;
    const s = spr(t, start, 12, 140);
    const v = from + (to - from) * lin(t, start, start + dur, 0, 1, Easing.out(Easing.cubic));
    const dec = Math.abs(to - Math.round(to)) > 0.001 ? 2 : 0;
    const tx = align === "center" ? "-50%" : align === "right" ? "-100%" : "0";
    return (
      <div style={{position: "absolute", left: x, top: y, transform: `translate(${tx}, -50%) translateY(${(1 - s) * 40}px) scale(${0.6 + 0.4 * s})`,
        transformOrigin: "50% 60%", opacity: Math.min(1, s * 2), fontFamily: FONT, fontWeight: weight, fontSize: size, color,
        fontVariantNumeric: "tabular-nums", letterSpacing: -size * 0.02, whiteSpace: "nowrap", textShadow: [shadow, glow].filter(Boolean).join(", ") || undefined, lineHeight: 1}}>
        {prefix}{v.toFixed(dec)}
      </div>
    );
  };
  return <MBlur f={f} render={draw}/>;
};

// Short label (4 words or fewer) that rises in.
export const Label: React.FC<{f: number; start: number; x: number; y: number; text: string; size?: number; color?: string; weight?: number;
  shadow?: string; bg?: string; pad?: string; radius?: number; spacing?: number; upper?: boolean; border?: string}> =
  ({f, start, x, y, text, size = 40, color = "#fff", weight = 700, shadow, bg, pad = "10px 22px", radius = 999, spacing = 0.5, upper = false, border}) => {
  if (f < start) return null;
  const s = spr(f, start, 15, 160);
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) translateY(${(1 - s) * 24}px)`, opacity: Math.min(1, s * 1.6),
      fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: spacing, whiteSpace: "nowrap", textShadow: shadow,
      background: bg, padding: bg ? pad : 0, borderRadius: radius, textTransform: upper ? "uppercase" : "none", border, lineHeight: 1.1,
      backdropFilter: undefined}}>{text}</div>
  );
};

// Deterministic particle field: n points drifting with per-particle speed and phase.
export const particles = (seed: string, n: number) => Array.from({length: n}).map((_, i) => ({
  x: random(seed + "x" + i), y: random(seed + "y" + i), r: random(seed + "r" + i), s: random(seed + "s" + i), p: random(seed + "p" + i) * Math.PI * 2,
}));

// Wavy water surface path from x0 to x1 at height y (amplitude a, wavelength l, phase from the frame).
export const wave = (x0: number, x1: number, y: number, a: number, l: number, ph: number, close?: number) => {
  let d = `M ${x0} ${y + Math.sin(ph) * a}`;
  for (let x = x0 + 8; x <= x1 + 0.01; x += 8) d += ` L ${x} ${y + Math.sin((x / l) * Math.PI * 2 + ph) * a + Math.sin((x / (l * 0.43)) * Math.PI * 2 - ph * 1.3) * a * 0.35}`;
  if (close != null) d += ` L ${x1} ${close} L ${x0} ${close} Z`;
  return d;
};
