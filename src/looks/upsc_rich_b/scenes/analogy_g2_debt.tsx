// ECO-16 Part 3, builder G2: `debt-bars`. mode "kinds" (b04a): two scenes side by side, FORMAL (a bank and a cooperative) and INFORMAL (a moneylender, a trader, an employer, relatives and friends; the moneylender keeps no book).
// mode "bars" (b04b; ref e16_debt): two long bars, RURAL and URBAN, each split into institutional (formal) and non-institutional in the table's proportions: every length is read from the table.
import React from "react";
import {Adult, Classical, E1Defs, F1Defs, F3Defs, G2Defs, Desk, FCard, Shade, Tag, E, Z, pop, ft, fv, prog, eo, rng, elabs, SANS, SERIF, W, H} from "./analogy_g2_kit";
import {House, Palm} from "./analogy_f1_kit";
import {Hills, Cloud, Person, type AP} from "./analogy_kit";

const PL = {x: 96, y: 232, w: 804, h: 650}, PR = {x: 1020, y: 232, w: 804, h: 650};

/** a framed picture panel: soft shadow, brass edge, clip */
const Panel: React.FC<{id: string; r: {x: number; y: number; w: number; h: number}; a: number; children: React.ReactNode}> = ({id, r, a, children}) => (
  <g opacity={a} transform={`translate(0 ${(1 - a) * 30})`}>
    <defs><clipPath id={`${id}-c`}><rect x={r.x} y={r.y} width={r.w} height={r.h} rx={26}/></clipPath></defs>
    <rect x={r.x + 10} y={r.y + 20} width={r.w} height={r.h} rx={26} fill="#2a1808" opacity={0.34} filter="url(#e3-glow)"/>
    <g clipPath={`url(#${id}-c)`}>{children}</g>
    <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={26} fill="none" stroke="#a8741c" strokeWidth={5}/>
    <rect x={r.x + 8} y={r.y + 8} width={r.w - 16} height={r.h - 16} rx={20} fill="none" stroke="#fff3c0" strokeWidth={1.6} opacity={0.5}/>
  </g>
);

// ---- formal ------------------------------------------------------------------------------------------------------------------------
const CoopHall: React.FC<{x: number; y: number; w: number; h: number; a: number; f: number}> = ({x, y, w, h, a, f}) => {
  if (a <= 0.002) return null;
  return (
    <g opacity={a} transform={`translate(0 ${(1 - a) * 24})`}>
      <ellipse cx={x} cy={y + 4} rx={w * 0.66} ry={14} fill="#2a1808" opacity={0.3}/>
      <rect x={x - w / 2} y={y - h} width={w} height={h} fill="#efe0bd" stroke="#9a8460" strokeWidth={2.4}/>
      <rect x={x + w * 0.18} y={y - h} width={w * 0.32} height={h} fill="#8a6a46" opacity={0.15}/>
      <path d={`M${x - w / 2 - 22},${y - h + 6} L${x},${y - h - h * 0.4} L${x + w / 2 + 22},${y - h + 6} Z`} fill="#3f8f4f" stroke="#1d5a2c" strokeWidth={3} strokeLinejoin="round"/>
      <path d={`M${x},${y - h - h * 0.4} L${x + w / 2 + 22},${y - h + 6} L${x},${y - h + 6} Z`} fill="#000" opacity={0.15}/>
      <rect x={x - w * 0.44} y={y - h * 0.74} width={w * 0.88} height={h * 0.2} rx={4} fill="#2a6f3a" stroke="#1d5a2c" strokeWidth={2}/>
      <text x={x} y={y - h * 0.74 + h * 0.145} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={h * 0.095} letterSpacing={h * 0.012} fill="#f6ecc4">COOPERATIVE</text>
      <path d={`M${x - w * 0.14},${y} V${y - h * 0.34} Q${x},${y - h * 0.46} ${x + w * 0.14},${y - h * 0.34} V${y} Z`} fill="#4a3220" stroke="#2a1a0c" strokeWidth={2}/>
      {[-1, 1].map((s) => <rect key={s} x={x + s * w * 0.32 - w * 0.07} y={y - h * 0.42} width={w * 0.14} height={h * 0.2} fill="#9fcfe6" stroke="#6e4524" strokeWidth={2}/>)}
      {[-1, 0, 1].map((s) => (
        <g key={s} transform={`translate(${x + s * w * 0.3 + w * 0.5} ${y})`}>
          <path d="M-18,0 Q-24,-34 -4,-40 Q16,-34 18,0 Z" fill="#e7d6a8" stroke="#8a7440" strokeWidth={2.4}/>
          <path d="M-8,-38 q4,-8 8,0 q4,-8 8,0" stroke="#8a7440" strokeWidth={2} fill="none"/>
        </g>
      )).slice(0, 2)}
    </g>
  );
};

/** a classical building whose frieze reads BANK (a generic sign), scaled by the pop */
const BankBlock: React.FC<{x: number; y: number; w: number; h: number; k: number; id: string}> = ({x, y, w, h, k, id}) => (
  <g transform={`translate(${x} ${y}) scale(${0.92 + 0.08 * k}) translate(${-x} ${-y})`} opacity={Math.min(1, k * 2)}>
    <Classical x={x} y={y} w={w} h={h} text="BANK" id={id} cols={6} textSize={34}/>
  </g>
);

const FormalScene: React.FC<{f: number; at: number}> = ({f, at}) => (
  <g>
    <rect x={PL.x} y={PL.y} width={PL.w} height={PL.h} fill="url(#e1-sky)"/>
    <Cloud x={300} y={340} s={0.8} f={f} speed={0.14} seed={3} a={0.8}/>
    <Hills id="g2dh1" base={560} amp={46} top="#b9cbdd" bottom="#d6dfe0" seed={2.3} wl={290}/>
    {[0, 1, 2, 3, 4].map((i) => <g key={i} opacity={0.5}><rect x={PL.x + 40 + i * 156} y={470 + ((i * 53) % 70)} width={96} height={400} fill={i % 2 ? "#aebdd0" : "#bfb9cc"}/>{[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={PL.x + 58 + i * 156 + c * 38} y={500 + ((i * 53) % 70) + r * 52} width={22} height={30} fill="#e9eef4" opacity={0.7}/>))}</g>)}
    <rect x={PL.x} y={740} width={PL.w} height={PL.h} fill="#d9c59a"/>
    <rect x={PL.x} y={738} width={PL.w} height={14} fill="#f6e6c4"/>
    {Array.from({length: 6}, (_, i) => <path key={i} d={`M${PL.x},${770 + i * 26} H${PL.x + PL.w}`} stroke="#a8864c" strokeWidth={1.4} opacity={0.3}/>)}
    <BankBlock x={352} y={772} w={450} h={430} k={pop(f, at + 6, 26)} id="g2bk"/>
    <CoopHall x={690} y={772} w={250} h={230} a={Z(f, at + 40, 26)} f={f}/>
    <g opacity={Z(f, at + 20, 30)}>
      <Person x={250} y={800} h={230} f={f} seed={41} ph={3}/><Person x={420} y={808} h={246} f={f} seed={44} ph={9}/><Person x={560} y={800} h={222} f={f} seed={47} ph={15}/>
    </g>
    <ellipse cx={500} cy={800} rx={300} ry={30} fill="#fff1c8" opacity={0.2} filter="url(#ak-blur22)"/>
  </g>
);

// ---- informal ----------------------------------------------------------------------------------------------------------------------
const Notes: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[[0, 0, -6], [14, -8, 4], [-8, -10, -14]].map(([dx, dy, rot], i) => (
      <g key={i} transform={`translate(${dx} ${dy}) rotate(${rot})`}><rect x={-30} y={-14} width={60} height={28} rx={3} fill="url(#e2-note)" stroke="#486b46" strokeWidth={1.6}/><ellipse cx={-12} cy={0} rx={8} ry={10} fill="none" stroke="#486b46" strokeWidth={1.2} opacity={0.6}/></g>
    ))}
  </g>
);

const Sack: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shade x={0} y={2} rx={42} ry={8} o={0.3}/>
    <path d="M-34,0 Q-44,-60 -12,-74 Q22,-60 34,0 Z" fill="#e7d6a8" stroke="#8a7440" strokeWidth={2.6}/>
    <path d="M-14,-72 q6,-12 12,0 q6,-12 12,0" stroke="#8a7440" strokeWidth={3} fill="none"/>
    <path d="M-28,-30 q26,16 56,0" stroke="#8a7440" strokeWidth={2} fill="none" opacity={0.6}/>
  </g>
);

const Pers: React.FC<{k: number; x: number; y: number; h: number; f: number; seed: number; look: any; arms?: any; hands?: any}> = ({k, x, y, h, f, seed, look, arms, hands}) => (
  k > 0.01 ? <g opacity={Math.min(1, k * 1.8)} transform={`translate(0 ${(1 - k) * 22})`}><Adult x={x} y={y} h={h} f={f} seed={seed} look={look} arms={arms} hands={hands} lookX={-0.4}/></g> : null
);

const InformalScene: React.FC<{f: number; at: number}> = ({f, at}) => {
  const par = Math.sin(f / 90) * 4;
  const GY = 770;
  const k = [pop(f, at + 6, 24), pop(f, at + 40, 24), pop(f, at + 74, 24), pop(f, at + 108, 24)];
  return (
    <g>
      <rect x={PR.x} y={PR.y} width={PR.w} height={PR.h} fill="url(#e1-sky)"/>
      <Cloud x={1300} y={330} s={0.7} f={f} speed={0.1} seed={9} a={0.75}/>
      <g transform={`translate(${par} 0)`}>
        <Hills id="g2dh2" base={560} amp={40} top="#b9cbdd" bottom="#d6dfe0" seed={1.1} wl={300}/>
        <Hills id="g2dh3" base={640} amp={26} top="#a7c2a4" bottom="#cbd8aa" seed={3.7} wl={240}/>
        <Palm x={1100} y={700} s={0.55} f={f} seed={4} op={0.9}/><Palm x={1790} y={700} s={0.5} f={f} seed={6} op={0.9}/>
      </g>
      <g transform={`translate(${par * 1.5} 0)`}>
        <House x={1230} y={730} w={150} h={110} wall="#e8cf9f" roof="#b4562e" op={0.9}/>
        <House x={1540} y={726} w={170} h={120} wall="#d9b08a" roof="#9a4228" op={0.88}/>
      </g>
      <rect x={PR.x} y={GY - 40} width={PR.w} height={PR.h} fill="url(#e1-ground)"/>
      <rect x={PR.x} y={GY - 40} width={PR.w} height={16} fill="#f0dcb4" opacity={0.7}/>
      {Array.from({length: 5}, (_, i) => <path key={i} d={`M${PR.x},${GY + i * i * 6 + i * 18} H${PR.x + PR.w}`} stroke="#6a4a2a" strokeWidth={1.2} opacity={0.16}/>)}
      {/* the moneylender: a few notes in hand and a low table with a few notes, nothing written down */}
      <g opacity={Math.min(1, k[0] * 1.8)}>
        <g transform={`translate(1196 ${GY - 30})`}>
          <Shade x={0} y={36} rx={64} ry={9} o={0.3}/>
          <rect x={-58} y={-8} width={116} height={14} rx={3} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
          <rect x={-48} y={6} width={9} height={30} fill="#7a4c26"/><rect x={39} y={6} width={9} height={30} fill="#7a4c26"/>
          <Notes x={0} y={-20} s={0.9}/>
        </g>
      </g>
      <Pers k={k[0]} x={1120} y={GY + 6} h={380} f={f} seed={3} look={{kind: "kurta", shirt: ["#cfd6e0", "#8a98ae"], pants: "#e8e2d2", hair: "#8a8a86", stache: true}} arms={{R: [30, 70]}} hands={{R: "open"}}/>
      {/* the trader: apron and a sack of grain */}
      <g opacity={Math.min(1, k[1] * 1.8)}><Sack x={1386} y={GY + 10} s={1.25}/></g>
      <Pers k={k[1]} x={1300} y={GY + 12} h={376} f={f} seed={11} look={{kind: "apron", shirt: ["#e8dcc4", "#b8a888"], pants: "#5a4a3a"}} arms={{L: [26, 62]}} hands={{L: "open"}}/>
      {/* the employer: a shirt and trousers, the pay sheet on a clipboard */}
      <Pers k={k[2]} x={1480} y={GY + 16} h={384} f={f} seed={5} look={{kind: "plain", shirt: ["#6c8fb5", "#41607f"], pants: "#2e3a35", glasses: true}} arms={{R: [24, 82]}} hands={{R: "fist"}}/>
      <g opacity={Math.min(1, k[2] * 1.8)} transform="translate(1536 520) rotate(-6) scale(1.25)">
        <rect x={-30} y={-40} width={60} height={80} rx={4} fill="#8a5a34" stroke="#4a2c14" strokeWidth={2.4}/><rect x={-24} y={-32} width={48} height={66} fill="url(#g2-sheet)"/>
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M-17,${-20 + i * 14} h${34 - (i % 2) * 10}`} stroke="#7a6a52" strokeWidth={3.4} strokeLinecap="round" opacity={0.6}/>)}
        <rect x={-12} y={-46} width={24} height={10} rx={3} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={1.6}/>
      </g>
      {/* relatives and friends: two adults side by side */}
      <Pers k={k[3]} x={1632} y={GY + 24} h={364} f={f} seed={21} look={{kind: "saree", accent: "#b23a48"}} lookX={0.3}/>
      <Pers k={k[3]} x={1722} y={GY + 30} h={338} f={f} seed={25} look={{kind: "gamcha", shirt: ["#7fa58a", "#4d7358"], pants: "#f0e8d4"}}/>
    </g>
  );
};

export const DebtKindsArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), a0 = Z(f, 0, 30);
  const fmA = Z(f, L.fm.at - 6, 20), ifA = Z(f, L.if.at - 6, 20);
  const GY = 770;
  const tag = (x: number, y: number, t: string, a: number) => <Tag x={x} y={y} text={t} a={a} size={17} fill="#fff7e4" ink="#5e2a0e" edge="#b58a52"/>;
  return (
    <g>
      <F3Defs/><G2Defs/><E1Defs/><F1Defs/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#g2-sheet)"/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#e6d6b0" opacity={0.55}/>
      <Panel id="g2pl" r={PL} a={Math.min(a0, fmA)}><FormalScene f={f} at={L.fm.at}/></Panel>
      <Panel id="g2pr" r={PR} a={Math.min(a0, ifA)}><InformalScene f={f} at={L.if.at}/></Panel>
      {tag(360, 846, "BANKS", Z(f, L.fm.at + 18, 14))}
      {tag(700, 846, "COOPERATIVES", Z(f, L.fm.at + 52, 14))}
      {tag(1125, 846, "MONEYLENDER", Z(f, L.if.at + 22, 14))}
      {tag(1285, 846, "TRADER", Z(f, L.if.at + 56, 14))}
      {tag(1432, 846, "EMPLOYER", Z(f, L.if.at + 90, 14))}
      {tag(1648, 846, "RELATIVES AND FRIENDS", Z(f, L.if.at + 124, 14))}
    </g>
  );
};
export const DebtKindsLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return (
    <>
      <FCard cx={498} y={64} text={L.fm.text} f={p.f} at={L.fm.at} size={36} maxW={780} tone="cool"/>
      <FCard cx={1422} y={64} text={L.if.text} f={p.f} at={L.if.at} size={30} maxW={790}/>
    </>
  );
};

// ---- bars ----------------------------------------------------------------------------------------------------------------------------
const BX = 250, BWID = 1420, BHT = 128, RY = 336, UY = 612;

const Bar3D: React.FC<{id: string; y: number; sf: number; si: number; f: number; formal: number; informal: number; fT: string; iT: string; startF: number}> = ({id, y, sf, si, f, formal, informal, fT, iT, startF}) => {
  const wF = (BWID * formal) / 100, wI = (BWID * informal) / 100;
  const k1 = E(f, startF, 36), k2 = E(f, startF + 40, 24);
  const x1 = BX + wF * k1, x2 = x1 + wI * k2, d = 22;
  return (
    <g>
      <defs>
        <clipPath id={`${id}-f`}><rect x={BX} y={y} width={Math.max(0.1, wF * k1)} height={BHT}/></clipPath>
        <clipPath id={`${id}-i`}><rect x={BX + wF} y={y} width={Math.max(0.1, wI * k2)} height={BHT}/></clipPath>
        <pattern id={`${id}-pf`} x={BX} y={y} width={92} height={BHT} patternUnits="userSpaceOnUse">
          {[0, 1, 2, 3].map((i) => <rect key={i} x={10 + i * 18} y={22} width={8} height={84} fill="#fff" opacity={0.14}/>)}
          <path d="M6,18 L46,4 L86,18" fill="none" stroke="#fff" strokeWidth={2} opacity={0.2}/>
        </pattern>
        <pattern id={`${id}-pi`} x={BX + wF} y={y} width={46} height={46} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={46} height={46} fill="none"/><path d="M0,0 H46" stroke="#fff" strokeWidth={5} opacity={0.14}/>
        </pattern>
      </defs>
      {/* the empty track */}
      <rect x={BX - 6} y={y - 6} width={BWID + 12 + d} height={BHT + 12} rx={20} fill="#2a1808" opacity={0.16}/>
      <rect x={BX} y={y} width={BWID} height={BHT} rx={14} fill="#efe4c8" stroke="#a8864c" strokeWidth={2.4} strokeDasharray="12 8"/>
      <ellipse cx={BX + BWID / 2 + d / 2} cy={y + BHT + 22} rx={BWID * 0.52} ry={14} fill="#2a1808" opacity={0.26} filter="url(#ak-blur8)"/>
      {k1 > 0.002 && (
        <g>
          <polygon points={`${BX},${y} ${BX + d},${y - d * 0.55} ${x1 + d},${y - d * 0.55} ${x1},${y}`} fill="#9fe6dd" stroke="#176a7c" strokeWidth={2}/>
          <polygon points={`${x1},${y} ${x1 + d},${y - d * 0.55} ${x1 + d},${y + BHT - d * 0.55} ${x1},${y + BHT}`} fill="#176a7c" stroke="#0f4a58" strokeWidth={2}/>
          <rect x={BX} y={y} width={Math.max(0.1, wF * k1)} height={BHT} fill="url(#g2-teal)" stroke="#0f4a58" strokeWidth={3}/>
          <g clipPath={`url(#${id}-f)`}><rect x={BX} y={y} width={wF} height={BHT} fill={`url(#${id}-pf)`}/><rect x={BX} y={y} width={wF} height={BHT * 0.2} fill="#fff" opacity={0.2}/></g>
          {k1 > 0.55 && <text x={BX + wF * k1 / 2} y={y + BHT * 0.5 + 24} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={74} fill="#f4fffd" stroke="#0f4a58" strokeWidth={2} paintOrder="stroke" opacity={Math.min(1, (k1 - 0.55) * 4)}>{fT}%</text>}
        </g>
      )}
      {k2 > 0.002 && (
        <g>
          <polygon points={`${BX + wF},${y} ${BX + wF + d},${y - d * 0.55} ${x2 + d},${y - d * 0.55} ${x2},${y}`} fill="#ffe1a4" stroke="#b3591e" strokeWidth={2}/>
          <polygon points={`${x2},${y} ${x2 + d},${y - d * 0.55} ${x2 + d},${y + BHT - d * 0.55} ${x2},${y + BHT}`} fill="#b3591e" stroke="#7a3a10" strokeWidth={2}/>
          <rect x={BX + wF} y={y} width={Math.max(0.1, wI * k2)} height={BHT} fill="url(#g2-amber)" stroke="#7a3a10" strokeWidth={3}/>
          <g clipPath={`url(#${id}-i)`}><rect x={BX + wF} y={y} width={wI} height={BHT} fill={`url(#${id}-pi)`}/><rect x={BX + wF} y={y} width={wI} height={BHT * 0.2} fill="#fff" opacity={0.22}/></g>
          {k2 > 0.55 && <text x={BX + wF + wI * k2 / 2} y={y + BHT * 0.5 + 24} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={74} fill="#fffaf0" stroke="#7a3a10" strokeWidth={2} paintOrder="stroke" opacity={Math.min(1, (k2 - 0.55) * 4)}>{iT}%</text>}
        </g>
      )}
      {/* the split mark */}
      {k2 > 0.02 && <path d={`M${BX + wF},${y - 14} V${y + BHT + 14}`} stroke="#fff" strokeWidth={3} strokeDasharray="6 7" opacity={0.85}/>}
    </g>
  );
};

const VillageIcon: React.FC<{x: number; y: number; a: number; f: number}> = ({x, y, a, f}) => (
  a > 0.01 ? <g opacity={a} transform={`translate(0 ${(1 - a) * 18})`}>
    <ellipse cx={x} cy={y + 2} rx={120} ry={10} fill="#2a1808" opacity={0.25}/>
    <House x={x - 100} y={y} w={90} h={60} wall="#e8cf9f" roof="#b4562e"/>
    <House x={x + 4} y={y} w={80} h={52} wall="#d9b08a" roof="#9a4228"/>
    <Palm x={x + 120} y={y} s={0.28} f={f} seed={2}/>
  </g> : null
);
const CityIcon: React.FC<{x: number; y: number; a: number}> = ({x, y, a}) => (
  a > 0.01 ? <g opacity={a} transform={`translate(${x} ${y + (1 - a) * 18}) scale(0.8) translate(${-x} ${-y})`}>
    <ellipse cx={x} cy={y + 2} rx={120} ry={10} fill="#2a1808" opacity={0.25}/>
    {[[-100, 52, "#8aa0c0"], [-60, 92, "#6c86ae"], [-12, 70, "#9fb2cf"], [30, 108, "#5f7aa4"], [76, 60, "#8aa0c0"]].map(([dx, hh, c], i) => (
      <g key={i}>
        <rect x={x + Number(dx)} y={y - Number(hh)} width={36} height={Number(hh)} fill={String(c)} stroke="#3f5a82" strokeWidth={2}/>
        {Array.from({length: Math.floor(Number(hh) / 20)}, (_, r) => <rect key={r} x={x + Number(dx) + 7} y={y - Number(hh) + 8 + r * 20} width={8} height={10} fill="#fff1b0" opacity={0.9}/>)}
        {Array.from({length: Math.floor(Number(hh) / 20)}, (_, r) => <rect key={`b${r}`} x={x + Number(dx) + 21} y={y - Number(hh) + 8 + r * 20} width={8} height={10} fill="#fff1b0" opacity={0.6}/>)}
      </g>
    ))}
  </g> : null
);

export const DebtBarsArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), a0 = Z(f, 0, 30);
  const rf = fv("e16_debt", "rf"), ri = fv("e16_debt", "ri"), uf = fv("e16_debt", "uf"), ui = fv("e16_debt", "ui");
  if (rf + ri !== 100 || uf + ui !== 100) throw new Error("e16_debt: the split of each bar must add to 100");
  const shA = Z(f, L.sv.at, 24), rrA = Z(f, L.rr.at, 20), urA = Z(f, L.ur.at, 20);
  const legA = Z(f, L.rr.at + 8, 24);
  return (
    <g>
      <F3Defs/><G2Defs/><E1Defs/><F1Defs/>
      <Desk f={f} id="g2db"/>
      {/* the chart sheet */}
      <g opacity={a0} transform={`translate(0 ${(1 - a0) * 40})`}>
        <rect x={134} y={190} width={1672} height={700} rx={14} fill="#2a1808" opacity={0.36} filter="url(#e3-glow)"/>
        <rect x={110} y={166} width={1672} height={700} rx={12} fill="url(#g2-sheet)" stroke="#bda46c" strokeWidth={2.4}/>
        {Array.from({length: 21}, (_, i) => <path key={i} d={`M${110 + 40 + i * 80},176 V856`} stroke="#9cb6c8" strokeWidth={1.2} opacity={0.35}/>)}
        {Array.from({length: 9}, (_, i) => <path key={i} d={`M120,${230 + i * 76} H1772`} stroke="#9cb6c8" strokeWidth={1.2} opacity={0.35}/>)}
        <rect x={110} y={166} width={1672} height={16} rx={8} fill="#c9822e" opacity={0.85}/>
      </g>
      {/* decile ticks: the bars are drawn to scale, 100% across */}
      <g opacity={shA * 0.9}>
        {[RY, UY].map((y) => Array.from({length: 11}, (_, i) => <path key={`${y}${i}`} d={`M${BX + (BWID * i) / 10},${y + BHT + 34} v${i % 5 === 0 ? 20 : 11}`} stroke="#6a5538" strokeWidth={i % 5 === 0 ? 3 : 2} strokeLinecap="round" opacity={0.7}/>))}
      </g>
      <Bar3D id="g2br" y={RY} sf={rf} si={ri} f={f} formal={rf} informal={ri} fT={ft("e16_debt", "rf")} iT={ft("e16_debt", "ri")} startF={L.rr.at + 8}/>
      <Bar3D id="g2bu" y={UY} sf={uf} si={ui} f={f} formal={uf} informal={ui} fT={ft("e16_debt", "uf")} iT={ft("e16_debt", "ui")} startF={L.ur.at + 4}/>
      <VillageIcon x={1620} y={RY - 14} a={rrA} f={f}/>
      <CityIcon x={1620} y={UY - 14} a={urA}/>
      {/* legend */}
      <g opacity={legA} transform={`translate(0 ${(1 - legA) * 12})`}>
        <rect x={BX} y={830} width={44} height={26} rx={6} fill="url(#g2-teal)" stroke="#0f4a58" strokeWidth={2}/>
        <text x={BX + 58} y={851} fontFamily={SANS} fontWeight={800} fontSize={25} letterSpacing={2} fill="#164a58">INSTITUTIONAL (FORMAL)</text>
        <rect x={BX + 470} y={830} width={44} height={26} rx={6} fill="url(#g2-amber)" stroke="#7a3a10" strokeWidth={2}/>
        <text x={BX + BWID} y={851} textAnchor="end" fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing={2} fill="#7a6240">SHARE OF OUTSTANDING CASH DEBT</text>
        <text x={BX + 528} y={851} fontFamily={SANS} fontWeight={800} fontSize={25} letterSpacing={2} fill="#7a3a10">NON-INSTITUTIONAL</text>
      </g>
    </g>
  );
};
export const DebtBarsLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return (
    <>
      <FCard cx={960} y={62} text={L.sv.text} f={p.f} at={L.sv.at} size={30} maxW={1200} tone="cool" upper={false}/>
      <FCard cx={BX} y={206} text={L.rr.text} f={p.f} at={L.rr.at} size={30} maxW={1000} left upper={false}/>
      <FCard cx={BX} y={482} text={L.ur.text} f={p.f} at={L.ur.at} size={30} maxW={1000} left upper={false}/>
    </>
  );
};
export {eo, prog, rng};
