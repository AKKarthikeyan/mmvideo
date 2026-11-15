// KURZ look, data builder's shared kit (29 Oct 2026): the space ground, light, particles, camera drift, panels, the data badge and
// the small glyphs (egg, white layer hen, coin, crate, sack, shed) used by timeline, counter, bars, seasons, share-map and price-line.
// Every shape has a lit half and a shade half (a straight cut), a soft shadow and a rim light. Every motion is a smooth function of
// the fractional logical frame f. Digits are printed only by DBadge through numOf + KNum, and only from the number's lock frame.
import React from "react";
import {AbsoluteFill, staticFile} from "remotion";
import {numOf, type NumIn} from "../cartoon/long/scenes/nk_kit";
import {K, KNum, ROUND, SANS, Stars, ease, easeIO, pop} from "./kit";

export const SAFE = {x0: 96, x1: 1824, y0: 64, y1: 920};

// Spec colours were written for the cartoon palette; map them onto K.
const COLMAP: Record<string, string> = {"#F58A1F": K.orange, "#2F6FDE": K.teal, "#E03A3E": K.pink, "#1B3FA0": K.yellow};
export const col = (c: string | undefined, d: string = K.orange) => (c ? COLMAP[c.toUpperCase()] ?? c : d);

// Seeded random numbers, so every still is stable.
export const rng = (seed: number) => {
  let s = Math.abs(Math.floor(seed * 9973 + 17)) % 2147483647 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
};
const hex = (c: string) => { const h = c.replace("#", ""); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
export const mix = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b), u = Math.max(0, Math.min(1, t));
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, "0")).join("");
};

// ---- ground: deep space with nebula, stars in parallax and a horizon glow (warm for the historic scenes) ---------------------------
export const Space: React.FC<{f: number; uid: string; seed?: number; warm?: boolean; glowY?: number}> = ({f, uid, seed = 3, warm = false, glowY = 1}) => {
  const r = rng(seed * 7 + 1);
  const blobs = [K.purple, K.teal, K.soft, K.pink].map((c, i) => ({c, x: 200 + r() * 1520, y: 80 + r() * 620, rad: 360 + r() * 300, ph: i * 1.7}));
  const px = Math.sin(f / 150) * 14, py = Math.cos(f / 190) * 9;
  const hz = warm ? K.orange : K.teal;
  return <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
    <defs>
      <radialGradient id={`${uid}-bg`} cx="0.5" cy="0.3" r="0.95"><stop offset="0" stopColor={warm ? "#2A2C7A" : K.mid}/><stop offset="0.55" stopColor={K.deep}/><stop offset="1" stopColor={K.night}/></radialGradient>
      {blobs.map((b, i) => <radialGradient key={i} id={`${uid}-nb${i}`}><stop offset="0" stopColor={b.c} stopOpacity={0.2}/><stop offset="1" stopColor={b.c} stopOpacity={0}/></radialGradient>)}
      <radialGradient id={`${uid}-hz`} cx="0.5" cy={glowY} r="0.75"><stop offset="0" stopColor={hz} stopOpacity={warm ? 0.42 : 0.3}/><stop offset="1" stopColor={hz} stopOpacity={0}/></radialGradient>
    </defs>
    <rect width={1920} height={1080} fill={`url(#${uid}-bg)`}/>
    <g transform={`translate(${px * 0.4} ${py * 0.4})`}>
      {blobs.map((b, i) => <circle key={i} cx={b.x + Math.sin(f / 210 + b.ph) * 30} cy={b.y + Math.cos(f / 240 + b.ph) * 20} r={b.rad} fill={`url(#${uid}-nb${i})`}/>)}
    </g>
    <g transform={`translate(${px} ${py})`}><Stars f={f} n={95} seed={seed}/></g>
    <rect x={0} y={0} width={1920} height={1080} fill={`url(#${uid}-hz)`}/>
  </svg>;
};

// Soft light shafts from a high source, breathing slowly. Use inside an <svg>.
export const Shafts: React.FC<{f: number; uid: string; x?: number; color?: string; n?: number; a?: number}> = ({f, uid, x = 420, color = K.tealL, n = 4, a = 1}) => <g>
  <defs><linearGradient id={`${uid}-sh`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity={0.16 * a}/><stop offset="1" stopColor={color} stopOpacity={0}/></linearGradient></defs>
  {Array.from({length: n}, (_, i) => { const w = 90 + i * 40, sk = 260 + i * 170, br = 0.6 + 0.4 * Math.sin(f / 70 + i * 1.3);
    return <path key={i} d={`M ${x + i * 120} -20 L ${x + i * 120 + w} -20 L ${x + i * 120 + w + sk} 1100 L ${x + i * 120 + sk - w} 1100 Z`} fill={`url(#${uid}-sh)`} opacity={br}/>; })}
</g>;

// Floating motes that rise and twinkle; each fades out before it wraps, so nothing pops. Use inside an <svg>.
export const Dust: React.FC<{f: number; n?: number; seed?: number; color?: string; y0?: number; y1?: number; speed?: number; size?: number}> =
  ({f, n = 40, seed = 5, color = K.yellowL, y0 = 0, y1 = 1080, speed = 0.35, size = 1}) => {
  const r = rng(seed * 13 + 3), H = y1 - y0;
  return <g>{Array.from({length: n}, (_, i) => {
    const x = r() * 1920, ph = r(), sp = speed * (0.5 + r()), rad = (1.2 + r() * 2.8) * size, sw = 10 + r() * 30, tw = r() * 6.28;
    const u = (((ph * H + f * sp) % H) + H) % H / H;               // 0..1 upward travel
    const y = y1 - u * H, o = Math.sin(Math.PI * u) * (0.35 + 0.35 * Math.sin(f / 15 + tw));
    return <circle key={i} cx={x + Math.sin(f / 50 + tw) * sw} cy={y} r={rad} fill={color} opacity={Math.max(0, o)}/>;
  })}</g>;
};

// Vignette and fine static grain over the art (below the type).
export const Finish: React.FC<{grain?: number}> = ({grain = 0.07}) => <>
  <AbsoluteFill style={{pointerEvents: "none", background: "radial-gradient(ellipse at 50% 45%, rgba(5,8,26,0) 55%, rgba(5,8,26,0.6) 125%)"}}/>
  <AbsoluteFill style={{pointerEvents: "none", opacity: grain, mixBlendMode: "overlay", backgroundImage: `url(${staticFile("looks/grain/grain-1.png")})`, backgroundSize: "256px 256px"}}/>
</>;

// A slow push-in with a gentle drift. Keep content 30 px inside SAFE; the push is a few per cent.
export const Cam: React.FC<{f: number; dur: number; push?: number; fx?: number; fy?: number; amp?: number; children: React.ReactNode}> =
  ({f, dur, push = 0.03, fx = 960, fy = 540, amp = 6, children}) => {
  const s = 1 + push * easeIO(f, 0, Math.max(1, dur)), dx = Math.sin(f / 97) * amp, dy = Math.cos(f / 131) * amp * 0.6;
  return <div style={{position: "absolute", inset: 0, transform: `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${s.toFixed(5)})`, transformOrigin: `${fx}px ${fy}px`}}>{children}</div>;
};

export const panel = (a = 0.74): React.CSSProperties => ({background: `rgba(11,20,51,${a})`, backdropFilter: "blur(8px)",
  boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.16), 0 0 0 2px rgba(255,255,255,0.06), 0 22px 50px rgba(0,0,0,0.4)"});

export const Title: React.FC<{text: string; f: number; at?: number; color?: string; x?: number; y?: number; size?: number; instant?: boolean}> =
  ({text, f, at = 4, color = K.teal, x = 96, y = 72, size = 36, instant}) => {
  const t = instant ? 1 : ease(f, at, at + 16);
  if (t <= 0.001) return null;
  return <div style={{position: "absolute", left: x, top: y, ...panel(0.72), borderRadius: 999, padding: "12px 32px 12px 22px", display: "flex", alignItems: "center", gap: 16,
    opacity: t, transform: `translateX(${(1 - t) * -30}px)`, fontFamily: ROUND, fontWeight: 800, fontSize: size, color: K.white, letterSpacing: 0.5, whiteSpace: "nowrap"}}>
    <span style={{width: size * 0.46, height: size * 0.46, borderRadius: "50%", background: color, boxShadow: `0 0 16px ${color}`, flex: "none"}}/>{text}
  </div>;
};

// The source, small on a panel. `right` anchors the panel's right edge at x.
// The panel's bottom edge sits at `bottom` (default 914, just above the caption strip), so a long source grows upward.
export const SourceTag: React.FC<{text: string; f: number; x?: number; bottom?: number; right?: boolean; maxW?: number; instant?: boolean}> = ({text, f, x = 96, bottom = 914, right, maxW = 1300, instant}) => {
  const t = instant ? 1 : ease(f, 6, 22);
  return <div style={{position: "absolute", bottom: 1080 - bottom, ...(right ? {right: 1920 - x} : {left: x}), maxWidth: maxW, textAlign: right ? "right" : "left", ...panel(0.66), borderRadius: 12, padding: "6px 16px",
    fontFamily: SANS, fontWeight: 600, fontSize: 24, lineHeight: 1.2, color: "rgba(244,247,255,0.86)", opacity: t}}>{text}</div>;
};

// A small chip of words (labels, notes), at least 34 px.
export const Chip: React.FC<{text: string; f: number; at: number; color?: string; size?: number; style?: React.CSSProperties}> = ({text, f, at, color = K.teal, size = 34, style}) => {
  const t = ease(f, at, at + 14);
  if (t <= 0.001) return null;
  return <div style={{display: "inline-flex", alignItems: "center", gap: 12, ...panel(0.74), borderRadius: 999, padding: "8px 24px 8px 16px", fontFamily: SANS, fontWeight: 800,
    fontSize: size, color: K.white, whiteSpace: "nowrap", opacity: t, transform: `translateY(${(1 - t) * 14}px)`, ...style}}>
    <span style={{width: size * 0.42, height: size * 0.42, borderRadius: "50%", background: color, boxShadow: `0 0 12px ${color}`, flex: "none"}}/>{text}
  </div>;
};

// Absolute placement by an anchor point.
export const Place: React.FC<{x: number; y: number; anchor?: "c" | "b" | "t" | "l" | "r" | "bl" | "br"; children: React.ReactNode; z?: number}> = ({x, y, anchor = "c", children, z}) => {
  const tr = {c: "translate(-50%,-50%)", b: "translate(-50%,-100%)", t: "translate(-50%,0)", l: "translate(0,-50%)", r: "translate(-100%,-50%)", bl: "translate(0,-100%)", br: "translate(-100%,-100%)"}[anchor];
  return <div style={{position: "absolute", left: x, top: y, width: "max-content", transform: tr, zIndex: z}}>{children}</div>;
};

// The data badge: prefix, digits and unit drawn from numOf at the lock frame (KNum throws if early), caption under it.
// The digits are big; a word prefix ("No.") and a unit (" crore", " paise") are set smaller so the badge stays compact.
// `instant`: already on screen at the scene's first frame (spoken in an earlier scene), so no pop-in.
export const DBadge: React.FC<{n: NumIn; at: number; f: number; caption?: string; color?: string; size?: number; capSize?: number; capW?: number; instant?: boolean}> =
  ({n, at, f, caption, color = K.yellow, size = 120, capSize, capW = 560, instant}) => {
  if (f < at) return null;
  const t = instant ? 1 : pop(f, at);
  if (t <= 0.001) return null;
  const core = numOf({...n, prefix: "", suffix: ""}, at);
  const pre = (n.prefix ?? "").trim(), suf = (n.suffix ?? "");
  const preS = /[A-Za-z]/.test(pre) ? 0.42 : 0.74, sufS = suf.trim() === "%" ? 0.62 : 0.4;
  const cs = capSize ?? Math.max(30, Math.round(size * 0.3));
  return <div style={{display: "inline-flex", flexDirection: "column", alignItems: "center", padding: `${Math.round(size * 0.16)}px ${Math.round(size * 0.3)}px ${Math.round(size * (caption ? 0.16 : 0.12))}px`,
    ...panel(0.74), borderRadius: Math.round(size * 0.26), transform: `scale(${t}) translateY(${(1 - t) * 30}px)`, opacity: Math.min(1, t * 1.4)}}>
    <div style={{display: "flex", alignItems: "baseline", fontFamily: ROUND, fontWeight: 800, color, lineHeight: 1, whiteSpace: "nowrap", textShadow: `0 0 ${Math.round(size * 0.22)}px ${color}99`}}>
      {pre && <span style={{fontSize: size * preS, marginRight: size * (preS < 0.5 ? 0.12 : 0.03)}}>{pre}</span>}
      <span style={{fontSize: size, letterSpacing: -1}}><KNum n={core} f={f} where="dbadge"/></span>
      {suf.trim() && <span style={{fontSize: size * sufS, marginLeft: suf.startsWith(" ") ? size * 0.1 : size * 0.02}}>{suf.trim()}</span>}
    </div>
    <div style={{width: "38%", height: 5, borderRadius: 3, background: color, boxShadow: `0 0 12px ${color}`, marginTop: Math.round(size * 0.12), opacity: 0.85}}/>
    {caption && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: cs, color: K.white, opacity: 0.94, marginTop: Math.round(size * 0.1), maxWidth: capW, textAlign: "center", lineHeight: 1.18}}>{caption}</div>}
  </div>;
};

// ---- glyphs (SVG, local units; place with x, y, s) ----------------------------------------------------------------------------------
export const EGG = "M 0 -60 C 34 -60 50 -8 50 18 C 50 48 28 62 0 62 C -28 62 -50 48 -50 18 C -50 -8 -34 -60 0 -60 Z";
// One clipPath per scene serves every egg: clipPathUnits userSpaceOnUse resolves in each egg's own local space.
export const EggDefs: React.FC<{uid: string}> = ({uid}) => <clipPath id={`${uid}-egg`}><path d={EGG}/></clipPath>;
export const EggG: React.FC<{x: number; y: number; s: number; uid: string; fill?: string; shade?: string; hi?: number; rot?: number; shadow?: number; rim?: string}> =
  ({x, y, s, uid, fill = K.cream, shade = K.creamD, hi = 1, rot = 0, shadow = 0.28, rim}) => <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
  {shadow > 0 && <ellipse cx={10} cy={68} rx={46} ry={9} fill="#000" opacity={shadow}/>}
  <path d={EGG} fill={fill}/>
  <g clipPath={`url(#${uid}-egg)`}>
    <path d="M 12 -80 L 80 -80 L 80 80 L -34 80 Z" fill={shade}/>
    {rim && <path d={EGG} fill="none" stroke={rim} strokeWidth={10} opacity={0.55} transform="translate(-5 -4)"/>}
  </g>
  {hi > 0 && <ellipse cx={-20} cy={-22} rx={9} ry={16} fill="#fff" opacity={0.85 * hi} transform="rotate(18 -20 -22)"/>}
</g>;

// A white hybrid layer (the Namakkal bird), small, pecking now and then. Feet at y = 0.
export const HenG: React.FC<{x: number; y: number; s: number; f: number; seed?: number; flip?: boolean}> = ({x, y, s, f, seed = 0, flip}) => {
  const k = (((f + seed * 31) % 96) + 96) % 96, peck = Math.exp(-((k - 22) ** 2) / 30) * 26, sway = Math.sin((f + seed * 9) / 24) * 2;
  return <g transform={`translate(${x} ${y - 60 * s}) scale(${flip ? -s : s} ${s}) rotate(${sway})`}>
    <ellipse cx={4} cy={60} rx={46} ry={8} fill="#000" opacity={0.28}/>
    <path d="M -48 0 L -72 -40 L -38 -20 Z" fill="#C9D2EE"/>
    <path d="M -48 6 C -48 -30 10 -34 26 -8 C 40 14 30 48 0 50 C -30 52 -48 34 -48 6 Z" fill={K.white}/>
    <path d="M -48 6 C -48 28 -30 52 0 50 C 30 48 40 14 26 -8 L -10 30 Z" fill="#BCC6E6"/>
    <path d="M -30 4 Q -10 -6 8 8" stroke="#D5DCF2" strokeWidth={7} fill="none" strokeLinecap="round"/>
    <path d="M -6 50 L -8 60 M 10 49 L 12 60" stroke={K.orange} strokeWidth={6} strokeLinecap="round"/>
    <g transform={`rotate(${peck} 20 -10)`}>
      <circle cx={30} cy={-24} r={18} fill={K.white}/>
      <path d="M 30 -6 A 18 18 0 0 0 48 -24 L 30 -24 Z" fill="#BCC6E6"/>
      <path d="M 18 -40 Q 24 -56 30 -42 Q 36 -58 42 -40 Z" fill={K.pink}/>
      <path d="M 44 -16 Q 50 -4 42 -4 Q 38 -10 44 -16 Z" fill={K.pink}/>
      <path d="M 46 -28 L 62 -22 L 46 -16 Z" fill={K.yellow}/>
      <circle cx={36} cy={-27} r={3.6} fill={K.ink}/>
    </g>
  </g>;
};

// A coin with an edge, a lit face, a shade half, an inner ring, the rupee sign and a glint that sweeps now and then.
export const CoinG: React.FC<{x: number; y: number; r: number; f: number; uid: string; tone?: "gold" | "copper"; seed?: number}> = ({x, y, r, f, uid, tone = "gold", seed = 0}) => {
  const c = tone === "gold" ? {face: K.yellow, shade: K.orange, rim: K.orangeD, inner: K.yellowL} : {face: "#E9A574", shade: "#C47A47", rim: "#8A4B27", inner: "#F8D2AE"};
  const wob = Math.sin((f + seed * 13) / 38) * 4, per = 150, u = ((((f + seed * 40) % per) + per) % per) / per, gx = -r * 2 + u * r * 4;
  const id = `${uid}-cn${seed}`;
  return <g transform={`translate(${x} ${y}) rotate(${wob})`}>
    <defs><clipPath id={id}><circle r={r}/></clipPath></defs>
    <ellipse cx={r * 0.18} cy={r * 1.12} rx={r * 0.95} ry={r * 0.16} fill="#000" opacity={0.32}/>
    <circle cx={0} cy={r * 0.11} r={r} fill={c.rim}/>
    <circle r={r} fill={c.face}/>
    <path d={`M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r} Z`} fill={c.shade} opacity={0.85} transform="rotate(22)"/>
    <circle r={r * 0.78} fill="none" stroke={c.inner} strokeWidth={r * 0.06} opacity={0.7}/>
    <text x={0} y={r * 0.34} textAnchor="middle" fontFamily={ROUND} fontWeight={800} fontSize={r * 0.95} fill={c.rim}>₹</text>
    <g clipPath={`url(#${id})`}><rect x={gx} y={-r * 1.3} width={r * 0.28} height={r * 2.6} fill="#fff" opacity={0.35} transform={`rotate(24 ${gx} 0)`}/></g>
    <path d={`M ${-r * 0.62} ${-r * 0.5} A ${r * 0.8} ${r * 0.8} 0 0 1 ${-r * 0.1} ${-r * 0.8}`} stroke="#fff" strokeWidth={r * 0.07} strokeLinecap="round" fill="none" opacity={0.55}/>
  </g>;
};

// A wooden egg crate seen a little from above: lit front, shaded side, a tray of eggs on top. (x, y) = bottom centre.
export const CrateG: React.FC<{x: number; y: number; s: number; tone?: number}> = ({x, y, s, tone = 0}) => {
  const front = mix("#E2A766", "#C98E52", tone), side = "#9C6334", top = "#6E4220";
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={14} cy={4} rx={80} ry={10} fill="#000" opacity={0.3}/>
    <path d="M -60 0 L 40 0 L 40 -70 L -60 -70 Z" fill={front}/>
    <path d="M 40 0 L 66 -16 L 66 -86 L 40 -70 Z" fill={side}/>
    <path d="M -60 -70 L 40 -70 L 66 -86 L -34 -86 Z" fill={top}/>
    {[-46, -20, 6].map((sx) => <path key={sx} d={`M -60 ${sx + 12} L 40 ${sx + 12}`} stroke="#B0753F" strokeWidth={4} opacity={0.7}/>)}
    <path d="M -60 -70 L 40 -70" stroke="#FFD9A8" strokeWidth={3} opacity={0.7}/>
    {[0, 1, 2, 3].map((i) => [0, 1].map((j) => { const ex = -44 + i * 24 + j * 13, ey = -74 - j * 8;
      return <g key={`${i}${j}`}><ellipse cx={ex} cy={ey} rx={10} ry={7} fill={K.cream}/><path d={`M ${ex + 2} ${ey - 7} A 10 7 0 0 1 ${ex + 2} ${ey + 7} Z`} fill={K.creamD}/></g>; }))}
  </g>;
};

// A feed sack, tied at the top. (x, y) = bottom centre.
export const SackG: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  <ellipse cx={10} cy={2} rx={70} ry={10} fill="#000" opacity={0.3}/>
  <path d="M -56 0 C -70 -40 -60 -110 -30 -130 L 30 -130 C 60 -110 70 -40 56 0 Z" fill="#E8D3A6"/>
  <path d="M 6 -130 L 30 -130 C 60 -110 70 -40 56 0 L -6 0 Z" fill="#C9AE7B"/>
  <path d="M -30 -130 L -40 -150 L 40 -150 L 30 -130 Z" fill="#D9C08E"/>
  <rect x={-34} y={-136} width={68} height={10} rx={5} fill={K.pinkD}/>
  {[[-22, -66], [0, -80], [20, -60], [-8, -48], [12, -40]].map(([gx, gy], i) => <ellipse key={i} cx={gx} cy={gy} rx={7} ry={11} fill={K.orangeD} opacity={0.75} transform={`rotate(${i * 30 - 40} ${gx} ${gy})`}/>)}
</g>;

// A small poultry shed: thatched roof (lit and shade halves), walls, a lit window when working, dark and sagging when stopped.
export const ShedG: React.FC<{x: number; y: number; s: number; f: number; off?: number; seed?: number}> = ({x, y, s, f, off = 0, seed = 0}) => {
  const lit = 0.75 + 0.25 * Math.sin(f / 20 + seed * 2.1), roofL = mix("#E0B25E", "#6C6A80", off), roofD = mix("#B58435", "#4D4B60", off),
    wall = mix(K.cream, "#5C6380", off), wallD = mix(K.creamD, "#474D69", off), win = mix(K.yellow, "#2B3152", off);
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={8} cy={2} rx={78} ry={9} fill="#000" opacity={0.3}/>
    <rect x={-58} y={-56} width={116} height={56} fill={wall}/>
    <rect x={20} y={-56} width={38} height={56} fill={wallD}/>
    <rect x={-40} y={-40} width={30} height={22} rx={3} fill={win} opacity={off > 0.5 ? 1 : lit}/>
    <rect x={2} y={-40} width={30} height={22} rx={3} fill={win} opacity={off > 0.5 ? 1 : lit}/>
    {off < 0.5 && <rect x={-46} y={-46} width={84} height={34} rx={8} fill={K.yellow} opacity={0.12 * lit}/>}
    <g transform={`rotate(${off * -6} -70 -56)`}>
      <path d="M -74 -52 L 0 -104 L 0 -52 Z" fill={roofL}/>
      <path d="M 0 -104 L 74 -52 L 0 -52 Z" fill={roofD}/>
      {[-50, -30, -10].map((hx) => <path key={hx} d={`M ${hx} -60 L ${hx + 12} -80`} stroke={roofD} strokeWidth={3} opacity={0.6}/>)}
    </g>
  </g>;
};

// A soft glowing ring pulse (pins, highlights). Phase is continuous in f.
export const Pulse: React.FC<{x: number; y: number; f: number; r?: number; color?: string; period?: number; n?: number}> = ({x, y, f, r = 30, color = K.white, period = 50, n = 2}) => <g>
  {Array.from({length: n}, (_, i) => { const u = ((((f + (i * period) / n) % period) + period) % period) / period;
    return <circle key={i} cx={x} cy={y} r={r * (1 + u * 1.6)} fill="none" stroke={color} strokeWidth={4} opacity={(1 - u) * Math.min(1, u * 6) * 0.8}/>; })}
</g>;

export {K, ROUND, SANS, ease, easeIO, pop};
