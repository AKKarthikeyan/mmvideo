// The Counter plan for one story: which object device each beat uses, the unit of every unit pile (chosen so the
// largest same-unit value in the story is 12-26 units, all piles of a unit on one scale), the hook's object, the cuts
// between beats (never the same cut twice running) and the camera move on each internal bar line. Pure: it reads only
// LookData (every number is a LookNum parsed as printed) and the seed.
import type {LookBeat, LookData, LookNum} from "../shared/types";
import {findNumbers, parseNumber} from "../shared/numbers";
import {rnd} from "./motion";
import type {Surface} from "./materials";

export type ObjKind = "bar" | "coin" | "token";
export type Device = "tower" | "ratio" | "rack" | "jar" | "product" | "flip" | "tally" | "bill" | "end" | "map";

// A unit family: numbers printed with the same prefix and unit ("₹ cr", " t", "%"), drawn on one scale.
export type Fam = {key: string; prefix: string; unit: string; obj: ObjKind; per: number; perText: string; max: number; layer: number; noun: string};

export type Item = {name: string; num: LookNum | null; v: number; hero: boolean; ghost: boolean; lockF: number; nameF: number};

export type BeatPlan = {
  dev: Device;
  fam?: Fam;
  items: Item[];                 // towers, jars, or the ratio's A and B
  copies?: number;               // ratio: how many copies of B
  range?: {lo: number; hi: number; loText: string; hiText: string; f: number};   // an estimate range from the sub (units)
  jarMode?: "change" | "share";
  sub?: {num: LookNum | null; nums: LookNum[]; text: string; f: number};          // the sub as an old-price / note chit
  size?: string | null;          // product: printed pack size ("200 ml"), or null for an unspecified pack
  tally?: {k: number; n: number};
  proof?: {big: number; small: number; n: number; fam: Fam; bigName: string; smallName: string};   // say: N copies of the small value against the big one
  hook?: {src: number; items: Item[]};                 // hook: the fact beat whose object it borrows, and the items shown
  kickerF: number;               // the kicker (sign) may show from here (later when it holds a digit)
  cut: Cut;                      // how this beat cuts in
  moves: Move[];                 // one camera move per internal bar line
};
export type Cut = "none" | "whip" | "drop" | "paper" | "tilt" | "tear";
export type Move = {f: number; kind: "punch" | "crane" | "pull" | "pan"};

export type Plan = {beats: BeatPlan[]; fams: Record<string, Fam>; surface: Surface; jarMax: number; story: string};

const normUnit = (u: string) => {
  const t = u.trim().toLowerCase();
  if (/^lakh\s*(crore|cr)$/.test(t)) return "lakh cr";
  if (/^(crore|cr)$/.test(t)) return "cr";
  return t;
};
export const famKey = (n: Pick<LookNum, "prefix" | "unit">) => `${n.prefix}|${normUnit(n.unit)}`;
const isPct = (n: LookNum) => n.unit.trim() === "%";
const hasDigit = (s?: string | null) => /\d/.test(s ?? "");

// Indian digit grouping (the same in both systems up to 99,999).
export const fmtIN = (v: number, dec = 0) => {
  const s = Math.abs(v).toFixed(dec), [i, d] = s.split(".");
  const last = i.slice(-3), rest = i.slice(0, -3);
  const head = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," : "";
  return (v < 0 ? "−" : "") + head + last + (d ? "." + d : "");
};

// The unit of a pile: 1, 2, 2.5 or 5 times a power of ten, so the largest value is 12-26 units (nearest 20).
const pickPer = (max: number) => {
  let best = 1, score = Infinity;
  for (let k = -4; k <= 14; k++) for (const m of [1, 2, 2.5, 5]) {
    const per = m * 10 ** k, n = max / per;
    const s = n >= 12 && n <= 26 ? Math.abs(n - 20) : 100 + Math.min(Math.abs(n - 12), Math.abs(n - 26));
    if (s < score) { score = s; best = per; }
  }
  return best;
};
const decOf = (v: number) => { const s = String(+v.toPrecision(6)); return s.includes(".") ? s.split(".")[1].length : 0; };

const objFor = (n: LookNum, gold: boolean): ObjKind => {
  if (n.unit.trim() === "t") return gold ? "bar" : "bar";
  if (n.prefix === "₹") return "coin";
  return "token";
};
const NOUN: Record<ObjKind, string> = {bar: "BAR", coin: "COIN", token: "PAD"};

// Every printed quantity of a fact (its big and its bar labels; a bar label without a unit takes the big's), in units of
// its own family later.
const quantities = (b: LookBeat): {name: string; num: LookNum}[] => {
  const out: {name: string; num: LookNum}[] = [];
  const big = b.big;
  for (const r of b.barsL) {
    if (!r.num) continue;
    let n = r.num;
    if (!n.unit.trim() && big && big.prefix === n.prefix && big.unit.trim()) n = {...n, unit: big.unit, scale: big.scale};
    out.push({name: r.name, num: n});
  }
  return out;
};

// "X to Y" in the sub: an estimate range (same family as the big).
const rangeOf = (b: LookBeat) => {
  const m = /(\d[\d,]*(?:\.\d+)?)\s*(?:to|–|-)\s*(\d[\d,]*(?:\.\d+)?)(\s?[a-z%]+)?/i.exec(b.subShown ?? "");
  if (!m || !b.big) return null;
  const lo = parseFloat(m[1].replace(/,/g, "")), hi = parseFloat(m[2].replace(/,/g, ""));
  const unit = (m[3] ?? "").trim();
  if (unit && normUnit(unit) !== normUnit(b.big.unit)) return null;
  if (!(lo < hi) || b.big.value < lo * 0.8 || b.big.value > hi * 1.2) return null;
  return {lo, hi, loText: m[1], hiText: m[2] + (m[3] ?? "")};
};

const SIZE_RE = /(\d[\d,.]*)\s?(ml|l|g|kg)\b/i;

// The short name of a fact for a label: the kicker's first part when it is short and holds no digit, else the card name.
export const shortName = (b: LookBeat) => {
  const k = (b.kicker ?? "").split(" · ")[0].trim();
  return k && k.length <= 18 && !/\d/.test(k) ? k : b.name ?? k;
};

export const planStory = (L: LookData, surfaceOpt?: string): Plan => {
  const seed = L.seed;
  const story = `${L.chip} ${L.beats.map((b) => b.kicker ?? "").join(" ")}`;
  const gold = /gold/i.test(story);
  // ---- families and scales ----
  const vals: Record<string, {n: LookNum; v: number}[]> = {};
  const add = (n: LookNum | null) => { if (n && !isPct(n) && !/×| of \d|year/.test(n.unit)) (vals[famKey(n)] ??= []).push({n, v: Math.abs(n.value)}); };
  for (const b of L.beats) if (b.kind === "fact") {
    add(b.big);
    for (const q of quantities(b)) add(q.num);
    const r = rangeOf(b);
    if (r && b.big) (vals[famKey(b.big)] ??= []).push({n: b.big, v: r.hi});
  }
  const fams: Record<string, Fam> = {};
  for (const [key, list] of Object.entries(vals)) {
    const n0 = list.find((x) => x.n.role === "big")?.n ?? list[0].n;
    const max = Math.max(...list.map((x) => x.v));
    const per = pickPer(max);
    const obj = objFor(n0, gold);
    const maxUnits = max / per;
    const layer = Math.max(14, Math.min(34, Math.floor(560 / Math.max(1, maxUnits))));
    fams[key] = {key, prefix: n0.prefix, unit: n0.unit, obj, per, perText: `${n0.prefix}${fmtIN(per, decOf(per))}${n0.unit}`, max, layer, noun: NOUN[obj]};
  }
  // ---- jars: the largest rise in the story sets every jar's baseline ----
  const pcts = L.beats.flatMap((b) => b.kind === "fact" ? [b.big, ...b.barsL.map((r) => r.num)] : []).filter((n): n is LookNum => !!n && isPct(n));
  const signed = pcts.some((n) => n.sign !== "");
  const jarMax = Math.max(0.05, ...pcts.filter((n) => n.value > 0).map((n) => n.value / 100));
  const bullion = Object.values(fams).some((x) => x.obj === "bar") || /gold/i.test(L.chip);
  const surface: Surface = surfaceOpt === "velvet" || surfaceOpt === "teak" ? surfaceOpt : bullion ? "velvet" : "teak";

  const heroes: {i: number; fam: string; item: Item}[] = [];
  const plans: BeatPlan[] = L.beats.map((b) => {
    const base = {items: [] as Item[], kickerF: hasDigit(b.kicker) ? b.lockF : b.f0, cut: "none" as Cut, moves: [] as Move[]};
    if (b.kind === "map" || b.kind === "mapend") return {...base, dev: "map" as Device};
    if (b.kind === "end") return {...base, dev: "end" as Device};
    if (b.kind === "say") return {...base, dev: "bill" as Device};
    if (b.kind !== "fact" || !b.big) return {...base, dev: b.kind === "fact" ? "flip" as Device : "bill" as Device};
    const big = b.big;
    const nameF = (s: string, f: number) => hasDigit(s) ? Math.max(f, b.lockF) : b.f0;
    const qs = quantities(b);
    const subNums = findNumbers(b.subShown).map((p) => ({...p, role: "text" as const, lockF: b.lockF, spokenF: null, lockHow: "not-spoken" as const}));
    // a tally: "9 of 11"
    const of = /^ of (\d+)$/.exec(big.unit);
    if (of) return {...base, dev: "tally" as Device, tally: {k: big.value, n: +of[1]}};
    // a ratio: "3×" with the two values it compares
    if (big.unit.trim() === "×" && qs.length >= 2 && famKey(qs[0].num) === famKey(qs[1].num) && fams[famKey(qs[0].num)]) {
      const fam = fams[famKey(qs[0].num)];
      const [a, c] = qs[0].num.value >= qs[1].num.value ? [qs[0], qs[1]] : [qs[1], qs[0]];
      const r = a.num.value / c.num.value;
      const copies = Math.abs(r - big.value) < 0.5 ? Math.round(big.value) : Math.round(r);
      return {...base, dev: "ratio" as Device, fam, copies,
        items: [a, c].map((q, k) => ({name: q.name, num: q.num, v: q.num.value / fam.per, hero: k === 0, ghost: false, lockF: q.num.lockF, nameF: nameF(q.name, q.num.lockF)}))};
    }
    // percentages: jars (a level against last year's line, or a share of a full jar)
    if (isPct(big)) {
      const list = qs.length ? qs : [{name: b.name ?? "", num: big}];
      const yr = (s: string) => +(/(\d{4})/.exec(s)?.[1] ?? NaN);
      const periods = !signed && list.every((q) => !isNaN(yr(q.name)));
      const ordered = periods ? [...list].sort((x, y) => yr(x.name) - yr(y.name)) : list;
      const items = ordered.slice(0, 4).map((q) => ({name: q.name, num: q.num, v: q.num.value / 100, hero: q.num.text.replace(/^[+−-]/, "") === big.text.replace(/^[+−-]/, "") && q.num.value === big.value,
        ghost: false, lockF: q.num.lockF, nameF: nameF(q.name, q.num.lockF)}));
      if (!items.some((x) => x.hero)) items[0].hero = true;
      return {...base, dev: "jar" as Device, jarMode: signed ? "change" as const : "share" as const, items};
    }
    // a priced item: "₹10 for 200 ml", "₹10 new packs"
    if (big.prefix === "₹" && !qs.length && (SIZE_RE.test(b.text ?? "") || /\bpacks?\b|\bbottles?\b/i.test(b.text ?? ""))) {
      const size = SIZE_RE.exec(b.text ?? "");
      return {...base, dev: "product" as Device, size: size ? size[0] : null,
        sub: b.subShown ? {num: subNums[0] ?? null, nums: subNums, text: b.subShown, f: b.lockF} : undefined};
    }
    // a quantity on a scale: unit piles (towers), a tiny one on a rack with a loupe
    const fam = fams[famKey(big)];
    if (fam && !/year/.test(big.unit)) {
      const hereKeys = new Set<string>();
      const items: Item[] = [];
      const heroQ = qs.find((q) => q.num.text === big.text || (q.num.value === big.value && q.num.prefix === big.prefix));
      const push = (name: string, num: LookNum, hero: boolean, ghost = false, lockF = num.lockF) => {
        if (hereKeys.has(num.text + name)) return;
        hereKeys.add(num.text + name);
        items.push({name, num, v: Math.abs(num.value) / fam.per, hero, ghost, lockF, nameF: ghost ? b.f0 : nameF(name, lockF)});
      };
      // earlier heroes of the same family stay on the counter as ghosts (at most two)
      const prev = heroes.filter((h) => h.fam === fam.key && h.item.num?.text !== big.text).slice(-2);
      for (const h of prev) push(h.item.name, h.item.num!, false, true, Math.min(h.item.lockF, b.f0));
      const heroName = heroQ?.name ?? shortName(b);
      for (const q of qs) if (famKey(q.num) === fam.key && q !== heroQ && !(q.num.value === big.value)) push(q.name, q.num, false);
      push(heroName, big, true);
      const hero = items.find((x) => x.hero)!;
      heroes.push({i: b.i, fam: fam.key, item: {...hero, ghost: true}});
      const r = rangeOf(b);
      const range = r ? {lo: r.lo / fam.per, hi: r.hi / fam.per, loText: r.loText, hiText: r.hiText, f: b.lockF} : undefined;
      const tiny = hero.v < 1.2 && fam.max / fam.per > 6;
      // sub-values (a bar below the hero, e.g. "held in India") go in the loupe on a rack
      if (tiny) {
        const big0 = heroes.filter((h) => h.fam === fam.key).map((h) => h.item).sort((x, y) => y.v - x.v)[0];
        const subs = qs.filter((q) => famKey(q.num) === fam.key && q.num.value < big.value);
        const ritems: Item[] = [hero, ...subs.map((q) => ({name: q.name, num: q.num, v: q.num.value / fam.per, hero: false, ghost: false, lockF: q.num.lockF, nameF: nameF(q.name, q.num.lockF)}))];
        if (big0 && big0.num?.text !== big.text) ritems.push({...big0, ghost: true, hero: false, lockF: Math.min(big0.lockF, b.f0), nameF: b.f0});
        return {...base, dev: "rack" as Device, fam, items: ritems, range};
      }
      // ghosts go first (left), then the beat's own values with the hero last on the right... unless that crowds: keep 4
      const ordered = [...items.filter((x) => x.ghost), ...items.filter((x) => !x.ghost && !x.hero), ...items.filter((x) => x.hero)].slice(-4);
      return {...base, dev: "tower" as Device, fam, items: ordered, range};
    }
    return {...base, dev: "flip" as Device};
  });

  // ---- the hook borrows the object of the fact its hero (or first line number) matches ----
  const h0 = L.beats[0];
  if (h0 && (h0.kind === "spot" || h0.kind === "hook")) {
    const want = [h0.hero, ...h0.lineNums].filter((n): n is LookNum => !!n);
    const digits = (n: LookNum) => n.digits.replace(/,/g, "");
    const hits: {i: number; n: LookNum; num: LookNum}[] = [];
    for (const n of want) {
      for (let i = 1; i < L.beats.length; i++) {
        const b = L.beats[i];
        if (b.kind !== "fact") continue;
        const cands = [...(b.big ? [b.big] : []), ...quantities(b).map((q) => q.num)];
        const hit = cands.find((c) => digits(c) === digits(n) && c.prefix === n.prefix);
        if (hit) { hits.push({i, n, num: hit}); break; }
      }
    }
    const firstObj = plans.findIndex((p, i) => L.beats[i].kind === "fact" && ["tower", "jar", "tally", "ratio"].includes(p.dev));
    const src = hits.length ? hits[0].i : h0.hero ? -1 : firstObj;
    const sp = src >= 0 ? plans[src] : null;
    if (!sp || ["product", "flip", "bill"].includes(sp.dev)) {
      plans[0] = {...plans[0], dev: "flip", hook: {src: -1, items: []}};
    } else if (sp.dev === "jar") {
      // every hook number that names a jar's value gets that jar, landing on its own word
      const items: Item[] = [];
      for (const h of hits) {
        const p = plans[h.i];
        if (p.dev !== "jar") continue;
        const it = p.items.find((x) => x.num?.text === h.num.text) ?? p.items.find((x) => x.hero)!;
        if (!items.some((x) => x.name === it.name)) items.push({...it, num: h.n, lockF: h.n.lockF, hero: h.n === h0.hero, nameF: 0, v: h.num.value / 100});
      }
      plans[0] = {...plans[0], dev: "jar", jarMode: sp.jarMode, items: items.length ? items : sp.items, hook: {src, items}};
    } else {
      // the source object without its numbers (they land in their own beat); the hook's hero is on the card
      plans[0] = {...plans[0], dev: sp.dev, fam: sp.fam, copies: sp.copies, tally: sp.tally, items: sp.items.filter((x) => !x.ghost).map((x) => ({...x, nameF: /\d/.test(x.name) ? Infinity : 0})), hook: {src, items: []}};
    }
  }

  // ---- say: an "over N×" claim gets its proof (N copies of the small value against the big one) ----
  L.beats.forEach((b, i) => {
    if (b.kind !== "say" || !b.hero || b.hero.unit.trim() !== "×") return;
    const N = b.hero.value;
    let best: BeatPlan["proof"] | undefined;
    for (const fam of Object.values(fams)) {
      const list = (vals[fam.key] ?? []).filter((x) => x.n.role !== "text");
      for (const A of list) for (const C of list) {
        const r = A.v / C.v;
        if (r >= N && r < N * 1.25 && (!best || A.v > best.big * fam.per)) {
          const nm = (n: LookNum) => {
            const fb = L.beats.find((x) => x.big?.text === n.text);
            return (fb?.kicker ?? fb?.name ?? "").split(" · ")[0];
          };
          best = {big: A.v / fam.per, small: C.v / fam.per, n: Math.floor(N), fam, bigName: nm(A.n), smallName: nm(C.n)};
        }
      }
    }
    if (best) plans[i] = {...plans[i], proof: best};
  });

  // ---- cuts: never the same twice running ----
  const pool: Cut[] = ["whip", "drop", "paper"];
  let last: Cut = "none";
  plans.forEach((p, i) => {
    if (i === 0) { p.cut = "none"; return; }
    const prev = plans[i - 1];
    let c: Cut;
    if (p.dev === "end" && prev.dev === "bill") c = "tear";
    else if (p.dev === "bill" && !p.proof) c = "tilt";
    else if (p.dev === "map") c = "paper";
    else {
      const opts = pool.filter((x) => x !== last);
      c = opts[Math.floor(rnd(seed, "cut", i) * opts.length)];
    }
    if (c === last) c = pool.find((x) => x !== last)!;
    p.cut = c; last = c;
  });

  // ---- camera: one same-subject move on each internal bar line, from a seeded cycle ----
  const kinds: Move["kind"][] = ["punch", "crane", "pull", "pan"];
  let k = Math.floor(rnd(seed, "cam") * kinds.length);
  plans.forEach((p, i) => {
    const b = L.beats[i];
    const bars = Math.round((b.f1 - b.f0) / L.barF);
    for (let j = 1; j < bars; j++) {
      const f = Math.round(b.f0 + j * L.barF);
      if (f > b.settleF - 16) continue;
      let kind = kinds[k++ % kinds.length];
      if (p.dev === "tower" && kind === "pan") kind = "crane";
      p.moves.push({f, kind});
    }
  });
  return {beats: plans, fams, surface, jarMax, story};
};

export const subNumbers = (text: string) => findNumbers(text);
export const parse = parseNumber;
