// Collage: cut-out photos and paper pieces on a textured desk. Photo prints (white border, tape, halftone, grain),
// "sticker" cut-outs (alpha PNG with a baked white border), sticker labels and torn colour blocks. Every piece has
// the same entrance grammar (slide with blur, drop with overshoot, or pop) and can move "stepped" (12-15 fps) like
// paper animation on a smooth camera. Put pieces inside <Layer depth> from Camera.tsx for parallax.
import React from "react";
import {AbsoluteFill, Img, random} from "remotion";
import {Halftone} from "./Texture";
import {C, F, V, clamp01, outQuint, spr, step} from "./tokens";

export type Enter = {
  at: number;
  mode?: "slide" | "drop" | "pop" | "none";
  from?: [number, number];      // slide start offset in px (e.g. [1400, 0] = from the right)
  rot0?: number;                // extra rotation at the start (deg)
  dur?: number;                 // slide duration (frames)
  stepped?: number;             // hold each pose n frames (2 = 15 fps paper motion); 0 = smooth
};
export type Exit = {at: number; to?: [number, number]; dur?: number};

/** Shared entrance/exit pose for a collage piece. Returns null before it enters. */
export const piecePose = (f0: number, en?: Enter, ex?: Exit) => {
  const f = en?.stepped ? step(f0, en.stepped) : f0;
  let dx = 0, dy = 0, r = 0, s = 1, o = 1, blur = 0;
  if (en && en.mode !== "none") {
    if (f < en.at) return null;
    const mode = en.mode || "slide";
    if (mode === "slide") {
      const d = en.dur ?? 10, t = clamp01((f - en.at) / d), p = outQuint(t), v = 1 - p;
      const [fx, fy] = en.from || [1400, 0];
      // settle with a small overshoot after landing
      const settle = t >= 1 ? Math.exp(-(f - en.at - d) / 4) * Math.sin((f - en.at - d) * 0.9) * 0.012 : 0;
      dx = fx * v - fx * settle; dy = fy * v - fy * settle; r = (en.rot0 ?? 0) * v;
      blur = t < 1 ? 50 * v * (1 - t) : 0;   // Motion Array recipe: blur 50 -> 0 over the slide
    } else if (mode === "drop") {
      const k = spr(f, en.at, 11, 170);
      s = 1.6 - 0.6 * k; o = clamp01(k * 3); r = (en.rot0 ?? 0) * (1 - k); blur = (1 - clamp01(k * 1.4)) * 18;
    } else if (mode === "pop") {
      const k = spr(f, en.at, 10, 190);
      s = 0.4 + 0.6 * k; o = clamp01(k * 3); r = (en.rot0 ?? 0) * (1 - k);
    }
  }
  if (ex && f >= ex.at) {
    const d = ex.dur ?? 9, t = clamp01((f - ex.at) / d), p = t * t * t;
    const [tx, ty] = ex.to || [-1500, 0];
    dx += tx * p; dy += ty * p; blur += 45 * Math.sin(t * Math.PI) ; if (t >= 1) return null;
  }
  return {dx, dy, r, s, o, blur};
};

const poseStyle = (pose: NonNullable<ReturnType<typeof piecePose>>, rot: number): React.CSSProperties => ({
  transform: `translate(${pose.dx}px, ${pose.dy}px) rotate(${rot + pose.r}deg) scale(${pose.s})`,
  opacity: pose.o,
  filter: pose.blur > 0.6 ? `blur(${(pose.blur * 0.3).toFixed(1)}px)` : undefined,
});

const Tape: React.FC<{x: number; y: number; rot: number; w?: number}> = ({x, y, rot, w = 120}) => (
  <div style={{position: "absolute", left: x - w / 2, top: y - 18, width: w, height: 36, transform: `rotate(${rot}deg)`,
    background: "linear-gradient(180deg, rgba(236,226,200,0.78), rgba(222,210,180,0.72))", boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
    clipPath: "polygon(2% 8%, 98% 0%, 100% 92%, 0% 100%)", mixBlendMode: "multiply"}}/>
);

/** A photo print: image + white border + soft shadow + optional tape, halftone and inner push (the photo itself drifts). */
export const PhotoPrint: React.FC<{f: number; src: string; x: number; y: number; w: number; h: number; rot?: number;
  border?: number; tape?: boolean; halftone?: number; enter?: Enter; exit?: Exit; crop?: {s0: number; s1: number; fx?: number; fy?: number; dur?: number};
  darken?: number; caption?: string}> =
  ({f, src, x, y, w, h, rot = 0, border = 14, tape = true, halftone = 0.14, enter, exit, crop, darken = 0, caption}) => {
    const pose = piecePose(f, enter, exit);
    if (!pose) return null;
    const cs = crop ? crop.s0 + (crop.s1 - crop.s0) * clamp01((f - (enter?.at ?? 0)) / (crop.dur ?? 120)) : 1;
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, ...poseStyle(pose, rot)}}>
        <div style={{position: "absolute", inset: 0, background: C.white, boxShadow: "0 3px 4px rgba(30,20,10,0.2), 0 18px 40px rgba(30,20,10,0.32)"}}/>
        <div style={{position: "absolute", left: border, top: border, right: border, bottom: border + (caption ? 34 : 0), overflow: "hidden", background: "#222"}}>
          <Img src={V(src)} style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${cs})`,
            transformOrigin: `${(crop?.fx ?? 0.5) * 100}% ${(crop?.fy ?? 0.5) * 100}%`}}/>
          {halftone > 0 ? <Halftone opacity={halftone} size={5}/> : null}
          {darken > 0 ? <AbsoluteFill style={{background: `rgba(20,12,6,${darken})`}}/> : null}
          <AbsoluteFill style={{boxShadow: "inset 0 0 40px rgba(0,0,0,0.25)"}}/>
        </div>
        {caption ? <div style={{position: "absolute", left: border, right: border, bottom: 10, fontFamily: F.mono, fontSize: 18, color: C.inkSoft, letterSpacing: 0.5}}>{caption}</div> : null}
        {tape ? <>
          <Tape x={w * 0.5 + (random(src + "t") - 0.5) * 60} y={-4} rot={-3 + random(src + "r") * 6}/>
        </> : null}
      </div>
    );
  };

/** A sticker cut-out: an alpha PNG (white border already baked by tools/prep_media.py), with a lifted shadow. */
export const Sticker: React.FC<{f: number; src: string; x: number; y: number; w: number; h: number; rot?: number; enter?: Enter; exit?: Exit;
  bob?: number; shadow?: number}> = ({f, src, x, y, w, h, rot = 0, enter, exit, bob = 0, shadow = 1}) => {
  const pose = piecePose(f, enter, exit);
  if (!pose) return null;
  const lift = bob * Math.sin(f * 0.06);
  return (
    <div style={{position: "absolute", left: x - w / 2, top: y - h / 2 + lift, width: w, height: h, ...poseStyle(pose, rot)}}>
      <Img src={V(src)} style={{width: "100%", height: "100%",
        filter: `drop-shadow(0 ${4 * shadow}px ${3 * shadow}px rgba(30,20,10,0.25)) drop-shadow(0 ${22 * shadow}px ${26 * shadow}px rgba(30,20,10,0.3))`}}/>
    </div>
  );
};

/** Sticker label: white tag, bold black condensed caps, slight rotation and shadow (or "dark" = black tag, white text). */
export const StickerLabel: React.FC<{f: number; text: string; x: number; y: number; size?: number; rot?: number; enter?: Enter; exit?: Exit;
  dark?: boolean; color?: string; bg?: string; anchor?: "center" | "left" | "right"}> =
  ({f, text, x, y, size = 44, rot = -2, enter, exit, dark, color, bg, anchor = "center"}) => {
    const pose = piecePose(f, enter ?? {at: 0, mode: "pop"}, exit);
    if (!pose) return null;
    const tx = anchor === "center" ? "-50%" : anchor === "right" ? "-100%" : "0";
    return (
      <div style={{position: "absolute", left: x, top: y, transform: `translate(${tx}, -50%)`}}>
        <div style={{...poseStyle(pose, rot), padding: `${size * 0.22}px ${size * 0.42}px ${size * 0.18}px`, background: bg ?? (dark ? C.ink : C.white),
          color: color ?? (dark ? C.white : C.ink), fontFamily: F.sans, fontWeight: 900, fontSize: size, letterSpacing: size * 0.01, textTransform: "uppercase",
          lineHeight: 1, whiteSpace: "nowrap", boxShadow: "0 2px 3px rgba(0,0,0,0.18), 0 10px 22px rgba(0,0,0,0.22)", fontStretch: "condensed"}}>{text}</div>
      </div>
    );
  };

/** Torn paper block in a strong colour (Vox wall blue by default), for collage backgrounds. Torn edge from a seeded path. */
export const TornBlock: React.FC<{f: number; x: number; y: number; w: number; h: number; rot?: number; color?: string; enter?: Enter; seed?: string}> =
  ({f, x, y, w, h, rot = 0, color = C.wallBlue, enter, seed = "tb"}) => {
    const pose = piecePose(f, enter);
    if (!pose) return null;
    const N = 28, pts: string[] = [];
    for (let i = 0; i <= N; i++) pts.push(`${(i / N) * 100}% ${(random(seed + "t" + i) * 2.4).toFixed(2)}%`);
    for (let i = 0; i <= N; i++) pts.push(`${100 - random(seed + "r" + i) * 1.4}% ${(i / N) * 100}%`);
    for (let i = N; i >= 0; i--) pts.push(`${(i / N) * 100}% ${100 - random(seed + "b" + i) * 2.4}%`);
    for (let i = N; i >= 0; i--) pts.push(`${random(seed + "l" + i) * 1.4}% ${(i / N) * 100}%`);
    return (
      <div style={{position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, ...poseStyle(pose, rot),
        filter: "drop-shadow(0 6px 10px rgba(20,14,8,0.25))"}}>
        <div style={{width: "100%", height: "100%", clipPath: `polygon(${pts.join(",")})`, background: color}}>
          <AbsoluteFill style={{backgroundImage: `url(${V("tex/paper.jpg")})`, backgroundSize: "1024px", mixBlendMode: "multiply", opacity: 0.55}}/>
        </div>
      </div>
    );
  };
