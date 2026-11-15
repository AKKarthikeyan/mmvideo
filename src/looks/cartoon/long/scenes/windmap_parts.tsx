// WINDMAP drawing parts: flowing arrows, label pills, clouds, rain, heat shimmer. Flat fills, 8 px ink, hard offset shadows.
import React from "react";
import {C} from "../../palette";
import {ROUND, pop} from "../../ui";
import {curve, pointAt, slice, type Curve, type Pt} from "./windmap_geo";

export const INK = C.ink;
const shadowCol = "rgba(23,32,58,0.28)";

// A thick, ink-outlined arrow whose body draws on from the tail (p 0..1) and carries chevrons that keep flowing along it.
export const FlowArrow: React.FC<{c: Curve | Pt[]; f: number; p?: number; w?: number; fill?: string; chev?: string; head?: boolean; speed?: number; shadow?: boolean; opacity?: number; ink?: number}> =
({c, f, p = 1, w = 34, fill = C.white, chev = C.blue, head = true, speed = 2.4, shadow = true, opacity = 1, ink = 7}) => {
  const cv = React.useMemo(() => Array.isArray(c) ? curve(c) : c, [c]);
  if (p <= 0.003 || opacity <= 0.003) return null;
  const Lr = cv.total * Math.min(1, p), hl = head ? w * 1.35 : 0;
  const bodyEnd = Math.max(0, Lr - hl * 0.55);
  const body = slice(cv, bodyEnd), d = "M" + body.map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join("L");
  const tip = pointAt(cv, Lr), hs = head && Lr > hl ? Math.min(1, (Lr - hl) / (hl * 0.6)) : 0;
  const ca = Math.cos(tip.a), sa = Math.sin(tip.a);
  const hp = (u: number, v: number) => `${(tip.x + ca * u - sa * v).toFixed(1)},${(tip.y + sa * u + ca * v).toFixed(1)}`;
  const hw = w * 1.0 * hs, H = hl * hs;
  const headPts = `${hp(0, 0)} ${hp(-H, -hw)} ${hp(-H * 0.8, 0)} ${hp(-H, hw)}`;
  const chevs: React.ReactNode[] = [];
  const gap = w * 2.2, off = (f * speed) % gap;
  for (let s = off; s < bodyEnd - w * 0.3; s += gap) {
    if (s < w * 0.3) continue;
    const q = pointAt(cv, s), k = w * 0.26, fade = Math.min(1, (bodyEnd - s) / (w * 1.2), s / (w * 1.2));
    const cc = Math.cos(q.a), ss = Math.sin(q.a), P = (u: number, v: number) => `${(q.x + cc * u - ss * v).toFixed(1)},${(q.y + ss * u + cc * v).toFixed(1)}`;
    chevs.push(<polyline key={s} points={`${P(-k, -k * 1.15)} ${P(k * 0.7, 0)} ${P(-k, k * 1.15)}`} fill="none" stroke={chev} strokeWidth={w * 0.2} strokeLinecap="round" strokeLinejoin="round" opacity={fade}/>);
  }
  const g = (dx: number, dy: number, col: string, ww: number, isFill: boolean) => <g transform={`translate(${dx} ${dy})`}>
    <path d={d} fill="none" stroke={col} strokeWidth={ww} strokeLinecap="butt" strokeLinejoin="round"/>
    {hs > 0 && <polygon points={headPts} fill={col} stroke={col} strokeWidth={isFill ? 0 : ink * 2} strokeLinejoin="round"/>}
  </g>;
  return <g opacity={opacity}>
    {shadow && g(0, 8, shadowCol, w + ink * 2, false)}
    {g(0, 0, INK, w + ink * 2, false)}
    {g(0, 0, fill, w, true)}
    {chevs}
  </g>;
};

// Text width estimate for the rounded display face (capitals).
export const textW = (t: string, size: number) => t.split("").reduce((a, ch) => a + size * (ch === " " ? 0.3 : "IJ.,:'".includes(ch) ? 0.36 : "MW".includes(ch) ? 0.96 : /[A-Z0-9]/.test(ch) ? 0.68 : 0.6), 0);
export const pillSize = (text: string, size: number) => ({w: textW(text, size) + size * 1.3, h: size * 1.75 + 8});

// White rounded label with a hard shadow. (x, y) = centre. Pops in from `at`.
export const PillBox: React.FC<{x: number; y: number; text: string; f: number; at: number; size?: number; fill?: string; color?: string; fade?: number}> =
({x, y, text, f, at, size = 34, fill = C.white, color = INK, fade = 1}) => {
  const t = pop(f, at, 220);
  if (t <= 0.01 || fade <= 0.01) return null;
  const w = textW(text, size) + size * 1.3, h = size * 1.75;
  return <g transform={`translate(${x} ${y}) scale(${Math.max(0.01, t)})`} opacity={fade}>
    <rect x={-w / 2} y={-h / 2 + 8} width={w} height={h} rx={h / 2} fill={INK}/>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={fill} stroke={INK} strokeWidth={6}/>
    <text x={0} y={size * 0.36} textAnchor="middle" fontFamily={ROUND} fontWeight={800} fontSize={size} fill={color} letterSpacing={0.5}>{text}</text>
  </g>;
};

// Flat cartoon cloud (ink first, then the white fill, so the circles merge).
export const Cloud: React.FC<{x: number; y: number; s?: number; fill?: string; bob?: number}> = ({x, y, s = 1, fill = C.white, bob = 0}) => {
  const cs = [[-34, 6, 24], [-8, -8, 31], [22, -2, 27], [44, 10, 19], [6, 12, 25]] as const;
  return <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
    {cs.map(([cx, cy, r], i) => <circle key={"o" + i} cx={cx} cy={cy} r={r + 5} fill={INK}/>)}
    {cs.map(([cx, cy, r], i) => <circle key={"i" + i} cx={cx} cy={cy} r={r} fill={fill}/>)}
  </g>;
};

// Falling rain streaks inside a rectangle (looping).
export const Rain: React.FC<{x: number; y: number; w: number; h: number; f: number; n?: number; opacity?: number; seed?: number}> = ({x, y, w, h, f, n = 16, opacity = 1, seed = 1}) => {
  if (opacity <= 0.01) return null;
  const r = (i: number) => { const v = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453; return v - Math.floor(v); };
  return <g opacity={opacity} stroke={C.royal} strokeWidth={5} strokeLinecap="round">
    {Array.from({length: n}).map((_, i) => {
      const cx = x + r(i) * w, span = h * 1.3, ph = (f * 5 + r(i + 40) * span) % span, cy = y + ph - h * 0.15;
      const a = Math.max(0, Math.min(1, 1 - Math.abs(ph / span - 0.5) * 2 + 0.2));
      return <line key={i} x1={cx} y1={cy} x2={cx - 5} y2={cy + 20} opacity={a}/>;
    })}
  </g>;
};

// Rising wavy heat lines.
export const Shimmer: React.FC<{x: number; y: number; w: number; h: number; f: number; n?: number; color?: string; opacity?: number}> = ({x, y, w, h, f, n = 7, color = C.white, opacity = 1}) => (
  <g opacity={opacity} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round">
    {Array.from({length: n}).map((_, i) => {
      const cx = x + (i + 0.5) / n * w, ph = ((f * 1.6 + i * 23) % 100) / 100, top = y + h * (1 - ph), a = Math.sin(Math.PI * ph);
      return <path key={i} d={`M${cx} ${top + 40}q12 -10 0 -20t0 -20`} opacity={0.9 * a}/>;
    })}
  </g>
);
