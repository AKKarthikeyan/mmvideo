// Test scene for cast_b: spec {sheet: "all" | "equal" | "poses" | "mouths" | "sizes" | "one", who?, pose?, f?, mouth?, h?, flip?, since?, look?, seed?}. Not part of the video.
import React from "react";
import {C} from "../../palette";
import {SANS} from "../../ui";
import {Actor, RELH, WHO, type Pose, type Who} from "../cast_b";
import type {SceneProps} from "../contract";

const POSES: Pose[] = ["idle", "present", "point", "cheer", "worried"];
const Label: React.FC<{x: number; y: number; t: string; size?: number}> = ({x, y, t, size = 30}) => <text x={x} y={y} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={size} fill={C.ink}>{t}</text>;

export const Scene: React.FC<SceneProps> = ({f, spec}) => {
  const sheet: string = spec.sheet ?? "all", fl = spec.f ?? f, mouth = spec.mouth ?? "X";
  const bg = <><rect width={1920} height={1080} fill={C.sky2}/><rect y={900} width={1920} height={180} fill={C.floor}/><rect y={892} width={1920} height={14} fill={C.floorDark}/></>;
  if (sheet === "all") {
    const H = spec.h ?? 470;
    return <svg width={1920} height={1080}>{bg}
      {WHO.map((w, i) => <g key={w}><Actor who={w} x={125 + i * 240} y={960} h={H * RELH[w]} f={fl} seed={i + 1} pose={spec.pose ?? "idle"} mouth={mouth}/><Label x={125 + i * 240} y={1040} t={w}/></g>)}</svg>;
  }
  if (sheet === "equal") {
    return <svg width={1920} height={1080}>{bg}
      {WHO.map((w, i) => <g key={w}><Actor who={w} x={130 + i * 237} y={960} h={620} f={fl} seed={i + 1} pose={spec.pose ?? "idle"} mouth={mouth}/><Label x={130 + i * 237} y={1040} t={w}/></g>)}</svg>;
  }
  if (sheet === "poses") {
    const who: Who = spec.who ?? "uncle";
    return <svg width={1920} height={1080}>{bg}
      {POSES.map((p, i) => <g key={p}><Actor who={who} x={200 + i * 380} y={960} h={who === "baby" ? 420 : RELH[who] * 520} f={fl} seed={3} pose={p} mouth={mouth}/><Label x={200 + i * 380} y={1040} t={p}/></g>)}</svg>;
  }
  if (sheet === "mouths") {
    const who: Who = spec.who ?? "uncle", L = "XABCDEFGH".split("");
    return <svg width={1920} height={1080}><rect width={1920} height={1080} fill={C.sky2}/>
      {L.map((m, i) => <g key={m}><Actor who={who} x={110 + i * 212} y={560} h={who === "baby" ? 330 : RELH[who] * 400} f={fl} seed={2} mouth={m}/><Label x={110 + i * 212} y={620} t={m}/></g>)}
      {[1, 4, 7].map((k, i) => <Actor key={i} who={WHO[k]} x={400 + i * 600} y={1040} h={RELH[WHO[k]] * 360} f={fl} seed={5 + i} mouth={"BDC"[i]}/>)}</svg>;
  }
  if (sheet === "sizes") {   // every character at 300 px tall, then three at 900 px
    const who: Who[] = spec.list ?? WHO;
    return <svg width={1920} height={1080}>{bg}
      {who.map((w, i) => <Actor key={"s" + w} who={w} x={90 + i * 108} y={960} h={300} f={fl} seed={i + 1} pose={spec.pose ?? "idle"}/>)}
      {who.slice(0, 3).map((w, i) => <Actor key={"b" + w} who={w} x={1100 + i * 280} y={1060} h={900 * RELH[w]} f={fl} seed={i + 1} pose={spec.pose ?? "idle"}/>)}</svg>;
  }
  if (sheet === "strip") {   // one actor over spec.frames (local frames), pose from spec.pose; since/seed passed through
    const w: Who = spec.who ?? "uncle", fr: number[] = spec.frames ?? [0, 5, 10, 15, 20, 25], n = fr.length, step = 1920 / n;
    return <svg width={1920} height={1080}>{bg}
      {fr.map((k, i) => <g key={k}><Actor who={w} x={step * (i + 0.5)} y={960} h={spec.h ?? 440} f={k} seed={spec.seed ?? 3} pose={spec.pose ?? "idle"} since={spec.since} mouth={mouth} flip={spec.flip}/><Label x={step * (i + 0.5)} y={1040} t={`f${k}`}/></g>)}</svg>;
  }
  const w: Who = spec.who ?? "uncle";
  return <svg width={1920} height={1080}>{bg}<Actor who={w} x={960} y={1000} h={spec.h ?? 800} f={fl} seed={spec.seed ?? 3} pose={spec.pose ?? "idle"} mouth={mouth} flip={spec.flip} look={spec.look} since={spec.since}/></svg>;
};
