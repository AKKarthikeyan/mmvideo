// Shared pieces for Shorts 1 and 5 (vertical 1080x1920): the moat card and small helpers. Reuses scene 05/06 drawing parts.
import React from "react";
import {C, F, clamp01, ease, outCubic, spr} from "../kit/tokens";
import {Txt} from "../parts56";

/** Moat card (n of 5): serif title, the question, five dots with the nth filled. Present from the first frame. */
export const MoatCard: React.FC<{f: number; n: number; title: string; sub: string; tag?: string}> = ({f, n, title, sub, tag}) => {
  const e = spr(f, -8, 11, 170);
  return (
    <>
      <div style={{position: "absolute", left: 60, right: 60, top: 560, textAlign: "center", fontFamily: F.serif, fontSize: 150, lineHeight: 1, whiteSpace: "nowrap", color: C.ink,
        transform: `scale(${0.8 + 0.2 * e})`, opacity: clamp01(e * 3)}}>
        <span style={{background: C.highlight, padding: "0 22px"}}>{title}</span>
      </div>
      <Txt f={f} at={-4} text={sub} x={540} y={920} size={44} weight={600} color={C.inkSoft}/>
      <div style={{position: "absolute", left: 0, right: 0, top: 1060, display: "flex", justifyContent: "center", gap: 26}}>
        {[1, 2, 3, 4, 5].map((i) => <div key={i} style={{width: 46, height: 46, borderRadius: 23, background: i === n ? C.teal : "transparent", border: `5px solid ${i === n ? C.teal : C.grey}`,
          transform: `scale(${i === n ? 1 + 0.25 * Math.sin(Math.PI * ease(f, 4, 22)) : 1})`}}/>)}
      </div>
      <Txt f={f} at={0} text={`${n} OF 5 KINDS OF MOAT`} x={540} y={1150} size={30} weight={800} color={C.grey} spacing={4}/>
      {tag ? <Txt f={f} at={6} text={tag} x={540} y={1230} size={30} weight={600} color={C.grey}/> : null}
    </>
  );
};

/** World position of a photo fraction inside a PhotoPrint card (object-fit cover, centred). */
export type Card = {x: number; y: number; w: number; h: number; pw: number; ph: number; b: number};
export const cardPt = (c: Card, fx: number, fy: number): [number, number] => {
  const iw = c.w - 2 * c.b, ih = c.h - 2 * c.b, k = Math.max(iw / c.pw, ih / c.ph);
  return [c.x + (fx - 0.5) * c.pw * k, c.y + (fy - 0.5) * c.ph * k];
};

/** Rounded check / cross / ! / ? badge (code-drawn). */
export const Badge: React.FC<{x: number; y: number; kind: "yes" | "no" | "note"; at: number; f: number; r?: number}> = ({x, y, kind, at, f, r = 40}) => {
  const p = spr(f, at, 12, 200);
  if (p <= 0) return null;
  const col = kind === "yes" ? C.teal : kind === "no" ? C.rust : C.grey;
  return (
    <svg width={r * 2} height={r * 2} viewBox="-50 -50 100 100" style={{position: "absolute", left: x - r, top: y - r, transform: `scale(${p})`, overflow: "visible"}}>
      <circle r={46} fill={col}/>
      {kind === "yes" ? <path d="M -22 2 L -6 18 L 24 -16" fill="none" stroke={C.white} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round"/> : null}
      {kind === "no" ? <path d="M -18 -18 L 18 18 M 18 -18 L -18 18" fill="none" stroke={C.white} strokeWidth={10} strokeLinecap="round"/> : null}
      {kind === "note" ? <text x={0} y={22} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={64} fill={C.white}>!</text> : null}
    </svg>
  );
};
export {outCubic};
