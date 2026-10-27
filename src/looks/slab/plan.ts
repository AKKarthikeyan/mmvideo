// Slab look: the story plan, computed once per story from LookData (pure, no DOM, no fonts).
//   segs     a script line cut into words and printed numbers (each number a LookNum, so it is drawn only from its lock)
//   poster   hook and say lines grouped into anchor rows (at most 4-5 words each), the hero pulled out to its own board
//   rail     the carried object: one shared-scale bar rail per unit (t, %, ₹, cr...). The first value of a unit is the
//            anchor; later beats of the same unit show it as a dashed ghost, so every fact is measured against it
//   devices  ratio tiles (N×), tally (9 of 11), duration (10 years), stack (parts that add up to the big), inset (slivers)
//   shots    slab colour per beat (never the same twice running), wipe direction, hook / fact / say / end archetypes,
//            all seeded by the story id so two stories never share a layout sequence
import type {ColorRole} from "../brands/types";
import type {LookBeat, LookData, LookNum} from "../shared/types";
import {pickOf, rng} from "./kit";

// ---------- script lines -> segments ----------
export type Seg = {t: string; hot: boolean; num: LookNum | null; sp: boolean};   // sp: a space before it

const wordsIn = (segs: Seg[]) => segs.filter((s) => !s.num && /[A-Za-z]/.test(s.t)).length;
export const segText = (segs: Seg[]) => segs.map((s, i) => (i && s.sp ? " " : "") + s.t).join("");
const endsBreak = (segs: Seg[]) => /[,;:.?!]$/.test(segs[segs.length - 1]?.t ?? "");

// One line ("up *9* times in *11*,") into segments; numbers are matched by their printed text, in order, no overlaps.
export const segLine = (line: string, nums: LookNum[]): Seg[] => {
  const cs: {ch: string; hot: boolean; n: number}[] = [];
  let on = false;
  for (const ch of line) { if (ch === "*") { on = !on; continue; } cs.push({ch, hot: on, n: -1}); }
  const text = cs.map((c) => c.ch).join("");
  const used = new Set<LookNum>();
  for (const n of nums) {
    if (used.has(n)) continue;
    let from = 0;
    for (;;) {
      const i = text.indexOf(n.text, from);
      if (i < 0) break;
      const free = cs.slice(i, i + n.text.length).every((c) => c.n < 0);
      const edgeOk = (i === 0 || !/[\d.,]/.test(text[i - 1])) && !/\d/.test(text[i + n.text.length] ?? "");
      if (free && edgeOk) { for (let j = i; j < i + n.text.length; j++) cs[j].n = nums.indexOf(n); used.add(n); break; }
      from = i + 1;
    }
  }
  const out: Seg[] = [];
  let sp = false;
  for (let i = 0; i < cs.length;) {
    const c = cs[i];
    if (c.ch === " ") { sp = true; i++; continue; }
    if (c.n >= 0) {
      let j = i;
      while (j < cs.length && cs[j].n === c.n) j++;
      out.push({t: cs.slice(i, j).map((x) => x.ch).join(""), hot: c.hot, num: nums[c.n], sp});
      i = j;
    } else {
      let j = i;
      while (j < cs.length && cs[j].ch !== " " && cs[j].n < 0) j++;
      out.push({t: cs.slice(i, j).map((x) => x.ch).join(""), hot: cs.slice(i, j).some((x) => x.hot), num: null, sp});
      i = j;
    }
    sp = false;
  }
  return out;
};

export const lineNumsOf = (b: LookBeat): LookNum[] => {
  const xs = [b.hero, ...b.tokens.map((t) => t.num), ...b.lineNums, ...b.qNums].filter(Boolean) as LookNum[];
  return xs.filter((n, i) => xs.indexOf(n) === i);
};

// ---------- poster rows (hook and say) ----------
export type Poster = {kicker: Seg[] | null; top: Seg[][]; hero: LookNum | null; pill: string | null; post: Seg[][]};

const mergeRows = (frags: Seg[][]) => {
  const out: Seg[][] = [];
  for (const fr of frags) {
    const last = out[out.length - 1];
    if (last && !endsBreak(last) && wordsIn(last) + wordsIn(fr) <= 4) out[out.length - 1] = [...last, {...fr[0], sp: true}, ...fr.slice(1)];
    else out.push(fr);
  }
  return out.flatMap((r) => {
    if (wordsIn(r) <= 5) return [r];
    const k = Math.ceil(r.length / 2);
    return [r.slice(0, k), [{...r[k], sp: false}, ...r.slice(k + 1)]];
  });
};
const meaningful = (fr: Seg[]) => fr.some((s) => s.num || /[A-Za-z0-9]/.test(s.t));

export const posterOf = (b: LookBeat): Poster => {
  const nums = lineNumsOf(b);
  const lines = (b.lines ?? []).map((l) => segLine(l, nums));
  const hero = b.hero;
  let kicker: Seg[] | null = null;
  const heroLine = hero ? lines.findIndex((l) => l.some((s) => s.num === hero)) : -1;
  if (lines.length > 1 && heroLine !== 0) {
    const l0 = lines[0];
    const k = l0.findIndex((s) => /:$/.test(s.t));
    if (k >= 0 && k <= 3) { kicker = l0.slice(0, k + 1); lines[0] = l0.slice(k + 1).map((s, i) => i === 0 ? {...s, sp: false} : s); }
  }
  // fragments in reading order, the hero line cut around the hero
  const pre: {fr: Seg[]; line: number}[] = [], post: {fr: Seg[]; line: number}[] = [];
  lines.forEach((l, li) => {
    if (!l.length) return;
    const hi = l.findIndex((s) => s.num === hero && hero);
    if (hi < 0) { (heroLine < 0 || li < heroLine ? pre : post).push({fr: l, line: li}); return; }
    const a = l.slice(0, hi), z = l.slice(hi + 1).map((s, i) => i === 0 ? {...s, sp: false} : s);
    if (meaningful(a)) pre.push({fr: a, line: li});
    if (meaningful(z)) post.push({fr: z.filter((s, i) => i > 0 || /[A-Za-z0-9]/.test(s.t) || s.num), line: li});
  });
  let pill: string | null = hero?.qual.trim() || null;
  if (hero && pre.length === 1 && pre[0].line === heroLine && wordsIn(pre[0].fr) === 1 && pre[0].fr.length === 1 && !pre[0].fr[0].hot) {
    pill = [pre[0].fr[0].t, pill].filter(Boolean).join(" ");
    pre.length = 0;
  }
  const clean = (xs: {fr: Seg[]}[]) => mergeRows(xs.map((x) => x.fr.map((s, i) => i === 0 ? {...s, sp: false} : s)).filter(meaningful));
  return {kicker, top: clean(pre), hero, pill, post: clean(post)};
};

// ---------- the carried rail ----------
export type RailRow = {name: string; num: LookNum; v: number; key: string; beat: number};
export type RailBeat = {rows: RailRow[]; ghost: RailRow | null; ghostName: string; scale: number; stack: boolean; inset: boolean; key: string};
export type Device = "ratio" | "tally" | "duration" | "rail" | "none";

const keyOf = (n: LookNum) => (n.prefix + n.unit).replace(/\s+/g, "").toLowerCase().replace(/crore/g, "cr");
const vOf = (n: LookNum) => n.value * n.scale;
const isRatio = (n: LookNum | null) => !!n && /^×$/.test(n.unit.trim());
const tallyOf = (n: LookNum | null) => { const m = n ? /^\s*of\s+(\d+)$/.exec(n.unit) : null; return m && n ? {k: n.value, of: +m[1]} : null; };
const durationOf = (n: LookNum | null) => n && /^\s*years?$/.test(n.unit) && Number.isInteger(n.value) && n.value >= 1 && n.value <= 40 ? n.value : null;

const rowsOf = (b: LookBeat): RailRow[] => {
  if (b.kind !== "fact" || isRatio(b.big) || tallyOf(b.big) || durationOf(b.big)) return [];
  if (b.barsL.length) {
    const rows = b.barsL.filter((r) => r.num).map((r) => ({name: r.name, num: r.num!, v: vOf(r.num!), key: keyOf(r.num!), beat: b.i}));
    return rows.length === b.barsL.length && rows.every((r) => r.key === rows[0].key) ? rows : [];
  }
  return b.big ? [{name: b.name ?? "", num: b.big, v: vOf(b.big), key: keyOf(b.big), beat: b.i}] : [];
};

export const railPlan = (L: LookData): (RailBeat | null)[] => {
  const all = L.beats.map(rowsOf);
  const anchor = new Map<string, RailRow>();
  all.forEach((rows) => { if (rows.length && !anchor.has(rows[0].key)) anchor.set(rows[0].key, rows[0]); });
  return L.beats.map((b, i) => {
    const rows = all[i];
    if (!rows.length) return null;
    const key = rows[0].key, a = anchor.get(key)!;
    const later = all.some((r, j) => j > i && r.length && r[0].key === key);
    const ghost = a.beat < i && !rows.some((r) => r.name.toLowerCase() === a.name.toLowerCase()) ? a : null;
    if (rows.length < 2 && !ghost && !(a.beat === i && later)) return null;
    const ab = L.beats[a.beat];
    const ghostName = ghost ? (ab.barsL.length && ab.name && ab.barsL[0].name !== ab.name ? ab.name : ghost.name) : "";
    const scale = Math.max(...rows.map((r) => Math.abs(r.v)), ghost ? Math.abs(ghost.v) : 0) || 1;
    const sameSign = rows.every((r) => Math.sign(r.v) === Math.sign(rows[0].v));
    const big = b.big;
    const stack = rows.length >= 2 && sameSign && !!big && keyOf(big) === key && Math.abs(rows.reduce((s, r) => s + r.v, 0) - vOf(big)) <= 0.005 * Math.abs(vOf(big));
    const inset = !!ghost && rows.every((r) => Math.abs(r.v) / scale < 0.06);
    return {rows, ghost, ghostName, scale: stack ? Math.max(Math.abs(vOf(big!)), ghost ? Math.abs(ghost.v) : 0) : scale, stack, inset, key};
  });
};

export const deviceOf = (b: LookBeat, rail: RailBeat | null): Device => {
  if (b.kind !== "fact") return "none";
  if (isRatio(b.big) && b.barsL.length === 2 && b.barsL.every((r) => r.num) && b.barsL[1].frac * Math.round(b.big!.value) <= 1.2 && b.barsL[1].frac < 1) return "ratio";
  if (tallyOf(b.big)) return "tally";
  if (durationOf(b.big)) return "duration";
  return rail ? "rail" : "none";
};
export {tallyOf, durationOf, isRatio, vOf, keyOf};

// ---------- shots ----------
export type Dir = "up" | "down" | "left" | "right" | "cut";
export type HookArch = "poster" | "band" | "split" | "centre" | "wall";
export type SayArch = HookArch | "marked" | "bands";
export type FactArch = "name-top" | "board-top" | "rail-first";
export type EndArch = "stack" | "centre";
export type Shot = {i: number; kind: string; f0: number; f1: number; slab: ColorRole; slab2: ColorRole | null; dir: Dir; burst: boolean;
  arch: string; device: Device; align: "left" | "right"};
export type Proof = {A: RailRow; Aname: string; B: RailRow; N: number};
export type Plan = {shots: Shot[]; rail: (RailBeat | null)[]; posters: (Poster | null)[]; proofs: (Proof | null)[]; hookArch: HookArch; signature: string};

// "over 25×" in a say line: N copies of the latest fact's value inside the story's anchor, when the data bear it out
// (anchor / latest >= N, at most 60 tiles). Otherwise no proof.
const proofOf = (L: LookData, rail: (RailBeat | null)[], i: number): Proof | null => {
  const b = L.beats[i], h = b.hero;
  if (b.kind !== "say" || !h || !isRatio(h)) return null;
  for (let j = i - 1; j >= 0; j--) {
    const rb = rail[j];
    if (!rb || !rb.ghost) continue;
    const bj = L.beats[j];
    const prim = rb.rows.find((r) => bj.big && r.num.text === bj.big.text) ?? rb.rows[0];
    const N = Math.floor(h.value);
    if (N >= 2 && N <= 60 && Math.abs(rb.ghost.v) / Math.abs(prim.v) >= h.value) return {A: rb.ghost, Aname: rb.ghostName, B: prim, N};
    return null;
  }
  return null;
};

const SLABS: ColorRole[] = ["accent2", "ground", "accent"];

export const planStory = (L: LookData): Plan => {
  const r = rng(L.seed, 11);
  const rail = railPlan(L);
  const posters = L.beats.map((b) => ["spot", "say", "hook"].includes(b.kind) ? posterOf(b) : null);
  const devices = L.beats.map((b, i) => deviceOf(b, rail[i]));
  // forced slabs, then free ones that differ from both neighbours
  const forced: (ColorRole | null)[] = L.beats.map((b, i) => {
    if (b.kind === "end" || b.kind === "map" || b.kind === "mapend") return "paper";
    if (devices[i] === "ratio") return "accent";
    if (b.kind === "say" && posters[i]?.hero) return "accent";
    return null;
  });
  const hook0: ColorRole = r() < 0.62 ? "accent" : "ground";
  const slabs: ColorRole[] = [];
  L.beats.forEach((b, i) => {
    if (i === 0) { slabs.push(forced[0] ?? hook0); return; }
    if (forced[i]) { slabs.push(forced[i]!); return; }
    const next = forced[i + 1];
    const opts = SLABS.filter((s) => s !== slabs[i - 1] && s !== next);
    slabs.push(pickOf(r, opts.length ? opts : SLABS.filter((s) => s !== slabs[i - 1])));
  });
  const dirs: Dir[] = [];
  const D4: Dir[] = ["up", "left", "down", "right"];
  L.beats.forEach((b, i) => {
    if (i === 0) { dirs.push("cut"); return; }
    if (slabs[i] === slabs[i - 1]) { dirs.push("cut"); return; }
    dirs.push(pickOf(r, D4.filter((d) => d !== dirs[i - 1])));
  });
  const hookP = posters[0];
  const hookArch: HookArch = !hookP?.hero ? "wall" : pickOf(r, ["poster", "band", "split", "centre"] as HookArch[]);
  const factOrder: FactArch[] = pickOf(r, [["name-top", "board-top"], ["board-top", "name-top"], ["name-top", "rail-first", "board-top"], ["board-top", "rail-first", "name-top"]] as FactArch[][]);
  const endArch: EndArch = pickOf(r, ["stack", "centre"] as EndArch[]);
  let k = 0;
  const shots: Shot[] = L.beats.map((b, i) => {
    let arch = "";
    if (i === 0) arch = hookArch;
    else if (b.kind === "fact") {
      const dev = devices[i];
      if (dev === "ratio") arch = "ratio";
      else {
        // rail-first only when the rail compares something (not the anchor's lone first bar)
        const rb = rail[i], railOk = dev === "rail" && !!rb && (rb.rows.length > 1 || !!rb.ghost);
        let a = factOrder[k++ % factOrder.length];
        if (a === "rail-first" && !railOk) a = factOrder[k++ % factOrder.length];
        if (a === "rail-first" && !railOk) a = "name-top";
        arch = a;
      }
    } else if (b.kind === "say") arch = posters[i]?.hero ? (hookArch === "wall" ? "poster" : hookArch) : pickOf(r, ["wall", "marked", "bands"] as SayArch[]);
    else if (b.kind === "end") arch = endArch;
    else arch = b.kind;
    const split = arch === "split" ? (slabs[i] === "accent" ? "ground" : "accent") as ColorRole : null;
    return {i, kind: b.kind, f0: b.f0, f1: b.f1, slab: slabs[i], slab2: split, dir: dirs[i], burst: slabs[i] === "accent" && (devices[i] === "ratio" || (b.kind === "say" && !!posters[i]?.hero)),
      arch, device: devices[i], align: r() < 0.5 ? "left" : "right"};
  });
  const signature = shots.map((s) => `${s.kind[0]}:${s.arch}:${s.slab}:${s.dir}`).join(" ");
  return {shots, rail, posters, proofs: L.beats.map((_, i) => proofOf(L, rail, i)), hookArch, signature};
};
