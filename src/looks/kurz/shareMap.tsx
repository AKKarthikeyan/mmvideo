// KURZ look, "share-map" scene (data builder, 29 Oct 2026). India (map_geo.ts) as a thick lit tile floating on a deep ocean with
// coastal shelves, a straight-cut shade across the country and a stipple texture. Lit states rise and glow at their keys; states
// with a number get a badge at (bx, by) with a leader line; lit states without a number get a name chip (not in zoom scenes).
// `zoom` eases into a map point over the scene; `pin` (meta.nk_pin) pulses with its label. The source tag adds "map boundaries: draft".
// Spec: {states: (NumIn & {state, color, caption, bx, by})[], lit?: {state, key?, color}[], pin?: {name, key, label}, zoom?: {u, v, s}, title?, source}
import React from "react";
import {AbsoluteFill} from "remotion";
import type {SceneProps} from "../cartoon/long/contract";
import {GEO, GEO_BY, MAP} from "../cartoon/long/scenes/map_geo";
import {pinOf, sourceOf, type ShareMapSpec} from "../cartoon/long/scenes/nk_kit";
import {Cam, Chip, DBadge, Dust, Finish, K, Place, Pulse, SourceTag, Space, Title, col, ease, easeIO, mix, pop} from "./data_kit";

export const Scene: React.FC<SceneProps<ShareMapSpec>> = ({f, dur, spec, at}) => {
  const uid = "dkmp";
  for (const s of [...spec.states, ...(spec.lit ?? [])]) if (!GEO_BY[s.state]) throw new Error(`share-map: no state "${s.state}"`);
  const z = spec.zoom, zt = z ? easeIO(f, 6, Math.max(60, Math.min(dur - 10, 200))) : 0;
  const sc = MAP.s * (1 + ((z?.s ?? 1) - 1) * zt), fx = z ? z.u : 500, fy = z ? z.v : 550;
  const ox = (MAP.x + fx * MAP.s) * (1 - zt) + 760 * zt, oy = (MAP.y + fy * MAP.s) * (1 - zt) + 560 * zt;
  const tf = `translate(${ox} ${oy}) scale(${sc}) translate(${-fx} ${-fy})`;
  const S = (u: number, v: number): [number, number] => [ox + (u - fx) * sc, oy + (v - fy) * sc];

  type Lit = {state: string; color: string; a: number | null; num: boolean};
  const lits: Lit[] = [
    ...spec.states.map((s) => ({state: s.state, color: col(s.color, K.orange), a: at(s.key), num: true})),
    ...(spec.lit ?? []).filter((l) => !spec.states.some((s) => s.state === l.state)).map((l) => ({state: l.state, color: col(l.color, K.orange), a: l.key ? at(l.key) : null, num: false})),
  ];
  const litT = (l: Lit) => (l.a === null ? 1 : pop(f, l.a - 2, 120));
  const pin = spec.pin ? pinOf(spec.pin.name) : null, pA = spec.pin ? at(spec.pin.key) : 0, pinT = spec.pin ? pop(f, pA) : 0;
  const breathe = 0.5 + 0.5 * Math.sin(f / 22);
  const u1 = 1 / sc;
  return <AbsoluteFill>
    <Space f={f} uid={uid} seed={61} glowY={0.6}/>
    <Cam f={f} dur={dur} push={z ? 0 : 0.03} fx={930} fy={520}>
      <svg width={1920} height={1080} style={{position: "absolute"}}>
        <defs>
          <filter id={`${uid}-blur`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={12 * u1}/></filter>
          <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={18 * u1}/></filter>
          <linearGradient id={`${uid}-land`} gradientUnits="userSpaceOnUse" x1="150" y1="0" x2="850" y2="1100"><stop offset="0" stopColor="#4D66CF"/><stop offset="1" stopColor="#24398F"/></linearGradient>
          <pattern id={`${uid}-dots`} width={12} height={12} patternUnits="userSpaceOnUse"><circle cx={3} cy={3} r={1.3} fill="#fff" opacity={0.16}/><circle cx={9} cy={9} r={1} fill="#fff" opacity={0.1}/></pattern>
          <clipPath id={`${uid}-all`}>{GEO.map((g) => <path key={g.name} d={g.d}/>)}</clipPath>
          {lits.map((l, i) => <clipPath key={i} id={`${uid}-lc${i}`}><path d={GEO_BY[l.state].d}/></clipPath>)}
        </defs>
        {/* faint latitude lines over the ocean */}
        {Array.from({length: 9}, (_, k) => <path key={k} d={`M 0 ${140 + k * 110} Q 960 ${120 + k * 110 + Math.sin(f / 90 + k) * 6} 1920 ${140 + k * 110}`} stroke={K.haze} strokeWidth={2} opacity={0.08} fill="none"/>)}
        <g transform={tf}>
          {/* coastal shelves: the outline stroked wide, three times, breathing slowly */}
          {[150, 90, 44].map((w, k) => <g key={w} opacity={0.06 + k * 0.03}>{GEO.map((g) => <path key={g.name} d={g.d} fill="none" stroke={K.teal} strokeWidth={w + Math.sin(f / 40 + k) * 6} strokeLinejoin="round"/>)}</g>)}
          <g filter={`url(#${uid}-blur)`} opacity={0.5}>{GEO.map((g) => <path key={g.name} d={g.d} fill="none" stroke={K.tealL} strokeWidth={10} strokeLinejoin="round"/>)}</g>
          {/* thickness */}
          {[14, 9, 5].map((dy, k) => <g key={dy} transform={`translate(${dy * 0.4} ${dy})`}>{GEO.map((g) => <path key={g.name} d={g.d} fill={mix("#0A1240", K.deep, k / 2)}/>)}</g>)}
          {/* the land, with a lit rim, stipple and a straight-cut shade */}
          {GEO.map((g) => <path key={g.name} d={g.d} fill={`url(#${uid}-land)`} stroke="#6E86E6" strokeWidth={1.4 * u1 * 0.8 + 0.6} strokeLinejoin="round"/>)}
          <g clipPath={`url(#${uid}-all)`}>
            <rect x={0} y={0} width={1000} height={1100} fill={`url(#${uid}-dots)`}/>
            <path d="M 560 -50 L 1100 -50 L 1100 1200 L 160 1200 Z" fill={K.night} opacity={0.22}/>
          </g>
          {/* lit states: glow, lift, own shade cut */}
          {lits.map((l, i) => { const t = litT(l); if (t <= 0.01) return null; const g = GEO_BY[l.state], lift = -9 * t;
            return <g key={l.state}>
              <path d={g.d} fill={l.color} opacity={(0.45 + 0.2 * breathe) * Math.min(1, t)} filter={`url(#${uid}-glow)`}/>
              <path d={g.d} fill="#000" opacity={0.35 * Math.min(1, t)} transform="translate(3 6)"/>
              <g transform={`translate(0 ${lift})`} opacity={Math.min(1, t)}>
                <path d={g.d} fill={l.color}/>
                <g clipPath={`url(#${uid}-lc${i})`}><path d={`M ${g.lx + 8} ${g.bbox[1] - 50} L ${g.bbox[2] + 50} ${g.bbox[1] - 50} L ${g.bbox[2] + 50} ${g.bbox[3] + 50} L ${g.lx - 60} ${g.bbox[3] + 50} Z`} fill="#000" opacity={0.2}/></g>
                <path d={g.d} fill="none" stroke="#fff" strokeWidth={2.2 * u1 + 0.4} opacity={0.55}/>
              </g>
            </g>; })}
          {/* pin */}
          {pin && pinT > 0 && <g transform={`translate(${pin[0]} ${pin[1]}) scale(${(pinT * 1) / sc})`}>
            <Pulse x={0} y={0} f={f} r={22} color={K.white} period={44}/>
            <ellipse cx={4} cy={8} rx={18} ry={7} fill="#000" opacity={0.35}/>
            <circle r={17} fill={K.white}/><path d="M 0 -17 A 17 17 0 0 1 0 17 Z" fill="#C9D3F0"/><circle r={8} fill={K.pink}/>
          </g>}
        </g>
        {/* leader lines from badges to their states */}
        {spec.states.map((s) => { const a = at(s.key), t = ease(f, a, a + 14); if (t <= 0) return null; const g = GEO_BY[s.state], [sx, sy] = S(g.lx, g.ly);
          const ex = sx + (s.bx - sx) * t, ey = sy + (s.by - sy) * t;
          return <g key={s.key}><line x1={sx} y1={sy} x2={ex} y2={ey} stroke={col(s.color, K.orange)} strokeWidth={4} opacity={0.8}/><circle cx={sx} cy={sy} r={9} fill={K.white}/><circle cx={sx} cy={sy} r={5} fill={col(s.color, K.orange)}/></g>; })}
        <Dust f={f} n={30} seed={16} color={K.tealL}/>
      </svg>
      {/* name chips for lit states without a number (full map only) */}
      {!z && lits.filter((l) => !l.num).map((l) => { const g = GEO_BY[l.state], [x, y] = S(g.bbox[2], g.ly);
        return <Place key={`c${l.state}`} x={x + 22} y={y} anchor="l"><Chip text={l.state} f={f} at={l.a ?? 0} color={l.color}/></Place>; })}
      {pin && spec.pin && pinT > 0 && (() => { const [x, y] = S(pin[0], pin[1]);
        return <Place x={x - 40} y={y} anchor="r"><Chip text={spec.pin.label} f={f} at={pA + 4} color={K.pink} size={36}/></Place>; })()}
      {spec.states.map((s) => { const a = at(s.key);
        return <Place key={s.key} x={s.bx} y={s.by} anchor="c"><DBadge n={{...s, suffix: s.suffix ?? "%"}} at={a} f={f} caption={s.caption ?? s.state} size={112} capW={520} color={col(s.color, K.orange)}/></Place>; })}
    </Cam>
    <Finish/>
    {spec.title && <Title text={spec.title} f={f} color={K.teal}/>}
    <SourceTag text={`${sourceOf(spec.source)} · map boundaries: draft`} f={f} x={1824} right maxW={760}/>
  </AbsoluteFill>;
};
