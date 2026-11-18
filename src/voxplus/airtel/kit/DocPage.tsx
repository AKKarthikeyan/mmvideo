// DocPage: a real document page (an image rendered from the primary source) on paper, with highlighter wipes,
// marker circles/underlines/strikes, a page stack behind it, an entrance (slide with blur, drop, or flip) and
// rack focus that softens everything except the line being read. Place it in world space; the camera does the push-in.
import React from "react";
import {AbsoluteFill, Img} from "remotion";
import {Highlight, MarkerCircle, MarkerStrike, MarkerUnderline, Rect} from "./Marker";
import {C, V, clamp01, ease, inOut, outQuint, spr} from "./tokens";

export type DocMarks = {
  highlights?: {rects: Rect[]; at: number; dur?: number; color?: string}[];
  circles?: {rect: Rect; at: number; dur?: number; color?: string}[];
  underlines?: {rect: Rect; at: number; dur?: number; color?: string}[];
  strikes?: {rect: Rect; at: number; dur?: number; color?: string}[];
};
export type DocPageProps = DocMarks & {
  f: number;
  src: string;                 // path under public/voxplus/ (e.g. "docs/bh1985_looms.png")
  imgW: number; imgH: number;  // image pixels (rect coordinates are in these pixels)
  x: number; y: number;        // centre of the page in world px
  width: number;               // on-screen width of the image in world px (the paper margin is added around it)
  rot?: number;                // degrees, -2..+2 looks hand-placed
  margin?: number;             // paper margin around the text, as a share of width
  enter?: {at: number; mode: "slide-up" | "slide-right" | "slide-left" | "drop" | "flip"; dur?: number};
  stack?: number;              // sheets visible behind (0-4)
  focus?: {rect: Rect; at: number; blur?: number; dur?: number; feather?: number};   // rack focus to one line
  ink?: number;                // ink strength 0..1 (0.88 looks printed)
};

/** World position of a point inside the page image (image px), for aiming the camera at a highlighted line. */
export const docPoint = (p: Pick<DocPageProps, "x" | "y" | "width" | "imgW" | "imgH" | "rot">, ix: number, iy: number) => {
  const k = p.width / p.imgW, a = ((p.rot || 0) * Math.PI) / 180;
  const dx = (ix - p.imgW / 2) * k, dy = (iy - p.imgH / 2) * k;
  return {x: p.x + dx * Math.cos(a) - dy * Math.sin(a), y: p.y + dx * Math.sin(a) + dy * Math.cos(a)};
};
export const docRectCentre = (p: Pick<DocPageProps, "x" | "y" | "width" | "imgW" | "imgH" | "rot">, r: Rect) => docPoint(p, r[0] + r[2] / 2, r[1] + r[3] / 2);

const enterState = (f: number, e?: DocPageProps["enter"]) => {
  if (!e) return {dx: 0, dy: 0, rx: 0, blurX: 0, blurY: 0, o: 1, sc: 1};
  const d = e.dur ?? 12, t = (f - e.at) / d;
  if (t < 0) return null;
  const p = outQuint(clamp01(t)), v = 1 - p;
  switch (e.mode) {
    case "slide-up": return {dx: 0, dy: 900 * v, rx: 0, blurX: 0, blurY: 40 * v * (t < 1 ? 1 : 0), o: 1, sc: 1};
    case "slide-right": return {dx: -1500 * v, dy: 0, rx: 0, blurX: 50 * v * (t < 1 ? 1 : 0), blurY: 0, o: 1, sc: 1};
    case "slide-left": return {dx: 1500 * v, dy: 0, rx: 0, blurX: 50 * v * (t < 1 ? 1 : 0), blurY: 0, o: 1, sc: 1};
    case "drop": {
      const s = spr(f, e.at, 12, 160);
      return {dx: 0, dy: 0, rx: 0, blurX: 0, blurY: 0, o: clamp01(s * 3), sc: 1.35 - 0.35 * s};
    }
    case "flip": {
      const s = spr(f, e.at, 14, 120);
      return {dx: 0, dy: 0, rx: -100 * (1 - s), blurX: 0, blurY: 0, o: clamp01(s * 4), sc: 1};
    }
  }
};

export const DocPage: React.FC<DocPageProps> = (p) => {
  const {f, src, imgW, imgH, x, y, width, rot = 0, margin = 0.07, stack = 0, focus, ink = 0.9} = p;
  const st = enterState(f, p.enter);
  if (!st) return null;
  const k = width / imgW, ph = imgH * k, m = width * margin;
  const cardW = width + 2 * m, cardH = ph + 2 * m;
  const fb = focus ? (focus.blur ?? 2.6) * ease(f, focus.at, focus.at + (focus.dur ?? 18), inOut) : 0;
  const marksSvg = (
    <svg width={width} height={ph} viewBox={`0 0 ${imgW} ${imgH}`} style={{position: "absolute", left: m, top: m, overflow: "visible"}}>
      {(p.highlights || []).map((h, i) => <Highlight key={"h" + i} f={f} at={h.at} rects={h.rects} dur={h.dur} color={h.color} seed={"hl" + i}/>)}
      {(p.strikes || []).map((h, i) => <MarkerStrike key={"s" + i} f={f} at={h.at} rect={h.rect} dur={h.dur} color={h.color} width={9 / k * 0.5} seed={"st" + i}/>)}
      {(p.underlines || []).map((h, i) => <MarkerUnderline key={"u" + i} f={f} at={h.at} rect={h.rect} dur={h.dur} color={h.color} width={7 / k * 0.5} seed={"un" + i}/>)}
      {(p.circles || []).map((h, i) => <MarkerCircle key={"c" + i} f={f} at={h.at} rect={h.rect} dur={h.dur} color={h.color} width={8 / k * 0.5} seed={"mc" + i}/>)}
    </svg>
  );
  const page = (
    <>
      <Img src={V(src)} style={{position: "absolute", left: m, top: m, width, height: ph, mixBlendMode: "multiply", opacity: ink}}/>
      {marksSvg}
    </>
  );
  // sharp band around the focus line (feathered), over a softened copy of the whole page
  let sharpMask: string | undefined;
  if (focus && fb > 0.1) {
    const fy0 = m + focus.rect[1] * k, fy1 = fy0 + focus.rect[3] * k, fe = (focus.feather ?? 1.4) * focus.rect[3] * k;
    sharpMask = `linear-gradient(to bottom, transparent ${fy0 - fe}px, black ${fy0 - fe * 0.25}px, black ${fy1 + fe * 0.25}px, transparent ${fy1 + fe}px)`;
  }
  return (
    <div style={{position: "absolute", left: x - cardW / 2, top: y - cardH / 2, width: cardW, height: cardH, opacity: st.o,
      transform: `translate(${st.dx}px, ${st.dy}px) perspective(2200px) rotateX(${st.rx}deg) rotate(${rot}deg) scale(${st.sc})`, transformOrigin: "50% 0%",
      filter: st.blurX + st.blurY > 0.5 ? `blur(${Math.max(st.blurX, st.blurY) * 0.35}px)` : undefined}}>
      {Array.from({length: stack}).map((_, i) => {
        const j = stack - i;
        return <div key={i} style={{position: "absolute", inset: 0, transform: `translate(${j * 9}px, ${j * 7}px) rotate(${(j % 2 ? 1 : -1) * (0.8 + j * 0.5)}deg)`,
          background: `url(${V("tex/paper.jpg")}) ${C.paperDeep}`, backgroundSize: "1024px", filter: `brightness(${1 - j * 0.07})`, boxShadow: "0 8px 22px rgba(30,20,10,0.22)"}}/>;
      })}
      <div style={{position: "absolute", inset: 0, background: `url(${V("tex/paper.jpg")}) #FBF8F1`, backgroundSize: "1024px",
        boxShadow: "0 2px 3px rgba(30,20,10,0.18), 0 16px 34px rgba(30,20,10,0.26)", overflow: "hidden"}}>
        <AbsoluteFill style={{background: "#FFFCF5", opacity: 0.55}}/>
        <AbsoluteFill style={{filter: fb > 0.1 ? `blur(${fb}px)` : undefined}}>{page}</AbsoluteFill>
        {sharpMask ? <AbsoluteFill style={{WebkitMaskImage: sharpMask, maskImage: sharpMask}}>{page}</AbsoluteFill> : null}
        {/* light falloff across the sheet so it reads as paper under a lamp */}
        <AbsoluteFill style={{background: "linear-gradient(115deg, rgba(255,255,255,0.10), rgba(0,0,0,0) 40%, rgba(60,40,20,0.08))", pointerEvents: "none"}}/>
      </div>
    </div>
  );
};

/** Convenience: frames for a standard push toward a line (start scale -> end scale, centred on that line). */
export const pushToward = (f0: number, f1: number, from: {x: number; y: number}, to: {x: number; y: number}, s0: number, s1: number) =>
  [[f0, s0, from.x, from.y], [f1, s1, to.x, to.y, inOut]] as [number, number, number, number, ((t: number) => number)?][];
