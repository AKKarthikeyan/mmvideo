// GEO-04 Part 1, builder V2: the five NCERT volcano types as drawn cards (local box 472 x 512). Used by `five-types` (analogy_v2_five.tsx).
// Each card is a cut-away picture; the caldera, flood and ridge cards take progress values so the scene can animate them.
import React from "react";
import {eo, clamp, rng} from "../kit";
import {prog} from "./analogy_kit";
import {Plume, Ballistic, Glow, Strata, curve, pts, under, bandPath, mix, type XY} from "./analogy_v2_kit";

export const AW = 472, AH = 512, CW = 520, CH = 560;
const CXL = 236, YB = 380;

export const CardShell: React.FC<{u: string; children: React.ReactNode}> = ({u, children}) => (
  <g>
    <rect x={0} y={0} width={CW} height={CH} rx={26} fill="#fff8ea" stroke="#d3b98a" strokeWidth={3}/>
    <rect x={7} y={7} width={CW - 14} height={CH - 14} rx={21} fill="none" stroke="#fffdf4" strokeWidth={2} opacity={0.9}/>
    <clipPath id={`${u}-cw`}><rect x={24} y={24} width={AW} height={AH} rx={14}/></clipPath>
    <g clipPath={`url(#${u}-cw)`}><g transform="translate(24 24)">{children}</g></g>
    <rect x={24} y={24} width={AW} height={AH} rx={14} fill="none" stroke="#9a7a4a" strokeWidth={2.4} opacity={0.75}/>
  </g>
);

const Sky: React.FC<{u: string; top?: string; bot?: string; h?: number}> = ({u, top = "#79b3dc", bot = "#f4e7c8", h = YB}) => (
  <g>
    <defs><linearGradient id={`${u}-sk`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top}/><stop offset="1" stopColor={bot}/></linearGradient></defs>
    <rect x={0} y={0} width={AW} height={h} fill={`url(#${u}-sk)`}/>
    <path d={under((x) => 300 - 16 * Math.sin(x / 70 + 1) - 8 * Math.sin(x / 31), 0, AW, YB, 16)} fill="#b9cde0" opacity={0.6}/>
  </g>
);
const Slab: React.FC<{u: string; seed?: number; y0?: number}> = ({u, seed = 3, y0 = YB}) => (
  <g>
    <rect x={0} y={y0} width={AW} height={AH - y0 + 2} fill="#4a382f"/>
    <Strata id={`${u}-st`} x0={0} x1={AW} y0={y0 + 2} y1={AH + 20} seed={seed} gap={30}/>
    <rect x={0} y={y0} width={AW} height={4} fill="#d6b683" opacity={0.85}/>
  </g>
);

// ---- 1 dome (shield) --------------------------------------------------------------------------------------------------------------
export const DomeCard: React.FC<{u: string; f: number}> = ({u, f}) => {
  const fn = (s: number) => (x: number) => YB - 96 * s * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(x - CXL) / (360 * s), 2)), 1.05);
  const tones = ["#3e312d", "#5d4339", "#463631", "#6b4c3d"];
  return (
    <g>
      <Sky u={u}/><Slab u={u} seed={3}/>
      {Array.from({length: 8}, (_, k) => {
        const s = 1 - k * 0.1, g = fn(s);
        return (
          <g key={k}>
            <path d={under(g, CXL - 360 * s - 2, CXL + 360 * s + 2, YB, 12)} fill={k === 0 ? "#5f5a48" : tones[k % 4]}/>
            <path d={pts(curve(g, CXL - 360 * s, CXL + 360 * s, 12))} fill="none" stroke="#e8b98e" strokeWidth={1.5} opacity={0.5}/>
          </g>
        );
      })}
      <Glow x={CXL} y={fn(1)(CXL)} r={46} a={0.7 + 0.1 * Math.sin(f / 6)}/>
      <ellipse cx={CXL} cy={fn(1)(CXL) + 3} rx={16} ry={3.4} fill="url(#v2-lavaV)"/>
    </g>
  );
};

// ---- 2 steep cone ----------------------------------------------------------------------------------------------------------------
const coneBase = (x: number, hw = 215, ht = 250) => YB - ht * Math.pow(Math.max(0, 1 - Math.abs(x - CXL) / hw), 1.5);
const OFF = [0, 12, 28, 40, 58, 72, 92, 106, 128, 142, 164];
export const Bands: React.FC<{u: string; prof: (x: number) => number; x0: number; x1: number}> = ({u, prof, x0, x1}) => (
  <g>
    <clipPath id={`${u}-yb`}><rect x={-4} y={0} width={AW + 8} height={YB + 1}/></clipPath>
    <g clipPath={`url(#${u}-yb)`}>
      <path d={under(prof, x0, x1, YB + 40, 8)} fill="#33241f"/>
      {OFF.slice(0, -1).map((o, k) => (
        <path key={k} d={bandPath((x) => prof(x) + o, (x) => prof(x) + OFF[k + 1], x0, x1, 8)} fill={k % 2 === 0 ? ["#4b3430", "#5b3d36", "#3f2c2a"][(k >> 1) % 3] : ["#dac49c", "#cdb287", "#e2cfa8"][(k >> 1) % 3]}/>
      ))}
    </g>
  </g>
);
export const ConeCard: React.FC<{u: string; f: number}> = ({u, f}) => {
  const RIM = 24, ry = coneBase(CXL + RIM), prof = (x: number) => { const dx = Math.abs(x - CXL); return dx < RIM ? ry + 18 * (1 - (dx / RIM) * (dx / RIM)) : coneBase(x); };
  return (
    <g>
      <Sky u={u}/><Slab u={u} seed={5}/>
      <Bands u={u} prof={prof} x0={CXL - 216} x1={CXL + 216}/>
      <rect x={CXL - 5} y={ry + 16} width={10} height={AH} fill="#241210"/><rect x={CXL - 3} y={ry + 16} width={6} height={AH} fill="url(#v2-lavaV)"/>
      <Glow x={CXL} y={ry + 8} r={40} a={0.6 + 0.1 * Math.sin(f / 5)}/>
      <Plume x={CXL} y={ry + 12} f={f} n={9} rise={95} drift={50} r0={9} r1={30} kind="D" period={110} a={0.85} seed={2} sway={5}/>
    </g>
  );
};

// ---- 3 caldera: emp = chamber empties, col = the top falls in, lake = the hollow fills with water -------------------------------
export const CalderaCard: React.FC<{u: string; f: number; emp: number; col: number; lake: number}> = ({u, f, emp, col, lake}) => {
  const RIM = 24, WC = 72, FL = 304, ry = coneBase(CXL + RIM);
  const p0 = (x: number) => { const dx = Math.abs(x - CXL); return dx < RIM ? ry + 18 * (1 - (dx / RIM) * (dx / RIM)) : coneBase(x); };
  const RY = 262, hollow = (x: number) => FL - (FL - RY) * Math.pow(Math.min(1, Math.abs(x - CXL) / WC), 3);
  const prof = (x: number) => (Math.abs(x - CXL) < WC ? mix(p0(x), hollow(x), col) : Math.max(coneBase(x), mix(-200, RY, col)));
  const ly = FL - 40 * lake; // water level (smaller y = higher)
  const wet: XY[] = [], dry: XY[] = [];
  for (let x = CXL - WC; x <= CXL + WC + 0.1; x += 2) { const h = prof(x); if (h > ly + 0.5) { wet.push([x, ly]); dry.push([x, h]); } }
  const lakeD = wet.length > 2 && lake > 0.02 ? `${pts(wet)} ${dry.reverse().map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")} Z` : "";
  const shake = Math.sin(f * 1.9) * 2.4 * Math.sin(Math.PI * clamp(col)), lavaTop = 484 - 92 * (1 - emp);
  const cavY = 442, cavRx = 116, cavRy = 46;
  return (
    <g>
      <Sky u={u}/><Slab u={u} seed={7}/>
      <g transform={`translate(${shake} 0)`}>
        <Bands u={u} prof={prof} x0={CXL - 216} x1={CXL + 216}/>
      </g>
      {/* magma chamber below the cone: the lava drains out and leaves an empty cavity */}
      <ellipse cx={CXL} cy={cavY} rx={cavRx + 6} ry={cavRy + 5} fill="#1d100d"/>
      <ellipse cx={CXL} cy={cavY} rx={cavRx} ry={cavRy} fill="#2c1713"/>
      <clipPath id={`${u}-lv`}><rect x={0} y={lavaTop} width={AW} height={AH}/></clipPath>
      <g clipPath={`url(#${u}-lv)`}><ellipse cx={CXL} cy={cavY} rx={cavRx} ry={cavRy} fill="url(#v2-lavaV)"/></g>
      <Glow x={CXL} y={cavY + 20} r={120 * (1 - 0.7 * emp)} a={0.6 * (1 - 0.8 * emp)}/>
      <g opacity={1 - emp}>
        <rect x={CXL - 5} y={ry + 16} width={10} height={cavY - ry - 16} fill="#241210"/><rect x={CXL - 3} y={ry + 16} width={6} height={cavY - ry - 16} fill="url(#v2-lavaV)"/>
      </g>
      <Glow x={CXL} y={ry + 8} r={40} a={0.55 * (1 - col)}/>
      {lakeD && (
        <g>
          <path d={lakeD} fill="#2f86b3"/>
          <path d={lakeD} fill="#9fe0f0" opacity={0.25}/>
          <path d={`M${wet[0][0]},${ly} L${wet[wet.length - 1][0]},${ly}`} stroke="#e8fbff" strokeWidth={2.2} opacity={0.8}/>
          {[0, 1, 2].map((i) => <path key={i} d={`M${CXL - 36 + i * 24},${ly + 6 + i * 3} l16,${Math.sin(f / 8 + i)}`} stroke="#e8fbff" strokeWidth={1.4} opacity={0.5}/>)}
        </g>
      )}
      <Plume x={CXL} y={ry + 16} f={f} n={8} rise={80} drift={40} r0={8} r1={26} kind="D" period={100} a={0.8 * (1 - col)} seed={3} sway={5}/>
      {col > 0.05 && col < 0.97 && <Plume x={CXL} y={FL - 14} f={f} n={9} rise={110} drift={0} r0={14} r1={38} kind="G" period={60} a={0.8 * Math.sin(Math.PI * col)} seed={8}/>}
    </g>
  );
};

// ---- 4 flood basalt: sheet after sheet spreading over a plain ------------------------------------------------------------------
export const FloodCard: React.FC<{u: string; f: number; p: number}> = ({u, f, p}) => {
  const N = 6, TH = 26, X0 = 44, rnd = rng(31);
  const sheets = Array.from({length: N}, (_, k) => {
    const e = 452 - k * 54 - rnd() * 8, a = k * 0.14, u2 = eo(clamp((p - a) / 0.2));
    return {k, e, u2, x: mix(X0, e, u2), y: YB - (k + 1) * TH, hot: u2 > 0 && u2 < 1 ? 1 : clamp(1 - (p - a - 0.2) * 4) * (u2 >= 1 ? 1 : 0)};
  });
  return (
    <g>
      <Sky u={u}/>
      <path d={under((x) => YB - 4 - 6 * Math.sin(x / 40), 0, AW, YB + 8, 16)} fill="#79a04c"/>
      <Slab u={u} seed={9}/>
      {sheets.map((s) => (s.u2 > 0.01 && (
        <g key={s.k}>
          <rect x={X0} y={s.y} width={Math.max(2, s.x - X0)} height={TH} rx={9} fill={s.k % 2 ? "#4b3a34" : "#3b2e2b"} stroke="#d49a6a" strokeWidth={1.4} strokeOpacity={0.55}/>
          {Array.from({length: Math.floor((s.x - X0) / 15)}, (_, i) => <line key={i} x1={X0 + 8 + i * 15} y1={s.y + 5} x2={X0 + 8 + i * 15} y2={s.y + TH - 3} stroke="#1e1512" strokeWidth={1.2} opacity={0.5}/>)}
          <rect x={X0} y={s.y + 1} width={Math.max(2, s.x - X0)} height={4} rx={2} fill="#e0b080" opacity={0.25}/>
          {s.hot > 0.02 && <g><Glow x={s.x - 4} y={s.y + TH / 2} r={34} a={0.9 * s.hot}/><rect x={s.x - 12} y={s.y + 2} width={12} height={TH - 4} rx={5} fill="url(#v2-lavaV)" opacity={s.hot}/></g>}
        </g>
      )))}
      {/* the fissure the sheets come from */}
      <path d={`M0,${YB} L0,${YB - 40} Q${X0 * 0.6},${YB - 56} ${X0 + 10},${YB - 30} L${X0 + 20},${YB} Z`} fill="#3a2b27" stroke="#d49a6a" strokeOpacity={0.4}/>
      {p < 0.97 && p > 0.001 && (
        <g>
          <Glow x={24} y={YB - 50} r={60} a={0.8}/>
          <Ballistic x={22} y={YB - 52} f={f} n={7} vx={18} vy={30} g={3} period={40} seed={4} r={4}/>
        </g>
      )}
    </g>
  );
};

// ---- 5 mid-ocean ridge: glowing crack, pillow lava, plates moving apart ------------------------------------------------------
export const RidgeCard: React.FC<{u: string; f: number; p: number}> = ({u, f, p}) => {
  const d = 18 * p, G = 15, fl = (x: number) => 344 - 64 * Math.exp(-Math.pow((x - CXL) / 150, 2));
  const rnd = rng(77);
  const pil = Array.from({length: 16}, (_, i) => ({o: 8 + i * 15 + rnd() * 6, rx: 10 + rnd() * 6, ry: 7 + rnd() * 4, a: i / 16}));
  const plate = (sg: number) => {
    const xe = CXL + sg * G; // inner edge (local)
    const x0 = sg < 0 ? -30 : xe, x1 = sg < 0 ? xe : AW + 30;
    const top = (x: number) => fl(x);
    return (
      <g transform={`translate(${sg * d} 0)`}>
        <path d={under(top, x0, x1, AH + 30, 10)} fill="#2c2a33"/>
        <path d={bandPath((x) => top(x) + 26, (x) => top(x) + 70, x0, x1, 10)} fill="#4b4048"/>
        <path d={bandPath((x) => top(x) + 70, (x) => top(x) + 150, x0, x1, 10)} fill="#6a5a5a"/>
        <path d={bandPath((x) => top(x) + 150, (x) => top(x) + 400, x0, x1, 10)} fill="#3d2a2e"/>
        {[26, 70, 150].map((o) => <path key={o} d={pts(curve((x) => top(x) + o, x0, x1, 10))} fill="none" stroke="#e0a67a" strokeWidth={1.2} opacity={0.3}/>)}
        {pil.map((q, i) => { if (q.a > p * 1.25 + 0.15) return null; const x = xe + sg * q.o, y = top(x) - q.ry * 0.5;
          return (<g key={i}><ellipse cx={x} cy={y} rx={q.rx} ry={q.ry} fill="#25232b" stroke="#ff8a2a" strokeWidth={1.8} strokeOpacity={clamp(0.9 - q.a * 0.9)}/>
            <path d={`M${x - q.rx * 0.6},${y} q${q.rx * 0.6},${-q.ry * 0.5} ${q.rx * 1.2},0`} stroke="#6a6270" strokeWidth={1} fill="none" opacity={0.6}/></g>); })}
        {/* arrow showing the plate's motion */}
        {(() => { const ax = xe + sg * 120, ay = top(ax) - 46, len = 44 + 8 * Math.sin(f / 10); return (
          <g opacity={clamp(0.2 + p * 3) * 0.95}>
            <path d={`M${ax - sg * 0},${ay} L${ax + sg * len},${ay}`} stroke="#fff6dc" strokeWidth={7} strokeLinecap="round"/>
            <path d={`M${ax + sg * (len + 14)},${ay} L${ax + sg * (len - 6)},${ay - 13} L${ax + sg * (len - 6)},${ay + 13} Z`} fill="#fff6dc" stroke="#fff6dc" strokeWidth={2} strokeLinejoin="round"/>
          </g>); })()}
      </g>
    );
  };
  return (
    <g>
      <defs>
        <linearGradient id={`${u}-w`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fd0e6"/><stop offset="0.35" stopColor="#2f86b3"/><stop offset="1" stopColor="#0b2a4a"/></linearGradient>
      </defs>
      <rect x={0} y={0} width={AW} height={AH} fill={`url(#${u}-w)`}/>
      {[0, 1, 2].map((i) => <path key={i} d={`M${60 + i * 150},0 L${100 + i * 150},0 L${150 + i * 150},330 L${70 + i * 150},330 Z`} fill="#fff" opacity={0.05 + 0.025 * Math.sin(f / 30 + i)}/>)}
      <path d={pts(curve((x) => 12 + 3 * Math.sin(x / 26 + f / 10), 0, AW, 10))} fill="none" stroke="#eafcff" strokeWidth={3} opacity={0.7}/>
      {/* magma below and in the gap */}
      <Glow x={CXL} y={AH + 10} r={230} a={0.85}/>
      <rect x={CXL - G - d} y={fl(CXL) - 6} width={(G + d) * 2} height={AH} fill="url(#v2-lavaV)"/>
      {plate(-1)}{plate(1)}
      <path d={`M${CXL - G - d - 1},${fl(CXL) - 6} L${CXL + G + d + 1},${fl(CXL) - 6} L${CXL + G + d + 70},${AH} L${CXL - G - d - 70},${AH} Z`} fill="url(#v2-lavaV)" opacity={0.95}/>
      <path d={`M${CXL - G - d - 1},${fl(CXL) - 6} L${CXL - G - d - 70},${AH} M${CXL + G + d + 1},${fl(CXL) - 6} L${CXL + G + d + 70},${AH}`} stroke="#ffdf8a" strokeWidth={2} opacity={0.5}/>
      <Glow x={CXL} y={fl(CXL) - 6} r={70} a={0.8 + 0.1 * Math.sin(f / 5)}/>
      {/* new pillows heaped in the gap itself */}
      {[-14, -5, 6, 15].map((o, i) => <ellipse key={i} cx={CXL + o * (1 + p * 0.4)} cy={fl(CXL) - 3 - (i % 2) * 5} rx={11} ry={8} fill="#2b2230" stroke="#ffb040" strokeWidth={2} strokeOpacity={0.9}/>)}
      {Array.from({length: 7}, (_, i) => { const t = ((f / 80) + i * 0.143) % 1; return <circle key={i} cx={CXL + Math.sin(t * 8 + i) * 10 + (i - 3) * 4} cy={fl(CXL) - 14 - t * 160} r={2 + (i % 3)} fill="none" stroke="#eafcff" strokeWidth={1.2} opacity={0.6 * (1 - t)}/>; })}
    </g>
  );
};
