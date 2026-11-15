// Brand tokens for the premium looks (docs/datakadai/looks/FOUNDATION.md). A look never types a colour, a font or a logo:
// it reads them from a Brand, so the same Slab, Counter or Dispatch code renders Data Kadai or Indica Atlas.
// The tokens themselves live in <brand>.tokens.json (readable by Python: scripts/datayt/look_tokens.py checks them);
// the <brand>.tsx file adds the code-drawn Mark and Wordmark.
import type React from "react";

export type LookId = "slab" | "counter" | "dispatch";
export const LOOK_IDS: LookId[] = ["slab", "counter", "dispatch"];
export type BrandId = "datakadai" | "indicaatlas";

// Palette roles every brand fills. ground: the default dark stage; ink: text on paper; paper: the light surface;
// accent: the lead / reveal colour; accent2: the hero-fact / challenger colour; deep: a darker accent for shadows and
// ticket backs; muted: secondary text on paper.
export type PaletteRole = "ground" | "ink" | "paper" | "accent" | "accent2" | "deep" | "muted";
// Named tones derived from the palette (never new hues): see each tokens.json "_derived_note".
export type DerivedRole = "ray" | "line" | "empty" | "softInk" | "accent2Text" | "accent2Light" | "newsprint" | "newsprint2";
export type ColorRole = PaletteRole | DerivedRole;

// Type roles. display: words and claims; hero: the numbers (tabular digits on); mono: chips, tickets, source lines;
// serif: editorial headlines; body: kickers, labels, footnotes; wordmark: the brand name only.
export type FontRole = "display" | "hero" | "mono" | "serif" | "body" | "wordmark";

export type FontFaceSpec = {
  family: string;                      // CSS family name, unique to the file
  file: string;                        // path under public/
  format: "truetype" | "woff2";
  weight: number | [number, number];   // @font-face descriptor (a range for a variable font)
  stretch?: [number, number];          // percent, for a wdth axis
  licence: string;
  probe: string;                       // characters the loader checks are drawn by this face, not a fallback
};
export type FontRoleSpec = {face: string; weight: number; stretch?: number; tnum: boolean; fallback: string};

export type ChipStyle = {bg: ColorRole; fg: ColorRole; font: FontRole; size: number; tracking: number; radius: number; padX: number; padY: number; upper: boolean};
// Frame px at 1080x1920. Every word and number stays inside [x0, x1] x [y0, y1]; grounds may bleed.
export type SafeBox = {w: number; h: number; x0: number; x1: number; y0: number; y1: number};
export type ContrastPair = {fg: ColorRole; bg: ColorRole; minPx?: number};

export type BrandTokens = {
  id: BrandId; name: string; handle: string; tagline: string;
  palette: Record<PaletteRole, string>;
  derived: Record<DerivedRole, string>;
  mapRamp: string[] | null;
  faces: Record<string, FontFaceSpec>;
  fonts: Record<FontRole, FontRoleSpec>;
  lookFonts: Partial<Record<LookId, Partial<Record<FontRole, FontRoleSpec>>>>;
  chip: ChipStyle;
  safe: SafeBox;
  contrast: {pairs: ContrastPair[]; never: [ColorRole, ColorRole][]};
  wordmark: {parts: [string, string]; font: FontRole; stacked: boolean};      // stacked: two lines (Indica Atlas), sized by total height
};

// "light": drawn on paper / a light ground; "dark": on ink, accent or deep grounds.
export type MarkProps = {size: number; on?: "light" | "dark"};
export type WordmarkProps = {size: number; on?: "light" | "dark"};

export type Brand = BrandTokens & {
  Mark: React.FC<MarkProps>;
  Wordmark: React.FC<WordmarkProps>;
};

// A font role as a look uses it: the CSS to spread into a style, plus the face behind it.
export type ResolvedFont = {
  role: FontRole; face: FontFaceSpec; family: string; weight: number; stretch?: number; tnum: boolean;
  css: React.CSSProperties;
};

// What a look component receives: the brand with colours flattened and fonts resolved for that look.
export type LookBrand = {
  id: BrandId; name: string; look: LookId;
  c: Record<ColorRole, string>;
  f: Record<FontRole, ResolvedFont>;
  chip: ChipStyle; safe: SafeBox; mapRamp: string[] | null;
  wordmark: {parts: [string, string]; font: FontRole; stacked: boolean};
  Mark: React.FC<MarkProps>; Wordmark: React.FC<WordmarkProps>;
  // true when fg on bg is an allowed pair at this frame-px size (see contrast.ts)
  pairOk: (fg: ColorRole, bg: ColorRole, px: number) => boolean;
  tokens: BrandTokens;
};
