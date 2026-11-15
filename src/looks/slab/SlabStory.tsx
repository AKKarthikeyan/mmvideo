// SLAB (kinetic poster type), the first of the three premium looks (docs/datakadai/looks/LOOKS_SPEC.md, "Kadai Slab").
// Full-bleed brand slabs that change on the story's bar downbeats (clip-path wipes, 6 frames, never the same direction
// twice running), poster type fitted to the safe width on Anybody's width axis, and the Board: every printed number is
// a row of blank split-flap tiles until the narrator says it, a glyph-free reel, then digits locking right to left from
// the measured lock frame (never before it). One shared-scale rail per unit is carried across beats (the story's first
// value of that unit stays as a dashed ghost), name blocks, provenance tickets, a starburst behind ratio and say reveals,
// an editor's underline on the hook's number, and a loop seam into the hook. Digits are solid brand colour with an
// outline and a hard drop: no image inside any digit. The Short's own textless illustration, when it has one, appears
// only framed on the end card; without one the look is pure type.
// Every colour and font comes from the brand tokens (B), so the same file renders Data Kadai or Indica Atlas.
import React, {useMemo} from "react";
import {AbsoluteFill, Easing, getInputProps, useCurrentFrame} from "remotion";
import {Grain, Vignette} from "../shared/Grain";
import {LookAudio} from "../shared/LookAudio";
import type {LookProps} from "../shared/types";
import {beatAt} from "../shared/useLookData";
import {Chrome, chromeGeo, EndShot, FactShot, flashOn, MapShot, PosterShot, punchAt, SayWords, type Ctx} from "./beats";
import {Burst} from "./devices";
import {ease, palOf} from "./kit";
import {fullLock} from "./type";
import {planStory, type Dir, type Shot} from "./plan";
import {prepStory} from "./prep";

const WIPE = 6, SEAM = 12;

const clipFor = (p: number, dir: Dir) => {
  const q = ((1 - p) * 100).toFixed(3);
  if (dir === "up") return `inset(${q}% 0 0 0)`;
  if (dir === "down") return `inset(0 0 ${q}% 0)`;
  if (dir === "left") return `inset(0 0 0 ${q}%)`;
  if (dir === "right") return `inset(0 ${q}% 0 0)`;
  return undefined;
};

const ShotView: React.FC<{C: Ctx; s: Shot; f: number}> = ({C, s, f}) => {
  const {L, B} = C;
  const b = L.beats[s.i];
  const pal = palOf(B, s.slab);
  const map = s.kind === "map" || s.kind === "mapend";
  const top = chromeGeo(C, b).bottom + 34;
  const punch = map || C.frozen ? 1 : punchAt(L, b, f);
  const flash = !map && !C.frozen && flashOn(L, b, f);
  const burstFrom = s.kind === "say" && b.hero ? fullLock(b.hero) - 2 : b.f0;
  let body: React.ReactNode = null;
  if (map) body = <MapShot C={C} b={b} top={top}/>;
  else if (s.kind === "fact") body = <FactShot C={C} s={s} b={b} f={f} top={top}/>;
  else if (s.kind === "end") body = <EndShot C={C} s={s} b={b} f={f} top={top}/>;
  else if (C.plan.posters[s.i]?.hero || s.i === 0) body = <PosterShot C={C} s={s} b={b} f={f} top={top}/>;
  else body = <SayWords C={C} s={s} b={b} f={f} top={top}/>;
  return <AbsoluteFill style={{background: pal.bg, overflow: "hidden"}}>
    {s.burst && !C.safe && <Burst c1={B.c.accent} c2={B.c.ray} cx={540} cy={900} f={f} from={burstFrom}/>}
    {!map && !C.safe && <Grain seed={(L.seed % 89) + 1} amount={0.12}/>}
    {!map && !C.safe && <Vignette color={B.c.deep} amount={pal.dark ? 0.3 : 0.16}/>}
    <AbsoluteFill style={{transform: punch !== 1 ? `scale(${punch})` : undefined, transformOrigin: "50% 48%"}}>{body}</AbsoluteFill>
    {flash && <AbsoluteFill style={{background: B.c.paper, opacity: 0.1}}/>}
    <Chrome C={C} b={b} pal={s.arch === "split" && s.slab2 && s.i !== 0 ? palOf(B, s.slab2) : pal} f={f}/>
  </AbsoluteFill>;
};

export const SlabStory: React.FC<LookProps> = ({L: L0, B}) => {
  const f = useCurrentFrame();
  const P = useMemo(() => prepStory(L0), [L0]);
  const L = P.L;
  const plan = useMemo(() => planStory(L), [L]);
  const safe = (getInputProps() as {slabSafe?: boolean}).slabSafe === true;
  const C = useMemo<Ctx>(() => ({L, B, plan, frozen: false, safe, spoken: P.spoken, platesOk: P.platesOk}), [L, B, plan, safe, P]);
  const CF = useMemo<Ctx>(() => ({L, B, plan, frozen: true, safe, spoken: P.spoken, platesOk: P.platesOk}), [L, B, plan, safe, P]);
  const b = beatAt(L, f);
  const s = plan.shots[b.i];
  const prev = b.i > 0 ? plan.shots[b.i - 1] : null;
  const wp = prev && s.dir !== "cut" ? ease(f, s.f0, s.f0 + WIPE, Easing.inOut(Easing.cubic)) : 1;
  const seamFrom = L.frames - SEAM;
  const sp = f >= seamFrom ? ease(f, seamFrom, L.frames - 1, Easing.inOut(Easing.cubic)) : 0;
  return <AbsoluteFill style={{background: B.c[s.slab]}}>
    {wp < 1 && prev && <ShotView C={C} s={prev} f={f}/>}
    <AbsoluteFill style={{clipPath: wp < 1 ? clipFor(wp, s.dir) : undefined}}><ShotView C={C} s={s} f={f}/></AbsoluteFill>
    {sp > 0 && <AbsoluteFill style={{clipPath: clipFor(sp, "right")}}><ShotView C={CF} s={plan.shots[0]} f={0}/></AbsoluteFill>}
    <LookAudio L={L}/>
  </AbsoluteFill>;
};
