// KURZ look, "stage" scene (art builder, 29 Oct 2026): an illustrated set with a cast and props, drawn in parallax layers under a slow
// camera push-in and drift. Actors and props with an `enter` key pop in on that word (vehicles drive in); badges print figures through
// numOf + KNum and refuse to draw before their key; pills use KPill on a dark panel so they read on busy art. Tints: sepia (1969-82),
// warm (1982 meetings), default (today). Spec: {set, actors[], props[], badges[], pills[], camera?, tint?} (CONTRACT_KURZ.md).
import React from "react";
import {AbsoluteFill, staticFile} from "remotion";
import type {SceneProps} from "../cartoon/long/contract";
import {numOf, type NumIn} from "../cartoon/long/scenes/nk_kit";
import {KNum, KPill, K, ROUND, SANS, ease, easeIO, pop} from "./kit";
import {ArtCtx, Smoke, clamp01, toneFn, useUid, type Tint} from "./art/base";
import {SETS} from "./art/sets";
import {Crowd, Person, type Pose, type Who} from "./art/cast";
import {BASE, PropArt, WIDTH, floats} from "./art/props";

type Actor = {id: string; who: string; x: number; y: number; h: number; flip?: boolean; enter?: string; pose?: string; seed?: number};
type Prop = {icon: string; x: number; y: number; s: number; enter?: string; seed?: number};
type Badge = NumIn & {x: number; y: number; size?: number; caption?: string; color?: string};
type Pill = {text: string; x: number; y: number; key?: string};
export type StageSpec = {set: string; actors?: Actor[]; props?: Prop[]; badges?: Badge[]; pills?: Pill[];
  camera?: {fx: number; fy: number; s0: number; s1: number}; tint?: "sepia" | "warm"; notes?: string};

const VEH = new Set(["car", "van"]);
const V = 15;   // road speed, px per logical frame at depth 1

// ---- badges: KBadge's look with a caption of at least 30 px, a small unit for word suffixes, and sizes fitted to their neighbours ---
const SAFE = {x0: 96, x1: 1824, y0: 64, y1: 920};
const capOf = (size: number) => Math.max(30, Math.round(size * 0.21));
const splitUnit = (b: Badge) => { const suf = b.suffix ?? ""; return /[a-z]/i.test(suf) && suf.trim().length > 2 ? suf.trim() : ""; };
const estW = (b: Badge, size: number) => {
  const n = numOf({...b, suffix: splitUnit(b) ? "" : b.suffix}, 0).text, unit = splitUnit(b);
  const numW = [...n].reduce((a, ch) => a + (/[0-9]/.test(ch) ? 0.6 : ch === "." ? 0.3 : 0.62), 0) * size;
  const unitW = unit ? unit.length * size * 0.42 * 0.56 + 14 : 0, cap = b.caption ? b.caption.length * capOf(size) * 0.53 : 0;
  return Math.max(numW + unitW, cap) + 80;
};
const fitBadges = (bs: Badge[]) => {
  const base = bs.map((b) => b.size ?? 150);
  return bs.map((b, i) => {
    let k = 1;
    bs.forEach((o, j) => { if (j === i || Math.abs(o.y - b.y) > 140) return;
      const need = (estW(b, base[i]) + estW(o, base[j])) / 2 + 30, have = Math.abs(o.x - b.x); if (need > have) k = Math.min(k, have / need); });
    return Math.max(90, Math.round(base[i] * k));
  });
};

type Box = {x0: number; x1: number; top: number};
const SBadge: React.FC<{b: Badge; f: number; at: number; size: number; avoid: Box[]}> = ({b, f, at, size, avoid}) => {
  if (f < at) return null;
  const t = pop(f, at);
  if (t <= 0.001) return null;
  const unit = splitUnit(b), n = numOf({...b, suffix: unit ? "" : b.suffix}, at), color = b.color ?? K.yellow, cap = capOf(size);
  const w = estW(b, size), hgt = size + (b.caption ? cap * 1.25 + 8 : 0) + 38;
  const cx = Math.min(Math.max(b.x, SAFE.x0 + w / 2), SAFE.x1 - w / 2), floor = cx + w / 2 > 1560 ? 130 : SAFE.y0;
  let top = Math.max(b.y - hgt / 2, floor);
  for (const h of avoid) if (h.x1 > cx - w / 2 && h.x0 < cx + w / 2 && top + hgt > h.top - 14) top = Math.max(floor, Math.min(top, h.top - 14 - hgt));
  return <div style={{position: "absolute", left: cx, top, transform: `translateX(-50%) scale(${t}) translateY(${(1 - t) * 30}px)`, transformOrigin: "50% 60%", opacity: Math.min(1, t * 1.4)}}>
    <div style={{display: "inline-flex", flexDirection: "column", alignItems: "center", padding: `16px 40px ${b.caption ? 18 : 14}px`, borderRadius: 34,
      background: "rgba(11,20,51,0.72)", boxShadow: "0 0 0 3px rgba(255,255,255,0.10), 0 22px 50px rgba(0,0,0,0.38)"}}>
      <div style={{display: "flex", alignItems: "baseline", gap: unit ? size * 0.1 : 0, whiteSpace: "nowrap"}}>
        <span style={{fontFamily: ROUND, fontWeight: 800, fontSize: size, lineHeight: 1, color, letterSpacing: -1, textShadow: `0 0 ${size * 0.25}px ${color}88`}}><KNum n={n} f={f} where="stage badge"/></span>
        {unit && <span style={{fontFamily: ROUND, fontWeight: 800, fontSize: Math.round(size * 0.42), color, opacity: 0.92}}>{unit}</span>}
      </div>
      {b.caption && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: cap, color: K.white, opacity: 0.9, marginTop: 8, whiteSpace: "nowrap"}}>{b.caption}</div>}
    </div>
  </div>;
};

const SPill: React.FC<{p: Pill; f: number; at: number}> = ({p, f, at}) => {
  const t = ease(f, at, at + 12);
  if (t <= 0.001) return null;
  return <div style={{position: "absolute", left: p.x, top: p.y, borderRadius: 999, background: "rgba(11,20,51,0.66)", boxShadow: "0 10px 26px rgba(0,0,0,0.28)", opacity: Math.min(1, t * 1.3)}}>
    <KPill text={p.text} f={f} at={at} color={/ILLUSTRATIVE|RECOLLECTION/.test(p.text) ? K.orange : K.teal} size={36}/>
  </div>;
};

// ---- road scroll: distance driven, the integral of a smooth speed profile (so wheels and scenery never jump) ------------------------
const speedAt = (f: number, start: number, stop: number) => V * clamp01((f - start) / 36) ** 2 * (3 - 2 * clamp01((f - start) / 36)) * (1 - smooth01((f - (stop - 70)) / 70));
const smooth01 = (x: number) => { const t = clamp01(x); return t * t * (3 - 2 * t); };
const distance = (f: number, start: number, stop: number) => {
  if (f <= start) return 0;
  let d = 0; const h = 0.25;
  for (let x = start; x < f; x += h) { const b = Math.min(f, x + h); d += ((speedAt(x, start, stop) + speedAt(b, start, stop)) / 2) * (b - x); }
  return d;
};

export const Stage: React.FC<SceneProps<StageSpec>> = ({f, dur, spec, at}) => {
  const set = SETS[spec.set];
  if (!set) throw new Error(`kurz stage: no set "${spec.set}"`);
  const tint: Tint = spec.tint ?? "day";
  const uid = useUid();
  const art = React.useMemo(() => ({T: toneFn(tint), uid, tint}), [tint, uid]);
  const actors = spec.actors ?? [], props = spec.props ?? [], badges = spec.badges ?? [], pills = spec.pills ?? [];

  // camera: push-in from s0 to s1 about (fx, fy) over the scene, a slow drift, more for near layers (parallax)
  // default: push toward the middle of the cast and props (each scene on a shared set frames its own action)
  const pts = [...actors.map((a) => a.x), ...props.map((p) => p.x)];
  const mid = pts.length ? Math.min(1320, Math.max(600, pts.reduce((a, b) => a + b, 0) / pts.length)) : 960;
  const cam = spec.camera ?? {fx: mid, fy: 640, s0: 1, s1: 1.07};
  const push = cam.s0 + (cam.s1 - cam.s0) * easeIO(f, 0, dur);
  const dx = Math.sin(f / 170) * 12 + Math.sin(f / 61) * 2, dy = Math.sin(f / 230 + 1) * 6;
  const L = (d: number) => `translate(${cam.fx} ${cam.fy}) scale(${1 + (push - 1) * d}) translate(${-cam.fx} ${-cam.fy}) translate(${(dx * d).toFixed(2)} ${(dy * d).toFixed(2)})`;

  // road travel: when a vehicle drives in and nobody stands by the road, the world scrolls until the next prop arrives
  const veh = props.find((p) => VEH.has(p.icon) && p.enter);
  const travel = !!veh && actors.length === 0;
  const startF = veh?.enter ? at(veh.enter) : 0;
  const others = props.filter((p) => !VEH.has(p.icon) && p.enter).map((p) => at(p.enter!));
  const stopF = others.length ? Math.min(...others) : dur + 200;
  const scroll = travel ? distance(f, startF, stopF) : 0, moving = travel ? speedAt(f, startF, stopF) / V : 0;

  // staggered entrances: items sharing an enter key pop one after another
  const order: Record<string, number> = {};
  const delay = (k?: string) => { if (!k) return 0; order[k] = (order[k] ?? -1) + 1; return order[k] * 4; };
  type Item = {z: number; node: React.ReactNode; shadow?: React.ReactNode};
  const items: Item[] = [];

  actors.forEach((a, i) => {
    const t0 = a.enter ? at(a.enter) + delay(a.enter) : -100, t = a.enter ? pop(f, t0, 140) : 1;
    if (t <= 0.001) return;
    const poseT = ease(f, Math.max(t0, 6) + 4, Math.max(t0, 6) + 30);
    const pose = (a.pose ?? "idle") as Pose;
    const node = a.who === "crowd" ? <Crowd x={a.x} y={a.y} h={a.h} f={f} seed={a.seed ?? i}/>
      : <Person who={a.who as Who} x={a.x} y={a.y} h={a.h} f={f} flip={a.flip} pose={pose} poseT={poseT} seed={a.seed ?? i}/>;
    const w = a.who === "crowd" ? a.h * 3.8 : a.h * 0.32;
    items.push({z: a.y, node: <g key={`a${i}`} opacity={Math.min(1, t * 2.5)} transform={`translate(${a.x} ${a.y}) scale(${t}) translate(${-a.x} ${-a.y})`}>{node}</g>,
      shadow: <g key={`as${i}`} opacity={Math.min(1, t)}>
        <ellipse cx={a.x + a.h * 0.42} cy={a.y - a.h * 0.03} rx={w / 2 + a.h * 0.42} ry={a.h * 0.05} transform={`rotate(-4 ${a.x} ${a.y})`} fill="#140C30" opacity={0.3}/>
        <ellipse cx={a.x + 6} cy={a.y} rx={w * 0.55} ry={a.h * 0.022} fill="#140C30" opacity={0.45}/></g>});
  });

  props.forEach((p, i) => {
    const isVeh = VEH.has(p.icon);
    const t0 = p.enter ? at(p.enter) + (isVeh ? 0 : delay(p.enter)) : -100;
    if (p.enter && f < t0) return;
    const fl = floats(p.icon, p.y), base = BASE[p.icon] ?? 0, gy = p.y + base * p.s, w = (WIDTH[p.icon] ?? 100) * p.s;
    let x = p.x, t = 1, rot = 0, mv = 0;
    if (isVeh) {
      const arrive = p.enter ? easeIO(f, t0, t0 + 54) : 1;
      x = p.x - (1 - arrive) * 1500;
      mv = Math.max(moving, p.enter ? (arrive > 0 && arrive < 1 ? 1 : 0) * Math.sin(arrive * Math.PI) : 0);
      rot = ((scroll + arrive * 1500) / (28 * p.s)) * (180 / Math.PI);
    } else if (p.enter) t = pop(f, t0, 160);
    if (t <= 0.001) return;
    const hover = fl ? Math.sin(f / 26 + i) * 8 : 0;
    const seed = p.seed ?? i;
    const art = <g transform={`translate(${x} ${p.y + hover}) scale(${p.s * t})`}><PropArt icon={p.icon} f={f + seed * 13} seed={seed} hero={p.icon === "egg" && fl} rot={rot} moving={mv}/></g>;
    const since = f - t0, poof = !isVeh && p.enter && !fl && since < 26 ? since / 26 : -1;
    items.push({z: fl ? 5000 + i : gy, node: <g key={`p${i}`} opacity={Math.min(1, t * 2.5)}>
      {isVeh && (mv > 0.02) && <Smoke f={f} x={x - 150 * p.s} y={gy - 16} c="#E8D2A8" n={7} life={40} rise={40} drift={-260} r0={10} r1={40} o={0.45 * Math.min(1, mv)} seed={i}/>}
      {isVeh && <Smoke f={f} x={x - 168 * p.s} y={gy - 30} c="#B8B0C0" n={4} life={60} rise={50} drift={-60} r0={6} r1={22} o={0.25} seed={i + 3}/>}
      {art}
      {poof >= 0 && <ellipse cx={x} cy={gy} rx={w * (0.4 + poof * 0.6)} ry={w * (0.08 + poof * 0.1)} fill="none" stroke="#FFF2D0" strokeWidth={4 * (1 - poof)} opacity={0.7 * (1 - poof)}/>}
    </g>,
    shadow: fl ? <ellipse key={`ps${i}`} cx={x + 40} cy={Math.min(1040, p.y + 260 * p.s)} rx={w * 0.4} ry={w * 0.06} fill="#140C30" opacity={0.18 * t}/>
      : <g key={`ps${i}`} opacity={Math.min(1, t)}>
        <ellipse cx={x + w * (isVeh ? 0.12 : 0.35)} cy={gy - 2} rx={w * (isVeh ? 0.56 : 0.75)} ry={Math.max(6, w * (isVeh ? 0.05 : 0.07))} transform={`rotate(-3 ${x} ${gy})`} fill="#140C30" opacity={0.3}/>
        <ellipse cx={x + 4} cy={gy} rx={w * 0.45} ry={Math.max(4, w * 0.04)} fill="#140C30" opacity={0.45}/></g>});
  });
  items.sort((a, b) => a.z - b.z);
  const sizes = fitBadges(badges);
  const heads: Box[] = actors.filter((a) => a.who !== "crowd").map((a) => ({x0: a.x - a.h * 0.14, x1: a.x + a.h * 0.14, top: a.y - a.h * 1.02}));

  const wash = tint === "sepia" ? "radial-gradient(ellipse at 18% 8%, rgba(255,206,130,0.20), rgba(255,206,130,0) 62%)"
    : tint === "warm" ? "radial-gradient(ellipse at 15% 20%, rgba(255,176,96,0.16), rgba(255,176,96,0) 60%)" : "radial-gradient(ellipse at 30% 60%, rgba(255,190,140,0.10), rgba(255,190,140,0) 60%)";
  const vig = tint === "sepia" ? "rgba(34,18,8,0.62)" : tint === "warm" ? "rgba(40,14,20,0.55)" : "rgba(8,12,40,0.6)";

  return <ArtCtx.Provider value={art}>
    <AbsoluteFill style={{background: K.night, overflow: "hidden"}}>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <defs><filter id={`${uid}sh`} x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation={7}/></filter></defs>
        <set.Back f={f} L={L} scroll={scroll}/>
        <g transform={L(1)}>
          <g filter={`url(#${uid}sh)`}>{items.map((it) => it.shadow)}</g>
          {items.map((it) => it.node)}
        </g>
        <set.Front f={f} L={L} scroll={scroll}/>
      </svg>
      <AbsoluteFill style={{background: wash, mixBlendMode: "screen", pointerEvents: "none"}}/>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 52%, ${vig} 135%)`, pointerEvents: "none"}}/>
      <AbsoluteFill style={{opacity: 0.075, mixBlendMode: "overlay", backgroundImage: `url(${staticFile("looks/grain/grain-1.png")})`, backgroundSize: "256px 256px", pointerEvents: "none"}}/>
      {badges.map((b, i) => <SBadge key={b.key} b={b} f={f} at={at(b.key)} size={sizes[i]} avoid={heads}/>)}
      {pills.map((p) => <SPill key={p.text} p={p} f={f} at={p.key ? at(p.key) : 4}/>)}
    </AbsoluteFill>
  </ArtCtx.Provider>;
};

export const Scene = Stage as React.FC<SceneProps>;
