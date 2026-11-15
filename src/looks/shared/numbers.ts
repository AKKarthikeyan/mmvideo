// Printed numbers, parsed without reformatting. The same token rules as scripts/datayt/word_times.py (NUM_RE), so a
// number found here joins its measured lock frame by its exact text.
import type {NumParse} from "./types";

const SCALES: [RegExp, number][] = [[/lakh\s*crore|lakh\s*cr\b/i, 1e12], [/\bcrore\b|\bcr\b/i, 1e7], [/\blakh\b/i, 1e5], [/\bthousand\b/i, 1e3], [/\bmillion\b/i, 1e6], [/\bbillion\b/i, 1e9]];

const grouping = (digits: string): NumParse["grouping"] => {
  const g = digits.split(".")[0].split(",");
  if (g.length === 1) return "none";
  if (g.slice(1, -1).some((x) => x.length === 2)) return "lakh";
  if (g.length === 2) return "thousands";
  return "western";
};

// One printed token ("over 25×", "₹1.13 lakh cr", "−0.63%"). Returns null when it holds no digit.
export const parseNumber = (token: string): NumParse | null => {
  const m = /^(.*?)([+\-−]?)([₹$€£]?)(\d[\d,]*(?:\.\d+)?)(.*)$/su.exec(token);
  if (!m) return null;
  const [, qual, sign, prefix, rawDigits, rest] = m;
  const digits = rawDigits.replace(/[,.]$/, "");
  const unit = rawDigits.slice(digits.length) + rest;
  const v = parseFloat(digits.replace(/,/g, ""));
  const scale = SCALES.find(([re]) => re.test(unit))?.[1] ?? 1;
  return {text: token, qual, sign: sign as NumParse["sign"], prefix, digits, unit, value: sign === "−" || sign === "-" ? -v : v, scale,
    grouping: grouping(digits), decimals: (digits.split(".")[1] ?? "").length, glyphs: [...digits]};
};

// Every printed number inside running text, with the unit words a money card uses. Same pattern as word_times.py.
const NUM_RE = /([+\-−]?)(₹?)(\d[\d,]*(?:\.\d+)?)(\s?(?:lakh crore|lakh cr|crore|cr|lakh|thousand|million|billion)\b|%|×|\s?t\b|\s?years?\b|\s?ml\b)?/gu;
export const findNumbers = (text?: string | null): NumParse[] => {
  const out: NumParse[] = [];
  for (const m of (text ?? "").replace(/\*/g, "").matchAll(NUM_RE)) {
    const t = m[0].replace(/[,. ]+$/, "");
    const p = parseNumber(t);
    if (p) out.push(p);
  }
  return out;
};

// The *starred* segments of hook/say lines, in order (the stars are the script's emphasis marks).
export const starred = (lines?: string[]) => (lines ?? []).flatMap((l) => [...l.matchAll(/\*([^*]+)\*/g)].map((m) => m[1]));

// The first starred segment holding a digit: the hero token of a hook or say beat.
export const heroToken = (lines?: string[]) => starred(lines).find((s) => /\d/.test(s)) ?? null;
