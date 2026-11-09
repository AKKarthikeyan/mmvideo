// ECO-16 Part 3, builder G1: `two-borrowers` mode "salim" (b00). A shoe workshop: Salim (apron) and two workers stitching, shelves of shoe boxes, a big order sheet,
// a stack of finished boxes by the door and a trader's van outside. Keys: sl (Salim named), od (the order sheet appears; the trader hands over a loan, notes only),
// then the boxes load into the van; pf: the money goes back to the trader (repaid) and a profit tag glows. Motion follows at(key) and dur only.
import React from "react";
import {SANS, SERIF, W, H, clamp, eio, rng} from "../kit";
import {Adult, GDefs, E1Defs, F1Defs, Bundle, ShoeBox, Plate, Shoes, Sun, Cloud, Hills, Palm, StreetBG, armTo, handPos, ez, sm, pulse, pop, arcP, mixn, FlatCoin, type Look, type Arms, type AP} from "./analogy_g1_kit";
import {prog} from "./analogy_kit";

const SALIM: Look = {kind: "apron", shirt: ["#efe6d0", "#bfb08a"], pants: "#3d4658", hair: "#241812", skin: 1, stache: true, glasses: true};
const W1: Look = {kind: "apron", shirt: ["#6c8fb5", "#41607f"], pants: "#5a4a3a", hair: "#1a120d", skin: 2};
const W2: Look = {kind: "apron", female: true, shirt: ["#c0603d", "#8c3a22"], pants: "#3a3f52", hair: "#1a120d", skin: 0};
const TRADER: Look = {kind: "plain", shirt: ["#e8dcc4", "#b8a888"], pants: "#2e3a35", hair: "#3a2a1c", skin: 3, stache: true};

const FLOOR = 790;           // the floor line of the workshop and the street
const SX = 985, SY = 985, SH = 540;
const TX = 1345, TY = 925, THH = 520;
const BX = 1148, BY = 872;   // the stack of finished boxes (centre, baseline)
const VX = 1580;             // the van, rear view, centre
const N = 10;                // boxes in the order (an illustration, not a figure)

const slotStack = (s: number): [number, number] => [BX + (s % 2 === 0 ? -50 : 50), BY - 26 - Math.floor(s / 2) * 50];
const slotVan = (s: number): [number, number] => [VX - 118 + (s % 4) * 78, 746 - Math.floor(s / 4) * 48];

const Workshop: React.FC<{f: number; orderA: number; ticks: number}> = ({f, orderA, ticks}) => {
  const g = rng(17), colors = ["#c0543a", "#2f78b8", "#d9a23a", "#4d8a5a", "#8a5aa0", "#c97a3a"];
  return (
    <g>
      {/* back wall, beams, floor */}
      <rect x={-60} y={-60} width={1330} height={FLOOR + 60} fill="url(#g1-wall)"/>
      <rect x={-60} y={500} width={1330} height={FLOOR - 500} fill="#d9b985" opacity={0.28}/>
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M${-60 + i * 170},-60 V${FLOOR}`} stroke="#b89462" strokeWidth={2} opacity={0.35}/>)}
      <rect x={-60} y={-10} width={1330} height={62} fill="#6a4426" stroke="#3a2412" strokeWidth={2}/>
      <rect x={-60} y={44} width={1330} height={10} fill="#3a2412" opacity={0.45}/>
      {[200, 560, 920].map((x) => <path key={x} d={`M${x},52 L${x + 120},170 L${x + 140},170 L${x + 24},52 Z`} fill="#6a4426" opacity={0.55}/>)}
      {/* arched window with a sky and a light shaft */}
      <g transform="translate(150 230)">
        <path d="M-12,296 V110 Q-12,-24 120,-24 Q252,-24 252,110 V296 Z" fill="#5a3a1e" stroke="#2f1d0e" strokeWidth={2}/>
        <path d="M0,290 V110 Q0,-8 120,-8 Q240,-8 240,110 V290 Z" fill="url(#g1-sky)"/>
        <Hills id="g1wh" base={250} amp={26} top="#a9c4a4" bottom="#cbd8aa" seed={2} wl={140} bottomY={290}/>
        <path d="M120,-8 V290 M0,140 H240" stroke="#5a3a1e" strokeWidth={6}/>
        <path d="M20,20 L90,20 L20,120 Z" fill="#fff" opacity={0.22}/>
        <rect x={-18} y={290} width={276} height={16} fill="#8a6038" stroke="#3a2412" strokeWidth={2}/>
      </g>
      <path d={`M150,300 L390,300 L760,${FLOOR + 80} L420,${FLOOR + 80} Z`} fill="url(#g1-ray)" opacity={0.42}/>
      {/* order sheet on the wall */}
      {orderA > 0.003 && (
        <g transform={`translate(640 ${408 - (1 - orderA) * 28}) scale(${0.86 + 0.14 * orderA})`} opacity={orderA} filter="url(#g1-sh)">
          <rect x={-130} y={-150} width={260} height={330} rx={6} fill="#fffaf0" stroke="#b8a074" strokeWidth={2.4}/>
          <rect x={-130} y={-150} width={260} height={52} rx={6} fill="#2a6fb8"/><rect x={-130} y={-114} width={260} height={16} fill="#2a6fb8"/>
          <text x={0} y={-112} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={38} letterSpacing="0.2em" fill="#fff6e4">ORDER</text>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(0 ${-62 + i * 50})`}>
              <g transform="translate(-80 4) scale(0.2)"><Shoes s={1} pair={false}/></g>
              <path d="M-52,6 H70" stroke="#8a7a58" strokeWidth={2.2} strokeDasharray="10 5" opacity={0.7}/>
              <rect x={86} y={-12} width={26} height={26} rx={4} fill="none" stroke="#8a7a58" strokeWidth={2}/>
              {ticks > i + 0.01 && <path d="M91,2 L98,10 L110,-8" stroke="#2f9a4a" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={clamp(ticks - i)}/>}
            </g>
          ))}
          <circle cx={0} cy={-156} r={9} fill="#c9962c" stroke="#6a4a10" strokeWidth={2}/>
        </g>
      )}
      {/* shelves of shoe boxes */}
      <g>
        <rect x={790} y={222} width={320} height={424} fill="#4a3320" stroke="#2a1a0c" strokeWidth={2.4}/>
        <rect x={798} y={230} width={304} height={408} fill="#2e2014"/>
        {[0, 1, 2].map((r) => <g key={r}>
          <rect x={790} y={330 + r * 104} width={320} height={12} fill="#8a5a30" stroke="#3a2412" strokeWidth={1.4}/>
          {Array.from({length: 4}, (_, i) => <ShoeBox key={i} x={838 + i * 78} y={314 + r * 104 + (i % 2) * 0} w={72} stripe={colors[(r * 4 + i + Math.floor(g() * 2)) % colors.length]}/>)}
        </g>)}
        <rect x={790} y={222} width={320} height={10} fill="#e8c58a" opacity={0.35}/>
      </g>
      {/* hanging lamps */}
      {[330, 950].map((x, i) => (
        <g key={x}><path d={`M${x},52 V160`} stroke="#2a2018" strokeWidth={3}/>
          <path d={`M${x - 36},196 Q${x - 30},158 ${x},156 Q${x + 30},158 ${x + 36},196 Z`} fill="#2f6a4a" stroke="#173b28" strokeWidth={2}/>
          <circle cx={x} cy={214 + Math.sin(f / 9 + i) * 1.2} r={64} fill="url(#f1-lamp)" opacity={0.85}/></g>
      ))}
    </g>
  );
};

const Bench: React.FC<{f: number}> = ({f}) => (
  <g>
    <rect x={110} y={650} width={700} height={24} rx={4} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2.4}/>
    <rect x={110} y={650} width={700} height={5} fill="#fff" opacity={0.3}/>
    <rect x={126} y={674} width={668} height={FLOOR - 674 + 10} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
    {[0, 1, 2, 3].map((i) => <rect key={i} x={146 + i * 162} y={692} width={142} height={FLOOR - 720} rx={6} fill="none" stroke="#d9a468" strokeWidth={2} opacity={0.42}/>)}
    {/* work on the bench: shoe uppers, a last, tools, thread, leather */}
    <g transform="translate(250 650)"><Shoes s={0.34} pair/></g>
    <g transform="translate(620 650)"><Shoes s={0.3} pair={false}/></g>
    <g transform="translate(520 646)">
      <ellipse cx={0} cy={0} rx={40} ry={5} fill="#2a1808" opacity={0.25}/>
      <path d="M-36,0 Q-30,-22 0,-24 Q34,-22 36,0 Z" fill="#7a4a24" stroke="#3a2412" strokeWidth={1.6}/>
      <path d="M-26,-14 Q0,-20 28,-14" stroke="#c78a52" strokeWidth={2.2} fill="none"/>
    </g>
    <g transform="translate(160 650)"><rect x={-18} y={-30} width={36} height={30} rx={3} fill="#c0543a" stroke="#6a2a1a" strokeWidth={1.6}/><path d="M-18,-20 H18 M-18,-10 H18" stroke="#fff3da" strokeWidth={1.4} opacity={0.6}/>
      <path d="M0,-30 L0,-44" stroke="#efe6d0" strokeWidth={2}/></g>
    <g transform="translate(700 650)"><rect x={-8} y={-26} width={16} height={26} rx={3} fill="#e8dcc4" stroke="#8a7a58" strokeWidth={1.4}/><path d="M0,-26 L10,-52" stroke="#5a3c22" strokeWidth={3} strokeLinecap="round"/></g>
    <path d="M70,648 Q110,630 148,648 L150,652 L70,652 Z" fill="#8a5a30" stroke="#4a2c14" strokeWidth={1.6}/>
  </g>
);

const Van: React.FC<{f: number; front: boolean}> = ({f, front}) => {
  const x0 = VX - 190, x1 = VX + 190;
  if (!front) return (
    <g>
      <ellipse cx={VX} cy={FLOOR + 6} rx={240} ry={16} fill="#2a1808" opacity={0.3}/>
      <rect x={x0 - 40} y={452} width={380 + 80} height={340} rx={6} fill="#26364c"/>
      {/* open rear doors */}
      <path d={`M${x0},470 L${x0 - 70},500 L${x0 - 70},770 L${x0},790 Z`} fill="url(#g1-van)" stroke="#8a826e" strokeWidth={2.4}/>
      <path d={`M${x1},470 L${x1 + 70},500 L${x1 + 70},770 L${x1},790 Z`} fill="url(#g1-van)" stroke="#8a826e" strokeWidth={2.4}/>
      <rect x={x0 - 58} y={540} width={44} height={70} rx={4} fill="#9fc4dc" opacity={0.7} stroke="#8a826e" strokeWidth={1.6}/>
      <rect x={x1 + 14} y={540} width={44} height={70} rx={4} fill="#9fc4dc" opacity={0.7} stroke="#8a826e" strokeWidth={1.6}/>
      {/* body and the dark hold */}
      <path d={`M${x0 - 10},790 V520 Q${x0 - 10},452 ${x0 + 70},452 H${x1 - 70} Q${x1 + 10},452 ${x1 + 10},520 V790 Z`} fill="url(#g1-van)" stroke="#8a826e" strokeWidth={2.6}/>
      <path d={`M${x0 + 12},770 V528 Q${x0 + 12},478 ${x0 + 70},478 H${x1 - 70} Q${x1 - 12},478 ${x1 - 12},528 V770 Z`} fill="#201a14"/>
      <path d={`M${x0 + 12},770 V528 Q${x0 + 12},478 ${x0 + 70},478 H${x1 - 70} Q${x1 - 12},478 ${x1 - 12},528 V770 Z`} fill="url(#g1-spot)" opacity={0.25}/>
      <rect x={x0 + 12} y={766} width={356} height={10} fill="#6a4a2c"/>
      {/* stripe and plain sign */}
      <rect x={x0 - 10} y={800} width={400} height={8} fill="#24507c"/>
    </g>
  );
  return (
    <g>
      <rect x={x0 - 18} y={780} width={416} height={26} rx={7} fill="#4a5058" stroke="#23262b" strokeWidth={2}/>
      <rect x={x0 - 6} y={790} width={392} height={6} fill="#8a919a" opacity={0.6}/>
      <circle cx={x0 + 6} cy={742} r={13} fill="#d9402a" stroke="#6a1a12" strokeWidth={2}/><circle cx={x1 - 6} cy={742} r={13} fill="#d9402a" stroke="#6a1a12" strokeWidth={2}/>
      <rect x={VX - 62} y={792} width={124} height={22} rx={3} fill="#f0e8cf" stroke="#8a826e" strokeWidth={1.6} opacity={0.0}/>
    </g>
  );
};

export const SalimArt: React.FC<AP> = (p) => {
  const {f, dur, at} = p, sl = at("sl"), od = at("od"), pf = at("pf");
  // the order sheet and the work
  const orderA = pop(f, od, 20);
  const stitch = f / 5.2;
  const prodEnd = Math.max(40, od - 30);
  // loan hand-over (trader -> Salim), then loading, then repayment (Salim -> trader)
  const loanT = od + 2, loanD = 40;
  const lu = clamp((f - loanT) / loanD);
  const loadStart = od + 20, loadEnd = Math.max(loadStart + 40, pf - 6), per = clamp((loadEnd - loadStart) / 3, 10, 18), stag = Math.max(1, (loadEnd - loadStart - per) / (N - 1));
  const repT = pf - 2, ru = clamp((f - repT) / 40);
  const M: [number, number] = [1196, 566];
  const meetL = sm(f, loanT, 14) * (1 - sm(f, loanT + 24, 14)), meetR = sm(f, repT, 14) * (1 - sm(f, repT + 24, 14));
  const meet = Math.max(meetL, meetR);
  const loaded = Array.from({length: N}, (_, d) => clamp((f - (loadStart + d * stag)) / per));
  const nLoaded = loaded.reduce((a, b) => a + (b >= 1 ? 1 : 0), 0);
  const ticks = nLoaded / 2;
  // Salim: points at the order, takes the notes, hands them back
  const point = sm(f, od - 4, 14) * (1 - sm(f, od + 30, 18));
  const sR0 = handPos(SX, SY, SH, {R: [38, 62]}, "R");
  const sTarget: [number, number] = [mixn(mixn(1000 + 8, 900, point), M[0], meet), mixn(mixn(760, 360, point), M[1], meet)];
  const sArms: Arms = {R: armTo(SX, SY, SH, "R", sTarget, Math.max(point, meet)), L: [14, 30]};
  const tTarget: [number, number] = [mixn(TX - 62, M[0] + 14, meet), mixn(760, M[1] - 4, meet)];
  const tArms: Arms = {L: armTo(TX, TY, THH, "L", tTarget, meet), R: [8, 40]};
  const sHand = handPos(SX, SY, SH, sArms, "R"), tHand = handPos(TX, TY, THH, tArms, "L");
  // the bundle: trader's hand -> Salim's hand -> pocket; later pocket -> Salim's hand -> trader's hand
  const pocket: [number, number] = [SX + 18, SY - 38 * SH / 100];
  let bundle: [number, number] | null = null, bK = 1, bGlow = 0;
  if (f >= loanT && f < repT) {
    const u = lu;
    bundle = u < 0.5 ? [tHand[0], tHand[1] + 4] : u < 0.7 ? [sHand[0] - 4, sHand[1]] : arcP([sHand[0], sHand[1]], pocket, 14, sm(f, loanT + loanD * 0.7, 14));
    bK = u > 0.95 ? clamp(1 - (u - 0.95) * 20) : 1;
    if (u >= 1) bundle = null;
  }
  if (f >= repT && ru <= 1) {
    const u = ru;
    bundle = u < 0.3 ? arcP(pocket, [sHand[0], sHand[1]], 10, sm(f, repT, 14)) : u < 0.62 ? [sHand[0] + 4, sHand[1]] : [tHand[0] - 2, tHand[1] + 2];
    bK = u > 0.95 ? clamp(1 - (u - 0.95) * 20) : 1;
    bGlow = pulse(f, repT + 12, 30) * 0.6;
    if (u >= 1) bundle = null;
  }
  if (f < loanT) bundle = f > od - 4 ? [tHand[0], tHand[1] + 4] : null;
  // the profit tag
  const profit = sm(f, pf, 22), pGlow = profit * (0.6 + 0.4 * Math.sin(f / 7));
  // workers
  const wA = (bx: number, ph: number): Arms => {
    const a = f / 5 + ph;
    return {R: armTo(bx, 805, 470, "R", [bx + 50 + Math.cos(a) * 12, 660 + Math.sin(a * 1.3) * 9], 1), L: armTo(bx, 805, 470, "L", [bx - 40, 664 + Math.sin(a * 0.7) * 3], 1)};
  };
  const worker1 = wA(240, 0), worker2 = wA(470, 2.2);
  // the stack grows with the work
  const stackAppear = (s: number) => ez(f, 10 + (s * prodEnd) / N, 14);
  return (
    <g>
      <GDefs/><E1Defs/><F1Defs/>
      {/* outdoors on the right, then the workshop in front of it */}
      <g>
        <rect x={1250} y={-60} width={W - 1190} height={FLOOR + 60} fill="url(#g1-sky)"/>
        <Sun x={1750} y={220} r={46} f={f} glow={0.9}/>
        {[0, 1].map((i) => <Cloud key={i} x={1320 + i * 420} y={170 + i * 60} s={0.6} f={f} speed={0.1} seed={i + 4} a={0.7}/>)}
        <Hills id="g1h1" base={560} amp={40} top="#b9cbdd" bottom="#d6dfe0" seed={2.2} wl={300}/>
        {Array.from({length: 5}, (_, i) => <rect key={i} x={1290 + i * 140} y={440 + (i % 3) * 36} width={110} height={360} fill="#b4c4d4" opacity={0.7}/>)}
        <Palm x={1840} y={FLOOR - 4} s={0.7} f={f} seed={3} op={0.9}/>
        <rect x={1250} y={FLOOR - 30} width={W - 1190} height={H - FLOOR + 90} fill="url(#e1-ground)"/>
        <rect x={1250} y={FLOOR - 30} width={W - 1190} height={14} fill="#f0dcb4" opacity={0.6}/>
      </g>
      <Workshop f={f} orderA={orderA} ticks={ticks}/>
      <rect x={-60} y={FLOOR - 30} width={1320} height={H - FLOOR + 90} fill="url(#g1-floor)"/>
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M-60,${FLOOR + i * i * 3 + i * 14} H1260`} stroke="#3a2412" strokeWidth={1.4} opacity={0.25}/>)}
      <rect x={-60} y={FLOOR - 30} width={1320} height={12} fill="#e8c58a" opacity={0.35}/>
      {/* canopy over the door and the post */}
      <path d="M1230,128 L1760,128 L1800,214 L1196,214 Z" fill="#c0543a" stroke="#6a2a1a" strokeWidth={2.4}/>
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${1250 + i * 106},128 L${1290 + i * 106},128 L${1262 + i * 108},214 L${1210 + i * 108},214 Z`} fill="#fff4e0" opacity={0.92}/>)}
      <rect x={1236} y={120} width={26} height={FLOOR - 112} fill="#6a4426" stroke="#3a2412" strokeWidth={2.4}/>
      <rect x={1236} y={120} width={9} height={FLOOR - 112} fill="#fff" opacity={0.14}/>
      {/* the van outside */}
      <Van f={f} front={false}/>
      {/* boxes: the finished stack, then the loaded ones inside the van */}
      <rect x={BX - 82} y={BY - 2} width={164} height={14} rx={3} fill="#7a4c26" stroke="#3a2412" strokeWidth={1.6}/>
      <rect x={BX - 82} y={BY + 12} width={164} height={8} fill="#3a2412" opacity={0.4}/>
      {Array.from({length: N}, (_, s) => {
        const d = N - 1 - s, u = loaded[d], a = stackAppear(s);
        const [sx, sy] = slotStack(s), [vx, vy] = slotVan(d);
        if (u >= 1) return null;
        const pos: [number, number] = u > 0 ? arcP([sx, sy], [vx, vy], 120, eio(u)) : [sx, sy - (1 - a) * 60];
        const k = u > 0 ? mixn(1, 0.7, eio(u)) : 1;
        return <ShoeBox key={s} x={pos[0]} y={pos[1]} w={96} k={k} rot={u > 0 ? Math.sin(Math.PI * u) * -8 : 0} stripe={["#c0543a", "#2f78b8", "#d9a23a"][s % 3]} op={u > 0 ? 1 : a}/>;
      })}
      {Array.from({length: N}, (_, d) => loaded[d] >= 1 ? <ShoeBox key={`v${d}`} x={slotVan(d)[0]} y={slotVan(d)[1]} w={96} k={0.7} stripe={["#c0543a", "#2f78b8", "#d9a23a"][(N - 1 - d) % 3]}/> : null)}
      <Van f={f} front/>
      {/* the trader (outside) and the workers (behind the bench) */}
      <Adult x={TX} y={TY} h={THH} f={f} seed={61} look={TRADER} arms={tArms} hands={{L: meet > 0.5 ? "open" : "relax", R: "relax"}} lookX={-0.6} smile={0.5 + profit * 0.5}/>
      <Adult x={240} y={805} h={470} f={f} seed={62} look={W1} arms={worker1} hands={{R: "fist", L: "fist"}} lookX={0.2} legsHidden smile={0.3}
        held={{L: <g transform="translate(-3 -2) rotate(30)"><Shoes s={0.1} pair={false}/></g>}}/>
      <Adult x={470} y={805} h={470} f={f} seed={63} look={W2} arms={worker2} hands={{R: "fist", L: "fist"}} lookX={0.3} legsHidden smile={0.4}
        held={{L: <g transform="translate(-3 -2) rotate(30)"><Shoes s={0.1} pair={false}/></g>}}/>
      <Bench f={f}/>
      <Adult x={SX} y={SY} h={SH} f={f} seed={64} look={SALIM} arms={sArms} hands={{R: meet > 0.4 ? "open" : point > 0.4 ? "point" : "relax", L: "relax"}} lookX={meet > 0.3 ? 0.7 : 0.2 + point * -0.4} smile={0.45 + profit * 0.45}
        held={{L: <g transform="translate(2 -3) rotate(-8)"><Shoes s={0.12} pair={false}/></g>}}/>
      {bundle && <Bundle x={bundle[0]} y={bundle[1]} s={0.95 * bK} rot={-8} glow={bGlow} op={bK}/>}
      {/* the profit tag glows beside the stack, hung from the canopy */}
      <g>
        <path d="M1090,214 V330 M1210,214 V330" stroke="#2a2018" strokeWidth={2} opacity={profit > 0.01 ? 0.8 : 0}/>
        <Plate x={1150} y={368} w={176} h={78} lines={["PROFIT"]} a={profit} size={34} glow={pGlow}/>
        {Array.from({length: 4}, (_, i) => <FlatCoin key={i} x={1150 - 36 + i * 24} y={452 - (i % 2) * 6} r={15} op={ez(f, pf + 14 + i * 7, 12)}/>)}
      </g>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#ff9a3c" opacity={0.08}/>
    </g>
  );
};
