// Editor's marks: thin wrappers over @remotion/rough-notation (MIT) that take a start frame and a duration instead of a
// raw progress, and refuse a seed below 1 (rough-notation draws the same strokes for one seed, so marks stay identical
// across renders and concurrency). Colours come from the brand: pass B.c.<role>. Rough-notation sizes the mark from the
// element's layout box (offsetWidth/offsetHeight), so marks are right inside a scaled frame too (BeatPosts).
import React from "react";
import {Easing, interpolate, useCurrentFrame} from "remotion";
import {Box, Bracket, Circle, CrossedOff, Highlight, StrikeThrough, Underline} from "@remotion/rough-notation";

export type MarkKind = "underline" | "circle" | "highlight" | "crossed-off" | "strike-through" | "bracket" | "box";
const KINDS = {underline: Underline, circle: Circle, highlight: Highlight, "crossed-off": CrossedOff, "strike-through": StrikeThrough, bracket: Bracket, box: Box} as const;

export const markProgress = (f: number, at: number, dur: number) =>
  interpolate(f, [at, at + Math.max(1, dur)], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic)});

export type EditorMarkProps = {
  kind: MarkKind; at: number; dur?: number; seed: number; color: string; strokeWidth?: number;
  padding?: number | {left?: number; right?: number; top?: number; bottom?: number}; iterations?: number;
  brackets?: ("left" | "right" | "top" | "bottom")[]; style?: React.CSSProperties; children: React.ReactNode;
};

export const EditorMark: React.FC<EditorMarkProps> = ({kind, at, dur = 12, seed, color, strokeWidth = 8, padding, iterations = 1, brackets, style, children}) => {
  const f = useCurrentFrame();
  if (!(seed >= 1) || !Number.isInteger(seed)) throw new Error(`EditorMark: seed must be a whole number of 1 or more (got ${seed})`);
  const C = KINDS[kind] as React.FC<Record<string, unknown>>;
  const pad = typeof padding === "number" ? {left: padding, right: padding, top: padding, bottom: padding} : padding;
  const extra: Record<string, unknown> = {};
  if (kind !== "highlight") extra.strokeWidth = strokeWidth;
  if (pad && kind !== "underline" && kind !== "crossed-off" && kind !== "strike-through") extra.padding = pad;
  if (kind === "underline" && pad?.top !== undefined) extra.padding = {top: pad.top};
  if (kind === "bracket") {
    const on = brackets ?? ["left", "right"];
    Object.assign(extra, {bracketLeft: on.includes("left"), bracketRight: on.includes("right"), bracketTop: on.includes("top"), bracketBottom: on.includes("bottom")});
  }
  if (kind !== "bracket") extra.iterations = iterations;
  return <C progress={markProgress(f, at, dur)} seed={seed} color={color} style={style} {...extra}>{children}</C>;
};

// A seed for the n-th mark of a story: stable, 1 or more, different per mark.
export const markSeed = (storySeed: number, n: number) => ((storySeed + n * 7919) % 2147483646) + 1;
