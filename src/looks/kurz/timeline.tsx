// KURZ look, "timeline" scene (data builder, 29 Oct 2026). A horizontal time axis on a dusk ground. At each point a flock of white
// layer hens grows to scale (one hen for one unit, e.g. one lakh birds) just before the narrator says the number; the number lands at
// its key. `shown: true` points are there from frame 0. A pin is a flag pole with a labelled banner at the point whose label equals `at`.
// Spec: {points: (NumIn & {label, shown?})[], unit, pins?: {key, label, at}[], title, source}
import React from "react";
import {AbsoluteFill} from "remotion";
import type {SceneProps} from "../cartoon/long/contract";
import {numOf, sourceOf, type NumIn} from "../cartoon/long/scenes/nk_kit";
import {Cam, DBadge, Dust, Finish, HenG, K, Place, ROUND, SANS, SourceTag, Space, Title, ease, mix, panel, pop, rng} from "./data_kit";

type TPoint = NumIn & {label: string; shown?: boolean};
type TSpec = {points: TPoint[]; unit: string; pins?: {key: string; label: string; at: string}[]; title?: string; source: string};

const AX = 772, PY = 29, HS = 0.27;

export const Scene: React.FC<SceneProps<TSpec>> = ({f, dur, spec, at}) => {
  const uid = "dktl", n = spec.points.length, COLS = n >= 4 ? 9 : 10, PX = n >= 4 ? 30 : 31;
  const xs = spec.points.map((_, i) => 300 + (1560 - 300) * ((i + 0.5) / n));
  const pts = spec.points.map((p, i) => {
    const lock = p.shown ? 0 : at(p.key), v = numOf(p, lock).value, count = Math.round(v);
    if (Math.abs(v - count) > 1e-9) throw new Error(`timeline: ${p.key} = ${v} is not a whole number of icons`);
    const rows = Math.ceil(count / COLS), D = 18 + count * 0.55, start = p.shown ? -1e4 : lock + 6 - D;
    return {p, i, x: xs[i], lock, count, rows, start, D, top: AX - 26 - rows * PY};
  });
  const r = rng(11), firstLock = Math.min(...pts.filter((q) => !q.p.shown).map((q) => q.start), dur), shedT = Math.max(40, firstLock - 20);
  const hills = [0, 1, 2].map((k) => ({amp: 30 + k * 16, ph: r() * 6, y: 600 + k * 48}));
  const ax0 = 170, ax1 = 1720, axT = ease(f, 2, 30);
  return <AbsoluteFill>
    <Space f={f} uid={uid} seed={21} warm glowY={0.78}/>
    <Cam f={f} dur={dur} push={0.03} fy={620}>
      <svg width={1920} height={1080} style={{position: "absolute"}}>
        <defs>
          <linearGradient id={`${uid}-gr`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1C5C6E"/><stop offset="1" stopColor={K.night}/></linearGradient>
          <linearGradient id={`${uid}-ax`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={K.orangeL} stopOpacity={0.2}/><stop offset="0.5" stopColor={K.orangeL}/><stop offset="1" stopColor={K.orangeL} stopOpacity={0.4}/></linearGradient>
          <radialGradient id={`${uid}-sun`}><stop offset="0" stopColor={K.orangeL} stopOpacity={0.55}/><stop offset="1" stopColor={K.orange} stopOpacity={0}/></radialGradient>
        </defs>
        {/* far sun and hills, in parallax */}
        <circle cx={1500 + Math.sin(f / 200) * 10} cy={560} r={300} fill={`url(#${uid}-sun)`}/>
        <circle cx={1500 + Math.sin(f / 200) * 10} cy={600} r={70} fill={K.orangeL} opacity={0.55}/>
        {hills.map((h, k) => { const dx = Math.sin(f / 160) * (4 + k * 5);
          let d = `M -40 1080 L -40 ${h.y}`; for (let x = -40; x <= 1960; x += 40) d += ` L ${x + dx} ${(h.y + Math.sin(x / 210 + h.ph) * h.amp + Math.sin(x / 77 + h.ph * 2) * h.amp * 0.25).toFixed(1)}`;
          d += " L 1960 1080 Z";
          return <path key={k} d={d} fill={mix("#3B2C7A", "#173A63", k / 2)} opacity={0.75 + k * 0.1}/>; })}
        {/* little sheds on the far hills: "sheds went up across the villages" */}
        {Array.from({length: 9}, (_, k) => { const sx = 120 + k * 215 + (k % 2) * 40, sy = 676 + Math.sin(sx / 210 + hills[2].ph) * hills[2].amp - 8, a = 6 + (k * 37 % 9) * (shedT - 6) / 9, t = pop(f, a, 120);
          return <g key={k} opacity={0.8 * Math.min(1, t)} transform={`translate(${sx} ${sy}) scale(${0.42 * t})`}>
            <path d="M -60 0 L -60 -40 L 0 -80 L 60 -40 L 60 0 Z" fill="#2A2560"/><path d="M 0 -80 L 60 -40 L 60 0 L 0 0 Z" fill="#211C4E"/>
            <rect x={-30} y={-30} width={20} height={14} fill={K.yellow} opacity={0.7 + 0.3 * Math.sin(f / 23 + k)}/></g>; })}
        {/* the near ground with a lit edge and swaying grass */}
        <path d={`M -40 ${AX + 8} Q 960 ${AX - 20} 1960 ${AX + 8} L 1960 1100 L -40 1100 Z`} fill={`url(#${uid}-gr)`}/>
        <path d={`M -40 ${AX + 8} Q 960 ${AX - 20} 1960 ${AX + 8}`} stroke={K.tealL} strokeWidth={4} fill="none" opacity={0.5}/>
        {Array.from({length: 46}, (_, k) => { const gx = k * 43 + (k % 3) * 9, gy = AX + 22 + (k % 4) * 30, sw = Math.sin(f / 22 + k * 0.9) * 6;
          return <path key={k} d={`M ${gx} ${gy} q ${-4 + sw * 0.5} -14 ${sw} -26 M ${gx + 6} ${gy} q ${2 + sw * 0.5} -12 ${sw + 8} -20`} stroke={K.tealD} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7}/>; })}
        {/* the axis */}
        <path d={`M ${ax0} ${AX} L ${ax0 + (ax1 - ax0) * axT} ${AX}`} stroke={`url(#${uid}-ax)`} strokeWidth={8} strokeLinecap="round"/>
        {axT > 0.95 && <path d={`M ${ax1 - 4} ${AX - 16} L ${ax1 + 22} ${AX} L ${ax1 - 4} ${AX + 16} Z`} fill={K.orangeL} opacity={ease(f, 28, 36)}/>}
        {pts.map((q) => { const t = q.p.shown ? 1 : pop(f, 4 + q.i * 6);
          return <g key={q.p.key} transform={`translate(${q.x} ${AX}) scale(${t})`}>
            <circle r={26} fill={K.orange} opacity={0.25}/><circle r={14} fill={K.orangeL}/><path d="M 0 -14 A 14 14 0 0 1 0 14 Z" fill={K.orange}/>
          </g>; })}
        {/* flocks: one hen per unit, filling bottom up in a loose grid */}
        {pts.map((q) => {
          const jit = rng(q.i * 7 + 3);
          return <g key={`fl${q.p.key}`}>
            {q.count > 0 && f >= q.start && <ellipse cx={q.x} cy={AX - 8} rx={(COLS * PX) / 2 + 16} ry={18} fill={K.yellowL} opacity={0.1 * ease(f, q.start, q.start + q.D)}/>}
            {Array.from({length: q.count}, (_, j) => {
              const row = Math.floor(j / COLS), c = j % COLS, inRow = Math.min(COLS, q.count - row * COLS);
              const hx = q.x + (c - (inRow - 1) / 2) * PX + (row % 2 ? PX * 0.22 : 0) + (jit() - 0.5) * 6, hy = AX - 20 - row * PY + (jit() - 0.5) * 4;
              const tj = q.start + q.D * (j / Math.max(1, q.count)), s = q.p.shown ? 1 : pop(f, tj, 220);
              return s > 0.01 ? <HenG key={j} x={hx} y={hy} s={HS * s} f={f} seed={q.i * 100 + j} flip={(j * 7 + q.i) % 3 === 0}/> : null;
            })}
          </g>;
        })}
        <Dust f={f} n={36} seed={4} color={K.orangeL} y0={300} y1={1000}/>
      </svg>
      {/* year labels on the ground */}
      {pts.map((q) => { const t = q.p.shown ? 1 : ease(f, 6 + q.i * 6, 20 + q.i * 6);
        return <Place key={`y${q.p.key}`} x={q.x} y={AX + 30} anchor="t"><div style={{...panel(0.6), borderRadius: 14, padding: "4px 18px", fontFamily: ROUND, fontWeight: 800, fontSize: 38, color: K.white, opacity: t, whiteSpace: "nowrap"}}>{q.p.label}</div></Place>; })}
      {/* numbers, at their keys */}
      {pts.map((q) => <Place key={`b${q.p.key}`} x={q.x} y={q.top - 12} anchor="b"><DBadge n={q.p} at={q.lock} f={f} caption={spec.unit} size={108} color={K.yellow} instant={q.p.shown}/></Place>)}
      {/* pins: a flag pole beside the flock, its banner at the top */}
      {(spec.pins ?? []).map((pn) => {
        const q = pts.find((x) => x.p.label === pn.at);
        if (!q) throw new Error(`timeline pin: no point labelled "${pn.at}"`);
        const a = at(pn.key), t = ease(f, a, a + 18), px = q.x + (COLS * PX) / 2 + 30, topY = 268, wave = Math.sin(f / 9) * 6, lt = ease(f, a + 6, a + 20);
        if (f < a) return null;
        return <React.Fragment key={pn.key}>
          <svg width={1920} height={1080} style={{position: "absolute"}}>
            <rect x={px - 4} y={AX - (AX - topY) * t} width={8} height={(AX - topY) * t} rx={4} fill={K.white} opacity={0.85}/>
            <rect x={px} y={AX - (AX - topY) * t} width={4} height={(AX - topY) * t} fill="#AFC0E8"/>
            {t > 0.9 && <path d={`M ${px + 4} ${topY + 8} Q ${px + 34} ${topY + 2 + wave} ${px + 64} ${topY + 14} L ${px + 64} ${topY + 52} Q ${px + 34} ${topY + 40 + wave} ${px + 4} ${topY + 46} Z`} fill={K.pink}/>}
            <circle cx={px} cy={AX} r={10} fill={K.white}/>
          </svg>
          <Place x={px + 12} y={topY - 16} anchor="br">
            <div style={{display: "flex", alignItems: "center", gap: 16, ...panel(0.8), borderRadius: 18, padding: "10px 24px 10px 16px", opacity: lt,
              transform: `translateY(${(1 - lt) * 16}px)`, fontFamily: SANS, fontWeight: 800, fontSize: 34, color: K.white, whiteSpace: "nowrap"}}>
              <svg width={52} height={44} viewBox="-26 -24 52 44"><path d="M -24 -6 L 0 -22 L 24 -6 Z" fill={K.pink}/><path d="M 0 -22 L 24 -6 L 0 -6 Z" fill={K.pinkD}/>
                {[-16, -6, 4, 14].map((cx) => <rect key={cx} x={cx} y={-4} width={5} height={18} fill={K.white}/>)}<rect x={-24} y={14} width={48} height={5} fill={K.white}/></svg>
              {pn.label}
            </div>
          </Place>
        </React.Fragment>;
      })}
    </Cam>
    <Finish/>
    {spec.title && <Title text={spec.title} f={f} color={K.orange}/>}
    <SourceTag text={sourceOf(spec.source)} f={f}/>
    <div style={{position: "absolute", right: 96, top: 868, display: "flex", alignItems: "center", gap: 10, ...panel(0.66), borderRadius: 12, padding: "2px 16px 2px 6px",
      fontFamily: SANS, fontWeight: 700, fontSize: 30, color: K.white, whiteSpace: "nowrap", opacity: ease(f, 10, 26)}}>
      <svg width={46} height={42} viewBox="-60 -70 130 130"><HenG x={0} y={58} s={1} f={f} seed={3}/></svg>each hen = one {spec.unit}
    </div>
  </AbsoluteFill>;
};
