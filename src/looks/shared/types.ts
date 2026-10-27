// The data contract between a built beat Short (public/datayt/beats/<id>/data.json, typed as BeatData) and the looks.
// useLookData() turns a BeatData into a LookData. Every printed string is kept exactly as data.json has it; the look
// fields are additions (parsed numbers, lock frames, per-beat source, the brand and look ids, a seed, an optional plate).
// See docs/datakadai/looks/FOUNDATION.md.
import type {Beat, BeatData} from "../../datayt/BeatStory";
import type {BrandId, LookId} from "../brands/types";

// A number as printed. Nothing here is reformatted: text = qual + sign + prefix + digits + unit, character for character
// (qual keeps its trailing space).
export type NumParse = {
  text: string;              // the printed token: "₹1.13 lakh cr", "over 25×", "−0.63%", "9 of 11", "25,000 t"
  qual: string;              // words or marks before the number in the token: "over ", "about ", "~"; "" if none
  sign: "" | "+" | "−" | "-";  // the printed sign character (U+2212 for minus, as data.json prints it)
  prefix: string;            // a symbol between the sign and the digits: "₹"
  digits: string;            // the numeral with its printed grouping: "25,000", "2,00,000", "0.63", "880.52"
  unit: string;              // everything after the numeral, as printed: " t", "%", "×", " lakh cr", " of 11", " years"
  value: number;             // the numeral with its sign (−0.63); the unit's scale is not applied
  scale: number;             // 1e12 lakh crore, 1e7 crore/cr, 1e5 lakh, 1e3 thousand, else 1
  grouping: "none" | "thousands" | "lakh" | "western";   // 25,000 = "thousands" (same in both systems); 2,00,000 = "lakh"
  decimals: number;
  glyphs: string[];          // the numeral's characters in order (digits and separators), for boards and reels
};

export type LockHow = "spoken" | "said-earlier" | "not-spoken" | "first-number" | "no-number" | "no-voice" | "no-timing";
export type NumRole = "big" | "hero" | "bar" | "line" | "text" | "q";

// A printed number with the frame it may first be drawn on: never before the narrator says it.
export type LookNum = NumParse & {role: NumRole; lockF: number; spokenF: number | null; lockHow: LockHow};

export type LookBar = {name: string; label: string; frac: number; neg?: boolean; num: LookNum | null};
export type LookToken = {text: string; num: LookNum | null};      // one *starred* segment of a hook/say line

export type LookVoice = {file: string; at: number; sec: number; text: string; f0: number; f1: number};
export type LookWord = {w: string; start: number; end: number};  // absolute seconds in the Short

export type LookBeat = Beat & {
  i: number;
  f0: number; f1: number;    // first frame of the beat and the first frame after it (Math.round(t * 30), as BeatStory)
  settleF: number;           // round((t1 - 0.4) * 30): the beat must be still from here (scene_frames.py stills)
  lockF: number;             // the frame the beat's number may land on (see LockHow and word_times.py)
  lockHow: LockHow;
  lockWord: string | null;   // the spoken words it locks on ("twenty five thousand")
  late: boolean;             // lockF falls in the beat's last 12 frames: the look must still land it, but has no settle time
  hero: LookNum | null;      // fact: its 'big'; spot/say: the first starred number of its lines
  big: LookNum | null;       // fact 'big' (null for other kinds)
  tokens: LookToken[];       // starred segments of lines, in order
  lineNums: LookNum[];       // printed numbers in lines that are not the hero
  barsL: LookBar[];          // 'bars' with parsed labels ('bars' itself is untouched)
  textNums: LookNum[];       // numbers printed in 'text'
  qNums: LookNum[];          // numbers printed in the closing question
  src: string;               // the per-beat short source line a look prints
  subShown: string;          // the 'sub' a look prints (look_opts.beatSubs can relabel it; 'sub' itself is untouched)
  voice: LookVoice | null;   // the narration line of this beat
  words: LookWord[];         // its words with measured times (empty without timing)
};

export type LookOpts = {
  sourceLabel?: string;               // the exact label for an estimate whose primary source is unconfirmed (gd01: "WGC estimate, as reported")
  sourceLabelMatch?: string;          // regex: any source text matching it must contain sourceLabel (checked, throws)
  sourceShort?: string;               // replaces data.json sourceShort in looks
  beatSources?: Record<string, string>;   // per-beat source line, keyed by beat name (facts) or kind (spot, say, end, map, mapend)
  beatSubs?: Record<string, string>;      // per-beat replacement for 'sub', same keys
  sourceLines?: string[];             // the full sources for the end card; else data.json 'source'
  plate?: string | false;             // a textless plate under public/ (false: none). Default: datayt/covers/<id>-gemini.png if present
  [k: string]: unknown;               // anything else a look reads (variant, surface, lead, unit_object...)
};

export type LookData = {
  D: BeatData;               // the original, untouched
  id: string; type: string;
  look: LookId; brand: BrandId; lookOpts: LookOpts;
  seed: number;              // stable hash of the id, 1 or more (for rough-notation and seeded variants)
  plate: string | null;      // path under public/ for staticFile(), or null: every look must work without one
  fps: number; frames: number; total: number;
  barF: number; beatF: number;   // frames per bar (58.06 at 124 BPM) and per beat
  textLed: boolean;          // vo is empty: the text-led cut (decks and subs shown)
  chip: string; sourceShort: string; sourceLines: string[]; sourceLabel: string | null;
  beats: LookBeat[];
  timing: "measured" | "none"; timingMethod: string;
  accent: string; accent2: string; bands: string[];   // the story's own colours from data.json (the closing map)
};

// public/datayt/beats/<id>/word_times.json (scripts/datayt/word_times.py)
export type WordTimes = {
  id: string; fps: number; made: string; method: string;
  lines: {file: string; at: number; sec: number; text: string; method: string;
    words: {w: string; norm: string; word: number; start: number; end: number; guessed?: boolean}[];
    // onset: measured on the audio (line-local s) by the rule for the number's first sound; at: rendered time of the onset;
    // f: the lock frame, 10 ms (after a stop burst) or 25 ms after the onset, rounded up to a whole frame
    numbers: {text: string; value: number; kind: string; whisper: number; onset: number; rule: "fric" | "stop" | "weak" | "vowel";
      how: string; at: number; f: number}[]}[];
  beats: {i: number; kind: string; f0: number; f1: number; settleF: number; line: number | null; lockF: number; lockHow: LockHow;
    lockWord: string | null; firstNumF: number | null; late: boolean;
    numbers: {role: NumRole; text: string; spokenF: number | null; word?: string; how: LockHow; lockF: number}[]}[];
};

// What every look component receives (src/looks/LookStory.tsx): the story as LookData and the brand resolved for the look.
export type LookProps = {L: LookData; B: import("../brands/types").LookBrand};
