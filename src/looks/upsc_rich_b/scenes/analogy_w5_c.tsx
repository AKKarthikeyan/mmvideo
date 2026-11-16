// POL-03 Part 3, builder W5: `court-doors`, `shelf-fence`, `goal-signposts`, `property-plinth`, `nhrc-door`.
// Courts are generic classical buildings with no emblem; people at a lectern are featureless silhouettes (CONTRACT_B_POL03.md).
import React from "react";
import {Person, Cloud, type AP} from "./analogy_kit";
import {Book, Compass, Desk, Gavel, Ink, Portico, Room, Shadow, Sheet, W5Defs, clamp, eo, prog, show, slotLabels, atOr, W, H} from "./analogy_w5_kit";
import {eio} from "../kit";

const Sky: React.FC<{f: number; ground: number}> = ({f, ground}) => (
  <g>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w5-sky)"/>
    {[0, 1, 2].map((i) => <Cloud key={i} x={200 + i * 620} y={150 + (i % 2) * 60} s={0.8} f={f} speed={0.15} seed={i + 21} a={0.8}/>)}
    <rect x={-60} y={ground} width={W + 120} height={H} fill="url(#w5-ground)"/>
  </g>
);

// ---------------------------------------------------------------- court-doors
const Key: React.FC<{turn: number}> = ({turn}) => (
  <g transform={`rotate(${turn * 90})`}>
    <circle r={22} fill="none" stroke="url(#w5-brass)" strokeWidth={10}/><rect x={18} y={-5} width={60} height={10} rx={4} fill="#c99a3a"/>
    <rect x={62} y={4} width={8} height={16} fill="#c99a3a"/><rect x={48} y={4} width={8} height={12} fill="#c99a3a"/>
  </g>
);
export const CourtDoorsArt: React.FC<AP> = (p) => {
  const {f} = p, G = 790, turn = eio(prog(f, atOr(p, "a32") + 6, 24)), big = eio(prog(f, atOr(p, "wr") - 10, 34)), small = eio(prog(f, atOr(p, "a226"), 30));
  const lect = show(p, "am", 20, 10);
  return <g>
    <W5Defs/>
    <Sky f={f} ground={G}/>
    <Portico x={820} y={G - 30} w={700} h={470} cols={8} open={big} doorW={0.2}>
      <g transform={`translate(${820 + 34} ${G - 30 - 150})`} opacity={1 - big}><Key turn={turn}/></g>
      <ellipse cx={820} cy={G - 160} rx={80 * big} ry={110 * big} fill="url(#w5-glow)" opacity={big}/>
    </Portico>
    <Portico x={1530} y={G - 30} w={360} h={300} cols={4} open={small} doorW={0.3}/>
    {/* a featureless robed silhouette at a lectern, with a name plaque */}
    <g opacity={lect} transform={`translate(260 ${G - 10})`}>
      <path d="M-40,-250 Q0,-290 40,-250 L60,-120 H-60 Z" fill="#3a2a22"/><circle cx={0} cy={-280} r={30} fill="#3a2a22"/>
      <path d="M-80,0 L-60,-130 H60 L80,0 Z" fill="url(#w5-wood)" stroke="#3a1e0c" strokeWidth={3}/>
      <rect x={-56} y={-104} width={112} height={34} rx={4} fill="url(#w5-brass)"/><Ink x={0} y={-80} t="AMBEDKAR" size={18} c="#3a1e0c"/>
    </g>
  </g>;
};
export const CourtDoorsLabels = slotLabels({a32: {cx: 820, y: 84, size: 34, maxW: 860}, wr: {cx: 820, y: 846, size: 36, upper: true, tone: "green"},
  a226: {cx: 1530, y: 300, size: 28, maxW: 420}, am: {cx: 300, y: 250, size: 26, maxW: 460}});

// ---------------------------------------------------------------- shelf-fence
const Jar: React.FC<{x: number; y: number; c: string}> = ({x, y, c}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-46} y={-120} width={92} height={120} rx={12} fill="#eaf4f6" fillOpacity={0.55} stroke="#8fb4c4" strokeWidth={3}/>
    <rect x={-40} y={-80} width={80} height={74} rx={8} fill={c} opacity={0.75}/><rect x={-50} y={-132} width={100} height={16} rx={5} fill="#a88a60"/>
    <path d="M-32,-110 V-20" stroke="#fff" strokeWidth={4} opacity={0.4}/>
  </g>
);
export const ShelfArt: React.FC<AP> = (p) => {
  const {f} = p, fence = eio(prog(f, atOr(p, "af") - 6, 40)), shield = show(p, "sh", 20), box = eio(prog(f, atOr(p, "ns") - 6, 36));
  const cols = ["#c0392b", "#2f78b8", "#3f9a5a", "#d8882a", "#8a5ab8", "#2f9aa8"];
  return <g>
    <W5Defs/>
    <Room y0={720} win={[1700, 110]}/>
    <Desk y0={720}/>
    <rect x={160} y={520} width={1120} height={26} rx={6} fill="url(#w5-wood)"/><rect x={180} y={546} width={20} height={180} fill="#5e3518"/><rect x={1240} y={546} width={20} height={180} fill="#5e3518"/>
    {cols.map((c, i) => <Jar key={i} x={260 + i * 180} y={520} c={c}/>)}
    {/* a fence at the shelf's edge */}
    {Array.from({length: 5}, (_, i) => { const h = 300 * fence, x = 1310 + i * 34; return <g key={i}><rect x={x} y={548 - h} width={22} height={h} fill="#e4d3b0" stroke="#a88a60" strokeWidth={2}/><path d={`M${x},${548 - h} l11,-18 l11,18`} fill="#e4d3b0" stroke="#a88a60" strokeWidth={2} opacity={fence}/></g>; })}
    <rect x={1300} y={400} width={180} height={14} fill="#c9ad80" opacity={fence}/><rect x={1300} y={480} width={180} height={14} fill="#c9ad80" opacity={fence}/>
    {/* a shield over two jars: some laws are shielded from challenge */}
    <g opacity={shield} transform="translate(530 300)">
      <path d="M-120,-60 Q0,-110 120,-60 V10 Q100,90 0,130 Q-100,90 -120,10 Z" fill="#2f78b8" fillOpacity={0.28} stroke="#2f78b8" strokeWidth={6}/>
    </g>
    {/* a sealed box, set aside, with a tag */}
    <g transform={`translate(${1640} ${800 - (1 - box) * 40})`} opacity={box}>
      <Shadow x={0} y={92} rx={150}/>
      <rect x={-130} y={-60} width={260} height={150} rx={8} fill="url(#w5-wood)" stroke="#3a1e0c" strokeWidth={3}/><rect x={-130} y={-60} width={260} height={34} rx={8} fill="#7a4a26"/>
      <path d="M-130,-30 H130 M0,-60 V90" stroke="#c0392b" strokeWidth={8} opacity={0.85}/>
      <rect x={-22} y={-6} width={44} height={38} rx={6} fill="url(#w5-brass)"/><path d="M-12,-6 V-22 Q0,-34 12,-22 V-6" stroke="#7a5414" strokeWidth={6} fill="none"/>
    </g>
  </g>;
};
export const ShelfLabels = slotLabels({sh: {cx: 530, y: 96, size: 32, maxW: 560}, af: {cx: 1390, y: 180, size: 28, maxW: 460}, ns: {cx: 1640, y: 560, size: 30, maxW: 420, upper: true},
  bs: {cx: 820, y: 846, size: 32, tone: "green"}});

// ---------------------------------------------------------------- goal-signposts
const KEYS = ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8"];
const BOARD = KEYS.map((_, i) => ({cx: i % 2 ? 1530 : 390, y: 96 + Math.floor(i / 2) * 172}));
export const SignpostsArt: React.FC<AP> = (p) => {
  const {f} = p, G = 760;
  return <g>
    <W5Defs/>
    <Sky f={f} ground={G}/>
    <path d={`M900,${G} L1020,${G} L1500,${H + 40} L420,${H + 40} Z`} fill="#c9ad80"/>
    <path d={`M960,${G + 10} V${H + 40}`} stroke="#fff6d8" strokeWidth={8} strokeDasharray="40 36" opacity={0.7}/>
    <circle cx={960} cy={G - 20} r={40} fill="#fff1b0" opacity={0.8}/><circle cx={960} cy={G - 20} r={140} fill="url(#w5-glow)" opacity={0.5}/>
    {KEYS.map((k, i) => {
      const b = BOARD[i], a = show(p, k, 16, 8), px = b.cx + (i % 2 ? -150 : 150);
      return <g key={k} opacity={0.25 + 0.75 * a}>
        <rect x={px - 7} y={b.y + 60} width={14} height={G + 20 - b.y - 60 + (Math.floor(i / 2) * 30)} fill="url(#w5-wood)"/>
        <Shadow x={px} y={G + 22 + Math.floor(i / 2) * 30} rx={30} a={0.2}/>
      </g>;
    })}
  </g>;
};
export const SignpostsLabels = slotLabels(Object.fromEntries(KEYS.map((k, i) => [k, {cx: BOARD[i].cx, y: BOARD[i].y, size: 27, maxW: 560}])));

// ---------------------------------------------------------------- property-plinth
export const PropertyArt: React.FC<AP> = (p) => {
  const {f} = p, push = eio(prog(f, atOr(p, "zm") - 10, 50)), tear = eio(prog(f, atOr(p, "zm") + 40, 40));
  const move = eio(prog(f, atOr(p, "p3") + 20, 70)), plinth = show(p, "a300", 20, 30);
  const cx = 480 + (1720 - 480) * move, cy = 520 - Math.sin(move * Math.PI) * 180 + move * 40;
  return <g>
    <W5Defs/>
    <Room y0={560} win={[1700, 100]}/>
    <Desk y0={560}/>
    <Book x={300 + 120 * push} y={740} w={360} h={240} cover="url(#w5-red)" title="PART III" icon={<Gavel s={0.55}/>} rot={-3}/>
    <Book x={1500 - 120 * push} y={740} w={360} h={240} cover="url(#w5-blue)" title="PART IV" icon={<Compass s={0.55}/>} rot={3}/>
    {/* a land map between them, tearing */}
    {[-1, 1].map((s) => (
      <g key={s} transform={`translate(${960 + s * 70 * tear} ${740 + s * 6 * tear}) rotate(${s * 4 * tear})`}>
        <path d={s < 0 ? "M-220,-120 H6 L-14,-60 L10,0 L-12,60 L4,120 H-220 Z" : "M220,-120 H6 L-14,-60 L10,0 L-12,60 L4,120 H220 Z"} fill="#e6d8a8" stroke="#a88a60" strokeWidth={3}/>
        {[-80, -20, 40, 90].map((y) => <path key={y} d={`M${s * 200},${y} H${s * 30}`} stroke="#9ab070" strokeWidth={14} opacity={0.6}/>)}
      </g>
    ))}
    {/* the plinth of Art. 300A */}
    <g opacity={plinth} transform="translate(1720 650)">
      <rect x={-130} y={-60} width={260} height={120} rx={6} fill="url(#w5-stone)" stroke="#a88a60" strokeWidth={3}/><rect x={-150} y={60} width={300} height={24} rx={4} fill="#d6c3a0"/>
      <Ink x={0} y={14} t="ART. 300A" size={34} c="#5e2a0e"/>
    </g>
    {/* the PROPERTY card moves off the Part III shelf to the plinth */}
    <Sheet x={cx} y={cy} w={220} h={100} rot={-4 + 8 * move}>
      <Ink x={0} y={12} t="PROPERTY" size={30} c="#5e2a0e"/>
    </Sheet>
  </g>;
};
export const PropertyLabels = slotLabels({zm: {cx: 960, y: 84, size: 32, maxW: 1100}, p3: {cx: 420, y: 846, size: 30, maxW: 600}, a300: {cx: 1560, y: 846, size: 32, tone: "green"}});

// ---------------------------------------------------------------- nhrc-door
export const NhrcArt: React.FC<AP> = (p) => {
  const {f} = p, open = eio(prog(f, atOr(p, "nh") - 6, 30)), letter = eio(prog(f, atOr(p, "ir"), 50)), no = show(p, "cp", 16);
  const lx = 960 + 560 * letter, ly = 520 - Math.sin(letter * Math.PI) * 160;
  return <g>
    <W5Defs/>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w5-room)"/>
    <rect x={-60} y={760} width={W + 120} height={400} fill="#b89a70"/><path d="M-60,760 H1980" stroke="#8a6a44" strokeWidth={6}/>
    <rect x={760} y={260} width={400} height={500} rx={6} fill="#3a2412"/>
    <rect x={780} y={280} width={360} height={480} fill="#fff1c4" opacity={0.25 + 0.6 * open}/>
    <path d={`M780,280 L${780 + 360 * (1 - 0.75 * open)},${280 + 30 * open} V${760 - 30 * open} L780,760 Z`} fill="url(#w5-wood)" stroke="#3a1e0c" strokeWidth={3}/>
    <rect x={800} y={200} width={320} height={50} rx={6} fill="url(#w5-brass)"/><Ink x={960} y={234} t="HUMAN RIGHTS COMMISSION" size={20} c="#3a1e0c"/>
    {/* the recommendation goes out */}
    <g transform={`translate(${lx} ${ly}) rotate(${-6 + 12 * letter})`} opacity={letter > 0.01 ? 1 : 0}>
      <rect x={-70} y={-46} width={140} height={92} rx={6} fill="#fffaf0" stroke="#7a4a26" strokeWidth={3}/><path d="M-70,-46 L0,8 L70,-46" stroke="#7a4a26" strokeWidth={3} fill="none"/>
      <Ink x={0} y={34} t="RECOMMEND" size={14} c="#7a4a26"/>
    </g>
    {/* no gavel on this side: an empty outline */}
    <g transform="translate(400 600)" opacity={0.3 + 0.7 * no}>
      <g opacity={0.35}><Gavel s={1.2}/></g>
      <circle r={110} fill="none" stroke="#c0392b" strokeWidth={10} opacity={no}/><path d="M-78,78 L78,-78" stroke="#c0392b" strokeWidth={10} opacity={no}/>
    </g>
  </g>;
};
export const NhrcLabels = slotLabels({nh: {cx: 960, y: 84, size: 36, maxW: 1100}, pa: {cx: 960, y: 846, size: 30}, ir: {cx: 1500, y: 260, size: 34, upper: true, tone: "green"},
  cp: {cx: 400, y: 380, size: 32}});
