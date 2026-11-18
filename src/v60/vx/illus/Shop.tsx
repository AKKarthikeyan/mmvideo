// Shop scenes for the illustration kit (18 Oct 2026, built for Moat 60 D01 "Why Is It So Hard to Beat Asian Paints?").
//   dealercounter  a paint dealer's counter seen from the front: shelf of plain tins, a tinting machine, a faceless
//                  shopkeeper and painter, the moat's blue water ringing the counter; tins, items, a price tag,
//                  a rival stall and a till counter come and go on cue
//   kiloscale      a shopkeeper's hanging scale: a plain tub swings onto the pan, the needle wobbles and settles,
//                  and a plate beside the dial says how this market sells
// Every word and number on screen comes from the scene's props. No real person is drawn: every figure is faceless.
// No brand marks are drawn on the tins.
import React from "react";
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "../../rt";
import {SP, P, IStage, IHeading, INote, IStamps, Pop, StoreIcon, TFn, fit, fmtIN} from "./kit";
import {COND, TYPE, Stamp} from "../../voxkit";

// ---------- shared helpers (same rules as Story.tsx and World.tsx) ----------
const WOOD = "#C89B5A", WOOD_LT = "#DDB877", WOOD_DK = "#A87C42";
const arr = (x: any): any[] => (Array.isArray(x) ? x : []);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const prog = (f: number, start: number, dur: number, ease: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [start, start + Math.max(1, dur)], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
const pop = (f: number, fps: number, start: number, damping = 11, stiffness = 150) =>
  f < start ? 0 : spring({frame: f - start, fps, config: {damping, stiffness, mass: 0.8}});
// No `at`, or the number 0, means "on from the start": far enough back that every spring has settled.
const ON = -1000;
const when = (T: TFn, x: any) => (x == null || x === 0 ? ON : T(x));
const tw = (text: string, size: number) => text.length * size * 0.52;   // rough width of Oswald caps
const Txt: React.FC<{x: number; y: number; text: string; size: number; color?: string; anchor?: "start" | "middle" | "end"}> =
  ({x, y, text, size, color = P.ink, anchor = "middle"}) =>
  <text x={x} y={y} fontFamily={COND} fontWeight={700} fontSize={size} textAnchor={anchor} fill={color} letterSpacing={1}>{text}</text>;
const idOf = (b: any) => String(b?.key ?? "x").replace(/[^A-Za-z0-9_-]/g, "");
const ell = (cx: number, cy: number, rx: number, ry: number) => `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`;
// A paper label with an ink border, sized to its words; `fade` (0..1) lets an old label step back.
const Label: React.FC<{x: number; y: number; start: number; text: string; size?: number; fill?: string; color?: string; rot?: number; opacity?: number}> =
  ({x, y, start, text, size = 44, fill = P.white, color = P.ink, rot = 0, opacity = 1}) => {
  const w = tw(text, size) + size * 0.95, h = size * 1.5;
  if (opacity <= 0) return null;
  return (
    <g opacity={opacity}>
      <Pop x={x} y={y} start={start} rot={rot}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill={fill} stroke={P.ink} strokeWidth={4} style={{filter: "url(#vshadow)"}}/>
        <Txt x={0} y={size * 0.36} text={text} size={size} color={color}/>
      </Pop>
    </g>
  );
};
// A number inside a text ("+10%", "YEAR 5") ticks up from 0 over `dur` frames; text with no number is shown as is.
const tickText = (text: string, p: number) => {
  const m = text.match(/(\d[\d,]*\.?\d*)/);
  if (!m) return text;
  const v = parseFloat(m[1].replace(/,/g, "")), d = (m[1].split(".")[1] || "").length;
  return text.replace(m[1], fmtIN(v * p, d));
};

// =====================================================================================================
// dealercounter
// =====================================================================================================
// Fixed layout: the counter sits on a green island at the left-centre; the right column is kept for the till chip,
// a rival stall and the stamps (top right).
const K = {CX: 800, FLOOR: 822, RXI: 540, RYI: 60, RXO: 700, RYO: 98,
  CT_X0: 440, CT_X1: 1160, CT_TOP: 590, CT_BOT: 806, SH_X0: 520, SH_X1: 1040, SH_TOP: 300, B1: 410, B2: 520,
  OWN_X: 800, MACH_X: 540, TILL_X: 1100, SPOTS: [690, 850, 990], CHIP_X: 1620, CHIP_Y: 455, STAMP_Y: 318};
const TINC = [P.red, P.blue, P.mustard, P.green, P.white];
const TIN_W = 42, TIN_H = 48, TIN_STEP = 52;
// A plain paint tin standing on (x, y): lid, body band, handle. No brand mark.
const Tin: React.FC<{x: number; y: number; color: string; s?: number}> = ({x, y, color, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
    <rect x={-TIN_W / 2} y={-TIN_H} width={TIN_W} height={TIN_H} rx={4} fill={color} stroke={P.ink} strokeWidth={3.5}/>
    <rect x={-TIN_W / 2} y={-TIN_H * 0.62} width={TIN_W} height={TIN_H * 0.3} fill={P.white} opacity={0.75} stroke={P.ink} strokeWidth={2}/>
    <rect x={-TIN_W / 2 - 3} y={-TIN_H - 6} width={TIN_W + 6} height={8} rx={3} fill={P.gray} stroke={P.ink} strokeWidth={3}/>
  </g>
);
// The shopkeeper: faceless, a kurta, arms on the counter. Drawn around the middle of the counter top (0, 0).
const Keeper: React.FC = () => {
  const f = useCurrentFrame();
  const nod = 2 * Math.sin(f * 0.06), sway = 3 * Math.sin(f * 0.045);
  return (
    <g transform={`translate(${sway} 0)`} strokeLinejoin="round" strokeLinecap="round">
      <path d="M -105 40 V -40 C -105 -95 -60 -112 0 -112 C 60 -112 105 -95 105 -40 V 40 Z" fill={P.teal} stroke={P.ink} strokeWidth={5}/>
      <path d="M -22 -110 L 0 -60 L 22 -110" fill="none" stroke={P.ink} strokeWidth={4} opacity={0.6}/>
      <g transform={`rotate(${nod} 0 -118)`}>
        <rect x={-18} y={-136} width={36} height={30} fill={P.ink}/>
        <circle cx={0} cy={-178} r={56} fill={P.ink}/>
      </g>
    </g>
  );
};
// The painter: faceless, white overalls, a mustard cap, a roller over the shoulder. Drawn around his feet (0, 0).
const Painter: React.FC = () => {
  const f = useCurrentFrame();
  const lean = 1.5 * Math.sin(f * 0.05);
  return (
    <g transform={`rotate(${lean} 0 0)`} strokeLinejoin="round" strokeLinecap="round">
      {/* legs */}
      <rect x={-46} y={-150} width={38} height={150} fill={P.white} stroke={P.ink} strokeWidth={5}/>
      <rect x={8} y={-150} width={38} height={150} fill={P.white} stroke={P.ink} strokeWidth={5}/>
      <rect x={-54} y={-8} width={48} height={14} rx={5} fill={P.ink}/><rect x={4} y={-8} width={48} height={14} rx={5} fill={P.ink}/>
      {/* body */}
      <path d="M -62 -140 V -250 C -62 -300 -30 -318 0 -318 C 30 -318 62 -300 62 -250 V -140 Z" fill={P.white} stroke={P.ink} strokeWidth={5}/>
      <rect x={-36} y={-262} width={72} height={70} rx={6} fill={P.white} stroke={P.ink} strokeWidth={4}/>
      <path d="M -36 -262 L -50 -312 M 36 -262 L 50 -312" stroke={P.ink} strokeWidth={5}/>
      {/* paint spots on the overalls */}
      <circle cx={-20} cy={-90} r={7} fill={P.blue}/><circle cx={26} cy={-60} r={6} fill={P.red}/><circle cx={10} cy={-220} r={6} fill={P.mustard}/>
      {/* right arm leans on the counter */}
      <path d="M 50 -290 C 110 -270 130 -235 150 -220" fill="none" stroke={P.ink} strokeWidth={34}/>
      <path d="M 50 -290 C 110 -270 130 -235 150 -220" fill="none" stroke={P.white} strokeWidth={24}/>
      {/* left arm holds a roller on its pole */}
      <path d="M -50 -290 C -90 -250 -96 -210 -86 -180" fill="none" stroke={P.ink} strokeWidth={34}/>
      <path d="M -50 -290 C -90 -250 -96 -210 -86 -180" fill="none" stroke={P.white} strokeWidth={24}/>
      <line x1={-86} y1={-176} x2={-116} y2={-420} stroke={P.ink} strokeWidth={8}/>
      <path d="M -116 -420 h -40 v -20" fill="none" stroke={P.ink} strokeWidth={6}/>
      <rect x={-200} y={-470} width={88} height={34} rx={10} fill={P.blue} stroke={P.ink} strokeWidth={5}/>
      {/* head and cap: no face */}
      <rect x={-16} y={-336} width={32} height={26} fill={P.ink}/>
      <circle cx={0} cy={-370} r={46} fill={P.ink}/>
      <path d="M -48 -380 C -44 -428 44 -428 48 -380 Z" fill={P.mustard} stroke={P.ink} strokeWidth={5}/>
      <path d="M 40 -384 h 42" stroke={P.ink} strokeWidth={9}/>
    </g>
  );
};
// The tinting machine, drawn around the middle of its foot (0, 0). The colour cans on top turn; with `pour` the
// drops fall into the plain tin in the bay, which turns a new shade (and does it again every 66 frames).
const SHADES = [P.teal, P.purple, P.orange, P.green, "#C44E7A", P.blue];
const DROPS = [[P.red, P.blue], [P.mustard, P.red], [P.blue, P.mustard], [P.green, P.mustard], [P.red, P.white], [P.blue, P.green]];
const TintMachine: React.FC<{pour: number}> = ({pour}) => {
  const f = useCurrentFrame();
  const spin = f * 1.6;
  const cyc = 66, k = f >= pour ? Math.floor((f - pour) / cyc) : -1, t = f >= pour ? (f - pour) % cyc : 0;
  const shade = k < 0 ? P.white : t < 26 ? (k === 0 ? P.white : SHADES[(k - 1) % SHADES.length]) : SHADES[k % SHADES.length];
  const turn = k < 0 ? 0 : prog(t, 20, 8);
  const tinFill = k >= 0 && t >= 20 && t < 28 ? (turn < 0.5 ? (k === 0 ? P.white : SHADES[(k - 1) % SHADES.length]) : SHADES[k % SHADES.length]) : shade;
  const drops = k < 0 ? [] : DROPS[k % DROPS.length];
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {/* body */}
      <rect x={-76} y={-196} width={152} height={196} rx={10} fill={P.white} stroke={P.ink} strokeWidth={5}/>
      {/* colour cans turning on the top */}
      <ellipse cx={0} cy={-200} rx={74} ry={18} fill={P.gray} stroke={P.ink} strokeWidth={4}/>
      {Array.from({length: 6}, (_, i) => {
        const a = ((spin + i * 60) % 360) * Math.PI / 180, x = 56 * Math.cos(a), z = Math.sin(a);
        return {i, x, z};
      }).sort((p, q) => p.z - q.z).map(({i, x, z}) => (
        <g key={i} opacity={z < -0.2 ? 0.75 : 1}>
          <rect x={x - 14} y={-252 + z * 6} width={28} height={50} rx={5} fill={[P.red, P.blue, P.mustard, P.green, P.purple, P.orange][i]} stroke={P.ink} strokeWidth={3}/>
        </g>
      ))}
      {/* the bay, its nozzle, and the tin on its little stand */}
      <rect x={-56} y={-150} width={112} height={142} rx={6} fill={P.shade} stroke={P.ink} strokeWidth={4}/>
      <path d="M -14 -150 h 28 l -6 18 h -16 Z" fill={P.gray} stroke={P.ink} strokeWidth={3}/>
      {drops.map((c, j) => {
        const t0 = 2 + j * 9, u = prog(t, t0, 10, Easing.in(Easing.quad));
        if (t < t0 || t > t0 + 11) return null;
        const y = lerp(-128, -64, u);
        return <path key={j} d={`M 0 ${y - 12} C 8 ${y}, 8 ${y + 9}, 0 ${y + 9} C -8 ${y + 9}, -8 ${y}, 0 ${y - 12} Z`} fill={c} stroke={P.ink} strokeWidth={2.5}/>;
      })}
      <rect x={-40} y={-16} width={80} height={8} fill={P.gray} stroke={P.ink} strokeWidth={3}/>
      <g transform="translate(0 -16)"><Tin x={0} y={0} color={tinFill} s={1.05}/></g>
      {/* little lights */}
      {[P.green, P.mustard].map((c, i) => <circle key={i} cx={-52 + i * 22} cy={-174} r={7} fill={(Math.floor(f / 10) + i) % 2 ? c : P.gray} stroke={P.ink} strokeWidth={2.5}/>)}
    </g>
  );
};
// The till: a small cash register, drawn around the middle of its foot (0, 0).
const Till: React.FC<{busy: boolean}> = ({busy}) => {
  const f = useCurrentFrame();
  const drawer = busy ? 10 * Math.abs(Math.sin(f * 0.25)) : 0;
  return (
    <g strokeLinejoin="round">
      <rect x={-56} y={-14} width={112 + drawer * 0.2} height={14} fill={WOOD_DK} stroke={P.ink} strokeWidth={4} transform={`translate(0 ${drawer * 0.3})`}/>
      <path d="M -56 -14 L -46 -84 H 46 L 56 -14 Z" fill={P.gray} stroke={P.ink} strokeWidth={4}/>
      <rect x={-30} y={-112} width={60} height={30} rx={4} fill={P.ink}/>
      <rect x={-24} y={-106} width={48} height={18} fill={busy ? P.green : P.teal}/>
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={-30 + c * 22} y={-70 + r * 17} width={16} height={11} rx={2} fill={P.white} stroke={P.ink} strokeWidth={2}/>))}
    </g>
  );
};
// Items that land on the counter. tub: a plain tub; job: a job card with a roller on it; pipe: a pipe that rises out
// of the counter and runs off to the right, with a blob of the chemical flowing along it.
const TubIcon: React.FC = () => (
  <g strokeLinejoin="round" strokeLinecap="round">
    <path d="M -44 -78 L -36 0 H 36 L 44 -78 Z" fill={P.mustard} stroke={P.ink} strokeWidth={4}/>
    <rect x={-48} y={-90} width={96} height={14} rx={4} fill={P.white} stroke={P.ink} strokeWidth={4}/>
    <path d="M -40 -84 C -40 -126 40 -126 40 -84" fill="none" stroke={P.ink} strokeWidth={4}/>
    <rect x={-30} y={-56} width={60} height={22} fill={P.white} opacity={0.8} stroke={P.ink} strokeWidth={2.5}/>
  </g>
);
const JobIcon: React.FC = () => (
  <g strokeLinejoin="round" strokeLinecap="round" transform="rotate(-6)">
    <rect x={-52} y={-104} width={104} height={104} rx={6} fill={P.white} stroke={P.ink} strokeWidth={4}/>
    <path d="M -36 -54 L 0 -84 L 36 -54 V -16 H -36 Z" fill={P.mustard} stroke={P.ink} strokeWidth={3.5}/>
    <rect x={-10} y={-40} width={20} height={24} fill={P.ink}/>
    <rect x={12} y={-74} width={34} height={14} rx={4} fill={P.blue} stroke={P.ink} strokeWidth={3}/>
    <path d="M 29 -60 v 12 h -10 v 16" fill="none" stroke={P.ink} strokeWidth={3}/>
  </g>
);
const PipeItem: React.FC<{u: number; flow: number}> = ({u, flow}) => {
  // from the counter top up to the run height, then to the right edge of the frame
  const x0 = 0, yTop = -46, x1 = 1960 - K.SPOTS[2];
  const up = clamp(u * 2, 0, 1), across = clamp(u * 2 - 1, 0, 1);
  const bx = lerp(x1, x0, (flow % 1)), onRun = flow >= 0;
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <rect x={-26} y={-18} width={52} height={18} rx={4} fill={P.gray} stroke={P.ink} strokeWidth={4}/>
      <path d={`M ${x0} -18 V ${lerp(-18, yTop, up)}`} stroke={P.ink} strokeWidth={30}/>
      <path d={`M ${x0} -18 V ${lerp(-18, yTop, up)}`} stroke={P.gray} strokeWidth={20}/>
      {across > 0 ? <>
        <path d={`M ${x0} ${yTop} H ${lerp(x0, x1, across)}`} stroke={P.ink} strokeWidth={30}/>
        <path d={`M ${x0} ${yTop} H ${lerp(x0, x1, across)}`} stroke={P.gray} strokeWidth={20}/>
        <circle cx={x0} cy={yTop} r={17} fill={P.gray} stroke={P.ink} strokeWidth={4}/>
        {onRun && across >= 1 ? <ellipse cx={bx} cy={yTop} rx={16} ry={8} fill={P.white} stroke={P.ink} strokeWidth={2.5}/> : null}
      </> : null}
      {/* a tap on the rising pipe */}
      {up >= 1 ? <g><rect x={-13} y={-58} width={26} height={12} fill={P.red} stroke={P.ink} strokeWidth={3}/></g> : null}
    </g>
  );
};
const ItemSpot: React.FC = () => (
  <g>
    <ellipse cx={0} cy={-6} rx={60} ry={16} fill="none" stroke={P.ink} strokeWidth={5} strokeDasharray="10 9" opacity={0.8}/>
    <circle cx={0} cy={-70} r={48} fill={P.white} stroke={P.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
    <Txt x={0} y={-70 + 36} text="?" size={100} color={P.red}/>
  </g>
);

const DealerCounter: React.FC<SP> = ({s, n, T, b}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const id = idOf(b);
  const own = s.owner || null, mach = s.machine || null, pnt = s.painter || null, sh = s.shelf || null;
  const price = s.price && s.price.text ? s.price : null, rv = s.rival || null, cnt = s.count && s.count.to != null ? s.count : null;
  const items = arr(s.items).filter((it) => it && it.icon).slice(0, 3);
  const moatAt = when(T, s.moatAt);
  // ---- water ring: wipes round from the back to the front, then ripples for good (as the castle does)
  const fill = moatAt <= ON ? 1 : prog(f, moatAt, 28, Easing.inOut(Easing.cubic));
  const a = fill * Math.PI, pie = [`${K.CX} ${K.FLOOR}`];
  for (let i = 0; i <= 24; i++) { const t = -Math.PI / 2 - a + (2 * a * i) / 24; pie.push(`${(K.CX + 1000 * Math.cos(t)).toFixed(1)} ${(K.FLOOR + 1000 * Math.sin(t)).toFixed(1)}`); }
  const ringAt = (q: number) => ell(K.CX, K.FLOOR + lerp(4, 0, q), lerp(K.RXI, K.RXO, q), lerp(K.RYI, K.RYO, q));
  // ---- shelf: one layer of tins; `stock` adds a second layer, `newbrand` one thin column of a new colour,
  //      `turnover` sends tins off the shelf and back in a loop
  const shAt = sh ? when(T, sh.at) : ON;
  const perRow = 8, rows = [K.B1, K.B2];
  const x0 = K.SH_X0 + 44;
  const stock = sh && sh.stock ? Math.max(1, Math.min(2, Number(sh.stock))) : 1;
  const nb = sh && sh.newbrand ? 1 : 0;
  const turnover = !!(sh && sh.turnover);
  const tinAnim = (j: number) => {   // offset (dy, opacity) for tin j when the shelf turns over
    if (!turnover || f < shAt) return {dy: 0, op: 1, dx: 0};
    const N = perRow * rows.length, P2 = 14, kNow = Math.floor((f - shAt) / P2);
    for (let d = 0; d < 3; d++) {
      const k = kNow - d; if (k < 0) break;
      if ((k * 4) % N !== j) continue;
      const lt = f - (shAt + k * P2);
      if (lt < 12) { const u = prog(lt, 0, 12, Easing.in(Easing.quad)); return {dy: -60 * u, dx: 40 * u, op: 1 - u}; }
      if (lt < 30) { const u = prog(lt, 18, 10, Easing.out(Easing.back(1.6))); return {dy: -30 * (1 - u), dx: 0, op: u}; }
    }
    return {dy: 0, op: 1, dx: 0};
  };
  // ---- owner
  const ownAt = own ? when(T, own.at) : ON;
  const ownUp = own ? (ownAt <= ON ? 1 : pop(f, fps, ownAt, 10, 120)) : 0;
  const ownLabelOp = own && own.label && ownAt > ON ? (f < ownAt ? 0 : 1 - prog(f, ownAt + 84, 12)) : 0;
  // ---- machine and painter
  const mAt = mach ? when(T, mach.at) : ON, mIn = mach ? (mAt <= ON ? 1 : prog(f, mAt, 16, Easing.out(Easing.back(1.3)))) : 0;
  const pour = mach && mach.drops ? when(T, mach.drops) : 1e9;
  const pAt = pnt ? when(T, pnt.at) : ON, pIn = pnt ? (pAt <= ON ? 1 : prog(f, pAt, 18, Easing.out(Easing.back(1.2)))) : 0;
  // ---- items: each lands on its spot; only the newest two keep their word labels
  const ia = items.map((it) => when(T, it.at));
  const landed = ia.filter((t) => f >= t).length;
  // ---- price tag, rival, till chip
  const prAt = price ? when(T, price.at) : ON;
  const rvAt = rv ? when(T, rv.at) : ON;
  const cAt = cnt ? when(T, cnt.at) : ON;
  const cDur = cnt && cnt.until != null && cAt > ON ? Math.max(26, T(cnt.until) - cAt) : 26;
  const cp = cnt ? (cAt <= ON ? 1 : prog(f, cAt, cDur, cDur > 26 ? Easing.inOut(Easing.quad) : Easing.out(Easing.cubic))) : 0;
  const tillBusy = cnt ? f >= cAt && cp < 1 : false;
  const cid = `wdc-${id}`, ccl = `wdcc-${id}`;
  return (
    <IStage n={n}>
      <defs>
        <clipPath id={cid}><path d={`M ${pie.join(" L ")} Z`}/></clipPath>
        {/* the shopkeeper is only seen above the counter top */}
        <clipPath id={ccl}><rect x={0} y={0} width={1920} height={K.CT_TOP + 2}/></clipPath>
      </defs>
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      {/* the ditch, dry until the water comes; then the water */}
      <path d={ell(K.CX, K.FLOOR, K.RXO, K.RYO)} fill={P.shade} fillOpacity={0.24} stroke={P.ink} strokeWidth={5}/>
      {fill > 0 ? (
        <g clipPath={fill < 1 ? `url(#${cid})` : undefined}>
          <path d={ell(K.CX, K.FLOOR, K.RXO, K.RYO)} fill={P.blue} stroke={P.ink} strokeWidth={5}/>
          {[[0.3, "44 76", 1.5], [0.6, "30 90", -1.1], [0.86, "52 98", 1.9]].map((r, i) =>
            <path key={i} d={ringAt(r[0] as number)} fill="none" stroke={P.white} strokeWidth={5} strokeLinecap="round" opacity={0.85}
              pathLength={i === 2 ? 1500 : 1200} strokeDasharray={r[1] as string} strokeDashoffset={-f * (r[2] as number) + i * 40}/>)}
        </g>
      ) : null}
      {/* the island the shop stands on */}
      <path d={ell(K.CX, K.FLOOR + 14, K.RXI, K.RYI)} fill={WOOD} stroke={P.ink} strokeWidth={5}/>
      <path d={ell(K.CX, K.FLOOR, K.RXI, K.RYI)} fill={P.green} stroke={P.ink} strokeWidth={5}/>
      {/* the back wall shelf */}
      <rect x={K.SH_X0} y={K.SH_TOP} width={K.SH_X1 - K.SH_X0} height={K.CT_TOP - K.SH_TOP} fill={WOOD_LT} stroke={P.ink} strokeWidth={5}/>
      <rect x={K.SH_X0 + 16} y={K.SH_TOP + 14} width={K.SH_X1 - K.SH_X0 - 32} height={K.CT_TOP - K.SH_TOP - 14} fill={P.paper} stroke={P.ink} strokeWidth={3}/>
      {rows.map((y, r) => <g key={r}>
        {Array.from({length: perRow}, (_, i) => {
          const j = r * perRow + i, x = x0 + i * TIN_STEP, col = TINC[(i + r * 2) % 3];
          const isNew = nb && i === perRow - 1;
          if (isNew) return null;
          const an = tinAnim(j);
          const second = stock > 1 ? (shAt <= ON ? 1 : prog(f, shAt + (i + r * 3) * 2, 10, Easing.out(Easing.back(1.5)))) : 0;
          return <g key={i}>
            <g opacity={an.op} transform={`translate(${an.dx} ${an.dy})`}><Tin x={x} y={y} color={col}/></g>
            {second > 0 ? <g opacity={second}><Tin x={x} y={y - (TIN_H + 8) * second} color={col}/></g> : null}
          </g>;
        })}
        {nb ? (() => {
          const u = shAt <= ON ? 1 : prog(f, shAt + 24, 12, Easing.out(Easing.back(1.5)));
          return <g opacity={u}><Tin x={x0 + (perRow - 1) * TIN_STEP} y={y} color={P.purple} s={0.8}/></g>;
        })() : null}
        <rect x={K.SH_X0 + 10} y={y} width={K.SH_X1 - K.SH_X0 - 20} height={12} fill={WOOD_DK} stroke={P.ink} strokeWidth={4}/>
      </g>)}
      {/* the shopkeeper rises from behind the counter */}
      {own && ownUp > 0 ? <g clipPath={`url(#${ccl})`}><g transform={`translate(${K.OWN_X} ${K.CT_TOP + lerp(260, 0, ownUp)})`}><Keeper/></g></g> : null}
      {/* the counter */}
      <rect x={K.CT_X0 + 18} y={K.CT_TOP + 20} width={K.CT_X1 - K.CT_X0 - 36} height={K.CT_BOT - K.CT_TOP - 20} fill={WOOD} stroke={P.ink} strokeWidth={5}/>
      {[0, 1, 2].map((i) => <rect key={i} x={K.CT_X0 + 46 + i * 220} y={K.CT_TOP + 50} width={190} height={K.CT_BOT - K.CT_TOP - 80} rx={6} fill="none" stroke={WOOD_DK} strokeWidth={4}/>)}
      <rect x={K.CT_X0} y={K.CT_TOP} width={K.CT_X1 - K.CT_X0} height={26} rx={6} fill={WOOD_LT} stroke={P.ink} strokeWidth={5}/>
      {/* the tinting machine slides on from the left */}
      {mach && mIn > 0 ? <g transform={`translate(${lerp(-200, K.MACH_X, mIn)} ${K.CT_TOP + 2})`}><TintMachine pour={pour}/></g> : null}
      {/* items on the counter */}
      {items.map((it, i) => {
        const t0 = ia[i]; if (f < t0) return null;
        const u = t0 <= ON ? 1 : prog(f, t0, 18, Easing.out(Easing.bounce));
        const x = K.SPOTS[i], y = lerp(K.CT_TOP - 320, K.CT_TOP + 2, u);
        const q = String(it.label || "") === "?";
        const icon = String(it.icon);
        if (q) return <g key={i} transform={`translate(${x} ${K.CT_TOP + 2})`} opacity={t0 <= ON ? 1 : prog(f, t0, 8)}><ItemSpot/></g>;
        if (icon === "pipe") return <g key={i} transform={`translate(${x} ${K.CT_TOP + 2})`}><PipeItem u={t0 <= ON ? 1 : prog(f, t0, 30, Easing.inOut(Easing.quad))} flow={(f - t0 - 30) / 50}/></g>;
        return <g key={i} transform={`translate(${x} ${y}) scale(1.2)`}>{icon === "job" ? <JobIcon/> : <TubIcon/>}</g>;
      })}
      <g transform={`translate(${K.TILL_X} ${K.CT_TOP + 2})`}><Till busy={tillBusy}/></g>
      {/* item labels on the counter front: the newest two only, staggered so they never touch */}
      {items.map((it, i) => {
        const lab = String(it.label || ""); if (!lab || lab === "?" || f < ia[i]) return null;
        const older = landed - 1 - i, op = older >= 2 ? 1 - prog(f, ia[Math.min(items.length - 1, i + 2)], 8) : 1;
        const size = Math.min(40, fit(lab, 40, 330));
        const lx = clamp(K.SPOTS[i], K.CT_X0 + tw(lab, size) / 2 + 30, K.CT_X1 - tw(lab, size) / 2 - 30);
        return <Label key={i} x={lx} y={K.CT_TOP + 92 + (i % 2) * 86} start={ia[i] + 6} text={lab} size={size} opacity={op}/>;
      })}
      {/* the painter leans on the counter */}
      {pnt && pIn > 0 ? <g transform={`translate(${lerp(-260, 330, pIn)} ${K.FLOOR + 6})`}><Painter/></g> : null}
      {/* the owner's name, for a moment when he first pops up */}
      {ownLabelOp > 0 ? <Label x={K.OWN_X} y={K.CT_TOP - 300} start={ownAt + 4} text={String(own.label)} size={46} opacity={ownLabelOp}/> : null}
      {/* a price tag on a string, swinging above the machine; a number in it ticks up */}
      {price && f >= prAt ? (() => {
        const u = prAt <= ON ? 1 : pop(f, fps, prAt, 7, 120), sw = 10 * Math.sin((f - prAt) * 0.12) * Math.exp(-(f - prAt) / 60) + 2 * Math.sin(f * 0.07);
        const txt = tickText(String(price.text), prAt <= ON ? 1 : prog(f, prAt + 4, 22)), size = Math.min(56, fit(String(price.text), 56, 300));
        const w = tw(String(price.text), size) + 100, cx = Math.min(300, 440 - w / 2), top = 262;
        return <g transform={`translate(${cx} ${top}) rotate(${sw}) scale(${0.5 + 0.5 * u})`} strokeLinejoin="round">
          <line x1={0} y1={0} x2={0} y2={46} stroke={P.ink} strokeWidth={4}/>
          <path d={`M ${-w / 2 + 30} 46 H ${w / 2} V 146 H ${-w / 2 + 30} L ${-w / 2} 96 Z`} fill={P.mustard} stroke={P.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
          <circle cx={-w / 2 + 26} cy={96} r={8} fill={P.white} stroke={P.ink} strokeWidth={3}/>
          <Txt x={16} y={96 + size * 0.36} text={txt} size={size}/>
        </g>;
      })() : null}
      {/* a rival stall slides in beside the counter, hits the water and bounces back out of the frame */}
      {rv && f >= rvAt ? (() => {
        const lt = f - rvAt;
        const xin = lerp(2150, 1330, prog(lt, 0, 14, Easing.out(Easing.quad)));
        const back = prog(lt, 34, 22, Easing.in(Easing.back(1.8)));
        const x = lerp(xin, 2250, back), hop = Math.abs(Math.sin(lt * 0.35)) * (lt < 34 ? 10 : 4), tilt = lt > 14 && lt < 34 ? 6 * Math.sin((lt - 14) * 0.6) * Math.exp(-(lt - 14) / 10) : 0;
        if (x > 2240) return null;
        return <g>
          <g transform={`translate(${x} ${K.FLOOR - 92 - hop}) rotate(${tilt})`}><StoreIcon size={210} accent={P.gray}/></g>
          {rv.label ? <Label x={x} y={K.FLOOR - 250 - hop} start={rvAt} text={String(rv.label)} size={40} fill={P.white}/> : null}
        </g>;
      })() : null}
      {/* the till chip: a number that counts up, joined to the till by a dashed line */}
      {cnt && f >= cAt ? (() => {
        const to = Number(cnt.to), from = Number(cnt.from ?? 0), v = cDur > 26 ? Math.floor(from + (to - from) * cp + 1e-6) : from + (to - from) * cp;
        const t = `${cnt.prefix ?? ""}${fmtIN(v, Number(cnt.decimals ?? 0))}${cnt.suffix ?? ""}`, tfull = `${cnt.prefix ?? ""}${fmtIN(to, Number(cnt.decimals ?? 0))}${cnt.suffix ?? ""}`;
        const size = Math.min(96, fit(tfull, 96, 380, 0.52)), lab = cnt.label ? String(cnt.label) : "";
        const w = Math.max(tw(tfull, size), lab.length * 17) + 70, h = size * 1.3 + (lab ? 50 : 0);
        const u = cAt <= ON ? 1 : pop(f, fps, cAt, 12, 160);
        return <g>
          <path d={`M ${K.TILL_X + 40} ${K.CT_TOP - 80} C ${K.TILL_X + 200} ${K.CT_TOP - 150}, ${K.CHIP_X - w / 2 - 120} ${K.CHIP_Y}, ${K.CHIP_X - w / 2} ${K.CHIP_Y}`} fill="none" stroke={P.ink} strokeWidth={4} strokeDasharray="10 9" opacity={u}/>
          <g transform={`translate(${K.CHIP_X} ${K.CHIP_Y}) scale(${0.6 + 0.4 * u})`}>
            <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={P.white} stroke={P.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
            <Txt x={0} y={-h / 2 + size * 1.0} text={t} size={size}/>
            {lab ? <text x={0} y={h / 2 - 20} fontFamily={TYPE} fontSize={28} textAnchor="middle" fill={P.ink}>{lab}</text> : null}
          </g>
        </g>;
      })() : null}
      {arr(s.stamps).filter((st) => st && st.text).slice(0, 2).map((st: any, i: number) => {
        const t = String(st.text), size = Math.min(50, fit(t, 50, 740, 0.56)), sw = t.length * size * 0.55 + 70;
        return <Stamp key={i} x={1810 - sw / 2} y={K.STAMP_Y + i * 96} start={when(T, st.at) <= ON ? 0 : when(T, st.at)} text={t} size={size} rot={i % 2 ? 2 : -3}/>;
      })}
    </IStage>
  );
};

// =====================================================================================================
// kiloscale
// =====================================================================================================
const KS = {HOOK_X: 850, HOOK_Y: 272, DIAL_Y: 430, DIAL_R: 104, PAN_Y: 800, PLATE_X: 1330, TABLE_Y: 820};
const Kiloscale: React.FC<SP> = ({s, n, T, b}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const tub = s.tub || null, wt = s.weight && s.weight.text ? s.weight : null;
  const tAt = tub ? when(T, tub.at) : 1e9, wAt = wt ? when(T, wt.at) : 1e9;
  // The tub swings in on an arc from the upper left and lands in the pan.
  const tu = tAt <= ON ? 1 : prog(f, tAt, 20, Easing.out(Easing.quad));
  const landT = tAt + 20, landed = f >= landT || tAt <= ON;
  // The pan sinks a little when the tub lands, with a bounce.
  const sink = !tub ? 0 : tAt <= ON ? 1 : f < landT ? 0 : spring({frame: f - landT, fps, config: {damping: 7, stiffness: 120, mass: 0.9}});
  // Needle: rests at -60 degrees; the plate's cue makes it twitch (weighing), the tub's landing swings it over.
  const twitch = f >= wAt && wAt > ON ? 14 * Math.sin((f - wAt) * 0.5) * Math.exp(-(f - wAt) / 12) : 0;
  const swing = landed ? (tAt <= ON ? 0 : 26 * Math.sin((f - landT) * 0.42) * Math.exp(-(f - landT) / 16)) : 0;
  const needle = -60 + 100 * sink + twitch + swing;
  // The whole scale sways a little, more just after the landing.
  const sway = 1.2 * Math.sin(f * 0.06) + (landed && tAt > ON ? 3 * Math.sin((f - landT) * 0.3) * Math.exp(-(f - landT) / 20) : 0);
  const panY = KS.PAN_Y + 26 * sink;
  const id = idOf(b);
  const tubLab = tub && tub.label ? String(tub.label) : "";
  const tubX = lerp(260, KS.HOOK_X, tu), tubY = landed ? panY - 4 : lerp(380, panY - 4, tu) - Math.sin(tu * Math.PI) * 140;
  const tubRot = landed ? 0 : lerp(-30, 0, tu);
  const plateU = wt ? (wAt <= ON ? 1 : pop(f, fps, wAt, 11, 150)) : 0;
  const pText = wt ? String(wt.text) : "", pSize = Math.min(64, fit(pText, 64, 420));
  const pW = tw(pText, pSize) + 80;
  return (
    <IStage n={n}>
      <defs><clipPath id={`wks-${id}`}><circle cx={0} cy={0} r={KS.DIAL_R - 6}/></clipPath></defs>
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      {/* the stall: an awning across the top, a table below */}
      <rect x={400} y={KS.HOOK_Y - 20} width={900} height={18} fill={WOOD_DK} stroke={P.ink} strokeWidth={5}/>
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M ${400 + i * 100} ${KS.HOOK_Y - 2} h 100 v 22 a 50 22 0 0 1 -100 0 Z`} fill={i % 2 ? P.white : P.red} stroke={P.ink} strokeWidth={4} strokeLinejoin="round"/>)}
      <rect x={130} y={KS.TABLE_Y} width={420} height={24} rx={6} fill={WOOD_LT} stroke={P.ink} strokeWidth={5}/>
      <rect x={160} y={KS.TABLE_Y + 24} width={360} height={70} fill={WOOD} stroke={P.ink} strokeWidth={5}/>
      {/* plain tubs waiting on the table */}
      {[[210, P.blue], [310, P.green], [460, P.red]].map((t, i) => <g key={i} transform={`translate(${t[0]} ${KS.TABLE_Y}) scale(0.72)`}>
        <path d="M -44 -78 L -36 0 H 36 L 44 -78 Z" fill={t[1] as string} stroke={P.ink} strokeWidth={5} strokeLinejoin="round"/>
        <rect x={-48} y={-90} width={96} height={14} rx={4} fill={P.white} stroke={P.ink} strokeWidth={5}/>
      </g>)}
      <g transform={`rotate(${sway} ${KS.HOOK_X} ${KS.HOOK_Y + 20})`} strokeLinejoin="round" strokeLinecap="round">
        {/* hook and the spring balance's dial */}
        <path d={`M ${KS.HOOK_X} ${KS.HOOK_Y + 20} v 30 a 14 14 0 1 0 14 14`} fill="none" stroke={P.ink} strokeWidth={7}/>
        <rect x={KS.HOOK_X - 12} y={KS.HOOK_Y + 70} width={24} height={KS.DIAL_Y - KS.DIAL_R - KS.HOOK_Y - 64} fill={P.gray} stroke={P.ink} strokeWidth={4}/>
        <g transform={`translate(${KS.HOOK_X} ${KS.DIAL_Y})`}>
          <circle r={KS.DIAL_R + 14} fill={P.red} stroke={P.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
          <circle r={KS.DIAL_R} fill={P.white} stroke={P.ink} strokeWidth={4}/>
          {Array.from({length: 13}, (_, i) => { const a = (-70 + i * (140 / 12)) * Math.PI / 180, L = i % 3 === 0 ? 24 : 14;
            return <line key={i} x1={(KS.DIAL_R - 8) * Math.sin(a)} y1={-(KS.DIAL_R - 8) * Math.cos(a)} x2={(KS.DIAL_R - 8 - L) * Math.sin(a)} y2={-(KS.DIAL_R - 8 - L) * Math.cos(a)} stroke={P.ink} strokeWidth={i % 3 === 0 ? 5 : 3}/>; })}
          <g clipPath={`url(#wks-${id})`} transform={`rotate(${needle})`}>
            <path d="M -6 18 L 0 -86 L 6 18 Z" fill={P.red} stroke={P.ink} strokeWidth={2.5}/>
          </g>
          <circle r={12} fill={P.ink}/>
        </g>
        {/* the hook under the dial, the chains and the pan */}
        <line x1={KS.HOOK_X} y1={KS.DIAL_Y + KS.DIAL_R + 14} x2={KS.HOOK_X} y2={KS.DIAL_Y + KS.DIAL_R + 54 + 26 * sink} stroke={P.ink} strokeWidth={6}/>
        {[-1, 0, 1].map((k) => <line key={k} x1={KS.HOOK_X} y1={KS.DIAL_Y + KS.DIAL_R + 54 + 26 * sink} x2={KS.HOOK_X + k * 160} y2={panY - 6} stroke={P.ink} strokeWidth={4} strokeDasharray="12 6"/>)}
        <path d={`M ${KS.HOOK_X - 180} ${panY - 6} Q ${KS.HOOK_X} ${panY + 60} ${KS.HOOK_X + 180} ${panY - 6} Z`} fill={P.gray} stroke={P.ink} strokeWidth={5}/>
        <ellipse cx={KS.HOOK_X} cy={panY - 6} rx={180} ry={16} fill={P.paper} stroke={P.ink} strokeWidth={5}/>
      </g>
      {/* the tub, with its label band */}
      {tub && f >= tAt ? <g transform={`translate(${tubX} ${tubY}) rotate(${tubRot}) scale(1.1)`} strokeLinejoin="round" strokeLinecap="round">
        <path d="M -92 -150 L -76 0 H 76 L 92 -150 Z" fill={P.mustard} stroke={P.ink} strokeWidth={5}/>
        <rect x={-100} y={-172} width={200} height={26} rx={6} fill={P.white} stroke={P.ink} strokeWidth={5}/>
        <path d="M -80 -162 C -80 -240 80 -240 80 -162" fill="none" stroke={P.ink} strokeWidth={6}/>
        {tubLab ? (() => { const sz = Math.min(44, fit(tubLab, 44, 170, 0.52)); return <g>
          <rect x={-88} y={-108} width={176} height={sz * 1.4} fill={P.white} stroke={P.ink} strokeWidth={3}/>
          <Txt x={0} y={-108 + sz * 1.05} text={tubLab} size={sz}/>
        </g>; })() : null}
      </g> : null}
      {/* the plate the needle points to: how this market sells */}
      {wt && plateU > 0 ? <g>
        <line x1={KS.HOOK_X + KS.DIAL_R + 18} y1={KS.DIAL_Y} x2={KS.PLATE_X - pW / 2} y2={KS.DIAL_Y} stroke={P.ink} strokeWidth={4} strokeDasharray="10 9" opacity={plateU}/>
        <g transform={`translate(${KS.PLATE_X} ${KS.DIAL_Y}) scale(${0.6 + 0.4 * plateU}) rotate(-3)`}>
          <rect x={-pW / 2} y={-pSize * 0.85} width={pW} height={pSize * 1.7} rx={8} fill={P.gold} stroke={P.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
          <rect x={-pW / 2 + 10} y={-pSize * 0.85 + 10} width={pW - 20} height={pSize * 1.7 - 20} rx={5} fill="none" stroke={P.ink} strokeWidth={2} opacity={0.5}/>
          {[-1, 1].map((k) => <circle key={k} cx={k * (pW / 2 - 22)} cy={0} r={6} fill={P.ink}/>)}
          <Txt x={0} y={pSize * 0.36} text={pText} size={pSize}/>
        </g>
      </g> : null}
      <IStamps s={s} T={T}/>
    </IStage>
  );
};

export const SCENES_SHOP: Record<string, React.FC<SP>> = {dealercounter: DealerCounter, kiloscale: Kiloscale};
