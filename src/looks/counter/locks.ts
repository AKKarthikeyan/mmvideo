// Counter's lock helpers, on top of the foundation's lock frames (shared/lock.ts):
//  - a "said-earlier" number is honoured only when an earlier beat printed the same value in the same unit and it was
//    said there (word_times matched fm03's "−2%" to the hook's "top-two"); otherwise it waits for its own beat's lock;
//  - a name that holds a year or another digit ("2017", "Jan-Sep 2024") waits for the narrator's own word for it in this
//    beat (the measured year words of word_times.json), else for the lock of the value it names;
//  - a kicker shows from the beat start; only its value-like parts ("₹10") wait for the lock, dates ("30 SEP 2026",
//    "END-MARCH 2026") are datelines and show at once.
// And the printed qualifiers of the source tables ("almost 15%", "roughly 7%"), baked by bake_printed.py.
import {findNumbers, parseNumber} from "../shared/numbers";
import {WORD_TIMES} from "../shared/registry";
import type {LookBeat, LookData, LookNum, NumParse} from "../shared/types";
import PRINTED from "../../../public/looks/counter/printed.json";

const unitKey = (u: string) => {
  const s = u.trim().toLowerCase();
  if (/^lakh\s*(crore|cr)\b/.test(s)) return "lakhcr";
  if (/^(crore|cr)\b/.test(s)) return "cr";
  if (/^tonnes?$/.test(s)) return "t";
  return s;
};
const clsOf = (n: Pick<NumParse, "prefix" | "unit">) => `${n.prefix}|${unitKey(n.unit)}`;
const near = (a: number, b: number) => Math.abs(a - b) <= Math.max(1e-9, Math.abs(b) * 0.005);

const numsOf = (b: LookBeat): LookNum[] => [b.big, b.hero, ...b.tokens.map((t) => t.num), ...b.lineNums, ...b.barsL.map((r) => r.num), ...b.textNums, ...b.qNums]
  .filter((n): n is LookNum => !!n);

export const lockOf = (L: LookData, b: LookBeat, n: LookNum): number => {
  if (n.lockHow !== "said-earlier") return n.lockF;
  const ok = L.beats.slice(0, b.i).some((pb) => numsOf(pb).some((m) => near(Math.abs(m.value), Math.abs(n.value)) &&
    (clsOf(m) === clsOf(n) || (unitKey(m.unit) === unitKey(n.unit) && unitKey(n.unit) === "%")) && m.lockHow !== "not-spoken"));
  return ok ? n.lockF : Math.max(n.lockF, b.lockF);
};
// The number with its safe lock (a new object only when the lock moves later).
export const safe = (L: LookData, b: LookBeat, n: LookNum | null): LookNum | null => {
  if (!n) return n;
  const f = lockOf(L, b, n);
  return f === n.lockF ? n : {...n, lockF: f};
};

// Year words measured in a beat's own narration line: value -> lock frame.
const yearsSaid = (L: LookData, b: LookBeat): Map<number, number> => {
  const out = new Map<number, number>();
  const W = L.timing === "measured" ? WORD_TIMES[L.id] : undefined;
  const wb = W?.beats[b.i];
  if (!W || !wb || wb.line == null) return out;
  for (const n of W.lines[wb.line]?.numbers ?? []) if (n.kind === "year" && !out.has(n.value)) out.set(n.value, n.f);
  for (const n of wb.numbers) if (n.how === "spoken" && /^(19|20)\d\d$/.test(n.text) && !out.has(+n.text)) out.set(+n.text, n.lockF);
  return out;
};

// When a name may show: at once with no digit; a name with years waits for the last of its years the narrator says in
// this beat (else for `valueLock`, the lock of the value it names, or the beat's lock).
export const nameLock = (L: LookData, b: LookBeat, name: string, valueLock?: number): number => {
  if (!/\d/.test(name)) return -Infinity;
  const said = yearsSaid(L, b);
  const ys = [...name.matchAll(/(19|20)\d\d/g)].map((m) => +m[0]);
  const fallback = valueLock ?? b.lockF;
  if (!ys.length) return fallback;
  let f = -Infinity;
  for (const y of ys) f = Math.max(f, said.get(y) ?? fallback);
  return f;
};

// Dates are metadata, not data: a 4-digit year, or a day next to a month name ("18 OCT", "30 Sep 2026").
const MONTH = "(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*";
const isDateAt = (s: string, i: number, len: number) => {
  const t = s.slice(i, i + len);
  if (/^(19|20)\d\d$/.test(t)) return true;
  if (/^\d{1,2}$/.test(t)) {
    const after = s.slice(i + len, i + len + 5), before = s.slice(Math.max(0, i - 5), i);
    if (new RegExp(`^\\s${MONTH}`, "i").test(after) || new RegExp(`${MONTH}\\s$`, "i").test(before)) return true;
  }
  return /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(t);
};
// The kicker cut into segments: plain text, or a value-like number (gated by `lockF`).
export type Seg = {t: string; gate: number};
export const kickerSegs = (L: LookData, b: LookBeat, text: string): Seg[] => {
  const out: Seg[] = [];
  let from = 0;
  const re = /[₹+−-]?\d[\d,]*(?:\.\d+)?(?:\s?(?:%|×|lakh cr|lakh crore|crore|cr|t)\b|%|×)?/g;
  for (const m of text.matchAll(re)) {
    const i = m.index ?? 0;
    const digits = /\d[\d,./]*/.exec(m[0])!;
    if (isDateAt(text, i + digits.index, digits[0].length) && !/[₹%×]/.test(m[0])) continue;
    if (i > from) out.push({t: text.slice(from, i), gate: -Infinity});
    const p = parseNumber(m[0].trim());
    const hit = p ? numsOf(b).find((n) => near(Math.abs(n.value), Math.abs(p.value)) && n.prefix === p.prefix) : null;
    out.push({t: m[0], gate: hit ? lockOf(L, b, hit) : b.lockF});
    from = i + m[0].length;
  }
  if (from < text.length) out.push({t: text.slice(from), gate: -Infinity});
  return out;
};
export const hasValueDigit = (L: LookData, b: LookBeat, text: string) => kickerSegs(L, b, text).some((s) => s.gate > -Infinity);
void findNumbers;

// ---------------------------------------------------------------- printed qualifiers (source tables)
type Printed = Record<string, Record<string, Record<string, string>>>;      // id -> beat name -> (big | bar name) -> "almost 15%"
const P = PRINTED as unknown as Printed;
// The qualifier the source table prints for a value ("almost", "roughly"), or "" (checked: the printed form ends with it).
export const qualOf = (L: LookData, beatName: string | null | undefined, key: string, n: LookNum | null): string => {
  if (!n || !beatName) return "";
  const s = P[L.id]?.[beatName]?.[key];
  if (!s) return "";
  if (!s.endsWith(n.text.replace(/^[+−-]/, ""))) throw new Error(`${L.id} ${beatName}: printed "${s}" does not end with "${n.text}"`);
  return s.slice(0, s.length - n.text.replace(/^[+−-]/, "").length).trim();
};
// Every fact beat's qualifier for a value, looked up by its printed text (big or bar).
export const qualFor = (L: LookData, n: LookNum | null): string => {
  if (!n) return "";
  for (const b of L.beats) {
    if (b.kind !== "fact") continue;
    if (b.big && b.big.text === n.text) { const q = qualOf(L, b.name, "big", b.big); if (q) return q; }
    for (const r of b.barsL) if (r.num && r.num.text === n.text) { const q = qualOf(L, b.name, r.name, r.num); if (q) return q; }
  }
  return "";
};
