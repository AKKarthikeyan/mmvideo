// 2.5D depth for the Vox Motion+ kit (21 Nov 2026).
//
// Camera.tsx gives each layer a hand-tuned parallax factor. This file replaces that guesswork with one model: flat
// planes stacked at a height z above the desk (z = 0 is the desk/subject plane, positive is nearer the lens), seen by
// one perspective camera. Parallax, scale, depth of field, haze and shadow length all come from the same z, so a
// scene can never contradict itself (a near piece that moves less than a far one, or a shadow that says "flat" while
// the parallax says "lifted").
//
//   const cam = cam3At(t, KEYS);                         // t in ticks (useTicks())
//   <Stage cam={cam}>                                    // whole-stage tilt (yaw/pitch), applied once
//     <Plane cam={cam} z={-600}><PaperSurface tone="kraft"/></Plane>   // far: smaller, slower, hazed, soft
//     <Plane cam={cam} z={0}>...the hero...</Plane>                    // focus plane
//     <Plane cam={cam} z={220}><Lifted lift={40}>label</Lifted></Plane> // near: faster, bigger
//   </Stage>
//   <SourceTag .../>                                     // sources and captions stay OUTSIDE the stage: they never move
//
// Craft rules this file encodes (docs/storytelling/VOX_CRAFT.md section 3):
// - Use 3 to 5 planes. More than that reads as a video game, fewer reads as a slide.
// - One light for the whole film (LIGHT): every shadow falls the same way.
// - The camera stays smooth; paper pieces may step on twos (Collage `enter.stepped: 2`, or `onTwos` below).
// - Orbit and roll stay small (yaw/pitch within about 6 degrees, roll within 2). Bigger and the flat cards show.
// - Text that must be read sits on the focus plane or nearer, never behind it (it would blur and haze).
import React, {useId} from "react";
import {AbsoluteFill, random} from "remotion";
import {C, H, W, clamp01, inOut, outBack} from "./tokens";

/** Reference distance: a plane at z = 0 seen from d = REF is drawn at scale 1 (pixel-for-pixel world coordinates). */
export const REF = 1000;

/** One key light for the whole film: shadows fall toward +x, +y (light from the top left, as on a desk lamp). */
export const LIGHT = {x: 0.45, y: 0.9};

/**
 * Camera state. x, y: world point (on the z = focus plane) at the screen centre. d: lens distance from the desk
 * (REF = 1000 is scale 1; smaller = pushed in, perspective grows). yaw, pitch, roll in degrees. focus: z of the sharp
 * plane. aperture: depth-of-field strength (0 = everything sharp). haze: 0..1 aerial perspective behind the focus.
 */
export type Cam3 = {x: number; y: number; d: number; yaw: number; pitch: number; roll: number; focus: number; aperture: number; haze: number};
export const CAM3: Cam3 = {x: W / 2, y: H / 2, d: REF, yaw: 0, pitch: 0, roll: 0, focus: 0, aperture: 0.35, haze: 0.35};

/** Key: [tick, partial camera, easing into this key]. Unspecified fields hold their previous value. */
export type Cam3Key = [number, Partial<Cam3>, ((t: number) => number)?];

/** Resolve the camera at tick t. Distance is interpolated geometrically (like camAt's scale) so a dolly feels even. */
export const cam3At = (t: number, keys: Cam3Key[]): Cam3 => {
  // fill each key forward so every key is a complete camera
  const full: [number, Cam3, (t: number) => number][] = [];
  let prev: Cam3 = CAM3;
  for (const [k, c, e] of keys) { prev = {...prev, ...c}; full.push([k, prev, e || inOut]); }
  if (!full.length) return CAM3;
  if (t <= full[0][0]) return full[0][1];
  for (let i = 1; i < full.length; i++) {
    const [t1, c1, e] = full[i], [t0, c0] = full[i - 1];
    if (t <= t1) {
      const p = e(clamp01((t - t0) / Math.max(1e-6, t1 - t0)));
      const mix = (a: number, b: number) => a + (b - a) * p;
      return {x: mix(c0.x, c1.x), y: mix(c0.y, c1.y), d: c0.d * Math.pow(c1.d / c0.d, p), yaw: mix(c0.yaw, c1.yaw),
        pitch: mix(c0.pitch, c1.pitch), roll: mix(c0.roll, c1.roll), focus: mix(c0.focus, c1.focus),
        aperture: mix(c0.aperture, c1.aperture), haze: mix(c0.haze, c1.haze)};
    }
  }
  return full[full.length - 1][1];
};

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Screen scale of a plane at height z. Clamped so a plane never passes the lens. */
export const planeScale = (cam: Cam3, z: number) => REF / Math.max(60, cam.d - z);

/** Where a world point (x, y) on the plane at height z lands on screen (for pinning screen-space labels to a piece). */
export const project = (cam: Cam3, z: number, x: number, y: number) => {
  const s = planeScale(cam, z), {cx, cy} = planeCentre(cam, z);
  return {x: W / 2 + (x - cx) * s, y: H / 2 + (y - cy) * s, s};
};

/** The world point a plane shows at the screen centre: the camera target, shifted by orbit (yaw/pitch) about the focus plane. */
const planeCentre = (cam: Cam3, z: number) => ({
  cx: cam.x + Math.tan(rad(cam.yaw)) * (z - cam.focus),
  cy: cam.y - Math.tan(rad(cam.pitch)) * (z - cam.focus),
});

/** Depth-of-field blur (px) for a plane: grows with the scale difference from the focus plane. */
export const dofBlur = (cam: Cam3, z: number, maxBlur = 22) => {
  const s = planeScale(cam, z), sf = planeScale(cam, cam.focus);
  return Math.min(maxBlur, cam.aperture * 60 * Math.abs(s - sf) / sf);
};

/** Aerial perspective 0..1: planes behind the focus lose contrast and saturation, as far things do. */
export const hazeAt = (cam: Cam3, z: number) => cam.haze * clamp01((cam.focus - z) / 700);

/**
 * The stage: applies yaw/pitch as a gentle keystone to the whole stack (the per-plane orbit shift is done in Plane),
 * plus roll. Put every Plane inside one Stage; put sources, captions and the Finish outside it.
 */
export const Stage: React.FC<{cam: Cam3; children?: React.ReactNode; tilt?: number}> = ({cam, children, tilt = 0.45}) => (
  <AbsoluteFill style={{overflow: "hidden"}}>
    <AbsoluteFill style={{transformOrigin: "50% 50%",
      transform: `perspective(2600px) rotateX(${(cam.pitch * tilt).toFixed(3)}deg) rotateY(${(cam.yaw * tilt).toFixed(3)}deg) rotate(${cam.roll.toFixed(3)}deg)`}}>
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

/**
 * A flat plane at height z. Children are drawn in 1920x1080 world coordinates. Scale, parallax, depth of field and
 * haze are derived from z and the camera; override `blur` only to force a look (e.g. a deliberately sharp background).
 */
export const Plane: React.FC<{cam: Cam3; z: number; blur?: number; noHaze?: boolean; opacity?: number;
  style?: React.CSSProperties; children?: React.ReactNode}> = ({cam, z, blur, noHaze, opacity = 1, style, children}) => {
  const s = planeScale(cam, z), {cx, cy} = planeCentre(cam, z);
  const b = blur ?? dofBlur(cam, z);
  const h = noHaze ? 0 : hazeAt(cam, z);
  const filters: string[] = [];
  if (b > 0.25) filters.push(`blur(${b.toFixed(2)}px)`);
  if (h > 0.01) filters.push(`contrast(${(1 - 0.38 * h).toFixed(3)}) saturate(${(1 - 0.45 * h).toFixed(3)}) brightness(${(1 + 0.1 * h).toFixed(3)})`);
  return (
    <AbsoluteFill style={{transformOrigin: "0 0", opacity,
      transform: `translate(${W / 2}px, ${H / 2}px) scale(${s.toFixed(5)}) translate(${(-cx).toFixed(2)}px, ${(-cy).toFixed(2)}px)`,
      filter: filters.length ? filters.join(" ") : undefined, ...style}}>
      {children}
    </AbsoluteFill>
  );
};

/** CSS drop-shadow for a piece lifted `lift` world px above the surface below it, cast by LIGHT. */
export const liftShadow = (lift: number, strength = 1) => {
  const l = Math.max(0, lift);
  const far = clamp01(l / 600);
  // two shadows: a tight contact shadow that fades as the piece rises, and a cast shadow that grows and softens
  const contact = `drop-shadow(${(LIGHT.x * 1.5).toFixed(1)}px ${(LIGHT.y * 2).toFixed(1)}px ${(1.5 + l * 0.02).toFixed(1)}px rgba(30,20,10,${(0.32 * (1 - clamp01(l / 60)) * strength).toFixed(3)}))`;
  const cast = `drop-shadow(${(LIGHT.x * (3 + l * 0.16)).toFixed(1)}px ${(LIGHT.y * (3 + l * 0.16)).toFixed(1)}px ${(3 + l * 0.22).toFixed(1)}px rgba(30,20,10,${((0.34 - 0.2 * far) * strength).toFixed(3)}))`;
  return `${contact} ${cast}`;
};

/**
 * A piece lifted off its plane: casts a LIGHT shadow whose offset and softness follow `lift`, and grows a touch
 * (the perspective of being nearer). Animate `lift` with liftArc for a pick-up-and-place.
 */
export const Lifted: React.FC<{lift: number; x?: number; y?: number; strength?: number; children?: React.ReactNode; style?: React.CSSProperties}> =
  ({lift, x = W / 2, y = H / 2, strength = 1, children, style}) => {
    const g = REF / (REF - Math.min(lift, 400) * 0.5);
    return (
      <AbsoluteFill style={{transformOrigin: `${x}px ${y}px`, transform: `scale(${g.toFixed(4)})`, filter: liftShadow(lift, strength), ...style}}>
        {children}
      </AbsoluteFill>
    );
  };

/**
 * Pick-up-and-place height curve (ticks). The piece rises to `peak`, travels, then lands with one small bounce:
 * anticipation, arc and follow-through in one number. Returns {lift, p} where p is 0..1 travel progress for x/y.
 */
export const liftArc = (t: number, at: number, dur = 24, peak = 140) => {
  if (t <= at) return {lift: 0, p: 0};
  const u = clamp01((t - at) / dur);
  const p = inOut(u);
  let lift = peak * Math.sin(Math.PI * Math.min(1, u * 1.08));
  if (u >= 1 / 1.08) {   // landed: one damped bounce, 6 ticks
    const k = (t - at - dur / 1.08) / 6;
    lift = k < 1 ? 10 * Math.sin(Math.PI * k) * (1 - k) : 0;
  }
  return {lift: Math.max(0, lift), p};
};

/**
 * Hinge: a card folds into view about one edge (a pop-up book page, a flap on a board). Edge-on at start, flat at the
 * end, with an outBack settle. The cast shadow is longest mid-fold. stepped = hold each pose n ticks (2 = on twos).
 */
export const Hinge: React.FC<{t: number; at: number; dur?: number; edge?: "bottom" | "top" | "left" | "right";
  x: number; y: number; w: number; h: number; stepped?: number; children?: React.ReactNode}> =
  ({t: t0, at, dur = 16, edge = "bottom", x, y, w, h, stepped = 0, children}) => {
    const t = stepped ? Math.floor(t0 / stepped) * stepped : t0;
    if (t < at) return null;
    const p = outBack(clamp01((t - at) / dur));
    const a = 90 * (1 - p);   // degrees from flat
    const origin = {bottom: "50% 100%", top: "50% 0%", left: "0% 50%", right: "100% 50%"}[edge];
    const rot = edge === "bottom" ? `rotateX(${a}deg)` : edge === "top" ? `rotateX(${-a}deg)` : edge === "left" ? `rotateY(${-a}deg)` : `rotateY(${a}deg)`;
    const lift = Math.sin(rad(Math.max(0, a))) * Math.max(w, h) * 0.35;
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transformOrigin: origin,
        transform: `perspective(1400px) ${rot}`, filter: liftShadow(lift), opacity: a > 88 ? 0 : 1}}>
        {children}
      </div>
    );
  };

/** Hold time on twos (or n): use for anything hand-made (paper, cut-outs, marker) while the camera stays smooth. */
export const onTwos = (t: number, n = 2) => Math.floor(t / n) * n;

/**
 * Idle drift so a long hold (4-10 s) is never a frozen frame: a slow, seeded float of a few px and a fraction of a
 * degree. Secondary action only: keep amp at 2-6 px for paper, 0 for anything the viewer must read closely.
 */
export const drift = (t: number, seed: string, amp = 4, period = 240) => {
  const ph = random(seed) * Math.PI * 2, w = (Math.PI * 2) / period;
  return {x: amp * Math.sin(t * w + ph), y: amp * 0.6 * Math.sin(t * w * 0.73 + ph * 1.7), r: amp * 0.06 * Math.sin(t * w * 0.51 + ph)};
};

/**
 * Line boil: a hand-cut wobble on vector art (SVG turbulence that changes every `every` ticks). 1-2 px reads as paper
 * and scissors; more reads as a glitch. Wrap only edges and drawings, never body text or numbers.
 */
export const Boil: React.FC<{t: number; amount?: number; every?: number; seed?: number; children?: React.ReactNode}> =
  ({t, amount = 1.6, every = 3, seed = 7, children}) => {
    const id = "boil" + useId().replace(/[^a-zA-Z0-9]/g, "");
    const k = Math.floor(t / every) % 8;   // cycle 8 shapes, as hand-drawn boil loops do
    return (
      <AbsoluteFill>
        <svg width={0} height={0} style={{position: "absolute"}}>
          <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves={2} seed={seed + k}/>
            <feDisplacementMap in="SourceGraphic" scale={amount * 2} xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </svg>
        <AbsoluteFill style={{filter: `url(#${id})`}}>{children}</AbsoluteFill>
      </AbsoluteFill>
    );
  };

/** A plain card on a plane (paper colour, LIGHT shadow) for quick depth blocking before the real art exists. */
export const BlockCard: React.FC<{x: number; y: number; w: number; h: number; color?: string; lift?: number; rot?: number; children?: React.ReactNode}> =
  ({x, y, w, h, color = C.white, lift = 8, rot = 0, children}) => (
    <div style={{position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, background: color,
      transform: `rotate(${rot}deg)`, filter: liftShadow(lift)}}>{children}</div>
  );
