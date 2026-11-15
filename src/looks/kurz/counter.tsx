// KURZ look, "counter" scene (data builder, 29 Oct 2026). Facts as big numbers with scaled pictures standing on a small planet.
//   pair:    two items side by side. visual "coins": a small coin and a big coin, areas in proportion to the two rupee values, with an
//            arrow; visual "eggs": an egg heap for a quantity and a podium for a rank ("No. ..." prefix).
//   compare: shares as 10 x 10 egg grids lit to the share (a part-egg for a decimal); a non-share item gets a crate stack.
//   trio:    three facts in a row, each with its own small picture (a "+..%" rise: a feed sack and two coin stacks in proportion;
//            paise: an egg on a coin; a share: ten sheds with that share gone dark).
// Pictures may move before a number lands; digits appear only at the item's key (DBadge -> numOf -> KNum).
// Spec: {mode, visual, items: (NumIn & {label})[], note?, source}
import React from "react";
import {AbsoluteFill} from "remotion";
import type {SceneProps} from "../cartoon/long/contract";
import {numOf, sourceOf, type NumIn} from "../cartoon/long/scenes/nk_kit";
import {Cam, CoinG, CrateG, DBadge, Dust, EggDefs, EggG, Finish, K, Place, Pulse, SackG, ShedG, SourceTag, Space, Shafts, Title, ease, easeIO, mix, pop} from "./data_kit";

type Item = NumIn & {label: string};
type CSpec = {mode: "pair" | "compare" | "trio"; visual: "eggs" | "coins" | "crates"; items: Item[]; note?: string; source: string};

const valueOf = (n: NumIn) => numOf(n, 0).value;     // the figure as a value for sizing shapes; never printed from here
const rupees = (n: NumIn) => {
  const v = valueOf(n);
  if (/paise/.test(n.suffix ?? "")) return v / 100;
  if ((n.prefix ?? "").includes("₹")) return v;
  throw new Error(`counter coins: cannot read "${n.key}" as rupees (prefix ₹ or suffix paise)`);
};
const isShare = (n: NumIn) => (n.suffix ?? "").trim() === "%";

// The ground: a very large planet whose crest is at FLOOR in the middle of the frame.
const FLOOR = 598, PR = 4200, base = (x: number) => FLOOR + PR - Math.sqrt(PR * PR - (x - 960) ** 2);

// A podium block, lit front, shaded side, bright top. (x, b) = bottom centre of the front face.
const Block: React.FC<{x: number; b: number; w: number; h: number; c: string; cs: string; ct: string}> = ({x, b, w, h, c, cs, ct}) => <g>
  <path d={`M ${x + w / 2} ${b} L ${x + w / 2 + 30} ${b - 20} L ${x + w / 2 + 30} ${b - h - 20} L ${x + w / 2} ${b - h} Z`} fill={cs}/>
  <rect x={x - w / 2} y={b - h} width={w} height={h} fill={c}/>
  <path d={`M ${x - w / 2} ${b - h} L ${x + w / 2} ${b - h} L ${x + w / 2 + 30} ${b - h - 20} L ${x - w / 2 + 30} ${b - h - 20} Z`} fill={ct}/>
  <rect x={x - w / 2} y={b - h} width={w} height={6} fill="#fff" opacity={0.25}/>
  <rect x={x - w / 2 + 14} y={b - h + 24} width={w - 28} height={h - 40} rx={8} fill="#fff" opacity={0.05}/>
</g>;

const Arrow: React.FC<{x0: number; x1: number; y: number; t: number; color?: string}> = ({x0, x1, y, t, color = K.orangeL}) => {
  if (t <= 0.001) return null;
  const xe = x0 + (x1 - x0) * t, mid = (x0 + xe) / 2;
  return <g opacity={Math.min(1, t * 2)}>
    <path d={`M ${x0} ${y} Q ${mid} ${y - 90 * t} ${xe - 18} ${y}`} stroke={color} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray="2 24"/>
    {t > 0.6 && <path d={`M ${xe - 40} ${y - 26} L ${xe + 6} ${y} L ${xe - 40} ${y + 26} Z`} fill={color}/>}
  </g>;
};

export const Scene: React.FC<SceneProps<CSpec>> = ({f, dur, spec, at}) => {
  const uid = "dkct", items = spec.items, warm = spec.mode === "trio" || spec.visual === "coins";
  const N = items.length, cxs = N === 3 ? [400, 960, 1520] : [560, 1360];
  const keyAt = items.map((it) => at(it.key));
  const BADGE_Y = 626;
  const art: React.ReactNode[] = [];

  // ---------------- pair: coins ----------------
  if (spec.mode === "pair" && spec.visual === "coins") {
    const [a, b] = items, ra = rupees(a), rb = rupees(b), small = 48, big = small * Math.sqrt(rb / ra);
    if (big > 255) throw new Error(`counter coins: ratio too big to draw (${(rb / ra).toFixed(1)})`);
    const b0 = base(cxs[0]), b1 = base(cxs[1]);
    const g0 = keyAt[1] - 26, grow = easeIO(f, g0, keyAt[1]), r1 = small + (big - small) * grow;
    const t0 = pop(f, 4);
    art.push(<g key="coins">
      <Pulse x={cxs[0]} y={b0 - small - 6} f={f} r={small * 1.2} color={K.orangeL} period={70}/>
      <g transform={`translate(0 ${(1 - t0) * 40})`} opacity={Math.min(1, t0 * 1.5)}><CoinG x={cxs[0]} y={b0 - small - 6} r={small} f={f} uid={uid} tone="copper" seed={1}/></g>
      {f >= g0 - 30 && <Arrow x0={cxs[0] + small + 50} x1={cxs[1] - big - 40} y={b0 - small - 6} t={easeIO(f, g0 - 30, g0 + 4)}/>}
      {f >= g0 && <g><circle cx={cxs[1]} cy={b1 - r1 - 6} r={r1 * 1.45} fill={K.yellow} opacity={0.09 * grow}/><CoinG x={cxs[1]} y={b1 - r1 - 6} r={r1} f={f} uid={uid} tone="gold" seed={2}/></g>}
    </g>);
  } else if (spec.mode === "pair") {
    // ---------------- pair: eggs (a heap for the quantity, a podium for the rank) ----------------
    const heap: React.ReactNode[] = []; let k = 0; const hb = base(cxs[0]);
    for (let row = 0; row < 8; row++) for (let c = 0; c < 8 - row; c++) {
      const ex = cxs[0] + (c - (7 - row) / 2) * 56, ey = hb - 34 - row * 50, t = pop(f, 4 + k * 0.9, 180); k++;
      if (t > 0.01) heap.push(<EggG key={`${row}${c}`} x={ex} y={ey - (1 - t) * 70} s={0.46 * Math.min(1.1, t)} uid={uid} rot={((row * 7 + c * 13) % 9) - 4} shadow={0.22}/>);
    }
    const rT = pop(f, keyAt[1]), bob = Math.sin(f / 14) * 4, pb = base(cxs[1]), W = 170;
    const lit2 = f >= keyAt[1] ? ease(f, keyAt[1], keyAt[1] + 12) : 0;
    art.push(<g key="eggs">
      <ellipse cx={cxs[0] + 20} cy={hb} rx={250} ry={24} fill="#000" opacity={0.3}/>
      <circle cx={cxs[0]} cy={hb - 200} r={270} fill={K.yellow} opacity={0.06 + 0.02 * Math.sin(f / 30)}/>
      {heap}
      <ellipse cx={cxs[1] + 20} cy={pb + 2} rx={300} ry={24} fill="#000" opacity={0.3}/>
      <Block x={cxs[1] - W - 6} b={pb} w={W} h={190} c={mix(K.soft, K.haze, lit2)} cs={K.mid} ct={mix(K.haze, K.white, 0.25 + 0.3 * lit2)}/>
      <Block x={cxs[1]} b={pb} w={W} h={270} c={K.soft} cs={K.mid} ct={K.haze}/>
      <Block x={cxs[1] + W + 6} b={pb} w={W} h={140} c={K.soft} cs={K.mid} ct={K.haze}/>
      <EggG x={cxs[1] + 15} y={pb - 270 - 82} s={0.8} uid={uid} fill="#7F8DC6" shade="#6573AE" hi={0.3}/>
      <EggG x={cxs[1] + W + 21} y={pb - 140 - 82} s={0.8} uid={uid} fill="#7F8DC6" shade="#6573AE" hi={0.3}/>
      {f >= keyAt[1] && <g transform={`translate(0 ${(1 - rT) * -140 + bob})`}>
        <Pulse x={cxs[1] - W + 9} y={pb - 190 - 82} f={f} r={56} color={K.orangeL} period={60}/>
        <EggG x={cxs[1] - W + 9} y={pb - 190 - 82} s={0.8 * Math.min(1.1, rT)} uid={uid} fill={K.orange} shade={K.orangeD} rim={K.yellowL}/>
      </g>}
    </g>);
  }

  // ---------------- compare ----------------
  if (spec.mode === "compare") {
    items.forEach((it, i) => {
      const cx = cxs[i], a = keyAt[i], b = base(cx);
      if (isShare(it)) {
        const v = valueOf(it), P = 44, x0 = cx - 4.5 * P, y0 = b - 40, full = Math.floor(v), part = v - full;
        const litCol = i === 0 ? [K.orange, K.orangeD] : [K.teal, K.tealD];
        const cells: React.ReactNode[] = [];
        for (let j = 0; j < 100; j++) {
          const row = Math.floor(j / 10), c = j % 10, ex = x0 + c * P, ey = y0 - row * P, inT = pop(f, 2 + (row + c) * 1.2, 200);
          if (inT <= 0.01) continue;
          const lt = a - 42 + 42 * (j / Math.max(1, v)), on = j < full ? ease(f, lt, lt + 6) : 0;
          cells.push(<g key={j}>
            <EggG x={ex} y={ey} s={0.31 * Math.min(1.1, inT)} uid={uid} fill="#2C3D86" shade="#22306C" hi={0.25} shadow={0}/>
            {on > 0 && <g opacity={on}><EggG x={ex} y={ey} s={0.31 * (1 + 0.15 * (1 - on))} uid={uid} fill={litCol[0]} shade={litCol[1]} shadow={0}/></g>}
            {j === full && part > 0 && f >= a - 2 && <g clipPath={`url(#${uid}-part${i})`} transform={`translate(${ex} ${ey})`}><g transform={`translate(${-ex} ${-ey})`} opacity={ease(f, a - 2, a + 6)}>
              <EggG x={ex} y={ey} s={0.31} uid={uid} fill={litCol[0]} shade={litCol[1]} shadow={0}/></g></g>}
          </g>);
        }
        art.push(<g key={`g${i}`}>
          <defs><clipPath id={`${uid}-part${i}`}><rect x={-18} y={-24} width={36 * part} height={48}/></clipPath></defs>
          <ellipse cx={cx + 20} cy={b} rx={260} ry={22} fill="#000" opacity={0.3}/>
          <rect x={x0 - 36} y={y0 - 9 * P - 38} width={10 * P + 30} height={10 * P + 30} rx={30} fill="#0B1433" opacity={0.5}/>
          <rect x={x0 - 36} y={y0 - 9 * P - 38} width={10 * P + 30} height={5} rx={2} fill="#fff" opacity={0.12}/>
          <circle cx={cx} cy={y0 - 4.5 * P} r={300} fill={litCol[0]} opacity={0.06 * ease(f, a - 40, a)}/>
          {cells}
        </g>);
      } else {
        // a quantity: a stack of egg crates (rows 3-2-1), each crate popping in
        const crates: React.ReactNode[] = []; let k = 0;
        [3, 2, 1].forEach((n, row) => { for (let c = 0; c < n; c++) {
          const x = cx + (c - (n - 1) / 2) * 150, y = b - row * 118, t = pop(f, 6 + k * 5, 160); k++;
          if (t > 0.01) crates.push(<g key={`${row}${c}`} transform={`translate(0 ${(1 - t) * -80})`} opacity={Math.min(1, t * 1.6)}><CrateG x={x} y={y} s={1.4} tone={(row + c) % 2 ? 0.5 : 0}/></g>);
        } });
        art.push(<g key={`c${i}`}><circle cx={cx} cy={b - 200} r={280} fill={K.orangeL} opacity={0.07}/><ellipse cx={cx + 20} cy={b + 2} rx={270} ry={24} fill="#000" opacity={0.3}/>{crates}</g>);
      }
    });
  }

  // ---------------- trio ----------------
  if (spec.mode === "trio") {
    items.forEach((it, i) => {
      const cx = cxs[i], a = keyAt[i], pre = it.prefix ?? "", suf = (it.suffix ?? "").trim(), v = valueOf(it), b = base(cx);
      const inT = pop(f, 6 + i * 8, 140);
      let pic: React.ReactNode;
      if (pre.includes("+") && suf === "%") {
        // a rise: feed sack and two coin stacks, before (2 coins) and after (2 x (1 + v/100) coins)
        const after = 2 * (1 + v / 100), g = easeIO(f, a - 24, a + 4), shown = 2 + (after - 2) * g, CH = 30;
        const stack = (x: number, n: number) => Array.from({length: Math.ceil(n)}, (_, j) => {
          const frac = Math.min(1, n - j); return <g key={j} opacity={frac}><ellipse cx={x} cy={b - 12 - j * CH} rx={60} ry={18} fill={K.orangeD}/><ellipse cx={x} cy={b - 20 - j * CH} rx={60} ry={18} fill={K.yellow}/>
            <path d={`M ${x} ${b - 38 - j * CH} A 60 18 0 0 1 ${x} ${b - 2 - j * CH} Z`} fill={K.orange} opacity={0.6}/></g>; });
        pic = <g>
          <ellipse cx={cx + 10} cy={b + 2} rx={250} ry={22} fill="#000" opacity={0.28}/>
          <SackG x={cx - 160} y={b} s={1.35}/>
          {stack(cx + 10, 2)}
          {stack(cx + 160, shown)}
          {g > 0.05 && <path d={`M ${cx + 46} ${b - 100} Q ${cx + 80} ${b - 100 - 200 * g} ${cx + 140} ${b - 2 * CH - shown * CH - 30}`} stroke={K.pink} strokeWidth={10} fill="none" strokeLinecap="round" opacity={g}/>}
          {g > 0.6 && <path d={`M ${cx + 124} ${b - shown * CH - 98} l 32 -2 l -8 30 Z`} fill={K.pink} opacity={g}/>}
        </g>;
      } else if (/paise/.test(it.suffix ?? "")) {
        const bob = Math.sin(f / 18) * 5;
        pic = <g>
          <circle cx={cx} cy={b - 190} r={200} fill={K.yellow} opacity={0.07}/>
          <ellipse cx={cx + 14} cy={b + 2} rx={170} ry={22} fill="#000" opacity={0.3}/>
          <ellipse cx={cx} cy={b - 14} rx={150} ry={42} fill="#8A4B27"/><ellipse cx={cx} cy={b - 28} rx={150} ry={42} fill="#E9A574"/>
          <path d={`M ${cx} ${b - 70} A 150 42 0 0 1 ${cx} ${b + 14} Z`} fill="#C47A47" opacity={0.8}/>
          <ellipse cx={cx} cy={b - 28} rx={114} ry={30} fill="none" stroke="#F8D2AE" strokeWidth={5} opacity={0.6}/>
          <EggG x={cx} y={b - 170 + bob} s={2.0} uid={uid} shadow={0}/>
        </g>;
      } else if (suf === "%") {
        const dark = Math.round(v / 10);
        if (Math.abs(v / 10 - dark) > 1e-9) throw new Error(`counter trio: ${it.key} = ${v}% is not a whole number of ten sheds`);
        const order = [1, 3, 6, 8, 0, 2, 4, 5, 7, 9];
        pic = <g>
          <ellipse cx={cx + 10} cy={b + 2} rx={280} ry={22} fill="#000" opacity={0.28}/>
          {Array.from({length: 10}, (_, j) => { const row = Math.floor(j / 5), c = j % 5, rank = order.indexOf(j), o = rank < dark ? easeIO(f, a - 30 + rank * 5, a + rank * 5) : 0;
            return <ShedG key={j} x={cx - 224 + c * 112 - (1 - row) * 30} y={b - 4 - (1 - row) * 150} s={0.8} f={f} off={o} seed={j}/>; })}
        </g>;
      } else {
        pic = <EggG x={cx} y={b - 140} s={1.8} uid={uid}/>;
      }
      art.push(<g key={`t${i}`} opacity={Math.min(1, inT * 1.5)} transform={`translate(0 ${(1 - inT) * 50})`}>{pic}</g>);
    });
  }

  const badgeCol = (i: number) => (spec.mode === "compare" ? (i === 0 ? K.yellow : K.tealL) : spec.mode === "trio" ? [K.pink, K.yellow, K.orangeL][i] : i === 0 ? K.orangeL : K.yellow);
  const ground = warm ? ["#3D2D63", "#1E1A44"] : ["#1D3A7A", "#0F1B4A"];
  return <AbsoluteFill>
    <Space f={f} uid={uid} seed={spec.mode === "trio" ? 31 : spec.visual === "coins" ? 33 : 35} warm={warm} glowY={0.62}/>
    <Cam f={f} dur={dur} push={0.03} fy={560}>
      <svg width={1920} height={1080} style={{position: "absolute"}}>
        <defs>
          <EggDefs uid={uid}/>
          <linearGradient id={`${uid}-pl`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={ground[0]}/><stop offset="0.35" stopColor={ground[1]}/><stop offset="1" stopColor={K.night}/></linearGradient>
          <radialGradient id={`${uid}-atm`} cx="0.5" cy="1" r="0.6"><stop offset="0" stopColor={warm ? K.orangeL : K.tealL} stopOpacity={0.35}/><stop offset="1" stopColor={warm ? K.orangeL : K.tealL} stopOpacity={0}/></radialGradient>
        </defs>
        <Shafts f={f} uid={uid} x={300} color={warm ? K.orangeL : K.tealL} a={0.8}/>
        {/* atmosphere glow over the planet's crest, then the planet with a lit rim and a few craters */}
        <rect x={0} y={FLOOR - 260} width={1920} height={300} fill={`url(#${uid}-atm)`}/>
        <circle cx={960} cy={FLOOR + PR} r={PR} fill={`url(#${uid}-pl)`}/>
        <circle cx={960} cy={FLOOR + PR} r={PR - 3} fill="none" stroke={warm ? K.orangeL : K.tealL} strokeWidth={5} opacity={0.55}/>
        <circle cx={960} cy={FLOOR + PR + 26} r={PR} fill="none" stroke="#fff" strokeWidth={2} opacity={0.06}/>
        {[[260, 690, 70], [820, 740, 46], [1240, 700, 58], [1700, 760, 40], [520, 820, 34]].map(([x, y, r], k) =>
          <g key={k} opacity={0.5}><ellipse cx={x} cy={y} rx={r} ry={r * 0.28} fill="#000" opacity={0.25}/><ellipse cx={x} cy={y - r * 0.05} rx={r * 0.9} ry={r * 0.22} fill="none" stroke="#fff" strokeWidth={2} opacity={0.1}/></g>)}
        {art}
        <Dust f={f} n={34} seed={9} color={warm ? K.orangeL : K.tealL}/>
      </svg>
      {items.map((it, i) => <Place key={it.key} x={cxs[i]} y={BADGE_Y} anchor="t">
        <DBadge n={it} at={keyAt[i]} f={f} caption={it.label} size={N === 3 ? 108 : 120} capSize={N === 3 ? 32 : 34} capW={N === 3 ? 440 : 620} color={badgeCol(i)}/>
      </Place>)}
    </Cam>
    <Finish/>
    {spec.note && <Title text={spec.note} f={f} color={warm ? K.orange : K.teal} size={34}/>}
    <SourceTag text={sourceOf(spec.source)} f={f}/>
  </AbsoluteFill>;
};
