// The Counter plan for one story: which object device each beat uses, the scale of every unit pile (chosen so the
// largest same-unit value in the story is 12-26 units, all piles of a unit on one scale: rupees in crore and lakh crore
// are one family), one scale per story for percentage columns, the hook's object, the cuts between beats (never the
// same cut twice running), each beat's framing and side, and the camera move on each internal bar line. Pure: it reads
// only LookData (every number is a LookNum parsed as printed) and the seed.
import type {LookBeat, LookData, LookNum} from "../shared/types";
import {findNumbers, parseNumber} from "../shared/numbers";
import {lockOf, nameLock, qualFor, safe} from "./locks";
import {rnd} from "./motion";
import type {Surface} from "./materials";

export type ObjKind = "bar" | "coin" | "token";
export type Device = "tower" | "ratio" | "rack" | "cols" | "product" | "flip" | "tally" | "bill" | "end" | "map";

// A unit family: numbers of one prefix and base unit ("₹ cr" holds crore and lakh crore), drawn on one scale.
export type Fam = {key: string; prefix: string; obj: ObjKind; per: number; max: number; layer: number};

// v: units of the family (piles), or the signed percentage (columns). q: the source's printed qualifier ("almost").
export type Item = {name: string; num: LookNum | null; v: number; hero: boolean; ghost: boolean; lockF: number; nameF: number; q: string; srcBeat: number; chg?: boolean};

export type BeatPlan = {
  dev: Device;
  fam?: Fam;
  items: Item[];                 // towers, columns, or the ratio's A and B
  copies?: number;               // ratio: how many copies of B
  range?: {lo: number; hi: number; loText: string; hiText: string; f: number};   // an estimate range from the sub (units)
  sub?: {num: LookNum | null; nums: LookNum[]; text: string; f: number};          // the sub as an old-price / note chit
  size?: string | null;          // product: printed pack size ("200 ml"), or null for an unspecified pack
  pack?: "bottle" | "packet" | "pack";
  tally?: {k: number; n: number};
  proof?: {big: number; small: number; n: number; fam: Fam; bigName: string; smallName: string; bigBeat: number};
  hook?: {src: number; items: Item[]};
  side: "left" | "right";        // which side the hero tag and kicker hang on
  hang?: "thread" | "hook";       // how the hero tag hangs: thread to its object, or from a wall nail with the kicker under it
  frame: {s: number; dx: number};   // the beat's resting framing (variety between beats)
  cut: Cut;
  moves: Move[];                 // one camera move per internal bar line
};
export type Cut = "none" | "whip" | "drop" | "paper" | "tilt" | "tear";
export type Move = {f: number; kind: "punch" | "crane" | "pull" | "push" | "pan"};

// cols: one story-wide scale for percentages. Shares (unsigned) stand on the counter from zero; changes (a printed sign)
// rise from or hang below a brass rail at zero. px: pixels per percentage point. rail: px above the counter base.
export type ColScale = {share: number; change: number; rail: number; anyNeg: boolean};
export type Plan = {beats: BeatPlan[]; fams: Record<string, Fam>; surface: Surface; cols: ColScale; story: string; liquid: "cola" | "clear"};

export const COL_H = 560;      // the tallest column (or rise + fall) in px

const baseUnit = (u: string) => {
  const t = u.trim().toLowerCase();
  if (/^lakh\s*(crore|cr)$/.test(t)) return {u: "cr", k: 1e5};
  if (/^(crore|cr)$/.test(t)) return {u: "cr", k: 1};
  if (/^tonnes?$/.test(t)) return {u: "t", k: 1};
  return {u: t, k: 1};
};
export const famKey = (n: Pick<LookNum, "prefix" | "unit">) => `${n.prefix}|${baseUnit(n.unit).u}`;
const baseVal = (n: LookNum) => Math.abs(n.value) * baseUnit(n.unit).k;
const isPct = (n: LookNum) => n.unit.trim() === "%";

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

// Gold bars only for tonnes in a gold story; rupees are plain steel coins; anything else (counts, other tonnes) paper pads.
const objFor = (n: LookNum, gold: boolean): ObjKind => {
  if (baseUnit(n.unit).u === "t" && gold) return "bar";
  if (n.prefix === "₹") return "coin";
  return "token";
};

// Every printed quantity of a fact (its bar labels; a bar label without a unit takes the big's).
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
  if (unit && baseUnit(unit).u !== baseUnit(b.big.unit).u) return null;
  if (!(lo < hi) || b.big.value < lo * 0.8 || b.big.value > hi * 1.2) return null;
  return {lo, hi, loText: m[1], hiText: m[2] + (m[3] ?? "")};
};

const VOL_RE = /(\d[\d,.]*)\s?(ml|l|litres?)\b/i, WT_RE = /(\d[\d,.]*)\s?(g|kg)\b/i;

// The short name of a fact for a label: the kicker's first part when it is short and holds no digit, else the card name.
export const shortName = (b: LookBeat) => {
  const k = (b.kicker ?? "").split(" · ")[0].trim();
  return k && k.length <= 22 && !/\d/.test(k) ? k : b.name ?? k;
};

// What a fact's big number is the value of: the bar printing the same value (the kicker may name a group, "COCONUT",
// when the big is one member, "Coconut oil"), else the kicker's first part when it holds no digit, else the card name.
export const itemName = (b: LookBeat) => {
  const big = b.big;
  const bar = big ? b.barsL.find((r) => r.num && r.num.value === big.value && r.num.prefix === big.prefix) : null;
  const k = (b.kicker ?? "").split(" · ")[0].trim();
  // a bar named by a period ("Jan-Sep 2025") is a time, not a thing: then the kicker names the thing
  if (bar && !(/\d/.test(bar.name) && k && !/\d/.test(k))) return bar.name;
  return k && !/\d/.test(k) ? k : b.name ?? k;
};

export const planStory = (L: LookData, surfaceOpt?: string): Plan => {
  const seed = L.seed;
  const story = `${L.chip} ${L.beats.map((b) => `${b.kicker ?? ""} ${b.text ?? ""}`).join(" ")}`;
  const gold = /gold/i.test(story);
  // ---- families and scales ----
  const vals: Record<string, {n: LookNum; v: number; range?: boolean; beat: number}[]> = {};
  const add = (n: LookNum | null, beat: number) => { if (n && !isPct(n) && !/×| of \d|year/.test(n.unit)) (vals[famKey(n)] ??= []).push({n, v: baseVal(n), beat}); };
  for (const b of L.beats) if (b.kind === "fact") {
    add(b.big, b.i);
    for (const q of quantities(b)) add(q.num, b.i);
    const r = rangeOf(b);
    if (r && b.big) (vals[famKey(b.big)] ??= []).push({n: b.big, v: r.hi * baseUnit(b.big.unit).k, range: true, beat: b.i});
  }
  const fams: Record<string, Fam> = {};
  for (const [key, list] of Object.entries(vals)) {
    const n0 = list.find((x) => x.n.role === "big")?.n ?? list[0].n;
    const max = Math.max(...list.map((x) => x.v));
    const per = pickPer(max);
    const layer = Math.max(14, Math.min(34, Math.floor(560 / Math.max(1, max / per))));
    fams[key] = {key, prefix: n0.prefix, obj: objFor(n0, gold), per, max, layer};
  }
  // ---- percentage columns: one scale for shares, one for changes (rise above / fall below the rail) ----
  const pcts = L.beats.flatMap((b) => b.kind === "fact" ? [b.big, ...b.barsL.map((r) => r.num)] : []).filter((n): n is LookNum => !!n && isPct(n));
  const shares = pcts.filter((n) => n.sign === ""), changes = pcts.filter((n) => n.sign !== "");
  const maxShare = Math.max(1e-6, ...shares.map((n) => n.value));
  const up = Math.max(0, ...changes.map((n) => n.value)), down = Math.max(0, ...changes.map((n) => -n.value));
  const span = Math.max(1e-6, up + down);
  const cols: ColScale = {share: COL_H / maxShare, change: COL_H / span, rail: down > 0 ? (down / span) * COL_H + 26 : 0, anyNeg: down > 0};
  const bullion = Object.values(fams).some((x) => x.obj === "bar");
  const surface: Surface = surfaceOpt === "velvet" || surfaceOpt === "teak" ? surfaceOpt : bullion ? "velvet" : "teak";

  const heroes: {i: number; fam: string; item: Item}[] = [];
  const colHeroes: {i: number; item: Item}[] = [];      // earlier change-column heroes (they stay as dashed ghosts for context)
  let factK = Math.floor(rnd(seed, "side") * 2);
  const frames = [{s: 1, dx: 0}, {s: 1.07, dx: 24}, {s: 0.95, dx: -20}];
  const plans: BeatPlan[] = L.beats.map((b) => {
    const side: "left" | "right" = b.kind === "fact" ? ((factK++) % 2 ? "right" : "left") : "left";
    const frame = b.kind === "fact" ? frames[Math.floor(rnd(seed, "frame", b.i) * frames.length)] : {s: 1, dx: 0};
    const base = {items: [] as Item[], side, frame, cut: "none" as Cut, moves: [] as Move[]};
    if (b.kind === "map" || b.kind === "mapend") return {...base, dev: "map" as Device};
    if (b.kind === "end") return {...base, dev: "end" as Device};
    if (b.kind === "say") return {...base, dev: "bill" as Device};
    if (b.kind !== "fact" || !b.big) return {...base, dev: b.kind === "fact" ? "flip" as Device : "bill" as Device};
    const big = safe(L, b, b.big)!;
    const mk = (name: string, num: LookNum, v: number, hero: boolean, ghost = false, lockF?: number): Item => {
      const n = ghost ? num : safe(L, b, num)!;
      const lf = lockF ?? n.lockF;
      return {name, num: n, v, hero, ghost, lockF: lf, nameF: ghost ? -Infinity : nameLock(L, b, name, lf), q: qualFor(L, num), srcBeat: b.i};
    };
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
      return {...base, dev: "ratio" as Device, fam, copies, items: [a, c].map((q, k) => mk(q.name, q.num, baseVal(q.num) / fam.per, k === 0))};
    }
    // percentages: columns (a share stands from zero; a change rises from or hangs below the rail)
    if (isPct(big)) {
      const list = qs.length ? qs : [{name: itemName(b), num: big}];
      const yr = (s: string) => +(/(\d{4})/.exec(s)?.[1] ?? NaN);
      const periods = list.every((q) => !isNaN(yr(q.name)));
      const ordered = periods && big.sign === "" ? [...list].sort((x, y) => yr(x.name) - yr(y.name)) : list;
      const items = ordered.slice(0, 4).map((q) => ({...mk(q.name, q.num, q.num.value, q.num.text === big.text && q.num.value === big.value), chg: q.num.sign !== ""}));
      if (!items.some((x) => x.hero)) items[0].hero = true;
      // a few columns on a scale are easier to read against the earlier hero(es): they stay as dashed outlines (same scale,
      // value tags dimmed), so a small rise sits beside the large one it is compared with. Changes only: a share beside
      // another share would read as parts of one whole market.
      const hero = items.find((x) => x.hero)!;
      let ghosts: Item[] = [];
      if (hero.chg) {
        const seen = new Set(items.map((x) => x.num?.text + "|" + x.name));
        ghosts = colHeroes.filter((h) => !seen.has(h.item.num?.text + "|" + h.item.name)).slice(-Math.min(2, 3 - items.length)).map((h) => ({...h.item, ghost: true, hero: false, lockF: Math.min(h.item.lockF, b.f0), nameF: -Infinity}));
        if (items.length >= 3) ghosts = [];
      }
      if (hero.chg) colHeroes.push({i: b.i, item: hero});
      return {...base, dev: "cols" as Device, items: [...ghosts, ...items]};
    }
    // a priced item: "₹10 for 200 ml", "₹10 new packs"
    if (big.prefix === "₹" && !qs.length && (VOL_RE.test(b.text ?? "") || WT_RE.test(b.text ?? "") || /\bpacks?\b|\bbottles?\b/i.test(b.text ?? ""))) {
      const vol = VOL_RE.exec(b.text ?? ""), wt = WT_RE.exec(b.text ?? "");
      return {...base, dev: "product" as Device, size: vol ? vol[0] : wt ? wt[0] : null, pack: vol ? "bottle" : wt ? "packet" : "pack",
        sub: b.subShown ? {num: subNums[0] ?? null, nums: subNums, text: b.subShown, f: b.lockF} : undefined};
    }
    // a quantity on a scale: unit piles (towers), a tiny one on a rack with a loupe
    const fam = fams[famKey(big)];
    if (fam && !/year/.test(big.unit)) {
      const hereKeys = new Set<string>();
      const items: Item[] = [];
      const heroQ = qs.find((q) => q.num.text === big.text || (q.num.value === big.value && q.num.prefix === big.prefix));
      const push = (it: Item) => {
        if (hereKeys.has(it.num!.text + it.name)) return;
        hereKeys.add(it.num!.text + it.name);
        items.push(it);
      };
      // earlier heroes of the same family stay on the counter as ghosts (at most two)
      const prev = heroes.filter((h) => h.fam === fam.key && h.item.num?.text !== big.text).slice(-2);
      for (const h of prev) push({...h.item, ghost: true, hero: false, lockF: Math.min(h.item.lockF, b.f0), nameF: -Infinity});
      const heroName = heroQ?.name ?? shortName(b);
      for (const q of qs) if (famKey(q.num) === fam.key && q !== heroQ && !(q.num.value === big.value)) push(mk(q.name, q.num, baseVal(q.num) / fam.per, false));
      push(mk(heroName, big, baseVal(big) / fam.per, true));
      const hero = items.find((x) => x.hero)!;
      heroes.push({i: b.i, fam: fam.key, item: hero});
      const r = rangeOf(b);
      const k = baseUnit(big.unit).k;
      const range = r ? {lo: r.lo * k / fam.per, hi: r.hi * k / fam.per, loText: r.loText, hiText: r.hiText, f: b.lockF} : undefined;
      const tiny = hero.v < 1.2 && fam.max / fam.per > 6;
      if (tiny) {
        const big0 = heroes.filter((h) => h.fam === fam.key).map((h) => h.item).sort((x, y) => y.v - x.v)[0];
        const subs = qs.filter((q) => famKey(q.num) === fam.key && q.num.value < big.value);
        const ritems: Item[] = [hero, ...subs.map((q) => mk(q.name, q.num, baseVal(q.num) / fam.per, false))];
        if (big0 && big0.num?.text !== big.text) ritems.push({...big0, ghost: true, hero: false, lockF: Math.min(big0.lockF, b.f0), nameF: -Infinity});
        return {...base, dev: "rack" as Device, fam, items: ritems, range};
      }
      const ordered = [...items.filter((x) => x.ghost), ...items.filter((x) => !x.ghost && !x.hero), ...items.filter((x) => x.hero)].slice(-4);
      return {...base, dev: "tower" as Device, fam, items: ordered, range};
    }
    return {...base, dev: "flip" as Device};
  });

  // ---- two ways to hang the hero tag, alternating down the story's tower and column beats (seeded start) ----
  let hk = Math.floor(rnd(seed, "hang") * 2);
  // (only where the objects stand low: a sign under the tag needs the room above them)
  const topPx = (p: BeatPlan) => p.dev === "tower"
    ? Math.max(...p.items.map((x) => x.v), p.range?.hi ?? 0) * p.fam!.layer
    : Math.max(...p.items.map((x) => (x.chg ?? (x.num ? x.num.sign !== "" : false)) ? cols.rail + Math.max(0, x.v) * cols.change : Math.abs(x.v) * cols.share), 250);
  plans.forEach((p) => {
    if (p.dev !== "tower" && p.dev !== "cols") return;
    p.hang = topPx(p) <= 480 && (hk++) % 2 ? "hook" : "thread";
  });

  // ---- the hook borrows the object of the fact its hero (or first line number) matches ----
  const h0 = L.beats[0];
  if (h0 && (h0.kind === "spot" || h0.kind === "hook")) {
    const want = [h0.hero, ...h0.lineNums].filter((n): n is LookNum => !!n);
    const digits = (n: LookNum) => n.digits.replace(/,/g, "");
    const hits: {i: number; n: LookNum; num: LookNum; name: string}[] = [];
    for (const n of want) {
      for (let i = 1; i < L.beats.length; i++) {
        const b = L.beats[i];
        if (b.kind !== "fact") continue;
        const cands = [...(b.big ? [{num: b.big, name: itemName(b)}] : []), ...quantities(b).map((q) => ({num: q.num, name: q.name}))];
        const hit = cands.find((c) => digits(c.num) === digits(n) && c.num.prefix === n.prefix);
        if (hit) { hits.push({i, n, num: hit.num, name: hit.name}); break; }
      }
    }
    const firstObj = plans.findIndex((p, i) => L.beats[i].kind === "fact" && ["tower", "cols", "tally", "ratio"].includes(p.dev));
    const src = hits.length ? hits[0].i : h0.hero ? -1 : firstObj;
    const sp = src >= 0 ? plans[src] : null;
    if (!sp || ["product", "flip", "bill"].includes(sp.dev)) {
      plans[0] = {...plans[0], dev: "flip", hook: {src: -1, items: []}};
    } else if (sp.dev === "cols") {
      // every hook number that names a column's value gets that column, on its own word, with the period in its name
      const items: Item[] = [];
      for (const h of hits) {
        if (plans[h.i].dev !== "cols") continue;
        const fb = L.beats[h.i];
        const group = shortName(fb);
        const name = /\d/.test(h.name) && group && !/\d/.test(group) ? `${group} · ${h.name}` : h.name;
        if (items.some((x) => x.name === name)) continue;
        const n = safe(L, h0, h.n)!;
        items.push({name, num: n, v: h.num.value, hero: h.n === h0.hero, ghost: false, lockF: n.lockF, nameF: nameLock(L, h0, name, n.lockF), q: "", srcBeat: h.i, chg: h.num.sign !== ""});
      }
      plans[0] = {...plans[0], dev: "cols", items: items.length ? items : sp.items.filter((x) => !x.ghost), hook: {src, items}};
    } else {
      // the source object without its numbers (they land in their own beat); the hook's hero is on the card
      plans[0] = {...plans[0], dev: sp.dev, fam: sp.fam, copies: sp.copies, tally: sp.tally,
        items: sp.items.filter((x) => !x.ghost).map((x) => ({...x, nameF: /\d/.test(x.name) ? Infinity : -Infinity})), hook: {src, items: []}};
    }
  }

  // ---- say: an "over N×" claim gets its proof (N copies of the small value against the big one), printed values only ----
  L.beats.forEach((b, i) => {
    if (b.kind !== "say" || !b.hero || b.hero.unit.trim() !== "×") return;
    const N = b.hero.value;
    let best: BeatPlan["proof"] | undefined;
    for (const fam of Object.values(fams)) {
      const list = (vals[fam.key] ?? []).filter((x) => x.n.role !== "text" && !x.range);
      for (const A of list) for (const C of list) {
        const r = A.v / C.v;
        if (r >= N && r < N * 1.25 && (!best || A.v > best.big * fam.per)) {
          const nm = (x: {n: LookNum; beat: number}) => {
            const fb = L.beats.find((y) => y.big?.text === x.n.text) ?? L.beats[x.beat];
            return fb.kind === "fact" ? itemName(fb) : "";
          };
          best = {big: A.v / fam.per, small: C.v / fam.per, n: Math.floor(N), fam, bigName: nm(A), smallName: nm(C), bigBeat: A.beat};
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
      if (f > b.f1 - 20) continue;
      let kind = kinds[k++ % kinds.length];
      // a tall pile has no room to grow under the tag: it gets a sideways move instead of a push
      if (p.dev === "tower" && (kind === "punch" || kind === "crane")) kind = j % 2 ? "pan" : "pull";
      if (p.dev === "ratio" && j === 1) kind = "punch";
      if (p.dev === "end") kind = "punch";
      // three or four objects across the counter (and a hook, whose framing already fills the room) cannot grow: they
      // breathe instead, a pull back on one bar line and a push back in on the next
      if (p.dev !== "end" && (p.items.length >= 3 || (i === 0 && p.hook))) kind = j % 2 ? "pull" : "push";
      p.moves.push({f, kind});
    }
  });
  const liquid = /cola|soft drink/i.test(story) ? "cola" as const : "clear" as const;
  void lockOf;
  return {beats: plans, fams, surface, cols, story, liquid};
};

export const subNumbers = (text: string) => findNumbers(text);
export const parse = parseNumber;
