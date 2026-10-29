// SCENE KIND "map" (long-form cartoon): the India state map in the cartoon style. Flat fills, an 8px ink silhouette with a hard offset
// shadow, states that fill in as a staggered wave, label chips, ranked lists, a legend and a note for a state with no figure.
// Modes: "scale" (7 flat classes, cool below replacement to warm above), "threshold" (two colours at replacement) and "risers"
// (states that rose by riseMin or more between two surveys pulse). Spec fields: see MapSpec in map_geo.ts.
// Every printed digit comes from fig() and is drawn only from the frame of its reveal key (at(key)); a state with no figure throws,
// except the ones the spec lists in `missing` (default Manipur), which are hatched and noted.
import React from "react";
import {C} from "../../palette";
import {ease, pop} from "../../ui";
import type {SceneProps} from "../contract";
import {fig} from "../figs";
import {CHIP_H, Chips, ChipLines, LEGEND, LIST_W, Legend, ListCard, NOTE, Note, chipWidth, legendHeight, listHeight, type ChipData, type ListRow} from "./map_parts";
import {place, type Item, type Rect} from "./map_place";
import {GEO, MAP, NEUTRAL, PALE, PALE_FOCUS, SMALL, SURVEY, TINY_ISLANDS, WARM, buildModel, chipName, shortName, darkOf, fmt, mix, px, py, targetFill, tenths, valueFor,
  type MapSpec, type St} from "./map_geo";

export type {MapSpec} from "./map_geo";

const u = (p: number) => p / MAP.s;     // screen px -> map units (strokes inside the scaled group)
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const SIL = 17;           // silhouette stroke (px): 8.5px of ink outside every edge
const BORDER = 2.6;       // inner state border (px)
const BOTTOM = 912;       // lowest edge of any card (caption strip below)
const TITLE = "Children per woman";

export const Scene: React.FC<SceneProps<MapSpec>> = ({f, dur, spec, at}) => {
  const m = React.useMemo(() => buildModel(spec), [spec]);
  const fill0 = spec.fillKey ? at(spec.fillKey) : 14;
  const wave = spec.waveFrames ?? Math.round(GEO.length * 1.15);
  const waveEnd = Math.round(fill0 + wave + 8);
  const hlAt = spec.highlightKey ? at(spec.highlightKey) : waveEnd;
  const riserAt = spec.riserKey ? at(spec.riserKey) : waveEnd - 6;
  const noteAt = spec.noteKey ? at(spec.noteKey) : waveEnd;
  const legendAt = spec.legendKey ? at(spec.legendKey) : fill0;
  const digitsOk = !!spec.legendKey;

  // ---- highlight set
  const hl = new Set<string>(
    spec.highlight === "above" ? m.have.filter((s) => s.above).map((s) => s.name)
    : spec.highlight === "below" ? m.have.filter((s) => s.below).map((s) => s.name)
    : spec.highlight === "at" ? m.have.filter((s) => s.at).map((s) => s.name)
    : spec.highlight === "risers" ? m.have.filter((s) => s.riser).map((s) => s.name)
    : (spec.highlight ?? []).map((n) => { if (!m.by[n]) throw new Error(`map: highlight names unknown state "${n}"`); return n; }));
  const dimP = hl.size ? ease(f, hlAt, hlAt + 10) : 0;

  // ---- per-state drawing numbers
  type D = {st: St; tf: string; tfFlat: string; col: string; hp: number; rp: number};
  const draw: D[] = m.sts.map((st) => {
    const a = fill0 + st.wave * (wave / GEO.length), g = st.g;
    const fp = ease(f, a, a + 7);
    const rp = st.riser ? ease(f, riserAt, riserAt + 8) : 0;
    const target = m.mode === "risers" ? (st.missing ? PALE : mix(NEUTRAL, WARM, rp)) : targetFill(m, st);
    let col = mix(PALE, target, st.missing ? 0 : fp);
    const isHl = hl.has(st.name), hp = isHl ? ease(f, hlAt, hlAt + 10) : 0;
    if (hl.size && !isHl && !(m.mode === "risers" && st.riser)) col = mix(col, PALE_FOCUS, 0.62 * dimP);
    const wob = f >= a ? Math.sin(Math.PI * clamp01((f - a) / 14)) * 0.07 : 0;
    const breathe = rp > 0 ? 0.035 * rp * (1 + Math.sin((f - riserAt) / 3.2) * 0.5) : isHl ? 0.012 * hp * Math.sin((f - hlAt) / 5) : 0;
    const sc = 1 + wob + 0.03 * hp + breathe;
    const lift = u(6) * Math.max(hp, rp);
    return {st, col, hp, rp,
      tf: `translate(${g.lx} ${g.ly - lift}) scale(${sc}) translate(${-g.lx} ${-g.ly})`,
      tfFlat: `translate(${g.lx} ${g.ly}) scale(${sc}) translate(${-g.lx} ${-g.ly})`};
  });
  const ordered = [...draw].sort((a, b) => a.st.g.ly - b.st.g.ly);

  // ---- cards: legend (top left), lowest list (bottom left), highest list (top right)
  const L = spec.lists;
  const forbid: Rect[] = [{x0: 1470, y0: 36, x1: 1830, y1: 112}];             // the brand bug
  const legendOn = spec.legend !== false;
  if (legendOn) forbid.push({x0: LEGEND.x, y0: LEGEND.y, x1: LEGEND.x + LEGEND.w, y1: LEGEND.y + legendHeight(m.mode, spec.title ?? TITLE) + 14});
  let listNodes: React.ReactNode = null;
  if (L) {
    const lowKey = L.lowKey ?? L.key, highKey = L.highKey ?? L.key, show = L.show ?? "both";
    if ((show !== "high" && !lowKey) || (show !== "low" && !highKey)) throw new Error("map: lists needs a reveal key (lists.key, or lowKey and highKey)");
    const byV = (a: St, b: St) => tenths(a.v!) - tenths(b.v!) || a.name.localeCompare(b.name);
    const groups = (arr: St[], n: number) => {       // whole tie groups only, so "lowest 5" never cuts a tie in half
      const out: St[] = [];
      for (let i = 0; i < arr.length;) {
        let j = i; while (j < arr.length && tenths(arr[j].v!) === tenths(arr[i].v!)) j++;
        if (out.length && out.length + (j - i) > n) break;
        out.push(...arr.slice(i, j)); i = j; if (out.length >= n) break;
      }
      return out.slice(0, 6);
    };
    const asc = m.have.slice().sort(byV), desc = m.have.slice().sort((a, b) => tenths(b.v!) - tenths(a.v!) || a.name.localeCompare(b.name));
    const pick = (names: string[] | undefined, arr: St[], n: number) => names ? names.map((nm) => { const s = m.by[nm]; if (!s) throw new Error(`map: lists names unknown state "${nm}"`); return s; }) : groups(arr, n);
    const row = (s: St): ListRow => ({name: s.name === "Andaman and Nicobar Islands" ? "Andaman & Nicobar" : shortName(s.name), value: fmt(valueFor(m, s.name)), color: darkOf(m, s)});
    const nodes: React.ReactNode[] = [];
    if (show !== "high") {
      const rows = pick(L.low, asc, L.lowN ?? 5).map(row);
      const top = legendOn ? LEGEND.y + legendHeight(m.mode, spec.title ?? TITLE) + 26 : 130;
      let rowH = 54; while (rows.length > 1 && BOTTOM - listHeight(rows.length, rowH) < top && rowH > 44) rowH -= 2;
      let n = rows.length; while (n > 1 && BOTTOM - listHeight(n, rowH) < top) n--;
      const used = rows.slice(0, n), h = listHeight(n, rowH), y = BOTTOM - h;
      forbid.push({x0: 96, y0: y, x1: 96 + LIST_W, y1: y + h + 14});
      nodes.push(<ListCard key="low" x={96} y={y} rowH={rowH} title="LOWEST" band={C.blue} up={false} rows={used} at={at(lowKey!)} f={f} from="left"/>);
    }
    if (show !== "low") {
      const rows = pick(L.high, desc, L.highN ?? 5).map(row);
      const y = 118, rowH = 54, h = listHeight(rows.length, rowH);
      forbid.push({x0: 1824 - LIST_W, y0: y, x1: 1824, y1: y + h + 14});
      nodes.push(<ListCard key="high" x={1824 - LIST_W} y={y} rowH={rowH} title="HIGHEST" band={C.orange} up rows={rows} at={at(highKey!)} f={f} from="right"/>);
    }
    listNodes = nodes;
  }

  // ---- chips and note: placed by map_place (least land covered, nothing overlapping, short leader lines)
  const items = (spec.labelStates ?? []).map((it) => typeof it === "string" ? {state: it, key: undefined as string | undefined} : {state: it.state, key: it.key});
  const fmtMode = spec.labelFmt ?? (m.mode === "risers" ? "change" : "value");
  const missing = m.sts.filter((s) => s.missing);
  const noteText = `not in ${SURVEY[m.mode === "risers" ? m.to : m.s].label} release`;
  type Pre = Omit<ChipData, "cx" | "cy" | "leader">;
  const pre: Pre[] = items.map((it) => {
    const key = it.key ?? spec.labelKey;
    if (!key) throw new Error(`map: label chip "${it.state}" has no reveal key (set labelKey, or {state, key})`);
    const st = m.by[it.state];
    if (!st) throw new Error(`map: labelStates names unknown state "${it.state}"`);
    const g = st.g, base = {state: it.state, name: chipName(it.state), pinX: px(g.lx), pinY: py(g.ly), at: at(key), color: darkOf(m, st)};
    if (fmtMode === "change") {
      const a = fig({t: "tfr", state: it.state, s: m.from}).value, b = fig({t: "tfr", state: it.state, s: m.to}).value;
      const change: [string, string] = [fmt(a), fmt(b)];
      return {...base, change, w: chipWidth(base.name, undefined, change), color: tenths(b) - tenths(a) >= tenths(m.riseMin) ? C.orangeDark : C.royalDark};
    }
    const value = fmt(valueFor(m, it.state));
    return {...base, value, w: chipWidth(base.name, value)};
  });
  const perKey: Record<string, number> = {};
  pre.forEach((c) => { const k = String(c.at); c.at += 4 * (perKey[k] ?? 0); perKey[k] = (perKey[k] ?? 0) + 1; });
  const sig = JSON.stringify([spec, forbid]);
  const placed = React.useMemo(() => {
    const its: Item[] = [
      ...missing.map((s) => ({id: `note:${s.name}`, state: s.name, pinX: px(s.g.lx), pinY: py(s.g.ly), w: NOTE.w + 28, h: NOTE.h + 28, note: true})),
      ...pre.map((c) => ({id: c.state, state: c.state, pinX: c.pinX, pinY: c.pinY, w: c.w, h: CHIP_H})),
    ];
    const pins = [...GEO.filter((g) => SMALL.has(g.name)).map((g) => ({state: g.name, x: px(g.lx), y: py(g.ly)})), ...pre.map((c) => ({state: c.state, x: c.pinX, y: c.pinY}))];
    const keep = new Set<string>([...hl, ...m.have.filter((x) => x.riser).map((x) => x.name)]);
    const out = place(its, forbid, pins, keep);
    if (spec.chipAt) for (const [s, [dx, dy]] of Object.entries(spec.chipAt)) { const c = pre.find((x) => x.state === s); if (c) out[s] = {cx: c.pinX + dx, cy: c.pinY + dy, leader: dx !== 0 || dy !== 0}; }
    return out;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);
  const chips: ChipData[] = pre.map((c) => ({...c, ...placed[c.state]}));

  const zoom = spec.push === false ? 1 : 1 + 0.02 * clamp01(f / Math.max(1, dur));
  const enter = ease(f, 0, 14);
  const mapScale = 0.93 + 0.07 * enter;
  const T = `translate(${MAP.x} ${MAP.y}) scale(${MAP.s})`;
  const cx0 = px(500), cy0 = py(550);

  return <div style={{position: "absolute", inset: 0, background: C.sky2, overflow: "hidden"}}>
    <Backdrop f={f}/>
    <div style={{position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: `${cx0}px ${cy0}px`}}>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, opacity: enter}}>
        <defs>
          <pattern id="mapHatch" patternUnits="userSpaceOnUse" width={u(15)} height={u(15)} patternTransform="rotate(45)">
            <rect width={u(15)} height={u(15)} fill={C.white}/><rect width={u(6.5)} height={u(15)} fill={C.fridgeDark}/>
          </pattern>
        </defs>
        <g transform={`translate(${cx0} ${cy0}) scale(${mapScale}) translate(${-cx0} ${-cy0})`}>
          <g transform={T}>
            {/* hard offset shadow, then the 8px ink silhouette */}
            <g transform={`translate(0 ${u(14)})`}>{ordered.map((d) => <path key={d.st.name} d={d.st.g.d} fillRule="evenodd" fill={C.shadow} stroke={C.shadow} strokeWidth={u(TINY_ISLANDS.has(d.st.name) ? 4 : SIL)} strokeLinejoin="round" transform={d.tfFlat}/>)}</g>
            {ordered.map((d) => <path key={d.st.name} d={d.st.g.d} fillRule="evenodd" fill={C.ink} stroke={C.ink} strokeWidth={u(TINY_ISLANDS.has(d.st.name) ? 4 : SIL)} strokeLinejoin="round" transform={d.tfFlat}/>)}
            {/* fills */}
            {ordered.map((d) => <g key={d.st.name} transform={d.tfFlat}>
              <path d={d.st.g.d} fillRule="evenodd" fill={d.col} stroke={C.ink} strokeWidth={u(BORDER)} strokeLinejoin="round"/>
              {d.st.missing && <path d={d.st.g.d} fillRule="evenodd" fill="url(#mapHatch)" stroke={C.ink} strokeWidth={u(BORDER)} strokeLinejoin="round"/>}
            </g>)}
            {/* highlighted and rising states lift off the map */}
            {ordered.filter((d) => Math.max(d.hp, d.rp) > 0.001).map((d) => <g key={d.st.name}>
              <path d={d.st.g.d} fillRule="evenodd" fill={C.shadow} transform={`translate(0 ${u(12)}) ${d.tfFlat}`}/>
              <path d={d.st.g.d} fillRule="evenodd" fill={d.col} stroke={C.ink} strokeWidth={u(6)} strokeLinejoin="round" transform={d.tf}/>
              {d.rp > 0 && <Pulse d={d.st.g.d} tf={d.tf} f={f - riserAt}/>}
            </g>)}
            {/* ring markers for the small states and union territories */}
            {ordered.filter((d) => SMALL.has(d.st.name)).map((d) => {
              const g = d.st.g, a = fill0 + d.st.wave * (wave / GEO.length), p = pop(f, a, 220), lift = Math.max(d.hp, d.rp), r = u(13 + 4 * lift) * Math.min(1.2, p);
              if (p <= 0.001) return null;
              return <g key={d.st.name}>
                <circle cx={g.lx} cy={g.ly + u(9)} r={r} fill={C.shadow}/>
                <circle cx={g.lx} cy={g.ly - u(5 * lift)} r={r} fill={d.col} stroke={C.ink} strokeWidth={u(5)}/>
                {d.rp > 0 && <PulseDot cx={g.lx} cy={g.ly - u(5 * lift)} r={r} f={f - riserAt}/>}
              </g>;
            })}
          </g>
        </g>
      </svg>
      <ChipLines chips={chips} f={f}/>
      {missing.map((s) => { const p = placed[`note:${s.name}`]; return <Note key={s.name} name={s.name} text={noteText} cx={p.cx} cy={p.cy} at={noteAt} f={f} pinX={px(s.g.lx)} pinY={py(s.g.ly)}/>; })}
      <Chips chips={chips} f={f}/>
    </div>
    {legendOn && <Legend m={m} title={spec.title ?? TITLE} at={legendAt} digits={digitsOk} f={f} f0={riserAt}/>}
    {listNodes}
  </div>;
};

// A growing, fading ring that repeats: "this state is moving".
const Pulse: React.FC<{d: string; tf: string; f: number}> = ({d, tf, f}) => {
  if (f < 0) return null;
  return <>{[0, 14].map((o) => { const k = ((f + o) % 28) / 28; return <path key={o} d={d} fillRule="evenodd" fill="none" stroke={C.yellow} strokeWidth={u(6 + 34 * k)} strokeLinejoin="round" opacity={(1 - k) * 0.9} transform={tf}/>; })}</>;
};
const PulseDot: React.FC<{cx: number; cy: number; r: number; f: number}> = ({cx, cy, r, f}) => {
  if (f < 0) return null;
  return <>{[0, 14].map((o) => { const k = ((f + o) % 28) / 28; return <circle key={o} cx={cx} cy={cy} r={r + u(4 + 34 * k)} fill="none" stroke={C.yellow} strokeWidth={u(7)} opacity={(1 - k) * 0.95}/>; })}</>;
};

// Sea: soft dots and a few wave marks that drift, so the map never sits on a dead flat colour.
const Backdrop: React.FC<{f: number}> = ({f}) => {
  const waves = [[380, 700], [490, 840], [450, 560], [1060, 640], [1090, 860], [1220, 720], [920, 850], [540, 930]];
  return <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
    <defs><pattern id="seaDots" width={44} height={44} patternUnits="userSpaceOnUse"><circle cx={22} cy={22} r={3.2} fill="#CBDFF1"/></pattern></defs>
    <rect width={1920} height={1080} fill="url(#seaDots)"/>
    {waves.map(([x, y], i) => <path key={i} d="M 0 0 q 14 -14 28 0 t 28 0 t 28 0" fill="none" stroke="#A5C6E6" strokeWidth={6} strokeLinecap="round" transform={`translate(${x + Math.sin(f / 30 + i) * 8} ${y + Math.sin(f / 22 + i * 2) * 5})`}/>)}
  </svg>;
};
