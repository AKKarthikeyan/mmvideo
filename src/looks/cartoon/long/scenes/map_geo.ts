// MAP scene (long-form cartoon): geometry, layout constants, colour classes and the per-state model.
// Every value comes from fig() (figures.json); a state with no figure throws, except the states the spec lists in `missing`
// (default Manipur: not in the NFHS-6 release), which are hatched and given a note instead.
import geo from "../../../../../public/datayt/india/geo.json";
import {C} from "../../palette";
import {fig, hasFig, meta} from "../figs";

export type Survey = "nfhs4" | "nfhs5" | "nfhs6";
export type LabelItem = string | {state: string; key?: string};
export type MapSpec = {
  mode?: "scale" | "threshold" | "risers";          // default "scale"
  s?: Survey;                                        // survey that colours the map; default "nfhs6" (risers always compare from -> to)
  from?: Survey; to?: Survey;                        // risers only: default "nfhs5" -> "nfhs6"
  title?: string;                                    // legend card heading; default "Children per woman"
  fillKey?: string;                                  // staggered fill wave starts at at(fillKey); default frame 14
  waveFrames?: number;                               // length of the whole fill wave in frames; default 41
  legendKey?: string;                                // legend card + its numbers (2.1, riseMin) appear at at(legendKey); default: fill start, with no digits
  highlight?: "above" | "below" | "at" | "risers" | string[];   // these states lift off the map, the rest dim
  highlightKey?: string;                             // default: end of the fill wave
  labelStates?: LabelItem[];                         // label chips; an item is a state name or {state, key}
  labelKey?: string;                                 // reveal key for every chip without its own key (required then)
  labelFmt?: "value" | "change";                     // chip value: this survey's value, or "from -> to"; default "change" in risers mode, else "value"
  lists?: {key?: string; lowKey?: string; highKey?: string; show?: "both" | "low" | "high"; lowN?: number; highN?: number; low?: string[]; high?: string[]};
  riseMin?: number;                                  // risers: smallest rise that pulses; default 0.3
  riseExclude?: string[];                            // risers: states never pulsed (e.g. very small samples)
  riserKey?: string;                                 // risers: when the pulses start; default just after the fill wave
  missing?: string[];                                // states allowed to have no figure; default ["Manipur"]
  noteKey?: string;                                  // when the "not in release" note appears; default end of the fill wave
  push?: boolean;                                    // slow camera push-in; default true
  legend?: boolean;                                  // legend card; default true
  chipAt?: Record<string, [number, number]>;         // manual chip centre as an offset from the state's pin, in px (overrides the automatic placement)
};

export const SURVEY: Record<Survey, {label: string; years: string}> = {
  nfhs6: {label: "NFHS-6", years: "2023-24"}, nfhs5: {label: "NFHS-5", years: "2019-21"}, nfhs4: {label: "NFHS-4", years: "2015-16"},
};

// Replacement-level fertility. A definition, not a survey figure; figures.json may carry it as meta.replacement, which wins.
export const REPL: number = (() => { const m = meta("meta.replacement"); return typeof m === "number" ? m : 2.1; })();
export const tenths = (v: number) => Math.round(v * 10);

// ---- layout (1920 x 1080) -------------------------------------------------------------------------------------------
type G = {name: string; d: string; lx: number; ly: number; r: number; bbox: number[]};
export const GEO = geo.states as G[];
export const GEO_BY = Object.fromEntries(GEO.map((g) => [g.name, g])) as Record<string, G>;
export const MAP = {s: 0.8, x: 532, y: 62};                       // unit -> screen: X = x + u*s, Y = y + v*s
export const px = (u: number) => MAP.x + u * MAP.s;
export const py = (v: number) => MAP.y + v * MAP.s;

// ---- names ----------------------------------------------------------------------------------------------------------
export const SHORT: Record<string, string> = {
  "Jammu and Kashmir": "J&K", "NCT of Delhi": "Delhi", "Andaman and Nicobar Islands": "Andaman & Nicobar",
  "Dadra & Nagar Haveli and Daman & Diu": "Dadra & Daman", "Himachal Pradesh": "Himachal", "Arunachal Pradesh": "Arunachal",
};
export const shortName = (s: string) => SHORT[s] ?? s;
// Chips are narrower still.
export const CHIP_NAME: Record<string, string> = {...SHORT};
export const chipName = (s: string) => CHIP_NAME[s] ?? s;

// States and UTs too small to read at map scale get a ring marker on top.
export const SMALL = new Set(["Chandigarh", "NCT of Delhi", "Goa", "Puducherry", "Dadra & Nagar Haveli and Daman & Diu", "Lakshadweep", "Andaman and Nicobar Islands"]);

// ---- colour classes -------------------------------------------------------------------------------------------------
export const PALE = "#FFFFFF";            // unfilled state
export const PALE_FOCUS = "#DCE8F5";      // dimmed state
export const NEUTRAL = "#DDEAF6";         // risers mode: state that did not rise
export const COOL = C.blue, WARM = C.orange;
// 7 flat classes, cool (fewer children) to warm (more); the middle one is replacement level itself.
export const SCALE: {fill: string; ink: string}[] = [
  {fill: C.blueDark, ink: C.royalDark}, {fill: C.blue, ink: C.blueDark}, {fill: "#6FA3EE", ink: C.blueDark}, {fill: "#A9CCF6", ink: C.blueDark},
  {fill: C.yellow, ink: "#8A6500"}, {fill: C.orange, ink: C.orangeDark}, {fill: C.red, ink: C.redDark},
];
export const binOf = (v: number) => {
  const t = tenths(v), r = tenths(REPL);
  if (t > r) return t >= r + 4 ? 6 : 5;     // 0.4 or more above replacement
  if (t === r) return 4;
  if (t >= r - 3) return 3;                 // 1.8 .. 2.0
  if (t >= r - 5) return 2;                 // 1.6 .. 1.7
  if (t >= r - 8) return 1;                 // 1.3 .. 1.5
  return 0;                                  // 1.2 and below
};

export const mix = (a: string, b: string, p: number) => {
  const h = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16);
  return "#" + [0, 1, 2].map((i) => Math.round(h(a, i) + (h(b, i) - h(a, i)) * Math.min(1, Math.max(0, p))).toString(16).padStart(2, "0")).join("");
};

// ---- per-state model ------------------------------------------------------------------------------------------------
export type St = {name: string; g: G; v: number | null; from: number | null; to: number | null; missing: boolean; bin: number; above: boolean; at: boolean; below: boolean;
  riser: boolean; delta10: number; wave: number};
export type Model = {mode: "scale" | "threshold" | "risers"; s: Survey; from: Survey; to: Survey; riseMin: number; sts: St[]; by: Record<string, St>; have: St[]};

export const buildModel = (spec: MapSpec): Model => {
  const mode = spec.mode ?? "scale", s = spec.s ?? "nfhs6", from = spec.from ?? "nfhs5", to = spec.to ?? "nfhs6", riseMin = spec.riseMin ?? 0.3;
  const okMissing = new Set(spec.missing ?? ["Manipur"]), excl = new Set(spec.riseExclude ?? []);
  // wave order: a diagonal sweep from the north-west corner to the south-east
  const order = [...GEO].sort((a, b) => a.lx * 0.55 + a.ly * 0.45 - (b.lx * 0.55 + b.ly * 0.45)).map((g) => g.name);
  const sts: St[] = GEO.map((g) => {
    const need = mode === "risers" ? [from, to] : [s];
    const absent = need.some((k) => !hasFig({t: "tfr", state: g.name, s: k}));
    if (absent && !okMissing.has(g.name)) need.forEach((k) => fig({t: "tfr", state: g.name, s: k}));      // throws: figure missing
    const wave = order.indexOf(g.name);
    if (absent) return {name: g.name, g, v: null, from: null, to: null, missing: true, bin: -1, above: false, at: false, below: false, riser: false, delta10: 0, wave};
    const v = mode === "risers" ? fig({t: "tfr", state: g.name, s: to}).value : fig({t: "tfr", state: g.name, s}).value;
    const a = mode === "risers" ? fig({t: "tfr", state: g.name, s: from}).value : null;
    const delta10 = a === null ? 0 : tenths(v) - tenths(a);
    return {name: g.name, g, v, from: a, to: mode === "risers" ? v : null, missing: false, bin: binOf(v), above: tenths(v) > tenths(REPL), at: tenths(v) === tenths(REPL),
      below: tenths(v) < tenths(REPL), riser: mode === "risers" && delta10 >= tenths(riseMin) && !excl.has(g.name), delta10, wave};
  });
  return {mode, s, from, to, riseMin, sts, by: Object.fromEntries(sts.map((x) => [x.name, x])), have: sts.filter((x) => !x.missing)};
};

export const fmt = (v: number) => v.toFixed(1);
export const valueFor = (m: Model, name: string): number => {
  const st = m.by[name];
  if (!st) throw new Error(`map: unknown state "${name}"`);
  if (st.v === null) throw new Error(`map: "${name}" has no figure to print`);
  return st.v;
};

// Fill colour a state ends on, per mode.
export const targetFill = (m: Model, st: St): string => {
  if (st.missing) return PALE;
  if (m.mode === "risers") return st.riser ? WARM : NEUTRAL;
  if (m.mode === "threshold") return st.above ? WARM : COOL;
  return SCALE[st.bin].fill;
};
export const darkOf = (m: Model, st: St): string => {
  if (m.mode === "risers") return st.riser ? C.orangeDark : C.royalDark;
  if (m.mode === "threshold") return st.above ? C.orangeDark : C.blueDark;
  return st.bin < 0 ? C.ink : SCALE[st.bin].ink;
};

// Islands and enclaves: a thinner silhouette so the ink does not swallow them.
export const TINY_ISLANDS = new Set(["Andaman and Nicobar Islands", "Lakshadweep"]);
