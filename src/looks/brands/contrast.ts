// WCAG contrast for brand pairs. A pair listed in a brand's tokens is allowed at any size at 4.5:1 or more, at minPx frame
// px or larger between 3:1 and 4.5:1, and never below 3:1 or when it is on the brand's "never" list.
// The same rule is checked offline by scripts/datayt/look_tokens.py.
import type {BrandTokens, ColorRole} from "./types";

const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
export const luminance = (hex: string) => {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
export const ratio = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

export const colorOf = (t: BrandTokens, r: ColorRole) => (t.palette as Record<string, string>)[r] ?? (t.derived as Record<string, string>)[r];

export const pairOk = (t: BrandTokens, fg: ColorRole, bg: ColorRole, px: number) => {
  if (t.contrast.never.some(([a, b]) => a === fg && b === bg)) return false;
  const p = t.contrast.pairs.find((x) => x.fg === fg && x.bg === bg);
  if (!p) return false;
  const r = ratio(colorOf(t, fg), colorOf(t, bg));
  if (r < 3) return false;
  const min = Math.max(p.minPx ?? 0, r < 4.5 ? 40 : 0);
  return px >= min;
};
