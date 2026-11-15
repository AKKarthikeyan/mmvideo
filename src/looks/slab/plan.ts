// Slab look: the story plan, computed once per story from LookData (pure, no DOM, no fonts).
//   segs     a script line cut into words and printed numbers (each number a LookNum, so it is drawn only from its lock)
//   poster   hook and say lines grouped into anchor rows (at most 4-5 words each), the hero pulled out to its own board
//   rail     the carried object: one bar rail per unit (t, %, ₹, cr...) at one scale for the whole story. An earlier value
//            of the unit comes back as a dashed ghost only where the script relates the two (related() below)
//   recaps   a say without a number recaps the story's own figures it names, on that same scale
//   devices  ratio tiles (N×), tally (9 of 11), duration (10 years), stack (parts that add up to the big), inset (slivers)
//   shots    slab colour per beat (never the same twice running), wipe direction, hook / fact / say / end archetypes,
//            all seeded by the story id so two stories never share a layout sequence
import type {ColorRole} from "../brands/types";
import type {LookBeat, LookData, LookNum} from "../shared/types";
import {pickOf, rng} from "./kit";
import {qualOf} from "./prep";

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
  let pill: string | null = qualOf(hero) || null;
  if (hero && pre.length === 1 && pre[0].line === heroLine && wordsIn(pre[0].fr) === 1 && pre[0].fr.length === 1 && !pre[0].fr[0].hot) {
    pill = [pre[0].fr[0].t, pill].filter(Boolean).join(" ");
    pre.length = 0;
  }
  const clean = (xs: {fr: Seg[]}[]) => mergeRows(xs.map((x) => x.fr.map((s, i) => i === 0 ? {...s, sp: false} : s)).filter(meaningful));
  return {kicker, top: clean(pre), hero, pill, post: clean(post)};
};

// ---------- the carried rail ----------
// rows    the beat's own bars (or its big alone), one unit key
// ghost   an earlier value of the same unit, drawn dashed, ONLY when the script itself relates the two (see related())
// share   an unsigned percentage of a whole: drawn on a 0-100 track (755 px = 100), never on its own maximum
// unitAdd the big's word unit when the bars print only "₹1.13" (fm04: the bars are lakh crore, as the big says)
export type RailRow = {name: string; num: LookNum; v: number; key: string; beat: number};
export type RailBeat = {rows: RailRow[]; ghost: RailRow | null; ghostName: string; ghostSrc: string; scale: number; stack: boolean; inset: boolean; key: string;
  share: boolean; unitAdd: string; recap?: boolean};
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

// Two beats of one unit are related only when the script itself puts them side by side:
//   (a) a fact's bars print a value of each (gd01 'Homes vs US' prints 25,000 t and 8,134 t)
//   (b) a hook or say prints a hero equal to a value of each (cw01 'at ₹10': Campa and the reply)
//   (c) the same measure: the two kickers or the two decks are the same once numbers and dates are taken out
//       (fm03 'DHANTERAS 2025 · 18 OCT' and 'DHANTERAS 2024 · 29 OCT'; fm02 'Nifty 50, Muhurat 2022' and '... 2017')
//   (d) a say's 'over N×' compares the story's first value with the latest one, and the data bear it out
// Anything else (fm05's gift limit against the employer and cash rules, fm04's returned claims against unclaimed
// insurance) is never drawn on one rail.
const STRIP = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b|[^a-z ]+/gi;
const measureOf = (s?: string | null) => (s ?? "").toLowerCase().replace(STRIP, " ").replace(/\s+/g, " ").trim();
const texts = (rows: RailRow[]) => rows.map((r) => r.num.text);
const primaryOf = (L: LookData, rows: RailRow[]) => { const bj = L.beats[rows[0].beat]; return rows.find((r) => bj.big && r.num.text === bj.big.text) ?? rows[0]; };

const relations = (L: LookData, all: RailRow[][]) => {
  const rel = new Set<string>();
  const add = (i: number, j: number) => { rel.add(`${i}:${j}`); rel.add(`${j}:${i}`); };
  for (let i = 0; i < all.length; i++) for (let j = 0; j < i; j++) {
    if (!all[i].length || !all[j].length || all[i][0].key !== all[j][0].key) continue;
    const ti = texts(all[i]), tj = texts(all[j]);
    const bars = L.beats.some((b) => b.kind === "fact" && b.barsL.length >= 2 && ti.some((x) => b.barsL.some((r) => r.num?.text === x)) && tj.some((x) => b.barsL.some((r) => r.num?.text === x)) && b.i !== i);
    const hero = L.beats.some((b) => ["spot", "say", "hook"].includes(b.kind) && b.hero && ti.includes(b.hero.text) && tj.includes(b.hero.text));
    const bi = L.beats[i], bj = L.beats[j];
    const same = (!!measureOf(bi.kicker) && measureOf(bi.kicker) === measureOf(bj.kicker)) || (!!measureOf(bi.text) && measureOf(bi.text) === measureOf(bj.text));
    if (bars || hero || same) add(i, j);
  }
  // (d) say "over 25×": the story's first value of a unit against the latest fact of that unit before the say
  L.beats.forEach((b, s) => {
    const h = b.hero;
    if (b.kind !== "say" || !h || !isRatio(h)) return;
    for (let j = s - 1; j >= 0; j--) {
      if (!all[j].length) continue;
      const a = all.findIndex((r) => r.length && r[0].key === all[j][0].key);
      if (a < j && Math.abs(primaryOf(L, all[a]).v) / Math.abs(primaryOf(L, all[j]).v) >= h.value) add(a, j);
      return;
    }
  });
  return (i: number, j: number) => rel.has(`${i}:${j}`);
};

export const railPlan = (L: LookData): (RailBeat | null)[] => {
  const all = L.beats.map(rowsOf);
  const rel = relations(L, all);
  // an unsigned percentage (no + or − printed anywhere in the unit) is a share of a whole: 0-100 track
  const shareKey = (key: string) => key === "%" && all.flat().filter((r) => r.key === key).every((r) => r.num.sign === "" && r.v > 0 && r.v <= 100);
  return L.beats.map((b, i) => {
    const rows = all[i];
    if (!rows.length) return null;
    const key = rows[0].key;
    const prev = all.map((_, j) => j).filter((j) => j < i && all[j].length && all[j][0].key === key && rel(i, j));
    const later = all.some((r, j) => j > i && r.length && r[0].key === key && rel(i, j));
    let g = prev.length ? primaryOf(L, all[prev[0]]) : null;
    if (g && rows.some((r) => r.num.text === g!.num.text && r.name.toLowerCase() === g!.name.toLowerCase())) g = null;
    const big = b.big;
    const sameSign = rows.every((r) => Math.sign(r.v) === Math.sign(rows[0].v));
    const stack = rows.length >= 2 && sameSign && !!big && keyOf(big) === key && Math.abs(rows.reduce((s, r) => s + r.v, 0) - vOf(big)) <= 0.005 * Math.abs(vOf(big));
    // a stack's threshold marker: the value of the beat just before it, when that beat was the same unit alone (fm05's limit)
    if (stack && !g && i > 0 && all[i - 1].length === 1 && all[i - 1][0].key === key) g = all[i - 1][0];
    if (rows.length < 2 && !g && !later) return null;
    const ab = g ? L.beats[g.beat] : null;
    const ghostName = g && ab ? (ab.barsL.length && ab.name && ab.barsL[0].name !== ab.name ? ab.name : g.name) : "";
    const ghostSrc = g && ab && ab.src !== b.src ? ab.src : "";
    const scale = Math.max(...rows.map((r) => Math.abs(r.v)), g ? Math.abs(g.v) : 0) || 1;
    const inset = !!g && !stack && rows.every((r) => Math.abs(r.v) / scale < 0.06);
    const unitAdd = big && !big.unit.trim().match(/^[%×]?$/) && rows.every((r) => r.num.unit.trim() === "" && r.num.prefix === big.prefix) &&
      rows.some((r) => r.num.digits === big.digits) ? big.unit : "";
    return {rows, ghost: g, ghostName, ghostSrc, scale: stack ? Math.max(Math.abs(vOf(big!)), g ? Math.abs(g.v) : 0) : scale, stack, inset, key,
      share: shareKey(key), unitAdd};
  });
};

// A say without a number recaps the story's own figures it talks about (all printed and said in earlier beats): rows
// whose name the say's words name, the main figure of a fact the say names (fm03 'Diwali'), then the rest of those facts
// and facts whose kicker or deck the say's words name. One unit (the one the say names most), at most 4 rows, drawn at
// the story's shared scale for that unit.
const STOP = new Set("the a an and or of in on at to for by is was are were its it as than then from with not no own all one two three four five six seven eight nine ten every year years each about over under more most less india india's this that their day your you our we they them what which who".split(" "));
const wordsOf = (s?: string | null) => new Set((s ?? "").toLowerCase().replace(/\*/g, "").split(/[^a-z]+/).filter((w) => w.length > 2 && !STOP.has(w)).map((w) => w.replace(/s$/, "")));
export const recapOf = (L: LookData, rails: (RailBeat | null)[], i: number): RailBeat | null => {
  const b = L.beats[i];
  if (b.kind !== "say" || b.hero) return null;
  const sw = wordsOf((b.lines ?? []).join(" "));
  const hit = (s?: string | null) => [...wordsOf(s)].some((w) => sw.has(w));
  const cand: {r: RailRow; p: number}[] = [];
  for (let j = 0; j < i; j++) {
    const bj = L.beats[j];
    const rows = rails[j]?.rows ?? rowsOf(bj);
    if (bj.kind !== "fact" || !rows.length) continue;
    const strong = hit(bj.name), subj = hit(bj.kicker) || hit(bj.text);
    const prim = primaryOf(L, rows);
    rows.forEach((r) => {
      const p = hit(r.name) || (strong && r === prim) ? 0 : strong || subj ? 1 : 3;
      if (p < 3) cand.push({r, p});
    });
  }
  if (!cand.length) return null;
  const score = new Map<string, number>();
  cand.forEach((c) => score.set(c.r.key, (score.get(c.r.key) ?? 0) + (3 - c.p)));
  const key = [...score.entries()].sort((a, b2) => b2[1] - a[1])[0][0];
  const seen = new Set<string>();
  const pick: RailRow[] = [];
  for (const pri of [0, 1]) {
    if (pri > 0 && pick.length >= 2) break;
    for (const c of cand) {
      const id = `${c.r.name}|${c.r.num.text}`;
      if (c.p === pri && c.r.key === key && !seen.has(id) && pick.length < 4) { seen.add(id); pick.push(c.r); }
    }
  }
  pick.sort((a, b2) => a.beat - b2.beat);
  const share = rails.find((r) => r && r.key === key)?.share ?? false;
  const adds = [...new Set(pick.map((r) => rails[r.beat]?.unitAdd ?? ""))];
  return {rows: pick, ghost: null, ghostName: "", ghostSrc: "", scale: Math.max(...pick.map((r) => Math.abs(r.v))) || 1, stack: false, inset: false, key,
    share, unitAdd: adds.length === 1 ? adds[0] : "", recap: true};
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
export type EndArch = "stack" | "centre" | "echo";      // echo: the hook's claim and number come back above the question
// Per fact, beyond the order of its parts: where the provenance ticket sits (foot of the box, head under the chrome, or
// tail right after the last part), how the name is set (a solid block, or poster type over a thick rule), and whether a
// rail of 2-4 same-sign rows stands as columns instead of bars. Rotated per story so facts read differently.
export type TicketPos = "foot" | "head" | "tail";
export type NameStyle = "block" | "rule";
export type Shot = {i: number; kind: string; f0: number; f1: number; slab: ColorRole; slab2: ColorRole | null; dir: Dir; burst: boolean;
  arch: string; device: Device; align: "left" | "right"; ticket: TicketPos; nameStyle: NameStyle; cols: boolean};
export type Proof = {A: RailRow; Aname: string; B: RailRow; N: number};
export type Plan = {shots: Shot[]; rail: (RailBeat | null)[]; recaps: (RailBeat | null)[]; posters: (Poster | null)[]; proofs: (Proof | null)[]; hookArch: HookArch;
  signature: string};

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
  const endArch: EndArch = pickOf(r, (hookP?.hero ? ["stack", "centre", "echo"] : ["stack", "centre"]) as EndArch[]);
  const tickets: TicketPos[] = pickOf(r, [["foot", "head", "tail"], ["head", "tail", "foot"], ["tail", "foot", "head"], ["head", "foot"], ["tail", "head"]] as TicketPos[][]);
  const names: NameStyle[] = pickOf(r, [["block", "rule"], ["rule", "block"], ["block", "block", "rule"], ["rule", "rule", "block"]] as NameStyle[][]);
  const colsFirst = r() < 0.5;
  let k = 0, kf = 0, kc = 0;
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
    const isFact = b.kind === "fact";
    const rb = rail[i];
    const colsOk = isFact && devices[i] === "rail" && !!rb && !rb.stack && !rb.inset && rb.rows.length + (rb.ghost ? 1 : 0) >= 2 && rb.rows.length + (rb.ghost ? 1 : 0) <= 4 &&
      [...rb.rows, ...(rb.ghost ? [rb.ghost] : [])].every((x) => x.v > 0);
    // columns only when the tallest stands at least 40% of the unit's story-wide maximum (else they read as an empty box)
    const keyMax = Math.max(...rail.filter((x) => x && rb && x.key === rb.key).flatMap((x) => x!.rows.map((y) => Math.abs(y.v))));
    const tallOk = !!rb && Math.max(...rb.rows.map((y) => Math.abs(y.v)), rb.ghost ? Math.abs(rb.ghost.v) : 0) >= 0.4 * keyMax;
    const cols = colsOk && tallOk && (kc++ % 2 === 0) === colsFirst;
    return {i, kind: b.kind, f0: b.f0, f1: b.f1, slab: slabs[i], slab2: split, dir: dirs[i], burst: slabs[i] === "accent" && (devices[i] === "ratio" || (b.kind === "say" && !!posters[i]?.hero)),
      arch, device: devices[i], align: r() < 0.5 ? "left" : "right",
      ticket: isFact ? tickets[kf % tickets.length] : "foot", nameStyle: isFact ? names[kf++ % names.length] : "block", cols};
  });
  const signature = shots.map((s) => `${s.kind[0]}:${s.arch}:${s.slab}:${s.dir}${s.kind === "fact" ? `:${s.ticket}:${s.nameStyle}:${s.cols ? "c" : "b"}` : ""}`).join(" ");
  return {shots, rail, recaps: L.beats.map((_, i) => recapOf(L, rail, i)), posters, proofs: L.beats.map((_, i) => proofOf(L, rail, i)), hookArch, signature};
};
