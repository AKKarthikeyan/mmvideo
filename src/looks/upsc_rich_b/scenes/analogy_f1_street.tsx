// ECO-16 Part 2, builder F1: `part3-street` (b20). A street at warm light: a moneylender's low table with a few notes (NCERT: moneylenders keep no records), a fruit cart where a customer taps a phone at a QR card, a plain bank
// counter with a queue of one, and one person standing apart. Three question cards (wg, pp, lo) appear in turn, each lighting its place softly; at p3 a brass frame draws round the scene.
// No person or group is mocked: everyone is drawn with the same care. Events are the label keys wg, pp, lo, p3.
import React from "react";
import {SANS, SERIF, W, H, clamp} from "../kit";
import {prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {StreetBG, Auto} from "./analogy_e1_bg";
import {Adult, Awning, FruitPile, BananaBunch, Phone, QRCard, E1Defs, type Arms, type Look} from "./analogy_e1_kit";
import {F1Defs, E, win, armTo, blend, type P} from "./analogy_f1_kit";

const LENDER: Look = {kind: "kurta", shirt: ["#f1ead6", "#bdb08a"], pants: "#efe6cf", hair: "#8a8a86", skin: 1, glasses: true, stache: true};
const SELLER: Look = {kind: "saree", accent: "#b8323f", shirt: ["#e8b84a", "#a5782e"], hair: "#1a120d", skin: 1, female: true};
const SHOPPER: Look = {kind: "plain", female: true, shirt: ["#4f8f9a", "#2f5f6a"], pants: "#31405a", hair: "#1a120d", skin: 2};
const TELLER: Look = {kind: "plain", shirt: ["#6c8fb5", "#41607f"], pants: "#3d4658", hair: "#1a120d", skin: 0, glasses: true};
const QUEUER: Look = {kind: "plain", shirt: ["#d9b26a", "#a5782e"], pants: "#3d4658", hair: "#2b1d14", skin: 2, stache: true};
const APART: Look = {kind: "plain", shirt: ["#8fa58a", "#5d7458"], pants: "#5a4a3a", hair: "#2a1c14", skin: 1, stache: true};
const CT = 640;                         // counter tops (waist height of someone behind)

const Spot: React.FC<{cx: number; cy: number; rx: number; ry: number; a: number}> = ({cx, cy, rx, ry, a}) => a > 0.01 ? (
  <g opacity={a}>
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#ak-sunglow)" opacity={0.55}/>
    <ellipse cx={cx} cy={cy + ry * 0.96} rx={rx * 0.8} ry={14} fill="#fff2c0" opacity={0.28}/>
  </g>
) : null;

export const StreetArt: React.FC<AP> = (p) => {
  const {f, dur, at} = p;
  const wg = at("wg"), pp = at("pp"), lo = at("lo"), p3 = at("p3");
  // the moneylender handles a few notes now and then (no ledger: NCERT says moneylenders keep no records)
  const wr = 0.5 + 0.5 * Math.sin(f / 46);
  const penT: P = [404 + Math.sin(f * 0.7) * 12 * wr, 648 + Math.sin(f * 1.3) * 2.4 * wr];
  const lenderArms: Arms = {R: armTo(360, 896, 430, "R", penT, 0.92), L: armTo(360, 896, 430, "L", [330, 652], 0.8)};
  const lookUp = win(f % 140, 80, 120, 14);
  // the shopper taps the phone at the QR card in a gentle loop
  const ph = (f % 96) / 96, tap = Math.max(0, Math.sin(Math.PI * clamp((ph - 0.35) / 0.5)));
  const tapT: P = [858 + (1 - tap) * -26, 566 - (1 - tap) * 10];
  const shopperArms: Arms = {R: armTo(700, 950, 560, "R", tapT, 0.9), L: [6, 12]};
  const ring = Math.max(0, (ph - 0.62) / 0.3), ringA = ph > 0.62 && ph < 0.92 ? Math.sin(Math.PI * clamp(ring)) : 0;
  // bank: the teller types, the one in the queue waits
  const type = Math.sin(f * 0.9) * 0.5;
  const tellerArms: Arms = {R: [10 + type * 4, 40 + type * 6], L: [10 - type * 4, 40 - type * 6]};
  const waitSway = Math.sin(f / 50);
  const frameA = E(f, p3, 30);
  const P3 = 3 * (1800 + 950);
  return (
    <g>
      <F1Defs/><E1Defs/>
      <StreetBG f={f} dur={dur} variant="velocity" sun={[240, 240]}/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#ff9a3c" opacity={0.13}/>
      <path d="M240,240 L900,H L1500,H Z" fill="url(#e1-ray)" opacity={0.28}/>
      {/* ---- stand 1: the moneylender's low table ---- */}
      <Spot cx={340} cy={640} rx={310} ry={250} a={E(f, wg, 24)}/>
      <g>
        <rect x={84} y={380} width={12} height={314} fill="#6a4a2c" stroke="#3a2412" strokeWidth={1.4}/><rect x={584} y={380} width={12} height={314} fill="#6a4a2c" stroke="#3a2412" strokeWidth={1.4}/>
        <Awning x={70} y={346} w={540} h={60} c1="#8a5a1c" c2="#f4ead0" n={8} f={f}/>
        <rect x={96} y={440} width={488} height={252} fill="#4a3320" opacity={0.92}/>
        {[0, 1].map((r) => <rect key={r} x={96} y={500 + r * 70} width={488} height={8} fill="#8a5a30"/>)}
        {Array.from({length: 7}, (_, i) => <rect key={i} x={116 + i * 66} y={470 + (i % 2) * 6} width={36} height={30} rx={4} fill={["#e8b84a", "#c0603d", "#7fa58a", "#e8dcc4"][i % 4]} opacity={0.82}/>)}
        <g transform="translate(150 690)"><ellipse cx={0} cy={0} rx={50} ry={9} fill="#2a1808" opacity={0.25}/><path d="M-44,0 Q-50,-40 -30,-50 L30,-50 Q50,-40 44,0 Z" fill="#fff4e0" stroke="#b8a074" strokeWidth={1.6}/></g>
        <Adult x={360} y={896} h={430} f={f} seed={91} look={LENDER} arms={lenderArms} hands={{R: "fist", L: "relax"}} lookX={0.3 + lookUp * 0.4} smile={0.2} legsHidden nod={lookUp * -0.8}/>
        <rect x={70} y={690} width={548} height={20} rx={4} fill="#f4ead0" stroke="#b8a074" strokeWidth={2}/>
        <rect x={80} y={710} width={528} height={96} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
        {Array.from({length: 4}, (_, i) => <rect key={i} x={98 + i * 130} y={722} width={112} height={72} rx={5} fill="none" stroke="#d9a468" strokeWidth={2} opacity={0.42}/>)}
        {/* the low desk, a few notes, lamp, inkpot, strongbox */}
        <rect x={250} y={652} width={230} height={16} rx={3} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/><rect x={256} y={668} width={218} height={24} fill="#6a4228" stroke="#3a2412" strokeWidth={1.6}/>
        <g transform="translate(366 650)">
          <rect x={-46} y={-8} width={64} height={30} rx={3} fill="#9fd0b0" stroke="#3a6a4a" strokeWidth={1.4} transform="rotate(-8 -14 7)"/>
          <rect x={-30} y={-12} width={64} height={30} rx={3} fill="#b9dcc6" stroke="#3a6a4a" strokeWidth={1.4} transform="rotate(4 2 3)"/>
          <rect x={-12} y={-6} width={64} height={30} rx={3} fill="#a8cfb8" stroke="#3a6a4a" strokeWidth={1.4} transform="rotate(14 20 9)"/>
        </g>
        <g transform="translate(290 650)"><path d="M-16,0 Q-14,-12 0,-14 Q14,-12 16,0 Z" fill="url(#f1-brass)" stroke="#6a4a10" strokeWidth={1.4}/><ellipse cx={0} cy={-18} rx={5} ry={9 + Math.sin(f / 4) * 1.2} fill="#fff2c0"/><circle cx={0} cy={-16} r={30} fill="url(#f1-lamp)" opacity={0.7}/></g>
        <g transform="translate(446 650)"><rect x={-9} y={-14} width={18} height={14} rx={3} fill="#2a3a5c" stroke="#101828" strokeWidth={1.2}/><path d="M4,-14 L12,-34" stroke="#6a4228" strokeWidth={1.8}/></g>
        <g transform="translate(548 690)"><rect x={-34} y={-44} width={68} height={44} rx={4} fill="url(#f1-iron)" stroke="#1a2030" strokeWidth={2}/><rect x={-30} y={-26} width={60} height={5} fill="url(#f1-brass)"/><circle cx={0} cy={-34} r={4} fill="#d9b45a"/></g>
      </g>
      {/* ---- stand 2: the fruit cart with a QR card ---- */}
      <Spot cx={975} cy={640} rx={290} ry={250} a={E(f, pp, 24)}/>
      <g>
        {[780, 1160].map((x) => <rect key={x} x={x} y={356} width={9} height={CT - 350} fill="#6a4a2c" stroke="#3a2412" strokeWidth={1.4}/>)}
        <Awning x={758} y={310} w={430} h={60} c1="#d8682a" c2="#fff4e0" n={8} f={f} sway={1.6}/>
        <BananaBunch x={830} y={372} s={0.7} sway={Math.sin(f / 22) * 1.2}/><BananaBunch x={1110} y={372} s={0.66} sway={Math.sin(f / 25 + 1) * 1.2}/>
        <Adult x={1050} y={904} h={480} f={f} seed={92} look={SELLER} arms={{R: [8, 14], L: [10, 16]}} hands={{R: "open"}} lookX={-0.6} smile={0.7}/>
        <FruitPile x={950} y={CT - 19} w={160} rows={3} kind="mango" seed={2} r={19}/><FruitPile x={1090} y={CT - 17} w={130} rows={3} kind="apple" seed={5} r={17}/>
        <FruitPile x={1020} y={CT - 16} w={90} rows={2} kind="orange" seed={11} r={16}/>
        <rect x={764} y={CT - 4} width={418} height={30} rx={5} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/><rect x={764} y={CT - 4} width={418} height={5} fill="#fff" opacity={0.3}/>
        <rect x={772} y={CT + 26} width={402} height={270} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${772 + i * 100},${CT + 26} V${CT + 296}`} stroke="#3a2412" strokeWidth={1.6} opacity={0.4}/>)}
        <path d={`M772,${CT + 62} H1174`} stroke="#b8323f" strokeWidth={5} opacity={0.75}/>
        <g transform={`translate(800 ${CT - 142})`}>
          {ringA > 0.01 && <rect x={-14} y={-10} width={138} height={172} rx={20} fill="#9fe0ff" opacity={0.5 * ringA} filter="url(#ak-blur8)"/>}
          <QRCard w={110} seed={9}/><path d="M30,142 L22,156 M80,142 L88,156" stroke="#6a4a2c" strokeWidth={5} strokeLinecap="round"/>
        </g>
      </g>
      <Adult x={700} y={950} h={560} f={f} seed={93} look={SHOPPER} arms={shopperArms} hands={{R: "fist"}} lookX={0.7} smile={0.6}
        held={{R: <g transform="translate(2 -3) rotate(-14)"><Phone s={0.15} screen="pay" glow={tap}/></g>}}/>
      {ringA > 0.01 && <g transform="translate(866 566)"><circle r={20 + 70 * ring} fill="none" stroke="#9fe0ff" strokeWidth={5} opacity={0.7 * (1 - ring)}/><circle r={10 + 36 * ring} fill="none" stroke="#fff" strokeWidth={3} opacity={0.6 * (1 - ring)}/></g>}
      {/* ---- stand 3: a plain bank counter, a queue of one ---- */}
      <g>
        <rect x={1340} y={346} width={510} height={380} fill="url(#f1-stone)" stroke="#8f826a" strokeWidth={2}/>
        <rect x={1340} y={346} width={510} height={14} fill="#cfc4ac" stroke="#8f826a" strokeWidth={1.4}/><rect x={1326} y={330} width={538} height={20} fill="#d9cfbd" stroke="#8f826a" strokeWidth={1.6}/>
        <rect x={1650} y={346} width={200} height={380} fill="#3a2a12" opacity={0.1}/>
        <path d="M1380,726 V470 Q1380,396 1470,396 L1720,396 Q1810,396 1810,470 V726 Z" fill="#6a4a30"/>
        <path d="M1392,726 V474 Q1392,408 1470,408 L1720,408 Q1798,408 1798,474 V726 Z" fill="url(#f1-plaster)"/>
        <rect x={1392} y={420} width={406} height={150} fill="#f6e3b0" opacity={0.35}/>
        <g transform="translate(1595 408)"><path d="M0,0 V60" stroke="#2a2018" strokeWidth={3}/><circle cx={0} cy={72} r={64 + Math.sin(f / 13) * 3} fill="url(#f1-lamp)"/><circle cx={0} cy={70} r={9} fill="#fff6c8" stroke="#b8923a" strokeWidth={1.4}/></g>
        <rect x={1412} y={470} width={90} height={160} rx={4} fill="#6a4228" stroke="#3a2412" strokeWidth={2}/>{[0, 1, 2].map((i) => <rect key={i} x={1420} y={480 + i * 48} width={74} height={38} rx={3} fill="none" stroke="#d9a468" strokeWidth={1.6} opacity={0.5}/>)}
        <rect x={1424} y={286} width={290} height={46} rx={5} fill="#2a3a5c" stroke="#d9b45a" strokeWidth={2.4}/>
        <text x={1569} y={320} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={28} letterSpacing="0.34em" fill="#f6e3a8">BANK</text>
        <Spot cx={1600} cy={640} rx={290} ry={250} a={E(f, lo, 24) * 0.0}/>
        <Adult x={1650} y={904} h={480} f={f} seed={94} look={TELLER} arms={tellerArms} hands={{R: "relax", L: "relax"}} lookX={-0.6} smile={0.5}/>
        <rect x={1380} y={CT} width={430} height={26} rx={4} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/><rect x={1380} y={CT} width={430} height={5} fill="#fff" opacity={0.3}/>
        <rect x={1388} y={CT + 26} width={414} height={270} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
        {[0, 1, 2].map((i) => <rect key={i} x={1404 + i * 134} y={CT + 46} width={118} height={218} rx={5} fill="none" stroke="#d9a468" strokeWidth={1.8} opacity={0.42}/>)}
        <rect x={1388} y={CT + 26} width={414} height={8} fill="url(#f1-brass)" opacity={0.9}/>
        {/* brass grille over the counter */}
        {Array.from({length: 11}, (_, i) => <path key={i} d={`M${1396 + i * 38},${CT - 130} V${CT - 2}`} stroke="url(#f1-brass)" strokeWidth={4} opacity={0.82}/>)}
        <rect x={1388} y={CT - 138} width={414} height={9} rx={3} fill="url(#f1-brass)" stroke="#6a4a10" strokeWidth={1.2}/>
        <rect x={1540} y={CT - 100} width={120} height={70} rx={4} fill="#cfe6ef" opacity={0.5} stroke="#7da3ba" strokeWidth={1.4}/>
        <Adult x={1500} y={950} h={560} f={f} seed={95} look={QUEUER} arms={{R: [6, 16], L: [4, 8]}} lookX={0.6 + waitSway * 0.1} smile={0.3}
          held={{L: <g transform="translate(1 -2) rotate(8)"><rect x={-4} y={-5} width={8} height={11} rx={1} fill="#2a5a96" stroke="#173b66" strokeWidth={0.5}/></g>}}/>
      </g>
      {/* ---- the one standing apart ---- */}
      <Spot cx={1262} cy={700} rx={150} ry={260} a={E(f, lo, 24)}/>
      <g opacity={1}>
        <Adult x={1262} y={972} h={560} f={f} seed={96} look={APART} arms={{R: [5, 10], L: [6, 12]}} lookX={0.6 - 1.2 * (0.5 + 0.5 * Math.sin(f / 90))} smile={0.1} headRot={Math.sin(f / 90) * 3}/>
        <rect x={1140} y={0} width={240} height={H} fill="#2a3a5c" opacity={0.06}/>
      </g>
      <Auto x={((f * 1.3 + 1200) % 2500) - 300} y={716} s={0.5} f={f} op={0.5}/>
      {/* ---- the PART 3 frame ---- */}
      {frameA > 0.005 && (
        <g opacity={frameA}>
          <rect x={56} y={56} width={1808} height={950} rx={26} fill="none" stroke="#000" strokeWidth={14} opacity={0.2} transform="translate(5 7)"/>
          <rect x={56} y={56} width={1808} height={950} rx={26} fill="none" stroke="url(#f1-brass)" strokeWidth={12} strokeDasharray={`${P3 * frameA} ${P3}`}/>
          <rect x={70} y={70} width={1780} height={922} rx={18} fill="none" stroke="#d9b45a" strokeWidth={2} opacity={0.7}/>
          {[[56, 56], [1864, 56], [56, 1006], [1864, 1006]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={1.6}/>)}
        </g>
      )}
    </g>
  );
};

export const StreetLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  const lo = L[2];
  return (
    <>
      {L[0] && <P2Card cx={350} y={180} text={L[0].text} f={p.f} at={L[0].at} size={38} maxW={560} upper={false}/>}
      {L[1] && <P2Card cx={975} y={180} text={L[1].text} f={p.f} at={L[1].at} size={38} maxW={560} upper={false} tone="cool"/>}
      {lo && <P2Card cx={1450} y={180} text={lo.text} f={p.f} at={lo.at} size={38} maxW={560} upper={false} tone="green"/>}
      {L[3] && <P2Card cx={960} y={72} text={L[3].text} f={p.f} at={L[3].at} size={36} maxW={1560}/>}
    </>
  );
};
