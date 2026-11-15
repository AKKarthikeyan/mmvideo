// Fix This Answer scene kinds (CONTRACT_FTA.md), drawn in look B with the answer-video kit (../pyq/kit.tsx):
//   fta_page      the answer on the ruled booklet, diagnosed and repaired in place (write, ring, gap, strike, remove, insert, status, note, count)
//   fta_transfer  the fresh question that needs the same repair, the skill, the limits and the self-check list
// Text and numbers come from research/upsc/fta/<id>/fta.py through scripts/upsc/fta_storyboard.py, which number-locks them.
// Every motion is a smooth function of f (30 fps logical frames, fractional at 60 fps).
import React from "react";
import {AbsoluteFill} from "remotion";
import type {SceneProps} from "../../cartoon/long/contract";
import {PaperFinish, SANS, SERIF, cardStyle, clamp, eo, prog, rng} from "../kit";
import {Desk, HAND, Hand, HandU, INK, PENCIL, RED, handWidth, paper, wrap} from "../pyq/kit";

const AMBER = "#b8641e", GREEN = "#3f7a2a";
const vis = (t: string) => t.replace(/_/g, "");
const markW = (t: string, s: number) => handWidth(vis(t), s);
const wordsOf = (t: string) => vis(t).split(/\s+/).filter((w) => /[A-Za-z0-9₹]/.test(w)).length;

type Item = {id: string; kind: "orig" | "new" | "head"; text: string};
type Op = {op: "write" | "stamp" | "ring" | "gap" | "strike" | "remove" | "insert" | "status" | "note" | "count"; key: string; ids?: string[]; id?: string; to?: string; note?: string};
type Note = {kind: "diag" | "gap" | "rubric"; title: string; tag: string; text: string};
type PageSpec = {stamp: string; items: Item[]; demands: {id: string; label: string}[]; budget: [number, number]; minutes: number;
  notes: Record<string, Note>; ops0: Op[]; ops: Op[]};

const PAGE = {x: 110, y: 60, w: 1130, h: 990}, INNER = {x: 120, w: 960}, TOP = 116, VIEW_H = 820, LH = 50, SIZE = 31, GAP = 10, IND = 34;
const SPEED = {write: 3.2, insert: 1.25};     // characters per logical frame

type Row = {text: string; indent: number; u0: boolean; w: number; units: number};
const rowsOf = (it: Item): Row[] => {
  if (it.kind === "head") return wrap(vis(it.text), SIZE + 3, INNER.w - 40).map((l) => ({text: l, indent: 0, u0: false, w: handWidth(l, SIZE + 3) + 28, units: l.length}));
  const bullet = it.text.startsWith("•"), body = bullet ? it.text.replace(/^•\s*/, "") : it.text;
  const out: Row[] = []; let open = false;
  wrap(body, SIZE, INNER.w - (bullet ? IND : 0), markW).forEach((l, j) => {
    const tx = (bullet && j === 0 ? "• " : "") + l;
    out.push({text: tx, indent: bullet && j > 0 ? IND : 0, u0: open, w: markW(tx, SIZE) + (bullet && j > 0 ? IND : 0), units: vis(tx).length});
    if ((l.match(/_/g) || []).length % 2) open = !open;
  });
  return out;
};

/** a loop drawn by hand round a box: a little more than one turn of a rounded rectangle, slightly wobbly */
const loop = (x0: number, y0: number, x1: number, y1: number, seed: number) => {
  const r = rng(seed), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = (x1 - x0) / 2, ry = (y1 - y0) / 2, k = (v: number) => Math.sign(v) * Math.pow(Math.abs(v), 0.4);
  let d = "";
  for (let i = 0; i <= 88; i++) {
    const a = -2.4 + (i / 80) * Math.PI * 2, w = 1 + (r() - 0.5) * 0.03;
    d += `${i ? "L" : "M"}${(cx + rx * w * k(Math.cos(a))).toFixed(1)},${(cy + ry * w * k(Math.sin(a)) + i * 0.08).toFixed(1)} `;
  }
  return d;
};

export const FtaPage: React.FC<SceneProps<PageSpec>> = ({f, spec, at}) => {
  const rows = React.useMemo(() => Object.fromEntries(spec.items.map((it) => [it.id, rowsOf(it)])), [spec.items]);
  const all = [...spec.ops0.map((o) => ({...o, done: true})), ...spec.ops.map((o) => ({...o, done: false}))];
  const T = (o: Op & {done: boolean}) => (o.done ? -1e6 : at(o.key));
  // per item: start of writing, chars shown, height factor, strike progress
  const st: Record<string, {start: number; speed: number; h: number; strike: number; inserted: boolean; removed: boolean}> = {};
  for (const it of spec.items) st[it.id] = {start: -1e6, speed: 999, h: it.kind === "orig" ? 1 : 0, strike: 0, inserted: false, removed: false};
  for (const o of all) {
    const t0 = T(o);
    if (o.op === "write" || o.op === "insert") {
      let t = t0;
      for (const id of o.ids ?? []) {
        const s = st[id], units = rows[id].reduce((a, r) => a + r.units, 0), sp = o.op === "write" ? SPEED.write : SPEED.insert;
        s.start = t + (o.op === "insert" ? 8 : 0); s.speed = sp;
        if (o.op === "insert") { s.inserted = true; s.h = eo(prog(f, t, 10)); }
        t += units / sp + (o.op === "insert" ? 10 : 2);
      }
    }
    if (o.op === "strike") for (const [j, id] of (o.ids ?? []).entries()) st[id].strike = prog(f, t0 + j * 8, 10 + rows[id].length * 6);
    if (o.op === "remove") for (const id of o.ids ?? []) { st[id].removed = true; st[id].h = 1 - eo(prog(f, t0, 16)); }
  }
  const shown = (id: string) => (f - st[id].start) * st[id].speed;
  // positions: items stack; a removed item collapses, an inserted one opens
  const pos: Record<string, number> = {}; let y = 0;
  for (const it of spec.items) { pos[it.id] = y; y += (rows[it.id].length * LH + GAP) * st[it.id].h; }
  const lastLive = [...spec.items].reverse().find((it) => st[it.id].h > 0.01 && shown(it.id) > 0);
  const bottom = lastLive ? pos[lastLive.id] + rows[lastLive.id].length * LH * st[lastLive.id].h : 0;
  const scroll = Math.max(0, bottom - VIEW_H + 40);
  // words on the page (written share of each live item)
  let words = 0;
  for (const it of spec.items) {
    const u = rows[it.id].reduce((a, r) => a + r.units, 0);
    words += wordsOf(it.text) * clamp(shown(it.id) / Math.max(1, u)) * st[it.id].h;
  }
  const opOf = (kind: Op["op"]) => spec.ops.filter((o) => o.op === kind);
  const status = (id: string) => {
    let s = "none", t = -1e9;
    for (const o of all) if (o.op === "status" && o.id === id && f >= T(o) && T(o) >= t) { s = o.to!; t = T(o); }
    return s;
  };
  const stampA = all.some((o) => o.op === "stamp" && o.done) ? 1 : (() => { const o = opOf("stamp")[0]; return o ? eo(prog(f, at(o.key), 12)) : 0; })();
  const box = (ids: string[]) => {
    const y0 = Math.min(...ids.map((i) => pos[i])), y1 = Math.max(...ids.map((i) => pos[i] + rows[i].length * LH));
    const w = Math.max(...ids.flatMap((i) => rows[i].map((r) => r.w)));
    return {x0: INNER.x - 22, y0: TOP + y0 - scroll - 4, x1: INNER.x + w + 22, y1: TOP + y1 - scroll + 6};
  };
  const ring = opOf("ring")[0], ringB = ring ? box(ring.ids!) : null, ringP = ring ? eo(prog(f, at(ring.key), 20)) : 0;
  const note = opOf("note")[0], noteA = note ? eo(prog(f, at(note.key), 14)) : 0, N = note ? spec.notes[note.note!] : null;
  const count = opOf("count")[0], pulse = count ? Math.sin(clamp(prog(f, at(count.key), 40)) * Math.PI) : 0;
  const lines = Array.from({length: 22}, (_, i) => i);
  return <AbsoluteFill>
    <Desk f={f}/>
    <div style={{...paper(PAGE.x, PAGE.y, PAGE.w, PAGE.h, -0.3)}}>
      <svg width={PAGE.w} height={PAGE.h} style={{position: "absolute", inset: 0}}>
        {lines.map((i) => { const ly = TOP + i * LH - (scroll % LH) + LH - 8; return ly < PAGE.h && ly > TOP - 10 ? <line key={i} x1={0} x2={PAGE.w} y1={ly} y2={ly} stroke="#b9cde0" strokeWidth={1.4}/> : null; })}
        <line x1={96} x2={96} y1={0} y2={PAGE.h} stroke="#e2a0a0" strokeWidth={2}/>
      </svg>
      <div style={{position: "absolute", left: INNER.x - 6, top: 34, padding: "8px 16px", border: `3px solid ${RED}`, borderRadius: 4, transform: "rotate(-1.2deg)",
        fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: RED, background: "rgba(255,250,238,.9)", opacity: stampA}}>{spec.stamp}</div>
      <div style={{position: "absolute", left: 0, right: 0, top: TOP - 10, height: VIEW_H + 20, overflow: "hidden",
        WebkitMaskImage: scroll > 2 ? "linear-gradient(to bottom, transparent 0px, black 60px, black 100%)" : undefined}}>
        <div style={{position: "absolute", left: INNER.x, top: 10 - scroll, width: INNER.w + 120}}>
          {spec.items.map((it) => {
            const s = st[it.id]; if (s.h < 0.01) return null;
            let left = shown(it.id);
            const color = it.kind === "orig" ? PENCIL : INK;
            return <div key={it.id} style={{position: "absolute", top: pos[it.id], left: 0, opacity: s.removed ? s.h : clamp(s.h * 1.3), transform: `scaleY(${s.inserted || s.removed ? 0.6 + 0.4 * s.h : 1})`, transformOrigin: "top left"}}>
              {rows[it.id].map((r, j) => {
                const n = Math.max(0, Math.min(r.units, left)); left -= r.units;
                const sk = clamp(s.strike * rows[it.id].length - j);
                return <div key={j} style={{position: "absolute", top: j * LH, left: r.indent - (it.kind === "head" ? 12 : 0), height: LH - (it.kind === "head" ? 6 : 0), whiteSpace: "nowrap",
                  display: "flex", alignItems: it.kind === "head" ? "center" : "flex-end", paddingBottom: it.kind === "head" ? 0 : 6,
                  ...(it.kind === "head" ? {padding: "0 14px", border: n > 0 ? `2.5px solid ${INK}` : "none", borderRadius: 6} : {})}}>
                  {it.kind === "head" ? <Hand text={r.text} n={n} size={SIZE + 3} weight={700}/> : <HandU text={r.text} n={n} size={SIZE} u0={r.u0} color={color}/>}
                  {sk > 0 && <div style={{position: "absolute", left: -6, top: LH * 0.52, width: r.w - r.indent + 12, height: 3.5, borderRadius: 2, background: RED, transformOrigin: "left center", transform: `scaleX(${sk}) rotate(-0.4deg)`}}/>}
                </div>;
              })}
            </div>;
          })}
        </div>
      </div>
      <svg width={PAGE.w} height={PAGE.h} style={{position: "absolute", inset: 0, overflow: "visible"}}>
        {ringB && <path d={loop(ringB.x0, ringB.y0, ringB.x1, ringB.y1, 3)} fill="none" stroke={RED} strokeWidth={4.5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ringP}/>}
        {opOf("gap").map((g, i) => {
          const b = box(g.ids!), p = eo(prog(f, at(g.key), 12));
          return <g key={i} opacity={p > 0 ? 1 : 0}>
            <path d={`M${INNER.x - 30},${b.y0 + 8} L${INNER.x - 44},${b.y0 + 10} L${INNER.x - 46},${b.y1 - 8} L${INNER.x - 32},${b.y1 - 6}`} fill="none" stroke={AMBER} strokeWidth={4.5}
              strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}/>
            <text x={INNER.x - 84} y={(b.y0 + b.y1) / 2 + 16} fontFamily={HAND} fontSize={46} fontWeight={700} fill={AMBER} opacity={eo(prog(f, at(g.key) + 8, 8))}>?</text>
          </g>;
        })}
      </svg>
    </div>
    {ringB && note && <svg width={1920} height={1080} style={{position: "absolute", inset: 0}}>
      <path d={`M${PAGE.x + ringB.x1 + 6},${PAGE.y + (ringB.y0 + ringB.y1) / 2} Q ${(PAGE.x + ringB.x1 + 1300) / 2},${PAGE.y + ringB.y0 - 30} 1294,600`} fill="none" stroke={RED} strokeWidth={4}
        strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(prog(f, at(note.key) - 6, 12))}/>
    </svg>}
    <Words x={1300} y={70} words={words} budget={spec.budget} minutes={spec.minutes} pulse={pulse}/>
    <div style={{position: "absolute", left: 1300, top: 300, fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: "0.16em", color: "#f5e6cc"}}>THE THREE JOBS</div>
    {spec.demands.map((d, i) => <Job key={d.id} x={1300} y={340 + i * 74} id={d.id} label={d.label} s={status(d.id)}/>)}
    {N && <NoteCard x={1300} y={590} n={N} a={noteA}/>}
    <PaperFinish id="fta-p" vignette={0.3}/>
  </AbsoluteFill>;
};

const Words: React.FC<{x: number; y: number; words: number; budget: [number, number]; minutes: number; pulse: number}> = ({x, y, words, budget, minutes, pulse}) => (
  <div style={{position: "absolute", left: x, top: y, width: 520, padding: "18px 26px", borderRadius: 16, background: "rgba(255,250,238,.94)",
    border: `${1.5 + 2.5 * pulse}px solid rgba(${pulse > 0.05 ? "63,122,42" : "150,90,40"},${0.35 + 0.5 * pulse})`, boxShadow: "0 20px 40px -20px rgba(40,20,5,.7)", transform: `scale(${1 + 0.03 * pulse})`, transformOrigin: "left top"}}>
    <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: "0.16em", color: "#7a4a26"}}>WORDS ON THE PAGE</div>
    <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 64, color: "#3b2414", fontVariantNumeric: "tabular-nums"}}>{Math.round(words)}<span style={{fontSize: 30, color: "#8a6a4a"}}> / {budget[1]}</span></div>
    <div style={{position: "relative", height: 12, borderRadius: 6, background: "#eadcc2", overflow: "hidden"}}>
      <div style={{position: "absolute", left: `${(budget[0] / budget[1]) * 100}%`, right: 0, top: 0, bottom: 0, background: "rgba(111,143,90,.35)"}}/>
      <div style={{width: `${clamp(words / budget[1]) * 100}%`, height: "100%", background: "#6f8f5a"}}/>
    </div>
    <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 21, color: "#7a5a3a", marginTop: 10}}>Our budget: {budget[0]}–{budget[1]} words in {minutes} min</div>
  </div>
);

const STATUS: Record<string, {fill: string; stroke: string; word: string; color: string}> = {
  none: {fill: "#fffaf0", stroke: "#8a6a4a", word: "", color: "#f1dfc2"},
  miss: {fill: "#f6d8d2", stroke: RED, word: "missed", color: "#f4a493"},
  part: {fill: "#f7e3c4", stroke: AMBER, word: "partial · concept gap", color: "#f2b679"},
  ok: {fill: "#e5f0d8", stroke: GREEN, word: "covered", color: "#b9dc9c"},
};
const Job: React.FC<{x: number; y: number; id: string; label: string; s: string}> = ({x, y, id, label, s}) => {
  const c = STATUS[s] ?? STATUS.none, z = 42;
  return <div style={{position: "absolute", left: x, top: y, width: 540, display: "flex", gap: 18, alignItems: "flex-start"}}>
    <svg width={z} height={z} style={{flex: "none", marginTop: 2}}>
      <rect x={2} y={2} width={z - 4} height={z - 4} rx={6} fill={c.fill} stroke={c.stroke} strokeWidth={3}/>
      {s === "ok" && <path d={`M${z * 0.24},${z * 0.52} L${z * 0.44},${z * 0.72} L${z * 0.8},${z * 0.28}`} fill="none" stroke={GREEN} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"/>}
      {s === "miss" && <path d={`M${z * 0.3},${z * 0.3} L${z * 0.7},${z * 0.7} M${z * 0.7},${z * 0.3} L${z * 0.3},${z * 0.7}`} stroke={RED} strokeWidth={5} strokeLinecap="round"/>}
      {s === "part" && <path d={`M${z * 0.26},${z * 0.5} L${z * 0.74},${z * 0.5}`} stroke={AMBER} strokeWidth={5} strokeLinecap="round"/>}
    </svg>
    <div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 25, color: "#fbefd9", lineHeight: 1.15, textShadow: "0 2px 6px rgba(30,15,5,.7)"}}><span style={{color: "#f2b679", fontWeight: 800}}>{id}</span> {label}</div>
      {c.word && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 21, color: c.color, marginTop: 4, textShadow: "0 2px 6px rgba(30,15,5,.7)"}}>{c.word}</div>}
    </div>
  </div>;
};

const NoteCard: React.FC<{x: number; y: number; n: Note; a: number}> = ({x, y, n, a}) => {
  const col = n.kind === "diag" ? RED : n.kind === "gap" ? AMBER : "#7a4a26";
  return <div style={{...paper(x, y + (1 - a) * 24, 540, 330, n.kind === "rubric" ? 0.6 : -0.8, a), padding: "26px 30px", borderTop: `6px solid ${col}`}}>
    <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color: col}}>{n.title}</div>
    {n.tag && <div style={{display: "inline-block", marginTop: 12, padding: "4px 12px", borderRadius: 6, background: col, color: "#fffaf0", fontFamily: SANS, fontWeight: 800, fontSize: 19, letterSpacing: "0.12em"}}>{n.tag}</div>}
    <div style={{fontFamily: SERIF, fontWeight: 500, fontSize: 31, lineHeight: 1.28, color: "#2a1a10", marginTop: 14}}>{n.text}</div>
  </div>;
};

type TSpec = {label: string; credit: string; text: string; skill: string; limits: string; checks: string[]; cta: string};
export const FtaTransfer: React.FC<SceneProps<TSpec>> = ({f, spec, at}) => {
  const a = eo(prog(f, 0, 18)), q = eo(prog(f, at("q"), 16)), sk = eo(prog(f, at("sk"), 14)), lm = eo(prog(f, at("lm"), 14)), ck = eo(prog(f, at("c1"), 14)), cta = eo(prog(f, at("cta"), 14));
  return <AbsoluteFill>
    <Desk f={f}/>
    <div style={{position: "absolute", left: 110, top: 74, fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: "#cfe7b8", opacity: a, textShadow: "0 2px 6px rgba(30,15,5,.6)"}}>{spec.label}</div>
    <div style={{...paper(110, 122 + (1 - q) * 40, 1700, 330, -0.4, Math.max(0.0, q)), padding: "40px 64px"}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: "0.14em", color: "#7a4a26", borderBottom: "2px solid #d9c7a6", paddingBottom: 14}}>{spec.credit.toUpperCase()}</div>
      <div style={{fontFamily: SERIF, fontWeight: 500, fontSize: 44, lineHeight: 1.3, color: "#2a1a10", marginTop: 26}}>{spec.text}</div>
    </div>
    <div style={{...cardStyle(110, 500, 1000, 340, sk)}}>
      <div style={{padding: "34px 40px"}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: "#a0522d"}}>THE SKILL</div>
        <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 42, lineHeight: 1.2, color: "#2a1a10", marginTop: 10}}>{spec.skill}</div>
        <div style={{opacity: lm, marginTop: 28}}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", color: "#a0522d"}}>THE LIMITS</div>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, lineHeight: 1.3, color: "#4a3626", marginTop: 8}}>{spec.limits}</div>
        </div>
      </div>
    </div>
    <div style={{...paper(1180, 492 + (1 - ck) * 30, 630, 360, 1, ck), padding: "30px 36px"}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: RED}}>BEFORE YOU HAND IN</div>
      {spec.checks.map((c, i) => {
        const s = f - at("c1") - i * 12;
        return <div key={i} style={{display: "flex", alignItems: "center", gap: 18, marginTop: 22}}>
          <div style={{width: 30, height: 30, border: `3px solid ${INK}`, borderRadius: 5, flex: "none", opacity: s > 0 ? 1 : 0}}/>
          <Hand text={c} n={s * 1.8} size={34} color={INK}/>
        </div>;
      })}
    </div>
    <div style={{position: "absolute", left: 110, top: 862, width: 1700, fontFamily: SERIF, fontWeight: 600, fontSize: 38, color: "#fff4df", opacity: cta, textShadow: "0 2px 10px rgba(30,15,5,.8)"}}>{spec.cta}</div>
    <PaperFinish id="fta-t"/>
  </AbsoluteFill>;
};

export const FTA_SCENES: Record<string, React.FC<SceneProps>> = {fta_page: FtaPage, fta_transfer: FtaTransfer};
