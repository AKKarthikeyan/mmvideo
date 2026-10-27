// Text fitting by real measurement. Each string is measured once in a hidden <span> attached to document.body (outside
// any scale() transform, so a look drawn inside BeatPosts' scaled frame measures the same), with the exact font, weight,
// width axis and OpenType features it will be drawn with. Measure only after LookFonts reports the fonts loaded (LookStory
// does not render a look before that), or the fallback face is measured instead.
import type React from "react";
import type {ResolvedFont} from "../brands/types";

export type FitFont = Pick<ResolvedFont, "family" | "weight" | "stretch" | "tnum"> & {letterSpacing?: number};   // letterSpacing in em

const cache = new Map<string, number>();
let host: HTMLDivElement | null = null;

// Look faces ("'LK ...'") that LookFonts has loaded. Measuring with a look face before it is loaded would measure (and
// cache) the fallback face, so it throws: put the measuring code in a component rendered inside <LookFonts>.
const loaded = new Set<string>();
export const markFontLoaded = (family: string) => { loaded.add(family); };
const primary = (family: string) => (/^'([^']+)'/.exec(family) ?? [])[1] ?? "";

// Width in px of one line of text at `size` px. Without a DOM (never in a render) it falls back to 0.6 em per character.
export const measure = (text: string, font: FitFont, size: number): number => {
  const key = `${font.family}|${font.weight}|${font.stretch ?? 100}|${font.tnum ? 1 : 0}|${font.letterSpacing ?? 0}|${size}|${text}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  if (typeof document === "undefined") return text.length * size * 0.6;
  const fam = primary(font.family);
  if (fam.startsWith("LK ") && !loaded.has(fam)) throw new Error(`fit: "${text}" measured in ${fam} before the font was loaded (measure inside <LookFonts>)`);
  if (!host) {
    host = document.createElement("div");
    host.setAttribute("aria-hidden", "true");
    host.style.cssText = "position:absolute;left:-100000px;top:0;visibility:hidden;pointer-events:none;contain:layout style;";
    document.body.appendChild(host);
  }
  const s = document.createElement("span");
  s.style.cssText = `white-space:pre;font-family:${font.family};font-weight:${font.weight};font-stretch:${font.stretch ?? 100}%;font-size:${size}px;` +
    `font-feature-settings:${font.tnum ? "'tnum' 1, 'lnum' 1" : "'lnum' 1"};letter-spacing:${font.letterSpacing ?? 0}em;font-optical-sizing:auto;`;
  s.textContent = text;
  host.appendChild(s);
  const w = s.getBoundingClientRect().width;
  host.removeChild(s);
  cache.set(key, w);
  return w;
};

// Largest size (integer px) at most `max` at which `text` fits `width` on one line. It never returns less than `min`, so
// a string too long for `min` comes back at `min` and still overflows: use fitOrThrow (or fitLines) when that must not happen.
export const fitSize = (text: string, font: FitFont, width: number, max: number, min = 8): number => {
  const w100 = measure(text, font, 100);
  if (w100 <= 0) return max;
  let s = Math.min(max, Math.floor((width / w100) * 100));
  while (s > min && measure(text, font, s) > width) s--;
  return Math.max(min, s);
};

// The same, but a string that cannot fit at `min` is an error (a look must change its layout, not overflow).
export const fitOrThrow = (text: string, font: FitFont, width: number, max: number, min: number): number => {
  const s = fitSize(text, font, width, max, min);
  if (measure(text, font, s) > width + 0.5) throw new Error(`fit: "${text}" does not fit ${width}px even at ${min}px`);
  return s;
};

// Greedy word wrap at one size.
export const wrap = (text: string, font: FitFont, size: number, width: number): string[] => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && measure(next, font, size) > width) { lines.push(cur); cur = w; } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
};

// Largest size from `max` down to `min` at which `text` wraps into at most `maxLines` lines that each fit `width`.
export const fitLines = (text: string, font: FitFont, width: number, maxLines: number, max: number, min = 8): {size: number; lines: string[]} => {
  for (let s = max; s >= min; s -= s > 60 ? 2 : 1) {
    const lines = wrap(text, font, s, width);
    if (lines.length <= maxLines && lines.every((l) => measure(l, font, s) <= width)) return {size: s, lines};
  }
  return {size: min, lines: wrap(text, font, min, width)};
};

// The width-axis value (font-stretch %) in [lo, hi] at which text at `size` is as wide as possible within `width`
// (for Anybody's wdth 50-150). Returns lo when even lo is too wide; then shrink the size instead.
export const fitStretch = (text: string, font: FitFont, size: number, width: number, lo = 50, hi = 150): number => {
  if (measure(text, {...font, stretch: hi}, size) <= width) return hi;
  let a = lo, b = hi;
  for (let k = 0; k < 12; k++) { const m = (a + b) / 2; if (measure(text, {...font, stretch: m}, size) <= width) a = m; else b = m; }
  return Math.floor(a * 10) / 10;
};

// A ResolvedFont as a FitFont (letterSpacing in em).
export const fitFont = (f: ResolvedFont, letterSpacing = 0): FitFont => ({family: f.family, weight: f.weight, stretch: f.stretch, tnum: f.tnum, letterSpacing});

// The CSS a fitted string must be drawn with so it matches its measurement.
export const fitCss = (f: FitFont, size: number): React.CSSProperties => ({fontFamily: f.family, fontWeight: f.weight, fontStretch: `${f.stretch ?? 100}%`, fontSize: size,
  fontFeatureSettings: f.tnum ? "'tnum' 1, 'lnum' 1" : "'lnum' 1", letterSpacing: `${f.letterSpacing ?? 0}em`, whiteSpace: "pre", fontOpticalSizing: "auto"});
