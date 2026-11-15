// The channel bug: the brand's Mark plus its wordmark, inside the safe box (default: bottom-right, right edge at safe.x1,
// bottom at safe.y1). It is text, so it obeys the safe box like every other word. Returns its own box for collision checks.
import React from "react";
import type {LookBrand} from "../brands/types";

// A stacked wordmark (two lines) is sized by its total height, so it gets 1.6x the size of a one-line wordmark.
const dims = (B: LookBrand, size: number) => {
  const st = B.wordmark.stacked, word = st ? size * 1.6 : size, mark = st ? size * 1.9 : size * 1.3;
  const chars = st ? Math.max(...B.wordmark.parts.map((p) => p.length)) : B.wordmark.parts.join(" ").length;
  return {word, mark, h: Math.round(Math.max(mark, st ? word : size * 1.1)), w: Math.round(mark + size * 0.3 + word * (st ? 0.42 : 0.62) * chars)};
};
export const bugBox = (B: LookBrand, size = 34) => {
  const {w, h} = dims(B, size);
  return {x0: B.safe.x1 - w, x1: B.safe.x1, y0: B.safe.y1 - h, y1: B.safe.y1, w, h};
};

export const BrandBug: React.FC<{B: LookBrand; on?: "light" | "dark"; size?: number; x?: number; y?: number; opacity?: number; align?: "right" | "left"}> =
  ({B, on = "dark", size = 34, x, y, opacity = 0.95, align = "right"}) => {
  const box = bugBox(B, size), d = dims(B, size);
  const pos: React.CSSProperties = align === "right"
    ? {right: B.safe.w - (x ?? B.safe.x1), bottom: B.safe.h - (y ?? B.safe.y1)}
    : {left: x ?? B.safe.x0, bottom: B.safe.h - (y ?? B.safe.y1)};
  return <div style={{position: "absolute", ...pos, height: box.h, display: "flex", alignItems: "center", gap: size * 0.3, opacity}}>
    <B.Mark size={d.mark} on={on}/>
    <B.Wordmark size={d.word} on={on}/>
  </div>;
};
