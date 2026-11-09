// Part 2 analogy "column-house", "spells" and "months". Bar heights come from fig(); labels only from at(key); nothing numeric is typed.
import React from "react";
import {fig} from "../../cartoon/long/figs";
import {SANS, SERIF, W, H, clamp, eo, eio, rng} from "../kit";
import {LabelCard, Person, Tree, lerp, prog, type AP} from "./analogy_kit";
import {Puff, Rain, Sky, items} from "./analogy_p2a_parts";

// ---- column-house -------------------------------------------------------------------------------------------------------------
const GY = 800, HX = 300, HW = 470, SH = 150, HT = SH * 3, CXC = 1120, CW = 150, CTOP = GY - HT - 34;   // "about as tall as" the house (claim M113), never taller

const Window: React.FC<{x: number; y: number; w: number; h: number; lit?: boolean}> = ({x, y, w, h, lit}) => (
  <g>
    <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx={5} fill="#f2e6cc" stroke="#9a7a4a" strokeWidth={1.6}/>
    <rect x={x} y={y} width={w} height={h} rx={3} fill={lit ? "#ffe9a8" : "#6f94b4"} stroke="#3f5a74" strokeWidth={1.6}/>
    <rect x={x} y={y} width={w} height={h * 0.45} fill="#fff" opacity={0.2}/>
    {[1, 2, 3].map((i) => <line key={i} x1={x + (w * i) / 4} x2={x + (w * i) / 4} y1={y} y2={y + h} stroke="#3f5a74" strokeWidth={2.4}/>)}
    <line x1={x} x2={x + w} y1={y + h / 2} y2={y + h / 2} stroke="#3f5a74" strokeWidth={2.4}/>
    <rect x={x - 24} y={y - 4} width={20} height={h + 8} fill="#4c8a52" stroke="#2f5f36" strokeWidth={1.6}/><rect x={x + w + 4} y={y - 4} width={20} height={h + 8} fill="#4c8a52" stroke="#2f5f36" strokeWidth={1.6}/>
  </g>
);

const House: React.FC<{f: number}> = ({f}) => {
  const top = GY - HT;
  return (
    <g>
      <ellipse cx={HX + HW / 2 + 50} cy={GY + 6} rx={HW / 2 + 110} ry={18} fill="#1d3a1a" opacity={0.3}/>
      <defs>
        <linearGradient id="p2h-wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#f0cf78"/><stop offset="1" stopColor="#dca94e"/></linearGradient>
        <linearGradient id="p2h-side" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#b68438"/><stop offset="1" stopColor="#8a5f26"/></linearGradient>
      </defs>
      {/* side face and roof slab (2.5D) */}
      <path d={`M${HX + HW},${top} L${HX + HW + 70},${top - 34} V${GY - 34} L${HX + HW},${GY} Z`} fill="url(#p2h-side)" stroke="#6a4818" strokeWidth={1.8}/>
      <path d={`M${HX - 14},${top} L${HX + 56},${top - 34} H${HX + HW + 84} L${HX + HW + 14},${top} Z`} fill="#c9b894" stroke="#7a6a48" strokeWidth={1.8}/>
      <rect x={HX} y={top} width={HW} height={HT} fill="url(#p2h-wall)" stroke="#8a5f26" strokeWidth={2}/>
      {/* storey bands */}
      {[1, 2].map((i) => <rect key={i} x={HX - 8} y={top + i * SH - 8} width={HW + 16} height={16} fill="#f5ecd8" stroke="#a89468" strokeWidth={1.6}/>)}
      <rect x={HX - 10} y={top - 4} width={HW + 20} height={22} fill="#b8452a" stroke="#7a2a14" strokeWidth={1.8}/>
      {Array.from({length: 12}, (_, i) => <path key={i} d={`M${HX + 8 + i * 39},${top + 18} l15,12 l15,-12`} fill="none" stroke="#7a2a14" strokeWidth={2} opacity={0.6}/>)}
      {/* windows per storey */}
      {[0, 1, 2].map((s) => {
        const y = top + s * SH + 56;
        return (
          <g key={s}>
            <Window x={HX + 50} y={y} w={90} h={64} lit={s === 2}/>
            {s === 2
              ? <g><path d={`M${HX + 196},${GY} V${GY - 96} Q${HX + 196},${GY - 128} ${HX + 230},${GY - 128} Q${HX + 264},${GY - 128} ${HX + 264},${GY - 96} V${GY} Z`} fill="#6b4524" stroke="#3f2810" strokeWidth={2}/><circle cx={HX + 250} cy={GY - 60} r={4} fill="#e6c36a"/><rect x={HX + 178} y={GY - 8} width={104} height={8} fill="#c9b894"/><Window x={HX + 330} y={y} w={90} h={64} lit/></g>
              : <g>
                  <Window x={HX + 330} y={y} w={90} h={64}/>
                  <rect x={HX + 190} y={top + s * SH + 96} width={118} height={14} fill="#c9b894" stroke="#7a6a48" strokeWidth={1.6}/>
                  <rect x={HX + 196} y={top + s * SH + 20} width={106} height={76} fill="#1d2a38" opacity={0.35}/>
                  {Array.from({length: 8}, (_, i) => <line key={i} x1={HX + 198 + i * 15} x2={HX + 198 + i * 15} y1={top + s * SH + 56} y2={top + s * SH + 96} stroke="#3f3a34" strokeWidth={2.4}/>)}
                  <line x1={HX + 194} x2={HX + 304} y1={top + s * SH + 56} y2={top + s * SH + 56} stroke="#3f3a34" strokeWidth={3}/>
                </g>}
          </g>
        );
      })}
      {/* rainwater pipe and rooftop tank */}
      <rect x={HX + HW - 14} y={top + 18} width={9} height={HT - 18} fill="#7d8791" stroke="#4f5a64" strokeWidth={1.2}/>
      <g transform={`translate(${HX + 150} ${top - 30})`}>
        <rect x={-40} y={-4} width={8} height={26} fill="#5a4a38"/><rect x={32} y={-4} width={8} height={26} fill="#5a4a38"/>
        <ellipse cx={0} cy={-52} rx={52} ry={14} fill="#2a2e36"/><path d="M-52,-52 V6 Q0,22 52,6 V-52 Q0,-38 -52,-52 Z" fill="#33383f" stroke="#1a1d22" strokeWidth={1.6}/>
        <ellipse cx={0} cy={-54} rx={52} ry={14} fill="#454b55"/><rect x={-30} y={-48} width={10} height={50} fill="#fff" opacity={0.12}/>
      </g>
      <line x1={HX + 360} x2={HX + 360} y1={top - 30} y2={top - 100} stroke="#7d8791" strokeWidth={3}/><line x1={HX + 336} x2={HX + 386} y1={top - 82} y2={top - 82} stroke="#7d8791" strokeWidth={3}/><line x1={HX + 344} x2={HX + 378} y1={top - 64} y2={top - 64} stroke="#7d8791" strokeWidth={3}/>
      <Person x={HX + HW + 120} y={GY + 6} h={SH * 0.57} f={f} seed={5}/>
    </g>
  );
};

const ColumnHouseArt: React.FC<AP> = (p) => {
  const {f} = p, its = items(p), ho = its[0];
  const lv = eio(prog(f, 8, 110)), top = GY - HT, waterTop = lerp(GY, CTOP + 18, lv), ex = ho ? eo(prog(f, ho.at, 20)) : 0;
  return (
    <g>
      <Sky id="p2h-sky" a="#7fb2d8" b="#e9dfc8" h={GY}/>
      <path d={`M-60,${GY - 80} L180,${GY - 190} L420,${GY - 100} L760,${GY - 220} L1100,${GY - 110} L1500,${GY - 200} L1980,${GY - 90} V${GY} H-60 Z`} fill="#a7bfd4" opacity={0.6}/>
      <path d={`M-60,${GY - 40} Q300,${GY - 120} 700,${GY - 50} T1500,${GY - 70} T1980,${GY - 40} V${GY} H-60 Z`} fill="#86ab9a" opacity={0.8}/>
      <Puff x={560} y={118} s={1.05} grow={1} dark seed={21} f={f}/><Puff x={CXC} y={96} s={0.95} grow={1} dark seed={22} f={f}/><Puff x={1640} y={150} s={0.7} grow={1} dark seed={23} f={f} a={0.85}/>
      <defs>
        <linearGradient id="p2h-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fb060"/><stop offset="0.4" stopColor="#5f9a4c"/><stop offset="1" stopColor="#3f7a3c"/></linearGradient>
        <linearGradient id="p2h-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffffff" stopOpacity="0.85"/><stop offset="0.3" stopColor="#e6f1f7" stopOpacity="0.35"/><stop offset="1" stopColor="#9fb8c8" stopOpacity="0.55"/></linearGradient>
        <linearGradient id="p2h-water" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4aa8e0"/><stop offset="0.5" stopColor="#2b86cc"/><stop offset="1" stopColor="#1d5f9e"/></linearGradient>
        <clipPath id="p2h-tube"><rect x={CXC - CW / 2 + 6} y={CTOP} width={CW - 12} height={GY - CTOP} rx={16}/></clipPath>
      </defs>
      <rect x={-60} y={GY - 4} width={W + 120} height={400} fill="url(#p2h-ground)"/>
      <Tree x={150} y={GY + 20} s={0.85} bend={-2} f={f} seed={4}/>
      <House f={f}/>
      <Rain x0={HX} x1={HX + HW + 60} top={170} bottom={GY - HT - 4} f={f} n={26} seed={8} col="#dff0fb" slant={12} sp={1.3}/>
      <Rain x0={160} x1={290} top={190} bottom={GY} f={f} n={12} seed={12} col="#dff0fb" slant={12} sp={1.3}/>
      {/* the glass column */}
      <ellipse cx={CXC + 30} cy={GY + 8} rx={CW / 2 + 70} ry={16} fill="#1d3a1a" opacity={0.3}/>
      <rect x={CXC - CW / 2 - 30} y={GY - 16} width={CW + 60} height={26} rx={8} fill="#8a5a30" stroke="#4f3418" strokeWidth={2}/>
      <rect x={CXC - CW / 2} y={CTOP - 4} width={CW} height={GY - CTOP + 4} rx={20} fill="rgba(200,226,240,.22)" stroke="#6b8294" strokeWidth={3.4}/>
      <g clipPath="url(#p2h-tube)">
        <rect x={CXC - CW / 2} y={waterTop} width={CW} height={GY - waterTop + 20} fill="url(#p2h-water)"/>
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${CXC - CW / 2},${waterTop + 40 + i * 50} q20,-8 38,0 q20,8 38,0 q20,-8 38,0 q20,8 38,0`} stroke="#e9f8ff" strokeWidth={2.4} fill="none" opacity={0.3} transform={`translate(${Math.sin(f / 15 + i) * 6} 0)`}/>)}
        {Array.from({length: 9}, (_, i) => <circle key={i} cx={CXC - 50 + ((i * 37) % 100)} cy={GY - ((f * (0.7 + (i % 3) * 0.3) + i * 83) % Math.max(60, GY - waterTop))} r={3 + (i % 3)} fill="#fff" opacity={0.5}/>)}
      </g>
      <ellipse cx={CXC} cy={waterTop} rx={CW / 2 - 6} ry={9} fill="#9fdcf5" opacity={lv > 0.02 ? 0.9 : 0}/>
      <rect x={CXC - CW / 2 + 12} y={CTOP + 6} width={14} height={GY - CTOP - 24} rx={7} fill="url(#p2h-glass)" opacity={0.7}/>
      {Array.from({length: 13}, (_, i) => <g key={i}><line x1={CXC + CW / 2 - 2} x2={CXC + CW / 2 + (i % 2 ? 14 : 28)} y1={GY - 24 - i * 48} y2={GY - 24 - i * 48} stroke="#5d6e7d" strokeWidth={i % 2 ? 2.4 : 3.6} strokeLinecap="round"/></g>)}
      <Rain x0={CXC - 56} x1={CXC + 56} top={150} bottom={waterTop} f={f} n={16} seed={31} col="#cfe9fa" slant={4} sp={1.4}/>
      {/* "taller than its roof" */}
      {ho && (
        <g opacity={ex}>
          <line x1={HX + HW + 70} x2={CXC + CW / 2 + 26} y1={top - 34} y2={top - 34} stroke="#c0481f" strokeWidth={3} strokeDasharray="12 9"/>
          <path d={`M${CXC + CW / 2 + 70},${CTOP} V${top - 34}`} stroke="#c0481f" strokeWidth={4} strokeLinecap="round"/>
          <path d={`M${CXC + CW / 2 + 58},${CTOP + 16} L${CXC + CW / 2 + 70},${CTOP} L${CXC + CW / 2 + 82},${CTOP + 16}`} stroke="#c0481f" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <path d={`M${CXC + CW / 2 + 58},${top - 50} L${CXC + CW / 2 + 70},${top - 34} L${CXC + CW / 2 + 82},${top - 50}`} stroke="#c0481f" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
      )}
    </g>
  );
};
const ColumnHouseLabels: React.FC<AP> = (p) => { const its = items(p); return its[0] ? <LabelCard cx={1535} y={470} text={its[0].text} f={p.f} at={its[0].at} size={34} maxW={560}/> : null; };

// ---- spells -------------------------------------------------------------------------------------------------------------------
// an illustrative July: alternating runs of wet spell and break (the totals are the days of July)
const RUNS = [5, 2, 8, 7, 5, 2, 2];
const DAYS: boolean[] = RUNS.flatMap((n, i) => Array.from({length: n}, () => i % 2 === 0)); // true = wet
const NOBREAK = new Set([1, 6, 9, 14, 18, 21, 26]);
const CX0 = 110, CWD = 51, CGP = 4, CY = 196, CHT = 124;

const SpellsArt: React.FC<AP> = (p) => {
  const {f, spec} = p, its = items(p), at = (i: number) => (its[i] ? its[i].at : 1e9);
  const week = RUNS.indexOf(Math.max(...RUNS.filter((_, i) => i % 2 === 1)), 1);
  void week;
  // longest break: runs[3] -> cells from sum(runs[0..2])
  const bi = RUNS.slice(0, 3).reduce((a, b) => a + b, 0), bl = RUNS[3], bx0 = CX0 + bi * (CWD + CGP), bx1 = CX0 + (bi + bl) * (CWD + CGP) - CGP;
  const hl = its[1] ? eo(prog(f, at(1), 18)) : 0, pulse = 0.5 + 0.5 * Math.sin(f / 7);
  const source = (spec as any).source as string | undefined;
  return (
    <g>
      <defs>
        <linearGradient id="p2s-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6ecd2"/><stop offset="1" stopColor="#e8d6a6"/></linearGradient>
        <linearGradient id="p2s-wet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6fb6e8"/><stop offset="1" stopColor="#2f78b8"/></linearGradient>
        <linearGradient id="p2s-dry" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f0d79a"/><stop offset="1" stopColor="#cfa764"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#p2s-bg)"/>
      {Array.from({length: 22}, (_, i) => <line key={i} x1={i * 94 - 20} x2={i * 94 - 20} y1={-60} y2={H + 60} stroke="#b89a64" strokeWidth={1.4} opacity={0.14}/>)}
      <rect x={92} y={CY - 26} width={1736} height={CHT + 62} rx={22} fill="#fffaf0" stroke="#d3bf92" strokeWidth={2} style={{filter: "drop-shadow(0 18px 18px rgba(80,44,18,.3))"}}/>
      {/* legend */}
      <g fontFamily={SANS} fontWeight={700} fontSize={22} fill="#5a3a1c">
        <rect x={1390} y={CY - 14} width={26} height={20} rx={5} fill="url(#p2s-wet)"/><text x={1424} y={CY + 4}>wet spell</text>
        <rect x={1560} y={CY - 14} width={26} height={20} rx={5} fill="url(#p2s-dry)" stroke="#a8803f" strokeWidth={1.2}/><text x={1594} y={CY + 4}>break</text>
      </g>
      {DAYS.map((wet, i) => {
        const a = eo(prog(f, 6 + i * 2.2, 10)), x = CX0 + i * (CWD + CGP), y = CY + 28;
        if (a <= 0.01) return null;
        const inBreak = !wet && i >= bi && i < bi + bl;
        return (
          <g key={i} transform={`translate(${x + CWD / 2} ${y + CHT / 2}) scale(1 ${a}) translate(${-CWD / 2} ${-CHT / 2})`}>
            <rect width={CWD} height={CHT} rx={8} fill={wet ? "url(#p2s-wet)" : "url(#p2s-dry)"} stroke={wet ? "#1d5f98" : "#a8803f"} strokeWidth={2}/>
            {wet
              ? <g stroke="#e6f6ff" strokeWidth={3} strokeLinecap="round" opacity={0.85}><path d={`M14,26 l-4,14 M30,50 l-4,14 M18,76 l-4,14 M38,20 l-4,12`}/></g>
              : <g><circle cx={CWD / 2} cy={34} r={11} fill="#ffd25a" stroke="#d99a1e" strokeWidth={1.6}/>{Array.from({length: 8}, (_, k) => <line key={k} x1={CWD / 2} y1={34 - 17} x2={CWD / 2} y2={34 - 21} stroke="#d99a1e" strokeWidth={2.4} strokeLinecap="round" transform={`rotate(${k * 45} ${CWD / 2} 34)`}/>)}<path d="M8,100 l10,-8 l6,6 l8,-10" stroke="#a8803f" strokeWidth={2.2} fill="none" strokeLinecap="round"/></g>}
            {inBreak && hl > 0 && <rect x={-2} y={-2} width={CWD + 4} height={CHT + 4} rx={9} fill="none" stroke="#c0481f" strokeWidth={4} opacity={hl * (0.7 + 0.3 * pulse)}/>}
          </g>
        );
      })}
      {hl > 0 && (
        <g opacity={hl}>
          <path d={`M${bx0},${CY + CHT + 44} v12 H${bx1} v-12`} fill="none" stroke="#c0481f" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"/>
          <path d={`M${(bx0 + bx1) / 2},${CY + CHT + 56} v22`} stroke="#c0481f" strokeWidth={4} strokeLinecap="round"/>
        </g>
      )}
      {/* tally of many seasons */}
      {Array.from({length: 28}, (_, i) => {
        const row = Math.floor(i / 14), col = i % 14, x = 139 + col * 118, y = 536 + row * 64, a = eo(prog(f, at(2) + i * 1.3, 9));
        if (a <= 0.01) return null;
        const nb = NOBREAK.has(i), r = rng(i * 19 + 3), bl2 = 3 + Math.floor(r() * 4), bs = 4 + Math.floor(r() * 10), glow = nb ? eo(prog(f, at(2) + 46, 14)) : 0;
        return (
          <g key={i} transform={`translate(${x + 54} ${y + 26}) scale(${0.6 + 0.4 * a}) translate(-54 -26)`} opacity={a}>
            <rect width={108} height={52} rx={9} fill="url(#p2s-wet)" stroke={nb ? "#1f8a4c" : "#1d5f98"} strokeWidth={nb ? 4 : 2}/>
            {!nb && <rect x={bs * 6} y={4} width={bl2 * 8} height={44} rx={5} fill="url(#p2s-dry)" stroke="#a8803f" strokeWidth={1.4}/>}
            {nb && <path d="M34,28 l14,14 l28,-30" fill="none" stroke="#e8fff0" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={0.9}/>}
            {glow > 0 && <rect x={-4} y={-4} width={116} height={60} rx={12} fill="none" stroke="#25995a" strokeWidth={5} opacity={glow * (0.6 + 0.4 * pulse)}/>}
          </g>
        );
      })}
      {source && <text x={W / 2} y={908} textAnchor="middle" fontFamily={SANS} fontWeight={500} fontSize={22} fill="#6a5a44" opacity={eo(prog(f, 24, 20))}>{source}</text>}
    </g>
  );
};
const SpellsLabels: React.FC<AP> = (p) => {
  const its = items(p);
  return (
    <>
      {its[0] && <LabelCard cx={560} y={394} text={its[0].text} f={p.f} at={its[0].at} size={36} maxW={760} tone="warm"/>}
      {its[1] && <LabelCard cx={1280} y={394} text={its[1].text} f={p.f} at={its[1].at} size={32} maxW={760} tone="cool"/>}
      {its[2] && <LabelCard cx={960} y={668} text={its[2].text} f={p.f} at={its[2].at} size={34} maxW={760} tone="cool"/>}
      {its[3] && <LabelCard cx={960} y={786} text={its[3].text} f={p.f} at={its[3].at} size={36} maxW={1100}/>}
    </>
  );
};

// ---- months -------------------------------------------------------------------------------------------------------------------
const MONTHS = ["June", "July", "August", "September"] as const;
const BX0 = 150, BW = 190, BGAP = 70, BASE = 800, BMAX = 500;

const MonthsArt: React.FC<AP> = (p) => {
  const {f, spec} = p, its = items(p), ja = its[0];
  const ref = ((spec as any).ref as string) ?? "u7_months";
  const sh = MONTHS.map((m) => fig({t: ref, state: m, s: "share"})), mx = Math.max(...sh.map((s) => s.value));
  const hi = [false, true, true, false];
  const bk = ja ? eo(prog(f, ja.at, 22)) : 0;
  const hts = sh.map((s, i) => (s.value / mx) * BMAX * eio(prog(f, 8 + i * 8, 60)));
  const jt = BASE - (sh[1].value / mx) * BMAX, at2 = BASE - (sh[2].value / mx) * BMAX, ytop = Math.min(jt, at2) - 78;
  return (
    <g>
      <defs>
        <linearGradient id="p2m-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6ecd2"/><stop offset="1" stopColor="#e8d6a6"/></linearGradient>
        <linearGradient id="p2m-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c99a62"/><stop offset="1" stopColor="#8a5a30"/></linearGradient>
        <linearGradient id="p2m-hi" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5fb6ec"/><stop offset="0.5" stopColor="#2b86cc"/><stop offset="1" stopColor="#1b5a98"/></linearGradient>
        <linearGradient id="p2m-lo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#b3cadb"/><stop offset="0.5" stopColor="#8fa9bf"/><stop offset="1" stopColor="#6c869e"/></linearGradient>
        <linearGradient id="p2m-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffffff" stopOpacity="0.8"/><stop offset="0.3" stopColor="#e6f1f7" stopOpacity="0.28"/><stop offset="1" stopColor="#9fb8c8" stopOpacity="0.5"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#p2m-bg)"/>
      {Array.from({length: 22}, (_, i) => <line key={i} x1={i * 94 - 20} x2={i * 94 - 20} y1={-60} y2={H + 60} stroke="#b89a64" strokeWidth={1.4} opacity={0.14}/>)}
      {[1, 2, 3, 4].map((i) => <line key={i} x1={96} x2={1240} y1={BASE - i * (BMAX / 4)} y2={BASE - i * (BMAX / 4)} stroke="#b89a64" strokeWidth={1.4} strokeDasharray="4 10" opacity={0.5}/>)}
      <text x={BX0} y={176} fontFamily={SANS} fontWeight={700} fontSize={25} letterSpacing={3} fill="#6a4a2c">SHARE OF THE JUNE–SEPTEMBER RAIN</text>
      <rect x={-40} y={BASE} width={W + 80} height={300} fill="url(#p2m-wood)"/><rect x={-40} y={BASE - 4} width={W + 80} height={8} fill="#e8c690" opacity={0.7}/>
      {MONTHS.map((m, i) => {
        const x = BX0 + i * (BW + BGAP), h = hts[i], full = (sh[i].value / mx) * BMAX, hl = hi[i], g = hl ? "url(#p2m-hi)" : "url(#p2m-lo)", a = eo(prog(f, 10 + i * 8, 14));
        return (
          <g key={m}>
            <ellipse cx={x + BW / 2 + 22} cy={BASE + 8} rx={BW / 2 + 40} ry={14} fill="#2a1808" opacity={0.28}/>
            <clipPath id={`p2m-c${i}`}><rect x={x + 6} y={BASE - full - 4} width={BW - 12} height={full + 4} rx={22}/></clipPath>
            <rect x={x} y={BASE - full - 10} width={BW} height={full + 10} rx={26} fill="rgba(200,226,240,.2)" stroke="#6b8294" strokeWidth={3.4} opacity={a}/>
            <g clipPath={`url(#p2m-c${i})`}>
              <rect x={x} y={BASE - h} width={BW} height={h + 6} fill={g}/>
              {hl && [0, 1, 2].map((k) => <path key={k} d={`M${x},${BASE - h + 36 + k * 70} q24,-9 48,0 q24,9 48,0 q24,-9 48,0 q24,9 48,0`} stroke="#e9f8ff" strokeWidth={2.4} fill="none" opacity={0.35} transform={`translate(${Math.sin(f / 15 + k) * 7} 0)`}/>)}
            </g>
            <ellipse cx={x + BW / 2} cy={BASE - h} rx={BW / 2 - 8} ry={9} fill={hl ? "#9fdcf5" : "#d4e2ec"} opacity={h > 2 ? 0.95 : 0}/>
            <rect x={x + 14} y={BASE - full + 4} width={14} height={Math.max(0, full - 20)} rx={7} fill="url(#p2m-glass)" opacity={0.7 * a}/>
            {hl && h > 20 && <rect x={x - 8} y={BASE - h - 10} width={BW + 16} height={h + 16} rx={30} fill="none" stroke="#ffc65a" strokeWidth={4} opacity={0.5 * (0.7 + 0.3 * Math.sin(f / 9))}/>}
            <text x={x + BW / 2} y={BASE - h - 26} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={52} fill={hl ? "#14456e" : "#4a5a6a"} opacity={a}>{sh[i].text}%</text>
            <rect x={x + 2} y={BASE + 28} width={BW - 4} height={56} rx={10} fill="#fffaf0" stroke="#8a6a3e" strokeWidth={1.8} opacity={a}/>
            <text x={x + BW / 2} y={BASE + 66} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={27} letterSpacing={2.5} fill={hl ? "#14456e" : "#5a4a38"} opacity={a}>{m.toUpperCase()}</text>
          </g>
        );
      })}
      {ja && (
        <g opacity={bk}>
          <path d={`M${BX0 + BW + BGAP + 10},${jt - 70} V${ytop} H${BX0 + 2 * BW + 2 * BGAP + BW - 10} V${at2 - 70}`} fill="none" stroke="#c0481f" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"/>
          <path d={`M${BX0 + 1.5 * BW + BGAP * 1.5 + BW / 2 + 10},${ytop} H1530 V300`} fill="none" stroke="#c0481f" strokeWidth={4} strokeLinecap="round" strokeDasharray="10 10"/>
        </g>
      )}
    </g>
  );
};
const MonthsLabels: React.FC<AP> = (p) => { const its = items(p); return its[0] ? <LabelCard cx={1530} y={ (BASE - BMAX) + 20} text={its[0].text} f={p.f} at={its[0].at} size={46} maxW={560}/> : null; };

export {ColumnHouseArt, ColumnHouseLabels, SpellsArt, SpellsLabels, MonthsArt, MonthsLabels};
void clamp;
