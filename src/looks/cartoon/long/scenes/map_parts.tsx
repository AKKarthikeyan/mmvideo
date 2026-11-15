// MAP scene UI pieces in the cartoon style: white cards with an 8px ink border and a hard offset shadow, label chips with a leader
// line, ranked list cards, the legend and the "not in release" note. Digits are drawn only from the frame passed in `at`.
import React from "react";
import {C} from "../../palette";
import {ROUND, SANS, pop} from "../../ui";
import {measure} from "../../../shared/fit";
import {SCALE, COOL, WARM, NEUTRAL, REPL, SURVEY, fmt, shortName, type Model} from "./map_geo";

const CARD: React.CSSProperties = {position: "absolute", background: C.white, border: `8px solid ${C.ink}`, borderRadius: 34, boxShadow: `0 12px 0 ${C.ink}`, boxSizing: "border-box"};
const NUM: React.CSSProperties = {fontFamily: ROUND, fontWeight: 800, lineHeight: 1, fontFeatureSettings: "'lnum' 1"};
const W_SANS = (t: string, px: number) => measure(t, {family: SANS, weight: 800, tnum: false}, px);
const W_NUM = (t: string, px: number) => measure(t, {family: ROUND, weight: 800, tnum: false, letterSpacing: -0.02}, px);

const fitPx = (t: string, w: number, max: number, min: number) => { let s = max; while (s > min && W_SANS(t, s) > w) s--; return s; };
const Arrow: React.FC<{size: number; color: string}> = ({size, color}) =>
  <svg width={size * 1.1} height={size * 0.7} viewBox="0 0 44 28" style={{display: "block", flex: "none"}}>
    <path d="M 3 14 L 36 14 M 24 3 L 38 14 L 24 25" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"/></svg>;

// ---- chips ------------------------------------------------------------------------------------------------------------
export const CHIP_H = 76;
export type ChipData = {state: string; name: string; cx: number; cy: number; pinX: number; pinY: number; at: number; color: string; value?: string; change?: [string, string]; leader: boolean; w: number};
export const chipWidth = (name: string, value?: string, change?: [string, string]) => {
  const chrome = 22 + 24 + 12;           // padding + borders
  const v = value !== undefined ? 14 + W_NUM(value, 48) : change ? 14 + W_NUM(change[0], 46) + 8 + 44 * 1.1 + 8 + W_NUM(change[1], 46) : 0;
  return Math.ceil(chrome + W_SANS(name, 34) + v);
};

export const ChipLines: React.FC<{chips: ChipData[]; f: number}> = ({chips, f}) =>
  <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
    {chips.filter((c) => c.leader).map((c) => {
      const t = pop(f, c.at, 200); if (t <= 0.001) return null;
      const k = Math.min(1, t);
      return <g key={c.state}>
        <line x1={c.pinX} y1={c.pinY} x2={c.pinX + (c.cx - c.pinX) * k} y2={c.pinY + (c.cy - c.pinY) * k} stroke={C.ink} strokeWidth={5} strokeLinecap="round"/>
        <circle cx={c.pinX} cy={c.pinY} r={9 * k} fill={C.white} stroke={C.ink} strokeWidth={5}/>
      </g>;
    })}
  </svg>;

export const Chips: React.FC<{chips: ChipData[]; f: number}> = ({chips, f}) => <>
  {chips.map((c) => {
    const t = pop(f, c.at, 170); if (t <= 0.001) return null;
    return <div key={c.state} style={{position: "absolute", left: c.cx, top: c.cy, transform: `translate(-50%, -50%) scale(${t}) rotate(${(1 - Math.min(1, t)) * -6}deg)`, transformOrigin: "50% 50%",
      display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap", background: C.white, border: `6px solid ${C.ink}`, borderRadius: 999, boxShadow: `0 8px 0 ${C.ink}`,
      padding: "6px 24px 8px 22px", height: CHIP_H, boxSizing: "border-box"}}>
      <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, lineHeight: 1, color: C.ink}}>{c.name}</span>
      {c.value !== undefined && <span style={{...NUM, fontSize: 48, color: c.color, letterSpacing: -1}}>{c.value}</span>}
      {c.change && <span style={{display: "flex", alignItems: "center", gap: 8, ...NUM, fontSize: 46, letterSpacing: -1}}>
        <span style={{color: C.royalDark}}>{c.change[0]}</span><Arrow size={40} color={C.ink}/><span style={{color: c.color}}>{c.change[1]}</span></span>}
    </div>;
  })}
</>;

// ---- ranked lists -----------------------------------------------------------------------------------------------------
export const LIST_W = 420, LIST_HEAD = 66, LIST_HERO = 140, LIST_FRAME = 16;
export const listHeight = (rows: number, rowH: number) => LIST_HEAD + LIST_HERO + Math.max(0, rows - 1) * rowH + LIST_FRAME;
export type ListRow = {name: string; value: string; color: string};

const ALT: Record<string, string> = {"Andaman & Nicobar": "A & N Islands", "Dadra & Daman": "Dadra-Daman"};
const rowName = (r: ListRow) => W_SANS(r.name, 34) + 12 + W_NUM(r.value, 48) > LIST_W - 16 - 48 ? ALT[r.name] ?? r.name : r.name;
export const ListCard: React.FC<{x: number; y: number; rowH: number; title: string; band: string; up: boolean; rows: ListRow[]; at: number; f: number; from: "left" | "right"}> =
  ({x, y, rowH, title, band, up, rows, at, f, from}) => {
  const t = pop(f, at, 170); if (t <= 0.001) return null;
  const [hero, ...rest] = rows, k = Math.min(1, t);
  return <div style={{...CARD, left: x, top: y, width: LIST_W, height: listHeight(rows.length, rowH), overflow: "hidden", transform: `translateX(${(1 - k) * (from === "right" ? 100 : -100)}px) scale(${0.85 + 0.15 * t})`,
    transformOrigin: from === "right" ? "100% 0%" : "0% 100%", opacity: Math.min(1, t * 2)}}>
    <div style={{background: band, color: C.white, fontFamily: ROUND, fontWeight: 800, fontSize: 38, letterSpacing: 3, padding: "7px 24px 0", height: LIST_HEAD, borderBottom: `7px solid ${C.ink}`, boxSizing: "border-box"}}>{title}</div>
    {hero && (() => { const p = pop(f, at + 6, 200); return <div style={{height: LIST_HERO, padding: "10px 24px 0", position: "relative", opacity: Math.min(1, p * 2), transform: `scale(${0.75 + 0.25 * p})`, transformOrigin: "0% 50%"}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: fitPx(hero.name, LIST_W - 16 - 48 - 4, 38, 34), lineHeight: 1.05, color: C.ink, whiteSpace: "nowrap"}}>{hero.name}</div>
      <div style={{...NUM, fontSize: 100, color: hero.color, letterSpacing: -3, marginTop: 6}}>{hero.value}</div>
      <svg width={84} height={84} viewBox="0 0 92 92" style={{position: "absolute", right: 22, top: 46}}>
        <circle cx={46} cy={46} r={40} fill={band} stroke={C.ink} strokeWidth={7}/>
        <path d={up ? "M 46 66 L 46 28 M 28 44 L 46 26 L 64 44" : "M 46 26 L 46 64 M 28 48 L 46 66 L 64 48"} fill="none" stroke={C.white} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>; })()}
    {rest.map((r, i) => { const p = pop(f, at + 12 + i * 6, 200); return <div key={r.name} style={{height: rowH, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "0 24px",
      borderTop: `3px dashed rgba(23,32,58,0.28)`, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p)) * 60 * (from === "right" ? 1 : -1)}px)`, boxSizing: "border-box"}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, color: C.ink, whiteSpace: "nowrap"}}>{rowName(r)}</div>
      <div style={{...NUM, fontSize: 48, color: r.color, letterSpacing: -1}}>{r.value}</div>
    </div>; })}
  </div>;
};

// ---- legend -----------------------------------------------------------------------------------------------------------
export const LEGEND = {x: 96, y: 64, w: 400};
const LEG_TITLE = 36, LEG_ROW = 40;
export const legendLines = (title: string) => W_NUM(title, LEG_TITLE) <= LEGEND.w - 16 - 44 - 26 ? 1 : 2;
export const legendHeight = (mode: Model["mode"], title: string) =>
  14 + legendLines(title) * (LEG_TITLE + 4) + (4 + 38 + 14) + (mode === "scale" ? LEG_ROW * 7 : mode === "threshold" ? 74 + 16 + 74 + 60 : 74 + 16 + 62) + 22 + 16;
const Swatch: React.FC<{color: string; w: number; h: number; r?: number}> = ({color, w, h, r = 10}) =>
  <div style={{width: w, height: h, background: color, border: `5px solid ${C.ink}`, borderRadius: r, boxSizing: "border-box", flex: "none"}}/>;

export const Legend: React.FC<{m: Model; title: string; at: number; digits: boolean; f: number; f0: number}> = ({m, title, at, digits, f, f0}) => {
  const t = pop(f, at, 170); if (t <= 0.001) return null;
  const sw = SURVEY[m.mode === "risers" ? m.to : m.s];
  const L = (s: string) => <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, lineHeight: "37px", color: C.ink, whiteSpace: "nowrap"}}>{s}</div>;
  const bar = (color: string) => <div style={{width: 6, alignSelf: "stretch", margin: "6px 0", background: color, borderRadius: 3, flex: "none"}}/>;
  let body: React.ReactNode;
  if (m.mode === "scale") {
    const rowH = LEG_ROW, order = [6, 5, 4, 3, 2, 1, 0];       // warm at the top
    body = <div style={{display: "flex", gap: 16, alignItems: "stretch"}}>
      <div style={{display: "flex", flexDirection: "column", flex: "none"}}>
        {order.map((b, i) => <div key={b} style={{width: 62, height: rowH, background: SCALE[b].fill, border: `5px solid ${C.ink}`, borderTopWidth: i === 0 ? 5 : 0, boxSizing: "border-box",
          borderRadius: i === 0 ? "14px 14px 0 0" : i === 6 ? "0 0 14px 14px" : 0}}/>)}
      </div>
      <div style={{position: "relative", flex: 1, height: rowH * 7}}>
        <div style={{position: "absolute", top: 0, height: rowH * 2, display: "flex", alignItems: "center", gap: 10}}>{bar(C.orangeDark)}<div>{L("above")}{L("replacement")}</div></div>
        <div style={{position: "absolute", top: rowH * 2, height: rowH, display: "flex", alignItems: "center", gap: 10}}>{bar("#8A6500")}{L(digits ? `at ${fmt(REPL)}` : "at replacement")}</div>
        <div style={{position: "absolute", top: rowH * 3, height: rowH * 4, display: "flex", alignItems: "center", gap: 10}}>{bar(C.blueDark)}<div>{L("below")}{L("replacement")}</div></div>
      </div>
    </div>;
  } else if (m.mode === "threshold") {
    body = <div style={{display: "flex", flexDirection: "column", gap: 16}}>
      <div style={{display: "flex", alignItems: "center", gap: 16}}><Swatch color={WARM} w={62} h={62} r={14}/><div>{L("above")}{L("replacement")}</div></div>
      <div style={{display: "flex", alignItems: "center", gap: 16}}><Swatch color={COOL} w={62} h={62} r={14}/><div>{L("at or below")}{L("replacement")}</div></div>
      {digits && <div style={{...NUM, fontFamily: ROUND, fontSize: 40, color: C.royal, marginTop: 2, whiteSpace: "nowrap"}}>{`replacement = ${fmt(REPL)}`}</div>}
    </div>;
  } else {
    const grow = 1 + 0.08 * Math.sin((f - f0) / 4);
    body = <div style={{display: "flex", flexDirection: "column", gap: 16}}>
      <div style={{display: "flex", alignItems: "center", gap: 16}}><div style={{transform: `scale(${grow})`}}><Swatch color={WARM} w={62} h={62} r={14}/></div><div>{L("went up")}{digits ? L(`by ${fmt(m.riseMin)} or more`) : null}</div></div>
      <div style={{display: "flex", alignItems: "center", gap: 16}}><Swatch color={NEUTRAL} w={62} h={62} r={14}/><div>{L("no big rise")}</div></div>
    </div>;
  }
  return <div style={{...CARD, left: LEGEND.x, top: LEGEND.y, width: LEGEND.w, height: legendHeight(m.mode, title), padding: "14px 22px 0", transform: `translateX(${(1 - Math.min(1, t)) * -100}px) scale(${0.85 + 0.15 * t})`,
    transformOrigin: "0% 0%", opacity: Math.min(1, t * 2)}}>
    <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: LEG_TITLE, lineHeight: `${LEG_TITLE + 4}px`, color: C.ink, letterSpacing: -0.5, height: legendLines(title) * (LEG_TITLE + 4)}}>{title}</div>
    <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, color: C.royal, margin: "4px 0 14px", whiteSpace: "nowrap"}}>{`${sw.label} · ${sw.years}`}</div>
    {body}
  </div>;
};

// ---- note for a state that is not in the release ----------------------------------------------------------------------
export const NOTE = {w: 292, h: 152};
export const Note: React.FC<{cx: number; cy: number; name: string; text: string; at: number; f: number; pinX: number; pinY: number}> = ({cx, cy, name, text, at, f, pinX, pinY}) => {
  const t = pop(f, at, 170); if (t <= 0.001) return null;
  const k = Math.min(1, t);
  return <>
    <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
      <line x1={pinX} y1={pinY} x2={pinX + (cx - pinX) * k} y2={pinY + (cy - pinY) * k} stroke={C.ink} strokeWidth={5} strokeLinecap="round" strokeDasharray="1 12"/>
      <circle cx={pinX} cy={pinY} r={8 * k} fill={C.white} stroke={C.ink} strokeWidth={5}/>
    </svg>
    <div style={{...CARD, left: cx - NOTE.w / 2, top: cy - NOTE.h / 2, width: NOTE.w, height: NOTE.h, padding: "10px 20px 0", borderStyle: "dashed", borderRadius: 28, transform: `scale(${t}) rotate(${(1 - k) * 5}deg)`, transformOrigin: "50% 50%"}}>
      <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: 40, lineHeight: 1.05, color: C.ink}}>{shortName(name)}</div>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, lineHeight: 1.1, color: C.redDark, marginTop: 4}}>{text}</div>
    </div>
  </>;
};
