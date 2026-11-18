// A01 v3 premium kit (18 Oct 2026): camera with parallax depth, painted plates, sprites, coins, keys, soldiers,
// kinetic text and source chips. Everything moves from the frame number only (deterministic renders).
import React from "react";
import {AbsoluteFill, Easing, Img, random, staticFile} from "remotion";
import {FONT, H, W, inOut, lin, spr} from "../common";

export const P = (n: string) => staticFile("premium/a01v3/" + n);
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const ease = (f: number, a: number, b: number, e: (t: number) => number = inOut) => e(clamp01((f - a) / (b - a)));

// ---------- camera ----------
// A camera shows world point (x, y) at the screen centre at scale s. depth > 1 = nearer layer (moves more).
export type Cam = {s: number; x: number; y: number};
export const camT = (c: Cam, depth = 1) => {
  const s = 1 + (c.s - 1) * depth, x = 960 + (c.x - 960) * depth, y = 540 + (c.y - 540) * depth;
  return `translate(${960 - x * s}px, ${540 - y * s}px) scale(${s})`;
};
export type Key = [number, number, number, number, ((t: number) => number)?];
// Piecewise camera; scale is interpolated geometrically so zooms feel even.
export const camAt = (f: number, keys: Key[]): Cam => {
  if (f <= keys[0][0]) return {s: keys[0][1], x: keys[0][2], y: keys[0][3]};
  for (let i = 1; i < keys.length; i++) {
    const [f1, s1, x1, y1, e] = keys[i];
    const [f0, s0, x0, y0] = keys[i - 1];
    if (f <= f1) {
      const t = (e || inOut)(clamp01((f - f0) / (f1 - f0)));
      return {s: s0 * Math.pow(s1 / s0, t), x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t};
    }
  }
  const l = keys[keys.length - 1];
  return {s: l[1], x: l[2], y: l[3]};
};
export const Layer: React.FC<{cam: Cam; depth?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({cam, depth = 1, style, children}) => (
  <AbsoluteFill style={{transform: camT(cam, depth), transformOrigin: "0 0", ...style}}>{children}</AbsoluteFill>
);
export const Plate: React.FC<{src: string; style?: React.CSSProperties}> = ({src, style}) => (
  <Img src={P(src)} style={{position: "absolute", left: 0, top: 0, width: W, height: H, ...style}}/>
);
export const Svg: React.FC<{children?: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", left: 0, top: 0, overflow: "visible", ...style}}>{children}</svg>
);

// ---------- shared SVG gradients ----------
export const KitDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: "absolute"}}>
    <defs>
      <radialGradient id="k-coin" cx="0.38" cy="0.32" r="0.8"><stop offset="0" stopColor="#FFF3C4"/><stop offset="0.5" stopColor="#F4C95A"/><stop offset="1" stopColor="#C98A2E"/></radialGradient>
      <linearGradient id="k-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FCE7A6"/><stop offset="0.45" stopColor="#E0B04F"/><stop offset="1" stopColor="#9A6A22"/></linearGradient>
      <radialGradient id="k-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFF2C9" stopOpacity="0.95"/><stop offset="0.45" stopColor="#FFD27A" stopOpacity="0.45"/><stop offset="1" stopColor="#FFB84D" stopOpacity="0"/></radialGradient>
      <radialGradient id="k-hole" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#000" stopOpacity="1"/><stop offset="0.55" stopColor="#000" stopOpacity="0.85"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient>
      <linearGradient id="k-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF4D8" stopOpacity="0"/><stop offset="0.35" stopColor="#FFF4D8" stopOpacity="0.55"/><stop offset="1" stopColor="#FFE6B0" stopOpacity="0.9"/></linearGradient>
      <linearGradient id="k-beamGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFD36E" stopOpacity="0"/><stop offset="0.35" stopColor="#FFC94F" stopOpacity="0.6"/><stop offset="1" stopColor="#FFB338" stopOpacity="1"/></linearGradient>
      <radialGradient id="k-shadow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#1A0E05" stopOpacity="0.7"/><stop offset="1" stopColor="#1A0E05" stopOpacity="0"/></radialGradient>
    </defs>
  </svg>
);

// ---------- coins ----------
// A gold coin spinning about its vertical axis (spin in radians); r = radius in px.
export const Coin: React.FC<{x: number; y: number; r: number; spin: number; o?: number}> = ({x, y, r, spin, o = 1}) => {
  const k = Math.max(0.14, Math.abs(Math.cos(spin)));
  return (
    <g opacity={o}>
      <ellipse cx={x + r * 0.1 * Math.sign(Math.sin(spin))} cy={y} rx={r * k + r * 0.12} ry={r} fill="#9C6526"/>
      <ellipse cx={x} cy={y} rx={r * k} ry={r} fill="url(#k-coin)"/>
      <ellipse cx={x} cy={y} rx={r * k * 0.7} ry={r * 0.7} fill="none" stroke="#B57D27" strokeWidth={Math.max(1, r * 0.09)} opacity={0.8}/>
      <ellipse cx={x - r * k * 0.3} cy={y - r * 0.35} rx={r * k * 0.18} ry={r * 0.12} fill="#FFFBEA" opacity={0.75}/>
    </g>
  );
};
// A flat coin lying in a stack (seen from slightly above).
export const StackCoin: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => (
  <g>
    <path d={`M ${x - r} ${y} L ${x - r} ${y + r * 0.28} A ${r} ${r * 0.32} 0 0 0 ${x + r} ${y + r * 0.28} L ${x + r} ${y} Z`} fill="#B97F2C" stroke="#6E4314" strokeWidth={2}/>
    <rect x={x - r * 0.7} y={y + 2} width={r * 0.25} height={r * 0.22} fill="#F6D27A" opacity={0.6}/>
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.32} fill="url(#k-coin)" stroke="#8A5A1C" strokeWidth={2}/>
    <ellipse cx={x} cy={y} rx={r * 0.72} ry={r * 0.22} fill="none" stroke="#B57D27" strokeWidth={2} opacity={0.7}/>
  </g>
);
// Deterministic projectile stream: spawns `rate` coins per frame in [a, b) from (x0, y0); each falls with gravity.
export const CoinStream: React.FC<{f: number; a: number; b: number; rate: number; x0: number; y0: number; seed: string;
  vx: [number, number]; vy: [number, number]; g?: number; r?: [number, number]; life?: number; floorY?: number}> =
  ({f, a, b, rate, x0, y0, seed, vx, vy, g = 0.9, r = [9, 16], life = 60, floorY}) => {
  const out: React.ReactNode[] = [];
  const n0 = Math.max(0, Math.floor((f - life - a) * rate)), n1 = Math.floor((Math.min(f, b) - a) * rate);
  for (let i = n0; i <= n1; i++) {
    const t0 = a + i / rate, age = f - t0;
    if (age < 0 || age > life) continue;
    const q = (k: string) => random(seed + k + i);
    const ux = vx[0] + (vx[1] - vx[0]) * q("x"), uy = vy[0] + (vy[1] - vy[0]) * q("y");
    let x = x0 + (q("o") - 0.5) * 30 + ux * age, y = y0 + uy * age + 0.5 * g * age * age;
    if (floorY != null && y > floorY) continue;
    const rr = r[0] + (r[1] - r[0]) * q("r");
    out.push(<Coin key={i} x={x} y={y} r={rr} spin={q("s") * 6 + age * (0.25 + q("w") * 0.3)} o={Math.min(1, (life - age) / 10)}/>);
  }
  return <g>{out}</g>;
};

// ---------- brass key ----------
export const BrassKey: React.FC<{x: number; y: number; rot: number; spinX?: number; s?: number}> = ({x, y, rot, spinX = 1, s = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${spinX * s} ${s})`}>
    <circle cx={0} cy={0} r={30} fill="url(#k-brass)" stroke="#7A5418" strokeWidth={3}/>
    <circle cx={0} cy={0} r={11} fill="#3A2A14"/>
    <rect x={-7} y={26} width={14} height={112} rx={5} fill="url(#k-brass)" stroke="#7A5418" strokeWidth={2.5}/>
    <path d="M 7 104 L 30 104 L 30 116 L 20 116 L 20 126 L 30 126 L 30 138 L 7 138 Z" fill="url(#k-brass)" stroke="#7A5418" strokeWidth={2.5}/>
    <ellipse cx={-10} cy={-12} rx={9} ry={5} fill="#FFF6D6" opacity={0.7}/>
  </g>
);

// ---------- a little grey toy soldier (code-drawn, faceless) ----------
export const Soldier: React.FC<{x: number; y: number; s: number; dir: 1 | -1; phase: number; o?: number}> = ({x, y, s, dir, phase, o = 1}) => {
  const bob = Math.abs(Math.sin(phase)) * 3, leg = Math.sin(phase) * 5;
  return (
    <g transform={`translate(${x} ${y - bob * s}) scale(${dir * s} ${s})`} opacity={o}>
      <ellipse cx={0} cy={bob + 2} rx={13} ry={3.5} fill="#1A0E05" opacity={0.3}/>
      <rect x={-6 + leg * 0.4} y={-14} width={5} height={14} rx={2} fill="#5F6670"/>
      <rect x={1 - leg * 0.4} y={-14} width={5} height={14} rx={2} fill="#59606A"/>
      <rect x={-9} y={-36} width={18} height={24} rx={7} fill="#8C949E"/>
      <circle cx={0} cy={-44} r={9} fill="#A7AEB7"/>
      <path d="M -11 -45 Q 0 -60 11 -45 Z" fill="#6C737C"/>
      <line x1={12} y1={-62} x2={12} y2={-8} stroke="#4E555E" strokeWidth={3} strokeLinecap="round"/>
      <path d="M 12 -70 L 16 -60 L 8 -60 Z" fill="#C9CED4"/>
      <ellipse cx={-10} cy={-26} rx={7} ry={10} fill="#737B85" stroke="#A7AEB7" strokeWidth={2}/>
    </g>
  );
};

// ---------- text ----------
// Big kinetic word(s): letters spring up one by one; `out` frame makes them rise and fade away.
export const Kinetic: React.FC<{f: number; at: number; text: string; x: number; y: number; size: number; color?: string; out?: number;
  stroke?: string; stagger?: number; shadow?: string}> = ({f, at, text, x, y, size, color = "#FFF4DD", out, stroke, stagger = 3, shadow}) => {
  if (f < at) return null;
  const o = out != null ? 1 - ease(f, out, out + 10) : 1;
  if (o <= 0) return null;
  const lift = out != null ? ease(f, out, out + 10) * -40 : 0;
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) translateY(${lift}px)`, display: "flex", opacity: o, whiteSpace: "pre"}}>
      {text.split("").map((ch, i) => {
        const s = spr(f, at + i * stagger, 11, 170);
        return <span key={i} style={{display: "inline-block", fontFamily: FONT, fontWeight: 800, fontSize: size, color, letterSpacing: size * 0.02,
          transform: `translateY(${(1 - s) * size * 0.7}px) scale(${0.7 + 0.3 * s})`, opacity: clamp01(s * 1.8), lineHeight: 1,
          WebkitTextStroke: stroke, textShadow: shadow || "0 6px 0 rgba(60,30,8,0.55), 0 16px 40px rgba(0,0,0,0.55)"}}>{ch}</span>;
      })}
    </div>
  );
};
// Small source chip (the truth label): top-left corner, never in the caption band.
export const Chip: React.FC<{f: number; at: number; until: number; text: string}> = ({f, at, until, text}) => {
  if (f < at || f > until + 10) return null;
  const o = Math.min(ease(f, at, at + 10), 1 - ease(f, until, until + 10));
  return (
    <div style={{position: "absolute", left: 48, top: 44, opacity: o, transform: `translateX(${(1 - ease(f, at, at + 12, Easing.out(Easing.cubic))) * -30}px)`,
      fontFamily: FONT, fontWeight: 700, fontSize: 24, letterSpacing: 2, color: "#FFF4DD", background: "rgba(30,18,8,0.62)",
      padding: "9px 18px", borderRadius: 8, border: "1.5px solid rgba(255,220,150,0.55)"}}>{text}</div>
  );
};
export const fmtInt = (v: number) => Math.round(v).toLocaleString("en-US");
