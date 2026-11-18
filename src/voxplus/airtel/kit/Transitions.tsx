// Transitions between beats, as @remotion/transitions presentations (use inside <TransitionSeries.Transition>):
//   whip(dir)          whip pan: both scenes travel fast with a directional smear peaking at the cut
//   pushThrough(x, y)  camera pushes fast into a point of the outgoing scene (scale 1 -> 4, blur peak) and lands in the next
//   paperOver(dir)     the next scene arrives as a sheet sliding over the old one (shadowed edge); the old one dims
//   matchZoom          the outgoing scene shrinks toward the centre while the next grows out of it (match cut on a shape)
// Library ones (fade, slide, wipe, clockWipe, iris) are re-exported for convenience. cube() is paid: never used.
import React from "react";
import {AbsoluteFill} from "remotion";
import type {TransitionPresentation, TransitionPresentationComponentProps} from "@remotion/transitions";
import {DirBlur} from "./Camera";
export {fade} from "@remotion/transitions/fade";
export {slide} from "@remotion/transitions/slide";
export {wipe} from "@remotion/transitions/wipe";
export {linearTiming, springTiming, TransitionSeries} from "@remotion/transitions";

type Dir = "left" | "right" | "up" | "down";
const vec = (d: Dir): [number, number] => (d === "left" ? [-1, 0] : d === "right" ? [1, 0] : d === "up" ? [0, -1] : [0, 1]);
const bell = (p: number) => Math.sin(Math.PI * Math.max(0, Math.min(1, p)));

type WhipProps = {dir: Dir; blur: number};
const Whip: React.FC<TransitionPresentationComponentProps<WhipProps>> = ({children, presentationDirection, presentationProgress: p, passedProps}) => {
  const [vx, vy] = vec(passedProps.dir);
  // ease-in-out travel; exiting goes from 0 to -1 screen, entering from +1 to 0 (scene moves opposite to the camera)
  const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  const off = presentationDirection === "exiting" ? -e : 1 - e;
  const b = passedProps.blur * bell(p);
  return (
    <AbsoluteFill style={{transform: `translate(${off * vx * 1920}px, ${off * vy * 1080}px)`}}>
      <DirBlur bx={vx ? b : 0} by={vy ? b : 0}>{children}</DirBlur>
    </AbsoluteFill>
  );
};
/** Whip pan in direction `dir` (the camera moves that way, so pictures move the other way). */
export const whip = (dir: Dir = "left", blur = 46): TransitionPresentation<WhipProps> => ({component: Whip, props: {dir, blur}});

type PushProps = {x: number; y: number; scale: number; blur: number};
const Push: React.FC<TransitionPresentationComponentProps<PushProps>> = ({children, presentationDirection, presentationProgress: p, passedProps}) => {
  const {x, y, scale, blur} = passedProps;
  if (presentationDirection === "exiting") {
    const e = p * p * p;
    const s = Math.pow(scale, e);
    return (
      <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${x}px ${y}px`, filter: `blur(${(blur * e).toFixed(1)}px)`, opacity: 1 - Math.max(0, (p - 0.75) * 4)}}>
        {children}
      </AbsoluteFill>
    );
  }
  const e = 1 - Math.pow(1 - p, 3);
  return (
    <AbsoluteFill style={{transform: `scale(${0.55 + 0.45 * e})`, filter: `blur(${(blur * 0.6 * (1 - e)).toFixed(1)}px)`, opacity: Math.min(1, p * 2.2)}}>{children}</AbsoluteFill>
  );
};
/** Push through a point (x, y in screen px) of the outgoing scene into the next one. */
export const pushThrough = (x = 960, y = 540, scale = 4, blur = 6): TransitionPresentation<PushProps> => ({component: Push, props: {x, y, scale, blur}});

type PaperProps = {dir: Dir};
const Paper: React.FC<TransitionPresentationComponentProps<PaperProps>> = ({children, presentationDirection, presentationProgress: p, passedProps}) => {
  const [vx, vy] = vec(passedProps.dir);
  if (presentationDirection === "exiting") {
    return <AbsoluteFill style={{filter: `brightness(${1 - 0.35 * p})`, transform: `translate(${-vx * 120 * p}px, ${-vy * 80 * p}px) scale(${1 - 0.04 * p})`}}>{children}</AbsoluteFill>;
  }
  const e = 1 - Math.pow(1 - p, 4);
  return (
    <AbsoluteFill style={{transform: `translate(${(1 - e) * vx * -1960}px, ${(1 - e) * vy * -1120}px) rotate(${(1 - e) * 3}deg)`,
      boxShadow: "0 0 60px rgba(0,0,0,0.45)"}}>{children}</AbsoluteFill>
  );
};
/** Paper sheet slides over from the side opposite `dir` (dir = direction of travel). */
export const paperOver = (dir: Dir = "up"): TransitionPresentation<PaperProps> => ({component: Paper, props: {dir}});

type MatchProps = {x: number; y: number};
const Match: React.FC<TransitionPresentationComponentProps<MatchProps>> = ({children, presentationDirection, presentationProgress: p, passedProps}) => {
  const o = `${passedProps.x}px ${passedProps.y}px`;
  if (presentationDirection === "exiting") return <AbsoluteFill style={{transform: `scale(${1 + 0.5 * p})`, transformOrigin: o, opacity: 1 - p}}>{children}</AbsoluteFill>;
  return <AbsoluteFill style={{transform: `scale(${0.7 + 0.3 * p})`, transformOrigin: o, opacity: p}}>{children}</AbsoluteFill>;
};
/** Zoom match cut around a shared point (both scenes scale about it while crossing). */
export const matchZoom = (x = 960, y = 540): TransitionPresentation<MatchProps> => ({component: Match, props: {x, y}});
