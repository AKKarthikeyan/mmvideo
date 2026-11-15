// Slab look: small pure helpers shared by every Slab file (no DOM). Colours are brand roles, never hex: a slab is a
// ColorRole and every text colour on it is picked through B.pairOk, so the same code is legal in any brand's tokens.
import {Easing, interpolate, spring} from "remotion";
import type {ColorRole, LookBrand} from "../brands/types";
import {ratio} from "../brands/contrast";

export const FPS = 30;
export const clamp01 = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// 0..1 between frames a and b (eased); before a 0, after b 1.
export const ease = (f: number, a: number, b: number, e: (t: number) => number = Easing.out(Easing.cubic)) =>
  b <= a ? (f >= a ? 1 : 0) : interpolate(f, [a, b], [0, 1], {...clamp01, easing: e});
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// The spec's springs: word slam 14/260/0.6, digit drop 14/420/0.4, tile stamp 12/320/0.5, hero slam 11/210/0.7.
export const SLAM = {damping: 14, stiffness: 260, mass: 0.6};
export const DROP = {damping: 14, stiffness: 420, mass: 0.4};
export const STAMP = {damping: 12, stiffness: 320, mass: 0.5};
export const HERO_SLAM = {damping: 11, stiffness: 210, mass: 0.7};
export const springAt = (f: number, at: number, config = SLAM) => f < at ? 0 : spring({frame: f - at, fps: FPS, config});

// Seeded choices: mulberry32 on (story seed, salt), so a story always draws the same layout and two stories differ.
export const rng = (seed: number, salt: number) => {
  let a = (seed ^ Math.imul(salt + 0x9e3779b9, 0x85ebca6b)) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
export const pickOf = <T,>(r: () => number, xs: T[]): T => xs[Math.floor(r() * xs.length) % xs.length];

// Anybody's vertical metrics (2000 upm: cap 1350, typo ascender 1590, descender 480). With line-height 1em the cap top
// sits 0.1025 em below the line box top and the baseline 0.7775 em below it.
export const CAP = 0.675;
export const CAP_TOP = 0.1025;
export const BASE = 0.7775;

// The colours a slab gives its type. Every text pair is checked against the brand's contrast rules.
export type Pal = {
  slab: ColorRole; bg: string;
  ink: string; inkRole: ColorRole;          // body words and labels
  hot: string; hotRole: ColorRole;          // emphasis words when drawn as text (no block)
  hotBlock: {bg: string; fg: string} | null;  // emphasis words drawn as a solid block (when hot text would not pass)
  num: string; numRole: ColorRole;          // hero digits (at hero sizes)
  drop: string;                             // hard drop behind hero digits and the tile colour
  tile: string; ghost: string;              // blank board tiles; the misregistration ghost at a lock
  block: {bg: string; fg: string};          // name blocks
  bar: string; bar2: string;                // primary and secondary rail bars
  rule: string;                             // hairlines, dashed ghosts, ticks
  dark: boolean;                            // the slab is dark (for the brand bug)
};

const lum = (hex: string) => {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// A pair is checked under the slab's own role and under any role of the same colour (Data Kadai's ground is its ink, the
// tokens list text pairs against "ink"), so a role alias never makes a legal pair look illegal or the reverse.
const ROLES: ColorRole[] = ["ground", "ink", "paper", "accent", "accent2", "deep", "muted", "ray", "line", "empty", "softInk", "accent2Text", "accent2Light", "newsprint", "newsprint2"];
export const okPair = (B: LookBrand, fg: ColorRole, bg: ColorRole, px: number) =>
  ROLES.some((r) => B.c[r] === B.c[bg] && B.pairOk(fg, r, px));

export const pick = (B: LookBrand, bg: ColorRole, fgs: ColorRole[], px: number, what: string): ColorRole => {
  const ok = fgs.find((r) => okPair(B, r, bg, px));
  if (!ok) throw new Error(`slab: no allowed ${what} colour on ${bg} at ${px}px in brand ${B.id} (tried ${fgs.join(", ")})`);
  return ok;
};

// A background tone for tiles and drops: the first role that differs visibly from the slab.
const tone = (B: LookBrand, slab: ColorRole, prefs: ColorRole[], min = 1.25) =>
  B.c[prefs.find((r) => B.c[r] !== B.c[slab] && ratio(B.c[r], B.c[slab]) >= min) ?? "line"];

export const palOf = (B: LookBrand, slab: ColorRole): Pal => {
  const bg = B.c[slab];
  const dark = lum(bg) < 0.45;
  const inkRole = pick(B, slab, dark ? ["paper", "accent2Light", "accent2"] : ["ink", "accent", "softInk"], 40, "text");
  const hotRole = pick(B, slab, slab === "paper" ? ["accent", "ink"] : ["accent2", "accent2Light", "paper", "ink"], 96, "emphasis");
  // emphasis that would be the body colour anyway becomes a block: ink on amber, paper on maroon
  const blockBg: ColorRole | null = hotRole === inkRole ? (slab === "accent2" ? "ink" : slab === "accent" ? "paper" : null) : null;
  const hotBlock = blockBg ? {bg: B.c[blockBg], fg: B.c[pick(B, blockBg, [slab, "accent2", "accent", "paper", "ink"], 40, "block emphasis")]} : null;
  const numRole = pick(B, slab, slab === "accent" ? ["paper", "accent2"] : slab === "paper" ? ["accent", "ink"] : slab === "accent2" ? ["ink"] : ["accent2", "paper"], 200, "hero digits");
  const dropPrefs: ColorRole[] = slab === "accent2" ? ["accent", "deep", "ink"] : slab === "paper" ? ["line", "empty"] : slab === "accent" ? ["deep", "ground"] : ["accent", "deep", "muted", "ray"];
  const drop = tone(B, slab, dropPrefs);
  const tile = tone(B, slab, slab === "accent2" ? ["ink", "deep"] : slab === "paper" ? ["empty", "line"] : slab === "accent" ? ["deep", "ground"] : ["accent", "deep", "muted", "ray"]);
  const ghost = tone(B, slab, slab === "accent" ? ["accent2", "deep"] : slab === "accent2" ? ["accent", "deep"] : ["accent", "accent2", "muted"], 1.5);
  const blockBgRole: ColorRole = slab === "ground" ? "accent2" : slab === "accent2" ? "ink" : slab === "accent" ? "paper" : slab === "paper" ? "accent" : "accent2";
  const blockFg = pick(B, blockBgRole, blockBgRole === "accent2" ? ["ink"] : blockBgRole === "ink" ? ["accent2", "paper"] : blockBgRole === "paper" ? ["accent", "ink"] : ["paper", "ink"], 60, "name block");
  const bar = B.c[numRole];
  const bar2 = dark ? B.c.line : B.c.softInk;
  return {slab, bg, ink: B.c[inkRole], inkRole, hot: B.c[hotRole], hotRole, hotBlock, num: B.c[numRole], numRole, drop, tile, ghost,
    block: {bg: B.c[blockBgRole], fg: B.c[blockFg]}, bar, bar2, rule: B.c[inkRole], dark};
};

// Short ids for colours in keys.
export const join = (...xs: (string | number | boolean | null | undefined)[]) => xs.join("|");
