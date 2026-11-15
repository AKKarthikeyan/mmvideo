// The source quotes a story's config carries ("quotes": [{says, text, contains}]). build_beats.py checks each "contains"
// word for word against the source text it names, so a quote is printed exactly as the source prints it (Dispatch's
// proof slip). They live in public/datayt/beats/configs/<id>.json, not in data.json, so the look reads that file at render
// time (any story id, no list to keep up): useQuotes() holds the frame with delayRender until it has the file, and a
// story without a config or without quotes simply gets none.
// FOR THE LEAD: LookData could carry these (shared/useLookData.ts) beside the other config look fields.
import {useEffect, useState} from "react";
import {continueRender, delayRender, staticFile} from "remotion";

export type Quote = {says: string; text: string[]; contains: string};

// Printed qualifiers: a source table item may carry the figure exactly as the publisher prints it ("printed": "almost
// 15%", "roughly 7%" in public/datayt/sources/softdrinks/share_2025.json). data.json keeps the bare number; the look prints
// the publisher's wording so a rounded or approximate share never reads as exact. Keyed by beat name, then bar name (or
// "big" for the card's own figure).
export type Printed = Record<string, Record<string, string>>;
export type Extras = {quotes: Quote[]; printed: Printed};

const CACHE = new Map<string, Extras>();
const parse = (cfg: unknown): Quote[] => {
  const qs = (cfg as {quotes?: unknown})?.quotes;
  if (!Array.isArray(qs)) return [];
  return qs.filter((q): q is Quote => !!q && typeof (q as Quote).contains === "string" && (q as Quote).contains.trim().length > 0)
    .map((q) => ({says: typeof q.says === "string" ? q.says : "", text: Array.isArray(q.text) ? q.text.map(String) : [], contains: q.contains}));
};
type Ref = [string, string, string];
const refOk = (r: unknown): r is Ref => Array.isArray(r) && r.length >= 2 && r.every((x) => typeof x === "string");
const getJson = (path: string) => fetch(staticFile(path)).then((r) => (r.ok ? r.json() : null), () => null).catch(() => null);
const printedOf = async (cfg: unknown): Promise<Printed> => {
  const cards = (cfg as {cards?: unknown})?.cards;
  if (!Array.isArray(cards)) return {};
  const want: {beat: string; key: string; ref: Ref}[] = [];
  for (const c of cards as {name?: string; item?: unknown; bars?: {name?: string; item?: unknown}[]}[]) {
    if (!c || typeof c.name !== "string") continue;
    if (refOk(c.item)) want.push({beat: c.name, key: "big", ref: c.item});
    for (const b of c.bars ?? []) if (b && typeof b.name === "string" && refOk(b.item)) want.push({beat: c.name, key: b.name, ref: b.item});
  }
  const tables = new Map<string, Promise<unknown>>();
  for (const w of want) if (!tables.has(w.ref[0])) tables.set(w.ref[0], getJson(`datayt/sources/${w.ref[0]}.json`));
  const out: Printed = {};
  for (const w of want) {
    const t = (await tables.get(w.ref[0])) as {items?: Record<string, {printed?: unknown}>} | null;
    const pr = t?.items?.[w.ref[1]]?.printed;
    if (typeof pr === "string" && pr.trim()) (out[w.beat] ??= {})[w.key] = pr.trim();
  }
  return out;
};

export const useExtras = (id: string): Extras | null => {
  const [qs, setQs] = useState<Extras | null>(() => CACHE.get(id) ?? null);
  const [handle] = useState(() => (CACHE.has(id) ? null : delayRender(`Dispatch: quotes for ${id}`)));
  useEffect(() => {
    let live = true;
    const done = (q: Extras) => { CACHE.set(id, q); if (live) setQs(q); if (handle !== null) continueRender(handle); };
    if (CACHE.has(id)) { done(CACHE.get(id)!); return; }
    getJson(`datayt/beats/configs/${id}.json`).then(async (cfg) => done({quotes: parse(cfg), printed: await printedOf(cfg).catch(() => ({}))}), () => done({quotes: [], printed: {}}));
    return () => { live = false; };
  }, [id, handle]);
  return qs;
};
export const useQuotes = (id: string): Quote[] | null => useExtras(id)?.quotes ?? null;

// The document a quote comes from, as the story's own source text names it: the source is split into its parts
// ("RBI FAQ on UDGAM", "Income-tax Act, 2025, sections 92, 186 and 451", ...) and the part sharing the most words with the
// quote (what it says, its words, the key of its source text, e.g. "udgam" or "s92" -> 92) wins. A slip is credited to
// that part; with no clear winner it falls back to the beat's own source line.
const toks = (s: string) => s.toLowerCase().normalize("NFKD").split(/[^a-z0-9]+/).filter((w) => w.length >= 4 || /^\d{2,}$/.test(w)).map((w) => (/^\d+$/.test(w) ? w : w.slice(0, 6)));
const STOP = new Set(["with", "from", "that", "this", "have", "been", "will", "their", "which", "where", "there", "read", "page", "pages", "such", "other", "only", "more", "than"]);
export const quoteCredit = (q: Quote, source: string[], context: string, fallback: string) => {
  const parts = source.flatMap((s) => s.split(/(?<=[.;])\s+(?=[A-Z0-9'‘])/)).map((s) => s.trim().replace(/[.;]$/, "")).filter((s) => s.length > 3);
  const key = (q.text[2] ?? "").replace(/^s(\d+)$/, "$1");
  const want = new Map<string, number>();
  for (const w of toks(`${q.says} ${q.contains}`)) if (!STOP.has(w)) want.set(w, 1);
  for (const w of toks(key)) want.set(w, 3);
  for (const w of toks(context)) if (!STOP.has(w) && !want.has(w)) want.set(w, 0.5);
  let best: {s: string; score: number} | null = null;
  for (const p of parts) {
    if (/^read\b/i.test(p)) continue;
    const pw = new Set(toks(p));
    let score = 0;
    for (const [w, k] of want) if (pw.has(w)) score += k;
    if (score >= 1.5 && (!best || score > best.score)) best = {s: p, score};
  }
  if (!best) return fallback;
  // the document's own title when the part prints one in quotes, else the part up to its first colon
  const [head, ...rest] = best.s.split(/:\s/);
  const title = /^['‘]([^'’]{8,})['’]/.exec(rest.join(": "));
  return title ? `‘${title[1]}’` : head.trim().length >= 12 ? head.trim() : best.s;
};
