// ECO-16 Part 3, builder G1: `supervision` (b06). Split picture. Left, FORMAL: a bank counter with a teller, a Reserve Bank official with a clipboard, a minimum-cash gauge (cb) and a reports
// tray with three small tags: how much, to whom, at what rate (rp). Right, INFORMAL: a moneylender's low table with a few notes and an EMPTY chair, nothing written down (is).
// Never a ledger or paper on the moneylender's table (NCERT: moneylenders keep no records). Keys: fs, cb, rp, is.
import React from "react";
import {SANS, SERIF, W, H, clamp, eio} from "../kit";
import {Adult, GDefs, E1Defs, F1Defs, F2Defs, Dial, Bundle, Plate, Sign, Badge, P2Card, elabs, handPos, armTo, ez, sm, pop, pulse, arcP, mixn, Spot, Veil, type Look, type Arms, type AP} from "./analogy_g1_kit";

const OFFICIAL: Look = {kind: "plain", shirt: ["#f4f0e6", "#c9c2b0"], pants: "#2e3a4c", hair: "#2a2220", skin: 0, glasses: true};
const TELLER: Look = {kind: "plain", female: true, shirt: ["#6c8fb5", "#41607f"], pants: "#3d4658", hair: "#1a120d", skin: 3};

const GY = 900;                 // floor
const DIV = 972;                // the split

const Chair: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={4} rx={92} ry={12} fill="#2a1808" opacity={0.3}/>
    <rect x={-70} y={-250} width={16} height={250} fill="#6a4426" stroke="#3a2412" strokeWidth={2}/>
    <rect x={54} y={-250} width={16} height={250} fill="#6a4426" stroke="#3a2412" strokeWidth={2}/>
    <rect x={-74} y={-262} width={148} height={20} rx={5} fill="#7a5030" stroke="#3a2412" strokeWidth={2}/>
    <rect x={-60} y={-232} width={120} height={14} rx={3} fill="#8a5a34" stroke="#3a2412" strokeWidth={1.6}/>
    <rect x={-60} y={-186} width={120} height={14} rx={3} fill="#8a5a34" stroke="#3a2412" strokeWidth={1.6}/>
    <rect x={-84} y={-120} width={168} height={22} rx={5} fill="#8a5a34" stroke="#3a2412" strokeWidth={2}/>
    <rect x={-84} y={-120} width={168} height={5} fill="#fff" opacity={0.22}/>
    <rect x={-76} y={-98} width={14} height={98} fill="#6a4426" stroke="#3a2412" strokeWidth={2}/><rect x={62} y={-98} width={14} height={98} fill="#6a4426" stroke="#3a2412" strokeWidth={2}/>
    <rect x={-62} y={-44} width={124} height={9} fill="#6a4426" stroke="#3a2412" strokeWidth={1.4}/>
  </g>
);

export const SuperArt: React.FC<AP> = (p) => {
  const {f, at} = p, fs = at("fs"), cb = at("cb"), rp = at("rp"), is = at("is");
  const litL = 0.22 + 0.78 * ez(f, fs, 24), litR = 0.22 + 0.78 * ez(f, is, 24);
  const gA = pop(f, cb, 20), sweep = sm(f, cb + 6, 40), tick = ez(f, cb + 40, 12);
  const needle = mixn(-120, 18, sweep);                      // degrees on a 270 degree dial, min mark at -50
  // reports: three slips from the counter to the tray
  const slipU = (i: number) => sm(f, rp + 4 + i * 8, 26);
  const tagA = (i: number) => pop(f, rp + 22 + i * 7, 16);
  const TRAY: [number, number] = [868, 712];
  // official writes; teller types
  const wr = 0.5 + 0.5 * Math.sin(f / 9), oPen: [number, number] = [704 + wr * 26, 640 + Math.sin(f / 5) * 3];
  const OX = 668, OY = 988, OH = 548;
  const oArms: Arms = {L: armTo(OX, OY, OH, "L", [648, 668], 1), R: armTo(OX, OY, OH, "R", oPen, 1)};
  const lh = handPos(OX, OY, OH, oArms, "L"), rh = handPos(OX, OY, OH, oArms, "R");
  const ty = Math.sin(f * 0.8) * 0.5;
  const tArms: Arms = {R: [12 + ty * 5, 44 + ty * 6], L: [12 - ty * 5, 44 - ty * 6]};
  const lookUp = Math.sin(f / 60);
  const bob = Math.sin(f / 8);
  return (
    <g>
      <GDefs/><E1Defs/><F1Defs/><F2Defs/>
      {/* ---------- left: the formal side, a bank hall ---------- */}
      <g>
        <rect x={-60} y={-60} width={DIV + 60} height={H + 120} fill="url(#g1-wall)"/>
        <rect x={-60} y={640} width={DIV + 60} height={GY - 640} fill="#d6b27a" opacity={0.35}/>
        {Array.from({length: 6}, (_, i) => <rect key={i} x={-40 + i * 190} y={-20} width={90} height={GY} fill="#f0dcb4" opacity={0.26}/>)}
        {[100, 360].map((x, i) => (
          <g key={x}>
            <path d={`M${x},560 V300 A100,100 0 0 1 ${x + 200},300 V560 Z`} fill="url(#f2-win)" stroke="#a9895a" strokeWidth={8}/>
            <path d={`M${x + 100},200 V560 M${x},420 H${x + 200}`} stroke="#a9895a" strokeWidth={5} opacity={0.8}/>
            <path d={`M${x + 18},560 V300 A82,82 0 0 1 ${x + 100},218`} stroke="#fff" strokeWidth={8} fill="none" opacity={0.3}/>
            <path d={`M${x + 20},560 L${x - 100},${GY + 80} L${x + 190},${GY + 80} L${x + 230},560 Z`} fill="url(#f2-shaft)" opacity={0.2 + 0.05 * Math.sin(f / 50 + i)}/>
          </g>
        ))}
        <rect x={-60} y={GY - 8} width={DIV + 60} height={H - GY + 80} fill="url(#g1-floor)"/>
        {Array.from({length: 7}, (_, i) => <path key={i} d={`M-60,${GY + i * i * 3 + i * 12} H${DIV}`} stroke="#3a2412" strokeWidth={1.4} opacity={0.25}/>)}
        {/* wall sign and pendant lamp */}
        {[290, 800].map((x, i) => <g key={x}><path d={`M${x},-10 V80`} stroke="#2a2018" strokeWidth={3}/><path d={`M${x - 30},112 Q${x - 24,84} ${x},82 Q${x + 24},84 ${x + 30},112 Z`} fill="#2f6a4a" stroke="#173b28" strokeWidth={2}/><circle cx={x} cy={128 + Math.sin(f / 9 + i)} r={56} fill="url(#f1-lamp)" opacity={0.85}/></g>)}
        {/* teller and counter */}
        <Adult x={300} y={GY} h={470} f={f} seed={81} look={TELLER} arms={tArms} hands={{R: "relax", L: "relax"}} lookX={0.2 + lookUp * 0.3} legsHidden smile={0.4}/>
        <rect x={60} y={640} width={500} height={24} rx={4} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2.4}/><rect x={60} y={640} width={500} height={5} fill="#fff" opacity={0.3}/>
        <rect x={70} y={664} width={480} height={GY - 664 + 10} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
        {[0, 1, 2].map((i) => <rect key={i} x={88 + i * 152} y={686} width={134} height={GY - 716} rx={6} fill="none" stroke="#d9a468" strokeWidth={2} opacity={0.42}/>)}
        {Array.from({length: 10}, (_, i) => <path key={i} d={`M${90 + i * 48},500 V638`} stroke="url(#f1-brass)" strokeWidth={4} opacity={0.85}/>)}
        <rect x={80} y={492} width={460} height={9} rx={3} fill="url(#f1-brass)" stroke="#6a4a10" strokeWidth={1.2}/>
        <rect x={290} y={560} width={110} height={64} rx={4} fill="#cfe6ef" opacity={0.45} stroke="#7da3ba" strokeWidth={1.4}/>
        {/* the three slips waiting on the counter, then flying to the tray */}
        {[0, 1, 2].map((i) => {
          const u = slipU(i), src: [number, number] = [140 + i * 22, 632 - i * 4], dst: [number, number] = [TRAY[0] + 6, TRAY[1] - 6 - i * 7];
          const pos = u <= 0 ? src : arcP(src, dst, 110, u);
          return <g key={i} transform={`translate(${pos[0]} ${pos[1]}) rotate(${(1 - u) * (-8 + i * 6) + u * 2})`}><rect x={-34} y={-22} width={68} height={44} rx={3} fill="url(#f1-paper)" stroke="#b8a074" strokeWidth={1.6}/>
            <path d="M-24,-10 H24 M-24,0 H24 M-24,10 H10" stroke="#8a7a58" strokeWidth={1.8} opacity={0.7}/></g>;
        })}
        {/* the gauge on the wall */}
        {gA > 0.01 && (
          <g transform={`translate(0 ${(1 - gA) * -20})`} opacity={clamp(gA * 1.4)}>
            <rect x={712} y={246} width={240} height={252} rx={18} fill="url(#f2-board)" stroke="#2a1a0c" strokeWidth={3}/>
            <rect x={720} y={254} width={224} height={236} rx={12} fill="none" stroke="#c9962c" strokeWidth={2} opacity={0.7}/>
            <Dial id="g1gauge" cx={832} cy={356} r={84} ang={needle} sweep={270} ticks={18} marks={[{ang: -50, c: "#c63f2f"}]} lit={tick * 0.5}/>
            <text x={832} y={474} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={18} letterSpacing="0.16em" fill="#f6e3a8">MINIMUM CASH</text>
            <Badge x={934} y={262} ok s={0.9} a={tick}/>
          </g>
        )}
        {/* the official's desk, tray and nameplate */}
        <rect x={720} y={700} width={240} height={20} rx={4} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2.4}/><rect x={720} y={700} width={240} height={5} fill="#fff" opacity={0.3}/>
        <rect x={728} y={720} width={224} height={GY - 720 + 8} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
        <rect x={742} y={738} width={196} height={130} rx={6} fill="none" stroke="#d9a468" strokeWidth={2} opacity={0.42}/>
        <Plate x={840} y={800} w={180} h={50} lines={["RESERVE BANK"]} a={1} size={19}/>
        <g transform="translate(868 706)">
          <path d="M-52,0 L-44,-26 L44,-26 L52,0 Z" fill="#8a5a34" stroke="#3a2412" strokeWidth={2}/><rect x={-52} y={-4} width={104} height={6} fill="#c28a52"/>
        </g>
        {/* the official */}
        <Adult x={OX} y={OY} h={OH} f={f} seed={82} look={OFFICIAL} arms={oArms} hands={{L: "fist", R: "fist"}} lookX={0.2 + lookUp * 0.5} smile={0.25} nod={Math.sin(f / 30) * 0.5}/>
        <g transform={`translate(${(lh[0] + rh[0]) / 2 + 8} ${(lh[1] + rh[1]) / 2 - 4}) rotate(-8)`} filter="url(#g1-sh-s)">
          <rect x={-46} y={-62} width={92} height={118} rx={5} fill="#6a4a2c" stroke="#3a2412" strokeWidth={2}/>
          <rect x={-38} y={-52} width={76} height={100} rx={2} fill="#fffaf0"/>
          <rect x={-14} y={-68} width={28} height={14} rx={3} fill="#a8a8a0" stroke="#5a5a56" strokeWidth={1.4}/>
          <path d="M-28,-34 H28 M-28,-20 H28 M-28,-6 H28 M-28,8 H12" stroke="#8a7a58" strokeWidth={1.8} opacity={0.7}/>
          {[0, 1, 2].map((i) => <path key={i} d={`M-30,${-34 + i * 14} l3,3 l6,-6`} stroke="#2f9a4a" strokeWidth={2.4} fill="none" opacity={ez(f, fs + 12 + i * 22, 10)}/>)}
        </g>
        <rect x={OX - 26} y={OY - 0.58 * OH} width={12} height={22} rx={2} fill="#2a3a5c" stroke="#d9b45a" strokeWidth={1.4}/>
        {/* the tags above the tray */}
        {["HOW MUCH", "TO WHOM", "AT WHAT RATE"].map((t, i) => <Sign key={t} x={884 + (i % 2 ? 8 : -4)} y={604 + i * 34 - 20} text={t} a={tagA(i)} size={17} w={170}/>)}
        <Veil x={-60} y={-60} w={DIV + 60} h={H + 120} a={(1 - litL) * 0.62}/>
      </g>
      {/* ---------- right: the informal side, a moneylender's low table ---------- */}
      <g>
        <rect x={DIV} y={-60} width={W - DIV + 60} height={H + 120} fill="url(#g1-wallcool)"/>
        <rect x={DIV} y={560} width={W - DIV + 60} height={GY - 560} fill="#cbbfa4" opacity={0.3}/>
        {Array.from({length: 6}, (_, i) => <rect key={i} x={DIV + 20 + i * 170} y={-20} width={70} height={GY} fill="#cdd3cc" opacity={0.28}/>)}
        {/* a shuttered window with daylight and a bare bulb */}
        <g transform="translate(1180 250)">
          <rect x={-8} y={-8} width={266} height={276} fill="#7a5632" stroke="#3a2412" strokeWidth={3}/>
          <rect x={0} y={0} width={250} height={260} fill="url(#f2-win)"/>
          <path d="M125,0 V260 M0,130 H250" stroke="#7a5632" strokeWidth={6}/>
          <path d="M10,260 L-130,660 L230,660 L250,260 Z" fill="url(#f2-shaft)" opacity={0.18}/>
        </g>
        <path d="M1640,-10 V200" stroke="#2a2018" strokeWidth={3}/><circle cx={1640} cy={216} r={14} fill="#fff6c8" stroke="#b8923a" strokeWidth={2}/><circle cx={1640} cy={216 + Math.sin(f / 9)} r={70} fill="url(#f1-lamp)" opacity={0.5}/>
        <rect x={DIV} y={GY - 8} width={W - DIV + 60} height={H - GY + 80} fill="url(#g1-floor)"/>
        {Array.from({length: 7}, (_, i) => <path key={i} d={`M${DIV},${GY + i * i * 3 + i * 12} H${W + 60}`} stroke="#3a2412" strokeWidth={1.4} opacity={0.25}/>)}
        <Spot cx={1480} cy={780} rx={440} ry={250} a={ez(f, is, 26)}/>
        {/* a woven mat, the low table, the empty chair, a few notes; no paper at all */}
        <ellipse cx={1440} cy={GY + 28} rx={420} ry={34} fill="#2a1808" opacity={0.18}/>
        <Chair x={1612} y={GY - 6}/>
        {/* a clay water pot on a stand, a tin trunk, a shelf with brass pots: lived-in, no paper */}
        <g transform="translate(1090 0)">
          <ellipse cx={0} cy={GY + 8} rx={60} ry={9} fill="#2a1808" opacity={0.28}/>
          <path d="M-34,790 Q-60,840 -40,882 Q0,904 40,882 Q60,840 34,790 Q0,780 -34,790 Z" fill="#b8643a" stroke="#6a3418" strokeWidth={2}/>
          <ellipse cx={0} cy={790} rx={34} ry={9} fill="#8a4424" stroke="#6a3418" strokeWidth={1.6}/>
          <path d="M-30,810 Q0,822 30,810" stroke="#e8a070" strokeWidth={2.4} fill="none" opacity={0.6}/>
        </g>
        <g transform="translate(1810 0)">
          <rect x={-70} y={810} width={140} height={86} rx={6} fill="#6c7684" stroke="#2e3541" strokeWidth={2.4}/><rect x={-70} y={810} width={140} height={14} fill="#8a93a0"/>
          <rect x={-10} y={836} width={20} height={14} rx={2} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={1.4}/>
        </g>
        <g>
          <rect x={1500} y={470} width={250} height={12} rx={3} fill="#8a5a30" stroke="#3a2412" strokeWidth={1.6}/>
          {[1535, 1590, 1650, 1710].map((x, i) => <g key={x}><path d={`M${x - 20},470 Q${x - 24},${442 - (i % 2) * 8} ${x},${434 - (i % 2) * 10} Q${x + 24},${442 - (i % 2) * 8} ${x + 20},470 Z`} fill="url(#f1-brass)" stroke="#6a4a10" strokeWidth={1.6}/><ellipse cx={x - 7} cy={452} rx={4} ry={10} fill="#fff" opacity={0.3}/></g>)}
        </g>
        <g transform="translate(1340 0)">
          <rect x={-190} y={742} width={380} height={22} rx={5} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2.4}/><rect x={-190} y={742} width={380} height={5} fill="#fff" opacity={0.3}/>
          {[-170, 150].map((x) => <rect key={x} x={x} y={764} width={22} height={GY - 764 - 8} fill="#6a4228" stroke="#3a2412" strokeWidth={1.8}/>)}
          <rect x={-150} y={776} width={300} height={10} fill="#6a4228" stroke="#3a2412" strokeWidth={1.4}/>
          <Bundle x={-40} y={724} s={1.15} rot={-4} n={3}/>
          <g transform="translate(70 742)"><path d="M-16,0 Q-14,-12 0,-14 Q14,-12 16,0 Z" fill="url(#f1-brass)" stroke="#6a4a10" strokeWidth={1.4}/><ellipse cx={0} cy={-18} rx={5} ry={9 + Math.sin(f / 4) * 1.2} fill="#fff2c0"/><circle cx={0} cy={-16} r={30} fill="url(#f1-lamp)" opacity={0.7}/></g>
          <g transform="translate(130 742)"><path d="M-14,0 L-11,-30 L11,-30 L14,0 Z" fill="#cfe6ef" opacity={0.8} stroke="#7da3ba" strokeWidth={1.4}/><path d="M-11,-18 H11" stroke="#7da3ba" strokeWidth={1.4}/></g>
        </g>
        <Veil x={DIV} y={-60} w={W - DIV + 60} h={H + 120} a={(1 - litR) * 0.62}/>
      </g>
      {/* the split */}
      <rect x={DIV - 7} y={-60} width={14} height={H + 120} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={2}/>
      <rect x={DIV - 7} y={-60} width={5} height={H + 120} fill="#fff" opacity={0.3}/>
    </g>
  );
};

export const SuperLabels: React.FC<AP> = (p) => {
  const L = elabs(p), {f} = p;
  return (
    <>
      <P2Card cx={480} y={128} text={L.fs.text} f={f} at={L.fs.at} size={36} maxW={640} upper={false} tone="cool"/>
      <P2Card cx={1440} y={128} text={L.is.text} f={f} at={L.is.at} size={36} maxW={640} upper={false}/>
      <P2Card cx={310} y={690} text={L.cb.text} f={f} at={L.cb.at} size={30} maxW={470} upper={false} tone="cool"/>
      <P2Card cx={310} y={790} text={L.rp.text} f={f} at={L.rp.at} size={28} maxW={470} upper={false}/>
    </>
  );
};
