// The global channel's chart family beyond the Sankey, all props-driven (--props={D}) and checked before render:
//   GLOBAL-waterfall  revenue stepping down to profit (or a year-on-year profit bridge); start + steps must equal end
//   GLOBAL-split      one dollar as 100 coins, coloured by where each cent went; parts must add up to the whole
//   GLOBAL-mix        part-to-whole on one stacked bar with an ordinal ramp (process nodes, tiers); shares sum to 100
//   GLOBAL-guide      guidance range against the last actual, on one shared axis; every value must sit on the axis
// Each shows the DRAFT tag while any figure is still marked "check", exactly like GLOBAL-sankey.
import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {G, RAMP, SANS} from "./theme";
import {Beat, Frame, HALO, Meta, Money, Status, assertChecks, beatAt, ease, money, textW, timeline} from "./frame";

type Reveal = Beat & {upto?: number};
const unchecked = (xs: {status?: Status}[]) => xs.filter((x) => (x.status ?? "check") === "check").length;
const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);
// The beat at which item i first shows: the first beat whose `upto` reaches it (no upto = everything).
const revealAt = (beats: Reveal[], starts: number[], i: number) => {
  const b = beats.findIndex((x) => (x.upto ?? 1e9) >= i);
  return starts[Math.max(0, b)];
};
const area = (W: number, H: number, beats: Beat[]) => ({x: 60, y: 200, w: W - 120, h: H - 330 - (beats.some((b) => b.caption) ? 90 : 0)});

// ---------------------------------------------------------------- waterfall
export type WItem = {label: string; value: number; sub?: string; status?: Status};
export type WaterfallData = Meta & Money & {start: WItem; items: WItem[]; end: WItem; beats?: Reveal[]};
const wBeats = (D: WaterfallData): Reveal[] => D.beats ?? [...D.items.map((_, i) => ({sec: 1, upto: i})), {sec: 1, upto: D.items.length + 1}, {sec: 5}];
export const checkWaterfall = (D: WaterfallData) => {
  const gap = D.start.value + sum(D.items.map((x) => x.value)) - D.end.value;
  return Math.abs(gap) > (D.tol ?? 0.05) ? [`start + steps - end = ${gap.toFixed(3)} ${D.cur}${D.unit ?? ""}, not 0`] : [];
};
export const waterfallTotal = (D: WaterfallData) => { assertChecks(D.id, checkWaterfall(D)); return timeline(wBeats(D)).total; };

export const GlobalWaterfall: React.FC<{D: WaterfallData}> = ({D}) => {
  const f = useCurrentFrame(), {width: W, height: H} = useVideoConfig(), beats = wBeats(D), {starts} = timeline(beats);
  const A = area(W, H, beats), bars = [D.start, ...D.items, D.end], n = bars.length;
  const run: [number, number][] = [];
  let c = D.start.value;
  run.push([0, c]);
  D.items.forEach((x) => { run.push([c, c + x.value]); c += x.value; });
  run.push([0, D.end.value]);
  const vmax = Math.max(...run.flat()), base = A.y + A.h - 70, k = (A.h - 150) / vmax, Y = (v: number) => base - v * k;
  const slot = (A.w - 120) / n, bw = Math.min(150, slot * 0.56), X = (i: number) => A.x + 60 + slot * i + (slot - bw) / 2;
  const col = (i: number) => i === 0 ? G.rev : i === n - 1 ? G.keep : bars[i].value < 0 ? G.spend : G.keep;
  return (
    <Frame M={D} draft={unchecked(bars)} beats={beats} starts={starts}>
      <line x1={A.x + 40} y1={base} x2={A.x + A.w - 20} y2={base} stroke={G.line} strokeWidth={2}/>
      <g transform={`translate(${A.x + A.w - 20} ${A.y + 50})`}>
        {[["added", G.keep], ["taken away", G.spend]].map(([t, cl], i) => (
          <g key={t} transform={`translate(${-330 + i * 150} 0)`}>
            <rect x={0} y={-18} width={22} height={22} rx={4} fill={cl}/>
            <text x={32} y={2} fontFamily={SANS} fontSize={24} fill={G.dim}>{t}</text>
          </g>))}
      </g>
      {bars.map((b, i) => {
        const t0 = revealAt(beats, starts, i), p = ease(f, t0, t0 + 14);
        if (f < t0) return null;
        const [a, z] = run[i], cur = a + (z - a) * p, top = Math.min(Y(a), Y(cur)), h = Math.max(2, Math.abs(Y(cur) - Y(a)));
        const neg = i > 0 && i < n - 1 && b.value < 0;
        return (
          <g key={i}>
            {i > 0 ? <line x1={X(i - 1) + bw} y1={Y(run[i - 1][1])} x2={X(i)} y2={Y(run[i - 1][1])} stroke={G.dim} strokeWidth={2} opacity={0.6}/> : null}
            <rect x={X(i)} y={top} width={bw} height={h} rx={4} fill={col(i)}/>
            <g opacity={ease(f, t0 + 6, t0 + 18)} style={HALO}>
              <text x={X(i) + bw / 2} y={Math.min(Y(a), Y(z)) - (b.sub ? 44 : 16)} textAnchor="middle" fontFamily={SANS} fontSize={34} fontWeight={700} fill={G.ink}>
                {`${neg ? "−" : i > 0 && i < n - 1 ? "+" : ""}${money(D, b.value)}`}</text>
              {b.sub ? <text x={X(i) + bw / 2} y={Math.min(Y(a), Y(z)) - 14} textAnchor="middle" fontFamily={SANS} fontSize={22} fill={G.dim}>{b.sub}</text> : null}
              {b.label.split("|").map((t, j) => <text key={j} x={X(i) + bw / 2} y={base + 38 + j * 30} textAnchor="middle" fontFamily={SANS} fontSize={26} fontWeight={500} fill={G.ink}>{t}</text>)}
            </g>
          </g>
        );
      })}
    </Frame>
  );
};

// ---------------------------------------------------------------- one dollar as 100 coins
export type SPart = {label: string; value: number; kind: "keep" | "spend" | "spend2" | "neutral" | "rev"; status?: Status};
export type SplitData = Meta & Money & {whole?: {label: string; value: number; status?: Status}; parts: SPart[]; beats?: Reveal[]};
const sBeats = (D: SplitData): Reveal[] => D.beats ?? [...D.parts.map((_, i) => ({sec: 2, upto: i})), {sec: 5}];
export const checkSplit = (D: SplitData) => {
  const e: string[] = [];
  D.parts.forEach((p) => { if (!(p.value > 0)) e.push(`${p.label}: value must be positive`); });
  if (D.whole && Math.abs(sum(D.parts.map((p) => p.value)) - D.whole.value) > (D.tol ?? 0.05))
    e.push(`parts add up to ${sum(D.parts.map((p) => p.value)).toFixed(3)}, not the whole ${D.whole.value}`);
  return e;
};
export const splitTotal = (D: SplitData) => { assertChecks(D.id, checkSplit(D)); return timeline(sBeats(D)).total; };
// Whole cents that add up to exactly 100: floor every share, then hand the spare cents to the largest remainders.
export const cents = (vals: number[]) => {
  const t = sum(vals), raw = vals.map((v) => (v / t) * 100), fl = raw.map(Math.floor);
  const order = raw.map((r, i) => [r - fl[i], i]).sort((a, b) => b[0] - a[0]), spare = 100 - sum(fl);
  for (let j = 0; j < spare; j++) fl[order[j][1]]++;
  return fl;
};

export const GlobalSplit: React.FC<{D: SplitData}> = ({D}) => {
  const f = useCurrentFrame(), {width: W, height: H} = useVideoConfig(), beats = sBeats(D), {starts} = timeline(beats);
  const A = area(W, H, beats), ct = cents(D.parts.map((p) => p.value));
  const cell = Math.min(62, (A.h - 20) / 10), gx = A.x + 120, gy = A.y + (A.h - cell * 10) / 2 + 10;
  const owner: number[] = ct.flatMap((c, i) => Array(c).fill(i));
  const first = ct.map((_, i) => sum(ct.slice(0, i)));
  const lx = gx + cell * 10 + 140, rowH = Math.min(150, (A.h - 20) / D.parts.length);
  return (
    <Frame M={D} draft={unchecked([...D.parts, ...(D.whole ? [D.whole] : [])])} beats={beats} starts={starts}>
      {owner.map((pi, j) => {
        const t0 = revealAt(beats, starts, pi) + Math.round((j - first[pi]) * Math.min(1, 30 / Math.max(1, ct[pi]))), p = ease(f, t0, t0 + 8);
        const cx = gx + (j % 10) * cell + cell / 2, cy = gy + Math.floor(j / 10) * cell + cell / 2;
        return <g key={j}>
          <circle cx={cx} cy={cy} r={cell * 0.4} fill="none" stroke={G.line} strokeWidth={2}/>
          {p > 0 ? <circle cx={cx} cy={cy} r={cell * 0.4 * p} fill={G[D.parts[pi].kind]}/> : null}
        </g>;
      })}
      {D.whole ? <text x={gx} y={gy - 22} fontFamily={SANS} fontSize={26} fill={G.dim}>{`1 coin = 1 cent of ${D.whole.label} (${money(D, D.whole.value)})`}</text> : null}
      {D.parts.map((p, i) => {
        const t0 = revealAt(beats, starts, i), q = ease(f, t0, t0 + 24), y = A.y + 20 + i * rowH + rowH / 2;
        if (f < t0) return null;
        return <g key={i} opacity={ease(f, t0, t0 + 8)}>
          <rect x={lx} y={y - 34} width={14} height={68} rx={4} fill={G[p.kind]}/>
          <text x={lx + 36} y={y + 26} fontFamily={SANS} fontSize={84} fontWeight={700} fill={G.ink}>{`${Math.round(ct[i] * q)}¢`}</text>
          <text x={lx + 36 + textW(`${ct[i]}¢`, 84) + 30} y={y - 4} fontFamily={SANS} fontSize={34} fontWeight={500} fill={G.ink}>{p.label}</text>
          <text x={lx + 36 + textW(`${ct[i]}¢`, 84) + 30} y={y + 32} fontFamily={SANS} fontSize={24} fill={G.dim}>{money(D, p.value)}</text>
        </g>;
      })}
    </Frame>
  );
};

// ---------------------------------------------------------------- mix on one stacked bar
export type MPart = {label: string; pct: number; status?: Status};
export type MixData = Meta & {basis: string; parts: MPart[]; bracket?: {from: number; to: number; label: string}; beats?: Beat[]};
const mBeats = (D: MixData): Beat[] => D.beats ?? [{sec: 3}, {sec: 5}];
export const checkMix = (D: MixData) => {
  const e: string[] = [], t = sum(D.parts.map((p) => p.pct));
  if (Math.abs(t - 100) > 0.5) e.push(`shares add up to ${t}%, not 100%`);
  if (D.parts.length > RAMP.length) e.push(`${D.parts.length} parts; fold the tail into "Other" (ramp has ${RAMP.length} steps)`);
  return e;
};
export const mixTotal = (D: MixData) => { assertChecks(D.id, checkMix(D)); return timeline(mBeats(D)).total; };

export const GlobalMix: React.FC<{D: MixData}> = ({D}) => {
  const f = useCurrentFrame(), {width: W, height: H} = useVideoConfig(), beats = mBeats(D), {starts} = timeline(beats);
  const A = area(W, H, beats), x0 = A.x + 60, bw = A.w - 120, by = A.y + A.h * 0.36, bh = 150, GAP = 4;
  let acc = 0;
  const segs = D.parts.map((p) => { const s = {x: x0 + (acc / 100) * bw, w: (p.pct / 100) * bw}; acc += p.pct; return s; });
  const t1 = starts[1] ?? starts[0];
  return (
    <Frame M={D} draft={unchecked(D.parts)} beats={beats} starts={starts}>
      <text x={x0} y={by - 120} fontFamily={SANS} fontSize={28} fill={G.dim}>{D.basis}</text>
      {D.parts.map((p, i) => {
        const t0 = 6 + i * 8, q = ease(f, t0, t0 + 14), s = segs[i];
        if (f < t0) return null;
        return <g key={i}>
          <rect x={s.x + GAP / 2} y={by} width={Math.max(0, (s.w - GAP) * q)} height={bh} rx={4} fill={RAMP[i]}/>
          <g opacity={ease(f, t0 + 8, t0 + 20)} style={HALO}>
            <text x={s.x + s.w / 2} y={by - 22} textAnchor="middle" fontFamily={SANS} fontSize={s.w > 120 ? 56 : 40} fontWeight={700} fill={G.ink}>{`${p.pct}%`}</text>
            {p.label.split("|").map((t, j) => <text key={j} x={s.x + s.w / 2} y={by + bh + 44 + j * 32} textAnchor="middle" fontFamily={SANS} fontSize={28} fontWeight={500} fill={G.ink}>{t}</text>)}
          </g>
        </g>;
      })}
      {D.bracket && f >= t1 ? (() => {
        const a = segs[D.bracket.from].x + GAP / 2, z = segs[D.bracket.to].x + segs[D.bracket.to].w - GAP / 2, y = by + bh + 120, q = ease(f, t1, t1 + 16);
        return <g opacity={q}>
          <path d={`M ${a} ${y - 16} L ${a} ${y} L ${a + (z - a) * q} ${y} ${q > 0.99 ? `L ${z} ${y - 16}` : ""}`} fill="none" stroke={G.ink} strokeWidth={3}/>
          <text x={(a + z) / 2} y={y + 52} textAnchor="middle" fontFamily={SANS} fontSize={40} fontWeight={700} fill={G.ink}>{D.bracket.label}</text>
        </g>;
      })() : null}
    </Frame>
  );
};

// ---------------------------------------------------------------- guidance range vs last actual
export type GRow = {label: string; low: number; high: number; prior: number; status?: Status};
export type GuideData = Meta & {axis: {min: number; max: number; step: number; unit: string}; guideLabel: string; priorLabel: string; rows: GRow[]; beats?: Beat[]};
const gBeats = (D: GuideData): Beat[] => D.beats ?? [{sec: 2}, {sec: 3}, {sec: 5}];
export const checkGuide = (D: GuideData) => {
  const e: string[] = [], {min, max} = D.axis;
  D.rows.forEach((r) => {
    if (r.low > r.high) e.push(`${r.label}: low ${r.low} is above high ${r.high}`);
    [r.low, r.high, r.prior].forEach((v) => { if (v < min || v > max) e.push(`${r.label}: ${v} is off the axis ${min}-${max}`); });
  });
  return e;
};
export const guideTotal = (D: GuideData) => { assertChecks(D.id, checkGuide(D)); return timeline(gBeats(D)).total; };

export const GlobalGuide: React.FC<{D: GuideData}> = ({D}) => {
  const f = useCurrentFrame(), {width: W, height: H} = useVideoConfig(), beats = gBeats(D), {starts} = timeline(beats);
  const A = area(W, H, beats), x0 = A.x + 380, x1 = A.x + A.w - 300, {min, max, step, unit} = D.axis;
  const X = (v: number) => x0 + ((v - min) / (max - min)) * (x1 - x0);
  const rowH = Math.min(210, (A.h - 140) / D.rows.length), top = A.y + 110, bottom = top + rowH * D.rows.length;
  const ticks = Array.from({length: Math.floor((max - min) / step) + 1}, (_, i) => min + i * step);
  const [t1, t2] = [starts[1] ?? 0, starts[2] ?? 0], pct = (v: number) => `${+v.toFixed(1)}${unit}`;
  return (
    <Frame M={D} draft={unchecked(D.rows)} beats={beats} starts={starts}>
      <g transform={`translate(${x0} ${A.y + 30})`}>
        <rect x={0} y={-20} width={44} height={24} rx={4} fill={G.rev} fillOpacity={0.55} stroke={G.rev} strokeWidth={2}/>
        <text x={56} y={0} fontFamily={SANS} fontSize={26} fill={G.dim}>{D.guideLabel}</text>
        <circle cx={textW(D.guideLabel, 26) + 120} cy={-8} r={11} fill={G.ink}/>
        <text x={textW(D.guideLabel, 26) + 142} y={0} fontFamily={SANS} fontSize={26} fill={G.dim}>{D.priorLabel}</text>
      </g>
      {ticks.map((t) => <g key={t}>
        <line x1={X(t)} y1={top - 20} x2={X(t)} y2={bottom} stroke={G.line} strokeWidth={1.5}/>
        <text x={X(t)} y={bottom + 40} textAnchor="middle" fontFamily={SANS} fontSize={24} fill={G.dim}>{pct(t)}</text>
      </g>)}
      {D.rows.map((r, i) => {
        const cy = top + rowH * i + rowH / 2, mid = (r.low + r.high) / 2, q = ease(f, t1, t1 + 18);
        const d = mid - r.prior, dot = ease(f, 4 + i * 6, 16 + i * 6);
        return <g key={i}>
          <text x={x0 - 40} y={cy + 12} textAnchor="end" fontFamily={SANS} fontSize={36} fontWeight={700} fill={G.ink}>{r.label}</text>
          {f >= t1 ? <g>
            <rect x={X(mid) - (X(r.high) - X(r.low)) / 2 * q} y={cy - 30} width={(X(r.high) - X(r.low)) * q} height={60} rx={6} fill={G.rev} fillOpacity={0.55} stroke={G.rev} strokeWidth={3}/>
            <text x={X(mid)} y={cy - 44} textAnchor="middle" fontFamily={SANS} fontSize={28} fontWeight={500} fill={G.ink} opacity={q} style={HALO}>{`${pct(r.low)}–${pct(r.high)}`}</text>
          </g> : null}
          <circle cx={X(r.prior)} cy={cy} r={14 * dot} fill={G.ink} stroke={G.bg} strokeWidth={3}/>
          <text x={X(r.prior)} y={cy + 62} textAnchor="middle" fontFamily={SANS} fontSize={26} fill={G.ink} opacity={dot} style={HALO}>{pct(r.prior)}</text>
          {f >= t2 ? <text x={x1 + 40} y={cy + 10} fontFamily={SANS} fontSize={28} fontWeight={500} fill={G.ink} opacity={ease(f, t2, t2 + 12)}>
            {`midpoint vs ${D.priorLabel.split(" ")[0]}: ${d >= 0 ? "+" : "−"}${Math.abs(d).toFixed(1)} pt`}</text> : null}
        </g>;
      })}
    </Frame>
  );
};
