// Look B analogy art for Part 2: `rulers` (forecast and season "normal" bands, optional 2025 marker, optional third regional ruler).
// All positions from fig(): u7_norm fc_lo/fc_hi, s_lo/s_hi, y2025, r_lo/r_hi.
import React from "react";
import {SANS, SERIF, W, H, eo, eio} from "../kit";
import {fig} from "../../cartoon/long/figs";
import {prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";

const N = (s: string) => fig({t: "u7_norm", state: "India", s}).value;
const XC = 960, XR = 720, RH = 78;

const Ruler: React.FC<{y: number; unit: number; lo: number; hi: number; center: number; a: number; band: number; id: string; f: number; caption: string}> =
  ({y, unit, lo, hi, center, a, band, id, f, caption}) => {
  const xOf = (v: number) => XC + (v - center) * unit, span = Math.round(XR / unit);
  const x0 = xOf(lo), x1 = xOf(hi), cx = (x0 + x1) / 2, bw = (x1 - x0) * eio(band);
  return (
    <g opacity={a} transform={`translate(${(1 - a) * -40} 0)`}>
      <defs>
        <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6dc94"/><stop offset="0.6" stopColor="#e2b862"/><stop offset="1" stopColor="#c5933f"/></linearGradient>
        <linearGradient id={`${id}-band`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6fd08a" stopOpacity="0.55"/><stop offset="1" stopColor="#2f9a4a" stopOpacity="0.5"/></linearGradient>
      </defs>
      <rect x={XC - XR - 20 + 8} y={y + 12} width={2 * XR + 40} height={RH} rx={8} fill="#2a1808" opacity={0.28} filter="url(#ak-blur8)"/>
      <rect x={XC - XR - 20} y={y} width={2 * XR + 40} height={RH} rx={8} fill={`url(#${id}-wood)`} stroke="#8e6a2c" strokeWidth={2.4}/>
      <rect x={XC - XR - 14} y={y + 4} width={2 * XR + 28} height={7} rx={3} fill="#fff6cf" opacity={0.6}/>
      {Array.from({length: 2 * span + 1}, (_, i) => i - span).map((i) => {
        const x = XC + i * unit, maj = i % 5 === 0, mid = i === 0;
        return <path key={i} d={`M${x},${y} v${mid ? 58 : maj ? 36 : 20}`} stroke={mid ? "#7a2a1d" : "#5a4020"} strokeWidth={mid ? 4 : maj ? 2.6 : 1.5} strokeLinecap="round"/>;
      })}
      <text x={XC} y={y - 10} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={19} letterSpacing="4" fill="#7a2a1d" opacity={0.85}>{caption}</text>
      {/* green normal band, wiping out from its middle */}
      {bw > 1 && <g>
        <rect x={cx - bw / 2} y={y - 30} width={bw} height={RH + 60} rx={10} fill={`url(#${id}-band)`}/>
        <rect x={cx - bw / 2} y={y - 30} width={bw} height={RH + 60} rx={10} fill="none" stroke="#228a40" strokeWidth={3.5}/>
        {[-1, 1].map((sd) => <g key={sd} opacity={band > 0.8 ? 1 : 0}><path d={`M${cx + (sd * bw) / 2},${y - 30} v-24`} stroke="#228a40" strokeWidth={4} strokeLinecap="round"/><polygon points={`${cx + (sd * bw) / 2},${y - 54} ${cx + (sd * bw) / 2 + sd * 22},${y - 46} ${cx + (sd * bw) / 2},${y - 38}`} fill="#2f9a4a"/></g>)}
        <rect x={cx - bw / 2 + 6} y={y - 24} width={Math.max(0, bw - 12)} height={6} rx={3} fill="#fff" opacity={0.35 + 0.1 * Math.sin(f / 12)}/>
      </g>}
    </g>
  );
};

export const RulersArt: React.FC<AP> = (p) => {
  const {f, spec} = p, L = rlabs(p), s = spec as any, third = !!s.third, marker = !!s.marker;
  const n = third ? 3 : 2, y0 = third ? 150 : 250, pitch = third ? 250 : 300, rowY = (i: number) => y0 + i * pitch;
  const unit = 36, unitD = 28.8;
  const bandAt = (i: number) => eo(prog(f, (L[i]?.at ?? 20) - 2, 28));
  const mkAt = L[2]?.at ?? 80, mx = XC + (N("y2025") - 100) * unit, mp = prog(f, mkAt - 4, 22);
  const bounce = mp < 1 ? -(1 - eo(mp)) * 160 : Math.sin((f - mkAt) / 3) * Math.exp(-(f - mkAt) / 8) * 6;
  return (
    <g>
      <defs>
        <linearGradient id="rl-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f2e8d0"/><stop offset="1" stopColor="#e0d0aa"/></linearGradient>
        <radialGradient id="rl-lamp" cx="0.5" cy="0.4" r="0.7"><stop offset="0" stopColor="#fff6d8" stopOpacity="0.8"/><stop offset="1" stopColor="#fff6d8" stopOpacity="0"/></radialGradient>
        <pattern id="rl-grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48,0 H0 V48" fill="none" stroke="#b8a678" strokeWidth="1" opacity="0.35"/></pattern>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#rl-bg)"/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#rl-grid)"/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#rl-lamp)"/>
      {Array.from({length: n}, (_, i) => {
        const dep = third && i === 2, lo = dep ? N("r_lo") : i === 0 ? N("fc_lo") : N("s_lo"), hi = dep ? N("r_hi") : i === 0 ? N("fc_hi") : N("s_hi");
        return <Ruler key={i} id={`rl${i}`} y={rowY(i)} unit={dep ? unitD : unit} lo={lo} hi={hi} center={dep ? 0 : 100} a={eo(prog(f, Math.max(0, Math.min(4 + i * 8, (L[i]?.at ?? 99) - 8)), 12))} band={bandAt(i)} f={f} caption="AVERAGE"/>;
      })}
      {marker && (
        <g opacity={eo(prog(f, mkAt - 4, 10))} transform={`translate(0 ${bounce})`}>
          <path d={`M${mx},${rowY(0) - 80} V${rowY(1) + RH + 30}`} stroke="#c63f2f" strokeWidth={4} strokeDasharray="2 0" style={{filter: "drop-shadow(0 4px 4px rgba(60,20,10,.4))"}}/>
          <circle cx={mx} cy={rowY(0) - 90} r={17} fill="#d8482a" stroke="#8a2c1d" strokeWidth={3}/>
          <circle cx={mx - 5} cy={rowY(0) - 96} r={5} fill="#fff" opacity={0.6}/>
          {[0, 1].map((i) => <circle key={i} cx={mx} cy={rowY(i) + RH / 2 - 8} r={9} fill="#fff" stroke="#c63f2f" strokeWidth={4}/>)}
        </g>
      )}
    </g>
  );
};
export const RulersLabels: React.FC<AP> = (p) => {
  const {f, spec} = p, L = rlabs(p), s = spec as any, third = !!s.third, marker = !!s.marker;
  const n = third ? 3 : 2, y0 = third ? 150 : 250, pitch = third ? 250 : 300, rowY = (i: number) => y0 + i * pitch;
  const cxOf = (i: number) => (i === 0 ? 960 : i === 1 ? (marker ? 840 : 960) : 800);
  return <>
    {Array.from({length: n}, (_, i) => L[i] && <P2Card key={i} cx={cxOf(i)} y={rowY(i) + RH + 44} text={L[i].text} f={f} at={L[i].at} size={third ? 32 : 36} upper={false} tone={i === 2 && third ? "cool" : "green"} maxW={900}/>)}
    {marker && L[2] && <P2Card cx={1250} y={92} text={L[2].text} f={f} at={L[2].at} size={36} upper={false} maxW={520}/>}
    {third && L[3] && <P2Card cx={1520} y={rowY(2) + RH + 44} text={L[3].text} f={f} at={L[3].at} size={32} tone="dark" maxW={420}/>}
  </>;
};
void SERIF; void H;
