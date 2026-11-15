// DOC scene (Namakkal, 29 Oct 2026): a drawn document page on a desk, the key line swept with a yellow highlighter on the narrator's
// word, the credit pinned below. The page is a drawing, never a copy of the real document, and it says so on screen (spec.label).
import React from "react";
import {AbsoluteFill} from "remotion";
import {C} from "../../palette";
import {Pill, SANS, ROUND, ease, easeIO, pop} from "../../ui";
import {Actor, type Pose, type Who} from "../cast";
import {type SceneProps} from "../contract";
import type {DocSpec} from "./nk_kit";

export type {DocSpec};
const PAGE = {x: 760, y: 120, w: 820, h: 860};

export const Scene: React.FC<SceneProps<DocSpec>> = ({f, dur, spec, at}) => {
  const qa = at(spec.quoteKey), sweep = ease(f, qa, qa + 16), drop = pop(f, 0, 150), push = 1 + 0.06 * easeIO(f, 0, dur);
  const lines = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return <AbsoluteFill style={{background: C.wall}}>
    <svg width={1920} height={1080} style={{position: "absolute"}}>
      <rect x={0} y={700} width={1920} height={380} fill={C.floor}/>
      <rect x={0} y={700} width={1920} height={14} fill={C.floorDark}/>
      {spec.actor && <Actor who={spec.actor.who as Who} x={spec.actor.x} y={spec.actor.y} h={spec.actor.h} f={f} pose={(spec.actor.pose ?? "point") as Pose} flip={spec.actor.flip}/>}
    </svg>
    <div style={{position: "absolute", left: PAGE.x, top: PAGE.y, width: PAGE.w, height: PAGE.h, transform: `translateY(${(1 - drop) * 300}px) rotate(${-2 + drop * 1}deg) scale(${push})`,
      transformOrigin: "50% 40%", background: C.white, border: `8px solid ${C.ink}`, borderRadius: 18, boxShadow: `14px 16px 0 ${C.ink}`, padding: "56px 60px"}}>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 40, color: C.ink, letterSpacing: 1}}>{spec.org.toUpperCase()}</div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: "#5A6680", marginTop: 10}}>{spec.doc}</div>
      <div style={{height: 6, background: C.ink, margin: "26px 0 30px", borderRadius: 3}}/>
      {lines.slice(0, 3).map((i) => <div key={i} style={{height: 18, width: `${92 - (i * 13) % 30}%`, background: "#DDE3EE", borderRadius: 9, marginBottom: 22}}/>)}
      <div style={{position: "relative", margin: "18px 0 30px", padding: "6px 4px"}}>
        <div style={{position: "absolute", left: -10, top: 0, bottom: 0, width: `calc(${sweep * 100}% + 20px)`, background: C.yellow, borderRadius: 10, opacity: 0.9}}/>
        <div style={{position: "relative", fontFamily: ROUND, fontWeight: 800, fontSize: 64, lineHeight: 1.08, color: C.ink}}>“{spec.quote}”</div>
      </div>
      {lines.slice(3, 9).map((i) => <div key={i} style={{height: 18, width: `${95 - (i * 17) % 34}%`, background: "#DDE3EE", borderRadius: 9, marginBottom: 22}}/>)}
    </div>
    <div style={{position: "absolute", left: 96, top: 160}}><Pill text={spec.label} f={f} at={6} dot={C.orange} size={26}/></div>
    <div style={{position: "absolute", left: 96, top: 72}}><Pill text={spec.credit} f={f} at={spec.creditKey ? at(spec.creditKey) : qa + 10} dot={C.blue}/></div>
  </AbsoluteFill>;
};
