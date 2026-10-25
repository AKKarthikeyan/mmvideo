// Growth scenes for the illustration kit: things that grow, pile up or get spread over time.
//   duo    two things that grew by different amounts (two rising pillars, each carrying its icon)
//   shops  rows of little shops, one row per year
//   stacks before and after, as piles of note bundles
//   spread a made-up example: one cost cut into yearly slices that land on calendar pages
// Every word and number on screen comes from the scene's props.
import React from "react";
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {SP, P, SAFE, IStage, IHeading, INote, IStamps, Pop, Chip, Arrow, Icon, StoreIcon, TFn, fit, fmtIN, clamp01} from "./kit";
import {COND} from "../../voxkit";

// ---------- shared helpers ----------
const NOTE_GREEN = "#BFD9B4", WOOD = "#C89B5A";   // the kit's own note and box colours
// Where each kit icon's feet are, in its 100-unit box (so it can stand on something).
const FOOT: Record<string, number> = {store: 42, trolley: 42, coin: 46, note: 38, bank: 40, box: 34, person: 40, tag: 30};
const at = (T: TFn, x: any, d = 0) => (x == null ? d : T(x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const prog = (f: number, start: number, dur: number, ease: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [start, start + Math.max(1, dur)], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
const pop = (f: number, fps: number, start: number, damping = 11, stiffness = 150) =>
  f < start ? 0 : spring({frame: f - start, fps, config: {damping, stiffness, mass: 0.8}});
// A landing bounce: u = frames since touchdown.
const bounce = (u: number, amp = 12) => (u < 0 ? 0 : -Math.abs(Math.sin(u * 0.6)) * amp * Math.exp(-u / 4));
const tw = (text: string, size: number) => text.length * size * 0.5;   // rough width of Oswald caps
// "₹2,629 CR" at p = 0.5 reads "₹1,314 CR": the first number in a label ticks up, the words stay put.
const tickText = (text: string, p: number) => {
  if (p >= 1) return text;
  const m = text.match(/\d[\d,]*(?:\.\d+)?/);
  if (!m || m.index == null) return text;
  const raw = m[0], num = parseFloat(raw.replace(/,/g, ""));
  const dec = raw.includes(".") ? raw.split(".")[1].length : 0;
  const cur = num * Math.max(0, p);
  return text.slice(0, m.index) + (raw.includes(",") ? fmtIN(cur, dec) : cur.toFixed(dec)) + text.slice(m.index + raw.length);
};
const Txt: React.FC<{x: number; y: number; text: string; size: number; color?: string; anchor?: "start" | "middle" | "end"}> =
  ({x, y, text, size, color = P.ink, anchor = "middle"}) =>
  <text x={x} y={y} fontFamily={COND} fontWeight={700} fontSize={size} textAnchor={anchor} fill={color} letterSpacing={1}>{text}</text>;
// What an icon does while it waits: the trolley rolls to and fro, the coin rocks, the rest bob.
const idle = (name: string, f: number, i: number) => {
  const ph = f / 10 + i * 1.7;
  if (name === "trolley") return {dx: Math.sin(ph) * 12, dy: 0, rot: Math.cos(ph) * 2.5, sx: 1};
  if (name === "coin") return {dx: 0, dy: -Math.abs(Math.sin(ph * 0.7)) * 9, rot: Math.sin(ph * 0.7) * 8, sx: 1};
  return {dx: 0, dy: -Math.abs(Math.sin(ph * 0.6)) * 7, rot: 0, sx: 1};
};

// ---------- duo: two things that grew by different amounts ----------
const D = {HM: 420, TOP: 410, PAD: 16, PW: 210, CAP: 16, ISZ: 130};
const cardPath = (w: number, h: number, r = 12, tip = 24) =>
  `M ${-w / 2 + r} ${-h / 2} H ${w / 2 - r} Q ${w / 2} ${-h / 2} ${w / 2} ${-h / 2 + r} V ${h / 2 - r} Q ${w / 2} ${h / 2} ${w / 2 - r} ${h / 2} H ${-w / 2 + r} ` +
  `Q ${-w / 2} ${h / 2} ${-w / 2} ${h / 2 - r} V 18 L ${-w / 2 - tip} 0 L ${-w / 2} -18 V ${-h / 2 + r} Q ${-w / 2} ${-h / 2} ${-w / 2 + r} ${-h / 2} Z`;

const DuoPillar: React.FC<{it: any; i: number; x: number; side: number; G: number; sc: number; st: number; tsize: number}> = ({it, i, x, side, G, sc, st, tsize}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const v = +it.v || 0, neg = v < 0;
  const up = f < st ? 0 : spring({frame: f - st, fps, config: {damping: 14, stiffness: 100, mass: 1}});
  const h = D.PAD + (Math.max(D.PAD, Math.abs(v) * sc) - D.PAD) * up;
  const y0 = neg ? G : G - h;                 // top edge of the pillar (a fall hangs below the ground line)
  const name = String(it.icon || "box"), foot = (FOOT[name] ?? 40) * D.ISZ / 100, id = idle(name, f, i);
  const rows = Math.ceil(h / 64) + 2, cid = `duo-clip-${i}`;
  const text = String(it.text ?? ""), cw = tw(text, tsize) + tsize * 0.8, ch = tsize * 1.34;
  const cx = x + side * (D.PW / 2 + 46 + cw / 2);
  const cy = neg ? clamp(G + h - ch / 2, G + ch / 2 + 10, 915 - ch / 2) : clamp(G - h - D.CAP - 44, 272 + ch / 2, G - ch / 2 - 14);
  const cp = pop(f, fps, st), thunk = f >= st + 18 ? 1 + 0.1 * (1 - prog(f, st + 18, 8)) : 1;
  return (
    <g>
      <clipPath id={cid}><rect x={x - D.PW / 2} y={y0} width={D.PW} height={h}/></clipPath>
      <rect x={x - D.PW / 2} y={y0} width={D.PW} height={h} fill={neg ? P.red : P.green} stroke={P.ink} strokeWidth={5} strokeLinejoin="round"/>
      <g clipPath={`url(#${cid})`}>
        {Array.from({length: rows}, (_, j) => {
          const off = (j * 64 + f * 2.4) % (rows * 64);
          const yy = neg ? y0 - 40 + off : y0 + h + 40 - off;
          const d = neg ? `M ${x - 52} ${yy - 18} L ${x} ${yy + 18} L ${x + 52} ${yy - 18}` : `M ${x - 52} ${yy + 18} L ${x} ${yy - 18} L ${x + 52} ${yy + 18}`;
          return <path key={j} d={d} fill="none" stroke={P.cream} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" opacity={0.5}/>;
        })}
      </g>
      {f >= 8 && f < st ? [0, 1, 2].map((q) => {
        const u = (((f - 8) / 54 + q / 3) % 1), k = Math.sin(u * Math.PI);
        const yy = neg ? G + 40 + u * 150 : G - D.PAD - D.CAP - D.ISZ - 26 - u * 190;
        const d = neg ? "M -46 -15 L 0 15 L 46 -15" : "M -46 15 L 0 -15 L 46 15";
        return (
          <g key={q} transform={`translate(${x} ${yy}) scale(${k})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={d} stroke={P.ink} strokeWidth={22}/><path d={d} stroke={neg ? P.red : P.green} strokeWidth={12}/>
          </g>
        );
      }) : null}
      <rect x={x - D.PW / 2 - 14} y={(neg ? G : G - h) - D.CAP} width={D.PW + 28} height={D.CAP} rx={3} fill={P.white} stroke={P.ink} strokeWidth={4}/>
      <g transform={`translate(${x + id.dx} ${(neg ? G : G - h) - D.CAP - foot - 2 + id.dy}) rotate(${id.rot}) scale(${id.sx} 1)`}><Icon name={name} size={D.ISZ}/></g>
      {f >= st && text ? (
        <g transform={`translate(${cx} ${cy}) scale(${(0.55 + 0.45 * cp) * thunk})`}>
          <g transform={`scale(${side} 1)`}><path d={cardPath(cw, ch)} fill={P.white} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" style={{filter: "url(#vshadow)"}}/></g>
          <Txt x={0} y={tsize * 0.37} text={tickText(text, clamp01(up))} size={tsize} color={neg ? P.red : P.ink}/>
        </g>
      ) : null}
    </g>
  );
};
// The dashed outline of the growth that is missing above the shorter pillar (drawn behind the pillars).
const DuoGhost: React.FC<{start: number; x: number; yHi: number; yLo: number}> = ({start, x, yHi, yLo}) => {
  const f = useCurrentFrame();
  const p = prog(f, start + 3, 9), bot = yLo - D.CAP;
  if (f < start + 3 || bot - yHi < 20) return null;
  return <rect x={x - D.PW / 2} y={lerp(bot, yHi, p)} width={D.PW} height={(bot - yHi) * p} fill="none" stroke={P.red} strokeWidth={5} strokeDasharray="16 12" strokeLinecap="round"/>;
};
const DuoGap: React.FC<{text: string; start: number; xHi: number; xLo: number; yHi: number; yLo: number; ghost: boolean}> = ({text, start, xHi, xLo, yHi, yLo, ghost}) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  const dir = xLo >= xHi ? 1 : -1, gapPx = yLo - yHi;      // from the taller pillar toward the shorter one
  const edge = D.PW / 2 + 22, mx = (xHi + xLo) / 2, p = prog(f, start, 9), pb = prog(f, start + 4, 8), size = Math.max(32, fit(text, 48, 330));
  const xa = xHi + dir * edge, xb = xLo + dir * (D.PW / 2 + 30), xc = xLo - dir * edge;
  return (
    <g>
      <line x1={xa} y1={yHi} x2={lerp(xa, xb, p)} y2={yHi} stroke={P.ink} strokeWidth={5} strokeDasharray="16 12" strokeLinecap="round"/>
      {gapPx > 70 ? (
        <g>
          <line x1={xc} y1={yLo} x2={lerp(xc, mx - dir * 30, p)} y2={yLo} stroke={P.ink} strokeWidth={5} strokeDasharray="16 12" strokeLinecap="round"/>
          <line x1={mx} y1={yHi + 24} x2={mx} y2={lerp(yHi + 24, yLo - 24, pb)} stroke={P.red} strokeWidth={9} strokeLinecap="round"/>
          <path d={`M ${mx} ${yHi + 5} l -15 24 h 30 Z`} fill={P.red} stroke={P.red} strokeWidth={3} strokeLinejoin="round"/>
          {pb >= 1 ? <path d={`M ${mx} ${yLo - 5} l -15 -24 h 30 Z`} fill={P.red} stroke={P.red} strokeWidth={3} strokeLinejoin="round"/> : null}
        </g>
      ) : null}
      {/* in the missing part when there is room for it, otherwise between the pillars above the level line */}
      {ghost && gapPx > 240
        ? <Chip x={xLo + dir * 30} y={yHi + 54} start={start + 8} text={text} size={size} fill={P.red} color={P.white} rot={-2}/>
        : <Chip x={mx} y={yHi - 64} start={start + 8} text={text} size={size} fill={P.red} color={P.white} rot={-2}/>}
    </g>
  );
};
const Duo: React.FC<SP> = ({s, n, T}) => {
  const items: any[] = (s.items || []).slice(0, 2), k = items.length;
  const vals = items.map((it) => +it.v || 0);
  const vmax = Math.max(0, ...vals), vmin = Math.min(0, ...vals), sc = D.HM / ((vmax - vmin) || 1);
  const G = vmax === vmin ? D.TOP + D.HM : D.TOP + vmax * sc;   // the ground line: at the bottom unless something fell
  const xs = k === 2 ? [700, 1220] : [960], sides = k === 2 ? [-1, 1] : [1];
  const starts = items.map((it) => at(T, it.at));
  const tsize = Math.min(110, ...items.map((it) => fit(String(it.text ?? ""), 110, 395, 0.5)));
  const ends = vals.map((v) => (v < 0 ? G + Math.max(D.PAD, -v * sc) : G - Math.max(D.PAD, v * sc)));
  const hi = k === 2 && ends[1] < ends[0] ? 1 : 0, lo = 1 - hi;
  const gs = s.gap && k === 2 ? at(T, s.gap.at, Math.max(...starts) + 24) : 0;
  return (
    <IStage n={n}>
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      {[0, 1, 2, 3].map((q) => <line key={q} x1={300} y1={D.TOP + q * D.HM / 4} x2={1620} y2={D.TOP + q * D.HM / 4} stroke={P.ink} strokeWidth={2} opacity={0.13}/>)}
      <line x1={300} y1={G} x2={1620} y2={G} stroke={P.ink} strokeWidth={6} strokeLinecap="round"/>
      {s.gap && k === 2 && vmin >= 0 ? <DuoGhost start={gs} x={xs[lo]} yHi={ends[hi]} yLo={ends[lo]}/> : null}
      {items.map((it, i) => <DuoPillar key={i} it={it} i={i} x={xs[i]} side={sides[i]} G={G} sc={sc} st={starts[i]} tsize={tsize}/>)}
      {s.gap && s.gap.text && k === 2 ? <DuoGap text={String(s.gap.text)} start={gs} xHi={xs[hi]} xLo={xs[lo]} yHi={ends[hi]} yLo={ends[lo]} ghost={vmin >= 0}/> : null}
      {items.map((it, i) => (it.label ? <Chip key={i} x={xs[i]} y={884} start={0} text={String(it.label)} size={fit(String(it.label), 44, 420)}/> : null))}
      <IStamps s={s} T={T}/>
    </IStage>
  );
};

// ---------- shops: rows of little shops, one row per year ----------
const ShopRow: React.FC<{r: any; i: number; y: number; pitch: number; x0: number; step: number; size: number; per: number; n: number; st: number; nameW: number; nameSize: number}> =
  ({r, i, y, pitch, x0, step, size, per, n, st, nameW, nameSize}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const v = +r.v || 0, cnt = Math.max(0, v / per), full = Math.floor(cnt + 1e-6), frac = cnt - full < 0.03 ? 0 : cnt - full, cells = full + (frac ? 1 : 0);
  const stag = clamp((n - 14 - st) / Math.max(1, cells), 0.5, 2);     // two frames apart, faster if the beat is nearly over
  const on = f >= st, red = !!r.red, name = String(r.name ?? "");
  const arrive = pop(f, fps, i * 3), bump = on && st > 0 ? 1 + 0.16 * (1 - prog(f, st, 9)) : 1;
  const nsz = red ? Math.min(108, pitch * 0.86) : Math.min(84, pitch * 0.68), ph = Math.min(62, pitch * 0.52);
  const roadY = y + size * 0.42 + 7;
  const shown = clamp((f - st) / stag + 1, 0, cells), built = Math.min(cells, Math.floor(shown)), tDone = Math.round(st + Math.max(0, cells - 1) * stag);
  return (
    <g>
      {red && on ? <rect x={SAFE.left} y={y - pitch / 2 + 5} width={(SAFE.right - SAFE.left) * prog(f, st, 8)} height={pitch - 10} rx={12} fill={P.cream} stroke={P.red} strokeWidth={5}/> : null}
      <line x1={x0 - 8} y1={roadY} x2={SAFE.right - 14} y2={roadY} stroke={P.ink} strokeWidth={on ? 3 : 4} opacity={on ? 0.3 : 0.42} strokeDasharray="20 14" strokeDashoffset={on ? 0 : -f * 1.6}/>
      <g transform={`translate(${SAFE.left + 14 + nameW / 2} ${y}) scale(${(0.55 + 0.45 * arrive) * bump})`}>
        <rect x={-nameW / 2} y={-ph / 2} width={nameW} height={ph} rx={8} fill={!on ? P.paper : red ? P.red : P.white} stroke={on ? P.ink : P.gray} strokeWidth={4}/>
        <Txt x={0} y={nameSize * 0.36} text={name} size={nameSize} color={!on ? P.gray : red ? P.white : P.ink}/>
      </g>
      {Array.from({length: cells}, (_, j) => {
        const t = f - (st + j * stag);
        if (t < 0) return null;
        const sp = spring({frame: t, fps, config: {damping: 10, stiffness: 170, mass: 0.8}});
        const wph = (((f * 0.22 - j * 0.55 - i * 1.3) % 14) + 14) % 14;      // a little hop that travels down the row
        const dy = t > 16 && wph < Math.PI ? -Math.sin(wph) * 5 : 0;
        const part = j === full && frac > 0;
        return (
          <g key={j} transform={`translate(${x0 + (j + 0.5) * step} ${y + dy}) scale(${(size / 100) * (0.4 + 0.6 * sp)})`}>
            {part ? <>
              <clipPath id={`shop-clip-${i}`}><rect x={-50} y={-52} width={4 + 92 * frac} height={104}/></clipPath>
              <rect x={-46} y={-46} width={92} height={88} rx={5} fill="none" stroke={P.ink} strokeWidth={3} strokeDasharray="7 7" opacity={0.4}/>
              <g clipPath={`url(#shop-clip-${i})`}><StoreIcon accent={red ? P.red : P.blue}/></g>
            </> : <StoreIcon accent={red ? P.red : P.blue}/>}
          </g>
        );
      })}
      {on ? (
        <g transform={`translate(${x0 + shown * step + 16} ${y + nsz * 0.36}) scale(${f >= tDone ? 1 + 0.16 * (1 - prog(f, tDone, 8)) : 1})`}>
          <Txt x={0} y={0} text={fmtIN(built >= cells ? v : Math.min(v, built * per), built >= cells && !Number.isInteger(v) ? 1 : 0)} size={nsz} color={red ? P.red : P.ink} anchor="start"/>
        </g>
      ) : null}
    </g>
  );
};
const Shops: React.FC<SP> = ({s, n, T}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const rows: any[] = s.rows || [], k = rows.length, per = Math.max(1e-6, +s.per || 1);
  const top = 284, bot = 918, pitch = Math.min(150, (bot - top) / Math.max(1, k)), yA = (top + bot) / 2 - pitch * k / 2;
  const nameSize = Math.min(46, pitch * 0.38);
  const nameW = Math.max(120, ...rows.map((r) => tw(String(r.name ?? ""), nameSize) * 1.04 + nameSize * 1.1));
  const x0 = SAFE.left + 14 + nameW + 34;
  const maxCells = Math.max(1, ...rows.map((r) => Math.ceil(Math.max(0, (+r.v || 0) / per) - 0.03)));
  const step = Math.min(pitch * 0.84, (SAFE.right - 200 - x0) / maxCells), size = step / 0.97;
  const legend = s.legend ? String(s.legend) : "", lw = tw(legend, 34) * 1.04 + 34 + 62, lp = pop(f, fps, 2);
  const hop = -Math.abs(Math.sin(f / 9)) * (f % 57 < 28 ? 6 : 0);
  return (
    <IStage n={n}>
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      {legend ? (
        <g transform={`translate(${SAFE.left + lw / 2} 240) scale(${0.55 + 0.45 * lp})`}>
          <rect x={-lw / 2} y={-27} width={lw} height={54} rx={8} fill={P.white} stroke={P.ink} strokeWidth={4} style={{filter: "url(#vshadow)"}}/>
          <StoreIcon x={-lw / 2 + 34} y={1 + hop} size={42} accent={P.blue}/>
          <Txt x={-lw / 2 + 64} y={12} text={legend} size={34} anchor="start"/>
        </g>
      ) : null}
      {rows.map((r, i) => <ShopRow key={i} r={r} i={i} y={yA + pitch * (i + 0.5)} pitch={pitch} x0={x0} step={step} size={size} per={per} n={n} st={at(T, r.at)} nameW={nameW} nameSize={nameSize}/>)}
      <IStamps s={s} T={T}/>
    </IStage>
  );
};

// ---------- stacks: before and after, as piles of money ----------
const S = {G: 828, HM: 420, BH: 30, PAL: 14, REL: 300, LEAD: 9};
const fallOf = (drop: number) => clamp(Math.sqrt(Math.max(0, drop) / 60) * 3, 3, S.LEAD);   // frames to fall `drop` px
// One banded bundle of notes; origin at its bottom centre.
const Bundle: React.FC<{w: number; h: number; band?: string}> = ({w, h, band = P.white}) => (
  <g strokeLinejoin="round">
    <rect x={-w / 2} y={-h} width={w} height={h} rx={4} fill={NOTE_GREEN} stroke={P.ink} strokeWidth={4}/>
    {h >= 20 ? <>
      <line x1={-w / 2 + 12} y1={-h / 2} x2={-w * 0.11 - 12} y2={-h / 2} stroke={P.ink} strokeWidth={2.5} opacity={0.4}/>
      <line x1={w * 0.11 + 12} y1={-h / 2} x2={w / 2 - 12} y2={-h / 2} stroke={P.ink} strokeWidth={2.5} opacity={0.4}/>
    </> : null}
    <rect x={-w * 0.11} y={-h} width={w * 0.22} height={h} fill={band} stroke={P.ink} strokeWidth={3.5}/>
  </g>
);
// Heights of the bundles in a pile: full bundles plus a thinner one, so the pile's height stays true to v.
const bricksFor = (v: number, vmax: number) => {
  const h = Math.abs(v) / vmax * S.HM, full = Math.floor(h / S.BH + 1e-6), rem = h - full * S.BH;
  const list: number[] = Array.from({length: full}, () => S.BH);
  if (rem >= 9) list.push(rem);
  if (!list.length) list.push(Math.max(12, rem));
  return list;
};
const StackCol: React.FC<{it: any; cx: number; bw: number; bricks: number[]; st: number; stag: number; tsize: number}> = ({it, cx, bw, bricks, st, stag, tsize}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const red = !!it.red, total = bricks.reduce((a, b) => a + b, 0), text = String(it.text ?? "");
  const tEnd = Math.round(st + S.LEAD + (bricks.length - 1) * stag), pp = pop(f, fps, tEnd, 10, 170);
  let acc = 0;
  return (
    <g>
      <rect x={cx - bw / 2 - 18} y={S.G - S.PAL} width={bw + 36} height={8} fill={WOOD} stroke={P.ink} strokeWidth={3.5}/>
      {[-1, 0, 1].map((q) => <rect key={q} x={cx + q * (bw / 2 - 2) - 13} y={S.G - 6} width={26} height={6} fill={WOOD} stroke={P.ink} strokeWidth={3}/>)}
      {bricks.map((bh, j) => {
        const base = S.G - S.PAL - acc; acc += bh;
        const land = st + S.LEAD + j * stag, fall = fallOf(base - S.REL), t = f - (land - fall);
        if (t < 0) return null;
        const p = Math.min(1, t / fall), y = t < fall ? lerp(Math.min(S.REL, base), base, p * p) : base + bounce(f - land, 13);
        const jit = (((j * 37) % 7) - 3) * 3.2, rot = t < fall ? (((j * 53) % 9) - 4) * 1.6 * (1 - p) : 0;
        return <g key={j} transform={`translate(${cx + jit} ${y}) rotate(${rot}) scale(${Math.min(1, 0.5 + t * 0.25)})`}><Bundle w={bw} h={bh} band={red ? P.red : P.white}/></g>;
      })}
      {f >= tEnd && text ? (
        <g transform={`translate(${cx} ${S.G - S.PAL - total - 26}) scale(${0.5 + 0.5 * pp})`}>
          <Txt x={0} y={0} text={tickText(text, clamp01((f - tEnd + 1) / 9))} size={tsize} color={red ? P.red : P.ink}/>
        </g>
      ) : null}
    </g>
  );
};
const Stacks: React.FC<SP> = ({s, n, T}) => {
  const f = useCurrentFrame();
  const items: any[] = (s.items || []).slice(0, 4), k = Math.max(1, items.length);
  const vmax = Math.max(1e-9, ...items.map((it) => Math.abs(+it.v || 0)));
  const zoneL = k >= 3 ? 640 : 830, colW = (SAFE.right - zoneL) / k, bw = clamp(colW - 150, 120, 250);
  const cxs = items.map((_, i) => zoneL + colW * (i + 0.5));
  const tsize = Math.min(96, ...items.map((it) => fit(String(it.text ?? ""), 96, colW - 50, 0.5)));
  const name = String(s.icon || "bank"), isz = k >= 3 ? 210 : 250, ix = k >= 3 ? 205 : 250, foot = (FOOT[name] ?? 40) * isz / 100;
  const ax1 = ix + isz * 0.5 + 26, ax2 = (cxs[0] ?? 1300) - Math.max(bw / 2 + 52, tw(String(items[0]?.text ?? ""), tsize) * 0.53 + 50), ay = S.G - 118;
  const piles = items.map((it) => bricksFor(+it.v || 0, vmax)), starts = items.map((it) => at(T, it.at));
  // Stamps land in the open sky above the icon, shrunk if they are too long for it.
  const stamps: any[] = s.stamps || [], custom = stamps.some((st) => st.x != null || st.y != null);
  // Each pile is finished before the next thing happens (the next pile, a stamp, or the end of the beat).
  const events = [...starts, ...stamps.map((st) => at(T, st.at)), n - 14];
  const stags = piles.map((b, i) => {
    const next = Math.min(...events.filter((e) => e > starts[i] + 12), n - 14);
    return clamp((next - starts[i] - S.LEAD - 4) / b.length, 0.5, Math.min(2.5, 30 / b.length));
  });
  const zoneW = zoneL - 40 - SAFE.left, scx = SAFE.left + zoneW / 2, scy = Math.min(470, 372 + (stamps.length - 1) * 85);
  const ks = custom ? 1 : Math.min(1, ...stamps.map((st) => zoneW / (String(st.text).length * fit(String(st.text), 60, 900, 0.56) * 0.55 + 86)));
  const pulse = 1 + 0.02 * Math.max(0, Math.sin(f / 46 * 6 * Math.PI));
  return (
    <IStage n={n}>
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      <line x1={SAFE.left + 10} y1={S.G} x2={SAFE.right - 10} y2={S.G} stroke={P.ink} strokeWidth={6} strokeLinecap="round"/>
      <Pop x={ix} y={S.G - foot - 3} start={0}>
        <g transform={`translate(0 ${foot}) scale(${2 - pulse} ${pulse}) translate(0 ${-foot})`}><Icon name={name} size={isz}/></g>
      </Pop>
      <Arrow x1={ax1} y1={ay} x2={ax2} y2={ay} start={4} dur={14} width={10}/>
      {[0, 1, 2].map((q) => {
        if (f < 18) return null;
        const u = ((f - 18) / 46 + q / 3) % 1, sc = Math.min(1, u / 0.15, (1 - u) / 0.15);
        return <g key={q} transform={`translate(${lerp(ax1 + 10, ax2 - 44, u)} ${ay - 12 - Math.abs(Math.sin(u * Math.PI * 4)) * 5}) scale(${sc})`}><Bundle w={58} h={22}/></g>;
      })}
      {items.map((it, i) => <StackCol key={i} it={it} cx={cxs[i]} bw={bw} bricks={piles[i]} st={starts[i]} stag={stags[i]} tsize={tsize}/>)}
      {items.map((it, i) => (it.label ? <Chip key={i} x={cxs[i]} y={884} start={0} text={String(it.label)} size={fit(String(it.label), 42, colW - 60)}/> : null))}
      <g transform={`translate(${scx} ${scy}) scale(${ks}) translate(${-scx} ${-scy})`}><IStamps s={custom ? s : {...s, stamps: stamps.map((st, i) => ({...st, x: scx, y: scy - i * 156}))}} T={T}/></g>
    </IStage>
  );
};

// ---------- spread: one cost, cut into yearly slices (a made-up example) ----------
// Break a label over one to three lines, whichever lets the type be largest.
const wrapFit = (text: string, maxW: number, size: number) => {
  const words = text.split(" ").filter(Boolean);
  let best: string[] = [text], bestSize = fit(text, size, maxW);
  for (let L = 2; L <= 3 && bestSize < size * 0.9; L++) {
    const mc = Math.ceil(text.length / L) + 2, lines: string[] = [];
    let cur = "";
    for (const w of words) { if (cur && (cur + " " + w).length > mc) { lines.push(cur); cur = w; } else cur = cur ? cur + " " + w : w; }
    if (cur) lines.push(cur);
    const sz = fit(lines.reduce((a, b) => (b.length > a.length ? b : a), ""), size, maxW);
    if (sz > bestSize) { best = lines; bestSize = sz; }
  }
  return {lines: best, size: bestSize};
};
const Slice: React.FC<{x: number; y: number; w: number; h: number; rot?: number}> = ({x, y, w, h, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill={P.mustard} stroke={P.ink} strokeWidth={4.5} strokeLinejoin="round"/>
    {w > 40 && h > 40 ? <rect x={-w / 2 + 11} y={-h / 2 + 11} width={w - 22} height={h - 22} rx={3} fill="none" stroke={P.ink} strokeWidth={2} opacity={0.35}/> : null}
  </g>
);
const Flag: React.FC<{x: number; y: number; f: number; k?: number}> = ({x, y, f, k = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${k})`} strokeLinejoin="round" strokeLinecap="round">
    <line x1={0} y1={0} x2={0} y2={-56} stroke={P.ink} strokeWidth={5}/>
    <path d={`M 0 -56 L 40 ${-45 + Math.sin(f / 5) * 5} L 0 -32 Z`} fill={P.mustard} stroke={P.ink} strokeWidth={4}/>
  </g>
);
const Spread: React.FC<SP> = ({s, n, T}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const years: string[] = (Array.isArray(s.years) && s.years.length ? s.years : [""]).slice(0, 8).map(String), N = years.length;
  const hasMore = !!s.more, costText = s.cost && s.cost.text ? String(s.cost.text) : "";
  const tCost = at(T, s.cost?.at, 14), tCut = at(T, s.cutAt, tCost + 50), tDrop = at(T, s.dropAt, tCut + 50);
  const tMoreRaw = hasMore && s.more.at != null ? T(s.more.at) : null;
  const dStep = clamp(((tMoreRaw ?? n - 40) - tDrop - 16) / N, 2.5, 9);
  const tMore = hasMore ? (tMoreRaw ?? Math.round(tDrop + N * dStep + 24)) : 1e9;
  // layout: tag and stores in a column on the left, the bar across the top, the years below it
  const S1 = {x: 290, y: 622, size: 212}, S2 = {x: 290, y: 822, size: 168};
  const BY = 400, BH = 84, PL = 540, PR = 1820, pitch = (PR - PL) / N, pw = Math.min(250, pitch - 24);
  const PT = 500, PB = 832, HH = 62, sh = 76, sw = pw - 34, slots = hasMore ? [639, 754] : [697];
  const px = (i: number) => PL + pitch * (i + 0.5);
  // the price tag
  const {lines, size: tsz} = wrapFit(costText, 290, 44), longest = lines.reduce((a, b) => (b.length > a.length ? b : a), "");
  const tagW = Math.max(200, tw(longest, tsz) * 1.04 + 118), tagH = lines.length * tsz * 1.14 + 40;
  const TX = 296, hx = -tagW / 2 + 40, tagR = TX + tagW / 2;
  const tBar = Math.min(tCost + 12, tCut);                              // the tag pays out the whole cost as one long bar
  const tagPop = pop(f, fps, tCost), swing = Math.sin((f - tCost) / 9) * 3 * (1 - prog(f, tBar - 4, 8));
  const barP = prog(f, tBar + 2, 14);
  // the cuts
  const tc0 = Math.min(tCut + 4, Math.max(tCut, tDrop - 8));
  const cutWin = clamp(tDrop - tc0 - 10, 0, 32), cs = N > 1 ? cutWin / (N - 1) : 0;
  const tc = (j: number) => tc0 + (j - 1) * cs;                         // when the boundary before slice j is cut
  const gapAt = (j: number) => (j <= 0 || j >= N ? 0 : prog(f, tc(j) + 2, 4));
  const td = (i: number) => Math.round(tDrop + i * dStep), FL = 10;
  // slices still in the bar, grouped into the pieces the blade has not separated yet
  const segs: [number, number][] = [];
  for (let i = 0, a = -1; i < N; i++) {
    if (f >= td(i)) { a = -1; continue; }
    if (a < 0) a = i;
    if (i === N - 1 || f >= tc(i + 1) || f >= td(i + 1)) { segs.push([a, i]); a = -1; }
  }
  const neckOut = prog(f, tBar, 3), neckIn = prog(f, tDrop, 6);
  // the blade waits over the first cut, then chops its way along
  const tBlade = Math.min(tBar + 22, tc0 - 6);
  const jc = N > 1 ? clamp(Math.floor((f - tc0) / Math.max(0.01, cs)) + 1, 1, N - 1) : 1, cu = f - tc(jc);
  const tipUp = BY - BH / 2 - 7 + Math.sin(f / 7) * (f < tc0 ? 4 : 0), tipDown = BY + BH / 2 + 6;
  const tipY = cu < 0 ? tipUp : cu < 2 ? lerp(tipUp, tipDown, cu / 2) : cu < 5 ? lerp(tipDown, tipUp, (cu - 2) / 3) : tipUp;
  const bladeX = PL + pitch * (jc + (jc < N - 1 && cu > 4 ? clamp01((cu - 4) / Math.max(1, cs - 4)) : 0));
  const bladeK = N > 1 ? pop(f, fps, tBlade) * (1 - prog(f, tc(N - 1) + 6, 3)) : 0;
  // the second store
  const mStep = clamp((n - 12 - 14 - 12 - (tMore + 10)) / N, 1.5, 5), FL2 = 12;
  const tm = (i: number) => Math.round(tMore + 10 + i * mStep);
  const tChip = Math.min(n - 14, tm(N - 1) + FL2 + 2);
  const tWave = (hasMore ? tChip : td(N - 1) + FL) + 22;
  const wave = (i: number) => { const w = ((((f - tWave) * 0.16 - i * 0.9) % 9) + 9) % 9; return f > tWave && w < Math.PI ? -Math.sin(w) * 8 : 0; };
  const moreText = hasMore && s.more.text ? String(s.more.text) : "";
  const glint = PL + (((f - tBar) * 14) % (PR - PL + 700)) - 120;
  return (
    <IStage n={n}>
      <IHeading text={s.heading}/>
      {/* calendar pages, one per year: on from the start, they nod when the cost is spread over them */}
      {years.map((yr, i) => {
        const nod = f >= tCut + i * 3 ? bounce(f - tCut - i * 3, 12) : 0, ys = fit(yr, 40, pw - 30);
        return (
          <Pop key={i} x={px(i)} y={(PT + PB) / 2 + nod} start={2 + i * 3}>
            <g transform={`translate(0 ${-(PT + PB) / 2})`} strokeLinejoin="round">
              <rect x={-pw / 2} y={PT} width={pw} height={PB - PT} rx={8} fill={P.white} stroke={P.ink} strokeWidth={4.5}/>
              <path d={`M ${-pw / 2} ${PT + HH} V ${PT + 8} Q ${-pw / 2} ${PT} ${-pw / 2 + 8} ${PT} H ${pw / 2 - 8} Q ${pw / 2} ${PT} ${pw / 2} ${PT + 8} V ${PT + HH} Z`} fill={P.ink} stroke={P.ink} strokeWidth={4.5}/>
              {[-1, 1].map((q) => <rect key={q} x={q * pw * 0.27 - 7} y={PT - 16} width={14} height={32} rx={7} fill={P.gray} stroke={P.ink} strokeWidth={3.5}/>)}
              {yr ? <Txt x={0} y={PT + HH / 2 + 6 + ys * 0.32} text={yr} size={ys} color={P.white}/> : null}
              {slots.map((sy, q) => <rect key={q} x={-sw / 2} y={sy - sh / 2} width={sw} height={sh} rx={6} fill="none" stroke={P.ink} strokeWidth={3} strokeDasharray="9 9" opacity={0.28}/>)}
            </g>
          </Pop>
        );
      })}
      {/* the bar: pulled out of the tag, cut, then dropped slice by slice */}
      {costText && f >= tBar && neckIn < 1 ? <rect x={tagR - 8} y={BY - 13} width={Math.max(0, lerp(lerp(0, PL + 14 - tagR, neckOut), 0, neckIn))} height={26} fill={P.mustard} stroke={P.ink} strokeWidth={4}/> : null}
      {f >= tBar + 2 && f < tc0 ? (
        <g>
          <Slice x={PL + (PR - PL) * barP / 2} y={BY} w={Math.max(8, (PR - PL) * barP)} h={BH}/>
          <clipPath id="spread-bar"><rect x={PL + 5} y={BY - BH / 2 + 5} width={Math.max(0, (PR - PL) * barP - 10)} height={BH - 10}/></clipPath>
          <path d={`M ${glint} ${BY + BH / 2} l 50 ${-BH} h 46 l -50 ${BH} Z`} fill={P.cream} opacity={0.45} clipPath="url(#spread-bar)"/>
        </g>
      ) : null}
      {f >= tc0 ? segs.map(([a, b]) => {
        const l = PL + a * pitch + 7 * gapAt(a), r = PL + (b + 1) * pitch - 7 * gapAt(b + 1);
        return <Slice key={a} x={(l + r) / 2} y={BY} w={r - l} h={BH}/>;
      }) : null}
      {years.map((_, i) => {
        const u = f - td(i);
        if (u < 0) return null;
        const p = clamp01(u / FL), e = p * p;
        return <Slice key={i} x={px(i)} y={lerp(BY, slots[0], e) + (u >= FL ? bounce(u - FL, 10) : 0) + wave(i)} w={lerp(pitch - 14, sw, p)} h={lerp(BH, sh, p)} rot={(((i * 37) % 5) - 2) * 2.5 * Math.sin(p * Math.PI)}/>;
      })}
      {bladeK > 0.01 ? (
        <g transform={`translate(${bladeX} ${tipY}) scale(${bladeK})`} strokeLinejoin="round">
          <path d="M 0 0 L -15 -58 H 13 V -14 Q 12 -4 0 0 Z" fill={P.white} stroke={P.ink} strokeWidth={4}/>
          <rect x={-19} y={-66} width={36} height={9} rx={2} fill={P.gray} stroke={P.ink} strokeWidth={3.5}/>
          <rect x={-11} y={-90} width={22} height={26} rx={6} fill={P.ink}/>
        </g>
      ) : null}
      {N > 1 && cu >= 1 && cu < 6 ? [-1, 1].map((q) => [0, 1].map((w) => {
        const bx = PL + pitch * jc + q * (20 + cu * 5 + w * 6), by = BY - BH / 2 - 6 - cu * 3 - w * 16;
        return <line key={`${q}${w}`} x1={bx} y1={by} x2={bx + q * 13} y2={by - 8 - w * 5} stroke={P.ink} strokeWidth={4.5} strokeLinecap="round"/>;
      })) : null}
      {/* the stores */}
      <line x1={S1.x - 150} y1={S1.y + S1.size * 0.42 + 3} x2={S1.x + 150} y2={S1.y + S1.size * 0.42 + 3} stroke={P.ink} strokeWidth={6} strokeLinecap="round"/>
      <Pop x={S1.x} y={S1.y} start={0}>
        <Flag x={S1.size * 0.2} y={-S1.size * 0.44} f={f} k={0.7}/>
        <StoreIcon size={S1.size}/>
      </Pop>
      {hasMore && f >= tMore ? <line x1={S2.x - 115} y1={S2.y + S2.size * 0.42 + 3} x2={S2.x + 115} y2={S2.y + S2.size * 0.42 + 3} stroke={P.ink} strokeWidth={6} strokeLinecap="round"/> : null}
      {hasMore ? (
        <Pop x={S2.x} y={S2.y} start={tMore}>
          <Flag x={S2.size * 0.2} y={-S2.size * 0.44} f={f + 11} k={0.55}/>
          <StoreIcon size={S2.size}/>
        </Pop>
      ) : null}
      {/* the price tag on a string */}
      {costText && f >= tCost ? (
        <g>
          <path d={`M ${TX + hx} ${BY} Q ${TX + hx - 8} ${S1.y - S1.size * 0.5} ${S1.x - S1.size * 0.3} ${S1.y - S1.size * 0.45}`} fill="none" stroke={P.ink} strokeWidth={4} strokeLinecap="round"/>
          <g transform={`translate(${TX} ${BY}) rotate(${swing} ${hx} 0) scale(${0.55 + 0.45 * tagPop})`} strokeLinejoin="round">
            <path d={`M ${-tagW / 2} 0 L ${-tagW / 2 + 40} ${-tagH / 2} H ${tagW / 2} V ${tagH / 2} H ${-tagW / 2 + 40} Z`} fill={P.mustard} stroke={P.ink} strokeWidth={5}/>
            <circle cx={hx} cy={0} r={9} fill={P.white} stroke={P.ink} strokeWidth={3.5}/>
            {lines.map((ln, q) => <Txt key={q} x={28} y={(q - (lines.length - 1) / 2) * tsz * 1.14 + tsz * 0.36} text={ln} size={tsz}/>)}
          </g>
        </g>
      ) : null}
      {/* the second store's slices arc onto the same years */}
      {hasMore ? years.map((_, i) => {
        const u = f - tm(i);
        if (u < 0) return null;
        const p = clamp01(u / FL2), kx = Easing.out(Easing.quad)(p), gk = lerp(0.3, 1, clamp01(p / 0.4));
        const y = lerp(S2.y - 14, slots[slots.length - 1], p) - 150 * Math.sin(p * Math.PI) + (u >= FL2 ? bounce(u - FL2, 10) : 0) + wave(i + 0.5);
        return <Slice key={i} x={lerp(S2.x + 70, px(i), kx)} y={y} w={sw * gk} h={sh * gk} rot={lerp(-24, 0, p)}/>;
      }) : null}
      {moreText ? <Chip x={(PL + PR) / 2} y={880} start={tChip} text={moreText} size={fit(moreText, 44, 1240)} fill={P.red} color={P.white}/> : null}
      <IStamps s={s} T={T}/>
      {/* the provenance note, a size up: this picture is a made-up example and has to say so */}
      <g transform={`translate(${SAFE.right - 18} 208) scale(1.25) translate(${-SAFE.right} -208)`}>
        {s.note ? <rect x={SAFE.right - 40} y={208} width={54} height={40} fill={P.ink}/> : null}
        <INote text={s.note}/>
      </g>
    </IStage>
  );
};

export const SCENES_GROWTH: Record<string, React.FC<SP>> = {duo: Duo, shops: Shops, stacks: Stacks, spread: Spread};
