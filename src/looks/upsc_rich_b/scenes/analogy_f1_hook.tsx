// ECO-16 Part 2, builder F1: `deposit-hook` (b00). A bank counter, a customer slides a generic note across; the deposit bar rises to `dep`, a reserve block of `keep` splits off,
// a borrower's bar grows to `loan` from the same vault plinth (no source is drawn: the question is left open), a counter adds up to `total` and a big question mark pulses.
// Event keys d1, k, l, t are also the label keys. Bar lengths come from the table e16_p2 only.
import React from "react";
import {SANS, SERIF, W, H, clamp} from "../kit";
import {prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {Adult, Note, E1Defs, handPos, type Arms, type Look} from "./analogy_e1_kit";
import {F1Defs, pv, E, win, path, armTo, type P, type K} from "./analogy_f1_kit";

const CLERK: Look = {kind: "plain", female: true, shirt: ["#8a3d52", "#5a2234"], hair: "#1a120d", skin: 1, glasses: true};
const CUST: Look = {kind: "plain", shirt: ["#d9b26a", "#a5782e"], pants: "#3d4658", hair: "#1a120d", skin: 2, stache: true};
const CT = 640, CX = 470, CY = 950, CH = 560, KX = 760, KY = 904, KH = 480;
const BASE = 850;                          // the vault plinth top (bars stand on it)
const BAR_W = 150;
const BX = {reserve: 1110, you: 1330, borrower: 1700, mid: 1515};

const Bar: React.FC<{id: string; cx: number; h: number; unit: number; c1: string; c2: string; edge: string; f: number; shine?: number}> = ({id, cx, h, unit, c1, c2, edge, f, shine = 0}) => {
  if (h <= 0.5) return null;
  const n = Math.floor(h / unit + 1e-6);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={c1}/><stop offset="0.55" stopColor={c2}/><stop offset="1" stopColor={edge}/></linearGradient>
        <clipPath id={`${id}c`}><rect x={cx - BAR_W / 2} y={BASE - h} width={BAR_W} height={h + 4} rx={10}/></clipPath>
      </defs>
      <rect x={cx - BAR_W / 2 + 8} y={BASE - h + 8} width={BAR_W} height={h} rx={10} fill="#000" opacity={0.28}/>
      <g clipPath={`url(#${id}c)`}>
        <rect x={cx - BAR_W / 2} y={BASE - h} width={BAR_W} height={h + 4} fill={`url(#${id}g)`}/>
        {Array.from({length: n}, (_, i) => <path key={i} d={`M${cx - BAR_W / 2},${BASE - (i + 1) * unit} H${cx + BAR_W / 2}`} stroke="#fff" strokeWidth={2.4} opacity={0.42}/>)}
        <rect x={cx - BAR_W / 2 + 12} y={BASE - h + 6} width={20} height={Math.max(0, h - 12)} rx={8} fill="#fff" opacity={0.22}/>
        {shine > 0 && <rect x={cx - BAR_W / 2} y={BASE - h + ((f * 2.4 + cx) % (h + 140)) - 70} width={BAR_W} height={36} fill="#fff" opacity={0.18 * shine} transform={`skewY(-8)`}/>}
      </g>
      <rect x={cx - BAR_W / 2} y={BASE - h} width={BAR_W} height={h} rx={10} fill="none" stroke={edge} strokeWidth={3}/>
      <rect x={cx - BAR_W / 2 + 2} y={BASE - h + 2} width={BAR_W - 4} height={5} rx={3} fill="#fff" opacity={0.5}/>
    </g>
  );
};

export const HookArt: React.FC<AP> = (p) => {
  const {f, dur} = p;
  const aD = p.at("d1"), aK = p.at("k"), aL = p.at("l"), aT = Math.max(p.at("t"), aL + 12);
  const dep = pv("e16_p2", "dep"), keep = pv("e16_p2", "keep"), loan = pv("e16_p2", "loan"), total = pv("e16_p2", "total");
  const KP = 320 / dep.value, unit = keep.value * KP;
  // the note: held, slid across the counter, picked up by the clerk, dropped in the tray
  const T = Math.max(26, aD);
  const nk: K[] = [[0, 428, 600], [0.28 * T, 512, 626], [0.58 * T, 600, 632], [0.84 * T, 668, 628], [T + 2, 704, 626]];
  const N = path(nk, f), noteOn = f < T + 6;
  const wc = win(f, -6, 0.66 * T, 8), wk = win(f, 0.5 * T, T + 4, 8);
  const cArms: Arms = {L: [5, 8], R: armTo(CX, CY, CH, "R", [N[0] - 8, N[1] - 8], wc)};
  const kArms: Arms = {L: armTo(KX, KY, KH, "L", [N[0] + 8, N[1] - 6], wk), R: [10 + Math.sin(f / 8) * 2 * E(f, aD + 60, 20), 30 + (Math.sin(f / 8) > 0 ? 3 : 0)]};
  const flat = 0.5 - 0.17 * E(f, 0.2 * T, 0.5 * T);
  // the deposit: a little glow where the note lands, a spark that travels to the bar
  const land = Math.max(0, 1 - Math.abs(f - (T + 2)) / 16);
  const sp = prog(f, aD - 8, 40);
  const spP: P = [704 + (BX.you - 704) * E(f, aD - 8, 40), 626 - 300 * Math.sin(Math.PI * sp) * 1 + (BASE - 160 - 626) * E(f, aD - 8, 40)];
  // the bars
  const depGrow = E(f, aD, 42), kGrow = E(f, aK, 30), loanGrow = E(f, aL, 44);
  const depH = dep.value * KP * depGrow, loanH = loan.value * KP * loanGrow;
  const resX = BX.you + (BX.reserve - BX.you) * kGrow, resY = (1 - kGrow) * 0;
  const resH = keep.value * KP;
  const brOp = E(f, aK - 6, 12) * (1 - kGrow);
  // the sum
  const tA = E(f, aT, 16), cnt = Math.round(dep.value + (total.value - dep.value) * E(f, aT + 6, 46));
  const pulse = 1 + 0.06 * Math.sin(f / 6), qS = tA * pulse;
  const topY = (h: number) => BASE - h;
  return (
    <g>
      <F1Defs/><E1Defs/>
      {/* bank hall: warm wall, tall arched windows with daylight, wood wainscot */}
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#f1-plaster)"/>
      {Array.from({length: 14}, (_, i) => <path key={i} d={`M${i * 140 - 20},-20 V560`} stroke="#b88a52" strokeWidth={1.4} opacity={0.14}/>)}
      <rect x={0} y={0} width={960} height={96} fill="#7a4a2a" opacity={0.9}/><rect x={0} y={88} width={960} height={10} fill="#d9b45a" opacity={0.8}/>
      {[150, 400, 650].map((x, i) => (
        <g key={x}>
          <rect x={x - 12} y={148} width={150} height={404} rx={75} fill="#6a4228"/>
          <path d={`M${x},550 V220 Q${x},150 ${x + 63},148 Q${x + 126},150 ${x + 126},220 V550 Z`} fill="url(#e1-sky)" stroke="#3a2412" strokeWidth={3}/>
          <path d={`M${x + 63},148 V550 M${x},340 H${x + 126}`} stroke="#6a4228" strokeWidth={6}/>
          <path d={`M${x - 4},552 L${x + 140},552 L${x + 380 + i * 40},900 L${x + 120},900 Z`} fill="#fff2c4" opacity={0.2 - i * 0.03}/>
        </g>
      ))}
      <g transform="translate(540 0)"><path d="M0,0 V110" stroke="#2a2018" strokeWidth={3}/><circle cx={0} cy={124} r={120 + Math.sin(f / 13) * 4} fill="url(#f1-lamp)"/><circle cx={0} cy={124} r={14} fill="#fff6c8" stroke="#b8923a" strokeWidth={1.6}/></g>
      <rect x={0} y={552} width={960} height={120} fill="#7a4a2a" opacity={0.92}/>
      {Array.from({length: 7}, (_, i) => <rect key={i} x={20 + i * 140} y={566} width={120} height={92} rx={4} fill="none" stroke="#d9a468" strokeWidth={2} opacity={0.4}/>)}
      <rect x={0} y={552} width={960} height={8} fill="#d9b45a" opacity={0.7}/>
      {/* floor in front */}
      <rect x={-60} y={935} width={1100} height={H} fill="url(#f1-floor)"/>
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M-60,${950 + i * 24} Q500,${946 + i * 24} 1040,${950 + i * 24}`} stroke="#4a2c14" strokeWidth={1.4} opacity={0.35} fill="none"/>)}
      {/* the clerk, behind the counter */}
      <Adult x={KX} y={KY} h={KH} f={f} seed={31} look={CLERK} arms={kArms} hands={{L: "open", R: "relax"}} lookX={-0.6} smile={0.5}/>
      {/* counter: brass rail, tray, bell, lamp */}
      <rect x={90} y={CT} width={880} height={26} rx={5} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
      <rect x={90} y={CT} width={880} height={5} fill="#fff" opacity={0.3}/>
      <rect x={98} y={CT + 26} width={864} height={290} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
      {Array.from({length: 5}, (_, i) => <rect key={i} x={124 + i * 172} y={CT + 52} width={146} height={232} rx={6} fill="none" stroke="#d9a468" strokeWidth={2} opacity={0.42}/>)}
      <rect x={90} y={CT + 26} width={880} height={9} fill="url(#f1-brass)" opacity={0.9}/>
      <g transform={`translate(704 ${CT})`}>
        <path d="M-52,0 L-44,-14 L44,-14 L52,0 Z" fill="#8a5a30" stroke="#3a2412" strokeWidth={1.6}/><rect x={-44} y={-12} width={88} height={6} fill="#1a1008" opacity={0.6}/>
        {land > 0.01 && <ellipse cx={0} cy={-14} rx={80} ry={30} fill="url(#ak-sunglow)" opacity={land}/>}
      </g>
      <g transform={`translate(880 ${CT})`}><path d="M-6,0 V-84 Q-6,-98 20,-100" stroke="#3a3a42" strokeWidth={6} fill="none" strokeLinecap="round"/><path d="M8,-100 q22,-4 34,14 l-40,2 Z" fill="#c9962c" stroke="#8a5f12" strokeWidth={1.6}/><ellipse cx={26} cy={-82} rx={20} ry={10} fill="#fff2c0" opacity={0.5}/><rect x={-26} y={-6} width={40} height={8} rx={3} fill="#2a2a30"/></g>
      <g transform={`translate(190 ${CT})`}><ellipse cx={0} cy={0} rx={30} ry={5} fill="#2a1808" opacity={0.25}/><path d="M-22,0 L-18,-30 Q0,-40 18,-30 L22,0 Z" fill="url(#f1-brass)" stroke="#8a5f12" strokeWidth={1.6}/><circle cx={0} cy={-38} r={8} fill="url(#f1-brass)"/></g>
      <rect x={300} y={CT - 66} width={200} height={34} rx={5} fill="#2a3a5c" stroke="#d9b45a" strokeWidth={2.4}/>
      <text x={400} y={CT - 42} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing="0.34em" fill="#f6e3a8">DEPOSITS</text>
      {/* the customer, in front of the counter */}
      <Adult x={CX} y={CY} h={CH} f={f} seed={32} look={CUST} arms={cArms} hands={{R: "open"}} lookX={0.7} smile={0.5} talk={f < 0.66 * T}/>
      {noteOn && <g transform={`translate(${N[0]} ${N[1]}) rotate(${-4 + 4 * E(f, 0.1 * T, 0.6 * T)}) scale(0.5 ${flat})`}><Note s={1} sign/></g>}
      {sp > 0 && sp < 1 && <g transform={`translate(${spP[0]} ${spP[1]})`} opacity={Math.sin(Math.PI * sp)}><circle r={26} fill="url(#ak-sunglow)"/><g transform="scale(0.2)"><Note s={1} sign={false}/></g></g>}
      {/* the vault slab with the bars */}
      <rect x={980} y={96} width={880} height={806} rx={30} fill="#000" opacity={0.3} transform="translate(8 12)"/>
      <rect x={980} y={96} width={880} height={806} rx={30} fill="url(#f1-navy)" stroke="url(#f1-brass)" strokeWidth={5}/>
      <rect x={992} y={108} width={856} height={782} rx={22} fill="none" stroke="#d9b45a" strokeWidth={1.4} opacity={0.5}/>
      {Array.from({length: 7}, (_, i) => <path key={i} d={`M${1010 + i * 140},124 V${BASE - 6}`} stroke="#8aa0c8" strokeWidth={1} opacity={0.14}/>)}
      {[[1004, 120], [1836, 120], [1004, 878], [1836, 878]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={1}/>)}
      <ellipse cx={1420} cy={560} rx={420} ry={300} fill="#6a86c0" opacity={0.1}/>
      <rect x={1010} y={BASE} width={820} height={44} rx={8} fill="url(#f1-iron)" stroke="#1a2030" strokeWidth={2.4}/>
      <rect x={1010} y={BASE} width={820} height={6} fill="#fff" opacity={0.25}/>
      {[1040, 1230, 1420, 1610, 1800].map((x, i) => <circle key={i} cx={x} cy={BASE + 24} r={5} fill="#b8c2d2" stroke="#1a2030"/>)}
      <text x={1030} y={BASE + 32} fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing="0.34em" fill="#b8c2d2" opacity={0.85}>VAULT</text>
      <Bar id="f1y" cx={BX.you} h={depH} unit={unit} c1="#6aa6dc" c2="#3f78b8" edge="#1c4a80" f={f} shine={depGrow >= 1 ? 1 : 0}/>
      {depGrow > 0.5 && <text x={BX.you} y={BASE + 32} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing="0.2em" fill="#f4e7c4" opacity={E(f, aD + 20, 14)}>YOU</text>}
      {brOp > 0.01 && <g opacity={brOp}><path d={`M${BX.you - BAR_W / 2 - 14},${BASE - 4} V${BASE - resH + 4} M${BX.you - BAR_W / 2 - 14},${BASE - 4} h12 M${BX.you - BAR_W / 2 - 14},${BASE - resH + 4} h12`} stroke="#ffd36a" strokeWidth={5} fill="none" strokeLinecap="round"/><rect x={BX.you - BAR_W / 2} y={BASE - resH} width={BAR_W} height={resH} rx={6} fill="#ffd36a" opacity={0.28}/></g>}
      {kGrow > 0.001 && (
        <g transform={`translate(0 ${-resY})`}>
          <Bar id="f1r" cx={resX} h={resH} unit={resH} c1="#c3ccd8" c2="#8793a6" edge="#455064" f={f}/>
          {kGrow > 0.6 && <g transform={`translate(${resX} ${BASE - resH / 2})`} opacity={E(f, aK + 18, 12)}><rect x={-16} y={-4} width={32} height={26} rx={4} fill="#d9b45a" stroke="#6a4a10" strokeWidth={2}/><path d="M-9,-4 V-14 Q-9,-26 0,-26 Q9,-26 9,-14 V-4" fill="none" stroke="#d9b45a" strokeWidth={5}/><circle cx={0} cy={9} r={3.4} fill="#6a4a10"/></g>}
        </g>
      )}
      <Bar id="f1b" cx={BX.borrower} h={loanH} unit={unit} c1="#f6b868" c2="#e08a2c" edge="#8a4a10" f={f} shine={loanGrow >= 1 ? 1 : 0}/>
      {loanGrow > 0.5 && <text x={BX.borrower} y={BASE + 32} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing="0.2em" fill="#f4e7c4" opacity={E(f, aL + 22, 14)}>BORROWER</text>}
      {loanGrow > 0.02 && loanGrow < 1 && <ellipse cx={BX.borrower} cy={BASE - 4} rx={BAR_W * 0.72} ry={14} fill="#ffd37a" opacity={0.5 * Math.sin(Math.PI * loanGrow)} filter="url(#ak-blur8)"/>}
      {/* the sum: a brass plate above the two bars, thin lines from each bar top, and the question between them */}
      {tA > 0.01 && (
        <g opacity={tA}>
          <path d={`M${BX.you},${topY(depH) - 8} Q${BX.you + 20},${300} ${BX.mid - 70},${352}`} stroke="#ffd36a" strokeWidth={3} strokeDasharray="4 9" fill="none" strokeLinecap="round"/>
          <path d={`M${BX.borrower},${topY(loanH) - 8} Q${BX.borrower - 20},${300} ${BX.mid + 70},${352}`} stroke="#ffd36a" strokeWidth={3} strokeDasharray="4 9" fill="none" strokeLinecap="round"/>
          <g transform={`translate(${BX.mid} ${290 + (1 - tA) * 16})`}>
            <rect x={-150} y={-62} width={300} height={120} rx={18} fill="#000" opacity={0.3} transform="translate(5 8)"/>
            <rect x={-150} y={-62} width={300} height={120} rx={18} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={3}/>
            <rect x={-136} y={-48} width={272} height={92} rx={10} fill="#1a2238" stroke="#5a3c0a" strokeWidth={2}/>
            <text x={0} y={22} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={78} fill="#fff0c4">₹{cnt}</text>
          </g>
        </g>
      )}
      {tA > 0.01 && (
        <g transform={`translate(${BX.mid} 640) scale(${qS})`} opacity={tA}>
          <circle r={104} fill="url(#ak-sunglow)" opacity={0.55 + 0.2 * Math.sin(f / 6)}/>
          <text x={0} y={92} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={270} fill="#5a3c0a" transform="translate(5 6)" opacity={0.5}>?</text>
          <text x={0} y={92} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={270} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={4}>?</text>
        </g>
      )}
    </g>
  );
};

export const HookLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  const [d1, k, l, t] = [L[0], L[1], L[2], L[3]];
  const tt = t ? Math.max(t.at, (L[2]?.at ?? 0) + 12) : 0;
  return (
    <>
      {d1 && <P2Card cx={BX.you} y={372} text={d1.text} f={p.f} at={d1.at} size={30} maxW={420} upper={false}/>}
      {k && <P2Card cx={1090} y={520} text={k.text} f={p.f} at={k.at} size={27} maxW={250} upper={false} tone="cool"/>}
      {l && <P2Card cx={BX.borrower} y={458} text={l.text} f={p.f} at={l.at} size={30} maxW={300} upper={false} tone="green"/>}
      {t && <P2Card cx={BX.mid} y={112} text={t.text} f={p.f} at={tt} size={34} maxW={640} upper={false}/>}
    </>
  );
};
