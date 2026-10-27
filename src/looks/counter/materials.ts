// Counter materials: every colour of every object and surface is a mix of the brand's own palette roles (B.c), so the
// same code draws Data Kadai's teak and gold or Indica Atlas's navy and amber. Nothing here types a hex: mix() only
// blends two brand colours. contrastOf() / textOn() keep every word on a surface at 4.5:1 or better (3:1 for 40 px+),
// and throw otherwise, so a brand whose tones fail is caught in the still harness, not on a phone.
import type {LookBrand} from "../brands/types";
import {ratio} from "../brands/contrast";

const hex = (h: string) => {
  const s = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
};
const toHex = (c: number[]) => "#" + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("").toUpperCase();

// t = 0 gives a, t = 1 gives b.
export const mix = (a: string, b: string, t: number) => {
  const x = hex(a), y = hex(b);
  return toHex(x.map((v, i) => v + (y[i] - v) * t));
};
export const rgba = (h: string, a: number) => {
  const [r, g, b] = hex(h);
  return `rgba(${r},${g},${b},${+a.toFixed(3)})`;
};

export const contrastOf = (fg: string, bg: string) => ratio(fg, bg);

// Throws when a text colour fails on its surface: 4.5:1 below 40 px, 3:1 at 40 px or more.
export const assertContrast = (fg: string, bg: string, px: number, where: string) => {
  const r = ratio(fg, bg), min = px >= 40 ? 3 : 4.5;
  if (r < min) throw new Error(`counter: ${where}: text ${fg} on ${bg} is ${r.toFixed(2)}:1 at ${px}px (needs ${min}:1)`);
  return fg;
};

// The brand's ink or paper, whichever reads better on bg (checked).
export const textOn = (B: LookBrand, bg: string, px: number, where: string) => {
  const c = ratio(B.c.ink, bg) >= ratio(B.c.paper, bg) ? B.c.ink : B.c.paper;
  return assertContrast(c, bg, px, where);
};

export type Surface = "teak" | "velvet";

// Every material of the look, from the brand palette.
export const materials = (B: LookBrand) => {
  const c = B.c;
  const M = {
    // eye-level back wall: dark plaster under one warm key light from the top left
    wall: mix(c.deep, c.ink, 0.62), wallLow: mix(c.deep, c.ink, 0.86), wallLight: mix(c.accent2, c.paper, 0.35),
    // kirana teak, planks and grain
    teak: mix(c.accent2, c.ink, 0.52), teakLight: mix(c.accent2, c.ink, 0.40), teakDark: mix(c.accent2, c.ink, 0.70), grain: mix(c.accent2, c.ink, 0.84),
    // jeweller's velvet
    velvet: mix(c.accent, c.deep, 0.45), velvetLight: mix(c.accent, c.paper, 0.10), velvetDark: mix(c.deep, c.ink, 0.45),
    // brass (lips, loupe rim, unit key)
    brass: c.accent2, brassLight: c.accent2Light, brassDark: mix(c.accent2, c.ink, 0.45),
    // gold bars (oblique faces from the brand's amber)
    goldTop: mix(c.accent2, c.paper, 0.42), goldFront: mix(c.accent2, c.paper, 0.10), goldMid: c.accent2, goldDeep: mix(c.accent2, c.ink, 0.42), goldEdge: mix(c.accent2Light, c.paper, 0.6),
    // plain unmarked coins (steel), count tokens (paper with a rim)
    coin: mix(c.paper, c.muted, 0.30), coinEdge: mix(c.paper, c.muted, 0.62), coinDark: mix(c.muted, c.ink, 0.35),
    token: c.paper, tokenEdge: mix(c.paper, c.accent, 0.55), tokenDark: mix(c.accent, c.ink, 0.25),
    // glass and contents
    glass: c.paper, cola: mix(c.deep, c.ink, 0.45), colaLit: mix(mix(c.deep, c.ink, 0.45), c.accent2, 0.38),
    grainHero: c.accent2, grainHeroLight: c.accent2Light, grainOther: mix(c.paper, c.accent2, 0.18), grainOtherDark: mix(c.paper, c.muted, 0.45),
    // paper goods
    paper: c.paper, kraft: mix(c.paper, c.accent2, 0.32), kraftDark: mix(c.paper, c.accent2, 0.55), thermal: mix(c.paper, c.empty, 0.25),
    thread: c.accent, shadow: c.ink,
  };
  return M;
};
export type Mat = ReturnType<typeof materials>;

// Every object must stand out from what is behind it (the critic: dark caps on a dark crate were 1.2:1). The silhouette
// colour of each object (a glass object's rim, drawn at 0.75 of the brand's paper over the wall) is checked against the
// back wall and the velvet at 3:1, and every paper good against the top-down surfaces; a brand whose tones fail throws.
export const checkObjects = (M: Mat) => {
  const rim = mix(M.wall, M.glass, 0.75);
  const pairs: [string, string, string][] = [
    ["gold bar", M.goldMid, M.wall], ["gold bar", M.goldMid, M.velvet], ["coin", M.coin, M.wall], ["pad", M.token, M.wall],
    ["jar contents", M.grainHero, M.wall], ["jar contents", M.grainOther, M.wall], ["glass rim", rim, M.wall], ["glass rim", mix(M.velvet, M.glass, 0.75), M.velvet],
    ["brass", M.brass, M.wall], ["kraft", M.kraft, M.wall], ["bill", M.thermal, M.teak], ["bill", M.thermal, M.velvet], ["lit cola", M.colaLit, M.cola],
  ];
  for (const [what, a, b] of pairs) {
    const r = ratio(a, b);
    if (r < (what === "lit cola" ? 1.4 : 3)) throw new Error(`counter: ${what} ${a} on ${b} is ${r.toFixed(2)}:1 (needs ${what === "lit cola" ? 1.4 : 3}:1)`);
  }
  return true;
};
