// The closing map of a basket story ("map" and "mapend" beats), for any look: the existing state map
// (src/datayt/StateMap.tsx, code-drawn from public/datayt/india/geo.json; never an image) with every state's number,
// restyled only through brand tokens: a brand ground, brand ink and empty tones, brand fonts, and the brand's map ramp
// when it has one (else the story's own five bands). The layout keeps every word inside the safe box.
import React from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {MAP_RATIO, StateMap} from "../../datayt/StateMap";
import type {ColorRole, LookBrand} from "../brands/types";
import {fitFont, fitLines, fitSize, wrap} from "./fit";
import {plain, RichLines} from "./text";
import type {LookBeat, LookData} from "./types";

const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});

// top: where the heading starts (default the safe box top; a look with chrome above passes its own). reserveBottom: room
// kept free above the safe box bottom (the brand bug).
export type MapCloseProps = {L: LookData; B: LookBrand; b: LookBeat; ground?: ColorRole; headFont?: "display" | "serif" | "body"; top?: number; reserveBottom?: number};

export const MapClose: React.FC<MapCloseProps> = ({L, B, b, ground = "paper", headFont = "display", top, reserveBottom = 60}) => {
  const f = useCurrentFrame();
  const {x0, x1, y1} = B.safe, W = x1 - x0, y0 = top ?? B.safe.y0;
  const end = b.kind === "mapend";
  const ink = B.c.ink, acc = B.c.accent;
  const head = end ? b.q ?? "" : b.title ?? "";
  const hf = fitFont(B.f[headFont]);
  const H = fitLines(plain(head), hf, W, 2, 76, 44);
  const lh = Math.round(H.size * 1.06);
  const body = fitFont(B.f.body);
  const subSize = fitSize(b.sub ?? "", body, W, end ? 40 : 32, 18);
  const subTop = y0 + H.lines.length * lh + 10;
  const mapTop = subTop + subSize + 26;
  // footer: the caution note, the sources on the last card, and room for the brand bug
  const noteSize = 28, note = b.note ?? "";
  const noteLines = note ? wrap(note, body, noteSize, W) : [];
  const src = end ? fitLines(L.sourceLines.join(" · "), fitFont(B.f.body), W, 6, 24, 18) : null;
  const footH = (noteLines.length ? noteLines.length * Math.round(noteSize * 1.25) + 12 : 0) + (src ? src.lines.length * Math.round(src.size * 1.3) + 10 : 0);
  const mapBottom = y1 - reserveBottom - footH - 14;
  // the map is kept 45 px inside the box on each side: labels nudged off small states reach about that far out
  const h = Math.max(300, Math.min(mapBottom - mapTop, (W - 90) / MAP_RATIO)), w = h * MAP_RATIO;
  const ring = Object.fromEntries((b.ring ?? []).map((n) => [n, ink]));
  const noteIn = end ? 1 : ease(f, Math.min(b.f0 + 135, b.f1 - 75), Math.min(b.f0 + 147, b.f1 - 63));
  return <AbsoluteFill style={{background: B.c[ground]}}>
    <RichLines text={head} lines={H.lines} acc={acc} lineHeight={lh}
      style={{position: "absolute", left: x0, top: y0, width: W, ...B.f[headFont].css, fontSize: H.size, color: ink}}/>
    <div style={{position: "absolute", left: x0, top: subTop, width: W, ...B.f.body.css, fontSize: subSize, lineHeight: 1.1, whiteSpace: "nowrap",
      color: end ? B.c.accent2Text : B.c.softInk, fontWeight: end ? 700 : 500}}>{b.sub}</div>
    {b.legend && <div style={{position: "absolute", left: x0, top: mapTop - 22, display: "flex", gap: 24}}>
      {b.legend.map((k) => <div key={k.label} style={{display: "flex", alignItems: "center", gap: 8, ...B.f.body.css, fontSize: 24, color: ink}}>
        <div style={{width: 22, height: 22, borderRadius: 5, background: k.color, border: `1.5px solid ${B.c.line}`}}/>{k.label}</div>)}
    </div>}
    <div style={{opacity: end ? 1 : ease(f, b.f0, b.f0 + 8)}}>
      <StateMap states={L.D.map ?? []} colors={B.mapRamp ?? L.bands} x={x0 + (W - w) / 2} y={mapTop} h={h} fs={20} frame={b.anim ? f : null} t0={b.f0} ring={ring}
        pal={{ink, bg: B.c[ground], empty: B.c.empty, light: B.c.paper}} font={B.f.body.family}/>
    </div>
    {noteLines.length > 0 && <div style={{position: "absolute", left: x0, width: W, top: mapBottom + 14, ...B.f.body.css, fontWeight: 500, fontSize: noteSize, lineHeight: 1.25,
      color: ink, opacity: noteIn}}>{noteLines.map((l, i) => <div key={i} style={{whiteSpace: "pre"}}>{l}</div>)}</div>}
    {src && <div style={{position: "absolute", left: x0, width: W, top: mapBottom + 14 + (noteLines.length ? noteLines.length * Math.round(noteSize * 1.25) + 12 : 0),
      ...B.f.body.css, fontWeight: 500, fontSize: src.size, lineHeight: 1.3, color: B.c.softInk}}>{src.lines.map((l, i) => <div key={i} style={{whiteSpace: "pre"}}>{l}</div>)}</div>}
  </AbsoluteFill>;
};
