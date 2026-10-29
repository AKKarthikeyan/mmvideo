// Shared drawing kit for the long-form cast (cast.tsx): colours, the arm rig (outlined tube + sleeve + mitten hand), the face (dot or
// lens eyes, brows, nose, Rhubarb mouth) and the head with ears. Everything is flat SVG in a 400 x 600 character box, feet line at y = 600.
import React from "react";
import {random} from "remotion";
import {C} from "../palette";
import {Mouth} from "../art";

export type Who = "uncle" | "mother" | "father" | "grandmother" | "girl" | "boy" | "baby" | "teacher";
export type Pose = "idle" | "present" | "point" | "cheer" | "worried";
export type V = [number, number];
export type PersonProps = {pose: Pose; mouth?: string; f: number; seed: number};

export const INK = C.ink;
// Cast colours: flat fills in the pilot's palette family (C), plus a few garment colours picked to stay apart from each other.
export const K = {
  teal: "#1E9E94", tealDk: "#14756D", maroon: "#8E2F45", plum: "#A63D6E", plumDk: "#7D2A52", rust: "#E8743B", rustDk: "#B9531F",
  purple: "#7C5CC8", purpleDk: "#5A3EA0", slate: "#3B4256", khaki: "#D8B46A", khakiDk: "#B8934A", black: "#2A2320", grey: C.hair, greyDk: "#C9C4BA",
  blush: "#EE7F6E", shoe: "#4A2C20", cream: C.cream, creamDk: "#E8D7A8", green: "#3DB25C", greenDk: "#237A3B",
};
// Skin tones (skin, shade) from lighter to deeper wheatish and brown; every one reads against the 8 px ink outline.
export const SKIN = {
  uncle: [C.skin, C.skinDark], mother: ["#C68652", "#A46A3C"], father: ["#E3A978", "#C28858"], grandmother: ["#B77B4A", "#96602F"],
  girl: ["#DF9F6A", "#BC7D49"], boy: ["#9C633A", "#7B4B26"], baby: ["#EBB487", "#CB9265"], teacher: ["#8C5B38", "#6C4426"],
} as Record<Who, [string, string]>;

// ---- animation helpers (all deterministic in f and seed) ----------------------------------------------------------------
export const blinkNow = (f: number, seed: number) => {
  const p = 90 + Math.floor(random(`cb${seed}`) * 60), k = (f + Math.floor(random(`co${seed}`) * p)) % p; // one blink every 3-5 s
  return k < 4;
};
export const gazeAt = (f: number, seed: number) => {
  const k = Math.floor((f + Math.floor(random(`cgo${seed}`) * 70)) / 70), r = random(`cg${seed}-${k}`);
  return r < 0.34 ? -1 : r < 0.67 ? 0 : 1;
};

// ---- arms ---------------------------------------------------------------------------------------------------------------
const lerp = (a: V, b: V, t: number): V => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const splitQ = (s: V, c: V, e: V, t: number) => { const a = lerp(s, c, t), b = lerp(c, e, t); return {c: a, e: lerp(a, b, t)}; };
const q = (s: V, c: V, e: V) => `M ${s[0]} ${s[1]} Q ${c[0]} ${c[1]} ${e[0]} ${e[1]}`;

export type Rig = {shL: V; shR: V; len: number; chest: number; gap?: number; spread?: number};
export type ArmPose = {c: V; e: V};
// Where each arm goes for each pose. Left = viewer's left (x smaller); a flip mirrors the whole actor. Idle sways, cheer waves, worried trembles.
// Arm = hand position e plus a bend b (signed fraction of the arm's length): the elbow bows to the left normal of shoulder->hand for b > 0.
const mk = (s: V, e: V, b: number): ArmPose => {
  const dx = e[0] - s[0], dy = e[1] - s[1], d = Math.hypot(dx, dy) || 1;
  return {e, c: [(s[0] + e[0]) / 2 - (dy / d) * b * d, (s[1] + e[1]) / 2 + (dx / d) * b * d]};
};
// Where each arm goes for each pose. Left = viewer's left (x smaller); a flip mirrors the whole actor. Idle sways, cheer waves, worried trembles.
export const armsFor = (pose: Pose, r: Rig, f: number, ph: number): [ArmPose, ArmPose] => {
  const L = r.len, sL = r.shL, sR = r.shR, [lx, ly] = sL, [rx, ry] = sR, sw = Math.sin((f + ph * 3) / 14) * 0.03 * L, wv = Math.sin((f + ph) / 4.4), wv2 = Math.sin((f + ph) / 4.4 + Math.PI);
  switch (pose) {
    case "present": return [mk(sL, [lx - 0.14 * L, ly + 0.9 * L + sw], 0.08), mk(sR, [rx + 0.84 * L, ry - 0.42 * L + wv * 0.03 * L], 0.16)];
    case "point": return [mk(sL, [lx + 0.12 * L, ly + 0.8 * L], 0.5), mk(sR, [rx + 0.9 * L, ry - 0.72 * L + wv * 0.015 * L], 0.04)];
    case "cheer": return [mk(sL, [lx - (r.spread ?? 0.3) * L + wv * 0.06 * L, ly - 0.92 * L - Math.abs(wv) * 0.04 * L], -0.14), mk(sR, [rx + (r.spread ?? 0.3) * L + wv2 * 0.06 * L, ry - 0.92 * L - Math.abs(wv2) * 0.04 * L], 0.14)];
    case "worried": { const g = r.gap ?? 26, tr = Math.sin(f * 1.7 + ph) * 1.6; return [mk(sL, [200 - g + tr, r.chest], 0.3), mk(sR, [200 + g - tr, r.chest + 6], -0.3)]; }
    default: return [mk(sL, [lx - 0.06 * L, ly + 0.93 * L + sw], 0.08), mk(sR, [rx + 0.06 * L, ry + 0.93 * L - sw], -0.08)];
  }
};

// One arm: ink outline, skin tube, optional sleeve (colour, fraction of the arm covered), mitten hand. A patch of sleeve colour hides the
// round cap at the shoulder so the arm grows out of the body.
export const Arm: React.FC<{s: V; a: ArmPose; w: number; skin: string; hr: number; sleeve?: {col: string; frac: number; extra?: number}}> = ({s, a, w, skin, hr, sleeve}) => {
  const ex = sleeve?.extra ?? 4, sw = w + ex, part = sleeve ? splitQ(s, a.c, a.e, sleeve.frac) : null;
  return <g>
    <path d={q(s, a.c, a.e)} stroke={INK} strokeWidth={w + 14} fill="none" strokeLinecap="round"/>
    <path d={q(s, a.c, a.e)} stroke={skin} strokeWidth={w} fill="none" strokeLinecap="round"/>
    {sleeve && part && <>
      <path d={q(s, part.c, part.e)} stroke={INK} strokeWidth={sw + 14} fill="none" strokeLinecap="round"/>
      <path d={q(s, part.c, part.e)} stroke={sleeve.col} strokeWidth={sw} fill="none" strokeLinecap="round"/>
      <circle cx={s[0]} cy={s[1]} r={sw / 2 + 3} fill={sleeve.col}/>
    </>}
    <circle cx={a.e[0]} cy={a.e[1]} r={hr} fill={skin} stroke={INK} strokeWidth={6}/>
  </g>;
};

export const Arms: React.FC<{pose: Pose; rig: Rig; f: number; seed: number; w: number; skin: string; hr: number; sleeve?: {col: string; frac: number; extra?: number}}> = ({pose, rig, f, seed, w, skin, hr, sleeve}) => {
  const [l, r] = armsFor(pose, rig, f, seed);
  return <g><Arm s={rig.shL} a={l} w={w} skin={skin} hr={hr} sleeve={sleeve}/><Arm s={rig.shR} a={r} w={w} skin={skin} hr={hr} sleeve={sleeve}/></g>;
};

// ---- face ---------------------------------------------------------------------------------------------------------------
export type FaceSpec = {
  eye: "white" | "dot"; es: number; ey: number; er?: number; glasses?: "round" | "rect"; brow: string; browY?: number; browLen?: number; browW?: number; stern?: boolean;
  nose: "line" | "dot" | "none"; ns?: number; ny?: number; ms: number; my: number; blush?: boolean; skinDk: string; wrinkles?: boolean; lash?: boolean;
};

const MouthRest: React.FC<{pose: Pose; letter: string | null}> = ({pose, letter}) => {
  if (letter) return <Mouth v={letter}/>;
  if (pose === "cheer") return <path d="M 168 262 Q 200 304 232 262 Z" fill={C.redDark} stroke={INK} strokeWidth={5} strokeLinejoin="round"/>;
  if (pose === "worried") return <path d="M 172 288 Q 186 268 200 280 Q 214 292 228 272" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round"/>;
  return <path d="M 174 266 Q 200 286 226 266" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round"/>;
};

export const Face: React.FC<{p: FaceSpec; pose: Pose; mouth?: string; f: number; seed: number; mid?: React.ReactNode}> = ({p, pose, mouth, f, seed, mid}) => {
  const blink = blinkNow(f, seed), gz = gazeAt(f, seed) * 3, up = pose === "worried" ? -3 : pose === "cheer" ? -2 : 0, er = p.er ?? 11, by = p.browY ?? -36, bl = p.browLen ?? 17;
  const bo = pose === "worried" ? {o: 6, i: -14} : pose === "cheer" ? {o: -9, i: -9} : pose === "present" || pose === "point" ? {o: -4, i: -7} : p.stern ? {o: -3, i: 3} : {o: 1, i: -1};
  const letter = mouth && mouth !== "X" && "ABCDEFGH".includes(mouth) ? mouth : null;
  const sds = [-1, 1];
  return <g>
    {p.blush && sds.map((s) => <ellipse key={s} cx={s * (p.es + 34)} cy={p.ey + 36} rx={17} ry={10} fill={K.blush} opacity={0.42}/>)}
    {p.wrinkles && sds.map((s) => <g key={s} stroke={p.skinDk} strokeWidth={4} strokeLinecap="round" fill="none"><path d={`M ${s * (p.es + 30)} ${p.ey - 8} L ${s * (p.es + 42)} ${p.ey - 14}`}/><path d={`M ${s * (p.es + 30)} ${p.ey + 4} L ${s * (p.es + 44)} ${p.ey + 6}`}/></g>)}
    {p.glasses === "round" && sds.map((s) => <circle key={s} cx={s * p.es} cy={p.ey} r={26} fill={C.glass}/>)}
    {p.glasses === "rect" && sds.map((s) => <rect key={s} x={s * p.es - 28} y={p.ey - 20} width={56} height={40} rx={12} fill={C.glass}/>)}
    {sds.map((s) => {
      const ex = s * p.es, ey = p.ey;
      if (p.eye === "white") {
        if (blink) return <line key={s} x1={ex - 16} y1={ey} x2={ex + 16} y2={ey} stroke={INK} strokeWidth={6} strokeLinecap="round"/>;
        return <g key={s}><circle cx={ex} cy={ey} r={20} fill={C.white} stroke={INK} strokeWidth={5}/><circle cx={ex + gz} cy={ey + 2 + up} r={8} fill={INK}/></g>;
      }
      if (blink) return <path key={s} d={`M ${ex - er} ${ey + 1} L ${ex + er} ${ey + 1}`} stroke={INK} strokeWidth={6} strokeLinecap="round"/>;
      if (pose === "cheer") return <path key={s} d={`M ${ex - er - 1} ${ey + 5} Q ${ex} ${ey - er * 1.5} ${ex + er + 1} ${ey + 5}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round"/>;
      return <g key={s}><ellipse cx={ex + gz} cy={ey + up} rx={er} ry={er * 1.18} fill={INK}/><circle cx={ex + gz + er * 0.32} cy={ey + up - er * 0.4} r={er * 0.36} fill={C.white}/></g>;
    })}
    {p.glasses === "round" && <g>{sds.map((s) => <circle key={s} cx={s * p.es} cy={p.ey} r={26} fill="none" stroke={INK} strokeWidth={5}/>)}<line x1={-p.es + 26} y1={p.ey} x2={p.es - 26} y2={p.ey} stroke={INK} strokeWidth={5}/></g>}
    {p.glasses === "rect" && <g>{sds.map((s) => <rect key={s} x={s * p.es - 28} y={p.ey - 20} width={56} height={40} rx={12} fill="none" stroke={INK} strokeWidth={5}/>)}<line x1={-p.es + 28} y1={p.ey - 4} x2={p.es - 28} y2={p.ey - 4} stroke={INK} strokeWidth={5}/></g>}
    {sds.map((s) => <line key={s} x1={s * (p.es + bl)} y1={by + bo.o} x2={s * (p.es - bl)} y2={by + bo.i} stroke={p.brow} strokeWidth={p.browW ?? 6} strokeLinecap="round"/>)}
    {p.nose === "line" && <path d="M -4 16 Q -14 42 0 46" transform={`translate(0 ${p.ny ?? 0}) scale(${p.ns ?? 1})`} stroke={p.skinDk} strokeWidth={6} fill="none" strokeLinecap="round"/>}
    {p.nose === "dot" && <circle cx={0} cy={(p.ny ?? 30)} r={5 * (p.ns ?? 1)} fill={p.skinDk}/>}
    {mid}
    <g transform={`translate(0 ${p.my}) scale(${p.ms}) translate(-200 -278)`}><MouthRest pose={pose} letter={letter}/></g>
  </g>;
};

// ---- head ---------------------------------------------------------------------------------------------------------------
const headPath = (hw: number, ht: number, hb: number) =>
  `M ${-hw} 0 C ${-hw} ${-ht * 0.6} ${-hw * 0.58} ${-ht} 0 ${-ht} C ${hw * 0.58} ${-ht} ${hw} ${-ht * 0.6} ${hw} 0 C ${hw} ${hb * 0.62} ${hw * 0.62} ${hb} 0 ${hb} C ${-hw * 0.62} ${hb} ${-hw} ${hb * 0.62} ${-hw} 0 Z`;

export const Head: React.FC<{cx: number; cy: number; hw: number; ht: number; hb: number; skin: string; skinDk: string; face: FaceSpec; pose: Pose; mouth?: string; f: number; seed: number;
  back?: React.ReactNode; front?: React.ReactNode; mid?: React.ReactNode; over?: React.ReactNode; ear?: number}> =
  ({cx, cy, hw, ht, hb, skin, skinDk, face, pose, mouth, f, seed, back, front, mid, over, ear = 22}) => {
  const tilt = pose === "worried" ? Math.sin(f * 1.3 + seed) * 2.2 : pose === "cheer" ? Math.sin((f + seed) / 5.5) * 4 : Math.sin((f + seed * 3) / 17) * 1.2;
  return <g transform={`translate(${cx} ${cy}) rotate(${tilt} 0 ${hb - 8})`}>
    {back}
    {[-1, 1].map((s) => <ellipse key={s} cx={s * (hw - 6)} cy={6} rx={ear} ry={ear * 1.3} fill={skin} stroke={INK} strokeWidth={6}/>)}
    <path d={headPath(hw, ht, hb)} fill={skin} stroke={INK} strokeWidth={8}/>
    <Face p={face} pose={pose} mouth={mouth} f={f} seed={seed} mid={mid}/>
    {front}
    {over}
    {pose === "worried" && <path d={`M ${hw * 0.74} ${-ht * 0.5 + Math.sin(f / 5) * 3} q -10 24 0 30 q 12 -6 0 -30 Z`} fill={C.sky} stroke={INK} strokeWidth={4}/>}
  </g>;
};
