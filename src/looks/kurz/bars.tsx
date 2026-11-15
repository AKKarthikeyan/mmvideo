// KURZ look, "bars" scene (data builder, 29 Oct 2026). Monthly columns from figures.json meta (nk_exports_monthly, crore eggs) grow
// left to right as glowing crates of light. A mark with line: true is a horizontal average line; a mark with at: "YYYY-MM" badges
// that month's column; a negative % mark also draws a falling arrow from the mark before it. The highlight span warms its columns
// and gets a band and a label at its key. Badges sit in a rail on the right with leader lines, so the columns stay clear.
// If the first key comes within a second of the start (a continuation scene) the columns start fully grown.
// Spec: {series, from, marks: (NumIn & {at?, line?, caption, color?})[], title, source, highlight?: {from, to, key, label}}
import React from "react";
import {AbsoluteFill} from "remotion";
import type {SceneProps} from "../cartoon/long/contract";
import {meta} from "../cartoon/long/figs";
import {numOf, sourceOf, type NumIn} from "../cartoon/long/scenes/nk_kit";
import {Cam, Chip, DBadge, Dust, Finish, K, Place, Pulse, ROUND, SourceTag, Space, Title, col, ease, easeIO, mix, pop} from "./data_kit";

type BMark = NumIn & {at?: string; line?: boolean; caption?: string; color?: string};
type BSpec = {series: string; from: string; marks: BMark[]; title?: string; source: string; highlight?: {from: string; to: string; key: string; label: string}};

const C = {x0: 200, x1: 1400, yT: 290, yB: 800}, RAIL = 1606;

export const Scene: React.FC<SceneProps<BSpec>> = ({f, dur, spec, at}) => {
  const uid = "dkbr";
  const all = meta(`meta.${spec.series}`) as Record<string, number> | undefined;
  if (!all || typeof all !== "object") throw new Error(`bars: series missing meta.${spec.series}`);
  const months = Object.keys(all).filter((m) => m >= spec.from).sort();
  if (months.length < 2) throw new Error(`bars: no months from ${spec.from}`);
  const vals = months.map((m) => all[m]), n = months.length, top = Math.max(...vals);
  const yMax = Math.ceil(top / 10) * 10, pitch = (C.x1 - C.x0) / n, bw = pitch * 0.72;
  const X = (i: number) => C.x0 + pitch * (i + 0.5), Y = (v: number) => C.yB - (C.yB - C.yT) * (v / yMax);
  const idx = (m: string) => { const i = months.indexOf(m); if (i < 0) throw new Error(`bars: month ${m} not in series`); return i; };

  const keys = [...spec.marks.map((m) => at(m.key)), ...(spec.highlight ? [at(spec.highlight.key)] : [])];
  const first = Math.min(...keys), drawn = first < 30, g0 = 6, g1 = Math.min(200, first - 20);
  const grow = (i: number) => drawn ? 1 : pop(f, g0 + (g1 - g0 - 14) * (i / (n - 1)), 170);

  // a continuation scene (columns already grown) shows what the last scene ended on at once: keys at frame 0-2 do not animate
  const inst = (a: number) => drawn && a <= 2;
  const hl = spec.highlight, hA = hl ? at(hl.key) : 0, hT = hl ? (inst(hA) ? 1 : ease(f, hA, hA + 20)) : 0;
  const hi0 = hl ? idx(hl.from) : -1, hi1 = hl ? idx(hl.to) : -1;
  // rail slots: wanted at the line or the column top, then pushed apart
  // Line badges stay level with their line (so a scene and its continuation agree); month badges take the nearest free slot.
  const GAP = 226, placed: number[] = [], slotY: Record<string, number> = {};
  for (const m of spec.marks.filter((x) => x.line)) { const y = Math.max(250, Math.min(800, Y(numOf(m, 0).value))); slotY[m.key] = y; placed.push(y); }
  for (const m of spec.marks.filter((x) => !x.line).sort((a, b) => Y(vals[idx(a.at!)]) - Y(vals[idx(b.at!)]))) {
    const want = Y(vals[idx(m.at!)]);
    const cands = [want, ...placed.flatMap((p) => [p - GAP, p + GAP])].map((y) => Math.max(250, Math.min(800, y)))
      .filter((y) => placed.every((p) => Math.abs(p - y) >= GAP - 0.5)).sort((a, b) => Math.abs(a - want) - Math.abs(b - want));
    const y = cands[0] ?? want; slotY[m.key] = y; placed.push(y);
  }
  const atMarks = spec.marks.filter((m) => m.at);

  const markCol = (m: BMark) => col(m.color, m.line ? K.tealL : K.yellow);
  const barCol = (i: number) => {
    const fall = atMarks.find((m) => idx(m.at!) === i && numOf(m, 0).value < 0) ?? null;
    if (fall) { const t = ease(f, at(fall.key) - 10, at(fall.key) + 6); return [mix(K.teal, K.pink, t), mix(K.tealD, K.pinkD, t)]; }
    const mk = atMarks.find((m) => idx(m.at!) === i);
    if (mk && f >= at(mk.key) - 6) { const t = ease(f, at(mk.key) - 6, at(mk.key) + 8); const base = i >= hi0 && i <= hi1 ? [K.orange, K.orangeD] : [K.teal, K.tealD]; return [mix(base[0], K.yellow, t), mix(base[1], K.orange, t)]; }
    if (i >= hi0 && i <= hi1) return [mix(K.teal, K.orange, hT), mix(K.tealD, K.orangeD, hT)];
    return [K.teal, K.tealD];
  };
  const years = Array.from(new Set(months.map((m) => m.slice(0, 4))));
  const ticks: number[] = []; for (let v = 0; v <= yMax; v += 10) ticks.push(v);
  const axT = drawn ? 1 : ease(f, 0, 18);

  return <AbsoluteFill>
    <Space f={f} uid={uid} seed={41} glowY={0.85}/>
    <Cam f={f} dur={dur} push={0.015} fx={800} fy={560}>
      <svg width={1920} height={1080} style={{position: "absolute"}}>
        <defs>
          <filter id={`${uid}-gl`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={10}/></filter>
          <linearGradient id={`${uid}-hb`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={K.yellow} stopOpacity={0.26}/><stop offset="1" stopColor={K.yellow} stopOpacity={0.04}/></linearGradient>
          <linearGradient id={`${uid}-wt`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={K.soft} stopOpacity={0.55}/><stop offset="1" stopColor={K.night} stopOpacity={0}/></linearGradient>
        </defs>
        {/* chart floor: a dark plinth with a lit rim, water shimmer below */}
        <rect x={C.x0 - 40} y={C.yT - 70} width={C.x1 - C.x0 + 80} height={C.yB - C.yT + 90} rx={30} fill={K.night} opacity={0.38}/>
        <rect x={-40} y={C.yB + 4} width={2000} height={300} fill={`url(#${uid}-wt)`}/>
        {Array.from({length: 7}, (_, k) => { const y = C.yB + 26 + k * 18, dx = Math.sin(f / 30 + k) * 30;
          return <path key={k} d={`M ${C.x0 - 40 + dx + k * 37} ${y} l ${180 - k * 10} 0 M ${C.x0 + 500 - dx + k * 23} ${y} l ${140 - k * 8} 0 M ${C.x0 + 960 + dx} ${y} l 160 0`} stroke={K.tealL} strokeWidth={3} opacity={0.18 - k * 0.02} strokeLinecap="round"/>; })}
        {/* grid and ticks */}
        {ticks.map((v) => <g key={v} opacity={axT}>
          <line x1={C.x0 - 10} x2={C.x1} y1={Y(v)} y2={Y(v)} stroke={K.white} strokeOpacity={v === 0 ? 0.55 : 0.12} strokeWidth={v === 0 ? 4 : 2}/>
          <text x={C.x0 - 22} y={Y(v) + 12} textAnchor="end" fontFamily={ROUND} fontWeight={800} fontSize={34} fill={K.white} opacity={0.78}>{v}</text>
        </g>)}
        {years.map((y) => { const is = months.map((m, i) => (m.startsWith(y) ? i : -1)).filter((i) => i >= 0), a = is[0], b = is[is.length - 1];
          return <g key={y} opacity={axT}>
            <line x1={X(a) - pitch / 2} x2={X(a) - pitch / 2} y1={C.yB} y2={C.yB + 20} stroke={K.white} strokeOpacity={0.5} strokeWidth={3}/>
            <text x={(X(a) + X(b)) / 2} y={C.yB + 56} textAnchor="middle" fontFamily={ROUND} fontWeight={800} fontSize={36} fill={K.white} opacity={0.85}>{y}</text>
          </g>; })}
        {/* highlight band */}
        {hl && hT > 0 && <g opacity={hT}>
          <rect x={X(hi0) - pitch / 2} y={C.yT - 40} width={X(hi1) - X(hi0) + pitch} height={C.yB - C.yT + 40} rx={14} fill={`url(#${uid}-hb)`}/>
          <rect x={X(hi0) - pitch / 2} y={C.yT - 40} width={X(hi1) - X(hi0) + pitch} height={5} rx={2} fill={K.yellow} opacity={0.8}/>
        </g>}
        {/* leader lines to the rail, behind the columns */}
        {spec.marks.map((m) => { const a = at(m.key); if (f < a) return null; const c = markCol(m), t = inst(a) ? 1 : ease(f, a + 4, a + 16);
          const [sx, sy] = m.line ? [C.x1, Y(numOf(m, 0).value)] : [X(idx(m.at!)) + 10, Y(vals[idx(m.at!)])];
          return <path key={`ld${m.key}`} d={`M ${sx} ${sy} C ${sx + 60} ${sy} ${RAIL - 240} ${slotY[m.key]} ${RAIL - 172} ${slotY[m.key]}`} stroke={c} strokeWidth={3} strokeDasharray="6 8" opacity={0.7 * t} fill="none"/>; })}
        {/* the glow layer, then the columns */}
        <g filter={`url(#${uid}-gl)`} opacity={0.55}>
          {vals.map((v, i) => { const g = grow(i), h = (C.yB - Y(v)) * g; return h > 0.5 ? <rect key={i} x={X(i) - bw / 2} y={C.yB - h} width={bw} height={h} fill={barCol(i)[0]}/> : null; })}
        </g>
        {vals.map((v, i) => {
          const g = grow(i), h = (C.yB - Y(v)) * g; if (h <= 0.5) return null;
          const [c0, c1] = barCol(i), x = X(i) - bw / 2, yTop = C.yB - h;
          const notches = Math.floor(h / 20);
          return <g key={i}>
            <rect x={x} y={yTop} width={bw} height={h} rx={3} fill={c0}/>
            <rect x={x + bw * 0.58} y={yTop} width={bw * 0.42} height={h} fill={c1}/>
            {Array.from({length: notches}, (_, k) => <rect key={k} x={x} y={C.yB - (k + 1) * 20} width={bw} height={2.5} fill={K.night} opacity={0.22}/>)}
            <rect x={x} y={yTop} width={bw} height={4} rx={2} fill="#fff" opacity={0.6}/>
          </g>;
        })}
        {/* the average line */}
        {spec.marks.filter((m) => m.line).map((m) => { const a = at(m.key), t = inst(a) ? 1 : easeIO(f, a - 4, a + 18), y = Y(numOf(m, 0).value), c = markCol(m);
          if (t <= 0) return null;
          const xe = C.x0 + (C.x1 - C.x0) * t;
          return <g key={m.key}>
            <line x1={C.x0} x2={xe} y1={y} y2={y} stroke={c} strokeWidth={14} opacity={0.18} strokeLinecap="round"/>
            <line x1={C.x0} x2={xe} y1={y} y2={y} stroke={c} strokeWidth={5} strokeDasharray="18 12" strokeLinecap="round"/>
          </g>; })}
        {/* month marks: pulse on the column top, leader to the rail, a falling arrow for a negative change */}
        {atMarks.map((m, k) => { const a = at(m.key), i = idx(m.at!), y = Y(vals[i]), c = markCol(m);
          if (f < a - 6) return null;
          const prevM = k > 0 ? atMarks[k - 1] : null, neg = numOf(m, 0).value < 0;
          const arr = neg && prevM ? (() => { const pi = idx(prevM.at!), x0 = X(pi), y0 = Y(vals[pi]) - 16, x1 = X(i), y1 = y - 22, t = easeIO(f, a - 6, a + 12);
            const cx = x1 + 40, cy = y0; const pt = (u: number) => [(1 - u) ** 2 * x0 + 2 * (1 - u) * u * cx + u * u * x1, (1 - u) ** 2 * y0 + 2 * (1 - u) * u * cy + u * u * y1];
            const steps = Array.from({length: 21}, (_, j) => pt((j / 20) * t)); const [ex, ey] = steps[20], [px, py] = steps[19];
            const ang = Math.atan2(ey - py, ex - px);
            return <g><path d={steps.map(([sx, sy], j) => `${j ? "L" : "M"}${sx.toFixed(1)} ${sy.toFixed(1)}`).join(" ")} stroke={c} strokeWidth={8} fill="none" strokeLinecap="round"/>
              {t > 0.3 && <path d="M 0 0 L -26 -14 L -26 14 Z" fill={c} transform={`translate(${ex} ${ey}) rotate(${(ang * 180) / Math.PI})`}/>}</g>; })() : null;
          return <g key={m.key}>
            {arr}
            {f >= a && <Pulse x={X(i)} y={y} f={f} r={16} color={c} period={44}/>}
            {f >= a && <circle cx={X(i)} cy={y} r={9 * pop(f, a)} fill={K.white}/>}
          </g>; })}
        <Dust f={f} n={30} seed={12} color={K.tealL} y0={200} y1={900}/>
      </svg>
      {hl && <Place x={(X(hi0) + X(hi1)) / 2} y={C.yT - 52} anchor="b"><Chip text={hl.label} f={f} at={inst(hA) ? -100 : hA + 4} color={K.yellow}/></Place>}
      {spec.marks.map((m) => <Place key={m.key} x={RAIL} y={slotY[m.key]} anchor="c">
        <DBadge n={m} at={at(m.key)} f={f} caption={m.caption} size={92} capSize={30} capW={360} color={markCol(m)} instant={inst(at(m.key))}/>
      </Place>)}
    </Cam>
    <Finish/>
    {spec.title && <Title text={spec.title} f={f} color={K.teal} instant={drawn}/>}
    <SourceTag text={sourceOf(spec.source)} f={f} instant={drawn}/>
  </AbsoluteFill>;
};
