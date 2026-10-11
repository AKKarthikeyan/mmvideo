// Compare scenes for the illustration kit: two things weighed, a date that moved, companies in a race.
//   scale     a two-pan balance: a weight lands on each pan and the beam tilts to the heavier side
//             {heading, note, left {label, text, v, at, red?, color?}, right {same}, result {text, at}, stamps?}
//   calendar  months as grids of days: an oil lamp sits on one date, then leaps to another; a red line marks a cut-off
//             {heading, note, months [names], days [days in each], marks [{label, month, day, text, at, red?}],
//              line {month, day, text, at}, result {text, at}, stamps?}      (month is 0-based, day is 1-based)
//   race      one lane per company: a little shop on wheels runs as far as its number
//             {heading, note, max, lanes [{name, v, text, sub, at, hi?}], stamps?}
// Every word and number on screen comes from the scene's props; every field is optional.
import React from "react";
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {SP, P, IStage, IHeading, INote, Chip, StoreIcon, TFn, fit, fmtIN, clamp01} from "./kit";
import {Stamp, COND} from "../../voxkit";

// ---------- shared helpers ----------
const CLAY = "#C89B5A", CLAY_DK = "#A87C42";   // the kit's own box colours
const at = (T: TFn, x: any, d = 0) => (x == null ? d : T(x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const prog = (f: number, start: number, dur: number, ease: (t: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(f, [start, start + Math.max(1, dur)], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
const spr = (f: number, fps: number, start: number, damping = 11, stiffness = 150, mass = 0.8) =>
  f < start ? 0 : spring({frame: f - start, fps, config: {damping, stiffness, mass}});
const tw = (text: string, size: number, k = 0.5) => text.length * size * k;   // rough width of Oswald caps
const lightFill = (c: string) => [P.white, P.cream, P.paper, P.mustard, P.gold, P.tan].includes(c);
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
// Red rubber stamps from s.stamps = [{text, at, x?, y?}], kept inside the safe area: centred on x, or with their
// right edge at x, stacking upward from y.
const Stamps: React.FC<{s: any; T: TFn; x: number; y: number; maxW?: number; maxSize?: number; centre?: boolean}> = ({s, T, x, y, maxW = 860, maxSize = 56, centre}) => <>{(s.stamps || []).map((st: any, i: number) => {
  const text = String(st.text ?? ""), size = Math.max(32, fit(text, maxSize, maxW, 0.56)), sw = text.length * size * 0.55 + 70;
  return <Stamp key={i} x={st.x ?? (centre ? x : x - sw / 2)} y={st.y ?? y - i * 104} start={at(T, st.at)} text={text} size={size} rot={(i % 2 ? 1 : -1) * (sw > 600 ? 1.3 : 2.2)}/>;
})}</>;

// ---------- scale: a two-pan balance ----------
const S = {PX: 960, PY: 360, ARM: 440, MAXDEG: 10, PANW: 462, LINK: 28, BOARD: 62, WIN: 238, BW: 412, BH: 150, BASE: 808, DROP: 7};
// Beam angle (degrees, positive = right side down) for the weights now on the pans.
const DIAL = {s: Math.sin(29 * Math.PI / 180), c: Math.cos(29 * Math.PI / 180)};
const tiltOf = (wl: number, wr: number) => {
  const tot = wl + wr;
  if (tot <= 0) return 0;
  const d = (wr - wl) / tot;
  return Math.sign(d) * Math.pow(Math.abs(d), 0.6) * S.MAXDEG;
};
// One side: link, name board, chains, pan, and the weight that lands on it. Hangs straight down from the beam end.
const ScaleSide: React.FC<{d: any; ex: number; ey: number; sway: number; k: number; start: number; fill: string; lines: string[]; board: number}> = ({d, ex, ey, sway, k, start, fill, lines, board}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const hw = S.PANW / 2, top = S.LINK, panY = S.LINK + S.BOARD + S.WIN, win = S.WIN - (board - S.BOARD);
  const text = String(d?.text ?? ""), bare = !lines.length, bt = bare ? top + board - 22 : top;
  const ls = Math.min(lines.length > 1 ? 36 : 42, ...lines.map((l) => fit(l, 42, S.PANW - 30, 0.5)));
  const bw = S.BW * k, bh = S.BH * k, inset = Math.min(bw * 0.05, 16), kn = clamp(bw * 0.07, 9, 20), knob = kn * 1.5;
  const land = start + S.DROP, u = f - start, v = f - land;
  // the figure goes on the weight when it fits there at a readable size, otherwise on a tag tied above it
  const fsOn = Math.min(84, (bw - inset - 32) / Math.max(1, text.length * 0.5), bh / 1.5);
  const room = win - bh - knob - 30;
  const fsTag = Math.min(72, (S.PANW - 76) / Math.max(1, text.length * 0.5 + 0.9), room / 1.36);
  const onBlock = fsOn >= 54 || fsTag <= fsOn;
  const fs = onBlock ? fsOn : fsTag;
  const dp = clamp01(u / S.DROP), dropH = Math.max(20, win - bh - knob - 14);
  const yoff = -dropH * (1 - dp * dp), sc = 0.5 + 0.5 * clamp01((u + 1) / 4);
  const sq = v >= 0 ? 0.14 * Math.exp(-v / 3) * Math.cos(v) : 0;
  const tagAt = land + 2, te = spr(f, fps, tagAt), th = fs * 1.36, tgw = tw(text, fs) + fs * 0.9;
  const tagY = panY - bh - knob - 18 - th / 2, sh = Math.max(7, bh * 0.13);
  return (
    <g transform={`translate(${ex} ${ey}) rotate(${sway})`} strokeLinejoin="round">
      <line x1={0} y1={0} x2={0} y2={bt} stroke={P.ink} strokeWidth={8} strokeLinecap="round"/>
      {[-1, 1].map((q) => (
        <g key={q}>
          <line x1={q * (hw - 20)} y1={top + board} x2={q * (hw - 20)} y2={panY} stroke={P.ink} strokeWidth={8}/>
          <line x1={q * (hw - 20)} y1={top + board + 6} x2={q * (hw - 20)} y2={panY} stroke={P.gold} strokeWidth={3} strokeDasharray="10 9"/>
        </g>
      ))}
      <rect x={-hw} y={bt} width={S.PANW} height={top + board - bt} rx={8} fill={bare ? P.gold : P.white} stroke={P.ink} strokeWidth={5}/>
      {lines.map((l, j) => <Txt key={j} x={0} y={top + board / 2 + ls * (lines.length > 1 ? (j ? 0.98 : -0.16) : 0.36)} text={l} size={ls}/>)}
      <path d={`M ${-hw - 18} ${panY} H ${hw + 18} L ${hw - 18} ${panY + 26} H ${-hw + 18} Z`} fill={P.gold} stroke={P.ink} strokeWidth={5}/>
      <line x1={-hw - 4} y1={panY + 9} x2={hw + 4} y2={panY + 9} stroke={P.ink} strokeWidth={2.5} opacity={0.45}/>
      {d && k > 0 && u >= 0 ? (
        <g transform={`translate(0 ${panY - 2 + yoff}) scale(${sc * (1 + sq * 0.5)} ${sc * (1 - sq)})`}>
          <rect x={-kn * 0.45} y={-bh - kn * 0.8} width={kn * 0.9} height={kn} fill={fill} stroke={P.ink} strokeWidth={4}/>
          <rect x={-kn * 1.2} y={-bh - knob} width={kn * 2.4} height={kn * 0.8} rx={kn * 0.4} fill={fill} stroke={P.ink} strokeWidth={4}/>
          <path d={`M ${-bw / 2} 0 L ${-bw / 2 + inset} ${-bh} H ${bw / 2 - inset} L ${bw / 2} 0 Z`} fill={fill} stroke={P.ink} strokeWidth={5}/>
          <path d={`M ${-bw / 2 + 3} -2.5 L ${-bw / 2 + 3 + inset * sh / bh} ${-sh} H ${bw / 2 - 3 - inset * sh / bh} L ${bw / 2 - 3} -2.5 Z`} fill={P.shade} opacity={0.28}/>
          <path d={`M ${-bw / 2 + inset + 3} ${-bh + 2.5} H ${bw / 2 - inset - 3} l ${inset * 0.07} ${Math.max(5, bh * 0.07)} H ${-bw / 2 + inset + 3 - inset * 0.07} Z`} fill={P.white} opacity={0.22}/>
          {onBlock && text ? <Txt x={0} y={-bh / 2 + fs * 0.36} text={text} size={fs} color={lightFill(fill) ? P.ink : P.white}/> : null}
        </g>
      ) : null}
      {d && k > 0 && v >= 0 && v < 6 ? [-1, 1].map((q) => [0, 1, 2].map((j) => {
        const a = (-20 - j * 28) * Math.PI / 180, r0 = 14 + v * 5, r1 = r0 + 22 * (1 - v / 6);
        return <line key={`${q}${j}`} x1={q * (bw / 2 + Math.cos(a) * r0)} y1={panY - 6 + Math.sin(a) * r0} x2={q * (bw / 2 + Math.cos(a) * r1)} y2={panY - 6 + Math.sin(a) * r1} stroke={P.ink} strokeWidth={5} strokeLinecap="round"/>;
      })) : null}
      {d && k > 0 && !onBlock && text && f >= tagAt ? (
        <g transform={`translate(0 ${tagY + th / 2 + 14}) scale(${0.5 + 0.5 * te}) translate(0 ${-th / 2 - 14})`}>
          <path d={`M -15 ${th / 2 - 2} L 0 ${th / 2 + 15} L 15 ${th / 2 - 2} Z`} fill={P.white} stroke={P.ink} strokeWidth={4}/>
          <rect x={-tgw / 2} y={-th / 2} width={tgw} height={th} rx={9} fill={P.white} stroke={P.ink} strokeWidth={4} style={{filter: "url(#vshadow)"}}/>
          <path d={`M -12 ${th / 2 - 3} L 0 ${th / 2 + 11} L 12 ${th / 2 - 3} Z`} fill={P.white}/>
          <Txt x={0} y={fs * 0.36} text={text} size={fs}/>
        </g>
      ) : null}
    </g>
  );
};
const Scale: React.FC<SP> = ({s, n, T}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const sides: any[] = [s.left, s.right];
  const vals = sides.map((d) => Math.max(0, +d?.v || 0));
  const has = sides.map((d, i) => !!d && (vals[i] > 0 || d.text != null));
  const vmax = Math.max(vals[0], vals[1]) || 1;
  const starts = sides.map((d) => at(T, d?.at, -300));
  const lands = starts.map((t) => t + S.DROP);
  // the beam swings to a new balance each time a weight lands, with a spring
  const order = [0, 1].filter((i) => has[i]).sort((a, b) => lands[a] - lands[b]);
  let ang = 0, prev = 0; const on = [0, 0];
  order.forEach((i) => {
    on[i] = vals[i];
    const tgt = tiltOf(on[0], on[1]);
    ang += (tgt - prev) * spr(f, fps, lands[i], 8, 50, 1.5);
    prev = tgt;
  });
  const first = order.length ? lands[order[0]] : 1e9;
  ang += Math.sin(f / 12) * (1.3 - 0.75 * clamp01((f - first) / 24));       // an empty scale rocks; a loaded one still breathes
  const rad = ang * Math.PI / 180, dx = S.ARM * Math.cos(rad), dy = S.ARM * Math.sin(rad);
  const ends = [{x: S.PX - dx, y: S.PY - dy}, {x: S.PX + dx, y: S.PY + dy}];
  const sway = [0, 1].map((i) => {
    let a = 0.6 * Math.sin(f / 15 + i * 2.1);
    [0, 1].forEach((j) => { const w = f - lands[j]; if (has[j] && w >= 0) a += (i === j ? 2.4 : -1.5) * Math.exp(-w / 22) * Math.sin(w * 0.33); });
    return a;
  });
  const ks = vals.map((v, i) => (has[i] ? clamp(Math.sqrt(v / vmax), 0.24, 1) : 0));     // weight area in proportion to v
  const fills = sides.map((d, i) => (d?.red ? P.red : (d?.color && (P as any)[d.color]) || (i ? P.green : P.blue)));
  // a long name goes on two lines, and both boards grow to match
  const lines = sides.map((d) => {
    const l = String(d?.label ?? "");
    if (!l) return [];
    if (fit(l, 42, S.PANW - 30, 0.5) >= 32 || !l.includes(" ")) return [l];
    let cut = -1;
    for (let i = 0; i < l.length; i++) if (l[i] === " " && (cut < 0 || Math.abs(i - l.length / 2) < Math.abs(cut - l.length / 2))) cut = i;
    return [l.slice(0, cut), l.slice(cut + 1)];
  });
  const board = Math.max(lines[0].length, lines[1].length) > 1 ? 94 : S.BOARD;
  const rt = s.result?.text ? String(s.result.text) : "";
  const light = prev < -0.5 ? 1 : 0;                                       // the side that ends up higher has room under it
  const panBot = S.PY - Math.abs(Math.sin(prev * Math.PI / 180)) * S.ARM + S.LINK + S.BOARD + S.WIN + 36, room = 826 - panBot;
  return (
    <IStage n={n}>
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      {/* stand */}
      <g strokeLinejoin="round">
        <rect x={S.PX - 19} y={S.PY} width={38} height={S.BASE - 50 - S.PY} fill={P.gold} stroke={P.ink} strokeWidth={5}/>
        <path d={`M ${S.PX - 118} ${S.BASE - 16} L ${S.PX - 62} ${S.BASE - 52} H ${S.PX + 62} L ${S.PX + 118} ${S.BASE - 16} Z`} fill={P.gold} stroke={P.ink} strokeWidth={5}/>
        <rect x={S.PX - 170} y={S.BASE - 18} width={340} height={18} rx={6} fill={P.mustard} stroke={P.ink} strokeWidth={5}/>
        <path d={`M ${S.PX - DIAL.s * 132} ${S.PY + DIAL.c * 132} A 132 132 0 0 0 ${S.PX + DIAL.s * 132} ${S.PY + DIAL.c * 132} L ${S.PX + DIAL.s * 66} ${S.PY + DIAL.c * 66} A 66 66 0 0 1 ${S.PX - DIAL.s * 66} ${S.PY + DIAL.c * 66} Z`} fill={P.white} stroke={P.ink} strokeWidth={5}/>
        {[-20, -10, 0, 10, 20].map((a) => {
          const r = a * Math.PI / 180;
          return <line key={a} x1={S.PX + Math.sin(r) * (a ? 108 : 100)} y1={S.PY + Math.cos(r) * (a ? 108 : 100)} x2={S.PX + Math.sin(r) * 122} y2={S.PY + Math.cos(r) * 122} stroke={a ? P.ink : P.red} strokeWidth={a ? 4 : 6} strokeLinecap="round"/>;
        })}
      </g>
      {[0, 1].map((i) => <ScaleSide key={i} d={sides[i]} ex={ends[i].x} ey={ends[i].y} sway={sway[i]} k={ks[i]} start={starts[i]} fill={fills[i]} lines={lines[i]} board={board}/>)}
      {/* beam, needle, pivot */}
      <g transform={`translate(${S.PX} ${S.PY}) rotate(${ang})`} strokeLinejoin="round">
        <path d="M -9 8 L 0 116 L 9 8 Z" fill={P.ink} stroke={P.ink} strokeWidth={3}/>
        <rect x={-S.ARM - 24} y={-14} width={S.ARM * 2 + 48} height={28} rx={14} fill={P.gold} stroke={P.ink} strokeWidth={5}/>
        <circle cx={-S.ARM} cy={0} r={6} fill={P.ink}/><circle cx={S.ARM} cy={0} r={6} fill={P.ink}/>
      </g>
      <circle cx={S.PX} cy={S.PY} r={21} fill={P.ink}/><circle cx={S.PX} cy={S.PY} r={8} fill={P.gold}/>
      {rt ? <Chip x={S.PX} y={868} start={at(T, s.result.at)} text={rt} size={Math.max(32, fit(rt, 48, 1500))} fill={P.red} color={P.white} rot={-1}/> : null}
      {rt ? <Stamps s={s} T={T} x={S.PX + (light ? 1 : -1) * S.ARM} y={panBot + room / 2} maxW={430} maxSize={clamp(room / 1.7, 32, 56)} centre/> : <Stamps s={s} T={T} x={S.PX} y={864} centre/>}
    </IStage>
  );
};

// ---------- calendar: a festival that moved ----------
const CAL = {X0: 122, X1: 1812, TOP: 270, HEAD: 62, GY: 344, PAD: 12, GBOT: 708, DROP: 8, LEAP: 18};
// A diya: a small clay bowl of oil with a flame. Origin at the bottom centre of the bowl; `size` is its width.
const Diya: React.FC<{x: number; y: number; size: number; rot?: number; lean?: number; sq?: number}> = ({x, y, size, rot = 0, lean = 0, sq = 0}) => {
  const f = useCurrentFrame();
  const fl = 1 + 0.13 * Math.sin(f * 0.83) + 0.07 * Math.sin(f * 2.1 + 1), fr = 7 * Math.sin(f * 0.47) + 3 * Math.sin(f * 1.7) + lean;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${(size / 100) * (1 + sq * 0.5)} ${(size / 100) * (1 - sq)})`} strokeLinejoin="round" strokeLinecap="round">
      <circle cx={0} cy={-64} r={38 + 4 * Math.sin(f * 0.6)} fill={P.gold} opacity={0.32}/>
      <path d="M -50 -30 Q -46 0 -16 0 H 16 Q 46 0 50 -30 Z" fill={CLAY} stroke={P.ink} strokeWidth={4.5}/>
      <ellipse cx={0} cy={-30} rx={50} ry={8} fill={CLAY_DK} stroke={P.ink} strokeWidth={4.5}/>
      {[-28, -14, 0, 14, 28].map((dx) => <circle key={dx} cx={dx} cy={-10 - Math.abs(dx) * 0.1} r={3.2} fill={P.cream}/>)}
      <g transform={`translate(0 -32) rotate(${fr}) scale(${2 - fl} ${fl})`}>
        <path d="M 0 -62 C 16 -40 20 -18 0 0 C -20 -18 -16 -40 0 -62 Z" fill={P.red} stroke={P.ink} strokeWidth={4.5}/>
        <path d="M 0 -34 C 8 -22 9 -11 0 -4 C -9 -11 -8 -22 0 -34 Z" fill={P.gold}/>
      </g>
    </g>
  );
};
const twoChipSize = (label: string, text: string) => ({wl: label ? tw(label, 32) + 30 : 0, wt: text ? tw(text, 44) + 38 : 0, h: 62});
// A chip in two parts: a small label on ink, then the value.
const TwoChip: React.FC<{x: number; y: number; start: number; label: string; text: string; red?: boolean; rot?: number}> = ({x, y, start, label, text, red, rot = 0}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  if (f < start) return null;
  const e = spr(f, fps, start), {wl, wt, h} = twoChipSize(label, text), w = wl + wt, r = 8;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${0.55 + 0.45 * e})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={r} fill={red ? P.red : P.white} stroke={P.ink} strokeWidth={4} style={{filter: "url(#vshadow)"}}/>
      {wl ? <path d={`M ${-w / 2 + wl} ${-h / 2} V ${h / 2} H ${-w / 2 + r} Q ${-w / 2} ${h / 2} ${-w / 2} ${h / 2 - r} V ${-h / 2 + r} Q ${-w / 2} ${-h / 2} ${-w / 2 + r} ${-h / 2} Z`} fill={P.ink}/> : null}
      {wl ? <Txt x={-w / 2 + wl / 2} y={12} text={label} size={32} color={P.white}/> : null}
      {wt ? <Txt x={-w / 2 + wl + wt / 2} y={16} text={text} size={44} color={red ? P.white : P.ink}/> : null}
    </g>
  );
};
const Calendar: React.FC<SP> = ({s, n, T}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const names: any[] = s.months || [], dayN: any[] = s.days || [];
  const k = Math.max(names.length, dayN.length);
  const days = Array.from({length: k}, (_, m) => clamp(Math.round(+dayN[m] || 30), 1, 42));
  const cum = days.map((_, m) => days.slice(0, m).reduce((a, b) => a + b, 0));
  const rows = Math.max(1, ...days.map((d) => Math.ceil(d / 7)));
  const rh = Math.min(74, (CAL.GBOT - CAL.GY) / rows);
  const gap = k === 2 ? 110 : 56, pw = Math.min(880, (CAL.X1 - CAL.X0 - (k - 1) * gap) / Math.max(1, k));
  const px0 = (CAL.X0 + CAL.X1) / 2 - (k * pw + (k - 1) * gap) / 2;
  const pageX = (m: number) => px0 + m * (pw + gap);
  const cw = (pw - 2 * CAL.PAD) / 7, pageBot = CAL.GY + rows * rh + CAL.PAD, ds = Math.min(34, cw * 0.42);
  const cell = (m: number, d: number) => {
    const c = (d - 1) % 7, r = Math.floor((d - 1) / 7);
    return {x: pageX(m) + CAL.PAD + c * cw, y: CAL.GY + r * rh, c, r};
  };
  const ok = (o: any) => !!o && o.month >= 0 && o.month < k && o.day >= 1 && o.day <= days[o.month];
  const marks: any[] = (s.marks || []).filter(ok);
  const ts = marks.map((m) => at(T, m.at));
  // when the lamp lands on each mark: it drops on the first, then leaps from each one to the next
  const takeoff: number[] = [], land: number[] = [];
  marks.forEach((_, j) => {
    takeoff[j] = j ? Math.max(land[j - 1] + 6, ts[j] - 6) : ts[0];
    land[j] = takeoff[j] + (j ? CAL.LEAP : CAL.DROP);
  });
  const abs = marks.map((m) => cum[m.month] + m.day - 1);
  // a "today" square ticks through the days and reaches each mark just before the lamp does
  const keys: [number, number][] = [];
  if (marks.length) {
    if (ts[0] > 16) keys.push([8, Math.max(0, abs[0] - Math.floor((ts[0] - 8) / 4))]);
    keys.push([Math.max(ts[0], keys.length ? 9 : 0), abs[0]]);
    for (let j = 1; j < marks.length; j++) {
      keys.push([Math.max(land[j - 1] + 5, keys[keys.length - 1][0] + 1), abs[j - 1]]);
      keys.push([Math.max(takeoff[j] + 4, keys[keys.length - 1][0] + 1), abs[j]]);
    }
  }
  let cur = -1, from = -1;
  if (keys.length) {
    from = keys[0][1];
    let v = keys[0][1];
    for (let i = 1; i < keys.length; i++) if (f >= keys[i - 1][0]) v = lerp(keys[i - 1][1], keys[i][1], clamp01((f - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])));
    cur = Math.round(v);
  }
  // the lamp: where it is now
  const lampSize = Math.min(cw * 1.08, rh * 1.6), lampH = lampSize * 0.96;
  const seat = (j: number) => { const c = cell(marks[j].month, marks[j].day); return {x: c.x + cw / 2, y: c.y + rh - 5}; };
  const leap = (j: number) => {         // the arc from mark j - 1 to mark j
    const a = seat(j - 1), b = seat(j);
    const peak = Math.max(CAL.TOP + lampH + 6, Math.min(a.y, b.y) - 170), arc = Math.max(70, (a.y + b.y) / 2 - peak);
    return {a, b, dir: b.x >= a.x ? 1 : -1, at: (p: number) => ({x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p) - arc * 4 * p * (1 - p)})};
  };
  let lamp: React.ReactNode = null;
  let jn = -1;
  marks.forEach((_, j) => { if (f >= takeoff[j]) jn = j; });
  if (jn === 0) {
    const a = seat(0), u = f - takeoff[0], dp = clamp01(u / CAL.DROP), v = f - land[0];
    const hop = v >= 0 ? -Math.abs(Math.sin(v * 0.55)) * 16 * Math.exp(-v / 5) : 0;
    const sq = v >= 0 ? 0.22 * Math.exp(-v / 2.6) * Math.cos(v * 0.9) : 0;
    lamp = <Diya x={a.x} y={a.y - 230 * (1 - dp * dp) + hop} size={lampSize * (0.6 + 0.4 * clamp01((u + 1) / 4))} sq={sq}/>;
  } else if (jn > 0) {
    const L = leap(jn), p = prog(f, takeoff[jn], CAL.LEAP, Easing.inOut(Easing.quad)), v = f - land[jn], q = L.at(p);
    const hop = v >= 0 ? -Math.abs(Math.sin(v * 0.55)) * 14 * Math.exp(-v / 5) : 0;
    const sq = v >= 0 ? 0.22 * Math.exp(-v / 2.6) * Math.cos(v * 0.9) : 0;
    lamp = <Diya x={q.x} y={q.y + hop} size={lampSize * (1 + 0.2 * Math.sin(p * Math.PI))}
      rot={L.dir * 12 * Math.sin(p * Math.PI * 2)} lean={-L.dir * 32 * Math.sin(p * Math.PI)} sq={sq}/>;
  }
  // where each mark's chip goes: beside its cell when there is room on the page, otherwise under or over it
  const hit = (a: number[], b: number[]) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
  const line = ok(s.line) ? s.line : null;
  const avoid: number[][] = marks.map((m) => { const c = cell(m.month, m.day); return [c.x - 6, c.y + rh - lampH - 10, c.x + cw + 6, c.y + rh]; });
  if (line) { const c = cell(line.month, line.day); avoid.push([c.x, c.y, c.x + cw, c.y + rh]); }
  const chipAt = marks.map((m, j) => {
    const c = cell(m.month, m.day), {wl, wt, h} = twoChipSize(String(m.label ?? ""), String(m.text ?? "")), w = wl + wt;
    const lo = pageX(m.month) + 8, hi = pageX(m.month) + pw - 8, mid = clamp(c.x + cw / 2, lo + w / 2, hi - w / 2);
    const right = {x: c.x + cw + 12 + w / 2, y: c.y + rh / 2, fits: c.x + cw + 12 + w <= hi};
    const left = {x: c.x - 12 - w / 2, y: c.y + rh / 2, fits: c.x - 12 - w >= lo};
    const below = {x: mid, y: c.y + rh + 8 + h / 2, fits: c.y + rh + 8 + h <= pageBot + 24};
    const above = {x: mid, y: c.y + rh - lampH - 18 - h / 2, fits: c.y + rh - lampH - 18 - h >= CAL.TOP + 8};
    const fromRight = j > 0 && leap(j).dir < 0;                // the lamp flies in from that side, so the chip goes on the other
    const cands = (fromRight ? [left, below, above, right] : j > 0 ? [right, below, above, left] : [right, left, below, above]).filter((q) => q.fits);
    const rect = (q: {x: number; y: number}) => [q.x - w / 2, q.y - h / 2, q.x + w / 2, q.y + h / 2];
    const free = cands.find((q) => !avoid.some((a, i) => i !== j && hit(rect(q), a)));
    return free || cands[0] || {x: mid, y: c.y + rh + 8 + h / 2};
  });
  // the red line: a wall in the gutter after a month's last day, a stepped fence after any other day
  let wall: React.ReactNode = null;
  if (line) {
    const lt = at(T, line.at), c = cell(line.month, line.day), p = prog(f, lt, 10);
    const monthEnd = line.day >= days[line.month];
    const gx = monthEnd ? (line.month < k - 1 ? pageX(line.month) + pw + gap / 2 : pageX(line.month) + pw - 4) : 0;
    const gl = pageX(line.month) + CAL.PAD - 4, gr = pageX(line.month) + pw - CAL.PAD + 4;
    const d = monthEnd ? `M ${gx} ${CAL.TOP - 4} V ${pageBot + 22}`
      : c.c === 6 ? `M ${gr} ${c.y + rh} H ${gl}` : `M ${gr} ${c.y} H ${c.x + cw} V ${c.y + rh} H ${gl}`;
    const lx = String(line.text ?? ""), lsz = Math.max(32, fit(lx, 38, 760)), lw = tw(lx, lsz, 0.52) + lsz * 0.9;
    const cx = clamp(monthEnd ? gx : pageX(line.month) + pw / 2, CAL.X0 + lw / 2, CAL.X1 - lw / 2);
    wall = f >= lt ? (
      <g>
        <rect x={c.x + 3} y={c.y + 3} width={cw - 6} height={rh - 6} rx={6} fill="none" stroke={P.red} strokeWidth={7}/>
        <path d={d} fill="none" stroke={P.red} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p}/>
        {lx ? <Chip x={cx} y={pageBot + 50} start={lt + 8} text={lx} size={lsz}/> : null}
      </g>
    ) : null;
  }
  const res = s.result?.text ? String(s.result.text) : "";
  const rsz = res ? Math.max(32, fit(res, 52, 880, 0.56)) : 0, rw = tw(res, rsz, 0.55) + 70;
  return (
    <IStage n={n}>
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      {days.map((dn, m) => {
        const x = pageX(m), e = spr(f, fps, m * 3, 14, 200, 0.7), nm = String(names[m] ?? "");
        return (
          <g key={m} transform={`translate(0 ${(1 - e) * 70})`} strokeLinejoin="round">
            <rect x={x + 9} y={CAL.TOP + 11} width={pw} height={pageBot - CAL.TOP} rx={10} fill={P.shade} opacity={0.28}/>
            <rect x={x} y={CAL.TOP} width={pw} height={pageBot - CAL.TOP} rx={10} fill={P.white} stroke={P.ink} strokeWidth={5}/>
            <path d={`M ${x} ${CAL.TOP + CAL.HEAD} V ${CAL.TOP + 10} Q ${x} ${CAL.TOP} ${x + 10} ${CAL.TOP} H ${x + pw - 10} Q ${x + pw} ${CAL.TOP} ${x + pw} ${CAL.TOP + 10} V ${CAL.TOP + CAL.HEAD} Z`} fill={P.ink} stroke={P.ink} strokeWidth={5}/>
            {nm ? <Txt x={x + pw / 2} y={CAL.TOP + CAL.HEAD / 2 + 17} text={nm} size={Math.max(30, fit(nm, 46, pw - 220, 0.5))} color={P.white}/> : null}
            {[0.16, 0.84].map((q) => <rect key={q} x={x + pw * q - 9} y={CAL.TOP - 9} width={18} height={30} rx={9} fill={P.gray} stroke={P.ink} strokeWidth={4}/>)}
            {Array.from({length: dn}, (_, i) => {
              const c = cell(m, i + 1), a = cum[m] + i, now = a === cur, past = cur >= 0 && a >= from && a < cur;
              const cut = !!line && f >= at(T, line.at) && line.month === m && line.day === i + 1;
              return (
                <g key={i}>
                  <rect x={c.x + 3} y={c.y + 3} width={cw - 6} height={rh - 6} rx={6} fill={now ? P.mustard : past ? P.paper : P.cream} stroke={P.ink} strokeWidth={now ? 4 : 2} strokeOpacity={now ? 1 : 0.3}/>
                  <g opacity={past && !cut ? 0.5 : 1}><Txt x={c.x + ds * 0.38} y={c.y + 6 + ds} text={String(i + 1)} size={ds} anchor="start" color={cut ? P.red : P.ink}/></g>
                </g>
              );
            })}
          </g>
        );
      })}
      {/* a ring stays round each date the lamp has left */}
      {marks.map((m, j) => {
        if (j >= marks.length - 1 || f < takeoff[j + 1]) return null;
        const c = cell(m.month, m.day), p = prog(f, takeoff[j + 1], 9);
        return <ellipse key={j} cx={c.x + cw / 2} cy={c.y + rh / 2} rx={cw * 0.6} ry={rh * 0.64} fill="none" stroke={P.ink} strokeWidth={6} strokeLinecap="round"
          pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} transform={`rotate(-6 ${c.x + cw / 2} ${c.y + rh / 2})`}/>;
      })}
      {wall}
      {marks.map((_, j) => {
        if (!j || f < takeoff[j]) return null;
        const L = leap(j), p = prog(f, takeoff[j], CAL.LEAP, Easing.inOut(Easing.quad));
        // from the top of the date it left to just above the flame where it landed
        const p0 = {x: L.a.x + L.dir * cw * 0.3, y: L.a.y - rh - 4}, p3 = {x: L.b.x - L.dir * lampSize * 0.52, y: L.b.y - lampH * 0.82};
        const cx = p3.x - p0.x, cy = p3.y - p0.y, len = Math.hypot(cx, cy);
        if (len < cw * 1.6) return null;                       // next door: the ring and the lamp say it already
        const up = cx * L.dir >= 0 ? -L.dir : L.dir, nx = -cy / len * up, ny = cx / len * up, h = clamp(len * 0.38, 50, 210);   // bulge upward
        const c1 = {x: p0.x + cx * 0.15 + nx * h, y: Math.max(CAL.TOP + 6, p0.y + cy * 0.15 + ny * h)};
        const c2 = {x: p0.x + cx * 0.88 + nx * h, y: Math.max(CAL.TOP + 6, p0.y + cy * 0.88 + ny * h)};
        const bez = (u: number) => {
          const v = 1 - u, a = v * v * v, b = 3 * v * v * u, c = 3 * v * u * u, e = u * u * u;
          return {x: a * p0.x + b * c1.x + c * c2.x + e * p3.x, y: a * p0.y + b * c1.y + c * c2.y + e * p3.y};
        };
        const d = Array.from({length: 31}, (_, i) => bez(p * i / 30)).map((q, i) => `${i ? "L" : "M"} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" ");
        const ang = Math.atan2(p3.y - c2.y, p3.x - c2.x) * 180 / Math.PI;
        return (
          <g key={j} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={d} stroke={P.white} strokeWidth={13} strokeDasharray="20 18"/>
            <path d={d} stroke={P.ink} strokeWidth={6} strokeDasharray="20 18"/>
            {p >= 1 ? <path d="M 6 0 L -24 -16 L -24 16 Z" fill={P.ink} stroke={P.white} strokeWidth={4} transform={`translate(${p3.x} ${p3.y}) rotate(${ang})`}/> : null}
          </g>
        );
      })}
      {marks.map((m, j) => <TwoChip key={j} x={chipAt[j].x} y={chipAt[j].y} start={land[j]} label={String(m.label ?? "")} text={String(m.text ?? "")} red={!!m.red} rot={j % 2 ? 1.5 : -1.5}/>)}
      {lamp}
      {res ? <Stamp x={CAL.X1 - rw / 2 - 8} y={850} start={at(T, s.result.at)} text={res} size={rsz} rot={-2}/> : null}
      {res ? <Stamps s={s} T={T} x={540} y={850} maxW={700} centre/> : <Stamps s={s} T={T} x={CAL.X1 - 8} y={850}/>}
    </IStage>
  );
};

// ---------- race: companies as runners ----------
const R = {X0: 120, X1: 1812, TOP: 274, BOT: 912};
const RaceLane: React.FC<{l: any; i: number; y: number; lh: number; plateW: number; x0: number; x1: number; xEnd: number; xCap: number; start: number; numSize: number}> =
  ({l, i, y, lh, plateW, x0, x1, xEnd, xCap, start, numSize}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const u = lh / 120, hi = !!l.hi, name = String(l.name ?? ""), sub = String(l.sub ?? ""), text = String(l.text ?? "");
  const sp = (ff: number) => spr(ff, fps, start, 10, 50, 1);            // reaches the mark in about 14 frames, overshoots a little, settles
  const run = (ff: number) => Math.min(xCap, x0 + (x1 - x0) * sp(ff));
  const vel = run(f) - run(f - 1), acc = vel - (run(f - 1) - run(f - 2));
  const going = f >= start, moving = Math.abs(vel) > 1.2;
  // waiting at the line it hops now and then; once it has arrived it rocks to and fro on its wheels
  const hp = (f + i * 13) % 46, hop = !going && hp < 9 ? -Math.sin(hp / 9 * Math.PI) * 10 * u : 0;
  const rock = going ? Math.sin((f - start) / 9 + i) * 5 * u * clamp01((f - start - 34) / 16) : 0;
  const x = run(f) + rock, chipW = tw(text, numSize, 0.5) + numSize * 0.8;
  const bob = hop + (going && !moving ? Math.sin(f / 7 + i * 1.3) * 1.4 * u : 0);
  const tilt = clamp(-acc * 0.9, -6, 6) + (!going && hp < 9 ? Math.sin(hp / 9 * Math.PI * 2) * -3 : 0);
  const cy = y + 50.6 * u, wr = 12 * u, wy = 50 * u, turn = ((x - x0) / wr) * 180 / Math.PI;
  const ns = Math.max(28 * Math.min(1, u * 1.1), fit(name, 44 * u, plateW - 44, 0.5)), ss = sub ? clamp(fit(sub, 31 * u, plateW - 40, 0.47), 22, 32) : 0;
  const q = lh / 10, xs = R.X0 + plateW;
  const ch = numSize * 1.3, e = spr(f, fps, start), shown = f - start >= 14 ? text : tickText(text, clamp01(sp(f)));   // the number keeps pace with the shop
  return (
    <g strokeLinejoin="round">
      <rect x={R.X0} y={y} width={R.X1 - R.X0} height={lh} rx={10} fill={hi ? P.mustard : P.paper} stroke={P.ink} strokeWidth={4.5}/>
      {/* distance marks along the lane */}
      {Array.from({length: 21}, (_, j) => <rect key={j} x={x0 - 50 * u + (xEnd - x0) * j / 20 - 1.5} y={y + lh - (j % 2 ? 13 : 19) * u} width={3} height={(j % 2 ? 8 : 14) * u} fill={P.ink} opacity={0.4}/>)}
      {/* start line */}
      {Array.from({length: 20}, (_, j) => (j % 2 === Math.floor(j / 2) % 2 ? <rect key={j} x={xs + 12 + (j % 2) * q} y={y + Math.floor(j / 2) * q} width={q} height={q} fill={P.ink}/> : null))}
      <rect x={xs + 12} y={y} width={2 * q} height={lh} fill="none" stroke={P.ink} strokeWidth={3}/>
      {/* name plate */}
      <path d={`M ${xs} ${y} V ${y + lh} H ${R.X0 + 10} Q ${R.X0} ${y + lh} ${R.X0} ${y + lh - 10} V ${y + 10} Q ${R.X0} ${y} ${R.X0 + 10} ${y} Z`} fill={hi ? P.red : P.ink} stroke={P.ink} strokeWidth={4.5}/>
      {name ? <Txt x={R.X0 + 24} y={y + (sub ? lh * 0.45 : lh / 2 + ns * 0.36)} text={name} size={ns} anchor="start" color={P.white}/> : null}
      {sub ? <Txt x={R.X0 + 24} y={y + lh * 0.45 + ss * 1.25} text={sub} size={ss} anchor="start" color={hi ? P.white : P.mustard}/> : null}
      {/* dust and puffs */}
      {moving ? [0, 1, 2].map((j) => {
        const r = (12 - j * 3) * u * clamp(Math.abs(vel) / 16, 0.3, 1.25);
        return <circle key={j} cx={x - Math.sign(vel) * (58 + j * 24 + ((f * 7 + j * 5) % 9)) * u} cy={y + 112 * u - r - ((f + j) % 3) * 2} r={r} fill={P.white} stroke={P.ink} strokeWidth={3}/>;
      }) : null}
      {moving && vel > 9 ? [0, 1].map((j) => {
        const lx = x - (76 + j * 26) * u, lx2 = Math.max(xs + 12 + 2 * q + 8, lx - Math.min(90, vel * 3));
        return lx - lx2 > 12 ? <line key={j} x1={lx} y1={y + (32 + j * 24) * u} x2={lx2} y2={y + (32 + j * 24) * u} stroke={P.ink} strokeWidth={4} strokeLinecap="round"/> : null;
      }) : null}
      {/* the shop on wheels */}
      <g transform={`translate(${x} ${cy + bob}) rotate(${tilt})`}>
        <rect x={-42 * u} y={37 * u} width={84 * u} height={10 * u} rx={3} fill={P.ink}/>
        {[-25, 25].map((wx) => (
          <g key={wx} transform={`translate(${wx * u} ${wy * u}) rotate(${turn})`}>
            <circle r={wr} fill={P.ink}/><circle r={wr * 0.42} fill={P.white}/>
            <line x1={-wr * 0.8} y1={0} x2={wr * 0.8} y2={0} stroke={P.white} strokeWidth={2.5}/><line x1={0} y1={-wr * 0.8} x2={0} y2={wr * 0.8} stroke={P.white} strokeWidth={2.5}/>
          </g>
        ))}
        <StoreIcon size={94 * u} accent={hi ? P.red : P.blue}/>
      </g>
      {/* its number, riding at the nose */}
      {going && text ? (
        <g transform={`translate(${x + 53 * u + 12 + chipW / 2} ${y + lh / 2}) scale(${0.5 + 0.5 * e})`}>
          <rect x={-chipW / 2} y={-ch / 2} width={chipW} height={ch} rx={9} fill={P.white} stroke={P.ink} strokeWidth={4} style={{filter: "url(#vshadow)"}}/>
          <Txt x={0} y={numSize * 0.36} text={shown} size={numSize} color={hi ? P.red : P.ink}/>
        </g>
      ) : null}
    </g>
  );
};
const Race: React.FC<SP> = ({s, n, T}) => {
  const lanes: any[] = s.lanes || [], k = lanes.length;
  const gap = k > 6 ? 7 : 10;
  const bot = (s.stamps || []).length ? R.BOT - 112 : R.BOT;                  // stamps get a strip of their own under the lanes
  const lh = Math.min(128, (bot - R.TOP - (k - 1) * gap) / Math.max(1, k)), u = lh / 120;
  const y0 = R.TOP + (bot - R.TOP - (k * lh + (k - 1) * gap)) / 2;
  const vs = lanes.map((l) => +l.v || 0);
  const vmax = +s.max > 0 ? +s.max : Math.max(1e-9, ...vs) * 1.05;
  const plateW = clamp(Math.max(0, ...lanes.map((l) => Math.max(tw(String(l.name ?? ""), 44 * u, 0.5), tw(String(l.sub ?? ""), 31 * u, 0.47)))) + 50, 220, 430);
  const numSize = clamp(72 * u, 44, 76);
  const chipW = Math.max(0, ...lanes.map((l) => tw(String(l.text ?? ""), numSize, 0.5))) + numSize * 0.8;
  const q = lh / 10, half = 50 * u;
  const x0 = R.X0 + plateW + 12 + 2 * q + 12 + half;
  const xCap = R.X1 - 16 - chipW - 12 - 53 * u, xEnd = x0 + (xCap - x0) * 0.955;
  return (
    <IStage n={n}>
      <IHeading text={s.heading}/>
      <INote text={s.note}/>
      {lanes.map((l, i) => <RaceLane key={i} l={l} i={i} y={y0 + i * (lh + gap)} lh={lh} plateW={plateW} x0={x0} x1={x0 + (xEnd - x0) * clamp(vs[i] / vmax, -0.02, 1)}
        xEnd={xEnd} xCap={xCap} start={at(T, l.at)} numSize={numSize}/>)}
      <Stamps s={s} T={T} x={R.X1 - 6} y={860}/>
    </IStage>
  );
};

export const SCENES_COMPARE: Record<string, React.FC<SP>> = {scale: Scale, calendar: Calendar, race: Race};
