// Brand registry. getBrand(id) returns a channel's tokens + Mark + Wordmark; lookBrand(brand, look) resolves them for one
// look (colours flattened, each font role picked from the look's override or the brand default). To add a channel:
// write <id>.tokens.json and <id>.tsx beside these, add it to BRANDS, then run scripts/datayt/look_tokens.py.
import {DATAKADAI} from "./datakadai";
import {INDICAATLAS} from "./indicaatlas";
import {pairOk} from "./contrast";
import type {Brand, BrandId, ColorRole, FontRole, LookBrand, LookId, ResolvedFont} from "./types";

export const BRANDS: Record<BrandId, Brand> = {datakadai: DATAKADAI, indicaatlas: INDICAATLAS};
export const DEFAULT_BRAND: BrandId = "datakadai";

export const getBrand = (id?: string | null): Brand => {
  const b = BRANDS[(id ?? DEFAULT_BRAND) as BrandId];
  if (!b) throw new Error(`Unknown brand "${id}". Known: ${Object.keys(BRANDS).join(", ")}`);
  return b;
};

const ROLES: FontRole[] = ["display", "hero", "mono", "serif", "body", "wordmark"];

export const resolveFont = (brand: Brand, look: LookId, role: FontRole): ResolvedFont => {
  const spec = brand.lookFonts[look]?.[role] ?? brand.fonts[role];
  const face = brand.faces[spec.face];
  if (!face) throw new Error(`${brand.id}: font role ${role} names unknown face ${spec.face}`);
  const family = `'${face.family}', ${spec.fallback}`;
  return {role, face, family, weight: spec.weight, stretch: spec.stretch, tnum: spec.tnum,
    css: {fontFamily: family, fontWeight: spec.weight, ...(spec.stretch ? {fontStretch: `${spec.stretch}%`} : {}),
      fontFeatureSettings: spec.tnum ? "'tnum' 1, 'lnum' 1" : "'lnum' 1", fontOpticalSizing: "auto"}};
};

export const lookBrand = (brand: Brand, look: LookId): LookBrand => {
  const c = {...brand.palette, ...brand.derived} as Record<ColorRole, string>;
  const f = Object.fromEntries(ROLES.map((r) => [r, resolveFont(brand, look, r)])) as Record<FontRole, ResolvedFont>;
  return {id: brand.id, name: brand.name, look, c, f, chip: brand.chip, safe: brand.safe, mapRamp: brand.mapRamp, wordmark: brand.wordmark,
    Mark: brand.Mark, Wordmark: brand.Wordmark, pairOk: (fg, bg, px) => pairOk(brand, fg, bg, px), tokens: brand};
};

// Every face a look needs (deduplicated), for the font loader.
export const facesFor = (brand: Brand, look: LookId) => {
  const seen = new Map<string, ResolvedFont["face"]>();
  for (const r of ROLES) { const ff = resolveFont(brand, look, r).face; seen.set(ff.family + ff.file, ff); }
  return [...seen.values()];
};

export type {Brand, BrandId, LookBrand, LookId} from "./types";
