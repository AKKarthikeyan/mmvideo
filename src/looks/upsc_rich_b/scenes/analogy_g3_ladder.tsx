// ECO-16 Part 3, builder G3: `access-ladder` (b07). A ladder leans on a bank's counter ledge. rh: the top rungs fill with people (richer households). pd: a group stands at the foot, beside a
// moneylender's low table (a few notes, a strongbox, no ledger). gs: a wider ladder is drawn beside the first with people on its lowest rungs. ac: a padlock marked COLLATERAL hangs on the lowest rung of the first.
// Neutral throughout: everyone is drawn with the same care, nobody is mocked.
import React from "react";
import {ECard, Specks} from "./analogy_f3_kit";
import {Plaza} from "./analogy_e3_kit";
import {Padlock} from "./analogy_e2_kit";
import {Adult, type Look} from "./analogy_e1_kit";
import {Coin} from "./analogy_f3_kit";
import {G3Defs, HangTag, elabs, E, SANS, SERIF, W, H, eo, prog, lerp, clamp, type AP} from "./analogy_g3_kit";

const GROUND = 850;
const FX0 = 900, FX1 = 1880;                       // the bank facade
const LEDGE = 430;
const RUNG_Y = [500, 560, 620, 680, 740, 800];     // top to bottom; the last is the lowest rung

type Lad = {b0: number; b1: number; t0: number; t1: number};
const LA: Lad = {b0: 985, b1: 1245, t0: 1030, t1: 1290};
const LB: Lad = {b0: 1420, b1: 1810, t0: 1450, t1: 1840};
const railX = (l: Lad, y: number): [number, number] => { const u = (GROUND - y) / (GROUND - LEDGE); return [lerp(l.b0, l.t0, u), lerp(l.b1, l.t1, u)]; };

const LOOKS: Look[] = [
  {kind: "plain", shirt: ["#6c8fb5", "#41607f"], pants: "#3d4658", hair: "#1a120d", skin: 0, glasses: true},
  {kind: "saree", accent: "#2f7a8a", hair: "#1a120d", skin: 1, female: true},
  {kind: "kurta", shirt: ["#e8dcc4", "#b8a888"], pants: "#efe6cf", hair: "#2b1d14", skin: 2, stache: true},
  {kind: "plain", female: true, shirt: ["#9a6fa0", "#6a4472"], pants: "#31405a", hair: "#2b1d14", skin: 3},
  {kind: "plain", shirt: ["#7fa58a", "#4d7358"], pants: "#5a4a3a", hair: "#8a8a86", skin: 1, stache: true},
  {kind: "saree", accent: "#c0603d", hair: "#2b1d14", skin: 2, female: true},
  {kind: "plain", shirt: ["#d9b26a", "#a5782e"], pants: "#3a3f52", hair: "#1a120d", skin: 0},
  {kind: "gamcha", shirt: ["#e8dcc4", "#b8a888"], pants: "#6b5b4a", hair: "#1a120d", skin: 2},
];

const Ladder: React.FC<{l: Lad; k: number; glow?: number; id: string}> = ({l, k, glow = 0, id}) => {
  const top = GROUND - (GROUND - LEDGE + 14) * k;
  return (
    <g>
      <defs><clipPath id={`${id}-c`}><rect x={0} y={top} width={W} height={GROUND + 60 - top}/></clipPath></defs>
      {glow > 0.01 ? <ellipse cx={(l.b0 + l.b1) / 2 + 20} cy={620} rx={(l.b1 - l.b0) * 0.8} ry={330} fill="url(#ak-sunglow)" opacity={glow}/> : null}
      <g clipPath={`url(#${id}-c)`}>
        <ellipse cx={(l.b0 + l.b1) / 2} cy={GROUND + 8} rx={(l.b1 - l.b0) * 0.62} ry={12} fill="#2a1808" opacity={0.3} filter="url(#ak-blur8)"/>
        {[0, 1].map((s) => {
          const xb = s ? l.b1 : l.b0, xt = s ? l.t1 : l.t0;
          return (
            <g key={s}>
              <path d={`M${xb},${GROUND + 6} L${xt},${LEDGE - 14}`} stroke="#4e361c" strokeWidth={26} strokeLinecap="round"/>
              <path d={`M${xb},${GROUND + 6} L${xt},${LEDGE - 14}`} stroke="#9a6a3a" strokeWidth={20} strokeLinecap="round"/>
              <path d={`M${xb - 5},${GROUND + 6} L${xt - 5},${LEDGE - 14}`} stroke="#d8aa72" strokeWidth={5} strokeLinecap="round" opacity={0.7}/>
            </g>
          );
        })}
        {RUNG_Y.map((y, i) => { const [a, b] = railX(l, y); return (
          <g key={i}>
            <path d={`M${a + 6},${y + 4} H${b - 6}`} stroke="#4e361c" strokeWidth={17} strokeLinecap="round"/>
            <path d={`M${a + 6},${y + 4} H${b - 6}`} stroke="#b07a44" strokeWidth={12} strokeLinecap="round"/>
            <path d={`M${a + 10},${y} H${b - 10}`} stroke="#e2bb84" strokeWidth={3.6} strokeLinecap="round" opacity={0.8}/>
          </g>
        ); })}
      </g>
    </g>
  );
};

/** a person standing on a rung (feet at the rung) */
const OnRung: React.FC<{l: Lad; rung: number; slot: number; of: number; a: number; f: number; seed: number; h?: number}> = ({l, rung, slot, of, a, f, seed, h = 118}) => {
  if (a <= 0.01) return null;
  const y = RUNG_Y[rung], [x0, x1] = railX(l, y), x = lerp(x0 + 40, x1 - 40, of === 1 ? 0.5 : slot / (of - 1)) + (rung % 2 ? 10 : -6);
  return (
    <g opacity={a} transform={`translate(0 ${(1 - a) * 18})`}>
      <Adult x={x} y={y} h={h} f={f} seed={seed} look={LOOKS[seed % LOOKS.length]} arms={{L: [5, 8], R: [5, 8]}} lookX={0.3} smile={0.5} ph={seed * 7} legsHidden={false}/>
    </g>
  );
};

const Facade: React.FC<{f: number}> = ({f}) => {
  const blocks: React.ReactNode[] = [];
  for (let r = 0; r < 11; r++) for (let c = 0; c < 12; c++) {
    const x = FX0 + (r % 2) * 40 + c * 90, y = LEDGE + 28 + r * 38;
    if (y < GROUND - 20) blocks.push(<rect key={`${r}-${c}`} x={x} y={y} width={90} height={38} fill="none" stroke="#8f826a" strokeWidth={1.2} opacity={0.3}/>);
  }
  return (
    <g>
      <rect x={FX0 - 6} y={186} width={FX1 - FX0 + 12} height={GROUND - 186 + 4} fill="#2a1808" opacity={0.18} transform="translate(-10 8)"/>
      <rect x={FX0} y={214} width={FX1 - FX0} height={GROUND - 214} fill="url(#f1-stone)" stroke="#8f826a" strokeWidth={2}/>
      {blocks}
      <rect x={FX0 + 40} y={LEDGE + 20} width={30} height={GROUND - LEDGE - 20} fill="#fff" opacity={0.08}/>
      <rect x={FX0 - 24} y={184} width={FX1 - FX0 + 48} height={30} fill="#d9cfbd" stroke="#8f826a" strokeWidth={2}/>
      <rect x={FX0 - 10} y={214} width={FX1 - FX0 + 20} height={12} fill="#cfc4ac" stroke="#8f826a" strokeWidth={1.6}/>
      {Array.from({length: 22}, (_, i) => <rect key={i} x={FX0 - 14 + i * 46} y={194} width={26} height={14} rx={2} fill="#c3b79c" opacity={0.7}/>)}
      {/* the sign band */}
      <rect x={1270} y={238} width={320} height={58} rx={6} fill="url(#f1-navy)" stroke="#d9b45a" strokeWidth={3}/>
      <text x={1430} y={280} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={36} letterSpacing="0.34em" fill="#f6e3a8">BANK</text>
      {/* the counter window: warm room behind, two clerks */}
      <path d={`M${FX0 + 60},${LEDGE} V340 Q${FX0 + 60},306 ${FX0 + 94},306 H${FX1 - 150} Q${FX1 - 116},306 ${FX1 - 116},340 V${LEDGE} Z`} fill="#6a4a30"/>
      <path d={`M${FX0 + 72},${LEDGE} V342 Q${FX0 + 72},318 ${FX0 + 96},318 H${FX1 - 152} Q${FX1 - 128},318 ${FX1 - 128},342 V${LEDGE} Z`} fill="url(#f1-plaster)"/>
      <rect x={FX0 + 72} y={318} width={FX1 - FX0 - 200} height={80} fill="#f6e3b0" opacity={0.4}/>
      {[1060, 1440, 1700].map((x, i) => <g key={i}><rect x={x} y={326} width={86} height={70} fill="#6a4228" stroke="#3a2412" strokeWidth={2}/>{[0, 1].map((k) => <rect key={k} x={x + 6} y={332 + k * 32} width={74} height={26} rx={2} fill="none" stroke="#d9a468" strokeWidth={1.6} opacity={0.55}/>)}</g>)}
      {[1180, 1560].map((x, i) => <g key={i}><path d={`M${x},318 V332`} stroke="#2a2018" strokeWidth={3}/><circle cx={x} cy={346} r={34 + Math.sin(f / 13 + i) * 2} fill="url(#f1-lamp)"/></g>)}
      <Adult x={1230} y={LEDGE + 2} h={176} f={f} seed={61} look={{kind: "plain", shirt: ["#6c8fb5", "#41607f"], pants: "#3d4658", hair: "#1a120d", skin: 0, glasses: true}} lookX={-0.2} smile={0.5} arms={{L: [10, 40], R: [10, 40]}} legsHidden/>
      <Adult x={1650} y={LEDGE + 2} h={176} f={f} seed={62} look={{kind: "plain", female: true, shirt: ["#7fa58a", "#4d7358"], pants: "#3d4658", hair: "#1a120d", skin: 1}} lookX={0.2} smile={0.5} arms={{L: [10, 40], R: [10, 40]}} legsHidden/>
      {/* the ledge the ladders lean on */}
      <rect x={FX0 + 30} y={LEDGE} width={FX1 - FX0 - 60} height={26} rx={4} fill="#e3d9c3" stroke="#8f826a" strokeWidth={2}/>
      <rect x={FX0 + 30} y={LEDGE} width={FX1 - FX0 - 60} height={6} rx={3} fill="#fff" opacity={0.6}/>
      <rect x={FX0 + 30} y={LEDGE + 26} width={FX1 - FX0 - 60} height={10} fill="#2a1808" opacity={0.18}/>
      <rect x={FX0 - 10} y={GROUND - 20} width={FX1 - FX0 + 20} height={20} fill="#cfc4ac" stroke="#8f826a" strokeWidth={1.6}/>
    </g>
  );
};

/** the moneylender's low table: a few notes, a strongbox, a lamp; no ledger, nothing written down */
const LenderTable: React.FC<{f: number; a: number; glow: number}> = ({f, a, glow}) => {
  if (a <= 0.01) return null;
  const TY = 752;
  return (
    <g opacity={a}>
      {glow > 0.01 ? <ellipse cx={270} cy={TY - 60} rx={290} ry={210} fill="url(#ak-sunglow)" opacity={glow * 0.8}/> : null}
      <ellipse cx={266} cy={886} rx={190} ry={16} fill="#2a1808" opacity={0.28} filter="url(#ak-blur8)"/>
      <Adult x={266} y={880} h={340} f={f} seed={91} look={{kind: "kurta", shirt: ["#f1ead6", "#bdb08a"], pants: "#efe6cf", hair: "#8a8a86", skin: 1, glasses: true, stache: true}} arms={{L: [26, 60], R: [26, 60]}} hands={{L: "open", R: "open"}} lookX={0.5} smile={0.2} legsHidden/>
      <rect x={90} y={TY} width={352} height={22} rx={4} fill="#f4ead0" stroke="#b8a074" strokeWidth={2}/>
      <rect x={100} y={TY + 22} width={332} height={118} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
      {[0, 1, 2].map((i) => <rect key={i} x={112 + i * 106} y={TY + 34} width={92} height={94} rx={5} fill="none" stroke="#d9a468" strokeWidth={2} opacity={0.42}/>)}
      <rect x={90} y={TY + 136} width={352} height={8} fill="#2a1808" opacity={0.25}/>
      {/* a few notes fanned on the table, a strongbox, a brass lamp */}
      {[-10, 2, 14].map((r, i) => <g key={i} transform={`translate(${196 + i * 16} ${TY - 4}) rotate(${r})`}><rect x={-34} y={-14} width={68} height={28} rx={3} fill="url(#e2-note)" stroke="#4f7f60" strokeWidth={1.4}/><ellipse cx={0} cy={0} rx={9} ry={7} fill="none" stroke="#4f7f60" strokeWidth={1.2}/></g>)}
      <g transform={`translate(372 ${TY})`}><rect x={-36} y={-46} width={72} height={46} rx={4} fill="url(#f1-iron)" stroke="#1a2030" strokeWidth={2}/><rect x={-32} y={-28} width={64} height={5} fill="url(#f1-brass)"/><circle cx={0} cy={-36} r={4.4} fill="#d9b45a"/></g>
      <g transform={`translate(130 ${TY})`}><path d="M-18,0 Q-16,-14 0,-16 Q16,-14 18,0 Z" fill="url(#f1-brass)" stroke="#6a4a10" strokeWidth={1.4}/><ellipse cx={0} cy={-22} rx={5} ry={10 + Math.sin(f / 4) * 1.2} fill="#fff2c0"/><circle cx={0} cy={-18} r={34} fill="url(#f1-lamp)" opacity={0.7}/></g>
    </g>
  );
};

export const AccessLadderArt: React.FC<{f: number; dur: number; spec: any; at: (k: string) => number}> = (p) => {
  const {f} = p, L = elabs(p), rh = L.rh.at, pd = L.pd.at, gs = L.gs.at, ac = L.ac.at;
  const aB = E(f, gs, 44);
  const pdA = E(f, pd, 24);
  const lock = E(f, ac, 18), click = clamp((f - ac - 14) / 16);
  const [lx0, lx1] = railX(LA, RUNG_Y[5]);
  const grpX = [560, 650, 740, 830, 920], grpLook = [3, 5, 1, 6, 4];
  const grp = grpX.map((x, i) => { const t = pd + 6 + i * 8, w = E(f, t, 40); return {x: lerp(x - 260, x, w), a: E(f, t, 14), walk: 1 - w > 0.02 ? 1 : 0}; });
  // coins go from the table to the group while they depend on it
  const flow = [0, 1, 2].map((k) => ((f - pd) * 0.018 + k / 3) % 1);
  return (
    <g>
      <G3Defs/>
      <Plaza id="g3ls" ground={GROUND} f={f}/>
      <Facade f={f}/>
      {/* the second, wider ladder (gs) */}
      <Ladder l={LB} k={aB} glow={aB * 0.5} id="g3lb"/>
      {[[5, 0, 3], [5, 1, 3], [5, 2, 3], [4, 0, 3], [4, 1, 3], [4, 2, 3], [3, 0, 2], [3, 1, 2]].map(([rg, sl, of], i) => <OnRung key={i} l={LB} rung={rg} slot={sl} of={of} a={E(f, gs + 36 + i * 7, 16) * aB} f={f} seed={i + 3}/>)}
      {/* the first ladder */}
      <Ladder l={LA} k={1} id="g3la" glow={E(f, rh, 24) * 0.0}/>
      {[[0, 0, 3], [0, 1, 3], [0, 2, 3], [1, 0, 3], [1, 1, 3], [1, 2, 3], [2, 0, 2], [2, 1, 2]].map(([rg, sl, of], i) => <OnRung key={i} l={LA} rung={rg} slot={sl} of={of} a={E(f, rh + i * 6, 16)} f={f} seed={i + 1}/>)}
      {E(f, rh, 24) > 0.01 ? <ellipse cx={1160} cy={540} rx={250} ry={110} fill="url(#ak-sunglow)" opacity={0.35 * E(f, rh, 24) * (1 - 0.6 * E(f, pd, 30))}/> : null}
      {/* the lowest rung stays empty; the lock hangs on it (ac) */}
      {lock > 0.01 ? (
        <g opacity={lock} transform={`translate(0 ${(1 - lock) * -40})`}>
          <ellipse cx={(lx0 + lx1) / 2} cy={RUNG_Y[5] - 30} rx={120} ry={60} fill="url(#ak-sunglow)" opacity={0.5}/>
          <Padlock x={(lx0 + lx1) / 2} y={RUNG_Y[5] - 62} s={1.1} closed={lock} click={click}/>
        </g>
      ) : null}
      <HangTag x={(lx0 + lx1) / 2 + 118} y={RUNG_Y[5] - 56} w={250} h={60} text={((/collateral/i.exec(L.ac.text) ?? ["collateral"])[0]).toUpperCase()} a={E(f, ac + 10, 18)} size={26} f={f} rot={5} edge="#8c1f1a" ink="#6a1d16"/>
      {/* the foot: a moneylender's table and the group who depend on it (pd) */}
      <LenderTable f={f} a={pdA} glow={pdA * (0.5 + 0.2 * Math.sin(f / 12))}/>
      {grp.map((g, i) => (
        <g key={i} opacity={g.a}>
          <Adult x={g.x} y={884} h={236} f={f} seed={i + 21} look={LOOKS[grpLook[i]]} arms={i === 2 ? {L: [6, 10], R: [22, -50]} : {L: [5, 8], R: [5, 8]}} lookX={-0.7} smile={0.2} walkAmt={g.walk} ph={i * 9}/>
        </g>
      ))}
      {pdA > 0.4 && flow.map((u, k) => <Coin key={k} x={lerp(380, 560, u)} y={lerp(738, 690, u) - Math.sin(Math.PI * u) * 70} r={13} spin={f / 5 + k} op={Math.min(1, u * 6, (1 - u) * 6) * pdA * 0.9}/>)}
      <Specks f={f} n={14} seed={5} y0={200} y1={820}/>
    </g>
  );
};

export const AccessLadderLabels: React.FC<AP> = (p) => {
  const L = elabs(p), f = p.f;
  return (
    <>
      <ECard cx={470} y={90} text={L.rh.text} f={f} at={L.rh.at} size={34} maxW={720} upper={false}/>
      <ECard cx={470} y={262} text={L.pd.text} f={f} at={L.pd.at} size={34} maxW={720} upper={false} tone="cool"/>
      <ECard cx={640} y={436} text={L.ac.text} f={f} at={L.ac.at} size={32} maxW={760} upper={false} tone="red"/>
      <ECard cx={1400} y={64} text={L.gs.text} f={f} at={L.gs.at} size={34} maxW={900} upper={false} tone="green"/>
    </>
  );
};
