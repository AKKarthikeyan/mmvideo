// ECO-16 Part 3, builder G2: `upi-compare` (ref e16_upi). mode "upi" (b15a): a vast strip of tiny coins fills the frame, an average tag lifts one coin out of it, a source note says the data are provisional.
// mode "compare" (b15b; limit set): three strips, UPI (a vast strip of tiny coins), CHEQUES (a thin strip of slips) and RTGS (a few very large blocks). A SCHEMATIC, NOT TO SCALE: the limit line says so; the ratio and the
// RTGS words come from the spec labels. The only table read here is the ratio's presence (e16_upi `ratio`), which must match the printed badge.
import React from "react";
import {F3Defs, G2Defs, CoinStrip, FCard, Shade, Specks, Spot, Tag, E, Z, pop, pulse, fv, ft, elabs, rng, W, H, SANS, SERIF} from "./analogy_g2_kit";
import {Block} from "./analogy_f2_kit";
import {Coin} from "./analogy_e2_kit";
import type {AP} from "./analogy_kit";

/** the dusk backdrop shared by both modes: navy gradient, a lit skyline far away, a warm glow low in the frame */
const Dusk: React.FC<{f: number}> = ({f}) => {
  const r = rng(11);
  return (
    <g>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#g2-navy)"/>
      <Spot id="g2u-sp" cx={960} cy={520} rx={1200} ry={520} c="#ffd98a" a={0.26}/>
      {Array.from({length: 24}, (_, i) => {
        const x = i * 84 - 30, hh = 120 + r() * 200, ww = 54 + r() * 26;
        return (
          <g key={i} opacity={0.5}>
            <rect x={x} y={H - 160 - hh} width={ww} height={hh + 200} fill={i % 2 ? "#1a2650" : "#222f5e"}/>
            {Array.from({length: Math.floor(hh / 30)}, (_, k) => r() > 0.45 ? <rect key={k} x={x + 8 + (k % 2) * 22} y={H - 150 - hh + 8 + k * 30} width={10} height={14} fill="#ffe3a0" opacity={0.45 + 0.35 * Math.sin(f / 30 + i + k)}/> : null)}
          </g>
        );
      })}
      <rect x={-60} y={H - 170} width={W + 120} height={300} fill="#080d22" opacity={0.55}/>
      <Specks f={f} n={38} seed={5} c="#ffe3a0" y0={60} y1={820}/>
    </g>
  );
};

/** a light that rides along a strip */
const Ride: React.FC<{x: number; y: number; w: number; h: number; f: number; period: number; id: string}> = ({x, y, w, h, f, period, id}) => {
  const u = ((f / period) % 1) * (w + 500) - 250;
  return (
    <g>
      <defs><linearGradient id={`${id}-r`} x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0"/><stop offset="0.5" stopColor="#fff" stopOpacity="0.5"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient><clipPath id={`${id}-rc`}><rect x={x} y={y} width={w} height={h} rx={h * 0.12}/></clipPath></defs>
      <g clipPath={`url(#${id}-rc)`}><rect x={x + u} y={y} width={240} height={h} fill={`url(#${id}-r)`} transform={`skewX(-14)`}/></g>
    </g>
  );
};

// ---- mode "upi" -------------------------------------------------------------------------------------------------------------------
const SY = 330, SH = 260;
export const UpiArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p);
  const grow = E(f, 14, Math.max(60, L.up.at - 8)), edge = Z(f, L.up.at, 30);
  const avK = E(f, L.av.at, 34), avPulse = pulse(f, L.av.at + 20, 40);
  const hx = 1480, hy = SY - 20 - 110 * avK;
  return (
    <g>
      <F3Defs/><G2Defs/>
      <Dusk f={f}/>
      <CoinStrip id="g2us" x={-60} y={SY} w={W + 120} h={SH} r={9} f={f} grow={grow} speed={0.9} glow={0.5 + 0.5 * edge}/>
      <Ride x={-60} y={SY} w={(W + 120) * grow} h={SH} f={f} period={90} id="g2us"/>
      {/* tap ripples: each is a payment landing on the strip */}
      {grow > 0.3 && Array.from({length: 7}, (_, i) => {
        const per = 52 + i * 9, u = ((f + i * 37) % per) / per, cx = 160 + i * 270 + ((i * 97) % 60), cy = SY + 40 + ((i * 53) % 170);
        return <ellipse key={i} cx={cx} cy={cy} rx={20 + u * 110} ry={8 + u * 44} fill="none" stroke="#fff6d6" strokeWidth={3} opacity={0.65 * (1 - u)}/>;
      })}
      {/* brass rails above and below the strip */}
      {grow > 0.01 && [SY - 14, SY + SH + 6].map((y) => <rect key={y} x={-60} y={y} width={(W + 120) * grow} height={8} rx={4} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={1.6} opacity={0.9}/>)}
      {/* the average: one coin lifts out of the strip */}
      {avK > 0.01 && (
        <g>
          <ellipse cx={hx} cy={SY + 40} rx={110 * avK} ry={30 * avK} fill="#fff1b0" opacity={0.35 * (1 - avK * 0.6)} filter="url(#e3-glow)"/>
          <path d={`M${hx},${SY + 20} V${hy + 70}`} stroke="#ffe08a" strokeWidth={4} strokeDasharray="4 10" strokeLinecap="round" opacity={0.8 * avK}/>
          <g transform={`translate(${hx} ${hy}) scale(${1 + 0.04 * avPulse})`}>
            <circle r={96} fill="url(#ak-sunglow)" opacity={0.8}/>
            <Coin x={0} y={0} r={62} spin={0} rot={0}/>
          </g>
        </g>
      )}
    </g>
  );
};
export const UpiLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return (
    <>
      <FCard cx={960} y={640} text={L.up.text} f={p.f} at={L.up.at} size={48} maxW={1200} upper={false} tone="dark"/>
      <FCard cx={1480} y={52} text={L.av.text} f={p.f} at={L.av.at} size={34} maxW={620} upper={false}/>
      <FCard cx={960} y={792} text={L.sr.text} f={p.f} at={L.sr.at} size={28} maxW={1100} upper={false} tone="cool"/>
    </>
  );
};

// ---- mode "compare" ---------------------------------------------------------------------------------------------------------------
const Slips: React.FC<{x: number; y: number; w: number; h: number; f: number; grow: number}> = ({x, y, w, h, f, grow}) => {
  if (grow <= 0.002) return null;
  const pw = 44, off = (f * 0.3) % pw;
  return (
    <g>
      <defs>
        <pattern id="g2cq-p" x={x - off} y={y} width={pw} height={h} patternUnits="userSpaceOnUse">
          <rect x={3} y={4} width={pw - 8} height={h - 8} rx={2} fill="#fffaf0" stroke="#bda46c" strokeWidth={1.2}/>
          <path d={`M8,${h * 0.36} H${pw - 12} M8,${h * 0.62} H${pw - 22}`} stroke="#7a6a52" strokeWidth={1.6} opacity={0.6}/>
          <rect x={pw - 20} y={h * 0.2} width={9} height={9} fill="none" stroke="#a5302a" strokeWidth={1.2} opacity={0.7}/>
        </pattern>
        <clipPath id="g2cq-c"><rect x={x} y={y} width={Math.max(0.1, w * grow)} height={h} rx={4}/></clipPath>
      </defs>
      <rect x={x} y={y} width={Math.max(0.1, w * grow)} height={h} rx={4} fill="#5a6890" stroke="#a9b8e0" strokeWidth={1.6}/>
      <g clipPath="url(#g2cq-c)"><rect x={x} y={y} width={w} height={h} fill="url(#g2cq-p)"/></g>
    </g>
  );
};

export const CompareArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p);
  const ratio = fv("e16_upi", "ratio");
  if (!L.rt.text.includes(String(ratio))) throw new Error("upi-compare: the ratio label must carry the e16_upi ratio");
  const upK = E(f, 6, 36), chK = E(f, Math.max(24, L.rt.at - 46), 30), rgT = Math.max(L.rt.at + 30, L.rg.at - 56);
  const rows = {up: {y: 196, h: 130}, ch: {y: 444, h: 44}, rg: {y: 806}};
  const nameTag = (x: number, y: number, t: string, a: number) => <Tag x={x} y={y} text={t} a={a} size={26} fill="#fff7e4" ink="#5e2a0e" edge="#d9b45a"/>;
  return (
    <g>
      <F3Defs/><G2Defs/>
      <Dusk f={f}/>
      {/* UPI: a vast strip of tiny coins running off both edges */}
      <CoinStrip id="g2cu" x={-60} y={rows.up.y} w={W + 120} h={rows.up.h} r={7} f={f} grow={upK} speed={0.8} glow={0.6}/>
      <Ride x={-60} y={rows.up.y} w={(W + 120) * upK} h={rows.up.h} f={f} period={80} id="g2cu"/>
      {nameTag(172, rows.up.y - 30, "UPI", Z(f, 14, 16))}
      {/* the ratio bracket from the UPI strip down to the thin cheque strip */}
      {(() => {
        const u = Z(f, L.rt.at, 26);
        return u > 0.01 ? <path d={`M1000,${rows.up.y + rows.up.h + 10} V${rows.ch.y + 120}`} stroke="#ffe08a" strokeWidth={4} strokeDasharray="4 10" strokeLinecap="round" opacity={0.85 * u}/> : null;
      })()}
      {/* CHEQUES: a thin strip */}
      <g>
        <Slips x={120} y={rows.ch.y} w={760} h={rows.ch.h} f={f} grow={chK}/>
        {nameTag(212, rows.ch.y - 32, "CHEQUES", Z(f, Math.max(24, L.rt.at - 46), 16))}
      </g>
      {/* RTGS: a few very large blocks on a brass shelf */}
      <g opacity={Z(f, rgT, 24)}>
        <rect x={80} y={rows.rg.y} width={1200} height={16} rx={6} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
        <ellipse cx={680} cy={rows.rg.y + 26} rx={600} ry={14} fill="#02040e" opacity={0.5} filter="url(#ak-blur8)"/>
        <Block id="g2rg1" x={220} y={rows.rg.y} w={220} h={170} tone="gold" k={pop(f, rgT + 6, 24)} dx={30} dy={-22} ridges/>
        <Block id="g2rg2" x={520} y={rows.rg.y} w={170} h={120} tone="gold" k={pop(f, rgT + 20, 24)} dx={26} dy={-20} ridges/>
        <Block id="g2rg3" x={880} y={rows.rg.y} w={270} h={214} tone="gold" k={pop(f, rgT + 34, 24)} dx={34} dy={-24} ridges/>
        {nameTag(172, rows.rg.y - 262, "RTGS", Z(f, rgT, 16))}
      </g>
    </g>
  );
};
export const CompareLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return (
    <>
      <FCard cx={1330} y={404} text={L.rt.text} f={p.f} at={L.rt.at} size={34} maxW={940} upper={false} tone="dark"/>
      <FCard cx={1480} y={640} text={L.rg.text} f={p.f} at={L.rg.at} size={32} maxW={640} upper={false}/>
    </>
  );
};
export {Shade, ft, H, SANS, SERIF};
