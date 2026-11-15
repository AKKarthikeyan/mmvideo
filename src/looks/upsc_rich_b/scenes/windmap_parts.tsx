// WINDMAP drawing parts for look B: wind ribbons with heads, paper tags and cards, rain, heat shimmer, gauge, beach.
import React, {useMemo} from "react";
import {getLength, getPointAtLength, getTangentAtLength} from "@remotion/paths";
import {SANS, SERIF, clamp, eo, rng} from "../kit";

export const WmDefs: React.FC = () => (
  <defs>
    <filter id="wm-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter>
    <filter id="wm-sh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4.5"/></filter>
    <filter id="wm-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2"/></filter>
    {/* Part 2: blur filters with a fixed, generous region, so thin or small shapes never show a boxed halo. wm-b* work in map space, wmc-* inside a Cloud. */}
    <filter id="wm-b12" filterUnits="userSpaceOnUse" x="-600" y="-600" width="3200" height="2400"><feGaussianBlur stdDeviation="12"/></filter>
    <filter id="wm-b5" filterUnits="userSpaceOnUse" x="-600" y="-600" width="3200" height="2400"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="wmc-blur12" filterUnits="userSpaceOnUse" x="-420" y="-300" width="840" height="600"><feGaussianBlur stdDeviation="12"/></filter>
    <filter id="wmc-blur3" filterUnits="userSpaceOnUse" x="-420" y="-300" width="840" height="600"><feGaussianBlur stdDeviation="3"/></filter>
  </defs>
);

/** A wind ribbon: soft shadow and glow, a coloured body with a thin darker outline and a light core, flowing dots, chevrons, and a head.
 *  p = reveal 0..1 (draws on from the tail); head = head scale 0..1 (fade it out when the wind continues as another ribbon). */
export const Flow: React.FC<{id: string; d: string; p: number; f: number; c1: string; c2: string; w?: number; speed?: number; ph?: number; head?: number; shadow?: boolean; op?: number; dots?: boolean; core?: string}> =
({id, d, p, f, c1, c2, w = 18, speed = 2.4, ph = 0, head = 1, shadow = true, op = 1, dots = true, core = "#ffffff"}) => {
  const len = useMemo(() => getLength(d), [d]);
  if (p <= 0.004 || op <= 0.004) return null;
  const L = Math.min(len, p * len), hl = w * 2.3 * head, hw = w * 1.15 * head;
  const bodyL = Math.max(0, L - hl * 0.62);
  const tip = getPointAtLength(d, L), tg = getTangentAtLength(d, L), ang = (Math.atan2(tg.y, tg.x) * 180) / Math.PI;
  const dash = `${bodyL.toFixed(1)} ${(len + 40).toFixed(1)}`;
  const spacing = Math.max(46, w * 3.6), n = Math.max(2, Math.floor(len / spacing)), cyc = spacing * n;
  const chev: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const s = (f * speed + i * spacing) % cyc;
    if (s < w * 0.5 || s > bodyL - w * 0.4) continue;
    const pt = getPointAtLength(d, s), t = getTangentAtLength(d, s), a = (Math.atan2(t.y, t.x) * 180) / Math.PI, e = Math.min(1, Math.min(s, bodyL - s) / (w * 1.4));
    const k = w * 0.34;
    chev.push(<path key={i} transform={`translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${a.toFixed(1)})`} d={`M${-k},${-k * 1.1} L${k * 0.8},0 L${-k},${k * 1.1} L${-k * 0.45},0 Z`} fill="#fff" stroke={c2} strokeWidth="1.5" strokeLinejoin="round" opacity={e * 0.97}/>);
  }
  return (
    <g opacity={op}>
      <mask id={`${id}-m`}><path d={d} stroke="#fff" strokeWidth={w * 3} fill="none" strokeDasharray={dash}/></mask>
      {shadow && <path d={d} stroke="#0b2a4a" strokeWidth={w * 1.1} strokeLinecap="round" fill="none" strokeDasharray={dash} opacity="0.28" transform={`translate(0 ${w * 0.55})`} filter="url(#wm-sh)"/>}
      <path d={d} stroke={c1} strokeWidth={w * 2.6} strokeLinecap="round" fill="none" strokeDasharray={dash} opacity="0.26" filter="url(#wm-glow)"/>
      <path d={d} stroke={c2} strokeWidth={w + 4.5} fill="none" strokeDasharray={dash}/>
      <path d={d} stroke={c1} strokeWidth={w} fill="none" strokeDasharray={dash}/>
      <path d={d} stroke={core} strokeWidth={w * 0.36} fill="none" strokeDasharray={dash} opacity="0.5" transform={`translate(0 ${-w * 0.14})`}/>
      {dots && <g mask={`url(#${id}-m)`}><path d={d} stroke="#fff" strokeWidth={w * 0.2} strokeLinecap="round" fill="none" strokeDasharray="1 15" strokeDashoffset={-f * speed * 0.75} opacity="0.95"/></g>}
      {chev}
      {head > 0.02 && L > hl * 0.8 && (
        <g transform={`translate(${tip.x.toFixed(1)} ${tip.y.toFixed(1)}) rotate(${ang.toFixed(1)})`} opacity={clamp((L - hl * 0.8) / (hl * 0.5))}>
          <path d={`M${hl * 0.04},0 L${-hl * 0.92},${-hw} L${-hl * 0.62},0 L${-hl * 0.92},${hw} Z`} fill={c2} stroke={c2} strokeWidth="5" strokeLinejoin="round" transform={`translate(0 ${w * 0.3})`} opacity="0.3" filter="url(#wm-soft)"/>
          <path d={`M${hl * 0.04},0 L${-hl * 0.92},${-hw} L${-hl * 0.62},0 L${-hl * 0.92},${hw} Z`} fill={c1} stroke={c2} strokeWidth="3" strokeLinejoin="round"/>
          <path d={`M${hl * 0.04},0 L${-hl * 0.72},${-hw * 0.7} L${-hl * 0.5},0 Z`} fill={core} opacity="0.4"/>
        </g>
      )}
    </g>
  );
};

/** a warm paper tag (HTML, drawn above the map). (x, y) is the centre. */
export const estW = (text: string, size: number) => text.split("").reduce((a, ch) => a + size * (ch === " " ? 0.32 : "iIl.,:;'|".includes(ch) ? 0.36 : "MW".includes(ch) ? 0.98 : /[A-Z0-9]/.test(ch) ? 0.7 : /[·→—–]/.test(ch) ? 0.7 : 0.56), 0) + text.length * size * 0.07;
export const Tag: React.FC<{x: number; y: number; text: string; a: number; fade?: number; size?: number; hot?: boolean}> = ({x, y, text, a, fade = 1, size = 28, hot}) => {
  const o = a * fade;
  if (o <= 0.01) return null;
  return (
    <div style={{position: "absolute", left: x, top: y - (1 - a) * 12, transform: `translate(-50%,-50%) scale(${0.92 + 0.08 * a})`, opacity: o, whiteSpace: "nowrap",
      display: "flex", alignItems: "center", gap: 12, padding: "11px 26px 11px 20px", borderRadius: 40,
      background: "linear-gradient(160deg, rgba(255,252,243,.96), rgba(255,243,219,.88))", border: "1.5px solid rgba(190,110,50,.55)",
      boxShadow: "0 18px 34px -16px rgba(20,36,60,.7), 0 4px 10px -4px rgba(20,36,60,.4), inset 0 1.5px 0 rgba(255,255,255,.9)",
      fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: "0.06em", color: "#6a3318"}}>
      <span style={{width: 13, height: 13, borderRadius: 8, background: hot ? "#e0452a" : "#d8682a", boxShadow: `0 0 0 4px ${hot ? "#e0452a" : "#d8682a"}33`, flex: "none"}}/>{text}
    </div>
  );
};

/** badge card: small caption over a big serif value */
export const Card: React.FC<{x: number; y: number; title: string; value: string; a: number; size?: number}> = ({x, y, title, value, a, size = 72}) => {
  if (a <= 0.01) return null;
  const w = Math.max(estW(title, 17) + 8, estW(value, size) * 0.82) + 62;
  return (
    <div style={{position: "absolute", left: x, top: y + (1 - a) * 20, width: w, opacity: a, whiteSpace: "nowrap",
      background: "linear-gradient(160deg, rgba(255,252,243,.94), rgba(255,243,219,.82))", border: "1.5px solid rgba(190,110,50,.5)", borderRadius: 20,
      boxShadow: "0 30px 60px -26px rgba(10,30,60,.65), inset 0 1.5px 0 rgba(255,255,255,.9)", padding: "18px 30px 20px", boxSizing: "border-box"}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 17, letterSpacing: "0.15em", color: "#8c4a22"}}>{title}</div>
      <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1.1, color: "#b8461a", letterSpacing: "-0.01em"}}>{value}</div>
    </div>
  );
};
export const cardW = (title: string, value: string, size = 72) => Math.max(estW(title, 17) + 8, estW(value, size) * 0.82) + 62;

/** falling rain inside a rectangle (looping, smooth in f) */
export const Rain: React.FC<{x: number; y: number; w: number; h: number; f: number; n?: number; op?: number; seed?: number}> = ({x, y, w, h, f, n = 24, op = 1, seed = 1}) => {
  const q = useMemo(() => { const r = rng(seed * 977); return Array.from({length: n}).map(() => ({x: r(), ph: r(), l: 16 + r() * 16})); }, [n, seed]);
  if (op <= 0.01) return null;
  return (
    <g opacity={op} stroke="#d6efff" strokeWidth="2.6" strokeLinecap="round">
      {q.map((s, i) => {
        const span = h + 40, t = (s.ph + f * 0.021 * (1 + (i % 3) * 0.12)) % 1, cy = y + t * span - 20, cx = x + s.x * w - t * 14, a = Math.sin(Math.PI * t);
        return <line key={i} x1={cx} y1={cy} x2={cx - 5} y2={cy + s.l} opacity={a * 0.95}/>;
      })}
    </g>
  );
};

/** rising wavy heat lines */
export const Shimmer: React.FC<{x: number; y: number; w: number; h: number; f: number; n?: number; col?: string; op?: number}> = ({x, y, w, h, f, n = 7, col = "#fff6d8", op = 1}) => (
  <g opacity={op} fill="none" stroke={col} strokeWidth="3.4" strokeLinecap="round">
    {Array.from({length: n}).map((_, i) => {
      const cx = x + ((i + 0.5) / n) * w, ph = (f * 0.016 + i * 0.173) % 1, top = y + h * (1 - ph), a = Math.sin(Math.PI * ph), sw = Math.sin(f / 9 + i) * 3;
      return <path key={i} d={`M${cx + sw},${top + 46} q14,-11 0,-23 t0,-23`} opacity={0.85 * a}/>;
    })}
  </g>
);

/** a glass rain gauge with a few ticks (no numbers) and a thin line of water */
export const Gauge: React.FC<{x: number; y: number; a: number; f: number}> = ({x, y, a, f}) => {
  if (a <= 0.01) return null;
  const lvl = 0.07 + 0.012 * Math.sin(f / 9);
  return (
    <g transform={`translate(${x} ${y}) scale(${eo(a)})`} opacity={a}>
      <ellipse cx="0" cy="62" rx="40" ry="9" fill="#0b2a4a" opacity="0.28" filter="url(#wm-soft)"/>
      <rect x="-26" y="-58" width="52" height="116" rx="10" fill="rgba(255,255,255,.55)" stroke="#6a8aa8" strokeWidth="2.4"/>
      <rect x="-21" y={52 - 100 * lvl} width="42" height={100 * lvl} rx="3" fill="#3d9ad8" opacity="0.9"/>
      {[-36, -14, 8, 30].map((yy) => <line key={yy} x1="-26" x2="-10" y1={yy} y2={yy} stroke="#6a8aa8" strokeWidth="2.4"/>)}
      <rect x="-19" y="-52" width="7" height="100" rx="3.5" fill="#fff" opacity="0.75"/>
      <rect x="-30" y="-64" width="60" height="9" rx="4" fill="#9a6a3a" stroke="#6a4624" strokeWidth="1.6"/>
    </g>
  );
};

/** the opening beach (zoomFromBeach), seen from above: sea, foam, wet and dry sand, palm shadows. It fades as the camera pulls out. */
export const Beach: React.FC<{f: number; a: number}> = ({f, a}) => {
  const grains = useMemo(() => { const r = rng(5); return Array.from({length: 240}).map(() => ({x: r() * 1920, y: r() * 1080, s: 0.8 + r() * 2.2, o: 0.1 + r() * 0.35})); }, []);
  if (a <= 0.01) return null;
  const sh = (y: number, o = 0) => 880 + o + Math.sin(y / 110 + f / 18) * 34 + Math.sin(y / 47 - f / 12) * 9;
  const ys = Array.from({length: 30}).map((_, i) => i * 38);
  const line = (o = 0) => "M" + ys.map((y) => `${sh(y, o).toFixed(1)} ${y}`).join("L");
  return (
    <g opacity={a}>
      <defs>
        <linearGradient id="bc-sea" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#6fd6cf"/><stop offset="0.25" stopColor="#38a9c4"/><stop offset="1" stopColor="#14588c"/></linearGradient>
        <linearGradient id="bc-sand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d8b87a"/><stop offset="1" stopColor="#f0d9a2"/></linearGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#bc-sand)"/>
      {grains.map((g, i) => g.x > sh(g.y) + 30 && <circle key={i} cx={g.x} cy={g.y} r={g.s} fill={i % 2 ? "#a8844c" : "#fff6dc"} opacity={g.o}/>)}
      <path d={line(40) + "L0 1080L0 0Z"} fill="#b9945a" opacity="0.5"/>
      <path d={line(10) + "L0 1080L0 0Z"} fill="url(#bc-sea)"/>
      <path d={line(-34) + `L0 1080L0 0Z`} fill="#fff" opacity="0.18"/>
      <path d={line(-20 - Math.sin(f / 14) * 8)} fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeDasharray="70 26" opacity="0.9"/>
      <path d={line(-70 - Math.sin(f / 14 + 1) * 10)} fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeDasharray="40 40" opacity="0.5"/>
      <path d={line(8)} fill="none" stroke="#fff6dc" strokeWidth="3" opacity="0.8"/>
      <path d={line(30) + "L0 1080L0 0Z"} fill="#8a6a3a" opacity="0.12"/>
      {grains.filter((_, i) => i % 5 === 0).map((g, i) => g.x > sh(g.y) + 60 && <g key={"pb" + i} transform={`translate(${g.x} ${g.y})`}><ellipse cx="3" cy="4" rx={g.s * 4} ry={g.s * 2.6} fill="#5a4426" opacity="0.28"/><ellipse rx={g.s * 4} ry={g.s * 2.6} fill={i % 3 ? "#cdb88e" : "#e9dcc0"} stroke="#9a8256" strokeWidth="0.8"/></g>)}
      {ys.map((y, i) => <circle key={"fb" + i} cx={sh(y, -26) + Math.sin(f / 15 + i * 2) * 10} cy={y + 14} r={5 + (i % 3) * 3} fill="#fff" opacity="0.6"/>)}
      {/* palm fronds seen from above, casting long shadows */}
      {[[1560, 240, 1.0], [1700, 780, 0.8]].map(([px, py, s], i) => (
        <g key={i} transform={`translate(${px} ${py}) scale(${s}) rotate(${Math.sin(f / 30 + i) * 3})`}>
          {Array.from({length: 9}).map((_, k) => <path key={k} transform={`rotate(${k * 40 + i * 13})`} d="M0,0 C60,-30 140,-26 210,18 C140,-6 70,-4 0,8 Z" fill="#2f7a3a" stroke="#1f5a2c" strokeWidth="1.6"/>)}
          <circle r="14" fill="#1f5a2c"/>
        </g>
      ))}
    </g>
  );
};
