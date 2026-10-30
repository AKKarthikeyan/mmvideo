// KURZ look scenes: the same storyboard kinds and specs as the cartoon long-form engine (stage, statement, doc, share-map,
// price-line), drawn in the Kurzgesagt-like look. Numbers come from the same fig() keys and lock on the same reveal frames.
// The cartoon host ("uncle") is left out: this look has no presenter. Spec colours written for the cartoon palette are mapped.
import React from "react";
import {AbsoluteFill} from "remotion";
import type {SceneProps} from "../cartoon/long/contract";
import {GEO, GEO_BY, MAP} from "../cartoon/long/scenes/map_geo";
import {dayLabel, numOf, pinOf, seriesOf, sourceOf, type DocSpec, type PriceLineSpec, type ShareMapSpec} from "../cartoon/long/scenes/nk_kit";
import {Coin, Dawn, Egg, Glow, Hen, K, KBadge, KPill, Person, ROUND, SANS, Stars, ease, easeIO, pop} from "./kit";

const COL: Record<string, string> = {"#F58A1F": K.orange, "#2F6FDE": K.teal, "#E03A3E": K.pink, "#1B3FA0": K.yellow};
const col = (c: string | undefined, d: string) => (c ? COL[c] ?? c : d);
const Night: React.FC<{f: number; seed?: number}> = ({f, seed = 3}) => <svg width={1920} height={1080} style={{position: "absolute"}}>
  <defs><radialGradient id={`kn${seed}`} cx="0.5" cy="0.35" r="0.9"><stop offset="0" stopColor={K.mid}/><stop offset="0.6" stopColor={K.deep}/><stop offset="1" stopColor={K.night}/></radialGradient></defs>
  <rect width={1920} height={1080} fill={`url(#kn${seed})`}/><Stars f={f} seed={seed}/>
</svg>;
const Source: React.FC<{text: string; x?: number; y?: number}> = ({text, x = 96, y = 880}) =>
  <div style={{position: "absolute", left: x, top: y, fontFamily: SANS, fontWeight: 600, fontSize: 24, color: "rgba(244,247,255,0.75)", background: "rgba(11,20,51,0.6)", borderRadius: 10, padding: "4px 12px"}}>{text}</div>;

// ---- stage -----------------------------------------------------------------------------------------------------------------------
type StageSpec = {set: string; actors?: {id: string; who: string; x: number; y: number; h: number; flip?: boolean; enter?: string}[];
  props?: {icon: string; x: number; y: number; s: number; enter?: string; seed?: number}[];
  badges?: {key: string; ref: any; caption?: string; x: number; y: number; size?: number; decimals?: number; prefix?: string; suffix?: string}[];
  pills?: {text: string; x: number; y: number; key?: string}[]};
const Stage: React.FC<SceneProps<StageSpec>> = ({f, dur, spec, at}) => {
  const inT = (k?: string) => (k ? pop(f, at(k)) : 1);
  const push = 1 + 0.05 * easeIO(f, 0, dur);
  return <AbsoluteFill>
    <div style={{position: "absolute", inset: 0, transform: `scale(${push})`, transformOrigin: "50% 60%"}}>
      {spec.set === "village" ? <Dawn f={f} id="kdawn"/> : <Night f={f}/>}
      <svg width={1920} height={1080} style={{position: "absolute"}}>
        {(spec.actors ?? []).filter((a) => a.who !== "uncle").map((a, i) => { const t = inT(a.enter); return t > 0.01 &&
          <g key={a.id} opacity={Math.min(1, t)} transform={`translate(0 ${(1 - t) * 60})`}><Person x={a.x} y={a.y} h={a.h} f={f} flip={a.flip} seed={i} color={K.teal} shade={K.tealD}/></g>; })}
        {(spec.props ?? []).map((p, i) => { const t = inT(p.enter); if (t <= 0.01) return null;
          const s = p.s * Math.min(1.08, t);
          const art = p.icon === "egg" ? <Egg x={p.x} y={p.y} s={s} f={f} seed={i}/> : p.icon === "hen" ? <Hen x={p.x} y={p.y} s={s} f={f} seed={p.seed ?? i} flip={i % 2 === 1}/>
            : p.icon === "rupee" ? <Coin x={p.x} y={p.y} s={s} f={f}/>
            : p.icon === "calendar" ? <g transform={`translate(${p.x} ${p.y}) scale(${s})`}><rect x={-48} y={-40} width={96} height={88} rx={16} fill={K.white}/><path d="M -48 -12 L -48 -24 Q -48 -40 -32 -40 L 32 -40 Q 48 -40 48 -24 L 48 -12 Z" fill={K.pink}/>
                {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={-32 + c * 24} y={-2 + r * 16} width={14} height={10} rx={3} fill={r === 1 && c === 1 ? K.orange : K.haze} opacity={0.8}/>))}</g>
            : (() => { throw new Error(`kurz stage: no art for icon "${p.icon}"`); })();
          return <g key={i}>{art}</g>; })}
      </svg>
    </div>
    {(spec.badges ?? []).map((b) => { const t = at(b.key); return <div key={b.key} style={{position: "absolute", left: b.x, top: b.y, transform: "translate(-50%, -50%)"}}>
      <KBadge n={numOf(b, t)} f={f} at={t} caption={b.caption} size={b.size ?? 150}/></div>; })}
    {(spec.pills ?? []).map((p) => <div key={p.text} style={{position: "absolute", left: p.x, top: p.y}}><KPill text={p.text} f={f} at={p.key ? at(p.key) : 4}/></div>)}
  </AbsoluteFill>;
};

// ---- statement -------------------------------------------------------------------------------------------------------------------
const Statement: React.FC<SceneProps<{lines: (string | {text: string})[]}>> = ({f, spec}) => {
  const lines = spec.lines.map((l) => (typeof l === "string" ? l : l.text));
  return <AbsoluteFill>
    <Night f={f} seed={7}/>
    <svg width={1920} height={1080} style={{position: "absolute"}}>
      <defs><Glow id="kst" sd={30}/></defs>
      <g transform={`translate(1460 560) rotate(${f / 4})`}>
        <ellipse rx={210} ry={250} fill={K.cream} filter="url(#kst)" opacity={0.95}/>
        <path d="M 30 -250 A 210 250 0 0 1 30 250 Z" fill={K.creamD}/>
      </g>
      {[0, 1, 2].map((i) => <ellipse key={i} cx={1460} cy={560} rx={330 + i * 60} ry={70 + i * 14} fill="none" stroke={K.teal} strokeWidth={4} opacity={0.35 - i * 0.08}
        transform={`rotate(${-18 + Math.sin(f / 40 + i) * 3} 1460 560)`}/>)}
    </svg>
    <div style={{position: "absolute", left: 140, top: 300, width: 1000}}>
      {lines.map((l, i) => { const t = ease(f, 4 + i * 8, 20 + i * 8); return <div key={i} style={{fontFamily: ROUND, fontWeight: 800, fontSize: 112, lineHeight: 1.08, color: K.white,
        opacity: t, transform: `translateY(${(1 - t) * 30}px)`}}>
        {l.split("*").map((part, j) => j % 2 ? <span key={j} style={{color: K.yellow, textShadow: `0 0 30px ${K.yellow}88`}}>{part}</span> : <span key={j}>{part}</span>)}
      </div>; })}
    </div>
  </AbsoluteFill>;
};

// ---- doc -------------------------------------------------------------------------------------------------------------------------
const Doc: React.FC<SceneProps<DocSpec>> = ({f, dur, spec, at}) => {
  const qa = at(spec.quoteKey), sweep = ease(f, qa, qa + 16), t = pop(f, 0, 110), float = Math.sin(f / 28) * 8;
  return <AbsoluteFill>
    <Night f={f} seed={5}/>
    <div style={{position: "absolute", left: 780, top: 120, width: 820, height: 800, transform: `translateY(${(1 - t) * 200 + float}px) rotate(-3deg) scale(${1 + 0.05 * easeIO(f, 0, dur)})`,
      background: K.cream, borderRadius: 26, boxShadow: `40px 50px 0 rgba(0,0,0,0.28), 0 0 80px ${K.haze}55`, padding: "60px 64px", overflow: "hidden"}}>
      <div style={{position: "absolute", right: 0, top: 0, bottom: 0, width: 140, background: K.creamD, opacity: 0.6}}/>
      <div style={{position: "relative", fontFamily: SANS, fontWeight: 900, fontSize: 38, color: K.deep, letterSpacing: 1}}>{spec.org.toUpperCase()}</div>
      <div style={{position: "relative", fontFamily: SANS, fontWeight: 700, fontSize: 30, color: K.soft, marginTop: 10}}>{spec.doc}</div>
      <div style={{position: "relative", height: 6, background: K.deep, margin: "26px 0 30px", borderRadius: 3, opacity: 0.8}}/>
      {[0, 1, 2].map((i) => <div key={i} style={{position: "relative", height: 16, width: `${90 - i * 9}%`, background: K.creamD, borderRadius: 8, marginBottom: 22}}/>)}
      <div style={{position: "relative", margin: "18px 0 30px", padding: "6px 4px"}}>
        <div style={{position: "absolute", left: -12, top: 0, bottom: 0, width: `calc(${sweep * 100}% + 24px)`, background: K.yellow, borderRadius: 12, boxShadow: `0 0 40px ${K.yellow}`}}/>
        <div style={{position: "relative", fontFamily: ROUND, fontWeight: 800, fontSize: 62, lineHeight: 1.08, color: K.deep}}>“{spec.quote}”</div>
      </div>
      {[3, 4, 5, 6, 7].map((i) => <div key={i} style={{position: "relative", height: 16, width: `${94 - (i * 17) % 30}%`, background: K.creamD, borderRadius: 8, marginBottom: 22}}/>)}
    </div>
    <div style={{position: "absolute", left: 96, top: 72}}><KPill text={spec.credit} f={f} at={spec.creditKey ? at(spec.creditKey) : qa + 10} color={K.teal}/></div>
    <div style={{position: "absolute", left: 96, top: 140}}><KPill text={spec.label} f={f} at={6} color={K.orange} size={24}/></div>
  </AbsoluteFill>;
};

// ---- share-map -------------------------------------------------------------------------------------------------------------------
const ShareMap: React.FC<SceneProps<ShareMapSpec>> = ({f, dur, spec, at}) => {
  for (const s of [...spec.states, ...(spec.lit ?? [])]) if (!GEO_BY[s.state]) throw new Error(`share-map: no state "${s.state}"`);
  const z = spec.zoom, zt = z ? easeIO(f, 0, dur) : 0;
  const sc = MAP.s * (1 + ((z?.s ?? 1) - 1) * zt), fx = z ? z.u : 500, fy = z ? z.v : 550;
  const ox = (MAP.x + fx * MAP.s) * (1 - zt) + 760 * zt, oy = (MAP.y + fy * MAP.s) * (1 - zt) + 560 * zt;
  const tf = `translate(${ox} ${oy}) scale(${sc}) translate(${-fx} ${-fy})`;
  const lit = (name: string): [string, number] | null => {
    const s = spec.states.find((x) => x.state === name); if (s) return [col(s.color, K.orange), ease(f, at(s.key), at(s.key) + 12)];
    const l = (spec.lit ?? []).find((x) => x.state === name); if (l) return [col(l.color, K.orange), l.key ? ease(f, at(l.key), at(l.key) + 12) : 1];
    return null;
  };
  const pin = spec.pin ? pinOf(spec.pin.name) : null, pinT = spec.pin ? pop(f, at(spec.pin.key)) : 0;
  return <AbsoluteFill>
    <Night f={f} seed={11}/>
    <svg width={1920} height={1080} style={{position: "absolute"}}>
      <defs><Glow id="kmap" sd={10}/></defs>
      <g transform={tf}>
        {GEO.map((g) => <path key={`s${g.name}`} d={g.d} fill="#000" opacity={0.3} transform="translate(6 10)"/>)}
        {GEO.map((g) => <path key={g.name} d={g.d} fill={K.soft} stroke={K.haze} strokeWidth={1.5 / sc}/>)}
        {GEO.map((g) => { const l = lit(g.name); return l && l[1] > 0 ? <path key={`l${g.name}`} d={g.d} fill={l[0]} opacity={l[1]} filter="url(#kmap)"/> : null; })}
        {pin && pinT > 0 && <g transform={`translate(${pin[0]} ${pin[1]}) scale(${pinT / sc})`}>
          {[0, 1].map((i) => <circle key={i} r={22 + ((f * 0.8 + i * 20) % 40)} fill="none" stroke={K.white} strokeWidth={4} opacity={1 - ((f * 0.8 + i * 20) % 40) / 40}/>)}
          <circle r={16} fill={K.white}/><circle r={8} fill={K.pink}/>
        </g>}
      </g>
    </svg>
    {pin && spec.pin && pinT > 0 && <div style={{position: "absolute", left: ox + (pin[0] - fx) * sc + 44, top: oy + (pin[1] - fy) * sc - 30}}><KPill text={spec.pin.label} f={f} at={at(spec.pin.key)} color={K.pink}/></div>}
    {spec.states.map((s) => { const t = at(s.key); return <div key={s.key} style={{position: "absolute", left: s.bx, top: s.by, transform: "translate(-50%, -50%)"}}>
      <KBadge n={numOf({...s, suffix: s.suffix ?? "%"}, t)} f={f} at={t} caption={s.caption ?? s.state} size={100} color={col(s.color, K.orange)}/></div>; })}
    {spec.title && <div style={{position: "absolute", left: 96, top: 72}}><KPill text={spec.title} f={f} at={4}/></div>}
    <Source text={`${sourceOf(spec.source)} · map boundaries: draft`} y={spec.title ? 136 : 72}/>
  </AbsoluteFill>;
};

// ---- price-line ------------------------------------------------------------------------------------------------------------------
const P = {x0: 330, y0: 250, x1: 1760, y1: 800};
const PriceLine: React.FC<SceneProps<PriceLineSpec>> = ({f, dur, spec, at}) => {
  const pts = seriesOf(spec.series), n = pts.length;
  const X = (i: number) => P.x0 + (P.x1 - P.x0) * (i / (n - 1));
  const Y = (v: number) => P.y1 - (P.y1 - P.y0) * ((v - spec.y0) / (spec.y1 - spec.y0));
  const top = Math.max(...pts.map((p) => p.v));
  const bottom = Math.min(...pts.map((p) => p.v));
  const idx = (w: string) => (w === "max" ? pts.findIndex((p) => p.v === top) : w === "min" ? pts.findIndex((p) => p.v === bottom)
    : w === "last" ? n - 1 : pts.findIndex((p) => p.d === w));
  const u = spec.drawn ? 1 : easeIO(f, 8, Math.max(9, spec.drawKey ? at(spec.drawKey) : Math.round(dur * 0.6)));
  const cut = u * (n - 1), k = Math.floor(cut);
  const sh = pts.slice(0, k + 1).map((p, i) => [X(i), Y(p.v)] as const);
  if (k < n - 1) { const a = pts[k], b = pts[k + 1]; sh.push([X(cut), Y(a.v + (b.v - a.v) * (cut - k))]); }
  const d = sh.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = sh.length > 1 ? `${d} L${sh[sh.length - 1][0]} ${P.y1} L${sh[0][0]} ${P.y1} Z` : "";
  const ticks: number[] = []; for (let v = spec.y0; v <= spec.y1 + 1e-9; v += spec.ystep) ticks.push(v);
  const run = pts.map((p, i) => [p, i] as const).filter(([p]) => p.v === top);
  const bandT = spec.band ? ease(f, at(spec.band.key), at(spec.band.key) + 14) : 0;
  return <AbsoluteFill>
    <Night f={f} seed={13}/>
    <svg width={1920} height={1080} style={{position: "absolute"}}>
      <defs><Glow id="kln" sd={9}/><linearGradient id="kar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={K.orange} stopOpacity={0.45}/><stop offset="1" stopColor={K.orange} stopOpacity={0}/></linearGradient></defs>
      {spec.band && <rect x={X(run[0][1]) - 6} y={P.y0 - 20} width={X(run[run.length - 1][1]) - X(run[0][1]) + 12} height={P.y1 - P.y0 + 20} rx={10} fill={K.yellow} opacity={0.18 * bandT}/>}
      {ticks.map((v) => <g key={v}><line x1={P.x0} x2={P.x1} y1={Y(v)} y2={Y(v)} stroke={K.white} strokeOpacity={v === spec.y0 ? 0.5 : 0.12} strokeWidth={v === spec.y0 ? 3 : 2}/>
        <text x={P.x0 - 24} y={Y(v) + 11} textAnchor="end" fontFamily={ROUND} fontWeight={800} fontSize={32} fill={K.white} opacity={0.75}>₹{v.toFixed(2)}</text></g>)}
      {pts.map((p, i) => p.d.endsWith("-01") ? <text key={p.d} x={X(i)} y={P.y1 + 50} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={30} fill={K.white} opacity={0.75}>{dayLabel(p.d)}</text> : null)}
      {area && <path d={area} fill="url(#kar)"/>}
      <path d={d} fill="none" stroke={K.orange} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" filter="url(#kln)"/>
      {u < 1 && sh.length > 0 && <circle cx={sh[sh.length - 1][0]} cy={sh[sh.length - 1][1]} r={14} fill={K.white} filter="url(#kln)"/>}
      {spec.marks.map((m) => { const i = idx(m.at), t = at(m.key); return f >= t ? <circle key={m.key} cx={X(i)} cy={Y(pts[i].v)} r={13 * pop(f, t)} fill={K.white} filter="url(#kln)"/> : null; })}
    </svg>
    {spec.marks.map((m) => { const i = idx(m.at), t = at(m.key), x = X(i) + (m.dx ?? 0), y = Y(pts[i].v) + (m.dy ?? 0), side = m.side ?? "above";
      const st: React.CSSProperties = side === "left" ? {right: 1920 - x + 36, top: y - 80} : side === "below" ? {left: x, top: y + 36, transform: "translateX(-50%)"} : {left: x, bottom: 1080 - y + 36, transform: "translateX(-50%)"};
      return <div key={m.key} style={{position: "absolute", ...st}}><KBadge n={numOf(m, t)} f={f} at={t} caption={m.caption} size={84} color={col(m.color, K.yellow)}/></div>; })}
    {spec.title && <div style={{position: "absolute", left: 96, top: 72}}><KPill text={spec.title.toUpperCase()} f={f} at={4} color={K.orange}/></div>}
    <Source text={sourceOf(spec.source)} x={P.x0} y={P.y1 + 80}/>
  </AbsoluteFill>;
};

export const KURZ_SCENES: Record<string, React.FC<SceneProps>> = {stage: Stage, statement: Statement, doc: Doc, "share-map": ShareMap, "price-line": PriceLine};
