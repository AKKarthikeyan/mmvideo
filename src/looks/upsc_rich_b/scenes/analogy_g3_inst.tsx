// ECO-16 Part 3, builder G3: `institutions` (b11). A plaza in daylight with three buildings in a row, each rising at its label: a post office with savings certificates in the window (po, ns),
// NABARD with a small bank, a field tile and a village tile in front (money goes NABARD -> bank -> field and village: "funds banks that lend for..."), and the Reserve Bank with a line of bank doors leading to it.
// Signs print the first part of the label; the cards print the rest. Before its key a building is only a faint ghost.
import React from "react";
import {ECard, Specks} from "./analogy_f3_kit";
import {Plaza, Classical} from "./analogy_e3_kit";
import {Cert, Coin} from "./analogy_e2_kit";
import {Adult} from "./analogy_e1_kit";
import {G3Defs, DoorIcon, MiniBank, elabs, parts, E, SANS, SERIF, W, H, eo, prog, lerp, clamp, type AP} from "./analogy_g3_kit";

const GROUND = 750;
const CX = [330, 960, 1590];

const Post: React.FC<{cx: number; f: number; ns: number; k: number; kinit: string; nsWord: string; kvpWord: string; sign: string}> = ({cx, f, ns, k, nsWord, kvpWord, sign}) => {
  const c = E(f, ns, 26), b = 300;
  return (
    <g>
      <ellipse cx={cx} cy={GROUND + 6} rx={300} ry={16} fill="#2a1808" opacity={0.26} filter="url(#ak-blur8)"/>
      {/* hip roof */}
      <path d={`M${cx - 270},${GROUND - b} L${cx - 190},${GROUND - b - 96} L${cx + 190},${GROUND - b - 96} L${cx + 270},${GROUND - b} Z`} fill="#b5503a" stroke="#6e2a1c" strokeWidth={3} strokeLinejoin="round"/>
      {Array.from({length: 6}, (_, i) => <path key={i} d={`M${cx - 270 + i * 14 + 6},${GROUND - b - i * 16} H${cx + 270 - i * 14 - 6}`} stroke="#8a3322" strokeWidth={2} opacity={0.5}/>)}
      <path d={`M${cx - 270},${GROUND - b} L${cx - 190},${GROUND - b - 96} L${cx - 150},${GROUND - b - 96} L${cx - 220},${GROUND - b} Z`} fill="#fff" opacity={0.1}/>
      <rect x={cx - 278} y={GROUND - b - 4} width={556} height={14} fill="#8a3322" stroke="#6e2a1c" strokeWidth={2}/>
      {/* walls */}
      <rect x={cx - 250} y={GROUND - b + 10} width={500} height={b - 10} fill="#f0dfb8" stroke="#bda46c" strokeWidth={2.4}/>
      <rect x={cx + 60} y={GROUND - b + 10} width={190} height={b - 10} fill="#8a6a30" opacity={0.1}/>
      <rect x={cx - 250} y={GROUND - b + 10} width={500} height={34} fill="#c9452f" opacity={0.92}/>
      <rect x={cx - 250} y={GROUND - 22} width={500} height={22} fill="#cfc0a0" stroke="#bda46c" strokeWidth={1.6}/>
      {/* sign board */}
      <rect x={cx - 150} y={GROUND - b + 56} width={300} height={54} rx={6} fill="#a92f24" stroke="#f4e4b8" strokeWidth={3}/>
      <text x={cx} y={GROUND - b + 94} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={32} letterSpacing={4} fill="#fff4d8">{sign}</text>
      {/* window with the certificates */}
      <rect x={cx - 190} y={GROUND - 170} width={250} height={130} rx={6} fill="#6a4a30"/>
      <rect x={cx - 180} y={GROUND - 160} width={230} height={110} rx={4} fill="url(#f1-plaster)"/>
      <rect x={cx - 180} y={GROUND - 160} width={230} height={110} rx={4} fill="#ffe9a0" opacity={0.3 + 0.2 * c}/>
      <g clipPath="url(#g3-postwin)" opacity={c}>
        <g transform={`translate(0 ${(1 - c) * 24})`}>
          <Cert x={cx - 118} y={GROUND - 106} w={104} rot={-6} word={nsWord} op={1}/>
          <Cert x={cx - 26} y={GROUND - 104} w={104} rot={5} word={kvpWord} op={1}/>
        </g>
      </g>
      <rect x={cx - 180} y={GROUND - 160} width={230} height={110} rx={4} fill="url(#g3-glass2)" opacity={0.5}/>
      <path d={`M${cx - 65},${GROUND - 160} V${GROUND - 50}`} stroke="#6a4a30" strokeWidth={5}/>
      <rect x={cx - 196} y={GROUND - 52} width={262} height={12} fill="#cfc0a0" stroke="#bda46c" strokeWidth={1.6}/>
      {/* door */}
      <rect x={cx + 100} y={GROUND - 180} width={90} height={158} rx={4} fill="#5a3a22" stroke="#3a2412" strokeWidth={2.4}/>
      <rect x={cx + 110} y={GROUND - 170} width={70} height={64} rx={3} fill="#cfe6ef" opacity={0.7}/>
      <circle cx={cx + 174} cy={GROUND - 98} r={4} fill="#d9b45a"/>
      {/* a plain post box in front */}
      <g transform={`translate(${cx + 232} ${GROUND + 28})`}>
        <ellipse cx={4} cy={4} rx={36} ry={7} fill="#2a1808" opacity={0.3}/>
        <path d="M-24,0 V-96 Q-24,-122 0,-122 Q24,-122 24,-96 V0 Z" fill="#c9452f" stroke="#7a2418" strokeWidth={2.6}/>
        <path d="M6,0 V-120 Q24,-118 24,-96 V0 Z" fill="#000" opacity={0.14}/>
        <rect x={-14} y={-86} width={28} height={8} rx={3} fill="#1a1008"/>
        <rect x={-26} y={-4} width={52} height={8} fill="#7a2418"/>
      </g>
    </g>
  );
};

const FieldTile: React.FC<{x: number; y: number; w: number; f: number}> = ({x, y, w, f}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M${-w / 2},0 L${w / 2},0 L${w / 2 - 16},${-w * 0.5} L${-w / 2 + 16},${-w * 0.5} Z`} fill="#a5703f" stroke="#6a4426" strokeWidth={2.4}/>
    {[0, 1, 2, 3].map((i) => { const u = (i + 0.5) / 4, yy = -w * 0.5 * u; return <path key={i} d={`M${-w / 2 + 16 * u + 8},${yy} H${w / 2 - 16 * u - 8}`} stroke="#6aa04a" strokeWidth={9 - i * 1.4} strokeLinecap="round" strokeDasharray="1 14" opacity={0.95}/>; })}
    <path d={`M${-w / 2},0 L${w / 2},0 V14 H${-w / 2} Z`} fill="#7c4f2a" stroke="#4a2c14" strokeWidth={2}/>
  </g>
);
const VillageTile: React.FC<{x: number; y: number; w: number}> = ({x, y, w}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M${-w / 2},0 L${w / 2},0 L${w / 2 - 16},${-w * 0.5} L${-w / 2 + 16},${-w * 0.5} Z`} fill="#c8d9a0" stroke="#6a8a3c" strokeWidth={2.4}/>
    <path d={`M${-w * 0.1},0 L${w * 0.04},${-w * 0.5}`} stroke="#e6d4a4" strokeWidth={9} opacity={0.9}/>
    {[[-w * 0.28, -w * 0.12, "#e8c896"], [w * 0.22, -w * 0.16, "#f0d8a8"], [-w * 0.12, -w * 0.34, "#e2b88a"], [w * 0.2, -w * 0.38, "#ead2a0"]].map(([hx, hy, c], i) => (
      <g key={i} transform={`translate(${hx} ${hy})`}><rect x={-13} y={-16} width={26} height={16} fill={c as string} stroke="#8a6a3a" strokeWidth={1.4}/><path d="M-16,-16 L0,-30 L16,-16 Z" fill="#b5503a" stroke="#6e2a1c" strokeWidth={1.4}/><rect x={-3} y={-9} width={6} height={9} fill="#5a3a22"/></g>
    ))}
    <circle cx={w * 0.38} cy={-w * 0.1} r={13} fill="#5a8f3e" stroke="#2f5a1e" strokeWidth={1.6}/>
    <path d={`M${-w / 2},0 L${w / 2},0 V14 H${-w / 2} Z`} fill="#6e8a44" stroke="#3f5a1e" strokeWidth={2}/>
  </g>
);

const Nabard: React.FC<{cx: number; f: number; at: number; sign: string}> = ({cx, f, at, sign}) => {
  const b = 380;
  return (
    <g>
      <ellipse cx={cx} cy={GROUND + 6} rx={250} ry={15} fill="#2a1808" opacity={0.26} filter="url(#ak-blur8)"/>
      <rect x={cx - 220} y={GROUND - b} width={440} height={b} fill="#e8eadc" stroke="#9aa088" strokeWidth={2.4}/>
      <rect x={cx + 70} y={GROUND - b} width={150} height={b} fill="#3a4a2a" opacity={0.1}/>
      <rect x={cx - 236} y={GROUND - b - 22} width={472} height={26} fill="#2f7a4a" stroke="#1d4f2e" strokeWidth={2.4}/>
      <rect x={cx - 236} y={GROUND - b + 4} width={472} height={8} fill="#1d4f2e" opacity={0.3}/>
      <rect x={cx - 130} y={GROUND - b + 34} width={260} height={52} rx={6} fill="#1d4f2e" stroke="#e6d28a" strokeWidth={3}/>
      <text x={cx} y={GROUND - b + 72} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={34} letterSpacing={8} fill="#f6efc4">{sign}</text>
      {[0, 1].map((r) => [0, 1, 2, 3].map((c) => (
        <g key={`${r}${c}`}><rect x={cx - 190 + c * 100} y={GROUND - b + 112 + r * 92} width={62} height={64} rx={3} fill="#7a9ab0" stroke="#4a6074" strokeWidth={2.4}/><rect x={cx - 190 + c * 100} y={GROUND - b + 112 + r * 92} width={62} height={64} rx={3} fill="url(#f3-glass)"/><path d={`M${cx - 190 + c * 100 + 31},${GROUND - b + 112 + r * 92} v64`} stroke="#4a6074" strokeWidth={2}/></g>
      )))}
      <rect x={cx - 48} y={GROUND - 120} width={96} height={120} rx={4} fill="#5a3a22" stroke="#3a2412" strokeWidth={2.4}/>
      <rect x={cx - 38} y={GROUND - 110} width={76} height={64} rx={3} fill="#cfe6ef" opacity={0.7}/>
      <rect x={cx - 70} y={GROUND - 140} width={140} height={16} rx={3} fill="#2f7a4a" stroke="#1d4f2e" strokeWidth={2}/>
      <rect x={cx - 236} y={GROUND - 14} width={472} height={14} fill="#c9c9b8" stroke="#9aa088" strokeWidth={1.6}/>
    </g>
  );
};

export const InstitutionsArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), po = L.po.at, ns = L.ns.at, nb = L.nb.at, rb = L.rb.at;
  const g = 0.16;
  const aP = g + (1 - g) * E(f, po, 30), aN = g + (1 - g) * E(f, nb - 20, 34), aR = g + (1 - g) * E(f, rb - 20, 34);
  const ppo = parts(L.po.text), pns = parts(L.ns.text), pnb = parts(L.nb.text);
  const initials = (pns[1] ?? "").split(/\s+/).filter(Boolean).map((w) => w[0].toUpperCase()).join("");
  // NABARD's money: building -> small bank -> field and village
  const f1 = E(f, nb + 24, 30), f2 = E(f, nb + 60, 30), f3 = E(f, nb + 90, 30);
  const FY = 864;
  const dots = (a: [number, number], b: [number, number], k: number, n = 3) => Array.from({length: n}, (_, i) => { const u = ((f * 0.02 + i / n) % 1); return <Coin key={i} x={lerp(a[0], b[0], u)} y={lerp(a[1], b[1], u)} r={9} spin={f / 5 + i} op={k * Math.min(1, u * 6, (1 - u) * 6)}/>; });
  const line = (a: [number, number], b: [number, number], k: number) => <path d={`M${a[0]},${a[1]} L${lerp(a[0], b[0], k)},${lerp(a[1], b[1], k)}`} stroke="#c9822e" strokeWidth={6} strokeLinecap="round" strokeDasharray="2 12" opacity={0.9 * clamp(k * 4)}/>;
  // the line of bank doors to the Reserve Bank
  const doors = [[1346, 890], [1408, 876], [1470, 862], [1532, 848]] as [number, number][];
  const rbA = (i: number) => E(f, rb + 12 + i * 14, 20);
  const RT: [number, number] = [1640, GROUND + 22];
  return (
    <g>
      <G3Defs/>
      <defs>
        <clipPath id="g3-postwin"><rect x={CX[0] - 180} y={GROUND - 160} width={230} height={110} rx={4}/></clipPath>
        <linearGradient id="g3-glass2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.5"/><stop offset="0.5" stopColor="#dff0f8" stopOpacity="0.12"/><stop offset="1" stopColor="#fff" stopOpacity="0.35"/></linearGradient>
      </defs>
      <Plaza id="g3in" ground={GROUND} f={f}/>
      {/* ---- the post office ---- */}
      <g opacity={aP} transform={`translate(0 ${(1 - E(f, po, 30)) * 26})`}><Post cx={CX[0]} f={f} ns={ns} k={1} kinit={initials} nsWord={pns[0] ?? ""} kvpWord={initials} sign={ppo[0]}/></g>
      {/* ---- NABARD ---- */}
      <g opacity={aN} transform={`translate(0 ${(1 - E(f, nb - 20, 34)) * 26})`}><Nabard cx={CX[1]} f={f} at={nb} sign={pnb[0]}/></g>
      {/* strollers, far */}
      <Adult x={((f * 1.1 + 500) % 2300) - 200} y={GROUND + 92} h={176} f={f} seed={71} walk look={{kind: "plain", female: true, shirt: ["#d98a8a", "#a65a5a"], pants: "#31405a", hair: "#1a120d", skin: 1}}/>
      <Adult x={1900 - ((f * 0.9 + 300) % 2300)} y={GROUND + 96} h={180} f={f} seed={72} walk look={{kind: "plain", shirt: ["#8fa58a", "#5d7458"], pants: "#5a4a3a", hair: "#2a1c14", skin: 2, stache: true}}/>
      {/* the money chain in front of NABARD */}
      <g opacity={E(f, nb + 10, 20)}>
        <path d={`M${CX[1]},${GROUND + 8} V${FY - 112}`} stroke="#c9822e" strokeWidth={0} />
        {line([CX[1], GROUND + 6], [CX[1], FY - 100], f1)}
        {f1 > 0.3 ? dots([CX[1], GROUND + 6], [CX[1], FY - 100], f1, 2) : null}
        <MiniBank x={CX[1]} y={FY + 28} w={96} h={112} door={f2 * 0.6} f={f}/>
        {line([CX[1] - 64, FY - 10], [CX[1] - 170, FY - 10], f2)}
        {line([CX[1] + 64, FY - 10], [CX[1] + 170, FY - 10], f3)}
        {f2 > 0.3 ? dots([CX[1] - 64, FY - 10], [CX[1] - 170, FY - 10], f2, 2) : null}
        {f3 > 0.3 ? dots([CX[1] + 64, FY - 10], [CX[1] + 170, FY - 10], f3, 2) : null}
        <g opacity={f2}><FieldTile x={CX[1] - 252} y={FY + 28} w={140} f={f}/></g>
        <g opacity={f3}><VillageTile x={CX[1] + 252} y={FY + 28} w={140}/></g>
      </g>
      {/* ---- the Reserve Bank ---- */}
      <g opacity={aR} transform={`translate(0 ${(1 - E(f, rb - 20, 34)) * 26})`}>
        <Classical x={CX[2]} y={GROUND} w={500} h={400} text="RESERVE BANK" id="g3rbi" cols={6} glow={E(f, rb, 30) * 0.3}/>
      </g>
      <g>
        <path d={`M${doors[0][0]},${doors[0][1] + 4} L${RT[0] - 60},${RT[1]}`} stroke="#c9822e" strokeWidth={5} strokeDasharray="2 12" strokeLinecap="round" opacity={0.8 * E(f, rb + 10, 30)}/>
        {doors.map(([x, y], i) => <DoorIcon key={i} x={x} y={y} s={0.9 - i * 0.05} glow={rbA(i) * 0.5} col={["#e6dac0", "#dcd2b6", "#e8dcc4", "#d8ceb2"][i]}/>).map((el, i) => <g key={i} opacity={rbA(i)} transform={`translate(0 ${(1 - rbA(i)) * 14})`}>{el}</g>)}
        {E(f, rb + 60, 20) > 0.2 ? Array.from({length: 4}, (_, i) => { const a = doors[i], u = ((f * 0.016 + i / 4) % 1); return <Coin key={i} x={lerp(a[0], RT[0] - 60, u)} y={lerp(a[1] - 20, RT[1] - 20, u) - Math.sin(Math.PI * u) * 26} r={9} spin={f / 5 + i} op={E(f, rb + 60, 20) * Math.min(1, u * 6, (1 - u) * 6)}/>; }) : null}
      </g>
      <Specks f={f} n={12} seed={9} y0={200} y1={740}/>
    </g>
  );
};

export const InstitutionsLabels: React.FC<AP> = (p) => {
  const L = elabs(p), f = p.f;
  const rest = (t: string) => parts(t).slice(1).join(" · ");
  return (
    <>
      <ECard cx={CX[0]} y={84} text={rest(L.po.text)} f={f} at={L.po.at} size={36} maxW={540} upper={false}/>
      <ECard cx={CX[0]} y={190} text={L.ns.text} f={f} at={L.ns.at} size={34} maxW={540} upper={false} tone="cool"/>
      <ECard cx={CX[1]} y={84} text={rest(L.nb.text)} f={f} at={L.nb.at} size={32} maxW={560} upper={false} tone="green"/>
      <ECard cx={CX[2]} y={84} text={rest(L.rb.text)} f={f} at={L.rb.at} size={36} maxW={540} upper={false} tone="warm"/>
    </>
  );
};
