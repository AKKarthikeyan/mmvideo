// Shared pieces for Shorts 2 and 3 (vertical 1080x1920, original VoxPlus look). Content lives between y = 200 and y = 1400.
import React from "react";
import {random} from "remotion";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr} from "../kit/tokens";

/** The moat card that opens every Short: kind n of 5, the question in big serif, five dots (this one filled). */
export const MoatCard: React.FC<{f: number; n: number; l1: string; l2: string; q: string}> = ({f, n, l1, l2, q}) => {
  const p = ease(f, -20, -8, outCubic), k = ease(f, 6, 22, outQuint);
  return (
    <>
      <div style={{position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", opacity: p}}>
        <span style={{fontFamily: F.sans, fontWeight: 800, fontSize: 44, letterSpacing: 4, background: C.highlight, color: C.ink, padding: "10px 26px"}}>KIND {n} OF 5</span>
      </div>
      {[l1, l2].map((t, i) => (
        <div key={i} style={{position: "absolute", left: 0, right: 0, top: 440 + i * 215, textAlign: "center", fontFamily: F.serif, fontSize: 210, lineHeight: 1, color: i ? C.teal : C.ink,
          opacity: clamp01(p * 2), transform: `translateY(${i * (1 - k) * 40}px)`}}>{t}</div>
      ))}
      <div style={{position: "absolute", left: 90, right: 90, top: 960, textAlign: "center", fontFamily: F.serif, fontSize: 74, lineHeight: 1.12, color: C.ink, opacity: k}}>{q}</div>
      <div style={{position: "absolute", left: 0, right: 0, top: 1250, display: "flex", justifyContent: "center", gap: 36, opacity: k}}>
        {[1, 2, 3, 4, 5].map((i) => <span key={i} style={{width: 44, height: 44, borderRadius: 22, background: i === n ? C.teal : "transparent", border: `5px solid ${i === n ? C.teal : C.grey}`}}/>)}
      </div>
    </>
  );
};

export type VBar = {cx: number; w: number; v: number; at: number; big: string; small?: string; color?: string; foot: string; sub?: string};
/** Vertical bars from one zero line. Big serif value above each bar (with a small unit line), year label below. */
export const VBars: React.FC<{f: number; bars: VBar[]; max: number; base: number; maxH: number; bigSize?: number}> = ({f, bars, max, base, maxH, bigSize = 130}) => (
  <>
    <div style={{position: "absolute", left: 60, width: 960, top: base - 2, height: 5, background: C.ink}}/>
    {bars.map((b, i) => {
      const p = ease(f, b.at, b.at + 20, outQuint), h = (b.v / max) * maxH * p, lab = clamp01((p - 0.4) * 2);
      return (
        <React.Fragment key={i}>
          <div style={{position: "absolute", left: b.cx - b.w / 2, top: base - h, width: b.w, height: h, background: b.color ?? C.teal}}/>
          <div style={{position: "absolute", left: b.cx - 250, width: 500, top: base - h - 16, transform: "translateY(-100%)", textAlign: "center", opacity: lab, lineHeight: 1}}>
            <div style={{fontFamily: F.serif, fontSize: bigSize, color: C.ink}}>{b.big}</div>
            {b.small ? <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 42, color: C.ink, marginTop: 6}}>{b.small}</div> : null}
          </div>
          <div style={{position: "absolute", left: b.cx - 250, width: 500, top: base + 22, textAlign: "center", opacity: ease(f, b.at - 6, b.at + 6)}}>
            <div style={{fontFamily: F.serif, fontSize: 62, color: C.ink}}>{b.foot}</div>
            {b.sub ? <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 34, color: C.grey, marginTop: 2}}>{b.sub}</div> : null}
          </div>
        </React.Fragment>
      );
    })}
  </>
);

/** FY24 | FY25 | FY26 axis, 960 wide, quarter ticks, and the Q2 FY25 tariff marker. */
export const VTime: React.FC<{f: number; y: number; markAt: number}> = ({f, y, markAt}) => {
  const X0 = 60, CW = 320, m = spr(f, markAt, 12, 170), mx = X0 + CW + 0.375 * CW;
  return (
    <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
      {["FY24", "FY25", "FY26"].map((l, i) => (
        <g key={l}>
          <rect x={X0 + i * CW} y={y - 90} width={CW - 6} height={84} fill={i === 1 ? C.highlight : "rgba(14,14,14,0.08)"}/>
          <text x={X0 + i * CW + CW / 2} y={y - 30} textAnchor="middle" fontFamily={F.serif} fontSize={58} fill={C.ink}>{l}</text>
          {[0, 1, 2, 3].map((q) => <g key={q}><line x1={X0 + i * CW + (q * CW) / 4} x2={X0 + i * CW + (q * CW) / 4} y1={y} y2={y + 18} stroke={C.grey} strokeWidth={3}/>
            <text x={X0 + i * CW + ((q + 0.5) * CW) / 4} y={y + 54} textAnchor="middle" fontFamily={F.sans} fontWeight={600} fontSize={32} fill={C.grey}>Q{q + 1}</text></g>)}
        </g>
      ))}
      <line x1={X0} x2={X0 + CW * 3 - 6} y1={y} y2={y} stroke={C.ink} strokeWidth={4}/>
      {m > 0 ? <g opacity={clamp01(m * 2)}>
        <line x1={mx} x2={mx} y1={y - 8} y2={y + 250} stroke={C.rust} strokeWidth={8} strokeDasharray="16 10"/>
        <circle cx={mx} cy={y} r={20 * m} fill={C.rust}/>
      </g> : null}
    </svg>
  );
};
export const markX = 60 + 320 + 0.375 * 320;

/** Departing dots fly from a grid into a magnified box (positions replicate DotGrid's seeded choice). */
export const Fly: React.FC<{f: number; gx: number; gy: number; cell: number; cols: number; hi: number; flyAt: number; slot: (k: number) => [number, number]; R: number; seed?: string}> =
  ({f, gx, gy, cell, cols, hi, flyAt, slot, R, seed = "dots"}) => {
    const rows = 1000 / cols;
    const order = React.useMemo(() => Array.from({length: 1000}, (_, i) => i).sort((a, b) => random(seed + a) - random(seed + b)).slice(0, hi), [seed, hi]);
    return (
      <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
        {order.map((idx, k) => {
          const [sx, sy] = slot(k);
          const x0 = gx - (cols * cell) / 2 + (idx % cols) * cell + cell / 2, y0 = gy - (rows * cell) / 2 + Math.floor(idx / cols) * cell + cell / 2;
          const t = ease(f, flyAt + k * 1.4, flyAt + k * 1.4 + 22, inOut);
          return <g key={k}>
            <circle cx={sx} cy={sy} r={R} fill="none" stroke={C.grey} strokeWidth={3} strokeDasharray="5 6" opacity={ease(f, flyAt - 10, flyAt) * (1 - t)}/>
            {f >= flyAt + k * 1.4 - 1 ? <circle cx={x0 + (sx - x0) * t} cy={y0 + (sy - y0) * t - Math.sin(Math.PI * t) * 50} r={cell * 0.32 + (R - cell * 0.32) * t} fill={C.rust}/> : null}
          </g>;
        })}
      </svg>
    );
  };
