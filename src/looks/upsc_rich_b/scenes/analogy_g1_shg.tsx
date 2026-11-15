// ECO-16 Part 3, builder G1: `shg-circle`. mode "group" (b08a): a circle of 18 people (women and men) on a floor mat in a village courtyard, a savings box and a passbook at the centre; coins drop in
// on a regular beat from sv; at el a bank officer arrives with a file marked GROUP LOAN; at gp a soft ring runs round the circle (the group is responsible for repayment; no collateral is drawn).
// mode "numbers" (b08b; table e16_shg): two stacks of small group icons, savings-linked and credit-linked; heights follow the table. Keys: sg, mb, sv, el, gp / nb, sl, cl.
import React from "react";
import {SANS, SERIF, W, H, clamp, eio, rng} from "../kit";
import {fig} from "../../cartoon/long/figs";
import {Adult, GDefs, E1Defs, F1Defs, Seated, Bundle, FlatCoin, Plate, Sign, Sun, Cloud, Hills, Palm, Tree, House, P2Card, elabs, armTo, ez, sm, pop, pulse, arcP, mixn, type Look, type Arms, type AP, type SeatLook} from "./analogy_g1_kit";

const OFFICER: Look = {kind: "plain", shirt: ["#dfe8f2", "#9fb2c6"], pants: "#2e3a4c", hair: "#1a120d", skin: 3, glasses: true};

const SAREE: [string, string][] = [["#c0603d", "#8c3a22"], ["#2f7a78", "#1c4f4d"], ["#d9b26a", "#a5782e"], ["#7a4a8a", "#52305e"], ["#4d8a5a", "#2f5f3a"], ["#c9486a", "#8c2a48"], ["#3f6fa8", "#274a78"]];
const N = 16;                                            // an illustration of "15 to 20 members"
const CX = 960, CY = 742, RX = 620, RY = 152;
const MAT = {cx: CX, cy: CY + 6, rx: 760, ry: 216};

type Member = {x: number; y: number; ang: number; look: SeatLook; seed: number; face: "front" | "back" | "side"; flip: boolean; h: number};
const MEMBERS: Member[] = (() => {
  const g = rng(31), out: Member[] = [];
  for (let i = 0; i < N; i++) {
    const a = Math.PI / 2 + ((i + 0.5) / N) * Math.PI * 2, x = CX + Math.cos(a) * RX, y = CY + Math.sin(a) * RY, depth = (Math.sin(a) + 1) / 2;
    const male = i === 2 || i === 7 || i === 10 || i === 14, sa = SAREE[Math.floor(g() * SAREE.length)];
    const look: SeatLook = male
      ? {female: false, skin: Math.floor(g() * 4), top: i % 2 ? ["#9fb6cf", "#6f87a4"] : ["#efe6d0", "#bfb08a"], lower: "#e6dcc0", hair: i === 7 ? "#8a8a86" : "#1a120d", stache: i !== 10, cap: i === 14}
      : {female: true, skin: Math.floor(g() * 4), top: sa, lower: sa[1], scarf: sa[0], hair: "#1a120d"};
    out.push({x, y, ang: a, look, seed: i + 5, face: Math.sin(a) > 0.28 ? "back" : "front", flip: Math.cos(a) < 0, h: 176 + depth * 84});
  }
  return out.sort((p, q) => p.y - q.y);
})();

export const Courtyard: React.FC<{f: number; dur: number}> = ({f, dur}) => {
  const par = Math.sin((f / Math.max(1, dur)) * 3) * 5;
  return (
    <g>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#e1-sky)"/>
      <Sun x={1700} y={200} r={44} f={f} glow={0.9}/>
      {[0, 1].map((i) => <Cloud key={i} x={300 + i * 760} y={130 + i * 40} s={0.7} f={f} speed={0.1} seed={i + 6} a={0.7}/>)}
      <g transform={`translate(${par} 0)`}><Hills id="g1c1" base={470} amp={40} top="#b9cbdd" bottom="#d6dfe0" seed={2.7} wl={320}/></g>
      <Palm x={90} y={600} s={0.95} f={f} seed={4}/><Palm x={1840} y={596} s={0.85} f={f} seed={7}/>
      {/* the house wall, tiled roof, veranda posts, a doorway and windows, marigold garlands */}
      <g>
        <rect x={150} y={290} width={1620} height={330} fill="#ead3a2" stroke="#00000030" strokeWidth={1.6}/>
        <rect x={150} y={290} width={400} height={330} fill="#fff" opacity={0.1}/><rect x={1400} y={290} width={370} height={330} fill="#3a2412" opacity={0.1}/>
        <rect x={150} y={560} width={1620} height={60} fill="#b9966a" opacity={0.5}/>
        <path d="M110,296 L1810,296 L1740,190 L180,190 Z" fill="#b4562e" stroke="#6a2a1a" strokeWidth={2.4} strokeLinejoin="round"/>
        {Array.from({length: 24}, (_, i) => <path key={i} d={`M${200 + i * 70},192 L${150 + i * 71},296`} stroke="#6a2a1a" strokeWidth={1.6} opacity={0.5}/>)}
        <path d="M110,296 L1810,296" stroke="#f0c090" strokeWidth={3} opacity={0.5}/>
        <path d="M820,620 V400 Q820,350 960,350 Q1100,350 1100,400 V620 Z" fill="#4a3220" stroke="#2a1a0c" strokeWidth={2.4}/>
        <path d="M838,620 V404 Q838,368 960,368 Q1082,368 1082,404 V620 Z" fill="#2a1c12"/>
        <path d="M840,620 L880,470 L1040,470 L1080,620 Z" fill="url(#f1-lamp)" opacity={0.3}/>
        {[330, 1500].map((x) => <g key={x}><rect x={x} y={380} width={150} height={130} rx={6} fill="#35261a" stroke="#6a4426" strokeWidth={5}/><path d={`M${x + 75},384 V506 M${x + 4},446 H${x + 146}`} stroke="#6a4426" strokeWidth={4}/><rect x={x - 26} y={380} width={26} height={130} fill="#3f7a58" opacity={0.95}/><rect x={x + 150} y={380} width={26} height={130} fill="#3f7a58" opacity={0.95}/></g>)}
        {[220, 640, 1280, 1700].map((x) => <rect key={x} x={x} y={296} width={16} height={330} fill="#7a5632" stroke="#3a2412" strokeWidth={1.8}/>)}
        {[[240, 1300], [660, 1000]].map(([a, b], k) => <path key={k} d={`M${a},304 Q${(a + b) / 2},${352 + (f % 1) * 0} ${b},304`} stroke="#f08a1c" strokeWidth={9} strokeDasharray="1 11" strokeLinecap="round" fill="none" opacity={0.9}/>)}
        <path d="M1300,304 Q1500,356 1700,304" stroke="#f6c844" strokeWidth={9} strokeDasharray="1 11" strokeLinecap="round" fill="none" opacity={0.9}/>
      </g>
      <Tree x={60} y={640} s={0.95} f={f} seed={4} hue={8}/>
      {/* a tulsi plinth */}
      <g transform="translate(1700 660)"><rect x={-34} y={-46} width={68} height={46} fill="#e2c694" stroke="#8a7050" strokeWidth={1.6}/><rect x={-26} y={-60} width={52} height={14} fill="#d9b680" stroke="#8a7050" strokeWidth={1.4}/>
        {[-16, -6, 6, 16].map((x, i) => <path key={i} d={`M${x},-60 Q${x * 1.6},${-84 - (i % 2) * 8} ${x * 2},${-92}`} stroke="#3f8a3a" strokeWidth={5} fill="none" strokeLinecap="round"/>)}</g>
      {/* ground */}
      <rect x={-60} y={620} width={W + 120} height={H - 620 + 60} fill="url(#e1-ground)"/>
      <rect x={-60} y={620} width={W + 120} height={16} fill="#f0dcb4" opacity={0.65}/>
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M-60,${660 + i * i * 6 + i * 12} H${W + 60}`} stroke="#6a4a2a" strokeWidth={1.3} opacity={0.16}/>)}
      {Array.from({length: 14}, (_, i) => <ellipse key={i} cx={(i * 281) % W} cy={690 + ((i * 97) % 300)} rx={10 + (i % 4) * 6} ry={3 + (i % 3)} fill="#7a5a36" opacity={0.18}/>)}
    </g>
  );
};

const Mat: React.FC = () => (
  <g>
    <ellipse cx={MAT.cx + 6} cy={MAT.cy + 14} rx={MAT.rx} ry={MAT.ry} fill="#2a1808" opacity={0.3} filter="url(#ak-blur8)"/>
    <ellipse cx={MAT.cx} cy={MAT.cy} rx={MAT.rx} ry={MAT.ry} fill="#7a2a1e" stroke="#3a1008" strokeWidth={2}/>
    <ellipse cx={MAT.cx} cy={MAT.cy} rx={MAT.rx - 14} ry={MAT.ry - 10} fill="url(#g1-mat)"/>
    {[0.86, 0.7, 0.54].map((k, i) => <ellipse key={i} cx={MAT.cx} cy={MAT.cy} rx={(MAT.rx - 14) * k} ry={(MAT.ry - 10) * k} fill="none" stroke={i % 2 ? "#f4d68a" : "#fff0c8"} strokeWidth={i === 1 ? 4 : 2.6} opacity={0.7} strokeDasharray={i === 1 ? "14 8" : undefined}/>)}
    <ellipse cx={MAT.cx} cy={MAT.cy - 8} rx={MAT.rx - 40} ry={MAT.ry - 38} fill="#fff" opacity={0.05}/>
  </g>
);

/** the savings box and the open passbook at the centre of the mat */
const Centre: React.FC<{lines: number; landed: number; glow: number}> = ({lines, landed, glow}) => (
  <g transform={`translate(${CX} ${CY}) scale(1.5)`}>
    <ellipse cx={0} cy={22} rx={150} ry={26} fill="#2a1808" opacity={0.3}/>
    <rect x={-130} y={-4} width={260} height={30} rx={14} fill="#f0e4c4" stroke="#a8946a" strokeWidth={1.6} opacity={0.9}/>
    {/* passbook */}
    <g transform="translate(-72 8) rotate(-4)">
      <path d="M-56,0 L-52,-22 L-2,-18 L-2,4 Z" fill="#fffaf0" stroke="#b8a074" strokeWidth={1.8}/><path d="M56,0 L52,-22 L2,-18 L2,4 Z" fill="#f6efdc" stroke="#b8a074" strokeWidth={1.8}/>
      {Array.from({length: 4}, (_, i) => <g key={i}><path d={`M-46,${-15 + i * 5} L-8,${-12 + i * 5}`} stroke="#8a7a58" strokeWidth={1.1} opacity={0.7}/>
        <path d={`M8,${-12 + i * 5} L46,${-15 + i * 5}`} stroke="#2a4a8a" strokeWidth={1.4} opacity={i < lines ? 0.9 : 0}/></g>)}
      <path d="M-58,3 L58,3 L54,9 L-54,9 Z" fill="#2a6fb8" stroke="#173b66" strokeWidth={1.4}/>
    </g>
    {/* the savings box: a tin box with a slot */}
    <g transform="translate(70 -2)">
      {glow > 0.01 && <ellipse cx={0} cy={-20} rx={86} ry={60} fill="url(#ak-sunglow)" opacity={glow}/>}
      <rect x={-48} y={-52} width={96} height={64} rx={6} fill="url(#f1-iron)" stroke="#1a2030" strokeWidth={2.4}/>
      <rect x={-48} y={-52} width={96} height={16} rx={6} fill="#8a93a0" stroke="#1a2030" strokeWidth={2}/>
      <rect x={-22} y={-46} width={44} height={7} rx={3.5} fill="#10151c"/>
      <rect x={-8} y={-22} width={16} height={22} rx={3} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={1.4}/>
      <path d="M-44,-34 L-44,8" stroke="#fff" strokeWidth={2} opacity={0.2}/>
    </g>
    {/* a small heap of coins beside the box */}
    {Array.from({length: Math.min(9, landed)}, (_, i) => <FlatCoin key={i} x={-4 + (i % 3) * 18 + (Math.floor(i / 3) % 2) * 8} y={14 - Math.floor(i / 3) * 6} r={10}/>)}
  </g>
);

const SLOT: [number, number] = [CX + 70 * 1.5, CY - 46 * 1.5];
const FILE_TXT = "GROUP LOAN";

export const GroupArt: React.FC<AP> = (p) => {
  const {f, dur, at} = p, sg = at("sg"), mb = at("mb"), sv = at("sv"), el = at("el"), gp = at("gp");
  const beatT = 34, nBeats = f < sv ? 0 : Math.floor((f - sv) / beatT) + 1;
  // the member whose turn it is and how far along the coin is
  const turn = (k: number) => MEMBERS[(k * 7 + 3) % N];
  const cur = nBeats > 0 ? nBeats - 1 : -1, bt = f - sv - cur * beatT;
  const raiseOf = (m: Member) => {
    if (cur < 0) return 0;
    const t = turn(cur);
    return t === m ? sm(f, sv + cur * beatT, 12) * (1 - sm(f, sv + cur * beatT + 20, 12)) : 0;
  };
  const handOf = (m: Member): [number, number] => {
    const k = m.h / 64, sx = m.flip ? -1 : 1;
    return [m.x + sx * 22 * k, m.y - 34 * k];
  };
  const landed = Math.max(0, nBeats - (bt < 30 ? 1 : 0));
  const coin = cur >= 0 && bt >= 8 && bt < 30 ? arcP(handOf(turn(cur)), SLOT, 60, eio((bt - 8) / 22)) : null;
  const flash = cur >= 0 ? pulse(f, sv + cur * beatT + 28, 14) : 0;
  const lines = Math.min(4, Math.max(0, landed - 1));
  // the officer arrives
  const ox = mixn(2060, 1546, sm(f, el, 62)), walk = clamp(Math.abs(mixn(2060, 1546, sm(f + 1, el, 62)) - mixn(2060, 1546, sm(f - 1, el, 62))) / 2 / 2.2);
  const offerU = sm(f, el + 66, 22);
  const oArms: Arms = {L: armTo(ox, 972, 540, "L", [ox - 70, 700], offerU), R: [6, 12]};
  // the ring (the group answers for repayment)
  const ring = ez(f, gp, 30), dashSpeed = f * 1.6;
  const back = MEMBERS.filter((m) => m.y < CY - 10), front = MEMBERS.filter((m) => m.y >= CY - 10);
  const renderM = (m: Member, i: number) => {
    const seatA = pop(f, sg + 3 + (m.ang * 8) % 30, 16);
    const wave = Math.max(0, Math.sin((f - mb) / 6 - m.ang * 3)) * (f > mb && f < mb + 70 ? 1 : 0);
    const r = raiseOf(m), sx = m.flip ? -1 : 1;
    return (
      <g key={m.seed} opacity={clamp(seatA * 1.6)} transform={`translate(0 ${(1 - seatA) * 20})`}>
        {wave > 0.02 && <ellipse cx={m.x} cy={m.y - m.h * 0.5} rx={m.h * 0.42} ry={m.h * 0.56} fill="url(#ak-sunglow)" opacity={wave * 0.8}/>}
        <Seated x={m.x} y={m.y} h={m.h * (1 + wave * 0.03)} f={f} seed={m.seed} look={m.look} facing={m.face} flip={m.flip} raise={r} rx={22} ry={-34} nod={r * 1.5}
          held={r > 0.4 && bt < 12 ? <g transform="scale(0.5)"><circle r={4} fill="url(#e1-gold)" stroke="#8a5a10" strokeWidth={0.8}/></g> : undefined}/>
      </g>
    );
  };
  return (
    <g>
      <GDefs/><E1Defs/><F1Defs/>
      <Courtyard f={f} dur={dur}/>
      <Mat/>
      {back.map(renderM)}
      <Centre lines={lines} landed={landed} glow={flash}/>
      {coin && <g transform={`translate(${coin[0]} ${coin[1]})`}><circle r={9} fill="url(#e1-gold)" stroke="#8a5a10" strokeWidth={1.4}/><circle r={5.4} fill="none" stroke="#b9801a" strokeWidth={1}/></g>}
      {front.map(renderM)}
      {/* the ring that runs round the circle */}
      {ring > 0.01 && (
        <g opacity={ring * 0.9}>
          <ellipse cx={CX} cy={CY - 40} rx={RX + 170} ry={RY + 200} fill="none" stroke="#ffd37a" strokeWidth={16} opacity={0.3} filter="url(#ak-blur8)"/>
          <ellipse cx={CX} cy={CY - 40} rx={RX + 170} ry={RY + 200} fill="none" stroke="url(#f1-brass)" strokeWidth={7} strokeDasharray="26 16" strokeDashoffset={-dashSpeed} strokeLinecap="round"/>
        </g>
      )}
      {/* the bank officer with the file */}
      {f >= el - 2 && (
        <g>
          <Adult x={ox} y={972} h={540} f={f} seed={91} look={OFFICER} arms={oArms} hands={{L: offerU > 0.4 ? "open" : "fist", R: "relax"}} lookX={-0.6} walkAmt={walk} smile={0.5}/>
          <g transform={`translate(${mixn(ox - 36, ox - 78, offerU)} ${mixn(742, 704, offerU)}) rotate(${mixn(-6, -10, offerU)})`} filter="url(#g1-sh-s)">
            <rect x={-70} y={-52} width={140} height={104} rx={5} fill="#2a6fb8" stroke="#173b66" strokeWidth={2.4}/>
            <rect x={-70} y={-62} width={56} height={16} rx={4} fill="#2a6fb8" stroke="#173b66" strokeWidth={2}/>
            <rect x={-54} y={-26} width={108} height={46} rx={3} fill="#fff7e4" stroke="#b8a074" strokeWidth={1.6}/>
            <text x={0} y={2} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={19} letterSpacing="0.1em" fill="#173b66">GROUP</text>
            <text x={0} y={22} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={19} letterSpacing="0.1em" fill="#173b66">LOAN</text>
          </g>
        </g>
      )}
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#ff9a3c" opacity={0.07}/>
    </g>
  );
};

export const GroupLabels: React.FC<AP> = (p) => {
  const L = elabs(p), {f} = p;
  return (
    <>
      <P2Card cx={470} y={120} text={L.sg.text} f={f} at={L.sg.at} size={34} maxW={640}/>
      <P2Card cx={1000} y={120} text={L.mb.text} f={f} at={L.mb.at} size={36} maxW={380} upper={false}/>
      <P2Card cx={1480} y={120} text={L.sv.text} f={f} at={L.sv.at} size={32} maxW={560} upper={false}/>
      <P2Card cx={500} y={236} text={L.el.text} f={f} at={L.el.at} size={32} maxW={620} upper={false} tone="cool"/>
      <P2Card cx={1330} y={236} text={L.gp.text} f={f} at={L.gp.at} size={30} maxW={720} upper={false} tone="green"/>
    </>
  );
};

// ---- numbers ------------------------------------------------------------------------------------------------------------------------
const TILE = 58, COLS = 6, UNIT = 3;                      // one tile stands for UNIT lakh groups (a scale, not a printed figure)
const Tile: React.FC<{x: number; y: number; k: number; tone: "teal" | "amber"; rim?: number}> = ({x, y, k, tone, rim = 0}) => {
  const c = tone === "teal" ? ["#4fa89c", "#2a6f78"] : ["#e8a23a", "#a86a14"];
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs><clipPath id={`g1tc-${Math.round(x)}-${Math.round(y)}-${tone}`}><rect x={-TILE / 2} y={TILE / 2 - TILE * k} width={TILE} height={TILE * k}/></clipPath></defs>
      <g clipPath={k < 1 ? `url(#g1tc-${Math.round(x)}-${Math.round(y)}-${tone})` : undefined}>
        <rect x={-TILE / 2 + 2} y={-TILE / 2 + 2} width={TILE - 4} height={TILE - 4} rx={9} fill={c[0]} stroke={c[1]} strokeWidth={2}/>
        <rect x={-TILE / 2 + 7} y={-TILE / 2 + 6} width={TILE * 0.5} height={5} rx={2.5} fill="#fff" opacity={0.4}/>
        {[-12, 0, 12].map((dx, i) => <g key={i} transform={`translate(${dx} ${i === 1 ? -2 : 3})`}><circle cx={0} cy={-8} r={5.6} fill="#fff4dc"/><path d="M-8,13 Q-8,0 0,0 Q8,0 8,13 Z" fill="#fff4dc"/></g>)}
        {rim > 0.01 && <rect x={-TILE / 2 + 2} y={-TILE / 2 + 2} width={TILE - 4} height={TILE - 4} rx={9} fill="none" stroke="#ffcf5a" strokeWidth={4} opacity={rim}/>}
      </g>
    </g>
  );
};

export const NumbersArt: React.FC<AP> = (p) => {
  const {f, dur, at} = p, nb = at("nb"), sl = at("sl"), cl = at("cl");
  const vs = fig({t: "e16_shg", state: "India", s: "savings"}).value, vc = fig({t: "e16_shg", state: "India", s: "credit"}).value;
  const ns = vs / UNIT, nc = vc / UNIT;
  const gs = ez(f, sl, 46), gc = ez(f, cl, 40);
  const BASE = 812, AX = 760, BX = 1330;
  const tower = (nTiles: number, grow: number, cx: number, tone: "teal" | "amber", rimN = 0, rimA = 0) => {
    const shown = nTiles * grow, out: React.ReactNode[] = [];
    for (let i = 0; i < Math.ceil(shown - 1e-6); i++) {
      const r = Math.floor(i / COLS), c = i % COLS, k = clamp(shown - i);
      out.push(<Tile key={i} x={cx + (c - (COLS - 1) / 2) * (TILE + 4)} y={BASE - TILE / 2 - r * (TILE + 4) - 8} k={k} tone={tone} rim={i < rimN ? rimA : 0}/>);
    }
    return out;
  };
  return (
    <g>
      <GDefs/><E1Defs/><F1Defs/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#e1-sky)"/>
      <Hills id="g1n1" base={520} amp={50} top="#b9cbdd" bottom="#d6dfe0" seed={2.1} wl={330}/>
      <Hills id="g1n2" base={610} amp={36} top="#a7c2a4" bottom="#cbd8aa" seed={4.4} wl={260}/>
      <House x={140} y={640} w={210} h={150} wall="#e8cf9f" roof="#b4562e" op={0.9}/><House x={1560} y={636} w={240} h={160} wall="#ead9b0" roof="#a64a2a" op={0.9}/>
      <Palm x={460} y={640} s={0.7} f={f} seed={2} op={0.8}/><Palm x={1500} y={640} s={0.62} f={f} seed={3} op={0.8}/>
      <rect x={-60} y={640} width={W + 120} height={H - 640 + 60} fill="url(#e1-ground)"/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#f4ead0" opacity={0.52}/>
      {/* a long plinth and faint guide lines */}
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M300,${BASE - 8 - i * (TILE + 4) * 1} H1600`} stroke="#8a7a58" strokeWidth={1.4} strokeDasharray="6 10" opacity={0.28}/>)}
      <rect x={300} y={BASE - 8} width={1300} height={26} rx={5} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2.4}/><rect x={300} y={BASE - 8} width={1300} height={5} fill="#fff" opacity={0.3}/>
      <rect x={320} y={BASE + 18} width={1260} height={60} fill="#5a3c22" opacity={0.7}/>
      {tower(ns, gs, AX, "teal", nc, ez(f, cl + 10, 20) * 0.9)}
      {tower(nc, gc, BX, "amber")}
      {/* small marks that say what each stack is (a passbook, a bank) */}
      {gs > 0.5 && <g transform={`translate(${AX} ${BASE + 48})`} opacity={clamp((gs - 0.5) * 2)}>
        <path d="M-30,-12 L-4,-8 L-4,14 L-30,10 Z M30,-12 L4,-8 L4,14 L30,10 Z" fill="#fffaf0" stroke="#b8a074" strokeWidth={1.8}/><rect x={-30} y={10} width={60} height={5} fill="#2a6fb8"/></g>}
      {gc > 0.5 && <g opacity={clamp((gc - 0.5) * 2)}><path d={`M${BX - 38},${BASE + 48} L${BX},${BASE + 28} L${BX + 38},${BASE + 48} Z`} fill="#dccfb3" stroke="#8f826a" strokeWidth={2}/>
        <rect x={BX - 34} y={BASE + 48} width={68} height={10} fill="#cfc4ac" stroke="#8f826a" strokeWidth={1.6}/>{[-22, -7, 8, 23].map((x) => <rect key={x} x={BX + x - 3} y={BASE + 30} width={6} height={17} fill="#f2ead8" stroke="#8f826a" strokeWidth={1}/>)}</g>}
    </g>
  );
};

export const NumbersLabels: React.FC<AP> = (p) => {
  const L = elabs(p), {f} = p;
  return (
    <>
      <P2Card cx={270} y={124} text={L.nb.text} f={f} at={L.nb.at} size={30} maxW={340} upper={false}/>
      <P2Card cx={800} y={124} text={L.sl.text} f={f} at={L.sl.at} size={34} maxW={580} upper={false} tone="cool"/>
      <P2Card cx={1330} y={350} text={L.cl.text} f={f} at={L.cl.at} size={34} maxW={540} upper={false}/>
    </>
  );
};

export const ShgArt: React.FC<AP> = (p) => ((p.spec as any).mode === "numbers" ? <NumbersArt {...p}/> : <GroupArt {...p}/>);
export const ShgLabels: React.FC<AP> = (p) => ((p.spec as any).mode === "numbers" ? <NumbersLabels {...p}/> : <GroupLabels {...p}/>);
