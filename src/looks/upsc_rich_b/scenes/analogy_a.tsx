// Look B analogy art, part A: heat-rates, column, rooms, gradient. Same logic as the cartoon scenes (labels only from at(key)), drawn as rich daylight illustration.
import React from "react";
import {Girl} from "../girl";
import {SERIF, W, H, clamp, eio, eo, rng} from "../kit";
import {Cloud, FlowArrow, Frame, Hills, LabelCard, Person, Shimmer, Sun, Tree, lerp, prog, type AP, type Pt} from "./analogy_kit";

const lab = (p: AP, i: number) => { const l = p.spec.labels?.[i]; return l ? {text: l.text, at: p.at(l.key)} : null; };
const Sky: React.FC<{id: string; a: string; b: string; h?: number}> = ({id, a, b, h = H}) => (
  <g><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a}/><stop offset="1" stopColor={b}/></linearGradient></defs><rect x={-60} y={-60} width={W + 120} height={h + 60} fill={`url(#${id})`}/></g>
);

// ---- heat-rates -------------------------------------------------------------------------------------------------------------
const Thermo: React.FC<{cx: number; level: number; f: number; id: string}> = ({cx, level, f, id}) => {
  const top = 262, bulb = 676, tw = 52, fy = bulb - (bulb - top - 36) * level;
  return (
    <g transform={`translate(${cx} 0)`} style={{filter: "drop-shadow(10px 12px 10px rgba(40,22,8,.32))"}}>
      <defs>
        <linearGradient id={`${id}-glass`} x1="0" x2="1"><stop offset="0" stopColor="#ffffff" stopOpacity="0.95"/><stop offset="0.5" stopColor="#e9f1f6" stopOpacity="0.75"/><stop offset="1" stopColor="#b7c8d6" stopOpacity="0.85"/></linearGradient>
        <linearGradient id={`${id}-hg`} x1="0" x2="1"><stop offset="0" stopColor="#ff7a55"/><stop offset="0.45" stopColor="#d8301c"/><stop offset="1" stopColor="#8f1a10"/></linearGradient>
      </defs>
      <rect x={-tw / 2 - 4} y={top - 6} width={tw + 8} height={bulb - top + 18} rx={tw / 2 + 4} fill="#6b7e8f" opacity={0.55}/>
      <circle cx={0} cy={bulb + 22} r={50} fill="#6b7e8f" opacity={0.55}/>
      <rect x={-tw / 2} y={top} width={tw} height={bulb - top + 22} rx={tw / 2} fill={`url(#${id}-glass)`}/>
      <circle cx={0} cy={bulb + 22} r={44} fill={`url(#${id}-glass)`}/>
      <circle cx={0} cy={bulb + 22} r={36} fill={`url(#${id}-hg)`}/>
      <rect x={-12} y={fy} width={24} height={bulb + 22 - fy} fill={`url(#${id}-hg)`}/>
      <ellipse cx={0} cy={fy} rx={12} ry={7} fill="#ff8a66"/>
      <ellipse cx={-14} cy={bulb + 10} rx={8} ry={12} fill="#fff" opacity={0.5}/>
      <rect x={-tw / 2 + 5} y={top + 14} width={7} height={bulb - top - 40} rx={3.5} fill="#fff" opacity={0.7}/>
      {Array.from({length: 11}, (_, i) => <line key={i} x1={tw / 2 + 6} x2={tw / 2 + (i % 2 ? 22 : 38)} y1={top + 40 + i * 36} y2={top + 40 + i * 36} stroke="#5d6e7d" strokeWidth={i % 2 ? 2.5 : 3.5} strokeLinecap="round"/>)}
      <circle cx={0} cy={fy - 14 - 12 * Math.sin(f / 7)} r={3} fill="#ff8a66" opacity={level > 0.5 ? 0.0 : 0}/>
    </g>
  );
};

const Heat: React.FC<AP> = (p) => {
  const {f, spec} = p, a = lab(p, 0), b = lab(p, 1);
  const land = eio(prog(f, 4, 66)) * 0.78 + 0.08 + Math.sin(f / 9) * 0.004, water = eio(prog(f, 6, 142)) * 0.26 + 0.08 + Math.sin(f / 13) * 0.003;
  void spec;
  const xl = 520, xw = 1400;
  return (
    <g>
      <Sky id="ak-h-sky" a="#8fc4e8" b="#fbe9c2"/>
      <Sun x={960} y={168} r={62} f={f}/>
      <Cloud x={120} y={250} s={0.8} f={f} speed={0.25} seed={2}/><Cloud x={1250} y={330} s={0.7} f={f} speed={0.2} seed={3} a={0.8}/>
      <Hills id="ak-h-h1" base={640} amp={120} top="#b8cfe2" bottom="#d6e0e4" seed={1.4}/>
      <Hills id="ak-h-h2" base={700} amp={80} top="#9fbfae" bottom="#c8d6b8" seed={4.2} wl={300}/>
      {/* warm light falling from the sun */}
      <path d={`M860,210 L${xl - 280},800 L${xl + 280},800 L1060,210 Z`} fill="#ffe3a0" opacity={0.16} style={{mixBlendMode: "screen"}}/>
      {/* table */}
      <defs><linearGradient id="ak-h-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c99a62"/><stop offset="1" stopColor="#8a5a30"/></linearGradient></defs>
      <rect x={-40} y={856} width={W + 80} height={300} fill="url(#ak-h-wood)"/>
      {Array.from({length: 7}, (_, i) => <path key={i} d={`M-40,${886 + i * 36} Q960,${878 + i * 36 + (i % 2) * 6} 1960,${886 + i * 36}`} stroke="#6e4524" strokeWidth={1.6} fill="none" opacity={0.5}/>)}
      <rect x={-40} y={852} width={W + 80} height={8} fill="#e8c690" opacity={0.7}/>
      <g transform="translate(0 56)">
      {/* land block: dry earth with a cracked top */}
      <g>
        <ellipse cx={xl + 24} cy={822} rx={330} ry={26} fill="#2a1808" opacity={0.28}/>
        <defs>
          <linearGradient id="ak-h-soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9ad66"/><stop offset="0.55" stopColor="#b57f3e"/><stop offset="1" stopColor="#7e4f24"/></linearGradient>
          <linearGradient id="ak-h-top" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f2d493"/><stop offset="1" stopColor="#d9a95b"/></linearGradient>
        </defs>
        <path d={`M${xl - 272},706 L${xl - 200},664 L${xl + 330},664 L${xl + 272},706 Z`} fill="url(#ak-h-top)" stroke="#8a5a2a" strokeWidth={1.4}/>
        <rect x={xl - 272} y={706} width={544} height={110} fill="url(#ak-h-soil)" stroke="#6b4220" strokeWidth={1.6}/>
        <path d={`M${xl + 272},706 L${xl + 330},664 L${xl + 330},774 L${xl + 272},816 Z`} fill="#8a5a2c" stroke="#6b4220" strokeWidth={1.4}/>
        {[0, 1, 2, 3, 4, 5].map((i) => <ellipse key={i} cx={xl - 220 + i * 90} cy={742 + (i % 3) * 22} rx={14 + (i % 2) * 8} ry={7 + (i % 2) * 3} fill={i % 2 ? "#9b6a33" : "#e0b872"} opacity={0.8}/>)}
        <path d={`M${xl - 90},700 l20,-14 l-8,-14 M${xl + 80},696 l-18,-10 l10,-16 M${xl - 170},690 l14,-8`} stroke="#8a5a2a" strokeWidth={2} fill="none" strokeLinecap="round"/>
        <path d={`M${xl - 272},728 H${xl + 272} M${xl - 272},768 H${xl + 272}`} stroke="#6b4220" strokeWidth={1.2} opacity={0.4}/>
      </g>
      {/* water block: a glass tank */}
      <g>
        <ellipse cx={xw + 24} cy={822} rx={330} ry={26} fill="#2a1808" opacity={0.28}/>
        <defs>
          <linearGradient id="ak-h-wat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5fb8e6"/><stop offset="1" stopColor="#1f6ea8"/></linearGradient>
          <linearGradient id="ak-h-watTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a8e0f5"/><stop offset="1" stopColor="#5fb2dc"/></linearGradient>
        </defs>
        <path d={`M${xw - 272},706 L${xw - 200},664 L${xw + 330},664 L${xw + 272},706 Z`} fill="url(#ak-h-watTop)" stroke="#2b6b95" strokeWidth={1.4}/>
        <rect x={xw - 272} y={706} width={544} height={110} fill="url(#ak-h-wat)" stroke="#1b5580" strokeWidth={1.6}/>
        <path d={`M${xw + 272},706 L${xw + 330},664 L${xw + 330},774 L${xw + 272},816 Z`} fill="#2f84b8" opacity={0.85} stroke="#1b5580" strokeWidth={1.4}/>
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${xw - 250 + i * 140},${730 + (i % 2) * 24 + Math.sin(f / 10 + i) * 3} q35,-16 70,0 q35,16 70,0`} fill="none" stroke="#e9f8ff" strokeWidth={4} strokeLinecap="round" opacity={0.65}/>)}
        {[0, 1, 2, 3, 4].map((i) => { const u = (f * 0.01 + i * 0.2) % 1; return <circle key={i} cx={xw - 200 + i * 100 + Math.sin(u * 8 + i) * 10} cy={800 - u * 90} r={4 + (i % 3) * 2} fill="#e9f8ff" opacity={0.5 * (1 - u)}/>; })}
        <path d={`M${xw - 272},706 L${xw - 200},664 L${xw - 180},676 L${xw - 250},712 Z`} fill="#fff" opacity={0.35}/>
        <rect x={xw - 262} y={712} width={16} height={96} fill="#fff" opacity={0.26}/>
        {[0, 1, 2].map((i) => <ellipse key={i} cx={xw - 80 + i * 150 + Math.sin(f / 18 + i) * 12} cy={676 + (i % 2) * 4} rx={46} ry={5} fill="#fff" opacity={0.3}/>)}
      </g>
      <Thermo cx={xl} level={land} f={f} id="ak-h-t1"/>
      <Thermo cx={xw} level={water} f={f} id="ak-h-t2"/>
      {[0, 1, 2, 3, 4].map((i) => <Shimmer key={i} x={xl - 180 + i * 90} y={650} hgt={150} f={f} k={i * 0.2} col="#d8481f" w={5}/>)}
      <FlowArrow pts={[[xl + 120, 640], [xl + 126, 500], [xl + 120, 340]]} f={f} p={eo(prog(f, 8, 26)) * (1 - eo(prog(f, 60, 14)))} w={22} c1="#e8482a" c2="#ff9a6a" speed={2.6}/>
      <FlowArrow pts={[[xw + 120, 640], [xw + 124, 590], [xw + 120, 540]]} f={f} p={eo(prog(f, 72, 30))} w={16} c1="#2f86da" c2="#7cc0f0" speed={0.7}/>
      </g>
    </g>
  );
};
const HeatLabels: React.FC<AP> = (p) => {
  const a = lab(p, 0), b = lab(p, 1);
  return <>{a && <LabelCard cx={520} y={120} text={a.text} f={p.f} at={a.at} size={42}/>}{b && <LabelCard cx={1400} y={120} text={b.text} f={p.f} at={b.at} size={42} tone="cool"/>}</>;
};

// ---- column --------------------------------------------------------------------------------------------------------------------
const Column: React.FC<AP> = (p) => {
  const {f} = p, cx = 640, feet = 868, gs = 0.64, headTop = feet - 540 * gs;
  const press = eo(prog(f, 6, 60)), sq = 1 - 0.018 * press + Math.sin(f / 10) * 0.0025;
  const r = rng(11), mol = Array.from({length: 84}, () => { const u = r(); return {x: r() - 0.5, y: 1 - u * u, ph: r() * 6.28, s: r()}; });
  const wCol = 350, yTop = -30, yBot = headTop + 26;
  return (
    <g>
      <Sky id="ak-c-sky" a="#6fa9de" b="#f6e8c6"/>
      <Sun x={1560} y={150} r={54} f={f}/>
      {[0, 1, 2, 3].map((i) => <Cloud key={i} x={80 + i * 560} y={120 + (i % 2) * 90} s={0.95} f={f} speed={0.2} seed={i + 1} a={0.88}/>)}
      <Hills id="ak-c-h1" base={640} amp={130} top="#b4cbe0" bottom="#d4dfdf" seed={0.6}/>
      <Hills id="ak-c-h2" base={720} amp={90} top="#8fb59a" bottom="#bdd2a4" seed={3} wl={310}/>
      {/* a village on the far hill */}
      {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${1130 + i * 90} ${664 - (i % 2) * 8})`}><rect x={-26} y={-30} width={52} height={30} fill={i % 2 ? "#e6d3b0" : "#d9a98a"}/><path d="M-32,-30 L0,-56 L32,-30 Z" fill="#b5533a"/><rect x={-6} y={-18} width={12} height={18} fill="#7a4a2c"/></g>)}
      <defs><linearGradient id="ak-c-grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fc760"/><stop offset="1" stopColor="#3f8a45"/></linearGradient></defs>
      <path d={`M-40,${800} Q500,${770} 960,${790} T1960,${780} L1960,1100 L-40,1100 Z`} fill="url(#ak-c-grass)"/>
      {Array.from({length: 46}, (_, i) => { const rr = rng(i * 7919 + 3); rr(); rr(); const x = rr() * W, y = 830 + rr() * 220, hh = 10 + rr() * 16; return <path key={i} d={`M${x},${y} q${Math.sin(f / 20 + i) * 3},${-hh / 2} ${Math.sin(f / 20 + i) * 6},${-hh}`} stroke={i % 3 ? "#2f7a3a" : "#b8e07a"} strokeWidth={2.4} strokeLinecap="round" fill="none"/>; })}
      <Tree x={1300} y={846} s={1.05} bend={1.5} f={f} seed={4}/>
      {[0, 1, 2, 3, 4, 5].map((i) => <g key={i} transform={`translate(${900 + i * 58} ${880 + (i % 3) * 22})`}><path d="M0,0 V-26" stroke="#2f7a3a" strokeWidth={2.4}/>{[0, 1, 2, 3, 4].map((k) => <ellipse key={k} cx={0} cy={-30} rx={4} ry={9} fill={i % 2 ? "#f4b942" : "#f6f0e6"} transform={`rotate(${k * 72} 0 -30) translate(0 -9)`}/>)}<circle cy={-30} r={4} fill="#d8482a"/></g>)}
      {/* the column of air */}
      <g opacity={eo(prog(f, 0, 16))}>
        <defs><linearGradient id="ak-c-col" x1="0" x2="1"><stop offset="0" stopColor="#3f78c2" stopOpacity="0.38"/><stop offset="0.5" stopColor="#8fc0ee" stopOpacity="0.18"/><stop offset="1" stopColor="#3f78c2" stopOpacity="0.38"/></linearGradient>
          <linearGradient id="ak-c-colv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity="0.5"/><stop offset="1" stopColor="#ffffff" stopOpacity="0"/></linearGradient></defs>
        <rect x={cx - wCol / 2} y={yTop} width={wCol} height={yBot - yTop} rx={26} fill="url(#ak-c-col)"/>
        <rect x={cx - wCol / 2} y={yTop} width={wCol} height={yBot - yTop} rx={26} fill="url(#ak-c-colv)" opacity={0.5}/>
        <rect x={cx - wCol / 2} y={yTop} width={wCol} height={yBot - yTop} rx={26} fill="none" stroke="#2f6fb5" strokeWidth={2.4} strokeDasharray="22 14" strokeDashoffset={-f * 0.7} opacity={0.8}/>
        {mol.map((m, i) => { const yy = yTop + 30 + m.y * (yBot - yTop - 60) + Math.cos(f / 11 + m.ph) * 6, xx = cx + m.x * (wCol - 60) + Math.sin(f / 13 + m.ph) * 8, rr = 5 + m.y * 5; return <circle key={i} cx={xx} cy={yy} r={rr} fill="#cfe6fb" stroke="#2f6fb5" strokeWidth={1.4} opacity={0.35 + 0.55 * m.y}/>; })}
        {[-1, 1].map((sd) => <FlowArrow key={sd} pts={[[cx + sd * (wCol / 2 + 62), 70], [cx + sd * (wCol / 2 + 62), 250], [cx + sd * (wCol / 2 + 62), headTop - 20]]} f={f} p={eo(prog(f, 8, 40))} w={20} c1="#2f78c8" c2="#8fc0ee" speed={1.6}/>)}
      </g>
      <ellipse cx={cx + 40} cy={feet + 6} rx={150} ry={16} fill="#1d3a14" opacity={0.3}/>
      <g transform={`translate(${cx} ${feet}) scale(${gs} ${gs * sq})`}><Girl f={f} id="ak-c-g"/></g>
    </g>
  );
};
const ColumnLabels: React.FC<AP> = (p) => { const l = lab(p, 0); return l ? <LabelCard cx={1330} y={330} text={l.text} f={p.f} at={l.at} size={46} maxW={620} tone="cool"/> : null; };

// ---- rooms -------------------------------------------------------------------------------------------------------------------------
const Rooms: React.FC<AP> = (p) => {
  const {f} = p, floorY = 800, roofY = 400, lx0 = 150, mid = 960, rx1 = 1770, doorTop = 560;
  const lo = lab(p, 0), hi = lab(p, 1), hl = lab(p, 2);
  const crowd = Array.from({length: 17}, (_, i) => { const row = i % 3, col = Math.floor(i / 3); return {x: 215 + col * 122 + row * 38 + (i % 2) * 14, y: floorY - 48 + row * 24 - (row === 0 ? 2 : 0), h: 200 + row * 14, seed: 100 + i}; });
  const walkers = [0, 1, 2, 3, 4].map((k) => {
    const P0 = 230, ph = ((f + k * (P0 / 5)) % P0) / P0, sx = 700 + (k % 3) * 70, sy = floorY - 20 - (k % 2) * 22;
    let x: number, y: number, op = 1;
    if (ph < 0.25) { x = sx; y = sy; op = eo(ph / 0.07); }
    else if (ph < 0.55) { const u = eio((ph - 0.25) / 0.3); x = sx + (mid - sx) * u; y = sy + (floorY - 8 - sy) * u; }
    else { const u = eio((ph - 0.55) / 0.43); x = mid + (1190 + (k % 3) * 130 - mid) * u; y = floorY - 8 - (k % 2) * 22; op = 1 - eo((ph - 0.9) / 0.1); }
    return { x, y, op, k, walk: ph > 0.25 && ph < 0.98 };
  });
  const rise = lo ? eo(prog(f, lo.at, 28)) : 0, sink = hi ? eo(prog(f, hi.at, 28)) : 0, hlp = hl ? eo(prog(f, hl.at, 30)) : 0;
  const room = (x0: number, x1: number, wall: string, wall2: string, id: string) => (
    <g>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={wall}/><stop offset="1" stopColor={wall2}/></linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b9894f"/><stop offset="1" stopColor="#8a5c30"/></linearGradient></defs>
      <rect x={x0} y={roofY} width={x1 - x0} height={floorY - roofY} fill={`url(#${id})`}/>
      <rect x={x0} y={floorY - 6} width={x1 - x0} height={44} fill={`url(#${id}f)`}/>
      {Array.from({length: 6}, (_, i) => <path key={i} d={`M${x0},${floorY + 4 + i * 7} H${x1}`} stroke="#6e4524" strokeWidth={1} opacity={0.4}/>)}
      <rect x={x0} y={floorY - 14} width={x1 - x0} height={10} fill="#e8d6b6" stroke="#b49a72" strokeWidth={0.8}/>
      <rect x={x0} y={roofY} width={x1 - x0} height={12} fill="#000" opacity={0.1}/>
      <rect x={(x0 + x1) / 2 - 110} y={roofY + 60} width={220} height={150} rx={4} fill="#9fd0ee" stroke="#8e7c62" strokeWidth={6}/>
      <path d={`M${(x0 + x1) / 2 - 110},${roofY + 210} L${(x0 + x1) / 2 - 20},${roofY + 60} L${(x0 + x1) / 2 + 30},${roofY + 60} L${(x0 + x1) / 2 - 60},${roofY + 210} Z`} fill="#fff" opacity={0.3}/>
      <path d={`M${(x0 + x1) / 2},${roofY + 60} V${roofY + 210} M${(x0 + x1) / 2 - 110},${roofY + 135} H${(x0 + x1) / 2 + 110}`} stroke="#8e7c62" strokeWidth={5}/>
    </g>
  );
  return (
    <g>
      <Sky id="ak-r-sky" a="#a9d2ee" b="#f8ead0"/>
      <Hills id="ak-r-h" base={420} amp={90} top="#b8cfe2" bottom="#d9e2df" seed={2.2}/>
      <rect x={lx0} y={floorY - 6} width={rx1 - lx0} height={44} fill="#9a6a3a"/>
      <rect x={lx0 - 40} y={floorY + 36} width={rx1 - lx0 + 80} height={60} fill="#7a5632"/>
      <rect x={-40} y={floorY + 80} width={W + 80} height={300} fill="#8fb874"/>
      {room(lx0, mid - 22, "#f7e6bf", "#ecd3a0", "ak-r-L")}
      {room(mid + 22, rx1, "#fff3d6", "#f4e2bc", "ak-r-R")}
      {/* warm light in the empty room */}
      <rect x={mid + 22} y={roofY} width={rx1 - mid - 22} height={floorY - roofY} fill="#ffe7a8" opacity={0.18}/>
      <rect x={lx0} y={roofY} width={mid - 22 - lx0} height={floorY - roofY} fill="#8a5a30" opacity={0.06}/>
      {/* shared wall with a door gap, frames and a roof slab */}
      <rect x={mid - 24} y={roofY - 28} width={48} height={floorY - roofY + 28} fill="#e9d3a6" stroke="#b49a72" strokeWidth={1.4}/>
      <rect x={mid - 24} y={doorTop} width={48} height={floorY - doorTop} fill="#f3e3bd"/>
      <path d={`M${mid - 24},${doorTop} V${floorY} M${mid + 24},${doorTop} V${floorY} M${mid - 24},${doorTop} H${mid + 24}`} stroke="#8e7c62" strokeWidth={5}/>
      <rect x={lx0 - 24} y={roofY - 40} width={rx1 - lx0 + 48} height={42} fill="#a85a3c" stroke="#7a3d26" strokeWidth={1.6}/>
      <rect x={lx0 - 24} y={roofY - 40} width={rx1 - lx0 + 48} height={10} fill="#d98a66" opacity={0.7}/>
      <rect x={lx0 - 24} y={roofY} width={24} height={floorY - roofY + 40} fill="#c9a876" stroke="#8e7c62" strokeWidth={1.2}/>
      <rect x={rx1} y={roofY} width={24} height={floorY - roofY + 40} fill="#c9a876" stroke="#8e7c62" strokeWidth={1.2}/>
      {/* people, drawn back to front */}
      {[...crowd.map((c) => ({x: c.x, y: c.y, h: c.h, seed: c.seed, op: 1, walk: false, ph: c.seed * 3})), { x: 1330, y: floorY - 20, h: 222, seed: 41, op: 1, walk: false, ph: 4 }, { x: 1610, y: floorY - 38, h: 212, seed: 42, op: 1, walk: false, ph: 9 },
        ...walkers.map((w) => ({x: w.x, y: w.y, h: 222, seed: 20 + w.k, op: w.op, walk: w.walk, ph: w.k * 5}))].sort((a, b) => a.y - b.y).map((q, i) => <Person key={i + "-" + q.seed} x={q.x} y={q.y} h={q.h} f={f} seed={q.seed} op={q.op} walk={q.walk} ph={q.ph}/>)}
      <FlowArrow pts={[[1370, 372], [1370, 320], [1370, 262]]} f={f} p={rise} w={30} c1="#ee7a2c" c2="#ffbe6a" speed={1.6}/>
      <FlowArrow pts={[[620, 262], [620, 316], [620, 372]]} f={f} p={sink} w={30} c1="#2f78c8" c2="#8fc0ee" speed={1.6}/>
      <FlowArrow pts={[[700, 548], [960, 548], [1250, 548]]} f={f} p={hlp} w={30} c1="#d8402a" c2="#ff9a6a" speed={1.8}/>
    </g>
  );
};
const RoomsLabels: React.FC<AP> = (p) => {
  const lo = lab(p, 0), hi = lab(p, 1), hl = lab(p, 2);
  return <>
    {lo && <LabelCard cx={1380} y={128} text={lo.text} f={p.f} at={lo.at} size={38} maxW={620}/>}
    {hi && <LabelCard cx={620} y={128} text={hi.text} f={p.f} at={hi.at} size={38} maxW={620} tone="cool"/>}
    {hl && <LabelCard cx={960} y={416} text={hl.text} f={p.f} at={hl.at} size={40} maxW={560}/>}
  </>;
};

// ---- gradient -------------------------------------------------------------------------------------------------------------------------
const Panel: React.FC<{cx: number; n: number; gap: number; f: number; strong: boolean; id: string}> = ({cx, n, gap, f, strong, id}) => {
  const w = 800, y0 = 120, h = 640, x0 = cx - w / 2, span = (n - 1) * gap, first = cx - span / 2;
  const sp = strong ? 2.6 : 0.65, lean = strong ? 17 : 4;
  const streaks = Array.from({length: strong ? 9 : 3}, (_, i) => {
    const u = (f * 0.0046 * sp + i / (strong ? 9 : 3)) % 1, yy = y0 + 150 + ((i * 53) % 260) + (strong ? 0 : 20), sx = x0 + 60 + u * (w - 200), len = strong ? 140 : 56;
    return <path key={i} d={`M${sx},${yy} h${len}`} stroke="#fff" strokeWidth={strong ? 5 : 3.5} strokeLinecap="round" opacity={Math.min(1, u * 6, (1 - u) * 6) * 0.75}/>;
  });
  const ic = (i: number) => { const t = n > 1 ? i / (n - 1) : 0; return `rgb(${Math.round(lerp(47, 214, t))},${Math.round(lerp(111, 84, t))},${Math.round(lerp(190, 42, t))})`; };
  return (
    <g>
      <defs>
        <clipPath id={`${id}c`}><rect x={x0} y={y0} width={w} height={h} rx={26}/></clipPath>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8cc3ea"/><stop offset="1" stopColor="#f7ead0"/></linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fc760"/><stop offset="1" stopColor="#3f8a45"/></linearGradient>
      </defs>
      <rect x={x0 - 14} y={y0 - 14} width={w + 28} height={h + 28} rx={36} fill="#d8b98a" stroke="#8a6a3e" strokeWidth={2} style={{filter: "drop-shadow(0 24px 22px rgba(60,34,12,.45))"}}/>
      <g clipPath={`url(#${id}c)`}>
        <rect x={x0} y={y0} width={w} height={h} fill={`url(#${id}s)`}/>
        <Cloud x={x0 + 130} y={y0 + 110} s={0.55} f={f} speed={strong ? 0.5 : 0.1} seed={cx % 7} a={0.9}/>
        <Hills id={`${id}h1`} base={y0 + 420} amp={70} top="#b4cbe0" bottom="#d2dede" seed={cx / 300}/>
        <Hills id={`${id}h2`} base={y0 + 500} amp={50} top="#8fb59a" bottom="#bdd2a4" seed={cx / 120} wl={250}/>
        <rect x={x0} y={y0 + h - 130} width={w} height={130} fill={`url(#${id}g)`}/>
        {Array.from({length: n}, (_, i) => <g key={i}><path d={`M${first + i * gap + Math.sin(f / 30 + i) * 3},${y0 + 8} Q${first + i * gap + 42},${y0 + h / 2} ${first + i * gap},${y0 + h - 8}`} fill="none" stroke="#fff" strokeWidth={7} opacity={0.5}/>
          <path d={`M${first + i * gap + Math.sin(f / 30 + i) * 3},${y0 + 8} Q${first + i * gap + 42},${y0 + h / 2} ${first + i * gap},${y0 + h - 8}`} fill="none" stroke={ic(i)} strokeWidth={3.4}/></g>)}
        {streaks}
        <FlowArrow pts={[[x0 + 150, y0 + 300], [cx - 20, y0 + 296], [x0 + w - 170, y0 + 300]]} f={f} p={eo(prog(f, 6, 40))} w={strong ? 44 : 16} c1={strong ? "#d8402a" : "#e8a23a"} c2={strong ? "#ff9a6a" : "#ffd88a"} speed={strong ? 3.2 : 0.8}/>
        {[x0 + 130, x0 + w - 120].map((tx, i) => <Tree key={i} x={tx} y={y0 + h - 40} s={0.62} bend={lean + Math.sin(f / (strong ? 5 : 16) + i) * (strong ? 4 : 1.5)} f={f * (strong ? 2.4 : 1)} seed={i + (strong ? 7 : 2)}/>)}
      </g>
      <g fontFamily={SERIF} fontWeight={700}>
        <circle cx={x0 + 66} cy={y0 + 66} r={40} fill="#fffaf0" stroke="#2f6fb5" strokeWidth={3}/><text x={x0 + 66} y={y0 + 84} textAnchor="middle" fontSize={50} fill="#2f6fb5">H</text>
        <circle cx={x0 + w - 66} cy={y0 + 66} r={40} fill="#fffaf0" stroke="#c0402a" strokeWidth={3}/><text x={x0 + w - 66} y={y0 + 84} textAnchor="middle" fontSize={50} fill="#c0402a">L</text>
      </g>
    </g>
  );
};
const Gradient: React.FC<AP> = ({f}) => (
  <g>
    <Sky id="ak-g-bg" a="#f4e8cc" b="#e8d4a6"/>
    <defs><linearGradient id="ak-g-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c99a62"/><stop offset="1" stopColor="#8a5a30"/></linearGradient></defs>
    <rect x={-40} y={806} width={W + 80} height={300} fill="url(#ak-g-wood)"/><rect x={-40} y={802} width={W + 80} height={8} fill="#e8c690" opacity={0.7}/>
    <Panel cx={500} n={9} gap={62} f={f} strong id="ak-g1"/>
    <Panel cx={1420} n={3} gap={210} f={f} strong={false} id="ak-g2"/>
  </g>
);
const GradientLabels: React.FC<AP> = (p) => { const l = lab(p, 0); return l ? <LabelCard cx={960} y={822} text={l.text} f={p.f} at={l.at} size={36} maxW={1000}/> : null; };

export const A: Record<string, {Art: React.FC<AP>; Labels: React.FC<AP>; bg: string}> = {
  "heat-rates": {Art: Heat, Labels: HeatLabels, bg: "#8fc4e8"},
  column: {Art: Column, Labels: ColumnLabels, bg: "#6fa9de"},
  rooms: {Art: Rooms, Labels: RoomsLabels, bg: "#a9d2ee"},
  gradient: {Art: Gradient, Labels: GradientLabels, bg: "#f1e2c2"},
};
void Frame; void Sun; void clamp; void ([] as Pt[]);
