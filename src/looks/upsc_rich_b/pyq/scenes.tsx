// Scene kinds of the Mains answer videos (CONTRACT_PYQ.md): pyq_question, pyq_xray, pyq_sheet, pyq_compare, pyq_cousins.
// Text and numbers come from the answer module through the storyboard (number-locked by scripts/upsc/pyq_tool.py).
import React from "react";
import {AbsoluteFill} from "remotion";
import {measure} from "../../shared/fit";
import type {SceneProps} from "../../cartoon/long/contract";
import {PaperFinish, SANS, SERIF, clamp, eo, prog} from "../kit";
import {Boxes, Desk, Gauges, HAND, Hand, INK, Marker, PENCIL, RED, handWidth, paper, wrap, type Demand} from "./kit";
import {Diagram, type DiagramSpec} from "./diagrams";

const SERIF_F = {family: SERIF, weight: 500, tnum: false, letterSpacing: 0};
const serifW = (t: string, s: number) => measure(t, SERIF_F, s);
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const softAt = (at: SceneProps["at"], key?: string, dflt = 0) => (key ? at(key) : dflt);

/** printed question text, wrapped, with highlighted phrases (each drawn from at(key)) */
const Printed: React.FC<{text: string; size: number; width: number; f: number; at: SceneProps["at"]; glow?: {text: string; key: string}[]; under?: {text: string; key: string}[]}> = ({text, size, width, f, at, glow = [], under = []}) => {
  const words = text.split(/\s+/);
  const mark = (list: {text: string; key: string}[]) => {
    const m: (string | null)[] = words.map(() => null);
    for (const g of list) {
      const gw = g.text.split(/\s+/).map(norm);
      for (let i = 0; i + gw.length <= words.length; i++) if (gw.every((x, j) => norm(words[i + j]) === x)) { for (let j = 0; j < gw.length; j++) m[i + j] = g.key; break; }
    }
    return m;
  };
  const gm = mark(glow), um = mark(under);
  const lines: number[][] = []; let cur: number[] = [];
  words.forEach((w, i) => { const t = [...cur, i].map((k) => words[k]).join(" "); if (cur.length && serifW(t, size) > width) { lines.push(cur); cur = [i]; } else cur.push(i); });
  if (cur.length) lines.push(cur);
  return <div style={{fontFamily: SERIF, fontWeight: 500, fontSize: size, lineHeight: 1.32, color: "#2a1a10"}}>
    {lines.map((ln, li) => <div key={li} style={{whiteSpace: "nowrap"}}>{ln.map((i) => {
      const g = gm[i], u = um[i];
      return <span key={i} style={{position: "relative", zIndex: 0}}>
        {g && <Marker p={prog(f, at(g), 14)}/>}
        {words[i]}
        {u && <svg viewBox="0 0 100 12" preserveAspectRatio="none" style={{position: "absolute", left: 0, bottom: -6, width: "100%", height: 12, overflow: "visible"}}><path d="M0,6 Q 40,10 100,4" stroke={RED} strokeWidth={4} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo(prog(f, at(u), 12))} vectorEffect="non-scaling-stroke" preserveAspectRatio="none"/></svg>}
        {" "}
      </span>;
    })}</div>)}
  </div>;
};

type QSpec = {credit: string; marks: string; text: string; glow?: {text: string; key: string}[]; strip?: {years: string[]; hits: string[]; key: string; note?: string}};
export const PyqQuestion: React.FC<SceneProps<QSpec>> = ({f, dur, spec, at}) => {
  const a = eo(prog(f, 0, 20)), zoom = 1 + 0.025 * clamp(f / Math.max(dur, 1)), ph = spec.strip ? 760 : 560;
  return <AbsoluteFill>
    <Desk f={f}/>
    <div style={{...paper(250, (1000 - ph) / 2 + (1 - a) * 60, 1420, ph, -0.6, a), transform: `rotate(-0.6deg) scale(${zoom})`, padding: "54px 80px"}}>
      <div style={{display: "flex", justifyContent: "space-between", fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: "0.14em", color: "#7a4a26", borderBottom: "2px solid #d9c7a6", paddingBottom: 16}}>
        <span>{spec.credit.toUpperCase()}</span><span>{spec.marks.toUpperCase()}</span>
      </div>
      <div style={{marginTop: spec.text.length > 200 ? 30 : 46}}><Printed text={spec.text} size={spec.text.length > 200 ? 44 : 56} width={1240} f={f} at={at} glow={spec.glow}/></div>
      {spec.strip && <div style={{position: "absolute", left: 80, right: 80, bottom: 50}}>
        <div style={{display: "flex", gap: 14, justifyContent: "center"}}>{spec.strip.years.map((y, i) => {
          const hit = spec.strip!.hits.includes(y), k = hit ? spec.strip!.hits.indexOf(y) : 0, q = hit ? eo(prog(f, at(spec.strip!.key) + k * 6, 10)) : 0;
          return <div key={y} style={{padding: "12px 16px", borderRadius: 12, fontFamily: SANS, fontWeight: 700, fontSize: 24,
            background: q > 0.5 ? "#2f5d7c" : "#efe4cf", color: q > 0.5 ? "#fff" : "#8a6a4a", transform: `translateY(${-8 * q}px)`, boxShadow: q > 0.5 ? "0 10px 20px -10px rgba(20,40,60,.8)" : "none"}}>{y}</div>;
        })}</div>
        {spec.strip.note && <div style={{textAlign: "center", marginTop: 14, fontFamily: SANS, fontSize: 21, color: "#8a6a4a", opacity: eo(prog(f, at(spec.strip.key) + 40, 15))}}>{spec.strip.note}</div>}
      </div>}
    </div>
    <PaperFinish id="pq-q"/>
  </AbsoluteFill>;
};

type XSpec = {text: string; directives: {word: string; meaning: string; key: string}[]; demands: (Demand & {key: string})[]};
export const PyqXray: React.FC<SceneProps<XSpec>> = ({f, spec, at}) => (
  <AbsoluteFill>
    <Desk f={f}/>
    <div style={{...paper(200, 70, 1520, 420, -0.4), padding: "40px 64px"}}>
      <Printed text={spec.text} size={spec.text.length > 200 ? 34 : 44} width={1390} f={f} at={at} under={spec.directives.map((d) => ({text: d.word, key: d.key}))}/>
    </div>
    {spec.directives.map((d, i) => <div key={d.key} style={{position: "absolute", left: 270 + i * 700, top: 330 + (i % 2) * 64, transform: `rotate(${i % 2 ? 0.8 : -1.1}deg)`, opacity: eo(prog(f, at(d.key) + 6, 12))}}>
      <Hand text={`${d.word} = ${d.meaning}`} n={(f - at(d.key) - 6) * 1.6} size={44} color={RED} weight={700}/>
    </div>)}
    {spec.demands.map((d, i) => {
      const s = eo(prog(f, at(d.key), 14)), x = (1920 - spec.demands.length * 420 + 40) / 2 + i * 420;
      return <div key={d.id} style={{position: "absolute", left: x, top: 620 + (1 - s) * 30, width: 380, height: 260, opacity: s, borderRadius: 18,
        background: "rgba(255,250,238,.94)", border: "2.5px dashed #a0522d", boxShadow: "0 24px 40px -24px rgba(40,20,5,.8)", padding: "26px 28px"}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 26, color: "#a0522d", letterSpacing: "0.1em"}}>{d.id}</div>
        <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 40, color: "#2a1a10", lineHeight: 1.12, marginTop: 10}}>{d.label}</div>
        <div style={{position: "absolute", right: 22, bottom: 22, width: 46, height: 46, border: "3px solid #8a6a4a", borderRadius: 8}}/>
      </div>;
    })}
    <PaperFinish id="pq-x"/>
  </AbsoluteFill>
);

// ---------------------------------------------------------------- the answer sheet
type Block = {kind: "intro" | "head" | "para" | "points" | "close" | "diagram"; text: string; label?: string; diagram?: DiagramSpec};
type SheetSpec = {blocks: Block[]; from: number; to: number; minutes: [number, number]; total: number; words0: number; budget: number;
  demands: Demand[]; done0: string[]; done: string[]; start?: string};
type Row = {block: number; y: number; h: number; kind: "line" | "head" | "diagram" | "caption"; text: string; indent: number; units: number};
const PAGE = {x: 110, y: 60, w: 1130, h: 990}, INNER = {x: 120, w: 960}, LH = 54, SIZE = 33, VIEW = {top: 96, bottom: 900};

const layout = (blocks: Block[]): Row[] => {
  const rows: Row[] = []; let y = 0;
  blocks.forEach((b, bi) => {
    if (b.kind === "diagram") {
      rows.push({block: bi, y, h: 600, kind: "diagram", text: "", indent: 0, units: 160}); y += 600;
      if (b.label) { rows.push({block: bi, y, h: LH, kind: "caption", text: b.label, indent: 0, units: b.label.length}); y += LH; }
      y += 10; return;
    }
    if (b.kind === "head") { y += 12; for (const l of wrap(b.text, SIZE + 3, INNER.w)) { rows.push({block: bi, y, h: LH, kind: "head", text: l, indent: 0, units: l.length}); y += LH; } return; }
    const items = b.kind === "points" ? b.text.split("•").map((s) => s.trim()).filter(Boolean) : [b.text];
    for (const it of items) {
      const ind = b.kind === "points" ? 34 : 0;
      wrap(it, SIZE, INNER.w - ind).forEach((l, j) => { const tx = (b.kind === "points" && j === 0 ? "• " : "") + l; rows.push({block: bi, y, h: LH, kind: "line", text: tx, indent: j === 0 ? 0 : ind, units: tx.length}); y += LH; });
    }
    y += 8;
  });
  return rows;
};
const words = (t: string) => t.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;

export const PyqSheet: React.FC<SceneProps<SheetSpec>> = ({f, dur, spec, at}) => {
  const rows = React.useMemo(() => layout(spec.blocks), [spec.blocks]);
  const mine = rows.filter((r) => r.block >= spec.from && r.block <= spec.to), total = mine.reduce((s, r) => s + r.units, 0);
  const a0 = softAt(at, spec.start, 8), p = clamp((f - a0) / Math.max(10, dur * 0.88 - a0));
  let budget = p * total;
  const shown = new Map<Row, number>();
  for (const r of rows) {
    if (r.block < spec.from) shown.set(r, r.units);
    else if (r.block > spec.to) shown.set(r, 0);
    else { const n = Math.min(r.units, Math.max(0, budget)); shown.set(r, n); budget -= r.units; }
  }
  const cursor = [...rows].reverse().find((r) => (shown.get(r) ?? 0) > 0) ?? rows[0];
  const fit = (r: Row): number => {
    if (r.kind === "caption") { const d = rows.find((x) => x.block === r.block && x.kind === "diagram"); if (d) return Math.max(0, Math.min(d.y - 90, r.y + r.h - (VIEW.bottom - VIEW.top) * 0.78)); }
    return Math.max(0, r.kind === "diagram" ? r.y - 90 : r.y + r.h - (VIEW.bottom - VIEW.top) * 0.78);
  };   // a diagram is shown whole, below the fade
  const target = fit(cursor);
  const startCursor = rows.filter((r) => r.block < spec.from).pop();
  const scroll0 = startCursor ? fit(startCursor) : 0;
  const scroll = scroll0 + (target - scroll0) * eo(clamp(p * 1.15));
  const blockWords = spec.blocks.map((b) => (b.kind === "diagram" ? 0 : words(b.text)));
  let w = spec.words0;
  for (let i = spec.from; i <= spec.to; i++) {
    const rs = rows.filter((r) => r.block === i), u = rs.reduce((s, r) => s + r.units, 0), got = rs.reduce((s, r) => s + (shown.get(r) ?? 0), 0);
    w += blockWords[i] * (u ? got / u : 0);
  }
  const left = spec.minutes[0] + (spec.minutes[1] - spec.minutes[0]) * p;
  const lines = Array.from({length: 40}, (_, i) => i);
  return <AbsoluteFill>
    <Desk f={f}/>
    <div style={{...paper(PAGE.x, PAGE.y, PAGE.w, PAGE.h, -0.3)}}>
      <svg width={PAGE.w} height={PAGE.h} style={{position: "absolute", inset: 0}}>
        {lines.map((i) => { const y = VIEW.top - PAGE.y + i * LH - (scroll % LH) + LH - 10; return y < PAGE.h ? <line key={i} x1={0} x2={PAGE.w} y1={y} y2={y} stroke="#b9cde0" strokeWidth={1.4}/> : null; })}
        <line x1={96} x2={96} y1={0} y2={PAGE.h} stroke="#e2a0a0" strokeWidth={2}/>
      </svg>
      <div style={{position: "absolute", left: 0, right: 0, top: VIEW.top - PAGE.y, height: VIEW.bottom - VIEW.top, overflow: "hidden",
        WebkitMaskImage: scroll > 2 ? "linear-gradient(to bottom, transparent 0px, black 70px, black 100%)" : undefined}}>
        <div style={{position: "absolute", left: INNER.x, top: -scroll, width: INNER.w}}>
          {rows.map((r, i) => {
            const n = shown.get(r) ?? 0;
            if (r.kind === "diagram") {
              const b = spec.blocks[r.block];
              return <div key={i} style={{position: "absolute", top: r.y, left: 20, width: INNER.w - 40, height: r.h, opacity: n > 0 ? 1 : 0}}>
                {b.diagram && <Diagram p={n / r.units} w={INNER.w - 40} h={r.h - 10} spec={b.diagram}/>}
              </div>;
            }
            return <div key={i} style={{position: "absolute", top: r.y, left: r.indent, height: LH, display: "flex", alignItems: "flex-end", paddingBottom: 6}}>
              <Hand text={r.text} n={n} size={r.kind === "head" ? SIZE + 3 : r.kind === "caption" ? SIZE - 5 : SIZE} weight={r.kind === "head" ? 700 : 400} under={r.kind === "head"} color={r.kind === "caption" ? PENCIL : INK}/>
            </div>;
          })}
        </div>
      </div>
    </div>
    <Gauges x={1310} y={80} left={left} total={spec.total} words={w} budget={spec.budget} a={1}/>
    <div style={{position: "absolute", left: 1310, top: 448, fontFamily: SANS, fontWeight: 700, fontSize: 20, letterSpacing: "0.16em", color: "#f5e6cc"}}>THE {["", "ONE JOB", "TWO JOBS", "THREE JOBS", "FOUR JOBS", "FIVE JOBS", "SIX JOBS"][spec.demands.length] ?? "JOBS"}</div>
    <Boxes light x={1310} y={488} items={spec.demands} shown={() => 1} ticked={(d) => (spec.done0.includes(d.id) ? 1 : spec.done.includes(d.id) ? clamp((p - 0.9) * 10) : 0)} size={30}/>
    <PaperFinish id="pq-s" vignette={0.3}/>
  </AbsoluteFill>;
};

type CSpec = {weak: {text: string; miss: string; key: string}[]; heads: string[]; fig?: string; demands: Demand[]; title_weak: string; title_good: string};
export const PyqCompare: React.FC<SceneProps<CSpec>> = ({f, spec, at}) => {
  const a = eo(prog(f, 0, 16));
  return <AbsoluteFill>
    <Desk f={f}/>
    <div style={{...paper(90, 70 + (1 - a) * 40, 850, 860, -1.2, a), padding: "36px 44px"}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: "#8a6a4a"}}>{spec.title_weak}</div>
      {spec.weak.map((wk, i) => {
        const t = f - at(wk.key);
        return <div key={wk.key} style={{position: "relative", marginTop: 26, opacity: t > -2 ? 1 : 0.0}}>
          <div style={{display: "inline-block", padding: "2px 14px", borderRadius: 26, border: `3px solid ${RED}`, borderColor: `rgba(192,57,43,${eo(prog(f, at(wk.key) + 14, 12))})`, transform: "rotate(-0.6deg)"}}>
            <Hand text={wk.text} n={t * 2.2} size={30} color={PENCIL} wrapText/>
          </div>
          <div style={{marginTop: 6, marginLeft: 20}}><Hand text={"→ " + wk.miss} n={(t - 22) * 2.4} size={27} color={RED} wrapText/></div>
        </div>;
      })}
    </div>
    <div style={{...paper(990, 90 + (1 - a) * 40, 840, 820, 0.8, a), padding: "36px 44px"}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: "#4f7a3a"}}>{spec.title_good}</div>
      {spec.heads.map((h, i) => <div key={i} style={{marginTop: 22}}><Hand text={h} n={999} size={32} weight={700} under/></div>)}
      {spec.fig && <div style={{marginTop: 22}}><Hand text={"+ " + spec.fig} n={999} size={30} color={PENCIL}/></div>}
      <div style={{position: "relative", marginTop: 40, height: 300}}>
        <Boxes x={0} y={0} items={spec.demands} shown={() => 1} ticked={() => 1} size={28}/>
      </div>
    </div>
    <PaperFinish id="pq-c"/>
  </AbsoluteFill>;
};

type KSpec = {demands: Demand[]; cousins: {text: string; key: string}[]; next: {text: string; key: string}; title: string};
export const PyqCousins: React.FC<SceneProps<KSpec>> = ({f, spec, at}) => (
  <AbsoluteFill>
    <Desk f={f}/>
    <div style={{position: "absolute", left: 110, top: 80, fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: "#f5e6cc"}}>ALL {["", "ONE JOB", "TWO JOBS", "THREE JOBS", "FOUR JOBS", "FIVE JOBS", "SIX JOBS"][spec.demands.length] ?? "JOBS"} DONE</div>
    <div style={{position: "absolute", left: 110, top: 124, display: "flex", gap: 30}}>
      {spec.demands.map((d, i) => <div key={d.id} style={{position: "relative", width: 380, height: 90}}><Boxes light x={0} y={0} items={[d]} shown={() => 1} ticked={() => prog(f, 6 + i * 7, 10)} width={380} size={28}/></div>)}
    </div>
    <div style={{position: "absolute", left: 110, top: 262, fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", color: "#f5e6cc", opacity: spec.cousins.length ? eo(prog(f, at(spec.cousins[0].key) - 8, 10)) : 0}}>{spec.title}</div>
    {spec.cousins.map((c, i) => {
      const s = eo(prog(f, at(c.key), 16));
      return <div key={c.key} style={{...paper(110 + i * 40, 312 + i * 150 + (1 - s) * 40, 1180, 128, i % 2 ? 0.7 : -0.6, s), padding: "26px 36px", display: "flex", alignItems: "center"}}>
        <div style={{fontFamily: SERIF, fontWeight: 500, fontSize: 36, color: "#2a1a10", lineHeight: 1.2}}>{c.text}</div>
      </div>;
    })}
    <div style={{position: "absolute", left: 1380, top: 330, width: 440, height: 300, borderRadius: 20, opacity: eo(prog(f, at(spec.next.key), 16)),
      background: "linear-gradient(160deg,#2f5d7c,#1f3f57)", boxShadow: "0 30px 60px -26px rgba(0,0,0,.8)", padding: "34px 36px", color: "#fff"}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 22, letterSpacing: "0.16em", opacity: 0.85}}>WATCH NEXT</div>
      <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 40, lineHeight: 1.15, marginTop: 14}}>{spec.next.text}</div>
    </div>
    <PaperFinish id="pq-k"/>
  </AbsoluteFill>
);

// a big timeline on a sheet of paper: each node arrives at its key (an item with no key is already there); an optional quote card
type TSpec = {title: string; items: {when: string; what: string; key?: string; red?: boolean}[]; quote?: {text: string; cite: string; key: string}};
export const PyqTimeline: React.FC<SceneProps<TSpec>> = ({f, spec, at}) => {
  const n = spec.items.length, x0 = 340, x1 = 1580, y = 430, xs = spec.items.map((_, i) => x0 + (x1 - x0) * (n === 1 ? 0.5 : i / (n - 1)));
  const show = spec.items.map((it) => (it.key ? eo(prog(f, at(it.key), 14)) : 1));
  const reach = Math.max(...spec.items.map((it, i) => (show[i] > 0 ? xs[i] : x0)));
  return <AbsoluteFill>
    <Desk f={f}/>
    <div style={{...paper(110, 70, 1700, 840, -0.4)}}/>
    <div style={{position: "absolute", left: 200, top: 120, fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: "0.16em", color: "#7a4a26"}}>{spec.title}</div>
    <svg width={1920} height={1080} style={{position: "absolute", inset: 0}}>
      <line x1={x0 - 40} y1={y} x2={reach + 60} y2={y} stroke={INK} strokeWidth={5} strokeLinecap="round"/>
    </svg>
    {spec.items.map((it, i) => <div key={i} style={{position: "absolute", left: xs[i] - 150, top: y - 90, width: 300, textAlign: "center", opacity: show[i], transform: `translateY(${(1 - show[i]) * 20}px)`}}>
      <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 48, color: it.red ? RED : "#2a1a10"}}>{it.when}</div>
      <div style={{width: 26, height: 26, borderRadius: 13, margin: "12px auto 18px", background: "#fffaf0", border: `5px solid ${it.red ? RED : INK}`}}/>
      <Hand text={it.what} n={(it.key ? f - at(it.key) : 999) * 2} size={34} color={it.red ? RED : INK} wrapText/>
    </div>)}
    {spec.quote && <div style={{position: "absolute", left: 330, top: 690, width: 1260, textAlign: "center", opacity: eo(prog(f, at(spec.quote.key), 16))}}>
      <div style={{fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 54, color: "#2a1a10"}}>“{spec.quote.text}”</div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, letterSpacing: "0.14em", color: "#7a4a26", marginTop: 14}}>{spec.quote.cite.toUpperCase()}</div>
    </div>}
    <PaperFinish id="pq-t"/>
  </AbsoluteFill>;
};

export const PYQ_SCENES: Record<string, React.FC<SceneProps>> = {pyq_question: PyqQuestion, pyq_xray: PyqXray, pyq_sheet: PyqSheet, pyq_compare: PyqCompare, pyq_cousins: PyqCousins, pyq_timeline: PyqTimeline};
