// Slab look: one component per beat kind, each drawing inside the brand safe box (x 95-850, y 210-1480).
//   Chrome   bar ticks (one per music bar, filled on its downbeat), masthead (chip left, brand bug right), the beat's source
//   Poster   hook and say: kicker, anchor rows, the hero Board with its pill, tail rows. Archetypes poster / centre / band /
//            split / wall (no number) / marked / bands, chosen per story by seed (say with a number echoes the hook)
//   Fact     name block, Board, deck, device (rail / ratio / tally / duration), provenance ticket; layouts name-top,
//            board-top, rail-first rotate so consecutive facts differ
//   End      the question as a poster stack on the only paper slab, the last word on a block, sub with cursor, the
//            Short's own illustration (when it has one) framed, the full sources
//   MapShot  basket stories: the existing state map (shared/MapClose) on the brand's paper, chrome above
import React, {useMemo} from "react";
import {Easing, Img, staticFile} from "remotion";
import type {ColorRole, LookBrand} from "../brands/types";
import {BrandBug, bugBox} from "../shared/BrandBug";
import {fitCss, fitLines, measure} from "../shared/fit";
import {downbeat} from "../shared/grid";
import {MapClose} from "../shared/MapClose";
import {assertLocked} from "../shared/lock";
import {findNumbers} from "../shared/numbers";
import {EditorMark, markSeed} from "../shared/Marks";
import type {LookBeat, LookData, LookNum} from "../shared/types";
import {Board, boardLayout, type BoardLayout} from "./Board";
import {Cells, cellsH, Cols, colsGeo, ProofTiles, proofH, Rail, railBars, railH, RatioTiles, ratioH, type ColsGeo, type RailCtx} from "./devices";
import {CAP, ease, palOf, pickOf, rng, springAt, type Pal} from "./kit";
import {durationOf, segLine, segText, tallyOf, type Plan, type Poster, type RailBeat, type RailRow, type Seg, type Shot} from "./plan";
import {qualOf, textLock, type Spoken} from "./prep";
import {Deck, deckLayout, display, fitNatural, fullLock, monoFont, NameBlock, nameBlockH, NameRule, nameRuleH, Pill, pillH, Row, rowText, stackFit, Ticket,
  ticketLayout, up, type DeckLayout, type Fit, type RowLayout, type Stack, type TicketLayout} from "./type";

// safe: the safe-box check mode (input prop slabSafe): full-bleed decoration (grain, vignette, starburst, split and band
// slabs) is left out so any pixel outside x 95-850, y 210-1480 that differs from the ground is type that escaped the box.
export type Ctx = {L: LookData; B: LookBrand; plan: Plan; frozen: boolean; safe?: boolean; spoken: Spoken; platesOk: boolean};
const W_ = (B: LookBrand) => B.safe.x1 - B.safe.x0;
const railCtx = (C: Ctx): RailCtx => ({peers: C.plan.rail.filter(Boolean) as RailBeat[], spoken: C.spoken});
const SRC_MIN = 32;

// ---------- chrome ----------
const TICK_Y = 0, CHIP_Y = 20;
export const chromeGeo = (C: Ctx, b: LookBeat) => {
  const {B} = C;
  const W = W_(B);
  const bug = bugBox(B, 30);
  const chipSize = B.chip.size - 2;
  const mono = monoFont(B, B.chip.tracking);
  // the chip's "ESTIMATE" holds only on beats whose source names an estimate (gd01's US Treasury and RBI beats are official)
  const chip0 = C.L.chip.split(/\s*·\s*/).filter((p) => !(/^estimates?$/i.test(p.trim()) && !/estimate/i.test(b.src))).join(" · ");
  const chipText = B.chip.upper ? up(chip0) : chip0;
  const chipW = W - bug.w - 30 - 2 * B.chip.padX;
  const chipS = Math.max(20, Math.min(chipSize, Math.floor((chipW / (measure(chipText, mono, 100) / 100)) * 10) / 10));
  const rowH = Math.max(chipS + 2 * B.chip.padY, bug.h);
  const src = fitLines(b.src, monoFont(B), W, 3, 34, SRC_MIN);
  const srcY = B.safe.y0 + CHIP_Y + rowH + 12;
  const bottom = srcY + src.lines.length * Math.round(src.size * 1.3);
  return {chipText, chipS, rowH, src, srcY, bottom, bug, mono};
};

export const Chrome: React.FC<{C: Ctx; b: LookBeat; pal: Pal; f: number}> = ({C, b, pal, f}) => {
  const {B, L} = C;
  const g = chromeGeo(C, b);
  const W = W_(B);
  const nb = Math.ceil(L.frames / L.barF);
  const gap = 6, tw = (W - gap * (nb - 1)) / nb;
  return <>
    {Array.from({length: nb}, (_, k) => {
      const at = Math.round(k * L.barF);
      const on = f >= at;
      const pop = on ? springAt(f, at, {damping: 10, stiffness: 300, mass: 0.5}) : 0;
      return <div key={k} style={{position: "absolute", left: B.safe.x0 + k * (tw + gap), top: B.safe.y0 + TICK_Y, width: tw, height: 7, background: pal.ink,
        opacity: on ? 0.95 : 0.25, transform: `scaleY(${on ? 1 + 0.8 * (1 - pop) : 1})`, transformOrigin: "50% 0%"}}/>;
    })}
    <div style={{position: "absolute", left: B.safe.x0, top: B.safe.y0 + CHIP_Y + (g.rowH - g.chipS - 2 * B.chip.padY) / 2, height: g.chipS + 2 * B.chip.padY, display: "flex", alignItems: "center",
      background: pal.block.bg, color: pal.block.fg, borderRadius: B.chip.radius, padding: `0 ${B.chip.padX}px`, ...fitCss(g.mono, g.chipS)}}>{g.chipText}</div>
    {pal.slab === "accent2" && <div style={{position: "absolute", left: B.safe.x1 - g.bug.w - 22, top: B.safe.y0 + CHIP_Y - 4, width: g.bug.w + 22, height: g.rowH + 8, background: B.c.ink, borderRadius: 6}}/>}
    <BrandBug B={B} on={pal.dark || pal.slab === "accent2" ? "dark" : "light"} size={30} x={B.safe.x1 - (pal.slab === "accent2" ? 11 : 0)} y={B.safe.y0 + CHIP_Y + g.rowH} opacity={1}/>
    <div style={{position: "absolute", left: B.safe.x0, top: g.srcY, ...fitCss(monoFont(B), g.src.size), lineHeight: 1.3, color: pal.ink, opacity: 0.9}}>
      {g.src.lines.map((l, i) => <div key={i} style={{whiteSpace: "pre"}}>{l}</div>)}</div>
  </>;
};

// ---------- motion helpers ----------
// punch and a 2-frame paper flash on the beat's internal bar downbeats, never near a lock. The punch pulls the content in
// (scale 0.97 -> 1 over 6 frames) instead of pushing it out, so no word ever leaves the safe box, even for a frame.
export const internalDownbeats = (L: LookData, b: LookBeat) => {
  const out: number[] = [];
  for (let k = 1; ; k++) {
    const d = downbeat(b, k, L);
    if (d >= b.f1 - 4) break;
    if (Math.abs(d - b.lockF) >= 6 && Math.abs(d - (b.hero ? fullLock(b.hero) : b.lockF)) >= 6) out.push(d);
  }
  return out;
};
export const punchAt = (L: LookData, b: LookBeat, f: number) => {
  const ds = internalDownbeats(L, b).filter((d) => d <= f);
  if (!ds.length) return 1;
  const d = ds[ds.length - 1];
  return 1 - 0.03 * (1 - ease(f, d, d + 6, Easing.out(Easing.quad)));
};
export const flashOn = (L: LookData, b: LookBeat, f: number) => internalDownbeats(L, b).some((d) => f >= d && f < d + 2);

// When the narrator says a row's first word (snapped forward, never before the previous row), else on 8ths.
const rowTimes = (b: LookBeat, rows: Seg[][], from: number, step: number) => {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let k = 0, prev = from - 3;
  return rows.map((segs, i) => {
    const w = segs.find((s) => /[A-Za-z]/.test(s.t) && !s.num);
    // on the narrator's first word of the row, but never later than the row's 8th: the box is never left near-empty
    // while a slow line is read (the 27 Oct review: fm03's say waited 1.9 s for 'lower')
    let at = from + i * step;
    if (w && b.words.length) {
      const j = b.words.findIndex((x, xi) => xi >= k && norm(x.w) === norm(w.t));
      if (j >= 0) { k = j + 1; at = Math.min(at, Math.round(b.words[j].start * 30) - 2); }
    }
    at = Math.max(at, prev + 3, from);
    at = Math.min(at, b.settleF - 14);
    prev = at;
    return at;
  });
};

// The frame a starred word's emphasis lands: when the narrator says it (measured), else with its row.
const hotTimes = (b: LookBeat, R: RowLayout, rowAt: number) => {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return (i: number) => {
    const sg = R.segs[i];
    if (!sg?.hot || sg.num) return rowAt + i;
    const w = b.words.find((x) => norm(x.w) === norm(sg.t) && norm(sg.t).length > 0);
    return w ? Math.max(rowAt + i, Math.round(w.start * 30)) : rowAt + i;
  };
};

// A spelled small number starred in a hook or say without a printed number ('*three* years running'): drawn as that
// many cells, filled when the narrator says it. No digit is printed.
const SPELL: Record<string, number> = {two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12};
export const spelledOf = (b: LookBeat) => {
  if (b.hero) return null;
  for (const t of b.tokens) { const n = SPELL[t.text.trim().toLowerCase()]; if (n) return {n, word: t.text.trim().toLowerCase()}; }
  return null;
};
const spelledAt = (b: LookBeat, word: string) => {
  const w = b.words.find((x) => x.w.toLowerCase().replace(/[^a-z]/g, "") === word);
  return w ? Math.round(w.start * 30) : b.lockF;
};

// ---------- poster (hook and say) ----------
type PosterGeo = {kicker: {text: string; size: number; y: number} | null; top: RowLayout[]; post: RowLayout[]; pill: {text: string; size: number; y: number; x: number} | null;
  board: BoardLayout | null; boardX: number; boardY: number; heroTop: number; heroBot: number; proofY: number; note: TicketLayout | null; noteY: number; splitY: number;
  cells: {n: number; word: string; y: number} | null};

const ROW_GAP = 0.2;
export const posterGeo = (C: Ctx, s: Shot, b: LookBeat, P: Poster, top: number, bottom: number, proof: boolean): PosterGeo => {
  const {B} = C;
  const W = W_(B), x0 = B.safe.x0;
  const centre = s.arch === "centre";
  const note = b.kind === "say" && b.note ? ticketLayout(B, "", b.note, W) : null;
  const sp = spelledOf(b);
  const cellsR = sp ? cellsH(sp.n) + 60 : 0;
  const zoneBot = (note ? bottom - note.h - 30 : bottom) - cellsR;
  const kick = P.kicker ? (() => { const t = up(segText(P.kicker)); const mf = monoFont(B, 0.06); return {text: t, size: Math.max(22, Math.min(40, Math.floor(W / (measure(t, mf, 100) / 100))))}; })() : null;
  const isWall = !P.hero;
  const band = s.arch === "band" ? 70 : 0;
  const zone = zoneBot - top;
  const kH = kick ? kick.size * 1.25 + 26 : 0;
  const proofHh = proof ? proofH + 30 : 0;
  const mode = centre ? "ragged" as const : "justify" as const;
  const nw = (rows: Seg[][]) => rows.reduce((a, r) => a + r.filter((x) => x.num || /[A-Za-z]/.test(x.t)).length, 0);
  const wTop = nw(P.top) / Math.max(1, nw(P.top) + nw(P.post));
  const empty: Stack = {rows: [], fits: [], size: 0, h: 0};
  // the hero first, at the size its width allows; the rows share what height is left (by their word count); if that is
  // too little the hero gives way, never below 230 px type
  const nat = P.hero ? boardLayout(B, P.hero, W, 820, 700, {}) : null;
  for (let k = 1; k > 0.3; k *= 0.88) {
    const pillS = P.pill ? 46 : 0;
    const gTop = P.top.length && P.hero ? (s.arch === "split" ? 64 : 40) : 0;
    const board: BoardLayout | null = P.hero ? (k === 1 ? nat : boardLayout(B, P.hero, W, 820, nat!.h * k, {})) : null;
    const last = !board || board.S < 240 || k < 0.4;      // the hero cannot give more: take the rows as they come
    const gPost = P.post.length && board ? Math.max(44, 0.1 * board.S + 26) : 0;      // room for the underline under the hero
    const avail = zone - kH - band - gTop - gPost - (P.pill ? pillH(pillS) + 14 : 0) - proofHh - (board ? board.h : 0);
    if (avail < 90 && !last) continue;
    let topS: Stack, postS: Stack;
    if (isWall) {
      topS = stackFit(B, [...P.top, ...P.post], W, avail, 180, {mode, stretch: 100, maxRows: 6});
      postS = empty;
    } else {
      topS = P.top.length ? stackFit(B, P.top, W, avail * (P.post.length ? Math.max(0.3, Math.min(0.7, wTop)) : 1), 150, {mode, stretch: 100, maxRows: 3}) : empty;
      postS = P.post.length ? stackFit(B, P.post, W, avail - topS.h - (topS.h ? 10 : 0), 140, {mode, stretch: 100, maxRows: 4}) : empty;
      if (!last && ((topS.rows.length && topS.size < 96) || (postS.rows.length && postS.size < 96))) continue;
    }
    const fixed0 = kH + topS.h + gTop + (P.pill ? pillH(pillS) + 14 : 0) + postS.h + proofHh + band;
    const H = fixed0 + (board ? board.h : 0) + gPost;
    if (H > zone) continue;
    // spread what is left: a third above, the rest into the gaps between groups (at most 90 px each), the remainder below
    const free = zone - H;
    const nG = [kick && topS.rows.length, topS.rows.length && board, board && postS.rows.length, proof].filter(Boolean).length || 1;
    const extra = Math.min(90, (free * 0.45) / nG);
    let y = top + free * (isWall ? 0.4 : 0.3);
    const kicker = kick ? {...kick, y} : null;
    y += kH + (kick && topS.rows.length ? extra : 0);
    const place = (S: Stack) => S.fits.map((r, i) => {
      if (i) y += ROW_GAP * S.size;
      const xr = centre ? x0 + (W - r.w) / 2 : x0;
      const rl: RowLayout = {segs: S.rows[i], text: rowText(S.rows[i]), fit: r, x: xr, y, w: r.w};
      y += CAP * r.size;
      return rl;
    });
    const topR = place(topS);
    const splitY = topS.rows.length ? y + (gTop + (board ? extra : 0)) * 0.45 : y - 30;
    if (topS.rows.length) y += gTop + (board ? extra : 0);
    const heroTop = y;
    if (band) y += band / 2;
    const boardX = board ? (centre ? x0 + (W - board.w) / 2 : s.align === "right" ? x0 + W - board.w : x0) : x0;
    let pill = null;
    if (P.pill) {
      const pw = measure(up(P.pill), monoFont(B, 0.08), pillS) + 0.6 * pillS;
      pill = {text: P.pill, size: pillS, y, x: centre ? x0 + (W - pw) / 2 : boardX};
      y += pillH(pillS) + 14;
    }
    const boardY = y;
    if (board) y += board.h;
    if (band) y += band / 2;
    const heroBot = y;
    y += gPost + (board && postS.rows.length ? extra : 0);
    const postR = place(postS);
    const proofY = y + 30 + (proof ? extra : 0);
    return {kicker, top: topR, post: postR, pill, board, boardX, boardY, heroTop, heroBot, proofY, note, noteY: bottom - (note?.h ?? 0), splitY,
      cells: sp ? {...sp, y: (note ? bottom - note.h - 30 : bottom) - cellsH(sp.n) - 10} : null};
  }
  throw new Error(`slab: the ${b.kind} poster of ${C.L.id} does not fit the safe box`);
};

export const PosterShot: React.FC<{C: Ctx; s: Shot; b: LookBeat; f: number; top: number}> = ({C, s, b, f, top}) => {
  const {B, L, plan} = C;
  const P = plan.posters[b.i]!;
  const hook = b.i === 0;
  const pal = palOf(B, s.slab);
  const proof = !hook ? plan.proofs[b.i] : null;
  const G = useMemo(() => posterGeo(C, s, b, P, top, B.safe.y1, !!proof), [C, s, b, P, top, proof]);
  const W = W_(B), x0 = B.safe.x0;
  const step = Math.round(L.beatF / 2);
  // hook: every word has landed on frame 0 (the spec's f-13 slam), only the number waits for its word. say: rows build in
  // on 8ths (or sooner, on the narrator's word), the tail too: words around a blank board read while the number waits
  const topAt = hook ? G.top.map(() => -13) : rowTimes(b, G.top.map((r) => r.segs), b.f0 + 3, step);
  const postFrom = b.f0 + 3 + step * G.top.length;
  const postAt = hook ? G.post.map(() => -13) : rowTimes(b, G.post.map((r) => r.segs), postFrom, step);
  const bandRole: ColorRole = s.slab === "accent2" ? "ground" : "accent2";
  // split: the hook's own slab on top and slab2 below; a say mirrors it (slab2 on top, its burst slab below)
  const split = s.arch === "split" && !!s.slab2;
  const sayMirror = split && !hook;
  const p2 = s.slab2 ? palOf(B, s.slab2) : pal;
  const topPal = sayMirror ? p2 : pal;
  const heroPal: Pal = s.arch === "band" ? palOf(B, bandRole) : split ? (sayMirror ? pal : p2) : pal;
  const postPal = split ? (sayMirror ? pal : p2) : pal;
  const bandIn = hook ? 1 : ease(f, b.f0 + 2, b.f0 + 9, Easing.inOut(Easing.cubic));
  const marks = !C.frozen && P.hero && f >= P.hero.lockF + 4;
  // a note holding a number waits until the narrator has said it; one that cannot be said in this beat is not shown
  const noteAt = Math.max(Math.min(Math.max(P.hero ? fullLock(P.hero) + 15 : b.f0 + 3 + step * (G.top.length + G.post.length + 1), downbeat(b, 1, L) + 4), b.settleF - 12),
    textLock(C.spoken, b, b.note));
  const kickAt = Math.max(hook ? -13 : b.f0 + 2, textLock(C.spoken, b, G.kicker?.text));
  const tileFrom = hook ? -100 : b.f0 + 6;
  const noteBg: ColorRole = (["deep", "ink", "accent"] as ColorRole[]).find((r) => B.c[r] !== postPal.bg) ?? "deep";
  const ruleP = ease(f, hook ? -10 : b.f0 + 4, hook ? 0 : b.f0 + 12);
  return <>
    {split && !sayMirror && !C.safe && <div style={{position: "absolute", left: -80, top: G.splitY, width: 1240, height: 1920 - G.splitY + 120, background: B.c[s.slab2!],
      clipPath: hook ? undefined : `inset(0 ${(1 - bandIn) * 100}% 0 0)`}}/>}
    {sayMirror && !C.safe && <div style={{position: "absolute", left: -80, top: -120, width: 1240, height: G.splitY + 120, background: B.c[s.slab2!]}}/>}
    {s.arch === "band" && G.board && !C.safe && <div style={{position: "absolute", left: -80, top: G.heroTop, width: 1240 * bandIn, height: G.heroBot - G.heroTop, background: B.c[bandRole]}}/>}
    {s.arch === "centre" && G.board && <>
      <div style={{position: "absolute", left: x0, top: G.heroTop - 26, width: W * ruleP, height: 6, background: pal.ink}}/>
      <div style={{position: "absolute", left: x0 + W * (1 - ruleP), top: G.heroBot + 0.1 * G.board.S + 6, width: W * ruleP, height: 6, background: pal.ink}}/>
    </>}
    {G.kicker && f >= kickAt && <div style={{position: "absolute", left: x0, top: G.kicker.y, ...fitCss(monoFont(B, 0.06), G.kicker.size), lineHeight: 1.25, color: topPal.ink,
      opacity: ease(f, kickAt, kickAt + 4)}}>{G.kicker.text}</div>}
    {G.top.map((r, i) => <Row key={`t${i}`} B={B} L={r} pal={topPal} f={f} at={topAt[i]} where={`${b.kind} row`} hotAt={C.frozen ? undefined : hotTimes(b, r, topAt[i])}/>)}
    {G.pill && <Pill B={B} text={G.pill.text} x={G.pill.x} y={G.pill.y} size={G.pill.size} bg={heroPal.block.bg} fg={heroPal.block.fg} f={f} at={hook ? -10 : b.f0 + 5}/>}
    {G.board && P.hero && <>
      <Board B={B} L={G.board} x={G.boardX} y={G.boardY} pal={heroPal} f={f} style={{hero: true}} where={`${b.kind} hero`} tileFrom={tileFrom}/>
      {marks && s.arch !== "centre" && <div style={{position: "absolute", left: G.boardX + 10, top: G.boardY + G.board.h + 0.035 * G.board.S, width: G.board.w - 20, height: 10}}>
        <EditorMark kind="underline" at={P.hero.lockF + 4} dur={10} seed={markSeed(L.seed, b.i)} color={heroPal.slab === "accent2" ? B.c.accent : B.c.accent2} strokeWidth={12}>
          <div style={{width: G.board.w - 20, height: 4}}/></EditorMark></div>}
    </>}
    {G.post.map((r, i) => <Row key={`p${i}`} B={B} L={r} pal={postPal} f={f} at={postAt[i]} where={`${b.kind} row`} hotAt={C.frozen ? undefined : hotTimes(b, r, postAt[i])}/>)}
    {G.cells && <Cells n={G.cells.n} k={G.cells.n} x={x0} y={G.cells.y} W={W} h={cellsH(G.cells.n)} pal={pal} f={f} at={hook ? -13 : b.f0 + 8} fillAt={C.frozen ? 1e9 : spelledAt(b, G.cells.word)} track mode="duration"/>}
    {proof && f >= b.f0 + 8 && <ProofTiles B={B} A={proof.A} Aname={proof.Aname} Bv={proof.B} N={proof.N} x={x0} y={G.proofY} W={W} pal={postPal} f={f} at={fullLock(P.hero!) + 6} from={b.f0 + 8}/>}
    {G.note && noteAt < b.f1 - 6 && <Ticket B={B} T={G.note} x={x0} y={G.noteY} bg={B.c[noteBg]} fg={B.c.paper} hole={postPal.bg} f={f} at={noteAt}/>}
  </>;
};

// say lines without a number: wall (justified), marked (editor's marks on the starred words), bands (one band per row);
// under them the story's own figures the say talks about (plan.recaps: already printed and said), then the note ticket
type SayGeo = {rows: RowLayout[]; bands: {y: number; h: number; role: ColorRole}[]; note: TicketLayout | null; noteY: number; kicker: {text: string; size: number; y: number} | null;
  recap: RailBeat | null; recapY: number; barH: number; cells: {n: number; word: string; y: number} | null; size: number};
// the recap gives way (fewer rows, then none) when it would push the say's words under 90 px
const sayGeo = (C: Ctx, s: Shot, b: LookBeat, P: Poster, top: number, bottom: number): SayGeo => {
  const r0 = C.plan.recaps[b.i];
  // cut to two rows: the main figures of two different facts first (fs03: flights and rail), else the widest contrast
  const two = (rb: RailBeat): RailBeat => {
    const prim = rb.rows.filter((r) => { const bj = C.L.beats[r.beat]; return bj.big && bj.big.text === r.num.text; });
    const firstOf = [...new Map(prim.map((r) => [r.beat, r])).values()];
    let keep = firstOf.slice(0, 2);
    if (keep.length < 2) {
      const a0 = keep[0] ?? rb.rows[0];
      const far = rb.rows.filter((r) => r !== a0).sort((x, y) => Math.abs(y.v - a0.v) - Math.abs(x.v - a0.v))[0];
      keep = [a0, far];
    }
    return {...rb, rows: rb.rows.filter((r) => keep.includes(r))};
  };
  const tries: (RailBeat | null)[] = r0 ? [r0, ...(r0.rows.length > 2 ? [two(r0)] : []), null] : [null];
  let g: SayGeo | null = null;
  for (const rc of tries) { g = sayGeo1(C, s, b, P, top, bottom, rc); if (g.size >= 90) return g; }
  return g!;
};
const sayGeo1 = (C: Ctx, s: Shot, b: LookBeat, P: Poster, top: number, bottom: number, recap: RailBeat | null): SayGeo => {
  const {B} = C;
  const W = W_(B), x0 = B.safe.x0;
  const note = b.note ? ticketLayout(B, "", b.note, W) : null;
  const recapH = recap ? railH(B, recap, b, W, railCtx(C).peers) : 0;
  const sp = recap ? null : spelledOf(b);
  const lowH = recap ? recapH + 50 : sp ? cellsH(sp.n) + 50 : 0;
  const zoneBot = (note ? bottom - note.h - 30 : bottom) - lowH;
  const rowsSegs = [...P.top, ...P.post];
  const kick = P.kicker ? (() => { const t = up(segText(P.kicker)); const mf = monoFont(B, 0.06); return {text: t, size: Math.max(32, Math.min(44, Math.floor(W / (measure(t, mf, 100) / 100))))}; })() : null;
  const bandsMode = s.arch === "bands";
  const kH = kick ? kick.size * 1.25 + 30 : 0;
  const pad = bandsMode ? 26 : 0;
  const gapK = bandsMode ? 0 : s.arch === "marked" ? 0.34 : 0.24;
  for (let k = 1; k > 0.4; k *= 0.92) {
    const room = (zoneBot - top - kH) * k;
    const st = stackFit(B, rowsSegs, W, room - 2 * pad * 5, 200 * k, {mode: s.arch === "marked" ? "ragged" : "justify", stretch: 88, gapK, maxRows: 6});
    const H = kH + st.h + st.rows.length * 2 * pad;
    if (H > zoneBot - top) continue;
    // the recap's bars grow with the room left (up to 120 px), so the lower zone is never a thin strip
    let barH = 54, lowH2 = lowH;
    const free0 = bottom - top - (H + lowH + (note ? 30 + note.h : 0));
    if (recap && free0 > 90) {
      barH = Math.round(Math.min(120, 54 + (free0 * 0.55) / Math.max(1, railBars(recap))));
      lowH2 = railH(B, recap, b, W, railCtx(C).peers, barH) + 50;
    }
    // words, the recap and the note sit together, the group a little above the middle of the box
    const group = H + (lowH2 ? lowH2 : 0) + (note ? 30 + note.h : 0);
    let y = top + Math.max(0, (bottom - top - group) * 0.42);
    const kicker = kick ? {...kick, y} : null;
    y += kH;
    const bands: SayGeo["bands"] = [];
    const roles: ColorRole[] = s.slab === "accent2" ? ["ground", "accent"] : s.slab === "ground" ? ["accent2", "accent"] : ["accent2", "ground"];
    const rows = st.fits.map((r, i) => {
      if (i) y += gapK * st.size;
      if (bandsMode) bands.push({y, h: CAP * r.size + 2 * pad, role: i % 2 ? roles[1] : roles[0]});
      y += pad;
      const rl: RowLayout = {segs: st.rows[i], text: rowText(st.rows[i]), fit: r, x: x0, y, w: r.w};
      y += CAP * r.size + pad;
      return rl;
    });
    const recapY = y + 50;
    const noteY = note ? Math.min(bottom - note.h, y + lowH2 + 30) : 0;
    return {rows, bands, note, noteY, kicker, recap, recapY, barH, cells: sp ? {...sp, y: recapY} : null, size: st.size};
  }
  throw new Error(`slab: the say lines of ${C.L.id} do not fit`);
};

export const SayWords: React.FC<{C: Ctx; s: Shot; b: LookBeat; f: number; top: number}> = ({C, s, b, f, top}) => {
  const {B, L, plan} = C;
  const P = plan.posters[b.i]!;
  const pal = palOf(B, s.slab);
  const G = useMemo(() => sayGeo(C, s, b, P, top, B.safe.y1), [C, s, b, P, top]);
  const step = Math.round(L.beatF / 2);
  const at = rowTimes(b, G.rows.map((r) => r.segs), b.f0 + 3, step);
  const markAt = Math.min(downbeat(b, 1, L) + 2, b.settleF - 20);
  const noteAt = Math.max(Math.min(Math.max(at[at.length - 1] + 18, downbeat(b, 1, L) + 4), b.settleF - 12), textLock(C.spoken, b, b.note));
  const noteBg: ColorRole = (["deep", "ink", "accent"] as ColorRole[]).find((r) => B.c[r] !== pal.bg) ?? "deep";
  const r = rng(L.seed, 40 + b.i);
  const kinds = ["underline"] as const;
  // the marks need a colour that stands off the slab: amber on ink and maroon, maroon on amber
  const markC = s.slab === "accent2" ? B.c.accent : s.slab === "paper" ? B.c.accent : B.c.accent2;
  return <>
    {!C.safe && G.bands.map((bd, i) => <div key={i} style={{position: "absolute", left: -80, top: bd.y, width: 1240 * ease(f, at[i] - 4, at[i] + 3, Easing.inOut(Easing.cubic)), height: bd.h, background: B.c[bd.role]}}/>)}
    {G.kicker && <div style={{position: "absolute", left: B.safe.x0, top: G.kicker.y, ...fitCss(monoFont(B, 0.06), G.kicker.size), lineHeight: 1.25, color: pal.ink, opacity: ease(f, b.f0 + 2, b.f0 + 6)}}>{G.kicker.text}</div>}
    {G.rows.map((row, i) => {
      const rp = s.arch === "bands" ? palOf(B, G.bands[i].role) : pal;
      return <Row key={i} B={B} L={row} pal={rp} f={f} at={at[i]} where="say row" hotAt={hotTimes(b, row, at[i])}/>;
    })}
    {s.arch === "marked" && !C.frozen && G.rows.map((row, i) => {
      // one editor's mark per starred word, drawn on the bar-2 downbeat
      const font = display(B, row.fit.stretch);
      let x = row.x;
      return row.segs.map((sg, k) => {
        const lead = k && sg.sp ? measure(" ", font, row.fit.size) : 0;
        const w = measure(up(sg.t), font, row.fit.size);
        const left = x + lead;
        x += lead + w;
        if (!sg.hot || f < markAt) return null;
        const kind = pickOf(r, [...kinds]);
        // the mark is drawn 8 px in from the word's ends: rough strokes wander a few px and must stay in the safe box
        return <div key={`${i}-${k}`} style={{position: "absolute", left: left + 8, top: row.y - 0.08 * row.fit.size, width: w - 16, height: (CAP + 0.16) * row.fit.size}}>
          <EditorMark kind={kind} at={markAt + i * 3} dur={12} seed={markSeed(L.seed, 10 + i * 7 + k)} color={markC} strokeWidth={11} padding={10}>
            <div style={{width: w - 16, height: (CAP + 0.16) * row.fit.size}}/></EditorMark></div>;
      });
    })}
    {G.recap && <Rail B={B} rb={G.recap} b={b} x={B.safe.x0} y={G.recapY} W={W_(B)} pal={pal} f={f} R={railCtx(C)} barH={G.barH}/>}
    {G.cells && <Cells n={G.cells.n} k={G.cells.n} x={B.safe.x0} y={G.cells.y} W={W_(B)} h={cellsH(G.cells.n)} pal={pal} f={f} at={b.f0 + 8} fillAt={spelledAt(b, G.cells.word)} track mode="duration"/>}
    {G.note && noteAt < b.f1 - 6 && <Ticket B={B} T={G.note} x={B.safe.x0} y={G.noteY} bg={B.c[noteBg]} fg={B.c.paper} hole={pal.bg} f={f} at={noteAt}/>}
  </>;
};

// ---------- fact ----------
// Voiced cut (integration rule 3): the name, the Board, the device and a provenance ticket (the card's kicker). The deck
// (the card's text) and the sub are the text-led cut's, shown only when there is no narration.
type FactGeo = {name: {segs: Seg[]; fit: Fit; y: number}; board: BoardLayout; boardX: number; boardY: number; pill: {y: number; x: number} | null;
  deck: DeckLayout | null; deckY: number; devY: number; devH: number; cols: ColsGeo | null; barH: number; ticket: TicketLayout | null; ticketY: number; ticketRight: boolean;
  band: {y: number; h: number} | null};
const PILL = 46;

const factDeviceH = (C: Ctx, s: Shot, b: LookBeat) => {
  const W = W_(C.B);
  if (s.device === "rail") return railH(C.B, C.plan.rail[b.i]!, b, W, railCtx(C).peers);
  if (s.device === "ratio") return ratioH;
  if (s.device === "tally") return cellsH(tallyOf(b.big)!.of);
  if (s.device === "duration") return 90;
  return 0;
};

const factGeo = (C: Ctx, s: Shot, b: LookBeat, top0: number, bottom: number): FactGeo => {
  const {B, L} = C;
  const W = W_(B), x0 = B.safe.x0;
  const big = b.big!;
  // a name holding a number ("2025") is gated like any number: its own parsed lock if the text prints it, else the beat's lock
  const known = [...b.textNums, ...(b.big ? [b.big] : [])].filter((n) => n.text !== big.text || b.name === big.text);
  const extra = findNumbers(b.name).filter((p) => !known.some((n) => n.text === p.text))
    .map((p): LookNum => ({...p, role: "text", lockF: textLock(C.spoken, b, p.text), spokenF: null, lockHow: "not-spoken"}));
  const nameSegs = segLine(b.name ?? "", [...known, ...extra]);
  const rule = s.nameStyle === "rule";
  const nameFit = fitNatural(up(b.name ?? ""), display(B, rule ? 112 : 100), W - (rule ? 0 : 0.32 * 120), rule ? 150 : 120);
  const nameH = rule ? nameRuleH(nameFit) : nameBlockH(nameFit);
  const rb = C.plan.rail[b.i];
  let cols = s.cols && rb ? colsGeo(B, rb, b, W, railCtx(C).peers, 400) : null;
  let devH = cols ? cols.h : factDeviceH(C, s, b);
  let barH = 54;
  const tHead = b.kicker ?? "";
  const tBody = L.textLed ? b.subShown : "";
  const ticket = tHead || tBody ? ticketLayout(B, tHead, tBody, W) : null;
  const ticketH = ticket ? ticket.h : 0;
  const pos = s.ticket;
  const top = pos === "head" && ticket ? top0 + ticketH + 30 : top0;
  const pillH0 = qualOf(big) ? pillH(PILL) + 12 : 0;
  for (const withDeck of [true, false]) {
    const deck = withDeck && L.textLed && b.text ? deckLayout(B, b.text, W, 60, 44, 2) : null;
    const gaps = 34;
    const fixed = nameH + pillH0 + (deck ? deck.h + gaps : 0) + (devH ? devH + gaps + 6 : 0) + (ticket && pos !== "head" ? ticketH + gaps : 0) + gaps;
    const room = bottom - top - fixed;
    const maxS = s.device === "ratio" ? 640 : 600;
    const board = boardLayout(B, big, W, maxS, Math.min(room, s.device === "none" ? 560 : 460), {});
    if (board.S < 200 && withDeck && deck) continue;
    if (board.S < 150) throw new Error(`slab: fact ${b.name} of ${L.id} leaves only ${board.S.toFixed(0)}px for its number`);
    let free = Math.max(0, bottom - top - fixed - board.h);
    // room to spare goes to the device first: thicker bars and bigger labels, taller columns (the lower zone is never a strip)
    if (free > 60 && cols && rb) {
      const c2 = colsGeo(B, rb, b, W, railCtx(C).peers, Math.min(600, 400 + free * 0.6));
      if (c2) { free -= c2.h - cols.h; devH = c2.h; cols = c2; }
    } else if (free > 60 && s.device === "rail" && rb && !rb.stack && railBars(rb) > 0) {
      const b2 = Math.round(Math.min(railBars(rb) <= 2 ? 170 : 130, 54 + (free * 0.55) / railBars(rb)));
      const h2 = railH(B, rb, b, W, railCtx(C).peers, b2);
      free -= h2 - devH; devH = h2; barH = b2;
    }
    const order: ("name" | "board" | "deck" | "dev")[] = s.arch === "board-top" ? ["board", "name", "deck", "dev"] : s.arch === "rail-first" ? ["name", "dev", "board", "deck"] : ["name", "board", "deck", "dev"];
    const present = order.filter((k) => (k === "deck" ? !!deck : k === "dev" ? !!devH : true));
    // spread the free height into the gaps (at most 150 px each); name and board stay together
    const loose = present.slice(1).filter((k, j) => !(present[j] === "name" && k === "board") && !(present[j] === "board" && k === "name")).length + (ticket && pos !== "head" ? 1 : 0);
    const extraG = loose ? Math.min(150, (free * 0.8) / loose) : 0;
    const lead = Math.min(free * 0.15, 50);
    let y = top + lead + Math.max(0, free - extraG * loose - lead) * 0.5;
    const at: Record<string, number> = {};
    let pill: FactGeo["pill"] = null;
    present.forEach((k, j) => {
      if (k === "board" && pillH0) { pill = {y, x: 0}; y += pillH0; }
      const h = k === "name" ? nameH : k === "board" ? board.h : k === "deck" ? deck!.h : devH;
      at[k] = y;
      const nxt = present[j + 1];
      const tight = (k === "name" && nxt === "board") || (k === "board" && nxt === "name");
      y += h + gaps + (tight ? -4 : nxt ? extraG : 0);
    });
    const boardX = s.device === "ratio" ? x0 + (W - board.w) / 2 : s.align === "right" ? x0 + W - board.w : x0;
    if (pill) (pill as {x: number}).x = boardX;
    const ticketY = pos === "head" ? top0 : pos === "tail" ? Math.min(bottom - ticketH, y + extraG * 0.4) : bottom - ticketH;
    // a fact with no device and no number in its name fills its lower zone with its own name as outlined poster type
    const contentBot = Math.max(...present.map((k) => at[k] + (k === "name" ? nameH : k === "board" ? board.h : k === "deck" ? deck!.h : devH)));
    const bandTop = (pos === "tail" && ticket ? ticketY + ticketH : contentBot) + 36;
    const bandBot = pos === "foot" && ticket ? ticketY - 30 : bottom;
    const band = !devH && !/\d/.test(b.name ?? "") && bandBot - bandTop >= 180 ? {y: bandTop, h: bandBot - bandTop} : null;
    return {band, name: {segs: nameSegs, fit: nameFit, y: at.name}, board, boardX, boardY: at.board, pill, deck, deckY: at.deck ?? 0, devY: at.dev ?? 0, devH, cols, barH,
      ticket, ticketY, ticketRight: pos === "head"};
  }
  throw new Error(`slab: fact ${b.name} of ${L.id} does not fit`);
};

export const FactShot: React.FC<{C: Ctx; s: Shot; b: LookBeat; f: number; top: number}> = ({C, s, b, f, top}) => {
  const {B, L, plan} = C;
  const pal = palOf(B, s.slab);
  const G = useMemo(() => factGeo(C, s, b, top, B.safe.y1), [C, s, b, top]);
  const W = W_(B), x0 = B.safe.x0;
  const big = b.big!;
  const lockAll = fullLock(big);
  // a deck without numbers explains the board while it waits for the word; one with numbers waits for all of them
  const deckAt = b.textNums.length ? Math.min(Math.max(lockAll + 6, ...b.textNums.map((n) => n.lockF)), b.settleF - 10) : Math.min(b.f0 + 12, b.settleF - 10);
  // the ticket: on the beat's second downbeat or after the number, and never before any number it prints is said
  const ticketAt = Math.max(Math.min(b.f0 + 14, b.settleF - 10), textLock(C.spoken, b, `${b.kicker ?? ""} ${L.textLed ? b.subShown : ""}`));
  const tileFrom = b.f0 + 6;
  const tally = tallyOf(big), dur = durationOf(big);
  const q = qualOf(big);
  // the cells (or an unmarked track) stand from the beat's second beat, so the lower zone is never empty while the narrator
  // reaches the number; they show a count only when an earlier beat has already said it ("eleven" in fm02's hook)
  const said = (n: number) => C.spoken.some((x) => Math.abs(x.v - n) < 1e-9 && x.f < b.f0 + 4);
  const cellsFrom = (n: number) => Math.min(b.f0 + (said(n) ? 8 : 10), big.lockF);
  return <>
    {s.nameStyle === "rule"
      ? <NameRule B={B} segs={G.name.segs} fit={G.name.fit} x={x0} y={G.name.y} pal={pal} f={f} at={b.f0 + 3} where={`name ${b.name}`} W={W}/>
      : <NameBlock B={B} segs={G.name.segs} fit={G.name.fit} x={x0} y={G.name.y} pal={pal} f={f} at={b.f0 + 3} where={`name ${b.name}`}/>}
    {G.pill && q && <Pill B={B} text={q} x={G.pill.x} y={G.pill.y} size={PILL} bg={pal.block.bg} fg={pal.block.fg} f={f} at={b.f0 + 5}/>}
    <Board B={B} L={G.board} x={G.boardX} y={G.boardY} pal={pal} f={f} style={{hero: true}} where={`fact ${b.name}`} tileFrom={tileFrom}/>
    {G.deck && f >= deckAt && b.textNums.every((n) => (assertLocked(n, f, `deck ${b.name}`), true)) && <Deck B={B} D={G.deck} x={x0} y={G.deckY} color={pal.ink} f={f} at={deckAt} W={W} align={s.align === "right" && s.arch !== "rail-first" ? "right" : "left"}/>}
    {G.cols && <Cols B={B} rb={plan.rail[b.i]!} b={b} G={G.cols} x={x0} y={G.devY} W={W} pal={pal} f={f} R={railCtx(C)}/>}
    {!G.cols && s.device === "rail" && <Rail B={B} rb={plan.rail[b.i]!} b={b} x={x0} y={G.devY} W={W} pal={pal} f={f} R={railCtx(C)} barH={G.barH}/>}
    {s.device === "ratio" && <RatioTiles B={B} b={b} x={x0} y={G.devY} W={W} pal={pal} f={f} beatF={L.beatF}/>}
    {s.device === "tally" && tally && <Cells n={tally.of} k={tally.k} x={x0} y={G.devY} W={W} h={G.devH} pal={pal} f={f} at={cellsFrom(tally.of)} fillAt={big.lockF} track={!said(tally.of)} mode="tally"/>}
    {s.device === "duration" && dur && <Cells n={dur} k={dur} x={x0} y={G.devY} W={W} h={G.devH} pal={pal} f={f} at={cellsFrom(dur)} fillAt={big.lockF} track={!said(dur)} mode="duration"/>}
    {G.band && <NameBand B={B} text={up(b.name ?? "")} y={G.band.y} h={G.band.h} pal={pal} f={f} from={b.f0 + 6} seed={L.seed + b.i}/>}
    {G.ticket && ticketAt < b.f1 - 6 && <Ticket B={B} T={G.ticket} x={x0} y={G.ticketY} bg={B.c.paper} fg={B.c.ink} hole={pal.bg} f={f} at={ticketAt} align={G.ticketRight ? "right" : "left"} W={W}/>}
  </>;
};

// The fact's name as outlined poster type, set whole (never cropped) in one or two rows that fill the width, the second
// row fainter and drifting the other way: the lower zone of a single-number fact reads as a poster, never as an empty
// slab. No number, no new word.
const NameBand: React.FC<{B: LookBrand; text: string; y: number; h: number; pal: Pal; f: number; from: number; seed: number}> = ({B, text, y, h, pal, f, from, seed}) => {
  if (f < from) return null;
  const font = display(B, 112);
  const W = W_(B) - 16;
  const sizeW = Math.min(320, (W * 0.985) / (measure(text, font, 100) / 100));
  const rows = Math.max(1, Math.min(3, Math.floor((h + 22) / ((CAP + 0.04) * sizeW + 22))));
  const size = Math.min(sizeW, (h - (rows - 1) * 22) / rows / (CAP + 0.04));
  const used = rows * (CAP + 0.04) * size + (rows - 1) * 22;
  const p = ease(f, from, from + 10, Easing.out(Easing.cubic));
  const dir = seed % 2 ? 1 : -1;
  return <div style={{position: "absolute", left: B.safe.x0, top: y, width: W_(B), height: h, overflow: "hidden", opacity: Math.min(1, p * 2)}}>
    {Array.from({length: rows}, (_, k) => {
      const w = measure(text, font, size);
      const dx = (k % 2 ? -1 : 1) * dir * (1 - p) * 90 + Math.sin((f - from) / 40 + k) * 4;
      return <div key={k} style={{position: "absolute", left: 8 + dx, top: (h - used) / 2 + k * ((CAP + 0.04) * size + 22) + 6 - CAP_TOP_ * size, width: w, ...fitCss(font, size), lineHeight: `${size}px`, whiteSpace: "pre",
        color: "transparent", WebkitTextStroke: `3px ${pal.ink}`, opacity: k === 0 ? 0.5 : k === 1 ? 0.3 : 0.18}}>{text}</div>;
    })}
  </div>;
};
const CAP_TOP_ = 0.1025;

// ---------- end ----------
type EndGeo = {rows: RowLayout[]; lastSeg: {row: number; seg: number} | null; sub: {text: string; size: number; y: number; lines: string[]} | null; plate: {y: number; h: number} | null;
  echo: {board: BoardLayout; y: number; cap: {lines: string[]; size: number; y: number}} | null;
  src: {lines: string[]; size: number; y: number}};
const endGeo = (C: Ctx, s: Shot, b: LookBeat, top: number, bottom: number): EndGeo => {
  const {B, L} = C;
  const W = W_(B), x0 = B.safe.x0;
  const segs = segLine(b.q ?? "", b.qNums).map((sg, k) => k === 0 ? {...sg, sp: false} : sg);
  const mono = monoFont(B);
  const srcAll = L.sourceLines;
  // the full sources at the 32 px floor when they fit 470 px of height, else down to 28 (fm05's five-document list)
  let src = {lines: [] as string[], size: 32};
  for (let sz = 32; sz >= 28; sz--) {
    const lines = srcAll.flatMap((l) => fitLines(l, mono, W, 20, sz, sz).lines);
    src = {lines, size: sz};
    if (lines.length * sz * 1.3 <= 470) break;
  }
  const srcH = src.lines.length * src.size * 1.3;
  const subText = b.sub ?? "";
  // the cursor is measured as part of the last word ("_" is one mono cell, like the space it stands for), so it never wraps alone
  // one line when it fits at 36 px or more (no orphan word on a second line), else two lines down to 32 px
  const subOne = subText ? fitLines(subText + "_█", mono, W - 10, 1, 44, 36) : null;
  const subF0 = subText ? (subOne && subOne.lines.length === 1 ? subOne : fitLines(subText + "_█", mono, W - 10, 2, 44, 32)) : {size: 0, lines: [] as string[]};
  const subF = {...subF0, lines: subF0.lines.map((l) => l.replace(/_█$/, " █"))};
  const subS = subF.size;
  const subH = subText ? subF.lines.length * subS * 1.3 + 36 : 0;
  const centre = s.arch === "centre";
  // echo: the hook's number (said in the hook, so long locked) over the hook's own words in mono, above the question
  const hook0 = L.beats[0];
  const echoOn = s.arch === "echo" && !!hook0.hero;
  const echoCap = echoOn ? fitLines((hook0.lines ?? []).join(" ").replace(/\*/g, ""), mono, W, 2, 36, 32) : null;
  const echoBoard = echoOn ? boardLayout(B, hook0.hero!, W, 300, 230, {}) : null;
  const echoH = echoBoard && echoCap ? echoBoard.h + 24 + echoCap.lines.length * echoCap.size * 1.3 + 50 : 0;
  const plateOn = !!L.plate && C.platesOk;
  const room = bottom - top - srcH - 30 - echoH;
  const plateMin = plateOn ? 330 : 0;
  // the question as one stack at the largest common size; the last row stays 13 px in from each side for its block
  const st = stackFit(B, [segs], W - 26, room - subH - plateMin - 20, 230, {mode: centre ? "ragged" : "justify", stretch: 100, maxRows: 5, gapK: ROW_GAP, gain: 1.03});
  const qH = st.h;
  if (qH + subH > room) throw new Error(`slab: the end card of ${L.id} does not fit`);
  const free = room - qH - subH;
  const plate: EndGeo["plate"] = plateOn && free > 260 ? {y: 0, h: Math.min(460, free - 50)} : null;
  let y = top + (plate ? 10 : free * 0.4);
  let echo: EndGeo["echo"] = null;
  if (echoBoard && echoCap) {
    echo = {board: echoBoard, y, cap: {lines: echoCap.lines, size: echoCap.size, y: y + echoBoard.h + 24}};
    y += echoH;
  }
  const rows = st.fits.map((r, i) => {
    if (i) y += ROW_GAP * st.size;
    const last = i === st.fits.length - 1;
    const rl: RowLayout = {segs: st.rows[i], text: rowText(st.rows[i]), fit: r, x: centre ? x0 + (W - r.w) / 2 : x0 + (last ? 13 : 0), y, w: r.w};
    y += CAP * r.size;
    return rl;
  });
  y += 36;
  const sub = subText ? {text: subText, size: subS, y, lines: subF.lines.map((l, i) => i === subF.lines.length - 1 ? l.replace(/ █$/, "") : l)} : null;
  y += subText ? subF.lines.length * subS * 1.3 : 0;
  if (plate) plate.y = y + 28 + Math.max(0, (bottom - srcH - 30 - (y + 28) - plate.h) * 0.4);
  const lastRow = rows.length - 1;
  return {rows, lastSeg: {row: lastRow, seg: rows[lastRow].segs.length - 1}, sub, plate, echo, src: {...src, y: bottom - srcH}};
};

export const EndShot: React.FC<{C: Ctx; s: Shot; b: LookBeat; f: number; top: number}> = ({C, s, b, f, top}) => {
  const {B, L} = C;
  const pal = palOf(B, s.slab);
  const G = useMemo(() => endGeo(C, s, b, top, B.safe.y1), [C, s, b, top]);
  const W = W_(B), x0 = B.safe.x0;
  const step = Math.round(L.beatF / 2);
  const qPal: Pal = {...pal, ink: B.c.accent};
  const blockFg = B.c.paper;
  const cursorOn = Math.floor((f - b.f0) / Math.round(L.beatF)) % 2 === 0;
  // the sub waits for any number in it to be said (fm02's 'Sunday 8 Nov.' on 'eighth November')
  const subAt = Math.max(Math.min(b.f0 + 3 + G.rows.length * step, b.settleF - 12), textLock(C.spoken, b, G.sub?.text));
  const eAt = b.f0 + 2;
  // each row of the question lands on the narrator's first word of it (never later than its 8th)
  const rowAt = rowTimes(b, G.rows.map((r) => r.segs), b.f0 + 3, step);
  return <>
    {G.echo && L.beats[0].hero && <>
      <Board B={B} L={G.echo.board} x={x0} y={G.echo.y} pal={pal} f={f} style={{hero: true}} where="end echo"/>
      {qualOf(L.beats[0].hero) && <Pill B={B} text={qualOf(L.beats[0].hero)} x={x0 + G.echo.board.w + 16} y={G.echo.y} size={40} bg={pal.block.bg} fg={pal.block.fg} f={f} at={eAt}/>}
      <div style={{position: "absolute", left: x0, top: G.echo.cap.y, ...fitCss(monoFont(B), G.echo.cap.size), lineHeight: 1.3, color: pal.ink, opacity: ease(f, eAt, eAt + 6)}}>
        {G.echo.cap.lines.map((l, i) => <div key={i}>{l}</div>)}</div>
      <div style={{position: "absolute", left: x0, top: G.echo.cap.y + G.echo.cap.lines.length * G.echo.cap.size * 1.3 + 22, width: W * ease(f, eAt + 2, eAt + 10), height: 6, background: B.c.accent}}/>
    </>}
    {G.rows.map((r, i) => {
      const isLast = i === G.rows.length - 1;
      if (!isLast) return <Row key={i} B={B} L={r} pal={qPal} f={f} at={rowAt[i]} color={B.c.accent} hot={B.c.accent} block={null} where="end q"/>;
      // the final word as paper type on an accent block
      const segsA = r.segs.slice(0, -1), last = r.segs[r.segs.length - 1];
      const font = display(B, r.fit.stretch);
      const lead = segsA.length ? measure(rowText(segsA) + " ", font, r.fit.size) : 0;
      const lw = measure(up(last.t), font, r.fit.size);
      const at = rowAt[i];
      const p = ease(f, at + 2, at + 9, Easing.inOut(Easing.cubic));
      return <React.Fragment key={i}>
        {f >= at + 2 && <div style={{position: "absolute", left: r.x + lead - 0.06 * r.fit.size, top: r.y - 0.1 * r.fit.size, width: (lw + 0.12 * r.fit.size) * p, height: (CAP + 0.2) * r.fit.size, background: B.c.accent}}/>}
        <Row B={B} L={{...r, segs: [...segsA, {...last, hot: true}]}} pal={qPal} f={f} at={at} color={B.c.accent} hot={blockFg} block={null} where="end q"/>
      </React.Fragment>;
    })}
    {G.sub && f >= subAt && <div style={{position: "absolute", left: s.arch === "centre" ? x0 + (W - Math.max(...G.sub.lines.map((l, i) => measure(l + (i === G.sub!.lines.length - 1 ? " █" : ""), monoFont(B), G.sub!.size)))) / 2 : x0, top: G.sub.y,
      ...fitCss(monoFont(B), G.sub.size), lineHeight: 1.3, color: pal.ink, opacity: ease(f, subAt, subAt + 5)}}>
      {G.sub.lines.map((l, i) => <div key={i}>{l}{i === G.sub!.lines.length - 1 && <span style={{color: B.c.accent, opacity: cursorOn ? 1 : 0}}> █</span>}</div>)}</div>}
    {G.plate && L.plate && (() => {
      const p = ease(f, b.f0 + 8, b.f0 + 20, Easing.out(Easing.cubic));
      const drift = ease(f, b.f0, b.f1, Easing.linear);
      return <div style={{position: "absolute", left: x0, top: G.plate.y + (1 - p) * 30, width: W - 14, height: G.plate.h, border: `6px solid ${pal.ink}`, boxSizing: "border-box", overflow: "hidden",
        background: pal.bg, opacity: p, boxShadow: `14px 14px 0 ${B.c.accent}`}}>
        <Img src={staticFile(L.plate)} style={{position: "absolute", left: -20, width: W + 26, top: -(W + 26) * 1.75 * 0.555 + G.plate.h * 0.5 + 30 * drift, height: (W + 26) * 1.75, objectFit: "cover"}}/>
      </div>;
    })()}
    <div style={{position: "absolute", left: x0, top: G.src.y, ...fitCss(monoFont(B), G.src.size), lineHeight: 1.3, color: B.c.softInk, opacity: ease(f, b.f0 + 10, b.f0 + 16)}}>
      {G.src.lines.map((l, i) => <div key={i} style={{whiteSpace: "pre"}}>{l}</div>)}</div>
  </>;
};

// ---------- map (basket stories) ----------
export const MapShot: React.FC<{C: Ctx; b: LookBeat; top: number}> = ({C, b, top}) =>
  <MapClose L={C.L} B={C.B} b={b} ground="paper" top={top} reserveBottom={16}/>;

export type {LookNum, RailRow};
