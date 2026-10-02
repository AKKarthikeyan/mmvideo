// The Moat Files: code-drawn scene types for the case engine (no AI images, no stock).
// Each scene is designed on a 1920x1080 canvas; in 9:16 Shorts it is scaled to the frame width.
// Timings come from phrases in the narration via T(). Real people are never drawn as likenesses:
// anonymous silhouettes only, and illustrated scenes carry an "illustration" tag.
import React from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig, staticFile, Easing} from "remotion";
import {C, COND, TYPE, Drift, HalftoneCutout, Pin, RedString, Stage, Stamp, Strip, Tape, TornCard, TypeLabel, VoxDefs} from "../../voxkit";

type P = {s: any; n: number; T: (x: any, o?: number) => number; b: any; D: any};
const WATER = "#7F9AA8";

const Wrap: React.FC<{n: number; illus?: boolean; children: React.ReactNode}> = ({n, illus, children}) => {
  const {width: W, height: H} = useVideoConfig(); const land = W > H;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute"}}>
      <VoxDefs/><Stage w={W} h={H}/>
      <Drift frames={n} cx={W / 2} cy={H / 2}>{land ? children : <g transform="translate(0 560) scale(0.5625)">{children}</g>}</Drift>
      {illus && <text x={40} y={land ? 115 : 300} fontFamily={TYPE} fontSize={22} fill={C.ink} opacity={0.55}>illustration</text>}
    </svg>
  );
};

const Pop: React.FC<{at: number; x: number; y: number; children: React.ReactNode}> = ({at, x, y, children}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  if (f < at) return null;
  const s = spring({frame: f - at, fps, config: {damping: 12, stiffness: 170}});
  return <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * s}) translate(${-x} ${-y})`} opacity={Math.min(1, s * 1.6)}>{children}</g>;
};
const Line: React.FC<{at: number; x1: number; y1: number; x2: number; y2: number; color?: string; w?: number; dur?: number}> = ({at, x1, y1, x2, y2, color = C.red, w = 10, dur = 10}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  if (p <= 0) return null;
  return <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={color} strokeWidth={w} strokeLinecap="round"/>;
};
const T0 = (T: P["T"], x: any) => (x === undefined || x === null ? 1e9 : T(x));

// an anonymous figure: fedora, head, coat; arm raised when knocking
const person = (x: number, y: number, s: number, knock = false) =>
  `M${x - 34 * s} ${y - 250 * s} h${68 * s} l${10 * s} ${22 * s} h${-88 * s} z ` +
  `M${x - 26 * s} ${y - 284 * s} q${26 * s} ${-14 * s} ${52 * s} 0 v${36 * s} h${-52 * s} z ` +
  `M${x} ${y - 226 * s} a${34 * s} ${40 * s} 0 1 0 0.1 0 z ` +
  `M${x - 70 * s} ${y} C${x - 80 * s} ${y - 120 * s} ${x - 60 * s} ${y - 150 * s} ${x} ${y - 150 * s} C${x + 60 * s} ${y - 150 * s} ${x + 80 * s} ${y - 120 * s} ${x + 70 * s} ${y} z ` +
  (knock ? `M${x + 40 * s} ${y - 140 * s} L${x + 150 * s} ${y - 230 * s} L${x + 172 * s} ${y - 210 * s} L${x + 62 * s} ${y - 110 * s} z M${x + 176 * s} ${y - 222 * s} a${22 * s} ${22 * s} 0 1 0 0.1 0 z` : "");

const box = (x: number, y: number, label: string, dark = false, w = 300, fs = 50) => (
  <g><rect x={x - w / 2} y={y - 70} width={w} height={140} rx={6} fill={dark ? C.ink : C.white} stroke={C.ink} strokeWidth={4} style={{filter: "url(#vshadow)"}}/>
    <text x={x} y={y + fs * 0.36} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={fs} fill={dark ? C.white : C.ink}>{label}</text></g>);
const arrow = (x1: number, x2: number, y: number) => <g><line x1={x1} y1={y} x2={x2 - 26} y2={y} stroke={C.ink} strokeWidth={8}/><path d={`M${x2} ${y} l-34 -22 v44 z`} fill={C.ink}/></g>;
const coin = (x: number, y: number, t = "$") => <g><circle cx={x} cy={y} r={30} fill={C.mustard} stroke={C.ink} strokeWidth={3}/><text x={x} y={y + 12} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={34} fill={C.ink}>{t}</text></g>;

// ---------- x-door: the locked door (knocks on phrases) ----------
const XDoor: React.FC<P> = ({s, n, T}) => {
  const fx = 520, fw = 1000, fy = 120, fh = 860, dx = 870, dw = 300, dy = 520, dh = 460;
  const flakes = Array.from({length: 70}, (_, i) => [((i * 197) % 1880) + 20, ((i * 331) % 1000) + 20, 3 + (i % 3) * 2]);
  const k: string[] = s.knocks;
  return (
    <Wrap n={n} illus>
      <rect x={fx} y={fy} width={fw} height={fh} fill={C.paper} stroke={C.ink} strokeWidth={4}/>
      {Array.from({length: 11}, (_, i) => <line key={i} x1={fx} y1={fy + 80 + i * 75} x2={fx + fw} y2={fy + 80 + i * 75} stroke={C.ink} strokeWidth={1.5} opacity={0.35}/>)}
      <path d={`M${fx - 30} ${fy} L${fx + fw / 2} ${fy - 90} L${fx + fw + 30} ${fy} Z`} fill={C.white} stroke={C.ink} strokeWidth={4}/>
      <rect x={fx + 140} y={fy + 40} width={fw - 280} height={70} fill={C.ink}/>
      <text x={fx + fw / 2} y={fy + 86} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={30} letterSpacing={2} fill={C.white}>GOVERNMENT EMPLOYEES INSURANCE CO.</text>
      {[fx + 90, fx + 300, fx + fw - 390, fx + fw - 180].map((wx) => <g key={wx}><rect x={wx} y={fy + 170} width={100} height={150} fill={C.gray} opacity={0.5} stroke={C.ink} strokeWidth={3}/><line x1={wx + 50} y1={fy + 170} x2={wx + 50} y2={fy + 320} stroke={C.ink} strokeWidth={3}/></g>)}
      <rect x={dx} y={dy} width={dw} height={dh} fill={C.ink}/>
      <rect x={dx + 20} y={dy + 20} width={dw / 2 - 30} height={dh - 40} fill="#2b2b2b" stroke={C.gray} strokeWidth={2}/>
      <rect x={dx + dw / 2 + 10} y={dy + 20} width={dw / 2 - 30} height={dh - 40} fill="#2b2b2b" stroke={C.gray} strokeWidth={2}/>
      <circle cx={dx + dw / 2 - 18} cy={dy + 250} r={9} fill={C.mustard}/><circle cx={dx + dw / 2 + 18} cy={dy + 250} r={9} fill={C.mustard}/>
      <g transform={`rotate(-4 ${dx + dw / 2} ${dy + 100})`}><rect x={dx + 60} y={dy + 60} width={180} height={70} fill={C.white} stroke={C.ink} strokeWidth={3}/>
        <text x={dx + dw / 2} y={dy + 108} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={42} fill={C.red}>CLOSED</text></g>
      <rect x={dx - 60} y={dy + dh} width={dw + 120} height={24} fill={C.gray}/><rect x={dx - 110} y={dy + dh + 24} width={dw + 220} height={24} fill={C.gray} opacity={0.8}/>
      <HalftoneCutout d={person(680, 1028, 1.25, true)} start={T(s.walk_at ?? 0)}/>
      {k[0] && <Strip x={330} y={560} start={T(k[0])} text="KNOCK!" size={84} fill={C.white} rot={-8}/>}
      {k[1] && <Strip x={300} y={700} start={T(k[1])} text="KNOCK!" size={70} fill={C.white} rot={6}/>}
      {k[2] && <Strip x={345} y={820} start={T(k[2])} text="KNOCK!" size={58} fill={C.red} color={C.white} rot={-4}/>}
      {flakes.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={C.white} opacity={0.7}/>)}
      <Stamp x={1680} y={940} start={T(s.stamp_at ?? 0)} text="SATURDAY · JAN 1951" size={40} rot={-6}/>
    </Wrap>
  );
};

// ---------- x-case: the case file folder with its questions ----------
const XCase: React.FC<P> = ({s, n, T, D}) => (
  <Wrap n={n}>
    <Pop at={T(s.at ?? 0)} x={620} y={560}>
      <g transform="rotate(-3 620 560)">
        <path d="M200 260 h260 l40 -50 h260 v40 h-560 z" fill="#C79A52" stroke={C.ink} strokeWidth={4}/>
        <rect x={200} y={250} width={840} height={600} fill="#D8AE67" stroke={C.ink} strokeWidth={4} style={{filter: "url(#vshadow)"}}/>
        <text x={520} y={243} textAnchor="middle" fontFamily={TYPE} fontSize={30} fill={C.ink}>CASE FILE {(String(D.id).match(/^mf(\d+)/) || [])[1] ?? "001"}</text>
        <rect x={260} y={320} width={720} height={2} fill={C.ink} opacity={0.4}/>
        <text x={620} y={520} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={200} fill={C.ink}>{s.name}</text>
        <text x={620} y={620} textAnchor="middle" fontFamily={TYPE} fontSize={40} fill={C.ink}>{s.sub}</text>
        <text x={620} y={760} textAnchor="middle" fontFamily={TYPE} fontSize={30} fill={C.ink} opacity={0.7}>THE MOAT FILES · MOAT &amp; MARGIN</text>
      </g>
    </Pop>
    {(s.lines || []).map((l: any, i: number) => <Strip key={i} x={1480} y={330 + i * 190} start={T(l.at)} text={l.t} size={50} fill={i === s.lines.length - 1 ? C.red : C.white} color={i === s.lines.length - 1 ? C.white : C.ink} rot={[-2, 1.5, -1][i % 3]}/>)}
  </Wrap>
);

// ---------- x-act: an act card ----------
const XAct: React.FC<P> = ({s, n}) => (
  <Wrap n={n}>
    <rect x={0} y={0} width={1920} height={1080} fill={C.ink} opacity={0.9}/>
    <Strip x={960} y={420} start={0} text={s.act} size={64} fill={C.mustard} color={C.ink} rot={-2}/>
    <Strip x={960} y={600} start={4} text={s.title} size={130} fill={C.white} rot={1}/>
    <Pin x={960} y={330} start={2}/>
  </Wrap>
);

// ---------- x-founder: 1936, $200,000 ----------
const XFounder: React.FC<P> = ({s, n, T}) => {
  const bills = Array.from({length: 7}, (_, i) => i);
  return (
    <Wrap n={n} illus>
      <TornCard x={130} y={150} w={520} h={230} start={0} fill={C.white} rot={-2}>
        <text x={260} y={120} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={120} fill={C.ink}>1936</text>
        <text x={260} y={185} textAnchor="middle" fontFamily={TYPE} fontSize={28} fill={C.ink}>LEO GOODWIN STARTS GEICO</text>
      </TornCard>
      <HalftoneCutout d={person(520, 1060, 1.9)} start={2}/>
      <Pop at={T(s.cash_at)} x={1320} y={640}>
        {bills.map((i) => <g key={i} transform={`translate(${1060 + (i % 2) * 14} ${760 - i * 36}) rotate(${(i % 3) - 1})`}>
          <rect width={520} height={70} rx={6} fill="#9DB08A" stroke={C.ink} strokeWidth={3}/><circle cx={260} cy={35} r={22} fill="none" stroke={C.ink} strokeWidth={2}/>
          <text x={260} y={46} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={30} fill={C.ink}>$</text></g>)}
        <Strip x={1330} y={400} start={T(s.cash_at)} text="$200,000" size={96} fill={C.white}/>
      </Pop>
      {s.stamp_at && <Stamp x={1400} y={900} start={T(s.stamp_at)} text="“SKIMPY” · BUFFETT" size={56} rot={-7}/>}
    </Wrap>
  );
};

// ---------- x-middleman: agent chain vs direct ----------
const XMiddleman: React.FC<P> = ({s, n, T}) => {
  const y1 = 330, y2 = 790, oldA = T0(T, s.old_at), newA = T0(T, s.new_at);
  return (
    <Wrap n={n}>
      <Strip x={960} y={110} start={0} text={s.heading || "HOW CAR INSURANCE WAS SOLD"} size={66}/>
      <Pop at={oldA} x={960} y={y1}>
        <TypeLabel x={120} y={215} start={oldA} text="THE OLD WAY · THROUGH AGENTS" size={32} cps={99}/>
        {box(300, y1, "CUSTOMER")}{arrow(460, 800, y1)}{box(960, y1, "AGENT")}{arrow(1120, 1460, y1)}{box(1620, y1, "INSURER")}
      </Pop>
      <Pop at={T0(T, s.coins_at ?? s.old_at)} x={660} y={y1 + 130}>
        {coin(630, y1 + 110)}{coin(690, y1 + 150)}{coin(1290, y1 + 110)}
        <TypeLabel x={520} y={y1 + 228} start={T0(T, s.coins_at ?? s.old_at)} text="a cut on every policy" size={30} cps={99}/>
      </Pop>
      {s.new_at !== undefined && <>
        <line x1={120} y1={565} x2={1800} y2={565} stroke={C.ink} strokeWidth={3} strokeDasharray="18 14" opacity={0.5}/>
        <Pop at={newA} x={960} y={y2}>
          <TypeLabel x={120} y={675} start={newA} text="GEICO · SELL DIRECT" size={32} cps={99}/>
          {box(300, y2, "CUSTOMER")}{arrow(460, 1460, y2)}{box(1620, y2, "GEICO", true)}
        </Pop>
        <Strip x={960} y={y2 - 70} start={newA + 8} text="NO MIDDLEMAN" size={54} fill={C.red} color={C.white} rot={-2}/>
      </>}
      {s.revolt_at && <Stamp x={1480} y={630} start={T(s.revolt_at)} text="AGENTS WOULD REVOLT" size={50} rot={-6}/>}
    </Wrap>
  );
};

// ---------- x-mango: farm direct vs three middlemen ----------
const mango = (x: number, y: number, r = 1) => <g transform={`translate(${x} ${y}) scale(${r})`}><ellipse cx={0} cy={0} rx={46} ry={36} transform="rotate(-25)" fill={C.mustard} stroke={C.ink} strokeWidth={3}/><path d="M18 -34 q30 -22 52 -6 q-26 12 -52 6z" fill="#7C9A5B" stroke={C.ink} strokeWidth={2}/></g>;
const XMango: React.FC<P> = ({s, n, T}) => {
  const a = T(s.farm_at), b = T(s.chain_at), y1 = 300, y2 = 700;
  return (
    <Wrap n={n} illus>
      <Pop at={a} x={960} y={y1}>
        <TypeLabel x={120} y={180} start={a} text="STRAIGHT FROM THE FARMER" size={32} cps={99}/>
        {box(300, y1, "FARMER")}{arrow(460, 1460, y1)}{mango(960, y1 - 10, 1.2)}{box(1620, y1, "YOU")}
        {coin(960, y1 + 90, "₹")}
      </Pop>
      <Pop at={b} x={960} y={y2}>
        <TypeLabel x={120} y={580} start={b} text="THROUGH THREE MIDDLEMEN" size={32} cps={99}/>
        {box(210, y2, "FARMER", false, 250, 44)}{arrow(340, 510, y2)}{box(640, y2, "TRADER", false, 250, 44)}{arrow(770, 940, y2)}
        {box(1070, y2, "WHOLESALER", false, 250, 40)}{arrow(1200, 1370, y2)}{box(1500, y2, "SHOP", false, 250, 44)}{arrow(1630, 1720, y2)}
        {mango(1790, y2, 1)}
        {coin(425, y2 + 90, "₹")}{coin(855, y2 + 90, "₹")}{coin(1285, y2 + 90, "₹")}
      </Pop>
      {s.same_at && <Strip x={960} y={905} start={T(s.same_at)} text="SAME MANGO. VERY DIFFERENT PRICE." size={62} fill={C.red} color={C.white} rot={-1}/>}
    </Wrap>
  );
};

// ---------- x-crime: the crime board ----------
const XCrime: React.FC<P> = ({s, n, T}) => {
  const cx = 960, cy = 560;
  const pos: [number, number, number][] = [[360, 250, -2], [1560, 250, 2], [360, 860, 1.5], [1560, 860, -1.5]];
  return (
    <Wrap n={n}>
      <rect x={60} y={40} width={1800} height={970} fill="#B8A57F" stroke={C.ink} strokeWidth={6}/>
      <TornCard x={cx - 240} y={cy - 170} w={480} h={340} start={0} fill={C.paper} rot={-1.5}>
        <text x={240} y={48} textAnchor="middle" fontFamily={TYPE} fontSize={26} fill={C.gray}>THE VICTIM</text>
        <text x={240} y={158} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={92} fill={C.ink}>{s.victim.big}</text>
        <text x={240} y={245} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={80} fill={C.red}>{s.victim.red}</text>
        <text x={240} y={305} textAnchor="middle" fontFamily={TYPE} fontSize={28} fill={C.ink}>{s.victim.sub}</text>
      </TornCard>
      <Pin x={cx} y={cy - 164} start={2}/>
      {s.suspects.map((q: any, i: number) => {
        const [x, y, rot] = pos[i]; const at = T(q.at);
        return <g key={i}>
          <RedString pts={[[cx, cy], [x, y - 84]]} start={at}/>
          <TornCard x={x - 180} y={y - 90} w={360} h={180} start={at} fill={C.white} rot={rot}>
            <text x={180} y={52} textAnchor="middle" fontFamily={TYPE} fontSize={22} fill={C.gray}>SUSPECT</text>
            <text x={180} y={128} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={46} fill={C.ink}>{q.t}</text>
          </TornCard>
          <Pin x={x} y={y - 84} start={at + 2}/>
          {q.cross && <Line at={T(q.cross)} x1={x - 140} y1={y - 70} x2={x + 140} y2={y + 70}/>}
        </g>;
      })}
      {s.stamp && <Stamp x={1560} y={900} start={T(s.stamp.at)} text={s.stamp.text} size={64} rot={-12}/>}
    </Wrap>
  );
};

// ---------- x-biryani: the costing mistake ----------
const XBiryani: React.FC<P> = ({s, n, T}) => {
  const rice = Array.from({length: 60}, (_, i) => [520 + Math.cos(i * 2.4) * (i * 3.6), 560 + Math.sin(i * 2.4) * (i * 2.4)]);
  const tag = (y: number, at: number, top: string, big: string, red: boolean, rot: number) => (
    <TornCard x={1060} y={y} w={700} h={170} start={at} fill={red ? C.red : C.white} rot={rot}>
      <text x={40} y={60} fontFamily={TYPE} fontSize={30} fill={red ? C.white : C.ink}>{top}</text>
      <text x={660} y={135} textAnchor="end" fontFamily={COND} fontWeight={700} fontSize={100} fill={red ? C.white : C.ink}>{big}</text>
    </TornCard>);
  return (
    <Wrap n={n} illus>
      <ellipse cx={520} cy={600} rx={380} ry={250} fill={C.white} stroke={C.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
      <ellipse cx={520} cy={590} rx={300} ry={185} fill={C.paper} stroke={C.gray} strokeWidth={2}/>
      <ellipse cx={520} cy={570} rx={250} ry={140} fill={C.mustard} opacity={0.85}/>
      {rice.map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={9} ry={4} transform={`rotate(${i * 37} ${x} ${y})`} fill={i % 4 ? C.white : "#C0762E"}/>)}
      <path d="M560 470 q60 -60 120 -20 q-60 30 -120 20z" fill="#7C9A5B" stroke={C.ink} strokeWidth={2}/>
      <Strip x={520} y={250} start={0} text="ONE PLATE OF BIRYANI" size={56} fill={C.white}/>
      {tag(170, T(s.thinks_at), "WHAT HE THINKS IT COSTS", "₹60", false, -2)}
      {tag(400, T(s.real_at), "WHAT IT REALLY COSTS", "₹90", true, 1.5)}
      {tag(630, T(s.price_at), "HIS PRICE", "₹80", false, -1)}
      {s.broke_at && <Stamp x={1420} y={930} start={T(s.broke_at)} text="LOSES ₹10 ON EVERY PLATE" size={50} rot={-5}/>}
    </Wrap>
  );
};

// ---------- x-ekg: the patient and the heart ----------
const XEkg: React.FC<P> = ({s, n, T}) => {
  const f = useCurrentFrame();
  let d = "M140 520"; for (let i = 0; i < 12; i++) { const x = 140 + i * 130; d += ` L${x + 60} 520 L${x + 75} 440 L${x + 90} 620 L${x + 105} 380 L${x + 118} 520 L${x + 130} 520`; }
  const p = interpolate(f, [0, n], [0, 1], {extrapolateRight: "clamp"});
  return (
    <Wrap n={n}>
      <rect x={100} y={180} width={1720} height={560} rx={24} fill="#162018" stroke={C.ink} strokeWidth={8}/>
      {Array.from({length: 13}, (_, i) => <line key={i} x1={100 + i * 143} y1={180} x2={100 + i * 143} y2={740} stroke="#2E4A33" strokeWidth={2}/>)}
      <path d={d} fill="none" stroke="#7CE08A" strokeWidth={7} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p}/>
      <text x={150} y={240} fontFamily={TYPE} fontSize={34} fill="#7CE08A">{s.patient}</text>
      {(s.cards || []).map((c: any, i: number) => <Strip key={i} x={[420, 960, 1500][i]} y={880} start={T(c.at)} text={c.t} size={38} fill={i === s.cards.length - 1 ? C.red : C.white} color={i === s.cards.length - 1 ? C.white : C.ink} rot={[-2, 1, -1][i]}/>)}
    </Wrap>
  );
};

// ---------- x-line: a line chart whose points arrive on phrases ----------
const XLine: React.FC<P> = ({s, n, T}) => {
  const f = useCurrentFrame();
  const [x0, x1] = s.domain as [number, number], ymax = s.ymax as number;
  const X = (v: number) => 220 + (v - x0) / (x1 - x0) * 1500, Y = (v: number) => 900 - v / ymax * 600;
  const pts = (s.points as any[]).map((p) => ({...p, t: T(p.at)}));
  const vis = pts.filter((p) => f >= p.t);
  const ticks = Array.from({length: Math.floor(ymax / 2) + 1}, (_, i) => i * 2);
  return (
    <Wrap n={n}>
      <Strip x={960} y={120} start={0} text={s.heading} size={58}/>
      {ticks.map((t) => <g key={t}><line x1={220} y1={Y(t)} x2={1720} y2={Y(t)} stroke={C.ink} strokeWidth={1.5} opacity={0.25}/>
        <text x={200} y={Y(t) + 12} textAnchor="end" fontFamily={TYPE} fontSize={30} fill={C.ink}>{t}%</text></g>)}
      <line x1={220} y1={900} x2={1720} y2={900} stroke={C.ink} strokeWidth={4}/>
      {vis.length > 1 && <polyline points={vis.map((p) => `${X(p.x)},${Y(p.y)}`).join(" ")} fill="none" stroke={C.red} strokeWidth={9} strokeLinejoin="round"/>}
      {vis.map((p, i) => <Pop key={i} at={p.t} x={X(p.x)} y={Y(p.y)}>
        <circle cx={X(p.x)} cy={Y(p.y)} r={16} fill={C.red} stroke={C.ink} strokeWidth={4}/>
        {p.label && <text x={X(p.x) + (p.dx ?? 0)} y={Y(p.y) - 34} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={56} fill={C.ink}>{p.label}</text>}
        {!p.noYear && <text x={X(p.x)} y={950} textAnchor="middle" fontFamily={TYPE} fontSize={30} fill={C.ink}>{p.x}</text>}
      </Pop>)}
      {s.stamp && <Stamp x={s.stamp.x ?? 1400} y={s.stamp.y ?? 330} start={T(s.stamp.at)} text={s.stamp.text} size={52} rot={-6}/>}
    </Wrap>
  );
};

// ---------- x-verdict: the court card ----------
const XVerdict: React.FC<P> = ({s, n, T}) => (
  <Wrap n={n}>
    <TornCard x={260} y={120} w={1400} h={840} start={0} fill={C.white} rot={-0.6}>
      <text x={700} y={130} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={110} fill={C.ink}>VERDICT</text>
      <text x={700} y={185} textAnchor="middle" fontFamily={TYPE} fontSize={30} fill={C.gray}>{s.caseName}</text>
      <line x1={80} y1={225} x2={1320} y2={225} stroke={C.ink} strokeWidth={3}/>
    </TornCard>
    {s.rows.map((r: any, i: number) => <Pop key={i} at={T(r.at)} x={960} y={420 + i * 190}>
      <text x={360} y={430 + i * 190} fontFamily={TYPE} fontSize={34} fill={C.gray}>{r.k}</text>
      <text x={360} y={500 + i * 190} fontFamily={COND} fontWeight={700} fontSize={70} fill={i === 1 ? C.red : C.ink}>{r.v}</text>
    </Pop>)}
  </Wrap>
);

// ---------- x-castle: the Chai Test ----------
const XCastle: React.FC<P> = ({s, n, T}) => {
  const f = useCurrentFrame(); const fire = T(s.fire_at);
  const flick = (i: number) => 1 + 0.12 * Math.sin((f + i * 7) / 3);
  const crenel = (x: number, y: number, w: number) => Array.from({length: Math.floor(w / 60)}, (_, i) => <rect key={i} x={x + i * 60} y={y - 40} width={36} height={40} fill={C.paper} stroke={C.ink} strokeWidth={4}/>);
  return (
    <Wrap n={n} illus>
      <TypeLabel x={120} y={140} start={0} text="THE CHAI TEST" size={40} cps={99}/>
      <path d="M0 860 Q480 820 960 860 T1920 860 V1080 H0 Z" fill={WATER} opacity={0.9}/>
      <rect x={560} y={440} width={800} height={420} fill={C.paper} stroke={C.ink} strokeWidth={5}/>{crenel(560, 440, 800)}
      <rect x={480} y={330} width={200} height={530} fill={C.paper} stroke={C.ink} strokeWidth={5}/>{crenel(480, 330, 200)}
      <rect x={1240} y={330} width={200} height={530} fill={C.paper} stroke={C.ink} strokeWidth={5}/>{crenel(1240, 330, 200)}
      <path d="M880 860 V720 a80 80 0 0 1 160 0 V860 Z" fill={C.ink}/>
      {f >= fire && [640, 780, 920, 1060, 1200, 1300].map((x, i) => <g key={x} transform={`translate(${x} 450) scale(${flick(i)}) translate(${-x} -450)`}>
        <circle cx={x + 20} cy={180 - (f - fire) % 40} r={46} fill={C.gray} opacity={0.35}/>
        <path d={`M${x - 70} 450 C${x - 90} 360 ${x - 20} 330 ${x - 10} 230 C${x + 30} 300 ${x + 90} 340 ${x + 70} 450 Z`} fill={C.red} stroke={C.ink} strokeWidth={3}/>
        <path d={`M${x - 35} 450 C${x - 45} 400 ${x - 5} 380 ${x} 320 C${x + 20} 370 ${x + 50} 400 ${x + 35} 450 Z`} fill={C.mustard}/></g>)}
      <HalftoneCutout d={person(150, 900, 0.9)} start={T(s.rivals_at)}/>
      <HalftoneCutout d={person(290, 900, 0.9)} start={T(s.rivals_at, 4)}/>
      <Strip x={300} y={560} start={T(s.rivals_at)} text="RIVALS: KEPT OUT" size={50} fill={C.white} rot={-3}/>
      <Strip x={1480} y={200} start={fire} text="OWNERS: SET IT ON FIRE" size={54} fill={C.red} color={C.white} rot={2}/>
    </Wrap>
  );
};


// ---------- x-photo: an illustration plate with a slow camera move, particles and timed overlays ----------
// s.img (plate name in public/vx/<id>/img), s.move in|out|left|right|up, s.fx/fy focus 0-1, s.fx_particles snow|dust|embers,
// s.shade 0-0.6, s.over = [{kind: strip|stamp|label|card, text, at, x, y, size, red, rot}]
const Particles: React.FC<{kind: string; W: number; H: number}> = ({kind, W, H}) => {
  const f = useCurrentFrame();
  const N = kind === "snow" ? 90 : kind === "embers" ? 60 : 45;
  return <g>{Array.from({length: N}, (_, i) => {
    const sx = (i * 197) % W, sp = kind === "snow" ? 1.6 + (i % 5) * 0.5 : kind === "embers" ? -(1.2 + (i % 4) * 0.6) : 0.25 + (i % 3) * 0.15;
    const y = ((((i * 331) % H) + f * sp * 2) % (H + 40) + H + 40) % (H + 40) - 20;
    const x = sx + Math.sin((f + i * 13) / 22) * (kind === "dust" ? 30 : 14);
    const r = kind === "snow" ? 2 + (i % 3) * 1.5 : kind === "embers" ? 2 + (i % 3) : 1.5 + (i % 2);
    const col = kind === "embers" ? (i % 2 ? "#FFB347" : C.red) : "#FFFFFF";
    return <circle key={i} cx={x} cy={y} r={r} fill={col} opacity={kind === "dust" ? 0.35 : 0.8}/>;
  })}</g>;
};
const XPhoto: React.FC<P> = ({s, n, T, D}) => {
  const f = useCurrentFrame(); const {width: W, height: H} = useVideoConfig(); const land = W > H;
  const p = interpolate(f, [0, n], [0, 1], {extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad)});
  const m = s.move || "in"; const z = m === "out" ? 1.16 - 0.12 * p : 1.04 + 0.12 * p;
  const fx = s.fx ?? 0.5, fy = s.fy ?? 0.5;
  const dx = m === "left" ? 60 - 120 * p : m === "right" ? -60 + 120 * p : 0, dy = m === "up" ? 40 - 80 * p : 0;
  const settle = spring({frame: f, fps: 30, config: {damping: 20, stiffness: 80}});
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute"}}>
      <VoxDefs/>
      <defs><radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset="0.55" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity="0.55"/></radialGradient></defs>
      <g transform={`translate(${W * fx + dx} ${H * fy + dy}) scale(${z * (1.04 - 0.04 * settle)}) translate(${-W * fx} ${-H * fy})`}>
        <image href={staticFile(`vx/${D.id}/img/${s.img}.jpeg`)} x={0} y={0} width={W} height={H} preserveAspectRatio={`x${fx < 0.34 ? "Min" : fx > 0.66 ? "Max" : "Mid"}Y${fy < 0.34 ? "Min" : fy > 0.66 ? "Max" : "Mid"} slice`}/>
      </g>
      {s.shade ? <rect width={W} height={H} fill="#000" opacity={s.shade}/> : null}
      <rect width={W} height={H} fill="url(#vig)"/>
      {s.fx_particles && <Particles kind={s.fx_particles} W={W} H={H}/>}
      <g transform={land ? "" : "translate(0 560) scale(0.5625)"}>
        {(s.over || []).map((o: any, i: number) => {
          const at = T(o.at ?? 0);
          if (o.kind === "stamp") return <Stamp key={i} x={o.x} y={o.y} start={at} text={o.text} size={o.size ?? 56} rot={o.rot ?? -6}/>;
          if (o.kind === "label") return <TypeLabel key={i} x={o.x} y={o.y} start={at} text={o.text} size={o.size ?? 34} cps={99}/>;
          if (o.kind === "card") return <TornCard key={i} x={o.x} y={o.y} w={o.w ?? 520} h={o.h ?? 200} start={at} fill={C.white} rot={o.rot ?? -2}>
            <text x={(o.w ?? 520) / 2} y={(o.h ?? 200) * 0.42} textAnchor="middle" fontFamily={TYPE} fontSize={26} fill={C.gray}>{o.top}</text>
            <text x={(o.w ?? 520) / 2} y={(o.h ?? 200) * 0.8} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={o.size ?? 76} fill={o.red ? C.red : C.ink}>{o.text}</text></TornCard>;
          return <Strip key={i} x={o.x} y={o.y} start={at} text={o.text} size={o.size ?? 60} fill={o.red ? C.red : C.white} color={o.red ? C.white : C.ink} rot={o.rot ?? -2}/>;
        })}
      </g>
      <text x={40} y={land ? 115 : 300} fontFamily={TYPE} fontSize={22} fill="#FFF" opacity={0.7}>illustration</text>
    </svg>
  );
};

// ---------- x-race: two measures racing (e.g. pounds sold vs dollars earned) ----------
// s.rows = [{label, from, to, unit, prefix, at, red}], s.heading, s.foot
const XRace: React.FC<P> = ({s, n, T}) => {
  const f = useCurrentFrame();
  const rows = s.rows as any[]; const maxM = Math.max(...rows.map((r) => r.to / r.from));
  return (
    <Wrap n={n}>
      <Strip x={960} y={120} start={0} text={s.heading} size={60}/>
      {rows.map((r, i) => {
        const at = T(r.at); const p = interpolate(f, [at, at + 45], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
        if (f < at) return null;
        const y = 330 + i * 260, mult = r.to / r.from, w = 980 * (1 + (mult - 1) * p) / maxM, v = r.from + (r.to - r.from) * p;
        const val = `${r.prefix || ""}${r.dec !== undefined ? v.toFixed(r.dec) : v >= 100 ? Math.round(v).toLocaleString("en-US") : v.toFixed(1)}${r.unit || ""}`;
        return <g key={i}>
          <text x={180} y={y - 20} fontFamily={COND} fontWeight={700} fontSize={48} fill={C.ink}>{r.label}</text>
          <rect x={180} y={y} width={Math.max(8, w)} height={110} fill={r.red ? C.red : C.ink} style={{filter: "url(#vshadow)"}}/>
          <text x={200 + Math.max(8, w)} y={y + 80} fontFamily={COND} fontWeight={700} fontSize={70} fill={r.red ? C.red : C.ink}>{val}</text>
          <text x={1740} y={y + 80} textAnchor="end" fontFamily={COND} fontWeight={700} fontSize={90} fill={r.red ? C.red : C.gray} opacity={p}>×{(1 + (mult - 1) * p).toFixed(1)}</text>
        </g>;
      })}
      {s.foot && <TypeLabel x={180} y={900} start={T(s.foot.at)} text={s.foot.text} size={30} cps={99}/>}
      {s.stamp && <Stamp x={s.stamp.x ?? 1450} y={s.stamp.y ?? 900} start={T(s.stamp.at)} text={s.stamp.text} size={52} rot={-6}/>}
    </Wrap>
  );
};

// ---------- x-tiptoe: the parade (one spectator rises and sees better; then everyone rises and nobody does) ----------
// s.one_at, s.all_at, s.stamp = {text, at}
const XTiptoe: React.FC<P> = ({s, n, T}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const one = T(s.one_at), all = T(s.all_at);
  const xs = Array.from({length: 9}, (_, i) => 240 + i * 180);
  const lift = (i: number) => {
    const st = i === 4 ? one : all + Math.abs(i - 4) * 4;
    return f < st ? 0 : 70 * spring({frame: f - st, fps, config: {damping: 11, stiffness: 140}});
  };
  const flags = Array.from({length: 8}, (_, k) => ({x: ((f * 5 + k * 300) % 2400) - 240, c: [C.red, C.mustard, C.white][k % 3], h: 120 + (k % 3) * 40}));
  return (
    <Wrap n={n} illus>
      <rect x={0} y={560} width={1920} height={40} fill={C.gray} opacity={0.4}/>
      {flags.map((g, k) => <g key={k}>
        <line x1={g.x} y1={560} x2={g.x} y2={560 - g.h - 90} stroke={C.ink} strokeWidth={6}/>
        <path d={`M${g.x} ${560 - g.h - 90} l130 ${30 + 8 * Math.sin((f + k * 9) / 5)} l-130 50 z`} fill={g.c} stroke={C.ink} strokeWidth={3}/>
        <circle cx={g.x - 40} cy={560 - g.h} r={34} fill={C.mustard} stroke={C.ink} strokeWidth={3}/></g>)}
      {xs.map((x, i) => {
        const up = lift(i); const solo = i === 4 && f < all;
        return <g key={i} transform={`translate(0 ${-up})`}>
          <path d={person(x, 1150, 1.45)} fill={solo ? C.red : C.ink} stroke={C.white} strokeWidth={3}/>
        </g>;
      })}
      <Strip x={560} y={200} start={one} text="ONE ON TIPTOES: SEES BETTER" size={54} fill={C.white} rot={-2}/>
      <Strip x={1340} y={330} start={all} text="EVERYONE ON TIPTOES: NOBODY DOES" size={54} fill={C.red} color={C.white} rot={1.5}/>
      {s.stamp && <Stamp x={s.stamp.x ?? 1500} y={s.stamp.y ?? 120} start={T(s.stamp.at)} text={s.stamp.text} size={48} rot={-6}/>}
    </Wrap>
  );
};

// ---------- x-fall: a swinging price tag that falls step by step; old prices pile up struck through ----------
// s.heading, s.steps = [{top, big, at}], s.stamp = {text, at}
const XFall: React.FC<P> = ({s, n, T}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const steps = (s.steps as any[]).map((st) => ({...st, t: T(st.at)}));
  let cur = 0; steps.forEach((st, i) => { if (f >= st.t) cur = i; });
  const st = steps[cur]; const last = cur === steps.length - 1;
  const pop = spring({frame: Math.max(0, f - st.t), fps, config: {damping: 10, stiffness: 160}});
  const swing = Math.sin(f / 16) * 5 * (1 - 0.5 * pop) + (1 - pop) * 14;
  return (
    <Wrap n={n}>
      <Strip x={960} y={110} start={0} text={s.heading} size={56}/>
      {steps.slice(0, cur).map((p, i) => <g key={i}>
        <text x={170} y={330 + i * 210} fontFamily={TYPE} fontSize={30} fill={C.gray}>{p.top}</text>
        <text x={170} y={420 + i * 210} fontFamily={COND} fontWeight={700} fontSize={100} fill={C.gray}>{p.big}</text>
        <Line at={steps[i + 1].t} x1={150} y1={385 + i * 210} x2={560} y2={385 + i * 210} w={12}/>
      </g>)}
      <g transform={`rotate(${swing} 1240 200)`}>
        <line x1={1240} y1={200} x2={1240} y2={330} stroke={C.ink} strokeWidth={5}/>
        <path d="M940 330 h600 v420 h-600 z" fill={last ? C.red : C.white} stroke={C.ink} strokeWidth={6} style={{filter: "url(#vshadow)"}}/>
        <circle cx={1240} cy={370} r={18} fill={C.paper} stroke={C.ink} strokeWidth={4}/>
        <text x={1240} y={470} textAnchor="middle" fontFamily={TYPE} fontSize={34} fill={last ? C.white : C.gray}>{st.top}</text>
        <g transform={`translate(1240 640) scale(${0.7 + 0.3 * pop}) translate(-1240 -640)`}>
          <text x={1240} y={680} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={200} fill={last ? C.white : C.ink}>{st.big}</text></g>
      </g>
      {s.stamp && <Stamp x={s.stamp.x ?? 1300} y={s.stamp.y ?? 930} start={T(s.stamp.at)} text={s.stamp.text} size={52} rot={-5}/>}
    </Wrap>
  );
};

// ---------- x-tank: the salad-oil tank — looks full of oil; a cut-away reveals water under a thin oil layer ----------
// s.dip_at (dipstick goes in, comes up oily), s.reveal_at (cut-away), s.stamp = {text, at}
const XTank: React.FC<P> = ({s, n, T}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const dip = T(s.dip_at), rev = T(s.reveal_at);
  const fill = interpolate(f, [0, 40], [0, 1], {extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
  const cut = f < rev ? 0 : spring({frame: f - rev, fps, config: {damping: 18, stiffness: 90}});
  const sink = f < dip ? 0 : Math.min(1, (f - dip) / 20) - (f > dip + 45 ? Math.min(1, (f - dip - 45) / 20) : 0);
  const x0 = 620, w = 680, top = 250, bot = 930, H = bot - top, lvl = top + 40 + (1 - fill) * (H - 40);
  const oilB = lvl + 90; const wave = (y: number) => `M${x0} ${y} q85 ${-10 + 6 * Math.sin(f / 8)} 170 0 t170 0 t170 0 t170 0`;
  return (
    <Wrap n={n} illus>
      <ellipse cx={x0 + w / 2} cy={bot} rx={w / 2} ry={40} fill={C.ink} opacity={0.25}/>
      <rect x={x0} y={top} width={w} height={H} fill={C.paper} stroke={C.ink} strokeWidth={8}/>
      {/* oil everywhere before the cut; after it, water fills below the oil band from the left */}
      <path d={`${wave(lvl)} V${bot} H${x0} Z`} fill={C.mustard} opacity={0.95}/>
      <clipPath id="tankcut"><rect x={x0} y={top} width={w * cut} height={H}/></clipPath>
      <g clipPath="url(#tankcut)">
        <rect x={x0} y={oilB} width={w} height={bot - oilB} fill={WATER}/>
        {Array.from({length: 14}, (_, i) => <circle key={i} cx={x0 + 40 + (i * 53) % (w - 80)} cy={bot - ((f * 2 + i * 47) % (bot - oilB - 20))} r={6 + (i % 3) * 3} fill="#FFFFFF" opacity={0.5}/>)}
        <line x1={x0} y1={oilB} x2={x0 + w} y2={oilB} stroke={C.ink} strokeWidth={3} strokeDasharray="14 10"/>
      </g>
      {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={x0} y1={top + 40 + i * 120} x2={x0 + 30} y2={top + 40 + i * 120} stroke={C.ink} strokeWidth={4}/>)}
      <path d={`M${x0 - 20} ${top} h${w + 40} l-40 -60 h${-w + 40} z`} fill={C.gray} stroke={C.ink} strokeWidth={6}/>
      {/* the inspector's dipstick: only ever reaches the oil layer */}
      <g transform={`translate(0 ${sink * 150})`}>
        <rect x={x0 + w - 150} y={top - 260} width={18} height={260} fill="#8A6A3A" stroke={C.ink} strokeWidth={3}/>
        {f > dip + 30 && <rect x={x0 + w - 150} y={top - 40} width={18} height={40} fill={C.mustard}/>}
      </g>
      <Strip x={330} y={330} start={dip} text="DIPSTICK: OIL ✓" size={50} fill={C.white} rot={-2}/>
      <Strip x={330} y={500} start={rev} text="OIL: A THIN LAYER" size={46} fill={C.mustard} color={C.ink} rot={1.5}/>
      <Strip x={330} y={680} start={rev + 12} text="BELOW IT: WATER" size={56} fill={C.red} color={C.white} rot={-2}/>
      {s.stamp && <Stamp x={s.stamp.x ?? 1600} y={s.stamp.y ?? 220} start={T(s.stamp.at)} text={s.stamp.text} size={54} rot={-8}/>}
    </Wrap>
  );
};

// ---------- x-chain: boxes joined by arrows, each arriving on its phrase (e.g. tank → receipt → loan) ----------
// s.heading, s.nodes = [{t, at, dark}], s.label = {text, at}, s.stamp = {text, at}
const XChain: React.FC<P> = ({s, n, T}) => {
  const nodes = s.nodes as any[]; const k = nodes.length; const gap = 1380 / Math.max(1, k - 1); const y = 540;
  const xs = nodes.map((_, i) => 270 + i * gap);
  return (
    <Wrap n={n}>
      <Strip x={960} y={120} start={0} text={s.heading} size={60}/>
      {nodes.map((nd, i) => { const at = T(nd.at); return <React.Fragment key={i}>
        {i > 0 && <Pop at={at} x={(xs[i - 1] + xs[i]) / 2} y={y}>{arrow(xs[i - 1] + 215, xs[i] - 215, y)}</Pop>}
        <Pop at={at} x={xs[i]} y={y}>{box(xs[i], y, nd.t, !!nd.dark, 420, nd.t.length > 12 ? 36 : 46)}</Pop>
      </React.Fragment>; })}
      {s.label && <TypeLabel x={210} y={760} start={T(s.label.at)} text={s.label.text} size={34} cps={99}/>}
      {s.stamp && <Stamp x={s.stamp.x ?? 1450} y={s.stamp.y ?? 900} start={T(s.stamp.at)} text={s.stamp.text} size={56} rot={-6}/>}
    </Wrap>
  );
};

// ---------- x-loop: a flywheel — nodes around a circle, arrows between them, a spark that keeps circling ----------
// s.heading, s.nodes = [{t, at}], s.center = {text, at}, s.stamp = {text, at}
const XLoop: React.FC<P> = ({s, n, T}) => {
  const f = useCurrentFrame(); const nodes = s.nodes as any[]; const k = nodes.length;
  const cx = 960, cy = 590, R = 330;
  const pos = nodes.map((_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / k; return [cx + Math.cos(a) * R * 1.35, cy + Math.sin(a) * R]; });
  const last = T(nodes[k - 1].at); const spin = f < last ? 0 : (f - last) / 40;
  const sa = -Math.PI / 2 + spin * 2 * Math.PI;
  return (
    <Wrap n={n}>
      <Strip x={960} y={110} start={0} text={s.heading} size={58}/>
      <ellipse cx={cx} cy={cy} rx={R * 1.35} ry={R} fill="none" stroke={C.ink} strokeWidth={5} strokeDasharray="22 16" opacity={0.45}/>
      {f >= last && <circle cx={cx + Math.cos(sa) * R * 1.35} cy={cy + Math.sin(sa) * R} r={22} fill={C.red} stroke={C.ink} strokeWidth={4}/>}
      {nodes.map((nd, i) => { const at = T(nd.at); const [x, y] = pos[i];
        return <Pop key={i} at={at} x={x} y={y}>{box(x, y, nd.t, i === k - 1, 400, nd.t.length > 14 ? 34 : 42)}</Pop>; })}
      {s.center && <Pop at={T(s.center.at)} x={cx} y={cy}><text x={cx} y={cy + 20} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={s.center.text.length > 10 ? 48 : 70} fill={C.red}>{s.center.text}</text></Pop>}
      {s.stamp && <Stamp x={s.stamp.x ?? 1650} y={s.stamp.y ?? 960} start={T(s.stamp.at)} text={s.stamp.text} size={50} rot={-6}/>}
    </Wrap>
  );
};

// ---------- x-gap: stylised "cheap for decades" chart — what it was worth (red) vs the share price (ink), drawn over time ----------
// s.heading, s.years [start, end], s.price_at, s.value_at, s.stamp = {text, at}, s.note (source caption). Shapes are illustrative, not data.
const XGap: React.FC<P> = ({s, n, T}) => {
  const f = useCurrentFrame();
  const [y0, y1] = s.years as [number, number];
  const X = (u: number) => 220 + u * 1480, Y = (v: number) => 900 - v * 640;
  const pts = (fn: (u: number) => number, p: number) => Array.from({length: 61}, (_, i) => i / 60).filter((u) => u <= p).map((u) => `${X(u)},${Y(fn(u))}`).join(" ");
  const val = (u: number) => 0.04 + 0.92 * Math.pow(u, 1.6);
  const price = (u: number) => 0.012 + 0.55 * Math.pow(u, 2.4) + 0.012 * Math.sin(u * 40);
  const pa = T(s.price_at), va = T(s.value_at);
  const pp = interpolate(f, [pa, pa + 60], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const vp = interpolate(f, [va, va + 60], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <Wrap n={n}>
      <Strip x={960} y={110} start={0} text={s.heading} size={56}/>
      <line x1={220} y1={900} x2={1720} y2={900} stroke={C.ink} strokeWidth={4}/>
      <line x1={220} y1={900} x2={220} y2={240} stroke={C.ink} strokeWidth={4}/>
      {[0, 0.25, 0.5, 0.75, 1].map((u) => <text key={u} x={X(u)} y={950} textAnchor="middle" fontFamily={TYPE} fontSize={28} fill={C.ink}>{Math.round(y0 + u * (y1 - y0))}</text>)}
      {vp > 0 && pp > 0 && <polygon points={`${pts(val, Math.min(vp, pp))} ${Array.from({length: 61}, (_, i) => (60 - i) / 60).filter((u) => u <= Math.min(vp, pp)).map((u) => `${X(u)},${Y(price(u))}`).join(" ")}`} fill={C.red} opacity={0.12}/>}
      {vp > 0 && <polyline points={pts(val, vp)} fill="none" stroke={C.red} strokeWidth={9} strokeLinejoin="round"/>}
      {pp > 0 && <polyline points={pts(price, pp)} fill="none" stroke={C.ink} strokeWidth={7} strokeLinejoin="round"/>}
      <TypeLabel x={260} y={300} start={va} text="WHAT IT WAS WORTH (10% A YEAR FROM HERE)" size={30} cps={99}/>
      <TypeLabel x={260} y={345} start={pa} text="THE SHARE PRICE" size={30} cps={99}/>
      <line x1={232} y1={290} x2={252} y2={290} stroke={C.red} strokeWidth={8} opacity={vp > 0 ? 1 : 0}/>
      <line x1={232} y1={335} x2={252} y2={335} stroke={C.ink} strokeWidth={8} opacity={pp > 0 ? 1 : 0}/>
      {s.note && <TypeLabel x={220} y={1010} start={0} text={s.note} size={24} cps={99}/>}
      {s.stamp && <Stamp x={s.stamp.x ?? 1350} y={s.stamp.y ?? 620} start={T(s.stamp.at)} text={s.stamp.text} size={58} rot={-6}/>}
    </Wrap>
  );
};

export const CASE_SCENES: Record<string, React.FC<any>> = {
  "x-tank": XTank, "x-chain": XChain, "x-loop": XLoop, "x-gap": XGap,
  "x-door": XDoor, "x-case": XCase, "x-act": XAct, "x-founder": XFounder, "x-middleman": XMiddleman, "x-mango": XMango,
  "x-crime": XCrime, "x-biryani": XBiryani, "x-ekg": XEkg, "x-line": XLine, "x-verdict": XVerdict, "x-castle": XCastle, "x-photo": XPhoto, "x-race": XRace,
  "x-tiptoe": XTiptoe, "x-fall": XFall,
};
