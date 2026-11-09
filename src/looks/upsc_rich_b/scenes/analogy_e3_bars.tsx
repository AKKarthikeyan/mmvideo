// ECO-16 Part 1, builder E3: `split-bar` (the b00 hook: all of India's money as one wide bar, cash vs deposits) and `m3-bar` (the payoff: one tall bar in four segments).
// Every width and height is the table value of e16_m3 (cash, dd, td, oth, dep) read through fig(); nothing is typed.
import React from "react";
import {SANS, SERIF, W, H, eo, eio} from "../kit";
import {fig} from "../../cartoon/long/figs";
import {prog, type AP} from "./analogy_kit";
import {P2Card} from "./analogy_p2b_kit";
import {Brace, Coin, Counter, Defs, Note, Specks, Spot, elabs} from "./analogy_e3_kit";

const M3 = (s: string) => fig({t: "e16_m3", state: "India", s});

// ---- split-bar ------------------------------------------------------------------------------------------------------------------
const BX0 = 120, BX1 = 1800, BY0 = 372, BY1 = 672, BR = 30;

export const SplitBarArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), cash = M3("cash"), dep = M3("dep");
  const tot = BX1 - BX0, wc = (tot * cash.value) / (cash.value + dep.value), wd = tot - wc, xm = BX0 + wc;
  const tc = L.lc.at, td = L.ld.at;
  const g0 = eo(prog(f, 0, 34)), g1 = eo(prog(f, tc, 34)), g2 = eo(prog(f, td, 56));
  const cashPct = fig({t: "e16_m3", state: "India", s: "cash"}, 0).text, depPct = fig({t: "e16_m3", state: "India", s: "dep"}, 0).text;
  const xc = BX0 + wc * g1, xd = xm + wd * g2;
  const sweep = ((f * 5.5) % (tot + 700)) - 350;
  return (
    <g>
      <Defs/>
      <defs>
        <linearGradient id="sb-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1d2c63"/><stop offset="0.55" stopColor="#0f1838"/><stop offset="1" stopColor="#080d22"/></linearGradient>
        <linearGradient id="sb-slab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a3b78"/><stop offset="1" stopColor="#141f48"/></linearGradient>
        <linearGradient id="sb-cash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff2b8"/><stop offset="0.45" stopColor="#ffd25a"/><stop offset="1" stopColor="#f09a28"/></linearGradient>
        <linearGradient id="sb-dep" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3fd0c4"/><stop offset="0.5" stopColor="#1d9aa6"/><stop offset="1" stopColor="#11607f"/></linearGradient>
        <clipPath id="sb-track"><rect x={BX0} y={BY0} width={tot} height={BY1 - BY0} rx={BR}/></clipPath>
        <clipPath id="sb-cashc"><rect x={BX0} y={BY0} width={Math.max(0.1, xc - BX0)} height={BY1 - BY0}/></clipPath>
        <clipPath id="sb-depc"><rect x={xm} y={BY0} width={Math.max(0.1, xd - xm)} height={BY1 - BY0}/></clipPath>
        <pattern id="sb-fac" x={xm} y={BY0} width={190} height={300} patternUnits="userSpaceOnUse">
          <path d="M20,86 L95,38 L170,86 Z" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.34)" strokeWidth="2.2"/>
          <rect x={20} y={90} width={150} height={12} fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.3)" strokeWidth="2"/>
          {[0, 1, 2, 3].map((i) => <rect key={i} x={30 + i * 36} y={106} width={16} height={128} fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.3)" strokeWidth="2"/>)}
          <rect x={14} y={238} width={162} height={12} fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.3)" strokeWidth="2"/>
          <rect x={4} y={252} width={182} height={12} fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.26)" strokeWidth="2"/>
        </pattern>
        <linearGradient id="sb-shine" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0"/><stop offset="0.5" stopColor="#fff" stopOpacity="0.34"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#sb-bg)"/>
      <Spot id="sb-sp" cx={960} cy={260} rx={1100} ry={420} c="#ffd98a" a={0.34}/>
      {Array.from({length: 14}, (_, i) => <path key={i} d={`M${-60 + i * 160},${760} L${960 + (i - 6.5) * 430},${H + 80}`} stroke="#4e63b0" strokeWidth={1.4} opacity={0.22}/>)}
      {Array.from({length: 5}, (_, i) => <path key={i} d={`M-60,${790 + i * 62} H${W + 60}`} stroke="#4e63b0" strokeWidth={1.4} opacity={0.2}/>)}
      <Specks f={f} n={34} seed={5} c="#ffe3a0" y0={120} y1={760}/>

      <g opacity={g0} transform={`translate(0 ${(1 - g0) * 40})`}>
        {/* slab */}
        <ellipse cx={960} cy={790} rx={900} ry={46} fill="#02040e" opacity={0.6} filter="url(#e3-glow)"/>
        <rect x={BX0 - 44} y={BY0 - 40} width={tot + 88} height={BY1 - BY0 + 96} rx={44} fill="url(#sb-slab)" stroke="#6e86d6" strokeWidth={2.4}/>
        <rect x={BX0 - 44} y={BY0 - 40} width={tot + 88} height={9} rx={4} fill="#a9bcf3" opacity={0.5}/>
        <rect x={BX0 - 10} y={BY0 - 10} width={tot + 20} height={BY1 - BY0 + 20} rx={BR + 8} fill="#080e26" stroke="#3b4d92" strokeWidth={2}/>
        <rect x={BX0} y={BY0} width={tot} height={BY1 - BY0} rx={BR} fill="#0c1431"/>
        {/* decile ticks above the slab: the bar is drawn to scale, 100% across */}
        {Array.from({length: 11}, (_, i) => <path key={i} d={`M${BX0 + (tot * i) / 10},${BY0 - 22} v${i % 5 === 0 ? 16 : 10}`} stroke="#8ea4e8" strokeWidth={i % 5 === 0 ? 3 : 2} strokeLinecap="round" opacity={0.7}/>)}
        {/* empty-track watermark */}
        <g clipPath="url(#sb-track)">
          <text x={960} y={BY0 + 205} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={250} fill="none" stroke="#5a70c0" strokeWidth={3} opacity={0.4 * (1 - g2)} letterSpacing={18}>M3</text>
        </g>

        {/* deposits */}
        {g2 > 0.001 && (
          <g clipPath="url(#sb-track)">
            <g clipPath="url(#sb-depc)">
              <rect x={xm} y={BY0} width={wd} height={BY1 - BY0} fill="url(#sb-dep)"/>
              <rect x={xm} y={BY0} width={wd} height={BY1 - BY0} fill="url(#sb-fac)"/>
              <rect x={xm} y={BY0} width={wd} height={30} fill="#fff" opacity={0.18}/>
              <rect x={xm + sweep * 0 + ((f * 7) % (wd + 500)) - 300} y={BY0} width={260} height={BY1 - BY0} fill="url(#sb-shine)" transform="skewX(-16)"/>
              <rect x={xm} y={BY1 - 44} width={wd} height={44} fill="#06304a" opacity={0.35}/>
            </g>
          </g>
        )}
        {g2 > 0.5 && (
          <g opacity={eo(prog(g2, 0.5, 0.5))}>
            <text x={xm + wd / 2 + 6} y={BY0 + 205} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={190} fill="#06304a" opacity={0.5}>{depPct}%</text>
            <text x={xm + wd / 2} y={BY0 + 198} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={190} fill="#fff9e8" stroke="#0b4a66" strokeWidth={3} paintOrder="stroke">{depPct}%</text>
            <text x={xm + wd / 2} y={BY0 + 252} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={26} letterSpacing={9} fill="#d6f6f2">DEPOSITS</text>
          </g>
        )}

        {/* cash block: coins and a note, the bright thin one */}
        {g1 > 0.001 && (
          <g clipPath="url(#sb-track)">
            <g clipPath="url(#sb-cashc)">
              <rect x={BX0} y={BY0} width={wc} height={BY1 - BY0} fill="url(#sb-cash)"/>
              {Array.from({length: 9}, (_, i) => <path key={i} d={`M${BX0},${BY0 + 24 + i * 34} H${BX0 + wc}`} stroke="#fff" strokeWidth={1.6} opacity={0.22}/>)}
              <rect x={BX0} y={BY0} width={wc} height={26} fill="#fff" opacity={0.4}/>
              <g transform={`translate(${BX0 + wc / 2} ${BY0 + 78}) rotate(-6)`}><Note id="sbn" w={150} h={72} tone="olive" shadow gloss={0}/></g>
              {[0, 1, 2].map((i) => <g key={i} transform={`translate(${BX0 + wc / 2 - 44 + i * 44} ${BY0 + 168 + (i % 2) * 8})`}><Coin id={`sbc${i}`} r={25} rot={i * 14}/></g>)}
              <text x={BX0 + wc / 2} y={BY0 + 268} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={66} fill="#4a2a05" stroke="#fff3c4" strokeWidth={2} paintOrder="stroke">{cashPct}%</text>
            </g>
            <rect x={xc - 3} y={BY0} width={6} height={BY1 - BY0} fill="#fff8d6" opacity={g1 < 1 ? 0.95 : 0.55}/>
          </g>
        )}
        {g1 > 0.001 && <ellipse cx={BX0 + wc / 2} cy={BY0 + 150} rx={wc * 0.8} ry={230} fill="url(#ak-sunglow)" opacity={0.5 + Math.sin(f / 8) * 0.12} style={{mixBlendMode: "screen"}}/>}
        {/* the seam where the two parts meet */}
        {g2 > 0.001 && <rect x={xm - 2.5} y={BY0 - 6} width={5} height={BY1 - BY0 + 12} fill="#fff8d6" opacity={0.9 * (1 - 0.5 * g2)}/>}
        {/* glass lip */}
        <rect x={BX0} y={BY0} width={tot} height={BY1 - BY0} rx={BR} fill="none" stroke="#9db4f5" strokeWidth={2.4} opacity={0.6}/>
        <rect x={BX0 + 14} y={BY0 + 8} width={tot - 28} height={12} rx={6} fill="#fff" opacity={0.1}/>
      </g>

      {/* little coins hopping onto the cash block */}
      {g1 >= 1 && [0, 1, 2, 3].map((i) => {
        const u = ((f - tc) * 0.018 + i * 0.25) % 1, x = BX0 + 34 + (i * 0.27 + 0.1) * (wc - 68), y = BY0 - 20 - Math.sin(u * Math.PI) * 120 + (u > 0.9 ? (u - 0.9) * 200 : 0);
        return <g key={i} transform={`translate(${x} ${y}) scale(${0.6})`} opacity={Math.min(1, u * 8) * (1 - Math.max(0, u - 0.88) * 8)}><Coin id={`sbh${i}`} r={22} rot={u * 360}/></g>;
      })}

      {/* leaders to the two labels */}
      <g stroke="#ffd98a" strokeWidth={3} fill="none" strokeLinecap="round" strokeDasharray="1 9" opacity={0.9}>
        {g1 >= 0.6 && <path d={`M${BX0 + wc / 2},${BY1 + 8} V${BY1 + 70}`} strokeDasharray="none" strokeWidth={3.4} opacity={eo(prog(g1, 0.6, 0.4))}/>}
        {g2 >= 0.4 && <path d={`M${1330},${BY1 + 8} V${BY1 + 70}`} strokeDasharray="none" strokeWidth={3.4} opacity={eo(prog(g2, 0.4, 0.4))}/>}
      </g>
    </g>
  );
};

export const SplitBarLabels: React.FC<AP> = (p) => {
  const L = elabs(p), wc = ((BX1 - BX0) * M3("cash").value) / (M3("cash").value + M3("dep").value);
  void wc;
  return <>
    <P2Card cx={960} y={92} text={L.cap.text} f={p.f} at={L.cap.at} size={42} tone="dark" upper={false} maxW={1300}/>
    <P2Card cx={BX0} y={BY1 + 70} text={L.lc.text} f={p.f} at={L.lc.at + 6} size={34} tone="dark" upper={false} left maxW={560}/>
    <P2Card cx={1330} y={BY1 + 70} text={L.ld.text} f={p.f} at={L.ld.at + 6} size={40} tone="dark" upper={false} maxW={600}/>
  </>;
};

// ---- m3-bar ---------------------------------------------------------------------------------------------------------------------
const TB = 858, BHT = 608, MX0 = 740, MW = 280, DX = 56, DY = -34;

type Seg = {k: string; s: string; c1: string; c2: string; side: string; top: string; dec: number; txt: string; ink: string};
const SEGS: Seg[] = [
  {k: "c", s: "cash", c1: "#ffe38a", c2: "#f0a42c", side: "#b9741a", top: "#fff2b8", dec: 0, txt: "#4a2a05", ink: "#fff3c4"},
  {k: "d", s: "dd", c1: "#ffb98a", c2: "#e2662f", side: "#a8431c", top: "#ffd8b8", dec: 0, txt: "#4e1a08", ink: "#ffe6d2"},
  {k: "t", s: "td", c1: "#52b3de", c2: "#1d5f9c", side: "#143f6e", top: "#a9dcf3", dec: 1, txt: "#ffffff", ink: "#0d3558"},
  {k: "o", s: "oth", c1: "#ff7fd0", c2: "#c4278f", side: "#8c1566", top: "#ffc2ea", dec: 1, txt: "#ffffff", ink: "#6a0f4c"},
];
const SLOT: Record<string, number> = {c: 826, d: 700, t: 470, o: 312};

export const M3BarArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p);
  const vals = SEGS.map((s) => M3(s.s).value), tot = vals.reduce((a, b) => a + b, 0);
  const hs = vals.map((v) => (BHT * v) / tot);
  const bottoms: number[] = []; let acc = TB; hs.forEach((h) => { bottoms.push(acc); acc -= h; });
  const g0 = eo(prog(f, 0, 30)), tq = L.q.at, qa = eo(prog(f, tq, 26)), qpulse = qa * (0.5 + 0.5 * Math.sin(f / 6));
  const fills = SEGS.map((s) => eo(prog(f, L[s.k].at, 40)));
  return (
    <g>
      <Defs/>
      <defs>
        <linearGradient id="mb-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6ead0"/><stop offset="1" stopColor="#e7d3aa"/></linearGradient>
        <linearGradient id="mb-win" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff8da" stopOpacity="0.8"/><stop offset="1" stopColor="#fff8da" stopOpacity="0"/></linearGradient>
        <pattern id="mb-fd" width="64" height="44" patternUnits="userSpaceOnUse">
          <rect x={5} y={5} width={54} height={34} rx={4} fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.28)" strokeWidth="1.5"/>
          <circle cx={46} cy={22} r={8} fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.5"/>
          <path d="M12,15 h22 M12,22 h18 M12,29 h22" stroke="rgba(255,255,255,.26)" strokeWidth="1.5"/>
        </pattern>
        <pattern id="mb-nt" width="30" height="20" patternUnits="userSpaceOnUse"><path d="M0,10 H30" stroke="rgba(255,255,255,.35)" strokeWidth="1.4"/><circle cx={15} cy={10} r={4.5} fill="none" stroke="rgba(120,70,10,.4)" strokeWidth="1.2"/></pattern>
        <pattern id="mb-pb" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M0,13 H26 M13,0 V26" stroke="rgba(255,255,255,.22)" strokeWidth="1.2"/></pattern>
        <linearGradient id="mb-glass" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.55"/><stop offset="0.2" stopColor="#fff" stopOpacity="0"/><stop offset="0.85" stopColor="#fff" stopOpacity="0.06"/><stop offset="1" stopColor="#fff" stopOpacity="0.3"/></linearGradient>
      </defs>
      {/* the room */}
      <rect x={-60} y={-60} width={W + 120} height={TB + 80} fill="url(#mb-wall)"/>
      <g transform="translate(120 120)"><rect x={-14} y={-14} width={328} height={448} rx={10} fill="#b88f5a" stroke="#7a5a30" strokeWidth={3}/><rect width={300} height={420} fill="#bfdcec"/><rect y={250} width={300} height={170} fill="#cfe0b4" opacity={0.75}/><path d="M0,250 Q70,215 150,245 T300,230 V250 H0 Z" fill="#a9c79a" opacity={0.8}/><path d="M150,0 V420 M0,210 H300" stroke="#b88f5a" strokeWidth={9}/><path d="M12,12 L120,12 L12,120 Z" fill="#fff" opacity={0.35}/></g>
      <path d="M-60,180 L420,60 L420,520 L-60,640 Z" fill="url(#mb-win)" opacity={0.55}/>
      <path d="M1500,60 L2000,-40 L2000,600 L1500,520 Z" fill="url(#mb-win)" opacity={0.3}/>
      <rect x={-60} y={TB - 160} width={W + 120} height={160} fill="#d9bf8e" opacity={0.5}/>
      <rect x={-60} y={TB - 166} width={W + 120} height={8} fill="#fff4d8" opacity={0.8}/>
      <Spot id="mb-sp" cx={MX0 + MW / 2} cy={TB - 300} rx={620} ry={560} a={0.5}/>
      <Counter id="mb" y0={TB}/>
      <Specks f={f} n={16} seed={9} c="#fff3c8" x0={80} x1={1840} y0={120} y1={820}/>

      <g opacity={g0}>
        {/* shadow of the bar on the table */}
        <ellipse cx={MX0 + MW / 2 + DX / 2 + 36} cy={TB + 24} rx={MW * 0.78} ry={34} fill="#1a0c04" opacity={0.42} filter="url(#e3-glow-s)"/>
        {/* props on the table */}
        <g transform="translate(318 944)"><Coin id="mbt1" r={30} rot={8}/></g>
        <g transform="translate(372 952)"><Coin id="mbt2" r={30} rot={-12}/></g>
        <g transform="translate(1500 936) rotate(-5)"><Note id="mbtn" w={190} h={92} tone="teal" gloss={0}/></g>
        {/* empty glass bar: full height to scale */}
        <path d={`M${MX0},${TB} V${TB - BHT} H${MX0 + MW} V${TB} Z`} fill="#fff" opacity={0.28}/>
        <path d={`M${MX0 + MW},${TB} V${TB - BHT} L${MX0 + MW + DX},${TB - BHT + DY} V${TB + DY} Z`} fill="#c9b79a" opacity={0.28}/>
        {Array.from({length: 11}, (_, i) => <path key={i} d={`M${MX0 - 6},${TB - (BHT * i) / 10} h-${i % 5 === 0 ? 24 : 14}`} stroke="#6a4a2a" strokeWidth={i % 5 === 0 ? 3 : 2} strokeLinecap="round" opacity={0.7}/>)}
        {/* segments, bottom to top */}
        {SEGS.map((s, i) => {
          const g = fills[i], h = hs[i] * g, yb = bottoms[i], yt = yb - h;
          if (g <= 0.001) return null;
          const pat = s.k === "c" ? "url(#mb-nt)" : s.k === "d" ? "url(#mb-pb)" : s.k === "t" ? "url(#mb-fd)" : "none";
          const glowQ = (s.k === "c" || s.k === "d") ? qpulse : 0;
          return (
            <g key={s.k}>
              <defs><linearGradient id={`mb-g${s.k}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={s.c1}/><stop offset="1" stopColor={s.c2}/></linearGradient></defs>
              <path d={`M${MX0 + MW},${yb} L${MX0 + MW + DX},${yb + DY} V${yt + DY} L${MX0 + MW},${yt} Z`} fill={s.side} stroke={s.side} strokeWidth={1}/>
              <path d={`M${MX0},${yt} L${MX0 + DX},${yt + DY} H${MX0 + MW + DX} L${MX0 + MW},${yt} Z`} fill={s.k === "o" ? "#e4ebf2" : s.top} stroke={s.k === "o" ? "#a9b6c4" : s.side} strokeWidth={1.2} opacity={s.k === "o" ? 0.8 : 0.95}/>
              <rect x={MX0} y={yt} width={MW} height={Math.max(0.5, h)} fill={`url(#mb-g${s.k})`} stroke={s.side} strokeWidth={1.4}/>
              {pat !== "none" && <rect x={MX0} y={yt} width={MW} height={Math.max(0.5, h)} fill={pat}/>}
              <rect x={MX0} y={yt} width={MW} height={Math.min(8, h)} fill="#fff" opacity={0.35}/>
              {glowQ > 0.01 && <rect x={MX0 - 5} y={yt - 5} width={MW + 10} height={h + 10} fill="none" stroke="#fff2b8" strokeWidth={6} opacity={glowQ * 0.9} filter="url(#e3-glow-s)"/>}
              {g > 0.9 && s.k !== "o" && (
                <text x={MX0 + MW / 2} y={yt + h / 2 + (s.k === "t" ? 26 : 15)} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={s.k === "t" ? 70 : 46} fill={s.txt} stroke={s.ink} strokeWidth={s.k === "t" ? 2.6 : 1.8} paintOrder="stroke" opacity={eo(prog(g, 0.9, 0.1))}>{fig({t: "e16_m3", state: "India", s: s.s}, s.dec).text}%</text>
              )}
            </g>
          );
        })}
        {/* the hairline gets a bright marker so it cannot be missed (the line itself is drawn to scale) */}
        {fills[3] > 0.2 && (() => { const yb = bottoms[3], yt = yb - hs[3] * fills[3]; return (
          <g opacity={eo(prog(fills[3], 0.2, 0.6))}>
            <path d={`M${MX0 - 14},${yt} H${MX0 + MW + DX + 12}`} stroke="#ff5cc6" strokeWidth={Math.max(1.6, hs[3])} opacity={0.95}/>
            <path d={`M${MX0 + MW + DX},${yt + DY} H${MX0 + MW + DX + 40}`} stroke="#ff9ede" strokeWidth={2} strokeDasharray="1 7" strokeLinecap="round"/>
          </g>); })()}
        {/* glass front over the whole bar */}
        <rect x={MX0} y={TB - BHT} width={MW} height={BHT} fill="url(#mb-glass)" opacity={0.65}/>
        <rect x={MX0 + 18} y={TB - BHT + 22} width={14} height={BHT - 44} rx={7} fill="#fff" opacity={0.45}/>
        <path d={`M${MX0},${TB} V${TB - BHT} L${MX0 + DX},${TB - BHT + DY} H${MX0 + MW + DX} V${TB + DY}`} fill="none" stroke="#8f7650" strokeWidth={2.4} strokeLinejoin="round" opacity={0.85}/>
        <rect x={MX0} y={TB - BHT} width={MW} height={BHT} fill="none" stroke="#8f7650" strokeWidth={2.4}/>
        <path d={`M${MX0 + MW},${TB - BHT} L${MX0 + MW + DX},${TB - BHT + DY}`} stroke="#8f7650" strokeWidth={2.4}/>
        <rect x={MX0 - 22} y={TB - 8} width={MW + DX + 44} height={16} rx={6} fill="#7a5a36" stroke="#4e361c" strokeWidth={2}/>

        {/* leaders to the labels on the right */}
        {SEGS.map((s, i) => {
          const g = fills[i]; if (g <= 0.3) return null;
          const cy = bottoms[i] - (hs[i] * g) / 2 + DY / 2, sy = SLOT[s.k], x0 = MX0 + MW + DX + (s.k === "o" ? 46 : 8), a = eo(prog(g, 0.3, 0.6));
          return <g key={s.k} opacity={a}><path d={`M${x0},${cy} C${x0 + 60},${cy} ${x0 + 40},${sy} ${1176},${sy}`} fill="none" stroke="#6a4a2a" strokeWidth={2.6} strokeLinecap="round"/><circle cx={x0} cy={cy} r={6} fill={s.c2} stroke="#fff" strokeWidth={2}/></g>;
        })}
        {/* bracket over cash + demand deposits */}
        <Brace x={MX0 - 48} y0={bottoms[1] - hs[1]} y1={TB} dir={-1} c="#7a2a10" w={6} p={qa} amp={30}/>
        {qa > 0.4 && <path d={`M${MX0 - 48 - 57},${(bottoms[1] - hs[1] + TB) / 2} H${MX0 - 48 - 97}`} stroke="#7a2a10" strokeWidth={3} strokeLinecap="round" opacity={eo(prog(qa, 0.4, 0.6))}/>}
      </g>
    </g>
  );
};

export const M3BarLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return <>
    <P2Card cx={960} y={70} text={L.cap.text} f={p.f} at={L.cap.at} size={42} upper={false} maxW={1300}/>
    <P2Card cx={1190} y={SLOT.c - 42} text={L.c.text} f={p.f} at={L.c.at + 8} size={32} upper={false} left maxW={540}/>
    <P2Card cx={1190} y={SLOT.d - 42} text={L.d.text} f={p.f} at={L.d.at + 8} size={32} upper={false} left maxW={540}/>
    <P2Card cx={1190} y={SLOT.t - 42} text={L.t.text} f={p.f} at={L.t.at + 8} size={32} upper={false} left maxW={540}/>
    <P2Card cx={1190} y={SLOT.o - 60} text={L.o.text} f={p.f} at={L.o.at + 8} size={32} upper={false} left maxW={540}/>
    <P2Card cx={341} y={724} text={L.q.text} f={p.f} at={L.q.at} size={32} upper={false} tone="warm" maxW={440}/>
  </>;
};

export { eio };
