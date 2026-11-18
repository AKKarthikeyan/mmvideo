// Recurring devices for "Jio's Size Advantage Has a Catch" (AK brief, 20 Oct 2026). Every scene that shows one of these
// uses THIS component, so the film reads as one system: the recharge phone (01, 02, 08, 12), the payment marker (01-04, 12),
// the cash calendar (04, 10, 11, 12), the 1,000-dot grid (07) and the per-Rs-100 bridge (04, 12).
// All drawn in code (original artwork): no brand, no real customer data, no invented amounts or dates.
import React from "react";
import {random} from "remotion";
import {C, F, clamp01, ease, inOut, lin, outCubic, outQuint, spr} from "./kit/tokens";

// =====================================================================================================
// Recharge phone: a generic prepaid recharge screen. Finger taps "Pay" at tapAt; the button turns into "Paid".
// =====================================================================================================
export const RechargePhone: React.FC<{f: number; x?: number; y?: number; s?: number; tapAt?: number; enterAt?: number; rot?: number; dim?: number;
  label?: string}> = ({f, x = 960, y = 540, s = 1, tapAt, enterAt = -30, rot = -2, dim = 0, label = "Mobile data pack"}) => {
  const e = enterAt <= -30 ? 1 : spr(f, enterAt, 14, 150);
  if (e <= 0.001) return null;
  const W0 = 520, H0 = 1040;
  const paid = tapAt != null ? ease(f, tapAt + 3, tapAt + 9, outCubic) : 0;
  const finger = tapAt != null ? ease(f, tapAt - 14, tapAt, outCubic) * (1 - ease(f, tapAt + 4, tapAt + 16)) : 0;
  const ripple = tapAt != null && f >= tapAt ? clamp01((f - tapAt) / 14) : 0;
  return (
    <div style={{position: "absolute", left: x, top: y, width: W0, height: H0, transform: `translate(-50%, -50%) translateY(${(1 - e) * 500}px) rotate(${rot}deg) scale(${s})`,
      opacity: clamp01(e * 2)}}>
      <div style={{position: "absolute", inset: 0, borderRadius: 70, background: "linear-gradient(160deg, #3A3733, #1C1A18)",
        boxShadow: "0 8px 10px rgba(0,0,0,0.25), 0 40px 70px rgba(0,0,0,0.35)"}}/>
      <div style={{position: "absolute", left: 22, top: 22, right: 22, bottom: 22, borderRadius: 52, background: C.white, overflow: "hidden"}}>
        <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 150, background: C.teal}}/>
        <div style={{position: "absolute", left: 40, top: 62, fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: C.white}}>Recharge</div>
        <div style={{position: "absolute", left: 40, top: 200, right: 40, padding: "28px 30px", borderRadius: 24, background: C.paperDeep}}>
          <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 26, color: C.grey, letterSpacing: 1}}>PREPAID</div>
          <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 38, color: C.ink, marginTop: 8}}>{label}</div>
          <div style={{marginTop: 22, height: 14, width: "70%", borderRadius: 7, background: "rgba(36,34,31,0.12)"}}/>
          <div style={{marginTop: 12, height: 14, width: "45%", borderRadius: 7, background: "rgba(36,34,31,0.12)"}}/>
        </div>
        <div style={{position: "absolute", left: 40, right: 40, bottom: 120, height: 120, borderRadius: 60,
          background: paid > 0.5 ? C.teal : C.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 18,
          transform: `scale(${1 - 0.06 * Math.sin(Math.PI * clamp01(ripple * 2))})`}}>
          {paid > 0.5 ? <svg width={52} height={52} viewBox="0 0 52 52"><path d="M 10 27 L 22 39 L 43 14" fill="none" stroke={C.white} strokeWidth={8}
            strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01((paid - 0.5) * 2)}/></svg> : null}
          <span style={{fontFamily: F.sans, fontWeight: 800, fontSize: 46, color: C.white}}>{paid > 0.5 ? "Paid" : "Pay"}</span>
        </div>
        {ripple > 0 && ripple < 1 ? <div style={{position: "absolute", left: "50%", bottom: 180, width: 300 * ripple, height: 300 * ripple, borderRadius: "50%",
          transform: "translate(-50%, 50%)", border: `6px solid ${C.teal}`, opacity: 1 - ripple}}/> : null}
        <div style={{position: "absolute", inset: 0, background: `rgba(36,34,31,${dim})`}}/>
      </div>
      {finger > 0.01 ? <div style={{position: "absolute", left: W0 / 2 - 60 + (1 - finger) * 220, top: H0 - 200 + (1 - finger) * 260, width: 130, height: 200,
        borderRadius: "65px 65px 40px 40px", background: "linear-gradient(170deg, #C9936C, #A8714D)", opacity: clamp01(finger * 1.5),
        boxShadow: "0 18px 30px rgba(0,0,0,0.3)"}}/> : null}
    </div>
  );
};

// =====================================================================================================
// Payment marker: a small teal rupee token that travels a polyline (world px) between `at` and `at + dur` ticks.
// =====================================================================================================
const along = (pts: [number, number][], p: number): [number, number] => {
  const seg = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const tot = seg.reduce((a, b) => a + b, 0);
  let d = p * tot;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) { const t = seg[i] ? clamp01(d / seg[i]) : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]; }
    d -= seg[i];
  }
  return pts[pts.length - 1];
};
export const PaymentMarker: React.FC<{f: number; at: number; path: [number, number][]; dur?: number; size?: number; trail?: boolean; color?: string}> =
  ({f, at, path, dur = 40, size = 64, trail = true, color = C.teal}) => {
    if (f < at - 4) return null;
    const p = ease(f, at, at + dur, inOut);
    const [x, y] = along(path, p);
    const pop = spr(f, at - 4, 12, 200);
    const n = 24, tr = trail ? Array.from({length: n}, (_, i) => along(path, Math.max(0, p - (i + 1) * 0.012))) : [];
    return (
      <>
        {trail ? <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <polyline points={[[x, y], ...tr].map((q) => q.join(",")).join(" ")} fill="none" stroke={color} strokeWidth={size * 0.18} strokeLinecap="round" opacity={0.35}/>
        </svg> : null}
        <div style={{position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: color, transform: `translate(-50%, -50%) scale(${pop})`,
          boxShadow: `0 0 0 ${size * 0.12}px rgba(47,127,122,0.25), 0 8px 16px rgba(0,0,0,0.25)`, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: F.sans, fontWeight: 800, fontSize: size * 0.56, color: C.white, lineHeight: 1}}>₹</div>
      </>
    );
  };

// =====================================================================================================
// Network: towers and fibre lines growing across the frame (schematic; not a coverage map).
// grow 0..1 reveals nodes and links in order. Seeded, so every scene that uses `seed` draws the same network.
// =====================================================================================================
export type Net = {nodes: [number, number][]; links: [number, number][]};
export const makeNet = (seed = "net", n = 26, box: [number, number, number, number] = [140, 160, 1780, 920]): Net => {
  const [x0, y0, x1, y1] = box;
  const nodes: [number, number][] = [[960, 560]];
  for (let i = 1; i < n; i++) nodes.push([x0 + random(seed + "x" + i) * (x1 - x0), y0 + random(seed + "y" + i) * (y1 - y0)]);
  nodes.sort((a, b) => Math.hypot(a[0] - 960, a[1] - 560) - Math.hypot(b[0] - 960, b[1] - 560));
  const links: [number, number][] = [];
  for (let i = 1; i < n; i++) {
    let best = 0, bd = 1e9;
    for (let j = 0; j < i; j++) { const d = Math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1]); if (d < bd) { bd = d; best = j; } }
    links.push([best, i]);
  }
  return {nodes, links};
};
const TowerGlyph: React.FC<{x: number; y: number; s: number; color: string}> = ({x, y, s, color}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -14 26 L 0 -30 L 14 26 M -9 6 L 9 6 M -5 -12 L 5 -12" fill="none" stroke={color} strokeWidth={4} strokeLinejoin="round"/>
    <path d="M -16 -36 A 22 22 0 0 0 -16 -14 M 16 -36 A 22 22 0 0 1 16 -14" fill="none" stroke={color} strokeWidth={3} opacity={0.7}/>
  </g>
);
export const Network: React.FC<{f: number; net: Net; grow: number; color?: string; fibre?: string; towerScale?: number; pulseAt?: number}> =
  ({f, net, grow, color = C.ink, fibre = C.teal, towerScale = 1, pulseAt}) => {
    const n = net.nodes.length;
    return (
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        {net.links.map(([a, b], i) => {
          const p = clamp01(grow * n - i - 0.2);
          if (p <= 0) return null;
          const [ax, ay] = net.nodes[a], [bx, by] = net.nodes[b];
          return <line key={i} x1={ax} y1={ay} x2={ax + (bx - ax) * p} y2={ay + (by - ay) * p} stroke={fibre} strokeWidth={4} strokeLinecap="round" opacity={0.85}/>;
        })}
        {net.nodes.map(([x, y], i) => {
          const p = clamp01(grow * n - i + 0.6);
          if (p <= 0) return null;
          const pul = pulseAt != null && f > pulseAt ? 0.5 + 0.5 * Math.sin((f - pulseAt) * 0.25 - i * 0.6) : 0;
          return <g key={i} opacity={p}><circle cx={x} cy={y} r={20 + 10 * pul} fill={fibre} opacity={0.12}/><TowerGlyph x={x} y={y} s={(i === 0 ? 1.6 : 0.9) * towerScale * p} color={color}/></g>;
        })}
      </svg>
    );
  };

// =====================================================================================================
// Cash calendar: a paper wall calendar labelled "Cash payments". Purely conceptual: twelve unlabelled months,
// no years, no amounts (the brief forbids an invented repayment timetable). `marks` tick month boxes at times.
// =====================================================================================================
export const CashCalendar: React.FC<{f: number; at: number; x: number; y: number; w?: number; title?: string; marks?: {i: number; at: number; color?: string}[];
  rot?: number; sub?: string}> = ({f, at, x, y, w = 760, title = "Cash payments", marks = [], rot = 1.5, sub}) => {
  const e = spr(f, at, 13, 150);
  if (e <= 0.001) return null;
  const h = w * 0.82, cell = (w - 80) / 4;
  return (
    <div style={{position: "absolute", left: x, top: y, width: w, height: h, transform: `translate(-50%, -50%) translateY(${(1 - e) * -420}px) rotate(${rot}deg)`,
      opacity: clamp01(e * 2), background: C.white, boxShadow: "0 3px 4px rgba(30,20,10,0.16), 0 18px 34px rgba(30,20,10,0.22)"}}>
      <div style={{height: 110, background: C.ink, display: "flex", alignItems: "center", padding: "0 40px", justifyContent: "space-between"}}>
        <span style={{fontFamily: F.serif, fontWeight: 400, fontSize: 48, color: C.white}}>{title}</span>
        <span style={{display: "flex", gap: 22}}>{[0, 1].map((i) => <span key={i} style={{width: 22, height: 22, borderRadius: 11, background: C.paperDeep}}/>)}</span>
      </div>
      <div style={{position: "absolute", left: 40, top: 140, width: w - 80, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0}}>
        {Array.from({length: 12}, (_, i) => {
          const m = marks.find((q) => q.i === i), mp = m ? ease(f, m.at, m.at + 10, outQuint) : 0;
          return (
            <div key={i} style={{height: cell * 0.62, borderTop: `2px solid rgba(36,34,31,0.18)`, borderLeft: i % 4 ? `2px solid rgba(36,34,31,0.18)` : undefined, position: "relative"}}>
              <div style={{position: "absolute", left: 14, top: 10, width: 40, height: 10, borderRadius: 5, background: "rgba(36,34,31,0.18)"}}/>
              {m ? <div style={{position: "absolute", left: "50%", top: "58%", width: cell * 0.36, height: cell * 0.36, borderRadius: "50%", background: m.color ?? C.rust,
                transform: `translate(-50%, -50%) scale(${mp})`, opacity: 0.9}}/> : null}
            </div>
          );
        })}
      </div>
      {sub ? <div style={{position: "absolute", left: 40, bottom: 24, fontFamily: F.sans, fontWeight: 600, fontSize: 24, color: C.grey}}>{sub}</div> : null}
    </div>
  );
};

// =====================================================================================================
// 1,000-dot grid (scene 07): identical populations; `hi` dots (seeded positions) turn rust at hiAt and then fade out,
// leaving gaps (the disappearance is the visual event). Label above.
// =====================================================================================================
export const DotGrid: React.FC<{f: number; at: number; x: number; y: number; hi: number; hiAt: number; label?: string; cols?: number; cell?: number; seed?: string;
  goneAt?: number}> = ({f, at, x, y, hi, hiAt, label, cols = 40, cell = 17, seed = "dots", goneAt}) => {
  const e = ease(f, at, at + 14, outCubic);
  if (e <= 0) return null;
  const n = 1000, rows = n / cols;
  const order = React.useMemo(() => Array.from({length: n}, (_, i) => i).sort((a, b) => random(seed + a) - random(seed + b)).slice(0, hi), [seed, hi]);
  const set = React.useMemo(() => new Set(order), [order]);
  const gone = goneAt != null ? ease(f, goneAt, goneAt + 18) : 0;
  return (
    <div style={{position: "absolute", left: x - (cols * cell) / 2, top: y - (rows * cell) / 2, width: cols * cell, height: rows * cell, opacity: e}}>
      {label ? <div style={{position: "absolute", left: 0, right: 0, top: -76, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 42, color: C.ink}}>{label}</div> : null}
      <svg width={cols * cell} height={rows * cell}>
        {Array.from({length: n}, (_, i) => {
          const cx = (i % cols) * cell + cell / 2, cy = Math.floor(i / cols) * cell + cell / 2;
          const isHi = set.has(i), k = isHi ? order.indexOf(i) : 0;
          const lit = isHi ? ease(f, hiAt + k * 1.2, hiAt + k * 1.2 + 6) : 0;
          const op = isHi ? 1 - 0.9 * gone : 1;
          return <circle key={i} cx={cx} cy={cy} r={cell * 0.32} fill={lit > 0 ? C.rust : C.teal} opacity={(isHi ? op : 0.85) * (0.6 + 0.4 * (lit > 0 ? 1 : 0.6))}/>;
        })}
      </svg>
    </div>
  );
};

// =====================================================================================================
// Per-Rs-100 bridge on charcoal (scenes 04 and 12): bars step down from 100. Each step: {label, v (signed), at, total?}.
// Values are Moat & Margin's rounded calculation from the RHP (ledger rows); show the chip that says so.
// =====================================================================================================
export type Step = {label: string; v: number; at: number; total?: boolean; text?: string};
export const Bridge: React.FC<{f: number; steps: Step[]; x0?: number; x1?: number; base?: number; top?: number; max?: number; hold?: number[]}> =
  ({f, steps, x0 = 200, x1 = 1720, base = 860, top = 220, max = 100}) => {
    const n = steps.length, slot = (x1 - x0) / n, bw = slot * 0.62, k = (base - top) / max;
    // level after each step (a total resets the running level to its value)
    let run = 0;
    const bars = steps.map((s) => {
      const from = s.total ? 0 : run, to = s.total ? s.v : run + s.v;
      run = to;
      return {s, lo: Math.min(from, to), hi: Math.max(from, to), level: to};
    });
    return (
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <line x1={x0 - 20} x2={x1} y1={base} y2={base} stroke={C.grey} strokeWidth={3}/>
        {bars.map(({s, lo, hi}, i) => {
          const p = ease(f, s.at, s.at + 16, outQuint);
          if (p <= 0) return null;
          const cx = x0 + slot * (i + 0.5), yTop = base - hi * k, yBot = base - lo * k, h = (yBot - yTop) * p;
          const col = s.total ? C.white : s.v < 0 ? C.rust : C.highlightPrint;
          const y = s.v < 0 && !s.total ? yTop : yBot - h;   // falls grow downward from the previous level, rises/totals grow upward
          const ly = i > 0 ? base - bars[i - 1].level * k : 0;
          return (
            <g key={i}>
              {i > 0 ? <line x1={cx - slot + bw / 2} x2={cx - bw / 2} y1={ly} y2={ly} stroke={C.grey} strokeWidth={2} strokeDasharray="6 6" opacity={p}/> : null}
              <rect x={cx - bw / 2} y={y} width={bw} height={Math.max(0, h)} fill={col}/>
              <text x={cx} y={(s.v < 0 && !s.total ? yBot + 54 : yTop - 22)} textAnchor="middle" fontFamily={F.sans} fontWeight={800} fontSize={46} fill={C.white}
                opacity={clamp01((p - 0.5) * 2)}>{s.text ?? (s.v > 0 && !s.total ? "+" : "") + "₹" + Math.abs(s.v).toFixed(1).replace(/\.0$/, "")}</text>
              <text x={cx} y={base + (s.v < 0 && !s.total ? 110 : 56)} textAnchor="middle" fontFamily={F.sans} fontWeight={600} fontSize={26} fill={C.grey}
                opacity={clamp01((p - 0.5) * 2)}>{s.label}</text>
            </g>
          );
        })}
      </svg>
    );
  };

// =====================================================================================================
// Entity tag (reviewer, 20 Oct 2026): every number on screen carries WHO and WHAT SCOPE in the same style, placed directly
// beside the figure. Use the fixed texts in ENTITY so labels never drift between scenes.
// =====================================================================================================
export const ENTITY = {
  jioPlat: "JIO PLATFORMS · CONSOLIDATED",
  rjil: "RJIL · TELECOM COMPANY",
  airtelMob: "AIRTEL · INDIA MOBILE",
  airtel: "BHARTI AIRTEL",
  vi: "VODAFONE IDEA",
  trai: "TRAI · WIRELESS SUBSCRIBERS",
} as const;
export const EntityTag: React.FC<{f: number; at?: number; text: string; period?: string; x: number; y: number; dark?: boolean; anchor?: "left" | "center" | "right"; size?: number}> =
  ({f, at = -30, text, period, x, y, dark, anchor = "left", size = 24}) => {
    const p = ease(f, at, at + 8, outCubic);
    if (p <= 0) return null;
    const tx = anchor === "center" ? "-50%" : anchor === "right" ? "-100%" : "0";
    return (
      <div style={{position: "absolute", left: x, top: y, transform: `translate(${tx}, -50%) translateY(${(1 - p) * 10}px)`, opacity: p, display: "flex", gap: 0,
        fontFamily: F.sans, fontWeight: 800, fontSize: size, letterSpacing: 1.5, whiteSpace: "nowrap", boxShadow: "0 4px 10px rgba(0,0,0,0.12)"}}>
        <span style={{background: dark ? C.white : C.ink, color: dark ? C.ink : C.white, padding: `${size * 0.3}px ${size * 0.6}px`}}>{text}</span>
        {period ? <span style={{background: C.highlight, color: C.ink, padding: `${size * 0.3}px ${size * 0.6}px`}}>{period}</span> : null}
      </div>
    );
  };
