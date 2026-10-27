// The source quotes a story's config carries ("quotes": [{says, text, contains}]). build_beats.py checks each "contains"
// word for word against the source text it names, so a quote is printed exactly as the source prints it (Dispatch's
// proof slip). They live in public/datayt/beats/configs/<id>.json, not in data.json, so the look reads that file at render
// time (any story id, no list to keep up): useQuotes() holds the frame with delayRender until it has the file, and a
// story without a config or without quotes simply gets none.
// FOR THE LEAD: LookData could carry these (shared/useLookData.ts) beside the other config look fields.
import {useEffect, useState} from "react";
import {continueRender, delayRender, staticFile} from "remotion";

export type Quote = {says: string; text: string[]; contains: string};

const CACHE = new Map<string, Quote[]>();
const parse = (cfg: unknown): Quote[] => {
  const qs = (cfg as {quotes?: unknown})?.quotes;
  if (!Array.isArray(qs)) return [];
  return qs.filter((q): q is Quote => !!q && typeof (q as Quote).contains === "string" && (q as Quote).contains.trim().length > 0)
    .map((q) => ({says: typeof q.says === "string" ? q.says : "", text: Array.isArray(q.text) ? q.text.map(String) : [], contains: q.contains}));
};

export const useQuotes = (id: string): Quote[] | null => {
  const [qs, setQs] = useState<Quote[] | null>(() => CACHE.get(id) ?? null);
  const [handle] = useState(() => (CACHE.has(id) ? null : delayRender(`Dispatch: quotes for ${id}`)));
  useEffect(() => {
    let live = true;
    const done = (q: Quote[]) => { CACHE.set(id, q); if (live) setQs(q); if (handle !== null) continueRender(handle); };
    if (CACHE.has(id)) { done(CACHE.get(id)!); return; }
    fetch(staticFile(`datayt/beats/configs/${id}.json`)).then((r) => (r.ok ? r.json() : null)).then((cfg) => done(parse(cfg)), () => done([]));
    return () => { live = false; };
  }, [id, handle]);
  return qs;
};

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
