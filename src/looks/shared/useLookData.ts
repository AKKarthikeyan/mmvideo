// BeatData -> LookData (the contract in ./types.ts). Pure: toLookData() can run anywhere (posts, harness); useLookData()
// memoises it inside a composition.
import {useMemo} from "react";
import {getStaticFiles} from "remotion";
import type {BeatData} from "../../datayt/BeatStory";
import {DEFAULT_BRAND, getBrand} from "../brands";
import {LOOK_IDS, type BrandId, type LookId} from "../brands/types";
import {findNumbers, heroToken, parseNumber, starred} from "./numbers";
import {CONFIG_LOOK, WORD_TIMES} from "./registry";
import type {LockHow, LookBar, LookBeat, LookData, LookNum, LookOpts, NumParse, NumRole, WordTimes} from "./types";

const FPS = 30;
const F = (s: number) => Math.round(s * FPS);      // the same frame rounding as BeatStory

// FNV-1a, folded to 1..2^31-2: rough-notation seeds must be 1 or more.
export const seedOf = (id: string) => {
  let h = 0x811c9dc5;
  for (const ch of id) { h ^= ch.codePointAt(0)!; h = Math.imul(h, 0x01000193) >>> 0; }
  return (h % 2147483646) + 1;
};

export type LookDataOpts = {look?: string | null; brand?: string | null; lookOpts?: LookOpts | null};

// Word times are used only when they were measured on this exact narration (same lines, same start times); a re-voiced
// Short falls back to "no-timing" until word_times.py runs again.
const timesFor = (D: BeatData): WordTimes | null => {
  const W = WORD_TIMES[D.id];
  if (!W || !D.vo?.length || W.lines.length !== D.vo.length) return null;
  const same = W.lines.every((l, i) => l.text === (D.vo[i] as {text?: string}).text && Math.abs(l.at - D.vo[i].at) < 0.002);
  return same ? W : null;
};

const plateFor = (id: string, opt: LookOpts["plate"]): string | null => {
  if (opt === false) return null;
  if (typeof opt === "string") return opt;
  try {
    const want = `datayt/covers/${id}-gemini.png`;
    return getStaticFiles().some((f) => f.name === want) ? want : null;
  } catch {
    return null;
  }
};

const checkSourceLabel = (id: string, label: string, match: string, texts: string[]) => {
  const re = new RegExp(match, "i");
  for (const t of texts) {
    if (t && re.test(t) && !t.includes(label)) {
      throw new Error(`${id}: the look would print "${t}", which names the source matched by /${match}/ without "${label}". Add a look_opts override (sourceShort, beatSources, beatSubs or sourceLines).`);
    }
  }
};

export const toLookData = (D: BeatData, opts: LookDataOpts = {}): LookData => {
  const cfg = CONFIG_LOOK[D.id] ?? {};
  const look = (opts.look ?? D.look ?? cfg.look ?? "slab") as LookId;
  if (!LOOK_IDS.includes(look)) throw new Error(`${D.id}: unknown look "${look}" (slab, counter or dispatch)`);
  const brand = (opts.brand ?? D.brand ?? cfg.brand ?? DEFAULT_BRAND) as BrandId;
  getBrand(brand);      // throws on an unknown brand
  const lookOpts: LookOpts = {...((D.lookOpts ?? cfg.look_opts ?? {}) as LookOpts), ...(opts.lookOpts ?? {})};
  const textLed = !(D.vo?.length);
  const W = textLed ? null : timesFor(D);
  const beatF = (D.beat ?? 60 / 124) * FPS, barF = beatF * 4;
  const sourceShort = lookOpts.sourceShort ?? D.sourceShort;

  const beats: LookBeat[] = D.beats.map((b, i) => {
    const f0 = F(b.t0), f1 = F(b.t1), key = b.name ?? b.kind;
    const wb = W?.beats[i];
    const fallbackF = f0 + 6;
    const lockF = wb ? wb.lockF : fallbackF;
    const lockHow: LockHow = wb ? wb.lockHow : "no-timing";
    const mk = (p: NumParse | null, role: NumRole): LookNum | null => {
      if (!p) return null;
      const r = wb?.numbers.find((x) => x.role === role && x.text === p.text);
      return {...p, role, lockF: r ? r.lockF : wb ? lockF : fallbackF, spokenF: r?.spokenF ?? null, lockHow: r ? r.how : (wb ? "not-spoken" : "no-timing")};
    };
    const isFact = b.kind === "fact";
    const lineKind = ["spot", "say", "hook"].includes(b.kind);
    const heroText = lineKind ? heroToken(b.lines) : null;
    const big = isFact && b.big ? mk(parseNumber(b.big), "big") : null;
    const hero = isFact ? big : heroText ? mk(parseNumber(heroText), "hero") : null;
    const tokens = lineKind ? starred(b.lines).map((s) => ({text: s, num: s === heroText ? hero : /\d/.test(s) ? mk(parseNumber(s), "line") : null})) : [];
    const lineNums = lineKind ? (b.lines ?? []).flatMap((l) => findNumbers(l)).filter((n) => !heroText || !heroText.includes(n.text)).map((n) => mk(n, "line")!) : [];
    const barsL: LookBar[] = (b.bars ?? []).map((r) => ({...r, num: mk(parseNumber(r.label), "bar")}));
    const textNums = isFact ? findNumbers(b.text).map((n) => mk(n, "text")!) : [];
    const qNums = ["end", "mapend"].includes(b.kind) ? findNumbers(b.q).map((n) => mk(n, "q")!) : [];
    const vi = (D.vo ?? []).findIndex((v) => v.at >= b.t0 - 0.01 && v.at < b.t1);
    const v = vi >= 0 ? (D.vo[vi] as {file: string; at: number; sec: number; text?: string}) : null;
    const voice = v ? {file: v.file, at: v.at, sec: v.sec, text: v.text ?? "", f0: F(v.at), f1: F(v.at + v.sec)} : null;
    const words = W && vi >= 0 ? W.lines[vi].words.map((w) => ({w: w.w, start: +(v!.at + w.start).toFixed(3), end: +(v!.at + w.end).toFixed(3)})) : [];
    return {...b, i, f0, f1, settleF: F(b.t1 - 0.4), lockF, lockHow, lockWord: wb?.lockWord ?? null, late: lockF > f1 - 12,
      hero, big, tokens, lineNums, barsL, textNums, qNums,
      src: lookOpts.beatSources?.[key] ?? sourceShort, subShown: lookOpts.beatSubs?.[key] ?? b.sub ?? "", voice, words};
  });

  const sourceLines = lookOpts.sourceLines?.length ? lookOpts.sourceLines : [D.source];
  if (lookOpts.sourceLabel) {
    checkSourceLabel(D.id, lookOpts.sourceLabel, lookOpts.sourceLabelMatch ?? lookOpts.sourceLabel.split(/[ ,]/)[0],
      [sourceShort, ...sourceLines, ...beats.map((b) => b.src), ...beats.map((b) => b.subShown)]);
  }
  return {D, id: D.id, type: D.type, look, brand, lookOpts, seed: seedOf(D.id), plate: plateFor(D.id, lookOpts.plate),
    fps: FPS, frames: Math.ceil(D.total * FPS), total: D.total, barF, beatF, textLed,
    chip: D.chip, sourceShort, sourceLines, sourceLabel: lookOpts.sourceLabel ?? null,
    beats, timing: W ? "measured" : "none", timingMethod: W?.method ?? (textLed ? "text-led cut: no narration" : "no word_times.json for this narration"),
    accent: D.accent, accent2: D.accent2, bands: D.bands};
};

export const useLookData = (D: BeatData, opts: LookDataOpts = {}) =>
  useMemo(() => toLookData(D, opts), [D, opts.look, opts.brand, opts.lookOpts]);      // eslint-disable-line react-hooks/exhaustive-deps

// The beat on screen at frame f (the same rule as BeatStory: the last beat holds to the end).
export const beatAt = (L: LookData, f: number) => L.beats.find((b) => f >= b.f0 && f < b.f1) ?? L.beats[L.beats.length - 1];
