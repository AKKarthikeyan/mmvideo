// Look B analogy art for Part 2: `jars` (Tamil Nadu's two rainy seasons) and `bucket-band` (the rooftop bucket on a cm scale with a green band).
// Figures only from fig(): u7_tn (swm, nem) and u7_lpa (new, mm -> cm) with u7_norm (s_lo, s_hi) for the band.
import React from "react";
import {SANS, SERIF, W, H, eio, eo, rng} from "../kit";
import {fig} from "../../cartoon/long/figs";
import {Cloud, Hills, prog, type AP} from "./analogy_kit";
import {DaySky, P2Card, Table, rlabs} from "./analogy_p2b_kit";

// ---- jars -------------------------------------------------------------------------------------------------------------------
const JW = 330, JTOP = 300, JBASE = 800, JIN = 448; // jar width, top, base, inner water height

const Jar: React.FC<{id: string; cx: number; level: number; f: number; raining: boolean; value: string; t0: number; warm?: boolean}> = ({id, cx, level, f, raining, value, t0}) => {
  const hw = JW / 2, wy = JBASE - 26 - level * JIN, r = rng(cx);
  const drops = Array.from({length: 7}, (_, i) => ({x: (r() - 0.5) * (JW - 120), ph: r()}));
  const shown = eo(prog(f, t0 + 30, 20));
  return (
    <g>
      <ellipse cx={cx + 20} cy={JBASE + 6} rx={hw + 40} ry={20} fill="#2a1808" opacity={0.32}/>
      <defs>
        <clipPath id={`${id}-clip`}><path d={`M${cx - hw + 14},${JTOP + 40} L${cx - hw + 14},${JBASE - 40} Q${cx - hw + 14},${JBASE - 12} ${cx - hw + 50},${JBASE - 12} L${cx + hw - 50},${JBASE - 12} Q${cx + hw - 14},${JBASE - 12} ${cx + hw - 14},${JBASE - 40} L${cx + hw - 14},${JTOP + 40} Z`}/></clipPath>
        <linearGradient id={`${id}-w`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6cc4ee"/><stop offset="1" stopColor="#1f6ea8"/></linearGradient>
        <linearGradient id={`${id}-g`} x1="0" x2="1"><stop offset="0" stopColor="#ffffff" stopOpacity="0.55"/><stop offset="0.3" stopColor="#dff0f6" stopOpacity="0.16"/><stop offset="0.8" stopColor="#bcd6e2" stopOpacity="0.14"/><stop offset="1" stopColor="#ffffff" stopOpacity="0.5"/></linearGradient>
      </defs>
      {/* glass back */}
      <path d={`M${cx - hw},${JTOP + 34} L${cx - hw},${JBASE - 34} Q${cx - hw},${JBASE} ${cx - hw + 40},${JBASE} L${cx + hw - 40},${JBASE} Q${cx + hw},${JBASE} ${cx + hw},${JBASE - 34} L${cx + hw},${JTOP + 34} Z`} fill="#e6f1f5" opacity={0.42}/>
      <g clipPath={`url(#${id}-clip)`}>
        <rect x={cx - hw} y={wy} width={JW} height={JBASE - wy} fill={`url(#${id}-w)`}/>
        {level > 0.01 && <>
          <path d={`M${cx - hw},${wy} ${Array.from({length: 9}, (_, i) => `L${cx - hw + (i + 1) * (JW / 8)},${wy + Math.sin(f / 9 + i * 1.3) * 3}`).join(" ")} L${cx + hw},${wy - 8} L${cx - hw},${wy - 8} Z`} fill="#bfe7fa" opacity={0.75}/>
          {[0, 1, 2, 3, 4, 5].map((i) => { const u = (f * 0.011 + i * 0.17 + cx * 0.001) % 1; return <circle key={i} cx={cx - hw + 50 + ((i * 53) % (JW - 100)) + Math.sin(u * 7 + i) * 8} cy={JBASE - 20 - u * (JBASE - wy - 30)} r={3 + (i % 3) * 2} fill="#e9f8ff" opacity={0.5 * (1 - u)}/>; })}
        </>}
      </g>
      {/* ticks, no numerals */}
      {Array.from({length: 12}, (_, i) => <path key={i} d={`M${cx + hw - 14},${JBASE - 26 - (i + 1) * (JIN / 12)} h${i % 3 === 2 ? -34 : -20}`} stroke="#4d6d86" strokeWidth={i % 3 === 2 ? 3 : 2} opacity={0.65} strokeLinecap="round"/>)}
      {/* glass front */}
      <path d={`M${cx - hw},${JTOP + 34} L${cx - hw},${JBASE - 34} Q${cx - hw},${JBASE} ${cx - hw + 40},${JBASE} L${cx + hw - 40},${JBASE} Q${cx + hw},${JBASE} ${cx + hw},${JBASE - 34} L${cx + hw},${JTOP + 34}`} fill="none" stroke="#7da3ba" strokeWidth={5} strokeLinecap="round"/>
      <path d={`M${cx - hw},${JTOP + 34} L${cx - hw},${JBASE - 34} Q${cx - hw},${JBASE} ${cx - hw + 40},${JBASE} L${cx + hw - 40},${JBASE} Q${cx + hw},${JBASE} ${cx + hw},${JBASE - 34} L${cx + hw},${JTOP + 34} Z`} fill={`url(#${id}-g)`}/>
      <rect x={cx - hw + 22} y={JTOP + 60} width={16} height={JBASE - JTOP - 120} rx={8} fill="#fff" opacity={0.55}/>
      {/* shoulders and rim */}
      <path d={`M${cx - hw},${JTOP + 34} Q${cx - hw},${JTOP + 4} ${cx - hw + 40},${JTOP} L${cx + hw - 40},${JTOP} Q${cx + hw},${JTOP + 4} ${cx + hw},${JTOP + 34}`} fill="none" stroke="#7da3ba" strokeWidth={5} strokeLinecap="round"/>
      <ellipse cx={cx} cy={JTOP} rx={hw - 30} ry={11} fill="#cfe6ef" stroke="#7da3ba" strokeWidth={4} opacity={0.9}/>
      <ellipse cx={cx} cy={JTOP + 2} rx={hw - 40} ry={7} fill="#2c5a76" opacity={0.28}/>
      {/* rain falling into the jar */}
      {raining && drops.map((d, i) => { const u = (f * 0.025 + d.ph) % 1; return <path key={i} d={`M${cx + d.x},${JTOP - 4 + u * Math.max(20, wy - JTOP - 24)} l-3,18`} stroke="#4aa3dd" strokeWidth={4} strokeLinecap="round" opacity={0.85 * Math.min(1, u * 6)}/>; })}
      {/* paper tag with the figure */}
      <g opacity={shown} transform={`translate(${cx} ${JBASE - 150 - (1 - shown) * 10})`}>
        <rect x={-126} y={-58} width={252} height={116} rx={16} fill="#fff7e4" stroke="#b58a52" strokeWidth={2} style={{filter: "drop-shadow(0 8px 8px rgba(40,22,8,.35))"}}/>
        <text x={-26} y={14} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={62} fill="#5e2a0e">{value}</text>
        <text x={88} y={14} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} fill="#8a5a30">mm</text>
        <text x={0} y={42} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={14} letterSpacing="3" fill="#8a5a30">OF RAIN</text>
      </g>
    </g>
  );
};

/** Cloud offsets its x by seed; cancel that so the cloud sits where asked */
const cdx = (seed: number) => ((seed * 400) % 2300) - 200;

export const JarsArt: React.FC<AP> = (p) => {
  const {f} = p, L = rlabs(p), a = fig({t: "u7_tn", state: "Tamil Nadu", s: "swm"}), b = fig({t: "u7_tn", state: "Tamil Nadu", s: "nem"});
  const cap = b.value * 1.16, tL = L[0]?.at ?? 10, tR = L[2]?.at ?? 100, dL = Math.max(40, Math.min(100, p.dur - tL - 16)), dR = Math.max(40, Math.min(100, p.dur - tR - 16)), pl = prog(f, tL, dL), pr = prog(f, tR, dR);
  const cL = 520, cR = 1400;
  return (
    <g>
      <DaySky id="jr" f={f} sun={[1790, 200]}/>
      <Cloud x={cL - cdx(8)} y={268} s={0.5} f={0} speed={0} seed={8} a={0.97 * eo(prog(f, tL - 6, 14))}/>
      <Cloud x={cR - cdx(9)} y={268} s={0.5} f={0} speed={0} seed={9} a={0.97 * eo(prog(f, tR - 6, 14))}/>
      <Table id="jr" y0={800}/>
      <Jar id="jrL" cx={cL} level={(a.value / cap) * eio(pl)} f={f} raining={pl > 0 && pl < 1} value={pl >= 1 ? a.text : (a.value * eio(pl)).toFixed(1)} t0={tL}/>
      <Jar id="jrR" cx={cR} level={(b.value / cap) * eio(pr)} f={f} raining={pr > 0 && pr < 1} value={pr >= 1 ? b.text : (b.value * eio(pr)).toFixed(1)} t0={tR}/>
    </g>
  );
};
export const JarsLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  return <>
    {L[0] && <P2Card cx={520} y={96} text={L[0].text} f={p.f} at={L[0].at} size={38}/>}
    {L[2] && <P2Card cx={1400} y={96} text={L[2].text} f={p.f} at={L[2].at} size={38} tone="cool"/>}
    {L[1] && <P2Card cx={960} y={420} text={L[1].text} f={p.f} at={L[1].at} size={34} maxW={430} tone="green"/>}
  </>;
};

// ---- bucket-band -------------------------------------------------------------------------------------------------------------
const BX = 520, BASE = 820, TOPY = 236, BKT_W0 = 250, BKT_W1 = 300;

const Roof: React.FC<{f: number}> = ({f}) => {
  const r = rng(5), blocks = Array.from({length: 22}, (_, i) => ({x: i * 94 - 20, h: 90 + r() * 150, w: 70 + r() * 30, c: r()}));
  return (
    <g>
      <DaySky id="bk" f={f} sun={[1640, 150]}/>
      {/* far city, hazy */}
      {blocks.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={700 - b.h} width={b.w} height={b.h + 120} fill={b.c > 0.5 ? "#c4cfdb" : "#cbc6cf"} opacity={0.85}/>
          {Array.from({length: Math.floor(b.h / 38)}, (_, k) => <rect key={k} x={b.x + 10} y={700 - b.h + 14 + k * 38} width={b.w - 20} height={9} fill="#e8eef4" opacity={0.7}/>)}
        </g>
      ))}
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${1250 + i * 210} 650)`}><rect x={-34} y={-70} width={68} height={70} fill="#9fb0bd" opacity={0.7}/><rect x={-40} y={-82} width={80} height={14} fill="#8394a2" opacity={0.7}/></g>)}
      {/* parapet and roof floor */}
      <defs>
        <linearGradient id="bk-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9c5a4"/><stop offset="1" stopColor="#a08462"/></linearGradient>
        <linearGradient id="bk-par" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e4d2b0"/><stop offset="1" stopColor="#b79a74"/></linearGradient>
      </defs>
      <rect x={-40} y={BASE - 6} width={W + 80} height={H - BASE + 80} fill="url(#bk-floor)"/>
      <rect x={-40} y={BASE - 6} width={W + 80} height={8} fill="#f1e2c4"/>
      {Array.from({length: 14}, (_, i) => <path key={i} d={`M${-40 + i * 160},${BASE + 2} l-60,260`} stroke="#8e7452" strokeWidth={1.4} opacity={0.4}/>)}
      <rect x={-40} y={BASE - 48} width={W + 80} height={44} fill="url(#bk-par)"/>
      <rect x={-40} y={BASE - 56} width={W + 80} height={12} fill="#f0e0c0"/>
      {Array.from({length: 24}, (_, i) => <path key={i} d={`M${i * 84},${BASE - 44} v38`} stroke="#8e7452" strokeWidth={1.2} opacity={0.35}/>)}
    </g>
  );
};

export const BucketBandArt: React.FC<AP> = (p) => {
  const {f, spec} = p, L = rlabs(p), wobble = !!(spec as any).wobble;
  const avg = fig({t: "u7_lpa", state: "India", s: "new"}).value / 10; // mm -> cm
  const sLo = fig({t: "u7_norm", state: "India", s: "s_lo"}).value / 100, sHi = fig({t: "u7_norm", state: "India", s: "s_hi"}).value / 100;
  const maxCm = avg * 1.4, ppc = (BASE - TOPY) / maxCm, yOf = (cm: number) => BASE - cm * ppc;
  const fill = eio(prog(f, 4, 46)), tBand = L[0]?.at ?? 60;
  const amp = wobble ? (sHi - 1) * avg * 0.78 * eo(prog(f, 36, 30)) : 0;
  const wob = Math.sin(f / 15) * 0.6 + Math.sin(f / 6.1 + 1) * 0.4;
  const level = avg * fill + amp * wob;
  const ly = yOf(level), bandA = eo(prog(f, tBand, 26)), yHi = yOf(avg * sHi), yLo = yOf(avg * sLo);
  const wAt = (y: number) => BKT_W0 + ((BASE - y) / (BASE - TOPY)) * (BKT_W1 - BKT_W0); // bucket width at height y
  const SX = 800; // ruler centre
  return (
    <g>
      <Roof f={f}/>
      <defs>
        <clipPath id="bk-in"><path d={`M${BX - BKT_W0 / 2 + 10},${BASE - 8} L${BX + BKT_W0 / 2 - 10},${BASE - 8} L${BX + BKT_W1 / 2 - 10},${TOPY + 6} L${BX - BKT_W1 / 2 + 10},${TOPY + 6} Z`}/></clipPath>
        <linearGradient id="bk-wat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#78c4ee"/><stop offset="1" stopColor="#2677b0"/></linearGradient>
        <linearGradient id="bk-body" x1="0" x2="1"><stop offset="0" stopColor="#f08a5a" stopOpacity="0.55"/><stop offset="0.5" stopColor="#f0c9a6" stopOpacity="0.2"/><stop offset="1" stopColor="#d4502f" stopOpacity="0.55"/></linearGradient>
        <linearGradient id="bk-rule" x1="0" x2="1"><stop offset="0" stopColor="#fffaf0"/><stop offset="1" stopColor="#e6d8b8"/></linearGradient>
      </defs>
      {/* green band across bucket and ruler */}
      <g opacity={bandA}>
        <rect x={BX - 330} y={yHi} width={(SX + 110 - (BX - 330)) * bandA} height={yLo - yHi} rx={8} fill="#43b565" opacity={0.3}/>
        <rect x={BX - 330} y={yHi} width={(SX + 110 - (BX - 330)) * bandA} height={yLo - yHi} rx={8} fill="none" stroke="#2f9a4a" strokeWidth={3} strokeDasharray="14 8"/>
      </g>
      <ellipse cx={BX + 24} cy={BASE + 2} rx={190} ry={16} fill="#2a1808" opacity={0.3}/>
      {/* bucket */}
      <path d={`M${BX - BKT_W0 / 2},${BASE} L${BX + BKT_W0 / 2},${BASE} L${BX + BKT_W1 / 2},${TOPY} L${BX - BKT_W1 / 2},${TOPY} Z`} fill="#e9f1f4" opacity={0.5}/>
      <g clipPath="url(#bk-in)">
        <rect x={BX - 200} y={ly} width={400} height={BASE - ly} fill="url(#bk-wat)"/>
        <path d={`M${BX - 200},${ly} ${Array.from({length: 9}, (_, i) => `L${BX - 200 + (i + 1) * 50},${ly + Math.sin(f / 6 + i * 1.4) * (wobble ? 3.5 : 1.6)}`).join(" ")} L${BX + 200},${ly - 7} L${BX - 200},${ly - 7} Z`} fill="#c6ecfb" opacity={0.8}/>
        {[0, 1, 2, 3].map((i) => { const u = (f * 0.012 + i * 0.25) % 1; return <circle key={i} cx={BX - 70 + i * 50 + Math.sin(u * 7 + i) * 6} cy={BASE - 24 - u * Math.max(10, BASE - ly - 40)} r={3 + (i % 2) * 2} fill="#e9f8ff" opacity={0.5 * (1 - u)}/>; })}
      </g>
      <path d={`M${BX - BKT_W0 / 2},${BASE} L${BX + BKT_W0 / 2},${BASE} L${BX + BKT_W1 / 2},${TOPY} L${BX - BKT_W1 / 2},${TOPY} Z`} fill="url(#bk-body)" stroke="#c4502f" strokeWidth={6} strokeLinejoin="round"/>
      <rect x={BX - BKT_W0 / 2 - 4} y={BASE - 40} width={BKT_W0 + 8} height={40} rx={8} fill="#c4502f"/>
      <rect x={BX - BKT_W0 / 2} y={BASE - 40} width={BKT_W0} height={7} fill="#f08a5a" opacity={0.7}/>
      <rect x={BX - BKT_W1 / 2 - 10} y={TOPY - 14} width={BKT_W1 + 20} height={22} rx={11} fill="#f1d9c6" stroke="#c4502f" strokeWidth={3}/>
      <path d={`M${BX - BKT_W1 / 2 + 8},${TOPY - 4} Q${BX},${TOPY - 130} ${BX + BKT_W1 / 2 - 8},${TOPY - 4}`} stroke="#9aa0a4" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8}/>
      <rect x={BX - BKT_W0 / 2 + 22} y={TOPY + 40} width={14} height={BASE - TOPY - 110} rx={7} fill="#fff" opacity={0.5}/>
      {/* ruler */}
      <g style={{filter: "drop-shadow(8px 10px 8px rgba(40,22,8,.32))"}}>
        <rect x={SX - 66} y={TOPY - 30} width={132} height={BASE - TOPY + 30} rx={10} fill="url(#bk-rule)" stroke="#9a8460" strokeWidth={2.5}/>
      </g>
      {Array.from({length: Math.floor(maxCm) + 1}, (_, i) => i).map((cm) => {
        const y = yOf(cm), ten = cm % 10 === 0, five = cm % 5 === 0;
        return <g key={cm}><path d={`M${SX - 66},${y} h${ten ? 54 : five ? 38 : 22}`} stroke="#5a4630" strokeWidth={ten ? 3 : five ? 2.2 : 1.4}/>
          {ten && cm > 0 && cm % 20 === 0 && <text x={SX - 6} y={y + 8} fontFamily={SANS} fontWeight={800} fontSize={24} fill="#5a4630">{cm}</text>}</g>;
      })}
      <text x={SX} y={BASE + 40} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} letterSpacing="2" fill="#7a2a1d">cm</text>
      {/* pointer from the water surface to the ruler */}
      <path d={`M${BX + wAt(ly) / 2 - 6},${ly} H${SX + 66}`} stroke="#c63f2f" strokeWidth={2.5} strokeDasharray="6 6" opacity={0.8}/>
      <polygon points={`${SX + 66},${ly} ${SX + 96},${ly - 15} ${SX + 96},${ly + 15}`} fill="#c63f2f" stroke="#8a2c1d" strokeWidth={1.5}/>
    </g>
  );
};
export const BucketBandLabels: React.FC<AP> = (p) => {
  const L = rlabs(p), avg = fig({t: "u7_lpa", state: "India", s: "new"}).value / 10, ppc = (BASE - TOPY) / (avg * 1.4), yc = BASE - avg * ppc;
  return <>
    {L[0] && <P2Card cx={1390} y={yc - 62} text={L[0].text} f={p.f} at={L[0].at} size={50} tone="green" upper={false} maxW={640}/>}
    {L[1] && <P2Card cx={1390} y={yc + 100} text={L[1].text} f={p.f} at={L[1].at} size={38} upper={false} maxW={780}/>}
    {L[2] && <P2Card cx={1390} y={yc + 250} text={L[2].text} f={p.f} at={L[2].at} size={38} upper={false} maxW={780}/>}
  </>;
};
void W; void Hills;
