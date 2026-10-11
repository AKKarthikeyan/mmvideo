// World scenes for the illustration kit: places and machines that explain a business.
//   store   meet the company: a big storefront, shoppers rolling in on a loop, facts on price tags at the right
//   gears   the engine of the business: gears that clunk together one by one and then turn as a train
//   castle  what a moat is: a castle on an island, water all round, rivals kept out, checks on shields
// Every word and number on screen comes from the scene's props.
import React from "react";
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {SP, P, IStage, IHeading, INote, IStamps, Pop, Icon, StoreIcon, TrolleyIcon, PersonIcon, TFn, fit, clamp01} from "./kit";
import {COND} from "../../voxkit";

// ---------- shared helpers ----------
const WOOD = "#C89B5A", WOOD_LT = "#DDB877";   // the kit's own box colours
const arr = (x: any): any[] => (Array.isArray(x) ? x : []);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const sum = (a: number[]) => a.reduce((p, c) => p + c, 0);
const prog = (f: number, start: number, dur: number, ease: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [start, start + Math.max(1, dur)], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
const pop = (f: number, fps: number, start: number, damping = 11, stiffness = 150) =>
  f < start ? 0 : spring({frame: f - start, fps, config: {damping, stiffness, mass: 0.8}});
// Frame for an `at`. No `at`, or the number 0, means "on from the start": far enough back that every spring has settled.
const ON = -1000;
const when = (T: TFn, x: any) => (x == null || x === 0 ? ON : T(x));
const tw = (text: string, size: number) => text.length * size * 0.52;   // rough width of Oswald caps
const Txt: React.FC<{x: number; y: number; text: string; size: number; color?: string; anchor?: "start" | "middle" | "end"}> =
  ({x, y, text, size, color = P.ink, anchor = "middle"}) =>
  <text x={x} y={y} fontFamily={COND} fontWeight={700} fontSize={size} textAnchor={anchor} fill={color} letterSpacing={1}>{text}</text>;
// Break a label into two lines of about the same length.
const split2 = (text: string): string[] | null => {
  const w = text.split(" ");
  if (w.length < 2) return null;
  let best = 1, bestLen = Infinity;
  for (let i = 1; i < w.length; i++) {
    const m = Math.max(w.slice(0, i).join(" ").length, w.slice(i).join(" ").length);
    if (m < bestLen) { bestLen = m; best = i; }
  }
  return [w.slice(0, best).join(" "), w.slice(best).join(" ")];
};
// One line if it fits at `minOne` px or more, otherwise two.
const layout = (text: string, maxW: number, size: number, minOne: number) => {
  const sz = (len: number) => Math.min(size, maxW / (len * 0.52 + 0.9));
  const one = sz(text.length), two = one >= minOne ? null : split2(text);
  return two ? {lines: two, size: sz(Math.max(two[0].length, two[1].length))} : {lines: [text], size: one};
};
// One or two lines of caps, centred on (x, y).
const Lines: React.FC<{x: number; y: number; lines: string[]; size: number; color?: string}> = ({x, y, lines, size, color}) =>
  <>{lines.map((l, i) => <Txt key={i} x={x} y={y + (lines.length === 1 ? size * 0.36 : i ? size * 0.95 : -size * 0.2)} text={l} size={size} color={color}/>)}</>;
const linesW = (lines: string[], size: number) => Math.max(0, ...lines.map((l) => tw(l, size)));
const linesH = (lines: string[], size: number) => (lines.length === 1 ? size * 1.58 : size * 2.52);
// Where the kit puts its stamps by default (same arithmetic as IStamps): width, left edge, and top with room for the tilt,
// so a scene can keep out of their way.
const stampBoxes = (s: any) => arr(s.stamps).map((st, i) => {
  const t = String((st && st.text) || ""), w = t.length * fit(t, 60, 900, 0.56) * 0.55 + 70;
  return {w, left: 1810 - w, top: 855 - i * 115 - 62 - w * 0.045};
});
const stampAts = (s: any, T: TFn) => arr(s.stamps).map((st) => (st && st.at != null ? T(st.at) : 0));

// ---------- store: meet the company ----------
const S = {G: 842, X0: 300, X1: 1190, TOP: 430, DX0: 645, DX1: 845, DY0: 572, WY0: 536, WY1: 776, FOOT: 873,
  START: 132, CLIP: 178, SPEED: 6, LOOP: 360, RUN: 147, TAG_X: 1262, TAG_R: 1812};
const GOODS = [P.mustard, P.red, P.green, P.blue, P.gold, WOOD, P.white];
const PEOPLE = [P.ink, P.blue, P.gray];

// Shelves of plain coloured goods (sizes and colours vary by index, never at random).
const Shelf: React.FC<{x0: number; x1: number; ys: number[]; seed: number; maxH: number}> = ({x0, x1, ys, seed, maxH}) => (
  <g>
    {ys.map((y, r) => {
      const items: React.ReactNode[] = [];
      let x = x0 + 10;
      for (let j = 0; j < 40; j++) {
        const w = 26 + ((j * 37 + r * 11 + seed * 7) % 5) * 5, h = maxH * (0.56 + ((j * 53 + r * 29 + seed * 13) % 6) * 0.088);
        if (x + w > x1 - 8) break;
        items.push(<rect key={j} x={x} y={y - h} width={w} height={h} rx={(j + r) % 3 === 0 ? 8 : 2} fill={GOODS[(j * 3 + r * 2 + seed) % GOODS.length]} stroke={P.ink} strokeWidth={3}/>);
        x += w + 7;
      }
      return <g key={r}>{items}<rect x={x0} y={y} width={x1 - x0} height={6} fill={P.ink}/></g>;
    })}
  </g>
);
const ShopWindow: React.FC<{x0: number; x1: number; seed: number}> = ({x0, x1, seed}) => (
  <g>
    <rect x={x0} y={S.WY0} width={x1 - x0} height={S.WY1 - S.WY0} fill={P.cream}/>
    <Shelf x0={x0} x1={x1} ys={[S.WY0 + 80, S.WY0 + 158, S.WY1 - 6]} seed={seed} maxH={56}/>
    <path d={`M ${x0 + 20} ${S.WY0 + 58} L ${x0 + 62} ${S.WY0 + 16} M ${x0 + 20} ${S.WY0 + 92} L ${x0 + 96} ${S.WY0 + 16}`} stroke={P.white} strokeWidth={7} opacity={0.75}/>
    <rect x={x0} y={S.WY0} width={x1 - x0} height={S.WY1 - S.WY0} fill="none" stroke={P.ink} strokeWidth={5}/>
    <rect x={x0 - 9} y={S.WY1} width={x1 - x0 + 18} height={13} fill={P.paper} stroke={P.ink} strokeWidth={4}/>
  </g>
);
// The sign board: ink, like the kit's store icon, with a row of bulbs that keep chasing.
const ShopSign: React.FC<{text: string}> = ({text}) => {
  const f = useCurrentFrame();
  if (!text) return null;
  const size = fit(text, 72, 620), w = Math.max(340, tw(text, size) + 130), h = 112, cx = (S.X0 + S.X1) / 2, cy = 344;
  const nb = Math.max(4, Math.round((w - 60) / 44) + 1);
  return (
    <Pop x={cx} y={cy + h / 2} start={0} from={0.82}>
      <g transform={`translate(0 ${-h / 2})`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={P.ink} style={{filter: "url(#vshadow)"}}/>
        {[-1, 1].map((sd) => Array.from({length: nb}, (_, i) =>
          <circle key={`${sd}${i}`} cx={-w / 2 + 30 + i * (w - 60) / (nb - 1)} cy={sd * (h / 2 - 14)} r={6} fill={(i + (sd > 0 ? 1 : 0) + Math.floor(f / 9)) % 2 ? P.gold : P.gray}/>))}
        <Txt x={0} y={size * 0.36} text={text} size={size} color={P.white}/>
      </g>
    </Pop>
  );
};
// A planter the shoppers come out from behind, so nobody has to enter from outside the frame.
const Planter: React.FC = () => {
  const f = useCurrentFrame();
  const blobs = [[150, 772, 42], [196, 748, 52], [234, 780, 38], [190, 796, 46]];
  return (
    <g>
      <g transform={`rotate(${Math.sin(f / 19) * 1.5} 184 812)`}>
        {blobs.map((b, i) => <circle key={i} cx={b[0]} cy={b[1]} r={b[2]} fill={P.green} stroke={P.ink} strokeWidth={10}/>)}
        {blobs.map((b, i) => <circle key={`f${i}`} cx={b[0]} cy={b[1]} r={b[2]} fill={P.green}/>)}
        <path d="M 168 736 q 20 -18 44 -8 M 136 770 q 10 -16 28 -14 M 214 786 q 14 -8 26 2" fill="none" stroke="#BFD9B4" strokeWidth={5} strokeLinecap="round" opacity={0.8}/>
      </g>
      <rect x={114} y={816} width={142} height={62} rx={3} fill={WOOD} stroke={P.ink} strokeWidth={5}/>
      <rect x={106} y={806} width={158} height={18} rx={4} fill={WOOD_LT} stroke={P.ink} strokeWidth={5}/>
      <line x1={161} y1={828} x2={161} y2={874} stroke={P.ink} strokeWidth={3} opacity={0.5}/><line x1={209} y1={828} x2={209} y2={874} stroke={P.ink} strokeWidth={3} opacity={0.5}/>
    </g>
  );
};
// One faceless shopper pushing an empty trolley; shrinks a little as they turn in at the door.
const Shopper: React.FC<{x: number; i: number}> = ({x, i}) => {
  const f = useCurrentFrame();
  const p = clamp01((x - 690) / 130), hop = Math.abs(Math.sin(f * 0.42 + i * 1.3)) * 5, build = 0.94 + ((i * 37) % 5) * 0.03;
  return (
    <g transform={`translate(${x} ${S.FOOT - 26 * p}) scale(${lerp(1, 0.8, p) * build})`}>
      <PersonIcon x={-52} y={-60 - hop} size={150} color={PEOPLE[i % PEOPLE.length]}/>
      <g transform={`rotate(${Math.sin(f * 0.8 + i) * 1.3} 46 0)`}><TrolleyIcon x={46} y={-44} size={104} full={false}/></g>
    </g>
  );
};
// A fact on a price tag: pops, swings on its pin and settles.
const FactTag: React.FC<{y: number; start: number; lines: string[]; size: number; i: number}> = ({y, start, lines, size, i}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  if (f < start) return null;
  const u = f - start, sp = pop(f, fps, start);
  const bw = linesW(lines, size) + size * 0.9, h = linesH(lines, size), c = Math.min(26, h * 0.28), L = -30, B = L + 56;
  const rot = [-1.4, 1.1, -0.7][i % 3] + 11 * Math.sin(u * 0.4) * Math.exp(-u / 10) + Math.sin(f / 21 + i * 2) * 0.5;
  return (
    <g transform={`translate(${S.TAG_X + 30} ${y}) rotate(${rot}) scale(${0.55 + 0.45 * sp})`}>
      <path d={`M ${L + c} ${-h / 2} H ${B + bw} V ${h / 2} H ${L + c} L ${L} ${h / 2 - c} V ${-h / 2 + c} Z`} fill={P.white} stroke={P.ink} strokeWidth={4.5} strokeLinejoin="round" style={{filter: "url(#vshadow)"}}/>
      <circle cx={0} cy={0} r={8.5} fill={P.red} stroke={P.ink} strokeWidth={3.5}/>
      <Lines x={B + bw / 2 - 4} y={0} lines={lines} size={size}/>
    </g>
  );
};

const Store: React.FC<SP> = ({s, n, T}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const facts = arr(s.facts).filter((x) => x && x.text), nf = facts.length;
  const fa = facts.map((x) => when(T, x.at)), boxes = stampBoxes(s);
  // The street holds the middle of the stage until the first fact (or stamp) needs the right-hand third.
  const first = Math.min(Infinity, ...fa, ...stampAts(s, T));
  const mv = first === Infinity ? 0 : first - 22 < 6 ? 1 : pop(f, fps, first - 22, 18, 90);
  const dx = lerp(306, 28, mv);   // 28: room for the stage's slow drift to the left
  // Shoppers: five to a loop, in ones and twos, with gaps long enough for the doors to slide shut in between.
  const shoppers = [100, 55, 325, 280, 190].map((o, i) => { const t = (f + o) % S.LOOP; return {i, on: t < S.RUN, x: S.START + S.SPEED * t}; });
  const near = Math.max(0, ...shoppers.map((sh) => (sh.on ? Math.min(clamp01((sh.x - 500) / 60), clamp01((958 - sh.x) / 50)) : 0)));
  const open = near * near * (3 - 2 * near) * 96;
  // Fact tags: one type size for the column where the facts allow it, two lines when a fact is long, all squeezed to fit.
  const lay = facts.map((x) => layout(String(x.text), S.TAG_R - S.TAG_X - 56, 64, 56));
  const common = Math.min(64, ...lay.filter((l) => l.size >= 48).map((l) => l.size));
  const top = 292, bot = Math.min(892, ...boxes.map((b) => b.top));
  let sizes = lay.map((l) => (l.size >= 48 ? common : Math.max(30, l.size)));
  let hs = lay.map((l, i) => linesH(l.lines, sizes[i]));
  const room = bot - top - 14 * Math.max(0, nf - 1);
  if (sum(hs) > room) { const q = room / sum(hs); sizes = sizes.map((z) => z * q); hs = hs.map((h) => h * q); }
  const gap = nf > 1 ? clamp((bot - top - sum(hs)) / (nf - 1), 14, 38) : 0, tot = sum(hs) + gap * Math.max(0, nf - 1);
  let ty = Math.min(590, (top + bot) / 2) - tot / 2;
  const cid = `wst-${n}`;
  const stripes = 14, sw = (S.X1 - S.X0 + 20) / stripes;
  return (
    <IStage n={n}>
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      <g transform={`translate(${dx} 0)`}>
        <defs>
          <clipPath id={`${cid}-in`}><rect x={S.CLIP} y={0} width={S.DX1 - S.CLIP} height={1080}/></clipPath>
          <clipPath id={`${cid}-door`}><rect x={S.DX0} y={S.DY0} width={S.DX1 - S.DX0} height={S.G - S.DY0}/></clipPath>
        </defs>
        {/* pavement */}
        <rect x={96} y={S.G} width={1118} height={42} fill={P.paper} stroke={P.ink} strokeWidth={4}/>
        {Array.from({length: 8}, (_, i) => <line key={i} x1={220 + i * 124} y1={S.G + 4} x2={206 + i * 124} y2={S.G + 38} stroke={P.ink} strokeWidth={3} opacity={0.35}/>)}
        {/* the building */}
        <rect x={S.X0} y={S.TOP} width={S.X1 - S.X0} height={S.G - S.TOP} fill={P.white} stroke={P.ink} strokeWidth={5}/>
        <rect x={S.X0} y={802} width={S.X1 - S.X0} height={S.G - 802} fill={P.paper} stroke={P.ink} strokeWidth={4}/>
        <ShopWindow x0={340} x1={612} seed={1}/>
        <ShopWindow x0={878} x1={1150} seed={4}/>
        {/* doorway: the inside of the shop, then two glass doors that slide apart */}
        <rect x={S.DX0} y={S.DY0} width={S.DX1 - S.DX0} height={S.G - S.DY0} fill={P.cream}/>
        <Shelf x0={S.DX0} x1={S.DX1} ys={[S.DY0 + 86, S.DY0 + 160, S.DY0 + 232]} seed={7} maxH={46}/>
        <rect x={S.DX0} y={S.DY0 + 238} width={S.DX1 - S.DX0} height={S.G - S.DY0 - 238} fill={P.paper}/>
        <g clipPath={`url(#${cid}-door)`}>
          {[-1, 1].map((sd) => {
            const x = sd < 0 ? S.DX0 - open : (S.DX0 + S.DX1) / 2 + open;
            return (
              <g key={sd}>
                <rect x={x} y={S.DY0} width={100} height={S.G - S.DY0} fill={P.cream}/>
                <rect x={x} y={S.DY0} width={100} height={S.G - S.DY0} fill={P.blue} fillOpacity={0.42} stroke={P.ink} strokeWidth={4}/>
                <path d={`M ${x + 16} ${S.DY0 + 84} L ${x + 62} ${S.DY0 + 30} M ${x + 16} ${S.DY0 + 122} L ${x + 84} ${S.DY0 + 42}`} stroke={P.white} strokeWidth={7} strokeLinecap="round" opacity={0.75}/>
                <line x1={sd < 0 ? x + 84 : x + 16} y1={S.DY0 + 120} x2={sd < 0 ? x + 84 : x + 16} y2={S.DY0 + 190} stroke={P.ink} strokeWidth={7} strokeLinecap="round"/>
              </g>
            );
          })}
        </g>
        <rect x={S.DX0} y={S.DY0} width={S.DX1 - S.DX0} height={S.G - S.DY0} fill="none" stroke={P.ink} strokeWidth={6}/>
        <rect x={S.DX0 - 16} y={S.DY0 - 30} width={S.DX1 - S.DX0 + 32} height={30} fill={P.mustard} stroke={P.ink} strokeWidth={5}/>
        {/* sign, roof and striped awning */}
        <ShopSign text={s.sign ? String(s.sign) : ""}/>
        <rect x={S.X0 - 14} y={400} width={S.X1 - S.X0 + 28} height={30} fill={P.mustard} stroke={P.ink} strokeWidth={5}/>
        {Array.from({length: stripes}, (_, i) =>
          <path key={i} d={`M ${S.X0 - 10 + i * sw} ${S.TOP} h ${sw} v 40 a ${sw / 2} ${20 + 3 * Math.sin(f / 7 + i * 0.9)} 0 0 1 ${-sw} 0 Z`} fill={i % 2 ? P.white : P.red} stroke={P.ink} strokeWidth={4} strokeLinejoin="round"/>)}
        {/* shoppers roll along the pavement and turn in at the door */}
        <g clipPath={`url(#${cid}-in)`}>{shoppers.filter((sh) => sh.on).map((sh) => <Shopper key={sh.i} x={sh.x} i={sh.i}/>)}</g>
        <Planter/>
      </g>
      {facts.map((x, i) => { const y = ty + hs[i] / 2; ty += hs[i] + gap; return <FactTag key={i} y={y} start={fa[i]} lines={lay[i].lines} size={sizes[i]} i={i}/>; })}
      <IStamps s={s} T={T}/>
    </IStage>
  );
};

// ---------- gears: the engine of the business ----------
const TEETH = 12, GEAR_COL = [P.mustard, P.blue, P.green, P.gold, P.gray];
const gearPath = (R: number) => {
  const rt = R * 1.11, rr = R * 0.87, step = (Math.PI * 2) / TEETH, wr = step * 0.31, wt = step * 0.15;
  const pt = (r: number, a: number) => `${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`;
  let d = "";
  for (let k = 0; k < TEETH; k++) {
    const a = k * step;
    d += `${k ? `A ${rr.toFixed(1)} ${rr.toFixed(1)} 0 0 1` : "M"} ${pt(rr, a - wr)} L ${pt(rt, a - wt)} L ${pt(rt, a + wt)} L ${pt(rr, a + wr)} `;
  }
  d += `A ${rr.toFixed(1)} ${rr.toFixed(1)} 0 0 1 ${pt(rr, -wr)} Z`;
  const hr = R * 0.105, hd = R * 0.61;   // six round holes, cut with the even-odd rule
  for (let k = 0; k < 6; k++) {
    const a = (k + 0.5) * Math.PI / 3, x = hd * Math.cos(a), y = hd * Math.sin(a);
    d += ` M ${(x - hr).toFixed(1)} ${y.toFixed(1)} a ${hr.toFixed(1)} ${hr.toFixed(1)} 0 1 0 ${(2 * hr).toFixed(1)} 0 a ${hr.toFixed(1)} ${hr.toFixed(1)} 0 1 0 ${(-2 * hr).toFixed(1)} 0 Z`;
  }
  return d;
};
// The label under a gear: a paper chip (two lines if the label is long) that pops in.
const LabelChip: React.FC<{x: number; y: number; start: number; lines: string[]; size: number}> = ({x, y, start, lines, size}) => {
  const w = linesW(lines, size) + size * 0.9, h = linesH(lines, size);
  return (
    <Pop x={x} y={y} start={start}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill={P.white} stroke={P.ink} strokeWidth={4} style={{filter: "url(#vshadow)"}}/>
      <Lines x={0} y={0} lines={lines} size={size}/>
    </Pop>
  );
};

const Gears: React.FC<SP> = ({s, n, T}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const gs = arr(s.gears).filter((g) => g), k = gs.length;
  const res = s.result && s.result.text ? s.result : null, rtext = res ? String(res.text) : "";
  // The result plate shares the bottom row with any stamps, so it keeps to the left of them.
  const boxes = stampBoxes(s), sW = Math.max(0, ...boxes.map((b) => b.w)), plateR = sW ? 1810 - sW - 40 : 1810, plateMax = Math.max(300, plateR - 110);
  const rsize = res ? Math.max(30, fit(rtext, 58, plateMax - 120)) : 0, plateW = tw(rtext, rsize) + 120, plateH = rsize * 1.5;
  const plateX = sW ? Math.max(110 + plateW / 2, Math.min(960, plateR - plateW / 2)) : 960;
  // Size the gears to the row, then shrink them if gears + labels + plate would not fit the height.
  const labels = (r: number) => {
    const lay = gs.map((g) => layout(String(g.text || ""), 2 * r - 24, 50, 40));
    const size = Math.max(30, Math.min(50, ...lay.map((l) => l.size)));
    return {lay, size, h: Math.max(0, ...gs.map((g, i) => (g.text ? linesH(lay[i].lines, size) : 0)))};
  };
  const top0 = 282, bot0 = res ? 898 : Math.min(898, ...boxes.map((b) => b.top));
  let R = Math.min(190, 1640 / (2.3 * Math.max(1, k) - 0.08)), L = labels(R);
  const need = (r: number, lh: number) => 2.22 * r + (lh ? 16 + lh : 0) + (res ? 20 + plateH : 0);
  for (let pass = 0; pass < 3 && need(R, L.h) > bot0 - top0; pass++) { R -= (need(R, L.h) - (bot0 - top0)) / 2.22; L = labels(R); }
  const GAP = R * 0.3, cy = top0 + Math.max(0, (bot0 - top0 - need(R, L.h)) / 2) + 1.11 * R;
  const chipY = cy + 1.11 * R + 16 + L.h / 2, resY = cy + 1.11 * R + (L.h ? 16 + L.h : 0) + 20 + plateH / 2;
  const at = gs.map((g) => when(T, g.at));
  const t0 = k ? Math.min(...at) : 0;
  // The driving angle: spins up from the frame the first gear starts, then holds a steady speed.
  const theta = (fr: number) => { const u = fr - t0; return u <= 0 ? 0 : 2.6 * (u - 7 * (1 - Math.exp(-u / 7))); };
  const mesh = (i: number, fr: number) => (i % 2 ? -1 : 1) * theta(fr) + (i % 2 ? 180 / TEETH : 0);   // neighbours counter-rotate, half a tooth out of step
  const idle = (i: number, fr: number) => 7 * Math.sin(fr * 0.085 + i * 2.1);                           // waiting gears rock on the spot
  // A joint between two neighbours closes (they slide into mesh) once both have started.
  const close = gs.slice(1).map((_, j) => { const c = Math.max(at[j], at[j + 1]); return {c, v: c <= ON ? 1 : pop(f, fps, c, 26, 220)}; });
  const gaps = close.map((c) => GAP * (1 - c.v)), gsum = sum(gaps);
  const gx = (i: number) => 960 + (i - (k - 1) / 2) * 2 * R + sum(gaps.slice(0, i)) - gsum / 2;
  return (
    <IStage n={n}>
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      {gs.map((g, i) => {
        const inAt = i * 5 - 4;
        if (f < inAt) return null;
        const drop = (1 - pop(f, fps, inAt, 10, 150)) * -170;
        // Blend from the idle rock into the meshed angle just before the gear starts (wrapped to the nearest matching tooth).
        const b0 = at[i] - 5, wrap = 60 * Math.round((idle(i, b0) - mesh(i, b0)) / 60);
        const e = at[i] <= ON ? 1 : prog(f, b0, 5, Easing.inOut(Easing.quad));
        const deg = lerp(idle(i, Math.min(f, at[i])), mesh(i, f) + wrap, e);
        const u = f - at[i], kick = u >= 0 && u < 45 ? 0.07 * Math.exp(-u / 5) * Math.sin(u * 0.9) : 0;
        const jolt = [close[i - 1], close[i]].reduce((a, c) => { const v = c ? f - c.c - 3 : -1; return a + (v >= 0 && v < 40 ? 7 * Math.exp(-v / 3.5) * Math.sin(v * 1.4) : 0); }, 0);
        const name = String(g.icon || "box"), wait = f < at[i] ? Math.pow(Math.max(0, Math.sin(f * 0.105 - i * 1.3)), 4) * 8 : 0;   // a waiting gear's icon hops now and then
        return (
          <g key={i}>
            <g transform={`translate(${gx(i)} ${cy + drop + jolt}) scale(${1 + kick})`}>
              <g style={{filter: "url(#vshadow)"}}>
                <path d={gearPath(R)} transform={`rotate(${deg})`} fill={f >= at[i] ? GEAR_COL[i % GEAR_COL.length] : P.paper} fillRule="evenodd" stroke={P.ink} strokeWidth={5} strokeLinejoin="round"/>
              </g>
              <circle r={R * 0.43} fill={P.white} stroke={P.ink} strokeWidth={5}/>
              <Icon name={name} y={-wait} size={R * (name === "note" ? 0.4 : 0.56)}/>
            </g>
            {g.text ? <LabelChip x={gx(i)} y={chipY} start={at[i]} lines={L.lay[i].lines} size={L.size}/> : null}
          </g>
        );
      })}
      {/* a comic "clunk" star for a few frames where two gears meet */}
      {close.map((c, j) => {
        const v = f - c.c - 3;
        if (c.c <= ON || v < 0 || v >= 7) return null;
        const pts = Array.from({length: 16}, (_, q) => { const r = q % 2 ? 22 : 50, an = q * Math.PI / 8 + 0.2; return `${(r * Math.cos(an)).toFixed(1)} ${(r * Math.sin(an)).toFixed(1)}`; });
        return <path key={j} d={`M ${pts.join(" L ")} Z`} transform={`translate(${(gx(j) + gx(j + 1)) / 2} ${cy}) scale(${[0.5, 0.9, 1.2, 1.15, 1.05, 0.95, 0.85][v]})`} fill={P.white} stroke={P.ink} strokeWidth={5} strokeLinejoin="round"/>;
      })}
      {res ? (
        <Pop x={plateX} y={resY} start={when(T, res.at)} from={1.5}>
          <rect x={-plateW / 2} y={-plateH / 2} width={plateW} height={plateH} rx={9} fill={P.red} stroke={P.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
          {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map((c, i) => <circle key={i} cx={c[0] * (plateW / 2 - 20)} cy={c[1] * (plateH / 2 - 18)} r={6} fill={P.paper} stroke={P.ink} strokeWidth={3}/>)}
          <Txt x={0} y={rsize * 0.36} text={rtext} size={rsize} color={P.white}/>
        </Pop>
      ) : null}
      <IStamps s={s} T={T}/>
    </IStage>
  );
};

// ---------- castle: what a moat is ----------
// Drawn in its own units around the middle of the island (0, 0), then placed and scaled as one piece.
const C = {RXI: 290, RYI: 84, RXO: 450, RYO: 146, DOWN: 172, COL_X: 1078, COL_W: 682};
const ell = (rx: number, ry: number, y = 0) => `M ${-rx} ${y} A ${rx} ${ry} 0 1 0 ${rx} ${y} A ${rx} ${ry} 0 1 0 ${-rx} ${y} Z`;
const SHIELD = "M -40 -46 H 40 V 2 C 40 30 20 46 0 56 C -20 46 -40 30 -40 2 Z";
const Merlons: React.FC<{x0: number; x1: number; y: number; count: number}> = ({x0, x1, y, count}) => {
  const mw = (x1 - x0) / (count * 2 - 1);
  return <>{Array.from({length: count}, (_, i) => <rect key={i} x={x0 + i * 2 * mw} y={y - 22} width={mw} height={24} fill={P.white} stroke={P.ink} strokeWidth={5}/>)}</>;
};
const Tower: React.FC<{x0: number; x1: number; top: number; count: number}> = ({x0, x1, top, count}) => (
  <g>
    <rect x={x0} y={top} width={x1 - x0} height={18 - top} fill={P.white} stroke={P.ink} strokeWidth={5}/>
    <Merlons x0={x0 - 9} x1={x1 + 9} y={top - 24} count={count}/>
    <rect x={x0 - 9} y={top - 24} width={x1 - x0 + 18} height={24} fill={P.paper} stroke={P.ink} strokeWidth={5}/>
  </g>
);
const Slit: React.FC<{x: number; y: number}> = ({x, y}) => <path d={`M ${x - 7} ${y + 22} v -30 a 7 7 0 0 1 14 0 v 30 Z`} fill={P.ink}/>;
const BRICKS = [[-244, -150], [-212, -84], [-240, -24], [198, -166], [222, -96], [190, -36], [-64, -276], [26, -258], [-58, -128], [40, -150], [-156, -66], [-128, -18], [108, -78], [134, -24]];
const CastleWalls: React.FC = () => (
  <g strokeLinejoin="round">
    {[-1, 1].map((sd) => (
      <g key={sd}>
        <rect x={sd < 0 ? -172 : 84} y={-118} width={88} height={136} fill={P.paper} stroke={P.ink} strokeWidth={5}/>
        <Merlons x0={sd < 0 ? -168 : 88} x1={sd < 0 ? -88 : 168} y={-118} count={2}/>
      </g>
    ))}
    <Tower x0={-258} x1={-172} top={-196} count={3}/>
    <Tower x0={172} x1={258} top={-196} count={3}/>
    <Tower x0={-84} x1={84} top={-310} count={4}/>
    <Slit x={-215} y={-140}/><Slit x={215} y={-140}/><Slit x={-42} y={-236}/><Slit x={42} y={-236}/>
    {BRICKS.map((b, i) => <path key={i} d={`M ${b[0]} ${b[1]} h 22`} stroke={P.ink} strokeWidth={3.5} strokeLinecap="round" opacity={0.3}/>)}
    {/* the gate, shut */}
    <path d="M -40 18 V -54 A 40 40 0 0 1 40 -54 V 18 Z" fill={WOOD} stroke={P.ink} strokeWidth={6}/>
    <path d="M 0 -93 V 18 M -20 -88 V 18 M 20 -88 V 18" stroke={P.ink} strokeWidth={3.5} opacity={0.6}/>
    <circle cx={-8} cy={-30} r={4.5} fill={P.ink}/><circle cx={8} cy={-30} r={4.5} fill={P.ink}/>
  </g>
);
// How big the flag has to be for its words (two lines when they are long).
const flagBox = (text: string) => {
  const l = text ? layout(text, 330, 52, 40) : {lines: [] as string[], size: 46};
  const size = Math.max(34, l.size);
  return {lines: l.lines, size, fw: l.lines.length ? linesW(l.lines, size) + 58 : 130, fh: l.lines.length > 1 ? size * 2.4 : size * 1.5};
};
// The flag on the main tower: furled until its frame, then it snaps open and keeps flying.
const Flag: React.FC<{box: ReturnType<typeof flagBox>; start: number}> = ({box, start}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const {lines, size, fw, fh} = box, top = -(378 + fh);
  const u = start <= ON ? 1 : pop(f, fps, start, 10, 130);
  const wy = (t: number) => 7 * t * Math.sin(t * 6.4 - f * 0.22), N = 12;
  const up = Array.from({length: N + 1}, (_, i) => `${(i / N * fw).toFixed(1)} ${(top + wy(i / N)).toFixed(1)}`);
  const dn = Array.from({length: N + 1}, (_, i) => `${((1 - i / N) * fw).toFixed(1)} ${(top + fh + wy(1 - i / N)).toFixed(1)}`);
  const tilt = Math.atan2(wy(0.62) - wy(0.38), 0.24 * fw) * 180 / Math.PI;
  return (
    <g>
      <line x1={0} y1={-330} x2={0} y2={top - 4} stroke={P.ink} strokeWidth={7} strokeLinecap="round"/>
      <circle cx={0} cy={top - 8} r={7.5} fill={P.mustard} stroke={P.ink} strokeWidth={4}/>
      {u < 0.04 ? <rect x={-3} y={top} width={15} height={fh} rx={6} fill={P.red} stroke={P.ink} strokeWidth={4}/> : (
        <g transform={`translate(3 0) scale(${u} 1)`}>
          <path d={`M ${up.join(" L ")} L ${dn.join(" L ")} Z`} fill={P.red} stroke={P.ink} strokeWidth={5} strokeLinejoin="round"/>
          {lines.length ? <g transform={`translate(${fw / 2 + 3} ${top + fh / 2 + wy(0.5)}) rotate(${tilt})`}><Lines x={0} y={0} lines={lines} size={size} color={P.white}/></g> : null}
        </g>
      )}
    </g>
  );
};
// A rival shop. With no water it walks right up to the island; the water shoves it out, and it keeps trying the bank.
const Rival: React.FC<{side: number; i: number; moatAt: number}> = ({side, i, moatAt}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const hit = moatAt + 14, wet = f >= hit, out = moatAt <= ON ? 1 : pop(f, fps, hit, 9, 150);
  const ph = (f + i * 53) % 110, lunge = wet && ph < 30 ? Math.sin(ph / 30 * Math.PI) : 0;
  const hop = Math.abs(Math.sin(f / 7 + i * 1.9)) * (wet ? 4 : 8);
  const x = side * (lerp(244, 452, out) - lunge * 18), y = lerp(102, 124, out) - hop - lunge * 5;
  return <g transform={`translate(${x} ${y}) rotate(${Math.sin(f / 9 + i * 2.3) * 3 - side * lunge * 7})`}><StoreIcon size={108} accent={P.gray}/></g>;
};
// A check on a shield: green tick when it holds, amber exclamation mark when it needs watching.
const Check: React.FC<{x: number; y: number; start: number; ok: boolean; lines: string[]; size: number; q: number; cid: string}> = ({x, y, start, ok, lines, size, q, cid}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  if (f < start) return null;
  const u = f - start, sp = pop(f, fps, start, 10, 160);
  const tx = linesW(lines, size) + size * 0.9, w = 40 * q + tx, h = Math.max(linesH(lines, size), 70 * q);
  const rev = start <= ON ? 1 : prog(f, start + 3, 9), draw = start <= ON ? 1 : prog(f, start + 7, 7, Easing.out(Easing.quad));
  const shake = ok ? 0 : 10 * Math.sin(u * 0.9) * Math.exp(-u / 7);
  return (
    <g transform={`translate(${x} ${y})`}>
      <clipPath id={cid}><rect x={0} y={-h} width={(w + 40) * rev} height={h * 2}/></clipPath>
      <g clipPath={`url(#${cid})`}>
        <rect x={8} y={-h / 2} width={w} height={h} rx={8} fill={P.white} stroke={P.ink} strokeWidth={4} style={{filter: "url(#vshadow)"}}/>
        <Lines x={8 + 40 * q + tx / 2 - 2} y={0} lines={lines} size={size}/>
      </g>
      <g transform={`rotate(${shake}) scale(${(0.5 + 0.5 * sp) * q})`} strokeLinejoin="round" strokeLinecap="round">
        <path d={SHIELD} fill={ok ? P.green : P.mustard} stroke={P.ink} strokeWidth={5}/>
        {ok ? (draw > 0 ? <path d="M -19 2 L -5 17 L 21 -15" fill="none" stroke={P.white} strokeWidth={11} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw}/> : null)
          : <g><line x1={0} y1={-24} x2={0} y2={6} stroke={P.ink} strokeWidth={11}/><circle cx={0} cy={27} r={6.5} fill={P.ink}/></g>}
      </g>
    </g>
  );
};

const Castle: React.FC<SP> = ({s, n, T}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const checks = arr(s.checks).filter((c) => c && c.text), nc = checks.length, has = nc > 0;
  const moatAt = when(T, s.moatAt), flagAt = when(T, s.flagAt);
  const ca = checks.map((c) => when(T, c.at));
  // Stamps sit beside a centred castle if they fit there; if not, the castle moves over as it does for checks.
  const boxes = stampBoxes(s), nStamps = boxes.length, sW = Math.max(0, ...boxes.map((b) => b.w)), wide = sW > 580;
  // The castle holds the middle of the stage, larger, until the first check (or stamp) needs the right-hand side.
  const first = has ? Math.min(...ca, ...stampAts(s, T)) : Infinity;
  const mv = wide ? 1 : !has ? 0 : first - 24 < 6 ? 1 : pop(f, fps, first - 24, 18, 90);
  // Fit the castle between the note and the captions; lift it clear of a stamp that would reach under it.
  const flag = flagBox(s.flag ? String(s.flag) : ""), up = 398 + flag.fh;
  const place = (kMax: number, bot: number) => { const k = Math.min(kMax, (bot - 276) / (up + C.DOWN)); return {k, cy: 276 + k * up + (bot - 276 - k * (up + C.DOWN)) / 2}; };
  const big = place(0.96, 895), side = place(0.86, Math.min(895, ...boxes.filter((b) => b.left < 1045).map((b) => b.top)));
  const k = lerp(big.k, side.k, mv), cx = lerp(960, 590, mv), cy = lerp(big.cy, side.cy, mv);
  // Water: wipes round the ring from the back to the front, then ripples for good.
  const fill = moatAt <= ON ? 1 : prog(f, moatAt, 28, Easing.inOut(Easing.cubic));
  const a = fill * Math.PI, pie = [`0 0`];
  for (let i = 0; i <= 24; i++) { const t = -Math.PI / 2 - a + (2 * a * i) / 24; pie.push(`${(900 * Math.cos(t)).toFixed(1)} ${(900 * Math.sin(t)).toFixed(1)}`); }
  const cid = `wca-${n}`;
  const ring = (t: number) => ell(lerp(C.RXI, C.RXO, t), lerp(C.RYI, C.RYO, t), lerp(9, 0, t));
  // Checks: one type size for the whole column; shields and type shrink together if the column would not fit.
  const colTop = 292, colBot = Math.min(880, ...boxes.map((b) => b.top)), colMid = Math.min(556, (colTop + colBot) / 2), room = 2 * Math.min(colMid - colTop, colBot - colMid);
  const col = (q: number) => {
    const lay = checks.map((c) => layout(String(c.text), C.COL_W, 44 * q, 36 * q));
    const size = Math.max(28, Math.min(44 * q, ...lay.map((l) => l.size)));
    const hs = lay.map((l) => Math.max(linesH(l.lines, size), 102 * q));
    return {lay, size, hs, q};
  };
  let cl = col(1);
  for (let pass = 0; pass < 2 && sum(cl.hs) + 14 * (nc - 1) > room; pass++) cl = col(cl.q * room / (sum(cl.hs) + 14 * (nc - 1)));
  const gap = nc > 1 ? clamp((room - sum(cl.hs)) / (nc - 1), 14, 34) : 0;
  let y = colMid - (sum(cl.hs) + gap * (nc - 1)) / 2;
  return (
    <IStage n={n}>
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      <g transform={`translate(${cx} ${cy}) scale(${k})`}>
        <defs><clipPath id={cid}><path d={`M ${pie.join(" L ")} Z`}/></clipPath></defs>
        {/* the ditch, dry until the water comes */}
        <path d={ell(C.RXO, C.RYO)} fill={P.shade} fillOpacity={0.24} stroke={P.ink} strokeWidth={5}/>
        {fill > 0 ? (
          <g clipPath={fill < 1 ? `url(#${cid})` : undefined}>
            <path d={ell(C.RXO, C.RYO)} fill={P.blue} stroke={P.ink} strokeWidth={5}/>
            {[[0.3, "44 76", 1.5], [0.6, "30 90", -1.1], [0.86, "52 98", 1.9]].map((r, i) =>
              <path key={i} d={ring(r[0] as number)} fill="none" stroke={P.white} strokeWidth={5} strokeLinecap="round" opacity={0.85}
                pathLength={i === 2 ? 1500 : 1200} strokeDasharray={r[1] as string} strokeDashoffset={-f * (r[2] as number) + i * 40}/>)}
          </g>
        ) : null}
        {/* the island */}
        <path d={ell(C.RXI, C.RYI, 16)} fill={WOOD} stroke={P.ink} strokeWidth={5}/>
        <path d={ell(C.RXI, C.RYI)} fill={P.green} stroke={P.ink} strokeWidth={5}/>
        <path d="M -30 18 H 30 L 46 74 H -46 Z" fill={WOOD_LT} stroke={P.ink} strokeWidth={4} strokeLinejoin="round"/>
        <Flag box={flag} start={flagAt}/>
        <CastleWalls/>
        <Rival side={-1} i={0} moatAt={moatAt}/>
        <Rival side={1} i={1} moatAt={moatAt}/>
      </g>
      {checks.map((c, i) => { const yy = y + cl.hs[i] / 2; y += cl.hs[i] + gap; return <Check key={i} x={C.COL_X} y={yy} start={ca[i]} ok={!!c.ok} lines={cl.lay[i].lines} size={cl.size} q={cl.q} cid={`${cid}-c${i}`}/>; })}
      {has || wide ? <IStamps s={s} T={T}/> : <IStamps s={s} T={T} x={1806 - Math.max(sW, 300) / 2} y={500 + 57 * Math.max(0, nStamps - 1)}/>}
    </IStage>
  );
};

export const SCENES_WORLD: Record<string, React.FC<SP>> = {store: Store, gears: Gears, castle: Castle};
