// ECO-16 Part 3, builder G2: `accounts`. Default (b12a): three passbooks fan out from a stack, SAVINGS (a sapling and coins: interest), CURRENT (a shopfront: business), FIXED DEPOSIT (a clock and a padlock).
// mode "compound" (b12b; ref e16_comp): a pile of coins on a desk grows year by year from the table's start value; a year counter ticks from 1 to the table's `y`; the pile's height follows value / p and ends at `final`.
// Words from spec labels at(key); every height, rate and year count is read from e16_comp.
import React from "react";
import {F3Defs, G2Defs, Desk, FCard, Passbook, Shade, Stack, Padlock, Clock, E, Z, pop, pulse, fv, ft, elabs, prog, eo, lerp, SANS, SERIF} from "./analogy_g2_kit";
import {Room} from "./analogy_e2_kit";
import type {AP} from "./analogy_kit";

// ---- the three covers --------------------------------------------------------------------------------------------------------------
const BWc = 360, BHc = 480;
const Plate: React.FC<{text: string; y: number; a: number}> = ({text, y, a}) => (
  <g opacity={a} transform={`translate(0 ${y - (1 - a) * 14})`}>
    <rect x={-142} y={-34} width={284} height={68} rx={10} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
    <rect x={-132} y={-25} width={264} height={50} rx={6} fill="none" stroke="#6c4a16" strokeWidth={1.6} opacity={0.7}/>
    <text y={13} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={text.length > 9 ? 25 : 40} letterSpacing={4} fill="#fff1bd" opacity={0.7} transform="translate(0 2)">{text}</text>
    <text y={13} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={text.length > 9 ? 25 : 40} letterSpacing={4} fill="#4a2f0a">{text}</text>
  </g>
);

const SavingsIcon: React.FC<{f: number; k: number}> = ({f, k}) => {
  const sway = Math.sin(f / 18) * 2.4, g = 0.55 + 0.45 * k;
  return (
    <g transform={`translate(0 30) scale(${g})`}>
      <Shade x={0} y={78} rx={96} ry={13} o={0.34}/>
      <ellipse cx={0} cy={70} rx={88} ry={16} fill="#6e4524" stroke="#3f2a16" strokeWidth={2.4}/>
      <ellipse cx={0} cy={64} rx={80} ry={12} fill="#8a5a30"/>
      {/* coins at the foot */}
      {[[-52, 60], [-20, 66], [30, 62], [60, 66]].map(([x, y], i) => <g key={i}><ellipse cx={x} cy={Number(y) + 6} rx={24} ry={7} fill="url(#e2-gold)" stroke="#8c5f18" strokeWidth={2}/><ellipse cx={x} cy={y} rx={24} ry={7} fill="url(#e2-coin)" stroke="#a8741c" strokeWidth={2}/></g>)}
      {/* the sapling */}
      <g transform={`rotate(${sway} 0 60)`}>
        <path d="M0,60 Q-6,0 4,-70" stroke="#4b6428" strokeWidth={9} fill="none" strokeLinecap="round"/>
        <path d="M0,60 Q-6,0 4,-70" stroke="#8fcf7a" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7}/>
        {[[-1, 8, 60], [1, -18, 50], [-1, -40, 44], [1, -64, 36]].map(([sd, y, l], i) => (
          <g key={i} transform={`translate(${Number(y) < 0 ? 2 : 0} ${y}) scale(${Math.min(1, k * 2.4 - i * 0.3)})`}>
            <path d={`M0,0 Q${Number(sd) * Number(l) * 0.5},${-Number(l) * 0.5} ${Number(sd) * Number(l)},${-Number(l) * 0.1} Q${Number(sd) * Number(l) * 0.5},${Number(l) * 0.2} 0,0 Z`} fill="#7fb36a" stroke="#3f7a32" strokeWidth={2}/>
            <path d={`M0,0 Q${Number(sd) * Number(l) * 0.5},${-Number(l) * 0.2} ${Number(sd) * Number(l) * 0.9},${-Number(l) * 0.1}`} stroke="#d8f0c0" strokeWidth={2} fill="none"/>
          </g>
        ))}
      </g>
      {/* interest: small coins float up */}
      {[0, 1, 2].map((i) => { const u = (f * 0.011 + i / 3) % 1; return <g key={i} opacity={Math.sin(u * Math.PI) * k}><ellipse cx={-70 + i * 70} cy={20 - u * 90} rx={16} ry={5.4} fill="url(#e2-coin)" stroke="#a8741c" strokeWidth={1.6}/></g>; })}
    </g>
  );
};

const CurrentIcon: React.FC<{f: number; k: number}> = ({f, k}) => {
  const g = 0.55 + 0.45 * k;
  return (
    <g transform={`translate(0 24) scale(${g})`}>
      <Shade x={0} y={92} rx={116} ry={13} o={0.34}/>
      <rect x={-96} y={-30} width={192} height={120} fill="#efe0bd" stroke="#8a7440" strokeWidth={3}/>
      <rect x={-96} y={-30} width={42} height={120} fill="#8a6a46" opacity={0.15}/>
      <rect x={-72} y={8} width={70} height={52} fill="#9fcfe6" stroke="#6e4524" strokeWidth={3}/>
      <path d="M-37,8 V60 M-72,34 H-2" stroke="#6e4524" strokeWidth={3}/>
      <path d="M22,90 V12 Q48,-6 74,12 V90 Z" fill="#4a3220" stroke="#2a1a0c" strokeWidth={2.4}/>
      <circle cx={64} cy={56} r={4} fill="url(#e2-brass)"/>
      {/* awning */}
      {Array.from({length: 8}, (_, i) => <path key={i} d={`M${-110 + i * 27.5},-72 h27.5 v42 q-13.75,18 -27.5,0 Z`} fill={i % 2 ? "#fff4e0" : "#c0603d"} stroke="#8c3a22" strokeWidth={2}/>)}
      <path d="M-110,-72 H110" stroke="#8c3a22" strokeWidth={5} strokeLinecap="round"/>
      {/* a counter bar chart on a sign: business */}
      <rect x={-84} y={-112} width={168} height={34} rx={6} fill="#2a3a5c" stroke="#d9b45a" strokeWidth={2.4}/>
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-56 + i * 30} y={-86 - (8 + i * 5)} width={16} height={8 + i * 5} fill="#f6e3a8"/>)}
      <path d="M-60,-86 H64" stroke="#d9b45a" strokeWidth={2}/>
    </g>
  );
};

const FixedIcon: React.FC<{f: number; k: number; lock: number; click: number}> = ({f, k, lock, click}) => {
  const g = 0.55 + 0.45 * k;
  return (
    <g transform={`translate(0 20) scale(${g})`}>
      <Clock x={0} y={-6} r={78} f={f} speed={1.2} stand/>
      <Padlock x={84} y={74} s={0.9} closed={lock} click={click}/>
    </g>
  );
};

// ---- the fan ---------------------------------------------------------------------------------------------------------------------------
const SLOT = [{x: 480, y: 392, rot: -7}, {x: 960, y: 392, rot: 0}, {x: 1440, y: 392, rot: 7}];
const STK = [{x: 972, y: 420, rot: 3.4}, {x: 960, y: 414, rot: -1.6}, {x: 950, y: 408, rot: 0.6}];
const COVERS: [string, string, string][] = [["#3b86c6", "#1d4a82", "#f0d78c"], ["#a8506a", "#5e1f3a", "#f2dca0"], ["#2f7a5a", "#14442f", "#f0e0a0"]];

export const AccountsArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p);
  const keys = ["sa", "cu", "fd"] as const;
  const a0 = Z(f, 0, 26);
  return (
    <g>
      <F3Defs/><G2Defs/>
      <Desk f={f} id="g2ac"/>
      {/* a few coins left on the desk */}
      <Stack x={196} y={190} n={5} rx={54} th={15} a={a0}/>
      <Stack x={282} y={206} n={2.6} rx={46} th={15} a={a0}/>
      <Stack x={1712} y={196} n={4} rx={54} th={15} a={a0}/>
      {[[1640, 232, -12], [1800, 214, 10], [1760, 252, 4]].map(([x, y, r], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${r})`} opacity={a0}><ellipse cx={3} cy={7} rx={26} ry={9} fill="#2a1808" opacity={0.25}/><ellipse rx={26} ry={9} fill="url(#e2-coin)" stroke="#a8741c" strokeWidth={2}/><ellipse rx={17} ry={5.8} fill="none" stroke="#b9831f" strokeWidth={1.4} opacity={0.8}/></g>)}
      {/* soft pools of light under each slot */}
      {SLOT.map((s, i) => <ellipse key={i} cx={s.x} cy={s.y + 30} rx={260} ry={300} fill="url(#ak-sunglow)" opacity={0.16 + 0.34 * Z(f, L[keys[i]].at, 24)}/>)}
      {[2, 1, 0].map((i) => {
        const at = L[keys[i]].at, u = E(f, at - 6, 34), s = SLOT[i], t = STK[i];
        const x = lerp(t.x, s.x, u), y = lerp(t.y, s.y, u) - Math.sin(Math.PI * u) * 34, rot = lerp(t.rot, s.rot, u), sc = lerp(0.8, 1, u);
        const open = Z(f, at, 18), lit = pulse(f, at, 40);
        const icon = i === 0 ? <SavingsIcon f={f} k={open}/> : i === 1 ? <CurrentIcon f={f} k={open}/> : <FixedIcon f={f} k={open} lock={E(f, at + 36, 10)} click={Math.min(1, Math.max(0, (f - at - 46) / 18))}/>;
        const name = L[keys[i]].text.split(" · ")[0];
        return (
          <g key={i} opacity={a0} transform={`translate(${x} ${y}) scale(${sc}) translate(${-x} ${-y})`}>
            <Passbook id={`g2pb${i}`} x={x} y={y} w={BWc} h={BHc} rot={rot} c={COVERS[i]} glow={0.55 * lit}>
              <Plate text={name} y={-176} a={open}/>
              <g opacity={Math.min(1, open * 1.6)}>{icon}</g>
              <text y={196} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing={8} fill={COVERS[i][2]} opacity={0.7}>PASSBOOK</text>
            </Passbook>
          </g>
        );
      })}
    </g>
  );
};
export const AccountsLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return (
    <>
      <FCard cx={SLOT[0].x} y={690} text={L.sa.text} f={p.f} at={L.sa.at} size={26} maxW={440} upper={false} tone="cool"/>
      <FCard cx={SLOT[1].x} y={690} text={L.cu.text} f={p.f} at={L.cu.at} size={26} maxW={440} upper={false} tone="red"/>
      <FCard cx={SLOT[2].x} y={690} text={L.fd.text} f={p.f} at={L.fd.at} size={26} maxW={440} upper={false} tone="green"/>
    </>
  );
};

// ---- compounding -------------------------------------------------------------------------------------------------------------------------
const DESK = 770, PX = 960 + 40, PILE_RX = 88, TH = 18;
const PER = 0.17;                              // drawing scale: pixels of pile height per rupee

const DeskCalendar: React.FC<{x: number; y: number; n: number; a: number; flip: number}> = ({x, y, n, a, flip}) => {
  if (a <= 0.01) return null;
  return (
    <g transform={`translate(${x} ${y + (1 - a) * 30})`} opacity={a}>
      <Shade x={0} y={0} rx={170} ry={16} o={0.36}/>
      <path d="M-70,-30 L-40,-230 L40,-230 L70,-30 Z" fill="#6e4524" stroke="#3f2a16" strokeWidth={3}/>
      <rect x={-150} y={-236} width={300} height={216} rx={14} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3.4}/>
      <rect x={-136} y={-222} width={272} height={188} rx={8} fill="url(#g2-sheet)" stroke="#8e6522" strokeWidth={2}/>
      <rect x={-136} y={-222} width={272} height={44} rx={8} fill="#c0603d"/>
      <text y={-188} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={28} letterSpacing={10} fill="#fff4e0">YEAR</text>
      <g transform={`translate(0 ${-92}) scale(1 ${1 - 0.5 * flip})`}>
        <text y={34} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={118} fill="#4a2f0a">{n}</text>
      </g>
      {[-100, -60, -20, 20, 60, 100].map((dx) => <g key={dx}><rect x={dx - 6} y={-250} width={12} height={34} rx={6} fill="#cfd6dc" stroke="#5a6872" strokeWidth={2}/></g>)}
    </g>
  );
};

export const CompoundArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p);
  const P = fv("e16_comp", "p"), R = fv("e16_comp", "r"), Y = fv("e16_comp", "y"), FIN = fv("e16_comp", "final");
  const pileA = pop(f, L.p.at, 24);
  const T0 = L.yr.at, T1 = Math.max(T0 + 50, L.fv.at - 12);
  const yearT = Y * E(f, T0, T1 - T0);
  const value = P * Math.pow(1 + R / 100, yearT);
  const shown = f >= L.p.at ? (yearT <= 0 ? P : value) : P;
  const hPile = shown * PER, n = hPile / TH;
  const yTop = DESK - hPile;
  const day = Math.max(1, Math.ceil(yearT - 1e-6));
  const frac = yearT - Math.floor(yearT), tickGlow = yearT > 0 && yearT < Y ? 1 - frac : 0;
  const flip = yearT > 0 && yearT < Y ? Math.max(0, 1 - frac * 5) : 0;
  const calA = Z(f, L.yr.at - 8, 22);
  const lvlP = DESK - P * PER, lvlF = DESK - FIN * PER;
  const fvK = E(f, L.fv.at - 6, 22);
  const done = f >= L.fv.at - 8;
  return (
    <g>
      <F3Defs/><G2Defs/>
      <Room f={f} deskY={DESK} variant="study" winX={1560}/>
      {/* a round brass-rimmed pad where the pile will stand, and a pool of lamp light on it */}
      <g opacity={Z(f, 6, 30)}>
        <ellipse cx={PX} cy={DESK + 14} rx={150} ry={26} fill="#2a1808" opacity={0.3} filter="url(#ak-blur8)"/>
        <ellipse cx={PX} cy={DESK + 8} rx={130} ry={22} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
        <ellipse cx={PX} cy={DESK + 4} rx={112} ry={17} fill="#5e3a22" stroke="#3f2a16" strokeWidth={2}/>
        <ellipse cx={PX} cy={DESK + 2} rx={100} ry={13} fill="none" stroke="#d9b45a" strokeWidth={1.6} strokeDasharray="6 8" opacity={0.7}/>
      </g>
      <DeskCalendar x={330} y={DESK + 50} n={day} a={calA} flip={flip}/>
      {/* the start level, drawn from p */}
      {f >= L.p.at && (
        <g opacity={Z(f, L.p.at + 10, 22)}>
          <path d={`M${PX + PILE_RX + 24},${lvlP} H1700`} stroke="#8a5a20" strokeWidth={3.4} strokeDasharray="14 10" strokeLinecap="round"/>
        </g>
      )}
      {/* the end level: appears with the final value */}
      {fvK > 0.01 && <path d={`M${PX + PILE_RX + 24},${lvlF} H${PX + PILE_RX + 24 + (1700 - PX - PILE_RX - 24) * fvK}`} stroke="#2f7a3a" strokeWidth={4} strokeDasharray="14 10" strokeLinecap="round"/>}
      {/* the pile with a coin-leaf seedling on top */}
      <g opacity={pileA}>
        {tickGlow > 0.01 && <ellipse cx={PX} cy={yTop} rx={PILE_RX * 1.5} ry={34} fill="url(#ak-sunglow)" opacity={0.7 * tickGlow}/>}
        <Stack x={PX} y={DESK + 4} n={n} rx={PILE_RX} th={TH} a={1} glow={done ? 0.55 * fvK : 0}/>
        {/* the seedling: a bright stem with one coin-leaf for every year that has passed */}
        {(() => {
          const g = Math.min(1, yearT / Y), Hs = 100 + 90 * g, sw = Math.sin(f / 22) * 5;
          const P1: [number, number] = [-18 + sw, -Hs * 0.5], P2: [number, number] = [10 + sw * 1.6, -Hs];
          const B = (t: number): [number, number] => [2 * (1 - t) * t * P1[0] + t * t * P2[0], 2 * (1 - t) * t * P1[1] + t * t * P2[1] - 4 * (1 - t) * (1 - t) * 0 ];
          const d = `M0,2 Q${P1[0]},${P1[1]} ${P2[0]},${P2[1]}`;
          return (
            <g transform={`translate(${PX} ${yTop - 6})`}>
              <path d={d} stroke="#3f6a24" strokeWidth={14} fill="none" strokeLinecap="round"/>
              <path d={d} stroke="#8fcf7a" strokeWidth={7} fill="none" strokeLinecap="round"/>
              <path d={d} stroke="#e4f7cc" strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.7} transform="translate(-2 0)"/>
              {Array.from({length: Y}, (_, i) => {
                const k = Math.min(1, Math.max(0, yearT - i) * 1.6);
                if (k <= 0.01) return null;
                const t = (i + 0.8) / (Y + 0.6), sd = i % 2 ? 1 : -1, [bx, by] = B(t), reach = 34 + 12 * (i % 3), hx = bx + sd * reach, hy = by - 8;
                return (
                  <g key={i} opacity={Math.min(1, k * 2)}>
                    <path d={`M${bx},${by} Q${bx + sd * reach * 0.5},${by - 16} ${hx - sd * 14},${hy}`} stroke="#3f6a24" strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray="100" strokeDashoffset={100 * (1 - k)} pathLength={100}/>
                    <g transform={`translate(${hx} ${hy}) scale(${k}) rotate(${sd * 14})`}>
                      <ellipse cx={3} cy={5} rx={20} ry={20} fill="#2a1808" opacity={0.22}/>
                      <circle r={20} fill="url(#e2-coin)" stroke="#a8741c" strokeWidth={2.4}/>
                      <circle r={13.5} fill="none" stroke="#b9831f" strokeWidth={1.6} opacity={0.8}/>
                      <path d="M-11,-8 A14,14 0 0 1 3,-14" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.6}/>
                    </g>
                  </g>
                );
              })}
              {/* two green leaves at the tip */}
              <g transform={`translate(${P2[0]} ${P2[1]})`}>
                <path d="M0,0 Q-34,-6 -52,-34 Q-18,-40 0,0 Z" fill="#7fb36a" stroke="#3f7a32" strokeWidth={2}/>
                <path d="M0,0 Q34,-6 52,-34 Q18,-40 0,0 Z" fill="#8fcf7a" stroke="#3f7a32" strokeWidth={2}/>
              </g>
            </g>
          );
        })()}
      </g>
    </g>
  );
};
export const CompoundLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  const P = fv("e16_comp", "p"), FIN = fv("e16_comp", "final");
  return (
    <>
      <FCard cx={960} y={64} text={L.cm.text} f={p.f} at={L.cm.at} size={38} maxW={1100} upper={false} tone="dark"/>
      <FCard cx={1420} y={DESK - P * PER + 14} text={L.p.text} f={p.f} at={L.p.at} size={30} maxW={420} upper={false}/>
      <FCard cx={330} y={330} text={L.yr.text} f={p.f} at={L.yr.at} size={34} maxW={320} upper={false} tone="red"/>
      <FCard cx={1420} y={DESK - FIN * PER - 112} text={L.fv.text} f={p.f} at={L.fv.at} size={40} maxW={420} upper={false} tone="green"/>
    </>
  );
};
export {eo, prog, ft, Shade};
