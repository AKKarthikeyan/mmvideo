// Shared bits for the Namakkal scene kinds (price-line, share-map, doc), 29 Oct 2026: printed numbers, the series, the source tag.
// The Kurzgesagt-style look (src/looks/kurz) reads the same helpers, so both looks print the same figures from the same keys.
import type {LookNum} from "../../../shared/types";
import {fig, meta} from "../figs";
import type {FigRef} from "../contract";

export type NumIn = {key: string; ref: FigRef; decimals?: number; prefix?: string; suffix?: string};

// A LookNum for a printed value: Badge/Num refuse to draw it before lockF (the narrator's word).
export const numOf = (n: NumIn, lockF: number): LookNum => {
  const dec = n.decimals ?? 2, v = fig(n.ref, dec), prefix = n.prefix ?? "", suffix = n.suffix ?? "";
  const neg = v.value < 0, digits = Math.abs(v.value).toFixed(dec);
  const text = (neg ? "−" : "") + prefix + digits + suffix;
  return {text, qual: "", sign: neg ? "−" : "", prefix, digits, unit: suffix, value: v.value, scale: 1, grouping: "none", decimals: dec, glyphs: [...text],
    role: "big", lockF, spokenF: lockF, lockHow: "spoken"};
};

// A daily series from figures.json meta.nk_series: [[iso date, rupees], ...]. Throws if absent.
export const seriesOf = (name: string): {d: string; v: number}[] => {
  const s = meta(`meta.nk_series.${name}`);
  if (!Array.isArray(s) || s.length < 2) throw new Error(`series missing: nk_series.${name}`);
  return s.map(([d, v]: [string, number]) => ({d, v}));
};

export const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const dayLabel = (iso: string) => { const [, m, d] = iso.split("-").map(Number); return `${d} ${MON[m - 1]}`; };

export const pinOf = (name: string): [number, number] => {
  const p = meta(`meta.nk_pin.${name}`);
  if (!Array.isArray(p)) throw new Error(`pin missing: nk_pin.${name}`);
  return p as [number, number];
};
export const sourceOf = (table: string): string => {
  const s = meta(`meta.nk_sources.${table}`);
  if (typeof s !== "string") throw new Error(`source missing: nk_sources.${table}`);
  return s;
};

// The price-line spec, shared by both looks.
export type PriceMark = NumIn & {at: "max" | "min" | "last" | string; caption?: string; side?: "above" | "below" | "left"; color?: string; dx?: number; dy?: number};
export type PriceLineSpec = {
  series: string;                          // meta.nk_series key
  y0: number; y1: number; ystep: number;   // axis range in rupees
  drawKey?: string;                        // the line is fully drawn at at(drawKey); default 60% of the scene
  drawn?: boolean;                         // start fully drawn (a continuation scene)
  band?: {value: "max"; key: string; label?: string};   // shade the run of days at the series' maximum
  marks: PriceMark[];
  title?: string;
  source: string;                          // figures.json meta.nk_sources key
  actor?: {who: string; x: number; y: number; h: number; pose?: string; flip?: boolean};
  camera?: {fx: number; fy: number; s0: number; s1: number}; notes?: string;
};

export type ShareItem = NumIn & {state: string; color?: string; caption?: string; bx: number; by: number};
export type ShareMapSpec = {
  states: ShareItem[];                     // states lit, each with its share badge (badge centre bx, by in screen px)
  lit?: {state: string; key?: string; color?: string}[];   // states lit with no number
  pin?: {name: string; key: string; label: string};
  zoom?: {u: number; v: number; s: number};               // eases into this map point (geo units) and scale over the scene
  title?: string; source: string;
  camera?: {fx: number; fy: number; s0: number; s1: number}; notes?: string;
};

export type DocSpec = {
  org: string; doc: string;                // header lines on the drawn page
  quote: string; quoteKey: string;         // the highlighted line, swept at at(quoteKey)
  credit: string; creditKey?: string;      // who the quote comes from (here: a law firm's summary)
  label: string;                           // on-screen honesty label: this page is a drawing
  actor?: {who: string; x: number; y: number; h: number; pose?: string; flip?: boolean};
  camera?: {fx: number; fy: number; s0: number; s1: number}; notes?: string;
};
