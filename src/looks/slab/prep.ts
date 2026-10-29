// Slab look: the story as Slab draws it (pure, no DOM). prepStory() copies LookData and only ever makes it stricter:
//   locks      a number word_times.py marked "said-earlier" counts as said only when an earlier beat printed the same
//              number; otherwise it locks with its beat (fm03's '−2%' was matched to the hook's 'top-two')
//   sources    per-beat source lines and printed qualifiers from public/looks/slab/story_notes.json, where the config's
//              look_opts has none (a config's own beatSources always wins)
//   spoken     every number the narrator says, with its frame (word_times.json numbers, plus ordinal dates such as
//              'eighth November'), so plain text that holds a number (tickets, notes, the end sub, rail names) is drawn
//              only once each of its numbers has been said, or with its beat's lock when the narrator never says it
import notesJson from "../../../public/looks/slab/story_notes.json";
import {findNumbers} from "../shared/numbers";
import {WORD_TIMES} from "../shared/registry";
import type {LookBeat, LookData, LookNum} from "../shared/types";

type StoryNotes = {beatSources?: Record<string, string>; quals?: Record<string, Record<string, string>>; plate?: boolean};
const NOTES = notesJson as unknown as Record<string, StoryNotes>;

// A number as Slab draws it: sq is a printed qualifier ("almost", "about") from the story notes.
export type SNum = LookNum & {sq?: string};
export const qualOf = (n: LookNum | null | undefined) => (n ? ((n as SNum).sq ?? n.qual).trim() : "");

export type Spoken = {v: number; f: number}[];
export type Prepped = {L: LookData; spoken: Spoken; platesOk: boolean};

const ORD: Record<string, number> = {first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10,
  eleventh: 11, twelfth: 12, thirteenth: 13, fourteenth: 14, fifteenth: 15, sixteenth: 16, seventeenth: 17, eighteenth: 18, nineteenth: 19,
  twentieth: 20, thirtieth: 30};
const MONTH = /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i;

const spokenOf = (L: LookData): Spoken => {
  const W = L.timing === "measured" ? WORD_TIMES[L.id] : null;
  if (!W) return [];
  const out: Spoken = [];
  for (const l of W.lines) {
    for (const n of l.numbers) out.push({v: n.value, f: n.f});
    // ordinal dates: "eighth November", "twenty first October" (an ordinal not followed by a month is not a date)
    l.words.forEach((w, i) => {
      const k = w.w.toLowerCase().replace(/[^a-z-]/g, "");
      const parts = k.split("-");
      let v = ORD[parts[parts.length - 1]];
      if (v === undefined) return;
      const tens = parts.length > 1 ? parts[0] : (l.words[i - 1]?.w ?? "").toLowerCase().replace(/[^a-z]/g, "");
      if (v < 10 && tens === "twenty") v += 20;
      else if (v < 10 && tens === "thirty") v += 30;
      if (MONTH.test(l.words[i + 1]?.w ?? "")) out.push({v, f: Math.ceil((l.at + w.start) * 30)});
    });
  }
  return out.sort((a, b) => a.f - b.f);
};

const same = (a: LookNum, b: LookNum) => a.text === b.text || (a.sign === b.sign && a.value * a.scale === b.value * b.scale && a.unit.trim() === b.unit.trim());

export const prepStory = (L: LookData): Prepped => {
  const N = NOTES[L.id] ?? {};
  const map = new Map<LookNum, SNum>();
  const printed: LookNum[] = [];
  const beats: LookBeat[] = L.beats.map((b) => {
    const key = b.name ?? b.kind;
    const qs = N.quals?.[key] ?? {};
    const mine: LookNum[] = [];
    const fix = <T extends LookNum | null>(n: T): T => {
      if (!n) return n;
      const hit = map.get(n);
      if (hit) return hit as unknown as T;
      let lockF = n.lockF;
      if (n.lockHow === "said-earlier" && !printed.some((m) => same(m, n))) lockF = Math.max(lockF, b.lockF);
      const out: SNum = {...n, lockF, ...(qs[n.text] ? {sq: qs[n.text]} : {})};
      map.set(n, out);
      mine.push(out);
      return out as unknown as T;
    };
    const big = fix(b.big), hero = fix(b.hero);
    const nb: LookBeat = {...b, big, hero,
      tokens: b.tokens.map((t) => ({...t, num: fix(t.num)})), lineNums: b.lineNums.map(fix), barsL: b.barsL.map((r) => ({...r, num: fix(r.num)})),
      textNums: b.textNums.map(fix), qNums: b.qNums.map(fix),
      src: L.lookOpts.beatSources?.[key] ?? N.beatSources?.[key] ?? b.src};
    printed.push(...mine);
    return nb;
  });
  return {L: {...L, beats}, spoken: spokenOf(L), platesOk: N.plate === true};
};

// The frame from which text holding numbers may be drawn: each number at the first frame the narrator says its value
// (anywhere in the Short), or the beat's own lock when it is never said. Text without numbers: -Infinity.
export const textLock = (spoken: Spoken, b: LookBeat, text: string | null | undefined) => {
  let at = -Infinity;
  for (const p of findNumbers(text)) {
    const s = spoken.find((x) => Math.abs(x.v - p.value) < 1e-9 || Math.abs(x.v - p.value * p.scale) < 1e-6);
    at = Math.max(at, s ? s.f : b.lockF);
  }
  return at;
};

// A number inside a plain label (a rail row's name "2017"), gated like any printed number.
export const labelNums = (spoken: Spoken, b: LookBeat, text: string): LookNum[] => findNumbers(text).map((p) => {
  const known = [b.big, ...b.textNums, ...b.barsL.map((r) => r.num)].find((n) => n && n.text === p.text && n.role !== "bar");
  const lockF = known ? known.lockF : textLock(spoken, b, p.text);
  return {...p, role: "text", lockF, spokenF: null, lockHow: known ? known.lockHow : "not-spoken"};
});
