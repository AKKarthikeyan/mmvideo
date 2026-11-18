// Bridge scenes for the illustration kit (19 Oct 2026, built for Moat 60 C01 "How Does Visa Make Money If It Lends You Nothing?").
//   bridge  a toll bridge over a river, a toll booth on a small island in the middle, a bank on each side; notes walk
//           across and each sheds a thin sliver into the booth's box (a picture, never a number). Options: one payment's
//           trip, the sliver split three ways, a counting chip, a moat round the island, a loan sack, a storm, an
//           unfinished rival bridge, a free footbridge, a barrier over the booth, traffic that grows
//   loop    two wheels joined by a belt (cards and shops): stuck, each rocking under a "?", or turning ever faster while
//           icons multiply round both wheels; an optional counter under each wheel
// Every word and number on screen comes from the scene's props. The signs on the banks, the booth and the footbridge are
// scenery, like the sign on a shop. No real brand marks, no real person.
import React from "react";
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "../../rt";
import {SP, P, IStage, IHeading, INote, Pop, Icon, NoteIcon, TFn, fit, fmtIN, clamp01} from "./kit";
import {COND, TYPE, Stamp} from "../../voxkit";

// ---------- shared helpers (same rules as Story.tsx) ----------
const WOOD = "#C89B5A", WOOD_LT = "#DDB877", WOOD_DK = "#A87C42", EARTH = "#B98E57", EARTH_DK = "#9C7445";
const RIVER = "#A9C6DD", RIVER_DK = "#86A9C6", NOTE_G = "#BFD9B4", FILL_G = "#8DBF7E", STONE = "#E4D9C2";
const arr = (x: any): any[] => (Array.isArray(x) ? x : []);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const frac = (v: number) => ((v % 1) + 1) % 1;
const prog = (f: number, start: number, dur: number, ease: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [start, start + Math.max(1, dur)], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
const pop = (f: number, fps: number, start: number, damping = 11, stiffness = 150) =>
  f < start ? 0 : spring({frame: f - start, fps, config: {damping, stiffness, mass: 0.8}});
// No `at`, or the number 0, means "on from the start": far enough back that every spring has settled.
const ON = -1000;
const when = (T: TFn, x: any) => (x == null || x === 0 ? ON : T(x));
const tw = (text: string, size: number) => text.length * size * 0.52;   // rough width of Oswald caps
const Txt: React.FC<{x: number; y: number; text: string; size: number; color?: string; anchor?: "start" | "middle" | "end"; font?: string}> =
  ({x, y, text, size, color = P.ink, anchor = "middle", font = COND}) =>
  <text x={x} y={y} fontFamily={font} fontWeight={700} fontSize={size} textAnchor={anchor} fill={color} letterSpacing={font === COND ? 1 : 0}>{text}</text>;
const idOf = (b: any) => String(b?.key ?? "x").replace(/[^A-Za-z0-9_-]/g, "");
const ell = (cx: number, cy: number, rx: number, ry: number) => `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
// A paper label with an ink border, sized to its words.
const Label: React.FC<{x: number; y: number; start: number; text: string; size?: number; fill?: string; color?: string; rot?: number}> =
  ({x, y, start, text, size = 44, fill = P.white, color = P.ink, rot = 0}) => {
  const w = tw(text, size) + size * 0.95, h = size * 1.5;
  return (
    <Pop x={x} y={y} start={start} rot={rot}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill={fill} stroke={P.ink} strokeWidth={4} style={{filter: "url(#vshadow)"}}/>
      <Txt x={0} y={size * 0.36} text={text} size={size} color={color}/>
    </Pop>
  );
};
// A sign board on two short posts (scenery): stands with its foot at (x, y).
const Sign: React.FC<{x: number; y: number; start: number; text: string; size?: number; fill?: string; color?: string; post?: number}> =
  ({x, y, start, text, size = 42, fill = P.paper, color = P.ink, post = 22}) => {
  const w = tw(text, size) + size * 1.0, h = size * 1.45;
  return (
    <Pop x={x} y={y} start={start} from={0.4}>
      {[-1, 1].map((sd) => <rect key={sd} x={sd * w * 0.28 - 5} y={-post} width={10} height={post} fill={WOOD_DK} stroke={P.ink} strokeWidth={3}/>)}
      <rect x={-w / 2} y={-post - h} width={w} height={h} rx={6} fill={fill} stroke={P.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
      <rect x={-w / 2 + 7} y={-post - h + 7} width={w - 14} height={h - 14} rx={4} fill="none" stroke={P.ink} strokeWidth={2} opacity={0.4}/>
      <Txt x={0} y={-post - h / 2 + size * 0.36} text={text} size={size} color={color}/>
    </Pop>
  );
};
// Stamps for these scenes: smaller than the kit's, in the sky at the top right, so they never cover the bridge.
const BStamps: React.FC<{s: any; T: TFn; cx?: number; y?: number; size?: number}> = ({s, T, cx, y = 345, size = 46}) => <>{arr(s.stamps).filter((st) => st && st.text).map((st: any, i: number) => {
  const text = String(st.text), sz = fit(text, size, 760, 0.56), sw = text.length * sz * 0.55 + 70;
  return <Stamp key={i} x={st.x ?? cx ?? 1815 - sw / 2} y={st.y ?? y + i * 100} start={when(T, st.at)} text={text} size={sz} rot={i % 2 ? 3 : -3}/>;
})}</>;

// A walking note: the kit's plain note on two stick legs. (x, g) is the point between its feet.
const Walker: React.FC<{x: number; g: number; size: number; ph: number; op?: number; hi?: boolean; gray?: boolean}> = ({x, g, size, ph, op = 1, hi = false, gray = false}) => {
  if (op <= 0.01) return null;
  const hh = 0.38 * size, leg = 0.3 * size, cy = g - leg - hh - Math.abs(Math.sin(ph)) * size * 0.04, a = Math.sin(ph) * 0.55;
  return (
    <g opacity={op}>
      {[-1, 1].map((sd) => {
        const hx = x + sd * 0.3 * size, ha = a * sd;
        return <line key={sd} x1={hx} y1={cy + hh - 2} x2={hx + Math.sin(ha) * leg} y2={cy + hh + Math.cos(ha) * leg} stroke={P.ink} strokeWidth={Math.max(3, size * 0.06)} strokeLinecap="round"/>;
      })}
      {hi ? <rect x={x - 0.78 * size - 9} y={cy - hh - 9} width={1.56 * size + 18} height={2 * hh + 18} rx={10} fill={P.gold} stroke={P.ink} strokeWidth={3}/> : null}
      <NoteIcon x={x} y={cy} size={size} label="₹" color={gray ? "#D6D6D0" : NOTE_G}/>
    </g>
  );
};
// One sliver: a thin strip of note, falling or lying.
const Sliver: React.FC<{x: number; y: number; w: number; rot?: number; op?: number; h?: number}> = ({x, y, w, rot = 0, op = 1, h = 42}) =>
  <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={Math.min(2, w / 2)} fill={NOTE_G} stroke={P.ink} strokeWidth={2} opacity={op} transform={`rotate(${rot} ${x} ${y})`}/>;
const Cloud: React.FC<{x: number; y: number; k: number; fill?: string; op?: number}> = ({x, y, k, fill = P.white, op = 0.9}) =>
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <path d="M -90 20 a 34 34 0 0 1 30 -48 a 46 46 0 0 1 84 -6 a 32 32 0 0 1 56 22 a 30 30 0 0 1 2 32 Z" fill={fill} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" opacity={op}/>
  </g>;

// =====================================================================================================
// bridge
// =====================================================================================================
// Ground and deck level, banks, river, island, the booth in the middle and the two bank buildings.
const BR = {GY: 640, DECK: 34, L1: 470, R0: 1450, WL: 740, BOT: 925, BX: 960, IY: 815, LBX: 255, RBX: 1665, FOOT: 878, X0: 40, X1: 1880,
  BOX_X0: 884, BOX_X1: 1036, BOX_Y0: 728, BOX_Y1: 814, PIVX: 886, PIVY: 548, ARM: 340};
const CROSS = (BR.BX - BR.X0) / (BR.X1 - BR.X0);   // where on its trip a note passes the booth (0..1)
const ICON_SIZE = 210;

const Booth: React.FC<{label: string; at: number; lit: number}> = ({label, at, lit}) => {
  const f = useCurrentFrame();
  const glow = 0.55 + 0.25 * Math.sin(f * 0.21) + 0.2 * lit;
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {/* the kiosk stands behind the lane */}
      <rect x={BR.BX - 66} y={BR.GY - 168} width={132} height={168} fill={P.white} stroke={P.ink} strokeWidth={5}/>
      <rect x={BR.BX - 48} y={BR.GY - 148} width={96} height={58} rx={4} fill={P.gold} stroke={P.ink} strokeWidth={4} opacity={0.6 + 0.4 * glow}/>
      <line x1={BR.BX} y1={BR.GY - 148} x2={BR.BX} y2={BR.GY - 90} stroke={P.ink} strokeWidth={3}/>
      <rect x={BR.BX - 66} y={BR.GY - 76} width={132} height={14} fill={P.red} stroke={P.ink} strokeWidth={4}/>
      {/* roof */}
      <path d={`M ${BR.BX - 92} ${BR.GY - 166} L ${BR.BX} ${BR.GY - 218} L ${BR.BX + 92} ${BR.GY - 166} Z`} fill={P.red} stroke={P.ink} strokeWidth={5}/>
      {/* lamp on a short pole: always lit */}
      <line x1={BR.BX + 78} y1={BR.GY - 150} x2={BR.BX + 78} y2={BR.GY - 236} stroke={P.ink} strokeWidth={6}/>
      <circle cx={BR.BX + 78} cy={BR.GY - 244} r={30 * glow} fill={P.gold} opacity={0.35}/>
      <circle cx={BR.BX + 78} cy={BR.GY - 244} r={12} fill={P.gold} stroke={P.ink} strokeWidth={4}/>
      {label ? <Sign x={BR.BX} y={BR.GY - 206} start={at} text={label} size={46} fill={P.mustard} post={18}/> : null}
    </g>
  );
};

const Bridge: React.FC<SP> = ({s, n, T, b}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const id = idOf(b);
  // ---- props -> times
  const tr = s.traffic || null, rate = tr ? clamp(Number(tr.rate ?? 1), 1, 3) : 0;
  const k0 = rate ? [0, 3, 5, 7][Math.round(rate)] : 0, CT = rate ? [0, 165, 135, 110][Math.round(rate)] : 150;
  const trAt = tr ? when(T, tr.at) : 1e9, s0 = trAt <= ON ? -6000 : trAt;
  const growAt = s.grow ? when(T, s.grow.at) : 1e9;
  const slAt = s.sliver ? when(T, s.sliver.at) : 1e9;
  const foot = s.foot || null, footAt = foot ? when(T, foot.at) : 1e9;
  const busy = foot && foot.busy ? foot.busy : null, busyAt = busy ? when(T, busy.at) : 1e9, share = busy ? clamp(Number(busy.share ?? 0.5), 0, 1) : 0;
  const bar = s.bar || null, barAt = bar ? when(T, bar.at) : 1e9, liftAt = bar && bar.lift ? when(T, bar.lift) : 1e9;
  const moatAt = s.moatAt != null ? when(T, s.moatAt) : 1e9;
  const left = s.left || null, right = s.right || null, booth = s.booth || {};
  const trip = s.trip || null;
  // ---- the barrier: up (90 degrees) until `at`, then down (0); `lift` raises it halfway
  const down = bar ? (barAt <= ON ? 1 : prog(f, barAt, 16, Easing.out(Easing.bounce))) : 0;
  const lift = bar ? (liftAt <= ON ? 1 : prog(f, liftAt, 18, Easing.inOut(Easing.cubic))) : 0;
  const ang = 90 * (1 - down) + 42 * lift * down;
  const thin = bar && down > 0.5 ? (lift > 0.5 ? 0.62 : 0.36) : 1;       // slivers get thinner under the barrier
  const slW = 10 * thin;
  // ---- main traffic: k0 notes on a loop, plus k0 more after `grow`; a share leaves for the footbridge after `busy`
  type WK = {u: number; x: number; op: number; vis: number};
  const mains: WK[] = [];
  const addWalker = (ph: number, vis: number, gone: number) => {
    const u = (f - s0) / CT + ph, x = BR.X0 + (BR.X1 - BR.X0) * frac(u);
    const edge = clamp01((x - BR.X0) / 90) * clamp01((BR.X1 - x) / 90);
    const op = edge * (vis <= ON ? 1 : prog(f, vis, 12)) * (1 - (gone < 1e8 ? prog(f, gone, 14) : 0));
    mains.push({u, x, op, vis});
  };
  const leaves = (i: number) => busy ? Math.floor((i + 1) * share + 1e-6) > Math.floor(i * share + 1e-6) : false;
  if (rate && f >= s0) {
    for (let i = 0; i < k0; i++) addWalker(i / k0, s0, leaves(i) ? busyAt : 1e9);
    if (s.grow) for (let i = 0; i < k0; i++) addWalker((i + 0.5) / k0, Math.max(s0, growAt), leaves(i + k0) ? busyAt : 1e9);
  }
  // Slivers: each note passing the booth after `sliver.at` drops one into the box. Times are worked out, not stored.
  const falling: {age: number}[] = [];
  let dropped = 0;
  const from = Math.max(slAt <= ON ? 0 : slAt, 0);
  mains.forEach((w, i) => {
    const ph = w.u - (f - s0) / CT;
    const start = Math.max(slAt <= ON ? -600 : slAt, w.vis <= ON ? -600 : w.vis);
    const m = Math.floor((f - s0) / CT + ph - CROSS), fc = s0 + (m + CROSS - ph) * CT;
    if (f - fc < 16 && fc >= start && w.op > 0.3) falling.push({age: f - fc});
    const lo = Math.ceil((Math.max(start, from) - s0) / CT - CROSS + ph), hi = Math.floor((f - 14 - s0) / CT - CROSS + ph);
    dropped += Math.max(0, hi - lo + 1);
  });
  // ---- the trip of one payment
  const tAt = trip && trip.at != null ? when(T, trip.at) : null;
  const yesAt = trip && trip.yes ? Math.max(T(trip.yes), tAt != null ? tAt + 46 : -1e9) : null;
  const payAt = trip && trip.pay ? T(trip.pay) : null;
  const PAYD = 110, PX1 = BR.RBX - 110;
  const payCross = payAt != null ? payAt + Math.round(PAYD * (BR.BX - BR.LBX) / (PX1 - BR.LBX)) : null;
  const envEnd = tAt != null ? (yesAt != null ? yesAt + 4 : tAt + 46) : 0;
  if (payCross != null && f >= payCross && f - payCross < 16) falling.push({age: f - payCross});
  if (payCross != null && f >= payCross + 14) dropped += 1;
  const split = s.split || null, splitPay = split && split.pay ? when(T, split.pay) : 1e9;
  const boxBase = slAt <= ON ? 0.34 : 0.1;
  const boxFill = clamp(boxBase + 0.022 * thin * dropped + (split && f >= splitPay + 36 ? 0.03 : 0), 0, 0.9);
  const lit = falling.length ? 1 : 0;
  // ---- footbridge walkers
  const fk = 2 + (busy ? Math.round(k0 * share) + (s.grow ? Math.round(k0 * share) : 0) : 0);
  const footP = foot ? (footAt <= ON ? 1 : prog(f, footAt, 18, Easing.out(Easing.cubic))) : 0;
  const F0 = 540, F1 = 1380;
  // ---- moat round the island: wipes from the back, then ripples (as in the castle scene)
  const fill = moatAt <= ON ? 1 : moatAt > 1e8 ? 0 : prog(f, moatAt, 28, Easing.inOut(Easing.cubic));
  const a = fill * Math.PI, pie = [`${BR.BX} ${BR.IY}`];
  for (let i = 0; i <= 24; i++) { const t = -Math.PI / 2 - a + (2 * a * i) / 24; pie.push(`${(BR.BX + 900 * Math.cos(t)).toFixed(1)} ${(BR.IY + 900 * Math.sin(t)).toFixed(1)}`); }
  const MRX = 300, MRY = 58;
  // ---- buildings on the banks
  const bld = (side: any, x: number) => {
    if (!side) return null;
    const at = when(T, side.at), size = ICON_SIZE, icon = String(side.icon || "bank");
    const u = at <= ON ? 1 : pop(f, fps, at, 12, 140);
    if (f < at) return null;
    return <g>
      <g transform={`translate(${x} ${BR.GY}) scale(${0.5 + 0.5 * u}) translate(${-x} ${-BR.GY})`}>
        <ellipse cx={x} cy={BR.GY + 4} rx={size * 0.5} ry={10} fill={P.shade} opacity={0.22}/>
        <Icon name={icon} x={x} y={BR.GY - 0.42 * size} size={size}/>
      </g>
      {/* the name plate sits on the bank below the building, so the sky stays clear for stamps */}
      {side.label ? <Sign x={x} y={BR.GY + 104} start={at} text={String(side.label)} size={fit(String(side.label), 40, 320)} post={0}/> : null}
    </g>;
  };
  // ---- loan sack, storm, rival
  const loan = s.loan || null, loanAt = loan ? when(T, loan.at) : 1e9;
  const storm = s.storm || null, stormAt = storm ? when(T, storm.at) : 1e9;
  const rival = s.rival || null, rivalAt = rival ? when(T, rival.at) : 1e9;
  const count = s.count && s.count.to != null ? s.count : null, cAt = count ? when(T, count.at) : 1e9;
  const waveX = (f * 1.4) % 160;
  return (
    <IStage n={n}>
      <defs><clipPath id={`wbm-${id}`}><path d={`M ${pie.join(" L ")} Z`}/></clipPath></defs>
      {/* clouds drift across the sky, behind the tag */}
      {[[300, 300, 0.9, 0.16], [1250, 250, 0.75, 0.11]].map((c, i) => <Cloud key={i} x={((c[0] + f * c[3]) % 2100) - 90} y={c[1]} k={c[2]}/>)}
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      {/* the river, with drifting wave lines */}
      <rect x={480} y={BR.WL} width={960} height={BR.BOT - BR.WL} fill={RIVER} stroke={P.ink} strokeWidth={5}/>
      {[0, 1, 2, 3].map((r) => Array.from({length: 7}, (_, i) => {
        const x = 520 + i * 160 + ((waveX + r * 60) % 160) - 80, y = BR.WL + 28 + r * 44;
        return x < 500 || x > 1380 ? null : <path key={`${r}-${i}`} d={`M ${x} ${y} q 20 -10 40 0 t 40 0`} fill="none" stroke={RIVER_DK} strokeWidth={4} strokeLinecap="round" opacity={0.8}/>;
      }))}
      {/* the moat round the island */}
      {fill > 0 ? (
        <g clipPath={fill < 1 ? `url(#wbm-${id})` : undefined}>
          <path d={ell(BR.BX, BR.IY, MRX, MRY)} fill={P.blue} stroke={P.ink} strokeWidth={5}/>
          {[[0.55, "40 70", 1.4], [0.8, "60 90", -1.1]].map((r, i) =>
            <path key={i} d={ell(BR.BX, BR.IY + 4, lerp(150, MRX, r[0] as number), lerp(28, MRY, r[0] as number))} fill="none" stroke={P.white} strokeWidth={5} strokeLinecap="round" opacity={0.85}
              pathLength={1200} strokeDasharray={r[1] as string} strokeDashoffset={-f * (r[2] as number) + i * 40}/>)}
        </g>
      ) : null}
      {/* the banks */}
      <path d={`M 90 ${BR.GY} H ${BR.L1} L 552 ${BR.WL} L 566 ${BR.BOT} H 90 Z`} fill={EARTH} stroke={P.ink} strokeWidth={5} strokeLinejoin="round"/>
      <path d={`M 1830 ${BR.GY} H ${BR.R0} L 1368 ${BR.WL} L 1354 ${BR.BOT} H 1830 Z`} fill={EARTH} stroke={P.ink} strokeWidth={5} strokeLinejoin="round"/>
      {[[180, 760], [330, 860], [1560, 780], [1720, 880], [470, 820], [1440, 860]].map((p, i) => <ellipse key={i} cx={p[0]} cy={p[1]} rx={18} ry={11} fill={EARTH_DK} stroke={P.ink} strokeWidth={3}/>)}
      {[[100, 700, 120], [1600, 720, 200]].map((p, i) => <path key={i} d={`M ${p[0]} ${p[1]} C ${p[0] + p[2] * 0.4} ${p[1] - 12}, ${p[0] + p[2] * 0.7} ${p[1] + 14}, ${p[0] + p[2]} ${p[1]}`} fill="none" stroke={EARTH_DK} strokeWidth={4} opacity={0.6}/>)}
      <rect x={90} y={BR.GY - 12} width={BR.L1 - 90} height={18} fill={P.green} stroke={P.ink} strokeWidth={5}/>
      <rect x={BR.R0} y={BR.GY - 12} width={1830 - BR.R0} height={18} fill={P.green} stroke={P.ink} strokeWidth={5}/>
      {/* the island, the pier and the booth's box */}
      <path d={ell(BR.BX, BR.IY + 12, 150, 30)} fill={WOOD} stroke={P.ink} strokeWidth={5}/>
      <path d={ell(BR.BX, BR.IY, 150, 30)} fill={P.green} stroke={P.ink} strokeWidth={5}/>
      <rect x={BR.BX - 42} y={BR.GY + BR.DECK} width={84} height={BR.IY - BR.GY - BR.DECK} fill={STONE} stroke={P.ink} strokeWidth={5}/>
      <g>
        <rect x={BR.BOX_X0} y={BR.BOX_Y0} width={BR.BOX_X1 - BR.BOX_X0} height={BR.BOX_Y1 - BR.BOX_Y0} rx={6} fill={P.white} stroke={P.ink} strokeWidth={5}/>
        <rect x={BR.BOX_X0 + 6} y={BR.BOX_Y1 - 6 - (BR.BOX_Y1 - BR.BOX_Y0 - 12) * boxFill} width={BR.BOX_X1 - BR.BOX_X0 - 12} height={(BR.BOX_Y1 - BR.BOX_Y0 - 12) * boxFill} fill={FILL_G}/>
        {Array.from({length: 12}, (_, i) => <line key={i} x1={BR.BOX_X0 + 14 + i * 11} y1={BR.BOX_Y1 - 8} x2={BR.BOX_X0 + 10 + i * 11} y2={BR.BOX_Y1 - 6 - (BR.BOX_Y1 - BR.BOX_Y0 - 14) * boxFill} stroke={P.ink} strokeWidth={1.5} opacity={boxFill > 0.05 ? 0.35 : 0}/>)}
        <rect x={BR.BOX_X0} y={BR.BOX_Y0} width={BR.BOX_X1 - BR.BOX_X0} height={BR.BOX_Y1 - BR.BOX_Y0} rx={6} fill="none" stroke={P.ink} strokeWidth={5}/>
      </g>
      {/* the two arches and the deck */}
      <path d={`M ${BR.L1} ${BR.GY + BR.DECK} H ${BR.BX - 42} V ${BR.WL} Q 700 642 552 ${BR.WL} L ${BR.L1} ${BR.GY + BR.DECK} Z`} fill={STONE} stroke={P.ink} strokeWidth={5} strokeLinejoin="round"/>
      <path d={`M ${BR.R0} ${BR.GY + BR.DECK} H ${BR.BX + 42} V ${BR.WL} Q 1220 642 1368 ${BR.WL} L ${BR.R0} ${BR.GY + BR.DECK} Z`} fill={STONE} stroke={P.ink} strokeWidth={5} strokeLinejoin="round"/>
      {[[600, 668], [700, 676], [800, 668], [1120, 668], [1220, 676], [1320, 668]].map((p, i) => <path key={i} d={`M ${p[0]} ${p[1]} h 30`} stroke={P.ink} strokeWidth={3.5} strokeLinecap="round" opacity={0.3}/>)}
      {/* railing behind the lane */}
      <line x1={BR.L1 - 20} y1={BR.GY - 52} x2={BR.R0 + 20} y2={BR.GY - 52} stroke={P.ink} strokeWidth={6} strokeLinecap="round"/>
      {Array.from({length: 15}, (_, i) => { const x = BR.L1 - 10 + i * ((BR.R0 - BR.L1 + 20) / 14); return Math.abs(x - BR.BX) < 80 ? null : <line key={i} x1={x} y1={BR.GY - 52} x2={x} y2={BR.GY} stroke={P.ink} strokeWidth={5}/>; })}
      <rect x={BR.L1 - 30} y={BR.GY} width={BR.R0 - BR.L1 + 60} height={BR.DECK} fill={WOOD_LT} stroke={P.ink} strokeWidth={5}/>
      <rect x={BR.BX - 14} y={BR.GY + 6} width={28} height={8} rx={3} fill={P.ink}/>
      <Booth label={booth.label ? String(booth.label) : ""} at={when(T, booth.at)} lit={lit}/>
      {/* buildings on the banks */}
      {bld(left, BR.LBX)}
      {bld(right, BR.RBX)}
      {/* storm over the left bank: grey cloud and rain; the booth stays lit */}
      {storm && f >= stormAt ? (() => {
        const u = stormAt <= ON ? 1 : prog(f, stormAt, 20, Easing.out(Easing.cubic));
        return <g opacity={u}>
          {Array.from({length: 11}, (_, i) => {
            const x = 110 + i * 32, t = ((f * 9 + i * 37) % 260);
            return <line key={i} x1={x} y1={350 + t} x2={x - 8} y2={378 + t} stroke={P.blue} strokeWidth={4} strokeLinecap="round" opacity={350 + t < BR.GY - 20 ? 0.8 : 0}/>;
          })}
          <Cloud x={lerp(80, 300, u)} y={320} k={1.9} fill={P.gray} op={1}/>
          <Cloud x={lerp(-40, 180, u)} y={300} k={1.3} fill="#A6A6A6" op={1}/>
        </g>;
      })() : null}
      {/* the barrier's post (the arm is drawn over the traffic) */}
      {bar ? <rect x={BR.PIVX - 8} y={BR.PIVY} width={16} height={BR.GY - BR.PIVY} fill={P.ink}/> : null}
      {/* the traffic */}
      {mains.map((w, i) => <Walker key={i} x={w.x} g={BR.GY} size={76} ph={w.u * CT * 0.42} op={w.op}/>)}
      {/* one payment's trip: a request goes over, a YES comes back, then one note crosses */}
      {tAt != null && f >= tAt && f < envEnd ? (() => {
        const p1 = prog(f, tAt, 18, Easing.inOut(Easing.quad)), p2 = prog(f, tAt + 24, 18, Easing.inOut(Easing.quad));
        const x = f < tAt + 24 ? lerp(BR.RBX, BR.BX, p1) : lerp(BR.BX, BR.LBX + 110, p2), y = BR.GY - 46 - Math.sin((f < tAt + 24 ? p1 : p2) * Math.PI) * 40;
        const wig = f >= tAt + 42 ? Math.sin(f * 0.35) * 10 : Math.sin(f * 0.6) * 6;   // waiting to be checked
        return <g transform={`translate(${x} ${y}) rotate(${wig})`}>
          <rect x={-44} y={-28} width={88} height={56} rx={4} fill={P.white} stroke={P.ink} strokeWidth={4}/>
          <path d="M -44 -28 L 0 6 L 44 -28" fill="none" stroke={P.ink} strokeWidth={4} strokeLinejoin="round"/>
        </g>;
      })() : null}
      {yesAt != null && f >= yesAt ? (() => {
        const u = pop(f, fps, yesAt, 9, 170), mv = prog(f, yesAt + 14, 46, Easing.inOut(Easing.cubic));
        const x = lerp(BR.LBX, BR.RBX - 150, mv), y = BR.GY - 70 - Math.sin(mv * Math.PI) * 50;
        return <g transform={`translate(${x} ${y}) scale(${0.4 + 0.6 * u})`}>
          <rect x={-72} y={-40} width={144} height={80} rx={10} fill={P.green} stroke={P.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
          <Txt x={0} y={18} text="YES" size={50} color={P.white}/>
        </g>;
      })() : null}
      {payAt != null && f >= payAt ? (() => {
        const u = prog(f, payAt, PAYD, Easing.linear), x = lerp(BR.LBX, PX1, u);
        return <Walker x={x} g={BR.GY} size={92} ph={u < 1 ? (f - payAt) * 0.42 * 2 : 0} op={clamp01((f - payAt) / 6)} hi/>;
      })() : null}
      {/* slivers falling through the slot into the box */}
      {falling.map((d, i) => {
        const u = prog(d.age, 0, 14, Easing.in(Easing.quad)) as number;
        return <Sliver key={i} x={BR.BX + Math.sin(d.age * 0.7) * 6} y={lerp(BR.GY - 30, BR.BOX_Y0 + 14, u)} w={slW} h={54} rot={d.age * 9} op={d.age > 13 ? 0 : 1}/>;
      })}
      {/* the split, as Visa's report tells it: the shop's fee sits with the shop's bank; at `at` it is shared with the
          card's bank; at `pay` each bank sends Visa its own, thinner piece, set separately (never cut from the shop's fee) */}
      {split ? (() => {
        const labels = arr(split.labels).map(String);
        const feeAt = split.fee != null ? when(T, split.fee) : ON, shAt = when(T, split.at), pAt = split.pay ? when(T, split.pay) : 1e9;
        const rx = BR.RBX - 150, lx = BR.LBX + 150, gy = BR.GY - 34;
        if (f < feeAt) return null;
        const appear = feeAt <= ON ? 1 : pop(f, fps, feeAt, 10, 160);
        const u = shAt <= ON ? 1 : prog(f, shAt, 30, Easing.inOut(Easing.cubic));
        const parts: React.ReactNode[] = [];
        // the shop's fee: one wide sliver at the shop's bank, then two halves
        if (f < shAt) parts.push(<Sliver key="fee" x={rx} y={gy - 16} w={34 * appear} h={86}/>);
        else {
          parts.push(<Sliver key="keep" x={rx + 8} y={gy - 16} w={17} h={86}/>);
          parts.push(<Sliver key="part" x={lerp(rx - 6, lx, u)} y={lerp(gy - 10, gy - 10, u) - Math.sin(u * Math.PI) * 330} w={17} h={86} rot={u * -360}/>);
        }
        // each bank pays Visa its own fee: two thinner pieces fly into the booth's box
        if (f >= pAt) [lx, rx].forEach((x0, i) => {
          const t = prog(f, pAt + i * 8, 28, Easing.inOut(Easing.cubic));
          if (t < 1) parts.push(<Sliver key={`v${i}`} x={lerp(x0, BR.BX + (i ? 12 : -12), t)} y={lerp(gy - 40, BR.BOX_Y0 + 12, t) - Math.sin(t * Math.PI) * 260} w={6} h={60} rot={t * (i ? -300 : 300)}/>);
        });
        // a word tag only where no building stands to say whose piece it is
        if (!left && labels[1]) parts.push(<Label key="ll" x={lx} y={gy - 140} start={shAt} text={labels[1]} size={34}/>);
        if (!right && labels[0]) parts.push(<Label key="rl" x={rx} y={gy - 140} start={feeAt} text={labels[0]} size={34}/>);
        return <g>{parts}</g>;
      })() : null}
      {/* the barrier arm and its label */}
      {bar ? <g>
        <g transform={`translate(${BR.PIVX} ${BR.PIVY}) rotate(${ang})`}>
          <rect x={-BR.ARM} y={-12} width={BR.ARM} height={24} rx={6} fill={P.white} stroke={P.ink} strokeWidth={4}/>
          {Array.from({length: 6}, (_, i) => <rect key={i} x={-BR.ARM + 14 + i * 56} y={-10} width={28} height={20} fill={P.red}/>)}
          <rect x={-BR.ARM} y={-12} width={BR.ARM} height={24} rx={6} fill="none" stroke={P.ink} strokeWidth={4}/>
        </g>
        <circle cx={BR.PIVX} cy={BR.PIVY} r={14} fill={P.mustard} stroke={P.ink} strokeWidth={4}/>
        {bar.label && down > 0.5 ? <Label x={BR.PIVX - 190} y={BR.PIVY - 74 - lift * 60} start={barAt <= ON ? ON : barAt + 10} text={String(bar.label)} size={38} fill={P.white}/> : null}
      </g> : null}
      {/* the loan: a heavy sack thumps down on the left bank */}
      {loan && f >= loanAt ? (() => {
        const d = loanAt <= ON ? 1 : prog(f, loanAt, 12, Easing.in(Easing.quad)), land = f - loanAt - 12;
        const sq = loanAt > ON && land >= 0 && land < 14 ? 0.14 * Math.sin(land * 0.7) * Math.exp(-land / 5) : 0;
        const x = BR.LBX + 190, y = lerp(BR.GY - 380, BR.GY, d), lab = String(loan.label || ""), ls = fit(lab, 30, 150, 0.5);
        return <g transform={`translate(${x} ${y}) scale(${1 + sq} ${1 - sq})`} strokeLinejoin="round" strokeLinecap="round">
          <ellipse cx={0} cy={4} rx={90} ry={12} fill={P.shade} opacity={0.25}/>
          <path d="M -86 0 C -104 -70 -70 -124 -30 -132 L -40 -158 L 40 -158 L 30 -132 C 70 -124 104 -70 86 0 Z" fill={WOOD_LT} stroke={P.ink} strokeWidth={5}/>
          <path d="M -34 -136 Q 0 -126 34 -136" fill="none" stroke={P.ink} strokeWidth={6}/>
          {lab ? <Txt x={0} y={-50} text={lab} size={ls}/> : null}
        </g>;
      })() : null}
      {/* the unfinished rival bridge downstream: empty, and a plank drops into the water */}
      {rival && f >= rivalAt ? (() => {
        const planks = 6, x0 = 1356, pw = 58, RY = 846;
        const drop = rivalAt <= ON ? 1 : prog(f, rivalAt + 46, 22, Easing.in(Easing.quad));
        return <g>
          {[1290, 1150].map((x, i) => {
            const u = rivalAt <= ON ? 1 : prog(f, rivalAt + i * 6, 12);
            return <rect key={i} x={x - 10} y={RY + 14 + (1 - u) * 60} width={20} height={(BR.BOT - RY - 14) * u} fill={P.gray} stroke={P.ink} strokeWidth={4}/>;
          })}
          <path d={`M 1366 ${RY - 50} L ${x0 - (planks - 1) * (pw + 6) + 10} ${RY - 50}`} stroke={P.gray} strokeWidth={6} strokeLinecap="round" opacity={rivalAt <= ON ? 1 : prog(f, rivalAt + 30, 10)}/>
          {Array.from({length: planks}, (_, i) => {
            const t = rivalAt <= ON ? 1 : prog(f, rivalAt + i * 5, 10, Easing.out(Easing.back(1.4)));
            if (t <= 0) return null;
            const x = x0 - i * (pw + 6) - pw, last = i === planks - 1;
            const dy = last ? drop * 80 : 0, rot = last ? drop * -50 : 0, op = last ? 1 - clamp01((drop - 0.7) / 0.3) : 1;
            return <rect key={i} x={x} y={RY - 8 * t + dy} width={pw} height={20} fill="#B8B2A6" stroke={P.ink} strokeWidth={4} opacity={op} transform={`rotate(${rot} ${x + pw / 2} ${RY})`}/>;
          })}
          {drop > 0.9 ? [0, 1].map((r) => { const t = clamp01((f - rivalAt - 66 - r * 8) / 30); return t > 0 && t < 1 ? <path key={r} d={ell(x0 - (planks - 1) * (pw + 6) - pw / 2, RY + 66, 24 + 70 * t, 7 + 15 * t)} fill="none" stroke={P.white} strokeWidth={4} opacity={1 - t}/> : null; }) : null}
          {rival.label ? <Label x={1610} y={866} start={rivalAt <= ON ? ON : rivalAt + 8} text={String(rival.label)} size={38} fill={P.white}/> : null}
        </g>;
      })() : null}
      {/* the free footbridge in front, with its own walkers */}
      {foot && f >= footAt ? (() => {
        const x1 = lerp(F0, F1, footP), CTF = 120;
        const ws = [];
        for (let i = 0; i < fk; i++) {
          const base = i < 2, vis = base ? footAt + 10 : busyAt;
          if (!base && f < busyAt) continue;
          const ph = base ? i / 2 : (i - 2 + 0.25) / Math.max(1, fk - 2);
          const u = (f - (footAt <= ON ? -6000 : footAt)) / CTF + ph, x = F0 - 20 + (F1 - F0 + 40) * frac(u);
          const op = clamp01((x - F0 + 20) / 50) * clamp01((F1 + 20 - x) / 50) * (vis <= ON ? 1 : prog(f, vis, 12)) * (x <= x1 ? 1 : 0);
          ws.push(<Walker key={i} x={x} g={BR.FOOT} size={52} ph={u * CTF * 0.5} op={op}/>);
        }
        return <g>
          {[F0 + 10, 960, F1 - 10].map((x, i) => x <= x1 + 4 ? <rect key={i} x={x - 6} y={BR.FOOT} width={12} height={BR.BOT - BR.FOOT} fill={WOOD_DK} stroke={P.ink} strokeWidth={3}/> : null)}
          <path d={`M ${F0} ${BR.FOOT - 40} Q ${(F0 + x1) / 2} ${BR.FOOT - 22} ${x1} ${BR.FOOT - 40}`} fill="none" stroke={P.ink} strokeWidth={4}/>
          {ws}
          <rect x={F0} y={BR.FOOT} width={Math.max(0, x1 - F0)} height={16} fill={WOOD_LT} stroke={P.ink} strokeWidth={4}/>
          {foot.label ? <Sign x={460} y={BR.FOOT + 6} start={footAt} text={String(foot.label)} size={fit(String(foot.label), 38, 200)} fill={P.green} color={P.white} post={14}/> : null}
        </g>;
      })() : null}
      {/* the counting chip, joined to the booth by a dashed line */}
      {count && f >= cAt ? (() => {
        const p = cAt <= ON ? 1 : prog(f, cAt, 22), u = cAt <= ON ? 1 : pop(f, fps, cAt, 11, 150);
        const pre = String(count.prefix ?? ""), suf = String(count.suffix ?? ""), d = Number(count.decimals ?? 0);
        const full = `${pre}${fmtIN(Number(count.to), d)}${suf}`, cur = `${pre}${fmtIN(Number(count.to) * p, d)}${suf}`;
        const size = fit(full, 74, 600), lab = count.label ? String(count.label) : "";
        const w = Math.max(tw(full, size), lab.length * 17) + 70, h = lab ? size * 1.9 : size * 1.5, cx = 540, cy = 290;
        return <g>
          <path d={`M ${cx + w / 2 - 20} ${cy + h / 2 - 6} Q ${BR.BX - 120} ${cy + h / 2 + 30} ${BR.BX - 70} ${BR.GY - 262}`} fill="none" stroke={P.ink} strokeWidth={4} strokeDasharray="10 10" opacity={u}/>
          <g transform={`translate(${cx} ${cy}) scale(${0.5 + 0.5 * u})`}>
            <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={P.white} stroke={P.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
            <Txt x={0} y={(lab ? -h / 2 + size * 1.05 : size * 0.36)} text={cur} size={size} color={P.red}/>
            {lab ? <text x={0} y={h / 2 - 18} fontFamily={TYPE} fontSize={26} textAnchor="middle" fill={P.ink}>{lab}</text> : null}
          </g>
        </g>;
      })() : null}
      <BStamps s={s} T={T}/>
    </IStage>
  );
};

// =====================================================================================================
// loop
// =====================================================================================================
const LO = {LX: 600, RX: 1320, Y: 548, R: 200, SLOTS: 10};
const Wheel: React.FC<{x: number; ang: number; icon: string; shown: number[]; rim: string; label: string}> = ({x, ang, icon, shown, rim, label}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const R = LO.R, y = LO.Y, ri = R * 0.66;
  const ls = label ? fit(label, 40, 128, 0.52) : 40;
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <circle cx={x} cy={y + 8} r={R + 12} fill={P.shade} opacity={0.18}/>
      <circle cx={x} cy={y} r={R} fill={P.paper} stroke={P.ink} strokeWidth={5}/>
      <g transform={`rotate(${ang} ${x} ${y})`}>
        {Array.from({length: 5}, (_, i) => { const t = (i * 72 + 18) * Math.PI / 180; return <line key={i} x1={x + 70 * Math.cos(t)} y1={y + 70 * Math.sin(t)} x2={x + (R - 10) * Math.cos(t)} y2={y + (R - 10) * Math.sin(t)} stroke={P.ink} strokeWidth={5} opacity={0.45}/>; })}
        <circle cx={x} cy={y} r={R} fill="none" stroke={rim} strokeWidth={22}/>
        <circle cx={x} cy={y} r={R + 11} fill="none" stroke={P.ink} strokeWidth={4}/>
        <circle cx={x} cy={y} r={R - 11} fill="none" stroke={P.ink} strokeWidth={4}/>
        {Array.from({length: 12}, (_, i) => { const t = (i * 30) * Math.PI / 180; return <line key={i} x1={x + (R - 9) * Math.cos(t)} y1={y + (R - 9) * Math.sin(t)} x2={x + (R + 9) * Math.cos(t)} y2={y + (R + 9) * Math.sin(t)} stroke={P.ink} strokeWidth={3} opacity={0.5}/>; })}
      </g>
      {/* riders: they ride round with the wheel but stay upright */}
      {shown.map((t0, i) => {
        if (f < t0) return null;
        const u = t0 <= ON ? 1 : pop(f, fps, t0, 9, 170);
        const t = (ang + i * (360 / LO.SLOTS) - 90) * Math.PI / 180;
        return <g key={i} transform={`translate(${x + ri * Math.cos(t)} ${y + ri * Math.sin(t)}) scale(${u})`}><Icon name={icon} x={0} y={0} size={64}/></g>;
      })}
      <circle cx={x} cy={y} r={66} fill={P.white} stroke={P.ink} strokeWidth={5}/>
      {label ? <Txt x={x} y={y + ls * 0.36} text={label} size={ls}/> : null}
    </g>
  );
};
const Loop: React.FC<SP> = ({s, n, T}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const L = s.left || {}, Rr = s.right || {};
  const goAt = s.go ? when(T, s.go.at) : 1e9, stuckAt = s.stuck ? when(T, s.stuck.at) : 1e9;
  const going = f >= goAt, stuck = f >= stuckAt && !going;
  // Turning: slow, then faster. On from the start (go.at 0) means already at full speed.
  const dt = f - goAt;
  const angGo = goAt <= ON ? f * 3.2 : !going ? 0 : dt <= 120 ? 0.5 * dt + 2.7 * dt * dt / 240 : 0.5 * dt + 2.7 * 60 + 3.2 * (dt - 120);
  const rock = stuck ? 10 * Math.sin((f - stuckAt) * 0.22) * clamp01((f - stuckAt) / 10) : 0;
  // The belt: loose (sagging) until `go`, then it snaps tight.
  const snap = goAt <= ON ? 1 : going ? pop(f, fps, goAt, 7, 200) : 0;
  const sag = 74 * (1 - snap);
  const Rb = LO.R + 20, travel = (angGo * Math.PI / 180) * Rb;
  const belt = `M ${LO.LX} ${LO.Y - Rb} Q 960 ${LO.Y - Rb + sag * 1.6} ${LO.RX} ${LO.Y - Rb} A ${Rb} ${Rb} 0 0 1 ${LO.RX} ${LO.Y + Rb} Q 960 ${LO.Y + Rb + sag} ${LO.LX} ${LO.Y + Rb} A ${Rb} ${Rb} 0 0 1 ${LO.LX} ${LO.Y - Rb} Z`;
  // Riders: 5 to start; after `go` five more join each wheel, one at a time.
  const shown = (side: number) => Array.from({length: LO.SLOTS}, (_, i) => {
    if (i % 2 === 0) return ON;
    if (goAt <= ON) return ON;
    return going || goAt < 1e8 ? goAt + 24 + ((i - 1) / 2) * 14 + side * 5 : 1e9;
  });
  const cnt = (side: any, x: number) => {
    const c = side.count;
    if (!c || c.to == null) return null;
    const at = when(T, c.at);
    if (f < at) return null;
    const p = at <= ON ? 1 : prog(f, at, 22), u = at <= ON ? 1 : pop(f, fps, at, 11, 150);
    const pre = String(c.prefix ?? ""), suf = String(c.suffix ?? ""), d = Number(c.decimals ?? 0);
    const size = fit(`${pre}${fmtIN(Number(c.to), d)}${suf}`, 92, 520);
    return <g transform={`translate(${x} 884) scale(${0.6 + 0.4 * u})`}><Txt x={0} y={0} text={`${pre}${fmtIN(Number(c.to) * p, d)}${suf}`} size={size} color={P.red}/></g>;
  };
  const bub = (x: number, i: number) => {
    if (!stuck) return null;
    const u = pop(f, fps, stuckAt + i * 6, 9, 160), bob = Math.sin(f * 0.12 + i * 2) * 8;
    return <g transform={`translate(${x + (i ? 80 : -80)} ${LO.Y - LO.R - 96 + bob}) scale(${u})`}>
      <path d="M -46 -40 H 46 a 14 14 0 0 1 14 14 V 26 a 14 14 0 0 1 -14 14 H 10 L -10 62 L -12 40 H -46 a 14 14 0 0 1 -14 -14 V -26 a 14 14 0 0 1 14 -14 Z" fill={P.white} stroke={P.ink} strokeWidth={5} strokeLinejoin="round"/>
      <Txt x={0} y={30} text="?" size={86} color={P.red}/>
    </g>;
  };
  return (
    <IStage n={n}>
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      {/* the belt */}
      <path d={belt} fill="none" stroke={P.ink} strokeWidth={20} strokeLinejoin="round"/>
      <path d={belt} fill="none" stroke={P.mustard} strokeWidth={11} strokeLinejoin="round"/>
      <path d={belt} fill="none" stroke={P.ink} strokeWidth={4} strokeDasharray="18 30" strokeDashoffset={-travel} opacity={0.55}/>
      <Wheel x={LO.LX} ang={angGo + rock} icon={String(L.icon || "person")} shown={shown(0)} rim={P.blue} label={L.label ? String(L.label) : ""}/>
      <Wheel x={LO.RX} ang={angGo - rock} icon={String(Rr.icon || "store")} shown={shown(1)} rim={P.red} label={Rr.label ? String(Rr.label) : ""}/>
      {bub(LO.LX, 0)}
      {bub(LO.RX, 1)}
      {cnt(L, LO.LX)}
      {cnt(Rr, LO.RX)}
      <BStamps s={s} T={T} cx={960} y={262}/>
    </IStage>
  );
};

export const SCENES_BRIDGE: Record<string, React.FC<SP>> = {bridge: Bridge, loop: Loop};
