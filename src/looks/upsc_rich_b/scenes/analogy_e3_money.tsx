// ECO-16 Part 1, builder E3: `press-mint` (who issues notes and coins), `fiat-note` (a note without its guarantee), `promise-note` (the promise line and the Reserve Bank),
// `deposit-money` (a bank balance is money too: currency + deposits). Motion is a function of f and of at(key); no amounts are typed.
import React from "react";
import {SANS, SERIF, W, H, eio, eo, rng} from "../kit";
import {FlowArrow, Person, prog, type AP} from "./analogy_kit";
import {P2Card} from "./analogy_p2b_kit";
import {BalanceBar, Classical, Coin, CoinEdge, Counter, Defs, Hand, Note, Plaza, Plus, Specks, Spot, Tag, elabs, starPath} from "./analogy_e3_kit";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ---- press-mint -----------------------------------------------------------------------------------------------------------------
const LX = 513, RX = 1407; // panel centres

const PressSide: React.FC<{f: number; a: number; glow: number}> = ({f, a, glow}) => {
  const spin = f * 9;
  return (
    <g opacity={a}>
      <Classical id="pm-rbi" x={LX} y={440} w={440} h={262} text="RESERVE BANK" stone={["#e8ecf0", "#b3bcc8"]} cols={6} fri={0.17} glow={glow}/>
      {/* the press behind its glass wall */}
      <ellipse cx={LX} cy={788} rx={380} ry={14} fill="#1a1208" opacity={0.3}/>
      <rect x={170} y={598} width={620} height={170} rx={14} fill="#4a5a6c" stroke="#2b3744" strokeWidth={3}/>
      <rect x={170} y={598} width={620} height={26} rx={12} fill="#6a7e94"/>
      <rect x={190} y={650} width={230} height={90} rx={8} fill="#2b3744"/>
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={214 + i * 50} cy={694} r={14} fill="#c24a3a" stroke="#6c1c14" strokeWidth={2}/>)}
      <rect x={436} y={654} width={170} height={20} rx={6} fill="#162028"/>
      <rect x={436} y={684} width={170} height={20} rx={6} fill="#162028"/>
      <path d="M620,652 h130 v100 h-130 Z" fill="#8a2f26" stroke="#5a1710" strokeWidth={2.4}/>
      <text x={685} y={712} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing={3} fill="#f6d9d4" opacity={0.85}>PRESS</text>
      {/* two rollers on top with a sheet between them */}
      {[300, 440].map((cx, i) => (
        <g key={i} transform={`translate(${cx} 556)`}>
          <circle r={64} fill="#9aa8b6" stroke="#566472" strokeWidth={3}/>
          <circle r={64} fill="none" stroke="#e8eef4" strokeWidth={5} strokeDasharray="22 220" strokeDashoffset={-spin * (i ? -1 : 1)} opacity={0.8}/>
          <g transform={`rotate(${spin * (i ? -1 : 1)})`}>{[0, 1, 2, 3, 4, 5].map((k) => <path key={k} d="M0,-14 L0,-60" stroke="#566472" strokeWidth={5} transform={`rotate(${k * 60})`} strokeLinecap="round"/>)}</g>
          <circle r={18} fill="#6a7886" stroke="#3a4652" strokeWidth={3}/>
        </g>
      ))}
      <path d="M200,500 C300,500 330,560 370,556 S470,590 600,640" fill="none" stroke="#f6f0dc" strokeWidth={10} strokeLinecap="round" opacity={0.9}/>
      {/* conveyor and notes emerging */}
      <rect x={560} y={742} width={300} height={16} rx={8} fill="#3a4652"/>
      {Array.from({length: 4}, (_, i) => { const u = ((f * 0.012 + i * 0.25) % 1), x = 640 + u * 270, y = 724 - Math.sin(Math.min(1, u * 1.2) * Math.PI) * 4;
        return <g key={i} transform={`translate(${x} ${y}) rotate(${-4 + u * 6})`} opacity={Math.min(1, u * 8) * (1 - Math.max(0, u - 0.9) * 10)}><Note id={`pmn${i}`} w={120} h={58} tone="teal" shadow={false} gloss={0}/></g>; })}
      {/* the glass wall */}
      <defs><linearGradient id="pm-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#dff1fb" stopOpacity="0.36"/><stop offset="0.5" stopColor="#bcd9ea" stopOpacity="0.14"/><stop offset="1" stopColor="#e4f4fc" stopOpacity="0.3"/></linearGradient></defs>
      <rect x={150} y={470} width={660} height={310} rx={10} fill="url(#pm-glass)" stroke="#8fb0c6" strokeWidth={5}/>
      <path d="M480,470 V780" stroke="#8fb0c6" strokeWidth={5}/>
      <path d="M190,770 L330,480 L372,480 L232,770 Z" fill="#fff" opacity={0.22}/>
      <path d="M560,770 L690,480 L716,480 L586,770 Z" fill="#fff" opacity={0.16}/>
      <rect x={150} y={470} width={660} height={14} rx={6} fill="#6c8aa0"/>
    </g>
  );
};

const MintSide: React.FC<{f: number; a: number; glow: number}> = ({f, a, glow}) => {
  const P = 56, c = (f / P) % 1;
  const down = eio(prog(c, 0.1, 0.3)) * (1 - eio(prog(c, 0.5, 0.25))), hit = c > 0.37 && c < 0.55 ? 1 - Math.abs(c - 0.44) / 0.1 : 0;
  const dieY = 560 + down * 94;
  const fly = prog(c, 0.55, 0.42), cx = lerp(1360, 1618, fly), cy = 706 - Math.sin(fly * Math.PI) * 140 + (fly > 0.9 ? (fly - 0.9) * 120 : 0);
  return (
    <g opacity={a}>
      <Classical id="pm-gov" x={RX} y={440} w={470} h={262} text="GOVERNMENT OF INDIA" stone={["#f1e4c6", "#c9b184"]} cols={7} fri={0.17} glow={glow}/>
      <ellipse cx={RX} cy={788} rx={400} ry={14} fill="#1a1208" opacity={0.3}/>
      {/* stamping press */}
      <rect x={1160} y={738} width={250} height={40} rx={8} fill="#5a4a3a" stroke="#34281c" strokeWidth={3}/>
      <rect x={1230} y={470} width={92} height={274} fill="#6c5a46" stroke="#34281c" strokeWidth={3}/>
      <rect x={1240} y={480} width={16} height={256} fill="#a8927a" opacity={0.5}/>
      <path d="M1200,470 H1450 V560 H1322 V540 H1230 V560 H1200 Z" fill="#7a6650" stroke="#34281c" strokeWidth={3} opacity={0}/>
      <rect x={1180} y={452} width={270} height={74} rx={12} fill="#7a6650" stroke="#34281c" strokeWidth={3}/>
      <rect x={1180} y={452} width={270} height={14} rx={7} fill="#a8927a"/>
      <circle cx={1415} cy={489} r={15} fill="#c8921f" stroke="#6a4a10" strokeWidth={2.4}/>
      <rect x={1294} y={526} width={26} height={Math.max(4, dieY - 526)} fill="#8a8a92" stroke="#4a4a52" strokeWidth={2}/>
      <rect x={1270} y={dieY} width={74} height={34} rx={6} fill="#b8b8c2" stroke="#4a4a52" strokeWidth={3}/>
      <rect x={1278} y={dieY + 6} width={58} height={8} rx={4} fill="#fff" opacity={0.45}/>
      <rect x={1262} y={706} width={90} height={32} rx={8} fill="#8a8a92" stroke="#4a4a52" strokeWidth={3}/>
      <g transform={`translate(1307 ${700 + (hit > 0 ? 3 : 0)})`} opacity={fly > 0 ? 0 : 1}><Coin id="pmc0" r={26} shadow={false}/></g>
      {hit > 0.1 && <g opacity={hit}><circle cx={1307} cy={706} r={44 + (1 - hit) * 30} fill="url(#ak-sunglow)"/>{[0, 1, 2, 3, 4, 5].map((k) => <path key={k} d="M0,-30 L0,-52" stroke="#ffe08a" strokeWidth={5} strokeLinecap="round" transform={`translate(1307 706) rotate(${k * 60 + 20})`}/>)}</g>}
      {fly > 0 && fly < 1 && <g transform={`translate(${cx} ${cy}) rotate(${fly * 540})`}><Coin id="pmc1" r={26}/></g>}
      {/* coin tray */}
      <path d="M1520,742 H1740 L1712,780 H1548 Z" fill="#7a5a36" stroke="#4e361c" strokeWidth={3}/>
      <rect x={1520} y={730} width={220} height={16} rx={6} fill="#a07a48" stroke="#4e361c" strokeWidth={2}/>
      {Array.from({length: 11}, (_, i) => <g key={i} transform={`translate(${1548 + (i % 6) * 32 + (i > 5 ? 16 : 0)} ${728 - (i > 5 ? 20 : 0)})`}><Coin id={`pmt${i}`} r={17} rot={i * 23} shadow={false}/></g>)}
    </g>
  );
};

export const PressMintArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), a0 = eo(prog(f, 0, 24));
  const gl = (t: number) => eo(prog(f, t, 24)) * (0.55 + 0.25 * Math.sin(f / 9));
  return (
    <g>
      <Defs/>
      <defs>
        <linearGradient id="pm-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#efe4cb"/><stop offset="1" stopColor="#dccaa4"/></linearGradient>
        <linearGradient id="pm-pl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dde4ea"/><stop offset="1" stopColor="#bcc7d2"/></linearGradient>
        <linearGradient id="pm-pr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f2e6c8"/><stop offset="1" stopColor="#dac394"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#pm-bg)"/>
      <Spot id="pm-sp" cx={960} cy={300} rx={1000} ry={460} a={0.5}/>
      <g opacity={a0}>
        <rect x={96} y={186} width={834} height={620} rx={28} fill="url(#pm-pl)" stroke="#8aa0b4" strokeWidth={3} filter="url(#e3-sh)"/>
        <rect x={990} y={186} width={834} height={620} rx={28} fill="url(#pm-pr)" stroke="#b49a68" strokeWidth={3} filter="url(#e3-sh)"/>
        <path d="M96,780 H930 M990,780 H1824" stroke="#000" strokeWidth={0}/>
        <rect x={96} y={776} width={834} height={30} rx={0} fill="#9fb0c0" opacity={0.7}/>
        <rect x={990} y={776} width={834} height={30} fill="#c8ac78" opacity={0.7}/>
        <path d="M930,186 H990 V806 H930 Z" fill="#6a5a44" opacity={0.18}/>
      </g>
      <g clipPath="none"><PressSide f={f} a={a0} glow={gl(L.rb.at)}/><MintSide f={f} a={a0} glow={gl(L.co.at)}/></g>
      <Specks f={f} n={14} seed={2} x0={120} x1={1800} y0={220} y1={760}/>
    </g>
  );
};
export const PressMintLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return <>
    <P2Card cx={LX} y={68} text={L.rb.text} f={p.f} at={L.rb.at} size={32} upper={false} maxW={680}/>
    <P2Card cx={LX} y={820} text={L.s2.text} f={p.f} at={L.s2.at} size={32} upper={false} tone="cool" maxW={640}/>
    <P2Card cx={RX} y={68} text={L.co.text} f={p.f} at={L.co.at} size={32} upper={false} maxW={680}/>
    <P2Card cx={RX} y={820} text={L.cn.text} f={p.f} at={L.cn.at} size={32} upper={false} tone="cool" maxW={640}/>
  </>;
};

// ---- fiat-note ------------------------------------------------------------------------------------------------------------------
const FN = {x: 760, y: 650, w: 820, h: 380, tilt: -3, squash: 0.68};
const STAMP_REST: [number, number] = [980, 640], STAMP_UP: [number, number] = [1390, 430];

const Stamp: React.FC<{x: number; y: number; rot: number}> = ({x, y, rot}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} filter="url(#e3-sh)">
    <ellipse cx={0} cy={4} rx={74} ry={16} fill="#7a1f14" stroke="#4a0f08" strokeWidth={2}/>
    <path d="M-72,0 Q-72,-14 -58,-16 H58 Q72,-14 72,0 Q72,16 58,18 H-58 Q-72,16 -72,0 Z" fill="#c24a3a" stroke="#6c1c14" strokeWidth={2.4}/>
    <path d={starPath(30)} transform="translate(0 2) scale(1.6 0.6)" fill="#f6d9a0" opacity={0.8}/>
    <rect x={-26} y={-52} width={52} height={38} fill="#d2a24a" stroke="#6a4a10" strokeWidth={2.4}/>
    <rect x={-20} y={-52} width={9} height={38} fill="#fff0b0" opacity={0.6}/>
    <path d="M-30,-52 Q-48,-100 -26,-124 Q0,-142 26,-124 Q48,-100 30,-52 Z" fill="#9a5a2a" stroke="#4e2a10" strokeWidth={2.6}/>
    <path d="M-20,-60 Q-34,-100 -16,-118" fill="none" stroke="#e8b078" strokeWidth={7} strokeLinecap="round" opacity={0.65}/>
  </g>
);

export const FiatNoteArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), tn = L.nv.at, tg = L.gu.at;
  const lift = eio(prog(f, Math.max(6, tn - 30), 34)), back = eio(prog(f, tg - 34, 28));
  const hold = lift * (1 - back), exit = eo(prog(f, tg + 6, 34));
  const drain = eo(prog(f, Math.max(6, tn - 30) + 14, 26)), ret = eo(prog(f, tg - 6, 24));
  const sat = 1 - drain * (1 - ret);
  const sx = lerp(STAMP_REST[0], STAMP_UP[0], hold), sy = lerp(STAMP_REST[1], STAMP_UP[1], hold) - Math.sin(hold * Math.PI) * 30 + Math.sin(f / 5) * 2 * hold, srot = -6 * hold;
  const dim = (1 - sat) * 0.4;
  return (
    <g>
      <Defs/>
      <defs>
        <linearGradient id="fn-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b2536"/><stop offset="1" stopColor="#2b3447"/></linearGradient>
        <linearGradient id="fn-cone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe6a8" stopOpacity="0.7"/><stop offset="1" stopColor="#ffe6a8" stopOpacity="0.05"/></linearGradient>
        <radialGradient id="fn-pool"><stop offset="0" stopColor="#ffe8b0" stopOpacity="0.8"/><stop offset="1" stopColor="#ffe8b0" stopOpacity="0"/></radialGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#fn-wall)"/>
      <rect x={-60} y={440} width={W + 120} height={700} fill="#3a2a1c"/>
      <Counter id="fn" y0={440} dark/>
      <ellipse cx={FN.x + 40} cy={FN.y + 20} rx={720} ry={250} fill="url(#fn-pool)"/>
      {/* the desk lamp */}
      <g>
        <ellipse cx={300} cy={560} rx={120} ry={20} fill="#0a0604" opacity={0.5}/>
        <path d="M230,552 Q300,516 370,552 L350,566 H250 Z" fill="#3c4650" stroke="#1c242c" strokeWidth={3}/>
        <path d="M300,540 L250,360 L370,170" fill="none" stroke="#56626e" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M300,540 L250,360 L370,170" fill="none" stroke="#8a98a6" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" transform="translate(-3 -2)"/>
        <circle cx={250} cy={360} r={13} fill="#6a7886" stroke="#1c242c" strokeWidth={3}/>
        <path d="M312,128 L452,190 L402,248 L330,214 Z" fill="#c8a24a" stroke="#6a4a10" strokeWidth={3} transform="rotate(8 370 190)"/>
        <path d="M322,138 L430,186" stroke="#fff0b0" strokeWidth={5} strokeLinecap="round" opacity={0.7} transform="rotate(8 370 190)"/>
        <path d="M420,230 L1120,740 L420,740 Z" fill="url(#fn-cone)" opacity={0.0}/>
        <path d="M415,216 L1180,700 L520,760 Z" fill="url(#fn-cone)" opacity={0.55}/>
        <circle cx={420} cy={228} r={30} fill="url(#ak-sunglow)"/>
      </g>
      {/* the note, lying under the light */}
      <g transform={`translate(${FN.x} ${FN.y}) rotate(${FN.tilt}) scale(1 ${FN.squash})`}>
        <Note id="fn" w={FN.w} h={FN.h} tone="teal" sat={sat} f={f} gloss={sat}/>
        <rect x={-FN.w / 2} y={-FN.h / 2} width={FN.w} height={FN.h} rx={FN.h * 0.09} fill="#10161f" opacity={dim * 0.5}/>
      </g>
      <g transform={`translate(${sx} ${sy + 6}) scale(1.9) translate(${-sx} ${-(sy + 6)})`}><Stamp x={sx} y={sy + 6} rot={srot}/></g>
      <Hand id="fnh" tipX={sx + 4} tipY={sy - 150} ang={-30} len={520} s={1.5} op={1 - exit} skin={["#c68f64", "#94603c"]} sleeve={["#7a9a8a", "#4a6a5a"]}/>
    </g>
  );
};
export const FiatNoteLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return <>
    <P2Card cx={860} y={70} text={L.nv.text} f={p.f} at={L.nv.at} size={40} maxW={1000}/>
    <P2Card cx={760} y={812} text={L.gu.text} f={p.f} at={L.gu.at} size={36} upper={false} maxW={800}/>
    <P2Card cx={1500} y={520} text={L.fm.text} f={p.f} at={L.fm.at} size={52} tone="green" maxW={520}/>
  </>;
};

// ---- promise-note ---------------------------------------------------------------------------------------------------------------
const BIG: [number, number] = [1060, 520], STAGES: [number, number][] = [[900, 520], [1260, 500], [1590, 540]];
const BW = 900, BH = 430, SMALL = 0.5;

export const PromiseNoteArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), tA = L.pr.at, tB = L.ob.at;
  const t0 = tA + 14, t1 = Math.max(t0 + 60, tB - 4), span = t1 - t0;
  const posAt = (ff: number): {x: number; y: number; k: number; stage: number} => {
    const u = prog(ff, t0, span), sh = eio(prog(u, 0, 0.26)), h1 = eio(prog(u, 0.38, 0.2)), h2 = eio(prog(u, 0.68, 0.2));
    let x = lerp(BIG[0], STAGES[0][0], sh), y = lerp(BIG[1], STAGES[0][1], sh);
    if (h1 > 0) { x = lerp(STAGES[0][0], STAGES[1][0], h1); y = lerp(STAGES[0][1], STAGES[1][1], h1) - Math.sin(h1 * Math.PI) * 90; }
    if (h2 > 0) { x = lerp(STAGES[1][0], STAGES[2][0], h2); y = lerp(STAGES[1][1], STAGES[2][1], h2) - Math.sin(h2 * Math.PI) * 90; }
    return {x, y, k: lerp(1, SMALL, sh), stage: h2 > 0.5 ? 2 : h1 > 0.5 ? 1 : 0};
  };
  const now = posAt(f), a0 = eo(prog(f, 0, 22)), pulse = 0.6 + 0.4 * Math.sin(f / 5);
  const lit = eo(prog(f, tB - 6, 30));
  const rev = eo(prog(f, tB, 44));
  const holdA = (idx: number) => { const near = Math.max(0, 1 - Math.abs(now.x - STAGES[idx][0]) / 360); return near; };
  const strip = (
    <g>
      <rect x={-BW * 0.45} y={BH * 0.2} width={BW * 0.9} height={BH * 0.17} rx={BH * 0.03} fill="#fff6d8" opacity={0.96} stroke="#d8a23a" strokeWidth={3}/>
      <text x={0} y={BH * 0.2 + BH * 0.115} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={BW * 0.036} letterSpacing={BW * 0.006} fill="#6a3a10">I PROMISE TO PAY THE BEARER</text>
    </g>
  );
  const ghosts = [1, 2, 3, 4, 5, 6].map((j) => ({j, ...posAt(Math.max(0, f - j * 3.2))}));
  return (
    <g>
      <Defs/>
      <Plaza id="pn" ground={640} f={f}/>
      <Spot id="pn-sp" cx={1060} cy={520} rx={760} ry={420} a={0.5}/>
      {[[760, 0], [1180, 1], [1420, 2], [1700, 3], [1850, 4]].map(([x, i]) => <Person key={i} x={x} y={640 + (i % 2) * 14} h={150 - (i % 2) * 12} f={f} seed={30 + i} walk ph={i * 9} op={0.9}/>)}
      {/* the Reserve Bank, pale until the end */}
      <g filter={lit < 1 ? undefined : undefined}>
        <Classical id="pn-rbi" x={340} y={640} w={470} h={290} text="RESERVE BANK" stone={["#e8ecf0", "#b3bcc8"]} cols={6} fri={0.15} a={0.55 + 0.45 * lit} glow={lit * (0.5 + 0.2 * Math.sin(f / 8))}/>
      </g>
      {/* glow trail following the strip, hand to hand */}
      {ghosts.map(({j, x, y, k}) => <g key={j} transform={`translate(${x} ${y + BH * 0.285 * k})`} opacity={(0.5 - j * 0.07) * Math.min(1, prog(f, t0, 10) * 2)}><rect x={-BW * 0.45 * k} y={-BH * 0.1 * k} width={BW * 0.9 * k} height={BH * 0.2 * k} rx={14} fill="#ffd36a" filter="url(#e3-glow-s)"/></g>)}
      <g transform={`translate(${now.x} ${now.y}) scale(${now.k * a0}) rotate(${Math.sin(f / 30) * 1.2})`}>
        <rect x={-BW * 0.52} y={BH * 0.1} width={BW * 1.04} height={BH * 0.34} rx={30} fill="#ffd36a" opacity={0.55 * pulse} filter="url(#e3-glow)"/>
        <Note id="pnn" w={BW} h={BH} tone="blue" f={f} strip={strip} gloss={0.5}/>
      </g>
      {/* hands at the three places: they rise as the note arrives and sink once it has gone */}
      {STAGES.map(([sx, sy], i) => {
        const near = Math.max(0, 1 - Math.abs(now.x - sx) / 300) * eo(prog(1 - now.k, 0, 0.35)), op = eo(Math.min(1, near * 1.6)), sk: [string, string][] = [["#d8a47a", "#a8754f"], ["#a9744a", "#7a4a2c"], ["#e0b48a", "#b9835a"]], sl: [string, string][] = [["#c0603d", "#8c3a22"], ["#e8dcc4", "#b8a888"], ["#6c8fb5", "#41607f"]];
        const nw = BW * SMALL / 2 - 40, nb = BH * SMALL / 2 - 16, lift = (1 - op) * 140;
        return op > 0.01 ? <g key={i}>
          <Hand id={`pnh${i}a`} tipX={sx - nw} tipY={sy + nb + lift} ang={90} len={420} s={1.05} skin={sk[i]} sleeve={sl[i]} op={op}/>
          <Hand id={`pnh${i}b`} tipX={sx + nw} tipY={sy + nb + lift} ang={90} len={420} s={1.05} skin={sk[(i + 1) % 3]} sleeve={sl[(i + 1) % 3]} op={op}/>
        </g> : null;
      })}
      {/* the glow runs back to the building */}
      <FlowArrow pts={[[now.x - 80, now.y - 120], [now.x - 480, now.y - 220], [850, 300], [560, 350]]} f={f} p={rev} w={22} c1="#f2b84a" c2="#ffe9a0" dark="#9a5a10" op={rev > 0 ? 1 : 0}/>
    </g>
  );
};
export const PromiseNoteLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return <>
    <P2Card cx={1060} y={70} text={L.pr.text} f={p.f} at={L.pr.at} size={46} upper={false} maxW={1000}/>
    <P2Card cx={340} y={640} text={L.ob.text} f={p.f} at={L.ob.at} size={30} upper={false} maxW={430}/>
    <P2Card cx={340} y={822} text={L.s6.text} f={p.f} at={L.s6.at} size={32} upper={false} tone="cool" maxW={440}/>
  </>;
};

// ---- deposit-money --------------------------------------------------------------------------------------------------------------
const DBASE = 700, CASH_X = 620, BAR_X0 = 960, BAR_X1 = 1260;

const CashStack: React.FC<{x: number; y: number; n: number; a: number}> = ({x, y, n, a}) => {
  if (a <= 0.001) return null;
  const r = rng(11), cnt = Math.max(1, Math.round(n));
  return (
    <g opacity={a} transform={`translate(${x} ${y})`}>
      <ellipse cx={14} cy={4} rx={160} ry={16} fill="#2a1808" opacity={0.35}/>
      {Array.from({length: cnt}, (_, i) => <g key={i} transform={`translate(${(r() - 0.5) * 16} ${-62 - i * 24}) rotate(${(r() - 0.5) * 3})`}><Note id={`dmn${i}`} w={250} h={118} tone={i % 2 ? "teal" : "olive"} shadow={false} gloss={0}/></g>)}
      <rect x={-34} y={-62 - (cnt - 1) * 24 - 59} width={68} height={cnt * 24 + 118 - 24 + 24} rx={4} fill="#f2e2b4" stroke="#b9954a" strokeWidth={2.4} opacity={0.0}/>
    </g>
  );
};

export const DepositMoneyArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), td = L.dm.at, tc = L.cd.at;
  const a0 = eo(prog(f, 0, 24)), slide = eio(prog(f, td - 26, 36)), bx = lerp(BAR_X0, BAR_X1, slide);
  const w = prog(f, td + 10, 64), level = lerp(0.78, 0.5, eio(prog(w, 0, 0.8)));
  const stackA = eo(prog(f, td + 6, 22)), stackN = lerp(2, 7, eio(prog(w, 0.2, 0.8)));
  const arc: [number, number][] = [[bx - 70, 420], [900, 300], [760, 350], [CASH_X + 40, 440]];
  const q = (u: number): [number, number] => { const [a, b, c, d] = [arc[0], arc[1], arc[2], arc[3]], m = 1 - u; return [m * m * m * a[0] + 3 * m * m * u * b[0] + 3 * m * u * u * c[0] + u * u * u * d[0], m * m * m * a[1] + 3 * m * m * u * b[1] + 3 * m * u * u * c[1] + u * u * u * d[1]]; };
  const plusA = eo(prog(f, tc, 20));
  return (
    <g>
      <Defs/>
      <defs>
        <linearGradient id="dm-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3e7cc"/><stop offset="1" stopColor="#e2cfa4"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={DBASE + 80} fill="url(#dm-wall)"/>
      {/* arched bank windows and a column row behind */}
      {[0, 1, 2, 3, 4, 5].map((i) => <g key={i} transform={`translate(${200 + i * 300} 150)`} opacity={0.75}><path d="M-80,520 V150 A80,80 0 0 1 80,150 V520 Z" fill="#cfe2ea" stroke="#b79a68" strokeWidth={4}/><path d="M0,70 V520 M-80,300 H80" stroke="#b79a68" strokeWidth={3}/><path d="M-60,520 V160 A60,60 0 0 1 60,160" fill="none" stroke="#fff" strokeWidth={5} opacity={0.4}/></g>)}
      <rect x={-60} y={DBASE - 130} width={W + 120} height={130} fill="#c9ad7a" opacity={0.6}/>
      <Spot id="dm-sp" cx={960} cy={400} rx={800} ry={420} a={0.45}/>
      <Counter id="dm" y0={DBASE}/>
      <g opacity={a0}>
        <BalanceBar id="dmb" x={bx} y={DBASE} w={190} h={360} level={level} f={f} a={1}/>
        {/* the bank card against the bar */}
        <g transform={`translate(${bx + 120} ${DBASE - 70}) rotate(-8)`} filter="url(#e3-sh-s)">
          <rect x={-100} y={-63} width={200} height={126} rx={14} fill="#234a78" stroke="#13304f" strokeWidth={2.4}/>
          <rect x={-100} y={-34} width={200} height={26} fill="#0d1e33"/>
          <rect x={-78} y={4} width={44} height={34} rx={6} fill="#e8c46a" stroke="#8a6a1a" strokeWidth={1.6}/>
          <path d="M-78,21 h44 M-56,4 v34" stroke="#8a6a1a" strokeWidth={1.2}/>
          <text x={96} y={50} textAnchor="end" fontFamily={SANS} fontWeight={800} fontSize={17} letterSpacing={4} fill="#cfe2f6">BANK</text>
          <path d="M-100,-63 H20 L-20,63 H-100 Z" fill="#fff" opacity={0.08}/>
        </g>
      </g>
      {/* cash stack */}
      <CashStack x={CASH_X} y={DBASE} n={stackN} a={stackA}/>
      {/* withdraw arrow, with notes riding it */}
      {w > 0.02 && <FlowArrow pts={arc} f={f} p={eo(prog(w, 0, 0.45))} w={20} c1="#e8a23a" c2="#ffe9a0" dark="#7a4a10" op={1 - eo(prog(f, tc + 14, 26)) * 0.7}/>}
      {w > 0.05 && w < 0.95 && [0, 1, 2].map((i) => { const u = prog(w, 0.1 + i * 0.16, 0.34), [x, y] = q(u); return u > 0 && u < 1 ? <g key={i} transform={`translate(${x} ${y}) rotate(${-20 + u * 40}) scale(0.5)`}><Note id={`dmf${i}`} w={200} h={96} tone="olive" shadow={false} gloss={0}/></g> : null; })}
      {/* plaques and the plus */}
      <Tag x={CASH_X} y={DBASE + 50} text="CURRENCY" a={eo(prog(f, tc + 4, 18))} size={26}/>
      <Tag x={bx} y={DBASE + 50} text="DEPOSITS" a={eo(prog(f, tc + 12, 18))} size={26}/>
      <Plus x={(CASH_X + bx) / 2 + 10} y={DBASE - 160} s={1.5} a={plusA} f={f}/>
    </g>
  );
};
export const DepositMoneyLabels: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), td = L.dm.at, bx = lerp(BAR_X0, BAR_X1, eio(prog(f, td - 26, 36)));
  return <>
    <P2Card cx={bx} y={84} text={L.bk.text} f={f} at={L.bk.at} size={38} maxW={760}/>
    <P2Card cx={620} y={190} text={L.dm.text} f={f} at={L.dm.at} size={36} upper={false} tone="cool" maxW={520}/>
    <P2Card cx={(CASH_X + BAR_X1) / 2} y={800} text={L.cd.text} f={f} at={L.cd.at} size={46} tone="green" maxW={900}/>
  </>;
};
