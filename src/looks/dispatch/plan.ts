// Kadai Dispatch: what each beat draws, decided from the story's own data (LookData) and nothing else. Pure functions, no
// React. Every value a device draws is one printed in data.json (a fact's big, a bar label, a range printed in the sub, a
// hook or say token); every name is one printed there (a bar name, a kicker, a deck). Scales are shared per unit class and
// only grow as the story goes (the running maximum), so a bar never stands for a value the viewer has not been shown and
// every frame is internally to scale.
//
// Colour is an encoding: each thing a Short measures (an entity: "Indian homes", "RBI", "Sugar") keeps ONE colour for the
// whole Short (series roles accent, ink, accent2 in order of first appearance; a fourth thing gets a colour no thing on
// its pages already has, else neutral hatch), and a fold band is the colour of the thing its page is about.
//
// Layouts rotate per story (seeded by id) so two Shorts do not open or read alike: the front page is a BANNER, a FOOT band
// or a PLAIN newsprint page; a fact is a FOLD (band on top), a FOOT (band at the bottom) or a BOX (a ruled chart box); the
// takeaway sets its proof below or above its headline; the letters page is a band, a full colour page or a foot band.
import type {LookBeat, LookData, LookNum, NumParse} from "../shared/types";
import {findNumbers, parseNumber} from "../shared/numbers";
import {plain} from "../shared/text";
import {seedOf} from "../shared/useLookData";
import {quoteCredit, type Quote} from "./quotes";

// ---------- numbers ----------
export const unitKey = (u: string) => {
  const s = u.trim().toLowerCase();
  if (/^lakh\s*(crore|cr)\b/.test(s)) return "lakhcr";
  if (/^(crore|cr)\b/.test(s)) return "cr";
  if (/^lakh\b/.test(s)) return "lakh";
  if (/^t$/.test(s)) return "t";
  if (/^years?$/.test(s)) return "years";
  if (/^of \d/.test(s)) return "of";
  return s;
};
export const clsOf = (n: Pick<NumParse, "prefix" | "unit">) => `${n.prefix}|${unitKey(n.unit)}`;
const near = (a: number, b: number) => Math.abs(a - b) <= Math.max(1e-9, Math.abs(b) * 0.005);
const isPct = (n: NumParse) => unitKey(n.unit) === "%";

// A number printed in a string the foundation does not parse (kicker, sub, quote): it may be drawn from `lockF`.
export type FreeNum = NumParse & {lockF: number};

// Dates are metadata, not data: a 4-digit year, or a day next to a month name ("18 OCT", "30 Sep 2026", "07/10/2026").
const MONTH = "(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*";
export const isDateAt = (s: string, i: number, len: number) => {
  const t = s.slice(i, i + len);
  if (/^(19|20)\d\d$/.test(t)) return true;
  if (/^\d{1,2}$/.test(t)) {
    const after = s.slice(i + len, i + len + 5), before = s.slice(Math.max(0, i - 5), i);
    if (new RegExp(`^\\s${MONTH}`, "i").test(after) || new RegExp(`${MONTH}\\s$`, "i").test(before)) return true;
  }
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(t)) return true;
  return false;
};

// ---------- the lock, made safe ----------
// Every printed number of a beat, with its lock frame.
const numsOf = (b: LookBeat): LookNum[] => [b.big, b.hero, ...b.tokens.map((t) => t.num), ...b.lineNums, ...b.barsL.map((r) => r.num), ...b.textNums, ...b.qNums]
  .filter((n): n is LookNum => !!n);
// A "said-earlier" number is honoured only when an earlier beat printed the same value in the same unit and the narrator
// said it (or it was itself honestly said earlier). Otherwise (word_times matched "top-two" to "−2%") the number waits
// for its own beat's lock, as a number that is never spoken does.
export const lockOfNum = (L: LookData, b: LookBeat, n: LookNum): number => {
  if (n.lockHow !== "said-earlier") return n.lockF;
  const ok = L.beats.slice(0, b.i).some((pb) => numsOf(pb).some((m) => near(Math.abs(m.value), Math.abs(n.value)) && clsOf(m) === clsOf(n) && m.lockHow !== "not-spoken"));
  return ok ? n.lockF : Math.max(n.lockF, b.lockF);
};
// Value-like numbers a name or kicker may print (not years or dates), with their lock frames: "200 ml" in "200 ml of
// Campa" waits for its lock like the deck's own "200 ml".
export type Gate = {text: string; lockF: number};
const valueLike = (n: NumParse) => !!(n.prefix || n.unit.trim() || n.sign || n.decimals > 0 || n.grouping !== "none") && !/^(19|20)\d\d$/.test(n.digits);
export const gatesOf = (L: LookData, b: LookBeat): Gate[] => numsOf(b).filter(valueLike).map((n) => ({text: n.text, lockF: lockOfNum(L, b, n)}));

// Number words ("three", "over thirteen times") are figures too: each waits for the narrator's word in this beat's line
// (its measured start), else the beat's lock. Keys are lower-case words.
export const NUM_WORDS: Record<string, number> = {two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
  thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000, twice: 2, thrice: 3};
export type WordLock = (word: string) => number;
export const wordLocksOf = (L: LookData, b: LookBeat): WordLock => {
  const out: Record<string, number> = {};
  for (const w of b.words) {
    for (const part of w.w.toLowerCase().split(/[^a-z]+/)) {
      if (NUM_WORDS[part] !== undefined && out[part] === undefined) out[part] = Math.ceil(w.start * L.fps) + 1;
    }
  }
  return (word: string) => out[word.toLowerCase()] ?? b.lockF;
};

// ---------- items: every printed value of the story's fact beats ----------
export type Item = {
  key: string; v: number; cls: string; text: string;      // text: exactly as printed (a bar label or a big)
  name: string; beat: number; kind: "big" | "bar"; lockF: number; num: LookNum | null;
  head?: string;                                          // the kicker of a bar that is its beat's own big: its name in later beats
  ent: string;                                            // the thing it measures (an entity key, see entKey)
};
export type Range = {lo: FreeNum; hi: FreeNum; of: number};      // an estimate range printed in a fact's sub

export const kickerHead = (b: LookBeat) => (b.kicker ?? "").split(" · ")[0].trim();
// The thing a price is for, from the deck: "for 200 ml of Campa, back since March 2023" -> "200 ml of Campa".
export const deckItem = (b: LookBeat) => plain(b.text ?? "").split(/[,:;]/)[0].replace(/^(for|of|in|on)\s+/i, "").trim();
const isPrice = (n: NumParse) => n.prefix === "₹" && n.unit.trim() === "" && Math.abs(n.value) < 1000;

const toks = (s: string) => plain(s).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
// An entity key: the name's words compared on their first five letters ("INDIAN HOMES" = "Indian homes", "Clothes" =
// "Clothing"), every word counted, so "Coconut" is not "Coconut oil" and "DHANTERAS 2024" is not "DHANTERAS 2023".
export const entKey = (s: string) => toks(s).filter((w) => w !== "the").map((w) => w.slice(0, 5)).join(" ");
const words = (s: string) => toks(s).filter((w) => w.length >= 4);
// A starred word names an item when it has the same words (see entKey).
const nameHit = (want: string[], name: string) => want.some((w) => entKey(w) !== "" && entKey(w) === entKey(name));
// How much of a name is in a text (0..1), on 4-letter stems: "Indian homes" in "Indian homes hold over 25 times the RBI's
// gold" = 1, "AIR FARES" in "the air fare rise" = 1.
const nameIn = (name: string, text: string) => {
  const n = toks(name).filter((w) => w.length >= 3 && w !== "the" && w !== "and"), t = new Set(toks(text).map((w) => w.slice(0, 4)));
  return n.length ? n.filter((w) => t.has(w.slice(0, 4))).length / n.length : 0;
};
// Words shared by two names that say they are the same kind of thing ("Campa" in "200 ml of Campa" and "CAMPA + LAHORI
// ZEERA"): letters only, four or more, not a generic word.
const GENERIC = new Set(["from", "your", "with", "into", "over", "under", "india", "indian", "other", "average", "total", "price", "prices", "share", "this", "that",
  "their", "year", "years", "month", "last", "first", "only", "more", "less", "made", "ready", "fresh", "all", "new", "and", "the", "account", "accounts", "day", "days"]);
const kin = (a: string, b: string) => {
  const ws = (s: string) => new Set(toks(s).filter((w) => /^[a-z]{4,}$/.test(w) && !GENERIC.has(w)).map((w) => w.slice(0, 5)));
  const A = ws(a), B = ws(b);
  return [...A].some((w) => B.has(w));
};

const rangeOf = (b: LookBeat): Range | null => {
  if (!b.big) return null;
  const s = b.subShown ?? "";
  const m = /(\d[\d,]*(?:\.\d+)?)\s+to\s+(\d[\d,]*(?:\.\d+)?)(\s?(?:t|crore|cr|lakh)\b|%)?/u.exec(s);
  if (!m) return null;
  const unit = m[3] ?? "";
  if (unitKey(unit) !== unitKey(b.big.unit)) return null;
  const lo = parseNumber(m[1]), hi = parseNumber(m[2] + unit);
  if (!lo || !hi || !(lo.value <= b.big.value && b.big.value <= hi.value)) return null;
  return {lo: {...lo, lockF: b.lockF}, hi: {...hi, lockF: b.lockF}, of: b.big.value};
};

// ---------- devices ----------
export type Role = "accent" | "ink" | "accent2";
export type Row = {name: string; v: number; text: string; num: LookNum | null; lockF: number; hot: boolean; ghost?: boolean; ent: string; role: Role | null;
  from: number; gates: Gate[]};
export type Device =
  | {kind: "tally"; k: number; N: number}
  | {kind: "duration"; years: number}
  | {kind: "ratio"; A: Row; B: Row; copies: number; scale: number; range: Range | null}
  | {kind: "diverge"; rows: Row[]; ghost: Row | null}
  | {kind: "periods"; rows: Row[]; scale: number; share: boolean}
  | {kind: "sum"; parts: Row[]; total: Row; line: Row | null; scale: number}
  | {kind: "rows"; rows: Row[]; scale: number; ghost: Row | null; refs: Row[]; range: Range | null}
  | {kind: "inset"; rows: Row[]; ghost: Row; scale: number}
  | {kind: "threshold"; at: Row; side: "above" | "below"}
  | {kind: "price"; rows: Row[]; hot: Row; old: FreeNum | null; oldRest: string};

export type Proof =
  | {kind: "tiles"; A: Row; B: Row; n: number; scale: number; lo: number | null; lockF: number}
  | {kind: "equal"; rows: Row[]; lockF: number}
  | {kind: "band"; rows: Row[]; edge: number; lockF: number; text: string}
  | {kind: "bars"; rows: Row[]; lockF: number}
  | {kind: "slip"; quotes: Quote[]};

export type Teaser =
  | {kind: "ratio"; A: Row; B: Row; copies: number; scale: number; lockF: number; range: Range | null}
  | {kind: "tally"; k: number; N: number; kF: number; NF: number}
  | {kind: "rows"; rows: Row[]; at: number[]}
  | {kind: "threshold"; at: Row; lockF: number}
  | {kind: "count"; n: number; lockF: number; names: string[]}
  | {kind: "index"; heads: {text: string; gates: Gate[]; lockF: number}[]};

export type FactLayout = "fold" | "foot" | "box" | "desk";
export type HookLayout = "banner" | "foot" | "plain";
export type SayLayout = "below" | "above";
export type EndLayout = "band" | "full" | "foot";

export type BeatPlan = {device: Device | null; range: Range | null; quote: Quote | null; credit: string; proof: Proof | null; teaser: Teaser | null;
  layout: FactLayout | HookLayout | SayLayout | EndLayout | "map"; band: Role; src: string; credits: string[]};
export type StoryPlan = {items: Item[]; beats: BeatPlan[]; lead: Role; roles: Record<string, Role | null>};

// A story-stable pick in [0, n): the same story always gets the same layouts, different stories spread across them.
export const pick = (L: LookData, salt: string, n: number) => seedOf(`${L.id}:${salt}`) % n;

const thresholdText = (b: LookBeat) => b.kind === "fact" && !!b.big && b.big.prefix === "₹" && /\b(above|below|or more|limit|under|exceeds?)\b/i.test(plain(b.text ?? ""));
const isPeriod = (s: string) => /\b(19|20)\d\d\b/.test(s) && /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(s);
const yearIn = (s: string) => { const m = /\b((?:19|20)\d\d)\b/.exec(s); return m ? parseInt(m[1], 10) : null; };

// Word numbers a say line may print ("over thirteen times"): the value only drives a proof drawn in shapes, never digits.
const timesClaim = (lines: string[]) => {
  const s = lines.map(plain).join(" ").toLowerCase();
  const m = /\b(about|over|almost|nearly|more than|under)?\s*(\w+)\s+times\b/.exec(s);
  if (!m || !NUM_WORDS[m[2]]) return null;
  return {v: NUM_WORDS[m[2]], qual: m[1] ?? ""};
};
const qualOk = (qual: string, r: number, v: number) => {
  const q = qual.trim().toLowerCase().replace(/^~$/, "about");
  if (/over|more than/.test(q)) return r >= v && r < v * 1.5;
  if (/almost|nearly|under/.test(q)) return r <= v && r > v * 0.8;
  return Math.abs(r - v) / v <= 0.15;
};

// How well a claim names an item: by its own name, or (for a beat's own figure) a starred phrase its kicker or deck prints
// ("rail fare" names the Train beat's +2.2%: "for rail fares, against Sep 2025").
type Aliased = Item & {alias: string};
const nameScore = (it: Aliased, want: string[], claim: string) => Math.max(nameHit(want, it.name) ? 1 : 0, nameIn(it.name, claim),
  want.some((w) => nameIn(w, it.alias) === 1) ? 1 : 0);
// A pair of the story's items whose ratio makes a printed "N×" (or "N times") claim true. The claim must name both
// things (their names are in its words, or a starred word is their name): a pair is never picked on unit and value alone.
const ratioPair = (items: Aliased[], v: number, qual: string, want: string[], claim: string) => {
  let best: {A: Item; B: Item; score: number} | null = null;
  for (const A of items) for (const B of items) {
    if (A === B || A.cls !== B.cls || A.v <= 0 || B.v <= 0 || A.v <= B.v || A.cls.endsWith("|×")) continue;
    const r = A.v / B.v;
    if (!qualOk(qual, r, v)) continue;
    const a = nameScore(A, want, claim), bb = nameScore(B, want, claim);
    if (a < 0.5 || bb < 0.5) continue;
    const score = (a + bb) * 10 - Math.abs(r - v) / v + (A.kind === "bar" ? 0.5 : 0) + (B.kind === "bar" ? 0.5 : 0);
    if (!best || score > best.score) best = {A, B, score};
  }
  return best;
};

export const planStory = (L: LookData, quotes: Quote[] = []): StoryPlan => {
  // 1. items, one per printed value of each fact (a big that repeats one of its own bars is that bar)
  const items: Item[] = [];
  const ranges: (Range | null)[] = L.beats.map((b) => b.kind === "fact" ? rangeOf(b) : null);
  const factDev = (b: LookBeat) => b.kind === "fact";
  L.beats.forEach((b, i) => {
    if (!factDev(b)) return;
    const bars = b.barsL.filter((r) => r.num);
    const periods = bars.length === 2 && bars.every((r) => isPeriod(r.name));
    for (const r of bars) {
      const n = r.num!;
      const own = b.big && near(n.value, b.big.value) && unitKey(b.big.unit).replace("lakhcr", "") === unitKey(n.unit).replace("lakhcr", "") ? kickerHead(b) : undefined;
      items.push({key: `${i}:bar:${r.name}`, v: n.value, cls: clsOf(n), text: r.label, name: r.name, beat: i, kind: "bar", lockF: lockOfNum(L, b, n), num: n, head: own,
        ent: entKey(periods ? kickerHead(b) : r.name)});
    }
    if (b.big && !bars.some((r) => near(r.num!.value, b.big!.value) && clsOf(r.num!) === clsOf(b.big!))) {
      const earlierBar = items.find((it) => it.kind === "bar" && it.cls === clsOf(b.big!) && near(it.v, b.big!.value));
      const name = isPrice(b.big) ? deckItem(b) : earlierBar?.name ?? kickerHead(b);
      items.push({key: `${i}:big`, v: b.big.value, cls: clsOf(b.big), text: b.big.text, name, beat: i, kind: "big", lockF: lockOfNum(L, b, b.big), num: b.big, ent: entKey(name)});
    }
  });
  const gates = L.beats.map((b) => gatesOf(L, b));
  const aliased: Aliased[] = items.map((it) => {
    const b = L.beats[it.beat];
    const own = it.kind === "big" || (b.big && near(it.v, b.big.value));
    return {...it, alias: own ? `${b.kicker ?? ""} ${plain(b.text ?? "")}` : ""};
  });
  const back = (a: Aliased): Item => items.find((it) => it.key === a.key)!;
  const rowOf = (it: Item, hot = false, ghost = false): Row => ({name: ghost && it.head ? it.head : it.name, v: it.v, text: it.text, num: it.num, lockF: it.lockF, hot, ghost,
    ent: it.ent, role: null, from: it.beat, gates: gates[it.beat]});
  const upTo = (i: number, cls: string) => items.filter((it) => it.beat <= i && it.cls === cls);
  const runMax = (i: number, cls: string, extra: number[] = []) => {
    const rs = ranges.slice(0, i + 1).filter((r): r is Range => !!r && clsOf(r.hi) === cls).map((r) => r.hi.value);
    return Math.max(1e-9, ...upTo(i, cls).map((it) => Math.abs(it.v)), ...rs, ...extra.map(Math.abs));
  };
  const earlierMax = (i: number, cls: string) => {
    const prev = items.filter((it) => it.beat < i && it.cls === cls);
    return prev.length ? prev.reduce((a, b) => Math.abs(b.v) > Math.abs(a.v) ? b : a) : null;
  };
  const rangeFor = (i: number, v: number, cls: string) => ranges.slice(0, i + 1).find((r) => r && clsOf(r.hi) === cls && near(r.of, v)) ?? null;
  // the words a beat is about (its kicker, deck, sub and narration): a reference line must be named in them
  const about = (b: LookBeat) => [b.kicker, b.text, b.subShown, b.voice?.text, ...b.barsL.map((r) => r.name)].filter(Boolean).join(" ");
  const used = new Set<number>();

  // 2. per beat
  const factDevice = (b: LookBeat, i: number): Device | null => {
    const big = b.big;
    if (!big) return null;
    const cls = clsOf(big);
    const bars = items.filter((it) => it.beat === i && it.kind === "bar");
    const hot = (it: Item) => near(it.v, big.value) && (it.cls === cls || it.cls.split("|")[0] === cls.split("|")[0]);
    const unit = unitKey(big.unit);
    if (unit === "of") { const N = parseInt(/of (\d+)/.exec(big.unit)![1], 10); return {kind: "tally", k: Math.round(big.value), N}; }
    if (unit === "years") return {kind: "duration", years: Math.round(big.value)};
    if (unit === "×" && bars.length >= 2) {
      const [A, B] = [...bars].sort((a, c) => c.v - a.v);
      const scale = runMax(i, A.cls);
      return {kind: "ratio", A: rowOf(A, true), B: rowOf(B), copies: Math.max(1, Math.floor(big.value + 1e-9)), scale, range: rangeFor(i, A.v, A.cls)};
    }
    if (bars.length >= 2) {
      const bcls = bars[0].cls;
      const hotIt = bars.find(hot) ?? bars[0];      // one focus per chart, even when two bars print the same value
      const rowsOf = () => bars.map((it) => rowOf(it, it === hotIt));
      if (bars.some((it) => it.v < 0) || big.value < 0) {
        const em = earlierMax(i, bcls);
        const mx = Math.max(...bars.map((it) => Math.abs(it.v)));
        const hotV = (bars.find(hot) ?? bars[0]).v;
        return {kind: "diverge", rows: rowsOf(), ghost: em && Math.abs(em.v) > mx * 1.6 && !bars.includes(em) && Math.sign(em.v) === Math.sign(hotV) ? rowOf(em, false, true) : null};
      }
      if (bars.length === 2 && bars.every((it) => isPeriod(it.name)) && bars[0].cls === bars[1].cls) {
        const share = isPct(bars[0].num!) && bars.every((it) => it.v >= 0 && it.v <= 100 && !/^[+−-]/.test(it.text));
        const ordered = [...bars].sort((a, c) => (yearIn(a.name) ?? 0) - (yearIn(c.name) ?? 0));
        return {kind: "periods", rows: ordered.map((it) => rowOf(it, hot(it))), scale: share ? 100 : runMax(i, bcls), share};
      }
      const sum = bars.reduce((s, it) => s + it.v, 0);
      if (bars.every((it) => it.cls === cls) && near(sum, big.value)) {
        const lineIt = items.filter((it) => it.beat < i && it.cls === cls && it.kind === "big" && it.v < big.value && it.v > big.value * 0.5 && nameIn(it.name, about(b)) > 0).pop() ?? null;
        return {kind: "sum", parts: bars.map((it) => rowOf(it)), total: {name: kickerHead(b), v: big.value, text: big.text, num: big, lockF: lockOfNum(L, b, big), hot: true,
          ent: entKey(kickerHead(b)), role: null, from: i, gates: gates[i]}, line: lineIt ? rowOf(lineIt, false, true) : null, scale: Math.max(big.value, lineIt?.v ?? 0)};
      }
      const scale = runMax(i, bcls);
      const mx = Math.max(...bars.map((it) => it.v));
      const em = earlierMax(i, bcls);
      if (em && !bars.includes(em) && mx < scale * 0.04) return {kind: "inset", rows: rowsOf(), ghost: rowOf(em, false, true), scale};
      const ghost = em && !bars.includes(em) && em.v > mx * 1.6 ? rowOf(em, false, true) : null;
      // a reference line is an earlier value the beat itself names ("AVERAGE PER ACCOUNT" on a page about averages), never
      // one picked by unit and size alone
      const refs = items.filter((it) => it.beat < i && it.cls === bcls && it.kind === "big" && (it !== em || !ghost) && it.v < mx && nameIn(it.name, about(b)) > 0)
        .slice(-1).map((it) => rowOf(it, false, true));
      return {kind: "rows", rows: rowsOf(), scale: ghost ? scale : Math.max(...bars.map((it) => Math.abs(it.v))), ghost, refs, range: null};
    }
    // no bars
    const txt = plain(b.text ?? "");
    const me = items.find((it) => it.key === `${i}:big`) ?? items.find((it) => it.beat === i)!;
    if (big.prefix === "₹" && thresholdText(b)) {
      // earlier limits are other rules: they are not drawn on this rule's track
      return {kind: "threshold", at: rowOf(me, true), side: /\b(below|under)\b/i.test(txt) ? "below" : "above"};
    }
    const oldM = /\bfrom\s+(₹\s?\d[\d,]*(?:\.\d+)?)(\s+and above|\+)?/i.exec(b.subShown ?? "");
    if (isPrice(big) || (big.prefix === "₹" && oldM)) {
      const prev = items.filter((it) => it.beat < i && it.cls === cls && it.kind === "big").map((it) => rowOf(it, false, true));
      const old = oldM ? parseNumber(oldM[1]) : null;
      return {kind: "price", rows: prev, hot: rowOf(me, true), old: old ? {...old, lockF: lockOfNum(L, b, big)} : null, oldRest: oldM?.[2]?.trim() ?? ""};
    }
    // one value on the story's running scale, with the earlier values of its unit as ghosts
    const prev = items.filter((it) => it.beat < i && it.cls === cls && it.kind === "big").slice(-2);
    const em = earlierMax(i, cls);
    const ghosts = [...new Set([...(em && !prev.includes(em) ? [em] : []), ...prev])].slice(-2);
    const range = rangeFor(i, big.value, cls);
    const scale = runMax(i, cls);
    if (big.value >= 0 && ghosts.length && Math.abs(big.value) < scale * 0.04) return {kind: "inset", rows: [rowOf(me, true)], ghost: rowOf(ghosts[0], false, true), scale};
    if (ghosts.some((g) => g.v < 0) || big.value < 0) return {kind: "diverge", rows: [...ghosts.map((g) => rowOf(g, false, true)), rowOf(me, true)], ghost: null};
    return {kind: "rows", rows: [...ghosts.map((g) => rowOf(g, false, true)), rowOf(me, true)], scale, ghost: null, refs: [], range};
  };

  const quoteFor = (b: LookBeat): Quote | null => {
    const nums = [b.big, b.hero, ...b.tokens.map((t) => t.num)].filter(Boolean) as LookNum[];
    const ctx = new Set(words([b.text, b.subShown, b.note, ...(b.lines ?? []), b.voice?.text ?? ""].join(" ")));
    let best: {q: Quote; s: number; k: number} | null = null;
    quotes.forEach((q, k) => {
      if (used.has(k)) return;
      const qn = findNumbers(q.contains.replace(/Rs\.?\s?/g, "₹"));
      const numHit = nums.some((n) => qn.some((m) => near(m.value, n.value) && Math.abs(n.value) >= 10));
      const qw = [...new Set(words(`${q.says} ${q.contains}`))];
      const ov = qw.filter((w) => ctx.has(w) || [...ctx].some((c) => c.slice(0, 6) === w.slice(0, 6) && w.length >= 6)).length / Math.max(1, qw.length);
      const s = (numHit ? 1 : 0) + ov;
      if ((numHit || ov >= 0.34) && (!best || s > best.s)) best = {q, s, k};
    });
    if (!best) return null;
    used.add((best as {k: number}).k);
    return (best as {q: Quote}).q;
  };

  const sayProof = (b: LookBeat, i: number): Proof | null => {
    const want = b.tokens.filter((t) => !t.num).map((t) => t.text);
    const facts = items.filter((it) => it.beat < i);
    const h = b.hero;
    const claimText = [...(b.lines ?? []), b.voice?.text ?? ""].join(" ");
    const claim = h && unitKey(h.unit) === "×" ? {v: h.value, qual: h.qual} : timesClaim(b.lines ?? []);
    if (claim) {
      const p = ratioPair(aliased.filter((it) => it.beat < i && it.v > 0), claim.v, claim.qual, want, claimText);
      if (p) {
        const rg = rangeFor(i, p.A.v, p.A.cls);
        const scale = Math.max(p.A.v, rg?.hi.value ?? 0);
        const n = Math.floor(claim.v + 1e-9);
        const word = Object.keys(NUM_WORDS).find((w) => NUM_WORDS[w] === claim.v && claimText.toLowerCase().includes(w)) ?? "";
        if ((p.B.v / scale) * 755 >= 20 && n * p.B.v <= scale) return {kind: "tiles", A: rowOf(back(p.A), true), B: rowOf(back(p.B)), n, scale, lo: rg ? rg.lo.value : null, lockF: h?.lockF ?? wordLocksOf(L, b)(word)};
      }
    }
    if (h && h.prefix === "₹" && unitKey(h.unit) === "") {
      const eq = facts.filter((it) => it.cls === clsOf(h) && near(it.v, h.value));
      if (eq.length >= 2) return {kind: "equal", rows: eq.map((it) => rowOf(it)), lockF: h.lockF};
    }
    if (h && isPct(h)) {
      const pc = facts.filter((it) => it.cls.endsWith("|%"));
      if (pc.length >= 3 && pc.every((it) => Math.abs(it.v) < h.value)) {
        // in time order (a session's year is in its name or its beat's kicker or deck)
        const yr = (it: Item) => yearIn(it.name) ?? yearIn(L.beats[it.beat].kicker ?? "") ?? yearIn(L.beats[it.beat].text ?? "") ?? 0;
        return {kind: "band", rows: [...pc].sort((a, c) => yr(a) - yr(c)).map((it) => rowOf(it)), edge: h.value, lockF: h.lockF, text: h.text};
      }
    }
    if (want.length) {
      const named = facts.filter((it) => it.kind === "bar" && nameHit(want, it.name));
      const uniq = named.filter((it, k) => named.findIndex((x) => x.name === it.name) === k);
      if (uniq.length >= 2 && new Set(uniq.map((it) => it.cls)).size === 1) return {kind: "bars", rows: uniq.map((it) => rowOf(it)), lockF: b.lockF};
      const fi = L.beats.findIndex((fb, j) => j < i && fb.kind === "fact" && want.some((w) => w.length >= 5 && (fb.kicker ?? "").toLowerCase().includes(w.toLowerCase())));
      if (fi >= 0) {
        const bars = items.filter((it) => it.beat === fi && it.kind === "bar");
        if (bars.length >= 2) return {kind: "bars", rows: bars.map((it) => rowOf(it)), lockF: b.lockF};
      }
    }
    return null;
  };

  // The front page's object. It never shows the size of a value the hook has not said: shapes land on the hook's own
  // words, and before that the object is only names and empty tracks.
  const hookTeaser = (b: LookBeat): Teaser => {
    const h = b.hero;
    const nums = b.tokens.map((t) => t.num).filter(Boolean) as LookNum[];
    const want = b.tokens.filter((t) => !t.num).map((t) => t.text);
    const claimText = [...(b.lines ?? []), b.voice?.text ?? ""].join(" ");
    if (h && unitKey(h.unit) === "×") {
      const p = ratioPair(aliased.filter((it) => it.v > 0), h.value, h.qual, want, claimText);
      if (p) {
        const rg = ranges.find((r) => r && clsOf(r.hi) === p.A.cls && near(r.of, p.A.v)) ?? null;
        return {kind: "ratio", A: {...rowOf(back(p.A), true), num: null}, B: {...rowOf(back(p.B)), num: null}, copies: Math.floor(h.value + 1e-9),
          scale: Math.max(p.A.v, rg?.hi.value ?? 0), lockF: h.lockF, range: rg};
      }
    }
    if (h) {
      const tally = L.beats.find((fb) => fb.kind === "fact" && fb.big && unitKey(fb.big.unit) === "of" && near(fb.big.value, h.value));
      if (tally) {
        const N = parseInt(/of (\d+)/.exec(tally.big!.unit)![1], 10);
        const nTok = [...nums, ...b.lineNums].find((n) => n !== h && near(n.value, N));
        return {kind: "tally", k: Math.round(h.value), N, kF: h.lockF, NF: nTok ? Math.max(nTok.lockF, h.lockF) : h.lockF};
      }
    }
    // the values the hook itself prints, matched to the story's items by value and unit (two or more: a chart of them)
    const match = (n: LookNum) => items.find((it) => it.cls === clsOf(n) && near(Math.abs(it.v), Math.abs(n.value)))
      ?? items.find((it) => unitKey(it.text.replace(/^[^\d]*[\d,.]+/, "")) === unitKey(n.unit) && near(Math.abs(it.v), Math.abs(n.value)) && it.text.startsWith(n.prefix || it.text[0]));
    const all = [...nums, ...b.lineNums.filter((n) => !nums.includes(n))];
    const hits = all.map((n) => ({n, it: match(n)})).filter((x): x is {n: LookNum; it: Item} => !!x.it);
    const uniq = hits.filter((x, k) => hits.findIndex((y) => y.it === x.it) === k);
    if (uniq.length >= 2) return {kind: "rows", rows: uniq.map((x) => ({...rowOf(x.it, x.n === h), num: null})), at: uniq.map((x) => x.n.lockF)};
    if (h && uniq.length === 1) {
      const d = factDevice(L.beats[uniq[0].it.beat], uniq[0].it.beat);
      if (d?.kind === "threshold") return {kind: "threshold", at: {...d.at, num: null}, lockF: h.lockF};
    }
    // a number word that counts the story's own sections ("three years running" over three DHANTERAS beats)
    const facts = L.beats.filter((fb) => fb.kind === "fact");
    const wl = wordLocksOf(L, b);
    for (const line of b.lines ?? []) for (const w of toks(line)) {
      const n = NUM_WORDS[w];
      if (!n || n < 2 || n > 12 || !facts.length) continue;
      const first = (fb: LookBeat) => toks(kickerHead(fb))[0] ?? "";
      const run = facts.filter((fb) => first(fb) === first(facts[0]));
      if (run.length === n) return {kind: "count", n, lockF: wl(w), names: run.map(kickerHead)};
    }
    return {kind: "index", heads: facts.map((fb) => ({text: kickerHead(fb), gates: gates[fb.i], lockF: fb.lockF})).filter((x) => x.text)};
  };

  const plans: BeatPlan[] = L.beats.map((b, i) => {
    const base = {device: null, range: null, quote: null, credit: "", proof: null, teaser: null, layout: "fold" as BeatPlan["layout"], band: "accent" as Role, src: b.src, credits: [] as string[]};
    if (b.kind === "fact") {
      const device = factDevice(b, i);
      const quote = quoteFor(b);
      return {...base, device, range: ranges[i], quote, credit: quote ? quoteCredit(quote, L.sourceLines, about(b), b.src) : ""};
    }
    if (b.kind === "say") {
      const proof = sayProof(b, i);
      const q = proof ? null : quoteFor(b);
      const q2 = q ? quoteFor(b) : null;
      const qs = q ? (q2 ? [q, q2] : [q]) : [];
      return {...base, proof: q ? {kind: "slip", quotes: qs} : proof, credits: qs.map((x) => quoteCredit(x, L.sourceLines, [b.note, ...(b.lines ?? []), b.voice?.text].join(" "), b.src))};
    }
    if (b.kind === "spot" || b.kind === "hook") return {...base, teaser: hookTeaser(b)};
    if (b.kind === "map" || b.kind === "mapend") return {...base, layout: "map"};
    return base;
  });

  // 3. colours: one per thing measured, for the whole Short
  const roles: Record<string, Role | null> = {};
  const ORDER: Role[] = ["accent", "ink", "accent2"];
  const pages = new Map<string, Set<number>>();      // where each thing appears
  const rowsOfPlan = (p: BeatPlan): Row[] => {
    const d = p.device, t = p.teaser, pr = p.proof;
    const rs: Row[] = [];
    if (d) {
      if (d.kind === "ratio") rs.push(d.A, d.B);
      else if (d.kind === "diverge") rs.push(...d.rows, ...(d.ghost ? [d.ghost] : []));
      else if (d.kind === "periods" || d.kind === "rows" || d.kind === "inset") rs.push(...d.rows, ...("ghost" in d && d.ghost ? [d.ghost] : []), ...(d.kind === "rows" ? d.refs : []));
      else if (d.kind === "sum") rs.push(...d.parts, d.total, ...(d.line ? [d.line] : []));
      else if (d.kind === "threshold") rs.push(d.at);
      else if (d.kind === "price") rs.push(...d.rows, d.hot);
    }
    if (t && (t.kind === "ratio")) rs.push(t.A, t.B);
    if (t && t.kind === "rows") rs.push(...t.rows);
    if (pr && pr.kind === "tiles") rs.push(pr.A, pr.B);
    if (pr && (pr.kind === "equal" || pr.kind === "bars" || pr.kind === "band")) rs.push(...pr.rows);
    return rs;
  };
  plans.forEach((p, i) => rowsOfPlan(p).forEach((r) => { if (!pages.has(r.ent)) pages.set(r.ent, new Set()); pages.get(r.ent)!.add(i); }));
  const lastUse: Record<Role, number> = {accent: -1, ink: -1, accent2: -1};
  const names: Record<string, string> = {};
  plans.forEach((p) => rowsOfPlan(p).forEach((r) => { names[r.ent] ??= r.name; }));
  const give = (ent: string, at: number) => {
    if (!ent || ent in roles) return;
    const mine = pages.get(ent) ?? new Set<number>();
    const clash = (r: Role) => Object.entries(roles).some(([e, x]) => x === r && [...(pages.get(e) ?? [])].some((pg) => mine.has(pg)));
    // a thing of the same kind ("Campa" and "CAMPA + LAHORI ZEERA") shares its colour, if they never meet on a page
    const kinRole = Object.entries(roles).find(([e, x]) => x && kin(names[e] ?? e, names[ent] ?? ent) && !clash(x))?.[1] ?? null;
    const free = ORDER.filter((r) => !Object.values(roles).includes(r));
    const r = kinRole ?? free[0] ?? [...ORDER].filter((x) => !clash(x)).sort((a, c) => lastUse[a] - lastUse[c])[0] ?? null;
    roles[ent] = r;
    if (r) lastUse[r] = at;
  };
  plans.forEach((p, i) => {
    const d = p.device;
    for (const r of rowsOfPlan(p)) if (r.hot && !r.ghost) give(r.ent, i);
    if (d && d.kind === "periods") for (const r of d.rows) give(r.ent, i);
    if (d && d.kind === "ratio") { give(d.A.ent, i); give(d.B.ent, i); }
    if (p.proof && p.proof.kind === "tiles") { give(p.proof.A.ent, i); give(p.proof.B.ent, i); }
    if (p.proof && p.proof.kind === "equal") for (const r of p.proof.rows) give(r.ent, i);
  });
  // a thing that is never the focus but recurs keeps neutral; everything else measured once and not the focus is neutral
  const paint = (r: Row) => { r.role = roles[r.ent] ?? null; };
  plans.forEach((p) => rowsOfPlan(p).forEach(paint));

  // 4. the lead colour, layouts and bands
  const leadOpt = (L.lookOpts as {lead?: string}).lead;
  const lead: Role = leadOpt === "ink" ? "ink" : leadOpt === "maroon" || leadOpt === "accent" ? "accent" : leadOpt === "amber" || leadOpt === "accent2" ? "accent2"
    : (["accent", "ink", "accent2"] as Role[])[pick(L, "v5c", 3)];
  const hookL: HookLayout = (["banner", "foot", "plain"] as HookLayout[])[pick(L, "v5", 3)];
  const sayL: SayLayout = (["below", "above"] as SayLayout[])[pick(L, "say", 2)];
  const endL: EndLayout = (["band", "full", "foot"] as EndLayout[])[pick(L, "end", 3)];
  const FACT: FactLayout[] = ["fold", "foot", "box"];
  let k = pick(L, "fact", 3), prevL = "", prevBand: Role | null = null;
  const cyc = (["accent", "ink", "accent2"] as Role[]);
  plans.forEach((p, i) => {
    const b = L.beats[i];
    if (b.kind === "spot" || b.kind === "hook") { p.layout = hookL; p.band = lead; prevBand = lead; prevL = hookL === "banner" ? "fold" : hookL; return; }
    if (b.kind === "say") { p.layout = sayL; p.band = lead; prevL = "say"; return; }
    if (b.kind === "end") { p.layout = endL; p.band = lead; return; }
    if (b.kind !== "fact") return;
    const d = p.device;
    if (d?.kind === "ratio") { p.layout = "desk"; prevL = "desk"; prevBand = null; return; }
    const ok = FACT.filter((l) => l !== prevL && !(l === "box" && (!d || d.kind === "price" || d.kind === "tally" || d.kind === "duration")));
    const lay = ok[k % ok.length];
    k++;
    p.layout = lay; prevL = lay;
    // the band is the colour of the thing the page is about; a page about no one thing takes the next colour in turn
    const hot = d ? rowsOfPlan(p).find((r) => r.hot && !r.ghost && r.role) : null;
    const periodsRole = d?.kind === "periods" ? d.rows[0].role : null;
    let band: Role | null = (periodsRole ?? hot?.role) ?? null;
    if (!band) band = cyc.find((r) => r !== prevBand && !Object.values(roles).includes(r)) ?? cyc.find((r) => r !== prevBand) ?? "accent";
    p.band = band; prevBand = band;
  });

  // 5. sources: a page that draws an earlier beat's value also names that beat's source ("INDIAN HOMES 25,000 t" on the
  // US page reads "WGC estimate, as reported" too)
  plans.forEach((p, i) => {
    const b = L.beats[i];
    if (b.kind !== "fact") return;
    const extra: string[] = [];
    for (const r of rowsOfPlan(p)) {
      const s = L.beats[r.from]?.src;
      if (r.from !== i && s && !b.src.includes(s) && !extra.includes(s) && !s.split(" · ").every((part) => b.src.includes(part))) {
        const parts = s.split(" · ").filter((part) => !b.src.includes(part) && !extra.join(" · ").includes(part));
        if (parts.length) extra.push(parts.join(" · "));
      }
    }
    p.src = [b.src, ...extra].join(" · ");
  });
  return {items, beats: plans, lead, roles};
};
