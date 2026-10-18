// Money scenes for the illustrated Vox kit (11 Oct 2026): the three scenes that carry a "follow the ₹100" story.
//   keep : a big note slaps down, wrong guesses are struck out, the thin slice the company keeps is cut off and
//          blown up into two bars (then / now); the shortfall drops out as coins and the question slams in.
//   note : the long ₹100 bar that scissors cut up piece by piece (optionally zoomed into everything after piece 1).
//   case : the detective's board: one token per missing paisa, flipped to a suspect's colour as each is found.
// Every word and number comes from props. Optional props beyond the brief: s.label (text on the note / its tag;
// default = currency symbol read from the money texts + total), s.words = {found, of} for the case counter
// (default "FOUND", "OF"), s.slots for the number of places in the case line-up (default 6).
import React from "react";
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {SP, TFn, P, SAFE, IStage, IHeading, INote, IStamps, Pop, Chip, Icon, fit, fmtIN, clamp01, CurCtx} from "./kit";
import {Stamp, Pin, COND} from "../../voxkit";

// ---------- small shared helpers ----------
const NOTE = "#BFD9B4";   // the paper colour of the kit's NoteIcon
const CYCLE = ["blue", "mustard", "red", "green", "ink", "gray"];
const pal = (c: any, d: string = P.gray): string => (typeof c === "string" && (P as any)[c]) || (typeof c === "string" && c[0] === "#" ? c : d);
const isDark = (c: string) => c === P.ink || c === P.blue || c === P.green || c === P.red || c === P.gray || c === P.shade;
const tw = (t: any, size: number, k = 0.52) => String(t ?? "").length * size * k;
const at = (T: TFn, x: any, d = 0) => (x == null ? d : T(x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const idOf = (b: any) => String(b?.key ?? "x").replace(/[^A-Za-z0-9_-]/g, "");   // keeps clip-path ids unique per beat
const prog = (f: number, start: number, dur: number, ease: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [start, start + dur], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
const spr = (f: number, start: number, fps: number, damping = 12, stiffness = 150, mass = 0.8) =>
  f < start ? 0 : f - start > 150 ? 1 : spring({frame: f - start, fps, config: {damping, stiffness, mass}});
// Currency symbol taken from the first money text in the props ("₹6.18" -> "₹"), so it is never assumed silently.
const curOf = (texts: any[], fallback = "₹") => {
  for (const t of texts) { const m = /^[^\d\s.,+\-A-Za-z]+/.exec(String(t ?? "")); if (m && m[0].length <= 3) return m[0]; }
  return fallback;
};
const Tx: React.FC<{x?: number; y?: number; size: number; fill?: string; anchor?: "start" | "middle" | "end"; ls?: number; children: React.ReactNode}> =
  ({x = 0, y = 0, size, fill = P.ink, anchor = "middle", ls = 1, children}) =>
  <text x={x} y={y} fontFamily={COND} fontWeight={700} fontSize={size} textAnchor={anchor} fill={fill} letterSpacing={ls}>{children}</text>;
// Split a label into at most two balanced lines.
const wrap2 = (label: string): string[] => {
  const sp: number[] = []; for (let i = 0; i < label.length; i++) if (label[i] === " ") sp.push(i);
  if (!sp.length) return [label];
  let best = sp[0], bm = 1e9;
  for (const i of sp) { const m = Math.max(i, label.length - i - 1); if (m < bm) { bm = m; best = i; } }
  return [label.slice(0, best), label.slice(best + 1)];
};

// A plain coin token (no likeness of real money): flat fill, ink ring, optional "?".
const Token: React.FC<{x: number; y: number; r: number; fill: string; q?: boolean; sx?: number; k?: number; rot?: number}> = ({x, y, r, fill, q = false, sx = 1, k = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k * sx} ${k})`}>
    <circle cx={0} cy={r * 0.12} r={r} fill={P.shade} opacity={q ? 0.22 : 0.32}/>
    {q ? <circle r={r} fill={P.white}/> : null}
    <circle r={r} fill={fill} fillOpacity={q ? 0.42 : 1} stroke={P.ink} strokeWidth={4}/>
    <circle r={r * 0.72} fill="none" stroke={q ? P.ink : isDark(fill) ? P.white : P.ink} strokeWidth={2.5} opacity={q ? 0.28 : 0.5}/>
    {q ? <text x={0} y={r * 0.42} fontFamily={COND} fontWeight={700} fontSize={r * 1.2} textAnchor="middle" fill={P.ink} opacity={0.78}>?</text>
      : <line x1={-r * 0.3} y1={-r * 0.3} x2={r * 0.05} y2={-r * 0.48} stroke={isDark(fill) ? P.white : P.ink} strokeWidth={3} strokeLinecap="round" opacity={0.55}/>}
  </g>
);
// The detective's magnifier, centred on (0, 0). Handle points along `handle` degrees.
const Lens: React.FC<{r: number; handle?: number}> = ({r, handle = -40}) => {
  const a = handle * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
  return (
    <g strokeLinecap="round">
      <line x1={c * (r + 4)} y1={sn * (r + 4)} x2={c * r * 2.3} y2={sn * r * 2.3} stroke={P.ink} strokeWidth={r * 0.34}/>
      <line x1={c * (r * 1.3)} y1={sn * (r * 1.3)} x2={c * r * 2.22} y2={sn * r * 2.22} stroke={P.red} strokeWidth={r * 0.17}/>
      <circle r={r} fill={P.white} fillOpacity={0.14} stroke={P.ink} strokeWidth={r * 0.17}/>
      <circle r={r * 0.9} fill="none" stroke={P.white} strokeWidth={r * 0.045} opacity={0.85}/>
      <path d={`M ${-r * 0.62} ${-r * 0.28} A ${r * 0.68} ${r * 0.68} 0 0 1 ${-r * 0.2} ${-r * 0.64}`} fill="none" stroke={P.white} strokeWidth={r * 0.09} opacity={0.9}/>
    </g>
  );
};
// Scissors with the pivot on (0, 0). dir = 1: blades point down; dir = -1: blades point up. open = half angle.
const Scissors: React.FC<{open: number; dir?: number; size?: number}> = ({open, dir = 1, size = 100}) => {
  const half = (sg: number) => (
    <g transform={`rotate(${sg * open})`}>
      <path d="M -7 -6 L 0 68 L 8 -6 Z" fill={P.white} stroke={P.ink} strokeWidth={4}/>
      <line x1={0} y1={-4} x2={sg * 9} y2={-34} stroke={P.ink} strokeWidth={9}/>
      <ellipse cx={sg * 12} cy={-54} rx={14} ry={19} fill="none" stroke={P.ink} strokeWidth={12}/>
      <ellipse cx={sg * 12} cy={-54} rx={14} ry={19} fill="none" stroke={P.red} strokeWidth={5}/>
    </g>
  );
  return <g transform={`scale(${size / 100} ${dir * size / 100})`} strokeLinejoin="round" strokeLinecap="round">{half(1)}{half(-1)}<circle r={5} fill={P.ink}/></g>;
};
// A filled red strip that slams down: for the one line the scene is building to.
const Slam: React.FC<{x: number; y: number; start: number; text: string; size: number; rot?: number}> = ({x, y, start, text, size, rot = -4}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  if (f < start) return null;
  const k = 1.9 - 0.9 * spring({frame: f - start, fps, config: {damping: 13, stiffness: 260}});
  const w = tw(text, size, 0.55) + size * 0.9, h = size * 1.5;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
      <rect x={-w / 2 + 11} y={-h / 2 + 13} width={w} height={h} fill={P.ink}/>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={P.red} stroke={P.ink} strokeWidth={6} strokeLinejoin="round"/>
      <Tx y={size * 0.36} size={size} fill={P.white} ls={2}>{text}</Tx>
    </g>
  );
};
// Distance fallen (0..h) after t frames by something dropped from height h that bounces a few times.
const bounce = (t: number, h: number, g = 1.1, e = 0.48) => {
  if (t <= 0) return 0;
  const t0 = Math.sqrt(2 * h / g);
  if (t < t0) return 0.5 * g * t * t;
  let v = g * t0 * e; t -= t0;
  for (let i = 0; i < 4; i++) { const d = 2 * v / g; if (t < d) return h - (v * t - 0.5 * g * t * t); t -= d; v *= e; }
  return h;
};

// =====================================================================================================
// keep
// =====================================================================================================
const BigNote: React.FC<{w: number; h: number; label: string; sliceW: number; snip: number; split: boolean; sep: number; id: string}> = ({w, h, label, sliceW, snip, split, sep, id}) => {
  const xc = w / 2 - sliceW, size = Math.min(h * 0.52, (w * 0.42) / (Math.max(1, label.length) * 0.52));
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <clipPath id={id}><rect x={-w / 2 - 10} y={-h / 2 - 10} width={split ? w - sliceW + 10 : w + 20} height={h + 20}/></clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={16} fill={NOTE} stroke={P.ink} strokeWidth={6}/>
        <rect x={-w / 2 + 24} y={-h / 2 + 24} width={w - 48} height={h - 48} rx={8} fill="none" stroke={P.ink} strokeWidth={3} opacity={0.5}/>
        {[-1, 1].map((sg) => <g key={sg} opacity={0.55}>
          <circle cx={sg * (w / 2 - h * 0.42)} cy={0} r={h * 0.2} fill="none" stroke={P.ink} strokeWidth={3.5}/>
          <circle cx={sg * (w / 2 - h * 0.42)} cy={0} r={h * 0.12} fill="none" stroke={P.ink} strokeWidth={2.5}/>
        </g>)}
        <Tx y={size * 0.36} size={size}>{label}</Tx>
      </g>
      {split ? <line x1={xc} y1={-h / 2} x2={xc} y2={h / 2} stroke={P.ink} strokeWidth={6}/> : null}
      {split ? <path transform={`translate(${sep} 0)`} d={`M ${xc} ${-h / 2} H ${w / 2 - 16} a 16 16 0 0 1 16 16 V ${h / 2 - 16} a 16 16 0 0 1 -16 16 H ${xc} Z`} fill={P.gold} stroke={P.ink} strokeWidth={6}/> : null}
      {!split && snip > 0 ? <line x1={xc} y1={-h / 2 - 16} x2={xc} y2={-h / 2 - 16 + (h + 32) * snip} stroke={P.red} strokeWidth={6} strokeDasharray="16 12"/> : null}
    </g>
  );
};
const GuessChip: React.FC<{x: number; y: number; text: string; size: number; start: number; rot: number; k?: number}> = ({x, y, text, size, start, rot, k = 1}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  if (f < start) return null;
  const sp = spr(f, start, fps, 10, 170), sl = prog(f, start + 12, 5), dead = sl >= 1;
  const w = tw(text, size) + size * 0.9, h = size * 1.5;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot + (dead ? 3 : 0)}) scale(${k * (0.5 + 0.5 * sp) * (dead ? 0.96 : 1)})`}>
      <rect x={-w / 2 + 9} y={-h / 2 + 11} width={w} height={h} rx={12} fill={P.shade} opacity={0.3}/>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill={dead ? P.paper : P.white} stroke={P.ink} strokeWidth={6}/>
      <Tx y={size * 0.36} size={size} fill={dead ? P.gray : P.ink}>{text}</Tx>
      {sl > 0 ? <line x1={-w / 2 - 28} y1={h * 0.36} x2={-w / 2 - 28 + (w + 56) * sl} y2={h * 0.36 - h * 0.72 * sl} stroke={P.red} strokeWidth={size * 0.17} strokeLinecap="round"/> : null}
    </g>
  );
};
const KeepBar: React.FC<{id: string; x: number; y: number; h: number; len: number; start: number; label?: string; text?: string}> = ({id, x, y, h, len, start, label = "", text = ""}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  if (f < start) return null;
  const w = Math.max(8, len * spr(f, start, fps, 17, 120));
  const ns = Math.min(88, (len - 40) / (Math.max(1, text.length) * 0.5));
  const room = len - tw(text, ns, 0.5) - 86;
  const ls = Math.min(46, room / (Math.max(1, label.length) * 0.52));
  const inside = ls >= 32;
  return (
    <g>
      <clipPath id={id}><rect x={x} y={y - 6} width={w} height={h + 12}/></clipPath>
      <rect x={x + 8} y={y + 10} width={w} height={h} rx={6} fill={P.shade} opacity={0.28}/>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={P.gold} stroke={P.ink} strokeWidth={5} strokeLinejoin="round"/>
      <g clipPath={`url(#${id})`}>
        {inside ? <Tx x={x + 26} y={y + h / 2 + ls * 0.36} size={ls} anchor="start">{label}</Tx> : null}
        <Tx x={x + len - 24} y={y + h / 2 + ns * 0.36} size={ns} anchor="end" ls={0}>{text}</Tx>
      </g>
      {!inside && w >= len - 2 ? <Tx x={x + len + 20} y={y + h / 2 + 14} size={38} anchor="start">{label}</Tx> : null}
    </g>
  );
};

const Keep: React.FC<SP> = ({s, n, T, b}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const uid = idOf(b);
  const total = Number(s.total) > 0 ? Number(s.total) : 100;
  const was = s.was && Number(s.was.v) > 0 ? s.was : null;
  const now = s.now && Number(s.now.v) > 0 ? s.now : null;
  const cur = React.useContext(CurCtx);
  const label = s.label || `${curOf([was?.text, now?.text], cur)}${fmtIN(total)}`;
  const guesses: any[] = s.guesses || [];
  const zoom = !!(was || now);
  const tWas = was ? at(T, was.at) : 1e9, tNow = now ? at(T, now.at) : 1e9;
  const tZ = zoom ? Math.min(tWas, tNow) : 1e9;
  const tGlide = tZ - 30, tSnip = tZ - 20, tSplit = tZ - 14, tMove = tZ - 13, tPanel = tZ - 7;
  const tMiss = s.missing ? at(T, s.missing.at) : 1e9, tAsk = s.ask ? at(T, s.ask.at) : 1e9;

  // The note, in its own coordinates (origin at its centre). It lands big in the middle, slides left when the
  // first guess arrives, and the "camera" pulls back to the top left for the zoom.
  const NW = 800, NH = 372, R = 96;
  const sliceW = Math.max(12, NW * clamp01(Number((was || now)?.v ?? 0) / total));
  const land = spring({frame: f, fps, config: {damping: 13, stiffness: 230, mass: 0.7}});
  const m = guesses.length;
  const tG = m ? Math.min(...guesses.map((g: any) => at(T, g.at))) - 10 : 1e9;
  const m1 = spr(f, tG, fps, 15, 120), mv = spr(f, tMove, fps, 16, 110);
  const k = lerp(lerp(1.2, 1, m1), 0.6, mv), gx = lerp(lerp(960, 600, m1), 362, mv), gy = lerp(600, 400, mv);
  const split = f >= tSplit, sep = 16 * spr(f, tSplit, fps, 9, 200), snip = prog(f, tSnip, 6);
  const fs = Math.min(f, tGlide), q = spr(f, tGlide, fps, 16, 130);
  const lens = {
    x: lerp(235 + 85 * Math.sin((fs - 12) / 42), NW / 2 - sliceW / 2 + sep, q),   // scans the right-hand end, clear of the numeral
    y: lerp(34 * Math.sin(fs / 25) + 4, 0, q) + (q > 0.98 ? 4 * Math.sin(f / 13) : 0),
  };
  const lp = spr(f, 10, fps, 11, 160);
  const shake = (t0: number, amp: number) => (f >= t0 && f < t0 + 12 ? amp * Math.sin((f - t0) * 2.4) * (1 - (f - t0) / 12) : 0);
  const sy = shake(4, 8) + shake(tAsk + 3, 9);
  const noteProps = {w: NW, h: NH, label, sliceW, snip, split, sep};

  // guesses: big beside the note, then small in a row along the top once the zoom opens
  const gsize = m <= 2 ? 120 : m <= 4 ? 96 : 74, grows = Math.ceil(m / 2), G2 = 0.5;
  let gcx = 730, gcy = 326;
  const gl = guesses.map((g: any, i: number) => {
    const text = String(g.text ?? ""), size = Math.min(gsize, (m > 2 ? 292 : 400) / (Math.max(1, text.length) * 0.52 + 0.9));
    const w2 = (tw(text, size) + size * 0.9) * G2;
    const p1 = m === 1 ? {x: 1480, y: 600} : m === 2 ? {x: i ? 1600 : 1360, y: i ? 715 : 475}
      : {x: i % 2 ? 1648 : 1338, y: 600 + (Math.floor(i / 2) - (grows - 1) / 2) * gsize * 1.95 + (i % 2 ? 24 : -24)};
    if (gcx + w2 > 1180 && gcx > 730) { gcx = 730; gcy += size * 1.5 * G2 + 14; }
    const p2 = {x: gcx + w2 / 2, y: gcy}; gcx += w2 + 16;
    return {text, size, start: at(T, g.at), x: lerp(p1.x, p2.x, mv), y: lerp(p1.y, p2.y, mv), right: p2.x + w2 / 2, row: gcy};
  });
  const zx0 = m ? Math.max(...gl.filter((g: any) => g.row === 326).map((g: any) => g.right)) + 40 : 760;

  // the zoom panel
  const PX = 122, PY = 552, PW = 1690, PH = 360, X0 = PX + 40, LMAX = PW - 80, BH = 100;
  const vmax = Math.max(Number(was?.v ?? 0), Number(now?.v ?? 0)) || 1;
  const lenOf = (o: any) => LMAX * Number(o.v) / vmax;
  const rowY = [PY + 28, PY + 146];
  const pp = spr(f, tPanel, fps, 15, 130);
  const LX = gx + k * lens.x, LY = gy + k * lens.y, LR = k * R;
  const AX = 362 + 0.6 * (NW / 2 - sliceW / 2 + 16), AY = 400;   // where the magnifier ends up: the panel grows out of it
  const pxy = (x: number, y: number) => ({x: AX + (x - AX) * pp, y: AY + (y - AY) * pp});
  const cL = pxy(PX + 8, PY), cR = pxy(PX + PW - 8, PY);
  const both = !!(was && now), shortIsNow = both && Number(now.v) <= Number(was.v);
  const gapX = both ? X0 + Math.min(lenOf(was), lenOf(now)) : X0 + LMAX, gapW = both ? Math.abs(lenOf(was) - lenOf(now)) : 0;
  const gapY = shortIsNow || !both ? rowY[1] : rowY[0], tGap = Math.max(was ? tWas : 0, now ? tNow : 0) + 13, gp = spr(f, tGap, fps, 11, 180);
  const gapCol = shortIsNow ? P.red : P.green;
  const floorY = PY + PH - 14, CR = 25;
  const mText = String(s.missing?.text ?? ""), mSize = Math.min(52, 640 / (Math.max(1, mText.length) * 0.52 + 0.9));
  const mW = tw(mText, mSize) + mSize * 0.9, cSpan = 5 * 54, gapC = gapX + gapW / 2;
  const coinC = Math.max(X0 + cSpan / 2 + 24, Math.min(PX + PW - 46 - cSpan / 2, gapC));
  const chipLeft = coinC - cSpan / 2 - 52 - mW >= X0;   // the chip goes left of the coins when there is room
  const idle = f - tMiss - 70, pulse = (d: number) => { const b = idle - d; return b > 0 && b % 54 < 10 ? Math.sin(Math.PI * (b % 54) / 10) : 0; };
  const aText = String(s.ask?.text ?? ""), aMax = 1800 - zx0, aSize = Math.min(124, aMax / (Math.max(1, aText.length) * 0.55 + 0.95));

  return (
    <IStage n={n}>
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      <g transform={`translate(0 ${sy})`}>
        <g transform={`translate(${gx} ${gy}) scale(${k})`}>
          <g transform={`translate(0 ${-40 * (1 - land)}) rotate(${5 * (1 - land)}) scale(${1.22 - 0.22 * land})`}>
            <rect x={-NW / 2 + 12 + 14 * (1 - land)} y={-NH / 2 + 14 + 16 * (1 - land)} width={NW + (split ? sep : 0)} height={NH} rx={16} fill={P.shade} opacity={0.3}/>
            <BigNote {...noteProps} id={`kp-n1-${uid}`}/>
          </g>
          {f >= 4 && f < 13 ? [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const a = (i * 45 + 22) * Math.PI / 180, p = (f - 4) / 9, r1 = 1.06 + 0.1 * p, r2 = 1.12 + 0.3 * p;
            return <line key={i} x1={Math.cos(a) * NW * 0.56 * r1} y1={Math.sin(a) * NH * 0.7 * r1} x2={Math.cos(a) * NW * 0.56 * r2} y2={Math.sin(a) * NH * 0.7 * r2} stroke={P.ink} strokeWidth={7} strokeLinecap="round"/>;
          }) : null}
        </g>
        {/* zoom lines from the magnifier down to the panel */}
        {zoom && f >= tPanel ? <g>
          <path d={`M ${LX - LR * 0.8} ${LY + LR * 0.62} L ${LX + LR * 0.8} ${LY + LR * 0.62} L ${cR.x} ${cR.y} L ${cL.x} ${cL.y} Z`} fill={P.cream} opacity={0.3}/>
          <line x1={LX - LR * 0.8} y1={LY + LR * 0.62} x2={cL.x} y2={cL.y} stroke={P.ink} strokeWidth={4} strokeLinecap="round"/>
          <line x1={LX + LR * 0.8} y1={LY + LR * 0.62} x2={cR.x} y2={cR.y} stroke={P.ink} strokeWidth={4} strokeLinecap="round"/>
        </g> : null}
        {gl.map((g: any, i: number) => <GuessChip key={i} x={g.x} y={g.y} text={g.text} size={g.size} start={g.start} rot={i % 2 ? 3 : -4} k={lerp(1, G2, mv)}/>)}
        {/* the magnifier: scans the note, then locks on the slice */}
        {f >= 10 ? <g transform={`translate(${gx} ${gy}) scale(${k})`}>
          <clipPath id={`kp-lens-${uid}`}><circle cx={lens.x} cy={lens.y} r={(R - 7) * (0.4 + 0.6 * lp)}/></clipPath>
          <g clipPath={`url(#kp-lens-${uid})`}>
            <circle cx={lens.x} cy={lens.y} r={R} fill={P.tan}/>
            <g transform={`translate(${lens.x} ${lens.y}) scale(1.38) translate(${-lens.x} ${-lens.y})`}><BigNote {...noteProps} id={`kp-n2-${uid}`}/></g>
          </g>
          <g transform={`translate(${lens.x} ${lens.y}) scale(${0.4 + 0.6 * lp})`}><Lens r={R}/></g>
        </g> : null}
        {/* the panel: the slice blown up into two bars */}
        {zoom && f >= tPanel ? <g transform={`translate(${AX} ${AY}) scale(${pp}) translate(${-AX} ${-AY})`}>
          <rect x={PX} y={PY} width={PW} height={PH} rx={14} fill={P.cream} stroke={P.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
          {was ? <KeepBar id={`kp-b0-${uid}`} x={X0} y={rowY[0]} h={BH} len={lenOf(was)} start={tWas} label={was.label} text={was.text}/> : null}
          {now ? <KeepBar id={`kp-b1-${uid}`} x={X0} y={rowY[1]} h={BH} len={lenOf(now)} start={tNow} label={now.label} text={now.text}/> : null}
          {both && gapW > 2 && f >= tGap ? <g transform={`translate(${gapX + gapW / 2} ${gapY + BH / 2}) scale(${(0.3 + 0.7 * gp) * (1 + 0.05 * pulse(0))} ${1 + 0.07 * pulse(0)})`}>
            <rect x={-gapW / 2 + 5} y={-BH / 2 + 2} width={Math.max(4, gapW - 7)} height={BH - 4} rx={5} fill={P.white} stroke={gapCol} strokeWidth={6} strokeDasharray="15 10" strokeDashoffset={-f * 0.9}/>
          </g> : null}
          {s.missing && f >= tMiss ? [0, 1, 2, 3, 4, 5].map((i) => {
            const t = f - tMiss - i * 3; if (t < 0) return null;
            const x0 = gapC + ((i % 3) - 1) * Math.min(30, gapW * 0.25), y0 = gapY + BH / 2, x1 = coinC + ([3, 2, 4, 1, 5, 0][i] - 2.5) * 54;
            const x = lerp(x0, x1, 1 - Math.exp(-Math.max(0, t - 10) / 10)), y = y0 + bounce(t, floorY - CR - y0, 1.15, 0.5 - (i % 3) * 0.05);
            const rest = 5 * Math.sin((f + i * 23) / 16) * clamp01((t - 55) / 25);
            return <Token key={i} x={x} y={y - 13 * pulse(6 + [3, 2, 4, 1, 5, 0][i] * 3)} r={CR} fill={P.gold} rot={(x - x0) / CR * 57.3 + rest}/>;
          }) : null}
          {s.missing ? <Chip x={chipLeft ? coinC - cSpan / 2 - 52 : coinC + cSpan / 2 + 52} y={floorY - mSize * 0.75 - 2} start={tMiss + 5} text={mText} size={mSize} fill={P.red} color={P.white} rot={-2 + 2.5 * pulse(3)} anchor={chipLeft ? "end" : "start"}/> : null}
        </g> : null}
        {!zoom && s.missing ? <Chip x={600} y={870} start={tMiss} text={mText} size={52} fill={P.red} color={P.white} rot={-3}/> : null}
        {s.ask ? <Slam x={zoom ? (zx0 + 1800) / 2 : 1400} y={zoom ? 390 : 870} start={tAsk} text={aText} size={aSize}/> : null}
      </g>
      <IStamps s={s} T={T}/>
    </IStage>
  );
};

// =====================================================================================================
// note
// =====================================================================================================
const LBL = 32, NUM = 70, ICO = 74, CH = 122;           // two-line label card
const BL = 44, BN = 92, BI = 92, BCH = 122;             // one-line card for a very wide piece
const cardWidth = (g: any) => 22 + (g.icon ? ICO + 12 : 0) + Math.max(tw(g.label, LBL, 0.54), tw(g.text, NUM, 0.5)) + 24;
const bigWidth = (g: any) => 26 + (g.icon ? BI + 16 : 0) + tw(g.label, BL, 0.54) + 24 + tw(g.text, BN, 0.5) + 30;
// Label card of one piece: icon, name, amount.
const PieceCard: React.FC<{x: number; y: number; start: number; g: any; w: number; col: string; big?: boolean; shadow?: boolean}> = ({x, y, start, g, w, col, big, shadow}) => {
  const f = useCurrentFrame();
  const h = big ? BCH : CH, ic = big ? BI : ICO, tx = -w / 2 + (big ? 26 : 22) + (g.icon ? ic + (big ? 16 : 12) : 0);
  return (
    <Pop x={x} y={y} start={start} from={0.5}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill={P.white} stroke={P.ink} strokeWidth={4} style={shadow ? {filter: "url(#vshadow)"} : undefined}/>
      <rect x={-w / 2 + 2} y={-h / 2 + 2} width={10} height={h - 4} fill={col}/>
      {g.icon ? <g transform={`translate(${-w / 2 + (big ? 26 : 22) + ic / 2} 0) rotate(${3 * Math.sin((f + x) / 19)})`}><Icon name={g.icon} size={ic}/></g> : null}
      {big ? <>
        <Tx x={tx} y={BL * 0.36} size={BL} anchor="start">{g.label}</Tx>
        <Tx x={tx + tw(g.label, BL, 0.54) + 24} y={BN * 0.36} size={BN} anchor="start" ls={0}>{g.text}</Tx>
      </> : <>
        <Tx x={tx} y={-h / 2 + 40} size={LBL} anchor="start">{g.label}</Tx>
        <Tx x={tx} y={h / 2 - 14} size={NUM} anchor="start" ls={0}>{g.text}</Tx>
      </>}
    </Pop>
  );
};
// Note paper for a bar: rounded rect, inner rule, roundels, and either the denomination or a wavy rule.
const NotePaper: React.FC<{x: number; y: number; w: number; h: number; label?: string}> = ({x, y, w, h, label}) => {
  const size = Math.min(h * 0.62, w * 0.3 / (Math.max(1, (label || "").length) * 0.52));
  let wave = `M ${x + h * 1.3} ${y + h / 2}`;
  for (let i = 0; x + h * 1.3 + (i + 1) * 46 < x + w - h * 1.3; i++) wave += ` q 23 ${i % 2 ? 22 : -22} 46 0`;
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <rect x={x} y={y} width={w} height={h} rx={12} fill={NOTE} stroke={P.ink} strokeWidth={5}/>
      <rect x={x + 12} y={y + 12} width={w - 24} height={h - 24} rx={5} fill="none" stroke={P.ink} strokeWidth={2.5} opacity={0.45}/>
      {[x + Math.min(h * 0.72, w * 0.16), x + w - Math.min(h * 0.72, w * 0.16)].map((cx, i) => <g key={i} opacity={0.5}>
        <circle cx={cx} cy={y + h / 2} r={Math.min(h * 0.26, w * 0.1)} fill="none" stroke={P.ink} strokeWidth={3}/>
        <circle cx={cx} cy={y + h / 2} r={Math.min(h * 0.15, w * 0.058)} fill="none" stroke={P.ink} strokeWidth={2.5}/>
      </g>)}
      {label ? <Tx x={x + w / 2} y={y + h / 2 + size * 0.36} size={size}>{label}</Tx>
        : <path d={wave} fill="none" stroke={P.ink} strokeWidth={3} opacity={0.35}/>}
    </g>
  );
};
// The tag tied to the left end of the note: says what the whole bar is worth.
const TotalTag: React.FC<{x: number; y: number; text: string; size: number}> = ({x, y, text, size}) => {
  const f = useCurrentFrame();
  const w = tw(text, size) + size * 1.25, h = size * 1.42;
  return (
    <g transform={`translate(${x} ${y}) rotate(${2.6 * Math.sin(f / 17)})`} strokeLinejoin="round">
      <line x1={-12} y1={0} x2={14} y2={0} stroke={P.ink} strokeWidth={4}/>
      <path d={`M ${-w} ${-h / 2} H ${-h * 0.42} L 0 0 L ${-h * 0.42} ${h / 2} H ${-w} Z`} fill={P.mustard} stroke={P.ink} strokeWidth={4}/>
      <circle cx={-h * 0.36} cy={0} r={5.5} fill={P.white} stroke={P.ink} strokeWidth={3}/>
      <Tx x={-w / 2 - h * 0.18} y={size * 0.36} size={size} ls={0}>{text}</Tx>
    </g>
  );
};

const NoteScene: React.FC<SP> = ({s, n, T, b}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig(); const uid = idOf(b);
  const all: any[] = (s.segs || []).filter((g: any) => g && Number(g.v) > 0);
  const sum = all.reduce((a, g) => a + Number(g.v), 0) || 1;
  const doneSet = new Set<string>(s.done || []);
  const showAt: Record<string, number> = {};
  (s.show || []).forEach((h: any) => { if (h && h.key != null) showAt[h.key] = at(T, h.at); });
  const cutOf = (key: string) => (doneSet.has(key) ? -999 : key in showAt ? showAt[key] : 1e9);
  const zoom = !!s.zoom && all.length > 1;
  const work = zoom ? all.slice(1) : all;
  const wsum = work.reduce((a, g) => a + Number(g.v), 0) || 1;
  const cur = React.useContext(CurCtx);
  const label = s.label || (all.length || Number(s.total) > 0 ? `${curOf(all.map((g) => g.text), cur)}${fmtIN(Number(s.total) > 0 ? Number(s.total) : sum)}` : "");

  // the working bar and its pieces
  const X0 = zoom ? 150 : 312, BW = zoom ? 1620 : 1488, BH = zoom ? 140 : 150;
  let acc = 0, oj = 0;
  const pcs = work.map((g, i) => {
    const w = BW * Number(g.v) / wsum, x = X0 + BW * acc / wsum; acc += Number(g.v);
    const bw = bigWidth(g), cw0 = cardWidth(g);
    const side = w - 14 >= bw + 70 ? "big" : w - 14 >= cw0 + 14 ? "in" : oj++ % 2 === 0 ? "below" : "above";
    return {g, i, x, w, cw: side === "big" ? bw : cw0, side, cut: cutOf(g.key), col: pal(g.color), cx: x + w / 2};
  });
  const vis = pcs.filter((p) => p.cut < 1e8);   // layout only has to make room for what this beat shows
  const hasOut = vis.some((p) => p.side === "above" || p.side === "below"), hasAbove = vis.some((p) => p.side === "above");
  const Y0 = zoom ? 485 : hasOut ? (hasAbove ? 425 : 370) : 305;
  const DROP = zoom ? 28 : hasOut ? 34 : 196;
  const dropOf = (p: any) => DROP * (p.cut < 0 ? 1 : spr(f, p.cut + 5, fps, 10, 150));
  const bobOf = (p: any) => (DROP > 100 ? 2 * Math.sin((f + p.i * 40) / 23) : 2.5 * Math.sin((f + p.i * 40) / 21));
  const isCut = (p: any) => f >= p.cut + 5;
  // outside cards: keep them over their piece where possible, push apart where they would collide
  (["above", "below"] as const).forEach((side) => {
    const it = vis.filter((p) => p.side === side);
    let lim = SAFE.left + 36;
    it.forEach((p) => { p.cx = Math.max(p.cx, lim + p.cw / 2); lim = p.cx + p.cw / 2 + 14; });
    lim = SAFE.right - 22;
    for (let j = it.length - 1; j >= 0; j--) { const p = it[j]; p.cx = Math.min(p.cx, lim - p.cw / 2); lim = p.cx - p.cw / 2 - 14; }
  });
  const cardY = (side: string, dy: number) => side === "above" ? Y0 - 14 - CH / 2 : side === "below" ? Y0 + BH + DROP + 30 + CH / 2 : Y0 + dy + BH / 2;

  // scissors: where and when they cut in this beat, and where they wait afterwards
  const ev: {x: number; t: number}[] = [];
  pcs.forEach((p, i) => {
    if (p.cut < 0 || p.cut > 1e8) return;
    const r = pcs[i + 1], l = pcs[i - 1];
    if (r && r.cut > p.cut) ev.push({x: p.x + p.w, t: p.cut});
    else if (l && l.cut > p.cut) ev.push({x: p.x, t: p.cut});
  });
  ev.sort((a, b) => a.t - b.t);
  const later = pcs.filter((p, i) => p.cut > 1e8 && pcs[i + 1] && pcs[i + 1].cut > 1e8).map((p) => p.x + p.w);   // cuts still to come in later beats
  const parkX = zoom && later.length ? later[0] : X0 + BW - 34;
  const sdir = zoom ? 1 : -1, ssize = zoom ? 84 : 96, hoverY = zoom ? Y0 - 62 : Y0 + BH + 84, cutY = zoom ? Y0 + BH - 30 : Y0 + 36;
  const t0 = ev.length ? ev[0].t : 1e9;
  // With a long lead-in on a fresh note, the note first stretches into the bar, then the scissors run along it
  // and mark every piece before coming back for the first cut.
  const intro = !zoom && t0 > 130 && t0 < 1e8 && pcs.every((p) => p.cut >= 0);
  const mo = intro ? spr(f, 20, fps, 16, 110) : 1, sw0 = 52, sw1 = t0 - 62, sw2 = t0 - 34, xa = X0 + 60, xb = X0 + BW - 40;
  const markAt = (x: number) => (intro ? sw0 + (sw1 - sw0) * clamp01((x - xa) / (xb - xa)) : -99);
  let sx = ev.length ? ev[0].x : 0, syy = hoverY, sopen = 15 + 9 * Math.sin(f / 5);
  const io = Easing.inOut(Easing.cubic);
  ev.forEach((e, j) => {
    if (f < e.t) return;
    const nx = j + 1 < ev.length ? ev[j + 1].x : parkX;
    syy = f < e.t + 6 ? lerp(hoverY, cutY, io(clamp01((f - e.t) / 6))) : lerp(cutY, hoverY, io(clamp01((f - e.t - 6) / 7)));
    sx = lerp(e.x, nx, io(clamp01((f - e.t - 13) / 16)));
    if (f < e.t + 13) sopen = 3 + 15 * Math.abs(Math.sin((f - e.t) * 1.2));
  });
  if (ev.length && f < t0) {
    if (intro) sx = f < sw1 ? lerp(xa, xb, clamp01((f - sw0) / (sw1 - sw0))) : lerp(xb, ev[0].x, io(clamp01((f - sw1) / (sw2 - sw1))));
    else if (t0 > 36) {   // come in along the paper that is still uncut, never across pieces already dropped
      const from = Math.min(ev[0].x, Math.max(X0 + 30, ...pcs.filter((p) => p.cut < 0).map((p) => p.x + p.w)) + 40);
      sx = lerp(from, ev[0].x, io(clamp01(f / (t0 - 12))));
    }
  }
  // afterwards, in zoom mode, they pace between the next two places to cut
  const tEnd = ev.length ? ev[ev.length - 1].t + 30 : 0;
  if (zoom && ev.length && later.length > 1 && f > tEnd) sx = lerp(later[0], later[1], 0.5 - 0.5 * Math.cos((f - tEnd) / 36));
  syy += 5 * Math.sin(f / 11);
  const leave = ev.length > 0 && (!pcs.some((p) => p.cut > 1e8) || (!zoom && hasOut));
  const sk = (leave ? 1 - prog(f, ev[ev.length - 1].t + 18, 6, Easing.in(Easing.cubic)) : 1) * (intro ? spr(f, 46, fps, 11, 170) : 1);
  // dashed marks where the paper still to be cut will be cut (marks closer than 10 px are merged)
  const marks: {x: number; t: number}[] = [];
  pcs.forEach((p, i) => {
    const r = pcs[i + 1]; if (!r || f >= p.cut + 5 || f >= r.cut + 5) return;
    if (marks.length && r.x - marks[marks.length - 1].x < 10) return;
    marks.push({x: r.x, t: markAt(r.x)});
  });
  if (intro) marks.forEach((mk) => { if (f >= mk.t - 2 && f < mk.t + 4) sopen = 2; });

  const tagFit = (x: number) => (x - 14 - SAFE.left - 24) / (Math.max(1, label.length) * 0.52 + 1.25);
  // the small whole-note bar on top (zoom mode only)
  const SX = 300, SW = 1500, SY = 278, SH = 56;
  const first = all[0], fw = zoom ? SW * Number(first.v) / sum : 0, firstCut = zoom && f >= cutOf(first.key) + 5;
  const zin = prog(f, 0, 9);
  const firstText = zoom ? `${first.label ?? ""}  ${first.text ?? ""}`.trim() : "";

  // callouts: a row of chips along the bottom, right-aligned, wrapping upward if there are too many
  const co: any[] = s.callouts || [];
  const rowW = (items: any[], sz: number) => items.reduce((a, c) => a + tw(c.text, sz) + sz * 0.9, 0) + 24 * Math.max(0, items.length - 1);
  let cs = 58; while (cs > 44 && rowW(co, cs) > 1700) cs -= 2;
  const crow: any[][] = [[]];
  co.forEach((c) => { const r = crow[crow.length - 1]; if (r.length && rowW([...r, c], cs) > 1700) crow.push([c]); else r.push(c); });
  const callY = zoom || hasOut ? 868 : 815;

  const outline = !zoom && !hasOut;   // big drop: leave a dashed outline where the note was
  const runs: {a: number; b: number}[] = [];   // maximal runs of uncut pieces
  pcs.forEach((p, i) => { if (isCut(p)) return; const r = runs[runs.length - 1]; if (r && r.b === i - 1) r.b = i; else runs.push({a: i, b: i}); });

  return (
    <IStage n={n}>
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      {zoom ? <g>
        {/* whole note, small: first piece dimmed, the rest boxed in red and zoomed */}
        <clipPath id={`nt-small-${uid}`}><rect x={SX} y={SY} width={SW} height={SH} rx={9}/></clipPath>
        <g clipPath={`url(#nt-small-${uid})`}>
          <rect x={SX} y={SY} width={SW} height={SH} fill={NOTE}/>
          {firstCut ? <rect x={SX} y={SY} width={fw} height={SH} fill={pal(first.color)}/> : null}
          {firstCut ? <rect x={SX} y={SY} width={fw} height={SH} fill={P.tan} opacity={0.38}/> : null}
          {pcs.map((p) => isCut(p) ? <rect key={p.i} x={SX + fw + (p.x - X0) * (SW - fw) / BW} y={SY} width={Math.max(2, p.w * (SW - fw) / BW)} height={SH} fill={p.col}/> : null)}
        </g>
        <rect x={SX} y={SY} width={SW} height={SH} rx={9} fill="none" stroke={P.ink} strokeWidth={4}/>
        <line x1={SX + fw} y1={SY} x2={SX + fw} y2={SY + SH} stroke={P.ink} strokeWidth={4}/>
        {firstCut && fw > tw(firstText, 34) + 40 ? <Tx x={SX + fw / 2} y={SY + SH / 2 + 12} size={34} fill={isDark(pal(first.color)) ? P.white : P.ink}>{firstText}</Tx> : null}
        <path d={`M ${SX + fw - 5} ${SY + SH + 7} L ${SX + SW + 5} ${SY + SH + 7} L ${X0 + BW} ${Y0} L ${X0} ${Y0} Z`} fill={P.cream} opacity={zin >= 1 ? 0.28 : 0}/>
        <line x1={SX + fw - 5} y1={SY + SH + 7} x2={lerp(SX + fw - 5, X0, zin)} y2={lerp(SY + SH + 7, Y0, zin)} stroke={P.ink} strokeWidth={4} strokeLinecap="round"/>
        <line x1={SX + SW + 5} y1={SY + SH + 7} x2={lerp(SX + SW + 5, X0 + BW, zin)} y2={lerp(SY + SH + 7, Y0, zin)} stroke={P.ink} strokeWidth={4} strokeLinecap="round"/>
        <rect x={SX + fw - 5} y={SY - 7} width={SW - fw + 10} height={SH + 14} rx={8} fill="none" stroke={P.red} strokeWidth={6} strokeDasharray="18 9" strokeDashoffset={-f * 0.7}/>
        <TotalTag x={SX - 14} y={SY + SH / 2} text={label} size={Math.min(40, tagFit(SX))}/>
      </g> : label ? <Pop x={X0 - 14} y={Y0 + BH / 2} start={intro ? 40 : -99}><TotalTag x={0} y={0} text={label} size={Math.min(54, tagFit(X0))}/></Pop> : null}

      {/* where the bar was */}
      {all.length && (outline || zoom) && f >= (intro ? t0 : 0) ? <rect x={X0} y={Y0} width={BW} height={BH} rx={12} fill="none" stroke={P.ink} strokeWidth={3} strokeDasharray="14 12" opacity={0.55}/> : null}
      {/* uncut paper (on a fresh note with a long lead-in it starts as a plain note and stretches into the bar) */}
      <clipPath id={`nt-uncut-${uid}`}>{runs.map((r, i) => <rect key={i} x={pcs[r.a].x - (r.a === 0 ? 400 : 0)} y={Y0 - 400} width={pcs[r.b].x + pcs[r.b].w - pcs[r.a].x + (r.a === 0 ? 400 : 0) + (r.b === pcs.length - 1 ? 400 : 0)} height={BH + 800}/>)}</clipPath>
      <g clipPath={`url(#nt-uncut-${uid})`} style={all.length ? undefined : {display: "none"}}>
        <NotePaper x={lerp(960 - 380, X0, mo)} y={lerp(520 - 170, Y0, mo)} w={lerp(760, BW, mo)} h={lerp(340, BH, mo)} label={zoom ? undefined : label}/>
      </g>
      {marks.map((mk, i) => {
        if (f < mk.t) return null;
        const pr = clamp01((f - mk.t + 1) / 5);
        return <line key={i} x1={mk.x} y1={Y0 + BH - 7} x2={mk.x} y2={Y0 + BH - 7 - (BH - 14) * pr} stroke={P.ink} strokeWidth={3.5} strokeDasharray="9 8" strokeDashoffset={-f * 0.35} opacity={0.75}/>;
      })}
      {runs.map((r, i) => <g key={i}>
        {r.a > 0 ? <line x1={pcs[r.a].x} y1={Y0} x2={pcs[r.a].x} y2={Y0 + BH} stroke={P.ink} strokeWidth={5}/> : null}
        {r.b < pcs.length - 1 ? <line x1={pcs[r.b].x + pcs[r.b].w} y1={Y0} x2={pcs[r.b].x + pcs[r.b].w} y2={Y0 + BH} stroke={P.ink} strokeWidth={5}/> : null}
      </g>)}
      {/* cut pieces: drop away, take their colour */}
      {pcs.map((p) => {
        if (!isCut(p)) return null;
        const dy = dropOf(p) + bobOf(p);
        const wipe = p.cut < 0 ? 1 : prog(f, p.cut + 5, 10), g2 = Math.min(3, p.w * 0.2), px = p.x + g2, pw = p.w - 2 * g2;
        // a very wide piece carries a slow belt of its own icon, so the slab is never dead
        const belt = p.side === "big" && p.g.icon && pw - p.cw > 360, nb = belt ? Math.floor(pw / 170) : 0, sp = belt ? pw / nb : 0;
        const bs = p.cut < 0 ? 1 : spr(f, p.cut + 18, fps, 11, 160);
        return (
          <g key={p.i} transform={`translate(0 ${dy})`}>
            <rect x={px + 7} y={Y0 + 9} width={pw} height={BH} rx={6} fill={P.shade} opacity={0.28}/>
            <rect x={px} y={Y0} width={pw} height={BH} rx={6} fill={NOTE}/>
            <rect x={px} y={Y0} width={pw * wipe} height={BH} rx={6} fill={p.col}/>
            {belt && bs > 0 ? <g>
              <clipPath id={`nt-belt${p.i}-${uid}`}><rect x={px + 4} y={Y0} width={pw - 8} height={BH}/></clipPath>
              <g clipPath={`url(#nt-belt${p.i}-${uid})`}>{Array.from({length: nb + 1}, (_, j) => {
                const bx = px + ((j * sp + f * 0.7) % (pw + sp)) - sp / 2;
                return <g key={j} transform={`translate(${bx} ${Y0 + BH / 2}) scale(${bs})`}>
                  <circle r={37} fill={P.cream} stroke={P.ink} strokeWidth={3.5}/>
                  <g transform={`rotate(${5 * Math.sin((f + j * 31) / 13)})`}><Icon name={p.g.icon} size={50}/></g>
                </g>;
              })}</g>
            </g> : null}
            <rect x={px} y={Y0} width={pw} height={BH} rx={6} fill="none" stroke={P.ink} strokeWidth={5} strokeLinejoin="round"/>
          </g>
        );
      })}
      {/* leaders and cards */}
      {vis.map((p) => {
        if (!isCut(p) || (p.side !== "above" && p.side !== "below")) return null;
        const lp2 = p.cut < 0 ? 1 : prog(f, p.cut + 10, 7), dy = dropOf(p) + bobOf(p);
        const x1 = p.x + p.w / 2, y1 = p.side === "above" ? Y0 + dy - 2 : Y0 + BH + dy + 2;
        const y2 = cardY(p.side, 0) + (p.side === "above" ? CH / 2 : -CH / 2);
        return <g key={p.i}>
          <line x1={x1} y1={y1} x2={lerp(x1, p.cx, lp2)} y2={lerp(y1, y2, lp2)} stroke={P.ink} strokeWidth={4} strokeLinecap="round"/>
          <circle cx={x1} cy={y1} r={7} fill={P.ink}/>
        </g>;
      })}
      {vis.map((p) => {
        const inside = p.side === "in" || p.side === "big";
        return <PieceCard key={p.i} x={p.cx} y={cardY(p.side, dropOf(p) + (inside ? bobOf(p) : 0))} start={p.cut < 0 ? -99 : p.cut + (inside ? 12 : 15)} g={p.g} w={p.cw} col={p.col} big={p.side === "big"} shadow={!inside}/>;
      })}
      {ev.map((e, j) => {
        if (f < e.t || f >= e.t + 5) return null;
        const pr = clamp01((f - e.t + 1) / 5), ya = zoom ? Y0 - 8 : Y0 + BH + 8, yb = zoom ? Y0 + BH + 8 : Y0 - 8;
        return <line key={j} x1={e.x} y1={ya} x2={e.x} y2={lerp(ya, yb, pr)} stroke={P.red} strokeWidth={6} strokeDasharray="14 9"/>;
      })}
      {ev.length && sk > 0 ? <g transform={`translate(${sx} ${syy}) scale(${sk})`}><Scissors open={sopen} dir={sdir} size={ssize}/></g> : null}

      {crow.map((r, ri) => {
        let xr = SAFE.right - 20; const y = callY - (crow.length - 1 - ri) * (cs * 1.5 + 18);
        return [...r].reverse().map((c, j) => {
          const x = xr; xr -= tw(c.text, cs) + cs * 0.9 + 24;
          return <Chip key={`${ri}-${j}`} x={x} y={y} start={at(T, c.at)} text={String(c.text ?? "")} size={cs} fill={c.red ? P.red : P.white} color={c.red ? P.white : P.ink} rot={c.red ? -2 : 0} anchor="end"/>;
        });
      })}
      <IStamps s={s} T={T} y={callY - 120}/>
    </IStage>
  );
};

// =====================================================================================================
// case
// =====================================================================================================
const SuspectCard: React.FC<{x: number; y: number; w: number; h: number; start: number; g: any; col: string; unit: string; rot: number}> = ({x, y, w, h, start, g, col, unit, rot}) => {
  const lines = (() => { const l = String(g.label ?? ""); return fit(l, 38, w - 30) >= 34 ? [l] : wrap2(l); })();
  const ls = Math.min(38, ...lines.map((l) => fit(l, 38, w - 30)));
  const fg = isDark(col) ? P.white : P.ink, band = 122, vt = String(g.v ?? ""), fr = 96;
  const ns = Math.min(84, (w - fr - 46) / (Math.max(1, vt.length) * 0.52)), us = Math.min(34, (w - fr - 46) / (Math.max(1, unit.length) * 0.54));
  const tx = -w / 2 + 14 + fr + (w - fr - 28) / 2;
  return (
    <Pop x={x + w / 2} y={y + h / 2} start={start} from={0.4} rot={rot}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={P.white} stroke={P.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
      <path d={`M ${-w / 2 + 2.5} ${-h / 2 + band} V ${-h / 2 + 10} a 8 8 0 0 1 8 -8 H ${w / 2 - 10} a 8 8 0 0 1 8 8 V ${-h / 2 + band} Z`} fill={col}/>
      <line x1={-w / 2} y1={-h / 2 + band} x2={w / 2} y2={-h / 2 + band} stroke={P.ink} strokeWidth={4}/>
      <rect x={-w / 2 + 14} y={-h / 2 + 13} width={fr} height={fr} rx={6} fill={P.cream} stroke={P.ink} strokeWidth={4}/>
      <Icon name={g.icon || "coin"} x={-w / 2 + 14 + fr / 2} y={-h / 2 + 13 + fr / 2} size={fr * 0.8}/>
      <Tx x={tx} y={-h / 2 + (unit ? 74 : 90)} size={ns} fill={fg} ls={0}>{vt}</Tx>
      {unit ? <Tx x={tx} y={-h / 2 + 110} size={us} fill={fg}>{unit}</Tx> : null}
      {lines.map((l, i) => <Tx key={i} x={0} y={-h / 2 + band + (h - band) / 2 + ls * 0.36 + (i - (lines.length - 1) / 2) * ls * 1.12} size={ls}>{l}</Tx>)}
    </Pop>
  );
};
// An empty place in the line-up: somebody not yet caught.
const EmptySlot: React.FC<{x: number; y: number; w: number; h: number; i: number}> = ({x, y, w, h, i}) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x + w / 2} ${y + h / 2})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={P.paper} fillOpacity={0.45} stroke={P.ink} strokeWidth={3.5} strokeDasharray="14 11" opacity={0.75}/>
      <g transform={`translate(0 ${h * 0.05}) rotate(${2.5 * Math.sin((f + i * 29) / 17)} 0 ${h * 0.4})`}>
        <circle cx={0} cy={-h * 0.2} r={h * 0.13} fill={P.gray}/>
        <path d={`M ${-h * 0.25} ${h * 0.36} v ${-h * 0.17} a ${h * 0.25} ${h * 0.25} 0 0 1 ${h * 0.5} 0 v ${h * 0.17} Z`} fill={P.gray}/>
        <text x={0} y={h * 0.31} fontFamily={COND} fontWeight={700} fontSize={h * 0.26} textAnchor="middle" fill={P.paper}>?</text>
      </g>
    </g>
  );
};
// The clue: a paper card that drops in, swings on its pin, and gets a red underline.
// A long clue is set on two lines so it can stay big.
const clueFit = (text: string, maxW: number, big: number, small: number) => {
  const one = fit(text, big, maxW);
  if (one >= big * 0.76) return {lines: [text], size: one};
  const lines = wrap2(text);
  return {lines, size: Math.min(small, ...lines.map((l) => fit(l, small, maxW)))};
};
const ClueCard: React.FC<{x: number; y: number; w: number; h: number; start: number; lines: string[]; size: number}> = ({x, y, w, h, start, lines, size}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  if (f < start) return null;
  const t = f - start, d = spr(f, start, fps, 15, 130), k = lines.length;
  const swing = 4.5 * Math.exp(-t / 12) * Math.cos(t / 3.2) + 0.8 * Math.sin(f / 21) - 1.5;
  const ul = prog(f, start + 12, 9), ulw = tw(lines[k - 1], size) + 10, by = (i: number) => size * 0.3 + (i - (k - 1) / 2) * size * 1.1 - (k > 1 ? size * 0.06 : 0);
  return (
    <g>
      <g transform={`translate(${x} ${y - h / 2 + 14 - (1 - d) * 420}) rotate(${swing}) translate(0 ${h / 2 - 14})`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill={P.cream} stroke={P.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
        {lines.map((l, i) => <Tx key={i} y={by(i)} size={size}>{l}</Tx>)}
        {ul > 0 ? <rect x={-ulw / 2} y={by(k - 1) + size * 0.14} width={ulw * ul} height={Math.max(7, size * 0.1)} fill={P.red}/> : null}
      </g>
      <g transform={`translate(${x} ${y - h / 2 + 20}) scale(0.8)`}><Pin x={0} y={0} start={start + 5}/></g>
    </g>
  );
};
// Paper under a kit Stamp that has to land on something busy (same slam as the Stamp itself).
const StampBack: React.FC<{x: number; y: number; start: number; text: string; size: number; rot: number}> = ({x, y, start, text, size, rot}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  if (f < start) return null;
  const k = 1.5 - 0.5 * spring({frame: f - start, fps, config: {damping: 14, stiffness: 260}});
  const w = text.length * size * 0.55 + 70, h = size * 1.6;
  return <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={P.cream} opacity={0.92} transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}/>;
};
// A large rubber stamp on a paper backing so it reads over the coloured board.
const BigStamp: React.FC<{x: number; y: number; start: number; text: string; size: number; rot?: number}> = ({x, y, start, text, size, rot = -7}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  if (f < start) return null;
  const k = 2.1 - 1.1 * spring({frame: f - start, fps, config: {damping: 14, stiffness: 250}});
  const w = tw(text, size, 0.55) + size * 0.8, h = size * 1.5;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={P.cream} opacity={0.93}/>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill="none" stroke={P.red} strokeWidth={14} filter="url(#vtorn)"/>
      <rect x={-w / 2 + 22} y={-h / 2 + 22} width={w - 44} height={h - 44} rx={6} fill="none" stroke={P.red} strokeWidth={5}/>
      <Tx y={size * 0.36} size={size} fill={P.red} ls={4}>{text}</Tx>
    </g>
  );
};

const Case: React.FC<SP> = ({s, n, T}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const total = Math.max(1, Math.round(Number(s.total) || 0));
  const unit = String(s.unit ?? ""), words = s.words || {};
  let acc = 0;
  const sus = [...(s.done || []).map((g: any) => ({g, t: -999})), ...(s.found || []).map((g: any) => ({g, t: at(T, g.at)}))].map((o, i) => {
    const v = Math.max(0, Math.round(Number(o.g.v) || 0)), a = acc; acc = Math.min(total, acc + v);
    return {...o, i, a, b: acc, col: pal(o.g.color ?? CYCLE[i % CYCLE.length], pal(CYCLE[i % CYCLE.length]))};   // a suspect may carry its own colour, so it matches its piece of the note
  });
  const accounted = acc, ks = sus.length, intro = ks === 0;

  // board and grid (column by column, so each suspect's coins form one band)
  const BX = 122, BY = 272, BWd = 1194, BHt = 384;
  let rows = 1, cols = total, pitch = 0;
  for (let r = 1; r <= 8; r++) { const c = Math.ceil(total / r), p = Math.min((BWd - 28) / c, (BHt - 28) / r, 112); if (p > pitch + 0.01) { rows = r; cols = c; pitch = p; } }
  const gx0 = BX + (BWd - cols * pitch) / 2, gy0 = BY + (BHt - rows * pitch) / 2, cr = pitch * 0.42;
  const pos = (j: number) => ({x: gx0 + (Math.floor(j / rows) + 0.5) * pitch, y: gy0 + ((j % rows) + 0.5) * pitch, c: Math.floor(j / rows)});
  const settle = -20 * (1 - spring({frame: f, fps, config: {damping: 11, stiffness: 190, mass: 0.7}}));   // drops in from just above

  // counter
  let count = 0, lastFlip = -99;
  sus.forEach((u) => { for (let j = u.a; j < u.b; j++) { const t0 = u.t < 0 ? -99 : u.t + (j - u.a) * 2 + 4; if (f >= t0) { count++; lastFlip = Math.max(lastFlip, t0); } } });
  const tick = f - lastFlip < 3 ? -6 : 0;

  // magnifier wanders over the coins nobody has explained yet
  const rem = total - accounted, tClosed = s.closed ? at(T, s.closed.at) : 1e9;
  const LRr = pitch * 0.92, lStart = intro ? cols * 2 + 8 : 6;
  const cx = (j: number) => pos(Math.min(total - 1, j)).x;
  const doneEnd = sus.reduce((a, u) => (u.t < 0 ? Math.max(a, u.b) : a), 0);
  let lx0 = cx(doneEnd), tLast = 0;
  sus.forEach((u) => { if (u.t >= 0) { lx0 += (cx(u.b) - cx(u.a)) * spr(f, u.t, fps, 16, 90); tLast = Math.max(tLast, u.t + (u.b - u.a) * 2); } });
  const lx1 = Math.max(lx0, Math.min(cx(total - 1), BX + BWd - LRr * 2));
  const lout = rem > 0 ? 0 : prog(f, tLast, 8, Easing.in(Easing.cubic));
  const lens = total - doneEnd > 0 && lout < 1 ? {x: lerp(lx0, lx1, 0.5 + 0.5 * Math.sin(f / 41 - 1.2)), y: gy0 + rows * pitch * (0.42 + 0.24 * Math.sin(f / 23))} : null;
  const lpop = spr(f, lStart, fps, 11, 160) * (1 - lout);

  // suspects' cards and the empty places beside them
  const want = Number(s.slots) > 0 ? Math.round(Number(s.slots)) : 6, nSlots = Math.max(ks, rem > 0 ? want : ks);
  const CWd = nSlots <= 6 ? 267 : (1682 - 14 * (nSlots - 1)) / nSlots, CGap = nSlots <= 6 ? 16 : 14, CY = 686, CHt = 224;
  const slotX = (i: number) => 122 + i * (CWd + CGap);
  const cardsRight = ks ? slotX(ks - 1) + CWd : 122;
  const clue = s.clue && s.clue.text ? s.clue : null;
  const clueBottom = !!clue && ks === 0;
  const cText = clue ? String(clue.text) : "", CLX = 534;
  const cFit = clueBottom ? clueFit(cText, 680, 104, 74) : clueFit(cText, 402, 66, 46);
  const cW = Math.min(770, Math.max(...cFit.lines.map((l) => tw(l, cFit.size))) + 110), cH = cFit.lines.length > 1 ? cFit.size * 2.2 + 30 : 190;
  // right column
  const RX = 1340, RW = 472;
  const nsz = Math.min(150, 190 / (String(total).length * 0.52));
  const ofText = `${words.of ?? "OF"} ${fmtIN(total)}`;

  // stamps: bottom right when the card row leaves room, otherwise beside or on the board
  const stamps = (s.stamps || []).map((st: any, i: number) => {
    const text = String(st.text ?? ""); let size = fit(text, 60, 900, 0.56); const sw0 = text.length * size * 0.55 + 70;
    let x = SAFE.right - sw0 / 2 - 20, y = Math.min(SAFE.bot - 70, SAFE.bot - 22 - size * 0.8 - sw0 * 0.0436) - i * 115, low = true;
    if (st.x == null && (SAFE.right - 20 - sw0 < cardsRight + 20 || y < CY + 40)) {
      low = false;
      if (!clue || clueBottom) { size = Math.min(size, (RW - 90) / (Math.max(1, text.length) * 0.55)); x = RX + RW / 2; y = 580 - i * 90; }
      else { x = BX + BWd - sw0 / 2 - 30; y = BY + BHt - 70 - i * 110; }
    }
    const sw = text.length * size * 0.55 + 70;
    return {text, size, x: st.x ?? x, y: st.y ?? y, start: at(T, st.at), rot: i % 2 ? 4 : -5, x0: (st.x ?? x) - sw / 2, x1: (st.x ?? x) + sw / 2, low: low && st.y == null};
  });
  // an empty place disappears under whatever lands on it
  const covered = (i: number) => {
    const a = slotX(i) - 12, b = slotX(i) + CWd + 12;
    if (clueBottom && f >= at(T, clue.at) + 4 && CLX + cW / 2 > a && CLX - cW / 2 < b) return true;
    return stamps.some((st: any) => st.low && f >= st.start && st.x1 > a && st.x0 < b);
  };

  return (
    <IStage n={n}>
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      <g transform={`translate(0 ${settle})`}>
        <rect x={BX + 9} y={BY + 12} width={BWd} height={BHt} rx={12} fill={P.shade} opacity={0.3}/>
        <rect x={BX} y={BY} width={BWd} height={BHt} rx={12} fill={P.paper} stroke={P.ink} strokeWidth={5}/>
        {[[BX + 22, BY + 22], [BX + BWd - 22, BY + 22], [BX + 22, BY + BHt - 22], [BX + BWd - 22, BY + BHt - 22]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill={P.ink}/>)}
        {Array.from({length: total}, (_, j) => {
          const p = pos(j), u = sus.find((q) => j >= q.a && j < q.b);
          let sxk = 1, hop = 0, found = false;
          if (u) { const ph = u.t < 0 ? 1 : clamp01((f - u.t - (j - u.a) * 2) / 8); found = ph >= 0.5; sxk = Math.max(0.06, Math.abs(Math.cos(Math.PI * ph))); hop = -14 * Math.sin(Math.PI * ph); }
          let kk = 1;
          if (intro) { const t0 = p.c * 2 + (j % rows) * 0.8; if (f < t0) return null; kk = spr(f, t0, fps, 10, 190); }
          if (lens && !found) { const d = Math.hypot(p.x - lens.x, p.y - lens.y) / (LRr * 1.15); kk *= 1 + 0.3 * lpop * Math.max(0, 1 - d * d); }
          if (!found) hop += 2.5 * Math.sin(f / 9 - p.c * 0.7 - (j % rows) * 0.4);
          if (f >= tClosed + 4) { const w = clamp01((f - tClosed - 4 - p.c * 1.2) / 9); hop -= 16 * Math.sin(Math.PI * w); }
          return <Token key={j} x={p.x} y={p.y + hop} r={cr} fill={found && u ? u.col : P.gray} q={!found} sx={sxk} k={kk}/>;
        })}
        {lens && f >= lStart ? <g transform={`translate(${lens.x} ${lens.y}) scale(${(0.4 + 0.6 * lpop) * (1 - lout)})`}><Lens r={LRr} handle={38}/></g> : null}

        {/* counter */}
        <g transform={`translate(${RX} ${BY + 4})`}>
          <rect x={0} y={0} width={RW} height={200} rx={10} fill={P.white} stroke={P.ink} strokeWidth={5} style={{filter: "url(#vshadow)"}}/>
          <rect x={0} y={0} width={RW} height={62} rx={10} fill={P.ink}/>
          <rect x={0} y={40} width={RW} height={22} fill={P.ink}/>
          <Tx x={22} y={47} size={42} fill={P.white} anchor="start" ls={3}>{words.found ?? "FOUND"}</Tx>
          <Tx x={216} y={178 + tick} size={nsz} anchor="end" ls={0} fill={count >= total ? P.green : P.red}>{fmtIN(count)}</Tx>
          <Tx x={238} y={122} size={Math.min(60, 216 / (ofText.length * 0.52))} anchor="start">{ofText}</Tx>
          {unit ? <Tx x={238} y={176} size={Math.min(50, 216 / (unit.length * 0.54))} anchor="start">{unit}</Tx> : null}
        </g>
      </g>

      {Array.from({length: nSlots}, (_, i) => {
        const u = sus[i];
        if ((u && (u.t < 0 || f >= u.t + 3)) || covered(i)) return null;
        return <EmptySlot key={i} x={slotX(i)} y={CY + settle} w={CWd} h={CHt} i={i}/>;
      })}
      {sus.map((u) => <SuspectCard key={u.i} x={slotX(u.i)} y={CY} w={CWd} h={CHt} start={u.t < 0 ? -99 : u.t + 3} g={u.g} col={u.col} unit={unit} rot={[-1.2, 1, -0.6, 1.3, -1, 0.8][u.i % 6]}/>)}
      {clue ? (clueBottom
        ? <ClueCard x={CLX} y={896 - cH / 2} w={cW} h={cH} start={at(T, clue.at)} lines={cFit.lines} size={cFit.size}/>
        : <ClueCard x={RX + RW / 2} y={580} w={RW - 20} h={132} start={at(T, clue.at)} lines={cFit.lines} size={cFit.size}/>) : null}
      {stamps.map((st: any, i: number) => <g key={i}>
        {st.low ? null : <StampBack x={st.x} y={st.y} start={st.start} text={st.text} size={st.size} rot={st.rot}/>}
        <Stamp x={st.x} y={st.y} start={st.start} text={st.text} size={st.size} rot={st.rot}/>
      </g>)}
      {s.closed && s.closed.text ? <BigStamp x={BX + BWd / 2} y={BY + BHt / 2} start={tClosed} text={String(s.closed.text)} size={Math.min(170, (BWd - 150) / (String(s.closed.text).length * 0.55 + 0.8))}/> : null}
    </IStage>
  );
};

export const SCENES_MONEY: Record<string, React.FC<SP>> = {keep: Keep, note: NoteScene, case: Case};
