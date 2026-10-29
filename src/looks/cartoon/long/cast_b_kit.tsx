// Shared drawing kit for cast_b (the long-form cast). Every character is drawn in a 400 x 600 box, centre x = 200, feet line y = 600,
// in the pilot's art language: flat fills from C, 8 px ink outline, white eyes with a dot pupil, mitten hands, no gradients.
// Everything is a pure function of the frame f (Remotion renders frames independently): blink, gaze, sway, breath all derive from f and a seed.
import React from "react";
import {random} from "remotion";
import {Mouth} from "../art";
import {C} from "../palette";

export type Who = "uncle" | "mother" | "father" | "grandmother" | "girl" | "boy" | "baby" | "teacher";
export type Pose = "idle" | "present" | "point" | "cheer" | "worried";
export type V = [number, number];
// Everything a character needs to draw one frame. t is the pose blend: 0 = idle, 1 = the pose (a spring may overshoot it).
export type Rig = {f: number; pose: Pose; mouth: string; seed: number; look: number; t: number};

export const INK = C.ink;
export const HAIR_BLACK = "#2B2433";
export const HAIR_GREY = "#E8E4DC";

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (v: number[]) => "#" + v.map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0")).join("");
export const shade = (h: string, k: number) => toHex(hex(h).map((v) => v * (1 - k)));
export const tint = (h: string, k: number) => toHex(hex(h).map((v) => v + (255 - v) * k));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerpV = (a: V, b: V, t: number): V => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

// ---- blink and gaze ---------------------------------------------------------------------------------------------------------
// One blink every 3 to 5 seconds (period 90-150 frames, seeded), 5 frames long: half-shut, shut, shut, shut, half-shut.
export const blinkAmt = (f: number, seed: number): number => {
  const p = 90 + Math.floor(random(`castb-bp-${seed}`) * 61), o = Math.floor(random(`castb-bo-${seed}`) * p), k = (f + o) % p;
  return k === 0 || k === 4 ? 0.5 : k > 0 && k < 4 ? 1 : 0;
};
// Slow gaze drift in [-1, 1]: it dwells near the ends like a real glance. `look` from the caller overrides it.
export const gazeAt = (f: number, seed: number, look?: number): number =>
  look !== undefined ? Math.max(-1, Math.min(1, look)) : Math.max(-1, Math.min(1, Math.sin(f / 61 + seed * 1.7) * 2));

// ---- face parts ---------------------------------------------------------------------------------------------------------------
export const Eyes: React.FC<{cx?: number; y: number; dx: number; r: number; ry?: number; pr: number; blink: number; look: number; happy?: boolean; lash?: boolean; glint?: boolean; stroke?: number}> =
  ({cx = 200, y, dx, r, ry, pr, blink, look, happy, lash, glint, stroke = 4.5}) => {
  const rv = ry ?? r;
  return <g>
    {[-1, 1].map((s) => {
      const x = cx + s * dx;
      const lashes = lash && <path d={`M ${x + s * (r - 2)} ${y - rv * 0.35} L ${x + s * (r + 9)} ${y - rv * 0.75}`} stroke={INK} strokeWidth={4.5} strokeLinecap="round"/>;
      if (happy) return <g key={s}><path d={`M ${x - r} ${y + 5} Q ${x} ${y - r * 1.15} ${x + r} ${y + 5}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round"/>{lashes}</g>;
      if (blink >= 1) return <g key={s}><path d={`M ${x - r} ${y} Q ${x} ${y + 9} ${x + r} ${y}`} stroke={INK} strokeWidth={5.5} fill="none" strokeLinecap="round"/>{lashes}</g>;
      const h = blink > 0 ? 0.38 : 1, px = x + look * (r - pr) * 0.75;
      return <g key={s}>
        <ellipse cx={x} cy={y} rx={r} ry={rv * h} fill={C.white} stroke={INK} strokeWidth={stroke}/>
        <ellipse cx={px} cy={y + (1 - h) * 2 + 1} rx={pr} ry={Math.min(pr, rv * h * 0.92)} fill={INK}/>
        {glint && h === 1 && <circle cx={px + pr * 0.34} cy={y - pr * 0.3} r={pr * 0.3} fill={C.white}/>}
        {lashes}
      </g>;
    })}
  </g>;
};

// tilt > 0: inner ends raised (worried); tilt < 0: inner ends dropped (stern). lift raises the whole brow.
export const Brows: React.FC<{cx?: number; y: number; dx: number; w: number; tilt?: number; lift?: number; thick?: number; arch?: number; color?: string}> =
  ({cx = 200, y, dx, w, tilt = 0, lift = 0, thick = 6, arch = 0, color = INK}) => <g>
  {[-1, 1].map((s) => {
    const xi = cx + s * (dx - w / 2), xo = cx + s * (dx + w / 2), yi = y - lift - tilt, yo = y - lift + tilt * 0.35;
    return <path key={s} d={`M ${xi} ${yi} Q ${(xi + xo) / 2} ${(yi + yo) / 2 - arch} ${xo} ${yo}`} stroke={color} strokeWidth={thick} fill="none" strokeLinecap="round"/>;
  })}
</g>;

// Rhubarb letters A-H reuse the pilot's Mouth (art.tsx), drawn around (x, y) at scale k. X (rest) depends on the pose:
// a gentle smile, a big open smile for cheer, a wobbly frown for worried.
export const MouthG: React.FC<{v: string; x: number; y: number; k: number; pose: Pose; f: number}> = ({v, x, y, k, pose, f}) => {
  const L = v.toUpperCase();
  if (L >= "A" && L <= "H" && L.length === 1) return <g transform={`translate(${x} ${y}) scale(${k}) translate(-200 -274)`}><Mouth v={L}/></g>;
  if (pose === "worried") {
    const w = Math.sin(f / 3.5) * 1.6;
    return <path d={`M ${x - 24 * k} ${y + 6 * k} Q ${x - 12 * k} ${y - 7 * k + w} ${x} ${y + 3 * k} Q ${x + 12 * k} ${y + 13 * k - w} ${x + 24 * k} ${y - 2 * k}`} stroke={INK} strokeWidth={6 * k + 1} fill="none" strokeLinecap="round"/>;
  }
  if (pose === "cheer") return <g transform={`translate(${x} ${y}) scale(${k})`}>
    <path d="M -30 -8 Q 0 46 30 -8 Z" fill={C.redDark} stroke={INK} strokeWidth={5} strokeLinejoin="round"/>
    <ellipse cx={0} cy={16} rx={14} ry={7} fill="#E87D7D"/></g>;
  return <g transform={`translate(${x} ${y}) scale(${k}) translate(-200 -274)`}><Mouth v="X"/></g>;
};

// A drop of nervous sweat (worried pose).
export const Sweat: React.FC<{x: number; y: number; f: number; s?: number}> = ({x, y, f, s = 1}) =>
  <path transform={`translate(${x} ${y + Math.sin(f / 7) * 3}) scale(${s})`} d="M 0 -26 Q -18 6 0 12 Q 18 6 0 -26 Z" fill={C.sky} stroke={INK} strokeWidth={4} strokeLinejoin="round"/>;

export const Blush: React.FC<{x: number; y: number; rx?: number; ry?: number}> = ({x, y, rx = 18, ry = 11}) =>
  <>{[-1, 1].map((s) => <ellipse key={s} cx={200 + s * x} cy={y} rx={rx} ry={ry} fill="#E8735F" opacity={0.3}/>)}</>;

// A rounded head: width rx each side, rt above and rb below the centre; jaw < 0.55 is a pointed chin, > 0.8 a square one.
export const headPath = (cx: number, cy: number, rx: number, rt: number, rb: number, jaw = 0.58) => {
  const k = 0.5523;
  return `M ${cx - rx} ${cy} C ${cx - rx} ${cy - rt * k} ${cx - rx * k} ${cy - rt} ${cx} ${cy - rt} C ${cx + rx * k} ${cy - rt} ${cx + rx} ${cy - rt * k} ${cx + rx} ${cy} ` +
    `C ${cx + rx} ${cy + rb * 0.62} ${cx + rx * jaw} ${cy + rb} ${cx} ${cy + rb} C ${cx - rx * jaw} ${cy + rb} ${cx - rx} ${cy + rb * 0.62} ${cx - rx} ${cy} Z`;
};

export const Ears: React.FC<{cy: number; dx: number; rx?: number; ry?: number; skin: string; ring?: string}> = ({cy, dx, rx = 20, ry = 28, skin, ring}) =>
  <>{[-1, 1].map((s) => <g key={s}><ellipse cx={200 + s * dx} cy={cy} rx={rx} ry={ry} fill={skin} stroke={INK} strokeWidth={6}/>
    {ring && <circle cx={200 + s * dx} cy={cy + ry * 0.7} r={7} fill={ring} stroke={INK} strokeWidth={3.5}/>}</g>)}</>;

// One face: brows, eyes, optional nose, mouth, blush. Pose effects live here so every character reacts the same way:
// worried lifts the inner brow ends, cheer closes the eyes into happy arcs, raises the brows and flushes the cheeks.
export type FaceP = {r: Rig; blink: number; cx?: number; ey: number; edx: number; er: number; ery?: number; epr: number; by: number; bdx: number; bw: number; bthick?: number; barch?: number; btilt?: number;
  browColor?: string; my: number; mk: number; nose?: React.ReactNode; blush?: [number, number, number?, number?] | null; lash?: boolean; glint?: boolean};
export const Face: React.FC<FaceP> = ({r, blink, cx = 200, ey, edx, er, ery, epr, by, bdx, bw, bthick = 6, barch = 0, btilt = 0, browColor = INK, my, mk, nose, blush, lash, glint}) => {
  const cheer = r.pose === "cheer", worry = r.pose === "worried";
  return <g>
    {blush && <g transform={`translate(${cx - 200} 0)`}><Blush x={blush[0]} y={blush[1]} rx={blush[2]} ry={blush[3]}/></g>}
    {nose}
    <Brows cx={cx} y={by} dx={bdx} w={bw} thick={bthick} arch={barch} color={browColor} tilt={btilt + (worry ? 9 : 0)} lift={cheer ? 9 : 0}/>
    <Eyes cx={cx} y={ey} dx={edx} r={er} ry={ery} pr={epr} blink={blink} look={r.look} happy={cheer} lash={lash} glint={glint}/>
    <MouthG v={r.mouth} x={cx} y={my} k={mk} pose={r.pose} f={r.f}/>
  </g>;
};

// ---- hands and arms -------------------------------------------------------------------------------------------------------------
// Mitten hand: a circle. `finger` adds a small pointing finger along `dir` (degrees), used by the point pose.
export const Hand: React.FC<{x: number; y: number; r: number; skin: string; finger?: boolean; dir?: number}> = ({x, y, r, skin, finger, dir = 0}) => <g>
  {finger && <g transform={`translate(${x} ${y}) rotate(${dir})`}><rect x={0} y={-r * 0.28} width={r * 2.35} height={r * 0.56} rx={r * 0.28} fill={skin} stroke={INK} strokeWidth={5}/></g>}
  <circle cx={x} cy={y} r={r} fill={skin} stroke={INK} strokeWidth={6}/>
</g>;

// The first `frac` (by length) of the bent line sh - elbow - hand, as a path.
const polyHead = (p0: V, p1: V, p2: V, frac: number) => {
  const l1 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), l2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]), tg = frac * (l1 + l2);
  if (tg <= l1) { const q = lerpV(p0, p1, tg / l1); return `M ${p0[0]} ${p0[1]} L ${q[0]} ${q[1]}`; }
  const q = lerpV(p1, p2, (tg - l1) / l2);
  return `M ${p0[0]} ${p0[1]} L ${p1[0]} ${p1[1]} L ${q[0]} ${q[1]}`;
};

// An outlined arm: a bent tube from the shoulder through the elbow `c` to the hand at `e` (round joints). sleeveT is the share of the arm's length
// that carries a sleeve (the rest is skin): 1 = full sleeve, 0 = bare arm.
export const Arm: React.FC<{sh: V; c: V; e: V; w: number; sleeve: string; sleeveT?: number; skin: string; hr: number; finger?: boolean}> = ({sh, c, e, w, sleeve, sleeveT = 1, skin, hr, finger}) => {
  const d = `M ${sh[0]} ${sh[1]} L ${c[0]} ${c[1]} L ${e[0]} ${e[1]}`, ds = sleeveT >= 1 ? d : polyHead(sh, c, e, sleeveT);
  const dir = (Math.atan2(e[1] - c[1], e[0] - c[0]) * 180) / Math.PI, tube = {fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const};
  return <g>
    <path d={d} stroke={INK} strokeWidth={w + 12} {...tube}/>
    {sleeveT < 1 && <path d={d} stroke={skin} strokeWidth={w} {...tube}/>}
    {sleeveT > 0 && <><path d={ds} stroke={INK} strokeWidth={w + 12} {...tube}/><path d={ds} stroke={sleeve} strokeWidth={w} {...tube}/></>}
    <Hand x={e[0]} y={e[1]} r={hr} skin={skin} finger={finger} dir={dir}/>
  </g>;
};

// The shared pose model: where each arm's elbow `c` and hand `e` sit, in units of the arm length `len` from the shoulder.
// R is the viewer's right (the active arm for present / point; flip mirrors the whole character).
export type ArmGeom = {shL: V; shR: V; len: number; out?: number};
export type ArmPose = {L: {c: V; e: V}; R: {c: V; e: V}; finger: boolean};
export const armPose = (r: Rig, g: ArmGeom): ArmPose => {
  const {f, pose, seed, t} = r, {shL, shR, len: Ln} = g, out = g.out ?? 0.1, sw = Math.sin(f / 17 + seed) * 0.018;
  const o = (sh: V, dx: number, dy: number): V => [sh[0] + dx * Ln, sh[1] + dy * Ln];
  const idle = (sh: V, s: number) => ({c: o(sh, s * (out + 0.04), 0.5), e: o(sh, s * out + s * sw, 0.98 + sw)});
  const rest = {L: idle(shL, -1), R: idle(shR, 1)};
  const lowL = {c: o(shL, -0.2, 0.48), e: o(shL, -0.22 + sw, 0.93)};
  const breathe = Math.sin(f / 13 + seed) * 0.02;
  let tgt = rest;
  if (pose === "present") tgt = {L: lowL, R: {c: o(shR, 0.42, 0.3), e: o(shR, 0.84, -0.04 + breathe)}};
  else if (pose === "point") tgt = {L: lowL, R: {c: o(shR, 0.5, 0.03), e: o(shR, 1.0, -0.1 + breathe)}};
  else if (pose === "cheer") {
    const w = (ph: number) => Math.sin(f / 4.5 + seed * 1.3 + ph);
    tgt = {L: {c: o(shL, -0.46, -0.26), e: o(shL, -0.62 - 0.1 * w(1.7), -0.8 + 0.05 * Math.cos(f / 4.5 + seed * 1.3 + 1.7))},
           R: {c: o(shR, 0.46, -0.26), e: o(shR, 0.62 + 0.1 * w(0), -0.8 + 0.05 * Math.cos(f / 4.5 + seed * 1.3))}};
  } else if (pose === "worried") {
    const mid = (shL[0] + shR[0]) / 2, jx = Math.sin(f / 3.2) * 0.012, jy = Math.cos(f / 2.7) * 0.012;
    tgt = {L: {c: o(shL, -0.02, 0.56), e: [mid - 0.13 * Ln + jx * Ln, shL[1] + 0.62 * Ln + jy * Ln]}, R: {c: o(shR, 0.02, 0.56), e: [mid + 0.13 * Ln - jx * Ln, shR[1] + 0.62 * Ln - jy * Ln]}};
  }
  const mixArm = (a: {c: V; e: V}, b: {c: V; e: V}) => ({c: lerpV(a.c, b.c, t), e: lerpV(a.e, b.e, t)});
  return {L: mixArm(rest.L, tgt.L), R: mixArm(rest.R, tgt.R), finger: pose === "point" && t > 0.5};
};

// A clip path id that is the same for every copy of a character (the clip lives in each actor's own user space).
export const cid = (who: string, name: string) => `ccb-${who}-${name}`;
